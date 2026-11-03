/**
 * ============================================================
 * Code Lab — "Sự cố & Lỗi"  (03/11/2026)
 * ============================================================
 *
 * Người học chia sẻ một sự cố/lỗi thật gặp phải trong lúc code: đang làm gì
 * (bối cảnh), lỗi/log ra sao, khắc phục thế nào / rút ra bài học gì, kèm ảnh
 * chụp màn hình. Người khác vào bình luận.
 *
 * Ảnh lưu RIÊNG TƯ trên R2 (khoá `image_keys`), phục vụ bằng URL ký sẵn
 * (`getSignedReadUrl`) — không bao giờ trả khoá trần ra ngoài. Cùng cách
 * Vở/feed đang dùng (CLAUDE.md: `getMediaUrl`/CDN công khai KHÔNG dùng cho
 * nội dung người dùng).
 */
import crypto from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '../config/database.js';
import { deleteObject, getSignedReadUrl, putObject } from '../config/r2.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const PRIVATE = 'private, max-age=0, no-store';
const IMG_MAX_EDGE = 1600;
const MAX_IMAGES = 4;
const TITLE_MAX = 200;
const TEXT_MAX = 8000;
const BODY_MAX = 4000;
const TAG_MAX = 6;

type IncidentStatus = 'OPEN' | 'RESOLVED';

const AUTHOR_SELECT = { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } as const;
const TRACK_SELECT = { id: true, slug: true, name: true, color: true } as const;

function safeName(name: string): string {
  return (name || 'anh').replace(/[^\w.-]+/g, '_').slice(0, 60) || 'anh';
}

function cleanTags(raw: unknown): string[] {
  const arr = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
      ? raw.split(',')
      : [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of arr) {
    const v = String(t ?? '').trim().replace(/\s+/g, ' ').slice(0, 30);
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
    if (out.length >= TAG_MAX) break;
  }
  return out;
}

function reqText(raw: unknown, label: string, max: number, min = 1): string {
  const v = String(raw ?? '').trim();
  if (v.length < min) throw new BadRequestError(`Thiếu ${label}.`, 'CL_INCIDENT_MISSING');
  return v.slice(0, max);
}

function optText(raw: unknown, max: number): string | null {
  const v = String(raw ?? '').trim();
  return v ? v.slice(0, max) : null;
}

function normStatus(raw: unknown, fallback: IncidentStatus = 'OPEN'): IncidentStatus {
  return String(raw ?? '').toUpperCase() === 'RESOLVED' ? 'RESOLVED' : fallback;
}

/** Nén + chuyển webp, bỏ metadata. Ném lỗi thân thiện nếu ảnh hỏng. */
async function processImage(buf: Buffer): Promise<Buffer> {
  try {
    return await sharp(buf, { failOn: 'none', limitInputPixels: 100_000_000 })
      .rotate()
      .resize({ width: IMG_MAX_EDGE, height: IMG_MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new BadRequestError('Không đọc được ảnh này.', 'CL_INCIDENT_BAD_IMAGE');
  }
}

async function uploadImages(userId: number, files: Array<{ buffer: Buffer; originalname: string }>): Promise<string[]> {
  const keys: string[] = [];
  for (const f of files.slice(0, MAX_IMAGES)) {
    if (!f.buffer?.length) continue;
    const body = await processImage(f.buffer);
    const key = `code-lab/incidents/${userId}/${crypto.randomUUID()}/${safeName(f.originalname)}.webp`;
    await putObject(key, body, 'image/webp', PRIVATE);
    keys.push(key);
  }
  return keys;
}

function dropImages(keys: string[] | null | undefined): void {
  for (const k of keys ?? []) {
    if (k) void deleteObject(k).catch((e) => logger.warn(`[cl-incident] xoá ảnh R2 lỗi ${k}: ${String(e)}`));
  }
}

async function signImages(keys: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const k of keys) {
    try { out.push(await getSignedReadUrl(k)); } catch { /* bỏ ảnh ký lỗi, không làm hỏng cả trang */ }
  }
  return out;
}

function isAdmin(roles: string[] | undefined): boolean {
  return (roles ?? []).some((r) => ['ADMIN', 'EDITOR'].includes(r.toUpperCase().replace('ROLE_', '')));
}

// ──────────────────────────── Đọc ────────────────────────────

export async function listIncidents(opts: {
  q?: string;
  tag?: string;
  trackId?: number | null;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, Math.floor(opts.page ?? 1));
  const pageSize = Math.min(30, Math.max(1, Math.floor(opts.pageSize ?? 12)));
  const where: Record<string, unknown> = {};
  if (opts.status && ['OPEN', 'RESOLVED'].includes(String(opts.status).toUpperCase())) {
    where.status = String(opts.status).toUpperCase();
  }
  if (opts.trackId) where.trackId = opts.trackId;
  if (opts.tag) where.tags = { has: String(opts.tag).trim() };
  const q = String(opts.q ?? '').trim();
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { context: { contains: q, mode: 'insensitive' } },
      { errorText: { contains: q, mode: 'insensitive' } },
      { solution: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.codeLabIncident.count({ where }),
    prisma.codeLabIncident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: AUTHOR_SELECT },
        track: { select: TRACK_SELECT },
        _count: { select: { comments: true } },
      },
    }),
  ]);

  const items = await Promise.all(rows.map(async (r) => ({
    id: r.id,
    title: r.title,
    context: r.context,
    errorText: r.errorText,
    solution: r.solution,
    tags: r.tags,
    status: r.status,
    viewCount: r.viewCount,
    commentCount: r._count.comments,
    imageCount: r.imageKeys.length,
    coverUrl: r.imageKeys.length ? (await signImages(r.imageKeys.slice(0, 1)))[0] ?? null : null,
    track: r.track,
    author: r.user,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  })));

  return { items, total, page, pageSize, hasMore: page * pageSize < total };
}

export async function getIncident(id: number, opts: { countView?: boolean } = {}) {
  const row = await prisma.codeLabIncident.findUnique({
    where: { id },
    include: {
      user: { select: AUTHOR_SELECT },
      track: { select: TRACK_SELECT },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: { user: { select: AUTHOR_SELECT } },
      },
    },
  });
  if (!row) throw new NotFoundError('Không tìm thấy sự cố này.');

  if (opts.countView) {
    // Không chờ: tăng lượt xem là phụ, không để nó chặn phản hồi.
    void prisma.codeLabIncident.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => undefined);
  }

  return {
    id: row.id,
    title: row.title,
    context: row.context,
    errorText: row.errorText,
    solution: row.solution,
    tags: row.tags,
    status: row.status,
    viewCount: row.viewCount,
    images: await signImages(row.imageKeys),
    track: row.track,
    author: row.user,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    comments: row.comments.map((c) => ({
      id: c.id,
      body: c.body,
      author: c.user,
      createdAt: c.createdAt,
    })),
  };
}

// ──────────────────────────── Ghi ────────────────────────────

export async function createIncident(userId: number, input: {
  title: unknown;
  context: unknown;
  errorText?: unknown;
  solution?: unknown;
  tags?: unknown;
  trackId?: unknown;
  status?: unknown;
}, files: Array<{ buffer: Buffer; originalname: string }> = []) {
  const title = reqText(input.title, 'tiêu đề', TITLE_MAX, 3);
  const context = reqText(input.context, 'phần "mình đang làm gì"', TEXT_MAX, 3);
  const errorText = optText(input.errorText, TEXT_MAX);
  const solution = optText(input.solution, TEXT_MAX);
  const tags = cleanTags(input.tags);
  const status = normStatus(input.status);
  let trackId: number | null = null;
  if (input.trackId != null && String(input.trackId).trim() !== '') {
    const tid = Number(input.trackId);
    if (Number.isInteger(tid) && tid > 0) {
      const track = await prisma.codeTrack.findUnique({ where: { id: tid }, select: { id: true } });
      if (track) trackId = tid;
    }
  }

  const imageKeys = files.length ? await uploadImages(userId, files) : [];
  try {
    const row = await prisma.codeLabIncident.create({
      data: { userId, trackId, title, context, errorText, solution, tags, imageKeys, status },
      select: { id: true },
    });
    return getIncident(row.id);
  } catch (e) {
    dropImages(imageKeys); // tránh để rác R2 nếu ghi DB hỏng
    throw e;
  }
}

export async function updateIncident(userId: number, roles: string[] | undefined, id: number, input: {
  title?: unknown;
  context?: unknown;
  errorText?: unknown;
  solution?: unknown;
  tags?: unknown;
  trackId?: unknown;
  status?: unknown;
  removeImageKeys?: unknown;
}, files: Array<{ buffer: Buffer; originalname: string }> = []) {
  const row = await prisma.codeLabIncident.findUnique({ where: { id }, select: { userId: true, imageKeys: true } });
  if (!row) throw new NotFoundError('Không tìm thấy sự cố này.');
  if (row.userId !== userId && !isAdmin(roles)) throw new ForbiddenError('Chỉ tác giả mới sửa được.');

  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = reqText(input.title, 'tiêu đề', TITLE_MAX, 3);
  if (input.context !== undefined) data.context = reqText(input.context, 'phần "mình đang làm gì"', TEXT_MAX, 3);
  if (input.errorText !== undefined) data.errorText = optText(input.errorText, TEXT_MAX);
  if (input.solution !== undefined) data.solution = optText(input.solution, TEXT_MAX);
  if (input.tags !== undefined) data.tags = cleanTags(input.tags);
  if (input.status !== undefined) data.status = normStatus(input.status);
  if (input.trackId !== undefined) {
    let trackId: number | null = null;
    if (input.trackId != null && String(input.trackId).trim() !== '') {
      const tid = Number(input.trackId);
      if (Number.isInteger(tid) && tid > 0) {
        const track = await prisma.codeTrack.findUnique({ where: { id: tid }, select: { id: true } });
        if (track) trackId = tid;
      }
    }
    data.trackId = trackId;
  }

  // Ảnh: gỡ những khoá được yêu cầu xoá, thêm ảnh mới (giữ trần MAX_IMAGES).
  const remove = new Set(Array.isArray(input.removeImageKeys) ? input.removeImageKeys.map(String) : []);
  let keys = row.imageKeys.filter((k) => !remove.has(k));
  const removed = row.imageKeys.filter((k) => remove.has(k));
  if (files.length) {
    const room = Math.max(0, MAX_IMAGES - keys.length);
    if (room > 0) keys = keys.concat(await uploadImages(userId, files.slice(0, room)));
  }
  if (input.removeImageKeys !== undefined || files.length) data.imageKeys = keys;

  await prisma.codeLabIncident.update({ where: { id }, data });
  if (removed.length) dropImages(removed);
  return getIncident(id);
}

export async function deleteIncident(userId: number, roles: string[] | undefined, id: number) {
  const row = await prisma.codeLabIncident.findUnique({ where: { id }, select: { userId: true, imageKeys: true } });
  if (!row) throw new NotFoundError('Không tìm thấy sự cố này.');
  if (row.userId !== userId && !isAdmin(roles)) throw new ForbiddenError('Chỉ tác giả mới xoá được.');
  await prisma.codeLabIncident.delete({ where: { id } }); // comments cascade ở DB
  dropImages(row.imageKeys);
  return { id };
}

export async function addComment(userId: number, incidentId: number, rawBody: unknown) {
  const body = reqText(rawBody, 'nội dung bình luận', BODY_MAX, 1);
  const inc = await prisma.codeLabIncident.findUnique({ where: { id: incidentId }, select: { id: true } });
  if (!inc) throw new NotFoundError('Không tìm thấy sự cố này.');
  const c = await prisma.codeLabIncidentComment.create({
    data: { incidentId, userId, body },
    include: { user: { select: AUTHOR_SELECT } },
  });
  return { id: c.id, body: c.body, author: c.user, createdAt: c.createdAt };
}

export async function deleteComment(userId: number, roles: string[] | undefined, incidentId: number, commentId: number) {
  const c = await prisma.codeLabIncidentComment.findUnique({ where: { id: commentId }, select: { userId: true, incidentId: true } });
  if (!c || c.incidentId !== incidentId) throw new NotFoundError('Không tìm thấy bình luận này.');
  if (c.userId !== userId && !isAdmin(roles)) throw new ForbiddenError('Chỉ tác giả mới xoá được.');
  await prisma.codeLabIncidentComment.delete({ where: { id: commentId } });
  return { id: commentId };
}
