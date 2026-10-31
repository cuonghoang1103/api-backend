/**
 * api-03-4 — API Design · Chapter 3 · Lesson 3.4 "Sorting, sparse fields and includes" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s03-danh-sach.mjs › api-3-4-sap-xep. Output = chạy thật LabFlow (SEED_BOOKINGS=200) + PostgreSQL 18.4.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 3 — Collections: pagination, filtering, sorting', bai: '3.4' };

export const deck = { key: 'api-03-4', code: 'API 3.4', title: 'Sorting, sparse fields and includes', sub: 'sort, fields, include — and the N+1 problem' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Sorting, sparse fields<br>and includes', sub: '“By start time” · “only time and status” ·<br>“the lab name next to each booking”.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><code class="i">sort=startAt</code> / <code class="i">sort=-startAt</code> from an <b>allow-list</b>, always with a tie-breaker</li>
<li>A cursor that stores <b>whatever key</b> the list is sorted by</li>
<li><code class="i">fields=</code>: 31 KB → <b>10.8 KB</b> for 100 bookings</li>
<li><code class="i">include=lab</code> without the <b>N+1</b> problem — measured on PostgreSQL</li>
<li>Two traps: includes all the way down, and sorting by a field you cannot index</li>
</ul>` },

  { t: 'sort: allow-list, direction, tie-breaker', to: true, body: two(sql(`sort: z.enum(['-createdAt', 'createdAt', 'startAt', '-startAt'])
  .default('-createdAt'),`, { lang: 'javascript', sm: true }) + sql(`// paging.js — the comparator comes from the sort value
export function orderBy(sort) {
  const desc = sort.startsWith('-'), key = sort.replace('-', '');
  const dir = desc ? -1 : 1;
  const cmp = (a, b) =>
    dir * (a[key].localeCompare(b[key]) || idNum(a.id) - idNum(b.id));
  return { key, cmp };
}
export const newestFirst = orderBy('-createdAt').cmp;

// cursor = value of the sort key + id + fingerprint (incl. sort)
export const encodeCursor = (b, key, f) =>
  Buffer.from(JSON.stringify({ v: b[key], id: b.id, f })).toString('base64url');`, { lang: 'javascript', sm: true, hl: [6, 12, 13] }), `
<ul style="font-size:21px">
<li><code class="i">-</code> = descending — the JSON:API convention</li>
<li>The id breaks ties <b>in the same direction</b></li>
<li>Why not any field? Each order needs an <b>index</b>, and the cursor must know the key</li>
<li>The fingerprint includes <code class="i">sort</code>: a <code class="i">startAt</code> cursor cannot be replayed on a <code class="i">createdAt</code> list</li>
</ul>
${box('', 'One index per order, e.g. <code class="i">(start_at, id)</code>.', 'lam')}`, 'r64') },

  { t: 'Try it: sort and its cursor', to: true, body: two(http(`$ curl -s '…/bookings?sort=startAt&limit=4' … | jq -c '.data[] | [.id, .startAt]'
["bk_1","2026-11-02T00:00:00.000Z"]
["bk_2","2026-11-02T00:00:00.000Z"]
["bk_3","2026-11-02T00:00:00.000Z"]
["bk_4","2026-11-02T02:00:00.000Z"]

$ curl -s '…/bookings?sort=-startAt&limit=4' … | jq -c '.data[] | [.id, .startAt]'
["bk_200","2026-11-15T02:00:00.000Z"]
["bk_199","2026-11-15T02:00:00.000Z"]
["bk_198","2026-11-15T00:00:00.000Z"]
["bk_197","2026-11-15T00:00:00.000Z"]`, { sm: true, wrap: true }), http(`$ curl -s '…/bookings?sort=startAt&limit=3' … | jq -r '.page.next' | node -e "…base64url decode…"
{"v":"2026-11-02T00:00:00.000Z","id":"bk_3","f":"6fe383fc"}

$ curl -s '…/bookings?sort=purpose' … -H 'Accept-Language: en' | jq -c '.errors'
[{"parameter":"sort","detail":"Invalid option: expected one of \\"-createdAt\\"|\\"createdAt\\"|\\"startAt\\"|\\"-startAt\\""}]`, { sm: true, wrap: true }) + box('Ties', '<b>bk_1, bk_2, bk_3</b> start together (three labs in parallel); the id orders them the same way on every call.', 'xanh') + box('Cursor', '<code class="i">v</code> is now a <b>startAt</b> value — the key of this list, not <code class="i">createdAt</code>.', 'lam'), 'r46') },

  { t: 'fields: send less over the wire', to: true, body: two(sql(`export const BOOKING_FIELDS = ['id', 'labId', 'userId', 'startAt',
  'endAt', 'purpose', 'status', 'createdAt', 'cancelledAt'];
// …
  fields: z.string()
    .transform((s) => s.split(','))
    .pipe(z.array(z.enum(BOOKING_FIELDS)).min(1))
    .optional(),`, { lang: 'javascript', sm: true }) + http(`$ curl -s '…/bookings?fields=startAt,passwordHash' … | jq -c '.errors'
[{"parameter":"fields","detail":"Tùy chọn không hợp lệ: mong đợi một trong các giá trị \\"id\\"|\\"labId\\"|…|\\"cancelledAt\\""}]

$ curl -s -o /dev/null -w '%{size_download} bytes\\n' '…/bookings?limit=100' …
31026 bytes
$ curl -s -o /dev/null -w '%{size_download} bytes\\n' '…/bookings?limit=100&fields=startAt,status' …
10778 bytes`, { sm: true, wrap: true }), http(`$ curl -i '…/bookings?fields=startAt,status&limit=3' …
HTTP/1.1 200 OK
Link: </bookings?fields=startAt%2Cstatus&limit=3&cursor=eyJ2Ijoi…>; rel="next"

{ "data": [
    { "id": "bk_200", "startAt": "2026-11-15T02:00:00.000Z", "status": "PENDING" },
    { "id": "bk_199", "startAt": "2026-11-15T02:00:00.000Z", "status": "PENDING" },
    { "id": "bk_198", "startAt": "2026-11-15T00:00:00.000Z", "status": "PENDING" }
  ],
  "page": { "limit": 3, "next": "eyJ2Ijoi…" } }`, { sm: true, wrap: true, title: 'output re-indented' }) + box('Only removes', 'Validated against the <b>view</b> of 2.3, never the record: <code class="i">id</code> always kept, nothing outside the view ever added.', 'xanh'), 'r46') },

  { t: 'include: related data in the same response', body: two(http(`$ curl -s '…/bookings?include=lab&fields=startAt&limit=2' …
{
  "data": [
    {
      "id": "bk_200",
      "startAt": "2026-11-15T02:00:00.000Z",
      "lab": { "id": "lab_2", "code": "AL-305", "name": "Phòng Lab IoT",
               "building": "Alpha", "capacity": 24 }
    },
    {
      "id": "bk_199",
      "startAt": "2026-11-15T02:00:00.000Z",
      "lab": { "id": "lab_1", "code": "AL-201", "name": "Phòng Lab Mạng máy tính",
               "building": "Alpha", "capacity": 30 }
    }
  ],
  "page": { "limit": 2, "next": "eyJ2Ijoi…" }
}`, { sm: true, wrap: true, title: 'output re-indented' }), sql(`// one Map per page — not a search per row
const labById = include === 'lab'
  ? new Map(labs.map((l) => [l.id, l])) : null;
const data = page.map((b) => {
  let v = toBooking(b);
  if (fields) v = Object.fromEntries(
    ['id', ...fields.filter((x) => x !== 'id')].map((k) => [k, v[k]]));
  if (labById) v.lab = toLab(labById.get(b.labId));
  return v;
});`, { lang: 'javascript', sm: true, hl: [2, 3, 8] }) + box('Without include', '20 bookings ⇒ the client calls <code class="i">GET /labs/{id}</code> 20 more times.', 'lam'), 'r46') },

  { t: 'Measured: the N+1 problem on PostgreSQL', to: true, body: two(http(`--- N+1: 1 query for the page + 20 queries, one per row
Time: 0.397 ms
Time: 0.241 ms
Time: 0.124 ms
Time: 0.085 ms
…  (16 more lines between 0.073 and 0.096 ms)
Time: 0.074 ms
--- 1 query with a JOIN
Time: 0.250 ms`, { title: 'psql \\timing, 20 rows' }) + `
<table class="t lon">
<tr><th></th><th>queries</th><th>total</th></tr>
<tr><td>N+1</td><td>21</td><td><b>2.16 ms</b></td></tr>
<tr><td>JOIN</td><td>1</td><td><b>0.25 ms</b></td></tr>
</table>`, `
<ul>
<li>N+1 = one query for the list, then <b>one per row</b></li>
<li>About <b>9×</b> slower — on <b>localhost</b>; over a network each query also pays a <b>round trip</b></li>
<li>ORMs produce it silently (lazy loading)</li>
<li>Fix: JOIN, <code class="i">WHERE id = ANY(…)</code>, eager loading, DataLoader (GraphQL)</li>
</ul>`, 'r46') },

  { t: 'Traps', to: true, giua: true, body: vsd(sql(`GET /bookings?include=lab.devices.issues.reporter
// a tree nobody can predict or bound

GET /bookings?sort=purpose
// sorts a million rows, no index`, { lang: 'http' }) + sql(`labs.find((l) => l.id === b.labId)
// inside map: one search per row
// = N+1 in memory`, { lang: 'javascript' }),
  sql(`GET /bookings?include=lab
// one level, from an allow-list
// arbitrary graphs ⇒ GraphQL (Chapter 7)

GET /bookings?sort=-startAt
// only orders you have an index for`, { lang: 'http' }) + sql(`const labById =
  new Map(labs.map((l) => [l.id, l]));
// one structure per page`, { lang: 'javascript' }), '✗ traps', '✓ LabFlow') },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“What is the N+1 problem?”', 'One query for a list and one per related item: N+1 round trips. Fix with a JOIN, a batched IN/ANY query, eager loading or a DataLoader.'],
    ['“How do sort and cursors work together?”', 'The cursor stores the current sort key values plus the tie-breaker; the fingerprint includes the sort, so it cannot be replayed under another order.'],
    ['“Why a fields parameter?”', 'Mobile clients on slow networks: 31 KB → 10.8 KB for the same list. It only removes members of the public view.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><code class="i">sort</code> from an allow-list; the id stays the tie-breaker</li>
<li>Cursor <code class="i">{ v, id, f }</code>: current key, id, fingerprint incl. sort</li>
<li><code class="i">fields</code> only removes view members: <b>31 KB → 10.8 KB</b></li>
<li><code class="i">include</code>: one level, allow-listed, one lookup per page</li>
<li>N+1: <b>2.16 ms vs 0.25 ms</b> on localhost — worse over a network</li>
</ul>
${box('Next', 'Lab 3 — the maintenance list: everything in this chapter on <code class="i">GET /issues</code>.', 'xanh')}` },
]);
