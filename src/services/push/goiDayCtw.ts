/**
 * Gói đẩy APNs cho thông báo CT Work (18/10/2026) — phần THUẦN (không DB), test ở `goiDayCtw.test.ts`.
 *
 * App iOS CT Work (`Modules/Inbox/HanhDongThongBaoCTW.swift`) đăng ký sẵn các category và đọc các khoá ở
 * CẤP NGOÀI CÙNG của gói (cạnh `thongBaoId`, `duongDan`):
 *   CTW_REPLY    — WORK_COMMENT / WORK_MENTION có `url` (thẻ hoặc chat) ⇒ nút Reply + Mark as read
 *   CTW_APPROVAL — WORK_ALERT có `approvalId` mà người nhận ĐANG phải duyệt ⇒ Approve / Reject (+ `approvalId`)
 *   CTW_MEETING  — nhắc họp có `meetingUrl` ⇒ nút Join (app thêm sau; category lạ thì iOS chỉ hiện không nút)
 *   CTW_DEFAULT  — còn lại ⇒ Mark as read
 * `thread-id`: `ctw-<issueKey>` cho thẻ, `ctw-<projectKey>-chat-<cid>` cho kênh chat ⇒ iOS xếp chồng theo thẻ/kênh.
 */

export const CTW_CATEGORY = {
  reply: 'CTW_REPLY',
  approval: 'CTW_APPROVAL',
  meeting: 'CTW_MEETING',
  thuong: 'CTW_DEFAULT',
} as const;

/** Khoá bật/tắt đẩy theo loại (GET|PUT /work/me/notify-settings → `push`). Mặc định bật hết. */
/** `git` (18/10/2026, trang Code): thông báo hoạt động Git (push, PR mở/merge, yêu cầu review) — tắt ⇒ không chuông/đẩy/email. */
export const PUSH_KEYS = ['assign', 'comment', 'mention', 'alert', 'approval', 'chatAll', 'git'] as const;
export type PushKey = (typeof PUSH_KEYS)[number];
export type PushPrefs = Record<PushKey, boolean>;

export function pushPrefsFrom(raw: unknown): PushPrefs {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const out = {} as PushPrefs;
  for (const k of PUSH_KEYS) out[k] = o[k] !== false;
  return out;
}

/** Loại thông báo ⇒ khoá cài đặt đẩy. `null` = không có công tắc (lời mời luôn đẩy). */
export function pushKeyFor(type: string, payload: unknown): PushKey | null {
  const p = (payload ?? {}) as Record<string, unknown>;
  switch (type) {
    case 'WORK_ASSIGN': return 'assign';
    case 'WORK_COMMENT': return 'comment';
    case 'WORK_MENTION': return 'mention';
    case 'WORK_ALERT': return typeof p.approvalId === 'number' ? 'approval' : p.git === true ? 'git' : 'alert';
    default: return null;
  }
}

/** `/work/<ws>/<KEY>/chat?c=12&m=…` ⇒ { projectKey: 'KEY', channelId: 12 } */
export function chatTuDuongDan(url: string): { projectKey: string; channelId: number } | null {
  const m = /^\/work\/[^/]+\/([^/?#]+)\/chat\?(.*)$/.exec(url);
  if (!m) return null;
  const c = /(?:^|&)c=(\d+)/.exec(m[2]);
  if (!c) return null;
  return { projectKey: m[1], channelId: Number(c[1]) };
}

export interface GoiDayCtw {
  category: string;
  threadId: string;
  /** Khoá thêm vào cấp ngoài cùng của gói (`approvalId`, `meetingUrl`). */
  them: Record<string, unknown>;
  /** Tệp âm `aps.sound` cho app CT Work (xem `amThanhCtw`). */
  amThanh: string;
}

/**
 * Tính category + thread-id + khoá thêm cho một thông báo WORK_*.
 * `dangChoDuyet` = người nhận còn một bước PENDING tới lượt ở phê duyệt `payload.approvalId` (bên gọi tra DB).
 */
export function goiDayCtw(type: string, payload: unknown, opts: { dangChoDuyet?: boolean } = {}): GoiDayCtw {
  const p = (payload ?? {}) as Record<string, unknown>;
  const url = typeof p.url === 'string' ? p.url : null;
  const chat = url ? chatTuDuongDan(url) : null;
  const issueKey = typeof p.issueKey === 'string' && p.issueKey.trim() ? p.issueKey.trim() : null;

  const threadId = chat
    ? `ctw-${chat.projectKey}-chat-${chat.channelId}`
    : issueKey && !issueKey.startsWith('#')
      ? `ctw-${issueKey.replace(/\s+/g, '')}`
      : `ctw-${type}`;

  const them: Record<string, unknown> = {};
  let category: string = CTW_CATEGORY.thuong;
  if ((type === 'WORK_COMMENT' || type === 'WORK_MENTION') && url) {
    category = CTW_CATEGORY.reply;
  } else if (type === 'WORK_ALERT' && typeof p.approvalId === 'number') {
    them.approvalId = p.approvalId;
    if (opts.dangChoDuyet) category = CTW_CATEGORY.approval;
  } else if (type === 'WORK_ALERT' && typeof p.meetingUrl === 'string' && p.meetingUrl) {
    them.meetingUrl = p.meetingUrl;
    category = CTW_CATEGORY.meeting;
  }
  return { category, threadId: threadId.slice(0, 64), them, amThanh: amThanhCtw(type, payload) };
}

// ─── Âm thanh + kênh cho tin nhắn riêng (21/10/2026) ─────────────────────────────

/**
 * Tên tệp âm thanh thông báo của app CT Work (`aps.sound`). App gói tệp này ở `CTWorkApp/Resources/Sounds/`
 * (.caf/.aiff/.wav, ≤ 30 s). iOS KHÔNG tìm thấy tệp ⇒ tự phát âm mặc định, nên gửi tên này trước khi tệp có
 * trong bản phát hành là an toàn. Đổi âm ⇒ đổi tệp trong app (giữ tên), hoặc đổi MỘT hằng này.
 */
export const AM_THANH_CTWORK = 'ctwork.caf';

/**
 * Bộ âm thương hiệu CT Work theo LOẠI thông báo (21/10/2026 — chủ app làm bằng ElevenLabs, cùng một họ âm: chuông
 * thuỷ tinh + marimba, tông C trưởng). Tệp nằm ở `CTWorkApp/Resources/Sounds/<tên>` của app iOS; bản app cũ chưa
 * có tệp ⇒ iOS tự phát âm mặc định, nên đổi tên ở đây không làm hỏng ai. Thêm âm ⇒ thêm tệp vào app + một dòng ở đây.
 */
export const AM_THANH = {
  macDinh: AM_THANH_CTWORK,
  tinNhan: 'tin-nhan.caf',
  giaoThe: 'giao-the.caf',
  nhacTen: 'nhac-ten.caf',
  hanChot: 'han-chot.caf',
  xong: 'xong.caf',
  cuongMini: 'cuongmini.caf',
} as const;

const RE_HAN = /\b(due|overdue|deadline|remind|reminder|starts? (in|soon)|sla)\b|hạn|quá hạn|nhắc|sắp tới|sắp bắt đầu/i;
const RE_XONG = /\b(done|completed?|approved|merged|passed|resolved|closed)\b|hoàn thành|đã duyệt|đã xong|đã gộp|đạt\b/i;
const RE_AI = /cuongmini|\bai (assistant|answer|draft)\b|trợ lý ai/i;

/** Âm cho MỘT thông báo WORK_* (gửi tới app CT Work). Đoán theo loại + chữ của `payload.message` cho WORK_ALERT. */
export function amThanhCtw(type: string, payload: unknown): string {
  const p = (payload ?? {}) as Record<string, unknown>;
  const url = typeof p.url === 'string' ? p.url : '';
  switch (type) {
    case 'WORK_ASSIGN': return AM_THANH.giaoThe;
    case 'WORK_MENTION': return AM_THANH.nhacTen;
    case 'WORK_COMMENT': return AM_THANH.tinNhan;
    case 'WORK_ALERT': {
      if (typeof p.approvalId === 'number') return AM_THANH.macDinh;
      if (chatTuDuongDan(url)) return AM_THANH.tinNhan;
      const chu = `${typeof p.message === 'string' ? p.message : ''} ${typeof p.title === 'string' ? p.title : ''}`;
      if (RE_AI.test(chu)) return AM_THANH.cuongMini;
      if ((typeof p.meetingUrl === 'string' && p.meetingUrl) || RE_HAN.test(chu)) return AM_THANH.hanChot;
      if (RE_XONG.test(chu)) return AM_THANH.xong;
      return AM_THANH.macDinh;
    }
    default: return AM_THANH.macDinh;
  }
}

/** `aps.sound` theo `apns-topic`: app CT Work ⇒ âm riêng (âm theo loại nếu bên gọi đưa), app chính ⇒ `default` như cũ. */
export function amThanhChoTopic(topic: string, amThanh?: string): string {
  return topic === 'com.cuongthai.ctwork' ? (amThanh ?? AM_THANH_CTWORK) : 'default';
}

/**
 * Kênh đẩy cho MỘT tin nhắn riêng (Messenger của web, dùng chung app chính + app CT Work):
 * người gửi và người nhận cùng ít nhất một không gian CT Work ⇒ `ctwork` (tới app CT Work nếu người nhận đã cài,
 * chưa cài thì về app chính — `guiThongBao` không bắn cả hai); còn lại ⇒ `chinh` như trước.
 */
export function kenhDayTinNhan(chungKhongGian: boolean): 'ctwork' | 'chinh' {
  return chungKhongGian ? 'ctwork' : 'chinh';
}
