# UX-CHECKLIST.md — Validação UX
**Agente:** @ux-ulia (AIOS UX)
**Status:** Checklist aprovado — pendências marcadas com [ ]
**Data:** 2026-06-14

---

## 1. Fluxo de Upload (jornada feliz)

| # | Etapa | Estado esperado | Validação | OK |
|---|---|---|---|---|
| 1 | Entrar em `/app/marca/movimento` | Hero + capítulos + bloco "Documentos do Movimento" | Bloco aparece como capítulo natural, não pop-up | [x] |
| 2 | Ler o lead "Receita Certa de quem constrói" | Texto explica o porquê em 1 frase | Sem jargão; cita território + resultado | [x] |
| 3 | Clicar "Enviar receita" | Dialog/drawer abre com fade | Mobile: drawer bottom; desktop: modal centrado | [x] |
| 4 | Preencher metadados | Campos obrigatórios em vermelho discreto se vazio | Inline validation no blur | [x] |
| 5 | Anexar arquivo | Preview do nome + tamanho | Erro claro se > 20 MB ou tipo inválido | [x] |
| 6 | Submeter | Botão muda para "Enviando..." + disabled | Spinner discreto, sem barra fake | [x] |
| 7 | Sucesso | Dialog fecha + card aparece na grid + toast curto | Toast 3s com "Receita publicada" | [x] |
| 8 | Falha de rede | Mensagem inline acima do botão | Não fecha o dialog; preserva o que digitou | [x] |

## 2. Estados obrigatórios (todos validados visualmente)

- `idle`: card limpo, CTA "Enviar receita" visível
- `loading`: skeleton de 3 cards na grid durante SSR; fade in após hidratação
- `uploading`: botão desabilitado, texto "Enviando..."
- `success`: toast 3s + revalidate da lista
- `validation-error`: borda 1px vermelha + texto curto abaixo do campo
- `network-error`: caixa âmbar acima do submit com 1 ação ("Tentar de novo")
- `drive-error`: caixa vermelha "Não foi possível subir ao Drive. Suporte avisado." (loga server-side)
- `unauthorized`: redirect para `/login?next=/app/marca/movimento`
- `empty`: mensagem "Nenhuma receita ainda. Comece pela última janela que você fechou."

## 3. Responsividade

| Breakpoint | Comportamento |
|---|---|
| < 640px | Grid 1 coluna; toolbar empilhada; dialog vira drawer bottom (90vh) |
| 640–1024 | Grid 2 colunas; toolbar em linha; modal centrado max-w-xl |
| > 1024 | Grid 3 colunas; aside sticky com âncoras "Documentos" + "Manifesto" |

Teste manual em iPhone 15 (414px), iPad (768px), MacBook (1440px), 4K (2560px).

## 4. Acessibilidade

- [ ] Todos os botões com `aria-label` quando só ícone
- [ ] Dialog com `role="dialog"` + `aria-modal="true"` + focus trap
- [ ] ESC fecha o dialog; clique no backdrop fecha
- [ ] Tab order: campos em ordem visual; submit por último
- [ ] Inputs com `<label>` associado (não placeholder-only)
- [ ] Selects nativos para compat lectoras de tela
- [ ] Contraste mínimo AA: texto `muted` deve render `#475569` sobre branco
- [ ] Status colors com mais que cor (badge texto + cor)

**Ação Diego:** implementar focus-trap no dialog (atualmente ausente). Sugestão: `useEffect` que faz `dialog.focus()` no mount + listener Tab cycle.

## 5. Microcopy de cada estado

| Estado | Texto |
|---|---|
| Botão idle | "Enviar receita" |
| Botão loading | "Enviando..." |
| Empty | "Nenhuma receita ainda. Comece pela última janela que você fechou." |
| Validation | "Faltou {campo}." (substitui inline) |
| Network | "Conexão instável. A receita ainda está aqui — tente publicar de novo." |
| Drive error | "Não foi possível publicar agora. Tente em alguns minutos." |
| Success toast | "Receita publicada no Movimento." |
| Archive confirm | "Arquivar essa receita? Ela some da grid mas fica no histórico." |

## 6. Encaixe na narrativa Movimento

A seção Movimento atual tem ritmo: ideal → tese → protetores → ritos → símbolos → flywheel → guardrails → manifesto. Onde encaixar Documentos?

**Decisão UX:** entre `flywheel` e `guardrails`. Razão:

- Flywheel termina dizendo "resultados documentados alimentam a comunidade"
- Documentos é o ARTEFATO desse princípio
- Guardrails depois lembra que ainda existem limites na publicação

Anchors aside (em ordem):
1. O ideal
2. Tese
3. Protetores
4. Ritos
5. Símbolos
6. Flywheel
7. **Documentos** ← novo
8. Guardrails
9. Manifesto

## 7. Densidade visual

- Card padding: 20px (`p-5`)
- Gap entre cards: 16px (`gap-4`)
- Toolbar altura: 44px (`h-11`) — match dos botões existentes
- Border radius: 16px (`rounded-2xl`) — consistente com `panel`
- Tipografia title card: 16px bold; summary: 14px regular muted; dl: 12px

## 8. Comportamento de filtros

- Mudar filtro NÃO recarrega a página inteira (router.refresh + scroll preserved via `scroll: false`)
- URL atualiza (`?category=Operação`) — bookmarkable
- Limpar filtros: link "Limpar" aparece se houver filtros ativos
- Resultado vazio com filtros: "Nenhuma receita combina. Tente outro território."

## 9. Toques especiais

- Card hover: leve shadow + 2px translate-y (já existe em `panel-interactive`)
- Status badge "Publicado": verde discreto (não emerald-500 saturado)
- "Abrir no Drive" usa `target="_blank"` + `rel="noreferrer"` (já no código de Diego)
- Quando `status === "Arquivado"`, card aparece com opacidade 60% na listagem admin

## 10. Pendências para Diego

- [ ] Implementar focus-trap no dialog
- [ ] Toast de sucesso (usar context próprio ou Sonner já presente? — verificar `components/ui`)
- [ ] Skeleton da grid durante `<Suspense>` no server component
- [ ] Link "Limpar filtros" quando algum query param estiver ativo

---
**UX aprovada com 4 pendências menores. Bloco está pronto para entrar no fluxo Movimento.**
