/**
 * CT Work — BẢNG TIN NHÓM (Team Feed, 21/10/2026): phần THUẦN (không DB) — test ở `feedRules.test.ts`.
 *
 * Quyền theo PHẠM VI (hợp đồng docs/ctw-feed-hop-dong-api.md §0):
 *   - không gian: mọi thành viên trừ khách cổng ("chỉ là khách cổng" — permissions.portalOnlyWorkspaceIds) + trừ agent;
 *     OWNER/ADMIN quản trị (ghim, gỡ, xem báo cáo).
 *   - dự án: vai hiệu lực ADMIN/MEMBER/TEACHER/VIEWER; vai CLIENT không bao giờ thấy (bật cổng khách hay không); ADMIN quản trị.
 *   - AI agent: không gì cả (bảng tin là chỗ của người).
 */

import { extractRefs, mentionNames, type ChatRef } from './chatRules.js';
import type { ProjectRole, WorkspaceRole } from './constants.js';
import type { Principal } from './permissions.js';

// ─── Hằng số ─────────────────────────────────────────────────────

export const REACTION_KINDS = ['like', 'love', 'haha', 'wow', 'sad', 'celebrate'] as const;
export type ReactionKind = (typeof REACTION_KINDS)[number];
export const REACTION_EMOJI: Record<ReactionKind, string> = { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😢', celebrate: '🎉' };

export const FOLLOW_LEVELS = ['ALL', 'MENTIONS', 'OFF'] as const;
export type FollowLevel = (typeof FOLLOW_LEVELS)[number];

export const FEED_FILTERS = ['all', 'mine', 'media', 'saved', 'files'] as const;
export type FeedFilter = (typeof FEED_FILTERS)[number];

export const ATTACHMENT_KINDS = ['IMAGE', 'VIDEO', 'FILE'] as const;
export type AttachmentKind = (typeof ATTACHMENT_KINDS)[number];

export const POST_BODY_MAX = 10_000;
export const COMMENT_BODY_MAX = 4_000;
export const MAX_MEDIA_PER_POST = 10;
export const MAX_FILES_PER_POST = 5;
export const MAX_PINNED_PER_SCOPE = 5;
export const POSTS_PER_MINUTE = 10;
export const COMMENTS_PER_MINUTE = 30;
export const MAX_DRAFTS = 30;

export const MB = 1024 * 1024;
/** Đường A (qua backend, multer trong RAM): ảnh ≤ 20 MB, video/tệp ≤ 25 MB. */
export const DIRECT_IMAGE_MAX = 20 * MB;
export const DIRECT_FILE_MAX = 25 * MB;
/** Đường B (URL ký sẵn, PUT thẳng R2). Cloudflare chặn thân request > 100 MB ⇒ video/tệp lớn không qua backend được. */
export const PRESIGN_VIDEO_MAX = 200 * MB;
export const PRESIGN_FILE_MAX = 100 * MB;
export const POSTER_MAX = 3 * MB;

/** Gộp thông báo cảm xúc: tối đa một thông báo / bài / khoảng này. */
export const REACTION_NOTIFY_WINDOW_MS = 15 * 60_000;
/** URL ký sẵn sống 10 phút; cache trong tiến trình 5 phút (luôn còn ≥ 5 phút khi tới tay client). */
export const SIGNED_URL_TTL_S = 600;
export const SIGNED_URL_CACHE_MS = 5 * 60_000;

export const POLL_MIN_OPTIONS = 2;
export const POLL_MAX_OPTIONS = 6;
export const POLL_OPTION_MAX = 120;
export const POLL_MAX_DAYS = 90;

// ─── Quyền theo phạm vi ──────────────────────────────────────────

export interface FeedAccess {
  read: boolean;
  post: boolean;
  moderate: boolean;
}
export const NO_ACCESS: FeedAccess = { read: false, post: false, moderate: false };

/** Bảng tin cấp không gian. `role` = vai HIỆU LỰC (MEMBER chỉ-khách-cổng đã hạ GUEST); `portalOnly` = chỉ là khách cổng. */
export function feedWorkspaceAccess(input: { role: WorkspaceRole | null; principal: Principal; portalOnly: boolean }): FeedAccess {
  if (input.principal === 'AGENT' || !input.role || input.portalOnly) return NO_ACCESS;
  const admin = input.role === 'OWNER' || input.role === 'ADMIN';
  return { read: true, post: true, moderate: admin };
}

/** Bảng tin dự án. `role` = vai hiệu lực trong dự án (effectiveProjectRole). */
export function feedProjectAccess(input: { role: ProjectRole | null; principal: Principal }): FeedAccess {
  if (input.principal === 'AGENT' || !input.role || input.role === 'CLIENT') return NO_ACCESS;
  return { read: true, post: true, moderate: input.role === 'ADMIN' };
}

/** Sửa: chỉ tác giả (quản trị gỡ được nhưng không sửa lời người khác). */
export const canEditOwn = (userId: number, authorId: number): boolean => userId === authorId;
/** Xoá: tác giả hoặc quản trị phạm vi. */
export const canDelete = (userId: number, authorId: number, access: FeedAccess): boolean => access.read && (userId === authorId || access.moderate);
/** Bình luận: đọc được + (bài mở bình luận hoặc là quản trị). */
export const canCommentOn = (access: FeedAccess, commentsOff: boolean): boolean => access.read && (!commentsOff || access.moderate);

/**
 * Bài / bình luận đã bị quản trị gỡ (hiddenAt) chỉ còn thấy được với tác giả + quản trị phạm vi.
 */
export function visibleModerated(hidden: boolean, viewerId: number, authorId: number, access: FeedAccess): boolean {
  return !hidden || viewerId === authorId || access.moderate;
}

// ─── Khoá phạm vi + mức theo dõi ─────────────────────────────────

export const scopeKey = (workspaceId: number, projectId: number | null | undefined): string => (projectId ? `p:${projectId}` : `w:${workspaceId}`);

/** Có báo "bài mới" không (mức theo dõi; không dòng ⇒ ALL). */
export const notifyNewPost = (level: FollowLevel | null | undefined): boolean => (level ?? 'ALL') === 'ALL';
/** Có báo @nhắc không (OFF tắt cả @nhắc của phạm vi đó). */
export const notifyMention = (level: FollowLevel | null | undefined): boolean => (level ?? 'ALL') !== 'OFF';

// ─── Con trỏ phân trang (createdAt desc, id desc) ────────────────

export function encodeCursor(createdAt: Date, id: number): string {
  return Buffer.from(`${createdAt.toISOString()}_${id}`, 'utf8').toString('base64url');
}

export function decodeCursor(raw: string | null | undefined): { createdAt: Date; id: number } | null {
  if (!raw) return null;
  try {
    const s = Buffer.from(raw, 'base64url').toString('utf8');
    const m = /^(\d{4}-\d{2}-\d{2}T[\d:.]+Z)_(\d{1,10})$/.exec(s);
    if (!m) return null;
    const d = new Date(m[1]);
    const id = Number(m[2]);
    if (Number.isNaN(d.getTime()) || !Number.isSafeInteger(id) || id <= 0) return null;
    return { createdAt: d, id };
  } catch {
    return null;
  }
}

// ─── Nội dung: @nhắc, #hashtag, link ─────────────────────────────

/** @tên trong nội dung (đã bỏ khối code, bỏ @channel/@here/@everyone) — chữ thường. */
export const mentionsIn = (md: string): string[] => mentionNames(md);

/**
 * #hashtag: 2–40 ký tự chữ (có dấu tiếng Việt)/số/_, không bắt đầu bằng số thuần, không nằm trong code/link/URL
 * (`https://x.com/#a` không phải hashtag). Chữ thường, không trùng, tối đa 20.
 */
export function hashtagsIn(md: string): string[] {
  const src = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/https?:\/\/\S+/g, ' ');
  const out = new Set<string>();
  const re = /(^|[^\p{L}\p{N}_&/#])#([\p{L}\p{N}_]{2,40})(?![\p{L}\p{N}_])/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const tag = m[2].toLowerCase();
    if (/^\d+$/.test(tag)) continue; // "#12" là số thứ tự, không phải hashtag
    out.add(tag);
    if (out.size >= 20) break;
  }
  return [...out];
}

/** Link nội bộ (thẻ/Docs/test/họp) + link web ngoài. `projectKey` ⇒ `KEY-12` trần trong bài dự án thành ref thẻ. */
export function refsIn(md: string, opts: { projectKey?: string | null; ownHosts?: string[] } = {}): ChatRef[] {
  return extractRefs(md, { projectKey: opts.projectKey ?? undefined, ownHosts: opts.ownHosts });
}

/** Link web ngoài ĐẦU TIÊN của bài (dựng thẻ OpenGraph). */
export function firstWebLink(refs: ChatRef[]): string | null {
  const w = refs.find((r): r is Extract<ChatRef, { t: 'web' }> => r.t === 'web');
  return w ? w.url : null;
}

/** Cắt khoảng trắng thừa; giữ xuống dòng (Markdown). */
export function cleanBody(raw: string | null | undefined): string {
  return String(raw ?? '').replace(/\r\n?/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim();
}

/** Đoạn trích cho thông báo: bỏ cú pháp Markdown nặng, gộp dòng, ≤ max ký tự. */
export function excerptOf(md: string, max = 140): string {
  const t = md
    .replace(/```[\s\S]*?```/g, ' [code] ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`>#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

// ─── Bình chọn ───────────────────────────────────────────────────

export interface PollDef { options: Array<{ id: string; text: string }>; multi: boolean; closesAt: string | null }

const OPTION_IDS = 'abcdefghij';

/** Kiểm + chuẩn hoá bình chọn lúc đăng. Trả lỗi bằng chuỗi (service đổi thành 400 WORK_FEED_POLL). */
export function normalizePoll(input: { options?: unknown; multi?: unknown; closesAt?: unknown } | null | undefined, now = new Date()): PollDef | string | null {
  if (!input) return null;
  const raw = Array.isArray(input.options) ? input.options : [];
  const texts = raw.map((o) => String(typeof o === 'object' && o !== null ? (o as { text?: unknown }).text ?? '' : o ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (texts.length < POLL_MIN_OPTIONS) return `A poll needs at least ${POLL_MIN_OPTIONS} options`;
  if (texts.length > POLL_MAX_OPTIONS) return `A poll can have at most ${POLL_MAX_OPTIONS} options`;
  if (texts.some((t) => t.length > POLL_OPTION_MAX)) return `Keep each option under ${POLL_OPTION_MAX} characters`;
  if (new Set(texts.map((t) => t.toLowerCase())).size !== texts.length) return 'Poll options must be different';
  let closesAt: string | null = null;
  if (input.closesAt !== undefined && input.closesAt !== null && input.closesAt !== '') {
    const d = new Date(String(input.closesAt));
    if (Number.isNaN(d.getTime())) return 'The poll closing time is not valid';
    if (d.getTime() <= now.getTime()) return 'The poll must close in the future';
    if (d.getTime() - now.getTime() > POLL_MAX_DAYS * 86_400_000) return `A poll can stay open at most ${POLL_MAX_DAYS} days`;
    closesAt = d.toISOString();
  }
  return { options: texts.map((text, i) => ({ id: OPTION_IDS[i], text })), multi: input.multi === true, closesAt };
}

export function pollOf(raw: unknown): PollDef | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<PollDef>;
  if (!Array.isArray(p.options) || !p.options.length) return null;
  return { options: p.options.map((o) => ({ id: String(o.id), text: String(o.text) })), multi: p.multi === true, closesAt: typeof p.closesAt === 'string' ? p.closesAt : null };
}

export const pollClosed = (p: PollDef, now = new Date()): boolean => !!p.closesAt && new Date(p.closesAt).getTime() <= now.getTime();

/** Phiếu hợp lệ: id thuộc bình chọn, không trùng; một lựa chọn trừ khi multi. Rỗng = rút phiếu. */
export function validVote(p: PollDef, optionIds: string[]): string[] | string {
  const ids = [...new Set(optionIds.map(String))];
  if (ids.some((id) => !p.options.some((o) => o.id === id))) return 'Pick options from this poll';
  if (!p.multi && ids.length > 1) return 'This poll allows one choice';
  return ids;
}

// ─── Tệp ─────────────────────────────────────────────────────────

const IMAGE_MIME = /^image\/(jpeg|png|webp|gif)$/;
const VIDEO_MIME = /^video\/(mp4|quicktime|webm|x-m4v)$/;

/** Kiểu thật để lưu: SVG/HTML/XML/JS ⇒ octet-stream (không bao giờ để R2 phục vụ như trang chạy được). */
export function safeMime(raw: string | null | undefined): string {
  let m = String(raw ?? '').split(';')[0].trim().toLowerCase().slice(0, 100) || 'application/octet-stream';
  if (/svg|html|xml|javascript|ecmascript/.test(m)) m = 'application/octet-stream';
  return m;
}

/** Loại đính kèm từ MIME (+ đuôi tệp khi trình duyệt không gửi kiểu). */
export function kindOf(mime: string, fileName = ''): AttachmentKind {
  const m = safeMime(mime);
  if (IMAGE_MIME.test(m)) return 'IMAGE';
  if (VIDEO_MIME.test(m)) return 'VIDEO';
  if (m === 'application/octet-stream') {
    const ext = fileName.toLowerCase().split('.').pop() ?? '';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'IMAGE';
    if (['mp4', 'mov', 'webm', 'm4v'].includes(ext)) return 'VIDEO';
  }
  return 'FILE';
}

/** MIME chuẩn theo đuôi cho ảnh/video gửi `application/octet-stream`. */
export function mimeFor(kind: AttachmentKind, mime: string, fileName: string): string {
  const m = safeMime(mime);
  if (m !== 'application/octet-stream' || kind === 'FILE') return m;
  const ext = fileName.toLowerCase().split('.').pop() ?? '';
  const map: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', m4v: 'video/x-m4v' };
  return map[ext] ?? m;
}

/** Trần dung lượng theo đường tải + loại. */
export function sizeLimit(kind: AttachmentKind, via: 'direct' | 'presign'): number {
  if (via === 'direct') return kind === 'IMAGE' ? DIRECT_IMAGE_MAX : DIRECT_FILE_MAX;
  return kind === 'VIDEO' ? PRESIGN_VIDEO_MAX : PRESIGN_FILE_MAX;
}

/** Đếm tệp của một bài theo nhóm (ảnh+video ≤ 10, tệp ≤ 5). Trả lỗi hoặc null. */
export function attachmentMixError(kinds: AttachmentKind[]): string | null {
  const media = kinds.filter((k) => k !== 'FILE').length;
  const files = kinds.length - media;
  if (media > MAX_MEDIA_PER_POST) return `A post can have at most ${MAX_MEDIA_PER_POST} photos and videos`;
  if (files > MAX_FILES_PER_POST) return `A post can have at most ${MAX_FILES_PER_POST} files`;
  return null;
}

export const safeFileName = (n: string): string => n.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';

// ─── Cảm xúc ─────────────────────────────────────────────────────

/** Tóm tắt cảm xúc: giảm dần theo số, hoà thì theo thứ tự bộ cảm xúc. */
export function reactionSummary(rows: Array<{ kind: string; count: number }>): Array<{ kind: ReactionKind; count: number }> {
  const order = (k: string) => REACTION_KINDS.indexOf(k as ReactionKind);
  return rows
    .filter((r) => order(r.kind) >= 0 && r.count > 0)
    .map((r) => ({ kind: r.kind as ReactionKind, count: r.count }))
    .sort((a, b) => b.count - a.count || order(a.kind) - order(b.kind));
}

/** Câu thông báo cảm xúc gộp. */
export function reactionMessage(actorName: string, others: number, kind: ReactionKind): string {
  const e = REACTION_EMOJI[kind];
  if (others <= 0) return `${actorName} reacted ${e} to your post`;
  return `${actorName} and ${others} ${others === 1 ? 'other' : 'others'} reacted to your post`;
}

/** Đường dẫn sâu của bài (web + iOS). */
export function postUrl(wsSlug: string, postId: number, commentId?: number | null): string {
  return `/work/${encodeURIComponent(wsSlug)}/feed?post=${postId}${commentId ? `&comment=${commentId}` : ''}`;
}
