import { PageHeader } from "@/components/page-parts";

export default function SettingsPage() {
  return <div><PageHeader eyebrow="Organização" title="Configurações" description="Preferências gerais, segurança e governança de dados." /><div className="grid gap-6 lg:grid-cols-2"><section className="panel p-6"><h2 className="font-heading text-lg font-semibold">Dados da organização</h2><div className="mt-5 space-y-4"><Field label="Nome" value="Verifica Pix" /><Field label="Domínio" value="verificapix.org" /><Field label="Fuso horário" value="America/Bahia" /></div></section><section className="panel p-6"><h2 className="font-heading text-lg font-semibold">Políticas de IA</h2><label className="mt-5 flex items-center justify-between rounded-xl border border-[var(--border)] p-4"><div><p className="text-sm font-bold">Confirmação em ações de lote</p><p className="mt-1 text-xs text-slate-500">Obrigatória para alterações em mais de 5 tarefas.</p></div><input type="checkbox" defaultChecked className="size-5 accent-emerald-600" /></label><label className="mt-3 flex items-center justify-between rounded-xl border border-[var(--border)] p-4"><div><p className="text-sm font-bold">Fallback local</p><p className="mt-1 text-xs text-slate-500">Usar respostas mockadas quando não houver provider.</p></div><input type="checkbox" defaultChecked className="size-5 accent-emerald-600" /></label></section></div></div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-bold text-slate-500">{label}</span><input defaultValue={value} className="h-11 w-full rounded-xl border border-[var(--border)] px-4 text-sm outline-none focus:border-emerald-400" /></label>;
}
