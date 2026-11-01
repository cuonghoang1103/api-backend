/**
 * api-11-5 — API Design · Chapter 11 · Lesson 11.5 "Interview: a chat" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-3-chat. Output = chạy thật interview/chat/server.mjs + send.mjs.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: '11.5' };

export const deck = { key: 'api-11-5', code: 'API 11.5', title: 'A chat', sub: 'Duplicates, order and many devices' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Interview: a chat', sub: 'A phone that sends twice,<br>and a clock that is two minutes slow.' },

  { t: 'Send over HTTP, receive over a socket', giua: true, body: sql(`POST /v1/conversations/{cid}/messages   {clientMessageId, text}   201 {id, seq, …} · 200 replay · 403 · 422 · 429
GET  /v1/conversations/{cid}/messages?after={seq}&limit=50         200 {data, page.next}   (sync, history)
GET  /v1/conversations?cursor=…          each with lastSeq, unread  200
PUT  /v1/conversations/{cid}/read-cursor {seq}                     204 (only moves forward)
GET  /v2/ws?ticket=…                     push: {type:"message", cid, seq} · {type:"read", …}`, { lang: 'plaintext', sm: true }) + two(box('Must never happen', 'A message twice · a different order on two devices · a message lost after it showed “sent”.', 'do2'), box('Why this split', 'POST keeps status codes, limits, authorization and safe retries. Push needs a socket: 10.4 measured ~1 ms vs 1.1 s for polling, browsers connect with a one-time ticket.', 'lam')) },

  { t: 'Measured: the phone that sends twice', body: sql(`const old = c.byClientId.get(clientMessageId);
if (old) return res.status(200).set('Idempotent-Replayed', 'true').json(old);
const m = { id: …, seq: ++c.seq, clientMessageId, text, sentAt, … };
c.messages.push(m); c.byClientId.set(clientMessageId, m);
if (DROP_EVERY && ++n % DROP_EVERY === 0) return req.socket.destroy();   // stored, no answer`, { lang: 'javascript', sm: true, hl: [1, 2] }) + two(http(`$ node interview/chat/send.mjs http://localhost:4123     # DEDUPE=0
gửi 200 tin, 266 lần gọi (66 lần không nhận được trả lời ⇒ gửi lại)
server lưu 266 tin, 200 nội dung khác nhau ⇒ 66 tin trùng`, { sm: true, wrap: true, title: 'DROP_EVERY=4 · no deduplication' }), http(`$ node interview/chat/send.mjs http://localhost:4124     # DEDUPE=1
gửi 200 tin, 250 lần gọi (50 lần không nhận được trả lời ⇒ gửi lại)
server lưu 200 tin, 200 nội dung khác nhau ⇒ 0 tin trùng`, { sm: true, wrap: true, title: 'DROP_EVERY=4 · clientMessageId' })) + box('Idempotency-Key, in the body', 'The same rule as 5.1 — moved into the message so it also works over a socket, where there are no headers.', 'xanh') },

  { t: 'Whose clock decides the order?', body: http(`$ node interview/chat/send.mjs http://localhost:4124     # phone clock −2 min, laptop correct
…
sắp theo seq của server:        tin 1, 2, 3, 4, 5, 6, 7, 8, …  ⇒ 0/200 tin sai chỗ
sắp theo sentAt của máy client: tin 2, 4, 6, 8, 10, 12, 14, 16, …  ⇒ 200/200 tin sai chỗ`, { sm: true, wrap: true }) + vsd('<p>Sort by the client’s <code class="i">sentAt</code>: every phone message jumps ahead — each reply appears before its question.</p>', '<p>The server assigns <code class="i">seq</code> per conversation in the inserting transaction; client time is only shown (“sent 09:41”).</p>', '✗ client clock', '✓ server seq') + box('Trap: seq = count + 1 outside a transaction', 'Two messages read the same count. Use <code class="i">UPDATE conversations SET last_seq = last_seq + 1 … RETURNING</code> + <code class="i">UNIQUE (conversation_id, seq)</code> + <code class="i">UNIQUE (conversation_id, client_message_id)</code>.', 'do2') },

  { t: 'Many devices, “seen”, groups', giua: true, body: cards([
    ['Sync', 'Each device keeps its last seq; on reconnect <code class="i">?after=seq</code> page by page. A pushed seq ≠ last + 1 ⇒ fetch the gap.'],
    ['“Seen”', 'A per-user read cursor that only moves forward; pushed to the user’s other devices so the badge clears everywhere.'],
    ['Group of 500', 'Push only to connected devices via the instance holding the socket (Redis Stream fan-out, 10/10 in 10.4); one row per message.'],
    ['Edit / delete', 'Same seq, a new event with a version — keep the higher one (10.6); delete = tombstone.'],
    ['Typing', 'Ephemeral: socket only, never stored, throttled, may be lost.'],
    ['Exactly once?', 'Not over a network: at-least-once delivery + idempotent receivers = exactly-once <i>effect</i>.'],
  ]) },

  { t: 'Summary', giua: true, body: `<table class="t lon"><tr><th>Topic</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Duplicates</td><td>“TCP is reliable”</td><td>clientMessageId + replay: 66/200 ⇒ 0</td></tr>
<tr><td>Order</td><td>“sort by timestamp”</td><td>server seq per conversation; client time put 200/200 out of place</td></tr>
<tr><td>Transport</td><td>“everything over WebSocket”</td><td>send over HTTP (or with acks), receive by WebSocket/SSE with tickets</td></tr>
<tr><td>Sync</td><td>“load the last 50”</td><td><code class="i">?after=seq</code>, gap detection, read cursor only forward</td></tr></table>` + box('Next', '11.6 — booking: LabFlow is the answer, and fifty students press “Book” at once.', 'lam') },
]);
