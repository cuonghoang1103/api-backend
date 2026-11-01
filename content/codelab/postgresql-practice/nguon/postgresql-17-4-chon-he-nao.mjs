/**
 * PostgreSQL · 17.4 — Chọn hệ CSDL không đoán mò. Bài quyết định (không có gì để chạy) ⇒ bảng tình huống → hệ (theo bảng
 * quyết định + bài tập của bài) và trắc nghiệm về sáu câu hỏi / sai lầm khi chọn.
 */
import { mod, cs, q, bang1, tn } from './_chung.mjs';

export default mod('postgresql-17-4-chon-he-nao', '17.4 Choosing a database without guessing', [
  cs({
    t: 'Situation → database', k: 'MEDIUM', p: 8, kn: ['decision table', 'team and stack', 'licence and hosting'], tag: ['comparison', 'decision'], loai: 'table',
    en: '<p>Use the decision tree of lesson 17.4 (WordPress/MySQL-only host → MySQL; .NET shop with SQL Server licences and DBAs → SQL Server; self-contained documents, few cross-reports, sharding → MongoDB; otherwise PostgreSQL).</p>',
    vi: '<p>Dùng cây quyết định của bài 17.4 (WordPress/host chỉ có MySQL → MySQL; công ty .NET có sẵn giấy phép và DBA SQL Server → SQL Server; document tự chứa, ít báo cáo chéo, cần sharding → MongoDB; còn lại PostgreSQL).</p>',
    bang: [bang1('b1', ['Situation → usual pick', 'Tình huống → lựa chọn thường gặp'], [{ ma: 's', ten: 'Situation / Tình huống' }, { ma: 'd', ten: 'Database / CSDL', luaChon: ['PostgreSQL', 'MySQL / MariaDB', 'SQL Server', 'MongoDB'] }], [
      { o: { s: 'A café chain: blog + online menu on a cheap PHP host / Chuỗi cà phê: blog + thực đơn online trên host PHP giá rẻ' }, a: { d: 'MySQL / MariaDB' } },
      { o: { s: 'A bank\'s internal loan system in C#, with an existing SQL Server team / Hệ thống cho vay nội bộ của ngân hàng viết C#, đã có đội SQL Server' }, a: { d: 'SQL Server' } },
      { o: { s: 'A marketplace in Next.js + Prisma: orders, reviews, flexible product specs / Sàn thương mại Next.js + Prisma: đơn, đánh giá, thông số sản phẩm linh hoạt' }, a: { d: 'PostgreSQL' } },
      { o: { s: 'Millions of sensor readings a day, each a different JSON payload, sharded / Hàng triệu số đo cảm biến mỗi ngày, mỗi bản ghi một JSON khác, cần sharding' }, a: { d: 'MongoDB' } },
      { o: { s: 'A Spring Boot graduation project with RAG features coming later / Đồ án tốt nghiệp Spring Boot, sắp có tính năng RAG' }, a: { d: 'PostgreSQL' } },
      { o: { s: 'Not sure yet: a new SaaS web app, small team, Node.js / Chưa chắc: một web SaaS mới, đội nhỏ, Node.js' }, a: { d: 'PostgreSQL' } },
    ], ['The host decides WordPress; the team and licences decide the bank; document-shaped high-volume data with sharding suits MongoDB (PostgreSQL partitions with BRIN also go far); everything else — and "not sure" — defaults to PostgreSQL with JSONB for the flexible parts (pgvector when RAG arrives, as in LabFlow AI).', 'Host quyết định WordPress; đội và giấy phép quyết định ngân hàng; dữ liệu dạng document khối lượng lớn cần sharding hợp MongoDB (phân mảnh + BRIN của PostgreSQL cũng đi xa); mọi trường hợp còn lại — và "chưa chắc" — mặc định PostgreSQL với JSONB cho phần linh hoạt (pgvector khi có RAG, như LabFlow AI).'])],
    gy: [['Walk the tree from question 1; stop at the first yes.', 'Đi cây quyết định từ câu 1; dừng ở câu "có" đầu tiên.'], ['Existing team and licences are real constraints, not opinions.', 'Đội và giấy phép có sẵn là ràng buộc thật, không phải ý kiến.']],
    lhg: [['Picking MongoDB "because no schema is faster" for relational orders.', 'Chọn MongoDB "vì không có lược đồ thì nhanh hơn" cho đơn hàng có quan hệ.'], ['Ignoring that WordPress supports only MySQL/MariaDB.', 'Bỏ qua việc WordPress chỉ hỗ trợ MySQL/MariaDB.']],
    tn: [tn('decision tree', 'cây quyết định')],
  }),

  cs({
    t: 'Six questions, and the mistakes people make', k: 'EASY', p: 6, kn: ['shape, correctness, questions, team, cost, operations', 'one primary database'], tag: ['comparison', 'decision'],
    en: '<p>Lesson 17.4 in four questions.</p>', vi: '<p>Bài 17.4 trong bốn câu.</p>',
    cau: [
      q('q1', ['Money, stock and grades are involved. Which requirement does that put first?', 'Có tiền, tồn kho và điểm số. Điều đó đặt yêu cầu nào lên đầu?'], ['transactions and constraints everywhere', 'the fastest single-document reads', 'a free managed cloud tier', 'a schemaless data model'], ['Correctness needs ACID transactions plus CHECK/FK/UNIQUE enforced by the database.', 'Tính đúng cần giao dịch ACID cùng CHECK/FK/UNIQUE do CSDL thực thi.']),
      q('q2', ['Two developers propose PostgreSQL + MongoDB + Redis + Elasticsearch for an MVP. The lesson\'s advice?', 'Hai lập trình viên đề xuất PostgreSQL + MongoDB + Redis + Elasticsearch cho MVP. Lời khuyên của bài?'], ['one primary database; add another only with a measured reason', 'use all four from day one, to be safe when traffic grows', 'pick only the one with the most stars on GitHub', 'let each developer choose and run their own database'], ['Each store needs backups, upgrades and monitoring — that is the real cost.', 'Mỗi kho cần sao lưu, nâng cấp và giám sát — đó mới là chi phí thật.']),
      q('q3', ['When should the licence and price page be read?', 'Khi nào nên đọc trang giấy phép và bảng giá?'], ['on day one, before the first migration', 'at the first production invoice', 'only for open-source databases', 'never — databases are free'], ['SQL Server is free only while small or in development; MongoDB\'s SSPL has conditions for offering it as a service.', 'SQL Server chỉ miễn phí khi nhỏ hoặc đang phát triển; SSPL của MongoDB có điều kiện khi cung cấp nó như một dịch vụ.']),
      q('q4', ['What stays the same whichever engine you choose?', 'Điều gì giữ nguyên bất kể bạn chọn hệ nào?'], ['schema design, indexes, transactions, backups you have restored', 'the exact SQL syntax of every query you write', 'the default transaction isolation level of the server', 'the JSON operators and the functions that read JSON'], ['The engine changes syntax and some behaviours (17.2); the discipline of Chapters 3 and 9–15 transfers.', 'Hệ CSDL đổi cú pháp và một số hành vi (17.2); kỷ luật của các Chương 3 và 9–15 thì mang theo được.']),
    ],
    gy: [['Write one sentence per question in the README before the first migration.', 'Viết mỗi câu hỏi một câu trả lời trong README trước migration đầu tiên.'], ['A database outlives most frameworks.', 'CSDL sống lâu hơn phần lớn framework.']],
    lhg: [['Copying a famous company\'s stack.', 'Chép bộ công nghệ của một công ty nổi tiếng.'], ['Adding databases before measuring a need.', 'Thêm CSDL trước khi đo được nhu cầu.']],
    tn: [tn('MVP', 'sản phẩm khả dụng tối thiểu')],
  }),
]);
