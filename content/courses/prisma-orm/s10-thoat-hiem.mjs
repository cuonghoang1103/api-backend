/**
 * Prisma ORM — Chương 10: Cửa thoát hiểm — SQL thô và phần mở rộng client.
 * $queryRaw an toàn đối lại Unsafe · kiểu của kết quả thô là lời hứa suông · thứ chỉ SQL làm được ·
 * TypedSQL · $extends · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
import G10_1 from './giang/pr-10-1.mjs';
import G10_2 from './giang/pr-10-2.mjs';
import G10_3 from './giang/pr-10-3.mjs';
import G10_4 from './giang/pr-10-4.mjs';
import G10_5 from './giang/pr-10-5.mjs';
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Chapter 10 — Escape hatches: raw SQL and client extensions|||Chương 10 — Cửa thoát hiểm: SQL thô và phần mở rộng client',
  description: 'Khi trình sinh truy vấn hết đường: bốn hàm thô và cái nào mở cửa cho SQL injection, vì sao tham số kiểu của $queryRaw là lời hứa không ai kiểm, những thứ chỉ SQL viết nổi (window function, CTE đệ quy, ON CONFLICT, full-text), TypedSQL sinh kiểu thật từ file .sql, và $extends để thêm phương thức, trường tính toán và soft delete vào chính client.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — Four raw functions, and the one that lets an attacker in|||10.1 — Bốn hàm thô, và cái mở cửa cho kẻ tấn công',
      slug: 'pr-10-1-bon-ham-tho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Khác biệt giữa $queryRaw, $executeRaw và hai biến thể Unsafe; vì sao dấu backtick của thẻ mẫu là ranh giới an toàn thật sự; một cú SQL injection chạy thật trên bản Unsafe; và Prisma.sql với Prisma.join để dựng câu truy vấn động mà vẫn tham số hoá.',
      content: `
${G10_1}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Four raw functions, and the one that lets an attacker in</h2>
<p class="lead">Every ORM needs a door out. Prisma's has four handles, two of which are safe by construction and two of which are named <code>Unsafe</code> for a reason that this lesson demonstrates with a working attack. Learn the difference once and you never have to think about SQL injection in this codebase again.</p>

<h3>The four</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>$queryRaw</code></span><span class="v">A <strong>tagged template</strong>. Returns rows. Every interpolated value becomes a bind parameter. Safe.</span></div>
  <div class="kv"><span class="k"><code>$executeRaw</code></span><span class="v">A tagged template. Returns the <em>number of affected rows</em>, not the rows. For <code>UPDATE</code>, <code>DELETE</code>, <code>INSERT</code>, DDL. Safe.</span></div>
  <div class="kv"><span class="k"><code>$queryRawUnsafe</code></span><span class="v">Takes a <strong>plain string</strong> plus optional parameters. Whatever is in the string is sent as SQL. Unsafe unless you built the string from constants only.</span></div>
  <div class="kv"><span class="k"><code>$executeRawUnsafe</code></span><span class="v">Same, for statements. The one place it is genuinely needed: DDL where the table name is a variable — and that is exactly the case you must whitelist by hand.</span></div>
</div>
<pre><code class="language-sql"><span class="tok-comment">// Tagged template — note: NO parentheses after the function name</span>
const user = await prisma.$queryRaw&#96;
  SELECT id, username FROM "User" WHERE email = \${email}&#96;;

<span class="tok-comment">// String argument — note: parentheses. A completely different function.</span>
const user = await prisma.$queryRawUnsafe(
  &#96;SELECT id, username FROM "User" WHERE email = '\${email}'&#96;   <span class="tok-comment">// ← danger</span>
);</code></pre>
<div class="callout warn">
<p><strong>The difference is a pair of parentheses, and it is the whole security boundary.</strong> With the tagged template, JavaScript hands Prisma the string <em>pieces</em> and the values <em>separately</em>; Prisma emits <code>WHERE email = $1</code> and ships the value in the bind slot, where it can never be parsed as SQL. With <code>Unsafe</code>, the value has already been concatenated into the string by the time Prisma sees it — there is nothing left to protect. This is why the safe form has no parentheses: you cannot accidentally build the string first.</p>
</div>

<h3>What each one actually sends</h3>
<pre><code class="language-javascript">await prisma.$queryRaw&#96;SELECT id, username FROM users WHERE email = \${'u1@vd.vn'} AND deleted_at IS NULL&#96;;
const n = await prisma.$executeRaw&#96;UPDATE posts SET deleted_at = now() WHERE author_id = \${7}&#96;;
const x = await prisma.$executeRaw&#96;SELECT id FROM users WHERE id &lt;= \${3}&#96;;</code></pre>
<div class="out">prisma:query SELECT id, username FROM users WHERE email = $1 AND deleted_at IS NULL
prisma:query params: ["u1@vd.vn"]
prisma:query UPDATE posts SET deleted_at = now() WHERE author_id = $1
prisma:query params: [7]
$executeRaw UPDATE tra ve: 50
prisma:query SELECT id FROM users WHERE id &lt;= $1
prisma:query params: [3]
$executeRaw SELECT tra ve: 3 (mot con so, khong phai hang)</div>
<div class="pitfall">
<p><strong>Trap — <code>$executeRaw</code> returns a number, whatever the statement.</strong> For the SELECT it returned 3 — the row count, not the rows (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3, 2,000 users and 100,000 posts). <code>const rows = await prisma.$executeRaw&#96;SELECT …&#96;</code> compiles, runs and hands you a number.</p>
</div>

<h3>The attack, run for real</h3>
<pre><code class="language-javascript">const timUnsafe = (email: string) =&gt;
  prisma.$queryRawUnsafe(&#96;SELECT id, username FROM users WHERE email = '\${email}'&#96;);   <span class="tok-comment">// danger</span>
const timSafe = (email: string) =&gt;
  prisma.$queryRaw&#96;SELECT id, username FROM users WHERE email = \${email}&#96;;</code></pre>
<div class="out">email = "u1@vd.vn"       → $queryRawUnsafe:    1 hang · $queryRaw: 1 hang
email = "x' OR 1=1 --"   → $queryRawUnsafe: 2000 hang · $queryRaw: 0 hang
SQL that su chay (Unsafe): SELECT id, username FROM users WHERE email = 'x' OR 1=1 --'
cau ghep 2 lenh qua $queryRawUnsafe → P2010 Raw query failed. Code: &#96;42601&#96;. Message: &#96;ERROR: cannot insert multiple commands into a prepared statement&#96;
username cua user 1 sau do: user1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1</span><span class="v">The quote closes the literal: <code>'x'</code> ends where the attacker ends it, and everything after is SQL.</span></div>
  <div class="kv"><span class="k">2</span><span class="v"><code>OR 1=1</code> makes every row match: the search returned all 2,000 users.</span></div>
  <div class="kv"><span class="k">3</span><span class="v"><code>--</code> turns the leftover quote into a comment: valid SQL, no error in any log.</span></div>
  <div class="kv"><span class="k">4</span><span class="v">Stacking a second statement was refused (42601: one prepared statement cannot hold two commands) — but reading the whole table needed only one. Through <code>$queryRaw</code> the same input returned 0 rows.</span></div>
</div>
<p>If you must call the Unsafe function, pass values as parameters: <code>$queryRawUnsafe('… WHERE email = $1', email)</code> is still parameterised — the attack string returned 0 rows that way. The danger is only ever text you concatenated. Escaping quotes yourself is not the fix.</p>

<h3>Dynamic queries that stay parameterised</h3>
<pre><code class="language-javascript">const dk: Prisma.Sql[] = [Prisma.sql&#96;deleted_at IS NULL&#96;];
if (tuKhoa) dk.push(Prisma.sql&#96;content ILIKE \${'%' + tuKhoa + '%'}&#96;);
if (tacGia) dk.push(Prisma.sql&#96;author_id = \${tacGia}&#96;);
await prisma.$queryRaw&#96;SELECT id, title FROM posts WHERE \${Prisma.join(dk, ' AND ')} ORDER BY created_at DESC LIMIT \${3}&#96;;</code></pre>
<div class="out">ket qua: 94839, 88839, 82839
prisma:query SELECT id, title FROM posts WHERE deleted_at IS NULL AND content ILIKE $1 AND author_id = $2 ORDER BY created_at DESC LIMIT $3
prisma:query params: ["%prisma%",42,3]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Prisma.sql&#96;…&#96;</code></span><span class="v">A fragment carrying its own parameters; composing renumbers $1, $2 for you.</span></div>
  <div class="kv"><span class="k"><code>Prisma.join(list, sep)</code></span><span class="v">The separator is SQL text — a constant you wrote, never input.</span></div>
  <div class="kv"><span class="k"><code>Prisma.empty</code></span><span class="v">The zero-length fragment for an absent clause.</span></div>
  <div class="kv"><span class="k"><code>Prisma.raw('…')</code></span><span class="v">Text verbatim — for identifiers from your own allow-list only.</span></div>
</div>
<pre><code class="language-javascript">await prisma.$queryRaw&#96;… ORDER BY \${cot} ASC LIMIT 4&#96;;   <span class="tok-comment">// sends ORDER BY $1</span>
await prisma.$queryRaw&#96;… ORDER BY \${Prisma.raw(['title', 'created_at'].includes(cot) ? cot : 'id')} ASC LIMIT 4&#96;;</code></pre>
<div class="out">ORDER BY \${cot}            → Bai 98839 | Bai 96839 | Bai 94839 | Bai 92839 (khong loi, khong sap)
ORDER BY Prisma.raw(trang) → Bai 10839 | Bai 12839 | Bai 14839 | Bai 16839</div>
<div class="pitfall">
<p><strong>Trap — you cannot parameterise an identifier.</strong> <code>ORDER BY \${cot}</code> sends <code>ORDER BY $1</code> with "title" as a value: PostgreSQL sorts every row by the same constant — no error and no order. Whitelist the column and pass it through <code>Prisma.raw</code>.</p>
</div>
<div class="note-ct">
<p><strong>The habit that removes the whole class of bug — and where CuongThai stands.</strong> Grep for <code>RawUnsafe</code> in CI and fail the build on a new occurrence outside an allow-list. Measured on the CuongThai repository (read-only, 12 November 2026):</p>
<div class="out">$ grep -rn 'RawUnsafe' src | grep -v '\\.test\\.' | grep -v '\\.md:' | wc -l
      28
$ grep -rln 'RawUnsafe' src | grep -v '\\.test\\.' | grep -v '\\.md$' | wc -l
      10
$ grep -rln 'RawUnsafe' .github 2&gt;/dev/null | wc -l
       0</div>
<p>28 lines in 10 source files, and no workflow that checks them. Some are DDL with names from fixed lists; each deserves a reviewer who knows why — and a CI rule so the twenty-ninth is a decision, not an accident.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Prisma — raw queries</span><span class="lc-sub">prisma.io/docs · All four functions, with the safety notes stated plainly</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#tagged-templates" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">Prisma.sql, join, empty, raw</span><span class="lc-sub">prisma.io/docs · Composing fragments without losing parameterisation</span></span></a>
<a class="link-card" href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — SQL injection</span><span class="lc-sub">owasp.org · The attack catalogue, and why escaping is not the defence</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-prepare.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — PREPARE</span><span class="lc-sub">postgresql.org · What a bind parameter is at the protocol level</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Break the unsafe endpoint yourself, then rewrite it with Prisma.sql and Prisma.join</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Bốn hàm thô, và cái mở cửa cho kẻ tấn công</h2>
<p class="lead">Mọi ORM đều cần một cánh cửa thoát ra ngoài. Cửa của Prisma có bốn tay nắm: hai cái an toàn ngay từ cấu tạo, hai cái mang chữ <code>Unsafe</code> vì một lý do mà bài này sẽ chứng minh bằng một cú tấn công chạy được thật. Học một lần cái khác biệt đó, và bạn không phải nghĩ tới SQL injection trong kho mã này nữa.</p>

<h3>Bốn hàm</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>$queryRaw</code></span><span class="v">Một <strong>thẻ mẫu</strong> (tagged template). Trả về các hàng. Mọi giá trị nội suy đều thành tham số ràng buộc. AN TOÀN.</span></div>
  <div class="kv"><span class="k"><code>$executeRaw</code></span><span class="v">Thẻ mẫu. Trả về <em>số hàng bị ảnh hưởng</em>, không trả các hàng. Dùng cho <code>UPDATE</code>, <code>DELETE</code>, <code>INSERT</code>, DDL. AN TOÀN.</span></div>
  <div class="kv"><span class="k"><code>$queryRawUnsafe</code></span><span class="v">Nhận một <strong>chuỗi thường</strong> cộng tham số tuỳ chọn. Trong chuỗi có gì thì gửi đi làm SQL đúng thứ ấy. KHÔNG an toàn, trừ khi bạn dựng chuỗi hoàn toàn từ hằng.</span></div>
  <div class="kv"><span class="k"><code>$executeRawUnsafe</code></span><span class="v">Tương tự, cho câu lệnh. Chỗ nó thật sự cần thiết: DDL với tên bảng là biến — và đó đúng là trường hợp bạn PHẢI tự lập danh sách trắng.</span></div>
</div>
<pre><code class="language-sql"><span class="tok-comment">// Thẻ mẫu — chú ý: KHÔNG có dấu ngoặc sau tên hàm</span>
const user = await prisma.$queryRaw&#96;
  SELECT id, username FROM "User" WHERE email = \${email}&#96;;

<span class="tok-comment">// Đối số là chuỗi — chú ý: CÓ dấu ngoặc. Một hàm hoàn toàn khác.</span>
const user = await prisma.$queryRawUnsafe(
  &#96;SELECT id, username FROM "User" WHERE email = '\${email}'&#96;   <span class="tok-comment">// ← nguy hiểm</span>
);</code></pre>
<div class="callout warn">
<p><strong>Khác biệt là MỘT CẶP DẤU NGOẶC, và nó chính là toàn bộ ranh giới bảo mật.</strong> Với thẻ mẫu, JavaScript trao cho Prisma các <em>mẩu chuỗi</em> và các <em>giá trị</em> RIÊNG RA; Prisma phát ra <code>WHERE email = $1</code> rồi gửi giá trị qua ô ràng buộc, nơi nó không bao giờ được phân tích thành SQL. Với <code>Unsafe</code>, giá trị ĐÃ được nối vào chuỗi trước khi Prisma kịp nhìn thấy — chẳng còn gì để bảo vệ. Đó là lý do dạng an toàn KHÔNG có dấu ngoặc: bạn không thể vô tình dựng chuỗi trước.</p>
</div>

<h3>Mỗi cái THẬT SỰ gửi đi cái gì</h3>
<pre><code class="language-javascript">await prisma.$queryRaw&#96;SELECT id, username FROM users WHERE email = \${'u1@vd.vn'} AND deleted_at IS NULL&#96;;
const n = await prisma.$executeRaw&#96;UPDATE posts SET deleted_at = now() WHERE author_id = \${7}&#96;;
const x = await prisma.$executeRaw&#96;SELECT id FROM users WHERE id &lt;= \${3}&#96;;</code></pre>
<div class="out">prisma:query SELECT id, username FROM users WHERE email = $1 AND deleted_at IS NULL
prisma:query params: ["u1@vd.vn"]
prisma:query UPDATE posts SET deleted_at = now() WHERE author_id = $1
prisma:query params: [7]
$executeRaw UPDATE tra ve: 50
prisma:query SELECT id FROM users WHERE id &lt;= $1
prisma:query params: [3]
$executeRaw SELECT tra ve: 3 (mot con so, khong phai hang)</div>
<div class="pitfall">
<p><strong>Bẫy — <code>$executeRaw</code> trả về một con số, bất kể câu lệnh là gì.</strong> Với SELECT nó trả về 3 — số hàng, không phải các hàng (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3, 2.000 người dùng và 100.000 bài). <code>const rows = await prisma.$executeRaw&#96;SELECT …&#96;</code> biên dịch được, chạy được, và đưa bạn một con số.</p>
</div>

<h3>Cú tấn công, chạy thật</h3>
<pre><code class="language-javascript">const timUnsafe = (email: string) =&gt;
  prisma.$queryRawUnsafe(&#96;SELECT id, username FROM users WHERE email = '\${email}'&#96;);   <span class="tok-comment">// nguy hiểm</span>
const timSafe = (email: string) =&gt;
  prisma.$queryRaw&#96;SELECT id, username FROM users WHERE email = \${email}&#96;;</code></pre>
<div class="out">email = "u1@vd.vn"       → $queryRawUnsafe:    1 hang · $queryRaw: 1 hang
email = "x' OR 1=1 --"   → $queryRawUnsafe: 2000 hang · $queryRaw: 0 hang
SQL that su chay (Unsafe): SELECT id, username FROM users WHERE email = 'x' OR 1=1 --'
cau ghep 2 lenh qua $queryRawUnsafe → P2010 Raw query failed. Code: &#96;42601&#96;. Message: &#96;ERROR: cannot insert multiple commands into a prepared statement&#96;
username cua user 1 sau do: user1</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1</span><span class="v">Dấu nháy đóng chuỗi: <code>'x'</code> kết thúc đúng chỗ kẻ tấn công muốn, phần sau là SQL.</span></div>
  <div class="kv"><span class="k">2</span><span class="v"><code>OR 1=1</code> khiến mọi hàng khớp: câu tìm trả về cả 2.000 người dùng.</span></div>
  <div class="kv"><span class="k">3</span><span class="v"><code>--</code> biến dấu nháy còn thừa thành chú thích: SQL hợp lệ, không lỗi nào trong log.</span></div>
  <div class="kv"><span class="k">4</span><span class="v">Ghép thêm câu lệnh thứ hai bị từ chối (42601: một prepared statement không chứa được hai lệnh) — nhưng đọc trộm cả bảng chỉ cần một. Qua <code>$queryRaw</code> cùng chuỗi đó trả về 0 hàng.</span></div>
</div>
<p>Nếu buộc phải gọi hàm Unsafe, hãy truyền giá trị thành tham số: <code>$queryRawUnsafe('… WHERE email = $1', email)</code> vẫn được tham số hoá — chuỗi tấn công trả về 0 hàng theo cách đó. Nguy hiểm chỉ nằm ở chữ bạn tự ghép. Tự thoát dấu nháy không phải là cách sửa.</p>

<h3>Truy vấn động mà vẫn tham số hoá</h3>
<pre><code class="language-javascript">const dk: Prisma.Sql[] = [Prisma.sql&#96;deleted_at IS NULL&#96;];
if (tuKhoa) dk.push(Prisma.sql&#96;content ILIKE \${'%' + tuKhoa + '%'}&#96;);
if (tacGia) dk.push(Prisma.sql&#96;author_id = \${tacGia}&#96;);
await prisma.$queryRaw&#96;SELECT id, title FROM posts WHERE \${Prisma.join(dk, ' AND ')} ORDER BY created_at DESC LIMIT \${3}&#96;;</code></pre>
<div class="out">ket qua: 94839, 88839, 82839
prisma:query SELECT id, title FROM posts WHERE deleted_at IS NULL AND content ILIKE $1 AND author_id = $2 ORDER BY created_at DESC LIMIT $3
prisma:query params: ["%prisma%",42,3]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Prisma.sql&#96;…&#96;</code></span><span class="v">Một mảnh mang theo tham số của nó; ghép lại thì $1, $2 được đánh số giúp bạn.</span></div>
  <div class="kv"><span class="k"><code>Prisma.join(list, sep)</code></span><span class="v">Dấu nối là chữ SQL — hằng số bạn tự viết, không bao giờ là dữ liệu vào.</span></div>
  <div class="kv"><span class="k"><code>Prisma.empty</code></span><span class="v">Mảnh rỗng cho mệnh đề vắng mặt.</span></div>
  <div class="kv"><span class="k"><code>Prisma.raw('…')</code></span><span class="v">Chèn nguyên chữ — chỉ cho tên cột từ danh sách trắng của chính bạn.</span></div>
</div>
<pre><code class="language-javascript">await prisma.$queryRaw&#96;… ORDER BY \${cot} ASC LIMIT 4&#96;;   <span class="tok-comment">// gửi ORDER BY $1</span>
await prisma.$queryRaw&#96;… ORDER BY \${Prisma.raw(['title', 'created_at'].includes(cot) ? cot : 'id')} ASC LIMIT 4&#96;;</code></pre>
<div class="out">ORDER BY \${cot}            → Bai 98839 | Bai 96839 | Bai 94839 | Bai 92839 (khong loi, khong sap)
ORDER BY Prisma.raw(trang) → Bai 10839 | Bai 12839 | Bai 14839 | Bai 16839</div>
<div class="pitfall">
<p><strong>Bẫy — không thể tham số hoá một tên cột.</strong> <code>ORDER BY \${cot}</code> gửi <code>ORDER BY $1</code> với "title" là một giá trị: PostgreSQL sắp mọi hàng theo cùng một hằng số — không lỗi và không thứ tự. Lập danh sách trắng cho cột rồi đưa qua <code>Prisma.raw</code>.</p>
</div>
<div class="note-ct">
<p><strong>Thói quen xoá cả lớp lỗi — và CuongThai đang ở đâu.</strong> Grep <code>RawUnsafe</code> trong CI và đánh đỏ bản dựng khi có chỗ mới ngoài danh sách được phép. Đo trên repo CuongThai (chỉ đọc, 12/11/2026):</p>
<div class="out">$ grep -rn 'RawUnsafe' src | grep -v '\\.test\\.' | grep -v '\\.md:' | wc -l
      28
$ grep -rln 'RawUnsafe' src | grep -v '\\.test\\.' | grep -v '\\.md$' | wc -l
      10
$ grep -rln 'RawUnsafe' .github 2&gt;/dev/null | wc -l
       0</div>
<p>28 dòng trong 10 tệp nguồn, và không workflow nào kiểm chúng. Một số là DDL với tên từ danh sách cố định; mỗi chỗ cần một người soát hiểu lý do — và một luật CI để chỗ thứ hai mươi chín là một quyết định, không phải một tai nạn.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries" target="_blank" rel="noopener"><span class="lc-ico">🧱</span><span class="lc-body"><span class="lc-title">Prisma — truy vấn thô</span><span class="lc-sub">prisma.io/docs · Cả bốn hàm, kèm ghi chú an toàn nói thẳng</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#tagged-templates" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">Prisma.sql, join, empty, raw</span><span class="lc-sub">prisma.io/docs · Ghép mẩu câu mà không mất tính tham số hoá</span></span></a>
<a class="link-card" href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">OWASP — SQL injection</span><span class="lc-sub">owasp.org · Danh mục các cú tấn công, và vì sao thoát ký tự không phải cách phòng</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-prepare.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — PREPARE</span><span class="lc-sub">postgresql.org · Tham số ràng buộc là gì ở mức giao thức</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Tự tay phá cái endpoint không an toàn, rồi viết lại bằng Prisma.sql và Prisma.join</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — The type parameter on $queryRaw is a promise nobody checks|||10.2 — Tham số kiểu của $queryRaw là lời hứa không ai kiểm',
      slug: 'pr-10-2-kieu-la-loi-hua',
      type: 'LESSON',
      description: 'Vì sao $queryRaw<User[]> chỉ là một phép ép kiểu chứ không phải phép kiểm, những cú ánh xạ kiểu làm ngã người (BigInt vỡ JSON, Decimal, numeric thành chuỗi), việc @map buộc bạn viết tên CỘT chứ không phải tên trường, và cách kiểm ở biên bằng zod.',
      content: `
${G10_2}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>The type parameter on <code>$queryRaw</code> is a promise nobody checks</h2>
<p class="lead">Once you leave the query builder you also leave the type system — not obviously, which is the problem. <code>$queryRaw&lt;User[]&gt;</code> compiles into a plain cast, so TypeScript will happily let you read a field the query never selected. This lesson shows exactly where the guarantee stops, the four value conversions that surprise people, and how to put a real check back at the boundary.</p>

<h3>What the generic actually does</h3>
<pre><code class="language-javascript">const users = await prisma.$queryRaw&lt;User[]&gt;&#96;SELECT id FROM users LIMIT 3&#96;;
console.log('users[0] =', users[0]);
users[0].email.toLowerCase();   <span class="tok-comment">// tsc: fine</span></code></pre>
<div class="out">users[0] = { id: 1 }
users[0].email.toLowerCase() → TypeError: Cannot read properties of undefined (reading 'toLowerCase')</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Builder: types derived</span><span class="v"><code>findMany({ select: { id: true } })</code> returns <code>{ id: number }[]</code>; ask for <code>.email</code> and the compiler stops you.</span></div>
  <div class="kv"><span class="k">Raw: types asserted</span><span class="v"><code>$queryRaw&lt;T&gt;</code> is a cast. Nothing reads the SQL string to check it — not at build, not at run.</span></div>
  <div class="kv"><span class="k">The drift</span><span class="v">A migration renames a column: every builder query becomes a compile error, every raw query still compiles.</span></div>
  <div class="kv"><span class="k">The fixes</span><span class="v">Validate at the boundary with a schema (below), or let the database type the query with TypedSQL (Lesson 10.4).</span></div>
</div>

<h3>Conversion 1 — <code>count(*)</code> is a BigInt, and it breaks <code>res.json</code></h3>
<pre><code class="language-sql">SELECT author_id, count(*) AS post_count FROM posts GROUP BY author_id;
SELECT author_id, count(*)::int AS post_count FROM posts GROUP BY author_id;</code></pre>
<div class="out">{ author_id: 1, post_count: 50n }
JSON.stringify(rows) → TypeError: Do not know how to serialize a BigInt
voi ::int → { author_id: 1, post_count: 50 }</div>
<p>Measured (measured 12 Nov 2026, Apple-silicon laptop, PostgreSQL 16.14 in Docker, Prisma 6.19.3): the driver returned <code>50n</code> and <code>JSON.stringify</code> — what <code>res.json</code> calls — threw. Cast in SQL, once, rather than <code>Number()</code> at every call site.</p>

<h3>Conversion 2 — <code>Decimal</code> stays a Decimal object</h3>
<pre><code class="language-javascript">const rows = await prisma.$queryRaw&lt;any[]&gt;&#96;SELECT id, price FROM orders ORDER BY id&#96;;
console.log(rows[0].price, typeof rows[0].price, rows[0].price.constructor.name);
console.log('price + 100 =', rows[0].price + 100);
console.log('price.plus(100).toString() =', rows[0].price.plus(100).toString());
rows[2].price.plus('0.20').toString();   rows[2].price.toNumber() + 0.2;</code></pre>
<div class="out">249000 object i
price + 100 = 249000100
price.plus(100).toString() = 249100
0.10 + 0.20 bang Decimal = 0.3 · bang number = 0.30000000000000004</div>
<div class="pitfall">
<p><strong>Trap — Decimal + number is a silent string concatenation.</strong> <code>console.log</code> prints the Decimal as 249000, so it looks like a number; <code>+</code> then falls back to strings and gives "249000100". Use <code>plus()</code>, or convert deliberately — <code>toNumber()</code> brings float error back (0.30000000000000004).</p>
</div>

<h3>Conversion 3 — raw queries use <em>column</em> names, not field names</h3>
<pre><code class="language-javascript">model User {
  avatarUrl String? @map("avatar_url")
  @@map("users")
}</code></pre>
<div class="out">SELECT "avatarUrl" FROM "User" → PrismaClientKnownRequestError: P2010 Raw query failed. Code: &#96;42P01&#96;. Message: &#96;relation "User" does not exist&#96;
SELECT "avatarUrl" FROM users → PrismaClientKnownRequestError: P2010 Raw query failed. Code: &#96;42703&#96;. Message: &#96;column "avatarUrl" does not exist&#96;
SELECT id, avatar_url FROM users → [ { id: 1, avatar_url: 'https://cdn.vd/a/1.png' } ]
… AS "avatarUrl" → [ { id: 1, avatarUrl: 'https://cdn.vd/a/1.png' } ]
… AS avatarUrl (khong ngoac kep) → [ { id: 1, avatarurl: 'https://cdn.vd/a/1.png' } ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The error is the good case</span><span class="v">"User" (42P01) and "avatarUrl" (42703) do not exist in PostgreSQL — <code>@map</code> and <code>@@map</code> do not apply to raw SQL.</span></div>
  <div class="kv"><span class="k">Alias back, with quotes</span><span class="v"><code>avatar_url AS "avatarUrl"</code> keeps one vocabulary. Without the quotes PostgreSQL folded it to <code>avatarurl</code>.</span></div>
</div>

<h3>Conversion 4 — what else raw SQL bypasses</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Client extensions</span><span class="v">A soft-delete filter in an extension does not touch raw SQL (measured in Lesson 10.5).</span></div>
  <div class="kv"><span class="k">Prisma-side defaults</span><span class="v"><code>@default(uuid())</code> and <code>@updatedAt</code> are filled by the client, not the database, unless the migration also created a database default.</span></div>
  <div class="kv"><span class="k">Not transactions</span><span class="v"><code>tx.$executeRaw</code> inside an interactive transaction runs in it — measured below.</span></div>
</div>
<pre><code class="language-javascript">await prisma.$transaction(async (tx) =&gt; {
  await tx.$executeRaw&#96;LOCK TABLE orders IN SHARE ROW EXCLUSIVE MODE&#96;;
  const o = await tx.order.findUniqueOrThrow({ where: { id: 1 } });
  await tx.order.update({ where: { id: 1 }, data: { price: o.price.plus(1) } });
});</code></pre>
<div class="out">trong cung giao dich: khoa ShareRowExclusiveLock · gia moi 249001</div>

<h3>Putting a real check back</h3>
<pre><code class="language-javascript">import { z } from 'zod';
const StatsRow = z.object({ author_id: z.number().int(), post_count: z.number().int(), gan_nhat: z.date() });
const rows = StatsRow.array().parse(await prisma.$queryRaw&#96;
  SELECT author_id, count(*)::int AS post_count, max(created_at) AS gan_nhat FROM posts GROUP BY author_id&#96;);</code></pre>
<div class="out">parse khong ep kieu → ZodError: {"code":"invalid_type","expected":"number","received":"bigint","path":[0,"post_count"],"message":"Expected number, received bigint"}
parse voi ::int → [
  { author_id: 1, post_count: 50, gan_nhat: 2026-03-11T10:40:00.000Z },
  { author_id: 2, post_count: 50, gan_nhat: 2026-03-11T05:19:00.000Z }
]</div>
<p>The type is inferred from the schema and verified on every call. Forget the <code>::int</code> and zod says exactly where: expected number, received bigint, at <code>post_count</code>.</p>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#type-mapping" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Prisma — raw query type mapping</span><span class="lc-sub">prisma.io/docs · The full table of PostgreSQL type → JavaScript value</span></span></a>
<a class="link-card" href="https://github.com/MikeMcl/decimal.js/" target="_blank" rel="noopener"><span class="lc-ico">💯</span><span class="lc-body"><span class="lc-title">decimal.js</span><span class="lc-sub">github.com · The Decimal implementation Prisma ships, and its arithmetic methods</span></span></a>
<a class="link-card" href="https://zod.dev/" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">Zod</span><span class="lc-sub">zod.dev · Schema-first validation whose inferred types replace the cast</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">PostgreSQL — identifiers and case folding</span><span class="lc-sub">postgresql.org · Why an unquoted identifier becomes lower case</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Take a raw query that lies about its type, make it fail loudly, then fix it two ways</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Tham số kiểu của <code>$queryRaw</code> là lời hứa không ai kiểm</h2>
<p class="lead">Rời khỏi trình dựng truy vấn là bạn cũng rời khỏi hệ kiểu — mà rời một cách KHÔNG lộ liễu, đó mới là vấn đề. <code>$queryRaw&lt;User[]&gt;</code> biên dịch thành một phép ép kiểu trần, nên TypeScript vui vẻ để bạn đọc một trường mà câu truy vấn chưa từng chọn. Bài này chỉ đúng chỗ bảo đảm ngừng lại, bốn cú chuyển đổi giá trị làm người ta ngã, và cách đặt một phép kiểm THẬT trở lại ở biên.</p>

<h3>Cái generic đó THẬT SỰ làm gì</h3>
<pre><code class="language-javascript">const users = await prisma.$queryRaw&lt;User[]&gt;&#96;SELECT id FROM users LIMIT 3&#96;;
console.log('users[0] =', users[0]);
users[0].email.toLowerCase();   <span class="tok-comment">// tsc: ổn</span></code></pre>
<div class="out">users[0] = { id: 1 }
users[0].email.toLowerCase() → TypeError: Cannot read properties of undefined (reading 'toLowerCase')</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Builder: kiểu được suy ra</span><span class="v"><code>findMany({ select: { id: true } })</code> trả về <code>{ id: number }[]</code>; đòi <code>.email</code> là trình biên dịch chặn.</span></div>
  <div class="kv"><span class="k">Thô: kiểu được khẳng định</span><span class="v"><code>$queryRaw&lt;T&gt;</code> là một phép ép kiểu. Không gì đọc chuỗi SQL để kiểm — lúc build cũng không, lúc chạy cũng không.</span></div>
  <div class="kv"><span class="k">Trôi dạt</span><span class="v">Một migration đổi tên cột: mọi truy vấn builder thành lỗi biên dịch, mọi truy vấn thô vẫn biên dịch.</span></div>
  <div class="kv"><span class="k">Cách sửa</span><span class="v">Kiểm ở biên bằng một lược đồ (bên dưới), hoặc để chính cơ sở dữ liệu định kiểu bằng TypedSQL (Bài 10.4).</span></div>
</div>

<h3>Chuyển đổi 1 — <code>count(*)</code> là BigInt, và nó làm vỡ <code>res.json</code></h3>
<pre><code class="language-sql">SELECT author_id, count(*) AS post_count FROM posts GROUP BY author_id;
SELECT author_id, count(*)::int AS post_count FROM posts GROUP BY author_id;</code></pre>
<div class="out">{ author_id: 1, post_count: 50n }
JSON.stringify(rows) → TypeError: Do not know how to serialize a BigInt
voi ::int → { author_id: 1, post_count: 50 }</div>
<p>Đo thật (đo ngày 12/11/2026, laptop Apple silicon, PostgreSQL 16.14 trong Docker, Prisma 6.19.3): trình điều khiển trả <code>50n</code> và <code>JSON.stringify</code> — thứ <code>res.json</code> gọi — ném lỗi. Ép kiểu trong SQL, một lần, thay vì <code>Number()</code> ở mọi chỗ gọi.</p>

<h3>Chuyển đổi 2 — <code>Decimal</code> vẫn là một object Decimal</h3>
<pre><code class="language-javascript">const rows = await prisma.$queryRaw&lt;any[]&gt;&#96;SELECT id, price FROM orders ORDER BY id&#96;;
console.log(rows[0].price, typeof rows[0].price, rows[0].price.constructor.name);
console.log('price + 100 =', rows[0].price + 100);
console.log('price.plus(100).toString() =', rows[0].price.plus(100).toString());
rows[2].price.plus('0.20').toString();   rows[2].price.toNumber() + 0.2;</code></pre>
<div class="out">249000 object i
price + 100 = 249000100
price.plus(100).toString() = 249100
0.10 + 0.20 bang Decimal = 0.3 · bang number = 0.30000000000000004</div>
<div class="pitfall">
<p><strong>Bẫy — Decimal + number là phép nối chuỗi âm thầm.</strong> <code>console.log</code> in Decimal ra 249000, trông như một số; rồi <code>+</code> quay về chuỗi và cho "249000100". Dùng <code>plus()</code>, hoặc đổi có chủ đích — <code>toNumber()</code> mang lỗi số thực trở lại (0.30000000000000004).</p>
</div>

<h3>Chuyển đổi 3 — truy vấn thô dùng tên <em>CỘT</em>, không phải tên TRƯỜNG</h3>
<pre><code class="language-javascript">model User {
  avatarUrl String? @map("avatar_url")
  @@map("users")
}</code></pre>
<div class="out">SELECT "avatarUrl" FROM "User" → PrismaClientKnownRequestError: P2010 Raw query failed. Code: &#96;42P01&#96;. Message: &#96;relation "User" does not exist&#96;
SELECT "avatarUrl" FROM users → PrismaClientKnownRequestError: P2010 Raw query failed. Code: &#96;42703&#96;. Message: &#96;column "avatarUrl" does not exist&#96;
SELECT id, avatar_url FROM users → [ { id: 1, avatar_url: 'https://cdn.vd/a/1.png' } ]
… AS "avatarUrl" → [ { id: 1, avatarUrl: 'https://cdn.vd/a/1.png' } ]
… AS avatarUrl (khong ngoac kep) → [ { id: 1, avatarurl: 'https://cdn.vd/a/1.png' } ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Lỗi là trường hợp tốt</span><span class="v">"User" (42P01) và "avatarUrl" (42703) không tồn tại trong PostgreSQL — <code>@map</code> và <code>@@map</code> không áp dụng cho SQL thô.</span></div>
  <div class="kv"><span class="k">Đặt bí danh lại, có ngoặc kép</span><span class="v"><code>avatar_url AS "avatarUrl"</code> giữ một bộ từ vựng. Thiếu ngoặc kép, PostgreSQL hạ nó thành <code>avatarurl</code>.</span></div>
</div>

<h3>Chuyển đổi 4 — SQL thô còn đi vòng qua những gì nữa</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Client extension</span><span class="v">Bộ lọc xoá mềm trong extension không chạm tới SQL thô (đo ở Bài 10.5).</span></div>
  <div class="kv"><span class="k">Giá trị mặc định phía Prisma</span><span class="v"><code>@default(uuid())</code> và <code>@updatedAt</code> do client điền, không phải cơ sở dữ liệu, trừ khi migration cũng tạo giá trị mặc định ở cơ sở dữ liệu.</span></div>
  <div class="kv"><span class="k">Không đi vòng giao dịch</span><span class="v"><code>tx.$executeRaw</code> trong giao dịch tương tác chạy trong chính giao dịch ấy — đo ở dưới.</span></div>
</div>
<pre><code class="language-javascript">await prisma.$transaction(async (tx) =&gt; {
  await tx.$executeRaw&#96;LOCK TABLE orders IN SHARE ROW EXCLUSIVE MODE&#96;;
  const o = await tx.order.findUniqueOrThrow({ where: { id: 1 } });
  await tx.order.update({ where: { id: 1 }, data: { price: o.price.plus(1) } });
});</code></pre>
<div class="out">trong cung giao dich: khoa ShareRowExclusiveLock · gia moi 249001</div>

<h3>Đặt một phép kiểm THẬT trở lại</h3>
<pre><code class="language-javascript">import { z } from 'zod';
const StatsRow = z.object({ author_id: z.number().int(), post_count: z.number().int(), gan_nhat: z.date() });
const rows = StatsRow.array().parse(await prisma.$queryRaw&#96;
  SELECT author_id, count(*)::int AS post_count, max(created_at) AS gan_nhat FROM posts GROUP BY author_id&#96;);</code></pre>
<div class="out">parse khong ep kieu → ZodError: {"code":"invalid_type","expected":"number","received":"bigint","path":[0,"post_count"],"message":"Expected number, received bigint"}
parse voi ::int → [
  { author_id: 1, post_count: 50, gan_nhat: 2026-03-11T10:40:00.000Z },
  { author_id: 2, post_count: 50, gan_nhat: 2026-03-11T05:19:00.000Z }
]</div>
<p>Kiểu suy ra từ lược đồ và được kiểm ở mọi lần gọi. Quên <code>::int</code> thì zod nói đúng chỗ: cần number, nhận bigint, tại <code>post_count</code>.</p>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#type-mapping" target="_blank" rel="noopener"><span class="lc-ico">🔁</span><span class="lc-body"><span class="lc-title">Prisma — ánh xạ kiểu trong truy vấn thô</span><span class="lc-sub">prisma.io/docs · Bảng đầy đủ kiểu PostgreSQL → giá trị JavaScript</span></span></a>
<a class="link-card" href="https://github.com/MikeMcl/decimal.js/" target="_blank" rel="noopener"><span class="lc-ico">💯</span><span class="lc-body"><span class="lc-title">decimal.js</span><span class="lc-sub">github.com · Bản cài đặt Decimal mà Prisma đóng gói kèm, và các phương thức số học của nó</span></span></a>
<a class="link-card" href="https://zod.dev/" target="_blank" rel="noopener"><span class="lc-ico">✅</span><span class="lc-body"><span class="lc-title">Zod</span><span class="lc-sub">zod.dev · Kiểm theo lược đồ, và kiểu suy ra từ nó thay thế luôn phép ép kiểu</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">PostgreSQL — định danh và hạ chữ thường</span><span class="lc-sub">postgresql.org · Vì sao một định danh không nháy thành chữ thường</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Lấy một truy vấn thô đang nói dối về kiểu của nó, bắt nó chết ồn ào, rồi vá theo hai cách</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Five things only SQL can say|||10.3 — Năm thứ chỉ SQL nói được',
      slug: 'pr-10-3-chi-sql-noi-duoc',
      type: 'LESSON',
      description: 'Top-N mỗi nhóm bằng LATERAL, xếp hạng và tổng luỹ tiến bằng window function, cây bình luận bằng CTE đệ quy, ON CONFLICT DO UPDATE có biểu thức mà upsert không diễn đạt nổi, và tìm kiếm toàn văn với ts_rank — kèm phần nói rõ khi nào ĐỪNG dùng SQL thô.',
      content: `
${G10_3}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Five things only SQL can say</h2>
<p class="lead">Prisma's query builder covers the shapes an application asks for ninety-five times out of a hundred. These are five of the other five: each one is a single SQL statement, each one is either impossible or catastrophically slow through the builder, and each one shows up in a real product sooner than you expect.</p>

<h3>1. Top-N per group — the query the builder cannot express</h3>
<pre><code class="language-sql">SELECT u.id, p.id AS post_id, p.created_at
FROM users u
CROSS JOIN LATERAL (
  SELECT id, created_at FROM posts
  WHERE author_id = u.id AND deleted_at IS NULL
  ORDER BY created_at DESC LIMIT 3
) p
WHERE u.id = ANY($1);</code></pre>
<div class="out">vong lap 50 findMany      → 150 hang · 50 truy van · 36.1 ms
include posts take 3      → 150 hang · 2 truy van · 6.0 ms
LATERAL                   → 150 hang · 1 truy van · 1.1 ms
row_number() &lt;= 3         → 150 hang · 1 truy van · 3.0 ms
include take 3 sends: SELECT … FROM "users" WHERE "users"."id" IN ($1 … $50) OFFSET $51 ; SELECT … FROM "posts" WHERE "posts"."author_id" IN ($1 … $50) ORDER BY "posts"."created_at" DESC OFFSET $51</div>
<div class="kv-grid">
  <div class="kv"><span class="k">include with take is not per-parent in SQL</span><span class="v">Its second query reads every post of the fifty authors, ordered, and the query engine keeps three each — two queries, but far more rows than needed (measured 12 Nov 2026, PostgreSQL 16.14 in Docker, Prisma 6.19.3, 2,000 users and 100,000 posts, median of 5).</span></div>
  <div class="kv"><span class="k">LATERAL</span><span class="v">A subquery evaluated per outer row, with its own LIMIT, running on the (author_id, created_at DESC) index inside PostgreSQL. One query, the fastest here.</span></div>
  <div class="kv"><span class="k">row_number()</span><span class="v">Correct, and slower here: it ranks every matching row before filtering to three.</span></div>
</div>

<h3>2. Window functions — rank, running total, and the previous row</h3>
<pre><code class="language-sql">SELECT u.username, count(p.id)::int AS post_count,
  rank()       OVER (ORDER BY count(p.id) DESC) AS hang,
  dense_rank() OVER (ORDER BY count(p.id) DESC) AS hang_lien,
  sum(count(p.id)) OVER (ORDER BY count(p.id) DESC, u.id) AS luy_tien,
  lag(u.username)  OVER (ORDER BY count(p.id) DESC, u.id) AS nguoi_tren
FROM users u LEFT JOIN posts p ON p.author_id = u.id AND p.deleted_at IS NULL
GROUP BY u.id, u.username ORDER BY post_count DESC;</code></pre>
<div class="out">┌─────────┬──────────┬────────────┬──────┬───────────┬──────────┬────────────┐
│ (index) │ username │ post_count │ hang │ hang_lien │ luy_tien │ nguoi_tren │
├─────────┼──────────┼────────────┼──────┼───────────┼──────────┼────────────┤
│ 0       │ 'user1'  │ 50         │ 1    │ 1         │ 50       │ null       │
│ 1       │ 'user2'  │ 41         │ 2    │ 2         │ 91       │ 'user1'    │
│ 2       │ 'user3'  │ 29         │ 3    │ 3         │ 120      │ 'user2'    │
│ 3       │ 'user4'  │ 29         │ 3    │ 3         │ 149      │ 'user3'    │
│ 4       │ 'user7'  │ 15         │ 5    │ 4         │ 164      │ 'user4'    │
│ 5       │ 'user8'  │ 10         │ 6    │ 5         │ 174      │ 'user7'    │
└─────────┴──────────┴────────────┴──────┴───────────┴──────────┴────────────┘</div>
<p>A window function computes across rows and keeps every row. With a tie at 29, <code>rank()</code> gave 3, 3 and then 5, while <code>dense_rank()</code> gave 3, 3, 4; <code>sum(…) OVER</code> accumulated and <code>lag()</code> read the previous row. <code>groupBy</code> can count — it cannot rank, accumulate or look back.</p>

<h3>3. A recursive CTE — the comment tree in one query</h3>
<pre><code class="language-sql">WITH RECURSIVE tree AS (
  SELECT id, content, parent_id, 0 AS do_sau, ARRAY[id] AS path
  FROM comments WHERE post_id = 1 AND parent_id IS NULL
  UNION ALL
  SELECT c.id, c.content, c.parent_id, tree.do_sau + 1, tree.path || c.id
  FROM comments c JOIN tree ON c.parent_id = tree.id
  WHERE tree.do_sau &lt; 10          -- depth guard, always
)
SELECT id, do_sau, content FROM tree ORDER BY path;</code></pre>
<div class="out">┌─────────┬────┬────────┬──────────────────────────────────────────────┐
│ (index) │ id │ do_sau │ content                                      │
├─────────┼────┼────────┼──────────────────────────────────────────────┤
│ 0       │ 1  │ 0      │ 'Bai viet hay'                               │
│ 1       │ 3  │ 1      │ '  Dong y'                                   │
│ 2       │ 4  │ 2      │ '    Minh cung nghi vay'                     │
│ 3       │ 5  │ 3      │ '      Chinh xac'                            │
│ 4       │ 6  │ 4      │ '        Tang 5 — include 3 tang khong thay' │
│ 5       │ 2  │ 0      │ 'Cho hoi phan 2 khi nao ra?'                 │
└─────────┴────┴────────┴──────────────────────────────────────────────┘

-- the builder, four levels of nested include
include 4 tang (goc + 3): {"content":"Bai viet hay","replies":[{"content":"Dong y","replies":[{"content":"Minh cung nghi vay","replies":[{"content":"Chinh xac"}]}]}]}</div>
<div class="pitfall">
<p><strong>Trap — a recursive CTE without a depth guard runs forever on a cycle.</strong> Measured: one comment re-parented under its own descendant made a cycle. With the guard the query returned 11 rows and stopped at depth 10; without it, it ran until <code>statement_timeout</code> cancelled it:</p>
<div class="out">co vong + chan do sau 10 → { so_hang: 11, sau_nhat: 10 }
co vong + KHONG chan → P2010 Raw query failed. Code: &#96;57014&#96;. Message: &#96;ERROR: canceling statement due to statement timeout&#96;</div>
</div>

<h3>4. <code>ON CONFLICT DO UPDATE</code> with an expression</h3>
<pre><code class="language-sql">INSERT INTO daily_stats (key, day, count, updated_at)
SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])
ON CONFLICT (key, day) DO UPDATE
SET count = daily_stats.count + EXCLUDED.count,
    updated_at = GREATEST(daily_stats.updated_at, EXCLUDED.updated_at)
WHERE EXCLUDED.updated_at &gt; daily_stats.updated_at;</code></pre>
<div class="out">vong lap upsert x 4096    → 3408 ms
unnest + ON CONFLICT x 4096 → 56 ms · 4096 hang · 4 tham so
k0 sau ca hai: 3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">EXCLUDED</span><span class="v">The row that would have been inserted — the update reads both sides.</span></div>
  <div class="kv"><span class="k">Four parameters, 4,096 rows</span><span class="v">unnest of arrays stays far below the 65,535 bind-parameter cap. The loop of upsert paid one statement and one commit per row — about sixty times slower here.</span></div>
  <div class="kv"><span class="k">A unique constraint is required</span><span class="v">ON CONFLICT (key, day) needs a unique index on exactly those columns.</span></div>
</div>

<h3>5. Full-text search that ranks</h3>
<pre><code class="language-sql">ALTER TABLE posts ADD COLUMN tim_kiem tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(content, ''))) STORED;
CREATE INDEX posts_tim_kiem_idx ON posts USING GIN (tim_kiem);

SELECT id, ts_rank(tim_kiem, q) AS score,
       ts_headline('simple', content, q, 'StartSel=&lt;mark&gt;, StopSel=&lt;/mark&gt;') AS trich
FROM posts, websearch_to_tsquery('simple', $1) AS q
WHERE tim_kiem @@ q AND deleted_at IS NULL
ORDER BY ts_rank(tim_kiem, q) DESC, created_at DESC LIMIT 3;</code></pre>
<div class="out">┌─────────┬───────┬──────────┬─────────────────────────────────────────────────────────────────────────────────┐
│ (index) │ id    │ score    │ trich                                                                           │
├─────────┼───────┼──────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ 0       │ 99999 │ '0.0974' │ '&lt;mark&gt;prisma&lt;/mark&gt; migration tren &lt;mark&gt;production&lt;/mark&gt; — ghi chu so 99999' │
│ 1       │ 99993 │ '0.0974' │ '&lt;mark&gt;prisma&lt;/mark&gt; migration tren &lt;mark&gt;production&lt;/mark&gt; — ghi chu so 99993' │
│ 2       │ 99987 │ '0.0974' │ '&lt;mark&gt;prisma&lt;/mark&gt; migration tren &lt;mark&gt;production&lt;/mark&gt; — ghi chu so 99987' │
└─────────┴───────┴──────────┴─────────────────────────────────────────────────────────────────────────────────┘
thoi gian (trung vi 5): 18.3 ms
contains 'prisma production' → 0 hang · 18.7 ms (khop chuoi lien, khong hieu tu)
Bitmap Heap Scan on posts  (cost=67.49..2889.01 rows=5561 width=4)
  -&gt;  Bitmap Index Scan on posts_tim_kiem_idx  (cost=0.00..66.10 rows=5561 width=0)</div>
<p><code>websearch_to_tsquery</code> parses what people type, <code>ts_rank</code> orders and <code>ts_headline</code> marks the excerpt. Prisma's <code>contains</code> with the same two words found nothing: it matches a contiguous string, not words.</p>

<h3>When not to reach for this</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">"It felt faster to write"</span><span class="lz-d">A raw query you wrote in two minutes costs you the compile-time check on every future migration. That trade is worth it for a window function; it is not worth it for a <code>WHERE</code> and an <code>ORDER BY</code>.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">"The builder generated ugly SQL"</span><span class="lz-d">Ugly and slow are different claims. Measure it (Lesson 9.1). Most "ugly" Prisma SQL plans identically to the hand-written version.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">The builder cannot express it</span><span class="lz-d">Window functions, recursion, <code>LATERAL</code>, conflict expressions, full-text ranking, <code>DISTINCT ON</code>, set operations. No amount of cleverness in the builder gets there.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">The builder needs N queries for one answer</span><span class="lz-d">Top-N per group is the canonical case: 51 queries versus 1, measured above. That is a 25x difference, not a style preference.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">A bulk operation over thousands of rows</span><span class="lz-d">A merge, a backfill, a recompute. One statement beats four thousand round trips by three orders of magnitude, and the migration runbook is shorter too.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/tutorial-window.html" target="_blank" rel="noopener"><span class="lc-ico">🪟</span><span class="lc-body"><span class="lc-title">PostgreSQL — window functions</span><span class="lc-sub">postgresql.org · The tutorial chapter, then the function reference</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/queries-with.html" target="_blank" rel="noopener"><span class="lc-ico">🌳</span><span class="lc-body"><span class="lc-title">PostgreSQL — WITH RECURSIVE</span><span class="lc-sub">postgresql.org · Anchor, recursive term, and cycle detection</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">PostgreSQL — ON CONFLICT</span><span class="lc-sub">postgresql.org · EXCLUDED, conditional updates, and the constraint requirement</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/textsearch-controls.html" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">PostgreSQL — full-text search</span><span class="lc-sub">postgresql.org · tsvector, the query parsers, ts_rank and ts_headline</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">The SQL side of all of this, taught from the database rather than from the ORM</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Rewrite an N+1 top-3-per-author endpoint as one LATERAL query and measure both</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Năm thứ chỉ SQL nói được</h2>
<p class="lead">Trình dựng truy vấn của Prisma phủ được những hình dạng mà một ứng dụng cần, chín mươi lăm lần trên một trăm. Đây là năm cái thuộc về năm phần trăm còn lại: mỗi cái là MỘT câu SQL duy nhất, mỗi cái hoặc là bất khả thi hoặc là chậm thảm hoạ khi đi qua trình dựng, và mỗi cái đều xuất hiện trong một sản phẩm thật sớm hơn bạn tưởng.</p>

<h3>1. Top-N mỗi nhóm — câu truy vấn trình dựng không diễn đạt nổi</h3>
<pre><code class="language-sql">SELECT u.id, p.id AS post_id, p.created_at
FROM users u
CROSS JOIN LATERAL (
  SELECT id, created_at FROM posts
  WHERE author_id = u.id AND deleted_at IS NULL
  ORDER BY created_at DESC LIMIT 3
) p
WHERE u.id = ANY($1);</code></pre>
<div class="out">vong lap 50 findMany      → 150 hang · 50 truy van · 36.1 ms
include posts take 3      → 150 hang · 2 truy van · 6.0 ms
LATERAL                   → 150 hang · 1 truy van · 1.1 ms
row_number() &lt;= 3         → 150 hang · 1 truy van · 3.0 ms
include take 3 sends: SELECT … FROM "users" WHERE "users"."id" IN ($1 … $50) OFFSET $51 ; SELECT … FROM "posts" WHERE "posts"."author_id" IN ($1 … $50) ORDER BY "posts"."created_at" DESC OFFSET $51</div>
<div class="kv-grid">
  <div class="kv"><span class="k">include với take không giới hạn theo từng cha trong SQL</span><span class="v">Câu thứ hai đọc mọi bài của năm mươi tác giả, đã sắp, rồi engine giữ ba bài mỗi người — hai truy vấn, nhưng đọc nhiều hàng hơn cần (đo ngày 12/11/2026, PostgreSQL 16.14 trong Docker, Prisma 6.19.3, 2.000 người dùng và 100.000 bài, trung vị 5 lần).</span></div>
  <div class="kv"><span class="k">LATERAL</span><span class="v">Truy vấn con chạy theo từng hàng ngoài, có LIMIT riêng, đi theo chỉ mục (author_id, created_at DESC) ngay trong PostgreSQL. Một truy vấn, nhanh nhất ở đây.</span></div>
  <div class="kv"><span class="k">row_number()</span><span class="v">Đúng, và chậm hơn ở đây: nó xếp hạng mọi hàng khớp trước khi lọc còn ba.</span></div>
</div>

<h3>2. Window function — xếp hạng, tổng luỹ tiến, và hàng liền trước</h3>
<pre><code class="language-sql">SELECT u.username, count(p.id)::int AS post_count,
  rank()       OVER (ORDER BY count(p.id) DESC) AS hang,
  dense_rank() OVER (ORDER BY count(p.id) DESC) AS hang_lien,
  sum(count(p.id)) OVER (ORDER BY count(p.id) DESC, u.id) AS luy_tien,
  lag(u.username)  OVER (ORDER BY count(p.id) DESC, u.id) AS nguoi_tren
FROM users u LEFT JOIN posts p ON p.author_id = u.id AND p.deleted_at IS NULL
GROUP BY u.id, u.username ORDER BY post_count DESC;</code></pre>
<div class="out">┌─────────┬──────────┬────────────┬──────┬───────────┬──────────┬────────────┐
│ (index) │ username │ post_count │ hang │ hang_lien │ luy_tien │ nguoi_tren │
├─────────┼──────────┼────────────┼──────┼───────────┼──────────┼────────────┤
│ 0       │ 'user1'  │ 50         │ 1    │ 1         │ 50       │ null       │
│ 1       │ 'user2'  │ 41         │ 2    │ 2         │ 91       │ 'user1'    │
│ 2       │ 'user3'  │ 29         │ 3    │ 3         │ 120      │ 'user2'    │
│ 3       │ 'user4'  │ 29         │ 3    │ 3         │ 149      │ 'user3'    │
│ 4       │ 'user7'  │ 15         │ 5    │ 4         │ 164      │ 'user4'    │
│ 5       │ 'user8'  │ 10         │ 6    │ 5         │ 174      │ 'user7'    │
└─────────┴──────────┴────────────┴──────┴───────────┴──────────┴────────────┘</div>
<p>Window function tính trên một tập hàng mà vẫn giữ mọi hàng. Với một cặp hoà ở 29, <code>rank()</code> cho 3, 3 rồi 5, còn <code>dense_rank()</code> cho 3, 3, 4; <code>sum(…) OVER</code> cộng dồn và <code>lag()</code> đọc hàng liền trước. <code>groupBy</code> đếm được — nó không xếp hạng, không cộng dồn, không nhìn lại được.</p>

<h3>3. CTE đệ quy — cây bình luận trong MỘT câu truy vấn</h3>
<pre><code class="language-sql">WITH RECURSIVE tree AS (
  SELECT id, content, parent_id, 0 AS do_sau, ARRAY[id] AS path
  FROM comments WHERE post_id = 1 AND parent_id IS NULL
  UNION ALL
  SELECT c.id, c.content, c.parent_id, tree.do_sau + 1, tree.path || c.id
  FROM comments c JOIN tree ON c.parent_id = tree.id
  WHERE tree.do_sau &lt; 10          -- depth guard, always
)
SELECT id, do_sau, content FROM tree ORDER BY path;</code></pre>
<div class="out">┌─────────┬────┬────────┬──────────────────────────────────────────────┐
│ (index) │ id │ do_sau │ content                                      │
├─────────┼────┼────────┼──────────────────────────────────────────────┤
│ 0       │ 1  │ 0      │ 'Bai viet hay'                               │
│ 1       │ 3  │ 1      │ '  Dong y'                                   │
│ 2       │ 4  │ 2      │ '    Minh cung nghi vay'                     │
│ 3       │ 5  │ 3      │ '      Chinh xac'                            │
│ 4       │ 6  │ 4      │ '        Tang 5 — include 3 tang khong thay' │
│ 5       │ 2  │ 0      │ 'Cho hoi phan 2 khi nao ra?'                 │
└─────────┴────┴────────┴──────────────────────────────────────────────┘

-- builder, include lồng bốn tầng
include 4 tang (goc + 3): {"content":"Bai viet hay","replies":[{"content":"Dong y","replies":[{"content":"Minh cung nghi vay","replies":[{"content":"Chinh xac"}]}]}]}</div>
<div class="pitfall">
<p><strong>Bẫy — CTE đệ quy không có rào độ sâu chạy mãi khi gặp vòng.</strong> Đo thật: gán một bình luận làm con của chính hậu duệ nó tạo ra vòng. Có rào, truy vấn trả 11 hàng và dừng ở độ sâu 10; không có rào, nó chạy tới khi <code>statement_timeout</code> huỷ:</p>
<div class="out">co vong + chan do sau 10 → { so_hang: 11, sau_nhat: 10 }
co vong + KHONG chan → P2010 Raw query failed. Code: &#96;57014&#96;. Message: &#96;ERROR: canceling statement due to statement timeout&#96;</div>
</div>

<h3>4. <code>ON CONFLICT DO UPDATE</code> kèm BIỂU THỨC</h3>
<pre><code class="language-sql">INSERT INTO daily_stats (key, day, count, updated_at)
SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])
ON CONFLICT (key, day) DO UPDATE
SET count = daily_stats.count + EXCLUDED.count,
    updated_at = GREATEST(daily_stats.updated_at, EXCLUDED.updated_at)
WHERE EXCLUDED.updated_at &gt; daily_stats.updated_at;</code></pre>
<div class="out">vong lap upsert x 4096    → 3408 ms
unnest + ON CONFLICT x 4096 → 56 ms · 4096 hang · 4 tham so
k0 sau ca hai: 3</div>
<div class="kv-grid">
  <div class="kv"><span class="k">EXCLUDED</span><span class="v">Hàng lẽ ra đã được chèn — lệnh cập nhật đọc được cả hai phía.</span></div>
  <div class="kv"><span class="k">Bốn tham số, 4.096 hàng</span><span class="v">unnest các mảng ở rất xa trần 65.535 tham số. Vòng lặp upsert trả một câu lệnh và một commit cho mỗi hàng — chậm hơn khoảng sáu mươi lần ở đây.</span></div>
  <div class="kv"><span class="k">Cần một ràng buộc unique</span><span class="v">ON CONFLICT (key, day) cần một chỉ mục unique đúng trên các cột đó.</span></div>
</div>

<h3>5. Tìm kiếm toàn văn CÓ XẾP HẠNG</h3>
<pre><code class="language-sql">ALTER TABLE posts ADD COLUMN tim_kiem tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(content, ''))) STORED;
CREATE INDEX posts_tim_kiem_idx ON posts USING GIN (tim_kiem);

SELECT id, ts_rank(tim_kiem, q) AS score,
       ts_headline('simple', content, q, 'StartSel=&lt;mark&gt;, StopSel=&lt;/mark&gt;') AS trich
FROM posts, websearch_to_tsquery('simple', $1) AS q
WHERE tim_kiem @@ q AND deleted_at IS NULL
ORDER BY ts_rank(tim_kiem, q) DESC, created_at DESC LIMIT 3;</code></pre>
<div class="out">┌─────────┬───────┬──────────┬─────────────────────────────────────────────────────────────────────────────────┐
│ (index) │ id    │ score    │ trich                                                                           │
├─────────┼───────┼──────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ 0       │ 99999 │ '0.0974' │ '&lt;mark&gt;prisma&lt;/mark&gt; migration tren &lt;mark&gt;production&lt;/mark&gt; — ghi chu so 99999' │
│ 1       │ 99993 │ '0.0974' │ '&lt;mark&gt;prisma&lt;/mark&gt; migration tren &lt;mark&gt;production&lt;/mark&gt; — ghi chu so 99993' │
│ 2       │ 99987 │ '0.0974' │ '&lt;mark&gt;prisma&lt;/mark&gt; migration tren &lt;mark&gt;production&lt;/mark&gt; — ghi chu so 99987' │
└─────────┴───────┴──────────┴─────────────────────────────────────────────────────────────────────────────────┘
thoi gian (trung vi 5): 18.3 ms
contains 'prisma production' → 0 hang · 18.7 ms (khop chuoi lien, khong hieu tu)
Bitmap Heap Scan on posts  (cost=67.49..2889.01 rows=5561 width=4)
  -&gt;  Bitmap Index Scan on posts_tim_kiem_idx  (cost=0.00..66.10 rows=5561 width=0)</div>
<p><code>websearch_to_tsquery</code> hiểu thứ người dùng gõ, <code>ts_rank</code> xếp thứ tự và <code>ts_headline</code> đánh dấu đoạn trích. <code>contains</code> của Prisma với cùng hai từ không tìm thấy gì: nó so một chuỗi liền, không hiểu từ.</p>

<h3>Khi nào ĐỪNG với tay tới thứ này</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">"Viết kiểu này thấy nhanh hơn"</span><span class="lz-d">Một truy vấn thô bạn viết trong hai phút lấy đi của bạn phép kiểm lúc biên dịch cho MỌI migration về sau. Đánh đổi đó xứng đáng với một window function; nó KHÔNG xứng đáng với một <code>WHERE</code> và một <code>ORDER BY</code>.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">"SQL trình dựng sinh ra xấu quá"</span><span class="lz-d">Xấu và chậm là hai khẳng định KHÁC nhau. Hãy đo (Bài 9.1). Phần lớn SQL "xấu" của Prisma cho ra kế hoạch y hệt bản viết tay.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Trình dựng KHÔNG diễn đạt nổi</span><span class="lz-d">Window function, đệ quy, <code>LATERAL</code>, biểu thức khi xung đột, xếp hạng toàn văn, <code>DISTINCT ON</code>, các phép toán tập hợp. Có khôn khéo tới đâu trong trình dựng cũng không tới được đó.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Trình dựng cần N truy vấn cho MỘT câu trả lời</span><span class="lz-d">Top-N mỗi nhóm là ví dụ kinh điển: 51 truy vấn đối lại 1, đo ở trên. Đó là khác biệt 25 lần, không phải chuyện thẩm mỹ.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Một thao tác hàng loạt trên hàng nghìn hàng</span><span class="lz-d">Một phép gộp, một lần nạp bù, một lần tính lại. Một câu lệnh thắng bốn nghìn lượt đi về ba bậc độ lớn, và bản hướng dẫn chạy migration cũng ngắn hơn.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/tutorial-window.html" target="_blank" rel="noopener"><span class="lc-ico">🪟</span><span class="lc-body"><span class="lc-title">PostgreSQL — window function</span><span class="lc-sub">postgresql.org · Chương hướng dẫn, rồi tới phần tra cứu hàm</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/queries-with.html" target="_blank" rel="noopener"><span class="lc-ico">🌳</span><span class="lc-body"><span class="lc-title">PostgreSQL — WITH RECURSIVE</span><span class="lc-sub">postgresql.org · Mỏ neo, bước đệ quy, và phát hiện chu trình</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">PostgreSQL — ON CONFLICT</span><span class="lc-sub">postgresql.org · EXCLUDED, cập nhật có điều kiện, và yêu cầu về ràng buộc</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/textsearch-controls.html" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">PostgreSQL — tìm kiếm toàn văn</span><span class="lc-sub">postgresql.org · tsvector, các bộ phân tích truy vấn, ts_rank và ts_headline</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Phía SQL của tất cả những thứ này, dạy từ cơ sở dữ liệu chứ không từ ORM</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết lại một endpoint top-3-mỗi-tác-giả đang N+1 thành một câu LATERAL rồi đo cả hai</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — TypedSQL: raw queries the compiler can check|||10.4 — TypedSQL: truy vấn thô mà trình biên dịch kiểm được',
      slug: 'pr-10-4-typedsql',
      type: 'LESSON',
      description: 'Đặt câu SQL vào file .sql, khai tham số bằng chú thích @param, chạy prisma generate --sql để Prisma HỎI THẲNG cơ sở dữ liệu kiểu trả về, và biến cú trôi dạt lược đồ của Bài 10.2 từ một lỗi lúc chạy thành một lỗi lúc build — kèm cái giá thật: CI phải có một cơ sở dữ liệu.',
      content: `
${G10_4}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>TypedSQL: raw queries the compiler can check</h2>
<p class="lead">Lesson 10.2 ended with an unsatisfying answer: raw queries lie about their types, so validate at runtime. TypedSQL is the satisfying one. You put the SQL in a file, Prisma asks the real database what that statement returns, and generates the type from the answer. The cast disappears, and so does the class of bug where a renamed column compiles fine and fails in production.</p>

<h3>The setup, end to end</h3>
<pre><code class="language-javascript">generator client {
  provider        = "prisma-client-js"
  output          = "../gen"              <span class="tok-comment">// custom output ⇒ import from ../gen/sql</span>
  previewFeatures = ["typedSql"]
}</code></pre>
<pre><code class="language-sql">-- prisma/sql/thongKeTacGia.sql — the file name becomes the function name
-- @param {Int} $1:tacGiaId  ID cua tac gia
-- @param {Int} $2:gioiHan   So hang toi da
SELECT p.id, p.content, p.created_at, count(c.id)::int AS comment_count
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
WHERE p.author_id = $1 AND p.deleted_at IS NULL
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT $2;</code></pre>
<div class="out">$ npx prisma generate --sql --schema p10/prisma/schema.prisma 2&gt;&amp;1 | grep -E 'loaded|Generated|Error'
Environment variables loaded from .env
Prisma schema loaded from p10/prisma/schema.prisma
✔ Generated Prisma Client (v6.19.3) to ./p10/gen in 53ms</div>
<p>Plain <code>prisma generate</code> skips the .sql files; with <code>--sql</code> Prisma prepares every statement against the database and writes typed functions under <code>&lt;output&gt;/sql</code>. In 6.19.3 it prints the same single "Generated Prisma Client" line either way — check the generated files, not the console.</p>
<div class="out">export namespace thongKeTacGia {
  export type Parameters = [tacGiaId: number, gioiHan: number]
  export type Result = {
    id: number
    content: string
    created_at: Date
    comment_count: number | null
  }
}
export namespace timBai {
  export type Parameters = [tuKhoa: string | null, tuNgay: Date | null]
  export type Result = {
    id: number
    content: string
    created_at: Date
  }
}</div>
<div class="pitfall">
<p><strong>Trap — an expression comes back nullable.</strong> <code>count(c.id)::int</code> cannot be null, yet PostgreSQL reports an expression column as possibly null, so the generated type is <code>number | null</code>. Handle the null, or wrap it in <code>COALESCE(…, 0)</code>. Optional parameters (the trailing <code>?</code>) become <code>| null</code> arguments.</p>
</div>
<pre><code class="language-javascript">// Bài 10.4 — dùng hàm TypedSQL sinh ra
import { PrismaClient } from '../gen/index.js';
import { thongKeTacGia, timBai } from '../gen/sql/index.js';
const prisma = new PrismaClient();
const rows = await prisma.$queryRawTyped(thongKeTacGia(42, 3));
const n: number = rows[0].comment_count;
const d: Date = rows[0].created_at;
console.log(rows[0].khong_co_that);
await prisma.$queryRawTyped(thongKeTacGia('42', 3));
await prisma.$queryRawTyped(timBai('prisma', null));
export { n, d };</code></pre>
<div class="out">$ npx tsc --noEmit --strict dung.ts
dung.ts(6,7): error TS2322: Type 'number | null' is not assignable to type 'number'.
  Type 'null' is not assignable to type 'number'.
dung.ts(8,21): error TS2339: Property 'khong_co_that' does not exist on type 'Result'.
dung.ts(9,43): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
[exit 2]</div>
<p>Three mistakes, three compile errors: the nullable count assigned to a number, a field that does not exist, and a string where an <code>Int</code> parameter goes. Through <code>$queryRaw&lt;any[]&gt;</code> all three would compile.</p>

<h3>The drift from Lesson 10.2, now caught at build</h3>
<div class="out">-- (CSDL c104b: cot content da doi ten thanh body)
$ npx prisma generate --sql --schema p10/prisma/schema.prisma 2&gt;&amp;1 | grep -v '^Environment'
Prisma schema loaded from p10/prisma/schema.prisma
Error: Errors while reading sql files:
In p10/prisma/sql/thongKeTacGia.sql:
Error: column p.content does not exist
In p10/prisma/sql/timBai.sql:
Error: column "content" does not exist</div>
<p>The column <code>content</code> was renamed to <code>body</code> in the database; generate --sql failed for every file that used it, naming the file and the column. This error in CI is the whole value: the same rename through <code>$queryRaw</code> compiles and returns undefined in production.</p>

<h3>The <code>@param</code> comment, and optional filters</h3>
<pre><code class="language-sql">-- prisma/sql/timBai.sql
-- @param {String}   $1:tuKhoa?  Tu khoa, bo trong de lay tat ca
-- @param {DateTime} $2:tuNgay?  Chi lay bai tu ngay nay tro di
SELECT id, content, created_at
FROM posts
WHERE deleted_at IS NULL
  AND ($1::text IS NULL OR content ILIKE '%' || $1 || '%')
  AND ($2::timestamptz IS NULL OR created_at &gt;= $2)
ORDER BY created_at DESC
LIMIT 3;</code></pre>
<pre><code class="language-javascript">await prisma.$queryRawTyped(timBai('prisma', null));
await prisma.$queryRawTyped(timBai(null, new Date('2026-03-01')));
await prisma.$queryRawTyped(timBai(null, null));</code></pre>
<div class="out">timBai(prisma, null): [ 99999, 99996, 99993 ]
timBai(null, 2026-03-01): [ 100000, 99999, 99998 ]
timBai(null, null): [ 100000, 99999, 99998 ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-- @param {String} $1:tuKhoa?</code></span><span class="v">Position, type (Prisma scalar names: String, Int, DateTime, Decimal…), argument name, optional mark, description.</span></div>
  <div class="kv"><span class="k"><code>$1::text IS NULL OR …</code></span><span class="v">One static statement covers every combination of optional filters; the cast tells PostgreSQL the type when the value is null.</span></div>
</div>

<h3>The cost, stated honestly</h3>
<p>Measured with the database unreachable:</p>
<div class="out">$ npx prisma generate --sql --schema p10/prisma/schema.prisma 2&gt;&amp;1 | grep -v '^Environment'
Prisma schema loaded from p10/prisma/schema.prisma
Error: Errors while reading sql files:
In p10/prisma/sql/thongKeTacGia.sql:
Error: P1001
Can't reach database server at &#96;127.0.0.1:59999&#96;
Please make sure your database server is running at &#96;127.0.0.1:59999&#96;.
In p10/prisma/sql/timBai.sql:
Error: P1001
Can't reach database server at &#96;127.0.0.1:59999&#96;
Please make sure your database server is running at &#96;127.0.0.1:59999&#96;.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">CI needs a live database</span><span class="lz-lnote">This is the real price. <code>prisma generate --sql</code> connects and prepares each statement; without a reachable <code>DATABASE_URL</code> whose schema is current, the build fails. A Postgres service container plus <code>prisma migrate deploy</code> before generate — about eight lines of workflow YAML, and then it is permanent.</span></div>
  <div class="lz-layer"><span class="lz-lname">The schema must be migrated first</span><span class="lz-lnote">Generate against a database that is one migration behind and you get the <em>old</em> types, silently, in a green build. The order is always: <code>migrate deploy</code>, then <code>generate --sql</code>. Put them in that order in one npm script so nobody can run half of it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Static SQL only</span><span class="lz-lnote">The file cannot be assembled at runtime. Optional parameters cover "this filter may be absent"; they do not cover "the caller chooses which of nine columns to sort by". That still needs <code>Prisma.sql</code> and <code>Prisma.raw</code> from Lesson 10.1 — and those still have no compile-time check.</span></div>
  <div class="lz-layer"><span class="lz-lname">Preview feature, PostgreSQL first</span><span class="lz-lnote">Still behind <code>previewFeatures</code> as of Prisma 6.x, with PostgreSQL the best-supported provider (MySQL and SQLite work; others do not). Preview means the API can change between minor versions — pin the Prisma version if you adopt it widely.</span></div>
</div>
<pre><code class="language-typescript"><span class="tok-comment"># .github/workflows/&lt;ci&gt;.yml — the eight lines (CuongThai&#39;s ci-lint already runs a postgres service for its tests; it does not run generate --sql)</span>
services:
  postgres:
    image: postgres:16-alpine
    env: { POSTGRES_PASSWORD: postgres, POSTGRES_DB: ci }
    options: &gt;-
      --health-cmd pg_isready --health-interval 5s --health-retries 10
    ports: ['5432:5432']

<span class="tok-comment"># … and in the job</span>
- run: npx prisma migrate deploy
  env: { DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/ci' }
- run: npx prisma generate --sql
  env: { DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/ci' }
- run: npx tsc --noEmit</code></pre>
<div class="pitfall">
<p><strong>Trap — <code>prisma generate</code> without <code>--sql</code> leaves the old generated queries in place.</strong> It succeeds, prints a green tick, and your <code>@prisma/client/sql</code> import still resolves — to the types from the last time someone remembered the flag. Put <code>--sql</code> in the <code>postinstall</code> script and in every place the repository generates, or one machine in the team will be compiling against types nobody else has.</p>
</div>
<div class="note-ct">
<p><strong>Where this pays and where it does not.</strong> A codebase with three raw queries does not need a Postgres service container in CI; runtime validation from Lesson 10.2 is the cheaper answer. A codebase with thirty — reports, dashboards, aggregations, a search endpoint — gets a compile-time guarantee across all of them for one fixed setup cost. The threshold is roughly where you start being afraid to rename a column, and that fear is a better signal than any rule of thumb.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql" target="_blank" rel="noopener"><span class="lc-ico">🧾</span><span class="lc-body"><span class="lc-title">Prisma — TypedSQL</span><span class="lc-sub">prisma.io/docs · Setup, the @param syntax, and current provider support</span></span></a>
<a class="link-card" href="https://www.prisma.io/blog/announcing-typedsql-make-your-raw-sql-queries-type-safe-with-prisma-orm" target="_blank" rel="noopener"><span class="lc-ico">📢</span><span class="lc-body"><span class="lc-title">The TypedSQL announcement</span><span class="lc-sub">prisma.io/blog · The design rationale, and what it deliberately does not solve</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">GitHub Actions — PostgreSQL service containers</span><span class="lc-sub">docs.github.com · The database CI needs for generate --sql</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">What the server reports as a statement result type — the thing generate --sql reads</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Convert a $queryRaw report to TypedSQL, then rename a column and watch the build stop you</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>TypedSQL: truy vấn thô mà trình biên dịch kiểm được</h2>
<p class="lead">Bài 10.2 kết thúc bằng một câu trả lời không mấy dễ chịu: truy vấn thô nói dối về kiểu của nó, nên hãy kiểm lúc chạy. TypedSQL mới là câu trả lời dễ chịu. Bạn đặt câu SQL vào một file, Prisma đi HỎI THẲNG cơ sở dữ liệu thật xem câu lệnh đó trả về gì, rồi sinh kiểu từ câu trả lời. Phép ép kiểu biến mất, và cùng với nó biến mất luôn cái lớp bug mà một cột đổi tên vẫn biên dịch ngon lành rồi chết trên production.</p>

<h3>Dựng từ đầu tới cuối</h3>
<pre><code class="language-javascript">generator client {
  provider        = "prisma-client-js"
  output          = "../gen"              <span class="tok-comment">// output tuỳ chỉnh ⇒ import từ ../gen/sql</span>
  previewFeatures = ["typedSql"]
}</code></pre>
<pre><code class="language-sql">-- prisma/sql/thongKeTacGia.sql — tên tệp thành tên hàm
-- @param {Int} $1:tacGiaId  ID cua tac gia
-- @param {Int} $2:gioiHan   So hang toi da
SELECT p.id, p.content, p.created_at, count(c.id)::int AS comment_count
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
WHERE p.author_id = $1 AND p.deleted_at IS NULL
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT $2;</code></pre>
<div class="out">$ npx prisma generate --sql --schema p10/prisma/schema.prisma 2&gt;&amp;1 | grep -E 'loaded|Generated|Error'
Environment variables loaded from .env
Prisma schema loaded from p10/prisma/schema.prisma
✔ Generated Prisma Client (v6.19.3) to ./p10/gen in 53ms</div>
<p><code>prisma generate</code> trơn bỏ qua các tệp .sql; có <code>--sql</code> thì Prisma chuẩn bị từng câu lệnh trên cơ sở dữ liệu rồi ghi các hàm có kiểu vào <code>&lt;output&gt;/sql</code>. Ở 6.19.3 cả hai cách đều in đúng một dòng "Generated Prisma Client" — hãy xem tệp sinh ra, đừng xem console.</p>
<div class="out">export namespace thongKeTacGia {
  export type Parameters = [tacGiaId: number, gioiHan: number]
  export type Result = {
    id: number
    content: string
    created_at: Date
    comment_count: number | null
  }
}
export namespace timBai {
  export type Parameters = [tuKhoa: string | null, tuNgay: Date | null]
  export type Result = {
    id: number
    content: string
    created_at: Date
  }
}</div>
<div class="pitfall">
<p><strong>Bẫy — một biểu thức trả về có thể null.</strong> <code>count(c.id)::int</code> không thể null, vậy mà PostgreSQL báo một cột biểu thức là có thể null, nên kiểu sinh ra là <code>number | null</code>. Hãy xử lý null, hoặc bọc trong <code>COALESCE(…, 0)</code>. Tham số tuỳ chọn (dấu <code>?</code> ở cuối) thành đối số <code>| null</code>.</p>
</div>
<pre><code class="language-javascript">// Bài 10.4 — dùng hàm TypedSQL sinh ra
import { PrismaClient } from '../gen/index.js';
import { thongKeTacGia, timBai } from '../gen/sql/index.js';
const prisma = new PrismaClient();
const rows = await prisma.$queryRawTyped(thongKeTacGia(42, 3));
const n: number = rows[0].comment_count;
const d: Date = rows[0].created_at;
console.log(rows[0].khong_co_that);
await prisma.$queryRawTyped(thongKeTacGia('42', 3));
await prisma.$queryRawTyped(timBai('prisma', null));
export { n, d };</code></pre>
<div class="out">$ npx tsc --noEmit --strict dung.ts
dung.ts(6,7): error TS2322: Type 'number | null' is not assignable to type 'number'.
  Type 'null' is not assignable to type 'number'.
dung.ts(8,21): error TS2339: Property 'khong_co_that' does not exist on type 'Result'.
dung.ts(9,43): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
[exit 2]</div>
<p>Ba lỗi, ba lỗi biên dịch: gán số đếm có thể null vào number, đọc một trường không tồn tại, và truyền chuỗi vào chỗ tham số <code>Int</code>. Qua <code>$queryRaw&lt;any[]&gt;</code>, cả ba đều biên dịch được.</p>

<h3>Cú trôi dạt của Bài 10.2, giờ bị bắt ngay lúc build</h3>
<div class="out">-- (CSDL c104b: cot content da doi ten thanh body)
$ npx prisma generate --sql --schema p10/prisma/schema.prisma 2&gt;&amp;1 | grep -v '^Environment'
Prisma schema loaded from p10/prisma/schema.prisma
Error: Errors while reading sql files:
In p10/prisma/sql/thongKeTacGia.sql:
Error: column p.content does not exist
In p10/prisma/sql/timBai.sql:
Error: column "content" does not exist</div>
<p>Cột <code>content</code> được đổi tên thành <code>body</code> trong cơ sở dữ liệu; generate --sql hỏng ở mọi tệp dùng cột ấy, chỉ rõ tệp và cột. Lỗi này trong CI chính là toàn bộ giá trị: cùng lần đổi tên qua <code>$queryRaw</code> vẫn biên dịch và trả undefined trên production.</p>

<h3>Chú thích <code>@param</code>, và bộ lọc tuỳ chọn</h3>
<pre><code class="language-sql">-- prisma/sql/timBai.sql
-- @param {String}   $1:tuKhoa?  Tu khoa, bo trong de lay tat ca
-- @param {DateTime} $2:tuNgay?  Chi lay bai tu ngay nay tro di
SELECT id, content, created_at
FROM posts
WHERE deleted_at IS NULL
  AND ($1::text IS NULL OR content ILIKE '%' || $1 || '%')
  AND ($2::timestamptz IS NULL OR created_at &gt;= $2)
ORDER BY created_at DESC
LIMIT 3;</code></pre>
<pre><code class="language-javascript">await prisma.$queryRawTyped(timBai('prisma', null));
await prisma.$queryRawTyped(timBai(null, new Date('2026-03-01')));
await prisma.$queryRawTyped(timBai(null, null));</code></pre>
<div class="out">timBai(prisma, null): [ 99999, 99996, 99993 ]
timBai(null, 2026-03-01): [ 100000, 99999, 99998 ]
timBai(null, null): [ 100000, 99999, 99998 ]</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-- @param {String} $1:tuKhoa?</code></span><span class="v">Vị trí, kiểu (tên vô hướng của Prisma: String, Int, DateTime, Decimal…), tên đối số, dấu tuỳ chọn, mô tả.</span></div>
  <div class="kv"><span class="k"><code>$1::text IS NULL OR …</code></span><span class="v">Một câu lệnh tĩnh phủ mọi tổ hợp bộ lọc tuỳ chọn; phép ép kiểu cho PostgreSQL biết kiểu khi giá trị là null.</span></div>
</div>

<h3>Cái giá, nói cho thật</h3>
<p>Đo thật khi không với tới cơ sở dữ liệu:</p>
<div class="out">$ npx prisma generate --sql --schema p10/prisma/schema.prisma 2&gt;&amp;1 | grep -v '^Environment'
Prisma schema loaded from p10/prisma/schema.prisma
Error: Errors while reading sql files:
In p10/prisma/sql/thongKeTacGia.sql:
Error: P1001
Can't reach database server at &#96;127.0.0.1:59999&#96;
Please make sure your database server is running at &#96;127.0.0.1:59999&#96;.
In p10/prisma/sql/timBai.sql:
Error: P1001
Can't reach database server at &#96;127.0.0.1:59999&#96;
Please make sure your database server is running at &#96;127.0.0.1:59999&#96;.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">CI cần một cơ sở dữ liệu SỐNG</span><span class="lz-lnote">Đây là cái giá thật. <code>prisma generate --sql</code> phải KẾT NỐI và chuẩn bị từng câu lệnh; không có một <code>DATABASE_URL</code> chạm tới được và có lược đồ mới nhất thì bản dựng hỏng. Một service container Postgres cộng <code>prisma migrate deploy</code> chạy trước generate — chừng tám dòng YAML, và sau đó thì nó vĩnh viễn nằm đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lược đồ phải được migrate TRƯỚC</span><span class="lz-lnote">Generate trên một cơ sở dữ liệu chậm một migration thì bạn nhận kiểu CŨ, một cách lặng lẽ, trong một bản dựng màu xanh. Thứ tự LUÔN là: <code>migrate deploy</code> rồi mới <code>generate --sql</code>. Nhét chúng theo thứ tự đó vào MỘT npm script để không ai chạy được nửa vời.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ SQL TĨNH</span><span class="lz-lnote">File không thể được lắp ráp lúc chạy. Tham số tuỳ chọn phủ được "bộ lọc này có thể vắng"; nó KHÔNG phủ được "người gọi chọn sắp xếp theo một trong chín cột". Cái đó vẫn cần <code>Prisma.sql</code> và <code>Prisma.raw</code> của Bài 10.1 — và những cái đó vẫn không có phép kiểm lúc biên dịch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tính năng xem trước, PostgreSQL đi đầu</span><span class="lz-lnote">Tới Prisma 6.x nó vẫn nằm sau <code>previewFeatures</code>, với PostgreSQL là provider được hỗ trợ tốt nhất (MySQL và SQLite chạy được; những cái khác thì không). "Xem trước" nghĩa là API có thể đổi giữa hai bản minor — hãy ghim phiên bản Prisma nếu bạn dùng nó rộng rãi.</span></div>
</div>
<pre><code class="language-typescript"><span class="tok-comment"># .github/workflows/&lt;ci&gt;.yml — tám dòng (ci-lint của CuongThai đã có service postgres cho test; nó chưa chạy generate --sql)</span>
services:
  postgres:
    image: postgres:16-alpine
    env: { POSTGRES_PASSWORD: postgres, POSTGRES_DB: ci }
    options: &gt;-
      --health-cmd pg_isready --health-interval 5s --health-retries 10
    ports: ['5432:5432']

<span class="tok-comment"># … và trong job</span>
- run: npx prisma migrate deploy
  env: { DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/ci' }
- run: npx prisma generate --sql
  env: { DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/ci' }
- run: npx tsc --noEmit</code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>prisma generate</code> KHÔNG kèm <code>--sql</code> sẽ để nguyên đám truy vấn sinh ra từ lần trước.</strong> Nó THÀNH CÔNG, in một dấu tích xanh, và câu <code>@prisma/client/sql</code> của bạn vẫn phân giải được — phân giải tới đúng bộ kiểu của lần cuối cùng có người nhớ ra cái cờ. Hãy nhét <code>--sql</code> vào script <code>postinstall</code> và vào MỌI chỗ kho mã này sinh mã, nếu không sẽ có một máy trong nhóm biên dịch với bộ kiểu mà không ai khác có.</p>
</div>
<div class="note-ct">
<p><strong>Chỗ nào nó đáng và chỗ nào không.</strong> Một kho mã có ba truy vấn thô thì KHÔNG cần một service container Postgres trong CI; phép kiểm lúc chạy của Bài 10.2 là câu trả lời rẻ hơn. Một kho mã có ba mươi cái — báo cáo, bảng điều khiển, các phép tổng hợp, một endpoint tìm kiếm — thì được một bảo đảm lúc biên dịch cho TẤT CẢ chúng, đổi lấy một lần dựng hạ tầng cố định. Ngưỡng nằm đâu đó ở chỗ bạn bắt đầu SỢ đổi tên một cột, và nỗi sợ đó là tín hiệu tốt hơn mọi quy tắc ngón tay cái.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql" target="_blank" rel="noopener"><span class="lc-ico">🧾</span><span class="lc-body"><span class="lc-title">Prisma — TypedSQL</span><span class="lc-sub">prisma.io/docs · Cách dựng, cú pháp @param, và mức hỗ trợ provider hiện tại</span></span></a>
<a class="link-card" href="https://www.prisma.io/blog/announcing-typedsql-make-your-raw-sql-queries-type-safe-with-prisma-orm" target="_blank" rel="noopener"><span class="lc-ico">📢</span><span class="lc-body"><span class="lc-title">Bài công bố TypedSQL</span><span class="lc-sub">prisma.io/blog · Lý do thiết kế, và thứ nó CỐ Ý không giải quyết</span></span></a>
<a class="link-card" href="https://docs.github.com/en/actions/using-containerized-services/creating-postgresql-service-containers" target="_blank" rel="noopener"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">GitHub Actions — service container PostgreSQL</span><span class="lc-sub">docs.github.com · Cơ sở dữ liệu mà CI cần cho generate --sql</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Máy chủ báo lại kiểu kết quả của một câu lệnh như thế nào — đúng thứ generate --sql đọc</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Đổi một báo cáo $queryRaw sang TypedSQL, rồi đổi tên một cột và xem bản dựng chặn bạn lại</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — $extends: changing the client without wrapping it|||10.5 — $extends: đổi client mà không phải bọc nó',
      slug: 'pr-10-5-extends',
      type: 'LESSON',
      description: 'Bốn thành phần result, model, query, client; trường tính toán kèm needs; phương thức riêng cho từng model; chặn mọi thao tác để làm soft delete — đo tám đường đọc: extension mẫu chỉ ẩn ba (findUnique, groupBy, include từ model khác và $queryRaw vẫn thấy hàng đã xoá), chỉ mục unique một phần, và $use đã bị gỡ ở Prisma 6.19.3.',
      content: `
${G10_5}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2><code>$extends</code>: changing the client without wrapping it</h2>
<p class="lead">The other escape hatch is not about SQL at all. <code>$extends</code> lets you add computed fields, add methods, and intercept every operation — with full type inference, unlike the <code>$use</code> middleware it replaced. This lesson builds all four kinds, then spends its second half on the three places a soft-delete extension does not reach, because believing it reaches them is how deleted rows end up in a response.</p>

<h3>The four components</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>result</code></span><span class="v">Adds computed fields to a model's results. Runs in JavaScript, after the rows arrive.</span></div>
  <div class="kv"><span class="k"><code>model</code></span><span class="v">Adds methods to <code>prisma.user</code>, <code>prisma.socialPost</code>, or to <code>$allModels</code>. Where your repository functions can live.</span></div>
  <div class="kv"><span class="k"><code>query</code></span><span class="v">Wraps operations. Sees the arguments, decides what to pass on, sees the result. The replacement for <code>$use</code>.</span></div>
  <div class="kv"><span class="k"><code>client</code></span><span class="v">Adds top-level methods to the client itself — <code>prisma.$kiemTraSucKhoe()</code>, <code>prisma.$doThoiGian()</code>.</span></div>
</div>
<pre><code class="language-javascript"><span class="tok-comment">// $extends returns a NEW client. It does not mutate the old one.</span>
const prismaGoc = new PrismaClient();
const prisma    = prismaGoc.$extends(mở_rộng);   <span class="tok-comment">// ✅ assign the result</span>

prismaGoc.$extends(mở_rộng);                      <span class="tok-comment">// ❌ does nothing at all</span></code></pre>
<div class="pitfall">
<p><strong>Trap — calling <code>$extends</code> without assigning is a silent no-op.</strong> No error, no warning; the extension simply never runs, and the soft-delete filter you were relying on is not there. Export exactly one extended client from one module and import it everywhere — <code>export const prisma = new PrismaClient().$extends(…)</code> — so there is no un-extended client available to import by accident.</p>
</div>

<h3><code>result</code> — computed fields, and the <code>needs</code> that makes them work</h3>
<pre><code class="language-javascript">const mediaExt = Prisma.defineExtension({
  name: 'media-url',
  result: {
    user: {
      avatarUrl: {
        needs: { avatarUrl: true },              <span class="tok-comment">// ← the fields it depends on</span>
        compute(u) {
          if (!u.avatarUrl) return '/images/mac-dinh.png';
          if (u.avatarUrl.startsWith('http')) return u.avatarUrl;
          return &#96;https://media.cuongthai.com/\${u.avatarUrl}&#96;;
        },
      },
    },
    socialPost: {
      daSua: {
        needs: { createdAt: true, updatedAt: true },
        compute: (p) =&gt; p.updatedAt.getTime() - p.createdAt.getTime() &gt; 1000,
      },
    },
  },
});</code></pre>
<pre><code class="language-javascript">const u = await prisma.user.findUniqueOrThrow({ where: { id }, select: { avatarUrl: true } });
console.log(u.avatarUrl);   <span class="tok-comment">// string — and avatarUrl was fetched automatically</span></code></pre>
<div class="out">prisma:query SELECT "public"."User"."avatar_url" FROM "public"."User" WHERE …
https://media.cuongthai.com/avatars/clx7….webp</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>needs</code></span><span class="lz-t">Declares the dependency</span><span class="lz-d">Selecting only the computed field still fetches the columns it needs — Prisma adds them to the SQL and removes them from the result. Forget <code>needs</code> and <code>compute</code> receives <code>undefined</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Computed in JavaScript</span><span class="lz-t">The hard limit</span><span class="lz-d">It runs after the rows arrive, so it cannot appear in <code>where</code>, <code>orderBy</code>, or <code>groupBy</code>. "Sort by <code>daSua</code>" is not expressible — that needs a real column or a raw query.</span></div>
  <div class="lz-step"><span class="lz-k">The 2026-07-02 bug, prevented</span><span class="lz-t">One place, not thirty</span><span class="lz-d">CuongThai's <code>getMediaUrl</code> once prefixed the CDN base onto <code>blob:</code> preview URLs and produced a 400. The fix belongs in one <code>compute</code>, not in every component that renders an avatar.</span></div>
  <div class="lz-step"><span class="lz-k"><code>Prisma.defineExtension</code></span><span class="lz-t">For reuse and types</span><span class="lz-d">Defining the extension separately keeps type inference working across files and lets you compose several: <code>client.$extends(a).$extends(b)</code>.</span></div>
</div>

<h3><code>model</code> and <code>client</code> — methods where you expect them</h3>
<pre><code class="language-javascript">const truyVanExt = Prisma.defineExtension({
  name: 'truy-van-thuong-dung',
  model: {
    user: {
      async findByEmailOrName(q: string) {
        return prisma.user.findFirst({
          where: { OR: [{ email: q }, { username: q }] },
          select: { id: true, username: true, email: true },
        });
      },
    },
    $allModels: {
      async exists&lt;T&gt;(this: T, where: Prisma.Args&lt;T, 'findFirst'&gt;['where']): Promise&lt;boolean&gt; {
        const ctx = Prisma.getExtensionContext(this);
        const n = await (ctx as any).count({ where, take: 1 });
        return n &gt; 0;
      },
    },
  },
  client: {
    async $kiemTraSucKhoe() {
      const t = process.hrtime.bigint();
      await (Prisma.getExtensionContext(this) as any).$queryRaw&#96;SELECT 1&#96;;
      return Number(process.hrtime.bigint() - t) / 1e6;
    },
  },
});</code></pre>
<pre><code class="language-typescript">await prisma.user.findByEmailOrName('an@vidu.com');
await prisma.socialPost.exists({ id: postId });   <span class="tok-comment">// on every model</span>
await prisma.$kiemTraSucKhoe();                    <span class="tok-comment">// → 1.84 (ms)</span></code></pre>
<div class="callout ok">
<p><strong><code>$allModels</code> plus <code>Prisma.getExtensionContext(this)</code> is how you write a method once for every model.</strong> <code>this</code> inside the method is the model delegate it was called on, and <code>getExtensionContext</code> gives you a properly-typed handle to it. It is the closest Prisma gets to a base repository class, without any of the inheritance.</p>
</div>

<h3><code>query</code> — soft delete, and what it actually covers</h3>
<pre><code class="language-javascript">const softDelete = Prisma.defineExtension({
  name: 'soft-delete',
  query: {
    post: {
      async delete({ args })     { return base.post.update({ ...args, data: { deletedAt: new Date() } }); },
      async deleteMany({ args }) { return base.post.updateMany({ ...args, data: { deletedAt: new Date() } }); },
      async $allOperations({ operation, args, query }) {
        if (['findMany', 'findFirst', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});
const prisma = base.$extends(softDelete);
await prisma.post.delete({ where: { id: 1001 } });</code></pre>
<div class="out">delete → UPDATE "posts" SET "deleted_at" = $1 WHERE ("posts"."id" = $2 AND 1=1) RETURNING …</div>
<p>The row stays and <code>deleted_at</code> is set. Then the deleted post was read eight ways (measured 12 Nov 2026, PostgreSQL 16.14, Prisma 6.19.3):</p>
<div class="out">findMany (where authorId)      → an               ✓
findFirst                      → an               ✓
count                          → an               ✓
findUnique                     → THAY bai da xoa  ✗
findUniqueOrThrow              → THAY bai da xoa  ✗
groupBy                        → THAY bai da xoa  ✗
user.findMany include posts    → THAY bai da xoa  ✗
$queryRaw                      → THAY bai da xoa  ✗</div>
<div class="kv-grid">
  <div class="kv"><span class="k">✓ findMany · findFirst · count</span><span class="v">Exactly the operations in the list.</span></div>
  <div class="kv"><span class="k">✗ findUnique · findUniqueOrThrow · groupBy</span><span class="v">Not in the list, so not filtered. <code>findUnique</code> accepts an extra non-unique filter, so it can be added:<br><code>findUnique({ where: { id: 1001, deletedAt: null } }) → null</code></span></div>
  <div class="kv"><span class="k">✗ Rows reached through a relation</span><span class="v"><code>user.findMany({ include: { posts: true } })</code> is a query on User; the post hooks never fire and the deleted post came back.</span></div>
  <div class="kv"><span class="k">✗ $queryRaw</span><span class="v">Goes straight to the database. Every raw query must write <code>AND deleted_at IS NULL</code> itself.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — an incomplete soft-delete extension is more dangerous than none.</strong> With no extension, every developer knows they must filter. With one that hides deleted rows from three of eight read paths, people stop writing the filter — and five paths leak. Test the paths your code uses, not the hook.</p>
</div>
<pre><code class="language-sql">ALTER TABLE users DROP CONSTRAINT users_email_key;
CREATE UNIQUE INDEX users_email_con_song ON users (email) WHERE deleted_at IS NULL;</code></pre>
<div class="out">dang ky lai email da xoa mem → P2002 {"modelName":"User","target":["email"]}
sau chi muc unique mot phan (WHERE deleted_at IS NULL) → tao duoc user 2002</div>
<p>A soft-deleted user still owned the email: re-registering failed with P2002 until the unique constraint became a partial unique index. Prisma's schema cannot express the <code>WHERE</code> — it lives in a hand-written migration (Lesson 6.3), and <code>@unique</code> comes off the field.</p>

<h3><code>$use</code> is gone</h3>
<div class="out">typeof prisma.$use = undefined
prisma.$use(...) → TypeError: prisma.$use is not a function</div>
<p>Old tutorials still show <code>prisma.$use(async (params, next) =&gt; …)</code>. In Prisma 6.19.3 the method does not exist, so there is nothing to keep running alongside an extension during a migration: rewrite each branch as a query extension for that model and operation, then delete the call.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Typed</span><span class="v">A query extension gets the real argument type for its model and operation.</span></div>
  <div class="kv"><span class="k">Scoped</span><span class="v">Only the models and operations you name.</span></div>
  <div class="kv"><span class="k">A new client</span><span class="v"><code>$extends</code> returns one; the base client stays available — and unfiltered. Keep it private.</span></div>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Prisma — client extensions</span><span class="lc-sub">prisma.io/docs · All four components, with the type-level helpers</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/result" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">Prisma — result extensions and needs</span><span class="lc-sub">prisma.io/docs · Computed fields, and why they cannot be filtered on</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware" target="_blank" rel="noopener"><span class="lc-ico">🗑️</span><span class="lc-body"><span class="lc-title">Prisma — soft delete, and its caveats</span><span class="lc-sub">prisma.io/docs · The official pattern, including the gaps it does not close</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma-client-extensions" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">prisma-client-extensions</span><span class="lc-sub">github.com · Prisma's own worked examples: audit log, row-level security, caching</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Write the soft-delete extension, then find the include that defeats it</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2><code>$extends</code>: đổi client mà không phải bọc nó</h2>
<p class="lead">Cánh cửa thoát hiểm còn lại không dính gì tới SQL. <code>$extends</code> cho phép bạn thêm trường tính toán, thêm phương thức, và chặn MỌI thao tác — với suy diễn kiểu đầy đủ, khác hẳn cái middleware <code>$use</code> mà nó thay thế. Bài này dựng đủ bốn loại, rồi dành nửa sau cho BA chỗ mà một phần mở rộng soft delete KHÔNG với tới, bởi vì tin rằng nó với tới chính là cách những hàng đã xoá lọt vào một phản hồi.</p>

<h3>Bốn thành phần</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>result</code></span><span class="v">Thêm trường tính toán vào kết quả của một model. Chạy trong JavaScript, SAU khi các hàng về tới nơi.</span></div>
  <div class="kv"><span class="k"><code>model</code></span><span class="v">Thêm phương thức vào <code>prisma.user</code>, <code>prisma.socialPost</code>, hoặc vào <code>$allModels</code>. Chỗ các hàm repository của bạn có thể sống.</span></div>
  <div class="kv"><span class="k"><code>query</code></span><span class="v">Bọc quanh các thao tác. Nhìn thấy đối số, quyết định truyền tiếp cái gì, nhìn thấy kết quả. Bản thay thế cho <code>$use</code>.</span></div>
  <div class="kv"><span class="k"><code>client</code></span><span class="v">Thêm phương thức ở cấp cao nhất vào chính client — <code>prisma.$kiemTraSucKhoe()</code>, <code>prisma.$doThoiGian()</code>.</span></div>
</div>
<pre><code class="language-javascript"><span class="tok-comment">// $extends trả về một client MỚI. Nó KHÔNG sửa cái cũ.</span>
const prismaGoc = new PrismaClient();
const prisma    = prismaGoc.$extends(moRong);   <span class="tok-comment">// ✅ gán kết quả lại</span>

prismaGoc.$extends(moRong);                      <span class="tok-comment">// ❌ chẳng làm gì cả</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — gọi <code>$extends</code> mà không gán là một cú KHÔNG-LÀM-GÌ lặng lẽ.</strong> Không lỗi, không cảnh báo; phần mở rộng đơn giản là không bao giờ chạy, và cái bộ lọc soft delete bạn đang trông cậy vào thì không có ở đó. Hãy export ĐÚNG MỘT client đã mở rộng từ ĐÚNG MỘT module rồi import nó ở mọi nơi — <code>export const prisma = new PrismaClient().$extends(…)</code> — để không còn cái client chưa mở rộng nào nằm đó cho người ta lỡ tay import.</p>
</div>

<h3><code>result</code> — trường tính toán, và cái <code>needs</code> làm chúng chạy được</h3>
<pre><code class="language-javascript">const mediaExt = Prisma.defineExtension({
  name: 'media-url',
  result: {
    user: {
      avatarUrl: {
        needs: { avatarUrl: true },              <span class="tok-comment">// ← những trường nó phụ thuộc vào</span>
        compute(u) {
          if (!u.avatarUrl) return '/images/mac-dinh.png';
          if (u.avatarUrl.startsWith('http')) return u.avatarUrl;
          return &#96;https://media.cuongthai.com/\${u.avatarUrl}&#96;;
        },
      },
    },
    socialPost: {
      daSua: {
        needs: { createdAt: true, updatedAt: true },
        compute: (p) =&gt; p.updatedAt.getTime() - p.createdAt.getTime() &gt; 1000,
      },
    },
  },
});</code></pre>
<pre><code class="language-javascript">const u = await prisma.user.findUniqueOrThrow({ where: { id }, select: { avatarUrl: true } });
console.log(u.avatarUrl);   <span class="tok-comment">// string — và avatarUrl được lấy về TỰ ĐỘNG</span></code></pre>
<div class="out">prisma:query SELECT "public"."User"."avatar_url" FROM "public"."User" WHERE …
https://media.cuongthai.com/avatars/clx7….webp</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>needs</code></span><span class="lz-t">Khai báo phần phụ thuộc</span><span class="lz-d">Chọn mỗi trường tính toán thôi thì Prisma vẫn lấy về những cột nó cần — thêm chúng vào câu SQL rồi gỡ chúng khỏi kết quả. Quên <code>needs</code> thì <code>compute</code> nhận <code>undefined</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Tính trong JavaScript</span><span class="lz-t">Giới hạn CỨNG</span><span class="lz-d">Nó chạy SAU khi các hàng về, nên nó KHÔNG xuất hiện được trong <code>where</code>, <code>orderBy</code>, hay <code>groupBy</code>. "Sắp xếp theo <code>daSua</code>" là không diễn đạt được — cái đó cần một cột thật hoặc một truy vấn thô.</span></div>
  <div class="lz-step"><span class="lz-k">Con bug 02/07/2026, được chặn</span><span class="lz-t">Một chỗ, không phải ba mươi</span><span class="lz-d"><code>getMediaUrl</code> của CuongThai từng gắn tiền tố CDN vào URL xem trước dạng <code>blob:</code> và tạo ra lỗi 400. Chỗ vá thuộc về MỘT hàm <code>compute</code>, không phải mọi component có vẽ ảnh đại diện.</span></div>
  <div class="lz-step"><span class="lz-k"><code>Prisma.defineExtension</code></span><span class="lz-t">Để dùng lại và để có kiểu</span><span class="lz-d">Định nghĩa phần mở rộng tách riêng giữ cho suy diễn kiểu chạy xuyên file, và cho phép ghép nhiều cái: <code>client.$extends(a).$extends(b)</code>.</span></div>
</div>

<h3><code>model</code> và <code>client</code> — phương thức nằm đúng chỗ bạn mong</h3>
<pre><code class="language-javascript">const truyVanExt = Prisma.defineExtension({
  name: 'truy-van-thuong-dung',
  model: {
    user: {
      async findByEmailOrName(q: string) {
        return prisma.user.findFirst({
          where: { OR: [{ email: q }, { username: q }] },
          select: { id: true, username: true, email: true },
        });
      },
    },
    $allModels: {
      async exists&lt;T&gt;(this: T, where: Prisma.Args&lt;T, 'findFirst'&gt;['where']): Promise&lt;boolean&gt; {
        const ctx = Prisma.getExtensionContext(this);
        const n = await (ctx as any).count({ where, take: 1 });
        return n &gt; 0;
      },
    },
  },
  client: {
    async $kiemTraSucKhoe() {
      const t = process.hrtime.bigint();
      await (Prisma.getExtensionContext(this) as any).$queryRaw&#96;SELECT 1&#96;;
      return Number(process.hrtime.bigint() - t) / 1e6;
    },
  },
});</code></pre>
<pre><code class="language-typescript">await prisma.user.findByEmailOrName('an@vidu.com');
await prisma.socialPost.exists({ id: postId });   <span class="tok-comment">// có trên MỌI model</span>
await prisma.$kiemTraSucKhoe();                    <span class="tok-comment">// → 1,84 (ms)</span></code></pre>
<div class="callout ok">
<p><strong><code>$allModels</code> cộng <code>Prisma.getExtensionContext(this)</code> là cách viết MỘT phương thức dùng cho MỌI model.</strong> <code>this</code> bên trong phương thức chính là cái delegate model mà nó được gọi lên, và <code>getExtensionContext</code> trao cho bạn một tay cầm có kiểu đàng hoàng vào đó. Đây là thứ gần nhất với một lớp repository cơ sở mà Prisma có, mà không mang theo tí kế thừa nào.</p>
</div>

<h3><code>query</code> — soft delete, và nó THẬT SỰ phủ tới đâu</h3>
<pre><code class="language-javascript">const softDelete = Prisma.defineExtension({
  name: 'soft-delete',
  query: {
    post: {
      async delete({ args })     { return base.post.update({ ...args, data: { deletedAt: new Date() } }); },
      async deleteMany({ args }) { return base.post.updateMany({ ...args, data: { deletedAt: new Date() } }); },
      async $allOperations({ operation, args, query }) {
        if (['findMany', 'findFirst', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});
const prisma = base.$extends(softDelete);
await prisma.post.delete({ where: { id: 1001 } });</code></pre>
<div class="out">delete → UPDATE "posts" SET "deleted_at" = $1 WHERE ("posts"."id" = $2 AND 1=1) RETURNING …</div>
<p>Hàng vẫn còn và <code>deleted_at</code> được đặt. Rồi bài đã xoá được đọc theo tám cách (đo ngày 12/11/2026, PostgreSQL 16.14, Prisma 6.19.3):</p>
<div class="out">findMany (where authorId)      → an               ✓
findFirst                      → an               ✓
count                          → an               ✓
findUnique                     → THAY bai da xoa  ✗
findUniqueOrThrow              → THAY bai da xoa  ✗
groupBy                        → THAY bai da xoa  ✗
user.findMany include posts    → THAY bai da xoa  ✗
$queryRaw                      → THAY bai da xoa  ✗</div>
<div class="kv-grid">
  <div class="kv"><span class="k">✓ findMany · findFirst · count</span><span class="v">Đúng những thao tác có trong danh sách.</span></div>
  <div class="kv"><span class="k">✗ findUnique · findUniqueOrThrow · groupBy</span><span class="v">Không có trong danh sách nên không bị lọc. <code>findUnique</code> nhận thêm một bộ lọc không-unique, nên có thể thêm nó vào:<br><code>findUnique({ where: { id: 1001, deletedAt: null } }) → null</code></span></div>
  <div class="kv"><span class="k">✗ Hàng đi qua quan hệ</span><span class="v"><code>user.findMany({ include: { posts: true } })</code> là truy vấn trên User; hook của post không bao giờ chạy và bài đã xoá quay lại.</span></div>
  <div class="kv"><span class="k">✗ $queryRaw</span><span class="v">Đi thẳng tới cơ sở dữ liệu. Mọi truy vấn thô phải tự viết <code>AND deleted_at IS NULL</code>.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một extension xoá mềm không đủ còn nguy hiểm hơn không có.</strong> Không có extension, ai cũng biết phải tự lọc. Có một extension ẩn hàng đã xoá ở ba trên tám đường đọc, người ta thôi viết bộ lọc — và năm đường làm lộ. Hãy kiểm các đường mà mã của bạn dùng, đừng chỉ kiểm cái hook.</p>
</div>
<pre><code class="language-sql">ALTER TABLE users DROP CONSTRAINT users_email_key;
CREATE UNIQUE INDEX users_email_con_song ON users (email) WHERE deleted_at IS NULL;</code></pre>
<div class="out">dang ky lai email da xoa mem → P2002 {"modelName":"User","target":["email"]}
sau chi muc unique mot phan (WHERE deleted_at IS NULL) → tao duoc user 2002</div>
<p>Người dùng đã xoá mềm vẫn giữ email: đăng ký lại hỏng với P2002 cho tới khi ràng buộc unique thành chỉ mục unique một phần. Lược đồ Prisma không diễn đạt được <code>WHERE</code> — nó nằm trong một migration viết tay (Bài 6.3), và bỏ <code>@unique</code> khỏi trường.</p>

<h3><code>$use</code> đã bị gỡ</h3>
<div class="out">typeof prisma.$use = undefined
prisma.$use(...) → TypeError: prisma.$use is not a function</div>
<p>Hướng dẫn cũ vẫn chỉ <code>prisma.$use(async (params, next) =&gt; …)</code>. Ở Prisma 6.19.3 phương thức này không còn, nên chẳng có gì để chạy song song với extension trong lúc chuyển: viết lại mỗi nhánh thành một extension query cho đúng model và thao tác, rồi xoá lời gọi.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Có kiểu</span><span class="v">Extension query nhận đúng kiểu đối số của model và thao tác.</span></div>
  <div class="kv"><span class="k">Có phạm vi</span><span class="v">Chỉ những model và thao tác bạn khai.</span></div>
  <div class="kv"><span class="k">Một client mới</span><span class="v"><code>$extends</code> trả về một client mới; client gốc vẫn còn — và không bị lọc. Hãy giữ nó riêng tư.</span></div>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Prisma — phần mở rộng client</span><span class="lc-sub">prisma.io/docs · Cả bốn thành phần, kèm các hàm phụ ở mức kiểu</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/result" target="_blank" rel="noopener"><span class="lc-ico">🧮</span><span class="lc-body"><span class="lc-title">Prisma — result extension và needs</span><span class="lc-sub">prisma.io/docs · Trường tính toán, và vì sao không lọc theo chúng được</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware" target="_blank" rel="noopener"><span class="lc-ico">🗑️</span><span class="lc-body"><span class="lc-title">Prisma — soft delete và những điều cần lưu ý</span><span class="lc-sub">prisma.io/docs · Mẫu chính thức, kể cả những khoảng hở nó KHÔNG bịt</span></span></a>
<a class="link-card" href="https://github.com/prisma/prisma-client-extensions" target="_blank" rel="noopener"><span class="lc-ico">📚</span><span class="lc-body"><span class="lc-title">prisma-client-extensions</span><span class="lc-sub">github.com · Ví dụ làm sẵn của chính Prisma: nhật ký kiểm toán, bảo mật mức hàng, cache</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Viết phần mở rộng soft delete, rồi tự tìm ra cái include hạ gục nó</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: escape hatches|||10.6 — Quiz: cửa thoát hiểm',
      slug: 'pr-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về $queryRaw đối lại Unsafe, ánh xạ kiểu và @map, thứ chỉ SQL nói được, TypedSQL, và những khoảng hở của một phần mở rộng soft delete.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.6</span>
<h2>Quiz: escape hatches</h2>
<p class="lead">Eight questions on leaving the query builder safely. Two of them have an answer that looks paranoid and is not — those are the ones worth getting wrong now rather than in production.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> The tagged template is the security boundary; <code>Unsafe</code> means it (10.1). The generic on <code>$queryRaw</code> is an assertion nothing verifies, and raw SQL speaks database names (10.2). Window functions, recursion, <code>LATERAL</code>, conflict expressions and full-text ranking have no builder equivalent (10.3). TypedSQL moves the check to build time, at the price of a database in CI (10.4). <code>$extends</code> adds behaviour with real types — and a soft-delete extension does not reach raw queries, relation includes, or database cascades (10.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.6</span>
<h2>Quiz: cửa thoát hiểm</h2>
<p class="lead">Tám câu về việc rời khỏi trình dựng truy vấn một cách an toàn. Hai câu có đáp án trông có vẻ hoang tưởng mà thật ra không — đó chính là những câu đáng sai BÂY GIỜ hơn là sai trên production.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Thẻ mẫu chính là ranh giới bảo mật; chữ <code>Unsafe</code> nói thật (10.1). Cái generic trên <code>$queryRaw</code> là một lời khẳng định không ai xác minh, và SQL thô nói tiếng của cơ sở dữ liệu (10.2). Window function, đệ quy, <code>LATERAL</code>, biểu thức khi xung đột và xếp hạng toàn văn không có thứ tương đương trong trình dựng (10.3). TypedSQL dời phép kiểm về lúc build, đổi lấy một cơ sở dữ liệu trong CI (10.4). <code>$extends</code> thêm hành vi kèm kiểu thật — và một phần mở rộng soft delete KHÔNG với tới truy vấn thô, include quan hệ, hay cascade của cơ sở dữ liệu (10.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'One call is a tagged template (no parentheses) and the other takes an already-built string. What is the actual difference?|||Một lời gọi là thẻ mẫu (không có dấu ngoặc), lời gọi kia nhận một chuỗi đã dựng sẵn. Khác biệt THẬT là gì?',
            options: [
              'The tagged template hands Prisma the string pieces and the values separately, so the value becomes a bind parameter and can never be parsed as SQL; the Unsafe call receives one already-concatenated string|||Thẻ mẫu trao cho Prisma các mẩu chuỗi và các giá trị RIÊNG RA, nên giá trị thành tham số ràng buộc và không bao giờ được phân tích thành SQL; còn lời gọi Unsafe nhận về một chuỗi ĐÃ nối sẵn',
              'Unsafe is slower because it re-parses the query|||Unsafe chậm hơn vì nó phân tích lại câu truy vấn',
              'Unsafe cannot be used inside a transaction|||Unsafe không dùng được bên trong một giao dịch',
              'There is no difference; Unsafe is just the older name|||Không có khác biệt gì; Unsafe chỉ là tên cũ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your schema maps field avatarUrl to column avatar_url, and the model to table users. What does a raw query have to write?|||Lược đồ của bạn ánh xạ trường avatarUrl sang cột avatar_url, và model sang bảng users. Truy vấn thô phải viết gì?',
            options: [
              'SELECT "avatarUrl" FROM "User" — Prisma applies @map to raw queries too|||SELECT "avatarUrl" FROM "User" — Prisma áp @map cho cả truy vấn thô',
              'SELECT avatar_url FROM users — raw SQL uses the real database names, and the returned key is avatar_url too|||SELECT avatar_url FROM users — SQL thô dùng tên THẬT của cơ sở dữ liệu, và khoá trả về cũng là avatar_url',
              'Either form works; PostgreSQL resolves both|||Viết kiểu nào cũng được; PostgreSQL phân giải được cả hai',
              'Raw queries cannot be used on models that use @map|||Không dùng được truy vấn thô trên model có @map',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A raw query does SELECT count(*) AS n and the result goes to res.json(). What happens?|||Một truy vấn thô làm SELECT count(*) AS n rồi kết quả đi vào res.json(). Chuyện gì xảy ra?',
            options: [
              'It works; count returns a JavaScript number|||Chạy bình thường; count trả về một number của JavaScript',
              'It throws "Do not know how to serialize a BigInt" — count(*) comes back as BigInt; cast it in SQL with ::int|||Nó ném "Do not know how to serialize a BigInt" — count(*) quay về dạng BigInt; hãy ép kiểu ngay trong SQL bằng ::int',
              'It silently returns null for that field|||Nó lặng lẽ trả về null cho trường đó',
              'It rounds the value to the nearest integer|||Nó làm tròn giá trị tới số nguyên gần nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You need the 3 most recent posts for each of 50 authors. What is the right tool?|||Bạn cần 3 bài mới nhất của MỖI người trong 50 tác giả. Công cụ đúng là gì?',
            options: [
              'A loop calling findMany with take: 3 per author — 51 queries is fine|||Một vòng lặp gọi findMany với take: 3 cho mỗi tác giả — 51 truy vấn cũng không sao',
              'include: { posts: { take: 3 } } — Prisma optimises this into one query|||include: { posts: { take: 3 } } — Prisma tự tối ưu thành một truy vấn',
              'One raw query with CROSS JOIN LATERAL, backed by @@index([authorId, createdAt(sort: Desc)]) — 1 query instead of 51|||Một truy vấn thô dùng CROSS JOIN LATERAL, có @@index([authorId, createdAt(sort: Desc)]) đỡ phía sau — 1 truy vấn thay vì 51',
              'Fetch every post and take the top 3 per author in JavaScript|||Lấy hết mọi bài rồi lọc top 3 mỗi tác giả trong JavaScript',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What does a recursive CTE need that a non-recursive one does not?|||Một CTE đệ quy cần thứ gì mà CTE thường không cần?',
            options: [
              'A depth guard (and ideally a visited-path array): without one, a single parentId pointing at its own descendant generates rows until the connection dies|||Một chốt chặn độ sâu (và tốt nhất là một mảng đường đã đi): thiếu nó, chỉ một parentId trỏ vào chính hậu duệ của nó là sinh hàng cho tới khi kết nối chết',
              'A unique index on the parent column|||Một chỉ mục duy nhất trên cột cha',
              'An explicit transaction|||Một giao dịch tường minh',
              'Nothing extra; PostgreSQL detects cycles automatically|||Không cần gì thêm; PostgreSQL tự phát hiện chu trình',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the real operational cost of adopting TypedSQL?|||Cái giá VẬN HÀNH thật của việc dùng TypedSQL là gì?',
            options: [
              'It slows down every query at runtime|||Nó làm chậm mọi truy vấn lúc chạy',
              'CI needs a live, already-migrated database, because prisma generate --sql prepares each statement against the real server|||CI cần một cơ sở dữ liệu SỐNG và ĐÃ migrate, vì prisma generate --sql phải chuẩn bị từng câu lệnh trên máy chủ thật',
              'It only works with MySQL|||Nó chỉ chạy với MySQL',
              'It replaces the Prisma query builder entirely|||Nó thay thế hoàn toàn trình dựng truy vấn của Prisma',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You add a soft-delete $extends that filters findMany on SocialPost. Which call still returns deleted posts?|||Bạn thêm một $extends soft delete lọc findMany trên SocialPost. Lời gọi nào VẪN trả về bài đã xoá?',
            options: [
              'prisma.socialPost.findMany({ where: { authorId } })',
              'prisma.socialPost.count()',
              'prisma.user.findMany({ include: { posts: true } }) — that is a findMany on User, so the socialPost hooks never fire|||prisma.user.findMany({ include: { posts: true } }) — đó là findMany trên User, nên các móc socialPost không bao giờ nổ',
              'prisma.socialPost.findFirst({ where: { id } })',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why does calling $extends on a client without assigning the result do nothing?|||Vì sao gọi $extends trên một client mà không gán kết quả lại chẳng làm gì?',
            options: [
              'The extension needs a name property|||Phần mở rộng cần có thuộc tính name',
              '$extends returns a NEW client and does not mutate the original — you must assign and export the returned one|||$extends trả về một client MỚI và không sửa cái gốc — bạn phải gán và export cái được trả về',
              'It only works after prisma.$connect()|||Nó chỉ chạy sau khi gọi prisma.$connect()',
              'Extensions must be registered in schema.prisma|||Phần mở rộng phải được đăng ký trong schema.prisma',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
