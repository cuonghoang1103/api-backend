/**
 * CT Work — Bảng tin: TỆP (ảnh/video/tệp) + URL ký sẵn + thẻ link OpenGraph. Hợp đồng: docs/ctw-feed-hop-dong-api.md §6.
 *
 * Hai đường tải:
 *   A. qua backend (multer RAM): ảnh ≤ 20 MB (server tự xoay theo EXIF, BỎ metadata — GPS không lọt ra —, cắt cạnh ≤ 4096,
 *      làm thumbnail WebP ≤ 1280 px, đo kích thước), video/tệp ≤ 25 MB. Chạy được trong app desktop (CSP chặn PUT R2).
 *   B. URL ký sẵn PUT thẳng R2 (video ≤ 200 MB, tệp ≤ 100 MB — Cloudflare chặn thân > 100 MB qua backend) ⇒ complete (HEAD
 *      kiểm object có thật + dung lượng) ⇒ poster tuỳ chọn (client trích khung hình).
 * Mọi object R2 riêng tư (`private, no-store`), xem bằng URL ký 10 phút — cache trong tiến trình 5 phút để một trang 20 bài
 * không ký lại 40 lần mỗi lần cuộn. Kho test: sandbox R2 (WORK_DB_TEST=1 ⇒ trong RAM, không mở socket).
 *
 * Thẻ link: tải trang (chặn SSRF — resources.safeFetch: chỉ http(s) công khai, kiểm IP mọi chặng, ≤ 4 chặng, hết giờ, trần
 * byte) ⇒ og:title/description/site_name/image ⇒ ẢNH OG tải về R2 (taiCongKhai, ≤ 3 MB ⇒ WebP ≤ 600 px) để trình duyệt/app
 * không bao giờ tự gọi máy chủ lạ (không lộ IP người xem, không vướng CSP).
 */

import crypto from 'node:crypto';
import sharp from 'sharp';
import { prisma } from '../../config/database.js';
import { deleteObject, getSignedDownloadUrl, getSignedUploadUrl, headObject, putObject } from '../../config/r2.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { assertFeedPerson, feedScopesFor } from './feedAccess.js';
import {
  kindOf, MAX_DRAFTS, mimeFor, POSTER_MAX, safeFileName, SIGNED_URL_CACHE_MS, SIGNED_URL_TTL_S, sizeLimit,
  type AttachmentKind,
} from './feedRules.js';

const PRIVATE = 'private, max-age=0, no-store';
const IMG_MAX_EDGE = 4096;
const THUMB_EDGE = 1280;

// ─── URL ký sẵn (cache ngắn) ─────────────────────────────────────

const urlCache = new Map<string, { url: string; exp: number; at: number }>();
const URL_CACHE_MAX = 5000;

/** URL ký sẵn 10 phút cho một khoá R2 — dùng lại trong 5 phút. `download` ⇒ Content-Disposition attachment đúng tên. */
export async function signedUrl(key: string, opts: { download?: string | null } = {}): Promise<{ url: string; expiresAt: string }> {
  const ck = `${key}|${opts.download ?? ''}`;
  const now = Date.now();
  const hit = urlCache.get(ck);
  if (hit && now - hit.at < SIGNED_URL_CACHE_MS) return { url: hit.url, expiresAt: new Date(hit.exp).toISOString() };
  const url = await getSignedDownloadUrl(key, SIGNED_URL_TTL_S, opts.download ?? undefined);
  if (urlCache.size >= URL_CACHE_MAX) {
    // Bỏ nửa cũ nhất (Map giữ thứ tự chèn).
    let n = Math.floor(URL_CACHE_MAX / 2);
    for (const k of urlCache.keys()) { urlCache.delete(k); if (--n <= 0) break; }
  }
  const exp = now + SIGNED_URL_TTL_S * 1000;
  urlCache.set(ck, { url, exp, at: now });
  return { url, expiresAt: new Date(exp).toISOString() };
}

// ─── Việc nền (thẻ link, thông báo) — test chờ được ─────────────

const pending = new Set<Promise<unknown>>();
export function feedBackground(p: Promise<unknown>): void {
  const q = p.catch((err) => logger.warn('[work] feed: việc nền lỗi', { err: (err as Error).message }));
  pending.add(q);
  void q.finally(() => pending.delete(q));
}
/** Test: chờ mọi việc nền của bảng tin. */
export async function _awaitFeedBackgroundForTests(): Promise<void> {
  while (pending.size) await Promise.allSettled([...pending]);
}

// ─── Đính kèm ────────────────────────────────────────────────────

export const ATT_SELECT = {
  id: true, workspaceId: true, postId: true, uploaderId: true, kind: true, status: true, r2Key: true, thumbKey: true, fileName: true,
  mime: true, size: true, width: true, height: true, durationMs: true, alt: true, position: true, createdAt: true,
} as const;
export type AttRow = {
  id: number; workspaceId: number; postId: number | null; uploaderId: number; kind: string; status: string; r2Key: string; thumbKey: string | null;
  fileName: string; mime: string; size: number; width: number | null; height: number | null; durationMs: number | null; alt: string | null;
  position: number; createdAt: Date;
};

/** Dạng trả về (FeedAttachment của hợp đồng) — ký URL theo loại. */
export async function presentAttachment(a: AttRow) {
  const ready = a.status === 'READY';
  const full = ready ? await signedUrl(a.r2Key) : null;
  const thumb = ready && a.thumbKey ? await signedUrl(a.thumbKey) : null;
  return {
    id: a.id, kind: a.kind as AttachmentKind, status: a.status, fileName: a.fileName, mime: a.mime, size: a.size,
    width: a.width, height: a.height, durationMs: a.durationMs, alt: a.alt, position: a.position,
    url: full?.url ?? null,
    thumbUrl: a.kind === 'FILE' ? null : (thumb?.url ?? (a.kind === 'IMAGE' ? full?.url ?? null : null)),
    posterUrl: a.kind === 'VIDEO' ? thumb?.url ?? null : null,
    urlExpiresAt: full?.expiresAt ?? null,
  };
}
export type FeedAttachmentOut = Awaited<ReturnType<typeof presentAttachment>>;

/** Người này đăng được ở ÍT NHẤT một phạm vi của không gian (nháp tải lên thuộc về không gian). */
async function assertCanUploadTo(userId: number, workspaceId: number): Promise<void> {
  await assertFeedPerson(userId);
  const s = await feedScopesFor(userId);
  const ok = s.workspaces.get(workspaceId)?.access.post || [...s.projects.values()].some((p) => p.workspaceId === workspaceId && p.access.post);
  if (!ok) throw new NotFoundError('Workspace not found');
}

/** Dọn nháp > 24 giờ của chính người này + trần số nháp đang treo. */
async function draftRoom(userId: number): Promise<void> {
  const stale = await prisma.workFeedAttachment.findMany({
    where: { uploaderId: userId, postId: null, createdAt: { lt: new Date(Date.now() - 86_400_000) } }, select: { id: true, r2Key: true, thumbKey: true }, take: 50,
  });
  if (stale.length) {
    await prisma.workFeedAttachment.deleteMany({ where: { id: { in: stale.map((s) => s.id) } } });
    for (const s of stale) dropObjects([s.r2Key, s.thumbKey]);
  }
  if (await prisma.workFeedAttachment.count({ where: { uploaderId: userId, postId: null } }) >= MAX_DRAFTS) {
    throw new BadRequestError('Too many files waiting to be posted — post or remove some first', 'WORK_LIMIT');
  }
}

export function dropObjects(keys: Array<string | null | undefined>): void {
  for (const k of keys) if (k) void deleteObject(k).catch(() => undefined);
}

const keyFor = (workspaceId: number, fileName: string) => `work/feed/${workspaceId}/${crypto.randomUUID()}/${safeFileName(fileName)}`;

/** Ảnh: xoay theo EXIF, bỏ metadata, cạnh ≤ 4096; thumbnail WebP ≤ 1280. GIF giữ nguyên (động) — không thumbnail. */
async function processImage(buf: Buffer, mime: string): Promise<{ body: Buffer; mime: string; width: number | null; height: number | null; thumb: Buffer | null }> {
  if (mime === 'image/gif') {
    const meta = await sharp(buf, { animated: false, failOn: 'none' }).metadata().catch(() => null);
    if (!meta?.width) throw new BadRequestError('This image could not be read', 'WORK_FILE_TYPE');
    return { body: buf, mime, width: meta.width ?? null, height: meta.pageHeight ?? meta.height ?? null, thumb: null };
  }
  try {
    const base = sharp(buf, { failOn: 'none', limitInputPixels: 100_000_000 }).rotate().resize({ width: IMG_MAX_EDGE, height: IMG_MAX_EDGE, fit: 'inside', withoutEnlargement: true });
    const out = mime === 'image/png' ? base.png({ compressionLevel: 8 }) : mime === 'image/webp' ? base.webp({ quality: 88 }) : base.jpeg({ quality: 88, mozjpeg: true });
    const { data, info } = await out.toBuffer({ resolveWithObject: true });
    const thumb = (info.width > THUMB_EDGE || info.height > THUMB_EDGE || data.length > 400_000)
      ? await sharp(data).resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer()
      : null;
    return { body: data, mime: mime === 'image/png' || mime === 'image/webp' ? mime : 'image/jpeg', width: info.width, height: info.height, thumb };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new BadRequestError('This image could not be read', 'WORK_FILE_TYPE');
  }
}

/** Đường A — tải qua backend. */
export async function uploadDirect(userId: number, input: { workspaceId: number; buffer: Buffer; fileName: string; mime: string; alt?: string | null }) {
  await assertCanUploadTo(userId, input.workspaceId);
  if (!input.buffer.length) throw new BadRequestError('The file is empty', 'WORK_FILE_EMPTY');
  const fileName = (input.fileName || 'file').slice(0, 255);
  const kind = kindOf(input.mime, fileName);
  const mime = mimeFor(kind, input.mime, fileName);
  const max = sizeLimit(kind, 'direct');
  if (input.buffer.length > max) {
    throw new BadRequestError(kind === 'IMAGE' ? 'Photos must be 20 MB or smaller' : 'Files over 25 MB must use the large-file upload (presign)', 'WORK_FILE_TOO_LARGE');
  }
  await draftRoom(userId);
  const key = keyFor(input.workspaceId, fileName);
  let body = input.buffer;
  let storedMime = mime;
  let width: number | null = null;
  let height: number | null = null;
  let thumbKey: string | null = null;
  if (kind === 'IMAGE') {
    const img = await processImage(input.buffer, mime);
    body = img.body; storedMime = img.mime; width = img.width; height = img.height;
    if (img.thumb) { thumbKey = `${key}.thumb.webp`; await putObject(thumbKey, img.thumb, 'image/webp', PRIVATE); }
  }
  await putObject(key, body, storedMime, PRIVATE);
  const row = await prisma.workFeedAttachment.create({
    data: {
      workspaceId: input.workspaceId, uploaderId: userId, kind, status: 'READY', r2Key: key, thumbKey, fileName, mime: storedMime, size: body.length,
      width, height, alt: input.alt?.trim().slice(0, 300) || null,
    },
    select: ATT_SELECT,
  });
  return presentAttachment(row);
}

/** Đường B, bước 1 — xin URL PUT ký sẵn (1 giờ). */
export async function presignUpload(userId: number, input: { workspaceId: number; fileName: string; mime: string; size: number; kind: 'VIDEO' | 'FILE' }) {
  await assertCanUploadTo(userId, input.workspaceId);
  const fileName = (input.fileName || 'file').slice(0, 255);
  const detected = kindOf(input.mime, fileName);
  if (input.kind === 'VIDEO' && detected !== 'VIDEO') throw new BadRequestError('Videos must be MP4, MOV or WebM', 'WORK_FILE_TYPE');
  const kind: AttachmentKind = input.kind === 'VIDEO' ? 'VIDEO' : detected === 'VIDEO' ? 'VIDEO' : 'FILE';
  if (detected === 'IMAGE') throw new BadRequestError('Upload photos through /feed/uploads so the server can make thumbnails', 'WORK_FILE_TYPE');
  const mime = mimeFor(kind, input.mime, fileName);
  const max = sizeLimit(kind, 'presign');
  if (!Number.isFinite(input.size) || input.size <= 0) throw new BadRequestError('The file is empty', 'WORK_FILE_EMPTY');
  if (input.size > max) throw new BadRequestError(kind === 'VIDEO' ? 'Videos must be 200 MB or smaller' : 'Files must be 100 MB or smaller', 'WORK_FILE_TOO_LARGE');
  await draftRoom(userId);
  const key = keyFor(input.workspaceId, fileName);
  const row = await prisma.workFeedAttachment.create({
    data: { workspaceId: input.workspaceId, uploaderId: userId, kind, status: 'PENDING', r2Key: key, fileName, mime, size: Math.round(input.size) },
    select: ATT_SELECT,
  });
  const uploadUrl = await getSignedUploadUrl(key, mime, 3600);
  return {
    attachment: await presentAttachment(row), uploadUrl, method: 'PUT' as const, headers: { 'Content-Type': mime },
    expiresAt: new Date(Date.now() + 3600_000).toISOString(),
  };
}

async function ownDraftOrPost(userId: number, id: number) {
  const a = await prisma.workFeedAttachment.findFirst({ where: { id, uploaderId: userId }, select: { ...ATT_SELECT, post: { select: { authorId: true, deletedAt: true } } } });
  if (!a || (a.post && (a.post.deletedAt || a.post.authorId !== userId))) throw new NotFoundError('Upload not found');
  return a;
}

/** Đường B, bước 3 — object đã PUT xong ⇒ READY. */
export async function completeUpload(userId: number, id: number, input: { width?: number | null; height?: number | null; durationMs?: number | null } = {}) {
  await assertFeedPerson(userId);
  const a = await ownDraftOrPost(userId, id);
  if (a.status === 'READY') return presentAttachment(a);
  const head = await headObject(a.r2Key);
  if (!head) throw new BadRequestError('The upload has not finished — PUT the file to uploadUrl first', 'WORK_UPLOAD_MISSING');
  const max = sizeLimit(a.kind as AttachmentKind, 'presign');
  if (head.size > max || head.size <= 0) {
    await prisma.workFeedAttachment.delete({ where: { id } });
    dropObjects([a.r2Key]);
    throw new BadRequestError(head.size <= 0 ? 'The file is empty' : 'The uploaded file is larger than allowed', head.size <= 0 ? 'WORK_FILE_EMPTY' : 'WORK_FILE_TOO_LARGE');
  }
  const dim = (v: number | null | undefined, hi: number) => (typeof v === 'number' && Number.isFinite(v) && v > 0 && v <= hi ? Math.round(v) : null);
  const row = await prisma.workFeedAttachment.update({
    where: { id },
    data: { status: 'READY', size: head.size, width: dim(input.width, 20_000), height: dim(input.height, 20_000), durationMs: dim(input.durationMs, 24 * 3600_000) },
    select: ATT_SELECT,
  });
  return presentAttachment(row);
}

/** Ảnh poster của video (client trích khung hình). */
export async function uploadPoster(userId: number, id: number, buffer: Buffer) {
  await assertFeedPerson(userId);
  const a = await ownDraftOrPost(userId, id);
  if (a.kind !== 'VIDEO') throw new BadRequestError('Only videos have a poster image', 'WORK_FILE_TYPE');
  if (!buffer.length) throw new BadRequestError('The file is empty', 'WORK_FILE_EMPTY');
  if (buffer.length > POSTER_MAX) throw new BadRequestError('Poster images must be 3 MB or smaller', 'WORK_FILE_TOO_LARGE');
  let webp: Buffer;
  let info: { width: number; height: number };
  try {
    const r = await sharp(buffer, { failOn: 'none' }).rotate().resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
    webp = r.data; info = r.info;
  } catch {
    throw new BadRequestError('This image could not be read', 'WORK_FILE_TYPE');
  }
  const key = `${a.r2Key}.poster-${crypto.randomUUID().slice(0, 8)}.webp`;
  await putObject(key, webp, 'image/webp', PRIVATE);
  const old = a.thumbKey;
  const row = await prisma.workFeedAttachment.update({
    where: { id }, data: { thumbKey: key, width: a.width ?? info.width, height: a.height ?? info.height }, select: ATT_SELECT,
  });
  if (old) dropObjects([old]);
  return presentAttachment(row);
}

export async function setAlt(userId: number, id: number, alt: string | null) {
  await assertFeedPerson(userId);
  await ownDraftOrPost(userId, id);
  const row = await prisma.workFeedAttachment.update({ where: { id }, data: { alt: alt?.trim().slice(0, 300) || null }, select: ATT_SELECT });
  return presentAttachment(row);
}

export async function deleteDraft(userId: number, id: number) {
  await assertFeedPerson(userId);
  const a = await prisma.workFeedAttachment.findFirst({ where: { id, uploaderId: userId, postId: null }, select: { id: true, r2Key: true, thumbKey: true } });
  if (!a) throw new NotFoundError('Upload not found');
  await prisma.workFeedAttachment.delete({ where: { id } });
  dropObjects([a.r2Key, a.thumbKey]);
  return { deleted: true };
}

/**
 * Tệp mà `userId` ĐỌC ĐƯỢC — một luật cho `/url`, `/content`, `/preview` (xemTep): tệp của bài ⇒ thấy bài (feed.service
 * `visiblePost`); nháp ⇒ chỉ người tải lên.
 */
export async function readableAttachment(userId: number, id: number) {
  await assertFeedPerson(userId);
  const a = await prisma.workFeedAttachment.findFirst({ where: { id }, select: ATT_SELECT });
  if (!a || a.status !== 'READY') throw new NotFoundError('File not found');
  if (a.postId) {
    const { visiblePost } = await import('./feed.service.js');
    await visiblePost(userId, a.postId).catch(() => { throw new NotFoundError('File not found'); });
  } else if (a.uploaderId !== userId) {
    throw new NotFoundError('File not found');
  }
  return a;
}

export async function attachmentUrl(userId: number, id: number, opts: { variant?: 'full' | 'thumb' | 'poster'; download?: boolean } = {}) {
  const a = await readableAttachment(userId, id);
  if (opts.download) return signedUrl(a.r2Key, { download: a.fileName });
  if ((opts.variant === 'thumb' || opts.variant === 'poster') && a.thumbKey) return signedUrl(a.thumbKey);
  if (opts.variant === 'poster') throw new NotFoundError('This video has no poster image');
  return signedUrl(a.r2Key);
}

// ─── Thẻ link (OpenGraph) ───────────────────────────────────────

export interface StoredPreview { url: string; domain: string; title: string; description: string | null; siteName: string | null; imageKey: string | null }
export interface PageInfo { url: string; domain: string; title: string; description: string | null; siteName: string | null; imageUrl: string | null }

type PageFetcher = (url: string) => Promise<PageInfo>;
type ImageFetcher = (url: string) => Promise<{ bytes: Buffer; type: string }>;
let pageOverride: PageFetcher | null = null;
let imageOverride: ImageFetcher | null = null;
/** Test: thay việc tải trang/ảnh (máy test không ra mạng; server test ở 127.0.0.1 bị chặn đúng luật SSRF). */
export function _setFeedLinkFetchForTests(page: PageFetcher | null, image: ImageFetcher | null = null): void {
  pageOverride = page;
  imageOverride = image;
}

const domainOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, '').slice(0, 120); } catch { return ''; } };

/** Trang ⇒ tiêu đề/mô tả/ảnh OG. Địa chỉ nội bộ ⇒ 400 WORK_URL_BLOCKED; trang không trả lời ⇒ tiêu đề từ URL. */
export async function pageInfo(raw: string): Promise<PageInfo> {
  let url: string;
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('proto');
    url = u.toString();
  } catch {
    throw new BadRequestError('Not a valid http(s) link', 'VALIDATION_ERROR');
  }
  if (pageOverride) return pageOverride(url);
  const { safeFetch, OutboundError } = await import('./resources.service.js');
  const { extractPageInfo, metaContent, titleFromUrl } = await import('./resourceRules.js');
  const base: PageInfo = { url, domain: domainOf(url), title: titleFromUrl(url), description: null, siteName: null, imageUrl: null };
  try {
    const r = await safeFetch(url, { readBody: true, maxBytes: 512 * 1024, timeoutMs: 6000 });
    if (r.status >= 400 || !/html|xml/i.test(r.contentType) || !r.body) return base;
    const info = extractPageInfo(r.body);
    let img = metaContent(r.body, 'og:image') ?? metaContent(r.body, 'og:image:url') ?? metaContent(r.body, 'twitter:image');
    if (img) { try { img = new URL(img.trim(), r.finalUrl).toString(); } catch { img = null; } }
    return { ...base, title: info.title ?? base.title, description: info.description, siteName: info.siteName, imageUrl: img && /^https?:/i.test(img) ? img.slice(0, 1000) : null };
  } catch (err) {
    if (err instanceof OutboundError && err.kind === 'BLOCKED') throw new AppError(err.message, 400, 'WORK_URL_BLOCKED');
    return base;
  }
}

/** Composer: xem trước thẻ link (không tải ảnh). */
export async function linkPreview(userId: number, url: string) {
  await assertFeedPerson(userId);
  const p = await pageInfo(url);
  return { url: p.url, domain: p.domain, title: p.title, description: p.description, siteName: p.siteName, imageUrl: null };
}

/** Lúc đăng/sửa: dựng thẻ + tải ảnh OG về R2. Lỗi ⇒ null (bài vẫn đăng, không thẻ). */
export async function buildStoredPreview(workspaceId: number, url: string): Promise<StoredPreview | null> {
  let p: PageInfo;
  try { p = await pageInfo(url); } catch { return null; }
  let imageKey: string | null = null;
  if (p.imageUrl) {
    try {
      let got: { bytes: Buffer; type: string };
      if (imageOverride) got = await imageOverride(p.imageUrl);
      else {
        const { taiCongKhai } = await import('../linkNgoai/taiAnToan.js');
        const r = await taiCongKhai(p.imageUrl, { tranByte: 3 * 1024 * 1024, hetGioMs: 6000 });
        got = { bytes: r.byte, type: r.kieu };
      }
      if (/^image\//.test(got.type) && !/svg/.test(got.type)) {
        const webp = await sharp(got.bytes, { failOn: 'none', limitInputPixels: 50_000_000 }).resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
        imageKey = `work/feed/${workspaceId}/link/${crypto.randomUUID()}.webp`;
        await putObject(imageKey, webp, 'image/webp', PRIVATE);
      }
    } catch (err) {
      logger.debug?.('[work] feed: ảnh OG lỗi', { err: (err as Error).message });
      imageKey = null;
    }
  }
  return { url: p.url, domain: p.domain, title: p.title, description: p.description, siteName: p.siteName, imageKey };
}

export async function presentPreview(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as StoredPreview;
  if (!p.url) return null;
  return {
    url: p.url, domain: p.domain, title: p.title, description: p.description ?? null, siteName: p.siteName ?? null,
    imageUrl: p.imageKey ? (await signedUrl(p.imageKey)).url : null,
  };
}

// ─── Quyền dùng chung với feed.service ───────────────────────────

/** Gắn nháp vào bài: chỉ nháp của CHÍNH người gọi, cùng không gian, READY, chưa gắn. Trả loại theo đúng thứ tự id. */
export async function claimableDrafts(userId: number, workspaceId: number, ids: number[]): Promise<AttRow[]> {
  if (!ids.length) return [];
  const rows = await prisma.workFeedAttachment.findMany({ where: { id: { in: ids }, uploaderId: userId, workspaceId, postId: null, status: 'READY' }, select: ATT_SELECT });
  if (rows.length !== new Set(ids).size) throw new BadRequestError('Some attachments are not your finished uploads in this workspace', 'WORK_FEED_BAD_ATTACHMENT');
  const by = new Map(rows.map((r) => [r.id, r]));
  return [...new Set(ids)].map((id) => by.get(id)!);
}

