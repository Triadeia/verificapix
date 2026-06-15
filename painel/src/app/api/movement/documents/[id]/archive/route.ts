import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { softDeleteMovementDocument } from "@/lib/movement-documents.server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // CSRF check
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  }

  const { id } = await params;
  await softDeleteMovementDocument(id);
  return NextResponse.redirect(new URL("/app/marca/movimento#documentos", request.url));
}
