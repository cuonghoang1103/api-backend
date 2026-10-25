/**
 * PostgreSQL — Chương 17 (MỚI, 25/10/2026, agent c17): SQL Server · MySQL · PostgreSQL · MongoDB — giống/khác, khi nào dùng cái nào.
 * Đăng ký trong ./them.mjs (SAU_CH16) — KHÔNG sửa postgresql.mjs.
 * Mọi output CHẠY THẬT 25/10/2026: SQL Server 2022 16.0.4305 (Docker, linux/amd64 qua Rosetta) · MySQL 8.4.13 · PostgreSQL 17.11 ·
 * MongoDB 7.0.37 (mongo:8 không khởi động được trên kernel 6.19 — lỗi SERVER-121912). Dữ liệu: CT Shop của các lab, rút gọn 5 bảng,
 * nạp giống hệt vào cả bốn. Bản gốc lệnh + output: video-bai-giang/src/khung/pg/that/pg-17-{1,2,3,4}.*
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${. Khối .out đóng bằng </div>.
 */
import G171 from './giang/pg-17-1.mjs';
import G172 from './giang/pg-17-2.mjs';
import G173 from './giang/pg-17-3.mjs';
import G174 from './giang/pg-17-4.mjs';

const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 17 — SQL Server · MySQL · PostgreSQL · MongoDB|||Chương 17 — SQL Server · MySQL · PostgreSQL · MongoDB',
  description: 'Bốn hệ cơ sở dữ liệu phổ biến nhất đặt cạnh nhau trên CÙNG dữ liệu CT Shop, chạy thật: lịch sử, mô hình dữ liệu, giấy phép, ai dùng; cùng báo cáo trên ba máy chủ SQL và những hành vi khác nhau không báo lỗi; document MongoDB so với JSONB; và cách chọn hệ cho từng tình huống.',
  lessons: [
    /* ─────────────────────────── 17.1 ─────────────────────────── */
    {
      title: '17.1 — Four database systems|||17.1 — Bốn hệ cơ sở dữ liệu',
      slug: 'postgresql-17-1-bon-he-csdl',
      type: 'LESSON',
      description: 'SQL Server, MySQL, PostgreSQL và MongoDB: ra đời từ đâu, lưu dữ liệu theo hình dạng nào (bảng hay document), giấy phép nói bằng lời thường, ai đang dùng — và cùng một đơn hàng CT Shop được lưu, đọc lại thật trên cả bốn máy chủ.',
      content: `
${G171}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.1</span>
<h2>Four database systems, one order</h2>
<p class="lead">You have spent sixteen chapters inside PostgreSQL. This chapter steps outside and puts it next to the three systems you are most likely to meet at work: <strong>SQL Server</strong>, <strong>MySQL</strong> and <strong>MongoDB</strong>. Not with opinions — with the same CT Shop data loaded into all four and every result run for real.</p>

<h3>The lab for this chapter</h3>
<p>Four Docker containers on one laptop, 25/10/2026: SQL Server 2022 (16.0.4305, Developer Edition, an amd64 image running through Rosetta), MySQL 8.4.13, PostgreSQL 17.11 (the course machine) and MongoDB 7.0.37. Each holds a database called <code>ctshop</code>: the CT Shop data from the labs, trimmed to five tables — <code>category</code> (12 rows), <code>product</code> (48, with a JSON <code>attrs</code> column), <code>customer</code> (300), <code>orders</code> (2,000) and <code>order_item</code> (5,000) — copied row for row. MongoDB holds the same 2,000 orders as documents.</p>
<div class="callout">Why MongoDB 7.0 and not 8? The <code>mongo:8</code> image refused to start on this machine's Linux kernel 6.19 with “Linux kernel versions 6.19 and newer has a known incompatibility with this version of MongoDB” (SERVER-121912). Nothing in this chapter depends on a version-8 feature.</div>

<h3>Two shapes of data</h3>
<p>Three of the four systems are <strong>relational</strong>: data lives in tables, each fact is stored once, and keys link the rows — you read a whole order back with JOIN. MongoDB is a <strong>document</strong> database: each order is one nested object (BSON, a binary JSON) that already contains the customer and every line. Think of a cabinet of forms versus one folder per order.</p>
<pre><code class="language-sql">SELECT o.id, c.full_name, o.status, p.sku, oi.qty, oi.unit_price
FROM orders o JOIN customer c ON c.id = o.customer_id
JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id
WHERE o.id = 1;</code></pre>
<div class="out"> id |  full_name  | status |  sku   | qty | unit_price
----+-------------+--------+--------+-----+------------
  1 | Vũ Thị Bình | paid   | CT1004 |   1 |  790000.00
  1 | Vũ Thị Bình | paid   | CT1102 |   1 |   15000.00
(2 rows)</div>
<p>The identical query returned the same two rows on SQL Server and MySQL. MongoDB answers with one read and no JOIN:</p>
<pre><code class="language-javascript">db.orders.findOne({ _id: 1 })</code></pre>
<div class="out">{
  _id: 1,
  customer: {
    id: 61,
    name: 'Vũ Thị Bình',
    city: 'Đà Nẵng'
  },
  status: 'paid',
  created_at: ISODate('2026-09-05T23:28:00.000Z'),
  items: [
    {
      sku: 'CT1004',
      name: 'Máy tính Casio FX-880BTG',
      category: 'Máy tính cầm tay',
      qty: 1,
      unit_price: 790000
    },
    {
      sku: 'CT1102',
      name: 'Thước thép Deli 30cm',
      category: 'Thước &amp; compa',
      qty: 1,
      unit_price: 15000
    }
  ]
}</div>

<h3>Where they came from</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">1986 POSTGRES at UC Berkeley (Michael Stonebraker) → 1995 Postgres95 adds SQL → 1996 renamed PostgreSQL. Never owned by a company: the PostgreSQL Global Development Group, with many companies contributing. A new major version every autumn (17 in 2024), each supported for five years.</span></div>
  <div class="kv"><span class="k">SQL Server</span><span class="v">1989, Microsoft with Sybase, on OS/2; Microsoft's own code base since version 7.0 (1998). On Linux and Docker since SQL Server 2017; also sold as Azure SQL.</span></div>
  <div class="kv"><span class="k">MySQL</span><span class="v">1995, MySQL AB in Sweden (Michael “Monty” Widenius, David Axmark, Allan Larsson). Bought by Sun in 2008, which Oracle bought in 2010. Monty forked it as MariaDB in 2009. InnoDB has been the default engine since 5.5.</span></div>
  <div class="kv"><span class="k">MongoDB</span><span class="v">The company 10gen (2007) released MongoDB in 2009 and renamed itself MongoDB Inc. in 2013. Multi-document ACID transactions arrived in 4.0 (2018, on a replica set; sharded clusters in 4.2). The same year the licence changed to the SSPL.</span></div>
</div>

<h3>Real versions, from the containers</h3>
<div class="out">1&gt; SELECT @@VERSION
Microsoft SQL Server 2022 (RTM-CU27-GDR) (KB5126934) - 16.0.4305.5 (X64)
	Oct  2 2026 17:28:11
	Copyright (C) 2022 Microsoft Corporation
1&gt; SELECT SERVERPROPERTY('Edition')
Developer Edition (64-bit)

mysql&gt; SELECT VERSION() AS version, @@default_storage_engine AS engine;
+---------+--------+
| version | engine |
+---------+--------+
| 8.4.13  | InnoDB |
+---------+--------+

ctshop=# SELECT version();
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit

ctshop&gt; db.version()
7.0.37
ctshop&gt; db.serverStatus().storageEngine.name
wiredTiger</div>

<h3>Licences in plain words</h3>
<table>
<tr><th></th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th><th>MongoDB</th></tr>
<tr><td>Free use</td><td>Express (databases ≤ 10 GB), Developer (not for production)</td><td>Community edition, GPL v2</td><td>any use, PostgreSQL Licence</td><td>Community edition, SSPL</td></tr>
<tr><td>Production at scale</td><td>paid per CPU core (Standard / Enterprise)</td><td>free, or paid Enterprise</td><td>free</td><td>free self-hosted; paid Atlas / Enterprise</td></tr>
<tr><td>Source</td><td>closed</td><td>open (GPL)</td><td>open (permissive, like MIT/BSD)</td><td>available (SSPL, not OSI-approved)</td></tr>
<tr><td>Who decides</td><td>Microsoft</td><td>Oracle (MariaDB is the fork)</td><td>a community</td><td>MongoDB Inc.</td></tr>
</table>
<p>For a student, a start-up or a freelance project: PostgreSQL and MySQL cost nothing at any size; SQL Server is free only while small or in development; MongoDB is free to run yourself, with a licence that mainly restricts companies selling it as a cloud service.</p>

<h3>Who runs what</h3>
<p>Public, well-documented examples: <strong>SQL Server</strong> — Stack Overflow, banks, insurers, ERP and .NET shops (and DBI202 at FPT). <strong>MySQL</strong> — WordPress, GitHub, Facebook's large MySQL fleet, Wikipedia on MariaDB, PHP hosting everywhere. <strong>PostgreSQL</strong> — Instagram (from day one), Reddit, Supabase and Neon (both built on it), and this website. <strong>MongoDB</strong> — MERN applications, product catalogues, content and event stores, MongoDB Atlas customers. DB-Engines has ranked Oracle, MySQL, SQL Server, PostgreSQL and MongoDB as the top five for years; in the Stack Overflow Developer Survey PostgreSQL became the most-used database among professional developers in 2023 and kept the lead in 2024.</p>

<h3>Myths</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">“SQL Server only runs on Windows”</span><span class="v">Linux and Docker since 2017 — this chapter ran it in a Linux container.</span></div>
  <div class="kv"><span class="k">“MongoDB has no transactions”</span><span class="v">Multi-document ACID transactions since 4.0 (2018), on a replica set.</span></div>
  <div class="kv"><span class="k">“MySQL cannot store JSON”</span><span class="v">A binary JSON type since 5.7 (2015) — used in Lesson 17.2.</span></div>
  <div class="kv"><span class="k">“NoSQL means no design”</span><span class="v">The schema moves into your code; deciding what to embed is design work (17.3).</span></div>
</div>

<h3>In a real project: cuongthai.com</h3>
<p>This website runs <strong>PostgreSQL 16</strong> in Docker (image <code>api-backend-postgres:16-3.4-pgvector</code>, PostGIS 3.4 + pgvector) through Prisma (<code>provider = "postgresql"</code>). Counted in the repository on 25/10/2026: <strong>602</strong> models, <strong>57</strong> enums, <strong>235</strong> migrations, <strong>266</strong> <code>Json</code> fields stored as JSONB, and a <code>vector(384)</code> column for AI similarity search. Relational tables, documents, search and vectors in one engine — Lesson 17.4 explains why that mattered more than raw speed.</p>
<div class="pitfall"><p><strong>Trap — comparing brands instead of shapes.</strong> “Which database is best?” has no answer. “Is my data a set of linked facts or a set of self-contained documents, and who will run it?” does. Keep that question for the rest of the chapter.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next: the same report on three SQL servers</span><span class="lc-sub">Lesson 17.2 — where the syntax differs, and where the behaviour differs.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.1</span>
<h2>Bốn hệ cơ sở dữ liệu, một đơn hàng</h2>
<p class="lead">Bạn đã ở bên trong PostgreSQL suốt mười sáu chương. Chương này bước ra ngoài và đặt nó cạnh ba hệ bạn dễ gặp nhất khi đi làm: <strong>SQL Server</strong>, <strong>MySQL</strong> và <strong>MongoDB</strong>. Không bằng cảm tính — bằng cùng dữ liệu CT Shop nạp vào cả bốn, mọi kết quả đều chạy thật.</p>

<h3>Phòng thí nghiệm của chương</h3>
<p>Bốn container Docker trên một laptop, ngày 25/10/2026: SQL Server 2022 (16.0.4305, Developer Edition, ảnh amd64 chạy qua Rosetta), MySQL 8.4.13, PostgreSQL 17.11 (máy của khoá) và MongoDB 7.0.37. Mỗi máy có một database tên <code>ctshop</code>: dữ liệu CT Shop của các lab, rút gọn còn năm bảng — <code>category</code> (12 dòng), <code>product</code> (48, có cột JSON <code>attrs</code>), <code>customer</code> (300), <code>orders</code> (2.000) và <code>order_item</code> (5.000) — chép từng dòng. MongoDB giữ đúng 2.000 đơn đó dưới dạng document.</p>
<div class="callout">Vì sao MongoDB 7.0 mà không phải 8? Ảnh <code>mongo:8</code> từ chối khởi động trên kernel Linux 6.19 của máy với thông báo “Linux kernel versions 6.19 and newer has a known incompatibility with this version of MongoDB” (SERVER-121912). Không phần nào trong chương cần tính năng riêng của bản 8.</div>

<h3>Hai hình dạng dữ liệu</h3>
<p>Ba trong bốn hệ là <strong>quan hệ</strong>: dữ liệu nằm trong bảng, mỗi sự thật lưu đúng một lần, các dòng nối với nhau bằng khoá — muốn đọc trọn một đơn thì JOIN. MongoDB là cơ sở dữ liệu <strong>document</strong>: mỗi đơn là một đối tượng lồng nhau (BSON, một dạng JSON nhị phân) chứa sẵn khách và mọi dòng hàng. Hình dung một tủ phiếu so với mỗi đơn một tập hồ sơ.</p>
<pre><code class="language-sql">SELECT o.id, c.full_name, o.status, p.sku, oi.qty, oi.unit_price
FROM orders o JOIN customer c ON c.id = o.customer_id
JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id
WHERE o.id = 1;</code></pre>
<div class="out"> id |  full_name  | status |  sku   | qty | unit_price
----+-------------+--------+--------+-----+------------
  1 | Vũ Thị Bình | paid   | CT1004 |   1 |  790000.00
  1 | Vũ Thị Bình | paid   | CT1102 |   1 |   15000.00
(2 rows)</div>
<p>Cùng câu đó trả đúng hai dòng như vậy trên SQL Server và MySQL. MongoDB trả lời bằng một lần đọc, không JOIN:</p>
<pre><code class="language-javascript">db.orders.findOne({ _id: 1 })</code></pre>
<div class="out">{
  _id: 1,
  customer: {
    id: 61,
    name: 'Vũ Thị Bình',
    city: 'Đà Nẵng'
  },
  status: 'paid',
  created_at: ISODate('2026-09-05T23:28:00.000Z'),
  items: [
    {
      sku: 'CT1004',
      name: 'Máy tính Casio FX-880BTG',
      category: 'Máy tính cầm tay',
      qty: 1,
      unit_price: 790000
    },
    {
      sku: 'CT1102',
      name: 'Thước thép Deli 30cm',
      category: 'Thước &amp; compa',
      qty: 1,
      unit_price: 15000
    }
  ]
}</div>

<h3>Chúng từ đâu ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">PostgreSQL</span><span class="v">1986 POSTGRES ở UC Berkeley (Michael Stonebraker) → 1995 Postgres95 thêm SQL → 1996 đổi tên PostgreSQL. Chưa từng thuộc công ty nào: PostgreSQL Global Development Group, nhiều công ty cùng đóng góp. Mỗi mùa thu một bản lớn (17 năm 2024), mỗi bản được hỗ trợ năm năm.</span></div>
  <div class="kv"><span class="k">SQL Server</span><span class="v">1989, Microsoft cùng Sybase, chạy trên OS/2; mã nguồn riêng của Microsoft từ bản 7.0 (1998). Chạy trên Linux và Docker từ SQL Server 2017; còn bán dưới dạng Azure SQL.</span></div>
  <div class="kv"><span class="k">MySQL</span><span class="v">1995, MySQL AB ở Thuỵ Điển (Michael “Monty” Widenius, David Axmark, Allan Larsson). Sun mua năm 2008, rồi Oracle mua Sun năm 2010. Monty tách nhánh MariaDB năm 2009. InnoDB là engine mặc định từ 5.5.</span></div>
  <div class="kv"><span class="k">MongoDB</span><span class="v">Công ty 10gen (2007) phát hành MongoDB năm 2009 rồi đổi tên thành MongoDB Inc. năm 2013. Giao dịch ACID nhiều document có từ 4.0 (2018, trên replica set; cụm sharding từ 4.2). Cùng năm đó giấy phép đổi sang SSPL.</span></div>
</div>

<h3>Phiên bản thật, lấy từ các container</h3>
<div class="out">1&gt; SELECT @@VERSION
Microsoft SQL Server 2022 (RTM-CU27-GDR) (KB5126934) - 16.0.4305.5 (X64)
	Oct  2 2026 17:28:11
	Copyright (C) 2022 Microsoft Corporation
1&gt; SELECT SERVERPROPERTY('Edition')
Developer Edition (64-bit)

mysql&gt; SELECT VERSION() AS version, @@default_storage_engine AS engine;
+---------+--------+
| version | engine |
+---------+--------+
| 8.4.13  | InnoDB |
+---------+--------+

ctshop=# SELECT version();
 PostgreSQL 17.11 (Debian 17.11-1.pgdg13+2) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit

ctshop&gt; db.version()
7.0.37
ctshop&gt; db.serverStatus().storageEngine.name
wiredTiger</div>

<h3>Giấy phép nói bằng lời thường</h3>
<table>
<tr><th></th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th><th>MongoDB</th></tr>
<tr><td>Dùng miễn phí</td><td>Express (database ≤ 10 GB), Developer (không dùng production)</td><td>bản Community, GPL v2</td><td>mọi mục đích, giấy phép PostgreSQL</td><td>bản Community, SSPL</td></tr>
<tr><td>Production quy mô lớn</td><td>trả tiền theo nhân CPU (Standard / Enterprise)</td><td>miễn phí, hoặc Enterprise trả phí</td><td>miễn phí</td><td>tự chạy miễn phí; Atlas / Enterprise trả phí</td></tr>
<tr><td>Mã nguồn</td><td>đóng</td><td>mở (GPL)</td><td>mở (thoáng, kiểu MIT/BSD)</td><td>công khai (SSPL, không được OSI công nhận)</td></tr>
<tr><td>Ai quyết định</td><td>Microsoft</td><td>Oracle (MariaDB là nhánh tách)</td><td>một cộng đồng</td><td>MongoDB Inc.</td></tr>
</table>
<p>Với sinh viên, start-up hay dự án làm thuê: PostgreSQL và MySQL không tốn đồng nào ở mọi quy mô; SQL Server chỉ miễn phí khi nhỏ hoặc đang phát triển; MongoDB tự chạy thì miễn phí, giấy phép chủ yếu ràng buộc công ty bán nó dưới dạng dịch vụ đám mây.</p>

<h3>Ai đang dùng gì</h3>
<p>Các ví dụ công khai, có tài liệu: <strong>SQL Server</strong> — Stack Overflow, ngân hàng, bảo hiểm, ERP và các công ty .NET (và môn DBI202 ở FPT). <strong>MySQL</strong> — WordPress, GitHub, đội máy chủ MySQL rất lớn của Facebook, Wikipedia chạy MariaDB, hosting PHP khắp nơi. <strong>PostgreSQL</strong> — Instagram (từ ngày đầu), Reddit, Supabase và Neon (đều xây trên nó), và chính trang này. <strong>MongoDB</strong> — ứng dụng MERN, danh mục sản phẩm, kho nội dung và sự kiện, khách hàng của MongoDB Atlas. DB-Engines nhiều năm liền xếp Oracle, MySQL, SQL Server, PostgreSQL và MongoDB vào top năm; trong khảo sát Stack Overflow, PostgreSQL thành cơ sở dữ liệu được lập trình viên chuyên nghiệp dùng nhiều nhất năm 2023 và giữ vị trí đó năm 2024.</p>

<h3>Những lời đồn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">“SQL Server chỉ chạy trên Windows”</span><span class="v">Có Linux và Docker từ 2017 — chương này chạy nó trong container Linux.</span></div>
  <div class="kv"><span class="k">“MongoDB không có giao dịch”</span><span class="v">Có giao dịch ACID nhiều document từ 4.0 (2018), trên replica set.</span></div>
  <div class="kv"><span class="k">“MySQL không lưu được JSON”</span><span class="v">Có kiểu JSON nhị phân từ 5.7 (2015) — dùng ở bài 17.2.</span></div>
  <div class="kv"><span class="k">“NoSQL là khỏi thiết kế”</span><span class="v">Lược đồ chỉ chuyển vào code; quyết định nhúng cái gì vẫn là thiết kế (17.3).</span></div>
</div>

<h3>Trong dự án thật: cuongthai.com</h3>
<p>Trang này chạy <strong>PostgreSQL 16</strong> trong Docker (ảnh <code>api-backend-postgres:16-3.4-pgvector</code>, PostGIS 3.4 + pgvector) qua Prisma (<code>provider = "postgresql"</code>). Đếm trong repo ngày 25/10/2026: <strong>602</strong> model, <strong>57</strong> enum, <strong>235</strong> migration, <strong>266</strong> trường <code>Json</code> lưu dạng JSONB, và một cột <code>vector(384)</code> cho tìm kiếm tương đồng bằng AI. Bảng quan hệ, document, tìm kiếm và vector trong cùng một engine — bài 17.4 giải thích vì sao điều đó quan trọng hơn tốc độ thuần.</p>
<div class="pitfall"><p><strong>Bẫy — so thương hiệu thay vì so hình dạng.</strong> “Cơ sở dữ liệu nào tốt nhất?” không có câu trả lời. “Dữ liệu của tôi là tập sự thật liên kết hay tập document khép kín, và ai sẽ vận hành nó?” thì có. Giữ câu hỏi đó cho phần còn lại của chương.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Tiếp: cùng báo cáo trên ba máy chủ SQL</span><span class="lc-sub">Bài 17.2 — cú pháp khác ở đâu, và hành vi khác ở đâu.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.2 ─────────────────────────── */
    {
      title: '17.2 — The same queries on three SQL servers|||17.2 — Cùng truy vấn trên ba máy chủ SQL',
      slug: 'postgresql-17-2-cung-truy-van-ba-he',
      type: 'LESSON',
      description: 'Cùng dữ liệu CT Shop rút gọn trên SQL Server, MySQL và PostgreSQL, cùng báo cáo doanh thu: cú pháp khác ở TOP/LIMIT, định dạng ngày, đọc JSON; còn hành vi khác lặng lẽ ở DDL trong giao dịch, mức cô lập mặc định (hai phiên thật), kiểu JSON và việc upsert đốt số id.',
      content: `
${G172}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.2</span>
<h2>Same data, same report — then four tests where the servers disagree</h2>
<p class="lead">Lesson 0.5 listed the syntax you rename when moving between SQL Server, MySQL and PostgreSQL. This lesson goes further: a real CT Shop report on all three servers, and then four <strong>behaviours</strong> that change without a single error message.</p>

<h3>The data</h3>
<p>Five CT Shop tables, copied row for row from the lab database into each server: <code>category</code> 12, <code>product</code> 48, <code>customer</code> 300, <code>orders</code> 2,000, <code>order_item</code> 5,000. Each server uses its own natural types: SQL Server NVARCHAR, DECIMAL, DATETIMEOFFSET and JSON in NVARCHAR(MAX) with <code>CHECK (ISJSON(attrs) = 1)</code>; MySQL VARCHAR (utf8mb4), DECIMAL, DATETIME and JSON; PostgreSQL text, numeric, timestamptz and jsonb (schema <code>ch17</code>).</p>
<div class="out"> cat | prod | cust | ord  | items
-----+------+------+------+-------
  12 |   48 |  300 | 2000 |  5000
(1 row)</div>

<h3>Report 1 — revenue by category</h3>
<pre><code class="language-sql">-- PostgreSQL (MySQL: identical)
SELECT c.name AS category, COUNT(DISTINCT o.id) AS orders,
       SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
JOIN product p ON p.id = oi.product_id
JOIN category c ON c.id = p.category_id
WHERE o.status IN ('paid', 'shipped') AND o.created_at &gt;= '2026-01-01'
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 5;
-- SQL Server: SELECT TOP 5 …, and the literal '2026-01-01 00:00 +07:00' because created_at is DATETIMEOFFSET</code></pre>
<div class="out">     category     | orders |   revenue
------------------+--------+--------------
 Máy tính cầm tay |    216 | 225855000.00
 Sổ tay           |    188 |  57982000.00
 Giáo trình IT    |    206 |  46403000.00
 Bút chì &amp; tẩy    |    202 |  22782000.00
 Bút dạ quang     |    185 |  16507000.00
(5 rows)</div>
<p>sqlcmd and mysql printed exactly these five rows. The date literal is the only subtle point: MySQL's DATETIME has no time zone (we stored Vietnam time), SQL Server's DATETIMEOFFSET needs the offset written, and PostgreSQL interprets the literal in the session time zone (<code>Asia/Ho_Chi_Minh</code>).</p>

<h3>Reports 2 and 3 — dates and JSON</h3>
<table>
<tr><th>Task</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>Month as text</td><td><code>FORMAT(o.created_at, 'yyyy-MM')</code></td><td><code>DATE_FORMAT(o.created_at, '%Y-%m')</code></td><td><code>to_char(o.created_at, 'YYYY-MM')</code></td></tr>
<tr><td>GROUP BY the alias</td><td>not allowed — repeat the expression</td><td><code>GROUP BY month</code></td><td><code>GROUP BY month</code></td></tr>
<tr><td>Read a JSON field</td><td><code>JSON_VALUE(attrs, '$.brand')</code></td><td><code>attrs-&gt;&gt;'$.brand'</code></td><td><code>attrs-&gt;&gt;'brand'</code></td></tr>
<tr><td>First rows</td><td><code>TOP 3</code></td><td><code>LIMIT 3</code></td><td><code>LIMIT 3</code></td></tr>
</table>
<div class="out">  month  |   revenue
---------+-------------
 2026-07 | 61111000.00
 2026-08 | 37076000.00
 2026-09 | 42173000.00
(3 rows)

   brand    | products
------------+----------
 Thiên Long |        7
 Deli       |        6
 CT Books   |        5
(3 rows)</div>
<p>Again identical on all three. JSON is where the storage really differs: SQL Server 2022 keeps it as text plus functions (index it through a computed column), MySQL has a validated binary JSON type, PostgreSQL has <code>jsonb</code> with operators such as <code>@&gt;</code> and whole-document GIN indexes (Chapter 13).</p>

<h3>Test 1 — CREATE TABLE inside a transaction</h3>
<pre><code class="language-sql">CREATE TABLE audit_log (msg text);
BEGIN;                                    -- SQL Server: BEGIN TRANSACTION; MySQL: START TRANSACTION
INSERT INTO audit_log VALUES ('price change');
CREATE TABLE t_ddl (id int);
INSERT INTO t_ddl VALUES (1);
ROLLBACK;
SELECT count(*) AS audit_rows FROM audit_log;
SELECT * FROM t_ddl;</code></pre>
<div class="out"> audit_rows
------------
          0
(1 row)

ERROR:  relation "t_ddl" does not exist</div>
<p>SQL Server agreed (audit_rows 0, <code>OBJECT_ID('t_ddl')</code> NULL). MySQL did not:</p>
<div class="out">+------------+
| audit_rows |
+------------+
|          1 |
+------------+
+------------+
| t_ddl_rows |
+------------+
|          1 |
+------------+</div>
<p>In MySQL a DDL statement causes an <strong>implicit commit</strong>: the open transaction (with the audit row) is committed first, CREATE TABLE commits itself, the next INSERT runs in autocommit, and ROLLBACK has nothing left to undo. PostgreSQL and SQL Server treat DDL as part of the transaction. The practical consequence is migrations: a ten-step migration that fails at step seven can be rolled back completely on PostgreSQL, but leaves a half-migrated schema on MySQL that you must repair by hand.</p>

<h3>Test 2 — the default isolation level, with two real sessions</h3>
<table>
<tr><th></th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>Default</td><td>READ COMMITTED with locks (<code>is_read_committed_snapshot_on = 0</code>)</td><td>REPEATABLE READ (<code>@@transaction_isolation</code>)</td><td>READ COMMITTED (<code>SHOW default_transaction_isolation</code>)</td></tr>
<tr><td>Reader meets an uncommitted writer</td><td>waits for the lock</td><td>reads the old version (MVCC)</td><td>reads the old version (MVCC)</td></tr>
</table>
<p>Session A ran <code>UPDATE product SET price = price + 1000 WHERE id = 1</code> and kept its transaction open for 8 seconds. Two seconds later session B read the same row:</p>
<div class="out">-- SQL Server, session B (SET LOCK_TIMEOUT 3000)
phiên B lúc 20:31:29:
Msg 1222, Level 16, State 51, Server c2538cdfdc92, Line 2
Lock request time out period exceeded.
xong lúc 20:31:33

-- MySQL, session B
| price   |
| 5000.00 |
1 row in set (0.00 sec)

-- PostgreSQL, session B
  price
---------
 5000.00
(1 row)

Time: 0.847 ms</div>
<p>MySQL and PostgreSQL use <strong>MVCC</strong> (Multi-Version Concurrency Control): a writer creates a new version of the row and readers keep reading the last committed one, so readers never wait for writers. SQL Server's default makes the reader wait — here until our 3-second timeout gave up. Switching on <code>ALTER DATABASE ctshop SET READ_COMMITTED_SNAPSHOT ON</code> (the default in Azure SQL Database) made the same session B return 5000.00 immediately. When you move SQL Server code to PostgreSQL, <code>WITH (NOLOCK)</code> hints and retries for blocking become unnecessary — writers still have rules of their own (Chapter 11).</p>

<h3>Test 3 — upsert and the auto number</h3>
<p>A table <code>tag(id identity, name UNIQUE, hits)</code>: insert 'sql', upsert 'sql' twice (both turn into updates, hits = 3), then insert 'json'.</p>
<div class="out"> id | name | hits
----+------+------
  1 | sql  |    3
  4 | json |    1
(2 rows)</div>
<p>MySQL printed the same (<code>| 4 | json | 1 |</code>); SQL Server's MERGE gave 'json' the id <strong>2</strong>. MySQL's ON DUPLICATE KEY and PostgreSQL's ON CONFLICT take a new number first, then discover the conflict — the numbers 2 and 3 are burnt. Gaps also appear after ROLLBACK. Never use an auto-number as an invoice counter that must have no gaps.</p>

<h3>Behaviour cheat sheet</h3>
<table>
<tr><th></th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>CREATE TABLE inside a transaction</td><td>rolled back</td><td>implicit commit</td><td>rolled back</td></tr>
<tr><td>Default isolation</td><td>READ COMMITTED + locks</td><td>REPEATABLE READ</td><td>READ COMMITTED</td></tr>
<tr><td>Reader vs uncommitted writer</td><td>waits (unless READ_COMMITTED_SNAPSHOT)</td><td>old version</td><td>old version</td></tr>
<tr><td>JSON</td><td>text + functions</td><td>JSON type</td><td>jsonb + operators + GIN</td></tr>
<tr><td>Upsert burns ids</td><td>no (MERGE)</td><td>yes</td><td>yes</td></tr>
<tr><td>7 / 2 · 'abc' = 'ABC' (Lesson 0.5)</td><td>3 · equal</td><td>3.5000 · equal</td><td>3 · different</td></tr>
</table>
<div class="pitfall"><p><strong>Trap — testing only that the SQL runs.</strong> Syntax differences are caught on day one by an error. Behaviour differences are caught months later by a wrong report, a stuck screen or a half-migrated schema. When you move a project, compare the <em>results</em> of the same reports, test a failing migration, and load-test two people editing the same rows.</p></div>

<h3>Moving a project: checklist</h3>
<ol>
<li>Run the same reports on both servers and compare the numbers (division, rounding, time zones).</li>
<li>Search the code for <code>TOP</code>, <code>ISNULL</code>, string <code>+</code>, <code>GETDATE</code>, <code>OUTPUT</code>, <code>MERGE</code>, square brackets and backticks.</li>
<li>Check every text comparison: collation, ILIKE, trailing spaces.</li>
<li>Make a migration fail halfway and see whether you can roll back.</li>
<li>Load-test concurrent edits: blocking versus MVCC.</li>
<li>Do not rely on gapless ids; re-check JSON queries and their indexes.</li>
</ol>
<p>Tools such as pgloader (MySQL / SQL Server → PostgreSQL), AWS SCT or Babelfish copy data and translate syntax. None of them checks behaviour for you.</p>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next: the other shape</span><span class="lc-sub">Lesson 17.3 — MongoDB documents vs PostgreSQL JSONB on the same 2,000 orders.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.2</span>
<h2>Cùng dữ liệu, cùng báo cáo — rồi bốn phép thử ba máy chủ không đồng ý nhau</h2>
<p class="lead">Bài 0.5 đã liệt kê phần cú pháp phải đổi tên khi chuyển giữa SQL Server, MySQL và PostgreSQL. Bài này đi xa hơn: một báo cáo CT Shop thật chạy trên cả ba máy chủ, rồi bốn <strong>hành vi</strong> thay đổi mà không có lấy một thông báo lỗi.</p>

<h3>Dữ liệu</h3>
<p>Năm bảng CT Shop, chép từng dòng từ database của lab sang mỗi máy chủ: <code>category</code> 12, <code>product</code> 48, <code>customer</code> 300, <code>orders</code> 2.000, <code>order_item</code> 5.000. Mỗi máy dùng kiểu tự nhiên của nó: SQL Server NVARCHAR, DECIMAL, DATETIMEOFFSET và JSON trong NVARCHAR(MAX) kèm <code>CHECK (ISJSON(attrs) = 1)</code>; MySQL VARCHAR (utf8mb4), DECIMAL, DATETIME và JSON; PostgreSQL text, numeric, timestamptz và jsonb (schema <code>ch17</code>).</p>
<div class="out"> cat | prod | cust | ord  | items
-----+------+------+------+-------
  12 |   48 |  300 | 2000 |  5000
(1 row)</div>

<h3>Báo cáo 1 — doanh thu theo danh mục</h3>
<pre><code class="language-sql">-- PostgreSQL (MySQL: y hệt)
SELECT c.name AS category, COUNT(DISTINCT o.id) AS orders,
       SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_item oi ON oi.order_id = o.id
JOIN product p ON p.id = oi.product_id
JOIN category c ON c.id = p.category_id
WHERE o.status IN ('paid', 'shipped') AND o.created_at &gt;= '2026-01-01'
GROUP BY c.name
ORDER BY revenue DESC
LIMIT 5;
-- SQL Server: SELECT TOP 5 …, và chuỗi '2026-01-01 00:00 +07:00' vì created_at là DATETIMEOFFSET</code></pre>
<div class="out">     category     | orders |   revenue
------------------+--------+--------------
 Máy tính cầm tay |    216 | 225855000.00
 Sổ tay           |    188 |  57982000.00
 Giáo trình IT    |    206 |  46403000.00
 Bút chì &amp; tẩy    |    202 |  22782000.00
 Bút dạ quang     |    185 |  16507000.00
(5 rows)</div>
<p>sqlcmd và mysql in đúng năm dòng này. Chỗ tinh tế duy nhất là chuỗi ngày: DATETIME của MySQL không có múi giờ (ta lưu giờ Việt Nam), DATETIMEOFFSET của SQL Server cần ghi rõ múi, còn PostgreSQL hiểu chuỗi theo múi giờ của phiên (<code>Asia/Ho_Chi_Minh</code>).</p>

<h3>Báo cáo 2 và 3 — ngày tháng và JSON</h3>
<table>
<tr><th>Việc</th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>Tháng dạng chữ</td><td><code>FORMAT(o.created_at, 'yyyy-MM')</code></td><td><code>DATE_FORMAT(o.created_at, '%Y-%m')</code></td><td><code>to_char(o.created_at, 'YYYY-MM')</code></td></tr>
<tr><td>GROUP BY theo bí danh</td><td>không được — lặp lại biểu thức</td><td><code>GROUP BY month</code></td><td><code>GROUP BY month</code></td></tr>
<tr><td>Đọc một trường JSON</td><td><code>JSON_VALUE(attrs, '$.brand')</code></td><td><code>attrs-&gt;&gt;'$.brand'</code></td><td><code>attrs-&gt;&gt;'brand'</code></td></tr>
<tr><td>Vài dòng đầu</td><td><code>TOP 3</code></td><td><code>LIMIT 3</code></td><td><code>LIMIT 3</code></td></tr>
</table>
<div class="out">  month  |   revenue
---------+-------------
 2026-07 | 61111000.00
 2026-08 | 37076000.00
 2026-09 | 42173000.00
(3 rows)

   brand    | products
------------+----------
 Thiên Long |        7
 Deli       |        6
 CT Books   |        5
(3 rows)</div>
<p>Lại giống hệt trên cả ba. JSON mới là chỗ cách lưu thật sự khác: SQL Server 2022 giữ nó dạng chữ cộng các hàm (đánh chỉ mục qua cột tính toán), MySQL có kiểu JSON nhị phân được kiểm hợp lệ, PostgreSQL có <code>jsonb</code> với các toán tử như <code>@&gt;</code> và chỉ mục GIN cho cả document (Chương 13).</p>

<h3>Phép thử 1 — CREATE TABLE trong một giao dịch</h3>
<pre><code class="language-sql">CREATE TABLE audit_log (msg text);
BEGIN;                                    -- SQL Server: BEGIN TRANSACTION; MySQL: START TRANSACTION
INSERT INTO audit_log VALUES ('price change');
CREATE TABLE t_ddl (id int);
INSERT INTO t_ddl VALUES (1);
ROLLBACK;
SELECT count(*) AS audit_rows FROM audit_log;
SELECT * FROM t_ddl;</code></pre>
<div class="out"> audit_rows
------------
          0
(1 row)

ERROR:  relation "t_ddl" does not exist</div>
<p>SQL Server đồng ý (audit_rows 0, <code>OBJECT_ID('t_ddl')</code> NULL). MySQL thì không:</p>
<div class="out">+------------+
| audit_rows |
+------------+
|          1 |
+------------+
+------------+
| t_ddl_rows |
+------------+
|          1 |
+------------+</div>
<p>Trong MySQL, một lệnh DDL gây ra <strong>commit ngầm</strong>: giao dịch đang mở (có dòng audit) bị commit trước, CREATE TABLE tự commit chính nó, lệnh INSERT kế tiếp chạy ở chế độ tự commit, và ROLLBACK chẳng còn gì để hoàn tác. PostgreSQL và SQL Server coi DDL là một phần của giao dịch. Hệ quả thực tế nằm ở migration: một migration mười bước hỏng ở bước bảy được hoàn tác trọn vẹn trên PostgreSQL, nhưng để lại một lược đồ nửa vời trên MySQL mà bạn phải sửa tay.</p>

<h3>Phép thử 2 — mức cô lập mặc định, với hai phiên thật</h3>
<table>
<tr><th></th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>Mặc định</td><td>READ COMMITTED có khoá (<code>is_read_committed_snapshot_on = 0</code>)</td><td>REPEATABLE READ (<code>@@transaction_isolation</code>)</td><td>READ COMMITTED (<code>SHOW default_transaction_isolation</code>)</td></tr>
<tr><td>Người đọc gặp người ghi chưa commit</td><td>chờ khoá</td><td>đọc phiên bản cũ (MVCC)</td><td>đọc phiên bản cũ (MVCC)</td></tr>
</table>
<p>Phiên A chạy <code>UPDATE product SET price = price + 1000 WHERE id = 1</code> và giữ giao dịch mở 8 giây. Hai giây sau phiên B đọc đúng dòng đó:</p>
<div class="out">-- SQL Server, phiên B (SET LOCK_TIMEOUT 3000)
phiên B lúc 20:31:29:
Msg 1222, Level 16, State 51, Server c2538cdfdc92, Line 2
Lock request time out period exceeded.
xong lúc 20:31:33

-- MySQL, phiên B
| price   |
| 5000.00 |
1 row in set (0.00 sec)

-- PostgreSQL, phiên B
  price
---------
 5000.00
(1 row)

Time: 0.847 ms</div>
<p>MySQL và PostgreSQL dùng <strong>MVCC</strong> (điều khiển đồng thời nhiều phiên bản): người ghi tạo một phiên bản mới của dòng, người đọc vẫn đọc bản đã commit gần nhất, nên người đọc không bao giờ phải chờ người ghi. Mặc định của SQL Server bắt người đọc chờ — ở đây tới khi hết 3 giây chờ thì bỏ cuộc. Bật <code>ALTER DATABASE ctshop SET READ_COMMITTED_SNAPSHOT ON</code> (mặc định của Azure SQL Database) thì cùng phiên B trả ngay 5000.00. Khi chuyển mã SQL Server sang PostgreSQL, các gợi ý <code>WITH (NOLOCK)</code> và vòng thử lại vì bị chặn trở nên thừa — nhưng người ghi vẫn có luật riêng (Chương 11).</p>

<h3>Phép thử 3 — upsert và số tự tăng</h3>
<p>Bảng <code>tag(id identity, name UNIQUE, hits)</code>: chèn 'sql', upsert 'sql' hai lần (cả hai thành cập nhật, hits = 3), rồi chèn 'json'.</p>
<div class="out"> id | name | hits
----+------+------
  1 | sql  |    3
  4 | json |    1
(2 rows)</div>
<p>MySQL in giống vậy (<code>| 4 | json | 1 |</code>); MERGE của SQL Server cho 'json' id <strong>2</strong>. ON DUPLICATE KEY của MySQL và ON CONFLICT của PostgreSQL lấy số mới trước rồi mới phát hiện xung đột — số 2 và 3 bị đốt. Khoảng trống cũng xuất hiện sau ROLLBACK. Đừng bao giờ dùng số tự tăng làm số hoá đơn không được nhảy cóc.</p>

<h3>Bảng tra hành vi</h3>
<table>
<tr><th></th><th>SQL Server</th><th>MySQL</th><th>PostgreSQL</th></tr>
<tr><td>CREATE TABLE trong giao dịch</td><td>hoàn tác được</td><td>commit ngầm</td><td>hoàn tác được</td></tr>
<tr><td>Cô lập mặc định</td><td>READ COMMITTED + khoá</td><td>REPEATABLE READ</td><td>READ COMMITTED</td></tr>
<tr><td>Người đọc gặp người ghi chưa commit</td><td>chờ (trừ khi bật READ_COMMITTED_SNAPSHOT)</td><td>bản cũ</td><td>bản cũ</td></tr>
<tr><td>JSON</td><td>chữ + hàm</td><td>kiểu JSON</td><td>jsonb + toán tử + GIN</td></tr>
<tr><td>Upsert đốt id</td><td>không (MERGE)</td><td>có</td><td>có</td></tr>
<tr><td>7 / 2 · 'abc' = 'ABC' (bài 0.5)</td><td>3 · bằng</td><td>3.5000 · bằng</td><td>3 · khác</td></tr>
</table>
<div class="pitfall"><p><strong>Bẫy — chỉ thử xem SQL có chạy không.</strong> Khác biệt cú pháp bị bắt ngay ngày đầu bằng một lỗi. Khác biệt hành vi bị bắt vài tháng sau bằng một báo cáo sai, một màn hình treo hay một lược đồ nửa vời. Khi chuyển dự án, hãy so <em>kết quả</em> của cùng các báo cáo, thử một migration hỏng giữa chừng, và thử tải với hai người sửa cùng các dòng.</p></div>

<h3>Chuyển dự án: checklist</h3>
<ol>
<li>Chạy cùng các báo cáo trên cả hai máy và so con số (phép chia, làm tròn, múi giờ).</li>
<li>Tìm trong mã <code>TOP</code>, <code>ISNULL</code>, dấu <code>+</code> nối chuỗi, <code>GETDATE</code>, <code>OUTPUT</code>, <code>MERGE</code>, ngoặc vuông và dấu huyền.</li>
<li>Kiểm mọi phép so sánh chữ: collation, ILIKE, dấu cách cuối.</li>
<li>Cố tình cho một migration hỏng giữa chừng và xem có hoàn tác được không.</li>
<li>Thử tải với nhiều người sửa cùng lúc: chặn khoá so với MVCC.</li>
<li>Đừng dựa vào id liền mạch; kiểm lại các truy vấn JSON và chỉ mục của chúng.</li>
</ol>
<p>Các công cụ như pgloader (MySQL / SQL Server → PostgreSQL), AWS SCT hay Babelfish chép dữ liệu và dịch cú pháp. Không công cụ nào kiểm hành vi hộ bạn.</p>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Tiếp: hình dạng còn lại</span><span class="lc-sub">Bài 17.3 — document MongoDB so với JSONB của PostgreSQL trên cùng 2.000 đơn.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.3 ─────────────────────────── */
    {
      title: '17.3 — MongoDB documents vs PostgreSQL JSONB|||17.3 — Document MongoDB và JSONB của PostgreSQL',
      slug: 'postgresql-17-3-mongodb-vs-jsonb',
      type: 'LESSON',
      description: 'CÙNG 2.000 đơn CT Shop lưu ba cách — bảng quan hệ, document MongoDB lồng order_item, cột JSONB — rồi truy vấn tương đương find/aggregate ↔ SQL/JSONB (@>, ->>), chỉ mục multikey của Mongo so với GIN, đo dung lượng, đổi tên sản phẩm; khi nào document thắng, khi nào bảng thắng.',
      content: `
${G173}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.3</span>
<h2>The same 2,000 orders as tables, as documents, as JSONB</h2>
<p class="lead">Lesson 17.1 showed the two shapes of data. Here we measure them: the CT Shop orders stored as relational tables, as MongoDB documents and as a PostgreSQL <code>jsonb</code> column — the same questions, the same answers, and the price each shape pays.</p>

<h3>Building the documents</h3>
<p>The documents are generated from the tables, so every answer can be checked against SQL. One query turns each order into a JSON object with the customer and the lines embedded:</p>
<pre><code class="language-sql">SELECT json_build_object(
  '_id', o.id,
  'customer', json_build_object('id', c.id, 'name', c.full_name, 'city', c.city),
  'status', o.status,
  'created_at', json_build_object('$date', to_char(o.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  'items', (SELECT json_agg(json_build_object('sku', p.sku, 'name', p.name, 'category', cat.name,
                                               'qty', oi.qty, 'unit_price', oi.unit_price) ORDER BY p.sku)
            FROM ch17.order_item oi JOIN ch17.product p ON p.id = oi.product_id
            JOIN ch17.category cat ON cat.id = p.category_id
            WHERE oi.order_id = o.id)
)::text
FROM ch17.orders o JOIN ch17.customer c ON c.id = o.customer_id ORDER BY o.id;   -- run with SET TIME ZONE 'UTC'</code></pre>
<pre><code class="language-bash">psql -At -f docs.sql &gt; orders.ndjson
mongoimport --db ctshop --collection orders --drop --file orders.ndjson</code></pre>
<div class="out">2000 document(s) imported successfully. 0 document(s) failed to import.</div>
<p>The PostgreSQL copy is a table <code>orders_doc (id int PRIMARY KEY, doc jsonb NOT NULL)</code> filled with <code>jsonb_build_object(…)</code> in the same shape. Note one difference you can see immediately: MongoDB keeps keys in the order you wrote them, while <code>jsonb</code> stores a parsed form and re-orders keys (<code>jsonb_pretty(doc)</code> lists <code>items</code> first). If key order matters, use <code>json</code> — but you lose indexing and fast operators.</p>

<h3>Question 1 — which orders contain product CT0503?</h3>
<pre><code class="language-javascript">db.orders.countDocuments({ "items.sku": "CT0503" })      // → 119</code></pre>
<pre><code class="language-sql">SELECT count(*) FROM orders_doc WHERE doc @&gt; '{"items": [{"sku": "CT0503"}]}';
SELECT count(DISTINCT oi.order_id) FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE p.sku = 'CT0503';</code></pre>
<div class="out"> count
-------
   119
(1 row)

 count
-------
   119
(1 row)</div>
<p>MongoDB walks the dot path into the array. PostgreSQL's <code>@&gt;</code> means “contains this smaller JSON”. The relational version simply joins. Three spellings, one answer.</p>

<h3>The operators you need</h3>
<table>
<tr><th>Task</th><th>MongoDB</th><th>PostgreSQL JSONB</th><th>Tables</th></tr>
<tr><td>Nested field</td><td><code>customer.name</code></td><td><code>doc-&gt;'customer'-&gt;&gt;'name'</code></td><td>JOIN customer</td></tr>
<tr><td>Contains</td><td><code>{ "items.sku": "CT0503" }</code></td><td><code>doc @&gt; '{"items":[{"sku":"CT0503"}]}'</code></td><td>EXISTS / JOIN</td></tr>
<tr><td>Has a key</td><td><code>{ note: { $exists: true } }</code></td><td><code>doc ? 'note'</code></td><td><code>note IS NOT NULL</code></td></tr>
<tr><td>Array length</td><td><code>{ $size: "$items" }</code></td><td><code>jsonb_array_length(doc-&gt;'items')</code></td><td>COUNT … GROUP BY</td></tr>
</table>
<pre><code class="language-sql">SELECT doc-&gt;'customer'-&gt;&gt;'name' AS customer, doc-&gt;&gt;'status' AS status,
       jsonb_array_length(doc-&gt;'items') AS n_items
FROM orders_doc WHERE id = 1;</code></pre>
<div class="out">  customer   | status | n_items
-------------+--------+---------
 Vũ Thị Bình | paid   |       2
(1 row)</div>
<p><code>-&gt;</code> returns JSON, <code>-&gt;&gt;</code> returns text. Chapter 13.1–13.2 covers all of them properly.</p>

<h3>Question 2 — revenue by category</h3>
<pre><code class="language-javascript">db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] }, created_at: { $gte: ISODate("2025-12-31T17:00:00Z") } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.category", orders: { $addToSet: "$_id" },
              revenue: { $sum: { $multiply: ["$items.qty", "$items.unit_price"] } } } },
  { $project: { orders: { $size: "$orders" }, revenue: 1 } },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
])</code></pre>
<div class="out">{ _id: 'Máy tính cầm tay', revenue: 225855000, orders: 216 }
{ _id: 'Sổ tay', revenue: 57982000, orders: 188 }
{ _id: 'Giáo trình IT', revenue: 46403000, orders: 206 }
{ _id: 'Bút chì &amp; tẩy', revenue: 22782000, orders: 202 }
{ _id: 'Bút dạ quang', revenue: 16507000, orders: 185 }</div>
<p>(mongosh prints each document over several lines; the values are shown here one per line.) A pipeline runs its stages in order: <code>$match</code> ≈ WHERE, <code>$unwind</code> = one record per array element, <code>$group</code> ≈ GROUP BY, <code>$project</code> ≈ SELECT, <code>$sort</code>/<code>$limit</code> ≈ ORDER BY/LIMIT. The same report on JSONB uses <code>jsonb_array_elements</code> as the twin of <code>$unwind</code>:</p>
<pre><code class="language-sql">SELECT i-&gt;&gt;'category' AS category, count(DISTINCT d.id) AS orders,
       sum((i-&gt;&gt;'qty')::int * (i-&gt;&gt;'unit_price')::numeric) AS revenue
FROM orders_doc d, jsonb_array_elements(d.doc-&gt;'items') AS i
WHERE d.doc-&gt;&gt;'status' IN ('paid', 'shipped') AND (d.doc-&gt;&gt;'created_at')::timestamptz &gt;= '2026-01-01'
GROUP BY 1 ORDER BY revenue DESC LIMIT 5;</code></pre>
<div class="out">     category     | orders |   revenue
------------------+--------+--------------
 Máy tính cầm tay |    216 | 225855000.00
 Sổ tay           |    188 |  57982000.00
 Giáo trình IT    |    206 |  46403000.00
 Bút chì &amp; tẩy    |    202 |  22782000.00
 Bút dạ quang     |    185 |  16507000.00
(5 rows)</div>
<p>Exactly the numbers the relational report printed on three servers in Lesson 17.2.</p>

<h3>Indexes on both sides</h3>
<p><strong>MongoDB</strong> — before and after <code>db.orders.createIndex({ "items.sku": 1 })</code> (fields picked from <code>explain("executionStats")</code>):</p>
<div class="out">{ stage: 'COLLSCAN', nReturned: 119, totalDocsExamined: 2000, totalKeysExamined: 0 }
items.sku_1
{ stage: 'IXSCAN', isMultiKey: true, nReturned: 119, totalDocsExamined: 119, totalKeysExamined: 119 }</div>
<p>Because <code>items</code> is an array, the index is <strong>multikey</strong>: one entry per element. <strong>PostgreSQL</strong> — a GIN (Generalized Inverted Index) on the whole document:</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT count(*) FROM orders_doc WHERE doc @&gt; '{"items": [{"sku": "CT0503"}]}';
CREATE INDEX orders_doc_gin ON orders_doc USING gin (doc jsonb_path_ops);
ANALYZE orders_doc;
-- the same EXPLAIN again</code></pre>
<div class="out">                            QUERY PLAN
------------------------------------------------------------------
 Aggregate (actual rows=1 loops=1)
   -&gt;  Seq Scan on orders_doc (actual rows=119 loops=1)
         Filter: (doc @&gt; '{"items": [{"sku": "CT0503"}]}'::jsonb)
         Rows Removed by Filter: 1881
 Planning Time: 0.208 ms
 Execution Time: 0.594 ms
(6 rows)

                                 QUERY PLAN
----------------------------------------------------------------------------
 Aggregate (actual rows=1 loops=1)
   -&gt;  Bitmap Heap Scan on orders_doc (actual rows=119 loops=1)
         Recheck Cond: (doc @&gt; '{"items": [{"sku": "CT0503"}]}'::jsonb)
         Heap Blocks: exact=86
         -&gt;  Bitmap Index Scan on orders_doc_gin (actual rows=119 loops=1)
               Index Cond: (doc @&gt; '{"items": [{"sku": "CT0503"}]}'::jsonb)
 Planning Time: 0.286 ms
 Execution Time: 0.337 ms
(8 rows)</div>
<p>Same idea on both sides: without an index every document is read; with one, only the matching 119 are. (With 2,000 rows both are fast; the gap grows with the data — Chapter 9.)</p>

<h3>What the copies cost</h3>
<pre><code class="language-sql">SELECT pg_size_pretty(pg_table_size('orders_doc')) AS orders_doc_data,
       pg_size_pretty(pg_table_size('orders') + pg_table_size('order_item')) AS orders_plus_items_data,
       pg_size_pretty(pg_relation_size('orders_doc_gin')) AS gin_index;</code></pre>
<div class="out"> orders_doc_data | orders_plus_items_data | gin_index
-----------------+------------------------+-----------
 1216 kB         | 432 kB                 | 248 kB
(1 row)</div>
<p>MongoDB reported <code>size: 894954</code> bytes of BSON data for the collection (before compression). The documents are about 2.8 times bigger than the two tables because every order repeats the key names and copies product names and category text that tables store once.</p>

<h3>Changing shared data</h3>
<pre><code class="language-javascript">db.orders.updateMany({ "items.sku": "CT0503" },
  { $set: { "items.$[i].name": "Bút bi Pentel BK77 0.7mm (2027)" } },
  { arrayFilters: [{ "i.sku": "CT0503" }] })</code></pre>
<div class="out">{
  acknowledged: true,
  insertedId: null,
  matchedCount: 119,
  modifiedCount: 119,
  upsertedCount: 0
}</div>
<p>Renaming one product rewrote 119 documents. In the tables it is <code>UPDATE product SET name = … WHERE sku = 'CT0503'</code> → <code>UPDATE 1</code>. But be precise about which copies are a problem: a customer's email or a product's <em>current</em> name copied into documents must be kept in sync. An order line that records the name and price of the day it was sold is a <strong>snapshot</strong> — you want it frozen. CT Shop's tables do the same with <code>order_item.unit_price</code>.</p>

<h3>When documents win, when tables win</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Documents win</span><span class="v">data read and written as one unit (an order, a product page, a profile); shapes that vary between records; append-mostly JSON such as logs and events; one collection that must be sharded across machines.</span></div>
  <div class="kv"><span class="k">Tables win</span><span class="v">many-to-many relationships; new reports every week across everything; shared facts that change (prices, names, stock); integrity enforced by the database — foreign keys, CHECK, UNIQUE across tables, transactions everywhere.</span></div>
  <div class="kv"><span class="k">PostgreSQL's middle road</span><span class="v">tables for the core, a JSONB column with a GIN index for the parts that vary — CT Shop's <code>product.attrs</code>, and the 266 JSON fields of cuongthai.com.</span></div>
  <div class="kv"><span class="k">MongoDB can relate too</span><span class="v"><code>$lookup</code> joins collections; multi-document transactions work on a replica set since 4.0. They exist — they are just not the model's sweet spot.</span></div>
</div>

<h3>Exercise</h3>
<ol>
<li>Count <strong>paid</strong> orders from customers in <strong>Đà Nẵng</strong>, in MQL and with JSONB <code>@&gt;</code>; check with a JOIN.</li>
<li>List the first 3 order ids that contain an item with <code>qty</code> ≥ 3, in MQL and in SQL on JSONB.</li>
</ol>
<details><summary>Answers (real output)</summary>
<pre><code class="language-javascript">db.orders.countDocuments({ "customer.city": "Đà Nẵng", status: "paid" })                  // 141
db.orders.find({ "items.qty": { $gte: 3 } }, { _id: 1 }).sort({ _id: 1 }).limit(3)       // { _id: 3 } { _id: 5 } { _id: 6 }</code></pre>
<pre><code class="language-sql">SELECT count(*) FROM orders_doc WHERE doc @&gt; '{"customer": {"city": "Đà Nẵng"}, "status": "paid"}';   -- 141
SELECT count(*) FROM orders o JOIN customer c ON c.id = o.customer_id WHERE c.city = 'Đà Nẵng' AND o.status = 'paid';  -- 141
SELECT id FROM orders_doc d
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(d.doc-&gt;'items') i WHERE (i-&gt;&gt;'qty')::int &gt;= 3)
ORDER BY id LIMIT 3;</code></pre>
<div class="out"> id
----
  3
  5
  6
(3 rows)</div>
</details>
<div class="pitfall"><p><strong>Trap — “schemaless” as a reason.</strong> A MongoDB collection accepts any document, so mistakes (a typo in a field name, a price stored as text) are accepted too. The schema still exists — in your code, your validators (<code>$jsonSchema</code>) and your head. Choose documents because the data is document-shaped, not to skip design.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next: how to choose</span><span class="lc-sub">Lesson 17.4 — a decision method, real situations, and two case studies.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.3</span>
<h2>Cùng 2.000 đơn dưới dạng bảng, dạng document, dạng JSONB</h2>
<p class="lead">Bài 17.1 đã cho thấy hai hình dạng dữ liệu. Ở đây ta đo chúng: các đơn CT Shop lưu thành bảng quan hệ, thành document MongoDB và thành một cột <code>jsonb</code> của PostgreSQL — cùng câu hỏi, cùng đáp án, và cái giá mà mỗi hình dạng phải trả.</p>

<h3>Dựng các document</h3>
<p>Document được sinh ra từ chính các bảng, nên đáp án nào cũng kiểm lại được bằng SQL. Một câu truy vấn biến mỗi đơn thành một đối tượng JSON, nhúng sẵn khách và các dòng hàng:</p>
<pre><code class="language-sql">SELECT json_build_object(
  '_id', o.id,
  'customer', json_build_object('id', c.id, 'name', c.full_name, 'city', c.city),
  'status', o.status,
  'created_at', json_build_object('$date', to_char(o.created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
  'items', (SELECT json_agg(json_build_object('sku', p.sku, 'name', p.name, 'category', cat.name,
                                               'qty', oi.qty, 'unit_price', oi.unit_price) ORDER BY p.sku)
            FROM ch17.order_item oi JOIN ch17.product p ON p.id = oi.product_id
            JOIN ch17.category cat ON cat.id = p.category_id
            WHERE oi.order_id = o.id)
)::text
FROM ch17.orders o JOIN ch17.customer c ON c.id = o.customer_id ORDER BY o.id;   -- chạy với SET TIME ZONE 'UTC'</code></pre>
<pre><code class="language-bash">psql -At -f docs.sql &gt; orders.ndjson
mongoimport --db ctshop --collection orders --drop --file orders.ndjson</code></pre>
<div class="out">2000 document(s) imported successfully. 0 document(s) failed to import.</div>
<p>Bản PostgreSQL là bảng <code>orders_doc (id int PRIMARY KEY, doc jsonb NOT NULL)</code>, đổ dữ liệu bằng <code>jsonb_build_object(…)</code> với cùng hình dạng. Để ý một khác biệt thấy ngay: MongoDB giữ thứ tự khoá như bạn viết, còn <code>jsonb</code> lưu dạng đã phân tích và sắp lại khoá (<code>jsonb_pretty(doc)</code> in <code>items</code> lên đầu). Nếu thứ tự khoá quan trọng thì dùng <code>json</code> — nhưng mất chỉ mục và toán tử nhanh.</p>

<h3>Câu hỏi 1 — những đơn nào có sản phẩm CT0503?</h3>
<pre><code class="language-javascript">db.orders.countDocuments({ "items.sku": "CT0503" })      // → 119</code></pre>
<pre><code class="language-sql">SELECT count(*) FROM orders_doc WHERE doc @&gt; '{"items": [{"sku": "CT0503"}]}';
SELECT count(DISTINCT oi.order_id) FROM order_item oi JOIN product p ON p.id = oi.product_id WHERE p.sku = 'CT0503';</code></pre>
<div class="out"> count
-------
   119
(1 row)

 count
-------
   119
(1 row)</div>
<p>MongoDB đi theo đường chấm vào trong mảng. <code>@&gt;</code> của PostgreSQL nghĩa là “chứa đoạn JSON nhỏ này”. Bản quan hệ thì chỉ việc JOIN. Ba cách viết, một đáp án.</p>

<h3>Các toán tử cần biết</h3>
<table>
<tr><th>Việc</th><th>MongoDB</th><th>PostgreSQL JSONB</th><th>Bảng</th></tr>
<tr><td>Trường lồng nhau</td><td><code>customer.name</code></td><td><code>doc-&gt;'customer'-&gt;&gt;'name'</code></td><td>JOIN customer</td></tr>
<tr><td>Chứa</td><td><code>{ "items.sku": "CT0503" }</code></td><td><code>doc @&gt; '{"items":[{"sku":"CT0503"}]}'</code></td><td>EXISTS / JOIN</td></tr>
<tr><td>Có khoá</td><td><code>{ note: { $exists: true } }</code></td><td><code>doc ? 'note'</code></td><td><code>note IS NOT NULL</code></td></tr>
<tr><td>Độ dài mảng</td><td><code>{ $size: "$items" }</code></td><td><code>jsonb_array_length(doc-&gt;'items')</code></td><td>COUNT … GROUP BY</td></tr>
</table>
<pre><code class="language-sql">SELECT doc-&gt;'customer'-&gt;&gt;'name' AS customer, doc-&gt;&gt;'status' AS status,
       jsonb_array_length(doc-&gt;'items') AS n_items
FROM orders_doc WHERE id = 1;</code></pre>
<div class="out">  customer   | status | n_items
-------------+--------+---------
 Vũ Thị Bình | paid   |       2
(1 row)</div>
<p><code>-&gt;</code> trả JSON, <code>-&gt;&gt;</code> trả chữ. Chương 13.1–13.2 dạy đầy đủ.</p>

<h3>Câu hỏi 2 — doanh thu theo danh mục</h3>
<pre><code class="language-javascript">db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] }, created_at: { $gte: ISODate("2025-12-31T17:00:00Z") } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.category", orders: { $addToSet: "$_id" },
              revenue: { $sum: { $multiply: ["$items.qty", "$items.unit_price"] } } } },
  { $project: { orders: { $size: "$orders" }, revenue: 1 } },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
])</code></pre>
<div class="out">{ _id: 'Máy tính cầm tay', revenue: 225855000, orders: 216 }
{ _id: 'Sổ tay', revenue: 57982000, orders: 188 }
{ _id: 'Giáo trình IT', revenue: 46403000, orders: 206 }
{ _id: 'Bút chì &amp; tẩy', revenue: 22782000, orders: 202 }
{ _id: 'Bút dạ quang', revenue: 16507000, orders: 185 }</div>
<p>(mongosh in mỗi document trên vài dòng; ở đây gom mỗi kết quả một dòng.) Pipeline chạy các chặng theo thứ tự: <code>$match</code> ≈ WHERE, <code>$unwind</code> = mỗi phần tử mảng thành một bản ghi, <code>$group</code> ≈ GROUP BY, <code>$project</code> ≈ SELECT, <code>$sort</code>/<code>$limit</code> ≈ ORDER BY/LIMIT. Cùng báo cáo trên JSONB dùng <code>jsonb_array_elements</code> làm anh em sinh đôi của <code>$unwind</code>:</p>
<pre><code class="language-sql">SELECT i-&gt;&gt;'category' AS category, count(DISTINCT d.id) AS orders,
       sum((i-&gt;&gt;'qty')::int * (i-&gt;&gt;'unit_price')::numeric) AS revenue
FROM orders_doc d, jsonb_array_elements(d.doc-&gt;'items') AS i
WHERE d.doc-&gt;&gt;'status' IN ('paid', 'shipped') AND (d.doc-&gt;&gt;'created_at')::timestamptz &gt;= '2026-01-01'
GROUP BY 1 ORDER BY revenue DESC LIMIT 5;</code></pre>
<div class="out">     category     | orders |   revenue
------------------+--------+--------------
 Máy tính cầm tay |    216 | 225855000.00
 Sổ tay           |    188 |  57982000.00
 Giáo trình IT    |    206 |  46403000.00
 Bút chì &amp; tẩy    |    202 |  22782000.00
 Bút dạ quang     |    185 |  16507000.00
(5 rows)</div>
<p>Đúng những con số báo cáo quan hệ đã in trên ba máy chủ ở bài 17.2.</p>

<h3>Chỉ mục ở hai phía</h3>
<p><strong>MongoDB</strong> — trước và sau <code>db.orders.createIndex({ "items.sku": 1 })</code> (các trường trích từ <code>explain("executionStats")</code>):</p>
<div class="out">{ stage: 'COLLSCAN', nReturned: 119, totalDocsExamined: 2000, totalKeysExamined: 0 }
items.sku_1
{ stage: 'IXSCAN', isMultiKey: true, nReturned: 119, totalDocsExamined: 119, totalKeysExamined: 119 }</div>
<p>Vì <code>items</code> là mảng nên chỉ mục là <strong>multikey</strong>: mỗi phần tử một mục. <strong>PostgreSQL</strong> — chỉ mục GIN (chỉ mục đảo tổng quát) trên cả document:</p>
<pre><code class="language-sql">EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)
SELECT count(*) FROM orders_doc WHERE doc @&gt; '{"items": [{"sku": "CT0503"}]}';
CREATE INDEX orders_doc_gin ON orders_doc USING gin (doc jsonb_path_ops);
ANALYZE orders_doc;
-- chạy lại đúng câu EXPLAIN đó</code></pre>
<div class="out">                            QUERY PLAN
------------------------------------------------------------------
 Aggregate (actual rows=1 loops=1)
   -&gt;  Seq Scan on orders_doc (actual rows=119 loops=1)
         Filter: (doc @&gt; '{"items": [{"sku": "CT0503"}]}'::jsonb)
         Rows Removed by Filter: 1881
 Planning Time: 0.208 ms
 Execution Time: 0.594 ms
(6 rows)

                                 QUERY PLAN
----------------------------------------------------------------------------
 Aggregate (actual rows=1 loops=1)
   -&gt;  Bitmap Heap Scan on orders_doc (actual rows=119 loops=1)
         Recheck Cond: (doc @&gt; '{"items": [{"sku": "CT0503"}]}'::jsonb)
         Heap Blocks: exact=86
         -&gt;  Bitmap Index Scan on orders_doc_gin (actual rows=119 loops=1)
               Index Cond: (doc @&gt; '{"items": [{"sku": "CT0503"}]}'::jsonb)
 Planning Time: 0.286 ms
 Execution Time: 0.337 ms
(8 rows)</div>
<p>Cùng một ý ở hai phía: không có chỉ mục thì đọc mọi document; có chỉ mục thì chỉ đọc đúng 119 cái khớp. (Với 2.000 dòng thì cả hai đều nhanh; khoảng cách lớn dần theo dữ liệu — Chương 9.)</p>

<h3>Cái giá của bản chép</h3>
<pre><code class="language-sql">SELECT pg_size_pretty(pg_table_size('orders_doc')) AS orders_doc_data,
       pg_size_pretty(pg_table_size('orders') + pg_table_size('order_item')) AS orders_plus_items_data,
       pg_size_pretty(pg_relation_size('orders_doc_gin')) AS gin_index;</code></pre>
<div class="out"> orders_doc_data | orders_plus_items_data | gin_index
-----------------+------------------------+-----------
 1216 kB         | 432 kB                 | 248 kB
(1 row)</div>
<p>MongoDB báo <code>size: 894954</code> byte dữ liệu BSON cho collection (trước khi nén). Document to gấp khoảng 2,8 lần hai bảng vì đơn nào cũng lặp lại tên khoá và chép tên sản phẩm, tên danh mục — những thứ mà bảng chỉ lưu một lần.</p>

<h3>Sửa dữ liệu dùng chung</h3>
<pre><code class="language-javascript">db.orders.updateMany({ "items.sku": "CT0503" },
  { $set: { "items.$[i].name": "Bút bi Pentel BK77 0.7mm (2027)" } },
  { arrayFilters: [{ "i.sku": "CT0503" }] })</code></pre>
<div class="out">{
  acknowledged: true,
  insertedId: null,
  matchedCount: 119,
  modifiedCount: 119,
  upsertedCount: 0
}</div>
<p>Đổi tên một sản phẩm phải ghi lại 119 document. Trong bảng chỉ là <code>UPDATE product SET name = … WHERE sku = 'CT0503'</code> → <code>UPDATE 1</code>. Nhưng hãy phân biệt rõ bản chép nào mới là vấn đề: email của khách hay tên <em>hiện tại</em> của sản phẩm chép vào document thì phải giữ đồng bộ. Còn dòng đơn ghi lại tên và giá của ngày bán là một <strong>ảnh chụp</strong> — bạn muốn nó đứng yên. Các bảng CT Shop cũng làm vậy với <code>order_item.unit_price</code>.</p>

<h3>Khi nào document thắng, khi nào bảng thắng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Document thắng</span><span class="v">dữ liệu được đọc và ghi như một khối (một đơn, một trang sản phẩm, một hồ sơ); hình dạng thay đổi giữa các bản ghi; JSON chủ yếu được nối thêm như log, sự kiện; một collection phải chia mảnh ra nhiều máy.</span></div>
  <div class="kv"><span class="k">Bảng thắng</span><span class="v">quan hệ nhiều-nhiều; báo cáo mới mỗi tuần trên toàn bộ dữ liệu; sự thật dùng chung hay thay đổi (giá, tên, tồn kho); toàn vẹn do cơ sở dữ liệu bảo đảm — khoá ngoại, CHECK, UNIQUE xuyên bảng, giao dịch ở mọi nơi.</span></div>
  <div class="kv"><span class="k">Con đường giữa của PostgreSQL</span><span class="v">bảng cho phần lõi, một cột JSONB có chỉ mục GIN cho phần hay thay đổi — <code>product.attrs</code> của CT Shop, và 266 trường JSON của cuongthai.com.</span></div>
  <div class="kv"><span class="k">MongoDB cũng biết quan hệ</span><span class="v"><code>$lookup</code> nối các collection; giao dịch nhiều document chạy trên replica set từ 4.0. Chúng có — chỉ không phải sở trường của mô hình này.</span></div>
</div>

<h3>Bài tập</h3>
<ol>
<li>Đếm đơn <strong>đã thanh toán</strong> của khách ở <strong>Đà Nẵng</strong>, bằng MQL và bằng JSONB <code>@&gt;</code>; kiểm lại bằng JOIN.</li>
<li>Liệt kê 3 mã đơn đầu tiên có dòng hàng <code>qty</code> ≥ 3, bằng MQL và bằng SQL trên JSONB.</li>
</ol>
<details><summary>Đáp án (output thật)</summary>
<pre><code class="language-javascript">db.orders.countDocuments({ "customer.city": "Đà Nẵng", status: "paid" })                  // 141
db.orders.find({ "items.qty": { $gte: 3 } }, { _id: 1 }).sort({ _id: 1 }).limit(3)       // { _id: 3 } { _id: 5 } { _id: 6 }</code></pre>
<pre><code class="language-sql">SELECT count(*) FROM orders_doc WHERE doc @&gt; '{"customer": {"city": "Đà Nẵng"}, "status": "paid"}';   -- 141
SELECT count(*) FROM orders o JOIN customer c ON c.id = o.customer_id WHERE c.city = 'Đà Nẵng' AND o.status = 'paid';  -- 141
SELECT id FROM orders_doc d
WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(d.doc-&gt;'items') i WHERE (i-&gt;&gt;'qty')::int &gt;= 3)
ORDER BY id LIMIT 3;</code></pre>
<div class="out"> id
----
  3
  5
  6
(3 rows)</div>
</details>
<div class="pitfall"><p><strong>Bẫy — lấy “không lược đồ” làm lý do.</strong> Một collection MongoDB nhận mọi document, nên cũng nhận cả lỗi (gõ sai tên trường, giá lưu thành chữ). Lược đồ vẫn tồn tại — trong code, trong bộ kiểm (<code>$jsonSchema</code>) và trong đầu bạn. Hãy chọn document vì dữ liệu có hình dạng document, chứ không phải để né thiết kế.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Tiếp: chọn thế nào</span><span class="lc-sub">Bài 17.4 — một phương pháp ra quyết định, tình huống thật, và hai ca thực tế.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.4 ─────────────────────────── */
    {
      title: '17.4 — Which one should you choose?|||17.4 — Chọn hệ nào?',
      slug: 'postgresql-17-4-chon-he-nao',
      type: 'LESSON',
      description: 'Sáu câu hỏi trước khi gọi tên một cơ sở dữ liệu, bảng quyết định cho tình huống thật (start-up web, ERP .NET, WordPress/LAMP, log/sự kiện, phân tích, danh mục sản phẩm), cây quyết định một trang, và vì sao cuongthai.com (Prisma) lẫn LabFlow AI (Spring Boot) cùng chọn PostgreSQL.',
      content: `
${G174}
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Lesson 17.4</span>
<h2>Choosing a database without guessing</h2>
<p class="lead">Nobody asks “which vehicle is best?” — you ask what you carry, where, how often, with which driver, on what budget. The previous three lessons measured real differences between SQL Server, MySQL, PostgreSQL and MongoDB. This lesson turns them into a method.</p>

<h3>Six questions before any brand name</h3>
<ol>
<li><strong>Shape</strong> — many linked things (orders ↔ products ↔ customers) or self-contained documents?</li>
<li><strong>Correctness</strong> — money, stock, grades? Then you need transactions and constraints everywhere.</li>
<li><strong>Questions</strong> — only fixed screens, or new reports every week?</li>
<li><strong>Team and stack</strong> — C#/.NET, PHP, Node/Python, Java? Which database does your ORM support best?</li>
<li><strong>Cost and licence</strong> — free at any size, or paid per CPU core?</li>
<li><strong>Operations</strong> — who runs backups and upgrades; managed cloud or your own VPS; how big will it get?</li>
</ol>
<p>Write one sentence for each in the project README before the first migration. A database outlives most frameworks and is the hardest thing to change later — and use evidence such as Lesson 17.2's behaviour table and Lesson 17.3's measurements, not opinions.</p>

<h3>Decision table</h3>
<table>
<tr><th>Situation</th><th>Usual pick</th><th>Why</th><th>Also fine</th></tr>
<tr><td>Start-up / SaaS web app (Node, Python, Java)</td><td><strong>PostgreSQL</strong></td><td>free at any size; relational + JSONB + full-text; first-class in Prisma, Django, Spring; managed everywhere (RDS, Supabase, Neon)</td><td>MySQL</td></tr>
<tr><td>Enterprise ERP / internal .NET systems</td><td><strong>SQL Server</strong></td><td>licences and DBAs already there; SSMS, Reporting/Integration Services, Windows and Active Directory integration; Entity Framework</td><td>PostgreSQL (to cut licence cost)</td></tr>
<tr><td>WordPress, PHP shared hosting (LAMP)</td><td><strong>MySQL / MariaDB</strong></td><td>WordPress supports only MySQL/MariaDB; every cheap host offers it</td><td>—</td></tr>
<tr><td>Product catalogue with varying attributes</td><td><strong>PostgreSQL</strong> tables + JSONB</td><td>constraints on price and stock, JSONB + GIN for attributes (CT Shop's <code>product.attrs</code>)</td><td>MongoDB</td></tr>
<tr><td>High-volume logs and events, flexible payloads</td><td><strong>MongoDB</strong> or PostgreSQL partitions</td><td>append-only JSON, often sharded; PostgreSQL partitions with BRIN indexes also go far (Chapter 15.4)</td><td>a log platform (Elasticsearch, ClickHouse)</td></tr>
<tr><td>Analytics and dashboards</td><td><strong>PostgreSQL</strong> to start</td><td>window functions, materialized views (Chapters 8, 12); a column store only at billions of rows</td><td>ClickHouse, BigQuery (outside this course)</td></tr>
<tr><td>MERN side project, learning</td><td><strong>MongoDB</strong> or PostgreSQL</td><td>MongoDB matches MERN tutorials; PostgreSQL (Supabase / Neon free tiers) teaches skills used at work</td><td>—</td></tr>
</table>

<h3>A decision tree for the team meeting</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">WordPress, or a host that only offers MySQL?</div><div class="lz-sd">Yes → MySQL / MariaDB.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">.NET company with SQL Server licences and DBAs?</div><div class="lz-sd">Yes → SQL Server.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Self-contained JSON documents, few cross-reports, need sharding?</div><div class="lz-sd">Yes → MongoDB.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">None of the above, or not sure</div><div class="lz-sd">PostgreSQL, with JSONB for the flexible parts — free, relational where it matters, document-friendly where needed, extensible.</div></div>
</div>

<h3>Case study 1 — cuongthai.com</h3>
<p>Measured in the repository (25/10/2026):</p>
<pre><code class="language-bash">$ grep -n 'provider' prisma/schema.prisma | head -2
8:  provider = "prisma-client-js"
12:  provider = "postgresql"
$ grep -c '^model ' prisma/schema.prisma
602
$ grep -c '^enum ' prisma/schema.prisma
57
$ grep -cE '^\\s+\\w+\\s+Json' prisma/schema.prisma
266
$ ls prisma/migrations | grep -c '^2'
235
$ grep -n 'image: ghcr.io/cuonghoang1103/api-backend-postgres' docker-compose.yml
21:    image: ghcr.io/cuonghoang1103/api-backend-postgres:16-3.4-pgvector</code></pre>
<p>Plus 8 migrations that add full-text search (<code>tsvector</code>) and a <code>vector(384)</code> column for AI similarity search. Why PostgreSQL won here: <strong>one engine</strong> holds relational data, documents (JSONB), search, vectors (pgvector) and maps (PostGIS) — one backup, one skill set; the licence is free on a small VPS; Prisma's PostgreSQL provider is its most complete; and migrations are transactional, so a failed one rolls back cleanly (Lesson 17.2).</p>

<h3>Case study 2 — LabFlow AI (graduation project)</h3>
<pre><code class="language-bash">$ grep -n "image:" docker-compose.yml
4:    image: postgres:16-alpine
$ grep spring-boot-starter-parent -A1 backend/pom.xml | grep version
        &lt;version&gt;3.5.6&lt;/version&gt;
$ ls backend/src/main/resources/db/migration
V1__init.sql  V2__demo_catalog.sql  V3__auth_sessions.sql</code></pre>
<p>A Java backend (Spring Boot 3.5) with Flyway migrations reached the same answer as the Node/Prisma website: PostgreSQL 16, with room for pgvector when the RAG features arrive. The database followed the data and the team, not the framework. Had LabFlow been required to plug into a university that runs everything on SQL Server with its own DBAs, question 2 of the tree would win — and that would be a perfectly good choice.</p>

<h3>Mistakes when choosing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">“MongoDB, because no schema is faster”</span><span class="v">…then re-inventing joins and constraints in application code. Model the data first (ERD, Chapter 3); let its shape suggest the store.</span></div>
  <div class="kv"><span class="k">Copying a famous company</span><span class="v">Their scale and team are not yours. Match today's scale and plan the migration path.</span></div>
  <div class="kv"><span class="k">Three databases for two people</span><span class="v">Each one needs backups, upgrades and monitoring. Keep one primary database; add a specialised one only with a measured reason.</span></div>
  <div class="kv"><span class="k">Ignoring the licence</span><span class="v">Read the licence and price page on day one, not at the first production invoice.</span></div>
</div>
<div class="callout ok">Whatever you choose, the work of Chapters 3 and 9–15 stays: schema design, indexes and query plans, transactions and concurrency, backups you have actually restored. The engine changes the syntax and some behaviours — not the discipline.</div>

<h3>Exercise</h3>
<ol>
<li>A café chain wants a website with a blog and an online menu on a cheap PHP host.</li>
<li>A bank's internal loan system written in C#, with an existing SQL Server team.</li>
<li>A start-up marketplace in Next.js + Prisma with orders, reviews and flexible product specs.</li>
<li>An IoT project storing millions of sensor readings a day, each with a different JSON payload.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1 · WordPress on MySQL/MariaDB — the host decides. 2 · SQL Server — team, licences and tooling are already there. 3 · PostgreSQL — relational orders, JSONB specs with a GIN index, Prisma. 4 · MongoDB with sharding, or PostgreSQL with partitions — measure both with your real payloads; a time-series database is also worth a look.</p>
</details>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chapter 17 quiz — then the final exam</span><span class="lc-sub">Labs 1–9 are your portfolio: the CT Shop database you built is real.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 17 · Bài 17.4</span>
<h2>Chọn cơ sở dữ liệu mà không đoán mò</h2>
<p class="lead">Không ai hỏi “xe nào tốt nhất?” — người ta hỏi chở gì, đi đâu, bao lâu một lần, ai lái, ngân sách bao nhiêu. Ba bài trước đã đo những khác biệt có thật giữa SQL Server, MySQL, PostgreSQL và MongoDB. Bài này biến chúng thành một phương pháp.</p>

<h3>Sáu câu hỏi trước khi gọi tên hãng</h3>
<ol>
<li><strong>Hình dạng</strong> — nhiều thứ liên kết nhau (đơn ↔ sản phẩm ↔ khách) hay các document khép kín?</li>
<li><strong>Độ chính xác</strong> — tiền, tồn kho, điểm số? Khi đó cần giao dịch và ràng buộc ở mọi nơi.</li>
<li><strong>Câu hỏi</strong> — chỉ vài màn hình cố định, hay tuần nào cũng có báo cáo mới?</li>
<li><strong>Đội ngũ và nền tảng</strong> — C#/.NET, PHP, Node/Python, Java? ORM của bạn hỗ trợ cơ sở dữ liệu nào tốt nhất?</li>
<li><strong>Chi phí và giấy phép</strong> — miễn phí ở mọi quy mô, hay trả theo nhân CPU?</li>
<li><strong>Vận hành</strong> — ai lo sao lưu và nâng cấp; dùng dịch vụ đám mây hay VPS riêng; sẽ lớn tới đâu?</li>
</ol>
<p>Viết mỗi câu trả lời một dòng vào README của dự án trước migration đầu tiên. Cơ sở dữ liệu sống lâu hơn hầu hết framework và là thứ khó đổi nhất về sau — và hãy dùng bằng chứng như bảng hành vi của bài 17.2 và số đo của bài 17.3, chứ không dùng cảm tính.</p>

<h3>Bảng quyết định</h3>
<table>
<tr><th>Tình huống</th><th>Thường chọn</th><th>Vì sao</th><th>Cũng ổn</th></tr>
<tr><td>Web app khởi nghiệp / SaaS (Node, Python, Java)</td><td><strong>PostgreSQL</strong></td><td>miễn phí ở mọi quy mô; quan hệ + JSONB + full-text; hỗ trợ tốt nhất trong Prisma, Django, Spring; có dịch vụ quản lý khắp nơi (RDS, Supabase, Neon)</td><td>MySQL</td></tr>
<tr><td>ERP doanh nghiệp / hệ thống nội bộ .NET</td><td><strong>SQL Server</strong></td><td>giấy phép và DBA đã có sẵn; SSMS, Reporting/Integration Services, tích hợp Windows và Active Directory; Entity Framework</td><td>PostgreSQL (để cắt chi phí giấy phép)</td></tr>
<tr><td>WordPress, hosting PHP dùng chung (LAMP)</td><td><strong>MySQL / MariaDB</strong></td><td>WordPress chỉ hỗ trợ MySQL/MariaDB; hosting rẻ nào cũng có</td><td>—</td></tr>
<tr><td>Danh mục sản phẩm có thuộc tính thay đổi</td><td>Bảng <strong>PostgreSQL</strong> + JSONB</td><td>ràng buộc cho giá và tồn kho, JSONB + GIN cho thuộc tính (<code>product.attrs</code> của CT Shop)</td><td>MongoDB</td></tr>
<tr><td>Log và sự kiện khối lượng lớn, payload linh hoạt</td><td><strong>MongoDB</strong> hoặc phân vùng PostgreSQL</td><td>JSON chỉ nối thêm, thường phải chia mảnh; phân vùng PostgreSQL với chỉ mục BRIN cũng đi xa được (Chương 15.4)</td><td>nền tảng log (Elasticsearch, ClickHouse)</td></tr>
<tr><td>Phân tích và dashboard</td><td>Bắt đầu bằng <strong>PostgreSQL</strong></td><td>hàm cửa sổ, materialized view (Chương 8, 12); chỉ chuyển sang kho dạng cột khi tới hàng tỷ dòng</td><td>ClickHouse, BigQuery (ngoài khoá này)</td></tr>
<tr><td>Dự án MERN cá nhân, để học</td><td><strong>MongoDB</strong> hoặc PostgreSQL</td><td>MongoDB khớp các bài hướng dẫn MERN; PostgreSQL (gói miễn phí của Supabase / Neon) dạy kỹ năng dùng khi đi làm</td><td>—</td></tr>
</table>

<h3>Cây quyết định cho buổi họp nhóm</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-si">1</div><div class="lz-st">WordPress, hay hosting chỉ có MySQL?</div><div class="lz-sd">Có → MySQL / MariaDB.</div></div>
  <div class="lz-step"><div class="lz-si">2</div><div class="lz-st">Công ty .NET đã có giấy phép SQL Server và DBA?</div><div class="lz-sd">Có → SQL Server.</div></div>
  <div class="lz-step"><div class="lz-si">3</div><div class="lz-st">Document JSON khép kín, ít báo cáo chéo, cần chia mảnh?</div><div class="lz-sd">Có → MongoDB.</div></div>
  <div class="lz-step"><div class="lz-si">4</div><div class="lz-st">Không câu nào đúng, hoặc chưa chắc</div><div class="lz-sd">PostgreSQL, kèm JSONB cho phần linh hoạt — miễn phí, quan hệ ở chỗ cần, thân thiện với document ở chỗ cần, mở rộng được.</div></div>
</div>

<h3>Ca thực tế 1 — cuongthai.com</h3>
<p>Đo trong repo (25/10/2026):</p>
<pre><code class="language-bash">$ grep -n 'provider' prisma/schema.prisma | head -2
8:  provider = "prisma-client-js"
12:  provider = "postgresql"
$ grep -c '^model ' prisma/schema.prisma
602
$ grep -c '^enum ' prisma/schema.prisma
57
$ grep -cE '^\\s+\\w+\\s+Json' prisma/schema.prisma
266
$ ls prisma/migrations | grep -c '^2'
235
$ grep -n 'image: ghcr.io/cuonghoang1103/api-backend-postgres' docker-compose.yml
21:    image: ghcr.io/cuonghoang1103/api-backend-postgres:16-3.4-pgvector</code></pre>
<p>Thêm 8 migration bổ sung tìm kiếm toàn văn (<code>tsvector</code>) và một cột <code>vector(384)</code> cho tìm kiếm tương đồng bằng AI. Vì sao PostgreSQL thắng ở đây: <strong>một engine</strong> chứa dữ liệu quan hệ, document (JSONB), tìm kiếm, vector (pgvector) và bản đồ (PostGIS) — một bản sao lưu, một bộ kỹ năng; giấy phép miễn phí trên một VPS nhỏ; provider PostgreSQL là bản đầy đủ nhất của Prisma; và migration chạy trong giao dịch, hỏng thì hoàn tác sạch (bài 17.2).</p>

<h3>Ca thực tế 2 — LabFlow AI (đồ án tốt nghiệp)</h3>
<pre><code class="language-bash">$ grep -n "image:" docker-compose.yml
4:    image: postgres:16-alpine
$ grep spring-boot-starter-parent -A1 backend/pom.xml | grep version
        &lt;version&gt;3.5.6&lt;/version&gt;
$ ls backend/src/main/resources/db/migration
V1__init.sql  V2__demo_catalog.sql  V3__auth_sessions.sql</code></pre>
<p>Một backend Java (Spring Boot 3.5) với migration Flyway đi tới cùng đáp án như trang web Node/Prisma: PostgreSQL 16, còn chỗ cho pgvector khi làm tính năng RAG. Cơ sở dữ liệu đi theo dữ liệu và đội ngũ, không theo framework. Nếu LabFlow bắt buộc phải gắn vào một trường đại học chạy mọi thứ trên SQL Server có DBA riêng, câu hỏi số 2 của cây sẽ thắng — và đó cũng là một lựa chọn hoàn toàn tốt.</p>

<h3>Những sai lầm khi chọn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">“MongoDB vì không lược đồ thì nhanh hơn”</span><span class="v">…rồi tự dựng lại join và ràng buộc trong code ứng dụng. Mô hình hoá dữ liệu trước (ERD, Chương 3); để hình dạng của nó gợi ý nơi lưu.</span></div>
  <div class="kv"><span class="k">Bắt chước công ty nổi tiếng</span><span class="v">Quy mô và đội ngũ của họ không phải của bạn. Hợp với quy mô hôm nay và tính sẵn đường chuyển đổi.</span></div>
  <div class="kv"><span class="k">Ba cơ sở dữ liệu cho hai người</span><span class="v">Cái nào cũng cần sao lưu, nâng cấp, giám sát. Giữ một cơ sở dữ liệu chính; chỉ thêm loại chuyên dụng khi có lý do đo được.</span></div>
  <div class="kv"><span class="k">Bỏ qua giấy phép</span><span class="v">Đọc giấy phép và trang giá ngay ngày đầu, đừng đợi hoá đơn production đầu tiên.</span></div>
</div>
<div class="callout ok">Chọn hệ nào thì phần việc của Chương 3 và 9–15 vẫn còn nguyên: thiết kế lược đồ, chỉ mục và kế hoạch truy vấn, giao dịch và đồng thời, những bản sao lưu bạn đã thực sự khôi phục thử. Engine đổi cú pháp và vài hành vi — không đổi kỷ luật.</div>

<h3>Bài tập</h3>
<ol>
<li>Một chuỗi quán cà phê muốn website có blog và thực đơn online, trên hosting PHP giá rẻ.</li>
<li>Hệ thống cho vay nội bộ của một ngân hàng viết bằng C#, đã có đội SQL Server.</li>
<li>Một sàn giao dịch khởi nghiệp bằng Next.js + Prisma có đơn hàng, đánh giá và thông số sản phẩm linh hoạt.</li>
<li>Một dự án IoT lưu hàng triệu số đo cảm biến mỗi ngày, mỗi số đo một payload JSON khác nhau.</li>
</ol>
<details><summary>Đáp án gợi ý</summary>
<p>1 · WordPress trên MySQL/MariaDB — hosting quyết định. 2 · SQL Server — đội ngũ, giấy phép và công cụ đã có sẵn. 3 · PostgreSQL — đơn hàng quan hệ, thông số JSONB có chỉ mục GIN, Prisma. 4 · MongoDB có chia mảnh, hoặc PostgreSQL có phân vùng — đo cả hai bằng payload thật; một cơ sở dữ liệu chuỗi thời gian cũng đáng xem xét.</p>
</details>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Kiểm tra Chương 17 — rồi bài thi cuối khoá</span><span class="lc-sub">Lab 1–9 là portfolio của bạn: cơ sở dữ liệu CT Shop bạn dựng là thật.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 17.5 quiz ─────────────────────────── */
    {
      title: '17.5 — Chapter 17 quiz|||17.5 — Kiểm tra Chương 17',
      slug: 'postgresql-17-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về bốn hệ cơ sở dữ liệu: mô hình bảng và document, giấy phép, DDL trong giao dịch, mức cô lập mặc định, upsert và số tự tăng, JSONB và GIN, MQL ↔ SQL, và cách chọn hệ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 17 · Quiz</span>
<h2>Ten questions on four databases</h2>
<p class="lead">Every question is answered by something you ran in this chapter: the same CT Shop data on SQL Server, MySQL, PostgreSQL and MongoDB. Each answer comes with an explanation.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 17 · Kiểm tra</span>
<h2>Mười câu về bốn hệ cơ sở dữ liệu</h2>
<p class="lead">Câu nào cũng trả lời được bằng thứ bạn đã chạy trong chương: cùng dữ liệu CT Shop trên SQL Server, MySQL, PostgreSQL và MongoDB. Mỗi đáp án đều có giải thích.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Inside BEGIN … ROLLBACK you INSERT a row, CREATE TABLE t_ddl and INSERT into it. Which servers end with neither the row nor the table?|||Trong BEGIN … ROLLBACK bạn INSERT một dòng, CREATE TABLE t_ddl rồi INSERT vào nó. Máy chủ nào kết thúc mà không còn dòng đó lẫn bảng đó?',
            options: [
              'All three SQL servers|||Cả ba máy chủ SQL',
              'PostgreSQL and SQL Server — MySQL commits implicitly at CREATE TABLE|||PostgreSQL và SQL Server — MySQL commit ngầm ở CREATE TABLE',
              'Only MySQL|||Chỉ MySQL',
              'None — DDL can never be rolled back|||Không máy nào — DDL không bao giờ hoàn tác được',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Real run: PostgreSQL and SQL Server undid everything (0 audit rows, no t_ddl). MySQL kept 1 audit row and a t_ddl with 1 row, because DDL causes an implicit commit.|||Chạy thật: PostgreSQL và SQL Server hoàn tác hết (0 dòng audit, không có t_ddl). MySQL còn 1 dòng audit và bảng t_ddl có 1 dòng, vì DDL gây commit ngầm.',
          },
          {
            question: 'Session A updates a row and keeps its transaction open. Session B reads that row with default settings. On which server does B wait?|||Phiên A cập nhật một dòng và giữ giao dịch mở. Phiên B đọc dòng đó với thiết lập mặc định. Ở máy chủ nào B phải chờ?',
            options: [
              'PostgreSQL|||PostgreSQL',
              'MySQL|||MySQL',
              'SQL Server (READ COMMITTED with locks, READ_COMMITTED_SNAPSHOT off)|||SQL Server (READ COMMITTED có khoá, READ_COMMITTED_SNAPSHOT tắt)',
              'All three|||Cả ba',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'With LOCK_TIMEOUT 3000, SQL Server returned Msg 1222 after 3 seconds. MySQL and PostgreSQL use MVCC and returned the old price 5000.00 immediately.|||Với LOCK_TIMEOUT 3000, SQL Server báo Msg 1222 sau 3 giây. MySQL và PostgreSQL dùng MVCC nên trả ngay giá cũ 5000.00.',
          },
          {
            question: 'Which SQL Server setting makes readers get the last committed version instead of waiting?|||Thiết lập nào của SQL Server cho người đọc lấy phiên bản đã commit gần nhất thay vì phải chờ?',
            options: [
              'SET NOCOUNT ON|||SET NOCOUNT ON',
              'READ_COMMITTED_SNAPSHOT ON|||READ_COMMITTED_SNAPSHOT ON',
              'IDENTITY_INSERT ON|||IDENTITY_INSERT ON',
              'LOCK_TIMEOUT 0|||LOCK_TIMEOUT 0',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'After ALTER DATABASE ctshop SET READ_COMMITTED_SNAPSHOT ON, the same session B read 5000.00 at once. It is on by default in Azure SQL Database.|||Sau ALTER DATABASE ctshop SET READ_COMMITTED_SNAPSHOT ON, cùng phiên B đọc được 5000.00 ngay. Azure SQL Database bật sẵn thiết lập này.',
          },
          {
            question: "Insert 'sql', upsert 'sql' twice, then insert 'json'. Which id does 'json' get on PostgreSQL?|||Chèn 'sql', upsert 'sql' hai lần, rồi chèn 'json'. Trên PostgreSQL 'json' nhận id mấy?",
            options: [
              '2|||2',
              '3|||3',
              '4 — each ON CONFLICT took a sequence value before finding the conflict|||4 — mỗi lần ON CONFLICT đã lấy một giá trị sequence trước khi phát hiện xung đột',
              'It fails with a duplicate key error|||Báo lỗi trùng khoá',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'PostgreSQL and MySQL both gave id 4 (2 and 3 were burnt); SQL Server MERGE gave id 2. Gaps in auto numbers are normal.|||PostgreSQL và MySQL đều cho id 4 (số 2 và 3 bị đốt); MERGE của SQL Server cho id 2. Số tự tăng có khoảng trống là bình thường.',
          },
          {
            question: "What does doc @> '{\"items\": [{\"sku\": \"CT0503\"}]}' test?|||doc @> '{\"items\": [{\"sku\": \"CT0503\"}]}' kiểm điều gì?",
            options: [
              'That doc equals that JSON exactly|||doc bằng đúng đoạn JSON đó',
              'That doc contains that JSON: its items array has an element with sku CT0503|||doc chứa đoạn JSON đó: mảng items có một phần tử với sku CT0503',
              'That doc has a key called items|||doc có khoá tên items',
              'That the sku is greater than CT0503|||sku lớn hơn CT0503',
            ],
            correctIndex: 1,
            points: 1,
            explanation: '@> is JSONB containment. It returned 119 orders — the same as MongoDB countDocuments({ "items.sku": "CT0503" }) and the relational JOIN.|||@> là phép “chứa” của JSONB. Nó trả 119 đơn — bằng countDocuments({ "items.sku": "CT0503" }) của MongoDB và bằng phép JOIN quan hệ.',
          },
          {
            question: 'Which index turned the Seq Scan on orders_doc into a Bitmap Index Scan for @>?|||Chỉ mục nào biến Seq Scan trên orders_doc thành Bitmap Index Scan cho @>?',
            options: [
              'A B-tree on id|||B-tree trên id',
              'A GIN index: USING gin (doc jsonb_path_ops)|||Chỉ mục GIN: USING gin (doc jsonb_path_ops)',
              'A hash index on doc|||Chỉ mục hash trên doc',
              'None — @> cannot use an index|||Không cái nào — @> không dùng được chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Before: Seq Scan, Rows Removed by Filter: 1881. After the GIN index: Bitmap Index Scan on orders_doc_gin returning the 119 rows.|||Trước: Seq Scan, Rows Removed by Filter: 1881. Sau khi có GIN: Bitmap Index Scan trên orders_doc_gin trả đúng 119 dòng.',
          },
          {
            question: 'Which MongoDB aggregation stage plays the role of jsonb_array_elements (or a JOIN to the child table)?|||Chặng aggregate nào của MongoDB đóng vai trò jsonb_array_elements (hay JOIN sang bảng con)?',
            options: ['$match|||$match', '$group|||$group', '$unwind|||$unwind', '$project|||$project'],
            correctIndex: 2,
            points: 1,
            explanation: '$unwind emits one record per array element — exactly what jsonb_array_elements does — so $group can then sum the items by category.|||$unwind sinh mỗi phần tử mảng thành một bản ghi — đúng việc jsonb_array_elements làm — để $group cộng các dòng hàng theo danh mục.',
          },
          {
            question: 'The JSONB copy of the 2,000 orders took 1216 kB versus 432 kB for orders + order_item. Why?|||Bản JSONB của 2.000 đơn chiếm 1216 kB so với 432 kB của orders + order_item. Vì sao?',
            options: [
              'JSONB is compressed badly|||JSONB nén kém',
              'Every document repeats key names and copies product names and categories that tables store once|||Mỗi document lặp tên khoá và chép tên sản phẩm, danh mục mà bảng chỉ lưu một lần',
              'The GIN index is included|||Đã tính cả chỉ mục GIN',
              'PostgreSQL stores JSON twice|||PostgreSQL lưu JSON hai lần',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'pg_table_size excludes indexes (the GIN index was a separate 248 kB). The difference is duplication — the same reason renaming one product rewrote 119 Mongo documents.|||pg_table_size không tính chỉ mục (GIN là 248 kB riêng). Khác biệt đến từ việc chép lặp — cũng là lý do đổi tên một sản phẩm phải ghi lại 119 document Mongo.',
          },
          {
            question: 'Which copy inside an order document is a feature, not a sync problem?|||Bản chép nào trong document đơn hàng là tính năng chứ không phải rắc rối đồng bộ?',
            options: [
              "The customer's current email|||Email hiện tại của khách",
              "The product's current stock|||Tồn kho hiện tại của sản phẩm",
              'The name and unit price at the moment of sale|||Tên và đơn giá tại thời điểm bán',
              "The category's parent id|||Mã danh mục cha",
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'An order line is a snapshot: it must keep the price of the day even if the product changes later. CT Shop tables do the same with order_item.unit_price.|||Dòng đơn là một ảnh chụp: phải giữ giá của ngày bán dù sản phẩm đổi về sau. Bảng CT Shop cũng làm vậy với order_item.unit_price.',
          },
          {
            question: 'A C# loan system at a bank that already has SQL Server licences and DBAs. Following the decision tree, which system?|||Hệ thống cho vay viết bằng C# ở một ngân hàng đã có giấy phép SQL Server và DBA. Theo cây quyết định, chọn hệ nào?',
            options: ['MongoDB|||MongoDB', 'MySQL|||MySQL', 'SQL Server|||SQL Server', 'Always PostgreSQL|||Luôn là PostgreSQL'],
            correctIndex: 2,
            points: 1,
            explanation: 'Question 2 of the tree: an existing .NET + SQL Server team, licences and tooling make SQL Server the sensible choice. PostgreSQL is the default only when nothing forces your hand.|||Câu hỏi số 2 của cây: đội .NET + SQL Server, giấy phép và công cụ có sẵn khiến SQL Server là lựa chọn hợp lý. PostgreSQL chỉ là mặc định khi không có gì buộc bạn chọn khác.',
          },
        ],
      },
    },
  ],
};
