# Painel Empresarial Verifica Pix

Aplicacao interna para reunioes, tarefas, projetos, inteligencia e funcionarios.

## Executar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Acesse `http://localhost:3000`.

## Acesso de demonstracao

- E-mail: `nilton@verificapix.local`
- Senha: `Verifica@2026`

Todos os seis funcionarios usam a mesma senha de demonstracao. Em producao real,
substitua a autenticacao local por um provedor com recuperacao de senha e MFA.

## Qualidade

```bash
npm run check
```

Executa lint, typecheck e build de producao.
