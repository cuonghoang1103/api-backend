/**
 * Deploy lên VPS — Chương 4: Cấu hình và bí mật (sống ngoài tạo tác · lúc dựng/lúc chạy · .env nhiều phương ngữ ·
 * bí mật trong lịch sử git · xoay bí mật không gián đoạn).
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 * Nâng cấp 29/09/2026: bài 4.0 slide (deck dv-04, 32 slide) + slide/🧪/🗂/📌 trong 4.1–4.5; đào sâu: nguồn gốc
 * 12-factor III, /opt/<app>/.env + rsync --exclude='.env*' (và --delete-excluded xoá mất nó), thêm biến giữa lúc
 * deploy (restart vs up -d), thứ tự ưu tiên của Compose, NEXT_PUBLIC_* đo trên bản dựng Next.js thật, ARG trong
 * docker history vs RUN --mount=type=secret, /proc/PID/environ, CÙNG một tệp .env qua NĂM bộ nạp (bash, systemd,
 * docker --env-file, compose env_file, node --env-file), CRLF, git log -S + gitleaks + filter-repo, ba lớp chặn,
 * chmod 600, kid, mật khẩu PostgreSQL đổi thẳng vs hai user, token cũ phải 401; quiz 10 câu có giải thích.
 * Đã SỬA: lệnh curl …/main-*.js (zsh báo no matches found, bash nhận 404), lệnh diff so hai bộ nạp (so cả môi trường
 * kế thừa ⇒ 68 dòng khác trên một tệp đúng), khoá Stripe mẫu bị gitleaks chặn (chạy lại phép đo bằng khoá xxxx).
 * Output MỚI chạy thật trong VPS thí nghiệm (Ubuntu 24.04 + systemd 255), trên Mac M1 (Docker 29.8, Node 22.21,
 * Next.js 15.5, git 2.51, gitleaks 8.30.1) và PostgreSQL 16 trong container.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 4 — Configuration and secrets|||Chương 4 — Cấu hình và bí mật',
  description: 'Cái biến môi trường thiếu ở Bài 0.3 nên sống ở đâu. Chương này đo một tệp .env được hai bộ phân tích đọc ra hai kết quả khác nhau ở năm trên bảy dòng, một mật khẩu bị cắt cụt trong im lặng, và một bí mật vẫn đọc được nguyên vẹn sau khi đã bị xoá khỏi kho mã.',
  lessons: [

    /* ─────────────────────────── 4.0 ─────────────────────────── */
    {
      title: '4.0 — Chapter 4 slides: configuration and secrets, in pictures|||4.0 — Slide Chương 4: cấu hình và bí mật, bằng hình',
      slug: 'deploy-4-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 4: một tạo tác nhiều môi trường, .env sống ngoài và rsync loại .env*, thêm biến giữa lúc deploy, NEXT_PUBLIC_* đo trên Next.js thật, ARG trong docker history, /proc/PID/environ, CÙNG một tệp .env qua năm bộ nạp, CRLF, git log -S và gitleaks, filter-repo, ba lớp chặn, chmod 600, xoay khoá bốn giai đoạn với kid, mật khẩu PostgreSQL và token cũ phải 401.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: one artifact running in two environments with two different files beside it, a variable added halfway through a deploy that the container never sees, a Next.js bundle that still ships the old key after a restart, a build argument printed three times by <code>docker history</code>, one nine-line <code>.env</code> read five different ways, a password that is still in git after the file was deleted, and a signing key rotated in four phases without logging anyone out.</p>
<p>Slides 3–8 belong to Lesson 4.1 (configuration outside the artifact, <code>/opt/&lt;app&gt;/.env</code>, the rsync exclude, variables added mid-deploy, failing fast, Compose precedence), 9–13 to 4.2 (build time and run time, the GIPHY key, build args and <code>/proc/PID/environ</code>), 14–18 to 4.3 (five loaders, <code>#</code> and <code>$</code>, CRLF, Docker and systemd, the rules), 19–23 to 4.4 (history, gitleaks, rotate first, three layers of guards, file permissions) and 24–28 to 4.5 (four phases, <code>kid</code>, PostgreSQL passwords, proving the rotation, which secret rotates how). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026: an Ubuntu 24.04 lab VPS running systemd 255, Docker 29.8 with Compose v5.5 and Node 22.21 on a Mac M1, a real Next.js 15.5 build, gitleaks 8.30.1, and PostgreSQL 16 in a container.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: một tạo tác chạy ở hai môi trường với hai tệp khác nhau nằm cạnh, một biến thêm vào giữa lúc deploy mà container không bao giờ thấy, một gói Next.js vẫn mang khoá cũ sau khi restart, một tham số dựng bị <code>docker history</code> in ra ba lần, một tệp <code>.env</code> chín dòng bị đọc theo năm cách, một mật khẩu vẫn nằm trong git sau khi tệp đã bị xoá, và một khoá ký được xoay qua bốn giai đoạn mà không đăng xuất ai.</p>
<p>Slide 3–8 thuộc Bài 4.1 (cấu hình ngoài tạo tác, <code>/opt/&lt;app&gt;/.env</code>, luật loại trừ của rsync, biến thêm giữa lúc deploy, hỏng sớm, thứ tự ưu tiên của Compose), 9–13 thuộc 4.2 (lúc dựng và lúc chạy, khoá GIPHY, tham số dựng và <code>/proc/PID/environ</code>), 14–18 thuộc 4.3 (năm bộ nạp, <code>#</code> và <code>$</code>, CRLF, Docker và systemd, bộ luật), 19–23 thuộc 4.4 (lịch sử, gitleaks, xoay trước, ba lớp chặn, quyền tệp) và 24–28 thuộc 4.5 (bốn giai đoạn, <code>kid</code>, mật khẩu PostgreSQL, chứng minh lần xoay, bí mật nào xoay thế nào). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 29/09/2026: một VPS thí nghiệm Ubuntu 24.04 chạy systemd 255, Docker 29.8 cùng Compose v5.5 và Node 22.21 trên Mac M1, một bản dựng Next.js 15.5 thật, gitleaks 8.30.1, và PostgreSQL 16 trong container.</p>
</div>
${gallery('dv-04', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Một tạo tác, nhiều môi trường'], [4, 'Deploy, đổi cấu hình, lùi bản'], [5, 'Loại .env* khỏi rsync'],
  [6, 'Thêm biến giữa lúc deploy'], [7, 'Thiếu biến thì dừng; so .env.example'], [8, 'Cái gì là cấu hình, ai thắng khi trùng'],
  [9, 'Lúc dựng và lúc chạy'], [10, 'NEXT_PUBLIC_* trên Next.js thật'], [11, 'Khoá bên thứ ba qua backend'],
  [12, 'ARG trong docker history'], [13, '/proc/PID/environ'],
  [14, 'Một tệp .env, năm bộ nạp'], [15, 'Dấu # và dấu $'], [16, 'CRLF'], [17, 'docker --env-file và systemd'], [18, 'Luật viết .env'],
  [19, 'Xoá tệp không xoá lịch sử'], [20, 'gitleaks trên lịch sử'], [21, 'Xoay trước, dọn sau'], [22, 'Ba lớp chặn'], [23, 'chmod 600'],
  [24, 'Xoay khoá bốn giai đoạn'], [25, 'Ký bằng khoá đầu, kiểm theo kid'], [26, 'Mật khẩu CSDL: hai user'], [27, 'Token cũ phải 401'], [28, 'Bí mật nào xoay thế nào'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2): cấu hình'], [31, 'Bảng tra nhanh (2/2): bí mật'], [32, 'Thực hành chương 4'],
])}
`,
    },

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
${slide('dv-04', 3, 'Một tạo tác, nhiều môi trường: cấu hình đứng ngoài')}
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

<h3>Where the rule comes from, and the one-line test</h3>
<p>The rule has a name because a company needed to write it down. Around 2011, developers at Heroku — the platform where a deploy was literally <code>git push heroku master</code> — published <em>The Twelve-Factor App</em>, twelve habits they kept seeing in applications that ran well on their platform; Adam Wiggins presented it. Factor III, "Config", says: store configuration in the environment, strictly separated from code. The reason was practical rather than philosophical: Heroku ran the <em>same</em> build (they called it a "slug") in staging and in production, so anything that differed between the two had to arrive from outside the build.</p>
<p>The factor also gives a test that is worth more than the definition: <strong>could you make this repository public right now without leaking a single credential?</strong> If the answer is no, configuration is living inside the code. Ask it about your own SWP391 repository before you deploy anything — most first projects fail it, because an <code>application.properties</code> or a <code>.env</code> with the real database password was committed in week one and nobody looked again.</p>
<div class="callout warn"><strong>"We only have one server" is not a reason to skip this.</strong> You still have your laptop (development), you will soon have a teammate's machine or a second VPS, and on the day you roll back (Chapter 6) you will want the old <em>code</em> running with today's <em>configuration</em> — yesterday's database password may no longer exist. That combination is only possible when the two are separate things with separate lifetimes.</div>

<h3>Measured across a deploy, a config change, and a rollback</h3>
${slide('dv-04', 4, 'Deploy, đổi cấu hình, lùi bản: đo cả ba')}
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

<h3>The real arrangement: <code>/opt/&lt;app&gt;/.env</code> and an rsync exclude</h3>
${slide('dv-04', 5, 'Loại .env* khỏi rsync: .env production sống qua mọi deploy')}
<p>The symlink layout above is one way to keep configuration outside the release. The project behind this course uses a simpler one that works just as well with Docker Compose: the production <code>.env</code> lives at <code>/opt/&lt;app&gt;/.env</code> on the VPS, <em>outside</em> the directory the code is copied into. The deploy script loads it on every run, and the rsync that copies the repository excludes <code>.env*</code>. Nothing a deploy does can touch that file, so a value written there once survives every deploy after it. Here is what the exclude is actually protecting you from, measured on the lab VPS with a laptop whose <code>.env</code> points at its own development database:</p>
<pre><code class="language-bash"># VPS thi nghiem: /opt/datlich/repo/.env = ban production
# laptop:         repo/.env             = ban dev (localhost)
rsync -a --delete ./ vps:/opt/datlich/repo/                          # KHONG loai tru
rsync -a --delete --exclude='.env*' ./ vps:/opt/datlich/repo/        # CO loai tru
rsync -a --delete --delete-excluded --exclude='.env*' ./ vps:/opt/datlich/repo/</code></pre>
<div class="out">$ rsync -a --delete ./ vps:/opt/datlich/repo/
(vps) repo/.env sau: DATABASE_URL="postgres://localhost/dev"
  . .. .env .env.example .env.local src
$ rsync -a --delete --exclude='.env*' ./ vps:/opt/datlich/repo/
(vps) repo/.env sau: DATABASE_URL="postgres://app@db/datlich"
  . .. .env .env.example src
$ rsync -a --delete --delete-excluded --exclude='.env*' ./ vps:/opt/datlich/repo/
. .. src</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Without the exclude, the laptop wins</span><span class="v">Your development <code>.env</code> overwrote the production one, <code>.env.local</code> came along too, and rsync exited 0. The next restart connects production to <code>localhost/dev</code>, which does not exist on the server.</span></div>
  <div class="kv"><span class="k">With it, production is untouched</span><span class="v">An excluded path is not sent — and, importantly, <code>--delete</code> does not delete it on the receiving side either. That second half is what keeps the server's own file alive.</span></div>
  <div class="kv"><span class="k"><code>--delete-excluded</code> undoes the protection</span><span class="v">It means "also delete, on the server, everything I excluded". The production <code>.env</code> vanished. It looks like a tidy-up flag; in a deploy script it is a trap.</span></div>
  <div class="kv"><span class="k">The pattern is broad</span><span class="v"><code>.env*</code> also matches <code>.env.example</code>, so the template never reaches the server. Harmless, but do not be surprised.</span></div>
</div>
<div class="callout ok"><strong>How the real project does it.</strong> Production runtime environment lives in <code>/opt/cuonghoangdev/.env</code>. The rsync-based <code>deploy.sh</code> excludes <code>.env*</code> and loads that file on every deploy, and <code>deploy-nha.sh</code> never copies configuration at all — it ships images, and the VPS starts them with the file it already has. The consequence the project wrote down in its own notes: <em>values there survive deploys permanently</em>, which is exactly the property this lesson is about. The file is edited by hand, on the server, and nowhere else.</div>

<h3>Adding a variable while a deploy is running</h3>
${slide('dv-04', 6, 'Thêm biến giữa lúc deploy: container không thấy')}
<p>That arrangement has one sharp edge, and the project hit it. A deploy script loads <code>/opt/&lt;app&gt;/.env</code> <em>once, at the start</em>. If you append a new variable to the file while that deploy is still building, the deploy has already read the old file — and the container it creates a few minutes later is created without your variable. Reproduced on Docker Desktop with a script that loads the file, "builds" for four seconds, then runs <code>docker compose up -d</code>:</p>
<pre><code class="language-bash"># compose.yaml:   environment:  GIPHY_API_KEY: \${GIPHY_API_KEY-}
# deploy.sh:      set -a; . ./app.env; set +a;  sleep 4;  docker compose up -d
./deploy.sh &amp;  sleep 1.5;  printf 'GIPHY_API_KEY="xxxx12345"\\n' &gt;&gt; app.env;  wait</code></pre>
<div class="out">[deploy 08:56:57] da nap env, dang dung anh (gia lap 4 s)...
[tay    08:56:58] them GIPHY_API_KEY vao app.env
  Container dv04-web-1 Started
[deploy 08:57:02] xong
$ docker exec dv04-web-1 …
  trong container: GIPHY_API_KEY=[]
$ docker compose restart web
 Container dv04-web-1 Started
  trong container: GIPHY_API_KEY=[]
$ set -a; . ./app.env; set +a; docker compose up -d web
 Container dv04-web-1 Starting
 Container dv04-web-1 Started
  trong container: GIPHY_API_KEY=[xxxx12345]</div>
<table>
<tr><th>After changing the value in <code>.env</code>, you run…</th><th>Does the process see it?</th></tr>
<tr><td><code>docker compose restart web</code></td><td>No — same container, and a container's environment is fixed when it is <em>created</em> (measured above)</td></tr>
<tr><td><code>set -a; . .env; set +a; docker compose up -d web</code></td><td>Yes — Compose sees the configuration changed and recreates the container (measured above)</td></tr>
<tr><td><code>systemctl restart app</code> with <code>EnvironmentFile=</code></td><td>Yes — systemd reads the file again on every start (measured: the new value appeared after one restart)</td></tr>
<tr><td>Nothing — the process keeps running</td><td>No — a running process's environment was copied at <code>exec</code> time and never changes (Lesson 4.2)</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Trap — "I added it to the .env, so it is set".</strong> Writing the file and the process <em>reading</em> it are two events, and only the second one counts. The project's own rule after this happened: if a variable is appended while a deploy is already running, that deploy loaded the environment before the change, so recreate the one container afterwards with the environment loaded (<code>docker compose -p &lt;project&gt; up -d --no-build &lt;service&gt;</code>) or deploy again. Then check from the inside — <code>docker exec &lt;container&gt; sh -c 'echo \${#GIPHY_API_KEY}'</code> prints the <em>length</em>, which proves the value arrived without printing it.</div>
<h3>What belongs in configuration, and what does not</h3>
${slide('dv-04', 8, 'Cái gì là cấu hình — và ai thắng khi trùng')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Anything that differs between environments</span><span class="lz-d">Database URLs, API endpoints, bucket names, log levels, feature flags, worker counts. If staging and production disagree about it, it is configuration by definition.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Anything secret</span><span class="lz-d">Passwords, tokens, signing keys, private keys. Secrets are a subset of configuration with stricter handling — Lesson 4.4.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Anything the same everywhere</span><span class="lz-d">Route definitions, timeout constants your code chose, validation rules. Putting these in environment variables produces a <code>.env</code> with sixty entries where nobody can tell which four actually matter.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Anything the code needs to be correct about</span><span class="lz-d">A value that breaks the application when wrong, and that has exactly one right answer, belongs in the code where it can be reviewed and tested — not in a file on a server that nobody diffs.</span></div>
</div>
<p>When the same variable is set in more than one place, the question "which value wins?" has a documented answer for Compose (docs.docker.com, as of 09/2026), from highest to lowest: <code>docker compose run -e</code> on the command line; then an <code>environment:</code> or <code>env_file:</code> entry whose value is interpolated from your shell or the project's <code>.env</code> file (<code>\${X}</code>); then a literal value under <code>environment:</code>; then <code>env_file:</code>; and last, <code>ENV</code> in the Dockerfile. When a container shows a value nobody remembers setting, walk that list from the top instead of guessing — a stale <code>ENV</code> baked into the image months ago is the usual culprit, and it only shows through when every layer above it is empty.</p>
<div class="callout warn"><strong>An environment variable that is missing should stop the process, not default.</strong> The failure in Lesson 0.3 — a healthy-looking process returning 500 to everything — happens when code reads <code>process.env.DATABASE_URL</code>, gets <code>undefined</code>, and carries on. Validate at startup and exit non-zero if something required is absent: then the service manager reports a failed start, the deploy's readiness check never passes, and the swap in Chapter 3 never happens. A missing variable becomes a failed deploy instead of a broken site.</div>
<pre><code class="language-javascript"><span class="tok-comment">// dau vao cua ung dung, truoc khi lang nghe cong</span>
const BAT_BUOC = ['DATABASE_URL', 'JWT_SECRET', 'R2_BUCKET'];
const thieu = BAT_BUOC.filter(k =&gt; !process.env[k]);
if (thieu.length) {
  console.error('Thieu bien moi truong bat buoc:', thieu.join(', '));
  process.exit(1);          <span class="tok-comment">// khac 0 ⇒ deploy DUNG LAI</span>
}</code></pre>

<h3>Keeping the list honest</h3>
${slide('dv-04', 7, 'Thiếu biến thì DỪNG; so .env.example với máy chủ')}
<p>A <code>.env.example</code> committed to the repository is the documentation, and it is the only part of configuration that belongs in git — names and dummy values, never real ones. The measurement that keeps it true is a diff:</p>
<pre><code><span class="tok-comment"># bien nao co trong .env.example ma THIEU tren may chu?</span>
comm -23 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)

<span class="tok-comment"># va nguoc lai: bien nao tren may chu ma khong ai ghi lai?</span>
comm -13 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)</code></pre>
<div class="note-ct">Both directions matter. The first finds the variable your new code needs and nobody added to the server — the Lesson 0.3 failure, caught before deploying instead of after. The second finds settings that exist only on the server, which is how a machine becomes impossible to rebuild: something depends on a value that is written down nowhere. Run the second one on a server you inherited; the list is usually longer than anyone expects.</div>
<h3>Measured: the startup check and the drift check</h3>
<p>Both snippets above, run for real. The startup check on the Mac with Node 22 (<code>env -i</code> starts from an empty environment, so nothing leaks in from your shell), and the drift check between a laptop <code>.env.example</code> and the lab VPS:</p>
<div class="out">$ env -i DATABASE_URL=postgres://app@db/datlich node server.js; echo "exit=$?"
Thieu bien moi truong bat buoc: JWT_SECRET, R2_BUCKET
exit=1
$ env -i DATABASE_URL=… JWT_SECRET=xxxx R2_BUCKET=anh node server.js
dang nghe cong 3000
$ comm -23 &lt;(… .env.example …) &lt;(ssh vps … /opt/datlich/.env …)    # thieu tren may chu
GIPHY_API_KEY
$ comm -13 …                                                    # chi co tren may chu
OLD_SMTP_PASS</div>
<p>Read the drift result as two to-do items: <code>GIPHY_API_KEY</code> must be added to the server <em>before</em> the code that needs it is deployed, and <code>OLD_SMTP_PASS</code> is either dead (delete it) or undocumented (add it to <code>.env.example</code>). Both commands use <code>&lt;( … )</code> — process substitution — which exists in bash and zsh but not in PowerShell or <code>cmd.exe</code>; teammates on Windows should run them inside WSL. <code>comm</code> also requires both inputs sorted, which is why every branch ends in <code>sort -u</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the night before your SWP391 defence, a teammate deploys from their laptop and the site starts returning 500 — production is now talking to <code>localhost/dev</code>. Then someone adds the GIF key to the server's <code>.env</code> during the fix-up deploy, and the GIF picker still does not work. Reproduce both and fix them properly, on the lab VPS (the one from Chapter 2: an Ubuntu 24.04 container with sshd).</p>
<ol>
<li>On the VPS create <code>/opt/datlich/repo/.env</code> with a "production" <code>DATABASE_URL</code> and <code>chmod 600</code> it. Locally create <code>repo/.env</code> pointing at <code>localhost/dev</code>. Run <code>rsync -a --delete</code> without an exclude, then read the server's <code>.env</code>.</li>
<li>Restore it, run again with <code>--exclude='.env*'</code>, and confirm the production value survived. Then try <code>--delete-excluded</code> once, on purpose, and see what happens to the file.</li>
<li>With Compose, write a service whose <code>environment:</code> uses <code>\${GIPHY_API_KEY-}</code> and a <code>deploy.sh</code> that loads the <code>.env</code>, sleeps 4 s, then runs <code>up -d</code>. Append the key while it sleeps, then compare <code>docker compose restart</code> with reloading the file and <code>up -d</code>.</li>
<li>Put the three-line startup check at the top of a <code>server.js</code> and start it with <code>env -i</code> and one variable missing.</li>
</ol>
<p><strong>Done when:</strong> the production <code>.env</code> is unchanged after the excluded run; you can show <code>GIPHY_API_KEY=[]</code> after <code>restart</code> and the real value after <code>up -d</code>; and <code>node server.js</code> exits 1 naming exactly the missing variable.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Configuration</span><span class="v">Everything that differs between the places the same artifact runs: URLs, bucket names, credentials, log levels.</span></div>
  <div class="kv"><span class="k">Artifact</span><span class="v">The thing that is shipped — a build directory or an image — which must be identical in every environment.</span></div>
  <div class="kv"><span class="k">The Twelve-Factor App</span><span class="v">Heroku's 2011 list of habits for deployable apps; factor III says config lives in the environment, not in the code.</span></div>
  <div class="kv"><span class="k">Environment variable</span><span class="v">A name=value pair a process receives when it starts and reads with <code>process.env.X</code>.</span></div>
  <div class="kv"><span class="k">Exclude pattern</span><span class="v">An rsync rule (<code>--exclude='.env*'</code>) that stops a path being sent — and, with <code>--delete</code>, being deleted on the server.</span></div>
  <div class="kv"><span class="k">Fail fast</span><span class="v">Stopping at startup with a non-zero exit when a required value is missing, so the deploy fails instead of the site.</span></div>
  <div class="kv"><span class="k">Drift</span><span class="v">The server's configuration and the documented list (<code>.env.example</code>) quietly becoming different.</span></div>
  <div class="kv"><span class="k">Recreate</span><span class="v">Replacing a container with a new one (<code>up -d</code>); the only way a container picks up a changed environment.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Build the artifact once; configuration lives beside it on each server, never inside it — Heroku's factor III, and the "could I open-source this right now?" test.</li>
<li>A shared <code>.env</code> survives deploys and changes instantly, and a rollback does not revert it — so change variable names additively across two deploys.</li>
<li><code>rsync --exclude='.env*'</code> keeps the production file alive; <code>--delete-excluded</code> deletes it.</li>
<li>A container's environment is fixed when it is created: <code>restart</code> keeps the old values, <code>up -d</code> after reloading the file brings the new ones.</li>
<li>A variable added while a deploy is running is not in that deploy — recreate the container or deploy again, then check from inside by length.</li>
<li>Missing required variables should stop the process at startup, and <code>comm</code> against <code>.env.example</code> finds them before the deploy does.</li>
</ul>

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
${slide('dv-04', 3, 'Một tạo tác, nhiều môi trường: cấu hình đứng ngoài')}
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

<h3>Cái luật từ đâu ra, và phép thử một dòng</h3>
<p>Cái luật này có tên vì có một công ty cần viết nó ra giấy. Khoảng năm 2011, các lập trình viên ở Heroku — nền tảng mà deploy đúng nghĩa đen là gõ <code>git push heroku master</code> — công bố <em>The Twelve-Factor App (ứng dụng mười hai yếu tố)</em>, mười hai thói quen họ thấy lặp đi lặp lại ở những ứng dụng chạy tốt trên nền tảng của họ; Adam Wiggins là người trình bày. Yếu tố III, "Config (cấu hình)", nói: cất cấu hình trong môi trường, tách bạch hẳn khỏi mã. Lý do rất thực dụng chứ không triết lý gì: Heroku chạy CÙNG MỘT bản dựng (họ gọi là "slug") ở staging lẫn production, nên thứ gì khác nhau giữa hai nơi thì buộc phải đi vào từ BÊN NGOÀI bản dựng.</p>
<p>Yếu tố đó còn cho một phép thử đáng giá hơn cả định nghĩa: <strong>bạn có dám công khai kho mã này NGAY BÂY GIỜ mà không lộ một tín vật (credential — mật khẩu, token, khoá) nào không?</strong> Nếu câu trả lời là không, cấu hình đang sống bên trong mã. Hãy hỏi câu đó về chính kho SWP391 của nhóm trước khi deploy bất cứ thứ gì — phần lớn dự án đầu tay đều trượt, vì một tệp <code>application.properties</code> hay <code>.env</code> chứa mật khẩu cơ sở dữ liệu thật đã được commit từ tuần đầu và chẳng ai nhìn lại.</p>
<div class="callout warn"><strong>"Bọn mình chỉ có một máy chủ" không phải lý do để bỏ qua chuyện này.</strong> Bạn vẫn có laptop (môi trường phát triển), bạn sắp có máy của bạn cùng nhóm hay một VPS thứ hai, và vào cái ngày phải lùi bản (Chương 6) bạn sẽ muốn chạy <em>MÃ</em> cũ với <em>CẤU HÌNH</em> hôm nay — mật khẩu cơ sở dữ liệu hôm qua có khi đã không còn. Tổ hợp đó chỉ tồn tại được khi hai thứ là hai thứ riêng, với vòng đời riêng.</div>

<h3>Đo xuyên qua một lần deploy, một lần đổi cấu hình, và một cú lùi bản</h3>
${slide('dv-04', 4, 'Deploy, đổi cấu hình, lùi bản: đo cả ba')}
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

<h3>Cách bố trí thật: <code>/opt/&lt;app&gt;/.env</code> và một luật loại trừ của rsync</h3>
${slide('dv-04', 5, 'Loại .env* khỏi rsync: .env production sống qua mọi deploy')}
<p>Bố cục symlink ở trên là MỘT cách giữ cấu hình ngoài bản phát hành. Dự án đứng sau khoá học này dùng một cách đơn giản hơn mà chạy tốt không kém với Docker Compose: tệp <code>.env</code> production nằm ở <code>/opt/&lt;app&gt;/.env</code> trên VPS, <em>NGOÀI</em> thư mục mà mã được chép vào. Script deploy nạp nó ở MỖI lần chạy, còn lệnh rsync chép kho mã thì loại trừ (exclude) <code>.env*</code>. Chẳng việc gì một lần deploy làm có thể đụng tới tệp đó, nên một giá trị ghi vào đó một lần sẽ sống qua MỌI lần deploy sau. Đây là thứ mà luật loại trừ thật sự bảo vệ bạn khỏi, đo trên VPS thí nghiệm với một laptop có <code>.env</code> trỏ vào cơ sở dữ liệu phát triển của chính nó:</p>
<pre><code class="language-bash"># VPS thi nghiem: /opt/datlich/repo/.env = ban production
# laptop:         repo/.env             = ban dev (localhost)
rsync -a --delete ./ vps:/opt/datlich/repo/                          # KHONG loai tru
rsync -a --delete --exclude='.env*' ./ vps:/opt/datlich/repo/        # CO loai tru
rsync -a --delete --delete-excluded --exclude='.env*' ./ vps:/opt/datlich/repo/</code></pre>
<div class="out">$ rsync -a --delete ./ vps:/opt/datlich/repo/
(vps) repo/.env sau: DATABASE_URL="postgres://localhost/dev"
  . .. .env .env.example .env.local src
$ rsync -a --delete --exclude='.env*' ./ vps:/opt/datlich/repo/
(vps) repo/.env sau: DATABASE_URL="postgres://app@db/datlich"
  . .. .env .env.example src
$ rsync -a --delete --delete-excluded --exclude='.env*' ./ vps:/opt/datlich/repo/
. .. src</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không loại trừ thì laptop THẮNG</span><span class="v"><code>.env</code> phát triển của bạn ghi đè lên bản production, <code>.env.local</code> cũng theo lên, và rsync thoát 0. Lần khởi động lại kế tiếp nối production vào <code>localhost/dev</code> — thứ không hề tồn tại trên máy chủ.</span></div>
  <div class="kv"><span class="k">Có loại trừ thì production nguyên vẹn</span><span class="v">Đường dẫn bị loại trừ thì không được gửi đi — và quan trọng là <code>--delete</code> cũng KHÔNG xoá nó ở phía nhận. Chính nửa sau đó giữ cho tệp của máy chủ còn sống.</span></div>
  <div class="kv"><span class="k"><code>--delete-excluded</code> phá sạch sự bảo vệ</span><span class="v">Nó nghĩa là "xoá luôn, trên máy chủ, mọi thứ tôi đã loại trừ". Tệp <code>.env</code> production BIẾN MẤT. Trông như một cờ dọn dẹp cho gọn; trong script deploy thì nó là cái bẫy.</span></div>
  <div class="kv"><span class="k">Mẫu này bắt rộng</span><span class="v"><code>.env*</code> khớp cả <code>.env.example</code>, nên tệp mẫu không bao giờ lên máy chủ. Vô hại, nhưng đừng ngạc nhiên.</span></div>
</div>
<div class="callout ok"><strong>Dự án thật làm thế nào.</strong> Môi trường lúc chạy của production sống ở <code>/opt/cuonghoangdev/.env</code>. <code>deploy.sh</code> (đường rsync) loại trừ <code>.env*</code> và nạp tệp đó ở mỗi lần deploy, còn <code>deploy-nha.sh</code> thì chẳng hề chép cấu hình — nó gửi ẢNH, và VPS khởi động ảnh bằng cái tệp nó đã có sẵn. Hệ quả mà dự án tự ghi vào sổ tay của mình: <em>giá trị ở đó sống qua mọi lần deploy, vĩnh viễn</em> — đúng tính chất mà bài này nói tới. Tệp đó được sửa bằng tay, trên máy chủ, và KHÔNG ở đâu khác.</div>

<h3>Thêm một biến trong lúc deploy đang chạy</h3>
${slide('dv-04', 6, 'Thêm biến giữa lúc deploy: container không thấy')}
<p>Cách bố trí đó có đúng một cạnh sắc, và dự án đã đứt tay vì nó. Script deploy nạp <code>/opt/&lt;app&gt;/.env</code> <em>MỘT LẦN, lúc bắt đầu</em>. Nếu bạn thêm một biến mới vào tệp trong khi lần deploy đó còn đang dựng ảnh, thì lần deploy đã đọc tệp CŨ rồi — và container nó tạo ra vài phút sau được tạo ra KHÔNG có biến của bạn. Tái hiện trên Docker Desktop bằng một script nạp tệp, "dựng" trong bốn giây, rồi chạy <code>docker compose up -d</code>:</p>
<pre><code class="language-bash"># compose.yaml:   environment:  GIPHY_API_KEY: \${GIPHY_API_KEY-}
# deploy.sh:      set -a; . ./app.env; set +a;  sleep 4;  docker compose up -d
./deploy.sh &amp;  sleep 1.5;  printf 'GIPHY_API_KEY="xxxx12345"\\n' &gt;&gt; app.env;  wait</code></pre>
<div class="out">[deploy 08:56:57] da nap env, dang dung anh (gia lap 4 s)...
[tay    08:56:58] them GIPHY_API_KEY vao app.env
  Container dv04-web-1 Started
[deploy 08:57:02] xong
$ docker exec dv04-web-1 …
  trong container: GIPHY_API_KEY=[]
$ docker compose restart web
 Container dv04-web-1 Started
  trong container: GIPHY_API_KEY=[]
$ set -a; . ./app.env; set +a; docker compose up -d web
 Container dv04-web-1 Starting
 Container dv04-web-1 Started
  trong container: GIPHY_API_KEY=[xxxx12345]</div>
<table>
<tr><th>Sau khi đổi giá trị trong <code>.env</code>, bạn chạy…</th><th>Tiến trình có thấy không?</th></tr>
<tr><td><code>docker compose restart web</code></td><td>KHÔNG — vẫn container cũ, mà môi trường của một container được chốt lúc nó được <em>TẠO</em> (đo ở trên)</td></tr>
<tr><td><code>set -a; . .env; set +a; docker compose up -d web</code></td><td>CÓ — Compose thấy cấu hình đã đổi nên tạo lại container (đo ở trên)</td></tr>
<tr><td><code>systemctl restart app</code> với <code>EnvironmentFile=</code></td><td>CÓ — systemd đọc lại tệp ở MỖI lần khởi động (đo: giá trị mới hiện ra sau một lần restart)</td></tr>
<tr><td>Không làm gì — tiến trình cứ chạy tiếp</td><td>KHÔNG — môi trường của tiến trình đang chạy được chép lúc <code>exec</code> và không bao giờ đổi (Bài 4.2)</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>Bẫy — "mình thêm vào .env rồi, vậy là nó có rồi".</strong> Ghi tệp và việc tiến trình <em>ĐỌC</em> tệp là hai sự kiện, và chỉ sự kiện thứ hai mới tính. Luật mà chính dự án đặt ra sau lần đứt tay: nếu một biến được thêm vào khi một lần deploy đang chạy, lần deploy đó đã nạp môi trường TRƯỚC thay đổi, nên hãy tạo lại đúng cái container đó sau khi nạp môi trường (<code>docker compose -p &lt;project&gt; up -d --no-build &lt;service&gt;</code>) hoặc deploy lại. Rồi kiểm từ BÊN TRONG — <code>docker exec &lt;container&gt; sh -c 'echo \${#GIPHY_API_KEY}'</code> in ra <em>ĐỘ DÀI</em>, chứng minh giá trị đã tới mà không phải in nó ra.</div>
<h3>Cái gì thuộc về cấu hình, và cái gì thì không</h3>
${slide('dv-04', 8, 'Cái gì là cấu hình — và ai thắng khi trùng')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Mọi thứ KHÁC NHAU giữa các môi trường</span><span class="lz-d">URL cơ sở dữ liệu, điểm cuối API, tên bucket, mức log, cờ tính năng, số worker. Nếu staging và production bất đồng về nó thì theo định nghĩa nó là cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Mọi thứ BÍ MẬT</span><span class="lz-d">Mật khẩu, token, khoá ký, khoá riêng tư. Bí mật là một tập con của cấu hình với cách xử lý ngặt hơn — Bài 4.4.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Mọi thứ GIỐNG NHAU ở mọi nơi</span><span class="lz-d">Khai báo tuyến, hằng số timeout do chính mã bạn chọn, luật kiểm tra dữ liệu. Nhét mấy thứ này vào biến môi trường thì sinh ra một tệp <code>.env</code> sáu mươi dòng mà chẳng ai biết được BỐN dòng nào mới thật sự quan trọng.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Mọi thứ mà mã BẮT BUỘC phải đúng</span><span class="lz-d">Một giá trị mà sai thì ứng dụng vỡ, và chỉ có ĐÚNG MỘT đáp án đúng, thì thuộc về MÃ NGUỒN nơi nó được review và kiểm thử — chứ không thuộc về một tệp nằm trên máy chủ mà chẳng ai so sánh bao giờ.</span></div>
</div>
<p>Khi cùng một biến được đặt ở hơn một chỗ, câu hỏi "giá trị nào thắng?" có đáp án được ghi trong tài liệu của Compose (docs.docker.com, tính đến 09/2026), từ cao xuống thấp: <code>docker compose run -e</code> trên dòng lệnh; rồi một mục <code>environment:</code> hoặc <code>env_file:</code> có giá trị được nội suy (interpolate) từ shell của bạn hoặc từ tệp <code>.env</code> của dự án (<code>\${X}</code>); rồi một giá trị viết thẳng dưới <code>environment:</code>; rồi <code>env_file:</code>; và cuối cùng là <code>ENV</code> trong Dockerfile. Khi một container hiện ra một giá trị mà chẳng ai nhớ đã đặt, hãy đi dọc danh sách đó từ trên xuống thay vì đoán — thủ phạm quen thuộc là một <code>ENV</code> cũ nướng vào ảnh từ mấy tháng trước, và nó chỉ lộ ra khi mọi tầng phía trên đều trống.</p>
<div class="callout warn"><strong>Một biến môi trường bị THIẾU thì phải làm DỪNG tiến trình, đừng lấy giá trị mặc định.</strong> Kiểu hỏng ở Bài 0.3 — một tiến trình trông khoẻ mạnh trả 500 cho tất cả — xảy ra khi mã đọc <code>process.env.DATABASE_URL</code>, nhận về <code>undefined</code>, rồi cứ thế đi tiếp. Hãy kiểm ngay lúc khởi động và thoát ra KHÁC 0 nếu thiếu thứ bắt buộc: khi đó trình quản lý dịch vụ báo một lần khởi động thất bại, phép kiểm sẵn sàng của lần deploy không bao giờ qua, và bước tráo ở Chương 3 không bao giờ xảy ra. Một biến bị thiếu trở thành một LẦN DEPLOY HỎNG thay vì một WEBSITE HỎNG.</div>
<pre><code class="language-javascript"><span class="tok-comment">// dau vao cua ung dung, truoc khi lang nghe cong</span>
const BAT_BUOC = ['DATABASE_URL', 'JWT_SECRET', 'R2_BUCKET'];
const thieu = BAT_BUOC.filter(k =&gt; !process.env[k]);
if (thieu.length) {
  console.error('Thieu bien moi truong bat buoc:', thieu.join(', '));
  process.exit(1);          <span class="tok-comment">// khac 0 ⇒ deploy DUNG LAI</span>
}</code></pre>

<h3>Giữ cho cái danh sách đó trung thực</h3>
${slide('dv-04', 7, 'Thiếu biến thì DỪNG; so .env.example với máy chủ')}
<p>Một tệp <code>.env.example</code> commit vào kho mã chính là tài liệu, và nó là phần DUY NHẤT của cấu hình thuộc về git — TÊN biến và giá trị giả, không bao giờ giá trị thật. Phép đo giữ cho nó đúng là một lệnh so sánh:</p>
<pre><code><span class="tok-comment"># bien nao co trong .env.example ma THIEU tren may chu?</span>
comm -23 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)

<span class="tok-comment"># va nguoc lai: bien nao tren may chu ma khong ai ghi lai?</span>
comm -13 &lt;(grep -oE '^[A-Z_]+' .env.example | sort -u) \\
         &lt;(ssh vps "grep -oE '^[A-Z_]+' /srv/app/chung/.env" | sort -u)</code></pre>
<div class="note-ct">Cả HAI chiều đều quan trọng. Chiều thứ nhất tìm ra cái biến mà mã mới của bạn cần và chẳng ai thêm lên máy chủ — đúng kiểu hỏng ở Bài 0.3, bắt được TRƯỚC khi deploy thay vì sau. Chiều thứ hai tìm ra những thiết lập chỉ tồn tại trên máy chủ, và đó là cách một cái máy trở nên KHÔNG DỰNG LẠI NỔI: có thứ gì đó phụ thuộc vào một giá trị chẳng được ghi ở đâu cả. Hãy chạy chiều thứ hai trên một máy chủ bạn vừa tiếp quản; cái danh sách thường dài hơn mọi người tưởng.</div>
<h3>Đo thật: phép kiểm lúc khởi động và phép kiểm trôi lệch</h3>
<p>Cả hai đoạn mã ở trên, chạy thật. Phép kiểm lúc khởi động trên Mac với Node 22 (<code>env -i</code> bắt đầu từ một môi trường RỖNG, nên chẳng có gì từ shell của bạn lọt vào), và phép kiểm trôi lệch (drift) giữa <code>.env.example</code> ở laptop với VPS thí nghiệm:</p>
<div class="out">$ env -i DATABASE_URL=postgres://app@db/datlich node server.js; echo "exit=$?"
Thieu bien moi truong bat buoc: JWT_SECRET, R2_BUCKET
exit=1
$ env -i DATABASE_URL=… JWT_SECRET=xxxx R2_BUCKET=anh node server.js
dang nghe cong 3000
$ comm -23 &lt;(… .env.example …) &lt;(ssh vps … /opt/datlich/.env …)    # thieu tren may chu
GIPHY_API_KEY
$ comm -13 …                                                    # chi co tren may chu
OLD_SMTP_PASS</div>
<p>Hãy đọc kết quả trôi lệch như hai việc cần làm: <code>GIPHY_API_KEY</code> phải được thêm lên máy chủ <em>TRƯỚC</em> khi mã cần nó được deploy, còn <code>OLD_SMTP_PASS</code> thì hoặc đã chết (xoá đi) hoặc chưa được ghi lại (thêm vào <code>.env.example</code>). Cả hai lệnh dùng <code>&lt;( … )</code> — process substitution (thay thế tiến trình) — thứ có trong bash và zsh nhưng KHÔNG có trong PowerShell hay <code>cmd.exe</code>; bạn cùng nhóm dùng Windows nên chạy chúng trong WSL. <code>comm</code> còn đòi cả hai đầu vào phải được SẮP XẾP, nên nhánh nào cũng kết thúc bằng <code>sort -u</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước buổi bảo vệ SWP391, một bạn trong nhóm deploy từ laptop của mình và website bắt đầu trả 500 — production giờ đang nói chuyện với <code>localhost/dev</code>. Rồi trong lần deploy sửa lỗi, có người thêm khoá GIF vào <code>.env</code> của máy chủ, và bộ chọn GIF VẪN không chạy. Hãy tái hiện cả hai và sửa cho đúng, trên VPS thí nghiệm (cái ở Chương 2: một container Ubuntu 24.04 có sshd).</p>
<ol>
<li>Trên VPS tạo <code>/opt/datlich/repo/.env</code> với một <code>DATABASE_URL</code> "production" rồi <code>chmod 600</code>. Ở máy bạn tạo <code>repo/.env</code> trỏ vào <code>localhost/dev</code>. Chạy <code>rsync -a --delete</code> KHÔNG loại trừ, rồi đọc <code>.env</code> trên máy chủ.</li>
<li>Khôi phục nó, chạy lại với <code>--exclude='.env*'</code>, và xác nhận giá trị production còn nguyên. Rồi thử <code>--delete-excluded</code> một lần, CỐ Ý, và xem tệp ra sao.</li>
<li>Với Compose, viết một dịch vụ có <code>environment:</code> dùng <code>\${GIPHY_API_KEY-}</code> và một <code>deploy.sh</code> nạp <code>.env</code>, ngủ 4 giây, rồi chạy <code>up -d</code>. Thêm khoá vào trong lúc nó ngủ, rồi so <code>docker compose restart</code> với việc nạp lại tệp và <code>up -d</code>.</li>
<li>Đặt phép kiểm lúc khởi động ba dòng lên đầu một <code>server.js</code> và khởi động nó bằng <code>env -i</code> với một biến bị thiếu.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>.env</code> production không đổi sau lần chạy có loại trừ; bạn chỉ ra được <code>GIPHY_API_KEY=[]</code> sau <code>restart</code> và giá trị thật sau <code>up -d</code>; và <code>node server.js</code> thoát 1, nêu đúng tên biến bị thiếu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Configuration (cấu hình)</span><span class="v">Mọi thứ khác nhau giữa những nơi cùng một tạo tác chạy: URL, tên bucket, tín vật, mức log.</span></div>
  <div class="kv"><span class="k">Artifact (tạo tác)</span><span class="v">Thứ được gửi đi — một thư mục đã dựng hay một ảnh — phải giống hệt nhau ở mọi môi trường.</span></div>
  <div class="kv"><span class="k">The Twelve-Factor App (ứng dụng mười hai yếu tố)</span><span class="v">Danh sách thói quen của Heroku (2011) cho ứng dụng deploy được; yếu tố III nói cấu hình sống trong môi trường, không trong mã.</span></div>
  <div class="kv"><span class="k">Environment variable (biến môi trường)</span><span class="v">Cặp tên=giá trị mà tiến trình nhận lúc khởi động và đọc bằng <code>process.env.X</code>.</span></div>
  <div class="kv"><span class="k">Exclude pattern (mẫu loại trừ)</span><span class="v">Luật rsync (<code>--exclude='.env*'</code>) chặn một đường dẫn khỏi bị gửi đi — và, khi có <code>--delete</code>, khỏi bị xoá trên máy chủ.</span></div>
  <div class="kv"><span class="k">Fail fast (hỏng sớm)</span><span class="v">Dừng ngay lúc khởi động với mã thoát khác 0 khi thiếu giá trị bắt buộc, để lần deploy hỏng thay vì website hỏng.</span></div>
  <div class="kv"><span class="k">Drift (trôi lệch)</span><span class="v">Cấu hình trên máy chủ và danh sách được ghi lại (<code>.env.example</code>) lặng lẽ trở nên khác nhau.</span></div>
  <div class="kv"><span class="k">Recreate (tạo lại)</span><span class="v">Thay một container bằng container mới (<code>up -d</code>); cách DUY NHẤT để container nhận môi trường đã đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng tạo tác một lần; cấu hình sống CẠNH nó trên từng máy chủ, không bao giờ bên trong — yếu tố III của Heroku, cùng phép thử "mình có dám công khai kho này ngay bây giờ không?".</li>
<li>Một <code>.env</code> dùng chung sống qua các lần deploy và đổi là ăn ngay, còn cú lùi bản thì KHÔNG hoàn tác nó — nên đổi tên biến theo kiểu cộng thêm qua hai lần deploy.</li>
<li><code>rsync --exclude='.env*'</code> giữ tệp production còn sống; <code>--delete-excluded</code> thì xoá nó.</li>
<li>Môi trường của container chốt lúc TẠO: <code>restart</code> giữ giá trị cũ, <code>up -d</code> sau khi nạp lại tệp mới mang giá trị mới.</li>
<li>Biến thêm vào khi một lần deploy đang chạy KHÔNG có trong lần deploy đó — tạo lại container hoặc deploy lại, rồi kiểm từ bên trong bằng độ dài.</li>
<li>Thiếu biến bắt buộc thì tiến trình phải dừng lúc khởi động, và <code>comm</code> so với <code>.env.example</code> tìm ra chúng trước khi lần deploy tìm ra.</li>
</ul>

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
${slide('dv-04', 9, 'Hai thời điểm: lúc DỰNG và lúc CHẠY')}
<pre><code class="language-javascript"><span class="tok-comment">// gia tri nay duoc DOC luc CHAY</span>
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
${slide('dv-04', 11, 'Khoá bên thứ ba đi qua backend, không qua trình duyệt')}
<div class="callout warn"><strong>Anything a browser runs is baked at build time.</strong> A front-end bundle is a static file downloaded by a browser — there is no server-side environment for it to read. So every framework has a mechanism for inlining values during the build, and every one of them has this property: <code>NEXT_PUBLIC_*</code> in Next.js, <code>VITE_*</code> in Vite, <code>REACT_APP_*</code> in Create React App. Change one on the server and restart, and nothing whatsoever happens. The value is in a JavaScript file that was written weeks ago.</div>
<p>This project has the incident on record. A GIF picker called a third-party API directly from the browser using a key baked in at build time. The key was absent when the bundle was built, so the library fell back to its own public demo key — which had been revoked — and every request returned 403. Nothing in the deploy was wrong: the environment variable existed on the server, the container had it, the restart worked. It just was not the moment that mattered.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build-time values must be present when you build</span><span class="lz-d">Which means the build machine needs them — in CI secrets, in <code>docker build --build-arg</code>, in the environment of whatever runs <code>npm run build</code>. A missing one usually produces <code>undefined</code> in the bundle rather than an error.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Changing one requires a rebuild and a redeploy</span><span class="lz-d">Not a restart. This is worth writing on the variable itself: a comment in <code>.env.example</code> saying <em>rebuild required</em> saves an hour every time someone new changes it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">They are public, permanently</span><span class="lz-d">The value is in a file the browser downloads. Anyone can read it. The naming conventions say so out loud — <code>PUBLIC</code> is in the name — and it is still the single most common place for a secret key to end up.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">A third-party key must never be one</span><span class="lz-d">The fix this project used: a small authenticated backend route that proxies the call, with the key read from run-time environment on the server. The browser talks to your API; your API talks to the third party. Rotating the key becomes a restart instead of a rebuild.</span></div>
</div>

<h3>Measured on a real Next.js build</h3>
${slide('dv-04', 10, 'Đổi NEXT_PUBLIC_* rồi restart: trình duyệt vẫn thấy khoá cũ')}
<p>The measurement above used a stand-in for a bundler. Here is the same thing with the real tool: a two-component Next.js 15.5 app built on the Mac. The server component prints <code>process.env.API_URL</code> on every request (<code>dynamic = 'force-dynamic'</code>); the client component — the GIF button — prints <code>process.env.NEXT_PUBLIC_GIPHY_KEY</code>. Built once with the "old" key, then started with <em>both</em> variables changed:</p>
<pre><code class="language-bash">NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345 npx next build
grep -rl "khoa-CU-12345" .next/static                     # gia tri nam o dau?
grep -rc "NEXT_PUBLIC_GIPHY_KEY" .next/static | grep -v ":0"   # ten bien con khong?
API_URL=https://api.MOI.example NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345 npx next start -p 19043</code></pre>
<div class="out">$ grep -rl "khoa-CU-12345" .next/static
.next/static/chunks/app/page-12c1e399c4ed7646.js
$ grep -rc "NEXT_PUBLIC_GIPHY_KEY" .next/static | grep -v ":0"
(khong con ten bien nao)
$ API_URL=https://api.cu.example NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345 next start
  server doc luc CHAY: https://api.cu.example
  trinh duyet tai /_next/static/chunks/app/page-12c1e399c4ed7646.js:
    khoa-CU-12345
$ API_URL=https://api.MOI.example NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345 next start   # doi env, KHONG dung lai
  server doc luc CHAY: https://api.MOI.example
  trinh duyet tai /_next/static/chunks/app/page-12c1e399c4ed7646.js:
    khoa-CU-12345
$ NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345 next build &amp;&amp; next start
  /_next/static/chunks/app/page-58311785cffc528f.js
khoa-MOI-12345</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The variable's name is gone from the bundle</span><span class="v">Zero files in <code>.next/static</code> contain <code>NEXT_PUBLIC_GIPHY_KEY</code>. The build replaced the expression with the string, so there is nothing left that <em>could</em> read the environment later.</span></div>
  <div class="kv"><span class="k">Server and browser disagreed, from one restart</span><span class="v">The server printed the new API URL; the browser downloaded a file that still says <code>khoa-CU-12345</code>. Same process, same restart, two different answers.</span></div>
  <div class="kv"><span class="k">The file name is the tell</span><span class="v">After rebuilding, <code>page-12c1e…</code> became <code>page-58311…</code>: the name is a hash of the content, and the content changed because the value lives inside it.</span></div>
  <div class="kv"><span class="k">Anyone can read it</span><span class="v">It is served to every visitor as a static file. "Public" in the prefix is not a suggestion.</span></div>
</div>
<div class="callout warn"><strong>On Windows the build command itself differs.</strong> <code>NEXT_PUBLIC_X=abc npm run build</code> is shell syntax: it works in bash, zsh and WSL, and fails in PowerShell and <code>cmd.exe</code>. PowerShell needs <code>$env:NEXT_PUBLIC_X="abc"; npm run build</code>; many projects use the <code>cross-env</code> package so one <code>package.json</code> script works everywhere. A teammate who builds on Windows without setting it produces a bundle with <code>undefined</code> in it — no error, just a broken feature.</div>
<h3>Telling them apart</h3>
${slide('dv-04', 13, '/proc/PID/environ: tiến trình thật sự thấy gì')}
<pre><code class="language-bash"><span class="tok-comment"># gia tri co nam TRONG goi da dung khong? (⇒ luc DUNG, va CONG KHAI)</span>
grep -r "api.cu.com" dist/ .next/ build/ 2&gt;/dev/null

<span class="tok-comment"># tien trinh dang chay THAT SU thay nhung bien nao? (⇒ luc CHAY)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js' | head -1)/environ | sort

<span class="tok-comment"># trinh duyet thay gi — phep thu cuoi cung, tren chinh trang that</span>
<span class="tok-comment"># (curl KHONG mo rong dau *: lay danh sach tep JS tu HTML truoc, roi tai tung tep)</span>
curl -s https://cuongthai.com/ | grep -oE '/_next/static/[^"]+\\.js' | sort -u \\
  | while read -r js; do curl -s "https://cuongthai.com\$js"; done | grep -o 'https://[a-z.]*' | sort -u</code></pre>
<div class="note-ct">The second command is the one worth remembering. <code>/proc/&lt;pid&gt;/environ</code> is the environment the process actually received — not what is in <code>.env</code>, not what your shell has, not what the unit file says. When a variable "should be set" and the application disagrees, this settles it in one line. Note the null separators: environment entries are <code>\\0</code>-delimited, which is why the <code>tr</code> is needed.</div>

<h3>Measured: what <code>/proc/PID/environ</code> shows, and who may read it</h3>
<p>On the lab VPS, a stand-in service (<code>exec -a datlich-api sleep 600</code>) started with a <code>.env</code> loaded; then the file was edited while it kept running:</p>
<div class="out">$ PID=$(pgrep -f datlich-api)   # 462
$ tr "\\0" "\\n" &lt; /proc/$PID/environ | grep ^DATABASE_URL
DATABASE_URL=postgres://app@db/datlich
$ sed -i "s#db/#db-moi/#" p.env; grep DATABASE p.env
DATABASE_URL="postgres://app@db-moi/datlich"
$ tr "\\0" "\\n" &lt; /proc/$PID/environ | grep ^DATABASE_URL   # tien trinh CU
DATABASE_URL=postgres://app@db/datlich
$ tr "\\0" "\\n" &lt; /proc/$PID/environ | awk -F= '/^DB_PASS/{print "do dai:", length($2)}'
do dai: 31
$ su khach -c "cat /proc/462/environ"
cat: /proc/462/environ: Permission denied</div>
<p>Three facts in five lines. The environment a process holds is a <em>copy made when it started</em>: editing the file afterwards changed nothing inside the process. Printing a secret's <em>length</em> answers "did the whole value arrive?" without putting the secret in your terminal history. And the file is readable only by the process's owner and root — another user on the machine gets <code>Permission denied</code>, which is one reason environment variables are an acceptable place for secrets on a server you control. Inside a container the equivalent is <code>docker exec &lt;container&gt; printenv X</code>.</p>
<div class="pitfall co-tieu-de"><strong>Corrected — the third command in the block above used to be <code>curl -s …/_next/static/chunks/main-*.js</code>.</strong> That never worked: curl does not expand <code>*</code>. Measured against a local Next.js server, zsh refuses to run it at all (<code>zsh: no matches found: …/main-*.js</code>) and bash sends the asterisk literally and gets <code>404</code>. The value was not in <code>main-*.js</code> anyway — it lives in the page's own chunk. The version now in the block first reads the list of script files from the HTML, then fetches each one; run against the local build it printed <code>/_next/static/chunks/app/page-58311785cffc528f.js: khoa-MOI-12345</code>.</div>
<h3>A third moment: image build time</h3>
${slide('dv-04', 12, 'ARG lộ trong docker history, secret mount thì không')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ARG</code> — available while building the image</span><span class="lz-lnote">Passed with <code>--build-arg</code>, visible to <code>RUN</code> steps, and gone once the image exists. This is the moment a front-end bundle is produced, so build-time front-end variables have to arrive here.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ENV</code> — baked into the image, visible at run time</span><span class="lz-lnote">Part of the image, so the same for every container from it — and readable by anyone who can pull the image. Fine for <code>NODE_ENV=production</code>, wrong for anything secret.</span></div>
  <div class="lz-layer"><span class="lz-lname">Compose <code>environment</code> / <code>env_file</code> — run time</span><span class="lz-lnote">Supplied when the container starts, so it can differ per environment and can be changed with a restart. This is where secrets belong of the three.</span></div>
  <div class="lz-layer"><span class="lz-lname">And a build arg is not a secret either</span><span class="lz-lnote">It appears in the image history — <code>docker history</code> shows it. Passing a token as <code>--build-arg</code> publishes it to anyone with the image. Use <code>RUN --mount=type=secret</code> when a build genuinely needs a credential.</span></div>
</div>
<p>Measured with Docker 29.8: one Dockerfile with an <code>ARG NPM_TOKEN</code> used by a <code>RUN</code> step, and a second step that reads a build secret mounted with <code>--mount=type=secret</code>:</p>
<pre><code class="language-dockerfile">FROM alpine:latest
ARG NPM_TOKEN
ENV NODE_ENV=production
RUN echo "dung voi token dai \${#NPM_TOKEN} ky tu" &gt; /dung.txt
RUN --mount=type=secret,id=npmrc cat /run/secrets/npmrc | wc -c &gt; /secret-len.txt</code></pre>
<div class="out">$ docker build --build-arg NPM_TOKEN=xxxx12345-bi-mat-that --secret id=npmrc,src=npmrc.txt -t dv04-argthu .
$ docker history --no-trunc --format "{{.CreatedBy}}" dv04-argthu | head -4
RUN |1 NPM_TOKEN=xxxx12345-bi-mat-that /bin/sh -c cat /run/secrets/npmrc | wc -c &gt; /secret-len.txt # buildkit
RUN |1 NPM_TOKEN=xxxx12345-bi-mat-that /bin/sh -c echo "dung voi token dai \${#NPM_TOKEN} ky tu" &gt; /dung.txt # …
ENV NODE_ENV=production
ARG NPM_TOKEN=xxxx12345-bi-mat-that
$ docker inspect -f "{{.Config.Env}}" dv04-argthu
[PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin NODE_ENV=production]
$ docker run --rm dv04-argthu sh -c 'cat /secret-len.txt; ls /run/secrets'
22
ls: /run/secrets: No such file or directory</div>
<p>The build arg appears <strong>three times</strong> in the image's history, in full, for anyone who can pull the image — including every <code>RUN</code> line that merely ran while it was set. The <code>ENV</code> line is in the image config and so in every container. The secret's <em>content</em> appears nowhere: the step could read it (22 bytes), but it was mounted only for that one <code>RUN</code> and is not in any layer or in the history. That is the whole difference between a build argument and a build secret.</p>
<div class="pitfall"><strong>Trap — a value baked at build time makes one artifact per environment.</strong> If the production bundle contains <code>https://api.cuongthai.com</code> and the staging bundle contains <code>https://api.staging.cuongthai.com</code>, they are different artifacts — so the thing you tested in staging is not the thing you deployed, which is exactly what Lesson 1.2 was built to prevent. Where it matters, the escape is to have the browser fetch its configuration at run time from your own server: one artifact, a small <code>/config.json</code> endpoint, and the twelve-factor property is restored.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> after a deploy the GIF picker returns 403. Someone already "fixed" it by adding the key to the server's <code>.env</code> and restarting — twice. Prove where the key really lives, then move it somewhere it can be rotated with a restart.</p>
<ol>
<li>Make a two-file Next.js app (a server component printing <code>process.env.API_URL</code>, a <code>'use client'</code> component printing <code>process.env.NEXT_PUBLIC_GIPHY_KEY</code>). Build with <code>NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345</code>.</li>
<li><code>grep -rl</code> the value and the variable name in <code>.next/static</code>. Start with both variables changed and fetch the page's chunk with the loop from this lesson — which value does the browser get?</li>
<li>Rebuild with the new value and note the chunk's new file name.</li>
<li>Build the four-line Dockerfile above with a <code>--build-arg</code> and a <code>--secret</code>, and read <code>docker history --no-trunc</code>. Delete the image afterwards.</li>
</ol>
<p><strong>Done when:</strong> you can point at the exact file and line where the old key lives, the browser shows the new key only after a rebuild, and <code>docker history</code> shows the build arg but not the secret's content.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build time</span><span class="v">When the artifact is produced (<code>next build</code>, <code>docker build</code>); values used here are frozen into it.</span></div>
  <div class="kv"><span class="k">Run time</span><span class="v">When the process starts on the server; values read here can change with a restart.</span></div>
  <div class="kv"><span class="k">Inlining</span><span class="v">A bundler replacing <code>process.env.NEXT_PUBLIC_X</code> with the literal string during the build.</span></div>
  <div class="kv"><span class="k">Bundle</span><span class="v">The JavaScript files a browser downloads — public by nature.</span></div>
  <div class="kv"><span class="k">Build argument</span><span class="v">A Dockerfile <code>ARG</code>, passed with <code>--build-arg</code>; recorded in the image history.</span></div>
  <div class="kv"><span class="k">Build secret</span><span class="v"><code>RUN --mount=type=secret</code>: a file available to one build step and stored nowhere.</span></div>
  <div class="kv"><span class="k"><code>/proc/PID/environ</code></span><span class="v">The environment a running process actually received, NUL-separated, readable by its owner and root.</span></div>
  <div class="kv"><span class="k">Backend proxy</span><span class="v">Your own authenticated route that calls a third party with a key kept on the server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Some configuration is read at run time and some is written into the artifact at build time; they look the same in source code.</li>
<li><code>NEXT_PUBLIC_*</code>, <code>VITE_*</code>, <code>REACT_APP_*</code> are inlined: measured, the variable name vanished from the bundle and a restart with a new value changed nothing in the browser.</li>
<li>Anything inlined is public; a third-party key belongs behind a backend route that reads it at run time — the fix after the GIPHY 403.</li>
<li><code>--build-arg</code> is recorded in <code>docker history</code>; <code>RUN --mount=type=secret</code> is the build-time mechanism for credentials.</li>
<li><code>/proc/PID/environ</code> is the truth about what a process received — a copy from startup, readable only by its owner and root.</li>
<li>curl does not expand <code>*</code>: to check what the browser downloads, list the scripts from the HTML and fetch each.</li>
</ul>

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
${slide('dv-04', 9, 'Hai thời điểm: lúc DỰNG và lúc CHẠY')}
<pre><code class="language-javascript"><span class="tok-comment">// gia tri nay duoc DOC luc CHAY</span>
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
${slide('dv-04', 11, 'Khoá bên thứ ba đi qua backend, không qua trình duyệt')}
<div class="callout warn"><strong>Mọi thứ TRÌNH DUYỆT chạy đều được nướng lúc dựng.</strong> Một gói front end là một tệp tĩnh do trình duyệt tải về — chẳng có môi trường phía máy chủ nào cho nó đọc cả. Nên mọi framework đều có một cơ chế nhúng giá trị vào trong lúc dựng, và cơ chế nào cũng mang tính chất này: <code>NEXT_PUBLIC_*</code> ở Next.js, <code>VITE_*</code> ở Vite, <code>REACT_APP_*</code> ở Create React App. Đổi một cái trên máy chủ rồi khởi động lại thì TUYỆT ĐỐI chẳng có gì xảy ra. Cái giá trị đó nằm trong một tệp JavaScript được viết ra từ mấy tuần trước.</div>
<p>Dự án này có sự cố đó trong hồ sơ. Một bộ chọn ảnh GIF gọi thẳng API bên thứ ba từ trình duyệt bằng một cái khoá nướng lúc dựng. Cái khoá không có mặt lúc gói được dựng, nên thư viện tự lùi về khoá demo công khai của chính nó — mà khoá đó đã bị thu hồi — và mọi request trả 403. Chẳng có gì trong lần deploy sai cả: biến môi trường CÓ trên máy chủ, container CÓ nó, cú restart CÓ chạy. Nó chỉ đơn giản là không phải cái thời điểm cần thiết.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Giá trị lúc dựng phải CÓ MẶT lúc bạn dựng</span><span class="lz-d">Nghĩa là máy dựng cần có chúng — trong secret của CI, trong <code>docker build --build-arg</code>, trong môi trường của bất cứ thứ gì chạy <code>npm run build</code>. Thiếu một cái thì thường sinh ra <code>undefined</code> trong gói chứ không sinh ra lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đổi một cái thì phải DỰNG LẠI và DEPLOY LẠI</span><span class="lz-d">Không phải khởi động lại. Điều này đáng ghi ngay lên chính cái biến đó: một dòng chú thích trong <code>.env.example</code> ghi <em>phải dựng lại</em> tiết kiệm được một giờ mỗi lần có người mới đụng vào nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chúng CÔNG KHAI, vĩnh viễn</span><span class="lz-d">Giá trị nằm trong một tệp mà trình duyệt tải về. Ai cũng đọc được. Chính quy ước đặt tên đã nói thẳng ra rồi — chữ <code>PUBLIC</code> nằm trong tên — và nó vẫn là chỗ phổ biến NHẤT để một cái khoá bí mật kết thúc cuộc đời.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Khoá của bên thứ ba thì TUYỆT ĐỐI không được là một cái như vậy</span><span class="lz-d">Cách sửa mà dự án này dùng: một tuyến backend nhỏ có xác thực đứng ra gọi hộ, với cái khoá đọc từ môi trường lúc CHẠY trên máy chủ. Trình duyệt nói chuyện với API của bạn; API của bạn nói chuyện với bên thứ ba. Xoay khoá trở thành một cú restart thay vì một lần dựng lại.</span></div>
</div>

<h3>Đo trên một bản dựng Next.js thật</h3>
${slide('dv-04', 10, 'Đổi NEXT_PUBLIC_* rồi restart: trình duyệt vẫn thấy khoá cũ')}
<p>Phép đo ở trên dùng một thứ đóng thế cho bundler (bộ đóng gói). Đây là cùng chuyện đó với công cụ thật: một ứng dụng Next.js 15.5 hai thành phần dựng trên Mac. Server component in ra <code>process.env.API_URL</code> ở MỖI request (<code>dynamic = 'force-dynamic'</code>); client component — cái nút GIF — in ra <code>process.env.NEXT_PUBLIC_GIPHY_KEY</code>. Dựng một lần với khoá "cũ", rồi khởi động với <em>CẢ HAI</em> biến đã đổi:</p>
<pre><code class="language-bash">NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345 npx next build
grep -rl "khoa-CU-12345" .next/static                     # gia tri nam o dau?
grep -rc "NEXT_PUBLIC_GIPHY_KEY" .next/static | grep -v ":0"   # ten bien con khong?
API_URL=https://api.MOI.example NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345 npx next start -p 19043</code></pre>
<div class="out">$ grep -rl "khoa-CU-12345" .next/static
.next/static/chunks/app/page-12c1e399c4ed7646.js
$ grep -rc "NEXT_PUBLIC_GIPHY_KEY" .next/static | grep -v ":0"
(khong con ten bien nao)
$ API_URL=https://api.cu.example NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345 next start
  server doc luc CHAY: https://api.cu.example
  trinh duyet tai /_next/static/chunks/app/page-12c1e399c4ed7646.js:
    khoa-CU-12345
$ API_URL=https://api.MOI.example NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345 next start   # doi env, KHONG dung lai
  server doc luc CHAY: https://api.MOI.example
  trinh duyet tai /_next/static/chunks/app/page-12c1e399c4ed7646.js:
    khoa-CU-12345
$ NEXT_PUBLIC_GIPHY_KEY=khoa-MOI-12345 next build &amp;&amp; next start
  /_next/static/chunks/app/page-58311785cffc528f.js
khoa-MOI-12345</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tên biến BIẾN MẤT khỏi gói</span><span class="v">Không tệp nào trong <code>.next/static</code> còn chứa chữ <code>NEXT_PUBLIC_GIPHY_KEY</code>. Bản dựng đã thay cả biểu thức bằng chuỗi, nên chẳng còn gì <em>CÓ THỂ</em> đọc môi trường về sau.</span></div>
  <div class="kv"><span class="k">Server và trình duyệt bất đồng, từ CÙNG một cú restart</span><span class="v">Server in ra URL API mới; trình duyệt tải về một tệp vẫn ghi <code>khoa-CU-12345</code>. Cùng tiến trình, cùng cú restart, hai câu trả lời khác nhau.</span></div>
  <div class="kv"><span class="k">Tên tệp là dấu hiệu</span><span class="v">Sau khi dựng lại, <code>page-12c1e…</code> thành <code>page-58311…</code>: cái tên là mã băm của nội dung, và nội dung đổi vì giá trị nằm NGAY TRONG nó.</span></div>
  <div class="kv"><span class="k">Ai cũng đọc được</span><span class="v">Nó được phục vụ cho MỌI khách truy cập dưới dạng tệp tĩnh. Chữ "Public" trong tiền tố không phải lời gợi ý.</span></div>
</div>
<div class="callout warn"><strong>Trên Windows, chính lệnh dựng đã khác.</strong> <code>NEXT_PUBLIC_X=abc npm run build</code> là cú pháp shell: chạy trong bash, zsh và WSL, và HỎNG trong PowerShell lẫn <code>cmd.exe</code>. PowerShell cần <code>$env:NEXT_PUBLIC_X="abc"; npm run build</code>; nhiều dự án dùng gói <code>cross-env</code> để một script trong <code>package.json</code> chạy được ở mọi nơi. Một bạn cùng nhóm dựng trên Windows mà không đặt biến sẽ sinh ra một gói có chữ <code>undefined</code> bên trong — không lỗi, chỉ một tính năng hỏng.</div>
<h3>Phân biệt chúng</h3>
${slide('dv-04', 13, '/proc/PID/environ: tiến trình thật sự thấy gì')}
<pre><code class="language-bash"><span class="tok-comment"># gia tri co nam TRONG goi da dung khong? (⇒ luc DUNG, va CONG KHAI)</span>
grep -r "api.cu.com" dist/ .next/ build/ 2&gt;/dev/null

<span class="tok-comment"># tien trinh dang chay THAT SU thay nhung bien nao? (⇒ luc CHAY)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js' | head -1)/environ | sort

<span class="tok-comment"># trinh duyet thay gi — phep thu cuoi cung, tren chinh trang that</span>
<span class="tok-comment"># (curl KHONG mo rong dau *: lay danh sach tep JS tu HTML truoc, roi tai tung tep)</span>
curl -s https://cuongthai.com/ | grep -oE '/_next/static/[^"]+\\.js' | sort -u \\
  | while read -r js; do curl -s "https://cuongthai.com\$js"; done | grep -o 'https://[a-z.]*' | sort -u</code></pre>
<div class="note-ct">Lệnh thứ hai là lệnh đáng nhớ. <code>/proc/&lt;pid&gt;/environ</code> là môi trường mà tiến trình THẬT SỰ nhận được — không phải thứ nằm trong <code>.env</code>, không phải thứ shell của bạn có, không phải thứ tệp unit nói. Khi một biến "lẽ ra phải được đặt" mà ứng dụng thì không đồng ý, cái này phân xử trong một dòng. Để ý dấu phân cách null: các mục môi trường ngăn nhau bằng <code>\\0</code>, và đó là lý do cần tới lệnh <code>tr</code>.</div>

<h3>Đo thật: <code>/proc/PID/environ</code> cho thấy gì, và ai được đọc</h3>
<p>Trên VPS thí nghiệm, một dịch vụ đóng thế (<code>exec -a datlich-api sleep 600</code>) khởi động với một <code>.env</code> đã nạp; rồi tệp bị sửa trong lúc nó vẫn chạy:</p>
<div class="out">$ PID=$(pgrep -f datlich-api)   # 462
$ tr "\\0" "\\n" &lt; /proc/$PID/environ | grep ^DATABASE_URL
DATABASE_URL=postgres://app@db/datlich
$ sed -i "s#db/#db-moi/#" p.env; grep DATABASE p.env
DATABASE_URL="postgres://app@db-moi/datlich"
$ tr "\\0" "\\n" &lt; /proc/$PID/environ | grep ^DATABASE_URL   # tien trinh CU
DATABASE_URL=postgres://app@db/datlich
$ tr "\\0" "\\n" &lt; /proc/$PID/environ | awk -F= '/^DB_PASS/{print "do dai:", length($2)}'
do dai: 31
$ su khach -c "cat /proc/462/environ"
cat: /proc/462/environ: Permission denied</div>
<p>Ba sự thật trong năm dòng. Môi trường mà một tiến trình giữ là một <em>BẢN SAO chép lúc nó khởi động</em>: sửa tệp sau đó chẳng đổi được gì bên trong tiến trình. In ra <em>ĐỘ DÀI</em> của bí mật trả lời được câu "cả giá trị có tới nơi không?" mà không đưa bí mật vào lịch sử terminal. Và tệp đó chỉ chủ của tiến trình với root đọc được — một người dùng khác trên máy nhận <code>Permission denied</code>, và đó là một lý do biến môi trường là chỗ CHẤP NHẬN ĐƯỢC cho bí mật trên một máy chủ bạn kiểm soát. Trong container, thứ tương đương là <code>docker exec &lt;container&gt; printenv X</code>.</p>
<div class="pitfall co-tieu-de"><strong>Đã sửa — lệnh thứ ba trong khối ở trên từng là <code>curl -s …/_next/static/chunks/main-*.js</code>.</strong> Lệnh đó chưa bao giờ chạy: curl KHÔNG mở rộng dấu <code>*</code>. Đo trên một máy chủ Next.js cục bộ: zsh từ chối chạy luôn (<code>zsh: no matches found: …/main-*.js</code>), còn bash gửi nguyên dấu sao đi và nhận <code>404</code>. Mà giá trị cũng chẳng nằm trong <code>main-*.js</code> — nó nằm trong chunk riêng của trang. Bản hiện có trong khối đọc danh sách tệp script từ HTML trước, rồi tải từng tệp; chạy trên bản dựng cục bộ nó in ra <code>/_next/static/chunks/app/page-58311785cffc528f.js: khoa-MOI-12345</code>.</div>
<h3>Một thời điểm thứ ba: lúc dựng ẢNH</h3>
${slide('dv-04', 12, 'ARG lộ trong docker history, secret mount thì không')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ARG</code> — có mặt TRONG LÚC dựng ảnh</span><span class="lz-lnote">Truyền vào bằng <code>--build-arg</code>, các bước <code>RUN</code> nhìn thấy được, và biến mất khi cái ảnh đã tồn tại. Đây chính là thời điểm một gói front end được sinh ra, nên biến front end kiểu-lúc-dựng buộc phải tới ở đây.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dockerfile <code>ENV</code> — nướng vào ảnh, nhìn thấy được lúc chạy</span><span class="lz-lnote">Là một phần của cái ảnh, nên GIỐNG NHAU với mọi container sinh từ nó — và ai kéo được cái ảnh thì đọc được nó. Ổn cho <code>NODE_ENV=production</code>, SAI cho bất cứ thứ gì bí mật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Compose <code>environment</code> / <code>env_file</code> — lúc chạy</span><span class="lz-lnote">Cấp vào khi container khởi động, nên nó khác nhau được theo môi trường và đổi được bằng một cú restart. Trong ba cái thì đây mới là chỗ bí mật thuộc về.</span></div>
  <div class="lz-layer"><span class="lz-lname">Và một build arg cũng KHÔNG phải bí mật</span><span class="lz-lnote">Nó xuất hiện trong lịch sử của ảnh — <code>docker history</code> cho thấy nó. Truyền một cái token qua <code>--build-arg</code> là công bố nó cho bất cứ ai có cái ảnh. Dùng <code>RUN --mount=type=secret</code> khi một bước dựng thật sự cần tới một tín vật.</span></div>
</div>
<p>Đo với Docker 29.8: một Dockerfile có <code>ARG NPM_TOKEN</code> được một bước <code>RUN</code> dùng, và một bước thứ hai đọc một bí mật lúc dựng gắn vào bằng <code>--mount=type=secret</code>:</p>
<pre><code class="language-dockerfile">FROM alpine:latest
ARG NPM_TOKEN
ENV NODE_ENV=production
RUN echo "dung voi token dai \${#NPM_TOKEN} ky tu" &gt; /dung.txt
RUN --mount=type=secret,id=npmrc cat /run/secrets/npmrc | wc -c &gt; /secret-len.txt</code></pre>
<div class="out">$ docker build --build-arg NPM_TOKEN=xxxx12345-bi-mat-that --secret id=npmrc,src=npmrc.txt -t dv04-argthu .
$ docker history --no-trunc --format "{{.CreatedBy}}" dv04-argthu | head -4
RUN |1 NPM_TOKEN=xxxx12345-bi-mat-that /bin/sh -c cat /run/secrets/npmrc | wc -c &gt; /secret-len.txt # buildkit
RUN |1 NPM_TOKEN=xxxx12345-bi-mat-that /bin/sh -c echo "dung voi token dai \${#NPM_TOKEN} ky tu" &gt; /dung.txt # …
ENV NODE_ENV=production
ARG NPM_TOKEN=xxxx12345-bi-mat-that
$ docker inspect -f "{{.Config.Env}}" dv04-argthu
[PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin NODE_ENV=production]
$ docker run --rm dv04-argthu sh -c 'cat /secret-len.txt; ls /run/secrets'
22
ls: /run/secrets: No such file or directory</div>
<p>Tham số dựng xuất hiện <strong>BA LẦN</strong> trong lịch sử của ảnh, nguyên văn, cho bất cứ ai kéo được ảnh — kể cả trên mọi dòng <code>RUN</code> chỉ tình cờ chạy lúc nó đang được đặt. Dòng <code>ENV</code> nằm trong cấu hình ảnh nên có trong MỌI container. Còn <em>NỘI DUNG</em> của bí mật thì không xuất hiện ở đâu cả: bước dựng đọc được nó (22 byte), nhưng nó chỉ được gắn vào cho đúng một lệnh <code>RUN</code> đó và không nằm trong lớp nào, cũng không nằm trong lịch sử. Đó là toàn bộ khác biệt giữa một tham số dựng (build argument) và một bí mật lúc dựng (build secret).</p>
<div class="pitfall"><strong>Bẫy — một giá trị nướng lúc dựng làm cho MỖI MÔI TRƯỜNG một tạo tác.</strong> Nếu gói production chứa <code>https://api.cuongthai.com</code> còn gói staging chứa <code>https://api.staging.cuongthai.com</code> thì chúng là HAI tạo tác khác nhau — nên thứ bạn kiểm thử ở staging KHÔNG phải thứ bạn deploy, mà đó đúng là điều Bài 1.2 được dựng ra để ngăn. Ở chỗ nào chuyện đó quan trọng thì đường thoát là để trình duyệt LẤY cấu hình của nó lúc CHẠY từ chính máy chủ của bạn: một tạo tác duy nhất, một endpoint <code>/config.json</code> nhỏ, và tính chất mười-hai-yếu-tố được khôi phục.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau một lần deploy, bộ chọn GIF trả 403. Đã có người "sửa" bằng cách thêm khoá vào <code>.env</code> trên máy chủ rồi restart — hai lần. Hãy chứng minh khoá thật sự nằm ở đâu, rồi dời nó tới một chỗ xoay được bằng một cú restart.</p>
<ol>
<li>Làm một ứng dụng Next.js hai tệp (một server component in <code>process.env.API_URL</code>, một component <code>'use client'</code> in <code>process.env.NEXT_PUBLIC_GIPHY_KEY</code>). Dựng với <code>NEXT_PUBLIC_GIPHY_KEY=khoa-CU-12345</code>.</li>
<li><code>grep -rl</code> giá trị và tên biến trong <code>.next/static</code>. Khởi động với CẢ HAI biến đã đổi và tải chunk của trang bằng vòng lặp trong bài — trình duyệt nhận giá trị nào?</li>
<li>Dựng lại với giá trị mới và ghi lại tên tệp mới của chunk.</li>
<li>Dựng Dockerfile bốn dòng ở trên với một <code>--build-arg</code> và một <code>--secret</code>, rồi đọc <code>docker history --no-trunc</code>. Xoá ảnh đi khi xong.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được đúng tệp và đúng dòng nơi khoá cũ đang nằm, trình duyệt chỉ thấy khoá mới SAU khi dựng lại, và <code>docker history</code> hiện tham số dựng nhưng KHÔNG hiện nội dung bí mật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Build time (lúc dựng)</span><span class="v">Lúc tạo tác được sinh ra (<code>next build</code>, <code>docker build</code>); giá trị dùng ở đây bị đóng băng vào nó.</span></div>
  <div class="kv"><span class="k">Run time (lúc chạy)</span><span class="v">Lúc tiến trình khởi động trên máy chủ; giá trị đọc ở đây đổi được bằng một cú restart.</span></div>
  <div class="kv"><span class="k">Inlining (nhúng/nướng giá trị)</span><span class="v">Bundler thay <code>process.env.NEXT_PUBLIC_X</code> bằng chuỗi nguyên văn trong lúc dựng.</span></div>
  <div class="kv"><span class="k">Bundle (gói)</span><span class="v">Các tệp JavaScript trình duyệt tải về — bản chất là công khai.</span></div>
  <div class="kv"><span class="k">Build argument (tham số dựng)</span><span class="v"><code>ARG</code> trong Dockerfile, truyền bằng <code>--build-arg</code>; bị ghi lại trong lịch sử ảnh.</span></div>
  <div class="kv"><span class="k">Build secret (bí mật lúc dựng)</span><span class="v"><code>RUN --mount=type=secret</code>: một tệp có mặt cho một bước dựng và không được lưu ở đâu.</span></div>
  <div class="kv"><span class="k"><code>/proc/PID/environ</code> (môi trường của tiến trình)</span><span class="v">Môi trường mà tiến trình đang chạy thật sự nhận được, ngăn bằng byte NUL, chỉ chủ và root đọc được.</span></div>
  <div class="kv"><span class="k">Backend proxy (tuyến gọi hộ)</span><span class="v">Tuyến có xác thực của chính bạn, gọi bên thứ ba bằng một khoá giữ trên máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Có cấu hình được đọc lúc chạy và có cấu hình được viết thẳng vào tạo tác lúc dựng; trong mã nguồn chúng trông y hệt nhau.</li>
<li><code>NEXT_PUBLIC_*</code>, <code>VITE_*</code>, <code>REACT_APP_*</code> bị nướng vào gói: đo thật, tên biến biến mất khỏi gói và restart với giá trị mới chẳng đổi được gì trên trình duyệt.</li>
<li>Thứ gì đã nướng vào gói thì công khai; khoá bên thứ ba phải đứng sau một tuyến backend đọc nó lúc chạy — cách sửa sau vụ GIPHY 403.</li>
<li><code>--build-arg</code> bị ghi vào <code>docker history</code>; <code>RUN --mount=type=secret</code> mới là cơ chế lúc dựng dành cho tín vật.</li>
<li><code>/proc/PID/environ</code> là sự thật về thứ tiến trình đã nhận — một bản sao từ lúc khởi động, chỉ chủ và root đọc được.</li>
<li>curl không mở rộng <code>*</code>: muốn kiểm thứ trình duyệt tải về, liệt kê script từ HTML rồi tải từng tệp.</li>
</ul>

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
${slide('dv-04', 15, 'Sai GIÁ TRỊ chứ không báo lỗi: # và $')}
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

<h3>Five loaders, one file: the full measurement</h3>
${slide('dv-04', 14, 'Một tệp .env, năm bộ nạp, năm cách đọc')}
<p>Two loaders is not the whole story, because a production <code>.env</code> is rarely read by <code>node --env-file</code>. On a VPS it is read by systemd (<code>EnvironmentFile=</code>, Lesson 3.4), by Docker (<code>docker run --env-file</code>), by Compose (<code>env_file:</code>), or by a deploy script that <code>source</code>s it. So the file was extended to nine lines — adding a single-quoted value, an <code>export</code> line of the kind people copy from shell tutorials, and a line saved with Windows line endings — and fed to all five. bash and systemd ran on the lab VPS; Docker, Compose and Node on the Mac. Every loader printed its values through the same script, which shows a carriage return as <code>\\r</code> and an unset variable as <code>(KHONG CO)</code>:</p>
<div class="out">$ cat -A test.env          # cat -A: $ = cuoi dong, ^M = \\r
DON_GIAN=abc$
CO_KHOANG_TRANG=xin chao$
TRONG_NHAY_KEP="co  hai khoang"$
NHAY_DON='gia$tri'$
CO_DAU_THANG=mat#khau$
CO_DOLLAR=$HOME/duong-dan$
NOI_CHUOI=\${DON_GIAN}-them$
export CO_EXPORT=co-export$
CO_CRLF=windows^M$</div>
<div class="out">════ 1) bash: set -a; source .env   (VPS thi nghiem, bash 5.2, HOME=/home/deploy) ════
./test.env: line 2: chao: command not found
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  (KHONG CO)
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [/home/deploy/duong-dan]
  NOI_CHUOI        [abc-them]
  CO_EXPORT        [co-export]
  CO_CRLF          [windows\\r]
════ 2) systemd 255: EnvironmentFile=/opt/datlich/test.env   (journalctl -u thu-env) ════
thu-env.service: Ignoring invalid environment assignment 'export CO_EXPORT=co-export': /opt/datlich/test.env
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [$HOME/duong-dan]
  NOI_CHUOI        [\${DON_GIAN}-them]
  CO_EXPORT        (KHONG CO)
  CO_CRLF          [windows]
════ 3) docker run --env-file test.env   (Docker 29.8) ════
docker: --env-file: invalid env file (env/test.env): variable 'export CO_EXPORT' contains whitespaces
════ 3b) cung tep, BO dong export ════
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   ["co  hai khoang"]
  NHAY_DON         ['gia$tri']
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [$HOME/duong-dan]
  NOI_CHUOI        [\${DON_GIAN}-them]
  CO_EXPORT        (KHONG CO)
  CO_CRLF          [windows]
════ 4) docker compose run  (env_file: test.env, Compose v5.5.1, HOME=/home/an) ════
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [/home/an/duong-dan]
  NOI_CHUOI        [abc-them]
  CO_EXPORT        [co-export]
  CO_CRLF          [windows]
════ 5) node --env-file=test.env   (Node 22.21) ════
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat]
  CO_DOLLAR        [$HOME/duong-dan]
  NOI_CHUOI        [\${DON_GIAN}-them]
  CO_EXPORT        [co-export]
  CO_CRLF          [windows]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">No two columns agree</span><span class="v">Only <code>DON_GIAN=abc</code> — a value with no space, quote, <code>#</code>, <code>$</code> or line-ending trouble — came out the same everywhere. Every other line was read differently by at least one loader.</span></div>
  <div class="kv"><span class="k">Docker keeps the quotes</span><span class="v"><code>docker run --env-file</code> does no quote processing at all: the value of <code>TRONG_NHAY_KEP</code> is the fifteen characters <em>including</em> the two <code>"</code>. A password written <code>"abc"</code> arrives as <code>"abc"</code>.</span></div>
  <div class="kv"><span class="k">One <code>export</code> line, three reactions</span><span class="v">bash, Compose and Node accept it; systemd skips that line and writes one line to the journal while the service starts anyway; <code>docker run --env-file</code> refuses the <em>whole file</em>.</span></div>
  <div class="kv"><span class="k">Compose interpolates from the machine running Compose</span><span class="v"><code>$HOME</code> became <code>/home/an</code> — the home of whoever typed <code>docker compose</code>, not anything inside the container. Deploy from a different account and the value changes. A literal <code>$</code> in Compose must be written <code>$$</code>.</span></div>
  <div class="kv"><span class="k">Only bash kept the <code>\\r</code></span><span class="v">The other four strip a trailing carriage return; bash leaves it at the end of the value, invisible — next section.</span></div>
  <div class="kv"><span class="k">A small correction to the old table</span><span class="v">Under bash, <code>CO_KHOANG_TRANG</code> is not "empty", it is <em>not set at all</em>: <code>NAME=xin chao</code> is the shell syntax for "run the command <code>chao</code> with <code>NAME</code> set only for it". The printer above distinguishes the two; the older one showed both as <code>[]</code>.</span></div>
</div>

<h3>Docker and systemd: stricter, and differently strict</h3>
${slide('dv-04', 17, 'docker --env-file: không nháy, không export; systemd bỏ dòng lạ')}
<p>The two loaders you are most likely to meet on a server are also the two that are least like a shell. <strong><code>docker run --env-file</code></strong> reads each line as <code>NAME=everything after the first =</code>, literally: no quote removal, no <code>$</code> expansion, no inline comments — and a line it cannot parse is a fatal error for the whole file, which at least fails loudly. <strong>systemd's <code>EnvironmentFile=</code></strong> does remove quotes and does not expand anything, but when it meets a line it cannot use, it <em>ignores that line</em> and starts the service anyway; the only trace is one line in <code>journalctl</code>. A missing variable there is found by the application, not by systemd — which is one more reason for the fail-fast check in Lesson 4.1.</p>
<div class="callout warn"><strong>Compose's <code>env_file:</code> is not <code>docker run --env-file</code>.</strong> They sound identical and parse differently: Compose strips quotes, accepts <code>export</code>, keeps <code>#</code> that is not preceded by a space, and interpolates <code>\${…}</code> and <code>$HOME</code>. A file that works under <code>docker compose up</code> can break under a one-off <code>docker run --env-file</code> during an incident, at exactly the moment you are least able to debug a parser.</div>

<h3>CRLF: the invisible character from Windows</h3>
${slide('dv-04', 16, 'CRLF: ký tự \\r vô hình ở cuối giá trị')}
<p>Windows ends lines with two bytes, <code>\\r\\n</code> (CRLF); Linux uses one, <code>\\n</code>. A <code>.env</code> written in Notepad, or checked out by Git for Windows with <code>core.autocrlf=true</code>, carries a <code>\\r</code> at the end of every line. Measured on the lab VPS with a two-line file:</p>
<div class="out">$ file win.env
win.env: ASCII text, with CRLF line terminators
$ set -a; . ./win.env; set +a
$ printf %s "$DB_NAME" | od -c
0000000   d   a   t   l   i   c   h  \\r
KHONG khop: do dai 8 (mong doi 7)
$ psql "postgres://app@$DB_HOST/$DB_NAME"  ⇒ ten CSDL that la: 'datlich\\r'
$ sed -i "s/\\r$//" win.env; file win.env
win.env: ASCII text
khop, do dai 7</div>
<p>The value looks right when printed, because a carriage return is invisible on screen; the database then reports that <code>datlich</code> does not exist — with the <code>\\r</code> hidden inside the quotes of the error message. <code>file</code> names the problem in one line, and <code>od -c</code> shows the byte. Four of the five loaders above silently strip it, which is exactly why it survives: the file works in Compose and fails the day a deploy script <code>source</code>s it.</p>
<table>
<tr><th>Where you edit</th><th>What to do</th></tr>
<tr><td>Windows (Git for Windows)</td><td><code>git config --global core.autocrlf input</code> — never convert to CRLF on checkout; in VS Code, click <strong>CRLF</strong> in the status bar and choose <strong>LF</strong></td></tr>
<tr><td>WSL / Linux</td><td>Check with <code>file .env</code>; fix with <code>sed -i 's/\\r$//' .env</code></td></tr>
<tr><td>macOS</td><td>BSD <code>sed</code> needs an explicit backup suffix: <code>sed -i '' 's/\\r$//' .env</code> — the Linux form fails with a confusing error</td></tr>
<tr><td>The repository</td><td><code>.gitattributes</code> with <code>*.env* text eol=lf</code>, so every clone gets LF no matter the client settings</td></tr>
</table>
<h3>The rules that survive every loader</h3>
${slide('dv-04', 18, 'Luật viết .env sống qua mọi bộ nạp')}
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

<div class="pitfall co-tieu-de"><strong>Trap — rule 1 has one exception, and it is a common one.</strong> "Quote every value" is right for bash, systemd, Compose and Node, and <em>wrong</em> for <code>docker run --env-file</code>, which keeps the quotes as part of the value (measured above: <code>["co  hai khoang"]</code>). If a file must also be read by <code>docker run --env-file</code>, the only format all five agree on is the boring one: no quotes, no spaces, no <code>#</code>, no <code>$</code>, no <code>export</code>, LF endings — which is precisely what <code>openssl rand -hex 32</code> produces for secrets. Otherwise, pick one loader for production and write the file for that loader.</div>
<h3>Verify rather than assume</h3>
<pre><code class="language-javascript"><span class="tok-comment"># cach DUY NHAT dang tin: hoi chinh tien trinh dang chay</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ | grep DATABASE_URL

<span class="tok-comment"># do dai co dung khong? (bat cat cut ma khong lo bi mat ra man hinh)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f node)/environ | awk -F= '/^DB_PASS/{print "do dai:", length(\$2)}'

<span class="tok-comment"># hai bo phan tich co doc giong nhau khong?</span>
diff &lt;(node --env-file=.env -e 'for(const[k,v]of Object.entries(process.env))console.log(k+"="+v)' | sort) \\
     &lt;(env -i bash -c 'set -a; . ./.env; set +a; env' | sort)</code></pre>
<div class="note-ct">The length check is the practical one for secrets. Printing a password into a terminal puts it in your shell history, your scrollback and possibly a screen recording; printing its <em>length</em> answers "was it truncated?" without exposing anything. A password you generated as 32 characters that arrives as 3 is the <code>#</code> bug, visible in one line.</div>

<div class="pitfall co-tieu-de"><strong>Corrected — the third command above does not answer its own question.</strong> It compares the <em>entire</em> environment of two processes, and <code>node</code> inherits everything your shell has while <code>env -i bash</code> starts from nothing — so it reports differences even for a perfect file. Measured on the Mac on a clean three-line <code>.env</code>, that diff printed 68 lines. Compare only the variables the file declares:
<pre><code class="language-bash">#!/bin/bash
# so-hai-bo-nap.sh — so node --env-file voi bash source, CHI tren cac bien khai trong tep
T=\${1:-.env}
KEYS=$(grep -oE '^[A-Za-z_][A-Za-z0-9_]*' "$T" | sort -u | tr '\\n' ' ')
diff &lt;(env -i "$(command -v node)" --env-file="$T" -e \\
        'for (const k of process.argv[1].split(" ").filter(Boolean)) console.log(k + "=" + process.env[k])' "$KEYS") \\
     &lt;(env -i HOME="$HOME" bash -c 'set -a; . "$1"; set +a; for k in $2; do echo "$k=\${!k}"; done' _ "./$T" "$KEYS") \\
  &amp;&amp; echo "hai bo nap DONG Y tren $(wc -w &lt;&lt;&lt;"$KEYS" | tr -d ' ') bien"</code></pre>
<div class="out">$ ./so-hai-bo-nap.sh .env
hai bo nap DONG Y tren 3 bien
$ ./so-hai-bo-nap.sh xau.env          # DB_PASS=mat#khau, DUONG=$HOME/x
1,2c1,2
&lt; DB_PASS=mat
&lt; DUONG=$HOME/x
---
&gt; DB_PASS=mat#khau
&gt; DUONG=/home/an/x</div>
<p>Silence now means agreement, and a difference names the exact variable. Put it in the deploy script before the step that restarts anything.</p></div>
<h3>A third dialect, and why it matters here</h3>
<p>systemd's <code>EnvironmentFile</code> is a fourth set of rules again — its own quoting, its own escape handling, and no shell expansion at all. That is relevant because Lesson 3.4 put <code>EnvironmentFile=/srv/app/chung/.env</code> in the unit: the same file may be read by systemd in production, by <code>node --env-file</code> in development, and by a developer running <code>source .env</code> by hand. Three parsers, one file, and the rules above are what keep all three agreeing.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Best: do not have a .env at all in production</span><span class="lz-lnote">Environment variables set by the service manager, from a file only it reads. One parser instead of three, and the application never opens a file.</span></div>
  <div class="lz-layer"><span class="lz-lname">Good: one file, quoted values, no interpolation</span><span class="lz-lnote">What the rules above produce. Works under every loader, and stays working when someone changes how the service is started.</span></div>
  <div class="lz-layer"><span class="lz-lname">Risky: values with <code>#</code>, <code>\$</code>, quotes or newlines</span><span class="lz-lnote">If you cannot avoid them, verify through <code>/proc/&lt;pid&gt;/environ</code> after every change — and prefer regenerating a secret to fighting the parser.</span></div>
  <div class="lz-layer"><span class="lz-lname">Worst: a secret manager whose output is pasted into a .env</span><span class="lz-lnote">All the parsing risk, plus a copy of the secret on disk that nothing rotates. If you have a secret manager, have the application read from it — Lesson 4.5.</span></div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate on Windows generated a new database password with a password manager, pasted it into the server's <code>.env</code>, and now the backend cannot log in — "but the password is right, I checked the file". The generated password contains a <code>#</code> and a <code>$</code>, and the file was saved in Notepad. Find all three problems with measurements, not by reading.</p>
<ol>
<li>Create the nine-line <code>test.env</code> from this lesson (make the last line CRLF with <code>printf 'CO_CRLF=windows\\r\\n' &gt;&gt; test.env</code>) and check it with <code>cat -A</code> and <code>file</code>.</li>
<li>Read it with bash (<code>set -a; . ./test.env; set +a</code>) and with a systemd unit using <code>EnvironmentFile=</code> on the lab VPS (<code>journalctl -u</code> shows the output); with <code>docker run --env-file</code>, Compose <code>env_file:</code> and <code>node --env-file</code> on your machine.</li>
<li>Fill a five-column table of your own and mark every cell that differs from the majority.</li>
<li>Rewrite the file so every loader you actually use agrees, replace the password with <code>openssl rand -hex 32</code>, strip CRLF, and prove it with <code>so-hai-bo-nap.sh</code> and a length check.</li>
</ol>
<p><strong>Done when:</strong> your table matches the one in this lesson on your machines (or you can explain each difference), <code>file .env</code> says <code>ASCII text</code> with no CRLF, and <code>so-hai-bo-nap.sh</code> prints <code>DONG Y</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dotenv file</span><span class="v">A <code>.env</code> of <code>NAME=value</code> lines — a convention, not a standard, so every loader parses it its own way.</span></div>
  <div class="kv"><span class="k">Loader (parser)</span><span class="v">Whatever turns the file into environment variables: bash <code>source</code>, systemd, Docker, Compose, Node.</span></div>
  <div class="kv"><span class="k">Quoting</span><span class="v">Wrapping a value in <code>"</code> or <code>'</code>; removed by most loaders, kept literally by <code>docker run --env-file</code>.</span></div>
  <div class="kv"><span class="k">Expansion</span><span class="v">Replacing <code>$NAME</code> with a value; bash does it even inside double quotes.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Building one value from another (<code>\${A}-x</code>); works in bash and Compose, literal elsewhere.</span></div>
  <div class="kv"><span class="k">Inline comment</span><span class="v">A <code>#</code> that ends the value — Node treats <code>mat#khau</code> as <code>mat</code>.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line ending <code>\\r\\n</code>; bash keeps the <code>\\r</code> inside the value.</span></div>
  <div class="kv"><span class="k"><code>EnvironmentFile=</code></span><span class="v">systemd's loader: strips quotes, expands nothing, skips bad lines with a journal warning.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>There is no <code>.env</code> standard: the same nine lines gave five different sets of values under bash, systemd, Docker, Compose and Node.</li>
<li>The dangerous differences produce a wrong value, not an error — <code>#</code> truncates under Node, <code>$</code> expands under bash and Compose, <code>\\r</code> hides under bash.</li>
<li><code>docker run --env-file</code> keeps quotes and rejects the whole file on one <code>export</code>; systemd skips bad lines and starts anyway.</li>
<li>Compose's <code>env_file:</code> is a different parser from <code>docker run --env-file</code>, and it expands <code>$HOME</code> from the machine running Compose.</li>
<li>Safe values are boring: hex secrets, no spaces, quotes chosen for the one loader production uses, LF line endings.</li>
<li>Verify the process, not the file: compare loaders on the declared keys only, and check secrets by length.</li>
</ul>

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
${slide('dv-04', 15, 'Sai GIÁ TRỊ chứ không báo lỗi: # và $')}
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

<h3>Năm bộ nạp, một tệp: phép đo đầy đủ</h3>
${slide('dv-04', 14, 'Một tệp .env, năm bộ nạp, năm cách đọc')}
<p>Hai bộ nạp chưa phải toàn bộ câu chuyện, vì một tệp <code>.env</code> production hiếm khi được <code>node --env-file</code> đọc. Trên VPS nó được systemd đọc (<code>EnvironmentFile=</code>, Bài 3.4), được Docker đọc (<code>docker run --env-file</code>), được Compose đọc (<code>env_file:</code>), hoặc được một script deploy <code>source</code> vào. Nên cái tệp được nới lên chín dòng — thêm một giá trị bọc nháy ĐƠN, một dòng <code>export</code> kiểu người ta hay chép từ hướng dẫn shell, và một dòng lưu với kiểu xuống dòng của Windows — rồi đưa qua cả năm. bash và systemd chạy trên VPS thí nghiệm; Docker, Compose và Node chạy trên Mac. Mọi bộ nạp in giá trị qua CÙNG một script, script này hiện ký tự về đầu dòng thành <code>\\r</code> và biến chưa đặt thành <code>(KHONG CO)</code>:</p>
<div class="out">$ cat -A test.env          # cat -A: $ = cuoi dong, ^M = \\r
DON_GIAN=abc$
CO_KHOANG_TRANG=xin chao$
TRONG_NHAY_KEP="co  hai khoang"$
NHAY_DON='gia$tri'$
CO_DAU_THANG=mat#khau$
CO_DOLLAR=$HOME/duong-dan$
NOI_CHUOI=\${DON_GIAN}-them$
export CO_EXPORT=co-export$
CO_CRLF=windows^M$</div>
<div class="out">════ 1) bash: set -a; source .env   (VPS thi nghiem, bash 5.2, HOME=/home/deploy) ════
./test.env: line 2: chao: command not found
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  (KHONG CO)
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [/home/deploy/duong-dan]
  NOI_CHUOI        [abc-them]
  CO_EXPORT        [co-export]
  CO_CRLF          [windows\\r]
════ 2) systemd 255: EnvironmentFile=/opt/datlich/test.env   (journalctl -u thu-env) ════
thu-env.service: Ignoring invalid environment assignment 'export CO_EXPORT=co-export': /opt/datlich/test.env
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [$HOME/duong-dan]
  NOI_CHUOI        [\${DON_GIAN}-them]
  CO_EXPORT        (KHONG CO)
  CO_CRLF          [windows]
════ 3) docker run --env-file test.env   (Docker 29.8) ════
docker: --env-file: invalid env file (env/test.env): variable 'export CO_EXPORT' contains whitespaces
════ 3b) cung tep, BO dong export ════
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   ["co  hai khoang"]
  NHAY_DON         ['gia$tri']
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [$HOME/duong-dan]
  NOI_CHUOI        [\${DON_GIAN}-them]
  CO_EXPORT        (KHONG CO)
  CO_CRLF          [windows]
════ 4) docker compose run  (env_file: test.env, Compose v5.5.1, HOME=/home/an) ════
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat#khau]
  CO_DOLLAR        [/home/an/duong-dan]
  NOI_CHUOI        [abc-them]
  CO_EXPORT        [co-export]
  CO_CRLF          [windows]
════ 5) node --env-file=test.env   (Node 22.21) ════
  DON_GIAN         [abc]
  CO_KHOANG_TRANG  [xin chao]
  TRONG_NHAY_KEP   [co  hai khoang]
  NHAY_DON         [gia$tri]
  CO_DAU_THANG     [mat]
  CO_DOLLAR        [$HOME/duong-dan]
  NOI_CHUOI        [\${DON_GIAN}-them]
  CO_EXPORT        [co-export]
  CO_CRLF          [windows]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có hai cột nào khớp nhau</span><span class="v">Chỉ <code>DON_GIAN=abc</code> — giá trị không dấu cách, không nháy, không <code>#</code>, không <code>$</code>, không rắc rối xuống dòng — ra giống nhau ở mọi nơi. Mọi dòng khác đều bị ít nhất một bộ nạp đọc khác đi.</span></div>
  <div class="kv"><span class="k">Docker GIỮ dấu nháy</span><span class="v"><code>docker run --env-file</code> không xử lý nháy gì cả: giá trị của <code>TRONG_NHAY_KEP</code> là mười lăm ký tự <em>TÍNH CẢ</em> hai dấu <code>"</code>. Một mật khẩu viết <code>"abc"</code> tới nơi thành <code>"abc"</code>.</span></div>
  <div class="kv"><span class="k">Một dòng <code>export</code>, ba phản ứng</span><span class="v">bash, Compose và Node chấp nhận; systemd bỏ qua dòng đó và ghi MỘT dòng vào journal trong khi dịch vụ vẫn khởi động; <code>docker run --env-file</code> từ chối <em>CẢ TỆP</em>.</span></div>
  <div class="kv"><span class="k">Compose nội suy từ cái máy CHẠY Compose</span><span class="v"><code>$HOME</code> thành <code>/home/an</code> — thư mục nhà của người gõ <code>docker compose</code>, chẳng phải thứ gì bên trong container. Deploy từ một tài khoản khác là giá trị đổi. Chữ <code>$</code> thật trong Compose phải viết thành <code>$$</code>.</span></div>
  <div class="kv"><span class="k">Chỉ bash giữ lại <code>\\r</code></span><span class="v">Bốn bộ kia gỡ ký tự về đầu dòng ở cuối; bash để nó nằm cuối giá trị, vô hình — mục kế tiếp.</span></div>
  <div class="kv"><span class="k">Một chỉnh nhỏ cho bảng cũ</span><span class="v">Dưới bash, <code>CO_KHOANG_TRANG</code> không phải "rỗng", mà là <em>HOÀN TOÀN CHƯA ĐƯỢC ĐẶT</em>: <code>TEN=xin chao</code> là cú pháp shell cho "chạy lệnh <code>chao</code> với <code>TEN</code> chỉ đặt riêng cho nó". Script in ở trên phân biệt được hai trường hợp; bản cũ hiện cả hai thành <code>[]</code>.</span></div>
</div>

<h3>Docker và systemd: ngặt hơn, và ngặt theo kiểu khác nhau</h3>
${slide('dv-04', 17, 'docker --env-file: không nháy, không export; systemd bỏ dòng lạ')}
<p>Hai bộ nạp bạn dễ gặp nhất trên máy chủ cũng là hai bộ ÍT giống shell nhất. <strong><code>docker run --env-file</code></strong> đọc mỗi dòng thành <code>TÊN=mọi thứ sau dấu = đầu tiên</code>, nguyên văn: không gỡ nháy, không bung <code>$</code>, không có chú thích cuối dòng — và một dòng nó không phân tích được là lỗi CHẾT cho cả tệp, ít ra thì cũng hỏng to tiếng. <strong><code>EnvironmentFile=</code> của systemd</strong> thì CÓ gỡ nháy và không bung gì cả, nhưng khi gặp một dòng không dùng được thì nó <em>BỎ QUA dòng đó</em> và vẫn khởi động dịch vụ; dấu vết duy nhất là một dòng trong <code>journalctl</code>. Biến bị thiếu kiểu đó sẽ do ứng dụng phát hiện, chứ không phải systemd — thêm một lý do cho phép kiểm hỏng-sớm ở Bài 4.1.</p>
<div class="callout warn"><strong><code>env_file:</code> của Compose KHÔNG phải <code>docker run --env-file</code>.</strong> Nghe y hệt nhau mà phân tích khác nhau: Compose gỡ nháy, chấp nhận <code>export</code>, giữ <code>#</code> không đứng sau dấu cách, và nội suy <code>\${…}</code> lẫn <code>$HOME</code>. Một tệp chạy ngon dưới <code>docker compose up</code> có thể vỡ dưới một lệnh <code>docker run --env-file</code> chạy tay giữa sự cố — đúng lúc bạn ít sức gỡ lỗi một bộ phân tích nhất.</div>

<h3>CRLF: ký tự vô hình từ Windows</h3>
${slide('dv-04', 16, 'CRLF: ký tự \\r vô hình ở cuối giá trị')}
<p>Windows kết thúc dòng bằng hai byte, <code>\\r\\n</code> (CRLF); Linux dùng một, <code>\\n</code>. Một <code>.env</code> soạn bằng Notepad, hoặc được Git for Windows checkout với <code>core.autocrlf=true</code>, mang một <code>\\r</code> ở cuối MỌI dòng. Đo trên VPS thí nghiệm với một tệp hai dòng:</p>
<div class="out">$ file win.env
win.env: ASCII text, with CRLF line terminators
$ set -a; . ./win.env; set +a
$ printf %s "$DB_NAME" | od -c
0000000   d   a   t   l   i   c   h  \\r
KHONG khop: do dai 8 (mong doi 7)
$ psql "postgres://app@$DB_HOST/$DB_NAME"  ⇒ ten CSDL that la: 'datlich\\r'
$ sed -i "s/\\r$//" win.env; file win.env
win.env: ASCII text
khop, do dai 7</div>
<p>In ra thì giá trị trông đúng, vì ký tự về đầu dòng vô hình trên màn hình; rồi cơ sở dữ liệu báo <code>datlich</code> không tồn tại — với cái <code>\\r</code> nấp ngay trong dấu nháy của thông báo lỗi. <code>file</code> gọi tên vấn đề trong một dòng, còn <code>od -c</code> cho thấy cái byte. Bốn trên năm bộ nạp ở trên lặng lẽ gỡ nó đi, và chính vì thế nó sống sót: tệp chạy ngon trong Compose rồi hỏng vào cái ngày một script deploy <code>source</code> nó.</p>
<table>
<tr><th>Bạn sửa tệp ở đâu</th><th>Làm gì</th></tr>
<tr><td>Windows (Git for Windows)</td><td><code>git config --global core.autocrlf input</code> — không bao giờ đổi sang CRLF lúc checkout; trong VS Code bấm chữ <strong>CRLF</strong> ở thanh trạng thái rồi chọn <strong>LF</strong></td></tr>
<tr><td>WSL / Linux</td><td>Kiểm bằng <code>file .env</code>; sửa bằng <code>sed -i 's/\\r$//' .env</code></td></tr>
<tr><td>macOS</td><td><code>sed</code> bản BSD đòi hậu tố sao lưu rõ ràng: <code>sed -i '' 's/\\r$//' .env</code> — dạng của Linux hỏng với một thông báo lỗi khó hiểu</td></tr>
<tr><td>Kho mã</td><td><code>.gitattributes</code> với <code>*.env* text eol=lf</code>, để bản clone nào cũng nhận LF bất kể thiết lập của máy khách</td></tr>
</table>
<h3>Những luật sống sót qua MỌI bộ nạp</h3>
${slide('dv-04', 18, 'Luật viết .env sống qua mọi bộ nạp')}
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

<div class="pitfall co-tieu-de"><strong>Bẫy — luật 1 có MỘT ngoại lệ, và nó hay gặp.</strong> "Bọc nháy mọi giá trị" đúng với bash, systemd, Compose và Node, và <em>SAI</em> với <code>docker run --env-file</code>, bộ nạp giữ dấu nháy như một phần của giá trị (đo ở trên: <code>["co  hai khoang"]</code>). Nếu một tệp còn phải được <code>docker run --env-file</code> đọc, thì định dạng DUY NHẤT cả năm bộ đồng ý là cái định dạng nhàm chán: không nháy, không dấu cách, không <code>#</code>, không <code>$</code>, không <code>export</code>, xuống dòng LF — đúng thứ mà <code>openssl rand -hex 32</code> sinh ra cho bí mật. Còn không thì hãy chọn MỘT bộ nạp cho production và viết tệp cho đúng bộ nạp đó.</div>
<h3>Hãy KIỂM thay vì đoán</h3>
<pre><code class="language-javascript"><span class="tok-comment"># cach DUY NHAT dang tin: hoi chinh tien trinh dang chay</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ | grep DATABASE_URL

<span class="tok-comment"># do dai co dung khong? (bat cat cut ma khong lo bi mat ra man hinh)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f node)/environ | awk -F= '/^DB_PASS/{print "do dai:", length(\$2)}'

<span class="tok-comment"># hai bo phan tich co doc giong nhau khong?</span>
diff &lt;(node --env-file=.env -e 'for(const[k,v]of Object.entries(process.env))console.log(k+"="+v)' | sort) \\
     &lt;(env -i bash -c 'set -a; . ./.env; set +a; env' | sort)</code></pre>
<div class="note-ct">Phép kiểm ĐỘ DÀI mới là phép thực dụng cho bí mật. In một mật khẩu ra terminal là đưa nó vào lịch sử shell, vào vùng cuộn màn hình và có thể vào cả một đoạn quay màn hình; in ĐỘ DÀI của nó thì trả lời được câu "nó có bị cắt cụt không?" mà chẳng phơi ra gì. Một mật khẩu bạn sinh ra dài 32 ký tự mà tới nơi còn 3 chính là cái lỗi dấu <code>#</code>, hiện ra trong đúng một dòng.</div>

<div class="pitfall co-tieu-de"><strong>Đã sửa — lệnh thứ ba ở trên KHÔNG trả lời được chính câu hỏi của nó.</strong> Nó so <em>TOÀN BỘ</em> môi trường của hai tiến trình, mà <code>node</code> thì thừa hưởng mọi thứ shell của bạn đang có còn <code>env -i bash</code> bắt đầu từ con số không — nên nó báo khác nhau kể cả với một tệp hoàn hảo. Đo trên Mac với một <code>.env</code> ba dòng sạch sẽ, lệnh diff đó in ra 68 dòng. Hãy chỉ so những biến mà tệp khai báo:
<pre><code class="language-bash">#!/bin/bash
# so-hai-bo-nap.sh — so node --env-file voi bash source, CHI tren cac bien khai trong tep
T=\${1:-.env}
KEYS=$(grep -oE '^[A-Za-z_][A-Za-z0-9_]*' "$T" | sort -u | tr '\\n' ' ')
diff &lt;(env -i "$(command -v node)" --env-file="$T" -e \\
        'for (const k of process.argv[1].split(" ").filter(Boolean)) console.log(k + "=" + process.env[k])' "$KEYS") \\
     &lt;(env -i HOME="$HOME" bash -c 'set -a; . "$1"; set +a; for k in $2; do echo "$k=\${!k}"; done' _ "./$T" "$KEYS") \\
  &amp;&amp; echo "hai bo nap DONG Y tren $(wc -w &lt;&lt;&lt;"$KEYS" | tr -d ' ') bien"</code></pre>
<div class="out">$ ./so-hai-bo-nap.sh .env
hai bo nap DONG Y tren 3 bien
$ ./so-hai-bo-nap.sh xau.env          # DB_PASS=mat#khau, DUONG=$HOME/x
1,2c1,2
&lt; DB_PASS=mat
&lt; DUONG=$HOME/x
---
&gt; DB_PASS=mat#khau
&gt; DUONG=/home/an/x</div>
<p>Giờ im lặng nghĩa là đồng ý, và một chỗ khác nhau gọi đúng tên biến. Hãy đặt nó vào script deploy, trước bước khởi động lại bất cứ thứ gì.</p></div>
<h3>Một phương ngữ thứ ba, và vì sao nó quan trọng ở đây</h3>
<p><code>EnvironmentFile</code> của systemd lại là một bộ luật thứ tư nữa — cách bọc ngoặc riêng, cách xử lý ký tự thoát riêng, và hoàn toàn KHÔNG bung biến kiểu shell. Điều đó liên quan vì Bài 3.4 đã đặt <code>EnvironmentFile=/srv/app/chung/.env</code> vào tệp unit: CÙNG một tệp có thể được systemd đọc trên production, được <code>node --env-file</code> đọc lúc phát triển, và được một lập trình viên <code>source .env</code> bằng tay. Ba bộ phân tích, một tệp, và mấy cái luật ở trên chính là thứ giữ cho cả ba đồng ý với nhau.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tốt nhất: production KHÔNG có tệp .env nào cả</span><span class="lz-lnote">Biến môi trường do trình quản lý dịch vụ đặt, từ một tệp mà CHỈ nó đọc. Một bộ phân tích thay vì ba, và ứng dụng không bao giờ phải mở một tệp nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tốt: một tệp, mọi giá trị bọc ngoặc, không nối chuỗi</span><span class="lz-lnote">Đúng thứ mấy cái luật ở trên sinh ra. Chạy dưới mọi bộ nạp, và vẫn chạy khi có người đổi cách khởi động dịch vụ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rủi ro: giá trị chứa <code>#</code>, <code>\$</code>, dấu nháy hay xuống dòng</span><span class="lz-lnote">Nếu không tránh được thì hãy KIỂM qua <code>/proc/&lt;pid&gt;/environ</code> sau MỖI lần đổi — và thà sinh lại một bí mật mới còn hơn vật lộn với bộ phân tích.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tệ nhất: một trình quản lý bí mật mà kết quả của nó được DÁN vào một tệp .env</span><span class="lz-lnote">Ăn đủ mọi rủi ro phân tích, cộng thêm một bản sao của bí mật nằm trên đĩa mà chẳng có gì xoay nó. Nếu bạn có trình quản lý bí mật thì hãy để ỨNG DỤNG đọc thẳng từ đó — Bài 4.5.</span></div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm dùng Windows sinh mật khẩu cơ sở dữ liệu mới bằng trình quản lý mật khẩu, dán vào <code>.env</code> trên máy chủ, và giờ backend không đăng nhập được — "nhưng mật khẩu đúng mà, mình kiểm tệp rồi". Mật khẩu sinh ra có một dấu <code>#</code> và một dấu <code>$</code>, và tệp được lưu bằng Notepad. Hãy tìm cả ba vấn đề bằng PHÉP ĐO, không phải bằng cách đọc.</p>
<ol>
<li>Tạo tệp <code>test.env</code> chín dòng của bài (làm dòng cuối thành CRLF bằng <code>printf 'CO_CRLF=windows\\r\\n' &gt;&gt; test.env</code>) và kiểm bằng <code>cat -A</code> với <code>file</code>.</li>
<li>Đọc nó bằng bash (<code>set -a; . ./test.env; set +a</code>) và bằng một unit systemd dùng <code>EnvironmentFile=</code> trên VPS thí nghiệm (<code>journalctl -u</code> cho thấy output); bằng <code>docker run --env-file</code>, Compose <code>env_file:</code> và <code>node --env-file</code> trên máy bạn.</li>
<li>Điền một bảng năm cột của riêng bạn và đánh dấu mọi ô khác với số đông.</li>
<li>Viết lại tệp cho mọi bộ nạp bạn THẬT SỰ dùng đều đồng ý, thay mật khẩu bằng <code>openssl rand -hex 32</code>, gỡ CRLF, rồi chứng minh bằng <code>so-hai-bo-nap.sh</code> và một phép kiểm độ dài.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn khớp với bảng trong bài trên máy của bạn (hoặc bạn giải thích được từng chỗ khác), <code>file .env</code> báo <code>ASCII text</code> không có CRLF, và <code>so-hai-bo-nap.sh</code> in ra <code>DONG Y</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dotenv file (tệp .env)</span><span class="v">Tệp gồm các dòng <code>TÊN=giá trị</code> — một quy ước chứ không phải tiêu chuẩn, nên mỗi bộ nạp đọc một kiểu.</span></div>
  <div class="kv"><span class="k">Loader / parser (bộ nạp / bộ phân tích)</span><span class="v">Thứ biến tệp thành biến môi trường: bash <code>source</code>, systemd, Docker, Compose, Node.</span></div>
  <div class="kv"><span class="k">Quoting (bọc nháy)</span><span class="v">Bọc giá trị trong <code>"</code> hay <code>'</code>; đa số bộ nạp gỡ đi, <code>docker run --env-file</code> giữ nguyên văn.</span></div>
  <div class="kv"><span class="k">Expansion (bung biến)</span><span class="v">Thay <code>$TÊN</code> bằng một giá trị; bash làm cả bên trong nháy kép.</span></div>
  <div class="kv"><span class="k">Interpolation (nội suy)</span><span class="v">Ghép giá trị này từ giá trị kia (<code>\${A}-x</code>); chạy ở bash và Compose, là chữ nguyên văn ở chỗ khác.</span></div>
  <div class="kv"><span class="k">Inline comment (chú thích cuối dòng)</span><span class="v">Một dấu <code>#</code> kết thúc giá trị — Node coi <code>mat#khau</code> là <code>mat</code>.</span></div>
  <div class="kv"><span class="k">CRLF (xuống dòng kiểu Windows)</span><span class="v">Hai byte <code>\\r\\n</code>; bash giữ <code>\\r</code> nằm trong giá trị.</span></div>
  <div class="kv"><span class="k"><code>EnvironmentFile=</code> (tệp môi trường của systemd)</span><span class="v">Bộ nạp của systemd: gỡ nháy, không bung gì, bỏ qua dòng hỏng kèm một cảnh báo trong journal.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có tiêu chuẩn <code>.env</code>: cùng chín dòng cho ra năm bộ giá trị khác nhau dưới bash, systemd, Docker, Compose và Node.</li>
<li>Những khác biệt nguy hiểm sinh ra GIÁ TRỊ SAI chứ không sinh ra lỗi — <code>#</code> cắt cụt dưới Node, <code>$</code> bung dưới bash và Compose, <code>\\r</code> nấp dưới bash.</li>
<li><code>docker run --env-file</code> giữ dấu nháy và từ chối cả tệp chỉ vì một dòng <code>export</code>; systemd bỏ qua dòng hỏng và vẫn khởi động.</li>
<li><code>env_file:</code> của Compose là bộ phân tích KHÁC với <code>docker run --env-file</code>, và nó bung <code>$HOME</code> lấy từ cái máy chạy Compose.</li>
<li>Giá trị an toàn là giá trị nhàm chán: bí mật dạng hex, không dấu cách, nháy chọn theo đúng bộ nạp production dùng, xuống dòng LF.</li>
<li>Kiểm TIẾN TRÌNH chứ đừng kiểm tệp: so các bộ nạp trên đúng những khoá đã khai, và kiểm bí mật bằng độ dài.</li>
</ul>

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
${slide('dv-04', 19, 'Xoá tệp không xoá lịch sử')}
<div class="out">  commit 1: .env da vao kho
  commit 2: da xoa .env va them .gitignore

════ bi mat con trong LICH SU khong? ════
  git log --all -- .env:
    08fe263 bo .env khoi kho, them gitignore
    d639afe them cau hinh

  doc thang tu commit dau:
    DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
    STRIPE_KEY=sk_live_12345xxxx

  tim theo NOI DUNG trong toan bo lich su:
    d639afe9b32fb61648cc19723320854e099abca1:.env</div>
<div class="callout warn"><strong>The credentials printed out in full, after being deleted.</strong> <code>git show HEAD~1:.env</code> is all it took. Git does not remove history when you remove a file — the commit that added it still exists, still contains the blob, and is still reachable by anyone with a clone. The <code>.gitignore</code> stops it happening <em>again</em>; it does nothing about what already happened.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Everyone with a clone already has it</span><span class="v">Every laptop, every CI runner cache, every fork. Rewriting history on the server does not reach any of them.</span></div>
  <div class="kv"><span class="k">Every backup has it</span><span class="v">Repository backups, mirrors, the copy someone made before a risky rebase.</span></div>
  <div class="kv"><span class="k">If it was ever public, assume it was scraped</span><span class="v">Public repositories are scanned continuously for exactly these patterns. <code>sk_live_</code> is a well-known prefix, and the interval between pushing and the first use of a leaked key is often measured in minutes.</span></div>
  <div class="kv"><span class="k">Rewriting history is the least important step</span><span class="v">It is worth doing, and it is not the fix. The fix is below.</span></div>
</div>

<div class="note-ct">Re-measured on 29/09/2026 in a scratch repository on the Mac (git 2.51). The sample key was changed from an earlier run to <code>sk_live_12345xxxx</code>, because the realistic-looking one tripped the Stripe rule of the repository's own secret scanner — which is this lesson happening to the lesson.</div>

<h3>Finding it: <code>git log -S</code>, and gitleaks across the whole history</h3>
${slide('dv-04', 20, 'gitleaks: cây làm việc sạch, lịch sử thì không')}
<p>The commands above answer "is <em>this</em> file in history?". Two tools answer the more useful question, "what secrets are anywhere in history?" — the first when you know a string, the second when you do not.</p>
<pre><code class="language-bash"># 1) biet CHUOI: commit nao da THEM hoac BO no? (-S = "pickaxe")
git log -p -S "MatKhauThatSu" --format="%h %s" | grep -E "^[0-9a-f]{7} |DATABASE"

# 2) KHONG biet chuoi: quet ca cay lam viec, roi ca lich su
gitleaks dir . --no-banner
gitleaks git . --no-banner --redact -v</code></pre>
<div class="out">$ git log -p -S "MatKhauThatSu" --format="%h %s" | grep -E "^[0-9a-f]{7} |DATABASE"
08fe263 bo .env khoi kho, them gitignore
-DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
d639afe them cau hinh
+DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
$ gitleaks dir .              # chi cac tep HIEN CO
INF scanned ~20 bytes (20 bytes) in 3.05ms
INF no leaks found
$ gitleaks git . --redact -v    # TOAN BO lich su
Finding:     JWT_SECRET=REDACTED
RuleID:      generic-api-key
File:        .env
Commit:      d639afe9b32fb61648cc19723320854e099abca1
INF 3 commits scanned.
WRN leaks found: 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-S</code> finds the commits that changed the count</span><span class="v">It lists every commit where the number of occurrences of the string went up or down — here, the one that added the password (<code>+</code>) and the one that removed it (<code>-</code>). <code>-G "regex"</code> is the regex version. <code>-p</code> shows the lines.</span></div>
  <div class="kv"><span class="k">The working tree is clean; history is not</span><span class="v"><code>gitleaks dir</code> scanned 20 bytes and found nothing — the <code>.env</code> is gone. <code>gitleaks git</code> walked all three commits and found the secret in the one that added it, and exited 1, so it can fail a CI job.</span></div>
  <div class="kv"><span class="k"><code>--redact</code> matters</span><span class="v">Without it, the scanner prints the secret in full into your terminal — and into the CI log, which is exactly the kind of place secrets leak from.</span></div>
  <div class="kv"><span class="k">Scanners have blind spots</span><span class="v">The same <code>.env</code> contained <code>postgres://app:MatKhauThatSu123@…</code>, and gitleaks' default rules did <strong>not</strong> report it. A clean scan means "no rule matched", not "no secret".</span></div>
</div>
<h3>The only response that works</h3>
${slide('dv-04', 21, 'Lộ khoá: XOAY trước, dọn lịch sử sau')}
<div class="callout ok"><strong>Rotate the secret. Immediately, before anything else.</strong> A leaked credential stops being dangerous when it stops being valid — not when it stops being visible. Everything else is tidying. Revoke the old key at the provider, issue a new one, put it on the server, restart, and confirm the old one no longer works. Cleaning history afterwards is worth doing so the next person does not find a credential and wonder whether it is live, but the clock that matters stops at rotation, not at rewriting.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Rotate, and verify the old value fails</span><span class="lz-d">Issue the new credential, deploy it, then <em>test the old one</em> and confirm it is rejected. A rotation you did not verify is a rotation you hope happened — and some providers keep an old key alive for a grace period.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Check whether it was used</span><span class="lz-d">Most providers have an access log. Look at it for the window between the commit and the rotation. This is the question your users will eventually ask, and "we don't know" is a much worse answer than "we checked".</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Then clean the history</span><span class="lz-d"><code>git filter-repo</code> — the maintained tool; <code>filter-branch</code> is deprecated and slow. It rewrites every commit, so every hash changes, so everyone must re-clone. Coordinate it, and expect open pull requests to break.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Add the guard that stops the next one</span><span class="lz-d">A pre-commit hook or a CI scan. The mistake is not carelessness — it is that <code>git add -A</code> does exactly what it is told, and nothing between your keyboard and the remote is looking.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># co bi mat nao trong lich su khong? (chay tren kho ban vua tiep quan)</span>
git rev-list --all | while read c; do
  git grep -lE '(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)' "\$c" 2&gt;/dev/null
done | sort -u

<span class="tok-comment"># tep .env co TUNG duoc theo doi khong?</span>
git log --all --oneline -- '*.env' '.env*'

<span class="tok-comment"># doc noi dung tai mot commit bat ky — day la thu ke tan cong lam</span>
git show &lt;commit&gt;:.env</code></pre>

<h3>Measured: rewriting history, and the clone that keeps it</h3>
<p>Step 3, done for real on a fresh copy of the scratch repository with <code>git filter-repo</code> — and then the question that matters, asked of a teammate's clone made the day before:</p>
<div class="out">$ git filter-repo --invert-paths --path .env --force
New history written in 0.10 seconds; now repacking/cleaning...
Completely finished after 0.25 seconds.
$ git log --all --oneline -- .env
(rong)
$ git log --oneline
7ec3d00 bo .env khoi kho, them gitignore
35bf8af khoi tao
$ cd ../ban-clone-cu &amp;&amp; git show d639afe:.env | head -1   # clone cu cua ban cung nhom
DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod</div>
<p>The rewrite worked exactly as advertised: <code>.env</code> is gone from every commit, the commit that only added it disappeared entirely, and every hash after the first changed (<code>08fe263</code> → <code>7ec3d00</code>; the untouched <code>35bf8af</code> kept its hash). And the old clone still printed the password in one command. That is why the order is rotate first: rewriting history cleans <em>your</em> copy; the credential is only harmless once it no longer works anywhere.</p>

<h3>Stopping it before it happens</h3>
${slide('dv-04', 22, 'Ba lớp chặn: máy bạn, GitHub, CI')}
<pre><code class="language-bash"><span class="tok-comment"># .git/hooks/pre-commit — chan truoc khi no thanh lich su</span>
#!/bin/bash
if git diff --cached --name-only | grep -qE '(^|/)\\.env(\\.|\$)'; then
  echo "TU CHOI: dang commit mot tep .env" &gt;&amp;2; exit 1
fi
if git diff --cached | grep -qE '^\\+.*(sk_live_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY)'; then
  echo "TU CHOI: co ve nhu mot bi mat trong diff" &gt;&amp;2; exit 1
fi</code></pre>
<div class="pitfall"><strong>Trap — a hook in <code>.git/hooks/</code> is not shared and not enforced.</strong> It lives outside the repository, so a new clone does not have it, and anyone can bypass it with <code>--no-verify</code>. It is a helpful reminder for the person who installed it and nothing more. The enforcing version has to run somewhere the committer does not control: a CI job on every push, or a server-side <code>pre-receive</code> hook (Lesson 2.2 — the one that <em>can</em> reject a push). Treat the local hook as the fast feedback and the CI check as the actual gate.</div>

<p>Measured with that exact hook, installed in the scratch repository — first the protection, then the two ways around it:</p>
<div class="out">$ git add -f .env.production &amp;&amp; git commit -m "cau hinh prod"
TU CHOI: dang commit mot tep .env
exit=1
$ git commit --no-verify -m "cau hinh prod"
exit=0
c4ffe2a cau hinh prod
$ git clone . ../clone-moi &amp;&amp; ls ../clone-moi/.git/hooks | grep -c "^pre-commit$"
0</div>
<p>Two more layers sit outside your machine. <strong>GitHub push protection</strong> scans pushes for known credential formats and blocks them; as of 09/2026 GitHub documents it as enabled by default for pushes to <em>public</em> repositories, and anyone with write access can still bypass it by giving a reason — so it is a seatbelt, not a lock, and it covers only formats GitHub recognises. The layer you control completely is a <strong>CI job</strong> that scans the full history on every push and fails the build. The container below is the same gitleaks 8.30.1 measured above, run the way CI would run it (checked locally: it found the same leak and exited 1):</p>
<pre><code class="language-yaml"># .github/workflows/quet-bi-mat.yml
name: quet-bi-mat
on: [push, pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0            # TOAN BO lich su — mac dinh chi 1 commit
      - name: Quet toan bo lich su
        run: docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest git /repo --redact --no-banner</code></pre>
<div class="note-ct"><code>fetch-depth: 0</code> is the line people forget. By default the checkout action fetches only the latest commit, and a history scan of one commit finds nothing — a green check that proves nothing, like the clean <code>gitleaks dir</code> above.</div>
<h3>Where secrets should live instead</h3>
${slide('dv-04', 23, 'Bí mật trên máy chủ: chmod 600, và thử đọc')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A file on the server, outside the artifact — the baseline</span><span class="lz-lnote">The shared directory from Lesson 4.1, mode <code>0600</code>, owned by the service user. Simple, auditable, and enough for most single-server deployments. Its weakness is that it is plaintext on disk and nothing rotates it for you.</span></div>
  <div class="lz-layer"><span class="lz-lname">Your CI provider's secret store — for deploy-time values</span><span class="lz-lnote">GitHub Actions secrets and equivalents. Right for things the deploy itself needs — an SSH key, a registry token. Note they are readable by any workflow that runs, so a pull request from a fork is a threat model worth understanding.</span></div>
  <div class="lz-layer"><span class="lz-lname">A secret manager — when there are many, or many machines</span><span class="lz-lnote">Vault, AWS Secrets Manager, SOPS with age. Real benefits: audit logs, automatic rotation, no plaintext at rest. Real cost: another dependency that must be available at start-up, which is a new way for a deploy to fail.</span></div>
  <div class="lz-layer"><span class="lz-lname">Encrypted in the repository — the compromise</span><span class="lz-lnote">SOPS or git-crypt: the values are versioned and reviewable, but only decryptable with a key that is not in the repository. Useful when configuration changes need review, and it moves the problem to "where does the decryption key live" rather than removing it.</span></div>
</div>
<div class="note-ct">Permissions matter more than people expect on the baseline option. <code>chmod 600 /srv/app/chung/.env</code> and <code>chown trienkhai:trienkhai</code> — Lesson 0.2 measured a deploy leaving files owned by <code>root</code> and world-readable, which for a <code>.env</code> means every user on the machine can read your production database password. Check it with <code>stat -c '%a %U:%G' /srv/app/chung/.env</code>; the answer should be <code>600</code> and the service user.</div>
<p>The permission check from the note above, measured on the lab VPS with a second ordinary user, <code>khach</code>:</p>
<div class="out">$ stat -c "%a %U:%G" /opt/datlich/.env
644 deploy:deploy
$ su khach -c "cat /opt/datlich/.env | head -1"
DATABASE_URL="x"
$ chmod 600 /opt/datlich/.env
$ stat -c "%a %U:%G" /opt/datlich/.env
600 deploy:deploy
$ su khach -c "cat /opt/datlich/.env"
cat: /opt/datlich/.env: Permission denied</div>
<p>With mode <code>644</code> — what a plain <code>touch</code> or an editor usually leaves — any account on the machine reads the production credentials. With <code>600</code>, only the owner (and root) can. When systemd loads the file with <code>EnvironmentFile=</code>, it reads it <em>as root, before</em> switching to the service's user, so the file can even be owned by root and unreadable by the application itself.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> during SWP391, a teammate committed <code>.env</code> in week 2, removed it in week 3, and your GitHub repository is about to be made public for the final presentation. Decide, with measurements, what has to happen before the switch is flipped. Work in a scratch repository with a fake secret.</p>
<ol>
<li>Commit a <code>.env</code> with <code>DATABASE_URL=postgres://app:MatKhau12345@db/prod</code> and <code>JWT_SECRET=$(openssl rand -hex 24)</code>, then <code>git rm --cached .env</code>, add <code>.gitignore</code>, commit again.</li>
<li>Find it three ways: <code>git log --all -- .env</code>, <code>git log -p -S "MatKhau12345"</code>, and <code>gitleaks git . --redact -v</code>. Note which one misses the database password.</li>
<li>Clone the repository (the "teammate"), then run <code>git filter-repo --invert-paths --path .env</code> on a second fresh clone. Check both.</li>
<li>Install the pre-commit hook from this lesson, try to commit <code>.env.production</code>, then bypass it with <code>--no-verify</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show the password still readable from the old clone after the rewrite, explain in one sentence why rotation comes first, and point at the line in the CI workflow that makes the scan see the whole history.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Git history</span><span class="v">Every commit ever made and reachable; deleting a file adds a commit, it does not remove old ones.</span></div>
  <div class="kv"><span class="k">Pickaxe (<code>git log -S</code>)</span><span class="v">Finds commits where the count of a string changed — the one that added a secret and the one that removed it.</span></div>
  <div class="kv"><span class="k">Secret scanning</span><span class="v">Pattern-matching files or history for credentials (gitleaks, trufflehog, GitHub); good at known formats, blind to others.</span></div>
  <div class="kv"><span class="k">Rotation</span><span class="v">Replacing a credential with a new one and making the old one stop working.</span></div>
  <div class="kv"><span class="k">Revoke</span><span class="v">Invalidating a credential at its provider, so possession no longer grants access.</span></div>
  <div class="kv"><span class="k">History rewrite (<code>git filter-repo</code>)</span><span class="v">Producing new commits without the file; every later hash changes and existing clones keep the old ones.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">GitHub blocking a push that contains a recognised credential; bypassable with a reason.</span></div>
  <div class="kv"><span class="k">pre-commit hook</span><span class="v">A local script run before each commit; fast feedback, not shared by clones, skipped with <code>--no-verify</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Removing <code>.env</code> and adding <code>.gitignore</code> leaves the secret readable from history with one <code>git show</code>.</li>
<li><code>git log -p -S</code> finds a known string; <code>gitleaks git --redact</code> scans the whole history — while <code>gitleaks dir</code> on the working tree says "no leaks".</li>
<li>Scanners miss formats they have no rule for: the database password inside a URL was not reported.</li>
<li>Rotate first and verify the old value fails; <code>filter-repo</code> cleans your copy, but a teammate's old clone still printed the password.</li>
<li>Local hooks are reminders (not cloned, <code>--no-verify</code>); GitHub push protection is a seatbelt; a CI scan with <code>fetch-depth: 0</code> is the gate.</li>
<li>On the server, <code>chmod 600</code> the <code>.env</code> and prove it: another user must get <code>Permission denied</code>.</li>
</ul>

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
${slide('dv-04', 19, 'Xoá tệp không xoá lịch sử')}
<div class="out">  commit 1: .env da vao kho
  commit 2: da xoa .env va them .gitignore

════ bi mat con trong LICH SU khong? ════
  git log --all -- .env:
    08fe263 bo .env khoi kho, them gitignore
    d639afe them cau hinh

  doc thang tu commit dau:
    DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
    STRIPE_KEY=sk_live_12345xxxx

  tim theo NOI DUNG trong toan bo lich su:
    d639afe9b32fb61648cc19723320854e099abca1:.env</div>
<div class="callout warn"><strong>Thông tin đăng nhập in ra NGUYÊN VẸN, sau khi đã bị xoá.</strong> Chỉ cần <code>git show HEAD~1:.env</code>. Git KHÔNG gỡ lịch sử khi bạn gỡ một tệp — cái commit đã thêm nó vẫn tồn tại, vẫn chứa cái blob, và vẫn với tới được bởi bất cứ ai có một bản clone. Tệp <code>.gitignore</code> ngăn chuyện đó xảy ra LẦN NỮA; nó chẳng làm gì được với chuyện ĐÃ xảy ra.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Mọi người có bản clone thì đã có nó rồi</span><span class="v">Mọi cái laptop, mọi cache của CI runner, mọi bản fork. Viết lại lịch sử trên máy chủ KHÔNG với tới cái nào trong số đó.</span></div>
  <div class="kv"><span class="k">Mọi bản sao lưu đều có nó</span><span class="v">Bản sao lưu kho mã, các bản mirror, cái bản ai đó chép ra trước một lần rebase mạo hiểm.</span></div>
  <div class="kv"><span class="k">Nếu nó từng CÔNG KHAI thì hãy coi như đã bị quét</span><span class="v">Kho mã công khai bị dò liên tục để tìm đúng những mẫu này. <code>sk_live_</code> là một tiền tố ai cũng biết, và khoảng cách giữa lúc push và lần dùng đầu tiên của một cái khoá bị lộ thường được đo bằng PHÚT.</span></div>
  <div class="kv"><span class="k">Viết lại lịch sử là bước ÍT quan trọng nhất</span><span class="v">Nó đáng làm, và nó KHÔNG phải cách sửa. Cách sửa nằm ngay dưới đây.</span></div>
</div>

<div class="note-ct">Đo lại ngày 29/09/2026 trong một kho thử trên Mac (git 2.51). Khoá mẫu đã được đổi so với lần chạy trước thành <code>sk_live_12345xxxx</code>, vì cái khoá trông-như-thật kia đã làm luật Stripe của chính bộ quét bí mật của kho này báo động — tức là bài học này xảy ra với chính bài học.</div>

<h3>Tìm nó: <code>git log -S</code>, và gitleaks trên toàn bộ lịch sử</h3>
${slide('dv-04', 20, 'gitleaks: cây làm việc sạch, lịch sử thì không')}
<p>Các lệnh ở trên trả lời câu "<em>TỆP NÀY</em> có trong lịch sử không?". Hai công cụ trả lời câu hỏi hữu ích hơn, "có bí mật nào ở BẤT CỨ đâu trong lịch sử không?" — cái thứ nhất khi bạn biết một chuỗi, cái thứ hai khi bạn không biết.</p>
<pre><code class="language-bash"># 1) biet CHUOI: commit nao da THEM hoac BO no? (-S = "pickaxe")
git log -p -S "MatKhauThatSu" --format="%h %s" | grep -E "^[0-9a-f]{7} |DATABASE"

# 2) KHONG biet chuoi: quet ca cay lam viec, roi ca lich su
gitleaks dir . --no-banner
gitleaks git . --no-banner --redact -v</code></pre>
<div class="out">$ git log -p -S "MatKhauThatSu" --format="%h %s" | grep -E "^[0-9a-f]{7} |DATABASE"
08fe263 bo .env khoi kho, them gitignore
-DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
d639afe them cau hinh
+DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod
$ gitleaks dir .              # chi cac tep HIEN CO
INF scanned ~20 bytes (20 bytes) in 3.05ms
INF no leaks found
$ gitleaks git . --redact -v    # TOAN BO lich su
Finding:     JWT_SECRET=REDACTED
RuleID:      generic-api-key
File:        .env
Commit:      d639afe9b32fb61648cc19723320854e099abca1
INF 3 commits scanned.
WRN leaks found: 1</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-S</code> tìm những commit làm ĐỔI số lần xuất hiện</span><span class="v">Nó liệt kê mọi commit mà số lần chuỗi xuất hiện tăng hay giảm — ở đây là commit đã THÊM mật khẩu (<code>+</code>) và commit đã BỎ nó (<code>-</code>). <code>-G "regex"</code> là bản dùng biểu thức chính quy. <code>-p</code> cho thấy từng dòng.</span></div>
  <div class="kv"><span class="k">Cây làm việc sạch; lịch sử thì không</span><span class="v"><code>gitleaks dir</code> quét 20 byte và chẳng thấy gì — <code>.env</code> đã đi rồi. <code>gitleaks git</code> đi qua cả ba commit và tìm thấy bí mật ở commit đã thêm nó, rồi thoát 1, nên nó làm hỏng được một job CI.</span></div>
  <div class="kv"><span class="k"><code>--redact</code> quan trọng</span><span class="v">Thiếu nó, bộ quét in bí mật NGUYÊN VẸN ra terminal của bạn — và ra log CI, đúng loại chỗ mà bí mật hay rò ra.</span></div>
  <div class="kv"><span class="k">Máy quét có điểm mù</span><span class="v">Cùng tệp <code>.env</code> đó có <code>postgres://app:MatKhauThatSu123@…</code>, và bộ luật mặc định của gitleaks KHÔNG báo nó. Quét sạch nghĩa là "không luật nào khớp", không phải "không có bí mật".</span></div>
</div>
<h3>Phản ứng DUY NHẤT có tác dụng</h3>
${slide('dv-04', 21, 'Lộ khoá: XOAY trước, dọn lịch sử sau')}
<div class="callout ok"><strong>XOAY cái bí mật đó. NGAY LẬP TỨC, trước mọi thứ khác.</strong> Một tín vật bị lộ thôi nguy hiểm khi nó thôi CÒN HIỆU LỰC — chứ không phải khi nó thôi NHÌN THẤY ĐƯỢC. Mọi thứ còn lại chỉ là dọn dẹp. Thu hồi khoá cũ ở phía nhà cung cấp, cấp khoá mới, đưa lên máy chủ, khởi động lại, và XÁC NHẬN rằng cái cũ không còn dùng được. Dọn lịch sử sau đó vẫn đáng làm để người sau không tìm thấy một tín vật rồi băn khoăn xem nó còn sống hay không, nhưng cái đồng hồ thật sự quan trọng thì DỪNG ở lúc xoay khoá, không phải lúc viết lại lịch sử.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xoay, và KIỂM rằng giá trị cũ đã hỏng</span><span class="lz-d">Cấp tín vật mới, deploy nó, rồi <em>ĐEM CÁI CŨ ĐI THỬ</em> và xác nhận nó bị từ chối. Một lần xoay bạn không kiểm lại là một lần xoay bạn HY VỌNG đã xảy ra — và vài nhà cung cấp còn giữ khoá cũ sống thêm một khoảng ân hạn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Kiểm xem nó CÓ BỊ DÙNG không</span><span class="lz-d">Hầu hết nhà cung cấp đều có log truy cập. Hãy soi nó trong khoảng thời gian từ lúc commit tới lúc xoay khoá. Đây là câu hỏi mà rốt cuộc người dùng của bạn sẽ hỏi, và "chúng tôi không biết" là một câu trả lời TỆ HƠN HẲN "chúng tôi đã kiểm".</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">RỒI mới dọn lịch sử</span><span class="lz-d"><code>git filter-repo</code> — công cụ đang được bảo trì; <code>filter-branch</code> đã bị khai tử và chậm. Nó viết lại MỌI commit, nên mọi mã băm đổi, nên mọi người phải clone lại. Hãy phối hợp trước, và lường trước rằng các pull request đang mở sẽ vỡ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thêm cái chốt chặn lần sau</span><span class="lz-d">Một hook pre-commit hoặc một bước quét trong CI. Cái sai không phải do bất cẩn — mà do <code>git add -A</code> làm ĐÚNG những gì nó được bảo, và giữa bàn phím bạn với máy chủ từ xa thì chẳng có gì đang nhìn cả.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># co bi mat nao trong lich su khong? (chay tren kho ban vua tiep quan)</span>
git rev-list --all | while read c; do
  git grep -lE '(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)' "\$c" 2&gt;/dev/null
done | sort -u

<span class="tok-comment"># tep .env co TUNG duoc theo doi khong?</span>
git log --all --oneline -- '*.env' '.env*'

<span class="tok-comment"># doc noi dung tai mot commit bat ky — day la thu ke tan cong lam</span>
git show &lt;commit&gt;:.env</code></pre>

<h3>Đo thật: viết lại lịch sử, và bản clone vẫn giữ nó</h3>
<p>Bước 3, làm thật trên một bản sao mới của kho thử bằng <code>git filter-repo</code> — rồi hỏi câu hỏi thật sự quan trọng, với bản clone mà một bạn cùng nhóm đã làm từ hôm trước:</p>
<div class="out">$ git filter-repo --invert-paths --path .env --force
New history written in 0.10 seconds; now repacking/cleaning...
Completely finished after 0.25 seconds.
$ git log --all --oneline -- .env
(rong)
$ git log --oneline
7ec3d00 bo .env khoi kho, them gitignore
35bf8af khoi tao
$ cd ../ban-clone-cu &amp;&amp; git show d639afe:.env | head -1   # clone cu cua ban cung nhom
DATABASE_URL=postgres://app:MatKhauThatSu123@db:5432/prod</div>
<p>Cú viết lại chạy đúng như quảng cáo: <code>.env</code> biến khỏi mọi commit, commit chỉ-để-thêm-nó biến mất hoàn toàn, và mọi mã băm từ đó trở đi đều đổi (<code>08fe263</code> → <code>7ec3d00</code>; <code>35bf8af</code> không bị đụng tới nên giữ nguyên). Và bản clone cũ VẪN in ra mật khẩu bằng một lệnh. Đó là lý do thứ tự là XOAY trước: viết lại lịch sử dọn sạch bản sao <em>CỦA BẠN</em>; tín vật chỉ vô hại khi nó không còn dùng được ở BẤT CỨ đâu.</p>

<h3>Chặn nó trước khi nó xảy ra</h3>
${slide('dv-04', 22, 'Ba lớp chặn: máy bạn, GitHub, CI')}
<pre><code class="language-bash"><span class="tok-comment"># .git/hooks/pre-commit — chan truoc khi no thanh lich su</span>
#!/bin/bash
if git diff --cached --name-only | grep -qE '(^|/)\\.env(\\.|\$)'; then
  echo "TU CHOI: dang commit mot tep .env" &gt;&amp;2; exit 1
fi
if git diff --cached | grep -qE '^\\+.*(sk_live_|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]*PRIVATE KEY)'; then
  echo "TU CHOI: co ve nhu mot bi mat trong diff" &gt;&amp;2; exit 1
fi</code></pre>
<div class="pitfall"><strong>Bẫy — một hook nằm trong <code>.git/hooks/</code> thì KHÔNG được chia sẻ và KHÔNG có tính cưỡng chế.</strong> Nó sống ngoài kho mã, nên một bản clone mới không hề có nó, và ai cũng vượt qua được bằng <code>--no-verify</code>. Nó là một lời nhắc hữu ích cho chính người đã cài nó, và không hơn. Bản CƯỠNG CHẾ phải chạy ở một chỗ mà người commit KHÔNG kiểm soát: một job CI trên mọi lần push, hoặc một hook <code>pre-receive</code> phía máy chủ (Bài 2.2 — cái hook thật sự TỪ CHỐI được một lần push). Hãy coi hook cục bộ là phản hồi nhanh còn phép kiểm trong CI mới là cái CỔNG thật.</div>

<p>Đo với đúng cái hook đó, cài vào kho thử — trước là sự bảo vệ, rồi tới hai cách vòng qua nó:</p>
<div class="out">$ git add -f .env.production &amp;&amp; git commit -m "cau hinh prod"
TU CHOI: dang commit mot tep .env
exit=1
$ git commit --no-verify -m "cau hinh prod"
exit=0
c4ffe2a cau hinh prod
$ git clone . ../clone-moi &amp;&amp; ls ../clone-moi/.git/hooks | grep -c "^pre-commit$"
0</div>
<p>Còn hai lớp nằm ngoài máy bạn. <strong>GitHub push protection (chặn lúc push)</strong> quét các lần push tìm những định dạng tín vật đã biết và chặn lại; tính đến 09/2026 GitHub ghi trong tài liệu rằng nó bật MẶC ĐỊNH cho các lần push lên kho <em>CÔNG KHAI</em>, và ai có quyền ghi vẫn vượt qua được bằng cách nêu một lý do — nên nó là dây an toàn chứ không phải ổ khoá, và chỉ bắt những định dạng GitHub nhận ra. Lớp bạn kiểm soát trọn vẹn là một <strong>job CI</strong> quét toàn bộ lịch sử ở mỗi lần push và làm hỏng bản dựng. Container dưới đây chính là gitleaks 8.30.1 đã đo ở trên, chạy theo cách CI sẽ chạy (đã kiểm cục bộ: nó tìm ra đúng chỗ rò đó và thoát 1):</p>
<pre><code class="language-yaml"># .github/workflows/quet-bi-mat.yml
name: quet-bi-mat
on: [push, pull_request]
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          fetch-depth: 0            # TOAN BO lich su — mac dinh chi 1 commit
      - name: Quet toan bo lich su
        run: docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest git /repo --redact --no-banner</code></pre>
<div class="note-ct"><code>fetch-depth: 0</code> là dòng người ta hay quên. Mặc định action checkout chỉ lấy commit mới nhất, và quét lịch sử của MỘT commit thì chẳng thấy gì — một dấu tích xanh chẳng chứng minh được gì, giống hệt cái <code>gitleaks dir</code> sạch sẽ ở trên.</div>
<h3>Vậy bí mật nên sống ở đâu</h3>
${slide('dv-04', 23, 'Bí mật trên máy chủ: chmod 600, và thử đọc')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một tệp trên máy chủ, ngoài tạo tác — mức nền</span><span class="lz-lnote">Thư mục dùng chung ở Bài 4.1, quyền <code>0600</code>, thuộc về người dùng của dịch vụ. Đơn giản, kiểm toán được, và đủ cho phần lớn triển khai một máy chủ. Điểm yếu của nó là văn bản thuần nằm trên đĩa và chẳng có gì tự xoay nó hộ bạn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kho bí mật của nhà cung cấp CI — cho giá trị dùng LÚC DEPLOY</span><span class="lz-lnote">GitHub Actions secrets và các thứ tương đương. Đúng cho những thứ mà chính lần deploy cần — một khoá SSH, một token registry. Lưu ý rằng MỌI workflow chạy được đều đọc được chúng, nên một pull request từ một bản fork là một mô hình đe doạ đáng hiểu cho kỹ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một trình quản lý bí mật — khi có NHIỀU, hoặc nhiều máy</span><span class="lz-lnote">Vault, AWS Secrets Manager, SOPS kèm age. Lợi ích thật: log kiểm toán, xoay khoá tự động, không có văn bản thuần nằm yên trên đĩa. Cái giá thật: thêm một phụ thuộc BẮT BUỘC phải sống lúc khởi động, tức là thêm một cách mới để một lần deploy hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Mã hoá ngay trong kho mã — cách thoả hiệp</span><span class="lz-lnote">SOPS hoặc git-crypt: giá trị được quản lý phiên bản và review được, nhưng chỉ giải mã được bằng một cái khoá KHÔNG nằm trong kho. Hữu ích khi thay đổi cấu hình cần được review, và nó DỜI bài toán về câu "cái khoá giải mã sống ở đâu" chứ không xoá bỏ bài toán.</span></div>
</div>
<div class="note-ct">Với phương án mức nền thì QUYỀN quan trọng hơn người ta tưởng. <code>chmod 600 /srv/app/chung/.env</code> và <code>chown trienkhai:trienkhai</code> — Bài 0.2 đã đo một lần deploy để lại tệp thuộc về <code>root</code> và cả thế giới đọc được, mà với một tệp <code>.env</code> thì điều đó nghĩa là MỌI người dùng trên máy đọc được mật khẩu cơ sở dữ liệu production của bạn. Kiểm bằng <code>stat -c '%a %U:%G' /srv/app/chung/.env</code>; đáp án phải là <code>600</code> và người dùng của dịch vụ.</div>
<p>Phép kiểm quyền trong ghi chú ở trên, đo trên VPS thí nghiệm với một người dùng thường thứ hai, <code>khach</code>:</p>
<div class="out">$ stat -c "%a %U:%G" /opt/datlich/.env
644 deploy:deploy
$ su khach -c "cat /opt/datlich/.env | head -1"
DATABASE_URL="x"
$ chmod 600 /opt/datlich/.env
$ stat -c "%a %U:%G" /opt/datlich/.env
600 deploy:deploy
$ su khach -c "cat /opt/datlich/.env"
cat: /opt/datlich/.env: Permission denied</div>
<p>Với quyền <code>644</code> — thứ mà một lệnh <code>touch</code> hay một trình soạn thảo thường để lại — MỌI tài khoản trên máy đều đọc được tín vật production. Với <code>600</code>, chỉ chủ (và root) đọc được. Khi systemd nạp tệp bằng <code>EnvironmentFile=</code>, nó đọc <em>BẰNG QUYỀN ROOT, TRƯỚC KHI</em> chuyển sang người dùng của dịch vụ, nên tệp thậm chí có thể thuộc về root và chính ứng dụng cũng không đọc được.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> trong SWP391, một bạn cùng nhóm commit <code>.env</code> ở tuần 2, gỡ nó ở tuần 3, và kho GitHub của nhóm sắp được chuyển sang công khai cho buổi thuyết trình cuối kỳ. Hãy quyết định, bằng phép đo, việc gì phải xảy ra TRƯỚC khi bật công tắc đó. Làm trong một kho thử với bí mật giả.</p>
<ol>
<li>Commit một <code>.env</code> có <code>DATABASE_URL=postgres://app:MatKhau12345@db/prod</code> và <code>JWT_SECRET=$(openssl rand -hex 24)</code>, rồi <code>git rm --cached .env</code>, thêm <code>.gitignore</code>, commit lần nữa.</li>
<li>Tìm nó bằng ba cách: <code>git log --all -- .env</code>, <code>git log -p -S "MatKhau12345"</code>, và <code>gitleaks git . --redact -v</code>. Ghi lại cách nào bỏ sót mật khẩu cơ sở dữ liệu.</li>
<li>Clone kho (vai "bạn cùng nhóm"), rồi chạy <code>git filter-repo --invert-paths --path .env</code> trên một bản clone mới thứ hai. Kiểm cả hai.</li>
<li>Cài hook pre-commit của bài, thử commit <code>.env.production</code>, rồi vượt qua nó bằng <code>--no-verify</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được mật khẩu vẫn đọc được từ bản clone cũ sau khi viết lại, giải thích trong một câu vì sao phải XOAY trước, và chỉ đúng dòng trong workflow CI giúp phép quét nhìn thấy toàn bộ lịch sử.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Git history (lịch sử git)</span><span class="v">Mọi commit từng được tạo và còn với tới được; xoá một tệp là THÊM một commit, không gỡ commit cũ.</span></div>
  <div class="kv"><span class="k">Pickaxe — <code>git log -S</code> (cuốc chim)</span><span class="v">Tìm những commit làm đổi số lần xuất hiện của một chuỗi — commit đã thêm bí mật và commit đã bỏ nó.</span></div>
  <div class="kv"><span class="k">Secret scanning (quét bí mật)</span><span class="v">Dò tệp hoặc lịch sử theo mẫu để tìm tín vật (gitleaks, trufflehog, GitHub); giỏi với định dạng đã biết, mù với định dạng khác.</span></div>
  <div class="kv"><span class="k">Rotation (xoay khoá)</span><span class="v">Thay một tín vật bằng cái mới và làm cho cái cũ thôi hiệu lực.</span></div>
  <div class="kv"><span class="k">Revoke (thu hồi)</span><span class="v">Vô hiệu một tín vật ở phía nhà cung cấp, để có nó trong tay không còn mở được gì.</span></div>
  <div class="kv"><span class="k">History rewrite — <code>git filter-repo</code> (viết lại lịch sử)</span><span class="v">Sinh ra các commit mới không có tệp đó; mọi mã băm phía sau đổi và các bản clone đã có vẫn giữ bản cũ.</span></div>
  <div class="kv"><span class="k">Push protection (chặn lúc push)</span><span class="v">GitHub chặn một lần push có chứa tín vật nó nhận ra; vượt qua được nếu nêu lý do.</span></div>
  <div class="kv"><span class="k">pre-commit hook (hook trước commit)</span><span class="v">Script cục bộ chạy trước mỗi commit; phản hồi nhanh, không theo bản clone, bị bỏ qua bằng <code>--no-verify</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gỡ <code>.env</code> và thêm <code>.gitignore</code> vẫn để bí mật đọc được từ lịch sử bằng một lệnh <code>git show</code>.</li>
<li><code>git log -p -S</code> tìm một chuỗi đã biết; <code>gitleaks git --redact</code> quét toàn bộ lịch sử — trong khi <code>gitleaks dir</code> trên cây làm việc báo "không rò rỉ".</li>
<li>Máy quét bỏ sót những định dạng nó không có luật: mật khẩu cơ sở dữ liệu nằm trong URL không bị báo.</li>
<li>XOAY trước và kiểm rằng giá trị cũ đã hỏng; <code>filter-repo</code> dọn bản sao của bạn, nhưng bản clone cũ của bạn cùng nhóm vẫn in ra mật khẩu.</li>
<li>Hook cục bộ chỉ là lời nhắc (không theo clone, <code>--no-verify</code>); push protection của GitHub là dây an toàn; phép quét trong CI với <code>fetch-depth: 0</code> mới là cái cổng.</li>
<li>Trên máy chủ, <code>chmod 600</code> tệp <code>.env</code> và chứng minh nó: người dùng khác phải nhận <code>Permission denied</code>.</li>
</ul>

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
${slide('dv-04', 24, 'Xoay khoá ký bốn giai đoạn, không ai bị đá ra')}
<div class="out">════ neu DOI THANG tu cu sang moi ════
  token cu cap 1 phut truoc: TU CHOI  ← MOI nguoi dung bi dang xuat</div>
<p>One environment variable changed, one restart, and every session issued before that moment is rejected. On a busy site that is thousands of people logged out simultaneously, all retrying at once — which is also a load spike at the exact moment you were doing something delicate.</p>

<h3>Two keys at once</h3>
${slide('dv-04', 25, 'Ký bằng khoá đầu, kiểm theo kid')}
<p>The mechanism is one line of design: <strong>sign with one key, accept a list</strong>.</p>
<pre><code class="language-javascript"><span class="tok-comment">// KY bang khoa dau tien; CHAP NHAN bat ky khoa nao trong danh sach</span>
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

<h3>Naming the key: <code>kid</code>, measured</h3>
<p>The version above tries every key in the list until one fits. That works, and it has two costs: every verification does up to <em>n</em> HMAC computations, and when a token is rejected you cannot tell whether it was forged or merely signed with a key you already retired. The standard fix is the one JSON Web Tokens use: the token's header carries a <strong><code>kid</code> (key ID)</strong> naming the key that signed it, and the verifier looks that key up instead of trying them all. The environment variable becomes a list of <code>id:secret</code> pairs, first one signs:</p>
<pre><code class="language-javascript">// SIGNING_KEYS="k0929:…,k0801:…" — khoa DAU de ky, ca danh sach de kiem
const keys = process.env.SIGNING_KEYS.split(',')
  .map(x =&gt; x.split(':')).map(([kid, k]) =&gt; ({ kid, k }));

const ky = (sub) =&gt; {
  const h = b64({ alg: 'HS256', kid: keys[0].kid });     // ghi TEN khoa vao token
  const p = b64({ sub });
  return &#96;\${h}.\${p}.\${hmac(h + '.' + p, keys[0].k)}&#96;;
};
const kiem = (t) =&gt; {
  const [h, p, s] = t.split('.');
  const key = keys.find(x =&gt; x.kid === JSON.parse(Buffer.from(h, 'base64url')).kid);
  return !!key &amp;&amp; crypto.timingSafeEqual(Buffer.from(hmac(h + '.' + p, key.k)), Buffer.from(s));
};</code></pre>
<div class="out">$ node xoay.mjs
GD 1: chi co khoa cu — ky bang k0801
  token cu:  HOP LE (kid=k0801)
GD 2: THEM khoa moi (van ky bang cu) — ky bang k0801
  token cu:  HOP LE (kid=k0801)
GD 3: DOI THU TU (ky bang moi) — ky bang k0929
  token cu:  HOP LE (kid=k0801)
  token moi: HOP LE (kid=k0929)
GD 4: BO khoa cu — ky bang k0929
  token cu:  TU CHOI (khong biet kid=k0801)
  token moi: HOP LE (kid=k0929)
DOI THANG (ngay tho): SIGNING_KEYS=k0929:…
  token cu: TU CHOI (khong biet kid=k0801)</div>
<p>The rejection now says <em>why</em>: "unknown kid k0801" means "signed by a key we retired", which is a normal event after phase 4 and very different from "bad signature", which means someone is forging tokens. Name keys by date (<code>k0929</code>) and the log tells you how old the rejected token is. <code>timingSafeEqual</code> compares signatures in constant time, so an attacker cannot learn a correct signature byte by byte from response times.</p>
<h3>Which secrets rotate cleanly, and which do not</h3>
${slide('dv-04', 28, 'Bí mật nào xoay thế nào')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Database passwords — rotate in one step</span><span class="lz-d">Nothing outside the application holds one. Create a second user or change the password, deploy the new value, restart. The only care needed is ordering: with the blue-green swap from Chapter 3 both versions run briefly, so the database must accept both values during that window — which usually means adding a second user rather than changing one password.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Third-party API keys — usually two-key capable</span><span class="lz-d">Most providers let you have two live keys precisely so you can rotate. Issue the second, deploy, verify traffic is using it, revoke the first. Verify before revoking — a background job that only runs nightly may still be holding the old one.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Signing keys — need the four phases</span><span class="lz-d">JWT secrets, session cookie keys, signed URL keys. Anything where something you issued in the past has to remain verifiable in the future.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Encryption keys for data at rest — hardest</span><span class="lz-d">Rotating the key does not re-encrypt the data. You need both keys until every row is re-encrypted, which is a migration, not a deploy. Store a key identifier alongside each encrypted value so you know which key it needs.</span></div>
</div>

<h3>Measured: a database password, changed directly vs two users</h3>
${slide('dv-04', 26, 'Mật khẩu CSDL: thêm user mới, đừng đổi user cũ')}
<p>The table above says database passwords rotate "in one step", with a caveat about the blue-green window. Here is that caveat measured, on PostgreSQL 16 in a container (times are UTC). First, a session is opened with the old password and kept busy for five seconds; one second in, the password is changed:</p>
<div class="out">════ 1) doi THANG mat khau cua user dang dung ════
  02:01:34 ALTER ROLE app_0801 PASSWORD 'mk-moi-…'
  02:01:34 ket noi MOI, mat khau cu:
  FATAL:  password authentication failed for user "app_0801"
  phien cu mo luc 02:01:33
  phien cu VAN chay luc 02:01:38

════ 2) HAI user: them app_0929, khoa app_0801 sau ════
  CREATE ROLE app_0929 LOGIN PASSWORD '…' IN ROLE datlich_rw
  app_0801 (ban dang chay):
  ghi duoc, id=1
  app_0929 (ban moi):
  ghi duoc, id=2
  ALTER ROLE app_0801 NOLOGIN      # sau khi ban cu da tat han
  app_0801:
  FATAL:  role "app_0801" is not permitted to log in
  app_0929:
2 dong trong lich</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Existing sessions survive a password change</span><span class="v">The session opened at 02:01:33 ran its next query at 02:01:38 with the old credentials. PostgreSQL checks the password when a connection is <em>opened</em>, never again. A connection pool full of old connections keeps working — until it opens a new one.</span></div>
  <div class="kv"><span class="k">New connections with the old password fail at once</span><span class="v">During a blue-green swap the old version is still running; the first time its pool grows, or its process restarts, it cannot connect. That is an outage caused by rotation.</span></div>
  <div class="kv"><span class="k">Two users, one set of permissions</span><span class="v"><code>IN ROLE datlich_rw</code> gives the new login role exactly the rights of the group role, so both versions can write while they overlap. Deploy the new version with <code>app_0929</code>, wait until the old version is gone, then <code>NOLOGIN</code> the old role.</span></div>
  <div class="kv"><span class="k">To cut the survivors off</span><span class="v"><code>SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename = 'app_0801';</code> — needed if the password leaked, because a password change alone does not evict anyone.</span></div>
</div>
<h3>A rotation is a deploy, so it is measurable</h3>
${slide('dv-04', 27, 'Kiểm lần xoay: token cũ PHẢI ra 401')}
<pre><code class="language-bash"><span class="tok-comment"># tien trinh dang chay CO THAT SU nhan khoa moi khong? (Bai 4.2)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ \\
  | awk -F= '/^SIGNING_KEYS/{print "so khoa dang chap nhan:", split(\$2, a, ",")}'

<span class="tok-comment"># token cu CON dung khong? (phai HOP LE o giai doan 2 va 3)</span>
curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer \$TOKEN_CU" \\
  https://cuongthai.com/api/nguoi-dung/toi

<span class="tok-comment"># sau giai doan 4: no PHAI bi tu choi</span>
<span class="tok-comment"># mot cu 200 o day nghia la khoa cu VAN dang duoc chap nhan — chua xoay xong</span></code></pre>
<div class="note-ct">That last check is the one people skip, and it is the one that catches an incomplete rotation. A phase-4 deploy that did not actually take — a variable not updated, a container not restarted, a second server that was missed — leaves the old key live while everyone believes it is revoked. The test is one <code>curl</code> with a token you kept from before the rotation, and the expected answer is <code>401</code>.</div>

<p>Measured with a small Node token server on the Mac, restarted with each phase's <code>SIGNING_KEYS</code>, and one token kept from before the rotation. The third run simulates a second server that nobody updated:</p>
<div class="out"># lay token TRUOC khi xoay:
$ TOKEN_CU=$(curl -s localhost:19044/dang-nhap)
# giai doan 3: SIGNING_KEYS=k0929:…,k0801:…
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi
200
# giai doan 4: SIGNING_KEYS=k0929:…
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi
401
# giai doan 4, nhung MAY 2 bi sot: SIGNING_KEYS=k0929:…,k0801:…
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi
200</div>
<p>The same <code>curl</code> is both the proof and the alarm: <code>401</code> after phase 4 means the old key is really gone; a <code>200</code> on any machine means the rotation is incomplete, whatever the deploy log says. And before rotating at all, search by <em>value</em> — measured on the lab VPS, where the same secret had been copied under three names:</p>
<div class="out">$ grep -rl JWT_SECRET /opt/datlich /home/deploy/bin          # tim theo TEN
/opt/datlich/.env
$ grep -rlF "$GIA_TRI_CU" /opt/datlich /home/deploy/bin       # tim theo GIA TRI
/opt/datlich/worker.env
/opt/datlich/.env
/home/deploy/bin/don-phien.sh</div>
<p>Searching by name found one file; searching by value found three — a worker's <code>.env</code> under <code>AUTH_SIGNING_KEY</code> and a maintenance script with the value inlined. Rotate only the first and the other two keep authenticating with a key you believe is retired. Use <code>-F</code> (fixed string) so characters in the secret are not treated as a regex, and keep the value in a variable rather than typing it into the command line, where it would land in your shell history.</p>
<h3>Making it routine</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Write down what each secret is and how to rotate it</span><span class="lz-lnote">One line per secret: what it is for, where it comes from, whether it supports two-at-once, and how long old values must stay valid. Without it, every rotation starts with an investigation.</span></div>
  <div class="lz-layer"><span class="lz-lname">Design for a list from day one</span><span class="lz-lnote"><code>JWT_SECRET</code> as a comma-separated list costs nothing when there is one value in it, and it is the difference between a four-phase rotation and a mass logout later. Retro-fitting it during an incident is not the moment.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rotate on a schedule, not only on a leak</span><span class="lz-lnote">A rotation you have done before is a rotation you can do under pressure. The first time should not be the day it leaked.</span></div>
  <div class="lz-layer"><span class="lz-lname">Keep an expiry shorter than your patience</span><span class="lz-lnote">Phase 4 waits for the longest-lived token. Thirty-day sessions mean a thirty-day rotation. That is an argument for short access tokens plus refresh — which is where the Authentication course goes into this properly.</span></div>
</div>
<h3>Rotating a secret without an outage</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Accept both, briefly</span><span class="lz-lnote">The verifier trusts the old key and the new one at the same time. This overlap window is the entire trick, and it is what turns a rotation from an outage into a deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Issue only with the new one</span><span class="lz-lnote">New sessions and new signatures use the new key from the moment it is deployed. Nothing old is being created any more.</span></div>
  <div class="lz-layer"><span class="lz-lname">Wait out the longest lifetime</span><span class="lz-lnote">Everything signed with the old key expires on its own schedule. Cutting this short is what logs people out.</span></div>
  <div class="lz-layer"><span class="lz-lname">Then remove the old key</span><span class="lz-lnote">And confirm nothing broke, because now a stale token fails loudly rather than silently continuing to work.</span></div>
</div>
<div class="pitfall"><strong>Trap — rotating a secret that something else also holds a copy of.</strong> The overlap window works when one verifier owns the key. It does not help when the same secret is pasted into a CI variable, a second service, a cron job and a teammate&#39;s <code>.env</code> — rotating the one you know about leaves the others authenticating with a key you believe is retired, and the eventual cleanup breaks something nobody connected to the rotation weeks earlier. Before rotating, grep the whole estate for the value, not for the variable name: the same secret is often stored under three different names.</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 app signs sessions with one <code>JWT_SECRET</code>, and the lecturer asks for a key change before the demo — without logging out the examiners who are already signed in. Then the database password must change too, while the old and new versions briefly run side by side.</p>
<ol>
<li>Write (or copy from this lesson) a small token server that reads <code>SIGNING_KEYS</code> as <code>kid:secret</code> pairs, signs with the first and verifies by <code>kid</code>. Issue a token with phase 1 and keep it in <code>$TOKEN_CU</code>.</li>
<li>Restart through phases 2, 3 and 4, running the same <code>curl -w '%{http_code}'</code> each time. Then run phase 4 again but "forget" to remove the old key, as if a second server was missed.</li>
<li>In a PostgreSQL container: open a long session as <code>app_0801</code>, change its password mid-session, try a new connection with the old password. Then do it properly with a second role <code>IN ROLE datlich_rw</code> and <code>NOLOGIN</code>.</li>
<li>Copy one secret into two files under different names and find all copies with <code>grep -rlF</code>.</li>
</ol>
<p><strong>Done when:</strong> the old token gives <code>200</code> in phases 1–3, <code>401</code> in phase 4 and <code>200</code> again on the "missed server"; the long session survived the password change while a new connection failed; and <code>grep -rlF</code> found every copy.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signing key</span><span class="v">The secret used to sign tokens or cookies; everything signed in the past must stay verifiable until it expires.</span></div>
  <div class="kv"><span class="k">Key rotation</span><span class="v">Moving from one key to another without leaving a window where valid things are rejected or old keys still work.</span></div>
  <div class="kv"><span class="k">Overlap window</span><span class="v">The period when the verifier accepts both the old and the new key — the whole trick of rotation without downtime.</span></div>
  <div class="kv"><span class="k"><code>kid</code> (key ID)</span><span class="v">A header field naming the key that signed a token, so the verifier looks it up instead of trying every key.</span></div>
  <div class="kv"><span class="k">JWKS</span><span class="v">JSON Web Key Set (RFC 7517): the standard format for publishing a list of keys identified by <code>kid</code>.</span></div>
  <div class="kv"><span class="k">Grace period</span><span class="v">Time a provider keeps an old key working after you issue a new one — why you must test that the old one fails.</span></div>
  <div class="kv"><span class="k"><code>NOLOGIN</code></span><span class="v">A PostgreSQL role attribute that blocks new connections for a role without deleting it or its permissions.</span></div>
  <div class="kv"><span class="k"><code>pg_terminate_backend</code></span><span class="v">Ends an existing PostgreSQL session — the step a password change alone does not do.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Changing a signing key in one step rejects every token already issued; sign with one key and accept a list, then rotate in four deploys.</li>
<li>Only phase 4 rejects anything, and it must wait for the longest-lived token to expire — unless the key leaked, in which case you log everyone out on purpose.</li>
<li>A <code>kid</code> in the token names the key: verification is a lookup, and "unknown kid" is distinguishable from a forged signature.</li>
<li>Changing a PostgreSQL password does not end open sessions but breaks every new one; rotate with a second role in the same group and <code>NOLOGIN</code> the old one later.</li>
<li>The proof of a finished rotation is a <code>401</code> for a token you kept from before — on every machine.</li>
<li>Before rotating, find every copy of the secret by its value with <code>grep -rlF</code>; the same secret often hides under several names.</li>
</ul>

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
${slide('dv-04', 24, 'Xoay khoá ký bốn giai đoạn, không ai bị đá ra')}
<div class="out">════ neu DOI THANG tu cu sang moi ════
  token cu cap 1 phut truoc: TU CHOI  ← MOI nguoi dung bi dang xuat</div>
<p>Một biến môi trường đổi, một cú khởi động lại, và MỌI phiên đăng nhập cấp trước khoảnh khắc đó đều bị từ chối. Trên một website đông khách thì đó là hàng nghìn người bị đăng xuất cùng lúc, tất cả cùng thử lại một lượt — mà đó cũng là một cú tăng tải đúng vào lúc bạn đang làm một việc tinh vi.</p>

<h3>Hai khoá cùng lúc</h3>
${slide('dv-04', 25, 'Ký bằng khoá đầu, kiểm theo kid')}
<p>Cơ chế gói trong một dòng thiết kế: <strong>KÝ bằng một khoá, CHẤP NHẬN cả một danh sách</strong>.</p>
<pre><code class="language-javascript"><span class="tok-comment">// KY bang khoa dau tien; CHAP NHAN bat ky khoa nao trong danh sach</span>
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

<h3>Đặt tên cho khoá: <code>kid</code>, đo thật</h3>
<p>Bản ở trên thử lần lượt mọi khoá trong danh sách tới khi có cái khớp. Cách đó chạy được, và có hai cái giá: mỗi lần kiểm tốn tới <em>n</em> phép tính HMAC, và khi một token bị từ chối thì bạn không phân biệt được nó bị GIẢ MẠO hay chỉ đơn giản là được ký bằng một khoá bạn đã cho nghỉ hưu. Cách sửa chuẩn là cách JSON Web Token dùng: phần đầu (header) của token mang một <strong><code>kid</code> (key ID — mã định danh khoá)</strong> nêu tên khoá đã ký nó, và bên kiểm TRA khoá đó ra thay vì thử hết. Biến môi trường trở thành một danh sách các cặp <code>mã:bí-mật</code>, cặp đầu tiên dùng để ký:</p>
<pre><code class="language-javascript">// SIGNING_KEYS="k0929:…,k0801:…" — khoa DAU de ky, ca danh sach de kiem
const keys = process.env.SIGNING_KEYS.split(',')
  .map(x =&gt; x.split(':')).map(([kid, k]) =&gt; ({ kid, k }));

const ky = (sub) =&gt; {
  const h = b64({ alg: 'HS256', kid: keys[0].kid });     // ghi TEN khoa vao token
  const p = b64({ sub });
  return &#96;\${h}.\${p}.\${hmac(h + '.' + p, keys[0].k)}&#96;;
};
const kiem = (t) =&gt; {
  const [h, p, s] = t.split('.');
  const key = keys.find(x =&gt; x.kid === JSON.parse(Buffer.from(h, 'base64url')).kid);
  return !!key &amp;&amp; crypto.timingSafeEqual(Buffer.from(hmac(h + '.' + p, key.k)), Buffer.from(s));
};</code></pre>
<div class="out">$ node xoay.mjs
GD 1: chi co khoa cu — ky bang k0801
  token cu:  HOP LE (kid=k0801)
GD 2: THEM khoa moi (van ky bang cu) — ky bang k0801
  token cu:  HOP LE (kid=k0801)
GD 3: DOI THU TU (ky bang moi) — ky bang k0929
  token cu:  HOP LE (kid=k0801)
  token moi: HOP LE (kid=k0929)
GD 4: BO khoa cu — ky bang k0929
  token cu:  TU CHOI (khong biet kid=k0801)
  token moi: HOP LE (kid=k0929)
DOI THANG (ngay tho): SIGNING_KEYS=k0929:…
  token cu: TU CHOI (khong biet kid=k0801)</div>
<p>Giờ lời từ chối nói được <em>VÌ SAO</em>: "không biết kid k0801" nghĩa là "được ký bằng một khoá đã nghỉ hưu", một sự kiện bình thường sau giai đoạn 4 và rất khác "sai chữ ký" — nghĩa là có người đang giả mạo token. Đặt tên khoá theo ngày (<code>k0929</code>) thì log cho bạn biết token bị từ chối cũ tới mức nào. <code>timingSafeEqual</code> so chữ ký trong thời gian cố định, để kẻ tấn công không đoán được chữ ký đúng từng byte một qua thời gian phản hồi.</p>
<h3>Bí mật nào xoay gọn, bí mật nào thì không</h3>
${slide('dv-04', 28, 'Bí mật nào xoay thế nào')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Mật khẩu cơ sở dữ liệu — xoay MỘT bước là xong</span><span class="lz-d">Chẳng có gì ngoài ứng dụng cầm nó cả. Tạo một người dùng thứ hai hoặc đổi mật khẩu, deploy giá trị mới, khởi động lại. Chỗ duy nhất phải cẩn thận là THỨ TỰ: với cú tráo xanh-lam ở Chương 3 thì cả hai phiên bản cùng chạy trong chốc lát, nên cơ sở dữ liệu phải chấp nhận CẢ HAI giá trị trong khoảng đó — mà thường nghĩa là thêm một người dùng thứ hai chứ không phải đổi một mật khẩu.</span></div>
  <div class="lz-step"><span class="lz-k">✓</span><span class="lz-t">Khoá API bên thứ ba — thường hỗ trợ hai khoá</span><span class="lz-d">Phần lớn nhà cung cấp cho bạn giữ hai khoá cùng sống chính là để xoay được. Cấp cái thứ hai, deploy, KIỂM rằng lưu lượng đang dùng nó, rồi mới thu hồi cái đầu. Kiểm TRƯỚC khi thu hồi — một job chạy nền mỗi đêm có thể vẫn đang cầm cái cũ.</span></div>
  <div class="lz-step"><span class="lz-k">⚠</span><span class="lz-t">Khoá ký — cần đủ bốn giai đoạn</span><span class="lz-d">Bí mật JWT, khoá cookie phiên, khoá ký URL. Bất cứ thứ gì mà cái bạn đã cấp trong QUÁ KHỨ phải còn kiểm chứng được trong TƯƠNG LAI.</span></div>
  <div class="lz-step"><span class="lz-k">✗</span><span class="lz-t">Khoá mã hoá dữ liệu nằm yên — khó nhất</span><span class="lz-d">Xoay khoá KHÔNG mã hoá lại dữ liệu. Bạn cần CẢ HAI khoá cho tới khi mọi dòng đã được mã hoá lại, mà đó là một cuộc migration chứ không phải một lần deploy. Hãy lưu một MÃ ĐỊNH DANH KHOÁ bên cạnh mỗi giá trị đã mã hoá để biết nó cần khoá nào.</span></div>
</div>

<h3>Đo thật: mật khẩu cơ sở dữ liệu — đổi thẳng, hay hai người dùng</h3>
${slide('dv-04', 26, 'Mật khẩu CSDL: thêm user mới, đừng đổi user cũ')}
<p>Bảng ở trên nói mật khẩu cơ sở dữ liệu xoay "một bước là xong", kèm một điều kiện về cửa sổ xanh-lam. Đây là điều kiện đó, đo thật trên PostgreSQL 16 trong container (giờ theo UTC). Trước tiên, một phiên được mở bằng mật khẩu cũ và giữ bận trong năm giây; được một giây thì mật khẩu bị đổi:</p>
<div class="out">════ 1) doi THANG mat khau cua user dang dung ════
  02:01:34 ALTER ROLE app_0801 PASSWORD 'mk-moi-…'
  02:01:34 ket noi MOI, mat khau cu:
  FATAL:  password authentication failed for user "app_0801"
  phien cu mo luc 02:01:33
  phien cu VAN chay luc 02:01:38

════ 2) HAI user: them app_0929, khoa app_0801 sau ════
  CREATE ROLE app_0929 LOGIN PASSWORD '…' IN ROLE datlich_rw
  app_0801 (ban dang chay):
  ghi duoc, id=1
  app_0929 (ban moi):
  ghi duoc, id=2
  ALTER ROLE app_0801 NOLOGIN      # sau khi ban cu da tat han
  app_0801:
  FATAL:  role "app_0801" is not permitted to log in
  app_0929:
2 dong trong lich</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Phiên đã mở SỐNG SÓT qua lần đổi mật khẩu</span><span class="v">Phiên mở lúc 02:01:33 chạy câu truy vấn tiếp theo lúc 02:01:38 bằng tín vật cũ. PostgreSQL kiểm mật khẩu lúc một kết nối được <em>MỞ</em>, và không bao giờ kiểm lại. Một pool đầy kết nối cũ vẫn chạy ngon — cho tới khi nó mở một kết nối mới.</span></div>
  <div class="kv"><span class="k">Kết nối MỚI bằng mật khẩu cũ hỏng ngay lập tức</span><span class="v">Trong lúc tráo xanh-lam, bản cũ vẫn đang chạy; lần đầu pool của nó nở ra, hay tiến trình của nó khởi động lại, là nó không kết nối được. Đó là một sự cố do CHÍNH việc xoay khoá gây ra.</span></div>
  <div class="kv"><span class="k">Hai người dùng, một bộ quyền</span><span class="v"><code>IN ROLE datlich_rw</code> cho vai trò đăng nhập mới đúng những quyền của vai trò nhóm, nên cả hai bản ghi được trong lúc chồng lấn. Deploy bản mới với <code>app_0929</code>, chờ tới khi bản cũ đã tắt hẳn, rồi <code>NOLOGIN</code> vai trò cũ.</span></div>
  <div class="kv"><span class="k">Muốn cắt những phiên còn sót</span><span class="v"><code>SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE usename = 'app_0801';</code> — cần làm nếu mật khẩu đã LỘ, vì chỉ đổi mật khẩu thì chẳng đuổi được ai ra.</span></div>
</div>
<h3>Một lần xoay khoá cũng là một lần deploy, nên nó ĐO ĐƯỢC</h3>
${slide('dv-04', 27, 'Kiểm lần xoay: token cũ PHẢI ra 401')}
<pre><code class="language-bash"><span class="tok-comment"># tien trinh dang chay CO THAT SU nhan khoa moi khong? (Bai 4.2)</span>
tr '\\0' '\\n' &lt; /proc/\$(pgrep -f 'node src/server.js')/environ \\
  | awk -F= '/^SIGNING_KEYS/{print "so khoa dang chap nhan:", split(\$2, a, ",")}'

<span class="tok-comment"># token cu CON dung khong? (phai HOP LE o giai doan 2 va 3)</span>
curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer \$TOKEN_CU" \\
  https://cuongthai.com/api/nguoi-dung/toi

<span class="tok-comment"># sau giai doan 4: no PHAI bi tu choi</span>
<span class="tok-comment"># mot cu 200 o day nghia la khoa cu VAN dang duoc chap nhan — chua xoay xong</span></code></pre>
<div class="note-ct">Phép kiểm cuối cùng đó là cái người ta hay bỏ qua, và nó là cái bắt được một lần xoay khoá LÀM DỞ. Một lần deploy giai đoạn 4 không thật sự ăn — một biến chưa cập nhật, một container chưa khởi động lại, một máy chủ thứ hai bị bỏ sót — sẽ để khoá cũ tiếp tục sống trong khi mọi người tin rằng nó đã bị thu hồi. Phép thử là một lệnh <code>curl</code> với một token bạn giữ lại từ trước lúc xoay, và đáp án mong đợi là <code>401</code>.</div>

<p>Đo bằng một máy chủ token nhỏ viết bằng Node trên Mac, khởi động lại với <code>SIGNING_KEYS</code> của từng giai đoạn, và một token giữ lại từ TRƯỚC lúc xoay. Lần chạy thứ ba giả lập một máy chủ thứ hai mà chẳng ai cập nhật:</p>
<div class="out"># lay token TRUOC khi xoay:
$ TOKEN_CU=$(curl -s localhost:19044/dang-nhap)
# giai doan 3: SIGNING_KEYS=k0929:…,k0801:…
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi
200
# giai doan 4: SIGNING_KEYS=k0929:…
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi
401
# giai doan 4, nhung MAY 2 bi sot: SIGNING_KEYS=k0929:…,k0801:…
$ curl -s -o /dev/null -w '%{http_code}\\n' -H "Authorization: Bearer $TOKEN_CU" localhost:19044/toi
200</div>
<p>Cùng một lệnh <code>curl</code> vừa là bằng chứng vừa là chuông báo: <code>401</code> sau giai đoạn 4 nghĩa là khoá cũ thật sự đã đi; một <code>200</code> trên BẤT KỲ máy nào nghĩa là lần xoay chưa xong, log deploy nói gì cũng mặc. Và trước khi xoay, hãy tìm theo <em>GIÁ TRỊ</em> — đo trên VPS thí nghiệm, nơi cùng một bí mật đã bị chép dưới ba cái tên:</p>
<div class="out">$ grep -rl JWT_SECRET /opt/datlich /home/deploy/bin          # tim theo TEN
/opt/datlich/.env
$ grep -rlF "$GIA_TRI_CU" /opt/datlich /home/deploy/bin       # tim theo GIA TRI
/opt/datlich/worker.env
/opt/datlich/.env
/home/deploy/bin/don-phien.sh</div>
<p>Tìm theo tên thấy một tệp; tìm theo giá trị thấy BA — tệp <code>.env</code> của một worker dưới tên <code>AUTH_SIGNING_KEY</code> và một script bảo trì viết thẳng giá trị vào. Chỉ xoay cái đầu thì hai cái kia vẫn xác thực bằng một khoá mà bạn tin là đã nghỉ hưu. Dùng <code>-F</code> (chuỗi cố định) để các ký tự trong bí mật không bị hiểu thành regex, và giữ giá trị trong một biến chứ đừng gõ thẳng vào dòng lệnh, nơi nó sẽ nằm lại trong lịch sử shell.</p>
<h3>Biến nó thành việc thường lệ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ghi ra mỗi bí mật là gì và xoay nó thế nào</span><span class="lz-lnote">Một dòng cho mỗi bí mật: nó dùng để làm gì, nó tới từ đâu, nó có hỗ trợ hai-cùng-lúc không, và giá trị cũ phải còn hiệu lực bao lâu. Thiếu nó thì mọi lần xoay khoá đều bắt đầu bằng một cuộc điều tra.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thiết kế theo dạng DANH SÁCH ngay từ ngày đầu</span><span class="lz-lnote"><code>JWT_SECRET</code> dạng danh sách ngăn bằng dấu phẩy chẳng tốn gì khi trong đó chỉ có một giá trị, và nó là khác biệt giữa một lần xoay bốn giai đoạn với một cú đăng xuất hàng loạt về sau. Chắp vá nó vào GIỮA một sự cố thì không phải lúc.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoay theo LỊCH, đừng chỉ xoay khi bị lộ</span><span class="lz-lnote">Một quy trình xoay bạn ĐÃ TỪNG làm là một quy trình bạn làm được dưới áp lực. Lần đầu tiên không nên là cái ngày nó bị lộ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giữ hạn sử dụng NGẮN hơn mức kiên nhẫn của bạn</span><span class="lz-lnote">Giai đoạn 4 chờ cái token sống lâu nhất. Phiên đăng nhập ba mươi ngày nghĩa là một cuộc xoay khoá ba mươi ngày. Đó là lý lẽ cho token truy cập NGẮN cộng refresh — mà khoá Authentication đi vào chuyện đó cho tử tế.</span></div>
</div>
<h3>Xoay một bí mật mà không gây gián đoạn</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chấp nhận cả hai, trong chốc lát</span><span class="lz-lnote">Bên xác minh tin cả khoá cũ lẫn khoá mới cùng lúc. Cái cửa sổ chồng lấn này chính là toàn bộ mẹo, và nó là thứ biến một lần xoay khoá từ một cú gián đoạn thành một lần deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ cấp phát bằng khoá mới</span><span class="lz-lnote">Phiên mới và chữ ký mới dùng khoá mới ngay từ lúc nó được triển khai. Chẳng còn thứ cũ nào được tạo ra nữa.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chờ hết cái tuổi thọ dài nhất</span><span class="lz-lnote">Mọi thứ ký bằng khoá cũ sẽ tự hết hạn theo lịch của nó. Cắt ngắn khoảng này chính là thứ đá văng người dùng ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rồi mới gỡ khoá cũ</span><span class="lz-lnote">Và xác nhận không có gì hỏng, vì giờ một token cũ sẽ hỏng to tiếng chứ không lặng lẽ tiếp tục chạy được.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — xoay một bí mật mà có thứ khác cũng đang giữ một bản sao của nó.</strong> Cửa sổ chồng lấn chỉ chạy được khi một bên xác minh sở hữu cái khoá. Nó chẳng giúp gì khi đúng bí mật đó còn được dán vào một biến CI, một dịch vụ thứ hai, một cron job và file <code>.env</code> của một đồng đội — xoay cái bạn biết thì những cái còn lại vẫn xác thực bằng một khoá mà bạn tin là đã nghỉ hưu, và lần dọn dẹp sau đó làm hỏng một thứ mà chẳng ai nối được với lần xoay khoá mấy tuần trước. Trước khi xoay, hãy grep cả hệ thống theo GIÁ TRỊ, đừng grep theo tên biến: cùng một bí mật thường được cất dưới ba cái tên khác nhau.</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ứng dụng SWP391 của nhóm ký phiên đăng nhập bằng một <code>JWT_SECRET</code> duy nhất, và giảng viên yêu cầu đổi khoá trước buổi demo — mà không được đăng xuất các thầy cô đang đăng nhập sẵn. Rồi mật khẩu cơ sở dữ liệu cũng phải đổi, trong lúc bản cũ và bản mới chạy song song một lúc.</p>
<ol>
<li>Viết (hoặc chép từ bài) một máy chủ token nhỏ đọc <code>SIGNING_KEYS</code> dạng cặp <code>kid:bí-mật</code>, ký bằng cặp đầu và kiểm theo <code>kid</code>. Cấp một token ở giai đoạn 1 và giữ nó trong <code>$TOKEN_CU</code>.</li>
<li>Khởi động lại qua giai đoạn 2, 3 và 4, mỗi lần chạy cùng một lệnh <code>curl -w '%{http_code}'</code>. Rồi chạy lại giai đoạn 4 nhưng "quên" gỡ khoá cũ, như thể sót một máy chủ thứ hai.</li>
<li>Trong một container PostgreSQL: mở một phiên dài bằng <code>app_0801</code>, đổi mật khẩu của nó giữa chừng, thử một kết nối mới bằng mật khẩu cũ. Rồi làm cho đúng với một vai trò thứ hai <code>IN ROLE datlich_rw</code> và <code>NOLOGIN</code>.</li>
<li>Chép một bí mật vào hai tệp dưới hai cái tên khác nhau và tìm ra mọi bản sao bằng <code>grep -rlF</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> token cũ cho <code>200</code> ở giai đoạn 1–3, <code>401</code> ở giai đoạn 4 và lại <code>200</code> trên "máy bị sót"; phiên dài sống sót qua lần đổi mật khẩu trong khi kết nối mới hỏng; và <code>grep -rlF</code> tìm ra mọi bản sao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Signing key (khoá ký)</span><span class="v">Bí mật dùng để ký token hay cookie; mọi thứ đã ký trong quá khứ phải còn kiểm được cho tới khi hết hạn.</span></div>
  <div class="kv"><span class="k">Key rotation (xoay khoá)</span><span class="v">Chuyển từ khoá này sang khoá khác mà không để hở một khoảng nào thứ hợp lệ bị từ chối hay khoá cũ vẫn dùng được.</span></div>
  <div class="kv"><span class="k">Overlap window (cửa sổ chồng lấn)</span><span class="v">Khoảng thời gian bên kiểm chấp nhận cả khoá cũ lẫn khoá mới — toàn bộ mẹo của việc xoay không gián đoạn.</span></div>
  <div class="kv"><span class="k"><code>kid</code> — key ID (mã định danh khoá)</span><span class="v">Trường trong header nêu tên khoá đã ký token, để bên kiểm tra cứu thay vì thử mọi khoá.</span></div>
  <div class="kv"><span class="k">JWKS (bộ khoá web JSON)</span><span class="v">JSON Web Key Set (RFC 7517): định dạng chuẩn để công bố một danh sách khoá định danh bằng <code>kid</code>.</span></div>
  <div class="kv"><span class="k">Grace period (thời gian ân hạn)</span><span class="v">Khoảng thời gian nhà cung cấp còn để khoá cũ chạy sau khi bạn cấp khoá mới — lý do phải THỬ rằng khoá cũ đã hỏng.</span></div>
  <div class="kv"><span class="k"><code>NOLOGIN</code> (cấm đăng nhập)</span><span class="v">Thuộc tính vai trò của PostgreSQL chặn kết nối mới mà không xoá vai trò hay quyền của nó.</span></div>
  <div class="kv"><span class="k"><code>pg_terminate_backend</code> (cắt phiên)</span><span class="v">Kết thúc một phiên PostgreSQL đang mở — bước mà chỉ đổi mật khẩu thì không làm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đổi khoá ký trong một bước là từ chối mọi token đã cấp; hãy ký bằng một khoá và chấp nhận cả danh sách, rồi xoay qua bốn lần deploy.</li>
<li>Chỉ giai đoạn 4 mới từ chối thứ gì, và nó phải chờ token sống lâu nhất hết hạn — trừ khi khoá đã LỘ, khi đó bạn CỐ Ý đăng xuất mọi người.</li>
<li><code>kid</code> trong token gọi tên khoá: việc kiểm thành một phép tra cứu, và "không biết kid" phân biệt được với chữ ký giả mạo.</li>
<li>Đổi mật khẩu PostgreSQL không kết thúc các phiên đang mở nhưng làm hỏng mọi phiên mới; hãy xoay bằng một vai trò thứ hai cùng nhóm và <code>NOLOGIN</code> vai trò cũ về sau.</li>
<li>Bằng chứng một lần xoay đã xong là <code>401</code> cho một token bạn giữ lại từ trước — trên MỌI máy.</li>
<li>Trước khi xoay, tìm mọi bản sao của bí mật theo GIÁ TRỊ bằng <code>grep -rlF</code>; cùng một bí mật hay nấp dưới nhiều cái tên.</li>
</ul>

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
      description: 'Mười câu tình huống: mật khẩu bị cắt ở dấu #, biến thêm giữa lúc deploy, NEXT_PUBLIC_* sau khi tạo lại container, --build-arg trong docker history, docker run --env-file giữ dấu nháy, .env trong lịch sử trước khi công khai kho, CI gitleaks xanh mà sót, đổi mật khẩu PostgreSQL giữa lúc tráo, token cũ vẫn 200 ở một máy, và --delete-excluded.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.6</span>
<h2>Quiz: configuration and secrets</h2>
<p class="lead">Ten situations taken from the chapter's lab — every output quoted in these questions was recorded on 29/09/2026 on an Ubuntu 24.04 lab VPS with systemd, Docker and Compose, Node 22, a real Next.js build, gitleaks and PostgreSQL 16. Most ask what a measurement means or which fix is right, because reading the process instead of the file is the skill this chapter builds.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Configuration in a shared directory survived a deploy, a value change and a rollback — and the rollback kept the <em>new</em> configuration, which is usually right and occasionally rolls you back into a version that cannot read it (4.1). Build-time and run-time are different moments: changing an environment variable and restarting updated the run-time read and left the build-time value untouched, because it is a string inside a file that was written weeks ago — which is why changing a <code>NEXT_PUBLIC_*</code> and restarting does nothing at all (4.2). One <code>.env</code> file parsed by <code>source</code> and by <code>node --env-file</code> disagreed on five of seven lines: an unquoted space made the shell try to run a command, a <code>#</code> silently truncated <code>mat#khau</code> to <code>mat</code> under Node, a <code>\\$</code> expanded to a home directory under the shell, and interpolation worked in one and not the other (4.3). A secret deleted from a repository printed out in full from history with one command, and the only response that matters is rotation, not rewriting (4.4). And a signing key changed in one step rejected a token issued a minute earlier — while a four-phase rotation, signing with one key and accepting a list, kept every token valid until the last phase (4.5).</p>
<p>The upgrade added measurements on top: <code>--delete-excluded</code> deleting the production <code>.env</code>, a variable appended mid-deploy that the container never saw, a real Next.js bundle still serving the old key after a restart, a build argument printed three times by <code>docker history</code>, the same nine-line file read five different ways by bash, systemd, Docker, Compose and Node, a teammate's old clone still holding a password after <code>filter-repo</code>, an open PostgreSQL session surviving a password change, and a missed server answering <code>200</code> to a token that should have been dead.</p>
</div>
<h3>Self-check before you start</h3>
<ul>
<li>I can keep production configuration outside the artifact, protect it from rsync, and explain why <code>restart</code> does not pick up a changed <code>.env</code> but <code>up -d</code> does.</li>
<li>I can tell a build-time value from a run-time value by grepping the bundle and reading <code>/proc/PID/environ</code>, and I know why a third-party key needs a backend route.</li>
<li>I can predict how bash, systemd, <code>docker run --env-file</code>, Compose and Node read a given line — including <code>#</code>, <code>$</code>, quotes, <code>export</code> and CRLF.</li>
<li>I can find a secret in git history with <code>git log -S</code> and <code>gitleaks git</code>, and I know which step comes first when one leaks.</li>
<li>I can rotate a signing key in four phases with a <code>kid</code>, and a database password with two roles, without logging anyone out or dropping connections.</li>
<li>I can prove a rotation finished: a token saved from before must return <code>401</code> on every machine.</li>
</ul>
${slide('dv-04', 30, 'Bảng tra nhanh Chương 4 (1/2): cấu hình')}
${slide('dv-04', 31, 'Bảng tra nhanh Chương 4 (2/2): bí mật')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.6</span>
<h2>Quiz: cấu hình và bí mật</h2>
<p class="lead">Mười tình huống lấy từ phòng thí nghiệm của chương — mọi output trích trong câu hỏi đều được ghi ngày 29/09/2026 trên một VPS thí nghiệm Ubuntu 24.04 có systemd, Docker và Compose, Node 22, một bản dựng Next.js thật, gitleaks và PostgreSQL 16. Phần lớn hỏi một phép đo nghĩa là gì hoặc cách sửa nào đúng, vì đọc TIẾN TRÌNH thay vì đọc TỆP chính là kỹ năng chương này xây cho bạn.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Cấu hình đặt ở thư mục dùng chung sống sót qua một lần deploy, một lần đổi giá trị và một cú lùi bản — và cú lùi bản giữ lại cấu hình MỚI, điều thường là đúng và thi thoảng thì lùi bạn vào một phiên bản KHÔNG ĐỌC NỔI nó (4.1). Lúc dựng và lúc chạy là hai thời điểm khác nhau: đổi một biến môi trường rồi khởi động lại thì cập nhật được giá trị đọc-lúc-chạy và KHÔNG đụng tới giá trị nướng-lúc-dựng, vì nó là một chuỗi nằm trong một tệp viết ra từ mấy tuần trước — và đó là lý do đổi một <code>NEXT_PUBLIC_*</code> rồi restart thì tuyệt đối chẳng có gì xảy ra (4.2). Một tệp <code>.env</code> đưa qua <code>source</code> và qua <code>node --env-file</code> cho kết quả khác nhau ở NĂM trên bảy dòng: một dấu cách không bọc ngoặc làm shell đi CHẠY một lệnh, một dấu <code>#</code> lặng lẽ cắt <code>mat#khau</code> thành <code>mat</code> dưới Node, một dấu <code>\\$</code> bung thành đường dẫn thư mục nhà dưới shell, và nối chuỗi chạy ở bên này mà không chạy ở bên kia (4.3). Một bí mật đã xoá khỏi kho mã vẫn in ra NGUYÊN VẸN từ lịch sử bằng một lệnh, và phản ứng duy nhất có ý nghĩa là XOAY KHOÁ chứ không phải viết lại lịch sử (4.4). Và một khoá ký đổi trong một bước đã từ chối một token cấp cách đó một phút — trong khi cách xoay bốn giai đoạn, ký bằng một khoá và chấp nhận cả danh sách, giữ cho mọi token còn hiệu lực cho tới tận giai đoạn cuối (4.5).</p>
<p>Bản nâng cấp đo thêm: <code>--delete-excluded</code> xoá mất <code>.env</code> production, một biến thêm vào giữa lúc deploy mà container không bao giờ thấy, một gói Next.js thật vẫn phục vụ khoá cũ sau khi restart, một tham số dựng bị <code>docker history</code> in ra ba lần, cùng một tệp chín dòng bị bash, systemd, Docker, Compose và Node đọc theo năm cách, bản clone cũ của bạn cùng nhóm vẫn giữ mật khẩu sau <code>filter-repo</code>, một phiên PostgreSQL đang mở sống sót qua lần đổi mật khẩu, và một máy bị sót trả <code>200</code> cho một token lẽ ra đã chết.</p>
</div>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giữ được cấu hình production ngoài tạo tác, bảo vệ nó khỏi rsync, và giải thích được vì sao <code>restart</code> không nhận <code>.env</code> đã đổi còn <code>up -d</code> thì có.</li>
<li>Tôi phân biệt được giá trị lúc dựng với giá trị lúc chạy bằng cách grep gói và đọc <code>/proc/PID/environ</code>, và biết vì sao khoá bên thứ ba cần một tuyến backend.</li>
<li>Tôi đoán được bash, systemd, <code>docker run --env-file</code>, Compose và Node đọc một dòng cho trước ra sao — kể cả <code>#</code>, <code>$</code>, dấu nháy, <code>export</code> và CRLF.</li>
<li>Tôi tìm được bí mật trong lịch sử git bằng <code>git log -S</code> và <code>gitleaks git</code>, và biết bước nào làm TRƯỚC khi một bí mật bị lộ.</li>
<li>Tôi xoay được một khoá ký qua bốn giai đoạn có <code>kid</code>, và một mật khẩu cơ sở dữ liệu bằng hai vai trò, mà không đăng xuất ai hay làm rơi kết nối.</li>
<li>Tôi chứng minh được một lần xoay đã xong: token giữ lại từ trước phải trả <code>401</code> trên MỌI máy.</li>
</ul>
${slide('dv-04', 30, 'Bảng tra nhanh Chương 4 (1/2): cấu hình')}
${slide('dv-04', 31, 'Bảng tra nhanh Chương 4 (2/2): bí mật')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'The backend starts with node --env-file=.env and the file has DB_PASS=Xk9#pL2m, unquoted. PostgreSQL rejects the login; reading /proc/PID/environ, the length of DB_PASS is 3. What happened?|||Backend khởi động bằng node --env-file=.env và tệp có DB_PASS=Xk9#pL2m, không bọc nháy. PostgreSQL từ chối đăng nhập; đọc /proc/PID/environ thì độ dài DB_PASS là 3. Chuyện gì đã xảy ra?',
            options: [
              'PostgreSQL truncates passwords longer than 8 characters|||PostgreSQL cắt bớt mật khẩu dài hơn 8 ký tự',
              'The file was saved with CRLF, so the value carries an extra carriage-return (CR) byte|||Tệp được lưu với CRLF nên giá trị mang thêm một ký tự CR (về đầu dòng)',
              'Node treated # as the start of a comment, so the value became Xk9 — quote it or use a hex secret|||Node coi # là bắt đầu chú thích nên giá trị thành Xk9 — bọc nháy kép hoặc dùng bí mật dạng hex',
              'bash expanded $pL2m to an empty string|||bash bung $pL2m thành chuỗi rỗng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Length 3 is exactly "Xk9": node --env-file ends an unquoted value at #, measured in this chapter (mat#khau became mat). CRLF is the tempting answer but it ADDS a character (8 in the measurement), it never removes five; and bash is not involved when Node reads the file itself.|||VI: Độ dài 3 đúng bằng "Xk9": node --env-file kết thúc giá trị không nháy ở dấu #, đo trong chương (mat#khau thành mat). CRLF là đáp án hấp dẫn nhưng nó THÊM một ký tự (đo được 8), không bao giờ bớt năm; còn bash chẳng dính gì khi chính Node đọc tệp.',
          },
          {
            question: 'While a deploy is still building images, you append GIPHY_API_KEY to /opt/datlich/.env. The deploy finishes green, but docker exec … printenv GIPHY_API_KEY is empty, and docker compose restart does not change that. What fixes it?|||Trong lúc một lần deploy còn đang dựng ảnh, bạn thêm GIPHY_API_KEY vào /opt/datlich/.env. Deploy xong xanh, nhưng docker exec … printenv GIPHY_API_KEY rỗng, và docker compose restart không đổi được gì. Cách nào sửa được?',
            options: [
              'Load the file again and run docker compose up -d --no-build for that service, so the container is recreated with the new environment|||Nạp lại tệp rồi chạy docker compose up -d --no-build cho đúng dịch vụ đó, để container được tạo lại với môi trường mới',
              'Run docker compose restart once more after a few seconds, so Docker rereads the file|||Chạy docker compose restart thêm lần nữa sau vài giây, để Docker đọc lại tệp',
              'Rebuild the image with --build-arg GIPHY_API_KEY so the key is inside it|||Dựng lại ảnh với --build-arg GIPHY_API_KEY để khoá nằm bên trong ảnh',
              'Nothing — the variable appears on its own at the next request|||Không cần gì — biến sẽ tự xuất hiện ở request kế tiếp',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The deploy loaded the file at its start, before your edit, and a container keeps the environment it was created with; restart reuses that container (measured: still []). Recreating it with the file reloaded gave [xxxx12345]. Baking the key into the image would publish it in docker history.|||VI: Lần deploy đã nạp tệp từ lúc bắt đầu, trước khi bạn sửa, và container giữ môi trường của lúc nó được tạo; restart dùng lại đúng container đó (đo: vẫn []). Tạo lại nó sau khi nạp lại tệp cho ra [xxxx12345]. Nướng khoá vào ảnh thì lại công bố nó trong docker history.',
          },
          {
            question: 'You change NEXT_PUBLIC_API_URL in the server .env and recreate the frontend container. printenv inside the container shows the new value, yet every browser still calls the old URL. Why?|||Bạn đổi NEXT_PUBLIC_API_URL trong .env trên máy chủ và tạo lại container frontend. printenv trong container hiện giá trị mới, vậy mà mọi trình duyệt vẫn gọi URL cũ. Vì sao?',
            options: [
              'The container was not really recreated|||Container thật ra chưa được tạo lại',
              'Browsers cached the old JavaScript; a hard refresh fixes it|||Trình duyệt lưu đệm JavaScript cũ; tải lại cứng là xong',
              'nginx is caching the API responses|||nginx đang lưu đệm các phản hồi API',
              'The value was inlined into the JavaScript bundle at build time; only rebuilding with the new value changes it|||Giá trị đã được nướng vào gói JavaScript lúc dựng; chỉ dựng lại với giá trị mới mới đổi được',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: printenv proves the container has the new value, so it was recreated — but the browser never reads that environment: the build replaced process.env.NEXT_PUBLIC_API_URL with a string. Measured: after a restart with a new key the served page chunk still contained khoa-CU-12345. A cache is unlikely: the same file name was served fresh, and only a rebuild changed its name and content.|||VI: printenv chứng minh container có giá trị mới, tức là nó đã được tạo lại — nhưng trình duyệt không bao giờ đọc môi trường đó: bản dựng đã thay process.env.NEXT_PUBLIC_API_URL bằng một chuỗi. Đo thật: restart với khoá mới thì chunk của trang vẫn chứa khoa-CU-12345. Đổ cho cache là khó đứng: chính tệp đó được phục vụ mới, và chỉ lần dựng lại mới đổi tên lẫn nội dung của nó.',
          },
          {
            question: 'A Dockerfile needs NPM_TOKEN to install a private package. A teammate proposes ARG NPM_TOKEN plus docker build --build-arg NPM_TOKEN=… . What is the problem?|||Một Dockerfile cần NPM_TOKEN để cài một gói riêng tư. Một bạn cùng nhóm đề xuất ARG NPM_TOKEN cộng docker build --build-arg NPM_TOKEN=… . Vấn đề là gì?',
            options: [
              'None — build args disappear once the image is built|||Không có — tham số dựng biến mất khi ảnh dựng xong',
              'The value is recorded in the image history, readable by anyone who can pull the image; use RUN --mount=type=secret instead|||Giá trị bị ghi vào lịch sử ảnh, ai kéo được ảnh là đọc được; hãy dùng RUN --mount=type=secret',
              'ARG only works if it is also declared as ENV|||ARG chỉ chạy khi được khai báo thêm bằng ENV',
              'Build args cannot contain letters and digits together|||Tham số dựng không được chứa cả chữ lẫn số',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured: docker history --no-trunc printed NPM_TOKEN=xxxx12345-bi-mat-that on three lines, including every RUN that executed while it was set. The secret mounted with --mount=type=secret was readable by its step (22 bytes) and appeared nowhere in the image. "It disappears after the build" is true of the variable in later containers, not of the history.|||VI: Đo thật: docker history --no-trunc in ra NPM_TOKEN=xxxx12345-bi-mat-that trên ba dòng, kể cả mọi RUN chạy trong lúc nó được đặt. Bí mật gắn bằng --mount=type=secret thì bước dựng đọc được (22 byte) mà không xuất hiện ở đâu trong ảnh. "Nó biến mất sau khi dựng" đúng với biến trong các container về sau, không đúng với lịch sử.',
          },
          {
            question: 'A .env works under docker compose up (env_file:). During an incident you run docker run --env-file .env app: first it refuses the file because of a line export NODE_ENV=production; after deleting that line it starts, but authentication with DB_PASS="abc123" fails. Why?|||Một tệp .env chạy ngon với docker compose up (env_file:). Giữa sự cố bạn chạy docker run --env-file .env app: đầu tiên nó từ chối cả tệp vì một dòng export NODE_ENV=production; xoá dòng đó thì nó khởi động, nhưng xác thực với DB_PASS="abc123" hỏng. Vì sao?',
            options: [
              'Compose and docker run send different database hosts|||Compose và docker run gửi tới hai máy chủ cơ sở dữ liệu khác nhau',
              'docker run does not read --env-file at all|||docker run hoàn toàn không đọc --env-file',
              'docker run --env-file keeps the quotes, so the password it passes is "abc123" including the quote characters|||docker run --env-file giữ nguyên dấu nháy, nên mật khẩu nó truyền đi là "abc123" TÍNH CẢ hai dấu nháy',
              'The file has CRLF line endings|||Tệp có kiểu xuống dòng CRLF',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Compose env_file: and docker run --env-file are different parsers. Measured: docker run kept ["co  hai khoang"] with quotes and rejected the whole file on the export line, while Compose stripped quotes and accepted export. CRLF is plausible but Docker stripped the trailing carriage return in the measurement.|||VI: env_file: của Compose và docker run --env-file là hai bộ phân tích khác nhau. Đo thật: docker run giữ ["co  hai khoang"] còn nguyên nháy và từ chối cả tệp vì dòng export, trong khi Compose gỡ nháy và chấp nhận export. CRLF nghe hợp lý nhưng trong phép đo Docker đã gỡ ký tự CR ở cuối.',
          },
          {
            question: 'Your SWP391 repository had .env committed in week 2 and removed in week 3. Tomorrow it becomes public for the final presentation. What must happen first?|||Kho SWP391 của nhóm bị commit .env ở tuần 2 và gỡ ở tuần 3. Ngày mai kho chuyển sang công khai cho buổi thuyết trình cuối kỳ. Việc gì phải làm TRƯỚC TIÊN?',
            options: [
              'Rotate every credential that was in the file at its provider, and verify the old values are rejected|||Xoay mọi tín vật từng có trong tệp ở phía nhà cung cấp, và kiểm rằng giá trị cũ đã bị từ chối',
              'Run git filter-repo to remove .env from history, then force-push|||Chạy git filter-repo gỡ .env khỏi lịch sử rồi force-push',
              'Add .env to .gitignore|||Thêm .env vào .gitignore',
              'Run gitleaks dir . and publish if it reports no leaks|||Chạy gitleaks dir . và công khai nếu nó báo không rò rỉ',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A leaked secret stops being dangerous when it stops working, not when it stops being visible. Measured: after filter-repo, a teammate clone made earlier still printed the password with one git show. Rewriting is worth doing afterwards. gitleaks dir scans only the working tree and reported "no leaks" on a repository whose history still held the secret.|||VI: Bí mật lộ hết nguy hiểm khi nó hết HIỆU LỰC, không phải khi nó hết nhìn thấy. Đo thật: sau filter-repo, bản clone làm từ trước của bạn cùng nhóm vẫn in ra mật khẩu bằng một lệnh git show. Viết lại lịch sử đáng làm, nhưng SAU. gitleaks dir chỉ quét cây làm việc và báo "không rò rỉ" trên một kho mà lịch sử vẫn còn bí mật.',
          },
          {
            question: 'A CI job runs gitleaks git on every push and is always green, yet git log -p -S finds a database password committed three months ago. What is the most likely explanation?|||Một job CI chạy gitleaks git ở mỗi lần push và luôn xanh, vậy mà git log -p -S tìm ra một mật khẩu cơ sở dữ liệu commit từ ba tháng trước. Lời giải thích khả dĩ nhất là gì?',
            options: [
              'gitleaks only finds secrets when --redact is set|||gitleaks chỉ tìm ra bí mật khi có --redact',
              'gitleaks git only scans the working tree|||gitleaks git chỉ quét cây làm việc',
              'Deleted secrets are not counted by any scanner|||Bí mật đã bị xoá thì không máy quét nào tính',
              'The checkout fetched only the latest commit (no fetch-depth: 0), and a password inside a URL matches no default rule anyway|||Bước checkout chỉ lấy commit mới nhất (thiếu fetch-depth: 0), mà mật khẩu nằm trong URL thì vốn cũng không khớp luật mặc định nào',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: gitleaks git does walk history — measured, it found a JWT_SECRET in an old commit — but only the history it is given; the checkout action fetches one commit by default. And the same measurement shows the second blind spot: postgres://app:MatKhauThatSu123@… was not reported. --redact only hides values in the output.|||VI: gitleaks git CÓ đi qua lịch sử — đo thật, nó tìm ra JWT_SECRET trong một commit cũ — nhưng chỉ phần lịch sử được đưa cho nó; action checkout mặc định chỉ lấy một commit. Và cùng phép đo cho thấy điểm mù thứ hai: postgres://app:MatKhauThatSu123@… không bị báo. --redact chỉ che giá trị trong output.',
          },
          {
            question: 'During a blue-green deploy you run ALTER ROLE app PASSWORD for the new value and start green with it. Twenty minutes later the still-running blue opens new pool connections and every request fails with password authentication failed. How should the rotation have been done?|||Trong một lần deploy xanh-lam, bạn chạy ALTER ROLE app PASSWORD sang giá trị mới và khởi động bản xanh với nó. Hai mươi phút sau bản lam vẫn đang chạy mở thêm kết nối trong pool và mọi request hỏng với password authentication failed. Lẽ ra phải xoay thế nào?',
            options: [
              'Change the password back, since PostgreSQL cannot rotate without downtime|||Đổi mật khẩu về như cũ, vì PostgreSQL không xoay được mà không gián đoạn',
              'Create a second login role in the same group role for green, and set NOLOGIN on the old role only after blue is gone|||Tạo một vai trò đăng nhập thứ hai cùng vai trò nhóm cho bản xanh, và chỉ NOLOGIN vai trò cũ sau khi bản lam đã tắt',
              'Terminate all of blue sessions with pg_terminate_backend right after the change|||Cắt mọi phiên của bản lam bằng pg_terminate_backend ngay sau khi đổi',
              'Increase the pool size so blue never needs a new connection|||Tăng kích thước pool để bản lam không bao giờ cần kết nối mới',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured: an open session kept working after the password change, but a new connection with the old password failed at once — exactly what hit blue when its pool grew. Two roles IN ROLE datlich_rw both wrote rows during the overlap; NOLOGIN then blocked the old one. Terminating sessions makes the outage immediate instead of delayed.|||VI: Đo thật: một phiên đang mở vẫn chạy sau khi đổi mật khẩu, nhưng kết nối mới bằng mật khẩu cũ hỏng ngay — đúng thứ đã đánh vào bản lam khi pool nở ra. Hai vai trò IN ROLE datlich_rw đều ghi được dữ liệu trong lúc chồng lấn; sau đó NOLOGIN chặn vai trò cũ. Cắt phiên chỉ làm sự cố xảy ra ngay thay vì xảy ra sau.',
          },
          {
            question: 'After phase 4 of a signing-key rotation, curl with a token you saved before the rotation returns 401 on server 1 and 200 on server 2. What does that mean?|||Sau giai đoạn 4 của một lần xoay khoá ký, curl với một token bạn giữ lại từ trước lúc xoay trả 401 ở máy 1 và 200 ở máy 2. Điều đó nghĩa là gì?',
            options: [
              'Server 2 still has the old key in SIGNING_KEYS — the rotation is not finished until it also returns 401|||Máy 2 vẫn còn khoá cũ trong SIGNING_KEYS — lần xoay chưa xong cho tới khi nó cũng trả 401',
              'nginx on server 2 is caching the 200 response|||nginx trên máy 2 đang lưu đệm phản hồi 200',
              'Server 1 is broken and should be rolled back|||Máy 1 bị hỏng và cần lùi bản',
              'This is the normal grace period and resolves itself|||Đây là thời gian ân hạn bình thường và sẽ tự hết',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The same curl is the proof and the alarm: measured, the phase-4 server returned 401 and a "missed" server still carrying k0801 returned 200. There is no grace period in your own verifier — only what is in its key list. A 200 anywhere means an attacker holding the old key still gets in there.|||VI: Cùng một lệnh curl vừa là bằng chứng vừa là chuông báo: đo thật, máy ở giai đoạn 4 trả 401 còn một máy "bị sót" vẫn mang k0801 trả 200. Bên kiểm của chính bạn không có thời gian ân hạn nào — chỉ có thứ nằm trong danh sách khoá của nó. Một 200 ở bất cứ đâu nghĩa là kẻ cầm khoá cũ vẫn vào được máy đó.',
          },
          {
            question: 'A deploy script runs rsync -a --delete --delete-excluded --exclude=.env* ./ vps:/opt/app/repo/. After the deploy the app will not start: DATABASE_URL is missing. Why?|||Một script deploy chạy rsync -a --delete --delete-excluded --exclude=.env* ./ vps:/opt/app/repo/. Sau lần deploy ứng dụng không khởi động nổi: thiếu DATABASE_URL. Vì sao?',
            options: [
              'The pattern must be written .env, not .env*|||Mẫu phải viết là .env, không phải .env*',
              'rsync copied the laptop .env over the server one|||rsync đã chép .env của laptop đè lên tệp của máy chủ',
              '--delete-excluded deletes on the server everything that was excluded, including the production .env|||--delete-excluded xoá trên máy chủ mọi thứ bị loại trừ, kể cả tệp .env production',
              '--delete ignores --exclude|||--delete phớt lờ --exclude',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: with --exclude alone, --delete left the server .env untouched; adding --delete-excluded removed it (the directory listing became ". .. src"). The laptop file was not sent at all, so it cannot have overwritten anything. The robust layout also keeps the production file outside the synced directory, at /opt/app/.env.|||VI: Đo thật: chỉ có --exclude thì --delete để yên .env trên máy chủ; thêm --delete-excluded là nó bị xoá (danh sách thư mục còn ". .. src"). Tệp của laptop hoàn toàn không được gửi đi, nên không thể ghi đè gì. Bố cục vững hơn là để tệp production NGOÀI thư mục được đồng bộ, ở /opt/app/.env.',
          },
        ],
      },
    },
  ],
};
