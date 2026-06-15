import { test } from "node:test";
import assert from "node:assert/strict";
import { movementDocumentInput } from "./movement-documents";

test("rejeita título curto", () => {
  const r = movementDocumentInput.safeParse({
    title: "ab",
    kind: "Caso",
    category: "Doutrina",
    territory: "SP",
    source: "x",
    summary: "y",
    tags: [],
  });
  assert.equal(r.success, false);
});

test("aceita payload mínimo válido", () => {
  const r = movementDocumentInput.safeParse({
    title: "Caso válido",
    kind: "Caso",
    category: "Operação",
    territory: "Recife-PE",
    source: "Mercadinho do Zé",
    summary: "ok",
    tags: [],
  });
  assert.equal(r.success, true);
});

test("limita tags a 8", () => {
  const r = movementDocumentInput.safeParse({
    title: "Caso válido",
    kind: "Caso",
    category: "Operação",
    territory: "Recife-PE",
    source: "x",
    summary: "y",
    tags: Array(9).fill("a"),
  });
  assert.equal(r.success, false);
});
