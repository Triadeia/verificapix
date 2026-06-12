import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function LoginPage() {
  if (await getSession()) redirect("/app/dashboard");

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-[var(--navy)] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-12 size-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <Image src="/brand/verificapix-symbol-white.svg" width={44} height={44} alt="" />
          <div>
            <p className="font-heading text-xl font-bold">Verifica Pix</p>
            <p className="text-xs text-slate-300">Central empresarial</p>
          </div>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Inteligência operacional</p>
          <h1 className="font-heading text-5xl font-semibold leading-[1.08]">
            Reuniões viram decisões. Decisões viram execução.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Uma base viva para organizar o time, transformar transcrições em planos e manter o MVP em movimento.
          </p>
        </div>
        <p className="relative text-sm text-slate-400">Antes de liberar o produto, verifique o Pix.</p>
      </section>
      <section className="relative flex items-center justify-center p-6">
        <div className="absolute right-6 top-6"><ThemeSwitcher /></div>
        <div className="glass w-full max-w-md rounded-[2rem] p-8 sm:p-10">
          <p className="text-sm font-bold text-emerald-700">Acesso interno</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold">Bem-vindo de volta</h2>
          <p className="mb-8 mt-3 text-sm leading-6 text-slate-500">Entre com seu perfil para acessar prioridades, reuniões e tarefas.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
