/**
 * PostgreSQL — Chương 5: JOIN (mở Giai đoạn 2 — Truy vấn sâu).
 * INNER JOIN (ON/USING/alias) · OUTER JOIN LEFT/RIGHT/FULL + anti-join ·
 * join nhiều bảng + self-join · CROSS JOIN + bẫy (fan-out, ON vs WHERE).
 * Output chạy thật PG 15.4 (schema ch5 trong DB pgcourse).
 * LUẬT: < > trong code → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 5 — JOINs: combining tables|||Chương 5 — JOIN: kết hợp các bảng',
  description: 'Ráp lại dữ liệu đã tách qua nhiều bảng: INNER JOIN, các OUTER JOIN (LEFT/RIGHT/FULL), join nhiều bảng và self-join, CROSS JOIN — cùng những cạm bẫy làm nhân đôi dòng hay biến LEFT thành INNER.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — INNER JOIN: putting rows back together|||5.1 — INNER JOIN: ráp các dòng lại với nhau',
      slug: 'postgresql-5-1-inner-join',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Kết hợp hai bảng theo một điều kiện khớp, alias bảng, và ON vs USING.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>The payoff of normalization: JOIN</h2>
<p class="lead">Chapter 3 taught you to split data so each fact lives once — a note stores a <code>user_id</code>, not the author's name. A <code>JOIN</code> is how you put it back together at query time: match each note to its user and read them as one row. It's the single most important query skill in SQL, and it's simpler than it looks.</p>

<h3>The basic INNER JOIN</h3>
<p>We have a <code>note</code> table (each with a <code>user_id</code>) and an <code>app_user</code> table. To show each note <em>with its author's name</em>, join them on the matching key — <code>note.user_id = app_user.id</code>:</p>
<pre><code>SELECT n.title, u.name AS author, n.tag
FROM note n JOIN app_user u ON u.id = n.user_id
ORDER BY n.id;</code></pre>
<div class="out">    title     | author | tag
--------------+--------+------
 Intro to SQL | Cuong  | sql
 Indexes      | Cuong  | sql
 Timezones    | Lan    | date
 Backup       | Minh   | ops
(4 rows)</div>
<p>Each result row pairs a note with the one user whose <code>id</code> matches its <code>user_id</code>. Two things to notice. First, <strong>table aliases</strong> (<code>note n</code>, <code>app_user u</code>) keep the query short and let you say <code>n.title</code> vs <code>u.name</code> unambiguously. Second, the word <code>JOIN</code> alone means <code>INNER JOIN</code> — the default, and the one you'll use most.</p>
<div class="callout ok"><strong>INNER JOIN keeps only rows that match on both sides.</strong> A note with no matching user, or a user with no notes, simply doesn't appear. That's exactly right when you want "notes together with their authors" and nothing else. (Keeping the unmatched ones is the next lesson.)</div>

<h3>ON is the general form; USING is a shortcut</h3>
<p><code>ON</code> lets you write any match condition, even when the columns have different names (<code>u.id = n.user_id</code>). When both tables happen to name the join column <em>the same</em>, <code>USING (col)</code> is a tidy shorthand — and it merges that column so it appears once. Here a <code>note_stat</code> table shares the column name <code>id</code> with <code>note</code>:</p>
<pre><code>SELECT n.title, s.reads
FROM note n JOIN note_stat s USING (id)
ORDER BY n.id;</code></pre>
<div class="out">    title     | reads
--------------+-------
 Intro to SQL |   500
 Indexes      |   300
 Timezones    |   120
 Backup       |    60
 Orphan draft |     5
(5 rows)</div>
<p><code>USING (id)</code> matched <code>note.id = note_stat.id</code> and joined every note to its stats. Use <code>USING</code> when the column names line up; reach for <code>ON</code> the moment they differ (which, with <code>user_id</code> → <code>id</code> style keys, is most of the time).</p>
<div class="note-ct">Every "post by an author" you see on this site is this join. The feed stores a post with an <code>author_id</code>, and rendering it joins to the users table to get the name and avatar — never copying those into the post row. Change your display name once, and every past post shows the new name, because the name was never duplicated: it's fetched fresh by the join.</div>
<h3>What the server actually does</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read both sides</span><span class="lz-d">Scan <code>note</code> and <code>app_user</code>. Neither is "the main table" — the planner picks which one to walk first, and Chapter 10 shows you how to see its choice.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Match on the condition</span><span class="lz-d">For every candidate pair, test <code>u.id = n.user_id</code>. A match emits one combined row; a miss emits nothing.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Project the columns</span><span class="lz-d">Only then does <code>SELECT</code> pick <code>n.title</code>, <code>u.name</code>. The join produces wide rows; the select list narrows them.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Order last</span><span class="lz-d"><code>ORDER BY</code> runs on the joined result, not on either table. That is why you can sort by a column from either side.</span></div>
</div>
<p>Reading a join in this order explains a surprise you will meet in 5.4: the number of output rows is decided at step 2, before <code>SELECT</code> ever runs — so a query that returns "too many rows" is never fixed by changing the select list.</p>
<div class="pitfall"><p><strong>Trap — joining on a column that is not unique on either side.</strong> <code>JOIN app_user u ON u.name = n.author_name</code> looks reasonable and passes every test, until two users are both called "Cuong". Then every one of that user's notes comes back twice, the count on the page doubles, and nothing errors. A join condition is safe when at least one side is guaranteed unique — a primary key or a <code>UNIQUE</code> constraint. Join on <code>id</code>, never on a display name. If you find yourself joining on text, that is usually the sign that Chapter 3's normalization step was skipped.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: join notes to their authors and stats</span><span class="lc-sub">The Code Lab track sets up the multi-table data used across this chapter.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Phần thưởng của chuẩn hoá: JOIN</h2>
<p class="lead">Chương 3 dạy bạn tách dữ liệu để mỗi sự thật sống một lần — một note lưu một <code>user_id</code>, không lưu tên tác giả. Một <code>JOIN</code> là cách bạn ráp lại nó lúc truy vấn: khớp mỗi note với user của nó và đọc chúng như một dòng. Đây là kỹ năng truy vấn quan trọng nhất trong SQL, và nó đơn giản hơn vẻ ngoài.</p>

<h3>INNER JOIN cơ bản</h3>
<p>Ta có bảng <code>note</code> (mỗi cái có một <code>user_id</code>) và bảng <code>app_user</code>. Để hiện mỗi note <em>kèm tên tác giả</em>, join chúng theo khoá khớp — <code>note.user_id = app_user.id</code>:</p>
<pre><code>SELECT n.title, u.name AS author, n.tag
FROM note n JOIN app_user u ON u.id = n.user_id
ORDER BY n.id;</code></pre>
<div class="out">    title     | author | tag
--------------+--------+------
 Intro to SQL | Cuong  | sql
 Indexes      | Cuong  | sql
 Timezones    | Lan    | date
 Backup       | Minh   | ops
(4 rows)</div>
<p>Mỗi dòng kết quả ghép một note với đúng một user có <code>id</code> khớp với <code>user_id</code> của nó. Hai điều đáng để ý. Thứ nhất, <strong>alias bảng</strong> (<code>note n</code>, <code>app_user u</code>) giữ truy vấn ngắn gọn và cho phép bạn nói <code>n.title</code> vs <code>u.name</code> không mập mờ. Thứ hai, chỉ mỗi chữ <code>JOIN</code> nghĩa là <code>INNER JOIN</code> — mặc định, và là cái bạn dùng nhiều nhất.</p>
<div class="callout ok"><strong>INNER JOIN chỉ giữ các dòng khớp ở cả hai phía.</strong> Một note không có user khớp, hay một user không có note nào, đơn giản là không xuất hiện. Điều đó đúng y khi bạn muốn "note cùng tác giả của chúng" và không gì khác. (Giữ lại những cái không khớp là bài sau.)</div>

<h3>ON là dạng tổng quát; USING là lối tắt</h3>
<p><code>ON</code> cho bạn viết bất kỳ điều kiện khớp nào, kể cả khi các cột khác tên (<code>u.id = n.user_id</code>). Khi cả hai bảng tình cờ đặt cột join <em>cùng tên</em>, <code>USING (col)</code> là lối tắt gọn — và nó gộp cột đó để nó chỉ xuất hiện một lần. Ở đây bảng <code>note_stat</code> chia sẻ tên cột <code>id</code> với <code>note</code>:</p>
<pre><code>SELECT n.title, s.reads
FROM note n JOIN note_stat s USING (id)
ORDER BY n.id;</code></pre>
<div class="out">    title     | reads
--------------+-------
 Intro to SQL |   500
 Indexes      |   300
 Timezones    |   120
 Backup       |    60
 Orphan draft |     5
(5 rows)</div>
<p><code>USING (id)</code> khớp <code>note.id = note_stat.id</code> và join mỗi note với thống kê của nó. Dùng <code>USING</code> khi tên cột trùng khớp; vươn tới <code>ON</code> ngay khi chúng khác nhau (mà với các khoá kiểu <code>user_id</code> → <code>id</code>, đó là đa số trường hợp).</p>
<div class="note-ct">Mọi "bài đăng của một tác giả" bạn thấy trên trang này chính là phép join này. Bảng tin lưu một bài đăng với một <code>author_id</code>, và khi hiển thị nó join sang bảng users để lấy tên và ảnh đại diện — không bao giờ chép chúng vào dòng bài đăng. Đổi tên hiển thị một lần, và mọi bài đăng cũ hiện tên mới, vì tên chưa bao giờ bị nhân bản: nó được lấy tươi bởi phép join.</div>
<h3>Máy chủ thật sự làm gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc cả hai phía</span><span class="lz-d">Quét <code>note</code> và <code>app_user</code>. Không cái nào là "bảng chính" — planner tự chọn đi bảng nào trước, và Chương 10 chỉ bạn cách nhìn ra lựa chọn đó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Khớp theo điều kiện</span><span class="lz-d">Với mỗi cặp ứng viên, kiểm <code>u.id = n.user_id</code>. Khớp thì phát ra một dòng ghép; trượt thì không phát gì.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chiếu cột</span><span class="lz-d">Tới lúc này <code>SELECT</code> mới lấy <code>n.title</code>, <code>u.name</code>. Join sinh ra dòng RỘNG; select list mới thu hẹp lại.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Sắp xếp sau cùng</span><span class="lz-d"><code>ORDER BY</code> chạy trên kết quả ĐÃ join, không phải trên một bảng nào. Đó là lý do bạn sắp được theo cột của cả hai phía.</span></div>
</div>
<p>Đọc join theo thứ tự này giải thích một bất ngờ bạn sẽ gặp ở 5.4: SỐ DÒNG đầu ra được quyết ở bước 2, TRƯỚC khi <code>SELECT</code> chạy — nên một truy vấn trả "quá nhiều dòng" không bao giờ chữa được bằng cách sửa select list.</p>
<div class="pitfall"><p><strong>Bẫy — join theo một cột không duy nhất ở cả hai phía.</strong> <code>JOIN app_user u ON u.name = n.author_name</code> trông hợp lý và qua mọi bài test, cho tới khi có hai user cùng tên "Cuong". Lúc đó mọi note của user ấy về hai lần, con số đếm trên trang gấp đôi, và không có lỗi nào cả. Một điều kiện join an toàn khi ÍT NHẤT một phía bảo đảm duy nhất — khoá chính hoặc ràng buộc <code>UNIQUE</code>. Hãy join theo <code>id</code>, đừng bao giờ join theo tên hiển thị. Nếu thấy mình đang join theo chữ, thường đó là dấu hiệu bước chuẩn hoá ở Chương 3 đã bị bỏ qua.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: join note với tác giả và thống kê của chúng</span><span class="lc-sub">Track Code Lab dựng bộ dữ liệu nhiều bảng dùng xuyên suốt chương này.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — OUTER JOINs: keeping the unmatched rows|||5.2 — OUTER JOIN: giữ lại các dòng không khớp',
      slug: 'postgresql-5-2-outer-join',
      type: 'LESSON',
      isFreePreview: true,
      description: 'LEFT/RIGHT/FULL JOIN giữ các dòng không có cặp khớp (điền NULL), và mẫu anti-join để tìm dòng mồ côi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>When "no match" still matters</h2>
<p class="lead">An INNER JOIN silently drops rows with no match — but often the unmatched rows are exactly what you care about: users who've written nothing, orders with no payment, notes with no author. OUTER JOINs keep them, filling the missing side with <code>NULL</code>. Learn the three directions and one famous pattern built on them.</p>

<h3>LEFT JOIN — keep every row from the left table</h3>
<p>Our data has a user (Ngoc) with no notes, and a note ("Orphan draft") with no user. A <code>LEFT JOIN</code> from <code>app_user</code> keeps <em>every</em> user, matched or not — Ngoc appears with a <code>NULL</code> title:</p>
<pre><code>SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
ORDER BY u.id, n.id;</code></pre>
<div class="out"> name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   | Timezones
 Minh  | Backup
 Ngoc  |
(5 rows)</div>
<p>Ngoc's row survived with an empty (NULL) title — the INNER JOIN would have dropped her. That empty cell is the signal "this left row had no match on the right". This is how you build "all users, with their note count (even if zero)" style reports.</p>

<h3>The anti-join: find rows with NO match</h3>
<p>Combine a LEFT JOIN with <code>WHERE &lt;right&gt;.id IS NULL</code> and you get a hugely useful pattern: <strong>only the unmatched rows</strong>. "Which users have written no notes?"</p>
<pre><code>SELECT u.name
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.id IS NULL
ORDER BY u.id;</code></pre>
<div class="out"> name
------
 Ngoc
(1 row)</div>
<p>The LEFT JOIN kept everyone; the <code>WHERE n.id IS NULL</code> then filtered down to just the users whose right side stayed empty — the ones with no notes. This "find the orphans" query appears constantly: customers with no orders, posts with no comments, records with no linked payment.</p>

<h3>RIGHT and FULL — the other directions</h3>
<p><code>RIGHT JOIN</code> is the mirror image: keep every row from the <em>right</em> table. From <code>app_user RIGHT JOIN note</code>, the authorless "Orphan draft" is kept with a NULL author:</p>
<pre><code>SELECT u.name AS author, n.title
FROM app_user u RIGHT JOIN note n ON n.user_id = u.id
ORDER BY n.id;</code></pre>
<div class="out"> author |    title
--------+--------------
 Cuong  | Intro to SQL
 Cuong  | Indexes
 Lan    | Timezones
 Minh   | Backup
        | Orphan draft
(5 rows)</div>
<p>And <code>FULL JOIN</code> keeps unmatched rows from <strong>both</strong> sides at once — Ngoc (no notes) <em>and</em> the Orphan draft (no author) both appear:</p>
<pre><code>SELECT u.name AS author, n.title
FROM app_user u FULL JOIN note n ON n.user_id = u.id
ORDER BY u.id NULLS LAST, n.id NULLS LAST;</code></pre>
<div class="out"> author |    title
--------+--------------
 Cuong  | Intro to SQL
 Cuong  | Indexes
 Lan    | Timezones
 Minh   | Backup
 Ngoc   |
        | Orphan draft
(6 rows)</div>
<div class="callout ok">In practice, <strong><code>LEFT JOIN</code> is by far the most used</strong> — you keep your "main" table on the left and optionally attach related data. <code>RIGHT JOIN</code> is rare (just flip the tables and use LEFT). <code>FULL JOIN</code> is occasional, mostly for reconciliation ("show me everything on either side, matched or not").</div>
<div class="note-ct">The site uses LEFT JOINs to render "your profile with your stats even if they're all zero" — a brand-new user with no posts, no followers still shows a complete profile, with zeros where an INNER JOIN would have made the whole row vanish. And the anti-join pattern powers cleanup tasks: finding uploaded files no record points at, or accounts with no activity.</div>
<h3>The four shapes, side by side</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">INNER</span><span class="lz-lnote">Only pairs that matched. Both unmatched sets are dropped. Row count ≤ either table.</span></div>
<div class="lz-layer"><span class="lz-lname">LEFT</span><span class="lz-lnote">Every left row survives. Unmatched left rows get <code>NULL</code> for every right column. Row count ≥ left table.</span></div>
<div class="lz-layer"><span class="lz-lname">RIGHT</span><span class="lz-lnote">The mirror image. Rare in practice — most people flip the table order and write LEFT, which reads better.</span></div>
<div class="lz-layer"><span class="lz-lname">FULL</span><span class="lz-lnote">Everything from both sides, <code>NULL</code>-padded where there is no partner. The only shape that can produce <code>NULL</code> on either side.</span></div>
</div>
<p>The anti-join — "rows on the left with no partner at all" — is not a fifth keyword. It is <code>LEFT JOIN</code> plus <code>WHERE right.id IS NULL</code>, and that <code>IS NULL</code> test is the whole trick: it keeps exactly the rows the padding created.</p>
<div class="pitfall"><p><strong>Trap — putting a condition on the right table in <code>WHERE</code> instead of <code>ON</code>.</strong> <code>LEFT JOIN note n ON n.user_id = u.id WHERE n.tag = 'sql'</code> silently becomes an INNER JOIN. The padding rows have <code>n.tag = NULL</code>, <code>NULL = 'sql'</code> is not true, and <code>WHERE</code> throws them away — so every user without a matching note vanishes, which is precisely the set <code>LEFT</code> existed to keep. The rule is mechanical: a filter on the <em>preserved</em> side belongs in <code>WHERE</code>; a filter on the <em>optional</em> side belongs in <code>ON</code>. Move it to <code>ON n.user_id = u.id AND n.tag = 'sql'</code> and the users come back.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: LEFT JOIN and the find-the-orphans anti-join</span><span class="lc-sub">The Code Lab track reproduces every result above.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Khi "không khớp" vẫn quan trọng</h2>
<p class="lead">Một INNER JOIN âm thầm rớt các dòng không khớp — nhưng thường các dòng không khớp lại đúng là cái bạn quan tâm: user chưa viết gì, đơn hàng chưa thanh toán, note không có tác giả. OUTER JOIN giữ chúng lại, điền phía thiếu bằng <code>NULL</code>. Học ba hướng và một mẫu nổi tiếng dựng trên chúng.</p>

<h3>LEFT JOIN — giữ mọi dòng của bảng bên trái</h3>
<p>Dữ liệu của ta có một user (Ngoc) không có note nào, và một note ("Orphan draft") không có user. Một <code>LEFT JOIN</code> từ <code>app_user</code> giữ <em>mọi</em> user, khớp hay không — Ngoc xuất hiện với title <code>NULL</code>:</p>
<pre><code>SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
ORDER BY u.id, n.id;</code></pre>
<div class="out"> name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   | Timezones
 Minh  | Backup
 Ngoc  |
(5 rows)</div>
<p>Dòng của Ngoc sống sót với title trống (NULL) — INNER JOIN sẽ rớt cô ấy. Ô trống đó là tín hiệu "dòng trái này không có cặp khớp bên phải". Đây là cách bạn dựng các báo cáo kiểu "mọi user, kèm số note của họ (kể cả bằng không)".</p>

<h3>Anti-join: tìm các dòng KHÔNG khớp</h3>
<p>Kết hợp một LEFT JOIN với <code>WHERE &lt;phải&gt;.id IS NULL</code> là bạn có một mẫu cực hữu ích: <strong>chỉ các dòng không khớp</strong>. "User nào chưa viết note nào?"</p>
<pre><code>SELECT u.name
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.id IS NULL
ORDER BY u.id;</code></pre>
<div class="out"> name
------
 Ngoc
(1 row)</div>
<p>LEFT JOIN giữ tất cả; rồi <code>WHERE n.id IS NULL</code> lọc xuống còn đúng các user có phía phải trống — những người không có note. Truy vấn "tìm dòng mồ côi" này xuất hiện liên tục: khách không có đơn, bài đăng không có bình luận, bản ghi không có thanh toán liên kết.</p>

<h3>RIGHT và FULL — các hướng còn lại</h3>
<p><code>RIGHT JOIN</code> là ảnh gương: giữ mọi dòng của bảng bên <em>phải</em>. Từ <code>app_user RIGHT JOIN note</code>, "Orphan draft" không tác giả được giữ với author NULL:</p>
<pre><code>SELECT u.name AS author, n.title
FROM app_user u RIGHT JOIN note n ON n.user_id = u.id
ORDER BY n.id;</code></pre>
<div class="out"> author |    title
--------+--------------
 Cuong  | Intro to SQL
 Cuong  | Indexes
 Lan    | Timezones
 Minh   | Backup
        | Orphan draft
(5 rows)</div>
<p>Và <code>FULL JOIN</code> giữ các dòng không khớp từ <strong>cả hai</strong> phía cùng lúc — Ngoc (không note) <em>và</em> Orphan draft (không tác giả) đều xuất hiện:</p>
<pre><code>SELECT u.name AS author, n.title
FROM app_user u FULL JOIN note n ON n.user_id = u.id
ORDER BY u.id NULLS LAST, n.id NULLS LAST;</code></pre>
<div class="out"> author |    title
--------+--------------
 Cuong  | Intro to SQL
 Cuong  | Indexes
 Lan    | Timezones
 Minh   | Backup
 Ngoc   |
        | Orphan draft
(6 rows)</div>
<div class="callout ok">Thực tế, <strong><code>LEFT JOIN</code> được dùng nhiều nhất</strong> — bạn giữ bảng "chính" ở bên trái và tuỳ chọn đính kèm dữ liệu liên quan. <code>RIGHT JOIN</code> hiếm (chỉ cần lật hai bảng rồi dùng LEFT). <code>FULL JOIN</code> thỉnh thoảng, chủ yếu để đối soát ("cho tôi mọi thứ ở cả hai phía, khớp hay không").</div>
<div class="note-ct">Trang này dùng LEFT JOIN để hiện "hồ sơ của bạn kèm thống kê kể cả khi tất cả bằng không" — một user mới toanh chưa có bài, chưa có người theo dõi vẫn hiện một hồ sơ đầy đủ, với số không ở chỗ mà INNER JOIN sẽ làm biến mất cả dòng. Và mẫu anti-join chạy các tác vụ dọn dẹp: tìm file đã tải lên mà không bản ghi nào trỏ tới, hay tài khoản không hoạt động.</div>
<h3>Bốn hình dạng, đặt cạnh nhau</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">INNER</span><span class="lz-lnote">Chỉ những cặp đã khớp. Cả hai tập không khớp đều bị bỏ. Số dòng ≤ mỗi bảng.</span></div>
<div class="lz-layer"><span class="lz-lname">LEFT</span><span class="lz-lnote">Mọi dòng bên trái đều sống. Dòng trái không khớp nhận <code>NULL</code> cho mọi cột bên phải. Số dòng ≥ bảng trái.</span></div>
<div class="lz-layer"><span class="lz-lname">RIGHT</span><span class="lz-lnote">Ảnh gương của LEFT. Hiếm dùng thật — phần lớn người ta đảo thứ tự bảng rồi viết LEFT, đọc xuôi hơn.</span></div>
<div class="lz-layer"><span class="lz-lname">FULL</span><span class="lz-lnote">Lấy hết cả hai phía, đệm <code>NULL</code> chỗ không có bạn. Hình dạng DUY NHẤT có thể sinh <code>NULL</code> ở cả hai bên.</span></div>
</div>
<p>Anti-join — "những dòng bên trái hoàn toàn không có bạn" — không phải một từ khoá thứ năm. Nó là <code>LEFT JOIN</code> cộng <code>WHERE right.id IS NULL</code>, và chính phép kiểm <code>IS NULL</code> ấy là toàn bộ mẹo: nó giữ đúng những dòng mà phần đệm vừa tạo ra.</p>
<div class="pitfall"><p><strong>Bẫy — đặt điều kiện của bảng phải vào <code>WHERE</code> thay vì <code>ON</code>.</strong> <code>LEFT JOIN note n ON n.user_id = u.id WHERE n.tag = 'sql'</code> âm thầm biến thành INNER JOIN. Các dòng đệm có <code>n.tag = NULL</code>, mà <code>NULL = 'sql'</code> không đúng, nên <code>WHERE</code> vứt chúng đi — thế là mọi user không có note khớp biến mất, đúng cái tập mà <code>LEFT</code> sinh ra để giữ. Luật rất máy móc: bộ lọc trên phía <em>được giữ</em> thì thuộc về <code>WHERE</code>; bộ lọc trên phía <em>tuỳ chọn</em> thì thuộc về <code>ON</code>. Chuyển thành <code>ON n.user_id = u.id AND n.tag = 'sql'</code> là các user quay lại.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: LEFT JOIN và anti-join tìm mồ côi</span><span class="lc-sub">Track Code Lab tái hiện mọi kết quả ở trên.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Joining many tables & the self-join|||5.3 — Join nhiều bảng & self-join',
      slug: 'postgresql-5-3-multi-self-join',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chuỗi nhiều JOIN trong một truy vấn (kể cả hai lần vào cùng một bảng bằng alias), và self-join khi một bảng tham chiếu chính nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>More than two tables — and joining a table to itself</h2>
<p class="lead">Real questions span more than two tables ("show each comment with the note it's on and both people involved"), and sometimes a table relates to <em>itself</em> ("show each employee with their manager"). Both are just more <code>JOIN</code> clauses — the only new idea is using aliases to reference the same table twice.</p>

<h3>Chaining joins across three tables</h3>
<p>You join as many tables as the question needs — each <code>JOIN ... ON</code> attaches one more. Here a comment links to its note, and to <em>two</em> different people: the note's author and the comment's author. Joining <code>app_user</code> twice needs two aliases (<code>au</code>, <code>cu</code>):</p>
<pre><code>SELECT c.body, n.title, au.name AS note_author, cu.name AS commenter
FROM comment c
JOIN note n      ON n.id = c.note_id
JOIN app_user au ON au.id = n.user_id     <span class="tok-comment">-- who wrote the note</span>
JOIN app_user cu ON cu.id = c.user_id     <span class="tok-comment">-- who wrote the comment</span>
ORDER BY c.id;</code></pre>
<div class="out">     body     |    title     | note_author | commenter
--------------+--------------+-------------+-----------
 Great intro! | Intro to SQL | Cuong       | Lan
 Thanks       | Intro to SQL | Cuong       | Minh
 Very clear   | Timezones    | Lan         | Cuong
(3 rows)</div>
<p>One query, three tables (one of them used twice), and the whole picture assembles: what was said, on which note, by whom, on whose note. The aliases <code>au</code> and <code>cu</code> are what make "join the users table for two different reasons" possible — without them Postgres couldn't tell which <code>app_user</code> you meant.</p>

<h3>The self-join: a table that references itself</h3>
<p>An <code>employee</code> table where each row has a <code>manager_id</code> pointing at another employee is a classic <em>hierarchy</em>. To show each employee next to their manager's name, join the table to itself — once as "the employee" (<code>e</code>), once as "the manager" (<code>m</code>):</p>
<pre><code>SELECT e.name AS employee, m.name AS manager
FROM employee e LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;</code></pre>
<div class="out"> employee | manager
----------+---------
 Alice    |
 Bob      | Alice
 Carol    | Alice
 Dave     | Bob
(4 rows)</div>
<p>The same physical table plays two roles at once. Notice it's a <code>LEFT JOIN</code> on purpose: Alice is the top boss with <code>manager_id = NULL</code>, and LEFT keeps her (with an empty manager) — an INNER JOIN would have dropped the one person at the top. Self-joins model any "points at another row of the same kind": reply-to on comments, parent category on categories, referred-by on users.</p>
<div class="note-ct">This exact three-table shape is a comment thread on the site: a comment row joins to its post, to the post's author, and to the commenter — one query renders "Lan commented 'Great intro!' on Cuong's post". And the self-join is how threaded replies work: a comment's <code>parent_id</code> points at another comment in the same table, joined to itself to show "replying to …".</div>
<h3>Reading a three-table join</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">Joins are left-associative</span><span class="lz-d"><code>a JOIN b JOIN c</code> means <code>(a JOIN b) JOIN c</code>. The third join sees the combined result of the first two, which is why <code>c</code> may reference columns from either <code>a</code> or <code>b</code>.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">Written order ≠ executed order</span><span class="lz-d">The planner is free to reorder inner joins entirely. Your job is to state the relationships correctly; its job is to find the cheapest path (Chapter 10.2).</span></div>
<div class="lz-step"><span class="lz-k">C</span><span class="lz-t">A self-join needs two aliases</span><span class="lz-d">The same table twice is legal only when each copy has its own name — <code>employee e JOIN employee m ON m.id = e.manager_id</code>. Without aliases the server cannot tell which <code>id</code> you mean.</span></div>
<div class="lz-step"><span class="lz-k">D</span><span class="lz-t">Self-joins are usually LEFT</span><span class="lz-d">The top of a hierarchy has no parent. <code>INNER</code> silently drops the CEO; <code>LEFT</code> keeps them with a <code>NULL</code> manager, which is almost always what you meant.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — assuming more joined tables means a proportionally slower query.</strong> The instinct is that six joins must be six times the work of one, so people flatten their schema to "avoid joins". Measured, the opposite is usually true: joining six small, indexed tables is routinely faster than scanning one wide denormalized table, because each join reads only the rows the previous step actually needs. What genuinely costs is a join with no usable index on the join key — one such join can dominate a query containing ten good ones. Chapter 9 measures exactly this: an index turned 28.6ms into 0.129ms on a single join. Count missing indexes, not joins.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: the 3-table comment query and the employee self-join</span><span class="lc-sub">The Code Lab track walks through aliasing a table twice.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Hơn hai bảng — và join một bảng với chính nó</h2>
<p class="lead">Câu hỏi thật trải trên hơn hai bảng ("hiện mỗi bình luận kèm note nó nằm trên và cả hai người liên quan"), và đôi khi một bảng liên quan tới <em>chính nó</em> ("hiện mỗi nhân viên kèm quản lý của họ"). Cả hai chỉ là thêm mệnh đề <code>JOIN</code> — ý mới duy nhất là dùng alias để tham chiếu cùng một bảng hai lần.</p>

<h3>Nối chuỗi join qua ba bảng</h3>
<p>Bạn join bao nhiêu bảng tuỳ câu hỏi cần — mỗi <code>JOIN ... ON</code> đính thêm một bảng. Ở đây một bình luận liên kết tới note của nó, và tới <em>hai</em> người khác nhau: tác giả note và tác giả bình luận. Join <code>app_user</code> hai lần cần hai alias (<code>au</code>, <code>cu</code>):</p>
<pre><code>SELECT c.body, n.title, au.name AS note_author, cu.name AS commenter
FROM comment c
JOIN note n      ON n.id = c.note_id
JOIN app_user au ON au.id = n.user_id     <span class="tok-comment">-- ai viết note</span>
JOIN app_user cu ON cu.id = c.user_id     <span class="tok-comment">-- ai viết bình luận</span>
ORDER BY c.id;</code></pre>
<div class="out">     body     |    title     | note_author | commenter
--------------+--------------+-------------+-----------
 Great intro! | Intro to SQL | Cuong       | Lan
 Thanks       | Intro to SQL | Cuong       | Minh
 Very clear   | Timezones    | Lan         | Cuong
(3 rows)</div>
<p>Một truy vấn, ba bảng (một trong đó dùng hai lần), và cả bức tranh ráp lại: cái gì được nói, trên note nào, bởi ai, trên note của ai. Các alias <code>au</code> và <code>cu</code> là thứ khiến "join bảng users vì hai lý do khác nhau" thành khả thi — không có chúng, Postgres không thể biết bạn muốn <code>app_user</code> nào.</p>

<h3>Self-join: một bảng tham chiếu chính nó</h3>
<p>Một bảng <code>employee</code> mà mỗi dòng có một <code>manager_id</code> trỏ tới một nhân viên khác là một <em>cây phân cấp</em> kinh điển. Để hiện mỗi nhân viên cạnh tên quản lý của họ, join bảng với chính nó — một lần là "nhân viên" (<code>e</code>), một lần là "quản lý" (<code>m</code>):</p>
<pre><code>SELECT e.name AS employee, m.name AS manager
FROM employee e LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;</code></pre>
<div class="out"> employee | manager
----------+---------
 Alice    |
 Bob      | Alice
 Carol    | Alice
 Dave     | Bob
(4 rows)</div>
<p>Cùng một bảng vật lý đóng hai vai cùng lúc. Để ý đây là <code>LEFT JOIN</code> có chủ đích: Alice là sếp cao nhất với <code>manager_id = NULL</code>, và LEFT giữ cô ấy (với quản lý trống) — một INNER JOIN sẽ rớt đúng người ở đỉnh. Self-join mô hình hoá mọi thứ "trỏ tới một dòng khác cùng loại": reply-to trên bình luận, danh mục cha trên danh mục, được-giới-thiệu-bởi trên user.</p>
<div class="note-ct">Đúng hình ba-bảng này là một luồng bình luận trên trang: một dòng bình luận join tới bài đăng của nó, tới tác giả bài đăng, và tới người bình luận — một truy vấn hiện "Lan bình luận 'Great intro!' trên bài của Cuong". Và self-join là cách các trả lời lồng nhau hoạt động: một <code>parent_id</code> của bình luận trỏ tới một bình luận khác trong cùng bảng, join với chính nó để hiện "đang trả lời …".</div>
<h3>Đọc một truy vấn join ba bảng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">Join kết hợp từ TRÁI</span><span class="lz-d"><code>a JOIN b JOIN c</code> nghĩa là <code>(a JOIN b) JOIN c</code>. Cú join thứ ba nhìn thấy kết quả ghép của hai cú đầu, nên <code>c</code> tham chiếu được cột của cả <code>a</code> lẫn <code>b</code>.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">Thứ tự VIẾT ≠ thứ tự CHẠY</span><span class="lz-d">Planner được phép sắp xếp lại hoàn toàn các inner join. Việc của bạn là khai đúng quan hệ; việc của nó là tìm đường rẻ nhất (Bài 10.2).</span></div>
<div class="lz-step"><span class="lz-k">C</span><span class="lz-t">Self-join cần HAI alias</span><span class="lz-d">Cùng một bảng hai lần chỉ hợp lệ khi mỗi bản có tên riêng — <code>employee e JOIN employee m ON m.id = e.manager_id</code>. Không alias thì máy chủ không biết bạn nói <code>id</code> nào.</span></div>
<div class="lz-step"><span class="lz-k">D</span><span class="lz-t">Self-join thường phải LEFT</span><span class="lz-d">Đỉnh của một cây thì không có cha. <code>INNER</code> âm thầm vứt mất CEO; <code>LEFT</code> giữ họ lại với manager <code>NULL</code>, gần như luôn là ý bạn muốn.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — tưởng càng nhiều bảng join thì truy vấn càng chậm theo tỉ lệ.</strong> Trực giác nói sáu cú join phải nặng gấp sáu lần một cú, nên người ta làm phẳng lược đồ để "tránh join". Đo thật thì thường NGƯỢC LẠI: join sáu bảng nhỏ có chỉ mục thường nhanh hơn quét MỘT bảng rộng đã phi chuẩn hoá, vì mỗi cú join chỉ đọc đúng những dòng bước trước thật sự cần. Cái ĐẮT thật là một cú join không có chỉ mục dùng được trên khoá join — một cú như thế đủ lấn át cả truy vấn có mười cú join tốt. Chương 9 đo đúng chuyện này: một chỉ mục biến 28,6ms thành 0,129ms trên đúng một cú join. Hãy đếm chỉ mục THIẾU, đừng đếm số join.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: truy vấn bình luận 3 bảng và self-join nhân viên</span><span class="lc-sub">Track Code Lab đi qua việc đặt alias một bảng hai lần.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — CROSS JOIN & the join traps|||5.4 — CROSS JOIN & những cạm bẫy join',
      slug: 'postgresql-5-4-cross-join-traps',
      type: 'LESSON',
      isFreePreview: true,
      description: 'CROSS JOIN sinh mọi tổ hợp, và ba cạm bẫy: cross join vô tình, nhân dòng (fan-out) từ quan hệ một-nhiều, và ON vs WHERE trên outer join.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>The deliberate cross product — and three ways joins bite</h2>
<p class="lead">One last join type, then the traps. <code>CROSS JOIN</code> pairs every row with every row — occasionally what you want, and accidentally what you get when a join condition goes missing. Add the row-multiplication surprise and the outer-join filter trap, and you'll have seen the mistakes that cause most "my numbers are wrong" join bugs.</p>

<h3>CROSS JOIN — every combination</h3>
<p>A <code>CROSS JOIN</code> has no <code>ON</code>: it pairs each row of one table with <em>every</em> row of the other, producing all combinations. Useful for generating a grid — every size in every colour:</p>
<pre><code>SELECT size, color FROM sz CROSS JOIN col ORDER BY size, color;</code></pre>
<div class="out"> size | color
------+-------
 L    | Blue
 L    | Red
 M    | Blue
 M    | Red
 S    | Blue
 S    | Red
(6 rows)</div>
<p>3 sizes × 2 colours = 6 rows. That multiplication is the whole idea — and also the danger. A cross join of two 100,000-row tables is 10 <strong>billion</strong> rows.</p>

<h3>Trap 1: the accidental cross join</h3>
<p>Forget the <code>ON</code> condition (or get it wrong so nothing matches distinctly) and an INNER JOIN quietly degrades toward a cross product — every row paired with far too many. If a join suddenly returns thousands of rows where you expected dozens, a missing or wrong <code>ON</code> is the first suspect.</p>

<h3>Trap 2: fan-out — one-to-many multiplies rows</h3>
<p>This one fools everyone once. Joining a note to its <em>many</em> comments repeats the note once per comment — the "one" side is duplicated across the "many":</p>
<pre><code>SELECT n.title, c.body
FROM note n JOIN comment c ON c.note_id = n.id
ORDER BY n.id, c.id;</code></pre>
<div class="out">    title     |     body
--------------+--------------
 Intro to SQL | Great intro!
 Intro to SQL | Thanks
 Timezones    | Very clear
(3 rows)</div>
<p>"Intro to SQL" appears <strong>twice</strong> — once per comment. That's correct, but it means if you now naively <code>SELECT count(*)</code> or <code>sum(note.reads)</code> over this join, every value on the note side is counted once per comment and your totals inflate. The fix (next chapter) is aggregation with <code>GROUP BY</code>, or counting <code>COUNT(DISTINCT n.id)</code>. Just remember: <strong>joining across a one-to-many relationship multiplies the "one" side.</strong></p>

<h3>Trap 3: a filter in WHERE turns LEFT JOIN into INNER</h3>
<p>The subtlest one. In a LEFT JOIN, putting a condition on the right table in <code>WHERE</code> discards the NULL (unmatched) rows — silently undoing the LEFT. Watch the same filter in two places. In <code>WHERE</code>, it collapses to matched rows only:</p>
<pre><code>SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.tag = 'sql'
ORDER BY u.id, n.id;</code></pre>
<div class="out"> name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
(2 rows)</div>
<p>Ngoc vanished, and so did Lan and Minh — because their <code>n.tag</code> was <code>NULL</code> or not <code>'sql'</code>, and <code>WHERE</code> ran <em>after</em> the join and dropped them. Move the same condition <strong>into the <code>ON</code></strong> and the LEFT is preserved — every user stays, with a title only where a matching sql note exists:</p>
<pre><code>SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql'
ORDER BY u.id, n.id;</code></pre>
<div class="out"> name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   |
 Minh  |
 Ngoc  |
(5 rows)</div>
<div class="callout danger">The rule: on an OUTER JOIN, conditions that <em>define the match</em> go in <code>ON</code>; conditions that <em>filter the final result</em> go in <code>WHERE</code>. Putting a right-table filter in <code>WHERE</code> silently turns your LEFT JOIN back into an INNER JOIN — a very common source of "rows I expected are missing".</div>
<div class="note-ct">Both of the last two traps have real consequences here. A dashboard that counts posts-with-their-comments in one join over-counts unless it aggregates — the fan-out. And a "show all users, plus their latest sql note if any" panel must put the tag filter in the <code>ON</code>, or brand-new users disappear from the list entirely. Chapter 6 is aggregation — exactly the tool that tames fan-out.</div>
<h3>Where the extra rows come from</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Fan-out</span><span class="lz-nsub">one-to-many, joined twice</span></span>
<span class="lz-nbody">Join <code>order</code> to <code>order_item</code> and the order row repeats once per item. Now add <code>SUM(o.total)</code> and the order total is counted once per item — a number that is too large by exactly the item count. The join was correct; the aggregate was applied at the wrong grain.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Accidental CROSS JOIN</span><span class="lz-nsub">a forgotten ON</span></span>
<span class="lz-nbody">Comma-separated tables with no <code>WHERE</code> linking them produce every pair: 1,000 × 1,000 = one million rows from two small tables. It rarely errors — it just hangs, and the row count is the giveaway.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Deliberate CROSS JOIN</span><span class="lz-nsub">and it is genuinely useful</span></span>
<span class="lz-nbody">Generating a calendar (every day × every product), filling gaps in a report, building a test matrix. When you want the full product, say <code>CROSS JOIN</code> explicitly so the next reader knows it was intended.</span>
</div>
</div>
<div class="pitfall"><p><strong>Trap — debugging a wrong total by staring at the <code>SUM</code>.</strong> When a report shows an inflated figure, the arithmetic is almost never wrong; the row count is. The fastest diagnosis is to delete the aggregate entirely and run the bare join with <code>SELECT *</code> — then count the rows and look at the duplicates with your own eyes. If one order appears three times, you have found it, and no amount of rewriting the <code>SUM</code> would have. The fix is to aggregate the many-side first (a subquery or CTE, Chapter 7) and join to that single row, rather than joining first and aggregating after.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Next chapter: aggregation & GROUP BY</span><span class="lc-sub">You can combine tables; next, summarize them — counts, sums, averages per group.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Tích chéo có chủ đích — và ba kiểu join cắn bạn</h2>
<p class="lead">Một kiểu join cuối, rồi tới các cạm bẫy. <code>CROSS JOIN</code> ghép mọi dòng với mọi dòng — thỉnh thoảng là cái bạn muốn, và vô tình là cái bạn nhận khi thiếu điều kiện join. Thêm bất ngờ nhân dòng và cạm bẫy lọc outer-join, bạn sẽ thấy hết các sai lầm gây ra đa số bug join kiểu "số của tôi bị sai".</p>

<h3>CROSS JOIN — mọi tổ hợp</h3>
<p>Một <code>CROSS JOIN</code> không có <code>ON</code>: nó ghép mỗi dòng của một bảng với <em>mọi</em> dòng của bảng kia, sinh ra tất cả tổ hợp. Hữu ích để sinh một lưới — mọi cỡ trong mọi màu:</p>
<pre><code>SELECT size, color FROM sz CROSS JOIN col ORDER BY size, color;</code></pre>
<div class="out"> size | color
------+-------
 L    | Blue
 L    | Red
 M    | Blue
 M    | Red
 S    | Blue
 S    | Red
(6 rows)</div>
<p>3 cỡ × 2 màu = 6 dòng. Phép nhân đó chính là ý tưởng — và cũng là mối nguy. Một cross join của hai bảng 100.000 dòng là 10 <strong>tỉ</strong> dòng.</p>

<h3>Bẫy 1: cross join vô tình</h3>
<p>Quên điều kiện <code>ON</code> (hoặc viết sai để không gì khớp rõ ràng) và một INNER JOIN âm thầm thoái hoá về tích chéo — mỗi dòng ghép với quá nhiều dòng. Nếu một join bỗng trả về hàng ngàn dòng nơi bạn kỳ vọng vài chục, một <code>ON</code> thiếu hoặc sai là nghi phạm đầu tiên.</p>

<h3>Bẫy 2: fan-out — quan hệ một-nhiều nhân dòng</h3>
<p>Cái này lừa mọi người một lần. Join một note với <em>nhiều</em> bình luận của nó lặp lại note một lần cho mỗi bình luận — phía "một" bị nhân bản qua phía "nhiều":</p>
<pre><code>SELECT n.title, c.body
FROM note n JOIN comment c ON c.note_id = n.id
ORDER BY n.id, c.id;</code></pre>
<div class="out">    title     |     body
--------------+--------------
 Intro to SQL | Great intro!
 Intro to SQL | Thanks
 Timezones    | Very clear
(3 rows)</div>
<p>"Intro to SQL" xuất hiện <strong>hai lần</strong> — một lần mỗi bình luận. Điều đó đúng, nhưng nghĩa là nếu giờ bạn ngây thơ <code>SELECT count(*)</code> hay <code>sum(note.reads)</code> trên phép join này, mọi giá trị phía note bị đếm một lần cho mỗi bình luận và các tổng của bạn phồng lên. Cách sửa (chương sau) là tổng hợp với <code>GROUP BY</code>, hoặc đếm <code>COUNT(DISTINCT n.id)</code>. Chỉ cần nhớ: <strong>join qua một quan hệ một-nhiều nhân phía "một" lên.</strong></p>

<h3>Bẫy 3: một bộ lọc trong WHERE biến LEFT JOIN thành INNER</h3>
<p>Cái tinh vi nhất. Trong một LEFT JOIN, đặt một điều kiện lên bảng bên phải trong <code>WHERE</code> vứt bỏ các dòng NULL (không khớp) — âm thầm huỷ tác dụng LEFT. Xem cùng một bộ lọc ở hai chỗ. Trong <code>WHERE</code>, nó co lại chỉ còn các dòng khớp:</p>
<pre><code>SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id
WHERE n.tag = 'sql'
ORDER BY u.id, n.id;</code></pre>
<div class="out"> name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
(2 rows)</div>
<p>Ngoc biến mất, và Lan cùng Minh cũng vậy — vì <code>n.tag</code> của họ là <code>NULL</code> hoặc không phải <code>'sql'</code>, và <code>WHERE</code> chạy <em>sau</em> phép join rồi rớt chúng. Chuyển cùng điều kiện đó <strong>vào <code>ON</code></strong> và LEFT được giữ — mọi user ở lại, với title chỉ ở nơi có một note sql khớp:</p>
<pre><code>SELECT u.name, n.title
FROM app_user u LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql'
ORDER BY u.id, n.id;</code></pre>
<div class="out"> name  |    title
-------+--------------
 Cuong | Intro to SQL
 Cuong | Indexes
 Lan   |
 Minh  |
 Ngoc  |
(5 rows)</div>
<div class="callout danger">Luật: trên một OUTER JOIN, các điều kiện <em>định nghĩa sự khớp</em> đặt vào <code>ON</code>; các điều kiện <em>lọc kết quả cuối</em> đặt vào <code>WHERE</code>. Đặt một bộ lọc bảng-phải vào <code>WHERE</code> âm thầm biến LEFT JOIN của bạn trở lại thành INNER JOIN — một nguồn rất phổ biến của "các dòng tôi kỳ vọng bị thiếu".</div>
<div class="note-ct">Cả hai cạm bẫy cuối đều có hậu quả thật ở đây. Một bảng điều khiển đếm bài-đăng-kèm-bình-luận trong một join sẽ đếm dư trừ khi nó tổng hợp — chính là fan-out. Và một panel "hiện mọi user, cộng note sql mới nhất nếu có" phải đặt bộ lọc tag vào <code>ON</code>, nếu không các user mới toanh biến mất khỏi danh sách hoàn toàn. Chương 6 là tổng hợp — đúng công cụ thuần hoá fan-out.</div>
<h3>Số dòng thừa đến từ đâu</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Fan-out</span><span class="lz-nsub">một-nhiều, join hai lần</span></span>
<span class="lz-nbody">Join <code>order</code> với <code>order_item</code> thì dòng order lặp lại một lần cho mỗi item. Giờ thêm <code>SUM(o.total)</code> và tổng đơn hàng bị đếm một lần cho mỗi item — một con số lớn dư đúng bằng số item. Cú join ĐÚNG; phép tổng hợp áp SAI ĐỘ MỊN.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CROSS JOIN vô tình</span><span class="lz-nsub">quên mất ON</span></span>
<span class="lz-nbody">Các bảng ngăn bằng dấu phẩy mà không có <code>WHERE</code> nối chúng sẽ sinh ra MỌI cặp: 1.000 × 1.000 = một triệu dòng từ hai bảng nhỏ. Nó hiếm khi báo lỗi — nó chỉ treo, và số dòng là dấu hiệu tố cáo.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">CROSS JOIN cố ý</span><span class="lz-nsub">và nó hữu ích thật</span></span>
<span class="lz-nbody">Sinh lịch (mỗi ngày × mỗi sản phẩm), lấp lỗ hổng trong báo cáo, dựng ma trận test. Khi bạn MUỐN tích đầy đủ, hãy viết <code>CROSS JOIN</code> tường minh để người đọc sau biết đó là chủ ý.</span>
</div>
</div>
<div class="pitfall"><p><strong>Bẫy — gỡ một con tổng sai bằng cách nhìn chằm chằm vào <code>SUM</code>.</strong> Khi một báo cáo hiện con số phồng lên, phép tính gần như không bao giờ sai; SỐ DÒNG mới sai. Cách chẩn đoán nhanh nhất là XOÁ HẲN phép tổng hợp rồi chạy cú join trần với <code>SELECT *</code> — sau đó đếm dòng và nhìn tận mắt các bản trùng. Nếu một order hiện ba lần, bạn đã tìm ra, và sửa <code>SUM</code> bao nhiêu lần cũng không ra. Cách chữa là tổng hợp phía NHIỀU trước (subquery hoặc CTE, Chương 7) rồi join vào đúng một dòng, thay vì join trước rồi tổng hợp sau.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Chương tới: tổng hợp & GROUP BY</span><span class="lc-sub">Bạn kết hợp được các bảng; tiếp theo: tóm tắt chúng — đếm, tổng, trung bình theo nhóm.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 5.5 Quiz ─────────────────────────── */
    {
      title: '5.5 — Chapter 5 quiz|||5.5 — Kiểm tra Chương 5',
      slug: 'postgresql-5-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về INNER vs OUTER JOIN, anti-join, self-join, CROSS JOIN, fan-out và ON vs WHERE.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on joins. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: LEFT vs INNER (5.2) and the ON-vs-WHERE trap on outer joins (5.4). Both silently change which rows you get.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về join. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: LEFT vs INNER (5.2) và cạm bẫy ON-vs-WHERE trên outer join (5.4). Cả hai âm thầm đổi bạn nhận được những dòng nào.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'An INNER JOIN (plain JOIN) returns?|||Một INNER JOIN (JOIN trơn) trả về?',
            options: [
              'Every row from both tables|||Mọi dòng từ cả hai bảng',
              'Only rows that have a match on both sides|||Chỉ các dòng có cặp khớp ở cả hai phía',
              'Every combination of rows|||Mọi tổ hợp dòng',
              'Only rows from the left table|||Chỉ các dòng từ bảng bên trái',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want every user listed, even those with no notes. Use?|||Bạn muốn liệt kê mọi user, kể cả những người không có note. Dùng?',
            options: [
              'INNER JOIN|||INNER JOIN',
              'LEFT JOIN (users on the left)|||LEFT JOIN (users bên trái)',
              'CROSS JOIN|||CROSS JOIN',
              'A second SELECT|||Một SELECT thứ hai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'LEFT JOIN note ... WHERE note.id IS NULL finds?|||LEFT JOIN note ... WHERE note.id IS NULL tìm ra?',
            options: [
              'Users who have notes|||User có note',
              'Users with NO notes (the anti-join / orphan pattern)|||User KHÔNG có note (mẫu anti-join / mồ côi)',
              'Notes with no title|||Note không có title',
              'Nothing, it is invalid|||Không gì, nó không hợp lệ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To show each employee next to their manager from one employee table, use?|||Để hiện mỗi nhân viên cạnh quản lý của họ từ một bảng employee, dùng?',
            options: [
              'A CROSS JOIN|||Một CROSS JOIN',
              'A self-join: join the table to itself with two aliases|||Một self-join: join bảng với chính nó bằng hai alias',
              'A FULL JOIN to another table|||Một FULL JOIN sang bảng khác',
              'It cannot be done in SQL|||Không thể làm trong SQL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A CROSS JOIN of a 3-row and a 2-row table returns how many rows?|||Một CROSS JOIN của bảng 3 dòng và bảng 2 dòng trả về bao nhiêu dòng?',
            options: [
              '5|||5',
              '6 (every combination, 3 × 2)|||6 (mọi tổ hợp, 3 × 2)',
              '3|||3',
              '0|||0',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Joining a note to its many comments causes the note to?|||Join một note với nhiều bình luận của nó khiến note?',
            options: [
              'Disappear|||Biến mất',
              'Repeat once per comment (fan-out / row multiplication)|||Lặp lại một lần mỗi bình luận (fan-out / nhân dòng)',
              'Appear exactly once|||Xuất hiện đúng một lần',
              'Merge all comments into one cell|||Gộp mọi bình luận vào một ô',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a LEFT JOIN, putting a filter on the right table in WHERE (not ON) does what?|||Trong một LEFT JOIN, đặt một bộ lọc lên bảng bên phải trong WHERE (không phải ON) làm gì?',
            options: [
              'Nothing, WHERE and ON are the same|||Không gì, WHERE và ON như nhau',
              'Silently turns the LEFT JOIN into an INNER JOIN (drops unmatched rows)|||Âm thầm biến LEFT JOIN thành INNER JOIN (rớt các dòng không khớp)',
              'Raises a syntax error|||Báo lỗi cú pháp',
              'Makes it a CROSS JOIN|||Biến nó thành CROSS JOIN',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'To join two tables when they share the exact column name, the tidy shorthand is?|||Để join hai bảng khi chúng chia sẻ đúng tên cột, lối tắt gọn là?',
            options: [
              'ON only|||Chỉ ON',
              'USING (col)|||USING (col)',
              'CROSS JOIN|||CROSS JOIN',
              'WHERE col = col|||WHERE col = col',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
