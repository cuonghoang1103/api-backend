/** Node.js 7.5 — Chỉ mục và EXPLAIN ANALYZE: đọc kế hoạch từ trong ra, chỉ mục ghép (authorId, createdAt DESC) bỏ được Sort, chỉ mục biểu thức lower(slug), bốn cách chỉ mục vô dụng, thuế ghi. */
import { modul, cs, q, bang1, tn, jsBai, goi, sqlBai, notesDb, luocDoNotes, sau, PLAN_ALL } from './_node-c6-8.mjs';

/* ── 1. Đọc một kế hoạch ── */
const PLAN_BEFORE = `Limit  (cost=33881.63..33883.97 rows=20) (actual time=26.855..28.594 rows=20 loops=1)
  Buffers: shared hit=16136 read=14097
  ->  Gather Merge  (actual time=26.853..28.590 rows=20 loops=1)
        Workers Launched: 2
        ->  Sort  (actual time=25.208..25.209 rows=20 loops=3)
              Sort Key: "createdAt" DESC
              Sort Method: top-N heapsort  Memory: 26kB
              ->  Parallel Seq Scan on "Note"  (actual time=6.067..24.828 rows=3340 loops=3)
                    Filter: ("authorId" = 7)
                    Rows Removed by Filter: 163660
Execution Time: 28.618 ms`;
const PLAN_AFTER = `Limit  (cost=0.42..69.59 rows=20) (actual time=0.098..0.112 rows=20 loops=1)
  Buffers: shared read=5
  ->  Index Scan using "Note_authorId_createdAt_idx" on "Note"
        (actual time=0.098..0.109 rows=20 loops=1)
        Index Cond: ("authorId" = 7)
Execution Time: 0.129 ms`;
const E1 = cs({
  ten: '7.5 · 1 — Read EXPLAIN ANALYZE from the inside out', kho: 'EASY', phut: 10,
  en: `<p>The plan below is lesson 7.5’s “twenty most recent notes by one author” on 751,000 rows, <b>before</b> the index:</p><pre>${PLAN_BEFORE.replace(/</g, '&lt;')}</pre>`,
  vi: `<p>Kế hoạch dưới đây là "hai mươi ghi chú mới nhất của một tác giả" của bài 7.5 trên 751.000 dòng, <b>trước</b> khi có chỉ mục (xem khối kế hoạch ở bản tiếng Anh).</p>`,
  cau: [
    q('c1', ['Which node runs FIRST?', 'Nút nào chạy ĐẦU TIÊN?'],
      ['Parallel Seq Scan on "Note" — read a plan from the inside out', 'Limit — it is at the top', 'Gather Merge — it starts the workers', 'Sort — it decides the order'],
      ['The most indented node feeds its parent; Limit is where the rows end up, not where work starts.', 'Nút thụt vào sâu nhất cung cấp dòng cho nút cha; Limit là nơi dòng kết thúc, không phải nơi việc bắt đầu.']),
    q('c2', ['What does “Rows Removed by Filter: 163660” with “loops=3” mean?', '"Rows Removed by Filter: 163660" với "loops=3" nghĩa là gì?'],
      ['Per worker: about half a million rows were examined and thrown away to find author 7’s notes', 'The query deleted 163,660 rows', '163,660 rows were returned to Node and filtered in JavaScript', 'The index removed 163,660 duplicates'],
      ['Three processes (leader + 2 workers) each scanned a share of the table.', 'Ba tiến trình (chính + 2 worker) mỗi cái quét một phần bảng.']),
    q('c3', ['<code>Buffers: shared hit=16136 read=14097</code> — what is “read”?', '<code>Buffers: shared hit=16136 read=14097</code> — "read" là gì?'],
      ['8 KB pages that came from disk rather than PostgreSQL’s cache', 'Rows read by the client', 'Rows written to the write-ahead log', 'Index entries that were cached'],
      ['And while it runs it evicts other data from the cache. Fifty requests per second = fifty full-table scans per second.', 'Và trong lúc chạy nó đẩy dữ liệu khác ra khỏi cache. Năm mươi request mỗi giây = năm mươi lần quét cả bảng mỗi giây.']),
    q('c4', ['Which number is the honest one?', 'Con số nào là con số thật?'],
      ['actual time / Execution Time — cost is the planner’s guess', 'cost=33881.63 — it is the most precise', 'rows=20 in the cost section', 'Memory: 26kB'],
      ['cost is in arbitrary planner units; actual time is what happened.', 'cost là đơn vị tuỳ ý của planner; actual time là chuyện thật đã xảy ra.']),
    q('c5', [`After <code>@@index([authorId, createdAt(sort: Desc)])</code> the plan is:<pre>${PLAN_AFTER.replace(/</g, '&lt;')}</pre>Why is there no Sort node any more?`, 'Sau <code>@@index([authorId, createdAt(sort: Desc)])</code> kế hoạch như bản tiếng Anh. Vì sao không còn nút Sort?'],
      ['The index already keeps each author’s createdAt in descending order', 'LIMIT 20 is too small for PostgreSQL to bother sorting at all', 'The sorting step was moved into Node by the Prisma client', 'The planner now sorts the rows in a background worker'],
      ['28.618 ms → 0.129 ms, 30,233 pages → 5. Equality column first, then the ORDER BY / range column.', '28,618 ms → 0,129 ms, 30.233 trang → 5. Cột so bằng trước, rồi cột ORDER BY / khoảng.']),
    q('c6', ['You EXPLAIN ANALYZE a DELETE to see its plan. What happens?', 'Bạn chạy EXPLAIN ANALYZE cho một câu DELETE để xem kế hoạch. Chuyện gì xảy ra?'],
      ['It really deletes', 'Nothing, EXPLAIN never executes', 'It deletes only the first 20 rows', 'PostgreSQL refuses EXPLAIN on DELETE'],
      ['Also: run ANALYZE "Note"; after a bulk import before you trust any plan, and measure on realistic volumes — on 100 rows every plan looks the same.', 'Thêm: chạy ANALYZE "Note"; sau khi nạp hàng loạt trước khi tin bất kỳ kế hoạch nào, và đo trên khối lượng thật — với 100 dòng kế hoạch nào cũng giống nhau.']),
  ],
  goiY: [['Indentation is the tree: children run before parents.', 'Thụt lề chính là cây: nút con chạy trước nút cha.'], ['“actual” = measured; “cost” = estimated.', '"actual" = đo được; "cost" = ước lượng.']],
  loi: [['Reading the plan top-down as if Limit ran first.', 'Đọc kế hoạch từ trên xuống như thể Limit chạy trước.'], ['Optimising by the cost number instead of the actual time.', 'Tối ưu theo con số cost thay vì actual time.']],
  tns: [tn('Seq Scan', 'quét tuần tự', 'Đọc cả bảng.'), tn('Index Scan', 'quét chỉ mục'), tn('Buffers', 'bộ đệm', 'Trang 8 KB đã chạm: hit = từ cache, read = từ đĩa.')],
  kn: ['EXPLAIN ANALYZE'],
});

/* ── 2. Bốn cách chỉ mục vô dụng ── */
const DUNG = ['Index Scan', 'Seq Scan'];
const E2 = cs({
  ten: '7.5 · 2 — Four ways an index quietly does nothing', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Same 751,000-row table, a B-tree on <code>slug</code> (the unique index), on <code>"authorId", "createdAt" DESC</code>, and on <code>pinned</code>; no index on <code>title</code>; default collation <code>en_US.utf8</code>. For each WHERE clause, which scan did PostgreSQL choose in lesson 7.5?',
  vi: 'Cùng bảng 751.000 dòng, có B-tree trên <code>slug</code> (chỉ mục unique), trên <code>"authorId", "createdAt" DESC</code>, và trên <code>pinned</code>; không có chỉ mục trên <code>title</code>; collation mặc định <code>en_US.utf8</code>. Với mỗi mệnh đề WHERE, PostgreSQL đã chọn kiểu quét nào trong bài 7.5?',
  bang: [bang1('b1', ['WHERE clause → scan', 'Mệnh đề WHERE → kiểu quét'], [{ ma: 'w', ten: 'WHERE' }, { ma: 's', ten: 'Scan', luaChon: DUNG }], [
    { o: { w: "slug = 'bulk-4242'" }, a: { s: 'Index Scan' } },
    { o: { w: "lower(slug) = 'bulk-4242'" }, a: { s: 'Seq Scan' } },
    { o: { w: "slug LIKE '%4242'" }, a: { s: 'Seq Scan' } },
    { o: { w: "title = 'Ghi chú số 4242'" }, a: { s: 'Seq Scan' } },
    { o: { w: '"authorId" = 7 ORDER BY "createdAt" DESC LIMIT 20' }, a: { s: 'Index Scan' } },
    { o: { w: 'pinned = true (40% of the rows)' }, a: { s: 'Seq Scan' } },
  ], ['A function around the column (lower(slug) is not slug: 1100× slower) — fix with an expression index or a normalised column. A leading wildcard cannot use a B-tree sorted by prefix. No index on title means nothing to use. Low selectivity: reading 40% of the table through an index is slower than reading it straight. Prisma’s contains compiles to LIKE \'%…%\' and mode: insensitive to ILIKE — both seq scans on a big table.', 'Một hàm bọc quanh cột (lower(slug) không phải slug: chậm 1100 lần) — sửa bằng chỉ mục biểu thức hoặc cột đã chuẩn hoá. Ký tự đại diện ở đầu không dùng được B-tree sắp theo tiền tố. Không có chỉ mục trên title thì không có gì để dùng. Độ chọn lọc thấp: đọc 40% bảng qua chỉ mục chậm hơn đọc thẳng. contains của Prisma dịch thành LIKE \'%…%\' còn mode: insensitive thành ILIKE — cả hai quét tuần tự trên bảng lớn.'])],
  goiY: [['A B-tree stores the raw column value, sorted. Ask: can the condition be answered by jumping to a position in that sorted list?', 'B-tree lưu giá trị gốc của cột, đã sắp. Hỏi: điều kiện có trả lời được bằng cách nhảy tới một vị trí trong danh sách đã sắp đó không?'], ['If most rows match anyway, walking the table is cheaper than walking an index.', 'Nếu đằng nào phần lớn dòng cũng khớp, đi qua bảng rẻ hơn đi qua chỉ mục.']],
  loi: [['Assuming the slug index helps lower(slug) or LIKE \'%…\'.', 'Cho rằng chỉ mục slug giúp được lower(slug) hay LIKE \'%…\'.'], ['Indexing a boolean column and expecting it to be used.', 'Đánh chỉ mục cột boolean và mong nó được dùng.']],
  tns: [tn('selectivity', 'độ chọn lọc', 'Tỉ lệ dòng khớp điều kiện.'), tn('expression index', 'chỉ mục biểu thức', 'Chỉ mục trên lower(slug)…')],
  kn: ['indexes'],
});

/* CSDL: 10 ghi chú mẫu + 5.000 ghi chú hàng loạt của 50 tác giả, đã ANALYZE; hàm plan_nodes / plan_text để kiểm kế hoạch */
const BULK = `INSERT INTO "User" (email, name, "createdAt") SELECT 'u' || g || '@vd.com', 'U' || g, '2026-07-01' FROM generate_series(5, 50) g;
INSERT INTO "Note" (title, slug, body, pinned, "authorId", "createdAt", "updatedAt")
SELECT 'Bulk note ' || g, 'bulk-' || g, 'body ' || g, g % 10 = 0, (g % 50) + 1, timestamp '2026-01-01' + g * interval '7 minutes', timestamp '2026-01-01' + g * interval '7 minutes'
FROM generate_series(1, 5000) g;
ANALYZE;`;
const DB75 = notesDb({ them: `${BULK}\n${PLAN_ALL}` });
const LD75 = { en: luocDoNotes().en + '<p>Plus <b>5,000 bulk notes</b> (slug <code>bulk-1</code> … <code>bulk-5000</code>) spread over 50 authors, and <code>ANALYZE</code> already run. Existing indexes: the primary keys and <code>"Note_slug_key"</code> (unique on slug).</p>', vi: luocDoNotes().vi + '<p>Thêm <b>5.000 ghi chú hàng loạt</b> (slug <code>bulk-1</code> … <code>bulk-5000</code>) chia cho 50 tác giả, và đã chạy <code>ANALYZE</code>. Chỉ mục có sẵn: các khoá chính và <code>"Note_slug_key"</code> (unique trên slug).</p>' };
const D = '$q$';
const Q_AUTHOR = `SELECT id, title FROM "Note" WHERE "authorId" = 7 ORDER BY "createdAt" DESC LIMIT 20`;
const Q_LOWER = `SELECT id FROM "Note" WHERE lower(slug) = 'bulk-4242'`;
// enable_seqscan = off: if a USABLE index exists the planner must take it; Seq Scan is then only chosen when nothing else can answer
const PLAN_CHECK = (query, label) => `SET LOCAL enable_seqscan = off;
SELECT position('Sort' in plan_nodes(${D}${query}${D})) = 0 AS no_sort,
       position('Index Cond' in plan_text(${D}${query}${D})) > 0 AS index_cond,
       '${label}' AS query`;

/* ── 3. Chỉ mục ghép cho "20 ghi chú mới nhất của một tác giả" ── */
const E3 = sqlBai({
  ten: '7.5 · 3 — Create the index that removes the Sort: (authorId, createdAt DESC)', kho: 'MEDIUM', phut: 12,
  en: `<p>The most ordinary query an API ever runs:</p><pre>${Q_AUTHOR}</pre>
<p>Without an index it is a (Parallel) Seq Scan + Sort. Write the migration line that Prisma generates for <code>@@index([authorId, createdAt(sort: Desc)])</code>: one <code>CREATE INDEX</code> on <code>"Note"</code> so that the plan becomes an <b>Index Scan with no Sort node</b>. Name it the way Prisma would: <code>"Note_authorId_createdAt_idx"</code>.</p>
<p>The grader runs <code>EXPLAIN</code> on the query with <code>enable_seqscan = off</code> and checks the plan, and reads <code>pg_indexes</code> to see which columns your index has, in which order.</p>`,
  vi: `<p>Câu truy vấn bình thường nhất mà API nào cũng chạy (xem khối SQL ở bản tiếng Anh). Không có chỉ mục thì nó là (Parallel) Seq Scan + Sort. Viết dòng migration mà Prisma sinh cho <code>@@index([authorId, createdAt(sort: Desc)])</code>: một câu <code>CREATE INDEX</code> trên <code>"Note"</code> để kế hoạch thành <b>Index Scan không có nút Sort</b>. Đặt tên như Prisma: <code>"Note_authorId_createdAt_idx"</code>.</p>
<p>Máy chấm chạy <code>EXPLAIN</code> câu truy vấn với <code>enable_seqscan = off</code> và kiểm kế hoạch, rồi đọc <code>pg_indexes</code> để xem chỉ mục của bạn có những cột nào, theo thứ tự nào.</p>`,
  yc: [['One CREATE INDEX statement.', 'Một câu CREATE INDEX.'], ['Equality column first, then the ORDER BY column.', 'Cột so bằng trước, rồi tới cột ORDER BY.']],
  giai: `-- CreateIndex — what migrate dev writes for @@index([authorId, createdAt(sort: Desc)])
CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "createdAt" DESC);
`,
  khoi: `-- Write the CREATE INDEX statement here\nCREATE INDEX "Note_authorId_idx" ON "Note"("authorId");\n`,
  csdl: DB75, ld: LD75,
  kiem: [
    sau(['The query uses an index and has no Sort node', 'Truy vấn dùng chỉ mục và không có nút Sort'], PLAN_CHECK(Q_AUTHOR, 'author 7, newest 20')),
    sau(['Your index starts with "authorId", then "createdAt"', 'Chỉ mục của bạn bắt đầu bằng "authorId", rồi "createdAt"'], `SELECT count(*) AS good_indexes FROM pg_indexes WHERE tablename = 'Note' AND indexdef ~ '\\("authorId", "createdAt"( DESC)?\\)'`),
    sau(['It is named "Note_authorId_createdAt_idx"', 'Nó tên là "Note_authorId_createdAt_idx"'], `SELECT count(*) AS named FROM pg_indexes WHERE tablename = 'Note' AND indexname = 'Note_authorId_createdAt_idx'`),
    sau(['Hidden: the same plan for another author', 'Ẩn: cùng kế hoạch cho tác giả khác'], PLAN_CHECK(Q_AUTHOR.replace('= 7', '= 42'), 'author 42'), { an: true }),
  ],
  sai: [`CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId");`, `CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("createdAt" DESC, "authorId");`, `CREATE INDEX "Note_authorId_createdAt_idx" ON "Note"("authorId", "title");`],
  goiY: [['<code>CREATE INDEX "name" ON "Note"(col1, col2 DESC);</code> — camelCase columns in double quotes.', '<code>CREATE INDEX "tên" ON "Note"(cột1, cột2 DESC);</code> — cột camelCase trong ngoặc kép.'], ['Rule of thumb: columns compared with =, then the ORDER BY / range column, then anything you merely select.', 'Quy tắc ngón tay cái: các cột so bằng =, rồi cột ORDER BY / khoảng, rồi những cột chỉ để SELECT.']],
  loi: [['An index on <code>"authorId"</code> alone: rows are found fast, but still have to be sorted (Bitmap scan + Sort).', 'Chỉ mục chỉ trên <code>"authorId"</code>: tìm dòng nhanh, nhưng vẫn phải sắp (Bitmap scan + Sort).'], ['Reversed order <code>("createdAt" DESC, "authorId")</code>: no Sort and fast for a busy author, but it walks past everyone else’s newer notes — 3,844 pages in 30.3 ms for a quiet author, against 13 pages in 0.038 ms.', 'Đảo thứ tự <code>("createdAt" DESC, "authorId")</code>: không có Sort và nhanh với tác giả viết nhiều, nhưng đi qua mọi ghi chú mới hơn của người khác — 3.844 trang trong 30,3 ms với tác giả ít viết, so với 13 trang trong 0,038 ms.'], ['Creating the index by hand on the server instead of in a migration — drift (lesson 7.2).', 'Tạo chỉ mục bằng tay trên server thay vì trong migration — lệch lược đồ (bài 7.2).']],
  gt: ['Inside the index, entries are ordered by authorId and, within one author, by createdAt descending. The query asks for exactly one author’s entries in exactly that order, so PostgreSQL jumps to author 7, reads 20 entries and stops: no scan of other rows, no Sort. (An ascending createdAt works too — PostgreSQL can walk a B-tree backwards — which is why the check accepts both directions.)', 'Trong chỉ mục, các mục sắp theo authorId và, trong một tác giả, theo createdAt giảm dần. Truy vấn hỏi đúng các mục của một tác giả theo đúng thứ tự đó, nên PostgreSQL nhảy tới tác giả 7, đọc 20 mục rồi dừng: không quét dòng khác, không Sort. (createdAt tăng dần cũng được — PostgreSQL đi ngược B-tree được — nên kiểm chấp nhận cả hai chiều.)'],
  tns: [tn('composite index', 'chỉ mục ghép', 'Chỉ mục trên nhiều cột, thứ tự cột quan trọng.'), tn('Index Cond', 'điều kiện chỉ mục', 'Phần WHERE trả lời bằng chỉ mục.')],
  kn: ['indexes', 'EXPLAIN'],
});

/* ── 4. Chỉ mục biểu thức ── */
const E4 = sqlBai({
  ten: '7.5 · 4 — Make lower(slug) = … use an index (expression index)', kho: 'MEDIUM', phut: 10,
  en: `<p>The login of an old client looks notes up case-insensitively:</p><pre>${Q_LOWER}</pre>
<p>In the lesson this was a Parallel Seq Scan at 71.8 ms — 1100× slower than <code>slug = …</code> — because <code>lower(slug)</code> is not <code>slug</code>: the B-tree stores the raw value. Add an <b>expression index</b> so that the condition appears as an <code>Index Cond</code> in the plan. Keep the existing unique index.</p>`,
  vi: `<p>Một client cũ tra ghi chú không phân biệt hoa thường (xem khối SQL ở bản tiếng Anh). Trong bài đây là Parallel Seq Scan 71,8 ms — chậm hơn <code>slug = …</code> 1100 lần — vì <code>lower(slug)</code> không phải <code>slug</code>: B-tree lưu giá trị gốc. Thêm một <b>chỉ mục biểu thức</b> để điều kiện hiện thành <code>Index Cond</code> trong kế hoạch. Giữ nguyên chỉ mục unique đang có.</p>`,
  yc: [['One CREATE INDEX on the expression <code>lower(slug)</code>.', 'Một câu CREATE INDEX trên biểu thức <code>lower(slug)</code>.'], ['Do not drop <code>"Note_slug_key"</code>.', 'Đừng xoá <code>"Note_slug_key"</code>.']],
  giai: `-- an index ON THE EXPRESSION: the B-tree now stores lower(slug), which is what the WHERE compares
CREATE INDEX "Note_slug_lower_idx" ON "Note" (lower(slug));
`,
  khoi: `-- Write your CREATE INDEX here\nCREATE INDEX "Note_slug_idx2" ON "Note" (slug);\n`,
  csdl: DB75, ld: LD75,
  kiem: [
    sau(['lower(slug) = … is answered by an index', 'lower(slug) = … được trả lời bằng chỉ mục'], PLAN_CHECK(Q_LOWER, 'lower(slug)')),
    sau(['The unique index on slug is still there', 'Chỉ mục unique trên slug vẫn còn'], `SELECT count(*) AS unique_slug FROM pg_indexes WHERE tablename = 'Note' AND indexname = 'Note_slug_key'`),
    sau(['Hidden: the result is right', 'Ẩn: kết quả đúng'], `SELECT id, slug FROM "Note" WHERE lower(slug) = 'bulk-4242'`, { an: true }),
    sau(['Hidden: an upper-case lookup also uses it', 'Ẩn: tra bằng chữ hoa cũng dùng được'], PLAN_CHECK(`SELECT id FROM "Note" WHERE lower(slug) = lower('BULK-17')`, 'lower(BULK-17)'), { an: true }),
  ],
  sai: [`CREATE INDEX "Note_slug_idx2" ON "Note" (slug);`, `CREATE INDEX "Note_slug_upper_idx" ON "Note" (upper(slug));`, `DROP INDEX "Note_slug_key"; CREATE UNIQUE INDEX "Note_slug_key" ON "Note" (lower(slug));`],
  goiY: [['<code>CREATE INDEX "name" ON "Note" (lower(slug));</code> — the parentheses around the expression are required.', '<code>CREATE INDEX "tên" ON "Note" (lower(slug));</code> — bắt buộc có ngoặc quanh biểu thức.'], ['The index expression must match the WHERE expression exactly: lower, not upper.', 'Biểu thức chỉ mục phải khớp đúng biểu thức trong WHERE: lower, không phải upper.']],
  loi: [['A second plain index on slug — it is the same B-tree of raw values and changes nothing.', 'Thêm một chỉ mục thường thứ hai trên slug — vẫn là B-tree giá trị gốc, không đổi gì.'], ['Indexing <code>upper(slug)</code> while the query says <code>lower(slug)</code>.', 'Đánh chỉ mục <code>upper(slug)</code> trong khi truy vấn viết <code>lower(slug)</code>.']],
  gt: ['An expression index stores the computed value, so PostgreSQL can match lower(slug) = $1 against it exactly as it matches slug = $1 against the plain one. The alternative the lesson mentions is storing a normalised column — same idea, done at write time instead of in the index.', 'Chỉ mục biểu thức lưu giá trị đã tính, nên PostgreSQL so lower(slug) = $1 với nó y như so slug = $1 với chỉ mục thường. Cách thay thế bài nhắc tới là lưu một cột đã chuẩn hoá — cùng ý, làm lúc ghi thay vì trong chỉ mục.'],
  tns: [tn('expression index', 'chỉ mục biểu thức'), tn('normalised column', 'cột đã chuẩn hoá')],
  kn: ['indexes'],
});

/* ── 5. Đọc EXPLAIN bằng code ── */
function readPlan(text) {
  const lines = text.split('\n');
  const nodes = [];
  for (const line of lines) {
    // a plan node is "->  Name (" or the very first line; strip "on <table>" and "using <index> on <table>"
    const m = /^\s*(?:->\s+)?([A-Z][A-Za-z ]+?)(?:\s+using\s+\S+)?(?:\s+on\s+\S+)?\s*(?:\(|$)/.exec(line);
    if (m && !/^\s*(Buffers|Filter|Rows Removed|Sort Key|Sort Method|Index Cond|Workers|Execution|Planning|Recheck)/.test(line) && (/->/.test(line) || nodes.length === 0)) nodes.push(m[1].trim());
  }
  const num = (re) => { const m = re.exec(text); return m ? Number(m[1]) : null; };
  const scan = nodes.slice().reverse().find((n) => /Scan/.test(n)) ?? null;
  const idx = /using\s+"?([^"\s]+)"?\s+on/.exec(text);
  return {
    nodes,
    scan,                                                   // the innermost scan: where the rows come from
    index: idx ? idx[1] : null,
    hasSort: nodes.includes('Sort'),
    rowsRemovedByFilter: num(/Rows Removed by Filter:\s+(\d+)/),
    buffers: { hit: num(/shared[^\n]*?hit=(\d+)/) ?? 0, read: num(/shared[^\n]*?read=(\d+)/) ?? 0 },
    executionMs: num(/Execution Time:\s+([\d.]+)\s*ms/),
  };
}
const PLAN_OTHER = `Limit  (actual time=0.031..0.040 rows=3 loops=1)
  Buffers: shared hit=4
  ->  Sort  (actual time=0.030..0.031 rows=3 loops=1)
        Sort Key: title
        Sort Method: quicksort  Memory: 25kB
        ->  Bitmap Heap Scan on "Note"  (actual time=0.012..0.020 rows=3 loops=1)
              Recheck Cond: ("authorId" = 3)
              ->  Bitmap Index Scan on "Note_authorId_idx"  (actual time=0.008..0.008 rows=3 loops=1)
                    Index Cond: ("authorId" = 3)
Execution Time: 0.061 ms`;
const E5 = jsBai({
  ten: '7.5 · 5 — Write readPlan(text): turn EXPLAIN ANALYZE output into numbers you can assert on', kho: 'MEDIUM', phut: 20,
  en: `<p>“Lift the counting idea into a test.” A test can assert on a plan only if code can read it. Write <code>readPlan(text)</code> for PostgreSQL’s text EXPLAIN (ANALYZE, BUFFERS) output, returning:</p>
<ul><li><code>nodes</code>: the plan node names in the order they appear — the first line’s node, then every line that starts (after spaces) with <code>-&gt;</code> — with the parts <code>using &lt;index&gt;</code> and <code>on &lt;table&gt;</code> and everything from <code>(</code> removed: <code>["Limit", "Gather Merge", "Sort", "Parallel Seq Scan"]</code>.</li>
<li><code>scan</code>: the LAST node whose name contains <code>Scan</code> (the innermost — where rows come from), or <code>null</code>.</li>
<li><code>index</code>: the index name after <code>using</code> (without quotes), or <code>null</code>. <code>hasSort</code>: whether a node is exactly <code>Sort</code>.</li>
<li><code>rowsRemovedByFilter</code>, <code>executionMs</code>: numbers, or <code>null</code> if absent. <code>buffers</code>: <code>{ hit, read }</code> from the first <code>shared …</code> line, 0 when a part is missing.</li></ul>`,
  vi: `<p>"Đưa ý tưởng đếm vào một bài test." Test chỉ khẳng định được trên kế hoạch khi code đọc được nó. Viết <code>readPlan(text)</code> cho output dạng chữ của PostgreSQL EXPLAIN (ANALYZE, BUFFERS), trả về:</p>
<ul><li><code>nodes</code>: tên các nút kế hoạch theo thứ tự xuất hiện — nút của dòng đầu, rồi mọi dòng bắt đầu (sau khoảng trắng) bằng <code>-&gt;</code> — đã bỏ phần <code>using &lt;chỉ mục&gt;</code>, <code>on &lt;bảng&gt;</code> và mọi thứ từ <code>(</code>: <code>["Limit", "Gather Merge", "Sort", "Parallel Seq Scan"]</code>.</li>
<li><code>scan</code>: nút CUỐI CÙNG có tên chứa <code>Scan</code> (nút trong cùng — nơi dòng đến), hoặc <code>null</code>.</li>
<li><code>index</code>: tên chỉ mục sau <code>using</code> (không có ngoặc kép), hoặc <code>null</code>. <code>hasSort</code>: có nút tên đúng là <code>Sort</code> không.</li>
<li><code>rowsRemovedByFilter</code>, <code>executionMs</code>: số, hoặc <code>null</code> nếu không có. <code>buffers</code>: <code>{ hit, read }</code> từ dòng <code>shared …</code> đầu tiên, phần nào thiếu thì 0.</li></ul>`,
  yc: [['Numbers are numbers (<code>28.618</code>, not <code>"28.618"</code>).', 'Số là số (<code>28.618</code>, không phải <code>"28.618"</code>).'], ['Detail lines (Filter, Sort Key, Buffers…) are not nodes.', 'Dòng chi tiết (Filter, Sort Key, Buffers…) không phải nút.']],
  goiY: [['Node lines are the first line and lines matching <code>/^\\s*-&gt;/</code>. Take the name up to <code>" using "</code>, <code>" on "</code> or <code>"("</code>.', 'Dòng nút là dòng đầu và các dòng khớp <code>/^\\s*-&gt;/</code>. Lấy tên tới <code>" using "</code>, <code>" on "</code> hoặc <code>"("</code>.'], ['Numbers: <code>/Rows Removed by Filter:\\s+(\\d+)/</code>, <code>/Execution Time:\\s+([\\d.]+)/</code>, <code>/shared[^\\n]*?hit=(\\d+)/</code> and the same for read.', 'Số: <code>/Rows Removed by Filter:\\s+(\\d+)/</code>, <code>/Execution Time:\\s+([\\d.]+)/</code>, <code>/shared[^\\n]*?hit=(\\d+)/</code> và tương tự cho read.']],
  loi: [['Taking the FIRST scan instead of the innermost: with Bitmap Heap Scan over Bitmap Index Scan, the rows are located by the index scan.', 'Lấy nút scan ĐẦU TIÊN thay vì nút trong cùng: với Bitmap Heap Scan trên Bitmap Index Scan, dòng được tìm bởi nút quét chỉ mục.'], ['Keeping <code>on "Note"</code> in the name, so <code>"Parallel Seq Scan"</code> never matches your assertion.', 'Giữ <code>on "Note"</code> trong tên, nên <code>"Parallel Seq Scan"</code> không bao giờ khớp phép khẳng định.']],
  gt: ['Once a plan is data, “this endpoint must use an index and must not sort” becomes an assertion that fails in CI the day someone drops the index or changes the ORDER BY — instead of an incident report three months later.', 'Khi kế hoạch thành dữ liệu, "endpoint này phải dùng chỉ mục và không được sắp" thành một phép khẳng định hỏng trong CI ngay ngày ai đó xoá chỉ mục hay đổi ORDER BY — thay vì một báo cáo sự cố ba tháng sau.'],
  kn: ['EXPLAIN', 'regex', 'testing'],
  tns: [tn('plan node', 'nút kế hoạch'), tn('innermost', 'trong cùng')],
  dau: `function readPlan(text) {
  // Write your solution here
  const nodes = text.split('\\n').filter((l) => l.includes('->')).map((l) => l.trim().slice(3).split('(')[0].trim());
  return { nodes, scan: nodes[0] || null, index: null, hasSort: text.includes('Sort'), rowsRemovedByFilter: null, buffers: { hit: 0, read: 0 }, executionMs: null };
}
`,
  giai: readPlan,
  cases: [
    { goi: goi('readPlan', PLAN_BEFORE), moTa: ['The lesson’s plan before the index', 'Kế hoạch của bài trước khi có chỉ mục'] },
    { goi: goi('readPlan', PLAN_AFTER), moTa: ['After the index', 'Sau khi có chỉ mục'] },
    { goi: goi('readPlan', PLAN_OTHER), an: true },
    { goi: goi('readPlan', 'Seq Scan on "Note"  (actual time=0.010..35.947 rows=1 loops=1)\n  Filter: (slug ~~ \'%4242\'::text)\n  Rows Removed by Filter: 751001\nExecution Time: 35.947 ms'), an: true },
    { goi: goi('readPlan', 'Index Scan using "Note_slug_key" on "Note"  (actual time=0.040..0.041 rows=1 loops=1)\n  Index Cond: (slug = \'bulk-4242\'::text)\n  Buffers: shared hit=3 read=1\nPlanning Time: 0.100 ms\nExecution Time: 0.065 ms'), an: true },
  ],
});

export default modul('nodejs-7-5-chi-muc-va-explain', '7.5 Indexes, and reading EXPLAIN ANALYZE', [E1, E2, E3, E4, E5]);
