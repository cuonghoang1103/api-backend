const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 1 — The artifact: deciding exactly what ships|||Chương 1 — Tạo tác: quyết định chính xác thứ gì được gửi đi',
  description: 'Bước 1 là bước người ta bỏ qua, và bỏ qua nó là cách bí mật, tệp người dùng tải lên và một bản sửa dở lên tới production. Chương này đo xem một cây làm việc thật chứa những gì, dựng một tạo tác tái lập được tới từng byte, và đặt tên cho nó sao cho nhìn vào máy chủ là biết đang chạy cái gì.',
  lessons: [

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — What is actually in your working tree|||1.1 — Trong cây làm việc của bạn thật ra có gì',
      slug: 'deploy-1-1-cay-lam-viec-co-gi',
      type: 'LESSON',
      description: 'Một cây làm việc thật, đo thật: 3,8 MB, trong đó 84 KB là mã nguồn. Phần còn lại gồm thư viện, cache, log, ảnh người dùng tải lên, một bản sửa dở của trình soạn thảo, và một tệp .env chứa mật khẩu thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What is actually in your working tree</h2>
<p class="lead">"Deploy the project" sounds like it names a set of files. It does not. The directory you work in contains several categories of thing, and only one of them belongs on a server — the trouble is that the other categories are larger, and one of them holds your production password.</p>

<h3>A real working tree, measured</h3>
<div class="out">=== cay lam viec THAT ===
  tong: 3.8M
    node_modules     3.1M  (780 tep)
    dist             200K  (1 tep)
    logs             8.0K  (1 tep)
    tai-len          300K  (1 tep)
    src              172K  (42 tep)
  .env: 96 byte — CHUA BI MAT

=== git archive gui di bao nhieu? ===
  git archive: 84K  (43 muc)
=== rsync tho (khong loai tru gi) gui di bao nhieu? ===
  ca cay:      1.4M  (839 muc)</div>
<p>Eighty-four kilobytes of source, inside 3.8 MB of directory. The naive package is sixteen times larger than the artifact, and the extra weight is not the interesting part.</p>

<h3>What the naive package contains</h3>
<div class="out">=== .env co nam trong goi khong? ===
  tar tho:     1 lan xuat hien
  git archive: 0 lan xuat hien
  → noi dung .env trong goi tho:
      DATABASE_URL=postgres://user:sieubimat@db:5432/app
      JWT_SECRET=khoa-that-su-bi-mat-khong-duoc-lo

=== con tep nguoi dung tai len va log? ===
  tai-len/           tar tho: 2    | git archive: 0
  logs/              tar tho: 2    | git archive: 0
  node_modules/      tar tho: 786  | git archive: 0
  server.js.orig     tar tho: 1    | git archive: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Secrets, in the clear</span><span class="v">The database password and the JWT signing key, extracted straight out of the tarball. Shipping them to your own server is not itself the leak — the problem is that the <em>artifact</em> now contains them, and an artifact gets copied: to a CI cache, a build log, a registry, someone's laptop, a backup.</span></div>
  <div class="kv"><span class="k">Worse: it overwrites the server's config</span><span class="v">Your local <code>.env</code> points at a development database. Deploying it over the server's <code>.env</code> points production at your laptop's settings — or at nothing. This is the same failure shape as case C in Lesson 0.3, arriving by a different route.</span></div>
  <div class="kv"><span class="k">User uploads, going backwards</span><span class="v">Files users put on the server, being overwritten by whatever happened to be in your local <code>tai-len/</code> — which is usually a few test images from three months ago. With <code>rsync --delete</code>, the ones not in your local copy are deleted outright.</span></div>
  <div class="kv"><span class="k">An editor backup</span><span class="v"><code>server.js.orig</code> shipped too. Harmless here; not harmless when it is <code>config.php.bak</code> on a server that only executes <code>.php</code>, and now serves the backup as plain text to anyone who guesses the name.</span></div>
</div>
<div class="pitfall"><strong>Trap — <code>node_modules</code> from your laptop is not the same as <code>node_modules</code> on the server.</strong> 786 entries went across. Packages with native code compile against the machine that installed them: build on macOS and deploy to Linux, or build on Alpine and run on Debian, and the binary is for the wrong platform. This is exactly the shape of the outage in this repository's own history — a Prisma engine built for glibc inside a musl image, which passed every check and then restart-looped for seven minutes. Install dependencies <em>on the target</em>, or inside an image built for it. Never copy them from a developer machine.</div>

<h3>Four categories, and where each belongs</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Source — committed, and it ships</span><span class="lz-lnote">Your code, templates, migrations, package manifests and lockfiles. This is the artifact. Everything else on this list is not.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Derived — rebuilt, never copied</span><span class="lz-lnote"><code>node_modules</code>, <code>dist</code>, <code>.next</code>, compiled assets. Produced <em>from</em> source by a build step that must run on the target platform. Lesson 1.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Runtime state — lives on the server, deploy must not touch it</span><span class="lz-lnote">Uploads, logs, caches, a SQLite file. It belongs outside the release directory entirely, in the <code>chung/</code> directory from Lesson 0.4, symlinked in.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Configuration — server-side, and never in the artifact</span><span class="lz-lnote"><code>.env</code>, certificates, keys. Same destination as runtime state and for a stronger reason. Chapter 4.</span></div>
</div>
<div class="callout ok"><strong>The test is a question, not a list.</strong> For each path: <em>if this were deleted on the server, would I lose anything?</em> Source — no, it comes from git. Derived — no, rebuild it. Runtime state — <strong>yes</strong>, it is gone forever. Configuration — <strong>yes</strong>, and the site stops. Anything you answered "yes" for must not be inside the thing a deploy overwrites.</div>

<h3>Two exclusion lists that are not the same list</h3>
<p>A common mistake is to assume <code>.gitignore</code> protects the deploy. It does not — it governs what git tracks, and a raw <code>rsync</code> or <code>tar</code> never consults it. Something ignored by git is exactly the kind of thing most dangerous to ship, because nobody has ever reviewed it.</p>
<pre><code><span class="tok-comment"># .gitignore — cai gi KHONG vao kho ma</span>
node_modules/
dist/
.env
tai-len/
logs/

<span class="tok-comment"># deploy: cai gi khong len may chu — PHAI khai RIENG</span>
rsync -az --delete \\
  --exclude '.git' --exclude 'node_modules' --exclude '.env' \\
  --exclude 'tai-len' --exclude 'logs' --exclude '*.orig' \\
  ./ vps:/srv/app/</code></pre>
<div class="pitfall"><strong>Trap — an exclude list is a list you maintain, and therefore a list you forget.</strong> Add a <code>.cache/</code> directory next month and it ships. Add <code>.env.production</code> and it ships. Every deploy is a chance to have missed one, and nothing tells you. This is why the rest of this chapter builds the artifact from what is <em>included</em> — <code>git archive</code> starts from nothing and adds only committed files, so a new directory is excluded by default rather than by memory.</div>
<p>If you must use rsync, at least make the two lists one list: <code>rsync --exclude-from=.gitignore</code> reuses what you already maintain. It is not a perfect translation — rsync's pattern syntax overlaps with git's rather than matching it — but one list that is sometimes imprecise beats two lists that drift apart.</p>

<h3>A five-minute audit of your own project</h3>
<pre><code><span class="tok-comment"># 1. Cai gi to nhat trong cay lam viec?</span>
du -sh --exclude=.git . &amp;&amp; du -sh */ | sort -rh | head -10

<span class="tok-comment"># 2. Nhung tep nao KHONG duoc git theo doi? (day la danh sach dang ngo)</span>
git status --porcelain --ignored | grep '^!!'

<span class="tok-comment"># 3. Co bi mat nao trong cay khong?</span>
find . -name '.env*' -not -path './.git/*'

<span class="tok-comment"># 4. Tao tac se trong nhu the nao?</span>
git archive --format=tar HEAD | tar t | head -20</code></pre>
<div class="note-ct">Step 2 is the one that finds surprises. <code>git status --porcelain --ignored</code> lists everything git is deliberately not looking at, which is precisely the set nobody reviews — old branches of a build directory, a database dump from a debugging session, a <code>.env.old</code> from a migration two years ago. Run it once on a project you have had for a while; the output is usually longer than expected.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">gitignore(5)</span><span class="lc-sub">git-scm.com/docs/gitignore — pattern rules, and the precedence order that explains why a rule you added is not taking effect.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — FILTER RULES</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — how <code>--exclude</code> patterns are matched, and why they are not identical to gitignore patterns.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — what git tracks and what it ignores</span><span class="lc-sub">/courses/git/learn${REF} — the mechanism behind the <code>--ignored</code> audit above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — why a native module built on your laptop breaks in the image</span><span class="lc-sub">/courses/docker/learn${REF} — the glibc-versus-musl failure named in the pitfall, measured end to end.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Trong cây làm việc của bạn thật ra có gì</h2>
<p class="lead">"Deploy cái dự án" nghe như thể nó gọi tên một tập hợp tệp. Không phải vậy. Cái thư mục bạn làm việc chứa vài LOẠI thứ khác nhau, và chỉ một loại trong đó thuộc về máy chủ — rắc rối là mấy loại kia thì lớn hơn, và một trong số đó đang giữ mật khẩu production của bạn.</p>

<h3>Một cây làm việc thật, đo thật</h3>
<div class="out">=== cay lam viec THAT ===
  tong: 3.8M
    node_modules     3.1M  (780 tep)
    dist             200K  (1 tep)
    logs             8.0K  (1 tep)
    tai-len          300K  (1 tep)
    src              172K  (42 tep)
  .env: 96 byte — CHUA BI MAT

=== git archive gui di bao nhieu? ===
  git archive: 84K  (43 muc)
=== rsync tho (khong loai tru gi) gui di bao nhieu? ===
  ca cay:      1.4M  (839 muc)</div>
<p>Tám mươi tư kilobyte mã nguồn, nằm trong một thư mục 3,8 MB. Cái gói ngây thơ lớn gấp mười sáu lần cái tạo tác, và phần nặng thêm đó chưa phải chỗ đáng chú ý.</p>

<h3>Cái gói ngây thơ đó chứa những gì</h3>
<div class="out">=== .env co nam trong goi khong? ===
  tar tho:     1 lan xuat hien
  git archive: 0 lan xuat hien
  → noi dung .env trong goi tho:
      DATABASE_URL=postgres://user:sieubimat@db:5432/app
      JWT_SECRET=khoa-that-su-bi-mat-khong-duoc-lo

=== con tep nguoi dung tai len va log? ===
  tai-len/           tar tho: 2    | git archive: 0
  logs/              tar tho: 2    | git archive: 0
  node_modules/      tar tho: 786  | git archive: 0
  server.js.orig     tar tho: 1    | git archive: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bí mật, phơi ra rõ ràng</span><span class="v">Mật khẩu cơ sở dữ liệu và khoá ký JWT, rút thẳng ra từ tệp nén. Gửi chúng lên chính máy chủ của bạn thì bản thân nó chưa phải một vụ rò rỉ — vấn đề là cái <em>TẠO TÁC</em> bây giờ chứa chúng, mà tạo tác thì bị chép đi khắp nơi: vào cache của CI, vào log dựng, vào một registry, vào laptop của ai đó, vào một bản sao lưu.</span></div>
  <div class="kv"><span class="k">Tệ hơn: nó GHI ĐÈ cấu hình của máy chủ</span><span class="v"><code>.env</code> ở máy bạn trỏ vào cơ sở dữ liệu phát triển. Deploy nó đè lên <code>.env</code> của máy chủ là trỏ production vào thiết lập trên laptop của bạn — hoặc vào hư không. Đây đúng là hình dạng hỏng của ca C ở Bài 0.3, chỉ là tới bằng một con đường khác.</span></div>
  <div class="kv"><span class="k">Tệp người dùng tải lên, đi NGƯỢC</span><span class="v">Những tệp người dùng đặt lên máy chủ, bị ghi đè bằng bất cứ thứ gì tình cờ nằm trong <code>tai-len/</code> ở máy bạn — mà thứ đó thường là vài tấm ảnh thử từ ba tháng trước. Kèm <code>rsync --delete</code> thì những tệp không có trong bản sao ở máy bạn bị XOÁ THẲNG.</span></div>
  <div class="kv"><span class="k">Một bản sao lưu của trình soạn thảo</span><span class="v"><code>server.js.orig</code> cũng đi theo. Ở đây thì vô hại; không vô hại khi nó là <code>config.php.bak</code> trên một máy chủ chỉ thực thi <code>.php</code>, và giờ nó phục vụ cái bản sao lưu đó dưới dạng văn bản thuần cho bất cứ ai đoán trúng tên.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — <code>node_modules</code> trên laptop của bạn KHÔNG giống <code>node_modules</code> trên máy chủ.</strong> 786 mục đã đi qua. Những gói có mã native được biên dịch theo đúng cái máy đã cài chúng: dựng trên macOS rồi deploy lên Linux, hay dựng trên Alpine rồi chạy trên Debian, thì cái nhị phân đó dành cho nền tảng SAI. Đây chính xác là hình dạng của sự cố trong lịch sử kho mã này — một engine Prisma dựng cho glibc nằm trong ảnh musl, qua sạch mọi phép kiểm rồi restart vô tận suốt bảy phút. Hãy cài phụ thuộc <em>TRÊN MÁY ĐÍCH</em>, hoặc bên trong một cái ảnh dựng cho nó. Đừng bao giờ chép chúng từ máy của lập trình viên.</div>

<h3>Bốn loại, và mỗi loại thuộc về đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Nguồn — đã commit, và nó ĐI</span><span class="lz-lnote">Mã của bạn, template, migration, tệp khai báo gói và tệp khoá phiên bản. Đây MỚI là tạo tác. Mọi thứ khác trong danh sách này thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Dẫn xuất — dựng lại, không bao giờ chép</span><span class="lz-lnote"><code>node_modules</code>, <code>dist</code>, <code>.next</code>, tài nguyên đã biên dịch. Sinh ra <em>TỪ</em> mã nguồn bằng một bước dựng, mà bước dựng đó phải chạy trên nền tảng đích. Bài 1.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Trạng thái lúc chạy — sống trên máy chủ, deploy KHÔNG được đụng</span><span class="lz-lnote">Tệp tải lên, log, cache, một tệp SQLite. Nó thuộc về bên NGOÀI thư mục bản phát hành hẳn, nằm trong thư mục <code>chung/</code> ở Bài 0.4, rồi liên kết mềm vào.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Cấu hình — phía máy chủ, và KHÔNG BAO GIỜ nằm trong tạo tác</span><span class="lz-lnote"><code>.env</code>, chứng chỉ, khoá. Cùng đích đến với trạng thái lúc chạy và vì một lý do còn mạnh hơn. Chương 4.</span></div>
</div>
<div class="callout ok"><strong>Phép thử là một CÂU HỎI, không phải một danh sách.</strong> Với từng đường dẫn: <em>nếu cái này bị xoá trên máy chủ, tôi có mất gì không?</em> Mã nguồn — không, nó tới từ git. Dẫn xuất — không, dựng lại thôi. Trạng thái lúc chạy — <strong>CÓ</strong>, nó mất vĩnh viễn. Cấu hình — <strong>CÓ</strong>, và website dừng luôn. Bất cứ thứ gì bạn trả lời "có" đều KHÔNG được nằm bên trong cái mà một lần deploy sẽ ghi đè.</div>

<h3>Hai danh sách loại trừ, và chúng KHÔNG phải một</h3>
<p>Một hiểu nhầm thường gặp là tưởng <code>.gitignore</code> bảo vệ được lần deploy. Không hề — nó chi phối việc git THEO DÕI cái gì, còn một lệnh <code>rsync</code> hay <code>tar</code> thô thì chẳng bao giờ ngó tới nó. Thứ bị git bỏ qua lại đúng là loại thứ nguy hiểm nhất khi gửi đi, vì chưa từng có ai xem lại nó.</p>
<pre><code><span class="tok-comment"># .gitignore — cai gi KHONG vao kho ma</span>
node_modules/
dist/
.env
tai-len/
logs/

<span class="tok-comment"># deploy: cai gi khong len may chu — PHAI khai RIENG</span>
rsync -az --delete \\
  --exclude '.git' --exclude 'node_modules' --exclude '.env' \\
  --exclude 'tai-len' --exclude 'logs' --exclude '*.orig' \\
  ./ vps:/srv/app/</code></pre>
<div class="pitfall"><strong>Bẫy — danh sách loại trừ là danh sách bạn phải BẢO TRÌ, và do đó là danh sách bạn sẽ QUÊN.</strong> Tháng sau thêm một thư mục <code>.cache/</code> là nó đi theo. Thêm <code>.env.production</code> là nó đi theo. Mỗi lần deploy là một cơ hội để sót một mục, và chẳng có gì báo cho bạn. Đó là lý do phần còn lại của chương này dựng tạo tác từ những thứ được <em>BAO GỒM</em> — <code>git archive</code> khởi đầu từ số không rồi chỉ thêm vào những tệp đã commit, nên một thư mục mới bị loại trừ theo MẶC ĐỊNH chứ không theo TRÍ NHỚ.</div>
<p>Nếu buộc phải dùng rsync thì ít nhất hãy gộp hai danh sách thành một: <code>rsync --exclude-from=.gitignore</code> tái dùng đúng cái bạn vốn đã bảo trì. Nó không phải bản dịch hoàn hảo — cú pháp mẫu của rsync chỉ GIAO NHAU với của git chứ không trùng khớp — nhưng một danh sách đôi khi thiếu chính xác vẫn hơn hai danh sách trôi dạt khỏi nhau.</p>

<h3>Một cuộc kiểm kê năm phút cho chính dự án của bạn</h3>
<pre><code><span class="tok-comment"># 1. Cai gi to nhat trong cay lam viec?</span>
du -sh --exclude=.git . &amp;&amp; du -sh */ | sort -rh | head -10

<span class="tok-comment"># 2. Nhung tep nao KHONG duoc git theo doi? (day la danh sach dang ngo)</span>
git status --porcelain --ignored | grep '^!!'

<span class="tok-comment"># 3. Co bi mat nao trong cay khong?</span>
find . -name '.env*' -not -path './.git/*'

<span class="tok-comment"># 4. Tao tac se trong nhu the nao?</span>
git archive --format=tar HEAD | tar t | head -20</code></pre>
<div class="note-ct">Bước 2 mới là bước tìm ra bất ngờ. <code>git status --porcelain --ignored</code> liệt kê mọi thứ mà git đang CỐ Ý không nhìn tới, mà đó chính xác là tập hợp chẳng ai xem lại — mấy nhánh cũ của một thư mục dựng, một bản trút cơ sở dữ liệu từ một buổi gỡ lỗi, một tệp <code>.env.old</code> từ một lần chuyển đổi hai năm trước. Chạy nó một lần trên một dự án bạn đã giữ lâu; kết quả in ra thường dài hơn bạn tưởng.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">gitignore(5)</span><span class="lc-sub">git-scm.com/docs/gitignore — luật viết mẫu, và thứ tự ưu tiên giải thích vì sao một luật bạn vừa thêm lại không có tác dụng.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — mục FILTER RULES</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — các mẫu <code>--exclude</code> được khớp thế nào, và vì sao chúng không giống hệt mẫu của gitignore.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — git theo dõi cái gì và bỏ qua cái gì</span><span class="lc-sub">/courses/git/learn${REF} — cơ chế nằm sau cuộc kiểm kê <code>--ignored</code> ở trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — vì sao một module native dựng trên laptop lại vỡ trong ảnh</span><span class="lc-sub">/courses/docker/learn${REF} — cái sự cố glibc-so-với-musl nêu trong hộp bẫy, đo từ đầu tới cuối.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Building an artifact you can reproduce|||1.2 — Dựng một tạo tác tái lập được',
      slug: 'deploy-1-2-tao-tac-tai-lap-duoc',
      type: 'LESSON',
      description: 'Cùng một commit, dựng hai lần, có ra đúng cùng những byte không? Đo thật — và câu trả lời phụ thuộc vào bốn byte trong header gzip, thứ có mặt hay không tuỳ theo bạn nén một TỆP hay nén một ỐNG DẪN.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Building an artifact you can reproduce</h2>
<p class="lead">An artifact should be a function of a commit: the same input gives the same output, every time, on any machine. When it is, you can compare a checksum and know whether two servers are running the same thing. When it is not, "the same version" is a claim you cannot check.</p>

<h3>Start from included, not excluded</h3>
<p>Lesson 1.1 ended with the argument: an exclude list is a list you forget. <code>git archive</code> inverts it — it starts from nothing and writes exactly the files at one commit:</p>
<pre><code><span class="tok-comment"># tep nen cua DUNG mot commit — khong .git, khong thu chua commit</span>
git archive --format=tar HEAD | gzip &gt; ban-phat-hanh.tar.gz

<span class="tok-comment"># mot the, mot nhanh, hay mot commit bat ky deu duoc</span>
git archive --format=tar v2.1.0 | gzip &gt; v2.1.0.tar.gz

<span class="tok-comment"># them mot thu muc goc, de giai nen khong vai tep ra khap noi</span>
git archive --format=tar --prefix=app/ HEAD | gzip &gt; app.tar.gz

<span class="tok-comment"># xem TRUOC no chua gi, ma khong tao tep nao</span>
git archive --format=tar HEAD | tar t</code></pre>
<div class="callout ok"><strong>A new directory is excluded by default.</strong> Add <code>.cache/</code> to your project tomorrow and it is not in the artifact — not because you remembered, but because you did not <code>git add</code> it. That is the whole reason to prefer this shape over an exclude list, and it does not degrade over the life of the project.</div>

<h3>Trimming further, from inside the repository</h3>
<p>Some committed files belong in the repository but not on a server: tests, CI configuration, design documents, fixtures. <code>.gitattributes</code> marks them:</p>
<pre><code><span class="tok-comment"># .gitattributes</span>
tests/          export-ignore
.github/        export-ignore
docs/           export-ignore
*.test.js       export-ignore
.editorconfig   export-ignore</code></pre>
<p>Measured on the test project, with a rule matching most of its source files:</p>
<div class="out">=== .gitattributes export-ignore ===
  truoc: 43 muc, 84K
  sau:    4 muc, 4.0K</div>
<div class="note-ct">This lives in the repository, next to the code, and is version-controlled with it — so unlike a deploy script's exclude list, it is reviewed when it changes and it travels with a clone. One warning: <code>export-ignore</code> affects <code>git archive</code> only. A <code>git clone</code> or a <code>git pull</code> deploy still gets everything, so if you deploy that way the rules are decoration.</div>

<h3>Is it reproducible? Measured</h3>
<p>Two archives of the same commit, made a second apart:</p>
<div class="out">=== git archive CUNG mot commit, hai lan ===
  tar lan 1: 318b4c3400cb12ef107bcfacbbad5a77
  tar lan 2: 318b4c3400cb12ef107bcfacbbad5a77
  → GIONG HET (tai lap duoc)</div>
<p>Identical. <code>git archive</code> takes file contents, modes and paths from the commit object itself, and the timestamp it stamps into the tar headers is the <em>commit</em> time, not the current time. Nothing about the machine or the moment leaks in.</p>
<p>Then the same thing, compressed:</p>
<div class="out">=== nhung neu NEN bang gzip thi sao? ===
  gzip lan 1: 6233c48fbade3246cbbf3f8957c35393
  gzip lan 2: 6233c48fbade3246cbbf3f8957c35393
  → GIONG HET</div>
<p>Also identical — which contradicts the widely repeated claim that gzip output is never reproducible because it embeds a timestamp. The claim is half true, and the missing half is <em>when</em>:</p>
<div class="out">=== gzip doc tu ONG DAN (stdin) — truong dau thoi gian trong header ===
  g1.tgz    byte 5-8 = 00 00 00 00
  n1.tgz    byte 5-8 = 00 00 00 00

=== nhung nen mot TEP CO TEN thi sao? ===
  lan 1: d6d9b9c9f32c7611607dc2b7c15ea66e   byte 5-8 = 41 52 8b 6a
  lan 2: 4ebac2094b1addb8e0832fe7fb5e37f6   byte 5-8 = 43 52 8b 6a
  → KHAC NHAU: cung mot noi dung, hai ma bam khac nhau</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bytes 5–8 of a gzip file are MTIME</span><span class="v">A 32-bit modification time, defined in RFC 1952. Reading from a pipe, gzip has no file to take a time from, so it writes four zero bytes — and the output is reproducible.</span></div>
  <div class="kv"><span class="k">Compressing a named file records its mtime</span><span class="v"><code>41 52 8b 6a</code> against <code>43 52 8b 6a</code> — two seconds apart, in the third byte. Same content, different checksum, and nothing else about the file changed.</span></div>
  <div class="kv"><span class="k">The fix is <code>gzip -n</code></span><span class="v">Do not store the name or the timestamp. Harmless, and it makes the named-file case behave like the pipe case.</span></div>
  <div class="kv"><span class="k">Four bytes out of 84 KB</span><span class="v">Enough to make two identical artifacts look different to every tool that compares checksums — including the one deciding whether it needs to re-upload.</span></div>
</div>
<div class="pitfall"><strong>Trap — a checksum that changes for no reason breaks the things built on top of it.</strong> A deploy that skips the upload when the hash matches will re-upload every time. A registry that deduplicates by digest will store a new copy of identical content on each build. And an alert on "the artifact changed unexpectedly" becomes noise, so it gets turned off, so a real change goes unnoticed. Use <code>gzip -n</code>, or compress from a pipe, and the problem does not arise.</div>

<h3>The recipe</h3>
<pre><code><span class="tok-comment">#!/bin/bash</span>
set -euo pipefail

COMMIT=\$(git rev-parse --short HEAD)
TEN="app-\${COMMIT}.tar.gz"

<span class="tok-comment"># tu choi dung khi cay lam viec con ban — xem hop duoi</span>
if [ -n "\$(git status --porcelain)" ]; then
  echo "Cay lam viec con thay doi chua commit. Dung." &gt;&amp;2; exit 1
fi

git archive --format=tar --prefix=app/ HEAD | gzip -n &gt; "\$TEN"
sha256sum "\$TEN" | tee "\${TEN}.sha256"</code></pre>
<div class="callout warn"><strong>The dirty-tree check is the point of the script.</strong> Without it, the artifact is named after a commit whose contents it does not contain — the name says <code>a3f1c9</code> while the file holds <code>a3f1c9</code> plus whatever you have not committed. Every later question ("which version is on the server?", "does staging match production?") is then answered with a value that is quietly wrong. The deploy script in this repository asks <code>[y/N]</code> in this situation, and answering yes means those changes do <em>not</em> reach production — which is correct, and surprises people who expected the opposite.</div>

<h3>What reproducibility buys you</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">"Are these two servers running the same code?"</span><span class="lz-d">Becomes one command on each: compare the checksum of the deployed artifact. Without reproducibility you can only compare version <em>labels</em>, which is comparing what someone typed.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">"Did this artifact change since I tested it?"</span><span class="lz-d">The checksum tested in staging and the checksum deployed to production are either equal or they are not. This is the only mechanical answer to "but it worked in staging".</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Uploads and storage stop duplicating</span><span class="lz-d">Content-addressed transports — a registry, an object store with deduplication, <code>rsync</code> comparing checksums — all do less work when identical input produces identical output.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tampering becomes visible</span><span class="lz-d">A published checksum next to the artifact lets anyone verify what they received. It is not a signature and does not prove origin, but it does turn silent corruption into a loud mismatch.</span></div>
</div>
<div class="note-ct">Full reproducibility ends where the build begins. <code>git archive</code> is deterministic because it only copies; the moment a step compiles, bundles or installs dependencies, timestamps, absolute paths and dependency resolution can all leak into the output. Lesson 1.3 is about that step — and about the lockfile, which is the closest thing to determinism available there.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 1952 — GZIP file format, section 2.3.1</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc1952#section-2.3 — the MTIME field, and the sentence saying it may be zero when there is no timestamp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">gitattributes(5) — export-ignore</span><span class="lc-sub">git-scm.com/docs/gitattributes#_creating_an_archive — the attribute, and the note that it applies to archives only.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">reproducible-builds.org</span><span class="lc-sub">reproducible-builds.org/docs — the general problem, including the list of things that commonly leak into a build: timestamps, paths, locale, build IDs.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — commits, tags and rev-parse</span><span class="lc-sub">/courses/git/learn${REF} — where the identifier in the artifact name comes from, and why the short hash is enough.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Dựng một tạo tác tái lập được</h2>
<p class="lead">Một tạo tác nên là một HÀM của một commit: cùng đầu vào cho cùng đầu ra, mọi lần, trên mọi máy. Khi nó như vậy, bạn so một mã băm là biết ngay hai máy chủ có đang chạy cùng một thứ hay không. Khi nó không như vậy thì "cùng một phiên bản" là một lời khẳng định bạn không kiểm được.</p>

<h3>Khởi đầu từ thứ ĐƯỢC BAO GỒM, không phải thứ bị loại trừ</h3>
<p>Bài 1.1 kết thúc bằng lý lẽ: danh sách loại trừ là danh sách bạn sẽ quên. <code>git archive</code> lật ngược nó lại — nó khởi đầu từ số không rồi viết ra ĐÚNG những tệp tại một commit:</p>
<pre><code><span class="tok-comment"># tep nen cua DUNG mot commit — khong .git, khong thu chua commit</span>
git archive --format=tar HEAD | gzip &gt; ban-phat-hanh.tar.gz

<span class="tok-comment"># mot the, mot nhanh, hay mot commit bat ky deu duoc</span>
git archive --format=tar v2.1.0 | gzip &gt; v2.1.0.tar.gz

<span class="tok-comment"># them mot thu muc goc, de giai nen khong vai tep ra khap noi</span>
git archive --format=tar --prefix=app/ HEAD | gzip &gt; app.tar.gz

<span class="tok-comment"># xem TRUOC no chua gi, ma khong tao tep nao</span>
git archive --format=tar HEAD | tar t</code></pre>
<div class="callout ok"><strong>Một thư mục mới bị loại trừ theo MẶC ĐỊNH.</strong> Mai bạn thêm <code>.cache/</code> vào dự án thì nó không nằm trong tạo tác — không phải vì bạn NHỚ, mà vì bạn đã không <code>git add</code> nó. Đó là toàn bộ lý do nên chọn hình dạng này thay vì một danh sách loại trừ, và nó không xuống cấp theo tuổi đời dự án.</div>

<h3>Cắt tiếp, từ bên trong chính kho mã</h3>
<p>Một số tệp đã commit thì thuộc về kho mã nhưng không thuộc về máy chủ: bài kiểm thử, cấu hình CI, tài liệu thiết kế, dữ liệu mẫu. <code>.gitattributes</code> đánh dấu chúng:</p>
<pre><code><span class="tok-comment"># .gitattributes</span>
tests/          export-ignore
.github/        export-ignore
docs/           export-ignore
*.test.js       export-ignore
.editorconfig   export-ignore</code></pre>
<p>Đo trên dự án thử, với một luật khớp phần lớn tệp nguồn của nó:</p>
<div class="out">=== .gitattributes export-ignore ===
  truoc: 43 muc, 84K
  sau:    4 muc, 4.0K</div>
<div class="note-ct">Tệp này sống trong kho mã, nằm cạnh mã, và được quản lý phiên bản cùng với mã — nên khác với danh sách loại trừ nằm trong script deploy, nó ĐƯỢC REVIEW khi thay đổi và nó đi theo mỗi lần clone. Một lời cảnh báo: <code>export-ignore</code> chỉ tác động tới <code>git archive</code>. Một lần deploy bằng <code>git clone</code> hay <code>git pull</code> vẫn lấy về đủ mọi thứ, nên nếu bạn deploy theo cách đó thì mấy luật này chỉ là đồ trang trí.</div>

<h3>Nó có tái lập được không? Đo thật</h3>
<p>Hai bản nén của cùng một commit, cách nhau một giây:</p>
<div class="out">=== git archive CUNG mot commit, hai lan ===
  tar lan 1: 318b4c3400cb12ef107bcfacbbad5a77
  tar lan 2: 318b4c3400cb12ef107bcfacbbad5a77
  → GIONG HET (tai lap duoc)</div>
<p>Giống hệt. <code>git archive</code> lấy nội dung tệp, quyền và đường dẫn từ chính đối tượng commit, và cái dấu thời gian nó đóng vào header tar là thời gian của <em>COMMIT</em>, không phải thời gian hiện tại. Không có gì thuộc về cái máy hay cái khoảnh khắc rò rỉ vào.</p>
<p>Rồi vẫn thứ đó, nhưng đã nén:</p>
<div class="out">=== nhung neu NEN bang gzip thi sao? ===
  gzip lan 1: 6233c48fbade3246cbbf3f8957c35393
  gzip lan 2: 6233c48fbade3246cbbf3f8957c35393
  → GIONG HET</div>
<p>Cũng giống hệt — điều này MÂU THUẪN với lời khẳng định được nhắc đi nhắc lại rằng kết quả gzip không bao giờ tái lập được vì nó nhúng một dấu thời gian. Lời khẳng định đó đúng một nửa, và cái nửa còn thiếu là chữ <em>KHI NÀO</em>:</p>
<div class="out">=== gzip doc tu ONG DAN (stdin) — truong dau thoi gian trong header ===
  g1.tgz    byte 5-8 = 00 00 00 00
  n1.tgz    byte 5-8 = 00 00 00 00

=== nhung nen mot TEP CO TEN thi sao? ===
  lan 1: d6d9b9c9f32c7611607dc2b7c15ea66e   byte 5-8 = 41 52 8b 6a
  lan 2: 4ebac2094b1addb8e0832fe7fb5e37f6   byte 5-8 = 43 52 8b 6a
  → KHAC NHAU: cung mot noi dung, hai ma bam khac nhau</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Byte 5–8 của một tệp gzip là MTIME</span><span class="v">Một dấu thời gian 32 bit, định nghĩa trong RFC 1952. Khi đọc từ một ống dẫn, gzip chẳng có tệp nào để lấy thời gian, nên nó ghi bốn byte không — và kết quả tái lập được.</span></div>
  <div class="kv"><span class="k">Nén một tệp CÓ TÊN thì nó ghi lại mtime của tệp đó</span><span class="v"><code>41 52 8b 6a</code> so với <code>43 52 8b 6a</code> — cách nhau hai giây, ở byte thứ ba. Cùng nội dung, khác mã băm, và chẳng có gì khác về cái tệp thay đổi cả.</span></div>
  <div class="kv"><span class="k">Cách sửa là <code>gzip -n</code></span><span class="v">Đừng lưu tên lẫn dấu thời gian. Vô hại, và nó làm cho trường hợp tệp-có-tên cư xử y như trường hợp ống dẫn.</span></div>
  <div class="kv"><span class="k">Bốn byte trên tổng 84 KB</span><span class="v">Đủ để hai tạo tác giống hệt nhau trông như khác nhau với MỌI công cụ so sánh mã băm — kể cả cái công cụ đang quyết định xem có cần tải lên lại hay không.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một mã băm đổi mà chẳng vì lý do gì sẽ phá vỡ những thứ dựng trên nó.</strong> Một quy trình deploy bỏ qua bước tải lên khi mã băm khớp thì sẽ tải lên LẠI mọi lần. Một registry khử trùng lặp theo digest thì sẽ lưu một bản mới của nội dung y hệt sau mỗi lần dựng. Và một cảnh báo kiểu "tạo tác đã đổi ngoài dự kiến" thì trở thành tiếng ồn, nên nó bị tắt đi, nên một thay đổi THẬT sẽ đi qua mà không ai thấy. Hãy dùng <code>gzip -n</code>, hoặc nén từ một ống dẫn, thì vấn đề không phát sinh.</div>

<h3>Công thức</h3>
<pre><code><span class="tok-comment">#!/bin/bash</span>
set -euo pipefail

COMMIT=\$(git rev-parse --short HEAD)
TEN="app-\${COMMIT}.tar.gz"

<span class="tok-comment"># tu choi dung khi cay lam viec con ban — xem hop duoi</span>
if [ -n "\$(git status --porcelain)" ]; then
  echo "Cay lam viec con thay doi chua commit. Dung." &gt;&amp;2; exit 1
fi

git archive --format=tar --prefix=app/ HEAD | gzip -n &gt; "\$TEN"
sha256sum "\$TEN" | tee "\${TEN}.sha256"</code></pre>
<div class="callout warn"><strong>Phép kiểm cây-còn-bẩn mới là điểm mấu chốt của cái script.</strong> Thiếu nó thì tạo tác mang tên một commit mà nội dung của nó KHÔNG phải commit ấy — cái tên nói <code>a3f1c9</code> trong khi tệp chứa <code>a3f1c9</code> cộng thêm bất cứ thứ gì bạn chưa commit. Mọi câu hỏi về sau ("máy chủ đang chạy phiên bản nào?", "staging có khớp production không?") đều được trả lời bằng một giá trị SAI một cách lặng lẽ. Script deploy trong kho mã này hỏi <code>[y/N]</code> đúng trong tình huống đó, và trả lời có nghĩa là những thay đổi ấy <em>KHÔNG</em> lên tới production — điều đó là ĐÚNG, và làm người ta bất ngờ vì họ tưởng ngược lại.</div>

<h3>Tái lập được thì mua được cái gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">"Hai máy chủ này có chạy cùng một mã không?"</span><span class="lz-d">Trở thành một lệnh trên mỗi máy: so mã băm của tạo tác đã deploy. Không có tính tái lập thì bạn chỉ so được cái NHÃN phiên bản, tức là so cái mà ai đó đã gõ vào.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">"Tạo tác này có đổi kể từ lúc tôi kiểm thử không?"</span><span class="lz-d">Mã băm đã kiểm ở staging và mã băm đã deploy lên production thì hoặc bằng nhau hoặc không. Đây là câu trả lời MÁY MÓC duy nhất cho câu "nhưng ở staging nó chạy mà".</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Tải lên và lưu trữ thôi bị trùng lặp</span><span class="lz-d">Những đường vận chuyển định địa chỉ theo nội dung — một registry, một kho đối tượng có khử trùng lặp, <code>rsync</code> so theo mã băm — đều làm ít việc hơn khi đầu vào giống nhau cho ra đầu ra giống nhau.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Việc bị sửa đổi trở nên NHÌN THẤY ĐƯỢC</span><span class="lz-d">Một mã băm công bố kèm tạo tác cho phép bất cứ ai kiểm lại thứ họ nhận được. Nó không phải chữ ký và không chứng minh nguồn gốc, nhưng nó biến một cú hỏng dữ liệu âm thầm thành một cú lệch mã băm ầm ĩ.</span></div>
</div>
<div class="note-ct">Tính tái lập trọn vẹn kết thúc ở chỗ bước DỰNG bắt đầu. <code>git archive</code> tất định vì nó chỉ CHÉP; ngay khi một bước biên dịch, đóng gói hay cài phụ thuộc, thì dấu thời gian, đường dẫn tuyệt đối và cách giải phụ thuộc đều có thể rò rỉ vào kết quả. Bài 1.3 nói về đúng cái bước ấy — và về tệp khoá phiên bản, thứ gần với tính tất định nhất mà bạn có được ở đó.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 1952 — Định dạng tệp GZIP, mục 2.3.1</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc1952#section-2.3 — trường MTIME, và đúng cái câu nói rằng nó CÓ THỂ bằng không khi không có dấu thời gian nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">gitattributes(5) — export-ignore</span><span class="lc-sub">git-scm.com/docs/gitattributes#_creating_an_archive — thuộc tính này, kèm ghi chú rằng nó CHỈ áp cho archive.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">reproducible-builds.org</span><span class="lc-sub">reproducible-builds.org/docs — bài toán tổng quát, kèm danh sách những thứ hay rò rỉ vào một bản dựng: dấu thời gian, đường dẫn, ngôn ngữ hệ thống, mã định danh bản dựng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub — commit, tag và rev-parse</span><span class="lc-sub">/courses/git/learn${REF} — cái định danh trong tên tạo tác tới từ đâu, và vì sao mã băm ngắn là đủ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — When the artifact must be built|||1.3 — Khi tạo tác phải được DỰNG',
      slug: 'deploy-1-3-tao-tac-phai-dung',
      type: 'LESSON',
      description: 'npm ci và npm install trông như hai cách gõ cùng một việc. Đo trên một mâu thuẫn thật: một cái từ chối và trả mã thoát 1; cái kia âm thầm cài phiên bản KHÁC rồi ghi lại luôn tệp khoá — và trả 0.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>When the artifact must be built</h2>
<p class="lead"><code>git archive</code> is deterministic because it only copies. Real projects need a build — dependencies installed, TypeScript compiled, assets bundled — and every one of those steps is a place where the output can stop being a function of the input. This lesson measures the largest of them.</p>

<h3>Two commands that are not the same command</h3>
<p>A project whose <code>package.json</code> asks for <code>semver ^6.0.0</code> while its lockfile pins <code>7.8.5</code> — the state you get when someone edits a version by hand, or when a merge takes <code>package.json</code> from one branch and the lockfile from another.</p>
<div class="out">── npm ci gap mau thuan ──
  npm error code EUSAGE
  npm error &#96;npm ci&#96; can only install packages when your package.json and
  npm error package-lock.json are in sync.
  npm error Invalid: lock file's semver@7.8.5 does not satisfy semver@6.3.1
  → ma thoat: 1

── npm install gap mau thuan ──
  changed 1 package in 378ms
  semver da cai: 6.3.1
  lock co bi GHI LAI khong: CO — lock vua bi doi
  → ma thoat: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>npm ci</code> refuses</span><span class="v">Names the exact conflict and exits <strong>1</strong>. In a deploy script with <code>set -e</code>, that stops the deploy before anything is swapped.</span></div>
  <div class="kv"><span class="k"><code>npm install</code> resolves it</span><span class="v">Silently installs a <em>different major version</em>, rewrites <code>package-lock.json</code> to match, and exits <strong>0</strong>. The deploy continues and reports success.</span></div>
  <div class="kv"><span class="k">The version you tested is not the version you shipped</span><span class="v">Testing happened against 7.8.5. Production got 6.3.1 — a different major, so a different API. Nothing in the deploy output says so.</span></div>
  <div class="kv"><span class="k">And the lockfile is now wrong on the server</span><span class="v">Rewritten inside the release directory, where nobody will look, and thrown away at the next deploy. The next machine resolves it independently and may land somewhere else again.</span></div>
</div>
<div class="callout warn"><strong>Use <code>npm ci</code> on a server. Always.</strong> The name is for "clean install", not "continuous integration" — it deletes <code>node_modules</code> and installs exactly the lockfile, or it fails. That is precisely the behaviour a deploy wants: no resolution, no negotiation, no writing anything back. <code>npm install</code> is a development command; its job is to <em>change</em> the lockfile, which is the last thing that should happen during a deploy. The equivalents elsewhere: <code>yarn install --frozen-lockfile</code>, <code>pnpm install --frozen-lockfile</code>, <code>composer install</code> (not <code>update</code>), <code>pip install -r requirements.txt</code> with pinned versions, <code>bundle install --deployment</code>.</div>
<div class="note-ct">On this three-package project both commands took about 370 ms, so speed is not the argument — it is often quoted as one and it does not hold at small sizes. The difference that matters is behavioural, and it does not depend on project size at all.</div>

<h3>An aside that cost me an hour: <code>set -e</code> is not always on</h3>
<p>Demonstrating the above, the obvious test was written like this — and it printed the wrong answer:</p>
<div class="out">── A) subshell nam trong mot danh sach || (viet SAI) ──
     ...DI TIEP (set -e KHONG co tac dung o day)
── B) script THAT: set -e o dau tep, lenh dung mot minh ──
     ma thoat cua script B: 1</div>
<pre><code><span class="tok-comment"># A — set -e bi VO HIEU o day</span>
( set -e; npm ci; echo "di tiep" ) || echo "dung lai"

<span class="tok-comment"># B — set -e co hieu luc</span>
set -e
npm ci
echo "di tiep"</code></pre>
<div class="pitfall"><strong>Trap — <code>set -e</code> is disabled for any command that is part of a <code>&amp;&amp;</code> or <code>||</code> list.</strong> This is documented in <code>man bash</code> and it is easy to walk into: the moment you write <code>lenh || xu-ly-loi</code>, the failure inside <code>lenh</code> no longer aborts anything — including failures several commands deep inside a subshell. In case A the failing <code>npm ci</code> was invisible and the script cheerfully continued. A deploy script full of <code>|| echo "canh bao"</code> has quietly turned off its own safety, and every step after the first failure runs against a half-built release. Chapter 7 builds a script that does not have this hole.</div>

<h3>Where the build should happen</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">On the target machine — simplest, and the default answer</span><span class="lz-d">Ship source, run <code>npm ci</code> there. Native modules compile against the machine that will run them, which removes an entire category of failure. The cost is CPU and memory on a server that may not have much of either — Chapter 8 measures a build being killed for exactly that reason.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">In an image built for the target — the container answer</span><span class="lz-d">The build runs wherever you like, but inside the same base image the server will run. The platform match is what matters, not the location. This is the path this repository uses: build at home, push to a registry, the server only swaps.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">On a build machine that matches the target — workable, with care</span><span class="lz-d">Same OS, same architecture, same libc, same runtime version. Every one of those is a thing that can drift out of sync silently, and the drift is only discovered in production.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">On your laptop, copied up — the one that breaks</span><span class="lz-d">macOS to Linux, or Alpine to Debian, and any dependency with a compiled component is now wrong. It works for pure-JavaScript projects right up until one dependency adds a native module in a patch release.</span></div>
</div>
<div class="callout"><strong>The failure this repository actually had.</strong> An image was built from the wrong Dockerfile — <code>node:22-alpine</code>, which is musl — while carrying a Prisma engine compiled for <code>debian-openssl-3.0.x</code>, which is glibc. The build was green, the push was green, the swap was green, and then the backend restart-looped and the API returned 502 for seven minutes. Nothing before production could see it, because every check up to that point was checking the <em>build</em>, and the build was fine. The lesson written afterwards was: a green build does not mean a runnable image.</div>

<h3>What a lockfile can and cannot promise</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It pins the version and the integrity hash</span><span class="lz-lnote">Same versions, same contents, verified. This is the part that works, and it is most of the value.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not pin the platform</span><span class="lz-lnote">A native module resolves to a different binary on a different OS or architecture. The lockfile is satisfied; the artifact is not portable.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not pin your runtime</span><span class="lz-lnote">Node 20 and Node 22 install the same tree and can behave differently. Pin the runtime separately — <code>engines</code>, <code>.nvmrc</code>, a base image tag — and check it in the deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not stop install scripts running</span><span class="lz-lnote"><code>postinstall</code> hooks execute arbitrary code at install time, on the server, as whoever ran the deploy. <code>npm ci --ignore-scripts</code> is worth considering, if your dependencies can live without them.</span></div>
</div>
<pre><code><span class="tok-comment"># buoc dung, tren may dich, dang toi thieu</span>
set -euo pipefail
node --version | grep -q '^v22\\.' || { echo "Sai phien ban Node" &gt;&amp;2; exit 1; }
npm ci --omit=dev --no-audit --no-fund
npm run build
<span class="tok-comment"># tao tac gio la: nguon + node_modules + dist, dung tren MAY NAY</span></code></pre>
<div class="note-ct"><code>--omit=dev</code> leaves out development dependencies, which is usually most of the tree — but only if your build does not need them. If <code>npm run build</code> needs TypeScript and TypeScript is a dev dependency, install everything, build, then prune with <code>npm prune --omit=dev</code>. Getting this backwards produces a build that fails on the server and works everywhere else.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">npm-ci — the documentation, including the differences list</span><span class="lc-sub">docs.npmjs.com/cli/commands/npm-ci — the explicit list of ways it differs from <code>npm install</code>, including that it never writes to the lockfile.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — the set -e paragraph</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#The-Set-Builtin — the sentence listing every context where <code>-e</code> does not apply. Worth reading once, carefully.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">package-lock.json — what is in it</span><span class="lc-sub">docs.npmjs.com/cli/configuring-npm/package-lock-json — the <code>integrity</code> field, and why the lockfile belongs in version control.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — building for the platform you will run on</span><span class="lc-sub">/courses/docker/learn${REF} — base images, musl versus glibc, and the multi-stage build that keeps dev dependencies out of the final image.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Khi tạo tác phải được DỰNG</h2>
<p class="lead"><code>git archive</code> tất định vì nó chỉ CHÉP. Dự án thật thì cần một bước dựng — cài phụ thuộc, biên dịch TypeScript, đóng gói tài nguyên — và mỗi bước trong số đó là một chỗ mà đầu ra có thể thôi không còn là một hàm của đầu vào. Bài này đo cái lớn nhất trong số chúng.</p>

<h3>Hai lệnh KHÔNG phải là một</h3>
<p>Một dự án mà <code>package.json</code> đòi <code>semver ^6.0.0</code> trong khi tệp khoá ghim <code>7.8.5</code> — đúng cái trạng thái bạn có khi ai đó sửa một số phiên bản bằng tay, hoặc khi một lần gộp nhánh lấy <code>package.json</code> từ nhánh này và tệp khoá từ nhánh kia.</p>
<div class="out">── npm ci gap mau thuan ──
  npm error code EUSAGE
  npm error &#96;npm ci&#96; can only install packages when your package.json and
  npm error package-lock.json are in sync.
  npm error Invalid: lock file's semver@7.8.5 does not satisfy semver@6.3.1
  → ma thoat: 1

── npm install gap mau thuan ──
  changed 1 package in 378ms
  semver da cai: 6.3.1
  lock co bi GHI LAI khong: CO — lock vua bi doi
  → ma thoat: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>npm ci</code> TỪ CHỐI</span><span class="v">Nêu đích danh chỗ mâu thuẫn rồi thoát ra <strong>1</strong>. Trong một script deploy có <code>set -e</code>, cái đó DỪNG lần deploy lại trước khi có thứ gì bị tráo.</span></div>
  <div class="kv"><span class="k"><code>npm install</code> TỰ GIẢI QUYẾT</span><span class="v">Lặng lẽ cài một <em>phiên bản major KHÁC</em>, ghi lại <code>package-lock.json</code> cho khớp, rồi thoát ra <strong>0</strong>. Lần deploy đi tiếp và báo thành công.</span></div>
  <div class="kv"><span class="k">Phiên bản bạn KIỂM THỬ không phải phiên bản bạn GỬI ĐI</span><span class="v">Việc kiểm thử diễn ra với 7.8.5. Production nhận 6.3.1 — khác major, tức là khác API. Không có gì trong kết quả deploy nói ra điều đó.</span></div>
  <div class="kv"><span class="k">Và tệp khoá trên máy chủ giờ SAI</span><span class="v">Bị ghi lại bên trong thư mục bản phát hành, nơi chẳng ai ngó tới, rồi bị vứt đi ở lần deploy kế tiếp. Máy kế tiếp lại tự giải phụ thuộc độc lập và có thể rơi vào một chỗ khác nữa.</span></div>
</div>
<div class="callout warn"><strong>Trên máy chủ thì dùng <code>npm ci</code>. Luôn luôn.</strong> Cái tên là viết tắt của "clean install", không phải "continuous integration" — nó xoá <code>node_modules</code> rồi cài ĐÚNG tệp khoá, hoặc là nó hỏng. Đó chính xác là hành vi một lần deploy cần: không giải phụ thuộc, không thương lượng, không ghi lại thứ gì. <code>npm install</code> là lệnh dành cho lúc PHÁT TRIỂN; việc của nó là <em>THAY ĐỔI</em> tệp khoá, mà đó là thứ cuối cùng nên xảy ra trong lúc deploy. Các lệnh tương đương ở nơi khác: <code>yarn install --frozen-lockfile</code>, <code>pnpm install --frozen-lockfile</code>, <code>composer install</code> (không phải <code>update</code>), <code>pip install -r requirements.txt</code> với phiên bản ghim cứng, <code>bundle install --deployment</code>.</div>
<div class="note-ct">Trên dự án ba gói này thì cả hai lệnh đều mất chừng 370 ms, nên TỐC ĐỘ không phải lý lẽ — người ta hay nêu nó ra như một lý lẽ và nó không đứng vững ở quy mô nhỏ. Khác biệt đáng kể là khác biệt về HÀNH VI, và nó chẳng phụ thuộc gì vào cỡ dự án.</div>

<h3>Một chuyện lạc đề đã lấy của tôi một giờ: <code>set -e</code> KHÔNG phải lúc nào cũng bật</h3>
<p>Trong lúc chứng minh điều trên, phép thử hiển nhiên được viết thế này — và nó in ra câu trả lời SAI:</p>
<div class="out">── A) subshell nam trong mot danh sach || (viet SAI) ──
     ...DI TIEP (set -e KHONG co tac dung o day)
── B) script THAT: set -e o dau tep, lenh dung mot minh ──
     ma thoat cua script B: 1</div>
<pre><code><span class="tok-comment"># A — set -e bi VO HIEU o day</span>
( set -e; npm ci; echo "di tiep" ) || echo "dung lai"

<span class="tok-comment"># B — set -e co hieu luc</span>
set -e
npm ci
echo "di tiep"</code></pre>
<div class="pitfall"><strong>Bẫy — <code>set -e</code> bị VÔ HIỆU với bất kỳ lệnh nào nằm trong một danh sách <code>&amp;&amp;</code> hoặc <code>||</code>.</strong> Chuyện này có ghi trong <code>man bash</code> và rất dễ sa vào: ngay khoảnh khắc bạn viết <code>lenh || xu-ly-loi</code>, cái lỗi bên trong <code>lenh</code> thôi không còn huỷ bỏ thứ gì nữa — kể cả những lỗi nằm sâu vài lệnh bên trong một subshell. Ở ca A, lệnh <code>npm ci</code> hỏng trở nên VÔ HÌNH và cái script vui vẻ đi tiếp. Một script deploy đầy những <code>|| echo "canh bao"</code> là một script đã lặng lẽ TỰ TẮT cơ chế an toàn của chính nó, và mọi bước sau cái lỗi đầu tiên đều chạy trên một bản phát hành dựng dở. Chương 7 dựng một script không có cái lỗ này.</div>

<h3>Bước dựng nên xảy ra ở đâu</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trên chính máy đích — đơn giản nhất, và là câu trả lời mặc định</span><span class="lz-d">Gửi mã nguồn lên, chạy <code>npm ci</code> ngay đó. Module native được biên dịch theo đúng cái máy sẽ chạy chúng, và điều đó loại bỏ nguyên một loại lỗi. Cái giá là CPU và bộ nhớ trên một máy chủ có thể chẳng dư dả gì — Chương 8 đo một lần dựng bị giết vì đúng lý do đó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trong một cái ảnh dựng CHO máy đích — câu trả lời của container</span><span class="lz-d">Bước dựng chạy ở đâu tuỳ bạn, nhưng bên trong đúng cái ảnh nền mà máy chủ sẽ chạy. Thứ quan trọng là KHỚP NỀN TẢNG, không phải vị trí. Đây là đường mà kho mã này đang dùng: dựng ở nhà, đẩy lên registry, máy chủ chỉ tráo.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trên một máy dựng khớp với máy đích — làm được, nếu cẩn thận</span><span class="lz-d">Cùng hệ điều hành, cùng kiến trúc, cùng thư viện C, cùng phiên bản runtime. Mỗi thứ trong đó đều là một thứ có thể lặng lẽ trôi lệch, và việc trôi lệch chỉ bị phát hiện trên production.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trên laptop của bạn rồi chép lên — đường VỠ</span><span class="lz-d">macOS lên Linux, hay Alpine lên Debian, và bất kỳ phụ thuộc nào có phần biên dịch đều thành SAI. Nó chạy ngon với dự án thuần JavaScript, cho tới đúng lúc một phụ thuộc thêm một module native trong một bản vá nhỏ.</span></div>
</div>
<div class="callout"><strong>Sự cố mà kho mã này ĐÃ THẬT SỰ gặp.</strong> Một cái ảnh được dựng từ nhầm Dockerfile — <code>node:22-alpine</code>, tức là musl — trong khi mang theo một engine Prisma biên dịch cho <code>debian-openssl-3.0.x</code>, tức là glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi backend restart vô tận và API trả 502 suốt bảy phút. Không có gì TRƯỚC production nhìn thấy được, vì mọi phép kiểm tới thời điểm ấy đều đang kiểm cái <em>BẢN DỰNG</em>, mà bản dựng thì ổn. Bài học viết ra sau đó là: một bản dựng xanh KHÔNG có nghĩa là một cái ảnh chạy được.</div>

<h3>Một tệp khoá hứa được gì và KHÔNG hứa được gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó ghim phiên bản và mã băm toàn vẹn</span><span class="lz-lnote">Cùng phiên bản, cùng nội dung, có kiểm chứng. Đây là phần CHẠY ĐƯỢC, và nó là phần lớn giá trị.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG ghim nền tảng</span><span class="lz-lnote">Một module native giải ra một nhị phân khác trên hệ điều hành hay kiến trúc khác. Tệp khoá thoả mãn; cái tạo tác thì không mang đi được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG ghim runtime của bạn</span><span class="lz-lnote">Node 20 và Node 22 cài ra cùng một cây và có thể cư xử khác nhau. Hãy ghim runtime RIÊNG — bằng <code>engines</code>, <code>.nvmrc</code>, một tag ảnh nền — và kiểm nó trong lúc deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG ngăn script cài đặt chạy</span><span class="lz-lnote">Các hook <code>postinstall</code> thực thi mã tuỳ ý ngay lúc cài, trên máy chủ, dưới quyền người chạy deploy. <code>npm ci --ignore-scripts</code> đáng cân nhắc, nếu đám phụ thuộc của bạn sống được mà không cần chúng.</span></div>
</div>
<pre><code><span class="tok-comment"># buoc dung, tren may dich, dang toi thieu</span>
set -euo pipefail
node --version | grep -q '^v22\\.' || { echo "Sai phien ban Node" &gt;&amp;2; exit 1; }
npm ci --omit=dev --no-audit --no-fund
npm run build
<span class="tok-comment"># tao tac gio la: nguon + node_modules + dist, dung tren MAY NAY</span></code></pre>
<div class="note-ct"><code>--omit=dev</code> bỏ ra ngoài đám phụ thuộc dành cho phát triển, mà đó thường là phần lớn cái cây — nhưng chỉ khi bước dựng của bạn KHÔNG cần tới chúng. Nếu <code>npm run build</code> cần TypeScript mà TypeScript lại là một dev dependency, thì hãy cài hết, dựng, rồi tỉa đi bằng <code>npm prune --omit=dev</code>. Làm ngược thứ tự này sinh ra một bản dựng hỏng trên máy chủ và chạy tốt ở mọi nơi khác.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">npm-ci — tài liệu, kèm danh sách khác biệt</span><span class="lc-sub">docs.npmjs.com/cli/commands/npm-ci — danh sách nêu rõ nó khác <code>npm install</code> ở những điểm nào, trong đó có việc nó KHÔNG BAO GIỜ ghi vào tệp khoá.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — đoạn nói về set -e</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#The-Set-Builtin — cái câu liệt kê mọi ngữ cảnh mà <code>-e</code> KHÔNG áp dụng. Đáng đọc một lần, thật kỹ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">package-lock.json — bên trong nó có gì</span><span class="lc-sub">docs.npmjs.com/cli/configuring-npm/package-lock-json — trường <code>integrity</code>, và vì sao tệp khoá phải nằm trong quản lý phiên bản.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — dựng cho đúng nền tảng bạn sẽ chạy</span><span class="lc-sub">/courses/docker/learn${REF} — ảnh nền, musl so với glibc, và bản dựng nhiều tầng giữ cho dev dependency không lọt vào ảnh cuối.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Naming a release, and making the server admit what it is|||1.4 — Đặt tên bản phát hành, và bắt máy chủ khai nó là bản nào',
      slug: 'deploy-1-4-dat-ten-ban-phat-hanh',
      type: 'LESSON',
      description: 'Ba cách đặt tên, chỉ một cách sắp xếp đúng. Rồi một endpoint /version chạy thật — và nó khai một commit SAI, vì tệp phiên bản không bao giờ gọi tên nổi chính cái commit chứa nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Naming a release, and making the server admit what it is</h2>
<p class="lead">"Which version is production running?" should be answerable in one command, by anyone, at any time. Without a deliberate answer it is guessed from a deploy log, or from whoever remembers deploying last — and the measurement below shows that even a deliberate answer can be confidently wrong.</p>

<h3>Three naming schemes, sorted</h3>
<div class="out">  chi ma bam:       0f92aa a3f1c9 b8e402 c1d773
    → thu tu tren dia VO NGHIA: khong biet cai nao moi nhat

  chi so tang dan:  10 11 12 9
    → '10' &lt; '9' khi sap theo CHU: sai thu tu

  thoi gian + ma bam:
      2026-08-23-1930-a3f1c9
      2026-08-23-2114-b8e402
      2026-08-24-0902-c1d773
      2026-08-24-1147-0f92aa
    → sap theo chu = sap theo thoi gian, VA truy nguoc duoc ve commit</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hash alone</span><span class="v">Identifies the code exactly and sorts meaninglessly. <code>ls</code> gives you four directories in alphabetical order with no way to tell which is current or which came before which.</span></div>
  <div class="kv"><span class="k">Counter alone</span><span class="v">Sorts wrongly the moment you pass 9, because directory listings sort as text. Zero-padding fixes the sorting and loses the link to a commit.</span></div>
  <div class="kv"><span class="k">Timestamp plus hash</span><span class="v">Chronological under a plain <code>ls</code>, and every name traces back to exactly one commit. Use UTC, and a format that sorts — <code>YYYY-MM-DD-HHMM</code>, never <code>DD-MM-YYYY</code>.</span></div>
  <div class="kv"><span class="k">A tag, when you have one</span><span class="v"><code>v2.1.0</code> is what humans discuss. Keep it <em>alongside</em> the other two rather than instead of them: a tag can be moved, and two builds of one tag are not necessarily the same bytes.</span></div>
</div>

<h3>Now ask the running server</h3>
<p>A name on a directory tells you what was deployed. It does not tell you what is <em>running</em> — the process could have been started from a different directory, or never restarted after the swap. The only authority is the process itself:</p>
<pre><code>import { readFileSync } from 'fs';
const pb = JSON.parse(readFileSync(new URL('./phien-ban.json', import.meta.url)));

<span class="tok-comment">// mot tuyen, khong dang nhap, tra ve dung mot su that</span>
if (req.url === '/version') {
  res.writeHead(200, {'content-type': 'application/json'});
  return res.end(JSON.stringify(pb) + '\\n');
}</code></pre>
<div class="out">=== hoi may chu: MAY DANG CHAY CAI GI? ===
  {"commit":"4d0c4ac","commit_luc":"2026-08-23T20:03:57+00:00",
   "dung_luc":"2026-08-23T20:15:00Z","nhanh":"master"}</div>
<p>One request, one answer, no guessing. Except that this answer is wrong.</p>

<h3>The version file that cannot name its own commit</h3>
<div class="out">  HEAD hien tai:                       962ceea
  commit ghi trong src/phien-ban.json: 4d0c4ac
  → cha cua HEAD:                      4d0c4ac
  ❌ LECH: tep phien ban dang goi ten mot commit KHAC voi ma dang chay

  962ceea them /version
  4d0c4ac bo export-ignore</div>
<div class="pitfall"><strong>Trap — a version file committed into the repository always names the previous commit.</strong> It is a chicken-and-egg problem, not a mistake you can be careful enough to avoid: writing the file requires knowing the hash, and the hash is not decided until the file is committed. So the file names its parent, forever, on every commit. Here the server reported <code>4d0c4ac</code> while running <code>962ceea</code> — and that is <em>worse</em> than reporting nothing, because it looks authoritative. Someone comparing that hash against staging would conclude the two match when they do not.</div>
<p>The fix is to stamp the version <em>outside</em> the commit, during the build, after the artifact has been extracted:</p>
<pre><code>set -euo pipefail
COMMIT=\$(git rev-parse --short HEAD)
THUMUC=\$(mktemp -d)

git archive --format=tar HEAD | tar x -C "\$THUMUC"      <span class="tok-comment"># 1. tao tac tu commit</span>
cat &gt; "\$THUMUC/src/phien-ban.json" &lt;&lt;EOF               <span class="tok-comment"># 2. ROI moi dong dau</span>
{ "commit": "\$COMMIT",
  "commit_luc": "\$(git show -s --format=%cI HEAD)",
  "dung_luc": "\$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "nhanh": "\$(git rev-parse --abbrev-ref HEAD)" }
EOF</code></pre>
<div class="out">  HEAD:          02047be
  trong tao tac: 02047be
  ✅ KHOP</div>
<div class="callout ok"><strong>Add the file to <code>.gitignore</code>.</strong> It is generated, so it is derived — category 2 from Lesson 1.1. Committing it guarantees the skew above, and it also produces a permanent stream of one-line diffs in every pull request. Generated at build time it is always correct, and it never appears in a code review.</div>

<h3>What to put in it</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">commit — the short hash</span><span class="lz-lnote">The one field that matters. It is the only value that identifies the code exactly, and it is what you compare between two machines.</span></div>
  <div class="lz-layer"><span class="lz-lname">built_at — when the artifact was made</span><span class="lz-lnote">Answers "is this stale?" without reading a deploy log. A build timestamp much older than the commit timestamp usually means a cached layer nobody expected.</span></div>
  <div class="lz-layer"><span class="lz-lname">branch or tag — for humans</span><span class="lz-lnote">Useful for spotting the obvious accident: production running something from a feature branch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nothing else</span><span class="lz-lnote">No dependency list, no environment variables, no framework version, no hostname. This endpoint is usually reachable — everything you add is published. Chapter 9 covers the private counterpart that can say more.</span></div>
</div>
<pre><code><span class="tok-comment"># cac cau hoi ma mot dong lenh giai quyet duoc</span>
curl -s https://cuongthai.com/version | jq -r .commit

<span class="tok-comment"># production va staging co khop khong?</span>
diff &lt;(curl -s https://cuongthai.com/version | jq -r .commit) \\
     &lt;(curl -s https://staging.cuongthai.com/version | jq -r .commit) \\
  &amp;&amp; echo "KHOP" || echo "LECH"

<span class="tok-comment"># may chu co dang chay dung cai vua deploy khong?</span>
[ "\$(curl -s https://cuongthai.com/version | jq -r .commit)" = "\$(git rev-parse --short HEAD)" ] \\
  &amp;&amp; echo "dung ban vua deploy" || echo "KHAC — trao chua xong hoac chua restart"</code></pre>
<div class="note-ct">That last check is worth adding to the end of a deploy script, and it catches a specific failure the other checks miss: the files were swapped but the process was never restarted, so it is still executing the previous release from memory. The health check passes, the site works, and it is the old code. The version endpoint is the only thing that notices.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-rev-parse(1) and git-describe(1)</span><span class="lc-sub">git-scm.com/docs/git-rev-parse — where the short hash comes from; <code>git describe --tags --always --dirty</code> is worth knowing for the <code>-dirty</code> suffix alone.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ISO 8601 / RFC 3339 timestamps</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc3339 — why <code>date -u +%Y-%m-%dT%H:%M:%SZ</code> is the format to use, and why it sorts as text.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OCI image spec — annotations</span><span class="lc-sub">github.com/opencontainers/image-spec/blob/main/annotations.md — the standard label names (<code>org.opencontainers.image.revision</code>) for the same information when the artifact is a container image.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — a diagnostic header that names what handled the request</span><span class="lc-sub">/courses/nginx/learn${REF} — the same idea one layer out: making the infrastructure report which block answered.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Đặt tên bản phát hành, và bắt máy chủ khai nó là bản nào</h2>
<p class="lead">"Production đang chạy phiên bản nào?" đáng lẽ phải trả lời được bằng MỘT lệnh, bởi bất cứ ai, vào bất cứ lúc nào. Không có câu trả lời được chuẩn bị sẵn thì người ta đoán nó qua log deploy, hoặc qua trí nhớ của người deploy gần nhất — và phép đo dưới đây cho thấy ngay cả một câu trả lời được chuẩn bị sẵn cũng có thể SAI một cách rất tự tin.</p>

<h3>Ba cách đặt tên, đem sắp xếp</h3>
<div class="out">  chi ma bam:       0f92aa a3f1c9 b8e402 c1d773
    → thu tu tren dia VO NGHIA: khong biet cai nao moi nhat

  chi so tang dan:  10 11 12 9
    → '10' &lt; '9' khi sap theo CHU: sai thu tu

  thoi gian + ma bam:
      2026-08-23-1930-a3f1c9
      2026-08-23-2114-b8e402
      2026-08-24-0902-c1d773
      2026-08-24-1147-0f92aa
    → sap theo chu = sap theo thoi gian, VA truy nguoc duoc ve commit</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ mã băm</span><span class="v">Định danh mã CHÍNH XÁC và sắp xếp thì VÔ NGHĨA. <code>ls</code> cho bạn bốn thư mục theo thứ tự bảng chữ cái mà không cách nào biết cái nào là hiện hành hay cái nào có trước cái nào.</span></div>
  <div class="kv"><span class="k">Chỉ số đếm tăng dần</span><span class="v">Sắp xếp SAI ngay khi vượt qua số 9, vì danh sách thư mục sắp theo CHỮ. Đệm số 0 thì sửa được chuyện sắp xếp và mất luôn mối liên hệ với commit.</span></div>
  <div class="kv"><span class="k">Thời gian cộng mã băm</span><span class="v">Đúng thứ tự thời gian ngay với một lệnh <code>ls</code> trơn, và mọi cái tên đều truy ngược về đúng một commit. Dùng giờ UTC, và một định dạng SẮP XẾP ĐƯỢC — <code>YYYY-MM-DD-HHMM</code>, không bao giờ <code>DD-MM-YYYY</code>.</span></div>
  <div class="kv"><span class="k">Một cái tag, khi bạn có</span><span class="v"><code>v2.1.0</code> là thứ con người đem ra bàn với nhau. Hãy giữ nó SONG SONG với hai thứ kia chứ đừng thay thế: một cái tag có thể bị di chuyển, và hai lần dựng của cùng một tag không nhất thiết là cùng những byte.</span></div>
</div>

<h3>Giờ hãy hỏi chính máy chủ đang chạy</h3>
<p>Một cái tên trên thư mục cho bạn biết thứ gì đã được DEPLOY. Nó không cho biết thứ gì đang CHẠY — tiến trình có thể đã được khởi động từ một thư mục khác, hoặc chưa hề được khởi động lại sau bước tráo. Nguồn thẩm quyền duy nhất là chính cái tiến trình:</p>
<pre><code>import { readFileSync } from 'fs';
const pb = JSON.parse(readFileSync(new URL('./phien-ban.json', import.meta.url)));

<span class="tok-comment">// mot tuyen, khong dang nhap, tra ve dung mot su that</span>
if (req.url === '/version') {
  res.writeHead(200, {'content-type': 'application/json'});
  return res.end(JSON.stringify(pb) + '\\n');
}</code></pre>
<div class="out">=== hoi may chu: MAY DANG CHAY CAI GI? ===
  {"commit":"4d0c4ac","commit_luc":"2026-08-23T20:03:57+00:00",
   "dung_luc":"2026-08-23T20:15:00Z","nhanh":"master"}</div>
<p>Một request, một câu trả lời, không phải đoán. Có điều câu trả lời này SAI.</p>

<h3>Cái tệp phiên bản không thể gọi tên chính commit của nó</h3>
<div class="out">  HEAD hien tai:                       962ceea
  commit ghi trong src/phien-ban.json: 4d0c4ac
  → cha cua HEAD:                      4d0c4ac
  ❌ LECH: tep phien ban dang goi ten mot commit KHAC voi ma dang chay

  962ceea them /version
  4d0c4ac bo export-ignore</div>
<div class="pitfall"><strong>Bẫy — một tệp phiên bản được commit vào kho mã thì LUÔN gọi tên commit TRƯỚC ĐÓ.</strong> Đây là bài toán con-gà-quả-trứng, không phải một lỗi mà bạn có thể cẩn thận đủ để tránh: viết cái tệp thì cần biết mã băm, mà mã băm thì chưa được quyết cho tới khi cái tệp được commit. Nên tệp đó gọi tên cha của nó, mãi mãi, ở mọi commit. Ở đây máy chủ báo <code>4d0c4ac</code> trong khi đang chạy <code>962ceea</code> — và như thế còn <em>TỆ HƠN</em> việc không báo gì cả, vì nó trông rất có thẩm quyền. Một người đem mã băm đó đi so với staging sẽ kết luận rằng hai bên khớp nhau trong khi chúng không hề.</div>
<p>Cách sửa là đóng dấu phiên bản ở <em>NGOÀI</em> commit, trong lúc DỰNG, sau khi tạo tác đã được giải nén ra:</p>
<pre><code>set -euo pipefail
COMMIT=\$(git rev-parse --short HEAD)
THUMUC=\$(mktemp -d)

git archive --format=tar HEAD | tar x -C "\$THUMUC"      <span class="tok-comment"># 1. tao tac tu commit</span>
cat &gt; "\$THUMUC/src/phien-ban.json" &lt;&lt;EOF               <span class="tok-comment"># 2. ROI moi dong dau</span>
{ "commit": "\$COMMIT",
  "commit_luc": "\$(git show -s --format=%cI HEAD)",
  "dung_luc": "\$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "nhanh": "\$(git rev-parse --abbrev-ref HEAD)" }
EOF</code></pre>
<div class="out">  HEAD:          02047be
  trong tao tac: 02047be
  ✅ KHOP</div>
<div class="callout ok"><strong>Hãy thêm cái tệp đó vào <code>.gitignore</code>.</strong> Nó được SINH RA, nên nó thuộc loại DẪN XUẤT — loại 2 ở Bài 1.1. Commit nó vào thì bảo đảm sinh ra đúng cái lệch ở trên, và nó còn tạo ra một dòng chảy vĩnh viễn những diff một dòng trong mọi pull request. Sinh lúc dựng thì nó luôn đúng, và nó không bao giờ xuất hiện trong một buổi review mã.</div>

<h3>Nên nhét gì vào đó</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">commit — mã băm ngắn</span><span class="lz-lnote">Trường DUY NHẤT thật sự quan trọng. Nó là giá trị duy nhất định danh mã một cách chính xác, và nó là thứ bạn đem so giữa hai cái máy.</span></div>
  <div class="lz-layer"><span class="lz-lname">built_at — tạo tác được dựng lúc nào</span><span class="lz-lnote">Trả lời câu "cái này có cũ không?" mà không cần đọc log deploy. Một dấu thời gian dựng cũ hơn hẳn dấu thời gian commit thường nghĩa là có một lớp cache mà chẳng ai ngờ tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">branch hoặc tag — cho con người</span><span class="lz-lnote">Hữu ích để phát hiện tai nạn hiển nhiên: production đang chạy thứ gì đó từ một nhánh tính năng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không gì khác nữa</span><span class="lz-lnote">Không danh sách phụ thuộc, không biến môi trường, không phiên bản framework, không tên máy. Cái endpoint này thường công khai — mọi thứ bạn thêm vào đều là CÔNG BỐ. Chương 9 nói về người anh em riêng tư của nó, cái được phép nói nhiều hơn.</span></div>
</div>
<pre><code><span class="tok-comment"># cac cau hoi ma mot dong lenh giai quyet duoc</span>
curl -s https://cuongthai.com/version | jq -r .commit

<span class="tok-comment"># production va staging co khop khong?</span>
diff &lt;(curl -s https://cuongthai.com/version | jq -r .commit) \\
     &lt;(curl -s https://staging.cuongthai.com/version | jq -r .commit) \\
  &amp;&amp; echo "KHOP" || echo "LECH"

<span class="tok-comment"># may chu co dang chay dung cai vua deploy khong?</span>
[ "\$(curl -s https://cuongthai.com/version | jq -r .commit)" = "\$(git rev-parse --short HEAD)" ] \\
  &amp;&amp; echo "dung ban vua deploy" || echo "KHAC — trao chua xong hoac chua restart"</code></pre>
<div class="note-ct">Phép kiểm cuối cùng đó đáng được thêm vào cuối một script deploy, và nó bắt được một kiểu hỏng mà mấy phép kiểm kia bỏ sót: tệp đã được tráo nhưng tiến trình chưa từng được khởi động lại, nên nó vẫn đang chạy bản phát hành TRƯỚC từ trong bộ nhớ. Phép kiểm sức khoẻ vẫn qua, website vẫn chạy, và đó là mã CŨ. Cái endpoint phiên bản là thứ duy nhất nhận ra.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-rev-parse(1) và git-describe(1)</span><span class="lc-sub">git-scm.com/docs/git-rev-parse — mã băm ngắn tới từ đâu; <code>git describe --tags --always --dirty</code> đáng biết chỉ riêng vì cái hậu tố <code>-dirty</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Dấu thời gian ISO 8601 / RFC 3339</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc3339 — vì sao nên dùng <code>date -u +%Y-%m-%dT%H:%M:%SZ</code>, và vì sao nó sắp xếp đúng ngay ở dạng chữ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Đặc tả ảnh OCI — annotations</span><span class="lc-sub">github.com/opencontainers/image-spec/blob/main/annotations.md — tên nhãn chuẩn (<code>org.opencontainers.image.revision</code>) cho đúng những thông tin đó khi tạo tác là một cái ảnh container.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — một header chẩn đoán khai ra khối nào đã xử lý request</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng một ý tưởng ở lớp bên ngoài: bắt hạ tầng khai ra khối nào đã trả lời.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Keeping old releases without filling the disk|||1.5 — Giữ bản phát hành cũ mà không làm đầy đĩa',
      slug: 'deploy-1-5-giu-ban-cu-khong-day-dia',
      type: 'LESSON',
      description: 'Năm bản phát hành tốn 236 MB, hoặc 49 MB — cùng nội dung, khác một tuỳ chọn. Nhưng cái kỹ thuật tiết kiệm 4,8 lần đó mang theo một cách hỏng làm bẩn CẢ NĂM bản cùng lúc, và bài này đo chính xác thao tác nào gây ra nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Keeping old releases without filling the disk</h2>
<p class="lead">Lesson 0.4 made the case for keeping every release in its own directory: rollback becomes a symlink move that takes five milliseconds and needs no network. The obvious objection is disk. On a small VPS it is a real objection — and it has a good answer, which comes with a sharp edge.</p>

<h3>The cost, measured</h3>
<p>Five releases of a 48 MB project — 12,000 files, the shape of a tree with <code>node_modules</code> in it — each differing from the last by one line in one file:</p>
<div class="out">=== A) 5 ban phat hanh, moi ban mot ban SAO DAY DU ===
  tong: 236M

=== B) 5 ban phat hanh, dung LIEN KET CUNG cho tep khong doi ===
  tong: 49M
  (moi ban rieng le van bao: 48M)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">236 MB against 49 MB</span><span class="v">Nearly five times less, for identical content. The second layout stores each unchanged file once and points every release at it.</span></div>
  <div class="kv"><span class="k">Five releases cost about one</span><span class="v">49 MB for five copies of a 48 MB project. The overhead is the directory entries plus the handful of files that actually changed.</span></div>
  <div class="kv"><span class="k">Each release is still complete</span><span class="v">Not a diff, not a patch to apply. <code>v3</code> is a full directory tree you can run, delete or copy independently — the sharing is invisible to everything except <code>du</code>.</span></div>
  <div class="kv"><span class="k">The arithmetic stops working</span><span class="v">Every release reports 48 MB on its own, so they sum to 240 MB while the parent reports 49 MB. <code>du</code> counts shared blocks once per invocation, and the sum of the parts is not the whole.</span></div>
</div>
<pre><code><span class="tok-comment"># cp -al: chep CAY THU MUC, nhung tep thi LIEN KET CUNG</span>
cp -al /srv/app/phat-hanh/&lt;ban-truoc&gt; /srv/app/phat-hanh/&lt;ban-moi&gt;

<span class="tok-comment"># rsync lam viec do gon hon, va no chi thay tep NAO doi</span>
rsync -a --delete --link-dest=/srv/app/phat-hanh/&lt;ban-truoc&gt; \\
      ./ /srv/app/phat-hanh/&lt;ban-moi&gt;/</code></pre>
<div class="note-ct"><code>--link-dest</code> is the form worth using. rsync compares each incoming file against the reference directory; identical files become hardlinks, changed files are written fresh. One command produces a complete release directory that shares everything it can, and it is the mechanism behind almost every snapshot backup tool.</div>

<h3>The sharp edge, measured</h3>
<p>A hardlink is not a copy. Two names, one inode, one set of blocks — so writing through either name writes to both. Two names linked together, then three different ways of changing one of them:</p>
<div class="out">  a.txt va b.txt: 2 lien ket, inode 992893

── 1) GHI NOI vao b (&gt;&gt;) ──
     a.txt bay gio: GOC THEM

── 2) cp de len b (ghi TAI CHO) ──
     a.txt bay gio: TU CP   (inode a=992893 b=992893)

── 3) mv de len b (THAY muc thu muc) ──
     a.txt bay gio: GOC     (inode a=992893 b=1886675)</div>
<div class="pitfall"><strong>Trap — <code>cp</code> over a hardlinked file changes every release that shares it.</strong> Appending is the obvious hazard, but <code>cp</code> is the one that catches people: it opens the destination and truncates it <em>in place</em>, so the inode is unchanged and every other name still points at the modified blocks. Both files still read <code>992893</code>. In a releases layout, editing one file in the current release silently rewrites that file inside every older release too — and your rollback target is now carrying the change you were rolling back from.</div>
<p><code>mv</code> is safe, and the inode numbers say why: after the move <code>b</code> is inode 1886675 while <code>a</code> is still 992893. <code>mv</code> replaces the directory entry rather than the contents, so the link is broken and the other names keep the original file. This is also why <code>rsync</code> is safe by default — it writes to a temporary file and renames it into place, exactly the <code>mv</code> behaviour. It is <em>not</em> safe with <code>--inplace</code>, which does what <code>cp</code> does and exists precisely for cases where you want that.</p>
<div class="callout warn"><strong>Two rules make hardlinked releases safe.</strong> Treat a release directory as read-only once it is created — never edit a file inside it, on any release, for any reason including a "quick fix in production". And keep everything writable outside the releases entirely, in the shared directory from Lesson 0.4: uploads, logs, caches. If nothing ever writes into a release, the sharp edge cannot cut you.</div>

<h3>Pruning, and the way it goes wrong</h3>
<div class="out">=== giu 3 ban gan nhat, xoa phan con lai ===
  truoc: 5 ban, 236M
    xoa v1
    xoa v2
  sau:   3 ban, 142M

=== BAY: neu hien-tai dang tro vao ban vua bi xoa thi sao? ===
  symlink tro vao: /srv/vps/gg/thuong/v9-khong-ton-tai
  doc duoc khong:  cat: .../m1.js: No such file or directory</div>
<div class="pitfall"><strong>Trap — deleting the release the symlink points at leaves a dangling link and a dead site.</strong> It happens when a rollback moves <code>hien-tai</code> to an older release and the pruner then deletes "the oldest N" without checking. Nothing errors at delete time; the failure arrives on the next request, or on the next restart. Any pruner must read the symlink first and refuse to remove its target.</div>
<pre><code><span class="tok-comment">#!/bin/bash</span>
set -euo pipefail
GOC=/srv/app/phat-hanh
GIU=5
DANG_DUNG=\$(basename "\$(readlink -f /srv/app/hien-tai)")

<span class="tok-comment"># sap theo ten = sap theo thoi gian (Bai 1.4), bo N ban moi nhat</span>
ls -1 "\$GOC" | sort | head -n -"\$GIU" | while read -r ban; do
  if [ "\$ban" = "\$DANG_DUNG" ]; then
    echo "bo qua \$ban — dang duoc dung" &gt;&amp;2
    continue
  fi
  rm -rf "\${GOC:?}/\$ban"
  echo "da xoa \$ban"
done</code></pre>
<div class="note-ct">Three details in that script earn their place. <code>readlink -f</code> resolves the symlink fully, so a chain of links still gives the real directory. <code>head -n -5</code> means "all but the last five" — a GNU extension, and the whole reason the naming scheme from Lesson 1.4 sorts chronologically. And <code>\${GOC:?}</code> makes the shell abort if <code>GOC</code> is somehow empty, because <code>rm -rf /\$ban</code> with an empty variable is the single most expensive typo in system administration.</div>

<h3>How many to keep</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Two is the minimum that means anything</span><span class="lz-lnote">Current and previous. One release is no rollback at all — you are back to re-deploying from an artifact, which is the situation Lesson 0.4 measured at 590 ms and a dependency on the network.</span></div>
  <div class="lz-layer"><span class="lz-lname">Five is a good default</span><span class="lz-lnote">Covers "the bug was introduced two deploys ago", which is the common case. With hardlinks it costs roughly one release plus the deltas.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bound it by disk, not by count, if the disk is small</span><span class="lz-lnote">Prune while free space is under a threshold rather than keeping a fixed number. Chapter 8 measures a deploy on this project failing with <em>no space left on device</em> partway through a build, on the same disk as the database.</span></div>
  <div class="lz-layer"><span class="lz-lname">Prune before the deploy, not after</span><span class="lz-lnote">Pruning after means the peak usage is N+1 releases, and the peak is when you run out. Pruning first also means a failed deploy does not leave the disk fuller than it found it.</span></div>
</div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — --link-dest</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — the flag behind the 4.8× measurement, plus <code>--inplace</code> and the warning about when not to use it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">link(2) — what a hard link actually is</span><span class="lc-sub">man7.org/linux/man-pages/man2/link.2.html — one inode, many names, and why there is no "original" among them.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">du(1) — the --count-links and --separate-dirs flags</span><span class="lc-sub">man7.org/linux/man-pages/man1/du.1.html — why the parts sum to more than the whole, and how to make it count the way you meant.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — inodes, links and what rm actually removes</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the filesystem model that makes the cp-versus-mv result above predictable rather than surprising.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Giữ bản phát hành cũ mà không làm đầy đĩa</h2>
<p class="lead">Bài 0.4 đã lập luận cho việc giữ mỗi bản phát hành trong một thư mục riêng: lùi bản trở thành một cú di chuyển symlink mất năm mili giây và chẳng cần mạng. Phản đối hiển nhiên là ĐĨA. Trên một con VPS nhỏ thì đó là phản đối có thật — và nó có một câu trả lời tốt, kèm theo một lưỡi dao sắc.</p>

<h3>Cái giá, đo thật</h3>
<p>Năm bản phát hành của một dự án 48 MB — 12.000 tệp, đúng hình dạng của một cây có <code>node_modules</code> trong đó — mỗi bản khác bản trước đúng một dòng trong một tệp:</p>
<div class="out">=== A) 5 ban phat hanh, moi ban mot ban SAO DAY DU ===
  tong: 236M

=== B) 5 ban phat hanh, dung LIEN KET CUNG cho tep khong doi ===
  tong: 49M
  (moi ban rieng le van bao: 48M)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">236 MB so với 49 MB</span><span class="v">Ít hơn gần năm lần, cho nội dung y hệt. Bố cục thứ hai lưu mỗi tệp không đổi ĐÚNG MỘT LẦN rồi trỏ mọi bản phát hành vào đó.</span></div>
  <div class="kv"><span class="k">Năm bản tốn xấp xỉ bằng một bản</span><span class="v">49 MB cho năm bản sao của một dự án 48 MB. Phần dôi ra là mấy mục thư mục cộng với nhúm tệp thật sự có thay đổi.</span></div>
  <div class="kv"><span class="k">Mỗi bản vẫn ĐẦY ĐỦ</span><span class="v">Không phải một bản diff, không phải một bản vá phải áp vào. <code>v3</code> là một cây thư mục trọn vẹn mà bạn chạy được, xoá được hay chép được một cách độc lập — chuyện chia sẻ là vô hình với mọi thứ trừ <code>du</code>.</span></div>
  <div class="kv"><span class="k">Phép cộng thôi không còn đúng</span><span class="v">Mỗi bản tự báo 48 MB, nên chúng cộng lại thành 240 MB trong khi thư mục cha báo 49 MB. <code>du</code> chỉ đếm khối chia sẻ một lần cho mỗi lần chạy, và TỔNG CÁC PHẦN không bằng CÁI TOÀN THỂ.</span></div>
</div>
<pre><code><span class="tok-comment"># cp -al: chep CAY THU MUC, nhung tep thi LIEN KET CUNG</span>
cp -al /srv/app/phat-hanh/&lt;ban-truoc&gt; /srv/app/phat-hanh/&lt;ban-moi&gt;

<span class="tok-comment"># rsync lam viec do gon hon, va no chi thay tep NAO doi</span>
rsync -a --delete --link-dest=/srv/app/phat-hanh/&lt;ban-truoc&gt; \\
      ./ /srv/app/phat-hanh/&lt;ban-moi&gt;/</code></pre>
<div class="note-ct"><code>--link-dest</code> là dạng đáng dùng. rsync so từng tệp đi vào với thư mục tham chiếu; tệp giống hệt thì thành liên kết cứng, tệp đã đổi thì được ghi mới. Một lệnh sinh ra một thư mục bản phát hành hoàn chỉnh có chia sẻ mọi thứ chia sẻ được, và nó chính là cơ chế nằm sau gần như mọi công cụ sao lưu dạng ảnh chụp.</div>

<h3>Lưỡi dao sắc, đo thật</h3>
<p>Một liên kết cứng KHÔNG phải một bản sao. Hai cái tên, một inode, một bộ khối dữ liệu — nên ghi qua tên nào cũng là ghi vào cả hai. Hai cái tên liên kết với nhau, rồi ba cách khác nhau để thay đổi một trong hai:</p>
<div class="out">  a.txt va b.txt: 2 lien ket, inode 992893

── 1) GHI NOI vao b (&gt;&gt;) ──
     a.txt bay gio: GOC THEM

── 2) cp de len b (ghi TAI CHO) ──
     a.txt bay gio: TU CP   (inode a=992893 b=992893)

── 3) mv de len b (THAY muc thu muc) ──
     a.txt bay gio: GOC     (inode a=992893 b=1886675)</div>
<div class="pitfall"><strong>Bẫy — <code>cp</code> đè lên một tệp có liên kết cứng sẽ đổi MỌI bản phát hành đang chia sẻ nó.</strong> Ghi nối thì là mối nguy hiển nhiên, nhưng <code>cp</code> mới là cái bẫy người ta: nó mở tệp đích rồi cắt trắng nó <em>NGAY TẠI CHỖ</em>, nên inode không đổi và mọi cái tên khác vẫn trỏ vào đúng những khối đã bị sửa. Cả hai tệp vẫn cùng đọc ra <code>992893</code>. Trong một bố cục releases, sửa một tệp trong bản hiện hành sẽ âm thầm viết lại tệp đó bên trong MỌI bản cũ hơn — và cái đích lùi bản của bạn giờ đang mang theo chính cái thay đổi mà bạn định lùi khỏi.</div>
<p><code>mv</code> thì an toàn, và mấy con số inode nói rõ vì sao: sau lệnh mv thì <code>b</code> là inode 1886675 còn <code>a</code> vẫn là 992893. <code>mv</code> thay MỤC THƯ MỤC chứ không thay nội dung, nên liên kết bị đứt và những cái tên còn lại vẫn giữ tệp gốc. Đây cũng là lý do <code>rsync</code> an toàn theo mặc định — nó ghi ra một tệp tạm rồi đổi tên vào chỗ, đúng hành vi của <code>mv</code>. Nó <em>KHÔNG</em> an toàn với <code>--inplace</code>, cờ này làm đúng những gì <code>cp</code> làm và tồn tại chính cho những trường hợp bạn MUỐN như vậy.</p>
<div class="callout warn"><strong>Hai luật làm cho releases dùng liên kết cứng trở nên an toàn.</strong> Coi một thư mục bản phát hành là CHỈ ĐỌC ngay khi nó được tạo ra — đừng bao giờ sửa một tệp bên trong nó, ở bất kỳ bản nào, vì bất kỳ lý do gì, kể cả một "cú sửa nhanh trên production". Và giữ mọi thứ CÓ GHI ở hẳn bên ngoài các bản phát hành, trong thư mục dùng chung ở Bài 0.4: tệp tải lên, log, cache. Nếu không có gì từng ghi vào một bản phát hành thì lưỡi dao sắc kia không cắt được bạn.</div>

<h3>Dọn bớt, và cách nó đi sai</h3>
<div class="out">=== giu 3 ban gan nhat, xoa phan con lai ===
  truoc: 5 ban, 236M
    xoa v1
    xoa v2
  sau:   3 ban, 142M

=== BAY: neu hien-tai dang tro vao ban vua bi xoa thi sao? ===
  symlink tro vao: /srv/vps/gg/thuong/v9-khong-ton-tai
  doc duoc khong:  cat: .../m1.js: No such file or directory</div>
<div class="pitfall"><strong>Bẫy — xoá đúng cái bản mà symlink đang trỏ vào thì để lại một liên kết treo lơ lửng và một website chết.</strong> Chuyện này xảy ra khi một cú lùi bản chuyển <code>hien-tai</code> về một bản cũ hơn rồi bộ dọn dẹp xoá "N bản cũ nhất" mà không kiểm. Chẳng có lỗi nào lúc xoá; cái hỏng tới ở request kế tiếp, hoặc ở lần khởi động lại kế tiếp. Mọi bộ dọn dẹp đều PHẢI đọc cái symlink trước và từ chối xoá đích của nó.</div>
<pre><code><span class="tok-comment">#!/bin/bash</span>
set -euo pipefail
GOC=/srv/app/phat-hanh
GIU=5
DANG_DUNG=\$(basename "\$(readlink -f /srv/app/hien-tai)")

<span class="tok-comment"># sap theo ten = sap theo thoi gian (Bai 1.4), bo N ban moi nhat</span>
ls -1 "\$GOC" | sort | head -n -"\$GIU" | while read -r ban; do
  if [ "\$ban" = "\$DANG_DUNG" ]; then
    echo "bo qua \$ban — dang duoc dung" &gt;&amp;2
    continue
  fi
  rm -rf "\${GOC:?}/\$ban"
  echo "da xoa \$ban"
done</code></pre>
<div class="note-ct">Ba chi tiết trong cái script đó xứng đáng có mặt. <code>readlink -f</code> giải quyết symlink tới cùng, nên một chuỗi liên kết vẫn cho ra đúng thư mục thật. <code>head -n -5</code> nghĩa là "tất cả trừ năm cái cuối" — một phần mở rộng của GNU, và là toàn bộ lý do vì sao cách đặt tên ở Bài 1.4 phải sắp xếp theo thời gian. Còn <code>\${GOC:?}</code> bắt shell dừng nếu <code>GOC</code> vì lý do nào đó rỗng, vì <code>rm -rf /\$ban</code> với một biến rỗng là cú gõ nhầm đắt nhất trong nghề quản trị hệ thống.</div>

<h3>Nên giữ bao nhiêu bản</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hai là mức tối thiểu có nghĩa</span><span class="lz-lnote">Hiện hành và bản trước. Một bản thì chẳng lùi được gì cả — bạn quay về tình huống deploy lại từ một tạo tác, tức là tình huống Bài 0.4 đo được 590 ms và kèm một sự phụ thuộc vào mạng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Năm là một mặc định tốt</span><span class="lz-lnote">Phủ được tình huống "cái lỗi này được đưa vào từ hai lần deploy trước", mà đó là tình huống thường gặp. Với liên kết cứng thì nó tốn xấp xỉ một bản cộng phần chênh lệch.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nếu đĩa nhỏ thì chặn theo DUNG LƯỢNG, đừng chặn theo SỐ LƯỢNG</span><span class="lz-lnote">Dọn khi chỗ trống xuống dưới một ngưỡng, thay vì giữ một con số cố định. Chương 8 đo một lần deploy trên chính dự án này hỏng với <em>no space left on device</em> ngay giữa một bước dựng, trên đúng cái đĩa chứa cơ sở dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dọn TRƯỚC khi deploy, không phải sau</span><span class="lz-lnote">Dọn sau nghĩa là đỉnh sử dụng là N+1 bản, và cái đỉnh đó chính là lúc bạn hết chỗ. Dọn trước còn có nghĩa là một lần deploy hỏng không để lại cái đĩa đầy hơn lúc nó tới.</span></div>
</div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">rsync(1) — --link-dest</span><span class="lc-sub">man7.org/linux/man-pages/man1/rsync.1.html — cái cờ nằm sau phép đo 4,8 lần, cộng thêm <code>--inplace</code> và lời cảnh báo về lúc KHÔNG nên dùng nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">link(2) — một liên kết cứng THẬT RA là gì</span><span class="lc-sub">man7.org/linux/man-pages/man2/link.2.html — một inode, nhiều tên, và vì sao trong đám tên đó không có cái nào là "bản gốc".</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">du(1) — hai cờ --count-links và --separate-dirs</span><span class="lc-sub">man7.org/linux/man-pages/man1/du.1.html — vì sao tổng các phần lớn hơn cái toàn thể, và cách bắt nó đếm theo đúng ý bạn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — inode, liên kết và rm thật ra xoá cái gì</span><span class="lc-sub">/courses/linux-bash/learn${REF} — mô hình hệ tệp làm cho kết quả cp-so-với-mv ở trên thành có thể đoán trước chứ không phải bất ngờ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 1.6 ─────────────────────────── */
    {
      title: '1.6 — Quiz: the artifact|||1.6 — Quiz: tạo tác',
      slug: 'deploy-1-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một cây làm việc chứa mật khẩu thật, một tệp phiên bản gọi tên sai commit, hai lệnh npm cho hai kết cục ngược nhau, và một cú cp làm bẩn cả năm bản phát hành.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.6</span>
<h2>Quiz: the artifact</h2>
<p class="lead">Eight questions from a chapter where the measurements kept contradicting the obvious answer — including twice where the tool reported success while doing the wrong thing.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> A real working tree was 3.8 MB of which 84 KB was source; the naive package carried the <code>.env</code> with a live database password, user uploads, logs, an editor backup and 786 <code>node_modules</code> entries, while <code>git archive</code> carried none of them (1.1). <code>git archive</code> is byte-reproducible because it stamps the <em>commit</em> time, and <code>gzip</code> is too when it reads from a pipe — but compressing a named file records that file's mtime in bytes 5–8, so identical content produced two different checksums two seconds apart (1.2). <code>npm ci</code> and <code>npm install</code> given the same lockfile conflict did opposite things: one named the conflict and exited <strong>1</strong>, the other installed a different major version, rewrote the lockfile and exited <strong>0</strong> — and while measuring it, <code>set -e</code> turned out to be inert inside a <code>||</code> list, which hid the failure entirely (1.3). A version file committed to the repository always names its parent commit, so the server reported <code>4d0c4ac</code> while running <code>962ceea</code>; stamping it during the build instead made it match (1.4). And five releases cost 236 MB as copies or 49 MB as hardlinks — but <code>cp</code> over a hardlinked file rewrote every release sharing it, because <code>cp</code> truncates in place and keeps the inode, while <code>mv</code> replaces the directory entry and does not (1.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.6</span>
<h2>Quiz: tạo tác</h2>
<p class="lead">Tám câu ra từ một chương mà các phép đo cứ liên tục mâu thuẫn với câu trả lời hiển nhiên — trong đó có hai lần công cụ BÁO THÀNH CÔNG trong khi đang làm sai việc.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một cây làm việc thật nặng 3,8 MB mà chỉ 84 KB là mã nguồn; cái gói ngây thơ chở theo tệp <code>.env</code> có mật khẩu cơ sở dữ liệu đang sống, tệp người dùng tải lên, log, một bản sao lưu của trình soạn thảo và 786 mục <code>node_modules</code>, còn <code>git archive</code> thì không chở cái nào (1.1). <code>git archive</code> tái lập được tới từng byte vì nó đóng dấu thời gian của <em>COMMIT</em>, và <code>gzip</code> cũng vậy khi nó đọc từ một ống dẫn — nhưng nén một tệp CÓ TÊN thì ghi mtime của tệp đó vào byte 5–8, nên nội dung y hệt cho ra hai mã băm khác nhau chỉ cách nhau hai giây (1.2). <code>npm ci</code> và <code>npm install</code> gặp cùng một mâu thuẫn tệp khoá đã làm hai việc NGƯỢC nhau: một cái nêu đích danh mâu thuẫn rồi thoát ra <strong>1</strong>, cái kia cài một phiên bản major khác, ghi lại tệp khoá rồi thoát ra <strong>0</strong> — và trong lúc đo chuyện đó, hoá ra <code>set -e</code> VÔ HIỆU bên trong một danh sách <code>||</code>, thứ đã che giấu hoàn toàn cái lỗi (1.3). Một tệp phiên bản commit vào kho mã thì LUÔN gọi tên commit cha của nó, nên máy chủ báo <code>4d0c4ac</code> trong khi đang chạy <code>962ceea</code>; đóng dấu nó trong lúc DỰNG thì nó khớp (1.4). Và năm bản phát hành tốn 236 MB nếu chép hẳn hoặc 49 MB nếu dùng liên kết cứng — nhưng <code>cp</code> đè lên một tệp có liên kết cứng thì viết lại MỌI bản đang chia sẻ nó, vì <code>cp</code> cắt trắng tại chỗ và giữ nguyên inode, còn <code>mv</code> thì thay mục thư mục nên không (1.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your deploy rsyncs the working tree and excludes node_modules, .git and dist. What is still likely to reach the server that should not?|||Quy trình deploy của bạn rsync cây làm việc và loại trừ node_modules, .git và dist. Thứ gì VẪN có khả năng lên tới máy chủ mà lẽ ra không nên?',
            options: [
              'Nothing — those are the three that matter|||Không gì cả — đó là ba thứ đáng kể',
              'The .env with live credentials, user uploads, logs and editor backups — an exclude list only blocks what you remembered to name, and it does not consult .gitignore|||Tệp .env chứa thông tin đăng nhập thật, tệp người dùng tải lên, log và bản sao lưu của trình soạn thảo — danh sách loại trừ chỉ chặn thứ bạn NHỚ mà nêu tên, và nó không hề ngó tới .gitignore',
              'Only files larger than a megabyte|||Chỉ những tệp lớn hơn một megabyte',
              'Nothing, because rsync reads .gitignore automatically|||Không gì cả, vì rsync tự đọc .gitignore',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'Why is copying node_modules from your laptop to the server a problem even when the lockfile matches?|||Vì sao chép node_modules từ laptop lên máy chủ vẫn là vấn đề ngay cả khi tệp khoá khớp?',
            options: [
              'It is slower than installing|||Nó chậm hơn là cài lại',
              'Packages with native code are compiled for the machine that installed them — the lockfile pins versions, not platforms, which is the shape of the glibc-in-a-musl-image outage|||Những gói có mã native được biên dịch cho đúng cái máy đã cài chúng — tệp khoá ghim PHIÊN BẢN chứ không ghim NỀN TẢNG, và đó là hình dạng của sự cố engine glibc nằm trong ảnh musl',
              'npm forbids it|||npm cấm làm thế',
              'It is fine as long as both machines run Node 22|||Không sao cả, miễn hai máy cùng chạy Node 22',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Two builds of the same commit produced different sha256 sums. The tar contents are identical. What is the most likely cause?|||Hai lần dựng của cùng một commit cho ra hai mã sha256 khác nhau. Nội dung tar thì y hệt. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'git archive is not deterministic|||git archive không tất định',
              'gzip compressed a named file and recorded its mtime in bytes 5-8 of the header — use gzip -n, or compress from a pipe|||gzip đã nén một tệp CÓ TÊN và ghi mtime của nó vào byte 5-8 của header — hãy dùng gzip -n, hoặc nén từ một ống dẫn',
              'The commit hash changed|||Mã băm commit đã đổi',
              'Different compression levels|||Mức nén khác nhau',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A deploy script runs npm install on the server. package.json and the lockfile have drifted out of sync. What happens?|||Một script deploy chạy npm install trên máy chủ. package.json và tệp khoá đã trôi lệch nhau. Chuyện gì xảy ra?',
            options: [
              'The deploy fails safely|||Lần deploy hỏng một cách an toàn',
              'It silently installs a different version, rewrites the lockfile inside the release and exits 0 — so production runs something that was never tested|||Nó lặng lẽ cài một phiên bản khác, ghi lại tệp khoá bên trong bản phát hành rồi thoát ra 0 — nên production chạy một thứ chưa từng được kiểm thử',
              'npm prints a warning and stops|||npm in một cảnh báo rồi dừng',
              'It installs the lockfile version and ignores package.json|||Nó cài phiên bản trong tệp khoá và bỏ qua package.json',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A deploy script has set -e at the top, and a step written as npm ci || echo "canh bao". The npm ci fails. What does the script do?|||Một script deploy có set -e ở đầu, và một bước viết là npm ci || echo "canh bao". Lệnh npm ci hỏng. Script làm gì?',
            options: [
              'Stops immediately, because set -e is active|||Dừng ngay, vì set -e đang bật',
              'Continues — set -e does not apply to a command that is part of a && or || list, so every later step runs against a half-built release|||Đi tiếp — set -e KHÔNG áp cho một lệnh nằm trong danh sách && hoặc ||, nên mọi bước sau đó chạy trên một bản phát hành dựng dở',
              'Retries the command|||Thử lại lệnh đó',
              'Stops, but only after printing the warning|||Dừng, nhưng chỉ sau khi in cảnh báo',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Your /version endpoint reports commit 4d0c4ac. git log on the deployed branch shows HEAD is 962ceea, whose parent is 4d0c4ac. What went wrong?|||Endpoint /version của bạn báo commit 4d0c4ac. Lệnh git log trên nhánh đã deploy cho thấy HEAD là 962ceea, mà cha của nó là 4d0c4ac. Sai ở đâu?',
            options: [
              'The deploy shipped the wrong commit|||Lần deploy đã gửi nhầm commit',
              'The version file is committed to the repository, so it can only ever name the commit before the one containing it — stamp it during the build instead|||Tệp phiên bản được commit vào kho mã, nên nó chỉ có thể gọi tên commit TRƯỚC cái commit chứa nó — hãy đóng dấu nó trong lúc DỰNG',
              'The server needs a restart|||Máy chủ cần khởi động lại',
              'git rev-parse returned a stale value|||git rev-parse trả về một giá trị cũ',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'You use rsync --link-dest so five releases share unchanged files. Someone edits a config file inside the current release with a text editor. What is the effect?|||Bạn dùng rsync --link-dest để năm bản phát hành chia sẻ những tệp không đổi. Có người mở trình soạn thảo sửa một tệp cấu hình bên trong bản hiện hành. Hậu quả là gì?',
            options: [
              'Only the current release changes|||Chỉ bản hiện hành thay đổi',
              'Every release sharing that file changes, because they are one inode — so the rollback target now contains the edit you would be rolling back from|||MỌI bản phát hành đang chia sẻ tệp đó đều thay đổi, vì chúng là MỘT inode — nên cái đích lùi bản giờ chứa đúng cái sửa đổi mà bạn định lùi khỏi',
              'The edit is rejected by the filesystem|||Hệ tệp từ chối cú sửa đó',
              'A copy is made automatically|||Một bản sao được tạo tự động',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Your pruner keeps the newest five releases and deletes the rest. Yesterday you rolled back to an older release. What can happen?|||Bộ dọn dẹp của bạn giữ năm bản mới nhất và xoá phần còn lại. Hôm qua bạn đã lùi về một bản cũ hơn. Chuyện gì có thể xảy ra?',
            options: [
              'Nothing — the symlink protects its target|||Không gì cả — symlink tự bảo vệ đích của nó',
              'The pruner deletes the release the symlink points at, leaving a dangling link; nothing errors at delete time and the site fails on the next request or restart|||Bộ dọn dẹp xoá đúng cái bản mà symlink đang trỏ vào, để lại một liên kết treo; lúc xoá không có lỗi nào và website hỏng ở request hoặc lần khởi động lại kế tiếp',
              'The rollback is undone automatically|||Cú lùi bản tự động bị hoàn tác',
              'Only the disk usage changes|||Chỉ mức dùng đĩa thay đổi',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
