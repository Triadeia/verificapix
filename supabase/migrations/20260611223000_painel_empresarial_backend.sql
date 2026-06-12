create extension if not exists pgcrypto;
create extension if not exists vector;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create type public.app_role as enum ('owner', 'admin', 'manager', 'member', 'viewer');
create type public.meeting_status as enum ('draft', 'scheduled', 'processing', 'processed', 'review', 'archived');
create type public.task_status as enum ('backlog', 'todo', 'in_progress', 'review', 'blocked', 'done', 'cancelled');
create type public.task_priority as enum ('urgent', 'high', 'medium', 'low');
create type public.project_status as enum ('backlog', 'planning', 'in_progress', 'review', 'done', 'paused', 'cancelled');
create type public.integration_provider as enum ('google', 'clickup', 'n8n', 'openai', 'vercel_ai');
create type public.sync_status as enum ('pending', 'running', 'success', 'failed', 'cancelled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'America/Bahia',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.app_role not null default 'member',
  area text,
  avatar_path text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, email)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete set null,
  status public.project_status not null default 'planning',
  progress smallint not null default 0 check (progress between 0 and 100),
  start_date date,
  due_date date,
  next_steps text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz,
  source text not null default 'manual',
  external_url text,
  status public.meeting_status not null default 'draft',
  tags text[] not null default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meeting_participants (
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  attended boolean not null default true,
  primary key (meeting_id, profile_id)
);

create table public.meeting_transcripts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  content text,
  storage_path text,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size between 0 and 20971520),
  source_url text,
  language text default 'pt-BR',
  checksum text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.meeting_summaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  executive_summary text,
  strategic_summary text,
  next_steps text[] not null default '{}',
  next_agenda text[] not null default '{}',
  product_insights text[] not null default '{}',
  marketing_insights text[] not null default '{}',
  operations_insights text[] not null default '{}',
  pending_questions text[] not null default '{}',
  model text,
  prompt_version text,
  created_at timestamptz not null default now(),
  unique (meeting_id)
);

create table public.meeting_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  title text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete set null,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.meeting_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  kind text not null check (kind in ('risk', 'opportunity')),
  title text not null,
  description text,
  severity text check (severity is null or severity in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  meeting_id uuid references public.meetings(id) on delete set null,
  parent_task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  description text,
  status public.task_status not null default 'backlog',
  priority public.task_priority not null default 'medium',
  assignee_id uuid references public.profiles(id) on delete set null,
  creator_id uuid references public.profiles(id) on delete set null,
  area text,
  due_at timestamptz,
  estimated_effort numeric(8,2),
  impact smallint check (impact is null or impact between 1 and 10),
  ai_score smallint check (ai_score is null or ai_score between 0 and 100),
  tags text[] not null default '{}',
  clickup_task_id text,
  clickup_url text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, clickup_task_id)
);

create table public.task_dependencies (
  task_id uuid not null references public.tasks(id) on delete cascade,
  depends_on_task_id uuid not null references public.tasks(id) on delete cascade,
  primary key (task_id, depends_on_task_id),
  check (task_id <> depends_on_task_id)
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_checklist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  meeting_id uuid references public.meetings(id) on delete set null,
  title text not null,
  description text,
  document_type text not null default 'document',
  storage_path text,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size between 0 and 20971520),
  checksum text,
  tags text[] not null default '{}',
  summary text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.document_chunks (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  metadata jsonb not null default '{}',
  embedding vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider public.integration_provider not null,
  status text not null default 'disconnected' check (status in ('disconnected', 'connected', 'error', 'disabled')),
  config jsonb not null default '{}',
  connected_by uuid references public.profiles(id) on delete set null,
  connected_at timestamptz,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider)
);

create table public.integration_secrets (
  integration_id uuid primary key references public.integrations(id) on delete cascade,
  encrypted_payload text not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);
revoke all on public.integration_secrets from anon, authenticated;

create table public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  integration_id uuid references public.integrations(id) on delete set null,
  provider public.integration_provider not null,
  operation text not null,
  entity_type text,
  entity_id text,
  status public.sync_status not null default 'pending',
  request_id text,
  attempt integer not null default 1,
  input_summary jsonb not null default '{}',
  output_summary jsonb not null default '{}',
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table public.ai_outputs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  meeting_id uuid references public.meetings(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  operation text not null,
  provider text not null,
  model text not null,
  prompt_version text,
  input_hash text,
  output jsonb not null,
  tokens_input integer,
  tokens_output integer,
  latency_ms integer,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations(id) on delete set null,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index profiles_organization_idx on public.profiles (organization_id);
create index projects_organization_status_idx on public.projects (organization_id, status);
create index meetings_organization_starts_idx on public.meetings (organization_id, starts_at desc);
create index transcripts_meeting_idx on public.meeting_transcripts (meeting_id);
create index tasks_organization_status_due_idx on public.tasks (organization_id, status, due_at);
create index tasks_assignee_idx on public.tasks (assignee_id, status);
create index documents_organization_created_idx on public.documents (organization_id, created_at desc);
create index document_chunks_document_idx on public.document_chunks (document_id, chunk_index);
create index document_chunks_embedding_idx on public.document_chunks using hnsw (embedding vector_cosine_ops);
create index audit_logs_organization_created_idx on public.audit_logs (organization_id, created_at desc);
create index sync_logs_organization_created_idx on public.sync_logs (organization_id, started_at desc);

create or replace function private.current_organization_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select organization_id from public.profiles where id = auth.uid() and active = true
$$;

create or replace function private.current_role()
returns public.app_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and active = true
$$;

create or replace function private.has_role(allowed public.app_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(private.current_role() = any(allowed), false)
$$;

create or replace function private.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.audit_row_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  org_id uuid;
  row_id text;
begin
  if tg_op = 'DELETE' then
    org_id := (to_jsonb(old)->>'organization_id')::uuid;
    row_id := to_jsonb(old)->>'id';
  else
    org_id := (to_jsonb(new)->>'organization_id')::uuid;
    row_id := to_jsonb(new)->>'id';
  end if;
  insert into public.audit_logs (organization_id, actor_id, action, entity_type, entity_id)
  values (org_id, auth.uid(), lower(tg_op), tg_table_name, row_id);
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function private.current_organization_id() from public;
revoke all on function private.current_role() from public;
revoke all on function private.has_role(public.app_role[]) from public;
grant usage on schema private to authenticated;
grant execute on function private.current_organization_id() to authenticated;
grant execute on function private.current_role() to authenticated;
grant execute on function private.has_role(public.app_role[]) to authenticated;

create trigger organizations_updated_at before update on public.organizations for each row execute function private.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger meetings_updated_at before update on public.meetings for each row execute function private.set_updated_at();
create trigger tasks_updated_at before update on public.tasks for each row execute function private.set_updated_at();
create trigger task_comments_updated_at before update on public.task_comments for each row execute function private.set_updated_at();
create trigger documents_updated_at before update on public.documents for each row execute function private.set_updated_at();
create trigger integrations_updated_at before update on public.integrations for each row execute function private.set_updated_at();

create trigger audit_projects after insert or update or delete on public.projects for each row execute function private.audit_row_change();
create trigger audit_meetings after insert or update or delete on public.meetings for each row execute function private.audit_row_change();
create trigger audit_tasks after insert or update or delete on public.tasks for each row execute function private.audit_row_change();
create trigger audit_documents after insert or update or delete on public.documents for each row execute function private.audit_row_change();
create trigger audit_integrations after insert or update or delete on public.integrations for each row execute function private.audit_row_change();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_participants enable row level security;
alter table public.meeting_transcripts enable row level security;
alter table public.meeting_summaries enable row level security;
alter table public.meeting_decisions enable row level security;
alter table public.meeting_insights enable row level security;
alter table public.tasks enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.task_comments enable row level security;
alter table public.task_checklist_items enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.integrations enable row level security;
alter table public.integration_secrets enable row level security;
alter table public.sync_logs enable row level security;
alter table public.ai_outputs enable row level security;
alter table public.audit_logs enable row level security;

create policy organizations_select on public.organizations for select to authenticated
using (id = private.current_organization_id());
create policy organizations_update on public.organizations for update to authenticated
using (id = private.current_organization_id() and private.has_role(array['owner']::public.app_role[]))
with check (id = private.current_organization_id());

create policy profiles_select on public.profiles for select to authenticated
using (organization_id = private.current_organization_id());
create policy profiles_update_self on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid() and organization_id = private.current_organization_id());
create policy profiles_manage on public.profiles for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin']::public.app_role[]));

create policy projects_select on public.projects for select to authenticated using (organization_id = private.current_organization_id());
create policy projects_write on public.projects for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]));

create policy meetings_select on public.meetings for select to authenticated using (organization_id = private.current_organization_id());
create policy meetings_write on public.meetings for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]));

create policy meeting_participants_select on public.meeting_participants for select to authenticated
using (exists (select 1 from public.meetings m where m.id = meeting_id and m.organization_id = private.current_organization_id()));
create policy meeting_participants_write on public.meeting_participants for all to authenticated
using (exists (select 1 from public.meetings m where m.id = meeting_id and m.organization_id = private.current_organization_id()) and private.has_role(array['owner','admin','manager']::public.app_role[]))
with check (exists (select 1 from public.meetings m where m.id = meeting_id and m.organization_id = private.current_organization_id()) and private.has_role(array['owner','admin','manager']::public.app_role[]));

create policy transcripts_select on public.meeting_transcripts for select to authenticated using (organization_id = private.current_organization_id());
create policy transcripts_write on public.meeting_transcripts for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]));

create policy summaries_select on public.meeting_summaries for select to authenticated using (organization_id = private.current_organization_id());
create policy summaries_write on public.meeting_summaries for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]));

create policy decisions_select on public.meeting_decisions for select to authenticated using (organization_id = private.current_organization_id());
create policy decisions_write on public.meeting_decisions for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]));

create policy insights_select on public.meeting_insights for select to authenticated using (organization_id = private.current_organization_id());
create policy insights_write on public.meeting_insights for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]));

create policy tasks_select on public.tasks for select to authenticated using (organization_id = private.current_organization_id());
create policy tasks_insert on public.tasks for insert to authenticated
with check (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]));
create policy tasks_update on public.tasks for update to authenticated
using (organization_id = private.current_organization_id() and (private.has_role(array['owner','admin','manager']::public.app_role[]) or assignee_id = auth.uid() or creator_id = auth.uid()))
with check (organization_id = private.current_organization_id());
create policy tasks_delete on public.tasks for delete to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]));

create policy task_dependencies_access on public.task_dependencies for all to authenticated
using (exists (select 1 from public.tasks t where t.id = task_id and t.organization_id = private.current_organization_id()))
with check (exists (select 1 from public.tasks t where t.id = task_id and t.organization_id = private.current_organization_id()));

create policy comments_select on public.task_comments for select to authenticated using (organization_id = private.current_organization_id());
create policy comments_insert on public.task_comments for insert to authenticated with check (organization_id = private.current_organization_id() and author_id = auth.uid());
create policy comments_update on public.task_comments for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy comments_delete on public.task_comments for delete to authenticated using (author_id = auth.uid() or private.has_role(array['owner','admin']::public.app_role[]));

create policy checklist_select on public.task_checklist_items for select to authenticated using (organization_id = private.current_organization_id());
create policy checklist_write on public.task_checklist_items for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]))
with check (organization_id = private.current_organization_id());

create policy documents_select on public.documents for select to authenticated using (organization_id = private.current_organization_id());
create policy documents_write on public.documents for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager','member']::public.app_role[]))
with check (organization_id = private.current_organization_id());

create policy chunks_select on public.document_chunks for select to authenticated using (organization_id = private.current_organization_id());
create policy chunks_manage on public.document_chunks for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin','manager']::public.app_role[]))
with check (organization_id = private.current_organization_id());

create policy integrations_select on public.integrations for select to authenticated using (organization_id = private.current_organization_id());
create policy integrations_manage on public.integrations for all to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner']::public.app_role[]))
with check (organization_id = private.current_organization_id() and private.has_role(array['owner']::public.app_role[]));

create policy sync_logs_select on public.sync_logs for select to authenticated using (organization_id = private.current_organization_id());
create policy ai_outputs_select on public.ai_outputs for select to authenticated using (organization_id = private.current_organization_id());
create policy audit_logs_select on public.audit_logs for select to authenticated
using (organization_id = private.current_organization_id() and private.has_role(array['owner','admin']::public.app_role[]));

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
revoke all on public.integration_secrets from authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'organization-files',
  'organization-files',
  false,
  20971520,
  array['text/plain','text/html','application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/png','image/jpeg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy storage_select_org_files on storage.objects for select to authenticated
using (bucket_id = 'organization-files' and (storage.foldername(name))[1] = private.current_organization_id()::text);
create policy storage_insert_org_files on storage.objects for insert to authenticated
with check (
  bucket_id = 'organization-files'
  and (storage.foldername(name))[1] = private.current_organization_id()::text
  and private.has_role(array['owner','admin','manager','member']::public.app_role[])
);
create policy storage_update_org_files on storage.objects for update to authenticated
using (bucket_id = 'organization-files' and (storage.foldername(name))[1] = private.current_organization_id()::text)
with check (bucket_id = 'organization-files' and (storage.foldername(name))[1] = private.current_organization_id()::text);
create policy storage_delete_org_files on storage.objects for delete to authenticated
using (
  bucket_id = 'organization-files'
  and (storage.foldername(name))[1] = private.current_organization_id()::text
  and private.has_role(array['owner','admin','manager']::public.app_role[])
);

create or replace function public.match_document_chunks(
  query_embedding vector(1536),
  match_count integer default 8
)
returns table (id bigint, document_id uuid, content text, metadata jsonb, similarity double precision)
language sql stable security invoker set search_path = '' as $$
  select dc.id, dc.document_id, dc.content, dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  where dc.organization_id = private.current_organization_id()
    and dc.embedding is not null
  order by dc.embedding <=> query_embedding
  limit least(match_count, 20)
$$;

grant execute on function public.match_document_chunks(vector, integer) to authenticated;
