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
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.push(`?${next.toString()}#documentos`, { scroll: false }));
  }

  return (
    <section id="documentos" className="movement-documents">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="brand-index-number">Documentos do Movimento</span>
          <h2 className="mt-2">Receita Certa de quem constrói</h2>
          <p className="muted mt-2 max-w-2xl text-sm">
            Casos, roteiros e processos com território, fonte e resultado. Quem testa, registra.
            Quem registra, multiplica.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-[var(--navy)] px-4 text-sm font-bold text-white"
        >
          <Upload className="size-4" />
          Enviar receita
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
          className="panel h-11 rounded-xl px-3 text-sm"
        >
          <option value="">Todas as categorias</option>
          {MOVEMENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          defaultValue={params.get("status") ?? ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="panel h-11 rounded-xl px-3 text-sm"
        >
          <option value="">Todos os status</option>
          {MOVEMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="muted text-xs">
          <Filter className="inline size-3" /> {total} registros
        </span>
      </div>

      {initialItems.length === 0 ? (
        <div className="panel mt-6 rounded-2xl p-8 text-center">
          <p className="font-bold">Nenhuma receita ainda.</p>
          <p className="muted mt-2 text-sm">
            Seja o primeiro Protetor a documentar um caso. Comece pela última janela que você
            fechou.
          </p>
        </div>
      ) : (
        <ul className="movement-documents-grid mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialItems.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </ul>
      )}

      <DocumentUploadDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => router.refresh()}
      />
    </section>
  );
}

function DocumentCard({ doc }: { doc: MovementDocument }) {
  return (
    <li className="panel panel-interactive flex flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="movement-doc-status" data-status={doc.status}>
          {doc.status}
        </span>
        <span className="movement-doc-kind">{doc.kind}</span>
      </div>
      <h3 className="mt-3 text-base font-bold">{doc.title}</h3>
      <p className="muted mt-2 line-clamp-3 text-sm">{doc.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <dt className="muted">Território</dt>
        <dd>{doc.territory}</dd>
        <dt className="muted">Fonte</dt>
        <dd className="truncate">{doc.source}</dd>
        <dt className="muted">Categoria</dt>
        <dd>{doc.category}</dd>
        {doc.occurredAt ? (
          <>
            <dt className="muted">Data</dt>
            <dd>{new Date(doc.occurredAt).toLocaleDateString("pt-BR")}</dd>
          </>
        ) : null}
      </dl>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <a
          href={doc.driveWebViewLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs font-bold text-[var(--navy)] hover:underline"
        >
          Abrir no Drive <ExternalLink className="size-3" />
        </a>
        <div className="flex gap-1">
          <a
            href={`/app/marca/movimento/documentos/${doc.id}`}
            className="rounded-lg p-1.5 hover:bg-slate-100"
            aria-label="Editar"
          >
            <Pencil className="size-3.5" />
          </a>
          <form action={`/api/movement/documents/${doc.id}/archive`} method="post">
            <button
              type="submit"
              className="rounded-lg p-1.5 hover:bg-slate-100"
              aria-label="Arquivar"
            >
              <Archive className="size-3.5" />
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
