/**
 * PostgreSQL — Chương 13: JSONB & full-text search (Giai đoạn 4 — Trên production).
 * json vs jsonb (đo thật: jsonb chuẩn hoá {"b":1,"a":2,"a":3} → {"a": 3, "b": 1}) ·
 * -> vs ->> vs #>> · @> containment · GIN mặc định vs jsonb_path_ops (2904 kB vs 2008 kB) ·
 * GIN trên 200k dòng: 56,8 ms → 1,2 ms (45×) · tsvector/tsquery, gốc từ, trọng số A/B,
 * ts_rank, cột GENERATED · FTS index 39,5 ms → 0,080 ms · pg_trgm cho lỗi chính tả.
 * Output CHẠY THẬT trên PostgreSQL 16.13.
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 * Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 13 — JSONB & full-text search|||Chương 13 — JSONB & full-text search',
  description: 'Hai tính năng khiến người ta chọn PostgreSQL thay vì thứ khác: một kiểu tài liệu thật sự có chỉ mục, và một cỗ máy tìm kiếm ngay trong cơ sở dữ liệu. JSONB và các toán tử của nó, chỉ mục GIN, tsvector/tsquery cùng gốc từ và trọng số, và tìm gần đúng bằng trigram.',
  lessons: [
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — JSONB: a document type that indexes|||13.1 — JSONB: kiểu tài liệu CÓ chỉ mục',
      slug: 'postgresql-13-1-jsonb',
      type: 'LESSON',
      isFreePreview: true,
      description: 'json và jsonb khác nhau ở đâu (thấy được bằng mắt), ba toán tử truy cập -> ->> #>>, và câu hỏi quan trọng nhất của cả chương: khi nào một trường nên là JSONB và khi nào nó phải là một cột thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1 · Phase 4 — In production</span>
<h2>Schema-less data, without leaving the database</h2>
<p class="lead">Chapter 2 introduced <code>jsonb</code> in the list of types. Now it earns a chapter of its own, because it is the feature that lets one database hold both rigidly structured data and genuinely variable data — and because it is also the feature most often misused.</p>
<p>Examples use a small <code>product</code> table where <code>props</code> is deliberately irregular — not every product has the same specs:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> product (
  id    int <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
  name  text <span class="tok-keyword">NOT NULL</span>,
  props jsonb <span class="tok-keyword">NOT NULL</span>
);
<span class="tok-keyword">INSERT INTO</span> product (name, props) <span class="tok-keyword">VALUES</span>
 (<span class="tok-string">'Laptop Pro 14'</span>, <span class="tok-string">'{"brand":"Acme","price":1299,"tags":["laptop","pro"],"specs":{"ram":16,"cpu":"M3"}}'</span>),
 (<span class="tok-string">'Phone X'</span>,       <span class="tok-string">'{"brand":"Zeta","price":799,"tags":["phone"],"specs":{"ram":8,"storage":256}}'</span>),
 (<span class="tok-string">'Keyboard K1'</span>,   <span class="tok-string">'{"brand":"Acme","price":89,"tags":["accessory"]}'</span>);</code></pre>

<h3>json vs jsonb — always pick jsonb</h3>
<p>PostgreSQL has two JSON types, and the difference is visible in one query:</p>
<pre><code><span class="tok-keyword">SELECT</span> <span class="tok-string">'{"b":1,"a":2,"a":3}'</span>::json;
<span class="tok-keyword">SELECT</span> <span class="tok-string">'{"b":1,"a":2,"a":3}'</span>::jsonb;</code></pre>
<div class="out">      kieu_json
---------------------
 {"b":1,"a":2,"a":3}

    kieu_jsonb
------------------
 {"a": 3, "b": 1}</div>
<p><code>json</code> stores the <strong>exact text you gave it</strong>, duplicate keys, whitespace, key order and all — it re-parses on every access. <code>jsonb</code> stores a decomposed binary form: keys sorted, whitespace dropped, duplicates resolved (last one wins). That normalisation is what makes <code>jsonb</code> fast to query and, crucially, <strong>indexable</strong>. Use <code>json</code> only when you must reproduce a document byte-for-byte, which is rare.</p>

<h3>Three ways to reach inside</h3>
<pre><code><span class="tok-keyword">SELECT</span> name,
       props-&gt;<span class="tok-string">'brand'</span>            <span class="tok-keyword">AS</span> mui_ten,
       props-&gt;&gt;<span class="tok-string">'brand'</span>           <span class="tok-keyword">AS</span> mui_ten_kep,
       jsonb_typeof(props-&gt;<span class="tok-string">'brand'</span>) <span class="tok-keyword">AS</span> kieu
<span class="tok-keyword">FROM</span> product <span class="tok-keyword">ORDER BY</span> id <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out">     name      | mui_ten | mui_ten_kep |  kieu
---------------+---------+-------------+--------
 Laptop Pro 14 | "Acme"  | Acme        | string
 Laptop Air 13 | "Acme"  | Acme        | string
 Phone X       | "Zeta"  | Zeta        | string
(3 rows)</div>
<p>Look at the quotes. <code>-&gt;</code> returns <strong>jsonb</strong> — the string <code>"Acme"</code> as a JSON value, quotes included. <code>-&gt;&gt;</code> returns <strong>text</strong> — the bare characters. That single character is the source of most JSONB confusion: comparing <code>props-&gt;'brand' = 'Acme'</code> fails, because you are comparing a JSON string to a text literal.</p>
<p>For nested paths, chain the arrows or use <code>#&gt;&gt;</code> with a path array:</p>
<pre><code><span class="tok-keyword">SELECT</span> name,
       props-&gt;<span class="tok-string">'specs'</span>-&gt;&gt;<span class="tok-string">'ram'</span>   <span class="tok-keyword">AS</span> ram,
       props#&gt;&gt;<span class="tok-string">'{specs,cpu}'</span>    <span class="tok-keyword">AS</span> cpu
<span class="tok-keyword">FROM</span> product <span class="tok-keyword">ORDER BY</span> id;</code></pre>
<div class="out">     name      | ram | cpu
---------------+-----+-----
 Laptop Pro 14 | 16  | M3
 Laptop Air 13 | 8   | M2
 Phone X       | 8   |
 Tablet Mini   | 4   |
 Keyboard K1   |     |
(5 rows)</div>
<p>Missing keys give <code>NULL</code>, never an error. That is convenient and dangerous in equal measure: a typo in a key name produces empty results rather than a complaint.</p>
<div class="callout warn">Everything that comes out of <code>-&gt;&gt;</code> is <strong>text</strong>, including numbers. <code>WHERE props-&gt;&gt;'price' &lt; '500'</code> compares strings, so <code>'89'</code> sorts after <code>'500'</code> and the answer is silently wrong. Cast first: <code>WHERE (props-&gt;&gt;'price')::numeric &lt; 500</code>.</div>

<h3>The decision that matters: column or JSONB?</h3>
<p>JSONB is not a way to avoid schema design. It is a place to put the part of your data that genuinely has no fixed shape.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Make it a real column when…</span><span class="lz-d">You filter, sort or join on it; it must never be missing; it needs a foreign key, a <code>CHECK</code>, or a <code>NOT NULL</code>. A real column gets constraints, a natural index, correct types and honest planner statistics.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Use JSONB when…</span><span class="lz-d">The keys genuinely vary per row (product specs, per-integration settings, webhook payloads you must keep verbatim), or the shape is decided by users rather than by you.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The honest middle</span><span class="lz-d">Promote a key to a column the moment you find yourself filtering on it in production. A generated column can do this without a rewrite: <code>price numeric GENERATED ALWAYS AS ((props-&gt;&gt;'price')::numeric) STORED</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — using JSONB to skip the schema, then discovering the schema was doing work for you.</strong> A <code>props</code> blob accepts <code>{"price": "1299"}</code> (a string), <code>{"Price": 1299}</code> (wrong case) and <code>{"prise": 1299}</code> (a typo) with equal enthusiasm, because there is nothing to validate against. Six months later a report quietly under-counts and nobody can say when it started. Worse, the planner has no per-key statistics inside a blob, so it estimates row counts for JSONB predicates far more crudely than for a real column — the bad-plan cause from Chapter 10, built in by design. The rule that survives contact with production: <strong>anything you filter on regularly deserves a column.</strong> JSONB is for the long tail, not for the fields your queries actually depend on.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: see jsonb normalise a document, then get bitten by -&gt; vs -&gt;&gt;</span><span class="lc-sub">The Code Lab track reproduces every output above.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1 · Giai đoạn 4 — Trên production</span>
<h2>Dữ liệu không lược đồ, mà không phải rời khỏi cơ sở dữ liệu</h2>
<p class="lead">Chương 2 đã giới thiệu <code>jsonb</code> trong danh sách các kiểu. Giờ nó xứng đáng có một chương riêng, vì đây là tính năng cho phép MỘT cơ sở dữ liệu chứa cả dữ liệu có cấu trúc chặt lẫn dữ liệu thật sự biến thiên — và cũng vì đây là tính năng bị DÙNG SAI nhiều nhất.</p>
<p>Ví dụ dùng một bảng <code>product</code> nhỏ, trong đó <code>props</code> CỐ Ý để không đều — không phải sản phẩm nào cũng có cùng bộ thông số:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> product (
  id    int <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
  name  text <span class="tok-keyword">NOT NULL</span>,
  props jsonb <span class="tok-keyword">NOT NULL</span>
);
<span class="tok-keyword">INSERT INTO</span> product (name, props) <span class="tok-keyword">VALUES</span>
 (<span class="tok-string">'Laptop Pro 14'</span>, <span class="tok-string">'{"brand":"Acme","price":1299,"tags":["laptop","pro"],"specs":{"ram":16,"cpu":"M3"}}'</span>),
 (<span class="tok-string">'Phone X'</span>,       <span class="tok-string">'{"brand":"Zeta","price":799,"tags":["phone"],"specs":{"ram":8,"storage":256}}'</span>),
 (<span class="tok-string">'Keyboard K1'</span>,   <span class="tok-string">'{"brand":"Acme","price":89,"tags":["accessory"]}'</span>);</code></pre>

<h3>json và jsonb — luôn chọn jsonb</h3>
<p>PostgreSQL có HAI kiểu JSON, và khác biệt hiện ra chỉ trong một truy vấn:</p>
<pre><code><span class="tok-keyword">SELECT</span> <span class="tok-string">'{"b":1,"a":2,"a":3}'</span>::json;
<span class="tok-keyword">SELECT</span> <span class="tok-string">'{"b":1,"a":2,"a":3}'</span>::jsonb;</code></pre>
<div class="out">      kieu_json
---------------------
 {"b":1,"a":2,"a":3}

    kieu_jsonb
------------------
 {"a": 3, "b": 1}</div>
<p><code>json</code> lưu <strong>ĐÚNG cái văn bản bạn đưa</strong>, kể cả khoá trùng, khoảng trắng, thứ tự khoá — và nó phân tích lại ở MỖI lần truy cập. <code>jsonb</code> lưu một dạng nhị phân đã tách rời: khoá được sắp, khoảng trắng bỏ đi, khoá trùng được giải quyết (cái cuối thắng). Chính việc chuẩn hoá đó làm <code>jsonb</code> truy vấn nhanh và, quan trọng nhất, <strong>ĐÁNH CHỈ MỤC ĐƯỢC</strong>. Chỉ dùng <code>json</code> khi bạn buộc phải tái tạo tài liệu chính xác từng byte, và điều đó hiếm.</p>

<h3>Ba cách với vào bên trong</h3>
<pre><code><span class="tok-keyword">SELECT</span> name,
       props-&gt;<span class="tok-string">'brand'</span>            <span class="tok-keyword">AS</span> mui_ten,
       props-&gt;&gt;<span class="tok-string">'brand'</span>           <span class="tok-keyword">AS</span> mui_ten_kep,
       jsonb_typeof(props-&gt;<span class="tok-string">'brand'</span>) <span class="tok-keyword">AS</span> kieu
<span class="tok-keyword">FROM</span> product <span class="tok-keyword">ORDER BY</span> id <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out">     name      | mui_ten | mui_ten_kep |  kieu
---------------+---------+-------------+--------
 Laptop Pro 14 | "Acme"  | Acme        | string
 Laptop Air 13 | "Acme"  | Acme        | string
 Phone X       | "Zeta"  | Zeta        | string
(3 rows)</div>
<p>Nhìn cái dấu nháy. <code>-&gt;</code> trả về <strong>jsonb</strong> — chuỗi <code>"Acme"</code> ở dạng một giá trị JSON, KÈM dấu nháy. <code>-&gt;&gt;</code> trả về <strong>text</strong> — các ký tự trần. Đúng một ký tự đó là nguồn gốc của phần lớn sự bối rối với JSONB: so sánh <code>props-&gt;'brand' = 'Acme'</code> sẽ THẤT BẠI, vì bạn đang so một chuỗi JSON với một hằng text.</p>
<p>Với đường dẫn lồng nhau, hãy nối các mũi tên hoặc dùng <code>#&gt;&gt;</code> với một mảng đường dẫn:</p>
<pre><code><span class="tok-keyword">SELECT</span> name,
       props-&gt;<span class="tok-string">'specs'</span>-&gt;&gt;<span class="tok-string">'ram'</span>   <span class="tok-keyword">AS</span> ram,
       props#&gt;&gt;<span class="tok-string">'{specs,cpu}'</span>    <span class="tok-keyword">AS</span> cpu
<span class="tok-keyword">FROM</span> product <span class="tok-keyword">ORDER BY</span> id;</code></pre>
<div class="out">     name      | ram | cpu
---------------+-----+-----
 Laptop Pro 14 | 16  | M3
 Laptop Air 13 | 8   | M2
 Phone X       | 8   |
 Tablet Mini   | 4   |
 Keyboard K1   |     |
(5 rows)</div>
<p>Khoá không tồn tại thì cho <code>NULL</code>, không bao giờ báo lỗi. Điều đó vừa tiện vừa nguy hiểm ngang nhau: gõ sai tên khoá sẽ cho ra kết quả RỖNG chứ không cho một lời phàn nàn.</p>
<div class="callout warn">Mọi thứ ra khỏi <code>-&gt;&gt;</code> đều là <strong>text</strong>, kể cả số. <code>WHERE props-&gt;&gt;'price' &lt; '500'</code> so sánh CHUỖI, nên <code>'89'</code> đứng SAU <code>'500'</code> và câu trả lời sai một cách âm thầm. Hãy ép kiểu trước: <code>WHERE (props-&gt;&gt;'price')::numeric &lt; 500</code>.</div>

<h3>Quyết định quan trọng: cột thật hay JSONB?</h3>
<p>JSONB KHÔNG phải cách để né việc thiết kế lược đồ. Nó là chỗ để đặt phần dữ liệu THẬT SỰ không có hình dạng cố định.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Hãy làm cột THẬT khi…</span><span class="lz-d">Bạn lọc, sắp xếp hoặc join theo nó; nó không bao giờ được phép thiếu; nó cần khoá ngoại, một <code>CHECK</code>, hay một <code>NOT NULL</code>. Cột thật có ràng buộc, có chỉ mục tự nhiên, có kiểu đúng và có thống kê trung thực cho bộ lập kế hoạch.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hãy dùng JSONB khi…</span><span class="lz-d">Các khoá THẬT SỰ khác nhau theo từng dòng (thông số sản phẩm, cấu hình theo từng tích hợp, payload webhook phải giữ nguyên văn), hoặc hình dạng do NGƯỜI DÙNG quyết chứ không phải bạn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Vùng giữa trung thực</span><span class="lz-d">Hãy nâng một khoá lên thành cột NGAY KHI bạn thấy mình đang lọc theo nó trên production. Một cột generated làm được điều này mà không cần viết lại: <code>price numeric GENERATED ALWAYS AS ((props-&gt;&gt;'price')::numeric) STORED</code>.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — dùng JSONB để né lược đồ, rồi phát hiện ra lược đồ vốn đang LÀM VIỆC giùm mình.</strong> Một cục <code>props</code> nhận <code>{"price": "1299"}</code> (chuỗi), <code>{"Price": 1299}</code> (sai hoa thường) và <code>{"prise": 1299}</code> (gõ nhầm) với sự nhiệt tình NGANG NHAU, vì chẳng có gì để đối chiếu. Sáu tháng sau một báo cáo âm thầm đếm thiếu và không ai nói được nó bắt đầu từ lúc nào. Tệ hơn, bộ lập kế hoạch KHÔNG có thống kê theo từng khoá bên trong một cục blob, nên nó ước lượng số dòng cho các điều kiện JSONB thô sơ hơn nhiều so với cột thật — đúng cái nguyên nhân gây plan tồi ở Chương 10, lần này là do thiết kế. Quy tắc sống sót được khi va chạm với production: <strong>thứ gì bạn lọc theo THƯỜNG XUYÊN thì xứng đáng có một cột.</strong> JSONB dành cho cái đuôi dài, không dành cho những trường mà truy vấn của bạn thật sự phụ thuộc vào.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: xem jsonb chuẩn hoá một tài liệu, rồi dính bẫy -&gt; và -&gt;&gt;</span><span class="lc-sub">Nhánh Code Lab tái hiện mọi output ở trên.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — Querying JSONB and indexing it with GIN|||13.2 — Truy vấn JSONB và đánh chỉ mục bằng GIN',
      slug: 'postgresql-13-2-gin-jsonb',
      type: 'LESSON',
      description: 'Toán tử containment @> và toán tử tồn-tại ?, rồi chỉ mục GIN đo thật trên 200.000 dòng: 56,8 ms xuống 1,2 ms. Kèm điều ít ai nói — GIN chỉ đáng khi truy vấn CHỌN LỌC, và cùng phép đo đó chỉ tiết kiệm được 42% khi điều kiện khớp 25% số dòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2 · Phase 4 — In production</span>
<h2>Searching inside the document</h2>
<p class="lead">Reaching into a known path with <code>-&gt;&gt;</code> is fine when you already have the row. Finding rows <em>by</em> what is inside their JSON is a different problem, and it is where JSONB either shines or quietly destroys your performance — depending entirely on whether you index it.</p>

<h3>Containment: the operator you will use most</h3>
<p><code>@&gt;</code> asks "does the left document contain the right one?" It matches at any depth and ignores everything you did not mention:</p>
<pre><code><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"brand":"Acme"}'</span>;</code></pre>
<div class="out">     name
---------------
 Laptop Pro 14
 Laptop Air 13
 Keyboard K1
(3 rows)</div>
<p>It looks inside arrays too — this finds every product whose <code>tags</code> array contains <code>"light"</code>, without caring what else is in the array:</p>
<pre><code><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"tags":["light"]}'</span>;</code></pre>
<div class="out">     name
---------------
 Laptop Air 13
 Tablet Mini
(2 rows)</div>

<h3>Existence: does this key exist at all?</h3>
<pre><code><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props ? <span class="tok-string">'specs'</span>;                <span class="tok-comment">-- có khoá specs</span>
<span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props-&gt;<span class="tok-string">'specs'</span> ? <span class="tok-string">'storage'</span>;   <span class="tok-comment">-- specs có khoá storage</span></code></pre>
<div class="out">     name              |    name
---------------        | ---------
 Laptop Pro 14         |  Phone X
 Laptop Air 13         | (1 row)
 Phone X
 Tablet Mini
(4 rows)</div>
<p>Four products carry a <code>specs</code> object; only one of them records <code>storage</code>. There is also <code>?|</code> (any of these keys) and <code>?&amp;</code> (all of these keys).</p>
<div class="callout warn">In most client libraries <code>?</code> is the placeholder character for bind parameters, so <code>props ? 'specs'</code> gets mangled before it reaches PostgreSQL. Use the function form <code>jsonb_exists(props, 'specs')</code>, or the driver's escape (<code>??</code> in node-postgres and Prisma raw queries).</div>

<h3>GIN: the index that makes this fast</h3>
<p>Everything so far scanned five rows. Real tables do not. Measured on a <code>ev</code> table with <strong>200,000 rows</strong> (26 MB), searching for one specific price:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> ev <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"price":1234}'</span>;</code></pre>
<div class="out">-- KHÔNG có chỉ mục
 Execution Time: 56.789 ms</div>
<p>Now add a GIN index — the index type built for "many keys per row", which is exactly what a document is:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> ev_props_gin <span class="tok-keyword">ON</span> ev <span class="tok-keyword">USING GIN</span> (props);</code></pre>
<div class="out"> Aggregate  (cost=97.21..97.22 rows=1 width=8) (actual time=1.242..1.244 rows=1 loops=1)
   -&gt;  Bitmap Heap Scan on ev  (cost=21.59..97.16 rows=20 width=0) (actual time=0.812..1.229 rows=100 loops=1)
         Recheck Cond: (props @&gt; '{"price": 1234}'::jsonb)
         Heap Blocks: exact=100
         -&gt;  Bitmap Index Scan on ev_props_gin  (cost=0.00..21.59 rows=20 width=0) (actual time=0.786..0.786 rows=100 loops=1)
               Index Cond: (props @&gt; '{"price": 1234}'::jsonb)</div>
<p><strong>56.789 ms → 1.242 ms, about 45×.</strong> Note the shape: a <em>Bitmap</em> Index Scan feeding a Bitmap Heap Scan with a <code>Recheck Cond</code>. GIN stores which rows contain each key/value but not enough to answer alone, so Postgres collects candidate rows and rechecks them — the reason GIN plans always look like this.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bitmap Index Scan</span><span class="lz-d">GIN looks up each key/value in the search document and returns a <em>bitmap</em> of candidate rows. Fast, but it does not carry the row contents.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bitmap built, then sorted by page</span><span class="lz-d">Candidates are ordered by physical location so the heap is read in one forward sweep instead of jumping around — that is what <code>Heap Blocks: exact=100</code> reports.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bitmap Heap Scan</span><span class="lz-d">The actual rows are fetched from the table.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>Recheck Cond</code></span><span class="lz-d">Every fetched row is re-tested against the original condition, because the index alone cannot prove containment. This is why every GIN plan has this line.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Why selectivity rules</span><span class="lz-d">Steps 3 and 4 cost proportionally to how many rows matched. Match 0.05% and you skip almost all the work; match 25% and you are doing a filtered scan with extra steps.</span></div>
</div>
<h3>The part usually left out: selectivity decides everything</h3>
<p>Run the same experiment with a predicate that matches a quarter of the table instead of 0.05% of it:</p>
<div class="out">-- props @&gt; '{"brand":"Nova","region":"east"}'   → khớp 50.000/200.000 dòng
KHÔNG index:  54.114 ms
CÓ GIN index: 31.463 ms</div>
<p>The same index, on the same table, now buys 42% instead of 45×. When a query returns a large fraction of the rows, the database must visit those rows regardless, and the index only saves the filtering. <strong>An index is a tool for finding a few rows among many</strong> — Chapter 9's lesson, and it applies to GIN exactly as it applies to B-tree.</p>

<h3>Two GIN flavours</h3>
<pre><code><span class="tok-keyword">CREATE INDEX</span> … <span class="tok-keyword">USING GIN</span> (props);                  <span class="tok-comment">-- mặc định</span>
<span class="tok-keyword">CREATE INDEX</span> … <span class="tok-keyword">USING GIN</span> (props jsonb_path_ops);   <span class="tok-comment">-- gọn hơn</span></code></pre>
<div class="out"> indexrelname      | pg_size_pretty
-------------------+----------------
 ev_props_gin      | 2904 kB
 ev_props_gin_path | 2008 kB</div>
<p><code>jsonb_path_ops</code> indexes hashed <em>paths</em> rather than every key and value separately: <strong>31% smaller</strong> here, and faster for <code>@&gt;</code>. The trade is that it supports <em>only</em> <code>@&gt;</code> — the existence operators <code>?</code>, <code>?|</code>, <code>?&amp;</code> will not use it. Choose the default if you need existence checks; choose <code>jsonb_path_ops</code> if containment is all you do.</p>
<div class="pitfall"><p><strong>Trap — assuming a GIN index covers every JSONB query.</strong> It indexes <em>containment and existence</em>, not comparison. <code>WHERE (props-&gt;&gt;'price')::numeric &lt; 500</code> cannot use the GIN index at all — it is an expression over an extracted value, so PostgreSQL falls back to a sequential scan, and the index you created sits there costing you write time for nothing. Range queries on a JSON field need either an expression index on exactly that expression (<code>CREATE INDEX ON ev (((props-&gt;&gt;'price')::numeric))</code>) or, better, the column the previous lesson told you to promote. Check with <code>EXPLAIN</code> — an unused index is invisible until you look.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build the 200k table and watch 56 ms become 1 ms</span><span class="lc-sub">The Code Lab track also reproduces the selective-vs-broad comparison.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2 · Giai đoạn 4 — Trên production</span>
<h2>Tìm kiếm BÊN TRONG tài liệu</h2>
<p class="lead">Với vào một đường dẫn đã biết bằng <code>-&gt;&gt;</code> thì ổn khi bạn ĐÃ có cái dòng đó. Tìm ra các dòng <em>DỰA THEO</em> thứ nằm bên trong JSON của chúng lại là bài toán khác, và đó là chỗ JSONB hoặc toả sáng hoặc âm thầm phá nát hiệu năng của bạn — phụ thuộc hoàn toàn vào việc bạn có đánh chỉ mục hay không.</p>

<h3>Containment: toán tử bạn sẽ dùng nhiều nhất</h3>
<p><code>@&gt;</code> hỏi "tài liệu bên trái có CHỨA tài liệu bên phải không?". Nó khớp ở MỌI độ sâu và bỏ qua mọi thứ bạn không nhắc tới:</p>
<pre><code><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"brand":"Acme"}'</span>;</code></pre>
<div class="out">     name
---------------
 Laptop Pro 14
 Laptop Air 13
 Keyboard K1
(3 rows)</div>
<p>Nó nhìn được cả vào bên trong MẢNG — câu này tìm mọi sản phẩm có mảng <code>tags</code> chứa <code>"light"</code>, chẳng cần quan tâm trong mảng còn gì khác:</p>
<pre><code><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"tags":["light"]}'</span>;</code></pre>
<div class="out">     name
---------------
 Laptop Air 13
 Tablet Mini
(2 rows)</div>

<h3>Tồn tại: khoá này có tồn tại không?</h3>
<pre><code><span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props ? <span class="tok-string">'specs'</span>;                <span class="tok-comment">-- có khoá specs</span>
<span class="tok-keyword">SELECT</span> name <span class="tok-keyword">FROM</span> product <span class="tok-keyword">WHERE</span> props-&gt;<span class="tok-string">'specs'</span> ? <span class="tok-string">'storage'</span>;   <span class="tok-comment">-- specs có khoá storage</span></code></pre>
<div class="out">     name              |    name
---------------        | ---------
 Laptop Pro 14         |  Phone X
 Laptop Air 13         | (1 row)
 Phone X
 Tablet Mini
(4 rows)</div>
<p>Bốn sản phẩm mang một đối tượng <code>specs</code>; chỉ MỘT trong số đó ghi <code>storage</code>. Còn có <code>?|</code> (có BẤT KỲ khoá nào trong số này) và <code>?&amp;</code> (có TẤT CẢ các khoá này).</p>
<div class="callout warn">Ở phần lớn thư viện client, <code>?</code> là ký tự placeholder cho tham số, nên <code>props ? 'specs'</code> bị băm nát TRƯỚC khi tới được PostgreSQL. Hãy dùng dạng hàm <code>jsonb_exists(props, 'specs')</code>, hoặc cách escape của driver (<code>??</code> trong node-postgres và truy vấn thô của Prisma).</div>

<h3>GIN: chỉ mục làm cho việc này nhanh</h3>
<p>Mọi thứ tới giờ đều quét năm dòng. Bảng thật thì không như vậy. Đo trên một bảng <code>ev</code> có <strong>200.000 dòng</strong> (26 MB), tìm một mức giá cụ thể:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> ev <span class="tok-keyword">WHERE</span> props @&gt; <span class="tok-string">'{"price":1234}'</span>;</code></pre>
<div class="out">-- KHÔNG có chỉ mục
 Execution Time: 56.789 ms</div>
<p>Giờ thêm một chỉ mục GIN — loại chỉ mục sinh ra cho "nhiều khoá trên mỗi dòng", mà một tài liệu thì đúng là như thế:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> ev_props_gin <span class="tok-keyword">ON</span> ev <span class="tok-keyword">USING GIN</span> (props);</code></pre>
<div class="out"> Aggregate  (cost=97.21..97.22 rows=1 width=8) (actual time=1.242..1.244 rows=1 loops=1)
   -&gt;  Bitmap Heap Scan on ev  (cost=21.59..97.16 rows=20 width=0) (actual time=0.812..1.229 rows=100 loops=1)
         Recheck Cond: (props @&gt; '{"price": 1234}'::jsonb)
         Heap Blocks: exact=100
         -&gt;  Bitmap Index Scan on ev_props_gin  (cost=0.00..21.59 rows=20 width=0) (actual time=0.786..0.786 rows=100 loops=1)
               Index Cond: (props @&gt; '{"price": 1234}'::jsonb)</div>
<p><strong>56,789 ms → 1,242 ms, khoảng 45 lần.</strong> Để ý hình dạng: một <em>Bitmap</em> Index Scan nuôi một Bitmap Heap Scan có <code>Recheck Cond</code>. GIN lưu thông tin dòng nào chứa khoá/giá trị nào nhưng không đủ để tự trả lời, nên Postgres gom các dòng ứng viên rồi KIỂM LẠI — đó là lý do plan của GIN luôn trông như vậy.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bitmap Index Scan</span><span class="lz-d">GIN tra từng cặp khoá/giá trị trong tài liệu tìm kiếm rồi trả về một <em>bitmap</em> các dòng ứng viên. Nhanh, nhưng nó KHÔNG mang theo nội dung dòng.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dựng bitmap, rồi sắp theo trang</span><span class="lz-d">Các ứng viên được sắp theo vị trí VẬT LÝ để đọc heap trong một lượt quét xuôi thay vì nhảy loạn xạ — đó chính là thứ mà <code>Heap Blocks: exact=100</code> báo cáo.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bitmap Heap Scan</span><span class="lz-d">Các dòng thật được lấy lên từ bảng.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>Recheck Cond</code></span><span class="lz-d">Mọi dòng vừa lấy đều được kiểm LẠI với điều kiện gốc, vì chỉ mình chỉ mục không chứng minh nổi containment. Đó là lý do MỌI plan của GIN đều có dòng này.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Vì sao độ chọn lọc là vua</span><span class="lz-d">Bước 3 và 4 tốn TỈ LỆ THUẬN với số dòng khớp. Khớp 0,05% thì bạn né được gần hết việc; khớp 25% thì bạn đang quét-có-lọc kèm thêm mấy bước phụ.</span></div>
</div>
<h3>Phần thường bị bỏ qua: độ chọn lọc quyết định tất cả</h3>
<p>Chạy đúng thí nghiệm đó với một điều kiện khớp MỘT PHẦN TƯ bảng thay vì 0,05% của nó:</p>
<div class="out">-- props @&gt; '{"brand":"Nova","region":"east"}'   → khớp 50.000/200.000 dòng
KHÔNG index:  54,114 ms
CÓ GIN index: 31,463 ms</div>
<p>Cùng chỉ mục đó, trên cùng bảng đó, giờ chỉ mua được 42% thay vì 45 lần. Khi một truy vấn trả về một phần LỚN số dòng, cơ sở dữ liệu dù sao cũng phải ghé thăm những dòng ấy, và chỉ mục chỉ tiết kiệm được khâu lọc. <strong>Chỉ mục là công cụ để tìm MỘT ÍT dòng giữa RẤT NHIỀU dòng</strong> — bài học của Chương 9, và nó đúng với GIN y như với B-tree.</p>

<h3>Hai hương vị GIN</h3>
<pre><code><span class="tok-keyword">CREATE INDEX</span> … <span class="tok-keyword">USING GIN</span> (props);                  <span class="tok-comment">-- mặc định</span>
<span class="tok-keyword">CREATE INDEX</span> … <span class="tok-keyword">USING GIN</span> (props jsonb_path_ops);   <span class="tok-comment">-- gọn hơn</span></code></pre>
<div class="out"> indexrelname      | pg_size_pretty
-------------------+----------------
 ev_props_gin      | 2904 kB
 ev_props_gin_path | 2008 kB</div>
<p><code>jsonb_path_ops</code> đánh chỉ mục các <em>ĐƯỜNG DẪN</em> đã băm thay vì từng khoá và từng giá trị riêng lẻ: <strong>nhỏ hơn 31%</strong> ở đây, và nhanh hơn cho <code>@&gt;</code>. Cái giá là nó CHỈ hỗ trợ <code>@&gt;</code> — các toán tử tồn tại <code>?</code>, <code>?|</code>, <code>?&amp;</code> sẽ KHÔNG dùng được nó. Chọn bản mặc định nếu bạn cần kiểm tra tồn tại; chọn <code>jsonb_path_ops</code> nếu containment là tất cả những gì bạn làm.</p>
<div class="pitfall"><p><strong>Bẫy — tưởng một chỉ mục GIN bao phủ MỌI truy vấn JSONB.</strong> Nó đánh chỉ mục cho <em>containment và tồn tại</em>, KHÔNG phải cho so sánh. <code>WHERE (props-&gt;&gt;'price')::numeric &lt; 500</code> hoàn toàn KHÔNG dùng được chỉ mục GIN — đó là một biểu thức trên một giá trị đã rút ra, nên PostgreSQL rơi về quét tuần tự, và cái chỉ mục bạn vừa tạo nằm đó bắt bạn trả phí ghi mà chẳng đổi lại gì. Truy vấn theo khoảng trên một trường JSON cần hoặc một chỉ mục biểu thức trên ĐÚNG cái biểu thức đó (<code>CREATE INDEX ON ev (((props-&gt;&gt;'price')::numeric))</code>) hoặc, tốt hơn, chính cái cột mà bài trước đã bảo bạn nâng lên. Hãy kiểm bằng <code>EXPLAIN</code> — một chỉ mục không được dùng thì vô hình cho tới khi bạn nhìn vào.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng bảng 200k và xem 56 ms thành 1 ms</span><span class="lc-sub">Nhánh Code Lab cũng tái hiện phép so sánh chọn-lọc và rộng.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.3 ─────────────────────────── */
    {
      title: '13.3 — Full-text search: tsvector, tsquery and ranking|||13.3 — Full-text search: tsvector, tsquery và xếp hạng',
      slug: 'postgresql-13-3-full-text-search',
      type: 'LESSON',
      description: 'Vì sao LIKE không phải là tìm kiếm. Gốc từ (jumping/jumped/jumps → jump), loại bỏ từ dừng, tsvector và tsquery, cột GENERATED có trọng số A/B, xếp hạng bằng ts_rank, và chỉ mục GIN đưa 39,5 ms xuống 0,080 ms.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3 · Phase 4 — In production</span>
<h2>A search engine you already have</h2>
<p class="lead">Most projects reach for Elasticsearch the moment someone asks for a search box. Very often PostgreSQL is enough, and it is enough without a second system to deploy, secure, back up and keep in sync. The reason it works is that it does not search <em>text</em> — it searches <strong>lexemes</strong>.</p>

<h3>Why LIKE is not search</h3>
<p><code>WHERE body LIKE '%jump%'</code> finds the letters <code>j-u-m-p</code>. It misses <em>jumped</em> if you searched for <em>jumping</em>, matches <em>jumper</em> when you did not want it, cannot rank results, and on a large table it scans everything. Watch what <code>to_tsvector</code> does instead:</p>
<pre><code><span class="tok-keyword">SELECT</span> to_tsvector(<span class="tok-string">'english'</span>, <span class="tok-string">'The quick brown foxes were jumping over the lazy dogs'</span>);</code></pre>
<div class="out"> 'brown':3 'dog':10 'fox':4 'jump':6 'lazi':9 'quick':2
(1 row)</div>
<p>Three things happened. <strong>Stop words are gone</strong> — <em>the</em>, <em>were</em>, <em>over</em> carry no search value. <strong>Words are stemmed</strong> to a root: <em>foxes</em> → <code>fox</code>, <em>jumping</em> → <code>jump</code>, <em>lazy</em> → <code>lazi</code>. And <strong>positions are kept</strong> (the numbers), which is what makes phrase search and ranking possible.</p>
<p>Stemming is the whole point:</p>
<pre><code><span class="tok-keyword">SELECT</span> to_tsvector(<span class="tok-string">'english'</span>, <span class="tok-string">'jumping jumped jumps'</span>);</code></pre>
<div class="out"> 'jump':1,2,3
(1 row)</div>
<p>Three different words, one lexeme at three positions. A search for any of them now finds all of them — something no <code>LIKE</code> pattern can do.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Parse into tokens</span><span class="lz-d">The text is split into words, numbers, URLs, emails — each classified by type, because a URL should not be stemmed like a verb.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Drop stop words</span><span class="lz-d"><em>the</em>, <em>were</em>, <em>over</em> carry no search value and are discarded. This is configuration-specific — and the reason a Vietnamese configuration behaves differently.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Stem to lexemes</span><span class="lz-d"><em>foxes</em> → <code>fox</code>, <em>jumping</em> → <code>jump</code>. Three surface forms collapse to one searchable root.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Keep positions and weights</span><span class="lz-d"><code>'index':2A,8B</code> — position 2 in the title (weight A), position 8 in the body (weight B). Positions enable phrase search; weights enable ranking.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">The query runs the same pipeline</span><span class="lz-d">That is why searching <code>fox</code> finds <em>foxes</em> — both sides were reduced to the same lexeme before <code>@@</code> compared them.</span></div>
</div>
<h3>Matching with @@</h3>
<pre><code><span class="tok-keyword">SELECT</span> to_tsvector(<span class="tok-string">'english'</span>, <span class="tok-string">'The quick brown foxes were jumping over the lazy dogs'</span>)
       @@ to_tsquery(<span class="tok-string">'english'</span>, <span class="tok-string">'fox &amp; dog'</span>) <span class="tok-keyword">AS</span> khop;</code></pre>
<div class="out"> khop
------
 t
(1 row)</div>
<p>The query is stemmed the same way, so <code>fox</code> matches <em>foxes</em>. <code>to_tsquery</code> takes operators: <code>&amp;</code> (and), <code>|</code> (or), <code>!</code> (not), <code>&lt;-&gt;</code> (followed by). For text typed by a user, use <code>plainto_tsquery</code> (treats it as AND) or <code>websearch_to_tsquery</code> (understands quotes and <code>or</code>/<code>-</code> like a search engine) — <code>to_tsquery</code> raises a syntax error on unbalanced input.</p>

<h3>Storing it: a generated column with weights</h3>
<p>Computing <code>to_tsvector</code> on every query is wasted work. Store it once, and while you are there, tell PostgreSQL that a title matters more than a body:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> article (
  id    int <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
  title text <span class="tok-keyword">NOT NULL</span>,
  body  text <span class="tok-keyword">NOT NULL</span>,
  tsv tsvector <span class="tok-keyword">GENERATED ALWAYS AS</span> (
    setweight(to_tsvector(<span class="tok-string">'english'</span>, title), <span class="tok-string">'A'</span>) ||
    setweight(to_tsvector(<span class="tok-string">'english'</span>, body),  <span class="tok-string">'B'</span>)
  ) <span class="tok-keyword">STORED</span>
);</code></pre>
<div class="out"> id |           title            | tsv
----+----------------------------+------------------------------------------------------------------
  1 | PostgreSQL indexing basics | 'b':6B 'b-tree':5B 'basic':3A 'cost':13B 'fast':11B
                                 | 'index':2A,8B,12B 'lookup':10B 'make':9B 'postgresql':1A …</div>
<p>Read the letters: <code>'basic':3A</code> came from the title, <code>'cost':13B</code> from the body, and <code>'index':2A,8B,12B</code> appears in both. Because the column is <code>GENERATED … STORED</code>, PostgreSQL maintains it on every insert and update — there is nothing for the application to remember, and no trigger to write (this is the modern replacement for the trigger-based approach you will find in older tutorials).</p>

<h3>Ranking</h3>
<pre><code><span class="tok-keyword">SELECT</span> id, title, round(ts_rank(tsv, to_tsquery(<span class="tok-string">'english'</span>,<span class="tok-string">'index'</span>))::numeric,4) <span class="tok-keyword">AS</span> hang
<span class="tok-keyword">FROM</span> article <span class="tok-keyword">WHERE</span> tsv @@ to_tsquery(<span class="tok-string">'english'</span>,<span class="tok-string">'index'</span>)
<span class="tok-keyword">ORDER BY</span> hang <span class="tok-keyword">DESC</span>;</code></pre>
<div class="out"> id |           title            |  hang
----+----------------------------+--------
  1 | PostgreSQL indexing basics | 0.6957
  3 | Fast queries with indexes  | 0.6687
(2 rows)</div>
<p>Both articles match; the one with more weight-A hits ranks first. <code>ts_rank_cd</code> is an alternative that also rewards terms appearing close together.</p>

<h3>The index, and what it is worth</h3>
<p>On the same table grown to <strong>200,000 articles</strong>:</p>
<div class="out">-- KHÔNG index
 Execution Time: 39.506 ms

-- CREATE INDEX article_tsv_gin ON article USING GIN (tsv);
 Execution Time: 0.080 ms</div>
<p>Roughly <strong>490×</strong>. A GIN index over a <code>tsvector</code> is what turns full-text search from a table scan into an instant lookup, and it is the single step people most often forget — the feature works without it, just slowly enough that it only becomes a problem in production.</p>
<div class="pitfall"><p><strong>Trap — the text search configuration is not optional, and there is no English-like default for Vietnamese.</strong> Calling <code>to_tsvector(body)</code> without naming a configuration uses <code>default_text_search_config</code>, a server setting — so the same query can stem differently on your laptop and on the VPS, and a <code>GENERATED</code> column built on the one-argument form is rejected outright because it is not immutable. Always pass the configuration explicitly. For Vietnamese there is a second, sharper issue: the built-in configurations do not stem it, and <code>'simple'</code> merely lowercases and splits on whitespace — which is actually a reasonable choice, because Vietnamese words are already separated and mostly uninflected, but it means no stemming and no stop-word removal. Test with real Vietnamese content before promising diacritic-insensitive search; <code>unaccent</code> plus <code>'simple'</code> is the usual working combination, and lesson 13.4's trigram search often does better on short strings like names.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build the weighted tsvector column and rank real results</span><span class="lc-sub">The Code Lab track reproduces the 39.5 ms → 0.080 ms measurement.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3 · Giai đoạn 4 — Trên production</span>
<h2>Một cỗ máy tìm kiếm bạn vốn đã có</h2>
<p class="lead">Phần lớn dự án với tay sang Elasticsearch ngay khi có ai đó hỏi về một ô tìm kiếm. Rất thường xuyên PostgreSQL là đủ, và đủ mà không cần một hệ thống thứ hai để triển khai, bảo mật, sao lưu và giữ đồng bộ. Lý do nó chạy được là vì nó KHÔNG tìm <em>văn bản</em> — nó tìm <strong>LEXEME (đơn vị từ vựng)</strong>.</p>

<h3>Vì sao LIKE không phải là tìm kiếm</h3>
<p><code>WHERE body LIKE '%jump%'</code> tìm các chữ cái <code>j-u-m-p</code>. Nó BỎ SÓT <em>jumped</em> nếu bạn tìm <em>jumping</em>, lại KHỚP <em>jumper</em> khi bạn không muốn, không xếp hạng được kết quả, và trên bảng lớn thì nó quét sạch. Hãy xem <code>to_tsvector</code> làm gì thay vào đó:</p>
<pre><code><span class="tok-keyword">SELECT</span> to_tsvector(<span class="tok-string">'english'</span>, <span class="tok-string">'The quick brown foxes were jumping over the lazy dogs'</span>);</code></pre>
<div class="out"> 'brown':3 'dog':10 'fox':4 'jump':6 'lazi':9 'quick':2
(1 row)</div>
<p>Ba việc đã xảy ra. <strong>Từ dừng biến mất</strong> — <em>the</em>, <em>were</em>, <em>over</em> không mang giá trị tìm kiếm nào. <strong>Từ được đưa về GỐC</strong>: <em>foxes</em> → <code>fox</code>, <em>jumping</em> → <code>jump</code>, <em>lazy</em> → <code>lazi</code>. Và <strong>vị trí được giữ lại</strong> (các con số), đó là thứ làm cho tìm theo cụm và xếp hạng trở nên khả thi.</p>
<p>Việc đưa về gốc chính là điểm mấu chốt:</p>
<pre><code><span class="tok-keyword">SELECT</span> to_tsvector(<span class="tok-string">'english'</span>, <span class="tok-string">'jumping jumped jumps'</span>);</code></pre>
<div class="out"> 'jump':1,2,3
(1 row)</div>
<p>Ba từ khác nhau, MỘT lexeme ở ba vị trí. Tìm bất kỳ cái nào trong số đó giờ đều ra cả ba — điều mà không mẫu <code>LIKE</code> nào làm được.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Tách thành token</span><span class="lz-d">Văn bản được tách thành từ, số, URL, email — mỗi cái được phân loại theo KIỂU, vì một URL thì không nên bị đưa về gốc như một động từ.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Bỏ từ dừng</span><span class="lz-d"><em>the</em>, <em>were</em>, <em>over</em> không mang giá trị tìm kiếm nên bị loại. Đây là thứ phụ thuộc CẤU HÌNH — và là lý do một cấu hình tiếng Việt hành xử khác hẳn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đưa về lexeme (gốc từ)</span><span class="lz-d"><em>foxes</em> → <code>fox</code>, <em>jumping</em> → <code>jump</code>. Ba dạng bề mặt rút về MỘT cái gốc tìm kiếm được.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Giữ vị trí và trọng số</span><span class="lz-d"><code>'index':2A,8B</code> — vị trí 2 trong tiêu đề (trọng số A), vị trí 8 trong thân bài (trọng số B). Vị trí cho phép tìm theo cụm; trọng số cho phép xếp hạng.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Câu truy vấn chạy qua ĐÚNG cái đường ống đó</span><span class="lz-d">Đó là lý do tìm <code>fox</code> lại ra <em>foxes</em> — cả hai phía đều đã được rút về cùng một lexeme TRƯỚC KHI <code>@@</code> đem chúng ra so.</span></div>
</div>
<h3>Khớp bằng @@</h3>
<pre><code><span class="tok-keyword">SELECT</span> to_tsvector(<span class="tok-string">'english'</span>, <span class="tok-string">'The quick brown foxes were jumping over the lazy dogs'</span>)
       @@ to_tsquery(<span class="tok-string">'english'</span>, <span class="tok-string">'fox &amp; dog'</span>) <span class="tok-keyword">AS</span> khop;</code></pre>
<div class="out"> khop
------
 t
(1 row)</div>
<p>Câu truy vấn cũng được đưa về gốc theo cùng cách, nên <code>fox</code> khớp với <em>foxes</em>. <code>to_tsquery</code> nhận các toán tử: <code>&amp;</code> (và), <code>|</code> (hoặc), <code>!</code> (không), <code>&lt;-&gt;</code> (đứng ngay sau). Với văn bản do NGƯỜI DÙNG gõ, hãy dùng <code>plainto_tsquery</code> (coi như AND) hoặc <code>websearch_to_tsquery</code> (hiểu dấu nháy và <code>or</code>/<code>-</code> như một cỗ máy tìm kiếm) — <code>to_tsquery</code> sẽ ném lỗi cú pháp với đầu vào không cân đối.</p>

<h3>Lưu lại: một cột GENERATED có trọng số</h3>
<p>Tính <code>to_tsvector</code> ở mỗi truy vấn là việc thừa. Hãy lưu nó MỘT lần, và nhân tiện, nói cho PostgreSQL biết tiêu đề quan trọng hơn phần thân:</p>
<pre><code><span class="tok-keyword">CREATE TABLE</span> article (
  id    int <span class="tok-keyword">GENERATED ALWAYS AS IDENTITY PRIMARY KEY</span>,
  title text <span class="tok-keyword">NOT NULL</span>,
  body  text <span class="tok-keyword">NOT NULL</span>,
  tsv tsvector <span class="tok-keyword">GENERATED ALWAYS AS</span> (
    setweight(to_tsvector(<span class="tok-string">'english'</span>, title), <span class="tok-string">'A'</span>) ||
    setweight(to_tsvector(<span class="tok-string">'english'</span>, body),  <span class="tok-string">'B'</span>)
  ) <span class="tok-keyword">STORED</span>
);</code></pre>
<div class="out"> id |           title            | tsv
----+----------------------------+------------------------------------------------------------------
  1 | PostgreSQL indexing basics | 'b':6B 'b-tree':5B 'basic':3A 'cost':13B 'fast':11B
                                 | 'index':2A,8B,12B 'lookup':10B 'make':9B 'postgresql':1A …</div>
<p>Đọc các chữ cái: <code>'basic':3A</code> đến từ tiêu đề, <code>'cost':13B</code> từ phần thân, và <code>'index':2A,8B,12B</code> xuất hiện ở CẢ HAI. Vì cột là <code>GENERATED … STORED</code>, PostgreSQL tự bảo trì nó ở mọi lần chèn và cập nhật — ứng dụng không có gì phải nhớ, và không phải viết trigger nào (đây là bản thay thế hiện đại cho cách dùng trigger mà bạn sẽ thấy trong các hướng dẫn cũ).</p>

<h3>Xếp hạng</h3>
<pre><code><span class="tok-keyword">SELECT</span> id, title, round(ts_rank(tsv, to_tsquery(<span class="tok-string">'english'</span>,<span class="tok-string">'index'</span>))::numeric,4) <span class="tok-keyword">AS</span> hang
<span class="tok-keyword">FROM</span> article <span class="tok-keyword">WHERE</span> tsv @@ to_tsquery(<span class="tok-string">'english'</span>,<span class="tok-string">'index'</span>)
<span class="tok-keyword">ORDER BY</span> hang <span class="tok-keyword">DESC</span>;</code></pre>
<div class="out"> id |           title            |  hang
----+----------------------------+--------
  1 | PostgreSQL indexing basics | 0.6957
  3 | Fast queries with indexes  | 0.6687
(2 rows)</div>
<p>Cả hai bài đều khớp; bài có nhiều lượt trúng ở trọng số A hơn thì xếp trước. <code>ts_rank_cd</code> là một lựa chọn khác, nó còn thưởng điểm cho các từ xuất hiện GẦN nhau.</p>

<h3>Chỉ mục, và nó đáng giá bao nhiêu</h3>
<p>Trên cùng bảng đó khi nuôi lên <strong>200.000 bài</strong>:</p>
<div class="out">-- KHÔNG index
 Execution Time: 39,506 ms

-- CREATE INDEX article_tsv_gin ON article USING GIN (tsv);
 Execution Time: 0,080 ms</div>
<p>Khoảng <strong>490 lần</strong>. Một chỉ mục GIN trên một <code>tsvector</code> chính là thứ biến full-text search từ một lượt quét bảng thành một cú tra tức thì, và nó là bước mà người ta hay quên nhất — tính năng vẫn CHẠY khi không có nó, chỉ là chậm vừa đủ để chỉ thành vấn đề khi đã lên production.</p>
<div class="pitfall"><p><strong>Bẫy — cấu hình tìm kiếm văn bản KHÔNG phải tuỳ chọn, và KHÔNG có bản mặc định kiểu-tiếng-Anh nào cho tiếng Việt.</strong> Gọi <code>to_tsvector(body)</code> mà không nêu tên cấu hình sẽ dùng <code>default_text_search_config</code>, một thiết lập của MÁY CHỦ — nên cùng một truy vấn có thể đưa về gốc khác nhau trên laptop của bạn và trên VPS, và một cột <code>GENERATED</code> dựng trên dạng một-tham-số sẽ bị TỪ CHỐI thẳng vì nó không bất biến. Hãy LUÔN truyền cấu hình một cách tường minh. Với tiếng Việt còn một vấn đề thứ hai, sắc hơn: các cấu hình có sẵn KHÔNG đưa tiếng Việt về gốc, và <code>'simple'</code> chỉ hạ chữ thường rồi tách theo khoảng trắng — thực ra đó là lựa chọn hợp lý, vì từ tiếng Việt vốn đã tách rời và hầu như không biến hình, nhưng nó nghĩa là KHÔNG có gốc từ và KHÔNG có loại bỏ từ dừng. Hãy thử với nội dung tiếng Việt THẬT trước khi hứa hẹn tìm kiếm không phân biệt dấu; <code>unaccent</code> kết hợp <code>'simple'</code> là bộ đôi thường dùng được, và tìm bằng trigram ở bài 13.4 thường cho kết quả tốt hơn với các chuỗi ngắn như tên người.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng cột tsvector có trọng số và xếp hạng kết quả thật</span><span class="lc-sub">Nhánh Code Lab tái hiện phép đo 39,5 ms → 0,080 ms.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.4 ─────────────────────────── */
    {
      title: '13.4 — Trigram search: typos, partial names and ILIKE that flies|||13.4 — Tìm bằng trigram: lỗi chính tả, tên gõ dở, và ILIKE bay được',
      slug: 'postgresql-13-4-trigram',
      type: 'LESSON',
      description: 'pg_trgm cắt chuỗi thành cụm ba ký tự để đo độ giống nhau. "PostgresSQL" gõ sai vẫn đạt 0,769 điểm giống, và một chỉ mục GIN trigram khiến ILIKE có % ở đầu — thứ B-tree hoàn toàn bó tay — chạy từ 46,2 ms xuống 0,210 ms.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4 · Phase 4 — In production</span>
<h2>When the user cannot spell it</h2>
<p class="lead">Full-text search is built on words, so it needs the word to be roughly right. It will not find <em>Nguyen</em> for <em>Nguyn</em>, and it does nothing for a partial match inside a product code. That is what the <code>pg_trgm</code> extension is for — a completely different way of comparing strings, based on three-character fragments.</p>
<pre><code><span class="tok-keyword">CREATE EXTENSION IF NOT EXISTS</span> pg_trgm;</code></pre>

<h3>What a trigram is</h3>
<pre><code><span class="tok-keyword">SELECT</span> show_trgm(<span class="tok-string">'cat'</span>);</code></pre>
<div class="out">        ba_ky_tu
-------------------------
 {"  c"," ca","at ",cat}
(1 row)</div>
<p>The word is padded and cut into overlapping three-character slices. Two strings are then compared by how many trigrams they share — which means comparison degrades <em>gracefully</em> as spelling drifts, instead of flipping from match to no-match.</p>
<pre><code><span class="tok-keyword">SELECT</span> similarity(<span class="tok-string">'PostgreSQL'</span>,<span class="tok-string">'PostgresSQL'</span>) <span class="tok-keyword">AS</span> gan_giong,
       similarity(<span class="tok-string">'PostgreSQL'</span>,<span class="tok-string">'MySQL'</span>)       <span class="tok-keyword">AS</span> khac_han;</code></pre>
<div class="out"> gan_giong |  khac_han
-----------+------------
 0.7692308 | 0.13333334
(1 row)</div>
<p>A typo scores 0.77; an unrelated word scores 0.13. Now the useful version — search a table with a misspelled, half-remembered phrase:</p>
<pre><code><span class="tok-keyword">SELECT</span> title, round(similarity(title,<span class="tok-string">'postgres indexs'</span>)::numeric,3) <span class="tok-keyword">AS</span> diem
<span class="tok-keyword">FROM</span> article <span class="tok-keyword">ORDER BY</span> diem <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out">           title            | diem
----------------------------+-------
 PostgreSQL indexing basics | 0.433
 Fast queries with indexes  | 0.171
 Scaling a database         | 0.000
(3 rows)</div>
<p>Neither word was spelled correctly and the right article still came first. This is the machinery behind "did you mean…" and behind a type-ahead box that stays useful while the user is still typing.</p>

<h3>The other half: making ILIKE '%…%' fast</h3>
<p>A B-tree index is useless for a leading wildcard — it can find prefixes, and <code>'%12345%'</code> has no prefix. So this is a sequential scan every time, forever. Measured on 200,000 rows:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> article <span class="tok-keyword">WHERE</span> title <span class="tok-keyword">ILIKE</span> <span class="tok-string">'%12345%'</span>;</code></pre>
<div class="out">-- KHÔNG index
 Execution Time: 46.240 ms</div>
<p>A trigram GIN index changes that, because <code>%12345%</code> still contains trigrams the index knows about:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> article_title_trgm <span class="tok-keyword">ON</span> article <span class="tok-keyword">USING GIN</span> (title gin_trgm_ops);</code></pre>
<div class="out">-- CÓ index
 Execution Time: 0.210 ms</div>
<p><strong>46.240 ms → 0.210 ms, about 220×</strong> — on the one query shape everyone is told is unindexable. If your admin panel has a "search by name" box that does <code>ILIKE '%…%'</code>, this index is very likely the highest-value five minutes available to you.</p>

<h3>Choosing between the three</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Full-text search (13.3)</span><span class="lz-lnote">Long text, real words, stemming and ranking matter. Article bodies, posts, documentation. Needs correct-ish spelling.</span></div>
<div class="lz-layer"><span class="lz-lname">Trigram (this lesson)</span><span class="lz-lnote">Short strings, typos, partial fragments, no word boundaries to rely on. Names, emails, SKUs, tags, autocomplete. Also the only way to index <code>ILIKE '%…%'</code>.</span></div>
<div class="lz-layer"><span class="lz-lname">Plain B-tree + prefix LIKE</span><span class="lz-lnote">You genuinely only need <code>LIKE 'abc%'</code>. Cheapest of the three, and a B-tree with <code>text_pattern_ops</code> handles it. Do not reach for anything cleverer than the problem.</span></div>
</div>
<div class="callout ok">The two are not exclusive. A common production pattern is full-text search for the main query and trigram as the fallback that runs only when FTS returns nothing — which is exactly the moment the user has misspelled something.</div>
<div class="pitfall"><p><strong>Trap — a trigram index on a big text column.</strong> Trigram indexes are built from every three-character window in the value, so their size and build cost scale with the <em>length</em> of the text, not just the row count. On short columns — names, slugs, codes — that is cheap and the payoff above is real. On article bodies it can produce an index larger than the table, slow every write, and still lose to a proper <code>tsvector</code> index for word searching. Match the tool to the column: <code>gin_trgm_ops</code> for short strings, <code>tsvector</code> + GIN for long prose. And note that <code>similarity()</code> only uses the index when written as <code>a % b</code> or with <code>&lt;-&gt;</code> ordering — an explicit <code>similarity(a,b) &gt; 0.3</code> in <code>WHERE</code> is a sequential scan, so check the plan rather than assuming.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: misspell a search on purpose, then index ILIKE into 0.2 ms</span><span class="lc-sub">The Code Lab track reproduces the similarity scores and both timings.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4 · Giai đoạn 4 — Trên production</span>
<h2>Khi người dùng không đánh vần nổi</h2>
<p class="lead">Full-text search dựng trên TỪ, nên nó cần cái từ đó phải gần đúng. Nó sẽ không tìm ra <em>Nguyen</em> khi bạn gõ <em>Nguyn</em>, và nó chẳng làm được gì với một đoạn khớp nằm giữa một mã sản phẩm. Đó là việc của phần mở rộng <code>pg_trgm</code> — một cách so sánh chuỗi HOÀN TOÀN KHÁC, dựa trên các mẩu ba ký tự.</p>
<pre><code><span class="tok-keyword">CREATE EXTENSION IF NOT EXISTS</span> pg_trgm;</code></pre>

<h3>Trigram là gì</h3>
<pre><code><span class="tok-keyword">SELECT</span> show_trgm(<span class="tok-string">'cat'</span>);</code></pre>
<div class="out">        ba_ky_tu
-------------------------
 {"  c"," ca","at ",cat}
(1 row)</div>
<p>Từ đó được đệm thêm rồi cắt thành các lát ba ký tự CHỒNG LẤN nhau. Hai chuỗi sau đó được so bằng số trigram chúng dùng CHUNG — nghĩa là phép so sánh SUY GIẢM MỀM khi chính tả lệch dần, thay vì lật phắt từ khớp sang không-khớp.</p>
<pre><code><span class="tok-keyword">SELECT</span> similarity(<span class="tok-string">'PostgreSQL'</span>,<span class="tok-string">'PostgresSQL'</span>) <span class="tok-keyword">AS</span> gan_giong,
       similarity(<span class="tok-string">'PostgreSQL'</span>,<span class="tok-string">'MySQL'</span>)       <span class="tok-keyword">AS</span> khac_han;</code></pre>
<div class="out"> gan_giong |  khac_han
-----------+------------
 0.7692308 | 0.13333334
(1 row)</div>
<p>Một lỗi gõ được 0,77 điểm; một từ chẳng liên quan được 0,13. Giờ tới phiên bản hữu dụng — tìm trong một bảng bằng một cụm từ nhớ mang máng và gõ sai:</p>
<pre><code><span class="tok-keyword">SELECT</span> title, round(similarity(title,<span class="tok-string">'postgres indexs'</span>)::numeric,3) <span class="tok-keyword">AS</span> diem
<span class="tok-keyword">FROM</span> article <span class="tok-keyword">ORDER BY</span> diem <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out">           title            | diem
----------------------------+-------
 PostgreSQL indexing basics | 0.433
 Fast queries with indexes  | 0.171
 Scaling a database         | 0.000
(3 rows)</div>
<p>Không từ nào được viết đúng mà bài đúng vẫn đứng đầu. Đây chính là bộ máy đằng sau "có phải bạn muốn tìm…" và đằng sau một ô gợi ý vẫn còn hữu dụng trong lúc người dùng mới gõ dở.</p>

<h3>Nửa còn lại: làm cho ILIKE '%…%' nhanh</h3>
<p>Chỉ mục B-tree VÔ DỤNG với ký tự đại diện ở đầu — nó tìm được tiền tố, mà <code>'%12345%'</code> thì không có tiền tố. Nên đây là quét tuần tự, mọi lần, mãi mãi. Đo trên 200.000 dòng:</p>
<pre><code><span class="tok-keyword">EXPLAIN ANALYZE</span> <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> article <span class="tok-keyword">WHERE</span> title <span class="tok-keyword">ILIKE</span> <span class="tok-string">'%12345%'</span>;</code></pre>
<div class="out">-- KHÔNG index
 Execution Time: 46,240 ms</div>
<p>Một chỉ mục GIN trigram đổi được điều đó, vì <code>%12345%</code> vẫn CHỨA những trigram mà chỉ mục biết:</p>
<pre><code><span class="tok-keyword">CREATE INDEX</span> article_title_trgm <span class="tok-keyword">ON</span> article <span class="tok-keyword">USING GIN</span> (title gin_trgm_ops);</code></pre>
<div class="out">-- CÓ index
 Execution Time: 0,210 ms</div>
<p><strong>46,240 ms → 0,210 ms, khoảng 220 lần</strong> — trên đúng cái dạng truy vấn mà ai cũng được dạy rằng không đánh chỉ mục được. Nếu trang quản trị của bạn có một ô "tìm theo tên" chạy <code>ILIKE '%…%'</code>, thì chỉ mục này rất có thể là năm phút đáng giá nhất bạn có thể bỏ ra.</p>

<h3>Chọn giữa ba cách</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Full-text search (13.3)</span><span class="lz-lnote">Văn bản dài, từ ngữ thật, cần gốc từ và xếp hạng. Thân bài viết, bài đăng, tài liệu. Cần chính tả tương đối đúng.</span></div>
<div class="lz-layer"><span class="lz-lname">Trigram (bài này)</span><span class="lz-lnote">Chuỗi ngắn, lỗi chính tả, mẩu khớp một phần, không có ranh giới từ để dựa vào. Tên người, email, mã SKU, thẻ, gợi ý tự động. Cũng là cách DUY NHẤT để đánh chỉ mục cho <code>ILIKE '%…%'</code>.</span></div>
<div class="lz-layer"><span class="lz-lname">B-tree thường + LIKE tiền tố</span><span class="lz-lnote">Bạn THẬT SỰ chỉ cần <code>LIKE 'abc%'</code>. Rẻ nhất trong ba, và một B-tree với <code>text_pattern_ops</code> lo được. Đừng với tay sang thứ cao siêu hơn bài toán.</span></div>
</div>
<div class="callout ok">Hai cách này KHÔNG loại trừ nhau. Một mẫu production quen thuộc là dùng full-text search cho truy vấn chính và trigram làm ĐƯỜNG LÙI chỉ chạy khi FTS trả về rỗng — mà đó chính xác là lúc người dùng vừa gõ sai một thứ gì đó.</div>
<div class="pitfall"><p><strong>Bẫy — một chỉ mục trigram trên một cột văn bản LỚN.</strong> Chỉ mục trigram được dựng từ MỌI cửa sổ ba ký tự trong giá trị, nên kích thước và chi phí dựng của nó tỉ lệ với ĐỘ DÀI văn bản, chứ không chỉ với số dòng. Trên cột ngắn — tên, slug, mã — thì rẻ và phần thưởng ở trên là có thật. Trên thân bài viết thì nó có thể sinh ra một chỉ mục TO HƠN CẢ BẢNG, làm chậm mọi lệnh ghi, mà vẫn thua một chỉ mục <code>tsvector</code> đàng hoàng khi tìm theo từ. Hãy khớp công cụ với cột: <code>gin_trgm_ops</code> cho chuỗi ngắn, <code>tsvector</code> + GIN cho văn xuôi dài. Và để ý rằng <code>similarity()</code> CHỈ dùng được chỉ mục khi viết dạng <code>a % b</code> hoặc với sắp xếp <code>&lt;-&gt;</code> — một câu <code>similarity(a,b) &gt; 0.3</code> tường minh trong <code>WHERE</code> là quét tuần tự, nên hãy kiểm plan thay vì phỏng đoán.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: cố tình gõ sai một truy vấn, rồi đánh chỉ mục cho ILIKE xuống 0,2 ms</span><span class="lc-sub">Nhánh Code Lab tái hiện các điểm similarity và cả hai phép đo thời gian.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 13.5 ─────────────────────────── */
    {
      title: '13.5 — Chapter 13 quiz|||13.5 — Kiểm tra Chương 13',
      slug: 'postgresql-13-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về json vs jsonb, -> và ->>, containment, chỉ mục GIN và độ chọn lọc, tsvector/gốc từ, trọng số, và trigram.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on JSONB and text search. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: knowing that a GIN index does <em>not</em> help a range query on an extracted value (13.2), and that a trigram index is the only way to make <code>ILIKE '%…%'</code> fast (13.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về JSONB và tìm kiếm văn bản. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: biết rằng chỉ mục GIN KHÔNG giúp gì cho truy vấn theo khoảng trên một giá trị đã rút ra (13.2), và trigram là cách DUY NHẤT làm <code>ILIKE '%…%'</code> nhanh (13.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Casting the same text to json and to jsonb gives {"b":1,"a":2,"a":3} and {"a": 3, "b": 1}. Why?|||Ép cùng một chuỗi sang json và sang jsonb cho ra {"b":1,"a":2,"a":3} và {"a": 3, "b": 1}. Vì sao?',
            options: [
              'jsonb corrupted the data|||jsonb làm hỏng dữ liệu',
              'json keeps the exact text (order, whitespace, duplicate keys); jsonb stores a normalised binary form — keys sorted, duplicates resolved last-wins — which is what makes it indexable|||json giữ nguyên văn bản (thứ tự, khoảng trắng, khoá trùng); jsonb lưu dạng nhị phân đã chuẩn hoá — khoá được sắp, khoá trùng lấy cái cuối — và chính điều đó làm nó đánh chỉ mục được',
              'jsonb sorts values, not keys|||jsonb sắp giá trị, không sắp khoá',
              'They should be identical; this is a bug|||Chúng phải giống nhau; đây là một bug',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the difference between props->\'brand\' and props->>\'brand\'?|||Khác biệt giữa props->\'brand\' và props->>\'brand\' là gì?',
            options: [
              'No difference|||Không khác gì',
              '-> returns jsonb (the value "Acme" WITH quotes); ->> returns text (bare Acme). Comparing the jsonb form to a text literal fails|||-> trả về jsonb (giá trị "Acme" KÈM dấu nháy); ->> trả về text (Acme trần). So sánh dạng jsonb với một hằng text sẽ thất bại',
              '-> is for arrays, ->> is for objects|||-> dùng cho mảng, ->> dùng cho đối tượng',
              '->> is faster|||->> nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is WHERE props->>\'price\' < \'500\' dangerous?|||Vì sao WHERE props->>\'price\' < \'500\' lại nguy hiểm?',
            options: [
              'It raises a type error|||Nó ném lỗi kiểu',
              '->> returns text, so it compares STRINGS — \'89\' sorts after \'500\' and the result is silently wrong. Cast: (props->>\'price\')::numeric|||->> trả về text, nên nó so CHUỖI — \'89\' đứng sau \'500\' và kết quả sai âm thầm. Phải ép kiểu: (props->>\'price\')::numeric',
              'It is slow but correct|||Nó chậm nhưng đúng',
              'It only works on integers|||Nó chỉ chạy với số nguyên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A GIN index cut a selective JSONB query from 56.8 ms to 1.2 ms, but the same index only cut a broad query from 54.1 ms to 31.5 ms. Why?|||Một chỉ mục GIN đưa truy vấn JSONB chọn lọc từ 56,8 ms xuống 1,2 ms, nhưng cùng chỉ mục đó chỉ đưa một truy vấn rộng từ 54,1 ms xuống 31,5 ms. Vì sao?',
            options: [
              'The index was corrupted|||Chỉ mục bị hỏng',
              'Selectivity — the broad query matched 50,000 of 200,000 rows, and the database must visit those rows anyway; an index only helps find a FEW rows among many|||Độ chọn lọc — truy vấn rộng khớp 50.000/200.000 dòng, và cơ sở dữ liệu dù sao cũng phải ghé thăm chúng; chỉ mục chỉ giúp tìm MỘT ÍT dòng giữa rất nhiều',
              'GIN indexes get slower over time|||Chỉ mục GIN chậm dần theo thời gian',
              'The second query needed jsonb_path_ops|||Truy vấn thứ hai cần jsonb_path_ops',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which JSONB query can a GIN index NOT accelerate?|||Chỉ mục GIN KHÔNG tăng tốc được truy vấn JSONB nào?',
            options: [
              'props @> \'{"brand":"Acme"}\'|||props @> \'{"brand":"Acme"}\'',
              'WHERE (props->>\'price\')::numeric < 500 — a range over an EXTRACTED value; GIN indexes containment and existence, not comparison|||WHERE (props->>\'price\')::numeric < 500 — một khoảng trên giá trị đã RÚT RA; GIN đánh chỉ mục containment và tồn tại, không phải so sánh',
              'props ? \'specs\'|||props ? \'specs\'',
              'props @> \'{"tags":["light"]}\'|||props @> \'{"tags":["light"]}\'',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'to_tsvector(\'english\',\'jumping jumped jumps\') returns \'jump\':1,2,3. What does that demonstrate?|||to_tsvector(\'english\',\'jumping jumped jumps\') trả về \'jump\':1,2,3. Điều đó chứng minh gì?',
            options: [
              'It removed duplicates|||Nó xoá bản trùng',
              'Stemming — all three forms reduce to one lexeme, so searching any of them finds all of them; positions are kept for phrase search and ranking|||Đưa về GỐC TỪ — cả ba dạng rút về MỘT lexeme, nên tìm bất kỳ cái nào cũng ra cả ba; vị trí được giữ để tìm theo cụm và xếp hạng',
              'It found an error in the text|||Nó tìm thấy lỗi trong văn bản',
              'It counted the words|||Nó đếm số từ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should you always pass the configuration explicitly, as to_tsvector(\'english\', body)?|||Vì sao luôn phải truyền cấu hình tường minh, dạng to_tsvector(\'english\', body)?',
            options: [
              'It is only a style preference|||Chỉ là sở thích về phong cách',
              'The one-argument form uses the SERVER setting default_text_search_config, so results can differ between machines — and a GENERATED column built on it is rejected because it is not immutable|||Dạng một tham số dùng thiết lập của MÁY CHỦ default_text_search_config, nên kết quả có thể khác nhau giữa các máy — và một cột GENERATED dựng trên nó bị TỪ CHỐI vì nó không bất biến',
              'The one-argument form is slower|||Dạng một tham số chậm hơn',
              'It does not matter for English|||Với tiếng Anh thì không quan trọng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your admin panel runs WHERE name ILIKE \'%nguyen%\' and it is slow. What actually fixes it?|||Trang quản trị của bạn chạy WHERE name ILIKE \'%nguyen%\' và nó chậm. Cái gì THẬT SỰ sửa được?',
            options: [
              'A B-tree index on name|||Một chỉ mục B-tree trên name',
              'A GIN index with gin_trgm_ops — a leading wildcard has no prefix so B-tree cannot help, but trigrams can (measured 46.2 ms → 0.210 ms)|||Một chỉ mục GIN với gin_trgm_ops — ký tự đại diện ở đầu thì không có tiền tố nên B-tree bó tay, còn trigram thì được (đo thật 46,2 ms → 0,210 ms)',
              'A tsvector column|||Một cột tsvector',
              'Nothing; leading wildcards are always a scan|||Không gì cả; ký tự đại diện ở đầu luôn phải quét',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
