/**
 * api-03-3 — API Design · Chapter 3 · Lesson 3.3 "Filtering and search parameters" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s03-danh-sach.mjs › api-3-3-loc. Output = chạy thật LabFlow (SEED_BOOKINGS=200) + PostgreSQL 18.4.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 3 — Collections: pagination, filtering, sorting', bai: '3.3' };

export const deck = { key: 'api-03-3', code: 'API 3.3', title: 'Filtering and search parameters', sub: 'Named, typed filters — and cursors that belong to their query' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Filtering and<br>search parameters', sub: '“Lab 2, cancelled ones” — validated like any input,<br>and fast because of one index.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Five design rules for filters</li>
<li><code class="i">labId</code>, <code class="i">status</code> (a list), <code class="i">from</code>/<code class="i">to</code> (overlap), <code class="i">q</code> (search)</li>
<li>A cross-field rule with <code class="i">refine</code> — and its two surprises</li>
<li>A cursor that refuses another query: <b>CURSOR_MISMATCH</b></li>
<li>Measured: one index takes a filter from <b>36 ms to 0.24 ms</b></li>
</ul>` },

  { t: 'Five rules for filters', to: true, giua: true, body: cards([
    ['1 · One name per question', 'Named after the field: <code class="i">labId</code>, <code class="i">status</code>. Several parameters combine with <b>AND</b>.'],
    ['2 · One type each', 'Validated like a body. A list is comma-separated: <code class="i">status=PENDING,CANCELLED</code> = either.'],
    ['3 · Ranges say what they mean', '<code class="i">from</code>/<code class="i">to</code> = bookings that <b>overlap</b> <code class="i">[from, to)</code> — “who is in the lab 7–11?”'],
    ['4 · Search is separate', '<code class="i">q</code>, minimum 2 characters, folded comparison of lesson 2.4.'],
    ['5 · Only what you can serve fast', 'Every published filter is a promise forever. No “any field, any operator” on a public API.'],
    ['Access first', 'Students see only their bookings <b>before</b> any filter — a filter never widens the list.'],
  ]) },

  { t: 'The schema', body: sql(`export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).max(200).optional(),
  labId: id('lab').optional(),
  status: z.string()                          // "PENDING,CANCELLED" ⇒ ['PENDING', 'CANCELLED']
    .transform((s) => s.split(','))
    .pipe(z.array(z.enum(BOOKING_STATUSES)).min(1))
    .optional(),
  from: instant.optional(),                   // bookings OVERLAPPING [from, to)
  to: instant.optional(),
  q: text(2, 50).optional(),                  // search in purpose, accents ignored
}).refine((x) => {
  // judge only when BOTH parse — Zod may run refine on invalid values
  const a = Date.parse(x.from ?? ''), b = Date.parse(x.to ?? '');
  return Number.isNaN(a) || Number.isNaN(b) || a < b;
}, { path: ['to'], message: 'TO_AFTER_FROM' });   // a code, translated in i18n.js`, { lang: 'javascript', sm: true, hl: [5, 6, 7, 12, 15] }) + `<p style="margin:6px 0 0;font-size:20px"><code class="i">transform</code> + <code class="i">pipe</code>: split, then check each value. <code class="i">refine</code>: a rule over two fields, its message a <b>code</b> like every error of Chapter 2.</p>` },

  { t: 'The handler: AND, and the overlap test', to: true, giua: true, body: sql(`const { limit, cursor, ...filters } = req.valid.query;
const { labId, status, from, to, q } = filters;
const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) => b.userId === req.user.id);
let rows = mine.filter((b) =>
  (!labId || b.labId === labId)
  && (!status || status.includes(b.status))
  && (!from || Date.parse(b.endAt) > Date.parse(from))    // ends after from …
  && (!to || Date.parse(b.startAt) < Date.parse(to))      // … and starts before to
  && (!q || fold(b.purpose ?? '').includes(fold(q))));`, { lang: 'javascript', hl: [3, 7, 8] }) + two(box('Overlap', 'Two intervals overlap when <b>each starts before the other ends</b> — the same test as booking conflicts (Code Lab 1.3).', 'xanh'), box('Access first', 'Line 3 narrows to “mine” <b>before</b> any filter — <code class="i">?userId=usr_2</code> can never widen a student’s list.', 'lam')) },

  { t: 'Try it: filters, a range, a search', body: http(`$ curl -s '…/bookings?labId=lab_2&status=CANCELLED&limit=3' -H 'Authorization: Bearer tok_lan' | jq -c '.data[] | [.id, .labId, .status]'
["bk_182","lab_2","CANCELLED"]
["bk_161","lab_2","CANCELLED"]
["bk_140","lab_2","CANCELLED"]

$ curl -s '…/bookings?from=2026-11-03T07:00:00%2B07:00&to=2026-11-03T11:00:00%2B07:00&limit=20' … | jq -c '.data[] | [.id, .labId, .startAt, .endAt]'
["bk_21","lab_3","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_20","lab_2","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_19","lab_1","2026-11-03T02:00:00.000Z","2026-11-03T04:00:00.000Z"]
["bk_18","lab_3","2026-11-03T00:00:00.000Z","2026-11-03T02:00:00.000Z"]
… bk_17, bk_16 (also 00:00–02:00 UTC)

$ curl -s '…/bookings?q=clb%20iot&limit=3' … | jq -c '[.data[] | [.id, .purpose]]'
[["bk_199","CLB IoT"],["bk_194","CLB IoT"],["bk_189","CLB IoT"]]`, { wrap: true }) + `<p style="margin:8px 0 0;font-size:20px">07:00–11:00 Hanoi = 00:00–04:00 UTC: the 07:00–09:00 and 09:00–11:00 slots overlap. <code class="i">%2B</code> is <code class="i">+</code> — encoded.</p>` },

  { t: 'Bad filters — and refine’s two surprises', to: true, body: http(`$ curl -s '…/bookings?status=PENDING,DONE&from=2026-11-04T00:00:00Z&to=2026-11-03T00:00:00Z&q=x' … | jq -c '.errors'
[{"parameter":"status","detail":"Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"PENDING\\"|\\"CANCELLED\\""},
 {"parameter":"q","detail":"Quá nhỏ: mong đợi string có >=2 ký tự"}]

$ curl -s '…/bookings?from=2026-11-04T00:00:00Z&to=2026-11-03T00:00:00Z' … -H 'Accept-Language: en' | jq -c '.errors'
[{"parameter":"to","detail":"to must be after from"}]

$ curl -s '…/bookings?from=2026-11-03T07:00:00+07:00&to=2026-11-03T11:00:00%2B07:00' … | jq -c '.errors'
[{"parameter":"from","detail":"Invalid ISO datetime"}]`, { wrap: true, sm: true }) + two(box('Surprise 1', 'After the failed <code class="i">status</code> pipe, Zod <b>skipped</b> the refine: no <code class="i">to</code> error yet. Errors may come in two rounds.', 'lam'), box('Surprise 2 — the raw +', 'A raw <code class="i">+</code> means a <b>space</b>. After that format error Zod <b>did</b> run the refine on the raw value — hence the NaN guard.', 'do2')) },

  { t: 'A cursor belongs to its query', body: two(sql(`// paging.js
export const fingerprint = (filters) =>
  createHash('sha256')
    .update(JSON.stringify(Object.entries(filters)
      .filter(([, v]) => v !== undefined).sort()))
    .digest('hex').slice(0, 8);
// encodeCursor(b, f) ⇒ { createdAt, id, f }
// decodeCursor(s, f) ⇒ 400 CURSOR_MISMATCH if c.f !== f`, { lang: 'javascript', sm: true }) + box('Why', 'A cursor marks a position in <b>one</b> list. With other filters it points into a different list — a page from a random place, <b>no error</b>.', 'do2'), http(`$ curl -s '…/bookings?labId=lab_1&limit=2' … | jq -c '{ids: [.data[].id], next: .page.next}'
{"ids":["bk_199","bk_196"],"next":"eyJjcmVhdGVkQXQiOiIyMD…"}

$ curl -s '…/bookings?labId=lab_1&limit=2&cursor=eyJjcmVhdGVkQXQiOiIyMD…' … | jq -c '[.data[].id]'
["bk_193","bk_190"]

$ curl -i '…/bookings?labId=lab_2&limit=2&cursor=eyJjcmVhdGVkQXQiOiIyMD…' …
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json; charset=utf-8
{
  "type": "https://labflow.example/problems/cursor-mismatch",
  "title": "Con trỏ không khớp bộ lọc",
  "status": 400,
  "detail": "Bộ lọc đã đổi so với lúc lấy con trỏ; hãy tải lại từ trang đầu",
  "code": "CURSOR_MISMATCH"
}`, { sm: true, wrap: true }), 'r46') },

  { t: 'Measured: a filter needs an index', to: true, body: two(sql(`SELECT id, created_at FROM bookings
WHERE lab_id = 'lab_7'
  AND start_at < '2026-11-11 00:00+00'
  AND start_at + interval '2 hours' > '2026-11-10 00:00+00'
ORDER BY created_at DESC, id DESC LIMIT 20;

CREATE INDEX bookings_lab_start
  ON bookings (lab_id, start_at);`, { lang: 'sql', hl: [7, 8] }), `
<table class="t lon">
<tr><th></th><th>plan</th><th>time</th></tr>
<tr><td>without</td><td>Parallel Index Scan on <code class="i">bookings_newest</code>, Rows Removed by Filter: 333 321 ×3</td><td><b>36.183 ms</b></td></tr>
<tr><td>with</td><td>Bitmap Index Scan on <code class="i">bookings_lab_start</code>: 324 candidates, 36 rows sorted</td><td><b>0.242 ms</b></td></tr>
</table>
${box('The real cost of rule 5', 'Every filter you publish needs a plan like this — on a million rows, PostgreSQL 18.4.', 'xanh')}`, 'r46') },

  { t: 'Traps', to: true, giua: true, body: vsd(sql(`GET /bookings?where=purpose LIKE '%a%'
GET /bookings?field=x&op=y&value=z
// injection risk, cannot be indexed,
// every column becomes contract`, { lang: 'http' }) + sql(`GET /bookings?from=…T07:00:00+07:00
// "+" arrives as a space ⇒ 400`, { lang: 'http' }),
  sql(`GET /bookings?labId=lab_2&status=PENDING,CANCELLED
// named, typed, AND-combined, indexed`, { lang: 'http' }) + sql(`GET /bookings?from=…T07:00:00%2B07:00
// or send Z: …T00:00:00Z`, { lang: 'http' }), '✗ traps', '✓ LabFlow') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“How do you design filters?”', 'Named, typed, validated parameters combined with AND; comma lists; explicit range semantics; separate search; an index for each; no free-form query language.'],
    ['“The client changes filters while paging?”', 'The cursor no longer describes a position in that list. Bind it to the query with a fingerprint and answer 400 — the client restarts from page 1.'],
    ['“Can a filter leak data?”', 'Yes, if it runs before access rules. Narrow to what the caller may see first, then apply user filters (BOLA, Chapter 6).'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Named, typed filters combined with AND; lists comma-separated</li>
<li>Say what ranges mean — LabFlow’s <code class="i">from</code>/<code class="i">to</code> mean <b>overlap</b></li>
<li>Cross-field rules: <code class="i">refine</code> with a code, tolerant of invalid fields</li>
<li>Cursor + fingerprint: another query ⇒ <b>400 CURSOR_MISMATCH</b></li>
<li>An index per published filter: <b>36 ms → 0.24 ms</b></li>
</ul>
${box('Next', 'Lesson 3.4 — sort, sparse fields, include, and the N+1 problem.', 'xanh')}` },
]);
