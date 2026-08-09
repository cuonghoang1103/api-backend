/**
 * PostgreSQL — Chương 3: Bảng, ràng buộc & thiết kế lược đồ.
 * PRIMARY KEY (đơn/tổ hợp) · FOREIGN KEY + ON DELETE CASCADE/RESTRICT/SET NULL ·
 * NOT NULL/DEFAULT/UNIQUE/CHECK/generated columns · ALTER TABLE · chuẩn hoá nhẹ.
 * Output chạy thật PG 15.4 (schema ch3 trong DB pgcourse).
 * LUẬT: < > trong code → &lt; &gt; (so sánh >= <=); & → &amp;;
 * backtick → &#96;; ${ → \${.
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 3 — Tables, constraints & schema design|||Chương 3 — Bảng, ràng buộc & thiết kế lược đồ',
  description: 'Khoá chính và khoá ngoại, ràng buộc toàn vẹn tham chiếu (ON DELETE CASCADE/RESTRICT/SET NULL), NOT NULL/DEFAULT/UNIQUE/CHECK, cột sinh, ALTER TABLE và vì sao chuẩn hoá giữ dữ liệu đúng.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — Primary keys: the identity of a row|||3.1 — Khoá chính: danh tính của một dòng',
      slug: 'postgresql-3-1-khoa-chinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Khoá chính là gì, khoá thay thế (surrogate) vs khoá tự nhiên, và khoá chính tổ hợp cho bảng nối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Every row needs a name — the primary key</h2>
<p class="lead">A table without a primary key is a bag of rows you can't reliably point at. The primary key is the column (or columns) that uniquely names each row — the thing a foreign key, an <code>UPDATE</code>, or your app uses to say "this exact row and no other". Get it right and the rest of schema design falls into place.</p>

<h3>What a PRIMARY KEY actually guarantees</h3>
<p>Declaring <code>PRIMARY KEY</code> bundles two promises the database enforces on every insert and update: the value is <strong>UNIQUE</strong> (no two rows share it) and <strong>NOT NULL</strong> (every row has one). It also silently builds an index on that column, so lookups by key are fast. Watch both promises being enforced:</p>
<pre><code>CREATE TABLE tag (
  slug  text PRIMARY KEY,
  label text NOT NULL
);
INSERT INTO tag VALUES ('sql','SQL'), ('db','Database');

INSERT INTO tag VALUES ('sql','Structured Query Language');  <span class="tok-comment">-- duplicate key</span>
INSERT INTO tag (label) VALUES ('No slug');                   <span class="tok-comment">-- missing key</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "tag_pkey"
DETAIL:  Key (slug)=(sql) already exists.
ERROR:  null value in column "slug" of relation "tag" violates not-null constraint
DETAIL:  Failing row contains (null, No slug).</div>
<p>Both bad rows are rejected before they can exist. That rejection is the point: the key is a rule the data can never break, not a convention you hope everyone follows.</p>

<h3>Surrogate vs natural keys</h3>
<p>There are two philosophies for choosing the key column:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Surrogate key</span><span class="v">A meaningless auto-generated id — <code>bigint GENERATED ALWAYS AS IDENTITY</code>. It has no business meaning, never changes, and is small and fast. The default choice for almost every table.</span></div>
  <div class="kv"><span class="k">Natural key</span><span class="v">An existing real-world identifier that is already unique — a country's <code>ISO code</code>, a user's <code>email</code>, the <code>slug</code> above. Fewer columns, but risky if that "unique" value ever changes or turns out not to be unique.</span></div>
</div>
<p>The practical rule: <strong>use a surrogate <code>bigint</code> identity key by default</strong>. Real-world identifiers have a habit of changing (people change email, countries get renamed) — and changing a primary key means updating every foreign key that points at it. A surrogate id never changes, so it's the stable anchor. Use a natural key only for genuinely immutable, genuinely unique small tables (a lookup of currency codes, say).</p>

<h3>Composite primary keys — one key from several columns</h3>
<p>Sometimes the identity of a row is a <em>combination</em>. The classic case is a join table linking two things — say, which tags are on which notes. Neither column alone is unique (a note has many tags, a tag is on many notes), but the <em>pair</em> is:</p>
<pre><code>CREATE TABLE note_tag (
  note_id  bigint,
  tag_slug text,
  PRIMARY KEY (note_id, tag_slug)   <span class="tok-comment">-- the pair must be unique</span>
);
INSERT INTO note_tag VALUES (1,'sql'), (1,'db'), (2,'sql');
INSERT INTO note_tag VALUES (1,'sql');   <span class="tok-comment">-- this exact pair already exists</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "note_tag_pkey"
DETAIL:  Key (note_id, tag_slug)=(1, sql) already exists.</div>
<p>The pair <code>(1, 'sql')</code> can appear only once, which is exactly right — a note can't be tagged "sql" twice. Note 1 can still have both <code>sql</code> and <code>db</code>, and tag <code>sql</code> can be on both notes 1 and 2. The composite key models "a note has many tags and a tag is on many notes" (a many-to-many) with zero duplicate rows.</p>
<div class="callout ok">Rule of thumb: <strong>surrogate <code>bigint</code> identity PK for entity tables</strong> (users, notes, products), <strong>composite PK for pure join tables</strong> (note_tag, enrollment). You'll rarely go wrong with those two defaults.</div>
<div class="note-ct">Every entity table on this site uses a <code>bigint</code> identity primary key — users, notes, courses, messages. The many-to-many links (a note shared with several recipients, a lesson belonging to a section) use exactly the join-table-with-composite-key shape above. When you see <code>@@id([a, b])</code> or <code>@@unique([a, b])</code> in the Prisma schema, that's this lesson.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: build a join table and watch the composite key reject duplicates</span><span class="lc-sub">The Code Lab track lets you feel the difference between one key and a pair.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Mỗi dòng cần một cái tên — khoá chính</h2>
<p class="lead">Một bảng không có khoá chính là một túi các dòng mà bạn không thể chỉ vào một cách chắc chắn. Khoá chính là cột (hoặc các cột) đặt tên duy nhất cho từng dòng — thứ mà một khoá ngoại, một <code>UPDATE</code>, hay app của bạn dùng để nói "đúng dòng này chứ không phải dòng nào khác". Làm đúng nó thì phần còn lại của thiết kế lược đồ tự vào chỗ.</p>

<h3>PRIMARY KEY thật sự bảo đảm điều gì</h3>
<p>Khai báo <code>PRIMARY KEY</code> gói lại hai lời hứa mà cơ sở dữ liệu cưỡng chế trên mọi lần chèn và cập nhật: giá trị là <strong>UNIQUE</strong> (không hai dòng nào trùng nó) và <strong>NOT NULL</strong> (mọi dòng đều có). Nó cũng âm thầm dựng một chỉ mục trên cột đó, nên tra cứu theo khoá rất nhanh. Xem cả hai lời hứa được cưỡng chế:</p>
<pre><code>CREATE TABLE tag (
  slug  text PRIMARY KEY,
  label text NOT NULL
);
INSERT INTO tag VALUES ('sql','SQL'), ('db','Database');

INSERT INTO tag VALUES ('sql','Structured Query Language');  <span class="tok-comment">-- khoá trùng</span>
INSERT INTO tag (label) VALUES ('No slug');                   <span class="tok-comment">-- thiếu khoá</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "tag_pkey"
DETAIL:  Key (slug)=(sql) already exists.
ERROR:  null value in column "slug" of relation "tag" violates not-null constraint
DETAIL:  Failing row contains (null, No slug).</div>
<p>Cả hai dòng xấu bị từ chối trước khi kịp tồn tại. Sự từ chối đó chính là điểm mấu chốt: khoá là một luật mà dữ liệu không bao giờ phá được, không phải một quy ước mà bạn mong mọi người tuân theo.</p>

<h3>Khoá thay thế (surrogate) vs khoá tự nhiên</h3>
<p>Có hai trường phái chọn cột khoá:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Khoá thay thế (surrogate)</span><span class="v">Một id tự sinh vô nghĩa — <code>bigint GENERATED ALWAYS AS IDENTITY</code>. Nó không mang ý nghĩa nghiệp vụ, không bao giờ đổi, nhỏ và nhanh. Lựa chọn mặc định cho gần như mọi bảng.</span></div>
  <div class="kv"><span class="k">Khoá tự nhiên</span><span class="v">Một định danh đời thực đã sẵn duy nhất — <code>mã ISO</code> của một quốc gia, <code>email</code> của user, cái <code>slug</code> ở trên. Ít cột hơn, nhưng rủi ro nếu giá trị "duy nhất" đó có ngày thay đổi hoặc hoá ra không duy nhất.</span></div>
</div>
<p>Luật thực dụng: <strong>mặc định dùng khoá thay thế <code>bigint</code> identity</strong>. Định danh đời thực hay có thói quen thay đổi (người ta đổi email, quốc gia bị đổi tên) — và đổi một khoá chính nghĩa là phải cập nhật mọi khoá ngoại trỏ vào nó. Một id thay thế không bao giờ đổi, nên nó là cái neo ổn định. Chỉ dùng khoá tự nhiên cho các bảng nhỏ thật sự bất biến, thật sự duy nhất (ví dụ một bảng tra mã tiền tệ).</p>

<h3>Khoá chính tổ hợp — một khoá từ nhiều cột</h3>
<p>Đôi khi danh tính của một dòng là một <em>tổ hợp</em>. Trường hợp kinh điển là một bảng nối liên kết hai thứ — ví dụ tag nào nằm trên note nào. Không cột nào một mình là duy nhất (một note có nhiều tag, một tag nằm trên nhiều note), nhưng <em>cặp</em> thì duy nhất:</p>
<pre><code>CREATE TABLE note_tag (
  note_id  bigint,
  tag_slug text,
  PRIMARY KEY (note_id, tag_slug)   <span class="tok-comment">-- cặp phải duy nhất</span>
);
INSERT INTO note_tag VALUES (1,'sql'), (1,'db'), (2,'sql');
INSERT INTO note_tag VALUES (1,'sql');   <span class="tok-comment">-- đúng cặp này đã tồn tại</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "note_tag_pkey"
DETAIL:  Key (note_id, tag_slug)=(1, sql) already exists.</div>
<p>Cặp <code>(1, 'sql')</code> chỉ xuất hiện được một lần, đúng y ý — một note không thể bị gắn tag "sql" hai lần. Note 1 vẫn có thể có cả <code>sql</code> lẫn <code>db</code>, và tag <code>sql</code> vẫn có thể nằm trên cả note 1 và 2. Khoá tổ hợp mô hình hoá "một note có nhiều tag và một tag nằm trên nhiều note" (một quan hệ nhiều-nhiều) với không dòng trùng nào.</p>
<div class="callout ok">Quy tắc bỏ túi: <strong>PK thay thế <code>bigint</code> identity cho bảng thực thể</strong> (users, notes, products), <strong>PK tổ hợp cho bảng nối thuần</strong> (note_tag, enrollment). Bạn hiếm khi sai với hai mặc định đó.</div>
<div class="note-ct">Mọi bảng thực thể trên trang này dùng khoá chính <code>bigint</code> identity — users, notes, courses, messages. Các liên kết nhiều-nhiều (một note chia sẻ cho vài người nhận, một bài học thuộc một chương) dùng đúng dạng bảng-nối-khoá-tổ-hợp ở trên. Khi bạn thấy <code>@@id([a, b])</code> hay <code>@@unique([a, b])</code> trong lược đồ Prisma, đó chính là bài này.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một bảng nối và xem khoá tổ hợp từ chối dòng trùng</span><span class="lc-sub">Track Code Lab cho bạn cảm nhận khác biệt giữa một khoá và một cặp.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Foreign keys & referential integrity|||3.2 — Khoá ngoại & toàn vẹn tham chiếu',
      slug: 'postgresql-3-2-khoa-ngoai',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Khoá ngoại chặn dòng mồ côi, và ba hành vi ON DELETE: RESTRICT (mặc định), CASCADE, SET NULL — với output thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Foreign keys — the database keeps your data honest</h2>
<p class="lead">A foreign key says "this column must point at a real row in another table". It's what stops a note from belonging to a user who doesn't exist, and what decides what happens to the notes when that user <em>is</em> deleted. This is the constraint that turns a pile of tables into a coherent, self-consistent schema.</p>

<h3>The orphan it prevents</h3>
<p>Set up a parent <code>u_r</code> (users) and a child <code>n_r</code> (notes) whose <code>user_id</code> references it. The <code>REFERENCES</code> clause is the foreign key:</p>
<pre><code>CREATE TABLE u_r (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO u_r VALUES (1,'Cuong'),(2,'Lan');

CREATE TABLE n_r (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_r(id),   <span class="tok-comment">-- must be a real u_r.id</span>
  title   text
);
INSERT INTO n_r VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');
INSERT INTO n_r VALUES (4,999,'orphan');   <span class="tok-comment">-- user 999 doesn't exist</span></code></pre>
<div class="out">ERROR:  insert or update on table "n_r" violates foreign key constraint "n_r_user_id_fkey"
DETAIL:  Key (user_id)=(999) is not present in table "u_r".</div>
<p>There is no user 999, so the note can't be created. Without this constraint you'd eventually accumulate "orphan" rows pointing at nothing — and every query that joins them would silently drop rows or crash. The foreign key makes that class of bug impossible.</p>

<h3>The real decision: what happens on DELETE?</h3>
<p>The interesting question is what Postgres does when you delete a parent row that still has children. You choose the behaviour with <code>ON DELETE</code>. There are three you'll actually use.</p>

<h4>1. RESTRICT / NO ACTION — the safe default</h4>
<p>If you write no <code>ON DELETE</code> clause (as in <code>n_r</code> above), the default is to <strong>refuse</strong> the delete while children still reference the parent:</p>
<pre><code>DELETE FROM u_r WHERE id=1;   <span class="tok-comment">-- user 1 still has notes 1 and 2</span></code></pre>
<div class="out">ERROR:  update or delete on table "u_r" violates foreign key constraint "n_r_user_id_fkey" on table "n_r"
DETAIL:  Key (id)=(1) is still referenced from table "n_r".</div>
<p>This protects you: you can't accidentally delete a user and leave their notes dangling. To delete the user you must first deal with the notes. Safe, explicit, and the right default for most relationships.</p>

<h4>2. CASCADE — delete the children too</h4>
<p>Sometimes children have no meaning without the parent — comments on a post, items in a shopping cart. <code>ON DELETE CASCADE</code> says "when the parent goes, take the children with it":</p>
<pre><code>CREATE TABLE n_c (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_c(id) ON DELETE CASCADE,
  title   text
);
INSERT INTO n_c VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');
DELETE FROM u_c WHERE id=1;    <span class="tok-comment">-- deletes user 1 AND notes 1, 2</span>
SELECT * FROM n_c ORDER BY id;</code></pre>
<div class="out"> id | user_id | title
----+---------+-------
  3 |       2 | c
(1 row)</div>
<p>Deleting user 1 automatically removed their notes 1 and 2; only note 3 (user 2's) survives. Powerful, but handle with care — <code>CASCADE</code> can delete far more than you expect if the chain is deep. Use it only when the child genuinely cannot outlive the parent.</p>

<h4>3. SET NULL — keep the children, forget the link</h4>
<p>Sometimes the child should survive but lose its reference — a note whose author left, an order whose (optional) coupon was removed. <code>ON DELETE SET NULL</code> nulls the foreign key column instead (so it must be nullable):</p>
<pre><code>CREATE TABLE n_s (
  id        int PRIMARY KEY,
  author_id int REFERENCES u_s(id) ON DELETE SET NULL,   <span class="tok-comment">-- nullable</span>
  title     text
);
INSERT INTO n_s VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');
DELETE FROM u_s WHERE id=1;
SELECT * FROM n_s ORDER BY id;</code></pre>
<div class="out"> id | author_id | title
----+-----------+-------
  1 |           | a
  2 |           | b
  3 |         2 | c
(3 rows)</div>
<p>Notes 1 and 2 are still here — their <code>author_id</code> is now <code>NULL</code> (an empty cell), meaning "author unknown / deleted". Note 3 keeps its author. Nothing was destroyed; only the broken link was cleared.</p>
<div class="callout ok">Choosing: <strong>RESTRICT</strong> (the default) when the parent shouldn't vanish while it has children — the safest choice. <strong>CASCADE</strong> when children are meaningless alone (comments, cart items). <strong>SET NULL</strong> when children outlive the link (posts by a deleted author). When unsure, keep the default — it fails loudly instead of quietly destroying data.</div>
<div class="note-ct">This site uses all three. A message belongs to a thread with <code>CASCADE</code> — delete the thread and its messages go too. A note's optional shares use <code>SET NULL</code>-style handling so a note survives a recipient leaving. And most core links stay on the RESTRICT default, so you can't nuke a user and silently strand half the app's data.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: watch CASCADE, RESTRICT and SET NULL behave differently on the same delete</span><span class="lc-sub">The Code Lab track runs all three side by side.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Khoá ngoại — cơ sở dữ liệu giữ dữ liệu của bạn trung thực</h2>
<p class="lead">Một khoá ngoại nói "cột này phải trỏ tới một dòng có thật ở bảng khác". Nó chặn một note thuộc về một user không tồn tại, và quyết định điều gì xảy ra với các note khi user đó <em>bị</em> xoá. Đây là ràng buộc biến một đống bảng rời thành một lược đồ mạch lạc, tự nhất quán.</p>

<h3>Dòng mồ côi mà nó ngăn</h3>
<p>Dựng một bảng cha <code>u_r</code> (users) và một bảng con <code>n_r</code> (notes) có <code>user_id</code> tham chiếu nó. Mệnh đề <code>REFERENCES</code> chính là khoá ngoại:</p>
<pre><code>CREATE TABLE u_r (id int PRIMARY KEY, name text NOT NULL);
INSERT INTO u_r VALUES (1,'Cuong'),(2,'Lan');

CREATE TABLE n_r (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_r(id),   <span class="tok-comment">-- phải là một u_r.id có thật</span>
  title   text
);
INSERT INTO n_r VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');
INSERT INTO n_r VALUES (4,999,'orphan');   <span class="tok-comment">-- user 999 không tồn tại</span></code></pre>
<div class="out">ERROR:  insert or update on table "n_r" violates foreign key constraint "n_r_user_id_fkey"
DETAIL:  Key (user_id)=(999) is not present in table "u_r".</div>
<p>Không có user 999, nên note không thể được tạo. Không có ràng buộc này, rốt cuộc bạn sẽ tích luỹ các dòng "mồ côi" trỏ vào hư không — và mọi truy vấn join chúng sẽ âm thầm rớt dòng hoặc lỗi. Khoá ngoại khiến loại bug đó thành bất khả.</p>

<h3>Quyết định thật: điều gì xảy ra khi DELETE?</h3>
<p>Câu hỏi thú vị là Postgres làm gì khi bạn xoá một dòng cha mà nó vẫn còn con. Bạn chọn hành vi bằng <code>ON DELETE</code>. Có ba cái bạn thật sự dùng.</p>

<h4>1. RESTRICT / NO ACTION — mặc định an toàn</h4>
<p>Nếu bạn không viết mệnh đề <code>ON DELETE</code> nào (như <code>n_r</code> ở trên), mặc định là <strong>từ chối</strong> việc xoá khi con vẫn còn tham chiếu cha:</p>
<pre><code>DELETE FROM u_r WHERE id=1;   <span class="tok-comment">-- user 1 vẫn còn note 1 và 2</span></code></pre>
<div class="out">ERROR:  update or delete on table "u_r" violates foreign key constraint "n_r_user_id_fkey" on table "n_r"
DETAIL:  Key (id)=(1) is still referenced from table "n_r".</div>
<p>Điều này bảo vệ bạn: bạn không thể vô tình xoá một user và để các note của họ lơ lửng. Muốn xoá user thì trước hết phải xử lý các note. An toàn, tường minh, và là mặc định đúng cho đa số quan hệ.</p>

<h4>2. CASCADE — xoá cả con luôn</h4>
<p>Đôi khi con chẳng có ý nghĩa gì khi thiếu cha — bình luận trên một bài đăng, món trong một giỏ hàng. <code>ON DELETE CASCADE</code> nói "khi cha đi, kéo con theo cùng":</p>
<pre><code>CREATE TABLE n_c (
  id      int PRIMARY KEY,
  user_id int NOT NULL REFERENCES u_c(id) ON DELETE CASCADE,
  title   text
);
INSERT INTO n_c VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');
DELETE FROM u_c WHERE id=1;    <span class="tok-comment">-- xoá user 1 VÀ note 1, 2</span>
SELECT * FROM n_c ORDER BY id;</code></pre>
<div class="out"> id | user_id | title
----+---------+-------
  3 |       2 | c
(1 row)</div>
<p>Xoá user 1 tự động gỡ các note 1 và 2 của họ; chỉ note 3 (của user 2) sống sót. Mạnh, nhưng phải cẩn thận — <code>CASCADE</code> có thể xoá nhiều hơn bạn tưởng rất nhiều nếu chuỗi sâu. Chỉ dùng khi con thật sự không thể sống lâu hơn cha.</p>

<h4>3. SET NULL — giữ con, quên liên kết</h4>
<p>Đôi khi con nên sống sót nhưng mất tham chiếu — một note mà tác giả đã rời đi, một đơn hàng mà mã giảm giá (tuỳ chọn) bị gỡ. <code>ON DELETE SET NULL</code> đặt cột khoá ngoại thành null thay vì xoá (nên cột phải cho phép null):</p>
<pre><code>CREATE TABLE n_s (
  id        int PRIMARY KEY,
  author_id int REFERENCES u_s(id) ON DELETE SET NULL,   <span class="tok-comment">-- cho phép null</span>
  title     text
);
INSERT INTO n_s VALUES (1,1,'a'),(2,1,'b'),(3,2,'c');
DELETE FROM u_s WHERE id=1;
SELECT * FROM n_s ORDER BY id;</code></pre>
<div class="out"> id | author_id | title
----+-----------+-------
  1 |           | a
  2 |           | b
  3 |         2 | c
(3 rows)</div>
<p>Note 1 và 2 vẫn còn đây — <code>author_id</code> của chúng giờ là <code>NULL</code> (ô trống), nghĩa là "tác giả không rõ / đã xoá". Note 3 giữ tác giả. Không gì bị phá huỷ; chỉ liên kết đã gãy được dọn đi.</p>
<div class="callout ok">Cách chọn: <strong>RESTRICT</strong> (mặc định) khi cha không nên biến mất trong lúc còn con — lựa chọn an toàn nhất. <strong>CASCADE</strong> khi con vô nghĩa nếu đứng một mình (bình luận, món trong giỏ). <strong>SET NULL</strong> khi con sống lâu hơn liên kết (bài đăng của một tác giả đã xoá). Khi phân vân, giữ mặc định — nó báo lỗi to tiếng thay vì âm thầm phá dữ liệu.</div>
<div class="note-ct">Trang này dùng cả ba. Một tin nhắn thuộc về một cuộc trò chuyện với <code>CASCADE</code> — xoá cuộc trò chuyện thì tin nhắn đi theo. Các lượt chia sẻ (tuỳ chọn) của một note dùng cách xử lý kiểu <code>SET NULL</code> để note sống sót khi một người nhận rời đi. Và đa số liên kết cốt lõi ở nguyên mặc định RESTRICT, nên bạn không thể xoá phăng một user và âm thầm bỏ rơi nửa số dữ liệu của app.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: xem CASCADE, RESTRICT và SET NULL hành xử khác nhau trên cùng một lệnh xoá</span><span class="lc-sub">Track Code Lab chạy cả ba cạnh nhau.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Column constraints: NOT NULL, DEFAULT, UNIQUE, CHECK & generated columns|||3.3 — Ràng buộc cột: NOT NULL, DEFAULT, UNIQUE, CHECK & cột sinh',
      slug: 'postgresql-3-3-rang-buoc-cot',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn ràng buộc cột giữ dữ liệu đúng, cột sinh (generated) tính giá trị tự động, và unique tổ hợp có tên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Constraints — the rules that make bad data impossible</h2>
<p class="lead">Keys and foreign keys handle identity and relationships. The remaining constraints handle everything else about what a valid row looks like: which columns are required, what defaults fill in, what must be unique, and what values are simply not allowed. Each one is a bug you'll never have to write app code to catch.</p>

<h3>NOT NULL and DEFAULT — required, and pre-filled</h3>
<p><code>NOT NULL</code> means the column must have a value; <code>DEFAULT</code> supplies one when the insert doesn't. Together they make "every product has a price, and a new one starts at 0% discount" a database fact, not an app hope. Here's a table that uses every constraint at once — read it, then we'll break it deliberately:</p>
<pre><code>CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text NOT NULL UNIQUE,
  name         text NOT NULL,
  price        numeric(12,2) NOT NULL CHECK (price &gt;= 0),
  discount_pct int NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  final_price  numeric(12,2) GENERATED ALWAYS AS (round(price * (100 - discount_pct) / 100, 2)) STORED,
  created_at   timestamptz NOT NULL DEFAULT now()
);
INSERT INTO product (sku, name, price, discount_pct) VALUES ('A1','Keyboard',100,10);
INSERT INTO product (sku, name, price)               VALUES ('A2','Mouse',49.99);
SELECT sku, name, price, discount_pct, final_price FROM product ORDER BY id;</code></pre>
<div class="out"> sku |   name   | price  | discount_pct | final_price
-----+----------+--------+--------------+-------------
 A1  | Keyboard | 100.00 |           10 |       90.00
 A2  | Mouse    |  49.99 |            0 |       49.99
(2 rows)</div>
<p>Row A2 never mentioned <code>discount_pct</code> — the <code>DEFAULT 0</code> filled it. And <code>final_price</code> was never inserted at all; it's a <strong>generated column</strong>, computed from the others. More on that below.</p>

<h3>UNIQUE and CHECK — the rules enforced on every write</h3>
<p>Now watch each constraint reject a bad row. <code>UNIQUE</code> stops a duplicate <code>sku</code>; <code>CHECK</code> stops values outside an allowed range; <code>NOT NULL</code> stops a missing required field:</p>
<pre><code>INSERT INTO product (sku, name, price) VALUES ('A1','Dup SKU',10);          <span class="tok-comment">-- UNIQUE</span>
INSERT INTO product (sku, name, price) VALUES ('A3','Bad price',-5);         <span class="tok-comment">-- CHECK price</span>
INSERT INTO product (sku, name, price, discount_pct) VALUES ('A4','x',10,150); <span class="tok-comment">-- CHECK range</span>
INSERT INTO product (sku, name) VALUES ('A5','No price');                    <span class="tok-comment">-- NOT NULL</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "product_sku_key"
DETAIL:  Key (sku)=(A1) already exists.
ERROR:  new row for relation "product" violates check constraint "product_price_check"
ERROR:  new row for relation "product" violates check constraint "product_discount_pct_check"
ERROR:  null value in column "price" of relation "product" violates not-null constraint</div>
<p>Four different bad rows, four rejections — and not one line of application code was needed. This is the deep idea of a relational database: the rules live <em>with the data</em>, so every path that writes (your API, a migration, a manual <code>psql</code> session, a future service you haven't written yet) is held to the same standard.</p>

<h3>Generated columns — computed, never out of sync</h3>
<p><code>final_price</code> above is <code>GENERATED ALWAYS AS (...) STORED</code>. The database computes it from <code>price</code> and <code>discount_pct</code> and keeps it current automatically — you can't write to it, and it can never drift from its inputs:</p>
<pre><code>INSERT INTO product (sku, name, price, final_price) VALUES ('A6','x',10,5);</code></pre>
<div class="out">ERROR:  cannot insert a non-DEFAULT value into column "final_price"
DETAIL:  Column "final_price" is a generated column.</div>
<p>That rejection is the feature. If <code>final_price</code> were an ordinary column you set by hand, someone would eventually update <code>price</code> and forget to recompute it — and now your data lies. A generated column makes that impossible: change <code>price</code> or <code>discount_pct</code> and <code>final_price</code> updates itself.</p>

<h3>Composite UNIQUE — and why the name matters</h3>
<p>Like a primary key, <code>UNIQUE</code> can span several columns: the <em>combination</em> must be unique even if each column repeats. Give it an explicit name so you can refer to it later:</p>
<pre><code>CREATE TABLE enrollment (
  student_id  int NOT NULL,
  course_id   int NOT NULL,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)
);
INSERT INTO enrollment (student_id, course_id) VALUES (1,10),(1,20),(2,10);
INSERT INTO enrollment (student_id, course_id) VALUES (1,10);   <span class="tok-comment">-- same pair again</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "uq_enrollment"
DETAIL:  Key (student_id, course_id)=(1, 10) already exists.</div>
<p>Student 1 can enrol in courses 10 and 20, and course 10 can hold students 1 and 2 — but student 1 can't enrol in course 10 twice. One student, one course, one enrolment.</p>
<div class="pitfall"><p><strong>Named-constraint trap (from this project's history):</strong> when you name a composite unique constraint yourself, the ORM's upsert must use <em>that name</em>, not the default one Postgres would have generated. In Prisma, <code>@@unique([studentId, courseId], name: "uq_enrollment")</code> means you write <code>where: { uq_enrollment: { studentId, courseId } }</code> — not the auto-generated <code>studentId_courseId</code> key. Using the wrong one is a real bug that has bitten this codebase before.</p></div>
<div class="note-ct">This site leans on constraints everywhere: prices and balances are <code>numeric NOT NULL CHECK (... &gt;= 0)</code>; a "note shared with a recipient" is a composite <code>UNIQUE</code> (you can't share the same note with the same person twice) using a named constraint <code>uk_note_subject_share</code>; and slugs are <code>UNIQUE</code> so two courses can't collide on a URL. Every one of those is a bug the app never has to guard against — the database refuses it.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: break each constraint and read the error it throws</span><span class="lc-sub">The Code Lab track turns every rejection above into a hands-on exercise.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Ràng buộc — các luật khiến dữ liệu xấu thành bất khả</h2>
<p class="lead">Khoá và khoá ngoại lo danh tính và quan hệ. Các ràng buộc còn lại lo mọi thứ khác về hình hài một dòng hợp lệ: cột nào bắt buộc, mặc định điền gì, cái gì phải duy nhất, và giá trị nào đơn giản là không được phép. Mỗi cái là một bug mà bạn sẽ không bao giờ phải viết mã app để bắt.</p>

<h3>NOT NULL và DEFAULT — bắt buộc, và điền sẵn</h3>
<p><code>NOT NULL</code> nghĩa là cột phải có giá trị; <code>DEFAULT</code> cấp một giá trị khi lệnh chèn không đưa. Cùng nhau, chúng biến "mọi sản phẩm đều có giá, và một sản phẩm mới bắt đầu với giảm giá 0%" thành một sự thật của cơ sở dữ liệu, không phải một hy vọng của app. Đây là một bảng dùng mọi ràng buộc cùng lúc — đọc nó, rồi ta sẽ cố tình phá:</p>
<pre><code>CREATE TABLE product (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text NOT NULL UNIQUE,
  name         text NOT NULL,
  price        numeric(12,2) NOT NULL CHECK (price &gt;= 0),
  discount_pct int NOT NULL DEFAULT 0 CHECK (discount_pct BETWEEN 0 AND 100),
  final_price  numeric(12,2) GENERATED ALWAYS AS (round(price * (100 - discount_pct) / 100, 2)) STORED,
  created_at   timestamptz NOT NULL DEFAULT now()
);
INSERT INTO product (sku, name, price, discount_pct) VALUES ('A1','Keyboard',100,10);
INSERT INTO product (sku, name, price)               VALUES ('A2','Mouse',49.99);
SELECT sku, name, price, discount_pct, final_price FROM product ORDER BY id;</code></pre>
<div class="out"> sku |   name   | price  | discount_pct | final_price
-----+----------+--------+--------------+-------------
 A1  | Keyboard | 100.00 |           10 |       90.00
 A2  | Mouse    |  49.99 |            0 |       49.99
(2 rows)</div>
<p>Dòng A2 không hề nhắc tới <code>discount_pct</code> — <code>DEFAULT 0</code> đã điền. Và <code>final_price</code> chưa hề được chèn; nó là một <strong>cột sinh (generated)</strong>, tính từ các cột khác. Sẽ nói thêm bên dưới.</p>

<h3>UNIQUE và CHECK — luật được cưỡng chế trên mọi lần ghi</h3>
<p>Giờ xem từng ràng buộc từ chối một dòng xấu. <code>UNIQUE</code> chặn một <code>sku</code> trùng; <code>CHECK</code> chặn giá trị ngoài khoảng cho phép; <code>NOT NULL</code> chặn một trường bắt buộc bị thiếu:</p>
<pre><code>INSERT INTO product (sku, name, price) VALUES ('A1','Dup SKU',10);          <span class="tok-comment">-- UNIQUE</span>
INSERT INTO product (sku, name, price) VALUES ('A3','Bad price',-5);         <span class="tok-comment">-- CHECK giá</span>
INSERT INTO product (sku, name, price, discount_pct) VALUES ('A4','x',10,150); <span class="tok-comment">-- CHECK khoảng</span>
INSERT INTO product (sku, name) VALUES ('A5','No price');                    <span class="tok-comment">-- NOT NULL</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "product_sku_key"
DETAIL:  Key (sku)=(A1) already exists.
ERROR:  new row for relation "product" violates check constraint "product_price_check"
ERROR:  new row for relation "product" violates check constraint "product_discount_pct_check"
ERROR:  null value in column "price" of relation "product" violates not-null constraint</div>
<p>Bốn dòng xấu khác nhau, bốn lần từ chối — mà không cần một dòng mã ứng dụng nào. Đây là ý tưởng sâu của một cơ sở dữ liệu quan hệ: luật sống <em>cùng dữ liệu</em>, nên mọi đường ghi (API của bạn, một migration, một phiên <code>psql</code> thủ công, một service tương lai bạn chưa viết) đều bị giữ theo cùng một chuẩn.</p>

<h3>Cột sinh — tính tự động, không bao giờ lệch</h3>
<p><code>final_price</code> ở trên là <code>GENERATED ALWAYS AS (...) STORED</code>. Cơ sở dữ liệu tính nó từ <code>price</code> và <code>discount_pct</code> và tự giữ nó luôn đúng — bạn không thể ghi vào nó, và nó không bao giờ lệch khỏi đầu vào:</p>
<pre><code>INSERT INTO product (sku, name, price, final_price) VALUES ('A6','x',10,5);</code></pre>
<div class="out">ERROR:  cannot insert a non-DEFAULT value into column "final_price"
DETAIL:  Column "final_price" is a generated column.</div>
<p>Sự từ chối đó chính là tính năng. Nếu <code>final_price</code> là một cột thường bạn tự đặt bằng tay, rốt cuộc sẽ có người cập nhật <code>price</code> mà quên tính lại nó — và giờ dữ liệu của bạn nói dối. Cột sinh khiến điều đó thành bất khả: đổi <code>price</code> hay <code>discount_pct</code> thì <code>final_price</code> tự cập nhật.</p>

<h3>UNIQUE tổ hợp — và vì sao cái tên quan trọng</h3>
<p>Như khoá chính, <code>UNIQUE</code> có thể trải nhiều cột: <em>tổ hợp</em> phải duy nhất kể cả khi từng cột lặp lại. Hãy đặt cho nó một cái tên tường minh để bạn có thể tham chiếu sau này:</p>
<pre><code>CREATE TABLE enrollment (
  student_id  int NOT NULL,
  course_id   int NOT NULL,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment UNIQUE (student_id, course_id)
);
INSERT INTO enrollment (student_id, course_id) VALUES (1,10),(1,20),(2,10);
INSERT INTO enrollment (student_id, course_id) VALUES (1,10);   <span class="tok-comment">-- lại đúng cặp đó</span></code></pre>
<div class="out">ERROR:  duplicate key value violates unique constraint "uq_enrollment"
DETAIL:  Key (student_id, course_id)=(1, 10) already exists.</div>
<p>Sinh viên 1 có thể ghi danh khoá 10 và 20, và khoá 10 có thể chứa sinh viên 1 và 2 — nhưng sinh viên 1 không thể ghi danh khoá 10 hai lần. Một sinh viên, một khoá, một lượt ghi danh.</p>
<div class="pitfall"><p><strong>Bẫy ràng buộc có tên (từ lịch sử chính dự án này):</strong> khi bạn tự đặt tên một ràng buộc unique tổ hợp, lệnh upsert của ORM phải dùng <em>đúng tên đó</em>, không phải tên mặc định mà Postgres tự sinh. Trong Prisma, <code>@@unique([studentId, courseId], name: "uq_enrollment")</code> nghĩa là bạn viết <code>where: { uq_enrollment: { studentId, courseId } }</code> — không phải khoá tự sinh <code>studentId_courseId</code>. Dùng nhầm cái là một bug thật đã từng cắn codebase này.</p></div>
<div class="note-ct">Trang này dựa vào ràng buộc ở khắp nơi: giá và số dư là <code>numeric NOT NULL CHECK (... &gt;= 0)</code>; một "note chia sẻ cho một người nhận" là một <code>UNIQUE</code> tổ hợp (bạn không thể chia sẻ cùng một note cho cùng một người hai lần) dùng ràng buộc có tên <code>uk_note_subject_share</code>; và các slug là <code>UNIQUE</code> nên hai khoá học không đụng nhau trên một URL. Mỗi cái trong số đó là một bug mà app không bao giờ phải canh chừng — cơ sở dữ liệu từ chối nó.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: phá từng ràng buộc và đọc lỗi nó ném ra</span><span class="lc-sub">Track Code Lab biến mọi lần từ chối ở trên thành bài tập thực hành.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Evolving a schema: ALTER TABLE & normalization|||3.4 — Tiến hoá lược đồ: ALTER TABLE & chuẩn hoá',
      slug: 'postgresql-3-4-alter-chuan-hoa',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Thay đổi bảng đang chạy an toàn với ALTER TABLE, và vì sao chuẩn hoá (mỗi sự thật một chỗ) diệt tận gốc bug dữ liệu lệch.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Schemas change — do it safely, and design so you change less</h2>
<p class="lead">No schema is right forever. New columns appear, rules tighten, tables split. This lesson covers the two halves of that reality: <code>ALTER TABLE</code> for changing a live table without losing data, and normalization — the design principle that stops the same fact living in two places, which is where "the data doesn't add up" bugs come from.</p>

<h3>ALTER TABLE — changing a table that already has rows</h3>
<p>You rarely design a table once and never touch it. <code>ALTER TABLE</code> adds columns, tightens rules, and adds constraints — but on a table with existing rows, some changes need care. Adding a nullable column is free; adding a <code>NOT NULL</code> column needs a <code>DEFAULT</code> to fill the rows already there:</p>
<pre><code>CREATE TABLE contact (id int PRIMARY KEY, name text);
INSERT INTO contact VALUES (1,'Cuong'),(2,'Lan');

ALTER TABLE contact ADD COLUMN email text;                          <span class="tok-comment">-- ok: nullable</span>
ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active'; <span class="tok-comment">-- ok: default fills rows</span>
ALTER TABLE contact ADD COLUMN phone text NOT NULL;                  <span class="tok-comment">-- no default → fails</span></code></pre>
<div class="out">ERROR:  column "phone" of relation "contact" contains null values</div>
<p>The third one fails because the two existing rows would have a <code>NULL</code> phone, which the new <code>NOT NULL</code> rule forbids. The fix in a real migration: add it nullable, backfill values, <em>then</em> tighten to <code>NOT NULL</code>. The other alters succeeded — and you can also tighten an existing column and add constraints after the fact:</p>
<pre><code>ALTER TABLE contact ALTER COLUMN name SET NOT NULL;
ALTER TABLE contact ADD CONSTRAINT contact_status_chk CHECK (status IN ('active','archived'));
SELECT * FROM contact ORDER BY id;</code></pre>
<div class="out"> id | name  | email | status
----+-------+-------+--------
  1 | Cuong |       | active
  2 | Lan   |       | active
(2 rows)</div>
<p>Both rows got <code>status = 'active'</code> from the default, <code>email</code> is empty (NULL), and <code>name</code> is now required going forward. In practice you almost never type these by hand — an ORM like Prisma generates them as <em>migrations</em>. But a migration <strong>is</strong> a stack of <code>ALTER TABLE</code> statements, and knowing that is why migration errors stop being mysterious.</p>

<h3>Normalization — one fact, one place</h3>
<p>Here's the design idea that prevents a whole category of bugs. Suppose you store orders like this, repeating the customer's city on every order line:</p>
<pre><code>CREATE TABLE orders_bad (
  order_id      int PRIMARY KEY,
  customer_name text,
  customer_city text,
  product       text,
  amount        numeric(12,2)
);
INSERT INTO orders_bad VALUES
 (1,'Cuong','Hanoi','Keyboard',100),
 (2,'Cuong','Hanoi','Mouse',50),
 (3,'Lan','Danang','Monitor',300);</code></pre>
<p>Cuong's city ("Hanoi") is now stored twice. When he moves, you must update <em>every</em> row — and the day someone updates only one is the day your data starts lying:</p>
<pre><code>UPDATE orders_bad SET customer_city='Saigon' WHERE order_id=1;   <span class="tok-comment">-- forgot order 2!</span>
SELECT * FROM orders_bad WHERE customer_name='Cuong' ORDER BY order_id;</code></pre>
<div class="out"> order_id | customer_name | customer_city | product  | amount
----------+---------------+---------------+----------+--------
        1 | Cuong         | Saigon        | Keyboard | 100.00
        2 | Cuong         | Hanoi         | Mouse    |  50.00
(2 rows)</div>
<p>The same person now lives in two cities. This is an <strong>update anomaly</strong>, and it's the direct result of storing one fact (Cuong's city) in many places. The fix is <strong>normalization</strong>: give each fact exactly one home. Customer facts go in a <code>customer</code> table; orders just <em>reference</em> the customer by a foreign key:</p>
<pre><code>CREATE TABLE customer (
  id   int PRIMARY KEY,
  name text NOT NULL,
  city text
);
CREATE TABLE orders (
  id          int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customer(id),
  product     text NOT NULL,
  amount      numeric(12,2) NOT NULL CHECK (amount &gt;= 0)
);
INSERT INTO customer VALUES (1,'Cuong','Hanoi'),(2,'Lan','Danang');
INSERT INTO orders VALUES (1,1,'Keyboard',100),(2,1,'Mouse',50),(3,2,'Monitor',300);

UPDATE customer SET city='Saigon' WHERE id=1;    <span class="tok-comment">-- one row, and it's done</span>
SELECT o.id, c.name, c.city, o.product, o.amount
FROM orders o JOIN customer c ON c.id = o.customer_id
ORDER BY o.id;</code></pre>
<div class="out"> id | name  |  city  | product  | amount
----+-------+--------+----------+--------
  1 | Cuong | Saigon | Keyboard | 100.00
  2 | Cuong | Saigon | Mouse    |  50.00
  3 | Lan   | Danang | Monitor  | 300.00
(3 rows)</div>
<p>Now Cuong's city lives in exactly one row. Updating it once fixes <em>both</em> of his orders automatically, and it's impossible for him to be in two cities at once. That's the whole payoff of normalization: <strong>store each fact once, reference it everywhere else.</strong> The join (Chapter 5) reassembles the full picture on demand.</p>
<div class="callout ok">The practical rule: if you find yourself copying the same value into many rows, that value probably belongs in its own table, referenced by a foreign key. Don't over-do it — some duplication is fine for read-heavy reporting — but "a person's city stored on every order" is the classic sign you should split. When in doubt, normalize; de-normalize later only with a measured reason.</div>
<div class="note-ct">This site's schema is normalized exactly this way. A course's title lives once on the course row; its lessons reference it by <code>course_id</code>. A user's name lives once on the user row; every note, message, and comment references the user by id, not by copying the name. That's why renaming yourself updates everywhere at once — there's only ever one copy to change.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: reproduce the update anomaly, then normalize it away</span><span class="lc-sub">The Code Lab track makes the "data doesn't add up" bug and its fix concrete.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Lược đồ thay đổi — làm cho an toàn, và thiết kế sao cho ít phải đổi</h2>
<p class="lead">Không lược đồ nào đúng mãi mãi. Cột mới xuất hiện, luật siết lại, bảng tách ra. Bài này bao hai nửa của thực tế đó: <code>ALTER TABLE</code> để đổi một bảng đang chạy mà không mất dữ liệu, và chuẩn hoá — nguyên tắc thiết kế chặn cùng một sự thật sống ở hai nơi, nơi các bug "dữ liệu không khớp" sinh ra.</p>

<h3>ALTER TABLE — đổi một bảng đã có dòng</h3>
<p>Bạn hiếm khi thiết kế một bảng một lần rồi không đụng tới nữa. <code>ALTER TABLE</code> thêm cột, siết luật, và thêm ràng buộc — nhưng trên một bảng đã có dòng, vài thay đổi cần cẩn thận. Thêm một cột cho phép null thì miễn phí; thêm một cột <code>NOT NULL</code> cần một <code>DEFAULT</code> để điền cho các dòng đã có:</p>
<pre><code>CREATE TABLE contact (id int PRIMARY KEY, name text);
INSERT INTO contact VALUES (1,'Cuong'),(2,'Lan');

ALTER TABLE contact ADD COLUMN email text;                          <span class="tok-comment">-- ổn: cho phép null</span>
ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active'; <span class="tok-comment">-- ổn: default điền dòng</span>
ALTER TABLE contact ADD COLUMN phone text NOT NULL;                  <span class="tok-comment">-- không default → lỗi</span></code></pre>
<div class="out">ERROR:  column "phone" of relation "contact" contains null values</div>
<p>Cái thứ ba lỗi vì hai dòng đang có sẽ có <code>phone</code> là <code>NULL</code>, điều mà luật <code>NOT NULL</code> mới cấm. Cách sửa trong một migration thật: thêm nó cho phép null, đổ dữ liệu vào, <em>rồi mới</em> siết thành <code>NOT NULL</code>. Các lệnh alter khác thành công — và bạn cũng có thể siết một cột đang có và thêm ràng buộc về sau:</p>
<pre><code>ALTER TABLE contact ALTER COLUMN name SET NOT NULL;
ALTER TABLE contact ADD CONSTRAINT contact_status_chk CHECK (status IN ('active','archived'));
SELECT * FROM contact ORDER BY id;</code></pre>
<div class="out"> id | name  | email | status
----+-------+-------+--------
  1 | Cuong |       | active
  2 | Lan   |       | active
(2 rows)</div>
<p>Cả hai dòng nhận <code>status = 'active'</code> từ mặc định, <code>email</code> trống (NULL), và <code>name</code> giờ bắt buộc từ nay về sau. Thực tế bạn gần như không bao giờ gõ những dòng này bằng tay — một ORM như Prisma sinh chúng dưới dạng <em>migration</em>. Nhưng một migration <strong>chính là</strong> một chồng lệnh <code>ALTER TABLE</code>, và biết điều đó là lý do lỗi migration thôi bí ẩn.</p>

<h3>Chuẩn hoá — một sự thật, một chỗ</h3>
<p>Đây là ý tưởng thiết kế ngăn cả một loại bug. Giả sử bạn lưu đơn hàng thế này, lặp lại thành phố của khách trên mọi dòng đơn:</p>
<pre><code>CREATE TABLE orders_bad (
  order_id      int PRIMARY KEY,
  customer_name text,
  customer_city text,
  product       text,
  amount        numeric(12,2)
);
INSERT INTO orders_bad VALUES
 (1,'Cuong','Hanoi','Keyboard',100),
 (2,'Cuong','Hanoi','Mouse',50),
 (3,'Lan','Danang','Monitor',300);</code></pre>
<p>Thành phố của Cuong ("Hanoi") giờ được lưu hai lần. Khi anh ấy chuyển đi, bạn phải cập nhật <em>mọi</em> dòng — và cái ngày ai đó chỉ cập nhật một dòng là cái ngày dữ liệu của bạn bắt đầu nói dối:</p>
<pre><code>UPDATE orders_bad SET customer_city='Saigon' WHERE order_id=1;   <span class="tok-comment">-- quên đơn 2!</span>
SELECT * FROM orders_bad WHERE customer_name='Cuong' ORDER BY order_id;</code></pre>
<div class="out"> order_id | customer_name | customer_city | product  | amount
----------+---------------+---------------+----------+--------
        1 | Cuong         | Saigon        | Keyboard | 100.00
        2 | Cuong         | Hanoi         | Mouse    |  50.00
(2 rows)</div>
<p>Cùng một người giờ sống ở hai thành phố. Đây là một <strong>dị thường cập nhật (update anomaly)</strong>, và nó là hệ quả trực tiếp của việc lưu một sự thật (thành phố của Cuong) ở nhiều nơi. Cách sửa là <strong>chuẩn hoá</strong>: cho mỗi sự thật đúng một mái nhà. Sự thật về khách hàng vào một bảng <code>customer</code>; đơn hàng chỉ <em>tham chiếu</em> khách qua một khoá ngoại:</p>
<pre><code>CREATE TABLE customer (
  id   int PRIMARY KEY,
  name text NOT NULL,
  city text
);
CREATE TABLE orders (
  id          int PRIMARY KEY,
  customer_id int NOT NULL REFERENCES customer(id),
  product     text NOT NULL,
  amount      numeric(12,2) NOT NULL CHECK (amount &gt;= 0)
);
INSERT INTO customer VALUES (1,'Cuong','Hanoi'),(2,'Lan','Danang');
INSERT INTO orders VALUES (1,1,'Keyboard',100),(2,1,'Mouse',50),(3,2,'Monitor',300);

UPDATE customer SET city='Saigon' WHERE id=1;    <span class="tok-comment">-- một dòng, và xong</span>
SELECT o.id, c.name, c.city, o.product, o.amount
FROM orders o JOIN customer c ON c.id = o.customer_id
ORDER BY o.id;</code></pre>
<div class="out"> id | name  |  city  | product  | amount
----+-------+--------+----------+--------
  1 | Cuong | Saigon | Keyboard | 100.00
  2 | Cuong | Saigon | Mouse    |  50.00
  3 | Lan   | Danang | Monitor  | 300.00
(3 rows)</div>
<p>Giờ thành phố của Cuong sống ở đúng một dòng. Cập nhật nó một lần tự sửa <em>cả hai</em> đơn của anh ấy, và không thể nào anh ấy ở hai thành phố cùng lúc. Đó là toàn bộ phần thưởng của chuẩn hoá: <strong>lưu mỗi sự thật một lần, tham chiếu nó ở mọi nơi khác.</strong> Phép join (Chương 5) ráp lại bức tranh đầy đủ khi cần.</p>
<div class="callout ok">Luật thực dụng: nếu bạn thấy mình chép cùng một giá trị vào nhiều dòng, giá trị đó có lẽ thuộc về một bảng riêng của nó, được tham chiếu qua khoá ngoại. Đừng làm quá — một chút lặp lại là ổn cho báo cáo đọc-nhiều — nhưng "thành phố của một người lưu trên mọi đơn hàng" là dấu hiệu kinh điển cho thấy nên tách. Khi phân vân, hãy chuẩn hoá; phi-chuẩn hoá về sau chỉ khi có lý do đo đạc được.</div>
<div class="note-ct">Lược đồ của trang này được chuẩn hoá đúng theo cách này. Tiêu đề một khoá học sống một lần trên dòng khoá học; các bài học tham chiếu nó qua <code>course_id</code>. Tên một user sống một lần trên dòng user; mọi note, tin nhắn, và bình luận tham chiếu user qua id, không phải chép tên. Đó là lý do đổi tên chính bạn thì cập nhật khắp nơi cùng lúc — chỉ có đúng một bản để đổi.</div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tái hiện dị thường cập nhật, rồi chuẩn hoá cho nó biến mất</span><span class="lc-sub">Track Code Lab làm bug "dữ liệu không khớp" và cách sửa nó thành cụ thể.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 3.5 Quiz ─────────────────────────── */
    {
      title: '3.5 — Chapter 3 quiz|||3.5 — Kiểm tra Chương 3',
      slug: 'postgresql-3-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về khoá chính, khoá ngoại & ON DELETE, ràng buộc cột, cột sinh, ALTER TABLE và chuẩn hoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on keys, foreign keys, constraints and schema design. Answer from memory; the questions follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: the three ON DELETE behaviours (3.2) and spotting an update anomaly (3.4). Those decide whether your data stays consistent as it grows.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về khoá, khoá ngoại, ràng buộc và thiết kế lược đồ. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: ba hành vi ON DELETE (3.2) và nhận ra một dị thường cập nhật (3.4). Chúng quyết định dữ liệu của bạn có nhất quán khi lớn lên hay không.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A PRIMARY KEY guarantees a column is?|||PRIMARY KEY bảo đảm một cột thì?',
            options: [
              'Unique only|||Chỉ duy nhất',
              'Both UNIQUE and NOT NULL (and gets an index)|||Vừa UNIQUE vừa NOT NULL (và có chỉ mục)',
              'NOT NULL only|||Chỉ NOT NULL',
              'Automatically a foreign key|||Tự động là một khoá ngoại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the recommended default choice for a table\'s primary key?|||Lựa chọn mặc định được khuyên cho khoá chính của một bảng là gì?',
            options: [
              'A natural key like email, so it has meaning|||Một khoá tự nhiên như email, để nó có ý nghĩa',
              'A surrogate bigint identity key — small, stable, never changes|||Một khoá thay thế bigint identity — nhỏ, ổn định, không bao giờ đổi',
              'A random text string chosen by hand|||Một chuỗi text ngẫu nhiên chọn bằng tay',
              'Whatever column is queried most|||Cột nào hay được truy vấn nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A foreign key with no ON DELETE clause, when you delete a parent that still has children, will?|||Một khoá ngoại không có mệnh đề ON DELETE, khi bạn xoá một cha vẫn còn con, sẽ?',
            options: [
              'Delete the children too|||Xoá luôn cả con',
              'Refuse the delete (RESTRICT / NO ACTION)|||Từ chối việc xoá (RESTRICT / NO ACTION)',
              'Set the children\'s foreign key to NULL|||Đặt khoá ngoại của con thành NULL',
              'Silently orphan the children|||Âm thầm để con mồ côi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You want a note to survive its author being deleted, but lose the author link. Use?|||Bạn muốn một note sống sót khi tác giả bị xoá, nhưng mất liên kết tác giả. Dùng?',
            options: [
              'ON DELETE CASCADE|||ON DELETE CASCADE',
              'ON DELETE SET NULL (column must be nullable)|||ON DELETE SET NULL (cột phải cho phép null)',
              'ON DELETE RESTRICT|||ON DELETE RESTRICT',
              'A primary key|||Một khoá chính',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which constraint stops price from ever being negative?|||Ràng buộc nào chặn price khỏi bao giờ âm?',
            options: [
              'NOT NULL|||NOT NULL',
              'CHECK (price >= 0)|||CHECK (price >= 0)',
              'UNIQUE|||UNIQUE',
              'DEFAULT 0|||DEFAULT 0',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A GENERATED ALWAYS AS (...) STORED column?|||Một cột GENERATED ALWAYS AS (...) STORED thì?',
            options: [
              'Must be set by hand on every insert|||Phải đặt bằng tay trên mọi lần chèn',
              'Is computed by the database and cannot be written to directly|||Được cơ sở dữ liệu tính và không thể ghi trực tiếp',
              'Is only computed when you run a special command|||Chỉ được tính khi bạn chạy một lệnh đặc biệt',
              'Can drift out of sync with its inputs|||Có thể lệch khỏi đầu vào của nó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Adding a NOT NULL column to a table that already has rows requires?|||Thêm một cột NOT NULL vào một bảng đã có dòng đòi hỏi?',
            options: [
              'Nothing special — it always works|||Không gì đặc biệt — luôn chạy được',
              'A DEFAULT (or backfilling values first), else it fails|||Một DEFAULT (hoặc đổ dữ liệu vào trước), nếu không sẽ lỗi',
              'Dropping and recreating the table|||Xoá và tạo lại bảng',
              'Removing the primary key|||Gỡ khoá chính',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Storing a customer\'s city on every order row, so one update can leave rows disagreeing, is called?|||Lưu thành phố của khách trên mọi dòng đơn hàng, khiến một lần cập nhật có thể để các dòng bất đồng, gọi là?',
            options: [
              'A join|||Một phép join',
              'An update anomaly — fixed by normalization|||Một dị thường cập nhật — sửa bằng chuẩn hoá',
              'A foreign key|||Một khoá ngoại',
              'A generated column|||Một cột sinh',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
