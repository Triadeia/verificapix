"use client";

import { useState } from "react";
import { Plus, X, Loader2, CheckCircle2 } from "lucide-react";
import { createContact, createContactBatch } from "@/lib/leadership-actions";

interface ContactsQuickFormProps {
  organizationId: string;
  leadershipId: string;
  onSuccess?: (count: number) => void;
}

type InputMode = "single" | "batch" | "closed";

export function ContactsQuickForm({
  organizationId,
  leadershipId,
  onSuccess,
}: ContactsQuickFormProps) {
  const [mode, setMode] = useState<InputMode>("closed");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Single contact form
  const [singleForm, setSingleForm] = useState({
    full_name: "",
    phone: "",
    whatsapp: "",
    zone: "",
    neighborhood: "",
    tags: "",
    notes: "",
  });

  // Batch form (CSV-like)
  const [batchText, setBatchText] = useState("");
  const [batchHeaders, setBatchHeaders] = useState(false);

  // Handle single form input
  const handleSingleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSingleForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit single contact
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContact(organizationId, leadershipId, {
        full_name: singleForm.full_name,
        phone: singleForm.phone || undefined,
        whatsapp: singleForm.whatsapp || undefined,
        zone: singleForm.zone || undefined,
        neighborhood: singleForm.neighborhood || undefined,
        tags: singleForm.tags ? singleForm.tags.split(",").map((t) => t.trim()) : undefined,
        notes: singleForm.notes || undefined,
      });

      setSuccess(true);
      setSingleForm({
        full_name: "",
        phone: "",
        whatsapp: "",
        zone: "",
        neighborhood: "",
        tags: "",
        notes: "",
      });

      setTimeout(() => setSuccess(false), 2000);
      onSuccess?.(1);
    } catch (err) {
      console.error("Error creating contact:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit batch contacts
  const handleBatchSubmit = async () => {
    if (!batchText.trim()) return;

    setLoading(true);

    try {
      const lines = batchText.trim().split("\n");
      let startIdx = 0;

      // Skip header if checked
      if (batchHeaders && lines.length > 0) {
        startIdx = 1;
      }

      const contacts = lines.slice(startIdx).map((line) => {
        const parts = line.split(";").map((p) => p.trim());
        return {
          full_name: parts[0] || "",
          phone: parts[1] || undefined,
          whatsapp: parts[2] || undefined,
          zone: parts[3] || undefined,
          neighborhood: parts[4] || undefined,
        };
      });

      const validContacts = contacts.filter((c) => c.full_name);

      if (validContacts.length === 0) {
        alert("Nenhum contato válido encontrado");
        return;
      }

      await createContactBatch(organizationId, leadershipId, validContacts);

      setSuccess(true);
      setBatchText("");
      setTimeout(() => setSuccess(false), 2000);
      onSuccess?.(validContacts.length);
    } catch (err) {
      console.error("Error creating batch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Button */}
      {mode === "closed" && (
        <button
          onClick={() => setMode("single")}
          className="flex items-center justify-center gap-2 rounded-full bg-blue-600 p-4 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-110 dark:bg-blue-700 dark:hover:bg-blue-800"
          title="Adicionar contato rápido"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Form Panel */}
      {mode !== "closed" && (
        <div className="mb-4 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 dark:border-slate-800">
            <h3 className="font-semibold text-white">
              {mode === "single"
                ? "Adicionar Contato"
                : "Importar Múltiplos Contatos"}
            </h3>
            <button
              onClick={() => setMode("closed")}
              className="text-white transition-colors hover:bg-white/20 rounded-lg p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                <div className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Contato(s) adicionado(s) com sucesso!
                  </p>
                </div>
              </div>
            )}

            {mode === "single" ? (
              // Single Contact Form
              <form onSubmit={handleSingleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Nome completo *"
                  value={singleForm.full_name}
                  onChange={handleSingleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefone"
                  value={singleForm.phone}
                  onChange={handleSingleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="WhatsApp"
                  value={singleForm.whatsapp}
                  onChange={handleSingleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <input
                  type="text"
                  name="zone"
                  placeholder="Zona/Região"
                  value={singleForm.zone}
                  onChange={handleSingleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <input
                  type="text"
                  name="neighborhood"
                  placeholder="Bairro"
                  value={singleForm.neighborhood}
                  onChange={handleSingleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <textarea
                  name="notes"
                  placeholder="Observações (opcional)"
                  value={singleForm.notes}
                  onChange={handleSingleChange}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Contato"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("batch")}
                    className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg border border-slate-300 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Em Lote
                  </button>
                </div>
              </form>
            ) : (
              // Batch Import Form
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Cole dados no formato:<br />
                    <code className="text-xs">Nome; Telefone; WhatsApp; Zona; Bairro</code>
                  </p>
                </div>

                <textarea
                  placeholder={`João Silva; (71)99999-9999; (71)99999-9999; Centro; Candeias\nMaria Santos; (71)98888-8888; ; Zona Sul; Centro`}
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 font-mono focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={batchHeaders}
                    onChange={(e) => setBatchHeaders(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Primeira linha é cabeçalho
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={handleBatchSubmit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      "Importar"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("single")}
                    className="px-3 py-2 text-sm font-medium text-slate-700 rounded-lg border border-slate-300 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Um por Um
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
