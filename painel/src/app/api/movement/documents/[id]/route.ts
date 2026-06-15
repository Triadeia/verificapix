import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { movementDocumentInput } from "@/lib/movement-documents";
import {
  updateMovementDocument,
  softDeleteMovementDocument,
} from "@/lib/movement-documents.server";

export async function PATCH(
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
  const body = await request.json();
  const partial = movementDocumentInput.partial().safeParse(body);
  if (!partial.success) {
    return NextResponse.json(
      { error: "Inválido", issues: partial.error.issues },
      { status: 422 },
    );
  }
  const doc = await updateMovementDocument(id, partial.data);
  return NextResponse.json({ document: doc });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  // CSRF check
  const origin = _.headers.get("origin");
  const host = _.headers.get("host");
  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Origem não autorizada." }, { status: 403 });
  }

  const { id } = await params;
  await softDeleteMovementDocument(id);
  return NextResponse.json({ ok: true });
}
