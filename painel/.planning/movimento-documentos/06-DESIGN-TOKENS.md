# DESIGN-TOKENS.md — Design system para Documentos
**Agente:** @design-diana (Design Chief)
**Status:** CSS pronto para colar em `globals.css`
**Data:** 2026-06-14

---

## 1. Princípios visuais

A seção Documentos vive dentro do tom Movimento (institucional, sério, esperançoso). Não é dashboard; é doutrina viva. Por isso:

- Fundo branco com leve calor (não cinza frio)
- Cards com borda discreta, sombra mínima
- Azul navy como assinatura institucional
- Laranja como acento de tipo/categoria (não chama ação)
- Verde só para status "Publicado" — sucesso editorial
- Âmbar para "Em revisão" — sinal de cuidado
- Sem gradientes coloridos. Sem glow. Sem glassmorphism aqui.

## 2. Tokens específicos (adicionar ao `globals.css`)

```css
/* === Movimento / Documentos === */
:root {
  --movement-doc-bg: #fdfbf7;
  --movement-doc-card: #ffffff;
  --movement-doc-border: rgba(15, 23, 42, 0.08);
  --movement-doc-border-strong: rgba(15, 23, 42, 0.16);
  --movement-doc-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06);
  --movement-doc-shadow-hover: 0 4px 12px rgba(15, 23, 42, 0.08), 0 16px 32px rgba(15, 23, 42, 0.1);

  --movement-doc-accent: #c2410c;        /* laranja escuro institucional */
  --movement-doc-accent-soft: #fff7ed;

  --movement-status-draft-bg: #f1f5f9;
  --movement-status-draft-fg: #475569;
  --movement-status-review-bg: #fef3c7;
  --movement-status-review-fg: #92400e;
  --movement-status-published-bg: #d1fae5;
  --movement-status-published-fg: #065f46;
  --movement-status-archived-bg: #f8fafc;
  --movement-status-archived-fg: #94a3b8;
}

.movement-documents {
  background: var(--movement-doc-bg);
  border-radius: 24px;
  padding: 32px 24px;
  margin-top: 48px;
}

.movement-documents h2 {
  font-family: var(--font-sora, system-ui);
  font-weight: 800;
  font-size: 1.75rem;
  letter-spacing: -0.01em;
  color: var(--navy);
}

.movement-documents-toolbar {
  border-top: 1px solid var(--movement-doc-border);
  padding-top: 16px;
}

.movement-documents-toolbar input,
.movement-documents-toolbar select {
  background: var(--movement-doc-card);
  border: 1px solid var(--movement-doc-border);
  color: var(--navy);
  transition: border-color 160ms ease;
}

.movement-documents-toolbar input:focus,
.movement-documents-toolbar select:focus {
  outline: none;
  border-color: var(--movement-doc-border-strong);
  box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.08);
}

.movement-documents-grid > li {
  background: var(--movement-doc-card);
  border: 1px solid var(--movement-doc-border);
  box-shadow: var(--movement-doc-shadow);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.movement-documents-grid > li:hover {
  transform: translateY(-2px);
  box-shadow: var(--movement-doc-shadow-hover);
}

.movement-documents-grid h3 {
  font-family: var(--font-sora, system-ui);
  font-weight: 700;
  line-height: 1.3;
  color: var(--navy);
}

.movement-documents-grid dt {
  font-family: var(--font-jakarta, system-ui);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.movement-doc-kind {
  color: var(--movement-doc-accent);
  background: var(--movement-doc-accent-soft);
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.movement-doc-status {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.movement-doc-status[data-status="Rascunho"]   { background: var(--movement-status-draft-bg); color: var(--movement-status-draft-fg); }
.movement-doc-status[data-status="Em revisão"] { background: var(--movement-status-review-bg); color: var(--movement-status-review-fg); }
.movement-doc-status[data-status="Publicado"]  { background: var(--movement-status-published-bg); color: var(--movement-status-published-fg); }
.movement-doc-status[data-status="Arquivado"]  { background: var(--movement-status-archived-bg); color: var(--movement-status-archived-fg); opacity: 0.7; }

.movement-doc-dialog {
  background: var(--movement-doc-card);
  border: 1px solid var(--movement-doc-border);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.18);
}

.movement-doc-dialog h3 {
  font-family: var(--font-sora, system-ui);
  font-weight: 800;
  color: var(--navy);
}

/* Modo escuro institucional */
[data-theme="dark"] .movement-documents {
  --movement-doc-bg: #0f1623;
  --movement-doc-card: #131c2d;
  --movement-doc-border: rgba(255, 255, 255, 0.08);
  --movement-doc-border-strong: rgba(255, 255, 255, 0.18);
  --movement-doc-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4);
  --movement-doc-accent: #fb923c;
  --movement-doc-accent-soft: rgba(251, 146, 60, 0.12);

  --movement-status-draft-bg: rgba(148, 163, 184, 0.16);
  --movement-status-draft-fg: #cbd5e1;
  --movement-status-review-bg: rgba(251, 191, 36, 0.16);
  --movement-status-review-fg: #fcd34d;
  --movement-status-published-bg: rgba(34, 197, 94, 0.16);
  --movement-status-published-fg: #86efac;
}

[data-theme="dark"] .movement-documents h2,
[data-theme="dark"] .movement-documents-grid h3 {
  color: #f8fafc;
}
```

## 3. Recomendação para Diego — instrumentação

Trocar nos cards:

```diff
- <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusColor}`}>{doc.status}</span>
+ <span className="movement-doc-status" data-status={doc.status}>{doc.status}</span>

- <span className="text-xs font-bold text-orange-600">{doc.kind}</span>
+ <span className="movement-doc-kind">{doc.kind}</span>
```

E no dialog:
```diff
- className="panel w-full max-w-xl rounded-t-2xl bg-white p-6 sm:rounded-2xl"
+ className="movement-doc-dialog w-full max-w-xl rounded-t-2xl p-6 sm:rounded-2xl"
```

## 4. Iconografia

Manter lucide-react. Ícones aprovados:

| Uso | Ícone |
|---|---|
| Upload CTA | `Upload` |
| Busca | `Search` |
| Filtro indicador | `Filter` |
| Link Drive | `ExternalLink` |
| Editar | `Pencil` |
| Arquivar | `Archive` |
| Status território | `MapPin` (opcional, se quiser reforçar) |
| Fonte | `User` (opcional) |

Tamanho padrão: `size-4` (16px) em botões, `size-3.5` (14px) em ações secundárias, `size-3` (12px) em chips inline.

## 5. Espaçamento (escala de 4)

| Elemento | Espaço |
|---|---|
| Hero da seção → toolbar | 24px |
| Toolbar → grid | 24px |
| Cards entre si | 16px |
| Padding interno card | 20px |
| Padding dialog | 24px |
| Dialog rows | 16px |

## 6. Tipografia hierárquica

| Elemento | Família | Peso | Tamanho |
|---|---|---|---|
| H2 seção | Sora | 800 | 28px |
| H3 card | Sora | 700 | 16px |
| Summary | Plus Jakarta | 400 | 14px |
| dl/dt | Plus Jakarta | 700 | 11px UPPER |
| dl/dd | Plus Jakarta | 500 | 13px |
| Chip kind/status | Plus Jakarta | 800 | 11px |

## 7. Aprovação visual

Validado contra:
- `Confiança antes da entrega` (seção estratégia) → consistente com card estilo
- `Caixa Blindado` (hero movimento) → mantém navy + serenidade
- Dashboard existente → não destoa de tabelas/painéis

---
**Design aprovado. Pronto para integração no `globals.css`.**
