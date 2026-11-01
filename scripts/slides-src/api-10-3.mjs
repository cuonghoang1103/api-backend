/**
 * api-10-3 — API Design · Chapter 10 · Lesson 10.3 "Event contracts" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-2-su-kien. Output = chạy thật Redis Streams + PostgreSQL 18 (events/*.mjs, asyncapi/validate.mjs).
 */
import { lamDeck, sql, http, two, box } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: '10.3' };

export const deck = { key: 'api-10-3', code: 'API 10.3', title: 'Event contracts', sub: 'Payload design, versioning, idempotent consumers' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Event contracts', sub: '“This happened” — read by teams<br>you will never meet.' },

  { t: 'One event, and its contract on paper', giua: true, body: sql(`const emit = (type, b) => publish(\`labflow.booking.\${type}.v1\`, b.id, bookingEvent(b))
  .catch((e) => console.error('publish', e.message));   // ⚠ dual write — see slide 5`, { lang: 'javascript', sm: true }) + http(`$ curl -s '…/v2/events?after=1&limit=1' | jq -c '.data[0]'
{"id":"2","specversion":"1.0","type":"labflow.booking.cancelled.v1","source":"/labflow/v2","subject":"bk_1","time":"2026-11-01T01:53:02.699Z","datacontenttype":"application/json","data":{"id":"bk_1","labId":"lab_2","period":{…},"status":"CANCELLED","version":2}}`, { sm: true, wrap: 'any', title: 'a CloudEvents 1.0 envelope' }) + two(box('Rules of the envelope', '<b>source + id</b> unique per event — a re-sent duplicate keeps its id.<br>The version lives in <b>type</b> (.v1).<br><b>data</b> = state when it happened (version 2 after the cancel), no PII.', 'lam'), http(`$ node asyncapi/validate.mjs
⇒ hợp lệ: AsyncAPI 3.1.0, 1 kênh, 5 thông điệp: labflow.booking.created.v1, …
$ node asyncapi/validate.mjs asyncapi/broken-ref.yaml
error   invalid-ref: '#/components/messages/BookingCheckIn' does not exist @ …
⇒ KHÔNG hợp lệ`, { sm: true, wrap: 'any', title: 'AsyncAPI = OpenAPI for one-way messages' })) },

  { t: 'Thin or fat, and changing an event', body: http(`$ node events/thin-vs-fat.mjs
300 sự kiện: 200 created, 100 cancelled
kích thước: mỏng 60966 B (203 B/sự kiện) · dày 98966 B (330 B/sự kiện)
mỏng: 200 lần gọi lại API trong 94 ms · 100 email "đã đặt" đọc phải trạng thái CANCELLED
dày:  0 lần gọi lại API trong 0.0 ms · 0 sai — mỗi sự kiện nói đúng điều đã xảy ra lúc đó`, { sm: true, wrap: 'any' }) + http(`$ node events/versions.mjs
v1 + trường mới purposeCategory    labflow.booking.created.v1  strict: LỖI unrecognized_keys purposeCategory · tolerant: OK
phát song song khi chuyển: 139 B (v1) + 132 B (v2) mỗi lượt đặt`, { sm: true, wrap: 'any' }) + two(box('Thin = “ask me now”', '39% smaller, but 200 call-backs — and 100 “created” emails read today’s state: CANCELLED.', 'do2'), box('Versioning rules', 'Readers are tolerant. Adding a field keeps the type; renaming or removing ⇒ .v2, published in parallel.', 'xanh')) },

  { t: 'At least once: the duplicate you must expect', giua: true, body: http(`$ MODE=none CRASH=0.02 node events/redelivery.mjs
⇒ đã gửi 1017 thông báo cho 1000 sự kiện khác nhau · trùng 17 · MẤT 0 · còn pending 0
$ MODE=mark-first CRASH=0.02 node events/redelivery.mjs
⇒ đã gửi 979 thông báo cho 979 sự kiện khác nhau · trùng 0 · MẤT 21 · còn pending 0
$ MODE=same-tx CRASH=0.02 node events/redelivery.mjs
⇒ đã gửi 1000 thông báo cho 1000 sự kiện khác nhau · trùng 0 · MẤT 0 · còn pending 0`, { sm: true, wrap: 'any', title: 'consumer dies with 2% probability at every dangerous moment' }) + `<table class="t"><tr><th>Mode</th><th>Order</th><th>A crash in between ⇒</th></tr>
<tr><td>none</td><td>send → ack</td><td>sent again: <b>17 duplicates</b></td></tr>
<tr><td>mark-first</td><td>mark → send → ack</td><td>never sent: <b class="do">21 lost</b></td></tr>
<tr><td>same-tx</td><td>BEGIN mark + send COMMIT → ack</td><td>both or neither: <b class="xanh">1,000 exactly</b></td></tr></table>` + two(sql(`await c.query('BEGIN');
const { rowCount } = await c.query('INSERT INTO processed_events
  VALUES ($1, $2) ON CONFLICT DO NOTHING', [GROUP, e.id]);
if (rowCount === 1) await send(c);   // effect, same tx
await c.query('COMMIT');
// … then XACK`, { lang: 'javascript', sm: true, hl: [2, 4] }), box('✗ “Mark first, then work”', 'Turns 17 duplicates into 21 silent losses. Record the id <b>in the same transaction</b> as the effect: an exactly-once effect from an at-least-once channel.', 'do2')) },

  { t: 'The producer side: events that never left', giua: true, body: http(`$ MODE=dual node events/outbox.mjs           # Redis cut off for 1.5 s
⇒ stream có 658 sự kiện cho 658 lượt đặt khác nhau · MẤT 342 · trùng 0 · XADD hỏng 342 lần
$ MODE=outbox node events/outbox.mjs
⇒ stream có 1000 sự kiện cho 1000 lượt đặt khác nhau · MẤT 0 · trùng 0
⇒ độ trễ từ COMMIT tới khi lên stream: p50 118 ms · p99 1633 ms · max 1745 ms
$ MODE=outbox RELAY_CRASH=1 node events/outbox.mjs
⇒ stream có 1018 sự kiện cho 1000 lượt đặt khác nhau · MẤT 0 · trùng 18`, { sm: true, wrap: 'any' }) + sql(`await c.query('BEGIN');                       // relay, every 100 ms
const { rows } = await c.query('SELECT id, type, payload FROM outbox
  WHERE published_at IS NULL ORDER BY id LIMIT 100 FOR UPDATE SKIP LOCKED');
for (const r of rows) await redis.xAdd(STREAM, '*',
  { e: JSON.stringify({ id: \`evt_\${r.id}\`, type: r.type, data: r.payload }) });
await c.query('UPDATE outbox SET published_at = clock_timestamp() …');
await c.query('COMMIT');   // Redis down ⇒ ROLLBACK ⇒ published next time`, { lang: 'javascript', sm: true, hl: [5] }) + two(box('Dual write', 'Save the booking, then publish: publishing fails ⇒ the booking exists, its event does not. <b>342 lost.</b>', 'do2'), box('Transactional outbox', 'Event row in the same transaction; a relay publishes it. Price: lag (p50 118 ms), duplicates with the same id (evt_42).', 'xanh')) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>CloudEvents envelope; source + id unique; version in type; data = state at event time</li>
<li>Thin <b>203 B</b> but 200 call-backs + 100 stale reads; fat <b>330 B</b>, 0 call-backs</li>
<li>An added field broke a strict reader; breaking changes get a new type, in parallel</li>
<li>Crashes over 1,000 events: <b>17</b> duplicates · mark-first <b>21 lost</b> · same tx exactly 1,000</li>
<li>Redis down 1.5 s: dual write lost <b>342</b>, outbox <b>0</b></li>
</ul>
${box('Next', 'Lesson 10.4 — pushing events to screens: polling, SSE or WebSocket.', 'xanh')}` },
]);
