# Entrega Verifica Pix

## Abrir localmente

Na raiz do projeto:

```bash
python3 -m http.server 8000
```

Abra `http://localhost:8000/`.

## Páginas principais

- `index.html`
- `brandbook/guidelines/index.html`
- `brandbook/color-tokens/index.html`
- `brandbook/typography/index.html`
- `brandbook/spacing-layout/index.html`
- `brandbook/movimento/index.html`
- `brandbook/tables/index.html`
- `brandbook/voice/index.html`
- `brandbook/components/index.html`
- `brandbook/brand-strategy/index.html`

As rotas anteriores na raiz foram preservadas para compatibilidade.

## Reconstruir HTML

```bash
node scripts/build-brandbook.mjs
```

Publicação: `https://triadeia.github.io/verificapix/`
