/**
 * DBI202 · Chương 8 — giao dịch, chỉ mục, view, kế hoạch thực thi (slide Chapter 7 của trường).
 * Bài 📑 học theo từng slide: dbi8 (Chapter 7.pptx, slide 1–41).
 * Bài 🧪 thực hành + 🗂 thuật ngữ + 📌 tóm tắt: dbi202-on-ch8.
 * Quiz viết lại (10 câu, giữ slug dbi202-quiz-4).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

import { walk, walkHead, books, bi } from './_slides.mjs';

/* ───────── 8.A — 📑 Slide by slide · Transactions & ACID (Chapter 7, slides 1–21) ───────── */
const L_dbi8_1 = {
  title: '8.A — 📑 Slide by slide · Transactions & ACID (Chapter 7, slides 1–21)|||8.A — 📑 Học theo từng slide · Giao dịch & ACID (Chapter 7, slide 1–21)',
  slug: 'dbi202-slide-dbi8-1',
  type: 'VIDEO',
  description: 'Giảng từng slide 1–21 của bộ slide Chapter 7 của trường (Practical issues of database application): vì sao cần giao dịch (transaction), tính nguyên tử (atomicity) qua ví dụ chuyển tiền chạy thật, bốn tính chất ACID, giao dịch chỉ-đọc, dirty read, bốn mức cô lập — mọi câu SQL chạy thật trên SQL Server (BEGIN TRANSACTION/COMMIT/ROLLBACK/SAVE TRAN/TRY…CATCH+XACT_STATE), kèm ô 🐘 PostgreSQL.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.A · school slides "Chapter 7", slides 1–21</span>
<h2>Practical issues of database application (part 1) — transactions &amp; ACID</h2>
<p class="lead">⚠️ <strong>This is the school's "Chapter 7" deck</strong> (Practical Issues of Database Application, 41 slides). On the website it is <strong>Chapter 8</strong>. So when your lecturer says "Chapter 7, slide 12", open this lesson.</p>
<div class="callout"><strong>Why this chapter exists.</strong> Chapters 5–6 taught you to design tables and write correct queries for <em>one</em> user at a time. In real life a database serves many users <em>at once</em>, updates can fail halfway, and slow queries lose customers. This chapter is the practical side of running a database: <strong>transactions</strong> (grouping statements so a half-finished change never survives), <strong>indexes</strong> (making big tables fast to search) and <strong>views</strong> (saved queries used like tables). Part 1 (this lesson) is transactions; part 2 (lesson 8.B) is indexes, views and query optimization.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>4–12</td><td>why transactions exist; atomicity; BEGIN TRANSACTION / COMMIT / ROLLBACK</td><td>write a transaction that undoes itself correctly on failure</td></tr>
<tr><td>13–15</td><td>the four ACID properties</td><td>name each letter and give a one-line reason it matters</td></tr>
<tr><td>16–17</td><td>read-only transactions</td><td>recognise the textbook's ANSI syntax vs. real T-SQL</td></tr>
<tr><td>18–20</td><td>dirty reads</td><td>explain why an uncommitted value can "leak" to another transaction</td></tr>
<tr><td>21</td><td>the four isolation levels</td><td>order them from loosest to strictest and say what each still allows</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.A · slide "Chapter 7" của trường, slide 1–21</span>
<h2>Vấn đề thực hành của ứng dụng CSDL (phần 1) — giao dịch &amp; ACID</h2>
<p class="lead">⚠️ <strong>Đây là bộ slide "Chapter 7" của trường</strong> (Practical Issues of Database Application, 41 slide). Trên web đây là <strong>Chương 8</strong>. Nên khi thầy cô nói "Chapter 7, slide 12" thì mở bài này.</p>
<div class="callout"><strong>Vì sao có chương này.</strong> Chương 5–6 dạy bạn thiết kế bảng và viết truy vấn đúng cho <em>một</em> người dùng tại một thời điểm. Trong thực tế một CSDL phục vụ nhiều người dùng <em>cùng lúc</em>, việc cập nhật có thể lỡ dở giữa chừng, và truy vấn chậm làm mất khách. Chương này là mặt thực hành của việc vận hành CSDL: <strong>giao dịch</strong> (transaction — gom nhiều câu lệnh để một thay đổi dở dang không bao giờ tồn tại), <strong>chỉ mục</strong> (index — làm bảng lớn tìm nhanh) và <strong>view</strong> (truy vấn được lưu, dùng như bảng). Phần 1 (bài này) là giao dịch; phần 2 (bài 8.B) là chỉ mục, view và tối ưu truy vấn.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>4–12</td><td>vì sao cần giao dịch; tính nguyên tử; BEGIN TRANSACTION / COMMIT / ROLLBACK</td><td>viết được giao dịch tự huỷ đúng khi thất bại</td></tr>
<tr><td>13–15</td><td>bốn tính chất ACID</td><td>gọi tên từng chữ cái và nói được một câu vì sao nó quan trọng</td></tr>
<tr><td>16–17</td><td>giao dịch chỉ đọc</td><td>nhận ra cú pháp ANSI của giáo trình khác T-SQL thật</td></tr>
<tr><td>18–20</td><td>dirty read (đọc bẩn)</td><td>giải thích vì sao một giá trị chưa commit có thể "rò rỉ" sang giao dịch khác</td></tr>
<tr><td>21</td><td>bốn mức cô lập</td><td>xếp được từ lỏng nhất tới chặt nhất và nói được mỗi mức còn cho phép gì</td></tr>
</tbody>
</table>`),
    walkHead('dbi8', 1, 21),
    walk('dbi8', [
      [1, 'Chapter 7: Practical issues of database application',
        `<p class="y-chinh">🎯 Title slide: school Chapter 7 — on this website, Chapter 8.</p>
<p>Chapters 5–6 were "how to ask the database a question correctly." This chapter is "how to run a database that many people hit at the same time, without losing or corrupting data, and without it being unbearably slow."</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: Chapter 7 của trường — trên web là Chương 8.</p>
<p>Chương 5–6 là "hỏi CSDL cho đúng." Chương này là "vận hành một CSDL mà nhiều người cùng dùng một lúc, không mất hay hỏng dữ liệu, và không chậm tới mức không chịu nổi."</p>`],
      [2, 'Objectives',
        `<p class="y-chinh">🎯 Six goals: understand and apply transactions/ACID, understand and implement indexes, understand and use views, and read an execution plan.</p>
<ul>
<li><strong>Transactions and ACID</strong> — slides 4–21 (this lesson).</li>
<li><strong>Indexes for query optimization</strong> — slides 22–25 (lesson 8.B).</li>
<li><strong>Views</strong> — slides 26–40 (lesson 8.B).</li>
<li><strong>Execution plans / query optimization</strong> — woven through 8.B, wrapped up on slide 41.</li>
</ul>
<p class="meo">🧠 This whole chapter is heavily tested in the PE (practical exam, 85 minutes) and the interview room: "write a transaction," "which index would you add," "is this view updatable" are classic questions.</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu: hiểu và áp dụng giao dịch/ACID, hiểu và cài đặt chỉ mục, hiểu và dùng view, và đọc được kế hoạch thực thi.</p>
<ul>
<li><strong>Giao dịch và ACID</strong> — slide 4–21 (bài này).</li>
<li><strong>Chỉ mục để tối ưu truy vấn</strong> — slide 22–25 (bài 8.B).</li>
<li><strong>View</strong> — slide 26–40 (bài 8.B).</li>
<li><strong>Kế hoạch thực thi / tối ưu truy vấn</strong> — xuyên suốt 8.B, tổng kết ở slide 41.</li>
</ul>
<p class="meo">🧠 Cả chương này ra rất nhiều trong đề PE (thi thực hành 85 phút) và phỏng vấn: "viết một giao dịch," "bạn sẽ thêm chỉ mục nào," "view này có cập nhật được không" là những câu hỏi kinh điển.</p>`],
      [3, 'Contents',
        `<p class="y-chinh">🎯 Three parts: transaction in SQL, indexes &amp; query optimization, views.</p>
<table>
<thead><tr><th>Part</th><th>Slides</th><th>Where on the website</th></tr></thead>
<tbody>
<tr><td>1. Transaction in SQL</td><td>4–21</td><td>this lesson (8.A)</td></tr>
<tr><td>2. Indexes in SQL &amp; Query optimization</td><td>22–25, 41</td><td>lesson 8.B</td></tr>
<tr><td>3. Views</td><td>26–40</td><td>lesson 8.B</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Ba phần: giao dịch trong SQL, chỉ mục &amp; tối ưu truy vấn, view.</p>
<table>
<thead><tr><th>Phần</th><th>Slide</th><th>Nằm ở đâu trên web</th></tr></thead>
<tbody>
<tr><td>1. Giao dịch trong SQL</td><td>4–21</td><td>bài này (8.A)</td></tr>
<tr><td>2. Chỉ mục &amp; tối ưu truy vấn</td><td>22–25, 41</td><td>bài 8.B</td></tr>
<tr><td>3. View</td><td>26–40</td><td>bài 8.B</td></tr>
</tbody>
</table>`],
      [4, 'DB User operates on database by querying or modifying the database',
        `<p class="y-chinh">🎯 A user's actions on the database run one operation at a time, each feeding the next — so how does the DBMS handle several users at once?</p>
<p>Think of a single user: they run one statement, see its result, then run the next. Nothing weird happens. The question this whole chapter answers is: what happens when <strong>many users do this at the same second</strong>, possibly touching the same rows?</p>`,
        `<p class="y-chinh">🎯 Hành động của một người dùng trên CSDL chạy từng phép một, kết quả phép này là đầu vào phép sau — vậy DBMS xử lý nhiều người dùng cùng lúc thế nào?</p>
<p>Hình dung một người dùng: họ chạy một câu, xem kết quả, rồi chạy câu tiếp theo. Không có gì lạ. Câu hỏi cả chương này trả lời là: chuyện gì xảy ra khi <strong>nhiều người dùng làm việc này cùng một giây</strong>, có thể cùng đụng vào những dòng dữ liệu giống nhau?</p>`],
      [5, 'In applications, many operations per second may be performed on database',
        `<p class="y-chinh">🎯 Real applications run many operations per second on the same data — and that gives unexpected results if nothing controls it.</p>
<p>A ticket-booking site, a bank, a shop's checkout: hundreds of users touch the same tables every second. Without a rule for "what happens when two of them collide," the database can produce answers that make no business sense.</p>`,
        `<p class="y-chinh">🎯 Ứng dụng thật chạy nhiều phép mỗi giây trên cùng dữ liệu — và nếu không có gì kiểm soát thì kết quả sẽ bất ngờ.</p>
<p>Một trang đặt vé, một ngân hàng, quầy thu ngân một cửa hàng: hàng trăm người dùng đụng vào cùng bảng dữ liệu mỗi giây. Không có luật cho "chuyện gì xảy ra khi hai người va nhau" thì CSDL có thể ra kết quả vô nghĩa về nghiệp vụ.</p>`],
      [6, 'Example: Two users book the same seat of the flight',
        `<p class="y-chinh">🎯 The textbook example of a race condition: two users both find seat 22A empty and both mark it occupied.</p>
<p>The slide draws a timeline with two columns, one per user:</p>
<table>
<thead><tr><th>time ↓</th><th>User 1</th><th>User 2</th></tr></thead>
<tbody>
<tr><td>1</td><td>finds seat 22A empty</td><td>—</td></tr>
<tr><td>2</td><td>—</td><td>finds seat 22A empty (User 1 has not booked it yet)</td></tr>
<tr><td>3</td><td>sets seat 22A occupied</td><td>—</td></tr>
<tr><td>4</td><td>—</td><td>sets seat 22A occupied</td></tr>
</tbody>
</table>
<p>Both users believed they got the seat. The airline just sold it twice — a real business disaster, and nothing here involved buggy code; each individual statement was correct.</p>
<p class="meo">🧠 This is called a <strong>race condition</strong>: the final result depends on the timing (the "race") between two users, not on any one of them doing something wrong.</p>`,
        `<p class="y-chinh">🎯 Ví dụ kinh điển của một cuộc đua dữ liệu (race condition): hai người dùng cùng thấy ghế 22A trống rồi cùng đặt nó "đã có người".</p>
<p>Slide vẽ một dòng thời gian với hai cột, mỗi cột một người dùng:</p>
<table>
<thead><tr><th>thời gian ↓</th><th>Người dùng 1</th><th>Người dùng 2</th></tr></thead>
<tbody>
<tr><td>1</td><td>thấy ghế 22A trống</td><td>—</td></tr>
<tr><td>2</td><td>—</td><td>thấy ghế 22A trống (Người dùng 1 chưa kịp đặt)</td></tr>
<tr><td>3</td><td>đặt ghế 22A thành đã có người</td><td>—</td></tr>
<tr><td>4</td><td>—</td><td>đặt ghế 22A thành đã có người</td></tr>
</tbody>
</table>
<p>Cả hai người dùng đều tin mình có ghế. Hãng bay vừa bán ghế đó hai lần — một thảm hoạ nghiệp vụ thật, mà không có dòng code nào ở đây sai cả; mỗi câu lệnh riêng lẻ đều đúng.</p>
<p class="meo">🧠 Đây gọi là <strong>cuộc đua dữ liệu</strong> (race condition): kết quả cuối phụ thuộc vào thời điểm ("cuộc đua") giữa hai người dùng, không phải vì ai đó làm sai.</p>`],
      [7, 'Transaction is a group of operations that need to be performed together',
        `<p class="y-chinh">🎯 A transaction is a group of operations that must run together; it must be serializable with other transactions — as if transactions ran one at a time, never overlapping.</p>
<p>A <strong>transaction</strong> bundles several database operations into one logical unit. <strong>Serializability</strong> is the guarantee that even though transactions really run concurrently (for speed), the final result must look <em>as if</em> they had run one after another, in some order, with no overlap — exactly what was missing on slide 6.</p>`,
        `<p class="y-chinh">🎯 Giao dịch (transaction) là một nhóm phép toán phải chạy cùng nhau; nó phải khả tuần tự hoá (serializable) với các giao dịch khác — như thể các giao dịch chạy tuần tự, không chồng lấp.</p>
<p><strong>Giao dịch</strong> gộp nhiều phép toán CSDL thành một đơn vị lô-gic. <strong>Tính khả tuần tự hoá</strong> (serializability) là lời hứa rằng dù các giao dịch thực sự chạy đồng thời (để nhanh), kết quả cuối phải trông <em>như thể</em> chúng chạy lần lượt theo một thứ tự nào đó, không chồng lấp — đúng cái đang thiếu ở slide 6.</p>`],
      [8, 'A certain combinations of database operations need to be done atomically, that is, either they are all done or neither is done',
        `<p class="y-chinh">🎯 Atomicity: a group of operations must be done entirely, or not at all — no partial result.</p>
<p>Everyday analogy: mailing a letter is atomic from your point of view — either it leaves your hand and enters the mailbox, or it doesn't; there is no "half-mailed" letter. A bank transfer needs the same guarantee: subtracting from one account and adding to another must happen together, or neither happens.</p>`,
        `<p class="y-chinh">🎯 Tính nguyên tử (atomicity): một nhóm phép toán phải được làm trọn vẹn, hoặc không làm gì cả — không có kết quả nửa vời.</p>
<p>Ví dụ đời thường: bỏ thư vào hòm thư là nguyên tử theo góc nhìn của bạn — hoặc lá thư rời tay bạn và vào hòm, hoặc không; không có chuyện "bỏ được nửa lá thư". Chuyển khoản ngân hàng cần đúng lời hứa đó: trừ tài khoản này và cộng tài khoản kia phải xảy ra cùng nhau, hoặc không xảy ra gì cả.</p>`],
      [9, 'Example: Transfer $500 from the account number 3209 to account number 3208 by two steps',
        `<p class="y-chinh">🎯 The classic example: transferring $500 needs two steps (subtract, then add) — what if the system crashes between them?</p>
<p>(1) Subtract $500 from account 3209. (2) Add $500 to account 3208. If the machine fails right after step (1) but before step (2), the bank has just destroyed $500 — it left one account and never arrived at the other. This is exactly why the two UPDATEs must be wrapped in one transaction.</p>
<p class="nhan">Real run</p>
<pre><code class="language-sql">-- Slide 9-12: atomicity — transfer 500 from account 3209 to account 3208, as ONE transaction
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,  -- account number
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)  -- balance, never negative
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
-- Before the transaction
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;  -- (1) subtract
  UPDATE dbo.TaiKhoan SET soDu = soDu + 500 WHERE soTK = 3208;  -- (2) add
COMMIT TRANSACTION;
GO
-- After COMMIT: both statements together, or neither
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>1000</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<p>Two accounts, 1000 and 500. <code>BEGIN TRANSACTION</code> … two <code>UPDATE</code>s … <code>COMMIT TRANSACTION</code> — after commit, both changes are visible together: 500 and 1000. The engine guarantees you never observe (or keep, after a crash) the state where only one UPDATE happened.</p>`,
        `<p class="y-chinh">🎯 Ví dụ kinh điển: chuyển 500$ cần hai bước (trừ, rồi cộng) — nếu hệ thống sập giữa hai bước thì sao?</p>
<p>(1) Trừ 500$ khỏi tài khoản 3209. (2) Cộng 500$ vào tài khoản 3208. Nếu máy hỏng ngay sau bước (1) nhưng trước bước (2), ngân hàng vừa làm biến mất 500$ — nó rời khỏi một tài khoản và không bao giờ tới tài khoản kia. Đây chính xác là lý do hai câu UPDATE phải được gói trong một giao dịch.</p>
<p class="nhan">Chạy thật</p>
<pre><code class="language-sql">-- Slide 9-12: atomicity — transfer 500 from account 3209 to account 3208, as ONE transaction
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,  -- số tài khoản
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)  -- số dư, không bao giờ âm
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
-- Trước giao dịch
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;  -- trừ
  UPDATE dbo.TaiKhoan SET soDu = soDu + 500 WHERE soTK = 3208;  -- cộng
COMMIT TRANSACTION;
GO
-- Sau COMMIT: cả hai câu cùng có hiệu lực, hoặc không câu nào
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>1000</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<p>Hai tài khoản, 1000 và 500. <code>BEGIN TRANSACTION</code> … hai câu <code>UPDATE</code> … <code>COMMIT TRANSACTION</code> — sau commit, cả hai thay đổi cùng hiện ra: 500 và 1000. Engine đảm bảo bạn không bao giờ thấy (hay giữ lại, sau một sự cố) trạng thái chỉ một UPDATE đã xảy ra.</p>`],
      [10, 'Atomicity',
        `<p class="y-chinh">🎯 The same transfer, drawn as a diagram: two updates, a journal insert, then COMMIT — all four steps are "Transaction Ends" together.</p>
<p>The diagram shows $500 moving from account 3209 to account 3208 through four labelled SQL steps: <strong>Decrement Savings Account</strong> (<code>UPDATE savings_accounts SET balance = balance - 500 WHERE account = 3209</code>), <strong>Increment Checking Account</strong> (<code>UPDATE checking_accounts SET balance = balance + 500 WHERE account = 3208</code>), <strong>Record in Transaction Journal</strong> (an audit-trail INSERT — self-study, not required by this course), and <strong>End Transaction</strong> (<code>COMMIT WORK</code>). All four are drawn inside one box labelled "Transaction Ends" — the whole group is the atomic unit, exactly what ran for real on slide 9.</p>`,
        `<p class="y-chinh">🎯 Cùng ví dụ chuyển tiền, vẽ thành sơ đồ: hai UPDATE, một INSERT nhật ký, rồi COMMIT — cả bốn bước cùng nằm trong "Transaction Ends".</p>
<p>Sơ đồ vẽ 500$ di chuyển từ tài khoản 3209 sang tài khoản 3208 qua bốn bước SQL có nhãn: <strong>Decrement Savings Account</strong> (trừ tài khoản tiết kiệm, <code>UPDATE savings_accounts SET balance = balance - 500 WHERE account = 3209</code>), <strong>Increment Checking Account</strong> (cộng tài khoản vãng lai, <code>UPDATE checking_accounts SET balance = balance + 500 WHERE account = 3208</code>), <strong>Record in Transaction Journal</strong> (ghi nhật ký kiểm toán — INSERT, tự học, môn này không yêu cầu), và <strong>End Transaction</strong> (<code>COMMIT WORK</code>). Cả bốn nằm trong một khung "Transaction Ends" — cả nhóm là đơn vị nguyên tử, đúng như đã chạy thật ở slide 9.</p>`],
      [11, 'Transaction is a collection of one or more operations on the database that must be executed atomically',
        `<p class="y-chinh">🎯 A transaction is one or more operations executed atomically; in SQL every statement is its own transaction by default, but SQL lets you group several into one.</p>
<p>This is an important default to know: if you run a single <code>UPDATE</code> with no <code>BEGIN TRANSACTION</code>, SQL Server already treats it as a one-statement transaction — it will not leave a half-updated row even without you asking. What you must add explicitly is grouping <strong>several</strong> statements (like the two UPDATEs on slide 9) into one transaction.</p>`,
        `<p class="y-chinh">🎯 Giao dịch là một hoặc nhiều phép toán được thực thi nguyên tử; trong SQL mỗi câu lệnh mặc định đã là một giao dịch riêng, nhưng SQL cho phép gộp nhiều câu thành một.</p>
<p>Đây là một mặc định quan trọng cần biết: nếu bạn chạy một câu <code>UPDATE</code> đơn lẻ mà không có <code>BEGIN TRANSACTION</code>, SQL Server đã coi nó là một giao dịch một câu — nó sẽ không để lại một dòng cập nhật nửa vời dù bạn không yêu cầu gì thêm. Thứ bạn phải thêm rõ ràng là gộp <strong>nhiều</strong> câu (như hai UPDATE ở slide 9) thành một giao dịch.</p>`],
      [12, 'Transaction begins by SQL command START TRANSACTION',
        `<p class="y-chinh">🎯 A transaction starts with START TRANSACTION and ends either with COMMIT (succeed) or ROLLBACK (abort, undo everything).</p>
<p>The textbook (Ullman &amp; Widom) writes the ANSI-SQL keyword <code>START TRANSACTION</code>. <strong>Real T-SQL does not accept that spelling</strong> — checked for real:</p>
<pre><code class="language-sql">-- Slide 12 says "Transaction begins by SQL command START TRANSACTION" — that is ANSI-SQL wording (the textbook).
-- Real T-SQL syntax is BEGIN TRANSACTION (or BEGIN TRAN); START TRANSACTION alone is a syntax error here.
START TRANSACTION;
GO
BEGIN TRANSACTION;
SELECT 1 AS cu_phap_dung;
COMMIT TRANSACTION;</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'TRANSACTION'.</b></div>
<table>
<thead><tr><th>cu_phap_dung</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p><code>START TRANSACTION;</code> is a syntax error (Msg 156); <code>BEGIN TRANSACTION;</code> (or the short form <code>BEGIN TRAN;</code>) is the real T-SQL keyword. Two ways to end it:</p>
<p class="nhan">COMMIT — keep the changes</p>
<pre><code class="language-sql">-- Slide 9-12: atomicity — transfer 500 from account 3209 to account 3208, as ONE transaction
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,  -- account number
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)  -- balance, never negative
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
-- Before the transaction
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;  -- (1) subtract
  UPDATE dbo.TaiKhoan SET soDu = soDu + 500 WHERE soTK = 3208;  -- (2) add
COMMIT TRANSACTION;
GO
-- After COMMIT: both statements together, or neither
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>1000</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<p class="nhan">ROLLBACK — undo everything back to before BEGIN TRANSACTION</p>
<pre><code class="language-sql">-- Slide 12: START TRANSACTION / COMMIT / ROLLBACK — what happens after a failed step 2
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;  -- step 1 ran
  -- Mid-transaction: this connection already sees the change
  SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
  -- Imagine a crash / a business rule failed before step 2
ROLLBACK TRANSACTION;
GO
-- After ROLLBACK: as if the transaction never started
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<p>Notice the middle <code>SELECT</code>, run <em>inside</em> the still-open transaction, already sees <code>soDu = 500</code> for account 3209 — the change is visible to this same connection even before COMMIT. After <code>ROLLBACK TRANSACTION</code>, the final <code>SELECT</code> shows the original 1000/500 — as if nothing had happened.</p>
<div class="callout"><strong>PE often asks for more than the slide shows.</strong> Two extra tools you will need: <code>SAVE TRANSACTION</code> (a named checkpoint inside a transaction — roll back only part of it) and <code>TRY…CATCH</code> with <code>XACT_STATE()</code> (the standard error-handling pattern for a transaction):
<pre><code class="language-sql">-- PE thường hỏi thêm ngoài slide: SAVE TRAN (điểm lưu), @@TRANCOUNT (đếm mức lồng), TRY...CATCH + XACT_STATE
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
-- Part A: SAVE TRAN — roll back only PART of the transaction
BEGIN TRANSACTION;
  PRINT N'@@TRANCOUNT sau BEGIN: ' + CAST(@@TRANCOUNT AS VARCHAR(10));
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;
  SAVE TRANSACTION diem_luu;  -- savepoint, named checkpoint inside the transaction
  UPDATE dbo.TaiKhoan SET soDu = soDu + 9999 WHERE soTK = 3208;  -- a wrong step we want to undo
  SELECT * FROM dbo.TaiKhoan ORDER BY soTK;  -- both changes visible so far
  ROLLBACK TRANSACTION diem_luu;  -- undo only the wrong step
  PRINT N'@@TRANCOUNT sau ROLLBACK tới điểm lưu: ' + CAST(@@TRANCOUNT AS VARCHAR(10));  -- still 1, the outer transaction is still open
COMMIT TRANSACTION;
GO
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;  -- step 1 kept, the +9999 undone
GO
-- Part B: TRY...CATCH + XACT_STATE() — the standard T-SQL error-handling pattern
BEGIN TRY
  BEGIN TRANSACTION;
    UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;
    UPDATE dbo.TaiKhoan SET soDu = soDu - 999999 WHERE soTK = 3208;  -- violates CHECK soDu &gt;= 0
  COMMIT TRANSACTION;
END TRY
BEGIN CATCH
  PRINT N'Lỗi bắt được: ' + ERROR_MESSAGE();
  PRINT N'XACT_STATE(): ' + CAST(XACT_STATE() AS VARCHAR(5));  -- 1 = still open (can COMMIT after fixing) · -1 = doomed, must ROLLBACK · 0 = no transaction
  IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION;
END CATCH
GO
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;  -- unchanged: the whole transaction was rolled back</code></pre>
<div class="out">(2 rows affected)<br>
@@TRANCOUNT sau BEGIN: 1<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>10499</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<div class="out">@@TRANCOUNT sau ROLLBACK tới điểm lưu: 1</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
Lỗi bắt được: The UPDATE statement conflicted with the CHECK constraint "ck_taikhoan_du". The conflict occurred in database "DBI202", table "dbo.TaiKhoan", column 'soDu'.<br>
XACT_STATE(): 1</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
Part A: <code>SAVE TRANSACTION diem_luu</code> marks a point; <code>ROLLBACK TRANSACTION diem_luu</code> undoes only the wrong <code>+9999</code> step, keeping the <code>-500</code> step and the outer transaction still open (<code>@@TRANCOUNT</code> stays 1). Part B: inside <code>CATCH</code>, <code>XACT_STATE()</code> measured <strong>1</strong> here (not -1) — a <code>CHECK</code> violation leaves the transaction still committable in principle, but the safe habit taught by Microsoft is always the same: if <code>XACT_STATE() &lt;&gt; 0</code>, <code>ROLLBACK</code>.</div>
<p class="meo">🧠 <code>@@TRANCOUNT</code> counts how many <code>BEGIN TRANSACTION</code> are currently open (nesting level) — a plain <code>ROLLBACK TRANSACTION</code> (no name) always undoes back to the outermost <code>BEGIN</code>, whatever the count.</p>`,
        `<p class="y-chinh">🎯 Giao dịch bắt đầu bằng START TRANSACTION và kết thúc bằng COMMIT (thành công) hoặc ROLLBACK (huỷ, lùi lại mọi thứ).</p>
<p>Giáo trình (Ullman &amp; Widom) viết từ khoá ANSI-SQL <code>START TRANSACTION</code>. <strong>T-SQL thật KHÔNG chấp nhận cách viết đó</strong> — đã kiểm thật:</p>
<pre><code class="language-sql">-- Slide 12 says "Transaction begins by SQL command START TRANSACTION" — that is ANSI-SQL wording (the textbook).
-- Real T-SQL syntax is BEGIN TRANSACTION (or BEGIN TRAN); START TRANSACTION alone is a syntax error here.
START TRANSACTION;
GO
BEGIN TRANSACTION;
SELECT 1 AS cu_phap_dung;
COMMIT TRANSACTION;</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'TRANSACTION'.</b></div>
<table>
<thead><tr><th>cu_phap_dung</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p><code>START TRANSACTION;</code> báo lỗi cú pháp (Msg 156); <code>BEGIN TRANSACTION;</code> (hoặc viết tắt <code>BEGIN TRAN;</code>) mới là từ khoá T-SQL thật. Hai cách kết thúc:</p>
<p class="nhan">COMMIT — giữ lại thay đổi</p>
<pre><code class="language-sql">-- Slide 9-12: atomicity — transfer 500 from account 3209 to account 3208, as ONE transaction
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,  -- số tài khoản
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)  -- số dư, không bao giờ âm
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
-- Trước giao dịch
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;  -- trừ
  UPDATE dbo.TaiKhoan SET soDu = soDu + 500 WHERE soTK = 3208;  -- cộng
COMMIT TRANSACTION;
GO
-- Sau COMMIT: cả hai câu cùng có hiệu lực, hoặc không câu nào
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>1000</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<p class="nhan">ROLLBACK — lùi mọi thứ về trước BEGIN TRANSACTION</p>
<pre><code class="language-sql">-- Slide 12: START TRANSACTION / COMMIT / ROLLBACK — what happens after a failed step 2
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;  -- bước 1 đã chạy
  -- Giữa giao dịch: kết nối này đã thấy thay đổi
  SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
  -- giả sử có sự cố / luật nghiệp vụ sai trước bước 2
ROLLBACK TRANSACTION;
GO
-- Sau ROLLBACK: như thể giao dịch chưa từng bắt đầu
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<p>Để ý câu <code>SELECT</code> giữa chừng, chạy <em>trong khi</em> giao dịch còn mở, đã thấy <code>soDu = 500</code> cho tài khoản 3209 — thay đổi hiện ra ngay với chính kết nối này dù chưa COMMIT. Sau <code>ROLLBACK TRANSACTION</code>, câu <code>SELECT</code> cuối cho ra 1000/500 ban đầu — như thể chưa có gì xảy ra.</p>
<div class="callout"><strong>PE thường hỏi nhiều hơn slide.</strong> Hai công cụ thêm bạn sẽ cần: <code>SAVE TRANSACTION</code> (điểm lưu đặt tên trong một giao dịch — chỉ lùi một phần) và <code>TRY…CATCH</code> cùng <code>XACT_STATE()</code> (khuôn xử lý lỗi chuẩn của giao dịch):
<pre><code class="language-sql">-- PE thường hỏi thêm ngoài slide: SAVE TRAN (điểm lưu), @@TRANCOUNT (đếm mức lồng), TRY...CATCH + XACT_STATE
CREATE TABLE dbo.TaiKhoan (
  soTK INT NOT NULL CONSTRAINT pk_taikhoan PRIMARY KEY,
  soDu DECIMAL(10,0) NOT NULL CONSTRAINT ck_taikhoan_du CHECK (soDu &gt;= 0)
);
INSERT INTO dbo.TaiKhoan(soTK, soDu) VALUES (3209, 1000), (3208, 500);
GO
-- Phần A: SAVE TRAN — chỉ lùi MỘT PHẦN giao dịch
BEGIN TRANSACTION;
  PRINT N'@@TRANCOUNT sau BEGIN: ' + CAST(@@TRANCOUNT AS VARCHAR(10));
  UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;
  SAVE TRANSACTION diem_luu;  -- điểm lưu, mốc đặt tên trong giao dịch
  UPDATE dbo.TaiKhoan SET soDu = soDu + 9999 WHERE soTK = 3208;  -- bước sai muốn huỷ
  SELECT * FROM dbo.TaiKhoan ORDER BY soTK;  -- cả hai thay đổi đang thấy
  ROLLBACK TRANSACTION diem_luu;  -- chỉ huỷ bước sai, giữ bước 1
  PRINT N'@@TRANCOUNT sau ROLLBACK tới điểm lưu: ' + CAST(@@TRANCOUNT AS VARCHAR(10));  -- vẫn 1, giao dịch ngoài còn mở
COMMIT TRANSACTION;
GO
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;  -- bước 1 còn, +9999 đã bị huỷ
GO
-- Phần B: TRY...CATCH + XACT_STATE() — khuôn xử lý lỗi chuẩn của T-SQL
BEGIN TRY
  BEGIN TRANSACTION;
    UPDATE dbo.TaiKhoan SET soDu = soDu - 500 WHERE soTK = 3209;
    UPDATE dbo.TaiKhoan SET soDu = soDu - 999999 WHERE soTK = 3208;  -- vi phạm CHECK soDu &gt;= 0
  COMMIT TRANSACTION;
END TRY
BEGIN CATCH
  PRINT N'Lỗi bắt được: ' + ERROR_MESSAGE();
  PRINT N'XACT_STATE(): ' + CAST(XACT_STATE() AS VARCHAR(5));  -- 1 = vẫn mở (sửa xong COMMIT được) · -1 = hỏng, buộc ROLLBACK · 0 = không có giao dịch
  IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION;
END CATCH
GO
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;  -- không đổi: cả giao dịch đã bị lùi</code></pre>
<div class="out">(2 rows affected)<br>
@@TRANCOUNT sau BEGIN: 1<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>10499</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<div class="out">@@TRANCOUNT sau ROLLBACK tới điểm lưu: 1</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
Lỗi bắt được: The UPDATE statement conflicted with the CHECK constraint "ck_taikhoan_du". The conflict occurred in database "DBI202", table "dbo.TaiKhoan", column 'soDu'.<br>
XACT_STATE(): 1</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
Phần A: <code>SAVE TRANSACTION diem_luu</code> đánh dấu một điểm; <code>ROLLBACK TRANSACTION diem_luu</code> chỉ huỷ bước <code>+9999</code> sai, giữ nguyên bước <code>-500</code> và giao dịch ngoài vẫn mở (<code>@@TRANCOUNT</code> vẫn là 1). Phần B: trong <code>CATCH</code>, <code>XACT_STATE()</code> đo được <strong>1</strong> ở đây (không phải -1) — vi phạm <code>CHECK</code> vẫn để giao dịch commit được về nguyên tắc, nhưng thói quen an toàn Microsoft dạy luôn giống nhau: nếu <code>XACT_STATE() &lt;&gt; 0</code> thì <code>ROLLBACK</code>.</div>
<p class="meo">🧠 <code>@@TRANCOUNT</code> đếm số <code>BEGIN TRANSACTION</code> đang mở (mức lồng) — một <code>ROLLBACK TRANSACTION</code> trơn (không tên) luôn lùi về tận <code>BEGIN</code> ngoài cùng, bất kể mức lồng.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> từ khoá là <code>BEGIN</code> (không phải <code>BEGIN TRANSACTION</code>), và khi <strong>không</strong> có <code>BEGIN</code> nào cả thì mỗi câu tự commit ngay (autocommit) — khác T-SQL, nơi cả một script ngoài giao dịch vẫn có thể lùi lại bằng cơ chế batch:
<pre><code class="language-sql">-- PostgreSQL: BEGIN (not BEGIN TRANSACTION) / COMMIT / ROLLBACK — and autocommit when there is no BEGIN at all
BEGIN;
CREATE TABLE taikhoan (
  sotk INT PRIMARY KEY,
  sodu NUMERIC(10,0) NOT NULL CHECK (sodu &gt;= 0)
);
INSERT INTO taikhoan(sotk, sodu) VALUES (3209, 1000), (3208, 500);
COMMIT;

BEGIN;
  UPDATE taikhoan SET sodu = sodu - 500 WHERE sotk = 3209;
  SELECT * FROM taikhoan ORDER BY sotk;  -- mid-transaction, this session already sees it
ROLLBACK;

-- After ROLLBACK: as if the transaction never started
SELECT * FROM taikhoan ORDER BY sotk;

-- Without BEGIN at all, PostgreSQL autocommits EVERY statement as its own transaction
UPDATE taikhoan SET sodu = sodu + 100 WHERE sotk = 3208;  -- already permanent, no COMMIT needed
SELECT * FROM taikhoan ORDER BY sotk;</code></pre>
<div class="out">INSERT 0 2<br>
UPDATE 1</div>
<table>
<thead><tr><th>sotk</th><th>sodu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>500</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>sotk</th><th>sodu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">UPDATE 1</div>
<table>
<thead><tr><th>sotk</th><th>sodu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>600</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-1-giao-dich">PostgreSQL 11.1 — giao dịch</a>.</div>`],
      [13, 'Atomicity Consistency Isolation Durability',
        `<p class="y-chinh">🎯 The four letters of ACID: Atomicity, Consistency, Isolation, Durability.</p>
<p>Memorise the four names now; the next two slides define each one, and slide 9's transfer example will anchor every one of them: Atomicity (all-or-nothing), Consistency (rules like "balances never go negative" always hold), Isolation (transactions don't see each other's half-finished work), Durability (once committed, survives a crash).</p>
<p class="meo">🧠 A common exam trap: ACID is about <strong>one</strong> transaction's guarantee; isolation LEVELS (slide 21) are about how much of <em>other</em> transactions' in-progress work you are willing to see — a different, related idea.</p>`,
        `<p class="y-chinh">🎯 Bốn chữ cái của ACID: Atomicity (nguyên tử), Consistency (nhất quán), Isolation (cô lập), Durability (bền vững).</p>
<p>Học thuộc bốn cái tên ngay bây giờ; hai slide sau định nghĩa từng cái, và ví dụ chuyển tiền ở slide 9 sẽ neo cả bốn: Nguyên tử (được ăn cả, ngã về không), Nhất quán (luật như "số dư không bao giờ âm" luôn đúng), Cô lập (giao dịch không thấy việc dở dang của nhau), Bền vững (đã commit thì sống sót qua sự cố).</p>
<p class="meo">🧠 Bẫy thi hay gặp: ACID nói về lời hứa của <strong>một</strong> giao dịch; các MỨC cô lập (slide 21) nói về việc bạn sẵn sàng thấy bao nhiêu phần việc dở dang của giao dịch <em>khác</em> — ý khác, có liên quan.</p>`],
      [14, 'Atomicity: a transaction is an atomic unit of processing',
        `<p class="y-chinh">🎯 Atomicity: the whole transaction runs or none of it does; writing a partial transaction to disk breaks Atomicity. Consistency: a transaction, run alone start to finish, moves the database from one valid state to another.</p>
<p><strong>Atomicity</strong>: at the end, either every statement of the transaction succeeded, or every statement failed — no in-between. If the system somehow persisted only part of a transaction to disk, Atomicity is violated (this is exactly what <code>COMMIT</code>/<code>ROLLBACK</code> exist to prevent).</p>
<p><strong>Consistency</strong>: a transaction takes the database from one state that obeys all the business rules (constraints, in our terms: <code>PRIMARY KEY</code>, <code>FOREIGN KEY</code>, <code>CHECK</code>…) to another state that also obeys them — <em>if</em> no other transaction interferes. This is the same "Consistency" from Chapter 5's integrity constraints, now seen from the transaction's point of view: our <code>ck_taikhoan_du CHECK (soDu &gt;= 0)</code> on slide 12's demo is a Consistency rule the transaction cannot break, even mid-way.</p>`,
        `<p class="y-chinh">🎯 Nguyên tử: cả giao dịch chạy hoặc không gì chạy cả; ghi một giao dịch dở dang xuống đĩa là phá vỡ Nguyên tử. Nhất quán: một giao dịch, chạy một mình từ đầu đến cuối, đưa CSDL từ một trạng thái hợp lệ sang trạng thái hợp lệ khác.</p>
<p><strong>Nguyên tử (Atomicity)</strong>: cuối cùng, hoặc mọi câu của giao dịch thành công, hoặc mọi câu thất bại — không có nửa chừng. Nếu hệ thống bằng cách nào đó ghi chỉ một phần giao dịch xuống đĩa, Nguyên tử bị vi phạm (đây chính xác là thứ <code>COMMIT</code>/<code>ROLLBACK</code> sinh ra để ngăn).</p>
<p><strong>Nhất quán (Consistency)</strong>: một giao dịch đưa CSDL từ một trạng thái tuân theo mọi luật nghiệp vụ (ràng buộc, theo ngôn ngữ của ta: <code>PRIMARY KEY</code>, <code>FOREIGN KEY</code>, <code>CHECK</code>…) sang một trạng thái cũng tuân theo — <em>nếu</em> không giao dịch nào khác xen vào. Đây chính là "Nhất quán" của ràng buộc toàn vẹn ở Chương 5, giờ nhìn từ góc độ giao dịch: <code>ck_taikhoan_du CHECK (soDu &gt;= 0)</code> trong demo slide 12 là một luật Nhất quán mà giao dịch không được phá, kể cả giữa chừng.</p>`],
      [15, 'Isolation: a transaction should appear as though it is being executed in isolation from other transactions',
        `<p class="y-chinh">🎯 Isolation: a transaction must look as if it ran alone, even while others run concurrently. Durability: once committed, changes survive any later failure.</p>
<p><strong>Isolation</strong>: even though the DBMS really interleaves many transactions for speed, each one must not be disturbed by the others' unfinished work — this is exactly what would have saved the airline seat on slide 6.</p>
<p><strong>Durability</strong>: once a transaction commits, its changes are permanent — a power loss, crash or restart the next second must not lose them. This is why real systems write to a durable log before answering "done" to the client.</p>`,
        `<p class="y-chinh">🎯 Cô lập: một giao dịch phải trông như thể chạy một mình, dù các giao dịch khác đang chạy cùng lúc. Bền vững: đã commit thì thay đổi sống sót qua mọi sự cố sau đó.</p>
<p><strong>Cô lập (Isolation)</strong>: dù DBMS thực sự xen kẽ nhiều giao dịch để nhanh hơn, mỗi giao dịch không được bị làm phiền bởi việc dở dang của giao dịch khác — đây chính xác là thứ lẽ ra đã cứu được cái ghế máy bay ở slide 6.</p>
<p><strong>Bền vững (Durability)</strong>: một khi giao dịch commit, thay đổi của nó là vĩnh viễn — mất điện, sập máy hay khởi động lại ngay giây sau đó không được làm mất nó. Đây là lý do hệ thống thật ghi vào nhật ký bền (log) trước khi báo "xong" cho client.</p>`],
      [16, 'A transaction can read or write some data into the database',
        `<p class="y-chinh">🎯 Read-only transactions can run in parallel with each other; they cannot run in parallel with a transaction that writes the same data.</p>
<p>If a transaction only reads (no <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>), many such read-only transactions can safely overlap on the same data — they cannot corrupt each other. The moment one of them writes, the DBMS must serialize it against the readers to keep Isolation.</p>`,
        `<p class="y-chinh">🎯 Giao dịch chỉ đọc chạy song song được với nhau; nhưng không chạy song song được với một giao dịch đang ghi cùng dữ liệu.</p>
<p>Nếu một giao dịch chỉ đọc (không <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code>), nhiều giao dịch chỉ-đọc như vậy chồng lấp trên cùng dữ liệu vẫn an toàn — chúng không thể làm hỏng lẫn nhau. Ngay khi một trong số đó ghi, DBMS phải sắp xếp nó tuần tự với những người đọc để giữ tính Cô lập.</p>`],
      [17, 'SQL statement set read-only to the next transaction',
        `<p class="y-chinh">🎯 The textbook syntax to mark the next transaction read-only or read/write: SET TRANSACTION READ ONLY / READ WRITE.</p>
<p>Like slide 12, this is ANSI-SQL wording. Checked for real on SQL Server:</p>
<pre><code class="language-sql">-- Slide 17: SET TRANSACTION READ ONLY / READ WRITE is ANSI-SQL textbook syntax (Ullman &amp; Widom) — real T-SQL error below
SET TRANSACTION READ ONLY;
GO
SET TRANSACTION READ WRITE;
GO
-- The real T-SQL way: there is no READ ONLY transaction flag; you either avoid writes yourself,
-- or point the connection string at a read-only replica (ApplicationIntent=ReadOnly). ISOLATION LEVEL is the real T-SQL lever:
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT 1 AS cau_lenh_hop_le;</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'READ'.</b><br>
<b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'READ'.</b></div>
<table>
<thead><tr><th>cau_lenh_hop_le</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p>Both lines are syntax errors (Msg 156) — <strong>SQL Server has no <code>SET TRANSACTION READ ONLY</code> statement at all</strong>. There is no direct T-SQL equivalent for "mark this one transaction read-only"; in practice you either simply avoid writes yourself, or point the connection at a read-only replica (<code>ApplicationIntent=ReadOnly</code> in the connection string). What IS real T-SQL is <code>SET TRANSACTION ISOLATION LEVEL …</code> (slide 21).</p>
<div class="pitfall">Exam trap: this slide's exact syntax will not run in SSMS. If a question asks "which statement marks a transaction read-only in SQL Server," the honest answer is "there isn't a dedicated one" — don't invent one.</div>`,
        `<p class="y-chinh">🎯 Cú pháp giáo trình để đánh dấu giao dịch tiếp theo là chỉ đọc hay đọc/ghi: SET TRANSACTION READ ONLY / READ WRITE.</p>
<p>Giống slide 12, đây là chữ ANSI-SQL. Đã kiểm thật trên SQL Server:</p>
<pre><code class="language-sql">-- Slide 17: SET TRANSACTION READ ONLY / READ WRITE is ANSI-SQL textbook syntax (Ullman &amp; Widom) — real T-SQL error below
SET TRANSACTION READ ONLY;
GO
SET TRANSACTION READ WRITE;
GO
-- The real T-SQL way: there is no READ ONLY transaction flag; you either avoid writes yourself,
-- or point the connection string at a read-only replica (ApplicationIntent=ReadOnly). ISOLATION LEVEL is the real T-SQL lever:
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT 1 AS cau_lenh_hop_le;</code></pre>
<div class="out"><b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'READ'.</b><br>
<b>Msg 156, Level 15, State 1<br>
Incorrect syntax near the keyword 'READ'.</b></div>
<table>
<thead><tr><th>cau_lenh_hop_le</th></tr></thead>
<tbody>
<tr><td>1</td></tr>
</tbody>
</table>
<p>Cả hai dòng đều báo lỗi cú pháp (Msg 156) — <strong>SQL Server hoàn toàn không có câu <code>SET TRANSACTION READ ONLY</code></strong>. Không có bản T-SQL tương đương trực tiếp cho "đánh dấu giao dịch này chỉ đọc"; thực tế bạn tự tránh ghi, hoặc trỏ kết nối vào một bản sao chỉ đọc (<code>ApplicationIntent=ReadOnly</code> trong connection string). Cái THẬT SỰ có trong T-SQL là <code>SET TRANSACTION ISOLATION LEVEL …</code> (slide 21).</p>
<div class="pitfall">Bẫy thi: cú pháp y hệt slide này sẽ không chạy trong SSMS. Nếu đề hỏi "câu nào đánh dấu giao dịch chỉ đọc trong SQL Server," câu trả lời thật thà là "không có câu riêng cho việc đó" — đừng bịa ra một câu.</div>`],
      [18, 'Dirty data: data written by a transaction that has not yet committed',
        `<p class="y-chinh">🎯 Dirty data is written-but-uncommitted data; a dirty read is another transaction reading it — risky because the writer might still abort and the data disappear.</p>
<p><strong>Dirty data</strong>: a value written by a transaction that hasn't committed yet — it might still be rolled back. A <strong>dirty read</strong> is a second transaction reading that not-yet-final value. The problem: if the first transaction later <code>ROLLBACK</code>s, the second transaction acted on data that, in the end, never really existed. Sometimes that's acceptable (a rough dashboard count), sometimes it's dangerous (money).</p>`,
        `<p class="y-chinh">🎯 Dữ liệu bẩn (dirty data) là dữ liệu đã ghi nhưng chưa commit; dirty read là giao dịch khác đọc nó — rủi ro vì người ghi có thể vẫn huỷ và dữ liệu biến mất.</p>
<p><strong>Dữ liệu bẩn</strong>: một giá trị được ghi bởi một giao dịch chưa commit — nó vẫn có thể bị ROLLBACK. <strong>Đọc bẩn (dirty read)</strong> là một giao dịch thứ hai đọc giá trị chưa-chốt đó. Vấn đề: nếu giao dịch đầu sau đó <code>ROLLBACK</code>, giao dịch thứ hai đã hành động dựa trên dữ liệu mà cuối cùng chưa từng thật sự tồn tại. Đôi khi việc đó chấp nhận được (đếm sơ trên dashboard), đôi khi nguy hiểm (tiền bạc).</p>`],
      [19, 'Transaction 1 Transaction 2 Logical value Uncommitted value What transaction 2 show',
        `<p class="y-chinh">🎯 A worked timeline: T1 updates A to 5 but hasn't committed; T2 reads the uncommitted 5, uses it, and only then T1 rolls back — T2 kept a value that never officially existed.</p>
<p>⚠️ This needs <strong>two separate sessions running at the same time</strong> — our SQL runner only has one connection, so it cannot be demonstrated live here. The slide's own table walks through it as a timeline, reproduced exactly:</p>
<table>
<thead><tr><th>Step</th><th>Transaction 1</th><th>Transaction 2</th><th>Logical value of A</th><th>Uncommitted value of A</th><th>What T2 sees</th></tr></thead>
<tbody>
<tr><td>1</td><td>START T1</td><td></td><td>3</td><td></td><td></td></tr>
<tr><td>2</td><td>UPDATE A=5</td><td>START T2</td><td>3</td><td>5</td><td></td></tr>
<tr><td>3</td><td>…</td><td>SELECT @v=A</td><td>3</td><td>5</td><td>5</td></tr>
<tr><td>4</td><td>ROLLBACK</td><td>UPDATE B=@v</td><td>3</td><td></td><td>5</td></tr>
</tbody>
</table>
<p>The "Logical value" column is what is officially true (committed); "Uncommitted value" is what T1 has written but not yet finalised. At step 3, T2 reads <code>A</code> and sees 5 — the <em>uncommitted</em> value. At step 4, T1 rolls back, so <code>A</code> was never really 5. But T2 already copied that 5 into <code>B</code> — a dirty read that leaked a value which, officially, never existed.</p>`,
        `<p class="y-chinh">🎯 Dòng thời gian làm mẫu: T1 cập nhật A thành 5 nhưng chưa commit; T2 đọc giá trị 5 chưa commit, dùng nó, rồi T1 mới ROLLBACK — T2 giữ lại một giá trị chưa từng chính thức tồn tại.</p>
<p>⚠️ Việc này cần <strong>hai phiên chạy cùng lúc</strong> — bộ chạy SQL ở đây chỉ có một kết nối, nên không demo trực tiếp được. Bảng của slide tự đi từng bước theo dòng thời gian, chép lại đúng nguyên văn:</p>
<table>
<thead><tr><th>Bước</th><th>Giao dịch 1</th><th>Giao dịch 2</th><th>Giá trị lô-gic của A</th><th>Giá trị chưa commit của A</th><th>T2 thấy gì</th></tr></thead>
<tbody>
<tr><td>1</td><td>START T1</td><td></td><td>3</td><td></td><td></td></tr>
<tr><td>2</td><td>UPDATE A=5</td><td>START T2</td><td>3</td><td>5</td><td></td></tr>
<tr><td>3</td><td>…</td><td>SELECT @v=A</td><td>3</td><td>5</td><td>5</td></tr>
<tr><td>4</td><td>ROLLBACK</td><td>UPDATE B=@v</td><td>3</td><td></td><td>5</td></tr>
</tbody>
</table>
<p>Cột "Giá trị lô-gic" là điều chính thức đúng (đã commit); "Giá trị chưa commit" là điều T1 đã ghi nhưng chưa chốt. Ở bước 3, T2 đọc <code>A</code> và thấy 5 — giá trị <em>chưa commit</em>. Ở bước 4, T1 rollback, nên <code>A</code> thật ra chưa từng là 5. Nhưng T2 đã sao giá trị 5 đó vào <code>B</code> rồi — một lần đọc bẩn làm rò rỉ một giá trị mà, chính thức, chưa từng tồn tại.</p>`],
      [20, 'We can specify that dirty reads are acceptable for a given transaction',
        `<p class="y-chinh">🎯 Textbook syntax to accept dirty reads for one transaction: SET TRANSACTION READ WRITE ISOLATION LEVEL READ UNCOMMITTED — and here is exactly what "accepting" a dirty read costs you, worked through on the transfer example, plus when that price is actually worth paying.</p>
<p>Again ANSI wording that combines two ideas in one statement (read/write mode plus isolation level). Real T-SQL keeps them separate and only supports the isolation-level part — see slide 21's real, running syntax.</p>
<p class="nhan">The dirty-read timeline, on the transfer money from slide 9</p>
<table>
<thead><tr><th>Step</th><th>Transaction 1 (the transfer)</th><th>Transaction 2 (READ UNCOMMITTED)</th><th>Account 3209's balance</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>BEGIN TRANSACTION</code></td><td></td><td>1000 (committed)</td></tr>
<tr><td>2</td><td><code>UPDATE … SET soDu = soDu - 500</code> (not committed yet)</td><td></td><td>logically still 1000, but 500 uncommitted</td></tr>
<tr><td>3</td><td></td><td><code>SELECT soDu</code> sees <strong>500</strong> — the uncommitted value</td><td>500 (dirty)</td></tr>
<tr><td>4</td><td></td><td>uses 500 in a report, a screen, another calculation…</td><td>500 (dirty)</td></tr>
<tr><td>5</td><td>Step (2) fails a rule → <code>ROLLBACK TRANSACTION</code></td><td></td><td>back to 1000 — officially, the balance was NEVER 500</td></tr>
<tr><td>6</td><td></td><td>already acted on 500, a number that officially never existed</td><td>1000 (true, final)</td></tr>
</tbody>
</table>
<p>That is the whole risk in one sentence: Transaction 2 read a number that, from the database's point of view, turned out to be a lie. Whether that matters depends entirely on what Transaction 2 DOES with the number.</p>
<p class="nhan">When it is acceptable — and when it absolutely is not</p>
<table>
<thead><tr><th>Situation</th><th>READ UNCOMMITTED / <code>WITH (NOLOCK)</code> OK?</th><th>Why</th></tr></thead>
<tbody>
<tr><td>A dashboard showing "approximately 1,204 orders today"</td><td>usually yes</td><td>being off by one row for a second is invisible to the business; you gain speed and avoid blocking writers</td></tr>
<tr><td>A nightly report counting rows for a slide deck</td><td>usually yes</td><td>same reasoning — an approximate, fast count beats an exact, slow, blocking one</td></tr>
<tr><td>Showing a customer THEIR OWN account balance</td><td>no</td><td>they may act on a number ($500) that a moment later never officially existed</td></tr>
<tr><td>Any calculation that FEEDS another write (like Transaction 2 above)</td><td>no</td><td>the dirty value can get baked into permanent, committed data — now the lie is real</td></tr>
</tbody>
</table>
<p><code>SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED</code> and the per-query hint <code>WITH (NOLOCK)</code> are the SAME idea — "let me read data even while it is mid-write, and I accept it might be wrong" — spelled two different ways: one for the whole session, one for a single statement:</p>
<pre><code class="language-sql">-- Slide 20: WITH (NOLOCK) and SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED are the SAME idea,
-- two different spellings — both compile and run cleanly (no error), proving both are real, accepted syntax
CREATE TABLE dbo.TaiKhoan (soTK INT PRIMARY KEY, soDu DECIMAL(10,0) NOT NULL);
INSERT INTO dbo.TaiKhoan VALUES (3209, 1000), (3208, 500);
GO
-- Table hint, per statement — the classic (and classically dangerous) shortcut
SELECT * FROM dbo.TaiKhoan WITH (NOLOCK) ORDER BY soTK;
GO
-- Session-level equivalent — every statement in the session behaves this way until changed back
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<p>Both ran without error — SQL Server does not stop you from asking for dirty reads; it trusts you to have judged the situation is safe.</p>
<div class="pitfall">The single most common misuse of <code>WITH (NOLOCK)</code>: someone copy-pastes it onto every query in a codebase "to make things faster," without ever asking whether THAT particular query feeds a decision, a payment, or another write. Speed is real, but so is the risk — reserve it for genuinely approximate, read-only, human-facing numbers.</div>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the keyword <code>READ UNCOMMITTED</code> is accepted for compatibility, but it changes NOTHING — under MVCC (multiversion concurrency control), every reader already gets its own consistent snapshot, so a true dirty read is structurally impossible no matter what you ask for:
<pre><code class="language-sql">-- PostgreSQL accepts the READ UNCOMMITTED keyword — but under MVCC it silently behaves like READ COMMITTED
BEGIN ISOLATION LEVEL READ UNCOMMITTED;
  SHOW transaction_isolation;
COMMIT;</code></pre>
<table>
<thead><tr><th>transaction_isolation</th></tr></thead>
<tbody>
<tr><td>read uncommitted</td></tr>
</tbody>
</table>
<code>SHOW transaction_isolation</code> reports back the label "read uncommitted" you asked for, but the actual behaviour underneath is READ COMMITTED — there is no PostgreSQL hint equivalent to <code>WITH (NOLOCK)</code> because there is nothing dirty to protect against. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-2-mvcc">PostgreSQL 11.2 — MVCC</a>.</div>`,
        `<p class="y-chinh">🎯 Cú pháp giáo trình để chấp nhận đọc bẩn cho một giao dịch: SET TRANSACTION READ WRITE ISOLATION LEVEL READ UNCOMMITTED — và đây chính xác là cái giá của việc "chấp nhận" đọc bẩn, đi từng bước trên ví dụ chuyển tiền, cộng thêm khi nào cái giá đó thật sự đáng trả.</p>
<p>Lại là cách viết ANSI gộp hai ý trong một câu (chế độ đọc/ghi cộng mức cô lập). T-SQL thật tách riêng và chỉ hỗ trợ phần mức cô lập — xem cú pháp thật, chạy được ở slide 21.</p>
<p class="nhan">Dòng thời gian đọc bẩn, trên ví dụ chuyển tiền ở slide 9</p>
<table>
<thead><tr><th>Bước</th><th>Giao dịch 1 (chuyển tiền)</th><th>Giao dịch 2 (READ UNCOMMITTED)</th><th>Số dư tài khoản 3209</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>BEGIN TRANSACTION</code></td><td></td><td>1000 (đã commit)</td></tr>
<tr><td>2</td><td><code>UPDATE … SET soDu = soDu - 500</code> (chưa commit)</td><td></td><td>về lô-gic vẫn 1000, nhưng 500 chưa commit</td></tr>
<tr><td>3</td><td></td><td><code>SELECT soDu</code> thấy <strong>500</strong> — giá trị chưa commit</td><td>500 (bẩn)</td></tr>
<tr><td>4</td><td></td><td>dùng 500 trong một báo cáo, một màn hình, một phép tính khác…</td><td>500 (bẩn)</td></tr>
<tr><td>5</td><td>Bước (2) vi phạm một luật → <code>ROLLBACK TRANSACTION</code></td><td></td><td>quay về 1000 — chính thức, số dư CHƯA TỪNG là 500</td></tr>
<tr><td>6</td><td></td><td>đã hành động dựa trên 500, một con số mà chính thức chưa từng tồn tại</td><td>1000 (thật, cuối cùng)</td></tr>
</tbody>
</table>
<p>Đó là toàn bộ rủi ro trong một câu: Giao dịch 2 đọc một con số mà, theo góc nhìn của CSDL, hoá ra là một lời nói dối. Việc đó có quan trọng hay không phụ thuộc hoàn toàn vào việc Giao dịch 2 LÀM GÌ với con số đó.</p>
<p class="nhan">Khi nào chấp nhận được — và khi nào tuyệt đối không</p>
<table>
<thead><tr><th>Tình huống</th><th>READ UNCOMMITTED / <code>WITH (NOLOCK)</code> được không?</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Dashboard hiện "khoảng 1.204 đơn hôm nay"</td><td>thường được</td><td>lệch một dòng trong một giây là vô hình với nghiệp vụ; đổi lại được tốc độ và không chặn người đang ghi</td></tr>
<tr><td>Báo cáo đêm đếm số dòng cho một slide thuyết trình</td><td>thường được</td><td>cùng lý do — đếm nhanh, gần đúng còn hơn đếm chính xác, chậm, gây chặn</td></tr>
<tr><td>Cho khách hàng xem CHÍNH số dư tài khoản của họ</td><td>không</td><td>họ có thể hành động dựa trên một con số (500$) mà một khắc sau chính thức chưa từng tồn tại</td></tr>
<tr><td>Bất kỳ phép tính nào NUÔI một lần ghi khác (như Giao dịch 2 ở trên)</td><td>không</td><td>giá trị bẩn có thể bị "nướng" vào dữ liệu vĩnh viễn, đã commit — giờ lời nói dối trở thành thật</td></tr>
</tbody>
</table>
<p><code>SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED</code> và gợi ý (hint) theo từng câu <code>WITH (NOLOCK)</code> là CÙNG MỘT ý — "cho tôi đọc dữ liệu ngay cả khi nó đang ghi dở, và tôi chấp nhận nó có thể sai" — viết theo hai cách khác nhau: một cho cả phiên, một cho một câu lệnh:</p>
<pre><code class="language-sql">-- Slide 20: WITH (NOLOCK) and SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED are the SAME idea,
-- two different spellings — both compile and run cleanly (no error), proving both are real, accepted syntax
CREATE TABLE dbo.TaiKhoan (soTK INT PRIMARY KEY, soDu DECIMAL(10,0) NOT NULL);
INSERT INTO dbo.TaiKhoan VALUES (3209, 1000), (3208, 500);
GO
-- Table hint, per statement — the classic (and classically dangerous) shortcut
SELECT * FROM dbo.TaiKhoan WITH (NOLOCK) ORDER BY soTK;
GO
-- Session-level equivalent — every statement in the session behaves this way until changed back
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM dbo.TaiKhoan ORDER BY soTK;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;</code></pre>
<div class="out">(2 rows affected)</div>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>soTK</th><th>soDu</th></tr></thead>
<tbody>
<tr><td>3208</td><td>500</td></tr>
<tr><td>3209</td><td>1000</td></tr>
</tbody>
</table>
<p>Cả hai đều chạy không lỗi — SQL Server không ngăn bạn xin đọc bẩn; nó tin bạn đã đánh giá tình huống là an toàn.</p>
<div class="pitfall">Cách lạm dụng <code>WITH (NOLOCK)</code> phổ biến nhất: ai đó copy-paste nó vào mọi truy vấn trong một codebase "cho nhanh hơn", mà chưa bao giờ hỏi liệu ĐÚNG truy vấn đó có nuôi một quyết định, một thanh toán, hay một lần ghi khác không. Tốc độ là có thật, nhưng rủi ro cũng có thật — chỉ dùng cho những con số thật sự gần đúng, chỉ đọc, hiển thị cho người xem.</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> từ khoá <code>READ UNCOMMITTED</code> được chấp nhận cho tương thích, nhưng nó KHÔNG đổi gì cả — dưới MVCC (kiểm soát đồng thời đa phiên bản), mỗi người đọc đã tự có một ảnh chụp nhất quán riêng, nên một lần đọc bẩn thật sự là điều không thể xảy ra về mặt cấu trúc, dù bạn xin gì đi nữa:
<pre><code class="language-sql">-- PostgreSQL accepts the READ UNCOMMITTED keyword — but under MVCC it silently behaves like READ COMMITTED
BEGIN ISOLATION LEVEL READ UNCOMMITTED;
  SHOW transaction_isolation;
COMMIT;</code></pre>
<table>
<thead><tr><th>transaction_isolation</th></tr></thead>
<tbody>
<tr><td>read uncommitted</td></tr>
</tbody>
</table>
<code>SHOW transaction_isolation</code> báo lại đúng nhãn "read uncommitted" bạn vừa xin, nhưng hành vi thật bên dưới vẫn là READ COMMITTED — không có hint nào của PostgreSQL tương đương <code>WITH (NOLOCK)</code> vì không có gì bẩn để phòng cả. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-2-mvcc">PostgreSQL 11.2 — MVCC</a>.</div>`],
      [21, 'Other Isolation Levels',
        `<p class="y-chinh">🎯 The four standard isolation levels, from loosest to strictest: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.</p>
<table>
<thead><tr><th>Level</th><th>Allows dirty reads?</th><th>Allows non-repeatable reads?</th><th>Allows phantom rows?</th></tr></thead>
<tbody>
<tr><td>READ UNCOMMITTED</td><td>yes</td><td>yes</td><td>yes</td></tr>
<tr><td>READ COMMITTED (T-SQL default)</td><td>no</td><td>yes</td><td>yes</td></tr>
<tr><td>REPEATABLE READ</td><td>no</td><td>no</td><td>yes</td></tr>
<tr><td>SERIALIZABLE (strictest)</td><td>no</td><td>no</td><td>no</td></tr>
</tbody>
</table>
<p>Each level going down the table removes one more kind of anomaly — and costs more locking/blocking. Real T-SQL syntax, all four run:</p>
<pre><code class="language-sql">-- Slide 20-21: the four isolation levels — set each, then read it back with DBCC USEROPTIONS
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
DBCC USEROPTIONS;
GO
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
DBCC USEROPTIONS;
GO
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
DBCC USEROPTIONS;
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
DBCC USEROPTIONS;</code></pre>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>read uncommitted</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>read committed</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>repeatable read</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>serializable</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<p><code>DBCC USEROPTIONS</code> reads back the session's current isolation level after each <code>SET</code>, confirming it really took effect — this is a genuinely useful debugging command, not just a teaching trick.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the keyword and level names are the same, but the <em>meaning</em> differs: PostgreSQL uses MVCC (multiversion concurrency control — every reader sees a private, consistent snapshot instead of being blocked), so it has <strong>no real READ UNCOMMITTED</strong> — asking for it silently behaves like READ COMMITTED, because dirty reads are structurally impossible under MVCC. The default is also READ COMMITTED:
<pre><code class="language-sql">-- PostgreSQL: the same four names exist, but the default and the mechanism differ from SQL Server
SHOW default_transaction_isolation;  -- default on this server: read committed

BEGIN ISOLATION LEVEL READ UNCOMMITTED;
  SHOW transaction_isolation;  -- PostgreSQL has no real READ UNCOMMITTED: it silently behaves as READ COMMITTED
COMMIT;

BEGIN ISOLATION LEVEL SERIALIZABLE;
  SHOW transaction_isolation;
COMMIT;</code></pre>
<table>
<thead><tr><th>default_transaction_isolation</th></tr></thead>
<tbody>
<tr><td>read committed</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>transaction_isolation</th></tr></thead>
<tbody>
<tr><td>read uncommitted</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>transaction_isolation</th></tr></thead>
<tbody>
<tr><td>serializable</td></tr>
</tbody>
</table>
Note <code>transaction_isolation</code> still reports back "read uncommitted" as a label, even though nothing behaves differently — a nuance the slide's table doesn't cover. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-3-muc-co-lap">PostgreSQL 11.3 — isolation levels</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-2-mvcc">PostgreSQL 11.2 — MVCC</a>.</div>
<p class="dap-an">✅ Ordering exercise: loosest → strictest is READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE — each step down the table in the previous paragraph closes one more anomaly.</p>`,
        `<p class="y-chinh">🎯 Bốn mức cô lập chuẩn, từ lỏng nhất tới chặt nhất: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.</p>
<table>
<thead><tr><th>Mức</th><th>Cho đọc bẩn?</th><th>Cho đọc không lặp lại?</th><th>Cho dòng ma (phantom)?</th></tr></thead>
<tbody>
<tr><td>READ UNCOMMITTED</td><td>có</td><td>có</td><td>có</td></tr>
<tr><td>READ COMMITTED (mặc định T-SQL)</td><td>không</td><td>có</td><td>có</td></tr>
<tr><td>REPEATABLE READ</td><td>không</td><td>không</td><td>có</td></tr>
<tr><td>SERIALIZABLE (chặt nhất)</td><td>không</td><td>không</td><td>không</td></tr>
</tbody>
</table>
<p>Mỗi mức đi xuống trong bảng loại bỏ thêm một kiểu bất thường — và tốn thêm chi phí khoá/chặn. Cú pháp T-SQL thật, cả bốn chạy được:</p>
<pre><code class="language-sql">-- Slide 20-21: the four isolation levels — set each, then read it back with DBCC USEROPTIONS
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
DBCC USEROPTIONS;
GO
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
DBCC USEROPTIONS;
GO
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
DBCC USEROPTIONS;
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
DBCC USEROPTIONS;</code></pre>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>read uncommitted</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>read committed</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>repeatable read</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<table>
<thead><tr><th>Set Option</th><th>Value</th></tr></thead>
<tbody>
<tr><td>textsize</td><td>2147483647</td></tr>
<tr><td>language</td><td>us_english</td></tr>
<tr><td>dateformat</td><td>mdy</td></tr>
<tr><td>datefirst</td><td>7</td></tr>
<tr><td>lock_timeout</td><td>-1</td></tr>
<tr><td>quoted_identifier</td><td>SET</td></tr>
<tr><td>arithabort</td><td>SET</td></tr>
<tr><td>ansi_null_dflt_on</td><td>SET</td></tr>
<tr><td>ansi_warnings</td><td>SET</td></tr>
<tr><td>ansi_padding</td><td>SET</td></tr>
<tr><td>ansi_nulls</td><td>SET</td></tr>
<tr><td>concat_null_yields_null</td><td>SET</td></tr>
<tr><td>isolation level</td><td>serializable</td></tr>
</tbody>
</table>
<div class="out">DBCC execution completed. If DBCC printed error messages, contact your system administrator.</div>
<p><code>DBCC USEROPTIONS</code> đọc lại mức cô lập hiện tại của phiên sau mỗi <code>SET</code>, xác nhận nó thật sự có hiệu lực — đây là lệnh gỡ lỗi thật sự hữu ích, không chỉ là mẹo dạy học.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> tên từ khoá và tên mức giống hệt, nhưng <em>ý nghĩa</em> khác: PostgreSQL dùng MVCC (kiểm soát đồng thời đa phiên bản — multiversion concurrency control; mỗi người đọc thấy một ảnh chụp riêng, nhất quán thay vì bị chặn), nên <strong>không có READ UNCOMMITTED thật</strong> — yêu cầu nó thì lặng lẽ hành xử như READ COMMITTED, vì đọc bẩn về cấu trúc là không thể xảy ra dưới MVCC. Mặc định cũng là READ COMMITTED:
<pre><code class="language-sql">-- PostgreSQL: the same four names exist, but the default and the mechanism differ from SQL Server
SHOW default_transaction_isolation;  -- default on this server: read committed

BEGIN ISOLATION LEVEL READ UNCOMMITTED;
  SHOW transaction_isolation;  -- PostgreSQL has no real READ UNCOMMITTED: it silently behaves as READ COMMITTED
COMMIT;

BEGIN ISOLATION LEVEL SERIALIZABLE;
  SHOW transaction_isolation;
COMMIT;</code></pre>
<table>
<thead><tr><th>default_transaction_isolation</th></tr></thead>
<tbody>
<tr><td>read committed</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>transaction_isolation</th></tr></thead>
<tbody>
<tr><td>read uncommitted</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>transaction_isolation</th></tr></thead>
<tbody>
<tr><td>serializable</td></tr>
</tbody>
</table>
Chú ý <code>transaction_isolation</code> vẫn báo lại nhãn "read uncommitted", dù hành vi không hề khác gì — một chi tiết bảng của slide không nhắc tới. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-3-muc-co-lap">PostgreSQL 11.3 — mức cô lập</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-11-2-mvcc">PostgreSQL 11.2 — MVCC</a>.</div>
<p class="dap-an">✅ Bài tập sắp xếp: lỏng nhất → chặt nhất là READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE — mỗi bước đi xuống trong bảng ở đoạn trước đóng thêm một loại bất thường.</p>`],
    ]),
    books([
      ['fuSlides', 'FUH slides — Chapter 7: Practical Issues of Database Application, slides 1–21', 'Slide FUH — Chapter 7: Practical Issues of Database Application, slide 1–21'],
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems (3e) — Ch. 8, Transactions', 'Ullman &amp; Widom, A First Course in Database Systems (3e) — Ch. 8, Giao dịch'],
    ]),
  ].join('\n'),
};

/* ───────── 8.B — 📑 Slide by slide · Indexes, views & query optimization (Chapter 7, slides 22–41) ───────── */
const L_dbi8_2 = {
  title: '8.B — 📑 Slide by slide · Indexes, views & query optimization (Chapter 7, slides 22–41)|||8.B — 📑 Học theo từng slide · Chỉ mục, view & tối ưu truy vấn (Chapter 7, slide 22–41)',
  slug: 'dbi202-slide-dbi8-2',
  type: 'VIDEO',
  description: 'Giảng từng slide 22–41 của bộ slide Chapter 7 của trường: chỉ mục (clustered/nonclustered, INCLUDE, thiết kế, khi nào KHÔNG được dùng), CREATE VIEW/xoá/đổi tên cột/view cập nhật được hay không, và 10 thói quen tối ưu truy vấn — mọi câu SQL chạy thật (index dựng 30.000 dòng để thấy Seek/Scan qua SET STATISTICS PROFILE, view chạy trên CSDL FUHCompany), kèm ô 🐘 PostgreSQL (EXPLAIN ANALYZE, không có clustered index, WITH CHECK OPTION).',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.B · school slides "Chapter 7", slides 22–41</span>
<h2>Practical issues of database application (part 2) — indexes, views &amp; query optimization</h2>
<p class="lead">⚠️ Still the school's <strong>"Chapter 7"</strong> deck, slides 22–41 — website Chapter 8. Part 1 (lesson 8.A) was transactions; this part is <strong>making queries fast</strong> (indexes) and <strong>hiding complexity behind saved queries</strong> (views).</p>
<div class="callout"><strong>Starting from zero.</strong> An <strong>index</strong> (chỉ mục) is exactly like the index at the back of a textbook: instead of reading every page to find "transaction," you jump straight to the listed page numbers. A database index does the same for a column: instead of reading every row (a <strong>scan</strong>), the engine jumps straight to matching rows (a <strong>seek</strong>). A <strong>view</strong> (khung nhìn) is a saved <code>SELECT</code> you can query like a table — it stores no data of its own, just the query.</div>
<h3>This part in one table</h3>
<table>
<thead><tr><th>Slides</th><th>Idea</th><th>You must be able to</th></tr></thead>
<tbody>
<tr><td>22–25</td><td>what an index is; clustered vs. nonclustered; CREATE INDEX; design guidelines</td><td>predict Seek vs. Scan for a given query and index</td></tr>
<tr><td>26–35</td><td>relations vs. views; CREATE VIEW; querying, renaming columns, dropping</td><td>write a view and query it, know DROP VIEW never touches the base table</td></tr>
<tr><td>36–40</td><td>which views are updatable; INSERT/UPDATE through a view</td><td>predict whether an INSERT through a view will succeed, and what it will actually do</td></tr>
<tr><td>41</td><td>query optimization habits</td><td>name at least 5 of the 10 habits and why each helps</td></tr>
</tbody>
</table>
<p>Every SQL example below really ran; the 30,000-row tables for the index demos are built with a fast set-based <code>INSERT … SELECT</code> (never a slow row-by-row <code>WHILE</code> loop), and every view example runs on the course's FUHCompany database (its diagram is in lesson 5.B, slide 21).</p>`,
    `<span class="eyebrow">Chương 8 · Bài 8.B · slide "Chapter 7" của trường, slide 22–41</span>
<h2>Vấn đề thực hành của ứng dụng CSDL (phần 2) — chỉ mục, view &amp; tối ưu truy vấn</h2>
<p class="lead">⚠️ Vẫn là bộ slide <strong>"Chapter 7"</strong> của trường, slide 22–41 — Chương 8 trên web. Phần 1 (bài 8.A) là giao dịch; phần này là <strong>làm truy vấn nhanh hơn</strong> (chỉ mục) và <strong>giấu độ phức tạp sau một truy vấn đã lưu</strong> (view).</p>
<div class="callout"><strong>Bắt đầu từ số 0.</strong> <strong>Chỉ mục</strong> (index) giống hệt mục lục cuối một cuốn sách giáo khoa: thay vì đọc từng trang để tìm "giao dịch", bạn nhảy thẳng tới số trang được liệt kê. Chỉ mục CSDL làm đúng việc đó cho một cột: thay vì đọc từng dòng (gọi là <strong>scan</strong> — quét), engine nhảy thẳng tới các dòng khớp (gọi là <strong>seek</strong> — tìm trực tiếp). <strong>View</strong> (khung nhìn) là một câu <code>SELECT</code> được lưu lại, truy vấn được như một bảng — nó không lưu dữ liệu riêng, chỉ lưu câu truy vấn.</div>
<h3>Cả phần này trong một bảng</h3>
<table>
<thead><tr><th>Slide</th><th>Ý chính</th><th>Bạn phải làm được</th></tr></thead>
<tbody>
<tr><td>22–25</td><td>chỉ mục là gì; clustered vs. nonclustered; CREATE INDEX; nguyên tắc thiết kế</td><td>đoán được Seek hay Scan cho một truy vấn và chỉ mục cho trước</td></tr>
<tr><td>26–35</td><td>quan hệ vs. view; CREATE VIEW; truy vấn, đổi tên cột, xoá</td><td>viết được view và truy vấn nó, biết DROP VIEW không đụng tới bảng gốc</td></tr>
<tr><td>36–40</td><td>view nào cập nhật được; INSERT/UPDATE qua view</td><td>đoán được một INSERT qua view có thành công không, và nó thật sự làm gì</td></tr>
<tr><td>41</td><td>thói quen tối ưu truy vấn</td><td>gọi tên được ít nhất 5 trong 10 thói quen và vì sao nó giúp ích</td></tr>
</tbody>
</table>
<p>Mọi ví dụ SQL bên dưới đã chạy thật; các bảng 30.000 dòng cho demo chỉ mục được dựng bằng <code>INSERT … SELECT</code> theo tập hợp (nhanh, không bao giờ dùng vòng <code>WHILE</code> từng dòng chậm chạp), và mọi ví dụ view chạy trên CSDL FUHCompany của môn (sơ đồ của nó ở bài 5.B, slide 21).</p>`),
    walkHead('dbi8', 22, 41),
    walk('dbi8', [
      [22, 'Index overview',
        `<p class="y-chinh">🎯 An index on column A is a data structure that makes finding rows with a given A value efficient — without it, the engine scans every row.</p>
<p>Everyday analogy: looking up "transaction" in this course's index takes you straight to the right page; without an index you'd read the whole book. A database index does the same three jobs the slide lists: find rows where <code>R.A = v</code>, find matching rows between two tables (<code>R.A = S.B</code>, used by joins), and — sometimes, depending on the index type — find rows where <code>R.A &gt; v</code>.</p>
<p>The slide's own example: <code>SELECT * FROM Student WHERE name = 'Mary'</code>. Without an index, the engine scans every Student row checking the name. With an index on <code>name</code>, it goes "directly" to the matching row. We build and measure exactly this on slide 24.</p>
<p class="meo">🧠 Indexes can be built on a single column or a combination of columns (a <strong>composite index</strong>) — slide 25.</p>`,
        `<p class="y-chinh">🎯 Chỉ mục trên cột A là một cấu trúc dữ liệu giúp tìm các dòng có giá trị A cho trước hiệu quả — không có nó, engine phải quét mọi dòng.</p>
<p>Ví dụ đời thường: tra "giao dịch" trong mục lục cuối tài liệu môn này đưa bạn thẳng tới đúng trang; không có mục lục bạn phải đọc cả cuốn. Chỉ mục CSDL làm đúng ba việc slide liệt kê: tìm dòng có <code>R.A = v</code>, tìm dòng khớp giữa hai bảng (<code>R.A = S.B</code>, dùng trong join), và — đôi khi, tuỳ loại chỉ mục — tìm dòng có <code>R.A &gt; v</code>.</p>
<p>Ví dụ của chính slide: <code>SELECT * FROM Student WHERE name = 'Mary'</code>. Không có chỉ mục, engine quét mọi dòng Student để kiểm tên. Có chỉ mục trên <code>name</code>, nó đi "thẳng" tới dòng khớp. Ta dựng và đo đúng việc này ở slide 24.</p>
<p class="meo">🧠 Chỉ mục có thể dựng trên một cột hoặc kết hợp nhiều cột (gọi là <strong>chỉ mục ghép</strong> — composite index) — slide 25.</p>`],
      [23, 'Type of indexes',
        `<p class="y-chinh">🎯 Two physical structures: a clustered index (the table's rows ARE stored in this order — only one per table) and a nonclustered index (a separate B-tree pointing back to the data).</p>
<p>The diagram compares two ways to reach the same rows (values 1…50 sorted into a B-tree with leaf pages of 10 values each):</p>
<table>
<thead><tr><th>Path</th><th>How</th><th>Cost on the diagram</th></tr></thead>
<tbody>
<tr><td>Clustered Index</td><td>The root splits at 30/50; walking down lands directly on the leaf page holding the actual rows (1–10, 11–30, 31–40, 41–50) — no extra step</td><td>"Clustered Index Seek [Customers].[PK_Customers]" — Cost: 53%</td></tr>
<tr><td>Non-clustered index</td><td>The root splits at 30/50, but the leaf holds a Row ID (RID), not the row itself; a second trip ("Goes to the actual row on the heap") fetches the row from the Heap by that RID</td><td>"RID Lookup (Heap) [Customers]" — Cost: 56%</td></tr>
</tbody>
</table>
<p>Two ideas to keep separate: (1) a <strong>clustered</strong> index physically sorts the table's data by its key — there can be at most one per table (a table can't be sorted two ways at once); (2) a <strong>nonclustered</strong> index is a slim, separate structure that points back to the row — a table can have several. On this diagram the nonclustered path additionally needs to jump to the Clustered Index Key first (labelled arrow), because that is what a nonclustered index stores as its "pointer" when the table already has a clustered index.</p>`,
        `<p class="y-chinh">🎯 Hai cấu trúc vật lý: chỉ mục gom cụm — clustered (dữ liệu của bảng ĐƯỢC LƯU theo đúng thứ tự này — chỉ một cái mỗi bảng) và chỉ mục không gom cụm — nonclustered (một cây B-tree riêng, trỏ ngược về dữ liệu).</p>
<p>Sơ đồ so sánh hai cách tới cùng các dòng dữ liệu (giá trị 1…50 xếp vào cây B-tree, mỗi trang lá 10 giá trị):</p>
<table>
<thead><tr><th>Đường đi</th><th>Cách làm</th><th>Chi phí trên sơ đồ</th></tr></thead>
<tbody>
<tr><td>Clustered Index (gom cụm)</td><td>Gốc tách ở 30/50; đi xuống là tới thẳng trang lá chứa dòng dữ liệu thật (1–10, 11–30, 31–40, 41–50) — không cần bước thêm</td><td>"Clustered Index Seek [Customers].[PK_Customers]" — Chi phí: 53%</td></tr>
<tr><td>Non-clustered index (không gom cụm)</td><td>Gốc cũng tách ở 30/50, nhưng lá chứa Row ID (RID), không phải dòng thật; một bước nữa ("đi tới dòng thật trên Heap") lấy dòng từ Heap theo RID đó</td><td>"RID Lookup (Heap) [Customers]" — Chi phí: 56%</td></tr>
</tbody>
</table>
<p>Hai ý cần tách bạch: (1) chỉ mục <strong>gom cụm</strong> (clustered) sắp xếp VẬT LÝ dữ liệu của bảng theo khoá của nó — nhiều nhất một cái mỗi bảng (một bảng không thể sắp theo hai kiểu cùng lúc); (2) chỉ mục <strong>không gom cụm</strong> (nonclustered) là một cấu trúc mảnh, riêng biệt, trỏ ngược về dòng dữ liệu — một bảng có thể có nhiều cái. Trên sơ đồ này, đường không gom cụm còn phải nhảy tới Clustered Index Key trước (mũi tên có nhãn), vì đó là thứ một chỉ mục không gom cụm lưu làm "con trỏ" khi bảng đã có sẵn chỉ mục gom cụm.</p>`],
      [24, 'Indexes implementation on SQL',
        `<p class="y-chinh">🎯 Real syntax: CREATE CLUSTERED INDEX, CREATE NONCLUSTERED INDEX, DROP INDEX — the slide says "//demo required", so here is a full real demo.</p>
<pre><code class="language-plaintext">CREATE CLUSTERED INDEX index_name ON dbo.Tablename(ColumnName1, ColumnName2...)
CREATE NONCLUSTERED INDEX index_name ON dbo.Tablename(ColumnName1, ColumnName2...)
DROP INDEX index_name</code></pre>
<p class="nhan">The demo: 30,000 rows, one named 'Mary', query WHERE name = 'Mary' — before and after an index</p>
<pre><code class="language-sql">-- Slide 22-24: without an index the engine scans every row; with one it seeks straight to the match.
-- 30,000 rows, one of them named 'Mary' — set-based (fast), not a WHILE loop.
CREATE TABLE dbo.Student (
  id INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
  name NVARCHAR(50) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.Student(id, name)
SELECT rn, N'Student' + CAST(rn AS NVARCHAR(10)) FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;
GO
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;
GO
CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name);
GO
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.14665237069129944</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Clustered Index Scan(OBJECT:([DBI202].[dbo].[Student].[pk_student]), WHERE:([DBI202].[dbo].[Student].[name]=[@1]))</td><td>1</td><td>2</td><td>1</td><td>Clustered Index Scan</td><td>Clustered Index Scan</td><td>OBJECT:([DBI202].[dbo].[Student].[pk_student]), WHERE:([DBI202].[dbo].[Student].[name]=[@1])</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.113495372235775</td><td>0.033156998455524445</td><td>38</td><td>0.14665237069129944</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>38</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<p>Read the <code>StmtText</code> column of each plan (<code>SET STATISTICS PROFILE ON</code> prints the plan as text — SSMS's graphical plan shows the same tree as icons). Before the index: <strong>Clustered Index Scan</strong> on <code>pk_student</code> — the engine reads all 30,000 rows in primary-key order, checking each one's <code>name</code>. After <code>CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name)</code>: <strong>Index Seek</strong> — it jumps straight to the matching leaf. Same 1-row answer, radically different amount of work.</p>
<div class="pitfall"><code>DROP INDEX</code> in T-SQL needs the table name: <code>DROP INDEX idx_student_name ON dbo.Student;</code> (the slide's bare <code>DROP INDEX index_name</code> is the ANSI-SQL form again — real T-SQL requires <code>ON tablename</code>).</div>`,
        `<p class="y-chinh">🎯 Cú pháp thật: CREATE CLUSTERED INDEX, CREATE NONCLUSTERED INDEX, DROP INDEX — slide ghi "//demo required" (cần demo), nên đây là một demo thật đầy đủ.</p>
<pre><code class="language-plaintext">CREATE CLUSTERED INDEX tên_chỉ_mục ON dbo.TênBảng(Cột1, Cột2...)
CREATE NONCLUSTERED INDEX tên_chỉ_mục ON dbo.TênBảng(Cột1, Cột2...)
DROP INDEX tên_chỉ_mục</code></pre>
<p class="nhan">Demo: 30.000 dòng, một dòng tên 'Mary', truy vấn WHERE name = 'Mary' — trước và sau khi có chỉ mục</p>
<pre><code class="language-sql">-- Slide 22-24: without an index the engine scans every row; with one it seeks straight to the match.
-- 30,000 rows, one of them named 'Mary' — set-based (fast), not a WHILE loop.
CREATE TABLE dbo.Student (
  id INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
  name NVARCHAR(50) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.Student(id, name)
SELECT rn, N'Student' + CAST(rn AS NVARCHAR(10)) FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;
GO
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;
GO
CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name);
GO
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.14665237069129944</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Clustered Index Scan(OBJECT:([DBI202].[dbo].[Student].[pk_student]), WHERE:([DBI202].[dbo].[Student].[name]=[@1]))</td><td>1</td><td>2</td><td>1</td><td>Clustered Index Scan</td><td>Clustered Index Scan</td><td>OBJECT:([DBI202].[dbo].[Student].[pk_student]), WHERE:([DBI202].[dbo].[Student].[name]=[@1])</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.113495372235775</td><td>0.033156998455524445</td><td>38</td><td>0.14665237069129944</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>38</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<p>Đọc cột <code>StmtText</code> của mỗi kế hoạch (<code>SET STATISTICS PROFILE ON</code> in kế hoạch dạng chữ — kế hoạch đồ hoạ của SSMS vẽ đúng cây này bằng biểu tượng). Trước khi có chỉ mục: <strong>Clustered Index Scan</strong> trên <code>pk_student</code> — engine đọc cả 30.000 dòng theo thứ tự khoá chính, kiểm <code>name</code> từng dòng. Sau <code>CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name)</code>: <strong>Index Seek</strong> — nó nhảy thẳng tới trang lá khớp. Cùng một kết quả 1 dòng, khối lượng công việc khác nhau hoàn toàn.</p>
<div class="pitfall"><code>DROP INDEX</code> trong T-SQL cần tên bảng: <code>DROP INDEX idx_student_name ON dbo.Student;</code> (<code>DROP INDEX tên_chỉ_mục</code> trơn của slide lại là dạng ANSI-SQL — T-SQL thật cần <code>ON tênbảng</code>).</div>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> không có từ khoá CLUSTERED/NONCLUSTERED: mọi bảng mặc định là một "heap" (đống, không sắp xếp), và <code>CLUSTER</code> chỉ sắp xếp lại VẬT LÝ MỘT LẦN (không tự duy trì thứ tự sau đó, khác clustered index của SQL Server). <code>EXPLAIN ANALYZE</code> thay cho <code>SET STATISTICS PROFILE</code>:
<pre><code class="language-sql">-- PostgreSQL: no CLUSTERED/NONCLUSTERED keyword — every table is a heap unless you CLUSTER it once (a one-time
-- physical reorder, not maintained after). EXPLAIN ANALYZE replaces SET STATISTICS PROFILE.
CREATE TABLE student (id INT PRIMARY KEY, name VARCHAR(50) NOT NULL);
INSERT INTO student(id, name)
  SELECT g, 'Student' || g FROM generate_series(1, 30000) AS g;
UPDATE student SET name = 'Mary' WHERE id = 15000;

EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF, COSTS OFF) SELECT * FROM student WHERE name = 'Mary';

CREATE INDEX idx_student_name ON student(name);
ANALYZE student;

EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF, COSTS OFF) SELECT * FROM student WHERE name = 'Mary';</code></pre>
<div class="out">INSERT 0 30000<br>
UPDATE 1</div>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Seq Scan on student (actual rows=1 loops=1)</td></tr>
<tr><td>  Filter: ((name)::text = 'Mary'::text)</td></tr>
<tr><td>  Rows Removed by Filter: 29999</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Index Scan using idx_student_name on student (actual rows=1 loops=1)</td></tr>
<tr><td>  Index Cond: ((name)::text = 'Mary'::text)</td></tr>
</tbody>
</table>
Trước chỉ mục: <code>Seq Scan</code> (quét tuần tự). Sau <code>CREATE INDEX idx_student_name ON student(name)</code> và <code>ANALYZE</code> (cập nhật thống kê cho bộ lập kế hoạch): <code>Index Scan using idx_student_name</code>. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-9-1-chi-muc-la-gi">PostgreSQL 9.1 — chỉ mục là gì</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-10-1-doc-explain">PostgreSQL 10.1 — đọc EXPLAIN</a>.</div>`],
      [25, 'Index design guidelines',
        `<p class="y-chinh">🎯 Choosing indexes is a real design decision: it depends on table size, data distribution and, most of all, the query/update load — plus column type, number of indexes, storage, and query design.</p>
<ul>
<li><strong>Table size: large enough.</strong> A tiny table is faster to just scan than to seek through an index (the engine may even ignore a small table's index — you will see exactly this in the practice exercises).</li>
<li><strong>Column types</strong>: small, fixed-size columns (<code>INT</code>, <code>BIGINT</code>) make the smallest, fastest indexes. An identity (auto-increment) or a static (rarely-changed) column is naturally unique/NOT NULL — a good clustered-index candidate.</li>
<li><strong>Number of indexes</strong>: every index speeds up reads but slows down every <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> (it must be maintained too) and uses disk — don't over-index.</li>
<li><strong>Query design</strong>: an index only helps a query written in a way the engine can use — see the two demos below.</li>
</ul>
<p class="nhan">Guideline in action 1 — a composite/covering index with INCLUDE</p>
<p>A query needing <code>id, name, salary</code> but indexed only on <code>name</code> still has to jump back to the table for <code>salary</code> (a <strong>Key Lookup</strong>). <code>INCLUDE</code> carries extra columns in the index leaf without making them part of the search key:</p>
<pre><code class="language-sql">-- Slide 24-25: INCLUDE — put extra columns in the index's leaf level so the query never touches the table.
-- Same 30,000-row Student, now with a salary column too.
CREATE TABLE dbo.Student (
  id INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
  name NVARCHAR(50) NOT NULL,
  salary DECIMAL(10,0) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.Student(id, name, salary)
SELECT rn, N'Student' + CAST(rn AS NVARCHAR(10)), 5000000 + rn FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;
GO
-- Index on name only: the engine SEEKs the index, then must go back to the table for salary (Key Lookup)
CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name);
GO
SET STATISTICS PROFILE ON;
SELECT id, name, salary FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;
GO
DROP INDEX idx_student_name ON dbo.Student;
CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student(name) INCLUDE (salary);
GO
-- With salary carried in the index leaf, the query is answered from the index alone — a "covering" index
SET STATISTICS PROFILE ON;
SELECT id, name, salary FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>name</th><th>salary</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td><td>5015000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT [id],[name],[salary] FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0065703801810741425</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Nested Loops(Inner Join, OUTER REFERENCES:([DBI202].[dbo].[Student].[id]))</td><td>1</td><td>2</td><td>1</td><td>Nested Loops</td><td>Inner Join</td><td>OUTER REFERENCES:([DBI202].[dbo].[Student].[id])</td><td><em>NULL</em></td><td>1</td><td>0</td><td>0.000004179999905318255</td><td>47</td><td>0.0065703801810741425</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name], [DBI202].[dbo].[Student].[salary]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>       |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=N'Mary') ORDERED FORWARD)</td><td>1</td><td>3</td><td>2</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=N'Mary') ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>38</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>       |--Clustered Index Seek(OBJECT:([DBI202].[dbo].[Student].[pk_student]), SEEK:([DBI202].[dbo].[Student].[id]=[DBI202].[dbo].[Student].[id]) LOOKUP ORDERED FORWARD)</td><td>1</td><td>5</td><td>2</td><td>Clustered Index Seek</td><td>Clustered Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[pk_student]), SEEK:([DBI202].[dbo].[Student].[id]=[DBI202].[dbo].[Student].[id]) LOOKUP ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[salary]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>16</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[salary]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th><th>salary</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td><td>5015000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT [id],[name],[salary] FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name_covering]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name_covering]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name], [DBI202].[dbo].[Student].[salary]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>47</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name], [DBI202].[dbo].[Student].[salary]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<p>Without <code>INCLUDE</code>: <code>Index Seek</code> on <code>name</code> <em>plus</em> <code>Nested Loops</code> + <code>Clustered Index Seek … LOOKUP</code> — two trips. With <code>salary</code> in <code>INCLUDE</code>: a single <code>Index Seek</code> — the whole answer comes from the index alone (a <strong>covering index</strong>).</p>
<p class="nhan">Guideline in action 2 — when the index is NOT used at all</p>
<pre><code class="language-sql">-- Slide 25: an index on name is USELESS once you wrap the column in a function, or start a LIKE pattern with %
CREATE TABLE dbo.Student (
  id INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
  name NVARCHAR(50) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.Student(id, name)
SELECT rn, N'Student' + CAST(rn AS NVARCHAR(10)) FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;
CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name);
GO
-- A function wrapped around the indexed column: the index cannot be used, SQL Server scans everything
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE UPPER(name) = N'MARY';
SET STATISTICS PROFILE OFF;
GO
-- Sargable ("search argument able"): the column is bare, the index is used
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;
GO
-- Leading %: SQL Server cannot know where in the index to start ⇒ scan
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name LIKE N'%ary';
SET STATISTICS PROFILE OFF;
GO
-- Trailing %: a known starting point ⇒ still a seek (a range seek)
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name LIKE N'Mar%';
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM dbo.Student WHERE UPPER(name) = N'MARY'</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.13850422203540802</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Scan(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:(upper([DBI202].[dbo].[Student].[name])=N'MARY'))</td><td>1</td><td>2</td><td>1</td><td>Index Scan</td><td>Index Scan</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:(upper([DBI202].[dbo].[Student].[name])=N'MARY')</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.10534722357988358</td><td>0.033156998455524445</td><td>38</td><td>0.13850422203540802</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>38</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM dbo.Student WHERE name LIKE N'%ary'</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>19.867549896240234</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.13850422203540802</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Scan(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:([DBI202].[dbo].[Student].[name] like N'%ary'))</td><td>1</td><td>2</td><td>1</td><td>Index Scan</td><td>Index Scan</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:([DBI202].[dbo].[Student].[name] like N'%ary')</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>19.867549896240234</td><td>0.10534722357988358</td><td>0.033156998455524445</td><td>65</td><td>0.13850422203540802</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM dbo.Student WHERE name LIKE N'Mar%'</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>19.867549896240234</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0033038542605936527</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name] &gt;= N'Mar' AND [DBI202].[dbo].[Student].[name] &lt; N'MaS'),  WHERE:([DBI202].[dbo].[Student].[name] like N'Mar%') ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name] &gt;= N'Mar' AND [DBI202].[dbo].[Student].[name] &lt; N'MaS'),  WHERE:([DBI202].[dbo].[Student].[name] like N'Mar%') ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>19.867549896240234</td><td>0.0031250000465661287</td><td>0.00017885430133901536</td><td>65</td><td>0.0033038542605936527</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>WHERE clause</th><th>Plan</th><th>Why</th></tr></thead>
<tbody>
<tr><td><code>UPPER(name) = 'MARY'</code></td><td>Index Scan</td><td>a function wraps the indexed column ⇒ SQL Server can't binary-search the index by the ORIGINAL values; it must check every entry</td></tr>
<tr><td><code>name = 'Mary'</code></td><td>Index Seek</td><td>bare column ("sargable" — SEarch ARGument ABLE) ⇒ seek</td></tr>
<tr><td><code>name LIKE '%ary'</code></td><td>Index Scan</td><td>a leading <code>%</code> means "no known starting point" ⇒ every entry is checked</td></tr>
<tr><td><code>name LIKE 'Mar%'</code></td><td>Index Seek</td><td>a known prefix ⇒ a range seek from 'Mar' to 'MaS'</td></tr>
</tbody>
</table>
<p class="pitfall">This is one of the most common real-world performance bugs: wrapping an indexed column in a function (<code>UPPER()</code>, <code>YEAR()</code>, <code>CONVERT()</code>…) silently throws the index away. Fix by comparing the RAW column (<code>name = 'MARY' COLLATE …</code> or storing a normalised copy) instead of transforming the column in <code>WHERE</code>.</p>`,
        `<p class="y-chinh">🎯 Chọn chỉ mục là một quyết định thiết kế thật: phụ thuộc kích thước bảng, phân bố dữ liệu và, quan trọng nhất, khối lượng truy vấn/cập nhật — cộng thêm kiểu cột, số lượng chỉ mục, nơi lưu trữ, và cách thiết kế truy vấn.</p>
<ul>
<li><strong>Kích thước bảng: đủ lớn.</strong> Một bảng nhỏ xíu quét thẳng còn nhanh hơn tìm qua chỉ mục (engine có thể lờ luôn chỉ mục của bảng nhỏ — bạn sẽ thấy đúng việc này ở bài thực hành).</li>
<li><strong>Kiểu cột</strong>: cột nhỏ, kích thước cố định (<code>INT</code>, <code>BIGINT</code>) cho chỉ mục nhỏ nhất, nhanh nhất. Cột tự tăng (identity) hay tĩnh (ít đổi) tự nhiên là duy nhất/NOT NULL — ứng viên tốt cho clustered index.</li>
<li><strong>Số lượng chỉ mục</strong>: mỗi chỉ mục tăng tốc đọc nhưng làm chậm mọi <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> (nó cũng phải được duy trì) và tốn đĩa — đừng lạm dụng.</li>
<li><strong>Thiết kế truy vấn</strong>: chỉ mục chỉ giúp được truy vấn viết theo cách engine dùng được nó — xem hai demo dưới.</li>
</ul>
<p class="nhan">Nguyên tắc trong thực tế 1 — chỉ mục ghép/bao phủ với INCLUDE</p>
<p>Một truy vấn cần <code>id, name, salary</code> nhưng chỉ có chỉ mục trên <code>name</code> vẫn phải nhảy về bảng để lấy <code>salary</code> (gọi là <strong>Key Lookup</strong>). <code>INCLUDE</code> mang thêm cột vào trang lá của chỉ mục mà không biến chúng thành khoá tìm kiếm:</p>
<pre><code class="language-sql">-- Slide 24-25: INCLUDE — put extra columns in the index's leaf level so the query never touches the table.
-- Same 30,000-row Student, now with a salary column too.
CREATE TABLE dbo.Student (
  id INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
  name NVARCHAR(50) NOT NULL,
  salary DECIMAL(10,0) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.Student(id, name, salary)
SELECT rn, N'Student' + CAST(rn AS NVARCHAR(10)), 5000000 + rn FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;
GO
-- Index on name only: the engine SEEKs the index, then must go back to the table for salary (Key Lookup)
CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name);
GO
SET STATISTICS PROFILE ON;
SELECT id, name, salary FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;
GO
DROP INDEX idx_student_name ON dbo.Student;
CREATE NONCLUSTERED INDEX idx_student_name_covering ON dbo.Student(name) INCLUDE (salary);
GO
-- With salary carried in the index leaf, the query is answered from the index alone — a "covering" index
SET STATISTICS PROFILE ON;
SELECT id, name, salary FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>name</th><th>salary</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td><td>5015000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT [id],[name],[salary] FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0065703801810741425</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Nested Loops(Inner Join, OUTER REFERENCES:([DBI202].[dbo].[Student].[id]))</td><td>1</td><td>2</td><td>1</td><td>Nested Loops</td><td>Inner Join</td><td>OUTER REFERENCES:([DBI202].[dbo].[Student].[id])</td><td><em>NULL</em></td><td>1</td><td>0</td><td>0.000004179999905318255</td><td>47</td><td>0.0065703801810741425</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name], [DBI202].[dbo].[Student].[salary]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>       |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=N'Mary') ORDERED FORWARD)</td><td>1</td><td>3</td><td>2</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=N'Mary') ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>38</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>       |--Clustered Index Seek(OBJECT:([DBI202].[dbo].[Student].[pk_student]), SEEK:([DBI202].[dbo].[Student].[id]=[DBI202].[dbo].[Student].[id]) LOOKUP ORDERED FORWARD)</td><td>1</td><td>5</td><td>2</td><td>Clustered Index Seek</td><td>Clustered Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[pk_student]), SEEK:([DBI202].[dbo].[Student].[id]=[DBI202].[dbo].[Student].[id]) LOOKUP ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[salary]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>16</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[salary]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th><th>salary</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td><td>5015000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT [id],[name],[salary] FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name_covering]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name_covering]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name], [DBI202].[dbo].[Student].[salary]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>47</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name], [DBI202].[dbo].[Student].[salary]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<p>Không có <code>INCLUDE</code>: <code>Index Seek</code> trên <code>name</code> <em>cộng thêm</em> <code>Nested Loops</code> + <code>Clustered Index Seek … LOOKUP</code> — hai lượt. Có <code>salary</code> trong <code>INCLUDE</code>: chỉ một <code>Index Seek</code> — cả câu trả lời lấy được từ riêng chỉ mục (gọi là <strong>chỉ mục bao phủ</strong> — covering index).</p>
<p class="nhan">Nguyên tắc trong thực tế 2 — khi nào chỉ mục KHÔNG được dùng</p>
<pre><code class="language-sql">-- Slide 25: an index on name is USELESS once you wrap the column in a function, or start a LIKE pattern with %
CREATE TABLE dbo.Student (
  id INT NOT NULL CONSTRAINT pk_student PRIMARY KEY,
  name NVARCHAR(50) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.Student(id, name)
SELECT rn, N'Student' + CAST(rn AS NVARCHAR(10)) FROM n;
UPDATE dbo.Student SET name = N'Mary' WHERE id = 15000;
CREATE NONCLUSTERED INDEX idx_student_name ON dbo.Student(name);
GO
-- A function wrapped around the indexed column: the index cannot be used, SQL Server scans everything
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE UPPER(name) = N'MARY';
SET STATISTICS PROFILE OFF;
GO
-- Sargable ("search argument able"): the column is bare, the index is used
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name = N'Mary';
SET STATISTICS PROFILE OFF;
GO
-- Leading %: SQL Server cannot know where in the index to start ⇒ scan
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name LIKE N'%ary';
SET STATISTICS PROFILE OFF;
GO
-- Trailing %: a known starting point ⇒ still a seek (a range seek)
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.Student WHERE name LIKE N'Mar%';
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM dbo.Student WHERE UPPER(name) = N'MARY'</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.13850422203540802</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Scan(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:(upper([DBI202].[dbo].[Student].[name])=N'MARY'))</td><td>1</td><td>2</td><td>1</td><td>Index Scan</td><td>Index Scan</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:(upper([DBI202].[dbo].[Student].[name])=N'MARY')</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.10534722357988358</td><td>0.033156998455524445</td><td>38</td><td>0.13850422203540802</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM [dbo].[Student] WHERE [name]=@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name]=[@1]) ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>38</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM dbo.Student WHERE name LIKE N'%ary'</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>19.867549896240234</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.13850422203540802</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Scan(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:([DBI202].[dbo].[Student].[name] like N'%ary'))</td><td>1</td><td>2</td><td>1</td><td>Index Scan</td><td>Index Scan</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]),  WHERE:([DBI202].[dbo].[Student].[name] like N'%ary')</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>19.867549896240234</td><td>0.10534722357988358</td><td>0.033156998455524445</td><td>65</td><td>0.13850422203540802</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>name</th></tr></thead>
<tbody>
<tr><td>15000</td><td>Mary</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>SELECT * FROM dbo.Student WHERE name LIKE N'Mar%'</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>19.867549896240234</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0033038542605936527</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>1</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name] &gt;= N'Mar' AND [DBI202].[dbo].[Student].[name] &lt; N'MaS'),  WHERE:([DBI202].[dbo].[Student].[name] like N'Mar%') ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[Student].[idx_student_name]), SEEK:([DBI202].[dbo].[Student].[name] &gt;= N'Mar' AND [DBI202].[dbo].[Student].[name] &lt; N'MaS'),  WHERE:([DBI202].[dbo].[Student].[name] like N'Mar%') ORDERED FORWARD</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td>19.867549896240234</td><td>0.0031250000465661287</td><td>0.00017885430133901536</td><td>65</td><td>0.0033038542605936527</td><td>[DBI202].[dbo].[Student].[id], [DBI202].[dbo].[Student].[name]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Mệnh đề WHERE</th><th>Kế hoạch</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td><code>UPPER(name) = 'MARY'</code></td><td>Index Scan</td><td>một hàm bọc quanh cột có chỉ mục ⇒ SQL Server không tìm nhị phân theo giá trị GỐC được nữa; phải kiểm từng mục</td></tr>
<tr><td><code>name = 'Mary'</code></td><td>Index Seek</td><td>cột trơn ("sargable" — tìm được bằng đối số tìm kiếm) ⇒ seek</td></tr>
<tr><td><code>name LIKE '%ary'</code></td><td>Index Scan</td><td><code>%</code> đứng đầu nghĩa là "không biết bắt đầu từ đâu" ⇒ kiểm từng mục</td></tr>
<tr><td><code>name LIKE 'Mar%'</code></td><td>Index Seek</td><td>biết trước tiền tố ⇒ tìm theo khoảng từ 'Mar' tới 'MaS'</td></tr>
</tbody>
</table>
<p class="pitfall">Đây là một trong những lỗi hiệu năng thật hay gặp nhất: bọc cột có chỉ mục trong một hàm (<code>UPPER()</code>, <code>YEAR()</code>, <code>CONVERT()</code>…) lặng lẽ vứt bỏ chỉ mục. Sửa bằng cách so sánh cột THÔ (<code>name = 'MARY' COLLATE …</code> hoặc lưu thêm một bản đã chuẩn hoá) thay vì biến đổi cột trong <code>WHERE</code>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> <code>INCLUDE</code> cũng có (từ bản 11), cùng ý tưởng:
<pre><code class="language-sql">-- PostgreSQL supports INCLUDE too (since v11) — same idea: a covering index, no trip back to the table
CREATE TABLE student (id INT PRIMARY KEY, name VARCHAR(50) NOT NULL, salary NUMERIC(10,0) NOT NULL);
INSERT INTO student(id, name, salary)
  SELECT g, 'Student' || g, 5000000 + g FROM generate_series(1, 30000) AS g;
UPDATE student SET name = 'Mary' WHERE id = 15000;

CREATE INDEX idx_student_name_covering ON student(name) INCLUDE (salary);

EXPLAIN (ANALYZE, TIMING OFF, SUMMARY OFF, COSTS OFF) SELECT id, name, salary FROM student WHERE name = 'Mary';</code></pre>
<div class="out">INSERT 0 30000<br>
UPDATE 1</div>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Bitmap Heap Scan on student (actual rows=1 loops=1)</td></tr>
<tr><td>  Recheck Cond: ((name)::text = 'Mary'::text)</td></tr>
<tr><td>  Heap Blocks: exact=1</td></tr>
<tr><td>  -&gt;  Bitmap Index Scan on idx_student_name_covering (actual rows=1 loops=1)</td></tr>
<tr><td>        Index Cond: ((name)::text = 'Mary'::text)</td></tr>
</tbody>
</table>
PostgreSQL còn có một thứ T-SQL không có: <strong>chỉ mục một phần</strong> (partial index) — chỉ đánh chỉ mục những dòng thoả một điều kiện (<code>CREATE INDEX … ON t(c) WHERE điều_kiện</code>), nhỏ và nhanh hơn đánh chỉ mục cả bảng — làm thật ở bài thực hành chương này. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-9-2-to-hop-covering">PostgreSQL 9.2 — chỉ mục tổ hợp &amp; covering</a> · <a href="/courses/postgresql/learn?lessonSlug=postgresql-9-3-khong-dung-selectivity-partial">PostgreSQL 9.3 — không dùng, độ chọn lọc &amp; partial</a>.</div>`],
      [26, 'Relations vs. Views',
        `<p class="y-chinh">🎯 A relation (table) physically exists, defined by CREATE TABLE, and stays until explicitly changed. A view does not exist physically — it's defined by a query expression, yet can still be queried and even modified. A third option, materialized views, sits in between.</p>
<p>Everyday analogy: a <strong>table</strong> is like a filing cabinet — the papers are really there, in a real drawer, taking real space. A <strong>view</strong> is like a sticky note that says "go to drawer 3, take only the folders labelled 'department 1'" — nothing is copied, the note is just instructions, computed fresh every time someone follows it. A <strong>materialized view</strong> (covered as a PostgreSQL-only tool in the practice exercises) is like photocopying those folders once and leaving the photocopies on your desk: fast to grab, but they go out of date the moment the originals change, until someone photocopies again.</p>
<p class="nhan">Three storage strategies, side by side</p>
<table>
<thead><tr><th></th><th>Table</th><th>View</th><th>Materialized view</th></tr></thead>
<tbody>
<tr><td>Data physically stored?</td><td>yes, on disk</td><td>no — zero extra storage</td><td>yes, a physical copy of the result</td></tr>
<tr><td>When is it computed?</td><td>once, at INSERT/UPDATE time</td><td>every single time it is queried</td><td>once, at CREATE/REFRESH time — then just read</td></tr>
<tr><td>Always up to date?</td><td>yes, by definition</td><td>yes — always reflects the base tables live</td><td>no — can go stale until refreshed</td></tr>
<tr><td>Cost</td><td>disk space, maintained on every write</td><td>CPU time on every read (re-runs the query)</td><td>disk space AND a REFRESH step someone must remember to run</td></tr>
</tbody>
</table>
<p class="nhan">Why bother with a view at all, when you could just query the table?</p>
<ul>
<li><strong>Hide sensitive columns.</strong> Give a report-writer team a view of <code>tblEmployee</code> that leaves out <code>empSalary</code> entirely — they can never SELECT what isn't in the view's definition.</li>
<li><strong>Simplify a repeated JOIN.</strong> If five different reports all need "employee joined with their department name," write that JOIN once as a view and query the view five times — one place to fix if the logic ever needs to change.</li>
<li><strong>Permissions.</strong> <code>GRANT SELECT</code> on a view without granting any access to the underlying tables — a real, common security pattern (self-study: <code>GRANT</code>/<code>REVOKE</code>, slide 3's DCL).</li>
</ul>`,
        `<p class="y-chinh">🎯 Quan hệ (bảng) tồn tại vật lý, định nghĩa bằng CREATE TABLE, tồn tại tới khi bị đổi rõ ràng. View không tồn tại vật lý — định nghĩa bằng một biểu thức truy vấn, nhưng vẫn truy vấn được và thậm chí sửa được. Một lựa chọn thứ ba, materialized view, nằm ở giữa hai thứ đó.</p>
<p>Ví dụ đời thường: <strong>bảng</strong> giống một tủ hồ sơ — giấy tờ thật sự nằm đó, trong một ngăn kéo thật, chiếm không gian thật. <strong>View</strong> giống một tờ giấy nhớ ghi "đi tới ngăn kéo 3, chỉ lấy các bìa hồ sơ ghi 'phòng 1'" — không có gì được sao chép, tờ giấy chỉ là chỉ dẫn, được tính lại mỗi lần ai đó làm theo. <strong>Materialized view</strong> (chỉ có ở PostgreSQL, học ở bài thực hành) giống việc bạn photocopy đúng những bìa hồ sơ đó một lần rồi để bản photocopy trên bàn: lấy nhanh, nhưng nó cũ đi ngay khi bản gốc đổi, cho tới khi ai đó photocopy lại.</p>
<p class="nhan">Ba chiến lược lưu trữ, đặt cạnh nhau</p>
<table>
<thead><tr><th></th><th>Bảng</th><th>View</th><th>Materialized view</th></tr></thead>
<tbody>
<tr><td>Dữ liệu lưu vật lý?</td><td>có, trên đĩa</td><td>không — không tốn thêm dung lượng nào</td><td>có, một bản sao vật lý của kết quả</td></tr>
<tr><td>Tính lúc nào?</td><td>một lần, lúc INSERT/UPDATE</td><td>mỗi lần được truy vấn</td><td>một lần, lúc CREATE/REFRESH — sau đó chỉ đọc</td></tr>
<tr><td>Luôn mới nhất?</td><td>có, theo định nghĩa</td><td>có — luôn phản ánh bảng gốc theo thời gian thực</td><td>không — có thể cũ cho tới khi được làm mới</td></tr>
<tr><td>Cái giá</td><td>tốn đĩa, duy trì ở mỗi lần ghi</td><td>tốn CPU ở mỗi lần đọc (chạy lại truy vấn)</td><td>tốn cả đĩa LẪN một bước REFRESH ai đó phải nhớ chạy</td></tr>
</tbody>
</table>
<p class="nhan">Vì sao phải bận tâm tới view, trong khi truy vấn thẳng bảng cũng được?</p>
<ul>
<li><strong>Giấu cột nhạy cảm.</strong> Đưa cho đội viết báo cáo một view của <code>tblEmployee</code> bỏ hẳn cột <code>empSalary</code> — họ không bao giờ SELECT được thứ không có trong định nghĩa của view.</li>
<li><strong>Đơn giản hoá một JOIN hay lặp lại.</strong> Nếu năm báo cáo khác nhau đều cần "nhân viên nối với tên phòng của họ," viết JOIN đó một lần dưới dạng view rồi truy vấn view năm lần — chỉ một chỗ để sửa nếu lô-gic đổi.</li>
<li><strong>Phân quyền.</strong> <code>GRANT SELECT</code> trên một view mà không cấp quyền gì lên bảng gốc — một mẫu bảo mật thật, hay gặp (tự học: <code>GRANT</code>/<code>REVOKE</code>, DCL ở slide 3).</li>
</ul>`],
      [27, 'Views',
        `<p class="y-chinh">🎯 A view is just a relation, but we store its DEFINITION rather than a set of rows; syntax: CREATE VIEW name AS query.</p>
<p>The diagram: <strong>USER ↔ VIEW ↔ DATA TABLES</strong> — the user only ever talks to the view; the view translates every request into the real tables behind it.</p>
<pre><code class="language-plaintext">CREATE VIEW ViewName
AS
SELECT * / RequiredColumnNames
FROM TableName</code></pre>
<p>SQL Server names two kinds: <strong>simple / updatable views</strong> (built on a single table — <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> through the view are possible) and <strong>complex / non-updatable views</strong> (built on multiple tables — generally not). We test both kinds for real, slides 37–40 and in the practice exercises.</p>`,
        `<p class="y-chinh">🎯 View chỉ là một quan hệ, nhưng ta lưu ĐỊNH NGHĨA của nó thay vì một tập dòng; cú pháp: CREATE VIEW tên AS truy_vấn.</p>
<p>Sơ đồ: <strong>USER ↔ VIEW ↔ DATA TABLES</strong> — người dùng chỉ nói chuyện với view; view dịch mọi yêu cầu sang các bảng thật đằng sau nó.</p>
<pre><code class="language-plaintext">CREATE VIEW TênView
AS
SELECT * / DanhSáchCột
FROM TênBảng</code></pre>
<p>SQL Server đặt tên hai loại: <strong>view đơn giản / cập nhật được</strong> (updatable — dựng trên một bảng — <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> qua view làm được) và <strong>view phức tạp / không cập nhật được</strong> (non-updatable — dựng trên nhiều bảng — nhìn chung là không). Ta thử thật cả hai loại, slide 37–40 và trong bài thực hành.</p>`],
      [28, 'Virtual Views (Example 1)',
        `<p class="y-chinh">🎯 Example 1: a view listing every employee of department 1.</p>
<pre><code class="language-sql">-- Slide 28-30 · Example 1: a view listing all employees of department 1
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT * FROM Employee_Dep1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p><code>IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW …</code> is the slide's own defensive pattern: drop the view first if it already exists (the <code>'V'</code> means "look among Views"), so re-running the script never errors on a duplicate name. <code>Employee_Dep1</code> now behaves like a 4-row table — query it exactly like <code>tblEmployee</code>.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> the syntax is the same (lowercase table/column names, since FUHCompany's PostgreSQL copy folds unquoted identifiers to lowercase):
<pre><code class="language-sql">-- PostgreSQL: same CREATE VIEW syntax
CREATE VIEW employee_dep1 AS
SELECT * FROM tblemployee WHERE depnum = 1;

SELECT * FROM employee_dep1 ORDER BY empssn;</code></pre>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empaddress</th><th>empsalary</th><th>empsex</th><th>empbirthdate</th><th>depnum</th><th>supervisorssn</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-3-view">PostgreSQL 12.3 — views</a>.</div>`,
        `<p class="y-chinh">🎯 Ví dụ 1: một view liệt kê mọi nhân viên phòng 1.</p>
<pre><code class="language-sql">-- Slide 28-30 · Example 1: a view listing all employees of department 1
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT * FROM Employee_Dep1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p><code>IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW …</code> là mẫu phòng thủ của chính slide: xoá view trước nếu nó đã tồn tại (<code>'V'</code> nghĩa là "tìm trong các View"), nên chạy lại script không bao giờ báo lỗi trùng tên. <code>Employee_Dep1</code> giờ hành xử như một bảng 4 dòng — truy vấn y hệt <code>tblEmployee</code>.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> cú pháp giống hệt (tên bảng/cột viết thường, vì bản PostgreSQL của FUHCompany gấp tên không nháy xuống chữ thường):
<pre><code class="language-sql">-- PostgreSQL: same CREATE VIEW syntax
CREATE VIEW employee_dep1 AS
SELECT * FROM tblemployee WHERE depnum = 1;

SELECT * FROM employee_dep1 ORDER BY empssn;</code></pre>
<table>
<thead><tr><th>empssn</th><th>empname</th><th>empaddress</th><th>empsalary</th><th>empsex</th><th>empbirthdate</th><th>depnum</th><th>supervisorssn</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-3-view">PostgreSQL 12.3 — view</a>.</div>`],
      [29, 'Virtual Views (simplest CREATE VIEW form)',
        `<p class="y-chinh">🎯 The simplest form: CREATE VIEW view-name AS view-definition; — the definition is a SQL query. Reading a view is not "run the query once at CREATE time and remember the answer" — SQL Server UNFOLDS the view's definition into whatever query you write against it, merging your WHERE with the view's own WHERE.</p>
<p>Line by line: <code>CREATE VIEW view-name</code> names the object (same naming rules as a table); <code>AS</code> separates the name from its definition; <code>view-definition</code> is any valid <code>SELECT</code> — the exact same grammar you already know from Chapter 6, nothing view-specific about it. That is the whole grammar. Everything else (naming columns, <code>WITH CHECK OPTION</code>, updatability rules) is detail layered on top of this one line.</p>
<p class="nhan">What "unfolding" really means — proven, not just claimed</p>
<pre><code class="language-sql">-- Slide 29: SQL Server does not "run and store" a view's query once — it UNFOLDS (expands) the view's
-- definition into whatever query you write against the view, merging the two WHERE clauses.
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
-- What you type: an extra filter on top of the view
SELECT empSSN, empName, empSalary FROM Employee_Dep1 WHERE empSalary &gt; 60000 ORDER BY empSSN;
GO
-- What SQL Server actually runs underneath: the view's own WHERE, AND your WHERE, both on the base table
SELECT empSSN, empName, empSalary FROM tblEmployee WHERE depNum = 1 AND empSalary &gt; 60000 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
</tbody>
</table>
<p><code>Employee_Dep1</code> is defined as <code>SELECT * FROM tblEmployee WHERE depNum = 1</code>. Querying it with an extra <code>WHERE empSalary &gt; 60000</code> gives the EXACT same 2 rows as querying the base table directly with <code>WHERE depNum = 1 AND empSalary &gt; 60000</code> — because that IS what SQL Server runs underneath. A view stores no data and no cached answer; it is a template the engine expands, every single time, into a query on the real table.</p>
<p class="meo">🧠 This is why a view is never slower than writing out its query by hand, and why the query optimizer (slide 41) can still choose indexes on the BASE table even when you queried through a view — it sees the unfolded, real query, not a black box.</p>`,
        `<p class="y-chinh">🎯 Dạng đơn giản nhất: CREATE VIEW tên-view AS định-nghĩa-view; — định nghĩa là một truy vấn SQL. Đọc một view KHÔNG phải là "chạy truy vấn một lần lúc CREATE rồi nhớ câu trả lời" — SQL Server MỞ (unfold) định nghĩa của view ra thành bất kỳ truy vấn nào bạn viết trên nó, gộp WHERE của bạn với WHERE của chính view.</p>
<p>Đi từng dòng: <code>CREATE VIEW tên-view</code> đặt tên đối tượng (cùng luật đặt tên như một bảng); <code>AS</code> tách tên khỏi định nghĩa; <code>định-nghĩa-view</code> là một câu <code>SELECT</code> hợp lệ bất kỳ — đúng cùng ngữ pháp bạn đã biết từ Chương 6, không có gì đặc thù của view cả. Đó là toàn bộ ngữ pháp. Mọi thứ khác (đặt tên cột, <code>WITH CHECK OPTION</code>, luật cập nhật được) là chi tiết xếp lên trên đúng một dòng này.</p>
<p class="nhan">"Mở" thật sự nghĩa là gì — chứng minh, không chỉ khẳng định suông</p>
<pre><code class="language-sql">-- Slide 29: SQL Server does not "run and store" a view's query once — it UNFOLDS (expands) the view's
-- definition into whatever query you write against the view, merging the two WHERE clauses.
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
-- What you type: an extra filter on top of the view
SELECT empSSN, empName, empSalary FROM Employee_Dep1 WHERE empSalary &gt; 60000 ORDER BY empSSN;
GO
-- What SQL Server actually runs underneath: the view's own WHERE, AND your WHERE, both on the base table
SELECT empSSN, empName, empSalary FROM tblEmployee WHERE depNum = 1 AND empSalary &gt; 60000 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td></tr>
</tbody>
</table>
<p><code>Employee_Dep1</code> được định nghĩa là <code>SELECT * FROM tblEmployee WHERE depNum = 1</code>. Truy vấn nó với thêm <code>WHERE empSalary &gt; 60000</code> cho ra ĐÚNG cùng 2 dòng với truy vấn thẳng bảng gốc bằng <code>WHERE depNum = 1 AND empSalary &gt; 60000</code> — vì đó CHÍNH LÀ thứ SQL Server chạy bên dưới. Một view không lưu dữ liệu, không lưu câu trả lời đã tính sẵn; nó là một khuôn mẫu engine mở ra, mỗi lần, thành một truy vấn trên bảng thật.</p>
<p class="meo">🧠 Đây là lý do một view không bao giờ chậm hơn việc tự tay viết ra truy vấn của nó, và vì sao bộ tối ưu truy vấn (slide 41) vẫn chọn được chỉ mục trên bảng GỐC kể cả khi bạn truy vấn qua view — nó thấy truy vấn thật đã được mở ra, không phải một hộp đen.</p>`],
      [30, 'Virtual Views (Example 1, repeated)',
        `<p class="y-chinh">🎯 The slide deck repeats Example 1 (same as slide 28) before moving to querying it — same view, same code, see slide 28 for the real run. Since it's built with <code>SELECT *</code>, this is exactly the right moment for the biggest <code>SELECT *</code>-in-a-view trap: adding a column to the base table LATER does not make the view show it.</p>
<p>Nothing new in the definition here: <code>Employee_Dep1</code> again. But there is a real gotcha hiding in "unfolding" (slide 29): SQL Server does NOT re-expand <code>*</code> on every query — it resolves <code>SELECT *</code> into the CONCRETE list of columns that existed at the moment <code>CREATE VIEW</code> ran, and stores that fixed list as the view's metadata. A view is a template for the QUERY, but its column list is frozen.</p>
<p class="nhan">Proof: ALTER the base table, then look at the view</p>
<pre><code class="language-sql">-- Slide 30: SELECT * inside a view is resolved to the CONCRETE column list at CREATE VIEW time, not
-- re-checked every query — adding a column to the base table later does NOT make the view show it
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT * FROM Employee_Dep1 ORDER BY empSSN;
GO
ALTER TABLE tblEmployee ADD ghiChu NVARCHAR(100) NULL;
GO
UPDATE tblEmployee SET ghiChu = N'Nhân viên mới' WHERE empSSN = 30121050001;
GO
-- New column exists in the BASE TABLE ...
SELECT empSSN, ghiChu FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;
-- ... but the view's SELECT * was "frozen" at CREATE VIEW time — no ghiChu column here
SELECT * FROM Employee_Dep1 ORDER BY empSSN;
GO
EXEC sp_refreshview 'Employee_Dep1';
GO
-- After sp_refreshview, the view re-reads the base table's CURRENT column list — ghiChu now appears
SELECT * FROM Employee_Dep1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>ghiChu</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Nhân viên mới</td></tr>
<tr><td>30121050002</td><td><em>NULL</em></td></tr>
<tr><td>30121050003</td><td><em>NULL</em></td></tr>
<tr><td>30121050004</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>ghiChu</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>Nhân viên mới</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td><em>NULL</em></td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td><em>NULL</em></td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>After <code>ALTER TABLE tblEmployee ADD ghiChu …</code>, the base table clearly has the new column — a direct <code>SELECT empSSN, ghiChu FROM tblEmployee</code> shows it. But <code>SELECT * FROM Employee_Dep1</code> still returns the OLD 8 columns, no <code>ghiChu</code> anywhere — the view's <code>*</code> was frozen at CREATE VIEW time. Running <code>EXEC sp_refreshview 'Employee_Dep1'</code> forces SQL Server to re-read the base table's current columns and update the view's stored metadata — only then does <code>ghiChu</code> appear.</p>
<div class="pitfall">A production incident pattern: a team adds a column to a table, redeploys the app expecting every view that does <code>SELECT *</code> to pick it up automatically — and some do not, silently, until someone runs <code>sp_refreshview</code> (or drops and recreates the view). Prefer naming columns explicitly in a view's definition instead of <code>SELECT *</code>, precisely to avoid this invisible staleness.</div>`,
        `<p class="y-chinh">🎯 Bộ slide lặp lại Ví dụ 1 (giống slide 28) trước khi sang phần truy vấn nó — cùng view, cùng code, xem slide 28 để thấy lần chạy thật. Vì nó dựng bằng <code>SELECT *</code>, đây đúng là lúc để nói tới bẫy <code>SELECT *</code> trong view lớn nhất: thêm cột vào bảng gốc VỀ SAU không làm view tự thấy cột đó.</p>
<p>Không có gì mới trong định nghĩa ở đây: vẫn là <code>Employee_Dep1</code>. Nhưng có một cái bẫy thật ẩn trong việc "mở" (unfold, slide 29): SQL Server KHÔNG mở lại <code>*</code> mỗi lần truy vấn — nó dịch <code>SELECT *</code> thành danh sách CỤ THỂ các cột đang có tại thời điểm <code>CREATE VIEW</code> chạy, rồi lưu danh sách cố định đó làm metadata của view. View là khuôn mẫu cho TRUY VẤN, nhưng danh sách cột của nó bị đóng băng.</p>
<p class="nhan">Chứng minh: ALTER bảng gốc, rồi xem lại view</p>
<pre><code class="language-sql">-- Slide 30: SELECT * inside a view is resolved to the CONCRETE column list at CREATE VIEW time, not
-- re-checked every query — adding a column to the base table later does NOT make the view show it
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT * FROM Employee_Dep1 ORDER BY empSSN;
GO
ALTER TABLE tblEmployee ADD ghiChu NVARCHAR(100) NULL;
GO
UPDATE tblEmployee SET ghiChu = N'Nhân viên mới' WHERE empSSN = 30121050001;
GO
-- New column exists in the BASE TABLE ...
SELECT empSSN, ghiChu FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;
-- ... but the view's SELECT * was "frozen" at CREATE VIEW time — no ghiChu column here
SELECT * FROM Employee_Dep1 ORDER BY empSSN;
GO
EXEC sp_refreshview 'Employee_Dep1';
GO
-- After sp_refreshview, the view re-reads the base table's CURRENT column list — ghiChu now appears
SELECT * FROM Employee_Dep1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>ghiChu</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Nhân viên mới</td></tr>
<tr><td>30121050002</td><td><em>NULL</em></td></tr>
<tr><td>30121050003</td><td><em>NULL</em></td></tr>
<tr><td>30121050004</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)<br>
(1 row affected)<br>
(1 row affected)<br>
(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th><th>ghiChu</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td><td>Nhân viên mới</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td><td><em>NULL</em></td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td><td><em>NULL</em></td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<p>Sau <code>ALTER TABLE tblEmployee ADD ghiChu …</code>, bảng gốc rõ ràng đã có cột mới — truy vấn trực tiếp <code>SELECT empSSN, ghiChu FROM tblEmployee</code> thấy nó. Nhưng <code>SELECT * FROM Employee_Dep1</code> vẫn trả về 8 cột CŨ, không hề có <code>ghiChu</code> — <code>*</code> của view đã bị đóng băng từ lúc CREATE VIEW. Chạy <code>EXEC sp_refreshview 'Employee_Dep1'</code> buộc SQL Server đọc lại danh sách cột hiện tại của bảng gốc và cập nhật metadata đã lưu của view — chỉ khi đó <code>ghiChu</code> mới xuất hiện.</p>
<div class="pitfall">Một kiểu sự cố production có thật: một đội thêm cột vào bảng, deploy lại app kỳ vọng mọi view dùng <code>SELECT *</code> tự thấy cột đó — và một số view không thấy, lặng lẽ, cho tới khi ai đó chạy <code>sp_refreshview</code> (hoặc xoá rồi tạo lại view). Nên đặt tên cột rõ ràng trong định nghĩa view thay vì <code>SELECT *</code>, chính là để tránh sự lỗi thời vô hình này.</div>`],
      [31, 'Querying Views (Example 2)',
        `<p class="y-chinh">🎯 Example 2: querying department-1 employees directly vs. through the view — identical results. And a second trap right next to the first: a view is defined as a SET of rows, with no built-in order, so a bare ORDER BY inside a view's own definition is refused outright.</p>
<pre><code class="language-sql">-- Slide 31 · Example 2: querying through the view vs. querying the base table directly — same result
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT * FROM tblEmployee te WHERE te.depNum = 1 ORDER BY te.empSSN;
GO
SELECT * FROM Employee_Dep1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p><code>SELECT * FROM tblEmployee te WHERE te.depNum = 1</code> and <code>SELECT * FROM Employee_Dep1</code> return the exact same 4 rows. The view didn't add any new capability here — it just saved you from retyping the <code>WHERE</code> clause every time.</p>
<p class="nhan">The ORDER BY trap — proven with a real error</p>
<pre><code class="language-sql">-- Slide 31: a bare ORDER BY inside a view definition is refused — a view is a SET, order is not part of it
CREATE VIEW Employee_Dep1_Sorted AS
SELECT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSalary DESC;
GO
-- The classic (old) workaround: TOP 100 PERCENT technically satisfies the rule, but SQL Server still
-- does NOT guarantee the order is kept when the view is later queried — do the ORDER BY outside instead
CREATE VIEW Employee_Dep1_Sorted AS
SELECT TOP (100) PERCENT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSalary DESC;
GO
SELECT empSSN, empSalary FROM Employee_Dep1_Sorted;</code></pre>
<div class="out"><b>Msg 1033, Level 15, State 1<br>
The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table expressions, unless TOP, OFFSET or FOR XML is also specified.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>150000</td></tr>
<tr><td>30121050002</td><td>90000</td></tr>
<tr><td>30121050003</td><td>60000</td></tr>
<tr><td>30121050004</td><td>45000</td></tr>
</tbody>
</table>
<p><code>CREATE VIEW … AS SELECT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSalary DESC</code> is refused with <strong>Msg 1033</strong>: "The ORDER BY clause is invalid in views… unless TOP, OFFSET or FOR XML is also specified." The relational model (Chapter 2) defines a relation — and a view is just a relation — as a SET of rows with no inherent order; <code>ORDER BY</code> belongs to how you DISPLAY a result, not to what the data IS. Adding <code>TOP (100) PERCENT</code> is the classic old workaround that satisfies the rule (<code>TOP</code> is now "also specified"), but Microsoft's own documentation warns the resulting order is <strong>not guaranteed</strong> to survive when someone later queries the view with their own <code>WHERE</code>/<code>JOIN</code>/<code>ORDER BY</code>.</p>
<p class="pitfall">Never rely on a view's internal <code>ORDER BY</code> (even with the <code>TOP 100 PERCENT</code> trick) for correctness. If order matters, put <code>ORDER BY</code> on the OUTER query that selects from the view — exactly like slides 28 and 31's own real examples already do.</p>`,
        `<p class="y-chinh">🎯 Ví dụ 2: truy vấn nhân viên phòng 1 trực tiếp so với qua view — kết quả giống hệt nhau. Và một cái bẫy thứ hai ngay cạnh bẫy đầu: view được định nghĩa là một TẬP HỢP các dòng, không có thứ tự sẵn có, nên một ORDER BY trơn bên trong chính định nghĩa view bị từ chối thẳng.</p>
<pre><code class="language-sql">-- Slide 31 · Example 2: querying through the view vs. querying the base table directly — same result
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT * FROM tblEmployee te WHERE te.depNum = 1 ORDER BY te.empSSN;
GO
SELECT * FROM Employee_Dep1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<p><code>SELECT * FROM tblEmployee te WHERE te.depNum = 1</code> và <code>SELECT * FROM Employee_Dep1</code> trả về đúng 4 dòng giống hệt. View ở đây không thêm khả năng gì mới — nó chỉ giúp bạn khỏi phải gõ lại <code>WHERE</code> mỗi lần.</p>
<p class="nhan">Bẫy ORDER BY — chứng minh bằng một lỗi thật</p>
<pre><code class="language-sql">-- Slide 31: a bare ORDER BY inside a view definition is refused — a view is a SET, order is not part of it
CREATE VIEW Employee_Dep1_Sorted AS
SELECT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSalary DESC;
GO
-- The classic (old) workaround: TOP 100 PERCENT technically satisfies the rule, but SQL Server still
-- does NOT guarantee the order is kept when the view is later queried — do the ORDER BY outside instead
CREATE VIEW Employee_Dep1_Sorted AS
SELECT TOP (100) PERCENT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSalary DESC;
GO
SELECT empSSN, empSalary FROM Employee_Dep1_Sorted;</code></pre>
<div class="out"><b>Msg 1033, Level 15, State 1<br>
The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table expressions, unless TOP, OFFSET or FOR XML is also specified.</b></div>
<table>
<thead><tr><th>empSSN</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>150000</td></tr>
<tr><td>30121050002</td><td>90000</td></tr>
<tr><td>30121050003</td><td>60000</td></tr>
<tr><td>30121050004</td><td>45000</td></tr>
</tbody>
</table>
<p><code>CREATE VIEW … AS SELECT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSalary DESC</code> bị từ chối với <strong>Msg 1033</strong>: "The ORDER BY clause is invalid in views… unless TOP, OFFSET or FOR XML is also specified." Mô hình quan hệ (Chương 2) định nghĩa một quan hệ — và view chỉ là một quan hệ — là một TẬP HỢP các dòng không có thứ tự vốn có; <code>ORDER BY</code> thuộc về cách bạn HIỂN THỊ kết quả, không thuộc về BẢN CHẤT dữ liệu. Thêm <code>TOP (100) PERCENT</code> là mẹo cũ kinh điển để lách luật (<code>TOP</code> giờ "cũng được chỉ định"), nhưng chính tài liệu Microsoft cảnh báo thứ tự kết quả đó <strong>không được đảm bảo</strong> sống sót khi sau này ai đó truy vấn view với <code>WHERE</code>/<code>JOIN</code>/<code>ORDER BY</code> riêng của họ.</p>
<p class="pitfall">Đừng bao giờ dựa vào ORDER BY bên trong một view (kể cả mẹo <code>TOP 100 PERCENT</code>) để đảm bảo đúng thứ tự. Nếu thứ tự quan trọng, đặt <code>ORDER BY</code> ở truy vấn BÊN NGOÀI chọn từ view — đúng như chính các ví dụ thật ở slide 28 và 31 đã làm.</p>`],
      [32, 'Querying Views (dependents through a view)',
        `<p class="y-chinh">🎯 Find all dependents of department-1 employees: joining through the view, or the exactly equivalent subquery.</p>
<pre><code class="language-sql">-- Slide 32: find all dependents of department-1 employees — through the view, and the equivalent subquery
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT ed1.empSSN, ed1.empName, d.depName AS 'Người phụ thuộc', d.depRelationship
FROM Employee_Dep1 ed1, tblDependent d
WHERE ed1.empSSN = d.empSSN
ORDER BY ed1.empSSN, d.depName;
GO
SELECT ed1.empSSN, ed1.empName, d.depName AS 'Người phụ thuộc', d.depRelationship
FROM (SELECT * FROM tblEmployee WHERE depNum = 1) ed1, tblDependent d
WHERE ed1.empSSN = d.empSSN
ORDER BY ed1.empSSN, d.depName;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>Người phụ thuộc</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Phạm Thị Hoa</td><td>Vợ</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Trần Minh Khang</td><td>Con trai</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>Nguyễn Văn Bình</td><td>Chồng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>Người phụ thuộc</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Phạm Thị Hoa</td><td>Vợ</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Trần Minh Khang</td><td>Con trai</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>Nguyễn Văn Bình</td><td>Chồng</td></tr>
</tbody>
</table>
<p><code>FROM Employee_Dep1 ed1, tblDependent d WHERE ed1.empSSN = d.empSSN</code> and <code>FROM (SELECT * FROM tblEmployee WHERE depNum=1) ed1, tblDependent d WHERE …</code> produce the same 3 rows — the view IS literally that subquery, just given a name. This is the real value of a view: hiding a repeated subquery behind a short, readable name.</p>`,
        `<p class="y-chinh">🎯 Tìm mọi người phụ thuộc của nhân viên phòng 1: join qua view, hoặc truy vấn con tương đương y hệt.</p>
<pre><code class="language-sql">-- Slide 32: find all dependents of department-1 employees — through the view, and the equivalent subquery
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT * FROM tblEmployee WHERE depNum = 1;
GO
SELECT ed1.empSSN, ed1.empName, d.depName AS 'Người phụ thuộc', d.depRelationship
FROM Employee_Dep1 ed1, tblDependent d
WHERE ed1.empSSN = d.empSSN
ORDER BY ed1.empSSN, d.depName;
GO
SELECT ed1.empSSN, ed1.empName, d.depName AS 'Người phụ thuộc', d.depRelationship
FROM (SELECT * FROM tblEmployee WHERE depNum = 1) ed1, tblDependent d
WHERE ed1.empSSN = d.empSSN
ORDER BY ed1.empSSN, d.depName;</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>Người phụ thuộc</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Phạm Thị Hoa</td><td>Vợ</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Trần Minh Khang</td><td>Con trai</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>Nguyễn Văn Bình</td><td>Chồng</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>Người phụ thuộc</th><th>depRelationship</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Phạm Thị Hoa</td><td>Vợ</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Trần Minh Khang</td><td>Con trai</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>Nguyễn Văn Bình</td><td>Chồng</td></tr>
</tbody>
</table>
<p><code>FROM Employee_Dep1 ed1, tblDependent d WHERE ed1.empSSN = d.empSSN</code> và <code>FROM (SELECT * FROM tblEmployee WHERE depNum=1) ed1, tblDependent d WHERE …</code> cho ra cùng 3 dòng — view CHÍNH LÀ truy vấn con đó, chỉ được đặt tên. Đây là giá trị thật của view: giấu một truy vấn con hay lặp lại đằng sau một cái tên ngắn, dễ đọc.</p>`],
      [33, 'Renaming Attributes (Example 3)',
        `<p class="y-chinh">🎯 Example 3: a view can rename columns and add computed ones (age from birth date, a CASE for sex).</p>
<pre><code class="language-sql">-- Slide 33 · Example 3: a view that renames and computes columns
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT te.empSSN AS 'Mã số nhân viên', te.empName AS 'Họ và tên',
       YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi',
       te.empSalary AS 'Lương',
       CASE WHEN te.empSex = 'F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'
FROM tblEmployee te WHERE te.depNum = 1;
GO
SELECT * FROM Employee_Dep1 ORDER BY [Mã số nhân viên];</code></pre>
<table>
<thead><tr><th>Mã số nhân viên</th><th>Họ và tên</th><th>Tuổi</th><th>Lương</th><th>Giới tính</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>58</td><td>150000</td><td>Nam</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>41</td><td>90000</td><td>Nữ</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>36</td><td>60000</td><td>Nam</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>31</td><td>45000</td><td>Nữ</td></tr>
</tbody>
</table>
<p><code>te.empSSN AS 'Mã số nhân viên'</code>, a computed <code>YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi'</code>, and <code>CASE WHEN te.empSex='F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'</code> — the view's output columns don't have to match the base table's names or even be real columns at all. This view is friendly to show a non-technical user, but — spoiler for slide 40 — it is no longer updatable, because of that computed 'Tuổi' column.</p>`,
        `<p class="y-chinh">🎯 Ví dụ 3: view đổi tên cột được và thêm cả cột tính toán (tuổi từ ngày sinh, CASE cho giới tính).</p>
<pre><code class="language-sql">-- Slide 33 · Example 3: a view that renames and computes columns
IF OBJECT_ID('Employee_Dep1','V') IS NOT NULL DROP VIEW Employee_Dep1;
GO
CREATE VIEW Employee_Dep1 AS
SELECT te.empSSN AS 'Mã số nhân viên', te.empName AS 'Họ và tên',
       YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi',
       te.empSalary AS 'Lương',
       CASE WHEN te.empSex = 'F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'
FROM tblEmployee te WHERE te.depNum = 1;
GO
SELECT * FROM Employee_Dep1 ORDER BY [Mã số nhân viên];</code></pre>
<table>
<thead><tr><th>Mã số nhân viên</th><th>Họ và tên</th><th>Tuổi</th><th>Lương</th><th>Giới tính</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>58</td><td>150000</td><td>Nam</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>41</td><td>90000</td><td>Nữ</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>36</td><td>60000</td><td>Nam</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>31</td><td>45000</td><td>Nữ</td></tr>
</tbody>
</table>
<p><code>te.empSSN AS 'Mã số nhân viên'</code>, cột tính <code>YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi'</code>, và <code>CASE WHEN te.empSex='F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'</code> — cột đầu ra của view không cần trùng tên bảng gốc, thậm chí không cần là cột thật. View này thân thiện để cho người không rành kỹ thuật xem, nhưng — hé lộ trước cho slide 40 — nó không còn cập nhật được nữa, vì cột 'Tuổi' tính toán đó.</p>`],
      [34, 'Modifying Views',
        `<p class="y-chinh">🎯 With updatable views, a modification is translated into an equivalent modification on the base table — the change really happens on the base table.</p>
<p>This is the mental model for the next few slides: an <code>INSERT</code>/<code>UPDATE</code> sent to an updatable view is not stored "in the view" (there is nowhere to store it — a view has no data of its own); SQL Server rewrites it into the matching change on the real, underlying table. Slides 37–40 make this concrete, including two cases where the rewrite goes wrong or is refused.</p>`,
        `<p class="y-chinh">🎯 Với view cập nhật được, một sửa đổi được dịch thành sửa đổi tương đương trên bảng gốc — thay đổi thật sự xảy ra trên bảng gốc.</p>
<p>Đây là mô hình tư duy cho vài slide tiếp theo: một <code>INSERT</code>/<code>UPDATE</code> gửi tới view cập nhật được không được lưu "trong view" (không có chỗ nào để lưu — view không có dữ liệu riêng); SQL Server dịch nó thành thay đổi tương ứng trên bảng thật đằng sau. Slide 37–40 làm rõ điều này bằng ví dụ, kể cả hai trường hợp việc dịch đi sai hoặc bị từ chối.</p>`],
      [35, 'View Removal',
        `<p class="y-chinh">🎯 DROP VIEW only deletes the view's definition — it never touches the base table. DROP TABLE on the base table makes the view unusable, though the view's definition technically still "exists".</p>
<pre><code class="language-sql">-- Slide 35: dropping a VIEW never touches the base table; dropping the base table breaks the view
-- (a standalone table here — tblEmployee in FUHCompany has foreign keys pointing at it and cannot be dropped directly)
CREATE TABLE dbo.NhanVienDemo (id INT NOT NULL CONSTRAINT pk_nvdemo PRIMARY KEY, ten NVARCHAR(50), phong INT);
INSERT INTO dbo.NhanVienDemo VALUES (1, N'Trần Minh Quang', 1), (2, N'Hoàng Thị Hà', 1), (3, N'Nguyễn Thị Mai', 3);
GO
CREATE VIEW NhanVien_Phong1 AS
SELECT * FROM dbo.NhanVienDemo WHERE phong = 1;
GO
DROP VIEW NhanVien_Phong1;
GO
-- The base table is untouched
SELECT COUNT(*) AS con_du_du_lieu FROM dbo.NhanVienDemo;
GO
CREATE VIEW NhanVien_Phong1 AS
SELECT * FROM dbo.NhanVienDemo WHERE phong = 1;
GO
DROP TABLE dbo.NhanVienDemo;
GO
-- The view still "exists" as a definition, but is now unusable
SELECT * FROM NhanVien_Phong1;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>con_du_du_lieu</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 208, Level 16, State 1<br>
Invalid object name 'dbo.NhanVienDemo'.</b><br>
<b>Msg 4413, Level 16, State 1<br>
Could not use view or function 'NhanVien_Phong1' because of binding errors.</b></div>
<p>After <code>DROP VIEW NhanVien_Phong1</code>, the base table <code>NhanVienDemo</code> still holds all 3 rows — completely unaffected. After re-creating the view and then <code>DROP TABLE dbo.NhanVienDemo</code>, querying the view fails: <code>Invalid object name</code> for the table, then <code>Could not use view … because of binding errors</code> for the view. The view object is still technically registered, but it can never run again until a matching table exists.</p>`,
        `<p class="y-chinh">🎯 DROP VIEW chỉ xoá định nghĩa của view — không bao giờ đụng tới bảng gốc. DROP TABLE trên bảng gốc làm view không dùng được nữa, dù định nghĩa của view kỹ thuật vẫn "còn đó".</p>
<pre><code class="language-sql">-- Slide 35: dropping a VIEW never touches the base table; dropping the base table breaks the view
-- (a standalone table here — tblEmployee in FUHCompany has foreign keys pointing at it and cannot be dropped directly)
CREATE TABLE dbo.NhanVienDemo (id INT NOT NULL CONSTRAINT pk_nvdemo PRIMARY KEY, ten NVARCHAR(50), phong INT);
INSERT INTO dbo.NhanVienDemo VALUES (1, N'Trần Minh Quang', 1), (2, N'Hoàng Thị Hà', 1), (3, N'Nguyễn Thị Mai', 3);
GO
CREATE VIEW NhanVien_Phong1 AS
SELECT * FROM dbo.NhanVienDemo WHERE phong = 1;
GO
DROP VIEW NhanVien_Phong1;
GO
-- Bảng gốc không hề bị ảnh hưởng
SELECT COUNT(*) AS con_du_du_lieu FROM dbo.NhanVienDemo;
GO
CREATE VIEW NhanVien_Phong1 AS
SELECT * FROM dbo.NhanVienDemo WHERE phong = 1;
GO
DROP TABLE dbo.NhanVienDemo;
GO
-- view vẫn "tồn tại" như định nghĩa, nhưng không dùng được nữa
SELECT * FROM NhanVien_Phong1;</code></pre>
<div class="out">(3 rows affected)</div>
<table>
<thead><tr><th>con_du_du_lieu</th></tr></thead>
<tbody>
<tr><td>3</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 208, Level 16, State 1<br>
Invalid object name 'dbo.NhanVienDemo'.</b><br>
<b>Msg 4413, Level 16, State 1<br>
Could not use view or function 'NhanVien_Phong1' because of binding errors.</b></div>
<p>Sau <code>DROP VIEW NhanVien_Phong1</code>, bảng gốc <code>NhanVienDemo</code> vẫn giữ đủ 3 dòng — hoàn toàn không bị ảnh hưởng. Sau khi tạo lại view rồi <code>DROP TABLE dbo.NhanVienDemo</code>, truy vấn view thất bại: <code>Invalid object name</code> cho bảng, rồi <code>Could not use view … because of binding errors</code> cho view. Đối tượng view kỹ thuật vẫn còn đăng ký, nhưng không bao giờ chạy được nữa cho tới khi có một bảng khớp.</p>`],
      [36, 'Updatable Views',
        `<p class="y-chinh">🎯 Four rules for a view built on ONE relation R to be updatable: the subquery starts with SELECT (not SELECT DISTINCT), WHERE never refers back to R in a sub-subquery, FROM has exactly one occurrence of R and nothing else, and SELECT lists enough attributes to fill the rest with NULL/defaults.</p>
<table>
<thead><tr><th>Rule</th><th>What it rules out</th></tr></thead>
<tbody>
<tr><td><code>SELECT</code>, not <code>SELECT DISTINCT</code></td><td>DISTINCT can merge several base rows into one view row — no single row to update</td></tr>
<tr><td><code>WHERE</code> clause has no sub-subquery referring to R</td><td>prevents circular, ambiguous updates</td></tr>
<tr><td><code>FROM</code> has exactly one occurrence of R, nothing else</td><td>a join (two tables) can't unambiguously receive one new row (slide 40's kind of case, in the practice exercises)</td></tr>
<tr><td><code>SELECT</code> list has enough columns to fill the rest with NULL/DEFAULT</td><td>a computed column (like slide 33's 'Tuổi') has no base column to write into</td></tr>
</tbody>
</table>
<p>These are the ANSI-SQL rules the textbook lists; SQL Server's actual engine is a little more permissive in places and a little stricter in others (e.g. it explicitly refuses any computed/derived column in an INSERT, as we prove on slide 40 — Msg 4406) — treat this table as the mental model, and the real Msg numbers on the next slides as ground truth.</p>
<div class="callout">🐘 <strong>On PostgreSQL</strong> a view is automatically <strong>"simply updatable"</strong> when it satisfies almost the same conditions (one table, no DISTINCT/GROUP BY/aggregate/set operation/subquery in the select list) — no special keyword needed. What PostgreSQL adds that T-SQL's Example 1 view never used is <code>WITH CHECK OPTION</code>: reject any write through the view that would create a row the view itself could not then see:
<pre><code class="language-sql">-- WITH CHECK OPTION (PostgreSQL and T-SQL both have it — the slide's example never used it): reject any
-- INSERT/UPDATE through the view that would produce a row the view itself would then not show
CREATE VIEW employee_dep1_checked AS
SELECT * FROM tblemployee WHERE depnum = 1
WITH CHECK OPTION;

-- Refused: depnum = 2 does not satisfy the view's own WHERE
INSERT INTO employee_dep1_checked (empssn, empname, empsalary, empsex, depnum)
  VALUES (100010, 'Ngô Văn Test', 50000, 'M', 2);</code></pre>
<div class="out"><b>ERROR:  new row violates check option for view "employee_dep1_checked"</b></div>
And the same clause exists in T-SQL too — proved on FUHCompany in the practice exercises. Lesson: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-3-view">PostgreSQL 12.3 — views</a>.</div>`,
        `<p class="y-chinh">🎯 Bốn luật để một view dựng trên MỘT quan hệ R cập nhật được: truy vấn con bắt đầu bằng SELECT (không phải SELECT DISTINCT), WHERE không tham chiếu lại R trong một truy vấn con lồng, FROM có đúng một lần R và không gì khác, và SELECT liệt kê đủ thuộc tính để phần còn lại điền được NULL/mặc định.</p>
<table>
<thead><tr><th>Luật</th><th>Loại trừ điều gì</th></tr></thead>
<tbody>
<tr><td><code>SELECT</code>, không phải <code>SELECT DISTINCT</code></td><td>DISTINCT có thể gộp nhiều dòng gốc thành một dòng view — không còn một dòng duy nhất để cập nhật</td></tr>
<tr><td>Mệnh đề <code>WHERE</code> không có truy vấn con lồng tham chiếu lại R</td><td>ngăn cập nhật vòng tròn, mơ hồ</td></tr>
<tr><td><code>FROM</code> có đúng một lần R, không gì khác</td><td>một join (hai bảng) không thể nhận rõ ràng một dòng mới (kiểu tình huống ở slide 40, trong bài thực hành)</td></tr>
<tr><td>Danh sách <code>SELECT</code> đủ cột để phần còn lại điền NULL/DEFAULT</td><td>một cột tính toán (như 'Tuổi' ở slide 33) không có cột gốc nào để ghi vào</td></tr>
</tbody>
</table>
<p>Đây là các luật ANSI-SQL mà giáo trình liệt kê; engine thật của SQL Server ở vài chỗ dễ tính hơn và ở vài chỗ chặt hơn (ví dụ nó từ chối thẳng thừng mọi cột tính toán/dẫn xuất trong INSERT, như ta chứng minh ở slide 40 — Msg 4406) — coi bảng này là mô hình tư duy, và số Msg thật ở các slide sau là sự thật nền.</p>
<div class="callout">🐘 <strong>Trên PostgreSQL</strong> một view tự động <strong>"cập nhật được đơn giản"</strong> khi thoả gần như cùng điều kiện (một bảng, không DISTINCT/GROUP BY/hàm gộp/phép tập hợp/truy vấn con trong danh sách chọn) — không cần từ khoá đặc biệt. Thứ PostgreSQL có thêm mà view Ví dụ 1 của T-SQL chưa dùng là <code>WITH CHECK OPTION</code>: từ chối mọi ghi qua view sẽ tạo ra một dòng mà chính view sau đó không thấy được:
<pre><code class="language-sql">-- WITH CHECK OPTION (PostgreSQL and T-SQL both have it — the slide's example never used it): reject any
-- INSERT/UPDATE through the view that would produce a row the view itself would then not show
CREATE VIEW employee_dep1_checked AS
SELECT * FROM tblemployee WHERE depnum = 1
WITH CHECK OPTION;

-- Refused: depnum = 2 does not satisfy the view's own WHERE
INSERT INTO employee_dep1_checked (empssn, empname, empsalary, empsex, depnum)
  VALUES (100010, 'Ngô Văn Test', 50000, 'M', 2);</code></pre>
<div class="out"><b>ERROR:  new row violates check option for view "employee_dep1_checked"</b></div>
Và mệnh đề y hệt cũng có trong T-SQL — chứng minh trên FUHCompany ở bài thực hành. Bài liên quan: <a href="/courses/postgresql/learn?lessonSlug=postgresql-12-3-view">PostgreSQL 12.3 — view</a>.</div>`],
      [37, 'Updatable Views (Example 4)',
        `<p class="y-chinh">🎯 Example 4 setup: create a view from tblEmployee, then try three directions — change the table and look at the view, and change the view and look at the table (two ways, one working cleanly, one going wrong). Before that: exactly what conditions must a view meet to be updatable at all, and a real UPDATE that succeeds next to one that is refused, on the SAME base row.</p>
<p>The view for all three following slides: <code>Employee_Dep1v2</code> — deliberately missing <code>depNum</code> from its column list (only <code>empSSN, empName, empSalary, empSex</code>), which is exactly what makes slide 39 surprising.</p>
<pre><code class="language-sql">CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;</code></pre>
<p class="nhan">Recap — when is a view updatable at all? (slide 36's rules, as a checklist)</p>
<table>
<thead><tr><th>Condition</th><th><code>Employee_Dep1v2</code> (this slide)</th><th><code>Employee_Dep1v3</code> (slide 33, reused below)</th></tr></thead>
<tbody>
<tr><td>Built on exactly ONE base table</td><td>✅ <code>tblEmployee</code> only</td><td>✅ <code>tblEmployee</code> only</td></tr>
<tr><td>No <code>DISTINCT</code></td><td>✅</td><td>✅</td></tr>
<tr><td>No <code>GROUP BY</code> / aggregate function (<code>SUM</code>, <code>COUNT</code>…)</td><td>✅</td><td>✅</td></tr>
<tr><td>No computed/derived column in the SELECT list</td><td>✅ every column is a real, renamed column</td><td>❌ <code>'Tuổi'</code> is <code>YEAR(GETDATE()) - YEAR(empBirthdate)</code></td></tr>
</tbody>
</table>
<p class="nhan">Proof: UPDATE a plain column succeeds; UPDATE a computed column is refused — same table, same row</p>
<pre><code class="language-sql">-- Slide 37: UPDATE through a simple, single-table view (no DISTINCT/GROUP BY/aggregate/computed column)
-- succeeds; UPDATE that touches a COMPUTED column ITSELF through a view is refused
CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;
GO
CREATE VIEW Employee_Dep1v3 AS
SELECT te.empSSN AS 'Mã số nhân viên', te.empName AS 'Họ và tên',
       YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi',
       te.empSalary AS 'Lương',
       CASE WHEN te.empSex = 'F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'
FROM tblEmployee te WHERE te.depNum = 1;
GO
-- Simple view, real column, no computation involved — succeeds
UPDATE Employee_Dep1v2 SET empSalary = 95000 WHERE empSSN = 30121050004;
SELECT empSSN, empSalary FROM tblEmployee WHERE empSSN = 30121050004;
GO
-- Also succeeds: 'Lương' in Employee_Dep1v3 is only a RENAME of a real column (empSalary) — SQL Server
-- can still trace it back to one base-table column, even though the SAME view also has a computed 'Tuổi'
UPDATE Employee_Dep1v3 SET [Lương] = 96000 WHERE [Mã số nhân viên] = 30121050004;
SELECT empSalary FROM tblEmployee WHERE empSSN = 30121050004;
GO
-- Refused: this UPDATE targets the COMPUTED column itself ('Tuổi' = YEAR(GETDATE()) - YEAR(empBirthdate))
-- — there is no base-table column to write "Tuổi" back into
UPDATE Employee_Dep1v3 SET [Tuổi] = 99 WHERE [Mã số nhân viên] = 30121050004;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050004</td><td>95000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSalary</th></tr></thead>
<tbody>
<tr><td>96000</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 4406, Level 16, State 1<br>
Update or insert of view or function 'Employee_Dep1v3' failed because it contains a derived or constant field.</b></div>
<p>Two real successes first: <code>UPDATE Employee_Dep1v2 SET empSalary = 95000 …</code> works — a real column, unambiguous. Then, more surprisingly, <code>UPDATE Employee_Dep1v3 SET [Lương] = 96000 …</code> ALSO succeeds, even though this view has a computed <code>'Tuổi'</code> column elsewhere — because <code>'Lương'</code> itself is just a rename of <code>empSalary</code>, and SQL Server only cares whether the COLUMN YOU ARE SETTING traces back to one real column, not whether some OTHER column in the same view happens to be computed. Only the third statement, <code>UPDATE Employee_Dep1v3 SET [Tuổi] = 99 …</code>, is refused (Msg 4406) — because THIS time you are trying to write into the computed column itself, and there is genuinely no base-table column to store "Tuổi" in.</p>
<p class="meo">🧠 The real rule is finer than "a view with any computed column is entirely non-updatable": it is "you cannot write to the computed column ITSELF." Slide 40's INSERT is stricter still — INSERT must supply (or default) every column at once, so a single computed column blocks the whole statement; UPDATE only blocks the columns it actually targets.</p>`,
        `<p class="y-chinh">🎯 Chuẩn bị Ví dụ 4: tạo view từ tblEmployee, rồi thử ba hướng — đổi bảng và xem view, và đổi view rồi xem bảng (hai kiểu, một kiểu chạy sạch, một kiểu đi sai). Trước đó: chính xác view phải thoả điều kiện gì mới cập nhật được, và một UPDATE thật thành công đặt cạnh một UPDATE bị từ chối, trên CÙNG một dòng bảng gốc.</p>
<p>View dùng cho cả ba slide sau: <code>Employee_Dep1v2</code> — cố tình THIẾU <code>depNum</code> trong danh sách cột (chỉ có <code>empSSN, empName, empSalary, empSex</code>), đúng là thứ làm slide 39 gây bất ngờ.</p>
<pre><code class="language-sql">CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;</code></pre>
<p class="nhan">Nhắc lại — khi nào một view cập nhật được? (luật ở slide 36, dạng bảng kiểm)</p>
<table>
<thead><tr><th>Điều kiện</th><th><code>Employee_Dep1v2</code> (slide này)</th><th><code>Employee_Dep1v3</code> (slide 33, dùng lại dưới đây)</th></tr></thead>
<tbody>
<tr><td>Dựng trên ĐÚNG MỘT bảng gốc</td><td>✅ chỉ <code>tblEmployee</code></td><td>✅ chỉ <code>tblEmployee</code></td></tr>
<tr><td>Không <code>DISTINCT</code></td><td>✅</td><td>✅</td></tr>
<tr><td>Không <code>GROUP BY</code> / hàm gộp (<code>SUM</code>, <code>COUNT</code>…)</td><td>✅</td><td>✅</td></tr>
<tr><td>Không có cột tính toán/dẫn xuất trong danh sách SELECT</td><td>✅ mọi cột là cột thật, chỉ đổi tên</td><td>❌ <code>'Tuổi'</code> là <code>YEAR(GETDATE()) - YEAR(empBirthdate)</code></td></tr>
</tbody>
</table>
<p class="nhan">Chứng minh: UPDATE một cột trơn thành công; UPDATE một cột tính toán bị từ chối — cùng bảng, cùng dòng</p>
<pre><code class="language-sql">-- Slide 37: UPDATE through a simple, single-table view (no DISTINCT/GROUP BY/aggregate/computed column)
-- succeeds; UPDATE that touches a COMPUTED column ITSELF through a view is refused
CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;
GO
CREATE VIEW Employee_Dep1v3 AS
SELECT te.empSSN AS 'Mã số nhân viên', te.empName AS 'Họ và tên',
       YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi',
       te.empSalary AS 'Lương',
       CASE WHEN te.empSex = 'F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'
FROM tblEmployee te WHERE te.depNum = 1;
GO
-- Simple view, real column, no computation involved — succeeds
UPDATE Employee_Dep1v2 SET empSalary = 95000 WHERE empSSN = 30121050004;
SELECT empSSN, empSalary FROM tblEmployee WHERE empSSN = 30121050004;
GO
-- Also succeeds: 'Lương' in Employee_Dep1v3 is only a RENAME of a real column (empSalary) — SQL Server
-- can still trace it back to one base-table column, even though the SAME view also has a computed 'Tuổi'
UPDATE Employee_Dep1v3 SET [Lương] = 96000 WHERE [Mã số nhân viên] = 30121050004;
SELECT empSalary FROM tblEmployee WHERE empSSN = 30121050004;
GO
-- Refused: this UPDATE targets the COMPUTED column itself ('Tuổi' = YEAR(GETDATE()) - YEAR(empBirthdate))
-- — there is no base-table column to write "Tuổi" back into
UPDATE Employee_Dep1v3 SET [Tuổi] = 99 WHERE [Mã số nhân viên] = 30121050004;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empSalary</th></tr></thead>
<tbody>
<tr><td>30121050004</td><td>95000</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSalary</th></tr></thead>
<tbody>
<tr><td>96000</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 4406, Level 16, State 1<br>
Update or insert of view or function 'Employee_Dep1v3' failed because it contains a derived or constant field.</b></div>
<p>Hai thành công thật trước: <code>UPDATE Employee_Dep1v2 SET empSalary = 95000 …</code> chạy được — cột thật, không mơ hồ. Rồi, bất ngờ hơn, <code>UPDATE Employee_Dep1v3 SET [Lương] = 96000 …</code> CŨNG thành công, dù view này có cột <code>'Tuổi'</code> tính toán ở chỗ khác — vì <code>'Lương'</code> tự nó chỉ là đổi tên của <code>empSalary</code>, và SQL Server chỉ quan tâm CỘT BẠN ĐANG SET có chỉ rõ được về một cột thật hay không, không quan tâm một cột KHÁC trong cùng view có tính toán hay không. Chỉ câu thứ ba, <code>UPDATE Employee_Dep1v3 SET [Tuổi] = 99 …</code>, bị từ chối (Msg 4406) — vì lần này bạn đang cố ghi vào chính cột tính toán, và thật sự không có cột bảng gốc nào để lưu "Tuổi" vào.</p>
<p class="meo">🧠 Luật thật tinh hơn "view có cột tính toán bất kỳ thì hoàn toàn không cập nhật được": nó là "bạn không ghi được vào CHÍNH cột tính toán đó." INSERT ở slide 40 còn chặt hơn — INSERT phải đưa (hoặc để mặc định) giá trị cho MỌI cột cùng lúc, nên chỉ một cột tính toán đã chặn cả câu lệnh; UPDATE chỉ chặn đúng những cột nó thật sự nhắm tới.</p>`],
      [38, 'Update on table effects on view',
        `<p class="y-chinh">🎯 Insert into the BASE TABLE — the view, which is just a live query, immediately shows it too.</p>
<pre><code class="language-sql">-- Slide 36-38 · Example 4 part 1: a simple, updatable view. Insert into the BASE TABLE, the view sees it too
CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;
GO
INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum)
  VALUES (100000, N'Lê Văn Tám', 100000, 'M', 1);
GO
SELECT * FROM tblEmployee te WHERE te.depNum = 1 ORDER BY te.empSSN;
GO
SELECT * FROM Employee_Dep1v2 ORDER BY empSSN;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>100000</td><td>Lê Văn Tám</td><td><em>NULL</em></td><td>100000</td><td>M</td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empSex</th></tr></thead>
<tbody>
<tr><td>100000</td><td>Lê Văn Tám</td><td>100000</td><td>M</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td><td>M</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td><td>F</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>60000</td><td>M</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>45000</td><td>F</td></tr>
</tbody>
</table>
<p><code>INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (100000, N'Lê Văn Tám', 100000, 'M', 1)</code> — a normal insert into the real table. Both the base-table query and <code>SELECT * FROM Employee_Dep1v2</code> now list SSN 100000: a view has no cache to refresh, it is recomputed live every time.</p>`,
        `<p class="y-chinh">🎯 Chèn vào BẢNG GỐC — view, vốn chỉ là một truy vấn sống, lập tức thấy luôn.</p>
<pre><code class="language-sql">-- Slide 36-38 · Example 4 part 1: a simple, updatable view. Insert into the BASE TABLE, the view sees it too
CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;
GO
INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum)
  VALUES (100000, N'Lê Văn Tám', 100000, 'M', 1);
GO
SELECT * FROM tblEmployee te WHERE te.depNum = 1 ORDER BY te.empSSN;
GO
SELECT * FROM Employee_Dep1v2 ORDER BY empSSN;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>100000</td><td>Lê Văn Tám</td><td><em>NULL</em></td><td>100000</td><td>M</td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empSex</th></tr></thead>
<tbody>
<tr><td>100000</td><td>Lê Văn Tám</td><td>100000</td><td>M</td></tr>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>150000</td><td>M</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>90000</td><td>F</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>60000</td><td>M</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>45000</td><td>F</td></tr>
</tbody>
</table>
<p><code>INSERT INTO tblEmployee (empSSN, empName, empSalary, empSex, depNum) VALUES (100000, N'Lê Văn Tám', 100000, 'M', 1)</code> — chèn bình thường vào bảng thật. Cả truy vấn bảng gốc và <code>SELECT * FROM Employee_Dep1v2</code> giờ đều liệt kê SSN 100000: view không có bộ nhớ đệm để làm mới, nó được tính lại sống mỗi lần truy vấn.</p>`],
      [39, 'Update on view effects on table with unexpected result',
        `<p class="y-chinh">🎯 Insert THROUGH the view — depNum isn't one of the view's columns, so it's left out of the INSERT and silently becomes NULL, not 1. The new row then vanishes from the very view you inserted it through.</p>
<pre><code class="language-sql">-- Slide 39 · Example 4 part 2: insert THROUGH the view — depNum is missing from the view, so it becomes NULL
CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;
GO
INSERT INTO Employee_Dep1v2 VALUES (100001, N'Lê Văn Bảy', 100000, 'M');
GO
-- The row IS in the base table, but depNum is NULL — not 1
SELECT empSSN, empName, empSalary, empSex, depNum FROM tblEmployee WHERE empSSN = 100001;
GO
-- ... so the view's own WHERE depNum = 1 filters it right back out — "vanishes" from where you inserted it
SELECT * FROM Employee_Dep1v2 WHERE empSSN = 100001;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empSex</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>100001</td><td>Lê Văn Bảy</td><td>100000</td><td>M</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empSex</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td><td></td><td></td></tr>
</tbody>
</table>
<p><code>INSERT INTO Employee_Dep1v2 VALUES (100001, N'Lê Văn Bảy', 100000, 'M')</code> supplies only the view's four columns. SQL Server fills the missing <code>depNum</code> with its default — here, <code>NULL</code> (no <code>DEFAULT</code> was declared on that column). The base-table query proves the row exists with <code>depNum = NULL</code>. But <code>Employee_Dep1v2</code>'s own definition is <code>WHERE depNum = 1</code> — and <code>NULL = 1</code> is <code>UNKNOWN</code>, not <code>TRUE</code> — so the view's own <code>WHERE</code> filters the row right back out. You inserted "through the window" and the row fell out the other side.</p>
<p class="pitfall">This is the "unexpected result" the slide title warns about — and a direct consequence of Chapter 5's three-valued logic (<code>WHERE</code> keeps only <code>TRUE</code> rows), now showing up through a view instead of a plain query.</p>`,
        `<p class="y-chinh">🎯 Chèn QUA VIEW — depNum không phải cột của view, nên bị bỏ khỏi câu INSERT và lặng lẽ thành NULL, không phải 1. Dòng mới sau đó biến mất khỏi chính view bạn vừa chèn qua.</p>
<pre><code class="language-sql">-- Slide 39 · Example 4 part 2: insert THROUGH the view — depNum is missing from the view, so it becomes NULL
CREATE VIEW Employee_Dep1v2 AS
SELECT te.empSSN, te.empName, te.empSalary, te.empSex
FROM tblEmployee te WHERE te.depNum = 1;
GO
INSERT INTO Employee_Dep1v2 VALUES (100001, N'Lê Văn Bảy', 100000, 'M');
GO
-- dòng CÓ trong bảng gốc, nhưng depNum là NULL, không phải 1
SELECT empSSN, empName, empSalary, empSex, depNum FROM tblEmployee WHERE empSSN = 100001;
GO
-- ... so the view's own WHERE depNum = 1 filters it right back out — "vanishes" from where you inserted it
SELECT * FROM Employee_Dep1v2 WHERE empSSN = 100001;</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empSex</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>100001</td><td>Lê Văn Bảy</td><td>100000</td><td>M</td><td><em>NULL</em></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empSalary</th><th>empSex</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td><td></td><td></td></tr>
</tbody>
</table>
<p><code>INSERT INTO Employee_Dep1v2 VALUES (100001, N'Lê Văn Bảy', 100000, 'M')</code> chỉ đưa bốn cột của view. SQL Server điền <code>depNum</code> còn thiếu bằng giá trị mặc định — ở đây là <code>NULL</code> (cột đó chưa khai báo <code>DEFAULT</code>). Truy vấn bảng gốc chứng minh dòng đó tồn tại với <code>depNum = NULL</code>. Nhưng chính định nghĩa của <code>Employee_Dep1v2</code> là <code>WHERE depNum = 1</code> — mà <code>NULL = 1</code> là <code>UNKNOWN</code>, không phải <code>TRUE</code> — nên WHERE của chính view lọc luôn dòng đó ra ngoài. Bạn chèn "qua cửa sổ" và dòng rơi ra phía bên kia.</p>
<p class="pitfall">Đây chính là "kết quả bất ngờ" tiêu đề slide cảnh báo — và là hệ quả trực tiếp của lô-gic ba trị ở Chương 5 (<code>WHERE</code> chỉ giữ dòng <code>TRUE</code>), giờ xuất hiện qua một view thay vì một truy vấn trơn.</p>`],
      [40, 'Update on view raises error on table',
        `<p class="y-chinh">🎯 A view with computed columns (Tuổi from a date subtraction, Giới tính from CASE) refuses ANY insert through it — SQL Server cannot invert a computation back into a real column.</p>
<pre><code class="language-sql">-- Slide 40 · Example 4 part 3: a view with COMPUTED columns (Tuổi, Giới tính) — inserting through it is refused
CREATE VIEW Employee_Dep1v3 AS
SELECT te.empSSN AS 'Mã số nhân viên', te.empName AS 'Họ và tên',
       YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi',
       te.empSalary AS 'Lương',
       CASE WHEN te.empSex = 'F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'
FROM tblEmployee te WHERE te.depNum = 1;
GO
INSERT INTO Employee_Dep1v3 VALUES (100002, N'Lê Văn Chín', 30, 90000, N'Nam');</code></pre>
<div class="out"><b>Msg 4406, Level 16, State 1<br>
Update or insert of view or function 'Employee_Dep1v3' failed because it contains a derived or constant field.</b></div>
<p><code>Employee_Dep1v3</code> (slide 33's view) rejects the insert with <strong>Msg 4406</strong>: "contains a derived or constant field." Unlike slide 39's silent-NULL surprise, this one is a hard error — SQL Server knows it has no way to turn a target 'Tuổi' value back into a <code>empBirthdate</code>, so it refuses outright rather than guess.</p>
<p class="dap-an">✅ Compare the three outcomes on one row: slide 38 (insert into base table) — clean, expected. Slide 39 (insert into a view missing a filter column) — succeeds, but silently produces a row the view itself can't see. Slide 40 (insert into a view with a computed column) — refused outright (Msg 4406). Predicting which of these three happens for a given view is a realistic PE/interview question.</p>`,
        `<p class="y-chinh">🎯 Một view có cột tính toán (Tuổi từ phép trừ ngày, Giới tính từ CASE) từ chối MỌI insert qua nó — SQL Server không thể đảo ngược một phép tính về lại cột thật.</p>
<pre><code class="language-sql">-- Slide 40 · Example 4 part 3: a view with COMPUTED columns (Tuổi, Giới tính) — inserting through it is refused
CREATE VIEW Employee_Dep1v3 AS
SELECT te.empSSN AS 'Mã số nhân viên', te.empName AS 'Họ và tên',
       YEAR(GETDATE()) - YEAR(te.empBirthdate) AS 'Tuổi',
       te.empSalary AS 'Lương',
       CASE WHEN te.empSex = 'F' THEN N'Nữ' ELSE N'Nam' END AS 'Giới tính'
FROM tblEmployee te WHERE te.depNum = 1;
GO
INSERT INTO Employee_Dep1v3 VALUES (100002, N'Lê Văn Chín', 30, 90000, N'Nam');</code></pre>
<div class="out"><b>Msg 4406, Level 16, State 1<br>
Update or insert of view or function 'Employee_Dep1v3' failed because it contains a derived or constant field.</b></div>
<p><code>Employee_Dep1v3</code> (view của slide 33) từ chối câu chèn với <strong>Msg 4406</strong>: "chứa một trường dẫn xuất hoặc hằng." Khác với bất ngờ NULL-thầm-lặng ở slide 39, đây là lỗi cứng — SQL Server biết nó không có cách nào biến một giá trị 'Tuổi' đích trở lại thành <code>empBirthdate</code>, nên nó từ chối thẳng thay vì đoán mò.</p>
<p class="dap-an">✅ So ba kết quả trên cùng một dòng: slide 38 (chèn vào bảng gốc) — sạch, đúng như mong đợi. Slide 39 (chèn vào view thiếu một cột lọc) — thành công, nhưng lặng lẽ tạo ra một dòng mà chính view không thấy được. Slide 40 (chèn vào view có cột tính toán) — bị từ chối thẳng (Msg 4406). Đoán trước một view cho trước rơi vào trường hợp nào trong ba trường hợp này là câu hỏi PE/phỏng vấn thực tế.</p>`],
      [41, 'Query optimization',
        `<p class="y-chinh">🎯 Ten practical habits: define requirements first, SELECT only needed fields, avoid SELECT DISTINCT, index wisely, use INNER JOIN not WHERE-joins, prefer EXISTS() over COUNT() for existence checks, avoid correlated subqueries where possible, use temp tables, never query in a loop, and limit the working data set.</p>
<p>The diagram shows the engine's own optimizer loop (Parse → Enumerate Plans → Estimate Cost → Choose Best Plan → Evaluate) — everything you read in <code>SET STATISTICS PROFILE</code> output across this lesson is exactly the "Choose Best Plan" step made visible. Two of the ten habits, proven for real:</p>
<pre><code class="language-sql">-- Slide 41: query optimization habits — EXISTS() instead of COUNT() to test existence; SELECT fields not SELECT *
-- Stops at the first match — does not need to count every row
IF EXISTS (SELECT 1 FROM tblEmployee WHERE depNum = 5)
  SELECT N'Phòng 5 có nhân viên' AS ket_qua;
GO
-- Must scan and count EVERY matching row just to compare with 0 — wasted work when you only need yes/no
IF (SELECT COUNT(*) FROM tblEmployee WHERE depNum = 5) &gt; 0
  SELECT N'Phòng 5 có nhân viên' AS ket_qua;
GO
SELECT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;
GO
-- Fewer columns crossing the network, and a covering index becomes possible
SELECT empSSN, empName FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>ket_qua</th></tr></thead>
<tbody>
<tr><td>Phòng 5 có nhân viên</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>ket_qua</th></tr></thead>
<tbody>
<tr><td>Phòng 5 có nhân viên</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td></tr>
</tbody>
</table>
<p><strong>EXISTS() vs. COUNT()</strong>: <code>IF EXISTS (SELECT 1 FROM tblEmployee WHERE depNum = 5)</code> can stop at the very first matching row; <code>IF (SELECT COUNT(*) FROM tblEmployee WHERE depNum = 5) &gt; 0</code> must find and count <em>every</em> matching row just to throw the number away and compare it with 0 — wasted work for a yes/no answer. <strong>SELECT fields, not <code>*</code></strong>: fewer columns cross the network, and — as slide 25 showed — a narrower <code>SELECT</code> list is what makes a covering index possible at all.</p>
<table>
<thead><tr><th>Habit</th><th>One-line reason</th></tr></thead>
<tbody>
<tr><td>1. Define requirements (Who/What/Where/When/Why)</td><td>an unclear query can't be optimized, only guessed at</td></tr>
<tr><td>2. SELECT fields, not <code>*</code></td><td>less data moved, covering indexes become possible</td></tr>
<tr><td>3. Avoid SELECT DISTINCT</td><td>DISTINCT forces a full sort/hash to de-duplicate</td></tr>
<tr><td>4. Indexing</td><td>this whole lesson</td></tr>
<tr><td>5. INNER JOIN, not a WHERE-clause join</td><td>clearer intent, same result, easier for the optimizer to read</td></tr>
<tr><td>6. EXISTS() rather than COUNT() for existence</td><td>stops at the first match instead of counting all</td></tr>
<tr><td>7. Avoid (unnecessary) correlated subqueries</td><td>a correlated subquery re-runs once per outer row</td></tr>
<tr><td>8. Use temp tables for intermediate results</td><td>avoids recomputing the same subquery many times</td></tr>
<tr><td>9. Don't run queries in a loop</td><td>one set-based query beats a WHILE loop of many small ones (slide 24's data was built this way on purpose)</td></tr>
<tr><td>10. Limit your working data set</td><td>filter early — smaller intermediate results are cheaper at every later step</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Mười thói quen thực tế: xác định yêu cầu trước, SELECT đúng cột cần, tránh SELECT DISTINCT, đánh chỉ mục khôn ngoan, dùng INNER JOIN thay vì join qua WHERE, ưu tiên EXISTS() hơn COUNT() khi chỉ cần biết có/không, tránh truy vấn con tương quan khi không cần, dùng bảng tạm, không bao giờ truy vấn trong vòng lặp, và giới hạn tập dữ liệu đang làm việc.</p>
<p>Sơ đồ vẽ vòng lặp tối ưu của chính engine (Parse → Enumerate Plans → Estimate Cost → Choose Best Plan → Evaluate) — mọi thứ bạn đọc trong output <code>SET STATISTICS PROFILE</code> xuyên suốt bài này chính là bước "Choose Best Plan" được hiện ra nhìn thấy được. Hai trong mười thói quen, chứng minh thật:</p>
<pre><code class="language-sql">-- Slide 41: query optimization habits — EXISTS() instead of COUNT() to test existence; SELECT fields not SELECT *
-- Stops at the first match — does not need to count every row
IF EXISTS (SELECT 1 FROM tblEmployee WHERE depNum = 5)
  SELECT N'Phòng 5 có nhân viên' AS ket_qua;
GO
-- Must scan and count EVERY matching row just to compare with 0 — wasted work when you only need yes/no
IF (SELECT COUNT(*) FROM tblEmployee WHERE depNum = 5) &gt; 0
  SELECT N'Phòng 5 có nhân viên' AS ket_qua;
GO
SELECT * FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;
GO
-- Fewer columns crossing the network, and a covering index becomes possible
SELECT empSSN, empName FROM tblEmployee WHERE depNum = 1 ORDER BY empSSN;</code></pre>
<table>
<thead><tr><th>ket_qua</th></tr></thead>
<tbody>
<tr><td>Phòng 5 có nhân viên</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>ket_qua</th></tr></thead>
<tbody>
<tr><td>Phòng 5 có nhân viên</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>empAddress</th><th>empSalary</th><th>empSex</th><th>empBirthdate</th><th>depNum</th><th>supervisorSSN</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>45 Nguyễn Huệ, Q.1, TP Hồ Chí Minh</td><td>150000</td><td>M</td><td>1968-03-12</td><td>1</td><td><em>NULL</em></td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>12 Lê Lợi, Q.1, TP Hồ Chí Minh</td><td>90000</td><td>F</td><td>1985-07-20</td><td>1</td><td>30121050001</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>88 Trần Hưng Đạo, Q.5, TP Hồ Chí Minh</td><td>60000</td><td>M</td><td>1990-11-02</td><td>1</td><td>30121050002</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>21 Pasteur, Q.3, TP Hồ Chí Minh</td><td>45000</td><td>F</td><td>1995-01-15</td><td>1</td><td>30121050002</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>empSSN</th><th>empName</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td></tr>
</tbody>
</table>
<p><strong>EXISTS() vs. COUNT()</strong>: <code>IF EXISTS (SELECT 1 FROM tblEmployee WHERE depNum = 5)</code> có thể dừng ngay ở dòng khớp đầu tiên; <code>IF (SELECT COUNT(*) FROM tblEmployee WHERE depNum = 5) &gt; 0</code> phải tìm và đếm <em>mọi</em> dòng khớp chỉ để rồi vứt con số đó đi và so với 0 — phí công cho một câu trả lời có/không. <strong>SELECT đúng cột, không <code>*</code></strong>: ít cột hơn đi qua mạng, và — như slide 25 đã cho thấy — danh sách <code>SELECT</code> hẹp hơn là thứ khiến chỉ mục bao phủ khả thi ngay từ đầu.</p>
<table>
<thead><tr><th>Thói quen</th><th>Vì sao (một câu)</th></tr></thead>
<tbody>
<tr><td>1. Xác định yêu cầu (Ai/Cái gì/Ở đâu/Khi nào/Vì sao)</td><td>truy vấn không rõ ràng thì không tối ưu được, chỉ đoán mò</td></tr>
<tr><td>2. SELECT đúng cột, không <code>*</code></td><td>ít dữ liệu di chuyển hơn, chỉ mục bao phủ trở nên khả thi</td></tr>
<tr><td>3. Tránh SELECT DISTINCT</td><td>DISTINCT buộc phải sắp xếp/băm toàn bộ để lọc trùng</td></tr>
<tr><td>4. Đánh chỉ mục</td><td>cả bài học này</td></tr>
<tr><td>5. INNER JOIN, không join qua WHERE</td><td>ý định rõ hơn, cùng kết quả, bộ tối ưu đọc dễ hơn</td></tr>
<tr><td>6. EXISTS() thay vì COUNT() khi chỉ cần biết có/không</td><td>dừng ở dòng khớp đầu thay vì đếm hết</td></tr>
<tr><td>7. Tránh truy vấn con tương quan (khi không cần)</td><td>truy vấn con tương quan chạy lại một lần cho mỗi dòng ngoài</td></tr>
<tr><td>8. Dùng bảng tạm cho kết quả trung gian</td><td>tránh tính lại cùng một truy vấn con nhiều lần</td></tr>
<tr><td>9. Không chạy truy vấn trong vòng lặp</td><td>một truy vấn theo tập hợp thắng một vòng lặp WHILE nhiều câu nhỏ (dữ liệu ở slide 24 cố tình được dựng theo cách này)</td></tr>
<tr><td>10. Giới hạn tập dữ liệu đang làm việc</td><td>lọc sớm — kết quả trung gian nhỏ hơn thì mọi bước sau đều rẻ hơn</td></tr>
</tbody>
</table>`],
    ]),
    books([
      ['fuSlides', 'FUH slides — Chapter 7: Practical Issues of Database Application, slides 22–41', 'Slide FUH — Chapter 7: Practical Issues of Database Application, slide 22–41'],
      ['ullman', 'Ullman &amp; Widom, A First Course in Database Systems (3e) — Ch. 8, Views; Ch. 15, Indexes', 'Ullman &amp; Widom, A First Course in Database Systems (3e) — Ch. 8, View; Ch. 15, Chỉ mục'],
    ]),
  ].join('\n'),
};

/* ───────── 8.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Transactions, indexes & views ───────── */
const L_on_ch8 = {
  title: '8.4 — 🧪 Practice + 🗂 Glossary + 📌 Summary · Transactions, indexes & views|||8.4 — 🧪 Thực hành + 🗂 Thuật ngữ + 📌 Tóm tắt · Giao dịch, chỉ mục & view',
  slug: 'dbi202-on-ch8',
  type: 'VIDEO',
  description: '7 bài tập kiểu đề PE trên Chương 8: viết một giao dịch chuyển thưởng nhân viên có TRY/CATCH chạy thật cả nhánh thành công lẫn thất bại, chọn và chứng minh một chỉ mục bằng SET STATISTICS PROFILE, chỉ mục ghép và vì sao thứ tự cột quan trọng, view có WITH CHECK OPTION, view trên nhiều bảng có cập nhật được không, chỉ mục một phần và materialized view chỉ có trên PostgreSQL — chạy thật trên SQL Server + PostgreSQL; 20 thuật ngữ Anh–Việt; bảng T-SQL ↔ PostgreSQL cho giao dịch/chỉ mục/view; tóm tắt 8 ý.',
  content: [
    bi(`<span class="eyebrow">Chapter 8 · Lesson 8.4 · Practice &amp; review</span>
<h2>Transactions, indexes &amp; views — practise like PE questions</h2>
<p class="lead">Seven exercises. The first proves a transaction really undoes itself on failure. The next three are about choosing and proving an index — the single most common "explain your design" question in a database interview. The rest are about views: which ones can be written through, and two PostgreSQL-only tools (partial index, materialized view) worth knowing before you use PostgreSQL at work. Every script below really ran; where PostgreSQL differs, its version ran too.</p>
<div class="callout"><strong>How to use this page.</strong>
<ol>
<li>Read the task only. Write your own script first — about 10–15 minutes per exercise.</li>
<li>Run it (or predict the plan/output on paper for the index exercises). Then compare with the solution <strong>and its real output</strong>.</li>
<li>Read the trap under each solution — these are genuine mistakes that lose PE marks or cause slow production queries.</li>
</ol></div>
<table>
<thead><tr><th>PE habit</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Wrap multi-statement changes in BEGIN TRANSACTION … COMMIT/ROLLBACK, with TRY…CATCH</td><td>a half-finished change is worse than a rejected one</td></tr>
<tr><td>Build 20,000+ rows to test an index, never a handful</td><td>SQL Server (and PostgreSQL) may ignore an index on a tiny table entirely</td></tr>
<tr><td>Read the plan's PhysicalOp / EXPLAIN line, not just "it ran"</td><td>"it ran" doesn't tell you whether it seeked or scanned</td></tr>
<tr><td>Test a view's updatability by actually inserting, not by guessing</td><td>the four textbook rules and SQL Server's real refusals don't always draw the line in the same place</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 8 · Bài 8.4 · Thực hành &amp; ôn tập</span>
<h2>Giao dịch, chỉ mục &amp; view — luyện đúng kiểu đề PE</h2>
<p class="lead">Bảy bài tập. Bài đầu chứng minh một giao dịch thật sự tự lùi lại khi thất bại. Ba bài tiếp là chọn và chứng minh một chỉ mục — câu hỏi "giải thích thiết kế của bạn" phổ biến nhất khi phỏng vấn về CSDL. Phần còn lại về view: view nào ghi được qua, và hai công cụ chỉ có trên PostgreSQL (chỉ mục một phần, materialized view) đáng biết trước khi bạn dùng PostgreSQL đi làm. Mọi script dưới đây đã chạy thật; chỗ nào PostgreSQL viết khác thì bản PostgreSQL cũng đã chạy.</p>
<div class="callout"><strong>Cách dùng trang này.</strong>
<ol>
<li>Chỉ đọc đề. Tự viết script trước — khoảng 10–15 phút mỗi bài.</li>
<li>Chạy thử (hoặc tự đoán kế hoạch/kết quả trên giấy với các bài chỉ mục). Rồi so với lời giải <strong>và output thật</strong> của nó.</li>
<li>Đọc cái bẫy dưới mỗi lời giải — đây là những lỗi thật sự làm mất điểm PE hoặc làm truy vấn production chậm.</li>
</ol></div>
<table>
<thead><tr><th>Thói quen khi thi PE</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Gói thay đổi nhiều câu trong BEGIN TRANSACTION … COMMIT/ROLLBACK, cùng TRY…CATCH</td><td>một thay đổi dở dang tệ hơn một thay đổi bị từ chối</td></tr>
<tr><td>Dựng ít nhất 20.000+ dòng để thử chỉ mục, đừng bao giờ vài dòng</td><td>SQL Server (và PostgreSQL) có thể lờ hẳn chỉ mục trên bảng nhỏ</td></tr>
<tr><td>Đọc dòng PhysicalOp của kế hoạch / dòng EXPLAIN, đừng chỉ nhìn "nó chạy được"</td><td>"chạy được" không nói cho bạn biết nó seek hay scan</td></tr>
<tr><td>Kiểm view cập nhật được bằng cách chèn thật, đừng đoán</td><td>bốn luật giáo trình và những lần SQL Server thật sự từ chối không phải lúc nào cũng vẽ ranh giới giống nhau</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — A bonus-transfer transaction with TRY…CATCH (~15 min)</h3>
<p class="nhan">Task</p>
<p>Table <code>NhanVienThuong(maNV, ten, thuong)</code> holds each employee's bonus, never allowed to go negative. Write a stored procedure <code>psm_ChuyenThuong @tuNV, @denNV, @soTien</code> that moves <code>@soTien</code> from one employee's bonus to another's, wrapped in a transaction with <code>TRY…CATCH</code>: on any failure (including a <code>CHECK</code> violation), roll back and print the real error message instead of crashing the caller. Prove BOTH a successful transfer and a failing one (a transfer that would push a bonus below 0), with real data before and after each.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 1 (PE style): write a bonus-transfer transaction with TRY...CATCH, proving both the success
-- and the failure path with real data
CREATE TABLE dbo.NhanVienThuong (
  maNV INT NOT NULL CONSTRAINT pk_nvthuong PRIMARY KEY,
  ten NVARCHAR(50) NOT NULL,
  thuong DECIMAL(10,0) NOT NULL CONSTRAINT ck_nvthuong_thuong CHECK (thuong &gt;= 0)
);
INSERT INTO dbo.NhanVienThuong VALUES (1, N'An', 2000), (2, N'Bình', 500);
GO
CREATE PROCEDURE psm_ChuyenThuong @tuNV INT, @denNV INT, @soTien DECIMAL(10,0) AS
BEGIN
  BEGIN TRY
    BEGIN TRANSACTION;
      UPDATE dbo.NhanVienThuong SET thuong = thuong - @soTien WHERE maNV = @tuNV;
      IF @@ROWCOUNT = 0 THROW 50001, N'Không tìm thấy nhân viên nguồn', 1;
      UPDATE dbo.NhanVienThuong SET thuong = thuong + @soTien WHERE maNV = @denNV;
      IF @@ROWCOUNT = 0 THROW 50002, N'Không tìm thấy nhân viên đích', 1;
    COMMIT TRANSACTION;
    PRINT N'Chuyển thành công';
  END TRY
  BEGIN CATCH
    IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION;
    PRINT N'Chuyển thất bại: ' + ERROR_MESSAGE();
  END CATCH
END
GO
-- Case A: succeeds
EXEC psm_ChuyenThuong 1, 2, 500;
SELECT * FROM dbo.NhanVienThuong ORDER BY maNV;
GO
-- Case B: would push thuong below 0 — CHECK stops it, the whole transfer rolls back
EXEC psm_ChuyenThuong 1, 2, 99999;
SELECT * FROM dbo.NhanVienThuong ORDER BY maNV;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
Chuyển thành công</div>
<table>
<thead><tr><th>maNV</th><th>ten</th><th>thuong</th></tr></thead>
<tbody>
<tr><td>1</td><td>An</td><td>1500</td></tr>
<tr><td>2</td><td>Bình</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">Chuyển thất bại: The UPDATE statement conflicted with the CHECK constraint "ck_nvthuong_thuong". The conflict occurred in database "DBI202", table "dbo.NhanVienThuong", column 'thuong'.</div>
<table>
<thead><tr><th>maNV</th><th>ten</th><th>thuong</th></tr></thead>
<tbody>
<tr><td>1</td><td>An</td><td>1500</td></tr>
<tr><td>2</td><td>Bình</td><td>1000</td></tr>
</tbody>
</table>
<ul>
<li>Case A (500 from An to Bình) succeeds: both rows update together, "Chuyển thành công" prints.</li>
<li>Case B (99999, far more than An has) is refused by <code>ck_nvthuong_thuong CHECK (thuong &gt;= 0)</code> on the SECOND update — but notice the FIRST update (subtracting from An) already ran inside the same transaction. Because everything sits between <code>BEGIN TRANSACTION</code> and the <code>CATCH</code> block's <code>ROLLBACK TRANSACTION</code>, that already-run first update is undone too — the final numbers are unchanged (1500/1000, from after Case A).</li>
<li><code>IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION</code> is the pattern Microsoft's own docs teach: never blindly <code>COMMIT</code> inside <code>CATCH</code>, and never <code>ROLLBACK</code> when there is nothing open (<code>XACT_STATE() = 0</code>, e.g. an error before any <code>BEGIN TRANSACTION</code> ran).</li>
</ul>
<div class="pitfall">A CHECK violation only cancels the ONE statement that broke it, not the whole batch — if this procedure had no explicit transaction, the first UPDATE (An losing 500) would have stayed committed even though the second UPDATE failed. The transaction is what makes the two updates atomic, exactly like slide 9's bank transfer.</div>`,
    `<h3>🧪 Bài 1 — Giao dịch chuyển thưởng có TRY…CATCH (~15 phút)</h3>
<p class="nhan">Đề</p>
<p>Bảng <code>NhanVienThuong(maNV, ten, thuong)</code> lưu tiền thưởng của mỗi nhân viên, không bao giờ được âm. Viết stored procedure <code>psm_ChuyenThuong @tuNV, @denNV, @soTien</code> chuyển <code>@soTien</code> thưởng từ nhân viên này sang nhân viên kia, gói trong một giao dịch với <code>TRY…CATCH</code>: gặp lỗi bất kỳ (kể cả vi phạm <code>CHECK</code>), rollback và in ra thông báo lỗi thật thay vì làm sập nơi gọi nó. Chứng minh CẢ một lần chuyển thành công LẪN một lần chuyển thất bại (chuyển số tiền làm thưởng âm), có dữ liệu thật trước và sau mỗi lần.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 1 (PE style): write a bonus-transfer transaction with TRY...CATCH, proving both the success
-- and the failure path with real data
CREATE TABLE dbo.NhanVienThuong (
  maNV INT NOT NULL CONSTRAINT pk_nvthuong PRIMARY KEY,
  ten NVARCHAR(50) NOT NULL,
  thuong DECIMAL(10,0) NOT NULL CONSTRAINT ck_nvthuong_thuong CHECK (thuong &gt;= 0)
);
INSERT INTO dbo.NhanVienThuong VALUES (1, N'An', 2000), (2, N'Bình', 500);
GO
CREATE PROCEDURE psm_ChuyenThuong @tuNV INT, @denNV INT, @soTien DECIMAL(10,0) AS
BEGIN
  BEGIN TRY
    BEGIN TRANSACTION;
      UPDATE dbo.NhanVienThuong SET thuong = thuong - @soTien WHERE maNV = @tuNV;
      IF @@ROWCOUNT = 0 THROW 50001, N'Không tìm thấy nhân viên nguồn', 1;
      UPDATE dbo.NhanVienThuong SET thuong = thuong + @soTien WHERE maNV = @denNV;
      IF @@ROWCOUNT = 0 THROW 50002, N'Không tìm thấy nhân viên đích', 1;
    COMMIT TRANSACTION;
    PRINT N'Chuyển thành công';
  END TRY
  BEGIN CATCH
    IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION;
    PRINT N'Chuyển thất bại: ' + ERROR_MESSAGE();
  END CATCH
END
GO
-- Trường hợp A: thành công
EXEC psm_ChuyenThuong 1, 2, 500;
SELECT * FROM dbo.NhanVienThuong ORDER BY maNV;
GO
-- Trường hợp B: sẽ làm thuong âm — CHECK chặn lại, cả giao dịch bị lùi
EXEC psm_ChuyenThuong 1, 2, 99999;
SELECT * FROM dbo.NhanVienThuong ORDER BY maNV;</code></pre>
<div class="out">(2 rows affected)<br>
(1 row affected)<br>
(1 row affected)<br>
Chuyển thành công</div>
<table>
<thead><tr><th>maNV</th><th>ten</th><th>thuong</th></tr></thead>
<tbody>
<tr><td>1</td><td>An</td><td>1500</td></tr>
<tr><td>2</td><td>Bình</td><td>1000</td></tr>
</tbody>
</table>
<div class="out">Chuyển thất bại: The UPDATE statement conflicted with the CHECK constraint "ck_nvthuong_thuong". The conflict occurred in database "DBI202", table "dbo.NhanVienThuong", column 'thuong'.</div>
<table>
<thead><tr><th>maNV</th><th>ten</th><th>thuong</th></tr></thead>
<tbody>
<tr><td>1</td><td>An</td><td>1500</td></tr>
<tr><td>2</td><td>Bình</td><td>1000</td></tr>
</tbody>
</table>
<ul>
<li>Trường hợp A (chuyển 500 từ An sang Bình) thành công: cả hai dòng cùng cập nhật, "Chuyển thành công" được in.</li>
<li>Trường hợp B (99999, nhiều hơn hẳn số An đang có) bị <code>ck_nvthuong_thuong CHECK (thuong &gt;= 0)</code> từ chối ở câu UPDATE THỨ HAI — nhưng để ý câu UPDATE ĐẦU TIÊN (trừ tiền của An) đã chạy trong cùng giao dịch rồi. Vì mọi thứ nằm giữa <code>BEGIN TRANSACTION</code> và <code>ROLLBACK TRANSACTION</code> trong khối <code>CATCH</code>, câu UPDATE đầu đã chạy đó cũng bị lùi lại — số cuối cùng không đổi (1500/1000, từ sau Trường hợp A).</li>
<li><code>IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION</code> là mẫu chính tài liệu Microsoft dạy: đừng bao giờ <code>COMMIT</code> mù quáng trong <code>CATCH</code>, và đừng <code>ROLLBACK</code> khi không có gì đang mở (<code>XACT_STATE() = 0</code>, ví dụ lỗi xảy ra trước khi <code>BEGIN TRANSACTION</code> nào chạy).</li>
</ul>
<div class="pitfall">Vi phạm CHECK chỉ huỷ MỘT câu lệnh gây ra nó, không huỷ cả lô — nếu procedure này không có giao dịch rõ ràng, câu UPDATE đầu (An mất 500) đã vẫn được commit dù câu UPDATE thứ hai thất bại. Giao dịch chính là thứ làm hai câu UPDATE trở nên nguyên tử, y hệt ví dụ chuyển tiền ngân hàng ở slide 9.</div>`),
    bi(`<h3>🧪 Exercise 2 — Choose and prove an index (~15 min)</h3>
<p class="nhan">Task</p>
<p>A 30,000-row table <code>NhanVienDemo(id, luong)</code> is queried as <code>SELECT id, luong FROM NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong</code>. Choose ONE index that helps both the filter AND the sort, and prove it with <code>SET STATISTICS PROFILE</code>.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 2: given the query "find employees earning more than a given salary, ordered by salary", choose
-- and prove an index. 30,000-row table.
CREATE TABLE dbo.NhanVienDemo (
  id INT NOT NULL CONSTRAINT pk_nvdemo2 PRIMARY KEY,
  luong DECIMAL(10,0) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.NhanVienDemo(id, luong) SELECT rn, 5000000 + (rn % 20000) FROM n;
GO
SET STATISTICS PROFILE ON;
SELECT id, luong FROM dbo.NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong;
SET STATISTICS PROFILE OFF;
GO
-- The query filters AND sorts by luong ⇒ an index on luong serves both jobs at once
CREATE NONCLUSTERED INDEX idx_nvdemo2_luong ON dbo.NhanVienDemo(luong);
GO
SET STATISTICS PROFILE ON;
SELECT id, luong FROM dbo.NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong;
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)</div>
<table>
<thead><tr><th>id</th><th>luong</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[luong] FROM [dbo].[NhanVienDemo] WHERE [luong]&gt;@1 ORDER BY [luong] ASC</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.12204328179359436</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Sort(ORDER BY:([DBI202].[dbo].[NhanVienDemo].[luong] ASC))</td><td>1</td><td>2</td><td>1</td><td>Sort</td><td>Sort</td><td>ORDER BY:([DBI202].[dbo].[NhanVienDemo].[luong] ASC)</td><td><em>NULL</em></td><td>1</td><td>0.011261261068284512</td><td>0.0001000199990812689</td><td>20</td><td>0.12204328179359436</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>       |--Clustered Index Scan(OBJECT:([DBI202].[dbo].[NhanVienDemo].[pk_nvdemo2]), WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;(24000000.)))</td><td>1</td><td>3</td><td>2</td><td>Clustered Index Scan</td><td>Clustered Index Scan</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[pk_nvdemo2]), WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;(24000000.))</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td>1</td><td>0.06312499940395355</td><td>0.033156998455524445</td><td>20</td><td>0.096281997859478</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>luong</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[luong] FROM [dbo].[NhanVienDemo] WHERE [luong]&gt;@1 ORDER BY [luong] ASC</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo2_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@1],0)) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo2_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@1],0)) ORDERED FORWARD</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>20</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li>Before the index: <code>Clustered Index Scan</code> (reads every row) followed by a separate <code>Sort</code> operator to satisfy <code>ORDER BY luong</code>.</li>
<li>After <code>CREATE NONCLUSTERED INDEX idx_nvdemo2_luong ON NhanVienDemo(luong)</code>: a plain <code>Index Seek</code> — because the index already stores rows in <code>luong</code> order, the engine gets the filter AND the sort for free, with no separate <code>Sort</code> step at all.</li>
</ul>
<div class="meo">🧠 An index doesn't just speed up <code>WHERE</code> — if its key matches an <code>ORDER BY</code>, it removes the sort too. That's a second, often-forgotten reason to pick an index.</div>`,
    `<h3>🧪 Bài 2 — Chọn và chứng minh một chỉ mục (~15 phút)</h3>
<p class="nhan">Đề</p>
<p>Bảng 30.000 dòng <code>NhanVienDemo(id, luong)</code> được truy vấn bằng <code>SELECT id, luong FROM NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong</code>. Chọn MỘT chỉ mục giúp cả lọc LẪN sắp xếp, và chứng minh bằng <code>SET STATISTICS PROFILE</code>.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 2: given the query "find employees earning more than a given salary, ordered by salary", choose
-- and prove an index. 30,000-row table.
CREATE TABLE dbo.NhanVienDemo (
  id INT NOT NULL CONSTRAINT pk_nvdemo2 PRIMARY KEY,
  luong DECIMAL(10,0) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.NhanVienDemo(id, luong) SELECT rn, 5000000 + (rn % 20000) FROM n;
GO
SET STATISTICS PROFILE ON;
SELECT id, luong FROM dbo.NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong;
SET STATISTICS PROFILE OFF;
GO
-- The query filters AND sorts by luong ⇒ an index on luong serves both jobs at once
CREATE NONCLUSTERED INDEX idx_nvdemo2_luong ON dbo.NhanVienDemo(luong);
GO
SET STATISTICS PROFILE ON;
SELECT id, luong FROM dbo.NhanVienDemo WHERE luong &gt; 24000000 ORDER BY luong;
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)</div>
<table>
<thead><tr><th>id</th><th>luong</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[luong] FROM [dbo].[NhanVienDemo] WHERE [luong]&gt;@1 ORDER BY [luong] ASC</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.12204328179359436</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Sort(ORDER BY:([DBI202].[dbo].[NhanVienDemo].[luong] ASC))</td><td>1</td><td>2</td><td>1</td><td>Sort</td><td>Sort</td><td>ORDER BY:([DBI202].[dbo].[NhanVienDemo].[luong] ASC)</td><td><em>NULL</em></td><td>1</td><td>0.011261261068284512</td><td>0.0001000199990812689</td><td>20</td><td>0.12204328179359436</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>       |--Clustered Index Scan(OBJECT:([DBI202].[dbo].[NhanVienDemo].[pk_nvdemo2]), WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;(24000000.)))</td><td>1</td><td>3</td><td>2</td><td>Clustered Index Scan</td><td>Clustered Index Scan</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[pk_nvdemo2]), WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;(24000000.))</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td>1</td><td>0.06312499940395355</td><td>0.033156998455524445</td><td>20</td><td>0.096281997859478</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>luong</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[luong] FROM [dbo].[NhanVienDemo] WHERE [luong]&gt;@1 ORDER BY [luong] ASC</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo2_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@1],0)) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo2_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@1],0)) ORDERED FORWARD</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>20</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li>Trước khi có chỉ mục: <code>Clustered Index Scan</code> (đọc mọi dòng) rồi tới một toán tử <code>Sort</code> riêng để thoả <code>ORDER BY luong</code>.</li>
<li>Sau <code>CREATE NONCLUSTERED INDEX idx_nvdemo2_luong ON NhanVienDemo(luong)</code>: chỉ còn <code>Index Seek</code> trơn — vì chỉ mục đã lưu sẵn các dòng theo thứ tự <code>luong</code>, engine được cả lọc LẪN sắp xếp miễn phí, không còn bước <code>Sort</code> riêng nào.</li>
</ul>
<div class="meo">🧠 Chỉ mục không chỉ tăng tốc <code>WHERE</code> — nếu khoá của nó khớp với <code>ORDER BY</code>, nó còn bỏ được luôn bước sắp xếp. Đây là lý do thứ hai, hay bị quên, để chọn một chỉ mục.</div>`),
    bi(`<h3>🧪 Exercise 3 — Composite index: does column order matter? (~10 min)</h3>
<p class="nhan">Task</p>
<p><code>NhanVienDemo(id, depNum, luong)</code>, 30,000 rows, with <code>CREATE NONCLUSTERED INDEX idx_nvdemo3_dep_luong ON NhanVienDemo(depNum, luong)</code>. Does this index help a query that filters <code>depNum = 3 AND luong &gt; 15000000</code>? Does it help a query that filters <code>luong &gt; 24000000</code> alone (no <code>depNum</code>)? Predict, then prove.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 3: composite index column order — an index on (depNum, luong) helps a query on depNum,
-- but is USELESS for a query that filters on luong alone
CREATE TABLE dbo.NhanVienDemo (
  id INT NOT NULL CONSTRAINT pk_nvdemo3 PRIMARY KEY,
  depNum INT NOT NULL,
  luong DECIMAL(10,0) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.NhanVienDemo(id, depNum, luong) SELECT rn, 1 + (rn % 5), 5000000 + (rn % 20000) FROM n;
GO
CREATE NONCLUSTERED INDEX idx_nvdemo3_dep_luong ON dbo.NhanVienDemo(depNum, luong);
GO
-- Leading column depNum is in the WHERE ⇒ the index is used
SET STATISTICS PROFILE ON;
SELECT id, luong FROM dbo.NhanVienDemo WHERE depNum = 3 AND luong &gt; 15000000;
SET STATISTICS PROFILE OFF;
GO
-- Only the SECOND column luong is in the WHERE ⇒ the index cannot be entered from the top ⇒ scan
SET STATISTICS PROFILE ON;
SELECT id, depNum FROM dbo.NhanVienDemo WHERE luong &gt; 24000000;
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)</div>
<table>
<thead><tr><th>id</th><th>luong</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[luong] FROM [dbo].[NhanVienDemo] WHERE [depNum]=@1 AND [luong]&gt;@2</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[depNum]=CONVERT_IMPLICIT(int,[@1],0) AND [DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@2],0)) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[depNum]=CONVERT_IMPLICIT(int,[@1],0) AND [DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@2],0)) ORDERED FORWARD</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>20</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>(0 rows)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[depNum] FROM [dbo].[NhanVienDemo] WHERE [luong]&gt;@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.09924495965242386</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Index Scan(OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]),  WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;CONVERT_IMPLICIT(decimal(10,0),[@1],0)))</td><td>1</td><td>2</td><td>1</td><td>Index Scan</td><td>Index Scan</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]),  WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;CONVERT_IMPLICIT(decimal(10,0),[@1],0))</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[depNum]</td><td>1</td><td>0.06608796119689941</td><td>0.033156998455524445</td><td>24</td><td>0.09924495965242386</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[depNum]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>WHERE depNum = 3 AND luong &gt; 15000000</code> → <code>Index Seek</code>: <code>depNum</code> is the LEADING column of the index, so the engine can binary-search straight to depNum = 3, then range-scan <code>luong</code> within that.</li>
<li><code>WHERE luong &gt; 24000000</code> (no <code>depNum</code>) → <code>Index Scan</code>, not a seek: <code>luong</code> is the SECOND column, so the engine cannot jump into the middle of the index without knowing <code>depNum</code> first — it reads the whole (smaller) index instead of the whole table, which is still cheaper than a table scan, but far from a seek.</li>
</ul>
<div class="pitfall">A composite index <code>(A, B)</code> is like a phone book sorted by last name then first name: useful for "find everyone named Nguyễn", useless for "find everyone whose first name is Anh" — you'd have to read every page. Put the column your queries filter on MOST OFTEN first.</div>`,
    `<h3>🧪 Bài 3 — Chỉ mục ghép: thứ tự cột có quan trọng không? (~10 phút)</h3>
<p class="nhan">Đề</p>
<p><code>NhanVienDemo(id, depNum, luong)</code>, 30.000 dòng, với <code>CREATE NONCLUSTERED INDEX idx_nvdemo3_dep_luong ON NhanVienDemo(depNum, luong)</code>. Chỉ mục này có giúp truy vấn lọc <code>depNum = 3 AND luong &gt; 15000000</code> không? Có giúp truy vấn chỉ lọc <code>luong &gt; 24000000</code> (không có <code>depNum</code>) không? Đoán trước, rồi chứng minh.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 3: composite index column order — an index on (depNum, luong) helps a query on depNum,
-- but is USELESS for a query that filters on luong alone
CREATE TABLE dbo.NhanVienDemo (
  id INT NOT NULL CONSTRAINT pk_nvdemo3 PRIMARY KEY,
  depNum INT NOT NULL,
  luong DECIMAL(10,0) NOT NULL
);
GO
;WITH n AS (
  SELECT TOP (30000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_columns a CROSS JOIN sys.all_columns b
)
INSERT INTO dbo.NhanVienDemo(id, depNum, luong) SELECT rn, 1 + (rn % 5), 5000000 + (rn % 20000) FROM n;
GO
CREATE NONCLUSTERED INDEX idx_nvdemo3_dep_luong ON dbo.NhanVienDemo(depNum, luong);
GO
-- Leading column depNum is in the WHERE ⇒ the index is used
SET STATISTICS PROFILE ON;
SELECT id, luong FROM dbo.NhanVienDemo WHERE depNum = 3 AND luong &gt; 15000000;
SET STATISTICS PROFILE OFF;
GO
-- Only the SECOND column luong is in the WHERE ⇒ the index cannot be entered from the top ⇒ scan
SET STATISTICS PROFILE ON;
SELECT id, depNum FROM dbo.NhanVienDemo WHERE luong &gt; 24000000;
SET STATISTICS PROFILE OFF;</code></pre>
<div class="out">(30000 rows affected)</div>
<table>
<thead><tr><th>id</th><th>luong</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[luong] FROM [dbo].[NhanVienDemo] WHERE [depNum]=@1 AND [luong]&gt;@2</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.0032830999698489904</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Index Seek(OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[depNum]=CONVERT_IMPLICIT(int,[@1],0) AND [DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@2],0)) ORDERED FORWARD)</td><td>1</td><td>2</td><td>1</td><td>Index Seek</td><td>Index Seek</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]), SEEK:([DBI202].[dbo].[NhanVienDemo].[depNum]=CONVERT_IMPLICIT(int,[@1],0) AND [DBI202].[dbo].[NhanVienDemo].[luong] &gt; CONVERT_IMPLICIT(decimal(10,0),[@2],0)) ORDERED FORWARD</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td>1</td><td>0.0031250000465661287</td><td>0.00015809999604243785</td><td>20</td><td>0.0032830999698489904</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[luong]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>id</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>(0 dòng)</td><td></td></tr>
</tbody>
</table>
<table>
<thead><tr><th>Rows</th><th>Executes</th><th>StmtText</th><th>StmtId</th><th>NodeId</th><th>Parent</th><th>PhysicalOp</th><th>LogicalOp</th><th>Argument</th><th>DefinedValues</th><th>EstimateRows</th><th>EstimateIO</th><th>EstimateCPU</th><th>AvgRowSize</th><th>TotalSubtreeCost</th><th>OutputList</th><th>Warnings</th><th>Type</th><th>Parallel</th><th>EstimateExecutions</th></tr></thead>
<tbody>
<tr><td>0</td><td>1</td><td>SELECT [id],[depNum] FROM [dbo].[NhanVienDemo] WHERE [luong]&gt;@1</td><td>1</td><td>1</td><td>0</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>1</td><td><em>NULL</em></td><td><em>NULL</em></td><td><em>NULL</em></td><td>0.09924495965242386</td><td><em>NULL</em></td><td><em>NULL</em></td><td>SELECT</td><td>0</td><td><em>NULL</em></td></tr>
<tr><td>0</td><td>1</td><td>  |--Index Scan(OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]),  WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;CONVERT_IMPLICIT(decimal(10,0),[@1],0)))</td><td>1</td><td>2</td><td>1</td><td>Index Scan</td><td>Index Scan</td><td>OBJECT:([DBI202].[dbo].[NhanVienDemo].[idx_nvdemo3_dep_luong]),  WHERE:([DBI202].[dbo].[NhanVienDemo].[luong]&gt;CONVERT_IMPLICIT(decimal(10,0),[@1],0))</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[depNum]</td><td>1</td><td>0.06608796119689941</td><td>0.033156998455524445</td><td>24</td><td>0.09924495965242386</td><td>[DBI202].[dbo].[NhanVienDemo].[id], [DBI202].[dbo].[NhanVienDemo].[depNum]</td><td><em>NULL</em></td><td>PLAN_ROW</td><td>0</td><td>1</td></tr>
</tbody>
</table>
<ul>
<li><code>WHERE depNum = 3 AND luong &gt; 15000000</code> → <code>Index Seek</code>: <code>depNum</code> là cột ĐẦU TIÊN của chỉ mục, nên engine tìm nhị phân thẳng tới depNum = 3, rồi quét theo khoảng <code>luong</code> trong đó.</li>
<li><code>WHERE luong &gt; 24000000</code> (không có <code>depNum</code>) → <code>Index Scan</code>, không phải seek: <code>luong</code> là cột THỨ HAI, nên engine không thể nhảy vào giữa chỉ mục mà không biết <code>depNum</code> trước — nó đọc cả chỉ mục (nhỏ hơn bảng), vẫn rẻ hơn quét cả bảng, nhưng còn lâu mới là seek.</li>
</ul>
<div class="pitfall">Chỉ mục ghép <code>(A, B)</code> giống danh bạ điện thoại sắp theo họ rồi mới tới tên: hữu ích cho "tìm mọi người họ Nguyễn", vô dụng cho "tìm mọi người có tên là Anh" — bạn phải đọc từng trang. Đặt cột truy vấn của bạn lọc NHIỀU NHẤT lên đầu.</div>`),
    bi(`<h3>🧪 Exercise 4 — CREATE VIEW … WITH CHECK OPTION on SQL Server (~10 min)</h3>
<p class="nhan">Task</p>
<p>Create <code>Employee_Dep1_Checked</code>, department-1 employees, <code>WITH CHECK OPTION</code>. Prove it accepts an insert that stays inside department 1 and refuses one that would land in department 2.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 4: CREATE VIEW ... WITH CHECK OPTION on SQL Server (the slide's Example 1 view never used it)
CREATE VIEW Employee_Dep1_Checked AS
SELECT * FROM tblEmployee WHERE depNum = 1
WITH CHECK OPTION;
GO
-- Accepted: depNum = 1 satisfies the view's own WHERE
INSERT INTO Employee_Dep1_Checked (empSSN, empName, empSalary, empSex, depNum)
  VALUES (100020, N'Đỗ Văn Kiểm', 50000, 'M', 1);
SELECT empSSN, empName, depNum FROM Employee_Dep1_Checked WHERE empSSN = 100020;
GO
-- Refused: depNum = 2 would produce a row the view could never show
INSERT INTO Employee_Dep1_Checked (empSSN, empName, empSalary, empSex, depNum)
  VALUES (100021, N'Đỗ Văn Sai', 50000, 'M', 2);</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>100020</td><td>Đỗ Văn Kiểm</td><td>1</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 550, Level 16, State 1<br>
The attempted insert or update failed because the target view either specifies WITH CHECK OPTION or spans a view that specifies WITH CHECK OPTION and one or more rows resulting from the operation did not qualify under the CHECK OPTION constraint.</b><br>
The statement has been terminated.</div>
<ul>
<li>SSN 100020 with <code>depNum = 1</code> is accepted and immediately visible through the view — no surprise here, unlike slide 39.</li>
<li>SSN 100021 with <code>depNum = 2</code> is refused outright: <strong>Msg 550</strong>, "the target view either specifies WITH CHECK OPTION … and one or more rows … did not qualify". This is the fix for exactly slide 39's silent-NULL problem — <code>WITH CHECK OPTION</code> turns "the row vanishes quietly" into "the row is refused loudly".</li>
</ul>
<div class="meo">🧠 The slide's own Example 1 view (<code>Employee_Dep1</code>) never used <code>WITH CHECK OPTION</code> — that's why slide 39's insert was accepted with a silently-wrong result. Add <code>WITH CHECK OPTION</code> to any updatable view whose whole point is restricting rows (like "only department 1"), unless you deliberately want inserts to be able to leave that scope.</div>`,
    `<h3>🧪 Bài 4 — CREATE VIEW … WITH CHECK OPTION trên SQL Server (~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Tạo <code>Employee_Dep1_Checked</code>, nhân viên phòng 1, <code>WITH CHECK OPTION</code>. Chứng minh nó chấp nhận một lần chèn còn nằm trong phòng 1 và từ chối một lần chèn sẽ rơi vào phòng 2.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 4: CREATE VIEW ... WITH CHECK OPTION on SQL Server (the slide's Example 1 view never used it)
CREATE VIEW Employee_Dep1_Checked AS
SELECT * FROM tblEmployee WHERE depNum = 1
WITH CHECK OPTION;
GO
-- Được chấp nhận: depNum = 1 thoả WHERE của chính view
INSERT INTO Employee_Dep1_Checked (empSSN, empName, empSalary, empSex, depNum)
  VALUES (100020, N'Đỗ Văn Kiểm', 50000, 'M', 1);
SELECT empSSN, empName, depNum FROM Employee_Dep1_Checked WHERE empSSN = 100020;
GO
-- Bị từ chối: depNum = 2 sẽ tạo dòng mà chính view không thấy được
INSERT INTO Employee_Dep1_Checked (empSSN, empName, empSalary, empSex, depNum)
  VALUES (100021, N'Đỗ Văn Sai', 50000, 'M', 2);</code></pre>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>depNum</th></tr></thead>
<tbody>
<tr><td>100020</td><td>Đỗ Văn Kiểm</td><td>1</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 550, Level 16, State 1<br>
The attempted insert or update failed because the target view either specifies WITH CHECK OPTION or spans a view that specifies WITH CHECK OPTION and one or more rows resulting from the operation did not qualify under the CHECK OPTION constraint.</b><br>
The statement has been terminated.</div>
<ul>
<li>SSN 100020 với <code>depNum = 1</code> được chấp nhận và hiện ngay qua view — không bất ngờ gì, khác với slide 39.</li>
<li>SSN 100021 với <code>depNum = 2</code> bị từ chối thẳng: <strong>Msg 550</strong>, "the target view either specifies WITH CHECK OPTION … and one or more rows … did not qualify". Đây chính là cách sửa vấn đề NULL-âm-thầm ở slide 39 — <code>WITH CHECK OPTION</code> biến "dòng biến mất trong im lặng" thành "dòng bị từ chối rõ ràng".</li>
</ul>
<div class="meo">🧠 Chính view Ví dụ 1 của slide (<code>Employee_Dep1</code>) chưa từng dùng <code>WITH CHECK OPTION</code> — đó là lý do câu chèn ở slide 39 được chấp nhận với kết quả sai trong im lặng. Thêm <code>WITH CHECK OPTION</code> vào bất kỳ view cập nhật được nào mà cả mục đích của nó là giới hạn dòng (như "chỉ phòng 1"), trừ khi bạn cố tình muốn insert được phép rời khỏi phạm vi đó.</div>`),
    bi(`<h3>🧪 Exercise 5 — Is a two-table view updatable? Test it (~10 min)</h3>
<p class="nhan">Task</p>
<p><code>NhanVien_Phong</code> joins <code>tblEmployee</code> and <code>tblDepartment</code> (department-1 employees with their department's name). Test: can you <code>UPDATE</code> a single-table column through it? Can you <code>INSERT</code> a new row through it?</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 5: is a view over MORE THAN ONE TABLE (a join) updatable? Test it directly.
CREATE VIEW NhanVien_Phong AS
SELECT te.empSSN, te.empName, td.depName
FROM tblEmployee te JOIN tblDepartment td ON te.depNum = td.depNum
WHERE te.depNum = 1;
GO
SELECT * FROM NhanVien_Phong ORDER BY empSSN;
GO
-- Updating a single-table column through it still works — SQL Server can trace empName back to tblEmployee
UPDATE NhanVien_Phong SET empName = N'Trần Minh Quang (đã sửa)' WHERE empSSN = 30121050001;
SELECT empName FROM tblEmployee WHERE empSSN = 30121050001;
GO
-- INSERT is refused: a new row would need values for BOTH base tables, which SQL Server cannot split
INSERT INTO NhanVien_Phong (empSSN, empName, depName) VALUES (100030, N'Người Mới', N'Phòng lạ');</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>depName</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>Phòng Phần mềm trong nước</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang (đã sửa)</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 4405, Level 16, State 1<br>
View or function 'NhanVien_Phong' is not updatable because the modification affects multiple base tables.</b></div>
<ul>
<li><code>UPDATE NhanVien_Phong SET empName = … WHERE empSSN = …</code> <strong>succeeds</strong>: <code>empName</code> traces unambiguously back to one column of <code>tblEmployee</code>, so SQL Server can rewrite the UPDATE onto the base table.</li>
<li><code>INSERT INTO NhanVien_Phong (empSSN, empName, depName) VALUES (…)</code> is <strong>refused</strong>: <strong>Msg 4405</strong>, "not updatable because the modification affects multiple base tables" — a brand-new row would need a value inserted into BOTH <code>tblEmployee</code> and <code>tblDepartment</code> at once, and SQL Server has no rule for splitting one INSERT into two.</li>
</ul>
<div class="pitfall">"Multi-table view = never updatable" (slide 36's simplified rule) is not quite right: SQL Server allows single-column UPDATEs and DELETEs through some multi-table views when the change stays inside one base table — it is specifically INSERT that is hardest to make work, because a brand-new row has no existing base-table row to anchor to.</div>`,
    `<h3>🧪 Bài 5 — View trên hai bảng có cập nhật được không? Kiểm thật (~10 phút)</h3>
<p class="nhan">Đề</p>
<p><code>NhanVien_Phong</code> join <code>tblEmployee</code> và <code>tblDepartment</code> (nhân viên phòng 1 kèm tên phòng). Kiểm: <code>UPDATE</code> được một cột thuộc một bảng qua view không? <code>INSERT</code> được một dòng mới qua view không?</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 5: is a view over MORE THAN ONE TABLE (a join) updatable? Test it directly.
CREATE VIEW NhanVien_Phong AS
SELECT te.empSSN, te.empName, td.depName
FROM tblEmployee te JOIN tblDepartment td ON te.depNum = td.depNum
WHERE te.depNum = 1;
GO
SELECT * FROM NhanVien_Phong ORDER BY empSSN;
GO
-- Updating a single-table column through it still works — SQL Server can trace empName back to tblEmployee
UPDATE NhanVien_Phong SET empName = N'Trần Minh Quang (đã sửa)' WHERE empSSN = 30121050001;
SELECT empName FROM tblEmployee WHERE empSSN = 30121050001;
GO
-- INSERT is refused: a new row would need values for BOTH base tables, which SQL Server cannot split
INSERT INTO NhanVien_Phong (empSSN, empName, depName) VALUES (100030, N'Người Mới', N'Phòng lạ');</code></pre>
<table>
<thead><tr><th>empSSN</th><th>empName</th><th>depName</th></tr></thead>
<tbody>
<tr><td>30121050001</td><td>Trần Minh Quang</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050002</td><td>Hoàng Thị Hà</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050003</td><td>Võ Việt Anh</td><td>Phòng Phần mềm trong nước</td></tr>
<tr><td>30121050004</td><td>Lê Thị Lan Anh</td><td>Phòng Phần mềm trong nước</td></tr>
</tbody>
</table>
<div class="out">(1 row affected)</div>
<table>
<thead><tr><th>empName</th></tr></thead>
<tbody>
<tr><td>Trần Minh Quang (đã sửa)</td></tr>
</tbody>
</table>
<div class="out"><b>Msg 4405, Level 16, State 1<br>
View or function 'NhanVien_Phong' is not updatable because the modification affects multiple base tables.</b></div>
<ul>
<li><code>UPDATE NhanVien_Phong SET empName = … WHERE empSSN = …</code> <strong>thành công</strong>: <code>empName</code> chỉ rõ ràng về một cột của <code>tblEmployee</code>, nên SQL Server dịch được UPDATE đó về bảng gốc.</li>
<li><code>INSERT INTO NhanVien_Phong (empSSN, empName, depName) VALUES (…)</code> <strong>bị từ chối</strong>: <strong>Msg 4405</strong>, "not updatable because the modification affects multiple base tables" — một dòng hoàn toàn mới cần giá trị chèn vào CẢ <code>tblEmployee</code> LẪN <code>tblDepartment</code> cùng lúc, mà SQL Server không có luật nào để tách một INSERT thành hai.</li>
</ul>
<div class="pitfall">"View nhiều bảng = không bao giờ cập nhật được" (luật đơn giản hoá của slide 36) không hoàn toàn đúng: SQL Server cho phép UPDATE/DELETE một cột qua vài view nhiều bảng khi thay đổi chỉ nằm trong một bảng gốc — chính INSERT mới là thứ khó làm được nhất, vì một dòng hoàn toàn mới không có dòng bảng gốc nào sẵn có để neo vào.</div>`),
    bi(`<h3>🧪 Exercise 6 — Partial index (PostgreSQL only, ~10 min)</h3>
<p class="nhan">Task</p>
<p>FUHCompany's department 1 is queried by name very often, other departments rarely. Build an index that only covers department 1 — smaller and faster to maintain than indexing every row — and prove PostgreSQL can (and cannot) use it.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 6 (PostgreSQL only — T-SQL has no equivalent): a PARTIAL index, indexing only the rows that
-- matter for one common query, smaller and faster than indexing the whole table
CREATE INDEX idx_employee_dep1_only ON tblemployee(empname) WHERE depnum = 1;

-- FUHCompany has only 14 rows: the planner always prefers a Seq Scan on data this small, index or not.
-- SET enable_seqscan = off forces it to consider the index anyway, so we can still see it in the plan.
SET enable_seqscan = off;

EXPLAIN SELECT empname FROM tblemployee WHERE depnum = 1 AND empname = 'Hoàng Thị Hà';

-- The same predicate the index was built with must appear in the query, or PostgreSQL cannot use a
-- partial index at all — it falls back to a full scan even with enable_seqscan off
EXPLAIN SELECT empname FROM tblemployee WHERE depnum = 3 AND empname = 'Nguyễn Thị Mai';</code></pre>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Index Only Scan using idx_employee_dep1_only on tblemployee  (cost=0.13..8.15 rows=1 width=118)</td></tr>
<tr><td>  Index Cond: (empname = 'Hoàng Thị Hà'::text)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Seq Scan on tblemployee  (cost=10000000000.00..10000000001.21 rows=1 width=118)</td></tr>
<tr><td>  Filter: ((depnum = 3) AND ((empname)::text = 'Nguyễn Thị Mai'::text))</td></tr>
<tr><td>JIT:</td></tr>
<tr><td>  Functions: 4</td></tr>
<tr><td>  Options: Inlining true, Optimization true, Expressions true, Deforming true</td></tr>
</tbody>
</table>
<ul>
<li><code>SET enable_seqscan = off</code> is a debugging trick: FUHCompany has only 14 rows, so PostgreSQL's planner always prefers a plain <code>Seq Scan</code> regardless of any index — turning off sequential scan forces it to show what the index-based plan would look like.</li>
<li><code>WHERE depnum = 1 AND empname = 'Hoàng Thị Hà'</code> → <code>Index Only Scan using idx_employee_dep1_only</code>, and the <code>Index Cond</code> mentions only <code>empname</code> — <code>depnum = 1</code> is baked into the index definition itself, so it costs nothing to check at query time.</li>
<li><code>WHERE depnum = 3 AND …</code> → still <code>Seq Scan</code>, even with <code>enable_seqscan</code> forced off (note the absurd cost <code>10000000000</code> — the planner's way of saying "there is truly no other option"): a partial index can only serve a query whose <code>WHERE</code> matches (or implies) the index's own condition.</li>
</ul>
<div class="meo">🧠 T-SQL has no equivalent of a partial index — the closest is a <strong>filtered index</strong> (<code>CREATE INDEX … WHERE …</code>, since SQL Server 2008), same idea, different name.</div>`,
    `<h3>🧪 Bài 6 — Chỉ mục một phần (chỉ PostgreSQL, ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Phòng 1 của FUHCompany được tra tên rất thường xuyên, các phòng khác thì hiếm. Dựng một chỉ mục chỉ phủ phòng 1 — nhỏ và nhanh duy trì hơn đánh chỉ mục mọi dòng — và chứng minh PostgreSQL dùng được (và không dùng được) nó.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 6 (PostgreSQL only — T-SQL has no equivalent): a PARTIAL index, indexing only the rows that
-- matter for one common query, smaller and faster than indexing the whole table
CREATE INDEX idx_employee_dep1_only ON tblemployee(empname) WHERE depnum = 1;

-- FUHCompany has only 14 rows: the planner always prefers a Seq Scan on data this small, index or not.
-- SET enable_seqscan = off forces it to consider the index anyway, so we can still see it in the plan.
SET enable_seqscan = off;

EXPLAIN SELECT empname FROM tblemployee WHERE depnum = 1 AND empname = 'Hoàng Thị Hà';

-- The same predicate the index was built with must appear in the query, or PostgreSQL cannot use a
-- partial index at all — it falls back to a full scan even with enable_seqscan off
EXPLAIN SELECT empname FROM tblemployee WHERE depnum = 3 AND empname = 'Nguyễn Thị Mai';</code></pre>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Index Only Scan using idx_employee_dep1_only on tblemployee  (cost=0.13..8.15 rows=1 width=118)</td></tr>
<tr><td>  Index Cond: (empname = 'Hoàng Thị Hà'::text)</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>QUERY PLAN</th></tr></thead>
<tbody>
<tr><td>Seq Scan on tblemployee  (cost=10000000000.00..10000000001.21 rows=1 width=118)</td></tr>
<tr><td>  Filter: ((depnum = 3) AND ((empname)::text = 'Nguyễn Thị Mai'::text))</td></tr>
<tr><td>JIT:</td></tr>
<tr><td>  Functions: 4</td></tr>
<tr><td>  Options: Inlining true, Optimization true, Expressions true, Deforming true</td></tr>
</tbody>
</table>
<ul>
<li><code>SET enable_seqscan = off</code> là mẹo gỡ lỗi: FUHCompany chỉ có 14 dòng, nên bộ lập kế hoạch của PostgreSQL luôn thích <code>Seq Scan</code> trơn bất kể có chỉ mục hay không — tắt quét tuần tự buộc nó phải cho thấy kế hoạch dựa trên chỉ mục sẽ trông thế nào.</li>
<li><code>WHERE depnum = 1 AND empname = 'Hoàng Thị Hà'</code> → <code>Index Only Scan using idx_employee_dep1_only</code>, và <code>Index Cond</code> chỉ nhắc tới <code>empname</code> — <code>depnum = 1</code> đã được nướng sẵn vào chính định nghĩa chỉ mục, nên không tốn gì để kiểm lúc truy vấn.</li>
<li><code>WHERE depnum = 3 AND …</code> → vẫn <code>Seq Scan</code>, dù đã ép <code>enable_seqscan</code> tắt (để ý chi phí phi lý <code>10000000000</code> — cách bộ lập kế hoạch nói "thật sự không có lựa chọn nào khác"): một chỉ mục một phần chỉ phục vụ được truy vấn có <code>WHERE</code> khớp (hoặc suy ra được) điều kiện của chính chỉ mục.</li>
</ul>
<div class="meo">🧠 T-SQL không có thứ tương đương chỉ mục một phần — gần nhất là <strong>filtered index</strong> (<code>CREATE INDEX … WHERE …</code>, từ SQL Server 2008), cùng ý tưởng, khác tên.</div>`),
    bi(`<h3>🧪 Exercise 7 — Materialized view (PostgreSQL only, ~10 min)</h3>
<p class="nhan">Task</p>
<p>Build a view summarising average salary per department. Show that a normal view always reflects new data, but the same query as a MATERIALIZED VIEW does not — until refreshed.</p>
<p class="nhan">Solution and real output</p>
<pre><code class="language-sql">-- Exercise 7 (PostgreSQL only): a MATERIALIZED VIEW physically stores its result and must be REFRESHed —
-- the opposite trade-off from a normal view (fast to read, can go stale)
CREATE MATERIALIZED VIEW luong_theo_phong AS
SELECT depnum, COUNT(*) AS so_nhan_vien, AVG(empsalary) AS luong_tb
FROM tblemployee GROUP BY depnum;

SELECT * FROM luong_theo_phong ORDER BY depnum;

-- Insert a new employee — the materialized view does NOT change yet
INSERT INTO tblemployee(empssn, empname, empsalary, empsex, depnum)
  VALUES (100040, 'Người Mới', 200000, 'M', 1);

SELECT * FROM luong_theo_phong WHERE depnum = 1;

REFRESH MATERIALIZED VIEW luong_theo_phong;

SELECT * FROM luong_theo_phong WHERE depnum = 1;</code></pre>
<table>
<thead><tr><th>depnum</th><th>so_nhan_vien</th><th>luong_tb</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>86250.000000000000</td></tr>
<tr><td>2</td><td>4</td><td>81750.000000000000</td></tr>
<tr><td>3</td><td>3</td><td>60000.000000000000</td></tr>
<tr><td>4</td><td>1</td><td>70000.000000000000</td></tr>
<tr><td>5</td><td>2</td><td>51500.000000000000</td></tr>
</tbody>
</table>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>depnum</th><th>so_nhan_vien</th><th>luong_tb</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>86250.000000000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depnum</th><th>so_nhan_vien</th><th>luong_tb</th></tr></thead>
<tbody>
<tr><td>1</td><td>5</td><td>109000.000000000000</td></tr>
</tbody>
</table>
<ul>
<li>Initial <code>luong_theo_phong</code> shows department 1 with 4 employees, average 86250.</li>
<li>After inserting a 5th department-1 employee (salary 200000), the materialized view STILL shows 4 rows / 86250 — the data was physically stored at creation time and is now stale.</li>
<li>Only after <code>REFRESH MATERIALIZED VIEW luong_theo_phong</code> does it show 5 employees / 109000.</li>
</ul>
<div class="pitfall">This is the opposite trade-off from an ordinary view: a normal view is always correct but recomputed every read (slow if the underlying query is expensive); a materialized view is fast to read but can silently go stale — you (or a scheduled job) must remember to <code>REFRESH</code> it. Never use a materialized view for data that must always be current (e.g. an account balance).</div>`,
    `<h3>🧪 Bài 7 — Materialized view (chỉ PostgreSQL, ~10 phút)</h3>
<p class="nhan">Đề</p>
<p>Dựng một view tóm tắt lương trung bình theo phòng. Cho thấy một view thường luôn phản ánh dữ liệu mới, nhưng cùng truy vấn đó dạng MATERIALIZED VIEW thì không — cho tới khi được làm mới.</p>
<p class="nhan">Lời giải và output thật</p>
<pre><code class="language-sql">-- Exercise 7 (PostgreSQL only): a MATERIALIZED VIEW physically stores its result and must be REFRESHed —
-- the opposite trade-off from a normal view (fast to read, can go stale)
CREATE MATERIALIZED VIEW luong_theo_phong AS
SELECT depnum, COUNT(*) AS so_nhan_vien, AVG(empsalary) AS luong_tb
FROM tblemployee GROUP BY depnum;

SELECT * FROM luong_theo_phong ORDER BY depnum;

-- Insert a new employee — the materialized view does NOT change yet
INSERT INTO tblemployee(empssn, empname, empsalary, empsex, depnum)
  VALUES (100040, 'Người Mới', 200000, 'M', 1);

SELECT * FROM luong_theo_phong WHERE depnum = 1;

REFRESH MATERIALIZED VIEW luong_theo_phong;

SELECT * FROM luong_theo_phong WHERE depnum = 1;</code></pre>
<table>
<thead><tr><th>depnum</th><th>so_nhan_vien</th><th>luong_tb</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>86250.000000000000</td></tr>
<tr><td>2</td><td>4</td><td>81750.000000000000</td></tr>
<tr><td>3</td><td>3</td><td>60000.000000000000</td></tr>
<tr><td>4</td><td>1</td><td>70000.000000000000</td></tr>
<tr><td>5</td><td>2</td><td>51500.000000000000</td></tr>
</tbody>
</table>
<div class="out">INSERT 0 1</div>
<table>
<thead><tr><th>depnum</th><th>so_nhan_vien</th><th>luong_tb</th></tr></thead>
<tbody>
<tr><td>1</td><td>4</td><td>86250.000000000000</td></tr>
</tbody>
</table>
<table>
<thead><tr><th>depnum</th><th>so_nhan_vien</th><th>luong_tb</th></tr></thead>
<tbody>
<tr><td>1</td><td>5</td><td>109000.000000000000</td></tr>
</tbody>
</table>
<ul>
<li><code>luong_theo_phong</code> ban đầu cho thấy phòng 1 có 4 nhân viên, trung bình 86250.</li>
<li>Sau khi chèn nhân viên phòng 1 thứ 5 (lương 200000), materialized view VẪN cho thấy 4 dòng / 86250 — dữ liệu đã được lưu vật lý lúc tạo và giờ đã cũ.</li>
<li>Chỉ sau <code>REFRESH MATERIALIZED VIEW luong_theo_phong</code> nó mới cho thấy 5 nhân viên / 109000.</li>
</ul>
<div class="pitfall">Đây là đánh đổi ngược lại với view thường: view thường luôn đúng nhưng tính lại mỗi lần đọc (chậm nếu truy vấn gốc tốn kém); materialized view đọc nhanh nhưng có thể lặng lẽ trở nên cũ — bạn (hoặc một job định kỳ) phải nhớ <code>REFRESH</code> nó. Đừng bao giờ dùng materialized view cho dữ liệu phải luôn mới nhất (ví dụ số dư tài khoản).</div>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>A group of database operations executed as one all-or-nothing unit.</td></tr>
<tr><td><strong>atomicity</strong></td><td>tính nguyên tử</td><td>A transaction runs entirely or not at all — no partial result is ever kept.</td></tr>
<tr><td><strong>ACID</strong></td><td>ACID (Nguyên tử, Nhất quán, Cô lập, Bền vững)</td><td>Atomicity, Consistency, Isolation, Durability — the four guarantees a transaction gives.</td></tr>
<tr><td><strong>consistency</strong></td><td>tính nhất quán</td><td>A transaction moves the database from one rule-abiding state to another.</td></tr>
<tr><td><strong>isolation</strong></td><td>tính cô lập</td><td>A transaction is not disturbed by other transactions' unfinished work.</td></tr>
<tr><td><strong>durability</strong></td><td>tính bền vững</td><td>Once committed, a transaction's changes survive any later crash.</td></tr>
<tr><td><strong>dirty read</strong></td><td>đọc bẩn</td><td>Reading a value written by a transaction that has not yet committed and might still roll back.</td></tr>
<tr><td><strong>isolation level</strong></td><td>mức cô lập</td><td>A setting controlling how much of other transactions' in-progress work you may see (READ UNCOMMITTED … SERIALIZABLE).</td></tr>
<tr><td><strong>savepoint (SAVE TRANSACTION)</strong></td><td>điểm lưu</td><td>A named checkpoint inside a transaction that a ROLLBACK can target without undoing the whole transaction.</td></tr>
<tr><td><strong>XACT_STATE()</strong></td><td>trạng thái giao dịch</td><td>A T-SQL function: 1 = open and committable, 0 = none open, -1 = open but doomed (must ROLLBACK).</td></tr>
<tr><td><strong>index</strong></td><td>chỉ mục</td><td>A data structure that lets the engine jump straight to matching rows instead of scanning every row.</td></tr>
<tr><td><strong>clustered index</strong></td><td>chỉ mục gom cụm</td><td>An index whose order IS the physical storage order of the table — at most one per table.</td></tr>
<tr><td><strong>nonclustered index</strong></td><td>chỉ mục không gom cụm</td><td>A separate structure pointing back to the row; a table can have several.</td></tr>
<tr><td><strong>seek vs. scan</strong></td><td>tìm trực tiếp và quét</td><td>A seek jumps straight to matching rows; a scan reads every row (or every index entry) and checks each one.</td></tr>
<tr><td><strong>sargable</strong></td><td>khả-dùng-được-với-chỉ-mục</td><td>A condition written so the engine can seek an index on it — a bare column, not one wrapped in a function.</td></tr>
<tr><td><strong>covering index (INCLUDE)</strong></td><td>chỉ mục bao phủ</td><td>An index that carries every column a query needs, so the engine never touches the base table.</td></tr>
<tr><td><strong>key lookup</strong></td><td>tra ngược theo khoá</td><td>The extra trip back to the table (or clustered index) an index seek needs when it lacks a column the query asked for.</td></tr>
<tr><td><strong>view</strong></td><td>view (khung nhìn)</td><td>A saved query, queried like a table but storing no data of its own.</td></tr>
<tr><td><strong>updatable view</strong></td><td>view cập nhật được</td><td>A view simple enough (roughly: one table, no DISTINCT/aggregate/computed column) that INSERT/UPDATE/DELETE through it can be rewritten onto the base table.</td></tr>
<tr><td><strong>WITH CHECK OPTION</strong></td><td>WITH CHECK OPTION (buộc thoả điều kiện view)</td><td>Rejects any write through a view that would create a row the view's own WHERE could not then show.</td></tr>
<tr><td><strong>partial / filtered index</strong></td><td>chỉ mục một phần</td><td>An index covering only the rows matching a WHERE condition — smaller, faster to maintain.</td></tr>
<tr><td><strong>materialized view</strong></td><td>materialized view (view lưu sẵn)</td><td>A view whose result is physically stored and must be REFRESHed — fast to read, can go stale.</td></tr>
<tr><td><strong>execution plan</strong></td><td>kế hoạch thực thi</td><td>The engine's chosen strategy for running a query, readable as text (SET STATISTICS PROFILE) or a graphical tree.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>transaction</strong></td><td>giao dịch</td><td>Một nhóm phép toán CSDL được thực thi như một đơn vị được-ăn-cả-ngã-về-không.</td></tr>
<tr><td><strong>atomicity</strong></td><td>tính nguyên tử</td><td>Một giao dịch chạy trọn vẹn hoặc không chạy gì — không bao giờ giữ lại kết quả nửa vời.</td></tr>
<tr><td><strong>ACID</strong></td><td>ACID (Nguyên tử, Nhất quán, Cô lập, Bền vững)</td><td>Atomicity, Consistency, Isolation, Durability — bốn lời hứa một giao dịch đưa ra.</td></tr>
<tr><td><strong>consistency</strong></td><td>tính nhất quán</td><td>Giao dịch đưa CSDL từ một trạng thái tuân luật sang trạng thái tuân luật khác.</td></tr>
<tr><td><strong>isolation</strong></td><td>tính cô lập</td><td>Giao dịch không bị làm phiền bởi việc dở dang của giao dịch khác.</td></tr>
<tr><td><strong>durability</strong></td><td>tính bền vững</td><td>Đã commit thì thay đổi sống sót qua mọi sự cố sau đó.</td></tr>
<tr><td><strong>dirty read</strong></td><td>đọc bẩn</td><td>Đọc một giá trị do một giao dịch chưa commit ghi ra, có thể vẫn bị rollback.</td></tr>
<tr><td><strong>isolation level</strong></td><td>mức cô lập</td><td>Cài đặt kiểm soát bạn thấy được bao nhiêu phần việc dở dang của giao dịch khác (READ UNCOMMITTED … SERIALIZABLE).</td></tr>
<tr><td><strong>savepoint (SAVE TRANSACTION)</strong></td><td>điểm lưu</td><td>Một mốc đặt tên trong giao dịch mà ROLLBACK có thể nhắm tới mà không huỷ cả giao dịch.</td></tr>
<tr><td><strong>XACT_STATE()</strong></td><td>trạng thái giao dịch</td><td>Hàm T-SQL: 1 = đang mở và commit được, 0 = không có giao dịch, -1 = đang mở nhưng hỏng (buộc phải ROLLBACK).</td></tr>
<tr><td><strong>index</strong></td><td>chỉ mục</td><td>Cấu trúc dữ liệu giúp engine nhảy thẳng tới dòng khớp thay vì quét từng dòng.</td></tr>
<tr><td><strong>clustered index</strong></td><td>chỉ mục gom cụm</td><td>Chỉ mục mà thứ tự của nó CHÍNH LÀ thứ tự lưu trữ vật lý của bảng — nhiều nhất một cái mỗi bảng.</td></tr>
<tr><td><strong>nonclustered index</strong></td><td>chỉ mục không gom cụm</td><td>Cấu trúc riêng trỏ ngược về dòng dữ liệu; một bảng có thể có nhiều cái.</td></tr>
<tr><td><strong>seek vs. scan</strong></td><td>tìm trực tiếp và quét</td><td>Seek nhảy thẳng tới dòng khớp; scan đọc mọi dòng (hay mọi mục chỉ mục) và kiểm từng cái.</td></tr>
<tr><td><strong>sargable</strong></td><td>khả-dùng-được-với-chỉ-mục</td><td>Điều kiện viết sao cho engine seek được chỉ mục trên đó — cột trơn, không bị bọc trong hàm.</td></tr>
<tr><td><strong>covering index (INCLUDE)</strong></td><td>chỉ mục bao phủ</td><td>Chỉ mục mang đủ mọi cột một truy vấn cần, nên engine không bao giờ phải đụng tới bảng gốc.</td></tr>
<tr><td><strong>key lookup</strong></td><td>tra ngược theo khoá</td><td>Lượt tra ngược thêm về bảng (hay clustered index) mà một index seek cần khi thiếu một cột truy vấn yêu cầu.</td></tr>
<tr><td><strong>view</strong></td><td>view (khung nhìn)</td><td>Một truy vấn được lưu, truy vấn được như bảng nhưng không lưu dữ liệu riêng.</td></tr>
<tr><td><strong>updatable view</strong></td><td>view cập nhật được</td><td>View đủ đơn giản (đại khái: một bảng, không DISTINCT/hàm gộp/cột tính toán) để INSERT/UPDATE/DELETE qua nó dịch được về bảng gốc.</td></tr>
<tr><td><strong>WITH CHECK OPTION</strong></td><td>WITH CHECK OPTION (buộc thoả điều kiện view)</td><td>Từ chối mọi ghi qua view sẽ tạo ra một dòng mà WHERE của chính view sau đó không thấy được.</td></tr>
<tr><td><strong>partial / filtered index</strong></td><td>chỉ mục một phần</td><td>Chỉ mục chỉ phủ các dòng thoả một điều kiện WHERE — nhỏ hơn, nhanh duy trì hơn.</td></tr>
<tr><td><strong>materialized view</strong></td><td>materialized view (view lưu sẵn)</td><td>View mà kết quả được lưu vật lý, phải REFRESH — đọc nhanh, có thể trở nên cũ.</td></tr>
<tr><td><strong>execution plan</strong></td><td>kế hoạch thực thi</td><td>Chiến lược engine chọn để chạy một truy vấn, đọc được dạng chữ (SET STATISTICS PROFILE) hay cây đồ hoạ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>🔁 T-SQL ↔ PostgreSQL — transactions, indexes &amp; views of this chapter</h2>
<table>
<thead><tr><th>Task</th><th>T-SQL (SQL Server)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Start a transaction</td><td><code>BEGIN TRANSACTION</code> (or <code>BEGIN TRAN</code>)</td><td><code>BEGIN</code> (or <code>START TRANSACTION</code>)</td></tr>
<tr><td>No transaction started at all</td><td>every statement is its own transaction</td><td>autocommit — every statement is its own transaction</td></tr>
<tr><td>Savepoint</td><td><code>SAVE TRANSACTION name</code> / <code>ROLLBACK TRANSACTION name</code></td><td><code>SAVEPOINT name</code> / <code>ROLLBACK TO SAVEPOINT name</code></td></tr>
<tr><td>Set isolation level</td><td><code>SET TRANSACTION ISOLATION LEVEL …</code></td><td><code>BEGIN ISOLATION LEVEL …</code> or <code>SET TRANSACTION ISOLATION LEVEL …</code></td></tr>
<tr><td>Default isolation</td><td>READ COMMITTED</td><td>READ COMMITTED (but true READ UNCOMMITTED does not exist — MVCC)</td></tr>
<tr><td>Read-only transaction</td><td>no dedicated statement</td><td><code>BEGIN READ ONLY</code> (real, enforced)</td></tr>
<tr><td>Error handling</td><td><code>BEGIN TRY … END TRY BEGIN CATCH … END CATCH</code>, <code>XACT_STATE()</code></td><td>exceptions inside <code>PL/pgSQL</code> functions (<code>EXCEPTION WHEN …</code>); a plain multi-statement script aborts the whole batch on error</td></tr>
<tr><td>Clustered storage order</td><td><code>CREATE CLUSTERED INDEX</code> (maintained automatically)</td><td>no clustered index — <code>CLUSTER table USING index</code> reorders ONCE, not maintained</td></tr>
<tr><td>Ordinary index</td><td><code>CREATE [NONCLUSTERED] INDEX i ON t(c)</code></td><td><code>CREATE INDEX i ON t(c)</code></td></tr>
<tr><td>Covering index</td><td><code>CREATE INDEX i ON t(c) INCLUDE (c2)</code></td><td><code>CREATE INDEX i ON t(c) INCLUDE (c2)</code> (since v11)</td></tr>
<tr><td>Index on some rows only</td><td>filtered index: <code>CREATE INDEX i ON t(c) WHERE cond</code></td><td>partial index: <code>CREATE INDEX i ON t(c) WHERE cond</code></td></tr>
<tr><td>Read the plan</td><td><code>SET STATISTICS PROFILE ON</code> / graphical plan</td><td><code>EXPLAIN</code> / <code>EXPLAIN ANALYZE</code></td></tr>
<tr><td>View</td><td><code>CREATE VIEW v AS SELECT …</code></td><td><code>CREATE VIEW v AS SELECT …</code></td></tr>
<tr><td>Restrict writes through a view</td><td><code>WITH CHECK OPTION</code></td><td><code>WITH CHECK OPTION</code></td></tr>
<tr><td>Stored, refreshable query result</td><td>no built-in equivalent (roll your own with a table + job)</td><td><code>CREATE MATERIALIZED VIEW</code> / <code>REFRESH MATERIALIZED VIEW</code></td></tr>
</tbody>
</table>`,
    `<h2>🔁 T-SQL ↔ PostgreSQL — giao dịch, chỉ mục &amp; view của chương này</h2>
<table>
<thead><tr><th>Việc</th><th>T-SQL (SQL Server)</th><th>PostgreSQL</th></tr></thead>
<tbody>
<tr><td>Bắt đầu giao dịch</td><td><code>BEGIN TRANSACTION</code> (hoặc <code>BEGIN TRAN</code>)</td><td><code>BEGIN</code> (hoặc <code>START TRANSACTION</code>)</td></tr>
<tr><td>Không mở giao dịch nào cả</td><td>mỗi câu là một giao dịch riêng</td><td>autocommit — mỗi câu là một giao dịch riêng</td></tr>
<tr><td>Điểm lưu</td><td><code>SAVE TRANSACTION tên</code> / <code>ROLLBACK TRANSACTION tên</code></td><td><code>SAVEPOINT tên</code> / <code>ROLLBACK TO SAVEPOINT tên</code></td></tr>
<tr><td>Đặt mức cô lập</td><td><code>SET TRANSACTION ISOLATION LEVEL …</code></td><td><code>BEGIN ISOLATION LEVEL …</code> hoặc <code>SET TRANSACTION ISOLATION LEVEL …</code></td></tr>
<tr><td>Mức cô lập mặc định</td><td>READ COMMITTED</td><td>READ COMMITTED (nhưng READ UNCOMMITTED thật không tồn tại — MVCC)</td></tr>
<tr><td>Giao dịch chỉ đọc</td><td>không có câu riêng</td><td><code>BEGIN READ ONLY</code> (thật, được thực thi)</td></tr>
<tr><td>Xử lý lỗi</td><td><code>BEGIN TRY … END TRY BEGIN CATCH … END CATCH</code>, <code>XACT_STATE()</code></td><td>ngoại lệ trong hàm <code>PL/pgSQL</code> (<code>EXCEPTION WHEN …</code>); một script nhiều câu trơn thì cả lô bị huỷ khi có lỗi</td></tr>
<tr><td>Thứ tự lưu vật lý gom cụm</td><td><code>CREATE CLUSTERED INDEX</code> (tự duy trì)</td><td>không có clustered index — <code>CLUSTER table USING index</code> sắp lại MỘT LẦN, không tự duy trì</td></tr>
<tr><td>Chỉ mục thường</td><td><code>CREATE [NONCLUSTERED] INDEX i ON t(c)</code></td><td><code>CREATE INDEX i ON t(c)</code></td></tr>
<tr><td>Chỉ mục bao phủ</td><td><code>CREATE INDEX i ON t(c) INCLUDE (c2)</code></td><td><code>CREATE INDEX i ON t(c) INCLUDE (c2)</code> (từ bản 11)</td></tr>
<tr><td>Chỉ mục trên một phần dòng</td><td>filtered index: <code>CREATE INDEX i ON t(c) WHERE điều_kiện</code></td><td>partial index: <code>CREATE INDEX i ON t(c) WHERE điều_kiện</code></td></tr>
<tr><td>Đọc kế hoạch</td><td><code>SET STATISTICS PROFILE ON</code> / kế hoạch đồ hoạ</td><td><code>EXPLAIN</code> / <code>EXPLAIN ANALYZE</code></td></tr>
<tr><td>View</td><td><code>CREATE VIEW v AS SELECT …</code></td><td><code>CREATE VIEW v AS SELECT …</code></td></tr>
<tr><td>Giới hạn ghi qua view</td><td><code>WITH CHECK OPTION</code></td><td><code>WITH CHECK OPTION</code></td></tr>
<tr><td>Kết quả truy vấn lưu sẵn, làm mới được</td><td>không có thứ tương đương dựng sẵn (tự làm bằng bảng + job)</td><td><code>CREATE MATERIALIZED VIEW</code> / <code>REFRESH MATERIALIZED VIEW</code></td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Summary — Chapter 8 in 8 points</h2>
<ol>
<li><strong>A transaction</strong> groups statements so a half-finished change never survives: <code>BEGIN TRANSACTION … COMMIT</code> (keep) or <code>… ROLLBACK</code> (undo everything back to the BEGIN). <code>SAVE TRANSACTION</code> lets you undo only part of it.</li>
<li><strong>ACID</strong>: Atomicity (all-or-nothing), Consistency (rules still hold), Isolation (transactions don't see each other's unfinished work), Durability (committed = permanent).</li>
<li><strong>Isolation levels</strong>, loosest to strictest: READ UNCOMMITTED (allows dirty reads), READ COMMITTED (T-SQL default), REPEATABLE READ, SERIALIZABLE. PostgreSQL's default is the same name, but built on MVCC — dirty reads are structurally impossible even at READ UNCOMMITTED.</li>
<li><strong>An index</strong> lets the engine seek straight to matching rows instead of scanning every one — but it is USELESS the moment you wrap the indexed column in a function, or start a LIKE pattern with a leading <code>%</code>.</li>
<li><strong>Clustered vs. nonclustered</strong>: clustered IS the table's physical order (at most one); nonclustered is a separate, slimmer structure that may need an extra Key Lookup — unless you <code>INCLUDE</code> the missing columns to make it a covering index.</li>
<li><strong>Composite index column order matters</strong>: put the column most queries filter on FIRST — a query that only filters the second column cannot seek it.</li>
<li><strong>A view</strong> is a saved query with no data of its own — always recomputed live. <code>DROP VIEW</code> never touches the base table; <code>DROP TABLE</code> on the base breaks the view.</li>
<li><strong>Updatability isn't all-or-nothing</strong>: a computed column in the SELECT list makes INSERT flatly refused (Msg 4406); a filter column simply missing from the SELECT list lets INSERT succeed but silently produce a row the view can't see — <code>WITH CHECK OPTION</code> turns that silent surprise into a loud, honest error.</li>
</ol>`,
    `<h2>📌 Tóm tắt — Chương 8 trong 8 ý</h2>
<ol>
<li><strong>Giao dịch</strong> gom nhiều câu để một thay đổi dở dang không bao giờ tồn tại: <code>BEGIN TRANSACTION … COMMIT</code> (giữ lại) hoặc <code>… ROLLBACK</code> (lùi mọi thứ về trước BEGIN). <code>SAVE TRANSACTION</code> cho phép chỉ lùi một phần.</li>
<li><strong>ACID</strong>: Nguyên tử (được ăn cả, ngã về không), Nhất quán (luật vẫn đúng), Cô lập (giao dịch không thấy việc dở dang của nhau), Bền vững (đã commit là vĩnh viễn).</li>
<li><strong>Mức cô lập</strong>, lỏng tới chặt: READ UNCOMMITTED (cho đọc bẩn), READ COMMITTED (mặc định T-SQL), REPEATABLE READ, SERIALIZABLE. PostgreSQL mặc định cùng tên, nhưng dựng trên MVCC — đọc bẩn về cấu trúc là không thể xảy ra kể cả ở READ UNCOMMITTED.</li>
<li><strong>Chỉ mục</strong> giúp engine seek thẳng tới dòng khớp thay vì quét từng dòng — nhưng VÔ DỤNG ngay khi bạn bọc cột có chỉ mục trong một hàm, hoặc bắt đầu mẫu LIKE bằng <code>%</code>.</li>
<li><strong>Clustered vs. nonclustered</strong>: clustered CHÍNH LÀ thứ tự vật lý của bảng (nhiều nhất một cái); nonclustered là cấu trúc riêng, mảnh hơn, có thể cần thêm một Key Lookup — trừ khi bạn <code>INCLUDE</code> cột còn thiếu để nó thành chỉ mục bao phủ.</li>
<li><strong>Thứ tự cột trong chỉ mục ghép quan trọng</strong>: đặt cột được truy vấn lọc nhiều nhất lên ĐẦU — truy vấn chỉ lọc cột thứ hai thì không seek được.</li>
<li><strong>View</strong> là một truy vấn được lưu, không có dữ liệu riêng — luôn tính lại sống. <code>DROP VIEW</code> không bao giờ đụng bảng gốc; <code>DROP TABLE</code> bảng gốc làm view hỏng.</li>
<li><strong>Cập nhật được không phải chuyện có-hoặc-không</strong>: một cột tính toán trong danh sách SELECT làm INSERT bị từ chối thẳng (Msg 4406); một cột lọc chỉ đơn giản thiếu trong danh sách SELECT thì để INSERT thành công nhưng lặng lẽ tạo ra một dòng view không thấy được — <code>WITH CHECK OPTION</code> biến bất ngờ im lặng đó thành một lỗi rõ ràng, trung thực.</li>
</ol>`),
  ].join('\n'),
};

/* ───────── Quiz (dbi202-quiz-4) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'In ACID, which letter guarantees that once a transaction commits, its changes survive a crash the very next second?|||Trong ACID, chữ nào đảm bảo rằng một khi giao dịch commit, thay đổi của nó sống sót qua sự cố ngay giây sau đó?',
      options: ['Durability|||Durability (Bền vững)', 'Atomicity|||Atomicity (Nguyên tử)', 'Consistency|||Consistency (Nhất quán)', 'Isolation|||Isolation (Cô lập)'],
      correctIndex: 0,
      points: 1,
      explanation: "Durability is specifically the \"survives a crash after commit\" guarantee. Atomicity is about all-or-nothing completion, Consistency is about business rules still holding, Isolation is about not seeing other transactions' unfinished work — all real, but none of them is about surviving a later failure.|||Durability (Bền vững) chính xác là lời hứa \"sống sót qua sự cố sau khi commit\". Atomicity là về hoàn thành được-ăn-cả-ngã-về-không, Consistency là về luật nghiệp vụ vẫn đúng, Isolation là về không thấy việc dở dang của giao dịch khác — đều có thật, nhưng không cái nào nói về sống sót qua sự cố về sau." },
    { id: 'q2',
      question: 'Transferring $500 needs two UPDATEs (subtract, then add). The system crashes right after the first UPDATE but before the second. Which ACID property was this two-statement transaction designed to protect against exactly this?|||Chuyển 500$ cần hai UPDATE (trừ, rồi cộng). Hệ thống sập ngay sau UPDATE đầu nhưng trước UPDATE thứ hai. Giao dịch hai câu này được thiết kế để chống lại đúng tình huống này nhờ tính chất ACID nào?',
      options: ['Durability|||Durability (Bền vững)', 'Atomicity|||Atomicity (Nguyên tử)', 'Isolation|||Isolation (Cô lập)', 'Consistency|||Consistency (Nhất quán)'],
      correctIndex: 1,
      points: 1,
      explanation: 'This is exactly Atomicity — the whole group of statements runs, or none of it does. Wrapping both UPDATEs in one transaction means the crash either leaves both committed or (after a later ROLLBACK/recovery) neither committed — $500 is never destroyed by surviving in only one account. Durability is about surviving crashes AFTER commit, not about grouping statements together.|||Đây chính xác là Nguyên tử (Atomicity) — cả nhóm câu lệnh chạy, hoặc không câu nào chạy. Gói cả hai UPDATE trong một giao dịch nghĩa là sự cố hoặc để lại cả hai đã commit, hoặc (sau ROLLBACK/khôi phục) không câu nào commit — 500$ không bao giờ biến mất bằng cách chỉ còn tồn tại ở một tài khoản. Durability là về sống sót qua sự cố SAU khi commit, không phải về gộp các câu lệnh lại.' },
    { id: 'q3',
      question: 'soDu starts at 1000. The batch below runs: BEGIN TRANSACTION; UPDATE sets soDu = soDu - 300; UPDATE sets soDu = soDu - 200; ROLLBACK TRANSACTION. What is soDu afterwards?|||soDu ban đầu là 1000. Lô lệnh sau chạy: BEGIN TRANSACTION; UPDATE trừ soDu 300; UPDATE trừ soDu 200; ROLLBACK TRANSACTION. soDu sau đó bằng bao nhiêu?',
      code: `CREATE TABLE dbo.TaiKhoan (soTK INT PRIMARY KEY, soDu DECIMAL(10,0) NOT NULL);
INSERT INTO dbo.TaiKhoan VALUES (1, 1000);
GO
BEGIN TRANSACTION;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 300 WHERE soTK = 1;
  UPDATE dbo.TaiKhoan SET soDu = soDu - 200 WHERE soTK = 1;
ROLLBACK TRANSACTION;
GO
SELECT soDu FROM dbo.TaiKhoan WHERE soTK = 1;`,
      codeLang: 'sql',
      options: ['500 — both UPDATEs applied|||500 — cả hai UPDATE đã áp dụng', '700 — only the first UPDATE applied|||700 — chỉ UPDATE đầu áp dụng', '1000 — ROLLBACK undoes everything back to BEGIN TRANSACTION|||1000 — ROLLBACK lùi mọi thứ về trước BEGIN TRANSACTION', 'NULL — ROLLBACK deletes the row|||NULL — ROLLBACK xoá dòng đó'],
      correctIndex: 2,
      points: 1,
      explanation: 'ROLLBACK TRANSACTION undoes every statement back to the matching BEGIN TRANSACTION, not just the last one — both UPDATEs are undone together, so soDu returns to its original 1000. Answer B is the classic trap: thinking ROLLBACK only cancels the most recent statement.|||ROLLBACK TRANSACTION lùi MỌI câu lệnh về đúng BEGIN TRANSACTION khớp với nó, không chỉ câu cuối — cả hai UPDATE cùng bị huỷ, nên soDu quay về 1000 ban đầu. Đáp án B là bẫy kinh điển: tưởng ROLLBACK chỉ huỷ câu lệnh gần nhất.' },
    { id: 'q4',
      question: "Which isolation level is SQL Server's DEFAULT, and still allows a non-repeatable read (re-reading the same row twice in one transaction can give different values) while forbidding dirty reads?|||Mức cô lập nào là MẶC ĐỊNH của SQL Server, vẫn cho phép đọc không lặp lại (đọc lại cùng một dòng hai lần trong một giao dịch có thể ra hai giá trị khác nhau) nhưng cấm đọc bẩn?",
      options: ['READ UNCOMMITTED|||READ UNCOMMITTED', 'REPEATABLE READ|||REPEATABLE READ', 'SERIALIZABLE|||SERIALIZABLE', 'READ COMMITTED|||READ COMMITTED'],
      correctIndex: 3,
      points: 1,
      explanation: "READ COMMITTED is SQL Server's default: it never lets you see another transaction's uncommitted write (no dirty reads), but between two reads of the same row IN YOUR OWN transaction, another transaction may commit a change in between — a non-repeatable read. REPEATABLE READ specifically closes that gap (its name says so); READ UNCOMMITTED allows dirty reads too; SERIALIZABLE is the strictest of all four.|||READ COMMITTED là mặc định của SQL Server: nó không bao giờ cho bạn thấy một ghi chưa commit của giao dịch khác (không đọc bẩn), nhưng giữa hai lần đọc cùng một dòng TRONG CHÍNH giao dịch của bạn, một giao dịch khác có thể commit một thay đổi ở giữa — gọi là đọc không lặp lại. REPEATABLE READ đóng đúng lỗ hổng đó (tên nó đã nói vậy); READ UNCOMMITTED còn cho cả đọc bẩn; SERIALIZABLE chặt nhất trong cả bốn." },
    { id: 'q5',
      question: 'Inside a CATCH block, XACT_STATE() returns -1. What does that mean, and what must you do?|||Trong khối CATCH, XACT_STATE() trả về -1. Điều đó nghĩa là gì, và bạn phải làm gì?',
      options: ['The transaction is open but doomed — it can ONLY be rolled back, never committed|||Giao dịch đang mở nhưng đã hỏng — CHỈ có thể ROLLBACK, không bao giờ commit được', 'The transaction is open and can still be committed after fixing the error|||Giao dịch đang mở và vẫn commit được sau khi sửa lỗi', 'No transaction is open; do nothing|||Không có giao dịch nào đang mở; không làm gì cả', 'The error has already been automatically rolled back; XACT_STATE() is just informational|||Lỗi đã tự động được rollback; XACT_STATE() chỉ mang tính thông tin'],
      correctIndex: 0,
      points: 1,
      explanation: 'XACT_STATE() = -1 means the transaction is open but uncommittable — some errors (like certain conversion or deadlock errors) poison the whole transaction, and SQL Server refuses any COMMIT until you ROLLBACK. XACT_STATE() = 1 (answer B) is the OTHER open state, where the transaction is still healthy and committable — for example, our real test showed a CHECK constraint violation leaves XACT_STATE() at 1, not -1. XACT_STATE() = 0 means no transaction is open at all.|||XACT_STATE() = -1 nghĩa là giao dịch đang mở nhưng không commit được — một số lỗi (như vài lỗi chuyển đổi kiểu hay deadlock) đầu độc cả giao dịch, và SQL Server từ chối mọi COMMIT cho tới khi bạn ROLLBACK. XACT_STATE() = 1 (đáp án B) là trạng thái MỞ KHÁC, nơi giao dịch vẫn khoẻ và commit được — ví dụ phép thử thật của ta cho thấy vi phạm CHECK constraint để XACT_STATE() ở mức 1, không phải -1. XACT_STATE() = 0 nghĩa là không có giao dịch nào đang mở.' },
    { id: 'q6',
      question: 'A 5,000-row table T(id, ten) has a nonclustered index on ten. The query below runs. What plan operator does it use, and why?|||Bảng T(id, ten) 5.000 dòng có chỉ mục không gom cụm trên ten. Truy vấn dưới đây chạy. Nó dùng toán tử kế hoạch nào, và vì sao?',
      code: `CREATE TABLE dbo.T (id INT PRIMARY KEY, ten NVARCHAR(50));
INSERT INTO dbo.T SELECT TOP (5000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)), N'X' + CAST(ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS NVARCHAR(10)) FROM sys.all_columns a CROSS JOIN sys.all_columns b;
CREATE NONCLUSTERED INDEX idx_t_ten ON dbo.T(ten);
GO
SET STATISTICS PROFILE ON;
SELECT * FROM dbo.T WHERE LEFT(ten, 1) = N'X';
SET STATISTICS PROFILE OFF;`,
      codeLang: 'sql',
      options: ['Index Seek — LEFT() is sargable, so the index is used directly|||Index Seek — LEFT() sargable nên chỉ mục được dùng trực tiếp', 'Index Scan — the function LEFT(ten, 1) wraps the indexed column, so SQL Server reads every index entry instead of seeking|||Index Scan — hàm LEFT(ten, 1) bọc quanh cột có chỉ mục, nên SQL Server đọc từng mục chỉ mục thay vì seek', 'Table Scan — a nonclustered index can never help a LEFT() query|||Table Scan — chỉ mục không gom cụm không bao giờ giúp được truy vấn có LEFT()', 'Index Seek, but only on odd-numbered rows|||Index Seek, nhưng chỉ trên các dòng có số thứ tự lẻ'],
      correctIndex: 1,
      points: 1,
      explanation: "Wrapping an indexed column in a function (here LEFT(ten,1)) destroys sargability — SQL Server cannot binary-search the index by the function's result, so it must evaluate LEFT(ten,1) for every entry: an Index Scan. It is not a full Table/Clustered Index Scan either, because the (id, ten) pair still fits entirely inside this nonclustered index (id is the clustering key, automatically carried in every nonclustered index's leaf) — so it scans the smaller index, not the base table.|||Bọc cột có chỉ mục trong một hàm (ở đây LEFT(ten,1)) phá vỡ tính sargable — SQL Server không tìm nhị phân theo kết quả của hàm được, nên phải tính LEFT(ten,1) cho từng mục: một Index Scan. Cũng không phải Table/Clustered Index Scan trọn vẹn, vì cặp (id, ten) vẫn nằm gọn trong chỉ mục không gom cụm này (id là khoá gom cụm, tự động mang theo trong mọi trang lá chỉ mục không gom cụm) — nên nó quét chỉ mục nhỏ hơn, không quét bảng gốc." },
    { id: 'q7',
      question: 'T(id, a, b), 5,000 rows, has CREATE NONCLUSTERED INDEX idx_t_a_b ON T(a, b). The query below filters on b only. What plan does it get?|||T(id, a, b), 5.000 dòng, có CREATE NONCLUSTERED INDEX idx_t_a_b ON T(a, b). Truy vấn dưới đây chỉ lọc theo b. Nó nhận kế hoạch nào?',
      code: `CREATE TABLE dbo.T (id INT PRIMARY KEY, a INT, b INT);
INSERT INTO dbo.T SELECT TOP (5000) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)), 1 + (ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) % 5), ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) FROM sys.all_columns x CROSS JOIN sys.all_columns y;
CREATE NONCLUSTERED INDEX idx_t_a_b ON dbo.T(a, b);
GO
SET STATISTICS PROFILE ON;
SELECT id, a FROM dbo.T WHERE b = 2500;
SET STATISTICS PROFILE OFF;`,
      codeLang: 'sql',
      options: ['Index Seek — any column in a composite index can be sought directly|||Index Seek — cột bất kỳ trong chỉ mục ghép đều seek trực tiếp được', 'Table Scan, ignoring the index entirely|||Table Scan, bỏ qua hẳn chỉ mục', 'Index Scan — b is the SECOND key column, so the engine cannot jump straight to it without knowing a first|||Index Scan — b là cột khoá THỨ HAI, nên engine không nhảy thẳng tới nó được nếu không biết a trước', 'An error — a composite index cannot be queried on its second column|||Báo lỗi — chỉ mục ghép không truy vấn được trên cột thứ hai'],
      correctIndex: 2,
      points: 1,
      explanation: "A composite index (a, b) is sorted by a first, then b within each a — like a phone book sorted by last name then first name. Filtering on b alone gives the engine no starting point to binary-search into: it must read the whole (still narrower-than-the-table) index — an Index Scan, not a Seek. It is also not a full Table Scan: the index is still cheaper to read than the base table, and SQL Server prefers it. There is no error (D) — SQL Server just can't seek it.|||Chỉ mục ghép (a, b) sắp theo a trước, rồi b trong từng nhóm a — giống danh bạ sắp theo họ rồi mới tới tên. Chỉ lọc theo b không cho engine điểm bắt đầu để tìm nhị phân: nó phải đọc cả chỉ mục (vẫn hẹp hơn cả bảng) — một Index Scan, không phải Seek. Cũng không phải Table Scan trọn vẹn: chỉ mục vẫn rẻ hơn để đọc so với bảng gốc, và SQL Server chọn nó. Không có lỗi nào (D) — SQL Server chỉ đơn giản không seek được." },
    { id: 'q8',
      question: 'A view joins tblEmployee and tblDepartment (department-1 employees with their department name). Which statement through this view is REFUSED with "not updatable because the modification affects multiple base tables"?|||Một view join tblEmployee và tblDepartment (nhân viên phòng 1 kèm tên phòng). Câu lệnh nào qua view này bị TỪ CHỐI với thông báo "not updatable because the modification affects multiple base tables"?',
      options: ['UPDATE ... SET empName = ... WHERE empSSN = ...|||UPDATE ... SET empName = ... WHERE empSSN = ...', 'SELECT * FROM the view|||SELECT * FROM view đó', 'DROP VIEW on the view|||DROP VIEW trên view đó', 'INSERT INTO the view (empSSN, empName, depName) VALUES (...)|||INSERT INTO view đó (empSSN, empName, depName) VALUES (...)'],
      correctIndex: 3,
      points: 1,
      explanation: 'Real, tested behavior: UPDATE on a single unambiguous base-table column (A) succeeds — SQL Server can trace empName back to exactly one row of tblEmployee. SELECT (B) and DROP VIEW (C) never touch base-table data at all. INSERT (D) is refused (Msg 4405): a brand-new row would need values written into BOTH tblEmployee and tblDepartment simultaneously, and SQL Server has no rule for splitting one INSERT across two base tables.|||Hành vi thật, đã kiểm: UPDATE trên một cột bảng gốc rõ ràng, không mơ hồ (A) thành công — SQL Server chỉ rõ được empName về đúng một dòng của tblEmployee. SELECT (B) và DROP VIEW (C) không hề đụng tới dữ liệu bảng gốc. INSERT (D) bị từ chối (Msg 4405): một dòng hoàn toàn mới cần giá trị ghi vào CẢ tblEmployee LẪN tblDepartment cùng lúc, mà SQL Server không có luật nào để tách một INSERT thành hai bảng gốc.' },
    { id: 'q9',
      question: "A view V has WITH CHECK OPTION and its own WHERE depNum = 1. You run: INSERT INTO V (empSSN, empName, empSalary, empSex, depNum) VALUES (100050, N'Test', 50000, 'M', 9). What happens?|||Một view V có WITH CHECK OPTION và chính nó có WHERE depNum = 1. Bạn chạy: INSERT INTO V (empSSN, empName, empSalary, empSex, depNum) VALUES (100050, N'Test', 50000, 'M', 9). Chuyện gì xảy ra?",
      code: `CREATE VIEW V_Phong1 AS
SELECT * FROM tblEmployee WHERE depNum = 1
WITH CHECK OPTION;
GO
BEGIN TRY
  INSERT INTO V_Phong1 (empSSN, empName, empSalary, empSex, depNum)
    VALUES (100050, N'Test', 50000, 'M', 9);
  SELECT NULL AS ma_loi;
END TRY
BEGIN CATCH
  SELECT ERROR_NUMBER() AS ma_loi;
END CATCH`,
      codeLang: 'sql',
      options: ["The INSERT is refused outright (Msg 550) — WITH CHECK OPTION rejects any row the view's own WHERE would not show|||Câu INSERT bị từ chối thẳng (Msg 550) — WITH CHECK OPTION từ chối mọi dòng mà WHERE của chính view sẽ không hiện", 'The row is inserted into the base table with depNum = 9, but never shows through V|||Dòng được chèn vào bảng gốc với depNum = 9, nhưng không bao giờ hiện qua V', 'The row is inserted with depNum forced to 1|||Dòng được chèn với depNum bị ép về 1', 'Nothing — WITH CHECK OPTION only applies to UPDATE, not INSERT|||Không có gì — WITH CHECK OPTION chỉ áp dụng cho UPDATE, không áp dụng cho INSERT'],
      correctIndex: 0,
      points: 1,
      explanation: "This is exactly the point of WITH CHECK OPTION: without it (as in slide 39's Employee_Dep1v2, which lacks the clause), a row that the view's own WHERE would filter out CAN be silently inserted with depNum left NULL. WITH CHECK OPTION closes that hole for BOTH INSERT and UPDATE (ruling out D) by checking the new/changed row against the view's WHERE and refusing it (Msg 550) instead of letting it vanish quietly.|||Đây chính xác là mục đích của WITH CHECK OPTION: không có nó (như Employee_Dep1v2 ở slide 39, thiếu mệnh đề này), một dòng mà WHERE của chính view sẽ lọc ra CÓ THỂ được chèn lặng lẽ với depNum để NULL. WITH CHECK OPTION đóng lỗ hổng đó cho CẢ INSERT lẫn UPDATE (loại D) bằng cách kiểm dòng mới/đã sửa với WHERE của view và từ chối nó (Msg 550) thay vì để nó biến mất trong im lặng." },
    { id: 'q10',
      question: 'Which pair correctly matches a PostgreSQL-only feature with what it does?|||Cặp nào khớp đúng một tính năng chỉ có ở PostgreSQL với việc nó làm?',
      options: ["Clustered index — automatically keeps the table's rows sorted after every INSERT, like SQL Server|||Clustered index — tự động giữ các dòng của bảng theo thứ tự sau mỗi INSERT, giống SQL Server", 'Partial index — indexes only the rows matching a WHERE condition, smaller than a full-table index|||Chỉ mục một phần (partial index) — chỉ đánh chỉ mục các dòng thoả một điều kiện WHERE, nhỏ hơn chỉ mục cả bảng', 'Materialized view — always shows the latest data with no REFRESH needed|||Materialized view — luôn hiện dữ liệu mới nhất, không cần REFRESH', 'WITH CHECK OPTION — a PostgreSQL-only clause with no T-SQL equivalent|||WITH CHECK OPTION — mệnh đề chỉ PostgreSQL có, T-SQL không có'],
      correctIndex: 1,
      points: 1,
      explanation: "A partial index (CREATE INDEX … WHERE …) really does only cover matching rows — real test: forcing enable_seqscan off still fell back to Seq Scan for a row outside the index's condition. A is backwards: PostgreSQL has NO clustered index at all — CLUSTER reorders physically ONCE and is not maintained after (that is precisely the opposite of what A claims). C is backwards too: a materialized view goes STALE until REFRESH MATERIALIZED VIEW — real test showed it kept the old average after an INSERT until refreshed. D is wrong: WITH CHECK OPTION exists in T-SQL as well (tested in this chapter's practice exercises).|||Chỉ mục một phần (CREATE INDEX … WHERE …) thật sự chỉ phủ các dòng khớp — kiểm thật: ép enable_seqscan tắt vẫn quay về Seq Scan cho một dòng ngoài điều kiện của chỉ mục. A nói ngược: PostgreSQL KHÔNG có clustered index nào cả — CLUSTER sắp lại vật lý MỘT LẦN và không được duy trì sau đó (đúng ngược lại điều A khẳng định). C cũng nói ngược: materialized view trở nên CŨ cho tới khi REFRESH MATERIALIZED VIEW — kiểm thật cho thấy nó giữ trung bình cũ sau một INSERT cho tới khi được làm mới. D sai: WITH CHECK OPTION cũng có trong T-SQL (đã kiểm ở bài thực hành chương này)." },
  ],
};

export default {
  slides: [L_dbi8_1, L_dbi8_2],
  practice: L_on_ch8,
  quiz: QUIZ,
  quizDescription: '10 câu về Chương 8 (slide Chapter 7 của trường): ACID, tính nguyên tử qua ví dụ chuyển tiền, ROLLBACK, mức cô lập, XACT_STATE(), chỉ mục seek vs. scan, hàm trên cột có chỉ mục, chỉ mục ghép, view cập nhật được, WITH CHECK OPTION — 2 câu có đáp án tự kiểm bằng SQL chạy thật trên SQL Server (2 câu khác kèm code thật nhưng đáp án dựa trên kế hoạch thực thi đã đo, không tự kiểm được qua một ô kết quả); mỗi câu có giải thích.',
};
