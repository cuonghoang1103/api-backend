/**
 * DBI202 · 2.2 Đại số quan hệ — σ, π, ⋈, ρ trên University; dịch biểu thức đại số sang SQL và ngược lại.
 */
import { mod, de, cs, q, ord, kq, kqAn, ma, TN, tn } from './_chung.mjs';
import { UNI, LUOC_DO_UNI } from './_du-lieu.mjs';

const U = { csdl: UNI, tenCsdl: 'University', ld: LUOC_DO_UNI };
const THEM = `INSERT INTO Student VALUES ('SE04', N'Giang', 'SE'), ('AI02', N'Hà', 'AI');
INSERT INTO Enroll VALUES ('SE04', 'DBI202', 9.0), ('AI02', 'DBI202', 7.5), ('SE03', 'DBI202', 8.0)`;

export default mod('dbi202-dai-so-quan-he', '2.2 Relational algebra', [
  de({
    ...U, t: 'π after σ: names of SE students (a set)', k: 'EASY', p: 6,
    kn: ['σ', 'π', 'set semantics'], tag: ['relational-algebra'],
    en: '<p>Write <code>π<sub>name</sub>(σ<sub>major = \'SE\'</sub>(Student))</code>. The algebra returns a <b>set</b>: the two different students called An give one tuple.</p>',
    vi: '<p>Viết <code>π<sub>name</sub>(σ<sub>major = \'SE\'</sub>(Student))</code>. Đại số trả một <b>tập</b>: hai sinh viên khác nhau tên An chỉ cho một bộ.</p>',
    yc: [['One column: <code>name</code>, each value once.', 'Một cột: <code>name</code>, mỗi giá trị một lần.'], ['Row order does not matter.', 'Thứ tự dòng không quan trọng.']],
    giai: `SELECT DISTINCT name        -- π (on a set ⇒ DISTINCT)
FROM Student
WHERE major = 'SE';         -- σ`,
    kiem: [kq(['Distinct SE names', 'Tên SE không trùng']), kqAn(['A new SE student', 'Thêm sinh viên SE'], THEM), ma(['Uses DISTINCT', 'Dùng DISTINCT'], '\\bDISTINCT\\b')],
    sai: [`SELECT name FROM Student WHERE major = 'SE'`, `SELECT DISTINCT name FROM Student`],
    gy: [['σ = WHERE, π = SELECT list; on a set add DISTINCT.', 'σ = WHERE, π = danh sách SELECT; trên tập thêm DISTINCT.'], ['Select first, project last: after π the column major no longer exists.', 'Chọn trước, chiếu sau: sau π cột major không còn nữa.']],
    lhg: [['No DISTINCT — An appears twice (bag answer: 3 rows).', 'Không DISTINCT — An hiện hai lần (đáp án túi: 3 dòng).'], ['Forgetting σ — names of every major.', 'Quên σ — tên của mọi ngành.']],
    gt: ['<p>Set answer {An, Bình} = 2 tuples; SQL without DISTINCT gives 3 rows. FE questions ask "how many tuples" with set semantics.</p>', '<p>Đáp án tập {An, Bình} = 2 bộ; SQL không DISTINCT cho 3 dòng. Câu FE hỏi "bao nhiêu bộ" theo ngữ nghĩa tập.</p>'],
    tn: [tn('selection σ', 'phép chọn σ'), tn('projection π', 'phép chiếu π')],
  }),
  de({
    ...U, t: 'A 3-step expression tree: ⋈, σ, π', k: 'MEDIUM', p: 8,
    kn: ['natural join', 'expression tree'], tag: ['relational-algebra', 'join'],
    en: '<p>Write <code>π<sub>name</sub>(σ<sub>cid = \'DBI202\' AND score ≥ 8</sub>(Student ⋈ Enroll))</code> — the names of students who scored at least 8 in DBI202. The natural join is on the only common attribute, <code>sid</code>.</p>',
    vi: '<p>Viết <code>π<sub>name</sub>(σ<sub>cid = \'DBI202\' AND score ≥ 8</sub>(Student ⋈ Enroll))</code> — tên sinh viên đạt ít nhất 8 môn DBI202. Phép nối tự nhiên trên thuộc tính chung duy nhất <code>sid</code>.</p>',
    yc: [['One column: <code>name</code>.', 'Một cột: <code>name</code>.'], ['Write the join with JOIN … ON (SQL Server has no NATURAL JOIN). Row order does not matter.', 'Viết phép nối bằng JOIN … ON (SQL Server không có NATURAL JOIN). Thứ tự dòng không quan trọng.']],
    giai: `SELECT s.name                                  -- π name
FROM Student s
JOIN Enroll e ON e.sid = s.sid                 -- ⋈ on sid
WHERE e.cid = 'DBI202' AND e.score >= 8;       -- σ`,
    kiem: [kq(['DBI202 students with score ≥ 8', 'Sinh viên DBI202 điểm ≥ 8']), kqAn(['Three more DBI202 marks', 'Thêm ba điểm DBI202'], THEM), ma(['Uses JOIN', 'Dùng JOIN'], '\\bJOIN\\b')],
    sai: [`SELECT s.name FROM Student s JOIN Enroll e ON e.sid = s.sid WHERE e.cid = 'DBI202' AND e.score > 8`, `SELECT s.name FROM Student s JOIN Enroll e ON e.sid = s.sid WHERE e.cid = 'DBI202' OR e.score >= 8`],
    gy: [['Evaluate bottom-up: join, then filter, then keep name.', 'Tính từ dưới lên: nối, rồi lọc, rồi giữ name.'], ['≥ 8 is &gt;= 8: a score of exactly 8 counts.', '≥ 8 là &gt;= 8: đúng 8 điểm cũng tính.']],
    lhg: [['score &gt; 8 — a student with exactly 8.0 is lost (hidden check).', 'score &gt; 8 — sinh viên đúng 8.0 bị mất (kiểm ẩn).'], ['OR instead of AND — every DBI202 student plus every high score elsewhere.', 'OR thay vì AND — mọi sinh viên DBI202 cộng mọi điểm cao môn khác.']],
    gt: ['<p>An equivalent, cheaper tree pushes σ to Enroll first: π<sub>name</sub>(Student ⋈ σ<sub>cid=\'DBI202\' ∧ score≥8</sub>(Enroll)). The optimizer does this for you. Expected: Chi, An.</p>', '<p>Cây tương đương rẻ hơn đẩy σ xuống Enroll trước: π<sub>name</sub>(Student ⋈ σ<sub>cid=\'DBI202\' ∧ score≥8</sub>(Enroll)). Bộ tối ưu làm việc này giúp bạn. Kết quả: Chi, An.</p>'],
    tn: [TN.join, tn('expression tree', 'cây biểu thức')],
  }),
  de({
    ...U, t: 'ρ and a self-join: pairs of students in the same major', k: 'MEDIUM', p: 9,
    kn: ['rename ρ', 'theta join', 'self-join'], tag: ['relational-algebra', 'self-join'],
    en: '<p>Write <code>ρ<sub>S1</sub>(Student) ⋈<sub>S1.major = S2.major AND S1.sid &lt; S2.sid</sub> ρ<sub>S2</sub>(Student)</code>: every pair of different students in the same major, each pair once.</p>',
    vi: '<p>Viết <code>ρ<sub>S1</sub>(Student) ⋈<sub>S1.major = S2.major AND S1.sid &lt; S2.sid</sub> ρ<sub>S2</sub>(Student)</code>: mọi cặp sinh viên khác nhau cùng ngành, mỗi cặp một lần.</p>',
    yc: [['Columns: <code>sid1, sid2, major</code>.', 'Cột: <code>sid1, sid2, major</code>.'], ['sid1 &lt; sid2. Row order does not matter.', 'sid1 &lt; sid2. Thứ tự dòng không quan trọng.']],
    giai: `SELECT S1.sid AS sid1, S2.sid AS sid2, S1.major
FROM Student AS S1                                  -- ρ S1
JOIN Student AS S2                                  -- ρ S2
  ON S1.major = S2.major AND S1.sid < S2.sid;       -- same major, each pair once`,
    kiem: [kq(['Same-major pairs', 'Các cặp cùng ngành']), kqAn(['Two more students', 'Thêm hai sinh viên'], THEM), ma(['Joins Student with itself', 'Nối Student với chính nó'], '\\bStudent\\b[\\s\\S]*\\bJOIN\\s+Student\\b|\\bFROM\\s+Student\\b[^;]*,\\s*Student\\b')],
    sai: [`SELECT S1.sid AS sid1, S2.sid AS sid2, S1.major FROM Student S1 JOIN Student S2 ON S1.major = S2.major`, `SELECT S1.sid AS sid1, S2.sid AS sid2, S1.major FROM Student S1 JOIN Student S2 ON S1.major = S2.major AND S1.sid <> S2.sid`],
    gy: [['Two copies of Student need two aliases (that is ρ).', 'Hai bản sao Student cần hai bí danh (đó là ρ).'], ['S1.sid &lt; S2.sid removes (x, x) and keeps only one of (x, y), (y, x).', 'S1.sid &lt; S2.sid bỏ (x, x) và chỉ giữ một trong (x, y), (y, x).']],
    lhg: [['Only S1.major = S2.major — 11 rows, including each student paired with themself.', 'Chỉ S1.major = S2.major — 11 dòng, có cả sinh viên ghép với chính mình.'], ['&lt;&gt; instead of &lt; — every pair twice (6 rows).', '&lt;&gt; thay vì &lt; — mỗi cặp hai lần (6 dòng).']],
    gt: ['<p>Expected: (SE01, SE02), (SE01, SE03), (SE02, SE03), all SE. The same pattern answers "pairs of employees with the same supervisor", "two products with the same price"…</p>', '<p>Kết quả: (SE01, SE02), (SE01, SE03), (SE02, SE03), đều SE. Cùng mẫu này trả lời "cặp nhân viên cùng người giám sát", "hai sản phẩm cùng giá"…</p>'],
    tn: [TN.selfJoin, tn('rename ρ', 'phép đổi tên ρ')],
  }),
  cs({
    t: 'Match the question with its algebra expression', k: 'MEDIUM', p: 8,
    kn: ['relational algebra', 'translation'], tag: ['relational-algebra'],
    en: '<p>University schema. Pick the expression that answers each question (lesson 2.2 worked example).</p>',
    vi: '<p>Lược đồ University. Chọn biểu thức trả lời đúng mỗi câu hỏi (ví dụ có lời giải bài 2.2).</p>',
    cau: [
      q('c1', ['The titles of the courses that student SE02 takes.', 'Tên các môn sinh viên SE02 học.'], ['π<sub>title</sub>(σ<sub>sid=\'SE02\'</sub>(Enroll) ⋈ Course)', 'σ<sub>sid=\'SE02\'</sub>(π<sub>title</sub>(Enroll ⋈ Course))', 'π<sub>title</sub>(σ<sub>sid=\'SE02\'</sub>(Course))', 'π<sub>title</sub>(Enroll × Course)'], ['Filter Enroll, join to get the title, project. Projecting title before σ loses sid; Course has no sid; the product has no join condition.', 'Lọc Enroll, nối để lấy title, rồi chiếu. Chiếu title trước σ thì mất sid; Course không có sid; tích không có điều kiện nối.']),
      q('c2', ['The sids of students who take DBI202 or CSD201.', 'sid của sinh viên học DBI202 hoặc CSD201.'], ['π<sub>sid</sub>(σ<sub>cid=\'DBI202\'</sub>(Enroll)) ∪ π<sub>sid</sub>(σ<sub>cid=\'CSD201\'</sub>(Enroll))', 'π<sub>sid</sub>(σ<sub>cid=\'DBI202\' AND cid=\'CSD201\'</sub>(Enroll))', 'π<sub>sid</sub>(σ<sub>cid=\'DBI202\'</sub>(Enroll)) ∩ π<sub>sid</sub>(σ<sub>cid=\'CSD201\'</sub>(Enroll))', 'π<sub>sid</sub>(Enroll) − π<sub>sid</sub>(σ<sub>cid=\'DBI202\'</sub>(Enroll))'], ['"Or" across two sets is ∪ (one σ with OR would also work). AND on one row is never true; ∩ means "both".', '"Hoặc" giữa hai tập là ∪ (một σ với OR cũng được). AND trên một dòng không bao giờ đúng; ∩ nghĩa là "cả hai".']),
      q('c3', ['The sids of students who take no course at all.', 'sid của sinh viên không học môn nào.'], ['π<sub>sid</sub>(Student) − π<sub>sid</sub>(Enroll)', 'π<sub>sid</sub>(Enroll) − π<sub>sid</sub>(Student)', 'π<sub>sid</sub>(σ<sub>cid=NULL</sub>(Enroll))', 'π<sub>sid</sub>(Student ⋈ Enroll)'], ['All students minus those who appear in Enroll. The reverse is always empty (foreign key); Enroll has no NULL cid; the join keeps only students WITH courses.', 'Mọi sinh viên trừ những người có trong Enroll. Chiều ngược luôn rỗng (khoá ngoại); Enroll không có cid NULL; phép nối chỉ giữ sinh viên CÓ môn.']),
      q('c4', ['How many tuples does π<sub>major</sub>(Student) return (set semantics)?', 'π<sub>major</sub>(Student) trả bao nhiêu bộ (ngữ nghĩa tập)?'], ['3', '5', '2', '1'], ['The majors are SE, SE, AI, SE, GD ⇒ the set {SE, AI, GD}.', 'Các ngành là SE, SE, AI, SE, GD ⇒ tập {SE, AI, GD}.']),
    ],
    gy: [['Read the question for "or" (∪), "both" (∩), "not / never" (−).', 'Đọc câu hỏi tìm "hoặc" (∪), "cả hai" (∩), "không / chưa" (−).'], ['σ must come before a π that removes the attribute σ tests.', 'σ phải đứng trước π nếu π bỏ thuộc tính mà σ cần kiểm.']],
    lhg: [['Using AND inside one σ for "both courses" — one row has one cid.', 'Dùng AND trong một σ cho "cả hai môn" — một dòng chỉ có một cid.'], ['Counting tuples with bag semantics when the question uses the algebra (sets).', 'Đếm bộ theo ngữ nghĩa túi khi đề dùng đại số (tập).']],
    tn: [TN.setOp],
  }),
  cs({
    t: 'Evaluate the tree bottom-up', k: 'EASY', p: 5, loai: 'order',
    kn: ['expression tree', 'evaluation order'], tag: ['relational-algebra'],
    en: '<p>Order the steps that evaluate <code>π<sub>title</sub>(σ<sub>score ≥ 8</sub>(Enroll) ⋈ Course)</code>.</p>',
    vi: '<p>Sắp các bước tính <code>π<sub>title</sub>(σ<sub>score ≥ 8</sub>(Enroll) ⋈ Course)</code>.</p>',
    cau: [ord('o1', ['From the leaves to the root', 'Từ lá lên gốc'],
      ['Read the base relations Enroll and Course', 'Apply σ score ≥ 8 to Enroll', 'Join the filtered Enroll with Course on cid', 'Project the result onto title (removing duplicates)'],
      ['Leaves first, then each inner node; π is the root. Result: {Databases, Data Structures, Mathematics}.', 'Lá trước, rồi từng nút trong; π là gốc. Kết quả: {Databases, Data Structures, Mathematics}.'])],
    gy: [['The innermost parentheses are evaluated first.', 'Ngoặc trong cùng được tính trước.'], ['π is the outermost operator, so it is last.', 'π là phép ngoài cùng nên tính sau cùng.']],
    lhg: [['Doing π first — title alone cannot be joined to anything.', 'Làm π trước — chỉ còn title thì không nối được gì.'], ['Joining before filtering is legal but is not what this tree says.', 'Nối trước khi lọc vẫn hợp lệ nhưng không đúng cây này.']],
  }),
]);
