import { z } from "zod";

export const MOVEMENT_KINDS = ["Caso", "Roteiro", "Processo", "Evidência", "Manifesto", "Outro"] as const;
export const MOVEMENT_CATEGORIES = ["Doutrina", "Operação", "Comunicação", "Resultado"] as const;
export const MOVEMENT_STATUSES = ["Rascunho", "Em revisão", "Publicado", "Arquivado"] as const;

export const movementDocumentInput = z.object({
  title: z.string().trim().min(3).max(160),
  kind: z.enum(MOVEMENT_KINDS),
  category: z.enum(MOVEMENT_CATEGORIES),
  territory: z.string().trim().min(2).max(80),
  occurredAt: z.string().date().nullable().optional(),
  source: z.string().trim().min(2).max(120),
  status: z.enum(MOVEMENT_STATUSES).default("Rascunho"),
  summary: z.string().trim().max(280),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
});

export type MovementDocumentInput = z.infer<typeof movementDocumentInput>;

export type MovementDocument = MovementDocumentInput & {
  id: string;
  organizationId: string;
  driveFileId: string;
  driveWebViewLink: string;
  mimeType: string;
  byteSize: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ListFilters = {
  q?: string;
  category?: typeof MOVEMENT_CATEGORIES[number];
  status?: typeof MOVEMENT_STATUSES[number];
  territory?: string;
  page?: number;
};
