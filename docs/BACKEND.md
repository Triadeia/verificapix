# Backend do Painel Empresarial

## Arquitetura

- Next.js mantém as rotas autenticadas e os adaptadores de integração.
- Supabase Auth gerencia sessões e usuários.
- Postgres com RLS isola cada organização.
- Supabase Storage guarda arquivos em caminhos iniciados pelo UUID da organização.
- OpenAI gera inteligência estruturada; sem chave, há um fallback local explícito.
- n8n recebe eventos com assinatura HMAC e pode devolver callbacks pela rota protegida.

## Segurança e LGPD

- A chave administrativa do Supabase existe somente no servidor.
- Todas as tabelas expostas têm RLS.
- Perfis ativos determinam organização e papel; metadados editáveis do usuário não autorizam ações.
- Logs de auditoria registram mudanças em projetos, reuniões, tarefas, documentos e integrações.
- Arquivos são privados, limitados a 20 MB e validados por MIME type.
- Segredos de integrações não são enviados ao navegador nem armazenados em texto aberto no repositório.
- A política de retenção e os prazos de descarte devem ser definidos antes do uso com dados pessoais reais.

## Implantação

1. Aplicar a migration em `supabase/migrations`.
2. Criar os usuários iniciais com `npm run seed:supabase`.
3. Configurar na Vercel as variáveis descritas em `painel/.env.example`.
4. Configurar no n8n o mesmo `N8N_WEBHOOK_SECRET`.
5. Validar login, upload, processamento de reunião e callback n8n em produção.

Google Drive, Google Docs, Google Meet e ClickUp permanecem como adapters futuros,
sem tokens falsos ou integrações parcialmente habilitadas.
