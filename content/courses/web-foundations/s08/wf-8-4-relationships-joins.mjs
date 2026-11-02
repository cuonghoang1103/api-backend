/**
 * Bài 8.4 — Quan hệ và JOIN (nâng cấp 02/11/2026). Output thật: _demo/_t8/chay.sh (sqlite3 3.54: INNER vs LEFT JOIN, đếm bài mỗi người
 * kể cả 0, nối 3 bảng, ON DELETE CASCADE xoá bình luận theo bài, khoá ngoại chặn xoá người có bình luận), _demo/_t8/nhieu-nhieu.sh
 * (bảng nối post_tags), _demo/_t8/n-plus-1.mjs (Node 22.23 + node:sqlite: 1001 truy vấn vs 1 JOIN).
 * Deck: scripts/slides-src/wf-8-4.mjs (9 slide, WF/v1/wf-8-4). Code Lab: wf-8-4-relationships-joins.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';


const G = walkWf('wf-8-4', 'Relationships and JOINs', 'Quan hệ và JOIN', [
  [1, 'Relationships and JOINs',
    '<p>Real data is not one table: users write posts, posts receive comments, posts carry tags. Tables point at each other with keys, and a JOIN brings the pieces back together in one result. This lesson covers the joins you will write every week and the performance trap that ORMs make easy to fall into.</p>',
    '<p>Dữ liệu thật không phải một bảng: người dùng viết bài, bài nhận bình luận, bài mang thẻ. Các bảng trỏ vào nhau bằng khoá, và JOIN ghép các mảnh lại thành một kết quả. Bài này phủ những phép nối bạn sẽ viết hằng tuần và cái bẫy hiệu năng mà ORM khiến ta dễ rơi vào.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to explain primary and foreign keys, model one-to-many and many-to-many relationships, choose between INNER and LEFT JOIN, count related rows including zeros, decide what happens when a parent row is deleted, and recognise the N plus one query problem.</p>',
    '<p>Bạn sẽ giải thích được khoá chính và khoá ngoại, mô hình hoá quan hệ một-nhiều và nhiều-nhiều, chọn giữa INNER và LEFT JOIN, đếm dòng liên quan kể cả số không, quyết định chuyện gì xảy ra khi xoá một dòng cha, và nhận ra vấn đề N cộng một truy vấn.</p>'],
  [3, 'Keys connect tables',
    '<p>Each post stores the id of its author in user_id: that one number is the whole relationship. One user has many posts; each post has at most one author. A foreign key makes the database check that the number points at a real user.</p>',
    '<p>Mỗi bài lưu id của tác giả trong user_id: một con số đó là toàn bộ quan hệ. Một người dùng có nhiều bài; mỗi bài có nhiều nhất một tác giả. Khoá ngoại khiến CSDL kiểm rằng con số đó trỏ tới một người dùng có thật.</p>'],
  [4, 'INNER or LEFT',
    '<p>INNER JOIN keeps only rows that have a match on both sides, so the post without an author disappeared. LEFT JOIN keeps every row of the left table and fills the missing side with NULL. Choose by asking: may the left row exist without a partner?</p>',
    '<p>INNER JOIN chỉ giữ dòng có cặp ở cả hai bên, nên bài không có tác giả biến mất. LEFT JOIN giữ mọi dòng của bảng bên trái và điền NULL cho bên thiếu. Hãy chọn bằng câu hỏi: dòng bên trái có thể tồn tại mà không có cặp không?</p>'],
  [5, 'Counting with zeros',
    '<p>"Posts per user" with LEFT JOIN listed An with zero posts. The same query with INNER JOIN silently dropped her. Counting the right side\'s id, not star, is what turns her row into a zero. Joins can also chain: comments, their post and their author in one query.</p>',
    '<p>"Số bài mỗi người" với LEFT JOIN liệt kê An với không bài. Cùng truy vấn với INNER JOIN lặng lẽ bỏ cô ấy. Đếm id của bên phải, không phải dấu sao, là thứ biến dòng của cô thành số không. Phép nối còn xâu chuỗi được: bình luận, bài của nó và tác giả của nó trong một truy vấn.</p>'],
  [6, 'Many-to-many',
    '<p>A post has many tags and a tag belongs to many posts. Neither table can hold that in one column, so a third table, post_tags, stores pairs of ids. Its composite primary key stops the same pair from being added twice.</p>',
    '<p>Một bài có nhiều thẻ và một thẻ thuộc nhiều bài. Không bảng nào chứa được điều đó trong một cột, nên một bảng thứ ba, post_tags, lưu các cặp id. Khoá chính ghép của nó ngăn cùng một cặp bị thêm hai lần.</p>'],
  [7, 'When the parent is deleted',
    '<p>Deleting a post with ON DELETE CASCADE also deleted its two comments. Deleting Minh failed, because comments still point at him and that foreign key has no cascade. Decide for every foreign key: cascade, refuse, or set to NULL.</p>',
    '<p>Xoá một bài có ON DELETE CASCADE cũng xoá hai bình luận của nó. Xoá Minh thì hỏng, vì vẫn còn bình luận trỏ tới anh và khoá ngoại đó không có cascade. Hãy quyết định cho từng khoá ngoại: xoá theo, từ chối, hay đặt về NULL.</p>'],
  [8, 'The N plus one problem',
    '<p>Loading a feed of a thousand posts, then asking for each author separately, sent one thousand and one queries. One JOIN sent one and returned the same data, four times faster even in memory. Over a network, each extra query adds a round trip.</p>',
    '<p>Tải bảng tin một nghìn bài, rồi hỏi từng tác giả riêng, gửi một nghìn lẻ một truy vấn. Một JOIN gửi một truy vấn và trả cùng dữ liệu, nhanh gấp bốn lần dù chỉ trong bộ nhớ. Qua mạng, mỗi truy vấn thừa thêm một lần đi về.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to answer six questions that need joins, add a many-to-many table of your own, and fix an N plus one loop. "Done when" checks a zero that INNER JOIN would hide and a query count of one.</p>',
    '<p>Bài luyện yêu cầu bạn trả lời sáu câu hỏi cần phép nối, tự thêm một bảng nhiều-nhiều, và sửa một vòng lặp N cộng một. "Xong khi" kiểm một số không mà INNER JOIN sẽ giấu và số truy vấn bằng một.</p>'],
]);

export default {
  title: '8.4 — Relationships and JOINs|||8.4 — Quan hệ và JOIN',
  slug: 'wf-8-4-relationships-joins',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/Yh4CrPHVBdE', durationSeconds: 0 },
  description: 'Khoá chính/khoá ngoại, một-nhiều; INNER vs LEFT JOIN trên CSDL blog thật (bài không tác giả biến mất / còn lại với NULL); đếm bài mỗi người kể cả 0 (LEFT JOIN + count(posts.id)), nối 3 bảng; nhiều-nhiều bằng bảng nối post_tags và khoá chính ghép; ON DELETE CASCADE xoá bình luận theo bài, khoá ngoại chặn xoá người còn bình luận; N+1 đo thật: 1001 truy vấn vs 1 JOIN.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>Real data is tables that point at each other</h2>
<p class="lead">After this lesson you can explain how primary and foreign keys link tables, model one-to-many and many-to-many relationships, choose INNER or LEFT JOIN by asking one question, count related rows without losing the zeros, decide what should happen to child rows when a parent is deleted, and spot the N+1 query pattern that makes pages slow. Every "posts with their author", "orders with their items" and "students in a class" screen is one of these joins.</p>

<h3>Step 1 — keys connect tables</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Primary key</span><span class="lz-t">users.id</span><span class="lz-d">Identifies each row of its own table. Never changes, never reused.</span></div>
<div class="lz-layer"><span class="lz-k">Foreign key</span><span class="lz-t">posts.user_id → users.id</span><span class="lz-d">Stores another table's primary key. <code>user_id = 1</code> means "written by Lan" — that number is the entire relationship.</span></div>
<div class="lz-layer"><span class="lz-k">One-to-many</span><span class="lz-t">a user has many posts</span><span class="lz-d">The foreign key always sits on the "many" side (each post has one <code>user_id</code>; a user cannot hold a list of post ids in one column).</span></div>
<div class="lz-layer"><span class="lz-k">Many-to-many</span><span class="lz-t">posts ↔ tags</span><span class="lz-d">Needs a third <em>join table</em> with two foreign keys (Step 4).</span></div>
</div>
<p>In the blog of Lesson 8.1: <code>posts.user_id</code> references <code>users</code>; <code>comments</code> references both <code>posts</code> and <code>users</code>; post 6, "Orphan Draft", has <code>user_id</code> NULL — no author yet.</p>

<h3>Step 2 — INNER JOIN or LEFT JOIN</h3>
${ra(OUT['_t8/out/joins'])}
<div class="kv-grid">
  <div class="kv"><span class="k">INNER JOIN … ON</span><span class="v">Only pairs that match. "Orphan Draft" has no matching user, so it is gone.</span></div>
  <div class="kv"><span class="k">LEFT JOIN … ON</span><span class="v">Every row of the left table; the right side is NULL when there is no match.</span></div>
  <div class="kv"><span class="k">The question</span><span class="v">"May the left row exist without a partner, and do I still want to see it?" Yes → LEFT. No → INNER.</span></div>
  <div class="kv"><span class="k">ON</span><span class="v">The matching rule — almost always <em>foreign key = primary key</em>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — forgetting the ON condition.</strong> <code>SELECT … FROM posts, users</code> or a JOIN with a wrong ON pairs every post with every user: 6 posts × 3 users = 18 rows of nonsense, and on real tables millions. If a join returns far more rows than either table has, check the ON clause first.</p></div>

<h3>Step 3 — counting related rows, including zero</h3>
${ra(OUT['_t8/out/joins-count'])}
<p>An has written nothing. With <code>LEFT JOIN</code> she appears with 0; with <code>INNER JOIN</code> she simply vanishes — a dashboard built on that query would never show inactive users. Count <code>posts.id</code>, not <code>*</code>: for An's row, LEFT JOIN produces one row whose post columns are NULL, and <code>count(posts.id)</code> skips NULLs (Lesson 8.2), giving 0. The third query chains two joins: each comment with its post's title and its author's name.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a WHERE on the right table turns a LEFT JOIN into an INNER JOIN.</strong> <code>… LEFT JOIN posts ON … WHERE posts.published = 1</code> removes An again, because her NULL row fails the WHERE. Put conditions about the right-hand table into the ON clause: <code>LEFT JOIN posts ON posts.user_id = users.id AND posts.published = 1</code>.</p></div>

<h3>Step 4 — many-to-many with a join table</h3>
${ra(OUT['_t8/out/many-to-many'])}
<p><code>post_tags</code> holds pairs <code>(post_id, tag_id)</code>. Its primary key is the <em>pair</em>, so the same tag cannot be attached twice — the last insert proved it. <code>group_concat</code> (PostgreSQL: <code>string_agg</code>) folds the tags of each post into one column. Enrolments (students ↔ classes), order items (orders ↔ products, with a quantity column) and likes (users ↔ posts) are all this pattern.</p>

<h3>Step 5 — what happens when a parent row is deleted</h3>
${ra(OUT['_t8/out/cascade'])}
${ra(OUT['_t8/out/restrict'])}
<table>
<thead><tr><th>Rule on the foreign key</th><th>When the parent is deleted</th><th>Good for</th></tr></thead>
<tbody>
<tr><td><code>ON DELETE CASCADE</code></td><td>Children are deleted too — post 1's two comments vanished.</td><td>Things that cannot exist alone: comments of a post, items of an order.</td></tr>
<tr><td>(no action — the default)</td><td>The delete is refused while children exist — deleting Minh failed.</td><td>Protecting history: you cannot delete a user who wrote comments.</td></tr>
<tr><td><code>ON DELETE SET NULL</code></td><td>Children stay, their foreign key becomes NULL.</td><td>Optional links: a post keeps existing when its author leaves.</td></tr>
</tbody>
</table>
<p>Many apps never really delete users: they mark them <code>deleted_at = now()</code> ("soft delete") and hide them, so foreign keys and history stay intact.</p>

<h3>Step 6 — the N+1 query problem (measured)</h3>
<p>A feed shows 1,000 posts with their authors. The tempting code loads the posts, then asks for each author inside a loop:</p>
${ma('javascript', CODE['_t8/n-plus-1.mjs'], [14, 23])}
${ra(OUT['_t8/out/n-plus-1'])}
<p>1 query for the list + 1 per post = <strong>1,001 queries</strong>, against 1 for the JOIN — and the JOIN was about four times faster even with the database in the same process's memory. A real database sits across a network: at, say, half a millisecond per round trip, 1,000 extra queries add roughly half a second to every page view. ORMs make this easy to write by accident (<code>for (const p of posts) await prisma.user.findUnique(…)</code>); Lesson 8.5 shows the fix in Prisma.</p>

<div class="callout ok">
<p><strong>🧪 Practice (40 minutes) — six questions that need joins</strong></p>
<ol>
<li>Every comment with the title of its post.</li>
<li>Every user with the number of comments they wrote, including users with none.</li>
<li>Posts that have no comments (hint: LEFT JOIN and IS NULL).</li>
<li>Each author's most viewed post title (hint: join posts to itself, or use a subquery).</li>
<li>Create <code>tags</code> and <code>post_tags</code> from Step 4 and list the posts tagged <code>beginner</code>.</li>
<li>Copy <code>n-plus-1.mjs</code>, change the author lookup to the comments of each post, measure, then rewrite with one JOIN.</li>
</ol>
<p>Hint for (3): <code>SELECT p.title FROM posts p LEFT JOIN comments c ON c.post_id = p.id WHERE c.id IS NULL</code>.</p>
<p><strong>Done when:</strong> (2) shows An with 2, Lan with 1 and Minh with 2 comments; (3) returns Draft Post, Old Announcement and Orphan Draft; (5) returns Hello World, Learning SQL and Node.js Basics; and your rewritten (6) reports 1 query. Then Code Lab module 8.4.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">primary / foreign key</span><span class="v">khoá chính / khoá ngoại.</span></div>
  <div class="kv"><span class="k">one-to-many</span><span class="v">một-nhiều — khoá ngoại nằm ở phía "nhiều".</span></div>
  <div class="kv"><span class="k">many-to-many</span><span class="v">nhiều-nhiều — cần bảng nối.</span></div>
  <div class="kv"><span class="k">join table</span><span class="v">bảng nối — post_tags.</span></div>
  <div class="kv"><span class="k">INNER JOIN</span><span class="v">chỉ giữ cặp khớp.</span></div>
  <div class="kv"><span class="k">LEFT JOIN</span><span class="v">giữ mọi dòng bên trái, thiếu thì NULL.</span></div>
  <div class="kv"><span class="k">composite key</span><span class="v">khoá ghép — nhiều cột cùng làm khoá.</span></div>
  <div class="kv"><span class="k">ON DELETE CASCADE</span><span class="v">xoá cha thì xoá theo con.</span></div>
  <div class="kv"><span class="k">soft delete</span><span class="v">xoá mềm — đánh dấu thay vì xoá.</span></div>
  <div class="kv"><span class="k">N+1 queries</span><span class="v">một truy vấn danh sách + một truy vấn mỗi dòng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A foreign key stores another row's primary key; it sits on the "many" side.</li>
  <li>INNER JOIN keeps matches only; LEFT JOIN keeps every left row with NULLs.</li>
  <li>Count with LEFT JOIN and <code>count(right.id)</code> to keep the zeros; right-table filters go in ON.</li>
  <li>Many-to-many needs a join table whose primary key is the pair.</li>
  <li>Choose CASCADE, refuse, or SET NULL for every foreign key.</li>
  <li>One query per row (N+1) is slow; fetch related data with a JOIN.</li>
</ul>
${nguon('📗', 'SQLite — Foreign Key Support', 'ON DELETE actions and PRAGMA foreign_keys', 'https://sqlite.org/foreignkeys.html')}
${nguon('📘', 'PostgreSQL tutorial — Joins Between Tables', 'INNER, LEFT and self joins on a database server', 'https://www.postgresql.org/docs/current/tutorial-join.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-5-2-outer-join', title: 'PostgreSQL 5.2 — Outer joins', sub: 'LEFT, RIGHT and FULL joins and their traps, in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>Dữ liệu thật là các bảng trỏ vào nhau</h2>
<p class="lead">Học xong bài này bạn giải thích được khoá chính và khoá ngoại nối các bảng thế nào, mô hình hoá quan hệ một-nhiều và nhiều-nhiều, chọn INNER hay LEFT JOIN bằng một câu hỏi, đếm dòng liên quan mà không mất các số không, quyết định chuyện gì xảy ra với dòng con khi xoá dòng cha, và nhận ra kiểu truy vấn N+1 làm trang chậm. Mọi màn hình "bài kèm tác giả", "đơn kèm mặt hàng" và "sinh viên trong lớp" đều là một trong những phép nối này.</p>

<h3>Bước 1 — khoá nối các bảng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Khoá chính</span><span class="lz-t">users.id</span><span class="lz-d">Nhận diện từng dòng của chính bảng đó. Không bao giờ đổi, không bao giờ dùng lại.</span></div>
<div class="lz-layer"><span class="lz-k">Khoá ngoại</span><span class="lz-t">posts.user_id → users.id</span><span class="lz-d">Lưu khoá chính của bảng khác. <code>user_id = 1</code> nghĩa là "do Lan viết" — con số đó là toàn bộ quan hệ.</span></div>
<div class="lz-layer"><span class="lz-k">Một-nhiều</span><span class="lz-t">một người có nhiều bài</span><span class="lz-d">Khoá ngoại luôn nằm ở phía "nhiều" (mỗi bài có một <code>user_id</code>; một người dùng không thể giữ danh sách id bài trong một cột).</span></div>
<div class="lz-layer"><span class="lz-k">Nhiều-nhiều</span><span class="lz-t">bài ↔ thẻ</span><span class="lz-d">Cần một <em>bảng nối</em> thứ ba có hai khoá ngoại (Bước 4).</span></div>
</div>
<p>Trong blog ở Bài 8.1: <code>posts.user_id</code> trỏ tới <code>users</code>; <code>comments</code> trỏ tới cả <code>posts</code> và <code>users</code>; bài 6, "Orphan Draft", có <code>user_id</code> là NULL — chưa có tác giả.</p>

<h3>Bước 2 — INNER JOIN hay LEFT JOIN</h3>
${ra(OUT['_t8/out/joins'])}
<div class="kv-grid">
  <div class="kv"><span class="k">INNER JOIN … ON</span><span class="v">Chỉ các cặp khớp. "Orphan Draft" không có người dùng khớp, nên biến mất.</span></div>
  <div class="kv"><span class="k">LEFT JOIN … ON</span><span class="v">Mọi dòng của bảng trái; bên phải là NULL khi không khớp.</span></div>
  <div class="kv"><span class="k">Câu hỏi</span><span class="v">"Dòng bên trái có thể tồn tại mà không có cặp không, và tôi có còn muốn thấy nó?" Có → LEFT. Không → INNER.</span></div>
  <div class="kv"><span class="k">ON</span><span class="v">Luật ghép cặp — gần như luôn là <em>khoá ngoại = khoá chính</em>.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên điều kiện ON.</strong> <code>SELECT … FROM posts, users</code> hay một JOIN với ON sai sẽ ghép mọi bài với mọi người dùng: 6 bài × 3 người = 18 dòng vô nghĩa, và trên bảng thật là hàng triệu. Nếu phép nối trả nhiều dòng hơn hẳn mỗi bảng, hãy kiểm mệnh đề ON trước tiên.</p></div>

<h3>Bước 3 — đếm dòng liên quan, kể cả số không</h3>
${ra(OUT['_t8/out/joins-count'])}
<p>An chưa viết gì. Với <code>LEFT JOIN</code> cô xuất hiện với 0; với <code>INNER JOIN</code> cô đơn giản là biến mất — một bảng điều khiển dựng trên truy vấn đó sẽ không bao giờ hiện người dùng không hoạt động. Hãy đếm <code>posts.id</code>, không phải <code>*</code>: với dòng của An, LEFT JOIN sinh một dòng có các cột bài là NULL, và <code>count(posts.id)</code> bỏ qua NULL (Bài 8.2), ra 0. Truy vấn thứ ba xâu chuỗi hai phép nối: mỗi bình luận kèm tiêu đề bài và tên người viết.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — WHERE trên bảng bên phải biến LEFT JOIN thành INNER JOIN.</strong> <code>… LEFT JOIN posts ON … WHERE posts.published = 1</code> lại loại An, vì dòng NULL của cô không qua được WHERE. Hãy đặt điều kiện về bảng bên phải vào mệnh đề ON: <code>LEFT JOIN posts ON posts.user_id = users.id AND posts.published = 1</code>.</p></div>

<h3>Bước 4 — nhiều-nhiều với bảng nối</h3>
${ra(OUT['_t8/out/many-to-many'])}
<p><code>post_tags</code> giữ các cặp <code>(post_id, tag_id)</code>. Khoá chính của nó là <em>cặp</em>, nên cùng một thẻ không gắn được hai lần — lệnh chèn cuối đã chứng minh. <code>group_concat</code> (PostgreSQL: <code>string_agg</code>) gộp các thẻ của mỗi bài thành một cột. Ghi danh (sinh viên ↔ lớp), mặt hàng trong đơn (đơn ↔ sản phẩm, kèm cột số lượng) và lượt thích (người dùng ↔ bài) đều theo khuôn này.</p>

<h3>Bước 5 — chuyện gì xảy ra khi xoá dòng cha</h3>
${ra(OUT['_t8/out/cascade'])}
${ra(OUT['_t8/out/restrict'])}
<table>
<thead><tr><th>Luật trên khoá ngoại</th><th>Khi xoá dòng cha</th><th>Hợp với</th></tr></thead>
<tbody>
<tr><td><code>ON DELETE CASCADE</code></td><td>Dòng con bị xoá theo — hai bình luận của bài 1 biến mất.</td><td>Thứ không thể tồn tại một mình: bình luận của bài, mặt hàng của đơn.</td></tr>
<tr><td>(không làm gì — mặc định)</td><td>Từ chối xoá khi còn dòng con — xoá Minh bị hỏng.</td><td>Bảo vệ lịch sử: không xoá được người đã viết bình luận.</td></tr>
<tr><td><code>ON DELETE SET NULL</code></td><td>Dòng con ở lại, khoá ngoại thành NULL.</td><td>Liên kết tuỳ chọn: bài vẫn còn khi tác giả rời đi.</td></tr>
</tbody>
</table>
<p>Nhiều app không bao giờ thật sự xoá người dùng: họ đánh dấu <code>deleted_at = now()</code> ("xoá mềm") rồi ẩn đi, để khoá ngoại và lịch sử còn nguyên.</p>

<h3>Bước 6 — vấn đề N+1 truy vấn (đo thật)</h3>
<p>Một bảng tin hiện 1 000 bài kèm tác giả. Đoạn mã hấp dẫn tải các bài, rồi hỏi từng tác giả trong một vòng lặp:</p>
${ma('javascript', CODE['_t8/n-plus-1.mjs'], [14, 23])}
${ra(OUT['_t8/out/n-plus-1'])}
<p>1 truy vấn cho danh sách + 1 cho mỗi bài = <strong>1 001 truy vấn</strong>, so với 1 của JOIN — và JOIN nhanh hơn khoảng bốn lần dù CSDL nằm ngay trong bộ nhớ của cùng tiến trình. CSDL thật nằm bên kia một mạng: giả sử nửa mili giây mỗi lần đi về, 1 000 truy vấn thừa thêm khoảng nửa giây vào mỗi lượt xem trang. ORM khiến lỗi này dễ viết nhầm (<code>for (const p of posts) await prisma.user.findUnique(…)</code>); Bài 8.5 chỉ cách sửa trong Prisma.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (40 phút) — sáu câu hỏi cần phép nối</strong></p>
<ol>
<li>Mọi bình luận kèm tiêu đề bài của nó.</li>
<li>Mọi người dùng kèm số bình luận họ viết, kể cả người không có.</li>
<li>Các bài không có bình luận nào (gợi ý: LEFT JOIN và IS NULL).</li>
<li>Tiêu đề bài xem nhiều nhất của mỗi tác giả (gợi ý: nối posts với chính nó, hoặc dùng truy vấn con).</li>
<li>Tạo <code>tags</code> và <code>post_tags</code> ở Bước 4 và liệt kê các bài gắn thẻ <code>beginner</code>.</li>
<li>Chép <code>n-plus-1.mjs</code>, đổi phần tra tác giả thành tra bình luận của mỗi bài, đo, rồi viết lại bằng một JOIN.</li>
</ol>
<p>Gợi ý cho (3): <code>SELECT p.title FROM posts p LEFT JOIN comments c ON c.post_id = p.id WHERE c.id IS NULL</code>.</p>
<p><strong>Xong khi:</strong> (2) hiện An 2, Lan 1 và Minh 2 bình luận; (3) trả Draft Post, Old Announcement và Orphan Draft; (5) trả Hello World, Learning SQL và Node.js Basics; và bản viết lại ở (6) báo 1 truy vấn. Sau đó làm module Code Lab 8.4.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">primary / foreign key</span><span class="v">khoá chính / khoá ngoại.</span></div>
  <div class="kv"><span class="k">one-to-many</span><span class="v">một-nhiều — khoá ngoại nằm ở phía "nhiều".</span></div>
  <div class="kv"><span class="k">many-to-many</span><span class="v">nhiều-nhiều — cần bảng nối.</span></div>
  <div class="kv"><span class="k">join table</span><span class="v">bảng nối — post_tags.</span></div>
  <div class="kv"><span class="k">INNER JOIN</span><span class="v">chỉ giữ cặp khớp.</span></div>
  <div class="kv"><span class="k">LEFT JOIN</span><span class="v">giữ mọi dòng bên trái, thiếu thì NULL.</span></div>
  <div class="kv"><span class="k">composite key</span><span class="v">khoá ghép — nhiều cột cùng làm khoá.</span></div>
  <div class="kv"><span class="k">ON DELETE CASCADE</span><span class="v">xoá cha thì xoá theo con.</span></div>
  <div class="kv"><span class="k">soft delete</span><span class="v">xoá mềm — đánh dấu thay vì xoá.</span></div>
  <div class="kv"><span class="k">N+1 queries</span><span class="v">một truy vấn danh sách + một truy vấn mỗi dòng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Khoá ngoại lưu khoá chính của dòng khác; nó nằm ở phía "nhiều".</li>
  <li>INNER JOIN chỉ giữ cặp khớp; LEFT JOIN giữ mọi dòng bên trái kèm NULL.</li>
  <li>Đếm bằng LEFT JOIN và <code>count(phải.id)</code> để giữ số không; điều kiện cho bảng phải đặt trong ON.</li>
  <li>Nhiều-nhiều cần bảng nối có khoá chính là cặp.</li>
  <li>Chọn CASCADE, từ chối, hay SET NULL cho từng khoá ngoại.</li>
  <li>Mỗi dòng một truy vấn (N+1) là chậm; lấy dữ liệu liên quan bằng một JOIN.</li>
</ul>
${nguon('📗', 'SQLite — Foreign Key Support', 'Các hành động ON DELETE và PRAGMA foreign_keys', 'https://sqlite.org/foreignkeys.html')}
${nguon('📘', 'PostgreSQL tutorial — Joins Between Tables', 'INNER, LEFT và self join trên máy chủ CSDL', 'https://www.postgresql.org/docs/current/tutorial-join.html')}
${lienKet({ khoa: 'postgresql', bai: 'postgresql-5-2-outer-join', title: 'PostgreSQL 5.2 — Outer join', sub: 'LEFT, RIGHT và FULL join cùng các bẫy của chúng, sâu hơn', cta: 'Mở bài' })}
</div>
`,
};
