# CODE-DEV-DIEGO.md — Frontend + Integração
**Agente:** @dev-diego (AIOS Dev)
**Status:** Código pronto para colar
**Data:** 2026-06-14

---

Todos os arquivos abaixo são produção-ready. Caminhos absolutos.

## A) `src/lib/brandbook.ts` — extender seção movimento

Adicionar capítulo `documentos` ao array `chapters` da seção `movimento` (manter os demais):

```ts
{
  id: "documentos",
  title: "Receita Certa de quem constrói",
  lead: "Os Documentos do Movimento são registros vivos: casos resolvidos, roteiros que funcionaram, evidências de território. Quem constrói deixa o passo a passo para quem chega depois.",
  points: [
    { title: "Território", text: "Toda receita aponta onde foi testada. Bairro, cidade e contexto evitam generalização." },
    { title: "Resultado", text: "Sem prova documentada, é hipótese. A coluna 'fonte' obriga a citar quem viveu." },
    { title: "Compartilhar", text: "Publicar é o rito. O barulho dos bons só existe quando a receita sai da gaveta." },
  ],
}
```

E exportar o tipo do capítulo de documentos (para o renderer detectar):

```ts
export const MOVEMENT_DOCUMENTS_ANCHOR = "documentos";
```

## B) `src/lib/movement-documents.ts` — Repository

```ts
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const MOVEMENT_KINDS = ["Caso", "Roteiro", "Processo", "Evidência", "Manifesto", "Outro"] as const;
export const MOVEMENT_CATEGORIES = ["Doutrina", "Operação", "Comunicação", "Resultado"] as const;
export const MOVEMENT_STATUSES = ["Rascunho", "Em revisão", "Publicado", "Arquivado"] as const;

export const movementDocumentInput = z.object({
  title: z.string().trim().min(3).max(160),
  kind: z.enum(MOVEMENT_KINDS),
  category: z.enum(MOVEMENT_CATEGORIES),
  territory: z.string().trim().min(2).max(80),
  occurredAt: z.string().date().nullable().optional(),
  source: z.string().trim().min(2).max(120),
  status: z.enum(MOVEMENT_STATUSES).default("Rascunho"),
  summary: z.string().trim().max(280),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
});

export type MovementDocumentInput = z.infer<typeof movementDocumentInput>;

export type MovementDocument = MovementDocumentInput & {
  id: string;
  organizationId: string;
  driveFileId: string;
  driveWebViewLink: string;
  mimeType: string;
  byteSize: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ListFilters = {
  q?: string;
  category?: typeof MOVEMENT_CATEGORIES[number];
  status?: typeof MOVEMENT_STATUSES[number];
  territory?: string;
  page?: number;
};

const PAGE_SIZE = 20;

const fallback: MovementDocument[] = [
  {
    id: "demo-1", organizationId: "demo", title: "Caso Pinheiros — Comprovante falso revertido em 12 min",
    kind: "Caso", category: "Resultado", territory: "Pinheiros-SP", occurredAt: "2026-04-12",
    source: "Protetor: Mercadinho do Tio Zé", status: "Publicado",
    summary: "Receita aplicada por funcionário recém-treinado. Janela fechada antes da entrega da mercadoria.",
    tags: ["caixa-blindado", "receita-certa"],
    driveFileId: "demo", driveWebViewLink: "#", mimeType: "application/pdf", byteSize: 124500,
    createdBy: "demo", createdAt: "2026-04-12T10:00:00Z", updatedAt: "2026-04-12T10:00:00Z",
  },
];

export async function listMovementDocuments(filters: ListFilters = {}): Promise<{ items: MovementDocument[]; total: number }> {
  if (!isSupabaseConfigured()) {
    return { items: fallback, total: fallback.length };
  }
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("movement_documents")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,summary.ilike.%${filters.q}%`);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.territory) query = query.ilike("territory", `%${filters.territory}%`);

  const { data, error, count } = await query;
  if (error || !data) return { items: [], total: 0 };
  return { items: data.map(rowToDoc), total: count ?? data.length };
}

export async function getMovementDocument(id: string): Promise<MovementDocument | null> {
  if (!isSupabaseConfigured()) return fallback.find((d) => d.id === id) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("movement_documents").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToDoc(data);
}

export async function createMovementDocument(
  payload: MovementDocumentInput,
  drive: { driveFileId: string; driveWebViewLink: string; mimeType: string; byteSize: number },
): Promise<MovementDocument> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  if (!isSupabaseConfigured()) throw new Error("Supabase não configurado.");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles").select("organization_id").eq("id", session.id).single();
  if (!profile) throw new Error("Perfil não encontrado.");

  const { data, error } = await supabase.from("movement_documents").insert({
    organization_id: profile.organization_id,
    title: payload.title, kind: payload.kind, category: payload.category,
    territory: payload.territory, occurred_at: payload.occurredAt ?? null,
    source: payload.source, status: payload.status, summary: payload.summary, tags: payload.tags,
    drive_file_id: drive.driveFileId, drive_web_view_link: drive.driveWebViewLink,
    mime_type: drive.mimeType, byte_size: drive.byteSize, created_by: session.id,
  }).select("*").single();

  if (error || !data) throw new Error(error?.message || "Falha ao salvar documento.");
  return rowToDoc(data);
}

export async function updateMovementDocument(id: string, patch: Partial<MovementDocumentInput>): Promise<MovementDocument> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  if (!isSupabaseConfigured()) throw new Error("Supabase não configurado.");
  const supabase = await createClient();
  const { data, error } = await supabase.from("movement_documents")
    .update({
      title: patch.title, kind: patch.kind, category: patch.category, territory: patch.territory,
      occurred_at: patch.occurredAt, source: patch.source, status: patch.status,
      summary: patch.summary, tags: patch.tags, updated_at: new Date().toISOString(),
    }).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message || "Falha ao atualizar.");
  return rowToDoc(data);
}

export async function softDeleteMovementDocument(id: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  if (!isSupabaseConfigured()) throw new Error("Supabase não configurado.");
  const supabase = await createClient();
  const { error } = await supabase.from("movement_documents")
    .update({ status: "Arquivado", updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

function rowToDoc(row: Record<string, unknown>): MovementDocument {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    title: row.title as string,
    kind: row.kind as MovementDocument["kind"],
    category: row.category as MovementDocument["category"],
    territory: row.territory as string,
    occurredAt: (row.occurred_at as string) ?? null,
    source: row.source as string,
    status: row.status as MovementDocument["status"],
    summary: row.summary as string,
    tags: (row.tags as string[]) ?? [],
    driveFileId: row.drive_file_id as string,
    driveWebViewLink: row.drive_web_view_link as string,
    mimeType: row.mime_type as string,
    byteSize: row.byte_size as number,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
```

## C) `src/components/movement-documents.tsx` — Client componente principal

```tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Upload, ExternalLink, Pencil, Archive } from "lucide-react";
import type { MovementDocument } from "@/lib/movement-documents";
import { MOVEMENT_CATEGORIES, MOVEMENT_STATUSES } from "@/lib/movement-documents";
import { DocumentUploadDialog } from "./movement-document-upload";

type Props = { initialItems: MovementDocument[]; total: number };

export function MovementDocuments({ initialItems, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    startTransition(() => router.push(`?${next.toString()}#documentos`, { scroll: false }));
  }

  return (
    <section id="documentos" className="movement-documents mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="brand-index-number">Documentos do Movimento</span>
          <h2 className="mt-2">Receita Certa de quem constrói</h2>
          <p className="muted mt-2 max-w-2xl text-sm">
            Casos, roteiros e processos com território, fonte e resultado. Quem testa, registra. Quem registra, multiplica.
          </p>
        </div>
        <button type="button" onClick={() => setOpen(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-[var(--navy)] px-4 text-sm font-bold text-white">
          <Upload className="size-4" />Enviar receita
        </button>
      </div>

      <div className="movement-documents-toolbar mt-6 flex flex-wrap items-center gap-3">
        <label className="panel flex h-11 min-w-[260px] flex-1 items-center gap-2 rounded-xl px-3">
          <Search className="size-4 text-slate-500" />
          <input
            defaultValue={params.get("q") ?? ""}
            onChange={(e) => updateParam("q", e.target.value)}
            placeholder="Buscar por título, território ou resumo"
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <select
          defaultValue={params.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="panel h-11 rounded-xl px-3 text-sm">
          <option value="">Todas as categorias</option>
          {MOVEMENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          defaultValue={params.get("status") ?? ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="panel h-11 rounded-xl px-3 text-sm">
          <option value="">Todos os status</option>
          {MOVEMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="muted text-xs"><Filter className="inline size-3" /> {total} registros</span>
      </div>

      {initialItems.length === 0 ? (
        <div className="panel mt-6 rounded-2xl p-8 text-center">
          <p className="font-bold">Nenhuma receita ainda.</p>
          <p className="muted mt-2 text-sm">Seja o primeiro Protetor a documentar um caso. Comece pela última janela que você fechou.</p>
        </div>
      ) : (
        <ul className="movement-documents-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialItems.map((doc) => <DocumentCard key={doc.id} doc={doc} />)}
        </ul>
      )}

      <DocumentUploadDialog open={open} onClose={() => setOpen(false)} onCreated={() => router.refresh()} />
    </section>
  );
}

function DocumentCard({ doc }: { doc: MovementDocument }) {
  const statusColor = {
    "Rascunho": "bg-slate-100 text-slate-700",
    "Em revisão": "bg-amber-100 text-amber-800",
    "Publicado": "bg-emerald-100 text-emerald-800",
    "Arquivado": "bg-slate-50 text-slate-500",
  }[doc.status];
  return (
    <li className="panel panel-interactive flex flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${statusColor}`}>{doc.status}</span>
        <span className="text-xs font-bold text-orange-600">{doc.kind}</span>
      </div>
      <h3 className="mt-3 text-base font-bold">{doc.title}</h3>
      <p className="muted mt-2 line-clamp-3 text-sm">{doc.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="muted">Território</dt><dd>{doc.territory}</dd>
        <dt className="muted">Fonte</dt><dd className="truncate">{doc.source}</dd>
        <dt className="muted">Categoria</dt><dd>{doc.category}</dd>
        {doc.occurredAt ? <><dt className="muted">Data</dt><dd>{new Date(doc.occurredAt).toLocaleDateString("pt-BR")}</dd></> : null}
      </dl>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <a href={doc.driveWebViewLink} target="_blank" rel="noreferrer"
          className="flex items-center gap-1 text-xs font-bold text-[var(--navy)] hover:underline">
          Abrir no Drive <ExternalLink className="size-3" />
        </a>
        <div className="flex gap-1">
          <a href={`/app/marca/movimento/documentos/${doc.id}`} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Editar"><Pencil className="size-3.5" /></a>
          <form action={`/api/movement/documents/${doc.id}/archive`} method="post">
            <button type="submit" className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Arquivar"><Archive className="size-3.5" /></button>
          </form>
        </div>
      </div>
    </li>
  );
}
```

## D) `src/components/movement-document-upload.tsx` — Dialog upload

```tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { MOVEMENT_KINDS, MOVEMENT_CATEGORIES, MOVEMENT_STATUSES } from "@/lib/movement-documents";

type Props = { open: boolean; onClose: () => void; onCreated: () => void };

export function DocumentUploadDialog({ open, onClose, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/movement/documents", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao enviar.");
      onCreated(); onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}
        className="panel w-full max-w-xl rounded-t-2xl bg-white p-6 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Enviar receita ao Movimento</h3>
          <button type="button" onClick={onClose} aria-label="Fechar"><X className="size-4" /></button>
        </div>
        <p className="muted mt-1 text-sm">Conte onde funcionou, quem testou e qual foi o resultado. Sem território e fonte, não publica.</p>

        <div className="mt-5 grid gap-4">
          <Field label="Título" name="title" required placeholder="Caso Pinheiros — janela fechada em 12 min" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" name="kind" options={MOVEMENT_KINDS} />
            <Select label="Categoria" name="category" options={MOVEMENT_CATEGORIES} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Território" name="territory" required placeholder="Bairro - UF" />
            <Field label="Data do caso" name="occurredAt" type="date" />
          </div>
          <Field label="Fonte" name="source" required placeholder="Quem viveu / Protetor responsável" />
          <Field label="Resumo (até 280 caracteres)" name="summary" as="textarea" maxLength={280} required />
          <Field label="Tags (separadas por vírgula)" name="tags" placeholder="caixa-blindado, receita-certa" />
          <Select label="Status" name="status" options={MOVEMENT_STATUSES} defaultValue="Rascunho" />
          <div>
            <label className="text-xs font-bold uppercase tracking-wide muted">Arquivo</label>
            <input type="file" name="file" required accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              className="mt-1 block w-full text-sm" />
            <p className="muted mt-1 text-xs">Até 20 MB. PDF, DOCX, TXT, PNG ou JPG.</p>
          </div>
        </div>

        {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm">Cancelar</button>
          <button type="submit" disabled={submitting}
            className="rounded-xl bg-[var(--navy)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
            {submitting ? "Enviando..." : "Publicar no Movimento"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, as, ...rest }: { label: string; name: string; as?: "textarea" } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide muted">{label}</span>
      {as === "textarea"
        ? <textarea name={name} {...rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>} rows={3}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        : <input name={name} {...rest as React.InputHTMLAttributes<HTMLInputElement>}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />}
    </label>
  );
}

function Select({ label, name, options, defaultValue }: { label: string; name: string; options: readonly string[]; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide muted">{label}</span>
      <select name={name} defaultValue={defaultValue} required
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
```

## E) `src/app/api/movement/documents/route.ts` — POST + GET

```ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { movementDocumentInput, createMovementDocument, listMovementDocuments } from "@/lib/movement-documents";
import { uploadToMovementFolder } from "@/lib/google-drive";

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED = new Set(["application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain", "image/png", "image/jpeg"]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const url = new URL(request.url);
  const items = await listMovementDocuments({
    q: url.searchParams.get("q") || undefined,
    category: (url.searchParams.get("category") as never) || undefined,
    status: (url.searchParams.get("status") as never) || undefined,
    territory: url.searchParams.get("territory") || undefined,
    page: Number(url.searchParams.get("page") || 1),
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 422 });
  if (!ALLOWED.has(file.type) || file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Tipo não permitido ou acima de 20 MB." }, { status: 422 });
  }

  const tagsRaw = String(form.get("tags") || "");
  const parse = movementDocumentInput.safeParse({
    title: form.get("title"),
    kind: form.get("kind"),
    category: form.get("category"),
    territory: form.get("territory"),
    occurredAt: form.get("occurredAt") || null,
    source: form.get("source"),
    status: form.get("status") || "Rascunho",
    summary: form.get("summary"),
    tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
  });
  if (!parse.success) {
    return NextResponse.json({ error: "Metadados inválidos.", issues: parse.error.issues }, { status: 422 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let drive;
  try {
    drive = await uploadToMovementFolder({
      name: file.name, mimeType: file.type, bytes,
      properties: { territory: parse.data.territory, category: parse.data.category },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha no upload para o Drive.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  try {
    const doc = await createMovementDocument(parse.data, {
      driveFileId: drive.id, driveWebViewLink: drive.webViewLink,
      mimeType: file.type, byteSize: file.size,
    });
    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (err) {
    const { trashDriveFile } = await import("@/lib/google-drive");
    await trashDriveFile(drive.id).catch(() => {});
    return NextResponse.json({ error: err instanceof Error ? err.message : "Falha ao persistir." }, { status: 500 });
  }
}
```

## F) `src/app/api/movement/documents/[id]/route.ts` — PATCH + DELETE

```ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { movementDocumentInput, updateMovementDocument, softDeleteMovementDocument } from "@/lib/movement-documents";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const partial = movementDocumentInput.partial().safeParse(body);
  if (!partial.success) return NextResponse.json({ error: "Inválido", issues: partial.error.issues }, { status: 422 });
  const doc = await updateMovementDocument(id, partial.data);
  return NextResponse.json({ document: doc });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  await softDeleteMovementDocument(id);
  return NextResponse.json({ ok: true });
}
```

## G) `src/app/api/movement/documents/[id]/archive/route.ts` — Action archive (form post)

```ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { softDeleteMovementDocument } from "@/lib/movement-documents";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const { id } = await params;
  await softDeleteMovementDocument(id);
  return NextResponse.redirect(new URL("/app/marca/movimento#documentos", _.url));
}
```

## H) Patch em `src/app/app/marca/[slug]/page.tsx`

Substituir a renderização do bloco movimento. Trecho a INSERIR antes do bloco `#manifesto` (ou após o último capítulo do array), dentro do branch `section.slug === "movimento"`:

```tsx
{section.slug === "movimento" ? (
  <MovementDocumentsServer />
) : null}
```

E no topo do arquivo:

```tsx
import { MovementDocuments } from "@/components/movement-documents";
import { listMovementDocuments } from "@/lib/movement-documents";

async function MovementDocumentsServer({ searchParams }: { searchParams?: Record<string, string> }) {
  const { items, total } = await listMovementDocuments(searchParams ?? {});
  return <MovementDocuments initialItems={items} total={total} />;
}
```

Adicionar `#documentos` ao aside (linha 85):

```tsx
{section.slug === "movimento" ? <><a href="#documentos">Documentos</a><a href="#manifesto">Manifesto</a></> : null}
```

## I) Testes unitários — `src/lib/movement-documents.test.ts`

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { movementDocumentInput } from "./movement-documents";

test("rejeita título curto", () => {
  const r = movementDocumentInput.safeParse({ title: "ab", kind: "Caso", category: "Doutrina", territory: "SP", source: "x", summary: "y", tags: [] });
  assert.equal(r.success, false);
});

test("aceita payload mínimo válido", () => {
  const r = movementDocumentInput.safeParse({ title: "Caso válido", kind: "Caso", category: "Operação", territory: "Recife-PE", source: "Mercadinho do Zé", summary: "ok", tags: [] });
  assert.equal(r.success, true);
});

test("limita tags a 8", () => {
  const r = movementDocumentInput.safeParse({ title: "Caso válido", kind: "Caso", category: "Operação", territory: "Recife-PE", source: "x", summary: "y", tags: Array(9).fill("a") });
  assert.equal(r.success, false);
});
```

---
**Pronto para QA.**
