# Google e Transcricoes

O MVP apresenta a arquitetura e a interface, sem credenciais reais.

Escopos previstos:

- Drive read-only
- Docs read-only
- Calendar read-only

Fluxo: consentimento OAuth, callback HTTPS, tokens criptografados, sincronizacao
registrada e botao de desconexao. Quando Meet nao disponibilizar transcricao,
usar anexos do Calendar, busca no Drive, link de Docs ou upload manual.
