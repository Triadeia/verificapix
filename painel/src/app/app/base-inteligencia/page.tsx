import { BrainCircuit, FileText, Search, Sparkles } from "lucide-react";
import { Badge, PageHeader } from "@/components/page-parts";
import { DocumentUpload } from "@/components/document-upload";
import { getDocuments } from "@/lib/repositories";

export default async function KnowledgePage() {
  const documents = await getDocuments();
  return <div><PageHeader eyebrow="Conhecimento conectado" title="Base de Inteligência" description="Documentos, transcrições, decisões e aprendizados em uma única fonte." action={<DocumentUpload />} /><div className="panel mb-6 flex items-center gap-3 p-3"><Search className="ml-2 size-5 text-slate-400" /><input className="h-10 flex-1 outline-none" placeholder="Buscar na inteligência do Verifica Pix..." /><button className="flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white"><BrainCircuit className="size-4" />Perguntar à IA</button></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{documents.map((document) => <article key={document.title} className="panel p-5"><div className="flex items-center justify-between"><div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><FileText /></div><button aria-label="Gerar resumo"><Sparkles className="size-5 text-emerald-600" /></button></div><h2 className="mt-5 font-heading font-semibold">{document.title}</h2><p className="mt-2 text-sm text-slate-500">{document.type}</p><div className="mt-5 flex flex-wrap gap-2">{document.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}</div></article>)}</div></div>;
}
