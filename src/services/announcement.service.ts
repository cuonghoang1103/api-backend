/**
 * Announcement service — site-wide announcements (admin-authored).
 * ────────────────────────────────────────────────────────────────
 * A small broadcast surface: admins publish announcements (news,
 * maintenance notices, docs, updates) that every user can read.
 * Reads are public; writes are admin-only (guarded at the route
 * layer). Pinned announcements float to the top, then newest first.
 *
 * Mirrors the prisma import + AppError style used by
 * notes.service.ts / social.service.ts.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// ─── Constants ───────────────────────────────────────────────

const CATEGORIES = ['maintenance', 'update', 'docs', 'general'] as const;
type Category = (typeof CATEGORIES)[number];

// Author fields exposed on every announcement read.
const authorInclude = {
  author: {
    select: {
      id: true,
      username: true,
      displayName: true,
      fullName: true,
      avatarUrl: true,
    },
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────────

function assertId(id: number, label = 'id'): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(`${label} không hợp lệ`, 400, 'INVALID_ID');
  }
}

function cleanStr(v: unknown, max: number, label: string, { required = false } = {}): string | undefined {
  if (v === undefined) return undefined;
  const s = String(v ?? '').trim();
  if (required && s.length === 0) throw new AppError(`${label} không được để trống`, 400, 'INVALID_INPUT');
  if (s.length > max) throw new AppError(`${label} quá dài (tối đa ${max} ký tự)`, 400, 'INVALID_INPUT');
  return s;
}

function normalizeCategory(v: unknown, { fallback = true } = {}): Category | undefined {
  if (v === undefined) return fallback ? 'general' : undefined;
  const s = String(v ?? '').trim().toLowerCase();
  if (s.length === 0) return fallback ? 'general' : undefined;
  if (!CATEGORIES.includes(s as Category)) {
    throw new AppError(
      `Danh mục không hợp lệ (chỉ chấp nhận: ${CATEGORIES.join(', ')})`,
      400,
      'INVALID_CATEGORY',
    );
  }
  return s as Category;
}

// ─── Reads ───────────────────────────────────────────────────

export interface ListOptions {
  cursor?: number;
  limit?: number;
}

/**
 * List announcements — pinned first, then newest. Cursor
 * pagination uses the announcement id as a stable cursor:
 * pass the previous page's `nextCursor` back as `?cursor=<id>`.
 */
export async function listAnnouncements({ cursor, limit = 20 }: ListOptions = {}) {
  const take = Math.min(50, Math.max(1, Number(limit) || 20));

  const items = await prisma.announcement.findMany({
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    take: take + 1,
    ...(cursor != null ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: authorInclude,
  });

  const hasMore = items.length > take;
  if (hasMore) items.pop();
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

  return { items, nextCursor };
}

/** Single announcement read. Throws 404 if missing. */
export async function getAnnouncement(id: number) {
  assertId(id, 'id');
  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: authorInclude,
  });
  if (!announcement) {
    throw new AppError('Thông báo không tồn tại', 404, 'ANNOUNCEMENT_NOT_FOUND');
  }
  return announcement;
}

// ─── Writes (admin) ──────────────────────────────────────────

export interface CreateInput {
  title?: unknown;
  body?: unknown;
  category?: unknown;
  coverImageUrl?: unknown;
  isPinned?: unknown;
}

export async function createAnnouncement(authorId: number | null, input: CreateInput) {
  const title = cleanStr(input.title, 255, 'Tiêu đề', { required: true })!;
  const body = cleanStr(input.body, 100_000, 'Nội dung', { required: true })!;
  const category = normalizeCategory(input.category)!;
  const coverImageUrl = cleanStr(input.coverImageUrl, 500, 'Ảnh bìa') || null;

  return prisma.announcement.create({
    data: {
      title,
      body,
      category,
      coverImageUrl,
      isPinned: Boolean(input.isPinned),
      authorId: authorId ?? null,
    },
    include: authorInclude,
  });
}

export interface UpdateInput {
  title?: unknown;
  body?: unknown;
  category?: unknown;
  coverImageUrl?: unknown;
  isPinned?: unknown;
}

export async function updateAnnouncement(id: number, input: UpdateInput) {
  assertId(id, 'id');

  const existing = await prisma.announcement.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new AppError('Thông báo không tồn tại', 404, 'ANNOUNCEMENT_NOT_FOUND');
  }

  const data: {
    title?: string;
    body?: string;
    category?: Category;
    coverImageUrl?: string | null;
    isPinned?: boolean;
  } = {};

  const title = cleanStr(input.title, 255, 'Tiêu đề', { required: true });
  if (title !== undefined) data.title = title;

  const body = cleanStr(input.body, 100_000, 'Nội dung', { required: true });
  if (body !== undefined) data.body = body;

  const category = normalizeCategory(input.category, { fallback: false });
  if (category !== undefined) data.category = category;

  if (input.coverImageUrl !== undefined) {
    data.coverImageUrl = cleanStr(input.coverImageUrl, 500, 'Ảnh bìa') || null;
  }

  if (input.isPinned !== undefined) data.isPinned = Boolean(input.isPinned);

  return prisma.announcement.update({
    where: { id },
    data,
    include: authorInclude,
  });
}

export async function deleteAnnouncement(id: number) {
  assertId(id, 'id');
  const existing = await prisma.announcement.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new AppError('Thông báo không tồn tại', 404, 'ANNOUNCEMENT_NOT_FOUND');
  }
  await prisma.announcement.delete({ where: { id } });
  return { id };
}
