/**
 * api-lab-7 — API Design · Chapter 7 lab "Design-first waitlist" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s07-hop-dong.mjs › api-7-6-lab. Output = chạy thật api:lint, api:diff, Prism, client/waitlist.ts, check-drift, npm test.
 */
import { lamDeck, http, two, box, steps } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 7 — Documentation and contracts', bai: 'Lab 7' };

export const deck = { key: 'api-lab-7', code: 'API Lab 7', title: 'Lab 7 — Design-first waitlist', sub: 'From contract to running code — the contract check decides when you are done' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 7 — Lab', t: 'Lab 7 — a design-first<br>waitlist', sub: 'Contract, lint, gate and mock first.<br>Code last.' },

  { t: 'The request from the faculty', to: true, body: `
<ul>
<li>Join the waitlist of a lab for a period that is <b>already booked</b> — free slot ⇒ tell them to book directly</li>
<li>See my entries with my current <b>position</b> (1 = next)</li>
<li>Leave the waitlist; someone else’s entry ⇒ <b>404</b> (6.2)</li>
<li>Nothing existing may break: v2 clients keep working</li>
</ul>
${steps(['<b>A · 40 min</b> contract: openapi.yaml 2.1.0, lint 0, diff gate', '<b>B1 · 20 min</b> Prism mock + typed client', '<b>B2 · 40 min</b> build: routes, Zod, policy, check-drift', '<b>C · 20 min</b> prove: same client vs real server, all ✓'])}` },

  { t: 'Part A — design: the contract and its gates', giua: true, body: two(`
<ol>
<li>Copy the document to <code class="i">openapi-v2.0.0.yaml</code> (the baseline)</li>
<li>Add <code class="i">POST /labs/{labId}/waitlist</code>, <code class="i">GET /me/waitlist</code>, <code class="i">DELETE /waitlist/{id}</code> — schemas, every error, examples</li>
<li><code class="i">info.version: 2.1.0</code> — additive = MINOR (SemVer); URL stays <code class="i">/v2</code></li>
</ol>
${box('DESIGN.md', 'Status for “slot is free”? Joining twice? Store or compute <code class="i">position</code>? DELETE or POST …/cancel?', 'lam')}`, http(`$ npm run -s api:lint 2>&1 | grep -E 'valid|error|problems|No results'
validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 48ms
Woohoo! Your API description is valid. 🎉
No results with a severity of 'error' found!

$ npm run -s api:diff; echo "exit=$?"
✓ an toàn  POST /labs/{labId}/waitlist: thao tác mới
✓ an toàn  GET /me/waitlist: thao tác mới
✓ an toàn  DELETE /waitlist/{id}: thao tác mới
✓ không có thay đổi phá vỡ
exit=0`, { sm: true, wrap: 'any' })) },

  { t: 'Part B — mock first, then the real server', giua: true, body: two(http(`$ npm run -s api:types 2>&1 | tail -1
🚀 openapi/openapi.yaml → client/labflow.d.ts [98.3ms]
$ npx tsc -p . && echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ BASE=http://localhost:4010 node client/waitlist.ts
201 wl_1 WAITING vị trí 1 string`, { sm: true, title: 'against the Prism mock' }) + box('Before any server code', 'id, status, position come from the examples; <code class="i">Location</code> = “string”: add an example.', 'lam'),
    http(`$ TOKEN=… node client/waitlist.ts
409 SLOT_AVAILABLE
$ curl -s -X POST …/v2/bookings -H "…an.jwt…" --json '{"labId":"lab_2",…}' | jq -c '{id, status}'
{"id":"bk_1","status":"PENDING"}
$ TOKEN=… node client/waitlist.ts
201 wl_1 WAITING vị trí 1 /v2/waitlist/wl_1
$ curl -s …/v2/me/waitlist -H "…bin.jwt…" | jq -c '.data[] | {id, status, position}'
{"id":"wl_1","status":"WAITING","position":1}`, { sm: true, wrap: 'any', title: 'against the real server — same client, unchanged' }) +
    box('Same client, two answers', 'First 409 <code class="i">SLOT_AVAILABLE</code> (the slot is free — book it), then, after An books it, 201 at position 1.', 'xanh')) },

  { t: 'Part C — prove it (real transcript)', body: two(http(`$ node openapi/check-drift.mjs | tail -8
✓ POST /labs/lab_2/waitlist → 409
✓ POST /bookings → 201
✓ POST /labs/lab_2/waitlist → 409
✓ POST /labs/lab_2/waitlist → 409
✓ POST /labs/lab_2/waitlist → 400
✓ GET /me/waitlist → 200
✓ DELETE /waitlist/wl_1 → 404
✓ DELETE /waitlist/wl_1 → 204`, { sm: true }), http(`$ node openapi/check-drift.mjs | cut -c1 | sort | uniq -c
  27 ✓

$ npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'
ℹ tests 10
ℹ pass 10
ℹ fail 0`, { sm: true }) + box('27 checks', 'The 19 of 7.2 plus 8 for the waitlist — including 409, 400 and the 404 for someone else’s entry.', 'xanh') + box('Position is computed', 'Never stored, so it cannot go stale when someone ahead leaves.', 'lam')) },

  { t: 'Rubric — 10 points', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:90px">Pts</th><th>Criterion</th><th style="width:250px">Checked by</th></tr>
<tr><td>2</td><td>Contract complete: 3 operations, every error, realistic examples, 2.1.0</td><td>openapi.yaml</td></tr>
<tr><td>1</td><td>Lint and style guide: 0 errors</td><td>api:lint</td></tr>
<tr><td>1</td><td>Diff gate: no breaking change against 2.0.0</td><td>api:diff</td></tr>
<tr><td>1</td><td>DESIGN.md answers the four questions with reasons</td><td>the file</td></tr>
<tr><td>1</td><td>Typed client written against the mock, unchanged against the server</td><td>transcript · git</td></tr>
<tr><td>2</td><td>Implementation follows the contract: statuses, policy 404, Location, strict body</td><td>check-drift · code</td></tr>
<tr><td>1</td><td>check-drift extended with failing requests; all ✓; npm test green</td><td>transcript</td></tr>
<tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
</table>
<p style="margin-top:10px">Pass: <b>7/10</b>. Stretch: notify the first in line on cancel (Chapter 10) · expire started periods · a manager view.</p>` },
]);
