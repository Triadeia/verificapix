import { BrandbookDirectory } from "@/components/brandbook-directory";

export default function BrandbookDirectoryPage() {
  return (
    <div>
      <header className="mb-8 max-w-3xl">
        <span className="brand-kicker">Biblioteca navegável</span>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Tudo que forma a experiência Verifica Pix.</h1>
        <p className="muted mt-5 max-w-2xl text-lg leading-8">Busque páginas, capítulos, regras e arquivos de marca sem precisar conhecer a estrutura do projeto.</p>
      </header>
      <BrandbookDirectory />
    </div>
  );
}
