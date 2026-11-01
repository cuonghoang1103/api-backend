/**
 * api-12-6 — API Design · Chapter 12 · Lesson 12.6 "Re-measuring the load, and the final contract" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: s12-du-an-cuoi-khoa.mjs › api-12-6-do-tai. Output = chạy thật autocannon 8.0.0 + perf/*.mjs của Chương 8 (3 lượt), openapi/diff.mjs, check-drift.mjs.
 */
import { lamDeck, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 12 — Capstone', bai: '12.6' };

export const deck = { key: 'api-12-6', code: 'API 12.6', title: 'Re-measuring the load', sub: 'Same Chapter 8 scripts — and the final contract' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Re-measuring the load', sub: 'Did PostgreSQL make LabFlow slower?<br>Measure, then explain every surprise.' },

  { t: 'Same scripts, four setups, three rounds', giua: true, body: cards([
    ['RAM · 1 instance', 'LABFLOW_STORE=memory — the Chapter 8 design, today’s code'],
    ['PostgreSQL · 1', 'LABFLOW_STORE=pg, no cache'],
    ['PG + Redis cache · 1', 'the production configuration, direct on :4200'],
    ['PG + cache · 2', 'through the health-checking proxy, same laptop'],
  ], 4) + `<table class="t"><tr><th>Round</th><th>uptime before → after (1-min load avg)</th><th>Used?</th></tr>
<tr><td>1</td><td>6.3 → 53.0</td><td>yes</td></tr><tr><td>2</td><td>53.0 → 77.5</td><td class="do">no — started under heavy outside load</td></tr><tr><td>3</td><td>17.1 → 36.9</td><td>yes</td></tr></table>` + box('Fair comparison', '10,000 seeded bookings everywhere · the two test-only limits of Chapter 8 · autocannon -c 10 -d 10 · write-load.mjs · mixed.mjs.', 'lam') },

  { t: 'One raw result, before and after', giua: true, body: http(`$ npx autocannon -c 10 -d 10 -H "Authorization=Bearer …" "$BASE/v2/bookings?limit=20"   # RAM, round 1
│ Latency │ 5 ms │ 6 ms │ 16 ms │ 20 ms │ 7.12 ms │ 3.62 ms │ 71 ms │
│ Req/Sec   │ 1,152   │ 1,152   │ 1,272   │ 1,499 │ 1,317.5 │ 122.52 │ 1,152   │
13k requests in 10.01s, 105 MB read`, { wrap: true, title: 'RAM store' }) + http(`$ npx autocannon -c 10 -d 10 -H "Authorization=Bearer …" "$BASE/v2/bookings?limit=20"   # PostgreSQL, round 1
│ Latency │ 2 ms │ 3 ms │ 5 ms  │ 6 ms │ 2.99 ms │ 0.99 ms │ 21 ms │
│ Req/Sec   │ 2,533   │ 2,533   │ 2,899   │ 2,985   │ 2,865.2 │ 125.24 │ 2,532   │
29k requests in 10.01s, 229 MB read`, { wrap: true, title: 'PostgreSQL store' }) },

  { t: 'The table (average req/s, rounds 1 · 3)', giua: true, body: `<table class="t"><tr><th>Endpoint</th><th>Ch8 RAM</th><th>RAM today</th><th>PostgreSQL</th><th>PG + cache</th><th>PG + cache ×2</th></tr>
<tr><td>GET /v2/labs</td><td>9,414</td><td>7,851 · 8,091</td><td class="do">5,549 · 5,093</td><td>6,000 · 5,317</td><td>6,029 · 4,218</td></tr>
<tr><td>GET /v2/bookings (Lan, all)</td><td>1,084</td><td>1,318 · 1,471</td><td class="xanh">2,865 · 2,456</td><td>2,756 · 2,830</td><td>3,392 · 2,339</td></tr>
<tr><td>GET /v2/bookings (An, own)</td><td>—</td><td>1,734 · 1,910</td><td class="xanh">2,798 · 2,593</td><td>2,879 · 3,016</td><td>3,333 · 2,733</td></tr>
<tr><td>POST /v2/bookings</td><td>—</td><td>644 · 621</td><td class="xanh">2,028 · 1,705</td><td>2,131 · 2,196</td><td>1,239 · 1,070</td></tr>
<tr><td>POST /v2/auth/login</td><td>113.6</td><td>119.8 · 113.8</td><td>111.4 · 99.1</td><td>124.6 · 110.4</td><td>70.7 · 145.4</td></tr></table>` + box('Three of four results surprise people', 'Lists 1.4–2.2× faster · writes 2.7–3.2× faster · the tiny labs list 29–37% slower · logins unchanged (CPU-bound scrypt).', 'lam') },

  { t: 'Why each number moved', giua: true, to: true, body: two(`<ul>
<li><b>Lists faster:</b> RAM filters and <i>sorts</i> 10,000 objects per request; PostgreSQL reads 21 index rows.</li>
<li><b>Writes faster:</b> each RAM booking scans the whole array twice (overlap, active count) — O(n), and n grows during the test.</li>
<li><b>Labs slower:</b> 4 rows, no sort — nothing beats memory; the cache wins back 4–8%.</li>
<li><b>Two instances on one laptop:</b> same cores plus a proxy hop — availability, not capacity.</li></ul>`, box('Trap — one run, one number', 'The same configuration measured 4,218 and 6,029 req/s here. Run twice, record the load average, discard runs under outside load, publish ranges.', 'do2') + box('Next optimisation', '<code class="i">user</code> lookup per request: 0.42–0.77 ms ≈ the query itself. Cache it 30 s, or trust the JWT role — and write the trade-off down.', 'lam'), 'r64') },

  { t: 'The final contract: 2.4.0', body: two(http(`$ npm run -s api:diff                       # 2.3.0 ⇒ 2.4.0
✓ không có thay đổi phá vỡ
exit 0
openapi-v2.3.0: 4 thao tác khai 503
openapi: 16 thao tác khai 503
$ npx redocly lint openapi/openapi.yaml
Woohoo! Your API description is valid. 🎉
$ BASE=…:8180/v2 node openapi/check-drift.mjs   # PostgreSQL
✓ 40 · ✗ 0
$ …                                          # two RAM instances
✓ 40 · ✗ 0`, { sm: true, wrap: true }), http(`$ paste … drift-mem.txt drift-pg.txt | column -t
✓ POST /bookings → 201              ✓ POST /bookings → 409
✓ GET /bookings/bk_1 → 200          ✓ GET /bookings/bk_1 → 403
✓ POST /bookings/bk_1/cancel → 403  ✓ POST /bookings/bk_1/cancel → 200
✓ POST /bookings/bk_1/cancel → 200  ✓ POST /bookings/bk_1/cancel → 409`, { sm: true, title: 'RAM (left) · PostgreSQL (right)' }) + box('Shapes, not truth', 'The RAM pair double-booked and still passed 40/40. Contract checks validate shapes; behaviour tests (12.3) catch the rest.', 'do2'), 'r46') + box('Summary · next', 'Ranges, load averages, explanations — then 0 breaking changes and drift 40/40. Next (12.7): the deployment checklist.', 'xanh') },
]);
