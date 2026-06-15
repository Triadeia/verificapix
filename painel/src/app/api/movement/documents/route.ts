import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { movementDocumentInput } from "@/lib/movement-documents";
import {
  createMovementDocument,
  listMovementDocuments,
} from "@/lib/movement-documents.server";
import { uploadToMovementFolder } from "@/lib/google-drive";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifySignature } from "@/lib/file-signature";

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // CORS check
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  }

  const url = new URL(request.url);
  const items = await listMovementDocuments({
    q: url.searchParams.get("q") || undefined,
    category: (url.searchParams.get("category") as never) || undefined,
    status: (url.searchParams.get("status") as never) || undefined,
    territory: url.searchParams.get("territory") || undefined,
    page: Number(url.searchParams.get("page") || 1),
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // CSRF check
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  }

  // Rate limit
  const limit = checkRateLimit(`upload:${session.id}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Muitos uploads. Aguarde 1 minuto." },
      { status: 429 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 422 });
  }

  if (!ALLOWED.has(file.type) || file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Tipo não permitido ou acima de 20 MB." },
      { status: 422 },
    );
  }

  const tagsRaw = String(form.get("tags") || "");
  const parse = movementDocumentInput.safeParse({
    title: form.get("title"),
    kind: form.get("kind"),
    category: form.get("category"),
    territory: form.get("territory"),
    occurredAt: form.get("occurredAt") || null,
    source: form.get("source"),
    status: form.get("status") || "Rascunho",
    summary: form.get("summary"),
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  });
  if (!parse.success) {
    return NextResponse.json(
      { error: "Metadados inválidos.", issues: parse.error.issues },
      { status: 422 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // Validate file signature
  if (!verifySignature(bytes, file.type)) {
    return NextResponse.json(
      { error: "Conteúdo não corresponde ao tipo declarado." },
      { status: 422 },
    );
  }

  let drive;
  try {
    drive = await uploadToMovementFolder({
      name: file.name,
      mimeType: file.type,
      bytes,
      properties: { territory: parse.data.territory, category: parse.data.category },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha no upload para o Drive.";
    console.error("[drive]", message);
    return NextResponse.json({ error: "Falha ao fazer upload. Tente novamente." }, { status: 502 });
  }

  try {
    const doc = await createMovementDocument(parse.data, {
      driveFileId: drive.id,
      driveWebViewLink: drive.webViewLink,
      mimeType: file.type,
      byteSize: file.size,
    });
    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (err) {
    const { trashDriveFile } = await import("@/lib/google-drive");
    await trashDriveFile(drive.id).catch(() => {});
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Falha ao persistir." },
      { status: 500 },
    );
  }
}
