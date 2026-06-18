import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import type { FileCategory } from '../types/index.js';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

// ─── Signed URL ─────────────────────────────────────────────────
// Secret comes from env (validated at startup — no placeholder
// default allowed in production). If it's missing or weak, the
// server fails to start instead of silently using a forgeable value.
const SIGNED_URL_SECRET = config.signedUrlSecret;
const SIGNED_URL_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export interface SignedUploadPayload {
  filename: string;
  contentType: string;
  folder: string;
  userId?: number;
  exp: number;
}

export function generateSignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string,
  userId?: number,
): { uploadUrl: string; fileId: string } {
  const exp = Date.now() + SIGNED_URL_EXPIRY_MS;
  const payload: SignedUploadPayload = { filename, contentType, folder, userId, exp };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SIGNED_URL_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const token = `${payloadBase64}.${signature}`;
  const fileId = uuidv4();
  // Encode token so it doesn't contain / characters that break Express route params
  const encodedToken = Buffer.from(token).toString('base64url');
  const uploadUrl = `/api/v1/files/upload/signed/${encodedToken}`;

  return { uploadUrl, fileId };
}

export function verifySignedUploadToken(token: string): SignedUploadPayload | null {
  // Token is base64url-encoded to avoid / characters in Express route params
  const decodedToken = Buffer.from(token, 'base64url').toString('utf-8');
  try {
    const lastDot = decodedToken.lastIndexOf('.');
    if (lastDot === -1) return null;
    const payloadBase64 = decodedToken.slice(0, lastDot);
    const signature = decodedToken.slice(lastDot + 1);

    const expectedSig = crypto
      .createHmac('sha256', SIGNED_URL_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    );

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function getFileCategory(mimeType: string): FileCategory {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return 'images';
  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) return 'audio';
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return 'video';
  return 'documents';
}

function getMaxSize(category: FileCategory): number {
  switch (category) {
    case 'images': return config.maxFileSizeImages;
    case 'audio': return config.maxFileSizeAudio;
    case 'video': return config.maxFileSizeVideo;
    default: return config.maxFileSizeDocument;
  }
}

function getAllowedTypes(category: FileCategory): string[] {
  switch (category) {
    case 'images': return ALLOWED_IMAGE_TYPES;
    case 'audio': return ALLOWED_AUDIO_TYPES;
    case 'video': return ALLOWED_VIDEO_TYPES;
    case 'documents': return ALLOWED_DOCUMENT_TYPES;
    default: return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  }
}

export interface UploadResult {
  id: number;
  originalName: string;
  storedName: string;
  filePath: string;
  url: string;
  contentType: string;
  fileSize: number;
  fileCategory: string;
}

export class UploadService {
  // ─── Upload Single File ────────────────────────────────
  async uploadFile(
    file: Express.Multer.File,
    category: FileCategory,
    uploadedBy?: number,
  ): Promise<UploadResult> {
    const detectedCategory = getFileCategory(file.mimetype);
    const finalCategory = category || detectedCategory;
    const allowedTypes = getAllowedTypes(finalCategory);

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed for category ${finalCategory}`);
    }

    const maxSize = getMaxSize(finalCategory);
    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / 1024 / 1024);
      throw new Error(`File size exceeds maximum of ${maxMB}MB`);
    }

    // Generate unique stored name
    const baseSlug = slugify(path.parse(file.originalname).name);
    const timestamp = Date.now();
    const randomStr = uuidv4().split('-')[0];
    const ext = path.extname(file.originalname).toLowerCase();
    const storedName = `${baseSlug}-${timestamp}-${randomStr}${ext}`;

    // Subdirectory based on category
    const subDir = finalCategory;
    const relativePath = path.join(subDir, storedName);
    const fullPath = path.join(config.uploadDir, relativePath);

    // Ensure directory exists — try create as 0o777, then chmod
    // parent directories up the tree until writeFile succeeds.
    // On bind-mounted Docker volumes, existing dirs may have
    // restrictive modes (755) and the container process (uid 1001)
    // may not own them, so chmod can also fail with EACCES.
    // We try chmod on the leaf dir first, then walk up the tree.
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true, mode: 0o777 });

    const chmodRecursive = async (targetDir: string): Promise<void> => {
      // chmod the target
      await fs.chmod(targetDir, 0o777).catch(() => { /* ignore */ });
      // chmod all entries inside (best-effort)
      let entries: string[] = [];
      try {
        entries = await fs.readdir(targetDir);
      } catch {
        return;
      }
      for (const entry of entries) {
        const entryPath = path.join(targetDir, entry);
        try {
          const stat = await fs.stat(entryPath);
          if (stat.isDirectory()) {
            await fs.chmod(entryPath, 0o777).catch(() => { /* ignore */ });
          } else {
            await fs.chmod(entryPath, 0o666).catch(() => { /* ignore */ });
          }
        } catch {
          /* ignore */
        }
      }
    };

    await chmodRecursive(dir);

    // Move file to storage — retry with chmod on EACCES
    // (handles bind-mounted Docker volumes where chmod may not persist)
    try {
      await fs.writeFile(fullPath, file.buffer);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === 'EACCES') {
        // Walk up the directory tree, chmod every parent, then retry.
        let cur = dir;
        for (let i = 0; i < 6; i++) {
          await fs.chmod(cur, 0o777).catch(() => { /* ignore */ });
          const parent = path.dirname(cur);
          if (parent === cur) break;
          cur = parent;
        }
        await fs.chmod(fullPath, 0o666).catch(() => { /* ignore */ });
        await fs.writeFile(fullPath, file.buffer);
      } else {
        throw err;
      }
    }

    // Determine public URL — use absolute URL so browser can fetch via nginx
    const baseUrl = config.publicBaseUrl;
    const relative = relativePath.replace(/\\/g, '/');
    const url = `${baseUrl}/uploads/${relative}`;

    // Save to database
    const attachment = await prisma.fileAttachment.create({
      data: {
        originalName: file.originalname,
        storedName,
        filePath: relativePath,
        contentType: file.mimetype,
        fileSize: file.size,
        uploadedBy,
        fileCategory: finalCategory,
      },
    });

    return {
      id: attachment.id,
      originalName: attachment.originalName,
      storedName: attachment.storedName,
      filePath: attachment.filePath,
      url,
      contentType: attachment.contentType,
      fileSize: Number(attachment.fileSize),
      fileCategory: attachment.fileCategory || finalCategory,
    };
  }

  // ─── Upload Multiple Files ─────────────────────────────
  async uploadMultiple(
    files: Express.Multer.File[],
    category: FileCategory,
    uploadedBy?: number,
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, category, uploadedBy);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.originalname}:`, error);
      }
    }
    return results;
  }

  // ─── Delete File ──────────────────────────────────────
  async deleteFile(id: number): Promise<void> {
    const attachment = await prisma.fileAttachment.findUnique({ where: { id } });
    if (!attachment) return;

    const fullPath = path.join(config.uploadDir, attachment.filePath);
    try {
      await fs.unlink(fullPath);
    } catch {
      // File might already be deleted
    }

    await prisma.fileAttachment.delete({ where: { id } });
  }

  // ─── Get File Info ────────────────────────────────────
  async getFile(id: number) {
    return prisma.fileAttachment.findUnique({ where: { id } });
  }

  // ─── Delete Physical File ─────────────────────────────
  async deletePhysicalFile(filePath: string): Promise<void> {
    const fullPath = path.join(config.uploadDir, filePath);
    try {
      await fs.unlink(fullPath);
    } catch {
      // Ignore if file doesn't exist
    }
  }
}

export const uploadService = new UploadService();
