const signatures: Record<string, number[][]> = {
  "application/pdf": [[0x25, 0x50, 0x44, 0x46]],
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    [0x50, 0x4b, 0x03, 0x04],
  ],
  "text/plain": [], // permitir sem assinatura
};

export function verifySignature(buf: Buffer, claimedMime: string): boolean {
  const sigs = signatures[claimedMime];
  if (!sigs) return false;
  if (sigs.length === 0) return true; // text/plain
  return sigs.some((sig) => sig.every((byte, i) => buf[i] === byte));
}
