/**
 * DBI202 · ⭐ CS.3 phần 2 — chỉ mục ghép (tiền tố trái), INCLUDE, filtered/partial, SARGable, chỉ mục khoá ngoại, cái giá của chỉ mục,
 * Hash/GIN/GiST/BRIN, đọc kế hoạch (slide 13–25). Đề SARGable chấm trong trình duyệt trên bản nhỏ của bảng DonHang.
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, tn } from './_chung.mjs';
import { DH, LUOC_DO_DH } from './_du-lieu.mjs';

export default mod('dbi202-slide-cs3-2', '⭐ CS.3 Indexes in depth (2): composite, SARGable, plans', [
  de({
    csdl: DH, tenCsdl: 'DonHang', ld: LUOC_DO_DH,
    t: 'Make three conditions SARGable — same answers, index-friendly', k: 'MEDIUM', p: 12,
    kn: ['SARGable', 'half-open date range', 'prefix LIKE'], tag: ['advanced', 'index', 'sargable'],
    en: `<p>Slides 17–18. Indexes exist on <code>ngayDat</code>, <code>tongTien</code> and <code>maDon</code>, yet these three counts scan because each wraps the column in a function or an expression:</p>
<pre>SELECT (SELECT COUNT(*) FROM DonHang WHERE YEAR(ngayDat) = 2025)              AS don_2025,
       (SELECT COUNT(*) FROM DonHang WHERE tongTien + 100000 &gt; 3000000)         AS don_lon,
       (SELECT COUNT(*) FROM DonHang WHERE SUBSTRING(maDon, 1, 4) = 'DH42')     AS ma_dh42;</pre>
<p>Rewrite the three conditions so the <b>bare column</b> stands alone on one side, returning exactly the same three counts.</p>`,
    vi: `<p>Slide 17–18. Có chỉ mục trên <code>ngayDat</code>, <code>tongTien</code> và <code>maDon</code>, nhưng ba phép đếm này vẫn quét vì mỗi câu bọc cột trong hàm hoặc biểu thức:</p>
<pre>SELECT (SELECT COUNT(*) FROM DonHang WHERE YEAR(ngayDat) = 2025)              AS don_2025,
       (SELECT COUNT(*) FROM DonHang WHERE tongTien + 100000 &gt; 3000000)         AS don_lon,
       (SELECT COUNT(*) FROM DonHang WHERE SUBSTRING(maDon, 1, 4) = 'DH42')     AS ma_dh42;</pre>
<p>Viết lại ba điều kiện để <b>cột trần</b> đứng một mình một vế, trả đúng ba con số như cũ.</p>`,
    yc: [['One SELECT with the columns don_2025, don_lon, ma_dh42.', 'Một câu SELECT với các cột don_2025, don_lon, ma_dh42.'], ['No YEAR(), SUBSTRING() or arithmetic on the column: a half-open date range, a moved constant, a prefix LIKE.', 'Không YEAR(), SUBSTRING() hay phép tính trên cột: khoảng ngày nửa mở, chuyển hằng sang vế kia, LIKE tiền tố.']],
    giai: `SELECT
  (SELECT COUNT(*) FROM DonHang WHERE ngayDat >= '2025-01-01' AND ngayDat < '2026-01-01') AS don_2025,  -- half-open range
  (SELECT COUNT(*) FROM DonHang WHERE tongTien > 2900000)                                AS don_lon,   -- move the constant
  (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH42%')                                AS ma_dh42;   -- prefix LIKE`,
    kiem: [
      kq(['The three counts', 'Ba con số']),
      kqAn(['Edge cases: last day of 2025, first day of 2026, amount just above 2,900,000, DH42 in the middle of a code', 'Ca biên: ngày cuối 2025, ngày đầu 2026, tiền vừa trên 2.900.000, DH42 nằm giữa mã'], "INSERT INTO DonHang VALUES (21, 'DH42X', 7, '2025-12-31', 'XONG', 2900000), (22, 'XDH42', 7, '2026-01-01', 'XONG', 2900001), (23, 'DH4', 7, '2024-12-31', 'CHO', 2899999)"),
      ma(['No YEAR() on the column', 'Không YEAR() trên cột'], '\\bYEAR\\s*\\(', true),
      ma(['No SUBSTRING()/LEFT() on the column', 'Không SUBSTRING()/LEFT() trên cột'], '\\b(SUBSTRING|LEFT)\\s*\\(', true),
      ma(['No arithmetic on tongTien', 'Không phép tính trên tongTien'], 'tongTien\\s*[-+*/]', true),
    ],
    sai: [
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat BETWEEN '2025-01-01' AND '2026-01-01') AS don_2025, (SELECT COUNT(*) FROM DonHang WHERE tongTien > 2900000) AS don_lon, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH42%') AS ma_dh42;`,
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat >= '2025-01-01' AND ngayDat < '2026-01-01') AS don_2025, (SELECT COUNT(*) FROM DonHang WHERE tongTien >= 2900000) AS don_lon, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH42%') AS ma_dh42;`,
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat >= '2025-01-01' AND ngayDat < '2026-01-01') AS don_2025, (SELECT COUNT(*) FROM DonHang WHERE tongTien > 2900000) AS don_lon, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE '%DH42%') AS ma_dh42;`,
      `SELECT (SELECT COUNT(*) FROM DonHang WHERE ngayDat > '2025-01-01' AND ngayDat < '2025-12-31') AS don_2025, (SELECT COUNT(*) FROM DonHang WHERE tongTien > 2900000) AS don_lon, (SELECT COUNT(*) FROM DonHang WHERE maDon LIKE 'DH42%') AS ma_dh42;`,
    ],
    gy: [['YEAR(d) = 2025 ⇔ d >= \'2025-01-01\' AND d < \'2026-01-01\' — works for DATE and DATETIME alike.', 'YEAR(d) = 2025 ⇔ d >= \'2025-01-01\' AND d < \'2026-01-01\' — đúng cho cả DATE lẫn DATETIME.'], ['x + 100000 > 3000000 ⇔ x > 2900000; SUBSTRING(s, 1, 4) = \'DH42\' ⇔ s LIKE \'DH42%\'.', 'x + 100000 > 3000000 ⇔ x > 2900000; SUBSTRING(s, 1, 4) = \'DH42\' ⇔ s LIKE \'DH42%\'.']],
    lhg: [['BETWEEN \'2025-01-01\' AND \'2026-01-01\' — includes New Year\'s Day of 2026.', 'BETWEEN \'2025-01-01\' AND \'2026-01-01\' — tính cả ngày đầu năm 2026.'], ['LIKE \'%DH42%\' — a leading % is not SARGable and also matches DH42 in the middle.', 'LIKE \'%DH42%\' — % ở đầu không SARGable và còn khớp DH42 ở giữa.']],
    gt: ['<p>SARGable = Search ARGument-able: the optimizer can seek only when the indexed column appears bare. Every rewrite here is an exact equivalence, so the counts cannot change — always prove that with the same data before swapping a query in production.</p>', '<p>SARGable = dùng được làm đối số tìm kiếm: bộ tối ưu chỉ seek được khi cột có chỉ mục đứng trần. Mỗi cách viết lại ở đây là tương đương chính xác nên con số không đổi — luôn chứng minh điều đó trên cùng dữ liệu trước khi thay truy vấn trên production.</p>'],
    tn: [tn('SARGable', 'dùng được cho tìm kiếm theo chỉ mục'), tn('half-open interval', 'khoảng nửa mở')],
  }),
  cs({
    t: 'PostgreSQL index types: pick the right one', k: 'MEDIUM', p: 6, loai: 'table',
    kn: ['B-tree', 'Hash', 'GIN', 'GiST', 'BRIN'], tag: ['advanced', 'index', 'postgresql'],
    en: '<p>Slide 21. For each workload, choose the PostgreSQL index type that fits best.</p>', vi: '<p>Slide 21. Với mỗi kiểu tải, chọn loại chỉ mục PostgreSQL hợp nhất.</p>',
    bang: [bang1('b1', ['Workload → index type', 'Tải → loại chỉ mục'],
      [{ ma: 'vc', ten: 'Workload / Tải' }, { ma: 'lo', ten: 'Index', luaChon: ['B-tree', 'GIN', 'GiST', 'BRIN', 'Hash'] }],
      [{ o: { vc: 'WHERE email = $1 and ORDER BY created_at (the everyday case)' }, a: { lo: 'B-tree' } },
        { o: { vc: 'tags text[] @> ARRAY[\'sql\'], jsonb containment, full-text search' }, a: { lo: 'GIN' } },
        { o: { vc: 'booking periods that must not overlap (tstzrange &&), nearest point on a map' }, a: { lo: 'GiST' } },
        { o: { vc: 'a 2-billion-row append-only log filtered by time, where the index must stay tiny' }, a: { lo: 'BRIN' } },
        { o: { vc: 'only "=" on a long key, never ranges or sorting' }, a: { lo: 'Hash' } }],
      ['B-tree is the default and the answer 90% of the time. GIN indexes the elements inside a value, GiST handles overlap/distance, BRIN stores one summary per block range of a naturally ordered table.', 'B-tree là mặc định và là câu trả lời 90% trường hợp. GIN đánh chỉ mục phần tử bên trong một giá trị, GiST xử lý chồng lấn/khoảng cách, BRIN lưu một tóm tắt cho mỗi dải khối của bảng vốn đã có thứ tự.'])],
    gy: [['Many values inside one column ⇒ GIN.', 'Nhiều giá trị trong một cột ⇒ GIN.'], ['Huge, naturally ordered, append-only ⇒ BRIN.', 'Rất lớn, tự có thứ tự, chỉ ghi thêm ⇒ BRIN.']],
    lhg: [['Using BRIN on randomly ordered data — its block summaries then cover everything.', 'Dùng BRIN trên dữ liệu thứ tự ngẫu nhiên — tóm tắt khối khi đó phủ mọi giá trị.'], ['Choosing Hash for ranges or ORDER BY.', 'Chọn Hash cho khoảng hoặc ORDER BY.']],
    tn: [tn('GIN (generalized inverted index)', 'chỉ mục đảo tổng quát'), tn('BRIN (block range index)', 'chỉ mục dải khối')],
  }),
  cs({
    t: 'Read the plan: what each operator tells you', k: 'MEDIUM', p: 6, loai: 'table',
    kn: ['execution plan operators'], tag: ['advanced', 'index', 'plan'],
    en: '<p>Slides 22–23. Match each plan operator (SQL Server or PostgreSQL) to its meaning.</p>', vi: '<p>Slide 22–23. Ghép mỗi toán tử kế hoạch (SQL Server hoặc PostgreSQL) với ý nghĩa.</p>',
    bang: [bang1('b1', ['Operator → meaning', 'Toán tử → ý nghĩa'],
      [{ ma: 'tt', ten: 'Operator / Toán tử' }, { ma: 'yn', ten: 'Meaning / Ý nghĩa', luaChon: ['navigates the tree to the matching keys', 'reads every page of the table', 'goes back to the table for missing columns, row by row', 'orders rows that the index did not deliver sorted', 'answers from the index alone, never touching the table', 'collects matching row addresses first, then reads those pages in order'] }],
      [{ o: { tt: 'Index Seek / Index Scan … Index Cond' }, a: { yn: 'navigates the tree to the matching keys' } },
        { o: { tt: 'Clustered Index Scan / Seq Scan' }, a: { yn: 'reads every page of the table' } },
        { o: { tt: 'Key Lookup / RID Lookup' }, a: { yn: 'goes back to the table for missing columns, row by row' } },
        { o: { tt: 'Sort' }, a: { yn: 'orders rows that the index did not deliver sorted' } },
        { o: { tt: 'Index Only Scan (PostgreSQL)' }, a: { yn: 'answers from the index alone, never touching the table' } },
        { o: { tt: 'Bitmap Heap Scan (PostgreSQL)' }, a: { yn: 'collects matching row addresses first, then reads those pages in order' } }],
      ['The 6-step diagnosis starts here: measure pages, read the plan, then look for scans with a residual WHERE, lookups and sorts.', 'Chẩn đoán 6 bước bắt đầu ở đây: đo số trang, đọc kế hoạch, rồi tìm quét có WHERE phụ, lần tra và phép sắp.'])],
    gy: [['Seek = tree navigation; scan = read everything.', 'Seek = đi theo cây; scan = đọc hết.'], ['A Sort after a seek means the index order did not match ORDER BY.', 'Sort sau seek nghĩa là thứ tự chỉ mục không khớp ORDER BY.']],
    lhg: [['Thinking "Index Scan" in SQL Server is as good as a seek — it reads the whole index.', 'Tưởng "Index Scan" của SQL Server tốt như seek — nó đọc cả chỉ mục.'], ['Ignoring the lookup count under a Nested Loops.', 'Bỏ qua số lần tra dưới Nested Loops.']],
    tn: [tn('execution plan', 'kế hoạch thực thi'), tn('index-only scan', 'quét chỉ trên chỉ mục')],
  }),
  cs({
    t: 'Composite, INCLUDE, filtered, foreign keys and the price of an index', k: 'HARD', p: 8,
    kn: ['leftmost prefix', 'INCLUDE', 'filtered index', 'FK index', 'write cost'], tag: ['advanced', 'index'],
    en: '<p>Five questions on slides 13–20.</p>', vi: '<p>Năm câu về slide 13–20.</p>',
    cau: [
      q('c1', ['Query: WHERE khachHangId = @k AND ngayDat >= @d ORDER BY ngayDat. Best key order?', 'Truy vấn: WHERE khachHangId = @k AND ngayDat >= @d ORDER BY ngayDat. Thứ tự khoá tốt nhất?'], ['(khachHangId, ngayDat): equality first, then range/sort', '(ngayDat, khachHangId): the range column first', '(ngayDat) alone, filtering the customer later', '(khachHangId) alone with ngayDat in INCLUDE'], ['Equality columns pin one slice; inside it the next column is sorted, so the range and the ORDER BY are both served.', 'Cột so bằng chốt một lát; trong lát đó cột kế đã được sắp, nên khoảng và ORDER BY đều được phục vụ.']),
      q('c2', ['INCLUDE (tongTien) puts the column…', 'INCLUDE (tongTien) đặt cột…'], ['only in the leaf level, so it cannot be sought but avoids lookups', 'in every level of the tree as an extra key', 'in a separate small table linked to the index', 'in the statistics only, not in the index pages'], ['INCLUDE columns make the index covering without widening the internal levels.', 'Cột INCLUDE làm chỉ mục phủ mà không làm rộng các tầng trong.']),
      q('c3', ['A filtered index WHERE trangThai = \'CHO\' is NOT used by WHERE trangThai = @tt because…', 'Chỉ mục lọc WHERE trangThai = \'CHO\' KHÔNG được dùng cho WHERE trangThai = @tt vì…'], ['the plan must be valid for any @tt, not only \'CHO\'', 'filtered indexes only work on numeric columns', 'parameters always force a full scan', 'the filter must be repeated in INCLUDE'], ['Write the literal (or OPTION (RECOMPILE)) so the optimizer can prove the filter holds.', 'Viết hằng (hoặc OPTION (RECOMPILE)) để bộ tối ưu chứng minh được điều kiện lọc.']),
      q('c4', ['Why index a foreign-key column such as ChiTietDon.donHangId?', 'Vì sao đánh chỉ mục cột khoá ngoại như ChiTietDon.donHangId?'], ['joins and parent deletes must find child rows; without it they scan the child table', 'SQL Server refuses a FOREIGN KEY without an index', 'it makes the referenced primary key unique', 'it stops orphan rows from being inserted'], ['Neither engine creates it for you. Measured: deleting a customer went from 4,680 to 20 pages.', 'Không hệ nào tự tạo nó. Đo thật: xoá một khách hàng từ 4.680 xuống 20 trang.']),
      q('c5', ['The main price of every extra index is…', 'Cái giá chính của mỗi chỉ mục thêm là…'], ['every INSERT/UPDATE/DELETE must also maintain it, plus space and fragmentation', 'SELECT statements become slower on that table', 'the table can no longer have a primary key', 'statistics stop being updated automatically'], ['Unused indexes are pure cost: find them with sys.dm_db_index_usage_stats / pg_stat_user_indexes.', 'Chỉ mục không dùng là chi phí thuần: tìm bằng sys.dm_db_index_usage_stats / pg_stat_user_indexes.']),
    ],
    gy: [['Equality → range/sort → INCLUDE.', 'So bằng → khoảng/sắp → INCLUDE.'], ['Filtered indexes need the literal in the query.', 'Chỉ mục lọc cần hằng trong truy vấn.']],
    lhg: [['Putting the range column first.', 'Đặt cột khoảng lên đầu.'], ['Assuming a FOREIGN KEY creates an index automatically.', 'Tưởng FOREIGN KEY tự tạo chỉ mục.']],
    tn: [tn('covering index', 'chỉ mục phủ'), tn('filtered index', 'chỉ mục lọc')],
  }),
]);
