# ENV-SETUP.md — Google Drive + Deploy
**Agente:** @devops-daniel (AIOS DevOps)
**Status:** Pronto para configurar Vercel
**Data:** 2026-06-14

---

## 1. Estratégia de autenticação Google Drive

**Decisão:** Service Account com chave JSON, sem domain-wide delegation. A pasta destino é compartilhada explicitamente com o e-mail da SA.

**Por quê?** OAuth2 server-side com refresh token exige UX de consentimento e renovação manual. SA é silenciosa, auditável, e a pasta única do Movimento simplifica permissão.

## 2. Variáveis de ambiente

Adicionar ao `.env.example`:

```bash
# Google Drive (Service Account)
GOOGLE_DRIVE_SA_EMAIL=movimento-uploader@verificapix.iam.gserviceaccount.com
GOOGLE_DRIVE_SA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_MOVEMENT_FOLDER_ID=
GOOGLE_DRIVE_SHARED_DRIVE_ID=         # opcional, se a pasta estiver em Shared Drive

# Rate limiting (Upstash opcional, fallback in-memory)
RATE_LIMIT_UPLOAD_PER_MIN=10
```

**Atenção** na private key: usar `\n` literal em ambiente de produção (Vercel) e fazer `replace(/\\n/g, "\n")` no código.

## 3. Criação da Service Account (passo a passo)

1. Console GCP → IAM & Admin → Service Accounts → Create
2. Nome: `movimento-uploader`
3. Permissão: nenhuma a nível de projeto (a pasta gerencia)
4. Criar chave JSON, baixar
5. Habilitar a API: Console → APIs & Services → Library → "Google Drive API" → Enable
6. Drive: criar pasta `Movimento - Receita Certa/` (Meu Drive ou Shared Drive)
7. Botão "Compartilhar" → adicionar e-mail da SA com papel **Editor**
8. Copiar `Folder ID` (final da URL após `/folders/`) para `GOOGLE_DRIVE_MOVEMENT_FOLDER_ID`

## 4. Vercel — configuração

```bash
# CLI (assumindo logado e linkado)
vercel env add GOOGLE_DRIVE_SA_EMAIL production
vercel env add GOOGLE_DRIVE_SA_PRIVATE_KEY production
vercel env add GOOGLE_DRIVE_MOVEMENT_FOLDER_ID production
vercel env add RATE_LIMIT_UPLOAD_PER_MIN production
# Repetir para preview e development
```

**Importante:** `GOOGLE_DRIVE_SA_PRIVATE_KEY` deve ser colada como string única com `\n` escapado.

## 5. Cliente Google Drive — `src/lib/google-drive.ts`

```ts
import { google } from "googleapis";
import { Readable } from "node:stream";

function getDriveClient() {
  const email = process.env.GOOGLE_DRIVE_SA_EMAIL;
  const key = process.env.GOOGLE_DRIVE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("Google Drive Service Account não configurada.");
  const auth = new google.auth.JWT({
    email, key, scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  return google.drive({ version: "v3", auth });
}

function getFolderId() {
  const id = process.env.GOOGLE_DRIVE_MOVEMENT_FOLDER_ID;
  if (!id) throw new Error("GOOGLE_DRIVE_MOVEMENT_FOLDER_ID não definido.");
  return id;
}

type UploadInput = {
  name: string;
  mimeType: string;
  bytes: Buffer;
  properties?: Record<string, string>;
};

export async function uploadToMovementFolder(input: UploadInput) {
  const drive = getDriveClient();
  const folderId = getFolderId();
  const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || undefined;

  const res = await drive.files.create({
    requestBody: {
      name: input.name,
      parents: [folderId],
      properties: input.properties,
    },
    media: { mimeType: input.mimeType, body: Readable.from(input.bytes) },
    fields: "id, webViewLink, webContentLink, mimeType, size",
    supportsAllDrives: Boolean(sharedDriveId),
  });

  const file = res.data;
  if (!file.id || !file.webViewLink) throw new Error("Drive não retornou identificadores.");
  return { id: file.id, webViewLink: file.webViewLink };
}

export async function ensureMovementFolder(): Promise<{ ok: boolean; folderId: string; name: string }> {
  const drive = getDriveClient();
  const folderId = getFolderId();
  const res = await drive.files.get({
    fileId: folderId,
    fields: "id, name, mimeType",
    supportsAllDrives: true,
  });
  if (res.data.mimeType !== "application/vnd.google-apps.folder") {
    throw new Error("Folder ID não é uma pasta.");
  }
  return { ok: true, folderId, name: res.data.name ?? "Movimento" };
}

export async function trashDriveFile(fileId: string) {
  const drive = getDriveClient();
  await drive.files.update({
    fileId,
    requestBody: { trashed: true },
    supportsAllDrives: true,
  });
}
```

## 6. Instalação de dependência

```bash
cd /Users/niltonjunior/verificapix-mission/painel
npm install googleapis
```

`googleapis` é pesado (~30 MB); usar **edge runtime NÃO**. Manter route como Node.js runtime (default na app router para route handlers com Buffer).

## 7. Rate limiting (proteção contra abuso de upload)

`src/lib/rate-limit.ts`:

```ts
const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = Number(process.env.RATE_LIMIT_UPLOAD_PER_MIN ?? 10);

export function checkRateLimit(key: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true, remaining: LIMIT - 1 };
  }
  bucket.count += 1;
  return { ok: bucket.count <= LIMIT, remaining: Math.max(0, LIMIT - bucket.count) };
}
```

Usar em `POST /api/movement/documents`:

```ts
const limit = checkRateLimit(`upload:${session.id}`);
if (!limit.ok) return NextResponse.json({ error: "Muitos uploads. Aguarde 1 minuto." }, { status: 429 });
```

**Nota:** in-memory funciona em instância única. Vercel Hobby reusa funções por curto período. Para produção séria, migrar a Upstash Redis com a mesma interface.

## 8. CORS

Não necessário: API routes consumidas pelo próprio domínio (Next.js). Bloquear se chegar `Origin` cross-site:

```ts
const origin = request.headers.get("origin");
const host = request.headers.get("host");
if (origin && !origin.includes(host ?? "")) {
  return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
}
```

## 9. Observabilidade

- Logar erros de Drive com `console.error("[drive]", err)` (Vercel captura)
- Não logar bytes do arquivo nem nome em PII

## 10. Vercel build (sem ajuste extra)

`next.config.ts` já comporta o cenário. Verificar que `serverExternalPackages` inclui `googleapis` se aparecer warning:

```ts
const nextConfig = {
  serverExternalPackages: ["googleapis"],
};
```

## 11. Healthcheck endpoint — `src/app/api/movement/health/route.ts`

```ts
import { NextResponse } from "next/server";
import { ensureMovementFolder } from "@/lib/google-drive";

export async function GET() {
  try {
    const r = await ensureMovementFolder();
    return NextResponse.json({ ok: true, folder: r.name });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "erro" }, { status: 503 });
  }
}
```

---
**Pronto para deploy.**
