import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { BrandSpecimens } from "@/components/brandbook-specimens";
import { MovementDocuments } from "@/components/movement-documents";
import { MovementPillarsCarousel } from "@/components/movement-pillars-carousel";
import { MovementDoctrines } from "@/components/movement-doctrines";
import { brandSections, getBrandSection, MOVEMENT_DOCUMENTS_ANCHOR } from "@/lib/brandbook";
import { listMovementDocuments } from "@/lib/movement-documents.server";
import { MOVEMENT_METHOD } from "@/lib/movement-pillars";

export function generateStaticParams() {
  return brandSections.map((section) => ({ slug: section.slug }));
}

async function MovementDocumentsServer() {
  const { items, total } = await listMovementDocuments();
  return <MovementDocuments initialItems={items} total={total} />;
}

export default async function BrandSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string>>;
}) {
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
            <>
              <section className="movement-manifesto mb-12">
                <blockquote className="text-4xl font-bold">
                  A Receita Certa para a Bahia.
                </blockquote>
                <p className="mt-6 max-w-2xl leading-7 text-lg">
                  Dr. Pitágoras. Quem cuidou de Candeias, vai cuidar da Bahia.
                  Não é promessa — é método que já provou resultado.
                </p>
              </section>

              {/* Pillars Carousel */}
              <section className="my-12">
                <h3 className="text-2xl font-bold mb-6">Os Cinco Pilares</h3>
                <MovementPillarsCarousel />
              </section>

              {/* Method Section */}
              <section className="my-12">
                <h3 className="text-2xl font-bold mb-6">O Método Receita Certa</h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  {MOVEMENT_METHOD.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="relative rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h4 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                        {step.name}
                      </h4>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
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

          {section.slug === "movimento" ? (
            <>
              {/* Doctrines Section */}
              <section className="my-12" id="doutrinas">
                <MovementDoctrines />
              </section>

              {/* Movement Documents */}
              {MOVEMENT_DOCUMENTS_ANCHOR && <MovementDocumentsServer />}
            </>
          ) : null}

          <BrandSpecimens slug={section.slug} />

          {section.slug === "movimento" ? (
            <section id="manifesto">
              <div className="flex gap-3 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-5">
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div>
                  <h3>Guardrail editorial</h3>
                  <p className="mt-2 text-sm">Sem ataque pessoal — sempre crítica ao método errado, nunca à pessoa. Sem mentira sobre números. Sem promessas impossíveis. Transparência radical: tudo pode ser auditado. Dados sempre com rosto, obra ou evidência.</p>
                </div>
              </div>
              <div className="movement-manifesto mt-8">
                <blockquote>De uma nova Candeias para uma nova Bahia.</blockquote>
                <p className="mt-6 leading-7">A Bahia é de quem constrói o interior. Método é receita — diagnóstico, plano, execução, resultado. Não é promessa — é passo a passo documentado.</p>
                <p className="mt-4 leading-7">Quem cuidou de Candeias vai cuidar da Bahia. Não é elevação de cargo — é transferência comprovada de competência. 8 anos. 84%. Candeias mudou.</p>
                <p className="mt-4 leading-7">O interior não pede esmola. Pede representação real. Quem constrói deixa receita. Quem chega depois continua de onde parou.</p>
                <p className="mt-4 font-bold text-blue-600 dark:text-blue-400">Receita Certa de quem constrói. O voto certo é o voto que tem receita por trás.</p>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="brand-aside panel p-5" aria-label="Nesta página">
          <p className="brand-index-number mb-3">Nesta página</p>
          {section.chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.title}</a>)}
          {["cores", "tipografia", "layout", "componentes", "tabelas"].includes(section.slug) ? <a href="#especimes">Espécimes</a> : null}
          {section.slug === "movimento" ? (
            <>
              <a href="#doutrinas">As 10 Doutrinas</a>
              <a href={`#${MOVEMENT_DOCUMENTS_ANCHOR}`}>Documentos do Movimento</a>
              <a href="#manifesto">Manifesto</a>
            </>
          ) : null}
        </aside>
      </div>

      <footer className="mt-8 grid gap-3 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
        {previous ? <Link href={`/app/marca/${previous.slug}`} className="panel panel-interactive flex min-h-20 items-center gap-3 p-4"><ArrowLeft className="size-4" /><div><span className="muted text-xs">Anterior</span><p className="font-bold">{previous.shortTitle}</p></div></Link> : <span />}
        {next ? <Link href={`/app/marca/${next.slug}`} className="panel panel-interactive flex min-h-20 items-center justify-end gap-3 p-4 text-right"><div><span className="muted text-xs">Próximo</span><p className="font-bold">{next.shortTitle}</p></div><ArrowRight className="size-4" /></Link> : null}
      </footer>
    </article>
  );
}
