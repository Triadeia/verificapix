# 00 — RELATÓRIO CONSOLIDADO
**Missão:** Documentos do Movimento — "Receita Certa de quem constrói"
**Squad:** 11 agentes paralelos coordenados por @squad-architect
**Data:** 2026-06-14
**Status global:** ✅ Pronto para implementação · ⚠️ 3 correções de segurança + checklist GDrive antes de produção

---

## 1. O que esta squad entregou

Refatoração completa da seção `/app/marca/movimento` para incluir um repositório vivo de documentos chamado **Documentos do Movimento**, com:

- Capítulo doutrinário "Receita Certa de quem constrói" adicionado ao brandbook
- CRUD completo (listar, criar, editar, arquivar) com filtros e busca
- Upload binário → Google Drive (Service Account)
- Metadados → Supabase com RLS por organização
- Design system específico para a seção (tokens, estados, responsividade)
- Copy estratégico alinhado à doutrina DOC-001/002
- Auditoria de segurança + QA + plano de validação Drive

## 2. Entregáveis por agente

| # | Agente | Arquivo | Status |
|---|---|---|---|
| 01 | @architect-alan | `01-ARCHITECTURE.md` | ✅ |
| 02 | @dev-diego | `02-CODE-DEV-DIEGO.md` (código colável) | ✅ |
| 03 | @data-denise | `03-DATA-SCHEMA.md` (SQL pronto) | ✅ |
| 04 | @devops-daniel | `04-ENV-SETUP.md` | ✅ |
| 05 | @ux-ulia | `05-UX-CHECKLIST.md` | ✅ com 4 pendências menores |
| 06 | @design-diana | `06-DESIGN-TOKENS.md` | ✅ |
| 07 | @copy-clara | `07-COPY-ESTRATEGICA.md` | ✅ |
| 08 | @story-steve | `08-NARRATIVA-MOVIMENTO.md` | ✅ |
| 09 | @qa-quinn | `09-QA-REPORT.md` | ✅ 0 bloqueios prod |
| 10 | @security-sam | `10-SECURITY-AUDIT.md` | ⚠️ 3 correções obrigatórias |
| 11 | @gdrive-gloria | `11-GDRIVE-INTEGRATION.md` | ⚠️ aguarda checklist humano |

## 3. Decisões arquiteturais ratificadas

1. **Estender, não criar rota nova** — Documentos vive como capítulo da seção `movimento` no brandbook data-driven
2. **Dois planos de persistência** — Supabase (metadados, fonte de verdade para listagem/busca/RLS) + Drive (arquivo binário, fonte de verdade do conteúdo)
3. **Service Account com scope `drive.file`** — sem OAuth2 server-side, sem domain-wide delegation
4. **Soft-delete por padrão** — `status='Arquivado'` em vez de DELETE; hard-delete restrito a admin
5. **Cap.posição na narrativa** — entre `flywheel` e `guardrails` (decisão UX + Story)
6. **Sem subpastas no Drive nesta fase** — pasta plana até 100k arquivos
7. **Rate limit in-memory** — 10 uploads/minuto/usuário; upgrade para Upstash quando multi-instance

## 4. Plano de implementação (ordem sugerida)

```
1. Nilton: GCP setup (criar SA, habilitar Drive API, criar pasta, compartilhar)        [30min]
2. Daniel: preencher .env.local + Vercel envs                                          [15min]
3. Daniel: npm install googleapis                                                      [2min]
4. Denise: aplicar migration SQL no Supabase (preview branch ou local)                 [10min]
5. Diego: adicionar tipos/funções em src/lib/movement-documents.ts                     [15min]
6. Diego: adicionar capítulo `documentos` em src/lib/brandbook.ts                      [5min]
7. Diego: criar src/lib/google-drive.ts (cliente)                                      [10min]
8. Diego: criar route handlers /api/movement/documents/*                               [20min]
9. Diego: criar componentes <MovementDocuments> + <DocumentUploadDialog>               [25min]
10. Diego: patch em /app/marca/[slug]/page.tsx                                         [10min]
11. Diana: adicionar tokens CSS em globals.css                                         [10min]
12. Gloria: rodar scripts/validate-drive-integration.ts                                [5min]
13. Quinn: rodar npm test e checagem manual da UI                                      [20min]
14. Sam: aplicar 3 correções (CSRF, headers, magic byte)                               [25min]
15. Sam: re-auditar                                                                    [10min]
16. Deploy preview Vercel                                                              [auto]
17. Smoke test em preview (Gloria checklist)                                           [15min]
18. Deploy production                                                                  [auto]

Tempo estimado total: ~3h30 de trabalho humano + auto.
```

## 5. Riscos identificados e mitigação

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Private key mal escapada → invalid_grant | Média | `04-ENV-SETUP` doc + replace `\\n` no código |
| Inconsistência Drive vs Supabase | Baixa | Transação compensatória (trash on DB error) |
| Vazamento de PII em arquivos uploaded | Média | `07-COPY` proíbe nomes sem autorização; revisar curadoria |
| Multi-instance + rate limit in-memory | Baixa (Hobby) | Doc para upgrade Upstash quando relevante |
| Quota Drive Workspace | Baixa | Migração para Shared Drive documentada |

## 6. Pendências não resolvidas (admitidas)

1. **Focus trap no dialog** — Diego implementa após primeiro merge
2. **Skeleton de carregamento** — Diego em sprint+1
3. **Toast lib** — confirmar se há Sonner em `components/ui` (não inspecionado)
4. **Link "Limpar filtros"** — Diego em sprint+1
5. **3 correções Sam** — CSRF + headers + magic byte (obrigatório antes de prod)

## 7. O que NÃO foi feito (escopo cortado)

- Versionamento de arquivos (Drive já versiona; UI dedicada no futuro)
- Comentários inline em documentos
- Compartilhamento externo via link público (proibido pelos guardrails)
- OCR / full-text dentro do PDF (próxima fase de busca)
- E2E Playwright (deixado como plano em `09-QA-REPORT`)
- Página de detalhe `/app/marca/movimento/documentos/[id]` para edição completa (esqueleto referenciado no card, implementar em sprint+1)

## 8. Mudança narrativa central

A seção Movimento deixa de ser apenas **doutrina** e passa a ser **doutrina + artefatos vivos**. O capítulo Documentos materializa o flywheel "Conhecer → confiar → adotar → propagar" — antes, o passo "propagar" não tinha onde acontecer.

**Frase-mãe da nova seção:** *"Quem constrói deixa receita."*

## 9. Aprovações da squad

- ✅ Arquitetura (Alan)
- ✅ Implementação proposta (Diego)
- ✅ Modelo de dados (Denise)
- ✅ Setup infra (Daniel)
- ✅ UX (Ulia) — com 4 pendências menores
- ✅ Visual (Diana)
- ✅ Copy (Clara)
- ✅ Narrativa (Steve)
- ✅ QA (Quinn) — 0 bloqueios staging
- ⚠️ Segurança (Sam) — condicional às 3 correções
- ✅ Validação Drive (Gloria) — pendente execução humana

## 10. Mapa de arquivos (todos absolutos)

**Outputs da squad (esta pasta):**
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/00-RELATORIO-CONSOLIDADO.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/01-ARCHITECTURE.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/02-CODE-DEV-DIEGO.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/03-DATA-SCHEMA.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/04-ENV-SETUP.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/05-UX-CHECKLIST.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/06-DESIGN-TOKENS.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/07-COPY-ESTRATEGICA.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/08-NARRATIVA-MOVIMENTO.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/09-QA-REPORT.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/10-SECURITY-AUDIT.md`
- `/Users/niltonjunior/verificapix-mission/painel/.planning/movimento-documentos/11-GDRIVE-INTEGRATION.md`

**Arquivos do projeto a TOCAR (Diego):**
- `/Users/niltonjunior/verificapix-mission/painel/src/lib/brandbook.ts` — adicionar capítulo `documentos`
- `/Users/niltonjunior/verificapix-mission/painel/src/lib/movement-documents.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/lib/google-drive.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/lib/rate-limit.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/lib/file-signature.ts` — criar (Sam)
- `/Users/niltonjunior/verificapix-mission/painel/src/components/movement-documents.tsx` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/components/movement-document-upload.tsx` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/app/app/marca/[slug]/page.tsx` — patch
- `/Users/niltonjunior/verificapix-mission/painel/src/app/api/movement/documents/route.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/app/api/movement/documents/[id]/route.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/app/api/movement/documents/[id]/archive/route.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/app/api/movement/health/route.ts` — criar
- `/Users/niltonjunior/verificapix-mission/painel/src/app/globals.css` — adicionar tokens Diana
- `/Users/niltonjunior/verificapix-mission/painel/.env.example` — adicionar GOOGLE_DRIVE_*
- `/Users/niltonjunior/verificapix-mission/painel/next.config.ts` — headers Sam
- `/Users/niltonjunior/verificapix-mission/painel/scripts/validate-drive-integration.ts` — criar (Gloria)
- Migration SQL: `/Users/niltonjunior/verificapix-mission/painel/supabase/migrations/20260614120000_movement_documents.sql` — criar (Denise)

---

<promise>COMPLETE</promise>
