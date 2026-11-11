/**
 * Prisma ORM · Mục 0 · Bắt đầu tại đây (2/2) — pr-0-9-bat-dau-tai-day-2 (BÀI MỚI 11/11/2026, theo khuôn typescript/s00/bat-dau-2.mjs).
 * Sự cố THẬT: chỉ những sự cố của kho CuongThai mà chính khoá này đã kể (bài 2.3, 3.1, 6.2–6.3, 8.3, 11.1, 12.4) — không bịa thêm.
 * Tình huống của sinh viên được GHI RÕ là minh hoạ. Không có output chạy mới trong bài này (mọi output ở các bài được dẫn tới).
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import G00_9 from '../giang/pr-00-9.mjs';
const REF = '?ref=%2Fcourses%2Fprisma-orm%2Flearn&reflabel=Prisma';

export default {
  title: 'Start here (2/2) — What goes wrong without it, and how to study this course|||Bắt đầu tại đây (2/2) — Chuyện gì hỏng khi thiếu nó, và cách học khoá này',
  slug: 'pr-0-9-bat-dau-tai-day-2',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sáu sự cố thật của chính CuongThai mà khoá này mổ lại (quan hệ ngược thiếu chặn generate, tên khoá ghép, migration không replay được — P3006, enum đổi tên làm vỡ seed production, engine sai nền làm API chết 502 bảy phút, đĩa đầy giữa lúc deploy), điểm chung của chúng — mọi phép kiểm đều xanh; ba tình huống minh hoạ của sinh viên; và cách học khoá này không nản: lộ trình tối thiểu, lộ trình đầy đủ, nhịp một buổi học, năm luật an toàn.',
  content: `
${G00_9}
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>What goes wrong without it — and how to study this course</h2>
<p class="lead">The previous lesson said what Prisma is. This one shows why the course spends so long on the parts beyond <code>findMany</code>: six real incidents from the CuongThai codebase, each taught in detail later in the course, and one thing they share — every check was green. Then a study plan that gets you to the end without burning out.</p>

<h3>Six real incidents, all from this website</h3>
<p>None of these is invented. Each is recorded in the CuongThai repository, and each is dissected in the lesson named on its card.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">29 Jun 2026 · a relation without its other half</span><span class="v">Two models declared relations whose opposite fields did not exist in the parent models. <code>prisma generate</code> refused to run until both sides were written. The rule added to the repository afterwards is one sentence: every relation needs its opposite field. <em>→ Lesson 3.1</em></span></div>
  <div class="kv"><span class="k">29 Jun 2026 · the compound key with a custom name</span><span class="v">Queries used the default compound key name while the schema declared a custom one with <code>@@unique([...], name: ...)</code>. The field names were right there; TypeScript only said the property did not exist on the input type. <em>→ Lesson 2.3</em></span></div>
  <div class="kv"><span class="k">6 Jul 2026 · a migration that can never replay</span><span class="v">Migration <code>20260706130000_add_music_and_profile</code> creates a UNIQUE constraint and then a plain index with the same name. It applied once; on a clean shadow database it collides with itself, so <code>migrate dev</code> fails with P3006 in this repository to this day. It is deployed, so it must not be edited — new migrations are hand-written and applied with <code>migrate deploy</code>. <em>→ Lessons 6.2, 6.3</em></span></div>
  <div class="kv"><span class="k">8 Aug 2026 · one renamed enum value</span><span class="v">An enum value was renamed from <code>CODE</code> to <code>CODE_REVIEW</code>. The whole pre-push checklist passed, and the seed broke on production — because the seed script carried its own hand-written copy of the values and was never type-checked. <em>→ Lessons 2.5, 8.3, 11.4</em></span></div>
  <div class="kv"><span class="k">18 Aug 2026 · seven minutes of 502</span><span class="v">An image was built from the wrong Dockerfile: a musl base carrying a glibc Prisma engine. Green build, green push, green swap — then an infinite restart loop while the deploy log said success. <em>→ Lesson 11.1</em></span></div>
  <div class="kv"><span class="k">18 Aug 2026 · no space left on device</span><span class="v">A deploy died because the Docker build cache had grown to 7.6 GB on the same disk as PostgreSQL, leaving 1.8 GB free. A disk alert would have caught it days earlier. <em>→ Lesson 12.4</em></span></div>
</div>
<div class="pitfall">
<p><strong>What they share.</strong> In every one of them the tools said “OK”: the type check passed, the build passed, the deploy reported success. The failure lived in a place no check was looking at — a seed file outside <code>tsc</code>, a shadow database, an engine file inside an image, a disk. That is why this course keeps asking you to <em>look at the real state</em>: the SQL that was sent, the migration table, the file inside the container. “It compiled” is where the questions start, not where they end.</p>
</div>

<h3>Three situations you may meet as a student <em>(illustrations, not real events)</em></h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🌙 The night before the defence</span><span class="v">A teammate's migration fails, so they run <code>prisma migrate reset</code> on the shared database “to clean it up”. Every row the team typed in for the demo is gone. Chapter 1 (Lesson 1.5) and Chapter 6 tell you which commands drop data and why <code>migrate deploy</code> never does.</span></div>
  <div class="kv"><span class="k">🐢 The page that was fast yesterday</span><span class="v">A list of posts with their comments is instant with ten posts and takes seconds with two thousand, because a loop sends one query per post. Lesson 0.3 switches the query log on; Chapter 9 counts the queries and fixes them.</span></div>
  <div class="kv"><span class="k">🔑 The password on GitHub</span><span class="v">A <code>.env</code> file with <code>DATABASE_URL</code> is committed to a public repository. Lesson 0.2 checks <code>.gitignore</code> on day one, before there is anything to leak.</span></div>
</div>

<h3>How to study this course without giving up</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Minimum path</span><span class="lz-t">Enough for a group project</span><span class="lz-d">Section 0 → Lesson 1.5 → Chapters 2 and 3 → Chapter 4 → Lessons 5.1–5.3 → Lessons 6.1–6.3 → Lesson 7.1. About three weeks at one session a day.</span></div>
  <div class="lz-step"><span class="lz-k">Full path</span><span class="lz-t">Enough for a job</span><span class="lz-d">All thirteen sections in order, with every quiz. Chapters 6, 7, 9 and 11 are the ones interviews and real incidents come from.</span></div>
</div>
<h3>One study session (45–60 minutes)</h3>
<ol>
  <li><strong>Read or watch (10 min).</strong> One lesson, not three.</li>
  <li><strong>Type it yourself (25 min).</strong> Every command, every query, against your own throwaway PostgreSQL. Copy-paste teaches your clipboard, not you.</li>
  <li><strong>Break it on purpose (10 min).</strong> Misspell a field, drop a relation, run the wrong command — and read the error message to the end.</li>
  <li><strong>Write it down (5 min).</strong> One line per lesson in a notebook: the command, the SQL it sent, the trap.</li>
</ol>
<h3>Five safety rules from day one</h3>
<ul>
  <li>Keep a <strong>throwaway PostgreSQL in Docker</strong> for this course. Never practise on a database anyone else uses.</li>
  <li>Switch on <code>log: ['query']</code> in development and leave it on until Chapter 9.</li>
  <li><code>migrate reset</code>, <code>db push --force-reset</code> and <code>DROP</code> only ever run against your throwaway database.</li>
  <li>Never commit <code>.env</code>. Check <code>git status</code> before every commit.</li>
  <li>When something fails, read the code first — <code>P1001</code>, <code>P2002</code>, <code>P3009</code> — then Lesson 12.2. Do not “fix” a failed migration by guessing.</li>
</ul>

<h3>Sources for this lesson</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🧯</span><span class="lc-body"><span class="lc-title">Prisma error reference</span><span class="lc-sub">prisma.io/docs · Every P1xxx–P6xxx code with its meaning</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/troubleshooting" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Troubleshooting Prisma Migrate</span><span class="lc-sub">prisma.io/docs · The official guide behind Chapter 6</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Ten exercises per module; do them after each section</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">For the throwaway PostgreSQL, and for Chapter 11</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Chuyện gì hỏng khi thiếu nó — và cách học khoá này</h2>
<p class="lead">Bài trước nói Prisma là gì. Bài này cho thấy vì sao khoá dành nhiều thời gian cho những phần nằm ngoài <code>findMany</code>: sáu sự cố thật của kho mã CuongThai, sự cố nào cũng được mổ kỹ ở một bài sau, và một điểm chung của chúng — mọi phép kiểm đều xanh. Sau đó là một kế hoạch học giúp bạn đi tới cuối mà không bị đuối.</p>

<h3>Sáu sự cố thật, đều từ chính website này</h3>
<p>Không chuyện nào là bịa. Mỗi chuyện đều được ghi trong kho mã CuongThai, và mỗi chuyện được mổ xẻ ở bài ghi trên thẻ của nó.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">29/06/2026 · một quan hệ thiếu nửa kia</span><span class="v">Hai model khai những quan hệ mà trường đối ứng không tồn tại trong model cha. <code>prisma generate</code> từ chối chạy cho tới khi viết đủ hai phía. Luật thêm vào kho sau đó chỉ một câu: mọi quan hệ đều cần trường đối ứng của nó. <em>→ Bài 3.1</em></span></div>
  <div class="kv"><span class="k">29/06/2026 · khoá ghép có tên riêng</span><span class="v">Các truy vấn dùng tên khoá ghép mặc định trong khi lược đồ khai một tên riêng bằng <code>@@unique([...], name: ...)</code>. Tên các trường sờ sờ ngay đó; TypeScript chỉ nói thuộc tính không tồn tại trên kiểu đầu vào. <em>→ Bài 2.3</em></span></div>
  <div class="kv"><span class="k">06/07/2026 · một migration không bao giờ chạy lại được</span><span class="v">Migration <code>20260706130000_add_music_and_profile</code> tạo một ràng buộc UNIQUE rồi một chỉ mục thường trùng tên. Nó áp dụng được đúng một lần; trên một shadow database sạch nó tự va vào chính nó, nên tới hôm nay <code>migrate dev</code> trong kho này vẫn chết với P3006. Nó đã deploy nên không được sửa — migration mới phải viết SQL tay rồi áp bằng <code>migrate deploy</code>. <em>→ Bài 6.2, 6.3</em></span></div>
  <div class="kv"><span class="k">08/08/2026 · đổi tên một giá trị enum</span><span class="v">Một giá trị enum được đổi tên từ <code>CODE</code> thành <code>CODE_REVIEW</code>. Cả danh sách kiểm trước khi đẩy đều qua, và phần seed vỡ trên production — vì script seed tự giữ một bản chép tay các giá trị và chưa từng được kiểm kiểu. <em>→ Bài 2.5, 8.3, 11.4</em></span></div>
  <div class="kv"><span class="k">18/08/2026 · bảy phút 502</span><span class="v">Một ảnh Docker được dựng từ nhầm Dockerfile: nền musl mang engine Prisma bản glibc. Build xanh, đẩy xanh, tráo xanh — rồi khởi động lại vô tận trong khi nhật ký deploy báo thành công. <em>→ Bài 11.1</em></span></div>
  <div class="kv"><span class="k">18/08/2026 · hết chỗ trên đĩa</span><span class="v">Một lần deploy chết vì cache build của Docker phình lên 7,6 GB trên cùng ổ đĩa với PostgreSQL, chỉ còn 1,8 GB trống. Một cảnh báo dung lượng đĩa đã bắt được chuyện này từ nhiều ngày trước. <em>→ Bài 12.4</em></span></div>
</div>
<div class="pitfall">
<p><strong>Điểm chung của chúng.</strong> Trong mọi vụ, công cụ đều nói "OK": kiểm kiểu qua, build qua, deploy báo thành công. Chỗ hỏng nằm ở nơi không phép kiểm nào nhìn tới — một tệp seed nằm ngoài <code>tsc</code>, một shadow database, một tệp engine trong ảnh, một ổ đĩa. Vì thế khoá này cứ bắt bạn <em>nhìn trạng thái thật</em>: câu SQL đã gửi, bảng migration, tệp nằm trong container. "Biên dịch được rồi" là chỗ câu hỏi bắt đầu, không phải chỗ nó kết thúc.</p>
</div>

<h3>Ba tình huống bạn có thể gặp khi còn là sinh viên <em>(minh hoạ, không phải chuyện thật)</em></h3>
<div class="kv-grid">
  <div class="kv"><span class="k">🌙 Đêm trước hôm bảo vệ</span><span class="v">Migration của một bạn trong nhóm lỗi, thế là bạn ấy chạy <code>prisma migrate reset</code> trên cơ sở dữ liệu chung "cho sạch". Mọi hàng cả nhóm nhập để demo biến mất. Chương 1 (Bài 1.5) và Chương 6 nói rõ lệnh nào xoá dữ liệu, và vì sao <code>migrate deploy</code> thì không bao giờ.</span></div>
  <div class="kv"><span class="k">🐢 Trang hôm qua còn nhanh</span><span class="v">Danh sách bài viết kèm bình luận hiện tức thì với mười bài, mất vài giây với hai nghìn bài, vì một vòng lặp gửi mỗi bài một câu truy vấn. Bài 0.3 bật log truy vấn; Chương 9 đếm số câu và vá chúng.</span></div>
  <div class="kv"><span class="k">🔑 Mật khẩu trên GitHub</span><span class="v">Một tệp <code>.env</code> chứa <code>DATABASE_URL</code> bị commit lên kho công khai. Bài 0.2 kiểm <code>.gitignore</code> ngay ngày đầu, trước khi có gì để lộ.</span></div>
</div>

<h3>Cách học khoá này mà không bỏ cuộc</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Lộ trình tối thiểu</span><span class="lz-t">Đủ cho đồ án nhóm</span><span class="lz-d">Mục 0 → Bài 1.5 → Chương 2 và 3 → Chương 4 → Bài 5.1–5.3 → Bài 6.1–6.3 → Bài 7.1. Khoảng ba tuần, mỗi ngày một buổi.</span></div>
  <div class="lz-step"><span class="lz-k">Lộ trình đầy đủ</span><span class="lz-t">Đủ để đi làm</span><span class="lz-d">Cả mười ba mục theo thứ tự, làm hết quiz. Chương 6, 7, 9 và 11 là nơi câu hỏi phỏng vấn và sự cố thật hay rơi vào.</span></div>
</div>
<h3>Một buổi học (45–60 phút)</h3>
<ol>
  <li><strong>Đọc hoặc xem (10 phút).</strong> Một bài, không phải ba bài.</li>
  <li><strong>Tự gõ lại (25 phút).</strong> Mọi lệnh, mọi truy vấn, trên PostgreSQL dùng-xong-bỏ của chính bạn. Chép-dán chỉ dạy cái clipboard, không dạy bạn.</li>
  <li><strong>Cố tình làm hỏng (10 phút).</strong> Gõ sai một trường, bỏ một quan hệ, chạy nhầm lệnh — rồi đọc thông báo lỗi tới chữ cuối.</li>
  <li><strong>Ghi lại (5 phút).</strong> Mỗi bài một dòng trong sổ: câu lệnh, câu SQL nó gửi, cái bẫy.</li>
</ol>
<h3>Năm luật an toàn từ ngày đầu</h3>
<ul>
  <li>Giữ một <strong>PostgreSQL dùng-xong-bỏ trong Docker</strong> cho khoá này. Không bao giờ tập trên cơ sở dữ liệu người khác đang dùng.</li>
  <li>Bật <code>log: ['query']</code> khi phát triển và để nguyên tới Chương 9.</li>
  <li><code>migrate reset</code>, <code>db push --force-reset</code> và <code>DROP</code> chỉ được chạy trên cơ sở dữ liệu dùng-xong-bỏ của bạn.</li>
  <li>Không bao giờ commit <code>.env</code>. Xem <code>git status</code> trước mỗi lần commit.</li>
  <li>Khi có gì hỏng, đọc mã lỗi trước — <code>P1001</code>, <code>P2002</code>, <code>P3009</code> — rồi tra Bài 12.2. Đừng "sửa" một migration thất bại bằng cách đoán.</li>
</ul>

<h3>Nguồn cho bài này</h3>
<a class="link-card" href="https://www.prisma.io/docs/orm/reference/error-reference" target="_blank" rel="noopener"><span class="lc-ico">🧯</span><span class="lc-body"><span class="lc-title">Bảng mã lỗi Prisma</span><span class="lc-sub">prisma.io/docs · Đủ mọi mã P1xxx–P6xxx kèm nghĩa</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-migrate/workflows/troubleshooting" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Gỡ rối Prisma Migrate</span><span class="lc-sub">prisma.io/docs · Hướng dẫn chính thức đứng sau Chương 6</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/prisma-orm${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Prisma ORM"</span><span class="lc-sub">Mỗi module mười bài; làm sau khi học xong mỗi mục</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Cho cái PostgreSQL dùng-xong-bỏ, và cho Chương 11</span></span></a>
</div>
`,
};
