/**
 * DBI202 · 2.3 Nối, nối ngoài & phép chia — ⋈, ⋈θ, ⟕, ÷ (NOT EXISTS lồng NOT EXISTS) trên University.
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { UNI, LUOC_DO_UNI } from './_du-lieu.mjs';

const U = { csdl: UNI, tenCsdl: 'University', ld: LUOC_DO_UNI };
const THEM = `INSERT INTO Student VALUES ('SE04', N'Giang', 'SE'), ('AI02', N'Hà', 'AI');
INSERT INTO Course VALUES ('PRF192', N'Programming Fundamentals', 3);
INSERT INTO Enroll VALUES ('SE04', 'DBI202', 9.0), ('SE04', 'CSD201', 6.5), ('AI02', 'CSD201', 7.0), ('SE02', 'CSD201', 8.0)`;

export default mod('dbi202-dai-so-nang-cao', '2.3 Joins, outer joins & division in algebra', [
  cs({
    t: 'Natural join, outer joins and division on a tiny example', k: 'EASY', p: 8, loai: 'table',
    kn: ['natural join', 'outer join', 'division'], tag: ['relational-algebra'],
    en: '<p>Lesson 2.3 data: <code>Student(sid, name)</code> = {(1, An), (2, Binh), (3, Chi)}, <code>Enrol(sid, cid)</code> = {(1, DB), (1, OS), (2, DB)}, <code>Course(cid, title)</code> = {(DB, Databases), (OS, Operating Sys), (NW, Networking)}. Give the number of tuples of each result.</p>',
    vi: '<p>Dữ liệu bài 2.3: <code>Student(sid, name)</code> = {(1, An), (2, Binh), (3, Chi)}, <code>Enrol(sid, cid)</code> = {(1, DB), (1, OS), (2, DB)}, <code>Course(cid, title)</code> = {(DB, Databases), (OS, Operating Sys), (NW, Networking)}. Cho số bộ của mỗi kết quả.</p>',
    bang: [bang1('b1', ['How many tuples?', 'Bao nhiêu bộ?'],
      [{ ma: 'bt', ten: 'Expression / Biểu thức' }, { ma: 'n', ten: 'tuples / số bộ' }],
      [{ o: { bt: 'Student ⋈ Enrol' }, a: { n: '3' } },
        { o: { bt: 'Student ⟕ Enrol' }, a: { n: '4' } },
        { o: { bt: 'Enrol ⋈ Course' }, a: { n: '3' } },
        { o: { bt: 'Course ⟕ Enrol' }, a: { n: '4' } },
        { o: { bt: 'Student × Course' }, a: { n: '9' } },
        { o: { bt: 'Enrol ÷ π_cid(σ_cid IN (DB, OS)(Course))' }, a: { n: '1' } }],
      ['Student ⋈ Enrol: (1,An,DB), (1,An,OS), (2,Binh,DB). Left outer adds (3,Chi,⊥). Enrol ⋈ Course: 3 enrolments. Course ⟕ Enrol adds NW with ⊥. Product 3 × 3 = 9. Division: only sid 1 takes both DB and OS.', 'Student ⋈ Enrol: (1,An,DB), (1,An,OS), (2,Binh,DB). Nối ngoài trái thêm (3,Chi,⊥). Enrol ⋈ Course: 3 lượt. Course ⟕ Enrol thêm NW với ⊥. Tích 3 × 3 = 9. Phép chia: chỉ sid 1 học cả DB lẫn OS.'])],
    gy: [['Inner join: only matching pairs. Outer: + the unmatched tuples of the kept side.', 'Nối trong: chỉ cặp khớp. Nối ngoài: + các bộ không khớp của vế được giữ.'], ['R ÷ S: values of R paired with EVERY tuple of S.', 'R ÷ S: giá trị của R đi với MỌI bộ của S.']],
    lhg: [['Counting Chi in Student ⋈ Enrol — she has no enrolment.', 'Đếm Chi trong Student ⋈ Enrol — Chi không đăng ký môn nào.'], ['Division "at least one" instead of "all" — that would give 2 students.', 'Phép chia hiểu thành "ít nhất một" thay vì "tất cả" — sẽ ra 2 sinh viên.']],
    tn: [tn('division ÷', 'phép chia ÷', 'R ÷ S: các giá trị đi kèm MỌI bộ của S — "với mọi".')],
  }),
  de({
    ...U, t: 'θ-join: high scores in 3-credit courses', k: 'EASY', p: 7,
    kn: ['theta join', 'join on several conditions'], tag: ['relational-algebra', 'join'],
    en: '<p>Write <code>π<sub>sid, title, score</sub>(Enroll ⋈<sub>Enroll.cid = Course.cid AND score ≥ 8</sub> Course)</code>.</p>',
    vi: '<p>Viết <code>π<sub>sid, title, score</sub>(Enroll ⋈<sub>Enroll.cid = Course.cid AND score ≥ 8</sub> Course)</code>.</p>',
    yc: [['Columns: <code>sid, title, score</code>.', 'Cột: <code>sid, title, score</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT e.sid, c.title, e.score
FROM Enroll e
JOIN Course c ON e.cid = c.cid AND e.score >= 8;    -- θ = equality + another condition`,
    kiem: [kq(['Enrolments with score ≥ 8 and their title', 'Lượt đăng ký điểm ≥ 8 kèm tên môn']), kqAn(['More enrolments', 'Thêm lượt đăng ký'], THEM), ma(['Uses JOIN … ON', 'Dùng JOIN … ON'], '\\bJOIN\\b[\\s\\S]*\\bON\\b')],
    sai: [`SELECT e.sid, c.title, e.score FROM Enroll e JOIN Course c ON e.cid = c.cid`, `SELECT e.sid, c.title, e.score FROM Enroll e, Course c WHERE e.score >= 8`],
    gy: [['⋈θ = σθ(R × S): the condition can mix equality and other tests.', '⋈θ = σθ(R × S): điều kiện có thể kết hợp bằng nhau và phép thử khác.'], ['ON e.cid = c.cid AND e.score &gt;= 8 (or the score test in WHERE — same result for an inner join).', 'ON e.cid = c.cid AND e.score &gt;= 8 (hoặc đặt phép thử điểm ở WHERE — cùng kết quả với nối trong).']],
    lhg: [['Forgetting the score condition — every enrolment.', 'Quên điều kiện điểm — mọi lượt đăng ký.'], ['Forgetting e.cid = c.cid — a product: each good score with every course.', 'Quên e.cid = c.cid — thành tích: mỗi điểm cao với mọi môn.']],
    gt: ['<p>For an INNER join, a condition in ON or in WHERE gives the same rows. For an OUTER join it does not — see the next exercise.</p>', '<p>Với nối TRONG, điều kiện đặt ở ON hay WHERE đều cho cùng kết quả. Với nối NGOÀI thì không — xem bài sau.</p>'],
    tn: [tn('theta join ⋈θ', 'nối theo điều kiện')],
  }),
  de({
    ...U, t: '⟕: every course with its number of students', k: 'MEDIUM', p: 8,
    kn: ['left outer join', 'COUNT(column)'], tag: ['relational-algebra', 'outer-join'],
    en: '<p>Using <code>Course ⟕ Enroll</code>, list every course with the number of students enrolled — JPD113, which nobody takes, must show 0.</p>',
    vi: '<p>Dùng <code>Course ⟕ Enroll</code>, liệt kê mọi môn kèm số sinh viên đăng ký — JPD113 không ai học phải hiện 0.</p>',
    yc: [['Columns: <code>cid, students</code>.', 'Cột: <code>cid, students</code>.'], ['Every course appears; row order does not matter.', 'Môn nào cũng xuất hiện; thứ tự dòng không quan trọng.']],
    giai: `SELECT c.cid, COUNT(e.sid) AS students      -- NULL padding is not counted
FROM Course c
LEFT JOIN Enroll e ON e.cid = c.cid
GROUP BY c.cid;`,
    kiem: [kq(['Students per course, zeros included', 'Số sinh viên mỗi môn, có cả 0']), kqAn(['A new course and more enrolments', 'Thêm môn và lượt đăng ký'], THEM), ma(['Uses LEFT JOIN', 'Dùng LEFT JOIN'], '\\bLEFT\\s+(OUTER\\s+)?JOIN\\b')],
    sai: [`SELECT c.cid, COUNT(*) AS students FROM Course c LEFT JOIN Enroll e ON e.cid = c.cid GROUP BY c.cid`, `SELECT e.cid, COUNT(e.sid) AS students FROM Enroll e GROUP BY e.cid`],
    gy: [['Course must be the preserved (left) side.', 'Course phải là vế được giữ (trái).'], ['COUNT(e.sid), not COUNT(*).', 'COUNT(e.sid), không phải COUNT(*).']],
    lhg: [['COUNT(*) — the padded row of JPD113 counts 1.', 'COUNT(*) — dòng điền NULL của JPD113 đếm thành 1.'], ['Grouping Enroll alone — courses without enrolments never appear.', 'Gộp riêng Enroll — môn không ai học không bao giờ xuất hiện.']],
    gt: ['<p>Expected: CSD201 3, DBI202 3, JPD113 0, MAE101 1.</p>', '<p>Kết quả: CSD201 3, DBI202 3, JPD113 0, MAE101 1.</p>'],
    tn: [TN.leftJoin],
  }),
  de({
    ...U, t: 'Division: students who take every course AI01 takes', k: 'HARD', p: 12,
    kn: ['division', 'NOT EXISTS', 'double negation'], tag: ['relational-algebra', 'division', 'not-exists'],
    en: '<p>AI01 takes DBI202 and CSD201. Find the students (other than AI01) who take <b>every</b> course that AI01 takes: <code>π<sub>sid,cid</sub>(Enroll) ÷ π<sub>cid</sub>(σ<sub>sid=\'AI01\'</sub>(Enroll))</code>, then remove AI01.</p>',
    vi: '<p>AI01 học DBI202 và CSD201. Tìm các sinh viên (khác AI01) học <b>mọi</b> môn mà AI01 học: <code>π<sub>sid,cid</sub>(Enroll) ÷ π<sub>cid</sub>(σ<sub>sid=\'AI01\'</sub>(Enroll))</code>, rồi bỏ AI01.</p>',
    yc: [['Columns: <code>sid, name</code>.', 'Cột: <code>sid, name</code>.'], ['Must still be right if AI01 takes more courses (do not hard-code DBI202/CSD201). Row order does not matter.', 'Phải vẫn đúng nếu AI01 học thêm môn (không ghi cứng DBI202/CSD201). Thứ tự dòng không quan trọng.']],
    giai: `SELECT s.sid, s.name
FROM Student s
WHERE s.sid <> 'AI01'
  AND NOT EXISTS (                      -- there is no course of AI01 …
        SELECT 1 FROM Enroll a
        WHERE a.sid = 'AI01'
          AND NOT EXISTS (              -- … that s has not taken
                SELECT 1 FROM Enroll e
                WHERE e.sid = s.sid AND e.cid = a.cid));`,
    kiem: [
      kq(['Students covering all of AI01\'s courses', 'Sinh viên học đủ các môn của AI01']),
      kqAn(['More students qualify', 'Thêm người thoả'], THEM),
      kqAn(['AI01 adds MAE101: only those with all three remain', 'AI01 học thêm MAE101: chỉ ai đủ cả ba còn lại'], `INSERT INTO Student VALUES ('SE05', N'Khánh', 'SE'); INSERT INTO Enroll VALUES ('AI01', 'MAE101', 8.0), ('SE01', 'MAE101', 6.0), ('SE05', 'DBI202', 7.0), ('SE05', 'CSD201', 7.5)`),
    ],
    sai: [
      `SELECT DISTINCT s.sid, s.name FROM Student s JOIN Enroll e ON e.sid = s.sid WHERE s.sid <> 'AI01' AND e.cid IN (SELECT cid FROM Enroll WHERE sid = 'AI01')`,
      `SELECT s.sid, s.name FROM Student s WHERE s.sid <> 'AI01' AND s.sid IN (SELECT sid FROM Enroll WHERE cid = 'DBI202') AND s.sid IN (SELECT sid FROM Enroll WHERE cid = 'CSD201')`,
    ],
    gy: [['"For every course of AI01, s takes it" = "there is NO course of AI01 that s does NOT take".', '"Với mọi môn của AI01, s đều học" = "KHÔNG có môn nào của AI01 mà s KHÔNG học".'], ['Two nested NOT EXISTS; the inner one is correlated with both s and a.', 'Hai NOT EXISTS lồng nhau; cái trong tương quan với cả s và a.']],
    lhg: [['cid IN (courses of AI01) — that is "at least one", not "all": SE02 and SE03 slip in.', 'cid IN (các môn của AI01) — đó là "ít nhất một", không phải "tất cả": SE02, SE03 lọt vào.'], ['Hard-coding DBI202 and CSD201 — wrong as soon as AI01 takes another course (hidden check).', 'Ghi cứng DBI202 và CSD201 — sai ngay khi AI01 học thêm môn (kiểm ẩn).']],
    gt: ['<p>Division has no SQL keyword; the double NOT EXISTS is its standard translation (another: GROUP BY sid HAVING COUNT(cid) = number of AI01 courses, restricted to AI01\'s courses). Expected: SE01 An.</p>', '<p>Phép chia không có từ khoá SQL; hai NOT EXISTS lồng nhau là cách dịch chuẩn (cách khác: GROUP BY sid HAVING COUNT(cid) = số môn của AI01, chỉ tính các môn của AI01). Kết quả: SE01 An.</p>'],
    tn: [TN.exists, tn('division ÷', 'phép chia')],
  }),
]);
