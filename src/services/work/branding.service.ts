/**
 * CT Work — NHẬN DIỆN dự án / không gian (CTW-23, 06/10/2026).
 *
 * "CT work không đổi được ảnh cho Project sao?" — mọi dự án trông giống nhau ở sidebar,
 * portfolio, cổng khách. Giờ:
 *   - dự án: ảnh (avatarUrl), emoji (iconEmoji), màu (color) — đổi emoji/màu qua PATCH /projects/:pid;
 *   - không gian: logo (logoUrl) — cổng khách mang thương hiệu studio.
 *
 * Ảnh đi ĐÚNG đường tải lên R2 của tệp đính kèm (issues.service presign/complete): trình duyệt
 * PUT thẳng lên R2 bằng URL ký 15 phút, rồi báo `complete` để máy chủ HEAD lại kiểm loại + cỡ.
 * Khác tệp đính kèm ở chỗ ảnh nhận diện là CÔNG KHAI (URL cố định của bucket — buildPublicUrl):
 * nó hiện ở hàng trăm chỗ (sidebar, thẻ dự án, email) nên không thể ký URL cho từng lần xem.
 * Vì thế chỉ nhận ẢNH (png/jpeg/webp/gif), ≤ 2 MB, và khoá nằm dưới thư mục riêng của đối tượng.
 */

import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { buildPublicUrl, deleteObject, getSignedUploadUrl, headObject, keyFromUrl } from '../../config/r2.js';
import { config } from '../../config/env.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { emitWorkEvent } from './events.js';
import { requireProject, requireWorkspace } from './permissions.js';

export const BRAND_MAX_BYTES = 2 * 1024 * 1024;
const IMAGE_EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

const projectPrefix = (projectId: number) => `work/branding/p${projectId}/`;
const workspacePrefix = (workspaceId: number) => `work/branding/w${workspaceId}/`;

function assertStorage() {
  // Cùng điều kiện với tệp đính kèm (issues.service assertR2) + phải có URL công khai của bucket.
  if (getStorageProvider().kind !== 'r2' || !config.r2.publicUrl) throw new AppError('File storage is not configured on this server', 503, 'WORK_STORAGE_OFF');
}

function checkImage(contentType: string, size: number) {
  if (!IMAGE_EXT[contentType]) throw new BadRequestError('Use a PNG, JPEG, WebP or GIF image', 'WORK_BAD_IMAGE');
  if (!Number.isFinite(size) || size <= 0 || size > BRAND_MAX_BYTES) throw new BadRequestError('Images must be 2 MB or smaller', 'WORK_FILE_TOO_LARGE');
}

async function presign(prefix: string, input: { contentType: string; size: number }) {
  assertStorage();
  checkImage(input.contentType, input.size);
  const key = `${prefix}${crypto.randomUUID()}.${IMAGE_EXT[input.contentType]}`;
  const uploadUrl = await getSignedUploadUrl(key, input.contentType, 900);
  return { uploadUrl, key, headers: { 'Content-Type': input.contentType } };
}

/** HEAD lại tệp vừa tải: đúng thư mục, có thật, là ảnh, ≤ 2 MB. Sai ⇒ xoá tệp + 400. */
async function verifyUpload(prefix: string, key: string): Promise<string> {
  assertStorage();
  if (!key.startsWith(prefix) || key.includes('..')) throw new BadRequestError('Invalid image key', 'WORK_BAD_KEY');
  const head = await headObject(key);
  if (!head) throw new BadRequestError('Upload not found. Please try again.', 'WORK_UPLOAD_MISSING');
  if (head.size > BRAND_MAX_BYTES || !IMAGE_EXT[head.contentType]) {
    await deleteObject(key).catch(() => undefined);
    throw new BadRequestError(head.size > BRAND_MAX_BYTES ? 'Images must be 2 MB or smaller' : 'Use a PNG, JPEG, WebP or GIF image', head.size > BRAND_MAX_BYTES ? 'WORK_FILE_TOO_LARGE' : 'WORK_BAD_IMAGE');
  }
  return buildPublicUrl(key);
}

/** Xoá ảnh cũ (chỉ khi nó nằm trong thư mục nhận diện của CHÍNH đối tượng này). */
async function dropOld(prefix: string, oldUrl: string | null) {
  const k = keyFromUrl(oldUrl);
  if (k && k.startsWith(prefix)) await deleteObject(k).catch((err) => logger.warn('[work] xoá ảnh nhận diện cũ lỗi', { key: k, err: (err as Error).message }));
}

// ─── Dự án ───────────────────────────────────────────────────────

export async function presignProjectAvatar(userId: number, projectId: number, input: { contentType: string; size: number }) {
  await requireProject(userId, projectId, 'project.settings');
  return presign(projectPrefix(projectId), input);
}

export async function completeProjectAvatar(userId: number, projectId: number, input: { key: string }) {
  await requireProject(userId, projectId, 'project.settings');
  const url = await verifyUpload(projectPrefix(projectId), input.key);
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { avatarUrl: true } });
  await prisma.workProject.update({ where: { id: projectId }, data: { avatarUrl: url } });
  await dropOld(projectPrefix(projectId), cur.avatarUrl);
  await auditProject(projectId, { actorId: userId, action: 'project.avatar', targetType: 'project', targetId: projectId, summary: 'Changed the project picture' });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { avatarUrl: url };
}

/** Gỡ ảnh dự án (xoá cả tệp trên R2). */
export async function removeProjectAvatar(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.settings');
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { avatarUrl: true } });
  await prisma.workProject.update({ where: { id: projectId }, data: { avatarUrl: null } });
  await dropOld(projectPrefix(projectId), cur.avatarUrl);
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { avatarUrl: null };
}

// ─── Không gian ──────────────────────────────────────────────────

export async function presignWorkspaceLogo(userId: number, workspaceId: number, input: { contentType: string; size: number }) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  return presign(workspacePrefix(workspaceId), input);
}

export async function completeWorkspaceLogo(userId: number, workspaceId: number, input: { key: string }) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const url = await verifyUpload(workspacePrefix(workspaceId), input.key);
  const cur = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { logoUrl: true } });
  await prisma.workSpace.update({ where: { id: workspaceId }, data: { logoUrl: url } });
  await dropOld(workspacePrefix(workspaceId), cur.logoUrl);
  return { logoUrl: url };
}

export async function removeWorkspaceLogo(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.settings');
  const cur = await prisma.workSpace.findUniqueOrThrow({ where: { id: workspaceId }, select: { logoUrl: true } });
  await prisma.workSpace.update({ where: { id: workspaceId }, data: { logoUrl: null } });
  await dropOld(workspacePrefix(workspaceId), cur.logoUrl);
  return { logoUrl: null };
}
