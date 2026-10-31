/**
 * api-02-4 — API Design · Chapter 2 · Lesson 2.4 "Errors for bilingual apps" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s02-loi-phan-hoi.mjs › api-2-4-i18n. Output = chạy thật LabFlow (Node 22.23.3, ICU 78.3, Express 5.3.0, Zod 4.6.7).
 * RFC 9110 §8.5 Content-Language, §12.5.4 Accept-Language, §12.5.5 Vary.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 2 — Errors, validation and responses', bai: '2.4' };

export const deck = { key: 'api-02-4', code: 'API 2.4', title: 'Errors for bilingual apps', sub: 'Accept-Language, message catalogues, Vietnamese text' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Errors for<br>bilingual apps', sub: 'Accept-Language, one message catalogue,<br>and Vietnamese text done right.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What is <b>translated</b> — and what <b>never</b> is</li>
<li>Negotiate the language: <code class="i">Accept-Language</code> → <code class="i">Content-Language</code> + <code class="i">Vary</code></li>
<li>Errors carry <b>a code and parameters</b>; sentences are built in one catalogue</li>
<li>Zod speaking Vietnamese — and a trap we wrote ourselves</li>
<li>Vietnamese text: <b>NFC vs NFD</b>, the letter <b>Đ</b>, and sorting</li>
</ul>` },

  { t: 'What is translated, and what never is', to: true, body: `
<table class="t">
<tr><th style="width:360px">Part of the answer</th><th style="width:220px">Translated?</th><th>Why</th></tr>
<tr><td><code class="i">type</code>, <code class="i">code</code></td><td><b>never</b></td><td>programs branch on them</td></tr>
<tr><td>member names, <code class="i">pointer</code>, <code class="i">parameter</code></td><td><b>never</b></td><td>part of the contract</td></tr>
<tr><td>enum values (<code class="i">MAINTENANCE</code>)</td><td><b>never</b></td><td>the app maps them to labels</td></tr>
<tr><td>numbers, dates, money</td><td><b>never formatted</b></td><td>ISO dates + integers; the client formats</td></tr>
<tr><td><code class="i">title</code>, <code class="i">detail</code>, field <code class="i">detail</code>s</td><td><b>yes</b></td><td>they exist for humans</td></tr>
<tr><td>user data (“Phòng Lab IoT”)</td><td>no — it is <b>data</b></td><td>returned as stored</td></tr>
</table>
${box('Like the board at Nội Bài airport', '<b>VN 255 · Gate 12 · BOARDING</b> never change with the language; only the announcement is read in Vietnamese, then English. Codes are the flight number; <code class="i">title</code>/<code class="i">detail</code> are the announcement.', 'xanh')}` },

  { t: 'Two places to translate — LabFlow uses both', to: true, giua: true, body: two(box('1 · In the client, from the code', `
<p><code class="i">BOOKING_CONFLICT</code> → “Phòng đã có người đặt”.</p>
<ul><li>wording matches the app’s screens</li><li>works offline</li><li>changes without a server release</li></ul>
<p><b>Main path</b> for LabFlow’s own apps.</p>`, 'xanh'), box('2 · On the server, from Accept-Language', `
<p><code class="i">title</code> + <code class="i">detail</code> in the requested language.</p>
<ul><li>third-party scripts, CLIs, logs</li><li>an error code the app is too old to know</li><li>anyone without a translation table</li></ul>
<p>What we build in this lesson.</p>`, 'lam')) },

  { t: 'Accept-Language in three minutes', to: true, body: two(sql(`GET /labs/lab_9 HTTP/1.1
Accept-Language: en-US,en;q=0.9,vi;q=0.8`, { lang: 'http' }) + `
<ul style="font-size:22px">
<li>a list of languages, each with an optional weight <code class="i">q</code> (0–1, default 1)</li>
<li>Express: <code class="i">req.acceptsLanguages('vi', 'en')</code> → best match · the first one when the header is absent · <code class="i">false</code> when nothing matches</li>
</ul>`, `
<table class="t" style="font-size:20px">
<tr><th>The server…</th><th>Header</th></tr>
<tr><td>says which language it used</td><td><code class="i">Content-Language: en</code> (RFC 9110 §8.5)</td></tr>
<tr><td>tells caches the body depends on it</td><td><code class="i">Vary: Accept-Language</code> (§12.5.5)</td></tr>
<tr><td>has no match</td><td>falls back to its <b>default</b></td></tr>
</table>
${box('Why not 406?', 'HTTP allows <b>406 Not Acceptable</b>, but a missing translation would turn into a broken request. LabFlow answers in Vietnamese instead.', 'lam')}`, 'r46') + sql(`HTTP/1.1 404 Not Found
Content-Language: en
Vary: Accept-Language`, { lang: 'http' }) },

  { t: 'One catalogue: src/messages.js', body: sql(`// Each code: [title — fixed, detail — a function of this occurrence's parameters]
export const MESSAGES = {
  vi: {
    LAB_NOT_FOUND: ['Không tìm thấy phòng lab', (p) => \`Không có phòng lab \${p.id}\`],
    BOOKING_CONFLICT: ['Trùng lịch phòng', (p) => \`Phòng đã có lượt \${p.other} trong khung giờ này\`],
    PAYLOAD_TOO_LARGE: ['Body quá lớn', (p) => \`Body tối đa \${p.limit} byte, nhận \${p.length} byte\`],
    // … 21 codes
  },
  en: {
    LAB_NOT_FOUND: ['Lab not found', (p) => \`There is no lab \${p.id}\`],
    BOOKING_CONFLICT: ['Booking conflict', (p) => \`The lab already has booking \${p.other} in this time slot\`],
    PAYLOAD_TOO_LARGE: ['Body too large', (p) => \`The body may be at most \${p.limit} bytes, got \${p.length}\`],
    // …
  },
};

// i18n.js
export const pickLang = (req) => req.acceptsLanguages('vi', 'en') || 'vi';
export const zodLocale = (lang) => z.locales[lang]().localeError;   // Zod 4 ships a Vietnamese locale`, { lang: 'javascript', sm: true, hl: [19, 20] }) },

  { t: 'Errors carry a code and parameters — never sentences', body: vsd(sql(`// 2.3: Vietnamese fixed inside the route
throw new HttpError(404, 'LAB_NOT_FOUND',
  \`Không có phòng lab \${labId}\`);`, { lang: 'javascript' }),
  sql(`// 2.4: code + parameters; the sentence is built later
throw new HttpError(404, 'LAB_NOT_FOUND', { id: labId });
throw new HttpError(409, 'BOOKING_CONFLICT',
  { other: clash.id }, { conflictWith: clash.id });`, { lang: 'javascript' }), '✗ one language forever', '✓ any language') + sql(`export function sendProblem(req, res, { status, code, params, ...extra }) {
  const lang = pickLang(req);
  const { title, detail } = texts(lang, code, params);    // built HERE, in the caller's language
  res.status(status).set('Content-Language', lang).vary('Accept-Language')
     .type('application/problem+json')
     .json({ type: typeOf(code), title, status, detail, instance: req.originalUrl, code, ...extra });
}`, { lang: 'javascript', sm: true, hl: [3, 4] }) + `<p style="margin:6px 0 0;font-size:20px">21 <code class="i">throw</code>s changed across the project — mechanical, because lesson 2.1 put every error through one function.</p>` },

  { t: 'Try it: one error, two languages', body: two(http(`$ curl -i http://localhost:4000/labs/lab_9
HTTP/1.1 404 Not Found
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
…

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Không tìm thấy phòng lab",
  "status": 404,
  "detail": "Không có phòng lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}`, { sm: true, wrap: true }), http(`$ curl -i http://localhost:4000/labs/lab_9 -H 'Accept-Language: en'
HTTP/1.1 404 Not Found
Content-Language: en
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 200
…

{
  "type": "https://labflow.example/problems/lab-not-found",
  "title": "Lab not found",
  "status": 404,
  "detail": "There is no lab lab_9",
  "instance": "/labs/lab_9",
  "code": "LAB_NOT_FOUND"
}`, { sm: true, wrap: true })) + `<p style="margin:8px 0 0;font-size:21px">Same <code class="i">type</code>, <code class="i">code</code>, <code class="i">instance</code>. Only the human text changes — and <code class="i">Content-Length</code>: 222 vs 200 bytes, because Vietnamese letters take more bytes in UTF-8.</p>` },

  { t: 'Real browser headers, unknown languages, weights', to: true, body: two(http(`$ curl -s http://localhost:4000/labs/lab_9 \\
    -H 'Accept-Language: en-US,en;q=0.9,vi;q=0.8'
{
  …
  "title": "Lab not found",
  "detail": "There is no lab lab_9",
  …
}
$ curl -s http://localhost:4000/labs/lab_9 \\
    -H 'Accept-Language: vi;q=0.4, en;q=0.6'
{
  …
  "title": "Lab not found",
  …
}`, { sm: true }), http(`$ curl -s -D - -o /dev/null http://localhost:4000/labs/lab_9 \\
    -H 'Accept-Language: fr'
HTTP/1.1 404 Not Found
Content-Language: vi
Vary: Accept-Language
Content-Type: application/problem+json; charset=utf-8
Content-Length: 222
…`, { sm: true }) + `<ul style="font-size:21px;margin-top:8px">
<li><code class="i">en-US</code> matches our <code class="i">en</code></li>
<li>weights win over order: 0.6 &gt; 0.4</li>
<li>French is unknown ⇒ default <b>vi</b>, still announced in <code class="i">Content-Language</code></li></ul>`) + box('A missing language is not an error', 'The French reader still gets <code class="i">type</code> and <code class="i">code</code> — the parts a program needs — and can translate them on its side.', 'xanh') },

  { t: 'Zod in two languages — and a trap we wrote ourselves', body: two(http(`$ curl -s -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{"labId":"lab-1","startAt":"mai 8h","note":"x"}'
{
  …
  "detail": "4 lỗi trong body",
  "errors": [
    { "pointer": "#/labId",
      "detail": "must look like lab_1" },
    { "pointer": "#/startAt",
      "detail": "ngày giờ ISO không hợp lệ" },
    { "pointer": "#/endAt",
      "detail": "Đầu vào không hợp lệ: mong đợi string, nhận được undefined" },
    { "pointer": "#/note",
      "detail": "trường không được hỗ trợ" }
  ]
}`, { sm: true, wrap: true, title: 'before the fix (output re-indented)' }), `
<ul style="font-size:22px">
<li>Zod 4 has <code class="i">z.locales.vi</code>; <code class="i">safeParse(data, { error: zodLocale(lang) })</code> picks it per request</li>
<li>But <code class="i">must look like lab_1</code> stayed English: a <b>custom message</b> from our own schema (2.2) is used as is — it bypasses the locale</li>
</ul>
${sql(`// fix: no custom messages — let the library speak the request's language
const id = (prefix) => z.string().regex(new RegExp(\`^\${prefix}_\\\\d+$\`));`, { lang: 'javascript', sm: true })}
${box('After the fix', '<code class="i">#/labId</code> → “Chuỗi không hợp lệ: phải khớp với mẫu …”. Not perfect, but consistent; the app should map pointers to its own words anyway.', 'xanh')}`, 'r46') },

  { t: 'Vietnamese text: two strings that look the same', to: true, body: two(sql(`const nfc = 'Phòng';         // ò = U+00F2
const nfd = 'Pho\\u0300ng';   // o + U+0300
nfc.length, nfd.length
nfc === nfd
'Phòng Lab IoT'.includes(nfd)
Buffer.byteLength(nfc), Buffer.byteLength(nfd)
'Đ'.normalize('NFD').length`, { lang: 'javascript' }), http(`$ node unicode.mjs
hiện ra: Phòng Phòng
length: 5 6
bằng nhau? false | sau NFC: true
tìm "Phòng" trong tên: false | sau NFC: true
byte UTF-8: 6 7
Đ tách dấu được không? không — Đ là chữ riêng`, { title: 'Node 22 (ICU 78.3)', sm: true, wrap: true })) + `
<table class="t" style="font-size:20px;margin-top:10px">
<tr><th style="width:260px">Form</th><th>“ò” stored as</th><th>Where it comes from</th></tr>
<tr><td><b>NFC</b> (composed)</td><td>one character U+00F2</td><td>most keyboards and input methods</td></tr>
<tr><td><b>NFD</b> (decomposed)</td><td>“o” + U+0300</td><td>text copied from PDFs, file names on macOS</td></tr>
</table>
${box('Why it matters', 'A student pastes “Phòng” from the PDF timetable into LabFlow’s search: <b>nothing found</b>. Lab 2’s “same title” check: <b>duplicate let through</b>. They look identical on screen.', 'do2')}` },

  { t: 'Fix 1: normalise every typed string to NFC at the edge', to: true, body: two(sql(`// schemas.js
const text = (min, max) =>
  z.string().trim().normalize('NFC').min(min).max(max);

purpose: text(1, 200).optional(),
name: text(1, 100),
note: text(0, 500).nullable().optional(),
q: text(1, 50).optional(),`, { lang: 'javascript' }), http(`$ curl -s -X POST http://localhost:4000/bookings \\
    -H 'Authorization: Bearer tok_an' \\
    --json '{…,"purpose":"Phòng lab"}' | node -e "…print purpose, length, isNFC…"
Phòng lab 9 true`, { title: 'purpose sent in NFD — stored in NFC', wrap: true })) + `
<ul style="font-size:22px">
<li>“Phòng lab” is <b>9</b> characters in NFC (it would be 10 in NFD) — the API stored the NFC form</li>
<li>Without this, a search for “Phòng” misses rows, and a uniqueness check (Lab 2) lets duplicates through</li>
<li>Databases compare bytes too — normalise <b>before</b> storing (Chapter 12)</li>
</ul>
${box('Once, at the edge', 'Normalise when text <b>enters</b> the API — in the schema — not in every query and comparison afterwards.', 'xanh')}` },

  { t: 'Fix 2: search like a human — and the letter Đ', body: two(sql(`// "Phòng Lab IoT" ⇒ "phong lab iot"
const fold = (s) => s.normalize('NFD')
  .replace(/\\p{M}/gu, '')     // drop every combining mark
  .replace(/đ/g, 'd').replace(/Đ/g, 'D')   // Đ has NO decomposition
  .toLowerCase();

if (q) data = data.filter((l) => fold(l.name).includes(fold(q)));`, { lang: 'javascript' }), http(`$ curl -s 'http://localhost:4000/labs?q=phong%20lab%20mang'
{
  "data": [
    {
      "id": "lab_1",
      "code": "AL-201",
      "name": "Phòng Lab Mạng máy tính",
      …
    }
  ]
}
$ curl -s 'http://localhost:4000/labs?q=Pho%CC%80ng%20Lab%20IoT'
{
  "data": [
    {
      "id": "lab_2",
      …
      "name": "Phòng Lab IoT",
      …`, { sm: true, wrap: true })) + `<p style="margin:6px 0 0;font-size:20px">No-accent query → found · NFD query (<code class="i">o%CC%80</code>) → found · without the <code class="i">đ/Đ</code> line “Điện tử” never matches “dien tu”.</p>` },

  { t: 'Sorting and formatting are the client’s locale work', to: true, body: two(http(`sort():           An, Bình, Dũng, Yến, Ánh, Đức
Intl.Collator vi: An, Ánh, Bình, Dũng, Đức, Yến`, { title: 'sorting six names (measured)', wrap: true }) + http(`vi-VN: lúc 08:00 Thứ Hai, 2 tháng 11, 2026
en-US: Monday, November 2, 2026 at 8:00 AM
tiền: 1.250.000 ₫ | ₫1,250,000`, { title: 'same instant, same amount', wrap: true }), `
<ul style="font-size:22px">
<li><code class="i">sort()</code> compares code points: “Ánh” and “Đức” land <b>after</b> “Yến”</li>
<li><code class="i">Intl.Collator('vi')</code> sorts like a Vietnamese dictionary</li>
<li>The API sends <code class="i">2026-11-02T01:00:00.000Z</code> and <code class="i">1250000</code> — <b>one unambiguous value</b>; each client formats it with <code class="i">Intl.DateTimeFormat</code> / <code class="i">NumberFormat</code></li>
<li>Databases sort with a <b>collation</b> too (Chapter 12)</li>
</ul>`) + box('The rule', 'The API sends <b>values</b> (ISO instants, integers, enum codes); the client turns them into <b>text</b> for its user’s language, time zone and currency.', 'xanh') },

  { t: 'Traps: translating codes, forgetting Vary', to: true, giua: true, body: vsd(sql(`// Vietnamese users
{ "code": "TRÙNG_LỊCH" }
// English users
{ "code": "BOOKING_CONFLICT" }`, { lang: 'json' }) + `<ul style="margin-top:8px"><li>every client must know both codes</li><li>no <code class="i">Vary</code> ⇒ a CDN serves the first answer to everyone: “sometimes errors are in English”</li></ul>`,
  sql(`HTTP/1.1 409 Conflict
Content-Language: vi
Vary: Accept-Language
…
{ "code": "BOOKING_CONFLICT", "title": "Trùng lịch phòng" }`, { lang: 'http' }) + `<ul style="margin-top:8px"><li>identifiers fixed, text translated</li><li>caches keep one copy per language</li></ul>`, '✗ wrong', '✓ LabFlow') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“How do you localise API errors?”', 'Stable machine codes that clients translate, plus <code class="i">title</code>/<code class="i">detail</code> chosen by <code class="i">Accept-Language</code>; answer with <code class="i">Content-Language</code> and <code class="i">Vary</code>. Never translate codes, field names or enums.'],
    ['“A Vietnamese search sometimes finds nothing”', 'Unicode normalisation: stored text and query in different forms (NFC vs NFD). Normalise to NFC on input; fold accents for search — and handle đ/Đ separately.'],
    ['“Should the API format dates?”', 'No: ISO 8601 in UTC (and integer amounts). The client formats with the user’s locale and time zone.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Translate only text for humans — <code class="i">title</code>, <code class="i">detail</code>; identifiers never change</li>
<li>Apps translate from the code; the server adds text chosen by <code class="i">Accept-Language</code></li>
<li>Answer with <code class="i">Content-Language</code> + <code class="i">Vary: Accept-Language</code>; unknown ⇒ default</li>
<li>Errors carry a code + parameters; sentences are built in <b>one catalogue</b></li>
<li>Vietnamese: NFC at the edge, fold for search (đ by hand), collator for sorting</li>
</ul>
${box('Next', 'Lab 2 — issue reports, version 2: everything from this chapter on one feature.', 'xanh')}` },
]);
