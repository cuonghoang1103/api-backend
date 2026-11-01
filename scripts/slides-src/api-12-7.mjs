/**
 * api-12-7 — API Design · Chapter 12 · Lesson 12.7 "The deployment checklist" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-7-trien-khai. Output = chạy thật NODE_ENV=production, pg_ctl stop/start, perf/shutdown.mjs, /metrics, ops/backup.sh, ops/smoke.mjs.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.7' };

export const deck = { key: 'api-12-7', code: 'API 12.7', title: 'The deployment checklist', sub: 'Config, readiness, graceful shutdown, logs, backups, smoke test' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'The deployment checklist', sub: 'Seven items between “tests pass”<br>and “nothing broke on deploy day”.' },

  { t: 'Seven items — and the first one, measured', body: cards([
    ['1 Config & secrets', 'env vars, checked at start'], ['2 Health vs readiness', 'alive ≠ can serve'],
    ['3 Graceful shutdown', 'drain, finish, exit 0'], ['4 Logs & metrics', 'JSON + X-Request-Id · private /metrics'],
    ['5 Migrations first', 'expand ⇒ code ⇒ contract'], ['6 Backup + restore drill', 'proven by a restore'],
  ], 3) + http(`$ NODE_ENV=production node src/server.js; echo "exit $?"
LabFlow không khởi động — cấu hình thiếu/sai (3):
  • LABFLOW_JWT_SECRET (bí mật ký JWT, ≥ 32 byte ngẫu nhiên)
  • DATABASE_URL (postgres://user:pass@host:5432/db)
  • LABFLOW_REDIS (redis://host:6379 — rate limit, vé realtime, sự kiện, hàng đợi)
exit 1
$ NODE_ENV=production LABFLOW_JWT_SECRET=… DATABASE_URL=… LABFLOW_REDIS=… LABFLOW_CHAOS=1 node src/server.js
  • LABFLOW_CHAOS là biến CHỈ để học — gỡ khỏi môi trường production`, { sm: true, wrap: true }) + box('7 Smoke test', 'A real user’s path through the public URL after every deploy; red ⇒ roll back.', 'lam') },

  { t: 'Health is not readiness: stop the database', giua: true, body: two(http(`$ pg_ctl -D pgdata stop -m fast
/health 200
{ "status": "degraded", "store": "pg",
  "database": "down", "redis": "up" }
GET /v2/labs: 200 cache=HIT
$ curl -i … POST /v2/bookings -H 'X-Request-Id: req-db-down'
HTTP/1.1 503 Service Unavailable
Retry-After: 5
  "code": "DEPENDENCY_DOWN"
$ pg_ctl … start; sleep 2
/ready 200
POST /v2/bookings 201`, { sm: true, wrap: true }), `<table class="t"><tr><th>Probe</th><th>Question</th><th>DB down</th></tr>
<tr><td>/health</td><td>alive? (restart me if not)</td><td>200</td></tr>
<tr><td>/ready</td><td>send me traffic?</td><td class="do">503</td></tr>
<tr><td>writes</td><td>—</td><td>503 + Retry-After</td></tr>
<tr><td>cached reads</td><td>—</td><td>200</td></tr></table>` + box('The process survived', '“pg pool: terminating connection due to administrator command” was logged — the pool’s \'error\' listener kept Node alive (12.3).', 'xanh'), 'r46') },

  { t: 'Graceful shutdown, measured under load', body: two(sql(`lifecycle.draining = true;         // /ready ⇒ 503
await sleep(SHUTDOWN_DRAIN_MS);    // LB notices; keep serving
lifecycle.emit('shutdown');        // SSE ends · WS 1012
await close(server);               // finish in-flight
await store.close();               // pool, then exit 0`, { lang: 'javascript', sm: true }) + http(`$ KILL_PID=… AT=2000 SECONDS=6 node perf/shutdown.mjs   # LABFLOW_SHUTDOWN=abrupt
trước 200: 2419 · sau SIGTERM 200: 4505 · sau SIGTERM 502: 622 · sau SIGTERM UND_ERR_SOCKET: 2
$ …                                                     # SHUTDOWN_DRAIN_MS=1500
trước 200: 3134 · sau SIGTERM 200: 8493
{…"msg":"shutdown complete","instance":"A","ms":1501}
   6.5 s  :4200 KHÔNG sẵn sàng (/ready 503) 2 lần liền ⇒ ngừng gửi`, { sm: true, wrap: true }), box('✗ Trap: a health check that is too strict', 'First proxy: one check slower than 400 ms ⇒ dead. Under load B was removed in 0.5 s, then A was killed ⇒ <b>64,926 × 503</b> in four seconds. Use seconds-long timeouts and several consecutive failures (nginx max_fails, HAProxy fall).', 'do2') + box('Kubernetes', 'SIGTERM, then SIGKILL after terminationGracePeriodSeconds (30 s by default).', 'lam'), 'r64') },

  { t: 'Logs and metrics an operator can use', body: http(`$ curl -s -D - … /v2/bookings?limit=2 -H 'X-Request-Id: smoke-7f3a' | grep -i '^x-request-id'
X-Request-Id: smoke-7f3a
$ grep '"smoke-7f3a"' log-a12.log | jq -c .
{"time":"…","level":"info","msg":"request","instance":"A","reqId":"smoke-7f3a","method":"GET","path":"/v2/bookings","route":"/v2/bookings","status":200,"ms":6.3,"userId":"usr_3"}`, { sm: true, wrap: 'any' }) + two(http(`$ curl -s http://127.0.0.1:9464/metrics | grep -E …
labflow_http_requests_total{method="GET",route="/v2/bookings",status="200"} 1
labflow_http_request_duration_seconds_bucket{…,le="0.01"} 1
labflow_pg_pool_connections{state="total"} 1
labflow_pg_pool_connections{state="waiting"} 0
labflow_event_loop_delay_p99_seconds 0.013451
$ curl … http://localhost:4200/metrics
cổng công khai /metrics: 404`, { sm: true, wrap: true }), box('Never log', 'Authorization headers, passwords, tokens, connection strings, personal data (OWASP Logging Cheat Sheet).', 'do2') + box('Label = route template', '<code class="i">/v2/bookings/:id</code>, never the real id: every label combination is a new time series.', 'lam'), 'r64') },

  { t: 'Backups proven by restore, and the smoke test', giua: true, body: two(http(`$ DATABASE_URL=… bash ops/backup.sh ../backups
dump: ../backups/labflow-20261101T044512Z.dump (148K, 1 s)
restore: 0 s
gốc:       users=3 bookings=10000 outbox=0 migrations=4
khôi phục: users=3 bookings=10000 outbox=0 migrations=4
KHỚP — bản sao lưu dùng được`, { sm: true, wrap: true }), http(`$ node ops/smoke.mjs http://localhost:8180
✓ GET /health                          31 ms
✓ GET /ready (CSDL + Redis)             4 ms
✓ GET /openapi.yaml                     2 ms  version 2.4.0
✓ POST /v2/bookings (Idempotency-Key)  16 ms  bk_10001
✓ POST lại cùng khoá ⇒ phát lại …       6 ms
✓ SSE nhận created + cancelled …       54 ms
✓ email thông báo đã đi (MAIL_LOG)    304 ms
SMOKE ĐẠT: mọi bước xanh`, { sm: true, wrap: true, title: '12 steps (7 shown)' })) + box('Deploy-day order', 'backup ⇒ npm run db:migrate (advisory lock) ⇒ start new instances ⇒ smoke test ⇒ drain the old ones. pg_dump is a snapshot; add WAL archiving for point-in-time recovery (PostgreSQL course, Ch15).', 'xanh') },
]);
