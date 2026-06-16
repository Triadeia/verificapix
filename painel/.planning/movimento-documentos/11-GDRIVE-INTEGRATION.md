# GDRIVE-INTEGRATION.md — Validação Google Drive
**Agente:** @gdrive-gloria (Google Drive MCP specialist)
**Status:** Plano de validação ✅; smoke tests prontos
**Data:** 2026-06-14

---

## 1. Pré-condições verificadas

| Item | Status |
|---|---|
| `googleapis` instalado | ⚠️ rodar `npm install googleapis` (Daniel já registrou) |
| Service Account criada | ⚠️ Nilton precisa criar no GCP |
| API Drive habilitada no projeto GCP | ⚠️ habilitar |
| Pasta `Movimento - Receita Certa/` criada | ⚠️ criar manualmente |
| Pasta compartilhada com SA (papel Editor) | ⚠️ compartilhar |
| `GOOGLE_DRIVE_MOVEMENT_FOLDER_ID` em env | ⚠️ preencher |
| `GOOGLE_DRIVE_SA_EMAIL/SA_PRIVATE_KEY` em env | ⚠️ preencher |

## 2. Suite de validação (script local)

`scripts/validate-drive-integration.ts`:

```ts
import "dotenv/config";
import { ensureMovementFolder, uploadToMovementFolder, trashDriveFile } from "../src/lib/google-drive";

async function main() {
  console.log("→ Verificando pasta do Movimento...");
  const folder = await ensureMovementFolder();
  console.log(`  ✓ Pasta encontrada: "${folder.name}" (${folder.folderId})`);

  console.log("→ Upload de arquivo de teste...");
  const bytes = Buffer.from("Smoke test do Movimento — pode apagar.", "utf8");
  const file = await uploadToMovementFolder({
    name: `smoke-test-${Date.now()}.txt`,
    mimeType: "text/plain",
    bytes,
    properties: { test: "true", agent: "gloria" },
  });
  console.log(`  ✓ Upload OK: id=${file.id}`);
  console.log(`  ✓ Link: ${file.webViewLink}`);

  console.log("→ Movendo para lixeira (cleanup)...");
  await trashDriveFile(file.id);
  console.log("  ✓ Lixeira: OK");

  console.log("\nTodos os testes passaram.");
}

main().catch((err) => {
  console.error("\n❌ Falha:", err);
  process.exit(1);
});
```

Executar:

```bash
cd /Users/niltonjunior/verificapix-mission/painel
npx tsx scripts/validate-drive-integration.ts
```

Saída esperada:
```
→ Verificando pasta do Movimento...
  ✓ Pasta encontrada: "Movimento - Receita Certa" (1a2b3c...)
→ Upload de arquivo de teste...
  ✓ Upload OK: id=1xyz...
  ✓ Link: https://drive.google.com/file/d/1xyz.../view
→ Movendo para lixeira (cleanup)...
  ✓ Lixeira: OK

Todos os testes passaram.
```

## 3. Casos de erro esperados e mensagens

| Erro | Causa provável | Ação |
|---|---|---|
| `invalid_grant` | Private key mal formatada (sem `\n` real) | No `.env` use `\\n`; no código já há `replace(/\\n/g, "\n")` |
| `403 The caller does not have permission` | Pasta não compartilhada com SA | Adicionar e-mail da SA como Editor na pasta |
| `404 File not found` | `FOLDER_ID` errado ou em outro drive | Confirmar ID na URL `drive.google.com/drive/folders/<ID>` |
| `Quota exceeded` | Excedeu cota da SA (raríssimo) | Aguardar 24h ou pedir aumento |
| `Invalid API key` ou similar | API Drive não habilitada | Console GCP → Library → Enable |

## 4. Decisão sobre subpastas

A arquitetura inicial mantém **uma única pasta plana**. Razões:

- Filtros e busca acontecem no Supabase
- Subpastas duplicariam categoria em dois lugares (DB + Drive)
- Mover Drive folders via API é mais lento que update SQL

**Quando criar subpastas?**
Apenas se a pasta principal ultrapassar 100k arquivos. Aí dividir por ano (`2026/`, `2027/`). Decisão postergada.

Caso ainda assim seja necessário, função `ensureSubfolder()`:

```ts
export async function ensureSubfolder(parentId: string, name: string): Promise<string> {
  const drive = getDriveClient();
  const q = `'${parentId}' in parents and name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const existing = await drive.files.list({ q, fields: "files(id)", supportsAllDrives: true });
  if (existing.data.files?.[0]?.id) return existing.data.files[0].id;
  const created = await drive.files.create({
    requestBody: { name, mimeType: "application/vnd.google-apps.folder", parents: [parentId] },
    fields: "id",
    supportsAllDrives: true,
  });
  if (!created.data.id) throw new Error("Falha ao criar subpasta.");
  return created.data.id;
}
```

## 5. Verificação de retenção

A SA usa scope `drive.file` → só enxerga arquivos que ELA criou. Isso significa:

- ✅ Se alguém deletar a pasta no UI, a SA perde acesso aos arquivos
- ⚠️ Se alguém mover o arquivo para outra pasta, o `driveWebViewLink` continua válido mas a pasta lógica muda
- ⚠️ Se a SA for excluída, todos os arquivos viram órfãos (mas o link continua)

**Recomendação operacional:**
- A pasta `Movimento - Receita Certa/` deve ter **dono** humano + SA como Editor
- Documentar no runbook que NUNCA remover a SA sem migrar a propriedade dos arquivos

## 6. Smoke test em produção (após deploy)

Endpoint `/api/movement/health` (criado por Daniel) retorna:
```json
{ "ok": true, "folder": "Movimento - Receita Certa" }
```

Adicionar ao monitoramento de uptime: ping a cada 5min. Se falhar 3x consecutivas, alertar.

## 7. Checklist de homologação

- [ ] Service Account criada e e-mail copiado
- [ ] API Drive habilitada
- [ ] Pasta criada e compartilhada
- [ ] FOLDER_ID copiado para `.env.local`
- [ ] SA_EMAIL e SA_PRIVATE_KEY no `.env.local`
- [ ] `npm install googleapis` rodado
- [ ] `npx tsx scripts/validate-drive-integration.ts` retorna ✓✓✓
- [ ] `/api/movement/health` responde 200 em dev
- [ ] Upload via UI cria arquivo na pasta correta
- [ ] Arquivar via UI mantém arquivo no Drive (NÃO joga na lixeira automaticamente — soft delete só no DB)
- [ ] Variáveis replicadas em Vercel (production + preview)

## 8. Custo previsto

Drive API é gratuita até limites generosos (1 bilhão de queries/dia por projeto). Para volumes do Movimento (centenas/mês), **custo zero**.

Armazenamento: 15 GB grátis no plano default. Cada documento médio (2 MB) → ~7500 docs antes de precisar Workspace ou Shared Drive. Recomendação: migrar para **Shared Drive** desde o início se houver Workspace na empresa (cota separada e governança melhor).

## 9. Resultado final esperado

Quando o Protetor clicar "Publicar no Movimento":

1. Arquivo aparece em `Movimento - Receita Certa/` no Drive em < 5s
2. Linha aparece em `movement_documents` no Supabase
3. Card aparece na grid `/app/marca/movimento#documentos`
4. Link "Abrir no Drive" leva ao arquivo com permissões corretas

---
**Integração validada teoricamente. Aguarda execução do checklist 7 por Nilton + Daniel.**
