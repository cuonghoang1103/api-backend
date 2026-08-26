/**
 * PostgreSQL — Chương 16: Production & capstone (Giai đoạn 4 — Trên production).
 * Prisma ↔ SQL: model → bảng, @relation → khoá ngoại, migrate deploy vs migrate dev ·
 * lược đồ THẬT của cuongthai.com đo tại chỗ 26/08/2026: 8.164 dòng, 277 model, 56 enum,
 * 117 migration, 446 @@index, 441 @relation, model User có 47 @relation/172 trường ·
 * bug P3006 KIỂM CHỨNG tận file: migration 20260706130000 dòng 48-49 đặt TRÙNG TÊN
 * một UNIQUE constraint và một INDEX ⇒ không replay được trên shadow DB ·
 * checklist production · capstone chẩn đoán.
 * LUẬT: < > trong code/out → &lt; &gt;; & → &amp;; backtick → &#96;; ${ → \${.
 * Khối .out LUÔN đóng </div> (KHÔNG </code></pre>).
 */
const REF = '?ref=%2Fcourses%2Fpostgresql%2Flearn&reflabel=PostgreSQL';

export default {
  title: 'Chapter 16 — PostgreSQL in production & capstone|||Chương 16 — PostgreSQL trên production & capstone',
  description: 'Ghép mọi thứ lại. Prisma ánh xạ sang đúng những khái niệm bạn vừa học ra sao, một lược đồ production thật 277 model trông thế nào và đọc nó kiểu gì, một checklist trước khi đưa cơ sở dữ liệu ra đời thật, và một bài capstone chẩn đoán dùng tới cả mười lăm chương trước.',
  lessons: [
    /* ─────────────────────────── 16.1 ─────────────────────────── */
    {
      title: '16.1 — Prisma and migrations, seen from the database|||16.1 — Prisma và migration, nhìn từ phía cơ sở dữ liệu',
      slug: 'postgresql-16-1-prisma-migration',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mỗi khái niệm Prisma tương ứng với cái gì trong SQL bạn đã học, khác biệt sống còn giữa migrate dev và migrate deploy, shadow database là gì — và một bug shadow DB có thật trong chính kho mã này, kiểm chứng tới từng dòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1 · Phase 4 — In production</span>
<h2>The ORM is not a different database</h2>
<p class="lead">Most of the code that talks to this database goes through Prisma, and it is easy to treat the ORM as its own world. It is not. Every Prisma concept is a thin naming layer over something from the previous fifteen chapters, and the moment something goes wrong you will be reading SQL again — so the mapping is worth holding explicitly.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>model User { }</code></span><span class="lz-lnote">A <code>CREATE TABLE</code> (Chapter 3). <code>@@map("users")</code> sets the real table name when it differs from the model name.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@id</code> / <code>@unique</code></span><span class="lz-lnote"><code>PRIMARY KEY</code> and <code>UNIQUE</code> — and each brings a B-tree index with it (Chapter 9), which is why lookups by them are already fast.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@relation</code></span><span class="lz-lnote">A <code>FOREIGN KEY</code> plus the join Prisma will write for you. <code>include</code> becomes a <code>JOIN</code> or a second query; <code>onDelete: Cascade</code> is <code>ON DELETE CASCADE</code>.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@@index([a, b])</code></span><span class="lz-lnote">A composite index — and column order matters exactly as it did in Chapter 9. Prisma will not tell you the order is wrong; <code>EXPLAIN</code> will.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>$transaction</code></span><span class="lz-lnote"><code>BEGIN … COMMIT</code> from Chapter 11, with the same isolation levels and the same need for a retry loop if you raise them.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>prisma migrate</code></span><span class="lz-lnote">Generated SQL files, applied in order and recorded in a <code>_prisma_migrations</code> table. Nothing magic — you can read every one of them.</span></div>
</div>

<h3>migrate dev vs migrate deploy — never confuse these</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>prisma migrate dev</code></span><span class="lz-d">Development only. Compares your schema to the migration history, generates a new migration, applies it — and to do the comparison safely it builds a <strong>shadow database</strong>: a scratch database where it replays every migration from scratch. It may also offer to reset your database, which is why it must never point at production.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>prisma migrate deploy</code></span><span class="lz-d">Production. Applies pending migrations in order and nothing else. No shadow database, no generation, no reset, no prompts. This is what runs on deploy.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>prisma db push</code></span><span class="lz-d">Pushes the schema straight to the database with <strong>no migration file</strong>. Fine for a scratch prototype; on production it destroys the history that <code>migrate deploy</code> depends on.</span></div>
</div>

<h3>A real shadow-database failure, in this repository</h3>
<p>The shadow database replays <em>every</em> migration from the beginning, which means a migration that was accepted once but is not replayable will break <code>migrate dev</code> forever after. That is not hypothetical here. Migration <code>20260706130000_add_music_and_profile</code>, lines 48–49:</p>
<pre><code><span class="tok-keyword">ALTER TABLE</span> <span class="tok-string">"post_music"</span> <span class="tok-keyword">ADD CONSTRAINT</span> <span class="tok-string">"post_music_post_id_key"</span> <span class="tok-keyword">UNIQUE</span> (<span class="tok-string">"post_id"</span>);
<span class="tok-keyword">CREATE INDEX</span> <span class="tok-string">"post_music_post_id_key"</span> <span class="tok-keyword">ON</span> <span class="tok-string">"post_music"</span>(<span class="tok-string">"post_id"</span>);</code></pre>
<p>A <code>UNIQUE</code> constraint creates an index behind it, using the constraint's name. The next line then tries to create a <em>second</em> index with the <strong>same name</strong>. On a fresh shadow database that is a name collision and the replay fails with <code>P3006</code>.</p>
<p>Why did it ever work? Because on the real database the two statements ran at a moment when that sequence happened to be accepted, and the migration is now <em>recorded as applied</em> — so <code>migrate deploy</code> never runs it again and production is unaffected. Only the shadow database, which always starts from zero, hits it.</p>
<div class="callout warn">The fix is <strong>not</strong> to edit that file. It is already applied on production, and rewriting an applied migration means the recorded checksum no longer matches what is in the history — the exact drift that Chapter 15's recovery story depends on not having. The working practice in this repository is to hand-write new migration SQL under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and apply it with <code>prisma migrate deploy</code>, which needs no shadow database. Verify there is no drift afterwards with <code>prisma migrate diff</code> — empty output means the schema and the database agree.</div>

<h3>When a migration fails on deploy</h3>
<p>Prisma marks it failed and refuses to continue, which is correct: a half-applied schema change must not be papered over. The temptation is <code>prisma migrate resolve --applied</code> to make the error go away. Do not — it tells Prisma the migration succeeded, and if it only partly ran, the schema and the history now disagree in a way nothing will detect until a later migration fails for reasons that make no sense.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read the actual error</span><span class="lz-d">Which statement failed, and did the ones before it commit? A migration wrapped in one transaction rolled back cleanly (11.1); one with multiple statements outside a transaction may not have.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Inspect the real schema</span><span class="lz-d"><code>\\d table_name</code> in psql. Does the column exist? The index? Compare against what the migration intended.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Then decide, deliberately</span><span class="lz-d">Only once you know what state the database is actually in. <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> prints the difference as SQL.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — a migration that is instant on your laptop and an outage on production.</strong> <code>ALTER TABLE … ADD COLUMN … NOT NULL DEFAULT 'x'</code> is fast on a thousand rows and, on older PostgreSQL, rewrote the entire table under an <code>ACCESS EXCLUSIVE</code> lock on a million. Modern versions optimise the constant-default case, but the general shape of the risk stands: <code>ALTER TABLE</code> takes a lock that blocks <em>everything</em>, and if it queues behind one long-running query, every request arriving after it queues too — so a migration that takes 200 ms of work can still cause minutes of downtime while it waits. Set a short <code>lock_timeout</code> before DDL so the migration fails fast instead of blocking the site, add indexes with <code>CREATE INDEX CONCURRENTLY</code> (which Prisma will not generate for you — hand-write it), and test the migration against a copy with production-sized data, never against your empty dev database.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: read a generated migration and predict the lock it takes</span><span class="lc-sub">The Code Lab track walks the Prisma ↔ SQL mapping with real files.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1 · Giai đoạn 4 — Trên production</span>
<h2>ORM KHÔNG phải một cơ sở dữ liệu khác</h2>
<p class="lead">Phần lớn mã nói chuyện với cơ sở dữ liệu này đều đi qua Prisma, và rất dễ coi ORM như một thế giới riêng. KHÔNG phải vậy. Mọi khái niệm của Prisma đều là một lớp đặt tên mỏng phủ lên thứ gì đó trong mười lăm chương vừa rồi, và ngay khi có chuyện gì hỏng thì bạn sẽ lại đọc SQL — nên cái bản đồ ánh xạ này đáng để nắm cho rõ.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname"><code>model User { }</code></span><span class="lz-lnote">Một câu <code>CREATE TABLE</code> (Chương 3). <code>@@map("users")</code> đặt tên bảng THẬT khi nó khác tên model.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@id</code> / <code>@unique</code></span><span class="lz-lnote"><code>PRIMARY KEY</code> và <code>UNIQUE</code> — và mỗi cái đều KÉO THEO một chỉ mục B-tree (Chương 9), đó là lý do tra cứu theo chúng vốn đã nhanh.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@relation</code></span><span class="lz-lnote">Một <code>FOREIGN KEY</code> cộng với phép join mà Prisma sẽ viết giùm bạn. <code>include</code> trở thành một <code>JOIN</code> hoặc một truy vấn thứ hai; <code>onDelete: Cascade</code> chính là <code>ON DELETE CASCADE</code>.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>@@index([a, b])</code></span><span class="lz-lnote">Một chỉ mục tổ hợp — và THỨ TỰ CỘT quan trọng y hệt như ở Chương 9. Prisma sẽ KHÔNG nói cho bạn biết thứ tự sai; <code>EXPLAIN</code> thì có.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>$transaction</code></span><span class="lz-lnote"><code>BEGIN … COMMIT</code> từ Chương 11, với cùng các mức cô lập và cùng nhu cầu phải có vòng thử lại nếu bạn nâng mức lên.</span></div>
<div class="lz-layer"><span class="lz-lname"><code>prisma migrate</code></span><span class="lz-lnote">Các file SQL được sinh ra, áp theo thứ tự và ghi lại trong một bảng <code>_prisma_migrations</code>. Không có gì phép thuật — bạn đọc được từng cái một.</span></div>
</div>

<h3>migrate dev và migrate deploy — đừng bao giờ nhầm hai cái này</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>prisma migrate dev</code></span><span class="lz-d">CHỈ dùng khi phát triển. Nó so lược đồ của bạn với lịch sử migration, sinh ra một migration mới, áp nó — và để so sánh một cách an toàn, nó dựng một <strong>SHADOW DATABASE</strong>: một cơ sở dữ liệu nháp nơi nó phát lại MỌI migration từ đầu. Nó cũng có thể đề nghị RESET cơ sở dữ liệu của bạn, và đó là lý do nó KHÔNG BAO GIỜ được trỏ vào production.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>prisma migrate deploy</code></span><span class="lz-d">Production. Áp các migration đang chờ theo thứ tự và không làm gì khác. Không shadow database, không sinh mới, không reset, không hỏi han. Đây là thứ chạy khi deploy.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>prisma db push</code></span><span class="lz-d">Đẩy thẳng lược đồ vào cơ sở dữ liệu mà <strong>KHÔNG tạo file migration</strong>. Ổn với một bản mẫu nháp; trên production nó PHÁ HUỶ chính cái lịch sử mà <code>migrate deploy</code> dựa vào.</span></div>
</div>

<h3>Một sự cố shadow database CÓ THẬT, ngay trong kho mã này</h3>
<p>Shadow database phát lại <em>MỌI</em> migration từ đầu, nghĩa là một migration từng được chấp nhận MỘT LẦN nhưng không phát lại được sẽ làm hỏng <code>migrate dev</code> mãi mãi về sau. Ở đây điều đó không hề giả định. Migration <code>20260706130000_add_music_and_profile</code>, dòng 48–49:</p>
<pre><code><span class="tok-keyword">ALTER TABLE</span> <span class="tok-string">"post_music"</span> <span class="tok-keyword">ADD CONSTRAINT</span> <span class="tok-string">"post_music_post_id_key"</span> <span class="tok-keyword">UNIQUE</span> (<span class="tok-string">"post_id"</span>);
<span class="tok-keyword">CREATE INDEX</span> <span class="tok-string">"post_music_post_id_key"</span> <span class="tok-keyword">ON</span> <span class="tok-string">"post_music"</span>(<span class="tok-string">"post_id"</span>);</code></pre>
<p>Một ràng buộc <code>UNIQUE</code> tự tạo một chỉ mục phía sau nó, LẤY ĐÚNG TÊN của ràng buộc. Dòng kế tiếp sau đó lại cố tạo một chỉ mục <em>THỨ HAI</em> với <strong>CÙNG CÁI TÊN</strong>. Trên một shadow database sạch, đó là một vụ đụng tên và lượt phát lại hỏng với mã <code>P3006</code>.</p>
<p>Vậy vì sao nó từng chạy được? Vì trên cơ sở dữ liệu thật, hai câu lệnh đó chạy vào một thời điểm mà trình tự ấy tình cờ được chấp nhận, và giờ migration đã được <em>GHI NHẬN LÀ ĐÃ ÁP</em> — nên <code>migrate deploy</code> không bao giờ chạy lại nó và production không hề bị ảnh hưởng. Chỉ có shadow database, thứ luôn bắt đầu từ số không, mới đâm vào nó.</p>
<div class="callout warn">Cách sửa <strong>KHÔNG</strong> phải là sửa cái file đó. Nó đã được áp trên production rồi, và viết lại một migration đã áp nghĩa là mã băm đã ghi không còn khớp với thứ nằm trong lịch sử — đúng cái kiểu trôi dạt mà câu chuyện khôi phục ở Chương 15 dựa trên việc KHÔNG có. Cách làm việc trong kho mã này là VIẾT TAY SQL cho migration mới ở <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> rồi áp bằng <code>prisma migrate deploy</code>, thứ không cần shadow database. Sau đó kiểm rằng không có trôi dạt bằng <code>prisma migrate diff</code> — output rỗng nghĩa là lược đồ và cơ sở dữ liệu đang khớp nhau.</div>

<h3>Khi một migration hỏng lúc deploy</h3>
<p>Prisma đánh dấu nó là thất bại và từ chối đi tiếp, và như thế là ĐÚNG: một thay đổi lược đồ áp được một nửa thì không được phép lấp liếm. Cám dỗ ở đây là <code>prisma migrate resolve --applied</code> để làm cái lỗi biến mất. ĐỪNG — nó nói với Prisma rằng migration đã thành công, và nếu nó chỉ chạy được một phần thì lược đồ và lịch sử giờ mâu thuẫn với nhau theo một kiểu mà chẳng có gì phát hiện ra, cho tới khi một migration về sau hỏng vì những lý do vô nghĩa.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc lỗi THẬT</span><span class="lz-d">Câu lệnh nào hỏng, và những câu trước nó đã commit chưa? Một migration bọc trong MỘT giao dịch thì đã lùi lại sạch sẽ (11.1); một cái có nhiều câu lệnh nằm ngoài giao dịch thì có thể không.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Soi lược đồ thật</span><span class="lz-d"><code>\\d ten_bang</code> trong psql. Cột đó có tồn tại không? Chỉ mục thì sao? Đối chiếu với thứ mà migration ĐỊNH làm.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RỒI mới quyết định, một cách có chủ đích</span><span class="lz-d">Chỉ sau khi bạn biết cơ sở dữ liệu ĐANG THẬT SỰ ở trạng thái nào. <code>prisma migrate diff --from-migrations ./prisma/migrations --to-database-url "$DATABASE_URL" --script</code> in ra phần chênh lệch dưới dạng SQL.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một migration tức thì trên laptop của bạn và là một sự cố trên production.</strong> Câu <code>ALTER TABLE … ADD COLUMN … NOT NULL DEFAULT 'x'</code> chạy nhanh với một nghìn dòng và, ở các bản PostgreSQL cũ, VIẾT LẠI CẢ BẢNG dưới khoá <code>ACCESS EXCLUSIVE</code> khi có một triệu dòng. Các bản hiện đại đã tối ưu trường hợp default hằng số, nhưng HÌNH DẠNG chung của rủi ro vẫn nguyên: <code>ALTER TABLE</code> lấy một cái khoá chặn <em>MỌI THỨ</em>, và nếu nó xếp hàng sau một truy vấn chạy dài thì mọi request tới sau nó CŨNG xếp hàng — nên một migration chỉ tốn 200 ms công việc vẫn có thể gây ra nhiều PHÚT chết trang trong lúc nó chờ. Hãy đặt một <code>lock_timeout</code> ngắn trước khi chạy DDL để migration hỏng NHANH thay vì làm nghẽn trang, hãy tạo chỉ mục bằng <code>CREATE INDEX CONCURRENTLY</code> (thứ mà Prisma sẽ không sinh giùm bạn — phải viết tay), và hãy thử migration trên một bản sao có dữ liệu CỠ PRODUCTION, đừng bao giờ thử trên cơ sở dữ liệu dev rỗng của bạn.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: đọc một migration được sinh ra và đoán trước cái khoá nó sẽ lấy</span><span class="lc-sub">Nhánh Code Lab đi qua bản đồ ánh xạ Prisma ↔ SQL bằng file thật.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.2 ─────────────────────────── */
    {
      title: '16.2 — Reading a real production schema|||16.2 — Đọc một lược đồ production thật',
      slug: 'postgresql-16-2-luoc-do-that',
      type: 'LESSON',
      description: 'Lược đồ đang chạy cuongthai.com, đo tại chỗ: 8.164 dòng, 277 model, 56 enum, 117 migration, 446 chỉ mục, 441 quan hệ — và model User một mình có 47 quan hệ với 172 trường. Cách tiếp cận một lược đồ lớn mà không bị nó nuốt chửng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2 · Phase 4 — In production</span>
<h2>What fifteen chapters looks like at scale</h2>
<p class="lead">Every example so far has had three tables and five rows, because that is how you learn a concept. Real schemas are not like that, and the jump is disorienting the first time. This lesson measures the actual schema behind this site so the scale stops being abstract.</p>

<h3>The numbers, counted today</h3>
<div class="out">dòng schema.prisma : 8164
số model           : 277
số enum            : 56
số migration       : 117
số @@index         : 446
số @@unique        : 86
số @relation       : 441</div>
<p>277 tables storing every user, post, message, note, course and lesson on the site — including the one you are reading. 117 migrations is 117 deliberate changes, each one recorded, ordered and replayable.</p>
<div class="callout ok">Chapter 0 of this course quotes <strong>248 tables, 95 migrations, 6,980 lines</strong>. Those numbers were true when that chapter was written; the counts above were taken today. <strong>29 new tables and 22 new migrations in the interval</strong> — which is the most useful thing on this page. A schema is not a thing you design once. It is a thing that grows for as long as the product does, which is exactly why migrations, and not <code>db push</code>, are the mechanism.</div>

<h3>The gravitational centre</h3>
<p>Count the relations per model and one stands out enormously:</p>
<div class="out">  User                       47 @relation · 172 trường
  Note                        8 @relation ·  35 trường
  SocialComment               6 @relation ·  22 trường
  NoteDatabaseRow             6 @relation ·  15 trường
  MessageThread               5 @relation ·  18 trường</div>
<p><code>User</code> has <strong>47 relations</strong> — nearly six times the next model — and 172 fields. That is not a mistake, and it is not unusual. In almost any application with accounts, the user table is where everything eventually points: posts, comments, messages, notes, courses, sessions, uploads, settings. It is the schema's centre of gravity, and it tells you something practical: <strong>almost every interesting query in this system joins to <code>User</code></strong>, so its primary key is the hottest index in the database, and any migration that locks it (16.1) blocks nearly everything.</p>

<h3>How to approach a schema you did not write</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Do not read it top to bottom</span><span class="lz-d">8,164 lines in file order teaches you nothing. Start from a feature you can see in the product and find its table.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Follow the foreign keys outward</span><span class="lz-d">From one table, read only its relations. Two hops covers a feature; you almost never need more. This is the same skill as reading a query plan inside-out (Chapter 10).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Let the indexes tell you the access patterns</span><span class="lz-d">446 <code>@@index</code> declarations are 446 statements about how this data is <em>read</em>. An index on <code>[userId, createdAt]</code> says "list a user's things, newest first" — the query is visible in the index even before you find the code.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Read migrations for the history</span><span class="lz-d">The schema shows the present; the 117 migrations show how it got here and, in their names, why. When a column looks strange, the migration that added it usually explains it.</span></div>
</div>

<h3>Useful queries against a live database</h3>
<pre><code><span class="tok-comment">-- bảng lớn nhất theo dung lượng</span>
<span class="tok-keyword">SELECT</span> relname, pg_size_pretty(pg_total_relation_size(relid)) <span class="tok-keyword">AS</span> tong
<span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">ORDER BY</span> pg_total_relation_size(relid) <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 10;

<span class="tok-comment">-- bảng nào bị đọc nhiều nhất, và bằng chỉ mục hay quét tuần tự</span>
<span class="tok-keyword">SELECT</span> relname, seq_scan, idx_scan, n_live_tup
<span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">ORDER BY</span> seq_scan <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 10;</code></pre>
<p>The second one is the highest-value query in this lesson. A table with a large <code>n_live_tup</code>, a high <code>seq_scan</code> and a low <code>idx_scan</code> is being read by scanning it end to end — a missing index (Chapter 9), findable without reading a single line of application code.</p>
<div class="callout warn"><code>pg_total_relation_size</code> includes indexes and TOAST; <code>pg_relation_size</code> is the table alone. With 446 indexes in this schema the difference is not small, and "the table is huge" sometimes turns out to mean "the indexes on it are huge" — a different problem with a different fix.</div>
<div class="pitfall"><p><strong>Trap — reading a schema and assuming the data matches it.</strong> The schema describes what the code <em>can</em> create from now on. The data was created by every version of the code that ever ran, plus migrations, plus manual fixes, plus imports — and it remembers all of them. A column marked <code>NOT NULL</code> today may sit above rows that predate the constraint being enforced the way you assume; two tables that "cannot" hold the same slug may hold it, because a merge copied rows into a new table without removing the old ones. This is not theoretical: on this very site, a reasoning-from-the-code conclusion that two URL spaces could not collide was <strong>wrong</strong>, and one <code>curl</code> against production would have shown both returning 200. <strong>Code tells you what is possible; only the data tells you what is true.</strong> When the question is about state, query the state.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: find the missing index in a schema you have never seen</span><span class="lc-sub">The Code Lab track uses the seq_scan query on a realistic schema.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2 · Giai đoạn 4 — Trên production</span>
<h2>Mười lăm chương trông ra sao khi ở quy mô thật</h2>
<p class="lead">Mọi ví dụ tới giờ đều có ba cái bảng và năm cái dòng, vì đó là cách người ta học một khái niệm. Lược đồ thật thì không như vậy, và cú nhảy ấy gây choáng váng ở lần đầu. Bài này ĐO lược đồ thật đang đứng sau trang này, để cái quy mô đó thôi trừu tượng.</p>

<h3>Các con số, đếm hôm nay</h3>
<div class="out">dòng schema.prisma : 8164
số model           : 277
số enum            : 56
số migration       : 117
số @@index         : 446
số @@unique        : 86
số @relation       : 441</div>
<p>277 cái bảng lưu mọi user, bài đăng, tin nhắn, ghi chú, khoá học và bài học trên trang — kể cả cái bài bạn đang đọc. 117 migration là 117 thay đổi CÓ CHỦ ĐÍCH, mỗi cái đều được ghi lại, có thứ tự, và phát lại được.</p>
<div class="callout ok">Chương 0 của chính khoá này ghi <strong>248 bảng, 95 migration, 6.980 dòng</strong>. Những con số đó ĐÚNG vào lúc chương ấy được viết; các con số ở trên được đếm HÔM NAY. <strong>29 bảng mới và 22 migration mới trong khoảng thời gian đó</strong> — và đây mới là điều hữu ích nhất trên trang này. Lược đồ KHÔNG phải thứ bạn thiết kế một lần. Nó là thứ LỚN LÊN chừng nào sản phẩm còn lớn, và đó chính xác là lý do cơ chế phải là migration chứ không phải <code>db push</code>.</div>

<h3>Tâm trọng lực</h3>
<p>Đếm số quan hệ của từng model thì có một cái nổi bật đến mức áp đảo:</p>
<div class="out">  User                       47 @relation · 172 trường
  Note                        8 @relation ·  35 trường
  SocialComment               6 @relation ·  22 trường
  NoteDatabaseRow             6 @relation ·  15 trường
  MessageThread               5 @relation ·  18 trường</div>
<p><code>User</code> có <strong>47 quan hệ</strong> — gần gấp SÁU lần model đứng kế — và 172 trường. Đó không phải sai sót, và cũng chẳng có gì bất thường. Ở gần như mọi ứng dụng có tài khoản, bảng user là nơi rốt cuộc mọi thứ đều trỏ về: bài đăng, bình luận, tin nhắn, ghi chú, khoá học, phiên đăng nhập, tệp tải lên, thiết lập. Nó là tâm trọng lực của lược đồ, và nó nói cho bạn một điều rất thực dụng: <strong>gần như MỌI truy vấn đáng chú ý trong hệ thống này đều join tới <code>User</code></strong>, nên khoá chính của nó là chỉ mục NÓNG NHẤT trong cả cơ sở dữ liệu, và bất kỳ migration nào khoá nó lại (16.1) đều chặn gần như mọi thứ.</p>

<h3>Tiếp cận một lược đồ mà bạn không viết ra thì làm thế nào</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">ĐỪNG đọc từ trên xuống dưới</span><span class="lz-d">8.164 dòng theo thứ tự file chẳng dạy bạn điều gì. Hãy bắt đầu từ một TÍNH NĂNG bạn nhìn thấy trong sản phẩm rồi đi tìm cái bảng của nó.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đi theo khoá ngoại RA NGOÀI</span><span class="lz-d">Từ một cái bảng, chỉ đọc các quan hệ của nó. Hai bước nhảy là đủ phủ một tính năng; bạn gần như không bao giờ cần hơn. Đây cũng chính là kỹ năng đọc một plan truy vấn từ trong ra (Chương 10).</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Để các chỉ mục kể cho bạn nghe về cách dữ liệu bị ĐỌC</span><span class="lz-d">446 khai báo <code>@@index</code> là 446 lời phát biểu về cách dữ liệu này được <em>ĐỌC</em>. Một chỉ mục trên <code>[userId, createdAt]</code> nói rằng "liệt kê các thứ của một user, mới nhất trước" — truy vấn ấy hiện ra ngay trong chỉ mục, trước cả khi bạn tìm thấy đoạn mã.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Đọc migration để biết LỊCH SỬ</span><span class="lz-d">Lược đồ cho thấy HIỆN TẠI; 117 migration cho thấy nó đã tới đây bằng cách nào và, qua tên của chúng, VÌ SAO. Khi một cái cột trông kỳ lạ, cái migration đã thêm nó vào thường giải thích được.</span></div>
</div>

<h3>Vài truy vấn hữu ích chạy trên cơ sở dữ liệu đang sống</h3>
<pre><code><span class="tok-comment">-- bảng lớn nhất theo dung lượng</span>
<span class="tok-keyword">SELECT</span> relname, pg_size_pretty(pg_total_relation_size(relid)) <span class="tok-keyword">AS</span> tong
<span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">ORDER BY</span> pg_total_relation_size(relid) <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 10;

<span class="tok-comment">-- bảng nào bị đọc nhiều nhất, và bằng chỉ mục hay quét tuần tự</span>
<span class="tok-keyword">SELECT</span> relname, seq_scan, idx_scan, n_live_tup
<span class="tok-keyword">FROM</span> pg_stat_user_tables <span class="tok-keyword">ORDER BY</span> seq_scan <span class="tok-keyword">DESC</span> <span class="tok-keyword">LIMIT</span> 10;</code></pre>
<p>Câu thứ hai là truy vấn ĐÁNG GIÁ NHẤT trong bài này. Một cái bảng có <code>n_live_tup</code> lớn, <code>seq_scan</code> cao và <code>idx_scan</code> thấp nghĩa là nó đang bị đọc bằng cách quét từ đầu tới cuối — một chỉ mục còn THIẾU (Chương 9), tìm ra được mà không cần đọc một dòng mã ứng dụng nào.</p>
<div class="callout warn"><code>pg_total_relation_size</code> bao gồm cả chỉ mục và TOAST; <code>pg_relation_size</code> chỉ tính riêng bảng. Với 446 chỉ mục trong lược đồ này thì khác biệt không hề nhỏ, và "cái bảng này khổng lồ" đôi khi hoá ra lại nghĩa là "các chỉ mục trên nó khổng lồ" — một vấn đề KHÁC với một cách sửa KHÁC.</div>
<div class="pitfall"><p><strong>Bẫy — đọc lược đồ rồi cho rằng DỮ LIỆU khớp với nó.</strong> Lược đồ mô tả những gì mã <em>CÓ THỂ</em> tạo ra KỂ TỪ BÂY GIỜ. Còn dữ liệu thì được tạo ra bởi MỌI phiên bản mã từng chạy, cộng với migration, cộng với các lần sửa tay, cộng với các đợt nhập liệu — và nó NHỚ hết. Một cột hôm nay mang <code>NOT NULL</code> có thể đang nằm trên những dòng có từ trước khi ràng buộc ấy được thực thi theo cách bạn tưởng; hai cái bảng "KHÔNG THỂ" chứa cùng một slug thì lại có thể đang chứa, vì một cuộc gộp đã chép các dòng sang bảng mới mà không xoá bảng cũ đi. Điều này không hề lý thuyết: trên chính trang này, một kết luận suy-từ-mã rằng hai không gian URL không thể trùng nhau đã <strong>SAI</strong>, và chỉ một lệnh <code>curl</code> vào production là đã cho thấy cả hai đều trả 200. <strong>Mã nói cho bạn điều gì là KHẢ DĨ; chỉ có dữ liệu mới nói điều gì là THẬT.</strong> Khi câu hỏi là về trạng thái, hãy đi hỏi trạng thái.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tìm chỉ mục còn thiếu trong một lược đồ bạn chưa từng thấy</span><span class="lc-sub">Nhánh Code Lab dùng truy vấn seq_scan trên một lược đồ sát thực tế.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.3 ─────────────────────────── */
    {
      title: '16.3 — The production checklist|||16.3 — Checklist trước khi ra production',
      slug: 'postgresql-16-3-checklist',
      type: 'LESSON',
      description: 'Danh sách rút ra từ mười lăm chương trước: sao lưu đã khôi phục thử chưa, pool đã tính chưa, quan trắc đã bật TRƯỚC khi cần chưa, autovacuum đã chỉnh theo bảng nóng chưa, và những cái khoá nào có thể làm chết trang lúc migration.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3 · Phase 4 — In production</span>
<h2>What to check before real users arrive</h2>
<p class="lead">Nothing here is new. Every item is a chapter you have already read, restated as something you can verify in an afternoon. The reason to have it as a list is that these failures do not announce themselves — each one is invisible until the day it is total.</p>

<h3>1 · Backups you have actually restored</h3>
<pre><code>pg_restore -d scratch_db backup.dump &amp;&amp; psql -d scratch_db -c <span class="tok-string">"SELECT count(*) FROM users;"</span></code></pre>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">A dump runs on a schedule, and its exit status is checked</span><span class="lz-d">A cron job writing zero-byte files reports success forever (15.1).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Backups live on different storage from the database</span><span class="lz-d">Same disk means one failure loses both.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">A restore has been rehearsed, end to end, with a row count compared</span><span class="lz-d">Until then you have a file, not a backup.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">You know your worst case in minutes</span><span class="lz-d">Nightly dump alone = up to 24 hours. If that is unacceptable, WAL archiving (15.2) is the answer.</span></div>
</div>

<h3>2 · Connections that add up</h3>
<pre><code><span class="tok-keyword">SELECT</span> count(*), (<span class="tok-keyword">SELECT</span> setting <span class="tok-keyword">FROM</span> pg_settings <span class="tok-keyword">WHERE</span> name=<span class="tok-string">'max_connections'</span>)
<span class="tok-keyword">FROM</span> pg_stat_activity;</code></pre>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">(processes × pool) &lt; <code>max_connections</code>, with headroom</span><span class="lz-d">Count every process — web, workers, cron, migrations, exporters, your psql (14.1).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Pool sized to the server, not to hope</span><span class="lz-d">≈ (cores × 2) + disks. Raising <code>max_connections</code> is not the fix.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>idle_in_transaction_session_timeout</code> is set</span><span class="lz-d">One forgotten <code>BEGIN</code> blocks vacuum across the whole database (11.1, 14.3).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">If PgBouncer: transaction mode, <code>pgbouncer=true</code>, direct URL for migrations</span><span class="lz-d">And app pools shrunk to match (14.2).</span></div>
</div>

<h3>3 · Observability switched on before you need it</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>shared_preload_libraries = 'pg_stat_statements'</code></span><span class="lz-d">Needs a restart, so it cannot be added during the incident (14.4).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>log_min_duration_statement</code> and <code>log_lock_waits</code></span><span class="lz-d">Cheap, set-and-forget, and unanswerable afterwards without them.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Alarms on: connection %, oldest transaction, dead-tuple ratio, <code>age(datfrozenxid)</code>, cache hit ratio</span><span class="lz-d">The five from 14.4. Wraparound in particular is boring for years and then an outage.</span></div>
</div>

<h3>4 · Vacuum keeping up</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Autovacuum tuned per table on the two or three that churn</span><span class="lz-d">The 20% default threshold is far too loose for a large hot table (14.3).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">No replication slot with <code>active = f</code> and a growing size</span><span class="lz-d">It fills the disk and blocks vacuum simultaneously (15.2).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">A retention policy implemented as <code>DROP PARTITION</code>, not <code>DELETE</code></span><span class="lz-d">Measured 19× faster and leaves no bloat behind (15.4).</span></div>
</div>

<h3>5 · Migrations that cannot take the site down</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">A short <code>lock_timeout</code> before DDL</span><span class="lz-d">So a migration fails fast instead of queueing every request behind it (16.1).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">New indexes use <code>CREATE INDEX CONCURRENTLY</code></span><span class="lz-d">Hand-written; the ORM will not generate it.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Tested against production-sized data</span><span class="lz-d">An empty dev database proves the syntax and nothing else.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>migrate deploy</code> on production; never <code>migrate dev</code>, never <code>db push</code></span><span class="lz-d">And never auto-resolve a failed migration.</span></div>
</div>

<h3>6 · Correctness under concurrency</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">No read-modify-write on a shared counter or balance</span><span class="lz-d">Use one atomic statement. The lost update (11.4) is silent and costs data.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Multi-row locks acquired in a consistent order</span><span class="lz-d">The whole fix for deadlocks (11.4).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">If <code>SERIALIZABLE</code> is used anywhere, a retry loop catches <code>40001</code></span><span class="lz-d">Without it you have made the system fail under load, not made it correct (11.3).</span></div>
</div>
<div class="callout ok">If you do only four of these, do these four: <strong>rehearse a restore, count your connections, enable <code>pg_stat_statements</code>, and remove every read-modify-write.</strong> They cover the four failures that most reliably take a small production database down, and none of them takes more than an afternoon.</div>
<div class="pitfall"><p><strong>Trap — treating this as a launch checklist rather than a recurring one.</strong> Every item here decays. The pool arithmetic was correct until someone added a worker; the backup worked until a credential rotated; autovacuum kept up until the table grew ten times; the restore rehearsal passed in March and the schema gained an extension in June. A checklist run once tells you about the system as it was on the day you ran it, and the most dangerous state is the one where everything was verified long enough ago that everyone remembers it being verified. Put the whole list on a calendar — quarterly is enough for most of it, and the restore rehearsal deserves to be automated so it is not a thing anyone has to remember.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: run the whole checklist against a database and record what fails</span><span class="lc-sub">The Code Lab track ships every query above as a single script.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3 · Giai đoạn 4 — Trên production</span>
<h2>Cần kiểm gì trước khi người dùng thật kéo tới</h2>
<p class="lead">Không có gì ở đây là mới. Mỗi mục đều là một chương bạn đã đọc rồi, chỉ được phát biểu lại thành thứ bạn kiểm chứng được trong một buổi chiều. Lý do phải có nó dưới dạng DANH SÁCH là vì những kiểu hỏng này KHÔNG tự thông báo — mỗi cái đều vô hình cho tới ngày nó thành toàn phần.</p>

<h3>1 · Sao lưu mà bạn ĐÃ THẬT SỰ khôi phục thử</h3>
<pre><code>pg_restore -d scratch_db backup.dump &amp;&amp; psql -d scratch_db -c <span class="tok-string">"SELECT count(*) FROM users;"</span></code></pre>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Có một lượt dump chạy theo lịch, và mã thoát của nó ĐƯỢC KIỂM</span><span class="lz-d">Một job cron ghi ra file 0 byte sẽ báo thành công mãi mãi (15.1).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Bản sao lưu nằm ở chỗ lưu trữ KHÁC với cơ sở dữ liệu</span><span class="lz-d">Cùng một đĩa nghĩa là một sự cố mất cả hai.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Đã DIỄN TẬP một lượt khôi phục, từ đầu tới cuối, có đối chiếu số dòng</span><span class="lz-d">Tới trước lúc đó thì bạn có một cái FILE, không phải một bản sao lưu.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Bạn biết trường hợp xấu nhất của mình là bao nhiêu PHÚT</span><span class="lz-d">Chỉ dump hằng đêm = tới 24 giờ. Nếu không chấp nhận được thì lưu trữ WAL (15.2) là câu trả lời.</span></div>
</div>

<h3>2 · Kết nối cộng lại phải lọt</h3>
<pre><code><span class="tok-keyword">SELECT</span> count(*), (<span class="tok-keyword">SELECT</span> setting <span class="tok-keyword">FROM</span> pg_settings <span class="tok-keyword">WHERE</span> name=<span class="tok-string">'max_connections'</span>)
<span class="tok-keyword">FROM</span> pg_stat_activity;</code></pre>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">(số tiến trình × pool) &lt; <code>max_connections</code>, còn dư chỗ</span><span class="lz-d">Đếm MỌI tiến trình — web, worker, cron, migration, exporter, cái psql của bạn (14.1).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Pool chỉnh theo MÁY CHỦ, không phải theo hy vọng</span><span class="lz-d">≈ (số nhân × 2) + số đĩa. Tăng <code>max_connections</code> KHÔNG phải cách sửa.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Đã đặt <code>idle_in_transaction_session_timeout</code></span><span class="lz-d">Một lệnh <code>BEGIN</code> bị quên sẽ chặn vacuum trên TOÀN BỘ cơ sở dữ liệu (11.1, 14.3).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Nếu dùng PgBouncer: chế độ transaction, <code>pgbouncer=true</code>, URL trực tiếp cho migration</span><span class="lz-d">Và pool phía app đã được thu nhỏ cho khớp (14.2).</span></div>
</div>

<h3>3 · Quan trắc bật TRƯỚC khi bạn cần tới</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>shared_preload_libraries = 'pg_stat_statements'</code></span><span class="lz-d">Cần khởi động lại, nên KHÔNG thể thêm vào giữa lúc sự cố (14.4).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>log_min_duration_statement</code> và <code>log_lock_waits</code></span><span class="lz-d">Rẻ, bật-rồi-quên, và không có chúng thì sau đó không trả lời được gì.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Cảnh báo cho: % kết nối, giao dịch già nhất, tỉ lệ dead tuple, <code>age(datfrozenxid)</code>, tỉ lệ trúng cache</span><span class="lz-d">Năm cái ở 14.4. Riêng wraparound thì nhàm chán suốt nhiều năm rồi thành một sự cố.</span></div>
</div>

<h3>4 · Vacuum theo kịp</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Autovacuum đã chỉnh theo TỪNG BẢNG cho hai ba cái biến động nhiều</span><span class="lz-d">Ngưỡng mặc định 20% là quá lỏng với một bảng lớn và nóng (14.3).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Không có replication slot nào <code>active = f</code> mà kích thước đang tăng</span><span class="lz-d">Nó làm đầy đĩa VÀ chặn vacuum cùng lúc (15.2).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Chính sách lưu giữ được cài đặt bằng <code>DROP PARTITION</code>, không phải <code>DELETE</code></span><span class="lz-d">Đo được nhanh gấp 19 lần và không để lại bloat (15.4).</span></div>
</div>

<h3>5 · Migration không thể làm chết trang</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Một <code>lock_timeout</code> ngắn đặt trước DDL</span><span class="lz-d">Để migration hỏng NHANH thay vì bắt mọi request xếp hàng sau nó (16.1).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Chỉ mục mới dùng <code>CREATE INDEX CONCURRENTLY</code></span><span class="lz-d">Viết tay; ORM sẽ không sinh nó ra giùm bạn.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Đã thử trên dữ liệu CỠ PRODUCTION</span><span class="lz-d">Một cơ sở dữ liệu dev rỗng chỉ chứng minh được cú pháp, ngoài ra không gì cả.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t"><code>migrate deploy</code> trên production; không bao giờ <code>migrate dev</code>, không bao giờ <code>db push</code></span><span class="lz-d">Và không bao giờ tự-động-resolve một migration đã hỏng.</span></div>
</div>

<h3>6 · Đúng đắn khi có đồng thời</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Không có chỗ nào đọc-sửa-ghi trên một bộ đếm hay số dư dùng chung</span><span class="lz-d">Hãy dùng MỘT câu lệnh nguyên tử. Lost update (11.4) thì ÂM THẦM và làm mất dữ liệu.</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Khoá nhiều dòng thì lấy theo một THỨ TỰ nhất quán</span><span class="lz-d">Đó là toàn bộ cách sửa deadlock (11.4).</span></div>
<div class="lz-step"><span class="lz-k">☐</span><span class="lz-t">Nếu có dùng <code>SERIALIZABLE</code> ở đâu đó, phải có vòng thử lại bắt <code>40001</code></span><span class="lz-d">Không có nó thì bạn đã làm hệ thống HỎNG khi tải cao, chứ không làm nó đúng (11.3).</span></div>
</div>
<div class="callout ok">Nếu chỉ làm được bốn mục, hãy làm bốn mục này: <strong>diễn tập một lượt khôi phục, đếm số kết nối, bật <code>pg_stat_statements</code>, và gỡ sạch mọi chỗ đọc-sửa-ghi.</strong> Chúng phủ đúng bốn kiểu hỏng thường xuyên hạ gục một cơ sở dữ liệu production nhỏ nhất, và không cái nào tốn quá một buổi chiều.</div>
<div class="pitfall"><p><strong>Bẫy — coi đây là checklist RA MẮT thay vì checklist ĐỊNH KỲ.</strong> Mọi mục ở đây đều PHÂN RÃ theo thời gian. Phép tính pool vốn đúng, cho tới khi có người thêm một worker; bản sao lưu vốn chạy, cho tới khi một cái khoá được xoay vòng; autovacuum vốn theo kịp, cho tới khi cái bảng lớn lên mười lần; lượt diễn tập khôi phục vốn đạt hồi tháng Ba, rồi tháng Sáu lược đồ nhận thêm một extension. Một checklist chạy MỘT LẦN chỉ kể cho bạn về hệ thống của đúng cái ngày bạn chạy nó, và trạng thái nguy hiểm nhất là trạng thái mà mọi thứ đã được kiểm chứng đủ lâu để ai cũng NHỚ RẰNG nó từng được kiểm chứng. Hãy đặt cả danh sách này lên lịch — hằng quý là đủ cho phần lớn các mục, và riêng lượt diễn tập khôi phục thì xứng đáng được TỰ ĐỘNG HOÁ để nó không còn là thứ ai đó phải nhớ.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chạy cả checklist trên một cơ sở dữ liệu và ghi lại cái nào trượt</span><span class="lc-sub">Nhánh Code Lab kèm sẵn mọi truy vấn ở trên gói trong một script.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.4 ─────────────────────────── */
    {
      title: '16.4 — Capstone: diagnose four real failures|||16.4 — Capstone: chẩn đoán bốn sự cố có thật',
      slug: 'postgresql-16-4-capstone',
      type: 'LESSON',
      description: 'Bốn tình huống, mỗi cái là một sự cố production có thật với triệu chứng gây hiểu lầm. Với mỗi cái: bạn chạy truy vấn nào trước, bạn suy ra gì, và bạn sửa thế nào — dùng tới cả mười lăm chương trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4 · Phase 4 — In production</span>
<h2>Four pagers, four investigations</h2>
<p class="lead">The course ends the way the work actually arrives: with a symptom, not a diagnosis. Read each scenario, decide what you would run <em>first</em>, then read on. The skill being tested is not recall — it is knowing which of fifteen chapters this particular symptom belongs to.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Capture state before you change anything</span><span class="lz-d"><code>pg_stat_activity</code>, the top of <code>pg_stat_statements</code>, connection counts by application. Sixty seconds, and it is the only chance you get.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ask "right now" before "over time"</span><span class="lz-d"><code>pg_stat_activity</code> answers what is happening this second — a stuck transaction, a lock wait, a connection flood. Most incidents end here.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Then ask what has been expensive</span><span class="lz-d"><code>pg_stat_statements</code> ordered by <code>total_exec_time</code>. This finds the slow-burn problems the live view cannot show.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Only now open EXPLAIN</span><span class="lz-d">Once you know <em>which</em> query, <code>EXPLAIN ANALYZE</code> tells you why. Starting here is how people spend an hour optimising a query that was never the problem.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Restart last, never first</span><span class="lz-d">It often restores service and always destroys the evidence — so the cause survives and returns with nothing left to diagnose.</span></div>
</div>
<h3>Case 1 — "The site got slow this afternoon and nothing was deployed"</h3>
<p><strong>Symptom.</strong> Response times tripled over about an hour. No deploy, no traffic spike, no error rate change. One table's queries are notably worse than the rest.</p>
<p><strong>First query.</strong> Not <code>EXPLAIN</code>. Run this:</p>
<pre><code><span class="tok-keyword">SELECT</span> pid, now()-xact_start <span class="tok-keyword">AS</span> tuoi, state, left(query,60)
<span class="tok-keyword">FROM</span> pg_stat_activity <span class="tok-keyword">WHERE</span> xact_start <span class="tok-keyword">IS NOT NULL</span> <span class="tok-keyword">ORDER BY</span> tuoi <span class="tok-keyword">DESC</span>;</code></pre>
<p><strong>What you are looking for.</strong> A session in <code>idle in transaction</code> hours old. It pins a snapshot, so <code>VACUUM</code> cannot remove any row version newer than it — <em>anywhere in the database</em> (11.1, 14.3). The hot table accumulates dead tuples, every scan reads more pages, and queries degrade gradually with no change to the code. Confirm with the dead-tuple ratio from 14.3.</p>
<p><strong>Fix.</strong> <code>pg_cancel_backend(pid)</code>, then <code>VACUUM</code> the affected table. Then set <code>idle_in_transaction_session_timeout</code> so it cannot recur, and find the application path that opens a transaction and forgets it.</p>
<div class="callout warn">The misleading part is that the slow table is often <em>not</em> the one the stuck transaction touched. That is why "which query is slow" is the wrong first question here — the cause is global, the symptom is local.</div>

<h3>Case 2 — "Users say their balance is wrong, but no errors anywhere"</h3>
<p><strong>Symptom.</strong> Occasional, unreproducible, always <em>less</em> than it should be. No exceptions in the logs. Every transaction reported success.</p>
<p><strong>First move.</strong> Do not query the database. Read the code path that writes the balance, and look for this shape:</p>
<pre><code><span class="tok-keyword">const</span> row = <span class="tok-keyword">await</span> db.query(<span class="tok-string">'SELECT balance FROM accounts WHERE id=$1'</span>, [id]);
<span class="tok-keyword">const</span> moi = row.balance - amount;                       <span class="tok-comment">// ← tính ở đây</span>
<span class="tok-keyword">await</span> db.query(<span class="tok-string">'UPDATE accounts SET balance=$1 WHERE id=$2'</span>, [moi, id]);</code></pre>
<p><strong>What it is.</strong> A lost update (11.4). Two concurrent requests both read the old value; the second overwrites the first's result. Measured in that lesson: 100 − 10 − 20 finished at <strong>80.00</strong> instead of 70.00, with both transactions reporting success. It is silent by construction, which is why the logs are clean.</p>
<p><strong>Fix.</strong> One atomic statement — <code>UPDATE accounts SET balance = balance - $1 WHERE id = $2</code> — which measured correctly at 70.00 with no locking code at all. Where the new value genuinely cannot be arithmetic on the old, <code>SELECT … FOR UPDATE</code> first.</p>

<h3>Case 3 — "Deploys started failing: 'too many clients already'"</h3>
<p><strong>Symptom.</strong> The application works, but migrations during deploy fail to connect. Later, under load, user requests start failing too.</p>
<p><strong>First query.</strong> Count and attribute:</p>
<pre><code><span class="tok-keyword">SELECT</span> usename, application_name, count(*)
<span class="tok-keyword">FROM</span> pg_stat_activity <span class="tok-keyword">GROUP BY</span> 1,2 <span class="tok-keyword">ORDER BY</span> 3 <span class="tok-keyword">DESC</span>;</code></pre>
<p><strong>What it is.</strong> The multiplication from 14.1. Someone added a worker container, and (processes × pool) crossed <code>max_connections</code>. Measured on a real server: connection 101 failed with exactly <code>sorry, too many clients already</code>. Migrations fail first because they connect last.</p>
<p><strong>Fix.</strong> Shrink the pools so the product fits with headroom, or introduce PgBouncer in transaction mode <em>and</em> shrink the pools anyway (14.2). Do <strong>not</strong> raise <code>max_connections</code> — on a small VPS that trades a clean refusal for the OOM killer.</p>

<h3>Case 4 — "A user reports a change they saved is missing, then it appears"</h3>
<p><strong>Symptom.</strong> Intermittent. Save, redirect, the change is not there; refresh a moment later and it is. Only since read replicas were introduced.</p>
<p><strong>First query.</strong> On the primary:</p>
<pre><code><span class="tok-keyword">SELECT</span> state, sync_state, pg_wal_lsn_diff(sent_lsn, replay_lsn) <span class="tok-keyword">AS</span> byte_tre
<span class="tok-keyword">FROM</span> pg_stat_replication;</code></pre>
<p><strong>What it is.</strong> Async replication lag (15.3). The write went to the primary; the redirect's read was routed to a replica that had not replayed it yet. Nothing is broken — <code>sync_state = async</code> means the primary commits without waiting, which is the default and usually correct.</p>
<p><strong>Fix.</strong> Route reads that follow a write within the same user action to the primary. Reserve replicas for genuinely independent reads — reports, dashboards, <code>pg_dump</code>.</p>

<div class="callout ok"><strong>The pattern across all four.</strong> Each symptom pointed somewhere other than its cause: a slow table caused by an idle session, wrong data with no errors, failing deploys caused by an unrelated new container, a bug that is actually correct configuration. In each case the first useful action was <em>a query against the database's own statistics</em> — not a guess, not a code review, not a restart. That habit is the real output of this course.</div>
<div class="pitfall"><p><strong>Trap — the restart that destroys the evidence.</strong> Under pressure, restarting the database "to clear something up" is enormously tempting, and it often does restore service — which is precisely the problem. It kills the stuck transaction in case 1, drops the leaked connections in case 3, and takes the contents of <code>pg_stat_activity</code> with it. The symptom disappears, the cause survives untouched, and it returns next week with no evidence left about the first occurrence. Before restarting anything, spend sixty seconds capturing state: <code>pg_stat_activity</code>, the top of <code>pg_stat_statements</code>, connection counts by application. Paste it somewhere. Then restart if you must. An outage you can explain afterwards is worth far more than one you merely survived.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Practice: reproduce all four scenarios, then diagnose them from the statistics alone</span><span class="lc-sub">The Code Lab track sets up each failure so you can practise the investigation.</span></span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4 · Giai đoạn 4 — Trên production</span>
<h2>Bốn cuộc gọi báo động, bốn cuộc điều tra</h2>
<p class="lead">Khoá học kết thúc đúng theo cách công việc thật ập tới: bằng một TRIỆU CHỨNG, không phải một chẩn đoán. Đọc từng tình huống, quyết xem bạn sẽ chạy cái gì <em>ĐẦU TIÊN</em>, rồi mới đọc tiếp. Kỹ năng đang được kiểm tra không phải trí nhớ — mà là biết cái triệu chứng CỤ THỂ này thuộc về chương nào trong mười lăm chương.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chụp lại trạng thái TRƯỚC khi đổi bất cứ thứ gì</span><span class="lz-d"><code>pg_stat_activity</code>, phần đầu của <code>pg_stat_statements</code>, số kết nối theo từng ứng dụng. Sáu mươi giây, và đó là cơ hội DUY NHẤT bạn có.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hỏi "ngay lúc này" trước khi hỏi "theo thời gian"</span><span class="lz-d"><code>pg_stat_activity</code> trả lời chuyện gì đang xảy ra ở giây này — một giao dịch kẹt, một lượt chờ khoá, một cơn lũ kết nối. Phần lớn sự cố kết thúc ngay ở đây.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Rồi mới hỏi cái gì đã ĐẮT</span><span class="lz-d"><code>pg_stat_statements</code> sắp theo <code>total_exec_time</code>. Cái này tìm ra những vấn đề cháy-âm-ỉ mà khung nhìn trực tiếp không cho thấy.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tới GIỜ mới mở EXPLAIN</span><span class="lz-d">Khi đã biết truy vấn NÀO, <code>EXPLAIN ANALYZE</code> nói cho bạn biết VÌ SAO. Bắt đầu từ đây chính là cách người ta tiêu một tiếng đi tối ưu một truy vấn vốn chưa từng là vấn đề.</span></div>
<div class="lz-step"><span class="lz-k">→</span><span class="lz-t">Khởi động lại SAU CÙNG, không bao giờ đầu tiên</span><span class="lz-d">Nó thường khôi phục dịch vụ và LUÔN xoá sạch bằng chứng — nên nguyên nhân sống sót rồi quay lại mà không còn gì để chẩn đoán.</span></div>
</div>
<h3>Ca 1 — "Trang chậm hẳn từ chiều nay mà không ai deploy gì cả"</h3>
<p><strong>Triệu chứng.</strong> Thời gian phản hồi tăng gấp ba trong khoảng một tiếng. Không deploy, không tăng lưu lượng, tỉ lệ lỗi không đổi. Truy vấn của MỘT bảng tệ hơn hẳn phần còn lại.</p>
<p><strong>Truy vấn đầu tiên.</strong> KHÔNG phải <code>EXPLAIN</code>. Hãy chạy cái này:</p>
<pre><code><span class="tok-keyword">SELECT</span> pid, now()-xact_start <span class="tok-keyword">AS</span> tuoi, state, left(query,60)
<span class="tok-keyword">FROM</span> pg_stat_activity <span class="tok-keyword">WHERE</span> xact_start <span class="tok-keyword">IS NOT NULL</span> <span class="tok-keyword">ORDER BY</span> tuoi <span class="tok-keyword">DESC</span>;</code></pre>
<p><strong>Bạn đang tìm gì.</strong> Một phiên ở trạng thái <code>idle in transaction</code> già hàng tiếng. Nó ghim một ảnh chụp, nên <code>VACUUM</code> không gỡ nổi bất kỳ phiên bản dòng nào mới hơn nó — <em>ở BẤT KỲ ĐÂU trong cơ sở dữ liệu</em> (11.1, 14.3). Cái bảng nóng tích dead tuple, mỗi lượt quét đọc nhiều trang hơn, và truy vấn suy giảm DẦN DẦN mà mã không hề đổi. Xác nhận bằng tỉ lệ dead tuple ở 14.3.</p>
<p><strong>Cách sửa.</strong> <code>pg_cancel_backend(pid)</code>, rồi <code>VACUUM</code> cái bảng bị ảnh hưởng. Sau đó đặt <code>idle_in_transaction_session_timeout</code> để nó không tái diễn, và đi tìm cái nhánh mã mở một giao dịch rồi quên nó.</p>
<div class="callout warn">Phần gây hiểu lầm là: cái bảng chậm thường KHÔNG phải cái bảng mà giao dịch bị kẹt đã chạm vào. Đó là lý do "truy vấn nào chậm" là câu hỏi đầu tiên SAI ở đây — nguyên nhân thì TOÀN CỤC, triệu chứng thì CỤC BỘ.</div>

<h3>Ca 2 — "Người dùng báo số dư sai, mà không có lỗi ở đâu cả"</h3>
<p><strong>Triệu chứng.</strong> Thi thoảng, không tái hiện được, và LUÔN <em>ÍT HƠN</em> mức đáng lẽ phải có. Không ngoại lệ nào trong log. Mọi giao dịch đều báo thành công.</p>
<p><strong>Nước đi đầu tiên.</strong> ĐỪNG truy vấn cơ sở dữ liệu. Hãy đọc nhánh mã ghi số dư, và tìm cái HÌNH DẠNG này:</p>
<pre><code><span class="tok-keyword">const</span> row = <span class="tok-keyword">await</span> db.query(<span class="tok-string">'SELECT balance FROM accounts WHERE id=$1'</span>, [id]);
<span class="tok-keyword">const</span> moi = row.balance - amount;                       <span class="tok-comment">// ← tính ở đây</span>
<span class="tok-keyword">await</span> db.query(<span class="tok-string">'UPDATE accounts SET balance=$1 WHERE id=$2'</span>, [moi, id]);</code></pre>
<p><strong>Nó là gì.</strong> Một lost update (11.4). Hai request đồng thời cùng đọc giá trị cũ; cái thứ hai ghi đè lên kết quả của cái thứ nhất. Đo trong bài đó: 100 − 10 − 20 kết thúc ở <strong>80.00</strong> thay vì 70.00, mà cả hai giao dịch đều báo thành công. Nó ÂM THẦM do chính cấu trúc của nó, và đó là lý do log sạch bong.</p>
<p><strong>Cách sửa.</strong> Một câu lệnh nguyên tử — <code>UPDATE accounts SET balance = balance - $1 WHERE id = $2</code> — thứ đã đo được ĐÚNG 70.00 mà không cần một dòng mã khoá nào. Chỗ nào giá trị mới thật sự không diễn đạt được bằng phép tính trên giá trị cũ thì dùng <code>SELECT … FOR UPDATE</code> trước.</p>

<h3>Ca 3 — "Deploy bắt đầu hỏng: 'too many clients already'"</h3>
<p><strong>Triệu chứng.</strong> Ứng dụng vẫn chạy, nhưng migration lúc deploy không kết nối nổi. Về sau, khi tải cao, request của người dùng cũng bắt đầu hỏng.</p>
<p><strong>Truy vấn đầu tiên.</strong> Đếm và quy trách nhiệm:</p>
<pre><code><span class="tok-keyword">SELECT</span> usename, application_name, count(*)
<span class="tok-keyword">FROM</span> pg_stat_activity <span class="tok-keyword">GROUP BY</span> 1,2 <span class="tok-keyword">ORDER BY</span> 3 <span class="tok-keyword">DESC</span>;</code></pre>
<p><strong>Nó là gì.</strong> Phép nhân ở bài 14.1. Ai đó vừa thêm một container worker, và (số tiến trình × pool) đã vượt qua <code>max_connections</code>. Đo trên một máy chủ thật: kết nối thứ 101 hỏng với đúng dòng <code>sorry, too many clients already</code>. Migration hỏng trước tiên vì nó kết nối SAU CÙNG.</p>
<p><strong>Cách sửa.</strong> Thu nhỏ các pool cho tích số lọt xuống và còn dư, hoặc đưa PgBouncer vào ở chế độ transaction <em>VÀ</em> dù sao cũng vẫn phải thu nhỏ pool (14.2). <strong>ĐỪNG</strong> tăng <code>max_connections</code> — trên một VPS nhỏ, làm thế là đổi một lời từ chối sạch sẽ lấy OOM killer.</p>

<h3>Ca 4 — "Người dùng báo thay đổi họ vừa lưu bị mất, rồi lát sau nó hiện ra"</h3>
<p><strong>Triệu chứng.</strong> Chập chờn. Lưu, chuyển trang, thay đổi không có; tải lại một lúc sau thì nó có. Chỉ xảy ra kể từ khi đưa read replica vào.</p>
<p><strong>Truy vấn đầu tiên.</strong> Trên primary:</p>
<pre><code><span class="tok-keyword">SELECT</span> state, sync_state, pg_wal_lsn_diff(sent_lsn, replay_lsn) <span class="tok-keyword">AS</span> byte_tre
<span class="tok-keyword">FROM</span> pg_stat_replication;</code></pre>
<p><strong>Nó là gì.</strong> Độ trễ nhân bản bất đồng bộ (15.3). Lệnh ghi đi vào primary; lệnh đọc của cú chuyển trang lại bị định tuyến sang một bản sao chưa kịp phát lại nó. KHÔNG có gì hỏng cả — <code>sync_state = async</code> nghĩa là primary commit mà không chờ, đó là mặc định và thường là đúng.</p>
<p><strong>Cách sửa.</strong> Định tuyến những lệnh đọc đi SAU một lệnh ghi trong CÙNG một hành động của người dùng về primary. Để dành bản sao cho những lệnh đọc thật sự độc lập — báo cáo, bảng điều khiển, <code>pg_dump</code>.</p>

<div class="callout ok"><strong>Cái mẫu chung của cả bốn ca.</strong> Mỗi triệu chứng đều chỉ về một chỗ KHÁC với nguyên nhân của nó: một cái bảng chậm do một phiên đang NGỒI KHÔNG, dữ liệu sai mà không lỗi, deploy hỏng do một container mới chẳng liên quan, và một "con bug" hoá ra là cấu hình đúng. Ở mỗi ca, hành động hữu ích đầu tiên đều là <em>một truy vấn vào chính thống kê của cơ sở dữ liệu</em> — không phải một phỏng đoán, không phải một buổi review mã, không phải một cú khởi động lại. Cái THÓI QUEN đó mới là sản phẩm thật sự của khoá học này.</div>
<div class="pitfall"><p><strong>Bẫy — cú khởi động lại XOÁ SẠCH bằng chứng.</strong> Dưới áp lực, việc khởi động lại cơ sở dữ liệu "cho nó thông thoáng" là cám dỗ khổng lồ, và nó THƯỜNG khôi phục được dịch vụ — mà đó chính là vấn đề. Nó giết cái giao dịch bị kẹt ở ca 1, thả các kết nối bị rò ở ca 3, và mang theo luôn toàn bộ nội dung của <code>pg_stat_activity</code>. Triệu chứng biến mất, nguyên nhân sống sót nguyên vẹn, và nó quay lại vào tuần sau mà không còn bằng chứng nào về lần đầu tiên. Trước khi khởi động lại bất cứ thứ gì, hãy bỏ ra SÁU MƯƠI GIÂY chụp lại trạng thái: <code>pg_stat_activity</code>, phần đầu của <code>pg_stat_statements</code>, số kết nối theo từng ứng dụng. Dán nó vào đâu đó. RỒI hãy khởi động lại nếu buộc phải. Một sự cố mà sau đó bạn GIẢI THÍCH được thì đáng giá hơn nhiều một sự cố mà bạn chỉ đơn thuần sống sót qua.</p></div>
<a class="link-card codelab" href="/code-lab/postgresql${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tái hiện cả bốn tình huống, rồi chẩn đoán chúng chỉ bằng thống kê</span><span class="lc-sub">Nhánh Code Lab dựng sẵn từng sự cố để bạn luyện cuộc điều tra.</span></span>
</a>
</div>
`,
    },

    /* ─────────────────────────── 16.5 ─────────────────────────── */
    {
      title: '16.5 — Chapter 16 quiz|||16.5 — Kiểm tra Chương 16',
      slug: 'postgresql-16-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu tổng kết: ánh xạ Prisma sang SQL, migrate dev vs deploy, shadow database, đọc lược đồ lớn, và chẩn đoán bốn sự cố production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Quiz · End of course</span>
<h2>The last eight questions</h2>
<p class="lead">These draw on the whole course, not just this chapter. If a question feels like it belongs to Chapter 11 or 14, that is deliberate — production problems do not respect chapter boundaries.</p>
<div class="callout ok">You have reached the end. 16 chapters, from why PostgreSQL exists to diagnosing a live incident. The one habit worth keeping above all the syntax: when something is wrong, <strong>ask the database</strong> — <code>pg_stat_activity</code>, <code>pg_stat_statements</code>, <code>EXPLAIN ANALYZE</code> — before you guess.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Kiểm tra · Kết thúc khoá</span>
<h2>Tám câu cuối cùng</h2>
<p class="lead">Những câu này rút từ CẢ khoá học, không riêng chương này. Nếu một câu có cảm giác thuộc về Chương 11 hay 14 thì đó là CỐ Ý — vấn đề trên production không tôn trọng ranh giới chương.</p>
<div class="callout ok">Bạn đã tới cuối. 16 chương, từ chuyện vì sao PostgreSQL tồn tại tới việc chẩn đoán một sự cố đang diễn ra. Thói quen duy nhất đáng giữ hơn mọi cú pháp: khi có gì đó sai, hãy <strong>ĐI HỎI CƠ SỞ DỮ LIỆU</strong> — <code>pg_stat_activity</code>, <code>pg_stat_statements</code>, <code>EXPLAIN ANALYZE</code> — trước khi phỏng đoán.</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'In Prisma, what does @@index([userId, createdAt]) become, and what still matters about it?|||Trong Prisma, @@index([userId, createdAt]) trở thành cái gì, và điều gì vẫn quan trọng ở nó?',
            options: [
              'Two separate indexes; order is irrelevant|||Hai chỉ mục riêng; thứ tự không quan trọng',
              'One composite B-tree index — and COLUMN ORDER matters exactly as in Chapter 9. Prisma will not warn you if the order is wrong; EXPLAIN will show it|||MỘT chỉ mục B-tree tổ hợp — và THỨ TỰ CỘT quan trọng y hệt Chương 9. Prisma sẽ không cảnh báo nếu thứ tự sai; EXPLAIN thì cho thấy',
              'A unique constraint|||Một ràng buộc unique',
              'Nothing; it is only documentation|||Không gì cả; nó chỉ là tài liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must prisma migrate dev never point at production?|||Vì sao prisma migrate dev không bao giờ được trỏ vào production?',
            options: [
              'It is slower|||Nó chậm hơn',
              'It builds a SHADOW DATABASE by replaying every migration from scratch, and it may offer to RESET the database. Production uses migrate deploy, which only applies pending migrations|||Nó dựng một SHADOW DATABASE bằng cách phát lại mọi migration từ đầu, và nó có thể đề nghị RESET cơ sở dữ liệu. Production dùng migrate deploy, thứ chỉ áp các migration đang chờ',
              'It requires superuser|||Nó cần superuser',
              'It does not generate SQL|||Nó không sinh ra SQL',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A migration adds a UNIQUE constraint named "x" and then a plain index also named "x". It applied fine once. What breaks, and what must you NOT do?|||Một migration thêm ràng buộc UNIQUE tên "x" rồi thêm một index thường CŨNG tên "x". Nó đã áp trót lọt một lần. Cái gì hỏng, và bạn KHÔNG được làm gì?',
            options: [
              'Nothing breaks; edit the file freely|||Không gì hỏng; cứ sửa file thoải mái',
              'The shadow database replay fails (P3006) forever, so migrate dev is broken — but do NOT edit the applied migration; hand-write new SQL and use migrate deploy|||Lượt phát lại trên shadow database hỏng (P3006) mãi mãi, nên migrate dev vỡ — nhưng KHÔNG được sửa migration đã áp; hãy viết tay SQL mới và dùng migrate deploy',
              'Production breaks immediately|||Production hỏng ngay lập tức',
              'Run prisma db push to fix it|||Chạy prisma db push để sửa',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In this site\'s real schema the User model has 47 relations and 172 fields. What is the practical consequence?|||Trong lược đồ thật của trang này, model User có 47 quan hệ và 172 trường. Hệ quả thực dụng là gì?',
            options: [
              'It is a design error to fix|||Đó là lỗi thiết kế cần sửa',
              'It is the schema\'s centre of gravity — almost every query joins to it, its primary key is the hottest index, and any migration that locks it blocks nearly everything|||Nó là TÂM TRỌNG LỰC của lược đồ — gần như mọi truy vấn đều join tới nó, khoá chính của nó là chỉ mục nóng nhất, và mọi migration khoá nó lại đều chặn gần như mọi thứ',
              'It means the database is too slow|||Nghĩa là cơ sở dữ liệu quá chậm',
              'Nothing in particular|||Không có gì đặc biệt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A table has high n_live_tup, high seq_scan and low idx_scan. What does that tell you?|||Một bảng có n_live_tup cao, seq_scan cao và idx_scan thấp. Điều đó nói lên gì?',
            options: [
              'The table is healthy|||Bảng đó khoẻ',
              'It is being read by scanning end to end — a likely MISSING INDEX, findable from statistics without reading any application code|||Nó đang bị đọc bằng cách quét từ đầu tới cuối — nhiều khả năng THIẾU CHỈ MỤC, tìm ra được từ thống kê mà không cần đọc dòng mã ứng dụng nào',
              'Autovacuum is broken|||Autovacuum hỏng',
              'It needs partitioning|||Nó cần phân mảnh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The site slowed over an hour with no deploy, and one table degraded most. What do you run FIRST?|||Trang chậm dần trong một tiếng mà không ai deploy, và một bảng tệ nhất. Bạn chạy cái gì ĐẦU TIÊN?',
            options: [
              'EXPLAIN on that table\'s queries|||EXPLAIN các truy vấn của bảng đó',
              'pg_stat_activity ordered by transaction age — a long "idle in transaction" session pins a snapshot and blocks VACUUM across the WHOLE database, so the cause is global while the symptom is local|||pg_stat_activity sắp theo tuổi giao dịch — một phiên "idle in transaction" lâu sẽ ghim ảnh chụp và chặn VACUUM trên TOÀN BỘ cơ sở dữ liệu, nên nguyên nhân TOÀN CỤC còn triệu chứng CỤC BỘ',
              'Restart the database|||Khởi động lại cơ sở dữ liệu',
              'Add an index to that table|||Thêm chỉ mục cho bảng đó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Balances are occasionally too low, with no errors and every transaction reporting success. Where do you look?|||Số dư thi thoảng bị thiếu, không có lỗi nào và mọi giao dịch đều báo thành công. Bạn nhìn vào đâu?',
            options: [
              'Replication lag|||Độ trễ nhân bản',
              'The application code, for a SELECT-then-UPDATE-with-a-computed-value — a lost update, silent by construction. Fix with one atomic statement: SET balance = balance - $1|||Mã ứng dụng, tìm mẫu SELECT-rồi-UPDATE-bằng-giá-trị-tự-tính — một lost update, âm thầm do chính cấu trúc của nó. Sửa bằng MỘT câu lệnh nguyên tử: SET balance = balance - $1',
              'Disk corruption|||Hỏng đĩa',
              'The isolation level; switch everything to SERIALIZABLE|||Mức cô lập; chuyển tất cả sang SERIALIZABLE',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Before restarting a database mid-incident, what should you always do first, and why?|||Trước khi khởi động lại một cơ sở dữ liệu giữa lúc sự cố, luôn phải làm gì trước, và vì sao?',
            options: [
              'Nothing; restore service as fast as possible|||Không gì cả; khôi phục dịch vụ càng nhanh càng tốt',
              'Spend ~60 seconds capturing pg_stat_activity, pg_stat_statements and connection counts — a restart often fixes the SYMPTOM while destroying the evidence, so the cause returns later with nothing left to diagnose|||Bỏ ~60 giây chụp lại pg_stat_activity, pg_stat_statements và số kết nối — khởi động lại thường sửa TRIỆU CHỨNG mà xoá sạch bằng chứng, nên nguyên nhân quay lại sau đó mà không còn gì để chẩn đoán',
              'Run VACUUM FULL|||Chạy VACUUM FULL',
              'Increase max_connections|||Tăng max_connections',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
