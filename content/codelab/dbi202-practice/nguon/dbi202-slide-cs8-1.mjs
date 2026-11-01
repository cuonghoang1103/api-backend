/**
 * DBI202 · ⭐ CS.8 phần 1 — phỏng vấn CSDL: khung trả lời 3 bước, viết SQL trước mặt người phỏng vấn, ngân hàng 66 câu lý thuyết
 * (slide 1–12). Đề tĩnh: thứ tự viết SQL trực tiếp + hai bộ câu "đánh đổi" chọn từ ngân hàng (các khẳng định đã chạy thật).
 */
import { mod, cs, q, ord, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs8-1', '⭐ CS.8 Database interviews (1): answering + theory bank', [
  cs({
    t: 'Writing SQL live in front of the interviewer: the order that works', k: 'EASY', p: 5, loai: 'order',
    kn: ['live SQL interview', 'clarifying questions', 'edge cases'], tag: ['advanced', 'interview'],
    en: '<p>Slides 3–4. The interviewer says "find the second-highest salary". Order what you do.</p>', vi: '<p>Slide 3–4. Người phỏng vấn nói "tìm lương cao thứ hai". Sắp những việc bạn làm.</p>',
    cau: [ord('o1', ['First → last', 'Đầu → cuối'], ['Ask: ties? NULL salaries? what if there is no second value?', 'Say the plan out loud: distinct salaries, rank them, take rank 2', 'Write it as small named CTE steps', 'Run it by hand on a tiny example with a tie and a NULL', 'Offer a second solution and the index that would help'],
      ['Clarify → plan → write → test by hand → alternatives. Interviewers grade the questions you ask as much as the SQL you write.', 'Hỏi rõ → lập kế hoạch → viết → chạy tay → phương án khác. Người phỏng vấn chấm câu bạn hỏi ngang với câu SQL bạn viết.'])],
    gy: [['Never start typing before the edge cases are agreed.', 'Đừng gõ trước khi thống nhất các ca biên.'], ['Test with the nasty example, not the happy one.', 'Thử bằng ví dụ khó chịu, không phải ví dụ đẹp.']],
    lhg: [['Jumping straight to TOP 1 … WHERE salary < (SELECT MAX …) without asking about ties.', 'Lao ngay vào TOP 1 … WHERE salary < (SELECT MAX …) mà không hỏi về hoà.'], ['Stopping at the first solution without mentioning indexes or alternatives.', 'Dừng ở lời giải đầu tiên mà không nhắc chỉ mục hay phương án khác.']],
    tn: [tn('clarifying question', 'câu hỏi làm rõ'), tn('edge case', 'ca biên')],
  }),
  cs({
    t: 'Bank Q1–30: keys, normalisation, joins — answer with the trade-off', k: 'MEDIUM', p: 8,
    kn: ['keys', 'normalisation', 'joins', 'NULL'], tag: ['advanced', 'interview'],
    en: '<p>Five questions from slides 5–8. Each claim about engine behaviour was run on SQL Server and PostgreSQL.</p>', vi: '<p>Năm câu từ slide 5–8. Mọi khẳng định về hành vi của hệ đều đã chạy trên SQL Server và PostgreSQL.</p>',
    cau: [
      q('c1', ['A UNIQUE column on SQL Server and on PostgreSQL receives a second NULL. Result?', 'Cột UNIQUE trên SQL Server và PostgreSQL nhận NULL thứ hai. Kết quả?'], ['SQL Server refuses it; PostgreSQL accepts it', 'both accept it: NULL is never equal to NULL', 'both refuse it: NULL counts as a value', 'SQL Server accepts it; PostgreSQL refuses it'], ['SQL Server treats NULLs as equal for UNIQUE (one NULL only; use a filtered index for more). PostgreSQL 15+ can choose with NULLS NOT DISTINCT.', 'SQL Server coi các NULL bằng nhau với UNIQUE (chỉ một NULL; dùng chỉ mục lọc để có nhiều). PostgreSQL 15+ chọn được bằng NULLS NOT DISTINCT.']),
      q('c2', ['"Why not just normalise everything to BCNF?" — the best short answer is…', '"Sao không chuẩn hoá mọi thứ lên BCNF?" — câu trả lời ngắn tốt nhất là…'], ['BCNF can lose a dependency, and reads may need more joins; 3NF is the usual stop', 'BCNF is only a theory and no real DBMS supports it', 'BCNF tables cannot have foreign keys', 'normalisation makes every query slower'], ['Definition → example → trade-off: 3NF always preserves dependencies; BCNF might not.', 'Định nghĩa → ví dụ → đánh đổi: 3NF luôn bảo toàn phụ thuộc; BCNF có thể không.']),
      q('c3', ['WHERE id NOT IN (SELECT customerId FROM Orders) returns no rows at all. Most likely…', 'WHERE id NOT IN (SELECT customerId FROM Orders) không trả dòng nào. Nhiều khả năng…'], ['one order has a NULL customerId', 'every customer has placed an order', 'the subquery returns too many rows', 'NOT IN needs an index on customerId'], ['x NOT IN (…, NULL) is never TRUE. Use NOT EXISTS, which ignores NULLs correctly.', 'x NOT IN (…, NULL) không bao giờ TRUE. Dùng NOT EXISTS, nó xử lý NULL đúng.']),
      q('c4', ['COUNT(*) vs COUNT(e.empSSN) after a LEFT JOIN of departments to employees: an empty department shows…', 'COUNT(*) vs COUNT(e.empSSN) sau LEFT JOIN phòng với nhân viên: phòng trống hiện…'], ['1 with COUNT(*), 0 with COUNT(e.empSSN)', '0 with both counts', '1 with both counts', 'NULL with COUNT(*), 0 with COUNT(e.empSSN)'], ['The LEFT JOIN produces one row of NULLs; COUNT(*) counts rows, COUNT(column) skips NULLs.', 'LEFT JOIN sinh một dòng toàn NULL; COUNT(*) đếm dòng, COUNT(cột) bỏ NULL.']),
      q('c5', ['DELETE vs TRUNCATE inside a transaction, then ROLLBACK:', 'DELETE và TRUNCATE trong một giao dịch rồi ROLLBACK:'], ['both are undone on SQL Server and on PostgreSQL', 'only DELETE can be rolled back on either engine', 'TRUNCATE is undone only on PostgreSQL', 'neither can be rolled back once it runs'], ['A common myth. TRUNCATE is logged (page deallocations) and fully transactional; it also resets IDENTITY on SQL Server.', 'Một hiểu lầm phổ biến. TRUNCATE có ghi nhật ký (giải phóng trang) và hoàn toàn giao dịch; nó còn đặt lại IDENTITY trên SQL Server.']),
    ],
    gy: [['Three steps: definition, example with a number, trade-off.', 'Ba bước: định nghĩa, ví dụ có số, đánh đổi.'], ['When an engine detail matters, say which engine.', 'Khi chi tiết của hệ quan trọng, nói rõ hệ nào.']],
    lhg: [['"TRUNCATE cannot be rolled back" — false on both engines.', '"TRUNCATE không rollback được" — sai trên cả hai hệ.'], ['Using NOT IN on a nullable column.', 'Dùng NOT IN trên cột cho phép NULL.']],
    tn: [tn('trade-off', 'sự đánh đổi'), tn('three-valued logic', 'logic ba giá trị')],
  }),
  cs({
    t: 'Bank Q31–66: indexes, transactions, NoSQL, security — the trade-off answers', k: 'HARD', p: 8,
    kn: ['indexes', 'isolation', 'NoSQL', 'security', 'operations'], tag: ['advanced', 'interview'],
    en: '<p>Five questions from slides 9–12.</p>', vi: '<p>Năm câu từ slide 9–12.</p>',
    cau: [
      q('c1', ['"Should we index every column used in a WHERE?"', '"Có nên đánh chỉ mục mọi cột xuất hiện trong WHERE?"'], ['no: each index slows writes; index selective, frequent filters and FKs', 'yes: indexes only cost disk space', 'yes, but only on tables larger than 1 GB', 'no: the optimizer ignores indexes on small columns'], ['Back it up with the read/write ratio and an unused-index query.', 'Chứng minh bằng tỉ lệ đọc/ghi và truy vấn tìm chỉ mục không dùng.']),
      q('c2', ['Default isolation level: SQL Server and PostgreSQL both say READ COMMITTED. The difference?', 'Mức cô lập mặc định: SQL Server và PostgreSQL đều là READ COMMITTED. Khác nhau ở đâu?'], ['SQL Server uses short S locks (readers can wait); PostgreSQL reads snapshots', 'PostgreSQL allows dirty reads, SQL Server does not', 'SQL Server is SERIALIZABLE in practice', 'there is no difference in behaviour'], ['Same name, different mechanism — unless RCSI is ON in SQL Server.', 'Cùng tên, khác cơ chế — trừ khi bật RCSI trên SQL Server.']),
      q('c3', ['"When would you pick MongoDB over PostgreSQL?"', '"Khi nào bạn chọn MongoDB thay PostgreSQL?"'], ['whole documents with varying fields, few cross-entity transactions', 'whenever the data is larger than what one server can hold', 'when the data needs many foreign keys and multi-table joins', 'never, because PostgreSQL jsonb makes MongoDB useless'], ['Then add the cost: no joins/constraints across collections, and jsonb often covers the case.', 'Rồi nói cái giá: không nối/ràng buộc giữa các collection, và jsonb thường đã đủ.']),
      q('c4', ['"How do you store passwords?"', '"Bạn lưu mật khẩu thế nào?"'], ['a slow salted hash (bcrypt/Argon2) computed in the app', 'AES-encrypted with a key kept in the database', 'SHA-256 of the password, which is irreversible', 'in plain text, protected by GRANT permissions'], ['Hash ≠ encryption; salt defeats rainbow tables; cost slows guessing.', 'Băm ≠ mã hoá; muối vô hiệu bảng rainbow; chi phí làm chậm đoán.']),
      q('c5', ['"The database is slow" — your first step is…', '"CSDL chạy chậm" — bước đầu tiên của bạn là…'], ['find the slow statements and measure plan, reads, waits', 'add more RAM to the server and restart it tonight', 'rebuild every index in the database overnight', 'move the whole application to a NoSQL database'], ['Measure first; the 6-step diagnosis of CS.3 is the answer they want to hear.', 'Đo trước; quy trình 6 bước của CS.3 là câu họ muốn nghe.']),
    ],
    gy: [['Every answer ends with "it depends on … because …".', 'Mỗi câu trả lời kết bằng "tuỳ vào … vì …".'], ['Quote a number you measured in this course.', 'Dẫn một con số bạn đã đo trong khoá học.']],
    lhg: [['Absolute answers ("always", "never") without the trade-off.', 'Câu trả lời tuyệt đối ("luôn", "không bao giờ") không có đánh đổi.'], ['Guessing performance fixes before measuring.', 'Đoán cách sửa hiệu năng trước khi đo.']],
    tn: [tn('read/write ratio', 'tỉ lệ đọc/ghi')],
  }),
]);
