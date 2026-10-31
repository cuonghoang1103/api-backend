/**
 * api-03-2 — API Design · Chapter 3 · Lesson 3.2 "Cursor pagination done right" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s03-danh-sach.mjs › api-3-2-cursor. Output = chạy thật LabFlow (SEED_BOOKINGS=200) + PostgreSQL 18.4.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 3 — Collections: pagination, filtering, sorting', bai: '3.2' };

export const deck = { key: 'api-03-2', code: 'API 3.2', title: 'Cursor pagination done right', sub: 'Opaque cursors, keyset, constant-time deep pages' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Cursor pagination<br>done right', sub: '“Continue after this row” —<br>no duplicates, and 78 ms becomes 0.064 ms.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The idea: a <b>bookmark</b>, not a page number</li>
<li>An <b>opaque</b> cursor: base64url of the last item’s position</li>
<li>The duplicate of 3.1 — <b>gone</b>, measured</li>
<li>Keyset on PostgreSQL: depth 900 000 in <b>0.064 ms</b></li>
<li>Offset or cursor: a decision table</li>
</ul>` },

  { t: 'Everyday example: a bookmark', to: true, giua: true, body: two(`
<p style="margin-top:0">You do not write “page 212” on a sticky note — a new edition with an extra chapter would move page 212.</p>
<p>You keep a <b>bookmark</b> at the last page you read. Pages added before it do not push it; pages removed do not pull it.</p>`,
  box('A cursor is that bookmark', 'The <b>position of the last item</b> you received, in the sort order: for “newest first” that is <code class="i">(createdAt, id)</code>. Next request: “items <b>after</b> this position”.', 'xanh') +
  box('Every sort key + the tie-breaker', 'The position must point to exactly one place in the order.', 'lam'), 'r46') },

  { t: 'paging.js: encode, decode, compare', body: sql(`// Cursor = position of the LAST item, as opaque base64url JSON
export const encodeCursor = (b) =>
  Buffer.from(JSON.stringify({ createdAt: b.createdAt, id: b.id })).toString('base64url');

export function decodeCursor(s) {
  let c;
  try { c = JSON.parse(Buffer.from(s, 'base64url').toString('utf8')); } catch { c = null; }
  if (!c || typeof c.createdAt !== 'string'
      || !/^[a-z]+_\\d+$/.test(c.id ?? ''))
    throw new HttpError(400, 'INVALID_CURSOR');   // clients must not build or edit cursors
  return c;
}
// in the handler
let rows = [...mine].sort(newestFirst);
if (cursor) {
  const after = decodeCursor(cursor);
  rows = rows.filter((b) => newestFirst(after, b) < 0);   // only rows AFTER the cursor
}
const data = rows.slice(0, limit);
const next = rows.length > limit ? encodeCursor(data[data.length - 1]) : null;`, { lang: 'javascript', sm: true, hl: [2, 3, 17, 20] }) + `<p style="margin:4px 0 0;font-size:19px">The <b>same comparator</b> sorts and decides what “after” means. No total needed: rows left ⇒ a next page.</p>` },

  { t: 'Try it: the cursor and what is inside', to: true, body: two(http(`$ curl -i 'http://localhost:4000/bookings?limit=2' \\
    -H 'Authorization: Bearer tok_lan'
HTTP/1.1 200 OK
Link: </bookings?limit=2&cursor=eyJjcmVhdGVkQXQiOiIyMD…>; rel="next"
…

{
  "data": [
    { "id": "bk_200", … },
    { "id": "bk_199", … }
  ],
  "page": {
    "limit": 2,
    "next": "eyJjcmVhdGVkQXQiOiIyMD…"
  }
}`, { sm: true, wrap: true, title: 'output re-indented' }), http(`$ echo 'eyJjcmVhdGVkQXQiOiIyMD…' | base64 -d
{"createdAt":"2026-10-01T03:19:00.000Z","id":"bk_199"}`, { sm: true, wrap: true }) + `
<ul style="font-size:21px">
<li>Nothing secret — just the position of <b>bk_199</b></li>
<li>Documented as <b>opaque</b>: once clients parse it, you can never change its format</li>
<li><code class="i">page.next</code> and the <code class="i">Link</code> header carry the same cursor</li>
</ul>
${box('On the slide', 'Long cursors are cut with “…” here; in your terminal they are the full base64url string.', 'lam')}`, 'r64') },

  { t: 'The experiment that broke offset — again', body: http(`$ curl -s '…/bookings?limit=5' -H 'Authorization: Bearer tok_lan' | jq -c '{ids: [.data[].id], next: .page.next}'
{"ids":["bk_200","bk_199","bk_198","bk_197","bk_196"],"next":"eyJjcmVhdGVkQXQiOiIyMD…"}

$ curl -s -X POST …/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_1",…}' | jq -c '{id, createdAt}'
{"id":"bk_201","createdAt":"2026-10-31T19:20:34.129Z"}

$ curl -s '…/bookings?limit=5&cursor=eyJjcmVhdGVkQXQiOiIyMD…' … | jq -c '{ids: [.data[].id], next: .page.next}'
{"ids":["bk_195","bk_194","bk_193","bk_192","bk_191"],"next":"eyJjcmVhdGVkQXQiOiIyMD…"}`, { wrap: true }) + two(box('No duplicate', 'Page 2 starts at <b>bk_195</b>, right after bk_196 — although bk_201 was inserted at the top in between.', 'xanh'), box('Feeds behave', 'Lan sees bk_201 the next time she reloads page 1 — exactly what a feed should do.', 'lam')) },

  { t: 'Bad cursors, the removed offset, the end', to: true, body: two(http(`$ curl -s '…/bookings?limit=5&cursor=hello' … -H 'Accept-Language: en'
{
  "type": "https://labflow.example/problems/invalid-cursor",
  "title": "Invalid page cursor",
  "status": 400,
  "detail": "Send page.next exactly as the server returned it; do not build or edit it",
  "instance": "/bookings?limit=5&cursor=hello",
  "code": "INVALID_CURSOR"
}`, { wrap: true }), http(`$ curl -s '…/bookings?limit=5&offset=5' … | jq -c '.errors'
[{"parameter":"offset","detail":"trường không được hỗ trợ"}]

$ curl -s '…/bookings?limit=100' -H 'Authorization: Bearer tok_bin' | jq -c '{n: (.data | length), next: .page.next}'
{"n":100,"next":null}`, { wrap: true }) + box('A breaking change', 'Clients that used <code class="i">offset</code> (3.1) now get 400. Fine before release; after release keep <code class="i">offset</code> working for a while — Chapter 4.', 'do2')) },

  { t: 'Measured: depth 900 000 by keyset', to: true, body: two(sql(`EXPLAIN (ANALYZE, COSTS OFF)
SELECT id, created_at FROM bookings
WHERE (created_at, id) < ('2025-02-04 17:20:30+00', 100001)
ORDER BY created_at DESC, id DESC
LIMIT 20;`, { lang: 'sql' }) + http(` Limit (actual time=0.043..0.046 rows=20.00 loops=1)
   ->  Index Only Scan using bookings_newest on bookings
         (actual time=0.043..0.044 rows=20.00 loops=1)
         Index Cond: (ROW(created_at, id) < ROW('2025-02-05 00:20:30+07'::timestamp with time zone, 100001))
 Execution Time: 0.064 ms`, { sm: true, wrap: true }), `
<table class="t lon">
<tr><th></th><th>rows read</th><th>time</th></tr>
<tr><td>OFFSET 900 000</td><td>900 020</td><td><b>78.316 ms</b></td></tr>
<tr><td>keyset</td><td><b>20</b></td><td><b>0.064 ms</b></td></tr>
</table>
<ul>
<li>The row comparison lets the index <b>jump</b> to the bookmark</li>
<li>About <b>1 200×</b> faster, the same at any depth</li>
<li>Needs an index matching the order, tie-breaker included</li>
</ul>`, 'r64') },

  { t: 'Offset or cursor?', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:300px"></th><th>Offset (3.1)</th><th>Cursor (3.2)</th></tr>
<tr><td>Data changes while paging</td><td>duplicates, missing rows</td><td><b>stable</b></td></tr>
<tr><td>Deep page cost</td><td>grows (78 ms at 900 000)</td><td><b>constant</b> (0.064 ms)</td></tr>
<tr><td>Jump to page 7</td><td><b>yes</b></td><td>no — next (and prev if you add it)</td></tr>
<tr><td>Total count</td><td>usually, costs a full count</td><td>not needed — <code class="i">next: null</code></td></tr>
<tr><td>Good for</td><td>small admin tables</td><td>feeds, infinite scroll, exports, sync</td></tr>
</table>
<p style="margin-top:10px;font-size:21px">Cursor APIs you will meet: Stripe <code class="i">starting_after</code> · Slack <code class="i">cursor</code> · GitHub GraphQL <code class="i">after</code>.</p>` },

  { t: 'Traps', to: true, giua: true, body: vsd(sql(`{ "createdAt": "2026-10-01T03:16:00.000Z" }
// no id: two bookings at the same moment
// ⇒ "after this time" skips the twin`, { lang: 'json' }) + sql(`const { createdAt } = JSON.parse(atob(next));
// client parses the cursor ⇒ format frozen`, { lang: 'javascript' }),
  sql(`{ "createdAt": "…", "id": "bk_196" }
// every sort key + unique tie-breaker`, { lang: 'json' }) + sql(`fetch(\`/bookings?cursor=\${page.next}\`)
// opaque: copy it back, never read it`, { lang: 'javascript' }), '✗ traps', '✓ LabFlow') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Why are cursors faster?”', 'The database seeks to the position through an index that matches the sort order, instead of walking and discarding every skipped row.'],
    ['“What goes into a cursor?”', 'Every sort key of the last item plus a unique tie-breaker, encoded opaquely — and what you need to reject it for another query (3.3).'],
    ['“Can I jump to page 7?”', 'Not with cursors. If the UI needs page numbers on a small list, offset is fine; otherwise design the UI for next/previous.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A cursor is a bookmark: sort-key values of the last item, with a unique id</li>
<li>“After this position” is immune to inserts and deletes</li>
<li>Keyset with a matching index: <b>78 ms → 0.064 ms</b> on a million rows</li>
<li>Opaque base64url, validated, 400 when bad; <code class="i">next: null</code> at the end</li>
<li>No page numbers — keep offset for small tables that need them</li>
</ul>
${box('Next', 'Lesson 3.3 — filters, and cursors that belong to their query.', 'xanh')}` },
]);
