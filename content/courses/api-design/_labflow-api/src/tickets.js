// tickets.js — bài 10.4: vé nối realtime. EventSource và WebSocket của trình duyệt KHÔNG gửi được header Authorization,
// nên client đổi token lấy một vé ngắn hạn (30 s, dùng MỘT lần) rồi đặt vé vào URL. Vé lộ trong log cũng vô hại sau 30 s.
import { randomBytes } from 'node:crypto';

const TTL_MS = 30_000;
const tickets = new Map();                                    // vé ⇒ { userId, exp }  (một instance; nhiều instance ⇒ để trong Redis)
export function issueTicket(userId) {
  const t = `tkt_${randomBytes(16).toString('base64url')}`;
  tickets.set(t, { userId, exp: Date.now() + TTL_MS });
  setTimeout(() => tickets.delete(t), TTL_MS).unref();
  return { ticket: t, expiresIn: TTL_MS / 1000 };
}
export function redeemTicket(t) {
  const v = t && tickets.get(t);
  if (!v) return null;
  tickets.delete(t);                                          // dùng một lần
  return v.exp > Date.now() ? v.userId : null;
}
