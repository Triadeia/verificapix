import Link from "next/link";
import { AlertTriangle, ArrowUpRight, BookOpenText, BrainCircuit, CalendarDays, CheckCircle2, Clock3, FileText, ListTodo, Target, Users } from "lucide-react";
import { getDashboardData } from "@/lib/repositories";
import { Badge, MetricCard, PageHeader } from "@/components/page-parts";

export default async function DashboardPage() {
  const { meetings, projects, tasks } = await getDashboardData();
  const open = tasks.filter((task) => !["Concluída", "Cancelada"].includes(task.status));
  const completed = tasks.filter((task) => task.status === "Concluída");
  const blocked = tasks.filter((task) => task.status === "Bloqueada");

  return (
    <div>
      <PageHeader eyebrow="Visão empresarial" title="O que pede decisão agora." description="Prioridades, reuniões e conhecimento reunidos em uma leitura operacional." />
      <section className="panel grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-[var(--border)] sm:[&>*:not(:last-child)]:border-r xl:[&>*:not(:last-child)]:border-b-0">
        <MetricCard label="Reuniões cadastradas" value={meetings.length} note="2 processadas pela IA" icon={CalendarDays} />
        <MetricCard label="Tarefas abertas" value={open.length} note="6 de alta prioridade" icon={ListTodo} tone="blue" />
        <MetricCard label="Tarefas críticas" value={blocked.length + 2} note="1 bloqueio ativo" icon={AlertTriangle} tone="red" />
        <MetricCard label="Concluídas" value={completed.length} note="Nesta semana" icon={CheckCircle2} tone="green" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <div><h2 className="font-heading text-lg font-semibold">Próximas prioridades</h2><p className="text-xs text-slate-500">Ordenadas por impacto e urgência</p></div>
              <Link href="/app/tarefas" className="text-sm font-bold text-emerald-700">Ver tarefas</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4">
                  <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold">{task.score}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.project} · {task.assignee}</p>
                  </div>
                  <Badge tone={task.priority === "Urgente" ? "red" : "amber"}>{task.priority}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="panel p-5">
              <div className="mb-5 flex items-center justify-between"><h2 className="font-heading font-semibold">Últimas reuniões</h2><CalendarDays className="size-5 text-emerald-600" /></div>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Link key={meeting.id} href={`/app/reunioes/${meeting.id}`} className="block rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/30">
                    <p className="text-sm font-bold">{meeting.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{meeting.date} · {meeting.participants.length} participantes</p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="panel p-5">
              <div className="mb-5 flex items-center justify-between"><h2 className="font-heading font-semibold">Roadmap Verifica Pix</h2><Target className="size-5 text-emerald-600" /></div>
              <div className="space-y-4">
                {projects.slice(0, 4).map((project) => (
                  <div key={project.id}>
                    <div className="mb-2 flex justify-between text-xs"><span className="font-bold">{project.name}</span><span>{project.progress}%</span></div>
                    <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${project.progress}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[1.5rem] bg-[var(--navy)] p-6 text-white shadow-xl shadow-slate-900/10">
            <div className="mb-8 flex items-center justify-between"><div className="grid size-11 place-items-center rounded-2xl bg-emerald-400 text-[var(--navy)]"><BrainCircuit /></div><Badge tone="green">Atualizado agora</Badge></div>
            <p className="text-sm font-bold text-emerald-300">Sugestão da IA</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">Resolva o bloqueio de auditoria antes de ampliar integrações.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">Os eventos de auditoria sustentam Google, ClickUp e ações em lote do Chat de Comando.</p>
            <button className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-300">Criar plano de execução <ArrowUpRight className="size-4" /></button>
          </div>
          <div className="panel p-5">
            <h2 className="font-heading font-semibold">Resumo da semana</h2>
            <div className="mt-5 space-y-4">
              {[
                [CheckCircle2, "3 entregas concluídas", "text-emerald-600"],
                [FileText, "5 documentos estratégicos", "text-blue-600"],
                [Clock3, "2 prazos nos próximos 7 dias", "text-amber-600"],
                [Users, "6 responsáveis ativos", "text-violet-600"],
              ].map(([Icon, text, color]) => {
                const ItemIcon = Icon as typeof CheckCircle2;
                return <div key={String(text)} className="flex items-center gap-3 text-sm font-semibold"><ItemIcon className={`size-5 ${color}`} />{String(text)}</div>;
              })}
            </div>
          </div>
          <Link href="/app/marca" className="panel panel-interactive block p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">Marca & Design</p>
                <h2 className="mt-3 font-heading text-xl font-semibold">Brand System 3.0</h2>
                <p className="muted mt-2 text-sm leading-6">Estratégia, componentes e Caixa Blindado agora vivem dentro do painel.</p>
              </div>
              <BookOpenText className="size-5 text-emerald-600" />
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold">Abrir sistema <ArrowUpRight className="size-4" /></span>
          </Link>
        </div>
      </section>
    </div>
  );
}
