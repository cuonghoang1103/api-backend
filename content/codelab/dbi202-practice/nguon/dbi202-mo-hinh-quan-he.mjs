/**
 * DBI202 · 2.1 Bảng, khoá & mô hình quan hệ — siêu khoá / khoá ứng viên / khoá chính / khoá ngoại trên CSDL University.
 */
import { mod, de, cs, q, bang1, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { UNI, LUOC_DO_UNI } from './_du-lieu.mjs';

const U = { csdl: UNI, tenCsdl: 'University', ld: LUOC_DO_UNI };
const THEM = `INSERT INTO Student VALUES ('SE04', N'Bình', 'SE'), ('AI02', N'Chi', 'AI'), ('GD02', N'Em', 'GD');
INSERT INTO Enroll VALUES ('SE04', 'JPD113', 7.5), ('AI02', 'DBI202', 8.0)`;

export default mod('dbi202-mo-hinh-quan-he', '2.1 Tables, keys & the relational model', [
  cs({
    t: 'Superkey, candidate key, primary key, foreign key', k: 'EASY', p: 7,
    kn: ['superkey', 'candidate key', 'primary key', 'foreign key'], tag: ['keys', 'relational-model'],
    en: '<p>Use the University schema: <code>Student(sid, name, major)</code>, <code>Course(cid, title, credits)</code>, <code>Enroll(sid, cid, score)</code>.</p>',
    vi: '<p>Dùng lược đồ University: <code>Student(sid, name, major)</code>, <code>Course(cid, title, credits)</code>, <code>Enroll(sid, cid, score)</code>.</p>',
    cau: [
      q('c1', ['{sid, name} uniquely identifies a student. It is…', '{sid, name} xác định duy nhất một sinh viên. Nó là…'], ['a superkey but not a candidate key', 'a candidate key', 'a foreign key', 'not a key of any kind'], ['It is unique (superkey), but not minimal: {sid} alone is already unique, so name is redundant.', 'Nó duy nhất (siêu khoá) nhưng không tối thiểu: chỉ {sid} đã duy nhất, name là thừa.']),
      q('c2', ['What is the key of Enroll?', 'Khoá của Enroll là gì?'], ['{sid, cid}', '{sid}', '{cid}', '{sid, cid, score}'], ['A student takes many courses and a course has many students, so neither alone is unique; the pair is, and it is minimal.', 'Một sinh viên học nhiều môn, một môn có nhiều sinh viên nên riêng từng cột không duy nhất; cặp thì duy nhất và tối thiểu.']),
      q('c3', ['Enroll.sid → Student.sid is…', 'Enroll.sid → Student.sid là…'], ['a foreign key: every sid in Enroll must exist in Student', 'a second primary key of Enroll, next to (sid, cid)', 'a candidate key of Student, chosen instead of sid', 'a CHECK constraint comparing the two sid columns'], ['A foreign key references the key of another relation (referential integrity).', 'Khoá ngoại tham chiếu khoá của quan hệ khác (toàn vẹn tham chiếu).']),
      q('c4', ['Student also stores a unique email. Then Student has…', 'Student có thêm email duy nhất. Khi đó Student có…'], ['two candidate keys, {sid} and {email}; one is chosen as primary key', 'two primary keys', 'a composite key {sid, email}', 'no key, because there are two unique columns'], ['Every minimal unique set is a candidate key; the designer picks ONE as primary, the other gets UNIQUE.', 'Mọi tập duy nhất tối thiểu đều là khoá ứng viên; người thiết kế chọn MỘT làm khoá chính, cái kia đặt UNIQUE.']),
      q('c5', ['Can a primary-key attribute be NULL?', 'Thuộc tính của khoá chính có được NULL?'], ['No — entity integrity: every tuple must be identifiable', 'Yes, if the other key attributes are not NULL', 'Yes, once per table', 'Only in SQL Server'], ['Entity integrity forbids NULL in the primary key; SQL makes PK columns NOT NULL.', 'Toàn vẹn thực thể cấm NULL trong khoá chính; SQL tự đặt NOT NULL cho cột khoá chính.']),
    ],
    gy: [['Superkey = unique; candidate key = unique AND minimal.', 'Siêu khoá = duy nhất; khoá ứng viên = duy nhất VÀ tối thiểu.'], ['A foreign key points at a key in another (or the same) table.', 'Khoá ngoại trỏ tới khoá ở bảng khác (hoặc chính nó).']],
    lhg: [['Calling every unique set a candidate key — minimality is required.', 'Gọi mọi tập duy nhất là khoá ứng viên — phải tối thiểu.'], ['Saying a table can have two primary keys — it has one primary key (possibly composite) and maybe more candidate keys.', 'Nói một bảng có hai khoá chính — chỉ một khoá chính (có thể ghép) và có thể thêm khoá ứng viên.']],
    tn: [tn('superkey', 'siêu khoá'), tn('candidate key', 'khoá ứng viên'), TN.pk, TN.fk],
  }),
  cs({
    t: 'Could it be a key? Judge from the instance', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['key', 'instance can refute'], tag: ['keys', 'relational-model'],
    en: '<p>Look at the sample data of University (Student: SE01 An SE, SE02 Bình SE, AI01 Chi AI, SE03 An SE, GD01 Dũng GD). For each attribute set of Student, answer whether <b>this instance</b> refutes it as a key (two tuples share the value).</p>',
    vi: '<p>Nhìn dữ liệu mẫu University (Student: SE01 An SE, SE02 Bình SE, AI01 Chi AI, SE03 An SE, GD01 Dũng GD). Với mỗi tập thuộc tính của Student, cho biết <b>thể hiện này</b> có bác bỏ nó làm khoá không (hai bộ trùng giá trị).</p>',
    bang: [bang1('b1', ['Refuted by the data?', 'Dữ liệu có bác bỏ?'],
      [{ ma: 'tap', ten: 'Attribute set / Tập thuộc tính' }, { ma: 'kq', ten: 'Refuted? / Bị bác bỏ?', luaChon: ['refuted', 'not refuted'] }],
      [{ o: { tap: '{sid}' }, a: { kq: 'not refuted' } },
        { o: { tap: '{name}' }, a: { kq: 'refuted' } },
        { o: { tap: '{major}' }, a: { kq: 'refuted' } },
        { o: { tap: '{name, major}' }, a: { kq: 'refuted' } },
        { o: { tap: '{sid, major}' }, a: { kq: 'not refuted' } }],
      ['name: two An. major: three SE. {name, major}: (An, SE) twice — SE01 and SE03. Any set containing sid is unique here. Remember: "not refuted" is not a proof — keys come from the meaning of the data.', 'name: hai An. major: ba SE. {name, major}: (An, SE) hai lần — SE01 và SE03. Mọi tập chứa sid đều duy nhất ở đây. Nhớ: "không bị bác bỏ" không phải là chứng minh — khoá đến từ ý nghĩa dữ liệu.'])],
    gy: [['Look for two tuples with the same value(s) in those columns.', 'Tìm hai bộ có cùng giá trị ở các cột đó.'], ['SE01 and SE03 are both (An, SE).', 'SE01 và SE03 đều là (An, SE).']],
    lhg: [['Concluding that {sid, major} IS a key — it is unique but not minimal (a superkey).', 'Kết luận {sid, major} LÀ khoá — nó duy nhất nhưng không tối thiểu (siêu khoá).'], ['Thinking {name, major} is safe because names alone repeat only in different majors.', 'Tưởng {name, major} an toàn vì tên chỉ trùng ở ngành khác nhau.']],
  }),
  de({
    ...U, t: 'Show that name is not a key of Student', k: 'EASY', p: 6,
    kn: ['key', 'duplicates', 'GROUP BY', 'HAVING'], tag: ['keys', 'group-by'],
    en: '<p>Find every name shared by more than one student, with how many students have it.</p>',
    vi: '<p>Tìm mọi tên được nhiều hơn một sinh viên dùng, kèm số sinh viên mang tên đó.</p>',
    yc: [['Columns: <code>name, students</code>.', 'Cột: <code>name, students</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT name, COUNT(*) AS students
FROM Student
GROUP BY name
HAVING COUNT(*) > 1;`,
    kiem: [kq(['Names used by 2+ students', 'Tên có từ 2 sinh viên']), kqAn(['More students with repeated names', 'Thêm sinh viên trùng tên'], THEM), ma(['Uses HAVING', 'Dùng HAVING'], '\\bHAVING\\b')],
    sai: [`SELECT name, COUNT(*) AS students FROM Student GROUP BY name`, `SELECT name, COUNT(*) AS students FROM Student WHERE major = 'SE' GROUP BY name HAVING COUNT(*) > 1`],
    gy: [['GROUP BY name, then keep groups with more than one row.', 'GROUP BY name, rồi giữ nhóm có hơn một dòng.'], ['HAVING filters groups; WHERE cannot use COUNT.', 'HAVING lọc nhóm; WHERE không dùng được COUNT.']],
    lhg: [['No HAVING — every name is listed.', 'Không HAVING — tên nào cũng hiện.'], ['Restricting to one major — the duplicates of other majors are missed (hidden check).', 'Chỉ xét một ngành — trùng ở ngành khác bị bỏ sót (kiểm ẩn).']],
    gt: ['<p>One counter-example is enough to refute a key. Expected on the sample data: An, 2.</p>', '<p>Một phản ví dụ là đủ bác bỏ khoá. Kết quả trên dữ liệu mẫu: An, 2.</p>'],
    tn: [TN.groupBy, TN.having],
  }),
  de({
    ...U, t: 'Courses that no student takes', k: 'MEDIUM', p: 7,
    kn: ['foreign key', 'NOT EXISTS', 'dangling'], tag: ['keys', 'not-exists'],
    en: '<p>The foreign key Enroll.cid → Course.cid guarantees every enrolment points at a real course — but nothing forces a course to have enrolments. List the courses (<code>cid, title</code>) that appear in no Enroll row.</p>',
    vi: '<p>Khoá ngoại Enroll.cid → Course.cid bảo đảm mọi lượt đăng ký trỏ tới môn có thật — nhưng không có gì buộc một môn phải có người đăng ký. Liệt kê các môn (<code>cid, title</code>) không xuất hiện trong dòng Enroll nào.</p>',
    yc: [['Columns: <code>cid, title</code>.', 'Cột: <code>cid, title</code>.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT c.cid, c.title
FROM Course c
WHERE NOT EXISTS (SELECT 1 FROM Enroll e WHERE e.cid = c.cid);`,
    kiem: [kq(['Courses with no enrolment', 'Môn không ai đăng ký']), kqAn(['JPD113 gets a student, a new course has none', 'JPD113 có người học, môn mới thì chưa'], `INSERT INTO Course VALUES ('PRF192', N'Programming Fundamentals', 3); ${THEM}`), ma(['Uses NOT EXISTS, NOT IN, EXCEPT or an outer join', 'Dùng NOT EXISTS, NOT IN, EXCEPT hoặc nối ngoài'], '\\bNOT\\s+EXISTS\\b|\\bNOT\\s+IN\\b|\\bEXCEPT\\b|\\bLEFT\\s+(OUTER\\s+)?JOIN\\b')],
    sai: [`SELECT c.cid, c.title FROM Course c JOIN Enroll e ON e.cid <> c.cid`, `SELECT c.cid, c.title FROM Course c WHERE c.cid = 'JPD113'`],
    gy: [['"No row in Enroll" = NOT EXISTS (SELECT 1 FROM Enroll WHERE cid = c.cid).', '"Không có dòng trong Enroll" = NOT EXISTS (SELECT 1 FROM Enroll WHERE cid = c.cid).'], ['Alternative: LEFT JOIN Enroll … WHERE e.sid IS NULL.', 'Cách khác: LEFT JOIN Enroll … WHERE e.sid IS NULL.']],
    lhg: [['JOIN … ON e.cid &lt;&gt; c.cid — pairs each course with every OTHER enrolment; almost every course comes back.', 'JOIN … ON e.cid &lt;&gt; c.cid — ghép mỗi môn với mọi lượt đăng ký KHÁC; gần như môn nào cũng hiện.'], ['Hard-coding JPD113 — the hidden data changes who has no students.', 'Ghi cứng JPD113 — dữ liệu ẩn đổi môn nào không có người học.']],
    gt: ['<p>A foreign key constrains the child side only. "Parents without children" are found with an anti-join: NOT EXISTS, EXCEPT, or LEFT JOIN … IS NULL. Expected: JPD113.</p>', '<p>Khoá ngoại chỉ ràng buộc phía con. "Cha không có con" tìm bằng anti-join: NOT EXISTS, EXCEPT, hoặc LEFT JOIN … IS NULL. Kết quả: JPD113.</p>'],
    tn: [TN.fk, TN.exists],
  }),
]);
