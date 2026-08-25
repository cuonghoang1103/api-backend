const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 4 — Configuration and secrets|||Chương 4 — Cấu hình và bí mật',
  description: 'Cái biến môi trường thiếu ở Bài 0.3 nên sống ở đâu. Chương này đo một tệp .env được hai bộ phân tích đọc ra hai kết quả khác nhau ở năm trên bảy dòng, một mật khẩu bị cắt cụt trong im lặng, và một bí mật vẫn đọc được nguyên vẹn sau khi đã bị xoá khỏi kho mã.',
  lessons: [

    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — Configuration lives outside the artifact|||4.1 — Cấu hình sống ngoài tạo tác',
      slug: 'deploy-4-1-cau-hinh-song-ngoai-tao-tac',
      type: 'LESSON',
      description: 'Cấu hình đặt ở thư mục dùng chung thì sống sót qua deploy, qua đổi giá trị, và qua cả một cú lùi bản — đo cả bốn bước. Kèm lý do vì sao việc nó KHÔNG lùi theo mã lại là điều bạn muốn, cho tới cái ngày nó không còn muốn nữa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Configuration lives outside the artifact</h2>
<p class="lead">Lesson 0.3 measured the deploy that passed three of four checks while every request returned 500, because one environment variable was missing. Lesson 1.1 measured the opposite failure: a <code>.env</code> shipped <em>inside</em> the artifact, carrying a live database password and overwriting the server's own settings. This lesson is the arrangement that avoids both.</p>

<h3>The rule, and the reason</h3>
<div class="callout ok"><strong>Configuration is not part of the artifact.</strong> The same artifact must be deployable to staging and production without rebuilding — which is only true if everything that differs between them lives outside it. That is factor III of the twelve-factor list, and it is the whole of this chapter in one sentence.</div>
<pre><code>/srv/app/
├── phat-hanh/
│   ├── 2026-08-24-0902-c1d773/
│   │   ├── .env      -&gt; /srv/app/chung/.env        <span class="tok-comment"># lien ket mem</span>
│   │   └── tai-len/  -&gt; /srv/app/chung/tai-len/
│   └── 2026-08-24-1147-0f92aa/
│       ├── .env      -&gt; /srv/app/chung/.env        <span class="tok-comment"># CUNG mot tep</span>
│       └── tai-len/  -&gt; /srv/app/chung/tai-len/
├── hien-tai -&gt; phat-hanh/2026-08-24-1147-0f92aa
└── chung/                                          <span class="tok-comment"># deploy KHONG BAO GIO dung vao</span>
    ├── .env
    └── tai-len/</code></pre>

<h3>Measured across a deploy, a config change, and a rollback</h3>
<div class="out">  v1 doc duoc: DATABASE_URL=postgres://prod
  --- deploy v2 (doi symlink) ---
  v2 doc duoc: DATABASE_URL=postgres://prod
  --- doi cau hinh o CHUNG ---
  v2 doc duoc: DATABASE_URL=postgres://prod-MOI
  --- LUI ve v1 ---
  v1 doc duoc: DATABASE_URL=postgres://prod-MOI   ← cau hinh KHONG bi lui theo</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A deploy does not touch it</span><span class="v">v2 read exactly what v1 read. The new release directory contains a symlink, not a file, so nothing the deploy writes can overwrite the real one.</span></div>
  <div class="kv"><span class="k">Changing it affects the running release immediately</span><span class="v">One edit to the shared file, and the next read gets the new value. No deploy required to change a setting — which is what you want at 3 a.m. when a third-party API key needs rotating.</span></div>
  <div class="kv"><span class="k">A rollback does not revert it</span><span class="v">Going back to v1 kept the <em>new</em> configuration. Code and configuration roll back independently, because they are different things with different lifetimes.</span></div>
  <div class="kv"><span class="k">And that last one cuts both ways</span><span class="v">Usually right — you rarely want to un-rotate a key. Occasionally wrong — see the pitfall below.</span></div>
</div>
<div class="pitfall"><strong>Trap — a rollback that does not revert configuration can roll back into a version that cannot read it.</strong> Deploy v2, which renames <code>DB_URL</code> to <code>DATABASE_URL</code> and updates the shared <code>.env</code> to match. Then roll back to v1, which still looks for <code>DB_URL</code> — and finds nothing, because the shared file no longer has it. The rollback completes successfully and the site stays broken, which is the worst possible outcome for a rollback. The fix is to make configuration changes <em>additive</em> across a deploy: add the new name, deploy code that reads either, and only remove the old name a deploy later. It is the same shape as the schema-migration ordering in Chapter 5, and for the same reason.</div>

<h3>Linking it in, at the right moment</h3>
<pre><code><span class="tok-comment"># trong script deploy, SAU khi giai nen, TRUOC khi trao symlink</span>
ln -sfn /srv/app/chung/.env       "\$BAN/.env"
ln -sfn /srv/app/chung/tai-len    "\$BAN/tai-len"
ln -sfn /srv/app/chung/log        "\$BAN/log"

<span class="tok-comment"># hoac bo qua han .env va nap thang trong unit systemd (Bai 3.4)</span>
<span class="tok-comment">#   EnvironmentFile=/srv/app/chung/.env</span></code></pre>
<div class="note-ct">The systemd form is cleaner where it applies: the application never sees a <code>.env</code> file at all, it just has environment variables, and there is one fewer symlink to get wrong. The symlink form is what you need when a framework insists on reading <code>.env</code> itself, or when the same directory has to work under Docker, systemd and a developer running it by hand.</div>

<h3>What belongs in configuration, and what does not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Anything that differs between environments</span><span class="lz-d">Database URLs, API endpoints, bucket names, log levels, feature flags, worker counts. If staging and production disagree about it, it is configuration by definition.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Anything secret</span><span class="lz-d">Passwords, tokens, signing keys, private keys. Secrets are a subset of configuration with stricter handling — Lesson 4.4.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Anything the same everywhere</span><span class="lz-d">Route definitions, timeout constants your code chose, validation rules. Putting these in environment variables produces a <code>.env</code> with sixty entries where nobody can tell which four actually matter.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Anything the code needs to be correct about</span><span class="lz-d">A value that breaks the application when wrong, and that has exactly one right answer, belongs in the code where it can be reviewed and tested — not in a file on a server that nobody diffs.</span></div>
</div>
<div class="callout warn"><strong>An environment variable that is missing should stop the process, not default.</strong> The failure in Lesson 0.3 — a healthy-looking process returning 500 to everything — happens when code reads <code>process.env.DATABASE_URL</code>, gets <code>undefined</code>, and carries on. Validate at startup and exit non-zero if something required is absent: then the service manager reports a failed start, the deploy's readiness check never passes, and the swap in Chapter 3 never happens. A missing variable becomes a failed deploy instead of a broken site.</div>
<pre><code><span class="tok-comment">// dau vao cua ung dung, truoc khi lang nghe cong</span>
const BAT_BUOC = ['DATABASE_URL', 'JWT_SECRET', 'R2_BUCKET'];
const thieu = BAT_BUOC.filter(k =&gt; !process.env[k]);
if (thieu.length) {
  console.error('Thieu bien moi truong bat buoc:', thieu.join(', '));
  process.exit(1);          <span class="tok-comment">// khac 0 ⇒ deploy DUNG LAI</span>
}</code></pre>

<h3>Keeping the list honest</h3>
<p>A <code>.env.example</code> committed to the repository is the documentation, and it is the only part of configuration that belongs in git — names and dummy values, never real ones. The measurement that keeps it true is a diff:</p>
<pre><code><span class="tok-comment"># bien nao co trong .env.example ma THIEU tren may chu?</span>
comm -23 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)

<span class="tok-comment"># va nguoc lai: bien nao tren may chu ma khong ai ghi lai?</span>
comm -13 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)</code></pre>
<div class="note-ct">Both directions matter. The first finds the variable your new code needs and nobody added to the server — the Lesson 0.3 failure, caught before deploying instead of after. The second finds settings that exist only on the server, which is how a machine becomes impossible to rebuild: something depends on a value that is written down nowhere. Run the second one on a server you inherited; the list is usually longer than anyone expects.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — III. Config</span><span class="lc-sub">12factor.net/config — the "could you open-source this repo right now without leaking credentials?" test, which is the sharpest one-line version of this lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.exec(5) — EnvironmentFile</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.exec.html — loading configuration into a service without the application knowing about files at all.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">comm(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/comm.1.html — the three-column set comparison behind the drift check above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — env_file, environment, and build args</span><span class="lc-sub">/courses/docker/learn${REF} — the container version of this arrangement, where the same distinction appears as three different Compose keys.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Cấu hình sống ngoài tạo tác</h2>
<p class="lead">Bài 0.3 đã đo lần deploy qua được ba trên bốn phép kiểm trong khi mọi request trả về 500, chỉ vì thiếu MỘT biến môi trường. Bài 1.1 đo kiểu hỏng ngược lại: một tệp <code>.env</code> gửi đi <em>BÊN TRONG</em> tạo tác, mang theo mật khẩu cơ sở dữ liệu đang sống và ghi đè lên thiết lập của chính máy chủ. Bài này là cách bố trí né được cả hai.</p>

<h3>Cái luật, và lý do</h3>
<div class="callout ok"><strong>Cấu hình KHÔNG phải một phần của tạo tác.</strong> Cùng một tạo tác phải deploy được lên staging lẫn production mà không cần dựng lại — mà điều đó chỉ đúng khi MỌI THỨ khác nhau giữa hai bên đều nằm bên ngoài nó. Đó là yếu tố III trong danh sách mười hai yếu tố, và nó là toàn bộ chương này gói trong một câu.</div>
<pre><code>/srv/app/
├── phat-hanh/
│   ├── 2026-08-24-0902-c1d773/
│   │   ├── .env      -&gt; /srv/app/chung/.env        <span class="tok-comment"># lien ket mem</span>
│   │   └── tai-len/  -&gt; /srv/app/chung/tai-len/
│   └── 2026-08-24-1147-0f92aa/
│       ├── .env      -&gt; /srv/app/chung/.env        <span class="tok-comment"># CUNG mot tep</span>
│       └── tai-len/  -&gt; /srv/app/chung/tai-len/
├── hien-tai -&gt; phat-hanh/2026-08-24-1147-0f92aa
└── chung/                                          <span class="tok-comment"># deploy KHONG BAO GIO dung vao</span>
    ├── .env
    └── tai-len/</code></pre>

<h3>Đo xuyên qua một lần deploy, một lần đổi cấu hình, và một cú lùi bản</h3>
<div class="out">  v1 doc duoc: DATABASE_URL=postgres://prod
  --- deploy v2 (doi symlink) ---
  v2 doc duoc: DATABASE_URL=postgres://prod
  --- doi cau hinh o CHUNG ---
  v2 doc duoc: DATABASE_URL=postgres://prod-MOI
  --- LUI ve v1 ---
  v1 doc duoc: DATABASE_URL=postgres://prod-MOI   ← cau hinh KHONG bi lui theo</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một lần deploy KHÔNG đụng vào nó</span><span class="v">v2 đọc ra ĐÚNG cái v1 đọc. Thư mục bản phát hành mới chứa một liên kết mềm chứ không phải một tệp, nên chẳng thứ gì lần deploy ghi ra có thể ghi đè lên cái tệp thật.</span></div>
  <div class="kv"><span class="k">Đổi nó thì bản đang chạy nhận ngay</span><span class="v">Một lần sửa tệp dùng chung, và lần đọc kế tiếp lấy giá trị mới. KHÔNG cần deploy để đổi một thiết lập — đó là thứ bạn muốn lúc 3 giờ sáng khi một khoá API của bên thứ ba cần xoay.</span></div>
  <div class="kv"><span class="k">Một cú lùi bản KHÔNG hoàn tác nó</span><span class="v">Quay về v1 vẫn giữ cấu hình MỚI. Mã và cấu hình lùi bản ĐỘC LẬP với nhau, vì chúng là hai thứ khác nhau với vòng đời khác nhau.</span></div>
  <div class="kv"><span class="k">Và điều cuối đó cắt cả hai chiều</span><span class="v">Thường là ĐÚNG — bạn hiếm khi muốn xoay-ngược một cái khoá. Thi thoảng là SAI — xem hộp bẫy dưới đây.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một cú lùi bản KHÔNG hoàn tác cấu hình có thể lùi vào một phiên bản KHÔNG ĐỌC NỔI cấu hình đó.</strong> Deploy v2, bản này đổi tên <code>DB_URL</code> thành <code>DATABASE_URL</code> và sửa tệp <code>.env</code> dùng chung cho khớp. Rồi lùi về v1, bản vẫn đi tìm <code>DB_URL</code> — và không thấy gì, vì tệp dùng chung không còn cái tên đó nữa. Cú lùi bản HOÀN TẤT THÀNH CÔNG và website vẫn hỏng, mà đó là kết cục tệ nhất có thể có cho một cú lùi bản. Cách sửa là làm cho các thay đổi cấu hình mang tính <em>CỘNG THÊM</em> xuyên qua một lần deploy: thêm tên mới, deploy mã đọc được cả hai, và chỉ gỡ tên cũ ở một lần deploy SAU. Nó cùng hình dạng với chuyện thứ tự migration lược đồ ở Chương 5, và vì cùng một lý do.</div>

<h3>Liên kết nó vào, đúng thời điểm</h3>
<pre><code><span class="tok-comment"># trong script deploy, SAU khi giai nen, TRUOC khi trao symlink</span>
ln -sfn /srv/app/chung/.env       "\$BAN/.env"
ln -sfn /srv/app/chung/tai-len    "\$BAN/tai-len"
ln -sfn /srv/app/chung/log        "\$BAN/log"

<span class="tok-comment"># hoac bo qua han .env va nap thang trong unit systemd (Bai 3.4)</span>
<span class="tok-comment">#   EnvironmentFile=/srv/app/chung/.env</span></code></pre>
<div class="note-ct">Dạng systemd gọn hơn ở chỗ nó áp dụng được: ứng dụng KHÔNG hề nhìn thấy một tệp <code>.env</code> nào cả, nó chỉ có các biến môi trường, và bớt được một cái symlink có thể làm sai. Dạng symlink là thứ bạn cần khi một framework khăng khăng tự đọc <code>.env</code>, hoặc khi cùng một thư mục phải chạy được dưới Docker, dưới systemd và dưới tay một lập trình viên chạy nó thủ công.</div>

<h3>Cái gì thuộc về cấu hình, và cái gì thì không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Mọi thứ KHÁC NHAU giữa các môi trường</span><span class="lz-d">URL cơ sở dữ liệu, điểm cuối API, tên bucket, mức log, cờ tính năng, số worker. Nếu staging và production bất đồng về nó thì theo định nghĩa nó là cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Mọi thứ BÍ MẬT</span><span class="lz-d">Mật khẩu, token, khoá ký, khoá riêng tư. Bí mật là một tập con của cấu hình với cách xử lý ngặt hơn — Bài 4.4.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Mọi thứ GIỐNG NHAU ở mọi nơi</span><span class="lz-d">Khai báo tuyến, hằng số timeout do chính mã bạn chọn, luật kiểm tra dữ liệu. Nhét mấy thứ này vào biến môi trường thì sinh ra một tệp <code>.env</code> sáu mươi dòng mà chẳng ai biết được BỐN dòng nào mới thật sự quan trọng.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Mọi thứ mà mã BẮT BUỘC phải đúng</span><span class="lz-d">Một giá trị mà sai thì ứng dụng vỡ, và chỉ có ĐÚNG MỘT đáp án đúng, thì thuộc về MÃ NGUỒN nơi nó được review và kiểm thử — chứ không thuộc về một tệp nằm trên máy chủ mà chẳng ai so sánh bao giờ.</span></div>
</div>
<div class="callout warn"><strong>Một biến môi trường bị THIẾU thì phải làm DỪNG tiến trình, đừng lấy giá trị mặc định.</strong> Kiểu hỏng ở Bài 0.3 — một tiến trình trông khoẻ mạnh trả 500 cho tất cả — xảy ra khi mã đọc <code>process.env.DATABASE_URL</code>, nhận về <code>undefined</code>, rồi cứ thế đi tiếp. Hãy kiểm ngay lúc khởi động và thoát ra KHÁC 0 nếu thiếu thứ bắt buộc: khi đó trình quản lý dịch vụ báo một lần khởi động thất bại, phép kiểm sẵn sàng của lần deploy không bao giờ qua, và bước tráo ở Chương 3 không bao giờ xảy ra. Một biến bị thiếu trở thành một LẦN DEPLOY HỎNG thay vì một WEBSITE HỎNG.</div>
<pre><code><span class="tok-comment">// dau vao cua ung dung, truoc khi lang nghe cong</span>
const BAT_BUOC = ['DATABASE_URL', 'JWT_SECRET', 'R2_BUCKET'];
const thieu = BAT_BUOC.filter(k =&gt; !process.env[k]);
if (thieu.length) {
  console.error('Thieu bien moi truong bat buoc:', thieu.join(', '));
  process.exit(1);          <span class="tok-comment">// khac 0 ⇒ deploy DUNG LAI</span>
}</code></pre>

<h3>Giữ cho cái danh sách đó trung thực</h3>
<p>Một tệp <code>.env.example</code> commit vào kho mã chính là tài liệu, và nó là phần DUY NHẤT của cấu hình thuộc về git — TÊN biến và giá trị giả, không bao giờ giá trị thật. Phép đo giữ cho nó đúng là một lệnh so sánh:</p>
<pre><code><span class="tok-comment"># bien nao co trong .env.example ma THIEU tren may chu?</span>
comm -23 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)

<span class="tok-comment"># va nguoc lai: bien nao tren may chu ma khong ai ghi lai?</span>
comm -13 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)</code></pre>
<div class="note-ct">Cả HAI chiều đều quan trọng. Chiều thứ nhất tìm ra cái biến mà mã mới của bạn cần và chẳng ai thêm lên máy chủ — đúng kiểu hỏng ở Bài 0.3, bắt được TRƯỚC khi deploy thay vì sau. Chiều thứ hai tìm ra những thiết lập chỉ tồn tại trên máy chủ, và đó là cách một cái máy trở nên KHÔNG DỰNG LẠI NỔI: có thứ gì đó phụ thuộc vào một giá trị chẳng được ghi ở đâu cả. Hãy chạy chiều thứ hai trên một máy chủ bạn vừa tiếp quản; cái danh sách thường dài hơn mọi người tưởng.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — III. Config</span><span class="lc-sub">12factor.net/config — phép thử "bạn có dám mở mã nguồn kho này ngay bây giờ mà không lộ thông tin đăng nhập nào không?", phiên bản một dòng sắc nhất của bài này.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.exec(5) — EnvironmentFile</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.exec.html — nạp cấu hình vào một dịch vụ mà ứng dụng hoàn toàn không biết tới tệp nào.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">comm(1)</span><span class="lc-sub">man7.org/linux/man-pages/man1/comm.1.html — phép so tập hợp ba cột nằm sau lệnh kiểm trôi lệch ở trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — env_file, environment và build args</span><span class="lc-sub">/courses/docker/learn${REF} — phiên bản container của cách bố trí này, nơi cùng một phân biệt ấy hiện ra thành ba khoá Compose khác nhau.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — Build time and run time are different moments|||4.2 — Lúc DỰNG và lúc CHẠY là hai thời điểm khác nhau',
      slug: 'deploy-4-2-luc-dung-va-luc-chay',
      type: 'LESSON',
      description: 'Hai biến trong cùng một tệp, đổi cùng một giá trị môi trường, khởi động lại: một cái đổi theo, một cái không. Đo cả ba trạng thái — và giải thích vì sao đổi NEXT_PUBLIC_* rồi restart thì chẳng có tác dụng gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Build time and run time are different moments</h2>
<p class="lead">Some configuration is read when the process starts. Some is written into the files during the build and cannot change afterwards. They look identical in the source, and confusing them produces a change that appears to have no effect at all.</p>

<h3>Two variables, one file, measured</h3>
<pre><code><span class="tok-comment">// gia tri nay duoc DOC luc CHAY</span>
const luc_chay = process.env.API_URL;

<span class="tok-comment">// gia tri nay duoc THAY luc DUNG (bundler lam dung viec nay)</span>
const luc_dung = "__API_URL__";</code></pre>
<div class="out">════ DUNG voi API_URL=https://api.cu.com ════
  trong dist: "https://api.cu.com"

════ gio DOI env roi CHAY LAI (khong dung lai) ════
  doc luc chay:   https://api.MOI.com
  nuong luc dung: https://api.cu.com

════ chi khi DUNG LAI thi no moi doi ════
  doc luc chay:   https://api.MOI.com
  nuong luc dung: https://api.MOI.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The run-time read followed the new value</span><span class="v">Change the variable, restart, done. This is what everyone expects configuration to do.</span></div>
  <div class="kv"><span class="k">The build-time value did not</span><span class="v">It is not reading an environment variable at all any more — the string is <em>inside</em> the built file. Restarting re-reads the same file and gets the same string.</span></div>
  <div class="kv"><span class="k">Only rebuilding changed it</span><span class="v">Because the substitution happens during the build. The environment at run time is irrelevant; the environment at <em>build</em> time is what mattered, and that moment has passed.</span></div>
  <div class="kv"><span class="k">Nothing warns you</span><span class="v">No error, no log line. You edit <code>.env</code>, restart, test, and see the old value — which reads as "the restart did not take" and sends people to check the wrong thing.</span></div>
</div>

<h3>Where this bites in practice</h3>
<div class="callout warn"><strong>Anything a browser runs is baked at build time.</strong> A front-end bundle is a static file downloaded by a browser — there is no server-side environment for it to read. So every framework has a mechanism for inlining values during the build, and every one of them has this property: <code>NEXT_PUBLIC_*</code> in Next.js, <code>VITE_*</code> in Vite, <code>REACT_APP_*</code> in Create React App. Change one on the server and restart, and nothing whatsoever happens. The value is in a JavaScript file that was written weeks ago.</div>
<p>This project has the incident on record. A GIF picker called a third-party API directly from the browser using a key baked in at build time. The key was absent when the bundle was built, so the library fell back to its own public demo key — which had been revoked — and every request returned 403. Nothing in the deploy was wrong: the environment variable existed on the server, the container had it, the restart worked. It just was not the moment that mattered.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build-time values must be present when you build</span><span class="lz-d">Which means the build machine needs them — in CI secrets, in <code>docker build --build-arg</code>, in the environment of whatever runs <code>npm run build</code>. A missing one usually produces <code>undefined</code> in the bundle rather than an error.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Changing one requires a rebuild and a redeploy</span><span class="lz-d">Not a restart. This is worth writing on the variable itself: a comment in <code>.env.example</code> saying <em>rebuild required</em> saves an hour every time someone new changes it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">They are public, permanently</span><span class="lz-d">The value is in a file the browser downloads. Anyone can read it. The naming conventions say so out loud — <code>PUBLIC</code> is in the name — and it is still the single most common place for a secret key to end up.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A third-party key must never be one</span><span class="lz-d">The fix this project used: a small authenticated backend route that proxies the call, with the key read from run-time environment on the server. The browser talks to your API; your API talks to the third party. Rotating the key becomes a restart instead of a rebuild.</span></div>
</div>

<h3>Telling them apart</h3>
<pre><code><span class="tok-comment"># gia tri co nam TRONG goi da dung khong? (⇒ luc DUNG, va CONG KHAI)</span>
grep -r "api.cu.com" dist/ .next/ build/ 2&gt;/dev/null

<span class="tok-comment"># tien trinh dang chay THAT SU thay nhung bien nao? (⇒ luc CHAY)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js' | head -1)/environ | sort

<span class="tok-comment"># trinh duyet thay gi — phep thu cuoi cung, tren chinh trang that</span>
curl -s https://cuongthai.com/_next/static/chunks/main-*.js | grep -o 'https://[a-z.]*'</code></pre>
<div class="note-ct">The second command is the one worth remembering. <code>/proc/&lt;pid&gt;/environ</code> is the environment the process actually received — not what is in <code>.env</code>, not what your shell has, not what the unit file says. When a variable "should be set" and the application disagrees, this settles it in one line. Note the null separators: environment entries are <code>\\0</code>-delimited, which is why the <code>tr</code> is needed.</div>

<h3>A third moment: image build time</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ARG</code> — available while building the image</span><span class="lz-lnote">Passed with <code>--build-arg</code>, visible to <code>RUN</code> steps, and gone once the image exists. This is the moment a front-end bundle is produced, so build-time front-end variables have to arrive here.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ENV</code> — baked into the image, visible at run time</span><span class="lz-lnote">Part of the image, so the same for every container from it — and readable by anyone who can pull the image. Fine for <code>NODE_ENV=production</code>, wrong for anything secret.</span></div>
  <div class="lz-layer"><span class="lz-lname">Compose <code>environment</code> / <code>env_file</code> — run time</span><span class="lz-lnote">Supplied when the container starts, so it can differ per environment and can be changed with a restart. This is where secrets belong of the three.</span></div>
  <div class="lz-layer"><span class="lz-lname">And a build arg is not a secret either</span><span class="lz-lnote">It appears in the image history — <code>docker history</code> shows it. Passing a token as <code>--build-arg</code> publishes it to anyone with the image. Use <code>RUN --mount=type=secret</code> when a build genuinely needs a credential.</span></div>
</div>
<div class="pitfall"><strong>Trap — a value baked at build time makes one artifact per environment.</strong> If the production bundle contains <code>https://api.cuongthai.com</code> and the staging bundle contains <code>https://api.staging.cuongthai.com</code>, they are different artifacts — so the thing you tested in staging is not the thing you deployed, which is exactly what Lesson 1.2 was built to prevent. Where it matters, the escape is to have the browser fetch its configuration at run time from your own server: one artifact, a small <code>/config.json</code> endpoint, and the twelve-factor property is restored.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Next.js — environment variables and NEXT_PUBLIC_</span><span class="lc-sub">nextjs.org/docs/app/building-your-application/configuring/environment-variables — the sentence stating that these are inlined at build time, which is the whole lesson.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — ARG, ENV, and build secrets</span><span class="lc-sub">docs.docker.com/build/building/secrets — why <code>--build-arg</code> is not a secret mechanism, and what to use instead.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — the environ file</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc.html — the environment a running process actually holds, null-separated.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js &amp; React — where configuration is read</span><span class="lc-sub">/courses/nextjs/learn${REF} — server components, client components, and which of them can see a run-time variable at all.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Lúc DỰNG và lúc CHẠY là hai thời điểm khác nhau</h2>
<p class="lead">Có cấu hình được ĐỌC lúc tiến trình khởi động. Có cấu hình được VIẾT THẲNG vào tệp trong lúc dựng và sau đó không đổi được nữa. Trong mã nguồn chúng trông y hệt nhau, và nhầm lẫn hai thứ đó sinh ra một thay đổi có vẻ như CHẲNG có tác dụng gì.</p>

<h3>Hai biến, một tệp, đo thật</h3>
<pre><code><span class="tok-comment">// gia tri nay duoc DOC luc CHAY</span>
const luc_chay = process.env.API_URL;

<span class="tok-comment">// gia tri nay duoc THAY luc DUNG (bundler lam dung viec nay)</span>
const luc_dung = "__API_URL__";</code></pre>
<div class="out">════ DUNG voi API_URL=https://api.cu.com ════
  trong dist: "https://api.cu.com"

════ gio DOI env roi CHAY LAI (khong dung lai) ════
  doc luc chay:   https://api.MOI.com
  nuong luc dung: https://api.cu.com

════ chi khi DUNG LAI thi no moi doi ════
  doc luc chay:   https://api.MOI.com
  nuong luc dung: https://api.MOI.com</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giá trị đọc lúc CHẠY đi theo giá trị mới</span><span class="v">Đổi biến, khởi động lại, xong. Đây là thứ ai cũng trông đợi ở cấu hình.</span></div>
  <div class="kv"><span class="k">Giá trị nướng lúc DỰNG thì KHÔNG</span><span class="v">Nó không còn ĐỌC một biến môi trường nào nữa — cái chuỗi đó nằm <em>BÊN TRONG</em> tệp đã dựng. Khởi động lại là đọc lại đúng cái tệp đó và nhận đúng cái chuỗi đó.</span></div>
  <div class="kv"><span class="k">Chỉ DỰNG LẠI mới đổi được nó</span><span class="v">Vì việc thay thế xảy ra TRONG LÚC DỰNG. Môi trường lúc chạy chẳng liên quan; môi trường lúc <em>DỰNG</em> mới là thứ quan trọng, và cái thời điểm ấy đã trôi qua.</span></div>
  <div class="kv"><span class="k">Chẳng có gì cảnh báo bạn</span><span class="v">Không lỗi, không dòng log nào. Bạn sửa <code>.env</code>, khởi động lại, thử, và thấy giá trị CŨ — điều đó đọc thành "cú restart không ăn" và đẩy người ta đi kiểm nhầm chỗ.</span></div>
</div>

<h3>Chỗ nó cắn trong thực tế</h3>
<div class="callout warn"><strong>Mọi thứ TRÌNH DUYỆT chạy đều được nướng lúc dựng.</strong> Một gói front end là một tệp tĩnh do trình duyệt tải về — chẳng có môi trường phía máy chủ nào cho nó đọc cả. Nên mọi framework đều có một cơ chế nhúng giá trị vào trong lúc dựng, và cơ chế nào cũng mang tính chất này: <code>NEXT_PUBLIC_*</code> ở Next.js, <code>VITE_*</code> ở Vite, <code>REACT_APP_*</code> ở Create React App. Đổi một cái trên máy chủ rồi khởi động lại thì TUYỆT ĐỐI chẳng có gì xảy ra. Cái giá trị đó nằm trong một tệp JavaScript được viết ra từ mấy tuần trước.</div>
<p>Dự án này có sự cố đó trong hồ sơ. Một bộ chọn ảnh GIF gọi thẳng API bên thứ ba từ trình duyệt bằng một cái khoá nướng lúc dựng. Cái khoá không có mặt lúc gói được dựng, nên thư viện tự lùi về khoá demo công khai của chính nó — mà khoá đó đã bị thu hồi — và mọi request trả 403. Chẳng có gì trong lần deploy sai cả: biến môi trường CÓ trên máy chủ, container CÓ nó, cú restart CÓ chạy. Nó chỉ đơn giản là không phải cái thời điểm cần thiết.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Giá trị lúc dựng phải CÓ MẶT lúc bạn dựng</span><span class="lz-d">Nghĩa là máy dựng cần có chúng — trong secret của CI, trong <code>docker build --build-arg</code>, trong môi trường của bất cứ thứ gì chạy <code>npm run build</code>. Thiếu một cái thì thường sinh ra <code>undefined</code> trong gói chứ không sinh ra lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đổi một cái thì phải DỰNG LẠI và DEPLOY LẠI</span><span class="lz-d">Không phải khởi động lại. Điều này đáng ghi ngay lên chính cái biến đó: một dòng chú thích trong <code>.env.example</code> ghi <em>phải dựng lại</em> tiết kiệm được một giờ mỗi lần có người mới đụng vào nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chúng CÔNG KHAI, vĩnh viễn</span><span class="lz-d">Giá trị nằm trong một tệp mà trình duyệt tải về. Ai cũng đọc được. Chính quy ước đặt tên đã nói thẳng ra rồi — chữ <code>PUBLIC</code> nằm trong tên — và nó vẫn là chỗ phổ biến NHẤT để một cái khoá bí mật kết thúc cuộc đời.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Khoá của bên thứ ba thì TUYỆT ĐỐI không được là một cái như vậy</span><span class="lz-d">Cách sửa mà dự án này dùng: một tuyến backend nhỏ có xác thực đứng ra gọi hộ, với cái khoá đọc từ môi trường lúc CHẠY trên máy chủ. Trình duyệt nói chuyện với API của bạn; API của bạn nói chuyện với bên thứ ba. Xoay khoá trở thành một cú restart thay vì một lần dựng lại.</span></div>
</div>

<h3>Phân biệt chúng</h3>
<pre><code><span class="tok-comment"># gia tri co nam TRONG goi da dung khong? (⇒ luc DUNG, va CONG KHAI)</span>
grep -r "api.cu.com" dist/ .next/ build/ 2&gt;/dev/null

<span class="tok-comment"># tien trinh dang chay THAT SU thay nhung bien nao? (⇒ luc CHAY)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js' | head -1)/environ | sort

<span class="tok-comment"># trinh duyet thay gi — phep thu cuoi cung, tren chinh trang that</span>
curl -s https://cuongthai.com/_next/static/chunks/main-*.js | grep -o 'https://[a-z.]*'</code></pre>
<div class="note-ct">Lệnh thứ hai là lệnh đáng nhớ. <code>/proc/&lt;pid&gt;/environ</code> là môi trường mà tiến trình THẬT SỰ nhận được — không phải thứ nằm trong <code>.env</code>, không phải thứ shell của bạn có, không phải thứ tệp unit nói. Khi một biến "lẽ ra phải được đặt" mà ứng dụng thì không đồng ý, cái này phân xử trong một dòng. Để ý dấu phân cách null: các mục môi trường ngăn nhau bằng <code>\\0</code>, và đó là lý do cần tới lệnh <code>tr</code>.</div>

<h3>Một thời điểm thứ ba: lúc dựng ẢNH</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ARG</code> — có mặt TRONG LÚC dựng ảnh</span><span class="lz-lnote">Truyền vào bằng <code>--build-arg</code>, các bước <code>RUN</code> nhìn thấy được, và biến mất khi cái ảnh đã tồn tại. Đây chính là thời điểm một gói front end được sinh ra, nên biến front end kiểu-lúc-dựng buộc phải tới ở đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ENV</code> — nướng vào ảnh, nhìn thấy được lúc chạy</span><span class="lz-lnote">Là một phần của cái ảnh, nên GIỐNG NHAU với mọi container sinh từ nó — và ai kéo được cái ảnh thì đọc được nó. Ổn cho <code>NODE_ENV=production</code>, SAI cho bất cứ thứ gì bí mật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Compose <code>environment</code> / <code>env_file</code> — lúc chạy</span><span class="lz-lnote">Cấp vào khi container khởi động, nên nó khác nhau được theo môi trường và đổi được bằng một cú restart. Trong ba cái thì đây mới là chỗ bí mật thuộc về.</span></div>
  <div class="lz-layer"><span class="lz-lname">Và một build arg cũng KHÔNG phải bí mật</span><span class="lz-lnote">Nó xuất hiện trong lịch sử của ảnh — <code>docker history</code> cho thấy nó. Truyền một cái token qua <code>--build-arg</code> là công bố nó cho bất cứ ai có cái ảnh. Dùng <code>RUN --mount=type=secret</code> khi một bước dựng thật sự cần tới một tín vật.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một giá trị nướng lúc dựng làm cho MỖI MÔI TRƯỜNG một tạo tác.</strong> Nếu gói production chứa <code>https://api.cuongthai.com</code> còn gói staging chứa <code>https://api.staging.cuongthai.com</code> thì chúng là HAI tạo tác khác nhau — nên thứ bạn kiểm thử ở staging KHÔNG phải thứ bạn deploy, mà đó đúng là điều Bài 1.2 được dựng ra để ngăn. Ở chỗ nào chuyện đó quan trọng thì đường thoát là để trình duyệt LẤY cấu hình của nó lúc CHẠY từ chính máy chủ của bạn: một tạo tác duy nhất, một endpoint <code>/config.json</code> nhỏ, và tính chất mười-hai-yếu-tố được khôi phục.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Next.js — biến môi trường và NEXT_PUBLIC_</span><span class="lc-sub">nextjs.org/docs/app/building-your-application/configuring/environment-variables — cái câu nói rằng chúng được nhúng vào LÚC DỰNG, và đó là toàn bộ bài học.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker — ARG, ENV và bí mật lúc dựng</span><span class="lc-sub">docs.docker.com/build/building/secrets — vì sao <code>--build-arg</code> KHÔNG phải một cơ chế bí mật, và nên dùng gì thay thế.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — tệp environ</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc.html — môi trường mà một tiến trình đang chạy thật sự đang giữ, ngăn nhau bằng ký tự null.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Next.js &amp; React — cấu hình được đọc ở đâu</span><span class="lc-sub">/courses/nextjs/learn${REF} — server component, client component, và cái nào trong số đó nhìn thấy nổi một biến lúc chạy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — The .env file is not one format|||4.3 — Tệp .env không phải MỘT định dạng',
      slug: 'deploy-4-3-env-khong-phai-mot-dinh-dang',
      type: 'LESSON',
      description: 'Cùng một tệp .env bảy dòng, đưa qua hai bộ phân tích: năm dòng ra kết quả KHÁC nhau. Một mật khẩu bị cắt cụt trong im lặng, một mật khẩu khác bị bung thành đường dẫn nhà của root, và một dòng làm shell cố chạy một lệnh không tồn tại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>The <code>.env</code> file is not one format</h2>
<p class="lead">Everyone treats <code>KEY=value</code> as obvious. It is not a specification — there is no standard for <code>.env</code> files, and every loader invented its own rules. The measurement below feeds one seven-line file to two common loaders and gets different answers on five of the seven.</p>

<h3>The file</h3>
<div class="out">DON_GIAN=abc
CO_KHOANG_TRANG=xin chao
TRONG_NHAY_KEP="co  hai khoang"
CO_DAU_THANG=mat#khau
CO_DOLLAR=$HOME/duong-dan
NOI_CHUOI=\${DON_GIAN}-them
CO_BANG=key=value=extra</div>

<h3>Two loaders, same file</h3>
<div class="out">════ 1) shell 'source' doc ra gi ════
./.env: line 2: chao: command not found
  DON_GIAN           = [abc]
  CO_KHOANG_TRANG    = []
  TRONG_NHAY_KEP     = [co  hai khoang]
  CO_DAU_THANG       = [mat#khau]
  CO_DOLLAR          = [/root/duong-dan]
  NOI_CHUOI          = [abc-them]
  CO_BANG            = [key=value=extra]

════ 2) node --env-file doc ra gi ════
  DON_GIAN           = [abc]
  CO_KHOANG_TRANG    = [xin chao]
  TRONG_NHAY_KEP     = [co  hai khoang]
  CO_DAU_THANG       = [mat]
  CO_DOLLAR          = [$HOME/duong-dan]
  NOI_CHUOI          = [\${DON_GIAN}-them]
  CO_BANG            = [key=value=extra]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">An unquoted space breaks the shell entirely</span><span class="v"><code>CO_KHOANG_TRANG=xin chao</code> made <code>source</code> try to <em>run a command called <code>chao</code></em>. The variable ends up empty, and there is an error line most deploy scripts discard.</span></div>
  <div class="kv"><span class="k">A <code>#</code> silently truncates under Node</span><span class="v"><code>mat#khau</code> became <code>mat</code>. Node treats the <code>#</code> as starting a comment. A password with a hash in it is now a <em>different</em> password, and the only symptom is an authentication failure against a file that looks correct.</span></div>
  <div class="kv"><span class="k">A <code>$</code> expands under the shell</span><span class="v"><code>\$HOME/duong-dan</code> became <code>/root/duong-dan</code>. A generated password containing <code>\$</code> is silently rewritten into something else — or into nothing, if the name after it is undefined.</span></div>
  <div class="kv"><span class="k">Interpolation works in one and not the other</span><span class="v"><code>\${DON_GIAN}-them</code> became <code>abc-them</code> under the shell and stayed literal under Node. Config that composes one value from another works on your machine and not on the server, or the reverse.</span></div>
</div>
<div class="pitfall"><strong>Trap — the two dangerous cases produce a wrong value, not an error.</strong> A truncated <code>#</code> password and an expanded <code>\$</code> password both give you a perfectly valid-looking string that is not the one you set. The application starts, connects, and is rejected — so the investigation goes to the database, the user, the network, and eventually to the password, which <em>looks right in the file</em>. Base64 and random generators emit <code>#</code> and <code>\$</code> regularly, so this is not exotic; it is the reason "the password works when I paste it manually" is a recognisable sentence.</div>

<h3>The rules that survive every loader</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Quote every value, always</span><span class="lz-d"><code>KEY="value"</code>. Not just the ones with spaces — every one. Double quotes are handled compatibly by all the loaders in this measurement, and the habit removes the entire class of problem rather than the instances you noticed.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Never rely on interpolation</span><span class="lz-d">Write the full value out. <code>\${OTHER}</code> works in some loaders and is literal in others, and which one you get depends on how the service happens to be started that day.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">No spaces around the equals sign</span><span class="lz-d"><code>KEY = value</code> is a shell syntax error and a silently ignored line elsewhere. <code>KEY=value</code>, always.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nothing multi-line</span><span class="lz-d">A private key or a certificate in a <code>.env</code> is a fight with every parser. Put it in a file and put the <em>path</em> in the variable.</span></div>
</div>
<pre><code><span class="tok-comment"># bang chinh cai tep o tren, viet lai cho AN TOAN</span>
DON_GIAN="abc"
CO_KHOANG_TRANG="xin chao"
TRONG_NHAY_KEP="co  hai khoang"
CO_DAU_THANG="mat#khau"
CO_DOLLAR="\$HOME/duong-dan"     <span class="tok-comment"># nhay kep VAN khong chan duoc shell bung bien</span>
NOI_CHUOI="abc-them"             <span class="tok-comment"># viet thang ra, dung noi chuoi</span>
CO_BANG="key=value=extra"</code></pre>
<div class="callout warn"><strong>One caveat the measurement forces me to state: double quotes do not stop the shell expanding <code>\$</code>.</strong> Under <code>source</code>, <code>"\$HOME/x"</code> still becomes <code>/root/x</code> — that is what double quotes mean in shell. Only single quotes prevent it, and single quotes are handled differently again by other loaders. If a value must contain a literal <code>\$</code> and something might <code>source</code> the file, the honest answer is to stop using a <code>.env</code> for that value and pass it another way.</div>

<h3>Verify rather than assume</h3>
<pre><code><span class="tok-comment"># cach DUY NHAT dang tin: hoi chinh tien trinh dang chay</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ | grep DATABASE_URL

<span class="tok-comment"># do dai co dung khong? (bat cat cut ma khong lo bi mat ra man hinh)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f node)/environ | awk -F= '/^DB_PASS/{print "do dai:", length(\$2)}'

<span class="tok-comment"># hai bo phan tich co doc giong nhau khong?</span>
diff &lt;(node --env-file=.env -e 'for(const[k,v]of Object.entries(process.env))console.log(k+"="+v)' | sort) \\
     &lt;(env -i bash -c 'set -a; . ./.env; set +a; env' | sort)</code></pre>
<div class="note-ct">The length check is the practical one for secrets. Printing a password into a terminal puts it in your shell history, your scrollback and possibly a screen recording; printing its <em>length</em> answers "was it truncated?" without exposing anything. A password you generated as 32 characters that arrives as 3 is the <code>#</code> bug, visible in one line.</div>

<h3>A third dialect, and why it matters here</h3>
<p>systemd's <code>EnvironmentFile</code> is a fourth set of rules again — its own quoting, its own escape handling, and no shell expansion at all. That is relevant because Lesson 3.4 put <code>EnvironmentFile=/srv/app/chung/.env</code> in the unit: the same file may be read by systemd in production, by <code>node --env-file</code> in development, and by a developer running <code>source .env</code> by hand. Three parsers, one file, and the rules above are what keep all three agreeing.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Best: do not have a .env at all in production</span><span class="lz-lnote">Environment variables set by the service manager, from a file only it reads. One parser instead of three, and the application never opens a file.</span></div>
  <div class="lz-layer"><span class="lz-lname">Good: one file, quoted values, no interpolation</span><span class="lz-lnote">What the rules above produce. Works under every loader, and stays working when someone changes how the service is started.</span></div>
  <div class="lz-layer"><span class="lz-lname">Risky: values with <code>#</code>, <code>\$</code>, quotes or newlines</span><span class="lz-lnote">If you cannot avoid them, verify through <code>/proc/&lt;pid&gt;/environ</code> after every change — and prefer regenerating a secret to fighting the parser.</span></div>
  <div class="lz-layer"><span class="lz-lname">Worst: a secret manager whose output is pasted into a .env</span><span class="lz-lnote">All the parsing risk, plus a copy of the secret on disk that nothing rotates. If you have a secret manager, have the application read from it — Lesson 4.5.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --env-file and its parsing rules</span><span class="lc-sub">nodejs.org/api/cli.html#--env-fileconfig — the documented behaviour, including the comment handling that truncated the password above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.exec(5) — EnvironmentFile syntax</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.exec.html#EnvironmentFile= — the third dialect, stated precisely, including what it does with quotes.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — QUOTING</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Quoting — why double quotes still expand <code>\$</code> and single quotes do not.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — quoting, expansion and the order they happen in</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the expansion rules that turned one of these values into a home directory.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Tệp <code>.env</code> không phải MỘT định dạng</h2>
<p class="lead">Ai cũng coi <code>KEY=value</code> là chuyện hiển nhiên. Nó KHÔNG phải một đặc tả — không hề có tiêu chuẩn nào cho tệp <code>.env</code>, và mỗi bộ nạp tự nghĩ ra luật riêng của nó. Phép đo dưới đây đưa MỘT tệp bảy dòng qua hai bộ nạp phổ biến và nhận về kết quả KHÁC nhau ở năm trên bảy dòng.</p>

<h3>Cái tệp</h3>
<div class="out">DON_GIAN=abc
CO_KHOANG_TRANG=xin chao
TRONG_NHAY_KEP="co  hai khoang"
CO_DAU_THANG=mat#khau
CO_DOLLAR=$HOME/duong-dan
NOI_CHUOI=\${DON_GIAN}-them
CO_BANG=key=value=extra</div>

<h3>Hai bộ nạp, cùng một tệp</h3>
<div class="out">════ 1) shell 'source' doc ra gi ════
./.env: line 2: chao: command not found
  DON_GIAN           = [abc]
  CO_KHOANG_TRANG    = []
  TRONG_NHAY_KEP     = [co  hai khoang]
  CO_DAU_THANG       = [mat#khau]
  CO_DOLLAR          = [/root/duong-dan]
  NOI_CHUOI          = [abc-them]
  CO_BANG            = [key=value=extra]

════ 2) node --env-file doc ra gi ════
  DON_GIAN           = [abc]
  CO_KHOANG_TRANG    = [xin chao]
  TRONG_NHAY_KEP     = [co  hai khoang]
  CO_DAU_THANG       = [mat]
  CO_DOLLAR          = [$HOME/duong-dan]
  NOI_CHUOI          = [\${DON_GIAN}-them]
  CO_BANG            = [key=value=extra]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một dấu cách không bọc ngoặc làm VỠ hẳn shell</span><span class="v"><code>CO_KHOANG_TRANG=xin chao</code> khiến <code>source</code> đi <em>CHẠY một lệnh tên là <code>chao</code></em>. Cái biến rốt cuộc RỖNG, và có một dòng lỗi mà phần lớn script deploy vứt đi.</span></div>
  <div class="kv"><span class="k">Một dấu <code>#</code> cắt cụt trong im lặng dưới Node</span><span class="v"><code>mat#khau</code> thành <code>mat</code>. Node coi dấu <code>#</code> là bắt đầu một chú thích. Một mật khẩu có dấu thăng bên trong giờ là một mật khẩu KHÁC, và triệu chứng duy nhất là một lỗi xác thực trên một tệp trông hoàn toàn đúng.</span></div>
  <div class="kv"><span class="k">Một dấu <code>$</code> bị BUNG ra dưới shell</span><span class="v"><code>\$HOME/duong-dan</code> thành <code>/root/duong-dan</code>. Một mật khẩu sinh ngẫu nhiên có chứa <code>\$</code> bị âm thầm viết lại thành thứ khác — hoặc thành RỖNG, nếu cái tên đứng sau nó không tồn tại.</span></div>
  <div class="kv"><span class="k">Nối chuỗi chạy ở bên này và không chạy ở bên kia</span><span class="v"><code>\${DON_GIAN}-them</code> thành <code>abc-them</code> dưới shell và giữ nguyên chữ dưới Node. Cấu hình ghép giá trị này từ giá trị kia thì chạy trên máy bạn mà không chạy trên máy chủ, hoặc ngược lại.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — hai ca nguy hiểm đều sinh ra một GIÁ TRỊ SAI, chứ không sinh ra lỗi.</strong> Một mật khẩu bị cắt ở dấu <code>#</code> và một mật khẩu bị bung ở dấu <code>\$</code> đều cho bạn một chuỗi trông hoàn toàn hợp lệ mà KHÔNG phải chuỗi bạn đã đặt. Ứng dụng khởi động, kết nối, và bị từ chối — nên cuộc điều tra chạy về phía cơ sở dữ liệu, người dùng, mạng, và rốt cuộc mới tới cái mật khẩu, thứ mà <em>trong tệp thì trông vẫn đúng</em>. Base64 và các bộ sinh ngẫu nhiên nhả ra <code>#</code> với <code>\$</code> khá thường xuyên, nên đây không phải chuyện kỳ dị; nó là lý do câu "dán tay vào thì mật khẩu chạy" nghe rất quen tai.</div>

<h3>Những luật sống sót qua MỌI bộ nạp</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bọc ngoặc kép cho MỌI giá trị, luôn luôn</span><span class="lz-d"><code>KEY="value"</code>. Không phải chỉ những cái có dấu cách — MỌI cái. Nháy kép được mọi bộ nạp trong phép đo này xử lý tương thích, và cái thói quen đó loại bỏ cả MỘT LỚP vấn đề chứ không chỉ những ca bạn tình cờ để ý thấy.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đừng bao giờ trông cậy vào chuyện nối chuỗi</span><span class="lz-d">Viết thẳng giá trị đầy đủ ra. <code>\${OTHER}</code> chạy ở vài bộ nạp và là chữ nguyên văn ở những bộ khác, mà bạn gặp cái nào thì tuỳ vào hôm đó dịch vụ tình cờ được khởi động bằng cách gì.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Không có dấu cách quanh dấu bằng</span><span class="lz-d"><code>KEY = value</code> là lỗi cú pháp với shell và là một dòng bị phớt lờ trong im lặng ở chỗ khác. Luôn luôn <code>KEY=value</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Không có gì NHIỀU DÒNG</span><span class="lz-d">Một khoá riêng tư hay một chứng chỉ nằm trong <code>.env</code> là một cuộc vật lộn với mọi bộ phân tích. Hãy đặt nó vào một TỆP rồi đặt <em>ĐƯỜNG DẪN</em> vào cái biến.</span></div>
</div>
<pre><code><span class="tok-comment"># bang chinh cai tep o tren, viet lai cho AN TOAN</span>
DON_GIAN="abc"
CO_KHOANG_TRANG="xin chao"
TRONG_NHAY_KEP="co  hai khoang"
CO_DAU_THANG="mat#khau"
CO_DOLLAR="\$HOME/duong-dan"     <span class="tok-comment"># nhay kep VAN khong chan duoc shell bung bien</span>
NOI_CHUOI="abc-them"             <span class="tok-comment"># viet thang ra, dung noi chuoi</span>
CO_BANG="key=value=extra"</code></pre>
<div class="callout warn"><strong>Một điều kiện mà phép đo buộc tôi phải nói rõ: nháy kép KHÔNG ngăn được shell bung dấu <code>\$</code>.</strong> Dưới <code>source</code>, <code>"\$HOME/x"</code> vẫn thành <code>/root/x</code> — đó chính là ý nghĩa của nháy kép trong shell. Chỉ nháy ĐƠN mới ngăn được, mà nháy đơn thì lại được các bộ nạp khác xử lý khác đi lần nữa. Nếu một giá trị BẮT BUỘC phải chứa dấu <code>\$</code> nguyên văn và có khả năng thứ gì đó sẽ <code>source</code> cái tệp, thì câu trả lời trung thực là THÔI dùng <code>.env</code> cho giá trị ấy và truyền nó vào bằng đường khác.</div>

<h3>Hãy KIỂM thay vì đoán</h3>
<pre><code><span class="tok-comment"># cach DUY NHAT dang tin: hoi chinh tien trinh dang chay</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ | grep DATABASE_URL

<span class="tok-comment"># do dai co dung khong? (bat cat cut ma khong lo bi mat ra man hinh)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f node)/environ | awk -F= '/^DB_PASS/{print "do dai:", length(\$2)}'

<span class="tok-comment"># hai bo phan tich co doc giong nhau khong?</span>
diff &lt;(node --env-file=.env -e 'for(const[k,v]of Object.entries(process.env))console.log(k+"="+v)' | sort) \\
     &lt;(env -i bash -c 'set -a; . ./.env; set +a; env' | sort)</code></pre>
<div class="note-ct">Phép kiểm ĐỘ DÀI mới là phép thực dụng cho bí mật. In một mật khẩu ra terminal là đưa nó vào lịch sử shell, vào vùng cuộn màn hình và có thể vào cả một đoạn quay màn hình; in ĐỘ DÀI của nó thì trả lời được câu "nó có bị cắt cụt không?" mà chẳng phơi ra gì. Một mật khẩu bạn sinh ra dài 32 ký tự mà tới nơi còn 3 chính là cái lỗi dấu <code>#</code>, hiện ra trong đúng một dòng.</div>

<h3>Một phương ngữ thứ ba, và vì sao nó quan trọng ở đây</h3>
<p><code>EnvironmentFile</code> của systemd lại là một bộ luật thứ tư nữa — cách bọc ngoặc riêng, cách xử lý ký tự thoát riêng, và hoàn toàn KHÔNG bung biến kiểu shell. Điều đó liên quan vì Bài 3.4 đã đặt <code>EnvironmentFile=/srv/app/chung/.env</code> vào tệp unit: CÙNG một tệp có thể được systemd đọc trên production, được <code>node --env-file</code> đọc lúc phát triển, và được một lập trình viên <code>source .env</code> bằng tay. Ba bộ phân tích, một tệp, và mấy cái luật ở trên chính là thứ giữ cho cả ba đồng ý với nhau.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tốt nhất: production KHÔNG có tệp .env nào cả</span><span class="lz-lnote">Biến môi trường do trình quản lý dịch vụ đặt, từ một tệp mà CHỈ nó đọc. Một bộ phân tích thay vì ba, và ứng dụng không bao giờ phải mở một tệp nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tốt: một tệp, mọi giá trị bọc ngoặc, không nối chuỗi</span><span class="lz-lnote">Đúng thứ mấy cái luật ở trên sinh ra. Chạy dưới mọi bộ nạp, và vẫn chạy khi có người đổi cách khởi động dịch vụ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rủi ro: giá trị chứa <code>#</code>, <code>\$</code>, dấu nháy hay xuống dòng</span><span class="lz-lnote">Nếu không tránh được thì hãy KIỂM qua <code>/proc/&lt;pid&gt;/environ</code> sau MỖI lần đổi — và thà sinh lại một bí mật mới còn hơn vật lộn với bộ phân tích.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệ nhất: một trình quản lý bí mật mà kết quả của nó được DÁN vào một tệp .env</span><span class="lz-lnote">Ăn đủ mọi rủi ro phân tích, cộng thêm một bản sao của bí mật nằm trên đĩa mà chẳng có gì xoay nó. Nếu bạn có trình quản lý bí mật thì hãy để ỨNG DỤNG đọc thẳng từ đó — Bài 4.5.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — --env-file và luật phân tích của nó</span><span class="lc-sub">nodejs.org/api/cli.html#--env-fileconfig — hành vi có ghi trong tài liệu, kể cả cách xử lý chú thích đã cắt cụt cái mật khẩu ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.exec(5) — cú pháp EnvironmentFile</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.exec.html#EnvironmentFile= — phương ngữ thứ ba, phát biểu chính xác, kể cả nó làm gì với dấu nháy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — mục QUOTING</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Quoting — vì sao nháy kép vẫn bung <code>\$</code> còn nháy đơn thì không.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — bọc ngoặc, bung biến và thứ tự chúng xảy ra</span><span class="lc-sub">/courses/linux-bash/learn${REF} — mấy luật bung biến đã biến một trong những giá trị này thành một đường dẫn thư mục nhà.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — A secret in git history is a leaked secret|||4.4 — Bí mật lỡ vào lịch sử git là bí mật ĐÃ LỘ',
      slug: 'deploy-4-4-bi-mat-trong-lich-su-git',
      type: 'LESSON',
      description: 'Xoá tệp .env rồi thêm .gitignore ở commit sau — và mật khẩu vẫn in ra nguyên vẹn bằng một lệnh. Bài này đo chuyện đó, rồi nói thẳng cách xử lý duy nhất thật sự có tác dụng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>A secret in git history is a leaked secret</h2>
<p class="lead">Committing a <code>.env</code> is a mistake everyone makes once. The instinct afterwards is to delete it and add a <code>.gitignore</code>, and that instinct produces a repository that <em>looks</em> clean and is not. The measurement takes ten seconds.</p>

<h3>Delete it and check</h3>
<div class="out">  commit 1: .env da vao kho
  commit 2: da xoa .env va them .gitignore

════ bi mat con trong LICH SU khong? ════
  git log --all -- .env:
    c6dd977 bo .env khoi kho, them gitignore
    3d7aa15 them cau hinh

  doc thang tu commit dau:
    DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
    STRIPE_KEY=sk_live_51H8xQ2eZvKYlo2C9AbCdEf

  tim theo NOI DUNG trong toan bo lich su:
    3d7aa15e71dddf19d44ffe3a19e8c6223ac2b7e7:.env</div>
<div class="callout warn"><strong>The credentials printed out in full, after being deleted.</strong> <code>git show HEAD~1:.env</code> is all it took. Git does not remove history when you remove a file — the commit that added it still exists, still contains the blob, and is still reachable by anyone with a clone. The <code>.gitignore</code> stops it happening <em>again</em>; it does nothing about what already happened.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Everyone with a clone already has it</span><span class="v">Every laptop, every CI runner cache, every fork. Rewriting history on the server does not reach any of them.</span></div>
  <div class="kv"><span class="k">Every backup has it</span><span class="v">Repository backups, mirrors, the copy someone made before a risky rebase.</span></div>
  <div class="kv"><span class="k">If it was ever public, assume it was scraped</span><span class="v">Public repositories are scanned continuously for exactly these patterns. <code>sk_live_</code> is a well-known prefix, and the interval between pushing and the first use of a leaked key is often measured in minutes.</span></div>
  <div class="kv"><span class="k">Rewriting history is the least important step</span><span class="v">It is worth doing, and it is not the fix. The fix is below.</span></div>
</div>

<h3>The only response that works</h3>
<div class="callout ok"><strong>Rotate the secret. Immediately, before anything else.</strong> A leaked credential stops being dangerous when it stops being valid — not when it stops being visible. Everything else is tidying. Revoke the old key at the provider, issue a new one, put it on the server, restart, and confirm the old one no longer works. Cleaning history afterwards is worth doing so the next person does not find a credential and wonder whether it is live, but the clock that matters stops at rotation, not at rewriting.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Rotate, and verify the old value fails</span><span class="lz-d">Issue the new credential, deploy it, then <em>test the old one</em> and confirm it is rejected. A rotation you did not verify is a rotation you hope happened — and some providers keep an old key alive for a grace period.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check whether it was used</span><span class="lz-d">Most providers have an access log. Look at it for the window between the commit and the rotation. This is the question your users will eventually ask, and "we don't know" is a much worse answer than "we checked".</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Then clean the history</span><span class="lz-d"><code>git filter-repo</code> — the maintained tool; <code>filter-branch</code> is deprecated and slow. It rewrites every commit, so every hash changes, so everyone must re-clone. Coordinate it, and expect open pull requests to break.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Add the guard that stops the next one</span><span class="lz-d">A pre-commit hook or a CI scan. The mistake is not carelessness — it is that <code>git add -A</code> does exactly what it is told, and nothing between your keyboard and the remote is looking.</span></div>
</div>
<pre><code><span class="tok-comment"># co bi mat nao trong lich su khong? (chay tren kho ban vua tiep quan)</span>
git rev-list --all | while read c; do
  git grep -lE '(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)' "\$c" 2&gt;/dev/null
done | sort -u

<span class="tok-comment"># tep .env co TUNG duoc theo doi khong?</span>
git log --all --oneline -- '*.env' '.env*'

<span class="tok-comment"># doc noi dung tai mot commit bat ky — day la thu ke tan cong lam</span>
git show &lt;commit&gt;:.env</code></pre>

<h3>Stopping it before it happens</h3>
<pre><code><span class="tok-comment"># .git/hooks/pre-commit — chan truoc khi no thanh lich su</span>
#!/bin/bash
if git diff --cached --name-only | grep -qE '(^|/)\\.env(\\.|\$)'; then
  echo "TU CHOI: dang commit mot tep .env" &gt;&amp;2; exit 1
fi
if git diff --cached | grep -qE '^\\+.*(sk_live_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY)'; then
  echo "TU CHOI: co ve nhu mot bi mat trong diff" &gt;&amp;2; exit 1
fi</code></pre>
<div class="pitfall"><strong>Trap — a hook in <code>.git/hooks/</code> is not shared and not enforced.</strong> It lives outside the repository, so a new clone does not have it, and anyone can bypass it with <code>--no-verify</code>. It is a helpful reminder for the person who installed it and nothing more. The enforcing version has to run somewhere the committer does not control: a CI job on every push, or a server-side <code>pre-receive</code> hook (Lesson 2.2 — the one that <em>can</em> reject a push). Treat the local hook as the fast feedback and the CI check as the actual gate.</div>

<h3>Where secrets should live instead</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A file on the server, outside the artifact — the baseline</span><span class="lz-lnote">The shared directory from Lesson 4.1, mode <code>0600</code>, owned by the service user. Simple, auditable, and enough for most single-server deployments. Its weakness is that it is plaintext on disk and nothing rotates it for you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Your CI provider's secret store — for deploy-time values</span><span class="lz-lnote">GitHub Actions secrets and equivalents. Right for things the deploy itself needs — an SSH key, a registry token. Note they are readable by any workflow that runs, so a pull request from a fork is a threat model worth understanding.</span></div>
  <div class="lz-layer"><span class="lz-lname">A secret manager — when there are many, or many machines</span><span class="lz-lnote">Vault, AWS Secrets Manager, SOPS with age. Real benefits: audit logs, automatic rotation, no plaintext at rest. Real cost: another dependency that must be available at start-up, which is a new way for a deploy to fail.</span></div>
  <div class="lz-layer"><span class="lz-lname">Encrypted in the repository — the compromise</span><span class="lz-lnote">SOPS or git-crypt: the values are versioned and reviewable, but only decryptable with a key that is not in the repository. Useful when configuration changes need review, and it moves the problem to "where does the decryption key live" rather than removing it.</span></div>
</div>
<div class="note-ct">Permissions matter more than people expect on the baseline option. <code>chmod 600 /srv/app/chung/.env</code> and <code>chown trienkhai:trienkhai</code> — Lesson 0.2 measured a deploy leaving files owned by <code>root</code> and world-readable, which for a <code>.env</code> means every user on the machine can read your production database password. Check it with <code>stat -c '%a %U:%G' /srv/app/chung/.env</code>; the answer should be <code>600</code> and the service user.</div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">git-filter-repo</span><span class="lc-sub">github.com/newren/git-filter-repo — the maintained history-rewriting tool, and its own documentation explaining why rotation matters more than rewriting.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">gitleaks and trufflehog</span><span class="lc-sub">github.com/gitleaks/gitleaks — scanning a repository's full history for credentials, which is the audit worth running once on every project you inherit.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub — removing sensitive data from a repository</span><span class="lc-sub">docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository — including the paragraph on cached views and forks that survive a rewrite.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — key rotation, and keeping two keys valid at once</span><span class="lc-sub">/courses/authentication/learn${REF} — the mechanism that makes rotation possible without downtime, which Lesson 4.5 applies here.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Bí mật lỡ vào lịch sử git là bí mật ĐÃ LỘ</h2>
<p class="lead">Commit nhầm một tệp <code>.env</code> là cái sai ai cũng mắc một lần. Phản xạ sau đó là xoá nó đi rồi thêm một tệp <code>.gitignore</code>, và cái phản xạ ấy sinh ra một kho mã <em>TRÔNG</em> sạch mà không sạch. Phép đo tốn mười giây.</p>

<h3>Xoá nó đi rồi kiểm lại</h3>
<div class="out">  commit 1: .env da vao kho
  commit 2: da xoa .env va them .gitignore

════ bi mat con trong LICH SU khong? ════
  git log --all -- .env:
    c6dd977 bo .env khoi kho, them gitignore
    3d7aa15 them cau hinh

  doc thang tu commit dau:
    DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
    STRIPE_KEY=sk_live_51H8xQ2eZvKYlo2C9AbCdEf

  tim theo NOI DUNG trong toan bo lich su:
    3d7aa15e71dddf19d44ffe3a19e8c6223ac2b7e7:.env</div>
<div class="callout warn"><strong>Thông tin đăng nhập in ra NGUYÊN VẸN, sau khi đã bị xoá.</strong> Chỉ cần <code>git show HEAD~1:.env</code>. Git KHÔNG gỡ lịch sử khi bạn gỡ một tệp — cái commit đã thêm nó vẫn tồn tại, vẫn chứa cái blob, và vẫn với tới được bởi bất cứ ai có một bản clone. Tệp <code>.gitignore</code> ngăn chuyện đó xảy ra LẦN NỮA; nó chẳng làm gì được với chuyện ĐÃ xảy ra.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi người có bản clone thì đã có nó rồi</span><span class="v">Mọi cái laptop, mọi cache của CI runner, mọi bản fork. Viết lại lịch sử trên máy chủ KHÔNG với tới cái nào trong số đó.</span></div>
  <div class="kv"><span class="k">Mọi bản sao lưu đều có nó</span><span class="v">Bản sao lưu kho mã, các bản mirror, cái bản ai đó chép ra trước một lần rebase mạo hiểm.</span></div>
  <div class="kv"><span class="k">Nếu nó từng CÔNG KHAI thì hãy coi như đã bị quét</span><span class="v">Kho mã công khai bị dò liên tục để tìm đúng những mẫu này. <code>sk_live_</code> là một tiền tố ai cũng biết, và khoảng cách giữa lúc push và lần dùng đầu tiên của một cái khoá bị lộ thường được đo bằng PHÚT.</span></div>
  <div class="kv"><span class="k">Viết lại lịch sử là bước ÍT quan trọng nhất</span><span class="v">Nó đáng làm, và nó KHÔNG phải cách sửa. Cách sửa nằm ngay dưới đây.</span></div>
</div>

<h3>Phản ứng DUY NHẤT có tác dụng</h3>
<div class="callout ok"><strong>XOAY cái bí mật đó. NGAY LẬP TỨC, trước mọi thứ khác.</strong> Một tín vật bị lộ thôi nguy hiểm khi nó thôi CÒN HIỆU LỰC — chứ không phải khi nó thôi NHÌN THẤY ĐƯỢC. Mọi thứ còn lại chỉ là dọn dẹp. Thu hồi khoá cũ ở phía nhà cung cấp, cấp khoá mới, đưa lên máy chủ, khởi động lại, và XÁC NHẬN rằng cái cũ không còn dùng được. Dọn lịch sử sau đó vẫn đáng làm để người sau không tìm thấy một tín vật rồi băn khoăn xem nó còn sống hay không, nhưng cái đồng hồ thật sự quan trọng thì DỪNG ở lúc xoay khoá, không phải lúc viết lại lịch sử.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xoay, và KIỂM rằng giá trị cũ đã hỏng</span><span class="lz-d">Cấp tín vật mới, deploy nó, rồi <em>ĐEM CÁI CŨ ĐI THỬ</em> và xác nhận nó bị từ chối. Một lần xoay bạn không kiểm lại là một lần xoay bạn HY VỌNG đã xảy ra — và vài nhà cung cấp còn giữ khoá cũ sống thêm một khoảng ân hạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm xem nó CÓ BỊ DÙNG không</span><span class="lz-d">Hầu hết nhà cung cấp đều có log truy cập. Hãy soi nó trong khoảng thời gian từ lúc commit tới lúc xoay khoá. Đây là câu hỏi mà rốt cuộc người dùng của bạn sẽ hỏi, và "chúng tôi không biết" là một câu trả lời TỆ HƠN HẲN "chúng tôi đã kiểm".</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RỒI mới dọn lịch sử</span><span class="lz-d"><code>git filter-repo</code> — công cụ đang được bảo trì; <code>filter-branch</code> đã bị khai tử và chậm. Nó viết lại MỌI commit, nên mọi mã băm đổi, nên mọi người phải clone lại. Hãy phối hợp trước, và lường trước rằng các pull request đang mở sẽ vỡ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thêm cái chốt chặn lần sau</span><span class="lz-d">Một hook pre-commit hoặc một bước quét trong CI. Cái sai không phải do bất cẩn — mà do <code>git add -A</code> làm ĐÚNG những gì nó được bảo, và giữa bàn phím bạn với máy chủ từ xa thì chẳng có gì đang nhìn cả.</span></div>
</div>
<pre><code><span class="tok-comment"># co bi mat nao trong lich su khong? (chay tren kho ban vua tiep quan)</span>
git rev-list --all | while read c; do
  git grep -lE '(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)' "\$c" 2&gt;/dev/null
done | sort -u

<span class="tok-comment"># tep .env co TUNG duoc theo doi khong?</span>
git log --all --oneline -- '*.env' '.env*'

<span class="tok-comment"># doc noi dung tai mot commit bat ky — day la thu ke tan cong lam</span>
git show &lt;commit&gt;:.env</code></pre>

<h3>Chặn nó trước khi nó xảy ra</h3>
<pre><code><span class="tok-comment"># .git/hooks/pre-commit — chan truoc khi no thanh lich su</span>
#!/bin/bash
if git diff --cached --name-only | grep -qE '(^|/)\\.env(\\.|\$)'; then
  echo "TU CHOI: dang commit mot tep .env" &gt;&amp;2; exit 1
fi
if git diff --cached | grep -qE '^\\+.*(sk_live_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY)'; then
  echo "TU CHOI: co ve nhu mot bi mat trong diff" &gt;&amp;2; exit 1
fi</code></pre>
<div class="pitfall"><strong>Bẫy — một hook nằm trong <code>.git/hooks/</code> thì KHÔNG được chia sẻ và KHÔNG có tính cưỡng chế.</strong> Nó sống ngoài kho mã, nên một bản clone mới không hề có nó, và ai cũng vượt qua được bằng <code>--no-verify</code>. Nó là một lời nhắc hữu ích cho chính người đã cài nó, và không hơn. Bản CƯỠNG CHẾ phải chạy ở một chỗ mà người commit KHÔNG kiểm soát: một job CI trên mọi lần push, hoặc một hook <code>pre-receive</code> phía máy chủ (Bài 2.2 — cái hook thật sự TỪ CHỐI được một lần push). Hãy coi hook cục bộ là phản hồi nhanh còn phép kiểm trong CI mới là cái CỔNG thật.</div>

<h3>Vậy bí mật nên sống ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một tệp trên máy chủ, ngoài tạo tác — mức nền</span><span class="lz-lnote">Thư mục dùng chung ở Bài 4.1, quyền <code>0600</code>, thuộc về người dùng của dịch vụ. Đơn giản, kiểm toán được, và đủ cho phần lớn triển khai một máy chủ. Điểm yếu của nó là văn bản thuần nằm trên đĩa và chẳng có gì tự xoay nó hộ bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kho bí mật của nhà cung cấp CI — cho giá trị dùng LÚC DEPLOY</span><span class="lz-lnote">GitHub Actions secrets và các thứ tương đương. Đúng cho những thứ mà chính lần deploy cần — một khoá SSH, một token registry. Lưu ý rằng MỌI workflow chạy được đều đọc được chúng, nên một pull request từ một bản fork là một mô hình đe doạ đáng hiểu cho kỹ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một trình quản lý bí mật — khi có NHIỀU, hoặc nhiều máy</span><span class="lz-lnote">Vault, AWS Secrets Manager, SOPS kèm age. Lợi ích thật: log kiểm toán, xoay khoá tự động, không có văn bản thuần nằm yên trên đĩa. Cái giá thật: thêm một phụ thuộc BẮT BUỘC phải sống lúc khởi động, tức là thêm một cách mới để một lần deploy hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mã hoá ngay trong kho mã — cách thoả hiệp</span><span class="lz-lnote">SOPS hoặc git-crypt: giá trị được quản lý phiên bản và review được, nhưng chỉ giải mã được bằng một cái khoá KHÔNG nằm trong kho. Hữu ích khi thay đổi cấu hình cần được review, và nó DỜI bài toán về câu "cái khoá giải mã sống ở đâu" chứ không xoá bỏ bài toán.</span></div>
</div>
<div class="note-ct">Với phương án mức nền thì QUYỀN quan trọng hơn người ta tưởng. <code>chmod 600 /srv/app/chung/.env</code> và <code>chown trienkhai:trienkhai</code> — Bài 0.2 đã đo một lần deploy để lại tệp thuộc về <code>root</code> và cả thế giới đọc được, mà với một tệp <code>.env</code> thì điều đó nghĩa là MỌI người dùng trên máy đọc được mật khẩu cơ sở dữ liệu production của bạn. Kiểm bằng <code>stat -c '%a %U:%G' /srv/app/chung/.env</code>; đáp án phải là <code>600</code> và người dùng của dịch vụ.</div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">git-filter-repo</span><span class="lc-sub">github.com/newren/git-filter-repo — công cụ viết lại lịch sử đang được bảo trì, và chính tài liệu của nó cũng giải thích vì sao XOAY KHOÁ quan trọng hơn viết lại.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">gitleaks và trufflehog</span><span class="lc-sub">github.com/gitleaks/gitleaks — quét toàn bộ lịch sử một kho mã tìm tín vật, và đó là cuộc kiểm kê đáng chạy MỘT lần trên mọi dự án bạn tiếp quản.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub — gỡ dữ liệu nhạy cảm khỏi một kho mã</span><span class="lc-sub">docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository — kể cả đoạn nói về các bản xem đã lưu đệm và các bản fork sống sót qua một lần viết lại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — xoay khoá, và giữ hai khoá cùng hiệu lực</span><span class="lc-sub">/courses/authentication/learn${REF} — cơ chế làm cho việc xoay khoá không gây gián đoạn, thứ mà Bài 4.5 áp dụng vào đây.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — Rotating a secret without logging everyone out|||4.5 — Xoay một bí mật mà không đá văng toàn bộ người dùng',
      slug: 'deploy-4-5-xoay-bi-mat',
      type: 'LESSON',
      description: 'Đổi thẳng khoá ký từ cũ sang mới thì mọi token đang lưu hành hỏng ngay lập tức — đo được. Bốn giai đoạn, mỗi giai đoạn một lần deploy, thì không token nào hỏng cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>Rotating a secret without logging everyone out</h2>
<p class="lead">Lesson 4.4 ended with "rotate it, immediately". That is easy for a database password and hard for a signing key, because a signing key is not just used at start-up — it is baked into every token your users are currently holding. Changing it in one step invalidates all of them.</p>

<h3>The naive rotation, measured</h3>
<div class="out">════ neu DOI THANG tu cu sang moi ════
  token cu cap 1 phut truoc: TU CHOI  ← MOI nguoi dung bi dang xuat</div>
<p>One environment variable changed, one restart, and every session issued before that moment is rejected. On a busy site that is thousands of people logged out simultaneously, all retrying at once — which is also a load spike at the exact moment you were doing something delicate.</p>

<h3>Two keys at once</h3>
<p>The mechanism is one line of design: <strong>sign with one key, accept a list</strong>.</p>
<pre><code><span class="tok-comment">// KY bang khoa dau tien; CHAP NHAN bat ky khoa nao trong danh sach</span>
const KHOA = (process.env.SIGNING_KEYS || '').split(',').filter(Boolean);

const tao  = d =&gt; &#96;\${d}.\${ky(d, KHOA[0])}&#96;;            <span class="tok-comment">// luon la khoa dau</span>
const kiem = t =&gt; KHOA.some(k =&gt; ky(phan(t), k) === chuky(t));  <span class="tok-comment">// bat ky khoa nao</span></code></pre>
<p>Rotation is then four deploys, each changing only the order and contents of that list:</p>
<div class="out">════ GIAI DOAN 1: chi co khoa CU ════
  ky bang: khoa-c…  chap nhan 1 khoa
  kiem token cu: HOP LE

════ GIAI DOAN 2: THEM khoa moi vao danh sach CHAP NHAN (van ky bang cu) ════
  ky bang: khoa-c…  chap nhan 2 khoa
  token cu con dung khong: HOP LE

════ GIAI DOAN 3: DOI THU TU — ky bang MOI, van chap nhan cu ════
  ky bang: khoa-m…  chap nhan 2 khoa
  token cu:  HOP LE
  token moi: HOP LE

════ GIAI DOAN 4: BO khoa cu ════
  ky bang: khoa-m…  chap nhan 1 khoa
  token cu:  TU CHOI   ← gio moi bi tu choi
  token moi: HOP LE</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Phase 2 is the safe one to do first</span><span class="v">Adding a key to the accept list changes nothing observable — no token is signed with it yet. It is a deploy you can do at any time, and it is what makes the rest possible.</span></div>
  <div class="kv"><span class="k">Phase 3 is the actual switch</span><span class="v">New tokens use the new key. Old tokens still work. At this moment both are valid, which is the whole point.</span></div>
  <div class="kv"><span class="k">Phase 4 waits for the old tokens to expire</span><span class="v">If sessions last seven days, phase 4 happens at least seven days after phase 3. Doing it early is the naive rotation with extra steps.</span></div>
  <div class="kv"><span class="k">Only the last phase rejects anything</span><span class="v">And by then nothing valid is signed with the old key, so the rejection is correct rather than disruptive.</span></div>
</div>
<div class="callout warn"><strong>If the key leaked, you do not get to wait.</strong> The four-phase rotation is for planned rotation — a scheduled key change, a departing employee, a compliance requirement. A <em>compromised</em> key must be invalidated now, and logging everyone out is the correct outcome: a valid session signed by a key an attacker holds is a session they can forge. Do phases 3 and 4 together, accept the disruption, and tell users why.</div>

<h3>Which secrets rotate cleanly, and which do not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Database passwords — rotate in one step</span><span class="lz-d">Nothing outside the application holds one. Create a second user or change the password, deploy the new value, restart. The only care needed is ordering: with the blue-green swap from Chapter 3 both versions run briefly, so the database must accept both values during that window — which usually means adding a second user rather than changing one password.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Third-party API keys — usually two-key capable</span><span class="lz-d">Most providers let you have two live keys precisely so you can rotate. Issue the second, deploy, verify traffic is using it, revoke the first. Verify before revoking — a background job that only runs nightly may still be holding the old one.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Signing keys — need the four phases</span><span class="lz-d">JWT secrets, session cookie keys, signed URL keys. Anything where something you issued in the past has to remain verifiable in the future.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Encryption keys for data at rest — hardest</span><span class="lz-d">Rotating the key does not re-encrypt the data. You need both keys until every row is re-encrypted, which is a migration, not a deploy. Store a key identifier alongside each encrypted value so you know which key it needs.</span></div>
</div>

<h3>A rotation is a deploy, so it is measurable</h3>
<pre><code><span class="tok-comment"># tien trinh dang chay CO THAT SU nhan khoa moi khong? (Bai 4.2)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ \\
  | awk -F= '/^SIGNING_KEYS/{print "so khoa dang chap nhan:", split(\$2, a, ",")}'

<span class="tok-comment"># token cu CON dung khong? (phai HOP LE o giai doan 2 va 3)</span>
curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer \$TOKEN_CU" \\
  https://cuongthai.com/api/nguoi-dung/toi

<span class="tok-comment"># sau giai doan 4: no PHAI bi tu choi</span>
<span class="tok-comment"># mot cu 200 o day nghia la khoa cu VAN dang duoc chap nhan — chua xoay xong</span></code></pre>
<div class="note-ct">That last check is the one people skip, and it is the one that catches an incomplete rotation. A phase-4 deploy that did not actually take — a variable not updated, a container not restarted, a second server that was missed — leaves the old key live while everyone believes it is revoked. The test is one <code>curl</code> with a token you kept from before the rotation, and the expected answer is <code>401</code>.</div>

<h3>Making it routine</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Write down what each secret is and how to rotate it</span><span class="lz-lnote">One line per secret: what it is for, where it comes from, whether it supports two-at-once, and how long old values must stay valid. Without it, every rotation starts with an investigation.</span></div>
  <div class="lz-layer"><span class="lz-lname">Design for a list from day one</span><span class="lz-lnote"><code>JWT_SECRET</code> as a comma-separated list costs nothing when there is one value in it, and it is the difference between a four-phase rotation and a mass logout later. Retro-fitting it during an incident is not the moment.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rotate on a schedule, not only on a leak</span><span class="lz-lnote">A rotation you have done before is a rotation you can do under pressure. The first time should not be the day it leaked.</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep an expiry shorter than your patience</span><span class="lz-lnote">Phase 4 waits for the longest-lived token. Thirty-day sessions mean a thirty-day rotation. That is an argument for short access tokens plus refresh — which is where the Authentication course goes into this properly.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7517 — JSON Web Key Set, and the kid header</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc7517 — the standard version of "accept a list": each token names which key signed it, so verification does not have to try them all.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Key Management Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html — rotation intervals, and the distinction between planned and emergency rotation.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER ROLE ... PASSWORD</span><span class="lc-sub">postgresql.org/docs/current/sql-alterrole.html — and why creating a second role is usually the cleaner rotation than changing one password.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — sessions, refresh tokens and revocation</span><span class="lc-sub">/courses/authentication/learn${REF} — the four-phase rotation in its full form, including what a key identifier buys you.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Xoay một bí mật mà không đá văng toàn bộ người dùng</h2>
<p class="lead">Bài 4.4 kết thúc bằng câu "xoay nó, ngay lập tức". Điều đó DỄ với một mật khẩu cơ sở dữ liệu và KHÓ với một khoá ký, vì một khoá ký không chỉ được dùng lúc khởi động — nó đã được nướng vào MỌI token mà người dùng của bạn đang cầm trong tay. Đổi nó trong một bước là làm hỏng hết cả đám.</p>

<h3>Cách xoay ngây thơ, đo thật</h3>
<div class="out">════ neu DOI THANG tu cu sang moi ════
  token cu cap 1 phut truoc: TU CHOI  ← MOI nguoi dung bi dang xuat</div>
<p>Một biến môi trường đổi, một cú khởi động lại, và MỌI phiên đăng nhập cấp trước khoảnh khắc đó đều bị từ chối. Trên một website đông khách thì đó là hàng nghìn người bị đăng xuất cùng lúc, tất cả cùng thử lại một lượt — mà đó cũng là một cú tăng tải đúng vào lúc bạn đang làm một việc tinh vi.</p>

<h3>Hai khoá cùng lúc</h3>
<p>Cơ chế gói trong một dòng thiết kế: <strong>KÝ bằng một khoá, CHẤP NHẬN cả một danh sách</strong>.</p>
<pre><code><span class="tok-comment">// KY bang khoa dau tien; CHAP NHAN bat ky khoa nao trong danh sach</span>
const KHOA = (process.env.SIGNING_KEYS || '').split(',').filter(Boolean);

const tao  = d =&gt; &#96;\${d}.\${ky(d, KHOA[0])}&#96;;            <span class="tok-comment">// luon la khoa dau</span>
const kiem = t =&gt; KHOA.some(k =&gt; ky(phan(t), k) === chuky(t));  <span class="tok-comment">// bat ky khoa nao</span></code></pre>
<p>Khi đó xoay khoá là BỐN lần deploy, mỗi lần chỉ đổi thứ tự và nội dung của cái danh sách ấy:</p>
<div class="out">════ GIAI DOAN 1: chi co khoa CU ════
  ky bang: khoa-c…  chap nhan 1 khoa
  kiem token cu: HOP LE

════ GIAI DOAN 2: THEM khoa moi vao danh sach CHAP NHAN (van ky bang cu) ════
  ky bang: khoa-c…  chap nhan 2 khoa
  token cu con dung khong: HOP LE

════ GIAI DOAN 3: DOI THU TU — ky bang MOI, van chap nhan cu ════
  ky bang: khoa-m…  chap nhan 2 khoa
  token cu:  HOP LE
  token moi: HOP LE

════ GIAI DOAN 4: BO khoa cu ════
  ky bang: khoa-m…  chap nhan 1 khoa
  token cu:  TU CHOI   ← gio moi bi tu choi
  token moi: HOP LE</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giai đoạn 2 là giai đoạn AN TOÀN để làm trước</span><span class="v">Thêm một khoá vào danh sách chấp nhận thì KHÔNG đổi gì quan sát được — chưa có token nào được ký bằng nó cả. Đó là một lần deploy bạn làm được vào bất cứ lúc nào, và nó là thứ làm cho phần còn lại khả thi.</span></div>
  <div class="kv"><span class="k">Giai đoạn 3 mới là cú chuyển THẬT</span><span class="v">Token mới dùng khoá mới. Token cũ vẫn chạy. Ở khoảnh khắc này cả hai đều hợp lệ, và đó chính là toàn bộ mục đích.</span></div>
  <div class="kv"><span class="k">Giai đoạn 4 CHỜ token cũ hết hạn</span><span class="v">Nếu phiên đăng nhập sống bảy ngày thì giai đoạn 4 xảy ra ÍT NHẤT bảy ngày sau giai đoạn 3. Làm sớm hơn thì đó là cách xoay ngây thơ kèm thêm mấy bước thừa.</span></div>
  <div class="kv"><span class="k">Chỉ giai đoạn CUỐI mới từ chối thứ gì</span><span class="v">Và tới lúc đó thì chẳng còn thứ hợp lệ nào được ký bằng khoá cũ nữa, nên cú từ chối là ĐÚNG chứ không gây xáo trộn.</span></div>
</div>
<div class="callout warn"><strong>Nếu cái khoá đã LỘ thì bạn KHÔNG được phép chờ.</strong> Cách xoay bốn giai đoạn là cho việc xoay CÓ KẾ HOẠCH — một lần đổi khoá theo lịch, một nhân sự nghỉ việc, một yêu cầu tuân thủ. Một khoá đã bị <em>XÂM PHẠM</em> thì phải bị vô hiệu NGAY, và việc đá văng toàn bộ người dùng là kết cục ĐÚNG: một phiên hợp lệ ký bằng cái khoá mà kẻ tấn công đang cầm là một phiên mà chúng giả mạo được. Hãy làm giai đoạn 3 và 4 CÙNG LÚC, chấp nhận sự xáo trộn, và nói cho người dùng biết vì sao.</div>

<h3>Bí mật nào xoay gọn, bí mật nào thì không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Mật khẩu cơ sở dữ liệu — xoay MỘT bước là xong</span><span class="lz-d">Chẳng có gì ngoài ứng dụng cầm nó cả. Tạo một người dùng thứ hai hoặc đổi mật khẩu, deploy giá trị mới, khởi động lại. Chỗ duy nhất phải cẩn thận là THỨ TỰ: với cú tráo xanh-lam ở Chương 3 thì cả hai phiên bản cùng chạy trong chốc lát, nên cơ sở dữ liệu phải chấp nhận CẢ HAI giá trị trong khoảng đó — mà thường nghĩa là thêm một người dùng thứ hai chứ không phải đổi một mật khẩu.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Khoá API bên thứ ba — thường hỗ trợ hai khoá</span><span class="lz-d">Phần lớn nhà cung cấp cho bạn giữ hai khoá cùng sống chính là để xoay được. Cấp cái thứ hai, deploy, KIỂM rằng lưu lượng đang dùng nó, rồi mới thu hồi cái đầu. Kiểm TRƯỚC khi thu hồi — một job chạy nền mỗi đêm có thể vẫn đang cầm cái cũ.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Khoá ký — cần đủ bốn giai đoạn</span><span class="lz-d">Bí mật JWT, khoá cookie phiên, khoá ký URL. Bất cứ thứ gì mà cái bạn đã cấp trong QUÁ KHỨ phải còn kiểm chứng được trong TƯƠNG LAI.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Khoá mã hoá dữ liệu nằm yên — khó nhất</span><span class="lz-d">Xoay khoá KHÔNG mã hoá lại dữ liệu. Bạn cần CẢ HAI khoá cho tới khi mọi dòng đã được mã hoá lại, mà đó là một cuộc migration chứ không phải một lần deploy. Hãy lưu một MÃ ĐỊNH DANH KHOÁ bên cạnh mỗi giá trị đã mã hoá để biết nó cần khoá nào.</span></div>
</div>

<h3>Một lần xoay khoá cũng là một lần deploy, nên nó ĐO ĐƯỢC</h3>
<pre><code><span class="tok-comment"># tien trinh dang chay CO THAT SU nhan khoa moi khong? (Bai 4.2)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ \\
  | awk -F= '/^SIGNING_KEYS/{print "so khoa dang chap nhan:", split(\$2, a, ",")}'

<span class="tok-comment"># token cu CON dung khong? (phai HOP LE o giai doan 2 va 3)</span>
curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer \$TOKEN_CU" \\
  https://cuongthai.com/api/nguoi-dung/toi

<span class="tok-comment"># sau giai doan 4: no PHAI bi tu choi</span>
<span class="tok-comment"># mot cu 200 o day nghia la khoa cu VAN dang duoc chap nhan — chua xoay xong</span></code></pre>
<div class="note-ct">Phép kiểm cuối cùng đó là cái người ta hay bỏ qua, và nó là cái bắt được một lần xoay khoá LÀM DỞ. Một lần deploy giai đoạn 4 không thật sự ăn — một biến chưa cập nhật, một container chưa khởi động lại, một máy chủ thứ hai bị bỏ sót — sẽ để khoá cũ tiếp tục sống trong khi mọi người tin rằng nó đã bị thu hồi. Phép thử là một lệnh <code>curl</code> với một token bạn giữ lại từ trước lúc xoay, và đáp án mong đợi là <code>401</code>.</div>

<h3>Biến nó thành việc thường lệ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ghi ra mỗi bí mật là gì và xoay nó thế nào</span><span class="lz-lnote">Một dòng cho mỗi bí mật: nó dùng để làm gì, nó tới từ đâu, nó có hỗ trợ hai-cùng-lúc không, và giá trị cũ phải còn hiệu lực bao lâu. Thiếu nó thì mọi lần xoay khoá đều bắt đầu bằng một cuộc điều tra.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thiết kế theo dạng DANH SÁCH ngay từ ngày đầu</span><span class="lz-lnote"><code>JWT_SECRET</code> dạng danh sách ngăn bằng dấu phẩy chẳng tốn gì khi trong đó chỉ có một giá trị, và nó là khác biệt giữa một lần xoay bốn giai đoạn với một cú đăng xuất hàng loạt về sau. Chắp vá nó vào GIỮA một sự cố thì không phải lúc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoay theo LỊCH, đừng chỉ xoay khi bị lộ</span><span class="lz-lnote">Một quy trình xoay bạn ĐÃ TỪNG làm là một quy trình bạn làm được dưới áp lực. Lần đầu tiên không nên là cái ngày nó bị lộ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giữ hạn sử dụng NGẮN hơn mức kiên nhẫn của bạn</span><span class="lz-lnote">Giai đoạn 4 chờ cái token sống lâu nhất. Phiên đăng nhập ba mươi ngày nghĩa là một cuộc xoay khoá ba mươi ngày. Đó là lý lẽ cho token truy cập NGẮN cộng refresh — mà khoá Authentication đi vào chuyện đó cho tử tế.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">RFC 7517 — JSON Web Key Set, và header kid</span><span class="lc-sub">datatracker.ietf.org/doc/html/rfc7517 — phiên bản chuẩn hoá của "chấp nhận cả danh sách": mỗi token tự nêu tên khoá đã ký nó, nên khâu kiểm chứng không phải thử hết.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">OWASP — Key Management Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html — chu kỳ xoay khoá, và phân biệt giữa xoay có kế hoạch với xoay khẩn cấp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PostgreSQL — ALTER ROLE ... PASSWORD</span><span class="lc-sub">postgresql.org/docs/current/sql-alterrole.html — và vì sao tạo một vai trò THỨ HAI thường là cách xoay gọn hơn đổi một mật khẩu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — phiên, refresh token và thu hồi</span><span class="lc-sub">/courses/authentication/learn${REF} — cách xoay bốn giai đoạn ở dạng đầy đủ, kể cả chuyện một mã định danh khoá mua được gì cho bạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 4.6 ─────────────────────────── */
    {
      title: '4.6 — Quiz: configuration and secrets|||4.6 — Quiz: cấu hình và bí mật',
      slug: 'deploy-4-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một mật khẩu bị cắt cụt ở dấu thăng, một biến đổi rồi mà restart không ăn, một bí mật in ra nguyên vẹn sau khi đã xoá, và một cú lùi bản lùi vào phiên bản không đọc nổi cấu hình.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>Quiz: configuration and secrets</h2>
<p class="lead">Eight questions from a chapter where the same seven-line file was read two different ways, and two of the differences produce a wrong value rather than an error.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Configuration in a shared directory survived a deploy, a value change and a rollback — and the rollback kept the <em>new</em> configuration, which is usually right and occasionally rolls you back into a version that cannot read it (4.1). Build-time and run-time are different moments: changing an environment variable and restarting updated the run-time read and left the build-time value untouched, because it is a string inside a file that was written weeks ago — which is why changing a <code>NEXT_PUBLIC_*</code> and restarting does nothing at all (4.2). One <code>.env</code> file parsed by <code>source</code> and by <code>node --env-file</code> disagreed on five of seven lines: an unquoted space made the shell try to run a command, a <code>#</code> silently truncated <code>mat#khau</code> to <code>mat</code> under Node, a <code>\\$</code> expanded to a home directory under the shell, and interpolation worked in one and not the other (4.3). A secret deleted from a repository printed out in full from history with one command, and the only response that matters is rotation, not rewriting (4.4). And a signing key changed in one step rejected a token issued a minute earlier — while a four-phase rotation, signing with one key and accepting a list, kept every token valid until the last phase (4.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Quiz: cấu hình và bí mật</h2>
<p class="lead">Tám câu ra từ một chương mà cùng một tệp bảy dòng được đọc theo hai cách khác nhau, và hai trong số các khác biệt đó sinh ra một GIÁ TRỊ SAI chứ không sinh ra lỗi.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Cấu hình đặt ở thư mục dùng chung sống sót qua một lần deploy, một lần đổi giá trị và một cú lùi bản — và cú lùi bản giữ lại cấu hình MỚI, điều thường là đúng và thi thoảng thì lùi bạn vào một phiên bản KHÔNG ĐỌC NỔI nó (4.1). Lúc dựng và lúc chạy là hai thời điểm khác nhau: đổi một biến môi trường rồi khởi động lại thì cập nhật được giá trị đọc-lúc-chạy và KHÔNG đụng tới giá trị nướng-lúc-dựng, vì nó là một chuỗi nằm trong một tệp viết ra từ mấy tuần trước — và đó là lý do đổi một <code>NEXT_PUBLIC_*</code> rồi restart thì tuyệt đối chẳng có gì xảy ra (4.2). Một tệp <code>.env</code> đưa qua <code>source</code> và qua <code>node --env-file</code> cho kết quả khác nhau ở NĂM trên bảy dòng: một dấu cách không bọc ngoặc làm shell đi CHẠY một lệnh, một dấu <code>#</code> lặng lẽ cắt <code>mat#khau</code> thành <code>mat</code> dưới Node, một dấu <code>\\$</code> bung thành đường dẫn thư mục nhà dưới shell, và nối chuỗi chạy ở bên này mà không chạy ở bên kia (4.3). Một bí mật đã xoá khỏi kho mã vẫn in ra NGUYÊN VẸN từ lịch sử bằng một lệnh, và phản ứng duy nhất có ý nghĩa là XOAY KHOÁ chứ không phải viết lại lịch sử (4.4). Và một khoá ký đổi trong một bước đã từ chối một token cấp cách đó một phút — trong khi cách xoay bốn giai đoạn, ký bằng một khoá và chấp nhận cả danh sách, giữ cho mọi token còn hiệu lực cho tới tận giai đoạn cuối (4.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your .env has DB_PASS=mat#khau and the app is started with node --env-file. The database rejects the connection. Why?|||Tệp .env của bạn có DB_PASS=mat#khau và ứng dụng khởi động bằng node --env-file. Cơ sở dữ liệu từ chối kết nối. Vì sao?',
            options: [
              'The password contains an illegal character|||Mật khẩu chứa một ký tự không hợp lệ',
              'Node treats # as starting a comment, so the value became mat — a different password, with no error anywhere|||Node coi dấu # là bắt đầu một chú thích, nên giá trị thành mat — một mật khẩu KHÁC, và chẳng có lỗi nào ở đâu cả',
              'The file needs a trailing newline|||Tệp cần một dòng trống ở cuối',
              'DB_PASS must be exported|||DB_PASS phải được export',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A deploy script does source .env and a value is DB_PASS=abc$def. What does the application receive?|||Một script deploy chạy source .env và một giá trị là DB_PASS=abc$def. Ứng dụng nhận được gì?',
            options: [
              'abc$def, unchanged|||abc$def, giữ nguyên',
              'abc followed by whatever $def expands to — usually nothing, because the variable is undefined, so the password is silently just abc|||abc kèm theo bất cứ thứ gì $def bung ra — thường là RỖNG, vì biến đó không tồn tại, nên mật khẩu lặng lẽ chỉ còn abc',
              'An error, because $ is not allowed|||Một lỗi, vì $ không được phép',
              'The literal string with quotes added|||Chuỗi nguyên văn có thêm dấu ngoặc',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'You change NEXT_PUBLIC_API_URL on the server and restart. The site still calls the old URL. What is happening?|||Bạn đổi NEXT_PUBLIC_API_URL trên máy chủ rồi khởi động lại. Website vẫn gọi URL cũ. Chuyện gì đang xảy ra?',
            options: [
              'The restart did not take effect|||Cú khởi động lại không ăn',
              'That value was inlined into the JavaScript bundle at build time — it is a string inside a file, so only rebuilding changes it|||Giá trị đó đã được nhúng vào gói JavaScript LÚC DỰNG — nó là một chuỗi nằm trong một tệp, nên chỉ DỰNG LẠI mới đổi được',
              'The browser cached the response|||Trình duyệt đã lưu đệm phản hồi',
              'NEXT_PUBLIC_ variables are read-only|||Biến NEXT_PUBLIC_ là chỉ đọc',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why must a third-party API key never be a NEXT_PUBLIC_ or VITE_ variable?|||Vì sao một khoá API của bên thứ ba TUYỆT ĐỐI không được là biến NEXT_PUBLIC_ hay VITE_?',
            options: [
              'Those prefixes are reserved|||Mấy tiền tố đó bị đặt trước',
              'The value ends up inside a file the browser downloads, so anyone can read it — the fix is a small authenticated backend route that proxies the call|||Giá trị đó nằm trong một tệp mà trình duyệt TẢI VỀ, nên ai cũng đọc được — cách sửa là một tuyến backend nhỏ có xác thực đứng ra gọi hộ',
              'They are too long|||Chúng quá dài',
              'The build fails if they contain letters|||Bản dựng hỏng nếu chúng chứa chữ cái',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'You committed .env by mistake, then deleted it and added .gitignore in the next commit. What should you do first?|||Bạn lỡ commit .env, rồi xoá nó và thêm .gitignore ở commit sau. Việc ĐẦU TIÊN nên làm là gì?',
            options: [
              'Rewrite history with git filter-repo|||Viết lại lịch sử bằng git filter-repo',
              'Rotate the credentials — they are still readable from history by anyone with a clone, and rewriting reaches none of those copies|||XOAY tín vật — chúng vẫn đọc được từ lịch sử bởi bất cứ ai có bản clone, và viết lại lịch sử không với tới được bản sao nào trong số đó',
              'Force-push the branch|||Force-push cái nhánh',
              'Nothing; .gitignore removes it|||Không gì cả; .gitignore đã gỡ nó rồi',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why is a pre-commit hook in .git/hooks/ not a sufficient guard against committing secrets?|||Vì sao một hook pre-commit trong .git/hooks/ KHÔNG đủ để chặn việc commit bí mật?',
            options: [
              'It runs too slowly|||Nó chạy quá chậm',
              'It lives outside the repository, so a fresh clone does not have it, and anyone can bypass it with --no-verify — the enforcing check has to run in CI or a pre-receive hook|||Nó sống NGOÀI kho mã, nên một bản clone mới không hề có nó, và ai cũng vượt qua được bằng --no-verify — phép kiểm CƯỠNG CHẾ phải chạy trong CI hoặc trong một hook pre-receive',
              'Hooks cannot read the staged diff|||Hook không đọc được diff đã staged',
              'It only works on the default branch|||Nó chỉ chạy trên nhánh mặc định',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Deploy v2 renames DB_URL to DATABASE_URL and updates the shared .env. You then roll back to v1. What happens?|||Deploy v2 đổi tên DB_URL thành DATABASE_URL và cập nhật tệp .env dùng chung. Rồi bạn lùi về v1. Chuyện gì xảy ra?',
            options: [
              'The rollback also restores the old variable name|||Cú lùi bản khôi phục luôn cả tên biến cũ',
              'v1 looks for DB_URL, which no longer exists in the shared file — the rollback completes successfully and the site stays broken|||v1 đi tìm DB_URL, thứ không còn tồn tại trong tệp dùng chung — cú lùi bản HOÀN TẤT THÀNH CÔNG và website vẫn hỏng',
              'The deploy refuses to roll back|||Lần deploy từ chối lùi lại',
              'Both names work automatically|||Cả hai tên đều tự động chạy',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'You must rotate a JWT signing key without logging users out. What is the order?|||Bạn phải xoay một khoá ký JWT mà không đăng xuất người dùng. Thứ tự là gì?',
            options: [
              'Replace the key and restart|||Thay cái khoá rồi khởi động lại',
              'Add the new key to the accept list, deploy; then sign with the new key while still accepting the old, deploy; wait for old tokens to expire; then remove the old key|||THÊM khoá mới vào danh sách chấp nhận, deploy; rồi KÝ bằng khoá mới mà vẫn chấp nhận khoá cũ, deploy; CHỜ token cũ hết hạn; rồi mới BỎ khoá cũ',
              'Sign with both keys at once|||Ký bằng cả hai khoá cùng lúc',
              'Shorten the token expiry and wait|||Rút ngắn hạn token rồi chờ',
            ],
            correctIndex: 1,
            points: 15,
          },
        ],
      },
    },
  ],
};
