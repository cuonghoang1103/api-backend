/**
 * DBI202 · 2.5 Thực hành Chương 2 — đại số quan hệ trên tập và túi, kiểm mọi đáp án bằng SQL (CSDL University + hai quán cà phê).
 */
import { mod, de, cs, q, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { UNI, LUOC_DO_UNI } from './_du-lieu.mjs';

const U = { csdl: UNI, tenCsdl: 'University', ld: LUOC_DO_UNI };
const THEM = `INSERT INTO Student VALUES ('SE04', N'Giang', 'SE'), ('IA01', N'Huy', 'IA');
INSERT INTO Enroll VALUES ('SE04', 'DBI202', 7.0), ('SE04', 'CSD201', 9.0), ('SE03', 'MAE101', 4.0)`;
const CAFE = String.raw`
CREATE TABLE SaleQ1 (drink NVARCHAR(20) NOT NULL);   -- branch District 1, no key: a bag (one row per cup)
CREATE TABLE SaleQ3 (drink NVARCHAR(20) NOT NULL);   -- branch District 3
INSERT INTO SaleQ1 VALUES (N'cà phê sữa'), (N'trà đào'), (N'cà phê sữa'), (N'bạc xỉu'), (N'cà phê sữa');
INSERT INTO SaleQ3 VALUES (N'trà đào'), (N'cà phê sữa'), (N'trà đào');
`;
const LD_CAFE = {
  en: '<p><b>Two cafés</b> (tab <code>Cafe.sql</code>): <code>SaleQ1(drink)</code> and <code>SaleQ3(drink)</code> — one row per cup sold, no key, so each table is a <b>bag</b>. Q1: cà phê sữa ×3, trà đào ×1, bạc xỉu ×1. Q3: trà đào ×2, cà phê sữa ×1.</p>',
  vi: '<p><b>Hai quán cà phê</b> (tab <code>Cafe.sql</code>): <code>SaleQ1(drink)</code> và <code>SaleQ3(drink)</code> — mỗi ly bán một dòng, không có khoá nên mỗi bảng là một <b>túi</b>. Q1: cà phê sữa ×3, trà đào ×1, bạc xỉu ×1. Q3: trà đào ×2, cà phê sữa ×1.</p>',
};

export default mod('dbi202-on-ch2', '2.5 Practice: relational algebra on sets and bags', [
  de({
    ...U, t: 'Exercise 3 — ∩: students who take both DBI202 and CSD201', k: 'EASY', p: 6,
    kn: ['intersection'], tag: ['relational-algebra', 'intersect'],
    en: '<p>Write <code>π<sub>sid</sub>(σ<sub>cid=\'DBI202\'</sub>(Enroll)) ∩ π<sub>sid</sub>(σ<sub>cid=\'CSD201\'</sub>(Enroll))</code>.</p>',
    vi: '<p>Viết <code>π<sub>sid</sub>(σ<sub>cid=\'DBI202\'</sub>(Enroll)) ∩ π<sub>sid</sub>(σ<sub>cid=\'CSD201\'</sub>(Enroll))</code>.</p>',
    yc: [['One column: <code>sid</code>.', 'Một cột: <code>sid</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT sid FROM Enroll WHERE cid = 'DBI202'
INTERSECT
SELECT sid FROM Enroll WHERE cid = 'CSD201';`,
    kiem: [kq(['sids in both courses', 'sid học cả hai môn']), kqAn(['SE04 takes both too', 'SE04 cũng học cả hai'], THEM), ma(['Uses INTERSECT (or an equivalent self-join / IN)', 'Dùng INTERSECT (hoặc tự nối / IN tương đương)'], '\\bINTERSECT\\b|\\bJOIN\\b|\\bIN\\s*\\(|\\bEXISTS\\b')],
    sai: [`SELECT sid FROM Enroll WHERE cid = 'DBI202' AND cid = 'CSD201'`, `SELECT sid FROM Enroll WHERE cid = 'DBI202' UNION SELECT sid FROM Enroll WHERE cid = 'CSD201'`],
    gy: [['σ tests one row at a time — no row has two course codes.', 'σ kiểm từng dòng — không dòng nào có hai mã môn.'], ['Build the two sets, then INTERSECT them.', 'Dựng hai tập rồi INTERSECT.']],
    lhg: [['WHERE cid = \'DBI202\' AND cid = \'CSD201\' — always 0 rows.', 'WHERE cid = \'DBI202\' AND cid = \'CSD201\' — luôn 0 dòng.'], ['UNION — that is "either", not "both".', 'UNION — đó là "một trong hai", không phải "cả hai".']],
    gt: ['<p>Expected: AI01, SE01. "Both" across rows = ∩ (or a self-join of Enroll).</p>', '<p>Kết quả: AI01, SE01. "Cả hai" trên nhiều dòng = ∩ (hoặc tự nối Enroll).</p>'],
    tn: [TN.setOp],
  }),
  de({
    ...U, t: 'Exercise 4 — difference, then join back: who takes nothing?', k: 'MEDIUM', p: 8,
    kn: ['difference', 'join back'], tag: ['relational-algebra', 'except'],
    en: '<p>Write <code>π<sub>sid, name</sub>((π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)) ⋈ Student)</code>: the students who take no course, with their names. (A plain difference loses the name; join the result back to Student.)</p>',
    vi: '<p>Viết <code>π<sub>sid, name</sub>((π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)) ⋈ Student)</code>: sinh viên không học môn nào, kèm tên. (Phép hiệu thuần mất cột name; nối kết quả lại với Student.)</p>',
    yc: [['Columns: <code>sid, name</code>.', 'Cột: <code>sid, name</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT s.sid, s.name
FROM (SELECT sid FROM Student
      EXCEPT
      SELECT sid FROM Enroll) AS d          -- π sid(Student) − π sid(Enroll)
JOIN Student s ON s.sid = d.sid;            -- ⋈ Student to recover the name`,
    kiem: [kq(['Students without enrolments', 'Sinh viên không đăng ký môn nào']), kqAn(['A new student with no course; another who only failed', 'Sinh viên mới chưa học môn nào; một người chỉ có điểm trượt'], `${THEM}; INSERT INTO Student VALUES ('SE05', N'Khánh', 'SE'); INSERT INTO Enroll VALUES ('SE05', 'MAE101', 3.0)`), ma(['Uses EXCEPT, NOT EXISTS or NOT IN', 'Dùng EXCEPT, NOT EXISTS hoặc NOT IN'], '\\bEXCEPT\\b|\\bNOT\\s+EXISTS\\b|\\bNOT\\s+IN\\b|\\bIS\\s+NULL\\b')],
    sai: [`SELECT sid, name FROM Student EXCEPT SELECT e.sid, s.name FROM Enroll e JOIN Student s ON s.sid = e.sid WHERE e.score >= 5`, `SELECT s.sid, s.name FROM Student s JOIN Enroll e ON e.sid = s.sid WHERE e.cid IS NULL`],
    gy: [['Difference needs union-compatible sides: compute it on sid only.', 'Phép hiệu cần hai vế tương thích: tính trên sid thôi.'], ['Then join with Student to get the name.', 'Rồi nối với Student để lấy tên.']],
    lhg: [['Filtering the right side (score ≥ 5) — a student who failed is still enrolled.', 'Lọc vế phải (điểm ≥ 5) — sinh viên trượt vẫn là đã đăng ký.'], ['INNER JOIN … WHERE cid IS NULL — an inner join never produces NULL there; use LEFT JOIN for that pattern.', 'INNER JOIN … WHERE cid IS NULL — nối trong không bao giờ sinh NULL ở đó; mẫu đó cần LEFT JOIN.']],
    gt: ['<p>Expected: GD01 Dũng. Three correct shapes: EXCEPT + join back, NOT EXISTS, LEFT JOIN … WHERE e.sid IS NULL.</p>', '<p>Kết quả: GD01 Dũng. Ba dạng đúng: EXCEPT + nối lại, NOT EXISTS, LEFT JOIN … WHERE e.sid IS NULL.</p>'],
    tn: [TN.setOp, TN.exists],
  }),
  de({
    csdl: CAFE, tenCsdl: 'Cafe', ld: LD_CAFE,
    t: 'Exercise 6 — bags: how many more cups did Q1 sell, per drink?', k: 'MEDIUM', p: 10,
    kn: ['bag difference', 'counts', 'outer join'], tag: ['bags', 'group-by'],
    en: '<p>The bag difference SaleQ1 − SaleQ3 keeps, for each drink, max(0, n − m) copies (n cups in Q1, m in Q3). Return it as counts: one row per drink that Q1 sold <b>more</b> of than Q3, with the difference.</p>',
    vi: '<p>Hiệu túi SaleQ1 − SaleQ3 giữ, với mỗi đồ uống, max(0, n − m) bản (n ly ở Q1, m ở Q3). Trả kết quả dạng số đếm: mỗi đồ uống Q1 bán <b>nhiều hơn</b> Q3 một dòng, kèm phần chênh.</p>',
    yc: [['Columns: <code>drink, more</code> (more = n − m &gt; 0).', 'Cột: <code>drink, more</code> (more = n − m &gt; 0).'], ['A drink Q3 never sold still counts (m = 0). Row order does not matter.', 'Đồ uống Q3 chưa bán vẫn tính (m = 0). Thứ tự dòng không quan trọng.']],
    giai: `SELECT a.drink, a.n - COALESCE(b.m, 0) AS more
FROM (SELECT drink, COUNT(*) AS n FROM SaleQ1 GROUP BY drink) AS a
LEFT JOIN (SELECT drink, COUNT(*) AS m FROM SaleQ3 GROUP BY drink) AS b
       ON b.drink = a.drink                              -- bạc xỉu has no partner ⇒ m = 0
WHERE a.n - COALESCE(b.m, 0) > 0;`,
    kiem: [kq(['Drinks Q1 sold more of', 'Đồ uống Q1 bán nhiều hơn']), kqAn(['More sales on both sides', 'Thêm doanh số hai bên'], `INSERT INTO SaleQ1 VALUES (N'trà đào'), (N'trà đào'), (N'sinh tố bơ'); INSERT INTO SaleQ3 VALUES (N'cà phê sữa'), (N'bạc xỉu')`), ma(['Counts with GROUP BY', 'Đếm bằng GROUP BY'], '\\bGROUP\\s+BY\\b')],
    sai: [
      `SELECT a.drink, a.n - b.m AS more FROM (SELECT drink, COUNT(*) AS n FROM SaleQ1 GROUP BY drink) AS a JOIN (SELECT drink, COUNT(*) AS m FROM SaleQ3 GROUP BY drink) AS b ON b.drink = a.drink WHERE a.n - b.m > 0`,
      `SELECT drink, COUNT(*) AS more FROM (SELECT drink FROM SaleQ1 EXCEPT SELECT drink FROM SaleQ3) AS t GROUP BY drink`,
    ],
    gy: [['Count n per drink in Q1 and m per drink in Q3 first.', 'Đếm n mỗi đồ uống ở Q1 và m ở Q3 trước.'], ['LEFT JOIN the counts and treat a missing m as 0 with COALESCE.', 'LEFT JOIN hai bảng đếm và coi m thiếu là 0 bằng COALESCE.']],
    lhg: [['INNER JOIN of the counts — bạc xỉu (never sold in Q3) disappears.', 'INNER JOIN hai bảng đếm — bạc xỉu (Q3 chưa bán) biến mất.'], ['Set EXCEPT — only "not at all", it cannot say "2 more".', 'EXCEPT tập — chỉ nói "không hề có", không nói được "nhiều hơn 2".']],
    gt: ['<p>Expected: cà phê sữa 2, bạc xỉu 1 — the bag difference {cà phê sữa, cà phê sữa, bạc xỉu} written as counts. The set difference would only say {bạc xỉu}.</p>', '<p>Kết quả: cà phê sữa 2, bạc xỉu 1 — hiệu túi {cà phê sữa, cà phê sữa, bạc xỉu} viết dạng số đếm. Hiệu tập chỉ nói được {bạc xỉu}.</p>'],
    tn: [tn('bag difference', 'hiệu túi'), tn('COALESCE', 'giá trị thay NULL', 'COALESCE(x, y): x nếu x khác NULL, ngược lại y — chuẩn SQL.')],
  }),
  de({
    ...U, t: 'Exercise 7 — γ, σ after γ, τ: courses with 2+ students', k: 'MEDIUM', p: 9,
    kn: ['grouping γ', 'HAVING', 'ORDER BY'], tag: ['relational-algebra', 'group-by', 'having'],
    en: '<p>Write <code>τ<sub>avgScore DESC</sub>(σ<sub>n ≥ 2</sub>(γ<sub>cid, COUNT(sid)→n, AVG(score)→avgScore</sub>(Enroll)))</code>.</p>',
    vi: '<p>Viết <code>τ<sub>avgScore DESC</sub>(σ<sub>n ≥ 2</sub>(γ<sub>cid, COUNT(sid)→n, AVG(score)→avgScore</sub>(Enroll)))</code>.</p>',
    yc: [['Columns: <code>cid, n, avgScore</code>.', 'Cột: <code>cid, n, avgScore</code>.'], ['Best average first (row order is checked).', 'Trung bình cao nhất trước (có kiểm thứ tự).']],
    giai: `SELECT cid, COUNT(sid) AS n, AVG(score) AS avgScore   -- γ
FROM Enroll
GROUP BY cid
HAVING COUNT(sid) >= 2                                   -- σ on the result of γ
ORDER BY AVG(score) DESC;                                -- τ`,
    kiem: [kq(['Popular courses, best average first', 'Môn đông người học, trung bình cao trước'], { thuTu: true, saiSo: 0.001 }), kqAn(['MAE101 reaches 2 students', 'MAE101 đạt 2 sinh viên'], THEM, { thuTu: true, saiSo: 0.001 }), ma(['Uses HAVING and ORDER BY', 'Dùng HAVING và ORDER BY'], '\\bHAVING\\b[\\s\\S]*\\bORDER\\s+BY\\b')],
    sai: [`SELECT cid, COUNT(sid) AS n, AVG(score) AS avgScore FROM Enroll GROUP BY cid ORDER BY AVG(score) DESC`, `SELECT cid, COUNT(sid) AS n, AVG(score) AS avgScore FROM Enroll GROUP BY cid HAVING COUNT(sid) >= 2 ORDER BY AVG(score)`],
    gy: [['σ on an aggregate result is HAVING, not WHERE.', 'σ trên kết quả gộp là HAVING, không phải WHERE.'], ['τ is ORDER BY, last.', 'τ là ORDER BY, cuối cùng.']],
    lhg: [['No HAVING — MAE101 with one student is listed.', 'Không HAVING — MAE101 chỉ một sinh viên vẫn hiện.'], ['Ascending order — worst average first.', 'Sắp tăng dần — trung bình thấp nhất trước.']],
    gt: ['<p>Expected: DBI202 3 8.0, CSD201 3 6.83. Reading the expression inside-out gives the SQL clauses in order: GROUP BY → HAVING → ORDER BY.</p>', '<p>Kết quả: DBI202 3 8.0, CSD201 3 6.83. Đọc biểu thức từ trong ra ngoài là ra thứ tự mệnh đề SQL: GROUP BY → HAVING → ORDER BY.</p>'],
    tn: [TN.groupBy, TN.having, TN.orderBy],
  }),
  cs({
    t: 'Exercises 1–2 — set vs bag counts and tree order', k: 'EASY', p: 6,
    kn: ['set vs bag', 'expression order'], tag: ['relational-algebra'],
    en: '<p>Quick questions from exercises 1 and 2 of the practice lesson (University data).</p>',
    vi: '<p>Câu hỏi nhanh từ bài 1 và 2 của bài thực hành (dữ liệu University).</p>',
    cau: [
      q('c1', ['π<sub>name</sub>(σ<sub>major=\'SE\'</sub>(Student)) under SET semantics has how many tuples?', 'π<sub>name</sub>(σ<sub>major=\'SE\'</sub>(Student)) theo ngữ nghĩa TẬP có bao nhiêu bộ?'], ['2', '3', '5', '1'], ['SE students: An, Bình, An ⇒ the set {An, Bình}.', 'Sinh viên SE: An, Bình, An ⇒ tập {An, Bình}.']),
      q('c2', ['And SELECT name FROM Student WHERE major = \'SE\' returns how many rows?', 'Còn SELECT name FROM Student WHERE major = \'SE\' trả bao nhiêu dòng?'], ['3', '2', '5', '4'], ['SQL keeps duplicates (bag): An, Bình, An.', 'SQL giữ trùng (túi): An, Bình, An.']),
      q('c3', ['Why is σ<sub>major=\'SE\'</sub>(π<sub>name</sub>(Student)) wrong?', 'Vì sao σ<sub>major=\'SE\'</sub>(π<sub>name</sub>(Student)) sai?'], ['After π only name is left, so major cannot be tested', 'σ must always be the outermost operator', 'π cannot be applied to Student', 'It returns the same result but slower'], ['Select first, project last — unless the projection keeps the attributes σ needs.', 'Chọn trước, chiếu sau — trừ khi phép chiếu giữ thuộc tính σ cần.']),
      q('c4', ['Student ⋈ Enroll (natural join on sid) has how many tuples?', 'Student ⋈ Enroll (nối tự nhiên trên sid) có bao nhiêu bộ?'], ['7', '5', '12', '35'], ['One per enrolment; Dũng (no enrolment) disappears. The product would be 5 × 7 = 35.', 'Mỗi lượt đăng ký một bộ; Dũng (không đăng ký) biến mất. Tích sẽ là 5 × 7 = 35.']),
    ],
    gy: [['Set ⇒ remove duplicates; SQL ⇒ keep them unless DISTINCT.', 'Tập ⇒ bỏ trùng; SQL ⇒ giữ trùng trừ khi DISTINCT.'], ['A join produces one tuple per matching pair.', 'Phép nối sinh một bộ cho mỗi cặp khớp.']],
    lhg: [['Answering 3 for the set question (bag thinking).', 'Trả lời 3 cho câu về tập (nghĩ theo túi).'], ['Counting the product instead of the join.', 'Đếm tích thay vì phép nối.']],
  }),
]);
