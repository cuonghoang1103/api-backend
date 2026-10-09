/**
 * CT Work UX-D (09/10/2026) — đổi ẢNH BÌA dự án (chỉ ADMIN dự án: quyền `project.settings`).
 *
 *   setCover      chọn ảnh trong thư viện (`preset:<id>`), gỡ bìa (null) hoặc chỉ đổi điểm lấy nét dọc.
 *   uploadCover   ảnh riêng: thân request = byte ảnh (cùng kiểu A8 docs3a — tránh bẫy axios biến FormData thành JSON).
 *                 Kiểm bằng sharp: CHỈ PNG/JPEG/WebP thật (SVG/GIF bị từ chối), xoay theo EXIF, bỏ metadata (GPS…),
 *                 thu về rộng ≤ 1600 px và lưu JPEG — JPEG để ảnh OG (next/og, Satori) vẽ được (Satori không đọc WebP).
 *                 Lưu qua kho chung (R2 production / đĩa khi dev), khoá dưới thư mục nhận diện của CHÍNH dự án; URL công
 *                 khai (như ảnh dự án CTW-23) vì bìa hiện ở thẻ dự án, cổng khách, ảnh xem trước link mời.
 */

import crypto from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { emitWorkEvent } from './events.js';
import { requireProject, requireWorkspace } from './permissions.js';
import { clampCoverY, isCoverPreset } from './covers.js';

export const MAX_COVER_BYTES = 8 * 1024 * 1024;
const COVER_FORMATS = new Set(['png', 'jpeg', 'webp']);
const MAX_W = 1600;
const coverPrefix = (projectId: number) => `work/branding/p${projectId}/cover-`;

type Store = { put(key: string, body: Buffer, ct: string): Promise<{ url: string }>; del(key: string): Promise<unknown>; keyFromUrl(url: string | null): string | null };
const realStore: Store = {
  put: (key, body, ct) => getStorageProvider().put(key, body, ct),
  del: (key) => getStorageProvider().delete(key),
  keyFromUrl: (url) => getStorageProvider().keyFromUrl(url),
};
let store: Store = realStore;
export function _setCoverStoreForTests(s: Store | null) { store = s ?? realStore; }

const SELECT = { coverUrl: true, coverPositionY: true } as const;

async function dropOld(projectId: number, oldUrl: string | null) {
  const k = store.keyFromUrl(oldUrl);
  if (k && k.startsWith(coverPrefix(projectId))) await store.del(k).catch((err) => logger.warn('[work] xoá ảnh bìa cũ lỗi', { key: k, err: (err as Error).message }));
}

async function done(userId: number, projectId: number, summary: string) {
  await auditProject(projectId, { actorId: userId, action: 'project.cover', targetType: 'project', targetId: projectId, summary });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
}

export async function setCover(userId: number, projectId: number, input: { preset?: string | null; positionY?: number }) {
  await requireProject(userId, projectId, 'project.settings');
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: SELECT });
  const data: { coverUrl?: string | null; coverPositionY?: number } = {};
  if (input.preset !== undefined) {
    if (input.preset !== null && !isCoverPreset(input.preset)) throw new BadRequestError('Unknown cover', 'WORK_BAD_COVER');
    data.coverUrl = input.preset === null ? null : `preset:${input.preset}`;
    if (input.positionY === undefined) data.coverPositionY = 50;
  }
  if (input.positionY !== undefined) data.coverPositionY = clampCoverY(input.positionY);
  if (!Object.keys(data).length) throw new BadRequestError('Nothing to change — send preset or positionY', 'VALIDATION_ERROR');
  const row = await prisma.workProject.update({ where: { id: projectId }, data, select: SELECT });
  if (data.coverUrl !== undefined && data.coverUrl !== cur.coverUrl) await dropOld(projectId, cur.coverUrl);
  await done(userId, projectId, data.coverUrl === undefined ? 'Moved the project cover' : data.coverUrl ? 'Changed the project cover' : 'Removed the project cover');
  return row;
}

export async function uploadCover(userId: number, projectId: number, body: Buffer, positionY?: number) {
  await requireProject(userId, projectId, 'project.settings');
  if (!body.length) throw new BadRequestError('Send the image as the request body', 'WORK_IMAGE_EMPTY');
  if (body.length > MAX_COVER_BYTES) throw new BadRequestError('Cover images must be 8 MB or smaller', 'WORK_FILE_TOO_LARGE');
  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    meta = await sharp(body, { animated: false }).metadata();
  } catch {
    throw new BadRequestError('This file is not an image (use PNG, JPEG or WebP)', 'WORK_IMAGE_INVALID');
  }
  if (!meta.format || !COVER_FORMATS.has(meta.format)) throw new BadRequestError('Use a PNG, JPEG or WebP image', 'WORK_IMAGE_INVALID');
  if ((meta.width ?? 0) < 320 || (meta.height ?? 0) < 100) throw new BadRequestError('The image is too small — use one at least 320 × 100 px', 'WORK_IMAGE_TOO_SMALL');
  const out = await sharp(body, { animated: false }).rotate().resize({ width: MAX_W, withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  const key = `${coverPrefix(projectId)}${crypto.randomUUID()}.jpg`;
  const { url } = await store.put(key, out, 'image/jpeg');
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: SELECT });
  const row = await prisma.workProject.update({ where: { id: projectId }, data: { coverUrl: url, coverPositionY: clampCoverY(positionY ?? 50) }, select: SELECT });
  await dropOld(projectId, cur.coverUrl);
  await done(userId, projectId, 'Uploaded a project cover');
  return row;
}

// ─── Ảnh dự án / logo workspace QUA BACKEND (UX-D, 09/10/2026) ─────────────────────────────────────────────────
// Lỗi production "Failed to fetch" khi đổi ảnh dự án / logo workspace: đường cũ (branding.service presign) bắt TRÌNH
// DUYỆT PUT thẳng lên endpoint R2 (<account>.r2.cloudflarestorage.com). App desktop chặn ngay ở CSP `connect-src`
// (desktop/src/main/config.ts chỉ cho API/media/web), còn trên web thì còn phụ thuộc CORS của bucket (khoá R2 của
// backend không có quyền đọc GetBucketCors để kiểm). Cùng cách K-1 đã làm cho tệp bình luận: gửi byte ảnh cho
// backend, backend kiểm bằng sharp rồi tự ghi vào kho — không còn phụ thuộc CORS/CSP nào ngoài API của chính mình.
// Ảnh được chuẩn hoá: xoay theo EXIF, bỏ metadata, thu về ≤ 512 px, lưu PNG (giữ nền trong suốt của logo; email/OG
// vẽ được — WebP/GIF thì không).
export const MAX_BRAND_UPLOAD_BYTES = 5 * 1024 * 1024;
const BRAND_FORMATS = new Set(['png', 'jpeg', 'webp', 'gif']);

async function normalizeBrandImage(body: Buffer): Promise<Buffer> {
  if (!body.length) throw new BadRequestError('Send the image as the request body', 'WORK_IMAGE_EMPTY');
  if (body.length > MAX_BRAND_UPLOAD_BYTES) throw new BadRequestError('Images must be 5 MB or smaller', 'WORK_FILE_TOO_LARGE');
  let format: string | undefined;
  try { format = (await sharp(body, { animated: false }).metadata()).format; } catch { format = undefined; }
  if (!format || !BRAND_FORMATS.has(format)) throw new BadRequestError('Use a PNG, JPEG, WebP or GIF image', 'WORK_BAD_IMAGE');
  return sharp(body, { animated: false }).rotate().resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer();
}

async function putBrand(prefix: string, png: Buffer, oldUrl: string | null) {
  const key = `${prefix}${crypto.randomUUID()}.png`;
  const { url } = await store.put(key, png, 'image/png');
  const k = store.keyFromUrl(oldUrl);
  return { url, dropOld: async () => { if (k && k.startsWith(prefix)) await store.del(k).catch(() => undefined); } };
}

export async function uploadProjectAvatar(userId: number, projectId: number, body: Buffer) {
  await requireProject(userId, projectId, 'project.settings');
  const png = await normalizeBrandImage(body);
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { avatarUrl: true } });
  const { url, dropOld: drop } = await putBrand(`work/branding/p${projectId}/`, png, cur.avatarUrl);
  await prisma.workProject.update({ where: { id: projectId }, data: { avatarUrl: url } });
  await drop();
  await auditProject(projectId, { actorId: userId, action: 'project.avatar', targetType: 'project', targetId: projectId, summary: 'Changed the project picture' });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { avatarUrl: url };
}

export async function uploadWorkspaceLogo(userId: number, workspaceId: number, body: Buffer) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const png = await normalizeBrandImage(body);
  const cur = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { logoUrl: true } });
  const { url, dropOld: drop } = await putBrand(`work/branding/w${workspaceId}/`, png, cur.logoUrl);
  await prisma.workSpace.update({ where: { id: workspaceId }, data: { logoUrl: url } });
  await drop();
  return { logoUrl: url };
}
