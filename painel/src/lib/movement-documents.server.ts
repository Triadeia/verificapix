import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import {
  type MovementDocumentInput,
  type MovementDocument,
  type ListFilters,
} from "@/lib/movement-documents";

const PAGE_SIZE = 20;

const fallback: MovementDocument[] = [
  {
    id: "demo-1",
    organizationId: "demo",
    title: "Caso Pinheiros — Comprovante falso revertido em 12 min",
    kind: "Caso",
    category: "Resultado",
    territory: "Pinheiros-SP",
    occurredAt: "2026-04-12",
    source: "Protetor: Mercadinho do Tio Zé",
    status: "Publicado",
    summary:
      "Receita aplicada por funcionário recém-treinado. Janela fechada antes da entrega da mercadoria.",
    tags: ["caixa-blindado", "receita-certa"],
    driveFileId: "demo",
    driveWebViewLink: "#",
    mimeType: "application/pdf",
    byteSize: 124500,
    createdBy: "demo",
    createdAt: "2026-04-12T10:00:00Z",
    updatedAt: "2026-04-12T10:00:00Z",
  },
];

export async function listMovementDocuments(
  filters: ListFilters = {},
): Promise<{ items: MovementDocument[]; total: number }> {
  if (!isSupabaseConfigured()) {
    return { items: fallback, total: fallback.length };
  }
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("movement_documents")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,summary.ilike.%${filters.q}%`);
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.territory) query = query.ilike("territory", `%${filters.territory}%`);

  const { data, error, count } = await query;
  if (error || !data) return { items: [], total: 0 };
  return { items: data.map(rowToDoc), total: count ?? data.length };
}

export async function getMovementDocument(id: string): Promise<MovementDocument | null> {
  if (!isSupabaseConfigured()) return fallback.find((d) => d.id === id) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movement_documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToDoc(data);
}

export async function createMovementDocument(
  payload: MovementDocumentInput,
  drive: { driveFileId: string; driveWebViewLink: string; mimeType: string; byteSize: number },
): Promise<MovementDocument> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  if (!isSupabaseConfigured()) throw new Error("Supabase não configurado.");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", session.id)
    .single();
  if (!profile) throw new Error("Perfil não encontrado.");

  const { data, error } = await supabase
    .from("movement_documents")
    .insert({
      organization_id: profile.organization_id,
      title: payload.title,
      kind: payload.kind,
      category: payload.category,
      territory: payload.territory,
      occurred_at: payload.occurredAt ?? null,
      source: payload.source,
      status: payload.status,
      summary: payload.summary,
      tags: payload.tags,
      drive_file_id: drive.driveFileId,
      drive_web_view_link: drive.driveWebViewLink,
      mime_type: drive.mimeType,
      byte_size: drive.byteSize,
      created_by: session.id,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message || "Falha ao salvar documento.");
  return rowToDoc(data);
}

export async function updateMovementDocument(
  id: string,
  patch: Partial<MovementDocumentInput>,
): Promise<MovementDocument> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  if (!isSupabaseConfigured()) throw new Error("Supabase não configurado.");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("movement_documents")
    .update({
      title: patch.title,
      kind: patch.kind,
      category: patch.category,
      territory: patch.territory,
      occurred_at: patch.occurredAt,
      source: patch.source,
      status: patch.status,
      summary: patch.summary,
      tags: patch.tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Falha ao atualizar.");
  return rowToDoc(data);
}

export async function softDeleteMovementDocument(id: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Não autenticado.");
  if (!isSupabaseConfigured()) throw new Error("Supabase não configurado.");
  const supabase = await createClient();
  const { error } = await supabase
    .from("movement_documents")
    .update({ status: "Arquivado", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

function rowToDoc(row: Record<string, unknown>): MovementDocument {
  return {
    id: row.id as string,
    organizationId: row.organization_id as string,
    title: row.title as string,
    kind: row.kind as MovementDocument["kind"],
    category: row.category as MovementDocument["category"],
    territory: row.territory as string,
    occurredAt: (row.occurred_at as string) ?? null,
    source: row.source as string,
    status: row.status as MovementDocument["status"],
    summary: row.summary as string,
    tags: (row.tags as string[]) ?? [],
    driveFileId: row.drive_file_id as string,
    driveWebViewLink: row.drive_web_view_link as string,
    mimeType: row.mime_type as string,
    byteSize: row.byte_size as number,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
