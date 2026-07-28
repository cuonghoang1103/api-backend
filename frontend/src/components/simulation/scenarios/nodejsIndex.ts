/**
 * Node.js · Bài 7.5 — Chỉ mục, và cách đọc EXPLAIN ANALYZE.
 *
 * Mọi số đo lấy nguyên từ giáo trình, đo trên bảng "Note" 751.000 dòng, sau
 * một lệnh `ANALYZE` tường minh:
 *
 *   trước chỉ mục : 28,618 ms · 30.233 trang 8KB (≈236MB) · Sort top-N heapsort
 *   sau chỉ mục   :  0,129 ms ·      5 trang     · KHÔNG còn node Sort
 *                   → nhanh hơn 222 lần
 *
 *   ghi 50.000 dòng:  2 chỉ mục 336ms · 3 chỉ mục 382ms (+14%) · 6 chỉ mục 552ms (+64%)
 *   chỉ mục vô hiệu:  slug =        0,065 ms  (Index Scan)
 *                     lower(slug) = 71,771 ms (Seq Scan — chậm hơn 1100 lần)
 *                     LIKE '%4242' 35,947 ms
 *                     count(*)     40,018 ms
 *
 * Kế hoạch thực thi là nhân vật chính của bài này, nên panel log được đặt to
 * nhất và các dòng plan được đẩy vào ĐÚNG THỨ TỰ NÓ CHẠY (từ trong ra ngoài)
 * chứ không theo thứ tự in ra — đó chính là kỹ năng bài học muốn dạy.
 */

import { Search } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const QUERY_CODE = [
  'EXPLAIN (ANALYZE, BUFFERS)',
  'SELECT id, title FROM "Note"',
  ' WHERE "authorId" = 7',
  ' ORDER BY "createdAt" DESC',
  ' LIMIT 20;',
  '',
  '-- bảng có 751.000 dòng, đã chạy ANALYZE',
];

const INDEX_CODE = [
  '// chỉ mục là một phần của mô hình dữ liệu,',
  '// không phải bản vá nóng trên production',
  'model Note {',
  '  …',
  '  @@index([authorId, createdAt(sort: Desc)])',
  '}',
  '',
  '$ npx prisma migrate dev --name index_note_author_created',
];

const WRITE_CODE = [
  '-- chèn 50.000 dòng vào cùng một bảng,',
  '-- chỉ khác số chỉ mục đang có trên bảng đó',
  '',
  '2 chỉ mục  (pk + unique slug)',
  '3 chỉ mục  (+ authorId,createdAt)',
  '6 chỉ mục  (+ title, pinned, updatedAt)',
  '',
  '-- chỉ mục nào không ai dùng?',
  'SELECT * FROM pg_stat_user_indexes',
  ' WHERE idx_scan = 0;',
];

const DEFEAT_CODE = [
  "WHERE slug = 'bulk-4242'",
  '',
  "WHERE lower(slug) = 'bulk-4242'",
  '',
  "WHERE slug LIKE '%4242'",
  '',
  "WHERE title = 'Ghi chú số 4242'",
  '',
  'SELECT count(*) FROM "Note";',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => {
  const writes = opts.mode === 'writes';
  return [
    {
      id: 'code',
      kind: 'code',
      title: { vi: 'Truy vấn', en: 'The query' },
      x: 0,
      y: 0,
      w: 436,
      h: 252,
      lines:
        opts.mode === 'after' ? INDEX_CODE : writes ? WRITE_CODE : opts.mode === 'defeated' ? DEFEAT_CODE : QUERY_CODE,
    },
    {
      id: 'gauges',
      kind: 'meter',
      title: { vi: 'Cái giá của một lần chạy', en: 'What one execution costs' },
      hint: { vi: 'bảng "Note" · 751.000 dòng', en: '"Note" table · 751,000 rows' },
      x: 0,
      y: 264,
      w: 436,
      h: 296,
      accent: '#f59e0b',
      meters: [
        { id: 'ms', label: 'Execution Time', max: 75, unit: 'ms', threshold: 1, thresholdLabel: 'ngưỡng dễ chịu', accent: '#f43f5e' },
        { id: 'pages', label: 'Trang 8KB phải chạm tới', max: 30_233, unit: 'trang', accent: '#f59e0b' },
        { id: 'thrown', label: 'Dòng đọc lên rồi vứt đi', max: 500_000, unit: 'dòng', accent: '#a78bfa' },
      ],
    },
    {
      id: 'plan',
      kind: 'log',
      title: { vi: 'Kế hoạch thực thi', en: 'The execution plan' },
      file: 'EXPLAIN (ANALYZE, BUFFERS)',
      x: 448,
      y: 0,
      w: 552,
      h: 244,
      accent: '#34d399',
      maxLines: 11,
    },
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title: writes
        ? { vi: 'Chèn 50.000 dòng (ms)', en: 'Inserting 50,000 rows (ms)' }
        : { vi: 'Cùng một truy vấn, cùng một bảng (ms)', en: 'Same query, same table (ms)' },
      x: 448,
      y: 256,
      w: 552,
      h: 304,
      accent: '#f43f5e',
      unit: 'ms',
      max: writes ? 620 : 78,
    },
  ];
};

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const plan = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'muted'): PanelOp => ({
  p: 'plan',
  op: 'push',
  item: { label, tone },
});
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'gauges',
  op: 'value',
  key,
  value,
  label,
  tone,
});
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'cost',
  op: 'value',
  key,
  value,
  label,
  tone,
});

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — TRƯỚC KHI CÓ CHỈ MỤC: ĐỌC TRỌN BẢNG
   ──────────────────────────────────────────────────────────── */

function buildBefore(): SimStep[] {
  const { steps, push } = collector();

  push(
    'query',
    { vi: 'Truy vấn bình thường nhất mà một API từng chạy', en: 'The most ordinary query an API ever runs' },
    {
      vi: '"Hai mươi ghi chú mới nhất của một tác giả." Không có gì lạ trong câu SQL này, và đó chính là vấn đề — nhìn vào code thì không thể biết nó tốn bao nhiêu. Chỉ có `EXPLAIN ANALYZE` mới nói được.',
      en: '"The twenty most recent notes by one author." Nothing about this SQL looks unusual, and that is the problem — you cannot tell what it costs by reading it. Only `EXPLAIN ANALYZE` can tell you.',
    },
    2400,
    [
      lines([2, 3, 4, 5]),
      gauge('ms', 0, '—'),
      gauge('pages', 0, '—'),
      gauge('thrown', 0, '—'),
      plan('Limit  (cost=33881.63..33883.97 rows=20)'),
    ],
    { sfx: 'click' }
  );

  push(
    'seqscan',
    { vi: 'Đọc từ TRONG RA NGOÀI — và trong cùng là Seq Scan', en: 'Read it INSIDE OUT — and innermost is a Seq Scan' },
    {
      vi: 'Kế hoạch in ra từ ngoài vào, nhưng nó CHẠY từ trong ra. Node trong cùng nói: PostgreSQL đã đọc toàn bộ bảng, huy động thêm hai worker, chỉ để tìm các dòng của tác giả số 7.',
      en: 'A plan prints outside-in, but it RUNS inside-out. The innermost node says: PostgreSQL read the whole table, with two extra workers, just to find the rows belonging to author 7.',
    },
    2700,
    [
      plan('  -> Gather Merge   Workers Launched: 2'),
      plan('    -> Sort   Sort Key: "createdAt" DESC'),
      plan('      -> Parallel Seq Scan on "Note"', 'err'),
      plan('           Filter: ("authorId" = 7)', 'err'),
      gauge('ms', 24.8, '24,8 ms', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'removed',
    { vi: 'Rows Removed by Filter: 163660 — trên MỖI worker', en: 'Rows Removed by Filter: 163660 — per worker' },
    {
      vi: 'Ba tiến trình, mỗi tiến trình vứt đi 163.660 dòng: khoảng nửa triệu dòng được đọc lên rồi ném đi để lấy về hai mươi dòng. Đây là con số đầu tiên cần tìm trong mọi kế hoạch — "đọc bao nhiêu để vứt bao nhiêu".',
      en: 'Three processes, each discarding 163,660 rows: roughly half a million rows read and thrown away to return twenty. This is the first number to look for in any plan — how much was read in order to be discarded.',
    },
    2800,
    [
      plan('           Rows Removed by Filter: 163660', 'err'),
      gauge('thrown', 490_980, '490.980 dòng', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Chỉ vào hai dòng: Seq Scan + Rows Removed. Đó là dấu hiệu duy nhất cần nhớ.',
        en: 'Point at two lines: Seq Scan + Rows Removed. That is the only signature to memorise.',
      },
    }
  );

  push(
    'buffers',
    { vi: 'Buffers: hit=16136 read=14097 → 236MB bị đi bộ qua', en: 'Buffers: hit=16136 read=14097 → 236MB walked' },
    {
      vi: '30.233 trang 8KB bị chạm tới cho một trang danh sách hai mươi dòng. `read` nghĩa là lấy từ đĩa chứ không phải từ cache — và nó còn đẩy dữ liệu của người khác ra khỏi cache trong lúc chạy.',
      en: '30,233 8KB pages touched for one twenty-row list. `read` means it came from disk, not cache — and while it runs it evicts everybody else\'s data from that cache.',
    },
    2700,
    [
      plan('  Buffers: shared hit=16136 read=14097', 'warn'),
      plan('  Sort Method: top-N heapsort  Memory: 26kB', 'warn'),
      gauge('pages', 30_233, '30.233 trang ≈ 236MB', 'err'),
    ],
    { sfx: 'blip' }
  );

  push(
    'verdict',
    { vi: 'Execution Time: 28,618 ms — con số trung thực', en: 'Execution Time: 28.618 ms — the honest number' },
    {
      vi: '`cost` là phỏng đoán của bộ lập kế hoạch, `actual time` mới là chuyện đã xảy ra. 28 ms cho hai mươi dòng nghe còn chịu được — nó không hề chịu được: khối lượng này lặp lại cho MỖI request, tăng theo kích thước bảng. Năm mươi request mỗi giây nghĩa là năm mươi lần quét trọn bảng mỗi giây.',
      en: '`cost` is the planner\'s guess; `actual time` is what happened. 28 ms for twenty rows sounds survivable — it is not: this work repeats on EVERY request and scales with the table. Fifty requests per second means fifty full-table scans per second.',
    },
    2900,
    [
      plan('Execution Time: 28.618 ms', 'err'),
      gauge('ms', 28.618, '28,618 ms', 'err'),
      bar('chưa có chỉ mục', 28.618, '28,6', 'err'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — SAU KHI CÓ CHỈ MỤC: NĂM TRANG VÀ HẾT
   ──────────────────────────────────────────────────────────── */

function buildAfter(): SimStep[] {
  const { steps, push } = collector();

  push(
    'declare',
    { vi: 'Khai chỉ mục trong schema, không phải trên server', en: 'Declare the index in the schema, not on the server' },
    {
      vi: 'Một chỉ mục chỉ tồn tại trên production là drift — bài 7.2 đã cho thấy điều đó dẫn tới đâu. Nó đi qua migration như mọi thay đổi lược đồ khác.',
      en: 'An index that exists only on production is drift — lesson 7.2 showed where that leads. It ships through a migration like every other schema change.',
    },
    2400,
    [
      lines([3, 4, 5, 6]),
      gauge('ms', 0, '—'),
      gauge('pages', 0, '—'),
      gauge('thrown', 0, '—'),
      plan('CREATE INDEX "Note_authorId_createdAt_idx"'),
      plan('  ON "Note"("authorId", "createdAt" DESC);'),
    ],
    { sfx: 'click' }
  );

  push(
    'scan',
    { vi: 'Index Scan — 5 trang thay vì 30.233', en: 'Index Scan — 5 pages instead of 30,233' },
    {
      vi: 'Cùng truy vấn đó, chạy lại. PostgreSQL đi qua năm trang, lấy hai mươi dòng rồi dừng. Không có dòng nào bị đọc lên để vứt đi.',
      en: 'The same query, run again. PostgreSQL walks five pages, takes twenty rows and stops. Not one row is read in order to be discarded.',
    },
    2700,
    [
      lines([8]),
      plan('Limit  (cost=0.42..69.59 rows=20)', 'ok'),
      plan('  Buffers: shared read=5', 'ok'),
      plan('  -> Index Scan using "Note_authorId_createdAt_idx"', 'ok'),
      plan('       Index Cond: ("authorId" = 7)', 'ok'),
      gauge('pages', 5, '5 trang', 'ok'),
      gauge('thrown', 0, '0 dòng', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'nosort',
    { vi: 'Node `Sort` BIẾN MẤT — đây là phần người ta hay bỏ sót', en: 'The `Sort` node is GONE — this is the part people miss' },
    {
      vi: 'Chỉ mục lưu `createdAt` theo thứ tự giảm dần BÊN TRONG từng `authorId`, nên các dòng ra khỏi chỉ mục đã đúng thứ tự bạn yêu cầu. Không còn gì để sắp xếp. Nhanh hơn 222 lần, và một nửa phần thưởng đến từ chỗ này.',
      en: 'The index stores `createdAt` in descending order WITHIN each `authorId`, so rows leave the index already in the order you asked for. There is nothing left to sort. 222× faster, and half of that prize comes from here.',
    },
    2900,
    [
      plan('Execution Time: 0.129 ms', 'ok'),
      gauge('ms', 0.129, '0,129 ms', 'ok'),
      bar('chưa có chỉ mục', 28.618, '28,6', 'err'),
      bar('có chỉ mục', 0.129, '0,129', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'So hai cột: 28,618 → 0,129 ms · 30.233 trang → 5 · và không còn Sort.',
        en: 'Compare the two bars: 28.618 → 0.129 ms · 30,233 pages → 5 · and no Sort.',
      },
    }
  );

  push(
    'order',
    { vi: 'Thứ tự cột trong chỉ mục là toàn bộ câu chuyện', en: 'The column order inside the index is the whole story' },
    {
      vi: 'Quy tắc phủ được hầu hết chỉ mục thật: cột so sánh bằng `=` trước, rồi tới cột bạn `ORDER BY` hoặc so sánh khoảng (`>`/`<`), cuối cùng mới tới cột chỉ để lấy ra. Chỉ mục `(createdAt, authorId)` sẽ KHÔNG xoá được node Sort ở đây — cùng hai cột, đảo thứ tự, mất sạch phần thưởng.',
      en: 'The rule of thumb that covers most real indexes: equality columns first, then the column you `ORDER BY` or range-scan, then anything you merely select. An index on `(createdAt, authorId)` would NOT have removed the sort here — same two columns, reversed, prize gone.',
    },
    2900,
    [lines([5]), plan('(createdAt, authorId) → Sort quay lại', 'warn')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — THUẾ GHI: CHỈ MỤC KHÔNG MIỄN PHÍ
   ──────────────────────────────────────────────────────────── */

function buildWrites(): SimStep[] {
  const { steps, push } = collector();

  push(
    'two',
    { vi: '2 chỉ mục — 336 ms cho 50.000 dòng', en: '2 indexes — 336 ms per 50,000 rows' },
    {
      vi: 'Mốc chuẩn: khoá chính và một `unique` trên `slug`. Đây là cái giá tối thiểu, vì hai chỉ mục đó không phải lựa chọn của ai cả.',
      en: 'The baseline: the primary key plus a `unique` on `slug`. This is the floor, because neither of those two indexes was anybody\'s choice.',
    },
    2400,
    [
      lines([4]),
      gauge('ms', 0, '—'),
      gauge('pages', 0, '—'),
      gauge('thrown', 0, '—'),
      bar('2 chỉ mục', 336, '336', 'ok'),
      plan('2 chỉ mục (pk + unique slug)      336ms / 50k dòng'),
    ],
    { sfx: 'click' }
  );

  push(
    'three',
    { vi: '3 chỉ mục — 382 ms (+14%)', en: '3 indexes — 382 ms (+14%)' },
    {
      vi: 'Thêm đúng cái chỉ mục hữu ích ở phần trước. Ghi chậm đi 14%, đọc nhanh lên 222 lần. Đó là một cuộc đổi chác dễ chấp nhận — nhưng phải BIẾT là mình đang đổi chác.',
      en: 'This adds exactly the useful index from the previous mode. Writes get 14% slower, reads get 222× faster. That is an easy trade — but you should know you are making one.',
    },
    2600,
    [
      lines([5]),
      bar('3 chỉ mục', 382, '382', 'warn'),
      plan('3 chỉ mục (+ authorId,createdAt)  382ms   (+14%)', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'six',
    { vi: '6 chỉ mục — 552 ms (+64%), mua về con số không', en: '6 indexes — 552 ms (+64%), buying nothing' },
    {
      vi: 'Ba chỉ mục thêm vào "cho chắc" trên `title`, `pinned`, `updatedAt` không làm truy vấn nào nhanh hơn, mà làm mọi lần ghi chậm thêm 44% so với bộ hữu ích. Kích thước chỉ mục của bảng cũng đi từ 47MB lên 62MB. Mỗi chỉ mục là một cấu trúc dữ liệu thứ hai mà cơ sở dữ liệu phải bảo trì trên MỌI `INSERT`, `UPDATE` và `DELETE`.',
      en: 'Three speculative indexes on `title`, `pinned` and `updatedAt` made no query faster and made every write 44% slower than the useful set. The table\'s index size also went from 47MB to 62MB. Every index is a second data structure the database maintains on EVERY `INSERT`, `UPDATE` and `DELETE`.',
    },
    2900,
    [
      lines([6]),
      bar('6 chỉ mục', 552, '552', 'err'),
      plan('6 chỉ mục (+ title, pinned, updatedAt) 552ms (+64%)', 'err'),
      plan('kích thước chỉ mục: 47MB → 62MB', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: '"Thêm chỉ mục cho mọi cột xuất hiện trong WHERE" là lời khuyên TỒI.',
        en: '"Index every column that appears in a WHERE" is bad advice.',
      },
    }
  );

  push(
    'rule',
    { vi: 'Luật: chỉ mục đi kèm bằng chứng, trong cùng một pull request', en: 'The rule: an index arrives with its evidence, in the same pull request' },
    {
      vi: 'Chỉ mục hoá đúng những truy vấn chậm mà bạn ĐO ĐƯỢC, xác nhận bằng `EXPLAIN ANALYZE` rằng kế hoạch đã đổi, rồi xoá những chỉ mục không ai dùng — PostgreSQL tự chỉ ra chúng qua `pg_stat_user_indexes.idx_scan`. Trên cuongthai.com, thêm chỉ mục "cho chắc" vào bảng mà các job AI ghi vào hàng nghìn dòng đã làm chính các job đó chậm đi mà không đổi lại được gì.',
      en: 'Index the slow queries you actually MEASURED, confirm with `EXPLAIN ANALYZE` that the plan changed, then delete the indexes nobody uses — PostgreSQL points them out through `pg_stat_user_indexes.idx_scan`. On cuongthai.com, "just in case" indexes on a table the AI jobs insert into by the thousand made those jobs measurably slower for no read benefit.',
    },
    3000,
    [lines([9, 10]), plan('idx_scan = 0 → chỉ mục này chỉ tốn tiền', 'warn')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   D — BỐN CÁCH CHỈ MỤC ÂM THẦM VÔ HIỆU
   ──────────────────────────────────────────────────────────── */

function buildDefeated(): SimStep[] {
  const { steps, push } = collector();

  push(
    'works',
    { vi: 'Có chỉ mục và dùng được — 0,065 ms', en: 'Indexed and usable — 0.065 ms' },
    {
      vi: '`slug` có `unique`, và truy vấn so sánh thẳng cột với một giá trị. Index Scan, xong. Ba truy vấn tiếp theo đều chạy trên đúng bảng này, đúng chỉ mục này — và không truy vấn nào dùng được nó.',
      en: '`slug` is unique, and the query compares the bare column with a value. Index Scan, done. The next three queries run on this same table with this same index — and not one of them can use it.',
    },
    2400,
    [
      lines([1]),
      gauge('ms', 0.065, '0,065 ms', 'ok'),
      gauge('pages', 4, '4 trang', 'ok'),
      gauge('thrown', 0, '0 dòng', 'ok'),
      bar('slug =', 0.065, '0,065', 'ok'),
      plan("WHERE slug = 'bulk-4242'        Index Scan   0.065 ms", 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'fn',
    { vi: 'Một hàm bọc quanh cột — chậm hơn 1100 lần', en: 'A function around the column — 1100× slower' },
    {
      vi: '`lower(slug)` KHÔNG phải là `slug`. Cây B-Tree lưu giá trị thô, nên nó không dùng được cho một biểu thức. Truy vấn trông chỉ khác đúng năm ký tự, và chi phí đi từ 0,065 ms lên 71,771 ms. Cách chữa: lưu sẵn một cột đã chuẩn hoá, hoặc tạo chỉ mục biểu thức trên `lower(slug)`.',
      en: '`lower(slug)` is not `slug`. A B-tree stores the raw value, so it cannot serve an expression. The query differs by five characters and the cost goes from 0.065 ms to 71.771 ms. Fix: store a normalised column, or create an expression index on `lower(slug)`.',
    },
    2900,
    [
      lines([3]),
      gauge('ms', 71.771, '71,771 ms', 'err'),
      gauge('pages', 30_233, '30.233 trang', 'err'),
      gauge('thrown', 750_999, '750.999 dòng', 'err'),
      bar('lower(slug) =', 71.771, '71,8', 'err'),
      plan("WHERE lower(slug) = …   Parallel Seq Scan  71.771 ms", 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là bẫy hay gặp nhất: chỉ mục vẫn tồn tại, chỉ là không ai dùng được nó.',
        en: 'The most common trap of all: the index still exists, it just cannot be used.',
      },
    }
  );

  push(
    'like',
    { vi: 'Dấu sao đứng đầu — B-Tree sắp xếp theo TIỀN TỐ', en: 'A leading wildcard — a B-tree sorts by PREFIX' },
    {
      vi: "`LIKE '%4242'` không dùng được B-Tree, vì chỉ mục xếp theo tiền tố; `LIKE 'bulk%'` thì dùng được. Trong Prisma, `contains` dịch thành `LIKE '%…%'` và `mode: 'insensitive'` dịch thành `ILIKE` — cả hai đều là quét bảng. Muốn tìm kiếm \"chứa\" thật sự thì cần full-text search hoặc chỉ mục trigram.",
      en: "`LIKE '%4242'` cannot use a B-tree, because the index is sorted by prefix; `LIKE 'bulk%'` can. In Prisma, `contains` compiles to `LIKE '%…%'` and `mode: 'insensitive'` compiles to `ILIKE` — both seq scans. Real \"contains\" search needs full-text search or a trigram index.",
    },
    2800,
    [
      lines([5]),
      gauge('ms', 35.947, '35,947 ms', 'err'),
      bar("LIKE '%4242'", 35.947, '35,9', 'err'),
      plan("WHERE slug LIKE '%4242'  Parallel Seq Scan  35.947 ms", 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'others',
    { vi: 'Không có chỉ mục, sai kiểu, hoặc lọc quá lỏng', en: 'No index, wrong type, or too little selectivity' },
    {
      vi: '`title` đơn giản là không có chỉ mục: 31,801 ms. So sánh cột `text` với một con số có thể sinh ra một phép ép kiểu làm chỉ mục vô hiệu. Và chỉ mục trên `pinned` (đúng hai giá trị) thường bị bỏ qua có chủ ý — đọc 40% bảng thông qua chỉ mục còn chậm hơn đọc thẳng.',
      en: '`title` simply has no index: 31.801 ms. Comparing a `text` column with a number can force a cast that disables the index. And an index on `pinned` (two possible values) is usually ignored on purpose — reading 40% of a table through an index is slower than reading it straight through.',
    },
    2800,
    [
      lines([7]),
      gauge('ms', 31.801, '31,801 ms', 'err'),
      bar('title = (không có chỉ mục)', 31.801, '31,8', 'err'),
      plan('WHERE title = …    Parallel Seq Scan   31.801 ms', 'err'),
    ],
    { sfx: 'blip' }
  );

  push(
    'count',
    { vi: '`count(*)` cũng không miễn phí — 40,018 ms', en: '`count(*)` is not free either — 40.018 ms' },
    {
      vi: 'PostgreSQL không lưu sẵn số dòng: `count(*)` đọc bảng (hoặc trọn một chỉ mục) mỗi lần được gọi. Một endpoint danh sách trả về `{ items, total }` trả cái giá này ở MỌI trang. Với bảng lớn, hoặc bỏ con số chính xác khỏi hợp đồng API, hoặc lấy ước lượng của bộ lập kế hoạch: `SELECT reltuples FROM pg_class WHERE relname = \'Note\'` — vài micro-giây.',
      en: 'PostgreSQL keeps no stored row count: `count(*)` reads the table (or a whole index) every single time. A list endpoint returning `{ items, total }` pays this on EVERY page. For big tables either drop the exact total from the API contract, or take the planner\'s estimate: `SELECT reltuples FROM pg_class WHERE relname = \'Note\'` — microseconds.',
    },
    3000,
    [
      lines([9]),
      gauge('ms', 40.018, '40,018 ms', 'err'),
      bar('count(*)', 40.018, '40,0', 'err'),
      plan('SELECT count(*)    Parallel Seq Scan   40.018 ms', 'err'),
      plan('reltuples ≈ 751000   →   vài micro-giây', 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsIndexScenario: Scenario = {
  id: 'nodejs-index-explain',
  name: { vi: 'Chỉ mục và EXPLAIN ANALYZE', en: 'Indexes and EXPLAIN ANALYZE' },
  tagline: {
    vi: 'Cùng một truy vấn trên 751.000 dòng: chưa có chỉ mục thì 28,618 ms và đi bộ qua 30.233 trang; có chỉ mục đúng thì 0,129 ms và năm trang — nhanh hơn 222 lần, chủ yếu vì node Sort biến mất. Kèm cái giá phải trả khi ghi và bốn cách chỉ mục âm thầm vô hiệu.',
    en: 'The same query over 751,000 rows: with no index, 28.618 ms walking 30,233 pages; with the right index, 0.129 ms and five pages — 222× faster, mostly because the Sort node disappears. Plus the write tax, and four ways an index quietly does nothing.',
  },
  icon: Search,
  accent: '#34d399',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '7.5',
    slug: 'nodejs-7-5-chi-muc-va-explain',
    title: { vi: 'Chỉ mục, và cách đọc EXPLAIN ANALYZE', en: 'Indexes, and reading EXPLAIN ANALYZE' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Xem gì', en: 'What to watch' },
      defaultValue: 'before',
      choices: [
        {
          value: 'before',
          label: 'Chưa có chỉ mục',
          fullLabel: 'Seq Scan — 28,618 ms, vứt đi 490.980 dòng',
          color: '#f43f5e',
          hint: { vi: 'đọc trọn bảng để lấy hai mươi dòng', en: 'the whole table read to return twenty rows' },
        },
        {
          value: 'after',
          label: 'Có chỉ mục',
          fullLabel: 'Index Scan — 0,129 ms, 5 trang, hết Sort',
          color: '#34d399',
          hint: { vi: 'nhanh hơn 222 lần', en: '222× faster' },
        },
        {
          value: 'writes',
          label: 'Thuế ghi',
          fullLabel: 'Chèn 50.000 dòng: 336 → 382 → 552 ms',
          color: '#f59e0b',
          hint: { vi: 'chỉ mục không miễn phí', en: 'indexes are not free' },
        },
        {
          value: 'defeated',
          label: 'Chỉ mục vô hiệu',
          fullLabel: 'lower() · LIKE %… · sai kiểu · count(*)',
          color: '#a78bfa',
          hint: { vi: 'chỉ mục vẫn còn đó, chỉ là không ai dùng được', en: 'the index is still there, just unusable' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.mode === 'after'
      ? buildAfter()
      : opts.mode === 'writes'
        ? buildWrites()
        : opts.mode === 'defeated'
          ? buildDefeated()
          : buildBefore(),
};
