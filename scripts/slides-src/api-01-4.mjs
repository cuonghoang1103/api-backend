/**
 * api-01-4 — API Design · Chapter 1 · Lesson 1.4 "Naming, casing and consistency" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/api-design/s01-tai-nguyen.mjs › api-1-4-dat-ten. Output = chạy thật LabFlow + node naming.mjs (Node 22.23.3).
 * Nguồn: RFC 3339 (ngày giờ), RFC 8259 §6 (số trong JSON), RFC 9110 §11.1 (scheme xác thực không phân biệt hoa thường), developer.x.com Twitter IDs.
 */
import { lamDeck, sql, http, two, box, steps, cards, c, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 1 — Resources and methods', bai: '1.4' };

/* Hai máy chủ, hai múi giờ, một chuỗi giờ. */
const muiGio = () => `<svg viewBox="0 0 1110 210" width="1110" height="210" font-family="Arial">
  <rect x="330" y="10" width="450" height="56" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/>
  <text x="555" y="46" text-anchor="middle" font-size="24" font-family="Menlo,monospace" font-weight="700" fill="#7a3d12">"2026-11-02T08:00:00"</text>
  <path d="M470,70 L250,120" stroke="#404040" stroke-width="3"/><path d="M640,70 L860,120" stroke="#404040" stroke-width="3"/>
  <rect x="20" y="122" width="470" height="80" rx="10" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="255" y="152" text-anchor="middle" font-size="20" font-weight="800" fill="#336791">💻 laptop in Hanoi (UTC+7)</text>
  <text x="255" y="184" text-anchor="middle" font-size="20" font-family="Menlo,monospace" fill="#262626">→ 2026-11-02T01:00:00.000Z</text>
  <rect x="620" y="122" width="470" height="80" rx="10" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/>
  <text x="855" y="152" text-anchor="middle" font-size="20" font-weight="800" fill="#c0392b">☁️ server / Docker (UTC)</text>
  <text x="855" y="184" text-anchor="middle" font-size="20" font-family="Menlo,monospace" fill="#262626">→ 2026-11-02T08:00:00.000Z</text>
</svg>`;

export const deck = { key: 'api-01-4', code: 'API 1.4', title: 'Naming, casing and consistency', sub: 'Fields, case rules, dates, money, ids' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Naming, casing<br>and consistency', sub: 'The small choices — field names, dates, money, ids —<br>that silently break clients.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>One <b>casing</b> rule for URLs, JSON fields and query parameters</li>
<li>What is <b>case-sensitive</b> in a request and what is not — measured on LabFlow</li>
<li>A bug we shipped in lesson 1.3, found by reading the standard</li>
<li><b>Dates</b> with a time zone, <b>money</b> without floats, <b>ids</b> as strings</li>
<li><code class="i">null</code> vs missing vs <code class="i">[]</code>, and enums as words</li>
</ul>` },

  { giua: true, t: 'Everyday example: one student, three spellings', to: true, body: two(`
<table class="t" style="font-size:22px">
<tr><th>List</th><th>Name written as</th></tr>
<tr><td>Attendance</td><td>Nguyễn Văn An</td></tr>
<tr><td>Grades</td><td>NGUYEN VAN AN</td></tr>
<tr><td>Lab bookings</td><td>An Nguyen</td></tr>
</table>`, box('Same person, no match', 'A program cannot join these lists without guessing. APIs have the same problem when one endpoint says <code class="i">labId</code>, another <code class="i">lab_id</code>, a third <code class="i">roomId</code>.', 'do2') +
  box('Rule', 'The same thing has the <b>same name</b>, spelled the <b>same way</b>, in every endpoint.', 'xanh')) },

  { t: 'Pick one casing per place — and never mix', body: `
<table class="t" style="font-size:20px">
<tr><th style="width:200px">Style</th><th style="width:250px">Looks like</th><th>Common in</th><th style="width:220px">LabFlow uses it for</th></tr>
<tr><td>camelCase</td><td><code class="i">startAt</code></td><td>JavaScript / TypeScript APIs</td><td><b>JSON fields</b>, query keys</td></tr>
<tr><td>snake_case</td><td><code class="i">start_at</code></td><td>Python, Ruby, many public APIs</td><td>— (database columns)</td></tr>
<tr><td>kebab-case</td><td><code class="i">lab-rooms</code></td><td>URLs</td><td><b>URL path words</b></td></tr>
<tr><td>UPPER_SNAKE</td><td><code class="i">IN_USE</code></td><td>enum values, error codes</td><td><b>enums</b>, <code class="i">error</code> codes</td></tr>
<tr><td>Header-Case</td><td><code class="i">Content-Type</code></td><td>HTTP headers</td><td>headers (as the standard)</td></tr>
</table>
${box('There is no “correct” casing', 'GitHub’s API uses snake_case; Google’s JSON style guide uses camelCase. What hurts is <b>mixing</b>: <code class="i">startAt</code> next to <code class="i">end_at</code>.', 'lam')}` },

  { giua: true, to: true, t: 'Field names that explain themselves', body: two(`
<ul style="font-size:22px">
<li>ids: <code class="i">labId</code>, <code class="i">userId</code> — the noun + <b>Id</b></li>
<li>instants: <code class="i">startAt</code>, <code class="i">createdAt</code>, <code class="i">cancelledAt</code> — <b>…At</b></li>
<li>booleans: <code class="i">isActive</code>, <code class="i">hasProjector</code> — a yes/no question</li>
<li>lists: plural — <code class="i">devices</code>, <code class="i">tags</code></li>
<li>no abbreviations nobody agreed on: <code class="i">capacity</code>, not <code class="i">cap</code> / <code class="i">cpty</code></li>
<li>units in the name when not obvious: <code class="i">durationMinutes</code></li>
</ul>`, sql(`{
  "id": "bk_1",
  "labId": "lab_1",
  "userId": "usr_1",
  "startAt": "2026-11-02T01:00:00.000Z",
  "endAt": "2026-11-02T03:00:00.000Z",
  "purpose": "SWT301 Lab 3",
  "status": "PENDING",
  "createdAt": "2026-10-31T15:43:26.161Z"
}`, { lang: 'json' }) + `<p class="nho" style="margin:6px 0 0">A real LabFlow booking (lesson 1.3). Every name follows the list on the left.</p>`, 'r46') },

  { t: 'What is case-sensitive? We measured', body: http(`$ curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/Labs
200
$ curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs/
200
$ curl -s -o /dev/null -w '%{http_code}\\n' http://localhost:4000/labs/LAB_1
404
$ curl -s http://localhost:4000/bookings -H 'authorization: Bearer tok_an'
{
  "data": []
}`, { sm: true }) + two(`
<table class="t" style="font-size:19px">
<tr><th>Part</th><th style="width:270px">Case matters?</th></tr>
<tr><td>Path words (<code class="i">/Labs</code>)</td><td>no — Express default</td></tr>
<tr><td>Trailing slash (<code class="i">/labs/</code>)</td><td>ignored — Express default</td></tr>
<tr><td>ids (<code class="i">LAB_1</code>)</td><td><b>yes</b> — it is data</td></tr>
<tr><td>Header <b>names</b> (<code class="i">authorization</code>)</td><td>no — by the standard</td></tr>
<tr><td>Query <b>keys</b></td><td><b>yes</b> — next slide</td></tr>
</table>`, box('Document only one form', 'lowercase, no trailing slash. “It happens to work” is <b>not</b> part of the contract — another framework or a proxy may behave differently.', 'lam'), 'r64') },

  { t: 'Trap: a misspelled filter is silently ignored', body: vsd(http(`$ curl 'http://localhost:4000/labs?Building=Beta'
{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      "building": "Alpha",
      …
    },
    … (lab_2, lab_3)`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px"><code class="i">Building</code> ≠ <code class="i">building</code>. The API ignored it and returned <b>all</b> labs. The app shows Alpha rooms under a “Beta” filter — nobody notices.</p>`,
  http(`$ curl -i 'http://localhost:4000/labs?Building=Beta'
HTTP/1.1 400 Bad Request
…

{
  "error": "UNKNOWN_QUERY_PARAM",
  "message": "Không hỗ trợ tham số: Building"
}`, { sm: true }) + sql(`const unknown = Object.keys(req.query)
  .filter((k) => !['building'].includes(k));
if (unknown.length)
  throw new HttpError(400, 'UNKNOWN_QUERY_PARAM',
    \`Không hỗ trợ tham số: \${unknown.join(', ')}\`);`, { lang: 'javascript', sm: true }), '✗ Before: wrong answer, no error', '✓ After: say what was not understood') },

  { t: 'A bug we shipped in 1.3 — found in the standard', body: two(http(`$ curl -i http://localhost:4000/bookings \\
    -H 'Authorization: bearer tok_an'
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="labflow"
…

{
  "error": "UNAUTHENTICATED",
  "message": "Cần đăng nhập (thiếu hoặc sai token)"
}`, { sm: true }) + `<p style="margin:6px 0 0;font-size:20px">Lowercase <code class="i">bearer</code> → rejected. Some clients and libraries do send it that way.</p>`,
  `<p style="margin:0;font-size:21px">RFC 9110 §11.1: the authentication <b>scheme</b> name is <b>case-insensitive</b>. Our check was <code class="i">scheme === 'Bearer'</code>.</p>` +
  sql(`// auth.js — before
const userId = scheme === 'Bearer'
  ? tokens[token] : undefined;
// after
const userId = scheme?.toLowerCase() === 'bearer'
  ? tokens[token] : undefined;`, { lang: 'javascript', sm: true }) +
  http(`$ curl http://localhost:4000/bookings -H 'Authorization: bearer tok_an'
{
  "data": []
}`, { sm: true }) + box('Lesson', 'Be <b>strict in what you send</b>, accept what the standard allows. When in doubt, read the RFC — it is shorter than you fear.', 'xanh'), 'r46') },

  { t: 'Dates: a time without a zone is a guess', body: `${muiGio()}
${two(http(`$ TZ=Asia/Ho_Chi_Minh node naming.mjs
…
new Date('2026-11-02T08:00:00')              2026-11-02T01:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')        2026-11-02T01:00:00.000Z
new Date('2026-11-02')                       2026-11-02T00:00:00.000Z`, { sm: true, title: 'Hanoi laptop' }) +
  http(`$ TZ=UTC node naming.mjs
…
new Date('2026-11-02T08:00:00')              2026-11-02T08:00:00.000Z
new Date('2026-11-02T08:00:00+07:00')        2026-11-02T01:00:00.000Z
new Date('2026-11-02')                       2026-11-02T00:00:00.000Z`, { sm: true, title: 'UTC server' }),
  `<ul style="font-size:20px;margin:0"><li>No offset → read as <b>local</b> time: <b>7 hours apart</b></li><li>With an offset → both agree</li><li>Date only → read as <b>UTC</b> midnight (a different rule!)</li></ul>`, 'r73')}` },

  { t: 'LabFlow’s date rule', body: two(`
<ol style="font-size:22px">
<li><b>Accept</b> only RFC 3339 / ISO 8601 date-times <b>with an offset</b>: <code class="i">…T08:00:00+07:00</code> or <code class="i">…T01:00:00Z</code></li>
<li><b>Store and return UTC</b> with <code class="i">Z</code>: <code class="i">2026-11-02T01:00:00.000Z</code></li>
<li>The <b>client</b> converts to the user’s local time for display</li>
<li>Date-only values (a birthday, a holiday) stay <code class="i">YYYY-MM-DD</code> — no time, no zone</li>
</ol>`, http(`$ curl -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab_1","startAt":"2026-11-02T08:00:00","endAt":"2026-11-02T10:00:00"}'
{
  "error": "VALIDATION_FAILED",
  "message": "Dữ liệu gửi lên chưa đúng định dạng",
  "details": [
    {
      "field": "startAt",
      "issue": "must be ISO 8601 with timezone"
    },
    …`, { sm: true, wrap: true }) + box('Refuse the guess', 'A 400 today is cheaper than a lecturer arriving at an empty lab at 15:00.', 'xanh'), 'r46') },

  { giua: true, to: true, t: 'Money: never a float', body: two(http(`$ node naming.mjs
…
0.1 + 0.2                                    0.30000000000000004
4.35 * 100                                   434.99999999999994
435 * 3   (whole cents, integers)            1305
…`, { sm: true }) + `<p class="nho" style="margin:6px 0 0">Binary floating point cannot store 0.1 or 4.35 exactly. Integers are exact. (<code class="i">1999</code> cents = 19.99 USD.)</p>`,
  sql(`// Option A — integer in the smallest unit + currency
{ "deposit": { "amount": 150000, "currency": "VND" } }
{ "fee":     { "amount": 1999,   "currency": "USD" } }

// Option B — decimal as a string
{ "fee": { "amount": "19.99", "currency": "USD" } }`, { lang: 'javascript', sm: true }) +
  box('LabFlow (Ch 12 device deposits)', 'Option A. VND has no smaller unit, so <code class="i">amount</code> is whole đồng. Always send the <b>currency</b> — the number alone is ambiguous.', 'lam'), 'r64') },

  { giua: true, to: true, t: 'Ids: strings, not big numbers', body: two(http(`$ node naming.mjs
JSON.parse('{"id": 9007199254740993}').id    9007199254740992
Number.MAX_SAFE_INTEGER                      9007199254740991
…`, { sm: true }) + `
<ul style="font-size:21px;margin-top:8px">
<li>JavaScript numbers are exact only up to <b>2<sup>53</sup> − 1</b>; bigger ids <b>silently change</b></li>
<li>RFC 8259 §6 warns about exactly this</li>
<li>Twitter’s API sends every id twice — <code class="i">id</code> and <code class="i">id_str</code> — and tells clients to read the string</li>
</ul>`, box('LabFlow ids', `<code class="i">"lab_1"</code>, <code class="i">"bk_1"</code>, <code class="i">"dev_3"</code> — always strings:<ul style="margin:6px 0 0"><li>no precision loss, whatever the database uses</li><li>the <b>prefix</b> says what it is: pasting a booking id into a lab URL is an obvious mistake</li><li>clients must treat them as <b>opaque</b> — never parse or do maths on them</li></ul>`, 'xanh') +
  box('Database ids may differ', 'Ch 12 stores UUIDs or numbers in PostgreSQL; the <b>API</b> still exposes strings. The contract is not the table.', 'lam')) },

  { t: 'null, missing, empty — three different answers', body: `
<table class="t lon">
<tr><th style="width:280px">In the JSON</th><th>Means</th><th style="width:330px">LabFlow rule</th></tr>
<tr><td><code class="i">"purpose": null</code></td><td>the field exists, there is <b>no value</b></td><td>use for optional fields</td></tr>
<tr><td>field missing</td><td>unknown, not returned, or old client</td><td>responses: <b>always include</b> declared fields</td></tr>
<tr><td><code class="i">"devices": []</code></td><td>a list with <b>zero</b> items</td><td>lists are <b>never</b> null</td></tr>
<tr><td><code class="i">"note": null</code> in a <b>PATCH</b></td><td>“remove this field” (Merge Patch)</td><td>as in lesson 1.2</td></tr>
</table>
${box('Why care?', 'A front-end that does <code class="i">booking.devices.length</code> crashes on <code class="i">null</code> but not on <code class="i">[]</code>. Predictable shapes = fewer “Cannot read properties of null”.', 'lam')}` },

  { giua: true, t: 'Enums: words, not magic numbers', to: true, body: vsd(sql(`{ "status": 2 }`, { lang: 'json' }) + `<ul style="font-size:22px;margin-top:8px"><li>2 = ? Approved? Cancelled? Depends on a table in someone’s head</li><li>reordering the list changes the meaning of old data</li></ul>`,
  sql(`{ "status": "PENDING" }
// PENDING · APPROVED · CANCELLED
// device: AVAILABLE · IN_USE · MAINTENANCE`, { lang: 'javascript' }) + `<ul style="font-size:22px;margin-top:8px"><li>readable in logs and curl output</li><li>documented as a closed list; adding a value later is a Chapter 4 topic</li></ul>`, '✗ Numbers', '✓ UPPER_SNAKE strings') },

  { t: 'The LabFlow naming guide (one page)', body: `
<table class="t" style="font-size:20px">
<tr><th style="width:250px">Thing</th><th>Rule</th><th style="width:300px">Example</th></tr>
<tr><td>URL path</td><td>plural nouns, lowercase, kebab-case, no trailing slash</td><td><code class="i">/labs/{labId}/devices</code></td></tr>
<tr><td>JSON field, query key</td><td>camelCase, full words</td><td><code class="i">startAt</code>, <code class="i">?labId=</code></td></tr>
<tr><td>Unknown query key</td><td>400 <code class="i">UNKNOWN_QUERY_PARAM</code></td><td><code class="i">?Building=</code> → 400</td></tr>
<tr><td>id</td><td>string with a type prefix, opaque</td><td><code class="i">"bk_1"</code></td></tr>
<tr><td>date-time</td><td>accept with offset, return UTC <code class="i">Z</code></td><td><code class="i">2026-11-02T01:00:00.000Z</code></td></tr>
<tr><td>money</td><td>integer smallest unit + currency</td><td><code class="i">{"amount":150000,"currency":"VND"}</code></td></tr>
<tr><td>enum, error code</td><td>UPPER_SNAKE strings</td><td><code class="i">IN_USE</code>, <code class="i">BOOKING_CONFLICT</code></td></tr>
<tr><td>optional / list</td><td><code class="i">null</code> when empty / <code class="i">[]</code>, never null</td><td><code class="i">"purpose": null</code></td></tr>
</table>
<p class="nho" style="margin:6px 0 0">Put this table in your project README. In a team, it settles arguments before they start.</p>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>One casing per place (camelCase JSON, kebab URLs, UPPER_SNAKE enums) — <b>never mixed</b></li>
<li>ids are <b>case-sensitive data</b>; query keys too — reject unknown ones instead of ignoring them</li>
<li>Follow the standard where it is lenient (<code class="i">bearer</code>), be strict in what you send</li>
<li>Date-times <b>with an offset</b> in, <b>UTC Z</b> out; money as <b>integer + currency</b>; ids as <b>strings</b></li>
<li><code class="i">null</code> ≠ missing ≠ <code class="i">[]</code>; enums are words</li>
</ul>
${box('Next', 'Chapter lab: design and build the LabFlow “device issue reports” resource — then the Chapter 1 quiz.', 'xanh')}` },
]);
