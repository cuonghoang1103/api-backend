/**
 * Prisma ORM — Chương 10: Cửa thoát hiểm — SQL thô và phần mở rộng client.
 * $queryRaw an toàn đối lại Unsafe · kiểu của kết quả thô là lời hứa suông · thứ chỉ SQL làm được ·
 * TypedSQL · $extends · quiz.
 * Output CHẠY THẬT Prisma 6.x + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
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
<pre><code><span class="tok-comment">// Tagged template — note: NO parentheses after the function name</span>
const nguoiDung = await prisma.$queryRaw&#96;
  SELECT id, username FROM "User" WHERE email = \${email}&#96;;

<span class="tok-comment">// String argument — note: parentheses. A completely different function.</span>
const nguoiDung = await prisma.$queryRawUnsafe(
  &#96;SELECT id, username FROM "User" WHERE email = '\${email}'&#96;   <span class="tok-comment">// ← danger</span>
);</code></pre>
<div class="callout warn">
<p><strong>The difference is a pair of parentheses, and it is the whole security boundary.</strong> With the tagged template, JavaScript hands Prisma the string <em>pieces</em> and the values <em>separately</em>; Prisma emits <code>WHERE email = $1</code> and ships the value in the bind slot, where it can never be parsed as SQL. With <code>Unsafe</code>, the value has already been concatenated into the string by the time Prisma sees it — there is nothing left to protect. This is why the safe form has no parentheses: you cannot accidentally build the string first.</p>
</div>

<h3>What each one actually sends</h3>
<pre><code><span class="tok-comment">// Log the SQL to see it (Lesson 9.1's $on('query'))</span>
await prisma.$queryRaw&#96;SELECT * FROM "User" WHERE email = \${'a@b.com'} AND "isActive" = \${true}&#96;;</code></pre>
<div class="out">prisma:query SELECT * FROM "User" WHERE email = $1 AND "isActive" = $2
prisma:query params: ["a@b.com", true]</div>
<pre><code>const n = await prisma.$executeRaw&#96;
  UPDATE "SocialPost" SET "deletedAt" = now() WHERE "authorId" = \${userId}&#96;;
console.log(n);</code></pre>
<div class="out">prisma:query UPDATE "SocialPost" SET "deletedAt" = now() WHERE "authorId" = $1
14</div>
<div class="pitfall">
<p><strong>Bẫy — <code>$executeRaw</code> returns a count, and people <code>await</code> it expecting rows.</strong> <code>const rows = await prisma.$executeRaw&#96;SELECT …&#96;</code> compiles, runs, and hands you the number <code>0</code> — because <code>SELECT</code> affects no rows. The type is <code>Promise&lt;number&gt;</code>, so TypeScript will complain the moment you index it; if you wrote <code>any</code> anywhere upstream, it fails silently at runtime instead. <code>SELECT</code> is always <code>$queryRaw</code>.</p>
</div>

<h3>The attack, run for real</h3>
<pre><code><span class="tok-comment">// A "search by email" endpoint, written the unsafe way</span>
app.get('/tim', async (req, res) =&gt; {
  const rows = await prisma.$queryRawUnsafe(
    &#96;SELECT id, username FROM "User" WHERE email = '\${req.query.email}'&#96;
  );
  res.json(rows);
});</code></pre>
<pre><code><span class="tok-comment"># Normal use</span>
curl "localhost:3000/tim?email=an@vidu.com"</code></pre>
<div class="out">[{"id":"clx7…","username":"an"}]</div>
<pre><code><span class="tok-comment"># The same endpoint, with a quote in the value</span>
curl --get "localhost:3000/tim" --data-urlencode "email=x' OR 1=1 --"</code></pre>
<div class="out">[{"id":"clx7…","username":"an"},
 {"id":"clx8…","username":"binh"},
 {"id":"clx9…","username":"admin"},
 … 12,847 rows …]</div>
<pre><code><span class="tok-comment"># And the SQL that actually ran</span>
SELECT id, username FROM "User" WHERE email = 'x' OR 1=1 --'</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The quote closes the literal</span><span class="lz-d"><code>'x'</code> ends where the attacker's own quote ends it, and everything after is parsed as SQL, not as data.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>OR 1=1</code> makes the filter useless</span><span class="lz-d">Every row matches. The endpoint that returns one user now returns the table.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>--</code> hides the wreckage</span><span class="lz-d">The trailing quote that would have been a syntax error is now a comment. The query is valid SQL, so there is no error in the log — just a very large response.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The same input against <code>$queryRaw</code></span><span class="lz-d">Returns <code>[]</code>. There is no user whose email is literally the string <code>x' OR 1=1 --</code>, and that is the only question the parameterised query ever asks.</span></div>
</div>
<div class="callout ok">
<p><strong>Escaping the quotes yourself is not the fix.</strong> Every "sanitise the input" scheme has been broken by an encoding nobody thought about — backslash escapes, multi-byte characters that swallow the escape byte, a second decode layer between your check and the database. Bind parameters are not an escaping scheme: the value never enters the SQL text at all, so there is no parse step for it to influence. That is a categorical difference, not a stronger filter.</p>
</div>

<h3>Dynamic queries that stay parameterised</h3>
<pre><code><span class="tok-comment">// The problem: the filters depend on what the caller sent</span>
import { Prisma } from '@prisma/client';

const dieuKien: Prisma.Sql[] = [Prisma.sql&#96;"deletedAt" IS NULL&#96;];
if (tuKhoa)  dieuKien.push(Prisma.sql&#96;content ILIKE \${'%' + tuKhoa + '%'}&#96;);
if (tacGia)  dieuKien.push(Prisma.sql&#96;"authorId" = \${tacGia}&#96;);
if (tuNgay)  dieuKien.push(Prisma.sql&#96;"createdAt" &gt;= \${tuNgay}&#96;);

const rows = await prisma.$queryRaw&#96;
  SELECT id, content, "createdAt"
  FROM "SocialPost"
  WHERE \${Prisma.join(dieuKien, ' AND ')}
  ORDER BY "createdAt" DESC
  LIMIT \${gioiHan}&#96;;</code></pre>
<div class="out">prisma:query SELECT id, content, "createdAt" FROM "SocialPost"
             WHERE "deletedAt" IS NULL AND content ILIKE $1 AND "authorId" = $2
             ORDER BY "createdAt" DESC LIMIT $3
prisma:query params: ["%prisma%", "clx7…", 20]</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.sql&#96;…&#96;</code></span><span class="lz-lnote">A fragment that carries its own bind parameters. Composing two fragments composes their parameters correctly — you never renumber <code>$1</code>, <code>$2</code> by hand.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.join(list, ' AND ')</code></span><span class="lz-lnote">Glues fragments with a separator. The separator is a plain string and must be a constant you wrote — it is SQL text, not data.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.empty</code></span><span class="lz-lnote">The zero-length fragment, for the branch where a clause is absent. <code>WHERE \${dieuKien ?? Prisma.empty}</code> avoids building two versions of the query.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.raw('…')</code></span><span class="lz-lnote"><strong>Injects text verbatim.</strong> It exists for identifiers — a column name to sort by — and it is the one place inside the safe API where user input must never reach. Whitelist, always: <code>const cot = ({ moi: 'createdAt', ten: 'title' })[req.query.sort] ?? 'createdAt';</code></span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — you cannot parameterise an identifier.</strong> <code>ORDER BY \${cot}</code> inside <code>$queryRaw</code> sends <code>ORDER BY $1</code>, and PostgreSQL sorts every row by the constant string — no error, wrong results, and it looks like the sort is "just not working". Table names, column names, <code>ASC</code>/<code>DESC</code> and <code>LIMIT</code> keywords are SQL <em>text</em>. They go through <code>Prisma.raw</code>, from a whitelist, or they do not go at all.</p>
</div>
<div class="note-ct">
<p><strong>The habit that removes the whole class of bug.</strong> Grep the repository for <code>RawUnsafe</code> in CI and fail the build on any new occurrence outside an allow-listed file. On CuongThai there are two legitimate uses — a maintenance script that vacuums a table chosen from a fixed list, and a migration helper — and both are in files the check names explicitly. Everything else uses the tagged template. A rule a machine enforces is worth more than a rule in a document nobody re-reads.</p>
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
<pre><code><span class="tok-comment">// Thẻ mẫu — chú ý: KHÔNG có dấu ngoặc sau tên hàm</span>
const nguoiDung = await prisma.$queryRaw&#96;
  SELECT id, username FROM "User" WHERE email = \${email}&#96;;

<span class="tok-comment">// Đối số là chuỗi — chú ý: CÓ dấu ngoặc. Một hàm hoàn toàn khác.</span>
const nguoiDung = await prisma.$queryRawUnsafe(
  &#96;SELECT id, username FROM "User" WHERE email = '\${email}'&#96;   <span class="tok-comment">// ← nguy hiểm</span>
);</code></pre>
<div class="callout warn">
<p><strong>Khác biệt là MỘT CẶP DẤU NGOẶC, và nó chính là toàn bộ ranh giới bảo mật.</strong> Với thẻ mẫu, JavaScript trao cho Prisma các <em>mẩu chuỗi</em> và các <em>giá trị</em> RIÊNG RA; Prisma phát ra <code>WHERE email = $1</code> rồi gửi giá trị qua ô ràng buộc, nơi nó không bao giờ được phân tích thành SQL. Với <code>Unsafe</code>, giá trị ĐÃ được nối vào chuỗi trước khi Prisma kịp nhìn thấy — chẳng còn gì để bảo vệ. Đó là lý do dạng an toàn KHÔNG có dấu ngoặc: bạn không thể vô tình dựng chuỗi trước.</p>
</div>

<h3>Mỗi cái THẬT SỰ gửi đi cái gì</h3>
<pre><code><span class="tok-comment">// Ghi nhật ký SQL để nhìn (dùng $on('query') của Bài 9.1)</span>
await prisma.$queryRaw&#96;SELECT * FROM "User" WHERE email = \${'a@b.com'} AND "isActive" = \${true}&#96;;</code></pre>
<div class="out">prisma:query SELECT * FROM "User" WHERE email = $1 AND "isActive" = $2
prisma:query params: ["a@b.com", true]</div>
<pre><code>const n = await prisma.$executeRaw&#96;
  UPDATE "SocialPost" SET "deletedAt" = now() WHERE "authorId" = \${userId}&#96;;
console.log(n);</code></pre>
<div class="out">prisma:query UPDATE "SocialPost" SET "deletedAt" = now() WHERE "authorId" = $1
14</div>
<div class="pitfall">
<p><strong>Bẫy — <code>$executeRaw</code> trả về một CON SỐ, mà người ta cứ <code>await</code> nó và chờ các hàng.</strong> <code>const rows = await prisma.$executeRaw&#96;SELECT …&#96;</code> biên dịch được, chạy được, và trao cho bạn số <code>0</code> — vì <code>SELECT</code> không ảnh hưởng hàng nào. Kiểu của nó là <code>Promise&lt;number&gt;</code>, nên TypeScript sẽ kêu ngay khi bạn lấy chỉ số; còn nếu ở đâu đó phía trên bạn lỡ viết <code>any</code>, nó hỏng LẶNG LẼ lúc chạy. <code>SELECT</code> thì LUÔN là <code>$queryRaw</code>.</p>
</div>

<h3>Cú tấn công, chạy thật</h3>
<pre><code><span class="tok-comment">// Một endpoint "tìm theo email", viết theo kiểu không an toàn</span>
app.get('/tim', async (req, res) =&gt; {
  const rows = await prisma.$queryRawUnsafe(
    &#96;SELECT id, username FROM "User" WHERE email = '\${req.query.email}'&#96;
  );
  res.json(rows);
});</code></pre>
<pre><code><span class="tok-comment"># Dùng bình thường</span>
curl "localhost:3000/tim?email=an@vidu.com"</code></pre>
<div class="out">[{"id":"clx7…","username":"an"}]</div>
<pre><code><span class="tok-comment"># Cũng endpoint đó, với một dấu nháy trong giá trị</span>
curl --get "localhost:3000/tim" --data-urlencode "email=x' OR 1=1 --"</code></pre>
<div class="out">[{"id":"clx7…","username":"an"},
 {"id":"clx8…","username":"binh"},
 {"id":"clx9…","username":"admin"},
 … 12.847 hang …]</div>
<pre><code><span class="tok-comment"># Và đây là câu SQL thật sự đã chạy</span>
SELECT id, username FROM "User" WHERE email = 'x' OR 1=1 --'</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dấu nháy đóng chuỗi lại</span><span class="lz-d"><code>'x'</code> kết thúc đúng chỗ dấu nháy của kẻ tấn công kết thúc nó, và mọi thứ phía sau được phân tích thành SQL, không phải thành dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>OR 1=1</code> làm bộ lọc thành vô nghĩa</span><span class="lz-d">Mọi hàng đều khớp. Cái endpoint lẽ ra trả về một người dùng giờ trả về cả bảng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>--</code> che đi đống đổ nát</span><span class="lz-d">Dấu nháy thừa ở cuối, thứ lẽ ra gây lỗi cú pháp, giờ thành chú thích. Câu truy vấn là SQL HỢP LỆ, nên nhật ký không có lỗi nào — chỉ có một phản hồi rất lớn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cũng đầu vào đó, với <code>$queryRaw</code></span><span class="lz-d">Trả về <code>[]</code>. Không có người dùng nào email đúng bằng chuỗi <code>x' OR 1=1 --</code>, và đó là câu hỏi DUY NHẤT mà truy vấn tham số hoá từng đặt ra.</span></div>
</div>
<div class="callout ok">
<p><strong>Tự đi thoát dấu nháy KHÔNG phải cách vá.</strong> Mọi sơ đồ "làm sạch đầu vào" đều đã từng bị phá bằng một cách mã hoá không ai nghĩ tới — thoát bằng gạch chéo ngược, ký tự nhiều byte nuốt mất byte thoát, một tầng giải mã thứ hai nằm giữa chỗ bạn kiểm và cơ sở dữ liệu. Tham số ràng buộc KHÔNG phải một sơ đồ thoát ký tự: giá trị KHÔNG BAO GIỜ đi vào phần chữ của câu SQL, nên chẳng có bước phân tích nào cho nó tác động vào. Đó là khác biệt về BẢN CHẤT, không phải một bộ lọc mạnh hơn.</p>
</div>

<h3>Truy vấn động mà vẫn tham số hoá</h3>
<pre><code><span class="tok-comment">// Vấn đề: các bộ lọc phụ thuộc vào thứ người gọi gửi lên</span>
import { Prisma } from '@prisma/client';

const dieuKien: Prisma.Sql[] = [Prisma.sql&#96;"deletedAt" IS NULL&#96;];
if (tuKhoa)  dieuKien.push(Prisma.sql&#96;content ILIKE \${'%' + tuKhoa + '%'}&#96;);
if (tacGia)  dieuKien.push(Prisma.sql&#96;"authorId" = \${tacGia}&#96;);
if (tuNgay)  dieuKien.push(Prisma.sql&#96;"createdAt" &gt;= \${tuNgay}&#96;);

const rows = await prisma.$queryRaw&#96;
  SELECT id, content, "createdAt"
  FROM "SocialPost"
  WHERE \${Prisma.join(dieuKien, ' AND ')}
  ORDER BY "createdAt" DESC
  LIMIT \${gioiHan}&#96;;</code></pre>
<div class="out">prisma:query SELECT id, content, "createdAt" FROM "SocialPost"
             WHERE "deletedAt" IS NULL AND content ILIKE $1 AND "authorId" = $2
             ORDER BY "createdAt" DESC LIMIT $3
prisma:query params: ["%prisma%", "clx7…", 20]</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.sql&#96;…&#96;</code></span><span class="lz-lnote">Một mẩu câu MANG THEO tham số ràng buộc của chính nó. Ghép hai mẩu thì ghép luôn tham số cho đúng — bạn không bao giờ phải tự đánh lại số <code>$1</code>, <code>$2</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.join(danhSach, ' AND ')</code></span><span class="lz-lnote">Dán các mẩu bằng một dấu phân cách. Dấu phân cách là chuỗi thường và PHẢI là hằng do chính bạn viết — nó là chữ SQL, không phải dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.empty</code></span><span class="lz-lnote">Mẩu rỗng, cho nhánh mà một mệnh đề vắng mặt. <code>WHERE \${dieuKien ?? Prisma.empty}</code> giúp khỏi phải dựng hai phiên bản của câu truy vấn.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>Prisma.raw('…')</code></span><span class="lz-lnote"><strong>Chèn chữ NGUYÊN XI.</strong> Nó tồn tại cho định danh — một tên cột để sắp xếp — và là chỗ DUY NHẤT bên trong API an toàn mà đầu vào người dùng KHÔNG BAO GIỜ được chạm tới. Danh sách trắng, luôn luôn: <code>const cot = ({ moi: 'createdAt', ten: 'title' })[req.query.sort] ?? 'createdAt';</code></span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — KHÔNG tham số hoá được một định danh.</strong> <code>ORDER BY \${cot}</code> bên trong <code>$queryRaw</code> gửi đi <code>ORDER BY $1</code>, và PostgreSQL sắp mọi hàng theo một chuỗi hằng — không lỗi, kết quả sai, và nhìn cứ như "sắp xếp tự nhiên không chạy". Tên bảng, tên cột, từ khoá <code>ASC</code>/<code>DESC</code> và <code>LIMIT</code> đều là CHỮ SQL. Chúng đi qua <code>Prisma.raw</code>, lấy từ một danh sách trắng, hoặc không đi đâu cả.</p>
</div>
<div class="note-ct">
<p><strong>Thói quen xoá sạch cả một LỚP bug.</strong> Cho CI grep kho mã tìm <code>RawUnsafe</code> và làm hỏng bản dựng khi có chỗ mới nào nằm ngoài danh sách file được phép. Trên CuongThai có hai chỗ dùng chính đáng — một script bảo trì chạy vacuum trên bảng chọn từ danh sách cố định, và một hàm phụ cho migration — cả hai đều nằm trong những file mà phép kiểm gọi tên tường minh. Còn lại dùng thẻ mẫu hết. Một luật do MÁY cưỡng chế đáng giá hơn một luật nằm trong tài liệu không ai đọc lại.</p>
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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>The type parameter on <code>$queryRaw</code> is a promise nobody checks</h2>
<p class="lead">Once you leave the query builder you also leave the type system — not obviously, which is the problem. <code>$queryRaw&lt;User[]&gt;</code> compiles into a plain cast, so TypeScript will happily let you read a field the query never selected. This lesson shows exactly where the guarantee stops, the four value conversions that surprise people, and how to put a real check back at the boundary.</p>

<h3>What the generic actually does</h3>
<pre><code><span class="tok-comment">// It looks like the query returns User rows</span>
const users = await prisma.$queryRaw&lt;User[]&gt;&#96;SELECT id FROM "User" LIMIT 3&#96;;

console.log(users[0].email.toLowerCase());   <span class="tok-comment">// tsc: fine. Runtime: ?</span></code></pre>
<div class="out">TypeError: Cannot read properties of undefined (reading 'toLowerCase')</div>
<pre><code><span class="tok-comment">// The signature, simplified</span>
$queryRaw&lt;T = unknown&gt;(query: TemplateStringsArray, ...values: any[]): PrismaPromise&lt;T&gt;

<span class="tok-comment">// T is never derived from the SQL. It is whatever you typed.</span>
<span class="tok-comment">// The compiler has no way to read the string and check it.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Builder</span><span class="lz-t">Types derived</span><span class="lz-d"><code>findMany({ select: { id: true } })</code> returns <code>{ id: string }[]</code> — computed from the argument you passed. Ask for <code>.email</code> and the compiler stops you.</span></div>
  <div class="lz-step"><span class="lz-k">Raw</span><span class="lz-t">Types asserted</span><span class="lz-d"><code>$queryRaw&lt;User[]&gt;</code> is you telling the compiler what to believe. It believes you. Nothing verifies it — not at build, not at run.</span></div>
  <div class="lz-step"><span class="lz-k">The drift</span><span class="lz-t">Where it bites</span><span class="lz-d">A migration renames a column. Every builder query is a compile error. Every raw query still compiles, and starts returning <code>undefined</code> for that field in production.</span></div>
  <div class="lz-step"><span class="lz-k">The fix</span><span class="lz-t">Two of them</span><span class="lz-d">Validate at the boundary with a schema (below), or use <strong>TypedSQL</strong> (Lesson 10.4), which reads the <code>.sql</code> file at generate time and derives the type from the real database.</span></div>
</div>

<h3>Conversion 1 — <code>count(*)</code> is a BigInt, and it breaks <code>res.json</code></h3>
<pre><code>const rows = await prisma.$queryRaw&#96;
  SELECT "authorId", count(*) AS so_bai
  FROM "SocialPost" GROUP BY "authorId"&#96;;
console.log(rows[0]);
res.json(rows);</code></pre>
<div class="out">{ authorId: 'clx7…', so_bai: 14n }        ← note the n

TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (&lt;anonymous&gt;)
    at ServerResponse.json (express/lib/response.js:1150:14)</div>
<pre><code><span class="tok-comment">-- Fix at the source: cast in the SQL</span>
SELECT "authorId", count(*)::int AS so_bai FROM "SocialPost" GROUP BY "authorId";</code></pre>
<div class="out">{ authorId: 'clx7…', so_bai: 14 }         ← a plain number</div>
<div class="callout ok">
<p><strong>Cast in SQL, do not convert in JavaScript.</strong> <code>Number(row.so_bai)</code> works but must be repeated at every call site and forgotten at exactly one of them. <code>::int</code> fixes it once, at the place the value is produced, for every caller — and it documents the intent to the next reader of the query. Use <code>::bigint</code> deliberately when a count really can exceed 2<sup>31</sup>, and then handle the BigInt on purpose.</p>
</div>

<h3>Conversion 2 — <code>Decimal</code> stays a Decimal object</h3>
<pre><code>const rows = await prisma.$queryRaw&#96;SELECT id, gia FROM "Order" LIMIT 1&#96;;
console.log(rows[0].gia, typeof rows[0].gia);
console.log(rows[0].gia + 100);</code></pre>
<div class="out">Decimal { s: 1, e: 5, d: [ 249000 ] } object
249000100        ← string concatenation, not addition</div>
<pre><code><span class="tok-comment">// Decimal has its own arithmetic. Use it, or convert explicitly.</span>
rows[0].gia.plus(100).toString();     <span class="tok-comment">// '249100'  — exact</span>
rows[0].gia.toNumber() + 100;         <span class="tok-comment">// 249100    — float, loses precision above 2^53</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>Decimal + number</code> is a silent string concatenation.</strong> JavaScript's <code>+</code> falls back to string when either side is an object, and <code>Decimal.toString()</code> gives digits, so <code>249000 + 100</code> becomes <code>'249000100'</code> — a plausible-looking number that is wrong by a factor of a thousand. It reaches an invoice before anyone notices. Money is <code>Decimal</code>, and <code>Decimal</code> arithmetic uses methods: <code>.plus()</code>, <code>.minus()</code>, <code>.times()</code>, <code>.dividedBy()</code>.</p>
</div>

<h3>Conversion 3 — raw queries use <em>column</em> names, not field names</h3>
<pre><code><span class="tok-comment">// schema.prisma</span>
model User {
  id        String  @id
  avatarUrl String? @map("avatar_url")
  @@map("users")
}</code></pre>
<pre><code><span class="tok-comment">// The builder speaks Prisma names</span>
await prisma.user.findMany({ select: { avatarUrl: true } });   <span class="tok-comment">// ✅</span>

<span class="tok-comment">// Raw speaks database names, and the mapping does not apply</span>
await prisma.$queryRaw&#96;SELECT "avatarUrl" FROM "User"&#96;;         <span class="tok-comment">// ❌</span></code></pre>
<div class="out">PrismaClientKnownRequestError:
Raw query failed. Code: &#96;42P01&#96;. Message: &#96;relation "User" does not exist&#96;</div>
<pre><code><span class="tok-comment">// Correct: the names that exist in PostgreSQL</span>
await prisma.$queryRaw&#96;SELECT id, avatar_url FROM users&#96;;

<span class="tok-comment">// And the key returned is the column name, not the field name</span>
<span class="tok-comment">// → { id: 'clx7…', avatar_url: 'https://…' }</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The error is the good case</span><span class="v"><code>relation "User" does not exist</code> is loud and immediate. The bad case is a column that exists under both names in different tables, or a query that silently returns a key your code does not read.</span></div>
  <div class="kv"><span class="k">Alias back to the field name</span><span class="v"><code>SELECT avatar_url AS "avatarUrl"</code> keeps the rest of your code speaking one vocabulary. The double quotes matter — without them PostgreSQL folds the alias to lower case and you get <code>avatarurl</code>.</span></div>
  <div class="kv"><span class="k">Unquoted identifiers are lower-cased</span><span class="v">Prisma creates tables with quoted, case-preserving names by default, so <code>SELECT * FROM SocialPost</code> looks for <code>socialpost</code> and fails. Quote every identifier in raw SQL: <code>"SocialPost"</code>.</span></div>
  <div class="kv"><span class="k">Enums come back as strings</span><span class="v">A PostgreSQL enum column returns its text value, not the generated TypeScript enum member. They compare equal, but <code>typeof</code> is <code>'string'</code> and any exhaustiveness check you rely on elsewhere does not apply here.</span></div>
</div>

<h3>Conversion 4 — what else raw SQL bypasses</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Client extensions and middleware</span><span class="lz-lnote">A soft-delete extension that adds <code>deletedAt: null</code> to every query (Lesson 10.5) does not touch raw SQL. Your raw query returns deleted rows, and it will do so on the day someone adds the extension, not the day you wrote the query.</span></div>
  <div class="lz-layer"><span class="lz-lname">Default values and <code>@updatedAt</code></span><span class="lz-lnote"><code>@default(uuid())</code> and <code>@updatedAt</code> are applied by Prisma, not by the database, unless the migration also created a database default. A raw <code>INSERT</code> that omits those columns inserts NULL or fails.</span></div>
  <div class="lz-layer"><span class="lz-lname">Referential actions declared in the schema</span><span class="lz-lnote"><code>onDelete: Cascade</code> is a real foreign key in PostgreSQL, so it <em>does</em> apply to raw deletes. But <code>NoAction</code> emulated by Prisma at the client level does not — check the migration SQL if it matters.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nothing about transactions</span><span class="lz-lnote">This one is fine: <code>tx.$queryRaw</code> inside <code>$transaction(async (tx) =&gt; …)</code> runs in that transaction, exactly as you would want. Raw and builder queries mix freely inside one transaction.</span></div>
</div>
<pre><code><span class="tok-comment">// Raw and builder in one transaction — this works</span>
await prisma.$transaction(async (tx) =&gt; {
  await tx.$executeRaw&#96;LOCK TABLE "Counter" IN SHARE ROW EXCLUSIVE MODE&#96;;
  const c = await tx.counter.findUnique({ where: { key: 'don-hang' } });
  await tx.counter.update({ where: { key: 'don-hang' }, data: { value: c.value + 1 } });
});</code></pre>

<h3>Putting a real check back</h3>
<pre><code>import { z } from 'zod';

const HangThongKe = z.object({
  authorId: z.string(),
  so_bai:   z.number().int(),
  gan_nhat: z.date(),
});

const rows = HangThongKe.array().parse(
  await prisma.$queryRaw&#96;
    SELECT "authorId", count(*)::int AS so_bai, max("createdAt") AS gan_nhat
    FROM "SocialPost" WHERE "deletedAt" IS NULL GROUP BY "authorId"&#96;
);
<span class="tok-comment">// rows is now { authorId: string; so_bai: number; gan_nhat: Date }[]</span>
<span class="tok-comment">// — inferred from the schema, and verified at runtime.</span></code></pre>
<div class="out">ZodError: [
  {
    "code": "invalid_type", "expected": "number", "received": "bigint",
    "path": [0, "so_bai"], "message": "Expected number, received bigint"
  }
]</div>
<div class="callout ok">
<p><strong>This error is the point.</strong> Without the schema, that BigInt would have travelled through your service layer and failed at <code>res.json</code> — a stack trace in Express with no mention of the query that produced it. With the schema it fails at the boundary, names the column, and tells you the actual type. One <code>z.object</code> per raw query is a few lines, and it converts "types are a lie here" into "types are checked here" for the small part of the codebase that needs it.</p>
</div>
<div class="note-ct">
<p><strong>When to reach for validation, honestly.</strong> A raw query returning three scalar columns into one function that immediately sums them does not need zod. A raw query whose result crosses a module boundary, gets serialised to an API response, or is written by one person and consumed by another — that one does. The rule of thumb on CuongThai: if the shape appears in a function's <em>return type</em>, validate it; if it dies inside the function that made the query, a cast is honest enough.</p>
</div>

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
<pre><code><span class="tok-comment">// Nhìn cứ như câu truy vấn trả về các hàng User</span>
const users = await prisma.$queryRaw&lt;User[]&gt;&#96;SELECT id FROM "User" LIMIT 3&#96;;

console.log(users[0].email.toLowerCase());   <span class="tok-comment">// tsc: ổn. Lúc chạy: ?</span></code></pre>
<div class="out">TypeError: Cannot read properties of undefined (reading 'toLowerCase')</div>
<pre><code><span class="tok-comment">// Chữ ký, rút gọn</span>
$queryRaw&lt;T = unknown&gt;(query: TemplateStringsArray, ...values: any[]): PrismaPromise&lt;T&gt;

<span class="tok-comment">// T KHÔNG BAO GIỜ được suy ra từ câu SQL. Nó đúng bằng thứ bạn gõ vào.</span>
<span class="tok-comment">// Trình biên dịch không có cách nào đọc chuỗi đó rồi kiểm lại.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trình dựng</span><span class="lz-t">Kiểu được SUY RA</span><span class="lz-d"><code>findMany({ select: { id: true } })</code> trả về <code>{ id: string }[]</code> — tính ra từ chính đối số bạn truyền. Xin <code>.email</code> là trình biên dịch chặn lại.</span></div>
  <div class="lz-step"><span class="lz-k">Thô</span><span class="lz-t">Kiểu được KHẲNG ĐỊNH</span><span class="lz-d"><code>$queryRaw&lt;User[]&gt;</code> là bạn bảo trình biên dịch phải tin gì. Nó tin. Không có gì xác minh cả — không lúc build, không lúc chạy.</span></div>
  <div class="lz-step"><span class="lz-k">Trôi dạt</span><span class="lz-t">Chỗ nó cắn</span><span class="lz-d">Một migration đổi tên cột. MỌI truy vấn qua trình dựng thành lỗi biên dịch. MỌI truy vấn thô vẫn biên dịch trót lọt, và bắt đầu trả <code>undefined</code> cho trường đó trên production.</span></div>
  <div class="lz-step"><span class="lz-k">Cách vá</span><span class="lz-t">Có hai</span><span class="lz-d">Kiểm ở biên bằng một lược đồ (bên dưới), hoặc dùng <strong>TypedSQL</strong> (Bài 10.4) — nó đọc file <code>.sql</code> lúc generate và suy kiểu ra từ cơ sở dữ liệu THẬT.</span></div>
</div>

<h3>Chuyển đổi 1 — <code>count(*)</code> là BigInt, và nó làm vỡ <code>res.json</code></h3>
<pre><code>const rows = await prisma.$queryRaw&#96;
  SELECT "authorId", count(*) AS so_bai
  FROM "SocialPost" GROUP BY "authorId"&#96;;
console.log(rows[0]);
res.json(rows);</code></pre>
<div class="out">{ authorId: 'clx7…', so_bai: 14n }        ← chu y chu n

TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (&lt;anonymous&gt;)
    at ServerResponse.json (express/lib/response.js:1150:14)</div>
<pre><code><span class="tok-comment">-- Vá tại nguồn: ép kiểu ngay trong SQL</span>
SELECT "authorId", count(*)::int AS so_bai FROM "SocialPost" GROUP BY "authorId";</code></pre>
<div class="out">{ authorId: 'clx7…', so_bai: 14 }         ← mot so thuong</div>
<div class="callout ok">
<p><strong>Ép kiểu trong SQL, đừng chuyển đổi trong JavaScript.</strong> <code>Number(row.so_bai)</code> chạy được nhưng phải lặp lại ở mọi chỗ gọi và sẽ bị quên ở đúng một chỗ. <code>::int</code> vá một lần, ngay nơi giá trị được sinh ra, cho MỌI người gọi — và nó nói rõ ý định cho người đọc câu truy vấn sau này. Chỉ dùng <code>::bigint</code> một cách CÓ CHỦ Ý khi phép đếm thật sự có thể vượt 2<sup>31</sup>, rồi xử lý BigInt một cách có chủ ý luôn.</p>
</div>

<h3>Chuyển đổi 2 — <code>Decimal</code> vẫn là một object Decimal</h3>
<pre><code>const rows = await prisma.$queryRaw&#96;SELECT id, gia FROM "Order" LIMIT 1&#96;;
console.log(rows[0].gia, typeof rows[0].gia);
console.log(rows[0].gia + 100);</code></pre>
<div class="out">Decimal { s: 1, e: 5, d: [ 249000 ] } object
249000100        ← noi chuoi, khong phai phep cong</div>
<pre><code><span class="tok-comment">// Decimal có số học riêng. Dùng nó, hoặc chuyển đổi tường minh.</span>
rows[0].gia.plus(100).toString();     <span class="tok-comment">// '249100'  — chính xác</span>
rows[0].gia.toNumber() + 100;         <span class="tok-comment">// 249100    — số thực, mất chính xác trên 2^53</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — <code>Decimal + number</code> là một phép nối chuỗi LẶNG LẼ.</strong> Toán tử <code>+</code> của JavaScript rơi về chuỗi khi một vế là object, và <code>Decimal.toString()</code> cho ra chữ số, nên <code>249000 + 100</code> thành <code>'249000100'</code> — một con số nhìn RẤT HỢP LÝ mà sai gấp một nghìn lần. Nó đi tới tận hoá đơn trước khi có ai nhận ra. Tiền là <code>Decimal</code>, và số học của <code>Decimal</code> dùng phương thức: <code>.plus()</code>, <code>.minus()</code>, <code>.times()</code>, <code>.dividedBy()</code>.</p>
</div>

<h3>Chuyển đổi 3 — truy vấn thô dùng tên <em>CỘT</em>, không phải tên TRƯỜNG</h3>
<pre><code><span class="tok-comment">// schema.prisma</span>
model User {
  id        String  @id
  avatarUrl String? @map("avatar_url")
  @@map("users")
}</code></pre>
<pre><code><span class="tok-comment">// Trình dựng nói tiếng Prisma</span>
await prisma.user.findMany({ select: { avatarUrl: true } });   <span class="tok-comment">// ✅</span>

<span class="tok-comment">// Thô nói tiếng cơ sở dữ liệu, và phép ánh xạ KHÔNG áp dụng</span>
await prisma.$queryRaw&#96;SELECT "avatarUrl" FROM "User"&#96;;         <span class="tok-comment">// ❌</span></code></pre>
<div class="out">PrismaClientKnownRequestError:
Raw query failed. Code: &#96;42P01&#96;. Message: &#96;relation "User" does not exist&#96;</div>
<pre><code><span class="tok-comment">// Đúng: những cái tên có thật trong PostgreSQL</span>
await prisma.$queryRaw&#96;SELECT id, avatar_url FROM users&#96;;

<span class="tok-comment">// Và khoá trả về là tên CỘT, không phải tên trường</span>
<span class="tok-comment">// → { id: 'clx7…', avatar_url: 'https://…' }</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái lỗi mới là trường hợp TỐT</span><span class="v"><code>relation "User" does not exist</code> ồn ào và tức thì. Trường hợp XẤU là một cột tồn tại dưới cả hai tên ở hai bảng khác nhau, hoặc một câu truy vấn lặng lẽ trả về một khoá mà mã của bạn không đọc.</span></div>
  <div class="kv"><span class="k">Đặt bí danh trở lại tên trường</span><span class="v"><code>SELECT avatar_url AS "avatarUrl"</code> giữ cho phần còn lại của mã chỉ nói MỘT thứ tiếng. Cặp nháy kép có ý nghĩa — thiếu nó, PostgreSQL hạ bí danh xuống chữ thường và bạn nhận được <code>avatarurl</code>.</span></div>
  <div class="kv"><span class="k">Định danh không nháy bị hạ chữ thường</span><span class="v">Prisma tạo bảng với tên có nháy, giữ nguyên chữ hoa chữ thường, nên <code>SELECT * FROM SocialPost</code> đi tìm <code>socialpost</code> và thất bại. Trong SQL thô, hãy đặt nháy cho MỌI định danh: <code>"SocialPost"</code>.</span></div>
  <div class="kv"><span class="k">Enum quay về dạng chuỗi</span><span class="v">Một cột enum của PostgreSQL trả về giá trị chữ của nó, không phải thành viên enum TypeScript được sinh ra. Chúng so sánh bằng nhau, nhưng <code>typeof</code> là <code>'string'</code> và mọi phép kiểm vét cạn bạn dựa vào ở chỗ khác đều KHÔNG áp dụng ở đây.</span></div>
</div>

<h3>Chuyển đổi 4 — SQL thô còn đi vòng qua những gì nữa</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Phần mở rộng client và middleware</span><span class="lz-lnote">Một phần mở rộng soft delete tự thêm <code>deletedAt: null</code> vào mọi truy vấn (Bài 10.5) KHÔNG chạm được tới SQL thô. Truy vấn thô của bạn trả về cả hàng đã xoá — và nó sẽ làm vậy vào NGÀY có người thêm phần mở rộng đó, chứ không phải ngày bạn viết câu truy vấn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giá trị mặc định và <code>@updatedAt</code></span><span class="lz-lnote"><code>@default(uuid())</code> và <code>@updatedAt</code> do PRISMA áp, không phải cơ sở dữ liệu, trừ khi migration cũng tạo một default ở phía cơ sở dữ liệu. Một câu <code>INSERT</code> thô bỏ sót những cột đó sẽ chèn NULL hoặc thất bại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hành vi tham chiếu khai trong lược đồ</span><span class="lz-lnote"><code>onDelete: Cascade</code> là một khoá ngoại THẬT trong PostgreSQL, nên nó <em>có</em> áp cho cả lệnh xoá thô. Nhưng <code>NoAction</code> do Prisma mô phỏng ở mức client thì KHÔNG — nếu điều đó quan trọng, hãy mở file SQL của migration ra xem.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giao dịch thì không sao cả</span><span class="lz-lnote">Cái này ổn: <code>tx.$queryRaw</code> bên trong <code>$transaction(async (tx) =&gt; …)</code> chạy TRONG giao dịch đó, đúng như bạn muốn. Truy vấn thô và truy vấn qua trình dựng trộn thoải mái trong cùng một giao dịch.</span></div>
</div>
<pre><code><span class="tok-comment">// Thô và trình dựng trong một giao dịch — cái này chạy được</span>
await prisma.$transaction(async (tx) =&gt; {
  await tx.$executeRaw&#96;LOCK TABLE "Counter" IN SHARE ROW EXCLUSIVE MODE&#96;;
  const c = await tx.counter.findUnique({ where: { key: 'don-hang' } });
  await tx.counter.update({ where: { key: 'don-hang' }, data: { value: c.value + 1 } });
});</code></pre>

<h3>Đặt một phép kiểm THẬT trở lại</h3>
<pre><code>import { z } from 'zod';

const HangThongKe = z.object({
  authorId: z.string(),
  so_bai:   z.number().int(),
  gan_nhat: z.date(),
});

const rows = HangThongKe.array().parse(
  await prisma.$queryRaw&#96;
    SELECT "authorId", count(*)::int AS so_bai, max("createdAt") AS gan_nhat
    FROM "SocialPost" WHERE "deletedAt" IS NULL GROUP BY "authorId"&#96;
);
<span class="tok-comment">// rows giờ là { authorId: string; so_bai: number; gan_nhat: Date }[]</span>
<span class="tok-comment">// — suy ra từ lược đồ, VÀ được xác minh lúc chạy.</span></code></pre>
<div class="out">ZodError: [
  {
    "code": "invalid_type", "expected": "number", "received": "bigint",
    "path": [0, "so_bai"], "message": "Expected number, received bigint"
  }
]</div>
<div class="callout ok">
<p><strong>Chính CÁI LỖI NÀY mới là điểm mấu chốt.</strong> Không có lược đồ, cái BigInt đó đã đi xuyên qua tầng service rồi chết ở <code>res.json</code> — một vết ngăn xếp trong Express không hề nhắc tới câu truy vấn đã sinh ra nó. Có lược đồ, nó chết ngay tại biên, gọi tên cái cột, và nói cho bạn biết kiểu THẬT là gì. Một <code>z.object</code> cho mỗi truy vấn thô chỉ vài dòng, và nó biến "ở đây kiểu là lời nói dối" thành "ở đây kiểu được kiểm" cho đúng cái phần nhỏ của kho mã cần điều đó.</p>
</div>
<div class="note-ct">
<p><strong>Khi nào nên dùng kiểm, nói cho thật.</strong> Một truy vấn thô trả về ba cột vô hướng vào một hàm cộng chúng lại ngay lập tức thì KHÔNG cần zod. Một truy vấn thô có kết quả vượt qua ranh giới module, được tuần tự hoá thành phản hồi API, hoặc do người này viết và người khác dùng — cái đó thì cần. Quy tắc ngón tay cái ở CuongThai: nếu cái hình dạng đó xuất hiện trong <em>kiểu trả về</em> của một hàm, hãy kiểm nó; nếu nó chết ngay trong chính cái hàm đã tạo ra truy vấn, thì một phép ép kiểu là đủ trung thực.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Five things only SQL can say</h2>
<p class="lead">Prisma's query builder covers the shapes an application asks for ninety-five times out of a hundred. These are five of the other five: each one is a single SQL statement, each one is either impossible or catastrophically slow through the builder, and each one shows up in a real product sooner than you expect.</p>

<h3>1. Top-N per group — the query the builder cannot express</h3>
<pre><code><span class="tok-comment">// "The 3 most recent posts of each of these 50 authors"</span>
<span class="tok-comment">// Through the builder: 50 queries, one per author. Lesson 9.2's N+1,</span>
<span class="tok-comment">// except there is no include that avoids it — take inside include</span>
<span class="tok-comment">// applies per parent, which is exactly the fan-out.</span></code></pre>
<pre><code>SELECT u.id, u.username, p.id AS post_id, p.content, p."createdAt"
FROM "User" u
CROSS JOIN LATERAL (
  SELECT id, content, "createdAt"
  FROM "SocialPost"
  WHERE "authorId" = u.id AND "deletedAt" IS NULL
  ORDER BY "createdAt" DESC
  LIMIT 3
) p
WHERE u.id = ANY($1);</code></pre>
<div class="out">50 tac gia x 3 bai = 150 hang, 1 cau truy van, 11.4 ms

(cung du lieu qua trinh dung: 51 cau truy van, 288 ms)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>LATERAL</code></span><span class="lz-t">A subquery that sees the outer row</span><span class="lz-d">An ordinary subquery in <code>FROM</code> is evaluated once. A <code>LATERAL</code> one is evaluated per outer row and can reference its columns — which is exactly "for each author, the top 3".</span></div>
  <div class="lz-step"><span class="lz-k">Still one round trip</span><span class="lz-t">Where the 25x comes from</span><span class="lz-d">The database runs the loop internally, on the same page cache, without a network hop or a query-plan lookup per iteration. Loops are not the problem; loops <em>across a network</em> are.</span></div>
  <div class="lz-step"><span class="lz-k">Needs the index</span><span class="lz-t">Same rule as Lesson 9.3</span><span class="lz-d"><code>@@index([authorId, createdAt(sort: Desc)])</code>. Without it each lateral iteration sorts that author's whole history and the elegance buys nothing.</span></div>
  <div class="lz-step"><span class="lz-k">The alternative</span><span class="lz-t"><code>row_number()</code></span><span class="lz-d">A window function partitioned by author, filtered to <code>rn &lt;= 3</code>. Correct, and usually slower here: it ranks every row before discarding, while <code>LATERAL</code> stops after three.</span></div>
</div>

<h3>2. Window functions — rank, running total, and the previous row</h3>
<pre><code>SELECT
  u.username,
  count(p.id)::int                                      AS so_bai,
  rank()       OVER (ORDER BY count(p.id) DESC)         AS hang,
  sum(count(p.id)) OVER (ORDER BY count(p.id) DESC)     AS luy_tien,
  lag(u.username) OVER (ORDER BY count(p.id) DESC)      AS nguoi_tren
FROM "User" u
LEFT JOIN "SocialPost" p ON p."authorId" = u.id AND p."deletedAt" IS NULL
GROUP BY u.id, u.username
ORDER BY so_bai DESC
LIMIT 5;</code></pre>
<div class="out">  username  | so_bai | hang | luy_tien | nguoi_tren
------------+--------+------+----------+------------
 cuongthai  |    418 |    1 |      418 |
 an         |    391 |    2 |      809 | cuongthai
 binh       |    287 |    3 |     1096 | an
 chi        |    287 |    3 |     1383 | binh      ← tie: both rank 3
 dung       |    150 |    5 |     1533 | chi       ← rank() skips 4</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A window function does not collapse rows</span><span class="v"><code>GROUP BY</code> turns many rows into one. <code>OVER (…)</code> computes across a set of rows and keeps every row. That is the whole distinction, and it is why a leaderboard with ranks needs one and a leaderboard without ranks does not.</span></div>
  <div class="kv"><span class="k"><code>rank()</code> vs <code>dense_rank()</code> vs <code>row_number()</code></span><span class="v"><code>rank</code> gives ties the same number and skips the next (1,2,3,3,5). <code>dense_rank</code> does not skip (1,2,3,3,4). <code>row_number</code> never ties (1,2,3,4,5) and is arbitrary between equal rows — add a tie-break to <code>ORDER BY</code> or it is unstable.</span></div>
  <div class="kv"><span class="k">Computing this in JavaScript</span><span class="v">Requires loading every user and every post count into the process. On 12,000 users that is a query returning 12,000 rows to compute five. The database has the data sorted already.</span></div>
  <div class="kv"><span class="k">The builder's version</span><span class="v"><code>groupBy</code> gives you counts. It has no <code>rank</code>, no running total, no <code>lag</code>. If your feature spec contains the word "rank", "streak", "compared to the previous", or "percentile", you are writing SQL.</span></div>
</div>

<h3>3. A recursive CTE — the comment tree in one query</h3>
<pre><code><span class="tok-comment">// The self-relation from Lesson 3.4</span>
model Comment {
  id       String    @id @default(cuid())
  content  String
  parentId String?
  parent   Comment?  @relation("Replies", fields: [parentId], references: [id])
  replies  Comment[] @relation("Replies")
}

<span class="tok-comment">// Through the builder, depth is fixed at write time:</span>
include: { replies: { include: { replies: { include: { replies: true } } } } }
<span class="tok-comment">// Three levels. The fourth is silently missing.</span></code></pre>
<pre><code>WITH RECURSIVE cay AS (
  <span class="tok-comment">-- anchor: the top-level comments of this post</span>
  SELECT id, content, "parentId", 0 AS do_sau,
         ARRAY["createdAt"] AS duong_dan
  FROM "Comment"
  WHERE "postId" = $1 AND "parentId" IS NULL

  UNION ALL

  <span class="tok-comment">-- recursive step: children of everything already in cay</span>
  SELECT c.id, c.content, c."parentId", cay.do_sau + 1,
         cay.duong_dan || c."createdAt"
  FROM "Comment" c
  JOIN cay ON c."parentId" = cay.id
  WHERE cay.do_sau &lt; 10          <span class="tok-comment">-- depth guard, always</span>
)
SELECT * FROM cay ORDER BY duong_dan;</code></pre>
<div class="out">              id | do_sau |            content
-----------------+--------+---------------------------------
 cm_a            |      0 | Bai viet hay
 cm_a1           |      1 |   Dong y
 cm_a1x          |      2 |     Minh cung nghi vay
 cm_a1x9         |      3 |       Chinh xac
 cm_b            |      0 | Cho hoi phan 2 khi nao ra?

Execution Time: 3.208 ms   (any depth, one query)</div>
<div class="pitfall">
<p><strong>Bẫy — a recursive CTE without a depth guard runs forever on a cycle.</strong> One row whose <code>parentId</code> points at its own descendant — a bug, a bad import, a merge — and the query generates rows until the connection dies or the disk fills with temp files. <code>WHERE do_sau &lt; 10</code> costs nothing and bounds the damage. The <code>duong_dan</code> array is the second half of the defence: <code>WHERE NOT c.id = ANY(duong_dan)</code> makes a cycle terminate rather than merely time out, and it gives you the ordering for free.</p>
</div>

<h3>4. <code>ON CONFLICT DO UPDATE</code> with an expression</h3>
<pre><code><span class="tok-comment">// What upsert can say: "if it exists, set it to this value"</span>
await prisma.dailyStat.upsert({
  where:  { uk_ngay: { key: 'luot-xem', ngay } },
  create: { key: 'luot-xem', ngay, so: 1 },
  update: { so: { increment: 1 } },        <span class="tok-comment">// ok — increment is supported</span>
});</code></pre>
<pre><code><span class="tok-comment">-- What upsert cannot say: a value computed from BOTH sides,</span>
<span class="tok-comment">-- for many rows at once, in one statement.</span>
INSERT INTO "DailyStat" (key, ngay, so, cap_nhat)
SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])
ON CONFLICT (key, ngay) DO UPDATE
SET so       = "DailyStat".so + EXCLUDED.so,
    cap_nhat = GREATEST("DailyStat".cap_nhat, EXCLUDED.cap_nhat)
WHERE EXCLUDED.cap_nhat &gt; "DailyStat".cap_nhat;   <span class="tok-comment">-- conditional update</span></code></pre>
<div class="out">INSERT 0 4096

4.096 hang gop trong 1 cau lenh, 1 giao dich, 34 ms.
Qua upsert: 4.096 luot di ve, 4.096 giao dich, ~39 giay.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>EXCLUDED</code></span><span class="lz-lnote">The pseudo-table holding the row that <em>would have been</em> inserted. It lets the update read both the existing value and the incoming one — which is what "merge" means and what <code>upsert</code>'s <code>update</code> block cannot see.</span></div>
  <div class="lz-layer"><span class="lz-lname">A <code>WHERE</code> on the conflict action</span><span class="lz-lnote">Skip the update when the incoming row is older. Last-write-wins is a choice, not a law, and this is where you override it.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>unnest</code> of arrays</span><span class="lz-lnote">Four parameters carry four thousand rows. It stays inside the 65,535 bind-parameter cap that would stop a <code>VALUES</code> list of the same size (Lesson 9.5).</span></div>
  <div class="lz-layer"><span class="lz-lname">The unique constraint is required</span><span class="lz-lnote"><code>ON CONFLICT (key, ngay)</code> needs a unique index on exactly those columns. Without it PostgreSQL raises <code>there is no unique or exclusion constraint matching the ON CONFLICT specification</code> — which at least fails loudly.</span></div>
</div>

<h3>5. Full-text search that ranks</h3>
<pre><code><span class="tok-comment">-- prisma/migrations/…/migration.sql — a generated column plus a GIN index</span>
ALTER TABLE "SocialPost"
  ADD COLUMN tim_kiem tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(content, ''))) STORED;

CREATE INDEX socialpost_tim_kiem_idx ON "SocialPost" USING GIN (tim_kiem);</code></pre>
<pre><code>const ketQua = await prisma.$queryRaw&#96;
  SELECT id, content,
         ts_rank(tim_kiem, truy_van) AS diem,
         ts_headline('simple', content, truy_van,
                     'StartSel=&lt;mark&gt;, StopSel=&lt;/mark&gt;') AS trich
  FROM "SocialPost", websearch_to_tsquery('simple', \${tuKhoa}) AS truy_van
  WHERE tim_kiem @@ truy_van AND "deletedAt" IS NULL
  ORDER BY diem DESC, "createdAt" DESC
  LIMIT 20&#96;;</code></pre>
<div class="out">tu khoa: prisma migration

 diem  | trich
-------+-------------------------------------------------------
 0.099 | huong dan &lt;mark&gt;migration&lt;/mark&gt; cua &lt;mark&gt;Prisma&lt;/mark&gt;…
 0.075 | &lt;mark&gt;Prisma&lt;/mark&gt; migrate deploy tren VPS…
 0.061 | vi sao &lt;mark&gt;migration&lt;/mark&gt; that bai voi P3006…

Execution Time: 4.7 ms over 1.2M rows (GIN index scan)</div>
<div class="callout ok">
<p><strong><code>websearch_to_tsquery</code> takes what a human types.</strong> It understands quoted phrases, <code>or</code>, and a leading <code>-</code> for exclusion, and — crucially — it does not throw a syntax error on input like <code>c++ &amp;&amp; ???</code>, which <code>to_tsquery</code> does. That single choice removes a whole class of 500s from a search box. Prisma's own <code>search</code> filter uses <code>to_tsquery</code>, so unsanitised input there is a real error path.</p>
</div>
<div class="note-ct">
<p><strong>CuongThai's actual search.</strong> Post search runs on a <code>pg_trgm</code> GIN index (migration <code>20260623_gin_social_posts_content_trgm</code>) rather than <code>tsvector</code>, because Vietnamese has no PostgreSQL stemming dictionary — <code>to_tsvector('simple', …)</code> only splits on whitespace, so it cannot match "lập trình" against "lập trình viên", while trigram similarity can. Full-text with <code>ts_rank</code> is the right default for English content; for Vietnamese, measure both against real queries before choosing. Lesson 5.5 covers the trigram side.</p>
</div>

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
<pre><code><span class="tok-comment">// "3 bài mới nhất của MỖI người trong 50 tác giả này"</span>
<span class="tok-comment">// Qua trình dựng: 50 truy vấn, mỗi tác giả một cái. Chính là N+1 của Bài 9.2,</span>
<span class="tok-comment">// mà lại không có include nào tránh được — take bên trong include</span>
<span class="tok-comment">// áp theo TỪNG cha, và đó đúng là cú nở bung ra.</span></code></pre>
<pre><code>SELECT u.id, u.username, p.id AS post_id, p.content, p."createdAt"
FROM "User" u
CROSS JOIN LATERAL (
  SELECT id, content, "createdAt"
  FROM "SocialPost"
  WHERE "authorId" = u.id AND "deletedAt" IS NULL
  ORDER BY "createdAt" DESC
  LIMIT 3
) p
WHERE u.id = ANY($1);</code></pre>
<div class="out">50 tac gia x 3 bai = 150 hang, 1 cau truy van, 11,4 ms

(cung du lieu qua trinh dung: 51 cau truy van, 288 ms)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>LATERAL</code></span><span class="lz-t">Truy vấn con NHÌN THẤY hàng ngoài</span><span class="lz-d">Một truy vấn con thường trong <code>FROM</code> chỉ được tính MỘT lần. Một cái <code>LATERAL</code> được tính cho TỪNG hàng ngoài và tham chiếu được cột của nó — đúng nghĩa "với mỗi tác giả, lấy top 3".</span></div>
  <div class="lz-step"><span class="lz-k">Vẫn chỉ MỘT lượt đi về</span><span class="lz-t">Chỗ con số 25 lần đến từ</span><span class="lz-d">Cơ sở dữ liệu chạy vòng lặp ở BÊN TRONG, trên cùng bộ đệm trang, không có bước nhảy mạng và không phải tra kế hoạch truy vấn cho mỗi vòng. Vòng lặp không phải vấn đề; vòng lặp <em>xuyên qua mạng</em> mới là.</span></div>
  <div class="lz-step"><span class="lz-k">Vẫn cần chỉ mục</span><span class="lz-t">Cùng luật của Bài 9.3</span><span class="lz-d"><code>@@index([authorId, createdAt(sort: Desc)])</code>. Thiếu nó thì mỗi vòng lateral phải sắp xếp toàn bộ lịch sử của tác giả đó, và cái sự thanh lịch kia chẳng mua được gì.</span></div>
  <div class="lz-step"><span class="lz-k">Cách khác</span><span class="lz-t"><code>row_number()</code></span><span class="lz-d">Một window function phân hoạch theo tác giả, lọc <code>rn &lt;= 3</code>. Đúng, và ở đây thường CHẬM hơn: nó xếp hạng mọi hàng rồi mới vứt đi, còn <code>LATERAL</code> dừng ngay sau ba cái.</span></div>
</div>

<h3>2. Window function — xếp hạng, tổng luỹ tiến, và hàng liền trước</h3>
<pre><code>SELECT
  u.username,
  count(p.id)::int                                      AS so_bai,
  rank()       OVER (ORDER BY count(p.id) DESC)         AS hang,
  sum(count(p.id)) OVER (ORDER BY count(p.id) DESC)     AS luy_tien,
  lag(u.username) OVER (ORDER BY count(p.id) DESC)      AS nguoi_tren
FROM "User" u
LEFT JOIN "SocialPost" p ON p."authorId" = u.id AND p."deletedAt" IS NULL
GROUP BY u.id, u.username
ORDER BY so_bai DESC
LIMIT 5;</code></pre>
<div class="out">  username  | so_bai | hang | luy_tien | nguoi_tren
------------+--------+------+----------+------------
 cuongthai  |    418 |    1 |      418 |
 an         |    391 |    2 |      809 | cuongthai
 binh       |    287 |    3 |     1096 | an
 chi        |    287 |    3 |     1383 | binh      ← hoa: ca hai deu hang 3
 dung       |    150 |    5 |     1533 | chi       ← rank() bo qua so 4</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Window function KHÔNG gộp hàng lại</span><span class="v"><code>GROUP BY</code> biến nhiều hàng thành một. <code>OVER (…)</code> tính trên một TẬP hàng mà GIỮ NGUYÊN mọi hàng. Đó là toàn bộ khác biệt, và là lý do một bảng xếp hạng CÓ thứ hạng thì cần nó, còn bảng KHÔNG có thứ hạng thì không.</span></div>
  <div class="kv"><span class="k"><code>rank()</code> đối lại <code>dense_rank()</code> đối lại <code>row_number()</code></span><span class="v"><code>rank</code> cho các trường hợp hoà cùng một số rồi BỎ QUA số kế (1,2,3,3,5). <code>dense_rank</code> không bỏ qua (1,2,3,3,4). <code>row_number</code> không bao giờ hoà (1,2,3,4,5) và tuỳ tiện giữa các hàng bằng nhau — thêm cột phá hoà vào <code>ORDER BY</code> nếu không nó không ổn định.</span></div>
  <div class="kv"><span class="k">Tính cái này trong JavaScript</span><span class="v">Phải nạp MỌI người dùng và MỌI số đếm bài viết vào tiến trình. Với 12.000 người dùng thì đó là một truy vấn trả về 12.000 hàng để tính ra năm dòng. Cơ sở dữ liệu vốn đã có dữ liệu và đã sắp xếp sẵn.</span></div>
  <div class="kv"><span class="k">Bản của trình dựng</span><span class="v"><code>groupBy</code> cho bạn các phép đếm. Nó KHÔNG có <code>rank</code>, không có tổng luỹ tiến, không có <code>lag</code>. Nếu bản mô tả tính năng của bạn có chữ "thứ hạng", "chuỗi ngày liên tiếp", "so với lần trước", hay "phân vị" — thì bạn đang viết SQL.</span></div>
</div>

<h3>3. CTE đệ quy — cây bình luận trong MỘT câu truy vấn</h3>
<pre><code><span class="tok-comment">// Quan hệ tự trỏ của Bài 3.4</span>
model Comment {
  id       String    @id @default(cuid())
  content  String
  parentId String?
  parent   Comment?  @relation("Replies", fields: [parentId], references: [id])
  replies  Comment[] @relation("Replies")
}

<span class="tok-comment">// Qua trình dựng, độ sâu bị CHỐT CỨNG lúc viết mã:</span>
include: { replies: { include: { replies: { include: { replies: true } } } } }
<span class="tok-comment">// Ba tầng. Tầng thứ tư biến mất trong im lặng.</span></code></pre>
<pre><code>WITH RECURSIVE cay AS (
  <span class="tok-comment">-- mỏ neo: các bình luận gốc của bài này</span>
  SELECT id, content, "parentId", 0 AS do_sau,
         ARRAY["createdAt"] AS duong_dan
  FROM "Comment"
  WHERE "postId" = $1 AND "parentId" IS NULL

  UNION ALL

  <span class="tok-comment">-- bước đệ quy: con của mọi thứ đã có trong cay</span>
  SELECT c.id, c.content, c."parentId", cay.do_sau + 1,
         cay.duong_dan || c."createdAt"
  FROM "Comment" c
  JOIN cay ON c."parentId" = cay.id
  WHERE cay.do_sau &lt; 10          <span class="tok-comment">-- chốt chặn độ sâu, LUÔN LUÔN</span>
)
SELECT * FROM cay ORDER BY duong_dan;</code></pre>
<div class="out">              id | do_sau |            content
-----------------+--------+---------------------------------
 cm_a            |      0 | Bai viet hay
 cm_a1           |      1 |   Dong y
 cm_a1x          |      2 |     Minh cung nghi vay
 cm_a1x9         |      3 |       Chinh xac
 cm_b            |      0 | Cho hoi phan 2 khi nao ra?

Execution Time: 3,208 ms   (do sau bao nhieu cung 1 truy van)</div>
<div class="pitfall">
<p><strong>Bẫy — một CTE đệ quy KHÔNG có chốt chặn độ sâu sẽ chạy MÃI MÃI khi gặp chu trình.</strong> Chỉ một hàng có <code>parentId</code> trỏ vào chính hậu duệ của nó — do bug, do nhập dữ liệu sai, do một lần gộp nhánh — là câu truy vấn sinh hàng cho tới khi kết nối chết hoặc đĩa đầy file tạm. <code>WHERE do_sau &lt; 10</code> không tốn gì và chặn được thiệt hại. Cái mảng <code>duong_dan</code> là nửa còn lại của hàng phòng thủ: <code>WHERE NOT c.id = ANY(duong_dan)</code> làm chu trình DỪNG hẳn chứ không chỉ hết giờ, và tặng luôn thứ tự sắp xếp cho bạn.</p>
</div>

<h3>4. <code>ON CONFLICT DO UPDATE</code> kèm BIỂU THỨC</h3>
<pre><code><span class="tok-comment">// Thứ upsert nói được: "nếu đã có thì đặt thành giá trị này"</span>
await prisma.dailyStat.upsert({
  where:  { uk_ngay: { key: 'luot-xem', ngay } },
  create: { key: 'luot-xem', ngay, so: 1 },
  update: { so: { increment: 1 } },        <span class="tok-comment">// ổn — increment có hỗ trợ</span>
});</code></pre>
<pre><code><span class="tok-comment">-- Thứ upsert KHÔNG nói được: một giá trị tính từ CẢ HAI phía,</span>
<span class="tok-comment">-- cho nhiều hàng cùng lúc, trong MỘT câu lệnh.</span>
INSERT INTO "DailyStat" (key, ngay, so, cap_nhat)
SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])
ON CONFLICT (key, ngay) DO UPDATE
SET so       = "DailyStat".so + EXCLUDED.so,
    cap_nhat = GREATEST("DailyStat".cap_nhat, EXCLUDED.cap_nhat)
WHERE EXCLUDED.cap_nhat &gt; "DailyStat".cap_nhat;   <span class="tok-comment">-- cập nhật có điều kiện</span></code></pre>
<div class="out">INSERT 0 4096

4.096 hang gop trong 1 cau lenh, 1 giao dich, 34 ms.
Qua upsert: 4.096 luot di ve, 4.096 giao dich, ~39 giay.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>EXCLUDED</code></span><span class="lz-lnote">Bảng giả chứa cái hàng LẼ RA đã được chèn. Nó cho phép phần update đọc CẢ giá trị đang có LẪN giá trị đang tới — đó chính là nghĩa của "gộp", và là thứ khối <code>update</code> của <code>upsert</code> không nhìn thấy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một <code>WHERE</code> gắn vào hành động khi xung đột</span><span class="lz-lnote">Bỏ qua việc cập nhật khi hàng đang tới CŨ hơn. "Ai ghi sau thắng" là một LỰA CHỌN, không phải định luật, và đây là chỗ bạn lật ngược nó.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>unnest</code> các mảng</span><span class="lz-lnote">Bốn tham số cõng bốn nghìn hàng. Nó nằm gọn trong trần 65.535 tham số ràng buộc, cái trần sẽ chặn một danh sách <code>VALUES</code> cùng cỡ (Bài 9.5).</span></div>
  <div class="lz-layer"><span class="lz-lname">BẮT BUỘC phải có ràng buộc duy nhất</span><span class="lz-lnote"><code>ON CONFLICT (key, ngay)</code> cần một chỉ mục duy nhất trên ĐÚNG những cột đó. Thiếu nó, PostgreSQL ném <code>there is no unique or exclusion constraint matching the ON CONFLICT specification</code> — ít ra thì nó hỏng một cách ồn ào.</span></div>
</div>

<h3>5. Tìm kiếm toàn văn CÓ XẾP HẠNG</h3>
<pre><code><span class="tok-comment">-- prisma/migrations/…/migration.sql — một cột sinh ra cộng một chỉ mục GIN</span>
ALTER TABLE "SocialPost"
  ADD COLUMN tim_kiem tsvector
  GENERATED ALWAYS AS (to_tsvector('simple', coalesce(content, ''))) STORED;

CREATE INDEX socialpost_tim_kiem_idx ON "SocialPost" USING GIN (tim_kiem);</code></pre>
<pre><code>const ketQua = await prisma.$queryRaw&#96;
  SELECT id, content,
         ts_rank(tim_kiem, truy_van) AS diem,
         ts_headline('simple', content, truy_van,
                     'StartSel=&lt;mark&gt;, StopSel=&lt;/mark&gt;') AS trich
  FROM "SocialPost", websearch_to_tsquery('simple', \${tuKhoa}) AS truy_van
  WHERE tim_kiem @@ truy_van AND "deletedAt" IS NULL
  ORDER BY diem DESC, "createdAt" DESC
  LIMIT 20&#96;;</code></pre>
<div class="out">tu khoa: prisma migration

 diem  | trich
-------+-------------------------------------------------------
 0,099 | huong dan &lt;mark&gt;migration&lt;/mark&gt; cua &lt;mark&gt;Prisma&lt;/mark&gt;…
 0,075 | &lt;mark&gt;Prisma&lt;/mark&gt; migrate deploy tren VPS…
 0,061 | vi sao &lt;mark&gt;migration&lt;/mark&gt; that bai voi P3006…

Execution Time: 4,7 ms tren 1,2 trieu hang (quet chi muc GIN)</div>
<div class="callout ok">
<p><strong><code>websearch_to_tsquery</code> nhận đúng thứ con người gõ vào.</strong> Nó hiểu cụm trong ngoặc kép, hiểu <code>or</code>, hiểu dấu <code>-</code> đứng đầu để loại trừ, và — quan trọng nhất — nó KHÔNG ném lỗi cú pháp với đầu vào kiểu <code>c++ &amp;&amp; ???</code>, thứ mà <code>to_tsquery</code> thì ném. Chỉ một lựa chọn đó thôi đã xoá sạch cả một lớp lỗi 500 khỏi ô tìm kiếm. Bộ lọc <code>search</code> của chính Prisma dùng <code>to_tsquery</code>, nên đầu vào chưa làm sạch ở đó là một đường lỗi CÓ THẬT.</p>
</div>
<div class="note-ct">
<p><strong>Tìm kiếm THẬT của CuongThai.</strong> Tìm bài viết chạy trên chỉ mục GIN <code>pg_trgm</code> (migration <code>20260623_gin_social_posts_content_trgm</code>) chứ không phải <code>tsvector</code>, vì tiếng Việt không có từ điển tách gốc từ trong PostgreSQL — <code>to_tsvector('simple', …)</code> chỉ cắt theo khoảng trắng, nên nó không khớp "lập trình" với "lập trình viên", còn độ tương tự trigram thì khớp được. Toàn văn kèm <code>ts_rank</code> là mặc định ĐÚNG cho nội dung tiếng Anh; với tiếng Việt, hãy ĐO cả hai trên truy vấn thật rồi mới chọn. Bài 5.5 nói kỹ phần trigram.</p>
</div>

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
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>TypedSQL: raw queries the compiler can check</h2>
<p class="lead">Lesson 10.2 ended with an unsatisfying answer: raw queries lie about their types, so validate at runtime. TypedSQL is the satisfying one. You put the SQL in a file, Prisma asks the real database what that statement returns, and generates the type from the answer. The cast disappears, and so does the class of bug where a renamed column compiles fine and fails in production.</p>

<h3>The setup, end to end</h3>
<pre><code><span class="tok-comment">// schema.prisma</span>
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["typedSql"]
}</code></pre>
<pre><code><span class="tok-comment"># prisma/sql/thongKeTacGia.sql — the directory name is fixed</span>
<span class="tok-comment">-- @param {String} $1:tacGiaId  ID cua tac gia</span>
<span class="tok-comment">-- @param {Int}    $2:gioiHan   So hang toi da</span>
SELECT
  p.id,
  p.content,
  p."createdAt",
  count(c.id)::int AS so_binh_luan
FROM "SocialPost" p
LEFT JOIN "Comment" c ON c."postId" = p.id
WHERE p."authorId" = $1 AND p."deletedAt" IS NULL
GROUP BY p.id
ORDER BY p."createdAt" DESC
LIMIT $2;</code></pre>
<pre><code><span class="tok-comment"># Generate. Note the flag — plain &#96;prisma generate&#96; skips the .sql files.</span>
npx prisma generate --sql</code></pre>
<div class="out">Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "cuongthai" at "localhost:5432"

✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 284ms
✔ Generated 1 SQL query to ./node_modules/@prisma/client/sql in 41ms</div>
<pre><code><span class="tok-comment">// Use it. The import path is @prisma/client/sql, not @prisma/client.</span>
import { thongKeTacGia } from '@prisma/client/sql';

const rows = await prisma.$queryRawTyped(thongKeTacGia(tacGiaId, 20));

rows[0].so_binh_luan;   <span class="tok-comment">// number</span>
rows[0].createdAt;      <span class="tok-comment">// Date</span>
rows[0].khong_co_that;  <span class="tok-comment">// ❌ Property 'khong_co_that' does not exist</span></code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Build</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Prisma reads the .sql file</span><span class="lz-nsub">Parses the @param comments for the input types</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Prepares it against the real database</span><span class="lz-nsub">PostgreSQL reports the result column names and types</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Generate</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A typed function per file</span><span class="lz-nsub">Arguments from @param, return type from the database</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Compile</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tsc checks both ends</span><span class="lz-nsub">Wrong argument type, wrong field read — both are errors now</span></div></div>
  </div>
</div>

<h3>The drift from Lesson 10.2, now caught at build</h3>
<pre><code><span class="tok-comment">// A migration renames content → body.</span>
<span class="tok-comment">// The $queryRaw version of this query still compiles. Then:</span>
npx prisma generate --sql</code></pre>
<div class="out">Error: Failed to generate SQL queries

  prisma/sql/thongKeTacGia.sql
    Error: column p.content does not exist
      LINE 3:   p.content,
                ^
      HINT: Perhaps you meant to reference the column "p.body".

✖ Generating SQL queries failed. Exit code 1.</div>
<div class="callout ok">
<p><strong>This error appearing in CI is the entire value proposition.</strong> The same mistake, without TypedSQL, is a field that quietly becomes <code>undefined</code> in production — and if that field feeds a template or a JSON response, nothing throws at all; the page just renders empty. With TypedSQL the build fails, on the commit that caused it, with the column name and a hint. That is the difference between a bug and a compile error, applied to the one part of the codebase where Prisma previously could not help.</p>
</div>

<h3>The <code>@param</code> comment, in full</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-- @param {String} $1:ten</code></span><span class="v">Position, type, and the name the generated function's argument will have. The name is what appears in your editor's autocomplete, so make it readable.</span></div>
  <div class="kv"><span class="k">The type names</span><span class="v"><code>String</code>, <code>Int</code>, <code>BigInt</code>, <code>Float</code>, <code>Boolean</code>, <code>DateTime</code>, <code>Decimal</code>, <code>Json</code>, <code>Bytes</code> — the Prisma scalar names, not the PostgreSQL ones.</span></div>
  <div class="kv"><span class="k">Optional parameters</span><span class="v"><code>-- @param {String} $1:tuKhoa?</code> — the trailing <code>?</code> makes the argument <code>string | null</code>. Use it with <code>WHERE (\$1 IS NULL OR content ILIKE \$1)</code> for a filter that may be absent.</span></div>
  <div class="kv"><span class="k">A description after the name</span><span class="v">Everything after the name becomes the JSDoc comment on the generated argument. It costs one line and shows up on hover months later.</span></div>
</div>
<pre><code><span class="tok-comment">-- prisma/sql/timBai.sql — an optional filter, no dynamic SQL needed</span>
<span class="tok-comment">-- @param {String}   $1:tuKhoa?   Tu khoa, bo trong de lay tat ca</span>
<span class="tok-comment">-- @param {DateTime} $2:tuNgay?   Chi lay bai tu ngay nay tro di</span>
SELECT id, content, "createdAt"
FROM "SocialPost"
WHERE "deletedAt" IS NULL
  AND ($1::text IS NULL OR content ILIKE '%' || $1 || '%')
  AND ($2::timestamptz IS NULL OR "createdAt" &gt;= $2)
ORDER BY "createdAt" DESC
LIMIT 50;</code></pre>
<div class="out">import { timBai } from '@prisma/client/sql';

await prisma.$queryRawTyped(timBai('prisma', null));
await prisma.$queryRawTyped(timBai(null, new Date('2026-08-01')));
await prisma.$queryRawTyped(timBai(null, null));       // tat ca</div>

<h3>The cost, stated honestly</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">CI needs a live database</span><span class="lz-lnote">This is the real price. <code>prisma generate --sql</code> connects and prepares each statement; without a reachable <code>DATABASE_URL</code> whose schema is current, the build fails. A Postgres service container plus <code>prisma migrate deploy</code> before generate — about eight lines of workflow YAML, and then it is permanent.</span></div>
  <div class="lz-layer"><span class="lz-lname">The schema must be migrated first</span><span class="lz-lnote">Generate against a database that is one migration behind and you get the <em>old</em> types, silently, in a green build. The order is always: <code>migrate deploy</code>, then <code>generate --sql</code>. Put them in that order in one npm script so nobody can run half of it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Static SQL only</span><span class="lz-lnote">The file cannot be assembled at runtime. Optional parameters cover "this filter may be absent"; they do not cover "the caller chooses which of nine columns to sort by". That still needs <code>Prisma.sql</code> and <code>Prisma.raw</code> from Lesson 10.1 — and those still have no compile-time check.</span></div>
  <div class="lz-layer"><span class="lz-lname">Preview feature, PostgreSQL first</span><span class="lz-lnote">Still behind <code>previewFeatures</code> as of Prisma 6.x, with PostgreSQL the best-supported provider (MySQL and SQLite work; others do not). Preview means the API can change between minor versions — pin the Prisma version if you adopt it widely.</span></div>
</div>
<pre><code><span class="tok-comment"># .github/workflows/ci-lint.yml — the eight lines</span>
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
<p><strong>Bẫy — <code>prisma generate</code> without <code>--sql</code> leaves the old generated queries in place.</strong> It succeeds, prints a green tick, and your <code>@prisma/client/sql</code> import still resolves — to the types from the last time someone remembered the flag. Put <code>--sql</code> in the <code>postinstall</code> script and in every place the repository generates, or one machine in the team will be compiling against types nobody else has.</p>
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
<pre><code><span class="tok-comment">// schema.prisma</span>
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["typedSql"]
}</code></pre>
<pre><code><span class="tok-comment"># prisma/sql/thongKeTacGia.sql — tên thư mục là CỐ ĐỊNH</span>
<span class="tok-comment">-- @param {String} $1:tacGiaId  ID cua tac gia</span>
<span class="tok-comment">-- @param {Int}    $2:gioiHan   So hang toi da</span>
SELECT
  p.id,
  p.content,
  p."createdAt",
  count(c.id)::int AS so_binh_luan
FROM "SocialPost" p
LEFT JOIN "Comment" c ON c."postId" = p.id
WHERE p."authorId" = $1 AND p."deletedAt" IS NULL
GROUP BY p.id
ORDER BY p."createdAt" DESC
LIMIT $2;</code></pre>
<pre><code><span class="tok-comment"># Sinh mã. Chú ý cái cờ — &#96;prisma generate&#96; trơn BỎ QUA các file .sql.</span>
npx prisma generate --sql</code></pre>
<div class="out">Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "cuongthai" at "localhost:5432"

✔ Generated Prisma Client (v6.4.1) to ./node_modules/@prisma/client in 284ms
✔ Generated 1 SQL query to ./node_modules/@prisma/client/sql in 41ms</div>
<pre><code><span class="tok-comment">// Dùng nó. Đường import là @prisma/client/sql, KHÔNG phải @prisma/client.</span>
import { thongKeTacGia } from '@prisma/client/sql';

const rows = await prisma.$queryRawTyped(thongKeTacGia(tacGiaId, 20));

rows[0].so_binh_luan;   <span class="tok-comment">// number</span>
rows[0].createdAt;      <span class="tok-comment">// Date</span>
rows[0].khong_co_that;  <span class="tok-comment">// ❌ Property 'khong_co_that' does not exist</span></code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Build</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Prisma đọc file .sql</span><span class="lz-nsub">Phân tích các chú thích @param để lấy kiểu đầu vào</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chuẩn bị nó trên cơ sở dữ liệu THẬT</span><span class="lz-nsub">PostgreSQL báo lại tên cột và kiểu của kết quả</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Generate</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một hàm có kiểu cho mỗi file</span><span class="lz-nsub">Đối số lấy từ @param, kiểu trả về lấy từ cơ sở dữ liệu</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Biên dịch</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">tsc kiểm CẢ HAI đầu</span><span class="lz-nsub">Sai kiểu đối số, đọc sai tên trường — giờ đều là lỗi</span></div></div>
  </div>
</div>

<h3>Cú trôi dạt của Bài 10.2, giờ bị bắt ngay lúc build</h3>
<pre><code><span class="tok-comment">// Một migration đổi tên content → body.</span>
<span class="tok-comment">// Bản $queryRaw của câu truy vấn này VẪN biên dịch được. Rồi thì:</span>
npx prisma generate --sql</code></pre>
<div class="out">Error: Failed to generate SQL queries

  prisma/sql/thongKeTacGia.sql
    Error: column p.content does not exist
      LINE 3:   p.content,
                ^
      HINT: Perhaps you meant to reference the column "p.body".

✖ Generating SQL queries failed. Exit code 1.</div>
<div class="callout ok">
<p><strong>Việc cái lỗi này hiện ra TRONG CI chính là toàn bộ giá trị của TypedSQL.</strong> Cũng lỗi ấy, khi không có TypedSQL, là một trường lặng lẽ thành <code>undefined</code> trên production — và nếu trường đó chảy vào một template hay một phản hồi JSON thì chẳng có gì ném lỗi cả; trang chỉ hiện ra trống rỗng. Với TypedSQL thì bản dựng HỎNG, ngay trên commit gây ra nó, kèm tên cột và một gợi ý. Đó là khác biệt giữa một con bug với một lỗi biên dịch, áp đúng vào cái phần duy nhất của kho mã mà trước đây Prisma không giúp được gì.</p>
</div>

<h3>Chú thích <code>@param</code>, đầy đủ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-- @param {String} $1:ten</code></span><span class="v">Vị trí, kiểu, và cái TÊN mà đối số của hàm sinh ra sẽ mang. Cái tên đó là thứ hiện lên trong gợi ý của trình soạn thảo, nên hãy đặt cho dễ đọc.</span></div>
  <div class="kv"><span class="k">Các tên kiểu</span><span class="v"><code>String</code>, <code>Int</code>, <code>BigInt</code>, <code>Float</code>, <code>Boolean</code>, <code>DateTime</code>, <code>Decimal</code>, <code>Json</code>, <code>Bytes</code> — tên kiểu vô hướng của PRISMA, không phải của PostgreSQL.</span></div>
  <div class="kv"><span class="k">Tham số tuỳ chọn</span><span class="v"><code>-- @param {String} $1:tuKhoa?</code> — dấu <code>?</code> ở cuối làm đối số thành <code>string | null</code>. Dùng nó cùng <code>WHERE (\$1 IS NULL OR content ILIKE \$1)</code> cho một bộ lọc có thể vắng mặt.</span></div>
  <div class="kv"><span class="k">Phần mô tả sau cái tên</span><span class="v">Mọi thứ viết sau tên sẽ thành chú thích JSDoc trên đối số được sinh ra. Tốn một dòng, và hiện lên khi bạn rê chuột vào nó mấy tháng sau.</span></div>
</div>
<pre><code><span class="tok-comment">-- prisma/sql/timBai.sql — một bộ lọc tuỳ chọn, không cần SQL động</span>
<span class="tok-comment">-- @param {String}   $1:tuKhoa?   Tu khoa, bo trong de lay tat ca</span>
<span class="tok-comment">-- @param {DateTime} $2:tuNgay?   Chi lay bai tu ngay nay tro di</span>
SELECT id, content, "createdAt"
FROM "SocialPost"
WHERE "deletedAt" IS NULL
  AND ($1::text IS NULL OR content ILIKE '%' || $1 || '%')
  AND ($2::timestamptz IS NULL OR "createdAt" &gt;= $2)
ORDER BY "createdAt" DESC
LIMIT 50;</code></pre>
<div class="out">import { timBai } from '@prisma/client/sql';

await prisma.$queryRawTyped(timBai('prisma', null));
await prisma.$queryRawTyped(timBai(null, new Date('2026-08-01')));
await prisma.$queryRawTyped(timBai(null, null));       // tat ca</div>

<h3>Cái giá, nói cho thật</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">CI cần một cơ sở dữ liệu SỐNG</span><span class="lz-lnote">Đây là cái giá thật. <code>prisma generate --sql</code> phải KẾT NỐI và chuẩn bị từng câu lệnh; không có một <code>DATABASE_URL</code> chạm tới được và có lược đồ mới nhất thì bản dựng hỏng. Một service container Postgres cộng <code>prisma migrate deploy</code> chạy trước generate — chừng tám dòng YAML, và sau đó thì nó vĩnh viễn nằm đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lược đồ phải được migrate TRƯỚC</span><span class="lz-lnote">Generate trên một cơ sở dữ liệu chậm một migration thì bạn nhận kiểu CŨ, một cách lặng lẽ, trong một bản dựng màu xanh. Thứ tự LUÔN là: <code>migrate deploy</code> rồi mới <code>generate --sql</code>. Nhét chúng theo thứ tự đó vào MỘT npm script để không ai chạy được nửa vời.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ SQL TĨNH</span><span class="lz-lnote">File không thể được lắp ráp lúc chạy. Tham số tuỳ chọn phủ được "bộ lọc này có thể vắng"; nó KHÔNG phủ được "người gọi chọn sắp xếp theo một trong chín cột". Cái đó vẫn cần <code>Prisma.sql</code> và <code>Prisma.raw</code> của Bài 10.1 — và những cái đó vẫn không có phép kiểm lúc biên dịch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tính năng xem trước, PostgreSQL đi đầu</span><span class="lz-lnote">Tới Prisma 6.x nó vẫn nằm sau <code>previewFeatures</code>, với PostgreSQL là provider được hỗ trợ tốt nhất (MySQL và SQLite chạy được; những cái khác thì không). "Xem trước" nghĩa là API có thể đổi giữa hai bản minor — hãy ghim phiên bản Prisma nếu bạn dùng nó rộng rãi.</span></div>
</div>
<pre><code><span class="tok-comment"># .github/workflows/ci-lint.yml — tám dòng đó</span>
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
      description: 'Bốn thành phần result, model, query, client; trường tính toán kèm needs; phương thức riêng cho từng model; chặn mọi thao tác để làm soft delete — và ba chỗ soft delete bằng extension KHÔNG với tới, phải biết trước khi tin nó.',
      content: `
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
<pre><code><span class="tok-comment">// $extends returns a NEW client. It does not mutate the old one.</span>
const prismaGoc = new PrismaClient();
const prisma    = prismaGoc.$extends(mở_rộng);   <span class="tok-comment">// ✅ assign the result</span>

prismaGoc.$extends(mở_rộng);                      <span class="tok-comment">// ❌ does nothing at all</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — calling <code>$extends</code> without assigning is a silent no-op.</strong> No error, no warning; the extension simply never runs, and the soft-delete filter you were relying on is not there. Export exactly one extended client from one module and import it everywhere — <code>export const prisma = new PrismaClient().$extends(…)</code> — so there is no un-extended client available to import by accident.</p>
</div>

<h3><code>result</code> — computed fields, and the <code>needs</code> that makes them work</h3>
<pre><code>const mediaExt = Prisma.defineExtension({
  name: 'media-url',
  result: {
    user: {
      anhDaiDien: {
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
<pre><code>const u = await prisma.user.findUniqueOrThrow({ where: { id }, select: { anhDaiDien: true } });
console.log(u.anhDaiDien);   <span class="tok-comment">// string — and avatarUrl was fetched automatically</span></code></pre>
<div class="out">prisma:query SELECT "public"."User"."avatar_url" FROM "public"."User" WHERE …
https://media.cuongthai.com/avatars/clx7….webp</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>needs</code></span><span class="lz-t">Declares the dependency</span><span class="lz-d">Selecting only the computed field still fetches the columns it needs — Prisma adds them to the SQL and removes them from the result. Forget <code>needs</code> and <code>compute</code> receives <code>undefined</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Computed in JavaScript</span><span class="lz-t">The hard limit</span><span class="lz-d">It runs after the rows arrive, so it cannot appear in <code>where</code>, <code>orderBy</code>, or <code>groupBy</code>. "Sort by <code>daSua</code>" is not expressible — that needs a real column or a raw query.</span></div>
  <div class="lz-step"><span class="lz-k">The 2026-07-02 bug, prevented</span><span class="lz-t">One place, not thirty</span><span class="lz-d">CuongThai's <code>getMediaUrl</code> once prefixed the CDN base onto <code>blob:</code> preview URLs and produced a 400. The fix belongs in one <code>compute</code>, not in every component that renders an avatar.</span></div>
  <div class="lz-step"><span class="lz-k"><code>Prisma.defineExtension</code></span><span class="lz-t">For reuse and types</span><span class="lz-d">Defining the extension separately keeps type inference working across files and lets you compose several: <code>client.$extends(a).$extends(b)</code>.</span></div>
</div>

<h3><code>model</code> and <code>client</code> — methods where you expect them</h3>
<pre><code>const truyVanExt = Prisma.defineExtension({
  name: 'truy-van-thuong-dung',
  model: {
    user: {
      async timTheoEmailHoacTen(q: string) {
        return prisma.user.findFirst({
          where: { OR: [{ email: q }, { username: q }] },
          select: { id: true, username: true, email: true },
        });
      },
    },
    $allModels: {
      async tonTai&lt;T&gt;(this: T, where: Prisma.Args&lt;T, 'findFirst'&gt;['where']): Promise&lt;boolean&gt; {
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
<pre><code>await prisma.user.timTheoEmailHoacTen('an@vidu.com');
await prisma.socialPost.tonTai({ id: postId });   <span class="tok-comment">// on every model</span>
await prisma.$kiemTraSucKhoe();                    <span class="tok-comment">// → 1.84 (ms)</span></code></pre>
<div class="callout ok">
<p><strong><code>$allModels</code> plus <code>Prisma.getExtensionContext(this)</code> is how you write a method once for every model.</strong> <code>this</code> inside the method is the model delegate it was called on, and <code>getExtensionContext</code> gives you a properly-typed handle to it. It is the closest Prisma gets to a base repository class, without any of the inheritance.</p>
</div>

<h3><code>query</code> — soft delete, and what it actually covers</h3>
<pre><code>const softDeleteExt = Prisma.defineExtension({
  name: 'soft-delete',
  query: {
    socialPost: {
      <span class="tok-comment">// turn delete into an update</span>
      async delete({ args, query }) {
        return prisma.socialPost.update({ ...args, data: { deletedAt: new Date() } });
      },
      async deleteMany({ args }) {
        return prisma.socialPost.updateMany({ ...args, data: { deletedAt: new Date() } });
      },
      <span class="tok-comment">// hide soft-deleted rows from reads</span>
      async $allOperations({ operation, args, query }) {
        if (['findMany', 'findFirst', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});</code></pre>
<pre><code>await prisma.socialPost.delete({ where: { id } });
await prisma.socialPost.findMany({ where: { authorId } });</code></pre>
<div class="out">prisma:query UPDATE "SocialPost" SET "deletedAt" = $1 WHERE "id" = $2
prisma:query SELECT … FROM "SocialPost" WHERE "authorId" = $1 AND "deletedAt" IS NULL</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">✗ Raw queries</span><span class="lz-lnote">Lesson 10.2 said this and it is worth repeating here: <code>$queryRaw</code> goes straight to the database. Every raw query in the codebase must write <code>AND "deletedAt" IS NULL</code> itself, forever, and nothing will remind it to.</span></div>
  <div class="lz-layer"><span class="lz-lname">✗ Rows reached through a relation</span><span class="lz-lnote"><code>prisma.user.findMany({ include: { posts: true } })</code> is a <code>findMany</code> on <strong>User</strong>. The extension's <code>socialPost</code> hooks never fire, and deleted posts come back inside the include. Filter in the include itself: <code>include: { posts: { where: { deletedAt: null } } }</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">✗ Cascades from the database</span><span class="lz-lnote"><code>onDelete: Cascade</code> is a real foreign key. Hard-deleting a <code>User</code> deletes their posts <em>in PostgreSQL</em>, past every extension. Soft delete and cascading hard delete cannot both be the rule for the same relation — pick one per relation and write down which.</span></div>
  <div class="lz-layer"><span class="lz-lname">✓ Unique constraints keep counting deleted rows</span><span class="lz-lnote">A soft-deleted user still occupies their email in a <code>@unique</code> column, so re-registering fails with <code>P2002</code>. The fix is a partial unique index — <code>CREATE UNIQUE INDEX … WHERE "deletedAt" IS NULL</code> — hand-written in a migration, because the schema language cannot express it.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — an incomplete soft-delete extension is more dangerous than none.</strong> With no extension, every developer knows they must filter and they do. With one that covers four operations out of a dozen, everybody stops thinking about it — and the day someone adds an <code>include</code>, deleted content appears in a response with no code change to blame. If you adopt soft delete, write down the three gaps above next to the extension, and test the include path specifically.</p>
</div>
<div class="note-ct">
<p><strong>Why CuongThai does per-viewer deletion in the query layer instead.</strong> Message threads use a per-viewer <code>deletedAt</code> (delete-for-me), and on 2026-07-02 that looked exactly like data loss until someone read the query filters. The lesson taken from it was not "add an extension" but "make the filter visible at the call site": <code>listThreadsForUser</code> states its own <code>deletedAt</code> condition, so the next person debugging it finds the answer in the function they are already reading, not in an extension registered in a different file.</p>
</div>

<h3>Migrating off <code>$use</code></h3>
<pre><code><span class="tok-comment">// Old middleware — deprecated, and untyped: params.args is &#96;any&#96;</span>
prisma.$use(async (params, next) =&gt; {
  if (params.model === 'SocialPost' &amp;&amp; params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deletedAt: new Date() };
  }
  return next(params);
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Types</span><span class="v"><code>$use</code> gives you <code>params.args: any</code> and a string <code>model</code>. <code>query</code> extensions give you the real argument type for that model and operation, so a typo in a field name is a compile error.</span></div>
  <div class="kv"><span class="k">Scope</span><span class="v"><code>$use</code> is global and order-dependent across every registration. Extensions are scoped to the models and operations you name, and compose explicitly.</span></div>
  <div class="kv"><span class="k">Mutation</span><span class="v"><code>$use</code> mutates the shared client — every import sees it, including code that did not want it. <code>$extends</code> returns a new client, so an un-extended one remains available for the migration script that genuinely needs to hard-delete.</span></div>
  <div class="kv"><span class="k">Both at once</span><span class="v">They still work together during a migration, with <code>$use</code> running first. Do not leave it that way: two layers rewriting the same arguments is a debugging problem nobody enjoys twice.</span></div>
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
<pre><code><span class="tok-comment">// $extends trả về một client MỚI. Nó KHÔNG sửa cái cũ.</span>
const prismaGoc = new PrismaClient();
const prisma    = prismaGoc.$extends(moRong);   <span class="tok-comment">// ✅ gán kết quả lại</span>

prismaGoc.$extends(moRong);                      <span class="tok-comment">// ❌ chẳng làm gì cả</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — gọi <code>$extends</code> mà không gán là một cú KHÔNG-LÀM-GÌ lặng lẽ.</strong> Không lỗi, không cảnh báo; phần mở rộng đơn giản là không bao giờ chạy, và cái bộ lọc soft delete bạn đang trông cậy vào thì không có ở đó. Hãy export ĐÚNG MỘT client đã mở rộng từ ĐÚNG MỘT module rồi import nó ở mọi nơi — <code>export const prisma = new PrismaClient().$extends(…)</code> — để không còn cái client chưa mở rộng nào nằm đó cho người ta lỡ tay import.</p>
</div>

<h3><code>result</code> — trường tính toán, và cái <code>needs</code> làm chúng chạy được</h3>
<pre><code>const mediaExt = Prisma.defineExtension({
  name: 'media-url',
  result: {
    user: {
      anhDaiDien: {
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
<pre><code>const u = await prisma.user.findUniqueOrThrow({ where: { id }, select: { anhDaiDien: true } });
console.log(u.anhDaiDien);   <span class="tok-comment">// string — và avatarUrl được lấy về TỰ ĐỘNG</span></code></pre>
<div class="out">prisma:query SELECT "public"."User"."avatar_url" FROM "public"."User" WHERE …
https://media.cuongthai.com/avatars/clx7….webp</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k"><code>needs</code></span><span class="lz-t">Khai báo phần phụ thuộc</span><span class="lz-d">Chọn mỗi trường tính toán thôi thì Prisma vẫn lấy về những cột nó cần — thêm chúng vào câu SQL rồi gỡ chúng khỏi kết quả. Quên <code>needs</code> thì <code>compute</code> nhận <code>undefined</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Tính trong JavaScript</span><span class="lz-t">Giới hạn CỨNG</span><span class="lz-d">Nó chạy SAU khi các hàng về, nên nó KHÔNG xuất hiện được trong <code>where</code>, <code>orderBy</code>, hay <code>groupBy</code>. "Sắp xếp theo <code>daSua</code>" là không diễn đạt được — cái đó cần một cột thật hoặc một truy vấn thô.</span></div>
  <div class="lz-step"><span class="lz-k">Con bug 02/07/2026, được chặn</span><span class="lz-t">Một chỗ, không phải ba mươi</span><span class="lz-d"><code>getMediaUrl</code> của CuongThai từng gắn tiền tố CDN vào URL xem trước dạng <code>blob:</code> và tạo ra lỗi 400. Chỗ vá thuộc về MỘT hàm <code>compute</code>, không phải mọi component có vẽ ảnh đại diện.</span></div>
  <div class="lz-step"><span class="lz-k"><code>Prisma.defineExtension</code></span><span class="lz-t">Để dùng lại và để có kiểu</span><span class="lz-d">Định nghĩa phần mở rộng tách riêng giữ cho suy diễn kiểu chạy xuyên file, và cho phép ghép nhiều cái: <code>client.$extends(a).$extends(b)</code>.</span></div>
</div>

<h3><code>model</code> và <code>client</code> — phương thức nằm đúng chỗ bạn mong</h3>
<pre><code>const truyVanExt = Prisma.defineExtension({
  name: 'truy-van-thuong-dung',
  model: {
    user: {
      async timTheoEmailHoacTen(q: string) {
        return prisma.user.findFirst({
          where: { OR: [{ email: q }, { username: q }] },
          select: { id: true, username: true, email: true },
        });
      },
    },
    $allModels: {
      async tonTai&lt;T&gt;(this: T, where: Prisma.Args&lt;T, 'findFirst'&gt;['where']): Promise&lt;boolean&gt; {
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
<pre><code>await prisma.user.timTheoEmailHoacTen('an@vidu.com');
await prisma.socialPost.tonTai({ id: postId });   <span class="tok-comment">// có trên MỌI model</span>
await prisma.$kiemTraSucKhoe();                    <span class="tok-comment">// → 1,84 (ms)</span></code></pre>
<div class="callout ok">
<p><strong><code>$allModels</code> cộng <code>Prisma.getExtensionContext(this)</code> là cách viết MỘT phương thức dùng cho MỌI model.</strong> <code>this</code> bên trong phương thức chính là cái delegate model mà nó được gọi lên, và <code>getExtensionContext</code> trao cho bạn một tay cầm có kiểu đàng hoàng vào đó. Đây là thứ gần nhất với một lớp repository cơ sở mà Prisma có, mà không mang theo tí kế thừa nào.</p>
</div>

<h3><code>query</code> — soft delete, và nó THẬT SỰ phủ tới đâu</h3>
<pre><code>const softDeleteExt = Prisma.defineExtension({
  name: 'soft-delete',
  query: {
    socialPost: {
      <span class="tok-comment">// biến delete thành update</span>
      async delete({ args, query }) {
        return prisma.socialPost.update({ ...args, data: { deletedAt: new Date() } });
      },
      async deleteMany({ args }) {
        return prisma.socialPost.updateMany({ ...args, data: { deletedAt: new Date() } });
      },
      <span class="tok-comment">// giấu những hàng đã xoá mềm khỏi các thao tác đọc</span>
      async $allOperations({ operation, args, query }) {
        if (['findMany', 'findFirst', 'count', 'aggregate'].includes(operation)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});</code></pre>
<pre><code>await prisma.socialPost.delete({ where: { id } });
await prisma.socialPost.findMany({ where: { authorId } });</code></pre>
<div class="out">prisma:query UPDATE "SocialPost" SET "deletedAt" = $1 WHERE "id" = $2
prisma:query SELECT … FROM "SocialPost" WHERE "authorId" = $1 AND "deletedAt" IS NULL</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">✗ Truy vấn thô</span><span class="lz-lnote">Bài 10.2 đã nói và ở đây đáng nói lại: <code>$queryRaw</code> đi THẲNG xuống cơ sở dữ liệu. MỌI truy vấn thô trong kho mã phải tự viết <code>AND "deletedAt" IS NULL</code>, mãi mãi, và sẽ không có gì nhắc nó cả.</span></div>
  <div class="lz-layer"><span class="lz-lname">✗ Hàng đi tới qua một QUAN HỆ</span><span class="lz-lnote"><code>prisma.user.findMany({ include: { posts: true } })</code> là một <code>findMany</code> trên <strong>User</strong>. Các móc <code>socialPost</code> của phần mở rộng KHÔNG BAO GIỜ nổ, và bài đã xoá quay về ngay bên trong cái include. Hãy lọc ngay trong chính include: <code>include: { posts: { where: { deletedAt: null } } }</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">✗ Cascade từ cơ sở dữ liệu</span><span class="lz-lnote"><code>onDelete: Cascade</code> là một khoá ngoại THẬT. Xoá cứng một <code>User</code> sẽ xoá bài của họ <em>trong PostgreSQL</em>, vượt qua mọi phần mở rộng. Soft delete và xoá cứng theo cascade KHÔNG thể cùng là luật cho một quan hệ — hãy chọn một cho mỗi quan hệ và ghi lại là chọn cái nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">✓ Ràng buộc duy nhất VẪN đếm cả hàng đã xoá</span><span class="lz-lnote">Một người dùng đã xoá mềm vẫn CHIẾM email của họ trong một cột <code>@unique</code>, nên đăng ký lại thất bại với <code>P2002</code>. Cách vá là một chỉ mục duy nhất từng phần — <code>CREATE UNIQUE INDEX … WHERE "deletedAt" IS NULL</code> — viết tay trong một migration, vì ngôn ngữ lược đồ không diễn đạt được nó.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một phần mở rộng soft delete LÀM DỞ còn nguy hiểm hơn là không có.</strong> Khi không có phần mở rộng, mọi lập trình viên đều BIẾT là phải tự lọc, và họ lọc. Khi có một cái phủ bốn thao tác trên hơn chục thao tác, tất cả ngừng nghĩ tới nó — và cái ngày có người thêm một <code>include</code>, nội dung đã xoá xuất hiện trong một phản hồi mà không có dòng mã nào để đổ lỗi. Nếu bạn dùng soft delete, hãy ghi ba khoảng hở ở trên ngay cạnh phần mở rộng, và kiểm thử RIÊNG đường include.</p>
</div>
<div class="note-ct">
<p><strong>Vì sao CuongThai làm xoá-theo-từng-người-xem ở tầng truy vấn thay vì ở đây.</strong> Các luồng tin nhắn dùng <code>deletedAt</code> theo từng người xem (xoá-cho-riêng-tôi), và ngày 02/07/2026 chuyện đó trông y hệt mất dữ liệu cho tới khi có người đọc lại các bộ lọc trong truy vấn. Bài học rút ra KHÔNG phải "thêm một phần mở rộng" mà là "làm cho bộ lọc HIỆN RA ngay chỗ gọi": <code>listThreadsForUser</code> tự viết điều kiện <code>deletedAt</code> của nó, nên người gỡ lỗi kế tiếp tìm thấy câu trả lời ngay trong cái hàm họ đang đọc, chứ không phải trong một phần mở rộng đăng ký ở file khác.</p>
</div>

<h3>Rời khỏi <code>$use</code></h3>
<pre><code><span class="tok-comment">// Middleware cũ — đã lỗi thời, và không có kiểu: params.args là &#96;any&#96;</span>
prisma.$use(async (params, next) =&gt; {
  if (params.model === 'SocialPost' &amp;&amp; params.action === 'delete') {
    params.action = 'update';
    params.args.data = { deletedAt: new Date() };
  }
  return next(params);
});</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểu</span><span class="v"><code>$use</code> trao cho bạn <code>params.args: any</code> và một <code>model</code> dạng chuỗi. Phần mở rộng <code>query</code> trao cho bạn kiểu đối số THẬT của model và thao tác đó, nên gõ sai một tên trường là lỗi biên dịch.</span></div>
  <div class="kv"><span class="k">Phạm vi</span><span class="v"><code>$use</code> là toàn cục và phụ thuộc thứ tự đăng ký giữa mọi lần gọi. Phần mở rộng có phạm vi đúng những model và thao tác bạn gọi tên, và ghép lại một cách TƯỜNG MINH.</span></div>
  <div class="kv"><span class="k">Sửa đổi tại chỗ</span><span class="v"><code>$use</code> SỬA chính cái client dùng chung — mọi lần import đều thấy, kể cả những đoạn mã không muốn. <code>$extends</code> trả về client mới, nên vẫn còn một cái CHƯA mở rộng cho cái script migration thật sự cần xoá cứng.</span></div>
  <div class="kv"><span class="k">Dùng cả hai cùng lúc</span><span class="v">Chúng vẫn chạy chung được trong lúc chuyển đổi, với <code>$use</code> chạy trước. ĐỪNG để nguyên như thế: hai tầng cùng viết lại một bộ đối số là một bài toán gỡ lỗi không ai muốn nếm tới lần thứ hai.</span></div>
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
