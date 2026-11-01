/**
 * DBI202 · 2.4 Ràng buộc trên quan hệ — bốn họ ràng buộc, khoá, toàn vẹn tham chiếu viết bằng đại số (R − S = ∅),
 * tìm vi phạm trên bảng CHƯA có ràng buộc (dữ liệu nhập từ Excel).
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';

// Bảng nạp từ Excel, CHƯA có khoá chính/khoá ngoại ⇒ có vi phạm để tìm.
const THO = String.raw`
CREATE TABLE StudentRaw (sid CHAR(4) NOT NULL, name NVARCHAR(20) NOT NULL, major CHAR(2) NULL);
CREATE TABLE EnrollRaw  (sid CHAR(4) NOT NULL, cid CHAR(6) NOT NULL, score DECIMAL(4,1) NULL);
INSERT INTO StudentRaw VALUES ('SE01', N'An', 'SE'), ('SE02', N'Bình', 'SE'), ('AI01', N'Chi', 'AI'),
                              ('SE02', N'Bình Nguyễn', 'SE'), ('GD01', N'Dũng', 'GD');
INSERT INTO EnrollRaw VALUES ('SE01', 'DBI202', 8.5), ('SE02', 'DBI202', 6.0), ('AI01', 'CSD201', 8.0),
                             ('SE09', 'DBI202', 7.0), ('AI01', 'DBI202', 12.5), ('GD01', 'MAE101', NULL);
`;
const LD = {
  en: '<p><b>Imported from Excel, no constraints yet</b> (tab <code>Raw.sql</code>): <code>StudentRaw(sid, name, major)</code> — 5 rows; <code>EnrollRaw(sid, cid, score)</code> — 6 rows. Neither table has a primary or foreign key, so bad rows got in.</p>',
  vi: '<p><b>Nhập từ Excel, chưa có ràng buộc</b> (tab <code>Raw.sql</code>): <code>StudentRaw(sid, name, major)</code> — 5 dòng; <code>EnrollRaw(sid, cid, score)</code> — 6 dòng. Hai bảng chưa có khoá chính/khoá ngoại nên dòng sai đã lọt vào.</p>',
};
const R = { csdl: THO, tenCsdl: 'Raw', ld: LD };
const THEM = `INSERT INTO StudentRaw VALUES ('AI01', N'Chi Trần', 'AI'), ('SE05', N'Em', 'SE');
INSERT INTO EnrollRaw VALUES ('SE07', 'CSD201', 6.5), ('SE05', 'CSD201', -1.0), ('SE09', 'MAE101', 5.0)`;

export default mod('dbi202-rang-buoc-quan-he', '2.4 Constraints on relations', [
  cs({
    t: 'Which family of constraint is it?', k: 'EASY', p: 6, loai: 'table',
    kn: ['domain constraint', 'key constraint', 'referential integrity', 'general constraint'], tag: ['constraints'],
    en: '<p>Lesson 2.4 sorts constraints into four families. Classify each rule.</p>',
    vi: '<p>Bài 2.4 chia ràng buộc thành bốn họ. Phân loại từng luật.</p>',
    bang: [bang1('b1', ['Rule → family', 'Luật → họ'],
      [{ ma: 'luat', ten: 'Rule / Luật' }, { ma: 'ho', ten: 'Family / Họ', luaChon: ['domain', 'key', 'referential integrity', 'general (CHECK / assertion)'] }],
      [{ o: { luat: 'score is a number with one decimal between 0 and 10' }, a: { ho: 'domain' } },
        { o: { luat: 'no two students have the same sid' }, a: { ho: 'key' } },
        { o: { luat: 'every sid in Enroll exists in Student' }, a: { ho: 'referential integrity' } },
        { o: { luat: 'a student may not take more than 6 courses per term' }, a: { ho: 'general (CHECK / assertion)' } },
        { o: { luat: 'major is one of SE, AI, GD, IA' }, a: { ho: 'domain' } },
        { o: { luat: 'the pair (sid, cid) appears at most once in Enroll' }, a: { ho: 'key' } }],
      ['Domain = allowed values of one attribute; key = uniqueness; referential = values must exist elsewhere; anything spanning many rows/tables is a general constraint.', 'Miền = giá trị cho phép của một thuộc tính; khoá = duy nhất; tham chiếu = giá trị phải có ở nơi khác; mọi thứ trải nhiều dòng/bảng là ràng buộc tổng quát.'])],
    gy: [['One attribute, a set of values ⇒ domain.', 'Một thuộc tính, một tập giá trị ⇒ miền.'], ['"At most N per …" needs counting rows ⇒ general constraint.', '"Tối đa N mỗi …" cần đếm dòng ⇒ ràng buộc tổng quát.']],
    lhg: [['Calling "(sid, cid) once" referential — it is uniqueness, a key.', 'Gọi "(sid, cid) một lần" là tham chiếu — đó là duy nhất, tức khoá.'], ['Calling "at most 6 courses" a domain constraint — it involves many rows.', 'Gọi "tối đa 6 môn" là ràng buộc miền — nó liên quan nhiều dòng.']],
    tn: [tn('referential integrity', 'toàn vẹn tham chiếu'), tn('domain constraint', 'ràng buộc miền')],
  }),
  de({
    ...R, t: 'Referential integrity in algebra: π_sid(EnrollRaw) − π_sid(StudentRaw)', k: 'EASY', p: 7,
    kn: ['referential integrity', 'difference', 'EXCEPT'], tag: ['constraints', 'except'],
    en: '<p>The constraint "every enrolment belongs to a known student" is written in algebra as <code>π<sub>sid</sub>(EnrollRaw) − π<sub>sid</sub>(StudentRaw) = ∅</code>. Compute the left side: the sids that <b>violate</b> it.</p>',
    vi: '<p>Ràng buộc "mọi lượt đăng ký thuộc về một sinh viên đã biết" viết bằng đại số là <code>π<sub>sid</sub>(EnrollRaw) − π<sub>sid</sub>(StudentRaw) = ∅</code>. Tính vế trái: các sid <b>vi phạm</b>.</p>',
    yc: [['One column: <code>sid</code>.', 'Một cột: <code>sid</code>.'], ['Each violating sid once; row order does not matter.', 'Mỗi sid vi phạm một lần; thứ tự dòng không quan trọng.']],
    giai: `SELECT sid FROM EnrollRaw
EXCEPT                          -- the constraint holds iff this is empty
SELECT sid FROM StudentRaw;`,
    kiem: [kq(['Orphan sids in EnrollRaw', 'sid mồ côi trong EnrollRaw']), kqAn(['More orphans', 'Thêm dòng mồ côi'], THEM), ma(['Uses EXCEPT or NOT EXISTS', 'Dùng EXCEPT hoặc NOT EXISTS'], '\\bEXCEPT\\b|\\bNOT\\s+EXISTS\\b|\\bNOT\\s+IN\\b')],
    sai: [`SELECT sid FROM StudentRaw EXCEPT SELECT sid FROM EnrollRaw`, `SELECT sid FROM EnrollRaw WHERE sid = 'SE09'`],
    gy: [['The constraint says the difference must be empty — so the difference itself lists the violations.', 'Ràng buộc nói phép hiệu phải rỗng — nên chính phép hiệu liệt kê các vi phạm.'], ['EnrollRaw first, StudentRaw second.', 'EnrollRaw trước, StudentRaw sau.']],
    lhg: [['Reversing the operands — that lists students without enrolments (allowed, not a violation).', 'Đảo hai vế — đó là sinh viên chưa đăng ký (được phép, không vi phạm).'], ['Hard-coding SE09 — the hidden data has other orphans.', 'Ghi cứng SE09 — dữ liệu ẩn có dòng mồ côi khác.']],
    gt: ['<p>Every constraint can be written as "some expression = ∅" (or R ⊆ S). Before adding a FOREIGN KEY to imported data, run exactly this query and fix what it returns — otherwise ALTER TABLE … ADD FOREIGN KEY fails.</p>', '<p>Mọi ràng buộc đều viết được dạng "một biểu thức = ∅" (hoặc R ⊆ S). Trước khi thêm FOREIGN KEY cho dữ liệu nhập về, chạy đúng truy vấn này và sửa những gì nó trả — nếu không ALTER TABLE … ADD FOREIGN KEY sẽ lỗi.</p>'],
    tn: [TN.fk, TN.setOp],
  }),
  de({
    ...R, t: 'Key violations: sids used by two different rows', k: 'MEDIUM', p: 8,
    kn: ['key constraint', 'self-join', 'GROUP BY HAVING'], tag: ['constraints', 'group-by'],
    en: '<p>The key constraint on StudentRaw is <code>σ<sub>S1.sid = S2.sid AND S1.name ≠ S2.name</sub>(ρ<sub>S1</sub>(StudentRaw) × ρ<sub>S2</sub>(StudentRaw)) = ∅</code>. List the sids that break it, with how many rows use each.</p>',
    vi: '<p>Ràng buộc khoá của StudentRaw là <code>σ<sub>S1.sid = S2.sid AND S1.name ≠ S2.name</sub>(ρ<sub>S1</sub>(StudentRaw) × ρ<sub>S2</sub>(StudentRaw)) = ∅</code>. Liệt kê các sid phá nó, kèm số dòng dùng mỗi sid.</p>',
    yc: [['Columns: <code>sid, copies</code>.', 'Cột: <code>sid, copies</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT sid, COUNT(*) AS copies
FROM StudentRaw
GROUP BY sid
HAVING COUNT(*) > 1;`,
    kiem: [kq(['Duplicated sids', 'sid bị trùng']), kqAn(['Another duplicated sid', 'Thêm một sid trùng'], THEM), ma(['Uses GROUP BY … HAVING or a self-join', 'Dùng GROUP BY … HAVING hoặc tự nối'], '\\bHAVING\\b|\\bJOIN\\s+StudentRaw\\b|,\\s*StudentRaw\\b')],
    sai: [`SELECT sid, COUNT(*) AS copies FROM StudentRaw GROUP BY sid`, `SELECT name AS sid, COUNT(*) AS copies FROM StudentRaw GROUP BY name HAVING COUNT(*) > 1`],
    gy: [['A key is violated when one sid appears in more than one row.', 'Khoá bị vi phạm khi một sid xuất hiện ở hơn một dòng.'], ['GROUP BY sid HAVING COUNT(*) &gt; 1', 'GROUP BY sid HAVING COUNT(*) &gt; 1']],
    lhg: [['No HAVING — every sid is listed with 1.', 'Không HAVING — sid nào cũng hiện với 1.'], ['Grouping by name — names may repeat legally; the key is sid.', 'Gộp theo name — tên được phép trùng; khoá là sid.']],
    gt: ['<p>Expected: SE02 2 ("Bình" and "Bình Nguyễn" share SE02). Fix the duplicates, then <code>ALTER TABLE StudentRaw ADD CONSTRAINT pk_studentraw PRIMARY KEY (sid)</code> will succeed.</p>', '<p>Kết quả: SE02 2 ("Bình" và "Bình Nguyễn" cùng SE02). Sửa chỗ trùng thì <code>ALTER TABLE StudentRaw ADD CONSTRAINT pk_studentraw PRIMARY KEY (sid)</code> mới chạy được.</p>'],
    tn: [TN.pk, TN.having],
  }),
  de({
    ...R, t: 'Domain violations: scores outside 0–10', k: 'EASY', p: 6,
    kn: ['domain constraint', 'NULL vs CHECK'], tag: ['constraints'],
    en: '<p>The domain of score is "0 to 10, or unknown". Return the enrolment rows that violate it. (A NULL score is allowed: a CHECK only rejects a row when its condition is FALSE.)</p>',
    vi: '<p>Miền của score là "từ 0 tới 10, hoặc chưa biết". Trả các dòng đăng ký vi phạm. (Điểm NULL được phép: CHECK chỉ từ chối dòng khi điều kiện là FALSE.)</p>',
    yc: [['Columns: <code>sid, cid, score</code>.', 'Cột: <code>sid, cid, score</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT sid, cid, score
FROM EnrollRaw
WHERE score < 0 OR score > 10;      -- NULL makes both tests UNKNOWN ⇒ not returned (allowed)`,
    kiem: [kq(['Rows with an impossible score', 'Dòng có điểm vô lý']), kqAn(['A negative score added', 'Thêm một điểm âm'], THEM), ma(['Has a WHERE', 'Có WHERE'], '\\bWHERE\\b')],
    sai: [`SELECT sid, cid, score FROM EnrollRaw WHERE score > 10`, `SELECT sid, cid, score FROM EnrollRaw WHERE NOT (score BETWEEN 0 AND 10) OR score IS NULL`],
    gy: [['Out of range = score &lt; 0 OR score &gt; 10.', 'Ngoài miền = score &lt; 0 OR score &gt; 10.'], ['Do not report NULL scores — "unknown" is allowed here.', 'Đừng báo điểm NULL — "chưa biết" được phép ở đây.']],
    lhg: [['Only score &gt; 10 — the hidden data has a negative score.', 'Chỉ score &gt; 10 — dữ liệu ẩn có điểm âm.'], ['Adding OR score IS NULL — NULL is not a violation of CHECK (score BETWEEN 0 AND 10).', 'Thêm OR score IS NULL — NULL không vi phạm CHECK (score BETWEEN 0 AND 10).']],
    gt: ['<p>Expected: (AI01, DBI202, 12.5). The same three-valued logic decides what a CHECK accepts: TRUE or UNKNOWN pass, only FALSE is rejected.</p>', '<p>Kết quả: (AI01, DBI202, 12.5). Cùng logic ba trị quyết định CHECK nhận gì: TRUE hoặc UNKNOWN đều qua, chỉ FALSE bị từ chối.</p>'],
    tn: [TN.check, TN.null],
  }),
  cs({
    t: 'Deleting a row that is still referenced', k: 'MEDIUM', p: 6,
    kn: ['ON DELETE', 'referential actions'], tag: ['constraints', 'foreign-key'],
    en: '<p>Enroll.sid → Student.sid. Student SE01 still has two enrolments. What happens on <code>DELETE FROM Student WHERE sid = \'SE01\'</code> under each policy?</p>',
    vi: '<p>Enroll.sid → Student.sid. Sinh viên SE01 còn hai lượt đăng ký. Chuyện gì xảy ra với <code>DELETE FROM Student WHERE sid = \'SE01\'</code> theo từng chính sách?</p>',
    cau: [
      q('c1', ['Default (NO ACTION / RESTRICT):', 'Mặc định (NO ACTION / RESTRICT):'], ['The DELETE is rejected; nothing changes', 'SE01 and its two enrolments are deleted', 'SE01 is deleted, its enrolments get sid = NULL', 'SE01 is deleted, its enrolments stay unchanged'], ['The default protects the children: the parent cannot be deleted while referenced.', 'Mặc định bảo vệ dòng con: không xoá được cha khi còn bị tham chiếu.']),
      q('c2', ['ON DELETE CASCADE:', 'ON DELETE CASCADE:'], ['SE01 and its two enrolments are deleted', 'The DELETE is rejected; nothing changes', 'Only the two enrolments are deleted', 'SE01 is deleted, its enrolments get sid = NULL'], ['Cascade propagates the delete to the referencing rows.', 'Cascade lan việc xoá sang các dòng tham chiếu.']),
      q('c3', ['ON DELETE SET NULL — why is it impossible for Enroll.sid here?', 'ON DELETE SET NULL — vì sao không dùng được cho Enroll.sid ở đây?'], ['sid is part of Enroll\'s primary key, which cannot be NULL', 'SET NULL exists only in PostgreSQL', 'SET NULL deletes the parent twice', 'Foreign keys cannot reference CHAR columns'], ['SET NULL needs a nullable FK column; Enroll.sid is in the PK (sid, cid).', 'SET NULL cần cột khoá ngoại cho phép NULL; Enroll.sid nằm trong khoá chính (sid, cid).']),
      q('c4', ['Which statement on the CHILD table can also violate the foreign key?', 'Câu lệnh nào trên bảng CON cũng có thể vi phạm khoá ngoại?'], ['INSERT INTO Enroll VALUES (\'SE99\', \'DBI202\', 7)', 'DELETE FROM Enroll WHERE sid = \'SE01\'', 'SELECT * FROM Enroll', 'UPDATE Enroll SET score = 9 WHERE sid = \'SE01\''], ['A child row pointing at a non-existent parent is the classic violation. Deleting children or changing score never breaks the FK.', 'Dòng con trỏ tới cha không tồn tại là vi phạm kinh điển. Xoá dòng con hay đổi score không bao giờ phá khoá ngoại.']),
    ],
    gy: [['Parent side: DELETE / UPDATE of the key can violate. Child side: INSERT / UPDATE of the FK can violate.', 'Phía cha: DELETE / UPDATE khoá có thể vi phạm. Phía con: INSERT / UPDATE khoá ngoại có thể vi phạm.'], ['CASCADE, SET NULL, SET DEFAULT, NO ACTION are the four policies.', 'CASCADE, SET NULL, SET DEFAULT, NO ACTION là bốn chính sách.']],
    lhg: [['Thinking the default is CASCADE — the default is to reject.', 'Tưởng mặc định là CASCADE — mặc định là từ chối.'], ['Choosing SET NULL for a column that is part of a primary key.', 'Chọn SET NULL cho cột nằm trong khoá chính.']],
    tn: [TN.fk, tn('ON DELETE CASCADE', 'xoá lan truyền')],
  }),
]);
