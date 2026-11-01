/**
 * api-08-6 — API Design · Chapter 8 · Lesson 8.6 "Degrading on purpose" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-4-suy-giam. Output = chạy thật POST /chaos/db (LABFLOW_CHAOS=1), perf/app-client.mjs, redocly lint openapi 2.2.0.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: '8.6' };

export const deck = { key: 'api-08-6', code: 'API 8.6', title: 'Degrading on purpose', sub: 'Availability in the contract (2/2)' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'The database is down.<br>What does the API say?', sub: 'Old data with a label, a clear refusal,<br>and clients that read the rules.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Decide <b>per endpoint</b>: stale-but-labelled data, or a clear 503</li>
<li><code class="i">Age</code> + <code class="i">LabFlow-Degraded</code>, measured during a simulated outage</li>
<li><b>Liveness vs readiness</b> — and the probe that restarts everything</li>
<li>Writing 503, Retry-After and the degraded headers into <b>OpenAPI 2.2.0</b></li>
<li>An app that <b>reads the contract</b>: retries within a time budget</li>
</ul>` },

  { t: 'Decide per endpoint', to: true, giua: true, body: cards([
    ['R · Reads with a safe fallback', 'Lab list: last good copy + <b>Age</b> + <b>LabFlow-Degraded: stale-data</b>.'],
    ['W · Writes without a fallback', 'Booking: <b>503 DEPENDENCY_DOWN</b> + Retry-After: 30. Never pretend it was saved.'],
    ['? · Reads where old is wrong', '“My bookings” right after booking, a balance — refuse rather than mislead.'],
    ['✓ · Tell the balancer', '<b>/ready</b> answers 503 so traffic moves to instances that can still write.'],
  ], 2) + box('✗ The lazy answer', '“500 for everything” — the user learns nothing, the app cannot decide anything.', 'do2') },

  { t: 'withLastGood — and a simulated outage', body: two(sql(`// resilience.js
export function withLastGood(read) {
  let last = null;
  return (req, res) => {
    if (!dependency.down) {
      const data = read(req); last = { data, at: Date.now() };
      return { data, stale: null };
    }
    if (!last) { res.set('Retry-After', '30');
      throw new HttpError(503, 'DEPENDENCY_DOWN'); }
    return { data: last.data,
      stale: Math.floor((Date.now() - last.at) / 1000) };
  };
}
// routes/labs.js
if (stale !== null) res.set('Age', String(stale))
  .set('LabFlow-Degraded', 'stale-data');`, { lang: 'javascript', sm: true, hl: [11, 12, 15, 16] }), http(`$ curl -X POST …/chaos/db --json '{"down":true}'
$ sleep 2; curl -D - …/v2/labs
HTTP/1.1 200 OK
Age: 2
LabFlow-Degraded: stale-data
$ curl -i …/health ; curl -i …/ready
HTTP/1.1 200 OK        "status": "ok"
HTTP/1.1 503 Service Unavailable
Retry-After: 30        "status": "degraded"
$ curl -i … POST /v2/bookings …
HTTP/1.1 503 Service Unavailable
Retry-After: 30        "code": "DEPENDENCY_DOWN"
$ curl -X POST …/chaos/db --json '{"down":false}'
labs: HTTP/1.1 200 OK (no label) · /ready 200`, { sm: true, wrap: 'any' }), 'r64') },

  { t: 'Liveness and readiness are different questions', giua: true, body: two(`<table class="t" style="font-size:19px">
<tr><th></th><th>/health — liveness</th><th>/ready — readiness</th></tr>
<tr><td>asks</td><td>is the process alive?</td><td>should it get traffic now?</td></tr>
<tr><td>fails ⇒</td><td>restart the container</td><td>route around it, no restart</td></tr>
<tr><td>checks</td><td>the process only</td><td>+ required dependencies</td></tr>
<tr><td>DB down</td><td>200</td><td>503 + Retry-After</td></tr>
</table>`, box('✗ The database in liveness', 'DB down ⇒ every instance fails liveness ⇒ all restart at once, into the same broken DB — and the stale list you could have served is gone.', 'do2') + box('Kubernetes docs', 'Wrong liveness probes cause cascading failures; readiness may also check required back-end services.', 'lam')) },

  { t: 'Writing it into the contract', giua: true, body: two(sql(`# openapi.yaml 2.2.0 — components
  headers:
    Retry-After:
      description: Seconds to wait before retrying (503, 429)
      schema: { type: integer, minimum: 1 }
    Age:
      description: Seconds since this copy was fresh (RFC 9111)
      schema: { type: integer, minimum: 0 }
    LabFlow-Degraded:
      description: Stale copy served during an incident; see Age
      schema: { type: string, enum: [stale-data] }
  responses:
    Unavailable:
      description: OVERLOADED or DEPENDENCY_DOWN. Safe to retry after Retry-After.
      headers: { Retry-After: { $ref: '#/components/headers/Retry-After' } }
# POST /auth/login, GET /labs, POST /bookings:
#   '503': { $ref: '#/components/responses/Unavailable' }`, { lang: 'yaml', sm: true }), http(`$ npm run api:lint
Woohoo! Your API description is valid. 🎉
No results with a severity of 'error' found!
$ node openapi/diff.mjs openapi-v2.1.0.yaml openapi.yaml
✓ không có thay đổi phá vỡ`, { sm: true, wrap: 'any' }) + box('Next to the spec: docs/slo.md', 'SLOs per endpoint group · what degradation looks like · client timeout and retry rules · where the status page is.', 'lam')) },

  { t: 'An app that reads the contract', giua: true, body: sql(`// perf/app-client.mjs (condensed)
const key = method === 'POST' ? randomUUID() : undefined;  // ONE key for every resend
for (let attempt = 1; ; attempt++) {
  const r = await fetch(url, { method, body, headers: { …, 'idempotency-key': key } });
  if (r.status !== 503 && r.status !== 429) {
    if (r.headers.get('labflow-degraded')) showUpdatingBanner(r.headers.get('age'));
    return r;
  }
  const wait = 1000 * Number(r.headers.get('retry-after') ?? 1);
  if (Date.now() - start + wait > budgetMs) return failClearly(r);   // 10 s budget
  await sleep(wait);
}`, { lang: 'javascript', sm: true, hl: [2, 10] }) + cards([
    ['Stale data', 'Show it, with an “updating” line (Age seconds old).'],
    ['503 / 429', 'Wait exactly Retry-After, resend with the SAME Idempotency-Key.'],
    ['Wait too long', 'Retry-After beyond the screen’s time budget ⇒ stop now, say so.'],
  ]) },

  { t: 'Two scenarios, measured', giua: true, body: http(`# 1 · the 07:00 flood (200 users, shedding on)
[   34 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 1038 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 2046 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 3053 ms] POST /v2/auth/login → 503 OVERLOADED, chờ 1000 ms theo Retry-After rồi gửi lại
[ 4087 ms] POST /v2/auth/login → 200 (lần 5)

# 2 · database down
[   71 ms] POST /v2/auth/login → 200
[   74 ms] GET /v2/labs → 200, bản cũ 1 s ⇒ hiện dữ liệu + dòng "đang cập nhật"
[   77 ms] POST /v2/bookings → 503 DEPENDENCY_DOWN, Retry-After 30 s > ngân sách 10 s ⇒ dừng, báo "chưa đặt được, thử lại sau"`, { sm: true, wrap: 'any' }) + two(box('Never hangs', 'Four cheap refusals, then in at 4.1 s — exactly when the flood ended. The booking stops in 3 ms with a reason.', 'xanh'), box('Shedding is not fair', '200 clients retry after exactly 1 s, so Lan’s chance is small. Add <b>jitter</b> (5.2); give staff their own limit.', 'lam')) },

  { t: 'Interview answers', to: true, giua: true, body: cards([
    ['“The database is down — what does your API return?”', 'Depends on the endpoint, and it is written down: stale + Age + label, 503 + Retry-After for writes, readiness 503.'],
    ['“Liveness vs readiness?”', 'Restart vs stop sending traffic. Never put the database in liveness.'],
    ['“How should a mobile app handle 503?”', 'Retry-After within the screen’s time budget, same idempotency key, jitter, a clear message when the wait is too long.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Per endpoint: stale reads with <b>Age</b> + <b>LabFlow-Degraded</b>; writes <b>503 DEPENDENCY_DOWN</b></li>
<li>Measured: lab list 200 (Age 2), booking 503, <b>/ready 503</b>, <b>/health 200</b>; normal again after</li>
<li>Liveness checks the process; dependencies belong in readiness</li>
<li>OpenAPI <b>2.2.0</b>: 503 + headers, lint 0 errors, no breaking change; <b>docs/slo.md</b></li>
<li>A client that reads the contract never hangs: four 503s waited out, a 30 s wait refused at once</li>
</ul>
${box('Next', 'Lab 8 — a usage report that froze LabFlow: measure, fix, protect, promise.', 'xanh')}` },
]);
