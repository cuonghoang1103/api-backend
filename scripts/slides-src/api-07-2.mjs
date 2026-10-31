/**
 * api-07-2 — API Design · Chapter 7 · Lesson 7.2 "Contract checks" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s07-hop-dong.mjs › api-7-1-kiem-hop-dong. Output = chạy thật check-drift.mjs (Ajv 2020) + hdr-probe.mjs (Node fetch, Chromium).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 7 — Documentation and contracts', bai: '7.2' };

export const deck = { key: 'api-07-2', code: 'API 7.2', title: 'Contract checks', sub: 'Does the document tell the truth about the running server?' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Does the document<br>tell the truth?', sub: 'Lint says “valid”. Only real requests<br>say “correct”.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why every document <b>drifts</b> away from its server</li>
<li>A 60-line <b>contract check</b>: real requests validated against openapi.yaml</li>
<li>A real LabFlow bug it found: <b>415</b> on <code class="i">Content-Length: 0</code></li>
<li>What lint cannot see — and the four layers of checks</li>
<li>Making it part of CI; consumer-driven contracts (Pact)</li>
</ul>` },

  { t: 'Why documents drift', to: true, giua: true, body: flow([
    { t: 'day 1', s: 'document = server' },
    { t: 'day 30', s: 'code changes', mau: '#7a5195' },
    { t: 'day 31', s: 'document forgotten', mau: '#b85a2b' },
    { t: 'day 60', s: 'a client trusts it', mau: '#c0392b' },
  ]) + two(box('Not carelessness', 'Only time: nobody’s test fails when the document is wrong — it is not code.', 'lam'), box('The fix', 'A test: for real requests, is every status documented, and does every body match its schema?', 'xanh')) },

  { t: 'The checker (condensed)', body: two(sql(`import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
ajv.addSchema({ $id: 'spec', components: spec.components });

async function check(method, path, opts) {
  const res = await fetch(BASE + path, …);
  const op = spec.paths[template]?.[method];
  if (!op) return log('✗ NOT in the document');
  const doc = op.responses[res.status];
  if (!doc) return log(\`✗ \${res.status} not documented\`);
  const validate = ajv.compile(media.schema);
  if (!validate(await res.json())) log(validate.errors);
}
await check('GET', '/me', { token: an });
await check('GET', '/bookings/bk_1', { token: bin }); // 403`, { lang: 'javascript', sm: true, hl: [1, 5, 13] }), `
<ul>
<li>OpenAPI 3.1 schemas = JSON Schema 2020-12 ⇒ Ajv’s <b>2020</b> class</li>
<li><code class="i">format</code> (date-time…) needs <b>ajv-formats</b></li>
<li>logs in as <b>An, Bin, Lan</b>: one account = one branch</li>
<li>sends <b>failing</b> requests on purpose: errors are contract</li>
<li>never trusts itself: it asks the document</li>
</ul>`, 'r64') },

  { t: 'First run: two kinds of drift', giua: true, body: two(http(`$ node openapi/check-drift.mjs
✓ GET /labs → 200
✓ GET /labs?minCapacity=abc → 400
…  (11 more ✓)
✗ POST /bookings/bk_1/cancel → 415: tài liệu không khai mã 415
✗ POST /bookings/bk_1/cancel → 415: tài liệu không khai mã 415
✓ POST /devices/dev_1/issues → 201
✓ POST /issues/iss_1/resolve → 200
✓ POST /issues/iss_1/resolve → 412
✗ POST /bookings/bk_1/check-in → 415: KHÔNG có trong tài liệu`, { sm: true }) + box('Drift 1', '<b>check-in</b> (4.4) was never documented.', 'lam'),
    http(`$ curl … -X POST …/v2/bookings/bk_1/cancel -H "…an.jwt…"
200
$ curl … -X POST …/v2/bookings/bk_1/cancel -H "…an.jwt…" -H 'Content-Length: 0'
415

$ node hdr-probe.mjs
Node fetch: content-length=0 content-type=(none)
Chromium: content-length=0 content-type=(none)`, { sm: true, wrap: 'any' }) + box('Drift 2 — a real bug', '<code class="i">fetch()</code> sends <b>Content-Length: 0</b> on a body-less POST; LabFlow called it “a body of the wrong type”. curl sends none — six chapters never saw it.', 'do2')) },

  { t: 'The fix — and the second run', giua: true, body: two(sql(`// app.js — bài 7.2: "Content-Length: 0" = NO body
const hasBody = (req) =>
  req.get('transfer-encoding') !== undefined
  || Number(req.get('content-length') ?? 0) > 0;
app.use((req, res, next) => {
  if (hasBody(req) && req.is(JSON_TYPES) === false)
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE');
  next();
});`, { lang: 'javascript', sm: true, hl: [2, 3, 4, 6] }) + box('And the document', 'adds <code class="i">/bookings/{id}/check-in</code> and a <b>415</b> on every operation with a body.', 'xanh'),
    http(`$ node openapi/check-drift.mjs | cut -c1 | sort | uniq -c
  19 ✓`, { sm: true }) + box('Who would have hit it?', 'The capstone’s React app — on every cancel and check-in. A test found it before any user did.', 'lam') +
    box('In CI, in this order', 'install → start the server on an empty database → <code class="i">npm run api:lint</code> → <code class="i">npm run api:drift</code> → stop. An undocumented endpoint turns the build red.', 'xanh')) },

  { t: 'What lint cannot see', giua: true, body: two(http(`# capacity changed to type: string in the document
$ npx redocly lint openapi/capacity-string.yaml 2>&1 | tail -2
Woohoo! Your API description is valid. 🎉

$ SPEC=openapi/capacity-string.yaml node openapi/check-drift.mjs | grep -v '^✓'
✗ GET /labs → 200: /data/0/capacity must be string
✗ GET /labs → 200: /data/1/capacity must be string
✗ GET /labs → 200: /data/2/capacity must be string
✗ GET /labs/lab_1 → 200: /capacity must be string`, { sm: true, wrap: 'any' }),
    `<table class="t" style="font-size:18px">
<tr><th>Layer</th><th>Question</th></tr>
<tr><td>Lint (7.1)</td><td>is the document well-formed, in our style?</td></tr>
<tr><td>Contract check (7.2)</td><td>does the server answer what it says?</td></tr>
<tr><td>Typed client (7.3)</td><td>does client code use it correctly?</td></tr>
<tr><td>Diff gate (7.4)</td><td>did the new version break old clients?</td></tr>
</table>`, 'r64') + box('The answer to 7.1’s exercise', 'Lint cannot know what the server sends — the document is still valid. Only real requests show that <code class="i">capacity</code> is a number. Each layer caught something real in this chapter that the others could not.', 'lam') },

  { t: 'Traps and interview answers', to: true, giua: true, body: cards([
    ['✗ Writing the document once, at the end', 'The next day it lags the code. ✓ Contract check in CI: start server → lint → drift.'],
    ['✗ Checking only the happy path', 'The 415 lived on a request that “just works” in curl. ✓ Send what real clients send — and the failing requests.'],
    ['“How do you keep API docs correct?”', 'Lint plus a contract check with real requests. Bigger teams: consumer-driven contracts (Pact).'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Lint proves <b>well-formed</b>; a contract check proves <b>matches the server</b></li>
<li>First run: an undocumented endpoint + a real <b>415</b> bug (fetch → Content-Length: 0)</li>
<li>After the fix: <b>19/19 ✓</b>; a wrong type in the document passes lint, fails 4 checks</li>
<li>Four layers: lint · contract check · typed client · diff gate</li>
</ul>
${box('Next', 'Lesson 7.3 — generate docs, typed clients and validators from the same file.', 'xanh')}` },
]);
