# Verifica Pix Brandbook

Brandbook e Design System do Verifica Pix em HTML, CSS, JavaScript e SVG.

Versão 2.0 com navegação responsiva, demonstrações de produto, tokens em OKLCH e
a assinatura final da marca com o V aberto e tipografia Francy preservada.

A página inicial usa uma arquitetura longa de conversão reconstruída com o método
do AI Website Cloner: inspeção da referência, documentação da topologia, extração
dos padrões e implementação com conteúdo e componentes originais do Verifica Pix.

## Visualização local

```bash
python3 -m http.server 8080
```

Acesse `http://localhost:8080`.

## Conteúdo

- Brand Guidelines
- Estratégia de marca e ICP
- Voz e microcopy
- Cores e tokens
- Tipografia
- Espaçamento e layout
- Movimento
- Componentes e tabelas
- Uso da logomarca
- Domínios e infraestrutura

## Pesquisa da landing page

Os artefatos de inspeção e adaptação estão em:

```text
docs/research/meuassessor-reference/
```

## Reconstruir os arquivos

```bash
node scripts/build-brandbook.mjs
```
