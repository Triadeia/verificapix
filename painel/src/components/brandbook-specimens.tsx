import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { BrandSection } from "@/lib/brandbook";

export function BrandSpecimens({ slug }: { slug: BrandSection["slug"] }) {
  if (slug === "cores") return <ColorSpecimens />;
  if (slug === "tipografia") return <TypeSpecimens />;
  if (slug === "layout") return <LayoutSpecimens />;
  if (slug === "componentes") return <ComponentSpecimens />;
  if (slug === "tabelas") return <TableSpecimen />;
  return null;
}

function ColorSpecimens() {
  const colors = [
    ["Verde de ação", "var(--primary)", "Ação, progresso e compatibilidade aparente"],
    ["Navy estrutural", "var(--navy)", "Navegação, foco e autoridade"],
    ["Âmbar de atenção", "var(--amber)", "Revisão manual e evidência incompleta"],
    ["Vermelho de risco", "var(--destructive)", "Interrupção e inconsistência relevante"],
  ];
  return (
    <section id="especimes">
      <h2>Tokens vivos</h2>
      <p className="mt-3">Os espécimes usam as variáveis do tema ativo. Alterne o tema no topo e observe a adaptação sem perder semântica.</p>
      <div className="specimen-grid mt-7">
        {colors.map(([name, color, use]) => (
          <article key={name} className="specimen">
            <div className="token-swatch" style={{ background: color }} />
            <h3 className="mt-4">{name}</h3>
            <p className="mt-2 text-sm">{use}</p>
            <code className="muted mt-4 block text-xs">{color}</code>
          </article>
        ))}
      </div>
    </section>
  );
}

function TypeSpecimens() {
  return (
    <section id="especimes">
      <h2>Espécimes tipográficos</h2>
      <div className="mt-7 space-y-4">
        <article className="specimen">
          <span className="brand-index-number">Sora 650 / Display</span>
          <p className="mt-5 font-heading text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Antes de liberar, verifique.</p>
        </article>
        <article className="specimen">
          <span className="brand-index-number">Plus Jakarta Sans / Interface</span>
          <p className="mt-5 max-w-2xl text-lg leading-8">Informação operacional precisa ser lida rápido, inclusive sob pressão e em telas pequenas.</p>
        </article>
        <article className="specimen">
          <span className="brand-index-number">Mono / Identificadores</span>
          <p className="mt-5 font-mono text-lg">E18236120A202606101432</p>
        </article>
      </div>
    </section>
  );
}

function LayoutSpecimens() {
  return (
    <section id="especimes">
      <h2>Escala e composição</h2>
      <div className="specimen mt-7 space-y-4">
        {[4, 8, 12, 16, 24, 32, 48, 64].map((size) => (
          <div key={size} className="grid grid-cols-[48px_1fr_50px] items-center gap-4">
            <code className="text-xs">{size / 4}</code>
            <span className="h-3 rounded-full bg-[var(--primary)]" style={{ width: `${Math.min(size * 5, 100)}%` }} />
            <span className="muted text-xs">{size}px</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComponentSpecimens() {
  const states = [
    [CheckCircle2, "Baixo risco aparente", "Nenhuma inconsistência relevante encontrada.", "text-emerald-600"],
    [AlertTriangle, "Atenção", "Alguns dados precisam de revisão.", "text-amber-600"],
    [Clock3, "Processando", "A análise ainda está em andamento.", "text-blue-600"],
    [XCircle, "Alto risco aparente", "Interrompa a entrega e confirme por outro canal.", "text-red-600"],
  ] as const;
  return (
    <section id="especimes">
      <h2>Estados operacionais</h2>
      <div className="specimen-grid mt-7">
        {states.map(([Icon, title, text, color]) => (
          <article key={title} className="specimen">
            <Icon className={`size-6 ${color}`} aria-hidden="true" />
            <h3 className="mt-5">{title}</h3>
            <p className="mt-2 text-sm">{text}</p>
          </article>
        ))}
      </div>
      <div className="specimen mt-4 flex flex-wrap gap-3">
        <button className="brand-action">Iniciar validação</button>
        <button className="brand-action brand-action-secondary">Ver evidências</button>
        <button className="theme-option">Cancelar</button>
      </div>
    </section>
  );
}

function TableSpecimen() {
  return (
    <section id="especimes">
      <h2>Tabela operacional</h2>
      <div className="panel mt-7 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead className="surface-soft">
            <tr>
              {["Análise", "Valor", "Operador", "Estado", "Próxima ação"].map((item) => <th key={item} className="p-4 text-xs font-extrabold uppercase tracking-wider">{item}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ["VP-48291", "R$ 1.249,90", "Caixa 02", "Atenção", "Confirmar no banco"],
              ["VP-48290", "R$ 89,00", "Caixa 01", "Baixo risco", "Revisar entrega"],
              ["VP-48289", "R$ 3.599,00", "Caixa 03", "Alto risco", "Interromper"],
            ].map((row) => <tr key={row[0]} className="border-t border-[var(--border)]">{row.map((cell) => <td key={cell} className="p-4">{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
