/**
 * api-08-4 — API Design · Chapter 8 · Lesson 8.4 "Scaling out" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-3-mo-rong. Output = chạy thật 2 instance + perf/proxy-rr.mjs, PostgreSQL 18 (idempotency_keys).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: '8.4' };

export const deck = { key: 'api-08-4', code: 'API 8.4', title: 'Scaling out', sub: 'Statelessness and safe retries' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Designing APIs<br>that scale out', sub: 'Two instances, four breakages,<br>one cause.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Two LabFlow instances behind a <b>round-robin</b> load balancer</li>
<li>What keeps working (JWT) — and the <b>four things that break</b></li>
<li>Moving state out: one <b>idempotency table</b> for every instance</li>
<li>Why not sticky sessions; what happens when an instance <b>dies</b></li>
<li>A scale-out checklist for the API contract</li>
</ul>` },

  { t: 'Two instances behind a load balancer', giua: true, body: flow([
    { t: 'client', s: 'knows :8080 only' },
    { t: 'round-robin', s: 'A, B, A, B …', mau: '#7a5195' },
    { t: 'A :4001', s: 'own RAM, own counters', mau: '#b85a2b' },
    { t: 'B :4002', s: 'same code, separate RAM', mau: '#b85a2b' },
  ]) + two(sql(`// perf/proxy-rr.mjs (condensed)
let i = 0;
http.createServer((req, res) => {
  const up = ups[i++ % ups.length];
  const p = http.request({ host: '127.0.0.1', port: up,
    path: req.url, method: req.method, agent, headers }, (r) => {
    res.writeHead(r.statusCode, r.headers); r.pipe(res);
  });
  p.on('error', () => { res.writeHead(502, …); res.end(…); });
  req.pipe(p);
}).listen(port);`, { lang: 'javascript', sm: true, hl: [4] }), http(`$ LABFLOW_INSTANCE=A PORT=4001 npm start
$ LABFLOW_INSTANCE=B PORT=4002 npm start
$ node perf/proxy-rr.mjs 8080 4001 4002

# login (on A), then /v2/me twice
HTTP/1.1 200 OK  labflow-instance: A
HTTP/1.1 200 OK  labflow-instance: B
HTTP/1.1 200 OK  labflow-instance: A`, { sm: true, wrap: 'any' }) + box('JWT still works', 'Stateless: the token carries the claims; the secret is shared configuration.', 'xanh')) },

  { t: 'What breaks: state in one process’s RAM', giua: true, body: two(http(`# 1 · data in RAM: Lan books lab 1
HTTP/1.1 201 Created  labflow-instance: B  location: /v2/bookings/bk_1
GET bk_1 → 404 (A) · 200 (B)

# 2 · rules checked in RAM: the SAME booking again
HTTP/1.1 201 Created  labflow-instance: A  location: /v2/bookings/bk_1

# 3 · limit 5/min per user: eight bookings
201 B · 201 A · 201 B · 201 A · 201 B · 201 A · 201 B · 201 A

# 4 · same Idempotency-Key twice
HTTP/1.1 201 Created labflow-instance: A … "id": "bk_1"
HTTP/1.1 201 Created labflow-instance: B … "id": "bk_1"`, { sm: true, wrap: 'any' }), `<table class="t" style="font-size:18px">
<tr><th>Broke</th><th>Move it to</th></tr>
<tr><td>data, ID counter</td><td>the database (Ch12); DB or random IDs</td></tr>
<tr><td>409 overlap check</td><td>the database (one shared truth)</td></tr>
<tr><td>rate-limit counters</td><td>shared store or the gateway</td></tr>
<tr><td>idempotency keys</td><td>shared store, claimed atomically</td></tr>
</table>` + box('Twelve-Factor, VI. Processes', '“Stateless and share-nothing. Any data that needs to persist must be stored in a stateful backing service.”', 'lam')) },

  { t: 'One idempotency table for every instance', body: sql(`// idempotency-pg.js (condensed) — same rules as 5.1
const won = await pool.query(\`INSERT INTO idempotency_keys (scope, key, fp, state) VALUES ($1, $2, $3, 'running')
  ON CONFLICT DO NOTHING RETURNING 1\`, [scope, key, fp]);
if (won.rowCount === 0) {                       // key exists — on this instance or another
  const { rows: [e] } = await pool.query('SELECT * FROM idempotency_keys WHERE scope = $1 AND key = $2', …);
  if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');
  if (e.state === 'running') throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS');
  res.set('Idempotent-Replayed', 'true');
  return res.status(e.status).json(e.body);    // replay the stored answer
}
// won ⇒ run the handler; 2xx ⇒ UPDATE state = 'done' + store status/body; error ⇒ DELETE`, { lang: 'javascript', sm: true, hl: [2, 3] }) + two(http(`$ LABFLOW_IDEMPOTENCY=pg …   # A and B, same key twice
201 Created  B  location: /v2/bookings/bk_1
201 Created  A  idempotent-replayed: true
$ psql … "SELECT scope, key, state, status, body->>'id' …"
usr_3|dat-phong-lan-01|done|201|bk_1`, { sm: true, wrap: 'any' }), box('One statement decides', 'The primary key lets exactly one INSERT win. ✗ SELECT-then-INSERT: both can pass.', 'xanh') + box('Honest', 'GET bk_1 is still 404 on A: bookings stay in B’s RAM until Chapter 12.', 'lam')) },

  { t: 'Sticky sessions, and when an instance dies', giua: true, body: two(box('✗ Sticky sessions', 'Pin each user to one instance so RAM state “works”:<br>• lost on every restart/deploy<br>• 40 students behind one school IP pin one instance<br>• cannot stop Lan and An double-booking from different instances', 'do2') + box('✓ Instead', 'Tokens, shared data, idempotency keys on every write.', 'xanh'),
    http(`$ kill $(lsof -ti tcp:4002 -sTCP:LISTEN)
$ for i in 1 2 3 4; do curl … :8080/v2/labs; done
502 200 502 200`, { sm: true, wrap: 'any' }) + box('Real balancers', '<b>Health checks</b>: stop sending to an instance that fails <code class="i">/ready</code> (8.6).<br><b>Retries</b>: only when repeating is safe — GET, or POST with an Idempotency-Key backed by a shared store.', 'lam')) },

  { t: 'A scale-out checklist for the contract', to: true, giua: true, body: cards([
    ['1 · Tokens, not sessions in RAM', 'Any instance can check a JWT.'],
    ['2 · IDs that cannot collide', 'From the DB or random — never “counter + 1”.'],
    ['3 · Every write retry-safe', 'Idempotency-Key with a shared, atomic store.'],
    ['4 · Limits counted once', 'Shared counters or the gateway: the documented limit is the real one.'],
    ['5 · Cursors any instance reads', 'The cursor carries its own position (3.2).'],
    ['6 · Files in object storage', 'Never on one instance’s disk.'],
  ]) + box('Further', 'Load-balancing algorithms, autoscaling, growing from one server to many: System Design course, chapter 2.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Behind round-robin: <b>JWT works</b>; data, IDs, limits and idempotency break</li>
<li>Measured: two <b>bk_1</b>, <b>8/8</b> past a limit of 5, the same key → <b>two 201s</b></li>
<li>Shared PostgreSQL table + <b>INSERT … ON CONFLICT DO NOTHING</b>: second request replayed</li>
<li>Sticky sessions hide the problem; health checks and safe retries depend on the contract</li>
</ul>
${box('Next', 'Lesson 8.5 — SLOs, error budgets, and what overload really does.', 'xanh')}` },
]);
