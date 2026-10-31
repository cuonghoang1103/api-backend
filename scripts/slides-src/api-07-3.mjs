/**
 * api-07-3 — API Design · Chapter 7 · Lesson 7.3 "Generating docs, clients and validators" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s07-hop-dong.mjs › api-7-2-sinh-code. Output = chạy thật redocly build-docs, openapi-typescript 7.13, tsc 5.9, compare-validators.mjs.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 7 — Documentation and contracts', bai: '7.3' };

export const deck = { key: 'api-07-3', code: 'API 7.3', title: 'Generating docs, clients and validators', sub: 'One file — for people, for client code, for the server' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Generating docs, typed clients<br>and validators', sub: 'A contract only humans read<br>is half used.' },

  { t: 'One file, three outputs', to: true, giua: true, body: flow([
    { t: 'openapi.yaml', s: 'one source of truth' },
    { t: '/docs', s: 'Redoc page — people', mau: '#7a5195' },
    { t: 'labflow.d.ts', s: 'types — client code', mau: '#b85a2b' },
    { t: 'schema checks', s: 'vs Zod — the server', mau: '#2f7d4f' },
  ]) + `<ul style="margin-top:14px">
<li>Docs the server <b>publishes</b> at a fixed URL</li>
<li>Client mistakes caught at <b>compile time</b> — 4 typical ones, measured</li>
<li>What JSON Schema can and cannot say, compared with Zod</li>
</ul>` },

  { t: 'Docs the server publishes', giua: true, body: two(sql(`// app.js — bài 7.3
const SPEC = readFileSync(new URL('../openapi/openapi.yaml', import.meta.url));
app.get('/openapi.yaml', (req, res) =>
  res.type('application/yaml')
    .set('Cache-Control', 'public, max-age=300').send(SPEC));
app.get('/docs', (req, res) =>
  res.sendFile(new URL('../docs/index.html', import.meta.url).pathname));`, { lang: 'javascript', sm: true }) +
    box('Redoc by default uses a CDN', 'build-docs loads the Redoc script from Redocly’s CDN; offline networks need <code class="i">--inlineBundle</code>.', 'lam'),
    http(`$ npm run api:docs 2>&1 | tail -1
🎉 bundled successfully in: docs/index.html (280 KiB) [⏱ 90ms].

$ curl -sI …/openapi.yaml | grep -iE '^(HTTP|content-type|cache-control)'
HTTP/1.1 200 OK
Content-Type: application/yaml
Cache-Control: public, max-age=300

$ curl -sI …/docs | grep -iE '^(HTTP|content-type|content-length)'
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 286620`, { sm: true, wrap: 'any' }), 'r46') },

  { t: 'Types for the client', body: two(http(`$ npm run api:types 2>&1 | tail -1
🚀 openapi/openapi.yaml → client/labflow.d.ts [76.3ms]
$ wc -l client/labflow.d.ts
     813 client/labflow.d.ts
$ grep -A11 '        Booking: {' client/labflow.d.ts
        Booking: {
            id: string;
            labId: components["schemas"]["LabId"];
            userId: string;
            period: components["schemas"]["Period"];
            purpose: string | null;
            /** @enum {string} */
            status: "PENDING" | "CHECKED_IN" | "CANCELLED";
            …`, { sm: true }) + box('Install gotcha (1 Nov 2026)', 'openapi-typescript 7.13 wants <code class="i">typescript@^5</code>; with TypeScript 7 npm said <b>ERESOLVE</b>.', 'do2'),
    sql(`import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';
const api = createClient<paths>({ baseUrl });
const { data, error, response } = await api.POST('/bookings', {
  headers: auth,
  body: { labId: 'lab_2', period: { start: '…', end: '…' } },
});`, { lang: 'typescript', sm: true }) + http(`$ npx tsc -p . && echo 'tsc: 0 lỗi'
tsc: 0 lỗi
$ node client/book.ts
201 bk_1 PENDING 2027-03-03T06:00:00.000Z /v2/bookings/bk_1
$ node client/book.ts
409 BOOKING_CONFLICT Phòng đã có lượt bk_1 trong khung giờ này`, { sm: true, wrap: 'any' })) },

  { t: 'What the types catch — before anything runs', body: sql(`body: { labID: 'lab_2', period: { … } }          // typo
console.log(data.purpose.length);                 // purpose có thể là null
if (data.status === 'CONFIRMED') …                // không có trạng thái này
await api.GET('/bookings/{id}', {});               // quên tham số id`, { lang: 'typescript', sm: true }) + http(`$ npx tsc -p mistakes
mistakes/book-wrong.ts(8,11): error TS2561: Object literal may only specify known properties, but 'labID' does not exist in type '{ labId: string; … }'. Did you mean to write 'labId'?
mistakes/book-wrong.ts(11,15): error TS18047: 'data.purpose' is possibly 'null'.
mistakes/book-wrong.ts(12,7): error TS2367: This comparison appears to be unintentional because the types '"PENDING" | "CHECKED_IN" | "CANCELLED"' and '"CONFIRMED"' have no overlap.
mistakes/book-wrong.ts(14,33): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ params: { …; path: { id: string; }; … }; } & …'.`, { sm: true, wrap: 'any', title: 'terminal (long types shortened: …)' }) + box('Each one is a real failure', 'A silent 400, a crash on the first booking without a purpose, a branch that never runs, a 404.', 'xanh') },

  { t: 'When the contract changes', body: two(http(`# back-end renames period → slot in the document
$ npx openapi-typescript openapi/rename-period.yaml -o client/labflow.d.ts 2>&1 | tail -1
🚀 openapi/rename-period.yaml → client/labflow.d.ts [77.7ms]

$ npx tsc -p .
client/book.ts(18,62): error TS2339: Property 'period' does not exist on type '{ id: string; labId: string; userId: string; slot: { start: string; end: string; }; … }'.`, { sm: true, wrap: 'any' }),
    box('Caught in the client’s build', 'At the exact line that reads <code class="i">data.period</code> — before any user sees it. Companies regenerate client types in CI.', 'xanh') +
    box('Trap — editing the generated file', '<code class="i">labflow.d.ts</code> says “do not make direct changes”: the next <code class="i">api:types</code> overwrites it. Change the document.', 'do2') +
    box('May the rename ship?', 'No — it is breaking. Lesson 7.4 builds the gate that says so.', 'lam')) },

  { t: 'Validators: the document vs the server’s Zod', giua: true, body: two(http(`$ node openapi/compare-validators.mjs
hợp lệ                   spec: nhận     zod: nhận
gõ sai labID             spec: TỪ CHỐI  zod: TỪ CHỐI
thêm status              spec: TỪ CHỐI  zod: TỪ CHỐI
giờ không múi giờ        spec: TỪ CHỐI  zod: TỪ CHỐI
purpose toàn dấu cách    spec: nhận     zod: TỪ CHỐI
end trước start          spec: nhận     zod: nhận

$ curl -s -X POST …/v2/bookings … end before start | jq -c '{status, code, detail}'
{"status":422,"code":"INVALID_TIME_RANGE","detail":"endAt phải sau startAt"}`, { sm: true, wrap: 'any' }),
    `<table class="t" style="font-size:18px">
<tr><th>Layer</th><th>Checks</th><th>Answer</th></tr>
<tr><td>Shape — document</td><td>types, required, unknown fields, formats</td><td>400</td></tr>
<tr><td>Normalisation — Zod</td><td>trim, NFC, query coercion</td><td>400</td></tr>
<tr><td>Business — handler</td><td>end after start, ≤ 3 active</td><td>422 / 409</td></tr>
</table>` + box('Found by reading, not by tools', '<code class="i">endAt</code> — a v1 field name inside a v2 answer.', 'do2'), 'r64') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Server publishes <code class="i">/docs</code> (Redoc, 280 KiB) and <code class="i">/openapi.yaml</code></li>
<li>813 lines of generated types; tsc caught <b>4 client mistakes</b> and a renamed field</li>
<li>Document and Zod agree on shape, differ on normalisation (“   ”)</li>
<li>Business rules live in the handler (422)</li>
</ul>
${box('Next', 'Lesson 7.4 — design-first: mocks, style rules, a gate for breaking changes.', 'xanh')}` },
]);
