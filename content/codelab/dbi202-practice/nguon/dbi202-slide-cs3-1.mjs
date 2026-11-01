/**
 * DBI202 · ⭐ CS.3 phần 1 — quét toàn bảng, B+tree (tìm điểm, tìm khoảng, tách trang), chiều cao cây, heap/clustered/nonclustered,
 * Key Lookup, độ chọn lọc và điểm bùng phát (slide 1–12). Số chiều cao cây đo thật (INDEXPROPERTY … 'IndexDepth').
 */
import { mod, cs, q, ord, bang1, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs3-1', '⭐ CS.3 Indexes in depth (1): B+tree, storage, lookups', [
  cs({
    t: 'Walk a B+tree: find one key, then a range', k: 'EASY', p: 5, loai: 'order',
    kn: ['B+tree', 'point search', 'range search'], tag: ['advanced', 'index'],
    en: '<p>Slides 4–6. Order the steps of <code>WHERE ma BETWEEN 5000 AND 5100</code> on a clustered B+tree index.</p>',
    vi: '<p>Slide 4–6. Sắp các bước của <code>WHERE ma BETWEEN 5000 AND 5100</code> trên chỉ mục cụm B+tree.</p>',
    cau: [ord('o1', ['First → last', 'Đầu → cuối'], ['Read the root page', 'Pick the child whose key range contains 5000', 'Repeat down the internal levels', 'Reach the leaf page that holds 5000', 'Follow the leaf-to-leaf link to the next pages', 'Stop at the first key greater than 5100'],
      ['Seek once to the start of the range, then read the leaves sideways — the leaf level is a linked list in key order.', 'Seek một lần tới đầu khoảng, rồi đọc ngang các lá — tầng lá là danh sách liên kết theo thứ tự khoá.'])],
    gy: [['Down the tree once, then sideways.', 'Xuống cây một lần, rồi đi ngang.'], ['Only leaves hold all keys (B+tree).', 'Chỉ lá chứa đủ mọi khoá (B+tree).']],
    lhg: [['Going back to the root for every key of the range.', 'Quay về gốc cho từng khoá của khoảng.'], ['Thinking the scan stops at the last row returned instead of the first key past 5100.', 'Tưởng việc quét dừng ở dòng cuối trả về thay vì khoá đầu tiên vượt 5100.']],
    tn: [tn('B+tree', 'cây B+'), tn('leaf level', 'tầng lá')],
  }),
  cs({
    t: 'Tree height: why 3–4 reads find one row among millions', k: 'MEDIUM', p: 7,
    kn: ['fan-out', 'tree height', 'key width'], tag: ['advanced', 'index'],
    en: '<p>Slides 7–8, with numbers measured on SQL Server (two 200,000-row tables).</p>', vi: '<p>Slide 7–8, số đo thật trên SQL Server (hai bảng 200.000 dòng).</p>',
    cau: [
      q('c1', ['An INT primary key on 200,000 rows has 322 leaf pages and 1 root. How many levels?', 'Khoá chính INT trên 200.000 dòng có 322 trang lá và 1 gốc. Bao nhiêu tầng?'], ['2', '1', '3', '18'], ['Root + leaves = 2 levels: one root page can point to hundreds of leaves.', 'Gốc + lá = 2 tầng: một trang gốc trỏ được hàng trăm lá.']),
      q('c2', ['The same 200,000 numbers stored as a CHAR(200) key: 5,264 leaf pages. Measured depth?', 'Cùng 200.000 số lưu thành khoá CHAR(200): 5.264 trang lá. Độ sâu đo được?'], ['4: wide keys mean few children per internal page', '2, the same as the INT key', '3, depth only depends on the row count', '18, about log₂ of 200,000'], ['5,264 → 277 → 14 → 1. Each internal entry is ~200 bytes, so fan-out is tens, not hundreds.', '5.264 → 277 → 14 → 1. Mỗi mục trong là ~200 byte nên độ rẽ nhánh là hàng chục, không phải hàng trăm.']),
      q('c3', ['Why is a B+tree so shallow compared with a binary tree?', 'Vì sao B+tree nông hơn nhiều so với cây nhị phân?'], ['each node is a whole page with hundreds of children', 'it stores only the first column of each row', 'it is rebuilt every night to stay balanced', 'it keeps the whole tree in RAM at all times'], ['Fan-out ≈ 8 KB ÷ entry size. A million INT keys fit in 3 levels.', 'Độ rẽ nhánh ≈ 8 KB ÷ kích thước mục. Một triệu khoá INT vừa 3 tầng.']),
      q('c4', ['Inserting a key into a full leaf page causes…', 'Chèn một khoá vào trang lá đã đầy gây ra…'], ['a page split: half the rows move to a new page', 'the insert to fail until a rebuild', 'the key to go to an overflow heap', 'the whole index to be rebuilt'], ['Splits leave half-empty pages (fragmentation) — one reason random keys such as GUIDs cost more.', 'Tách trang để lại trang nửa trống (phân mảnh) — một lý do khoá ngẫu nhiên như GUID tốn hơn.']),
    ],
    gy: [['Levels = how many pages a seek reads.', 'Số tầng = số trang một lần seek đọc.'], ['Narrow keys ⇒ high fan-out ⇒ short tree.', 'Khoá hẹp ⇒ rẽ nhánh lớn ⇒ cây thấp.']],
    lhg: [['Using log₂(n) — that is a binary tree, not a B+tree.', 'Dùng log₂(n) — đó là cây nhị phân, không phải B+tree.'], ['Thinking depth depends only on the number of rows.', 'Tưởng độ sâu chỉ phụ thuộc số dòng.']],
    tn: [tn('fan-out', 'độ rẽ nhánh'), tn('page split', 'tách trang')],
  }),
  cs({
    t: 'Where do the rows live? Heap, clustered, nonclustered, PostgreSQL', k: 'MEDIUM', p: 6, loai: 'table',
    kn: ['heap', 'clustered index', 'nonclustered index', 'RID', 'ctid'], tag: ['advanced', 'index', 'postgresql'],
    en: '<p>Slides 9–10. For each structure, say where the full rows are stored and what an index entry points to.</p>',
    vi: '<p>Slide 9–10. Với mỗi cấu trúc, nói dòng đầy đủ nằm ở đâu và mục chỉ mục trỏ tới gì.</p>',
    bang: [bang1('b1', ['Structure → rows → pointer', 'Cấu trúc → dòng → con trỏ'],
      [{ ma: 'ct', ten: 'Structure / Cấu trúc' },
        { ma: 'dong', ten: 'Full rows live in…', luaChon: ['the leaf level of the index itself', 'an unordered heap'] },
        { ma: 'tro', ten: 'Index entries point to…', luaChon: ['the clustered key', 'a RID (file:page:slot)', 'a ctid (block, item)', 'nothing: the leaf is the row'] }],
      [{ o: { ct: 'SQL Server clustered index' }, a: { dong: 'the leaf level of the index itself', tro: 'nothing: the leaf is the row' } },
        { o: { ct: 'SQL Server nonclustered index on a clustered table' }, a: { dong: 'the leaf level of the index itself', tro: 'the clustered key' } },
        { o: { ct: 'SQL Server nonclustered index on a heap' }, a: { dong: 'an unordered heap', tro: 'a RID (file:page:slot)' } },
        { o: { ct: 'Any PostgreSQL index' }, a: { dong: 'an unordered heap', tro: 'a ctid (block, item)' } }],
      ['On a clustered table the rows live in the clustered index leaves, so a nonclustered entry carries the clustered key (Key Lookup). PostgreSQL tables are always heaps; CLUSTER orders them only once.', 'Trên bảng có chỉ mục cụm, dòng nằm ở lá chỉ mục cụm nên mục nonclustered mang khoá cụm (Key Lookup). Bảng PostgreSQL luôn là heap; CLUSTER chỉ sắp một lần.'])],
    gy: [['Clustered = the table IS the tree.', 'Clustered = bảng CHÍNH LÀ cây.'], ['Heap ⇒ physical address (RID / ctid).', 'Heap ⇒ địa chỉ vật lý (RID / ctid).']],
    lhg: [['Thinking a nonclustered entry on a clustered table stores a RID.', 'Tưởng mục nonclustered trên bảng có cụm lưu RID.'], ['Thinking PostgreSQL has clustered indexes maintained like SQL Server.', 'Tưởng PostgreSQL có chỉ mục cụm được duy trì như SQL Server.']],
    tn: [tn('clustered index', 'chỉ mục cụm'), tn('RID lookup', 'tra theo RID')],
  }),
  cs({
    t: 'Key Lookup, selectivity and the tipping point', k: 'HARD', p: 7,
    kn: ['Key Lookup', 'selectivity', 'tipping point'], tag: ['advanced', 'index', 'performance'],
    en: '<p>Slides 11–12. A nonclustered index exists on <code>DonHang(khachHangId)</code>; queries select every column.</p>',
    vi: '<p>Slide 11–12. Có chỉ mục nonclustered trên <code>DonHang(khachHangId)</code>; truy vấn lấy mọi cột.</p>',
    cau: [
      q('c1', ['For WHERE khachHangId = 42 (10 rows of 50,000), the plan is…', 'Với WHERE khachHangId = 42 (10 dòng trên 50.000), kế hoạch là…'], ['Index Seek + 10 Key Lookups (Nested Loops)', 'Clustered Index Scan of the whole table', 'Index Scan of the nonclustered index', 'Table Scan followed by a Sort'], ['Few rows: a seek plus one lookup per row is cheap.', 'Ít dòng: seek cộng một lần tra mỗi dòng là rẻ.']),
      q('c2', ['Each Key Lookup costs about…', 'Mỗi Key Lookup tốn khoảng…'], ['one seek into the clustered index: 2–3 page reads', 'one page read in total for all rows', 'a full scan of the clustered index', 'nothing: the columns come from the index'], ['That is why 5,000 lookups can cost more than scanning a few hundred pages.', 'Vì thế 5.000 lần tra có thể tốn hơn quét vài trăm trang.']),
      q('c3', ['The tipping point is…', 'Điểm bùng phát là…'], ['the row count past which a scan becomes cheaper than seek + lookups', 'the moment a page split happens', 'the size at which statistics are refreshed', 'the depth at which a B+tree adds a level'], ['It is often well under 1% of the table, far lower than intuition says.', 'Nó thường dưới 1% bảng, thấp hơn nhiều so với trực giác.']),
      q('c4', ['How do you keep the seek for a query that returns 2,000 rows?', 'Làm sao giữ seek cho truy vấn trả 2.000 dòng?'], ['make the index covering (INCLUDE the selected columns)', 'add a query hint to force the old plan', 'rebuild the index with a higher fill factor', 'update statistics with FULLSCAN every hour'], ['No lookups ⇒ the seek stays cheap at any row count.', 'Không còn lần tra ⇒ seek vẫn rẻ với số dòng bất kỳ.']),
    ],
    gy: [['Lookups scale with the number of rows; scans with the number of pages.', 'Lần tra tăng theo số dòng; quét tăng theo số trang.'], ['Covering indexes remove lookups.', 'Chỉ mục phủ loại bỏ lần tra.']],
    lhg: [['"An index always helps."', '"Có chỉ mục là luôn nhanh hơn."'], ['Forcing a seek with a hint instead of fixing the index.', 'Ép seek bằng hint thay vì sửa chỉ mục.']],
    tn: [tn('selectivity', 'độ chọn lọc'), tn('tipping point', 'điểm bùng phát'), tn('Key Lookup', 'tra ngược theo khoá')],
  }),
]);
