import { NextResponse } from "next/server";
import { ensureMovementFolder } from "@/lib/google-drive";

export async function GET() {
  try {
    const r = await ensureMovementFolder();
    return NextResponse.json({ ok: true, folder: r.name });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Erro desconhecido",
      },
      { status: 503 },
    );
  }
}
