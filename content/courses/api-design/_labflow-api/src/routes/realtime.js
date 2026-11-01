// routes/realtime.js — bài 10.4: CÙNG một dòng sự kiện lượt đặt, ba hợp đồng:
//   GET /v2/events?after=&wait=   polling (wait > 0 ⇒ long polling: giữ request tới khi có sự kiện, tối đa 25 s)
//   GET /v2/events/stream         Server-Sent Events: id/event/data, nối lại bằng Last-Event-ID
//   ws://…/v2/ws?ticket=          WebSocket (src/ws.js)
import { Router } from 'express';
import { z } from 'zod';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { since, subscribe, latestId, cmpId } from '../events.js';
import { issueTicket, redeemTicket } from '../tickets.js';
import { store } from '../store/index.js';
import { lifecycle } from '../lifecycle.js';

const HEARTBEAT_MS = Number(process.env.SSE_HEARTBEAT_MS ?? 15000);
const RETRY_MS = Number(process.env.SSE_RETRY_MS ?? 3000);
const NO_FLUSH = process.env.LABFLOW_SSE_NOFLUSH === '1';         // CHỈ để học: quên res.flush() sau compression
export const realtimeRouter = Router();

// Bearer như mọi route, HOẶC ?ticket= (trình duyệt: EventSource không đặt được header)
async function bearerOrTicket(req, res, next) {
  if (!req.query.ticket) return requireAuth(req, res, next);
  const userId = await redeemTicket(req.query.ticket);            // Chương 12: vé nằm trong Redis ⇒ đổi được ở instance nào cũng được
  if (!userId) throw new HttpError(401, 'TICKET_INVALID');
  req.user = await store.getUser(userId);
  next();
}

realtimeRouter.route('/realtime/tickets')
  .post(requireAuth, async (req, res) => res.status(201).set('Cache-Control', 'no-store').json(await issueTicket(req.user.id)))
  .all(onlyAllow('POST'));

const PollQuery = z.strictObject({
  after: z.string().regex(/^\d+(-\d+)?$/).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(100),
  wait: z.coerce.number().int().min(0).max(25).default(0),
});
realtimeRouter.route('/events')
  .get(requireAuth, validate('query', PollQuery), async (req, res) => {
    const { after, limit, wait } = req.valid.query;
    if (!after) return res.set('Cache-Control', 'no-store').json({ data: [], next: await latestId() });   // "bắt đầu từ bây giờ"
    let r = await since(after, limit);
    if (r.gap) throw new HttpError(410, 'EVENTS_EXPIRED', { after, latest: await latestId() });
    if (r.data.length === 0 && wait > 0) {                       // long polling: chờ sự kiện kế tiếp hoặc hết giờ
      await new Promise((ok) => {
        const t = setTimeout(done, wait * 1000);
        const off = subscribe(done);
        req.on('close', done);
        function done() { clearTimeout(t); off(); ok(); }
      });
      r = await since(after, limit);
    }
    res.set('Cache-Control', 'no-store').json({ data: r.data, next: r.data.at(-1)?.id ?? after });
  })
  .all(onlyAllow('GET', 'HEAD'));

realtimeRouter.route('/events/stream')
  .get(bearerOrTicket, async (req, res) => {
    res.status(200).set({ 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
    const write = (s) => { res.write(s); if (!NO_FLUSH) res.flush?.(); };   // compression() giữ chữ trong bộ đệm gzip ⇒ PHẢI đẩy ra
    const send = (e) => write(`id: ${e.id}\nevent: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`);
    write(`retry: ${RETRY_MS}\n\n`);                             // EventSource đợi bao lâu trước khi nối lại
    // Đăng ký nghe TRƯỚC, phát bù SAU — sự kiện tới giữa hai bước nằm trong `held`, không lọt
    let last = req.get('Last-Event-ID') ?? req.query.after ?? null, held = [], replaying = true;
    const off = subscribe((e) => (replaying ? held.push(e) : (!last || cmpId(e.id, last) > 0) && (send(e), last = e.id)));
    if (last) {
      for (;;) {
        const r = await since(last, 100);
        if (r.gap) { write(`event: reset\ndata: ${JSON.stringify({ latest: await latestId() })}\n\n`); break; }
        for (const e of r.data) { send(e); last = e.id; }
        if (r.data.length < 100) break;
      }
    }
    for (const e of held) if (!last || cmpId(e.id, last) > 0) { send(e); last = e.id; }
    replaying = false; held = null;
    const ping = setInterval(() => write(': ping\n\n'), HEARTBEAT_MS);   // giữ kết nối qua proxy hay cắt kết nối im lặng
    // Bài 12.7: instance đang tắt ⇒ đóng luồng; EventSource tự nối lại (vào instance khác) bằng Last-Event-ID, không mất sự kiện
    const bye = () => res.end();
    lifecycle.once('shutdown', bye);
    req.on('close', () => { clearInterval(ping); off(); lifecycle.off('shutdown', bye); });
  })
  .all(onlyAllow('GET'));
