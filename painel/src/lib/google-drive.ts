import { google } from "googleapis";
import { Readable } from "node:stream";

function getDriveClient() {
  const email = process.env.GOOGLE_DRIVE_SA_EMAIL;
  const key = process.env.GOOGLE_DRIVE_SA_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("Google Drive Service Account não configurada.");
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  return google.drive({ version: "v3", auth });
}

function getFolderId() {
  const id = process.env.GOOGLE_DRIVE_MOVEMENT_FOLDER_ID;
  if (!id) throw new Error("GOOGLE_DRIVE_MOVEMENT_FOLDER_ID não definido.");
  return id;
}

type UploadInput = {
  name: string;
  mimeType: string;
  bytes: Buffer;
  properties?: Record<string, string>;
};

export async function uploadToMovementFolder(input: UploadInput) {
  const drive = getDriveClient();
  const folderId = getFolderId();
  const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID || undefined;

  const res = await drive.files.create({
    requestBody: {
      name: input.name,
      parents: [folderId],
      properties: input.properties,
    },
    media: { mimeType: input.mimeType, body: Readable.from(input.bytes) },
    fields: "id, webViewLink, webContentLink, mimeType, size",
    supportsAllDrives: Boolean(sharedDriveId),
  });

  const file = res.data;
  if (!file.id || !file.webViewLink) throw new Error("Drive não retornou identificadores.");
  return { id: file.id, webViewLink: file.webViewLink };
}

export async function ensureMovementFolder(): Promise<{
  ok: boolean;
  folderId: string;
  name: string;
}> {
  const drive = getDriveClient();
  const folderId = getFolderId();
  const res = await drive.files.get({
    fileId: folderId,
    fields: "id, name, mimeType",
    supportsAllDrives: true,
  });
  if (res.data.mimeType !== "application/vnd.google-apps.folder") {
    throw new Error("Folder ID não é uma pasta.");
  }
  return { ok: true, folderId, name: res.data.name ?? "Movimento" };
}

export async function trashDriveFile(fileId: string) {
  const drive = getDriveClient();
  await drive.files.update({
    fileId,
    requestBody: { trashed: true },
    supportsAllDrives: true,
  });
}
