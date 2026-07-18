/**
 * Voice Hub — core service (posts + series).
 *
 * Admin-only creator channel. A post carries ONE piece of media:
 *   - YOUTUBE  → an embedded YouTube video (youtubeId)
 *   - R2_VIDEO → a self-hosted video on Cloudflare R2 (videoUrl)
 *   - AUDIO    → an audio-only voice/podcast (audioUrl)
 *
 * Show-notes (`description`) are Markdown; `descriptionHtml` is rendered and
 * cached at write time (reuses the Tech Trends Markdown renderer — no new dep).
 * Slug auto-derives from the title and stays stable unless the title changes.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { renderArticle } from '../techTrendsRenderer.service.js';

export const VOICE_TYPES = ['VLOG', 'REACTION', 'CODE_EXP', 'PODCAST', 'TUTORIAL'] as const;
export const VOICE_MEDIA_KINDS = ['YOUTUBE', 'R2_VIDEO', 'AUDIO'] as const;
export const VOICE_STATUSES = ['DRAFT', 'PUBLISHED', 'SCHEDULED'] as const;

const MAX_DESC = 100 * 1024;

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(baseValue: string, excludeId?: number): Promise<string> {
  const baseSlug = slugify(baseValue) || `voice-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;
  while (true) {
    const existing = await prisma.voicePost.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}

/** Extract an 11-char YouTube video id from a URL or bare id. Returns null if none. */
export function parseYoutubeId(input: string | null | undefined): string | null {
  const s = String(input ?? '').trim();
  if (!s) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*\bv=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/(?:embed|shorts|live)\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  return null;
}

function renderDescription(md: unknown): { description: string | null; descriptionHtml: string | null } {
  if (md == null) return { description: null, descriptionHtml: null };
  if (typeof md !== 'string') throw new AppError('description phải là chuỗi', 400, 'INVALID_DESCRIPTION');
  if (md.length > MAX_DESC) throw new AppError(`Mô tả quá dài (tối đa ${MAX_DESC} ký tự)`, 400, 'DESCRIPTION_TOO_LONG');
  if (!md.trim()) return { description: '', descriptionHtml: '' };
  const { html } = renderArticle(md);
  return { description: md, descriptionHtml: html };
}

function normChapters(input: unknown): Prisma.InputJsonValue {
  if (input == null) return Prisma.JsonNull as unknown as Prisma.InputJsonValue;
  if (!Array.isArray(input)) throw new AppError('chapters phải là mảng', 400, 'INVALID_CHAPTERS');
  const list = input
    .map((c) => {
      const o = c as { t?: unknown; label?: unknown };
      const t = Math.max(0, Math.round(Number(o.t)));
      const label = String(o.label ?? '').trim().slice(0, 200);
      return Number.isFinite(t) && label ? { t, label } : null;
    })
    .filter((x): x is { t: number; label: string } => x !== null)
    .sort((a, b) => a.t - b.t)
    .slice(0, 50);
  return list as unknown as Prisma.InputJsonValue;
}

function cleanTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return [...new Set(input.map((t) => String(t).trim().replace(/^#/, '')).filter(Boolean))].slice(0, 12);
}

const authorInclude = {
  author: { select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true, bio: true } },
  series: { select: { id: true, title: true, slug: true } },
} as const;

// ─── Media validation ────────────────────────────────────────────────────────

interface MediaInput {
  mediaKind?: unknown;
  youtubeInput?: unknown; // raw url or id from the admin form
  videoUrl?: unknown;
  audioUrl?: unknown;
}

function resolveMedia(input: MediaInput): { mediaKind: string; youtubeId: string | null; videoUrl: string | null; audioUrl: string | null } {
  const mediaKind = String(input.mediaKind ?? 'YOUTUBE').toUpperCase();
  if (!(VOICE_MEDIA_KINDS as readonly string[]).includes(mediaKind)) {
    throw new AppError('Loại media không hợp lệ', 400, 'INVALID_MEDIA_KIND');
  }
  if (mediaKind === 'YOUTUBE') {
    const id = parseYoutubeId(String(input.youtubeInput ?? ''));
    if (!id) throw new AppError('Link YouTube không hợp lệ', 400, 'INVALID_YOUTUBE');
    return { mediaKind, youtubeId: id, videoUrl: null, audioUrl: null };
  }
  if (mediaKind === 'R2_VIDEO') {
    const url = String(input.videoUrl ?? '').trim();
    if (!url) throw new AppError('Chưa có video (upload hoặc dán URL)', 400, 'VIDEO_REQUIRED');
    return { mediaKind, youtubeId: null, videoUrl: url.slice(0, 555), audioUrl: null };
  }
  // AUDIO
  const url = String(input.audioUrl ?? '').trim();
  if (!url) throw new AppError('Chưa có audio (upload hoặc dán URL)', 400, 'AUDIO_REQUIRED');
  return { mediaKind, youtubeId: null, videoUrl: null, audioUrl: url.slice(0, 555) };
}

// ─── Public reads ─────────────────────────────────────────────────────────────

export interface ListOpts {
  page?: number;
  size?: number;
  type?: string;
  seriesSlug?: string;
  tag?: string;
  q?: string;
  featured?: boolean;
}

export async function listPublic(opts: ListOpts) {
  const page = Math.max(1, Number(opts.page) || 1);
  const size = Math.min(48, Math.max(1, Number(opts.size) || 12));
  const where: Prisma.VoicePostWhereInput = { status: 'PUBLISHED' };
  if (opts.type && (VOICE_TYPES as readonly string[]).includes(opts.type)) where.type = opts.type;
  if (opts.featured) where.isFeatured = true;
  if (opts.tag) where.tags = { has: opts.tag };
  if (opts.seriesSlug) where.series = { slug: opts.seriesSlug };
  if (opts.q?.trim()) {
    where.OR = [
      { title: { contains: opts.q, mode: 'insensitive' } },
      { summary: { contains: opts.q, mode: 'insensitive' } },
      { tags: { has: opts.q.toLowerCase() } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.voicePost.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * size,
      take: size,
      include: { ...authorInclude, _count: { select: { comments: true } } },
    }),
    prisma.voicePost.count({ where }),
  ]);

  return {
    posts: rows.map(serializeCard),
    pagination: { page, size, total, totalPages: Math.ceil(total / size) },
  };
}

function serializeCard(p: Record<string, unknown>) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    summary: p.summary,
    type: p.type,
    mediaKind: p.mediaKind,
    youtubeId: p.youtubeId,
    thumbnailUrl: p.thumbnailUrl,
    durationSec: p.durationSec,
    tags: p.tags,
    isFeatured: p.isFeatured,
    isPinned: p.isPinned,
    viewCount: p.viewCount,
    likeCount: p.likeCount,
    publishedAt: p.publishedAt,
    series: p.series ?? null,
    author: p.author ?? null,
    commentCount: (p._count as { comments?: number } | undefined)?.comments ?? 0,
  };
}

/** Full public detail by slug. Optionally records a view + tells viewer's like state. */
export async function getBySlug(slug: string, viewerId?: number | null, countView = false) {
  const post = await prisma.voicePost.findUnique({
    where: { slug },
    include: { ...authorInclude, _count: { select: { comments: true, likes: true } } },
  });
  if (!post || post.status !== 'PUBLISHED') throw new AppError('Không tìm thấy bài viết', 404, 'POST_NOT_FOUND');

  if (countView) {
    await prisma.voicePost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
    post.viewCount += 1;
  }

  let likedByMe = false;
  if (viewerId) {
    const like = await prisma.voiceLike.findUnique({
      where: { uk_voice_like: { postId: post.id, userId: viewerId } },
      select: { id: true },
    });
    likedByMe = !!like;
  }

  return { ...serializeDetail(post as unknown as Record<string, unknown>), likedByMe };
}

function serializeDetail(p: Record<string, unknown>) {
  return {
    ...serializeCard(p),
    description: p.description ?? null,
    descriptionHtml: p.descriptionHtml ?? null,
    chapters: p.chapters ?? [],
    videoUrl: p.videoUrl ?? null,
    audioUrl: p.audioUrl ?? null,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

/** A few related posts (same series first, then same type). */
export async function getRelated(postId: number, seriesId: number | null, type: string, limit = 6) {
  const rows = await prisma.voicePost.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: postId },
      OR: [...(seriesId ? [{ seriesId }] : []), { type }],
    },
    orderBy: [{ publishedAt: 'desc' }],
    take: limit,
    include: { ...authorInclude, _count: { select: { comments: true } } },
  });
  return rows.map(serializeCard);
}

// ─── Post like (viewer) ──────────────────────────────────────────────────────

export async function togglePostLike(postId: number, userId: number): Promise<{ liked: boolean; likeCount: number }> {
  const post = await prisma.voicePost.findUnique({ where: { id: postId }, select: { id: true, status: true } });
  if (!post || post.status !== 'PUBLISHED') throw new AppError('Không tìm thấy bài viết', 404, 'POST_NOT_FOUND');

  const existing = await prisma.voiceLike.findUnique({
    where: { uk_voice_like: { postId, userId } },
    select: { id: true },
  });
  if (existing) {
    const [, updated] = await prisma.$transaction([
      prisma.voiceLike.delete({ where: { id: existing.id } }),
      prisma.voicePost.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } }, select: { likeCount: true } }),
    ]);
    return { liked: false, likeCount: Math.max(0, updated.likeCount) };
  }
  try {
    const [, updated] = await prisma.$transaction([
      prisma.voiceLike.create({ data: { postId, userId } }),
      prisma.voicePost.update({ where: { id: postId }, data: { likeCount: { increment: 1 } }, select: { likeCount: true } }),
    ]);
    return { liked: true, likeCount: updated.likeCount };
  } catch {
    const p = await prisma.voicePost.findUnique({ where: { id: postId }, select: { likeCount: true } });
    return { liked: true, likeCount: p?.likeCount ?? 0 };
  }
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export interface UpsertInput {
  title?: unknown;
  summary?: unknown;
  description?: unknown;
  type?: unknown;
  mediaKind?: unknown;
  youtubeInput?: unknown;
  videoUrl?: unknown;
  audioUrl?: unknown;
  thumbnailUrl?: unknown;
  durationSec?: unknown;
  chapters?: unknown;
  tags?: unknown;
  seriesId?: unknown;
  isFeatured?: unknown;
  isPinned?: unknown;
  status?: unknown;
  publishedAt?: unknown;
}

function normType(t: unknown): string {
  const v = String(t ?? 'VLOG').toUpperCase();
  return (VOICE_TYPES as readonly string[]).includes(v) ? v : 'VLOG';
}

function normStatus(s: unknown): string {
  const v = String(s ?? 'DRAFT').toUpperCase();
  return (VOICE_STATUSES as readonly string[]).includes(v) ? v : 'DRAFT';
}

export async function adminList(opts: { page?: number; size?: number; status?: string; type?: string; q?: string }) {
  const page = Math.max(1, Number(opts.page) || 1);
  const size = Math.min(50, Math.max(1, Number(opts.size) || 20));
  const where: Prisma.VoicePostWhereInput = {};
  if (opts.status && (VOICE_STATUSES as readonly string[]).includes(opts.status)) where.status = opts.status;
  if (opts.type && (VOICE_TYPES as readonly string[]).includes(opts.type)) where.type = opts.type;
  if (opts.q?.trim()) where.title = { contains: opts.q, mode: 'insensitive' };

  const [rows, total] = await Promise.all([
    prisma.voicePost.findMany({
      where,
      orderBy: [{ updatedAt: 'desc' }],
      skip: (page - 1) * size,
      take: size,
      include: { ...authorInclude, _count: { select: { comments: true, likes: true } } },
    }),
    prisma.voicePost.count({ where }),
  ]);
  return { posts: rows, pagination: { page, size, total, totalPages: Math.ceil(total / size) } };
}

export async function adminGet(id: number) {
  const post = await prisma.voicePost.findUnique({ where: { id }, include: authorInclude });
  if (!post) throw new AppError('Không tìm thấy bài viết', 404, 'POST_NOT_FOUND');
  return post;
}

export async function createPost(input: UpsertInput, authorId: number | null) {
  const title = String(input.title ?? '').trim();
  if (!title) throw new AppError('Cần nhập tiêu đề', 400, 'TITLE_REQUIRED');

  const media = resolveMedia(input);
  const slug = await ensureUniqueSlug(title);
  const { description, descriptionHtml } = renderDescription(input.description ?? null);
  const status = normStatus(input.status);

  const created = await prisma.voicePost.create({
    data: {
      title: title.slice(0, 255),
      slug,
      summary: input.summary != null ? String(input.summary).slice(0, 500) : null,
      description,
      descriptionHtml,
      type: normType(input.type),
      mediaKind: media.mediaKind,
      youtubeId: media.youtubeId,
      videoUrl: media.videoUrl,
      audioUrl: media.audioUrl,
      thumbnailUrl: input.thumbnailUrl != null ? String(input.thumbnailUrl).slice(0, 500) : null,
      durationSec: input.durationSec != null ? Math.max(0, Math.round(Number(input.durationSec))) || null : null,
      chapters: normChapters(input.chapters ?? null),
      tags: cleanTags(input.tags),
      seriesId: input.seriesId != null ? Number(input.seriesId) || null : null,
      isFeatured: !!input.isFeatured,
      isPinned: !!input.isPinned,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : input.publishedAt ? new Date(String(input.publishedAt)) : null,
      authorId,
    },
    include: authorInclude,
  });
  return created;
}

export async function updatePost(id: number, input: UpsertInput) {
  const existing = await prisma.voicePost.findUnique({ where: { id }, select: { id: true, title: true, slug: true, status: true, publishedAt: true } });
  if (!existing) throw new AppError('Không tìm thấy bài viết', 404, 'POST_NOT_FOUND');

  const data: Prisma.VoicePostUpdateInput = {};

  if (input.title != null) {
    const title = String(input.title).trim();
    if (!title) throw new AppError('Tiêu đề không được trống', 400, 'TITLE_REQUIRED');
    data.title = title.slice(0, 255);
    if (title !== existing.title) data.slug = await ensureUniqueSlug(title, id);
  }
  if (input.summary !== undefined) data.summary = input.summary != null ? String(input.summary).slice(0, 500) : null;
  if (input.description !== undefined) {
    const { description, descriptionHtml } = renderDescription(input.description);
    data.description = description;
    data.descriptionHtml = descriptionHtml;
  }
  if (input.type !== undefined) data.type = normType(input.type);
  if (input.mediaKind !== undefined || input.youtubeInput !== undefined || input.videoUrl !== undefined || input.audioUrl !== undefined) {
    const media = resolveMedia(input);
    data.mediaKind = media.mediaKind;
    data.youtubeId = media.youtubeId;
    data.videoUrl = media.videoUrl;
    data.audioUrl = media.audioUrl;
  }
  if (input.thumbnailUrl !== undefined) data.thumbnailUrl = input.thumbnailUrl != null ? String(input.thumbnailUrl).slice(0, 500) : null;
  if (input.durationSec !== undefined) data.durationSec = input.durationSec != null ? Math.max(0, Math.round(Number(input.durationSec))) || null : null;
  if (input.chapters !== undefined) data.chapters = normChapters(input.chapters);
  if (input.tags !== undefined) data.tags = cleanTags(input.tags);
  if (input.seriesId !== undefined) {
    data.series = input.seriesId != null && Number(input.seriesId) ? { connect: { id: Number(input.seriesId) } } : { disconnect: true };
  }
  if (input.isFeatured !== undefined) data.isFeatured = !!input.isFeatured;
  if (input.isPinned !== undefined) data.isPinned = !!input.isPinned;
  if (input.status !== undefined) {
    const status = normStatus(input.status);
    data.status = status;
    // Stamp publishedAt the first time it goes live.
    if (status === 'PUBLISHED' && existing.status !== 'PUBLISHED' && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
  }
  if (input.publishedAt !== undefined && input.publishedAt) data.publishedAt = new Date(String(input.publishedAt));

  const updated = await prisma.voicePost.update({ where: { id }, data, include: authorInclude });
  return updated;
}

export async function deletePost(id: number) {
  const existing = await prisma.voicePost.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError('Không tìm thấy bài viết', 404, 'POST_NOT_FOUND');
  await prisma.voicePost.delete({ where: { id } });
}

export async function setStatus(id: number, status: 'PUBLISHED' | 'DRAFT') {
  const existing = await prisma.voicePost.findUnique({ where: { id }, select: { id: true, publishedAt: true } });
  if (!existing) throw new AppError('Không tìm thấy bài viết', 404, 'POST_NOT_FOUND');
  return prisma.voicePost.update({
    where: { id },
    data: {
      status,
      ...(status === 'PUBLISHED' && !existing.publishedAt ? { publishedAt: new Date() } : {}),
    },
    include: authorInclude,
  });
}

// ─── Series ────────────────────────────────────────────────────────────────

export async function listSeries() {
  return prisma.voiceSeries.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { posts: true } } },
  });
}

export async function createSeries(input: { title?: unknown; description?: unknown; coverImageUrl?: unknown }) {
  const title = String(input.title ?? '').trim();
  if (!title) throw new AppError('Cần nhập tên series', 400, 'TITLE_REQUIRED');
  const slug = await ensureUniqueSeriesSlug(title);
  return prisma.voiceSeries.create({
    data: {
      title: title.slice(0, 255),
      slug,
      description: input.description != null ? String(input.description) : null,
      coverImageUrl: input.coverImageUrl != null ? String(input.coverImageUrl).slice(0, 500) : null,
    },
  });
}

export async function updateSeries(id: number, input: { title?: unknown; description?: unknown; coverImageUrl?: unknown }) {
  const existing = await prisma.voiceSeries.findUnique({ where: { id }, select: { id: true, title: true } });
  if (!existing) throw new AppError('Không tìm thấy series', 404, 'SERIES_NOT_FOUND');
  const data: Prisma.VoiceSeriesUpdateInput = {};
  if (input.title != null) {
    const title = String(input.title).trim();
    if (!title) throw new AppError('Tên series không được trống', 400, 'TITLE_REQUIRED');
    data.title = title.slice(0, 255);
    if (title !== existing.title) data.slug = await ensureUniqueSeriesSlug(title, id);
  }
  if (input.description !== undefined) data.description = input.description != null ? String(input.description) : null;
  if (input.coverImageUrl !== undefined) data.coverImageUrl = input.coverImageUrl != null ? String(input.coverImageUrl).slice(0, 500) : null;
  return prisma.voiceSeries.update({ where: { id }, data });
}

export async function deleteSeries(id: number) {
  const existing = await prisma.voiceSeries.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError('Không tìm thấy series', 404, 'SERIES_NOT_FOUND');
  await prisma.voiceSeries.delete({ where: { id } }); // posts.seriesId set null via FK
}

async function ensureUniqueSeriesSlug(baseValue: string, excludeId?: number): Promise<string> {
  const baseSlug = slugify(baseValue) || `series-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;
  while (true) {
    const existing = await prisma.voiceSeries.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}
