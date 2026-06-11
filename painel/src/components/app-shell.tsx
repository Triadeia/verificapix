"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  FolderKanban,
  Gauge,
  ListTodo,
  LogOut,
  Menu,
  PlugZap,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import type { SessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/app/actions";

const navigation = [
  { href: "/app/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/app/reunioes", label: "Reuniões", icon: CalendarDays },
  { href: "/app/tarefas", label: "Tarefas", icon: ListTodo },
  { href: "/app/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/app/base-inteligencia", label: "Base de Inteligência", icon: BrainCircuit },
  { href: "/app/funcionarios", label: "Funcionários", icon: Users },
  { href: "/app/integracoes", label: "Integrações", icon: PlugZap },
  { href: "/app/configuracoes", label: "Configurações", icon: Settings },
];

export function AppShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--navy)] p-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-9 flex items-center justify-between">
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-emerald-400 font-heading text-xl font-bold text-[var(--navy)]">V</div>
            <div>
              <p className="font-heading font-bold">Verifica Pix</p>
              <p className="text-[11px] text-slate-400">Painel empresarial</p>
            </div>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar menu"><X /></button>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-emerald-400 text-[var(--navy)]" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-3">
            <CircleUserRound className="size-9 text-emerald-300" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="text-xs capitalize text-slate-400">{user.role}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white">
              <LogOut className="size-4" /> Sair
            </button>
          </form>
        </div>
      </aside>
      {open ? <button className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={() => setOpen(false)} aria-label="Fechar navegação" /> : null}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6">
          <div className="glass mx-auto flex h-16 max-w-[1500px] items-center gap-3 rounded-2xl px-4">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu"><Menu /></button>
            <div className="relative hidden max-w-lg flex-1 sm:block">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input className="h-9 w-full rounded-xl border border-transparent bg-slate-100/70 pl-9 pr-3 text-sm outline-none focus:border-emerald-300" placeholder="Buscar tarefas, reuniões e documentos..." />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:block">IA operacional ativa</span>
              <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold">
                {user.name}<ChevronDown className="size-4" />
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
