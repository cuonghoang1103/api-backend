/**
 * node-07-5 — Node.js · Chapter 7 · Lesson 7.5 "Indexes, and reading EXPLAIN ANALYZE" (slide EN, kiểu FU, đợt 6 — 01/11/2026). MỘT deck, MỘT tập (node-7-5).
 *   Bảng thử 1.000.000 ghi chú (thật) · truy vấn chưa có chỉ mục (EXPLAIN ANALYZE thật: Parallel Seq Scan, 55,177 ms, 47.692 trang) · đọc từ trong ra ·
 *   khai @@index trong lược đồ + migration (thật) · cùng truy vấn sau (0,084 ms, 23 trang, mất Sort) · thứ tự cột (thật: đảo cột vẫn nhanh với tác giả phổ biến,
 *   nhưng 30,298 ms / 3.844 trang với tác giả hiếm và cũ, so với 0,038 ms / 13 trang) · thuế ghi (thật: 251 / 326 / 611 ms) · năm cách chỉ mục vô dụng (thật) ·
 *   sửa: chỉ mục biểu thức + text_pattern_ops (thật, collation en_US.utf8) · độ chọn lọc thấp: dùng chỉ mục mà CHẬM hơn (thật) · Prisma contains/startsWith
 *   sinh SQL gì (thật) · đếm không miễn phí (thật) · quy trình · chỉ mục không ai dùng · bài tập · tự kiểm · tóm tắt
 * Nguồn: s07-prisma.mjs › nodejs-7-5-chi-muc-va-explain. Output THẬT (PostgreSQL 17.11, bảng 372 MB): that/c7/{big-seed,explain-before,add-index,explain-after,
 * order-matters,order-matters2,write-tax,useless,index-fix,contains-sql,count,idx-usage}.
 * Khác web CÓ THẬT (đã sửa bài web): (1) "LIKE 'bulk%' dùng được B-tree" SAI với collation mặc định en_US.utf8 ⇒ Seq Scan, cần text_pattern_ops;
 * (2) "(createdAt, authorId) không bỏ được Sort" SAI ở đây ⇒ không có Sort; cái giá thật là đi xuyên chỉ mục khi tác giả hiếm. Số khác web (máy khác):
 * 55,177 / 0,084 ms (web 28,618 / 0,129) · thuế ghi +30 % / +144 % (web +14 % / +64 %).
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, cot, tep, gay, gon, P, Q, J, JW, T } from './_c7-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-07-5', code: 'NODE 7.5', title: 'Indexes, and reading EXPLAIN ANALYZE', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const G = (ten, a, b, n = 112) => gay(gon(ra(ten, a, b)), n).replace(/\n+$/, '');
const TT = (ten, a, b, title, o = {}) => T(G(ten, a, b, o.n), title, o);
/** chỉ lấy dòng kết quả (bỏ dòng lệnh dài) */
const KQ = (ten, a, b, n = 112) => gay(ra(ten, a, b).split('\n').filter((l) => !l.startsWith('$ ')).join('\n'), n);
/** chọn dòng (1-based) của output, chỗ bỏ dòng ghi '   …' */
const CHON = (ten, ds, n = 108) => { const L = ra(ten).split('\n'); const o = []; ds.forEach((d, i) => { if (i && d !== ds[i - 1] + 1) o.push('   …'); o.push(L[d - 1].replace(/  \(cost=[^)]*\)/g, '')); }); return gay(o.join('\n'), n); };
const ms = (ten, a) => ra(ten, a, a).match(/Execution Time: ([\d.]+) ms/)[1];

export const slides = lamDeck({ chuong: 'Chapter 7 — PostgreSQL & Prisma', bai: '7.5' }, [
  { cover: true, t: 'Indexes,<br>and reading EXPLAIN ANALYZE', sub: 'The tool that shows you whether you have a good plan or a bad one.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>One everyday query on 1,000,000 notes, before and after an index — read line by line</li>
<li>Why column order matters (measured both ways), and what each index costs on writes</li>
<li>Five ways an index quietly stops working, and the fixes</li>
<li>Counting is not free; finding the indexes nobody uses</li>
</ul>` + TT('c7/big-seed', 1, 10, 'the test table · PostgreSQL 17 in Docker · real', { hl: [4, 9] }) },

  { t: 'Picture a phone book', to: true, giua: true, body: cards([
    ['📖 No index', 'To find everyone in district 7, you read every page. That is a <b>Seq Scan</b>.'],
    ['🗂️ Sorted by (district, name)', 'Jump to district 7: the names are already in order. That is an <b>Index Scan</b> on a composite index.'],
    ['🔁 Sorted by (name, district)', 'District 7 is spread across the whole book. Same columns, wrong order.'],
  ], 3) + box('Index (chỉ mục)', 'a second, sorted copy of some columns (a B-tree) that points back to the rows. PostgreSQL keeps it up to date on every write.', 'lam') +
    box('If you took PostgreSQL lesson 9.1 or DBI202 lesson 8.1', 'You already built B-tree indexes by hand. Here we drive them from Prisma, on a Node API.', 'xanh') },

  { t: 'The query, with no index', to: true, giua: true, body: Q('SELECT id, title FROM "Note" WHERE "authorId" = 7 ORDER BY "createdAt" DESC LIMIT 20;', { sm: false }) +
    T(CHON('c7/explain-before', [4, 5, 6, 10, 11, 12, 16, 17, 18, 19, 23]), 'EXPLAIN (ANALYZE, BUFFERS) · real (cost estimates and worker lines trimmed)', { hl: [1, 2, 6, 9, 10, 11, 13] }) +
    box('"Twenty newest notes of one author"', 'The most ordinary query an API runs. 1,000,000 notes, 100 authors, no index on authorId yet.', 'lam') },

  { t: 'Read it from the inside out', to: true, giua: true, body: bang(['line', 'what it says'], [
    ['<code class="i">Parallel Seq Scan on "Note"</code>', 'read the whole table, with 2 helper processes, to find author 7'],
    ['<code class="i">Rows Removed by Filter: 330048</code>', 'per process (loops=3): about a million rows looked at, then thrown away'],
    ['<code class="i">Sort … top-N heapsort</code>', 'everything that survived must be sorted before LIMIT 20 makes sense'],
    ['<code class="i">Buffers: hit=16167 read=31525</code>', '47,692 pages of 8 KB ≈ the whole 372 MB table; read = from disk, not cache'],
    ['<code class="i">Execution Time: 55.177 ms</code>', 'the honest number: cost is the planner\'s guess, actual time is what happened'],
  ], { co: 20 }) + box('55 ms sounds fine. It is not', 'The work repeats on every request and grows with the table. Fifty requests a second = fifty full-table scans a second, pushing other data out of the cache.', 'do2') },

  { t: 'Declare the index in the schema', to: true, giua: true, body: P('model Note {\n  …\n  @@index([authorId, createdAt(sort: Desc)])\n}', { sm: false, hl: [3] }) +
    TT('c7/add-index', 1, 17, 'npx prisma migrate dev --name index_note_author_created · real', { hl: [10], n: 112 }) +
    box('An index is part of the data model', 'Not a hot-fix typed on the server: it goes out as a migration, reviewed like code (lesson 7.2).', 'lam') },

  { t: 'The same query, after', to: true, giua: true, body: T(gay(ra('c7/explain-after', 4, 12).replace(/  \(cost=[^)]*\)/g, ''), 108), 'EXPLAIN (ANALYZE, BUFFERS) · real (cost estimates trimmed)', { hl: [3, 4, 9], sm: false }) +
    cards([
      ['⏱️ 55.177 ms ⇒ 0.084 ms', `about ${Math.round(55.177 / 0.084)} times faster`],
      ['📄 47,692 pages ⇒ 23', 'and all 23 from cache (hit)'],
      ['🧹 the Sort is gone', 'rows leave the index already in order'],
    ], 3) },

  { t: 'Column order: equality first, then the sort', to: true, giua: true, body: two(
    box('(authorId, createdAt DESC)', 'Inside each author, notes are already newest-first: jump to author 7, read 20, stop.', 'xanh'),
    box('(createdAt DESC, authorId)', 'Newest-first across <b>all</b> authors: walk the index and skip everyone who is not author 7.', 'cam')) +
    TT('c7/order-matters', 2, 3, 'reversed index, author 7 (1% of rows, active) · real', { sm: false }) +
    box('A surprise worth measuring', 'The reversed index also has no Sort step, and for author 7 it is fast. Many tutorials (and this lesson\'s web text, before it was fixed) say otherwise. So where is the catch? Next slide.', 'cam') },

  { t: 'Where the reversed index collapses', to: true, giua: true, body: T(CHON('c7/order-matters2', [3, 4, 6]), '(authorId, createdAt DESC) · author 101: 20 notes, a year old · real', { sm: false }) +
    T(CHON('c7/order-matters2', [9, 10, 12]), '(createdAt DESC, authorId) · same author · real', { sm: false }) +
    box('So the rule holds — for a reason the plan shows you', 'Columns compared with <b>=</b> first, then the column you ORDER BY or compare with &lt; / &gt;. Reversed, the index walks everyone newer than the author\'s notes: 13 pages vs 3,844 pages, 0.038 ms vs 30.298 ms.', 'lam') },

  { t: 'Indexes are not free: the write tax', to: true, giua: true, body: TT('c7/write-tax', 1, 4, 'node write-tax.mjs · INSERT 50,000 rows, median of 5 · real', { hl: [3, 4], sm: false }) + two(
    box('Every index is a second structure', 'Maintained on every INSERT, UPDATE and DELETE. It costs disk too: indexes on this table went from 73 MB to 103 MB for one useful index.', 'cam'),
    box('Three "just in case" indexes', 'Bought nothing for reads here, and made writes much slower than the useful set.', 'do2')) +
    box('"Index every column in a WHERE" is bad advice', 'Index the slow queries you really have, prove the plan changed with EXPLAIN ANALYZE, drop the ones nobody uses.', 'lam') },

  { t: 'Five ways an index quietly stops working', to: true, giua: true, body: bang(['WHERE …', 'plan', 'time'], [
    ['<code class="i">slug = \'bulk-4242\'</code>', 'Index Scan', `${ms('c7/useless', 3)} ms`],
    ['<code class="i">lower(slug) = \'bulk-4242\'</code>', 'Parallel Seq Scan', `${ms('c7/useless', 6)} ms`],
    ['<code class="i">slug LIKE \'%4242\'</code>', 'Parallel Seq Scan', `${ms('c7/useless', 9)} ms`],
    ['<code class="i">slug LIKE \'bulk-4242%\'</code>', 'Parallel Seq Scan', `${ms('c7/useless', 12)} ms`],
    ['<code class="i">"authorId" = 7.0</code> (a numeric)', 'Parallel Seq Scan', `${ms('c7/useless', 18)} ms`],
    ['<code class="i">title = \'Note number 4242\'</code>', 'Parallel Seq Scan (no index on title)', `${ms('c7/useless', 15)} ms`],
  ], { co: 21, hl: [0] }) + box('Same table, same indexes, EXPLAIN ANALYZE · real', 'A function around the column, a leading %, a type that forces a cast — and a surprise: even the prefix LIKE missed the index.', 'cam') },

  { t: 'Why the prefix LIKE missed, and two fixes', to: true, giua: true, body: Q('CREATE INDEX note_slug_pattern_idx ON "Note" (slug text_pattern_ops);\nCREATE INDEX note_slug_lower_idx ON "Note" (lower(slug));') +
    T(KQ('c7/index-fix', 1, 16).split('\n').filter((l) => l.trim() && !/^\(1 row\)$|^-+$|datcollate/.test(l.trim())).join('\n'), 'database collation, then the two queries again · real', { hl: [1, 2, 3, 5, 6] }) + two(
    box('Collation (bảng so sánh chữ)', 'The default <code class="i">en_US.utf8</code> sorts text by language rules, so a normal B-tree cannot serve LIKE \'abc%\'. <code class="i">text_pattern_ops</code> (or a "C" collation) can.', 'lam'),
    box('A function needs its own index', 'Index <code class="i">lower(slug)</code> itself. Prisma cannot declare it: hand-edit a migration made with --create-only.', 'cam')) },

  { t: 'Low selectivity: the index made it slower', to: true, giua: true, body: TT('c7/useless', 19, 25, '40% of notes are pinned · with an index on pinned, then forcing a plain scan · real', { hl: [4, 7], n: 112 }) + two(
    box('Selectivity (độ chọn lọc)', 'how few rows a condition keeps. pinned = true keeps 40%: jumping through an index for 400,000 rows costs more than reading the table straight.', 'lam'),
    box('Here the planner used it anyway', '281.3 ms with the index vs 213.1 ms without. Low-selectivity indexes are often ignored — and when they are not, they can hurt.', 'do2')) },

  { t: 'What Prisma\'s contains and startsWith become', to: true, giua: true, body: TT('c7/contains-sql', 2, 3, 'query log of node contains-sql.mjs · real (second run)', { n: 112 }) + two(
    box('contains ⇒ ILIKE \'%…%\'', 'A leading % plus case-insensitive: a sequential scan on a big table. Fine for 40 demo notes, wrong for a search box over a million.', 'cam'),
    box('The real answers', 'PostgreSQL full-text search or trigram indexes (PostgreSQL lessons 13.3, 13.4), or a search engine — not a bigger server.', 'xanh')) +
    box('Note the extras', 'Prisma added ORDER BY "id" and OFFSET to a findMany with take: read the generated SQL, do not guess it.', 'lam') },

  { t: 'Counting is not free', to: true, giua: true, body: Q('SELECT count(*) FROM "Note";   -- vs\nSELECT reltuples::bigint AS approx FROM pg_class WHERE relname = \'Note\';') + T(KQ('c7/count', 1, 10), 'EXPLAIN ANALYZE of both, then the estimate itself · real', { hl: [1, 2, 3] }) + two(
    box('count(*) reads the table (or a whole index)', 'Every time. A list endpoint that returns { items, total } pays it on every page turn.', 'cam'),
    box('Two ways out', 'Drop the exact total from the API contract (hasMore, lesson 7.6), or use the estimate reltuples when "about a million" is enough.', 'xanh')) },

  { t: 'Use it on your own code', to: true, giua: true, body: flow([
    { t: '1 · find', s: 'slow query in the log', mau: LAM }, { t: '2 · run', s: 'EXPLAIN (ANALYZE, BUFFERS)', mau: NODE }, { t: '3 · look for', s: 'Seq Scan + Rows Removed', mau: CAM }, { t: '4 · add index', s: 'measure again', mau: TIM },
  ], { h: 150, fs: 21 }) + three(
    box('Get the real SQL', 'Prisma\'s query event (lesson 7.4) prints it with its parameters.', 'lam'),
    box('EXPLAIN ANALYZE runs the query', 'For UPDATE or DELETE it really changes rows: wrap it in BEGIN; … ROLLBACK;', 'do2'),
    box('Real data, fresh statistics', 'With 100 rows every plan looks the same. After a bulk load run ANALYZE "Note"; first.', 'cam')) +
    box('If you took PostgreSQL lessons 10.1 and 10.4', 'You followed this same loop with BUFFERS on CT Shop. DBI202 lesson 8.2 reads the same kind of plan in SQL Server (Ctrl+M).', 'xanh') },

  { t: 'Find the indexes nobody uses', to: true, giua: true, body: TT('c7/idx-usage', 2, 7, 'pg_stat_user_indexes · real', { sm: false }) + two(
    box('idx_scan', 'how many times each index has been used since statistics were reset. An index stuck at 0 after a busy week is a write tax with no reward.', 'lam'),
    box('This website\'s rule', 'Indexes live in schema.prisma and ship as migrations; a new index must come with the EXPLAIN ANALYZE that justifies it, in the same pull request.', 'xanh')) },

  { t: 'Exercise: the search box', to: true, giua: true, body: box('Your task', 'GET /notes?prefix=bulk-42 must return notes whose slug starts with the prefix, on a million rows, in under 1 ms. The database collation is en_US.utf8. What index do you add, how does it reach production, and how do you prove it works?', '') +
    box('Hint', 'Look again at the slide "Why the prefix LIKE missed".', 'lam') +
    `<div data-k="dapan">${box('Answer', 'CREATE INDEX … ON "Note" (slug text_pattern_ops), written into a migration created with --create-only. Prove it with EXPLAIN ANALYZE: Index Scan, 0.111 ms on this table (vs 55.687 ms Seq Scan).', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>In a plan, which two lines tell you the table was read in full?</li>
<li>Why (authorId, createdAt) and not (createdAt, authorId)?</li>
<li>Name three things that stop an index from being used.</li>
<li>Why can an index make SELECTs fast and the app slower?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Seq Scan and a large Rows Removed by Filter. &nbsp;2. Equality column first: one author\'s rows are together, already sorted; reversed collapses for rare authors. &nbsp;3. A function on the column, a leading %, a type cast (and collation for prefix LIKE). &nbsp;4. Every index taxes every write.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Read plans inside out: Seq Scan + Rows Removed = reading everything; Execution Time is the truth</li>
<li>One composite index: 55.177 ms ⇒ 0.084 ms, 47,692 pages ⇒ 23, the Sort gone</li>
<li>= columns first, then ORDER BY / range; declare it in schema.prisma, ship it as a migration</li>
<li>Every index taxes writes (+30%, +144% here); functions, leading %, casts, collation break indexes</li>
<li>count(*) reads everything; check idx_scan for indexes nobody uses</li>
</ul>` + box('Next: lesson 7.6', 'Keeping the chapter 6 API contract on real data: pagination, 409, lost updates, raw SQL.', 'lam') },
]);
