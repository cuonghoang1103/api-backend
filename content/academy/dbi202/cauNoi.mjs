/**
 * DBI202 · ⭐ Cầu nối "Từ DBI202 đi làm" (27/10/2026) — bài VIDEO tự thêm, NẰM NGOÀI bộ sinh flm-nguon/DBI202/gen
 * (chuyen-sau.mjs là file sinh — đừng thêm bài vào đó). Đặt cuối mục ⭐ Chuyên sâu trong DBI202.mjs.
 * Chủ kênh hỏi: học DBI202 có dùng được khi đi làm / dự án ngoài / sang khoá PostgreSQL không ⇒ bài này trả lời:
 * phần nào dùng ngay ở công ty, phần nào chủ yếu để thi, SQL Server → PostgreSQL đổi gì, dự án nào để luyện và ghi CV.
 * Video gắn sau qua content/course-videos/introduction-to-databases.mjs theo slug `dbi202-cau-noi-di-lam`.
 */
import { bi } from './_slides.mjs';

const C = '/courses/introduction-to-databases/learn?lessonSlug=';
const P = '/courses/postgresql/learn?lessonSlug=';
const a = (href, text) => `<a href="${href}">${text}</a>`;

const L_cau_noi = {
  title: '⭐ Bridge — From DBI202 to a real job: what you use, what changes in PostgreSQL, what to build|||⭐ Cầu nối — Từ DBI202 đi làm: dùng gì, sang PostgreSQL đổi gì, làm dự án nào',
  slug: 'dbi202-cau-noi-di-lam',
  type: 'VIDEO',
  description: 'Bài cầu nối sau DBI202: chương nào dùng ngay ở công ty (thiết kế bảng, SQL hằng ngày, chỉ mục khi trang chậm, giao dịch khi trừ tiền), phần nào chủ yếu để thi, bảng đổi SQL Server → PostgreSQL (IDENTITY, TOP/LIMIT, chuỗi, ngày giờ, OUTPUT/RETURNING, khoá vs MVCC, lỗi giữa giao dịch, hoa thường), và lộ trình dự án để luyện + ghi CV (Nhà trọ PRJ301 → CT Shop khoá PostgreSQL → LabFlow, OJT).',
  content: [
    bi(`<span class="eyebrow">⭐ Bridge · after DBI202 · not examined</span>
<h2>From DBI202 to a real job</h2>
<p class="lead">You studied DBI202 to pass the exam. This page answers the next question: <strong>what of it do you actually use at work, what changes when you move to PostgreSQL, and what should you build so it shows on your CV?</strong></p>
<h3>1. What you use at work — chapter by chapter</h3>
<table>
<thead><tr><th>DBI202</th><th>At a company you will…</th><th>How often</th></tr></thead>
<tbody>
<tr><td>Ch3 ERD · Ch4 normalization</td><td>Design the tables for every new feature; review a teammate's schema; spot duplicated data before it ships</td><td>Every feature</td></tr>
<tr><td>Ch5 CREATE TABLE, keys, constraints</td><td>Write migrations; put the rule in the database (NOT NULL, UNIQUE, FOREIGN KEY, CHECK) so a bug in the app cannot write bad data</td><td>Weekly</td></tr>
<tr><td>Ch6 SELECT, JOIN, GROUP BY, subqueries</td><td>Back an API endpoint, build a report, answer "how many users did X last month?", debug wrong numbers</td><td>Daily</td></tr>
<tr><td>Ch7 views, procedures, triggers</td><td>Read legacy code (very common in SQL Server shops); write a report view; audit changes with a trigger</td><td>Depends on the company</td></tr>
<tr><td>Ch8 indexes, execution plans</td><td>Fix "this page takes 8 seconds": read the plan, add the right index</td><td>Whenever something is slow</td></tr>
<tr><td>Ch8 transactions, ACID</td><td>Payments, stock, bookings: make "take money + create order" all-or-nothing</td><td>Every write that touches 2+ tables</td></tr>
</tbody>
</table>
<h3>2. What is mostly for the exam</h3>
<p>Relational algebra written with σ, π, ⋈; computing closures and candidate keys by hand; multiple-choice wording. You rarely write these at work — but they are <em>why</em> SQL and normalization behave the way they do, and interviewers like candidates who can explain "why 3NF".</p>
<h3>3. SQL Server → PostgreSQL: what changes</h3>
<p>The ideas are the same (tables, keys, JOIN, GROUP BY, indexes, transactions). The <strong>dialect</strong> and a few <strong>behaviours</strong> differ. The PostgreSQL course starts with ${a(P + 'postgresql-0-5-tu-sql-server-mysql', 'PostgreSQL 0.5 — coming from SQL Server / MySQL')}.</p>
<table>
<thead><tr><th>Topic</th><th>SQL Server (DBI202)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Auto-number key</td><td><code>id INT IDENTITY(1,1)</code></td><td><code>id INT GENERATED ALWAYS AS IDENTITY</code> (older code: <code>serial</code>)</td></tr>
<tr><td>Unicode text</td><td><code>NVARCHAR(100)</code> + <code>N'…'</code> literals</td><td><code>varchar(100)</code> / <code>text</code> — always Unicode, no <code>N</code> prefix</td></tr>
<tr><td>True / false</td><td><code>BIT</code> (0/1)</td><td><code>boolean</code> (true/false)</td></tr>
<tr><td>First N rows</td><td><code>SELECT TOP 10 …</code></td><td><code>… LIMIT 10</code> (both accept <code>OFFSET … FETCH</code>)</td></tr>
<tr><td>Join strings</td><td><code>a + b</code> or <code>CONCAT(a, b)</code></td><td><code>a || b</code> or <code>concat(a, b)</code></td></tr>
<tr><td>Now</td><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td><code>now()</code>, <code>current_timestamp</code></td></tr>
<tr><td>NULL fallback</td><td><code>ISNULL(x, 0)</code></td><td><code>COALESCE(x, 0)</code> (works in SQL Server too — prefer it)</td></tr>
<tr><td>Get the new row back</td><td><code>INSERT … OUTPUT inserted.id</code></td><td><code>INSERT … RETURNING id</code></td></tr>
<tr><td>Insert or update</td><td><code>MERGE</code></td><td><code>INSERT … ON CONFLICT … DO UPDATE</code> (<code>MERGE</code> since v15)</td></tr>
<tr><td>Procedures</td><td>T-SQL <code>CREATE PROCEDURE</code></td><td>PL/pgSQL functions/procedures — ${a(P + 'postgresql-12-1-ham', 'PG 12.1')}</td></tr>
<tr><td>Triggers</td><td>Statement-level, tables <code>inserted</code>/<code>deleted</code></td><td>Trigger function, usually per row with <code>NEW</code>/<code>OLD</code> — ${a(P + 'postgresql-12-2-trigger', 'PG 12.2')}</td></tr>
<tr><td>Upper/lower case</td><td>Default collation is case-insensitive: <code>'an' = 'AN'</code></td><td>Case-sensitive: use <code>ILIKE</code> or <code>lower()</code>; unquoted names become lowercase</td></tr>
<tr><td>Readers vs writers</td><td>Default READ COMMITTED uses locks — a long update can block readers (unless RCSI is on)</td><td>MVCC: readers never block writers — ${a(P + 'postgresql-11-2-mvcc', 'PG 11.2')}</td></tr>
<tr><td>Error inside a transaction</td><td>By default the next statements still run (unless <code>SET XACT_ABORT ON</code>)</td><td>The whole transaction is aborted until <code>ROLLBACK</code></td></tr>
<tr><td>Clustered index</td><td>Table can be stored in key order (clustered)</td><td>Tables are heaps; no permanent clustered index — ${a(P + 'postgresql-9-1-chi-muc-la-gi', 'PG 9.1')}</td></tr>
</tbody>
</table>
<h3>4. Build something — the order we recommend</h3>
<ol>
<li><strong>Nhà trọ (PRJ301), SQL Server</strong> — your team project. Add every constraint, two useful indexes, one report view, and a transaction for "sign contract + first payment". Linked lessons: ${a(C + 'dbi202-er-to-relation', '3.4 ERD → schema')}, ${a(C + 'dbi202-transaction-acid', '8.3 Transactions')}.</li>
<li><strong>CT Shop, PostgreSQL</strong> — the capstone of the PostgreSQL course: Node + Prisma migrations, connection pool, a real payment transaction, reports with indexes, backup. ${a(P + 'postgresql-16-4-capstone', 'PG 16.4 — capstone')}.</li>
<li><strong>LabFlow</strong> (graduation project) and OJT — the schema you design here is the one you defend.</li>
</ol>
<p><strong>On your CV</strong>, write what you did and measured, not course names: "Designed a 12-table schema (3NF) with FK/CHECK constraints", "Cut a report from 4.2 s to 80 ms with a composite index (EXPLAIN before/after)", "Payment flow in one transaction, tested with two concurrent sessions".</p>
<h3>5. Interview check</h3>
<p>Can you answer, in your own words: why a foreign key; 3NF in one sentence; INNER vs LEFT JOIN; WHERE vs HAVING; what an index costs; what ACID means for a payment? If yes, you are ready — practise with ${a(C + 'dbi202-slide-cs8-1', 'CS.8 — database interviews')}.</p>`,
    `<span class="eyebrow">⭐ Cầu nối · sau DBI202 · không thi</span>
<h2>Từ DBI202 đi làm</h2>
<p class="lead">Bạn học DBI202 để qua môn. Trang này trả lời câu hỏi tiếp theo: <strong>đi làm thật thì dùng phần nào, sang PostgreSQL thì đổi gì, và nên làm dự án gì để ghi được vào CV?</strong></p>
<h3>1. Đi làm dùng gì — theo từng chương</h3>
<table>
<thead><tr><th>DBI202</th><th>Ở công ty bạn sẽ…</th><th>Tần suất</th></tr></thead>
<tbody>
<tr><td>Ch3 ERD · Ch4 chuẩn hoá</td><td>Thiết kế bảng cho mỗi tính năng mới; duyệt lược đồ của đồng đội; bắt dữ liệu lặp trước khi lên production</td><td>Mỗi tính năng</td></tr>
<tr><td>Ch5 CREATE TABLE, khoá, ràng buộc</td><td>Viết migration; đặt luật ngay trong CSDL (NOT NULL, UNIQUE, FOREIGN KEY, CHECK) để app có lỗi cũng không ghi được dữ liệu sai</td><td>Hằng tuần</td></tr>
<tr><td>Ch6 SELECT, JOIN, GROUP BY, truy vấn con</td><td>Viết truy vấn cho API, làm báo cáo, trả lời "tháng trước bao nhiêu người làm X?", dò số liệu sai</td><td>Hằng ngày</td></tr>
<tr><td>Ch7 view, procedure, trigger</td><td>Đọc mã cũ (rất phổ biến ở công ty dùng SQL Server); viết view báo cáo; ghi vết thay đổi bằng trigger</td><td>Tuỳ công ty</td></tr>
<tr><td>Ch8 chỉ mục, kế hoạch thực thi</td><td>Sửa "trang này tải 8 giây": đọc kế hoạch, thêm đúng chỉ mục</td><td>Mỗi khi có gì chậm</td></tr>
<tr><td>Ch8 giao dịch, ACID</td><td>Thanh toán, tồn kho, đặt chỗ: "trừ tiền + tạo đơn" phải cùng thành công hoặc cùng huỷ</td><td>Mọi lần ghi chạm 2 bảng trở lên</td></tr>
</tbody>
</table>
<h3>2. Phần chủ yếu để thi</h3>
<p>Đại số quan hệ viết bằng σ, π, ⋈; tính bao đóng và tìm khoá bằng tay; cách hỏi trắc nghiệm. Đi làm hiếm khi viết những thứ này — nhưng chúng là <em>lý do</em> SQL và chuẩn hoá chạy như vậy, và người phỏng vấn thích ứng viên giải thích được "vì sao cần 3NF".</p>
<h3>3. SQL Server → PostgreSQL: đổi những gì</h3>
<p>Ý tưởng giữ nguyên (bảng, khoá, JOIN, GROUP BY, chỉ mục, giao dịch). Khác ở <strong>cú pháp</strong> và vài <strong>hành vi</strong>. Khoá PostgreSQL mở đầu bằng ${a(P + 'postgresql-0-5-tu-sql-server-mysql', 'PostgreSQL 0.5 — đến từ SQL Server / MySQL')}.</p>
<table>
<thead><tr><th>Chủ đề</th><th>SQL Server (DBI202)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Khoá tự tăng</td><td><code>id INT IDENTITY(1,1)</code></td><td><code>id INT GENERATED ALWAYS AS IDENTITY</code> (mã cũ: <code>serial</code>)</td></tr>
<tr><td>Chữ tiếng Việt</td><td><code>NVARCHAR(100)</code> + chuỗi <code>N'…'</code></td><td><code>varchar(100)</code> / <code>text</code> — luôn Unicode, không cần <code>N</code></td></tr>
<tr><td>Đúng / sai</td><td><code>BIT</code> (0/1)</td><td><code>boolean</code> (true/false)</td></tr>
<tr><td>Lấy N dòng đầu</td><td><code>SELECT TOP 10 …</code></td><td><code>… LIMIT 10</code> (cả hai đều nhận <code>OFFSET … FETCH</code>)</td></tr>
<tr><td>Nối chuỗi</td><td><code>a + b</code> hoặc <code>CONCAT(a, b)</code></td><td><code>a || b</code> hoặc <code>concat(a, b)</code></td></tr>
<tr><td>Thời điểm hiện tại</td><td><code>GETDATE()</code>, <code>SYSDATETIME()</code></td><td><code>now()</code>, <code>current_timestamp</code></td></tr>
<tr><td>Thay NULL</td><td><code>ISNULL(x, 0)</code></td><td><code>COALESCE(x, 0)</code> (SQL Server cũng có — nên dùng cái này)</td></tr>
<tr><td>Lấy lại dòng vừa thêm</td><td><code>INSERT … OUTPUT inserted.id</code></td><td><code>INSERT … RETURNING id</code></td></tr>
<tr><td>Thêm hoặc cập nhật</td><td><code>MERGE</code></td><td><code>INSERT … ON CONFLICT … DO UPDATE</code> (<code>MERGE</code> từ bản 15)</td></tr>
<tr><td>Procedure</td><td>T-SQL <code>CREATE PROCEDURE</code></td><td>Hàm/procedure PL/pgSQL — ${a(P + 'postgresql-12-1-ham', 'PG 12.1')}</td></tr>
<tr><td>Trigger</td><td>Theo câu lệnh, dùng bảng <code>inserted</code>/<code>deleted</code></td><td>Hàm trigger, thường theo từng dòng với <code>NEW</code>/<code>OLD</code> — ${a(P + 'postgresql-12-2-trigger', 'PG 12.2')}</td></tr>
<tr><td>Hoa / thường</td><td>Mặc định không phân biệt: <code>'an' = 'AN'</code></td><td>Phân biệt: dùng <code>ILIKE</code> hoặc <code>lower()</code>; tên không đặt trong ngoặc kép tự thành chữ thường</td></tr>
<tr><td>Người đọc và người ghi</td><td>READ COMMITTED mặc định dùng khoá — một lệnh cập nhật dài có thể chặn người đọc (trừ khi bật RCSI)</td><td>MVCC: đọc không bao giờ chặn ghi — ${a(P + 'postgresql-11-2-mvcc', 'PG 11.2')}</td></tr>
<tr><td>Lỗi giữa giao dịch</td><td>Mặc định các lệnh sau vẫn chạy (trừ khi <code>SET XACT_ABORT ON</code>)</td><td>Cả giao dịch bị huỷ cho tới khi <code>ROLLBACK</code></td></tr>
<tr><td>Chỉ mục gom cụm</td><td>Bảng có thể lưu theo thứ tự khoá (clustered)</td><td>Bảng là heap; không có chỉ mục gom cụm cố định — ${a(P + 'postgresql-9-1-chi-muc-la-gi', 'PG 9.1')}</td></tr>
</tbody>
</table>
<h3>4. Làm dự án — thứ tự nên đi</h3>
<ol>
<li><strong>Nhà trọ (PRJ301), SQL Server</strong> — dự án nhóm của bạn. Thêm đủ ràng buộc, hai chỉ mục có ích, một view báo cáo, và một giao dịch "ký hợp đồng + thu tiền đầu". Bài liên quan: ${a(C + 'dbi202-er-to-relation', '3.4 ERD → lược đồ')}, ${a(C + 'dbi202-transaction-acid', '8.3 Giao dịch')}.</li>
<li><strong>CT Shop, PostgreSQL</strong> — dự án cuối khoá PostgreSQL: Node + migration Prisma, pool kết nối, giao dịch thanh toán thật, báo cáo có chỉ mục, sao lưu. ${a(P + 'postgresql-16-4-capstone', 'PG 16.4 — capstone')}.</li>
<li><strong>LabFlow</strong> (đồ án tốt nghiệp) và kỳ OJT — lược đồ bạn thiết kế ở đây là thứ bạn phải bảo vệ.</li>
</ol>
<p><strong>Ghi vào CV</strong> việc bạn đã làm và đo được, không ghi tên môn: "Thiết kế lược đồ 12 bảng (3NF) có ràng buộc FK/CHECK", "Giảm báo cáo từ 4,2 s xuống 80 ms bằng chỉ mục tổ hợp (EXPLAIN trước/sau)", "Luồng thanh toán trong một giao dịch, đã thử với hai phiên chạy đồng thời".</p>
<h3>5. Tự kiểm trước phỏng vấn</h3>
<p>Bạn có tự nói được bằng lời của mình: vì sao cần khoá ngoại; 3NF trong một câu; INNER khác LEFT JOIN thế nào; WHERE khác HAVING; chỉ mục tốn gì; ACID nghĩa là gì với một lần thanh toán? Được hết là sẵn sàng — luyện tiếp với ${a(C + 'dbi202-slide-cs8-1', 'CS.8 — phỏng vấn database')}.</p>`),
  ].join('\n'),
};

export default { lessons: [L_cau_noi] };
