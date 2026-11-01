/** PostgreSQL · 11.2 — MVCC: xmin, ctid, phiên bản dòng; dead tuple & bloat (bộ đếm pg_stat của máy chấm luôn 0 ⇒ phần đó là câu hỏi). */
import { mod, pg, cs, q, bang1, kq, kqAn, sau, ma, pre, tn } from './_chung.mjs';

const DEMO = `CREATE TABLE mvcc_demo (id int PRIMARY KEY, val text);
INSERT INTO mvcc_demo VALUES (1, 'first'), (2, 'second');`;
const LD = { en: pre("mvcc_demo (id int PK, val text) — (1, 'first'), (2, 'second')"), vi: pre("mvcc_demo (id int PK, val text) — (1, 'first'), (2, 'second')") };

export default mod('postgresql-11-2-mvcc', '11.2 MVCC: why readers never block writers', [
  pg({
    csdl: DEMO, tenCsdl: 'mvcc_demo', ld: LD,
    t: 'One statement, one snapshot', k: 'MEDIUM', p: 8, kn: ['statement snapshot', 'DELETE … RETURNING in a CTE', 'xmax'], tag: ['mvcc'],
    en: '<p>In ONE statement, delete row 1 (in a CTE with RETURNING) and, in the main query, count the rows of <code>mvcc_demo</code>. Return <code>deleted</code> (rows deleted by the CTE) and <code>seen</code> (rows the main query counted). Predict the numbers before you run — then explain them with MVCC.</p>',
    vi: '<p>Trong MỘT câu lệnh, xoá dòng 1 (trong một CTE có RETURNING) và, ở truy vấn chính, đếm số dòng của <code>mvcc_demo</code>. Trả về <code>deleted</code> (số dòng CTE đã xoá) và <code>seen</code> (số dòng truy vấn chính đếm được). Đoán trước con số rồi mới chạy — và giải thích bằng MVCC.</p>',
    yc: [['<code>WITH d AS (DELETE … RETURNING id) SELECT (SELECT count(*) FROM d) AS deleted, (SELECT count(*) FROM mvcc_demo) AS seen</code>.', '<code>WITH d AS (DELETE … RETURNING id) SELECT (SELECT count(*) FROM d) AS deleted, (SELECT count(*) FROM mvcc_demo) AS seen</code>.'], ['After the statement, the row really is gone.', 'Sau câu lệnh, dòng thật sự đã mất.']],
    giai: `WITH d AS (
  DELETE FROM mvcc_demo WHERE id = 1 RETURNING id
)
SELECT (SELECT count(*) FROM d)         AS deleted,   -- 1
       (SELECT count(*) FROM mvcc_demo) AS seen;      -- 2: the whole statement reads ONE snapshot taken before the delete`,
    kiem: [
      kq(['deleted 1, seen 2', 'deleted 1, seen 2']),
      sau(['After the statement only one row is left', 'Sau câu lệnh chỉ còn một dòng'], 'SELECT count(*) AS rows FROM mvcc_demo'),
      kqAn(['With more rows the snapshot still predates the delete', 'Nhiều dòng hơn thì ảnh chụp vẫn có trước lệnh xoá'], "INSERT INTO mvcc_demo VALUES (3, 'third'), (4, 'fourth')"),
      ma(['DELETE inside a CTE', 'DELETE nằm trong CTE'], 'WITH\\s+\\w+\\s+AS\\s*\\(\\s*DELETE'),
    ],
    sai: ['WITH d AS (DELETE FROM mvcc_demo WHERE id = 1 RETURNING id) SELECT (SELECT count(*) FROM d) AS deleted, (SELECT count(*) FROM mvcc_demo) - (SELECT count(*) FROM d) AS seen', 'DELETE FROM mvcc_demo WHERE id = 1; SELECT 1 AS deleted, count(*) AS seen FROM mvcc_demo;'],
    gy: [['Every part of one SQL statement (all its CTEs) reads the same snapshot.', 'Mọi phần của một câu SQL (mọi CTE của nó) đọc cùng một ảnh chụp.'], ['The delete only becomes visible to the NEXT statement.', 'Lệnh xoá chỉ hiện ra với câu lệnh KẾ TIẾP.']],
    lhg: [['Expecting seen = 1: the main query does not see the CTE\'s delete — same snapshot.', 'Mong seen = 1: truy vấn chính không thấy lệnh xoá của CTE — cùng ảnh chụp.'], ['Subtracting the deleted rows "to correct" — now the number is right for the wrong reason, and wrong as soon as the logic changes.', 'Trừ số dòng đã xoá "cho đúng" — con số đúng vì lý do sai, và sai ngay khi logic đổi.']],
    gt: ['<p>DELETE does not erase a row: it sets the version\'s xmax to the deleting transaction. Snapshots taken before that (including the snapshot of the very statement doing the delete) still see the version; later statements do not. That single rule explains why readers never wait.</p>', '<p>DELETE không xoá dòng: nó đặt xmax của phiên bản là giao dịch xoá. Ảnh chụp lấy trước đó (kể cả ảnh chụp của chính câu lệnh đang xoá) vẫn thấy phiên bản; các câu lệnh sau thì không. Chỉ một luật đó giải thích vì sao người đọc không bao giờ phải chờ.</p>'],
    tn: [tn('xmin / xmax', 'giao dịch tạo / xoá phiên bản'), tn('snapshot', 'ảnh chụp dữ liệu')],
  }),

  pg({
    csdl: DEMO, tenCsdl: 'mvcc_demo', ld: LD,
    t: 'UPDATE writes a new version: watch the ctid move', k: 'MEDIUM', p: 8, kn: ['ctid', 'UPDATE = new tuple', 'data-modifying CTE'], tag: ['mvcc'],
    en: '<p>Prove that an UPDATE does not change a row in place. In ONE statement, read the <code>ctid</code> (physical position) of row 1, update its val to <code>\'changed\'</code>, and return <code>old_ctid &lt;&gt; new_ctid AS moved</code> plus the new <code>val</code>.</p>',
    vi: '<p>Chứng minh UPDATE không sửa dòng tại chỗ. Trong MỘT câu lệnh, đọc <code>ctid</code> (vị trí vật lý) của dòng 1, cập nhật val thành <code>\'changed\'</code>, và trả về <code>old_ctid &lt;&gt; new_ctid AS moved</code> cùng <code>val</code> mới.</p>',
    yc: [['A CTE that reads the old ctid, a CTE that UPDATEs … RETURNING ctid, val.', 'Một CTE đọc ctid cũ, một CTE UPDATE … RETURNING ctid, val.'], ['Columns <code>moved, val</code>.', 'Cột <code>moved, val</code>.']],
    giai: `WITH before AS (
  SELECT ctid AS old_ctid FROM mvcc_demo WHERE id = 1
), upd AS (
  UPDATE mvcc_demo SET val = 'changed' WHERE id = 1
  RETURNING ctid AS new_ctid, val
)
SELECT b.old_ctid <> u.new_ctid AS moved, u.val
FROM before b, upd u;          -- moved = true: the new version lives at a new position; the old one is now a dead tuple`,
    kiem: [
      kq(['moved = true, val = changed', 'moved = true, val = changed']),
      ma(['Reads ctid', 'Đọc ctid'], '\\bctid\\b'),
      kqAn(['Still a new position on the second update of a row', 'Lần cập nhật thứ hai của một dòng vẫn sang vị trí mới'], "UPDATE mvcc_demo SET val = 'x' WHERE id = 1"),
    ],
    sai: ["UPDATE mvcc_demo SET val = 'changed' WHERE id = 1 RETURNING ctid <> ctid AS moved, val", "SELECT true AS moved, 'changed' AS val"],
    gy: [['All CTEs of one statement share one snapshot: <code>before</code> still sees the old version.', 'Mọi CTE của một câu lệnh dùng chung một ảnh chụp: <code>before</code> vẫn thấy phiên bản cũ.'], ['ctid = (page, line pointer).', 'ctid = (trang, con trỏ dòng).']],
    lhg: [['Comparing ctid with itself inside RETURNING — always false.', 'So ctid với chính nó trong RETURNING — luôn false.'], ['Believing UPDATE is cheaper than DELETE + INSERT in PostgreSQL — physically it IS a new tuple plus a dead one.', 'Tin rằng UPDATE rẻ hơn DELETE + INSERT trong PostgreSQL — về vật lý nó CHÍNH LÀ một tuple mới cộng một tuple chết.']],
    gt: ['<p>The old version stays on disk (invisible to new snapshots) until VACUUM reclaims it. That is the price of MVCC: dead tuples and bloat, managed by autovacuum (lesson 14.3).</p>', '<p>Phiên bản cũ nằm lại trên đĩa (vô hình với ảnh chụp mới) cho tới khi VACUUM thu hồi. Đó là cái giá của MVCC: dead tuple và bloat, do autovacuum quản lý (bài 14.3).</p>'],
    tn: [tn('ctid', 'vị trí vật lý của phiên bản dòng'), tn('dead tuple', 'phiên bản dòng đã chết')],
  }),

  cs({
    t: 'Who sees which version?', k: 'MEDIUM', p: 6, loai: 'table', kn: ['snapshot', 'visibility'], tag: ['mvcc'],
    en: `<p>Session A runs <code>BEGIN; UPDATE mvcc_demo SET val = 'A-edit' WHERE id = 1;</code> and has not committed. Isolation is the default (Read Committed). Fill in what each statement sees or does.</p>`,
    vi: `<p>Phiên A chạy <code>BEGIN; UPDATE mvcc_demo SET val = 'A-edit' WHERE id = 1;</code> và chưa commit. Mức cô lập mặc định (Read Committed). Điền điều mỗi câu lệnh thấy hoặc làm.</p>`,
    bang: [bang1('b1', ['Visibility while A is open', 'Khả năng nhìn thấy khi A còn mở'], [{ ma: 'cau', ten: 'Statement / Câu lệnh' }, { ma: 'kq', ten: 'Result', luaChon: ['first', 'A-edit', 'waits for A'] }], [
      { o: { cau: 'Session B: SELECT val FROM mvcc_demo WHERE id = 1' }, a: { kq: 'first' } },
      { o: { cau: 'Session A: SELECT val FROM mvcc_demo WHERE id = 1' }, a: { kq: 'A-edit' } },
      { o: { cau: 'Session B: UPDATE mvcc_demo SET val = \'B-edit\' WHERE id = 1' }, a: { kq: 'waits for A' } },
      { o: { cau: 'Session B, after A commits: SELECT val … WHERE id = 1' }, a: { kq: 'A-edit' } },
    ], ['Readers see the last committed version (first) and never wait; the writer sees its own change. A second writer of the SAME row must wait for the first one\'s row lock. After A commits, a new Read Committed statement sees A\'s version.', 'Người đọc thấy phiên bản đã commit gần nhất (first) và không bao giờ chờ; người ghi thấy thay đổi của chính mình. Người ghi thứ hai trên CÙNG dòng phải chờ khoá dòng của người thứ nhất. Sau khi A commit, câu lệnh Read Committed mới thấy phiên bản của A.'])],
    gy: [['Reading never blocks; writing the same row does.', 'Đọc không bao giờ bị chặn; ghi cùng một dòng thì có.'], ['Each statement in Read Committed takes a new snapshot.', 'Mỗi câu lệnh ở Read Committed lấy một ảnh chụp mới.']],
    lhg: [['Expecting B\'s SELECT to wait for A (it does in some databases with locking reads).', 'Mong SELECT của B phải chờ A (đúng ở vài hệ dùng khoá khi đọc).'], ['Expecting B to see the uncommitted A-edit (a dirty read — never in PostgreSQL).', 'Mong B thấy A-edit chưa commit (đọc bẩn — không bao giờ xảy ra trong PostgreSQL).']],
    tn: [tn('snapshot', 'ảnh chụp dữ liệu')],
  }),

  cs({
    t: 'Dead tuples, VACUUM and bloat', k: 'MEDIUM', p: 5, kn: ['dead tuples', 'VACUUM', 'VACUUM FULL'], tag: ['mvcc', 'vacuum'],
    en: '<p>Lesson 11.2 updated every row of a 100 000-row table twice. Reason about the aftermath. <i>(The browser grader cannot show pg_stat counters — its statistics collector is off — so this part is a quiz; try it in psql.)</i></p>',
    vi: '<p>Bài 11.2 cập nhật mọi dòng của bảng 100 000 dòng hai lần. Suy luận về hậu quả. <i>(Máy chấm trình duyệt không hiện bộ đếm pg_stat — bộ thu thống kê của nó tắt — nên phần này là trắc nghiệm; hãy thử trong psql.)</i></p>',
    cau: [
      q('q1', ['Right after <code>UPDATE bloat_demo SET val = val || \'!\'</code> on 100 000 rows, n_dead_tup is about…', 'Ngay sau <code>UPDATE bloat_demo SET val = val || \'!\'</code> trên 100 000 dòng, n_dead_tup khoảng…'], ['100 000 — one dead version per updated row', '0 — UPDATE edits rows in place', '200 000', '50 000'], ['Every updated row leaves its previous version behind as a dead tuple.', 'Mỗi dòng bị cập nhật để lại phiên bản trước thành một dead tuple.']),
      q('q2', ['What does a plain <code>VACUUM bloat_demo</code> do to the file size?', '<code>VACUUM bloat_demo</code> thường làm gì với kích thước tệp?'], ['nothing: it marks the space reusable', 'it shrinks the file to the live data', 'it doubles the file to make room', 'it rewrites the table into a new file'], ['Plain VACUUM frees space inside the file for reuse (no lock on reads/writes); only VACUUM FULL / pg_repack rewrite and shrink it.', 'VACUUM thường giải phóng chỗ trong tệp để dùng lại (không khoá đọc/ghi); chỉ VACUUM FULL / pg_repack mới viết lại và thu nhỏ.']),
      q('q3', ['Why is a long-running open transaction dangerous for MVCC?', 'Vì sao một giao dịch mở quá lâu nguy hiểm với MVCC?'], ['VACUUM must keep every version it could still see', 'it takes a lock on every table of the database', 'it keeps one CPU core busy until it ends', 'it switches autovacuum off for the database'], ['Dead tuples are only removable once no snapshot can see them; one forgotten "idle in transaction" session holds back cleanup for the whole database.', 'Dead tuple chỉ dọn được khi không ảnh chụp nào còn thấy chúng; một phiên "idle in transaction" bị quên giữ chân việc dọn của cả CSDL.']),
    ],
    gy: [['UPDATE = new version + dead old version.', 'UPDATE = phiên bản mới + phiên bản cũ chết.'], ['VACUUM recycles, VACUUM FULL rewrites.', 'VACUUM tái chế, VACUUM FULL viết lại.']],
    lhg: [['Running VACUUM FULL routinely — it takes an exclusive lock and rewrites the whole table.', 'Chạy VACUUM FULL thường xuyên — nó khoá độc quyền và viết lại cả bảng.'], ['Leaving transactions open in an app (BEGIN, then waiting for a user).', 'Để giao dịch mở trong app (BEGIN rồi chờ người dùng).']],
    tn: [tn('bloat', 'phình to do dead tuple'), tn('VACUUM', 'dọn dead tuple')],
  }),
]);
