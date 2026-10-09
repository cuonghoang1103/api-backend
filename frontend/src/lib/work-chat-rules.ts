/**
 * CT Work K-3 — luật THUẦN phía client của kênh chat (không React, không mạng) ⇒ test bằng bảng:
 *   npx tsx --test frontend/src/lib/work-chat-rules.test.ts
 *
 * Máy chủ đã quyết tin có "đáng báo" không (`alert` — tắt tiếng kênh/toàn bộ, chế độ chỉ khi @nhắc, giờ im lặng).
 * Ở đây chỉ còn NGỮ CẢNH TẠI CHỖ: đang mở đúng kênh? cửa sổ có focus? người dùng bật âm / thông báo hệ thống chưa?
 */

export interface LocalCtx {
  /** Kênh đang mở trên màn hình (null = không ở trang chat). */
  viewingChannelId: number | null;
  /** Cửa sổ / tab đang được focus và hiện. */
  focused: boolean;
  /** Notification.permission === 'granted' (web) hoặc app desktop. */
  osAllowed: boolean;
}

export interface AlertFlags { alert: boolean; sound: boolean; desktop: boolean; counts?: boolean }

/**
 * Báo gì cho một tin đến:
 *   - toast trong ứng dụng: khi KHÔNG đang xem đúng kênh đó (cửa sổ đang mở) — đang xem thì tin hiện ngay trong khung;
 *   - âm: trừ khi đang xem đúng kênh VÀ cửa sổ đang focus (người đó đang nhìn thấy tin rồi);
 *   - thông báo hệ thống: chỉ khi cửa sổ KHÔNG focus (ở nền / tab khác) và đã được cho phép.
 * Không có `alert` (tin của mình, tắt tiếng, chỉ khi @nhắc, giờ im lặng) ⇒ không gì cả (badge vẫn đếm).
 */
export function localAlert(n: AlertFlags, ctx: LocalCtx, channelId: number): { toast: boolean; sound: boolean; os: boolean } {
  if (!n.alert) return { toast: false, sound: false, os: false };
  const watching = ctx.viewingChannelId === channelId && ctx.focused;
  return {
    toast: ctx.focused && ctx.viewingChannelId !== channelId,
    sound: n.sound && !watching,
    os: n.desktop && ctx.osAllowed && !ctx.focused,
  };
}

/** "(3) CT Work" — gỡ số cũ trước khi gắn số mới; 0 ⇒ tiêu đề trơn; > 99 ⇒ "99+". */
export function titleWithBadge(title: string, count: number): string {
  const bare = title.replace(/^\(\d+\+?\)\s+/, '');
  if (!count || count < 0) return bare;
  return `(${count > 99 ? '99+' : count}) ${bare}`;
}

/** Nhãn tắt tiếng cho menu / tooltip. */
export function muteLabel(until: string | null | undefined, forever: boolean, now = new Date()): string | null {
  if (!until) return null;
  const d = new Date(until);
  if (Number.isNaN(d.getTime()) || d.getTime() <= now.getTime()) return null;
  if (forever || d.getUTCFullYear() >= 2999) return 'Muted until you turn it back on';
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `Muted until ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return `Muted until tomorrow ${time}`;
  return `Muted until ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${time}`;
}

/** Ô gõ: đang gõ "@abc" ngay trước con trỏ? ⇒ vị trí "@" + chữ đã gõ (để gợi ý người). */
export function mentionQuery(text: string, caret: number): { start: number; query: string } | null {
  const before = text.slice(0, caret);
  const m = /(^|[\s(])@([A-Za-z0-9_.-]{0,40})$/.exec(before);
  if (!m) return null;
  return { start: caret - m[2].length - 1, query: m[2] };
}

/** Thay "@que" đang gõ bằng "@username " — trả chữ mới + vị trí con trỏ. */
export function applyMention(text: string, at: { start: number; query: string }, username: string): { text: string; caret: number } {
  const insert = `@${username} `;
  const end = at.start + 1 + at.query.length;
  return { text: text.slice(0, at.start) + insert + text.slice(end), caret: at.start + insert.length };
}

/** Tách chữ thành đoạn thường + đoạn @tên (tô màu khi tên thuộc người trong kênh). */
export function splitMentions(text: string, known: Set<string>): Array<{ t: 'text' | 'mention'; v: string }> {
  const out: Array<{ t: 'text' | 'mention'; v: string }> = [];
  const re = /(^|[^\w@./-])@([A-Za-z0-9_][A-Za-z0-9_.-]{0,39})/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const name = m[2].replace(/[.-]+$/, '');
    if (!known.has(name.toLowerCase())) continue;
    const at = m.index + m[1].length;
    if (at > last) out.push({ t: 'text', v: text.slice(last, at) });
    out.push({ t: 'mention', v: `@${name}` });
    last = at + 1 + name.length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}

/** Tin gộp với tin trên (cùng người, cách < 5 phút, cùng ngày, không phải tin hệ thống) ⇒ ẩn avatar + tên. */
export function isContinuation(prev: { authorId: number | null; createdAt: string; kind: string } | null, cur: { authorId: number | null; createdAt: string; kind: string }): boolean {
  if (!prev || prev.kind !== 'USER' || cur.kind !== 'USER' || prev.authorId === null || prev.authorId !== cur.authorId) return false;
  const a = new Date(prev.createdAt);
  const b = new Date(cur.createdAt);
  return a.toDateString() === b.toDateString() && b.getTime() - a.getTime() < 5 * 60_000;
}

/** Tin đầu tiên chưa đọc (của người khác, sau mốc đọc lúc MỞ kênh) — chỗ đặt vạch "New messages". */
export function firstUnreadId(messages: Array<{ id: number; authorId: number | null }>, lastReadId: number, meId: number | undefined): number | null {
  const m = messages.find((x) => x.id > lastReadId && x.authorId !== meId);
  return m ? m.id : null;
}

/** Khoá chống gửi trùng cho hàng chờ ngoại tuyến (server: cùng tác giả + cùng khoá ⇒ cùng tin). */
export function newClientKey(): string {
  const rnd = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `c-${rnd}`.replace(/[^\w-]/g, '').slice(0, 64);
}

/** Đoạn dài dòng trạng thái "đang gõ": 1 người / 2 người / nhiều người. */
export function typingLine(names: string[]): string | null {
  if (!names.length) return null;
  if (names.length === 1) return `${names[0]} is typing…`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing…`;
  return `${names[0]} and ${names.length - 1} others are typing…`;
}
