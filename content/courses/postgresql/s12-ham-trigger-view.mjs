/**
 * PostgreSQL — Chương 12: Hàm, trigger & view (Giai đoạn 3 — Hiệu năng & bên trong).
 * Hàm SQL vs PL/pgSQL, volatility (đo thật: VOLATILE gọi 5 lần, IMMUTABLE gọi 1) ·
 * trigger updated_at + trigger kiểm toán + bẫy BEFORE trả NULL nuốt câu lệnh ·
 * view (ghi được / không ghi được, WITH CHECK OPTION) ·
 * materialized view: 4416 vs 2416 khi chưa REFRESH, CONCURRENTLY cần unique index.
 * Output CHẠY THẬT trên PostgreSQL 16.13. Dữ liệu tất định: views = (id*37) % 101.
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 * Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 12 — Functions, triggers & views|||Chương 12 — Hàm, trigger & view',
  description: 'Đưa logic vào trong cơ sở dữ liệu — và biết khi nào KHÔNG nên. Hàm SQL và PL/pgSQL cùng ba mức volatility quyết định số lần Postgres thật sự gọi chúng, trigger để tự động hoá updated_at và nhật ký kiểm toán, view như truy vấn được đặt tên, và materialized view khi bạn cần đánh đổi độ tươi lấy tốc độ.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — Functions: SQL, PL/pgSQL and volatility|||12.1 — Hàm: SQL, PL/pgSQL và volatility',
      slug: 'postgresql-12-1-ham',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Viết hàm bằng SQL thuần và bằng PL/pgSQL (biến, IF, RETURN), rồi tới thứ hầu hết người dùng bỏ qua: VOLATILE / STABLE / IMMUTABLE quyết định Postgres gọi hàm bao nhiêu lần — đo thật 5 lần so với 1 lần trên cùng một truy vấn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1 · Phase 3 — Performance &amp; internals</span>
<h2>Logic that lives next to the data</h2>
<p class="lead">A function stored in the database runs where the data already is — no round trip, no serialisation, and it is available to every client that connects, not just the one application that happens to implement it. This chapter shows how to write them, and is equally honest about when putting logic here is a mistake.</p>
<p>All examples use a <code>users</code> + <code>notes</code> schema with 500 notes and deterministic view counts, so you can reproduce every number:</p>
<pre><code><span class="tok-keyword">INSERT INTO</span> notes (user_id, title, body, views)
<span class="tok-keyword">SELECT</span> (g % 20)+1, <span class="tok-string">'Note '</span>||g, <span class="tok-string">'Body of note '</span>||g, 0 <span class="tok-keyword">FROM</span> generate_series(1,500) g;
<span class="tok-keyword">UPDATE</span> notes <span class="tok-keyword">SET</span> views = (id * 37) % 101;   <span class="tok-comment">-- tất định, tái hiện được</span></code></pre>

<h3>The simplest kind: a SQL function</h3>
<p>When the body is a single query, <code>LANGUAGE sql</code> is all you need:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> note_count(uid int) <span class="tok-keyword">RETURNS</span> bigint
  <span class="tok-keyword">LANGUAGE</span> sql <span class="tok-keyword">STABLE</span>
  <span class="tok-keyword">AS</span> $$ <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> user_id = uid $$;

<span class="tok-keyword">SELECT</span> u.email, note_count(u.id) <span class="tok-keyword">FROM</span> users u <span class="tok-keyword">ORDER BY</span> u.id <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out">       email       | note_count
-------------------+------------
 user1@example.com |         25
 user2@example.com |         25
 user3@example.com |         25
(3 rows)</div>
<p>The <code>$$</code> pair is <strong>dollar quoting</strong>. The body is a string, and it is full of single quotes, so dollar quoting saves you from escaping every one of them. You can use a tag — <code>$body$ … $body$</code> — when you need to nest.</p>
<div class="callout ok">A SQL function whose body is one <code>SELECT</code> can be <em>inlined</em> by the planner — expanded into the calling query rather than called. That means it can use indexes and be optimised as part of the larger plan. A PL/pgSQL function is a black box the planner cannot see inside. <strong>Prefer <code>LANGUAGE sql</code> whenever the body is one statement.</strong></div>

<h3>PL/pgSQL: when you need variables and branching</h3>
<p>PL/pgSQL adds real procedural constructs — declarations, <code>IF</code>, loops, exception handling:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> xep_hang(v int) <span class="tok-keyword">RETURNS</span> text
  <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">IMMUTABLE</span>
<span class="tok-keyword">AS</span> $$
<span class="tok-keyword">DECLARE</span> nhan text;
<span class="tok-keyword">BEGIN</span>
  <span class="tok-keyword">IF</span> v &gt;= 80 <span class="tok-keyword">THEN</span> nhan := <span class="tok-string">'viral'</span>;
  <span class="tok-keyword">ELSIF</span> v &gt;= 40 <span class="tok-keyword">THEN</span> nhan := <span class="tok-string">'popular'</span>;
  <span class="tok-keyword">ELSIF</span> v &gt; 0 <span class="tok-keyword">THEN</span> nhan := <span class="tok-string">'seen'</span>;
  <span class="tok-keyword">ELSE</span> nhan := <span class="tok-string">'unread'</span>;
  <span class="tok-keyword">END IF</span>;
  <span class="tok-keyword">RETURN</span> nhan;
<span class="tok-keyword">END</span>;
$$;

<span class="tok-keyword">SELECT</span> xep_hang(views) <span class="tok-keyword">AS</span> hang, count(*) <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">GROUP BY</span> 1 <span class="tok-keyword">ORDER BY</span> 2 <span class="tok-keyword">DESC</span>;</code></pre>
<div class="out">  hang   | count
---------+-------
 popular |   198
 seen    |   194
 viral   |   104
 unread  |     4
(4 rows)</div>
<p>Note the <code>BEGIN … END</code> here has nothing to do with transactions — in PL/pgSQL it delimits a <em>block</em>. A function always runs inside the caller's transaction and cannot commit on its own. (A <code>PROCEDURE</code>, invoked with <code>CALL</code>, can — that is the main reason procedures exist.)</p>

<h3>Volatility: the declaration that decides how often your function runs</h3>
<p>Every function is declared <code>VOLATILE</code> (the default), <code>STABLE</code>, or <code>IMMUTABLE</code>. This is not documentation — the planner acts on it. Two functions, identical except for the marker, each raising a notice when called:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> dem_goi_volatile(x int) <span class="tok-keyword">RETURNS</span> int <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">VOLATILE</span>
<span class="tok-keyword">AS</span> $$ <span class="tok-keyword">BEGIN RAISE NOTICE</span> <span class="tok-string">'goi VOLATILE'</span>; <span class="tok-keyword">RETURN</span> x; <span class="tok-keyword">END</span>; $$;

<span class="tok-keyword">CREATE FUNCTION</span> dem_goi_immutable(x int) <span class="tok-keyword">RETURNS</span> int <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">IMMUTABLE</span>
<span class="tok-keyword">AS</span> $$ <span class="tok-keyword">BEGIN RAISE NOTICE</span> <span class="tok-string">'goi IMMUTABLE'</span>; <span class="tok-keyword">RETURN</span> x; <span class="tok-keyword">END</span>; $$;</code></pre>
<p>Now call each one in a <code>WHERE</code> clause over five rows and count the notices:</p>
<div class="out">-- SELECT … FROM (SELECT * FROM notes LIMIT 5) t WHERE id &gt; dem_goi_volatile(0);
số lần in "goi VOLATILE":   5

-- SELECT … FROM (SELECT * FROM notes LIMIT 5) t WHERE id &gt; dem_goi_immutable(0);
số lần in "goi IMMUTABLE":  1</div>
<p>Five calls versus one, on identical work. Because <code>IMMUTABLE</code> promises the same input always gives the same output, the planner evaluated it <strong>once</strong> and folded the result into a constant. <code>VOLATILE</code> promises nothing, so it must be called per row.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>IMMUTABLE</code></span><span class="lz-d">Same arguments ⇒ same result, forever. No database access at all. Can be constant-folded, and is the <strong>only</strong> level usable in an expression index (Chapter 9). Example: <code>lower(text)</code>, pure arithmetic.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>STABLE</code></span><span class="lz-d">Same result within one statement, but may read tables. Cannot be folded to a constant, but the planner may reuse it within a scan and it is safe in index scans. Anything doing <code>SELECT</code> belongs here — including <code>note_count</code> above.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>VOLATILE</code></span><span class="lz-d">May return a different value on every call, may write. <code>random()</code>, <code>now()</code>-adjacent sequence functions, anything that <code>INSERT</code>s. The default — so a function you forgot to mark is treated as the most expensive kind.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — declaring a function <code>IMMUTABLE</code> because it "feels" constant.</strong> The marker is a <em>promise you make to the planner</em>, and PostgreSQL does not verify it. Mark a function that reads a table as <code>IMMUTABLE</code> and it will be constant-folded against data from some earlier moment — giving stale answers with no error, and, far worse, if you build an expression index on it the index silently disagrees with the table forever. The classic version of this bug is a date helper that uses <code>now()</code> or the session time zone: not immutable, because the same input gives a different answer tomorrow. When unsure, use <code>STABLE</code>; the cost of being one level too conservative is some lost optimisation, while the cost of being one level too optimistic is wrong data.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: count the RAISE NOTICE lines and watch IMMUTABLE fold to one call</span><span class="lc-sub">The Code Lab track reproduces the 5-vs-1 measurement.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Logic sống ngay cạnh dữ liệu</h2>
<p class="lead">Một hàm lưu trong cơ sở dữ liệu chạy ngay tại chỗ dữ liệu đang nằm — không đi-về qua mạng, không tuần tự hoá, và mọi client kết nối vào đều dùng được, chứ không riêng cái ứng dụng tình cờ cài đặt nó. Chương này chỉ cách viết chúng, và cũng thẳng thắn không kém về việc khi nào đặt logic ở đây là SAI LẦM.</p>
<p>Mọi ví dụ dùng lược đồ <code>users</code> + <code>notes</code> với 500 note và số lượt xem tất định, để bạn tái hiện được từng con số:</p>
<pre><code><span class="tok-keyword">INSERT INTO</span> notes (user_id, title, body, views)
<span class="tok-keyword">SELECT</span> (g % 20)+1, <span class="tok-string">'Note '</span>||g, <span class="tok-string">'Body of note '</span>||g, 0 <span class="tok-keyword">FROM</span> generate_series(1,500) g;
<span class="tok-keyword">UPDATE</span> notes <span class="tok-keyword">SET</span> views = (id * 37) % 101;   <span class="tok-comment">-- tất định, tái hiện được</span></code></pre>

<h3>Loại đơn giản nhất: hàm SQL</h3>
<p>Khi thân hàm chỉ là MỘT truy vấn, <code>LANGUAGE sql</code> là đủ:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> note_count(uid int) <span class="tok-keyword">RETURNS</span> bigint
  <span class="tok-keyword">LANGUAGE</span> sql <span class="tok-keyword">STABLE</span>
  <span class="tok-keyword">AS</span> $$ <span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> user_id = uid $$;

<span class="tok-keyword">SELECT</span> u.email, note_count(u.id) <span class="tok-keyword">FROM</span> users u <span class="tok-keyword">ORDER BY</span> u.id <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out">       email       | note_count
-------------------+------------
 user1@example.com |         25
 user2@example.com |         25
 user3@example.com |         25
(3 rows)</div>
<p>Cặp <code>$$</code> là <strong>dollar quoting</strong>. Thân hàm là một chuỗi, và nó đầy dấu nháy đơn, nên dollar quoting cứu bạn khỏi việc escape từng cái một. Bạn có thể đặt nhãn — <code>$body$ … $body$</code> — khi cần lồng nhau.</p>
<div class="callout ok">Một hàm SQL mà thân là một câu <code>SELECT</code> có thể được bộ lập kế hoạch <em>NỘI TUYẾN (inline)</em> — bung thẳng vào truy vấn gọi nó thay vì gọi ra ngoài. Nghĩa là nó DÙNG ĐƯỢC chỉ mục và được tối ưu như một phần của plan lớn. Một hàm PL/pgSQL thì là hộp đen mà bộ lập kế hoạch không nhìn vào trong được. <strong>Ưu tiên <code>LANGUAGE sql</code> mỗi khi thân hàm chỉ có một câu lệnh.</strong></div>

<h3>PL/pgSQL: khi bạn cần biến và rẽ nhánh</h3>
<p>PL/pgSQL thêm các cấu trúc thủ tục thật — khai báo, <code>IF</code>, vòng lặp, bắt ngoại lệ:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> xep_hang(v int) <span class="tok-keyword">RETURNS</span> text
  <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">IMMUTABLE</span>
<span class="tok-keyword">AS</span> $$
<span class="tok-keyword">DECLARE</span> nhan text;
<span class="tok-keyword">BEGIN</span>
  <span class="tok-keyword">IF</span> v &gt;= 80 <span class="tok-keyword">THEN</span> nhan := <span class="tok-string">'viral'</span>;
  <span class="tok-keyword">ELSIF</span> v &gt;= 40 <span class="tok-keyword">THEN</span> nhan := <span class="tok-string">'popular'</span>;
  <span class="tok-keyword">ELSIF</span> v &gt; 0 <span class="tok-keyword">THEN</span> nhan := <span class="tok-string">'seen'</span>;
  <span class="tok-keyword">ELSE</span> nhan := <span class="tok-string">'unread'</span>;
  <span class="tok-keyword">END IF</span>;
  <span class="tok-keyword">RETURN</span> nhan;
<span class="tok-keyword">END</span>;
$$;

<span class="tok-keyword">SELECT</span> xep_hang(views) <span class="tok-keyword">AS</span> hang, count(*) <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">GROUP BY</span> 1 <span class="tok-keyword">ORDER BY</span> 2 <span class="tok-keyword">DESC</span>;</code></pre>
<div class="out">  hang   | count
---------+-------
 popular |   198
 seen    |   194
 viral   |   104
 unread  |     4
(4 rows)</div>
<p>Để ý <code>BEGIN … END</code> ở đây KHÔNG dính dáng gì tới giao dịch — trong PL/pgSQL nó phân định một <em>khối lệnh</em>. Một hàm luôn chạy bên trong giao dịch của người gọi và không tự commit được. (Một <code>PROCEDURE</code>, gọi bằng <code>CALL</code>, thì có thể — đó là lý do chính khiến procedure tồn tại.)</p>

<h3>Volatility: cái khai báo quyết định hàm của bạn chạy bao nhiêu lần</h3>
<p>Mọi hàm đều được khai là <code>VOLATILE</code> (mặc định), <code>STABLE</code>, hoặc <code>IMMUTABLE</code>. Đây KHÔNG phải tài liệu cho đẹp — bộ lập kế hoạch HÀNH ĐỘNG dựa trên nó. Hai hàm giống hệt nhau trừ cái nhãn, mỗi cái in một dòng thông báo khi được gọi:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> dem_goi_volatile(x int) <span class="tok-keyword">RETURNS</span> int <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">VOLATILE</span>
<span class="tok-keyword">AS</span> $$ <span class="tok-keyword">BEGIN RAISE NOTICE</span> <span class="tok-string">'goi VOLATILE'</span>; <span class="tok-keyword">RETURN</span> x; <span class="tok-keyword">END</span>; $$;

<span class="tok-keyword">CREATE FUNCTION</span> dem_goi_immutable(x int) <span class="tok-keyword">RETURNS</span> int <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">IMMUTABLE</span>
<span class="tok-keyword">AS</span> $$ <span class="tok-keyword">BEGIN RAISE NOTICE</span> <span class="tok-string">'goi IMMUTABLE'</span>; <span class="tok-keyword">RETURN</span> x; <span class="tok-keyword">END</span>; $$;</code></pre>
<p>Giờ gọi mỗi cái trong một mệnh đề <code>WHERE</code> trên năm dòng rồi đếm số thông báo:</p>
<div class="out">-- SELECT … FROM (SELECT * FROM notes LIMIT 5) t WHERE id &gt; dem_goi_volatile(0);
số lần in "goi VOLATILE":   5

-- SELECT … FROM (SELECT * FROM notes LIMIT 5) t WHERE id &gt; dem_goi_immutable(0);
số lần in "goi IMMUTABLE":  1</div>
<p>Năm lần gọi so với MỘT, trên cùng một khối lượng việc. Vì <code>IMMUTABLE</code> hứa rằng cùng đầu vào thì luôn cho cùng đầu ra, bộ lập kế hoạch đã tính nó <strong>một lần</strong> rồi gấp kết quả thành hằng số. <code>VOLATILE</code> không hứa gì cả, nên nó phải được gọi cho từng dòng.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>IMMUTABLE</code></span><span class="lz-d">Cùng tham số ⇒ cùng kết quả, mãi mãi. KHÔNG truy cập cơ sở dữ liệu chút nào. Gấp được thành hằng số, và là mức <strong>DUY NHẤT</strong> dùng được trong chỉ mục biểu thức (Chương 9). Ví dụ: <code>lower(text)</code>, phép tính thuần.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>STABLE</code></span><span class="lz-d">Cùng kết quả TRONG MỘT câu lệnh, nhưng có thể đọc bảng. Không gấp thành hằng số được, nhưng bộ lập kế hoạch có thể tái dùng trong một lượt quét và nó an toàn trong index scan. Mọi thứ có <code>SELECT</code> đều thuộc về đây — kể cả <code>note_count</code> ở trên.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>VOLATILE</code></span><span class="lz-d">Có thể trả giá trị khác ở mỗi lần gọi, có thể ghi. <code>random()</code>, các hàm sequence gần <code>now()</code>, bất cứ thứ gì <code>INSERT</code>. Là MẶC ĐỊNH — nên một hàm bạn quên đánh dấu sẽ bị coi là loại đắt nhất.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — khai một hàm là <code>IMMUTABLE</code> vì nó "có vẻ" bất biến.</strong> Cái nhãn đó là một <em>LỜI HỨA bạn đưa cho bộ lập kế hoạch</em>, và PostgreSQL KHÔNG kiểm chứng nó. Đánh dấu một hàm CÓ ĐỌC BẢNG là <code>IMMUTABLE</code> thì nó sẽ bị gấp thành hằng số dựa trên dữ liệu của một thời điểm nào đó trước kia — cho câu trả lời cũ mà không hề báo lỗi, và tệ hơn nhiều, nếu bạn dựng một chỉ mục biểu thức trên nó thì chỉ mục ấy âm thầm LỆCH với bảng vĩnh viễn. Phiên bản kinh điển của con bug này là một hàm phụ trợ về ngày tháng dùng <code>now()</code> hoặc múi giờ của phiên: KHÔNG bất biến, vì cùng đầu vào mà ngày mai cho câu trả lời khác. Không chắc thì dùng <code>STABLE</code>; cái giá của việc thận trọng thừa một mức là mất chút tối ưu, còn cái giá của lạc quan thừa một mức là DỮ LIỆU SAI.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đếm số dòng RAISE NOTICE và xem IMMUTABLE gấp lại còn một lần gọi</span><span class="lc-sub">Nhánh Code Lab tái hiện đúng phép đo 5-so-với-1.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Triggers: automation the application cannot forget|||12.2 — Trigger: tự động hoá mà ứng dụng KHÔNG THỂ quên',
      slug: 'postgresql-12-2-trigger',
      type: 'LESSON',
      description: 'Hai trigger đáng dùng nhất trong thực tế: updated_at tự cập nhật và một nhật ký kiểm toán ghi lại đúng những gì thật sự đổi. Kèm bẫy kinh điển: một BEFORE trigger trả về NULL nuốt gọn câu lệnh mà không báo lỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2 · Phase 3 — Performance &amp; internals</span>
<h2>Code that runs whether the application remembers it or not</h2>
<p class="lead">A trigger is a function the database calls automatically when rows change. The reason to use one is not convenience — it is <strong>completeness</strong>. Application code can forget to stamp <code>updated_at</code>; a migration script, a manual <code>psql</code> fix and an admin tool certainly will. A trigger cannot be bypassed, because it lives below every client.</p>
<p>A trigger is always two objects: a <strong>function</strong> returning the special type <code>trigger</code>, and the <strong>trigger</strong> itself binding that function to a table and an event.</p>

<h3>The one everybody needs: updated_at</h3>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> set_updated_at() <span class="tok-keyword">RETURNS</span> trigger <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">AS</span> $$
<span class="tok-keyword">BEGIN</span>
  NEW.updated_at := now();
  <span class="tok-keyword">RETURN</span> NEW;
<span class="tok-keyword">END</span>;
$$;

<span class="tok-keyword">CREATE TRIGGER</span> notes_updated_at
  <span class="tok-keyword">BEFORE UPDATE</span> <span class="tok-keyword">ON</span> notes
  <span class="tok-keyword">FOR EACH ROW</span>
  <span class="tok-keyword">EXECUTE FUNCTION</span> set_updated_at();</code></pre>
<p>Update a row's <em>title</em> and never mention <code>updated_at</code>:</p>
<pre><code><span class="tok-keyword">UPDATE</span> notes <span class="tok-keyword">SET</span> title=<span class="tok-string">'Note 1 (đã sửa)'</span> <span class="tok-keyword">WHERE</span> id=1;
<span class="tok-keyword">SELECT</span> id, title, created_at = updated_at <span class="tok-keyword">AS</span> bang_nhau, updated_at &gt; created_at <span class="tok-keyword">AS</span> moi_hon
  <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> id=1;</code></pre>
<div class="out"> id |      title      | bang_nhau | moi_hon
----+-----------------+-----------+---------
  1 | Note 1 (đã sửa) | f         | t
(1 row)</div>
<p>Inside a trigger function you get two special record variables: <code>NEW</code> (the row as it will be) and <code>OLD</code> (as it was). <code>NEW</code> is <code>NULL</code> in a <code>DELETE</code> trigger; <code>OLD</code> is <code>NULL</code> in an <code>INSERT</code> trigger. <code>TG_OP</code> tells you which operation fired.</p>
<div class="callout ok"><strong>BEFORE vs AFTER is the decision that matters.</strong> A <code>BEFORE … FOR EACH ROW</code> trigger can <em>modify</em> the row by assigning to <code>NEW</code> — that is the only place stamping <code>updated_at</code> works. An <code>AFTER</code> trigger runs once the row is written and cannot change it; use it for side effects — writing an audit row, queueing a notification, updating a counter elsewhere.</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Statement arrives</span><span class="lz-d">An <code>UPDATE</code> is issued. Any <code>BEFORE … FOR EACH STATEMENT</code> trigger fires once, before any row is touched.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>BEFORE … FOR EACH ROW</code></span><span class="lz-d">Fires per row, and can <strong>modify</strong> it by assigning to <code>NEW</code>. Returning <code>NULL</code> here silently skips the row entirely.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The row is written</span><span class="lz-d">Constraints and checks are applied to the row as the <code>BEFORE</code> trigger left it — not as the client sent it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>AFTER … FOR EACH ROW</code></span><span class="lz-d">Fires per row once the write has happened. Cannot change the row; this is where side effects belong — audit rows, notifications, counters.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">All inside one transaction</span><span class="lz-d">If any trigger raises, the original statement fails and everything rolls back together. A slow trigger makes every write on that table slow.</span></div>
</div>
<h3>An audit log that records only real changes</h3>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> audit_notes() <span class="tok-keyword">RETURNS</span> trigger <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">AS</span> $$
<span class="tok-keyword">BEGIN</span>
  <span class="tok-keyword">IF</span> TG_OP = <span class="tok-string">'UPDATE'</span> <span class="tok-keyword">AND</span> NEW.views <span class="tok-keyword">IS DISTINCT FROM</span> OLD.views <span class="tok-keyword">THEN</span>
    <span class="tok-keyword">INSERT INTO</span> note_audit (note_id, hanh_dong, views_cu, views_moi)
    <span class="tok-keyword">VALUES</span> (OLD.id, TG_OP, OLD.views, NEW.views);
  <span class="tok-keyword">ELSIF</span> TG_OP = <span class="tok-string">'DELETE'</span> <span class="tok-keyword">THEN</span>
    <span class="tok-keyword">INSERT INTO</span> note_audit (note_id, hanh_dong, views_cu) <span class="tok-keyword">VALUES</span> (OLD.id, TG_OP, OLD.views);
    <span class="tok-keyword">RETURN</span> OLD;
  <span class="tok-keyword">END IF</span>;
  <span class="tok-keyword">RETURN</span> NEW;
<span class="tok-keyword">END</span>; $$;

<span class="tok-keyword">CREATE TRIGGER</span> notes_audit <span class="tok-keyword">AFTER UPDATE OR DELETE</span> <span class="tok-keyword">ON</span> notes
  <span class="tok-keyword">FOR EACH ROW</span> <span class="tok-keyword">EXECUTE FUNCTION</span> audit_notes();</code></pre>
<p>Three statements: bump views on two rows, a no-op update that sets <code>title</code> to itself, and one delete.</p>
<div class="out"> note_id | hanh_dong | views_cu | views_moi
---------+-----------+----------+-----------
       1 | UPDATE    |       37 |        42
       2 | UPDATE    |       74 |        79
     500 | DELETE    |       17 |
(3 rows)</div>
<p>Three audit rows, not four. The no-op <code>UPDATE notes SET title = title</code> still fired the trigger — PostgreSQL does not compare rows for you — but <code>NEW.views IS DISTINCT FROM OLD.views</code> was false, so nothing was logged. Use <code>IS DISTINCT FROM</code>, not <code>&lt;&gt;</code>: with <code>&lt;&gt;</code>, a comparison involving <code>NULL</code> yields <code>NULL</code>, which is not true, so a change to or from <code>NULL</code> would be silently missed.</p>
<div class="callout warn">A trigger runs inside the same transaction as the statement that fired it. If the audit <code>INSERT</code> fails, the original <code>UPDATE</code> fails too and the whole thing rolls back. That is usually what you want for an audit trail — but it means a trigger that calls something slow or fragile makes every write on that table slow or fragile.</div>

<h3>The trap: a BEFORE trigger that returns NULL</h3>
<p>The return value of a <code>BEFORE … FOR EACH ROW</code> trigger is not decoration. Returning <code>NULL</code> tells PostgreSQL to <strong>skip the operation entirely</strong>:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> nuot() <span class="tok-keyword">RETURNS</span> trigger <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">AS</span> $$ <span class="tok-keyword">BEGIN RETURN NULL</span>; <span class="tok-keyword">END</span>; $$;
<span class="tok-keyword">CREATE TRIGGER</span> bay_before <span class="tok-keyword">BEFORE INSERT</span> <span class="tok-keyword">ON</span> bay <span class="tok-keyword">FOR EACH ROW</span> <span class="tok-keyword">EXECUTE FUNCTION</span> nuot();

<span class="tok-keyword">INSERT INTO</span> bay <span class="tok-keyword">VALUES</span> (1,<span class="tok-string">'a'</span>);
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">AS</span> so_dong_thuc_te <span class="tok-keyword">FROM</span> bay;</code></pre>
<div class="out">INSERT 0 0
 so_dong_thuc_te
-----------------
               0
(1 row)</div>
<p>No error. The row simply never existed. Look closely at <code>INSERT 0 0</code> — the second number is the row count, and it is zero. This is a real feature (it is how you build a filtering trigger), but it is also what happens when a PL/pgSQL branch falls off the end without returning <code>NEW</code>. <strong>Every code path in a <code>BEFORE</code> trigger must end in <code>RETURN NEW</code></strong> unless you deliberately mean to drop the row.</p>
<div class="pitfall"><p><strong>Trap — a trigger that updates the table it is on.</strong> Writing to the same table from inside its own trigger re-fires the trigger, which writes again, and PostgreSQL will happily recurse until it hits the stack depth limit and errors out mid-statement. Guard it with a condition that cannot stay true (<code>IF NEW.views IS DISTINCT FROM OLD.views THEN …</code>), or better, use a <code>BEFORE</code> trigger and assign to <code>NEW</code> instead of issuing an <code>UPDATE</code> — assignment does not re-fire anything. The broader warning is about visibility: business logic in a trigger is invisible from the application code, so a developer reading the Node.js service will not see why a column keeps changing. Use triggers for invariants that must hold no matter who writes — timestamps, audit trails, denormalised counters — and keep genuine business rules in code someone can find.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build both triggers, then make an INSERT vanish on purpose</span><span class="lc-sub">The Code Lab track reproduces the audit table and the INSERT 0 0 result.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Mã chạy bất kể ứng dụng có nhớ hay không</h2>
<p class="lead">Trigger là một hàm mà cơ sở dữ liệu TỰ ĐỘNG gọi khi dòng thay đổi. Lý do dùng nó không phải cho tiện — mà là cho <strong>ĐẦY ĐỦ</strong>. Mã ứng dụng có thể quên đóng dấu <code>updated_at</code>; một script migration, một lần sửa tay bằng <code>psql</code> và một công cụ quản trị thì chắc chắn sẽ quên. Trigger thì không thể đi vòng qua, vì nó nằm BÊN DƯỚI mọi client.</p>
<p>Một trigger luôn là hai đối tượng: một <strong>hàm</strong> trả về kiểu đặc biệt <code>trigger</code>, và bản thân <strong>trigger</strong> gắn hàm đó vào một bảng và một sự kiện.</p>

<h3>Cái ai cũng cần: updated_at</h3>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> set_updated_at() <span class="tok-keyword">RETURNS</span> trigger <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">AS</span> $$
<span class="tok-keyword">BEGIN</span>
  NEW.updated_at := now();
  <span class="tok-keyword">RETURN</span> NEW;
<span class="tok-keyword">END</span>;
$$;

<span class="tok-keyword">CREATE TRIGGER</span> notes_updated_at
  <span class="tok-keyword">BEFORE UPDATE</span> <span class="tok-keyword">ON</span> notes
  <span class="tok-keyword">FOR EACH ROW</span>
  <span class="tok-keyword">EXECUTE FUNCTION</span> set_updated_at();</code></pre>
<p>Cập nhật <em>title</em> của một dòng và không hề nhắc tới <code>updated_at</code>:</p>
<pre><code><span class="tok-keyword">UPDATE</span> notes <span class="tok-keyword">SET</span> title=<span class="tok-string">'Note 1 (đã sửa)'</span> <span class="tok-keyword">WHERE</span> id=1;
<span class="tok-keyword">SELECT</span> id, title, created_at = updated_at <span class="tok-keyword">AS</span> bang_nhau, updated_at &gt; created_at <span class="tok-keyword">AS</span> moi_hon
  <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> id=1;</code></pre>
<div class="out"> id |      title      | bang_nhau | moi_hon
----+-----------------+-----------+---------
  1 | Note 1 (đã sửa) | f         | t
(1 row)</div>
<p>Bên trong một hàm trigger bạn có hai biến bản ghi đặc biệt: <code>NEW</code> (dòng SẼ như thế nào) và <code>OLD</code> (nó ĐÃ như thế nào). <code>NEW</code> là <code>NULL</code> trong trigger <code>DELETE</code>; <code>OLD</code> là <code>NULL</code> trong trigger <code>INSERT</code>. <code>TG_OP</code> cho bạn biết thao tác nào đã kích hoạt.</p>
<div class="callout ok"><strong>BEFORE hay AFTER mới là quyết định quan trọng.</strong> Một trigger <code>BEFORE … FOR EACH ROW</code> có thể <em>SỬA</em> dòng bằng cách gán vào <code>NEW</code> — đó là chỗ DUY NHẤT mà việc đóng dấu <code>updated_at</code> chạy được. Trigger <code>AFTER</code> chạy sau khi dòng đã ghi xong và không đổi được nó nữa; dùng nó cho hiệu ứng phụ — ghi một dòng kiểm toán, xếp hàng một thông báo, cập nhật một bộ đếm ở chỗ khác.</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Câu lệnh tới</span><span class="lz-d">Một lệnh <code>UPDATE</code> được phát ra. Mọi trigger <code>BEFORE … FOR EACH STATEMENT</code> chạy MỘT lần, trước khi chạm vào dòng nào.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>BEFORE … FOR EACH ROW</code></span><span class="lz-d">Chạy cho từng dòng, và <strong>SỬA</strong> được dòng đó bằng cách gán vào <code>NEW</code>. Trả về <code>NULL</code> ở đây là âm thầm bỏ qua HẲN cái dòng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dòng được ghi</span><span class="lz-d">Ràng buộc và kiểm tra áp lên dòng ở trạng thái mà trigger <code>BEFORE</code> để lại — chứ không phải trạng thái client gửi lên.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>AFTER … FOR EACH ROW</code></span><span class="lz-d">Chạy cho từng dòng SAU khi đã ghi xong. Không đổi được dòng nữa; đây là chỗ dành cho hiệu ứng phụ — dòng kiểm toán, thông báo, bộ đếm.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Tất cả nằm trong MỘT giao dịch</span><span class="lz-d">Nếu bất kỳ trigger nào ném lỗi thì câu lệnh gốc hỏng và mọi thứ cùng lùi lại. Một trigger chậm làm MỌI lệnh ghi trên bảng đó chậm.</span></div>
</div>
<h3>Một nhật ký kiểm toán chỉ ghi những thay đổi THẬT</h3>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> audit_notes() <span class="tok-keyword">RETURNS</span> trigger <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">AS</span> $$
<span class="tok-keyword">BEGIN</span>
  <span class="tok-keyword">IF</span> TG_OP = <span class="tok-string">'UPDATE'</span> <span class="tok-keyword">AND</span> NEW.views <span class="tok-keyword">IS DISTINCT FROM</span> OLD.views <span class="tok-keyword">THEN</span>
    <span class="tok-keyword">INSERT INTO</span> note_audit (note_id, hanh_dong, views_cu, views_moi)
    <span class="tok-keyword">VALUES</span> (OLD.id, TG_OP, OLD.views, NEW.views);
  <span class="tok-keyword">ELSIF</span> TG_OP = <span class="tok-string">'DELETE'</span> <span class="tok-keyword">THEN</span>
    <span class="tok-keyword">INSERT INTO</span> note_audit (note_id, hanh_dong, views_cu) <span class="tok-keyword">VALUES</span> (OLD.id, TG_OP, OLD.views);
    <span class="tok-keyword">RETURN</span> OLD;
  <span class="tok-keyword">END IF</span>;
  <span class="tok-keyword">RETURN</span> NEW;
<span class="tok-keyword">END</span>; $$;

<span class="tok-keyword">CREATE TRIGGER</span> notes_audit <span class="tok-keyword">AFTER UPDATE OR DELETE</span> <span class="tok-keyword">ON</span> notes
  <span class="tok-keyword">FOR EACH ROW</span> <span class="tok-keyword">EXECUTE FUNCTION</span> audit_notes();</code></pre>
<p>Ba câu lệnh: tăng views trên hai dòng, một lệnh cập nhật vô nghĩa đặt <code>title</code> bằng chính nó, và một lệnh xoá.</p>
<div class="out"> note_id | hanh_dong | views_cu | views_moi
---------+-----------+----------+-----------
       1 | UPDATE    |       37 |        42
       2 | UPDATE    |       74 |        79
     500 | DELETE    |       17 |
(3 rows)</div>
<p>BA dòng kiểm toán, không phải bốn. Lệnh <code>UPDATE notes SET title = title</code> vô nghĩa VẪN kích hoạt trigger — PostgreSQL không so sánh dòng giùm bạn — nhưng <code>NEW.views IS DISTINCT FROM OLD.views</code> là sai, nên không ghi gì. Hãy dùng <code>IS DISTINCT FROM</code>, đừng dùng <code>&lt;&gt;</code>: với <code>&lt;&gt;</code>, một phép so sánh có dính <code>NULL</code> cho ra <code>NULL</code>, mà <code>NULL</code> thì không phải đúng, nên một thay đổi từ hoặc sang <code>NULL</code> sẽ bị bỏ sót âm thầm.</p>
<div class="callout warn">Trigger chạy TRONG CÙNG giao dịch với câu lệnh đã kích hoạt nó. Nếu lệnh <code>INSERT</code> kiểm toán hỏng thì lệnh <code>UPDATE</code> gốc cũng hỏng và cả cụm bị lùi lại. Với một vết kiểm toán thì đó thường đúng là điều bạn muốn — nhưng nó cũng nghĩa là một trigger gọi thứ gì chậm hoặc mong manh sẽ làm MỌI lệnh ghi trên bảng đó chậm hoặc mong manh.</div>

<h3>Cái bẫy: một BEFORE trigger trả về NULL</h3>
<p>Giá trị trả về của trigger <code>BEFORE … FOR EACH ROW</code> không phải để trang trí. Trả về <code>NULL</code> là bảo PostgreSQL <strong>BỎ QUA HẲN thao tác</strong>:</p>
<pre><code><span class="tok-keyword">CREATE FUNCTION</span> nuot() <span class="tok-keyword">RETURNS</span> trigger <span class="tok-keyword">LANGUAGE</span> plpgsql <span class="tok-keyword">AS</span> $$ <span class="tok-keyword">BEGIN RETURN NULL</span>; <span class="tok-keyword">END</span>; $$;
<span class="tok-keyword">CREATE TRIGGER</span> bay_before <span class="tok-keyword">BEFORE INSERT</span> <span class="tok-keyword">ON</span> bay <span class="tok-keyword">FOR EACH ROW</span> <span class="tok-keyword">EXECUTE FUNCTION</span> nuot();

<span class="tok-keyword">INSERT INTO</span> bay <span class="tok-keyword">VALUES</span> (1,<span class="tok-string">'a'</span>);
<span class="tok-keyword">SELECT</span> count(*) <span class="tok-keyword">AS</span> so_dong_thuc_te <span class="tok-keyword">FROM</span> bay;</code></pre>
<div class="out">INSERT 0 0
 so_dong_thuc_te
-----------------
               0
(1 row)</div>
<p>KHÔNG có lỗi. Cái dòng đó đơn giản là chưa từng tồn tại. Nhìn kỹ <code>INSERT 0 0</code> — con số thứ hai là số dòng, và nó bằng không. Đây là một tính năng thật (đó là cách bạn dựng một trigger lọc), nhưng nó cũng chính là thứ xảy ra khi một nhánh PL/pgSQL đi tới cuối mà không trả về <code>NEW</code>. <strong>MỌI nhánh mã trong một trigger <code>BEFORE</code> đều phải kết thúc bằng <code>RETURN NEW</code></strong> trừ khi bạn CỐ Ý muốn vứt cái dòng đó đi.</p>
<div class="pitfall"><p><strong>Bẫy — một trigger cập nhật CHÍNH cái bảng nó đang gắn vào.</strong> Ghi vào cùng bảng từ bên trong trigger của chính nó sẽ kích hoạt lại trigger, rồi lại ghi tiếp, và PostgreSQL sẽ vui vẻ đệ quy cho tới khi đụng giới hạn độ sâu ngăn xếp rồi báo lỗi giữa câu lệnh. Hãy chặn bằng một điều kiện không thể mãi đúng (<code>IF NEW.views IS DISTINCT FROM OLD.views THEN …</code>), hoặc tốt hơn, dùng trigger <code>BEFORE</code> và GÁN vào <code>NEW</code> thay vì phát một lệnh <code>UPDATE</code> — phép gán không kích hoạt lại gì cả. Cảnh báo rộng hơn là về khả năng NHÌN THẤY: logic nghiệp vụ nằm trong trigger thì VÔ HÌNH từ phía mã ứng dụng, nên một lập trình viên đọc service Node.js sẽ không hiểu vì sao một cột cứ tự đổi. Hãy dùng trigger cho những bất biến phải đúng bất kể ai ghi — dấu thời gian, vết kiểm toán, bộ đếm phi chuẩn hoá — và giữ quy tắc nghiệp vụ thật sự ở chỗ mã mà người ta tìm được.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng cả hai trigger, rồi cố tình làm một lệnh INSERT bốc hơi</span><span class="lc-sub">Nhánh Code Lab tái hiện bảng kiểm toán và kết quả INSERT 0 0.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — Views: a query with a name|||12.3 — View: một truy vấn có tên',
      slug: 'postgresql-12-3-view',
      type: 'LESSON',
      description: 'View lưu định nghĩa truy vấn chứ không lưu dữ liệu, nên nó luôn tươi. Cái nào ghi được và cái nào không (kèm thông báo lỗi thật), WITH CHECK OPTION để chặn dòng thoát ra khỏi phạm vi view, và dùng view làm ranh giới phân quyền.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3 · Phase 3 — Performance &amp; internals</span>
<h2>Naming a query so you only write it once</h2>
<p class="lead">A <strong>view</strong> stores a query definition, not results. Every time you select from it, PostgreSQL substitutes the definition into your query and plans the whole thing together — so a view costs nothing extra to read and is always exactly as fresh as the underlying tables.</p>
<pre><code><span class="tok-keyword">CREATE VIEW</span> note_summary <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> u.id <span class="tok-keyword">AS</span> user_id, u.email,
         count(n.id) <span class="tok-keyword">AS</span> so_note,
         coalesce(sum(n.views),0) <span class="tok-keyword">AS</span> tong_views
  <span class="tok-keyword">FROM</span> users u <span class="tok-keyword">LEFT JOIN</span> notes n <span class="tok-keyword">ON</span> n.user_id = u.id
  <span class="tok-keyword">GROUP BY</span> u.id, u.email;

<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> note_summary <span class="tok-keyword">ORDER BY</span> tong_views <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out"> user_id |       email        | so_note | tong_views
---------+--------------------+---------+------------
      11 | user11@example.com |      25 |       1475
      20 | user20@example.com |      25 |       1417
       1 | user1@example.com  |      24 |       1416
(3 rows)</div>
<p>Insert one more note for user 1 and read the view again — no refresh, no invalidation, nothing to remember:</p>
<div class="out"> user_id |       email       | so_note | tong_views
---------+-------------------+---------+------------
       1 | user1@example.com |      25 |       2416
(1 row)</div>
<p>That is the whole appeal. A join and aggregation you would otherwise paste into six places lives in one definition, and correcting it corrects all six.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Table</span><span class="lz-v">Stores rows. Always current, costs disk, and everything else on this list is built from it.</span></div>
<div class="lz-layer"><span class="lz-k">View</span><span class="lz-v">Stores a <em>query</em>. Zero storage, always exactly as fresh as the table, costs whatever the query costs — every time.</span></div>
<div class="lz-layer"><span class="lz-k">Materialized view</span><span class="lz-v">Stores <em>rows produced by a query</em>. Fast to read, stale until you <code>REFRESH</code>, and costs disk like a table (12.4).</span></div>
<div class="lz-layer"><span class="lz-k">Summary table + trigger</span><span class="lz-v">Stores rows kept in step by an <code>AFTER</code> trigger. Fresh <em>and</em> fast, paid for with write throughput and complexity.</span></div>
</div>
<h3>Some views are writable</h3>
<p>If a view selects from a single table with no aggregation, <code>DISTINCT</code>, <code>GROUP BY</code> or set operation, PostgreSQL can translate writes back to the base table automatically:</p>
<pre><code><span class="tok-keyword">CREATE VIEW</span> note_cua_user1 <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> id, user_id, title, views <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> user_id = 1;

<span class="tok-keyword">UPDATE</span> note_cua_user1 <span class="tok-keyword">SET</span> views = 5 <span class="tok-keyword">WHERE</span> id = 20;
<span class="tok-keyword">SELECT</span> id, user_id, views <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> id = 20;</code></pre>
<div class="out">UPDATE 1
 id | user_id | views
----+---------+-------
 20 |       1 |     5
(1 row)</div>
<p>The aggregated view is a different story:</p>
<pre><code><span class="tok-keyword">UPDATE</span> note_summary <span class="tok-keyword">SET</span> so_note = 0 <span class="tok-keyword">WHERE</span> user_id = 1;</code></pre>
<div class="out">ERROR:  cannot update view "note_summary"
DETAIL:  Views containing GROUP BY are not automatically updatable.
HINT:  To enable updating the view, provide an INSTEAD OF UPDATE trigger or an unconditional ON UPDATE DO INSTEAD rule.</div>
<p>The error is precise and tells you the escape hatch: an <code>INSTEAD OF</code> trigger lets you define by hand what writing to an arbitrary view should mean.</p>

<h3>WITH CHECK OPTION — stop rows escaping the view</h3>
<p>A writable filtered view has a sharp edge: by default you can update a row <em>out of</em> the view's own <code>WHERE</code> clause, and it vanishes from the view you wrote it through. <code>WITH CHECK OPTION</code> forbids that:</p>
<pre><code><span class="tok-keyword">CREATE VIEW</span> note_user1_check <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> id, user_id, title <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> user_id = 1
  <span class="tok-keyword">WITH CHECK OPTION</span>;

<span class="tok-keyword">UPDATE</span> note_user1_check <span class="tok-keyword">SET</span> user_id = 2 <span class="tok-keyword">WHERE</span> id = 20;</code></pre>
<div class="out">ERROR:  new row violates check option for view "note_user1_check"
DETAIL:  Failing row contains (20, 2, Note 20, Body of note 20, 5, …).</div>
<p>Without that clause the update would have succeeded and quietly handed note 20 to a different user. If you expose a per-tenant view for writing, <code>WITH CHECK OPTION</code> is not optional.</p>
<div class="callout ok">Views are a genuine <strong>permission boundary</strong>. Grant a role <code>SELECT</code> on a view and no access to the underlying table, and it can see exactly the rows and columns the view exposes — a clean way to give a reporting user the data without the raw <code>users</code> table, salted password hashes and all.</div>
<div class="pitfall"><p><strong>Trap — views stacked on views.</strong> A view built on a view built on a view is flattened into one query before planning, and that is usually fine. The failure mode is subtler: because each layer looks cheap in isolation, three layers can quietly join the same large table three times, and the plan you get bears no resemblance to what any single definition suggests. The fix is not to avoid views but to <code>EXPLAIN</code> the query you actually run (Chapter 10) rather than reasoning about layers. A second, sharper edge: <code>CREATE OR REPLACE VIEW</code> cannot remove or reorder existing columns — you get <em>cannot drop columns from view</em> — so a schema change means dropping and recreating, and anything that depended on it must be recreated too.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: write through a view, then watch WITH CHECK OPTION refuse an escape</span><span class="lc-sub">The Code Lab track reproduces both error messages exactly.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Đặt tên cho một truy vấn để chỉ phải viết nó một lần</h2>
<p class="lead">Một <strong>view</strong> lưu ĐỊNH NGHĨA truy vấn, không lưu kết quả. Mỗi lần bạn select từ nó, PostgreSQL thay định nghĩa vào truy vấn của bạn rồi lập kế hoạch cho cả cụm cùng lúc — nên một view không tốn thêm gì khi đọc và LUÔN tươi đúng bằng các bảng gốc.</p>
<pre><code><span class="tok-keyword">CREATE VIEW</span> note_summary <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> u.id <span class="tok-keyword">AS</span> user_id, u.email,
         count(n.id) <span class="tok-keyword">AS</span> so_note,
         coalesce(sum(n.views),0) <span class="tok-keyword">AS</span> tong_views
  <span class="tok-keyword">FROM</span> users u <span class="tok-keyword">LEFT JOIN</span> notes n <span class="tok-keyword">ON</span> n.user_id = u.id
  <span class="tok-keyword">GROUP BY</span> u.id, u.email;

<span class="tok-keyword">SELECT</span> * <span class="tok-keyword">FROM</span> note_summary <span class="tok-keyword">ORDER BY</span> tong_views <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 3;</code></pre>
<div class="out"> user_id |       email        | so_note | tong_views
---------+--------------------+---------+------------
      11 | user11@example.com |      25 |       1475
      20 | user20@example.com |      25 |       1417
       1 | user1@example.com  |      24 |       1416
(3 rows)</div>
<p>Chèn thêm một note nữa cho user 1 rồi đọc lại view — không refresh, không vô hiệu hoá, không phải nhớ gì cả:</p>
<div class="out"> user_id |       email       | so_note | tong_views
---------+-------------------+---------+------------
       1 | user1@example.com |      25 |       2416
(1 row)</div>
<p>Đó là toàn bộ sức hấp dẫn. Một phép join và tổng hợp mà lẽ ra bạn phải dán vào sáu chỗ giờ sống trong MỘT định nghĩa, và sửa nó là sửa cả sáu.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Bảng</span><span class="lz-v">Lưu các dòng. Luôn hiện hành, tốn đĩa, và mọi thứ khác trong danh sách này đều dựng lên từ nó.</span></div>
<div class="lz-layer"><span class="lz-k">View</span><span class="lz-v">Lưu một <em>TRUY VẤN</em>. Không tốn chỗ nào, luôn tươi đúng bằng cái bảng, và tốn đúng bằng chi phí của truy vấn — MỖI LẦN.</span></div>
<div class="lz-layer"><span class="lz-k">Materialized view</span><span class="lz-v">Lưu <em>các dòng do một truy vấn sinh ra</em>. Đọc nhanh, CŨ cho tới khi bạn <code>REFRESH</code>, và tốn đĩa như một cái bảng (12.4).</span></div>
<div class="lz-layer"><span class="lz-k">Bảng tổng hợp + trigger</span><span class="lz-v">Lưu các dòng được một trigger <code>AFTER</code> giữ đồng bộ. Vừa tươi <em>vừa</em> nhanh, trả giá bằng thông lượng ghi và độ phức tạp.</span></div>
</div>
<h3>Một số view GHI được</h3>
<p>Nếu một view select từ MỘT bảng, không tổng hợp, không <code>DISTINCT</code>, không <code>GROUP BY</code>, không phép toán tập hợp, thì PostgreSQL tự dịch lệnh ghi ngược về bảng gốc:</p>
<pre><code><span class="tok-keyword">CREATE VIEW</span> note_cua_user1 <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> id, user_id, title, views <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> user_id = 1;

<span class="tok-keyword">UPDATE</span> note_cua_user1 <span class="tok-keyword">SET</span> views = 5 <span class="tok-keyword">WHERE</span> id = 20;
<span class="tok-keyword">SELECT</span> id, user_id, views <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> id = 20;</code></pre>
<div class="out">UPDATE 1
 id | user_id | views
----+---------+-------
 20 |       1 |     5
(1 row)</div>
<p>View có tổng hợp thì lại là chuyện khác:</p>
<pre><code><span class="tok-keyword">UPDATE</span> note_summary <span class="tok-keyword">SET</span> so_note = 0 <span class="tok-keyword">WHERE</span> user_id = 1;</code></pre>
<div class="out">ERROR:  cannot update view "note_summary"
DETAIL:  Views containing GROUP BY are not automatically updatable.
HINT:  To enable updating the view, provide an INSTEAD OF UPDATE trigger or an unconditional ON UPDATE DO INSTEAD rule.</div>
<p>Thông báo lỗi rất chính xác và chỉ luôn lối thoát: một trigger <code>INSTEAD OF</code> cho phép bạn tự định nghĩa bằng tay việc ghi vào một view bất kỳ thì NGHĨA LÀ GÌ.</p>

<h3>WITH CHECK OPTION — chặn dòng thoát ra khỏi view</h3>
<p>Một view có lọc mà ghi được thì có một cạnh sắc: mặc định bạn CÓ THỂ cập nhật một dòng ra NGOÀI chính mệnh đề <code>WHERE</code> của view, và nó biến mất khỏi đúng cái view bạn vừa ghi qua. <code>WITH CHECK OPTION</code> cấm điều đó:</p>
<pre><code><span class="tok-keyword">CREATE VIEW</span> note_user1_check <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> id, user_id, title <span class="tok-keyword">FROM</span> notes <span class="tok-keyword">WHERE</span> user_id = 1
  <span class="tok-keyword">WITH CHECK OPTION</span>;

<span class="tok-keyword">UPDATE</span> note_user1_check <span class="tok-keyword">SET</span> user_id = 2 <span class="tok-keyword">WHERE</span> id = 20;</code></pre>
<div class="out">ERROR:  new row violates check option for view "note_user1_check"
DETAIL:  Failing row contains (20, 2, Note 20, Body of note 20, 5, …).</div>
<p>Không có mệnh đề đó thì lệnh cập nhật đã THÀNH CÔNG và âm thầm trao note 20 cho một người dùng khác. Nếu bạn mở một view theo từng tenant cho phép ghi, <code>WITH CHECK OPTION</code> KHÔNG phải tuỳ chọn.</p>
<div class="callout ok">View là một <strong>ranh giới phân quyền</strong> thật sự. Cấp cho một role quyền <code>SELECT</code> trên view và không cấp gì trên bảng gốc, thì nó thấy đúng những dòng và những cột mà view mở ra — một cách sạch sẽ để đưa dữ liệu cho một người dùng báo cáo mà không đưa cả bảng <code>users</code> thô, kèm băm mật khẩu và mọi thứ.</div>
<div class="pitfall"><p><strong>Bẫy — view chồng lên view.</strong> Một view dựng trên một view dựng trên một view sẽ được LÀM PHẲNG thành một truy vấn trước khi lập kế hoạch, và thường thì ổn. Kiểu hỏng tinh vi hơn: vì mỗi tầng nhìn riêng lẻ đều có vẻ rẻ, ba tầng có thể âm thầm join CÙNG một bảng lớn ba lần, và cái plan bạn nhận được chẳng giống gì với điều mà từng định nghĩa gợi ra. Cách sửa không phải là tránh view mà là <code>EXPLAIN</code> đúng cái truy vấn bạn THẬT SỰ chạy (Chương 10) thay vì suy luận theo tầng. Một cạnh sắc thứ hai: <code>CREATE OR REPLACE VIEW</code> KHÔNG gỡ hay đổi thứ tự được các cột đang có — bạn sẽ nhận <em>cannot drop columns from view</em> — nên đổi lược đồ nghĩa là drop rồi tạo lại, và mọi thứ phụ thuộc vào nó cũng phải tạo lại theo.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: ghi qua một view, rồi xem WITH CHECK OPTION từ chối một cú thoát</span><span class="lc-sub">Nhánh Code Lab tái hiện chính xác cả hai thông báo lỗi.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Materialized views: trading freshness for speed|||12.4 — Materialized view: đánh đổi độ tươi lấy tốc độ',
      slug: 'postgresql-12-4-materialized-view',
      type: 'LESSON',
      description: 'Materialized view LƯU kết quả trên đĩa, nên nó nhanh và nó CŨ. Đo thật hai bên lệch nhau 4416 vs 2416 cho tới khi REFRESH, vì sao REFRESH CONCURRENTLY bắt buộc phải có unique index, và cách quyết định giữa view, matview và một bảng tổng hợp do trigger nuôi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4 · Phase 3 — Performance &amp; internals</span>
<h2>A view that keeps its answers</h2>
<p class="lead">A plain view re-runs its query every time. When that query is an expensive aggregation over millions of rows and the answer only needs to be right to within an hour, re-running it per page load is waste. A <strong>materialized view</strong> runs the query once, stores the rows on disk like a table, and hands them back instantly — until you tell it to refresh.</p>
<pre><code><span class="tok-keyword">CREATE MATERIALIZED VIEW</span> note_summary_mv <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> u.id <span class="tok-keyword">AS</span> user_id, u.email,
         count(n.id) <span class="tok-keyword">AS</span> so_note,
         coalesce(sum(n.views),0) <span class="tok-keyword">AS</span> tong_views
  <span class="tok-keyword">FROM</span> users u <span class="tok-keyword">LEFT JOIN</span> notes n <span class="tok-keyword">ON</span> n.user_id = u.id
  <span class="tok-keyword">GROUP BY</span> u.id, u.email;</code></pre>
<p>Note the output of the <code>CREATE</code>: <code>SELECT 20</code>. It ran the query immediately and stored 20 rows. A plain <code>CREATE VIEW</code> stores nothing and returns <code>CREATE VIEW</code>.</p>

<h3>Watch it go stale</h3>
<p>Insert another note for user 1, then read both objects in one query:</p>
<pre><code><span class="tok-keyword">SELECT</span> <span class="tok-string">'view'</span> <span class="tok-keyword">AS</span> loai, tong_views <span class="tok-keyword">FROM</span> note_summary    <span class="tok-keyword">WHERE</span> user_id=1
<span class="tok-keyword">UNION ALL</span>
<span class="tok-keyword">SELECT</span> <span class="tok-string">'matview'</span>,     tong_views <span class="tok-keyword">FROM</span> note_summary_mv <span class="tok-keyword">WHERE</span> user_id=1;</code></pre>
<div class="out">  loai   | tong_views
---------+------------
 view    |       4416
 matview |       2416
(2 rows)</div>
<p>The view is current; the materialized view is showing an answer from before the insert. That is not a bug — it is the entire trade. <code>REFRESH</code> makes them agree again:</p>
<pre><code><span class="tok-keyword">REFRESH MATERIALIZED VIEW</span> note_summary_mv;</code></pre>
<div class="out"> tong_views
------------
       4416
(1 row)</div>

<h3>What you buy with that staleness</h3>
<p>Timing the same <code>count(*)</code> against each, on this deliberately small dataset:</p>
<div class="out">SELECT count(*) FROM note_summary;      Time: 1.856 ms
SELECT count(*) FROM note_summary_mv;   Time: 0.318 ms</div>
<p>About 5.8× on 20 users and 500 notes — where the join is trivial. The reason to reach for this feature is that the gap grows with the work being avoided: the same aggregation over millions of rows can be seconds versus a fraction of a millisecond. Measure your own case with <code>EXPLAIN ANALYZE</code>; do not adopt a materialized view on the assumption that it must be faster.</p>

<h3>REFRESH locks — unless you give it a unique index</h3>
<p>A plain <code>REFRESH</code> takes an <code>ACCESS EXCLUSIVE</code> lock: readers block for the whole rebuild. <code>CONCURRENTLY</code> avoids that, but it has a prerequisite:</p>
<pre><code><span class="tok-keyword">REFRESH MATERIALIZED VIEW CONCURRENTLY</span> note_summary_mv;</code></pre>
<div class="out">ERROR:  cannot refresh materialized view "public.note_summary_mv" concurrently
HINT:  Create a unique index with no WHERE clause on one or more columns of the materialized view.</div>
<p>Do as the hint says and it works:</p>
<pre><code><span class="tok-keyword">CREATE UNIQUE INDEX</span> <span class="tok-keyword">ON</span> note_summary_mv (user_id);
<span class="tok-keyword">REFRESH MATERIALIZED VIEW CONCURRENTLY</span> note_summary_mv;</code></pre>
<div class="out">CREATE INDEX
REFRESH MATERIALIZED VIEW</div>
<p><code>CONCURRENTLY</code> needs the unique index to match old rows against new ones so it can apply a difference instead of swapping the whole relation. It is slower overall and does more I/O — but readers keep working throughout, which is what matters on a live site.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">View</span><span class="lz-lnote">Always fresh, stores nothing, costs whatever the query costs. The default choice. Use it to name a query you repeat.</span></div>
<div class="lz-layer"><span class="lz-lname">Materialized view</span><span class="lz-lnote">Fast and stale. Stores rows on disk, needs a <code>REFRESH</code> you must schedule. Use it for expensive aggregations where an hour-old answer is acceptable — dashboards, leaderboards, reports.</span></div>
<div class="lz-layer"><span class="lz-lname">Summary table + trigger</span><span class="lz-lnote">Fresh <em>and</em> fast, at the cost of write throughput and complexity: an <code>AFTER</code> trigger (12.2) keeps a real table in step on every change. Reach for it only when you need both and have measured that the other two do not do.</span></div>
</div>

<div class="pitfall"><p><strong>Trap — creating a materialized view and never scheduling the refresh.</strong> It has no expiry, no background job and no warning. It will serve the numbers from the afternoon you created it, for months, and every one of those queries will be fast and wrong. If you create one, create its refresh in the same change — a cron entry, a scheduled job, or a <code>pg_cron</code> task — and make the refresh time visible to whoever reads the dashboard, so a stale number looks stale instead of looking like a business trend. The second half of the trap: an ordinary <code>REFRESH</code> on a large view locks readers out for its entire duration, so the refresh you schedule at peak hour to "keep it fresh" is an outage on a timer. Add the unique index and use <code>CONCURRENTLY</code>.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: make a matview go stale, then refresh it concurrently</span><span class="lc-sub">The Code Lab track reproduces the 4416-vs-2416 divergence and the CONCURRENTLY error.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4 · Giai đoạn 3 — Hiệu năng &amp; bên trong</span>
<h2>Một view giữ lại câu trả lời của nó</h2>
<p class="lead">Một view thường chạy lại truy vấn của nó MỖI LẦN. Khi truy vấn ấy là một phép tổng hợp đắt trên hàng triệu dòng và câu trả lời chỉ cần đúng trong phạm vi một giờ, thì chạy lại nó ở mỗi lượt tải trang là lãng phí. Một <strong>materialized view</strong> chạy truy vấn MỘT lần, lưu các dòng xuống đĩa như một cái bảng, và trả về tức thì — cho tới khi bạn bảo nó làm mới.</p>
<pre><code><span class="tok-keyword">CREATE MATERIALIZED VIEW</span> note_summary_mv <span class="tok-keyword">AS</span>
  <span class="tok-keyword">SELECT</span> u.id <span class="tok-keyword">AS</span> user_id, u.email,
         count(n.id) <span class="tok-keyword">AS</span> so_note,
         coalesce(sum(n.views),0) <span class="tok-keyword">AS</span> tong_views
  <span class="tok-keyword">FROM</span> users u <span class="tok-keyword">LEFT JOIN</span> notes n <span class="tok-keyword">ON</span> n.user_id = u.id
  <span class="tok-keyword">GROUP BY</span> u.id, u.email;</code></pre>
<p>Để ý output của lệnh <code>CREATE</code>: <code>SELECT 20</code>. Nó đã chạy truy vấn NGAY và lưu 20 dòng. Còn <code>CREATE VIEW</code> thường thì không lưu gì và trả về <code>CREATE VIEW</code>.</p>

<h3>Nhìn nó cũ đi</h3>
<p>Chèn thêm một note nữa cho user 1, rồi đọc cả hai đối tượng trong một truy vấn:</p>
<pre><code><span class="tok-keyword">SELECT</span> <span class="tok-string">'view'</span> <span class="tok-keyword">AS</span> loai, tong_views <span class="tok-keyword">FROM</span> note_summary    <span class="tok-keyword">WHERE</span> user_id=1
<span class="tok-keyword">UNION ALL</span>
<span class="tok-keyword">SELECT</span> <span class="tok-string">'matview'</span>,     tong_views <span class="tok-keyword">FROM</span> note_summary_mv <span class="tok-keyword">WHERE</span> user_id=1;</code></pre>
<div class="out">  loai   | tong_views
---------+------------
 view    |       4416
 matview |       2416
(2 rows)</div>
<p>View thì hiện hành; materialized view thì đang hiện câu trả lời của lúc TRƯỚC khi chèn. Đó không phải bug — đó là toàn bộ cuộc đánh đổi. <code>REFRESH</code> làm chúng khớp lại:</p>
<pre><code><span class="tok-keyword">REFRESH MATERIALIZED VIEW</span> note_summary_mv;</code></pre>
<div class="out"> tong_views
------------
       4416
(1 row)</div>

<h3>Bạn mua được gì bằng sự cũ kỹ đó</h3>
<p>Bấm giờ cùng một câu <code>count(*)</code> trên mỗi bên, trên bộ dữ liệu CỐ TÌNH để nhỏ này:</p>
<div class="out">SELECT count(*) FROM note_summary;      Time: 1.856 ms
SELECT count(*) FROM note_summary_mv;   Time: 0.318 ms</div>
<p>Khoảng 5,8 lần với 20 user và 500 note — chỗ mà phép join gần như chẳng đáng gì. Lý do để với tay sang tính năng này là khoảng cách đó LỚN DẦN theo khối lượng việc được né: cùng phép tổng hợp ấy trên hàng triệu dòng có thể là vài GIÂY so với một phần nghìn giây. Hãy tự đo trường hợp của bạn bằng <code>EXPLAIN ANALYZE</code>; đừng nhận nuôi một materialized view chỉ vì cho rằng nó chắc chắn nhanh hơn.</p>

<h3>REFRESH có khoá — trừ khi bạn cho nó một unique index</h3>
<p>Một lệnh <code>REFRESH</code> thường lấy khoá <code>ACCESS EXCLUSIVE</code>: người đọc bị chặn suốt cả lượt dựng lại. <code>CONCURRENTLY</code> tránh được điều đó, nhưng nó có một điều kiện tiên quyết:</p>
<pre><code><span class="tok-keyword">REFRESH MATERIALIZED VIEW CONCURRENTLY</span> note_summary_mv;</code></pre>
<div class="out">ERROR:  cannot refresh materialized view "public.note_summary_mv" concurrently
HINT:  Create a unique index with no WHERE clause on one or more columns of the materialized view.</div>
<p>Làm đúng như gợi ý và nó chạy:</p>
<pre><code><span class="tok-keyword">CREATE UNIQUE INDEX</span> <span class="tok-keyword">ON</span> note_summary_mv (user_id);
<span class="tok-keyword">REFRESH MATERIALIZED VIEW CONCURRENTLY</span> note_summary_mv;</code></pre>
<div class="out">CREATE INDEX
REFRESH MATERIALIZED VIEW</div>
<p><code>CONCURRENTLY</code> cần cái unique index để KHỚP dòng cũ với dòng mới, nhờ đó nó áp một phần CHÊNH LỆCH thay vì tráo nguyên cả quan hệ. Nó chậm hơn về tổng thể và tốn I/O hơn — nhưng người đọc vẫn làm việc được suốt quá trình, và đó mới là thứ đáng kể trên một trang đang chạy.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">View</span><span class="lz-lnote">Luôn tươi, không lưu gì, tốn đúng bằng chi phí của truy vấn. Lựa chọn mặc định. Dùng để ĐẶT TÊN cho một truy vấn bạn lặp lại.</span></div>
<div class="lz-layer"><span class="lz-lname">Materialized view</span><span class="lz-lnote">Nhanh và CŨ. Lưu dòng xuống đĩa, cần một lệnh <code>REFRESH</code> mà bạn PHẢI lên lịch. Dùng cho các phép tổng hợp đắt mà một câu trả lời cũ một giờ vẫn chấp nhận được — bảng điều khiển, bảng xếp hạng, báo cáo.</span></div>
<div class="lz-layer"><span class="lz-lname">Bảng tổng hợp + trigger</span><span class="lz-lnote">Vừa tươi <em>vừa</em> nhanh, đổi lại là thông lượng ghi và độ phức tạp: một trigger <code>AFTER</code> (12.2) giữ một cái bảng thật đồng bộ ở mọi thay đổi. Chỉ với tay sang đây khi bạn cần CẢ HAI và đã ĐO được rằng hai cách kia không đủ.</span></div>
</div>

<div class="pitfall"><p><strong>Bẫy — tạo một materialized view rồi KHÔNG BAO GIỜ lên lịch làm mới nó.</strong> Nó không có hạn dùng, không có tiến trình nền, không có cảnh báo. Nó sẽ phục vụ những con số của cái buổi chiều bạn tạo ra nó, suốt nhiều THÁNG, và mọi truy vấn ấy đều nhanh và SAI. Nếu bạn tạo một cái, hãy tạo luôn lệnh làm mới trong CÙNG một thay đổi — một mục cron, một job có lịch, hoặc một tác vụ <code>pg_cron</code> — và cho hiện thời điểm làm mới tới người đọc bảng điều khiển, để một con số cũ TRÔNG NHƯ đồ cũ thay vì trông như một xu hướng kinh doanh. Nửa sau của cái bẫy: một lệnh <code>REFRESH</code> thường trên một view lớn chặn người đọc suốt toàn bộ thời gian nó chạy, nên cái lệnh làm mới bạn hẹn giờ vào giờ cao điểm để "giữ cho nó tươi" chính là một sự cố có hẹn giờ. Hãy thêm unique index và dùng <code>CONCURRENTLY</code>.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: làm một matview cũ đi, rồi refresh nó theo kiểu concurrently</span><span class="lc-sub">Nhánh Code Lab tái hiện độ lệch 4416-so-với-2416 và lỗi CONCURRENTLY.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — Chapter 12 quiz|||12.5 — Kiểm tra Chương 12',
      slug: 'postgresql-12-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về hàm SQL vs PL/pgSQL, volatility, trigger BEFORE/AFTER, IS DISTINCT FROM, view ghi được, và materialized view.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on functions, triggers and views. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why a wrong <code>IMMUTABLE</code> marker silently corrupts an expression index (12.1), and that a <code>BEFORE</code> trigger returning <code>NULL</code> drops the row with no error (12.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về hàm, trigger và view. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao một cái nhãn <code>IMMUTABLE</code> sai âm thầm làm hỏng chỉ mục biểu thức (12.1), và việc trigger <code>BEFORE</code> trả <code>NULL</code> làm mất dòng mà không báo lỗi (12.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'When the body of a function is a single SELECT, why prefer LANGUAGE sql over plpgsql?|||Khi thân hàm chỉ là MỘT câu SELECT, vì sao nên chọn LANGUAGE sql hơn plpgsql?',
            options: [
              'plpgsql cannot run SELECT|||plpgsql không chạy được SELECT',
              'A SQL function can be INLINED into the calling query, so the planner can optimise it and use indexes; a plpgsql function is a black box|||Hàm SQL có thể được NỘI TUYẾN vào truy vấn gọi nó, nên bộ lập kế hoạch tối ưu được và dùng được chỉ mục; hàm plpgsql là một hộp đen',
              'SQL functions can commit transactions|||Hàm SQL commit được giao dịch',
              'There is no difference|||Không có khác biệt gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A VOLATILE and an IMMUTABLE function are each called in a WHERE clause over 5 rows. How many times does each actually run?|||Một hàm VOLATILE và một hàm IMMUTABLE cùng được gọi trong mệnh đề WHERE trên 5 dòng. Mỗi cái THẬT SỰ chạy bao nhiêu lần?',
            options: [
              'Both 5 times|||Cả hai 5 lần',
              'VOLATILE 5 times (once per row); IMMUTABLE 1 time — the planner folds it into a constant|||VOLATILE 5 lần (mỗi dòng một lần); IMMUTABLE 1 lần — bộ lập kế hoạch gấp nó thành hằng số',
              'Both 1 time|||Cả hai 1 lần',
              'VOLATILE 1 time; IMMUTABLE 5 times|||VOLATILE 1 lần; IMMUTABLE 5 lần',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the danger of marking a function IMMUTABLE when it actually reads a table?|||Đánh dấu một hàm là IMMUTABLE trong khi nó THẬT SỰ đọc bảng thì nguy hiểm gì?',
            options: [
              'PostgreSQL rejects it at CREATE time|||PostgreSQL từ chối ngay lúc CREATE',
              'PostgreSQL does not verify the promise — it may constant-fold stale data, and an expression index built on it silently disagrees with the table forever|||PostgreSQL KHÔNG kiểm chứng lời hứa đó — nó có thể gấp dữ liệu cũ thành hằng số, và một chỉ mục biểu thức dựng trên nó sẽ âm thầm lệch với bảng vĩnh viễn',
              'The function runs slower|||Hàm chạy chậm hơn',
              'Nothing; the marker is only documentation|||Không sao cả; cái nhãn chỉ là tài liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You need a trigger to stamp NEW.updated_at. Must it be BEFORE or AFTER, and why?|||Bạn cần một trigger đóng dấu NEW.updated_at. Nó phải là BEFORE hay AFTER, và vì sao?',
            options: [
              'AFTER — the row must exist first|||AFTER — dòng phải tồn tại trước đã',
              'BEFORE — only a BEFORE ... FOR EACH ROW trigger can modify the row by assigning to NEW; an AFTER trigger runs once the row is already written|||BEFORE — chỉ trigger BEFORE ... FOR EACH ROW mới SỬA được dòng bằng cách gán vào NEW; trigger AFTER chạy khi dòng đã ghi xong rồi',
              'Either works identically|||Cái nào cũng như nhau',
              'Neither; use a CHECK constraint|||Không cái nào; dùng ràng buộc CHECK',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In an audit trigger, why use "NEW.views IS DISTINCT FROM OLD.views" rather than "NEW.views <> OLD.views"?|||Trong một trigger kiểm toán, vì sao dùng "NEW.views IS DISTINCT FROM OLD.views" thay vì "NEW.views <> OLD.views"?',
            options: [
              'They are the same|||Chúng như nhau',
              'With <>, a comparison involving NULL yields NULL (not true), so a change to or from NULL would be silently missed|||Với <>, phép so sánh dính NULL cho ra NULL (không phải đúng), nên một thay đổi từ hoặc sang NULL sẽ bị bỏ sót âm thầm',
              'IS DISTINCT FROM is faster|||IS DISTINCT FROM nhanh hơn',
              '<> does not work in PL/pgSQL|||<> không chạy được trong PL/pgSQL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A BEFORE ... FOR EACH ROW trigger function returns NULL. What happens to the INSERT?|||Một hàm trigger BEFORE ... FOR EACH ROW trả về NULL. Chuyện gì xảy ra với lệnh INSERT?',
            options: [
              'It raises an error|||Nó ném lỗi',
              'The operation is skipped entirely and silently — psql reports INSERT 0 0 and the row never exists|||Thao tác bị BỎ QUA hoàn toàn và ÂM THẦM — psql báo INSERT 0 0 và dòng đó chưa từng tồn tại',
              'The row is inserted with NULL columns|||Dòng được chèn với các cột NULL',
              'The transaction rolls back|||Giao dịch bị lùi lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which views can PostgreSQL write to automatically?|||PostgreSQL tự ghi được vào loại view nào?',
            options: [
              'All views|||Mọi view',
              'Views over a single table with no aggregation, DISTINCT, GROUP BY or set operation; aggregated views need an INSTEAD OF trigger|||View trên MỘT bảng, không tổng hợp, không DISTINCT, không GROUP BY, không phép toán tập hợp; view có tổng hợp thì cần trigger INSTEAD OF',
              'Only materialized views|||Chỉ materialized view',
              'No views are writable|||Không view nào ghi được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does REFRESH MATERIALIZED VIEW CONCURRENTLY require, and what does a plain REFRESH cost?|||REFRESH MATERIALIZED VIEW CONCURRENTLY đòi hỏi gì, và một lệnh REFRESH thường tốn cái gì?',
            options: [
              'Nothing special; a plain REFRESH is free|||Không cần gì đặc biệt; REFRESH thường thì miễn phí',
              'CONCURRENTLY requires a UNIQUE index with no WHERE clause on the matview; a plain REFRESH takes ACCESS EXCLUSIVE and blocks all readers for its whole duration|||CONCURRENTLY đòi một chỉ mục UNIQUE không có mệnh đề WHERE trên matview; REFRESH thường lấy khoá ACCESS EXCLUSIVE và chặn MỌI người đọc suốt thời gian nó chạy',
              'CONCURRENTLY requires a primary key on the base table; a plain REFRESH is non-blocking|||CONCURRENTLY đòi khoá chính trên bảng gốc; REFRESH thường thì không chặn',
              'Both need superuser|||Cả hai đều cần superuser',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
