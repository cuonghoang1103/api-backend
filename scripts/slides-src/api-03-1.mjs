/**
 * api-03-1 — API Design · Chapter 3 · Lesson 3.1 "Offset pagination and its problems" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s03-danh-sach.mjs › api-3-1-offset. Output = chạy thật LabFlow (SEED_BOOKINGS=200) + PostgreSQL 18.4 (1 triệu dòng).
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 3 — Collections: pagination, filtering, sorting', bai: '3.1' };

export const deck = { key: 'api-03-1', code: 'API 3.1', title: 'Offset pagination and its problems', sub: 'limit, offset, stable order — and three measured problems' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Offset pagination<br>and its problems', sub: 'limit + offset on LabFlow —<br>then duplicates, deep pages and counts, measured.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why a list endpoint must never return <b>everything</b></li>
<li>The offset contract: <b>default, maximum, stable order, Link header</b></li>
<li>Problem 1 — the list moves: a <b>duplicate</b> caught on real data</li>
<li>Problem 2 — deep pages: <b>0.05 → 9 → 78 ms</b> on a million rows</li>
<li>Problem 3 — the total: a full count on every request</li>
</ul>` },

  { t: 'Everyday example: a queue of numbered tickets', to: true, giua: true, body: two(`
<p style="margin-top:0">The canteen calls out “tickets 21 to 40”. While you walk over, ten people at the front leave.</p>
<p>“21 to 40” now means <b>different people</b>: some are called twice, some never. A <b>position</b> is not a <b>person</b>.</p>`,
  box('Offset is a position', '<code class="i">offset=40</code> means “skip the first 40 rows <b>right now</b>”. If rows are added or removed between two requests, the same offset points somewhere else.', 'lam') +
  box('A cursor is a person', 'Lesson 3.2: “continue after <b>this</b> row” — immune to the queue moving.', 'xanh'), 'r46') },

  { t: 'Seeded data: 200 bookings, the same every run', body: sql(`// seed.js — SEED_BOOKINGS=200 npm run dev
export function seedBookings(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const slotIndex = Math.floor((i - 1) / 3);                 // 3 labs in parallel
    const day = Math.floor(slotIndex / 5), slot = slotIndex % 5;  // 5 two-hour slots a day
    const start = Date.UTC(2026, 10, 2) + day * 86400000 + slot * 7200000;
    const created = Date.UTC(2026, 9, 1) + i * 60000;          // one minute apart
    out.push({ id: \`bk_\${i}\`, labId: \`lab_\${((i - 1) % 3) + 1}\`, userId: i % 2 ? 'usr_1' : 'usr_2',
      startAt: …, endAt: …, purpose: PURPOSES[i % 5], status: i % 7 === 0 ? 'CANCELLED' : 'PENDING',
      createdAt: new Date(created).toISOString() });
  }
  return out;
}`, { lang: 'javascript', sm: true }) + `<p style="margin:8px 0 0;font-size:21px">Same ids, times and order on every run ⇒ your outputs match the lesson. <code class="i">db.js</code>: <code class="i">bookings = seedBookings(Number(process.env.SEED_BOOKINGS ?? 0))</code>, and the id counter continues after the seed.</p>` },

  { t: 'The contract: four decisions', to: true, giua: true, body: cards([
    ['Default and maximum', '<code class="i">limit</code> 20 if absent, at most 100. 500 ⇒ <b>400</b>, not a silent cut.'],
    ['A stable order', 'Newest first by <code class="i">createdAt</code>, then the <b>id’s number</b> as tie-breaker (“bk_10” &lt; “bk_9” as text!).'],
    ['Where the next page is', '<code class="i">Link: &lt;…&gt;; rel="next"</code> (RFC 8288) — generic clients can follow it.'],
    ['Metadata next to data', '<code class="i">page: { limit, offset, total }</code> — the room lesson 2.3 left.'],
  ], 2) },

  { t: 'Build it', body: sql(`export const BookingsQuery = z.strictObject({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
export const idNum = (id) => Number(id.slice(id.indexOf('_') + 1));
export const newestFirst = (a, b) => b.createdAt.localeCompare(a.createdAt) || idNum(b.id) - idNum(a.id);

  .get(validate('query', BookingsQuery), (req, res) => {
    const { limit, offset } = req.valid.query;
    const mine = req.user.role === 'LAB_MANAGER' ? bookings : bookings.filter((b) => b.userId === req.user.id);
    const all = [...mine].sort(newestFirst);
    const data = all.slice(offset, offset + limit);
    if (offset + limit < all.length) res.links({ next: \`/bookings?limit=\${limit}&offset=\${offset + limit}\` });
    res.json({ data: data.map(toBooking), page: { limit, offset, total: all.length } });
  })`, { lang: 'javascript', sm: true, hl: [6, 11, 13] }) + `<p style="margin:8px 0 0;font-size:21px">The user filter runs <b>before</b> paging: a student’s <code class="i">total</code> counts only her own bookings.</p>` },

  { t: 'Try it: the first page and the Link header', body: two(http(`$ curl -i 'http://localhost:4000/bookings?limit=3' \\
    -H 'Authorization: Bearer tok_lan'
HTTP/1.1 200 OK
Link: </bookings?limit=3&offset=3>; rel="next"
Content-Type: application/json; charset=utf-8
…

{
  "data": [
    { "id": "bk_200", …, "createdAt": "2026-10-01T03:20:00.000Z", … },
    { "id": "bk_199", …, "createdAt": "2026-10-01T03:19:00.000Z", … },
    { "id": "bk_198", …, "createdAt": "2026-10-01T03:18:00.000Z", … }
  ],
  "page": { "limit": 3, "offset": 0, "total": 200 }
}`, { sm: true, wrap: true, title: 'output re-indented' }), http(`$ curl -s '…/bookings?limit=3&offset=3' … | jq -c '.data[] | [.id, .createdAt]'
["bk_197","2026-10-01T03:17:00.000Z"]
["bk_196","2026-10-01T03:16:00.000Z"]
["bk_195","2026-10-01T03:15:00.000Z"]
$ curl -s '…/bookings?limit=500' …
  "errors": [ { "parameter": "limit",
    "detail": "Quá lớn: mong đợi number <=100" } ]
$ curl -s '…/bookings?limit=2' -H 'Authorization: Bearer tok_bin' | jq -c '{ids: [.data[].id], page}'
{"ids":["bk_200","bk_198"],"page":{"limit":2,"offset":0,"total":100}}`, { sm: true, wrap: true })) + `<p style="margin:6px 0 0;font-size:20px"><b>jq</b> = command-line JSON tool (preinstalled on macOS · <code class="i">apt install jq</code> · <code class="i">winget install jqlang.jq</code>).</p>` },

  { t: 'Problem 1 — the list moves under your feet', body: http(`$ curl -s 'http://localhost:4000/bookings?limit=5' -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'
["bk_200","bk_199","bk_198","bk_197","bk_196"]

$ curl -s -X POST http://localhost:4000/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_1","startAt":"2027-01-04T08:00:00+07:00","endAt":"2027-01-04T10:00:00+07:00"}' | jq -c '{id, createdAt}'
{"id":"bk_201","createdAt":"2026-10-31T19:19:31.992Z"}

$ curl -s 'http://localhost:4000/bookings?limit=5&offset=5' -H 'Authorization: Bearer tok_lan' | jq -c '[.data[].id]'
["bk_196","bk_195","bk_194","bk_193","bk_192"]`, { wrap: true }) + two(box('Duplicate', '<b>bk_196</b> appears on page 1 and page 2: the new booking took position 1 and pushed everyone down.', 'do2'), box('The mirror image', 'A row that disappears (deleted, now filtered out) pulls everything up: one row is <b>never shown</b>. Exports silently miss data.', 'do2')) },

  { t: 'Problem 2 — deep pages: measured on a million rows', to: true, body: two(sql(`EXPLAIN (ANALYZE, COSTS OFF)
SELECT id, created_at FROM bookings
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 900000;`, { lang: 'sql' }) + `
<table class="t" style="font-size:20px;margin-top:10px">
<tr><th>OFFSET</th><th>rows read</th><th>Execution</th></tr>
<tr><td>0</td><td>20</td><td><b>0.053 ms</b></td></tr>
<tr><td>100 000</td><td>100 020</td><td><b>9.037 ms</b></td></tr>
<tr><td>900 000</td><td>900 020</td><td><b>78.316 ms</b></td></tr>
</table>`, http(` Limit (actual time=78.305..78.307 rows=20.00 loops=1)
   ->  Index Only Scan using bookings_newest on bookings
         (actual time=0.006..59.285 rows=900020.00 loops=1)
 Execution Time: 78.316 ms`, { title: 'PostgreSQL 18.4, index (created_at DESC, id DESC)', wrap: true }) + `
<ul style="font-size:21px">
<li>The index finds the <b>start</b> of the order, not position 900 000</li>
<li>It reads 900 020 entries and throws away all but 20</li>
<li>Same page size, cost grows with depth — bots and “last page” clicks pay most</li>
</ul>`, 'r46') + `<div style="margin-top:14px;font-size:19px">${[['OFFSET 0', 0.053], ['OFFSET 100 000', 9.037], ['OFFSET 900 000', 78.316]].map(([n, ms]) => `<div style="display:flex;align-items:center;gap:12px;margin:6px 0"><span style="width:190px">${n}</span><span style="display:inline-block;height:26px;width:${Math.max(4, ms / 78.316 * 600)}px;background:#b85a2b;border-radius:4px"></span><b>${ms} ms</b></div>`).join('')}</div>` },

  { t: 'Problem 3 — the total is not free', to: true, body: two(http(`EXPLAIN (ANALYZE, COSTS OFF) SELECT count(*) FROM bookings;
 Finalize Aggregate (actual time=23.741..25.152 rows=1.00 loops=1)
   ->  Parallel Seq Scan on bookings
         (actual time=0.136..13.437 rows=333333.33 loops=3)
 Execution Time: 25.178 ms`, { wrap: true }), `
<p style="margin-top:0">An exact <code class="i">total</code> = count every matching row on <b>every</b> request: 25 ms here, about <b>500×</b> the first page.</p>
<ul>
<li>send it only on the first page</li>
<li>send an estimate</li>
<li>send only “is there a next page?” — lesson 3.2</li>
</ul>`, 'r46') + box('When offset is fine', 'Small lists that rarely change (the 4 labs, 30 classes) and admin tables that really need “page 7 of 12”. Feeds, exports, sync and big lists ⇒ cursors.', 'xanh') },

  { t: 'Traps', to: true, giua: true, body: vsd(sql(`SELECT * FROM bookings
LIMIT 20 OFFSET 40;     -- no ORDER BY`, { lang: 'sql' }) + `<ul style="margin-top:8px"><li>order is undefined, may differ between calls ⇒ pages overlap at random</li></ul>` + sql(`GET /bookings?limit=1000000`, { lang: 'http' }) + `<ul style="margin-top:8px"><li>no maximum = a free denial of service (OWASP <b>API4:2023</b>)</li></ul>`,
  sql(`ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 40;     -- unique tie-breaker`, { lang: 'sql' }) + `<ul style="margin-top:8px"><li>every call orders rows the same way</li></ul>` + sql(`limit: z.coerce.number().int()
  .min(1).max(100).default(20)`, { lang: 'javascript' }) + `<ul style="margin-top:8px"><li>above 100 ⇒ 400, the client knows</li></ul>`, '✗ traps', '✓ LabFlow') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“How do you paginate?”', 'Offset/limit: simple, page numbers, but duplicates/skips while data changes and slow deep pages. Cursor/keyset: stable and fast at any depth, no jumping. Always a stable order and a maximum.'],
    ['“Why not always return the total?”', 'It costs a full count on every call. Return it only where the UI really needs page numbers.'],
    ['“Why a tie-breaker?”', 'Without a unique key in the order two rows can swap places between calls, and paging repeats or loses them.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Never return an unbounded list: default 20, maximum 100, 400 above it</li>
<li>Stable order with a unique tie-breaker (ids compared as numbers)</li>
<li>Next page in <code class="i">Link</code> and in <code class="i">page</code></li>
<li>Offset breaks while data changes — duplicate <b>bk_196</b> measured</li>
<li>Deep offsets and exact totals cost: 78 ms at 900 000, 25 ms per count</li>
</ul>
${box('Next', 'Lesson 3.2 — cursor pagination: the same deep page in 0.064 ms.', 'xanh')}` },
]);
