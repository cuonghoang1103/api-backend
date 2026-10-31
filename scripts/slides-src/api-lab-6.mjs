/**
 * api-lab-6 — API Design · Chapter 6 lab "Security review" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s06-bao-mat.mjs › api-6-5-lab. Output = chạy thật audit.mjs, authz-matrix.mjs, npm test.
 */
import { lamDeck, sql, http, two, box } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 6 — Security for APIs', bai: 'Lab 6' };

export const deck = { key: 'api-lab-6', code: 'API Lab 6', title: 'Lab 6 — Security review', sub: 'Find it, prove it, close it — and leave a test' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 6 — Lab', t: 'Lab 6 — Security review:<br>find it, prove it, close it', sub: 'A build with LABFLOW_VULN=1 —<br>the job of a real reviewer.' },

  { t: 'What is switched on', to: true, body: `
<ul>
<li>Receipt endpoint skips the object-level check — <b>API1</b></li>
<li>JWT verifier accepts <code class="i">"alg": "none"</code>, ignores expiry; no login limit — <b>API2</b></li>
<li><code class="i">PATCH /v2/me</code> copies the whole body into the user — <b>API3</b></li>
<li><code class="i">safeFetch</code> fetches any URL, follows redirects — <b>API7</b></li>
<li>CORS reflects any origin, allows credentials — <b>API8</b></li>
</ul>
${two(box('Time', 'Exploit 30 min · fix 60 min · prove 20 min.', 'lam'), box('Rule', 'Never on a server you do not own. This build runs on your laptop, on port 4000.', 'do2'))}` },

  { t: 'Part A — find and exploit · Part B — fix', to: true, body: two(`
<p style="margin:0 0 6px"><b>Part A</b> (FINDINGS.md)</p>
<ol>
<li><code class="i">node audit.mjs</code>: list every FAIL</li>
<li>One curl exploit per FAIL, real output</li>
<li>Why do API5 and API6 fail too?</li>
<li>Impact and ease for each finding</li>
</ol>`, `
<p style="margin:0 0 6px"><b>Part B</b> (rules)</p>
<ol>
<li><code class="i">authorize()</code> everywhere, 404</li>
<li>HS256 only, signature, iss, exp; login limit</li>
<li>Strict <code class="i">PATCH /v2/me</code> schema</li>
<li><code class="i">safeFetch</code>: https, resolve, no redirects</li>
<li>CORS allow-list</li>
<li><code class="i">test/security.test.mjs</code>: green fixed, red vulnerable</li>
</ol>`) },

  { t: 'Reference solution: the security tests', body: sql(`test('API1: một sinh viên không đọc được biên nhận của người khác (404)', async () => {
  const r = await call('/v2/bookings', { method: 'POST', token: an, body: { labId: 'lab_1', period: { … } } });
  const { id } = await r.json();
  assert.equal((await call(\`/v2/bookings/\${id}/receipt\`, { token: an })).status, 200);
  assert.equal((await call(\`/v2/bookings/\${id}/receipt\`, { token: bin })).status, 404);
});
test('API2: token alg "none" và token bị sửa đều bị từ chối', async () => { /* … 401, 401 … */ });
test('API3: PATCH /v2/me không đổi được vai trò', async () => {
  assert.equal((await call('/v2/me', { method: 'PATCH', token: an, body: { role: 'LAB_MANAGER' } })).status, 400);
  assert.equal((await (await call('/v2/me', { token: an })).json()).role, 'STUDENT');
});
test('API7: không tải URL nội bộ', async () => { /* 127.0.0.1, 169.254.169.254, localhost ⇒ 422 */ });
test('API8: CORS chỉ cho origin đã duyệt, không bao giờ "*"', async () => { /* evil ⇒ no ACAO */ });`, { lang: 'javascript', sm: true, hl: [5, 9, 10] }) + two(box('Green and red', 'Each test must pass on the fixed build <b>and fail</b> with <code class="i">LABFLOW_VULN=1</code> — otherwise it tests nothing.', 'xanh'), box('Where the fix lives', 'The fixed code is lessons 6.1–6.4; the full test file is in the lesson.', 'lam')) },

  { t: 'Part C — prove it (real transcript)', body: two(http(`# LABFLOW_VULN=1
$ node audit.mjs | tail -4
FAIL  API8 Misconfiguration  no X-Powered-By, CORS refuses evil origin
PASS  API9 Inventory         old unversioned path announces its end
—     API10 Unsafe consumption  …
✗ 9 kiểm thất bại

$ curl -s -X PATCH …/v2/me -H "Authorization: Bearer $(cat an.jwt)" --json '{"role":"LAB_MANAGER"}' | jq -c .
{"id":"usr_1","name":"Nguyễn Văn An","role":"LAB_MANAGER",
 "email":"an@student.labflow.example"}

$ curl -s -X PATCH …/v2/devices/dev_1 -H "Authorization: Bearer $(cat an.jwt)" … -d '{"status":"MAINTENANCE","note":"An đã ở đây"}' | jq -c '{id, status, note}'
{"id":"dev_1","status":"MAINTENANCE","note":"An đã ở đây"}`, { sm: true, wrap: 'any', title: 'steps 1–2' }), http(`# fixed
$ node authz-matrix.mjs | tail -1
✓ 0 ô sai chính sách
$ node audit.mjs | tail -2
—     API10 Unsafe consumption  …
✓ mọi kiểm đạt
$ npm test 2>&1 | grep -E '^(ℹ tests|ℹ pass|ℹ fail)'
ℹ tests 10
ℹ pass 10
ℹ fail 0
$ LABFLOW_VULN=1 npm test 2>&1 | grep -E '^(✖ API|ℹ pass|ℹ fail)' | sort -u
✖ API1: … (404) …
✖ API2: … alg "none" …
✖ API3: … vai trò …
✖ API7: … URL nội bộ …
✖ API8: … CORS …
ℹ fail 5
ℹ pass 5`, { sm: true, wrap: 'any', title: 'step 3 (test names shortened)' }) + box('Order matters', 'The matrix runs <b>before</b> the audit: the audit locks Bin’s login on purpose.', 'lam'), 'r46') },

  { t: 'Rubric — 10 points', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:90px">Pts</th><th>Criterion</th><th style="width:250px">Checked by</th></tr>
<tr><td>2</td><td>Every FAIL found and exploited; API5/API6 chain explained</td><td>FINDINGS.md</td></tr>
<tr><td>2</td><td>BOLA closed with one policy and 404; matrix 0 wrong cells</td><td>step 2 · code</td></tr>
<tr><td>2</td><td>Tokens: fixed algorithm, signature, expiry; login limit</td><td>audit · tests</td></tr>
<tr><td>1</td><td>Mass assignment closed by a strict schema</td><td>audit · tests</td></tr>
<tr><td>1</td><td>SSRF and CORS closed</td><td>audit · tests</td></tr>
<tr><td>1</td><td>Security tests green fixed, red vulnerable</td><td>step 2</td></tr>
<tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
</table>
<p style="margin-top:10px">Pass: <b>7/10</b>. Stretch: refresh tokens with rotation · audit and tests in CI.</p>` },
]);
