"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  MOVEMENT_KINDS,
  MOVEMENT_CATEGORIES,
  MOVEMENT_STATUSES,
} from "@/lib/movement-documents";

type Props = { open: boolean; onClose: () => void; onCreated: () => void };

export function DocumentUploadDialog({ open, onClose, onCreated }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/movement/documents", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao enviar.");
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="movement-doc-dialog w-full max-w-xl rounded-t-2xl p-6 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Enviar receita ao Movimento</h3>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <X className="size-4" />
          </button>
        </div>
        <p className="muted mt-1 text-sm">
          Conte onde funcionou, quem testou e qual foi o resultado. Sem território e fonte,
          não publica.
        </p>

        <div className="mt-5 grid gap-4">
          <Field
            label="Título"
            name="title"
            required
            placeholder="Caso Pinheiros — janela fechada em 12 min"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Tipo" name="kind" options={MOVEMENT_KINDS} />
            <Select label="Categoria" name="category" options={MOVEMENT_CATEGORIES} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Território" name="territory" required placeholder="Bairro - UF" />
            <Field label="Data do caso" name="occurredAt" type="date" />
          </div>
          <Field
            label="Fonte"
            name="source"
            required
            placeholder="Quem viveu / Protetor responsável"
          />
          <Field
            label="Resumo (até 280 caracteres)"
            name="summary"
            as="textarea"
            maxLength={280}
            required
          />
          <Field
            label="Tags (separadas por vírgula)"
            name="tags"
            placeholder="caixa-blindado, receita-certa"
          />
          <Select
            label="Status"
            name="status"
            options={MOVEMENT_STATUSES}
            defaultValue="Rascunho"
          />
          <div>
            <label className="text-xs font-bold uppercase tracking-wide muted">Arquivo</label>
            <input
              type="file"
              name="file"
              required
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              className="mt-1 block w-full text-sm"
            />
            <p className="muted mt-1 text-xs">Até 20 MB. PDF, DOCX, TXT, PNG ou JPG.</p>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[var(--navy)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {submitting ? "Enviando..." : "Publicar no Movimento"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  as,
  ...rest
}: {
  label: string;
  name: string;
  as?: "textarea";
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide muted">{label}</span>
      {as === "textarea" ? (
        <textarea
          name={name}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      ) : (
        <input
          name={name}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide muted">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
