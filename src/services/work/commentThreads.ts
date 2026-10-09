/**
 * CT Work đợt 5b K-1 — luật THUẦN của bình luận đầy đủ (luồng trả lời, tệp trong bình luận, voice note).
 * Không đụng DB ⇒ test bằng bảng (commentThreads.test.ts). Phần chạm DB/R2/STT ở commentFiles.service.ts.
 */

/** Trần voice note: 3 phút, 8 MB (opus ~16 kB/s ⇒ 3 phút ≈ 3 MB; Safari ghi AAC/mp4 nặng hơn). */
export const VOICE_MAX_SECONDS = 180;
export const VOICE_MAX_BYTES = 8 * 1024 * 1024;
/** Dưới nửa giây gần như luôn là bấm nhầm. */
export const VOICE_MIN_MS = 500;
/** Tệp trong MỘT bình luận (kể cả voice note). */
export const MAX_FILES_PER_COMMENT = 10;
/** Tệp tải từ ô bình luận cho MỘT thẻ (tính cả bản nháp) — riêng với trần 50 tệp của khối Attachments. */
export const MAX_COMMENT_FILES_PER_ISSUE = 200;
/** Trần lượt phiên âm mỗi dự án mỗi ngày (hạn mức Groq ~2000 lượt/ngày/model dùng chung cả web). */
export const VOICE_STT_DAILY_DEFAULT = 200;

export const TRANSCRIPT_STATUSES = ['PENDING', 'DONE', 'NO_SPEECH', 'NO_KEY', 'LIMIT', 'FAILED'] as const;
export type TranscriptStatus = (typeof TRANSCRIPT_STATUSES)[number];

/** Kiểu audio nhận cho voice note (MediaRecorder: Chrome/Firefox webm|ogg opus, Safari mp4/AAC). */
const VOICE_MIME = /^audio\/(webm|ogg|mp4|x-m4a|m4a|aac|mpeg|wav|x-wav)(;.*)?$/i;

export function isVoiceMime(mime: string): boolean {
  return VOICE_MIME.test(mime.trim());
}

/** Bỏ tham số codecs (`audio/webm;codecs=opus` ⇒ `audio/webm`) — R2/ContentType gọn, trình phát vẫn đọc được. */
export function baseMime(mime: string): string {
  return mime.split(';')[0].trim().toLowerCase() || 'application/octet-stream';
}

/** Đuôi tệp cho voice note theo MIME (tên tệp đọc được khi tải về). */
export function voiceExt(mime: string): string {
  const m = baseMime(mime);
  if (m.includes('mp4') || m.includes('m4a') || m.includes('aac')) return 'm4a';
  if (m.includes('ogg')) return 'ogg';
  if (m.includes('mpeg')) return 'mp3';
  if (m.includes('wav')) return 'wav';
  return 'webm';
}

export type VoiceCheck = { ok: true; durationMs: number } | { ok: false; code: string; message: string };

/**
 * Kiểm voice note TRƯỚC khi ghi R2. Độ dài do trình duyệt đo (đồng hồ của useGhiAm) — server không giải mã audio,
 * nên chặn thêm bằng dung lượng: không có cách nào nhét quá 8 MB, và 3 phút + 5 giây dung sai (đồng hồ chạy theo giây).
 */
export function checkVoice(input: { size: number; mime: string; durationMs: number }): VoiceCheck {
  if (!isVoiceMime(input.mime)) return { ok: false, code: 'WORK_VOICE_TYPE', message: 'Voice notes must be audio (webm, ogg, m4a, mp3 or wav)' };
  if (!Number.isFinite(input.size) || input.size <= 0) return { ok: false, code: 'WORK_VOICE_EMPTY', message: 'The recording is empty' };
  if (input.size > VOICE_MAX_BYTES) return { ok: false, code: 'WORK_FILE_TOO_LARGE', message: `Voice notes must be ${VOICE_MAX_BYTES / 1024 / 1024} MB or smaller` };
  const d = Math.round(Number(input.durationMs));
  if (!Number.isFinite(d) || d < VOICE_MIN_MS) return { ok: false, code: 'WORK_VOICE_TOO_SHORT', message: 'The recording is too short' };
  if (d > (VOICE_MAX_SECONDS + 5) * 1000) return { ok: false, code: 'WORK_VOICE_TOO_LONG', message: `Voice notes can be at most ${VOICE_MAX_SECONDS / 60} minutes` };
  return { ok: true, durationMs: Math.min(d, VOICE_MAX_SECONDS * 1000) };
}

/**
 * Bình luận cha thật sự của một trả lời — luồng MỘT cấp (như Jira/GitHub): trả lời vào một trả lời ⇒ gắn vào gốc
 * của nó. Trả về null khi cha không hợp lệ (khác thẻ/đã xoá) để service ném 400.
 */
export function threadRootOf(
  parent: { id: number; issueId: number; parentId: number | null; deletedAt: Date | null } | null,
  issueId: number,
): number | null {
  if (!parent || parent.issueId !== issueId || parent.deletedAt) return null;
  return parent.parentId ?? parent.id;
}

/** Nhãn ngắn của voice note trong văn bản tìm kiếm / bản tin / AI. */
export const VOICE_LABEL = '[Voice note]';

/**
 * Văn bản tìm kiếm của bình luận = chữ người gõ + mỗi bản phiên âm một dòng. Ghi vào WorkComment.bodyText (cột mà
 * thông báo, chat hook, Ask AI và JQL `comment ~` đều đọc). Thân trống mà có tệp ⇒ tên tệp, để bản tin không rỗng.
 */
export function commentSearchText(
  typed: string,
  extras: { transcripts?: Array<string | null | undefined>; fileNames?: string[]; voiceCount?: number } = {},
): string {
  const parts: string[] = [];
  const t = typed.trim();
  if (t) parts.push(t);
  const tr = (extras.transcripts ?? []).map((x) => (x ?? '').trim()).filter(Boolean);
  for (const x of tr) parts.push(`${VOICE_LABEL} ${x}`);
  const untranscribed = Math.max(0, (extras.voiceCount ?? 0) - tr.length);
  if (!t && !tr.length && untranscribed) parts.push(VOICE_LABEL);
  if (!t && !tr.length && !untranscribed && extras.fileNames?.length) parts.push(`[Files] ${extras.fileNames.join(', ')}`);
  return parts.join('\n').slice(0, 40_000);
}

/** Một bình luận phẳng ⇒ cây một cấp. Trả lời mồ côi (gốc đã xoá/ẩn) đứng như gốc, kèm cờ để UI ghi "reply to a deleted comment". */
export function buildThreads<T extends { id: number; parentId: number | null }>(rows: T[]): Array<T & { replies: Array<T>; orphan: boolean }> {
  const roots = new Map<number, T & { replies: T[]; orphan: boolean }>();
  const out: Array<T & { replies: T[]; orphan: boolean }> = [];
  for (const r of rows) {
    if (r.parentId === null) {
      const node = { ...r, replies: [] as T[], orphan: false };
      roots.set(r.id, node);
      out.push(node);
    }
  }
  for (const r of rows) {
    if (r.parentId === null) continue;
    const root = roots.get(r.parentId);
    if (root) root.replies.push(r);
    else out.push({ ...r, replies: [], orphan: true });
  }
  return out;
}

/** Trạng thái phiên âm ⇒ câu cho người đọc (UI + get_issue cho model). */
export function transcriptNote(status: string): string {
  switch (status) {
    case 'PENDING': return 'Transcribing…';
    case 'NO_SPEECH': return 'No speech detected';
    case 'NO_KEY': return 'Transcription is not available on this server (speech-to-text is not configured) — the audio is saved';
    case 'LIMIT': return 'Transcription skipped: the project reached today’s limit';
    case 'FAILED': return 'Transcription failed';
    default: return '';
  }
}

/** Ngày (giờ VN) để đếm trần phiên âm mỗi ngày. */
export function vnDayStart(now = new Date()): Date {
  const vn = new Date(now.getTime() + 7 * 3600_000);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - 7 * 3600_000);
}

/** Hiện diện (K16): trạng thái hợp lệ trên socket. */
export const PRESENCE_STATES = ['viewing', 'typing', 'editing', 'left'] as const;
export type PresenceState = (typeof PRESENCE_STATES)[number];
export function parsePresence(raw: unknown): { projectId: number; number: number; state: PresenceState } | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const projectId = Number(r.projectId);
  const number = Number(r.number);
  const state = r.state as PresenceState;
  if (!Number.isInteger(projectId) || projectId <= 0 || !Number.isInteger(number) || number <= 0) return null;
  if (!(PRESENCE_STATES as readonly string[]).includes(state)) return null;
  return { projectId, number, state };
}
