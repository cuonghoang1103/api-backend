/**
 * node-06-4 — Node.js · Chapter 6 · Lesson 6.4 "Pagination, filtering and sorting" (slide EN, kiểu FU, đợt 4 — 01/11/2026). MỘT deck, HAI tập:
 *   6.4a (node-6-4)   = slide 1–12: quy tắc số không · OFFSET (đo thật 1 000 000 dòng PostgreSQL 17) · đếm-rồi-vứt · con trỏ (đo thật) · bảng tỉ lệ ·
 *                       con bug OFFSET khi chèn (thật) và khi xoá (thật) · tóm tắt
 *   6.4b (node-6-4-2) = slide 13–22: dùng cái nào + khoá phá hoà · con trỏ mờ base64url + limit+1 (API thật) · tổng total: COUNT(*) vs ước lượng (thật) ·
 *                       ORDER BY ${sort} = injection (thật: title;-- ⇒ 1 000 000 dòng, pg_sleep 2 s) · danh sách trắng · cho sắp xếp thì đánh chỉ mục (thật) ·
 *                       website (feed con trỏ, admin OFFSET: đọc mã thật) · quyết theo dữ liệu · bài tập · tự kiểm
 * Nguồn: s06-rest.mjs › nodejs-6-4-phan-trang. Đo THẬT: PostgreSQL 17.11 trong Docker (node-c6pg), bảng notes 1 000 000 dòng, chỉ mục khoá chính + (created_at, id),
 * EXPLAIN ANALYZE, cache nóng, trung vị 7 lần: that/c6/{pg-seed,pg-cost,pg-count,pg-dup,pg-sort,cursor-api,website-pages}.
 * Số khác web (máy khác, không phải lỗi): OFFSET 500000 54,468 ms (web 98,117) · 999980 106,977 ms (web 166,815) · cursor 0,059 / 0,036 ms ·
 * tỉ lệ ~923× / ~2972× (web ~3400× / ~11000×) · COUNT(*) 32,416 ms (web 45,071) · reltuples 0,035 ms (web 0,025).
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-06-4', code: 'NODE 6.4', title: 'Pagination, filtering and sorting', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100");
const L = (ten, a, b) => ngan(ra(ten, a, b));
const gay = (t, n = 100) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(',', n); if (k < 20) k = n; o.push(r.slice(0, k + 1)); r = '    ' + r.slice(k + 1); } o.push(r); return o; }).join('\n');
const so = (ten, re) => Number(ra(ten).split('\n').find((l) => re.test(l)).match(/([\d.]+) ms/)[1]);

/** Biểu đồ thanh: thời gian (ms) đo thật, thang log để thấy được cả 0,036 lẫn 106. */
function thanh() {
  const rows = [
    ['OFFSET 0', so('c6/pg-cost', /^OFFSET 0 /), DO], ['OFFSET 500000', so('c6/pg-cost', /^OFFSET 500000/), DO], ['OFFSET 999980', so('c6/pg-cost', /^OFFSET 999980/), DO],
    ['cursor > 500000', so('c6/pg-cost', /^cursor id > 500000/), NODE], ['cursor > 999980', so('c6/pg-cost', /^cursor id > 999980/), NODE],
  ];
  const w = 1110, h = 300, x0 = 230, wMax = 760;
  const lg = (v) => v / 110;
  let s = `<svg data-k="thanh" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  rows.forEach(([n, v, m], i) => {
    const y = 14 + i * 56, bw = Math.max(6, lg(v) * wMax);
    s += `<text x="${x0 - 14}" y="${y + 30}" text-anchor="end" font-size="21" font-weight="700" fill="#333" font-family="monospace">${n}</text>`;
    s += `<rect x="${x0}" y="${y + 6}" width="${bw}" height="34" rx="6" fill="${m}"/>`;
    s += `<text x="${x0 + bw + 12}" y="${y + 31}" font-size="22" font-weight="800" fill="${m}">${String(v).replace('.', ',')} ms</text>`;
  });
  return s + `<text x="${x0}" y="${h - 4}" font-size="16" fill="#777">linear scale · EXPLAIN ANALYZE · PostgreSQL 17 · 1,000,000 rows · median of 7 · real</text></svg>`;
}

export const slides = lamDeck({ chuong: 'Chapter 6 — REST API design', bai: '6.4' }, [
  /* ───── 6.4a ───── */
  { cover: true, t: 'Pagination, filtering<br>and sorting', sub: 'Every list endpoint starts life returning everything. Then the table grows.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Rule zero: a list endpoint always has a limit</li>
<li><b>OFFSET</b> vs <b>cursor</b> pagination, measured on a real table of <b>1,000,000</b> rows</li>
<li>The OFFSET bug that has nothing to do with speed, reproduced</li>
<li>Part 2: which one to use, the hidden cost of <code class="i">total</code>, and sorting without SQL injection</li>
</ul>
${term(ra('c6/pg-seed'), { title: 'the test table · PostgreSQL 17 in Docker · real', hl: [1] })}
${box('Measured, not estimated', 'Every number in this lesson comes from EXPLAIN ANALYZE on that table, warm cache, median of seven runs.', 'xanh')}` },

  { t: 'Picture a 1,000-page book', to: true, giua: true, body: cards([
    ['📖 "Go to page 500"', 'You count pages from the start, one by one, then read. The further you go, the longer the counting.'],
    ['🔖 A bookmark', 'You open right after the bookmark. Same speed on page 2 or page 999.'],
    ['✂️ Someone adds a page at the front', 'Every page number shifts. Your bookmark still sits on the same sentence.'],
  ], 3) + box('Mapping', 'Counting pages = OFFSET. The bookmark = a cursor. A page added at the front = a new row inserted while you scroll.', 'xanh') + box('Pagination (phân trang)', 'returning a long list in small pieces, one request per piece.', 'lam') },

  { t: 'Rule zero: every list endpoint has a limit', to: true, giua: true, body: js(`// the endpoint that takes the site down at 3 a.m.
router.get('/', async (req, res) => res.json(await db.note.findMany()));`, { sm: false, hl: [2] }) + flow([
    { t: 'table grows', s: '12 rows → 1,000,000', mau: CAM },
    { t: 'load every row', s: 'into RAM', mau: DO },
    { t: 'JSON.stringify', s: 'blocks the loop (2.4)', mau: DO },
    { t: 'everyone frozen', s: 'not slow: stuck', mau: DO },
  ], { h: 160, fs: 21 }) + box('It passes review', 'Correct, works perfectly for a year. That is exactly why it ships.', 'do2') + box('The fix you already have', 'A capped limit from the schema of lesson 6.3: <code class="i">limit: z.coerce.number().max(50).default(10)</code>, then LIMIT it in SQL.', 'xanh') },

  { t: 'OFFSET pagination: the obvious way', to: true, giua: true, body: two(js(`GET /notes?page=3&limit=20

-- page 3 = skip 40 rows, return 20
SELECT * FROM notes ORDER BY id
LIMIT 20 OFFSET 40;`, { sm: false, hl: [5] }), cot(
    box('Simple', 'OFFSET = (page − 1) × limit. One line of maths.', 'xanh'),
    box('Page numbers', 'You get "page 3 of 50,000" and a "jump to page 57" button.', 'xanh'))) +
    bang(['page', 'OFFSET (limit 20)', 'rows the database walks past'], [['1', '0', '0'], ['3', '40', '40'], ['25,001', '500,000', '500,000'], ['last (50,000)', '999,980', '999,980']], { co: 21 }) },

  { t: 'What OFFSET really costs: measured', giua: true, body: term(ra('c6/pg-cost', 1, 3), { title: 'EXPLAIN ANALYZE · 1,000,000 rows · index on the sort column · warm cache · real', hl: [2, 3] }) + js(ma('c6/pg-cost', 23, 25), { sm: true }) +
    box('Read the third column', 'OFFSET 999980 did not skip a million rows cheaply: the database READ them all, in order, then threw away all but the last 20.', 'do2') +
    box('The numbers on this machine', 'Page 1: under a tenth of a millisecond. Page 25,001: about 54 ms. Last page: about 107 ms. Same 20 rows returned each time.', 'lam') },

  { t: 'OFFSET is count-then-throw-away', to: true, giua: true, body: box('OFFSET is not a jump', 'It is a count. The database cannot know where row 999,981 is without walking past the ones before it, in sort order.', 'do2') + flow([
    { t: 'index', s: 'start at row 1', mau: LAM },
    { t: 'read 999,980', s: 'one by one', mau: DO },
    { t: 'throw them away', s: 'nobody sees them', mau: DO },
    { t: 'return 20', s: 'what you asked for', mau: NODE },
  ], { h: 200, fs: 23 }) + two(
    box('Cost grows with N', 'Page N costs O(offset + limit). The slowest queries are the pages nobody reads.', 'do2'),
    box('The database is working hardest', 'for the least valuable traffic: bots and people who pressed "last page".', 'lam')) },

  { t: 'Cursor pagination: ask for what comes AFTER', giua: true, body: js(`GET /notes?limit=20&after=999980

SELECT * FROM notes WHERE id > 999980 ORDER BY id LIMIT 20;`, { sm: false, hl: [3] }) + term(ra('c6/pg-cost', 4, 5), { title: 'same table, same index · real', hl: [1, 2] }) + bang(['', 'OFFSET 999980', 'cursor id > 999980'], [['rows scanned', '1,000,000', '20'], ['time (real)', '106.977 ms', '0.036 ms']], { co: 21 }) +
    box('Not a clever database', 'The index does what an index exists for: jump straight to a key. 20 rows scanned, at any depth. Cursor = O(limit).', 'xanh') },

  { t: 'Side by side', giua: true, body: thanh() + term(ra('c6/pg-cost', 6, 6), { title: 'pg-cost.mjs · real', hl: [1] }) + bang(['', 'OFFSET', 'cursor'], [
    ['rows scanned for the last page', '1,000,000', '20'],
    ['cost', 'O(offset + limit)', 'O(limit)'],
  ], { co: 21 }) },

  { t: 'The OFFSET bug that has nothing to do with speed', giua: true, body: js(`-- page 1, newest first                        -- someone posts a note (id 1000001)
SELECT id FROM notes ORDER BY id DESC LIMIT 3 OFFSET 0;   INSERT INTO notes …;
-- page 2
SELECT id FROM notes ORDER BY id DESC LIMIT 3 OFFSET 3;`, { sm: true }) + term(ra('c6/pg-dup', 1, 4), { title: 'pg-dup.mjs · real', hl: [3, 4] }) +
    two(box('One insert, everything shifts', 'The row at position 3 is now the row the user just saw.', 'do2'), box('The cursor anchors to a ROW', 'Not to a POSITION, so nothing moves under it.', 'xanh')) + js('-- the cursor query of pg-dup.mjs (real)\n' + ma('c6/pg-dup', 10, 10).match(/'(SELECT[^']+)'/)[1] + ';', { sm: true }) },

  { t: 'And a delete makes a row vanish', to: true, giua: true, body: term(ra('c6/pg-dup', 5, 8), { title: 'pg-dup.mjs · real', hl: [3, 4] }) + two(
    box('"Posts disappear while I scroll"', 'A delete shifts rows UP: 999997 is skipped and the user never sees it.', 'do2'),
    box('Never reproduces in testing', 'Test databases have nobody writing while you page. OFFSET is only correct on data that does not change.', 'lam')) + flow([{ t: 'page 1', s: '1000000 · 999999 · 999998', mau: LAM }, { t: 'DELETE 999999', s: 'rows shift up', mau: DO }, { t: 'OFFSET 3', s: '999997 skipped', mau: DO }, { t: 'cursor < 999998', s: '999997 shown', mau: NODE }], { h: 150, fs: 20 }) },

  { t: 'Part 1: summary', to: true, giua: true, body: `<ul>
<li>Every list endpoint has a limit: no limit = one request can freeze the server</li>
<li>OFFSET reads and throws away every skipped row: cost grows with the page number</li>
<li>Cursor asks for rows AFTER a key: same cost at any depth</li>
<li>OFFSET repeats rows on insert, skips rows on delete; a cursor does neither</li>
</ul>${flow([{ t: 'OFFSET', s: 'count + throw away', mau: DO }, { t: 'cursor', s: 'jump to a key', mau: NODE }, { t: 'insert/delete', s: 'OFFSET shifts', mau: CAM }, { t: 'anchor', s: 'cursor stays', mau: NODE }], { h: 130, fs: 21 })}${box('Part 2', 'Which one to use, the cost of a total count, and sorting without SQL injection.', 'lam')}` },

  /* ───── 6.4b ───── */
  { t: 'Which one to use', to: true, giua: true, body: cards([
    ['OFFSET', 'Admin tables, search results, anything that needs page numbers on small or stable data. Simplicity has value.'],
    ['Cursor', 'Feeds, infinite scroll, messages, anything large or written to while people page. Required if data changes.'],
    ['Cursor limits', 'No "jump to page 57", no total: only next and previous. Fine for a feed, not for an admin table.'],
    ['Tie-breakers matter', 'Sorting by createdAt alone breaks when two rows share a timestamp. Sort by (createdAt, id); put both in the cursor.'],
  ], 2) + js(`-- next page of a newest-first feed: compare BOTH columns at once
WHERE (created_at, id) < ($1, $2)  ORDER BY created_at DESC, id DESC  LIMIT $3`, { sm: false }) },

  { t: 'A cursor is an opaque string', giua: true, body: js(ma('c6/cursor-api', 8, 10) + '\n\n' + ma('c6/cursor-api', 29, 36), { sm: true, hl: [1, 5, 9, 11] }) + term(gay(ra('c6/cursor-api', 1, 2), 110), { sm: true, title: 'client · real', hl: [1, 2, 3] }) +
    box('Return it, do not make clients build it', '<code class="i">{ items, nextCursor, hasMore }</code>. Then the cursor\'s shape stays yours to change: add a tie-breaker later without touching any client.', 'xanh') },

  { t: 'Walking the feed with the cursor', to: true, giua: true, body: term(gay(ra('c6/cursor-api', 1, 4), 90), { title: 'client · real', hl: [4, 5, 6] }) + two(
    box('limit + 1', 'Fetch ONE extra row. If it exists, hasMore = true. No COUNT needed.', 'xanh'),
    box('Ids come back as strings', 'The column is bigint: the pg driver returns strings on purpose (lesson 6.2: big ids as strings).', 'lam')) +
    box('Filters combine', '<code class="i">?tag=study</code> is just one more condition next to the cursor, and it still pages correctly.', '') },

  { t: 'The hidden cost: total', to: true, giua: true, body: term(ra('c6/pg-count'), { title: 'pg-count.mjs · real', hl: [1, 2] }) + steps([
    'Drop the total, return <b>hasMore</b> (fetch limit + 1 rows).',
    'Use an <b>estimate</b> for "~1.2 million results" (planner statistics).',
    'Or <b>cache</b> the exact count for a minute.',
  ]) + two(box('Even Google estimates', '"About 12,400,000 results": the exact count often costs more than the page itself.', 'lam'), box('Pure overhead', 'About 32 ms added to EVERY list request, to show a number most users never read.', 'do2')) },

  { t: 'Sorting from the query string: injection', giua: true, body: js(ma('c6/cursor-api', 40, 44), { sm: true, hl: [2] }) + term(ra('c6/cursor-api', 5, 7), { sm: true, title: 'client · real', hl: [2, 3] }) +
    two(box('Why it happens', 'Placeholders work for VALUES, never for identifiers like a column name. So the sort field is glued into the SQL.', 'do2'),
      box('What we just did', '<code class="i">title;--</code> commented out the LIMIT: a million rows. A subquery made the database sleep 2 s.', 'do2')) },

  { t: 'The fix: a whitelist, not escaping', to: true, giua: true, body: js(ma('c6/cursor-api', 47, 51), { sm: true, hl: [1, 4] }) + term(ra('c6/cursor-api', 8, 9), { title: 'client · real', hl: [1, 2] }) +
    box('z.enum is your whitelist', 'Exactly what lesson 6.3 gave you. Anything not on the list never reaches the query.', 'xanh') + box('Escaping is not the fix', 'There is no safe way to escape an arbitrary identifier into ORDER BY. Allow a fixed list of names, nothing else.', 'do2') },

  { t: 'Allow sorting by it? Index it.', giua: true, body: term(ra('c6/pg-sort'), { title: 'pg-sort.mjs · real', hl: [1, 2, 3] }) + cards([
    ['Whitelist sort AND filter fields', 'What clients may sort by is a design decision, not "whatever columns exist".'],
    ['Index what you allow', 'Every sortable column needs an index, or you shipped a full table scan behind a friendly parameter.'],
    ['Stable default order', 'Without ORDER BY the database may return any order, different per call: pages silently lose rows.'],
    ["Text search is not LIKE '%q%'", 'A leading wildcard cannot use a normal index. Past small tables: full-text search or a trigram index.'],
  ], 2) },

  { t: 'This website: two mechanisms, on purpose', to: true, giua: true, body: term(ra('c6/website-pages'), { title: 'cuongthai.com · src (read-only) · real', hl: [2, 4, 7] }) + two(
    box('The feed: cursor', 'An OFFSET feed showed repeated posts whenever someone posted while a visitor scrolled.', 'xanh'),
    box('Admin tables: OFFSET', 'They need page numbers, rows are few, nobody inserts mid-scroll.', 'lam')) },

  { t: 'Offset or cursor: decided by the data', to: true, giua: true, body: steps([
    'Offset is simple and gets slower: <code class="i">LIMIT 20 OFFSET 10000</code> walks ten thousand rows to throw them away.',
    'Offset also skips and repeats rows: an insert while paging shows a row twice. No error; just a wrong list.',
    'A cursor is stable and moves forward: "after this id". Constant cost, inserts do not shift the window.',
    'Always cap the page size: no maximum is one <code class="i">?limit=1000000</code> away from an outage.',
  ]) + bang(['Ask', 'If yes'], [['Is the list written to while people page through it?', '<b>cursor</b>'], ['Is it huge, or scrolled endlessly?', '<b>cursor</b>'], ['Small, mostly static, and people need page numbers?', '<b>OFFSET</b> is fine']], { co: 22 }) },

  { t: 'Exercise: choose, then fix', to: true, giua: true, body: two(`<div style="font-size:27px;line-height:1.55"><b>Offset or cursor?</b><ol><li>admin list of 300 users</li><li>a chat's message history</li><li>search results, page numbers needed</li><li>notifications feed</li></ol><b>Fix it:</b><br><code class="i">ORDER BY \${req.query.sort}</code></div>`,
    `<div data-k="dapan">${bang(['', 'Pick', 'Why'], [['1', 'OFFSET', 'small, page numbers'], ['2', 'cursor', 'written while you scroll'], ['3', 'OFFSET', 'page numbers; mostly static'], ['4', 'cursor', 'constantly appended']], { co: 21 })}${box('The fix', 'z.enum([\'createdAt\', \'title\']) + an index on each; ORDER BY with a tie-breaker id.', 'xanh')}</div>`) + box('Hint', 'Ask two questions: does the screen need page numbers? Is the list written to while people page through it?', 'lam') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why does page 25,001 cost more than page 1 with OFFSET, but not with a cursor?</li>
<li>Why can't you pass the sort column as a query parameter (<code class="i">$1</code>)?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. OFFSET reads and discards every skipped row; a cursor jumps to the key through the index. &nbsp; 2. Placeholders are for values, not identifiers: whitelist the column instead.', 'xanh')}</div>
<ul>
<li>OFFSET for small/static data with page numbers; cursor for feeds</li>
<li>Opaque cursor, (createdAt, id) tie-breaker, limit + 1 for hasMore</li>
<li>COUNT(*) is expensive: hasMore, estimate, or cache</li>
<li>Whitelist sort fields; index what you allow</li>
<li>Every list endpoint has a maximum page size</li>
</ul>
${box('Next', 'Lesson 6.5: the API contract: versions, ETag, idempotency.', 'lam')}` },
]);
