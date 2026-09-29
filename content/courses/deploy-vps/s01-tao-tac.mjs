/**
 * Deploy lên VPS — Chương 1: Tạo tác.
 * Nâng cấp 29/09/2026: bài 1.0 slide (deck dv-01, 32 slide) + slide/🧪/🗂/📌 trong 1.1–1.5; đào sâu: bốn công cụ
 * đóng gói đo lại trên VPS thí nghiệm (tar --exclude-vcs-ignores giữ node_modules/, rsync --exclude-from gửi
 * .env.production, .dockerignore), macOS/Windows (du -I, openrsync, bsdtar), gzip của Apple ghi MTIME cả từ ống dẫn
 * (đính chính), SOURCE_DATE_EPOCH + bảng cờ tar, cùng sha256 Mac/Ubuntu, core.autocrlf → CRLF, esbuild chép từ Mac,
 * npm ci hai lần + bảng cờ, chốt phiên bản Node (apt = v18), set -e ca C, lùi bản quên restart + /version,
 * git describe --dirty, --link-dest và mtime, dọn theo chỗ trống, cache build 7,6 GB, tạo tác là ảnh (→ Ch13);
 * quiz 10 câu viết lại. Output MỚI chạy thật trong container ubuntu:24.04 (dv01-vps) và trên Mac M1 (macOS 27).
 * LUẬT: backtick → &#96;; ${ của bash → \${; < > & trong code → &lt; &gt; &amp;; gạch chéo ngược viết đôi.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 1 — The artifact: deciding exactly what ships|||Chương 1 — Tạo tác: quyết định chính xác thứ gì được gửi đi',
  description: 'Bước 1 là bước người ta bỏ qua, và bỏ qua nó là cách bí mật, tệp người dùng tải lên và một bản sửa dở lên tới production. Chương này đo xem một cây làm việc thật chứa những gì, dựng một tạo tác tái lập được tới từng byte, và đặt tên cho nó sao cho nhìn vào máy chủ là biết đang chạy cái gì.',
  lessons: [

    /* ─────────────────────────── 1.0 ─────────────────────────── */
    {
      title: '1.0 — Chapter 1 slides: the artifact in pictures|||1.0 — Slide Chương 1: tạo tác bằng hình',
      slug: 'deploy-1-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 1: cây làm việc → tạo tác, bốn file loại trừ, git archive tái lập tới từng byte, byte MTIME của gzip, SOURCE_DATE_EPOCH, npm ci và nền tảng, set -e, tên bản UTC + commit, /version, liên kết cứng, dọn bản cũ và chuyện đĩa đầy vì cache build 7,6 GB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: a working tree split into what ships, what is rebuilt and what stays on the server; four exclusion files that each follow different rules; the ten header bytes of a gzip file and the four of them that hold a timestamp; two <code>npm ci</code> runs hashed file by file; a release name taken apart; a rollback that the <code>/version</code> endpoint catches; and a disk filled by 7.6 GB of build cache.</p>
<p>Slides 3–7 belong to Lesson 1.1, 8–13 to 1.2, 14–18 to 1.3, 19–22 to 1.4 and 23–28 to 1.5 (including how the same ideas look when the artifact is a container image — the subject of Chapter 13). The last four are the chapter's common mistakes, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 29/09/2026 — on a "lab VPS" (an Ubuntu 24.04 container running sshd that the Mac reaches over SSH, exactly like a rented server) and on a Mac M1, where Apple's own <code>gzip</code>, <code>tar</code> and <code>du</code> behave differently from Linux in ways that change the result.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: một cây làm việc tách thành phần ĐI, phần DỰNG LẠI và phần Ở LẠI trên máy chủ; bốn file loại trừ, mỗi file một luật; mười byte đầu của một tệp gzip và bốn byte trong đó chứa GIỜ; hai lần <code>npm ci</code> được băm tới từng tệp; một cái tên bản phát hành được cắt nghĩa; một cú lùi bản bị endpoint <code>/version</code> bắt quả tang; và một cái đĩa bị 7,6 GB cache build làm đầy.</p>
<p>Slide 3–7 thuộc Bài 1.1, 8–13 thuộc 1.2, 14–18 thuộc 1.3, 19–22 thuộc 1.4 và 23–28 thuộc 1.5 (gồm cả việc những ý đó trông thế nào khi tạo tác là một ảnh container — chủ đề của Chương 13). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 29/09/2026 — trên một "VPS thí nghiệm" (container Ubuntu 24.04 chạy sshd mà máy Mac SSH vào y như một máy chủ thuê thật) và trên Mac M1, nơi <code>gzip</code>, <code>tar</code> và <code>du</code> của Apple cư xử khác Linux theo những cách làm đổi cả kết quả.</p>
</div>
${gallery('dv-01', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Cây làm việc → tạo tác'], [4, 'Gói ngây thơ chở theo mật khẩu'], [5, 'Phép thử: xoá thì có mất gì?'],
  [6, 'Bốn file loại trừ, bốn luật'], [7, 'Kiểm kê 5 phút: ?? và !!'],
  [8, 'git archive: bắt đầu từ số không'], [9, 'Cùng commit, Mac và Ubuntu: cùng sha256'], [10, 'Byte 5–8 của gzip là GIỜ'],
  [11, 'tar thường và SOURCE_DATE_EPOCH'], [12, 'Bảng cờ tar tái lập — bsdtar không có'], [13, 'Script đóng gói từ chối cây bẩn'],
  [14, 'npm ci từ chối, npm install tự sửa'], [15, 'node_modules từ Mac chết trên Linux'], [16, 'Hai lần npm ci: cùng một cây'],
  [17, 'set -e tắt trong || và &&'], [18, 'Dựng ở đâu: khớp nền tảng'],
  [19, 'Tên bản: UTC + commit'], [20, 'Tệp phiên bản gọi tên commit cha'], [21, 'Đóng dấu lúc dựng, hỏi /version'], [22, 'Trỏ symlink ≠ đang chạy bản đó'],
  [23, 'Liên kết cứng: 30 MB thay vì 158 MB'], [24, 'cp ghi tại chỗ, mv thay mục'], [25, '--link-dest và mtime'], [26, 'Dọn theo số lượng, chừa bản đang chạy'],
  [27, 'Đĩa đầy thật: cache build 7,6 GB'], [28, 'Tarball hay ảnh container'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 1'],
])}
`,
    },

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
${slide('dv-01', 3, 'Cây làm việc → tạo tác: cái gì đi, cái gì ở lại')}
${slide('dv-01', 4, 'Gói ngây thơ chở theo mật khẩu và rác (đo lại 29/09)')}
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
${slide('dv-01', 5, 'Phép thử: xoá trên máy chủ thì có mất gì?')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Source — committed, and it ships</span><span class="lz-lnote">Your code, templates, migrations, package manifests and lockfiles. This is the artifact. Everything else on this list is not.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Derived — rebuilt, never copied</span><span class="lz-lnote"><code>node_modules</code>, <code>dist</code>, <code>.next</code>, compiled assets. Produced <em>from</em> source by a build step that must run on the target platform. Lesson 1.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Runtime state — lives on the server, deploy must not touch it</span><span class="lz-lnote">Uploads, logs, caches, a SQLite file. It belongs outside the release directory entirely, in the <code>chung/</code> directory from Lesson 0.4, symlinked in.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Configuration — server-side, and never in the artifact</span><span class="lz-lnote"><code>.env</code>, certificates, keys. Same destination as runtime state and for a stronger reason. Chapter 4.</span></div>
</div>
<div class="callout ok"><strong>The test is a question, not a list.</strong> For each path: <em>if this were deleted on the server, would I lose anything?</em> Source — no, it comes from git. Derived — no, rebuild it. Runtime state — <strong>yes</strong>, it is gone forever. Configuration — <strong>yes</strong>, and the site stops. Anything you answered "yes" for must not be inside the thing a deploy overwrites.</div>

<h3>Two exclusion lists that are not the same list</h3>
${slide('dv-01', 6, 'Bốn file loại trừ, bốn luật khác nhau')}
<p>A common mistake is to assume <code>.gitignore</code> protects the deploy. It does not — it governs what git tracks, and a raw <code>rsync</code> or <code>tar</code> never consults it. Something ignored by git is exactly the kind of thing most dangerous to ship, because nobody has ever reviewed it.</p>
<pre><code class="language-bash"><span class="tok-comment"># .gitignore — cai gi KHONG vao kho ma</span>
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
${slide('dv-01', 7, 'Kiểm kê 5 phút: ?? chưa theo dõi, !! bị bỏ qua')}
<pre><code class="language-bash"><span class="tok-comment"># 1. Cai gi to nhat trong cay lam viec?</span>
du -sh --exclude=.git . &amp;&amp; du -sh */ | sort -rh | head -10

<span class="tok-comment"># 2. Nhung tep nao KHONG duoc git theo doi? (day la danh sach dang ngo)</span>
git status --porcelain --ignored | grep '^!!'

<span class="tok-comment"># 3. Co bi mat nao trong cay khong?</span>
find . -name '.env*' -not -path './.git/*'

<span class="tok-comment"># 4. Tao tac se trong nhu the nao?</span>
git archive --format=tar HEAD | tar t | head -20</code></pre>
<div class="note-ct">Step 2 is the one that finds surprises. <code>git status --porcelain --ignored</code> lists everything git is deliberately not looking at, which is precisely the set nobody reviews — old branches of a build directory, a database dump from a debugging session, a <code>.env.old</code> from a migration two years ago. Run it once on a project you have had for a while; the output is usually longer than expected.</div>
<h3>Run it yourself: four tools, four different answers</h3>
<p>The numbers at the top of this lesson come from the chapter's original test project. Rebuilt on the lab VPS on 29/09/2026 — an Ubuntu 24.04 container with sshd that the Mac reaches over SSH, GNU tar 1.35, rsync 3.2.7 — with one realistic mistake added: a <code>.env.production</code> created last week that nobody put in <code>.gitignore</code>. Four ways of packaging the same directory:</p>
<pre><code class="language-bash">tar czf /tmp/tho.tgz .                                   # the whole tree
tar czf /tmp/ex.tgz --exclude=.git --exclude=node_modules --exclude=.env \\
    --exclude=tai-len --exclude=logs --exclude=dist .     # a hand-written list
tar czf /tmp/vcs.tgz --exclude-vcs --exclude-vcs-ignores .  # "let tar read .gitignore"
git archive --format=tar.gz HEAD &gt; /tmp/ga.tgz            # only what is committed</code></pre>
<div class="out">tho    5.0M   1012 muc  ./.env ./.env.production ./src/server.js.orig
ex      12K     27 muc  ./.env.production ./src/server.js.orig
vcs    5.0M    924 muc  ./.env.production ./src/server.js.orig
ga      12K     24 muc</div>
<p>The hand-written list remembered <code>.env</code> and shipped <code>.env.production</code> — it only blocks what somebody named. The surprise is the third line: GNU tar's <code>--exclude-vcs-ignores</code> promises to honour <code>.gitignore</code>, yet the archive is still 5 MB. Counting entries by top-level directory shows why:</p>
<div class="out">$ tar tzf /tmp/vcs.tgz | cut -d/ -f2 | sort | uniq -c | sort -rn | head -4
    892 node_modules
     15 src
      3 .github
      2 tests</div>
<p>It dropped <code>.env</code> (a plain name) but kept all 892 entries of <code>node_modules/</code>, <code>dist/</code>, <code>logs/</code> and <code>tai-len/</code> — every pattern written with a trailing slash. tar reads the file with its own pattern rules, and a directory pattern in git syntax is not a directory pattern in tar syntax. rsync did better with the same file:</p>
<div class="out">$ rsync -an --out-format="%n" --exclude-from=.gitignore --exclude=.git ./ /tmp/dich/ \\
    | grep -vE "^(src|tests|docs|\\.github)/"
./
.env.production
.gitignore
package-lock.json
package.json</div>
<p>Every gitignore pattern matched — and <code>.env.production</code> still went, because it is not <em>in</em> <code>.gitignore</code>. Reusing the ignore file removes the "two lists drift apart" problem; it does not remove the "nobody listed it" problem. Only <code>git archive</code> answers both, because an uncommitted file is absent by construction.</p>
<p>The fourth file is <code>.dockerignore</code>, and it matters the moment the artifact becomes an image (Chapter 13). Measured on the Mac with Docker Desktop, the same project copied into a throwaway image with <code>COPY . /app</code>:</p>
<div class="out">── without .dockerignore ──
#5 transferring context: 25.12MB 0.4s done
#7 0.144 27M	/app
#7 0.145 . .. .env .env.production .git .github .gitignore dist docs logs node_modules …
── with .dockerignore:  .git  node_modules  dist  logs  tai-len  .env*  *.orig ──
#7 0.123 132K	/app
#7 0.124 . .. .dockerignore .github .gitignore docs package-lock.json package.json src tests</div>
<div class="pitfall co-tieu-de"><strong>Trap — <code>.gitignore</code> does nothing for <code>docker build</code>.</strong> Without a <code>.dockerignore</code> the whole directory — both <code>.env</code> files and <code>.git</code> included — is sent to the builder and <code>COPY . /app</code> bakes it into a layer. Deleting the file in a later <code>RUN rm</code> does not help: the earlier layer still contains it, and anyone who can pull the image can read it. Write <code>.dockerignore</code> before the first <code>COPY .</code>, and write it in the same "is this source?" spirit as the four categories above.</div>
<table>
<tr><th>Tool</th><th>File it reads</th><th>Measured on ~/du-an</th><th>Trap</th></tr>
<tr><td><code>git archive</code></td><td>committed files only; <code>.gitattributes</code> <code>export-ignore</code></td><td>24 entries, 12 KB, no <code>.env*</code></td><td>an uncommitted file does not ship — even one you need</td></tr>
<tr><td><code>rsync --exclude-from=.gitignore</code></td><td>rsync patterns (close to gitignore)</td><td>dropped <code>node_modules/</code>, <code>.env</code></td><td>shipped <code>.env.production</code></td></tr>
<tr><td><code>tar --exclude-vcs-ignores</code></td><td><code>.gitignore</code>, by tar's rules</td><td>dropped <code>.env</code>, <code>.git</code></td><td>kept <code>node_modules/</code>: 892 entries</td></tr>
<tr><td><code>.dockerignore</code></td><td>the <code>docker build</code> context</td><td><code>/app</code>: 27M → 132K</td><td><code>.gitignore</code> has no effect here</td></tr>
<tr><td><code>.gitignore</code></td><td><code>git add</code>, <code>git status</code></td><td>—</td><td>rsync, tar, scp and docker never read it</td></tr>
</table>

<h3>On macOS and Windows/WSL</h3>
<p>The audit commands are Linux commands, and two of them fail on a Mac. BSD <code>du</code> has no <code>--exclude</code>:</p>
<div class="out">$ du -sh --exclude=.git .
du: unrecognized option &#96;--exclude=.git'
usage: du [--libxo] [-Aclnx] [-H | -L | -P] [-g | -h | -k | -m] …
$ du -sh -I .git du-an
 26M	du-an</div>
<p>Use <code>-I .git</code> instead. macOS's rsync is now <strong>openrsync</strong> ("protocol version 29, rsync version 2.6.9 compatible"); for this lesson it behaves the same — <code>--exclude-from=.gitignore</code> produced the identical list above, <code>.env.production</code> included. macOS <code>tar</code> is bsdtar and understands <code>--exclude-vcs</code>. <code>git status --porcelain --ignored</code> and <code>git archive</code> are identical everywhere, which is one more argument for building the artifact with git rather than with whatever tar the machine happens to have.</p>
<p>On Windows, Git Bash ships <code>git</code> but no <code>rsync</code>; the <code>tar.exe</code> built into Windows is bsdtar. In WSL, keep the project inside the Linux filesystem (<code>~/du-an</code>), not under <code>/mnt/c</code>: files on the Windows drive show up with Unix permissions the project never had, and every tool in this lesson is slower there. Whatever you use, the rule does not change: the file that controls what ships must be the file the <em>packaging tool</em> reads.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 defence, a teammate "just tarred the folder and copied it up". You need to prove what else went to the server and stop it happening again. Work on a lab VPS — build it once with the two blocks below; later lessons reuse it.</p>
<pre><code class="language-dockerfile"># Dockerfile of the lab VPS — build once: docker build -t dv01-img .
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      openssh-server ca-certificates git rsync curl jq xxd nodejs npm
RUN useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh /run/sshd
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy:deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh \\
 &amp;&amp; chmod 600 /home/deploy/.ssh/authorized_keys \\
 &amp;&amp; mkdir -p /srv/app &amp;&amp; chown deploy:deploy /srv/app
CMD ["/usr/sbin/sshd", "-D", "-e"]</code></pre>
<pre><code class="language-bash">ssh-keygen -t ed25519 -N "" -f ./khoa          # a key just for the lab — not ~/.ssh
docker build -t dv01-img .
docker run -d --name dv01-vps --memory 512m -p 127.0.0.1:19012:22 dv01-img
ssh -i ./khoa -o UserKnownHostsFile=./known_hosts -p 19012 deploy@127.0.0.1</code></pre>
<ol>
<li>On the lab VPS, make or clone a small project with a <code>.gitignore</code> of <code>node_modules/ dist/ .env tai-len/ logs/</code>, commit it, then create <code>.env</code>, <code>.env.production</code>, <code>tai-len/a.jpg</code> and run <code>npm install</code>.</li>
<li>Run <code>git status --porcelain --ignored</code> and label every <code>??</code> and <code>!!</code> line as source, derived, runtime state or configuration.</li>
<li>Package it three ways — <code>tar czf</code> of the whole tree, <code>rsync -an --out-format="%n" --exclude-from=.gitignore</code>, and <code>git archive</code> — and for each count the <code>.env*</code> files: <code>tar tzf X | grep -c '\\.env'</code>.</li>
<li>Fix the ignore file: add <code>.env*</code> and <code>!.env.example</code>, then repeat the rsync dry run.</li>
</ol>
<p><strong>Done when:</strong> you have a three-row table (entries, <code>.env*</code> count) in which <code>git archive</code> shows 0, and the rsync dry run after the fix no longer lists <code>.env.production</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Artifact</span><span class="v">The exact set of bytes a deploy sends to the server — ideally one file produced from one commit.</span></div>
  <div class="kv"><span class="k">Working tree</span><span class="v">The directory you edit in: committed files plus everything generated, ignored or not yet added.</span></div>
  <div class="kv"><span class="k">Derived files</span><span class="v"><code>node_modules</code>, <code>dist</code>, <code>.next</code>: produced from source by a build and rebuilt, never copied.</span></div>
  <div class="kv"><span class="k">Runtime state</span><span class="v">Uploads, logs, caches, SQLite files — created on the server and lost forever if a deploy overwrites them.</span></div>
  <div class="kv"><span class="k">Untracked (<code>??</code>) vs ignored (<code>!!</code>)</span><span class="v">Not yet added to git, versus deliberately excluded by <code>.gitignore</code>; neither is in the artifact.</span></div>
  <div class="kv"><span class="k">Exclude pattern</span><span class="v">A rule telling one tool to skip a path; rsync, tar, Docker and git each have their own syntax.</span></div>
  <div class="kv"><span class="k">Build context</span><span class="v">The directory <code>docker build</code> sends to the builder; <code>.dockerignore</code> trims it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A working tree holds four kinds of thing and only committed source belongs in the artifact.</li>
<li>Ask of every path "if this were deleted on the server, would I lose anything?" — a yes means it must live outside the release.</li>
<li><code>.gitignore</code> protects nothing during a deploy: rsync, tar and docker each read their own exclusion file, with their own pattern rules.</li>
<li>Measured: <code>tar --exclude-vcs-ignores</code> still shipped 892 <code>node_modules</code> entries, and every exclude list shipped the unlisted <code>.env.production</code>.</li>
<li><code>git archive</code> excludes by construction: a file that was never committed cannot be in it.</li>
<li><code>git status --porcelain --ignored</code> is the five-minute audit that shows what nobody has reviewed.</li>
</ul>

<div class="link-card"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker — Build context and .dockerignore</span><span class="lc-sub">docs.docker.com/build/concepts/context — what is sent to the builder, and the pattern syntax of <code>.dockerignore</code>.</span></span></div>
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
${slide('dv-01', 3, 'Cây làm việc → tạo tác: cái gì đi, cái gì ở lại')}
${slide('dv-01', 4, 'Gói ngây thơ chở theo mật khẩu và rác (đo lại 29/09)')}
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
${slide('dv-01', 5, 'Phép thử: xoá trên máy chủ thì có mất gì?')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Nguồn — đã commit, và nó ĐI</span><span class="lz-lnote">Mã của bạn, template, migration, tệp khai báo gói và tệp khoá phiên bản. Đây MỚI là tạo tác. Mọi thứ khác trong danh sách này thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Dẫn xuất — dựng lại, không bao giờ chép</span><span class="lz-lnote"><code>node_modules</code>, <code>dist</code>, <code>.next</code>, tài nguyên đã biên dịch. Sinh ra <em>TỪ</em> mã nguồn bằng một bước dựng, mà bước dựng đó phải chạy trên nền tảng đích. Bài 1.3.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Trạng thái lúc chạy — sống trên máy chủ, deploy KHÔNG được đụng</span><span class="lz-lnote">Tệp tải lên, log, cache, một tệp SQLite. Nó thuộc về bên NGOÀI thư mục bản phát hành hẳn, nằm trong thư mục <code>chung/</code> ở Bài 0.4, rồi liên kết mềm vào.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Cấu hình — phía máy chủ, và KHÔNG BAO GIỜ nằm trong tạo tác</span><span class="lz-lnote"><code>.env</code>, chứng chỉ, khoá. Cùng đích đến với trạng thái lúc chạy và vì một lý do còn mạnh hơn. Chương 4.</span></div>
</div>
<div class="callout ok"><strong>Phép thử là một CÂU HỎI, không phải một danh sách.</strong> Với từng đường dẫn: <em>nếu cái này bị xoá trên máy chủ, tôi có mất gì không?</em> Mã nguồn — không, nó tới từ git. Dẫn xuất — không, dựng lại thôi. Trạng thái lúc chạy — <strong>CÓ</strong>, nó mất vĩnh viễn. Cấu hình — <strong>CÓ</strong>, và website dừng luôn. Bất cứ thứ gì bạn trả lời "có" đều KHÔNG được nằm bên trong cái mà một lần deploy sẽ ghi đè.</div>

<h3>Hai danh sách loại trừ, và chúng KHÔNG phải một</h3>
${slide('dv-01', 6, 'Bốn file loại trừ, bốn luật khác nhau')}
<p>Một hiểu nhầm thường gặp là tưởng <code>.gitignore</code> bảo vệ được lần deploy. Không hề — nó chi phối việc git THEO DÕI cái gì, còn một lệnh <code>rsync</code> hay <code>tar</code> thô thì chẳng bao giờ ngó tới nó. Thứ bị git bỏ qua lại đúng là loại thứ nguy hiểm nhất khi gửi đi, vì chưa từng có ai xem lại nó.</p>
<pre><code class="language-bash"><span class="tok-comment"># .gitignore — cai gi KHONG vao kho ma</span>
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
${slide('dv-01', 7, 'Kiểm kê 5 phút: ?? chưa theo dõi, !! bị bỏ qua')}
<pre><code class="language-bash"><span class="tok-comment"># 1. Cai gi to nhat trong cay lam viec?</span>
du -sh --exclude=.git . &amp;&amp; du -sh */ | sort -rh | head -10

<span class="tok-comment"># 2. Nhung tep nao KHONG duoc git theo doi? (day la danh sach dang ngo)</span>
git status --porcelain --ignored | grep '^!!'

<span class="tok-comment"># 3. Co bi mat nao trong cay khong?</span>
find . -name '.env*' -not -path './.git/*'

<span class="tok-comment"># 4. Tao tac se trong nhu the nao?</span>
git archive --format=tar HEAD | tar t | head -20</code></pre>
<div class="note-ct">Bước 2 mới là bước tìm ra bất ngờ. <code>git status --porcelain --ignored</code> liệt kê mọi thứ mà git đang CỐ Ý không nhìn tới, mà đó chính xác là tập hợp chẳng ai xem lại — mấy nhánh cũ của một thư mục dựng, một bản trút cơ sở dữ liệu từ một buổi gỡ lỗi, một tệp <code>.env.old</code> từ một lần chuyển đổi hai năm trước. Chạy nó một lần trên một dự án bạn đã giữ lâu; kết quả in ra thường dài hơn bạn tưởng.</div>
<h3>Tự chạy thử: bốn công cụ, bốn câu trả lời khác nhau</h3>
<p>Mấy con số ở đầu bài lấy từ dự án thử gốc của chương. Dựng lại trên VPS thí nghiệm ngày 29/09/2026 — một container Ubuntu 24.04 có sshd mà máy Mac SSH vào, GNU tar 1.35, rsync 3.2.7 — kèm thêm một lỗi rất đời thường: tệp <code>.env.production</code> tạo tuần trước mà chẳng ai thêm vào <code>.gitignore</code>. Bốn cách đóng gói cùng một thư mục:</p>
<pre><code class="language-bash">tar czf /tmp/tho.tgz .                                   # ca cay
tar czf /tmp/ex.tgz --exclude=.git --exclude=node_modules --exclude=.env \\
    --exclude=tai-len --exclude=logs --exclude=dist .     # danh sach viet tay
tar czf /tmp/vcs.tgz --exclude-vcs --exclude-vcs-ignores .  # "de tar tu doc .gitignore"
git archive --format=tar.gz HEAD &gt; /tmp/ga.tgz            # chi thu da commit</code></pre>
<div class="out">tho    5.0M   1012 muc  ./.env ./.env.production ./src/server.js.orig
ex      12K     27 muc  ./.env.production ./src/server.js.orig
vcs    5.0M    924 muc  ./.env.production ./src/server.js.orig
ga      12K     24 muc</div>
<p>Danh sách viết tay đã nhớ <code>.env</code> và vẫn gửi đi <code>.env.production</code> — nó chỉ chặn thứ có người NÊU TÊN. Bất ngờ nằm ở dòng thứ ba: <code>--exclude-vcs-ignores</code> của GNU tar hứa sẽ tôn trọng <code>.gitignore</code>, vậy mà gói vẫn nặng 5 MB. Đếm số mục theo thư mục cấp đầu thì thấy vì sao:</p>
<div class="out">$ tar tzf /tmp/vcs.tgz | cut -d/ -f2 | sort | uniq -c | sort -rn | head -4
    892 node_modules
     15 src
      3 .github
      2 tests</div>
<p>Nó bỏ được <code>.env</code> (một cái tên trơn) nhưng GIỮ LẠI cả 892 mục của <code>node_modules/</code>, cùng <code>dist/</code>, <code>logs/</code>, <code>tai-len/</code> — đúng những mẫu viết có dấu gạch chéo ở cuối. tar đọc tệp đó theo luật mẫu của RIÊNG nó, và một mẫu thư mục theo cú pháp git không phải là mẫu thư mục theo cú pháp tar. rsync làm tốt hơn với cùng tệp đó:</p>
<div class="out">$ rsync -an --out-format="%n" --exclude-from=.gitignore --exclude=.git ./ /tmp/dich/ \\
    | grep -vE "^(src|tests|docs|\\.github)/"
./
.env.production
.gitignore
package-lock.json
package.json</div>
<p>Mọi mẫu trong gitignore đều khớp — và <code>.env.production</code> VẪN đi, vì nó không hề <em>nằm trong</em> <code>.gitignore</code>. Tái dùng tệp ignore gỡ được bài toán "hai danh sách trôi khỏi nhau"; nó không gỡ được bài toán "chưa ai liệt kê nó". Chỉ <code>git archive</code> trả lời được cả hai, vì một tệp chưa commit thì VẮNG MẶT ngay từ cách nó được tạo ra.</p>
<p>Tệp thứ tư là <code>.dockerignore</code>, và nó quan trọng ngay khi tạo tác trở thành một cái ảnh (Chương 13). Đo trên Mac với Docker Desktop, cùng dự án đó được chép vào một ảnh dùng một lần bằng <code>COPY . /app</code>:</p>
<div class="out">── khong co .dockerignore ──
#5 transferring context: 25.12MB 0.4s done
#7 0.144 27M	/app
#7 0.145 . .. .env .env.production .git .github .gitignore dist docs logs node_modules …
── co .dockerignore:  .git  node_modules  dist  logs  tai-len  .env*  *.orig ──
#7 0.123 132K	/app
#7 0.124 . .. .dockerignore .github .gitignore docs package-lock.json package.json src tests</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — <code>.gitignore</code> KHÔNG có tác dụng gì với <code>docker build</code>.</strong> Thiếu <code>.dockerignore</code> thì cả thư mục — gồm cả hai tệp <code>.env</code> lẫn <code>.git</code> — được gửi cho bộ build, và <code>COPY . /app</code> nướng chúng vào một tầng ảnh. Xoá tệp đó ở một bước <code>RUN rm</code> phía sau cũng vô ích: tầng trước vẫn chứa nó, và ai kéo được ảnh là đọc được. Hãy viết <code>.dockerignore</code> TRƯỚC lệnh <code>COPY .</code> đầu tiên, và viết nó bằng đúng tinh thần câu hỏi "cái này có phải mã nguồn không?" của bốn loại ở trên.</div>
<table>
<tr><th>Công cụ</th><th>Đọc tệp nào</th><th>Đo thật trên ~/du-an</th><th>Bẫy</th></tr>
<tr><td><code>git archive</code></td><td>chỉ tệp đã commit; <code>.gitattributes</code> <code>export-ignore</code></td><td>24 mục, 12 KB, không <code>.env*</code></td><td>tệp chưa commit không đi — kể cả tệp bạn CẦN</td></tr>
<tr><td><code>rsync --exclude-from=.gitignore</code></td><td>mẫu của rsync (gần giống gitignore)</td><td>bỏ được <code>node_modules/</code>, <code>.env</code></td><td>gửi <code>.env.production</code></td></tr>
<tr><td><code>tar --exclude-vcs-ignores</code></td><td><code>.gitignore</code>, theo luật của tar</td><td>bỏ <code>.env</code>, <code>.git</code></td><td>giữ <code>node_modules/</code>: 892 mục</td></tr>
<tr><td><code>.dockerignore</code></td><td>build context của <code>docker build</code></td><td><code>/app</code>: 27M → 132K</td><td><code>.gitignore</code> vô tác dụng ở đây</td></tr>
<tr><td><code>.gitignore</code></td><td><code>git add</code>, <code>git status</code></td><td>—</td><td>rsync, tar, scp, docker KHÔNG BAO GIỜ đọc</td></tr>
</table>

<h3>Trên macOS và Windows/WSL khác gì</h3>
<p>Mấy lệnh kiểm kê là lệnh Linux, và hai trong số đó hỏng trên Mac. <code>du</code> của BSD không có <code>--exclude</code>:</p>
<div class="out">$ du -sh --exclude=.git .
du: unrecognized option &#96;--exclude=.git'
usage: du [--libxo] [-Aclnx] [-H | -L | -P] [-g | -h | -k | -m] …
$ du -sh -I .git du-an
 26M	du-an</div>
<p>Dùng <code>-I .git</code> thay thế. rsync của macOS giờ là <strong>openrsync</strong> ("protocol version 29, rsync version 2.6.9 compatible"); với bài này nó cư xử y hệt — <code>--exclude-from=.gitignore</code> cho ra đúng danh sách ở trên, có cả <code>.env.production</code>. <code>tar</code> của macOS là bsdtar và hiểu <code>--exclude-vcs</code>. Còn <code>git status --porcelain --ignored</code> và <code>git archive</code> thì giống hệt nhau ở mọi nơi — thêm một lý do để dựng tạo tác bằng git thay vì bằng cái tar nào tình cờ có trên máy.</p>
<p>Trên Windows, Git Bash có <code>git</code> nhưng KHÔNG có <code>rsync</code>; <code>tar.exe</code> có sẵn trong Windows là bsdtar. Trong WSL, hãy để dự án bên trong hệ tệp Linux (<code>~/du-an</code>), đừng để dưới <code>/mnt/c</code>: tệp trên ổ Windows hiện ra với quyền Unix mà dự án chưa từng có, và mọi công cụ trong bài này đều chậm hơn ở đó. Dùng gì thì luật cũng không đổi: tệp quyết định thứ gì được gửi đi phải là tệp mà chính <em>công cụ đóng gói</em> đọc.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tối trước hôm bảo vệ SWP391, bạn cùng nhóm "chỉ nén cả thư mục rồi chép lên". Bạn cần chứng minh còn thứ gì khác đã lên máy chủ và chặn không cho chuyện đó lặp lại. Làm trên VPS thí nghiệm — dựng một lần bằng hai khối dưới đây; các bài sau dùng lại nó.</p>
<pre><code class="language-dockerfile"># Dockerfile của VPS thí nghiệm — dựng một lần: docker build -t dv01-img .
FROM ubuntu:24.04
RUN apt-get update &amp;&amp; apt-get install -y --no-install-recommends \\
      openssh-server ca-certificates git rsync curl jq xxd nodejs npm
RUN useradd -m -s /bin/bash deploy &amp;&amp; mkdir -p /home/deploy/.ssh /run/sshd
COPY khoa.pub /home/deploy/.ssh/authorized_keys
RUN chown -R deploy:deploy /home/deploy/.ssh &amp;&amp; chmod 700 /home/deploy/.ssh \\
 &amp;&amp; chmod 600 /home/deploy/.ssh/authorized_keys \\
 &amp;&amp; mkdir -p /srv/app &amp;&amp; chown deploy:deploy /srv/app
CMD ["/usr/sbin/sshd", "-D", "-e"]</code></pre>
<pre><code class="language-bash">ssh-keygen -t ed25519 -N "" -f ./khoa          # khoá riêng cho phòng thí nghiệm — KHÔNG phải ~/.ssh
docker build -t dv01-img .
docker run -d --name dv01-vps --memory 512m -p 127.0.0.1:19012:22 dv01-img
ssh -i ./khoa -o UserKnownHostsFile=./known_hosts -p 19012 deploy@127.0.0.1</code></pre>
<ol>
<li>Trên VPS thí nghiệm, tạo hoặc clone một dự án nhỏ có <code>.gitignore</code> gồm <code>node_modules/ dist/ .env tai-len/ logs/</code>, commit, rồi tạo <code>.env</code>, <code>.env.production</code>, <code>tai-len/a.jpg</code> và chạy <code>npm install</code>.</li>
<li>Chạy <code>git status --porcelain --ignored</code> và gắn nhãn cho từng dòng <code>??</code> và <code>!!</code>: nguồn, dẫn xuất, trạng thái lúc chạy hay cấu hình.</li>
<li>Đóng gói ba cách — <code>tar czf</code> cả cây, <code>rsync -an --out-format="%n" --exclude-from=.gitignore</code>, và <code>git archive</code> — rồi với mỗi cách đếm số tệp <code>.env*</code>: <code>tar tzf X | grep -c '\\.env'</code>.</li>
<li>Sửa tệp ignore: thêm <code>.env*</code> và <code>!.env.example</code>, rồi chạy lại rsync ở chế độ chạy thử.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng ba dòng (số mục, số tệp <code>.env*</code>) trong đó <code>git archive</code> ra 0, và lần chạy thử rsync sau khi sửa không còn liệt kê <code>.env.production</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Artifact (tạo tác — thứ được gửi đi)</span><span class="v">Đúng tập byte mà một lần deploy đưa lên máy chủ — lý tưởng là một tệp sinh ra từ một commit.</span></div>
  <div class="kv"><span class="k">Working tree (cây làm việc)</span><span class="v">Thư mục bạn sửa mã: tệp đã commit cộng mọi thứ được sinh ra, bị bỏ qua hoặc chưa add.</span></div>
  <div class="kv"><span class="k">Derived files (tệp dẫn xuất)</span><span class="v"><code>node_modules</code>, <code>dist</code>, <code>.next</code>: sinh ra từ mã nguồn bằng bước build, luôn dựng lại chứ không chép.</span></div>
  <div class="kv"><span class="k">Runtime state (trạng thái lúc chạy)</span><span class="v">Tệp tải lên, log, cache, tệp SQLite — sinh ra trên máy chủ, mất vĩnh viễn nếu bị deploy ghi đè.</span></div>
  <div class="kv"><span class="k">Untracked <code>??</code> / ignored <code>!!</code> (chưa theo dõi / bị bỏ qua)</span><span class="v">Chưa được add vào git, so với bị <code>.gitignore</code> cố ý loại ra; cả hai đều KHÔNG có trong tạo tác.</span></div>
  <div class="kv"><span class="k">Exclude pattern (mẫu loại trừ)</span><span class="v">Luật bảo MỘT công cụ bỏ qua một đường dẫn; rsync, tar, Docker và git mỗi thứ một cú pháp.</span></div>
  <div class="kv"><span class="k">Build context (ngữ cảnh build)</span><span class="v">Thư mục mà <code>docker build</code> gửi cho bộ build; <code>.dockerignore</code> cắt bớt nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cây làm việc chứa bốn loại thứ, và chỉ mã nguồn đã commit mới thuộc về tạo tác.</li>
<li>Hỏi từng đường dẫn "xoá cái này trên máy chủ thì có mất gì không?" — trả lời "có" nghĩa là nó phải sống NGOÀI bản phát hành.</li>
<li><code>.gitignore</code> không bảo vệ gì lúc deploy: rsync, tar và docker mỗi thứ đọc tệp loại trừ riêng, theo luật mẫu riêng.</li>
<li>Đo thật: <code>tar --exclude-vcs-ignores</code> vẫn gửi 892 mục <code>node_modules</code>, và mọi danh sách loại trừ đều gửi <code>.env.production</code> chưa ai liệt kê.</li>
<li><code>git archive</code> loại trừ ngay từ cách nó được tạo: tệp chưa từng commit thì không thể có mặt.</li>
<li><code>git status --porcelain --ignored</code> là cuộc kiểm kê năm phút cho thấy những thứ chưa ai xem lại.</li>
</ul>

<div class="link-card"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Docker — Build context và .dockerignore</span><span class="lc-sub">docs.docker.com/build/concepts/context — thứ gì được gửi cho bộ build, và cú pháp mẫu của <code>.dockerignore</code>.</span></span></div>
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
${slide('dv-01', 8, 'git archive: bắt đầu từ số không')}
<p>Lesson 1.1 ended with the argument: an exclude list is a list you forget. <code>git archive</code> inverts it — it starts from nothing and writes exactly the files at one commit:</p>
<pre><code class="language-bash"><span class="tok-comment"># tep nen cua DUNG mot commit — khong .git, khong thu chua commit</span>
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
${slide('dv-01', 9, 'Cùng commit, Mac và Ubuntu: cùng sha256')}
${slide('dv-01', 10, 'Byte 5–8 của gzip là GIỜ — Mac luôn ghi')}
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
<div class="callout warn"><strong>Measured with GNU gzip, on Linux.</strong> "Compress from a pipe" is only safe there. Apple's gzip on macOS writes the current time into MTIME even when it reads a pipe — two runs 1.2 seconds apart gave two different checksums. See "A correction for Mac users" below; <code>gzip -n</code> is the rule that holds everywhere.</div>

<h3>The recipe</h3>
${slide('dv-01', 13, 'Script đóng gói từ chối cây bẩn')}
<pre><code class="language-bash"><span class="tok-comment">#!/bin/bash</span>
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
<h3>A correction for Mac users: Apple's gzip stamps the time even from a pipe</h3>
<p>The measurements above were taken with GNU gzip, the one every Linux server has. They do not hold on a Mac. Two identical one-line inputs, compressed from a pipe 1.2 seconds apart:</p>
<div class="out">── Ubuntu 24.04, gzip 1.12 ──
$ for i in 1 2; do echo hi | gzip | sha256sum; sleep 1.2; done
ec4d2c6f7706d3838a9c5c3d25338f2a3fada1f642591d5ae2b7cd50a73448dd  -
ec4d2c6f7706d3838a9c5c3d25338f2a3fada1f642591d5ae2b7cd50a73448dd  -
$ echo hi | gzip | xxd -l 10
00000000: 1f8b 0800 0000 0000 0003                 ..........
$ gzip -c f.txt | xxd -l 10
00000000: 1f8b 0808 c30f bb6a 0003                 .......j..

── macOS 27, Apple gzip 487.0.1 ──
$ for i in 1 2; do echo hi | gzip | shasum -a 256; sleep 1.2; done
f3168e9d7c43899e77df2e14b9f03b2601ab7e5a32f8270adb358baa80ed647e  -
c2b70c0e8789c85c78654f8bf11f4c703f023c6228268efe7823e6ea702fd8ea  -
$ echo hi | gzip | xxd -l 10
00000000: 1f8b 0800 bb0f bb6a 0003                 .......j..
$ echo hi | gzip -n | xxd -s 4 -l 4
00000004: 0000 0000                                ....</div>
<p>Read the header left to right: <code>1f 8b</code> is the gzip signature, <code>08</code> means deflate, the fourth byte is the flag field — <code>08</code> there means "a file name follows", which is why the named-file case also stores <code>f.txt</code> — and bytes 5–8 are MTIME, least significant byte first. <code>c3 0f bb 6a</code> read backwards is <code>0x6abb0fc3</code> = 1790644163 seconds = 29/09/2026 01:09 UTC, the moment the file was written. On the Mac the <em>pipe</em> case carries <code>bb 0f bb 6a</code> — the current time — so the sentence "compressing from a pipe is reproducible" is true of GNU gzip and false of Apple's. <code>gzip -n</code> writes four zero bytes on both.</p>
<div class="callout warn"><strong>So the rule is <code>gzip -n</code>, always — not "use a pipe".</strong> The recipe below already does it. The case where it bites is the laptop script: a teammate builds the artifact on a Mac, you build it on Linux, the contents are identical and the checksums never match, and someone "fixes" it by turning the checksum check off.</div>

<h3>When you have to use tar: SOURCE_DATE_EPOCH</h3>
${slide('dv-01', 11, 'tar thường khác nhau mỗi lần clone — SOURCE_DATE_EPOCH sửa được')}
${slide('dv-01', 12, 'Bảng cờ tar tái lập được — bsdtar không có')}
<p><code>git archive</code> is the easy case. Sometimes the thing you package is not a commit — a <code>dist/</code> directory produced by a build, a directory of generated assets — and then you are back to <code>tar</code>. Two fresh clones of the same commit, two seconds apart, packaged with an ordinary <code>tar czf</code>:</p>
<div class="out">$ sha256sum tar-b1.tgz tar-b2.tgz
93349a073ebb98eeab748f6107ac9c2e68207b41944430f874a938aa04ffde6d  tar-b1.tgz
023236e18623e45025436597dde405f9cefbe0af8e8307f0f040d661f34e5476  tar-b2.tgz
$ tar tvzf tar-b1.tgz --full-time ./package.json
-rw-rw-r-- deploy/deploy   149 2026-09-29 01:08:47 ./package.json
$ tar tvzf tar-b2.tgz --full-time ./package.json
-rw-rw-r-- deploy/deploy   149 2026-09-29 01:08:49 ./package.json
$ cmp -l &lt;(zcat tar-b1.tgz) &lt;(zcat tar-b2.tgz) | wc -l
94</div>
<p>Identical contents, 94 bytes different. A clone writes every file with the <em>current</em> time, and tar records each file's mtime, owner name and the order the directory happened to be read in. The fix is to pin every one of those, and the reproducible-builds project gives the time a standard name: <strong><code>SOURCE_DATE_EPOCH</code></strong>, an environment variable holding "the time of the source" as Unix seconds — normally the commit time — which a growing list of build tools read instead of the clock.</p>
<pre><code class="language-bash">export SOURCE_DATE_EPOCH=\$(git log -1 --format=%ct)      # 1790643600 = gio commit
PAX=exthdr.name=%d/PaxHeaders/%f,delete=atime,delete=ctime
tar --sort=name \\
    --mtime="@\$SOURCE_DATE_EPOCH" \\
    --owner=0 --group=0 --numeric-owner \\
    --pax-option="\$PAX" \\
    --exclude=.git -cf - . | gzip -n &gt; rep.tgz</code></pre>
<div class="out">$ sha256sum rep-b1.tgz rep-b2.tgz
2afd2824061855503159fc0efd92a891cd543d6d9b61046edf3d063d80d522ab  rep-b1.tgz
2afd2824061855503159fc0efd92a891cd543d6d9b61046edf3d063d80d522ab  rep-b2.tgz
$ tar tvzf rep-b1.tgz --full-time ./package.json
-rw-rw-r-- 0/0             149 2026-09-29 01:00:00 ./package.json</div>
<table>
<tr><th>What leaks into a tar file</th><th>GNU tar flag that stops it</th><th>Without it</th></tr>
<tr><td>each file's mtime</td><td><code>--mtime="@\$SOURCE_DATE_EPOCH"</code></td><td>clone or checkout time — different every build</td></tr>
<tr><td>directory read order</td><td><code>--sort=name</code> (tar 1.28 or newer)</td><td>whatever order the filesystem returns</td></tr>
<tr><td>owner and group names/ids</td><td><code>--owner=0 --group=0 --numeric-owner</code></td><td><code>deploy/deploy</code>, uid 1000 — whoever built it</td></tr>
<tr><td>atime and ctime in PAX headers</td><td><code>--pax-option=…,delete=atime,delete=ctime</code></td><td>changes each time a file is read</td></tr>
<tr><td>the gzip MTIME</td><td><code>| gzip -n</code></td><td>compression time (Mac, named files)</td></tr>
<tr><td>sort order by locale</td><td><code>LC_ALL=C</code> if you sort with <code>find | sort</code></td><td>a Vietnamese-locale machine sorts differently from a C-locale one</td></tr>
</table>
<p>None of these flags exist in macOS's bsdtar:</p>
<div class="out">$ tar --sort=name -cf /dev/null .
tar: Option --sort=name is not supported
$ tar --mtime=@1790643600 -cf /dev/null .
tar: Option --mtime=@1790643600 is not supported
$ tar --version
bsdtar 3.5.3 - libarchive 3.7.4 zlib/1.2.12 liblzma/5.4.3 bz2lib/1.0.8</div>
<p>On a Mac, prefer <code>git archive</code>, or install GNU tar (<code>brew install gnu-tar</code>, run as <code>gtar</code>) — better still, build the artifact on the Linux machine that will run it, which Lesson 1.3 argues for on other grounds.</p>

<h3>Same commit, different machines — and the Windows exception</h3>
<p>The strongest form of reproducibility is two <em>different</em> machines producing the same bytes. Measured with the same commit on the lab VPS (git 2.43.0) and on the Mac (git 2.51.1):</p>
<div class="out">── Ubuntu, git 2.43.0 ──
$ git archive --format=tar.gz --prefix=app/ HEAD | sha256sum
5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  -
── macOS, git 2.51.1 ──
$ git archive --format=tar.gz --prefix=app/ HEAD | shasum -a 256
5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  -</div>
<p>Identical, across two operating systems and two git versions — <code>--format=tar.gz</code> uses git's own built-in gzip, which writes a zero MTIME. The exception is a setting most Windows machines have. Git for Windows usually runs with <code>core.autocrlf=true</code>, and <code>git archive</code> applies that conversion when it writes files out:</p>
<div class="out">$ git archive --format=tar HEAD | shasum -a 256 | cut -c1-16
4c0653cc7496e950
$ git -c core.autocrlf=true archive --format=tar HEAD | shasum -a 256 | cut -c1-16
e4ce4bda78ba3708
$ git -c core.autocrlf=true archive --format=tar HEAD src/server.js | tar xOf - | od -c | head -2
0000000    i   m   p   o   r   t       h   t   t   p       f   r   o   m
0000020        '   n   o   d   e   :   h   t   t   p   '   ;  \\r  \\n   h
$ echo '* text=auto eol=lf' &gt; .gitattributes
$ git -c core.autocrlf=true archive --worktree-attributes --format=tar HEAD | shasum -a 256 | cut -c1-16
4c0653cc7496e950</div>
<div class="pitfall co-tieu-de"><strong>Trap — an artifact built on Windows carries CRLF line endings.</strong> The checksum differs from the Linux build, and worse, a shell script inside it now ends every line in <code>\\r</code>: on the server it fails with <code>/bin/bash^M: bad interpreter</code> or with a variable whose value has an invisible carriage return on the end. Commit a <code>.gitattributes</code> with <code>* text=auto eol=lf</code> (above it was tested with <code>--worktree-attributes</code> before committing; once committed, plain <code>git archive</code> reads it from the commit) and every machine produces LF.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> staging and production both claim to run "v2.1.0", yet they behave differently. Nobody can say whether they have the same code. Make your artifacts provable, on the lab VPS from Lesson 1.1.</p><ol>
<li>Clone your project twice (<code>git clone -q du-an b1; sleep 2; git clone -q du-an b2</code>) and build <code>git archive --format=tar --prefix=app/ HEAD | gzip -n</code> in each. Compare with <code>sha256sum</code>.</li>
<li>In each clone run a plain <code>tar czf ../tar-bN.tgz --exclude=.git .</code> and compare; find the first differing file with <code>tar tvzf … --full-time</code>.</li>
<li>Repeat step 2 with <code>SOURCE_DATE_EPOCH</code> and the flags from the table, and compare again.</li>
<li>Save the recipe as <code>dong-goi.sh</code>, create an untracked file, run it and record the exit code; delete the file and run it again.</li>
</ol>
<p><strong>Done when:</strong> steps 1 and 3 give two identical sha256 sums, step 2 gives two different ones and you can name the field that differs, and <code>dong-goi.sh</code> exits 1 on the dirty tree and writes <code>app-&lt;commit&gt;.tar.gz</code> plus its <code>.sha256</code> on the clean one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reproducible build</span><span class="v">A build whose output is bit-for-bit identical every time for the same input, on any machine.</span></div>
  <div class="kv"><span class="k">Checksum / sha256</span><span class="v">A 64-hex-digit fingerprint of a file's bytes; one changed byte gives a completely different value.</span></div>
  <div class="kv"><span class="k">MTIME (gzip header)</span><span class="v">Bytes 5–8 of a gzip file: a timestamp that makes identical content hash differently.</span></div>
  <div class="kv"><span class="k"><code>SOURCE_DATE_EPOCH</code></span><span class="v">The standard environment variable carrying "the time of the source" (usually the commit time) for build tools to use instead of the clock.</span></div>
  <div class="kv"><span class="k"><code>export-ignore</code></span><span class="v">A <code>.gitattributes</code> attribute that keeps a committed path out of <code>git archive</code> only.</span></div>
  <div class="kv"><span class="k">Dirty tree</span><span class="v">A working tree with uncommitted or untracked changes; an artifact built from it does not match its commit name.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Windows and Unix line endings; <code>core.autocrlf=true</code> makes <code>git archive</code> emit CRLF.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>git archive</code> of one commit is byte-reproducible — measured identical across two clones, two machines and two git versions.</li>
<li>gzip bytes 5–8 hold a timestamp; GNU gzip writes zero from a pipe, Apple gzip writes the current time — use <code>gzip -n</code> everywhere.</li>
<li>Plain <code>tar</code> of a fresh clone differs every time; <code>SOURCE_DATE_EPOCH</code> plus <code>--sort=name</code>, fixed owners and <code>gzip -n</code> made it identical.</li>
<li>macOS bsdtar has none of those flags; build on Linux, use <code>git archive</code>, or install <code>gtar</code>.</li>
<li><code>core.autocrlf=true</code> puts CRLF into artifacts built on Windows; <code>* text=auto eol=lf</code> in <code>.gitattributes</code> fixes it.</li>
<li>A packaging script must refuse a dirty tree, or the name on the artifact lies about its contents.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">reproducible-builds.org — SOURCE_DATE_EPOCH</span><span class="lc-sub">reproducible-builds.org/docs/source-date-epoch — the specification of the variable, and which tools honour it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">reproducible-builds.org — Archive metadata</span><span class="lc-sub">reproducible-builds.org/docs/archives — the <code>--sort=name</code>, <code>--mtime</code>, owner and PAX flags explained one by one.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-archive(1)</span><span class="lc-sub">git-scm.com/docs/git-archive — <code>--prefix</code>, <code>--format</code>, <code>--worktree-attributes</code>, and how the commit time becomes the file time.</span></span></div>
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
${slide('dv-01', 8, 'git archive: bắt đầu từ số không')}
<p>Bài 1.1 kết thúc bằng lý lẽ: danh sách loại trừ là danh sách bạn sẽ quên. <code>git archive</code> lật ngược nó lại — nó khởi đầu từ số không rồi viết ra ĐÚNG những tệp tại một commit:</p>
<pre><code class="language-bash"><span class="tok-comment"># tep nen cua DUNG mot commit — khong .git, khong thu chua commit</span>
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
${slide('dv-01', 9, 'Cùng commit, Mac và Ubuntu: cùng sha256')}
${slide('dv-01', 10, 'Byte 5–8 của gzip là GIỜ — Mac luôn ghi')}
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
<div class="callout warn"><strong>Đo bằng GNU gzip, trên Linux.</strong> "Nén từ ống dẫn" chỉ an toàn ở đó. gzip của Apple trên macOS ghi giờ hiện tại vào MTIME kể cả khi đọc từ ống dẫn — hai lần chạy cách nhau 1,2 giây cho hai mã băm khác nhau. Xem mục "Đính chính cho người dùng Mac" bên dưới; <code>gzip -n</code> mới là luật đúng ở mọi nơi.</div>

<h3>Công thức</h3>
${slide('dv-01', 13, 'Script đóng gói từ chối cây bẩn')}
<pre><code class="language-bash"><span class="tok-comment">#!/bin/bash</span>
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
<h3>Đính chính cho người dùng Mac: gzip của Apple đóng dấu GIỜ cả khi đọc từ ống dẫn</h3>
<p>Các phép đo ở trên dùng GNU gzip, bản mà máy chủ Linux nào cũng có. Trên Mac chúng KHÔNG còn đúng. Hai đầu vào một dòng giống hệt nhau, nén từ ống dẫn cách nhau 1,2 giây:</p>
<div class="out">── Ubuntu 24.04, gzip 1.12 ──
$ for i in 1 2; do echo hi | gzip | sha256sum; sleep 1.2; done
ec4d2c6f7706d3838a9c5c3d25338f2a3fada1f642591d5ae2b7cd50a73448dd  -
ec4d2c6f7706d3838a9c5c3d25338f2a3fada1f642591d5ae2b7cd50a73448dd  -
$ echo hi | gzip | xxd -l 10
00000000: 1f8b 0800 0000 0000 0003                 ..........
$ gzip -c f.txt | xxd -l 10
00000000: 1f8b 0808 c30f bb6a 0003                 .......j..

── macOS 27, Apple gzip 487.0.1 ──
$ for i in 1 2; do echo hi | gzip | shasum -a 256; sleep 1.2; done
f3168e9d7c43899e77df2e14b9f03b2601ab7e5a32f8270adb358baa80ed647e  -
c2b70c0e8789c85c78654f8bf11f4c703f023c6228268efe7823e6ea702fd8ea  -
$ echo hi | gzip | xxd -l 10
00000000: 1f8b 0800 bb0f bb6a 0003                 .......j..
$ echo hi | gzip -n | xxd -s 4 -l 4
00000004: 0000 0000                                ....</div>
<p>Đọc header từ trái sang phải: <code>1f 8b</code> là chữ ký của gzip, <code>08</code> nghĩa là nén deflate, byte thứ tư là trường cờ — ở đó <code>08</code> nghĩa là "theo sau có tên tệp", lý do trường hợp tệp-có-tên còn lưu cả chữ <code>f.txt</code> — và byte 5–8 là MTIME, byte thấp đứng trước. <code>c3 0f bb 6a</code> đọc ngược lại là <code>0x6abb0fc3</code> = 1790644163 giây = 01:09 UTC ngày 29/09/2026, đúng lúc tệp được ghi. Trên Mac, trường hợp <em>ống dẫn</em> mang <code>bb 0f bb 6a</code> — giờ hiện tại — nên câu "nén từ ống dẫn thì tái lập được" ĐÚNG với GNU gzip và SAI với gzip của Apple. <code>gzip -n</code> thì ghi bốn byte không ở cả hai.</p>
<div class="callout warn"><strong>Nên luật là <code>gzip -n</code>, luôn luôn — không phải "dùng ống dẫn".</strong> Công thức bên dưới đã làm vậy. Chỗ nó cắn người là script trên laptop: bạn cùng nhóm dựng tạo tác trên Mac, bạn dựng trên Linux, nội dung y hệt mà mã băm không bao giờ khớp, và rồi ai đó "sửa" bằng cách TẮT luôn phép so mã băm.</div>

<h3>Khi buộc phải dùng tar: SOURCE_DATE_EPOCH</h3>
${slide('dv-01', 11, 'tar thường khác nhau mỗi lần clone — SOURCE_DATE_EPOCH sửa được')}
${slide('dv-01', 12, 'Bảng cờ tar tái lập được — bsdtar không có')}
<p><code>git archive</code> là trường hợp dễ. Có lúc thứ bạn đóng gói không phải một commit — một thư mục <code>dist/</code> do bước build sinh ra, một thư mục tài nguyên được sinh — và thế là bạn quay về với <code>tar</code>. Hai bản clone mới của cùng một commit, cách nhau hai giây, đóng gói bằng <code>tar czf</code> thông thường:</p>
<div class="out">$ sha256sum tar-b1.tgz tar-b2.tgz
93349a073ebb98eeab748f6107ac9c2e68207b41944430f874a938aa04ffde6d  tar-b1.tgz
023236e18623e45025436597dde405f9cefbe0af8e8307f0f040d661f34e5476  tar-b2.tgz
$ tar tvzf tar-b1.tgz --full-time ./package.json
-rw-rw-r-- deploy/deploy   149 2026-09-29 01:08:47 ./package.json
$ tar tvzf tar-b2.tgz --full-time ./package.json
-rw-rw-r-- deploy/deploy   149 2026-09-29 01:08:49 ./package.json
$ cmp -l &lt;(zcat tar-b1.tgz) &lt;(zcat tar-b2.tgz) | wc -l
94</div>
<p>Nội dung y hệt, lệch nhau 94 byte. Lệnh clone ghi mọi tệp với giờ <em>HIỆN TẠI</em>, còn tar thì ghi lại mtime của từng tệp, tên người sở hữu và thứ tự mà thư mục tình cờ được đọc ra. Cách sửa là ghim chết từng thứ đó, và dự án reproducible-builds đặt cho cái giờ một tên chuẩn: <strong><code>SOURCE_DATE_EPOCH</code></strong> — một biến môi trường chứa "giờ của mã nguồn" dưới dạng giây Unix, thường là giờ commit — mà ngày càng nhiều công cụ build đọc THAY cho đồng hồ.</p>
<pre><code class="language-bash">export SOURCE_DATE_EPOCH=\$(git log -1 --format=%ct)      # 1790643600 = gio commit
PAX=exthdr.name=%d/PaxHeaders/%f,delete=atime,delete=ctime
tar --sort=name \\
    --mtime="@\$SOURCE_DATE_EPOCH" \\
    --owner=0 --group=0 --numeric-owner \\
    --pax-option="\$PAX" \\
    --exclude=.git -cf - . | gzip -n &gt; rep.tgz</code></pre>
<div class="out">$ sha256sum rep-b1.tgz rep-b2.tgz
2afd2824061855503159fc0efd92a891cd543d6d9b61046edf3d063d80d522ab  rep-b1.tgz
2afd2824061855503159fc0efd92a891cd543d6d9b61046edf3d063d80d522ab  rep-b2.tgz
$ tar tvzf rep-b1.tgz --full-time ./package.json
-rw-rw-r-- 0/0             149 2026-09-29 01:00:00 ./package.json</div>
<table>
<tr><th>Thứ rò rỉ vào tệp tar</th><th>Cờ GNU tar chặn nó</th><th>Nếu thiếu</th></tr>
<tr><td>mtime của từng tệp</td><td><code>--mtime="@\$SOURCE_DATE_EPOCH"</code></td><td>giờ clone/checkout — mỗi lần build một khác</td></tr>
<tr><td>thứ tự đọc thư mục</td><td><code>--sort=name</code> (tar 1.28 trở lên)</td><td>thứ tự nào hệ tệp trả về thì theo đó</td></tr>
<tr><td>tên và số của chủ, nhóm</td><td><code>--owner=0 --group=0 --numeric-owner</code></td><td><code>deploy/deploy</code>, uid 1000 — ai build thì ghi người đó</td></tr>
<tr><td>atime, ctime trong header PAX</td><td><code>--pax-option=…,delete=atime,delete=ctime</code></td><td>đổi mỗi lần tệp được đọc</td></tr>
<tr><td>MTIME của gzip</td><td><code>| gzip -n</code></td><td>giờ nén (Mac, tệp có tên)</td></tr>
<tr><td>thứ tự sắp xếp theo locale</td><td><code>LC_ALL=C</code> nếu sắp bằng <code>find | sort</code></td><td>máy đặt locale tiếng Việt sắp khác máy locale C</td></tr>
</table>
<p>bsdtar của macOS KHÔNG có cờ nào trong số đó:</p>
<div class="out">$ tar --sort=name -cf /dev/null .
tar: Option --sort=name is not supported
$ tar --mtime=@1790643600 -cf /dev/null .
tar: Option --mtime=@1790643600 is not supported
$ tar --version
bsdtar 3.5.3 - libarchive 3.7.4 zlib/1.2.12 liblzma/5.4.3 bz2lib/1.0.8</div>
<p>Trên Mac, hãy ưu tiên <code>git archive</code>, hoặc cài GNU tar (<code>brew install gnu-tar</code>, gọi bằng <code>gtar</code>) — tốt hơn nữa là dựng tạo tác ngay trên máy Linux sẽ chạy nó, điều mà Bài 1.3 lập luận vì những lý do khác.</p>

<h3>Cùng commit, khác máy — và ngoại lệ của Windows</h3>
<p>Dạng tái lập mạnh nhất là hai cái máy <em>KHÁC NHAU</em> cho ra cùng những byte. Đo với cùng một commit trên VPS thí nghiệm (git 2.43.0) và trên Mac (git 2.51.1):</p>
<div class="out">── Ubuntu, git 2.43.0 ──
$ git archive --format=tar.gz --prefix=app/ HEAD | sha256sum
5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  -
── macOS, git 2.51.1 ──
$ git archive --format=tar.gz --prefix=app/ HEAD | shasum -a 256
5319192c9d739e77b5660f016e5b960bf5d6300f255003cb4f0a38955df8081c  -</div>
<p>Giống hệt, qua hai hệ điều hành và hai phiên bản git — <code>--format=tar.gz</code> dùng bộ nén gzip dựng sẵn của chính git, thứ ghi MTIME bằng không. Ngoại lệ là một thiết lập mà phần lớn máy Windows đều có. Git for Windows thường chạy với <code>core.autocrlf=true</code>, và <code>git archive</code> áp phép chuyển đổi đó khi ghi tệp ra:</p>
<div class="out">$ git archive --format=tar HEAD | shasum -a 256 | cut -c1-16
4c0653cc7496e950
$ git -c core.autocrlf=true archive --format=tar HEAD | shasum -a 256 | cut -c1-16
e4ce4bda78ba3708
$ git -c core.autocrlf=true archive --format=tar HEAD src/server.js | tar xOf - | od -c | head -2
0000000    i   m   p   o   r   t       h   t   t   p       f   r   o   m
0000020        '   n   o   d   e   :   h   t   t   p   '   ;  \\r  \\n   h
$ echo '* text=auto eol=lf' &gt; .gitattributes
$ git -c core.autocrlf=true archive --worktree-attributes --format=tar HEAD | shasum -a 256 | cut -c1-16
4c0653cc7496e950</div>
<div class="pitfall co-tieu-de"><strong>Bẫy — tạo tác dựng trên Windows mang theo ký tự xuống dòng CRLF.</strong> Mã băm lệch với bản build trên Linux, và tệ hơn, một script shell bên trong giờ kết thúc mỗi dòng bằng <code>\\r</code>: lên máy chủ nó hỏng với <code>/bin/bash^M: bad interpreter</code>, hoặc với một biến mà giá trị có một ký tự về-đầu-dòng vô hình ở cuối. Hãy commit một <code>.gitattributes</code> có <code>* text=auto eol=lf</code> (ở trên nó được thử bằng <code>--worktree-attributes</code> trước khi commit; commit rồi thì <code>git archive</code> trơn tự đọc nó từ commit) và máy nào cũng cho ra LF.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> staging và production đều khai đang chạy "v2.1.0", vậy mà cư xử khác nhau. Chẳng ai nói được hai bên có cùng mã hay không. Hãy làm cho tạo tác của bạn CHỨNG MINH được, trên VPS thí nghiệm của Bài 1.1.</p><ol>
<li>Clone dự án hai lần (<code>git clone -q du-an b1; sleep 2; git clone -q du-an b2</code>) và ở mỗi bản dựng <code>git archive --format=tar --prefix=app/ HEAD | gzip -n</code>. So bằng <code>sha256sum</code>.</li>
<li>Ở mỗi bản clone chạy <code>tar czf ../tar-bN.tgz --exclude=.git .</code> trơn rồi so; tìm tệp đầu tiên lệch bằng <code>tar tvzf … --full-time</code>.</li>
<li>Lặp lại bước 2 với <code>SOURCE_DATE_EPOCH</code> và các cờ trong bảng, rồi so lại.</li>
<li>Lưu công thức thành <code>dong-goi.sh</code>, tạo một tệp chưa theo dõi, chạy nó và ghi lại mã thoát; xoá tệp đó rồi chạy lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bước 1 và 3 cho hai mã sha256 giống hệt, bước 2 cho hai mã khác nhau và bạn gọi tên được trường nào lệch, còn <code>dong-goi.sh</code> thoát 1 với cây bẩn và ghi ra <code>app-&lt;commit&gt;.tar.gz</code> kèm <code>.sha256</code> với cây sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reproducible build (bản dựng tái lập được)</span><span class="v">Bản dựng mà đầu ra giống tới từng bit mỗi lần, với cùng đầu vào, trên mọi máy.</span></div>
  <div class="kv"><span class="k">Checksum / sha256 (mã băm)</span><span class="v">"Dấu vân tay" 64 chữ số hex của các byte trong tệp; đổi một byte là ra giá trị khác hẳn.</span></div>
  <div class="kv"><span class="k">MTIME (giờ sửa trong header gzip)</span><span class="v">Byte 5–8 của tệp gzip: một dấu thời gian làm nội dung y hệt ra mã băm khác.</span></div>
  <div class="kv"><span class="k"><code>SOURCE_DATE_EPOCH</code> (giờ của mã nguồn)</span><span class="v">Biến môi trường chuẩn mang "giờ của mã nguồn" (thường là giờ commit) để công cụ build dùng thay cho đồng hồ.</span></div>
  <div class="kv"><span class="k"><code>export-ignore</code> (bỏ khi xuất)</span><span class="v">Thuộc tính trong <code>.gitattributes</code> giữ một đường dẫn đã commit ra khỏi RIÊNG <code>git archive</code>.</span></div>
  <div class="kv"><span class="k">Dirty tree (cây bẩn)</span><span class="v">Cây làm việc còn thay đổi chưa commit hoặc tệp chưa theo dõi; tạo tác dựng từ nó không khớp tên commit.</span></div>
  <div class="kv"><span class="k">CRLF / LF (kiểu xuống dòng)</span><span class="v">Xuống dòng kiểu Windows và kiểu Unix; <code>core.autocrlf=true</code> làm <code>git archive</code> xuất CRLF.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>git archive</code> của một commit tái lập tới từng byte — đo giống hệt qua hai bản clone, hai máy và hai phiên bản git.</li>
<li>Byte 5–8 của gzip chứa giờ; GNU gzip ghi số không khi đọc ống dẫn, gzip của Apple ghi giờ hiện tại — dùng <code>gzip -n</code> ở mọi nơi.</li>
<li><code>tar</code> trơn trên một bản clone mới lệch mỗi lần; <code>SOURCE_DATE_EPOCH</code> cộng <code>--sort=name</code>, ghim chủ sở hữu và <code>gzip -n</code> làm nó giống hệt.</li>
<li>bsdtar của macOS không có các cờ đó; hãy build trên Linux, dùng <code>git archive</code>, hoặc cài <code>gtar</code>.</li>
<li><code>core.autocrlf=true</code> nhét CRLF vào tạo tác dựng trên Windows; <code>* text=auto eol=lf</code> trong <code>.gitattributes</code> sửa được.</li>
<li>Script đóng gói phải từ chối cây bẩn, không thì cái tên trên tạo tác nói dối về nội dung của nó.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">reproducible-builds.org — SOURCE_DATE_EPOCH</span><span class="lc-sub">reproducible-builds.org/docs/source-date-epoch — đặc tả của biến này, và công cụ nào tôn trọng nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">reproducible-builds.org — Siêu dữ liệu trong tệp nén</span><span class="lc-sub">reproducible-builds.org/docs/archives — giải thích từng cờ <code>--sort=name</code>, <code>--mtime</code>, chủ sở hữu và PAX.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">git-archive(1)</span><span class="lc-sub">git-scm.com/docs/git-archive — <code>--prefix</code>, <code>--format</code>, <code>--worktree-attributes</code>, và cách giờ commit trở thành giờ của tệp.</span></span></div>
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
${slide('dv-01', 14, 'npm ci từ chối — npm install tự ý sửa')}
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
${slide('dv-01', 17, 'set -e tắt trong danh sách || và &&')}
<p>Demonstrating the above, the obvious test was written like this — and it printed the wrong answer:</p>
<div class="out">── A) subshell nam trong mot danh sach || (viet SAI) ──
     ...DI TIEP (set -e KHONG co tac dung o day)
── B) script THAT: set -e o dau tep, lenh dung mot minh ──
     ma thoat cua script B: 1</div>
<pre><code class="language-bash"><span class="tok-comment"># A — set -e bi VO HIEU o day</span>
( set -e; npm ci; echo "di tiep" ) || echo "dung lai"

<span class="tok-comment"># B — set -e co hieu luc</span>
set -e
npm ci
echo "di tiep"</code></pre>
<div class="pitfall"><strong>Trap — <code>set -e</code> is disabled for any command that is part of a <code>&amp;&amp;</code> or <code>||</code> list.</strong> This is documented in <code>man bash</code> and it is easy to walk into: the moment you write <code>lenh || xu-ly-loi</code>, the failure inside <code>lenh</code> no longer aborts anything — including failures several commands deep inside a subshell. In case A the failing <code>npm ci</code> was invisible and the script cheerfully continued. A deploy script full of <code>|| echo "canh bao"</code> has quietly turned off its own safety, and every step after the first failure runs against a half-built release. Chapter 7 builds a script that does not have this hole.</div>

<h3>Where the build should happen</h3>
${slide('dv-01', 18, 'Dựng ở đâu: khớp NỀN TẢNG, không phải vị trí')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">On the target machine — simplest, and the default answer</span><span class="lz-d">Ship source, run <code>npm ci</code> there. Native modules compile against the machine that will run them, which removes an entire category of failure. The cost is CPU and memory on a server that may not have much of either — Chapter 8 measures a build being killed for exactly that reason.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">In an image built for the target — the container answer</span><span class="lz-d">The build runs wherever you like, but inside the same base image the server will run. The platform match is what matters, not the location. This is the path this repository uses: build at home, push to a registry, the server only swaps.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">On a build machine that matches the target — workable, with care</span><span class="lz-d">Same OS, same architecture, same libc, same runtime version. Every one of those is a thing that can drift out of sync silently, and the drift is only discovered in production.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">On your laptop, copied up — the one that breaks</span><span class="lz-d">macOS to Linux, or Alpine to Debian, and any dependency with a compiled component is now wrong. It works for pure-JavaScript projects right up until one dependency adds a native module in a patch release.</span></div>
</div>
<div class="callout"><strong>The failure this repository actually had.</strong> An image was built from the wrong Dockerfile — <code>node:22-alpine</code>, which is musl — while carrying a Prisma engine compiled for <code>debian-openssl-3.0.x</code>, which is glibc. The build was green, the push was green, the swap was green, and then the backend restart-looped and the API returned 502 for seven minutes. Nothing before production could see it, because every check up to that point was checking the <em>build</em>, and the build was fine. The lesson written afterwards was: a green build does not mean a runnable image.</div>

<h3>What a lockfile can and cannot promise</h3>
${slide('dv-01', 15, 'node_modules chép từ Mac chết trên Linux')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">It pins the version and the integrity hash</span><span class="lz-lnote">Same versions, same contents, verified. This is the part that works, and it is most of the value.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not pin the platform</span><span class="lz-lnote">A native module resolves to a different binary on a different OS or architecture. The lockfile is satisfied; the artifact is not portable.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not pin your runtime</span><span class="lz-lnote">Node 20 and Node 22 install the same tree and can behave differently. Pin the runtime separately — <code>engines</code>, <code>.nvmrc</code>, a base image tag — and check it in the deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">It does not stop install scripts running</span><span class="lz-lnote"><code>postinstall</code> hooks execute arbitrary code at install time, on the server, as whoever ran the deploy. <code>npm ci --ignore-scripts</code> is worth considering, if your dependencies can live without them.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># buoc dung, tren may dich, dang toi thieu</span>
set -euo pipefail
node --version | grep -q '^v22\\.' || { echo "Sai phien ban Node" &gt;&amp;2; exit 1; }
npm ci --omit=dev --no-audit --no-fund
npm run build
<span class="tok-comment"># tao tac gio la: nguon + node_modules + dist, dung tren MAY NAY</span></code></pre>
<div class="note-ct"><code>--omit=dev</code> leaves out development dependencies, which is usually most of the tree — but only if your build does not need them. If <code>npm run build</code> needs TypeScript and TypeScript is a dev dependency, install everything, build, then prune with <code>npm prune --omit=dev</code>. Getting this backwards produces a build that fails on the server and works everywhere else.</div>
<h3>Run it: node_modules from a Mac on a Linux server</h3>
${slide('dv-01', 16, 'Hai lần npm ci: cùng một cây tới từng byte')}
<p>The pitfall in Lesson 1.1 said native packages break when copied between platforms. Here it is happening. A two-package project — just <code>esbuild@0.24.0</code>, a bundler whose real work is done by a compiled Go binary — installed on the Mac, then its <code>node_modules</code> copied to the lab VPS:</p>
<div class="out">$ ls node_modules/@esbuild
darwin-arm64
$ node -e 'require("esbuild").transformSync("let a=1")'
/home/deploy/native/node_modules/esbuild/lib/main.js:2148
      throw reject;
      ^

Error:
You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.

Specifically the "@esbuild/darwin-arm64" package is present but this platform
needs the "@esbuild/linux-arm64" package instead. …
$ npm ci
added 2 packages in 5s
$ ls node_modules/@esbuild
linux-arm64
$ node -e 'console.log(require("esbuild").transformSync("let a = 1").code)'
let a = 1;</div>
<p>Same lockfile, same command, different result — and correct both times. The lockfile lists every platform's binary as an optional dependency (<code>grep -c '"node_modules/@esbuild/' package-lock.json</code> prints <strong>24</strong>), and <code>npm ci</code> picks the one matching the machine it runs on. The lockfile pins <em>which version</em>; the machine decides <em>which binary</em>. That choice is only right if it is made on the machine that will run the code. esbuild prints a helpful message; a Prisma engine or a <code>bcrypt</code> build usually just crashes with a missing shared library.</p>

<h3>Is <code>npm ci</code> itself reproducible? Measured</h3>
<p>If the artifact is "source plus the result of <code>npm ci</code> on the target", the next question is whether <code>npm ci</code> gives the same tree twice. The lab project (express 4.21.2 and typescript 5.6.3, 70 packages), hashing every installed file:</p>
<pre><code class="language-bash">bam() { find node_modules -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -c1-16; }
npm ci --no-audit --no-fund; echo "lan 1: \$(bam)  \$(find node_modules -type f | wc -l) tep"
npm ci --no-audit --no-fund; echo "lan 2: \$(bam)"
npm ci --omit=dev --no-audit --no-fund; echo "omit=dev: \$(bam)  …"</code></pre>
<div class="out">added 70 packages in 983ms
lan 1: 6d234c86513366d5  743 tep
added 70 packages in 714ms
lan 2: 6d234c86513366d5
added 69 packages in 448ms
omit=dev: 6c444d08bf053094  622 tep, 4.4M</div>
<p>The file <em>contents</em> are identical across runs — the lockfile's <code>integrity</code> hashes guarantee exactly that. What is not identical is metadata: npm 9 stamps every file with the <em>install</em> time, so a tarball of the directory — or rsync's hardlinking in Lesson 1.5 — sees two different trees. "Same tree" is true of the bytes the code executes, not of the directory's timestamps. Dropping devDependencies took the tree from 27 MB and 743 files to 4.4 MB and 622 — here TypeScript alone is most of the weight.</p>
<table>
<tr><th><code>npm ci</code> flag</th><th>What it does</th><th>Use it when</th></tr>
<tr><td><code>--omit=dev</code></td><td>skips devDependencies</td><td>the build does not need them (or after the build, via <code>npm prune --omit=dev</code>)</td></tr>
<tr><td><code>--ignore-scripts</code></td><td>does not run <code>preinstall</code>/<code>postinstall</code> hooks</td><td>your dependencies work without them — then install scripts cannot run arbitrary code on the server</td></tr>
<tr><td><code>--no-audit --no-fund</code></td><td>skips the vulnerability lookup and the funding message</td><td>always, in a deploy script: fewer network calls, quieter logs</td></tr>
<tr><td><code>--prefer-offline</code></td><td>uses the <code>~/.npm</code> cache before the network</td><td>the server's connection is slow or flaky</td></tr>
<tr><td><code>--loglevel=error</code></td><td>prints errors only</td><td>you want the deploy log to show what failed, not 70 lines of progress</td></tr>
</table>
<div class="note-ct">On the name: npm's documentation lists <code>clean-install</code> as an alias of <code>npm ci</code> and describes it as meant "for automated environments such as test platforms, continuous integration, and deployment". Both readings of "ci" point at the same behaviour — install the lockfile exactly, or fail — which is what this lesson relies on.</div>

<h3>The runtime check, run for real</h3>
<p>The lockfile does not pin Node. On the lab VPS Node came from Ubuntu's own packages, which is exactly how many servers get it:</p>
<pre><code class="language-bash">set -euo pipefail
node --version | grep -q "^v22\\." || { echo "Sai phien ban Node: \$(node --version)" &gt;&amp;2; exit 1; }
npm ci --omit=dev</code></pre>
<div class="out">$ bash D.sh; echo "ma thoat: \$?"
Sai phien ban Node: v18.19.1
ma thoat: 1</div>
<p>The Mac runs Node 22.21.0, <code>apt install nodejs</code> on Ubuntu 24.04 gives 18.19.1 — four major versions apart, and the project would have installed without complaint and failed later, somewhere less obvious. One line at the top of the build turns that into a clean refusal before anything is touched. Pin the version in one place (<code>.nvmrc</code>, <code>engines</code> in <code>package.json</code>, or the base image tag in Chapter 13) and make the deploy check it.</p>
<p>The same lab also re-ran the <code>set -e</code> aside with a real lockfile conflict (<code>package.json</code> asking for <code>express ^3.0.0</code>, lockfile pinning 4.21.2), including the variant people write to "be safe":</p>
<div class="out">== A: ( set -e; npm ci; echo di tiep ) || echo dung lai
di tiep — npm ci da hong ma KHONG ai dung
== B: set -e o dau tep, npm ci dung mot minh
ma thoat cua B: 1
== C: set -e + "|| echo canh bao"
canh bao: npm ci hong
di tiep sang buoc build
ma thoat cua C: 0</div>
<p>Case C is the one found in real deploy scripts: the warning is printed, the build step runs against a half-installed tree, and the script exits <strong>0</strong>. If you want a message <em>and</em> a stop, write <code>npm ci || { echo "npm ci hong" &gt;&amp;2; exit 1; }</code>.</p>

<h3>On Windows/WSL and macOS</h3>
<p>Everything above applies with more force on Windows: <code>npm ci</code> there installs <code>win32</code> binaries, so a <code>node_modules</code> from a teammate's Windows laptop is wrong for Linux in the same way the Mac one was. In WSL, run <code>npm ci</code> inside WSL, in a project that lives in the Linux filesystem; do not share one <code>node_modules</code> between Windows and WSL — whichever side installed it, the other side gets the wrong binaries. On a Mac with Apple silicon, a Linux container defaults to <code>linux/arm64</code>, while most VPSs are <code>x86_64</code>: the esbuild error above would have said <code>linux-x64</code>. Chapter 13 covers building images for the right architecture with <code>--platform</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate merged their branch and <code>package.json</code> no longer matches <code>package-lock.json</code>. The deploy is tonight. Find out what each install command would do on the server, on the lab VPS.</p><ol>
<li>In a copy of your project, change one dependency range in <code>package.json</code> by hand so it no longer matches the lockfile. Run <code>npm ci; echo \$?</code> and note the error code and exit status.</li>
<li>Keep the mismatch and run <code>cp package-lock.json /tmp/lock.bak; npm install; echo \$?; diff -q package-lock.json /tmp/lock.bak</code>. Note which version got installed.</li>
<li>Write a build script with <code>set -euo pipefail</code>, a Node version check and <code>npm ci --omit=dev</code>; run it once as written and once with <code>|| echo "canh bao"</code> after <code>npm ci</code>.</li>
<li>Run <code>npm ci</code> twice on a clean copy and compare the <code>bam</code> hash from this lesson.</li>
</ol>
<p><strong>Done when:</strong> you can state "npm ci: exit 1, lockfile unchanged; npm install: exit 0, lockfile rewritten, version X installed", the <code>|| echo</code> variant exits 0 while the plain one exits 1, and the two <code>bam</code> hashes match.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lockfile</span><span class="v"><code>package-lock.json</code>: the exact version, download URL and integrity hash of every package in the tree.</span></div>
  <div class="kv"><span class="k"><code>npm ci</code> (clean install)</span><span class="v">Deletes <code>node_modules</code> and installs exactly the lockfile; fails if <code>package.json</code> disagrees.</span></div>
  <div class="kv"><span class="k">devDependencies</span><span class="v">Packages needed to build or test (TypeScript, test runners), not to run.</span></div>
  <div class="kv"><span class="k">Native module</span><span class="v">A package containing compiled machine code, valid for one OS, CPU and C library only.</span></div>
  <div class="kv"><span class="k">glibc / musl</span><span class="v">The two common C libraries on Linux: Debian/Ubuntu use glibc, Alpine uses musl; binaries for one do not run on the other.</span></div>
  <div class="kv"><span class="k">Install script (<code>postinstall</code>)</span><span class="v">Code a package runs at install time, on your server, with your permissions.</span></div>
  <div class="kv"><span class="k"><code>set -e</code> (errexit)</span><span class="v">"Stop at the first failing command" — silently switched off inside <code>&amp;&amp;</code>/<code>||</code> lists and <code>if</code> conditions.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>On a server, <code>npm ci</code>: it installs the lockfile exactly or exits 1; <code>npm install</code> rewrites the lockfile and exits 0.</li>
<li>The lockfile pins versions, not platforms: measured, a Mac <code>node_modules</code> made esbuild refuse to run on Linux; <code>npm ci</code> on the server fixed it.</li>
<li>Two <code>npm ci</code> runs gave byte-identical file contents; only the file timestamps differ.</li>
<li>Pin and check the Node version in the deploy — the lab's apt Node was 18 while the dev machine ran 22.</li>
<li><code>lenh || echo "canh bao"</code> turns off <code>set -e</code> for that command: the script ran on and exited 0.</li>
<li>Build where the platform matches the target — on it, or in an image made for it; never copy <code>node_modules</code> up.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">npm ci — npm Docs (v10)</span><span class="lc-sub">docs.npmjs.com/cli/v10/commands/npm-ci — aliases, the "automated environments" description, and every flag in the table above.</span></span></div>
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
${slide('dv-01', 14, 'npm ci từ chối — npm install tự ý sửa')}
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
${slide('dv-01', 17, 'set -e tắt trong danh sách || và &&')}
<p>Trong lúc chứng minh điều trên, phép thử hiển nhiên được viết thế này — và nó in ra câu trả lời SAI:</p>
<div class="out">── A) subshell nam trong mot danh sach || (viet SAI) ──
     ...DI TIEP (set -e KHONG co tac dung o day)
── B) script THAT: set -e o dau tep, lenh dung mot minh ──
     ma thoat cua script B: 1</div>
<pre><code class="language-bash"><span class="tok-comment"># A — set -e bi VO HIEU o day</span>
( set -e; npm ci; echo "di tiep" ) || echo "dung lai"

<span class="tok-comment"># B — set -e co hieu luc</span>
set -e
npm ci
echo "di tiep"</code></pre>
<div class="pitfall"><strong>Bẫy — <code>set -e</code> bị VÔ HIỆU với bất kỳ lệnh nào nằm trong một danh sách <code>&amp;&amp;</code> hoặc <code>||</code>.</strong> Chuyện này có ghi trong <code>man bash</code> và rất dễ sa vào: ngay khoảnh khắc bạn viết <code>lenh || xu-ly-loi</code>, cái lỗi bên trong <code>lenh</code> thôi không còn huỷ bỏ thứ gì nữa — kể cả những lỗi nằm sâu vài lệnh bên trong một subshell. Ở ca A, lệnh <code>npm ci</code> hỏng trở nên VÔ HÌNH và cái script vui vẻ đi tiếp. Một script deploy đầy những <code>|| echo "canh bao"</code> là một script đã lặng lẽ TỰ TẮT cơ chế an toàn của chính nó, và mọi bước sau cái lỗi đầu tiên đều chạy trên một bản phát hành dựng dở. Chương 7 dựng một script không có cái lỗ này.</div>

<h3>Bước dựng nên xảy ra ở đâu</h3>
${slide('dv-01', 18, 'Dựng ở đâu: khớp NỀN TẢNG, không phải vị trí')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trên chính máy đích — đơn giản nhất, và là câu trả lời mặc định</span><span class="lz-d">Gửi mã nguồn lên, chạy <code>npm ci</code> ngay đó. Module native được biên dịch theo đúng cái máy sẽ chạy chúng, và điều đó loại bỏ nguyên một loại lỗi. Cái giá là CPU và bộ nhớ trên một máy chủ có thể chẳng dư dả gì — Chương 8 đo một lần dựng bị giết vì đúng lý do đó.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trong một cái ảnh dựng CHO máy đích — câu trả lời của container</span><span class="lz-d">Bước dựng chạy ở đâu tuỳ bạn, nhưng bên trong đúng cái ảnh nền mà máy chủ sẽ chạy. Thứ quan trọng là KHỚP NỀN TẢNG, không phải vị trí. Đây là đường mà kho mã này đang dùng: dựng ở nhà, đẩy lên registry, máy chủ chỉ tráo.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Trên một máy dựng khớp với máy đích — làm được, nếu cẩn thận</span><span class="lz-d">Cùng hệ điều hành, cùng kiến trúc, cùng thư viện C, cùng phiên bản runtime. Mỗi thứ trong đó đều là một thứ có thể lặng lẽ trôi lệch, và việc trôi lệch chỉ bị phát hiện trên production.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Trên laptop của bạn rồi chép lên — đường VỠ</span><span class="lz-d">macOS lên Linux, hay Alpine lên Debian, và bất kỳ phụ thuộc nào có phần biên dịch đều thành SAI. Nó chạy ngon với dự án thuần JavaScript, cho tới đúng lúc một phụ thuộc thêm một module native trong một bản vá nhỏ.</span></div>
</div>
<div class="callout"><strong>Sự cố mà kho mã này ĐÃ THẬT SỰ gặp.</strong> Một cái ảnh được dựng từ nhầm Dockerfile — <code>node:22-alpine</code>, tức là musl — trong khi mang theo một engine Prisma biên dịch cho <code>debian-openssl-3.0.x</code>, tức là glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi backend restart vô tận và API trả 502 suốt bảy phút. Không có gì TRƯỚC production nhìn thấy được, vì mọi phép kiểm tới thời điểm ấy đều đang kiểm cái <em>BẢN DỰNG</em>, mà bản dựng thì ổn. Bài học viết ra sau đó là: một bản dựng xanh KHÔNG có nghĩa là một cái ảnh chạy được.</div>

<h3>Một tệp khoá hứa được gì và KHÔNG hứa được gì</h3>
${slide('dv-01', 15, 'node_modules chép từ Mac chết trên Linux')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó ghim phiên bản và mã băm toàn vẹn</span><span class="lz-lnote">Cùng phiên bản, cùng nội dung, có kiểm chứng. Đây là phần CHẠY ĐƯỢC, và nó là phần lớn giá trị.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG ghim nền tảng</span><span class="lz-lnote">Một module native giải ra một nhị phân khác trên hệ điều hành hay kiến trúc khác. Tệp khoá thoả mãn; cái tạo tác thì không mang đi được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG ghim runtime của bạn</span><span class="lz-lnote">Node 20 và Node 22 cài ra cùng một cây và có thể cư xử khác nhau. Hãy ghim runtime RIÊNG — bằng <code>engines</code>, <code>.nvmrc</code>, một tag ảnh nền — và kiểm nó trong lúc deploy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG ngăn script cài đặt chạy</span><span class="lz-lnote">Các hook <code>postinstall</code> thực thi mã tuỳ ý ngay lúc cài, trên máy chủ, dưới quyền người chạy deploy. <code>npm ci --ignore-scripts</code> đáng cân nhắc, nếu đám phụ thuộc của bạn sống được mà không cần chúng.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># buoc dung, tren may dich, dang toi thieu</span>
set -euo pipefail
node --version | grep -q '^v22\\.' || { echo "Sai phien ban Node" &gt;&amp;2; exit 1; }
npm ci --omit=dev --no-audit --no-fund
npm run build
<span class="tok-comment"># tao tac gio la: nguon + node_modules + dist, dung tren MAY NAY</span></code></pre>
<div class="note-ct"><code>--omit=dev</code> bỏ ra ngoài đám phụ thuộc dành cho phát triển, mà đó thường là phần lớn cái cây — nhưng chỉ khi bước dựng của bạn KHÔNG cần tới chúng. Nếu <code>npm run build</code> cần TypeScript mà TypeScript lại là một dev dependency, thì hãy cài hết, dựng, rồi tỉa đi bằng <code>npm prune --omit=dev</code>. Làm ngược thứ tự này sinh ra một bản dựng hỏng trên máy chủ và chạy tốt ở mọi nơi khác.</div>
<h3>Chạy thử: node_modules của Mac trên máy chủ Linux</h3>
${slide('dv-01', 16, 'Hai lần npm ci: cùng một cây tới từng byte')}
<p>Hộp bẫy ở Bài 1.1 nói gói native sẽ vỡ khi bị chép giữa hai nền tảng. Đây là lúc nó xảy ra thật. Một dự án hai gói — chỉ có <code>esbuild@0.24.0</code>, một bộ đóng gói mà phần việc thật do một tệp nhị phân Go đã biên dịch đảm nhận — được cài trên Mac, rồi chép nguyên <code>node_modules</code> lên VPS thí nghiệm:</p>
<div class="out">$ ls node_modules/@esbuild
darwin-arm64
$ node -e 'require("esbuild").transformSync("let a=1")'
/home/deploy/native/node_modules/esbuild/lib/main.js:2148
      throw reject;
      ^

Error:
You installed esbuild for another platform than the one you're currently using.
This won't work because esbuild is written with native code and needs to
install a platform-specific binary executable.

Specifically the "@esbuild/darwin-arm64" package is present but this platform
needs the "@esbuild/linux-arm64" package instead. …
$ npm ci
added 2 packages in 5s
$ ls node_modules/@esbuild
linux-arm64
$ node -e 'console.log(require("esbuild").transformSync("let a = 1").code)'
let a = 1;</div>
<p>Cùng tệp khoá, cùng lệnh, kết quả khác nhau — và cả hai lần đều ĐÚNG. Tệp khoá liệt kê nhị phân của MỌI nền tảng dưới dạng phụ thuộc tuỳ chọn (<code>grep -c '"node_modules/@esbuild/' package-lock.json</code> in ra <strong>24</strong>), và <code>npm ci</code> chọn đúng cái khớp với máy nó đang chạy. Tệp khoá ghim <em>PHIÊN BẢN nào</em>; cái máy quyết định <em>NHỊ PHÂN nào</em>. Lựa chọn đó chỉ đúng khi nó được đưa ra ngay trên cái máy sẽ chạy mã. esbuild còn in ra lời nhắn tử tế; một engine Prisma hay một bản build <code>bcrypt</code> thường chỉ sập với lỗi thiếu thư viện dùng chung.</p>

<h3><code>npm ci</code> tự nó có tái lập được không? Đo thật</h3>
<p>Nếu tạo tác là "mã nguồn cộng kết quả của <code>npm ci</code> trên máy đích", thì câu hỏi kế tiếp là <code>npm ci</code> chạy hai lần có ra cùng một cây không. Dự án thí nghiệm (express 4.21.2 và typescript 5.6.3, 70 gói), băm từng tệp đã cài:</p>
<pre><code class="language-bash">bam() { find node_modules -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -c1-16; }
npm ci --no-audit --no-fund; echo "lan 1: \$(bam)  \$(find node_modules -type f | wc -l) tep"
npm ci --no-audit --no-fund; echo "lan 2: \$(bam)"
npm ci --omit=dev --no-audit --no-fund; echo "omit=dev: \$(bam)  …"</code></pre>
<div class="out">added 70 packages in 983ms
lan 1: 6d234c86513366d5  743 tep
added 70 packages in 714ms
lan 2: 6d234c86513366d5
added 69 packages in 448ms
omit=dev: 6c444d08bf053094  622 tep, 4.4M</div>
<p><em>NỘI DUNG</em> tệp giống hệt nhau qua các lần chạy — mã băm <code>integrity</code> trong tệp khoá bảo đảm đúng điều đó. Thứ KHÔNG giống là siêu dữ liệu: npm 9 đóng dấu mọi tệp bằng giờ <em>CÀI</em>, nên một tệp nén của cả thư mục — hay cơ chế liên kết cứng của rsync ở Bài 1.5 — sẽ thấy hai cây khác nhau. "Cùng một cây" đúng với các byte mà mã THỰC THI, không đúng với dấu thời gian của thư mục. Bỏ devDependencies đưa cây từ 27 MB, 743 tệp xuống 4,4 MB, 622 tệp — ở đây riêng TypeScript đã là phần lớn trọng lượng.</p>
<table>
<tr><th>Cờ của <code>npm ci</code></th><th>Làm gì</th><th>Dùng khi</th></tr>
<tr><td><code>--omit=dev</code></td><td>bỏ qua devDependencies</td><td>bước build KHÔNG cần chúng (hoặc sau build, bằng <code>npm prune --omit=dev</code>)</td></tr>
<tr><td><code>--ignore-scripts</code></td><td>không chạy hook <code>preinstall</code>/<code>postinstall</code></td><td>phụ thuộc của bạn sống được không cần chúng — khi đó script cài đặt không thể chạy mã tuỳ ý trên máy chủ</td></tr>
<tr><td><code>--no-audit --no-fund</code></td><td>bỏ tra lỗ hổng và lời kêu gọi tài trợ</td><td>luôn luôn, trong script deploy: ít lượt gọi mạng hơn, log gọn hơn</td></tr>
<tr><td><code>--prefer-offline</code></td><td>dùng cache <code>~/.npm</code> trước khi lên mạng</td><td>đường mạng của máy chủ chậm hoặc chập chờn</td></tr>
<tr><td><code>--loglevel=error</code></td><td>chỉ in lỗi</td><td>muốn log deploy chỉ ra cái gì hỏng, không phải 70 dòng tiến độ</td></tr>
</table>
<div class="note-ct">Về cái tên: tài liệu của npm ghi <code>clean-install</code> là một bí danh của <code>npm ci</code> và mô tả nó dành "cho môi trường tự động như nền tảng kiểm thử, tích hợp liên tục (CI) và deploy". Cả hai cách hiểu chữ "ci" đều chỉ về cùng một hành vi — cài ĐÚNG tệp khoá, hoặc hỏng — và đó là thứ bài này dựa vào.</div>

<h3>Phép kiểm runtime, chạy thật</h3>
<p>Tệp khoá KHÔNG ghim Node. Trên VPS thí nghiệm, Node lấy từ kho gói của chính Ubuntu — y như cách rất nhiều máy chủ có Node:</p>
<pre><code class="language-bash">set -euo pipefail
node --version | grep -q "^v22\\." || { echo "Sai phien ban Node: \$(node --version)" &gt;&amp;2; exit 1; }
npm ci --omit=dev</code></pre>
<div class="out">$ bash D.sh; echo "ma thoat: \$?"
Sai phien ban Node: v18.19.1
ma thoat: 1</div>
<p>Máy Mac chạy Node 22.21.0, còn <code>apt install nodejs</code> trên Ubuntu 24.04 cho ra 18.19.1 — lệch nhau bốn phiên bản major, và dự án lẽ ra vẫn cài êm ru rồi hỏng về sau, ở một chỗ khó thấy hơn. Một dòng ở đầu bước build biến chuyện đó thành một lời từ chối sạch sẽ trước khi có thứ gì bị đụng tới. Hãy ghim phiên bản ở MỘT chỗ (<code>.nvmrc</code>, <code>engines</code> trong <code>package.json</code>, hoặc tag ảnh nền ở Chương 13) và bắt quy trình deploy kiểm nó.</p>
<p>Cũng phòng thí nghiệm đó chạy lại chuyện lạc đề <code>set -e</code> với một mâu thuẫn tệp khoá thật (<code>package.json</code> đòi <code>express ^3.0.0</code>, tệp khoá ghim 4.21.2), kèm cả biến thể người ta hay viết "cho chắc":</p>
<div class="out">== A: ( set -e; npm ci; echo di tiep ) || echo dung lai
di tiep — npm ci da hong ma KHONG ai dung
== B: set -e o dau tep, npm ci dung mot minh
ma thoat cua B: 1
== C: set -e + "|| echo canh bao"
canh bao: npm ci hong
di tiep sang buoc build
ma thoat cua C: 0</div>
<p>Ca C là ca bắt gặp trong script deploy thật: lời cảnh báo được in ra, bước build chạy trên một cây cài dở, và script thoát <strong>0</strong>. Muốn vừa có lời nhắn <em>VỪA</em> dừng lại thì viết <code>npm ci || { echo "npm ci hong" &gt;&amp;2; exit 1; }</code>.</p>

<h3>Trên Windows/WSL và macOS khác gì</h3>
<p>Mọi điều ở trên còn nặng hơn trên Windows: <code>npm ci</code> ở đó cài nhị phân <code>win32</code>, nên một <code>node_modules</code> từ laptop Windows của bạn cùng nhóm sai với Linux y như cái của Mac. Trong WSL, hãy chạy <code>npm ci</code> BÊN TRONG WSL, với dự án nằm trong hệ tệp Linux; đừng dùng chung một <code>node_modules</code> giữa Windows và WSL — bên nào cài thì bên kia nhận nhị phân sai. Trên Mac chip Apple, container Linux mặc định là <code>linux/arm64</code>, trong khi phần lớn VPS là <code>x86_64</code>: lỗi esbuild ở trên lẽ ra sẽ đòi <code>linux-x64</code>. Chương 13 dạy dựng ảnh cho đúng kiến trúc bằng <code>--platform</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm vừa gộp nhánh và <code>package.json</code> không còn khớp <code>package-lock.json</code>. Tối nay deploy. Hãy tìm ra mỗi lệnh cài sẽ làm gì trên máy chủ, ngay trên VPS thí nghiệm.</p><ol>
<li>Trong một bản sao dự án, sửa tay khoảng phiên bản của một phụ thuộc trong <code>package.json</code> để nó lệch tệp khoá. Chạy <code>npm ci; echo \$?</code> và ghi lại mã lỗi cùng mã thoát.</li>
<li>Giữ nguyên chỗ lệch và chạy <code>cp package-lock.json /tmp/lock.bak; npm install; echo \$?; diff -q package-lock.json /tmp/lock.bak</code>. Ghi lại phiên bản nào đã được cài.</li>
<li>Viết một script build có <code>set -euo pipefail</code>, phép kiểm phiên bản Node và <code>npm ci --omit=dev</code>; chạy một lần như vậy và một lần có thêm <code>|| echo "canh bao"</code> sau <code>npm ci</code>.</li>
<li>Chạy <code>npm ci</code> hai lần trên một bản sao sạch và so mã băm <code>bam</code> của bài này.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được "npm ci: thoát 1, tệp khoá không đổi; npm install: thoát 0, tệp khoá bị ghi lại, đã cài bản X", biến thể <code>|| echo</code> thoát 0 trong khi bản trơn thoát 1, và hai mã <code>bam</code> khớp nhau.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Lockfile (tệp khoá phiên bản)</span><span class="v"><code>package-lock.json</code>: phiên bản chính xác, địa chỉ tải và mã băm toàn vẹn của mọi gói trong cây.</span></div>
  <div class="kv"><span class="k"><code>npm ci</code> (cài sạch)</span><span class="v">Xoá <code>node_modules</code> rồi cài ĐÚNG tệp khoá; hỏng ngay nếu <code>package.json</code> không khớp.</span></div>
  <div class="kv"><span class="k">devDependencies (phụ thuộc lúc phát triển)</span><span class="v">Gói cần để build hoặc kiểm thử (TypeScript, bộ chạy test), không cần để chạy.</span></div>
  <div class="kv"><span class="k">Native module (module có mã máy)</span><span class="v">Gói chứa mã máy đã biên dịch, chỉ đúng với một hệ điều hành, một CPU và một thư viện C.</span></div>
  <div class="kv"><span class="k">glibc / musl (thư viện C)</span><span class="v">Hai thư viện C phổ biến trên Linux: Debian/Ubuntu dùng glibc, Alpine dùng musl; nhị phân của bên này không chạy trên bên kia.</span></div>
  <div class="kv"><span class="k">Install script — <code>postinstall</code> (script cài đặt)</span><span class="v">Mã mà một gói chạy lúc cài, trên máy chủ của bạn, với quyền của bạn.</span></div>
  <div class="kv"><span class="k"><code>set -e</code> (errexit — dừng khi lỗi)</span><span class="v">"Dừng ở lệnh hỏng đầu tiên" — bị lặng lẽ tắt bên trong danh sách <code>&amp;&amp;</code>/<code>||</code> và điều kiện <code>if</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trên máy chủ dùng <code>npm ci</code>: nó cài đúng tệp khoá hoặc thoát 1; <code>npm install</code> ghi lại tệp khoá và thoát 0.</li>
<li>Tệp khoá ghim phiên bản, không ghim nền tảng: đo thật, <code>node_modules</code> của Mac làm esbuild từ chối chạy trên Linux; <code>npm ci</code> trên máy chủ chữa được.</li>
<li>Hai lần <code>npm ci</code> cho nội dung tệp giống tới từng byte; chỉ giờ sửa của tệp là khác.</li>
<li>Ghim và kiểm phiên bản Node trong lúc deploy — Node cài bằng apt trên máy thí nghiệm là 18 trong khi máy dev chạy 22.</li>
<li><code>lenh || echo "canh bao"</code> tắt <code>set -e</code> cho lệnh đó: script chạy tiếp và thoát 0.</li>
<li>Build ở nơi nền tảng khớp máy đích — ngay trên nó, hoặc trong một cái ảnh dựng cho nó; đừng bao giờ chép <code>node_modules</code> lên.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">npm ci — tài liệu npm (v10)</span><span class="lc-sub">docs.npmjs.com/cli/v10/commands/npm-ci — các bí danh, lời mô tả "môi trường tự động", và mọi cờ trong bảng ở trên.</span></span></div>
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
${slide('dv-01', 19, 'Tên bản: thời gian UTC + commit')}
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
${slide('dv-01', 21, 'Đóng dấu lúc dựng, hỏi tiến trình /version')}
<p>A name on a directory tells you what was deployed. It does not tell you what is <em>running</em> — the process could have been started from a different directory, or never restarted after the swap. The only authority is the process itself:</p>
<pre><code class="language-javascript">import { readFileSync } from 'fs';
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
${slide('dv-01', 20, 'Tệp phiên bản commit vào kho gọi tên CHA')}
<div class="out">  HEAD hien tai:                       962ceea
  commit ghi trong src/phien-ban.json: 4d0c4ac
  → cha cua HEAD:                      4d0c4ac
  ❌ LECH: tep phien ban dang goi ten mot commit KHAC voi ma dang chay

  962ceea them /version
  4d0c4ac bo export-ignore</div>
<div class="pitfall"><strong>Trap — a version file committed into the repository always names the previous commit.</strong> It is a chicken-and-egg problem, not a mistake you can be careful enough to avoid: writing the file requires knowing the hash, and the hash is not decided until the file is committed. So the file names its parent, forever, on every commit. Here the server reported <code>4d0c4ac</code> while running <code>962ceea</code> — and that is <em>worse</em> than reporting nothing, because it looks authoritative. Someone comparing that hash against staging would conclude the two match when they do not.</div>
<p>The fix is to stamp the version <em>outside</em> the commit, during the build, after the artifact has been extracted:</p>
<pre><code class="language-bash">set -euo pipefail
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
<pre><code class="language-bash"><span class="tok-comment"># cac cau hoi ma mot dong lenh giai quyet duoc</span>
curl -s https://cuongthai.com/version | jq -r .commit

<span class="tok-comment"># production va staging co khop khong?</span>
diff &lt;(curl -s https://cuongthai.com/version | jq -r .commit) \\
     &lt;(curl -s https://staging.cuongthai.com/version | jq -r .commit) \\
  &amp;&amp; echo "KHOP" || echo "LECH"

<span class="tok-comment"># may chu co dang chay dung cai vua deploy khong?</span>
[ "\$(curl -s https://cuongthai.com/version | jq -r .commit)" = "\$(git rev-parse --short HEAD)" ] \\
  &amp;&amp; echo "dung ban vua deploy" || echo "KHAC — trao chua xong hoac chua restart"</code></pre>
<div class="note-ct">That last check is worth adding to the end of a deploy script, and it catches a specific failure the other checks miss: the files were swapped but the process was never restarted, so it is still executing the previous release from memory. The health check passes, the site works, and it is the old code. The version endpoint is the only thing that notices.</div>
<h3>Run it: a rollback that forgot to restart</h3>
${slide('dv-01', 22, 'Trỏ symlink xong chưa chắc đang chạy bản đó')}
<p>The last check above catches one specific failure, and it is worth watching it happen. On the lab VPS, six releases named <code>YYYYMMDD-HHMMSS-commit</code> were built with the stamping step (<code>git archive</code> into a temporary directory, then <code>src/phien-ban.json</code> written, then moved into <code>/srv/app/phat-hanh/</code>). A small Node server reads the file once, at start-up, from <code>/srv/app/hien-tai</code>:</p>
<div class="out">$ ls -1 /srv/app/phat-hanh
20260929-011058-fdba636
20260929-011101-08cd63e
20260929-011102-efe37e8
20260929-011103-4be297f
20260929-011104-f342eb9
20260929-011106-9310ba1
$ curl -s localhost:19013/version
{"commit":"9310ba1","dung_luc":"2026-09-29T01:11:07Z"}</div>
<p>Now a rollback done the hurried way — the symlink moved, the process left alone — followed by the check:</p>
<pre><code class="language-bash">ln -sfn /srv/app/phat-hanh/20260929-011104-f342eb9 /srv/app/hien-tai
MONG=\$(basename "\$(readlink -f /srv/app/hien-tai)" | cut -d- -f3)   # symlink tro commit nao
THAT=\$(curl -s localhost:19013/version | jq -r .commit)             # tien trinh DANG CHAY gi
echo "mong doi: \$MONG   dang chay: \$THAT"
[ "\$THAT" = "\$MONG" ] &amp;&amp; echo "KHOP" || echo "LECH — da trao symlink nhung tien trinh CHUA khoi dong lai"</code></pre>
<div class="out">mong doi: f342eb9   dang chay: 9310ba1
LECH — da trao symlink nhung tien trinh CHUA khoi dong lai
$ pkill -f may-chu.mjs; nohup node /srv/app/chung/may-chu.mjs &amp;
sau khi khoi dong lai: f342eb9
KHOP</div>
<p>Every file on disk said "rolled back", and the server kept answering requests throughout. Only the process knew it was still running <code>9310ba1</code> — the release you were trying to get away from. Here the expected commit is read from the symlink's target, which is what makes the naming scheme pay off: the name <em>is</em> the claim, and <code>/version</code> is the evidence.</p>

<h3><code>git describe --dirty</code> does not see untracked files</h3>
<p><code>git describe --tags --always --dirty</code> is a good human-readable label — tag, number of commits since, short hash — and its <code>-dirty</code> suffix looks like a free dirty-tree check. It is not a complete one:</p>
<div class="out">$ git describe --tags --always --dirty
v1.0.0-6-g9310ba1
$ git status --porcelain | head -1
?? .env.production
$ echo x &gt;&gt; src/m2.js; git describe --tags --always --dirty
v1.0.0-6-g9310ba1-dirty</div>
<p>The untracked <code>.env.production</code> did not make it dirty; a modified tracked file did. For <code>git archive</code> that is harmless — untracked files are not in the archive anyway — but a deploy that copies the working tree would ship that file under a clean-looking name. The packaging guard stays <code>git status --porcelain</code>; <code>describe</code> is a label, not a check.</p>

<h3>On macOS and Windows</h3>
<p>The naming command works unchanged on a Mac: BSD <code>date -u +%Y%m%d-%H%M%S</code> printed <code>20260929-012802</code>. In PowerShell the equivalent is <code>Get-Date -AsUTC -Format yyyyMMdd-HHmmss</code> (PowerShell 7). Always use <code>-u</code>/UTC: a Vietnamese laptop is UTC+7 and a VPS is usually UTC, and a name made on each would sort seven hours apart — the "newest" release would not be the newest.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> after a rollback the bug is still there, and the team argues about which version the server is really running. Settle it with evidence, on the lab VPS.</p><ol>
<li>Build three releases of your project into <code>/srv/app/phat-hanh/</code>, each named <code>\$(date -u +%Y%m%d-%H%M%S)-\$(git rev-parse --short HEAD)</code> after a small commit, each stamped with <code>src/phien-ban.json</code> after extraction.</li>
<li>Point <code>/srv/app/hien-tai</code> at the newest and start a server that serves <code>/version</code> from the file it read at start-up.</li>
<li>Roll back by moving the symlink only, run the <code>MONG</code>/<code>THAT</code> check, then restart and run it again.</li>
<li>Add an untracked file and compare <code>git describe --dirty</code> with <code>git status --porcelain</code>.</li>
</ol>
<p><strong>Done when:</strong> <code>ls -1</code> lists the releases oldest-to-newest, the check prints <code>LECH</code> before the restart and <code>KHOP</code> after, and you can say which of the two commands noticed the untracked file.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release</span><span class="v">One deployed artifact in its own directory, never modified after it is created.</span></div>
  <div class="kv"><span class="k">Short hash</span><span class="v">The first 7 hex digits of a commit id (<code>git rev-parse --short HEAD</code>) — enough to identify it in one project.</span></div>
  <div class="kv"><span class="k">UTC</span><span class="v">The single time zone to name things in, so machines in different zones sort the same way.</span></div>
  <div class="kv"><span class="k">Stamping</span><span class="v">Writing the version file during the build, after extraction, so it can name its own commit.</span></div>
  <div class="kv"><span class="k"><code>/version</code> endpoint</span><span class="v">A route where the running process reports the commit it was started from.</span></div>
  <div class="kv"><span class="k">Symlink (<code>hien-tai</code>)</span><span class="v">A pointer to the current release; moving it changes files on disk, not a running process.</span></div>
  <div class="kv"><span class="k"><code>git describe</code></span><span class="v">A label built from the nearest tag; <code>--dirty</code> ignores untracked files.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Name releases <code>YYYYMMDD-HHMMSS-commit</code> in UTC: <code>ls</code> order is time order and every name traces to one commit.</li>
<li>A version file committed to the repository always names the parent commit; stamp it during the build instead.</li>
<li>Only the running process can say what is running — expose the commit at <code>/version</code>.</li>
<li>Measured: a rollback that moved the symlink without restarting kept serving the old commit while every file on disk said otherwise.</li>
<li>End every deploy by comparing the symlink's commit with <code>/version</code>.</li>
<li><code>git describe --dirty</code> missed an untracked <code>.env.production</code>; the dirty-tree guard is <code>git status --porcelain</code>.</li>
</ul>
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
${slide('dv-01', 19, 'Tên bản: thời gian UTC + commit')}
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
${slide('dv-01', 21, 'Đóng dấu lúc dựng, hỏi tiến trình /version')}
<p>Một cái tên trên thư mục cho bạn biết thứ gì đã được DEPLOY. Nó không cho biết thứ gì đang CHẠY — tiến trình có thể đã được khởi động từ một thư mục khác, hoặc chưa hề được khởi động lại sau bước tráo. Nguồn thẩm quyền duy nhất là chính cái tiến trình:</p>
<pre><code class="language-javascript">import { readFileSync } from 'fs';
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
${slide('dv-01', 20, 'Tệp phiên bản commit vào kho gọi tên CHA')}
<div class="out">  HEAD hien tai:                       962ceea
  commit ghi trong src/phien-ban.json: 4d0c4ac
  → cha cua HEAD:                      4d0c4ac
  ❌ LECH: tep phien ban dang goi ten mot commit KHAC voi ma dang chay

  962ceea them /version
  4d0c4ac bo export-ignore</div>
<div class="pitfall"><strong>Bẫy — một tệp phiên bản được commit vào kho mã thì LUÔN gọi tên commit TRƯỚC ĐÓ.</strong> Đây là bài toán con-gà-quả-trứng, không phải một lỗi mà bạn có thể cẩn thận đủ để tránh: viết cái tệp thì cần biết mã băm, mà mã băm thì chưa được quyết cho tới khi cái tệp được commit. Nên tệp đó gọi tên cha của nó, mãi mãi, ở mọi commit. Ở đây máy chủ báo <code>4d0c4ac</code> trong khi đang chạy <code>962ceea</code> — và như thế còn <em>TỆ HƠN</em> việc không báo gì cả, vì nó trông rất có thẩm quyền. Một người đem mã băm đó đi so với staging sẽ kết luận rằng hai bên khớp nhau trong khi chúng không hề.</div>
<p>Cách sửa là đóng dấu phiên bản ở <em>NGOÀI</em> commit, trong lúc DỰNG, sau khi tạo tác đã được giải nén ra:</p>
<pre><code class="language-bash">set -euo pipefail
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
<pre><code class="language-bash"><span class="tok-comment"># cac cau hoi ma mot dong lenh giai quyet duoc</span>
curl -s https://cuongthai.com/version | jq -r .commit

<span class="tok-comment"># production va staging co khop khong?</span>
diff &lt;(curl -s https://cuongthai.com/version | jq -r .commit) \\
     &lt;(curl -s https://staging.cuongthai.com/version | jq -r .commit) \\
  &amp;&amp; echo "KHOP" || echo "LECH"

<span class="tok-comment"># may chu co dang chay dung cai vua deploy khong?</span>
[ "\$(curl -s https://cuongthai.com/version | jq -r .commit)" = "\$(git rev-parse --short HEAD)" ] \\
  &amp;&amp; echo "dung ban vua deploy" || echo "KHAC — trao chua xong hoac chua restart"</code></pre>
<div class="note-ct">Phép kiểm cuối cùng đó đáng được thêm vào cuối một script deploy, và nó bắt được một kiểu hỏng mà mấy phép kiểm kia bỏ sót: tệp đã được tráo nhưng tiến trình chưa từng được khởi động lại, nên nó vẫn đang chạy bản phát hành TRƯỚC từ trong bộ nhớ. Phép kiểm sức khoẻ vẫn qua, website vẫn chạy, và đó là mã CŨ. Cái endpoint phiên bản là thứ duy nhất nhận ra.</div>
<h3>Chạy thử: một cú lùi bản quên khởi động lại</h3>
${slide('dv-01', 22, 'Trỏ symlink xong chưa chắc đang chạy bản đó')}
<p>Phép kiểm cuối cùng ở trên bắt đúng một kiểu hỏng, và đáng để nhìn nó xảy ra. Trên VPS thí nghiệm, sáu bản phát hành đặt tên <code>YYYYMMDD-HHMMSS-commit</code> được dựng kèm bước đóng dấu (<code>git archive</code> ra một thư mục tạm, rồi ghi <code>src/phien-ban.json</code>, rồi chuyển vào <code>/srv/app/phat-hanh/</code>). Một server Node nhỏ đọc tệp đó MỘT lần, lúc khởi động, từ <code>/srv/app/hien-tai</code>:</p>
<div class="out">$ ls -1 /srv/app/phat-hanh
20260929-011058-fdba636
20260929-011101-08cd63e
20260929-011102-efe37e8
20260929-011103-4be297f
20260929-011104-f342eb9
20260929-011106-9310ba1
$ curl -s localhost:19013/version
{"commit":"9310ba1","dung_luc":"2026-09-29T01:11:07Z"}</div>
<p>Giờ là một cú lùi bản làm kiểu vội — dời symlink, để yên tiến trình — rồi chạy phép kiểm:</p>
<pre><code class="language-bash">ln -sfn /srv/app/phat-hanh/20260929-011104-f342eb9 /srv/app/hien-tai
MONG=\$(basename "\$(readlink -f /srv/app/hien-tai)" | cut -d- -f3)   # symlink tro commit nao
THAT=\$(curl -s localhost:19013/version | jq -r .commit)             # tien trinh DANG CHAY gi
echo "mong doi: \$MONG   dang chay: \$THAT"
[ "\$THAT" = "\$MONG" ] &amp;&amp; echo "KHOP" || echo "LECH — da trao symlink nhung tien trinh CHUA khoi dong lai"</code></pre>
<div class="out">mong doi: f342eb9   dang chay: 9310ba1
LECH — da trao symlink nhung tien trinh CHUA khoi dong lai
$ pkill -f may-chu.mjs; nohup node /srv/app/chung/may-chu.mjs &amp;
sau khi khoi dong lai: f342eb9
KHOP</div>
<p>Mọi tệp trên đĩa đều nói "đã lùi bản", và máy chủ vẫn trả lời request suốt từ đầu tới cuối. Chỉ có tiến trình là biết nó vẫn đang chạy <code>9310ba1</code> — đúng cái bản bạn đang cố thoát ra. Ở đây commit mong đợi được đọc từ ĐÍCH của symlink, và đó là chỗ cách đặt tên trả công: cái tên LÀ lời khẳng định, còn <code>/version</code> là bằng chứng.</p>

<h3><code>git describe --dirty</code> không nhìn thấy tệp chưa theo dõi</h3>
<p><code>git describe --tags --always --dirty</code> là một cái nhãn dễ đọc cho người — tag, số commit kể từ đó, mã băm ngắn — và hậu tố <code>-dirty</code> của nó trông như một phép kiểm cây-bẩn miễn phí. Nó KHÔNG đầy đủ:</p>
<div class="out">$ git describe --tags --always --dirty
v1.0.0-6-g9310ba1
$ git status --porcelain | head -1
?? .env.production
$ echo x &gt;&gt; src/m2.js; git describe --tags --always --dirty
v1.0.0-6-g9310ba1-dirty</div>
<p>Tệp <code>.env.production</code> chưa theo dõi không làm nó "bẩn"; một tệp đã theo dõi bị sửa thì có. Với <code>git archive</code> thì vô hại — tệp chưa theo dõi vốn chẳng có trong gói — nhưng một quy trình deploy chép cây làm việc sẽ gửi tệp đó đi dưới một cái tên trông rất sạch. Chốt đóng gói vẫn là <code>git status --porcelain</code>; <code>describe</code> là NHÃN, không phải phép kiểm.</p>

<h3>Trên macOS và Windows khác gì</h3>
<p>Lệnh đặt tên chạy nguyên trên Mac: <code>date -u +%Y%m%d-%H%M%S</code> của BSD in ra <code>20260929-012802</code>. Trong PowerShell, lệnh tương đương là <code>Get-Date -AsUTC -Format yyyyMMdd-HHmmss</code> (PowerShell 7). Luôn dùng <code>-u</code>/UTC: laptop ở Việt Nam là UTC+7 còn VPS thường là UTC, và tên đặt ở mỗi máy sẽ lệch nhau bảy giờ khi sắp xếp — bản "mới nhất" sẽ không phải bản mới nhất.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sau khi lùi bản mà lỗi vẫn còn, cả nhóm cãi nhau xem máy chủ thật ra đang chạy bản nào. Hãy phân xử bằng bằng chứng, trên VPS thí nghiệm.</p><ol>
<li>Dựng ba bản phát hành của dự án vào <code>/srv/app/phat-hanh/</code>, mỗi bản đặt tên <code>\$(date -u +%Y%m%d-%H%M%S)-\$(git rev-parse --short HEAD)</code> sau một commit nhỏ, mỗi bản được đóng dấu <code>src/phien-ban.json</code> sau khi giải nén.</li>
<li>Trỏ <code>/srv/app/hien-tai</code> vào bản mới nhất và khởi động một server trả <code>/version</code> từ tệp nó đọc lúc khởi động.</li>
<li>Lùi bản bằng cách CHỈ dời symlink, chạy phép kiểm <code>MONG</code>/<code>THAT</code>, rồi khởi động lại và chạy lần nữa.</li>
<li>Thêm một tệp chưa theo dõi rồi so <code>git describe --dirty</code> với <code>git status --porcelain</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> <code>ls -1</code> liệt kê các bản từ cũ tới mới, phép kiểm in <code>LECH</code> trước khi khởi động lại và <code>KHOP</code> sau đó, và bạn nói được lệnh nào trong hai lệnh nhận ra tệp chưa theo dõi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release (bản phát hành)</span><span class="v">Một tạo tác đã deploy nằm trong thư mục riêng, không bao giờ bị sửa sau khi tạo.</span></div>
  <div class="kv"><span class="k">Short hash (mã băm ngắn)</span><span class="v">7 chữ số hex đầu của mã commit (<code>git rev-parse --short HEAD</code>) — đủ để định danh trong một dự án.</span></div>
  <div class="kv"><span class="k">UTC (giờ quốc tế)</span><span class="v">Múi giờ duy nhất nên dùng để đặt tên, để máy ở múi giờ khác nhau sắp xếp giống nhau.</span></div>
  <div class="kv"><span class="k">Stamping (đóng dấu phiên bản)</span><span class="v">Ghi tệp phiên bản trong lúc dựng, sau khi giải nén, để nó gọi đúng tên commit của chính nó.</span></div>
  <div class="kv"><span class="k">Endpoint <code>/version</code> (đường khai phiên bản)</span><span class="v">Một route mà tiến trình đang chạy khai ra commit nó được khởi động từ đó.</span></div>
  <div class="kv"><span class="k">Symlink <code>hien-tai</code> (liên kết mềm)</span><span class="v">Con trỏ tới bản hiện hành; dời nó là đổi tệp trên đĩa, không đổi tiến trình đang chạy.</span></div>
  <div class="kv"><span class="k"><code>git describe</code> (nhãn mô tả)</span><span class="v">Nhãn dựng từ tag gần nhất; <code>--dirty</code> bỏ qua tệp chưa theo dõi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt tên bản <code>YYYYMMDD-HHMMSS-commit</code> theo UTC: thứ tự của <code>ls</code> là thứ tự thời gian và tên nào cũng truy về đúng một commit.</li>
<li>Tệp phiên bản commit vào kho luôn gọi tên commit cha; hãy đóng dấu nó trong lúc dựng.</li>
<li>Chỉ tiến trình đang chạy mới nói được cái gì đang chạy — hãy khai commit ở <code>/version</code>.</li>
<li>Đo thật: cú lùi bản dời symlink mà không khởi động lại vẫn phục vụ commit cũ, trong khi mọi tệp trên đĩa nói điều ngược lại.</li>
<li>Kết thúc mọi lần deploy bằng việc so commit của symlink với <code>/version</code>.</li>
<li><code>git describe --dirty</code> bỏ sót tệp <code>.env.production</code> chưa theo dõi; chốt cây-bẩn là <code>git status --porcelain</code>.</li>
</ul>
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
${slide('dv-01', 23, 'Liên kết cứng: 6 bản 30 MB thay vì 158 MB')}
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
<pre><code class="language-bash"><span class="tok-comment"># cp -al: chep CAY THU MUC, nhung tep thi LIEN KET CUNG</span>
cp -al /srv/app/phat-hanh/&lt;ban-truoc&gt; /srv/app/phat-hanh/&lt;ban-moi&gt;

<span class="tok-comment"># rsync lam viec do gon hon, va no chi thay tep NAO doi</span>
rsync -a --delete --link-dest=/srv/app/phat-hanh/&lt;ban-truoc&gt; \\
      ./ /srv/app/phat-hanh/&lt;ban-moi&gt;/</code></pre>
<div class="note-ct"><code>--link-dest</code> is the form worth using. rsync compares each incoming file against the reference directory; identical files become hardlinks, changed files are written fresh. One command produces a complete release directory that shares everything it can, and it is the mechanism behind almost every snapshot backup tool.</div>

<h3>The sharp edge, measured</h3>
${slide('dv-01', 24, 'cp ghi tại chỗ làm bẩn MỌI bản — mv thì không')}
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
${slide('dv-01', 26, 'Dọn theo số lượng — chừa bản đang chạy')}
<div class="out">=== giu 3 ban gan nhat, xoa phan con lai ===
  truoc: 5 ban, 236M
    xoa v1
    xoa v2
  sau:   3 ban, 142M

=== BAY: neu hien-tai dang tro vao ban vua bi xoa thi sao? ===
  symlink tro vao: /srv/vps/gg/thuong/v9-khong-ton-tai
  doc duoc khong:  cat: .../m1.js: No such file or directory</div>
<div class="pitfall"><strong>Trap — deleting the release the symlink points at leaves a dangling link and a dead site.</strong> It happens when a rollback moves <code>hien-tai</code> to an older release and the pruner then deletes "the oldest N" without checking. Nothing errors at delete time; the failure arrives on the next request, or on the next restart. Any pruner must read the symlink first and refuse to remove its target.</div>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/bash</span>
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
<h3><code>--link-dest</code> links only what is identical in its attributes too</h3>
${slide('dv-01', 25, '--link-dest chỉ nối khi cả mtime cũng giống')}
<p>The 236 MB → 49 MB result depends on something easy to miss. Rebuilt on the lab VPS, six releases of the lab project made with <code>rsync -a --link-dest</code> took 30 MB where six full copies took 158 MB, and one file shows why:</p>
<div class="out">$ du -sh /srv/app/phat-hanh
30M	/srv/app/phat-hanh
$ stat -c "%h lien ket  inode %i  %n" */node_modules/express/package.json | head -3
6 lien ket  inode 172746  20260929-011058-fdba636/node_modules/express/package.json
6 lien ket  inode 172746  20260929-011101-08cd63e/node_modules/express/package.json
6 lien ket  inode 172746  20260929-011102-efe37e8/node_modules/express/package.json</div>
<p>Six names, one inode. But in that experiment <code>node_modules</code> was copied with its timestamps intact. Now the realistic case from Lesson 1.3 — every release runs its own <code>npm ci</code> on the server:</p>
<div class="out">$ stat -c "%y %a %s %n" /tmp/rel2/r*/node_modules/express/package.json
2026-09-29 01:12:06.168172001 +0000 664 2806 /tmp/rel2/r1/node_modules/express/package.json
2026-09-29 01:12:07.338172002 +0000 664 2806 /tmp/rel2/r2/node_modules/express/package.json
$ for opt in "-a" "-a --checksum" "-rlpc"; do …
    rsync \$opt --link-dest=\$H/r1 r2/ \$H/r2/; du -sh \$H; done
rsync -a --link-dest: 53M
rsync -a --checksum --link-dest: 53M
rsync -rlpc --link-dest: 27M</div>
<p>Two releases, identical file contents, and <strong>nothing</strong> was shared: 53 MB. <code>--link-dest</code> only links a file when it matches the reference in every attribute the transfer would set — and <code>-a</code> includes <code>-t</code>, preserve modification times, which differ by a second. <code>--checksum</code> does not help, because the content already matched; the mtime is what disagrees. Dropping <code>-t</code> (<code>-rlpc</code>: recursive, links, permissions, compare by checksum) lets identical files link, and two releases cost 27 MB — one copy. The trade-off is that the new release's files keep the <em>old</em> timestamps, which nothing in a release should care about.</p>
<table>
<tr><th>rsync flag</th><th>What it does</th><th>In a releases layout</th></tr>
<tr><td><code>-a</code></td><td><code>-rlptgoD</code>: recursive, symlinks, permissions, <strong>times</strong>, group, owner, devices</td><td>the default — but its <code>-t</code> blocks linking when mtimes differ</td></tr>
<tr><td><code>-c</code> / <code>--checksum</code></td><td>compares content instead of size and mtime</td><td>needed when timestamps are meaningless</td></tr>
<tr><td><code>--link-dest=DIR</code></td><td>files identical to DIR become hardlinks to it</td><td>point it at the previous release</td></tr>
<tr><td><code>--delete</code></td><td>deletes destination files the source does not have</td><td>not needed into a fresh directory; dangerous into a live one</td></tr>
<tr><td><code>--exclude-from=FILE</code></td><td>reads exclude patterns from a file</td><td>Lesson 1.1 — pattern rules differ from gitignore</td></tr>
<tr><td><code>-n</code> · <code>-i</code></td><td>dry run · itemize why each file is sent</td><td>always before <code>--delete</code></td></tr>
<tr><td><code>--inplace</code></td><td>writes into the existing file instead of a temporary one</td><td><strong>breaks hardlinked releases</strong> — the <code>cp</code> behaviour</td></tr>
</table>

<h3>Measured: pruning hardlinked releases frees less than you expect</h3>
<p>The pruner from this lesson, run for real after a rollback to the second-oldest release, keeping three:</p>
<div class="out">hien-tai -&gt; 20260929-011101-08cd63e
truoc: 6 ban, 30M
$ GIU=3 bash don.sh
da xoa 20260929-011058-fdba636
bo qua 20260929-011101-08cd63e — dang duoc dung
da xoa 20260929-011102-efe37e8
sau:   4 ban, 29M</div>
<p>The guard worked — the running release was skipped, so four remain rather than three. And deleting two releases returned about <strong>1 MB</strong>. A block is freed only when its <em>last</em> name is removed, and every <code>node_modules</code> file still had four other names. With hardlinks, counting releases is not counting disk: the number of releases you keep hardly matters, the number of <em>distinct</em> file versions does. When the disk is small, prune by free space instead — and never below a floor:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
GOC=/srv/app/phat-hanh
CAN_MB=\${CAN_MB:-2048}          # can it nhat bay nhieu MB trong
GIU_TOI_THIEU=2                 # khong bao gio xuong duoi so ban nay
DANG_DUNG=\$(basename "\$(readlink -f /srv/app/hien-tai)")
trong() { df --output=avail -m "\$GOC" | tail -1 | tr -d ' '; }
while [ "\$(trong)" -lt "\$CAN_MB" ]; do
  mapfile -t DS &lt; &lt;(ls -1 "\$GOC" | sort)
  [ "\${#DS[@]}" -le "\$GIU_TOI_THIEU" ] &amp;&amp; { echo "chi con \${#DS[@]} ban — dung, KHONG xoa them" &gt;&amp;2; break; }
  CU=\${DS[0]}; [ "\$CU" = "\$DANG_DUNG" ] &amp;&amp; CU=\${DS[1]}
  rm -rf "\${GOC:?}/\$CU"
  echo "trong \$(trong) MB &lt; \$CAN_MB MB ⇒ da xoa \$CU"
done
echo "xong: \$(ls -1 "\$GOC" | wc -l) ban, trong \$(trong) MB"</code></pre>
<div class="out">$ CAN_MB=999999999 bash don-theo-dia.sh      # nguong khong the dat — de xem no dung o dau
trong 858484 MB &lt; 999999999 MB ⇒ da xoa 20260929-011103-4be297f
trong 858485 MB &lt; 999999999 MB ⇒ da xoa 20260929-011104-f342eb9
chi con 2 ban — dung, KHONG xoa them
xong: 2 ban, trong 858485 MB</div>
<p>Given an impossible target it deleted the oldest releases it was allowed to, skipped the running one (the oldest, after the rollback), and stopped at the floor of two rather than deleting everything. That floor is the point: a pruner that can reach zero will one day delete your only way back.</p>

<h3>A real disk-full: 7.6 GB of build cache</h3>
${slide('dv-01', 27, 'Đĩa đầy thật: cache build 7,6 GB')}
<p>Releases are not the only thing kept "just in case". On 18/08/2026 this project's old deploy path, <code>deploy.sh</code>, was still building images on the VPS itself. Docker's build cache — the intermediate layers of every build ever run there — had grown to <strong>7.6 GB</strong> on the same disk as the PostgreSQL data. A deploy started <code>next build</code>, free space fell to 1.8 GB, and the build died with <code>no space left on device</code> partway through — with the database one bad write away from the same error.</p>
<div class="callout warn"><strong>Three lessons, all about artifacts.</strong> Anything kept to make the next deploy faster — build cache, old images, old releases — is an artifact too, and it needs a ceiling and something that enforces it. Prune <em>before</em> the deploy, when you still have room to work. And keep the build off the disk that holds the database: the fix here was to build on a machine at home and have the VPS only pull and swap (Chapter 13), so the VPS holds no build cache at all.</div>

<h3>When the artifact is a container image</h3>
${slide('dv-01', 28, 'Tarball hay ảnh container: cùng một ý')}
<p>Everything in this chapter carries over when the artifact is an image, only the nouns change: the sha256 of a tarball becomes the image <em>digest</em>; the release directory name becomes a tag such as <code>:9310ba1</code> (never only <code>:latest</code>, which names nothing); <code>git archive</code>'s exclusion becomes <code>.dockerignore</code>; <code>npm ci</code> on the server becomes <code>npm ci</code> inside the build, on the right base image and <code>--platform</code>; <code>chung/.env</code> becomes an <code>env_file</code> and a volume outside the image; and "keep five releases" becomes "keep the previous image tags and prune with a filter". Chapter 13 builds that pipeline.</p>

<h3>On macOS</h3>
<p>Three commands in this lesson are GNU-only. On the Mac:</p>
<div class="out">$ printf 'a\\nb\\nc\\nd\\n' | head -n -2
head: illegal line count -- -2
$ stat -c "%h %i" package.json
stat: illegal option -- c
$ stat -f "%l %i" package.json
1 62326870
$ readlink -f src/../package.json
/private/tmp/…/du-an/package.json</div>
<p><code>head -n -N</code> and <code>stat -c</code> fail; <code>stat -f "%l %i"</code> is the BSD spelling, and <code>readlink -f</code> works on current macOS. openrsync's <code>--link-dest</code> does link (<code>stat -f</code> showed 2 links for the same inode in both directories). The pruner is meant to run on the Linux server, so this matters only when you test it on the laptop first — which is exactly when a <code>head -n -5</code> error inside a <code>while read</code> loop can quietly produce an empty list.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the team's 20 GB VPS reports 92% disk usage and tomorrow is demo day. Free space without losing the way back, on the lab VPS.</p><ol>
<li>Build five releases into <code>/srv/app/phat-hanh/</code>, each with its own <code>npm ci</code>, using <code>rsync -a --link-dest</code> from the previous one. Record <code>du -sh</code>. Rebuild them with <code>rsync -rlpc --link-dest</code> and record it again.</li>
<li>Check a hardlink with <code>stat -c "%h %i"</code>; append to that file in the current release and read it in an older one; then repeat with <code>cp</code> and with <code>mv</code>.</li>
<li>Roll back to the second-oldest release, run <code>GIU=2 bash don.sh</code> and confirm with <code>readlink -f</code> that the target still exists.</li>
<li>Run the free-space pruner with an impossible <code>CAN_MB</code> and see where it stops.</li>
</ol>
<p><strong>Done when:</strong> you have two <code>du</code> numbers and can explain the difference with the word "mtime", your <code>cp</code> edit showed up in the older release and your <code>mv</code> did not, and both pruners left the running release plus at least one other in place.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hard link</span><span class="v">A second name for the same inode; the data is freed only when the last name is removed.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The filesystem record of a file's data and attributes; <code>stat -c %i</code> shows its number.</span></div>
  <div class="kv"><span class="k"><code>--link-dest</code></span><span class="v">rsync option that hardlinks files identical — in content and attributes — to a reference directory.</span></div>
  <div class="kv"><span class="k">Dangling symlink</span><span class="v">A symlink whose target was deleted; nothing errors until something follows it.</span></div>
  <div class="kv"><span class="k">Retention / prune</span><span class="v">The rule for how many old releases to keep, and the job that deletes the rest.</span></div>
  <div class="kv"><span class="k">Build cache</span><span class="v">Intermediate layers Docker keeps to speed up the next build — 7.6 GB in the real incident.</span></div>
  <div class="kv"><span class="k">Image digest</span><span class="v">The sha256 that identifies a container image exactly, as a checksum identifies a tarball.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Hardlinked releases cost roughly one release plus the changes — measured 30 MB for six instead of 158 MB.</li>
<li><code>--link-dest</code> links only files identical in attributes too: with <code>npm ci</code> per release, <code>-a</code> shared nothing (53 MB for two) and <code>-rlpc</code> shared everything (27 MB).</li>
<li><code>cp</code> over a hardlinked file changes every release; releases are read-only and writable data lives in <code>chung/</code>.</li>
<li>A pruner must read the symlink first, skip its target and never go below a floor.</li>
<li>With hardlinks, deleting releases frees little; on a small disk prune by free space, and prune before the deploy.</li>
<li>Build cache, old images and old releases are artifacts too — the 7.6 GB cache is why the build moved off the VPS.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GNU tar manual — Making tar Archives More Reproducible</span><span class="lc-sub">gnu.org/software/tar/manual/html_node/Reproducibility.html — the same metadata problem from tar's side, useful when the release is shipped as a tarball.</span></span></div>
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
${slide('dv-01', 23, 'Liên kết cứng: 6 bản 30 MB thay vì 158 MB')}
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
<pre><code class="language-bash"><span class="tok-comment"># cp -al: chep CAY THU MUC, nhung tep thi LIEN KET CUNG</span>
cp -al /srv/app/phat-hanh/&lt;ban-truoc&gt; /srv/app/phat-hanh/&lt;ban-moi&gt;

<span class="tok-comment"># rsync lam viec do gon hon, va no chi thay tep NAO doi</span>
rsync -a --delete --link-dest=/srv/app/phat-hanh/&lt;ban-truoc&gt; \\
      ./ /srv/app/phat-hanh/&lt;ban-moi&gt;/</code></pre>
<div class="note-ct"><code>--link-dest</code> là dạng đáng dùng. rsync so từng tệp đi vào với thư mục tham chiếu; tệp giống hệt thì thành liên kết cứng, tệp đã đổi thì được ghi mới. Một lệnh sinh ra một thư mục bản phát hành hoàn chỉnh có chia sẻ mọi thứ chia sẻ được, và nó chính là cơ chế nằm sau gần như mọi công cụ sao lưu dạng ảnh chụp.</div>

<h3>Lưỡi dao sắc, đo thật</h3>
${slide('dv-01', 24, 'cp ghi tại chỗ làm bẩn MỌI bản — mv thì không')}
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
${slide('dv-01', 26, 'Dọn theo số lượng — chừa bản đang chạy')}
<div class="out">=== giu 3 ban gan nhat, xoa phan con lai ===
  truoc: 5 ban, 236M
    xoa v1
    xoa v2
  sau:   3 ban, 142M

=== BAY: neu hien-tai dang tro vao ban vua bi xoa thi sao? ===
  symlink tro vao: /srv/vps/gg/thuong/v9-khong-ton-tai
  doc duoc khong:  cat: .../m1.js: No such file or directory</div>
<div class="pitfall"><strong>Bẫy — xoá đúng cái bản mà symlink đang trỏ vào thì để lại một liên kết treo lơ lửng và một website chết.</strong> Chuyện này xảy ra khi một cú lùi bản chuyển <code>hien-tai</code> về một bản cũ hơn rồi bộ dọn dẹp xoá "N bản cũ nhất" mà không kiểm. Chẳng có lỗi nào lúc xoá; cái hỏng tới ở request kế tiếp, hoặc ở lần khởi động lại kế tiếp. Mọi bộ dọn dẹp đều PHẢI đọc cái symlink trước và từ chối xoá đích của nó.</div>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/bash</span>
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
<h3><code>--link-dest</code> chỉ nối những tệp giống cả về THUỘC TÍNH</h3>
${slide('dv-01', 25, '--link-dest chỉ nối khi cả mtime cũng giống')}
<p>Kết quả 236 MB → 49 MB dựa vào một điều rất dễ bỏ sót. Dựng lại trên VPS thí nghiệm, sáu bản phát hành của dự án thí nghiệm làm bằng <code>rsync -a --link-dest</code> tốn 30 MB, trong khi sáu bản chép đầy đủ tốn 158 MB, và một tệp cho thấy vì sao:</p>
<div class="out">$ du -sh /srv/app/phat-hanh
30M	/srv/app/phat-hanh
$ stat -c "%h lien ket  inode %i  %n" */node_modules/express/package.json | head -3
6 lien ket  inode 172746  20260929-011058-fdba636/node_modules/express/package.json
6 lien ket  inode 172746  20260929-011101-08cd63e/node_modules/express/package.json
6 lien ket  inode 172746  20260929-011102-efe37e8/node_modules/express/package.json</div>
<p>Sáu cái tên, một inode. Nhưng trong thí nghiệm đó <code>node_modules</code> được chép GIỮ NGUYÊN dấu thời gian. Giờ là trường hợp thực tế của Bài 1.3 — mỗi bản phát hành tự chạy <code>npm ci</code> trên máy chủ:</p>
<div class="out">$ stat -c "%y %a %s %n" /tmp/rel2/r*/node_modules/express/package.json
2026-09-29 01:12:06.168172001 +0000 664 2806 /tmp/rel2/r1/node_modules/express/package.json
2026-09-29 01:12:07.338172002 +0000 664 2806 /tmp/rel2/r2/node_modules/express/package.json
$ for opt in "-a" "-a --checksum" "-rlpc"; do …
    rsync \$opt --link-dest=\$H/r1 r2/ \$H/r2/; du -sh \$H; done
rsync -a --link-dest: 53M
rsync -a --checksum --link-dest: 53M
rsync -rlpc --link-dest: 27M</div>
<p>Hai bản, nội dung tệp y hệt, và <strong>KHÔNG</strong> có gì được chia sẻ: 53 MB. <code>--link-dest</code> chỉ nối một tệp khi nó khớp với bản tham chiếu ở MỌI thuộc tính mà lần chuyển sẽ đặt — và <code>-a</code> có chứa <code>-t</code>, giữ giờ sửa, thứ lệch nhau một giây. <code>--checksum</code> không giúp gì, vì nội dung vốn đã khớp; cái bất đồng là mtime. Bỏ <code>-t</code> đi (<code>-rlpc</code>: đệ quy, liên kết, quyền, so bằng mã băm) thì tệp giống nhau được nối, và hai bản chỉ tốn 27 MB — một bản sao. Cái giá là tệp của bản mới mang dấu thời gian CŨ, thứ mà chẳng có gì trong một bản phát hành cần quan tâm.</p>
<table>
<tr><th>Cờ rsync</th><th>Làm gì</th><th>Trong bố cục releases</th></tr>
<tr><td><code>-a</code></td><td><code>-rlptgoD</code>: đệ quy, symlink, quyền, <strong>giờ</strong>, nhóm, chủ, thiết bị</td><td>mặc định — nhưng <code>-t</code> của nó chặn việc nối khi mtime khác</td></tr>
<tr><td><code>-c</code> / <code>--checksum</code></td><td>so NỘI DUNG thay vì cỡ và giờ</td><td>cần khi dấu thời gian vô nghĩa</td></tr>
<tr><td><code>--link-dest=DIR</code></td><td>tệp giống DIR thành liên kết cứng tới nó</td><td>trỏ vào bản phát hành trước</td></tr>
<tr><td><code>--delete</code></td><td>xoá ở đích thứ nguồn không có</td><td>không cần khi chép vào thư mục mới; NGUY HIỂM khi chép vào thư mục đang chạy</td></tr>
<tr><td><code>--exclude-from=FILE</code></td><td>đọc mẫu loại trừ từ một tệp</td><td>Bài 1.1 — luật mẫu khác gitignore</td></tr>
<tr><td><code>-n</code> · <code>-i</code></td><td>chạy thử · in lý do từng tệp được gửi</td><td>luôn chạy trước <code>--delete</code></td></tr>
<tr><td><code>--inplace</code></td><td>ghi vào tệp đang có thay vì tệp tạm</td><td><strong>phá releases dùng liên kết cứng</strong> — đúng hành vi của <code>cp</code></td></tr>
</table>

<h3>Đo thật: dọn releases dùng liên kết cứng trả lại ít hơn bạn tưởng</h3>
<p>Bộ dọn dẹp của bài này, chạy thật sau khi đã lùi về bản cũ thứ hai, giữ ba bản:</p>
<div class="out">hien-tai -&gt; 20260929-011101-08cd63e
truoc: 6 ban, 30M
$ GIU=3 bash don.sh
da xoa 20260929-011058-fdba636
bo qua 20260929-011101-08cd63e — dang duoc dung
da xoa 20260929-011102-efe37e8
sau:   4 ban, 29M</div>
<p>Chốt chặn đã chạy đúng — bản đang chạy được bỏ qua, nên còn lại bốn chứ không phải ba. Và xoá hai bản chỉ trả lại khoảng <strong>1 MB</strong>. Một khối dữ liệu chỉ được giải phóng khi cái tên <em>CUỐI CÙNG</em> của nó bị xoá, mà mọi tệp trong <code>node_modules</code> vẫn còn bốn cái tên khác. Với liên kết cứng, ĐẾM BẢN không phải ĐẾM ĐĨA: số bản bạn giữ gần như không quan trọng, số <em>phiên bản tệp khác nhau</em> mới quan trọng. Khi đĩa nhỏ, hãy dọn theo chỗ trống — và không bao giờ xuống dưới một mức sàn:</p>
<pre><code class="language-bash">#!/bin/bash
set -euo pipefail
GOC=/srv/app/phat-hanh
CAN_MB=\${CAN_MB:-2048}          # can it nhat bay nhieu MB trong
GIU_TOI_THIEU=2                 # khong bao gio xuong duoi so ban nay
DANG_DUNG=\$(basename "\$(readlink -f /srv/app/hien-tai)")
trong() { df --output=avail -m "\$GOC" | tail -1 | tr -d ' '; }
while [ "\$(trong)" -lt "\$CAN_MB" ]; do
  mapfile -t DS &lt; &lt;(ls -1 "\$GOC" | sort)
  [ "\${#DS[@]}" -le "\$GIU_TOI_THIEU" ] &amp;&amp; { echo "chi con \${#DS[@]} ban — dung, KHONG xoa them" &gt;&amp;2; break; }
  CU=\${DS[0]}; [ "\$CU" = "\$DANG_DUNG" ] &amp;&amp; CU=\${DS[1]}
  rm -rf "\${GOC:?}/\$CU"
  echo "trong \$(trong) MB &lt; \$CAN_MB MB ⇒ da xoa \$CU"
done
echo "xong: \$(ls -1 "\$GOC" | wc -l) ban, trong \$(trong) MB"</code></pre>
<div class="out">$ CAN_MB=999999999 bash don-theo-dia.sh      # nguong khong the dat — de xem no dung o dau
trong 858484 MB &lt; 999999999 MB ⇒ da xoa 20260929-011103-4be297f
trong 858485 MB &lt; 999999999 MB ⇒ da xoa 20260929-011104-f342eb9
chi con 2 ban — dung, KHONG xoa them
xong: 2 ban, trong 858485 MB</div>
<p>Được giao một mục tiêu không thể đạt, nó xoá những bản cũ nhất mà nó được phép xoá, bỏ qua bản đang chạy (sau cú lùi bản, đó là bản cũ nhất), và dừng ở mức sàn hai bản thay vì xoá sạch. Mức sàn đó chính là điểm mấu chốt: một bộ dọn dẹp có thể chạm tới số không thì sẽ có ngày xoá mất con đường lùi duy nhất của bạn.</p>

<h3>Đĩa đầy thật: 7,6 GB cache build</h3>
${slide('dv-01', 27, 'Đĩa đầy thật: cache build 7,6 GB')}
<p>Bản phát hành không phải thứ duy nhất được giữ lại "phòng khi cần". Ngày 18/08/2026, đường deploy cũ của chính dự án này, <code>deploy.sh</code>, vẫn đang build ảnh ngay trên VPS. Cache build của Docker — các tầng trung gian của mọi lần build từng chạy ở đó — đã phình lên <strong>7,6 GB</strong> trên cùng cái đĩa chứa dữ liệu PostgreSQL. Một lần deploy khởi động <code>next build</code>, chỗ trống tụt xuống 1,8 GB, và bước build chết giữa chừng với <code>no space left on device</code> — còn cơ sở dữ liệu thì chỉ cách đúng lỗi đó một lần ghi xui xẻo.</p>
<div class="callout warn"><strong>Ba bài học, đều về tạo tác.</strong> Bất cứ thứ gì được giữ lại để lần deploy sau nhanh hơn — cache build, ảnh cũ, bản phát hành cũ — cũng là tạo tác, và nó cần một cái TRẦN cùng một thứ gì đó thực thi cái trần ấy. Hãy dọn <em>TRƯỚC</em> khi deploy, lúc bạn còn chỗ để làm việc. Và giữ việc build ra khỏi cái đĩa chứa cơ sở dữ liệu: cách sửa ở đây là build trên một máy ở nhà, VPS chỉ kéo ảnh về và tráo (Chương 13), nên VPS không còn giữ chút cache build nào.</div>

<h3>Khi tạo tác là một ảnh container</h3>
${slide('dv-01', 28, 'Tarball hay ảnh container: cùng một ý')}
<p>Mọi thứ trong chương này đều mang sang được khi tạo tác là một cái ảnh, chỉ có danh từ là đổi: sha256 của tệp nén thành <em>digest</em> của ảnh; tên thư mục bản phát hành thành một tag như <code>:9310ba1</code> (không bao giờ chỉ <code>:latest</code>, thứ chẳng gọi tên cái gì cả); phần loại trừ của <code>git archive</code> thành <code>.dockerignore</code>; <code>npm ci</code> trên máy chủ thành <code>npm ci</code> bên trong bước build, trên đúng ảnh nền và đúng <code>--platform</code>; <code>chung/.env</code> thành <code>env_file</code> và volume nằm NGOÀI ảnh; còn "giữ năm bản" thành "giữ các tag ảnh trước đó và dọn có bộ lọc". Chương 13 dựng đường ống đó.</p>

<h3>Trên macOS khác gì</h3>
<p>Ba lệnh trong bài này chỉ có ở GNU. Trên Mac:</p>
<div class="out">$ printf 'a\\nb\\nc\\nd\\n' | head -n -2
head: illegal line count -- -2
$ stat -c "%h %i" package.json
stat: illegal option -- c
$ stat -f "%l %i" package.json
1 62326870
$ readlink -f src/../package.json
/private/tmp/…/du-an/package.json</div>
<p><code>head -n -N</code> và <code>stat -c</code> hỏng; <code>stat -f "%l %i"</code> là cách viết của BSD, còn <code>readlink -f</code> chạy được trên macOS đời mới. <code>--link-dest</code> của openrsync có nối thật (<code>stat -f</code> cho thấy 2 liên kết cùng một inode ở cả hai thư mục). Bộ dọn dẹp vốn để chạy trên máy chủ Linux, nên chuyện này chỉ quan trọng khi bạn thử nó trên laptop trước — mà đó lại đúng là lúc một lỗi <code>head -n -5</code> bên trong vòng <code>while read</code> có thể lặng lẽ sinh ra một danh sách rỗng.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> con VPS 20 GB của nhóm báo đĩa dùng 92% và mai là ngày demo. Hãy giải phóng chỗ trống mà không mất đường lùi, trên VPS thí nghiệm.</p><ol>
<li>Dựng năm bản phát hành vào <code>/srv/app/phat-hanh/</code>, mỗi bản tự <code>npm ci</code>, dùng <code>rsync -a --link-dest</code> từ bản trước. Ghi lại <code>du -sh</code>. Dựng lại bằng <code>rsync -rlpc --link-dest</code> và ghi lại lần nữa.</li>
<li>Kiểm một liên kết cứng bằng <code>stat -c "%h %i"</code>; ghi nối vào tệp đó ở bản hiện hành rồi đọc nó ở một bản cũ; lặp lại với <code>cp</code> và với <code>mv</code>.</li>
<li>Lùi về bản cũ thứ hai, chạy <code>GIU=2 bash don.sh</code> và xác nhận bằng <code>readlink -f</code> rằng đích vẫn còn.</li>
<li>Chạy bộ dọn theo chỗ trống với một <code>CAN_MB</code> không thể đạt và xem nó dừng ở đâu.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có hai con số <code>du</code> và giải thích được khác biệt bằng chữ "mtime", cú sửa bằng <code>cp</code> hiện ra ở bản cũ còn cú <code>mv</code> thì không, và cả hai bộ dọn đều để lại bản đang chạy cùng ít nhất một bản khác.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hard link (liên kết cứng)</span><span class="v">Một cái tên thứ hai cho cùng một inode; dữ liệu chỉ được giải phóng khi cái tên cuối cùng bị xoá.</span></div>
  <div class="kv"><span class="k">Inode (nút chỉ mục tệp)</span><span class="v">Bản ghi của hệ tệp chứa dữ liệu và thuộc tính của tệp; <code>stat -c %i</code> in ra số của nó.</span></div>
  <div class="kv"><span class="k"><code>--link-dest</code> (đích liên kết)</span><span class="v">Tuỳ chọn rsync nối cứng những tệp giống — cả nội dung lẫn thuộc tính — với một thư mục tham chiếu.</span></div>
  <div class="kv"><span class="k">Dangling symlink (liên kết treo)</span><span class="v">Symlink mà đích đã bị xoá; chẳng có lỗi gì cho tới khi có thứ đi theo nó.</span></div>
  <div class="kv"><span class="k">Retention / prune (chính sách giữ / dọn)</span><span class="v">Luật giữ bao nhiêu bản cũ, và công việc xoá phần còn lại.</span></div>
  <div class="kv"><span class="k">Build cache (cache build)</span><span class="v">Các tầng trung gian Docker giữ lại để build lần sau nhanh hơn — 7,6 GB trong sự cố thật.</span></div>
  <div class="kv"><span class="k">Image digest (mã băm của ảnh)</span><span class="v">Mã sha256 định danh chính xác một ảnh container, như mã băm định danh một tệp nén.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Releases dùng liên kết cứng tốn xấp xỉ một bản cộng phần thay đổi — đo được 30 MB cho sáu bản thay vì 158 MB.</li>
<li><code>--link-dest</code> chỉ nối tệp giống cả thuộc tính: mỗi bản tự <code>npm ci</code> thì <code>-a</code> không chia sẻ gì (53 MB cho hai bản), <code>-rlpc</code> chia sẻ tất cả (27 MB).</li>
<li><code>cp</code> đè lên tệp có liên kết cứng làm đổi mọi bản; bản phát hành là chỉ đọc, dữ liệu có ghi sống ở <code>chung/</code>.</li>
<li>Bộ dọn dẹp phải đọc symlink trước, chừa đích của nó và không bao giờ xuống dưới mức sàn.</li>
<li>Với liên kết cứng, xoá bản trả lại rất ít; đĩa nhỏ thì dọn theo chỗ trống, và dọn TRƯỚC khi deploy.</li>
<li>Cache build, ảnh cũ và bản cũ cũng là tạo tác — 7,6 GB cache là lý do việc build rời khỏi VPS.</li>
</ul>

<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Sổ tay GNU tar — Làm tệp tar tái lập được hơn</span><span class="lc-sub">gnu.org/software/tar/manual/html_node/Reproducibility.html — cùng bài toán siêu dữ liệu nhìn từ phía tar, hữu ích khi bản phát hành được gửi đi dưới dạng tệp nén.</span></span></div>
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
      description: 'Mười câu tình huống: tar --exclude-vcs-ignores vẫn chở node_modules, .env.production lọt qua rsync, gzip trên Mac đổi mã băm, tar thường lệch mỗi lần clone, esbuild chép từ Mac, npm ci || echo, Node 18 của apt, lùi bản quên restart, --link-dest không nối, và đĩa đầy vì cache build.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.6</span>
<h2>Quiz: the artifact</h2>
<p class="lead">Eight questions from a chapter where the measurements kept contradicting the obvious answer — including twice where the tool reported success while doing the wrong thing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can sort every path in a working tree into source, derived, runtime state and configuration, and say which exclusion file each packaging tool reads.</li>
<li>I can build an artifact with <code>git archive … | gzip -n</code>, refuse a dirty tree, and prove two builds identical with <code>sha256sum</code>.</li>
<li>I can read bytes 5–8 of a gzip header and make a plain <code>tar</code> reproducible with <code>SOURCE_DATE_EPOCH</code>.</li>
<li>I can explain why <code>npm ci</code> belongs on the server, why <code>node_modules</code> must not be copied up, and where <code>set -e</code> stops working.</li>
<li>I can name releases in UTC with the commit, stamp a version file during the build and check <code>/version</code> after a deploy.</li>
<li>I can keep hardlinked releases, prune them without deleting the running one, and explain why pruning freed so little.</li>
</ul>
${slide('dv-01', 30, 'Bảng tra nhanh Chương 1 (1/2)')}
${slide('dv-01', 31, 'Bảng tra nhanh Chương 1 (2/2)')}
<div class="callout">
<p><strong>What this chapter established.</strong> A real working tree was 3.8 MB of which 84 KB was source; the naive package carried the <code>.env</code> with a live database password, user uploads, logs, an editor backup and 786 <code>node_modules</code> entries, while <code>git archive</code> carried none of them (1.1). <code>git archive</code> is byte-reproducible because it stamps the <em>commit</em> time, and <code>gzip</code> is too when it reads from a pipe — but compressing a named file records that file's mtime in bytes 5–8, so identical content produced two different checksums two seconds apart (1.2). <code>npm ci</code> and <code>npm install</code> given the same lockfile conflict did opposite things: one named the conflict and exited <strong>1</strong>, the other installed a different major version, rewrote the lockfile and exited <strong>0</strong> — and while measuring it, <code>set -e</code> turned out to be inert inside a <code>||</code> list, which hid the failure entirely (1.3). A version file committed to the repository always names its parent commit, so the server reported <code>4d0c4ac</code> while running <code>962ceea</code>; stamping it during the build instead made it match (1.4). And five releases cost 236 MB as copies or 49 MB as hardlinks — but <code>cp</code> over a hardlinked file rewrote every release sharing it, because <code>cp</code> truncates in place and keeps the inode, while <code>mv</code> replaces the directory entry and does not (1.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.6</span>
<h2>Quiz: tạo tác</h2>
<p class="lead">Tám câu ra từ một chương mà các phép đo cứ liên tục mâu thuẫn với câu trả lời hiển nhiên — trong đó có hai lần công cụ BÁO THÀNH CÔNG trong khi đang làm sai việc.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi xếp được mọi đường dẫn trong cây làm việc vào nguồn, dẫn xuất, trạng thái lúc chạy và cấu hình, và nói được mỗi công cụ đóng gói đọc tệp loại trừ nào.</li>
<li>Tôi dựng được tạo tác bằng <code>git archive … | gzip -n</code>, từ chối cây bẩn, và chứng minh hai lần dựng giống hệt bằng <code>sha256sum</code>.</li>
<li>Tôi đọc được byte 5–8 của header gzip và làm cho <code>tar</code> thường tái lập được bằng <code>SOURCE_DATE_EPOCH</code>.</li>
<li>Tôi giải thích được vì sao <code>npm ci</code> phải chạy trên máy chủ, vì sao không được chép <code>node_modules</code> lên, và <code>set -e</code> thôi tác dụng ở đâu.</li>
<li>Tôi đặt được tên bản theo UTC kèm commit, đóng dấu tệp phiên bản lúc dựng và kiểm <code>/version</code> sau khi deploy.</li>
<li>Tôi giữ được releases dùng liên kết cứng, dọn chúng mà không xoá bản đang chạy, và giải thích được vì sao dọn xong lại trả về ít chỗ đến vậy.</li>
</ul>
${slide('dv-01', 30, 'Bảng tra nhanh Chương 1 (1/2)')}
${slide('dv-01', 31, 'Bảng tra nhanh Chương 1 (2/2)')}
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Một cây làm việc thật nặng 3,8 MB mà chỉ 84 KB là mã nguồn; cái gói ngây thơ chở theo tệp <code>.env</code> có mật khẩu cơ sở dữ liệu đang sống, tệp người dùng tải lên, log, một bản sao lưu của trình soạn thảo và 786 mục <code>node_modules</code>, còn <code>git archive</code> thì không chở cái nào (1.1). <code>git archive</code> tái lập được tới từng byte vì nó đóng dấu thời gian của <em>COMMIT</em>, và <code>gzip</code> cũng vậy khi nó đọc từ một ống dẫn — nhưng nén một tệp CÓ TÊN thì ghi mtime của tệp đó vào byte 5–8, nên nội dung y hệt cho ra hai mã băm khác nhau chỉ cách nhau hai giây (1.2). <code>npm ci</code> và <code>npm install</code> gặp cùng một mâu thuẫn tệp khoá đã làm hai việc NGƯỢC nhau: một cái nêu đích danh mâu thuẫn rồi thoát ra <strong>1</strong>, cái kia cài một phiên bản major khác, ghi lại tệp khoá rồi thoát ra <strong>0</strong> — và trong lúc đo chuyện đó, hoá ra <code>set -e</code> VÔ HIỆU bên trong một danh sách <code>||</code>, thứ đã che giấu hoàn toàn cái lỗi (1.3). Một tệp phiên bản commit vào kho mã thì LUÔN gọi tên commit cha của nó, nên máy chủ báo <code>4d0c4ac</code> trong khi đang chạy <code>962ceea</code>; đóng dấu nó trong lúc DỰNG thì nó khớp (1.4). Và năm bản phát hành tốn 236 MB nếu chép hẳn hoặc 49 MB nếu dùng liên kết cứng — nhưng <code>cp</code> đè lên một tệp có liên kết cứng thì viết lại MỌI bản đang chia sẻ nó, vì <code>cp</code> cắt trắng tại chỗ và giữ nguyên inode, còn <code>mv</code> thì thay mục thư mục nên không (1.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "You package a release with GNU tar --exclude-vcs --exclude-vcs-ignores, expecting it to honour .gitignore (node_modules/, dist/, .env). The archive is 5 MB and tar tzf shows 892 entries under node_modules. Why?|||Bạn đóng gói bản phát hành bằng GNU tar --exclude-vcs --exclude-vcs-ignores, tin rằng nó tôn trọng .gitignore (node_modules/, dist/, .env). Tệp nén nặng 5 MB và tar tzf cho thấy 892 mục trong node_modules. Vì sao?",
            options: [
              "The .gitignore file must be committed before tar can read it|||Phải commit .gitignore thì tar mới đọc được",
              "--exclude-vcs-ignores only works together with --exclude-from|||--exclude-vcs-ignores chỉ chạy khi đi kèm --exclude-from",
              "tar reads .gitignore with its own pattern rules: plain names like .env matched, but patterns with a trailing slash such as node_modules/ did not|||tar đọc .gitignore theo luật mẫu của riêng nó: tên trơn như .env thì khớp, còn mẫu có gạch chéo cuối như node_modules/ thì không",
              "node_modules is too large for tar's exclude cache|||node_modules quá lớn so với bộ nhớ đệm loại trừ của tar",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Measured in Lesson 1.1: the archive dropped .env and .git but kept every directory pattern written as name/. An ignore file is only as good as the tool reading it, and tar, rsync and Docker each have their own syntax. Committing .gitignore changes nothing for tar, which reads the file from disk; the reliable fix is git archive, which includes only committed files.|||VI: Đo ở Bài 1.1: gói bỏ được .env và .git nhưng giữ mọi mẫu thư mục viết dạng ten/. Tệp ignore chỉ tốt bằng công cụ đọc nó, và tar, rsync, Docker mỗi thứ một cú pháp. Commit .gitignore không đổi gì với tar vì tar đọc tệp trên đĩa; cách sửa chắc chắn là git archive, thứ chỉ gồm tệp đã commit.",
          },
          {
            question: "Your deploy runs rsync -a --exclude-from=.gitignore ./ vps:/srv/app/. A dry run lists .env.production among the files to send. .gitignore contains .env. What is going on?|||Quy trình deploy chạy rsync -a --exclude-from=.gitignore ./ vps:/srv/app/. Lần chạy thử liệt kê .env.production trong số tệp sẽ gửi. .gitignore có dòng .env. Chuyện gì đang xảy ra?",
            options: [
              ".env.production matches no pattern in .gitignore, so rsync sends it — an exclude list only blocks what someone named; git archive would not contain it because it was never committed|||.env.production không khớp mẫu nào trong .gitignore nên rsync gửi nó — danh sách loại trừ chỉ chặn thứ có người nêu tên; git archive sẽ không chứa nó vì nó chưa từng được commit",
              "rsync ignores --exclude-from when -a is used|||rsync bỏ qua --exclude-from khi có -a",
              "The pattern .env should have matched .env.production; rsync has a bug|||Mẫu .env lẽ ra phải khớp .env.production; rsync có lỗi",
              "Dry runs list excluded files too, so nothing will actually be sent|||Chạy thử liệt kê cả tệp bị loại trừ, nên thực tế sẽ không gửi gì",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The pattern .env matches that exact name, not .env.production. The lab measured exactly this: every gitignore pattern matched and the unlisted file still went. The tempting answer — a bug — misses that the list did its job; the list was incomplete. Add .env* (with !.env.example), and prefer git archive, where an uncommitted file is absent by construction.|||VI: Mẫu .env khớp đúng cái tên đó, không khớp .env.production. Phòng thí nghiệm đo đúng chuyện này: mọi mẫu gitignore đều khớp mà tệp chưa được liệt kê vẫn đi. Đáp án hấp dẫn — \"rsync có lỗi\" — bỏ qua việc danh sách đã làm đúng phần của nó; chỉ là nó thiếu. Thêm .env* (kèm !.env.example), và ưu tiên git archive, nơi tệp chưa commit vắng mặt ngay từ cách tạo.",
          },
          {
            question: "A teammate builds the artifact on a Mac with git archive --format=tar HEAD | gzip > app.tar.gz; you build the same commit on Linux. The contents are identical but the sha256 never matches, and xxd shows bytes 5–8 as bb 0f bb 6a on the Mac build. What fixes it?|||Bạn cùng nhóm dựng tạo tác trên Mac bằng git archive --format=tar HEAD | gzip > app.tar.gz; bạn dựng cùng commit đó trên Linux. Nội dung y hệt nhưng sha256 không bao giờ khớp, và xxd cho thấy byte 5–8 của bản Mac là bb 0f bb 6a. Cách sửa là gì?",
            options: [
              "Compress from a pipe instead of a named file|||Nén từ ống dẫn thay vì từ một tệp có tên",
              "Use a higher compression level such as gzip -9 on both machines|||Dùng mức nén cao hơn như gzip -9 ở cả hai máy",
              "Compare the checksums of the uncompressed tar instead and ignore the .gz|||So mã băm của tệp tar chưa nén và bỏ qua tệp .gz",
              "Use gzip -n (or git archive --format=tar.gz): Apple's gzip writes the current time into MTIME even when reading a pipe|||Dùng gzip -n (hoặc git archive --format=tar.gz): gzip của Apple ghi giờ hiện tại vào MTIME kể cả khi đọc từ ống dẫn",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Bytes 5–8 are the gzip MTIME. GNU gzip writes zero when reading a pipe; Apple gzip was measured writing the current time — and the teammate already IS using a pipe, which is why that tempting answer fails. gzip -n stores no name and no time on every platform; git's built-in tar.gz writes zero as well.|||VI: Byte 5–8 là MTIME của gzip. GNU gzip ghi số không khi đọc ống dẫn; gzip của Apple được đo là ghi giờ hiện tại — và bạn kia vốn ĐANG dùng ống dẫn, nên đáp án hấp dẫn đó sai. gzip -n không lưu tên, không lưu giờ trên mọi nền tảng; tar.gz dựng sẵn của git cũng ghi số không.",
          },
          {
            question: "CI packages the built dist/ directory with tar czf dist.tgz dist on two runners from the same commit. The sha256 differ; tar tvzf --full-time shows the same files with different times and owners. Which change makes the two archives identical?|||CI đóng gói thư mục dist/ đã build bằng tar czf dist.tgz dist trên hai runner, cùng một commit. Hai mã sha256 khác nhau; tar tvzf --full-time cho thấy cùng các tệp nhưng khác giờ và chủ sở hữu. Thay đổi nào làm hai tệp nén giống hệt nhau?",
            options: [
              "Run tar as root on both runners|||Chạy tar bằng root trên cả hai runner",
              "Set SOURCE_DATE_EPOCH to the commit time and use --sort=name --mtime=\"@$SOURCE_DATE_EPOCH\" --owner=0 --group=0 --numeric-owner, then gzip -n|||Đặt SOURCE_DATE_EPOCH bằng giờ commit và dùng --sort=name --mtime=\"@$SOURCE_DATE_EPOCH\" --owner=0 --group=0 --numeric-owner, rồi gzip -n",
              "Add --exclude=.git so the repository metadata is left out|||Thêm --exclude=.git để bỏ siêu dữ liệu của kho mã",
              "Use git archive on dist/, which is gitignored|||Dùng git archive cho dist/, thư mục đang bị gitignore",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: A fresh checkout or build writes files with the current time, and tar records mtime, owner and directory order. Pinning all of them — plus gzip -n — made two clones hash identically in Lesson 1.2. Running as root only changes which owner is recorded, and git archive cannot help because dist/ is not committed.|||VI: Checkout hay build mới ghi tệp với giờ hiện tại, còn tar ghi lại mtime, chủ sở hữu và thứ tự thư mục. Ghim hết chúng — cộng gzip -n — đã làm hai bản clone ra cùng mã băm ở Bài 1.2. Chạy bằng root chỉ đổi chủ sở hữu được ghi, còn git archive không giúp được vì dist/ không được commit.",
          },
          {
            question: "To save time you copy node_modules from your Mac to the VPS. The app crashes: 'the \"@esbuild/darwin-arm64\" package is present but this platform needs the \"@esbuild/linux-arm64\" package'. package-lock.json is committed and unchanged. What is the right fix?|||Để đỡ tốn thời gian, bạn chép node_modules từ Mac lên VPS. App sập: 'the \"@esbuild/darwin-arm64\" package is present but this platform needs the \"@esbuild/linux-arm64\" package'. package-lock.json đã commit và không đổi. Cách sửa đúng là gì?",
            options: [
              "Add @esbuild/linux-arm64 to package.json by hand|||Thêm tay @esbuild/linux-arm64 vào package.json",
              "Regenerate the lockfile on the VPS with npm install|||Tạo lại tệp khoá trên VPS bằng npm install",
              "Run npm ci on the VPS: the lockfile already lists every platform's binary, and the machine that installs chooses the one it needs|||Chạy npm ci trên VPS: tệp khoá đã liệt kê nhị phân của mọi nền tảng, và máy nào cài thì máy đó chọn cái nó cần",
              "Copy node_modules again with rsync -a so the permissions are kept|||Chép lại node_modules bằng rsync -a cho giữ quyền",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The lockfile pins versions, not platforms — it contained 24 @esbuild entries, and npm ci on Linux picked linux-arm64 and worked. npm install would also rewrite the lockfile, the opposite of what a deploy wants; copying again copies the same wrong binary.|||VI: Tệp khoá ghim phiên bản, không ghim nền tảng — nó có 24 mục @esbuild, và npm ci trên Linux chọn linux-arm64 rồi chạy được. npm install còn ghi lại tệp khoá, ngược với điều một lần deploy cần; chép lại thì vẫn chép đúng cái nhị phân sai đó.",
          },
          {
            question: "A deploy script starts with set -e and contains npm ci || echo \"canh bao: npm ci hong\" followed by npm run build and the swap. package.json and the lockfile are out of sync. What happens?|||Script deploy bắt đầu bằng set -e và có dòng npm ci || echo \"canh bao: npm ci hong\", theo sau là npm run build và bước tráo. package.json và tệp khoá đang lệch nhau. Chuyện gì xảy ra?",
            options: [
              "The warning is printed, the build and swap run against a half-installed tree, and the script exits 0|||Lời cảnh báo được in ra, bước build và tráo chạy trên một cây cài dở, và script thoát 0",
              "The script stops at npm ci with exit code 1 because set -e is on|||Script dừng ở npm ci với mã thoát 1 vì set -e đang bật",
              "The script prints the warning and then stops with exit code 1|||Script in lời cảnh báo rồi dừng với mã thoát 1",
              "npm ci repairs the lockfile and the build succeeds|||npm ci sửa tệp khoá và bước build thành công",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: set -e does not apply to a command in a && or || list other than the last one. Measured: case C printed the warning, ran on and exited 0. The attractive answer (\"stops, because set -e is on\") is what everybody expects, which is why the pattern survives in real scripts. Use npm ci || { echo …; exit 1; }. npm ci never edits the lockfile.|||VI: set -e không áp cho một lệnh trong danh sách && hay || trừ lệnh cuối. Đo thật: ca C in cảnh báo, chạy tiếp và thoát 0. Đáp án hấp dẫn (\"dừng, vì set -e đang bật\") là điều ai cũng tưởng, và vì thế mẫu này còn sống trong script thật. Hãy dùng npm ci || { echo …; exit 1; }. npm ci không bao giờ sửa tệp khoá.",
          },
          {
            question: "On a freshly installed Ubuntu 24.04 VPS, your build step prints 'Sai phien ban Node: v18.19.1' and exits 1. Node was installed with apt install nodejs. Your laptop runs Node 22. What should you do?|||Trên một VPS Ubuntu 24.04 vừa cài, bước build in 'Sai phien ban Node: v18.19.1' rồi thoát 1. Node được cài bằng apt install nodejs. Laptop của bạn chạy Node 22. Bạn nên làm gì?",
            options: [
              "Delete the version check — npm ci succeeded on the laptop|||Xoá phép kiểm phiên bản — npm ci đã chạy được trên laptop",
              "Change the check to accept v18 so the deploy goes through tonight|||Sửa phép kiểm cho chấp nhận v18 để tối nay deploy được",
              "Run npm install instead of npm ci so dependencies adapt to Node 18|||Chạy npm install thay cho npm ci để phụ thuộc tự thích nghi với Node 18",
              "Install the pinned Node 22 on the server (or use a Node 22 base image) and keep the check — it did its job before anything was touched|||Cài đúng Node 22 đã ghim lên máy chủ (hoặc dùng ảnh nền Node 22) và giữ phép kiểm — nó đã làm đúng việc trước khi có gì bị đụng tới",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The lockfile does not pin the runtime; apt on Ubuntu 24.04 gives 18.19.1, four majors behind. The check turned a later, obscure failure into a clean refusal. Loosening it ships code onto a runtime nobody tested, and npm install would also rewrite the lockfile.|||VI: Tệp khoá không ghim runtime; apt trên Ubuntu 24.04 cho 18.19.1, chậm bốn bản major. Phép kiểm đã biến một cú hỏng mơ hồ về sau thành một lời từ chối sạch sẽ. Nới nó ra là đưa mã lên một runtime chưa ai kiểm, còn npm install thì còn ghi lại tệp khoá.",
          },
          {
            question: "You roll back with ln -sfn /srv/app/phat-hanh/20260929-011104-f342eb9 /srv/app/hien-tai. The bug is still there. curl -s localhost:3000/version returns {\"commit\":\"9310ba1\"}. What is the most likely explanation?|||Bạn lùi bản bằng ln -sfn /srv/app/phat-hanh/20260929-011104-f342eb9 /srv/app/hien-tai. Lỗi vẫn còn. curl -s localhost:3000/version trả {\"commit\":\"9310ba1\"}. Giải thích khả dĩ nhất là gì?",
            options: [
              "The symlink did not change; ln -sfn fails silently on directories|||Symlink không đổi; ln -sfn hỏng lặng lẽ với thư mục",
              "The process was never restarted, so it still runs 9310ba1 from memory; restart it and check /version against the symlink's commit|||Tiến trình chưa từng được khởi động lại nên nó vẫn chạy 9310ba1 từ bộ nhớ; hãy khởi động lại và so /version với commit của symlink",
              "The version file inside f342eb9 names its parent commit|||Tệp phiên bản trong f342eb9 gọi tên commit cha của nó",
              "The browser cached the old /version response|||Trình duyệt lưu đệm response /version cũ",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured in Lesson 1.4: after moving the symlink the check printed LECH (expected f342eb9, running 9310ba1) and only a restart made it KHOP. The parent-commit problem affects files committed to the repository, not a stamped file, and it would show f342eb9's parent, not the newer release. curl does not use a browser cache.|||VI: Đo ở Bài 1.4: sau khi dời symlink, phép kiểm in LECH (mong f342eb9, đang chạy 9310ba1) và chỉ khởi động lại mới cho KHOP. Chuyện gọi tên commit cha xảy ra với tệp commit vào kho, không với tệp đóng dấu lúc dựng, và nếu có thì nó hiện cha của f342eb9 chứ không phải bản mới hơn. curl không dùng bộ nhớ đệm của trình duyệt.",
          },
          {
            question: "Each release on your VPS runs its own npm ci, then you copy it into place with rsync -a --link-dest=<previous release>. After two releases du shows 53 MB — no saving at all. The file contents are identical. Why?|||Mỗi bản phát hành trên VPS tự chạy npm ci, rồi bạn chép nó vào chỗ bằng rsync -a --link-dest=<bản trước>. Sau hai bản, du báo 53 MB — không tiết kiệm được gì. Nội dung tệp y hệt nhau. Vì sao?",
            options: [
              "--link-dest only works across different filesystems|||--link-dest chỉ chạy khi khác hệ tệp",
              "You must add --checksum; rsync compared by size and time and decided the files differed|||Phải thêm --checksum; rsync so theo cỡ và giờ nên cho rằng tệp khác nhau",
              "Hardlinks require the files to differ; identical files are skipped|||Liên kết cứng đòi tệp phải khác nhau; tệp giống thì bị bỏ qua",
              "npm ci stamps files with the install time and -a preserves times, so no file matches the reference in all attributes; -rlpc linked everything (27 MB)|||npm ci đóng dấu tệp bằng giờ cài còn -a giữ giờ, nên không tệp nào khớp bản tham chiếu ở mọi thuộc tính; -rlpc thì nối được tất cả (27 MB)",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: --link-dest links a file only when it matches in the attributes being preserved, and -a includes -t. The lab measured -a: 53M, -a --checksum: still 53M, -rlpc: 27M. --checksum is the tempting answer, but the content already matched — the mtime is what disagreed.|||VI: --link-dest chỉ nối một tệp khi nó khớp ở các thuộc tính đang được giữ, mà -a có chứa -t. Phòng thí nghiệm đo: -a được 53M, -a --checksum vẫn 53M, -rlpc được 27M. --checksum là đáp án hấp dẫn, nhưng nội dung vốn đã khớp — cái bất đồng là mtime.",
          },
          {
            question: "Your team's VPS builds images on the server. Mid-deploy, next build fails with 'no space left on device'; build cache has grown to 7.6 GB on the same disk as PostgreSQL. Which plan addresses the cause without losing your way back?|||VPS của nhóm build ảnh ngay trên máy chủ. Giữa lúc deploy, next build hỏng với 'no space left on device'; cache build đã phình tới 7,6 GB trên cùng đĩa với PostgreSQL. Kế hoạch nào xử lý đúng nguyên nhân mà không mất đường lùi?",
            options: [
              "Prune before each deploy with a ceiling on cache and old artifacts, keep the running and previous release, and move the build to another machine so the VPS only pulls and swaps|||Dọn TRƯỚC mỗi lần deploy, đặt trần cho cache và tạo tác cũ, chừa bản đang chạy và bản trước, và dời việc build sang máy khác để VPS chỉ kéo về và tráo",
              "Run a prune of everything unused after the deploy finishes, including all old images|||Sau khi deploy xong, chạy dọn sạch mọi thứ không dùng, kể cả toàn bộ ảnh cũ",
              "Move PostgreSQL's data to /tmp, which is cleared on reboot|||Dời dữ liệu PostgreSQL sang /tmp, nơi được dọn khi khởi động lại",
              "Keep only one release so there is nothing old to store|||Chỉ giữ một bản phát hành để không có gì cũ phải lưu",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: This is the real 18/08/2026 incident. Pruning after the deploy is too late — the peak is during the build — and deleting all old images removes the rollback target. Keeping one release means no rollback at all. The fix that removed the cause was building elsewhere, so the VPS holds no build cache.|||VI: Đây là sự cố thật ngày 18/08/2026. Dọn SAU deploy là quá muộn — đỉnh sử dụng nằm giữa lúc build — và xoá mọi ảnh cũ là xoá luôn đích lùi bản. Chỉ giữ một bản nghĩa là không lùi được gì. Cách sửa gỡ đúng nguyên nhân là build ở nơi khác, để VPS không giữ chút cache build nào.",
          },
        ],
      },
    },
  ],
};
