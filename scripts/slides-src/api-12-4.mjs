/**
 * api-12-4 — API Design · Chapter 12 · Lesson 12.4 "Two instances, one truth" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-5-chia-se. Output = chạy thật hai instance (pg + Redis) sau proxy :8180, perf/race-api.mjs etag-n, perf/idem-replay.mjs.
 */
import { lamDeck, sql, http, two, box, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.4' };

export const deck = { key: 'api-12-4', code: 'API 12.4', title: 'Two instances, one truth', sub: 'Rate limits, idempotency, ETags and tickets shared' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Two instances, one truth', sub: 'The state that was never “data”<br>— and Redis switched off.' },

  { t: 'The 12.1 probes, on PostgreSQL + Redis', giua: true, body: two(http(`# RAM store (12.1)
201 instance=A /v2/bookings/bk_1
201 instance=B /v2/bookings/bk_2     ⇐ double booking
hỏi lại A: 304                        ⇐ stale
SSE ở B: 401
:4201 GET /v2/me bằng khoá: 401`, { wrap: true, title: 'before' }), http(`# PostgreSQL + Redis
201 instance=A /v2/bookings/bk_3
409 instance=B
đặt ở B: 201 /v2/bookings/bk_5      ⇐ bk_4 burned by the 409
hỏi lại A: 200
SSE ở B: 200
:4201 GET /v2/me bằng khoá: 200`, { wrap: true, title: 'after' })) + box('Same commands, same proxy', 'The restart probe now prints 200 where 12.1 printed 404. Each fix has a mechanism — next slides.', 'xanh') },

  { t: 'A shared token bucket: one Lua script', body: two(sql(`local cap, rate = tonumber(ARGV[1]), tonumber(ARGV[2])
local t = redis.call('TIME')              -- Redis's clock
local nowS = tonumber(t[1]) + tonumber(t[2]) / 1000000
local b = redis.call('HMGET', KEYS[1], 'tokens', 'at')
local tokens = math.min(cap, (tonumber(b[1]) or cap)
  + (nowS - (tonumber(b[2]) or nowS)) * rate)
local ok = 0
if tokens >= 1 then tokens = tokens - 1; ok = 1 end
redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'at', tostring(nowS))
redis.call('EXPIRE', KEYS[1], math.ceil(cap / rate) + 1)
return {ok, tostring(tokens)}`, { lang: 'plaintext', sm: true, hl: [2] }), http(`$ for d in 10 … 17; do curl … POST :8180/v2/bookings; done
201 instance=B ratelimit="booking";r=4;t=12
201 instance=A ratelimit="booking";r=3;t=24
201 instance=B ratelimit="booking";r=2;t=36
201 instance=A ratelimit="booking";r=1;t=48
201 instance=B ratelimit="booking";r=0;t=60
429 instance=A ratelimit="booking";r=0;t=12
429 instance=B ratelimit="booking";r=0;t=12
429 instance=A ratelimit="booking";r=0;t=12`, { sm: true, wrap: true }), 'r46') + box('Atomic, with one clock', 'Read–compute–write runs inside Redis, nothing interleaved. 8.3: 8/8 through a limit of 5; now 5, then 429 across A and B.', 'lam') },

  { t: 'Idempotency and ETags that every instance sees', body: two(sql(`// Chapter 5: saved on 'close' — AFTER the client had its 201
// Chapter 12: saved BEFORE the response leaves
res.json = (body) => {
  saved = true;
  save({ status: res.statusCode, body, location })  // UPDATE … 'done'
    .finally(() => json(body));                     // then the 201
  return res;
};`, { lang: 'javascript', sm: true, hl: [5, 6] }) + http(`$ N=20 node perf/idem-replay.mjs        # under background load
20 lần "nhận 201 rồi gửi lại ngay": phát lại đúng ×20`, { sm: true, wrap: true }), box('Why change something that passed?', 'The first smoke run of the chapter hit 409 IDEMPOTENCY_IN_PROGRESS once: a retry on the other instance arrived before the after-response write. A ~1 ms window — rare is not never.', 'do2') + box('ETags from a SEQUENCE', 'Every write: <code class="i">nextval(\'bookings_list_version\')</code> <b>after</b> COMMIT. Every list: read <code class="i">last_value</code> first. No row lock; worst case one extra 200, never a stale 304.', 'lam'), 'r46') },

  { t: 'Optimistic locking in one statement', giua: true, body: http(`$ LABFLOW_NAIVE_UPDATE=1 … node perf/race-api.mjs etag-n 20     # check in JS, then UPDATE
20 lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×11 · 200 + 412 ×9
$ node perf/race-api.mjs etag-n 20                               # condition inside the UPDATE
20 lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×0 · 200 + 412 ×20`, { wrap: true }) + vsd('<p>Read the device, compare its ETag in JavaScript, then UPDATE. Safe in one process (Chapter 5); across two, both pass the check and the second write silently erases the first.</p>', '<p><code class="i">UPDATE devices SET …, version = version + 1 WHERE id = $1 AND version = $2</code> — zero rows means someone was first ⇒ 412 with the current ETag.</p>', '✗ check, then write', '✓ the check IS the write') },

  { t: 'When Redis is down', body: two(http(`$ redis-cli -p 6390 shutdown nosave
201 instance=B ratelimit="booking";r=4;t=12
201 instance=A ratelimit="booking";r=4;t=12
…  (7 × 201)
$ curl :4200/ready
{ "status": "ready", "database": "up", "redis": "down" }
GET /v2/labs: 200 cache=BYPASS
{"status":503,"code":"DEPENDENCY_DOWN"}      # ticket
 chua_phat … 7                                 # outbox waiting
# Redis back:
 chua_phat | tong | cho_lau_nhat
         0 |    7 | 00:00:02.094`, { sm: true, wrap: true }), `<table class="t"><tr><th>Feature</th><th>Without Redis</th></tr>
<tr><td>rate limit</td><td>fails <b>open</b> to local buckets</td></tr>
<tr><td>labs cache</td><td>BYPASS ⇒ PostgreSQL</td></tr>
<tr><td>tickets</td><td>503 + Retry-After</td></tr>
<tr><td>/ready</td><td>200 — only the DB is required</td></tr>
<tr><td>events</td><td>wait in the outbox, then delivered</td></tr></table>` + box('Trap we hit', 'A Redis client with no <code class="i">\'error\'</code> listener: the worker died with “Unhandled \'error\' event”. Every client now logs and reconnects.', 'do2'), 'r46') + box('Summary · next', 'Lua bucket · keys saved before the reply · SEQUENCE ETags · conditional UPDATE · decide per feature what “Redis down” means. Next (12.5): cache, outbox, email queue.', 'xanh') },
]);
