import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Painel Empresarial | Verifica Pix",
  description: "Central empresarial, inteligência e design system do Verifica Pix.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${sora.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const valid=["light","dark","navy"];const read=()=>{try{const t=localStorage.getItem("vp-theme");return valid.includes(t)?t:"light"}catch{return"light"}};const apply=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem("vp-theme",t)}catch{};document.querySelectorAll("[data-theme-choice]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.themeChoice===t)))};apply(read());document.addEventListener("click",e=>{const b=e.target.closest("[data-theme-choice]");if(b)apply(b.dataset.themeChoice)});document.addEventListener("DOMContentLoaded",()=>{apply(read());new MutationObserver(()=>apply(read())).observe(document.body,{childList:true,subtree:true})})})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
