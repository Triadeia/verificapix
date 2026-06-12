insert into public.organizations (id, name, slug, timezone)
values ('00000000-0000-4000-8000-000000000001', 'Verifica Pix', 'verifica-pix', 'America/Bahia')
on conflict (slug) do update set name = excluded.name;

-- Perfis dependem de usuarios reais no Supabase Auth e sao criados pelo script
-- `painel/scripts/seed-supabase.ts`, que usa a secret key somente no servidor.
