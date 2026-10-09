/**
 * CT Work — API + tiện ích của đợt nâng cấp theo lần dùng thật đầu tiên (dự án CTW, 06/10/2026).
 * Backend: src/services/work/{gateEvidence,branding.service,fold,projectLanguage}.ts.
 */

import { api } from './api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

// ─── CTW-1 / CTW-13: bằng chứng cổng giai đoạn ───────────────────

export interface GateEvidence {
  /** Thẻ cổng của giai đoạn (tiêu chí ra). */
  criteria: { number: number; key: string; title: string; done: boolean; text: string | null } | null;
  issues: Array<{ number: number; key: string; title: string; done: boolean; status: { name: string; category: 'TODO' | 'IN_PROGRESS' | 'DONE' }; type: string; pinned: boolean }>;
  issueTotal: number;
  issueDone: number;
  pages: Array<{ number: number; title: string; status: string; visibility?: string }>;
  files: Array<{ id: number; fileName: string; mime: string; size: number; deliverable: boolean; issueKey: string; clientVisible?: boolean }>;
  /** Chỉ đội dự án thấy. */
  openAtRequest?: number | null;
  openReason?: string | null;
}

export interface RequestGateBody {
  description?: string | null;
  clientNote?: string | null;
  dueAt?: string | null;
  override?: { reason: string } | null;
  issueNumbers?: number[];
  pageNumbers?: number[];
  attachmentIds?: number[];
  acknowledgeOpen?: boolean;
  openReason?: string | null;
}

/** 409 WORK_GATE_OPEN_ISSUES — danh sách thẻ còn mở. */
export function gateOpenIssuesOf(err: unknown): { openIssues: number; issues: Array<{ number: number; key: string; title: string; status: string }> } | null {
  const r = (err as { response?: { status?: number; data?: { code?: string; data?: { openIssues?: number; issues?: Array<{ number: number; key: string; title: string; status: string }> } } } })?.response;
  if (r?.status !== 409 || r.data?.code !== 'WORK_GATE_OPEN_ISSUES') return null;
  return { openIssues: Number(r.data.data?.openIssues ?? 0), issues: r.data.data?.issues ?? [] };
}

/** Mã lỗi API (axios) — để rẽ nhánh theo `code`. */
export function errorCodeOf(err: unknown): string | null {
  return (err as { response?: { data?: { code?: string } } })?.response?.data?.code ?? null;
}

// ─── CTW-23: nhận diện dự án / không gian ────────────────────────

export const BRAND_MAX_BYTES = 5 * 1024 * 1024;
export const BRAND_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/**
 * UX-D (09/10/2026): gửi BYTE ảnh cho backend (POST …/upload) thay vì presign → PUT thẳng endpoint R2. Đường cũ báo
 * "Failed to fetch" trên production: app desktop chặn R2 ở CSP `connect-src`, web phụ thuộc CORS của bucket. Backend
 * kiểm bằng sharp, thu ≤ 512px, lưu PNG. Không FormData (instance axios đặt cứng JSON sẽ biến FormData thành `{}`).
 */
async function uploadBrand(uploadPath: string, file: File): Promise<Record<string, string | null>> {
  if (!BRAND_IMAGE_TYPES.includes(file.type)) throw new Error('Use a PNG, JPEG, WebP or GIF image');
  if (file.size > BRAND_MAX_BYTES) throw new Error('Images must be 5 MB or smaller');
  const buf = await file.arrayBuffer();
  return d<Record<string, string | null>>(api.post(uploadPath, buf, { headers: { 'Content-Type': file.type }, timeout: 60_000, transformRequest: [(x) => x] }));
}

export const workBrandApi = {
  /** Emoji + màu (#rrggbb); null = gỡ. */
  update: (pid: number, body: { iconEmoji?: string | null; color?: string | null }) => d(api.patch(`${B}/projects/${pid}`, body)),
  uploadAvatar: (pid: number, file: File) => uploadBrand(`${B}/projects/${pid}/avatar/upload`, file),
  removeAvatar: (pid: number) => d(api.delete(`${B}/projects/${pid}/avatar`)),
  uploadLogo: (wsId: number, file: File) => uploadBrand(`${B}/workspaces/${wsId}/logo/upload`, file),
  removeLogo: (wsId: number) => d(api.delete(`${B}/workspaces/${wsId}/logo`)),
};

// ─── CTW-11: cờ "Bị chặn" ────────────────────────────────────────

export const workFlagApi = {
  set: (pid: number, num: number, reason: string, raidNumber?: number | null) =>
    d<{ number: number; flaggedAt: string | null; flagReason: string | null }>(api.put(`${B}/projects/${pid}/issues/${num}/flag`, { reason, ...(raidNumber ? { raidNumber } : {}) })),
  clear: (pid: number, num: number) => d<{ number: number; flaggedAt: null }>(api.delete(`${B}/projects/${pid}/issues/${num}/flag`)),
};

// ─── CTW-24: phòng họp ───────────────────────────────────────────

/** Link Jitsi mới — khó đoán (16 ký tự từ crypto.getRandomValues). Backend cũng nhận `meetingUrl: "jitsi"`. */
export function newJitsiUrl(): string {
  const abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let id = '';
  for (const b of bytes) id += abc[b % abc.length];
  return `https://meet.jit.si/ctwork-${id}`;
}

export function meetingProviderLabel(url: string | null | undefined): string {
  if (!url) return 'meeting';
  try {
    const h = new URL(url).hostname.toLowerCase();
    if (h === 'meet.google.com') return 'Google Meet';
    if (h.endsWith('zoom.us')) return 'Zoom';
    if (h.endsWith('teams.microsoft.com') || h.endsWith('teams.live.com')) return 'Teams';
    if (h === 'meet.jit.si' || h.endsWith('.jitsi.net')) return 'Jitsi';
  } catch { /* link lạ */ }
  return 'meeting';
}

// ─── CTW-25: "Add to Google Calendar / Outlook" (deep link, không cần OAuth) ─

export interface CalendarEventInput {
  title: string;
  /** Có giờ: ISO; cả ngày: 'YYYY-MM-DD'. */
  start: string;
  end?: string | null;
  allDay?: boolean;
  details?: string | null;
  location?: string | null;
}

const gStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
const ymdCompact = (ymd: string) => ymd.slice(0, 10).replace(/-/g, '');
const nextDay = (ymd: string) => {
  const t = new Date(`${ymd.slice(0, 10)}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10);
};

/** https://calendar.google.com/calendar/render?action=TEMPLATE… — cả ngày: ngày kết thúc LOẠI TRỪ. */
export function googleCalendarUrl(e: CalendarEventInput): string {
  const dates = e.allDay
    ? `${ymdCompact(e.start)}/${ymdCompact(nextDay(e.end ?? e.start))}`
    : `${gStamp(e.start)}/${gStamp(e.end ?? new Date(new Date(e.start).getTime() + 30 * 60_000).toISOString())}`;
  const p = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates });
  if (e.details) p.set('details', e.details.slice(0, 1500));
  if (e.location) p.set('location', e.location);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** Outlook on the web (cá nhân + Microsoft 365 đều mở được qua outlook.live.com). */
export function outlookCalendarUrl(e: CalendarEventInput): string {
  const p = new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent', subject: e.title });
  if (e.allDay) {
    p.set('startdt', e.start.slice(0, 10));
    p.set('enddt', nextDay(e.end ?? e.start));
    p.set('allday', 'true');
  } else {
    p.set('startdt', new Date(e.start).toISOString());
    p.set('enddt', new Date(e.end ?? new Date(new Date(e.start).getTime() + 30 * 60_000).toISOString()).toISOString());
  }
  if (e.details) p.set('body', e.details.slice(0, 1500));
  if (e.location) p.set('location', e.location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}

// ─── CTW-4: nhập Markdown vào Docs ───────────────────────────────

export const workDocsImportApi = {
  /** Trang mới từ Markdown (tiêu đề = `# …` đầu tiên nếu không nhập). */
  create: (pid: number, body: { markdown: string; title?: string; parentNumber?: number | null; stageId?: number | null; visibility?: 'INTERNAL' | 'CLIENT' }) =>
    d<{ number: number; title: string }>(api.post(`${B}/projects/${pid}/pages`, body)),
  /** Thay nội dung trang bằng Markdown. */
  replace: (pid: number, num: number, markdown: string, version?: number) =>
    d<{ number: number; version: number }>(api.patch(`${B}/projects/${pid}/pages/${num}`, { markdown, ...(version !== undefined ? { version } : {}) })),
};
