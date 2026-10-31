/**
 * api-04-2 — API Design · Chapter 4 · Lesson 4.2 "Versioning strategies" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s04-phien-ban.mjs › api-4-2-chien-luoc. Output = chạy thật LabFlow Ch4 (SEED_BOOKINGS=8).
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 4 — Versioning and evolution', bai: '4.2' };

export const deck = { key: 'api-04-2', code: 'API 4.2', title: 'Versioning strategies', sub: 'URL, header, media type, dates — and one router for two versions' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Versioning<br>strategies', sub: 'bookings get period { start, end } —<br>without breaking a single old client.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Four places to put a version — and Stripe’s <b>date</b> versions</li>
<li>LabFlow’s choice: a <b>major version in the URL</b>, used rarely</li>
<li><b>One router</b> for <code class="i">/v1</code> and <code class="i">/v2</code>: versioned schemas in, versioned views out</li>
<li>Measured: same booking, two shapes, one set of rules</li>
<li>Three traps: a version per change, a versioned database, header versions without <code class="i">Vary</code></li>
</ul>` },

  { t: 'Four places to put the version', to: true, giua: true, body: `
<table class="t" style="font-size:20px">
<tr><th>Where</th><th>Example</th><th>For</th><th>Against</th></tr>
<tr><td>URL path</td><td><code class="i">/v2/bookings</code></td><td>visible in logs, links, curl; easy to route and cache</td><td>not “pure” REST; whole API moves at once</td></tr>
<tr><td>Custom header</td><td><code class="i">LabFlow-Version: 2</code><br>GitHub: <code class="i">X-GitHub-Api-Version</code></td><td>stable URLs</td><td>invisible in a link; needs <code class="i">Vary</code></td></tr>
<tr><td>Media type</td><td><code class="i">Accept: application/vnd.labflow.v2+json</code></td><td>exactly what content negotiation means</td><td>hard to test by hand; tools handle it poorly</td></tr>
<tr><td>Query</td><td><code class="i">?version=2</code></td><td>trivial to try</td><td>mixes with filters and cache keys</td></tr>
</table>` },

  { t: 'Date-based versions (Stripe) and LabFlow’s choice', to: true, giua: true, body: two(`
<ul>
<li>Named by <b>date + release</b>: <code class="i">2026-10-28.endive</code></li>
<li>Monthly versions <b>without</b> breaking changes; two <b>major</b> releases a year may break (since <code class="i">2024-09-30.acacia</code>)</li>
<li>Account <b>default version</b>; per request: <code class="i">Stripe-Version</code></li>
<li>Inside (2017 article): newest shape only + backwards <b>version change modules</b></li>
</ul>
<p style="font-size:17px;margin:6px 0 0">Source: docs.stripe.com/api/versioning, read 1 Nov 2026 · stripe.com/blog/api-versioning (2017)</p>`, box('LabFlow', '<b>Major version in the URL</b> (<code class="i">/v1</code>, <code class="i">/v2</code>), changed only for breaking changes, batched. Additive changes go into the current version.', 'xanh') +
  box('Why', 'Students and mobile developers read curl lines and logs — a version they can see is a version they will not forget.', 'lam'), 'r64') },

  { t: 'One router, many versions', to: true, body: two(sql(`// versioning.js
export const inVersion = (v) => (req, res, next) => {
  req.apiVersion = v;
  res.set('LabFlow-Version', String(v));
  next();
};

// app.js — ONE set of routes
const api = Router();
api.use('/labs', labsRouter);
api.use('/bookings', bookingsRouter);
// … devices, issues, me
app.use('/v1', inVersion(1), api);
app.use('/v2', inVersion(2), api);
app.use(LEGACY, fromHeader);   // old paths: v1 or header
app.use(api);`, { lang: 'javascript', sm: true, hl: [3, 13, 14] }), box('One set of routes', 'Bug fixes land once. <code class="i">/v1</code> and <code class="i">/v2</code> only set <code class="i">req.apiVersion</code> (and the response header <code class="i">LabFlow-Version</code>).', 'xanh') +
  box('Two decisions per version', 'Which <b>schema</b> checks the input · which <b>view</b> leaves the server. Nothing else knows the version.', 'lam') +
  box('Old paths', 'No number in the URL ⇒ <code class="i">fromHeader</code>: <code class="i">LabFlow-Version</code> header, default 1.', 'lam'), 'r64') },

  { t: 'Versioned views', to: true, body: sql(`// views.js
export const toBookingV2 = (b) => ({
  id: b.id, labId: b.labId, userId: b.userId,
  period: { start: b.startAt, end: b.endAt },
  purpose: b.purpose ?? null, status: b.status,
  createdAt: b.createdAt, cancelledAt: b.cancelledAt ?? null,
});
export const VIEWS = {
  1: { lab: toLab, device: toDevice, booking: toBooking, issue: toIssue },
  2: { lab: toLab, device: toDevice, booking: toBookingV2, issue: toIssue },
};
export const viewsOf = (req) => VIEWS[req.apiVersion ?? 1];`, { lang: 'javascript', hl: [4, 10] }) + two(box('The record never changes', 'Version the <b>representation</b> at the edge; one model, one set of rules inside.', 'xanh'), box('Every route', '<code class="i">res.json(viewsOf(req).booking(b))</code> instead of <code class="i">toBooking(b)</code> — labs, devices, issues alike.', 'lam')) },

  { t: 'The input edge: v2 body ⇒ internal form, once', body: sql(`// schemas.js
export const BookingCreateV2 = z.strictObject({
  labId: id('lab'),
  period: z.strictObject({ start: instant, end: instant }),
  purpose: text(1, 200).optional(),
});
// validate.js — one schema, OR { 1: …, 2: … } chosen by version
const schema = schemas.safeParse ? schemas : schemas[req.apiVersion ?? 1];

// routes/bookings.js
  .post(validate('body', { 1: BookingCreate, 2: BookingCreateV2 }), (req, res) => {
    const body = req.valid.body;
    const startAt = body.period?.start ?? body.startAt;   // v2 ⇒ internal, ONE place
    const endAt = body.period?.end ?? body.endAt;
    // … every 422/409 rule below is shared by both versions
    res.status(201).location(\`\${req.baseUrl}/\${booking.id}\`).json(viewsOf(req).booking(booking));`, { lang: 'javascript', sm: true, hl: [4, 8, 13, 16] }) + `<p style="margin:8px 0 0;font-size:20px"><code class="i">req.baseUrl</code> keeps <code class="i">Location</code> and <code class="i">Link</code> inside the version the client used — a v2 client never gets a v1 link.</p>` },

  { t: 'Try it: two shapes, one database', body: http(`$ curl -s …/v1/bookings/bk_8 -H 'Authorization: Bearer tok_lan' | jq -c '{id, startAt, endAt}'
{"id":"bk_8","startAt":"2026-11-02T04:00:00.000Z","endAt":"2026-11-02T06:00:00.000Z"}
$ curl -s …/v2/bookings/bk_8 -H 'Authorization: Bearer tok_lan' | jq -c '{id, period}'
{"id":"bk_8","period":{"start":"2026-11-02T04:00:00.000Z","end":"2026-11-02T06:00:00.000Z"}}

$ curl -si -X POST …/v2/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_3","period":{…}}' | grep -E '^(HTTP|Location|LabFlow-Version)'
HTTP/1.1 201 Created
LabFlow-Version: 2
Location: /v2/bookings/bk_9
$ curl -s …/v1/bookings/bk_9 -H 'Authorization: Bearer tok_an' | jq -c '{id, startAt, endAt}'
{"id":"bk_9","startAt":"2027-01-04T01:00:00.000Z","endAt":"2027-01-04T03:00:00.000Z"}

$ curl -s -X POST …/v2/bookings … -H 'Accept-Language: en' --json '{"labId":"lab_3","startAt":…,"endAt":…}' | jq -c '.errors'
[{"pointer":"#/period","detail":"Invalid input: expected object, received undefined"},
 {"pointer":"#/startAt","detail":"unknown field"},{"pointer":"#/endAt","detail":"unknown field"}]`, { wrap: true, sm: true }) + two(box('One database', 'Created through v2, read through v1: the same <b>bk_9</b>.', 'xanh'), box('Own contract', 'A v1 body sent to v2 is refused member by member.', 'lam')) },

  { t: 'Old paths, the header, and the old client', body: two(http(`$ curl -si …/bookings/bk_8 … | grep -E '^(HTTP|LabFlow-Version|Vary)'
HTTP/1.1 200 OK
LabFlow-Version: 1
Vary: LabFlow-Version

$ curl -s …/bookings/bk_8 … -H 'LabFlow-Version: 2' | jq -c '{id, period}'
{"id":"bk_8","period":{"start":"2026-11-02T04:00:00.000Z",…}}

$ curl -s …/bookings/bk_8 … -H 'LabFlow-Version: 3' -H 'Accept-Language: en' | jq -c '{status, code, detail}'
{"status":400,"code":"UNKNOWN_VERSION","detail":"There is no version 3; versions: 1, 2"}

$ curl -s …/v3/bookings … | jq -c '{status, code}'
{"status":404,"code":"ROUTE_NOT_FOUND"}`, { sm: true, wrap: true }), http(`$ node client-v1.mjs
bk_9  BE-102  08:00–10:00  Chờ duyệt
bk_8  AL-305  11:00–13:00  Chờ duyệt
bk_7  AL-201  11:00–13:00  Đã huỷ
tổng số chỗ của 3 phòng: 94
KHÔNG đặt được: 409 BOOKING_CONFLICT`, { sm: true, title: 'the 4.1 client, unchanged' }) + box('Proof of shared rules', '409 because the v2 request above already took that slot — one database, one conflict rule.', 'xanh'), 'r46') },

  { t: 'Traps', to: true, giua: true, body: vsd(sql(`GET /v7/bookings
# a version per change
bookings_v2 table
# a versioned database
routes/v2/*.js
# a copied router: fixes land once
LabFlow-Version: 2  (no Vary)`, { lang: 'http' }),
  sql(`GET /v2/bookings
# breaking changes, batched
one model, one rule set
# versioned schemas in, views out
one router
# a fix lands in every version
Vary: LabFlow-Version`, { lang: 'http' }), '✗ traps', '✓ LabFlow') + `<p style="margin-top:12px;font-size:21px">A cache without <code class="i">Vary</code> serves the v1 body of <code class="i">/bookings/bk_8</code> to a client that asked for v2.</p>` },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“URL or header versioning?”', 'Both work. URL: visible, simple to route and cache. Header/media type: stable URLs, purer HTTP, harder to see. Pick one, apply it everywhere, need it rarely.'],
    ['“Two versions without two codebases?”', 'One domain model and rule set; versioned schemas at the input edge, versioned views at the output edge, chosen once per request.'],
    ['“How does Stripe do it?”', 'Dated versions (2026-10-28.endive), an account default plus a Stripe-Version header, and backwards transforms from the newest shape.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>URL, header, media type, query — LabFlow: <b>major version in the URL</b></li>
<li>New version only for breaking changes; additive ones stay</li>
<li>One router, one model; versioned schemas in, versioned views out</li>
<li>Measured: same booking, two shapes, the same 409</li>
<li>Old paths answer as v1; header versions need <code class="i">Vary</code></li>
</ul>
${box('Next', 'Lesson 4.3 — retiring the old paths: Deprecation, Sunset, 410.', 'xanh')}` },
]);
