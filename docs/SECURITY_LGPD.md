# Seguranca e LGPD

- Tokens e segredos devem existir somente em variaveis de ambiente.
- A sessao usa cookie HTTP-only, SameSite Lax e assinatura HMAC.
- A senha de demonstracao e validada contra hash scrypt e nao fica em texto puro no codigo.
- Google deve usar OAuth com escopos read-only e permitir desconexao.
- Uploads futuros devem validar MIME, extensao, tamanho e conteudo.
- Acoes em lote da IA devem exigir confirmacao.
- Persistencia futura deve incluir RBAC, RLS, audit logs, retencao e exclusao.
