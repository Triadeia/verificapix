"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Copy, MessageSquare } from "lucide-react";
import { createMembership, generateInvitationCode } from "@/lib/leadership-actions";

type Step = "invitation" | "form" | "confirmation";

interface LeadersOnboardingProps {
  organizationId: string;
  currentUserRole: string;
  onSuccess?: () => void;
}

export function LeadersOnboarding({
  organizationId,
  currentUserRole,
  onSuccess,
}: LeadersOnboardingProps) {
  const [step, setStep] = useState<Step>("invitation");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Invitation step
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form step
  const [formData, setFormData] = useState({
    phone: "",
    whatsapp: "",
    full_name: "",
    zone_name: "",
    neighborhood: "",
  });

  const [createdMembership, setCreatedMembership] = useState<any>(null);

  // Generate invitation
  const handleGenerateInvitation = async () => {
    setLoading(true);
    setError(null);

    try {
      const code = await generateInvitationCode(organizationId, "community_leader");
      const link = `${window.location.origin}/app/lideres/cadastro?code=${code}`;

      setInvitationCode(code);
      setInvitationLink(link);
      setStep("form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar convite");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const membership = await createMembership(organizationId, {
        ...formData,
        intended_role: "community_leader",
      });

      setCreatedMembership(membership);
      setStep("confirmation");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar perfil");
    } finally {
      setLoading(false);
    }
  };

  // Copy to clipboard
  const handleCopyLink = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Send via WhatsApp
  const handleSendWhatsApp = () => {
    if (invitationLink) {
      const message = encodeURIComponent(
        `Oi! 👋\n\nVocê foi convidado para fazer parte da campanha do Dr. Pitágoras!\n\nClique aqui para se cadastrar:\n${invitationLink}\n\nVamos juntos construir a Bahia! 🇧🇷`
      );
      window.open(`https://wa.me/?text=${message}`, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Recrutar Líderes
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Convide apoiadores para se tornarem líderes comunitários da campanha
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Generate Invitation */}
      {step === "invitation" && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-6 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Passo 1: Gerar Convite
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Gere um link de convite único para enviar via WhatsApp, SMS ou link direto.
          </p>

          <button
            onClick={handleGenerateInvitation}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar Convite Único"
            )}
          </button>
        </div>
      )}

      {/* Step 2: Share Link */}
      {step === "form" && invitationLink && (
        <div className="space-y-4 rounded-lg border border-slate-200 p-6 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Passo 2: Compartilhar Convite
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Envie este link para o apoiador via WhatsApp ou SMS
          </p>

          {/* Link Display */}
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <p className="break-all text-sm font-mono text-slate-700 dark:text-slate-300">
              {invitationLink}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copiado!" : "Copiar Link"}
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <MessageSquare className="h-4 w-4" />
              Enviar no WhatsApp
            </button>
          </div>

          {/* Continue Button */}
          <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              onClick={() => setStep("form")}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Próximo: Cadastro Manual
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Manual Registration */}
      {step === "form" && (
        <form
          onSubmit={handleSubmitForm}
          className="space-y-4 rounded-lg border border-slate-200 p-6 dark:border-slate-800"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Passo 3: Dados do Líder
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nome Completo *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleFormChange}
                required
                placeholder="João da Silva"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Telefone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                required
                placeholder="(71) 99999-9999"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleFormChange}
                placeholder="(71) 99999-9999"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Zona / Região
              </label>
              <input
                type="text"
                name="zone_name"
                value={formData.zone_name}
                onChange={handleFormChange}
                placeholder="ex: Centro, Bairro do Recôncavo"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Bairro
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleFormChange}
                placeholder="ex: Candeias, Centro histórico"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando Perfil...
              </>
            ) : (
              "Criar Perfil do Líder"
            )}
          </button>
        </form>
      )}

      {/* Step 4: Confirmation */}
      {step === "confirmation" && createdMembership && (
        <div className="space-y-4 rounded-lg border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Líder Criado com Sucesso!
              </h3>
              <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                {createdMembership.full_name} ({createdMembership.whatsapp ||
                  createdMembership.phone}) está pronto para começar
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 border-t border-green-200 pt-4 dark:border-green-800">
            <button
              onClick={() => {
                setStep("invitation");
                setFormData({
                  phone: "",
                  whatsapp: "",
                  full_name: "",
                  zone_name: "",
                  neighborhood: "",
                });
                setInvitationCode(null);
                setInvitationLink(null);
                setCreatedMembership(null);
              }}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Convidar Outro Líder
            </button>

            <button
              onClick={() => (window.location.href = "/app/lideres")}
              className="rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-900 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-100 dark:hover:bg-green-900/40"
            >
              Ir para Painel de Líderes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
