# COPY-ESTRATEGICA.md — Copy do Movimento e Documentos
**Agente:** @copy-clara (Copy Chief)
**Status:** Copy aprovado para implementação
**Data:** 2026-06-14

---

## 1. Tese da copy

"Receita Certa de quem constrói" não é metáfora bonita. É **operação**:

- **Receita** = passo a passo testado (não opinião)
- **Certa** = comprovada em território, com fonte (não promessa)
- **De quem constrói** = autoria do Protetor (não voz institucional)

Toda string da seção deve:
1. **Provar** antes de prometer — território + data + fonte aparecem antes do verbo
2. **Recusar genérico** — em vez de "casos de sucesso", "receitas que fecharam a janela"
3. **Pedir registro, não engajamento** — "publicar" e "documentar", não "compartilhar"

## 2. Capítulo `documentos` no brandbook.ts

```ts
{
  id: "documentos",
  title: "Receita Certa de quem constrói",
  lead: "Toda receita começa com uma janela que precisou ser fechada. Documentamos onde funcionou, quem testou e qual foi o resultado. O Movimento se sustenta no que pode ser revisto, refeito e ensinado.",
  points: [
    {
      title: "Território",
      text: "Cada receita aponta bairro, cidade e contexto. O que funcionou na padaria de Pinheiros nem sempre cabe no mercadinho de Caruaru. Quem registra, ajuda quem decide.",
    },
    {
      title: "Fonte",
      text: "Sem nome de quem viveu, é hipótese. A coluna 'fonte' obriga o Protetor a assumir autoria — porque ninguém ensina a receita que não fez.",
    },
    {
      title: "Resultado",
      text: "Receita sem desfecho não publica. Foi prejuízo evitado, fraude interrompida, processo adotado? Quem documenta, multiplica.",
    },
  ],
}
```

## 3. Bloco "Documentos do Movimento" — copy final

**Kicker:** `Documentos do Movimento`
**H2:** `Receita Certa de quem constrói`
**Lead:**
> "Casos, roteiros e processos com território, fonte e resultado. Quem testa, registra. Quem registra, multiplica."

**CTA principal:** `Enviar receita`
**CTA secundário (no card hover):** `Abrir no Drive`

## 4. Toolbar — placeholders

| Campo | Texto |
|---|---|
| Busca | `Buscar por título, território ou resumo` |
| Categoria | `Todas as categorias` |
| Status | `Todos os status` |
| Contador | `{n} registros` |

## 5. Dialog de upload

**Título:** `Enviar receita ao Movimento`
**Sub-título:**
> "Conte onde funcionou, quem testou e qual foi o resultado. Sem território e fonte, não publica."

**Labels:**

| Campo | Label | Placeholder |
|---|---|---|
| Título | `Título` | `Caso Pinheiros — janela fechada em 12 min` |
| Tipo | `Tipo` | (select) |
| Categoria | `Categoria` | (select) |
| Território | `Território` | `Bairro - UF` |
| Data do caso | `Data do caso` | (date picker) |
| Fonte | `Fonte` | `Quem viveu / Protetor responsável` |
| Resumo | `Resumo (até 280 caracteres)` | `Em uma frase: o que foi testado, onde, e qual o desfecho.` |
| Tags | `Tags (separadas por vírgula)` | `caixa-blindado, receita-certa` |
| Status | `Status` | (select) |
| Arquivo | `Arquivo` | (file picker) |
| Helper arquivo | — | `Até 20 MB. PDF, DOCX, TXT, PNG ou JPG.` |

**Botões:** `Cancelar` / `Publicar no Movimento`
**Botão loading:** `Enviando…`

## 6. Empty state

> **`Nenhuma receita ainda.`**
> Seja o primeiro Protetor a documentar um caso. Comece pela última janela que você fechou.

## 7. Empty com filtro ativo

> **`Nenhuma receita combina com esse filtro.`**
> Tente outro território ou limpe a busca. As receitas aparecem por ordem de publicação.
>
> `[Limpar filtros]`

## 8. Mensagens de erro

| Cenário | Mensagem |
|---|---|
| Sessão expirada | `Sua sessão expirou. Faça login pra continuar publicando.` |
| Arquivo grande/tipo | `Arquivo acima de 20 MB ou tipo não aceito. PDF, DOCX, TXT, PNG ou JPG.` |
| Metadado faltando | `Faltou {campo}. Toda receita precisa de território, fonte e resumo.` |
| Drive indisponível | `Não conseguimos publicar agora. Tente em alguns minutos — a receita que você digitou continua aqui.` |
| Rate limit | `Você publicou muitas receitas seguidas. Aguarde um minuto pra evitar duplicidade.` |
| Erro genérico | `Algo travou. A receita não foi publicada. Tente de novo — se persistir, fale com o time.` |

## 9. Toast de sucesso

> `Receita publicada no Movimento.`

(3 segundos, sem botão, sem ícone alarmante)

## 10. Confirmação de arquivar

> **`Arquivar essa receita?`**
> Ela some da grid mas fica no histórico. Você pode despublicar sem apagar o que aprendeu.
>
> `[Manter publicada]` `[Arquivar]`

## 11. Status — vocabulário (espelhar enum)

| Status | Significado editorial |
|---|---|
| `Rascunho` | O Protetor escreveu, mas ainda não submeteu à comunidade |
| `Em revisão` | Comunidade ou curadoria está validando território/fonte/desfecho |
| `Publicado` | Receita liberada para circular como referência |
| `Arquivado` | Receita perdeu validade ou foi substituída — mantida pelo histórico |

## 12. Reescrita do hero da seção Movimento (opcional, recomendado)

A seção Movimento começa com `Caixa Blindado.` — manter. O lead `Causa, doutrinas, ritos, símbolos e guardrails do movimento.` pode receber agora:

> `Causa, doutrinas, ritos, símbolos e as receitas certas de quem já fechou janela. Toda doutrina vira processo. Todo processo vira documento. Todo documento volta como aprendizado.`

(Decisão de Steve em NARRATIVA-MOVIMENTO.md — alinhar antes de aplicar.)

## 13. Tom check — antes de publicar qualquer string

- [ ] Tem verbo concreto?
- [ ] Tem território, fonte ou resultado citado?
- [ ] Recusa promessa absoluta (nada de "zero golpe", "garantia", "blindagem total")?
- [ ] Funciona se lido em voz alta no balcão?
- [ ] Cabe em 1 fôlego?

---
**Copy aprovado. Todas as strings estão no inglês neutro do Movimento: direto, calmo, preciso.**
