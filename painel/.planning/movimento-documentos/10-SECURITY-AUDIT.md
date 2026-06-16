# SECURITY-AUDIT.md — Auditoria de segurança
**Agente:** @security-sam (Code Reviewer + Security)
**Status:** Aprovado com 3 correções obrigatórias antes de prod
**Data:** 2026-06-14

---

## 1. Escopo da auditoria

- Route handlers: `POST/GET /api/movement/documents`, `PATCH/DELETE /api/movement/documents/[id]`, `POST .../archive`, `GET /api/movement/health`
- Repository `src/lib/movement-documents.ts`
- Cliente `src/lib/google-drive.ts`
- Configuração de env e RLS
- Componente de upload `<DocumentUploadDialog>`

## 2. Vetores avaliados

| Vetor | Avaliação | Status |
|---|---|---|
| Credenciais expostas | OK | ✅ |
| Validação de input | OK (Zod estrito) | ✅ |
| RLS Supabase | OK (políticas por org) | ✅ |
| IDOR | OK (RLS bloqueia leitura/edição cross-org) | ✅ |
| Path traversal | N/A (não usa filesystem local) | ✅ |
| Upload de binário malicioso | Parcial | ⚠️ correção 3 |
| SSRF via Drive | Não aplicável (chamada outbound a domínio fixo) | ✅ |
| CSRF | Parcial | ⚠️ correção 1 |
| Rate limiting | OK (in-memory; documentado upgrade) | ✅ |
| Headers de segurança | Pendente revisão global | ⚠️ correção 2 |
| Tratamento de erro vazando stack | OK | ✅ |
| Service Account scope | OK (`drive.file` apenas) | ✅ |
| Logging de PII | OK (não loga conteúdo) | ✅ |
| Soft-delete vs hard-delete | OK (hard só admin via RLS) | ✅ |
| Tokens em URL | OK (não há) | ✅ |

## 3. Correções obrigatórias antes de produção

### Correção 1 — CSRF no endpoint `archive` (form post)

O endpoint `POST /api/movement/documents/[id]/archive` aceita um form submit, então é alvo CSRF clássico.

**Mitigação:** Next.js 16 oferece origin checking automático em Server Actions. Como aqui usamos route handler tradicional, precisamos validar manualmente:

```ts
// no início do handler archive
const origin = request.headers.get("origin");
const host = request.headers.get("host");
if (!origin || !host || !origin.endsWith(host)) {
  return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
}
```

**Alternativa preferida:** converter `archive` em Server Action. Decisão arquitetural: manter route handler agora, adicionar checagem acima.

### Correção 2 — Headers de segurança

Adicionar em `next.config.ts`:

```ts
async headers() {
  return [{
    source: "/api/movement/:path*",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Cache-Control", value: "no-store" },
    ],
  }];
}
```

### Correção 3 — Magic byte check no upload

Validar MIME via `file.type` é fácil de spoofar. Adicionar verificação de assinatura binária:

```ts
// src/lib/file-signature.ts
const signatures: Record<string, number[][]> = {
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [[0x50, 0x4b, 0x03, 0x04]],
  "text/plain": [], // permitir sem assinatura
};

export function verifySignature(buf: Buffer, claimedMime: string): boolean {
  const sigs = signatures[claimedMime];
  if (!sigs) return false;
  if (sigs.length === 0) return true; // text/plain
  return sigs.some((sig) => sig.every((byte, i) => buf[i] === byte));
}
```

Usar no handler:

```ts
const bytes = Buffer.from(await file.arrayBuffer());
if (!verifySignature(bytes, file.type)) {
  return NextResponse.json({ error: "Conteúdo não corresponde ao tipo declarado." }, { status: 422 });
}
```

## 4. Recomendações (não bloqueantes)

- **R1:** Mover rate-limit para Upstash Redis quando deploy multi-instância
- **R2:** Adicionar log estruturado (pino) em rotas críticas para investigação
- **R3:** Habilitar `Content-Security-Policy` global do app (fora deste escopo)
- **R4:** Rotação trimestral da chave da Service Account documentada em runbook
- **R5:** Tag de auditoria em metadados Drive `properties.uploadedBy` = user id (útil pra forense)
- **R6:** Não loggar `error.message` direto do Drive na resposta — pode revelar nome de pasta interna. Mensagem genérica + log server-side completo

## 5. Revisão de RLS

Reli as policies de Denise. Observações:

- ✅ `SELECT` por org via subquery — correto
- ✅ `INSERT` exige `created_by = auth.uid()` — previne forjar autoria
- ✅ `UPDATE` permite admin/editor — alinhado com governança
- ✅ `DELETE` apenas admin — preserva auditoria
- ⚠️ **Atenção:** a subquery `select organization_id from profiles where id = auth.uid()` é executada por linha. Em alta cardinalidade, considerar `current_setting('request.jwt.claims', true)` com claim customizado. Por ora, OK.

## 6. Revisão do cliente Drive

- ✅ Chave nunca exposta ao client
- ✅ Scope mínimo `drive.file` (só vê arquivos criados pela própria SA)
- ✅ `properties.uploadedBy` recomendado adicionar (R5)
- ⚠️ `supportsAllDrives` só true se houver `SHARED_DRIVE_ID` — verificado
- ✅ Fluxo compensatório (trash on failure) está no handler

## 7. Conferência de RLS — teste prático sugerido

```sql
-- Logar como user A (org X)
set local "request.jwt.claims" = '{"sub":"user-a-uuid"}';
insert into movement_documents (...) values (...); -- deve aceitar
select * from movement_documents;                  -- só vê org X

-- Logar como user B (org Y) tentando ler doc da org X
set local "request.jwt.claims" = '{"sub":"user-b-uuid"}';
select * from movement_documents where id = '<id-da-org-x>'; -- deve retornar vazio
update movement_documents set status='Arquivado' where id = '<id-da-org-x>'; -- 0 rows
```

## 8. Status final

**Aprovado para staging:** ✅ Sim
**Aprovado para produção:** condicional às 3 correções obrigatórias
**Risco residual:** baixo
**Próxima revisão:** após implementação das correções

---
**Auditoria assinada. Voltarei a revisar após patch das 3 correções.**
