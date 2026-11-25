/**
 * Bắt đầu tại đây (1/2) — MongoDB là gì, ra đời thế nào, ai đang chạy nó (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s00-nem-thu'] (MongoDB 8.0.38 trong container mgo-lab, dữ liệu CT Shop tất định).
 * Nguồn đã GET kiểm 24/11/2026: Wikipedia "MongoDB" + "MongoDB Inc." (10gen 2007, phát hành 11/02/2009, đổi tên 27/08/2013,
 * IPO 20/10/2017 NASDAQ MDB, SSPL từ 4.0.4 ngày 08/11/2018, transaction từ 4.0 06/2018, mua WiredTiger 2014, Atlas 2016);
 * SEC 10-K FY2026 của MongoDB Inc. (nộp 11/03/2026: >65.200 khách hàng, >100 quốc gia, doanh thu 2.463,8 triệu USD);
 * Stack Overflow Developer Survey 2025 (MongoDB 24%, PostgreSQL 55,6% — tất cả người trả lời);
 * Discord blog "How Discord Stores Billions of Messages" (01/2017: bản đầu 2015 trên một replica set MongoDB, 11/2015 100 triệu tin
 * nhắn thì dữ liệu + index không vừa RAM ⇒ chuyển Cassandra).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Start here (1/2) — What MongoDB is, where it came from, and who runs it|||Bắt đầu tại đây (1/2) — MongoDB là gì, ra đời thế nào, và ai đang chạy nó',
  slug: 'mgo-0-8-bat-dau-tai-day',
  type: 'LESSON',
  isFreePreview: true,
  description: 'MongoDB là gì bằng hình ảnh đời thường; lịch sử có nguồn từ 10gen 2007 tới MongoDB 8.0; vì sao cả ngành từng chạy theo "NoSQL"; MongoDB đứng đâu giữa PostgreSQL, Redis và JSONB; ai đang dùng (số liệu SEC 10-K và khảo sát Stack Overflow 2025, câu chuyện Discord); và ba câu lệnh đầu tiên chạy thật trên bộ dữ liệu CT Shop.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>What MongoDB is, where it came from, and who runs it</h2>
<p class="lead">Welcome. You have probably already met MongoDB — in a Node.js tutorial, in the SDN302 subject, in a job ad that says "MongoDB is a plus". Most people learn just enough to call <code>find()</code> and <code>save()</code>, and that is exactly the level where projects get into trouble: a document that grows forever, a query that is fast with 100 rows and dead with a million, a database left open to the internet. This course goes from zero to the level where you can design, tune and run MongoDB in a real project — and, just as important, say honestly when <em>not</em> to use it.</p>

<h3>An everyday picture: the order slip versus the ledger</h3>
<p>Think of a small shop. When you buy something, the cashier prints an <strong>order slip</strong>: your name, the address, every item with its price at that moment, the total. Everything about that one order is on one piece of paper — you can hand it to the delivery driver and they need nothing else.</p>
<p>The accountant works differently. She keeps a <strong>ledger</strong> split into books: one book of customers, one of products, one of orders, one of order lines, each line pointing to the others by number. Nothing is written twice; to see "the order" she must open four books and cross-reference.</p>
<p>A relational database (PostgreSQL, MySQL, SQL Server) is the ledger. <strong>MongoDB is the order slip</strong>: it stores each record as a self-contained <strong>document</strong> — a JSON-like object with nested objects and arrays — so the things your application reads together are stored together. Both approaches are correct; they make different things cheap. This whole course is about knowing which things.</p>

<h3>What MongoDB actually is</h3>
<ul>
<li>A <strong>document database</strong>: data lives in <em>documents</em> (like JSON objects), grouped into <em>collections</em> (like tables, but without a fixed column list), grouped into <em>databases</em>.</li>
<li>Documents are stored in <strong>BSON</strong> — "binary JSON" — which adds types JSON lacks: dates, 64-bit integers, exact decimals for money, binary data, ObjectId.</li>
<li>It is <strong>distributed by design</strong>: replication (a <em>replica set</em>) and horizontal partitioning (<em>sharding</em>) are built into the server, not bolted on.</li>
<li>Its shell, <code>mongosh</code>, is a JavaScript console, so queries look like code: <code>db.orders.find({ status: 'PAID' })</code>.</li>
<li>It is <strong>ACID</strong>: every single-document write is atomic, and multi-document transactions exist since version 4.0 (2018). The old line "MongoDB has no transactions" is ten years out of date — a classic interview trap.</li>
</ul>

<h3>Where it came from — a short history with sources</h3>
<table>
<thead><tr><th>When</th><th>What happened</th><th>Why it matters to you</th></tr></thead>
<tbody>
<tr><td>2007</td><td>The New York company <strong>10gen</strong> (founded by Dwight Merriman, Kevin P. Ryan and Eliot Horowitz, all from DoubleClick) starts building MongoDB as one part of a planned platform-as-a-service.</td><td>It was built by people who had run ad servers at huge scale — the design goal was "easy for developers, scales out".</td></tr>
<tr><td>11/02/2009</td><td>MongoDB is released as open source; 10gen pivots to selling support.</td><td>The "NoSQL" wave: Web 2.0 sites wanted flexible schemas and cheap horizontal scale.</td></tr>
<tr><td>27/08/2013</td><td>10gen renames itself <strong>MongoDB Inc.</strong></td><td>The product became the company.</td></tr>
<tr><td>2014–2015</td><td>MongoDB buys <strong>WiredTiger</strong>, which becomes the default storage engine (document-level concurrency, compression).</td><td>The engine you use today — Lesson 1.4 opens it up.</td></tr>
<tr><td>2016</td><td><strong>Atlas</strong>, the managed cloud service, launches.</td><td>Most companies now rent MongoDB instead of running it — Lesson 10.6 compares the costs.</td></tr>
<tr><td>20/10/2017</td><td>IPO on NASDAQ as <code>MDB</code>.</td><td>A public company files audited numbers — the source for "who uses it" below.</td></tr>
<tr><td>06/2018</td><td>Version 4.0 adds <strong>multi-document ACID transactions</strong> on replica sets (4.2 in 2019 extends them to sharded clusters).</td><td>Chapter 6 — when you need them and when one document is enough.</td></tr>
<tr><td>10/2018</td><td>The licence changes from AGPL to the <strong>SSPL</strong> (from 4.0.4): you may use it freely, but you may not sell "MongoDB as a service" without open-sourcing your whole stack.</td><td>Why AWS DocumentDB and Azure Cosmos DB are <em>compatible imitations</em>, not MongoDB.</td></tr>
<tr><td>10/2024</td><td>MongoDB <strong>8.0</strong> — the version this course runs (our lab image reports <code>v8.0.38</code>).</td><td>Every output in this course is real 8.0 output.</td></tr>
</tbody></table>

<h3>Why "NoSQL" happened, in one paragraph</h3>
<p>Around 2009 three pains met. (1) <strong>Object–relational mismatch</strong>: the app thinks in objects with nested lists, the database in flat tables, and an ORM translates back and forth. (2) <strong>Schema changes</strong>: adding a column to a huge MySQL table could lock it for hours. (3) <strong>Scale</strong>: one big server has a ceiling; splitting a relational database across many servers by hand is painful. Document databases answered all three: store the object as it is, let each document carry its own fields, and partition by a key. The price — weaker joins, no foreign keys, the risk of duplicated data drifting apart — is the subject of Chapter 3. Fifteen years later the lines have blurred: PostgreSQL has excellent JSON (JSONB), MongoDB has transactions and schema validation. The choice is now about <em>fit</em>, not fashion — that is Lesson 0.1.</p>

<h3>MongoDB among its neighbours</h3>
<table>
<thead><tr><th></th><th>Data shape</th><th>Strongest at</th><th>Weakest at</th></tr></thead>
<tbody>
<tr><td><strong>PostgreSQL</strong></td><td>Tables + JSONB</td><td>Many related entities, constraints, ad-hoc reports and joins</td><td>Horizontal write scaling needs extensions/extra tools</td></tr>
<tr><td><strong>MongoDB</strong></td><td>Documents (nested objects, arrays)</td><td>Aggregates read as a whole, varied shapes, built-in replication and sharding</td><td>Data shared across many documents, integrity enforced by the database</td></tr>
<tr><td><strong>Redis</strong></td><td>Keys → data structures, in RAM</td><td>Microsecond cache, counters, queues, rate limits</td><td>Data larger than RAM, being the source of truth</td></tr>
<tr><td><strong>Cassandra / DynamoDB</strong></td><td>Wide rows by partition key</td><td>Massive write volume with predictable access</td><td>Flexible queries — you design one table per query</td></tr>
</tbody></table>
<p>In a real system they live together: PostgreSQL for money and accounts, MongoDB for a product catalogue or event log, Redis in front of both. You will see this mix in the final project.</p>

<h3>Who runs it — with sources, not slogans</h3>
<ul>
<li><strong>MongoDB Inc.'s annual report to the US SEC</strong> (10-K, filed 11/03/2026): as of 31/01/2026, over <strong>65,200 paying customers</strong> in more than 100 countries, revenue of <strong>US$2,463.8 million</strong> for the fiscal year. That counts only <em>paying</em> customers — free self-hosted installations are many more.</li>
<li><strong>Stack Overflow Developer Survey 2025</strong>: 24% of all respondents used MongoDB in the past year (6th place); PostgreSQL was first with 55.6%. Honest reading: MongoDB is widely used, but SQL is still the default. Learn both.</li>
<li><strong>Discord</strong> (engineering blog, January 2017): the first version of Discord, built in under two months in early 2015, stored everything in a single MongoDB replica set — chosen because it is "one of the best databases for iterating quickly". By November 2015, with 100 million messages, the data and index no longer fitted in RAM and latency became unpredictable, so they moved messages to Cassandra. Two lessons in one story: MongoDB let a tiny team ship fast, <em>and</em> they planned for its limits from day one. Chapters 3, 4 and 10 explain exactly what "no longer fits in RAM" means.</li>
</ul>

<h3>The course at a glance</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">foundations</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch1 · Documents and BSON</span><span class="lz-nsub">types, validation, the engine</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch2 · CRUD</span><span class="lz-nsub">every query operator you will use</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch3 · Schema design</span><span class="lz-nsub">embed or reference, patterns</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">fast</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch4 · Indexes and explain</span><span class="lz-nsub">ESR, measured before/after</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch5 · Aggregation</span><span class="lz-nsub">reports inside the database</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">correct and durable</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch6 · Transactions</span><span class="lz-nsub">write and read concern</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch7 · Replica sets and sharding</span><span class="lz-nsub">real clusters in Compose</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">in real projects</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch8 · Node.js and Spring</span><span class="lz-nsub">driver, Mongoose, Spring Data</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch9 · Security</span><span class="lz-nsub">2017 ransom wave, injection</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch10 · Operations</span><span class="lz-nsub">backup, monitoring, load tests</span></div></div>
  </div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "schemaless means no design".</strong> The schema still exists: it moved from the database into your code and your queries. Teams that skip design end up with three spellings of the same field and reports nobody trusts. Chapter 3 is the longest chapter for a reason.</p>
</div>
<h3>Taste it: three business questions, three commands</h3>
<p>Here is a preview from the lab you will build in Lesson 0.2 (the CT Shop dataset: 200 customers, 60 products, 2,000 orders). Do not worry about the syntax yet — just notice that each answer is one command.</p>
<p><strong>1. Show me order 7, with everything in it.</strong> One document, no joins: the items and their prices at purchase time live inside the order.</p>
${lenh('s00-nem-thu', 0)}
<p><strong>2. Which laptops have at least 32 GB of RAM?</strong> Laptops have <code>specs</code>, books have <code>author</code> and <code>pages</code> — different shapes in one collection, and we query a nested field directly.</p>
${lenh('s00-nem-thu', 1)}
<p><strong>3. Top three cities by revenue (paid or shipped orders).</strong> An aggregation pipeline — Chapter 5 is all about these.</p>
${lenh('s00-nem-thu', 2)}
<div class="callout warn"><p><strong>Notice <code>Decimal128('6202231600')</code>.</strong> Money is stored as an exact decimal, not as a JavaScript number. If you store prices as ordinary numbers (doubles), sums like 0.1 + 0.2 come out as 0.30000000000000004 — Lesson 1.2 shows the bug for real.</p></div>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Is MongoDB ACID?"</strong> — Single-document operations always were; multi-document transactions since 4.0 (replica sets) and 4.2 (sharded clusters). Then add: "but a well-designed schema needs them rarely, because related data sits in one document."</li>
<li><strong>"Why would you choose MongoDB over PostgreSQL?"</strong> — Never "because it is faster" or "because it has no schema". Answer with the <em>data shape and access pattern</em>: aggregates read whole, varied attributes, built-in sharding. Lesson 0.1 gives you a defensible answer.</li>
<li><strong>"What is BSON?"</strong> — Binary JSON with extra types (Date, Decimal128, ObjectId, int64, binary) and length prefixes so the server can skip fields fast.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>Take an app you use daily (Shopee, Facebook, a banking app). Pick one screen and write what <em>one document</em> for that screen would contain, as a JSON sketch.</li>
<li>For the same screen, list the SQL tables you would need. Count how many joins one page load needs.</li>
<li>Write one sentence: which data on that screen is <em>shared</em> by many other screens (and would be painful to copy into every document)?</li>
</ol>
<p><strong>Done when:</strong> you have one JSON sketch, one table list, and one sentence about shared data — you have just done your first schema design trade-off.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Document', 'A self-contained record, like a JSON object, with nested objects and arrays.'],
  ['Collection', 'A group of documents — like a table, but without a fixed list of columns.'],
  ['BSON', 'Binary JSON: the storage and wire format, with types JSON lacks (Date, Decimal128, ObjectId…).'],
  ['mongosh', 'The MongoDB shell — a JavaScript console connected to the server.'],
  ['Replica set', 'A group of servers holding copies of the same data, with automatic failover.'],
  ['Sharding', 'Splitting one collection across several servers by a shard key.'],
  ['SSPL', 'MongoDB’s licence since 10/2018: free to use, restricted for selling it as a service.'],
  ['NoSQL', 'An umbrella name (from ~2009) for non-relational databases: document, key-value, wide-column, graph.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>MongoDB stores self-contained documents: what the app reads together is stored together — the order slip, not the ledger.</li>
<li>History: 10gen 2007 → open source 2009 → MongoDB Inc. 2013 → WiredTiger → Atlas 2016 → transactions 2018 → SSPL 2018 → 8.0 in 2024.</li>
<li>It is ACID, has transactions and schema validation; the real trade-off is joins, foreign keys and shared data.</li>
<li>Widely used (65,200+ paying customers, 24% of developers) but SQL remains the default — learn when each fits.</li>
<li>Discord shows both sides: fast to ship with MongoDB, and planned for the day data outgrew RAM.</li>
</ul>
<h3>🔗 Sources and related lessons</h3>
${nguon('📄', 'MongoDB Inc. — Form 10-K, fiscal year 2026 (SEC)', 'Customers, countries, revenue as of 31/01/2026', 'https://www.sec.gov/Archives/edgar/data/1441816/000162828026016799/mdb-20260131.htm')}
${nguon('📊', 'Stack Overflow Developer Survey 2025 — Databases', 'MongoDB 24%, PostgreSQL 55.6%', 'https://survey.stackoverflow.co/2025/technology')}
${nguon('💬', 'Discord — How Discord Stores Billions of Messages (2017)', 'From one MongoDB replica set to Cassandra', 'https://discord.com/blog/how-discord-stores-billions-of-messages')}
${nguon('📚', 'Wikipedia — MongoDB', 'History, licence, Jepsen reports', 'https://en.wikipedia.org/wiki/MongoDB')}
${lienKet({ cta: 'Open lesson', khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'Academy SDN302 — 3.1 MongoDB CRUD & query traps', sub: 'If you studied SDN302: this course starts from zero again but goes much deeper', academy: true })}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>MongoDB là gì, ra đời thế nào, và ai đang chạy nó</h2>
<p class="lead">Chào bạn. Có lẽ bạn đã gặp MongoDB rồi — trong một bài hướng dẫn Node.js, trong môn SDN302, trong tin tuyển dụng ghi "biết MongoDB là lợi thế". Phần lớn mọi người chỉ học vừa đủ để gọi <code>find()</code> và <code>save()</code>, và đó đúng là mức mà dự án bắt đầu gặp chuyện: một tài liệu phình mãi không dừng, một truy vấn chạy nhanh với 100 dòng nhưng chết đứng với một triệu, một cơ sở dữ liệu bị bỏ ngỏ ra Internet. Khoá này đi từ số 0 tới mức bạn tự thiết kế, tối ưu và vận hành được MongoDB trong dự án thật — và quan trọng không kém, nói được một cách trung thực khi nào <em>không</em> nên dùng nó.</p>

<h3>Hình ảnh đời thường: tờ phiếu đơn hàng và cuốn sổ cái</h3>
<p>Hãy nghĩ tới một cửa hàng nhỏ. Khi bạn mua đồ, thu ngân in ra một <strong>tờ phiếu đơn hàng</strong>: tên bạn, địa chỉ, từng món kèm giá ở đúng lúc đó, tổng tiền. Mọi thứ về đơn hàng ấy nằm trên một tờ giấy — đưa cho anh giao hàng là đủ, anh ấy không cần thêm gì nữa.</p>
<p>Chị kế toán thì làm khác. Chị giữ một <strong>bộ sổ cái</strong> tách thành nhiều cuốn: một cuốn khách hàng, một cuốn sản phẩm, một cuốn đơn hàng, một cuốn dòng đơn hàng, mỗi dòng trỏ sang cuốn khác bằng mã số. Không có gì bị ghi hai lần; muốn xem "một đơn hàng" chị phải mở bốn cuốn và dò chéo.</p>
<p>Cơ sở dữ liệu quan hệ (PostgreSQL, MySQL, SQL Server) là bộ sổ cái. <strong>MongoDB là tờ phiếu</strong>: nó lưu mỗi bản ghi thành một <strong>tài liệu</strong> (document) tự đủ — một đối tượng giống JSON, có đối tượng lồng và mảng bên trong — để những thứ ứng dụng hay đọc cùng nhau thì được cất cùng nhau. Cả hai cách đều đúng; mỗi cách làm cho những việc khác nhau trở nên rẻ. Cả khoá học này là để bạn biết việc nào rẻ ở đâu.</p>

<h3>MongoDB thật ra là gì</h3>
<ul>
<li>Một <strong>cơ sở dữ liệu tài liệu</strong>: dữ liệu nằm trong các <em>tài liệu</em> (giống đối tượng JSON), gom thành <em>collection</em> (giống bảng nhưng không có danh sách cột cố định), gom tiếp thành <em>database</em>.</li>
<li>Tài liệu được lưu bằng <strong>BSON</strong> — "JSON dạng nhị phân" — thêm các kiểu mà JSON không có: ngày giờ, số nguyên 64 bit, số thập phân chính xác cho tiền, dữ liệu nhị phân, ObjectId.</li>
<li>Nó <strong>phân tán ngay từ thiết kế</strong>: nhân bản (<em>replica set</em>) và chia dữ liệu theo chiều ngang (<em>sharding</em>) có sẵn trong máy chủ, không phải gắn thêm.</li>
<li>Vỏ lệnh <code>mongosh</code> là một console JavaScript, nên truy vấn trông như mã: <code>db.orders.find({ status: 'PAID' })</code>.</li>
<li>Nó có <strong>ACID</strong>: mọi thao tác ghi trên một tài liệu đều nguyên tử, và transaction nhiều tài liệu có từ bản 4.0 (2018). Câu "MongoDB không có transaction" đã lỗi thời mười năm — một cái bẫy kinh điển khi phỏng vấn.</li>
</ul>

<h3>Nó từ đâu ra — lịch sử ngắn, có nguồn</h3>
<table>
<thead><tr><th>Khi nào</th><th>Chuyện gì xảy ra</th><th>Vì sao bạn cần biết</th></tr></thead>
<tbody>
<tr><td>2007</td><td>Công ty <strong>10gen</strong> ở New York (do Dwight Merriman, Kevin P. Ryan và Eliot Horowitz lập, cả ba từ DoubleClick) bắt đầu viết MongoDB làm một phần của một nền tảng dịch vụ đám mây dự định.</td><td>Nó do những người từng chạy máy chủ quảng cáo cực lớn viết ra — mục tiêu thiết kế là "dễ cho lập trình viên, mở rộng ngang được".</td></tr>
<tr><td>11/02/2009</td><td>MongoDB phát hành mã nguồn mở; 10gen chuyển sang bán dịch vụ hỗ trợ.</td><td>Làn sóng "NoSQL": các trang Web 2.0 muốn schema linh hoạt và mở rộng ngang cho rẻ.</td></tr>
<tr><td>27/08/2013</td><td>10gen đổi tên thành <strong>MongoDB Inc.</strong></td><td>Sản phẩm trở thành tên công ty.</td></tr>
<tr><td>2014–2015</td><td>MongoDB mua <strong>WiredTiger</strong>, rồi nó thành bộ máy lưu trữ mặc định (đồng thời mức tài liệu, có nén).</td><td>Chính là bộ máy bạn dùng hôm nay — Bài 1.4 mở nó ra xem.</td></tr>
<tr><td>2016</td><td>Ra mắt <strong>Atlas</strong>, dịch vụ đám mây do hãng vận hành.</td><td>Phần lớn công ty giờ thuê MongoDB thay vì tự chạy — Bài 10.6 so chi phí.</td></tr>
<tr><td>20/10/2017</td><td>Lên sàn NASDAQ với mã <code>MDB</code>.</td><td>Công ty niêm yết phải công bố số liệu có kiểm toán — nguồn cho mục "ai đang dùng" bên dưới.</td></tr>
<tr><td>06/2018</td><td>Bản 4.0 thêm <strong>transaction ACID nhiều tài liệu</strong> trên replica set (bản 4.2 năm 2019 mở rộng sang cụm shard).</td><td>Chương 6 — khi nào cần, khi nào một tài liệu là đủ.</td></tr>
<tr><td>10/2018</td><td>Giấy phép đổi từ AGPL sang <strong>SSPL</strong> (từ bản 4.0.4): bạn dùng thoải mái, nhưng không được bán "MongoDB dạng dịch vụ" mà không mở mã toàn bộ hệ thống của mình.</td><td>Vì sao AWS DocumentDB và Azure Cosmos DB chỉ là <em>bản tương thích</em>, không phải MongoDB.</td></tr>
<tr><td>10/2024</td><td>MongoDB <strong>8.0</strong> — phiên bản khoá này dùng (ảnh lab của chúng ta báo <code>v8.0.38</code>).</td><td>Mọi output trong khoá là output 8.0 chạy thật.</td></tr>
</tbody></table>

<h3>Vì sao có "NoSQL", gói trong một đoạn</h3>
<p>Khoảng năm 2009 có ba nỗi đau gặp nhau. (1) <strong>Lệch pha đối tượng – bảng</strong>: ứng dụng nghĩ bằng đối tượng có danh sách lồng bên trong, còn cơ sở dữ liệu nghĩ bằng bảng phẳng, và một ORM phải dịch qua dịch lại. (2) <strong>Đổi schema</strong>: thêm một cột vào bảng MySQL khổng lồ có thể khoá bảng hàng giờ. (3) <strong>Quy mô</strong>: một máy chủ to cũng có trần; tự chia một cơ sở dữ liệu quan hệ ra nhiều máy bằng tay thì rất cực. Cơ sở dữ liệu tài liệu trả lời cả ba: cất nguyên đối tượng, cho mỗi tài liệu tự mang trường của nó, và chia dữ liệu theo một khoá. Cái giá — nối bảng yếu hơn, không có khoá ngoại, nguy cơ dữ liệu bị chép nhiều nơi rồi lệch nhau — là chủ đề của Chương 3. Mười lăm năm sau ranh giới đã mờ: PostgreSQL có JSON rất tốt (JSONB), MongoDB có transaction và kiểm hợp lệ schema. Chọn bây giờ là chuyện <em>hợp</em>, không phải chuyện mốt — đó là Bài 0.1.</p>

<h3>MongoDB đứng đâu giữa các "hàng xóm"</h3>
<table>
<thead><tr><th></th><th>Hình dạng dữ liệu</th><th>Mạnh nhất ở</th><th>Yếu nhất ở</th></tr></thead>
<tbody>
<tr><td><strong>PostgreSQL</strong></td><td>Bảng + JSONB</td><td>Nhiều thực thể liên quan nhau, ràng buộc, báo cáo tuỳ ý và JOIN</td><td>Mở rộng ghi theo chiều ngang cần tiện ích/công cụ ngoài</td></tr>
<tr><td><strong>MongoDB</strong></td><td>Tài liệu (đối tượng lồng, mảng)</td><td>Khối dữ liệu đọc trọn một lần, dữ liệu nhiều hình dạng, nhân bản và sharding có sẵn</td><td>Dữ liệu dùng chung bởi rất nhiều tài liệu, toàn vẹn do cơ sở dữ liệu tự đảm bảo</td></tr>
<tr><td><strong>Redis</strong></td><td>Khoá → cấu trúc dữ liệu, trong RAM</td><td>Cache micro giây, bộ đếm, hàng đợi, giới hạn tần suất</td><td>Dữ liệu lớn hơn RAM, làm nguồn sự thật</td></tr>
<tr><td><strong>Cassandra / DynamoDB</strong></td><td>Hàng rộng theo khoá phân vùng</td><td>Lượng ghi khổng lồ với kiểu truy cập biết trước</td><td>Truy vấn linh hoạt — mỗi truy vấn phải thiết kế một bảng</td></tr>
</tbody></table>
<p>Trong hệ thống thật chúng sống chung: PostgreSQL cho tiền và tài khoản, MongoDB cho danh mục sản phẩm hay nhật ký sự kiện, Redis đứng trước cả hai. Bạn sẽ thấy đúng cách phối này trong dự án cuối khoá.</p>

<h3>Ai đang chạy nó — có nguồn, không khẩu hiệu</h3>
<ul>
<li><strong>Báo cáo năm của MongoDB Inc. nộp cho Uỷ ban Chứng khoán Mỹ</strong> (10-K, nộp 11/03/2026): tính tới 31/01/2026 có hơn <strong>65.200 khách hàng trả tiền</strong> ở hơn 100 quốc gia, doanh thu năm tài chính <strong>2.463,8 triệu USD</strong>. Đó mới là khách <em>trả tiền</em> — số máy tự cài miễn phí còn nhiều hơn rất nhiều.</li>
<li><strong>Khảo sát lập trình viên Stack Overflow 2025</strong>: 24% người trả lời có dùng MongoDB trong năm qua (hạng 6); PostgreSQL đứng đầu với 55,6%. Đọc cho trung thực: MongoDB được dùng rộng, nhưng SQL vẫn là mặc định. Hãy học cả hai.</li>
<li><strong>Discord</strong> (blog kỹ thuật, 01/2017): bản đầu tiên của Discord, viết trong chưa đầy hai tháng đầu năm 2015, cất mọi thứ trong một replica set MongoDB — chọn vì đó là "một trong những cơ sở dữ liệu tốt nhất để làm nhanh, sửa nhanh". Tới 11/2015, với 100 triệu tin nhắn, dữ liệu và index không còn vừa RAM, độ trễ trở nên thất thường, nên họ chuyển phần tin nhắn sang Cassandra. Một câu chuyện, hai bài học: MongoDB giúp một nhóm nhỏ ra sản phẩm rất nhanh, <em>và</em> họ đã tính trước giới hạn của nó ngay từ ngày đầu. Chương 3, 4 và 10 giải thích chính xác "không còn vừa RAM" nghĩa là gì.</li>
</ul>

<h3>Toàn cảnh khoá học</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">nền móng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch1 · Tài liệu và BSON</span><span class="lz-nsub">kiểu dữ liệu, kiểm hợp lệ, bộ máy lưu trữ</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch2 · CRUD</span><span class="lz-nsub">mọi toán tử truy vấn bạn sẽ dùng</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch3 · Thiết kế schema</span><span class="lz-nsub">nhúng hay tham chiếu, các pattern</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">nhanh</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch4 · Index và explain</span><span class="lz-nsub">luật ESR, đo trước/sau</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch5 · Aggregation</span><span class="lz-nsub">báo cáo ngay trong cơ sở dữ liệu</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">đúng và bền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch6 · Transaction</span><span class="lz-nsub">write concern và read concern</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch7 · Replica set và sharding</span><span class="lz-nsub">cụm thật dựng bằng Compose</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">trong dự án thật</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch8 · Node.js và Spring</span><span class="lz-nsub">driver, Mongoose, Spring Data</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch9 · Bảo mật</span><span class="lz-nsub">tống tiền 2017, injection</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ch10 · Vận hành</span><span class="lz-nsub">sao lưu, giám sát, đo tải</span></div></div>
  </div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "schemaless nghĩa là khỏi thiết kế".</strong> Schema vẫn tồn tại: nó chỉ chuyển từ cơ sở dữ liệu sang mã và truy vấn của bạn. Đội nào bỏ qua thiết kế sẽ có ba cách viết cho cùng một trường và những báo cáo không ai tin. Chương 3 dài nhất khoá là có lý do.</p>
</div>
<h3>Nếm thử: ba câu hỏi kinh doanh, ba câu lệnh</h3>
<p>Đây là xem trước từ lab bạn sẽ dựng ở Bài 0.2 (bộ dữ liệu CT Shop: 200 khách, 60 sản phẩm, 2.000 đơn hàng). Đừng lo cú pháp — chỉ cần để ý mỗi câu trả lời là một câu lệnh.</p>
<p><strong>1. Cho tôi xem đơn số 7, đủ mọi thứ bên trong.</strong> Một tài liệu, không JOIN: các món hàng cùng giá lúc mua nằm ngay trong đơn.</p>
${lenh('s00-nem-thu', 0)}
<p><strong>2. Laptop nào có từ 32 GB RAM trở lên?</strong> Laptop có <code>specs</code>, sách có <code>author</code> và <code>pages</code> — các hình dạng khác nhau trong cùng một collection, và ta truy vấn thẳng vào trường lồng bên trong.</p>
${lenh('s00-nem-thu', 1)}
<p><strong>3. Ba thành phố có doanh thu cao nhất (đơn đã trả hoặc đã giao).</strong> Một aggregation pipeline — cả Chương 5 dành cho loại này.</p>
${lenh('s00-nem-thu', 2)}
<div class="callout warn"><p><strong>Để ý <code>Decimal128('6202231600')</code>.</strong> Tiền được lưu bằng số thập phân chính xác, không phải số kiểu JavaScript. Nếu bạn lưu giá bằng số thường (double), phép cộng như 0.1 + 0.2 ra 0.30000000000000004 — Bài 1.2 cho bạn thấy lỗi này chạy thật.</p></div>

<h3>🎤 Người phỏng vấn sẽ hỏi</h3>
<ul>
<li><strong>"MongoDB có ACID không?"</strong> — Thao tác trên một tài liệu thì luôn có; transaction nhiều tài liệu có từ 4.0 (replica set) và 4.2 (cụm shard). Rồi nói thêm: "nhưng schema thiết kế tốt hiếm khi cần, vì dữ liệu liên quan đã nằm chung một tài liệu".</li>
<li><strong>"Vì sao bạn chọn MongoDB thay vì PostgreSQL?"</strong> — Đừng bao giờ trả lời "vì nó nhanh hơn" hay "vì nó không cần schema". Hãy trả lời bằng <em>hình dạng dữ liệu và cách truy cập</em>: khối dữ liệu đọc trọn, thuộc tính đa dạng, sharding có sẵn. Bài 0.1 cho bạn một câu trả lời bảo vệ được.</li>
<li><strong>"BSON là gì?"</strong> — JSON dạng nhị phân có thêm kiểu (Date, Decimal128, ObjectId, int64, binary) và tiền tố độ dài để máy chủ nhảy qua các trường thật nhanh.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy một ứng dụng bạn dùng hằng ngày (Shopee, Facebook, ứng dụng ngân hàng). Chọn một màn hình và phác bằng JSON xem <em>một tài liệu</em> cho màn hình đó chứa những gì.</li>
<li>Với cùng màn hình đó, liệt kê các bảng SQL bạn cần. Đếm xem một lần tải trang cần bao nhiêu JOIN.</li>
<li>Viết một câu: dữ liệu nào trên màn hình đó được <em>dùng chung</em> bởi rất nhiều màn hình khác (và sẽ rất khổ nếu phải chép vào từng tài liệu)?</li>
</ol>
<p><strong>Xong khi:</strong> bạn có một bản phác JSON, một danh sách bảng và một câu về dữ liệu dùng chung — bạn vừa làm phép cân nhắc thiết kế schema đầu tiên của mình.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Document (tài liệu)', 'Một bản ghi tự đủ, giống đối tượng JSON, có đối tượng lồng và mảng bên trong.'],
  ['Collection', 'Một nhóm tài liệu — giống bảng nhưng không có danh sách cột cố định.'],
  ['BSON', 'JSON nhị phân: định dạng lưu trữ và truyền qua mạng, có thêm kiểu mà JSON không có (Date, Decimal128, ObjectId…).'],
  ['mongosh', 'Vỏ lệnh của MongoDB — một console JavaScript nối vào máy chủ.'],
  ['Replica set', 'Nhóm máy chủ giữ bản sao của cùng dữ liệu, tự chuyển dự phòng khi một máy chết.'],
  ['Sharding', 'Chia một collection ra nhiều máy chủ theo một shard key.'],
  ['SSPL', 'Giấy phép của MongoDB từ 10/2018: dùng tự do, hạn chế việc bán nó dạng dịch vụ.'],
  ['NoSQL', 'Tên gọi chung (từ khoảng 2009) cho các cơ sở dữ liệu không quan hệ: tài liệu, khoá–giá trị, cột rộng, đồ thị.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>MongoDB lưu các tài liệu tự đủ: thứ ứng dụng đọc cùng nhau thì cất cùng nhau — tờ phiếu đơn hàng, không phải bộ sổ cái.</li>
<li>Lịch sử: 10gen 2007 → mã nguồn mở 2009 → MongoDB Inc. 2013 → WiredTiger → Atlas 2016 → transaction 2018 → SSPL 2018 → bản 8.0 năm 2024.</li>
<li>Nó có ACID, có transaction và kiểm hợp lệ schema; cái giá thật nằm ở JOIN, khoá ngoại và dữ liệu dùng chung.</li>
<li>Được dùng rộng (hơn 65.200 khách trả tiền, 24% lập trình viên) nhưng SQL vẫn là mặc định — học để biết mỗi bên hợp chỗ nào.</li>
<li>Discord cho thấy cả hai mặt: ra sản phẩm nhanh nhờ MongoDB, và đã tính trước ngày dữ liệu vượt RAM.</li>
</ul>
<h3>🔗 Nguồn và bài liên quan</h3>
${nguon('📄', 'MongoDB Inc. — Báo cáo 10-K năm tài chính 2026 (SEC)', 'Khách hàng, quốc gia, doanh thu tính tới 31/01/2026', 'https://www.sec.gov/Archives/edgar/data/1441816/000162828026016799/mdb-20260131.htm')}
${nguon('📊', 'Khảo sát lập trình viên Stack Overflow 2025 — Cơ sở dữ liệu', 'MongoDB 24%, PostgreSQL 55,6%', 'https://survey.stackoverflow.co/2025/technology')}
${nguon('💬', 'Discord — How Discord Stores Billions of Messages (2017)', 'Từ một replica set MongoDB sang Cassandra', 'https://discord.com/blog/how-discord-stores-billions-of-messages')}
${nguon('📚', 'Wikipedia — MongoDB', 'Lịch sử, giấy phép, báo cáo Jepsen', 'https://en.wikipedia.org/wiki/MongoDB')}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-3-1-mongodb-crud', title: 'Academy SDN302 — 3.1 CRUD MongoDB & bẫy truy vấn', sub: 'Nếu bạn đã học SDN302: khoá này đi lại từ số 0 nhưng sâu hơn nhiều', academy: true })}
</div>
`,
};
