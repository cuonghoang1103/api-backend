/** PostgreSQL · 10.4 — BUFFERS và quy trình tinh chỉnh; work_mem cho một giao dịch. */
import { mod, pg, cs, q, ord, sau, ma, tn, TN } from './_chung.mjs';
import { O_EVENT, EVENT } from './_du-lieu.mjs';

const Q_SORT = "SELECT id, email, amount FROM event ORDER BY email";
const LOWMEM = `${EVENT}\nSET LOCAL work_mem = '64kB';   -- this database was configured with a tiny work_mem`;

export default mod('postgresql-10-4-buffers-tinh-chinh', '10.4 BUFFERS and a tuning workflow', [
  pg({
    csdl: LOWMEM, tenCsdl: 'event', ld: { en: O_EVENT.ld.en + '<p>In this task the session starts with <code>work_mem = 64kB</code>.</p>', vi: O_EVENT.ld.vi + '<p>Trong bài này phiên bắt đầu với <code>work_mem = 64kB</code>.</p>' },
    t: 'Stop the sort from spilling to disk — for this transaction only', k: 'MEDIUM', p: 8, kn: ['work_mem', 'SET LOCAL', 'Sort Method'], tag: ['tuning', 'work_mem'],
    en: `<p>The export <code>${Q_SORT}</code> shows <code>Sort Method: external merge  Disk: 928kB</code>: work_mem is 64 kB. Raise work_mem <b>for this transaction only</b> so the sort runs in memory (<code>quicksort</code>). Do not use plain SET or ALTER SYSTEM.</p>`,
    vi: `<p>Lệnh xuất <code>${Q_SORT}</code> hiện <code>Sort Method: external merge  Disk: 928kB</code>: work_mem là 64 kB. Tăng work_mem <b>chỉ cho giao dịch này</b> để phép sắp chạy trong bộ nhớ (<code>quicksort</code>). Không dùng SET thường hay ALTER SYSTEM.</p>`,
    yc: [['<code>SET LOCAL work_mem = \'…\'</code> with a value large enough (a few MB).', '<code>SET LOCAL work_mem = \'…\'</code> với giá trị đủ lớn (vài MB).'], ['Only this statement — nothing else changes.', 'Chỉ câu này — không đổi gì khác.']],
    giai: `SET LOCAL work_mem = '8MB';    -- the sort needs ~1.6 MB in memory; LOCAL ends with the transaction`,
    kiem: [
      sau(['The sort is now an in-memory quicksort', 'Phép sắp giờ là quicksort trong bộ nhớ'], `SELECT plan_analyze('${Q_SORT}') ~ 'Sort Method: quicksort' AS in_memory`),
      sau(['work_mem is raised inside this transaction', 'work_mem được tăng trong giao dịch này'], "SELECT setting::int >= 2048 AS raised FROM pg_settings WHERE name = 'work_mem'"),
      ma(['SET LOCAL (not SET / ALTER SYSTEM)', 'SET LOCAL (không SET / ALTER SYSTEM)'], 'SET\\s+LOCAL\\s+work_mem'),
    ],
    sai: ["SET LOCAL work_mem = '256kB'", "SET work_mem = '8MB'"],
    gy: [['work_mem is per sort/hash operation, per query — not per server.', 'work_mem tính cho mỗi phép sắp/băm, mỗi truy vấn — không phải cho cả máy chủ.'], ['Units: \'8MB\', \'16MB\'.', 'Đơn vị: \'8MB\', \'16MB\'.']],
    lhg: [['Too small (256 kB): still external merge.', 'Quá nhỏ (256 kB): vẫn external merge.'], ['A plain SET on a pooled connection, or raising work_mem globally: 100 connections × several sorts each can exhaust RAM.', 'SET thường trên kết nối trong pool, hoặc tăng work_mem toàn cục: 100 kết nối × vài phép sắp mỗi cái có thể cạn RAM.']],
    gt: ['<p>"external merge Disk" means temporary files. Raising work_mem for the one heavy query (SET LOCAL inside its transaction, or per role) fixes it without risking memory for every connection.</p>', '<p>"external merge Disk" nghĩa là tệp tạm. Tăng work_mem cho riêng truy vấn nặng (SET LOCAL trong giao dịch của nó, hoặc theo role) sửa được mà không đánh cược bộ nhớ của mọi kết nối.</p>'],
    tn: [tn('work_mem', 'bộ nhớ cho mỗi phép sắp/băm'), tn('SET LOCAL', 'đặt cho riêng giao dịch')],
  }),

  cs({
    t: 'The tuning workflow, in order', k: 'EASY', p: 4, loai: 'order', kn: ['measure → diagnose → fix → verify'], tag: ['tuning'],
    en: '<p>A user reports "the orders page is slow". Order the steps of lesson 10.4\'s workflow.</p>', vi: '<p>Người dùng báo "trang đơn hàng chậm". Sắp các bước của quy trình bài 10.4.</p>',
    cau: [ord('o1', ['Measure first, change last', 'Đo trước, sửa sau'], [
      'Capture the exact slow query with its parameters / lấy đúng câu truy vấn chậm kèm tham số',
      'Run EXPLAIN (ANALYZE, BUFFERS) on a realistic copy of the data / chạy EXPLAIN (ANALYZE, BUFFERS) trên bản sao dữ liệu thật',
      'Find the node where time and buffers go, compare estimate vs actual / tìm nút tốn thời gian và buffer, so ước lượng với thực tế',
      'Apply ONE change (index, rewrite, ANALYZE, work_mem) / áp dụng MỘT thay đổi (chỉ mục, viết lại, ANALYZE, work_mem)',
      'Measure again with the same command and keep the change only if it helps / đo lại bằng cùng lệnh, chỉ giữ thay đổi nếu nó giúp',
    ], ['Changing several things at once makes it impossible to know which one helped — or which one hurt.', 'Đổi nhiều thứ cùng lúc thì không biết cái nào giúp — hay cái nào làm hại.'])],
    gy: [['No guessing before measuring.', 'Không đoán trước khi đo.'], ['One change per measurement.', 'Mỗi lần đo một thay đổi.']],
    lhg: [['Adding indexes on every column first, measuring later.', 'Thêm chỉ mục cho mọi cột trước, đo sau.'], ['Testing on an empty development database where every plan is fast.', 'Thử trên CSDL phát triển rỗng nơi kế hoạch nào cũng nhanh.']],
    tn: [tn('tuning workflow', 'quy trình tinh chỉnh')],
  }),

  cs({
    t: 'Reading BUFFERS', k: 'MEDIUM', p: 5, kn: ['shared hit', 'shared read', 'temp'], tag: ['tuning', 'explain'],
    en: '<p>Interpret the BUFFERS line of EXPLAIN (ANALYZE, BUFFERS).</p>', vi: '<p>Diễn giải dòng BUFFERS của EXPLAIN (ANALYZE, BUFFERS).</p>',
    cau: [
      q('q1', ['<code>Buffers: shared hit=12 read=4800</code> on the first run, <code>shared hit=4812</code> on the second. Why?', '<code>Buffers: shared hit=12 read=4800</code> lần chạy đầu, <code>shared hit=4812</code> lần hai. Vì sao?'], ['run 1 fetched the pages, run 2 found them cached', 'run 2 needed fewer pages to answer the query', 'the index was rebuilt between the two runs', 'ANALYZE changed the plan between the runs'], ['Same number of pages touched (4 812 × 8 kB ≈ 38 MB); only where they came from changed. Compare plans with a warm cache.', 'Cùng số trang được chạm (4 812 × 8 kB ≈ 38 MB); chỉ khác nơi lấy chúng. So kế hoạch khi bộ đệm đã ấm.']),
      q('q2', ['<code>Buffers: temp read=116 written=116</code> under a Sort node means…', '<code>Buffers: temp read=116 written=116</code> dưới nút Sort nghĩa là…'], ['the sort spilled to temporary files (work_mem too small for it)', 'the table is temporary', 'a temp table was created by the user', 'the sort used an index'], ['temp buffers are spill files of sorts and hashes; they pair with "external merge" or hash "Batches: &gt; 1".', 'temp buffer là tệp tràn của phép sắp và băm; chúng đi cùng "external merge" hoặc "Batches: &gt; 1" của băm.']),
      q('q3', ['A query reads 50 000 shared buffers to return 10 rows. What does that suggest?', 'Một truy vấn đọc 50 000 buffer để trả 10 dòng. Điều đó gợi ý gì?'], ['too many pages per row: an index is missing', 'the server simply needs more RAM', 'nothing: 50 000 buffers is a normal cost', 'the network between app and server is slow'], ['Pages touched per row returned is the key efficiency ratio; a good index lookup touches a handful of pages.', 'Số trang chạm trên mỗi dòng trả về là tỷ lệ hiệu quả then chốt; tra chỉ mục tốt chỉ chạm vài trang.']),
    ],
    gy: [['hit = found in shared buffers, read = had to fetch it.', 'hit = có sẵn trong shared buffers, read = phải đi lấy.'], ['8 kB per buffer.', 'Mỗi buffer 8 kB.']],
    lhg: [['Judging a plan by one cold-cache run.', 'Đánh giá kế hoạch qua một lần chạy bộ đệm nguội.'], ['Ignoring temp buffers.', 'Bỏ qua temp buffer.']],
    tn: [tn('shared buffers', 'bộ đệm dùng chung'), TN.explain],
  }),
]);
