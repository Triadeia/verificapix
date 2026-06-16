# ARCHITECTURE.md — Documentos do Movimento
**Agente:** @architect-alan (AIOS Architect)
**Status:** Aprovado para implementação
**Data:** 2026-06-14

---

## 1. Visão arquitetural

O subsistema "Documentos do Movimento" é uma extensão data-driven da seção brandbook existente, NÃO uma feature isolada. Ele compartilha:

- O renderer dinâmico `/app/marca/[slug]/page.tsx`
- O padrão de seções de `src/lib/brandbook.ts`
- A infraestrutura Supabase + Storage já provisionada
- A camada de autenticação `getSession()`

A novidade arquitetural é introduzir **dois planos de persistência paralelos**:

1. **Plano de metadados** (Supabase Postgres) — tabela `movement_documents`
2. **Plano de bytes** (Google Drive) — pasta dedicada `Movimento - Receita Certa/`

O Supabase é fonte de verdade para metadados, busca e RLS. O Drive é fonte de verdade para o arquivo binário, sem duplicação no Supabase Storage.

**Por que dois planos?** O Drive já é o local onde o time produz e revisa documentos. Forçar dupla cópia gera divergência. A migration mantém `drive_file_id` + `drive_web_view_link` como referência canônica.

## 2. Decisão de escopo: extender vs criar

**Decisão:** estender o brandbook section `movimento` com um novo capítulo data-driven do tipo `kind: "documents"`, e ramificar o renderer para esse caso. NÃO criar nova rota.

**Razão:**
- A seção movimento já existe e já é renderizada por `[slug]/page.tsx`
- A copy "Documentos do Movimento" precisa nascer dentro da narrativa, não em rota irmã
- Mantém SSG via `generateStaticParams()` para a lista de slugs
- Reutiliza o aside, hero, footer e tipografia

## 3. Modelo de rotas

```
GET   /app/marca/movimento                  Renderiza seção + bloco de documentos (server component)
POST  /api/movement/documents               Cria metadados + dispara upload Drive
GET   /api/movement/documents               Lista (search, filtros)
GET   /api/movement/documents/[id]          Detalhe (server-side)
PATCH /api/movement/documents/[id]          Atualiza metadados
DELETE /api/movement/documents/[id]         Remove (soft-delete + Drive trash)
POST  /api/movement/documents/upload-drive  Endpoint isolado de upload binário p/ Drive
```

Toda rota `/api/movement/*` exige `getSession()`. RLS adicional no Supabase garante `organization_id`.

## 4. Camadas

```
┌───────────────────────────────────────────────────┐
│  Server Component: marca/[slug]/page.tsx          │
│  └─ if slug==="movimento": render <MovementDocs/> │
├───────────────────────────────────────────────────┤
│  Client Component: <MovementDocs />               │
│  ├─ <DocumentsFilterBar />                        │
│  ├─ <DocumentsList />                             │
│  ├─ <DocumentCard />                              │
│  └─ <DocumentUploadDialog /> (drawer + form)      │
├───────────────────────────────────────────────────┤
│  Server actions / API routes (zod-validated)      │
├───────────────────────────────────────────────────┤
│  Repository: src/lib/movement-documents.ts        │
│  ├─ listMovementDocuments(filters)                │
│  ├─ getMovementDocument(id)                       │
│  ├─ createMovementDocument(payload)               │
│  ├─ updateMovementDocument(id, patch)             │
│  └─ deleteMovementDocument(id)                    │
├───────────────────────────────────────────────────┤
│  Google Drive client: src/lib/google-drive.ts     │
│  ├─ uploadToMovementFolder(stream, meta)          │
│  ├─ ensureMovementFolder()                        │
│  └─ trashDriveFile(id)                            │
├───────────────────────────────────────────────────┤
│  Supabase: tabela movement_documents + RLS        │
└───────────────────────────────────────────────────┘
```

## 5. Contrato de dados (resumo — detalhe em DATA-SCHEMA.md)

```ts
type MovementDocument = {
  id: string;                 // uuid
  organizationId: string;
  title: string;
  kind: "Caso" | "Roteiro" | "Processo" | "Evidência" | "Manifesto" | "Outro";
  category: "Doutrina" | "Operação" | "Comunicação" | "Resultado";
  territory: string;          // ex: "Recife-PE", "Pinheiros-SP"
  occurredAt: string | null;  // ISO date
  source: string;             // quem produziu (Protetor, equipe interna, parceiro)
  status: "Rascunho" | "Em revisão" | "Publicado" | "Arquivado";
  summary: string;            // <= 280 chars
  tags: string[];
  driveFileId: string;
  driveWebViewLink: string;
  mimeType: string;
  byteSize: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
```

## 6. Fluxos críticos

### 6.1 Upload (cria documento)
1. Usuário abre `<DocumentUploadDialog>`, preenche metadados + escolhe arquivo
2. Client envia `multipart/form-data` para `POST /api/movement/documents`
3. Server valida sessão + zod schema
4. Server chama `uploadToMovementFolder()` no Drive (service account)
5. Drive retorna `fileId` e `webViewLink`
6. Server insere linha em `movement_documents` (Supabase)
7. Em caso de erro pós-Drive, executa `trashDriveFile()` para compensar
8. Server retorna documento criado; UI atualiza via revalidate

### 6.2 Listagem com filtros
- Server component server-renderiza primeira página (SSR + cache `force-cache` com tag `movement-documents`)
- Filtros (categoria, território, status, busca) usam search params; mudança dispara `router.refresh()`
- Lista paginada (20 por página, cursor por `created_at`)

### 6.3 Edição
- PATCH parcial; atualiza somente metadados (Drive não muda)
- Trocar arquivo = soft-delete antigo + criar novo

### 6.4 Remoção
- Soft-delete (`status="Arquivado"`) por padrão
- Hard-delete (admin only): remove linha + envia Drive para lixeira

## 7. Dependências e versões

| Item | Decisão |
|---|---|
| Google Drive SDK | `googleapis` (oficial) — não MCP em produção |
| Autenticação Drive | Service Account com domain-wide delegation OU OAuth2 server-side (decisão em ENV-SETUP) |
| Upload streaming | `Readable.toWeb()` para evitar buffer total em memória |
| Validação | `zod` (já no projeto) |
| File picker | `<input type="file">` nativo + drag-drop opcional via DataTransfer |

## 8. Estados de UI obrigatórios

`idle | loading | uploading(progress) | success | validation-error | network-error | drive-error | unauthorized`

Cada estado tem texto curto + ação de recuperação (ver UX-CHECKLIST).

## 9. Riscos arquiteturais e mitigações

| Risco | Mitigação |
|---|---|
| Drive offline ou quota excedida | Retry exponencial; mensagem de erro distinta; documento NÃO é criado em metadados |
| Inconsistência metadado vs arquivo | Transação compensatória (trash) descrita em 6.1 passo 7 |
| Token OAuth expira | Refresh automático no client server-side; secret rotation documentada |
| Vazamento de link público | Drive file NUNCA fica "anyone with the link"; default é restrito à org |
| Custo de listagem | Cache server com tag invalidada em mutations |

## 10. Entregáveis dependentes

- @data-denise: `DATA-SCHEMA.md` + migration SQL
- @devops-daniel: `ENV-SETUP.md` + variáveis Vercel
- @dev-diego: componentes React + repository + route handlers conforme camadas acima
- @gdrive-gloria: smoke test da `ensureMovementFolder()` + upload real

## 11. O que NÃO entra nesta iteração

- Versionamento de arquivos (Drive já versiona; UI dedicada vem depois)
- Comentários inline
- Compartilhamento externo via link público
- OCR ou extração de texto para busca full-text (próxima fase)

---
**Aprovação:** Arquitetura compatível com brandbook data-driven. Liberado para Diego, Denise, Daniel.
