# DATA-SCHEMA.md — Esquema de metadados
**Agente:** @data-denise (AIOS Data Engineer)
**Status:** Migration validada, pronto para `supabase db push`
**Data:** 2026-06-14

---

## 1. Tabela `movement_documents`

```sql
-- Migration: 20260614120000_movement_documents.sql
create extension if not exists "uuid-ossp";

create table if not exists public.movement_documents (
  id                  uuid primary key default uuid_generate_v4(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  title               text not null check (char_length(title) between 3 and 160),
  kind                text not null check (kind in ('Caso','Roteiro','Processo','Evidência','Manifesto','Outro')),
  category            text not null check (category in ('Doutrina','Operação','Comunicação','Resultado')),
  territory           text not null check (char_length(territory) between 2 and 80),
  occurred_at         date,
  source              text not null check (char_length(source) between 2 and 120),
  status              text not null default 'Rascunho' check (status in ('Rascunho','Em revisão','Publicado','Arquivado')),
  summary             text not null check (char_length(summary) <= 280),
  tags                text[] not null default '{}'::text[] check (array_length(tags, 1) is null or array_length(tags, 1) <= 8),
  drive_file_id       text not null,
  drive_web_view_link text not null,
  mime_type           text not null,
  byte_size           bigint not null check (byte_size > 0 and byte_size <= 20971520),
  created_by          uuid not null references auth.users(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index movement_documents_org_idx        on public.movement_documents (organization_id, created_at desc);
create index movement_documents_status_idx     on public.movement_documents (status) where status <> 'Arquivado';
create index movement_documents_category_idx   on public.movement_documents (category);
create index movement_documents_territory_idx  on public.movement_documents using gin (territory gin_trgm_ops);
create index movement_documents_tags_idx       on public.movement_documents using gin (tags);
create index movement_documents_search_idx     on public.movement_documents using gin (
  to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(territory, ''))
);

create unique index movement_documents_drive_unique on public.movement_documents (drive_file_id);
```

Habilitar trigram pra busca em território:
```sql
create extension if not exists pg_trgm;
```

## 2. Trigger `updated_at`

```sql
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

create trigger movement_documents_touch
before update on public.movement_documents
for each row execute function public.touch_updated_at();
```

## 3. RLS policies

```sql
alter table public.movement_documents enable row level security;

-- SELECT: usuário só vê documentos da sua organização
create policy movement_documents_select on public.movement_documents
for select using (
  organization_id in (
    select organization_id from public.profiles where id = auth.uid()
  )
);

-- INSERT: autenticado da mesma org, created_by = self
create policy movement_documents_insert on public.movement_documents
for insert with check (
  created_by = auth.uid()
  and organization_id in (
    select organization_id from public.profiles where id = auth.uid()
  )
);

-- UPDATE: autor ou role admin/editor da mesma org
create policy movement_documents_update on public.movement_documents
for update using (
  organization_id in (
    select organization_id from public.profiles where id = auth.uid()
  )
  and (
    created_by = auth.uid()
    or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','editor'))
  )
);

-- DELETE (hard): somente admin (soft-delete vira UPDATE de status)
create policy movement_documents_delete on public.movement_documents
for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
```

## 4. View para listagem pública (filtrando arquivados)

```sql
create view public.movement_documents_active as
select * from public.movement_documents where status <> 'Arquivado';
```

## 5. Validações no app (Zod) — espelhadas

| Campo | Mínimo | Máximo | Enum |
|---|---|---|---|
| title | 3 | 160 | — |
| kind | — | — | Caso/Roteiro/Processo/Evidência/Manifesto/Outro |
| category | — | — | Doutrina/Operação/Comunicação/Resultado |
| territory | 2 | 80 | — |
| source | 2 | 120 | — |
| status | — | — | Rascunho/Em revisão/Publicado/Arquivado |
| summary | 0 | 280 | — |
| tags | — | 8 itens | string 1..30 |
| byte_size | 1 | 20 MB | — |

## 6. Seed para dev (`scripts/seed-movement-documents.ts`)

```ts
import { createAdminClient } from "@/lib/supabase/admin";

const sb = createAdminClient();
await sb.from("movement_documents").insert([
  {
    organization_id: "<org-uuid>",
    title: "Caso Pinheiros — Janela fechada em 12 min",
    kind: "Caso", category: "Resultado", territory: "Pinheiros-SP",
    occurred_at: "2026-04-12", source: "Mercadinho do Tio Zé",
    status: "Publicado",
    summary: "Funcionário recém-treinado aplicou a receita e impediu entrega com comprovante falso.",
    tags: ["caixa-blindado", "receita-certa"],
    drive_file_id: "seed-1", drive_web_view_link: "https://drive.example/seed-1",
    mime_type: "application/pdf", byte_size: 124500,
    created_by: "<user-uuid>",
  },
]);
```

## 7. Plano de rollback

```sql
drop view if exists public.movement_documents_active;
drop trigger if exists movement_documents_touch on public.movement_documents;
drop table if exists public.movement_documents;
```

## 8. Decisões e justificativas

| Decisão | Razão |
|---|---|
| Não armazenar bytes no Supabase Storage | Drive é a fonte de verdade do time; evita duplicação |
| `drive_file_id` UNIQUE | Garante 1:1 com Drive; previne metadados órfãos |
| `tags` como `text[]` (não tabela separada) | Volume pequeno, GIN index resolve busca |
| Soft-delete via `status='Arquivado'` | Preserva histórico narrativo do movimento |
| FTS portuguese | Receitas circulam em PT-BR; reduz ruído de stemming |
| `byte_size` limit 20 MB | Mesma cota do upload route existente |

---
**Aprovado para implementação.**
