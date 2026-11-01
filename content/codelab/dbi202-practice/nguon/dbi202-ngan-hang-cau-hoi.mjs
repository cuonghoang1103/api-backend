/**
 * DBI202 · 9.2 Ngân hàng câu hỏi vấn đáp theo CLO — 30 câu hỏi kiến tạo của syllabus, nhóm theo 7 CLO, trả lời bằng đúng thuật ngữ
 * người chấm cần nghe. Đề tĩnh: ghép câu hỏi ↔ CLO, ghép câu hỏi ↔ ý trả lời then chốt, và chọn câu trả lời "đáng điểm" nhất.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';

export default mod('dbi202-ngan-hang-cau-hoi', '9.2 Oral question bank by CLO', [
  cs({
    t: 'Which CLO does each oral question test?', k: 'EASY', p: 5, loai: 'table',
    kn: ['course learning outcomes'], tag: ['exam-prep', 'oral'],
    en: '<p>Match each syllabus question to its learning outcome group.</p>', vi: '<p>Ghép mỗi câu hỏi của syllabus với nhóm chuẩn đầu ra của nó.</p>',
    bang: [bang1('b1', ['Question → CLO', 'Câu hỏi → CLO'],
      [{ ma: 'cau', ten: 'Question / Câu hỏi' }, { ma: 'clo', ten: 'CLO', luaChon: ['CLO1 database concepts', 'CLO2 relational model & algebra', 'CLO3–4 FDs & normalization', 'CLO4 ER modelling', 'CLO5 SQL', 'CLO6–7 programmability, indexes, transactions'] }],
      [{ o: { cau: 'What is the three-level architecture?' }, a: { clo: 'CLO1 database concepts' } },
        { o: { cau: 'Why do we need an algebraic query language?' }, a: { clo: 'CLO2 relational model & algebra' } },
        { o: { cau: 'What are anomalies and how do we solve them?' }, a: { clo: 'CLO3–4 FDs & normalization' } },
        { o: { cau: 'Why do conceptual design at all?' }, a: { clo: 'CLO4 ER modelling' } },
        { o: { cau: 'Correlated versus non-correlated subquery?' }, a: { clo: 'CLO5 SQL' } },
        { o: { cau: 'Name the isolation levels and what each prevents.' }, a: { clo: 'CLO6–7 programmability, indexes, transactions' } }],
      ['The seven CLOs follow the chapters: concepts → relational model → FDs/normalization → ER → SQL → programmability, indexes, transactions.', 'Bảy CLO đi theo các chương: khái niệm → mô hình quan hệ → FD/chuẩn hoá → ER → SQL → lập trình, chỉ mục, giao dịch.'])],
    gy: [['Look for the key noun: anomaly ⇒ normalization, isolation ⇒ transactions.', 'Tìm danh từ then chốt: anomaly ⇒ chuẩn hoá, isolation ⇒ giao dịch.'], ['Algebra and constraints belong to CLO2.', 'Đại số và ràng buộc thuộc CLO2.']],
    lhg: [['Putting "conceptual design" under SQL.', 'Xếp "thiết kế khái niệm" vào SQL.'], ['Confusing the three-level architecture with the three design levels (conceptual/logical/physical).', 'Nhầm kiến trúc ba mức với ba mức thiết kế (khái niệm/logic/vật lý).']],
    tn: [tn('learning outcome (CLO)', 'chuẩn đầu ra học phần')],
  }),
  cs({
    t: 'Question → the key idea the marker listens for', k: 'MEDIUM', p: 7, loai: 'table',
    kn: ['oral answers', 'vocabulary'], tag: ['exam-prep', 'oral'],
    en: '<p>For each question, pick the phrase that must appear in a good answer.</p>', vi: '<p>Với mỗi câu hỏi, chọn cụm ý phải xuất hiện trong câu trả lời tốt.</p>',
    bang: [bang1('b1', ['Question → key idea', 'Câu hỏi → ý then chốt'],
      [{ ma: 'cau', ten: 'Question / Câu hỏi' }, { ma: 'y', ten: 'Key idea', luaChon: ['data independence', 'two rows agreeing on X agree on Y', 'every determinant is a superkey', 'WHERE filters rows, HAVING filters groups', 'a view stores a query, not data', 'a B-tree seek instead of a scan; costs space and writes', 'one mechanism per letter: log, constraints, locks/versions, WAL'] }],
      [{ o: { cau: 'What does the three-level architecture buy us?' }, a: { y: 'data independence' } },
        { o: { cau: 'What is a functional dependency X → Y?' }, a: { y: 'two rows agreeing on X agree on Y' } },
        { o: { cau: 'BCNF in one line?' }, a: { y: 'every determinant is a superkey' } },
        { o: { cau: 'Difference between WHERE and HAVING?' }, a: { y: 'WHERE filters rows, HAVING filters groups' } },
        { o: { cau: 'View versus table?' }, a: { y: 'a view stores a query, not data' } },
        { o: { cau: 'How does an index speed up a query, and what does it cost?' }, a: { y: 'a B-tree seek instead of a scan; costs space and writes' } },
        { o: { cau: 'What are the ACID properties?' }, a: { y: 'one mechanism per letter: log, constraints, locks/versions, WAL' } }],
      ['"The vocabulary is the assessed skill": say update anomaly, transitive dependency, 3NF — not "the data would be duplicated".', '"Từ vựng chính là kỹ năng được chấm": nói update anomaly, transitive dependency, 3NF — không nói "dữ liệu sẽ bị lặp".'])],
    gy: [['Definition first, then one example, then a limit or trade-off.', 'Định nghĩa trước, rồi một ví dụ, rồi một giới hạn hoặc đánh đổi.'], ['Name the mechanism, not just the property.', 'Gọi tên cơ chế, không chỉ tính chất.']],
    lhg: [['Describing an FD as "an observation about the current data" — it is a business rule.', 'Mô tả FD là "quan sát trên dữ liệu hiện tại" — nó là luật nghiệp vụ.'], ['Answering ACID with four words and no mechanism.', 'Trả lời ACID bằng bốn từ mà không có cơ chế.']],
    tn: [tn('functional dependency', 'phụ thuộc hàm'), tn('determinant', 'vế trái (định thuộc)')],
  }),
  cs({
    t: 'Pick the answer that earns the marks', k: 'MEDIUM', p: 7,
    kn: ['oral exam', 'precise terminology'], tag: ['exam-prep', 'oral'],
    en: '<p>Five syllabus questions; choose the strongest answer.</p>', vi: '<p>Năm câu hỏi của syllabus; chọn câu trả lời mạnh nhất.</p>',
    cau: [
      q('c1', ['Why a database rather than files?', 'Vì sao dùng CSDL thay cho tệp?'], ['files duplicate data, no rules, no concurrency, no recovery', 'databases are always faster than reading plain files', 'files cannot store numbers, dates or Vietnamese text', 'a database never needs a backup, files always do'], ['Name the concrete problems: redundancy, integrity, concurrent access, crash recovery.', 'Gọi tên vấn đề cụ thể: dư thừa, toàn vẹn, truy cập đồng thời, phục hồi sau sự cố.']),
      q('c2', ['Schema versus instance?', 'Lược đồ và thể hiện khác nhau thế nào?'], ['the schema is the definition and rarely changes; the instance is the rows stored now', 'the schema is the data, the instance is the program', 'they are two names for the same table', 'the instance is the backup of the schema'], ['Definition + how often each changes.', 'Định nghĩa + mức độ thay đổi của từng cái.']),
      q('c3', ['The good, the bad and the ugly of decomposition?', 'Cái tốt, cái xấu và cái tệ của phân rã?'], ['removes redundancy · more joins · a lossy or dependency-losing split', 'more tables · fewer tables · no tables', 'faster writes · slower writes · no change', 'smaller backups · larger backups · lost backups'], ['Lesson 4.3: lossless join and dependency preservation are the two tests.', 'Bài 4.3: nối không mất mát và bảo toàn phụ thuộc là hai phép thử.']),
      q('c4', ['Procedure versus function?', 'Procedure và function khác nhau?'], ['procedure: EXEC, may change data; function: used in a query', 'a function can change data, a procedure never can', 'they are identical in SQL Server, only the name differs', 'a procedure must always return a table to its caller'], ['Add the side-effect rule: functions are side-effect free.', 'Thêm luật về tác dụng phụ: function không có tác dụng phụ.']),
      q('c5', ['"And when would you break this rule?" — about 3NF, the best answer is…', '"Khi nào bạn phá luật này?" — về 3NF, câu trả lời tốt nhất là…'], ['denormalise a reporting table for read speed, keeping one place that updates it', 'never: normalization must always be complete', 'whenever the team does not like joins', 'when the database has more than 100 tables'], ['Knowing the limits of a rule is what separates a strong answer.', 'Biết giới hạn của luật là điều làm câu trả lời nổi bật.']),
    ],
    gy: [['Answer with the term the marker is listening for.', 'Trả lời bằng thuật ngữ người chấm đang chờ nghe.'], ['Always add the limit or trade-off.', 'Luôn thêm giới hạn hoặc đánh đổi.']],
    lhg: [['Vague answers ("it is better", "it is faster").', 'Trả lời mơ hồ ("nó tốt hơn", "nó nhanh hơn").'], ['Absolute rules with no exception.', 'Luật tuyệt đối không có ngoại lệ.']],
    tn: [tn('lossless decomposition', 'phân rã không mất mát')],
  }),
]);
