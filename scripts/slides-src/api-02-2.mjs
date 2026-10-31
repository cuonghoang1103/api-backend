/**
 * api-02-2 — API Design · Chapter 2 · Lesson 2.2 "Validating input at the edge" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s02-loi-phan-hoi.mjs › api-2-2-validation. Output = chạy thật LabFlow (Node 22.23.3, Express 5.3.0, Zod 4.6.7).
 */
import { lamDeck, sql, http, two, box, steps, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 2 — Errors, validation and responses', bai: '2.2' };

export const deck = { key: 'api-02-2', code: 'API 2.2', title: 'Validating input at the edge', sub: 'Schemas, strict objects, 415 and 413' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Validating input<br>at the edge', sub: 'Six requests that should never have worked —<br>and one schema per input that stops them.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Attack Chapter 1’s code and watch <b>six bad requests slip through</b></li>
<li>Put every check in its layer: <b>door</b> (415/413) · <b>shape</b> (400) · <b>rules</b> (422/409)</li>
<li>Replace a wall of <code class="i">if</code>s with <b>Zod schemas</b> — every field error at once</li>
<li><b>Strict objects</b> against typos and <b>mass assignment</b></li>
<li>Traps: 30 February, coercion, and changing the contract by accident</li>
</ul>` },

  { t: 'Everyday example: the door of the lab building', to: true, giua: true, body: `
<table class="t lon">
<tr><th>At the door, the guard checks…</th><th style="width:330px">An API checks…</th></tr>
<tr><td>Is it a student card at all? Is the bag small enough?</td><td><b>Media type</b> and <b>size</b> → 415 / 413</td></tr>
<tr><td>Is the form complete, dates real, no extra pages slipped in?</td><td><b>Shape</b> (schema) → 400</td></tr>
<tr><td>Is the room free at that hour? Does the room exist?</td><td><b>Business rules</b> → 409 / 422</td></tr>
</table>
${box('Everything a client sends is a claim', 'Validation turns claims into facts <b>before</b> any business code runs — once, at the door.', 'xanh')}` },

  { t: 'Six requests that worked on Chapter 1’s code', body: two(http(`$ curl -s -X PATCH http://localhost:4000/devices/dev_1 \\
    -H 'Authorization: Bearer tok_lan' \\
    --json '{"name":123,"isAdmin":true}'
{
  "id": "dev_1",
  "labId": "lab_1",
  "name": 123,
  "type": "ROUTER",
  "serialNo": "FTX1840ALBQ",
  "status": "AVAILABLE",
  "isAdmin": true
}`, { sm: true }), `
<table class="t" style="font-size:19px">
<tr><th style="width:40px">#</th><th>What slipped through</th></tr>
<tr><td>1</td><td><code class="i">name</code> became a <b>number</b>; an <code class="i">isAdmin</code> flag nobody designed</td></tr>
<tr><td>2</td><td>PATCH accepted a <b>duplicate serial</b> that POST refuses</td></tr>
<tr><td>3</td><td><code class="i">purpose: {"$gt": ""}</code> — an <b>object</b> (operator-injection shape)</td></tr>
<tr><td>4</td><td><code class="i">text/plain</code> body ⇒ “three fields missing” instead of <b>415</b></td></tr>
<tr><td>5</td><td><b>30 February</b> stored as 2 March</td></tr>
<tr><td>6</td><td>two <code class="i">VALIDATION_FAILED</code> shapes — one without field details</td></tr>
</table>
${box('No genius attacker needed', 'Just <code class="i">if</code>s scattered across handlers, written on different days.', 'do2')}`, 'r46') },

  { t: 'Two of them up close: an object, and 30 February', body: two(http(`$ curl -s -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_2","startAt":"2026-11-03T08:00:00+07:00","endAt":"2026-11-03T10:00:00+07:00","purpose":{"$gt":""},"status":"APPROVED"}'
{
  "id": "bk_1",
  "labId": "lab_2",
  "userId": "usr_1",
  "startAt": "2026-11-03T01:00:00.000Z",
  "endAt": "2026-11-03T03:00:00.000Z",
  "purpose": {
    "$gt": ""
  },
  "status": "PENDING",
  …
}`, { sm: true, wrap: true }), http(`$ curl -s -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"2026-02-30T08:00:00+07:00","endAt":"2026-02-30T10:00:00+07:00"}'
{
  "id": "bk_2",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-03-02T01:00:00.000Z",
  "endAt": "2026-03-02T03:00:00.000Z",
  "purpose": null,
  "status": "PENDING",
  …
}`, { sm: true, wrap: true })) + `<p style="margin:8px 0 0;font-size:21px">Left: an object stored as “text”; <code class="i">status</code> ignored only by luck. Right: the regex checked the <b>shape</b> of the date, then <code class="i">Date</code> silently rolled 30/2 into <b>2 March</b>.</p>` },

  { t: 'Where each check belongs', to: true, giua: true, body: `
<table class="t">
<tr><th>Layer</th><th>Question</th><th>Needs data?</th><th>Answer</th></tr>
<tr><td><b>0 · Door</b></td><td>Is it JSON? Not too big?</td><td>no</td><td><b>415 / 413</b></td></tr>
<tr><td><b>1 · Shape</b> (schema)</td><td>Fields, types, formats, lengths, nothing extra?</td><td>no</td><td><b>400</b> + every field error</td></tr>
<tr><td><b>2 · Business rules</b></td><td>Does it make sense now?</td><td>yes</td><td><b>422 / 409</b></td></tr>
<tr><td><b>3 · Database</b></td><td>Last line of defence</td><td>yes</td><td>UNIQUE, CHECK (Ch 12)</td></tr>
</table>
${two(box('Validate at the edge', 'Layers 0–1 run once, for every request, before any handler. The handler only checks rules that need data.', 'xanh'), box('Client-side checks do not count', 'Anyone can call the API with curl. Front-end checks are for comfort; server checks are for correctness.', 'do2'))}` },

  { t: 'A wall of ifs vs one schema', body: vsd(`<div style="font-size:20px">${sql(`if (typeof labId !== 'string') details.push(…);
if (!ISO.test(startAt ?? '')) details.push(…);
if (!ISO.test(endAt ?? '')) details.push(…);
// purpose? its type? its length?
// unknown fields? nobody checks
// 30 February? the regex says yes`, { lang: 'javascript', sm: true })}</div>
<ul style="font-size:20px;margin-top:8px"><li>each handler invents its own checks</li><li>forgotten cases pass silently</li><li>error shapes drift apart</li></ul>`,
  `<div style="font-size:20px">${sql(`z.strictObject({
  labId: id('lab'),
  startAt: z.iso.datetime({ offset: true }),
  endAt: z.iso.datetime({ offset: true }),
  purpose: z.string().trim().min(1).max(200).optional(),
})`, { lang: 'javascript', sm: true })}</div>
<ul style="font-size:20px;margin-top:8px"><li>reads like the contract</li><li>reports <b>every</b> problem, not the first</li><li>also <b>cleans</b> the value (trim)</li><li>Zod · Joi · Valibot · AJV (JSON Schema) · Spring: Bean Validation</li></ul>`, '✗ hand-written', '✓ schema (Zod 4.6.7)') },

  { t: 'src/schemas.js: the input contract as code', body: sql(`import { z } from 'zod';
const id = (prefix) => z.string().regex(new RegExp(\`^\${prefix}_\\\\d+$\`), \`must look like \${prefix}_1\`);
const instant = z.iso.datetime({ offset: true });   // Z or ±hh:mm required, real calendar dates only

export const BookingCreate = z.strictObject({        // unknown members ⇒ error
  labId: id('lab'), startAt: instant, endAt: instant,
  purpose: z.string().trim().min(1).max(200).optional(),
});
const deviceFields = {
  labId: id('lab'), name: z.string().trim().min(1).max(100), type: z.enum(DEVICE_TYPES),
  serialNo: z.string().regex(/^[A-Z0-9-]{6,20}$/, 'must be 6–20 characters A–Z, 0–9 or -'),
  status: z.enum(DEVICE_STATUSES), note: z.string().trim().max(500).nullable().optional(),
};
export const DeviceCreate = z.strictObject(deviceFields);          // POST
export const DeviceReplace = DeviceCreate;                         // PUT = full replacement
export const DevicePatch = z.strictObject(deviceFields).partial(); // PATCH: all optional
export const LabsQuery = z.strictObject({
  building: z.string().trim().min(1).optional(),
  minCapacity: z.coerce.number().int().min(1).optional(),         // "25" ⇒ 25
});`, { lang: 'javascript', sm: true, hl: [5, 14, 16, 19] }) + `<p style="margin:8px 0 0;font-size:20px">Only <code class="i">note</code> is <code class="i">.nullable()</code>: in a merge patch, <code class="i">null</code> means “remove it” (lesson 1.2) — allowed for nothing else.</p>` },

  { t: 'Strict, strip or loose — and mass assignment', to: true, body: `
<table class="t">
<tr><th>Zod</th><th>Unknown member <code class="i">isAdmin</code></th><th>Use for</th></tr>
<tr><td><code class="i">z.object()</code> (default)</td><td>silently <b>removed</b></td><td>data you do not control (a webhook)</td></tr>
<tr><td><code class="i">z.strictObject()</code></td><td><b>error</b>: unrecognized key</td><td><b>LabFlow writes</b></td></tr>
<tr><td><code class="i">z.looseObject()</code></td><td>kept as is</td><td>almost never for input</td></tr>
</table>
${two(box('Mass assignment', 'The API copies a client-sent <code class="i">role</code> / <code class="i">isAdmin</code> / <code class="i">price</code> into the record. OWASP <b>API3:2023</b> Broken Object Property Level Authorization.', 'do2'), box('The cost of strict', 'A client sending a field the server does not know yet is refused. LabFlow accepts that: a silent typo (<code class="i">"purpse"</code>) loses data unnoticed.', 'lam'))}
${sql(`// Chapter 1 PATCH — the loop that let isAdmin in
for (const [k, v] of Object.entries(req.body ?? {})) d[k] = v;   // copies ANY key the client sends`, { lang: 'javascript' })}` },

  { t: 'src/validate.js: one middleware for every schema', body: sql(`// ['profile', 'color'] ⇒ '#/profile/color'   (RFC 6901: '~' ⇒ '~0', '/' ⇒ '~1')
export const toPointer = (path) =>
  '#' + path.map((p) => '/' + String(p).replaceAll('~', '~0').replaceAll('/', '~1')).join('');

function toErrors(issues, where) {
  return issues.flatMap((i) => {
    const paths = i.code === 'unrecognized_keys' ? i.keys.map((k) => [...i.path, k]) : [i.path];
    const detail = i.code === 'unrecognized_keys' ? 'unknown field' : i.message;
    return paths.map((p) => (where === 'query'
      ? { parameter: String(p[0]), detail } : { pointer: toPointer(p), detail }));
  });
}
export const validate = (where, schema) => (req, res, next) => {
  const r = schema.safeParse(req[where] ?? {});
  if (!r.success) throw new HttpError(400, where === 'query' ? 'INVALID_QUERY' : 'VALIDATION_FAILED',
    \`\${r.error.issues.length} lỗi trong …\`, toErrors(r.error.issues, where));
  req.valid = { ...req.valid, [where]: r.data };   // Express 5: req.query is read-only
  next();
};`, { lang: 'javascript', sm: true, hl: [13, 17] }) + http(`{"threw":"Cannot set property query of #<IncomingMessage> which has only a getter"}`, { sm: true, title: 'measured: assigning req.query in Express 5' }) },

  { t: 'Wire it in: routes read only req.valid; the door goes first', body: two(sql(`.post(validate('body', BookingCreate), (req, res) => {
  const { labId, startAt, endAt, purpose } = req.valid.body;
  // 2) meaning ⇒ 422 · 3) state ⇒ 409 — unchanged
})

// devices.js — rules that need data, AFTER the shape
function checkRules(body, selfId) {
  if (body.labId !== undefined && !labs.some(…))
    throw … 422 UNKNOWN_LAB;
  if (body.serialNo !== undefined && devices.some((d) =>
      d.serialNo === body.serialNo && d.id !== selfId))
    throw … 409 DUPLICATE_SERIAL;
}`, { lang: 'javascript', sm: true }), sql(`// app.js — before express.json()
const JSON_TYPES = ['application/json',
                    'application/merge-patch+json'];
app.use((req, res, next) => {
  if (req.is(JSON_TYPES) === false)
    throw new HttpError(415, …);
  next();
});
app.use(express.json({ type: JSON_TYPES,
                       limit: '10kb' }));`, { lang: 'javascript', sm: true }), 'r64') + `
<table class="t" style="font-size:20px;margin-top:10px">
<tr><th style="width:330px"><code class="i">req.is(types)</code> returns</th><th>when</th><th style="width:330px">LabFlow does</th></tr>
<tr><td>the matching type</td><td>a body of an accepted type</td><td>parse it</td></tr>
<tr><td><code class="i">false</code></td><td>a body of <b>another</b> type</td><td><b>415</b></td></tr>
<tr><td><code class="i">null</code></td><td><b>no body</b> at all (POST …/cancel)</td><td>let it pass</td></tr>
</table>` },

  { t: 'The attacks again: refused at the door, all at once', body: two(http(`$ curl -s -X PATCH http://localhost:4000/devices/dev_1 \\
    -H 'Authorization: Bearer tok_lan' \\
    --json '{"name":123,"isAdmin":true}'
{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/devices/dev_1",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/name",
      "detail": "Invalid input: expected string, received number"
    },
    {
      "pointer": "#/isAdmin",
      "detail": "unknown field"
    }
  ]
}`, { sm: true, wrap: true }), http(`$ curl -i -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    -H 'Content-Type: text/plain' -d '{"labId":"lab_1"}'
HTTP/1.1 415 Unsupported Media Type
Content-Type: application/problem+json; charset=utf-8
…

{
  "type": "https://labflow.example/problems/unsupported-media-type",
  "title": "Kiểu nội dung không được hỗ trợ",
  "status": 415,
  …
}
$ curl -i -X PATCH …/devices/dev_1 … --json '{"serialNo":"FOC1932X0K7"}'
HTTP/1.1 409 Conflict
…
  "code": "DUPLICATE_SERIAL"`, { sm: true, wrap: true })) },

  { t: '30 February — and a contract change you did not plan', body: two(http(`$ curl -s -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"2026-02-30T08:00:00+07:00","endAt":"2026-11-02T10:00+07:00"}'
{
  "type": "https://labflow.example/problems/validation-failed",
  "title": "Dữ liệu gửi lên không hợp lệ",
  "status": 400,
  "detail": "2 lỗi trong body",
  "instance": "/bookings",
  "code": "VALIDATION_FAILED",
  "errors": [
    {
      "pointer": "#/startAt",
      "detail": "Invalid ISO datetime"
    },
    {
      "pointer": "#/endAt",
      "detail": "Invalid ISO datetime"
    }
  ]
}`, { sm: true, wrap: true }), `
<ul style="font-size:22px">
<li><b>startAt</b>: Zod’s date-time pattern knows month lengths and leap years — <b>30/2 refused</b></li>
<li><b>endAt</b>: <code class="i">10:00+07:00</code> has <b>no seconds</b>. Chapter 1’s regex accepted it; Zod’s default does not</li>
</ul>
${box('Tightening validation = breaking change', 'Before any client exists it is free. After release, refusing what you used to accept breaks someone (Chapter 4). Decide early, <b>write it down</b>: LabFlow requires seconds.', 'do2')}`, 'r64') },

  { t: 'Query strings: everything arrives as text', body: two(http(`$ curl -s 'http://localhost:4000/labs?minCapacity=25'
{
  "data": [
    { "id": "lab_1", …, "capacity": 30 },
    { "id": "lab_3", …, "capacity": 40 }
  ]
}
$ curl -s 'http://localhost:4000/labs?minCapacity=abc&Building=Beta'
{
  …
  "code": "INVALID_QUERY",
  "errors": [
    {
      "parameter": "minCapacity",
      "detail": "Invalid input: expected number, received NaN"
    },
    {
      "parameter": "Building",
      "detail": "unknown field"
    }
  ]
}`, { sm: true }), `
<ul style="font-size:22px">
<li><code class="i">z.coerce.number()</code> turns <code class="i">"25"</code> into <b>25</b>; <code class="i">"abc"</code> into <b>NaN</b> ⇒ 400</li>
<li>Strict query: <code class="i">Building</code> (capital B) is refused — replaces the hand-made check of lesson 1.4</li>
<li><code class="i">?minCapacity=10&minCapacity=20</code> ⇒ Express gives an <b>array</b> ⇒ NaN ⇒ 400, no guessing</li>
<li>Errors in the query use <code class="i">parameter</code>, not a JSON Pointer</li>
</ul>`, 'r46') },

  { t: 'Traps: coercion, and using the original anyway', to: true, body: vsd(`<p style="margin:0 0 6px"><b>Measured</b> with Zod 4.6.7:</p>` + sql(`z.coerce.boolean().parse('false')  // true !
z.coerce.number().parse('')         // 0`, { lang: 'javascript' }) + sql(`(req, res) => {
  const b = { ...req.body, id: nextId('bk') };
  // cleaned copy thrown away,
  // unknown fields come back in
}`, { lang: 'javascript' }),
  `<p style="margin:0 0 6px">Right tool, then <b>only</b> the validated copy:</p>` + sql(`z.stringbool().parse('false')      // false
z.coerce.number().int().min(1)      // "" ⇒ refused`, { lang: 'javascript' }) + sql(`(req, res) => {
  const { labId, startAt } = req.valid.body;
  // id, userId, status, createdAt:
  // set by the server, never from the body
}`, { lang: 'javascript' }), '✗ traps', '✓ LabFlow') + box('Rule of thumb', 'Validate → read <b>only</b> <code class="i">req.valid</code> → set server-owned fields yourself. For booleans in a query string: <code class="i">z.stringbool()</code>.', 'xanh') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Where do you validate?”', 'At the edge, in one schema-driven middleware: media type and size, then shape — all field errors as one 400. Rules that need data come after (422/409); the DB keeps constraints.'],
    ['“What is mass assignment?”', 'Copying client-sent fields into a record without an allow-list. Fix: strict schemas, explicit mapping, server-owned fields never from the body.'],
    ['“The front-end validates — why again?”', 'The API is open to anything that speaks HTTP. Client checks are UX; server checks are correctness and security.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Everything the client sends is a <b>claim</b> — check it before business code runs</li>
<li>Order: <b>415/413</b> at the door → <b>400</b> shape (all fields) → <b>422/409</b> rules</li>
<li>One schema per input, one <code class="i">validate()</code> for all; handlers read only <code class="i">req.valid</code></li>
<li><b>Strict objects</b> expose typos and block mass assignment</li>
<li>Schemas catch 30 February; coercion has traps; tightening later is a <b>breaking change</b></li>
</ul>
${box('Next', 'Lesson 2.3 — response shapes: what goes out, and in what wrapper.', 'xanh')}` },
]);
