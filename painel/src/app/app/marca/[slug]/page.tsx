import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { BrandSpecimens } from "@/components/brandbook-specimens";
import { brandSections, getBrandSection } from "@/lib/brandbook";

export function generateStaticParams() {
  return brandSections.map((section) => ({ slug: section.slug }));
}

export default async function BrandSectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getBrandSection(slug);
  if (!section) notFound();

  const currentIndex = brandSections.findIndex((item) => item.slug === section.slug);
  const previous = brandSections[currentIndex - 1];
  const next = brandSections[currentIndex + 1];

  return (
    <article>
      <header className="brand-hero reveal">
        <div className="brand-hero-content">
          <span className="brand-kicker">{section.group} / {section.shortTitle}</span>
          <h1 className="brand-title">{section.title}</h1>
          <p className="brand-lead">{section.description}</p>
        </div>
      </header>

      <div className="brand-content mt-8">
        <div className="brand-reading">
          {section.slug === "movimento" ? (
            <section className="movement-manifesto">
              <blockquote>AGORA O CAIXA É BLINDADO.</blockquote>
              <p className="mt-6 max-w-2xl leading-7">Não é uma promessa de risco zero. É um compromisso de instalar um processo claro antes que o produto deixe o balcão.</p>
            </section>
          ) : null}

          {section.chapters.map((chapter, index) => (
            <section key={chapter.id} id={chapter.id}>
              <span className="brand-index-number">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-5">{chapter.title}</h2>
              <p className="mt-5 text-base">{chapter.lead}</p>
              {chapter.points ? (
                <div className="mt-8">
                  {chapter.points.map((point, pointIndex) => (
                    <div key={point.title} className="principle-row">
                      <span>{String(pointIndex + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{point.title}</h3>
                        <p className="mt-2 text-sm">{point.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}

          <BrandSpecimens slug={section.slug} />

          {section.slug === "movimento" ? (
            <section id="manifesto">
              <div className="flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-5">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div>
                  <h3>Guardrail editorial</h3>
                  <p className="mt-2 text-sm">A causa pode ser firme sem desumanizar pessoas. Nacionalidade nunca é usada como insulto. Resultados, preços, tempos e depoimentos só entram após validação documental.</p>
                </div>
              </div>
              <div className="movement-manifesto mt-8">
                <blockquote>Verificar não é desconfiar. É cuidar.</blockquote>
                <p className="mt-6 leading-7">Quem trabalha merece decidir com evidência. Quem atende merece um processo claro. Quem constrói o negócio merece enxergar o caixa mesmo quando está longe.</p>
                <p className="mt-4 leading-7">O comprovante inicia a análise. A confirmação termina na conta recebedora. Entre os dois, existe uma escolha: improvisar ou fechar a janela.</p>
                <p className="mt-4 font-bold text-emerald-300">Antes de liberar, verifique. Depois de aprender, compartilhe. O barulho dos bons protege mais um balcão.</p>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="brand-aside panel p-5" aria-label="Nesta página">
          <p className="brand-index-number mb-3">Nesta página</p>
          {section.chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.title}</a>)}
          {["cores", "tipografia", "layout", "componentes", "tabelas"].includes(section.slug) ? <a href="#especimes">Espécimes</a> : null}
          {section.slug === "movimento" ? <a href="#manifesto">Manifesto</a> : null}
        </aside>
      </div>

      <footer className="mt-8 grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
        {previous ? <Link href={`/app/marca/${previous.slug}`} className="panel panel-interactive flex min-h-20 items-center gap-3 p-4"><ArrowLeft className="size-4" /><div><span className="muted text-xs">Anterior</span><p className="font-bold">{previous.shortTitle}</p></div></Link> : <span />}
        {next ? <Link href={`/app/marca/${next.slug}`} className="panel panel-interactive flex min-h-20 items-center justify-end gap-3 p-4 text-right"><div><span className="muted text-xs">Próximo</span><p className="font-bold">{next.shortTitle}</p></div><ArrowRight className="size-4" /></Link> : null}
      </footer>
    </article>
  );
}
