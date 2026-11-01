// tickets.js — bài 10.4: vé nối realtime. EventSource và WebSocket của trình duyệt KHÔNG gửi được header Authorization,
// nên client đổi token lấy một vé ngắn hạn (30 s, dùng MỘT lần) rồi đặt vé vào URL. Vé lộ trong log cũng vô hại sau 30 s.
// Bài 12.4: vé trong RAM chỉ đổi được ở ĐÚNG instance đã phát nó. LABFLOW_TICKETS=redis ⇒ SET … EX 30, đổi bằng GETDEL (nguyên tử: dùng một lần).
import { randomBytes } from 'node:crypto';
import { config } from './config.js';
import { shared } from './redis.js';
import { HttpError } from './http.js';

const TTL_MS = 30_000;
const REDIS = config.ticketStore === 'redis';
const tickets = new Map();                                    // vé ⇒ { userId, exp }  (chỉ MỘT instance)
export async function issueTicket(userId) {
  const t = `tkt_${randomBytes(16).toString('base64url')}`;
  if (REDIS) {
    if (!shared?.isReady) { const e = new HttpError(503, 'DEPENDENCY_DOWN'); e.retryAfter = 5; throw e; }   // Redis hỏng ⇒ chưa phát vé được, nói rõ
    await shared.set(`labflow:tkt:${t}`, userId, { expiration: { type: 'PX', value: TTL_MS } });
  }
  else {
    tickets.set(t, { userId, exp: Date.now() + TTL_MS });
    setTimeout(() => tickets.delete(t), TTL_MS).unref();
  }
  return { ticket: t, expiresIn: TTL_MS / 1000 };
}
export async function redeemTicket(t) {
  if (!t) return null;
  if (REDIS) return shared?.isReady ? shared.getDel(`labflow:tkt:${t}`) : null;        // hai instance cùng đổi một vé ⇒ chỉ MỘT nhận được userId
  const v = tickets.get(t);
  if (!v) return null;
  tickets.delete(t);                                          // dùng một lần
  return v.exp > Date.now() ? v.userId : null;
}
