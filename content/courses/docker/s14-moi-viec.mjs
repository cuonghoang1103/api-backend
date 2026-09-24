/**
 * Docker — Chương 14 (MỚI 09/2026): Docker cho mọi việc.
 * Công cụ không cần cài · CSDL & hạ tầng một lệnh · tự host có HTTPS · GPU & AI cục bộ · quiz.
 * LUẬT: backtick → &#96;; ${ → &#36;{; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>.
 * KHÔNG dùng <svg>. Gạch chéo ngược PHẢI viết đôi (\\), xem scripts/course-content-check.mjs.
 *
 * Output CHẠY THẬT 24/09/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1, arm64) và Docker Engine 29.6
 * (Fedora 44, amd64, GPU RTX 3060 — KHÔNG cài NVIDIA Container Toolkit). Tên thật trong lúc đo mang tiền tố
 * dk14- (luật an toàn của khoá); trong bài người học dùng tên ngắn. Phần Ollama / Docker Model Runner KHÔNG
 * chạy model (máy GPU đang bận việc AI của người dùng) — mô tả theo tài liệu chính thức, ghi rõ trong bài.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 14 — Docker for everything: tools, self-hosting & AI|||Chương 14 — Docker cho mọi việc: công cụ, tự host & AI',
  description: 'Docker không chỉ để đóng gói app của bạn. Chương này dùng nó như một hộp đồ nghề: chạy công cụ không cần cài, dựng mọi loại CSDL bằng một lệnh, tự host dịch vụ có HTTPS, và đưa GPU cùng model AI vào (hoặc ra khỏi) container.',
  lessons: [
    /* ─────────────────────────── 14.0 ─────────────────────────── */
    {
      title: '14.0 — Chapter 14 slides: Docker as a toolbox|||14.0 — Slide Chương 14: Docker như một hộp đồ nghề',
      slug: 'dk-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 14: mẫu lệnh docker run --rm -v "$PWD":/w, quyền file khi quên -u, tám dịch vụ dev một lệnh và RAM của từng cái, initdb chỉ chạy một lần, dump/restore đúng phiên bản, chuyện MinIO rút ảnh, Caddy tls internal, sao lưu volume, và đường đi của GPU vào container.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Until now Docker has been the thing that packages <em>your</em> app. This chapter turns it around: Docker as a toolbox that lends you other people's software — a video converter for one afternoon, a MySQL for one assignment, a password manager for your team, a language model on the home GPU — without installing any of it on your machine.</p>
<p>Slides 3–8 belong to Lesson 14.1 (tools without installing), 9–14 to 14.2 (databases and infrastructure in one command), 15–20 to 14.3 (self-hosting with automatic HTTPS) and 21–26 to 14.4 (GPUs and local AI). The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal on the slides is real output recorded on 24 September 2026 on Docker Desktop 4.91 (Mac M1) and Docker Engine 29.6 (a Linux machine with an RTX 3060). The Ollama and Docker Model Runner slides describe the official documentation and say so on the slide — no model was downloaded for this chapter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Tới giờ Docker là thứ đóng gói app <em>của bạn</em>. Chương này lật ngược lại: Docker như một hộp đồ nghề cho bạn mượn phần mềm của người khác — một bộ đổi video cho một buổi chiều, một MySQL cho một bài lab, một kho mật khẩu cho cả nhóm, một model ngôn ngữ trên GPU ở nhà — mà không phải cài thứ nào vào máy.</p>
<p>Slide 3–8 thuộc Bài 14.1 (công cụ không cần cài), 9–14 thuộc 14.2 (CSDL và hạ tầng một lệnh), 15–20 thuộc 14.3 (tự host có HTTPS tự động) và 21–26 thuộc 14.4 (GPU và AI cục bộ). Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 24/09/2026 trên Docker Desktop 4.91 (Mac M1) và Docker Engine 29.6 (máy Linux có RTX 3060). Các slide về Ollama và Docker Model Runner mô tả theo tài liệu chính thức và ghi rõ điều đó ngay trên slide — chương này không tải model nào.</p>
</div>
${gallery('dk-14', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Một lệnh thay cho một lần cài'], [4, 'Hai bản Node cạnh nhau'], [5, 'Hộp đồ nghề: mỗi việc một ảnh nhỏ'],
  [6, 'Trên Linux, quên -u là file thuộc root'], [7, 'Hàm zsh và volume cache'], [8, 'Khi nào cài thật, khi nào dùng container'],
  [9, 'Tám dịch vụ, tám lệnh, RAM từng cái'], [10, 'Postgres một lệnh: env + initdb.d'], [11, 'Script khởi tạo chỉ chạy khi thư mục rỗng'],
  [12, 'Dump/restore qua docker exec'], [13, 'Mailpit bắt thư, MinIO giả S3'], [14, 'Chuyện MinIO rút ảnh 2025–2026'],
  [15, 'Caddy thay nginx + certbot'], [16, 'tls internal và chuỗi chứng chỉ'], [17, 'Ba dịch vụ đáng tự host'],
  [18, 'Sao lưu volume, cập nhật có chủ đích'], [19, 'Sửa Caddyfile bằng mv'], [20, 'Mở cổng ra Internet'],
  [21, 'Đường đi của GPU vào container'], [22, 'Có GPU mà thiếu toolkit'], [23, 'Mac: GPU không vào container'],
  [24, 'Ollama trong Docker'], [25, 'Docker Model Runner'], [26, 'Chọn đường nào cho AI cục bộ'],
  [27, 'Sai lầm hay gặp'], [28, 'Bảng tra nhanh'], [29, 'Thực hành chương 14'],
])}
`,
    },
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — Tools without installing them|||14.1 — Chạy công cụ mà không cần cài',
      slug: 'dk-14-1-cong-cu-khong-cai',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mẫu lệnh docker run --rm -v "$PWD":/w -w /w để mượn node, ffmpeg, pandoc, sqlite3, hadolint mà không cài gì; chạy bằng quyền của mình với -u; gói thành hàm zsh, ghim phiên bản, giữ cache; và khi nào nên cài thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Tools without installing them</h2>
<p class="lead">You need ffmpeg for one afternoon to cut a demo video for your project defence. You need Node 20 because an old group assignment breaks on Node 22. You need pandoc once a semester to turn a Markdown report into Word. Installing each of these means a package manager, a PATH, a version that drifts, and leftovers you forget about. Docker lets you borrow the tool instead: one command, the tool runs on the files in your current folder, and when it finishes it leaves nothing behind but the output.</p>
<p>Everything in this lesson is one pattern with small variations. Learn the pattern once, understand every flag in it, and you can run almost any command-line tool that has a Docker image — which is nearly all of them.</p>

<h3>The pattern: five pieces</h3>
${slide('dk-14', 3, 'Một lệnh thay cho một lần cài')}
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w mwader/static-ffmpeg:9.0.2 -i demo.mp4 demo.gif</code></pre>
<p>Read it left to right. <code>docker run</code> starts a container. <code>--rm</code> deletes it the moment the command exits — without it, every run leaves a stopped container in <code>docker ps -a</code>, and a week of "just converting one file" leaves forty of them. <code>-v "$PWD":/w</code> bind-mounts the folder you are standing in into the container at <code>/w</code> — it is the same folder, not a copy, so whatever the tool writes there appears on your disk. <code>-w /w</code> makes <code>/w</code> the working directory, so relative paths like <code>demo.mp4</code> resolve inside your folder. Then comes the image (with a pinned tag), and everything after the image name is passed to the tool as its arguments.</p>
<table>
<tr><th>Flag</th><th>What it does</th><th>When to add or drop it</th></tr>
<tr><td><code>--rm</code></td><td>Remove the container when it exits</td><td>Always, for one-shot tools</td></tr>
<tr><td><code>-v "$PWD":/w</code></td><td>Mount the current folder at <code>/w</code></td><td>Whenever the tool reads or writes your files. Quote <code>$PWD</code>: a path with a space breaks otherwise</td></tr>
<tr><td><code>-w /w</code></td><td>Start the command inside <code>/w</code></td><td>Together with the mount, so relative paths work</td></tr>
<tr><td><code>-i</code></td><td>Keep stdin open</td><td>When you pipe data in: <code>hadolint - &lt; Dockerfile</code>, <code>psql &lt; dump.sql</code></td></tr>
<tr><td><code>-t</code></td><td>Allocate a terminal</td><td>Only for interactive use (a REPL, <code>psql</code> prompt). Never in scripts or CI</td></tr>
<tr><td><code>-u "$(id -u):$(id -g)"</code></td><td>Run as your user instead of root</td><td>On Linux, whenever the tool writes files (next sections)</td></tr>
<tr><td><code>--platform linux/amd64</code></td><td>Force the CPU architecture</td><td>On an M1 Mac, when a tool only publishes an amd64 image (runs emulated, slower)</td></tr>
<tr><td><code>-e NAME=value</code></td><td>Pass an environment variable</td><td>Tokens, time zone, options the tool reads from env</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>"-it" in a script: the error that only appears when nobody is watching.</strong> People copy <code>docker run --rm -it …</code> from a README into a shell script or a CI job, and it breaks there while working perfectly in their terminal. Measured on the course Mac, running the command without a real terminal attached:
<pre><code class="language-bash">docker run --rm -it alpine:3 true</code></pre>
<div class="out">cannot attach stdin to a TTY-enabled container because stdin is not a terminal</div>
<p><code>-t</code> asks for a terminal, and a script has none to give. Keep <code>-it</code> for things you type into; use plain <code>-i</code> (or nothing) in scripts.</p></div>
<div class="callout warn"><strong>Windows teammates.</strong> <code>$PWD</code> is a Unix shell variable. In PowerShell write <code>-v &#36;{PWD}:/w</code>; in the old <code>cmd.exe</code>, <code>-v %cd%:/w</code>. In Git Bash, MSYS rewrites paths that start with <code>/</code> into Windows paths and silently breaks <code>-w /w</code> — prefix the command with <code>MSYS_NO_PATHCONV=1</code>. Inside WSL2 the Linux form works as-is, and is also much faster if the project folder lives in the WSL file system (Chapter 13).</div>

<h3>Two Node versions side by side</h3>
${slide('dk-14', 4, 'Hai bản Node cạnh nhau — không đụng bản đã cài')}
<p>A small script that prints the Node version and whether two newer JavaScript features exist — the kind of thing that decides whether an old project runs:</p>
<pre><code class="language-bash">cat ver.js
docker run --rm -v "$PWD":/w -w /w node:20-alpine node ver.js
docker run --rm -v "$PWD":/w -w /w node:22-alpine node ver.js
node ver.js          # the Node installed on the Mac with nvm</code></pre>
<div class="out">console.log(&#96;Node &#36;{process.version} | Iterator: &#36;{typeof Iterator} | Set.union: &#36;{typeof new Set().union}&#96;);
Node v20.20.2 | Iterator: undefined | Set.union: undefined
Node v22.23.2 | Iterator: function | Set.union: function
Node v22.21.0 | Iterator: function | Set.union: function</div>
<p>Three Node versions, one folder, zero conflicts: the version installed with nvm was never touched. The price is start-up time. Timing <code>node -v</code> three times each on the course machines: 0.01 s for the installed Node, about 0.24 s through a container on the Mac, 0.41–0.55 s on the Linux machine. A quarter of a second is nothing for a conversion you run once; it is very noticeable for a command you run two hundred times a day. <code>node:20-alpine</code> cost a 49 MB download (194 MB on disk).</p>
<p>Notice the third line: the Node on the Mac is 22.21.0 while <code>node:22-alpine</code> is 22.23.2 today. The tag <code>22-alpine</code> moves every time Node 22 gets a patch release. That is usually what you want for tools; when an exact result matters (a formatter the whole team must agree on), pin the full version, <code>node:22.23.2-alpine</code>, or even the digest.</p>

<h3>A toolbox: one small image per job</h3>
${slide('dk-14', 5, 'Hộp đồ nghề: mỗi việc một ảnh nhỏ, ghim phiên bản')}
<p>Four real jobs from a student's week, each done without installing anything. First, generate a five-second test video and turn it into a GIF for the README:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w mwader/static-ffmpeg:9.0.2 -hide_banner -loglevel error \\
  -f lavfi -i testsrc=duration=5:size=1280x720:rate=30 -c:v libx264 -pix_fmt yuv420p demo.mp4
docker run --rm -v "$PWD":/w -w /w mwader/static-ffmpeg:9.0.2 -hide_banner -loglevel error \\
  -i demo.mp4 -vf "fps=10,scale=480:-1" demo.gif
ls -l demo.*</code></pre>
<div class="out">-rw-r--r--  1 admin  wheel  320949 Sep 24 07:21 demo.gif
-rw-r--r--  1 admin  wheel   75176 Sep 24 07:21 demo.mp4</div>
<p>This image's entrypoint is <code>ffmpeg</code> itself, which is why the arguments start straight with <code>-hide_banner</code>. Other images expect the program name as the first argument (<code>keinos/sqlite3 sqlite3 …</code>). The image's page on Docker Hub, or <code>docker image inspect -f '{{.Config.Entrypoint}}' &lt;image&gt;</code>, tells you which kind it is.</p>
<p>Second, a Markdown note to HTML with pandoc:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w pandoc/minimal:3.11 ghi-chu.md -o ghi-chu.html
cat ghi-chu.html</code></pre>
<div class="out">&lt;h1 id="ghi-chú-nhóm"&gt;Ghi chú nhóm&lt;/h1&gt;
&lt;ul&gt;
&lt;li&gt;&lt;strong&gt;Deadline&lt;/strong&gt;: thứ Sáu&lt;/li&gt;
&lt;li&gt;Người làm: &lt;em&gt;Cường&lt;/em&gt;&lt;/li&gt;
&lt;/ul&gt;</div>
<p>Third, SQL over a CSV of marks, with a 5 MB image:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w keinos/sqlite3:3.53.4 sqlite3 :memory: \\
  -cmd ".mode csv" -cmd ".import diem.csv diem" -cmd ".mode table" \\
  "select ten, diem from diem where diem &gt;= 7 order by 2 desc;"</code></pre>
<div class="out">+-------+------+
|  ten  | diem |
+-------+------+
| Cuong | 9    |
| An    | 8.5  |
| Binh  | 6    |
+-------+------+</div>
<p>Binh's 6 is not ≥ 7, yet there it is. That is not Docker's fault — it is a lesson about the tool you borrowed: <code>.import</code> stores every CSV column as TEXT, and in SQLite a TEXT value always compares greater than a number. With <code>where cast(diem as real) &gt;= 7</code> the same command prints only Cuong and An. Containers remove the <em>installation</em> problem, not the need to understand the tool.</p>
<p>Fourth, lint a Dockerfile, reading it from stdin (hence <code>-i</code> and no mount):</p>
<pre><code class="language-bash">docker run --rm -i hadolint/hadolint:v2.15.1-alpine hadolint - &lt; Dockerfile; echo "exit=$?"</code></pre>
<div class="out">-:2 DL3018 warning: Pin versions in apk add. Instead of &#96;apk add &lt;package&gt;&#96; use &#96;apk add &lt;package&gt;=&lt;version&gt;&#96;
-:2 DL3019 info: Use the &#96;--no-cache&#96; switch to avoid the need to use &#96;--update&#96; and remove &#96;/var/cache/apk/*&#96; when done installing packages
-:6 DL3025 warning: Use arguments JSON notation for CMD and ENTRYPOINT arguments
exit=1</div>
<table>
<tr><th>Job</th><th>Image (pinned)</th><th>Download / on disk</th></tr>
<tr><td>Cut and convert video</td><td><code>mwader/static-ffmpeg:9.0.2</code></td><td>122 MB / 381 MB</td></tr>
<tr><td>Markdown → HTML, Word</td><td><code>pandoc/minimal:3.11</code></td><td>33 MB / 190 MB</td></tr>
<tr><td>SQL over CSV</td><td><code>keinos/sqlite3:3.53.4</code></td><td>5 MB / 16 MB</td></tr>
<tr><td>Lint a Dockerfile</td><td><code>hadolint/hadolint:v2.15.1-alpine</code></td><td>18 MB / 87 MB</td></tr>
<tr><td>One-off Python</td><td><code>python:3.12-alpine</code></td><td>19 MB / 80 MB</td></tr>
</table>
<p>"Download" is the CONTENT SIZE column of <code>docker images</code> in Docker 29, "on disk" is DISK USAGE (Chapter 1 explains the two). Measured on the Mac (arm64). Other tools follow the same pattern — the AWS CLI (<code>amazon/aws-cli</code>, 140 MB, mount <code>~/.aws</code> read-only for credentials), or the image scanner <code>trivy</code> that Chapter 6 uses — but were not run for this lesson.</p>

<h3>On Linux, forget -u and your files belong to root</h3>
${slide('dk-14', 6, 'Trên Linux, quên -u là file thuộc root')}
<p>Almost every tool image runs as root. On Linux there is no translation layer between the container and your disk, and user ID 0 inside is user ID 0 outside (Chapter 1: the user namespace is shared). So everything the tool creates in your folder belongs to root. On the course's Linux machine, as a normal user without sudo:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w alpine:3 sh -c \\
  "echo xin chao &gt; bao-cao.txt; mkdir dist; echo x &gt; dist/app.js"
ls -l
echo them &gt;&gt; bao-cao.txt
rm -rf dist</code></pre>
<div class="out">-rw-r--r--. 1 root root  9 Sep 24 07:21 bao-cao.txt
drwxr-xr-x. 2 root root 60 Sep 24 07:21 dist
zsh:1: permission denied: bao-cao.txt
rm: cannot remove 'dist/app.js': Permission denied</div>
<p>You cannot edit the report, and you cannot delete the build folder — in your own project. The fix is to tell Docker which user to run as, using your own numeric IDs:</p>
<pre><code class="language-bash">docker run --rm -u "$(id -u):$(id -g)" -v "$PWD":/w -w /w alpine:3 id</code></pre>
<div class="out">uid=1000 gid=1000 groups=1000</div>
<p>Already made the mess? You do not need sudo: a root container can give the files back.</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w alpine:3 chown -R "$(id -u):$(id -g)" /w</code></pre>
<table>
<tr><th>Machine</th><th>Files created by a root container belong to</th></tr>
<tr><td>Linux (Docker Engine)</td><td><strong>root</strong> — you need <code>-u</code></td></tr>
<tr><td>Mac (Docker Desktop)</td><td><strong>you</strong> — the file-sharing layer maps ownership (<code>demo.mp4</code> above belongs to <code>admin</code>, although ffmpeg ran as root)</td></tr>
<tr><td>Windows + WSL2</td><td>like Linux when the project is inside the WSL file system</td></tr>
</table>
<p><code>-u</code> has one side effect worth knowing: the user you invent may not exist in the image. In <code>alpine:3</code>, <code>-u 1000:1000</code> gives <code>whoami: unknown uid 1000</code> and <code>HOME=/</code>. Most tools do not care; tools that write a cache to <code>~</code> fail with "permission denied" on <code>/</code>. Pass <code>-e HOME=/tmp</code> to give them somewhere to write. (In <code>node</code> images, uid 1000 happens to be the built-in <code>node</code> user with <code>HOME=/home/node</code>, so it just works.)</p>

<h3>Wrap it in a zsh function — pinned, and with a cache</h3>
${slide('dk-14', 7, 'Gói lệnh dài thành hàm zsh — và giữ cache lại')}
<p>Nobody types that pattern twice. Put it in <code>~/.zshrc</code> as a function (a function, not an <code>alias</code>, because you want <code>"$@"</code> — every argument you type — to land in the right place):</p>
<pre><code class="language-bash"><span class="tok-comment"># ~/.zshrc</span>
node20() {
  docker run --rm -it \\
    -v "$PWD":/w -w /w \\
    -v dk-npm:/root/.npm \\
    node:20-alpine node "$@"
}</code></pre>
<pre><code class="language-bash">node20 -v
type node20</code></pre>
<div class="out">v20.20.2
node20 is a shell function from zsh</div>
<p>The extra <code>-v dk-npm:/root/.npm</code> is a named volume for npm's download cache. A <code>--rm</code> container forgets everything, including packages it just downloaded. Measured on the Mac with <code>npx -y cowsay@1.6.0</code>: 2.73 s and 2.62 s without a cache, 2.36 s the first time with the volume (filling it), 0.97 s the second time. Give the cache a volume, and keep the throwaway part throwaway.</p>

<h3>Try it step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · a folder with real input</span><span class="lz-t">mkdir -p ~/thu-docker/tools &amp;&amp; cd ~/thu-docker/tools</span><span class="lz-d">Put one Markdown file and one CSV in it.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · find the image and its entrypoint</span><span class="lz-t">docker image inspect -f '{{.Config.Entrypoint}}' pandoc/minimal:3.11</span><span class="lz-d">Tells you whether the first argument is the program name or already a program argument. (Pull the image first.)</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · run it on your folder</span><span class="lz-t">docker run --rm -v "$PWD":/w -w /w pandoc/minimal:3.11 note.md -o note.html</span><span class="lz-d">The output file appears next to the input.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · check who owns the result</span><span class="lz-t">ls -l note.html</span><span class="lz-d">Mac: you. Linux: root — rerun with -u "$(id -u):$(id -g)".</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · leave nothing behind</span><span class="lz-t">docker ps -a --filter ancestor=pandoc/minimal:3.11</span><span class="lz-d">Empty thanks to --rm. The image stays until you docker rmi it.</span></div>
</div>

<h3>When to install for real</h3>
${slide('dk-14', 8, 'Khi nào dùng container, khi nào cài thật')}
<table>
<tr><th>Question</th><th>Install it when…</th><th>Borrow it through a container when…</th></tr>
<tr><td>How often?</td><td>you type it hundreds of times a day (<code>git</code>, your main project's <code>node</code>)</td><td>a few times a month (ffmpeg, pandoc, <code>aws</code>)</td></tr>
<tr><td>Which version?</td><td>the installed one is fine</td><td>you need a <em>different</em> one (Node 20 for the old assignment, the Postgres 14 your lecturer uses)</td></tr>
<tr><td>Who else must get the same result?</td><td>only you</td><td>the whole team and CI: same image, same tag</td></tr>
<tr><td>Tens of thousands of files?</td><td>yes — bind mounts on Mac/Windows are slower than the native disk</td><td>a handful: nobody notices</td></tr>
<tr><td>Does your editor call it?</td><td>yes — ESLint, the TypeScript server, Prettier inside VS Code</td><td>no — only you, in the terminal</td></tr>
<tr><td>GPU on a Mac, or a GUI?</td><td>yes — containers on a Mac get neither</td><td>no</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the day before your SWP391 demo, the team needs a GIF of the app for the README, the report converted from Markdown, and a quick check of the marks sheet — and the lab machine has none of the tools installed.</p><ol>
<li>In <code>~/thu-docker/tools</code>, create a five-second test video with <code>mwader/static-ffmpeg:9.0.2</code> and convert it into <code>demo.gif</code> (commands above).</li>
<li>Write a short <code>bao-cao.md</code> and turn it into <code>bao-cao.html</code> with <code>pandoc/minimal:3.11</code>.</li>
<li>Put the three-line <code>diem.csv</code> in the folder and query it with <code>keinos/sqlite3:3.53.4</code> — first without <code>cast</code>, then with it. Explain the difference.</li>
<li>Add a <code>pandoc()</code> function to <code>~/.zshrc</code> that wraps the pattern, open a new terminal and run <code>pandoc bao-cao.md -o bao-cao2.html</code>.</li>
<li>Check that nothing was left running: <code>docker ps -a</code> shows none of these containers.</li></ol>
<p><strong>Done when:</strong> <code>demo.gif</code>, <code>bao-cao.html</code> and <code>bao-cao2.html</code> exist and belong to you (<code>ls -l</code>); the SQL query with <code>cast</code> returns exactly two rows; and <code>docker ps -a</code> contains no ffmpeg, pandoc or sqlite container.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">One-shot container</span><span class="v">A container started with <code>--rm</code> to run one command and vanish.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">A host folder shown inside the container at a path — the same files, not a copy.</span></div>
  <div class="kv"><span class="k">Working directory (<code>-w</code>)</span><span class="v">Where the command starts inside the container, so relative paths resolve.</span></div>
  <div class="kv"><span class="k">Entrypoint</span><span class="v">The program an image runs by default; decides what your arguments mean.</span></div>
  <div class="kv"><span class="k">TTY</span><span class="v">A terminal. <code>-t</code> asks for one; scripts do not have one.</span></div>
  <div class="kv"><span class="k">UID/GID</span><span class="v">The numeric user and group IDs that actually own files on Linux.</span></div>
  <div class="kv"><span class="k">Pinned tag</span><span class="v">A precise version in the image name (<code>:9.0.2</code>) instead of a moving one like <code>latest</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>docker run --rm -v "$PWD":/w -w /w &lt;image:tag&gt; …</code> borrows any tool that has an image, without installing it.</li>
<li>Know each flag: <code>--rm</code> cleans up, <code>-v</code> + <code>-w</code> bring your folder in, <code>-i</code> for stdin, <code>-t</code> only when a human types.</li>
<li>On Linux, add <code>-u "$(id -u):$(id -g)"</code> or your outputs belong to root; a root container can <code>chown</code> them back.</li>
<li>Wrap frequent tools in a zsh function, pin the tag, and give caches a named volume.</li>
<li>A container adds a quarter to half a second per run — fine for occasional tools, wrong for things you run all day.</li>
<li>Containers solve installation, not understanding: SQLite still compares TEXT and numbers the SQLite way.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">docker container run — reference</span><span class="lc-sub">Every flag used in this lesson (<code>--rm</code>, <code>-v</code>, <code>-w</code>, <code>-u</code>, <code>-i</code>, <code>-t</code>, <code>--platform</code>) with its exact meaning.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/storage/bind-mounts/" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">Bind mounts</span><span class="lc-sub">How a host folder appears in a container, read-only mounts, and the differences on Docker Desktop.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/r/mwader/static-ffmpeg" target="_blank" rel="noopener">
  <span class="lc-ico">🎞️</span>
  <span class="lc-body"><span class="lc-title">mwader/static-ffmpeg</span><span class="lc-sub">A small, statically built ffmpeg image for amd64 and arm64 — the one used above.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/r/pandoc/minimal" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">pandoc/minimal</span><span class="lc-sub">The official pandoc images; <code>pandoc/latex</code> adds LaTeX for PDF output.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic checking.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> mounting more than the tool needs, "to be convenient". <code>-v "$HOME":/w</code> hands an image you pulled five minutes ago read-write access to <code>~/.ssh</code>, your cloud credentials and every other project — and it runs as root. Mount only the folder the job needs, add <code>:ro</code> to inputs the tool should not change (<code>-v "$PWD/input":/in:ro</code>), and prefer images whose publisher you can name (Lesson 14.2: official images first).</div>
<p class="note-ct"><strong>Three things to remember.</strong> The pattern is <code>--rm</code> + <code>-v "$PWD":/w</code> + <code>-w /w</code> + a pinned image; everything else is a variation. On Linux, a container writes as root unless you say <code>-u "$(id -u):$(id -g)"</code>. And borrow tools you use occasionally or need in a specific version; install the ones you use all day.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Chạy công cụ mà không cần cài</h2>
<p class="lead">Bạn cần ffmpeg đúng một buổi chiều để cắt video demo cho buổi bảo vệ đồ án. Bạn cần Node 20 vì một bài tập nhóm cũ chạy Node 22 là vỡ. Bạn cần pandoc mỗi học kỳ một lần để đổi báo cáo Markdown sang Word. Cài từng thứ nghĩa là trình quản lý gói, biến PATH, một phiên bản cứ trôi dần, và đống rác bạn quên mất. Docker cho bạn <em>mượn</em> công cụ thay vì cài: một lệnh, công cụ chạy trên file trong thư mục hiện tại, xong việc thì không để lại gì ngoài kết quả.</p>
<p>Cả bài này chỉ là MỘT mẫu lệnh với vài biến thể nhỏ. Học mẫu đó một lần, hiểu từng cờ trong nó, là bạn chạy được gần như mọi công cụ dòng lệnh có ảnh Docker — mà gần như công cụ nào cũng có.</p>

<h3>Mẫu lệnh: năm mảnh ghép</h3>
${slide('dk-14', 3, 'Một lệnh thay cho một lần cài')}
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w mwader/static-ffmpeg:9.0.2 -i demo.mp4 demo.gif</code></pre>
<p>Đọc từ trái sang phải. <code>docker run</code> khởi động một container. <code>--rm</code> xoá nó ngay khi lệnh kết thúc — thiếu cờ này, mỗi lần chạy để lại một container đã dừng trong <code>docker ps -a</code>, và một tuần "chỉ đổi một file thôi" để lại bốn chục cái. <code>-v "$PWD":/w</code> là bind mount (gắn thư mục máy chủ): gắn thư mục bạn đang đứng vào container ở đường dẫn <code>/w</code> — đó là CHÍNH thư mục ấy, không phải bản chép, nên công cụ ghi gì vào đó thì file hiện ra trên đĩa của bạn. <code>-w /w</code> đặt thư mục làm việc (working directory) là <code>/w</code>, để đường dẫn tương đối như <code>demo.mp4</code> trỏ đúng vào thư mục của bạn. Sau đó là tên ảnh (có ghim tag), và mọi thứ đứng SAU tên ảnh được chuyển cho công cụ làm tham số.</p>
<table>
<tr><th>Cờ</th><th>Làm gì</th><th>Khi nào thêm / bỏ</th></tr>
<tr><td><code>--rm</code></td><td>Xoá container khi nó thoát</td><td>Luôn luôn, với công cụ chạy một lần</td></tr>
<tr><td><code>-v "$PWD":/w</code></td><td>Gắn thư mục hiện tại vào <code>/w</code></td><td>Khi công cụ đọc/ghi file của bạn. Nhớ đặt <code>$PWD</code> trong nháy kép: đường dẫn có dấu cách sẽ vỡ nếu không</td></tr>
<tr><td><code>-w /w</code></td><td>Chạy lệnh từ bên trong <code>/w</code></td><td>Đi cùng mount, để đường dẫn tương đối chạy đúng</td></tr>
<tr><td><code>-i</code></td><td>Giữ stdin (đầu vào chuẩn) mở</td><td>Khi bạn đổ dữ liệu vào bằng ống: <code>hadolint - &lt; Dockerfile</code>, <code>psql &lt; dump.sql</code></td></tr>
<tr><td><code>-t</code></td><td>Cấp một terminal (TTY) giả</td><td>Chỉ khi bạn gõ tương tác (REPL, dấu nhắc <code>psql</code>). KHÔNG bao giờ trong script hay CI</td></tr>
<tr><td><code>-u "$(id -u):$(id -g)"</code></td><td>Chạy bằng user của bạn thay vì root</td><td>Trên Linux, mỗi khi công cụ ghi file (xem mục dưới)</td></tr>
<tr><td><code>--platform linux/amd64</code></td><td>Ép kiến trúc CPU</td><td>Trên Mac M1, khi công cụ chỉ phát hành ảnh amd64 (chạy giả lập, chậm hơn)</td></tr>
<tr><td><code>-e TÊN=giá_trị</code></td><td>Truyền biến môi trường</td><td>Token, múi giờ, tuỳ chọn mà công cụ đọc từ env</td></tr>
</table>
<div class="pitfall co-tieu-de"><strong>"-it" trong script: cái lỗi chỉ hiện ra khi không ai nhìn.</strong> Người ta chép <code>docker run --rm -it …</code> từ README vào một script shell hay một job CI, và nó vỡ ở đó trong khi chạy ngon lành trong terminal của họ. Đo trên máy Mac của khoá, chạy lệnh mà không có terminal thật gắn vào:
<pre><code class="language-bash">docker run --rm -it alpine:3 true</code></pre>
<div class="out">cannot attach stdin to a TTY-enabled container because stdin is not a terminal</div>
<p><code>-t</code> đòi một terminal, mà script thì không có terminal nào để đưa. Giữ <code>-it</code> cho những thứ bạn gõ tay vào; trong script dùng <code>-i</code> trơn (hoặc không gì cả).</p></div>
<div class="callout warn"><strong>Bạn cùng nhóm dùng Windows.</strong> <code>$PWD</code> là biến của shell Unix. Trong PowerShell viết <code>-v &#36;{PWD}:/w</code>; trong <code>cmd.exe</code> cũ viết <code>-v %cd%:/w</code>. Trong Git Bash, MSYS tự đổi mọi đường dẫn bắt đầu bằng <code>/</code> thành đường dẫn Windows và làm hỏng <code>-w /w</code> mà không báo gì — thêm <code>MSYS_NO_PATHCONV=1</code> vào đầu lệnh. Bên trong WSL2 thì dạng Linux chạy nguyên xi, và còn nhanh hơn nhiều nếu thư mục dự án nằm trong hệ file của WSL (Chương 13).</div>

<h3>Hai bản Node cạnh nhau</h3>
${slide('dk-14', 4, 'Hai bản Node cạnh nhau — không đụng bản đã cài')}
<p>Một script nhỏ in phiên bản Node và cho biết hai tính năng JavaScript mới có tồn tại không — đúng loại chuyện quyết định một dự án cũ có chạy được hay không:</p>
<pre><code class="language-bash">cat ver.js
docker run --rm -v "$PWD":/w -w /w node:20-alpine node ver.js
docker run --rm -v "$PWD":/w -w /w node:22-alpine node ver.js
node ver.js          # bản Node cài bằng nvm trên Mac</code></pre>
<div class="out">console.log(&#96;Node &#36;{process.version} | Iterator: &#36;{typeof Iterator} | Set.union: &#36;{typeof new Set().union}&#96;);
Node v20.20.2 | Iterator: undefined | Set.union: undefined
Node v22.23.2 | Iterator: function | Set.union: function
Node v22.21.0 | Iterator: function | Set.union: function</div>
<p>Ba phiên bản Node, một thư mục, không xung đột nào: bản cài bằng nvm không hề bị đụng tới. Cái giá là thời gian khởi động. Đo <code>node -v</code> ba lần mỗi kiểu trên máy của khoá: 0,01 giây với Node đã cài, khoảng 0,24 giây qua container trên Mac, 0,41–0,55 giây trên máy Linux. Một phần tư giây chẳng là gì với một lần chuyển đổi; nhưng rất đáng kể với lệnh bạn gõ hai trăm lần mỗi ngày. <code>node:20-alpine</code> tốn 49 MB tải về (194 MB trên đĩa).</p>
<p>Để ý dòng thứ ba: Node trên Mac là 22.21.0 còn <code>node:22-alpine</code> hôm nay là 22.23.2. Tag <code>22-alpine</code> dịch chuyển mỗi lần Node 22 ra bản vá. Với công cụ thì thường đó là điều bạn muốn; khi kết quả phải khớp tuyệt đối (một bộ format cả nhóm phải đồng ý), hãy ghim đủ phiên bản <code>node:22.23.2-alpine</code>, hoặc ghim luôn digest (mã băm của ảnh).</p>

<h3>Hộp đồ nghề: mỗi việc một ảnh nhỏ</h3>
${slide('dk-14', 5, 'Hộp đồ nghề: mỗi việc một ảnh nhỏ, ghim phiên bản')}
<p>Bốn việc thật trong một tuần của sinh viên, việc nào cũng làm xong mà không cài gì. Thứ nhất, tạo một video thử năm giây rồi đổi thành GIF cho README:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w mwader/static-ffmpeg:9.0.2 -hide_banner -loglevel error \\
  -f lavfi -i testsrc=duration=5:size=1280x720:rate=30 -c:v libx264 -pix_fmt yuv420p demo.mp4
docker run --rm -v "$PWD":/w -w /w mwader/static-ffmpeg:9.0.2 -hide_banner -loglevel error \\
  -i demo.mp4 -vf "fps=10,scale=480:-1" demo.gif
ls -l demo.*</code></pre>
<div class="out">-rw-r--r--  1 admin  wheel  320949 Sep 24 07:21 demo.gif
-rw-r--r--  1 admin  wheel   75176 Sep 24 07:21 demo.mp4</div>
<p>Entrypoint (chương trình chạy mặc định) của ảnh này chính là <code>ffmpeg</code>, nên tham số bắt đầu thẳng bằng <code>-hide_banner</code>. Ảnh khác lại muốn tên chương trình làm tham số đầu (<code>keinos/sqlite3 sqlite3 …</code>). Trang của ảnh trên Docker Hub, hoặc lệnh <code>docker image inspect -f '{{.Config.Entrypoint}}' &lt;ảnh&gt;</code>, cho bạn biết nó thuộc loại nào.</p>
<p>Thứ hai, ghi chú Markdown sang HTML bằng pandoc:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w pandoc/minimal:3.11 ghi-chu.md -o ghi-chu.html
cat ghi-chu.html</code></pre>
<div class="out">&lt;h1 id="ghi-chú-nhóm"&gt;Ghi chú nhóm&lt;/h1&gt;
&lt;ul&gt;
&lt;li&gt;&lt;strong&gt;Deadline&lt;/strong&gt;: thứ Sáu&lt;/li&gt;
&lt;li&gt;Người làm: &lt;em&gt;Cường&lt;/em&gt;&lt;/li&gt;
&lt;/ul&gt;</div>
<p>Thứ ba, truy vấn SQL trên file CSV điểm, bằng một ảnh 5 MB:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w keinos/sqlite3:3.53.4 sqlite3 :memory: \\
  -cmd ".mode csv" -cmd ".import diem.csv diem" -cmd ".mode table" \\
  "select ten, diem from diem where diem &gt;= 7 order by 2 desc;"</code></pre>
<div class="out">+-------+------+
|  ten  | diem |
+-------+------+
| Cuong | 9    |
| An    | 8.5  |
| Binh  | 6    |
+-------+------+</div>
<p>Điểm 6 của Bình đâu có ≥ 7, thế mà vẫn nằm đó. Lỗi này không phải của Docker — nó là bài học về chính công cụ bạn mượn: <code>.import</code> lưu mọi cột CSV dưới dạng TEXT (chữ), và trong SQLite một giá trị TEXT luôn được coi là LỚN HƠN mọi con số. Viết <code>where cast(diem as real) &gt;= 7</code> thì cùng lệnh đó chỉ in Cường và An. Container xoá được bài toán <em>cài đặt</em>, không xoá được việc phải hiểu công cụ.</p>
<p>Thứ tư, soát lỗi một Dockerfile, đọc nó qua stdin (nên có <code>-i</code> và không cần mount):</p>
<pre><code class="language-bash">docker run --rm -i hadolint/hadolint:v2.15.1-alpine hadolint - &lt; Dockerfile; echo "exit=$?"</code></pre>
<div class="out">-:2 DL3018 warning: Pin versions in apk add. Instead of &#96;apk add &lt;package&gt;&#96; use &#96;apk add &lt;package&gt;=&lt;version&gt;&#96;
-:2 DL3019 info: Use the &#96;--no-cache&#96; switch to avoid the need to use &#96;--update&#96; and remove &#96;/var/cache/apk/*&#96; when done installing packages
-:6 DL3025 warning: Use arguments JSON notation for CMD and ENTRYPOINT arguments
exit=1</div>
<table>
<tr><th>Việc</th><th>Ảnh (đã ghim tag)</th><th>Tải về / trên đĩa</th></tr>
<tr><td>Cắt, đổi video</td><td><code>mwader/static-ffmpeg:9.0.2</code></td><td>122 MB / 381 MB</td></tr>
<tr><td>Markdown → HTML, Word</td><td><code>pandoc/minimal:3.11</code></td><td>33 MB / 190 MB</td></tr>
<tr><td>Truy vấn SQL trên CSV</td><td><code>keinos/sqlite3:3.53.4</code></td><td>5 MB / 16 MB</td></tr>
<tr><td>Soát Dockerfile</td><td><code>hadolint/hadolint:v2.15.1-alpine</code></td><td>18 MB / 87 MB</td></tr>
<tr><td>Python dùng một lần</td><td><code>python:3.12-alpine</code></td><td>19 MB / 80 MB</td></tr>
</table>
<p>"Tải về" là cột CONTENT SIZE của <code>docker images</code> trong Docker 29, "trên đĩa" là DISK USAGE (Chương 1 giải thích hai cột này). Đo trên máy Mac (arm64). Công cụ khác theo đúng mẫu đó — AWS CLI (<code>amazon/aws-cli</code>, 140 MB, gắn <code>~/.aws</code> chỉ-đọc để lấy thông tin đăng nhập), hay bộ quét ảnh <code>trivy</code> mà Chương 6 dùng — nhưng không chạy trong bài này.</p>

<h3>Trên Linux, quên -u là file thuộc root</h3>
${slide('dk-14', 6, 'Trên Linux, quên -u là file thuộc root')}
<p>Gần như mọi ảnh công cụ đều chạy bằng root. Trên Linux không có lớp phiên dịch nào giữa container và đĩa của bạn, và user ID 0 bên trong là user ID 0 bên ngoài (Chương 1: user namespace dùng chung). Vậy nên mọi thứ công cụ tạo ra trong thư mục của bạn đều thuộc về root. Trên máy Linux của khoá, bằng user thường không có sudo:</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w -w /w alpine:3 sh -c \\
  "echo xin chao &gt; bao-cao.txt; mkdir dist; echo x &gt; dist/app.js"
ls -l
echo them &gt;&gt; bao-cao.txt
rm -rf dist</code></pre>
<div class="out">-rw-r--r--. 1 root root  9 Sep 24 07:21 bao-cao.txt
drwxr-xr-x. 2 root root 60 Sep 24 07:21 dist
zsh:1: permission denied: bao-cao.txt
rm: cannot remove 'dist/app.js': Permission denied</div>
<p>Bạn không sửa được báo cáo, không xoá được thư mục build — ngay trong dự án của chính mình. Cách chữa là bảo Docker chạy bằng user nào, dùng đúng mã số UID/GID (mã số người dùng/nhóm) của bạn:</p>
<pre><code class="language-bash">docker run --rm -u "$(id -u):$(id -g)" -v "$PWD":/w -w /w alpine:3 id</code></pre>
<div class="out">uid=1000 gid=1000 groups=1000</div>
<p>Lỡ bày ra rồi? Không cần sudo: một container root có thể trả lại quyền cho bạn.</p>
<pre><code class="language-bash">docker run --rm -v "$PWD":/w alpine:3 chown -R "$(id -u):$(id -g)" /w</code></pre>
<table>
<tr><th>Máy</th><th>File do container root tạo ra thuộc về</th></tr>
<tr><td>Linux (Docker Engine)</td><td><strong>root</strong> — cần <code>-u</code></td></tr>
<tr><td>Mac (Docker Desktop)</td><td><strong>bạn</strong> — lớp chia sẻ file tự đổi chủ (<code>demo.mp4</code> ở trên thuộc <code>admin</code>, dù ffmpeg chạy bằng root)</td></tr>
<tr><td>Windows + WSL2</td><td>như Linux, khi dự án nằm trong hệ file của WSL</td></tr>
</table>
<p><code>-u</code> có một tác dụng phụ đáng biết: user bạn "bịa" ra có thể không tồn tại trong ảnh. Với <code>alpine:3</code>, <code>-u 1000:1000</code> cho ra <code>whoami: unknown uid 1000</code> và <code>HOME=/</code>. Phần lớn công cụ không để ý; công cụ nào ghi cache vào <code>~</code> sẽ báo "permission denied" trên <code>/</code>. Truyền <code>-e HOME=/tmp</code> để nó có chỗ ghi. (Trong ảnh <code>node</code>, uid 1000 tình cờ chính là user <code>node</code> có sẵn với <code>HOME=/home/node</code>, nên chạy luôn.)</p>

<h3>Gói thành hàm zsh — ghim phiên bản, giữ cache</h3>
${slide('dk-14', 7, 'Gói lệnh dài thành hàm zsh — và giữ cache lại')}
<p>Chẳng ai gõ mẫu lệnh đó lần thứ hai. Đưa nó vào <code>~/.zshrc</code> dưới dạng một hàm (function) — hàm chứ không phải <code>alias</code>, vì bạn cần <code>"$@"</code> (mọi tham số bạn gõ) rơi đúng chỗ:</p>
<pre><code class="language-bash"><span class="tok-comment"># ~/.zshrc</span>
node20() {
  docker run --rm -it \\
    -v "$PWD":/w -w /w \\
    -v dk-npm:/root/.npm \\
    node:20-alpine node "$@"
}</code></pre>
<pre><code class="language-bash">node20 -v
type node20</code></pre>
<div class="out">v20.20.2
node20 is a shell function from zsh</div>
<p>Dòng <code>-v dk-npm:/root/.npm</code> thêm một volume có tên cho bộ nhớ đệm (cache) tải về của npm. Container <code>--rm</code> quên sạch mọi thứ, kể cả gói vừa tải. Đo trên Mac với <code>npx -y cowsay@1.6.0</code>: 2,73 giây và 2,62 giây khi không có cache, 2,36 giây lần đầu có volume (đang đổ đầy nó), 0,97 giây lần thứ hai. Cho cache một volume, còn phần dùng-xong-vứt thì cứ để nó vứt.</p>
<p>Hàm này có <code>-it</code> vì bạn gõ nó bằng tay; nếu định gọi nó trong một script, tạo bản thứ hai không có <code>-t</code> (xem cái bẫy ở đầu bài).</p>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · một thư mục có dữ liệu thật</span><span class="lz-t">mkdir -p ~/thu-docker/tools &amp;&amp; cd ~/thu-docker/tools</span><span class="lz-d">Bỏ vào đó một file Markdown và một file CSV.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · tìm ảnh và entrypoint của nó</span><span class="lz-t">docker image inspect -f '{{.Config.Entrypoint}}' pandoc/minimal:3.11</span><span class="lz-d">Cho biết tham số đầu là tên chương trình hay đã là tham số của chương trình. (Kéo ảnh về trước.)</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · chạy trên thư mục của bạn</span><span class="lz-t">docker run --rm -v "$PWD":/w -w /w pandoc/minimal:3.11 note.md -o note.html</span><span class="lz-d">File kết quả hiện ra ngay cạnh file đầu vào.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · kiểm ai sở hữu kết quả</span><span class="lz-t">ls -l note.html</span><span class="lz-d">Mac: bạn. Linux: root — chạy lại với -u "$(id -u):$(id -g)".</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · không để lại gì</span><span class="lz-t">docker ps -a --filter ancestor=pandoc/minimal:3.11</span><span class="lz-d">Rỗng nhờ --rm. Còn ảnh thì ở lại tới khi bạn docker rmi nó.</span></div>
</div>

<h3>Khi nào nên cài thật</h3>
${slide('dk-14', 8, 'Khi nào dùng container, khi nào cài thật')}
<table>
<tr><th>Câu hỏi</th><th>Cài thật khi…</th><th>Mượn qua container khi…</th></tr>
<tr><td>Dùng thường xuyên cỡ nào?</td><td>gõ hàng trăm lần mỗi ngày (<code>git</code>, <code>node</code> của dự án chính)</td><td>vài lần mỗi tháng (ffmpeg, pandoc, <code>aws</code>)</td></tr>
<tr><td>Cần phiên bản nào?</td><td>bản đang cài là đủ</td><td>cần một bản KHÁC (Node 20 cho bài cũ, Postgres 14 thầy dùng)</td></tr>
<tr><td>Ai khác phải ra cùng kết quả?</td><td>chỉ mình bạn</td><td>cả nhóm và CI: cùng ảnh, cùng tag</td></tr>
<tr><td>Có đụng hàng vạn file không?</td><td>có — bind mount trên Mac/Windows chậm hơn đĩa thật</td><td>vài file: chẳng ai nhận ra chênh lệch</td></tr>
<tr><td>Editor có gọi thẳng nó không?</td><td>có — ESLint, TypeScript server, Prettier trong VS Code</td><td>không — chỉ bạn gõ ở terminal</td></tr>
<tr><td>Cần GPU trên Mac, hay giao diện đồ hoạ?</td><td>có — container trên Mac không có cả hai</td><td>không</td></tr>
</table>
<p>Quy tắc ngón tay cái: công cụ bạn <strong>dùng hằng ngày</strong> thì cài; công cụ bạn cần <strong>đúng một lần</strong> hoặc cần <strong>đúng một phiên bản</strong> thì mượn qua container.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> hôm trước buổi demo SWP391, nhóm cần một ảnh GIF của app cho README, báo cáo đổi từ Markdown, và soát nhanh bảng điểm — mà máy phòng lab chẳng cài sẵn công cụ nào.</p><ol>
<li>Trong <code>~/thu-docker/tools</code>, tạo video thử năm giây bằng <code>mwader/static-ffmpeg:9.0.2</code> rồi đổi thành <code>demo.gif</code> (lệnh ở trên).</li>
<li>Viết một file <code>bao-cao.md</code> ngắn và đổi nó thành <code>bao-cao.html</code> bằng <code>pandoc/minimal:3.11</code>.</li>
<li>Đặt file <code>diem.csv</code> ba dòng vào thư mục và truy vấn nó bằng <code>keinos/sqlite3:3.53.4</code> — trước tiên không có <code>cast</code>, sau đó có. Giải thích vì sao khác nhau.</li>
<li>Thêm hàm <code>pandoc()</code> vào <code>~/.zshrc</code> bọc mẫu lệnh, mở terminal mới rồi chạy <code>pandoc bao-cao.md -o bao-cao2.html</code>.</li>
<li>Kiểm không còn gì đang nằm lại: <code>docker ps -a</code> không có container nào trong số này.</li></ol>
<p><strong>Đạt khi:</strong> <code>demo.gif</code>, <code>bao-cao.html</code> và <code>bao-cao2.html</code> tồn tại và thuộc về bạn (<code>ls -l</code>); câu SQL có <code>cast</code> trả đúng hai dòng; và <code>docker ps -a</code> không có container ffmpeg, pandoc hay sqlite nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">One-shot container (container dùng một lần)</span><span class="v">Container chạy với <code>--rm</code> để làm đúng một lệnh rồi biến mất.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn thư mục máy chủ)</span><span class="v">Một thư mục của máy bạn hiện ra bên trong container ở một đường dẫn — cùng file đó, không phải bản chép.</span></div>
  <div class="kv"><span class="k">Working directory (thư mục làm việc, <code>-w</code>)</span><span class="v">Chỗ lệnh bắt đầu chạy trong container, để đường dẫn tương đối trỏ đúng.</span></div>
  <div class="kv"><span class="k">Entrypoint (chương trình mặc định)</span><span class="v">Chương trình ảnh chạy khi khởi động; quyết định tham số của bạn được hiểu thế nào.</span></div>
  <div class="kv"><span class="k">TTY (terminal)</span><span class="v"><code>-t</code> xin một terminal giả; script và CI không có terminal.</span></div>
  <div class="kv"><span class="k">UID/GID (mã người dùng/nhóm)</span><span class="v">Con số thật sự sở hữu file trên Linux — tên user chỉ là nhãn dán lên con số.</span></div>
  <div class="kv"><span class="k">Pinned tag (tag được ghim)</span><span class="v">Phiên bản cụ thể trong tên ảnh (<code>:9.0.2</code>) thay vì một tag trôi như <code>latest</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>docker run --rm -v "$PWD":/w -w /w &lt;ảnh:tag&gt; …</code> cho bạn mượn mọi công cụ có ảnh Docker mà không phải cài.</li>
<li>Hiểu từng cờ: <code>--rm</code> dọn rác, <code>-v</code> + <code>-w</code> đưa thư mục vào, <code>-i</code> cho stdin, <code>-t</code> chỉ khi có người gõ.</li>
<li>Trên Linux, thêm <code>-u "$(id -u):$(id -g)"</code> kẻo kết quả thuộc root; lỡ rồi thì một container root <code>chown</code> trả lại được.</li>
<li>Công cụ hay dùng thì gói vào hàm zsh, ghim tag, và cho cache một volume có tên.</li>
<li>Container thêm một phần tư tới nửa giây mỗi lần chạy — ổn với công cụ thỉnh thoảng dùng, sai với thứ bạn gõ cả ngày.</li>
<li>Container giải bài toán cài đặt, không giải bài toán hiểu công cụ: SQLite vẫn so TEXT với số theo kiểu của SQLite.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">docker container run — tài liệu tra cứu</span><span class="lc-sub">Mọi cờ dùng trong bài (<code>--rm</code>, <code>-v</code>, <code>-w</code>, <code>-u</code>, <code>-i</code>, <code>-t</code>, <code>--platform</code>) với nghĩa chính xác.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/storage/bind-mounts/" target="_blank" rel="noopener">
  <span class="lc-ico">📂</span>
  <span class="lc-body"><span class="lc-title">Bind mount</span><span class="lc-sub">Cách một thư mục máy chủ hiện ra trong container, mount chỉ-đọc, và khác biệt trên Docker Desktop.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/r/mwader/static-ffmpeg" target="_blank" rel="noopener">
  <span class="lc-ico">🎞️</span>
  <span class="lc-body"><span class="lc-title">mwader/static-ffmpeg</span><span class="lc-sub">Ảnh ffmpeg dựng tĩnh, nhỏ, có cả amd64 lẫn arm64 — đúng cái dùng ở trên.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/r/pandoc/minimal" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">pandoc/minimal</span><span class="lc-sub">Ảnh chính thức của pandoc; <code>pandoc/latex</code> có thêm LaTeX để xuất PDF.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> gắn nhiều hơn thứ công cụ cần, "cho tiện". <code>-v "$HOME":/w</code> trao cho một ảnh bạn vừa kéo về năm phút trước quyền đọc-ghi vào <code>~/.ssh</code>, thông tin đăng nhập cloud và mọi dự án khác — mà nó lại chạy bằng root. Chỉ gắn đúng thư mục công việc cần, thêm <code>:ro</code> cho đầu vào mà công cụ không được sửa (<code>-v "$PWD/input":/in:ro</code>), và ưu tiên ảnh mà bạn gọi được tên người phát hành (Bài 14.2: ảnh chính thức trước).</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Mẫu lệnh là <code>--rm</code> + <code>-v "$PWD":/w</code> + <code>-w /w</code> + một ảnh có ghim tag; mọi thứ khác là biến thể. Trên Linux, container ghi file bằng root trừ khi bạn nói <code>-u "$(id -u):$(id -g)"</code>. Và mượn những công cụ thỉnh thoảng mới dùng hoặc cần đúng một phiên bản; cài thật những thứ bạn dùng cả ngày.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Any database or service in one command|||14.2 — Mọi loại CSDL và hạ tầng trong một lệnh',
      slug: 'dk-14-2-kho-du-lieu-mot-lenh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Postgres, MySQL, MongoDB, Redis, MinIO, Mailpit, RabbitMQ và Adminer chạy bằng một lệnh mỗi cái; biến môi trường khởi tạo và /docker-entrypoint-initdb.d (chỉ chạy khi thư mục rỗng); dump/restore bằng công cụ của chính container; và bài học MinIO rút ảnh khỏi Docker Hub.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Any database or service in one command</h2>
<p class="lead">Your SWP391 project uses PostgreSQL. The database lab wants MySQL. Another course's assignment is on MongoDB, the backend needs Redis for sessions, file uploads should go to "S3", and the "forgot password" feature has to send e-mail. Installing all of that on a laptop means six background services starting at every boot, ports colliding, and a MySQL 5.7 from two years ago nobody dares to remove. With Docker each of them is one command to start and one command to throw away — and you can run the exact version your lecturer or your production server uses.</p>
<p>This lesson runs eight such services for real, then digs into the three things that trip people up: how the first-start initialisation works, how to get data in and out, and what happens when the company behind an image changes its mind.</p>

<h3>Eight services, eight commands</h3>
${slide('dk-14', 9, 'Tám dịch vụ, tám lệnh — mỗi cái ăn bao nhiêu RAM')}
<p>Each line below is complete — copy it and you have that service. The ports are bound to <code>127.0.0.1</code>, so only your own machine can connect; with a bare <code>-p 5432:5432</code> anybody on the same café Wi-Fi can try your password.</p>
<pre><code class="language-bash">docker run -d --name pg    -e POSTGRES_PASSWORD=matkhau -p 127.0.0.1:5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16-alpine
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=matkhau -e MYSQL_DATABASE=phongkham -p 127.0.0.1:3306:3306 -v mysqldata:/var/lib/mysql mysql:8.0
docker run -d --name mongo -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=matkhau -p 127.0.0.1:27017:27017 -v mongodata:/data/db mongo:7
docker run -d --name redis -p 127.0.0.1:6379:6379 redis:7-alpine redis-server --appendonly yes
docker run -d --name minio -e MINIO_ROOT_USER=admin -e MINIO_ROOT_PASSWORD=matkhau123 -p 127.0.0.1:9000:9000 -p 127.0.0.1:9001:9001 -v minio:/data quay.io/minio/minio server /data --console-address :9001
docker run -d --name mail  -p 127.0.0.1:8025:8025 -p 127.0.0.1:1025:1025 axllent/mailpit:v1.31
docker run -d --name rabbit --hostname rabbit -p 127.0.0.1:15672:15672 rabbitmq:4.3-management-alpine
docker run -d --name adminer -p 127.0.0.1:8080:8080 adminer:6.1.0</code></pre>
<p>On the course Mac all eight ran at once (on ports 18140–18149, so as not to clash with the real Postgres and Redis already on the machine). What each one costs, from <code>docker stats --no-stream</code> right after start-up, and how long until it answered its own health command:</p>
<table>
<tr><th>Service</th><th>Image</th><th>RAM after start</th><th>Ready after</th><th>How to check it is ready</th></tr>
<tr><td>PostgreSQL</td><td><code>postgres:16-alpine</code></td><td>42 MiB</td><td>~1 s</td><td><code>pg_isready -h 127.0.0.1</code></td></tr>
<tr><td>MySQL</td><td><code>mysql:8.0</code></td><td>368 MiB</td><td>8 s</td><td><code>mysql -uroot -p… -h127.0.0.1 -e "select 1"</code></td></tr>
<tr><td>MongoDB</td><td><code>mongo:7</code></td><td>87 MiB</td><td>6 s</td><td><code>mongosh --eval "db.runCommand({ping:1}).ok"</code></td></tr>
<tr><td>Redis</td><td><code>redis:7-alpine</code></td><td>5 MiB</td><td>~1 s</td><td><code>redis-cli ping</code> → <code>PONG</code></td></tr>
<tr><td>MinIO (S3)</td><td><code>quay.io/minio/minio</code></td><td>167 MiB</td><td>~3 s</td><td><code>curl …:9000/minio/health/live</code> → 200</td></tr>
<tr><td>Mailpit</td><td><code>axllent/mailpit:v1.31</code></td><td>20 MiB</td><td>~1 s</td><td>has its own healthcheck: <code>(healthy)</code> in <code>docker ps</code></td></tr>
<tr><td>RabbitMQ</td><td><code>rabbitmq:4.3-management-alpine</code></td><td>103 MiB</td><td>2.6 s (from its log)</td><td><code>rabbitmq-diagnostics -q ping</code></td></tr>
<tr><td>Adminer</td><td><code>adminer:6.1.0</code></td><td>53 MiB</td><td>~1 s</td><td>open the page: <code>&lt;title&gt;Login - Adminer&lt;/title&gt;</code></td></tr>
</table>
<p>Together a little under 850 MiB — the whole back-office of a real product on a student laptop. MySQL alone is almost half; if you only need <em>a</em> relational database, Postgres is the light one.</p>
<p>Adminer is a one-file web UI for Postgres, MySQL, SQLite and more — handy when your teammate does not have DBeaver or pgAdmin. To reach the database by name it must be on the same Docker network; in Compose that is automatic, and <code>ADMINER_DEFAULT_SERVER=db</code> pre-fills the server field.</p>

<h3>Postgres in one command: environment variables and an init folder</h3>
${slide('dk-14', 10, 'Postgres một lệnh: biến môi trường + thư mục init')}
<p>Official database images read a few environment variables on their <em>first</em> start and create the user and database for you. They also run any <code>.sql</code> or <code>.sh</code> file they find in <code>/docker-entrypoint-initdb.d</code>, in file-name order. Mount a folder there and your schema and sample data are ready the moment the container is:</p>
<pre><code class="language-bash">cat init/01-schema.sql
docker run -d --name pg \\
  -e POSTGRES_PASSWORD=matkhau -e POSTGRES_DB=phongkham \\
  -p 127.0.0.1:18140:5432 -v pgdata:/var/lib/postgresql/data \\
  -v "$PWD/init":/docker-entrypoint-initdb.d:ro postgres:16-alpine
docker logs pg 2&gt;&amp;1 | grep -E "initdb.d|ready to accept"
docker exec pg psql -U postgres -d phongkham -c "select * from lich_hen"</code></pre>
<div class="out">CREATE TABLE lich_hen (id serial PRIMARY KEY, benh_nhan text NOT NULL, gio timestamptz NOT NULL);
INSERT INTO lich_hen (benh_nhan, gio) VALUES ('An', '2026-09-25 08:00+07'), ('Binh', '2026-09-25 09:30+07');
2026-09-24 00:22:18.223 UTC [54] LOG:  database system is ready to accept connections
/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/01-schema.sql
2026-09-24 00:22:18.497 UTC [1] LOG:  database system is ready to accept connections
 id | benh_nhan |          gio
----+-----------+------------------------
  1 | An        | 2026-09-25 01:00:00+00
  2 | Binh      | 2026-09-25 02:30:00+00
(2 rows)</div>
<p>Two things in this output deserve a second look. The times are stored correctly but shown in UTC — 08:00 in Vietnam is 01:00 UTC; the container has no time zone (Chapter 2 shows <code>TZ</code>). And "ready to accept connections" appears <strong>twice</strong>: first from process 54, then from process 1. The entrypoint starts a <em>temporary</em> server listening only on a Unix socket, runs your init scripts against it, stops it, and only then starts the real server (PID 1) on TCP. A readiness check that talks to the socket — <code>pg_isready</code> without <code>-h</code> — can say "yes" to the temporary one, and your app then connects in the gap between the two. Check over TCP, as above: <code>pg_isready -h 127.0.0.1</code>.</p>
<table>
<tr><th>Image</th><th>Required on first start</th><th>Optional</th><th>Init folder</th></tr>
<tr><td><code>postgres</code></td><td><code>POSTGRES_PASSWORD</code> (the container exits without it)</td><td><code>POSTGRES_USER</code>, <code>POSTGRES_DB</code></td><td><code>/docker-entrypoint-initdb.d</code></td></tr>
<tr><td><code>mysql</code></td><td><code>MYSQL_ROOT_PASSWORD</code> (or <code>MYSQL_ALLOW_EMPTY_PASSWORD</code> / <code>MYSQL_RANDOM_ROOT_PASSWORD</code>)</td><td><code>MYSQL_DATABASE</code>, <code>MYSQL_USER</code>, <code>MYSQL_PASSWORD</code></td><td><code>/docker-entrypoint-initdb.d</code></td></tr>
<tr><td><code>mongo</code></td><td>nothing — but without a root user there is no authentication</td><td><code>MONGO_INITDB_ROOT_USERNAME</code>, <code>…_PASSWORD</code>, <code>MONGO_INITDB_DATABASE</code></td><td><code>/docker-entrypoint-initdb.d</code> (<code>.js</code>, <code>.sh</code>)</td></tr>
</table>

<h3>The init scripts run only when the data folder is empty</h3>
${slide('dk-14', 11, 'Script khởi tạo chỉ chạy khi thư mục dữ liệu RỖNG')}
<p>Add a second script and start the container again on the same volume:</p>
<pre><code class="language-bash">echo "INSERT INTO lich_hen (benh_nhan, gio) VALUES ('Cuong', now());" &gt; init/02-them.sql
docker stop pg &amp;&amp; docker rm pg
docker run -d --name pg … <span class="tok-comment"># exactly the same command, same volume pgdata</span>
docker logs pg 2&gt;&amp;1 | head -3
docker exec pg psql -U postgres -d phongkham -tAc "select count(*) from lich_hen"</code></pre>
<div class="out">PostgreSQL Database directory appears to contain a database; Skipping initialization

2</div>
<p>Still two rows. The entrypoint looks at the data directory: empty means "first start" — create the cluster, apply the variables, run the scripts; not empty means "already initialised" — skip all of it, silently. The same rule covers the variables.</p>
<div class="pitfall co-tieu-de"><strong>"I changed POSTGRES_PASSWORD in compose.yaml and the new password does not work."</strong> The password was written into the database files on the very first start. Every later start sees a non-empty volume and ignores the variable entirely — the old password is still the password. Either change it inside the database (<code>ALTER USER postgres PASSWORD '…';</code>), or, if the data is disposable, remove the volume so the next start is a first start again. The same thing happens with <code>POSTGRES_DB</code>, <code>MYSQL_DATABASE</code> and every init script you add later: to change a running database, run a migration; do not edit the init folder and hope.</div>

<h3>Dump and restore through docker exec — with the container's own tools</h3>
${slide('dk-14', 12, 'Dump/restore qua docker exec — dùng pg_dump CỦA container')}
<p>The obvious way is to point the <code>pg_dump</code> installed on your laptop at the published port. On the course Mac that went like this:</p>
<pre><code class="language-bash">pg_dump -h 127.0.0.1 -p 18140 -U postgres phongkham</code></pre>
<div class="out">pg_dump: error: server version: 16.14; pg_dump version: 14.19 (Homebrew)
pg_dump: error: aborting because of server version mismatch</div>
<p><code>pg_dump</code> refuses to dump a server newer than itself. The container already has the right version — use it, and let the data flow through the standard streams of <code>docker exec</code>:</p>
<pre><code class="language-bash">docker exec pg pg_dump -U postgres -d phongkham --clean --if-exists &gt; pk.sql      <span class="tok-comment"># plain SQL, out via stdout</span>
docker exec pg pg_dump -U postgres -d phongkham -Fc -f /tmp/pk.dump             <span class="tok-comment"># custom format, inside…</span>
docker cp pg:/tmp/pk.dump ./pk.dump                                              <span class="tok-comment"># …then copied out</span>
ls -l pk.*
docker exec pg createdb -U postgres khoiphuc
docker exec -i pg psql -U postgres -d khoiphuc -q &lt; pk.sql                        <span class="tok-comment"># in via stdin: needs -i</span>
docker exec pg psql -U postgres -d khoiphuc -tAc "select benh_nhan from lich_hen"
docker exec pg createdb -U postgres tu_dump
docker exec -i pg pg_restore -U postgres -d tu_dump &lt; pk.dump; echo "restore exit=$?"</code></pre>
<div class="out">-rw-r--r--@ 1 admin  wheel  2751 Sep 24 07:22 pk.dump
-rw-r--r--@ 1 admin  wheel  2348 Sep 24 07:22 pk.sql
 set_config
------------

(1 row)

 setval
--------
      2
(1 row)

An
Binh
restore exit=0</div>
<p>The <code>set_config</code> and <code>setval</code> tables are not errors: they are results of <code>SELECT</code> statements inside the dump that <code>-q</code> does not silence (add <code>-o /dev/null</code> to hide them). The two lines "An" and "Binh" are the proof that the copy has the data.</p>
<table>
<tr><th>Piece</th><th>Why</th></tr>
<tr><td><code>docker exec pg pg_dump … &gt; file</code></td><td>The dump runs inside the container (right version); the <code>&gt;</code> is interpreted by <em>your</em> shell, so the file lands on your disk</td></tr>
<tr><td><code>--clean --if-exists</code></td><td>The dump starts by dropping objects that exist, so restoring over an old copy does not collide</td></tr>
<tr><td><code>-Fc</code> + <code>pg_restore</code></td><td>Compressed "custom" format; lets you restore single tables. Binary — never send it through a terminal</td></tr>
<tr><td><code>docker exec -i</code></td><td>Keeps stdin open so <code>&lt; pk.sql</code> reaches psql. Without <code>-i</code> psql gets nothing and exits happily</td></tr>
<tr><td>no <code>-t</code></td><td>A pseudo-terminal translates line endings and can mangle a dump; <code>-t</code> is for humans only</td></tr>
</table>
<p>MySQL works the same way: <code>docker exec mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" phongkham' &gt; pk.sql</code> (the single quotes make the container's shell expand the variable, not yours). For MongoDB, <code>mongodump --archive</code> writes to stdout in the same spirit; it was not run for this lesson.</p>

<h3>Mailpit catches mail, MinIO pretends to be S3</h3>
${slide('dk-14', 13, 'Mailpit bắt thư, MinIO giả làm S3')}
<p>Two services that make an app "believe" it is in production. Mailpit is an SMTP server that accepts every message and delivers none: your app sends to port 1025, you read the result in a web inbox on 8025. On the Mac, sending one message with plain <code>curl</code> and reading it back through Mailpit's API:</p>
<pre><code class="language-bash">curl -s smtp://127.0.0.1:18147 --mail-from phongkham@vidu.test --mail-rcpt an@vidu.test -T mail.txt
curl -s http://127.0.0.1:18146/api/v1/messages | python3 -c '…print total, from, to, subject…'</code></pre>
<div class="out">total: 1
phongkham@vidu.test -&gt; an@vidu.test | Xac nhan lich hen 25/09</div>
<p>In your app's <code>.env</code> for development that is just <code>SMTP_HOST=mail</code>, <code>SMTP_PORT=1025</code>, no password. Your teammate can test "forgot password" fifty times and no real inbox gets spam — and nobody leaks a real Gmail app password into the repo.</p>
<p>MinIO speaks the S3 API, so the same AWS SDK code that uploads to S3 (or to Cloudflare R2) uploads to your laptop. Any S3 client works; here <code>rclone</code> runs as a one-shot container (Lesson 14.1) with its configuration passed through environment variables:</p>
<pre><code class="language-bash">r() { docker run --rm -v "$PWD":/w -w /w \\
  -e RCLONE_CONFIG_S3_TYPE=s3 -e RCLONE_CONFIG_S3_PROVIDER=Minio \\
  -e RCLONE_CONFIG_S3_ACCESS_KEY_ID=admin -e RCLONE_CONFIG_S3_SECRET_ACCESS_KEY=matkhau123 \\
  -e RCLONE_CONFIG_S3_ENDPOINT=http://host.docker.internal:18144 rclone/rclone:1.71 "$@"; }
r mkdir s3:anh-benh-nhan
r copy pk.sql s3:anh-benh-nhan/sao-luu/
r ls s3:anh-benh-nhan</code></pre>
<div class="out">     2348 sao-luu/pk.sql</div>
<p>(Each call also printed <code>NOTICE: Config file "/config/rclone/rclone.conf" not found - using defaults</code> — expected, the configuration came from the variables.) <code>host.docker.internal</code> is how a container on Docker Desktop reaches a port published on your Mac; on Linux, put both containers on one network and use the container name.</p>

<h3>An image can disappear: MinIO, 2025–2026</h3>
${slide('dk-14', 14, 'Ảnh của bên thứ ba có thể biến mất: chuyện MinIO')}
<p>Notice that the MinIO command above uses <code>quay.io/minio/minio</code>, not the <code>minio/minio</code> every tutorial shows. On 24 September 2026, on the course Mac:</p>
<pre><code class="language-bash">docker pull minio/minio:latest
docker logs minio | grep Version</code></pre>
<div class="out">Error response from daemon: pull access denied for minio/minio, repository does not exist or may require 'docker login'
Version: RELEASE.2025-09-07T16-13-09Z (go1.24.6 linux/arm64)</div>
<p>What happened, as far as can be checked today: MinIO stopped publishing prebuilt binaries and images for the community edition — its README now says the community edition "is now distributed as source code only" and that the legacy binaries "will not receive updates"; the GitHub repository was archived on 25 April 2026; the <code>minio/minio</code> repository is no longer pullable from Docker Hub; the copy on <code>quay.io</code> still exists, with the last release from September 2025 plus a few hotfix tags. Chapter 3 told a similar story about Bitnami in 2025. The pattern is the same: an image name belongs to somebody, and they can change the rules.</p>
<ul>
<li><strong>Pin tags</strong>, so you know exactly which version you depend on and can find it again.</li>
<li><strong>Prefer Docker Official Images</strong> (<code>postgres</code>, <code>redis</code>, <code>mysql</code>, <code>mongo</code>, <code>rabbitmq</code>, <code>adminer</code>, <code>caddy</code>…) for common infrastructure: they are maintained in the open and do not depend on one company's business model.</li>
<li><strong>Keep a way back:</strong> a copy of the images you rely on in your own registry (GHCR, Chapter 3), and a known replacement for each third-party service. For a dev S3, anything that speaks the S3 API will do.</li>
</ul>
<div class="callout warn"><strong>Anonymous volumes again.</strong> <code>docker inspect</code> on the running containers showed that <code>redis:7-alpine</code> mounted an <em>anonymous</em> volume at <code>/data</code>, <code>mongo:7</code> one at <code>/data/configdb</code> (next to the named <code>/data/db</code>), and RabbitMQ one at <code>/var/lib/rabbitmq</code>. With <code>--rm</code> or <code>docker rm -v</code> they are deleted with the container — which for Redis means the <code>--appendonly yes</code> file you thought protected your sessions is gone. Anything you want to keep gets a <em>named</em> volume (Chapter 7).</div>

<h3>Try it step by step: the whole dev stack in one Compose file</h3>
<p>Typing eight <code>docker run</code> lines every morning is not the goal. For a project, write the services you need once in a Compose file. This one — Postgres with an init folder and a real healthcheck, Mailpit, Adminer waiting for the database — was started on the Mac for this lesson:</p>
<pre><code class="language-yaml">name: phongkham-dev
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau
      POSTGRES_DB: phongkham
    ports: ["127.0.0.1:5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d phongkham -h 127.0.0.1"]
      interval: 2s
      retries: 15
  mail:
    image: axllent/mailpit:v1.31
    ports: ["127.0.0.1:8025:8025", "127.0.0.1:1025:1025"]
  adminer:
    image: adminer:6.1.0
    environment:
      ADMINER_DEFAULT_SERVER: db
    ports: ["127.0.0.1:8080:8080"]
    depends_on:
      db:
        condition: service_healthy
volumes:
  pgdata:</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · start everything</span><span class="lz-t">docker compose up -d</span><span class="lz-d">Took 3.1 s on the Mac; Adminer started only after db turned healthy.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · check the state</span><span class="lz-t">docker compose ps</span><span class="lz-d">db and mail show (healthy); adminer just "Up".</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · a container reaches another by name</span><span class="lz-t">docker run --rm --network phongkham-dev_default … curl smtp://mail:1025 …</span><span class="lz-d">Service names are host names on the Compose network — that is what your app uses.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · throw it away</span><span class="lz-t">docker compose down -v</span><span class="lz-d">-v also deletes pgdata: next up is a fresh first start that runs init again.</span></div>
</div>
<pre><code class="language-bash">docker compose ps --format 'table {{.Service}}\\t{{.Status}}\\t{{.Ports}}'</code></pre>
<div class="out">SERVICE   STATUS                   PORTS
adminer   Up Less than a second    127.0.0.1:18148-&gt;8080/tcp
db        Up 2 seconds (healthy)   127.0.0.1:18140-&gt;5432/tcp
mail      Up 2 seconds (healthy)   127.0.0.1:18147-&gt;1025/tcp, 127.0.0.1:18146-&gt;8025/tcp</div>
<p>(Ports in the output are the course's test ports.) Chapter 9 covers Compose itself; Chapter 13 shows how to hook this stack to hot reload and to integration tests.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate changed <code>POSTGRES_PASSWORD</code> in the group's <code>compose.yaml</code>, now nobody can log in, and someone suggests "just delete the volume" — the volume has a week of test data you need to keep.</p><ol>
<li>In <code>~/thu-docker/devstack</code>, create <code>init/01-schema.sql</code> and the Compose file above, <code>docker compose up -d</code>, and confirm two rows in <code>lich_hen</code>.</li>
<li>Take a backup first: <code>docker compose exec -T db pg_dump -U postgres -d phongkham --clean --if-exists &gt; truoc.sql</code> (<code>-T</code> = no pseudo-terminal in Compose).</li>
<li>Change <code>POSTGRES_PASSWORD</code> in the file, <code>docker compose up -d</code>, and show that the log says "Skipping initialization".</li>
<li>Fix it without losing data: set the password with <code>ALTER USER</code> through <code>docker compose exec db psql -U postgres</code>.</li>
<li>Prove the backup works: create a database <code>kiemtra</code>, restore <code>truoc.sql</code> into it with <code>exec -T … psql &lt; truoc.sql</code>, count the rows. Then <code>docker compose down -v</code>.</li></ol>
<p><strong>Done when:</strong> the log shows "Skipping initialization" after the password change; connecting with the new password works after <code>ALTER USER</code>; <code>kiemtra</code> has exactly 2 rows in <code>lich_hen</code>; and <code>docker volume ls</code> no longer shows the project's volume.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Init scripts (<code>/docker-entrypoint-initdb.d</code>)</span><span class="v">SQL/shell files an official DB image runs once, on the first start with an empty data folder.</span></div>
  <div class="kv"><span class="k">Healthcheck / readiness</span><span class="v">A command that says whether the service can actually take connections, not just whether the process is alive.</span></div>
  <div class="kv"><span class="k">Dump / restore</span><span class="v">Export a database to a file, and load that file back into a database.</span></div>
  <div class="kv"><span class="k">stdin / stdout</span><span class="v">A program's standard input and output; <code>docker exec</code> connects them to your shell's <code>&lt;</code> and <code>&gt;</code>.</span></div>
  <div class="kv"><span class="k">S3-compatible storage</span><span class="v">Any service that speaks Amazon S3's API, so the same SDK code works against it.</span></div>
  <div class="kv"><span class="k">SMTP catcher</span><span class="v">A fake mail server that accepts messages and shows them in a web inbox instead of delivering them.</span></div>
  <div class="kv"><span class="k">Docker Official Image</span><span class="v">An image in Docker Hub's curated library (<code>postgres</code>, <code>redis</code>…), without a user namespace in its name.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every common database or dev service is one <code>docker run</code> with env variables, a named volume and a port bound to <code>127.0.0.1</code>.</li>
<li>Init variables and <code>/docker-entrypoint-initdb.d</code> run only when the data folder is empty; later changes are silently ignored.</li>
<li>Postgres initialises through a temporary socket-only server: check readiness over TCP (<code>pg_isready -h 127.0.0.1</code>).</li>
<li>Dump and restore with the container's own tools through <code>docker exec</code>: <code>&gt;</code> out, <code>-i … &lt;</code> in, never <code>-t</code>.</li>
<li>Mailpit and MinIO let the app use real SMTP and S3 code against local fakes.</li>
<li>Images can vanish (MinIO 2025–2026): pin tags, prefer Official Images, keep a copy and a replacement.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — Docker Official Image</span><span class="lc-sub">Every environment variable, the init folder, and the notes about data directories and <code>PGDATA</code>.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/16/app-pgdump.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">pg_dump — PostgreSQL 16 documentation</span><span class="lc-sub">Formats, <code>--clean</code>, and why pg_dump cannot dump a newer server.</span></span>
</a>
<a class="link-card" href="https://mailpit.axllent.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📬</span>
  <span class="lc-body"><span class="lc-title">Mailpit</span><span class="lc-sub">The e-mail testing tool used above: SMTP on 1025, web UI and API on 8025.</span></span>
</a>
<a class="link-card" href="https://github.com/minio/minio" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">minio/minio on GitHub (archived)</span><span class="lc-sub">Read the README notice yourself: source-only community edition, no more prebuilt binaries.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic checking.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>image: postgres:latest</code> (or no tag at all) on a database with data. One day <code>pull</code> brings a new <em>major</em> version, and PostgreSQL refuses to start on a data directory written by an older major version — the container restarts in a loop while the data sits untouched but unusable. Major upgrades of a database go through a dump and restore (or <code>pg_upgrade</code>), on purpose. Pin at least the major version: <code>postgres:16-alpine</code>, <code>mysql:8.0</code>, <code>mongo:7</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A database in Docker is one command, but its first start is special: variables and init scripts apply only to an empty data folder. Get data out and in with the container's own tools, through stdout and stdin. And an image name is someone else's promise — pin it, and know your way back if they break it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Mọi loại CSDL và hạ tầng trong một lệnh</h2>
<p class="lead">Đồ án SWP391 của bạn dùng PostgreSQL. Bài lab CSDL đòi MySQL. Bài tập một môn khác làm trên MongoDB, backend cần Redis để giữ phiên đăng nhập, file người dùng tải lên phải vào "S3", và tính năng "quên mật khẩu" phải gửi được email. Cài hết chừng đó vào laptop nghĩa là sáu dịch vụ nền tự chạy mỗi lần bật máy, cổng giẫm lên nhau, và một MySQL 5.7 từ hai năm trước không ai dám gỡ. Với Docker, mỗi thứ là một lệnh để bật và một lệnh để vứt — và bạn chạy được ĐÚNG phiên bản mà thầy hoặc server production đang dùng.</p>
<p>Bài này chạy thật tám dịch vụ như thế, rồi đào vào ba chỗ người ta hay vấp: màn khởi tạo lần đầu hoạt động ra sao, làm sao đưa dữ liệu ra/vào, và chuyện gì xảy ra khi công ty đứng sau một ảnh đổi ý.</p>

<h3>Tám dịch vụ, tám lệnh</h3>
${slide('dk-14', 9, 'Tám dịch vụ, tám lệnh — mỗi cái ăn bao nhiêu RAM')}
<p>Mỗi dòng dưới đây là một lệnh hoàn chỉnh — chép là có dịch vụ đó. Cổng được gắn vào <code>127.0.0.1</code>, nên chỉ chính máy bạn kết nối được; viết trơn <code>-p 5432:5432</code> thì ai ngồi cùng Wi-Fi quán cà phê cũng thử được mật khẩu của bạn.</p>
<pre><code class="language-bash">docker run -d --name pg    -e POSTGRES_PASSWORD=matkhau -p 127.0.0.1:5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16-alpine
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=matkhau -e MYSQL_DATABASE=phongkham -p 127.0.0.1:3306:3306 -v mysqldata:/var/lib/mysql mysql:8.0
docker run -d --name mongo -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=matkhau -p 127.0.0.1:27017:27017 -v mongodata:/data/db mongo:7
docker run -d --name redis -p 127.0.0.1:6379:6379 redis:7-alpine redis-server --appendonly yes
docker run -d --name minio -e MINIO_ROOT_USER=admin -e MINIO_ROOT_PASSWORD=matkhau123 -p 127.0.0.1:9000:9000 -p 127.0.0.1:9001:9001 -v minio:/data quay.io/minio/minio server /data --console-address :9001
docker run -d --name mail  -p 127.0.0.1:8025:8025 -p 127.0.0.1:1025:1025 axllent/mailpit:v1.31
docker run -d --name rabbit --hostname rabbit -p 127.0.0.1:15672:15672 rabbitmq:4.3-management-alpine
docker run -d --name adminer -p 127.0.0.1:8080:8080 adminer:6.1.0</code></pre>
<p>Trên máy Mac của khoá, cả tám chạy cùng lúc (trên cổng 18140–18149, để khỏi đụng Postgres và Redis thật đang có sẵn trên máy). Mỗi cái tốn bao nhiêu — đo bằng <code>docker stats --no-stream</code> ngay sau khi khởi động — và bao lâu thì nó trả lời được lệnh kiểm tra của chính nó:</p>
<table>
<tr><th>Dịch vụ</th><th>Ảnh</th><th>RAM lúc mới chạy</th><th>Sẵn sàng sau</th><th>Kiểm sẵn sàng bằng</th></tr>
<tr><td>PostgreSQL</td><td><code>postgres:16-alpine</code></td><td>42 MiB</td><td>~1 giây</td><td><code>pg_isready -h 127.0.0.1</code></td></tr>
<tr><td>MySQL</td><td><code>mysql:8.0</code></td><td>368 MiB</td><td>8 giây</td><td><code>mysql -uroot -p… -h127.0.0.1 -e "select 1"</code></td></tr>
<tr><td>MongoDB</td><td><code>mongo:7</code></td><td>87 MiB</td><td>6 giây</td><td><code>mongosh --eval "db.runCommand({ping:1}).ok"</code></td></tr>
<tr><td>Redis</td><td><code>redis:7-alpine</code></td><td>5 MiB</td><td>~1 giây</td><td><code>redis-cli ping</code> → <code>PONG</code></td></tr>
<tr><td>MinIO (S3)</td><td><code>quay.io/minio/minio</code></td><td>167 MiB</td><td>~3 giây</td><td><code>curl …:9000/minio/health/live</code> → 200</td></tr>
<tr><td>Mailpit</td><td><code>axllent/mailpit:v1.31</code></td><td>20 MiB</td><td>~1 giây</td><td>có sẵn healthcheck: <code>(healthy)</code> trong <code>docker ps</code></td></tr>
<tr><td>RabbitMQ</td><td><code>rabbitmq:4.3-management-alpine</code></td><td>103 MiB</td><td>2,6 giây (theo log của nó)</td><td><code>rabbitmq-diagnostics -q ping</code></td></tr>
<tr><td>Adminer</td><td><code>adminer:6.1.0</code></td><td>53 MiB</td><td>~1 giây</td><td>mở trang: <code>&lt;title&gt;Login - Adminer&lt;/title&gt;</code></td></tr>
</table>
<p>Cộng lại chưa tới 850 MiB — cả "hậu trường" của một sản phẩm thật trên laptop sinh viên. Riêng MySQL đã gần một nửa; nếu bạn chỉ cần <em>một</em> CSDL quan hệ, Postgres là cái nhẹ.</p>
<p>Adminer là một giao diện web quản trị CSDL gói trong một file, dùng được cho Postgres, MySQL, SQLite và nhiều loại khác — tiện khi bạn cùng nhóm không có DBeaver hay pgAdmin. Muốn nó gọi CSDL bằng tên thì hai container phải cùng một mạng Docker; trong Compose việc đó tự động, và <code>ADMINER_DEFAULT_SERVER=db</code> điền sẵn ô "server".</p>

<h3>Postgres một lệnh: biến môi trường và thư mục init</h3>
${slide('dk-14', 10, 'Postgres một lệnh: biến môi trường + thư mục init')}
<p>Các ảnh CSDL chính thức đọc vài biến môi trường ở lần khởi động <em>đầu tiên</em> và tạo sẵn user, CSDL cho bạn. Chúng còn chạy mọi file <code>.sql</code> hay <code>.sh</code> tìm thấy trong <code>/docker-entrypoint-initdb.d</code>, theo thứ tự tên file. Gắn một thư mục vào đó là bảng và dữ liệu mẫu sẵn sàng ngay khi container sẵn sàng:</p>
<pre><code class="language-bash">cat init/01-schema.sql
docker run -d --name pg \\
  -e POSTGRES_PASSWORD=matkhau -e POSTGRES_DB=phongkham \\
  -p 127.0.0.1:18140:5432 -v pgdata:/var/lib/postgresql/data \\
  -v "$PWD/init":/docker-entrypoint-initdb.d:ro postgres:16-alpine
docker logs pg 2&gt;&amp;1 | grep -E "initdb.d|ready to accept"
docker exec pg psql -U postgres -d phongkham -c "select * from lich_hen"</code></pre>
<div class="out">CREATE TABLE lich_hen (id serial PRIMARY KEY, benh_nhan text NOT NULL, gio timestamptz NOT NULL);
INSERT INTO lich_hen (benh_nhan, gio) VALUES ('An', '2026-09-25 08:00+07'), ('Binh', '2026-09-25 09:30+07');
2026-09-24 00:22:18.223 UTC [54] LOG:  database system is ready to accept connections
/usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/01-schema.sql
2026-09-24 00:22:18.497 UTC [1] LOG:  database system is ready to accept connections
 id | benh_nhan |          gio
----+-----------+------------------------
  1 | An        | 2026-09-25 01:00:00+00
  2 | Binh      | 2026-09-25 02:30:00+00
(2 rows)</div>
<p>Có hai chỗ trong output này đáng nhìn lại. Giờ được lưu đúng nhưng hiển thị theo UTC — 08:00 giờ Việt Nam là 01:00 UTC; container không có múi giờ (Chương 2 chỉ cách đặt <code>TZ</code>). Và dòng "ready to accept connections" xuất hiện <strong>HAI lần</strong>: lần đầu từ tiến trình 54, lần sau từ tiến trình 1. Entrypoint dựng một server <em>tạm</em> chỉ nghe trên Unix socket (ổ cắm file, không qua mạng), chạy các script init của bạn vào đó, tắt nó đi, rồi mới dựng server thật (PID 1) nghe trên TCP. Một phép kiểm "sẵn sàng chưa" nói chuyện qua socket — <code>pg_isready</code> không có <code>-h</code> — có thể trả lời "rồi" với server tạm, và app của bạn kết nối đúng vào khoảng trống giữa hai server. Hãy kiểm qua TCP như ở trên: <code>pg_isready -h 127.0.0.1</code>.</p>
<table>
<tr><th>Ảnh</th><th>Bắt buộc ở lần đầu</th><th>Tuỳ chọn</th><th>Thư mục init</th></tr>
<tr><td><code>postgres</code></td><td><code>POSTGRES_PASSWORD</code> (thiếu là container thoát luôn)</td><td><code>POSTGRES_USER</code>, <code>POSTGRES_DB</code></td><td><code>/docker-entrypoint-initdb.d</code></td></tr>
<tr><td><code>mysql</code></td><td><code>MYSQL_ROOT_PASSWORD</code> (hoặc <code>MYSQL_ALLOW_EMPTY_PASSWORD</code> / <code>MYSQL_RANDOM_ROOT_PASSWORD</code>)</td><td><code>MYSQL_DATABASE</code>, <code>MYSQL_USER</code>, <code>MYSQL_PASSWORD</code></td><td><code>/docker-entrypoint-initdb.d</code></td></tr>
<tr><td><code>mongo</code></td><td>không gì cả — nhưng không có user root thì không có xác thực</td><td><code>MONGO_INITDB_ROOT_USERNAME</code>, <code>…_PASSWORD</code>, <code>MONGO_INITDB_DATABASE</code></td><td><code>/docker-entrypoint-initdb.d</code> (<code>.js</code>, <code>.sh</code>)</td></tr>
</table>

<h3>Script khởi tạo chỉ chạy khi thư mục dữ liệu rỗng</h3>
${slide('dk-14', 11, 'Script khởi tạo chỉ chạy khi thư mục dữ liệu RỖNG')}
<p>Thêm một script thứ hai rồi khởi động lại container trên CÙNG volume:</p>
<pre><code class="language-bash">echo "INSERT INTO lich_hen (benh_nhan, gio) VALUES ('Cuong', now());" &gt; init/02-them.sql
docker stop pg &amp;&amp; docker rm pg
docker run -d --name pg … <span class="tok-comment"># y hệt lệnh cũ, cùng volume pgdata</span>
docker logs pg 2&gt;&amp;1 | head -3
docker exec pg psql -U postgres -d phongkham -tAc "select count(*) from lich_hen"</code></pre>
<div class="out">PostgreSQL Database directory appears to contain a database; Skipping initialization

2</div>
<p>Vẫn hai dòng. Entrypoint nhìn vào thư mục dữ liệu: rỗng nghĩa là "lần đầu" — tạo cụm CSDL, áp biến môi trường, chạy các script; không rỗng nghĩa là "đã khởi tạo rồi" — bỏ qua tất cả, không nói một lời. Luật đó áp dụng cho cả các biến môi trường.</p>
<div class="pitfall co-tieu-de"><strong>"Tôi đổi POSTGRES_PASSWORD trong compose.yaml mà mật khẩu mới không vào được."</strong> Mật khẩu đã được ghi vào file CSDL từ lần khởi động đầu tiên. Mọi lần khởi động sau đều thấy volume không rỗng và bỏ qua biến đó hoàn toàn — mật khẩu cũ vẫn là mật khẩu. Hoặc đổi nó bên trong CSDL (<code>ALTER USER postgres PASSWORD '…';</code>), hoặc, nếu dữ liệu vứt được, xoá volume để lần khởi động sau lại là lần đầu. Chuyện y hệt xảy ra với <code>POSTGRES_DB</code>, <code>MYSQL_DATABASE</code> và mọi script init bạn thêm về sau: muốn đổi một CSDL đang chạy thì chạy migration; đừng sửa thư mục init rồi cầu may.</div>

<h3>Dump/restore qua docker exec — bằng công cụ của chính container</h3>
${slide('dk-14', 12, 'Dump/restore qua docker exec — dùng pg_dump CỦA container')}
<p>Cách hiển nhiên là trỏ cái <code>pg_dump</code> cài trên laptop vào cổng đã công bố. Trên máy Mac của khoá, chuyện diễn ra thế này:</p>
<pre><code class="language-bash">pg_dump -h 127.0.0.1 -p 18140 -U postgres phongkham</code></pre>
<div class="out">pg_dump: error: server version: 16.14; pg_dump version: 14.19 (Homebrew)
pg_dump: error: aborting because of server version mismatch</div>
<p><code>pg_dump</code> từ chối dump một server mới hơn chính nó. Container thì có sẵn đúng phiên bản — dùng nó, và để dữ liệu chảy qua các luồng chuẩn (stdin/stdout) của <code>docker exec</code>:</p>
<pre><code class="language-bash">docker exec pg pg_dump -U postgres -d phongkham --clean --if-exists &gt; pk.sql      <span class="tok-comment"># SQL thuần, ra qua stdout</span>
docker exec pg pg_dump -U postgres -d phongkham -Fc -f /tmp/pk.dump             <span class="tok-comment"># định dạng custom, ghi bên trong…</span>
docker cp pg:/tmp/pk.dump ./pk.dump                                              <span class="tok-comment"># …rồi chép ra ngoài</span>
ls -l pk.*
docker exec pg createdb -U postgres khoiphuc
docker exec -i pg psql -U postgres -d khoiphuc -q &lt; pk.sql                        <span class="tok-comment"># vào qua stdin: cần -i</span>
docker exec pg psql -U postgres -d khoiphuc -tAc "select benh_nhan from lich_hen"
docker exec pg createdb -U postgres tu_dump
docker exec -i pg pg_restore -U postgres -d tu_dump &lt; pk.dump; echo "restore exit=$?"</code></pre>
<div class="out">-rw-r--r--@ 1 admin  wheel  2751 Sep 24 07:22 pk.dump
-rw-r--r--@ 1 admin  wheel  2348 Sep 24 07:22 pk.sql
 set_config
------------

(1 row)

 setval
--------
      2
(1 row)

An
Binh
restore exit=0</div>
<p>Hai bảng <code>set_config</code> và <code>setval</code> không phải lỗi: đó là kết quả của các câu <code>SELECT</code> nằm trong file dump mà <code>-q</code> không tắt được (thêm <code>-o /dev/null</code> để giấu chúng). Hai dòng "An" và "Binh" mới là bằng chứng bản sao có dữ liệu.</p>
<table>
<tr><th>Mảnh lệnh</th><th>Vì sao</th></tr>
<tr><td><code>docker exec pg pg_dump … &gt; file</code></td><td>Việc dump chạy trong container (đúng phiên bản); dấu <code>&gt;</code> do shell CỦA BẠN hiểu, nên file rơi xuống đĩa của bạn</td></tr>
<tr><td><code>--clean --if-exists</code></td><td>File dump mở đầu bằng lệnh xoá các đối tượng đã có, nên khôi phục đè lên bản cũ không bị đụng</td></tr>
<tr><td><code>-Fc</code> + <code>pg_restore</code></td><td>Định dạng "custom" có nén; khôi phục được từng bảng riêng. Là file nhị phân — đừng bao giờ cho nó đi qua terminal</td></tr>
<tr><td><code>docker exec -i</code></td><td>Giữ stdin mở để <code>&lt; pk.sql</code> tới được psql. Thiếu <code>-i</code>, psql chẳng nhận được gì và thoát vui vẻ</td></tr>
<tr><td>không <code>-t</code></td><td>Terminal giả đổi ký tự xuống dòng và có thể làm hỏng file dump; <code>-t</code> chỉ dành cho người gõ</td></tr>
</table>
<p>MySQL làm y như vậy: <code>docker exec mysql sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" phongkham' &gt; pk.sql</code> (nháy đơn để shell TRONG container mở biến, không phải shell của bạn). Với MongoDB, <code>mongodump --archive</code> ghi ra stdout theo cùng tinh thần; lệnh này không chạy trong bài.</p>

<h3>Mailpit bắt thư, MinIO giả làm S3</h3>
${slide('dk-14', 13, 'Mailpit bắt thư, MinIO giả làm S3')}
<p>Hai dịch vụ khiến app "tin" rằng nó đang ở production. Mailpit là một máy chủ SMTP (giao thức gửi thư) nhận mọi thư mà không giao thư nào: app gửi vào cổng 1025, bạn đọc kết quả trong hộp thư web ở cổng 8025. Trên Mac, gửi một thư bằng <code>curl</code> trơn rồi đọc lại qua API của Mailpit:</p>
<pre><code class="language-bash">curl -s smtp://127.0.0.1:18147 --mail-from phongkham@vidu.test --mail-rcpt an@vidu.test -T mail.txt
curl -s http://127.0.0.1:18146/api/v1/messages | python3 -c '…in tổng số, người gửi, người nhận, tiêu đề…'</code></pre>
<div class="out">total: 1
phongkham@vidu.test -&gt; an@vidu.test | Xac nhan lich hen 25/09</div>
<p>Trong <code>.env</code> dành cho môi trường dev của app, đó chỉ là <code>SMTP_HOST=mail</code>, <code>SMTP_PORT=1025</code>, không mật khẩu. Bạn cùng nhóm thử "quên mật khẩu" năm chục lần mà không hộp thư thật nào bị spam — và không ai làm lộ mật khẩu ứng dụng Gmail thật vào repo.</p>
<p>MinIO nói giao thức S3 API, nên cùng đoạn mã AWS SDK tải file lên S3 (hay lên Cloudflare R2) sẽ tải được lên laptop của bạn. Client S3 nào cũng dùng được; ở đây <code>rclone</code> chạy như một container dùng một lần (Bài 14.1), cấu hình truyền qua biến môi trường:</p>
<pre><code class="language-bash">r() { docker run --rm -v "$PWD":/w -w /w \\
  -e RCLONE_CONFIG_S3_TYPE=s3 -e RCLONE_CONFIG_S3_PROVIDER=Minio \\
  -e RCLONE_CONFIG_S3_ACCESS_KEY_ID=admin -e RCLONE_CONFIG_S3_SECRET_ACCESS_KEY=matkhau123 \\
  -e RCLONE_CONFIG_S3_ENDPOINT=http://host.docker.internal:18144 rclone/rclone:1.71 "$@"; }
r mkdir s3:anh-benh-nhan
r copy pk.sql s3:anh-benh-nhan/sao-luu/
r ls s3:anh-benh-nhan</code></pre>
<div class="out">     2348 sao-luu/pk.sql</div>
<p>(Mỗi lần gọi còn in <code>NOTICE: Config file "/config/rclone/rclone.conf" not found - using defaults</code> — đúng như dự kiến, vì cấu hình đến từ biến môi trường.) <code>host.docker.internal</code> là cách một container trên Docker Desktop gọi tới một cổng đã công bố trên máy Mac; trên Linux, cho hai container vào chung một mạng rồi gọi bằng tên container.</p>

<h3>Một ảnh có thể biến mất: chuyện MinIO 2025–2026</h3>
${slide('dk-14', 14, 'Ảnh của bên thứ ba có thể biến mất: chuyện MinIO')}
<p>Để ý lệnh MinIO ở trên dùng <code>quay.io/minio/minio</code>, không phải <code>minio/minio</code> mà mọi bài hướng dẫn vẫn in. Ngày 24/09/2026, trên máy Mac của khoá:</p>
<pre><code class="language-bash">docker pull minio/minio:latest
docker logs minio | grep Version</code></pre>
<div class="out">Error response from daemon: pull access denied for minio/minio, repository does not exist or may require 'docker login'
Version: RELEASE.2025-09-07T16-13-09Z (go1.24.6 linux/arm64)</div>
<p>Chuyện gì đã xảy ra, trong phạm vi kiểm được hôm nay: MinIO ngừng phát hành bản dựng sẵn (binary và ảnh) cho bản cộng đồng — README của họ giờ ghi bản cộng đồng "is now distributed as source code only" (chỉ còn phát hành dạng mã nguồn) và các bản cũ "will not receive updates" (không còn được cập nhật); kho GitHub bị lưu trữ (archived) ngày 25/04/2026; kho <code>minio/minio</code> trên Docker Hub không kéo được nữa; bản trên <code>quay.io</code> vẫn còn, với bản phát hành cuối từ tháng 9/2025 cộng vài tag vá lỗi. Chương 3 đã kể một chuyện tương tự với Bitnami năm 2025. Khuôn mẫu giống hệt: một tên ảnh thuộc về ai đó, và họ có quyền đổi luật chơi.</p>
<ul>
<li><strong>Ghim tag</strong>, để biết chính xác mình phụ thuộc vào phiên bản nào và còn tìm lại được nó.</li>
<li><strong>Ưu tiên Docker Official Image</strong> (ảnh chính thức: <code>postgres</code>, <code>redis</code>, <code>mysql</code>, <code>mongo</code>, <code>rabbitmq</code>, <code>adminer</code>, <code>caddy</code>…) cho hạ tầng phổ biến: chúng được duy trì công khai và không phụ thuộc mô hình kinh doanh của một công ty.</li>
<li><strong>Có đường lùi:</strong> một bản sao các ảnh bạn phụ thuộc trong registry (kho ảnh) của riêng mình (GHCR, Chương 3), và một dịch vụ thay thế đã biết cho mỗi dịch vụ của bên thứ ba. Với S3 cho môi trường dev, thứ gì nói được S3 API cũng dùng được.</li>
</ul>
<div class="callout warn"><strong>Lại là volume vô danh.</strong> <code>docker inspect</code> trên các container đang chạy cho thấy <code>redis:7-alpine</code> tự gắn một volume <em>vô danh</em> ở <code>/data</code>, <code>mongo:7</code> một cái ở <code>/data/configdb</code> (cạnh volume có tên ở <code>/data/db</code>), và RabbitMQ một cái ở <code>/var/lib/rabbitmq</code>. Với <code>--rm</code> hoặc <code>docker rm -v</code>, chúng bị xoá cùng container — với Redis nghĩa là file <code>--appendonly yes</code> mà bạn tưởng đang bảo vệ phiên đăng nhập cũng đi luôn. Thứ gì muốn giữ thì cho nó một volume <em>có tên</em> (Chương 7).</div>

<h3>Chạy thử từng bước: cả bộ dịch vụ dev trong một file Compose</h3>
<p>Mục tiêu không phải là sáng nào cũng gõ tám dòng <code>docker run</code>. Với một dự án, hãy viết một lần các dịch vụ cần dùng vào file Compose. File này — Postgres có thư mục init và healthcheck thật, Mailpit, Adminer chờ CSDL sẵn sàng — đã được chạy trên Mac cho bài này:</p>
<pre><code class="language-yaml">name: phongkham-dev
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: matkhau
      POSTGRES_DB: phongkham
    ports: ["127.0.0.1:5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d phongkham -h 127.0.0.1"]
      interval: 2s
      retries: 15
  mail:
    image: axllent/mailpit:v1.31
    ports: ["127.0.0.1:8025:8025", "127.0.0.1:1025:1025"]
  adminer:
    image: adminer:6.1.0
    environment:
      ADMINER_DEFAULT_SERVER: db
    ports: ["127.0.0.1:8080:8080"]
    depends_on:
      db:
        condition: service_healthy
volumes:
  pgdata:</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · bật tất cả</span><span class="lz-t">docker compose up -d</span><span class="lz-d">Mất 3,1 giây trên Mac; Adminer chỉ khởi động SAU khi db chuyển sang healthy.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · xem trạng thái</span><span class="lz-t">docker compose ps</span><span class="lz-d">db và mail hiện (healthy); adminer chỉ "Up".</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · container gọi nhau bằng tên</span><span class="lz-t">docker run --rm --network phongkham-dev_default … curl smtp://mail:1025 …</span><span class="lz-d">Tên dịch vụ là tên máy trong mạng Compose — app của bạn dùng đúng tên đó.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · vứt đi</span><span class="lz-t">docker compose down -v</span><span class="lz-d">-v xoá cả pgdata: lần up sau lại là lần đầu, init chạy lại.</span></div>
</div>
<pre><code class="language-bash">docker compose ps --format 'table {{.Service}}\\t{{.Status}}\\t{{.Ports}}'</code></pre>
<div class="out">SERVICE   STATUS                   PORTS
adminer   Up Less than a second    127.0.0.1:18148-&gt;8080/tcp
db        Up 2 seconds (healthy)   127.0.0.1:18140-&gt;5432/tcp
mail      Up 2 seconds (healthy)   127.0.0.1:18147-&gt;1025/tcp, 127.0.0.1:18146-&gt;8025/tcp</div>
<p>(Cổng trong output là cổng thử của khoá.) Chương 9 dạy bản thân Compose; Chương 13 chỉ cách nối bộ dịch vụ này với hot reload và với test tích hợp.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn trong nhóm đổi <code>POSTGRES_PASSWORD</code> trong <code>compose.yaml</code> chung, giờ không ai đăng nhập được, và có người bảo "cứ xoá volume đi" — mà volume đó chứa một tuần dữ liệu test bạn cần giữ.</p><ol>
<li>Trong <code>~/thu-docker/devstack</code>, tạo <code>init/01-schema.sql</code> và file Compose ở trên, <code>docker compose up -d</code>, xác nhận <code>lich_hen</code> có hai dòng.</li>
<li>Sao lưu trước đã: <code>docker compose exec -T db pg_dump -U postgres -d phongkham --clean --if-exists &gt; truoc.sql</code> (<code>-T</code> = không cấp terminal giả, trong Compose).</li>
<li>Đổi <code>POSTGRES_PASSWORD</code> trong file, <code>docker compose up -d</code>, và chỉ ra dòng log "Skipping initialization".</li>
<li>Sửa mà không mất dữ liệu: đặt mật khẩu bằng <code>ALTER USER</code> qua <code>docker compose exec db psql -U postgres</code>.</li>
<li>Chứng minh bản sao lưu dùng được: tạo CSDL <code>kiemtra</code>, khôi phục <code>truoc.sql</code> vào đó bằng <code>exec -T … psql &lt; truoc.sql</code>, đếm dòng. Rồi <code>docker compose down -v</code>.</li></ol>
<p><strong>Đạt khi:</strong> log có "Skipping initialization" sau khi đổi mật khẩu; đăng nhập bằng mật khẩu mới được sau <code>ALTER USER</code>; <code>kiemtra</code> có đúng 2 dòng trong <code>lich_hen</code>; và <code>docker volume ls</code> không còn volume của dự án.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Init scripts (script khởi tạo, <code>/docker-entrypoint-initdb.d</code>)</span><span class="v">File SQL/shell mà ảnh CSDL chính thức chạy đúng một lần, ở lần khởi động đầu với thư mục dữ liệu rỗng.</span></div>
  <div class="kv"><span class="k">Healthcheck / readiness (kiểm sẵn sàng)</span><span class="v">Lệnh cho biết dịch vụ đã nhận kết nối được thật chưa, không chỉ là tiến trình còn sống.</span></div>
  <div class="kv"><span class="k">Dump / restore (xuất / khôi phục)</span><span class="v">Xuất một CSDL ra file, và nạp file đó trở lại một CSDL.</span></div>
  <div class="kv"><span class="k">stdin / stdout (đầu vào / đầu ra chuẩn)</span><span class="v">Luồng vào và ra của một chương trình; <code>docker exec</code> nối chúng với dấu <code>&lt;</code> và <code>&gt;</code> của shell bạn.</span></div>
  <div class="kv"><span class="k">S3-compatible (tương thích S3)</span><span class="v">Dịch vụ nói cùng API với Amazon S3, nên cùng một đoạn mã SDK chạy được với nó.</span></div>
  <div class="kv"><span class="k">SMTP catcher (bẫy thư)</span><span class="v">Máy chủ thư giả nhận thư rồi hiện trong hộp thư web thay vì giao đi thật.</span></div>
  <div class="kv"><span class="k">Docker Official Image (ảnh chính thức)</span><span class="v">Ảnh trong thư viện được tuyển chọn của Docker Hub (<code>postgres</code>, <code>redis</code>…), tên không có phần tên người dùng phía trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi CSDL hay dịch vụ dev phổ biến là một <code>docker run</code> với biến môi trường, một volume có tên và một cổng gắn vào <code>127.0.0.1</code>.</li>
<li>Biến khởi tạo và <code>/docker-entrypoint-initdb.d</code> chỉ chạy khi thư mục dữ liệu rỗng; thay đổi về sau bị bỏ qua mà không báo.</li>
<li>Postgres khởi tạo qua một server tạm chỉ nghe socket: kiểm sẵn sàng qua TCP (<code>pg_isready -h 127.0.0.1</code>).</li>
<li>Dump và restore bằng công cụ của chính container qua <code>docker exec</code>: <code>&gt;</code> để ra, <code>-i … &lt;</code> để vào, không bao giờ <code>-t</code>.</li>
<li>Mailpit và MinIO cho app dùng mã SMTP và S3 thật với hàng giả ở máy mình.</li>
<li>Ảnh có thể biến mất (MinIO 2025–2026): ghim tag, ưu tiên ảnh chính thức, giữ một bản sao và một phương án thay thế.</li>
</ul>

<a class="link-card" href="https://hub.docker.com/_/postgres" target="_blank" rel="noopener">
  <span class="lc-ico">🐘</span>
  <span class="lc-body"><span class="lc-title">postgres — ảnh chính thức của Docker</span><span class="lc-sub">Mọi biến môi trường, thư mục init, và ghi chú về thư mục dữ liệu và <code>PGDATA</code>.</span></span>
</a>
<a class="link-card" href="https://www.postgresql.org/docs/16/app-pgdump.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">pg_dump — tài liệu PostgreSQL 16</span><span class="lc-sub">Các định dạng, <code>--clean</code>, và vì sao pg_dump không dump được server mới hơn nó.</span></span>
</a>
<a class="link-card" href="https://mailpit.axllent.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📬</span>
  <span class="lc-body"><span class="lc-title">Mailpit</span><span class="lc-sub">Công cụ thử email dùng ở trên: SMTP ở 1025, giao diện web và API ở 8025.</span></span>
</a>
<a class="link-card" href="https://github.com/minio/minio" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">minio/minio trên GitHub (đã lưu trữ)</span><span class="lc-sub">Tự đọc thông báo trong README: bản cộng đồng chỉ còn mã nguồn, không còn bản dựng sẵn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>image: postgres:latest</code> (hoặc không ghi tag) cho một CSDL đang có dữ liệu. Một ngày <code>pull</code> kéo về một phiên bản <em>chính</em> (major) mới, và PostgreSQL từ chối khởi động trên thư mục dữ liệu do phiên bản chính cũ hơn ghi ra — container khởi động lại vòng vòng trong khi dữ liệu vẫn nằm đó, nguyên vẹn mà không dùng được. Nâng phiên bản chính của CSDL phải đi qua dump và restore (hoặc <code>pg_upgrade</code>), một cách có chủ đích. Ít nhất hãy ghim phiên bản chính: <code>postgres:16-alpine</code>, <code>mysql:8.0</code>, <code>mongo:7</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một CSDL trong Docker chỉ là một lệnh, nhưng lần khởi động đầu tiên của nó đặc biệt: biến môi trường và script init chỉ áp cho thư mục dữ liệu rỗng. Đưa dữ liệu ra/vào bằng công cụ của chính container, qua stdout và stdin. Và một tên ảnh là lời hứa của người khác — ghim nó lại, và biết đường lùi nếu họ nuốt lời.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — Self-hosting services with automatic HTTPS|||14.3 — Tự host dịch vụ, có HTTPS tự động',
      slug: 'dk-14-3-tu-host',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Caddy làm reverse proxy tự cấp HTTPS (chạy thật ở chế độ tls internal), Vaultwarden/Uptime Kuma/n8n với ảnh chính thức đã kiểm, sao lưu volume bằng tar, cập nhật ảnh có chủ đích, cái bẫy gắn file đơn khi sửa Caddyfile, và cái giá bảo mật khi mở cổng ra Internet.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Self-hosting services with automatic HTTPS</h2>
<p class="lead">Once you have a VPS for your project — or an old PC at home that stays on — Docker makes it tempting to run more than your own app on it: a status page that tells the team the demo site is down before the lecturer notices, a shared password vault so nobody sends the database password on Zalo again, a workflow tool that turns a form submission into a spreadsheet row and an e-mail. Each of those is one Compose file away. What the Compose file does not give you is the job that comes with it: you are now the administrator of that service, its certificates, its backups, its updates and its attack surface.</p>
<p>This lesson builds the part that sits in front of everything — a reverse proxy that handles HTTPS by itself — runs one real service behind it, and then goes through the three chores that decide whether self-hosting is a good idea: backups, updates and exposure. Everything was run locally on the Mac; nothing in this lesson opens a port to the Internet.</p>

<h3>Caddy: four lines instead of nginx + certbot</h3>
${slide('dk-14', 15, 'Caddy: bốn dòng thay cho cả khối nginx + certbot')}
<p>In the nginx course (<a href="/courses/nginx">/courses/nginx</a>) and Chapter 10 of this one, HTTPS meant nginx plus certbot plus a renewal timer plus a server block that redirects port 80. Caddy is a web server and reverse proxy written in Go whose headline feature is <em>automatic HTTPS</em>: give it a host name and it obtains, installs and renews the certificate, redirects HTTP to HTTPS, and turns on HTTP/2 and HTTP/3. Here is the complete configuration used in this lesson:</p>
<pre><code class="language-bash">vault.localhost:18140 {
	tls internal
	reverse_proxy vaultwarden:80
}</code></pre>
<p>The site address (host name and, here, a port from the course range) says which requests this block serves. <code>reverse_proxy vaultwarden:80</code> forwards them to the container named <code>vaultwarden</code> on the Compose network. <code>tls internal</code> is the line that keeps this lesson offline: instead of asking Let's Encrypt for a public certificate — which requires a real domain pointing at the machine and ports 80/443 reachable from the Internet — Caddy creates its own small certificate authority and signs a certificate itself.</p>
<pre><code class="language-yaml">name: tuhost
services:
  caddy:
    image: caddy:2.11-alpine
    ports:
      - "127.0.0.1:18140:18140"
    volumes:
      - ./caddy:/etc/caddy:ro          <span class="tok-comment"># the FOLDER, not the file — see below</span>
      - caddy_data:/data               <span class="tok-comment"># certificates and the CA live here</span>
    restart: unless-stopped
  vaultwarden:
    image: vaultwarden/server:1.37.3-alpine
    environment:
      DOMAIN: "https://vault.localhost:18140"
      SIGNUPS_ALLOWED: "false"
    volumes:
      - vw_data:/data
    restart: unless-stopped
volumes:
  caddy_data:
  vw_data:</code></pre>
<pre><code class="language-bash">docker compose up -d
docker compose logs caddy | grep -o '"msg":"[^"]*"' | grep -iE "root|trusts|obtained"</code></pre>
<div class="out">"msg":"installing root certificate (you might be prompted for password)"
"msg":"certificate installed properly in linux trusts"
"msg":"certificate obtained successfully"</div>
<table>
<tr><th></th><th>nginx (Chapter 10, /courses/nginx)</th><th>Caddy</th></tr>
<tr><td>HTTPS certificates</td><td>certbot as a separate tool + a renewal timer</td><td>built in: obtained and renewed automatically</td></tr>
<tr><td>HTTP → HTTPS redirect</td><td>you write the port-80 server block</td><td>default</td></tr>
<tr><td>HTTP/2, HTTP/3</td><td>enabled by hand</td><td>default (the response above advertises <code>h3</code>)</td></tr>
<tr><td>A reverse-proxy site</td><td>5–10 lines</td><td>1 line</td></tr>
<tr><td>Fine-grained tuning, tutorials, answers online</td><td>enormous</td><td>fewer</td></tr>
</table>
<p>Which one to choose is not a contest. nginx is everywhere and worth knowing (this course's production stack uses it). For a small box with several self-hosted services, Caddy's defaults remove a whole class of mistakes — like the certificate that silently expired because the renewal cron was never installed.</p>

<h3>tls internal: real HTTPS, trusted only by whoever trusts Caddy's CA</h3>
${slide('dk-14', 16, 'tls internal: HTTPS thật, nhưng chỉ ai tin CA của Caddy mới tin')}
<pre><code class="language-bash">curl https://vault.localhost:18140/
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
curl --cacert caddy-root.crt -sI https://vault.localhost:18140/ | grep -iE "^HTTP|^via|^server|alt-svc"
openssl x509 -in caddy-root.crt -noout -subject -enddate
echo | openssl s_client -connect 127.0.0.1:18140 -servername vault.localhost 2&gt;/dev/null | openssl x509 -noout -issuer -enddate</code></pre>
<div class="out">curl: (60) SSL certificate problem: unable to get local issuer certificate
HTTP/2 200
alt-svc: h3=":18140"; ma=2592000
server: Rocket
via: 1.1 Caddy
subject=CN=Caddy Local Authority - 2026 ECC Root
notAfter=Aug  2 00:28:10 2036 GMT
issuer=CN=Caddy Local Authority - ECC Intermediate
notAfter=Sep 24 12:28:10 2026 GMT</div>
<p>Read it as a chain. Caddy generated a <strong>root</strong> certificate valid for ten years, an <strong>intermediate</strong> signed by it, and a <strong>leaf</strong> certificate for <code>vault.localhost</code> signed by the intermediate — the leaf was issued at 00:28 UTC and expires at 12:28: twelve hours. Caddy renews it long before that, which is why you never have to think about it. The first <code>curl</code> fails because your Mac has never heard of "Caddy Local Authority"; the second succeeds because <code>--cacert</code> says "trust this root for this request". <code>server: Rocket</code> is Vaultwarden answering (it is written in Rust with the Rocket framework); <code>via: 1.1 Caddy</code> shows the request went through the proxy.</p>
<div class="pitfall co-tieu-de"><strong>"certificate installed properly in linux trusts" does not mean your browser trusts it.</strong> That log line comes from inside the container: Caddy added its root to the trust store <em>of the Alpine Linux in the container</em>. Your Mac's keychain, your browser and your teammates' laptops know nothing about it, so the browser shows a full-page warning. Caddy's own documentation says as much: installing into local trust stores "is for convenience only and isn't guaranteed to work, especially if containers are being used". Distribute <code>root.crt</code> deliberately to the machines that should trust it — or, for anything public, use a real domain and let Caddy get a publicly trusted certificate.</div>
<p>Two more details from Caddy's automatic-HTTPS documentation: names like <code>localhost</code>, <code>*.localhost</code>, <code>*.local</code> and <code>*.internal</code> get an internal certificate even without <code>tls internal</code>, because no public CA would issue one for them; and <code>tls internal</code> is what you write when you want the same behaviour for any other name (a LAN-only host name, for example).</p>

<h3>Three services worth self-hosting — images checked</h3>
${slide('dk-14', 17, 'Ba dịch vụ đáng tự host — ảnh chính thức, đã kiểm')}
<table>
<tr><th>Service</th><th>What for</th><th>Image named by the project (09/2026)</th><th>Download</th><th>Port · data</th><th>Watch out</th></tr>
<tr><td><strong>Vaultwarden</strong></td><td>A password vault for the team; works with the official Bitwarden apps</td><td><code>vaultwarden/server:1.37.3-alpine</code></td><td>64 MB</td><td>80 · <code>/data</code></td><td>Needs HTTPS (below). An unofficial, community server for the Bitwarden API</td></tr>
<tr><td><strong>Uptime Kuma</strong></td><td>Pings your demo site every minute, alerts on Telegram/Discord/e-mail</td><td><code>louislam/uptime-kuma:2</code></td><td>602 MB (<code>2-slim</code>: 182 MB)</td><td>3001 · <code>/app/data</code></td><td>The README: data on NFS "NOT supported" — use a local volume</td></tr>
<tr><td><strong>n8n</strong></td><td>Workflow automation: form → sheet → e-mail, without writing a backend</td><td><code>n8nio/n8n</code> (pin a version tag)</td><td>267 MB</td><td>5678 · <code>/home/node/.n8n</code></td><td>"Sustainable Use License" (fair-code), not an OSI open-source licence</td></tr>
</table>
<p>"Image named by the project" is the check that matters. Each name above is the one the project's own README or documentation tells you to use: Vaultwarden's GitHub page links <code>vaultwarden/server</code> on Docker Hub (and the same image on ghcr.io and quay.io); Uptime Kuma's README gives <code>docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:2</code>; n8n's installation guide uses <code>n8nio/n8n</code> with a volume on <code>/home/node/.n8n</code>. A look-alike name on Docker Hub with a different owner may work identically and also ship a miner. Sizes are the compressed amd64 sizes shown by Docker Hub on 24/09/2026. Only Vaultwarden was run for this lesson.</p>
<p>Why Vaultwarden is the one paired with Caddy here: its wiki says that HTTPS "is pretty much required nowadays, since the Bitwarden web vault uses web crypto APIs that most browsers only make available in HTTPS contexts", and recommends putting it behind a reverse proxy rather than using its built-in TLS. The check that it runs behind the proxy:</p>
<pre><code class="language-bash">curl --cacert caddy-root.crt https://vault.localhost:18140/alive
docker compose ps --format '{{.Service}} {{.Status}}'</code></pre>
<div class="out">"2026-09-24T00:28:27.540365Z"
caddy Up 16 seconds
vaultwarden Up 16 seconds (health: starting)</div>

<h3>Backups are tar through a helper container; updates are a deliberate tag change</h3>
${slide('dk-14', 18, 'Sao lưu = tar qua container phụ; cập nhật = đổi tag có chủ đích')}
<p>A named volume is a folder Docker manages; you cannot <code>cp</code> it from the Mac. The universal trick is a one-shot container that mounts the volume read-only and your folder read-write, and runs <code>tar</code> between them. Stop the service first: Vaultwarden keeps its data in SQLite, and copying a database file while it is being written gives you a backup that may not open.</p>
<pre><code class="language-bash">docker compose stop vaultwarden
docker run --rm -v tuhost_vw_data:/data:ro -v "$PWD":/backup alpine:3 \\
  tar czf /backup/vw-2026-09-24.tgz -C /data .
docker compose start vaultwarden
tar tzf vw-2026-09-24.tgz</code></pre>
<div class="out">./
./rsa_key.pem
./db.sqlite3-wal
./db.sqlite3-shm
./db.sqlite3
./tmp/</div>
<p>Compose names volumes <code>&lt;project&gt;_&lt;volume&gt;</code>, hence <code>tuhost_vw_data</code> — check with <code>docker volume ls</code>. <code>rsa_key.pem</code> is the key that signs login tokens: lose it and every user is logged out; leak it and someone can forge logins. That is why the backup file itself must be stored somewhere private. Restoring is the same command in reverse, into an empty volume: <code>docker run --rm -v tuhost_vw_data:/data -v "$PWD":/backup alpine:3 tar xzf /backup/vw-2026-09-24.tgz -C /data</code>.</p>
<p>Updating is where "it was fine yesterday" dies. The safe routine:</p>
<ol>
<li>Pin a version tag in <code>compose.yaml</code> (<code>1.37.3-alpine</code>, not <code>latest</code>), so an update only happens when <em>you</em> change that line.</li>
<li>Read the release notes of the new version — especially for anything that migrates its database on start.</li>
<li>Back up the volume (above).</li>
<li>Change the tag, then <code>docker compose pull</code> and <code>docker compose up -d</code>. Compose recreates only the containers whose image changed.</li>
<li>Check it (<code>docker compose ps</code>, the service's health URL). If it is broken, put the old tag back, <code>up -d</code>, and restore the volume if the new version had already migrated it.</li>
</ol>
<pre><code class="language-bash">docker compose pull
docker compose up -d</code></pre>
<div class="out"> Image vaultwarden/server:1.37.3-alpine Pulled
 Container tuhost-vaultwarden-1 Running
 Container tuhost-caddy-1 Running</div>
<p>(Nothing changed here, so nothing was recreated: "Running".) Tools that update containers automatically exist; for a service that holds your team's passwords, an update you did not read about is exactly the risk you are trying to avoid.</p>

<h3>Editing the Caddyfile: mount the folder, not the file</h3>
${slide('dk-14', 19, 'Sửa Caddyfile bằng mv: container thấy “No such file”')}
<p>The first version of this lesson's Compose file mounted the single file <code>./Caddyfile:/etc/caddy/Caddyfile:ro</code>. Then a new version of the file was written the way many editors and <code>sed -i</code> do it — write a new file, rename it over the old one — and Caddy was asked to reload:</p>
<pre><code class="language-bash">mv Caddyfile.moi Caddyfile
docker compose exec caddy grep -c ping /etc/caddy/Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile</code></pre>
<div class="out">grep: /etc/caddy/Caddyfile: No such file or directory
Error: reading config from file: open /etc/caddy/Caddyfile: no such file or directory</div>
<p>A single-file bind mount is tied to the file's inode (its identity on disk) at the moment the container starts. <code>mv</code> gives the path a <em>new</em> inode. On Docker Desktop the container then sees the file vanish, as above; on Linux it keeps reading the <em>old</em> contents — Chapter 7 tells the real outage this caused with nginx. Caddy kept serving its old configuration either way. The fix is to mount the folder:</p>
<pre><code class="language-bash"><span class="tok-comment"># compose.yaml:  - ./caddy:/etc/caddy:ro</span>
mv caddy/Caddyfile.moi caddy/Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
curl --cacert caddy-root.crt https://vault.localhost:18140/ping</code></pre>
<div class="out">{"level":"info","ts":1790209738.3078039,"msg":"adapted config to JSON","adapter":"caddyfile"}
pong v2</div>

<h3>Opening a port to the Internet: what it costs</h3>
${slide('dk-14', 20, 'Mở cổng ra Internet: -p đi vòng qua tường lửa')}
<p>Everything above ran bound to <code>127.0.0.1</code>. On a real VPS the moment of truth is <code>ports:</code>. Docker's documentation on packet filtering is blunt about the classic surprise: Docker and ufw both use firewall rules, and traffic to a published container port "gets diverted before it goes through the ufw firewall settings". In other words <code>ufw deny 5432</code> does not protect a <code>-p 5432:5432</code>. Chapter 8 measured this; Chapter 16 has it as a production incident.</p>
<ul>
<li><strong>One door.</strong> Only the proxy publishes 80 and 443. Services behind it have no <code>ports:</code> at all — Caddy reaches them by name on the Compose network.</li>
<li><strong>Admin panels stay private.</strong> Adminer, the n8n editor, Uptime Kuma's dashboard: bind to <code>127.0.0.1</code> and reach them through an SSH tunnel (<code>ssh -L 8080:127.0.0.1:8080 vps</code>, then open <code>localhost:8080</code>) or a VPN.</li>
<li><strong>Turn off what you do not use.</strong> <code>SIGNUPS_ALLOWED=false</code> on Vaultwarden once the team has accounts; default passwords changed on day one.</li>
<li><strong>Somebody watches versions.</strong> A self-hosted service forgotten for six months is a back door with your name on it. If nobody in the team will update it, use a hosted service instead.</li>
</ul>
<table>
<tr><th>Self-host it when…</th><th>Do NOT self-host it when…</th></tr>
<tr><td>You want to learn how it works, and the data is not critical</td><td>It holds data you cannot afford to lose and nobody owns backups</td></tr>
<tr><td>It only needs to be reachable from your LAN, a VPN or localhost</td><td>It must be public and nobody will read security advisories</td></tr>
<tr><td>A hosted plan does not exist or is too expensive for a student team</td><td>A free hosted tier does the job (monitoring, forms) with zero maintenance</td></tr>
</table>

<h3>Try it step by step</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · folder and config</span><span class="lz-t">mkdir -p ~/thu-docker/tuhost/caddy &amp;&amp; cd ~/thu-docker/tuhost</span><span class="lz-d">Write caddy/Caddyfile (four lines above) and compose.yaml (mount ./caddy, not the file).</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · start</span><span class="lz-t">docker compose up -d &amp;&amp; docker compose logs caddy | grep obtained</span><span class="lz-d">"certificate obtained successfully" = the internal CA signed a leaf for vault.localhost.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · take the root, test HTTPS</span><span class="lz-t">docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt . &amp;&amp; curl --cacert root.crt -sI https://vault.localhost:18140/</span><span class="lz-d">Without --cacert: error 60. With it: HTTP/2 200.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · back up</span><span class="lz-t">stop → docker run --rm -v tuhost_vw_data:/data:ro -v "$PWD":/backup alpine:3 tar czf … → start</span><span class="lz-d">Then tar tzf the file and look for db.sqlite3 and rsa_key.pem.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · clean up</span><span class="lz-t">docker compose down -v</span><span class="lz-d">Deletes the vault and Caddy's CA — only after you have the backup.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group wants a shared password vault on the team's home server. Before anyone opens a port, you prove on your own machine that HTTPS, backup and restore actually work.</p><ol>
<li>Build the Caddy + Vaultwarden stack above in <code>~/thu-docker/tuhost</code>, with the folder mount.</li>
<li>Show the failure and the success: <code>curl https://vault.localhost:18140/alive</code> without and with <code>--cacert root.crt</code>.</li>
<li>Add <code>respond /ping "pong" 200</code> to the Caddyfile by writing a new file and <code>mv</code>-ing it over; reload Caddy; <code>curl …/ping</code> must print <code>pong</code>.</li>
<li>Back up <code>vw_data</code> to a dated <code>.tgz</code>, then <code>docker compose down -v</code>, <code>up -d</code> again (a fresh, empty vault), restore the archive into the new volume with the service stopped, start it.</li>
<li>Check that <code>rsa_key.pem</code> in the restored volume is the same file as before: compare <code>sha256sum</code> via <code>docker compose exec vaultwarden sha256sum /data/rsa_key.pem</code> with the one inside the archive.</li></ol>
<p><strong>Done when:</strong> the uncertified <code>curl</code> exits with code 60 and the certified one prints a timestamp; <code>/ping</code> answers <code>pong</code> after a <code>mv</code>; and the two <code>sha256sum</code> values of <code>rsa_key.pem</code> are identical after the restore.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reverse proxy</span><span class="v">The server in front that receives every request and forwards it to the right service behind it.</span></div>
  <div class="kv"><span class="k">Automatic HTTPS</span><span class="v">The proxy obtains and renews certificates itself instead of you running certbot.</span></div>
  <div class="kv"><span class="k">Certificate authority (CA)</span><span class="v">Whoever signs certificates; a browser trusts a site only if it trusts the CA at the top of the chain.</span></div>
  <div class="kv"><span class="k"><code>tls internal</code></span><span class="v">Caddy signs with its own private CA — HTTPS without the Internet, trusted only where you install its root.</span></div>
  <div class="kv"><span class="k">Leaf / intermediate / root</span><span class="v">The three levels of a certificate chain: the site's certificate, the signer in the middle, the trust anchor.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">A file's identity on disk; a single-file bind mount follows the inode, not the name.</span></div>
  <div class="kv"><span class="k">Attack surface</span><span class="v">Everything an outsider can reach; each published port and admin page makes it bigger.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Caddy turns HTTPS into one line: automatic certificates, redirect, HTTP/2 and HTTP/3 by default.</li>
<li><code>tls internal</code> gives real HTTPS offline, trusted only where you install Caddy's <code>root.crt</code>; leaf certificates live 12 hours and renew themselves.</li>
<li>Take the image name from the project's own README or docs; pin its tag.</li>
<li>Back up a volume with <code>tar</code> through a one-shot container, with the service stopped — and test a restore.</li>
<li>Mount config folders, not single files; <code>mv</code> breaks a single-file mount on every OS.</li>
<li>Publish only the proxy's 80/443; <code>-p</code> bypasses ufw, and admin panels belong behind SSH or a VPN.</li>
</ul>

<a class="link-card" href="https://caddyserver.com/docs/automatic-https" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Caddy — Automatic HTTPS</span><span class="lc-sub">What Caddy does by itself, which names get internal certificates, and the note about trust stores in containers.</span></span>
</a>
<a class="link-card" href="https://caddyserver.com/docs/caddyfile/directives/tls" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Caddyfile directive: tls</span><span class="lc-sub">The <code>internal</code> option and every other way to configure certificates.</span></span>
</a>
<a class="link-card" href="https://github.com/dani-garcia/vaultwarden/wiki/Enabling-HTTPS" target="_blank" rel="noopener">
  <span class="lc-ico">🗝️</span>
  <span class="lc-body"><span class="lc-title">Vaultwarden wiki — Enabling HTTPS</span><span class="lc-sub">Why the web vault needs HTTPS and why a reverse proxy is the recommended way.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Docker — Packet filtering and firewalls</span><span class="lc-sub">The official explanation of why published ports go around ufw, and what to do about it.</span></span>
</a>
<a class="link-card" href="https://github.com/louislam/uptime-kuma" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Uptime Kuma</span><span class="lc-sub">The official image name, the one-line install and the NFS warning.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic checking.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> the only backup lives on the same machine. A <code>.tgz</code> next to the volume survives a bad update, but not a dead disk, a deleted VPS or a ransomware-encrypted home server. Copy it off the machine — to your laptop with <code>scp</code>, or to object storage — and keep more than one generation. A backup is real only when a copy exists somewhere else and a restore has been tested.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A reverse proxy with automatic HTTPS is the front door of every self-hosted service, and <code>tls internal</code> lets you rehearse it without the Internet. A self-hosted service is only as safe as its last tested restore and its last read update. And the only ports a server should publish are the proxy's — everything else stays on the internal network or behind SSH.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Tự host dịch vụ, có HTTPS tự động</h2>
<p class="lead">Một khi đã có VPS cho đồ án — hoặc một cái máy tính cũ ở nhà luôn bật — Docker khiến bạn rất muốn chạy thêm thứ khác ngoài app của mình: một trang theo dõi báo cho cả nhóm biết web demo sập trước khi thầy phát hiện, một kho mật khẩu chung để không ai gửi mật khẩu CSDL qua Zalo nữa, một công cụ tự động hoá biến mỗi lần nộp form thành một dòng trong bảng tính kèm một email. Mỗi thứ chỉ cách bạn một file Compose. Thứ file Compose KHÔNG cho bạn là cái việc đi kèm: từ giờ bạn là quản trị viên của dịch vụ đó — chứng chỉ, sao lưu, cập nhật và bề mặt tấn công của nó.</p>
<p>Bài này dựng cái đứng trước mọi thứ — một reverse proxy (máy chủ đứng trước, chuyển tiếp request) tự lo HTTPS — chạy thật một dịch vụ phía sau nó, rồi đi qua ba việc vặt quyết định tự host có phải ý hay không: sao lưu, cập nhật và phơi ra ngoài. Mọi thứ chạy ở máy Mac; bài này không mở cổng nào ra Internet.</p>

<h3>Caddy: bốn dòng thay cho nginx + certbot</h3>
${slide('dk-14', 15, 'Caddy: bốn dòng thay cho cả khối nginx + certbot')}
<p>Trong khoá nginx (<a href="/courses/nginx">/courses/nginx</a>) và Chương 10 của khoá này, HTTPS nghĩa là nginx cộng certbot cộng một bộ hẹn giờ gia hạn cộng một khối server chuyển hướng cổng 80. Caddy là một web server và reverse proxy viết bằng Go, với tính năng chủ lực là <em>HTTPS tự động</em>: đưa nó một tên máy là nó tự xin, cài và gia hạn chứng chỉ, tự chuyển HTTP sang HTTPS, tự bật HTTP/2 và HTTP/3. Đây là toàn bộ cấu hình dùng trong bài:</p>
<pre><code class="language-bash">vault.localhost:18140 {
	tls internal
	reverse_proxy vaultwarden:80
}</code></pre>
<p>Địa chỉ site (tên máy và, ở đây, một cổng trong dải của khoá) cho biết khối này phục vụ request nào. <code>reverse_proxy vaultwarden:80</code> chuyển tiếp chúng tới container tên <code>vaultwarden</code> trên mạng Compose. <code>tls internal</code> là dòng giữ cho bài này không cần Internet: thay vì xin Let's Encrypt một chứng chỉ công khai — việc đòi một tên miền thật trỏ về máy và cổng 80/443 mở ra Internet — Caddy tự dựng một cơ quan cấp chứng chỉ (CA) nhỏ của riêng nó và tự ký chứng chỉ.</p>
<pre><code class="language-yaml">name: tuhost
services:
  caddy:
    image: caddy:2.11-alpine
    ports:
      - "127.0.0.1:18140:18140"
    volumes:
      - ./caddy:/etc/caddy:ro          <span class="tok-comment"># gắn THƯ MỤC, không gắn file — xem bên dưới</span>
      - caddy_data:/data               <span class="tok-comment"># chứng chỉ và CA nằm ở đây</span>
    restart: unless-stopped
  vaultwarden:
    image: vaultwarden/server:1.37.3-alpine
    environment:
      DOMAIN: "https://vault.localhost:18140"
      SIGNUPS_ALLOWED: "false"
    volumes:
      - vw_data:/data
    restart: unless-stopped
volumes:
  caddy_data:
  vw_data:</code></pre>
<pre><code class="language-bash">docker compose up -d
docker compose logs caddy | grep -o '"msg":"[^"]*"' | grep -iE "root|trusts|obtained"</code></pre>
<div class="out">"msg":"installing root certificate (you might be prompted for password)"
"msg":"certificate installed properly in linux trusts"
"msg":"certificate obtained successfully"</div>
<table>
<tr><th></th><th>nginx (Chương 10, /courses/nginx)</th><th>Caddy</th></tr>
<tr><td>Chứng chỉ HTTPS</td><td>certbot là công cụ riêng + bộ hẹn giờ gia hạn</td><td>có sẵn: tự xin và tự gia hạn</td></tr>
<tr><td>Chuyển HTTP → HTTPS</td><td>bạn tự viết khối server cổng 80</td><td>mặc định</td></tr>
<tr><td>HTTP/2, HTTP/3</td><td>bật tay</td><td>mặc định (response ở dưới quảng bá <code>h3</code>)</td></tr>
<tr><td>Một site reverse proxy</td><td>5–10 dòng</td><td>1 dòng</td></tr>
<tr><td>Tinh chỉnh sâu, bài hướng dẫn, câu trả lời trên mạng</td><td>cực nhiều</td><td>ít hơn</td></tr>
</table>
<p>Chọn cái nào không phải một cuộc thi. nginx ở khắp nơi và đáng biết (stack production của khoá này dùng nó). Với một máy nhỏ chạy vài dịch vụ tự host, mặc định của Caddy xoá cả một nhóm sai lầm — như cái chứng chỉ lặng lẽ hết hạn vì cron gia hạn chưa bao giờ được cài.</p>

<h3>tls internal: HTTPS thật, nhưng chỉ ai tin CA của Caddy mới tin</h3>
${slide('dk-14', 16, 'tls internal: HTTPS thật, nhưng chỉ ai tin CA của Caddy mới tin')}
<pre><code class="language-bash">curl https://vault.localhost:18140/
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
curl --cacert caddy-root.crt -sI https://vault.localhost:18140/ | grep -iE "^HTTP|^via|^server|alt-svc"
openssl x509 -in caddy-root.crt -noout -subject -enddate
echo | openssl s_client -connect 127.0.0.1:18140 -servername vault.localhost 2&gt;/dev/null | openssl x509 -noout -issuer -enddate</code></pre>
<div class="out">curl: (60) SSL certificate problem: unable to get local issuer certificate
HTTP/2 200
alt-svc: h3=":18140"; ma=2592000
server: Rocket
via: 1.1 Caddy
subject=CN=Caddy Local Authority - 2026 ECC Root
notAfter=Aug  2 00:28:10 2036 GMT
issuer=CN=Caddy Local Authority - ECC Intermediate
notAfter=Sep 24 12:28:10 2026 GMT</div>
<p>Đọc nó như một chuỗi. Caddy sinh một chứng chỉ <strong>gốc</strong> (root) hạn mười năm, một chứng chỉ <strong>trung gian</strong> (intermediate) do gốc ký, và một chứng chỉ <strong>lá</strong> (leaf) cho <code>vault.localhost</code> do trung gian ký — chứng chỉ lá cấp lúc 00:28 UTC và hết hạn lúc 12:28: mười hai giờ. Caddy gia hạn nó từ rất lâu trước đó, nên bạn không bao giờ phải nghĩ tới. Lệnh <code>curl</code> đầu tiên thất bại vì máy Mac chưa từng nghe tới "Caddy Local Authority"; lệnh thứ hai thành công vì <code>--cacert</code> nói "tin cái gốc này cho request này". <code>server: Rocket</code> là Vaultwarden trả lời (viết bằng Rust với framework Rocket); <code>via: 1.1 Caddy</code> cho thấy request đã đi qua proxy.</p>
<div class="pitfall co-tieu-de"><strong>"certificate installed properly in linux trusts" không có nghĩa trình duyệt của bạn tin nó.</strong> Dòng log đó đến từ BÊN TRONG container: Caddy đã thêm chứng chỉ gốc vào kho tin cậy <em>của cái Alpine Linux trong container</em>. Keychain của Mac, trình duyệt của bạn và laptop của bạn cùng nhóm chẳng biết gì về nó, nên trình duyệt hiện cảnh báo chiếm cả trang. Chính tài liệu của Caddy nói vậy: việc cài vào kho tin cậy cục bộ "is for convenience only and isn't guaranteed to work, especially if containers are being used" (chỉ để tiện, không bảo đảm chạy, nhất là khi dùng container). Hãy chủ động phát <code>root.crt</code> cho những máy cần tin nó — còn với thứ gì công khai, dùng tên miền thật và để Caddy lấy chứng chỉ được tin công khai.</div>
<p>Thêm hai chi tiết từ tài liệu HTTPS tự động của Caddy: các tên như <code>localhost</code>, <code>*.localhost</code>, <code>*.local</code> và <code>*.internal</code> được cấp chứng chỉ nội bộ ngay cả khi không viết <code>tls internal</code>, vì không CA công khai nào chịu cấp cho chúng; còn <code>tls internal</code> là thứ bạn viết khi muốn hành vi đó cho bất kỳ tên nào khác (ví dụ một tên máy chỉ dùng trong mạng LAN).</p>

<h3>Ba dịch vụ đáng tự host — ảnh đã kiểm</h3>
${slide('dk-14', 17, 'Ba dịch vụ đáng tự host — ảnh chính thức, đã kiểm')}
<table>
<tr><th>Dịch vụ</th><th>Để làm gì</th><th>Ảnh do chính dự án chỉ định (09/2026)</th><th>Tải về</th><th>Cổng · dữ liệu</th><th>Lưu ý</th></tr>
<tr><td><strong>Vaultwarden</strong></td><td>Kho mật khẩu cho nhóm; dùng được app Bitwarden chính hãng</td><td><code>vaultwarden/server:1.37.3-alpine</code></td><td>64 MB</td><td>80 · <code>/data</code></td><td>Cần HTTPS (bên dưới). Là server cộng đồng, không chính thức, cho API của Bitwarden</td></tr>
<tr><td><strong>Uptime Kuma</strong></td><td>Ping web demo mỗi phút, báo qua Telegram/Discord/email</td><td><code>louislam/uptime-kuma:2</code></td><td>602 MB (<code>2-slim</code>: 182 MB)</td><td>3001 · <code>/app/data</code></td><td>README ghi: dữ liệu trên NFS "NOT supported" — dùng volume cục bộ</td></tr>
<tr><td><strong>n8n</strong></td><td>Tự động hoá quy trình: form → bảng tính → email, không cần viết backend</td><td><code>n8nio/n8n</code> (ghim tag phiên bản)</td><td>267 MB</td><td>5678 · <code>/home/node/.n8n</code></td><td>Giấy phép "Sustainable Use License" (fair-code), không phải giấy phép nguồn mở chuẩn OSI</td></tr>
</table>
<p>"Ảnh do chính dự án chỉ định" là phép kiểm quan trọng. Mỗi tên ở trên là cái mà README hoặc tài liệu của CHÍNH dự án bảo bạn dùng: trang GitHub của Vaultwarden trỏ tới <code>vaultwarden/server</code> trên Docker Hub (cùng ảnh đó trên ghcr.io và quay.io); README của Uptime Kuma đưa lệnh <code>docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:2</code>; hướng dẫn cài của n8n dùng <code>n8nio/n8n</code> với volume gắn vào <code>/home/node/.n8n</code>. Một cái tên na ná trên Docker Hub của chủ khác có thể chạy y hệt — và kèm luôn một con đào tiền ảo. Kích thước là kích thước nén bản amd64 Docker Hub hiển thị ngày 24/09/2026. Bài này chỉ chạy thật Vaultwarden.</p>
<p>Vì sao Vaultwarden được ghép với Caddy ở đây: wiki của nó ghi HTTPS "is pretty much required nowadays, since the Bitwarden web vault uses web crypto APIs that most browsers only make available in HTTPS contexts" (gần như bắt buộc, vì kho web dùng API mật mã của trình duyệt mà hầu hết trình duyệt chỉ mở trong ngữ cảnh HTTPS), và khuyên đặt nó sau một reverse proxy thay vì dùng TLS có sẵn của nó. Kiểm nó chạy được sau proxy:</p>
<pre><code class="language-bash">curl --cacert caddy-root.crt https://vault.localhost:18140/alive
docker compose ps --format '{{.Service}} {{.Status}}'</code></pre>
<div class="out">"2026-09-24T00:28:27.540365Z"
caddy Up 16 seconds
vaultwarden Up 16 seconds (health: starting)</div>

<h3>Sao lưu là tar qua container phụ; cập nhật là đổi tag có chủ đích</h3>
${slide('dk-14', 18, 'Sao lưu = tar qua container phụ; cập nhật = đổi tag có chủ đích')}
<p>Volume có tên là một thư mục do Docker quản lý; bạn không <code>cp</code> nó từ Mac được. Mẹo dùng được ở mọi nơi là một container dùng một lần gắn volume ở chế độ chỉ-đọc và thư mục của bạn ở chế độ ghi được, rồi chạy <code>tar</code> giữa hai bên. Dừng dịch vụ trước: Vaultwarden giữ dữ liệu trong SQLite, và chép một file CSDL đang bị ghi dở cho ra một bản sao lưu có thể không mở được.</p>
<pre><code class="language-bash">docker compose stop vaultwarden
docker run --rm -v tuhost_vw_data:/data:ro -v "$PWD":/backup alpine:3 \\
  tar czf /backup/vw-2026-09-24.tgz -C /data .
docker compose start vaultwarden
tar tzf vw-2026-09-24.tgz</code></pre>
<div class="out">./
./rsa_key.pem
./db.sqlite3-wal
./db.sqlite3-shm
./db.sqlite3
./tmp/</div>
<p>Compose đặt tên volume theo dạng <code>&lt;dự án&gt;_&lt;volume&gt;</code>, nên mới là <code>tuhost_vw_data</code> — kiểm bằng <code>docker volume ls</code>. <code>rsa_key.pem</code> là khoá ký token đăng nhập: mất nó thì mọi người dùng bị đăng xuất; lộ nó thì người khác giả mạo được đăng nhập. Vì thế chính file sao lưu cũng phải cất ở chỗ kín. Khôi phục là cùng lệnh chạy ngược, vào một volume rỗng: <code>docker run --rm -v tuhost_vw_data:/data -v "$PWD":/backup alpine:3 tar xzf /backup/vw-2026-09-24.tgz -C /data</code>.</p>
<p>Cập nhật là chỗ câu "hôm qua còn chạy ngon" chết. Quy trình an toàn:</p>
<ol>
<li>Ghim tag phiên bản trong <code>compose.yaml</code> (<code>1.37.3-alpine</code>, không phải <code>latest</code>), để việc cập nhật chỉ xảy ra khi CHÍNH bạn sửa dòng đó.</li>
<li>Đọc ghi chú phát hành (release notes) của bản mới — nhất là với thứ tự chuyển đổi (migrate) CSDL của nó khi khởi động.</li>
<li>Sao lưu volume (như trên).</li>
<li>Đổi tag, rồi <code>docker compose pull</code> và <code>docker compose up -d</code>. Compose chỉ dựng lại container nào có ảnh đổi.</li>
<li>Kiểm (<code>docker compose ps</code>, URL kiểm sức khoẻ của dịch vụ). Hỏng thì đặt lại tag cũ, <code>up -d</code>, và khôi phục volume nếu bản mới đã kịp migrate nó.</li>
</ol>
<pre><code class="language-bash">docker compose pull
docker compose up -d</code></pre>
<div class="out"> Image vaultwarden/server:1.37.3-alpine Pulled
 Container tuhost-vaultwarden-1 Running
 Container tuhost-caddy-1 Running</div>
<p>(Ở đây không có gì đổi, nên không gì bị dựng lại: "Running".) Có những công cụ tự động cập nhật container; với một dịch vụ giữ mật khẩu của cả nhóm, một bản cập nhật bạn chưa đọc chính là rủi ro bạn đang cố tránh.</p>

<h3>Sửa Caddyfile: gắn thư mục, đừng gắn file</h3>
${slide('dk-14', 19, 'Sửa Caddyfile bằng mv: container thấy “No such file”')}
<p>Bản đầu của file Compose trong bài gắn đúng một file <code>./Caddyfile:/etc/caddy/Caddyfile:ro</code>. Rồi một phiên bản mới của file được ghi theo cách nhiều editor và <code>sed -i</code> vẫn làm — ghi ra file mới rồi đổi tên đè lên file cũ — và Caddy được bảo nạp lại cấu hình:</p>
<pre><code class="language-bash">mv Caddyfile.moi Caddyfile
docker compose exec caddy grep -c ping /etc/caddy/Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile</code></pre>
<div class="out">grep: /etc/caddy/Caddyfile: No such file or directory
Error: reading config from file: open /etc/caddy/Caddyfile: no such file or directory</div>
<p>Một bind mount file đơn bị buộc vào inode (danh tính của file trên đĩa) tại thời điểm container khởi động. <code>mv</code> gán cho đường dẫn đó một inode <em>MỚI</em>. Trên Docker Desktop, container khi đó thấy file biến mất, như trên; trên Linux nó cứ đọc nội dung <em>CŨ</em> — Chương 7 kể sự cố thật mà chuyện này gây ra với nginx. Dù kiểu nào, Caddy vẫn phục vụ bằng cấu hình cũ. Cách sửa là gắn thư mục:</p>
<pre><code class="language-bash"><span class="tok-comment"># compose.yaml:  - ./caddy:/etc/caddy:ro</span>
mv caddy/Caddyfile.moi caddy/Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
curl --cacert caddy-root.crt https://vault.localhost:18140/ping</code></pre>
<div class="out">{"level":"info","ts":1790209738.3078039,"msg":"adapted config to JSON","adapter":"caddyfile"}
pong v2</div>

<h3>Mở cổng ra Internet: cái giá phải trả</h3>
${slide('dk-14', 20, 'Mở cổng ra Internet: -p đi vòng qua tường lửa')}
<p>Mọi thứ ở trên chạy gắn vào <code>127.0.0.1</code>. Trên một VPS thật, khoảnh khắc quyết định là dòng <code>ports:</code>. Tài liệu của Docker về lọc gói tin nói thẳng về cú bất ngờ kinh điển: Docker và ufw (tường lửa đơn giản của Ubuntu) cùng dùng luật tường lửa, và lưu lượng tới một cổng container đã công bố "gets diverted before it goes through the ufw firewall settings" (bị rẽ đi trước khi đi qua các luật của ufw). Nói cách khác, <code>ufw deny 5432</code> KHÔNG bảo vệ được <code>-p 5432:5432</code>. Chương 8 đã đo chuyện này; Chương 16 kể nó như một sự cố production.</p>
<ul>
<li><strong>Một cửa duy nhất.</strong> Chỉ proxy công bố cổng 80 và 443. Dịch vụ phía sau không có <code>ports:</code> nào — Caddy gọi chúng bằng tên trên mạng Compose.</li>
<li><strong>Trang quản trị để riêng tư.</strong> Adminer, trình soạn thảo n8n, bảng điều khiển Uptime Kuma: gắn vào <code>127.0.0.1</code> và vào qua đường hầm SSH (<code>ssh -L 8080:127.0.0.1:8080 vps</code>, rồi mở <code>localhost:8080</code>) hoặc VPN.</li>
<li><strong>Tắt thứ không dùng.</strong> <code>SIGNUPS_ALLOWED=false</code> trên Vaultwarden khi cả nhóm đã có tài khoản; đổi mật khẩu mặc định ngay ngày đầu.</li>
<li><strong>Phải có người canh phiên bản.</strong> Một dịch vụ tự host bị bỏ quên sáu tháng là cửa sau mang tên bạn. Nếu không ai trong nhóm chịu cập nhật nó, hãy dùng dịch vụ có sẵn trên mạng.</li>
</ul>
<table>
<tr><th>Nên tự host khi…</th><th>KHÔNG nên tự host khi…</th></tr>
<tr><td>Bạn muốn học xem nó chạy thế nào, và dữ liệu không quan trọng</td><td>Nó giữ dữ liệu không được phép mất, và không ai chịu trách nhiệm sao lưu</td></tr>
<tr><td>Nó chỉ cần truy cập từ LAN, VPN hoặc localhost</td><td>Nó phải công khai mà không ai đọc cảnh báo bảo mật</td></tr>
<tr><td>Bản dịch vụ trên mạng không có, hoặc quá đắt với nhóm sinh viên</td><td>Gói miễn phí trên mạng làm được việc (theo dõi, form) mà không tốn công bảo trì</td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · thư mục và cấu hình</span><span class="lz-t">mkdir -p ~/thu-docker/tuhost/caddy &amp;&amp; cd ~/thu-docker/tuhost</span><span class="lz-d">Viết caddy/Caddyfile (bốn dòng ở trên) và compose.yaml (gắn ./caddy, không gắn file).</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · khởi động</span><span class="lz-t">docker compose up -d &amp;&amp; docker compose logs caddy | grep obtained</span><span class="lz-d">"certificate obtained successfully" = CA nội bộ đã ký chứng chỉ lá cho vault.localhost.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · lấy chứng chỉ gốc, thử HTTPS</span><span class="lz-t">docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt . &amp;&amp; curl --cacert root.crt -sI https://vault.localhost:18140/</span><span class="lz-d">Không có --cacert: lỗi 60. Có: HTTP/2 200.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · sao lưu</span><span class="lz-t">stop → docker run --rm -v tuhost_vw_data:/data:ro -v "$PWD":/backup alpine:3 tar czf … → start</span><span class="lz-d">Rồi tar tzf file đó, tìm db.sqlite3 và rsa_key.pem.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · dọn dẹp</span><span class="lz-t">docker compose down -v</span><span class="lz-d">Xoá cả kho mật khẩu lẫn CA của Caddy — chỉ làm sau khi đã có bản sao lưu.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm bạn muốn đặt một kho mật khẩu chung trên máy chủ ở nhà của một thành viên. Trước khi ai đó mở cổng, bạn chứng minh trên chính máy mình rằng HTTPS, sao lưu và khôi phục thật sự chạy được.</p><ol>
<li>Dựng stack Caddy + Vaultwarden ở trên trong <code>~/thu-docker/tuhost</code>, gắn thư mục chứ không gắn file.</li>
<li>Chỉ ra cả thất bại lẫn thành công: <code>curl https://vault.localhost:18140/alive</code> không có và có <code>--cacert root.crt</code>.</li>
<li>Thêm <code>respond /ping "pong" 200</code> vào Caddyfile bằng cách ghi file mới rồi <code>mv</code> đè lên; nạp lại Caddy; <code>curl …/ping</code> phải in ra <code>pong</code>.</li>
<li>Sao lưu <code>vw_data</code> ra một file <code>.tgz</code> có ngày, rồi <code>docker compose down -v</code>, <code>up -d</code> lại (một kho mới tinh, rỗng), dừng dịch vụ, khôi phục file lưu trữ vào volume mới, bật lại.</li>
<li>Kiểm <code>rsa_key.pem</code> trong volume đã khôi phục đúng là file cũ: so <code>sha256sum</code> qua <code>docker compose exec vaultwarden sha256sum /data/rsa_key.pem</code> với cái nằm trong file lưu trữ.</li></ol>
<p><strong>Đạt khi:</strong> lệnh <code>curl</code> không có chứng chỉ thoát với mã 60 còn lệnh có chứng chỉ in ra một mốc thời gian; <code>/ping</code> trả <code>pong</code> sau một lần <code>mv</code>; và hai giá trị <code>sha256sum</code> của <code>rsa_key.pem</code> giống hệt nhau sau khi khôi phục.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reverse proxy (máy chủ đứng trước)</span><span class="v">Server đứng đầu nhận mọi request rồi chuyển tiếp tới đúng dịch vụ phía sau.</span></div>
  <div class="kv"><span class="k">Automatic HTTPS (HTTPS tự động)</span><span class="v">Proxy tự xin và tự gia hạn chứng chỉ, bạn không phải chạy certbot.</span></div>
  <div class="kv"><span class="k">Certificate authority — CA (cơ quan cấp chứng chỉ)</span><span class="v">Bên ký chứng chỉ; trình duyệt chỉ tin một site nếu nó tin CA ở đỉnh chuỗi.</span></div>
  <div class="kv"><span class="k"><code>tls internal</code> (TLS nội bộ)</span><span class="v">Caddy ký bằng CA riêng của nó — HTTPS không cần Internet, chỉ được tin ở máy nào cài chứng chỉ gốc của nó.</span></div>
  <div class="kv"><span class="k">Leaf / intermediate / root (lá / trung gian / gốc)</span><span class="v">Ba tầng của một chuỗi chứng chỉ: chứng chỉ của site, bên ký ở giữa, và cái mốc tin cậy trên cùng.</span></div>
  <div class="kv"><span class="k">Inode (danh tính file)</span><span class="v">Danh tính của một file trên đĩa; bind mount file đơn bám theo inode, không bám theo tên.</span></div>
  <div class="kv"><span class="k">Attack surface (bề mặt tấn công)</span><span class="v">Mọi thứ người ngoài chạm tới được; mỗi cổng công bố và mỗi trang quản trị làm nó rộng thêm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Caddy biến HTTPS thành một dòng: chứng chỉ tự động, chuyển hướng, HTTP/2 và HTTP/3 mặc định.</li>
<li><code>tls internal</code> cho HTTPS thật mà không cần Internet, chỉ được tin ở nơi bạn cài <code>root.crt</code> của Caddy; chứng chỉ lá sống 12 giờ và tự gia hạn.</li>
<li>Lấy tên ảnh từ README hoặc tài liệu của CHÍNH dự án; ghim tag của nó.</li>
<li>Sao lưu volume bằng <code>tar</code> qua một container dùng một lần, khi dịch vụ đã dừng — và thử khôi phục thật.</li>
<li>Gắn thư mục cấu hình, đừng gắn file đơn; <code>mv</code> làm hỏng mount file đơn trên mọi hệ điều hành.</li>
<li>Chỉ công bố 80/443 của proxy; <code>-p</code> đi vòng qua ufw, còn trang quản trị thuộc về SSH hoặc VPN.</li>
</ul>

<a class="link-card" href="https://caddyserver.com/docs/automatic-https" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Caddy — HTTPS tự động</span><span class="lc-sub">Những gì Caddy tự làm, tên nào được chứng chỉ nội bộ, và ghi chú về kho tin cậy khi chạy trong container.</span></span>
</a>
<a class="link-card" href="https://caddyserver.com/docs/caddyfile/directives/tls" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Chỉ thị tls trong Caddyfile</span><span class="lc-sub">Tuỳ chọn <code>internal</code> và mọi cách khác để cấu hình chứng chỉ.</span></span>
</a>
<a class="link-card" href="https://github.com/dani-garcia/vaultwarden/wiki/Enabling-HTTPS" target="_blank" rel="noopener">
  <span class="lc-ico">🗝️</span>
  <span class="lc-body"><span class="lc-title">Wiki Vaultwarden — Bật HTTPS</span><span class="lc-sub">Vì sao kho web cần HTTPS và vì sao reverse proxy là cách được khuyên dùng.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/network/packet-filtering-firewalls/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Docker — Lọc gói tin và tường lửa</span><span class="lc-sub">Lời giải thích chính thức vì sao cổng đã công bố đi vòng qua ufw, và nên làm gì.</span></span>
</a>
<a class="link-card" href="https://github.com/louislam/uptime-kuma" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Uptime Kuma</span><span class="lc-sub">Tên ảnh chính thức, lệnh cài một dòng và cảnh báo về NFS.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> bản sao lưu duy nhất nằm ngay trên cùng một máy. Một file <code>.tgz</code> cạnh volume sống sót qua một lần cập nhật hỏng, nhưng không sống sót qua một ổ đĩa chết, một VPS bị xoá hay một máy chủ ở nhà bị mã độc tống tiền mã hoá. Chép nó ra khỏi máy — về laptop bằng <code>scp</code>, hoặc lên kho lưu trữ đối tượng — và giữ nhiều hơn một thế hệ. Bản sao lưu chỉ là thật khi có một bản ở nơi khác và đã thử khôi phục.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một reverse proxy có HTTPS tự động là cửa trước của mọi dịch vụ tự host, và <code>tls internal</code> cho bạn tập dượt nó mà không cần Internet. Một dịch vụ tự host chỉ an toàn bằng lần khôi phục gần nhất đã thử và lần cập nhật gần nhất đã đọc. Và cổng duy nhất một máy chủ nên công bố là cổng của proxy — mọi thứ khác ở trong mạng nội bộ hoặc sau SSH.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — GPUs and local AI in containers|||14.4 — GPU và AI cục bộ trong container',
      slug: 'dk-14-4-gpu-ai',
      type: 'LESSON',
      isFreePreview: true,
      description: 'GPU đi vào container bằng đường nào (driver ở máy chủ, NVIDIA Container Toolkit, CDI), lỗi thật khi thiếu toolkit trên máy có RTX 3060, vì sao Mac không cho GPU vào container, Ollama trong Docker và Docker Model Runner theo tài liệu chính thức (09/2026), và chọn đường nào cho AI cục bộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>GPUs and local AI in containers</h2>
<p class="lead">Running a language model on your own hardware is now a normal student project: a chatbot for the clinic-booking app, a tool that summarises lecture transcripts, a coding assistant that never sends your code anywhere. The model needs a GPU to be fast, and the natural next thought is "put it in Docker like everything else". Sometimes that is exactly right. On a Mac it is impossible. And on a Linux machine it needs one piece that is not installed by default. This lesson shows where the GPU actually lives, what the error looks like when that piece is missing, and the two Docker-shaped ways of running models — Ollama in a container and Docker Model Runner.</p>
<div class="callout warn"><strong>What was and was not run for this lesson.</strong> The course's Linux machine has an NVIDIA RTX 3060 (12 GB) that is busy with the user's own AI work. So the rule was: read-only probes only — <code>nvidia-smi</code> on the host, and <code>docker run --rm --gpus all alpine:3 true</code>, which fails before any container starts. No model was downloaded or run, no VRAM was taken, nothing was installed. The Ollama and Docker Model Runner sections follow the official documentation as checked on 24/09/2026, and every output shown is real.</div>

<h3>How a GPU gets into a container</h3>
${slide('dk-14', 21, 'Container thấy GPU nhờ một mảnh ghép ở MÁY CHỦ')}
<p>A container is a process on the host's kernel (Chapter 1). So is the NVIDIA driver: the kernel module and the device files <code>/dev/nvidia0</code>, <code>/dev/nvidiactl</code>, <code>/dev/nvidia-uvm</code>, plus the user-space library <code>libcuda.so</code> that must match the driver version exactly. None of that belongs in an image — an image built on your laptop has no idea which driver the server will have. What is missing is someone who, at container start, bind-mounts the right device files and the right driver libraries into the container. That someone is the <strong>NVIDIA Container Toolkit</strong>.</p>
<ul>
<li><strong>The driver</strong> stays on the host. You install it once, like any driver.</li>
<li><strong>The toolkit</strong> is installed on the host too. Either it registers an <code>nvidia</code> runtime with Docker (<code>nvidia-ctk runtime configure --runtime=docker</code>), or it writes a CDI description of the devices (<code>nvidia-ctk cdi generate --output=/var/run/cdi/nvidia.yaml</code>) — CDI, the Container Device Interface, is a standard file format saying "to give a container device X, mount these files".</li>
<li><strong>The image</strong> contains only the CUDA libraries your program needs on top of <code>libcuda.so</code> (the <code>nvidia/cuda</code> base images, or whatever PyTorch/Ollama ship). It does not contain the driver.</li>
</ul>
<table>
<tr><th>Flag</th><th>Meaning (from Docker's GPU documentation)</th></tr>
<tr><td><code>--gpus all</code></td><td>All GPUs</td></tr>
<tr><td><code>--gpus device=0</code> or <code>--gpus device=GPU-3a23…</code></td><td>One GPU by index or UUID</td></tr>
<tr><td><code>--gpus '"device=0,2"'</code></td><td>Several GPUs (note the double quoting)</td></tr>
<tr><td><code>--gpus 'all,capabilities=utility'</code></td><td>Only the management features, enough for <code>nvidia-smi</code></td></tr>
<tr><td><code>--device nvidia.com/gpu=all</code></td><td>Ask for a device by its CDI name instead</td></tr>
</table>

<h3>A GPU without the toolkit: the error, measured</h3>
${slide('dk-14', 22, 'Có GPU mà thiếu toolkit: --gpus báo lỗi ngay')}
<p>On the course's Linux machine (Fedora 44, Docker Engine 29.6), as a normal user without sudo:</p>
<pre><code class="language-bash">nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu,driver_version --format=csv
ls /dev/nvidia*
docker info --format '{{json .Runtimes}}' | grep -o nvidia; echo "(grep exit $?)"
which nvidia-ctk
docker run --rm --gpus all alpine:3 true; echo "exit=$?"
docker run --rm --device nvidia.com/gpu=all alpine:3 true; echo "exit=$?"</code></pre>
<div class="out">name, memory.total [MiB], memory.used [MiB], utilization.gpu [%], driver_version
NVIDIA GeForce RTX 3060, 12288 MiB, 7369 MiB, 0 %, 610.43.03
/dev/nvidia-modeset
/dev/nvidia-uvm
/dev/nvidia-uvm-tools
/dev/nvidia0
/dev/nvidiactl
…
(grep exit 1)
nvidia-ctk not found
docker: Error response from daemon: failed to discover GPU vendor from CDI: no known GPU vendor found

Run 'docker run --help' for more information
exit=125
docker: Error response from daemon: CDI device injection failed: unresolvable CDI devices nvidia.com/gpu=all

Run 'docker run --help' for more information
exit=125</div>
<p>Read it top to bottom. The GPU exists and the driver works (<code>nvidia-smi</code> answers, the device files are there). Docker knows only the <code>runc</code> runtime — no <code>nvidia</code>. The toolkit is not installed. And Docker 29 turns <code>--gpus all</code> into a CDI lookup, finds no CDI description of any GPU, and refuses. Exit code 125 is Docker's own "I could not even create the container" (Chapter 2) — the container never ran, which is why this probe is safe on a busy machine.</p>
<p>The same <code>nvidia-smi</code>, run without the query options, also lists who uses the card: a <code>llama-server</code> process holding 5,900 MiB, started directly on the host — the user runs his models natively, not in Docker. That matters: two model servers on one 12 GB card do not share nicely.</p>
<p>What installing the toolkit would involve, from NVIDIA's installation guide (not done here — it needs sudo and restarts Docker):</p>
<pre><code class="language-bash"><span class="tok-comment"># on the Linux host, with sudo — NOT run in this lesson</span>
<span class="tok-comment"># 1. add NVIDIA's package repository and install nvidia-container-toolkit (see the guide for your distro)</span>
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi</code></pre>
<div class="pitfall co-tieu-de"><strong>"sudo systemctl restart docker" stops every container on the machine.</strong> Installing the toolkit ends with a Docker restart. Unless <code>live-restore</code> is enabled (Chapter 1), every running container stops — your project's database, the demo site, a teammate's service — and only those with a <code>restart:</code> policy come back. On a shared machine, announce it, pick a quiet moment, and check <code>docker ps</code> afterwards. The same goes for anything else that edits <code>/etc/docker/daemon.json</code>.</div>

<h3>On a Mac, the GPU cannot enter a container</h3>
${slide('dk-14', 23, 'Trên Mac: GPU không vào được container — chạy AI ở ngoài')}
<p>Docker Desktop runs containers inside a Linux virtual machine (Chapter 13). The Apple GPU is reachable through Apple's Metal API on macOS; there is no Linux driver for it inside that VM. Docker's documentation is explicit: "GPU support in Docker Desktop is only available on Windows with the WSL2 backend", with NVIDIA GPUs. On the course Mac:</p>
<pre><code class="language-bash">docker run --rm --gpus all alpine:3 true</code></pre>
<div class="out">docker: Error response from daemon: failed to discover GPU vendor from CDI: no known GPU vendor found</div>
<p>An Ollama container on a Mac therefore runs on the VM's CPUs only (and within the VM's RAM limit — 7.7 GiB on the course Mac although the machine has 32 GB, Chapter 1). The working patterns turn the problem around: run the model <em>outside</em> the VM, and let containers only <em>call</em> it.</p>
<ul>
<li><strong>Ollama for macOS</strong> (the normal app) uses Metal. Your app container calls it at <code>http://host.docker.internal:11434</code>.</li>
<li><strong>Docker Model Runner</strong> on Docker Desktop runs its inference engine (llama.cpp) as a process on the Mac itself, outside the VM — Docker describes this as "executing the inference engine directly as a host process" so it can use Apple silicon's GPU. Containers call it at <code>http://model-runner.docker.internal</code>.</li>
</ul>

<h3>Ollama in Docker: an image of a few GB, models in a volume</h3>
${slide('dk-14', 24, 'Ollama trong Docker: ảnh vài GB, model để trong volume')}
<p>The commands from the official <code>ollama/ollama</code> page on Docker Hub:</p>
<pre><code class="language-bash"><span class="tok-comment"># CPU only</span>
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
<span class="tok-comment"># NVIDIA GPU (after installing the NVIDIA Container Toolkit)</span>
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
<span class="tok-comment"># AMD GPU</span>
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
<span class="tok-comment"># then, a model</span>
docker exec -it ollama ollama run llama3</code></pre>
<p>In a project you would write it in Compose, pin the version, and bind the API to <code>127.0.0.1</code> (it has no authentication). Compose requests GPUs through <code>deploy.resources.reservations.devices</code>; the Compose documentation notes that <code>capabilities</code> is mandatory. This file was checked with <code>docker compose config</code> on the Mac (Compose v5.5.1) — it parses and normalises, and nothing is started:</p>
<pre><code class="language-yaml">services:
  ollama:
    image: ollama/ollama:0.34.3
    ports: ["127.0.0.1:11434:11434"]
    volumes: [ollama:/root/.ollama]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
volumes:
  ollama:</code></pre>
<div class="out">    deploy:
      resources:
        reservations:
          devices:
            - capabilities:
                - gpu
              driver: nvidia
              count: -1
…</div>
<p>(<code>count: all</code> is stored as <code>-1</code>.) The sizes explain the volume: on 24/09/2026 Docker Hub listed <code>ollama/ollama:latest</code> at 3.7 GB compressed for amd64 (it carries CUDA libraries) and 2.8 GB for arm64; the Ollama library lists <code>llama3.2:3b</code> at 2.0 GB and <code>llama3.2:1b</code> at 1.3 GB. The image is the part you replace on every update; the models are the part that takes an evening to download. Keeping models in a named volume means a new Ollama version is a quick pull, and <code>docker compose down -v</code> is the command that costs you the evening.</p>

<h3>Docker Model Runner: models as OCI artifacts, an OpenAI-style API</h3>
${slide('dk-14', 25, 'Docker Model Runner: model là artifact OCI, API kiểu OpenAI')}
<p>Docker Model Runner (DMR) is Docker's own way to run models: they are pulled from Docker Hub (the <code>ai/</code> namespace) or Hugging Face like images, and served through an API compatible with OpenAI's and Ollama's. Docker announced it as generally available on 18 September 2025. The course Mac has the CLI plugin but the feature switched off:</p>
<pre><code class="language-bash">docker model version
docker model status</code></pre>
<div class="out">Client:
 Version:    v1.2.6
 OS/Arch:    darwin/arm64

Server:
 Version:    (not reachable)
 Engine:     Docker Desktop
Docker Model Runner is not running

What's next:
    Enable Docker Model Runner via the CLI → docker desktop enable model-runner
    Enable Docker Model Runner via the GUI → Go to Settings-&gt;AI-&gt;Enable Docker Model Runner</div>
<p>From the documentation (checked 24/09/2026; not run here):</p>
<table>
<tr><th>What</th><th>How</th></tr>
<tr><td>Enable</td><td>Docker Desktop: Settings → AI → Enable Docker Model Runner. Docker Engine on Linux: install the <code>docker-model-plugin</code> package</td></tr>
<tr><td>Pull and run</td><td><code>docker model pull ai/smollm2:360M-Q4_K_M</code> · <code>docker model run ai/smollm2</code> (Docker Hub lists that variant at 271 MB)</td></tr>
<tr><td>API from the host</td><td><code>http://localhost:12434/engines/v1/chat/completions</code> — TCP is on by default on Docker Engine, optional on Desktop</td></tr>
<tr><td>API from a container</td><td><code>http://model-runner.docker.internal</code></td></tr>
<tr><td>Engines</td><td>llama.cpp (GGUF, all platforms, default); vLLM (Linux x86_64 / WSL2 with NVIDIA); Diffusers for images</td></tr>
<tr><td>GPUs</td><td>Apple silicon on macOS; NVIDIA on Windows and Linux; AMD (ROCm) and Vulkan on Linux</td></tr>
<tr><td>Compose (v2.38+)</td><td>a top-level <code>models:</code> block; a service that lists the model gets <code>LLM_URL</code> and <code>LLM_MODEL</code> injected</td></tr>
</table>
<pre><code class="language-yaml">services:
  app:
    image: my-app
    models:
      - llm           <span class="tok-comment"># ⇒ env LLM_URL, LLM_MODEL</span>
models:
  llm:
    model: ai/smollm2</code></pre>
<p>That file also passed <code>docker compose config</code> on the Mac. The attraction for a project is the last row: the app reads a URL and a model name from environment variables, and whether the model runs on a teammate's Mac GPU or a Linux box with NVIDIA is no longer the app's problem.</p>

<h3>Which path for local AI?</h3>
${slide('dk-14', 26, 'Chọn đường nào cho AI cục bộ?')}
<table>
<tr><th>Situation</th><th>Use</th><th>Why</th></tr>
<tr><td>Mac M1, want to try a model quickly</td><td>Ollama for macOS, or Docker Model Runner</td><td>Both run outside the VM ⇒ Apple GPU</td></tr>
<tr><td>Mac, an app in Compose must call a model</td><td>DMR (<code>models:</code>), or native Ollama + <code>host.docker.internal</code></td><td>The container only calls; it does not run the model</td></tr>
<tr><td>Linux with NVIDIA, a shared server</td><td><code>ollama/ollama</code> + toolkit + <code>--gpus</code> (or DMR)</td><td>Packaged, restarts with Docker, same file on every machine</td></tr>
<tr><td>The GPU is already busy with another model</td><td>Check <code>nvidia-smi</code> first</td><td>12 GB of VRAM does not hold two sizeable models</td></tr>
<tr><td>No GPU, a cheap VPS</td><td>A 1–3B model on CPU, or a hosted API</td><td>It runs, slowly; do not promise "real-time"</td></tr>
<tr><td>Windows + WSL2 + NVIDIA</td><td>Docker Desktop with <code>--gpus</code></td><td>The one platform where Desktop passes a GPU into containers</td></tr>
</table>

<h3>Try it step by step: find out what your machine can do (read-only)</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · is there an NVIDIA GPU and a driver?</span><span class="lz-t">nvidia-smi</span><span class="lz-d">"command not found" = no NVIDIA driver (every Mac). A table = driver OK; read Memory-Usage and the process list.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · does Docker know an nvidia runtime?</span><span class="lz-t">docker info --format '{{json .Runtimes}}'</span><span class="lz-d">Only runc = toolkit not configured as a runtime.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · the harmless probe</span><span class="lz-t">docker run --rm --gpus all alpine:3 true; echo $?</span><span class="lz-d">0 = GPUs can be passed in. 125 + "CDI" error = toolkit missing (Linux) or impossible (Mac).</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · is Docker Model Runner available?</span><span class="lz-t">docker model status</span><span class="lz-d">"not running" + how to enable it, or the running engine.</span></div>
  <div class="lz-step"><span class="lz-k">Step 5 · decide with the table above</span><span class="lz-t">—</span><span class="lz-d">Write the result in your project's README so the next teammate does not repeat steps 1–4.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team wants a small chatbot in the SWP391 clinic app. One member has a Mac M1, one a Windows laptop with an NVIDIA card, and the team server is Linux with a GPU that another project already uses. You must propose a setup — without downloading a single model today.</p><ol>
<li>Run steps 1–4 above on your own machine and note each result (and the exit code of the probe).</li>
<li>Write a <code>compose.yaml</code> with an <code>app</code> service (<code>alpine:3</code> is fine) that uses a <code>models:</code> entry <code>llm: { model: ai/smollm2 }</code>, and a second file variant with an <code>ollama</code> service reserving an NVIDIA GPU through <code>deploy.resources.reservations.devices</code>.</li>
<li>Validate both with <code>docker compose config</code> — do NOT run <code>up</code>. Find <code>count: -1</code> in the output of the second.</li>
<li>Fill in, for each of the three machines, which path from the decision table you choose and why, in five lines of the README.</li></ol>
<p><strong>Done when:</strong> you have the four probe results written down; both Compose files pass <code>docker compose config</code> with exit code 0; and the README states one path per machine with a reason that refers to a measured fact (the probe's exit code, the GPU memory already in use, or the platform).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GPU driver</span><span class="v">Kernel module + libraries on the host that talk to the graphics card; never inside the image.</span></div>
  <div class="kv"><span class="k">NVIDIA Container Toolkit</span><span class="v">Host software that mounts the GPU device files and driver libraries into a container.</span></div>
  <div class="kv"><span class="k">CDI (Container Device Interface)</span><span class="v">A standard file describing which files to mount to give a container a device.</span></div>
  <div class="kv"><span class="k">VRAM</span><span class="v">The GPU's own memory; a model must fit in it to run fast.</span></div>
  <div class="kv"><span class="k">Inference</span><span class="v">Running a trained model to get answers (as opposed to training it).</span></div>
  <div class="kv"><span class="k">GGUF</span><span class="v">The model file format used by llama.cpp, Ollama and DMR's default engine.</span></div>
  <div class="kv"><span class="k">OpenAI-compatible API</span><span class="v">An HTTP API shaped like OpenAI's, so the same client code talks to a local model.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The GPU driver lives on the host; the NVIDIA Container Toolkit mounts it into containers; the image carries only CUDA user libraries.</li>
<li>Without the toolkit, Docker 29's <code>--gpus all</code> fails with a CDI error and exit 125 — a safe probe on any machine.</li>
<li>Installing the toolkit restarts Docker: every container stops unless <code>live-restore</code> is on.</li>
<li>Docker Desktop passes GPUs only on Windows + WSL2 + NVIDIA; on a Mac run models natively and let containers call them.</li>
<li>Ollama's image is a few GB; keep models in a named volume and bind the API to <code>127.0.0.1</code>.</li>
<li>Docker Model Runner (GA since 09/2025) pulls models like images and serves an OpenAI-style API; Compose's <code>models:</code> injects <code>LLM_URL</code>/<code>LLM_MODEL</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/containers/gpu/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">Docker — GPU access</span><span class="lc-sub">The <code>--gpus</code> syntax: all, by index, by UUID, capabilities.</span></span>
</a>
<a class="link-card" href="https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">NVIDIA Container Toolkit — installation guide</span><span class="lc-sub">Repositories per distribution, <code>nvidia-ctk runtime configure</code>, and the sample workload.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/features/gpu/" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">GPU support in Docker Desktop</span><span class="lc-sub">The official statement that only Windows + WSL2 + NVIDIA is supported.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/r/ollama/ollama" target="_blank" rel="noopener">
  <span class="lc-ico">🦙</span>
  <span class="lc-body"><span class="lc-title">ollama/ollama on Docker Hub</span><span class="lc-sub">CPU, NVIDIA and AMD commands, and the toolkit steps.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/ai/model-runner/" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Docker Model Runner</span><span class="lc-sub">Platforms, engines, GPU support; the API reference and Compose integration are linked from there.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practise in Code Lab</span><span class="lc-sub">Docker exercises with automatic checking.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> publishing the model API to the world. Ollama's port 11434 and Docker Model Runner's API have no authentication by design — they are meant for localhost. <code>-p 11434:11434</code> on a VPS or a home server with port forwarding lets anyone run prompts on your GPU (and your electricity bill). Bind to <code>127.0.0.1</code>, let your app call the model over the internal network, and put an authenticated proxy in front if others really need access.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A container gets a GPU only because something on the host — the NVIDIA Container Toolkit — mounts the driver into it; without it, <code>--gpus</code> fails with exit 125. On a Mac the GPU never enters a container, so the model runs outside and containers call it. And whichever path you choose, the model files are the heavy, slow part: give them a named volume and never <code>down -v</code> casually.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>GPU và AI cục bộ trong container</h2>
<p class="lead">Chạy một model ngôn ngữ trên phần cứng của chính mình giờ đã là một đồ án sinh viên bình thường: một chatbot cho app đặt lịch phòng khám, một công cụ tóm tắt bản ghi bài giảng, một trợ lý viết code không bao giờ gửi mã của bạn đi đâu. Model cần GPU để chạy nhanh, và ý nghĩ tự nhiên tiếp theo là "cho nó vào Docker như mọi thứ khác". Có khi đó đúng là cách hay. Trên Mac thì không thể. Còn trên máy Linux thì cần một mảnh ghép mà mặc định không được cài. Bài này chỉ ra GPU thật sự nằm ở đâu, lỗi trông ra sao khi thiếu mảnh ghép đó, và hai cách chạy model "kiểu Docker" — Ollama trong container và Docker Model Runner.</p>
<div class="callout warn"><strong>Phần nào chạy thật, phần nào không.</strong> Máy Linux của khoá có một card NVIDIA RTX 3060 (12 GB) đang bận việc AI của chính người dùng. Nên luật là: chỉ những phép dò chỉ-đọc — <code>nvidia-smi</code> trên máy chủ, và <code>docker run --rm --gpus all alpine:3 true</code>, lệnh này thất bại TRƯỚC khi container nào kịp chạy. Không tải hay chạy model nào, không chiếm VRAM, không cài gì. Phần Ollama và Docker Model Runner theo tài liệu chính thức kiểm ngày 24/09/2026, và mọi output in ra đều là output thật.</div>

<h3>GPU đi vào container bằng đường nào</h3>
${slide('dk-14', 21, 'Container thấy GPU nhờ một mảnh ghép ở MÁY CHỦ')}
<p>Container là một tiến trình trên nhân của máy chủ (Chương 1). Driver NVIDIA cũng vậy: module nhân và các file thiết bị <code>/dev/nvidia0</code>, <code>/dev/nvidiactl</code>, <code>/dev/nvidia-uvm</code>, cộng thư viện phía người dùng <code>libcuda.so</code> phải khớp CHÍNH XÁC phiên bản driver. Không thứ nào trong đó thuộc về ảnh — một ảnh dựng trên laptop của bạn không thể biết server sẽ có driver nào. Cái còn thiếu là một ai đó, lúc container khởi động, bind-mount đúng các file thiết bị và đúng thư viện driver vào trong container. Ai đó chính là <strong>NVIDIA Container Toolkit</strong> (bộ công cụ container của NVIDIA).</p>
<ul>
<li><strong>Driver</strong> ở lại máy chủ. Cài một lần, như mọi driver khác.</li>
<li><strong>Toolkit</strong> cũng cài trên máy chủ. Hoặc nó đăng ký một runtime tên <code>nvidia</code> với Docker (<code>nvidia-ctk runtime configure --runtime=docker</code>), hoặc nó ghi một bản mô tả CDI cho các thiết bị (<code>nvidia-ctk cdi generate --output=/var/run/cdi/nvidia.yaml</code>) — CDI, Container Device Interface (giao diện thiết bị cho container), là một định dạng file chuẩn nói rằng "muốn đưa thiết bị X cho container thì gắn những file này vào".</li>
<li><strong>Ảnh</strong> chỉ chứa các thư viện CUDA mà chương trình của bạn cần, nằm trên <code>libcuda.so</code> (ảnh nền <code>nvidia/cuda</code>, hoặc thứ PyTorch/Ollama đóng sẵn). Nó không chứa driver.</li>
</ul>
<table>
<tr><th>Cờ</th><th>Nghĩa (theo tài liệu GPU của Docker)</th></tr>
<tr><td><code>--gpus all</code></td><td>Mọi GPU</td></tr>
<tr><td><code>--gpus device=0</code> hoặc <code>--gpus device=GPU-3a23…</code></td><td>Một GPU theo số thứ tự hoặc UUID</td></tr>
<tr><td><code>--gpus '"device=0,2"'</code></td><td>Vài GPU (để ý hai lớp nháy)</td></tr>
<tr><td><code>--gpus 'all,capabilities=utility'</code></td><td>Chỉ phần quản lý, đủ cho <code>nvidia-smi</code></td></tr>
<tr><td><code>--device nvidia.com/gpu=all</code></td><td>Xin thiết bị theo tên CDI của nó</td></tr>
</table>

<h3>Có GPU mà thiếu toolkit: lỗi đo thật</h3>
${slide('dk-14', 22, 'Có GPU mà thiếu toolkit: --gpus báo lỗi ngay')}
<p>Trên máy Linux của khoá (Fedora 44, Docker Engine 29.6), bằng user thường không có sudo:</p>
<pre><code class="language-bash">nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu,driver_version --format=csv
ls /dev/nvidia*
docker info --format '{{json .Runtimes}}' | grep -o nvidia; echo "(grep exit $?)"
which nvidia-ctk
docker run --rm --gpus all alpine:3 true; echo "exit=$?"
docker run --rm --device nvidia.com/gpu=all alpine:3 true; echo "exit=$?"</code></pre>
<div class="out">name, memory.total [MiB], memory.used [MiB], utilization.gpu [%], driver_version
NVIDIA GeForce RTX 3060, 12288 MiB, 7369 MiB, 0 %, 610.43.03
/dev/nvidia-modeset
/dev/nvidia-uvm
/dev/nvidia-uvm-tools
/dev/nvidia0
/dev/nvidiactl
…
(grep exit 1)
nvidia-ctk not found
docker: Error response from daemon: failed to discover GPU vendor from CDI: no known GPU vendor found

Run 'docker run --help' for more information
exit=125
docker: Error response from daemon: CDI device injection failed: unresolvable CDI devices nvidia.com/gpu=all

Run 'docker run --help' for more information
exit=125</div>
<p>Đọc từ trên xuống. GPU có thật và driver chạy (<code>nvidia-smi</code> trả lời, file thiết bị có đủ). Docker chỉ biết runtime <code>runc</code> — không có <code>nvidia</code>. Toolkit chưa được cài. Và Docker 29 biến <code>--gpus all</code> thành một lần tra cứu CDI, không tìm thấy bản mô tả CDI nào cho GPU nào, và từ chối. Mã thoát 125 là "tôi còn chưa tạo nổi container" của chính Docker (Chương 2) — container không hề chạy, đó là lý do phép dò này an toàn trên một máy đang bận.</p>
<p>Cũng lệnh <code>nvidia-smi</code> đó, chạy không kèm tuỳ chọn truy vấn, còn liệt kê ai đang dùng card: một tiến trình <code>llama-server</code> giữ 5.900 MiB, chạy thẳng trên máy chủ — người dùng chạy model của mình trực tiếp (native), không qua Docker. Điều đó quan trọng: hai máy chủ model trên cùng một card 12 GB không chia nhau êm đẹp đâu.</p>
<p>Việc cài toolkit sẽ gồm những gì, theo hướng dẫn cài đặt của NVIDIA (không làm ở đây — cần sudo và khởi động lại Docker):</p>
<pre><code class="language-bash"><span class="tok-comment"># trên máy chủ Linux, có sudo — KHÔNG chạy trong bài</span>
<span class="tok-comment"># 1. thêm kho gói của NVIDIA và cài nvidia-container-toolkit (xem hướng dẫn cho bản phân phối của bạn)</span>
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi</code></pre>
<div class="pitfall co-tieu-de"><strong>"sudo systemctl restart docker" làm dừng MỌI container trên máy.</strong> Cài toolkit kết thúc bằng một lần khởi động lại Docker. Trừ khi bật <code>live-restore</code> (Chương 1), mọi container đang chạy đều dừng — CSDL của đồ án, web demo, dịch vụ của bạn cùng nhóm — và chỉ những cái có chính sách <code>restart:</code> mới tự lên lại. Trên một máy dùng chung, hãy báo trước, chọn lúc vắng, và kiểm <code>docker ps</code> sau đó. Mọi thứ khác sửa <code>/etc/docker/daemon.json</code> cũng vậy.</div>

<h3>Trên Mac, GPU không vào được container</h3>
${slide('dk-14', 23, 'Trên Mac: GPU không vào được container — chạy AI ở ngoài')}
<p>Docker Desktop chạy container bên trong một máy ảo Linux (Chương 13). GPU của Apple chỉ dùng được qua API Metal của macOS; bên trong máy ảo đó không có driver Linux nào cho nó. Tài liệu của Docker nói rõ: "GPU support in Docker Desktop is only available on Windows with the WSL2 backend" (hỗ trợ GPU trong Docker Desktop chỉ có trên Windows với nền WSL2), với GPU NVIDIA. Trên máy Mac của khoá:</p>
<pre><code class="language-bash">docker run --rm --gpus all alpine:3 true</code></pre>
<div class="out">docker: Error response from daemon: failed to discover GPU vendor from CDI: no known GPU vendor found</div>
<p>Vì vậy một container Ollama trên Mac chỉ chạy bằng CPU của máy ảo (và trong giới hạn RAM của máy ảo — 7,7 GiB trên Mac của khoá dù máy có 32 GB, Chương 1). Cách làm được là lật ngược vấn đề: chạy model ở <em>NGOÀI</em> máy ảo, và để container chỉ <em>GỌI</em> nó.</p>
<ul>
<li><strong>Ollama bản macOS</strong> (app bình thường) dùng Metal. Container app của bạn gọi nó ở <code>http://host.docker.internal:11434</code>.</li>
<li><strong>Docker Model Runner</strong> trên Docker Desktop chạy bộ suy luận (llama.cpp) như một tiến trình ngay trên máy Mac, bên ngoài máy ảo — Docker mô tả là "executing the inference engine directly as a host process" để dùng được GPU của chip Apple. Container gọi nó ở <code>http://model-runner.docker.internal</code>.</li>
</ul>

<h3>Ollama trong Docker: ảnh vài GB, model để trong volume</h3>
${slide('dk-14', 24, 'Ollama trong Docker: ảnh vài GB, model để trong volume')}
<p>Các lệnh trên trang chính thức <code>ollama/ollama</code> ở Docker Hub:</p>
<pre><code class="language-bash"><span class="tok-comment"># chỉ CPU</span>
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
<span class="tok-comment"># GPU NVIDIA (sau khi cài NVIDIA Container Toolkit)</span>
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
<span class="tok-comment"># GPU AMD</span>
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
<span class="tok-comment"># rồi chạy một model</span>
docker exec -it ollama ollama run llama3</code></pre>
<p>Trong dự án, bạn viết nó bằng Compose, ghim phiên bản, và gắn API vào <code>127.0.0.1</code> (nó không có xác thực). Compose xin GPU qua <code>deploy.resources.reservations.devices</code>; tài liệu Compose lưu ý <code>capabilities</code> là bắt buộc. File này đã được kiểm bằng <code>docker compose config</code> trên Mac (Compose v5.5.1) — nó đọc và chuẩn hoá file, không khởi động gì:</p>
<pre><code class="language-yaml">services:
  ollama:
    image: ollama/ollama:0.34.3
    ports: ["127.0.0.1:11434:11434"]
    volumes: [ollama:/root/.ollama]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
volumes:
  ollama:</code></pre>
<div class="out">    deploy:
      resources:
        reservations:
          devices:
            - capabilities:
                - gpu
              driver: nvidia
              count: -1
…</div>
<p>(<code>count: all</code> được lưu thành <code>-1</code>.) Kích thước giải thích vì sao cần volume: ngày 24/09/2026 Docker Hub ghi <code>ollama/ollama:latest</code> nặng 3,7 GB nén cho amd64 (nó mang theo thư viện CUDA) và 2,8 GB cho arm64; thư viện model của Ollama ghi <code>llama3.2:3b</code> là 2,0 GB và <code>llama3.2:1b</code> là 1,3 GB. Ảnh là phần bạn thay mỗi lần cập nhật; model là phần tải mất cả buổi tối. Giữ model trong một volume có tên nghĩa là lên bản Ollama mới chỉ là một lần pull nhanh, còn <code>docker compose down -v</code> là lệnh lấy mất của bạn buổi tối đó.</p>

<h3>Docker Model Runner: model là artifact OCI, API kiểu OpenAI</h3>
${slide('dk-14', 25, 'Docker Model Runner: model là artifact OCI, API kiểu OpenAI')}
<p>Docker Model Runner (DMR) là cách riêng của Docker để chạy model: model được kéo từ Docker Hub (không gian tên <code>ai/</code>) hoặc Hugging Face giống như kéo ảnh, và được phục vụ qua một API tương thích với API của OpenAI và của Ollama. Docker công bố nó đạt mức phát hành chính thức (GA) ngày 18/09/2025. Máy Mac của khoá có sẵn plugin CLI nhưng tính năng đang tắt:</p>
<pre><code class="language-bash">docker model version
docker model status</code></pre>
<div class="out">Client:
 Version:    v1.2.6
 OS/Arch:    darwin/arm64

Server:
 Version:    (not reachable)
 Engine:     Docker Desktop
Docker Model Runner is not running

What's next:
    Enable Docker Model Runner via the CLI → docker desktop enable model-runner
    Enable Docker Model Runner via the GUI → Go to Settings-&gt;AI-&gt;Enable Docker Model Runner</div>
<p>Theo tài liệu (kiểm 24/09/2026; không chạy ở đây):</p>
<table>
<tr><th>Việc</th><th>Cách</th></tr>
<tr><td>Bật</td><td>Docker Desktop: Settings → AI → Enable Docker Model Runner. Docker Engine trên Linux: cài gói <code>docker-model-plugin</code></td></tr>
<tr><td>Kéo và chạy</td><td><code>docker model pull ai/smollm2:360M-Q4_K_M</code> · <code>docker model run ai/smollm2</code> (Docker Hub ghi bản đó nặng 271 MB)</td></tr>
<tr><td>API từ máy</td><td><code>http://localhost:12434/engines/v1/chat/completions</code> — TCP bật sẵn trên Docker Engine, tuỳ chọn trên Desktop</td></tr>
<tr><td>API từ container</td><td><code>http://model-runner.docker.internal</code></td></tr>
<tr><td>Bộ suy luận</td><td>llama.cpp (GGUF, mọi nền tảng, mặc định); vLLM (Linux x86_64 / WSL2 với NVIDIA); Diffusers cho sinh ảnh</td></tr>
<tr><td>GPU</td><td>chip Apple trên macOS; NVIDIA trên Windows và Linux; AMD (ROCm) và Vulkan trên Linux</td></tr>
<tr><td>Compose (v2.38+)</td><td>khối <code>models:</code> ở cấp trên cùng; dịch vụ nào liệt kê model sẽ được bơm sẵn <code>LLM_URL</code> và <code>LLM_MODEL</code></td></tr>
</table>
<pre><code class="language-yaml">services:
  app:
    image: my-app
    models:
      - llm           <span class="tok-comment"># ⇒ biến LLM_URL, LLM_MODEL</span>
models:
  llm:
    model: ai/smollm2</code></pre>
<p>File đó cũng qua được <code>docker compose config</code> trên Mac. Cái hấp dẫn với một đồ án nằm ở dòng cuối: app đọc một URL và một tên model từ biến môi trường, còn model chạy trên GPU Mac của bạn cùng nhóm hay trên máy Linux có NVIDIA thì không còn là việc của app nữa.</p>

<h3>Chọn đường nào cho AI cục bộ?</h3>
${slide('dk-14', 26, 'Chọn đường nào cho AI cục bộ?')}
<table>
<tr><th>Tình huống</th><th>Nên dùng</th><th>Vì sao</th></tr>
<tr><td>Mac M1, muốn thử model nhanh</td><td>Ollama bản macOS, hoặc Docker Model Runner</td><td>Cả hai chạy ngoài máy ảo ⇒ có GPU Apple</td></tr>
<tr><td>Mac, app trong Compose cần gọi model</td><td>DMR (<code>models:</code>), hoặc Ollama native + <code>host.docker.internal</code></td><td>Container chỉ GỌI, không chạy model</td></tr>
<tr><td>Linux có NVIDIA, server dùng chung</td><td><code>ollama/ollama</code> + toolkit + <code>--gpus</code> (hoặc DMR)</td><td>Đóng gói được, khởi động lại cùng Docker, cùng một file trên mọi máy</td></tr>
<tr><td>GPU đang bận với một model khác</td><td>Kiểm <code>nvidia-smi</code> trước</td><td>12 GB VRAM không chứa nổi hai model cỡ khá</td></tr>
<tr><td>Không có GPU, VPS rẻ</td><td>Model 1–3B chạy CPU, hoặc gọi API có sẵn</td><td>Chạy được nhưng chậm; đừng hứa "thời gian thực"</td></tr>
<tr><td>Windows + WSL2 + NVIDIA</td><td>Docker Desktop với <code>--gpus</code></td><td>Nền tảng duy nhất mà Desktop cho GPU vào container</td></tr>
</table>

<h3>Chạy thử từng bước: máy bạn làm được gì (chỉ đọc)</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · có GPU NVIDIA và driver không?</span><span class="lz-t">nvidia-smi</span><span class="lz-d">"command not found" = không có driver NVIDIA (mọi máy Mac). Ra một bảng = driver ổn; đọc Memory-Usage và danh sách tiến trình.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · Docker có biết runtime nvidia không?</span><span class="lz-t">docker info --format '{{json .Runtimes}}'</span><span class="lz-d">Chỉ có runc = toolkit chưa được cấu hình làm runtime.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · phép dò vô hại</span><span class="lz-t">docker run --rm --gpus all alpine:3 true; echo $?</span><span class="lz-d">0 = đưa GPU vào được. 125 + lỗi "CDI" = thiếu toolkit (Linux) hoặc không thể (Mac).</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · có Docker Model Runner không?</span><span class="lz-t">docker model status</span><span class="lz-d">"not running" + cách bật, hoặc bộ suy luận đang chạy.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 5 · quyết định bằng bảng ở trên</span><span class="lz-t">—</span><span class="lz-d">Ghi kết quả vào README của dự án để bạn cùng nhóm sau không phải lặp lại bước 1–4.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm muốn thêm một chatbot nhỏ vào app phòng khám của đồ án SWP391. Một bạn dùng Mac M1, một bạn dùng laptop Windows có card NVIDIA, còn máy chủ của nhóm là Linux có GPU mà một dự án khác đang dùng. Bạn phải đề xuất cách dựng — mà hôm nay không tải một model nào.</p><ol>
<li>Chạy bước 1–4 ở trên trên máy của bạn và ghi lại từng kết quả (kể cả mã thoát của phép dò).</li>
<li>Viết một <code>compose.yaml</code> có dịch vụ <code>app</code> (<code>alpine:3</code> là được) dùng một mục <code>models:</code> là <code>llm: { model: ai/smollm2 }</code>, và một biến thể thứ hai có dịch vụ <code>ollama</code> xin GPU NVIDIA qua <code>deploy.resources.reservations.devices</code>.</li>
<li>Kiểm cả hai bằng <code>docker compose config</code> — KHÔNG chạy <code>up</code>. Tìm <code>count: -1</code> trong output của file thứ hai.</li>
<li>Viết năm dòng vào README: với mỗi máy trong ba máy, chọn đường nào trong bảng quyết định và vì sao.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bốn kết quả dò được ghi lại; cả hai file Compose qua <code>docker compose config</code> với mã thoát 0; và README chọn một đường cho mỗi máy kèm một lý do dựa trên một sự thật đo được (mã thoát của phép dò, bộ nhớ GPU đang bị dùng, hoặc nền tảng).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GPU driver (trình điều khiển GPU)</span><span class="v">Module nhân + thư viện trên máy chủ nói chuyện với card đồ hoạ; không bao giờ nằm trong ảnh.</span></div>
  <div class="kv"><span class="k">NVIDIA Container Toolkit (bộ công cụ container của NVIDIA)</span><span class="v">Phần mềm trên máy chủ gắn file thiết bị GPU và thư viện driver vào container.</span></div>
  <div class="kv"><span class="k">CDI — Container Device Interface (giao diện thiết bị cho container)</span><span class="v">File chuẩn mô tả cần gắn những file nào để đưa một thiết bị cho container.</span></div>
  <div class="kv"><span class="k">VRAM (bộ nhớ GPU)</span><span class="v">Bộ nhớ riêng của GPU; model phải vừa trong đó thì mới chạy nhanh.</span></div>
  <div class="kv"><span class="k">Inference (suy luận)</span><span class="v">Chạy một model đã huấn luyện để lấy câu trả lời (khác với huấn luyện nó).</span></div>
  <div class="kv"><span class="k">GGUF (định dạng model)</span><span class="v">Định dạng file model mà llama.cpp, Ollama và bộ suy luận mặc định của DMR dùng.</span></div>
  <div class="kv"><span class="k">OpenAI-compatible API (API tương thích OpenAI)</span><span class="v">API HTTP có hình dạng giống của OpenAI, nên cùng một đoạn mã client nói chuyện được với model chạy ở máy mình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Driver GPU sống trên máy chủ; NVIDIA Container Toolkit gắn nó vào container; ảnh chỉ mang thư viện CUDA phía người dùng.</li>
<li>Thiếu toolkit, <code>--gpus all</code> của Docker 29 thất bại với lỗi CDI và mã 125 — một phép dò an toàn trên mọi máy.</li>
<li>Cài toolkit phải khởi động lại Docker: mọi container dừng, trừ khi bật <code>live-restore</code>.</li>
<li>Docker Desktop chỉ cho GPU vào container trên Windows + WSL2 + NVIDIA; trên Mac, chạy model native và để container gọi nó.</li>
<li>Ảnh Ollama nặng vài GB; giữ model trong một volume có tên và gắn API vào <code>127.0.0.1</code>.</li>
<li>Docker Model Runner (GA từ 09/2025) kéo model như kéo ảnh và phục vụ API kiểu OpenAI; khối <code>models:</code> của Compose bơm sẵn <code>LLM_URL</code>/<code>LLM_MODEL</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/containers/gpu/" target="_blank" rel="noopener">
  <span class="lc-ico">🎛️</span>
  <span class="lc-body"><span class="lc-title">Docker — truy cập GPU</span><span class="lc-sub">Cú pháp <code>--gpus</code>: tất cả, theo số thứ tự, theo UUID, capabilities.</span></span>
</a>
<a class="link-card" href="https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">NVIDIA Container Toolkit — hướng dẫn cài</span><span class="lc-sub">Kho gói cho từng bản phân phối, <code>nvidia-ctk runtime configure</code>, và lệnh kiểm mẫu.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/desktop/features/gpu/" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Hỗ trợ GPU trong Docker Desktop</span><span class="lc-sub">Tuyên bố chính thức: chỉ Windows + WSL2 + NVIDIA được hỗ trợ.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/r/ollama/ollama" target="_blank" rel="noopener">
  <span class="lc-ico">🦙</span>
  <span class="lc-body"><span class="lc-title">ollama/ollama trên Docker Hub</span><span class="lc-sub">Lệnh cho CPU, NVIDIA và AMD, cùng các bước cài toolkit.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/ai/model-runner/" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Docker Model Runner</span><span class="lc-sub">Nền tảng, bộ suy luận, hỗ trợ GPU; tài liệu API và tích hợp Compose có liên kết từ đó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trong Code Lab</span><span class="lc-sub">Bài tập Docker có chấm tự động.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> công bố API của model ra cả thế giới. Cổng 11434 của Ollama và API của Docker Model Runner theo thiết kế là KHÔNG có xác thực — chúng dành cho localhost. <code>-p 11434:11434</code> trên một VPS hoặc máy chủ ở nhà có mở cổng cho phép bất kỳ ai chạy prompt trên GPU của bạn (và trên hoá đơn tiền điện của bạn). Gắn vào <code>127.0.0.1</code>, để app gọi model qua mạng nội bộ, và đặt một proxy có xác thực phía trước nếu người khác thật sự cần dùng.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Container có GPU chỉ vì một thứ trên máy chủ — NVIDIA Container Toolkit — gắn driver vào nó; thiếu nó, <code>--gpus</code> thất bại với mã 125. Trên Mac, GPU không bao giờ vào container, nên model chạy bên ngoài còn container gọi nó. Và dù chọn đường nào, file model là phần nặng và chậm: cho nó một volume có tên và đừng bao giờ <code>down -v</code> một cách tuỳ tiện.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: '14.5 — Quiz: Docker for everything|||14.5 — Kiểm tra: Docker cho mọi việc',
      slug: 'dk-14-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: file thuộc root vì quên -u, -it vỡ trong CI, đổi POSTGRES_PASSWORD không ăn, pg_dump lệch phiên bản, restore thiếu -i, minio/minio biến mất, tls internal và lỗi curl 60, Caddyfile gắn file đơn, -p đi vòng qua ufw, và --gpus báo lỗi CDI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real work with Docker as a toolbox — every one of them was reproduced on the course machines while writing this chapter. Read the explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can run any command-line tool from an image on my current folder with <code>--rm -v "$PWD":/w -w /w</code>, and I know when to add <code>-i</code>, <code>-t</code> and <code>-u</code>.</li>
<li>I can start Postgres, MySQL, Mongo or Redis in one command, with a named volume and a port bound to <code>127.0.0.1</code>.</li>
<li>I can explain why init variables and <code>/docker-entrypoint-initdb.d</code> are ignored on the second start, and fix a password without losing data.</li>
<li>I can dump and restore a database with the container's own tools through <code>docker exec</code>.</li>
<li>I can put Caddy with <code>tls internal</code> in front of a service, back up its volume with <code>tar</code>, and explain why only the proxy should publish ports.</li>
<li>I can tell, with one harmless command, whether my machine can pass a GPU into a container — and what to do on a Mac.</li>
</ul>
${slide('dk-14', 28, 'Bảng tra nhanh Chương 14')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc thật khi dùng Docker như một hộp đồ nghề — tình huống nào cũng đã được dựng lại trên máy của khoá trong lúc viết chương này. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy được mọi công cụ dòng lệnh từ một ảnh trên thư mục hiện tại bằng <code>--rm -v "$PWD":/w -w /w</code>, và biết khi nào thêm <code>-i</code>, <code>-t</code> và <code>-u</code>.</li>
<li>Tôi bật được Postgres, MySQL, Mongo hay Redis bằng một lệnh, có volume đặt tên và cổng gắn vào <code>127.0.0.1</code>.</li>
<li>Tôi giải thích được vì sao biến khởi tạo và <code>/docker-entrypoint-initdb.d</code> bị bỏ qua ở lần khởi động thứ hai, và sửa được mật khẩu mà không mất dữ liệu.</li>
<li>Tôi dump và restore được một CSDL bằng công cụ của chính container qua <code>docker exec</code>.</li>
<li>Tôi đặt được Caddy với <code>tls internal</code> trước một dịch vụ, sao lưu volume của nó bằng <code>tar</code>, và giải thích được vì sao chỉ proxy mới nên công bố cổng.</li>
<li>Tôi biết được, bằng một lệnh vô hại, máy mình có đưa GPU vào container được không — và trên Mac thì làm gì.</li>
</ul>
${slide('dk-14', 28, 'Bảng tra nhanh Chương 14')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On the team’s Linux server you ran "docker run --rm -v "$PWD":/w -w /w node:22-alpine npm run build". Now "rm -rf dist" says "Permission denied" and "ls -l" shows dist owned by root. You have no sudo. What is the right fix?|||Trên server Linux của nhóm, bạn chạy "docker run --rm -v "$PWD":/w -w /w node:22-alpine npm run build". Giờ "rm -rf dist" báo "Permission denied" và "ls -l" cho thấy dist thuộc root. Bạn không có sudo. Cách sửa đúng là gì?',
            options: [
              'Run "chmod -R 777 dist" from your own shell; permissions are what block the delete, not the owner|||Chạy "chmod -R 777 dist" từ shell của bạn; thứ chặn việc xoá là quyền, không phải chủ sở hữu',
              'Restart Docker so it re-maps file ownership of bind mounts back to the calling user|||Khởi động lại Docker để nó ánh xạ lại chủ sở hữu file của bind mount về user đã gọi lệnh',
              'Let a root container give the files back with chown, and add -u "$(id -u):$(id -g)" next time|||Để một container root trả lại quyền bằng chown, và lần sau thêm -u "$(id -u):$(id -g)"',
              'Delete the image node:22-alpine; the files belong to the image and go away with it|||Xoá ảnh node:22-alpine; các file thuộc về ảnh và sẽ biến mất cùng nó',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: On Linux, UID 0 in the container is UID 0 on the host, so the build output belongs to root. A container running as root can chown it back (docker run --rm -v "$PWD":/w alpine:3 chown -R "$(id -u):$(id -g)" /w), and -u prevents it next time. chmod is tempting, but only the owner (or root) may change a file’s mode — you are neither. Docker does not remap ownership on Linux; that happens only on Docker Desktop.|||VI: Trên Linux, UID 0 trong container là UID 0 trên máy chủ, nên kết quả build thuộc root. Một container chạy bằng root có thể chown trả lại (docker run --rm -v "$PWD":/w alpine:3 chown -R "$(id -u):$(id -g)" /w), và -u ngăn chuyện này lần sau. chmod nghe hấp dẫn, nhưng chỉ chủ file (hoặc root) mới được đổi quyền của file — bạn không phải cả hai. Docker không ánh xạ lại chủ sở hữu trên Linux; chuyện đó chỉ có ở Docker Desktop.',
          },
          {
            question: 'A command copied from a README works in your terminal but fails in the GitHub Actions job with "cannot attach stdin to a TTY-enabled container because stdin is not a terminal". The command is "docker run --rm -it -v "$PWD":/w -w /w hadolint/hadolint hadolint Dockerfile". What do you change?|||Một lệnh chép từ README chạy ngon trong terminal của bạn nhưng hỏng trong job GitHub Actions với "cannot attach stdin to a TTY-enabled container because stdin is not a terminal". Lệnh là "docker run --rm -it -v "$PWD":/w -w /w hadolint/hadolint hadolint Dockerfile". Bạn sửa gì?',
            options: [
              'Drop -t (here -it can go entirely): a CI job has no terminal to attach|||Bỏ -t (ở đây bỏ luôn cả -it): job CI không có terminal nào để gắn vào',
              'Add --privileged so the container is allowed to create a terminal device on the runner|||Thêm --privileged để container được phép tạo thiết bị terminal trên runner',
              'Replace -v "$PWD":/w with a COPY in a Dockerfile, because CI runners do not support bind mounts|||Thay -v "$PWD":/w bằng COPY trong Dockerfile, vì runner CI không hỗ trợ bind mount',
              'Pin hadolint to an older tag; recent versions require an interactive terminal to print results|||Ghim hadolint về tag cũ hơn; bản mới đòi terminal tương tác mới in được kết quả',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: -t asks Docker for a pseudo-terminal, and a script or CI step has none — exactly the message measured in Lesson 14.1. The tool reads a file from the mounted folder, so neither -i nor -t is needed. --privileged has nothing to do with TTYs and would remove the container boundary for no reason; bind mounts work fine on GitHub’s Linux runners.|||VI: -t xin Docker một terminal giả, mà script hay bước CI thì không có — đúng câu báo lỗi đo được ở Bài 14.1. Công cụ đọc file từ thư mục đã gắn, nên không cần cả -i lẫn -t. --privileged chẳng liên quan gì tới TTY và còn dỡ bỏ ranh giới container vô cớ; bind mount chạy bình thường trên runner Linux của GitHub.',
          },
          {
            question: 'A teammate changed POSTGRES_PASSWORD in compose.yaml and ran "docker compose up -d". The new password is rejected, and "docker compose logs db" shows "Database directory appears to contain a database; Skipping initialization". The volume holds a week of test data. What should you do?|||Một bạn cùng nhóm đổi POSTGRES_PASSWORD trong compose.yaml rồi chạy "docker compose up -d". Mật khẩu mới bị từ chối, và "docker compose logs db" có dòng "Database directory appears to contain a database; Skipping initialization". Volume đang giữ một tuần dữ liệu test. Bạn nên làm gì?',
            options: [
              'Run "docker compose down -v" and "up -d" again; the new password will then be applied on start|||Chạy "docker compose down -v" rồi "up -d" lại; khi đó mật khẩu mới sẽ được áp lúc khởi động',
              'Add the new password to /docker-entrypoint-initdb.d as an ALTER USER script and restart|||Thêm mật khẩu mới vào /docker-entrypoint-initdb.d dưới dạng script ALTER USER rồi khởi động lại',
              'Rename the environment variable to PGPASSWORD, which is re-read on every start of the container|||Đổi tên biến môi trường thành PGPASSWORD, biến này được đọc lại ở mỗi lần container khởi động',
              'Log in with the old password and run ALTER USER inside the database; the variable only works on an empty volume|||Đăng nhập bằng mật khẩu cũ và chạy ALTER USER bên trong CSDL; biến chỉ có tác dụng với volume rỗng',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The password was written into the data files on the first start; every later start sees a non-empty volume and skips initialisation, variables and init scripts included. Change it where it lives, with ALTER USER. down -v would work — by deleting the week of data you must keep. An init script has the same problem as the variable: it only runs on an empty volume.|||VI: Mật khẩu đã được ghi vào file dữ liệu ở lần khởi động đầu; mọi lần sau đều thấy volume không rỗng nên bỏ qua khởi tạo, kể cả biến môi trường lẫn script init. Hãy đổi nó ở đúng chỗ nó sống, bằng ALTER USER. down -v thì "được" — bằng cách xoá luôn một tuần dữ liệu bạn phải giữ. Script init cũng dính y như biến: nó chỉ chạy với volume rỗng.',
          },
          {
            question: 'You run "pg_dump -h 127.0.0.1 -p 5432 -U postgres app > app.sql" on your Mac against the postgres:16-alpine container and get "server version: 16.14; pg_dump version: 14.19 … aborting because of server version mismatch". What is the simplest correct way to get the dump?|||Bạn chạy "pg_dump -h 127.0.0.1 -p 5432 -U postgres app > app.sql" trên Mac vào container postgres:16-alpine và nhận "server version: 16.14; pg_dump version: 14.19 … aborting because of server version mismatch". Cách đúng và đơn giản nhất để lấy bản dump là gì?',
            options: [
              'Add --no-version-check to pg_dump so it dumps the newer server anyway|||Thêm --no-version-check cho pg_dump để nó vẫn dump server mới hơn',
              'Run the container’s own pg_dump: docker exec db pg_dump -U postgres -d app > app.sql|||Chạy pg_dump của chính container: docker exec db pg_dump -U postgres -d app > app.sql',
              'Downgrade the container to postgres:14 so that both sides have the same major version|||Hạ container xuống postgres:14 để hai bên cùng phiên bản chính',
              'Copy the files in /var/lib/postgresql/data out with docker cp while the server is running|||Chép các file trong /var/lib/postgresql/data ra bằng docker cp khi server vẫn đang chạy',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: pg_dump refuses to dump a newer server, and the container already has the matching version. With docker exec the dump runs inside, and the > is interpreted by your shell, so the file lands on your disk. There is no such override flag; downgrading a database with data in it is not "simple" (it does not even start on a newer data directory); and copying live data files gives an inconsistent copy.|||VI: pg_dump từ chối dump server mới hơn nó, mà container thì có sẵn đúng phiên bản. Với docker exec, việc dump chạy bên trong còn dấu > do shell của bạn hiểu, nên file rơi xuống đĩa của bạn. Không có cờ vượt rào nào như thế; hạ phiên bản một CSDL đang có dữ liệu chẳng "đơn giản" chút nào (Postgres cũ còn không khởi động nổi trên thư mục dữ liệu mới); còn chép file dữ liệu đang chạy cho ra một bản sao không nhất quán.',
          },
          {
            question: 'To restore, you run "docker exec db psql -U postgres -d kiemtra < app.sql". It returns immediately with no output and no error, and the database stays empty. What is missing?|||Để khôi phục, bạn chạy "docker exec db psql -U postgres -d kiemtra < app.sql". Lệnh trả về ngay, không in gì, không báo lỗi, và CSDL vẫn rỗng. Thiếu gì?',
            options: [
              '-t, so that psql gets a terminal and can read the SQL statements one line at a time|||-t, để psql có terminal và đọc được từng câu lệnh SQL một',
              'A docker cp of app.sql into the container first, because < cannot cross the container boundary|||Một lệnh docker cp đưa app.sql vào container trước, vì < không đi xuyên được ranh giới container',
              '-i, so that docker exec keeps stdin open and the file actually reaches psql|||-i, để docker exec giữ stdin mở và file thật sự tới được psql',
              'The --clean flag on psql, which is required before psql accepts statements from a file|||Cờ --clean cho psql, bắt buộc phải có thì psql mới nhận câu lệnh từ file',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Without -i, docker exec does not connect your stdin, psql reads nothing, and exits 0 — the silent failure described in Lesson 14.2. -t is the opposite of what you want: a pseudo-terminal can mangle a dump. docker cp works too but is not what is missing; < works perfectly once stdin is attached. --clean is a pg_dump option, not a psql one.|||VI: Thiếu -i, docker exec không nối stdin của bạn vào, psql không đọc được gì và thoát 0 — đúng kiểu hỏng im lặng tả ở Bài 14.2. -t là thứ ngược lại với điều bạn cần: terminal giả có thể làm hỏng file dump. docker cp cũng làm được nhưng không phải thứ bị thiếu; dấu < chạy ngon khi stdin đã được nối. --clean là tuỳ chọn của pg_dump, không phải của psql.',
          },
          {
            question: 'An old tutorial’s compose file uses image: minio/minio. On a fresh machine in 09/2026, "docker compose up" fails with "pull access denied for minio/minio, repository does not exist". Nothing is wrong with your Docker login. What is the correct reading?|||File compose của một bài hướng dẫn cũ dùng image: minio/minio. Trên một máy mới vào 09/2026, "docker compose up" hỏng với "pull access denied for minio/minio, repository does not exist". Đăng nhập Docker của bạn không có vấn đề gì. Cách hiểu đúng là gì?',
            options: [
              'Docker Hub rate-limits anonymous users; log in with any account and the pull will succeed|||Docker Hub giới hạn tốc độ người dùng ẩn danh; đăng nhập bằng tài khoản nào cũng được là kéo thành công',
              'The publisher stopped distributing that image; pin a tag from where it still exists or switch to another S3-compatible service|||Nhà phát hành đã ngừng phân phối ảnh đó; ghim một tag ở nơi nó còn tồn tại, hoặc chuyển sang dịch vụ tương thích S3 khác',
              'Your Mac is arm64 and minio/minio only ever published amd64 images; add --platform linux/amd64|||Máy Mac của bạn là arm64 còn minio/minio chỉ phát hành ảnh amd64; thêm --platform linux/amd64',
              'The name needs the docker.io/library/ prefix for third-party images since Compose v5|||Từ Compose v5, ảnh của bên thứ ba phải có tiền tố docker.io/library/ trong tên',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured on 24/09/2026: minio/minio can no longer be pulled from Docker Hub; the community edition is source-only, the GitHub repo was archived on 25/04/2026, and quay.io/minio/minio still has frozen 2025 releases. A rate limit gives a different error ("toomanyrequests"), a wrong architecture gives "no matching manifest", and library/ is only for Official Images.|||VI: Đo ngày 24/09/2026: minio/minio không còn kéo được từ Docker Hub; bản cộng đồng chỉ còn mã nguồn, kho GitHub bị lưu trữ ngày 25/04/2026, còn quay.io/minio/minio vẫn giữ các bản 2025 đã đóng băng. Giới hạn tốc độ cho ra lỗi khác ("toomanyrequests"), sai kiến trúc cho ra "no matching manifest", còn library/ chỉ dành cho ảnh chính thức.',
          },
          {
            question: 'Caddy with "tls internal" logs "certificate installed properly in linux trusts" and "certificate obtained successfully", yet "curl https://vault.localhost:18140/" on your Mac fails with error 60 and the browser shows a warning. Why?|||Caddy với "tls internal" ghi log "certificate installed properly in linux trusts" và "certificate obtained successfully", thế mà "curl https://vault.localhost:18140/" trên Mac vẫn lỗi 60 và trình duyệt hiện cảnh báo. Vì sao?',
            options: [
              'The root was installed in the trust store inside the container; your Mac must trust Caddy’s root.crt|||Chứng chỉ gốc được cài vào kho tin cậy BÊN TRONG container; máy Mac của bạn phải tin root.crt của Caddy',
              'Caddy has not finished renewing the certificate; leaf certificates are only valid after 12 hours|||Caddy chưa gia hạn xong chứng chỉ; chứng chỉ lá chỉ có hiệu lực sau 12 giờ',
              'The port 18140 is not 443, and browsers only accept HTTPS certificates on the default port|||Cổng 18140 không phải 443, mà trình duyệt chỉ chấp nhận chứng chỉ HTTPS ở cổng mặc định',
              'vault.localhost does not resolve on macOS, so curl reaches a different server with another certificate|||vault.localhost không phân giải được trên macOS, nên curl tới một server khác có chứng chỉ khác',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: With tls internal, Caddy signs with its own private CA. The "linux trusts" it installed into belong to the Alpine system in the container; Caddy’s docs warn that local trust installation is not guaranteed in containers. curl --cacert root.crt returned HTTP/2 200. The leaf lives 12 hours but is valid immediately; certificates work on any port; and the request did reach Caddy (via: 1.1 Caddy).|||VI: Với tls internal, Caddy ký bằng CA riêng của nó. Cái "linux trusts" nó cài vào thuộc về hệ Alpine trong container; tài liệu Caddy cảnh báo việc cài vào kho tin cậy cục bộ không được bảo đảm khi chạy trong container. curl --cacert root.crt trả HTTP/2 200. Chứng chỉ lá sống 12 giờ nhưng có hiệu lực ngay; chứng chỉ dùng được ở mọi cổng; và request đã tới đúng Caddy (via: 1.1 Caddy).',
          },
          {
            question: 'Compose mounts "./Caddyfile:/etc/caddy/Caddyfile:ro". You save a change with an editor that writes a new file and renames it over the old one, then run "caddy reload" in the container. On Docker Desktop it says "open /etc/caddy/Caddyfile: no such file or directory". What is the durable fix?|||Compose gắn "./Caddyfile:/etc/caddy/Caddyfile:ro". Bạn lưu thay đổi bằng một editor ghi file mới rồi đổi tên đè lên file cũ, rồi chạy "caddy reload" trong container. Trên Docker Desktop nó báo "open /etc/caddy/Caddyfile: no such file or directory". Cách sửa bền vững là gì?',
            options: [
              'Mount the file with :rw instead of :ro so the container can follow changes made on the host|||Gắn file bằng :rw thay vì :ro để container theo kịp thay đổi trên máy chủ',
              'Always run "docker compose restart caddy" instead of "caddy reload" after every edit|||Luôn chạy "docker compose restart caddy" thay cho "caddy reload" sau mỗi lần sửa',
              'Switch from Caddy to nginx, whose reload re-opens configuration files by path|||Chuyển từ Caddy sang nginx, vì reload của nginx mở lại file cấu hình theo đường dẫn',
              'Mount the folder (./caddy:/etc/caddy:ro); a single-file mount is bound to the old inode|||Gắn cả thư mục (./caddy:/etc/caddy:ro); mount file đơn bị buộc vào inode cũ',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A single-file bind mount follows the file’s inode from container start; rename-over gives the path a new inode, so the container sees the file vanish (Docker Desktop) or keeps the old content (Linux). Mounting the directory fixes it for good — measured: after mv inside caddy/, reload worked and /ping answered "pong v2". A restart re-binds the mount but you would have to remember it every time; :rw changes nothing about inodes; nginx has the same problem (Chapter 7).|||VI: Bind mount file đơn bám theo inode của file từ lúc container khởi động; ghi-rồi-đổi-tên cho đường dẫn một inode mới, nên container thấy file biến mất (Docker Desktop) hoặc cứ giữ nội dung cũ (Linux). Gắn thư mục sửa dứt điểm — đo được: sau khi mv bên trong caddy/, reload chạy và /ping trả "pong v2". Restart thì gắn lại mount, nhưng bạn phải nhớ làm vậy mọi lần; :rw chẳng đổi gì về inode; nginx dính y chang (Chương 7).',
          },
          {
            question: 'On the team VPS, "ufw status" shows "5432 DENY Anywhere", but a port scan from home shows PostgreSQL open, and the database container was started with "-p 5432:5432". Why, and what fixes it?|||Trên VPS của nhóm, "ufw status" hiện "5432 DENY Anywhere", nhưng quét cổng từ nhà lại thấy PostgreSQL đang mở, và container CSDL được chạy với "-p 5432:5432". Vì sao, và sửa bằng gì?',
            options: [
              'ufw needs "ufw reload" after every new container; reload it and the rule will apply|||ufw cần "ufw reload" sau mỗi container mới; reload là luật có hiệu lực',
              'The deny rule is for TCP only and Postgres listens on UDP; add a UDP deny rule as well|||Luật deny chỉ áp cho TCP còn Postgres nghe trên UDP; thêm một luật deny cho UDP nữa',
              'Docker’s own firewall rules divert published ports before ufw sees them; do not publish it, or bind to 127.0.0.1|||Luật tường lửa riêng của Docker rẽ cổng đã công bố đi trước khi ufw kịp thấy; đừng công bố nó, hoặc gắn vào 127.0.0.1',
              'The scan hit Docker’s userland proxy, which only answers the handshake and never forwards traffic|||Lần quét trúng userland proxy của Docker, thứ chỉ trả lời bắt tay chứ không chuyển tiếp dữ liệu',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Docker’s documentation says traffic to published container ports "gets diverted before it goes through the ufw firewall settings". The fix is not to publish database ports at all (the app reaches the DB by name on the Compose network), or to bind them to 127.0.0.1 and use an SSH tunnel. Reloading ufw changes nothing, Postgres uses TCP, and the port is genuinely forwarded — attackers can log in if they guess the password.|||VI: Tài liệu Docker ghi lưu lượng tới cổng container đã công bố "gets diverted before it goes through the ufw firewall settings" (bị rẽ đi trước khi đi qua luật của ufw). Cách sửa là đừng công bố cổng CSDL (app gọi CSDL bằng tên trên mạng Compose), hoặc gắn nó vào 127.0.0.1 và vào qua đường hầm SSH. Reload ufw chẳng đổi gì, Postgres dùng TCP, và cổng đó được chuyển tiếp thật — kẻ tấn công đăng nhập được nếu đoán ra mật khẩu.',
          },
          {
            question: 'A Linux machine has an RTX 3060, and nvidia-smi works on the host. "docker run --rm --gpus all alpine:3 true" prints "failed to discover GPU vendor from CDI: no known GPU vendor found" and exits 125. What does it mean?|||Một máy Linux có RTX 3060, và nvidia-smi chạy được trên máy chủ. "docker run --rm --gpus all alpine:3 true" in ra "failed to discover GPU vendor from CDI: no known GPU vendor found" và thoát 125. Nghĩa là gì?',
            options: [
              'The alpine image has no CUDA libraries; use an nvidia/cuda base image and the GPU will be found|||Ảnh alpine không có thư viện CUDA; dùng ảnh nền nvidia/cuda là GPU sẽ được tìm thấy',
              'The NVIDIA Container Toolkit is missing on the host; installing it needs sudo and a Docker restart|||Máy chủ thiếu NVIDIA Container Toolkit; cài nó cần sudo và phải khởi động lại Docker',
              'Another process is using the GPU, and Docker refuses to share a GPU that is already busy|||Một tiến trình khác đang dùng GPU, và Docker từ chối chia sẻ GPU đang bận',
              'The NVIDIA driver on the host is too old for Docker 29; nvidia-smi working proves nothing|||Driver NVIDIA trên máy chủ quá cũ so với Docker 29; nvidia-smi chạy được không chứng minh gì',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Exit 125 means Docker refused before creating the container, so the image is irrelevant. The driver works (nvidia-smi answers); what is missing is the host piece that tells Docker how to mount the GPU — the toolkit, registered as a runtime or through a CDI spec. That is exactly the course’s Linux machine: runtimes list only runc, nvidia-ctk not found. Docker does not refuse a busy GPU; VRAM contention shows up later, inside the program.|||VI: Mã 125 nghĩa là Docker từ chối trước khi tạo container, nên ảnh nào cũng không liên quan. Driver vẫn chạy (nvidia-smi trả lời); thứ còn thiếu là mảnh ghép trên máy chủ chỉ cho Docker cách gắn GPU vào — chính là toolkit, đăng ký thành runtime hoặc qua file CDI. Đúng tình trạng máy Linux của khoá: runtimes chỉ có runc, nvidia-ctk not found. Docker không từ chối GPU đang bận; tranh chấp VRAM chỉ lộ ra về sau, bên trong chương trình.',
          },
        ],
      },
    },
  ],
};
