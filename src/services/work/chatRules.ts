/**
 * CT Work K-3 (10/10/2026) — LUẬT THUẦN của kênh chat dự án. Không chạm DB ⇒ test bằng bảng (chatRules.test.ts).
 * Phần chạm DB/R2/socket ở chat.service.ts + chatFiles.service.ts.
 *
 * Quyền đi theo permissions.ts (một định nghĩa "người của đội" với docAccess / governanceAccess):
 *   - Khách (vai CLIENT, có hay không cổng khách) và GUEST của không gian (trừ giảng viên TEACHER) chỉ thấy kênh CLIENT
 *     (mặc định KHÔNG có — ADMIN dự án bật). Kênh nội bộ (PUBLIC/PRIVATE) không bao giờ lộ cho họ.
 *   - Kênh PRIVATE: chỉ thành viên tường minh (kể cả ADMIN dự án — riêng tư là riêng tư; ADMIN vẫn lưu trữ được kênh
 *     của mình). AI agent cũng vậy: chỉ đọc/ghi kênh PUBLIC/CLIENT của dự án trong phạm vi token, PRIVATE khi được mời.
 *   - Gửi tin = quyền bình luận (`comment.create`): VIEWER chỉ đọc; TEACHER/CLIENT gửi được (ở kênh họ thấy).
 *   - Agent không tạo/lưu trữ kênh, không ghim, không xoá tin của người khác (rào chắn CTW-28 giữ nguyên).
 */

import { can, type Principal } from './permissions.js';
import type { ProjectRole, WorkspaceRole } from './constants.js';

export const CHANNEL_KINDS = ['PUBLIC', 'PRIVATE', 'CLIENT'] as const;
export type ChannelKind = (typeof CHANNEL_KINDS)[number];

export const GENERAL = 'general';
export const MAX_BODY = 8000;
export const MAX_CHANNELS_PER_PROJECT = 100;
export const MAX_FILES_PER_MESSAGE = 10;
export const MAX_REFS = 5;
export const MAX_WEB_LINKS = 3;
/** "Gọi nhóm" dùng lại link cũ của kênh trong khoảng này (một cuộc gọi đang diễn ra). */
export const CALL_REUSE_MS = 4 * 3600_000;

// ─── Quyền ───────────────────────────────────────────────────────

export interface ChatActor { role: ProjectRole | null; workspaceRole: WorkspaceRole | null; principal?: Principal }

/** TEAM = người của đội (thấy kênh nội bộ) · CLIENT = khách / GUEST (chỉ kênh CLIENT) · null = không vào được dự án. */
export function chatAudience(a: ChatActor): 'TEAM' | 'CLIENT' | null {
  if (!a.role) return null;
  const restricted = a.role === 'CLIENT' || (a.workspaceRole === 'GUEST' && a.role !== 'TEACHER');
  return restricted ? 'CLIENT' : 'TEAM';
}

export function canViewChannel(a: ChatActor, ch: { kind: string }, explicitMember: boolean): boolean {
  const aud = chatAudience(a);
  if (!aud) return false;
  if (aud === 'CLIENT') return ch.kind === 'CLIENT';
  if (ch.kind === 'PRIVATE') return explicitMember;
  return ch.kind === 'PUBLIC' || ch.kind === 'CLIENT';
}

export function canPostInChannel(a: ChatActor, ch: { kind: string; archivedAt?: Date | string | null }, explicitMember: boolean): boolean {
  if (ch.archivedAt) return false;
  return canViewChannel(a, ch, explicitMember) && can(a.role, 'comment.create', {}, a.principal ?? 'HUMAN');
}

/** Tạo kênh: người của đội có quyền sửa thẻ (ADMIN/MEMBER), là NGƯỜI. Kênh CLIENT: chỉ ADMIN. */
export function canCreateChannel(a: ChatActor, kind: ChannelKind): boolean {
  if ((a.principal ?? 'HUMAN') === 'AGENT' || chatAudience(a) !== 'TEAM') return false;
  if (kind === 'CLIENT') return a.role === 'ADMIN';
  return a.role === 'ADMIN' || a.role === 'MEMBER';
}

/** Đổi tên/chủ đề/thành viên/lưu trữ: ADMIN dự án (thấy kênh), hoặc người tạo còn quyền tạo kênh. #general: chỉ chủ đề. */
export function canManageChannel(a: ChatActor, userId: number, ch: { kind: string; createdById: number | null }, explicitMember: boolean): boolean {
  if ((a.principal ?? 'HUMAN') === 'AGENT' || !canViewChannel(a, ch, explicitMember)) return false;
  if (chatAudience(a) !== 'TEAM') return false;
  if (a.role === 'ADMIN') return true;
  return ch.createdById !== null && ch.createdById === userId && canCreateChannel(a, ch.kind as ChannelKind);
}

/** Xoá tin của NGƯỜI KHÁC (kiểm duyệt): ADMIN dự án, là người. */
export function canModerate(a: ChatActor): boolean {
  return can(a.role, 'comment.moderate', {}, a.principal ?? 'HUMAN');
}

/** Ghim/bỏ ghim: người gửi được ở kênh (không phải agent). */
export function canPin(a: ChatActor, ch: { kind: string; archivedAt?: Date | string | null }, explicitMember: boolean): boolean {
  return (a.principal ?? 'HUMAN') === 'HUMAN' && canPostInChannel(a, ch, explicitMember);
}

// ─── Tên kênh ────────────────────────────────────────────────────

/** "Front-end Team!" ⇒ "front-end-team" (chữ thường không dấu, số, gạch nối; 2–40 ký tự). null = không hợp lệ. */
export function channelSlug(raw: string): string | null {
  const s = raw
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/^#+/, '')
    .replace(/[^a-z0-9_-]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40).replace(/-+$/, '');
  return s.length >= 2 ? s : null;
}

// ─── Nội dung tin ────────────────────────────────────────────────

/**
 * Làm sạch thân tin TRƯỚC khi lưu: bỏ ký tự điều khiển (trừ xuống dòng / tab), chuẩn hoá xuống dòng, cắt trần.
 * Thân là MARKDOWN THÔ: client vẽ bằng react-markdown KHÔNG có rehype-raw (thẻ HTML hiện như chữ), link `javascript:`
 * bị urlTransform mặc định bỏ — không có đường nào để HTML trong tin chạy. Email/thông báo dùng bản chữ thường.
 */
export function cleanBody(raw: unknown): string {
  return String(raw ?? '')
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\u2028\u2029\uFEFF]/g, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
    .slice(0, MAX_BODY);
}

/** Bản chữ thường cho thông báo/email/tìm kiếm: bỏ cú pháp markdown phổ biến, gộp khoảng trắng. */
export function plainText(md: string, max = 160): string {
  const s = md
    .replace(/```[\s\S]*?```/g, ' [code] ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '[image]')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__|~~|\*|_)(\S[\s\S]*?\S|\S)\1/g, '$2')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/** Bỏ khối code (``` và `…`) trước khi dò @tên / liên kết — `@Override` trong code không phải nhắc người. */
function withoutCode(md: string): string {
  return md.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' ');
}

/**
 * Tên người được @nhắc (chữ thường, không trùng). `a@b.com` không phải nhắc (đứng sau chữ/số), `@channel`/`@here`
 * bị bỏ (không có nhắc cả kênh — chống spam). Server đối chiếu với NGƯỜI THẤY KÊNH, không ai khác.
 */
export function mentionNames(md: string): string[] {
  const out = new Set<string>();
  const re = /(^|[^\w@./-])@([A-Za-z0-9_][A-Za-z0-9_.-]{0,39})/g;
  let m: RegExpExecArray | null;
  const src = withoutCode(md);
  while ((m = re.exec(src))) {
    const name = m[2].replace(/[.-]+$/, '').toLowerCase();
    if (name && name !== 'channel' && name !== 'here' && name !== 'everyone') out.add(name);
    if (out.size >= 30) break;
  }
  return [...out];
}

// ─── Liên kết nội bộ (thẻ / Docs / test / họp) + link web ngoài ──

export type ChatRef =
  | { t: 'issue' | 'test' | 'doc' | 'meeting'; ws: string | null; key: string; n: number }
  | { t: 'web'; url: string; domain: string; title: string | null };

const INTERNAL_PATH = /\/work\/([a-z0-9][a-z0-9-]{0,62})\/([A-Za-z][A-Za-z0-9_]{0,19})\/(issue|issues|docs|tests|meetings)\/([A-Za-z0-9_-]{1,30})/;

/** Host coi là "của mình" (liên kết tới chính CT Work). Còn lại là web ngoài — KHÔNG BAO GIỜ tự tải (chống SSRF). */
export function isOwnHost(host: string, extra: string[] = []): boolean {
  const h = host.toLowerCase().replace(/:\d+$/, '');
  return ['cuongthai.com', 'www.cuongthai.com', 'localhost', '127.0.0.1', ...extra.map((x) => x.toLowerCase())].includes(h);
}

function internalRef(path: string): ChatRef | null {
  const m = INTERNAL_PATH.exec(path);
  if (!m) return null;
  const ws = m[1];
  const key = m[2].toUpperCase();
  const kind = m[3];
  let tail = m[4];
  // /issues/KEY-12 (dạng Jira) và /issue/12 (dạng CT Work)
  const dash = /^([A-Za-z][A-Za-z0-9_]*)-(\d+)$/.exec(tail);
  if (dash) {
    if (dash[1].toUpperCase() !== key) return null;
    tail = dash[2];
  }
  if (!/^\d+$/.test(tail)) return null;
  const n = Number(tail);
  if (!Number.isSafeInteger(n) || n <= 0) return null;
  const t = kind === 'docs' ? 'doc' : kind === 'tests' ? 'test' : kind === 'meetings' ? 'meeting' : 'issue';
  return { t, ws, key, n };
}

/**
 * Dò liên kết trong tin: link CT Work (tuyệt đối tới host của mình, hoặc đường dẫn /work/…) ⇒ ref nội bộ để dựng thẻ
 * xem trước LÚC ĐỌC theo quyền người xem; `KEY-12` trần của CHÍNH dự án ⇒ ref thẻ; link web ngoài ⇒ chỉ tên miền + tiêu
 * đề có sẵn trong tin (`[tiêu đề](url)`), không tải gì. Trần 5 ref nội bộ + 3 link ngoài.
 */
export function extractRefs(md: string, opts: { projectKey?: string; ownHosts?: string[] } = {}): ChatRef[] {
  const src = withoutCode(md);
  const refs: ChatRef[] = [];
  const seen = new Set<string>();
  const push = (r: ChatRef) => {
    // Cùng một thẻ dán dạng link + gõ KEY-n trong tiêu đề link ⇒ một thẻ xem trước (bỏ qua ws khi so trùng).
    const k = r.t === 'web' ? `web:${r.url}` : `${r.t === 'test' ? 'issue' : r.t}:${r.key}:${r.n}`;
    if (seen.has(k)) return;
    const internal = refs.filter((x) => x.t !== 'web').length;
    const web = refs.length - internal;
    if (r.t === 'web' ? web >= MAX_WEB_LINKS : internal >= MAX_REFS) return;
    seen.add(k);
    refs.push(r);
  };
  // Link markdown có tiêu đề + URL trần, theo thứ tự xuất hiện.
  const re = /\[([^\]\n]{1,200})\]\((\S+?)\)|(?:^|[\s(<])((?:https?:\/\/[^\s<>()]+)|(?:\/work\/[^\s<>()]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const title = m[1] ?? null;
    const raw = (m[2] ?? m[3] ?? '').replace(/[.,;:!?'"]+$/, '');
    if (!raw) continue;
    if (raw.startsWith('/work/')) {
      const r = internalRef(raw);
      if (r) push(r);
      continue;
    }
    let u: URL;
    try { u = new URL(raw); } catch { continue; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') continue;
    if (isOwnHost(u.host, opts.ownHosts)) {
      const r = internalRef(u.pathname);
      if (r) push(r);
      continue;
    }
    push({ t: 'web', url: u.toString().slice(0, 500), domain: u.hostname.replace(/^www\./, '').slice(0, 120), title: title ? title.trim().slice(0, 160) : null });
  }
  if (opts.projectKey) {
    const keyRe = new RegExp(`(^|[^\\w/-])(${opts.projectKey})-(\\d{1,7})(?![\\w-])`, 'g');
    while ((m = keyRe.exec(src))) push({ t: 'issue', ws: null, key: opts.projectKey, n: Number(m[3]) });
  }
  return refs;
}

// ─── Cảm xúc ─────────────────────────────────────────────────────

export const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '👀', '🙏', '✅', '🔥'] as const;

/** Một emoji (có thể kèm biến thể / tông da / ZWJ) — không chữ, không HTML. */
export function validEmoji(raw: string): boolean {
  const s = raw.trim();
  if (!s || s.length > 16) return false;
  return /^\p{Extended_Pictographic}/u.test(s) && !/[A-Za-z0-9<>&"'`]/.test(s.replace(/\uFE0F|\u200D/g, ''));
}

// ─── Tắt tiếng / chế độ báo ──────────────────────────────────────

/** "Cho tới khi bật lại" lưu là năm 2999 (một cột mutedUntil, không cần cờ thứ hai). */
export const MUTE_FOREVER = new Date(Date.UTC(2999, 11, 31));
export const MUTE_CHOICES = ['30m', '1h', '8h', 'tomorrow', 'forever', 'custom', 'off'] as const;
export type MuteChoice = (typeof MUTE_CHOICES)[number];
export const NOTIFY_MODES = ['ALL', 'MENTIONS'] as const;
export type NotifyMode = (typeof NOTIFY_MODES)[number];
export const CHANNEL_NOTIFY = ['DEFAULT', 'ALL', 'MENTIONS'] as const;

const VN = 7 * 3600_000;

/** 08:00 sáng (giờ VN) kế tiếp: đang trước 05:00 thì sáng NAY, còn lại sáng MAI. */
export function nextMorning(now: Date): Date {
  const vn = new Date(now.getTime() + VN);
  const dayStart = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate());
  const add = vn.getUTCHours() < 5 ? 0 : 1;
  return new Date(dayStart + add * 86_400_000 + 8 * 3600_000 - VN);
}

/** Lựa chọn trong menu ⇒ mốc mutedUntil (null = bật lại). Ném lỗi chữ khi tuỳ chỉnh sai. */
export function muteUntilFor(choice: MuteChoice, now: Date, custom?: Date | string | null): Date | null {
  switch (choice) {
    case 'off': return null;
    case '30m': return new Date(now.getTime() + 30 * 60_000);
    case '1h': return new Date(now.getTime() + 3600_000);
    case '8h': return new Date(now.getTime() + 8 * 3600_000);
    case 'tomorrow': return nextMorning(now);
    case 'forever': return MUTE_FOREVER;
    case 'custom': {
      const d = custom ? new Date(custom) : null;
      if (!d || Number.isNaN(d.getTime())) throw new Error('Pick a date and time to mute until');
      if (d.getTime() <= now.getTime() + 60_000) throw new Error('Pick a time in the future');
      if (d.getTime() > now.getTime() + 366 * 86_400_000) throw new Error('Mute for at most a year — or choose “Until I turn it back on”');
      return d;
    }
  }
}

export function isMuted(until: Date | string | null | undefined, now: Date): boolean {
  if (!until) return false;
  return new Date(until).getTime() > now.getTime();
}

export function isMutedForever(until: Date | string | null | undefined): boolean {
  return !!until && new Date(until).getUTCFullYear() >= 2999;
}

/** Chế độ hiệu lực của một kênh: cài riêng của kênh, không có thì theo cài chung. */
export function effectiveMode(channelNotify: string | null | undefined, globalNotify: string | null | undefined): NotifyMode {
  if (channelNotify === 'ALL' || channelNotify === 'MENTIONS') return channelNotify;
  return globalNotify === 'MENTIONS' ? 'MENTIONS' : 'ALL';
}

/** Giờ im lặng (VN) — khoảng có thể vắt qua nửa đêm. Cùng luật với notify.inQuietHours. */
export function inQuiet(start: number | null | undefined, end: number | null | undefined, now: Date): boolean {
  if (start === null || start === undefined || end === null || end === undefined || start === end) return false;
  const hour = new Date(now.getTime() + VN).getUTCHours();
  return start < end ? hour >= start && hour < end : hour >= start || hour < end;
}

export interface AlertInput {
  own: boolean;
  /** Được @nhắc, hoặc có người trả lời luồng của mình. */
  mention: boolean;
  globalMutedUntil?: Date | string | null;
  channelMutedUntil?: Date | string | null;
  mode: NotifyMode;
  quiet: boolean;
  now: Date;
}

/**
 * Một tin có "đáng báo" (âm/toast/thông báo hệ thống) với người nhận không — MÁY CHỦ tính, gửi kèm sự kiện cho từng
 * người, client chỉ còn xét ngữ cảnh tại chỗ (đang mở đúng kênh? cửa sổ có focus?).
 *   - Tin của chính mình: không bao giờ.
 *   - Tắt tiếng TOÀN BỘ chat (snooze) hoặc giờ im lặng: không báo gì (badge vẫn đếm).
 *   - Kênh đang tắt tiếng: chỉ báo khi được @nhắc / trả lời.
 *   - Chế độ "Chỉ khi được @nhắc": chỉ báo khi được @nhắc / trả lời.
 */
export function shouldAlert(i: AlertInput): boolean {
  if (i.own) return false;
  if (isMuted(i.globalMutedUntil, i.now) || i.quiet) return false;
  if (i.mention) return true;
  if (isMuted(i.channelMutedUntil, i.now)) return false;
  return i.mode === 'ALL';
}

/** Badge: kênh tắt tiếng không cộng vào tổng (trừ khi có tin nhắc mình); kênh thường luôn cộng. */
export function badgeCount(c: { unread: number; mentions: number; channelMuted: boolean }): number {
  return c.channelMuted ? c.mentions : c.unread;
}
