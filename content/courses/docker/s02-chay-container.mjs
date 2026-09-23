/**
 * Docker — Chương 2: chạy container.
 * docker run và bản đồ cờ · quan sát · vào bên trong · môi trường/người dùng ·
 * giới hạn & restart · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026 (theo _HOP-DONG.md): bài 2.0 slide (deck dk-02, 32 slide) + slide/🧪/🗂/📌 +
 * giải phẫu một câu lệnh docker run, bảng cờ (cờ → nghĩa → ví dụ → khi nào) cho từng bài, các đoạn
 * "Chạy thử từng bước"; sửa ~17 chỗ output/khẳng định cũ SAI khi chạy lại trên Docker 29 (IPAddress đã bỏ,
 * filter VÀ, jq không -i, attach + timeout, demo distroless, rekcod, OOM head|tail, TZ…); quiz 10 câu.
 * Output MỚI chạy thật 23/09/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1) và Engine 29.6 (Fedora, amd64).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 2 — Running containers|||Chương 2 — Chạy container',
  description: 'Mọi cờ của docker run mà bạn thật sự dùng, cách quan sát một container đang chạy, cách vào bên trong (kể cả khi nó không có shell), biến môi trường và người dùng, rồi giới hạn tài nguyên và chính sách khởi động lại.',
  lessons: [
    /* ─────────────────────────── 2.0 ─────────────────────────── */
    {
      title: '2.0 — Chapter 2 slides: running containers in pictures|||2.0 — Slide Chương 2: chạy container bằng hình',
      slug: 'dk-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 2: giải phẫu một câu lệnh docker run, bảng cờ, -p và loopback, ENTRYPOINT + CMD, sáu lệnh quan sát, exec khác attach, -i/-t, ảnh không có shell, biến môi trường, quyền file, múi giờ, giới hạn, restart và healthcheck — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This is the chapter where you type the most commands, so the slides are built around commands: one real <code>docker run</code> taken apart piece by piece, two pages of flag tables (flag → meaning → example → when to use it), and for every lesson a terminal with real output next to a picture of what it means.</p>
<p>Slides 3–8 belong to Lesson 2.1 (anatomy of <code>docker run</code>, flag tables, <code>-p</code> and loopback, ENTRYPOINT + CMD), 9–14 to 2.2 (logs, inspect, stats/top/diff, the sweep), 15–19 to 2.3 (exec vs attach, <code>-i</code>/<code>-t</code>, images without a shell), 20–24 to 2.4 (environment, secrets, file ownership, time zones) and 25–29 to 2.5 (memory, OOM, CPU, restart backoff, healthchecks). The last three are the chapter's common mistakes, a cheat sheet, and a 40-minute practice session. Every terminal is real output, recorded in September 2026 on Docker Desktop 4.91 / Engine 29.8 (Mac M1) and Docker Engine 29.6 (Linux); container names carry the course's <code>dk02-</code> prefix in our runs and are shortened on the slides. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Đây là chương bạn gõ nhiều lệnh nhất, nên bộ slide dựng quanh câu lệnh: một lệnh <code>docker run</code> thật được mổ ra từng mẩu, hai trang bảng cờ (cờ → nghĩa → ví dụ → khi nào dùng), và ở mỗi bài là một terminal có output thật đặt cạnh một hình giải thích nó nghĩa là gì.</p>
<p>Slide 3–8 thuộc Bài 2.1 (giải phẫu <code>docker run</code>, bảng cờ, <code>-p</code> và loopback, ENTRYPOINT + CMD), 9–14 thuộc 2.2 (logs, inspect, stats/top/diff, cuộc quét), 15–19 thuộc 2.3 (exec khác attach, <code>-i</code>/<code>-t</code>, ảnh không có shell), 20–24 thuộc 2.4 (biến môi trường, bí mật, quyền sở hữu file, múi giờ) và 25–29 thuộc 2.5 (bộ nhớ, OOM, CPU, restart lùi dần, healthcheck). Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 40 phút. Mọi terminal là output THẬT, ghi tháng 9/2026 trên Docker Desktop 4.91 / Engine 29.8 (Mac M1) và Docker Engine 29.6 (Linux); tên container trong lần chạy của khoá có tiền tố <code>dk02-</code> và được rút gọn trên slide — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('dk-02', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Giải phẫu một câu lệnh docker run'], [4, 'Mọi thứ sau tên ảnh thuộc về container'], [5, 'Bảng cờ (1/2): chạy · mạng · dữ liệu'],
  [6, 'Bảng cờ (2/2): cấu hình · giới hạn · ghi đè ảnh'], [7, '-p mở cho cả LAN — 127.0.0.1: chỉ mình bạn'], [8, 'ENTRYPOINT + CMD = lệnh thật chạy'],
  [9, 'Sáu câu hỏi, sáu câu lệnh'], [10, 'docker logs = stdout + stderr của PID 1'], [11, 'File log và bộ đệm làm log trống'],
  [12, 'inspect: một dòng phân loại'], [13, 'stats · top · port · diff: đọc từng cột'], [14, 'Cuộc quét 30 giây và bẫy --filter'],
  [15, 'exec khác attach'], [16, 'Tín hiệu vào docker attach tới thẳng app'], [17, '-i và -t: dùng sai là hỏng im lặng'],
  [18, 'Ảnh không có shell: container phụ'], [19, 'Bốn đường vào một container'],
  [20, 'Bốn nguồn biến môi trường'], [21, '--env-file giữ nguyên văn'], [22, 'Biến môi trường không bí mật'],
  [23, 'root trong container và quyền file'], [24, 'Múi giờ và tzdata'],
  [25, 'Không có --memory = lấy cả máy'], [26, 'Thử chạm trần bộ nhớ đúng cách'], [27, '--cpus và app tự đo lại chính nó'],
  [28, 'restart lùi dần'], [29, 'Healthcheck chỉ báo cáo'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 2'],
])}
`,
    },
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — docker run: the flags you use every day|||2.1 — docker run: những cờ bạn dùng mỗi ngày',
      slug: 'dk-2-1-docker-run',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cấu trúc của một câu lệnh run, sáu nhóm cờ, thứ tự tham số quan trọng ở đâu, ghi đè CMD, và cách đọc lại một container đang chạy thành câu lệnh đã tạo ra nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>docker run: the flags you use every day</h2>
<p class="lead"><code>docker run</code> has over a hundred options and you will use about fifteen. This lesson is those fifteen, grouped by what they do, plus the one structural rule that explains every "why did my flag get ignored" question.</p>

<h3>The shape of the command</h3>
${slide('dk-02', 4, 'Mọi thứ sau tên ảnh thuộc về container — kể cả “-it”')}
<pre><code>docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
<span class="tok-comment">#          ^^^^^^^^^ ^^^^^ ^^^^^^^^^^^^^^^^^^</span>
<span class="tok-comment">#          for Docker | the image | for the process INSIDE</span>

docker run -d -p 8080:80 nginx:1.27-alpine nginx -g 'daemon off;'</code></pre>
<div class="callout warn"><strong>Everything after the image name belongs to the container, not to Docker.</strong> This is the rule that explains the whole command. <code>docker run alpine -it</code> does not open a terminal — it runs <code>alpine</code> with the arguments <code>-it</code>, and fails with <code>exec: "-it": executable file not found</code>. Flags go BEFORE the image name, always. When a flag "does nothing", check which side of the image name it is on.</div>
<pre><code>docker run --rm alpine echo hello          <span class="tok-comment"># overrides the image's CMD</span>
docker run --rm alpine -it 2&gt;&amp;1 | head -1  <span class="tok-comment"># WRONG: -it is an argument now</span>
docker run --rm -it alpine sh -c 'echo ok' <span class="tok-comment"># right</span></code></pre>
<div class="out">hello
docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: exec: "-it": executable file not found in $PATH
ok</div>
<p>Re-run on Docker 29.8 (Mac, September 2026), the failing line prints <code>… runc create failed: unable to start container process: error during container init: exec: "-it": executable file not found in $PATH</code> and the exit code is <strong>127</strong> — "command not found", the same code your shell uses. Two side effects catch people out. The container was still <em>created</em> — <code>docker ps -a</code> shows it with status <code>Created</code> — and because it has a name if you gave it one, the next <code>docker run --name x …</code> fails with <code>Conflict. The container name "/x" is already in use</code> (exit 125) until you <code>docker rm x</code>.</p>

<h3>Anatomy of one real command, piece by piece</h3>
${slide('dk-02', 3, 'Giải phẫu một câu lệnh docker run: mỗi mẩu một việc')}
<p>Here is the kind of command you will actually type for a service: an nginx serving a folder from your project, reachable only from your own machine, restarting on its own, with a memory ceiling. Read it top to bottom exactly as Docker does — everything before the image name configures the container, the image name is the boundary, and anything after it would replace the image's default command.</p>
<pre><code class="language-bash">mkdir -p ~/thu-docker/web &amp;&amp; echo '&lt;h1&gt;xin chao&lt;/h1&gt;' &gt; ~/thu-docker/web/index.html
cd ~/thu-docker
docker run -d \\
  --name web \\
  --restart unless-stopped \\
  -p 127.0.0.1:18025:80 \\
  -v "\$PWD/web:/usr/share/nginx/html:ro" \\
  -e TZ=Asia/Ho_Chi_Minh \\
  --memory 256m \\
  nginx:1.27-alpine
curl -s localhost:18025
docker ps --filter name=web</code></pre>
<div class="out">8776815f28ab…
&lt;h1&gt;xin chao&lt;/h1&gt;
CONTAINER ID   IMAGE               COMMAND                  CREATED                  STATUS                  PORTS                     NAMES
8776815f28ab   nginx:1.27-alpine   "/docker-entrypoint.…"   Less than a second ago   Up Less than a second   127.0.0.1:18025-&gt;80/tcp   web</div>
<table>
<tr><th>Piece</th><th>Group</th><th>What it does here</th></tr>
<tr><td><code>docker run</code></td><td>—</td><td>Pull the image if missing, <em>create</em> a new container, <em>start</em> it (Lesson 1.3). Every <code>run</code> makes a NEW container.</td></tr>
<tr><td><code>-d</code></td><td>1 · how it runs</td><td>Detach: print the full container ID and give your terminal back.</td></tr>
<tr><td><code>--name web</code></td><td>1</td><td>A fixed name for <code>docker logs web</code>, <code>docker exec web</code>, <code>docker rm -f web</code>.</td></tr>
<tr><td><code>--restart unless-stopped</code></td><td>1</td><td>If nginx dies, or Docker/the machine restarts, bring it back — unless you stopped it yourself (Lesson 2.5).</td></tr>
<tr><td><code>-p 127.0.0.1:18025:80</code></td><td>2 · network</td><td><code>host-IP:host-port:container-port</code>. Port 18025 on your loopback goes to port 80 inside. Nobody else on the network can reach it.</td></tr>
<tr><td><code>-v "\$PWD/web:/usr/share/nginx/html:ro"</code></td><td>3 · data</td><td>Bind mount: your folder appears where nginx looks for files, read-only. Edit <code>index.html</code> on your Mac and refresh — no rebuild.</td></tr>
<tr><td><code>-e TZ=Asia/Ho_Chi_Minh</code></td><td>4 · config</td><td>An environment variable. This one makes <code>date</code> and logs inside show Vietnam time — if the image has time-zone data (Lesson 2.4).</td></tr>
<tr><td><code>--memory 256m</code></td><td>5 · limits</td><td>Hard RAM ceiling; cross it and the kernel kills the process (exit 137).</td></tr>
<tr><td><code>nginx:1.27-alpine</code></td><td>the image</td><td><code>name:tag</code>. The boundary: nothing after it is read by Docker.</td></tr>
<tr><td>(nothing)</td><td>6 · command</td><td>No command given, so the image's own ENTRYPOINT + CMD run: <code>/docker-entrypoint.sh nginx -g 'daemon off;'</code>.</td></tr>
</table>
<div class="callout"><strong>The order of flags among themselves does not matter</strong> — <code>--memory 256m -d --name web</code> is the same command. Only two positions matter: flags before the image, the command after it. And a flag that takes a value takes the NEXT word: <code>-p -d 80</code> is not "publish and detach".</div>
<div class="callout warn"><strong>Windows teammates.</strong> <code>\$PWD</code> and the <code>\\</code> line continuation are bash/zsh. In PowerShell the same command is written with <code>&#36;{PWD}</code> and a backtick at the end of each line; in Command Prompt, <code>%cd%</code> and <code>^</code>. In Git Bash a path like <code>/usr/share/nginx/html</code> can be rewritten into <code>C:/Program Files/Git/usr/…</code> — prefix it with a double slash (<code>//usr/share/…</code>) or run from WSL2. When "the same command" fails only on one teammate's machine, check the shell first.</div>

<div class="lz-map">
  <div class="lz-stage">The six groups of flags</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">How it runs</span><span class="lz-nsub"><code>-d</code> · <code>-it</code> · <code>--rm</code> · <code>--name</code> · <code>--restart</code> · <code>--init</code> — foreground or background, interactive or not, and what happens when it stops.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Networking</span><span class="lz-nsub"><code>-p</code> · <code>-P</code> · <code>--network</code> — which ports reach it and which other containers it can see.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Data</span><span class="lz-nsub"><code>-v</code> · <code>--mount</code> · <code>--tmpfs</code> — what survives the container and what does not.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Configuration</span><span class="lz-nsub"><code>-e</code> · <code>--env-file</code> · <code>-w</code> · <code>-u</code> — the environment, the working directory, and who the process is.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Limits</span><span class="lz-nsub"><code>--memory</code> · <code>--cpus</code> · <code>--pids-limit</code> — how much of the machine it may take before the kernel stops it.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Overriding the image</span><span class="lz-nsub">a trailing command · <code>--entrypoint</code> — replacing what the image says to run.</span></div></div>
</div>
<h3>Group 1 — how it runs</h3>
${slide('dk-02', 5, 'Bảng cờ (1/2): chạy · mạng · dữ liệu')}
<div class="kv-grid">
  <div class="kv"><span class="k">-d, --detach</span><span class="v">Background it and print the container ID. Without it you are attached: the container's output is your terminal, and Ctrl-C signals the container.</span></div>
  <div class="kv"><span class="k">-it</span><span class="v">Two flags: <code>-i</code> keeps stdin open, <code>-t</code> allocates a pseudo-TTY. Together they make an interactive shell behave normally. Lesson 2.3 explains when you want only one of them.</span></div>
  <div class="kv"><span class="k">--rm</span><span class="v">Delete the container the moment it exits. Right for anything interactive or one-shot; wrong when you will want the logs or exit code afterwards.</span></div>
  <div class="kv"><span class="k">--name</span><span class="v">A stable name instead of <code>musing_hopper</code>. Required for anything you will reference again, and unique per machine — including stopped containers.</span></div>
  <div class="kv"><span class="k">--restart</span><span class="v"><code>no</code> (default), <code>on-failure[:n]</code>, <code>always</code>, <code>unless-stopped</code>. Lesson 2.5 covers which to choose; the short version is <code>unless-stopped</code> for services.</span></div>
  <div class="kv"><span class="k">--init</span><span class="v">Insert <code>tini</code> as PID 1 to forward signals and reap zombies (Lesson 1.3). Cheap insurance for anything that spawns child processes.</span></div>
</div>

<h3>Group 2 — networking</h3>
${slide('dk-02', 7, '-p mở cho cả LAN — thêm 127.0.0.1: là chỉ mình bạn')}
<pre><code>docker run -d --name a -p 8080:80 nginx:1.27-alpine            <span class="tok-comment"># host:container</span>
docker run -d --name b -p 127.0.0.1:8081:80 nginx:1.27-alpine  <span class="tok-comment"># localhost only</span>
docker run -d --name c -P nginx:1.27-alpine                    <span class="tok-comment"># random high port</span>
docker port c</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:32768
80/tcp -&gt; [::]:32768</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-p 8080:80</span><span class="v">Publish container port 80 as host port 8080, on <strong>all</strong> host interfaces. On a public server that means the whole internet, regardless of what <code>ufw</code> says (Chapter 8).</span></div>
  <div class="kv"><span class="k">-p 127.0.0.1:5432:5432</span><span class="v">Bind to loopback only. This is the correct form for a database behind a proxy or reachable through an SSH tunnel, and the habit that prevents accidentally exposing PostgreSQL to the world.</span></div>
  <div class="kv"><span class="k">--network mynet</span><span class="v">Attach to a user-defined network so containers can reach each other by name. Almost always what you want instead of publishing ports between your own services (Chapter 8).</span></div>
  <div class="kv"><span class="k">--network host</span><span class="v">No network namespace at all: the container uses the host's interfaces directly. Fast, occasionally necessary, and it throws away isolation and port mapping together.</span></div>
</div>
<p><strong>Run it step by step — prove who can reach which port.</strong> <code>-p</code> without an address listens on <code>0.0.0.0</code>, which means "every network card of this machine", including the Wi-Fi card your classmates can reach. Try it with two containers and your own LAN address (on a Mac: <code>ipconfig getifaddr en0</code>; on Linux: <code>hostname -I</code>):</p>
<pre><code class="language-bash">docker run -d --name a -p 18020:80 nginx:1.27-alpine
docker run -d --name b -p 127.0.0.1:18021:80 nginx:1.27-alpine
docker port a; docker port b
IP=\$(ipconfig getifaddr en0)
curl -s -o /dev/null -w 'a via LAN: %{http_code}\\n' \$IP:18020
curl -s -o /dev/null -w 'b via LAN: %{http_code}\\n' \$IP:18021; echo "curl exit \$?"
docker rm -f a b</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:18020
80/tcp -&gt; [::]:18020
80/tcp -&gt; 127.0.0.1:18021
a via LAN: 200
b via LAN: 000
curl exit 7</div>
<p>Real output from the course Mac. <code>000</code> with curl exit 7 means "could not connect at all": <code>b</code> simply is not listening on the LAN card. Both answer <code>200</code> on <code>localhost</code>. Also notice <code>-P</code> on Docker Desktop picked port <code>55000</code> in our run rather than the <code>32768</code> shown above — the random range differs by platform, which is why <code>docker port</code> exists.</p>

<h3>Group 3 — data</h3>
<pre><code>docker volume create pgdata
docker run -d --name db -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=x postgres:16-alpine

docker run --rm -v "\$PWD:/work" -w /work alpine ls | head -3
docker run --rm --tmpfs /scratch:size=64m alpine df -h /scratch | tail -1</code></pre>
<div class="out">Dockerfile
index.html
package.json
tmpfs                    64.0M         0     64.0M   0% /scratch</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-v name:/path</span><span class="v">Named volume — Docker-managed, survives <code>rm</code>. For databases and anything stateful (Chapter 7).</span></div>
  <div class="kv"><span class="k">-v /host/path:/path</span><span class="v">Bind mount — a host directory appears inside. Add <code>:ro</code> for read-only, which you should for config files.</span></div>
  <div class="kv"><span class="k">--mount type=…</span><span class="v">The verbose, explicit form: <code>--mount type=bind,source=…,target=…,readonly</code>. More typing, but it errors instead of silently creating an empty directory when you typo a source path.</span></div>
  <div class="kv"><span class="k">--tmpfs /path</span><span class="v">In-memory scratch space that never hits disk. Good for temp files, and for sensitive data you do not want in a layer.</span></div>
</div>
<p><strong>The typo test, run for real.</strong> The difference between <code>-v</code> and <code>--mount</code> is easiest to believe when you see it:</p>
<pre><code class="language-bash">docker run --rm -v "\$PWD/web:/work:ro" alpine sh -c 'echo x &gt; /work/a.txt'; echo "exit=\$?"
docker run --rm --mount type=bind,source="\$PWD/khong-co",target=/work alpine ls /work; echo "exit=\$?"
docker run --rm -v "\$PWD/khong-co:/work" alpine ls -la /work; echo "exit=\$?"
ls -ld khong-co</code></pre>
<div class="out">sh: can't create /work/a.txt: Read-only file system
exit=1
docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /host_mnt/…/khong-co
exit=125
total 4
drwxr-xr-x    2 root     root            64 Sep 23 14:01 .
drwxr-xr-x    1 root     root          4096 Sep 23 14:01 ..
exit=0
drwxr-xr-x  2 admin  wheel  64 Sep 23 21:01 khong-co</div>
<p>Read it line by line: <code>:ro</code> really is read-only; <code>--mount</code> refuses a path that does not exist (exit 125, before any container is made); and <code>-v</code> with the same typo "succeeds", quietly creates an empty <code>khong-co</code> folder on your machine and mounts it — so your app starts against an empty directory and you debug the wrong thing. On a Mac the error also reveals that Docker Desktop sees your files under <code>/host_mnt/…</code>: they are shared into the Linux VM, which is why bind mounts are slower on Mac and Windows than on Linux (Chapter 7).</p>

<h3>Group 4 — configuration</h3>
${slide('dk-02', 6, 'Bảng cờ (2/2): cấu hình · giới hạn · ghi đè ảnh')}
<pre><code>docker run --rm -e GREETING=hello -e NAME alpine env | grep -E '^(GREETING|NAME)='
printf 'DB_HOST=db\\nDB_PORT=5432\\n' &gt; app.env
docker run --rm --env-file app.env alpine env | grep DB_
docker run --rm -w /etc alpine pwd
docker run --rm -u 1000:1000 alpine id</code></pre>
<div class="out">GREETING=hello
NAME=cuong
DB_HOST=db
DB_PORT=5432
/etc
uid=1000 gid=1000 groups=1000</div>
<p><code>-e NAME</code> with no value passes through the variable of the same name from your shell — handy, and a trap in CI where that variable may not exist. Lesson 2.4 covers precedence, and why environment variables are the wrong place for real secrets.</p>

<h3>Group 5 — limits</h3>
<pre><code>docker run -d --name l --memory 256m --memory-swap 256m \\
  --cpus 0.5 --pids-limit 100 nginx:1.27-alpine
docker inspect l --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}} {{.HostConfig.PidsLimit}}'
docker stats --no-stream l --format '{{.Name}} {{.MemUsage}} {{.CPUPerc}}'</code></pre>
<div class="out">268435456 500000000 100
l 3.586MiB / 256MiB 0.00%</div>
<p>Note that <code>docker stats</code> now shows <code>/ 256MiB</code> rather than the host's total. Inside the container, tools that read cgroup limits — modern JVMs, and Node's heap sizing and <code>os.availableParallelism()</code> — size their heaps and worker counts to that number instead of the host's, which is a large part of why setting limits matters even on a machine with plenty of RAM. Not everything is that clever: measured on Docker 29 with <code>--cpus 1</code>, Python's <code>os.cpu_count()</code> and Node's <code>os.cpus().length</code> still report all 10 CPUs of the host (Lesson 2.5 shows the numbers).</p>

<h3>Group 6 — overriding the image</h3>
${slide('dk-02', 8, 'ENTRYPOINT + CMD = lệnh thật chạy; tham số chỉ thay CMD')}
<pre><code>docker image inspect nginx:1.27-alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'
docker run --rm nginx:1.27-alpine nginx -v                 <span class="tok-comment"># replaces CMD</span>
docker run --rm --entrypoint sh nginx:1.27-alpine -c 'echo replaced entrypoint'
docker run --rm --entrypoint "" nginx:1.27-alpine ls /docker-entrypoint.d</code></pre>
<div class="out">ENTRYPOINT=[/docker-entrypoint.sh] CMD=[nginx -g daemon off;]
nginx version: nginx/1.27.2
replaced entrypoint
10-listen-on-ipv6-by-default.sh
15-local-resolvers.envsh
20-envsubst-on-templates.sh
30-tune-worker-processes.sh</div>
<div class="callout"><strong>The relationship is: final command = ENTRYPOINT + CMD.</strong> Arguments after the image name replace <code>CMD</code> and are appended to <code>ENTRYPOINT</code>. <code>--entrypoint</code> replaces the entrypoint itself, and <code>--entrypoint ""</code> clears it — which is the escape hatch when an image's entrypoint script is between you and a shell you need for debugging. Chapter 4 builds this properly from the Dockerfile side.</div>
<p><strong>One detail the output above hides.</strong> Re-run today (nginx 1.27.5), <code>docker run --rm nginx:1.27-alpine nginx -v</code> prints nine lines from <code>/docker-entrypoint.sh</code> — "Looking for shell scripts in /docker-entrypoint.d/", "Configuration complete; ready for start up" — <em>before</em> <code>nginx version: nginx/1.27.5</code>. That is the rule in action: your <code>nginx -v</code> replaced only the CMD, so the entrypoint script still ran first and passed control to it. Official images use this pattern a lot. <code>node:22-alpine</code> even lets you type just the flags: <code>docker run --rm node:22-alpine -v</code> prints <code>v22.23.2</code> because its entrypoint sees an argument starting with <code>-</code> and puts <code>node</code> in front of it.</p>

<h3>The flag table: this whole lesson on one page</h3>
<p>Every flag in this lesson, with the question "when do I actually reach for it?". Bookmark this table; it is the page you come back to when a command someone pasted in the group chat looks like noise.</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th><th>When to use it</th></tr>
<tr><td><code>-d</code></td><td>Run in background, print the ID</td><td><code>docker run -d nginx:1.27-alpine</code></td><td>Anything long-running: web server, database</td></tr>
<tr><td><code>-it</code></td><td>Keep stdin open + give it a terminal</td><td><code>docker run -it alpine sh</code></td><td>You are going to type into it</td></tr>
<tr><td><code>--rm</code></td><td>Delete the container when it exits</td><td><code>docker run --rm alpine date</code></td><td>One-shot commands; never for a service you may need to inspect after a crash</td></tr>
<tr><td><code>--name</code></td><td>Stable, unique name</td><td><code>--name db</code></td><td>Anything you will refer to again</td></tr>
<tr><td><code>--restart</code></td><td>Restart policy</td><td><code>--restart unless-stopped</code></td><td>Services on a server (2.5)</td></tr>
<tr><td><code>--init</code></td><td>tini as PID 1</td><td><code>--init node server.js</code></td><td>Apps that do not handle SIGTERM themselves (1.3)</td></tr>
<tr><td><code>-p</code></td><td>Publish host port → container port</td><td><code>-p 127.0.0.1:5432:5432</code></td><td>You need to reach it from the host or the browser</td></tr>
<tr><td><code>-P</code></td><td>Publish every EXPOSEd port on a random port</td><td><code>-P</code> then <code>docker port</code></td><td>Quick throwaway tests only</td></tr>
<tr><td><code>--network</code></td><td>Attach to a network</td><td><code>--network app</code></td><td>Containers that talk to each other by name (Ch. 8)</td></tr>
<tr><td><code>-v name:/path</code></td><td>Named volume</td><td><code>-v pgdata:/var/lib/postgresql/data</code></td><td>Data that must survive <code>rm</code></td></tr>
<tr><td><code>-v /host:/path[:ro]</code></td><td>Bind mount</td><td><code>-v "\$PWD:/app"</code></td><td>Source code in development, config files</td></tr>
<tr><td><code>--mount</code></td><td>Explicit mount, errors on typos</td><td><code>--mount type=bind,source=…,target=…</code></td><td>Scripts and CI, where a silent empty dir hurts</td></tr>
<tr><td><code>--tmpfs</code></td><td>RAM-backed directory</td><td><code>--tmpfs /tmp:size=64m</code></td><td>Scratch files, nothing that must survive</td></tr>
<tr><td><code>-e</code> / <code>--env-file</code></td><td>Environment variables</td><td><code>-e NODE_ENV=production</code></td><td>Configuration that differs per machine (2.4)</td></tr>
<tr><td><code>-w</code></td><td>Working directory</td><td><code>-w /app</code></td><td>Running a tool in the project folder</td></tr>
<tr><td><code>-u</code></td><td>Run as UID:GID</td><td><code>-u "\$(id -u):\$(id -g)"</code></td><td>Files written to a bind mount should belong to you (2.4)</td></tr>
<tr><td><code>--memory</code> · <code>--cpus</code> · <code>--pids-limit</code></td><td>Resource ceilings</td><td><code>--memory 256m --cpus 0.5</code></td><td>Every service on a shared machine (2.5)</td></tr>
<tr><td><code>--entrypoint</code></td><td>Replace the ENTRYPOINT</td><td><code>--entrypoint ""</code></td><td>The entrypoint script is in the way of debugging</td></tr>
<tr><td>after the image</td><td>Replace the CMD</td><td><code>nginx:1.27-alpine nginx -v</code></td><td>Run a different program from the same image</td></tr>
</table>

<h3>Read a running container back as a command</h3>
<pre><code>docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | head -3
docker inspect db --format '{{range \$p, \$v := .NetworkSettings.Ports}}{{\$p}} {{end}}'
docker inspect db --format '{{.HostConfig.RestartPolicy.Name}} {{.Config.Image}}'
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  nexdrew/rekcod db 2&gt;/dev/null | head -4</code></pre>
<div class="out">["POSTGRES_PASSWORD=x"
"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
"GOSU_VERSION=1.17"
5432/tcp
no postgres:16-alpine</div>
<p>Being able to reconstruct the command from a running container is a real operational skill: it answers "what exactly is production running?" without trusting a wiki. <code>docker inspect</code> with a <code>--format</code> template does it precisely; tools like <code>rekcod</code> do it approximately but instantly. Once a stack is more than two containers, this is what Compose replaces (Chapter 9).</p>
<div class="callout warn"><strong>Correction (re-checked September 2026).</strong> An earlier version of this lesson pulled rekcod from <code>ghcr.io/nexdrew/rekcod</code>; that image does not exist (<code>error from registry: denied</code>). The image is on Docker Hub as <code>nexdrew/rekcod</code>, and it is built for <code>linux/amd64</code> only — on an M1 Mac it still runs, through emulation, with a platform warning. On Docker 29 it printed, for the <code>db</code> container above: <code>docker run --name db --runtime runc -v pgdata:/var/lib/postgresql/data --net bridge --restart no … -e 'POSTGRES_PASSWORD=x' … -d --entrypoint "docker-entrypoint.sh" postgres:16-alpine 'postgres'</code> — note that it lists every variable the IMAGE set too, so its output is longer than the command you actually typed.</div>
<pre><code>docker rm -f a b c l db &gt;/dev/null; docker volume rm pgdata; rm -f app.env</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team keeps the landing page in a <code>web/</code> folder. A teammate pastes <code>docker run -d nginx:1.27-alpine -p 8080:80 -v web:/usr/share/nginx/html</code> into the group chat and says "it prints an ID, so it worked — but the browser can't open anything". Fix it, and serve the page only to your own machine.</p><ol>
<li>In <code>~/thu-docker</code>, create <code>web/index.html</code> containing <code>&lt;h1&gt;SWP391&lt;/h1&gt;</code>. Run the teammate's command with <code>--name thu-sai</code> added after <code>-d</code>. Check <code>docker ps -a --filter name=thu-sai</code> and <code>docker logs thu-sai</code>, and explain what happened to <code>-p</code> and <code>-v</code>.</li>
<li>Write the correct command: name <code>thu-web</code>, published on <code>127.0.0.1:8080</code>, your folder mounted read-only with an absolute path (<code>"\$PWD/web"</code>), <code>--memory 128m</code>.</li>
<li>Prove it: <code>curl -s localhost:8080</code> shows your heading; <code>docker port thu-web</code> shows <code>127.0.0.1</code>; editing <code>index.html</code> changes the page without restarting.</li>
<li>Read the container back: print its restart policy, memory limit and port bindings with one <code>docker inspect --format</code>.</li>
<li>Clean up: <code>docker rm -f thu-sai thu-web</code>.</li></ol>
<pre><code class="language-bash">docker inspect thu-web --format '{{.HostConfig.RestartPolicy.Name}} {{.HostConfig.Memory}} {{json .HostConfig.PortBindings}}'</code></pre>
<div class="out">no 134217728 {"80/tcp":[{"HostIp":"127.0.0.1","HostPort":"8080"}]}</div>
<p><strong>Done when:</strong> you can explain the teammate's result — on the course Mac it showed <code>Exited (2)</code> with the log line <code>/docker-entrypoint.sh: exec: line 47: illegal option -p</code>: the "flags" became the command, the entrypoint tried to run <code>-p</code>, no port was published and nothing was mounted — your page loads on localhost only, and the inspect line shows <code>134217728</code> bytes (= 128 MiB) and <code>127.0.0.1</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flag / option</span><span class="v">A word starting with <code>-</code> or <code>--</code> that configures the command. For <code>docker run</code> they must come before the image name.</span></div>
  <div class="kv"><span class="k">Image reference (name:tag)</span><span class="v"><code>nginx:1.27-alpine</code> — which image and which version. The boundary between Docker's flags and the container's command.</span></div>
  <div class="kv"><span class="k">Publish (a port)</span><span class="v">Make a container port reachable on a host port with <code>-p host:container</code>.</span></div>
  <div class="kv"><span class="k">Loopback (127.0.0.1)</span><span class="v">The address that only the same machine can reach. <code>-p 127.0.0.1:…</code> keeps a port private.</span></div>
  <div class="kv"><span class="k">Bind mount</span><span class="v">A host folder shown inside the container. <code>:ro</code> makes it read-only.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT / CMD</span><span class="v">The two halves of the command an image runs. Arguments after the image name replace CMD only.</span></div>
  <div class="kv"><span class="k">Detached (-d)</span><span class="v">Running in the background; your terminal is free and output goes to <code>docker logs</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Shape: <code>docker run [FLAGS] IMAGE [COMMAND] [ARGS]</code> — flags before the image, the command after it.</li>
<li>A flag placed after the image becomes a program name or argument: <code>alpine -it</code> → exit 127, container left in <code>Created</code>.</li>
<li><code>-p 8080:80</code> listens on every network card; <code>-p 127.0.0.1:8080:80</code> only on your machine.</li>
<li><code>-v</code> with a wrong path silently creates an empty folder; <code>--mount</code> refuses — use it in scripts.</li>
<li>The process that runs = ENTRYPOINT + CMD; your arguments replace CMD, <code>--entrypoint</code> replaces the first half.</li>
<li><code>docker inspect --format</code> turns a running container back into the facts of the command that made it.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">docker run — the full reference</span><span class="lc-sub">Every option, grouped. Worth one slow read now and a search later: most of the flags you have never used solve a problem you have not had yet.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/containers/run/" target="_blank" rel="noopener">
  <span class="lc-ico">🏃</span>
  <span class="lc-body"><span class="lc-title">Running containers — the concept guide</span><span class="lc-sub">The narrative version: how the flags interact, what the defaults are, and the ENTRYPOINT/CMD table that everyone bookmarks eventually.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the command</span><span class="lc-sub">Graded exercises: publish a port to loopback only, override an entrypoint to get a shell, pass an env file, and reconstruct a <code>docker run</code> from <code>docker inspect</code> output.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>-p 5432:5432</code> on a public server. Docker writes its port rules directly into the <code>DOCKER</code> iptables chain, which is consulted <em>before</em> ufw's rules — so your database is on the public internet while <code>ufw status</code> shows nothing wrong and reports the port as denied. This is not a bug; it is Docker doing exactly what you asked. The fix is to bind explicitly: <code>-p 127.0.0.1:5432:5432</code>. Audit any machine with <code>sudo ss -tlnp | grep -v 127.0.0.1</code> and check every line is something you meant to expose.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Flags go before the image name and everything after it belongs to the container — that one rule explains most "my flag was ignored" confusion. <code>-p</code> is <code>host:container</code>, and without an explicit <code>127.0.0.1:</code> prefix you are publishing to every interface, firewall or not. And <code>--entrypoint ""</code> is the escape hatch that gets you a shell in an image whose entrypoint is in the way.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>docker run: những cờ bạn dùng mỗi ngày</h2>
<p class="lead"><code>docker run</code> có hơn một trăm tuỳ chọn và bạn sẽ dùng khoảng mười lăm cái. Bài này là mười lăm cái đó, nhóm theo việc chúng làm, cộng thêm MỘT luật về cấu trúc giải thích được mọi câu hỏi kiểu "sao cái cờ của tôi bị bỏ qua".</p>

<h3>Hình hài của câu lệnh</h3>
${slide('dk-02', 4, 'Mọi thứ sau tên ảnh thuộc về container — kể cả “-it”')}
<pre><code>docker run [TUỲ CHỌN] ẢNH [CÂU LỆNH] [THAM SỐ...]
<span class="tok-comment">#          ^^^^^^^^^^ ^^^ ^^^^^^^^^^^^^^^^^^^^^^</span>
<span class="tok-comment">#          cho Docker | ảnh | cho tiến trình BÊN TRONG</span>

docker run -d -p 8080:80 nginx:1.27-alpine nginx -g 'daemon off;'</code></pre>
<div class="callout warn"><strong>Mọi thứ đứng SAU tên ảnh đều thuộc về container, không thuộc về Docker.</strong> Đây là cái luật giải thích cả câu lệnh. <code>docker run alpine -it</code> KHÔNG mở terminal nào — nó chạy <code>alpine</code> với tham số <code>-it</code>, và hỏng với <code>exec: "-it": executable file not found</code>. Cờ luôn đứng TRƯỚC tên ảnh. Khi một cái cờ "chẳng làm gì", hãy kiểm xem nó đang nằm ở phía nào của tên ảnh.</div>
<pre><code>docker run --rm alpine echo hello          <span class="tok-comment"># ghi đè CMD của ảnh</span>
docker run --rm alpine -it 2&gt;&amp;1 | head -1  <span class="tok-comment"># SAI: -it giờ là một tham số</span>
docker run --rm -it alpine sh -c 'echo ok' <span class="tok-comment"># đúng</span></code></pre>
<div class="out">hello
docker: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: exec: "-it": executable file not found in $PATH
ok</div>
<p>Chạy lại trên Docker 29.8 (Mac, tháng 9/2026), dòng hỏng in ra <code>… runc create failed: unable to start container process: error during container init: exec: "-it": executable file not found in $PATH</code> và mã thoát là <strong>127</strong> — "không tìm thấy lệnh", đúng mã mà shell của bạn dùng. Có hai hệ quả phụ hay làm người ta vấp. Container VẪN được <em>tạo</em> — <code>docker ps -a</code> hiện nó với trạng thái <code>Created</code> — và nếu bạn có đặt tên thì lần <code>docker run --name x …</code> sau sẽ hỏng với <code>Conflict. The container name "/x" is already in use</code> (mã 125) cho tới khi bạn <code>docker rm x</code>.</p>

<h3>Giải phẫu một câu lệnh thật, từng mẩu một</h3>
${slide('dk-02', 3, 'Giải phẫu một câu lệnh docker run: mỗi mẩu một việc')}
<p>Đây là kiểu câu lệnh bạn sẽ thật sự gõ cho một dịch vụ: một nginx phục vụ một thư mục trong dự án của bạn, chỉ máy bạn với tới được, tự dựng lại khi chết, có trần bộ nhớ. Đọc nó từ trên xuống đúng như Docker đọc — mọi thứ trước tên ảnh là cấu hình cho container, tên ảnh là ranh giới, còn thứ gì đứng sau nó sẽ thay câu lệnh mặc định của ảnh.</p>
<pre><code class="language-bash">mkdir -p ~/thu-docker/web &amp;&amp; echo '&lt;h1&gt;xin chao&lt;/h1&gt;' &gt; ~/thu-docker/web/index.html
cd ~/thu-docker
docker run -d \\
  --name web \\
  --restart unless-stopped \\
  -p 127.0.0.1:18025:80 \\
  -v "\$PWD/web:/usr/share/nginx/html:ro" \\
  -e TZ=Asia/Ho_Chi_Minh \\
  --memory 256m \\
  nginx:1.27-alpine
curl -s localhost:18025
docker ps --filter name=web</code></pre>
<div class="out">8776815f28ab…
&lt;h1&gt;xin chao&lt;/h1&gt;
CONTAINER ID   IMAGE               COMMAND                  CREATED                  STATUS                  PORTS                     NAMES
8776815f28ab   nginx:1.27-alpine   "/docker-entrypoint.…"   Less than a second ago   Up Less than a second   127.0.0.1:18025-&gt;80/tcp   web</div>
<table>
<tr><th>Mẩu</th><th>Nhóm</th><th>Ở đây nó làm gì</th></tr>
<tr><td><code>docker run</code></td><td>—</td><td>Kéo ảnh nếu chưa có, <em>tạo</em> một container MỚI, <em>khởi chạy</em> nó (Bài 1.3). Mỗi lần <code>run</code> là một container MỚI.</td></tr>
<tr><td><code>-d</code></td><td>1 · chạy thế nào</td><td>Detach (tách nền): in ID đầy đủ của container rồi trả terminal lại cho bạn.</td></tr>
<tr><td><code>--name web</code></td><td>1</td><td>Tên cố định để gọi <code>docker logs web</code>, <code>docker exec web</code>, <code>docker rm -f web</code>.</td></tr>
<tr><td><code>--restart unless-stopped</code></td><td>1</td><td>nginx chết, hoặc Docker/cái máy khởi động lại, thì dựng nó lên lại — trừ khi chính bạn đã dừng nó (Bài 2.5).</td></tr>
<tr><td><code>-p 127.0.0.1:18025:80</code></td><td>2 · mạng</td><td><code>IP-máy-chủ:cổng-máy-chủ:cổng-container</code>. Cổng 18025 trên loopback của bạn dẫn vào cổng 80 bên trong. Không ai khác trong mạng với tới được.</td></tr>
<tr><td><code>-v "\$PWD/web:/usr/share/nginx/html:ro"</code></td><td>3 · dữ liệu</td><td>Bind mount (gắn thư mục máy chủ): thư mục của bạn hiện ra đúng chỗ nginx tìm file, chỉ đọc. Sửa <code>index.html</code> trên Mac rồi tải lại trang — không phải dựng lại gì.</td></tr>
<tr><td><code>-e TZ=Asia/Ho_Chi_Minh</code></td><td>4 · cấu hình</td><td>Một biến môi trường. Biến này làm <code>date</code> và log bên trong hiện giờ Việt Nam — nếu ảnh có dữ liệu múi giờ (Bài 2.4).</td></tr>
<tr><td><code>--memory 256m</code></td><td>5 · giới hạn</td><td>Trần RAM cứng; vượt là nhân giết tiến trình (mã 137).</td></tr>
<tr><td><code>nginx:1.27-alpine</code></td><td>cái ảnh</td><td><code>tên:tag</code>. Ranh giới: Docker không đọc gì đứng sau nó.</td></tr>
<tr><td>(không có gì)</td><td>6 · câu lệnh</td><td>Không ghi câu lệnh nên ENTRYPOINT + CMD của chính ảnh chạy: <code>/docker-entrypoint.sh nginx -g 'daemon off;'</code>.</td></tr>
</table>
<div class="callout"><strong>Thứ tự giữa các cờ với nhau KHÔNG quan trọng</strong> — <code>--memory 256m -d --name web</code> là cùng một câu lệnh. Chỉ có hai vị trí quan trọng: cờ ở trước tên ảnh, câu lệnh ở sau nó. Và một cờ cần giá trị thì nó lấy chữ KẾ TIẾP: <code>-p -d 80</code> không phải là "publish rồi chạy nền".</div>
<div class="callout warn"><strong>Bạn cùng nhóm dùng Windows.</strong> <code>\$PWD</code> và dấu nối dòng <code>\\</code> là của bash/zsh. Trong PowerShell cùng câu lệnh đó viết <code>&#36;{PWD}</code> và một dấu backtick cuối mỗi dòng; trong Command Prompt là <code>%cd%</code> và <code>^</code>. Trong Git Bash, một đường dẫn như <code>/usr/share/nginx/html</code> có thể bị đổi thành <code>C:/Program Files/Git/usr/…</code> — hãy viết hai dấu gạch đầu (<code>//usr/share/…</code>) hoặc chạy từ WSL2. Khi "cùng một câu lệnh" chỉ hỏng trên máy một bạn, hãy kiểm cái shell trước.</div>

<div class="lz-map">
  <div class="lz-stage">Sáu nhóm cờ</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy như thế nào</span><span class="lz-nsub"><code>-d</code> · <code>-it</code> · <code>--rm</code> · <code>--name</code> · <code>--restart</code> · <code>--init</code> — tiền cảnh hay nền, tương tác hay không, và chuyện gì xảy ra khi nó dừng.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mạng</span><span class="lz-nsub"><code>-p</code> · <code>-P</code> · <code>--network</code> — cổng nào với tới nó và nó nhìn thấy được những container nào.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Dữ liệu</span><span class="lz-nsub"><code>-v</code> · <code>--mount</code> · <code>--tmpfs</code> — thứ gì sống lâu hơn container và thứ gì thì không.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cấu hình</span><span class="lz-nsub"><code>-e</code> · <code>--env-file</code> · <code>-w</code> · <code>-u</code> — môi trường, thư mục làm việc, và tiến trình là AI.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Giới hạn</span><span class="lz-nsub"><code>--memory</code> · <code>--cpus</code> · <code>--pids-limit</code> — nó được lấy bao nhiêu phần của cái máy trước khi nhân chặn nó lại.</span></div></div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ghi đè cái ảnh</span><span class="lz-nsub">một câu lệnh đứng cuối · <code>--entrypoint</code> — thay thế thứ mà ảnh bảo phải chạy.</span></div></div>
</div>
<h3>Nhóm 1 — chạy như thế nào</h3>
${slide('dk-02', 5, 'Bảng cờ (1/2): chạy · mạng · dữ liệu')}
<div class="kv-grid">
  <div class="kv"><span class="k">-d, --detach</span><span class="v">Đẩy xuống nền và in ra ID container. Không có nó thì bạn đang bị gắn vào: output của container chính là terminal của bạn, và Ctrl-C gửi tín hiệu cho container.</span></div>
  <div class="kv"><span class="k">-it</span><span class="v">Là HAI cờ: <code>-i</code> giữ stdin mở, <code>-t</code> cấp một TTY giả. Đi cùng nhau thì một shell tương tác hành xử bình thường. Bài 2.3 giải thích khi nào bạn chỉ muốn một trong hai.</span></div>
  <div class="kv"><span class="k">--rm</span><span class="v">Xoá container ngay khoảnh khắc nó thoát. Đúng cho mọi thứ tương tác hoặc chạy một lần; sai khi bạn còn sẽ cần log hay mã thoát của nó.</span></div>
  <div class="kv"><span class="k">--name</span><span class="v">Một cái tên ổn định thay cho <code>musing_hopper</code>. Bắt buộc với bất cứ thứ gì bạn sẽ nhắc lại, và phải duy nhất trên mỗi máy — kể cả so với container đã dừng.</span></div>
  <div class="kv"><span class="k">--restart</span><span class="v"><code>no</code> (mặc định), <code>on-failure[:n]</code>, <code>always</code>, <code>unless-stopped</code>. Bài 2.5 nói chọn cái nào; bản ngắn gọn là <code>unless-stopped</code> cho dịch vụ.</span></div>
  <div class="kv"><span class="k">--init</span><span class="v">Chèn <code>tini</code> làm PID 1 để chuyển tiếp tín hiệu và thu dọn tiến trình xác (Bài 1.3). Một khoản bảo hiểm rẻ cho bất cứ thứ gì có sinh tiến trình con.</span></div>
</div>

<h3>Nhóm 2 — mạng</h3>
${slide('dk-02', 7, '-p mở cho cả LAN — thêm 127.0.0.1: là chỉ mình bạn')}
<pre><code>docker run -d --name a -p 8080:80 nginx:1.27-alpine            <span class="tok-comment"># máy chủ:container</span>
docker run -d --name b -p 127.0.0.1:8081:80 nginx:1.27-alpine  <span class="tok-comment"># chỉ localhost</span>
docker run -d --name c -P nginx:1.27-alpine                    <span class="tok-comment"># cổng cao ngẫu nhiên</span>
docker port c</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:32768
80/tcp -&gt; [::]:32768</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-p 8080:80</span><span class="v">Publish cổng 80 của container thành cổng 8080 của máy chủ, trên <strong>MỌI</strong> giao diện của máy chủ. Trên một máy chủ công khai thì điều đó nghĩa là cả internet, bất kể <code>ufw</code> nói gì (Chương 8).</span></div>
  <div class="kv"><span class="k">-p 127.0.0.1:5432:5432</span><span class="v">Chỉ gắn vào loopback. Đây là dạng ĐÚNG cho một cơ sở dữ liệu nằm sau proxy hoặc chỉ với tới được qua đường hầm SSH, và là thói quen ngăn việc vô tình phơi PostgreSQL ra thế giới.</span></div>
  <div class="kv"><span class="k">--network mynet</span><span class="v">Gắn vào một mạng do người dùng định nghĩa để các container gọi nhau bằng TÊN. Gần như luôn là thứ bạn muốn, thay vì publish cổng giữa các dịch vụ của chính mình (Chương 8).</span></div>
  <div class="kv"><span class="k">--network host</span><span class="v">Hoàn toàn không có namespace mạng: container dùng thẳng giao diện của máy chủ. Nhanh, thỉnh thoảng cần thiết, và nó vứt đi cả sự cô lập lẫn việc ánh xạ cổng.</span></div>
</div>
<p><strong>Chạy thử từng bước — chứng minh ai với tới được cổng nào.</strong> <code>-p</code> không kèm địa chỉ thì nghe trên <code>0.0.0.0</code>, nghĩa là "MỌI card mạng của máy này", kể cả card Wi-Fi mà bạn cùng lớp với tới được. Thử với hai container và địa chỉ LAN của chính bạn (trên Mac: <code>ipconfig getifaddr en0</code>; trên Linux: <code>hostname -I</code>):</p>
<pre><code class="language-bash">docker run -d --name a -p 18020:80 nginx:1.27-alpine
docker run -d --name b -p 127.0.0.1:18021:80 nginx:1.27-alpine
docker port a; docker port b
IP=\$(ipconfig getifaddr en0)
curl -s -o /dev/null -w 'a qua LAN: %{http_code}\\n' \$IP:18020
curl -s -o /dev/null -w 'b qua LAN: %{http_code}\\n' \$IP:18021; echo "curl exit \$?"
docker rm -f a b</code></pre>
<div class="out">80/tcp -&gt; 0.0.0.0:18020
80/tcp -&gt; [::]:18020
80/tcp -&gt; 127.0.0.1:18021
a qua LAN: 200
b qua LAN: 000
curl exit 7</div>
<p>Output thật trên máy Mac của khoá. <code>000</code> kèm curl exit 7 nghĩa là "không kết nối được chút nào": <code>b</code> đơn giản là không nghe trên card LAN. Cả hai đều trả <code>200</code> ở <code>localhost</code>. Để ý thêm: <code>-P</code> trên Docker Desktop lần chạy của khoá chọn cổng <code>55000</code> chứ không phải <code>32768</code> như output ở trên — dải cổng ngẫu nhiên khác nhau theo nền tảng, và đó là lý do có lệnh <code>docker port</code>.</p>

<h3>Nhóm 3 — dữ liệu</h3>
<pre><code>docker volume create pgdata
docker run -d --name db -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=x postgres:16-alpine

docker run --rm -v "\$PWD:/work" -w /work alpine ls | head -3
docker run --rm --tmpfs /scratch:size=64m alpine df -h /scratch | tail -1</code></pre>
<div class="out">Dockerfile
index.html
package.json
tmpfs                    64.0M         0     64.0M   0% /scratch</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-v tên:/đường/dẫn</span><span class="v">Volume có tên — do Docker quản lý, sống sót qua <code>rm</code>. Cho cơ sở dữ liệu và mọi thứ có trạng thái (Chương 7).</span></div>
  <div class="kv"><span class="k">-v /đường/dẫn/máy/chủ:/đường/dẫn</span><span class="v">Bind mount — một thư mục máy chủ hiện ra bên trong. Thêm <code>:ro</code> để chỉ đọc, và bạn NÊN làm vậy với file cấu hình.</span></div>
  <div class="kv"><span class="k">--mount type=…</span><span class="v">Dạng dài dòng và tường minh: <code>--mount type=bind,source=…,target=…,readonly</code>. Gõ nhiều hơn, nhưng nó BÁO LỖI thay vì âm thầm tạo một thư mục rỗng khi bạn gõ sai đường dẫn nguồn.</span></div>
  <div class="kv"><span class="k">--tmpfs /đường/dẫn</span><span class="v">Chỗ nháp nằm trong bộ nhớ, không bao giờ chạm đĩa. Tốt cho file tạm, và cho dữ liệu nhạy cảm mà bạn không muốn nằm trong một tầng ảnh.</span></div>
</div>
<p><strong>Phép thử gõ nhầm, chạy thật.</strong> Khác biệt giữa <code>-v</code> và <code>--mount</code> dễ tin nhất khi nhìn tận mắt:</p>
<pre><code class="language-bash">docker run --rm -v "\$PWD/web:/work:ro" alpine sh -c 'echo x &gt; /work/a.txt'; echo "exit=\$?"
docker run --rm --mount type=bind,source="\$PWD/khong-co",target=/work alpine ls /work; echo "exit=\$?"
docker run --rm -v "\$PWD/khong-co:/work" alpine ls -la /work; echo "exit=\$?"
ls -ld khong-co</code></pre>
<div class="out">sh: can't create /work/a.txt: Read-only file system
exit=1
docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /host_mnt/…/khong-co
exit=125
total 4
drwxr-xr-x    2 root     root            64 Sep 23 14:01 .
drwxr-xr-x    1 root     root          4096 Sep 23 14:01 ..
exit=0
drwxr-xr-x  2 admin  wheel  64 Sep 23 21:01 khong-co</div>
<p>Đọc từng dòng: <code>:ro</code> đúng là chỉ đọc; <code>--mount</code> từ chối một đường dẫn không tồn tại (mã 125, trước khi có container nào được tạo); còn <code>-v</code> với cùng lỗi gõ đó thì "thành công", âm thầm tạo một thư mục rỗng <code>khong-co</code> trên máy bạn rồi gắn nó vào — nên ứng dụng khởi động với một thư mục rỗng và bạn đi gỡ nhầm chỗ. Trên Mac, thông báo lỗi còn lộ ra rằng Docker Desktop thấy file của bạn dưới <code>/host_mnt/…</code>: chúng được chia sẻ vào máy ảo Linux, và đó là lý do bind mount trên Mac và Windows chậm hơn trên Linux (Chương 7).</p>

<h3>Nhóm 4 — cấu hình</h3>
${slide('dk-02', 6, 'Bảng cờ (2/2): cấu hình · giới hạn · ghi đè ảnh')}
<pre><code>docker run --rm -e GREETING=hello -e NAME alpine env | grep -E '^(GREETING|NAME)='
printf 'DB_HOST=db\\nDB_PORT=5432\\n' &gt; app.env
docker run --rm --env-file app.env alpine env | grep DB_
docker run --rm -w /etc alpine pwd
docker run --rm -u 1000:1000 alpine id</code></pre>
<div class="out">GREETING=hello
NAME=cuong
DB_HOST=db
DB_PORT=5432
/etc
uid=1000 gid=1000 groups=1000</div>
<p><code>-e NAME</code> không kèm giá trị thì truyền xuyên qua biến CÙNG TÊN từ shell của bạn — tiện, và là một cái bẫy trong CI nơi biến đó có thể không tồn tại. Bài 2.4 nói về thứ tự ưu tiên, và vì sao biến môi trường là chỗ SAI để đặt bí mật thật.</p>

<h3>Nhóm 5 — giới hạn</h3>
<pre><code>docker run -d --name l --memory 256m --memory-swap 256m \\
  --cpus 0.5 --pids-limit 100 nginx:1.27-alpine
docker inspect l --format '{{.HostConfig.Memory}} {{.HostConfig.NanoCpus}} {{.HostConfig.PidsLimit}}'
docker stats --no-stream l --format '{{.Name}} {{.MemUsage}} {{.CPUPerc}}'</code></pre>
<div class="out">268435456 500000000 100
l 3.586MiB / 256MiB 0.00%</div>
<p>Hãy để ý <code>docker stats</code> giờ hiện <code>/ 256MiB</code> chứ không phải tổng RAM của máy chủ. Bên trong container, những công cụ biết đọc giới hạn cgroup — JVM hiện đại, cách Node tính vùng nhớ heap và <code>os.availableParallelism()</code> — sẽ tính kích thước vùng nhớ và số worker theo con số đó thay vì theo máy chủ, và đó là một phần lớn lý do đặt giới hạn vẫn quan trọng ngay cả trên một cái máy dư dả RAM. Không phải thứ gì cũng khôn như vậy: đo trên Docker 29 với <code>--cpus 1</code>, <code>os.cpu_count()</code> của Python và <code>os.cpus().length</code> của Node vẫn báo đủ 10 CPU của máy chủ (Bài 2.5 có số đo).</p>

<h3>Nhóm 6 — ghi đè cái ảnh</h3>
${slide('dk-02', 8, 'ENTRYPOINT + CMD = lệnh thật chạy; tham số chỉ thay CMD')}
<pre><code>docker image inspect nginx:1.27-alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'
docker run --rm nginx:1.27-alpine nginx -v                 <span class="tok-comment"># thay thế CMD</span>
docker run --rm --entrypoint sh nginx:1.27-alpine -c 'echo đã thay entrypoint'
docker run --rm --entrypoint "" nginx:1.27-alpine ls /docker-entrypoint.d</code></pre>
<div class="out">ENTRYPOINT=[/docker-entrypoint.sh] CMD=[nginx -g daemon off;]
nginx version: nginx/1.27.2
đã thay entrypoint
10-listen-on-ipv6-by-default.sh
15-local-resolvers.envsh
20-envsubst-on-templates.sh
30-tune-worker-processes.sh</div>
<div class="callout"><strong>Quan hệ là: câu lệnh cuối cùng = ENTRYPOINT + CMD.</strong> Những tham số đứng sau tên ảnh THAY THẾ <code>CMD</code> và được NỐI vào sau <code>ENTRYPOINT</code>. <code>--entrypoint</code> thay thế chính cái entrypoint, còn <code>--entrypoint ""</code> xoá trắng nó — đó là lối thoát khi script entrypoint của một ảnh chắn giữa bạn và cái shell bạn cần để gỡ lỗi. Chương 4 dựng chuyện này tử tế từ phía Dockerfile.</div>
<p><strong>Một chi tiết mà output ở trên giấu đi.</strong> Chạy lại hôm nay (nginx 1.27.5), <code>docker run --rm nginx:1.27-alpine nginx -v</code> in ra chín dòng của <code>/docker-entrypoint.sh</code> — "Looking for shell scripts in /docker-entrypoint.d/", "Configuration complete; ready for start up" — <em>TRƯỚC</em> dòng <code>nginx version: nginx/1.27.5</code>. Đó chính là cái luật đang chạy: <code>nginx -v</code> của bạn chỉ thay phần CMD, nên script entrypoint vẫn chạy trước rồi mới trao quyền cho nó. Ảnh chính thức dùng kiểu này rất nhiều. <code>node:22-alpine</code> còn cho bạn gõ mỗi cái cờ: <code>docker run --rm node:22-alpine -v</code> in <code>v22.23.2</code>, vì entrypoint của nó thấy tham số bắt đầu bằng <code>-</code> nên tự chèn <code>node</code> vào trước.</p>

<h3>Bảng cờ: cả bài này trên một trang</h3>
<p>Mọi cờ trong bài, kèm câu hỏi "thật ra khi nào tôi cần tới nó?". Hãy đánh dấu bảng này; đây là trang bạn quay lại mỗi khi một câu lệnh ai đó dán vào nhóm chat trông như một mớ chữ vô nghĩa.</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th><th>Khi nào dùng</th></tr>
<tr><td><code>-d</code></td><td>Chạy nền, in ID</td><td><code>docker run -d nginx:1.27-alpine</code></td><td>Mọi thứ chạy lâu: web server, cơ sở dữ liệu</td></tr>
<tr><td><code>-it</code></td><td>Giữ stdin mở + cấp một terminal</td><td><code>docker run -it alpine sh</code></td><td>Bạn sắp gõ vào bên trong</td></tr>
<tr><td><code>--rm</code></td><td>Xoá container khi nó thoát</td><td><code>docker run --rm alpine date</code></td><td>Lệnh chạy một lần; đừng dùng cho dịch vụ mà bạn có thể cần soi sau khi sập</td></tr>
<tr><td><code>--name</code></td><td>Tên ổn định, duy nhất</td><td><code>--name db</code></td><td>Bất cứ thứ gì bạn sẽ nhắc lại</td></tr>
<tr><td><code>--restart</code></td><td>Chính sách khởi động lại</td><td><code>--restart unless-stopped</code></td><td>Dịch vụ trên máy chủ (2.5)</td></tr>
<tr><td><code>--init</code></td><td>tini làm PID 1</td><td><code>--init node server.js</code></td><td>Ứng dụng không tự xử lý SIGTERM (1.3)</td></tr>
<tr><td><code>-p</code></td><td>Mở cổng máy chủ → cổng container</td><td><code>-p 127.0.0.1:5432:5432</code></td><td>Cần với tới nó từ máy chủ hay trình duyệt</td></tr>
<tr><td><code>-P</code></td><td>Mở mọi cổng EXPOSE ra cổng ngẫu nhiên</td><td><code>-P</code> rồi <code>docker port</code></td><td>Chỉ để thử nhanh rồi vứt</td></tr>
<tr><td><code>--network</code></td><td>Gắn vào một mạng</td><td><code>--network app</code></td><td>Container gọi nhau bằng tên (Ch. 8)</td></tr>
<tr><td><code>-v tên:/đường</code></td><td>Volume có tên</td><td><code>-v pgdata:/var/lib/postgresql/data</code></td><td>Dữ liệu phải sống qua <code>rm</code></td></tr>
<tr><td><code>-v /máy-chủ:/đường[:ro]</code></td><td>Bind mount</td><td><code>-v "\$PWD:/app"</code></td><td>Mã nguồn khi phát triển, file cấu hình</td></tr>
<tr><td><code>--mount</code></td><td>Gắn tường minh, báo lỗi khi gõ sai</td><td><code>--mount type=bind,source=…,target=…</code></td><td>Script và CI, nơi một thư mục rỗng âm thầm gây hại</td></tr>
<tr><td><code>--tmpfs</code></td><td>Thư mục nằm trong RAM</td><td><code>--tmpfs /tmp:size=64m</code></td><td>File nháp, không cần sống sót</td></tr>
<tr><td><code>-e</code> / <code>--env-file</code></td><td>Biến môi trường</td><td><code>-e NODE_ENV=production</code></td><td>Cấu hình khác nhau theo từng máy (2.4)</td></tr>
<tr><td><code>-w</code></td><td>Thư mục làm việc</td><td><code>-w /app</code></td><td>Chạy một công cụ trong thư mục dự án</td></tr>
<tr><td><code>-u</code></td><td>Chạy dưới UID:GID</td><td><code>-u "\$(id -u):\$(id -g)"</code></td><td>File ghi ra bind mount phải thuộc về bạn (2.4)</td></tr>
<tr><td><code>--memory</code> · <code>--cpus</code> · <code>--pids-limit</code></td><td>Trần tài nguyên</td><td><code>--memory 256m --cpus 0.5</code></td><td>Mọi dịch vụ trên một máy dùng chung (2.5)</td></tr>
<tr><td><code>--entrypoint</code></td><td>Thay ENTRYPOINT</td><td><code>--entrypoint ""</code></td><td>Script entrypoint chắn đường gỡ lỗi</td></tr>
<tr><td>sau tên ảnh</td><td>Thay CMD</td><td><code>nginx:1.27-alpine nginx -v</code></td><td>Chạy một chương trình khác trong cùng cái ảnh</td></tr>
</table>

<h3>Đọc ngược một container đang chạy thành câu lệnh</h3>
<pre><code>docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | head -3
docker inspect db --format '{{range \$p, \$v := .NetworkSettings.Ports}}{{\$p}} {{end}}'
docker inspect db --format '{{.HostConfig.RestartPolicy.Name}} {{.Config.Image}}'
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  nexdrew/rekcod db 2&gt;/dev/null | head -4</code></pre>
<div class="out">["POSTGRES_PASSWORD=x"
"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
"GOSU_VERSION=1.17"
5432/tcp
no postgres:16-alpine</div>
<p>Dựng lại được câu lệnh từ một container đang chạy là một kỹ năng vận hành có thật: nó trả lời "production đang chạy CHÍNH XÁC cái gì?" mà không phải tin vào một trang wiki. <code>docker inspect</code> với khuôn <code>--format</code> làm chuyện đó một cách chính xác; những công cụ như <code>rekcod</code> làm gần đúng nhưng tức thì. Một khi hệ thống có hơn hai container thì đây chính là thứ mà Compose thay thế (Chương 9).</p>
<div class="callout warn"><strong>Đính chính (kiểm lại tháng 9/2026).</strong> Bản trước của bài này kéo rekcod từ <code>ghcr.io/nexdrew/rekcod</code>; ảnh đó không tồn tại (<code>error from registry: denied</code>). Ảnh nằm trên Docker Hub với tên <code>nexdrew/rekcod</code>, và chỉ được dựng cho <code>linux/amd64</code> — trên Mac M1 nó vẫn chạy, qua giả lập, kèm một cảnh báo nền tảng. Trên Docker 29 nó in ra cho container <code>db</code> ở trên: <code>docker run --name db --runtime runc -v pgdata:/var/lib/postgresql/data --net bridge --restart no … -e 'POSTGRES_PASSWORD=x' … -d --entrypoint "docker-entrypoint.sh" postgres:16-alpine 'postgres'</code> — để ý nó liệt kê cả mọi biến mà CÁI ẢNH đặt, nên output dài hơn câu lệnh bạn thật sự đã gõ.</div>
<pre><code>docker rm -f a b c l db &gt;/dev/null; docker volume rm pgdata; rm -f app.env</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn để trang giới thiệu trong thư mục <code>web/</code>. Một bạn dán vào nhóm chat <code>docker run -d nginx:1.27-alpine -p 8080:80 -v web:/usr/share/nginx/html</code> rồi nói "nó in ra ID rồi, tức là chạy được — mà trình duyệt không mở được gì". Sửa nó, và chỉ phục vụ trang cho máy của chính bạn.</p><ol>
<li>Trong <code>~/thu-docker</code>, tạo <code>web/index.html</code> chứa <code>&lt;h1&gt;SWP391&lt;/h1&gt;</code>. Chạy câu lệnh của bạn kia, chỉ thêm <code>--name thu-sai</code> ngay sau <code>-d</code>. Xem <code>docker ps -a --filter name=thu-sai</code> và <code>docker logs thu-sai</code>, rồi giải thích <code>-p</code> với <code>-v</code> đã đi đâu.</li>
<li>Viết câu lệnh đúng: tên <code>thu-web</code>, publish trên <code>127.0.0.1:8080</code>, thư mục của bạn gắn chỉ đọc bằng đường dẫn tuyệt đối (<code>"\$PWD/web"</code>), <code>--memory 128m</code>.</li>
<li>Chứng minh: <code>curl -s localhost:8080</code> in ra tiêu đề của bạn; <code>docker port thu-web</code> hiện <code>127.0.0.1</code>; sửa <code>index.html</code> là trang đổi theo mà không cần khởi động lại.</li>
<li>Đọc ngược container: in chính sách restart, trần bộ nhớ và cổng bằng MỘT lệnh <code>docker inspect --format</code>.</li>
<li>Dọn dẹp: <code>docker rm -f thu-sai thu-web</code>.</li></ol>
<pre><code class="language-bash">docker inspect thu-web --format '{{.HostConfig.RestartPolicy.Name}} {{.HostConfig.Memory}} {{json .HostConfig.PortBindings}}'</code></pre>
<div class="out">no 134217728 {"80/tcp":[{"HostIp":"127.0.0.1","HostPort":"8080"}]}</div>
<p><strong>Đạt khi:</strong> bạn giải thích được kết quả của bạn kia — trên máy Mac của khoá nó hiện <code>Exited (2)</code> kèm dòng log <code>/docker-entrypoint.sh: exec: line 47: illegal option -p</code>: các "cờ" đã thành câu lệnh, entrypoint cố chạy <code>-p</code>, không cổng nào được mở và không gì được gắn — trang của bạn chỉ mở được ở localhost, và dòng inspect hiện <code>134217728</code> byte (= 128 MiB) cùng <code>127.0.0.1</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Flag / option (cờ / tuỳ chọn)</span><span class="v">Chữ bắt đầu bằng <code>-</code> hoặc <code>--</code> dùng để cấu hình câu lệnh. Với <code>docker run</code> chúng phải đứng trước tên ảnh.</span></div>
  <div class="kv"><span class="k">Image reference (tên:tag của ảnh)</span><span class="v"><code>nginx:1.27-alpine</code> — ảnh nào, phiên bản nào. Là ranh giới giữa cờ của Docker và câu lệnh của container.</span></div>
  <div class="kv"><span class="k">Publish (mở cổng ra ngoài)</span><span class="v">Cho một cổng của container với tới được qua một cổng máy chủ, bằng <code>-p máy-chủ:container</code>.</span></div>
  <div class="kv"><span class="k">Loopback (vòng lặp nội bộ, 127.0.0.1)</span><span class="v">Địa chỉ mà chỉ chính cái máy đó với tới được. <code>-p 127.0.0.1:…</code> giữ một cổng ở chế độ riêng tư.</span></div>
  <div class="kv"><span class="k">Bind mount (gắn thư mục máy chủ)</span><span class="v">Một thư mục của máy chủ hiện ra bên trong container. <code>:ro</code> làm nó chỉ đọc.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT / CMD (điểm vào / lệnh mặc định)</span><span class="v">Hai nửa của câu lệnh mà một ảnh chạy. Tham số sau tên ảnh chỉ thay CMD.</span></div>
  <div class="kv"><span class="k">Detached (chạy nền, -d)</span><span class="v">Chạy ngầm; terminal của bạn rảnh tay và output đi vào <code>docker logs</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hình hài: <code>docker run [CỜ] ẢNH [CÂU LỆNH] [THAM SỐ]</code> — cờ trước tên ảnh, câu lệnh sau nó.</li>
<li>Một cờ đặt sau tên ảnh sẽ thành tên chương trình hay tham số: <code>alpine -it</code> → mã 127, container kẹt ở <code>Created</code>.</li>
<li><code>-p 8080:80</code> nghe trên mọi card mạng; <code>-p 127.0.0.1:8080:80</code> chỉ trên máy bạn.</li>
<li><code>-v</code> với đường dẫn sai âm thầm tạo một thư mục rỗng; <code>--mount</code> thì từ chối — dùng nó trong script.</li>
<li>Tiến trình chạy = ENTRYPOINT + CMD; tham số của bạn thay CMD, <code>--entrypoint</code> thay nửa đầu.</li>
<li><code>docker inspect --format</code> biến một container đang chạy trở lại thành các dữ kiện của câu lệnh đã tạo ra nó.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">docker run — tài liệu tra cứu đầy đủ</span><span class="lc-sub">Mọi tuỳ chọn, có nhóm. Đáng đọc chậm một lần bây giờ và tra cứu về sau: phần lớn những cờ bạn chưa từng dùng đều giải một bài toán bạn chưa gặp.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/containers/run/" target="_blank" rel="noopener">
  <span class="lc-ico">🏃</span>
  <span class="lc-body"><span class="lc-title">Chạy container — hướng dẫn khái niệm</span><span class="lc-sub">Bản kể chuyện: các cờ tương tác với nhau ra sao, mặc định là gì, và cái bảng ENTRYPOINT/CMD mà rồi ai cũng đánh dấu trang.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tự dựng câu lệnh</span><span class="lc-sub">Bài chấm điểm: publish một cổng chỉ vào loopback, ghi đè entrypoint để lấy một cái shell, truyền một file env, và dựng lại một lệnh <code>docker run</code> từ output của <code>docker inspect</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>-p 5432:5432</code> trên một máy chủ công khai. Docker ghi luật cổng của nó thẳng vào chuỗi iptables <code>DOCKER</code>, và chuỗi đó được tra <em>TRƯỚC</em> luật của ufw — nên cơ sở dữ liệu của bạn nằm trên internet công cộng trong khi <code>ufw status</code> chẳng hiện gì bất thường và còn báo cổng đó là bị chặn. Đây không phải một con bọ; đây là Docker làm chính xác thứ bạn yêu cầu. Cách chữa là gắn tường minh: <code>-p 127.0.0.1:5432:5432</code>. Hãy soát bất cứ cái máy nào bằng <code>sudo ss -tlnp | grep -v 127.0.0.1</code> và kiểm rằng mọi dòng đều là thứ bạn CÓ Ý phơi ra.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Cờ đứng trước tên ảnh và mọi thứ sau nó thuộc về container — riêng cái luật đó giải thích phần lớn sự bối rối kiểu "cờ của tôi bị bỏ qua". <code>-p</code> là <code>máy chủ:container</code>, và không có tiền tố <code>127.0.0.1:</code> tường minh thì bạn đang publish ra MỌI giao diện, có tường lửa hay không cũng vậy. Và <code>--entrypoint ""</code> là lối thoát để lấy một cái shell trong một ảnh mà entrypoint đang chắn đường.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Observing a running container|||2.2 — Quan sát một container đang chạy',
      slug: 'dk-2-2-quan-sat',
      type: 'LESSON',
      description: 'docker logs và chỗ log thật sự nằm, vì sao stdout là bản hợp đồng, inspect với khuôn Go, stats, top, port, diff, và một cuộc quét "cái container này đang làm gì".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Observing a running container</h2>
<p class="lead">A container is opaque by default: no SSH, no <code>/var/log</code> you would think to read, no process list you can see from the host without asking. Docker gives you five commands that make it transparent, and knowing which one answers which question turns most debugging into a thirty-second job.</p>

<h3>Six questions, six commands</h3>
${slide('dk-02', 9, 'Sáu câu hỏi khi container có vấn đề — mỗi câu một lệnh')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">What did it SAY?</span><span class="lz-t">docker logs --since 10m --tail 50 -f</span><span class="lz-d">The first command, every time. Bound it to a window; a bare <code>docker logs</code> on a busy container is a mistake you make once.</span></div>
  <div class="lz-step"><span class="lz-k">What IS it?</span><span class="lz-t">docker inspect --format</span><span class="lz-d">Configuration, environment, mounts, exit code, OOM flag, restart count, health. Everything Docker knows, in one queryable document.</span></div>
  <div class="lz-step"><span class="lz-k">What is it USING?</span><span class="lz-t">docker stats --no-stream</span><span class="lz-d">CPU, memory against its limit, network and PID counts. The fastest way to spot the container eating the machine.</span></div>
  <div class="lz-step"><span class="lz-k">What is it RUNNING?</span><span class="lz-t">docker top</span><span class="lz-d">The process list with host PIDs, without needing a shell inside — which matters for minimal images.</span></div>
  <div class="lz-step"><span class="lz-k">What has it CHANGED?</span><span class="lz-t">docker diff</span><span class="lz-d">Every file added, changed or deleted in the writable layer. Finds state that should have been on a volume.</span></div>
  <div class="lz-step"><span class="lz-k">What HAPPENED?</span><span class="lz-t">docker events --since 1h</span><span class="lz-d">The daemon's own record: creates, starts, dies, OOM kills, health status changes. The answer to "what went on while I was asleep?".</span></div>
</div>
<h3>docker logs, and where the logs actually are</h3>
${slide('dk-02', 10, 'docker logs = stdout + stderr của PID 1, cất trong file JSON')}
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
curl -s localhost:8080 &gt;/dev/null; curl -s localhost:8080/missing &gt;/dev/null

docker logs web                      <span class="tok-comment"># everything so far</span>
docker logs -f --tail 20 web         <span class="tok-comment"># follow, starting from the last 20 lines</span>
docker logs --since 5m -t web        <span class="tok-comment"># last 5 minutes, with timestamps</span>
docker logs --since 2026-08-22T21:00 --until 2026-08-22T21:05 web</code></pre>
<div class="out">2026-08-22T21:31:04.118Z 172.17.0.1 - - [22/Aug/2026:21:31:04 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.5.0"
2026-08-22T21:31:04.402Z 2026/08/22 21:31:04 [error] 31#31: *2 open() "/usr/share/nginx/html/missing" failed (2: No such file or directory)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--tail N</span><span class="v">Only the last N lines. Essential on a container with a million log lines, where a bare <code>docker logs</code> will fill your terminal and take a while doing it.</span></div>
  <div class="kv"><span class="k">--since / --until</span><span class="v">Accepts durations (<code>10m</code>, <code>1h</code>) or RFC3339 timestamps. This is how you bound a search to an incident window instead of reading from the beginning.</span></div>
  <div class="kv"><span class="k">-t, --timestamps</span><span class="v">Prepends the time Docker received each line. Note this can differ from the app's own timestamp, which is what you want when comparing containers.</span></div>
  <div class="kv"><span class="k">-f, --follow</span><span class="v">Live tail. Combine with <code>--tail 0</code> to see only what happens from now on — much clearer when reproducing a bug.</span></div>
  <div class="kv"><span class="k">2&gt;/dev/null or 1&gt;/dev/null</span><span class="v"><code>docker logs</code> writes the container's stdout to your stdout and its stderr to your stderr, so you can separate them: <code>docker logs web 2&gt;/dev/null</code> shows only stdout.</span></div>
</div>
<pre><code>CID=\$(docker inspect -f '{{.Id}}' web)
sudo ls -lh /var/lib/docker/containers/\$CID/\$CID-json.log
sudo head -c 220 /var/lib/docker/containers/\$CID/\$CID-json.log</code></pre>
<div class="out">-rw-r----- 1 root root 1.4K Aug 22 21:31 /var/lib/docker/containers/8c40e93b…/8c40e93b…-json.log
{"log":"172.17.0.1 - - [22/Aug/2026:21:31:04 +0000] \\"GET / HTTP/1.1\\" 200 615 \\"-\\" \\"curl/8.5.0\\"\\n","stream":"stdout","time":"2026-08-22T21:31:04.118Z"}</div>
<div class="callout warn"><strong>By default this file grows forever.</strong> The <code>json-file</code> driver has no size limit unless you set one, and a chatty application will quietly fill <code>/var/lib/docker</code> until the disk is full and the database on the same machine stops being able to write. Fix it globally in <code>/etc/docker/daemon.json</code> with <code>"log-opts": {"max-size": "10m", "max-file": "3"}</code>, which applies to every new container. Chapter 11 covers the log drivers properly; setting the rotation is the one thing worth doing today.</div>
<p><strong>Run it step by step on Docker 29 — and where that file is on YOUR machine.</strong> The output above is from an older run on Ubuntu. Here is the same idea re-run on the course machines, one question at a time:</p>
<pre><code class="language-bash">docker run -d --name web -p 18022:80 nginx:1.27-alpine
curl -s localhost:18022 &gt;/dev/null; curl -s localhost:18022/missing &gt;/dev/null
docker logs web 2&gt;/dev/null | tail -1        <span class="tok-comment"># only what nginx wrote to STDOUT (the access log)</span>
docker logs web 2&gt;&amp;1 &gt;/dev/null | tail -1   <span class="tok-comment"># only STDERR (the error log)</span>
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.LogPath}}' web</code></pre>
<div class="out">192.168.65.1 - - [23/Sep/2026:14:03:41 +0000] "GET /missing HTTP/1.1" 404 153 "-" "curl/8.7.1" "-"
2026/09/23 14:03:41 [error] 33#33: *2 open() "/usr/share/nginx/html/missing" failed (2: No such file or directory), client: 192.168.65.1, server: localhost, request: "GET /missing HTTP/1.1", host: "localhost:18022"
json-file /var/lib/docker/containers/3dd1928cd0ec…/3dd1928cd0ec…-json.log</div>
<p>Two things to read here. The client address is <code>192.168.65.1</code>, not your Mac's address — on Docker Desktop your request enters through the Linux VM's network. And <code>2&gt;&amp;1 &gt;/dev/null</code> looks backwards but is right: first point stderr at where stdout currently goes (your terminal), then throw stdout away. On a Mac that <code>LogPath</code> lives <em>inside</em> Docker Desktop's VM, so you cannot <code>ls</code> it from macOS at all; <code>docker logs</code> is the only door. On a Linux server without sudo, you can still read the raw file through a throwaway container (read-only):</p>
<pre><code class="language-bash">CID=\$(docker inspect -f '{{.Id}}' web)
docker run --rm -v /var/lib/docker/containers/\$CID:/c:ro alpine \\
  sh -c "ls -lh /c/*-json.log; tail -1 /c/\$CID-json.log"</code></pre>
<div class="out">-rw-r-----    1 root     root        3.8K Sep 23 14:16 /c/84b8186524f1…-json.log
{"log":"172.17.0.1 - - [23/Sep/2026:14:16:32 +0000] \\"GET / HTTP/1.1\\" 200 615 \\"-\\" \\"curl/8.18.0\\" \\"-\\"\\n","stream":"stdout","time":"2026-09-23T14:16:32.660289774Z"}</div>
<p>Real output from the course's Linux machine (Docker 29.6). One JSON object per line: the text, which stream it came from, and the time Docker received it — exactly what <code>-t</code> prints.</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th><th>When to use it</th></tr>
<tr><td><code>--tail N</code></td><td>Only the last N lines</td><td><code>docker logs --tail 50 api</code></td><td>Always, on anything that has run for a while</td></tr>
<tr><td><code>-f</code></td><td>Follow live (Ctrl-C stops <em>watching</em>, not the app)</td><td><code>docker logs -f --tail 0 api</code></td><td>Reproducing a bug: see only what happens from now</td></tr>
<tr><td><code>--since</code> / <code>--until</code></td><td>Time window: <code>10m</code>, <code>1h</code> or a timestamp</td><td><code>--since 2026-09-23T14:00 --until 2026-09-23T14:10</code></td><td>"The site died at 21:05" — read only that window</td></tr>
<tr><td><code>-t</code></td><td>Prefix Docker's receive time (UTC)</td><td><code>docker logs -t web</code></td><td>Comparing timelines across containers</td></tr>
<tr><td><code>2&gt;/dev/null</code></td><td>Keep stdout only</td><td><code>docker logs web 2&gt;/dev/null</code></td><td>Access logs without the error noise</td></tr>
<tr><td><code>2&gt;&amp;1 &gt;/dev/null</code></td><td>Keep stderr only</td><td><code>docker logs web 2&gt;&amp;1 &gt;/dev/null</code></td><td>Errors only</td></tr>
<tr><td><code>2&gt;&amp;1 | grep</code></td><td>Search both streams</td><td><code>docker logs api 2&gt;&amp;1 | grep -i error</code></td><td>grep alone only sees stdout — the classic "grep finds nothing" trap</td></tr>
</table>

<h3>stdout is the contract</h3>
${slide('dk-02', 11, 'File log và bộ đệm làm docker logs trống trơn')}
<pre><code>docker run -d --name filelog alpine sh -c \\
  'while true; do echo "to a file" &gt;&gt; /var/log/app.log; sleep 2; done'
docker logs filelog                     <span class="tok-comment"># nothing — it never wrote to stdout</span>
docker exec filelog tail -2 /var/log/app.log</code></pre>
<div class="out">to a file
to a file</div>
<p>An application that writes to a log file inside the container is invisible to <code>docker logs</code>, to your log aggregator, and to everything Chapter 11 sets up — and its output dies with the container. <strong>Containerised applications log to stdout and stderr.</strong> If a framework insists on a file path, the standard trick is to point it at <code>/dev/stdout</code>; that is exactly what the official nginx image does.</p>
<pre><code>docker exec web ls -l /var/log/nginx/</code></pre>
<div class="out">lrwxrwxrwx 1 root root 11 Aug  1 12:04 access.log -&gt; /dev/stdout
lrwxrwxrwx 1 root root 11 Aug  1 12:04 error.log -&gt; /dev/stderr</div>
<p><strong>The other way to get an empty <code>docker logs</code>: buffering, measured.</strong> The same tiny Python loop, once as-is and once with <code>PYTHONUNBUFFERED=1</code>, counted after four seconds:</p>
<pre><code class="language-bash">docker run -d --name py1 python:3.12-alpine python -c 'import time
while True: print("tick"); time.sleep(1)'
docker run -d --name py2 -e PYTHONUNBUFFERED=1 python:3.12-alpine python -c 'import time
while True: print("tick"); time.sleep(1)'
sleep 4; echo "py1: \$(docker logs py1 2&gt;&amp;1 | wc -l) lines"; echo "py2: \$(docker logs py2 2&gt;&amp;1 | wc -l) lines"
docker rm -f py1 py2</code></pre>
<div class="out">py1:        0 lines
py2:        5 lines</div>
<p>Same code, same seconds. <code>py1</code> is not stuck — its lines are sitting in a 8 KB buffer because stdout is a pipe to Docker, not a terminal. Add <code>ENV PYTHONUNBUFFERED=1</code> to every Python Dockerfile and this whole class of "the app is hanging" false alarms disappears.</p>

<h3>docker inspect: everything, in JSON</h3>
${slide('dk-02', 12, 'docker inspect: một dòng phân loại mọi container')}
<pre><code>docker inspect web | head -12
docker inspect web --format '{{.State.Status}} · pid {{.State.Pid}} · started {{.State.StartedAt}}'
docker inspect web --format '{{range \$n, \$c := .NetworkSettings.Networks}}{{\$n}} {{\$c.IPAddress}}{{end}}'
docker inspect web --format '{{range .Mounts}}{{.Type}} {{.Source}} -&gt; {{.Destination}}{{"\\n"}}{{end}}'
docker inspect web --format '{{json .Config.Env}}' | tr ',' '\\n' | head -2</code></pre>
<div class="out">running · pid 40122 · started 2026-08-22T21:30:58.412Z
bridge 172.17.0.2
["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
"NGINX_VERSION=1.27.2"]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--format uses Go templates</span><span class="v">Not jq syntax. <code>{{.State.Status}}</code>, <code>{{range …}}</code>, <code>{{json …}}</code>, <code>{{printf}}</code>. The field names match the JSON exactly, so <code>docker inspect</code> with no format is how you discover what to ask for.</span></div>
  <div class="kv"><span class="k">Or pipe to jq</span><span class="v"><code>docker inspect web | jq '.[0].State'</code> — note the array: inspect always returns a list, even for one container. This is the most common jq mistake here.</span></div>
  <div class="kv"><span class="k">It works on images and volumes too</span><span class="v"><code>docker inspect nginx:1.27-alpine</code>, <code>docker volume inspect pgdata</code>, <code>docker network inspect bridge</code>. Same command, same template syntax.</span></div>
  <div class="kv"><span class="k">The fields worth memorising</span><span class="v"><code>.State.ExitCode</code>, <code>.State.OOMKilled</code>, <code>.State.Health.Status</code>, <code>.RestartCount</code>, <code>.Config.Env</code>, <code>.Mounts</code>, <code>.HostConfig.Memory</code>, <code>.NetworkSettings.Networks</code>. Between them they answer most incident questions.</span></div>
</div>
<pre><code><span class="tok-comment"># A one-line health summary across every container</span>
docker inspect \$(docker ps -aq) --format \\
  '{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'</code></pre>
<div class="out">/web running exit=0 oom=false restarts=0
/filelog running exit=0 oom=false restarts=0
/api exited exit=137 oom=true restarts=4</div>
<p>Three containers, and the third one has already told you its whole story: it was OOM-killed four times. That single command is the fastest triage tool in this course.</p>
<div class="callout warn"><strong>Correction for Docker 29.</strong> Earlier versions of this lesson — and countless blog posts — read the IP with <code>{{.NetworkSettings.IPAddress}}</code>. On Docker 29 that field is gone and the template fails: <code>template parsing error: … map has no entry for key "IPAddress"</code>. A container can sit on several networks, so the address lives per network under <code>.NetworkSettings.Networks</code>; the <code>range</code> form above prints <code>bridge 172.17.0.5</code> on the course Mac. When a <code>--format</code> you copied fails, run <code>docker inspect</code> without a format and look for the field's new home.</div>
<p><strong>Reading the triage line on a real crash loop.</strong> On the course Mac we started a container that allocates 200 MB under a 128 MB ceiling with <code>--restart on-failure:4</code>, and let it fail on its own:</p>
<pre><code class="language-bash">docker inspect \$(docker ps -aq --filter name=api) --format \\
  '{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'
docker events --since 40s --until 0s --filter container=api --format '{{.Action}}' | head -7</code></pre>
<div class="out">/api exited exit=137 oom=true restarts=4
create
start
oom
die
start
oom
die</div>
<p>Read left to right: <code>exited</code> (it is not coming back), <code>137</code> (SIGKILL), <code>oom=true</code> (the memory limit did it, not a person), <code>restarts=4</code> (the policy gave up after four tries). <code>docker events</code> tells the same story as a timeline. And <code>docker logs api</code> was empty — <code>dd</code> was killed before it printed anything, which is why the logs are the first place to look but never the only one.</p>

<h3>stats, top, port, diff</h3>
${slide('dk-02', 13, 'stats · top · port · diff: đọc output từng cột')}
<pre><code>docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.NetIO}}\\t{{.PIDs}}'
docker top web -o pid,user,args
docker port web
docker diff web | head -4</code></pre>
<div class="out">NAME      CPU %     MEM USAGE / LIMIT     NET I/O       PIDS
web       0.00%     3.629MiB / 15.46GiB   2.14kB/1.8kB  3
filelog   0.02%     1.398MiB / 15.46GiB   1.02kB/0B     2

PID     USER   COMMAND
40122   root   nginx: master process nginx -g daemon off;
40180   nginx  nginx: worker process

80/tcp -&gt; 0.0.0.0:8080
C /var
C /var/cache/nginx</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker stats</span><span class="v">Live CPU, memory, network and PID counts. <code>--no-stream</code> for one snapshot in a script. If <code>MEM USAGE / LIMIT</code> shows the host's total RAM, that container has no memory limit — which Chapter 11 argues it should.</span></div>
  <div class="kv"><span class="k">docker top</span><span class="v">The container's processes, shown with <em>host</em> PIDs. Accepts <code>ps</code> options. Useful when you want the process list without an <code>exec</code>, which matters for images with no shell.</span></div>
  <div class="kv"><span class="k">docker port</span><span class="v">What is published where. The quick answer to "which host port did <code>-P</code> pick?" and to "is this port published at all?".</span></div>
  <div class="kv"><span class="k">docker diff</span><span class="v">What has changed in the writable layer since the container started: <code>A</code>dded, <code>C</code>hanged, <code>D</code>eleted. Surprisingly good at finding a process writing where it should not, and at spotting state that ought to be on a volume.</span></div>
</div>
<p><strong>Reading the output column by column (Docker 29, course Mac).</strong></p>
<pre><code class="language-bash">docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.PIDs}}' web l
docker top web -o pid,user,args | head -3</code></pre>
<div class="out">NAME      CPU %     MEM USAGE / LIMIT     PIDS
web       0.00%     9.699MiB / 7.748GiB   11
l         0.00%     8.422MiB / 256MiB     11
PID                 USER                COMMAND
20449               root                nginx: master process nginx -g daemon off;
20492               statd               nginx: worker process</div>
<table>
<tr><th>What you see</th><th>What it means</th></tr>
<tr><td><code>9.699MiB / 7.748GiB</code></td><td>Used / limit. The limit is the whole Docker Desktop VM (the Mac has 32 GB, the VM gets 7.7 GiB) — i.e. <strong>no</strong> <code>--memory</code> on this container.</td></tr>
<tr><td><code>8.422MiB / 256MiB</code></td><td>The container <code>l</code> from Lesson 2.1, started with <code>--memory 256m</code>.</td></tr>
<tr><td><code>PIDS 11</code></td><td>One nginx master + 10 workers: <code>worker_processes auto</code> saw the VM's 10 CPUs.</td></tr>
<tr><td><code>CPU %</code></td><td>Percent of ONE core; a busy two-threaded app can show 200%.</td></tr>
<tr><td><code>USER statd</code></td><td>The worker runs as UID 101 (the <code>nginx</code> user inside the image). <code>docker top</code> looks the number up in the <em>host's</em> <code>/etc/passwd</code>, where 101 happens to be <code>statd</code>. Same process, different name book — believe the number, not the name.</td></tr>
<tr><td><code>PID 20449</code></td><td>Host PIDs (in Docker Desktop's VM). Inside the container the master is PID 1.</td></tr>
</table>

<h3>A thirty-second sweep</h3>
${slide('dk-02', 14, 'Cuộc quét 30 giây — và bẫy: hai --filter khác loại là “VÀ”')}
<pre><code>{
  echo "=== running ==="; docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'
  echo "=== exited ==="; docker ps -a --filter 'status=exited' --format '{{.Names}} {{.Status}}'
  echo "=== unhealthy ==="; docker ps --filter 'health=unhealthy' --format '{{.Names}} {{.Status}}'
  echo "=== restarts and OOM ==="; docker inspect \$(docker ps -aq) \\
      --format '{{.Name}} restarts={{.RestartCount}} oom={{.State.OOMKilled}}' | grep -v 'restarts=0 oom=false'
  echo "=== resources ==="; docker stats --no-stream --format '{{.Name}} {{.CPUPerc}} {{.MemPerc}}'
  echo "=== disk ==="; docker system df
  echo "=== recent errors ==="; for c in \$(docker ps --format '{{.Names}}'); do
      docker logs --since 15m "\$c" 2&gt;&amp;1 | grep -iE 'error|fatal|panic' | tail -3 | sed "s/^/\$c: /"
    done
}</code></pre>
<div class="out">=== running ===
NAMES     STATUS                    PORTS
web       Up 6 minutes              0.0.0.0:8080-&gt;80/tcp
filelog   Up 5 minutes
=== restarts and OOM ===
/api restarts=4 oom=true
=== recent errors ===
web: 2026/08/22 21:31:04 [error] 31#31: *2 open() "/usr/share/nginx/html/missing" failed</div>
<p>Save that as a shell function. It is the container equivalent of the sixty-second sweep from the Linux course, and running it before you form an opinion saves a great deal of guessing.</p>
<div class="callout warn"><strong>Correction: two different <code>--filter</code> keys are AND, not OR.</strong> An earlier version of this sweep had one line <code>docker ps -a --filter 'status=exited' --filter 'health=unhealthy'</code> labelled "unhealthy or exited". Run on the course Mac with one exited and one unhealthy container, it printed <strong>nothing</strong>: Docker combines filters of different keys with AND, and no container is exited AND unhealthy at the same time. Repeating the SAME key is OR (<code>--filter name=web --filter name=db</code> lists both). That is why the sweep above now uses two lines. A check that silently prints nothing is worse than no check.</div>
<pre><code class="language-bash">docker ps -a --filter status=exited --filter health=unhealthy --format '{{.Names}}'   <span class="tok-comment"># AND</span>
docker ps -a --filter health=unhealthy --format '{{.Names}}'
docker ps -a --filter status=exited --format '{{.Names}}'</code></pre>
<div class="out">hc
api</div>
<pre><code>docker rm -f web filelog &gt;/dev/null</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> ten minutes before your SWP391 demo the API container "keeps dying" and <code>docker logs</code> shows nothing. You have five minutes to say WHY, with evidence, before anyone touches the code.</p><ol>
<li>Recreate the incident in <code>~/thu-docker</code>: <code>docker run -d --name thu-api --memory 64m --memory-swap 64m --restart on-failure:3 alpine sh -c 'sleep 1; dd if=/dev/zero of=/dev/null bs=100M count=1'</code>. Wait 20 seconds.</li>
<li>First question, "what did it say?": <code>docker logs thu-api</code>. Note that it is empty and say why.</li>
<li>Second, "what is it?": the one-line triage with <code>docker inspect --format</code> from this lesson.</li>
<li>Third, "what happened?": <code>docker events --since 1m --until 0s --filter container=thu-api --format '{{.Action}}'</code>.</li>
<li>Write the one-sentence diagnosis you would post to the team chat, then <code>docker rm -f thu-api</code>.</li></ol>
<div class="out">/thu-api exited exit=137 oom=true restarts=3</div>
<p><strong>Done when:</strong> your triage line matches the one above, your events list shows <code>oom</code> before each <code>die</code>, and your diagnosis names the memory limit (not "the code crashed") and explains the empty logs.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stdout / stderr</span><span class="v">The two output streams of a process: normal output and error output. Docker stores both and <code>docker logs</code> returns both.</span></div>
  <div class="kv"><span class="k">Log driver</span><span class="v">Where Docker sends container output. Default <code>json-file</code>: a file per container, unlimited unless you set rotation.</span></div>
  <div class="kv"><span class="k">Go template (--format)</span><span class="v">The <code>{{.Field}}</code> language used by <code>--format</code> to pick fields out of Docker's JSON.</span></div>
  <div class="kv"><span class="k">Buffering</span><span class="v">A program holding output in memory before writing it; makes logs look empty or late.</span></div>
  <div class="kv"><span class="k">Triage</span><span class="v">Sorting problems quickly by severity and cause before fixing anything.</span></div>
  <div class="kv"><span class="k">Event (docker events)</span><span class="v">A record the daemon writes for each lifecycle step: create, start, oom, die, health_status…</span></div>
  <div class="kv"><span class="k">Filter (--filter)</span><span class="v">A condition on <code>docker ps</code>/<code>events</code>. Different keys = AND; same key repeated = OR.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Six questions, six commands: logs, inspect, stats, top, diff, events — ask them in that order.</li>
<li><code>docker logs</code> is PID 1's stdout and stderr; bound it with <code>--tail</code>/<code>--since</code> and remember <code>2&gt;&amp;1</code> before grep.</li>
<li>Empty logs mean a log file inside the container, a buffered runtime, or a process killed before it printed.</li>
<li>One <code>inspect --format</code> line (status, exit, oom, restarts) diagnoses most crashes; on Docker 29 read IPs from <code>.NetworkSettings.Networks</code>.</li>
<li><code>stats</code> shows "no limit" as the host/VM total; <code>top</code> shows host PIDs and host user names.</li>
<li>Different <code>--filter</code> keys are AND — a sweep line that combines them may silently print nothing.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/logs/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">docker logs — reference</span><span class="lc-sub">All the time filters, and the important note that it only works with the <code>json-file</code>, <code>local</code> and <code>journald</code> drivers — send logs elsewhere and this command stops working.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/cli/formatting/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Formatting Docker command output</span><span class="lc-sub">The Go template syntax used by every <code>--format</code> flag, with the <code>table</code>, <code>json</code> and <code>range</code> helpers. Learn this once and every Docker command becomes scriptable.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/logging/configure/" target="_blank" rel="noopener">
  <span class="lc-ico">🚰</span>
  <span class="lc-body"><span class="lc-title">Configure logging drivers</span><span class="lc-sub">json-file, local, journald, syslog and the cloud drivers, with the rotation options. Read the <code>max-size</code>/<code>max-file</code> section today, before a log file fills a disk.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: make a container transparent</span><span class="lc-sub">Graded exercises: bound a log search to a five-minute window, extract the exit code and OOM flag with a template, find a process writing outside a volume with <code>docker diff</code>, and explain why one container's logs are empty.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> a buffered runtime making <code>docker logs</code> look empty or frozen. Python buffers stdout when it is not a TTY, so <code>print()</code> output can sit in a buffer for minutes — or forever, if the process is killed — and you conclude the application is hung when it is working fine. The fixes are per-runtime and all one line: <code>ENV PYTHONUNBUFFERED=1</code> (or <code>python -u</code>), <code>stdbuf -oL</code> for arbitrary programs, and for Node nothing is needed because <code>console.log</code> to a pipe is already flushed per write. If a container is "silent", suspect buffering before you suspect the code.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Containerised applications log to <strong>stdout and stderr</strong> — a log file inside the container is invisible to every tool and dies with it. <code>docker inspect --format</code> over all containers gives you status, exit code, OOM flag and restart count in one line, which is the fastest triage there is. And the default <code>json-file</code> driver has no size limit until you set one, so put <code>max-size</code> in <code>daemon.json</code> before a log file fills the disk.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Quan sát một container đang chạy</h2>
<p class="lead">Container mặc định là một cái hộp đục: không SSH, không có <code>/var/log</code> nào mà bạn nghĩ tới chuyện đọc, không có danh sách tiến trình nào nhìn thấy từ máy chủ nếu không hỏi. Docker cho bạn NĂM câu lệnh biến nó thành trong suốt, và biết cái nào trả lời câu hỏi nào là biến phần lớn việc gỡ lỗi thành một việc ba mươi giây.</p>

<h3>Sáu câu hỏi, sáu câu lệnh</h3>
${slide('dk-02', 9, 'Sáu câu hỏi khi container có vấn đề — mỗi câu một lệnh')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó đã NÓI gì?</span><span class="lz-t">docker logs --since 10m --tail 50 -f</span><span class="lz-d">Câu lệnh đầu tiên, lần nào cũng vậy. Hãy khoanh nó vào một khung thời gian; một lệnh <code>docker logs</code> trần trên một container bận rộn là sai lầm bạn chỉ phạm một lần.</span></div>
  <div class="lz-step"><span class="lz-k">Nó LÀ gì?</span><span class="lz-t">docker inspect --format</span><span class="lz-d">Cấu hình, môi trường, các điểm gắn, mã thoát, cờ OOM, số lần khởi động lại, sức khoẻ. Mọi thứ Docker biết, gói trong một tài liệu tra được.</span></div>
  <div class="lz-step"><span class="lz-k">Nó đang DÙNG bao nhiêu?</span><span class="lz-t">docker stats --no-stream</span><span class="lz-d">CPU, bộ nhớ so với trần của nó, mạng và số PID. Cách nhanh nhất để phát hiện container đang ăn cả cái máy.</span></div>
  <div class="lz-step"><span class="lz-k">Nó đang CHẠY gì?</span><span class="lz-t">docker top</span><span class="lz-d">Danh sách tiến trình kèm PID của máy chủ, không cần một cái shell bên trong — điều đó quan trọng với những ảnh tối giản.</span></div>
  <div class="lz-step"><span class="lz-k">Nó đã ĐỔI gì?</span><span class="lz-t">docker diff</span><span class="lz-d">Mọi file được thêm, đổi hay xoá trong tầng ghi được. Tìm ra trạng thái lẽ ra phải nằm trên một volume.</span></div>
  <div class="lz-step"><span class="lz-k">Chuyện gì ĐÃ XẢY RA?</span><span class="lz-t">docker events --since 1h</span><span class="lz-d">Sổ ghi của chính tiến trình nền: tạo, khởi chạy, chết, bị OOM giết, đổi trạng thái sức khoẻ. Câu trả lời cho "lúc tôi ngủ thì có chuyện gì?".</span></div>
</div>
<h3>docker logs, và log thật sự nằm ở đâu</h3>
${slide('dk-02', 10, 'docker logs = stdout + stderr của PID 1, cất trong file JSON')}
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
curl -s localhost:8080 &gt;/dev/null; curl -s localhost:8080/missing &gt;/dev/null

docker logs web                      <span class="tok-comment"># tất cả từ đầu tới giờ</span>
docker logs -f --tail 20 web         <span class="tok-comment"># bám theo, bắt đầu từ 20 dòng cuối</span>
docker logs --since 5m -t web        <span class="tok-comment"># 5 phút gần nhất, kèm mốc thời gian</span>
docker logs --since 2026-08-22T21:00 --until 2026-08-22T21:05 web</code></pre>
<div class="out">2026-08-22T21:31:04.118Z 172.17.0.1 - - [22/Aug/2026:21:31:04 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.5.0"
2026-08-22T21:31:04.402Z 2026/08/22 21:31:04 [error] 31#31: *2 open() "/usr/share/nginx/html/missing" failed (2: No such file or directory)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--tail N</span><span class="v">Chỉ N dòng cuối. Thiết yếu với một container có cả triệu dòng log, nơi một lệnh <code>docker logs</code> trần sẽ nhấn chìm terminal của bạn và tốn khá lâu để làm việc đó.</span></div>
  <div class="kv"><span class="k">--since / --until</span><span class="v">Nhận khoảng thời gian (<code>10m</code>, <code>1h</code>) hoặc mốc RFC3339. Đây là cách bạn khoanh một cuộc tìm kiếm vào khung giờ sự cố thay vì đọc từ đầu.</span></div>
  <div class="kv"><span class="k">-t, --timestamps</span><span class="v">Ghi thêm thời điểm Docker nhận được từng dòng. Chú ý nó có thể khác mốc thời gian của chính ứng dụng, và đó chính là thứ bạn muốn khi so sánh giữa các container.</span></div>
  <div class="kv"><span class="k">-f, --follow</span><span class="v">Bám theo thời gian thực. Ghép với <code>--tail 0</code> để chỉ thấy những gì xảy ra TỪ BÂY GIỜ — rõ ràng hơn hẳn khi đang tái hiện một con bọ.</span></div>
  <div class="kv"><span class="k">2&gt;/dev/null hoặc 1&gt;/dev/null</span><span class="v"><code>docker logs</code> đẩy stdout của container vào stdout của bạn và stderr vào stderr của bạn, nên bạn tách được chúng: <code>docker logs web 2&gt;/dev/null</code> chỉ hiện stdout.</span></div>
</div>
<pre><code>CID=\$(docker inspect -f '{{.Id}}' web)
sudo ls -lh /var/lib/docker/containers/\$CID/\$CID-json.log
sudo head -c 220 /var/lib/docker/containers/\$CID/\$CID-json.log</code></pre>
<div class="out">-rw-r----- 1 root root 1.4K Aug 22 21:31 /var/lib/docker/containers/8c40e93b…/8c40e93b…-json.log
{"log":"172.17.0.1 - - [22/Aug/2026:21:31:04 +0000] \\"GET / HTTP/1.1\\" 200 615 \\"-\\" \\"curl/8.5.0\\"\\n","stream":"stdout","time":"2026-08-22T21:31:04.118Z"}</div>
<div class="callout warn"><strong>Mặc định thì cái file này phình ra MÃI MÃI.</strong> Trình <code>json-file</code> không có giới hạn kích thước nào trừ khi bạn đặt, và một ứng dụng lắm lời sẽ âm thầm làm đầy <code>/var/lib/docker</code> cho tới khi đĩa cạn và cơ sở dữ liệu nằm chung máy thôi ghi được. Hãy sửa nó trên toàn hệ thống trong <code>/etc/docker/daemon.json</code> bằng <code>"log-opts": {"max-size": "10m", "max-file": "3"}</code>, nó áp cho mọi container mới. Chương 11 nói tử tế về các trình ghi log; còn đặt phần xoay vòng là điều đáng làm NGAY HÔM NAY.</div>
<p><strong>Chạy thử từng bước trên Docker 29 — và cái file đó nằm đâu trên máy CỦA BẠN.</strong> Output ở trên là của một lần chạy cũ trên Ubuntu. Đây là cùng ý đó chạy lại trên máy của khoá, mỗi lần một câu hỏi:</p>
<pre><code class="language-bash">docker run -d --name web -p 18022:80 nginx:1.27-alpine
curl -s localhost:18022 &gt;/dev/null; curl -s localhost:18022/missing &gt;/dev/null
docker logs web 2&gt;/dev/null | tail -1        <span class="tok-comment"># chỉ thứ nginx ghi ra STDOUT (access log)</span>
docker logs web 2&gt;&amp;1 &gt;/dev/null | tail -1   <span class="tok-comment"># chỉ STDERR (error log)</span>
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.LogPath}}' web</code></pre>
<div class="out">192.168.65.1 - - [23/Sep/2026:14:03:41 +0000] "GET /missing HTTP/1.1" 404 153 "-" "curl/8.7.1" "-"
2026/09/23 14:03:41 [error] 33#33: *2 open() "/usr/share/nginx/html/missing" failed (2: No such file or directory), client: 192.168.65.1, server: localhost, request: "GET /missing HTTP/1.1", host: "localhost:18022"
json-file /var/lib/docker/containers/3dd1928cd0ec…/3dd1928cd0ec…-json.log</div>
<p>Có hai điều để đọc ở đây. Địa chỉ máy khách là <code>192.168.65.1</code>, không phải địa chỉ Mac của bạn — trên Docker Desktop, request của bạn đi vào qua mạng của máy ảo Linux. Và <code>2&gt;&amp;1 &gt;/dev/null</code> trông như viết ngược nhưng là đúng: trước hết trỏ stderr tới chỗ stdout đang đi (terminal của bạn), rồi mới vứt stdout đi. Trên Mac, cái <code>LogPath</code> đó nằm <em>BÊN TRONG</em> máy ảo của Docker Desktop, nên bạn không <code>ls</code> được nó từ macOS; <code>docker logs</code> là cánh cửa duy nhất. Trên một máy chủ Linux không có sudo, bạn vẫn đọc được file gốc qua một container dùng-xong-vứt (chỉ đọc):</p>
<pre><code class="language-bash">CID=\$(docker inspect -f '{{.Id}}' web)
docker run --rm -v /var/lib/docker/containers/\$CID:/c:ro alpine \\
  sh -c "ls -lh /c/*-json.log; tail -1 /c/\$CID-json.log"</code></pre>
<div class="out">-rw-r-----    1 root     root        3.8K Sep 23 14:16 /c/84b8186524f1…-json.log
{"log":"172.17.0.1 - - [23/Sep/2026:14:16:32 +0000] \\"GET / HTTP/1.1\\" 200 615 \\"-\\" \\"curl/8.18.0\\" \\"-\\"\\n","stream":"stdout","time":"2026-09-23T14:16:32.660289774Z"}</div>
<p>Output thật trên máy Linux của khoá (Docker 29.6). Mỗi dòng một đối tượng JSON: nội dung chữ, nó đến từ luồng nào, và thời điểm Docker nhận được — đúng thứ mà <code>-t</code> in ra.</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th><th>Khi nào dùng</th></tr>
<tr><td><code>--tail N</code></td><td>Chỉ N dòng cuối</td><td><code>docker logs --tail 50 api</code></td><td>Luôn luôn, với thứ gì đã chạy một lúc</td></tr>
<tr><td><code>-f</code></td><td>Bám theo trực tiếp (Ctrl-C chỉ dừng việc <em>XEM</em>, không dừng app)</td><td><code>docker logs -f --tail 0 api</code></td><td>Tái hiện lỗi: chỉ thấy chuyện xảy ra từ giờ</td></tr>
<tr><td><code>--since</code> / <code>--until</code></td><td>Khung giờ: <code>10m</code>, <code>1h</code> hoặc một mốc thời gian</td><td><code>--since 2026-09-23T14:00 --until 2026-09-23T14:10</code></td><td>"Trang chết lúc 21:05" — chỉ đọc đúng khung đó</td></tr>
<tr><td><code>-t</code></td><td>Kèm giờ Docker nhận dòng (UTC)</td><td><code>docker logs -t web</code></td><td>So dòng thời gian giữa các container</td></tr>
<tr><td><code>2&gt;/dev/null</code></td><td>Chỉ giữ stdout</td><td><code>docker logs web 2&gt;/dev/null</code></td><td>Access log mà không lẫn lỗi</td></tr>
<tr><td><code>2&gt;&amp;1 &gt;/dev/null</code></td><td>Chỉ giữ stderr</td><td><code>docker logs web 2&gt;&amp;1 &gt;/dev/null</code></td><td>Chỉ xem lỗi</td></tr>
<tr><td><code>2&gt;&amp;1 | grep</code></td><td>Tìm trong cả hai luồng</td><td><code>docker logs api 2&gt;&amp;1 | grep -i error</code></td><td>grep trơn chỉ thấy stdout — cái bẫy kinh điển "grep chẳng ra gì"</td></tr>
</table>

<h3>stdout là bản hợp đồng</h3>
${slide('dk-02', 11, 'File log và bộ đệm làm docker logs trống trơn')}
<pre><code>docker run -d --name filelog alpine sh -c \\
  'while true; do echo "ghi vào một file" &gt;&gt; /var/log/app.log; sleep 2; done'
docker logs filelog                     <span class="tok-comment"># không có gì — nó chưa từng ghi ra stdout</span>
docker exec filelog tail -2 /var/log/app.log</code></pre>
<div class="out">ghi vào một file
ghi vào một file</div>
<p>Một ứng dụng ghi vào file log BÊN TRONG container thì vô hình với <code>docker logs</code>, với bộ gom log của bạn, và với mọi thứ Chương 11 dựng lên — và output của nó chết cùng container. <strong>Ứng dụng chạy trong container thì ghi log ra stdout và stderr.</strong> Nếu một framework nhất định đòi một đường dẫn file thì mẹo tiêu chuẩn là trỏ nó vào <code>/dev/stdout</code>; đó chính xác là điều ảnh nginx chính thức làm.</p>
<pre><code>docker exec web ls -l /var/log/nginx/</code></pre>
<div class="out">lrwxrwxrwx 1 root root 11 Aug  1 12:04 access.log -&gt; /dev/stdout
lrwxrwxrwx 1 root root 11 Aug  1 12:04 error.log -&gt; /dev/stderr</div>
<p><strong>Đường thứ hai dẫn tới <code>docker logs</code> trống: bộ đệm, đo thật.</strong> Cùng một vòng lặp Python nhỏ, một lần để nguyên và một lần có <code>PYTHONUNBUFFERED=1</code>, đếm sau bốn giây:</p>
<pre><code class="language-bash">docker run -d --name py1 python:3.12-alpine python -c 'import time
while True: print("tick"); time.sleep(1)'
docker run -d --name py2 -e PYTHONUNBUFFERED=1 python:3.12-alpine python -c 'import time
while True: print("tick"); time.sleep(1)'
sleep 4; echo "py1: \$(docker logs py1 2&gt;&amp;1 | wc -l) dòng"; echo "py2: \$(docker logs py2 2&gt;&amp;1 | wc -l) dòng"
docker rm -f py1 py2</code></pre>
<div class="out">py1:        0 dòng
py2:        5 dòng</div>
<p>Cùng mã, cùng số giây. <code>py1</code> KHÔNG bị treo — các dòng của nó đang nằm trong một bộ đệm 8 KB vì stdout là một đường ống dẫn tới Docker chứ không phải terminal. Thêm <code>ENV PYTHONUNBUFFERED=1</code> vào mọi Dockerfile Python là cả một loại báo động giả "app bị treo" biến mất.</p>

<h3>docker inspect: mọi thứ, dưới dạng JSON</h3>
${slide('dk-02', 12, 'docker inspect: một dòng phân loại mọi container')}
<pre><code>docker inspect web | head -12
docker inspect web --format '{{.State.Status}} · pid {{.State.Pid}} · bắt đầu {{.State.StartedAt}}'
docker inspect web --format '{{range \$n, \$c := .NetworkSettings.Networks}}{{\$n}} {{\$c.IPAddress}}{{end}}'
docker inspect web --format '{{range .Mounts}}{{.Type}} {{.Source}} -&gt; {{.Destination}}{{"\\n"}}{{end}}'
docker inspect web --format '{{json .Config.Env}}' | tr ',' '\\n' | head -2</code></pre>
<div class="out">running · pid 40122 · bắt đầu 2026-08-22T21:30:58.412Z
bridge 172.17.0.2
["PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
"NGINX_VERSION=1.27.2"]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--format dùng khuôn Go</span><span class="v">KHÔNG phải cú pháp jq. <code>{{.State.Status}}</code>, <code>{{range …}}</code>, <code>{{json …}}</code>, <code>{{printf}}</code>. Tên trường khớp chính xác với JSON, nên chạy <code>docker inspect</code> không kèm format chính là cách bạn khám phá ra phải hỏi cái gì.</span></div>
  <div class="kv"><span class="k">Hoặc đổ qua jq</span><span class="v"><code>docker inspect web | jq '.[0].State'</code> — chú ý cái mảng: inspect LUÔN trả về một danh sách, kể cả với một container. Đây là lỗi jq phổ biến nhất ở đây.</span></div>
  <div class="kv"><span class="k">Nó chạy được cả với ảnh và volume</span><span class="v"><code>docker inspect nginx:1.27-alpine</code>, <code>docker volume inspect pgdata</code>, <code>docker network inspect bridge</code>. Cùng câu lệnh, cùng cú pháp khuôn.</span></div>
  <div class="kv"><span class="k">Những trường đáng thuộc lòng</span><span class="v"><code>.State.ExitCode</code>, <code>.State.OOMKilled</code>, <code>.State.Health.Status</code>, <code>.RestartCount</code>, <code>.Config.Env</code>, <code>.Mounts</code>, <code>.HostConfig.Memory</code>, <code>.NetworkSettings.Networks</code>. Cộng lại chúng trả lời phần lớn câu hỏi lúc có sự cố.</span></div>
</div>
<pre><code><span class="tok-comment"># Một dòng tóm tắt sức khoẻ cho MỌI container</span>
docker inspect \$(docker ps -aq) --format \\
  '{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'</code></pre>
<div class="out">/web running exit=0 oom=false restarts=0
/filelog running exit=0 oom=false restarts=0
/api exited exit=137 oom=true restarts=4</div>
<p>Ba container, và cái thứ ba đã kể trọn câu chuyện của nó: nó bị OOM giết bốn lần. Riêng câu lệnh đó là công cụ phân loại nhanh nhất trong cả khoá này.</p>
<div class="callout warn"><strong>Đính chính cho Docker 29.</strong> Bản trước của bài này — và vô số bài blog — đọc địa chỉ IP bằng <code>{{.NetworkSettings.IPAddress}}</code>. Trên Docker 29 trường đó đã bị bỏ và khuôn hỏng: <code>template parsing error: … map has no entry for key "IPAddress"</code>. Một container có thể nằm trên nhiều mạng, nên địa chỉ nằm theo TỪNG mạng dưới <code>.NetworkSettings.Networks</code>; dạng <code>range</code> ở trên in ra <code>bridge 172.17.0.5</code> trên máy Mac của khoá. Khi một <code>--format</code> bạn chép về bị hỏng, hãy chạy <code>docker inspect</code> không kèm format và đi tìm chỗ ở mới của trường đó.</div>
<p><strong>Đọc dòng phân loại trên một vòng lặp sập thật.</strong> Trên máy Mac của khoá, chúng tôi chạy một container cấp phát 200 MB dưới trần 128 MB với <code>--restart on-failure:4</code>, rồi để nó tự hỏng:</p>
<pre><code class="language-bash">docker inspect \$(docker ps -aq --filter name=api) --format \\
  '{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'
docker events --since 40s --until 0s --filter container=api --format '{{.Action}}' | head -7</code></pre>
<div class="out">/api exited exit=137 oom=true restarts=4
create
start
oom
die
start
oom
die</div>
<p>Đọc từ trái sang phải: <code>exited</code> (nó sẽ không tự lên lại nữa), <code>137</code> (SIGKILL), <code>oom=true</code> (trần bộ nhớ làm chuyện đó, không phải con người), <code>restarts=4</code> (chính sách đã bỏ cuộc sau bốn lần thử). <code>docker events</code> kể lại cùng câu chuyện dưới dạng dòng thời gian. Và <code>docker logs api</code> thì trống — <code>dd</code> bị giết trước khi kịp in gì, đó là lý do log là chỗ nhìn ĐẦU TIÊN nhưng không bao giờ là chỗ DUY NHẤT.</p>

<h3>stats, top, port, diff</h3>
${slide('dk-02', 13, 'stats · top · port · diff: đọc output từng cột')}
<pre><code>docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.NetIO}}\\t{{.PIDs}}'
docker top web -o pid,user,args
docker port web
docker diff web | head -4</code></pre>
<div class="out">NAME      CPU %     MEM USAGE / LIMIT     NET I/O       PIDS
web       0.00%     3.629MiB / 15.46GiB   2.14kB/1.8kB  3
filelog   0.02%     1.398MiB / 15.46GiB   1.02kB/0B     2

PID     USER   COMMAND
40122   root   nginx: master process nginx -g daemon off;
40180   nginx  nginx: worker process

80/tcp -&gt; 0.0.0.0:8080
C /var
C /var/cache/nginx</div>
<div class="kv-grid">
  <div class="kv"><span class="k">docker stats</span><span class="v">CPU, bộ nhớ, mạng và số PID theo thời gian thực. <code>--no-stream</code> để chụp một phát trong script. Nếu <code>MEM USAGE / LIMIT</code> hiện tổng RAM của máy chủ thì container đó KHÔNG có trần bộ nhớ — điều mà Chương 11 lập luận là nó nên có.</span></div>
  <div class="kv"><span class="k">docker top</span><span class="v">Các tiến trình của container, hiện với PID của <em>MÁY CHỦ</em>. Nhận cả tuỳ chọn của <code>ps</code>. Hữu ích khi bạn muốn danh sách tiến trình mà không cần <code>exec</code>, điều đó quan trọng với những ảnh không có shell.</span></div>
  <div class="kv"><span class="k">docker port</span><span class="v">Cái gì được publish ở đâu. Câu trả lời nhanh cho "cờ <code>-P</code> đã chọn cổng nào của máy chủ?" và cho "cổng này có được publish không?".</span></div>
  <div class="kv"><span class="k">docker diff</span><span class="v">Những gì đã đổi trong tầng ghi được từ lúc container khởi động: <code>A</code> thêm, <code>C</code> đổi, <code>D</code> xoá. Giỏi một cách bất ngờ trong việc tìm ra một tiến trình đang ghi vào chỗ không nên ghi, và trong việc phát hiện trạng thái lẽ ra phải nằm trên một volume.</span></div>
</div>
<p><strong>Đọc output theo từng cột (Docker 29, máy Mac của khoá).</strong></p>
<pre><code class="language-bash">docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.PIDs}}' web l
docker top web -o pid,user,args | head -3</code></pre>
<div class="out">NAME      CPU %     MEM USAGE / LIMIT     PIDS
web       0.00%     9.699MiB / 7.748GiB   11
l         0.00%     8.422MiB / 256MiB     11
PID                 USER                COMMAND
20449               root                nginx: master process nginx -g daemon off;
20492               statd               nginx: worker process</div>
<table>
<tr><th>Bạn thấy</th><th>Nghĩa là</th></tr>
<tr><td><code>9.699MiB / 7.748GiB</code></td><td>Đang dùng / trần. Trần ở đây là cả máy ảo Docker Desktop (Mac có 32 GB, máy ảo được 7,7 GiB) — tức là container này KHÔNG có <code>--memory</code>.</td></tr>
<tr><td><code>8.422MiB / 256MiB</code></td><td>Container <code>l</code> của Bài 2.1, chạy với <code>--memory 256m</code>.</td></tr>
<tr><td><code>PIDS 11</code></td><td>Một nginx master + 10 worker: <code>worker_processes auto</code> thấy 10 CPU của máy ảo.</td></tr>
<tr><td><code>CPU %</code></td><td>Phần trăm của MỘT nhân; một app bận chạy hai luồng có thể hiện 200%.</td></tr>
<tr><td><code>USER statd</code></td><td>Worker chạy dưới UID 101 (người dùng <code>nginx</code> trong ảnh). <code>docker top</code> tra con số đó trong <code>/etc/passwd</code> của <em>MÁY CHỦ</em>, nơi 101 tình cờ là <code>statd</code>. Cùng một tiến trình, khác sổ tên — hãy tin con số, đừng tin cái tên.</td></tr>
<tr><td><code>PID 20449</code></td><td>PID của máy chủ (trong máy ảo Docker Desktop). Bên trong container, master là PID 1.</td></tr>
</table>

<h3>Một cuộc quét ba mươi giây</h3>
${slide('dk-02', 14, 'Cuộc quét 30 giây — và bẫy: hai --filter khác loại là “VÀ”')}
<pre><code>{
  echo "=== đang chạy ==="; docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'
  echo "=== đã thoát ==="; docker ps -a --filter 'status=exited' --format '{{.Names}} {{.Status}}'
  echo "=== không khoẻ ==="; docker ps --filter 'health=unhealthy' --format '{{.Names}} {{.Status}}'
  echo "=== khởi động lại và OOM ==="; docker inspect \$(docker ps -aq) \\
      --format '{{.Name}} restarts={{.RestartCount}} oom={{.State.OOMKilled}}' | grep -v 'restarts=0 oom=false'
  echo "=== tài nguyên ==="; docker stats --no-stream --format '{{.Name}} {{.CPUPerc}} {{.MemPerc}}'
  echo "=== đĩa ==="; docker system df
  echo "=== lỗi gần đây ==="; for c in \$(docker ps --format '{{.Names}}'); do
      docker logs --since 15m "\$c" 2&gt;&amp;1 | grep -iE 'error|fatal|panic' | tail -3 | sed "s/^/\$c: /"
    done
}</code></pre>
<div class="out">=== đang chạy ===
NAMES     STATUS                    PORTS
web       Up 6 minutes              0.0.0.0:8080-&gt;80/tcp
filelog   Up 5 minutes
=== khởi động lại và OOM ===
/api restarts=4 oom=true
=== lỗi gần đây ===
web: 2026/08/22 21:31:04 [error] 31#31: *2 open() "/usr/share/nginx/html/missing" failed</div>
<p>Hãy lưu cái đó thành một hàm shell. Nó là bản tương đương cho container của cuộc quét sáu mươi giây trong khoá Linux, và chạy nó TRƯỚC KHI hình thành ý kiến sẽ tiết kiệm cho bạn rất nhiều lần đoán mò.</p>
<div class="callout warn"><strong>Đính chính: hai <code>--filter</code> KHÁC khoá là VÀ, không phải HOẶC.</strong> Bản trước của cuộc quét này có một dòng <code>docker ps -a --filter 'status=exited' --filter 'health=unhealthy'</code> với nhãn "không khoẻ hoặc đã thoát". Chạy trên máy Mac của khoá, với một container đã thoát và một container không khoẻ, nó in ra <strong>KHÔNG GÌ CẢ</strong>: Docker ghép các bộ lọc khác khoá bằng VÀ, và không container nào vừa đã thoát VỪA không khoẻ cùng lúc. Lặp lại CÙNG một khoá mới là HOẶC (<code>--filter name=web --filter name=db</code> liệt kê cả hai). Đó là lý do cuộc quét ở trên giờ dùng hai dòng. Một phép kiểm âm thầm không in gì còn tệ hơn không có phép kiểm nào.</div>
<pre><code class="language-bash">docker ps -a --filter status=exited --filter health=unhealthy --format '{{.Names}}'   <span class="tok-comment"># VÀ</span>
docker ps -a --filter health=unhealthy --format '{{.Names}}'
docker ps -a --filter status=exited --format '{{.Names}}'</code></pre>
<div class="out">hc
api</div>
<pre><code>docker rm -f web filelog &gt;/dev/null</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> mười phút trước buổi demo SWP391, container API "cứ chết hoài" mà <code>docker logs</code> chẳng hiện gì. Bạn có năm phút để nói ra VÌ SAO, kèm bằng chứng, trước khi ai đó đụng vào mã.</p><ol>
<li>Dựng lại sự cố trong <code>~/thu-docker</code>: <code>docker run -d --name thu-api --memory 64m --memory-swap 64m --restart on-failure:3 alpine sh -c 'sleep 1; dd if=/dev/zero of=/dev/null bs=100M count=1'</code>. Chờ 20 giây.</li>
<li>Câu hỏi đầu, "nó đã nói gì?": <code>docker logs thu-api</code>. Ghi nhận là nó trống và nói vì sao.</li>
<li>Câu thứ hai, "nó là gì?": dòng phân loại bằng <code>docker inspect --format</code> trong bài.</li>
<li>Câu thứ ba, "đã xảy ra gì?": <code>docker events --since 1m --until 0s --filter container=thu-api --format '{{.Action}}'</code>.</li>
<li>Viết một câu chẩn đoán bạn sẽ gửi vào nhóm chat, rồi <code>docker rm -f thu-api</code>.</li></ol>
<div class="out">/thu-api exited exit=137 oom=true restarts=3</div>
<p><strong>Đạt khi:</strong> dòng phân loại của bạn khớp dòng trên, danh sách events có <code>oom</code> trước mỗi <code>die</code>, và câu chẩn đoán gọi đúng tên trần bộ nhớ (không phải "code bị sập") đồng thời giải thích vì sao log trống.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stdout / stderr (đầu ra chuẩn / đầu ra lỗi)</span><span class="v">Hai luồng output của một tiến trình: output bình thường và output lỗi. Docker cất cả hai và <code>docker logs</code> trả về cả hai.</span></div>
  <div class="kv"><span class="k">Log driver (trình ghi log)</span><span class="v">Nơi Docker gửi output của container. Mặc định <code>json-file</code>: mỗi container một file, không giới hạn nếu bạn không đặt xoay vòng.</span></div>
  <div class="kv"><span class="k">Go template (khuôn Go, --format)</span><span class="v">Ngôn ngữ <code>{{.Trường}}</code> mà <code>--format</code> dùng để nhặt trường ra khỏi JSON của Docker.</span></div>
  <div class="kv"><span class="k">Buffering (đệm output)</span><span class="v">Chương trình giữ output trong bộ nhớ trước khi ghi; làm log trông như trống hoặc tới trễ.</span></div>
  <div class="kv"><span class="k">Triage (phân loại sự cố)</span><span class="v">Xếp vấn đề thật nhanh theo mức độ và nguyên nhân trước khi sửa bất cứ thứ gì.</span></div>
  <div class="kv"><span class="k">Event (sự kiện, docker events)</span><span class="v">Bản ghi mà tiến trình nền viết cho mỗi bước vòng đời: create, start, oom, die, health_status…</span></div>
  <div class="kv"><span class="k">Filter (bộ lọc, --filter)</span><span class="v">Một điều kiện cho <code>docker ps</code>/<code>events</code>. Khác khoá = VÀ; lặp cùng khoá = HOẶC.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Sáu câu hỏi, sáu câu lệnh: logs, inspect, stats, top, diff, events — hỏi theo đúng thứ tự đó.</li>
<li><code>docker logs</code> là stdout và stderr của PID 1; khoanh bằng <code>--tail</code>/<code>--since</code> và nhớ <code>2&gt;&amp;1</code> trước khi grep.</li>
<li>Log trống nghĩa là app ghi file bên trong container, môi trường chạy đang đệm, hoặc tiến trình bị giết trước khi kịp in.</li>
<li>Một dòng <code>inspect --format</code> (trạng thái, mã thoát, oom, restarts) chẩn đoán được phần lớn cú sập; trên Docker 29 đọc IP từ <code>.NetworkSettings.Networks</code>.</li>
<li><code>stats</code> hiện "không trần" bằng tổng RAM máy chủ/máy ảo; <code>top</code> hiện PID và tên người dùng của máy chủ.</li>
<li>Các <code>--filter</code> khác khoá là VÀ — một dòng quét ghép chúng lại có thể âm thầm không in gì.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/logs/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">docker logs — tài liệu tra cứu</span><span class="lc-sub">Mọi bộ lọc thời gian, và ghi chú quan trọng rằng nó chỉ chạy với các trình <code>json-file</code>, <code>local</code> và <code>journald</code> — đẩy log đi chỗ khác là câu lệnh này thôi hoạt động.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/cli/formatting/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Định dạng output của lệnh Docker</span><span class="lc-sub">Cú pháp khuôn Go mà mọi cờ <code>--format</code> dùng, kèm các trợ thủ <code>table</code>, <code>json</code> và <code>range</code>. Học một lần là mọi câu lệnh Docker đều viết script được.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/logging/configure/" target="_blank" rel="noopener">
  <span class="lc-ico">🚰</span>
  <span class="lc-body"><span class="lc-title">Cấu hình trình ghi log</span><span class="lc-sub">json-file, local, journald, syslog và các trình của đám mây, kèm tuỳ chọn xoay vòng. Hãy đọc phần <code>max-size</code>/<code>max-file</code> ngay hôm nay, trước khi một file log làm đầy một cái đĩa.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: làm cho một container trở nên trong suốt</span><span class="lc-sub">Bài chấm điểm: khoanh một cuộc tìm log vào khung năm phút, moi mã thoát và cờ OOM ra bằng một khuôn, tìm một tiến trình đang ghi ngoài volume bằng <code>docker diff</code>, và giải thích vì sao log của một container lại rỗng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một môi trường chạy có đệm khiến <code>docker logs</code> trông như rỗng hoặc đứng hình. Python đệm stdout khi nó không phải TTY, nên output của <code>print()</code> có thể nằm im trong bộ đệm hàng phút — hoặc mãi mãi, nếu tiến trình bị giết — và bạn kết luận ứng dụng bị treo trong khi nó vẫn chạy tốt. Cách chữa tuỳ theo môi trường và đều gói trong một dòng: <code>ENV PYTHONUNBUFFERED=1</code> (hoặc <code>python -u</code>), <code>stdbuf -oL</code> cho chương trình bất kỳ, còn với Node thì không cần gì vì <code>console.log</code> ra một ống dẫn vốn đã xả theo từng lần ghi. Nếu một container "im lặng", hãy nghi bộ đệm trước khi nghi mã nguồn.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Ứng dụng chạy trong container ghi log ra <strong>stdout và stderr</strong> — một file log bên trong container thì vô hình với mọi công cụ và chết cùng nó. <code>docker inspect --format</code> chạy lên tất cả container cho bạn trạng thái, mã thoát, cờ OOM và số lần khởi động lại trong một dòng, và đó là cách phân loại nhanh nhất từng có. Và trình <code>json-file</code> mặc định KHÔNG có giới hạn kích thước cho tới khi bạn đặt, nên hãy đưa <code>max-size</code> vào <code>daemon.json</code> trước khi một file log làm đầy cái đĩa.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — Getting inside, even when there is no shell|||2.3 — Vào bên trong, kể cả khi không có shell nào',
      slug: 'dk-2-3-vao-ben-trong',
      type: 'LESSON',
      description: 'exec khác attach ở đâu và vì sao Ctrl-C ở chỗ sai sẽ giết ứng dụng, -i với -t nghĩa là gì, exec dưới quyền root, và ba cách gỡ lỗi một ảnh distroless không có shell.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Getting inside, even when there is no shell</h2>
<p class="lead">Reading logs tells you what a container said. Getting inside tells you what it <em>is</em> — which files exist, what the environment really contains, whether it can reach the database. This lesson is the two ways in, the difference between them (one of which can take down your app), and what to do when the image deliberately contains no shell at all.</p>

<h3>exec: a new process in the same namespaces</h3>
${slide('dk-02', 15, 'exec mở tiến trình MỚI — attach nối vào chính PID 1')}
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
docker exec -it web sh -c 'ls /etc/nginx; echo; id; echo; hostname'
docker exec web cat /etc/nginx/conf.d/default.conf | head -5
docker exec web env | grep NGINX</code></pre>
<div class="out">conf.d  fastcgi.conf  mime.types  nginx.conf  scgi_params  uwsgi_params

uid=0(root) gid=0(root) groups=0(root)

8c40e93b1a41
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;
NGINX_VERSION=1.27.2</div>
<p><code>docker exec</code> starts an <strong>additional</strong> process inside the container's existing namespaces (Lesson 1.1). It sees the same filesystem, the same network and the same process table — but it is not PID 1, so exiting your shell does not stop the container, and Ctrl-C only affects your command.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-it</span><span class="v">For an interactive shell. <code>-i</code> alone is enough for piping; <code>-t</code> alone is almost never what you want.</span></div>
  <div class="kv"><span class="k">-u root</span><span class="v">Run as a different user. Essential when the image runs as an unprivileged user (Chapter 6) and you need to install a debugging tool or read a root-owned file.</span></div>
  <div class="kv"><span class="k">-w /path</span><span class="v">Start in a specific directory rather than the image's <code>WORKDIR</code>.</span></div>
  <div class="kv"><span class="k">-e VAR=value</span><span class="v">Add environment variables for this command only. Useful for <code>-e PGPASSWORD=…</code> so a password does not end up in your shell history on the host.</span></div>
  <div class="kv"><span class="k">--privileged</span><span class="v">Grants the exec'd process full capabilities. Occasionally needed to run <code>tcpdump</code> or <code>strace</code> inside; treat it as a loaded weapon.</span></div>
</div>
<pre><code><span class="tok-comment"># Which shell does the image actually have?</span>
docker exec web sh -c 'ls -l /bin/sh; command -v bash || echo "no bash"'
docker run --rm ubuntu:24.04 bash -c 'echo ubuntu has bash'</code></pre>
<div class="out">lrwxrwxrwx 1 root root 12 Aug  1 12:03 /bin/sh -&gt; /bin/busybox
no bash
ubuntu has bash</div>
<p>Alpine-based images have <code>/bin/sh</code> (busybox ash) and no <code>bash</code>. <code>docker exec -it web bash</code> fails with <code>exec: "bash": executable file not found in $PATH</code>, which reads like the container is broken and means nothing of the sort. Reach for <code>sh</code> first; it is present nearly everywhere.</p>
<p><strong>Re-checked on Docker 29.</strong> <code>docker exec web bash</code> prints <code>OCI runtime exec failed: exec failed: unable to start container process: exec: "bash": executable file not found in $PATH</code> and exits <strong>127</strong> — the same "command not found" code as in Lesson 2.1. And if you run <code>docker exec -it …</code> from a script, a CI job or any place where your own stdin is not a keyboard, you now get <code>cannot attach stdin to a TTY-enabled container because stdin is not a terminal</code> (older Docker said <code>the input device is not a TTY</code>; Git Bash on Windows needs <code>winpty docker exec -it …</code> for the same reason). Drop the <code>-t</code> there.</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th><th>When to use it</th></tr>
<tr><td><code>-it</code></td><td>Interactive shell</td><td><code>docker exec -it web sh</code></td><td>You are typing</td></tr>
<tr><td><code>-i</code></td><td>stdin only, no TTY</td><td><code>docker exec -i db psql -U postgres &lt; dump.sql</code></td><td>Piping a file in; scripts; CI</td></tr>
<tr><td><code>-u</code></td><td>Run as another user</td><td><code>docker exec -u root web id</code></td><td>The image runs as a normal user and you need root to look around</td></tr>
<tr><td><code>-w</code></td><td>Working directory</td><td><code>docker exec -w /app api ls</code></td><td>Tools that expect to start in the project folder</td></tr>
<tr><td><code>-e</code></td><td>Extra variable for this command only</td><td><code>docker exec -e PGPASSWORD=… db psql …</code></td><td>Keeping a secret out of the container's permanent config</td></tr>
<tr><td><code>-d</code></td><td>Run the extra process in the background</td><td><code>docker exec -d web sh -c 'sleep 60'</code></td><td>Rarely; it dies with the container and is not restarted</td></tr>
<tr><td><code>--privileged</code></td><td>Full capabilities for this process</td><td><code>docker exec --privileged web …</code></td><td>Last resort for <code>tcpdump</code>/<code>strace</code></td></tr>
</table>

<h3>attach: connecting to PID 1's own terminal</h3>
${slide('dk-02', 16, 'Đo thật: tín hiệu gửi vào docker attach đi thẳng tới app')}
<pre><code>docker run -d --name t alpine sh -c 'while true; do date; sleep 2; done'
timeout -k 3 4 docker attach t              <span class="tok-comment"># SIGTERM after 4 s, SIGKILL 3 s later</span>
docker ps --filter name=t --format '{{.Names}} {{.Status}}'
timeout -s INT 3 docker attach t            <span class="tok-comment"># SIGINT = what Ctrl-C sends</span>
docker ps -a --filter name=t --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">Wed Sep 23 14:34:40 UTC 2026
Wed Sep 23 14:34:42 UTC 2026
Wed Sep 23 14:34:44 UTC 2026
bash: line 2: 399854 Killed                     timeout -k 3 4 docker attach t
t Up 7 seconds
Wed Sep 23 14:34:46 UTC 2026
Wed Sep 23 14:34:48 UTC 2026
t Exited (130) 1 second ago</div>
<div class="callout warn"><strong><code>docker attach</code> connects your terminal to PID 1's stdin/stdout — so Ctrl-C sends SIGINT to the application and usually stops the container.</strong> This surprises people who reach for attach expecting something like <code>tail -f</code>. If you attached and want out without killing anything, the detach sequence is <strong>Ctrl-P Ctrl-Q</strong>. To watch output safely, use <code>docker logs -f</code>; to get a prompt, use <code>docker exec</code>. Attach is genuinely useful only when you need to <em>send input</em> to PID 1 — an interactive REPL you started with <code>-d</code>, for instance.</div>
<p><strong>What the measurement above shows (Linux, Docker 29.6).</strong> An earlier version of this lesson claimed <code>timeout 5 docker attach t</code> returns after five seconds with the container still up. It does not: <code>docker attach</code> <em>forwards</em> the signals it receives to PID 1 (<code>--sig-proxy</code>, on by default), the shell loop running as PID 1 ignores SIGTERM (Lesson 1.3), and the attach command simply keeps printing — <code>timeout</code> had to SIGKILL it. The second call sends SIGINT, exactly what Ctrl-C sends, and the <em>application</em> dies: <code>Exited (130)</code>, 128 + 2. We repeated it on nginx: <code>signal 2 (SIGINT) received, exiting</code>, container <code>Exited (0)</code>. Ctrl-P Ctrl-Q only works when the container was started with <code>-it</code>; for a <code>-d</code> container without a TTY there is no safe detach key — close the terminal, or never attach. macOS has no <code>timeout</code> command, which is why this was measured on Linux.</p>
<pre><code>docker rm -f t &gt;/dev/null
docker run -d --name repl -it node:22-alpine node        <span class="tok-comment"># -it, but detached</span>
docker attach repl                                        <span class="tok-comment"># now you have the REPL</span>
<span class="tok-comment"># type: 2 ** 32   then Ctrl-P Ctrl-Q to leave it running</span></code></pre>

<h3>What -i and -t actually do</h3>
${slide('dk-02', 17, '-i giữ stdin, -t cấp terminal — dùng sai là hỏng im lặng')}
<div class="lz-map">
  <div class="lz-stage">-i (interactive)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Keeps stdin open and connected</span><span class="lz-nsub">Without it the container's stdin is closed immediately, so anything reading input sees EOF at once. This is the flag you need when PIPING data in.</span></div></div>
  <div class="lz-stage">-t (tty)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Allocates a pseudo-terminal</span><span class="lz-nsub">Gives you a prompt, line editing, colours, Ctrl-C handling and terminal size. Programs also detect it and change behaviour — colour output, progress bars, interactive prompts.</span></div></div>
  <div class="lz-stage">-it</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">An interactive shell, behaving normally</span><span class="lz-nsub">The combination you want whenever a human is typing.</span></div></div>
  <div class="lz-stage">-i alone</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">For pipes and scripts</span><span class="lz-nsub">The correct form in CI and in shell pipelines: no TTY means no control characters mixed into the output.</span></div></div>
</div>
<pre><code>echo '{"b":2,"a":1}' | docker run --rm -i ghcr.io/jqlang/jq -S .   <span class="tok-comment"># correct</span>
echo '{"b":2,"a":1}' | docker run --rm    ghcr.io/jqlang/jq -S .; echo "exit=\$?"   <span class="tok-comment"># stdin closed</span>
docker run --rm -t alpine echo hi | cat -v
docker run --rm -t alpine ls /etc | head -1 | cat -v</code></pre>
<div class="out">{
  "a": 1,
  "b": 2
}
exit=0
hi^M
^[[0;0malpine-release^[[m   ^[[0;0missue^[[m            ^[[1;34mopt^[[m              ^[[0;0msecuretty^[[m^M</div>
<p>Re-run on Docker 29 (course Mac). The second command is the dangerous one: stdin was never connected, so jq saw empty input, printed <strong>nothing</strong> and still exited <strong>0</strong> — a script would carry on as if it had worked. (An earlier version of this lesson showed a jq error message there; that was wrong.) The last two show why <code>-t</code> in a pipeline is a mistake: the TTY turns every newline into <code>\\r\\n</code> (the <code>^M</code>), and <code>ls</code>, seeing a terminal, switches to colour escape codes and columns — all of it lands in the text your script is trying to parse. A program can check this itself: <code>[ -t 1 ]</code> prints <code>KHONG</code> without <code>-t</code> and <code>TTY</code> with it. <strong>Human at a keyboard: <code>-it</code>. Script or pipe: <code>-i</code> only.</strong></p>

<h3>When the image has no shell</h3>
${slide('dk-02', 18, 'Ảnh không có shell? Cho một container phụ ngồi cạnh')}
<pre><code>docker run -d --name api -p 18023:80 traefik/whoami   <span class="tok-comment"># a real web server built FROM scratch</span>
docker exec api sh; echo "exit=\$?"
docker exec api ls; echo "exit=\$?"
docker images traefik/whoami</code></pre>
<div class="out">OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH
exit=127
OCI runtime exec failed: exec failed: unable to start container process: exec: "ls": executable file not found in $PATH
exit=127
IMAGE                   ID             DISK USAGE   CONTENT SIZE   EXTRA
traefik/whoami:latest   c4717a8d1f01         18MB         4.73MB   U</div>
<p>Distroless and <code>scratch</code> images contain your binary and nothing else — no shell, no <code>ls</code>, no package manager. That is a security feature (Chapter 6): an attacker who gets code execution finds no tools. It also means your usual debugging move does not work. Three approaches, in order of preference:</p>
<div class="callout warn"><strong>Correction.</strong> The earlier demo here fell back to an alpine container when the distroless one would not start — and alpine HAS a shell, so the "sh not found" line could not have come from it. The demo above uses <code>traefik/whoami</code>, a real web server shipped as one Go binary on <code>scratch</code> (4.73 MB to download), and every output is from the course Mac.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A sidecar sharing the namespaces</span><span class="lz-t">docker run --rm -it --pid=container:api --net=container:api nicolaka/netshoot</span><span class="lz-d">A fully-equipped debug container that joins the target's process and network namespaces. You get <code>ps</code>, <code>ss</code>, <code>dig</code>, <code>curl</code>, <code>tcpdump</code>, and can read the target's files through <code>/proc/1/root/</code>. Nothing is installed into the image being debugged.</span></div>
  <div class="lz-step"><span class="lz-k">2 · docker debug</span><span class="lz-t">docker debug api</span><span class="lz-d">Docker Desktop's built-in version of the same idea: attaches a toolbox shell to any container, including distroless ones, and leaves no trace. It once required a paid Pro/Team/Business plan; the current reference page lists no such requirement, and <code>docker debug -c 'ps; ls /' api</code> ran on the course Mac (Docker Desktop 4.91) after pulling a small helper image (checked 09/2026).</span></div>
  <div class="lz-step"><span class="lz-k">3 · Pull the evidence out instead</span><span class="lz-t">docker cp api:/app/config.json - | tar -xO</span><span class="lz-d">Works on stopped containers too (Lesson 1.4). Often you do not need a shell — you need one file, or the exit code, or the environment, and <code>cp</code> plus <code>inspect</code> give you all three.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Or a debug build tag</span><span class="lz-t">a second Dockerfile stage FROM alpine with the same binary</span><span class="lz-d">The disciplined answer: ship distroless, keep a <code>:debug</code> tag from the same build with a shell in it. Chapter 6 shows the two-line multi-stage change that produces both.</span></div>
</div>
<pre><code><span class="tok-comment"># Approach 1 in full — read the target's filesystem through /proc</span>
docker run --rm --pid=container:api --net=container:api \\
  nicolaka/netshoot sh -c 'ps -o pid,args; ls /proc/1/root; ss -tlnp'</code></pre>
<div class="out">PID   COMMAND
    1 /whoami
   45 sh -c ps -o pid,args; ls /proc/1/root; ss -tlnp
   50 ps -o pid,args
dev
etc
proc
sys
usr
whoami
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      4096               *:80              *:*    users:(("whoami",pid=1,fd=4))</div>
<p><code>/proc/1/root/</code> is the target container's root filesystem, visible because the two containers share a PID namespace. This is the single most useful debugging trick in the course, and it works on any image no matter how minimal.</p>
<p>Read the output line by line: PID 1 is <code>/whoami</code> — the sidecar sees the target's processes, not its own world; <code>/proc/1/root</code> lists the six entries of a scratch image (no <code>bin</code>, no <code>sh</code>); and <code>ss</code> shows the server listening on <code>*:80</code>, owned by pid 1. The sidecar ran as root and the target also runs as root; if the target runs as another user, add <code>--cap-add SYS_PTRACE</code> so root in the sidecar is allowed to look inside it. netshoot is big (918 MB on disk) — pull it once, before the night you need it.</p>

<h3>From the host, with nsenter</h3>
${slide('dk-02', 19, 'Bốn đường vào một container — chọn theo cái bạn có')}
<pre><code>PID=\$(docker inspect -f '{{.State.Pid}}' web)
sudo nsenter -t \$PID -n ss -tlnp          <span class="tok-comment"># enter only the NETWORK namespace</span>
sudo nsenter -t \$PID -m ls /etc/nginx | head -3</code></pre>
<div class="out">State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port
LISTEN 0      511           0.0.0.0:80         0.0.0.0:*
conf.d
fastcgi.conf
mime.types</div>
<p><code>nsenter</code> runs a <em>host</em> binary inside a chosen subset of the container's namespaces. Because the tool comes from the host, the container needs nothing at all — which makes this the last-resort answer for a distroless image on a machine where you cannot pull a debug image. Requires root on the host.</p>
<p><strong>No sudo? Borrow it from Docker.</strong> Anyone in the <code>docker</code> group can start a privileged helper that shares the host's PID namespace and run <code>nsenter</code> from there — which is also a reminder of why docker-group membership is root-equivalent. On the course's Linux machine (no sudo, Docker 29.6):</p>
<pre><code class="language-bash">PID=\$(docker inspect -f '{{.State.Pid}}' web)
docker run --rm --privileged --pid=host alpine nsenter -t \$PID -n netstat -tln
docker run --rm --privileged --pid=host alpine nsenter -t \$PID -n ip -4 -o addr</code></pre>
<div class="out">Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 :::80                   :::*                    LISTEN
1: lo    inet 127.0.0.1/8 scope host lo\\       valid_lft forever preferred_lft forever
2: eth0    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0\\       valid_lft forever preferred_lft forever</div>
<p><code>-n</code> enters only the network namespace, so <code>netstat</code> and <code>ip</code> are alpine's tools looking at the container's network: nginx on port 80 and the container's own <code>172.17.0.3</code>. On a Mac, <code>--pid=host</code> means the Docker Desktop VM, and the same trick works there.</p>
<pre><code>docker rm -f web api repl &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team's new API image is distroless. It "runs" — <code>docker ps</code> says Up — but <code>curl</code> gets an empty reply, and <code>docker exec … sh</code> fails. Find out what port it really listens on without adding anything to the image.</p><ol>
<li>Recreate it: <code>docker run -d --name thu-who -p 127.0.0.1:8081:8080 traefik/whoami</code>, then <code>curl -s localhost:8081; echo "exit=\$?"</code>.</li>
<li>Try the usual door: <code>docker exec thu-who sh</code>. Note the exit code.</li>
<li>Use a sidecar that shares only the network namespace: <code>docker run --rm --net=container:thu-who nicolaka/netshoot ss -tln</code>. What port is it on?</li>
<li>Fix the mapping (remove and re-run with the right container port) and prove it with <code>curl</code>.</li>
<li>Bonus: <code>docker run -dit --name thu-repl node:22-alpine node</code>, <code>docker attach thu-repl</code>, type <code>2 ** 32</code>, leave with Ctrl-P Ctrl-Q, and check it is still Up. Clean up: <code>docker rm -f thu-who thu-repl</code>.</li></ol>
<div class="out">exit=52
OCI runtime exec failed: … exec: "sh": executable file not found in $PATH
LISTEN 0      4096               *:80              *:*
Hostname: f91e522a2e37</div>
<p><strong>Done when:</strong> you got curl exit 52 (empty reply) at first, the sidecar showed the server on port 80, the fixed container answers with a <code>Hostname:</code> line, and you can explain why <code>exec</code> could not help but <code>--net=container:</code> could.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exec</span><span class="v">Start an additional process inside a running container's namespaces. Exiting it does not stop the container.</span></div>
  <div class="kv"><span class="k">attach</span><span class="v">Connect your terminal to PID 1's own stdin/stdout. Signals you send go to the application.</span></div>
  <div class="kv"><span class="k">TTY / pseudo-terminal</span><span class="v">A fake terminal (<code>-t</code>): gives prompts and colours, and changes how programs format output.</span></div>
  <div class="kv"><span class="k">stdin (-i)</span><span class="v">The input stream. Without <code>-i</code> the container's stdin is closed and piped data is silently lost.</span></div>
  <div class="kv"><span class="k">Distroless / scratch image</span><span class="v">An image with only your program — no shell, no <code>ls</code>. Smaller and safer, harder to debug.</span></div>
  <div class="kv"><span class="k">Sidecar (debug container)</span><span class="v">A second container that joins the target's namespaces (<code>--pid=container:X --net=container:X</code>) and brings the tools.</span></div>
  <div class="kv"><span class="k">nsenter</span><span class="v">A Linux tool that runs a command inside chosen namespaces of another process.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>exec</code> adds a new process; leaving it is harmless. <code>attach</code> is PID 1's own terminal.</li>
<li>Signals sent to <code>docker attach</code> reach the app: Ctrl-C killed the shell loop (130) and nginx (0); detach with Ctrl-P Ctrl-Q only under <code>-it</code>.</li>
<li>Human typing: <code>-it</code>. Pipes and scripts: <code>-i</code> only — without it jq silently printed nothing and exited 0.</li>
<li><code>-t</code> in a pipeline adds <code>^M</code> and colour codes to your output.</li>
<li>No shell in the image: a sidecar with <code>--pid=container:X --net=container:X</code> sees its processes, its files via <code>/proc/1/root</code>, its ports.</li>
<li><code>exec</code> is for finding the problem; the fix goes into the Dockerfile or compose file.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/exec/" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">docker exec — reference</span><span class="lc-sub">Every flag, and the important detail that exec'd processes are not restarted when the container restarts, and do not receive the container's stop signal.</span></span>
</a>
<a class="link-card" href="https://github.com/nicolaka/netshoot" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">netshoot — a container debugging toolbox</span><span class="lc-sub">Every network tool you might want in one image, with a README full of recipes for joining another container's namespaces. Worth pulling before you need it.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/nsenter.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">nsenter(1)</span><span class="lc-sub">Entering namespaces from the host, one flag per namespace. The escape hatch when the container has no tools and you cannot add any.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: get inside anything</span><span class="lc-sub">Graded exercises: pipe JSON into a container correctly, detach from an attached session without killing it, read a file out of a distroless container, and use a sidecar to find what a shell-less image is listening on.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> fixing a container with <code>docker exec</code> and considering the problem solved. <code>docker exec -u root web apk add curl</code> works, and the change lives only in that container's writable layer — so it disappears at the next deploy, is absent from every other replica, and exists in no file anyone can review. The rule: <code>exec</code> is for <em>discovering</em> what is wrong; the fix belongs in the Dockerfile, the Compose file, or the environment. If you have exec'd the same fix twice, you have found something that belongs in the image.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>exec</code> starts a new process and is safe; <code>attach</code> connects to PID 1 and Ctrl-C there stops your application — detach with Ctrl-P Ctrl-Q. Use <code>-it</code> when a human is typing and <code>-i</code> alone in pipes and scripts, because a TTY injects escape codes into output you are parsing. And an image with no shell is not undebuggable: join its namespaces with a sidecar (<code>--pid=container:X</code>) and read its filesystem through <code>/proc/1/root/</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Vào bên trong, kể cả khi không có shell nào</h2>
<p class="lead">Đọc log cho bạn biết container đã NÓI gì. Vào bên trong cho bạn biết nó LÀ gì — file nào tồn tại, môi trường thật ra chứa những gì, nó có với tới được cơ sở dữ liệu không. Bài này là hai đường vào, khác biệt giữa chúng (một trong hai có thể làm sập ứng dụng của bạn), và phải làm gì khi cái ảnh CỐ Ý không chứa shell nào cả.</p>

<h3>exec: một tiến trình MỚI trong cùng những namespace</h3>
${slide('dk-02', 15, 'exec mở tiến trình MỚI — attach nối vào chính PID 1')}
<pre><code>docker run -d --name web -p 8080:80 nginx:1.27-alpine
docker exec -it web sh -c 'ls /etc/nginx; echo; id; echo; hostname'
docker exec web cat /etc/nginx/conf.d/default.conf | head -5
docker exec web env | grep NGINX</code></pre>
<div class="out">conf.d  fastcgi.conf  mime.types  nginx.conf  scgi_params  uwsgi_params

uid=0(root) gid=0(root) groups=0(root)

8c40e93b1a41
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;
NGINX_VERSION=1.27.2</div>
<p><code>docker exec</code> khởi chạy một tiến trình <strong>BỔ SUNG</strong> bên trong những namespace SẴN CÓ của container (Bài 1.1). Nó thấy cùng hệ thống file, cùng mạng và cùng bảng tiến trình — nhưng nó KHÔNG phải PID 1, nên thoát khỏi shell của bạn không dừng container, và Ctrl-C chỉ ảnh hưởng câu lệnh của bạn.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-it</span><span class="v">Cho một shell tương tác. Riêng <code>-i</code> là đủ để đổ dữ liệu qua ống dẫn; riêng <code>-t</code> thì gần như chẳng bao giờ là thứ bạn muốn.</span></div>
  <div class="kv"><span class="k">-u root</span><span class="v">Chạy dưới một người dùng khác. Thiết yếu khi ảnh chạy dưới một người dùng không đặc quyền (Chương 6) và bạn cần cài một công cụ gỡ lỗi hay đọc một file thuộc root.</span></div>
  <div class="kv"><span class="k">-w /đường/dẫn</span><span class="v">Bắt đầu ở một thư mục cụ thể thay vì <code>WORKDIR</code> của ảnh.</span></div>
  <div class="kv"><span class="k">-e BIẾN=giá trị</span><span class="v">Thêm biến môi trường chỉ cho câu lệnh này. Hữu ích với <code>-e PGPASSWORD=…</code> để một mật khẩu không rơi vào lịch sử shell trên máy chủ.</span></div>
  <div class="kv"><span class="k">--privileged</span><span class="v">Cấp cho tiến trình exec đầy đủ capability. Thỉnh thoảng cần để chạy <code>tcpdump</code> hay <code>strace</code> bên trong; hãy coi nó như một khẩu súng đã lên đạn.</span></div>
</div>
<pre><code><span class="tok-comment"># Cái ảnh này THẬT SỰ có shell nào?</span>
docker exec web sh -c 'ls -l /bin/sh; command -v bash || echo "không có bash"'
docker run --rm ubuntu:24.04 bash -c 'echo ubuntu có bash'</code></pre>
<div class="out">lrwxrwxrwx 1 root root 12 Aug  1 12:03 /bin/sh -&gt; /bin/busybox
không có bash
ubuntu có bash</div>
<p>Ảnh nền Alpine có <code>/bin/sh</code> (ash của busybox) và KHÔNG có <code>bash</code>. <code>docker exec -it web bash</code> hỏng với <code>exec: "bash": executable file not found in $PATH</code>, nghe như container hỏng và chẳng có nghĩa gì như thế cả. Hãy với tay tới <code>sh</code> trước; nó có mặt gần như ở mọi nơi.</p>
<p><strong>Kiểm lại trên Docker 29.</strong> <code>docker exec web bash</code> in ra <code>OCI runtime exec failed: exec failed: unable to start container process: exec: "bash": executable file not found in $PATH</code> và thoát với mã <strong>127</strong> — đúng mã "không tìm thấy lệnh" như ở Bài 2.1. (Bản trước của bài này ở khối tiếng Việt viết <code>bash -c 'ubuntu có bash'</code> — thiếu <code>echo</code>, nên thật ra nó in <code>bash: line 1: ubuntu: command not found</code>; đã sửa ở trên.) Còn nếu bạn chạy <code>docker exec -it …</code> từ một script, một job CI hay bất cứ chỗ nào mà stdin của chính bạn không phải bàn phím, bạn sẽ nhận <code>cannot attach stdin to a TTY-enabled container because stdin is not a terminal</code> (Docker cũ nói <code>the input device is not a TTY</code>; Git Bash trên Windows cần <code>winpty docker exec -it …</code> vì cùng lý do). Ở những chỗ đó hãy bỏ <code>-t</code>.</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th><th>Khi nào dùng</th></tr>
<tr><td><code>-it</code></td><td>Shell tương tác</td><td><code>docker exec -it web sh</code></td><td>Bạn đang gõ</td></tr>
<tr><td><code>-i</code></td><td>Chỉ stdin, không TTY</td><td><code>docker exec -i db psql -U postgres &lt; dump.sql</code></td><td>Đổ file vào; script; CI</td></tr>
<tr><td><code>-u</code></td><td>Chạy dưới người dùng khác</td><td><code>docker exec -u root web id</code></td><td>Ảnh chạy user thường mà bạn cần root để soi</td></tr>
<tr><td><code>-w</code></td><td>Thư mục làm việc</td><td><code>docker exec -w /app api ls</code></td><td>Công cụ cần bắt đầu trong thư mục dự án</td></tr>
<tr><td><code>-e</code></td><td>Thêm biến chỉ cho lệnh này</td><td><code>docker exec -e PGPASSWORD=… db psql …</code></td><td>Giữ bí mật khỏi cấu hình vĩnh viễn của container</td></tr>
<tr><td><code>-d</code></td><td>Chạy tiến trình phụ ở nền</td><td><code>docker exec -d web sh -c 'sleep 60'</code></td><td>Hiếm; nó chết theo container và không được dựng lại</td></tr>
<tr><td><code>--privileged</code></td><td>Đủ mọi capability cho tiến trình này</td><td><code>docker exec --privileged web …</code></td><td>Cách cuối cùng để chạy <code>tcpdump</code>/<code>strace</code></td></tr>
</table>

<h3>attach: nối vào chính cái terminal của PID 1</h3>
${slide('dk-02', 16, 'Đo thật: tín hiệu gửi vào docker attach đi thẳng tới app')}
<pre><code>docker run -d --name t alpine sh -c 'while true; do date; sleep 2; done'
timeout -k 3 4 docker attach t              <span class="tok-comment"># SIGTERM sau 4 s, SIGKILL thêm 3 s sau</span>
docker ps --filter name=t --format '{{.Names}} {{.Status}}'
timeout -s INT 3 docker attach t            <span class="tok-comment"># SIGINT = đúng thứ Ctrl-C gửi</span>
docker ps -a --filter name=t --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">Wed Sep 23 14:34:40 UTC 2026
Wed Sep 23 14:34:42 UTC 2026
Wed Sep 23 14:34:44 UTC 2026
bash: line 2: 399854 Killed                     timeout -k 3 4 docker attach t
t Up 7 seconds
Wed Sep 23 14:34:46 UTC 2026
Wed Sep 23 14:34:48 UTC 2026
t Exited (130) 1 second ago</div>
<div class="callout warn"><strong><code>docker attach</code> nối terminal của bạn vào stdin/stdout của PID 1 — nên Ctrl-C gửi SIGINT cho ỨNG DỤNG và thường là dừng container.</strong> Điều này làm bất ngờ những người với tay tới attach mà chờ đợi một thứ kiểu <code>tail -f</code>. Nếu bạn đã attach và muốn thoát ra mà không giết gì thì tổ hợp tách rời là <strong>Ctrl-P Ctrl-Q</strong>. Muốn xem output an toàn thì dùng <code>docker logs -f</code>; muốn có dấu nhắc thì dùng <code>docker exec</code>. Attach chỉ thật sự hữu ích khi bạn cần <em>GỬI ĐẦU VÀO</em> cho PID 1 — chẳng hạn một REPL tương tác mà bạn đã khởi chạy với <code>-d</code>.</div>
<p><strong>Phép đo ở trên cho thấy gì (Linux, Docker 29.6).</strong> Bản trước của bài này nói <code>timeout 5 docker attach t</code> sẽ trả về sau năm giây và container vẫn chạy. Không phải vậy: <code>docker attach</code> <em>CHUYỂN TIẾP</em> tín hiệu nó nhận được tới PID 1 (<code>--sig-proxy</code>, mặc định bật), vòng lặp shell làm PID 1 thì lờ SIGTERM đi (Bài 1.3), và lệnh attach cứ thế in tiếp — <code>timeout</code> phải SIGKILL nó. Lần gọi thứ hai gửi SIGINT, đúng thứ Ctrl-C gửi, và <em>ỨNG DỤNG</em> chết: <code>Exited (130)</code>, tức 128 + 2. Chúng tôi làm lại với nginx: <code>signal 2 (SIGINT) received, exiting</code>, container <code>Exited (0)</code>. Ctrl-P Ctrl-Q chỉ dùng được khi container chạy với <code>-it</code>; với một container <code>-d</code> không có TTY thì không có phím tách an toàn nào — đóng terminal, hoặc đừng bao giờ attach. macOS không có lệnh <code>timeout</code>, nên phép đo này làm trên Linux.</p>
<pre><code>docker rm -f t &gt;/dev/null
docker run -d --name repl -it node:22-alpine node        <span class="tok-comment"># -it, nhưng chạy nền</span>
docker attach repl                                        <span class="tok-comment"># giờ bạn có cái REPL</span>
<span class="tok-comment"># gõ: 2 ** 32   rồi Ctrl-P Ctrl-Q để rời đi mà vẫn để nó chạy</span></code></pre>

<h3>-i và -t thật ra làm gì</h3>
${slide('dk-02', 17, '-i giữ stdin, -t cấp terminal — dùng sai là hỏng im lặng')}
<div class="lz-map">
  <div class="lz-stage">-i (interactive)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Giữ stdin mở và được nối</span><span class="lz-nsub">Không có nó thì stdin của container bị đóng ngay lập tức, nên thứ gì đang đọc đầu vào sẽ thấy EOF ngay. Đây là cái cờ bạn cần khi ĐỔ dữ liệu vào.</span></div></div>
  <div class="lz-stage">-t (tty)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cấp một terminal giả</span><span class="lz-nsub">Cho bạn dấu nhắc, sửa dòng, màu sắc, xử lý Ctrl-C và kích thước terminal. Các chương trình cũng phát hiện ra nó và đổi hành vi — output có màu, thanh tiến trình, câu hỏi tương tác.</span></div></div>
  <div class="lz-stage">-it</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một shell tương tác, hành xử bình thường</span><span class="lz-nsub">Tổ hợp bạn muốn mỗi khi có một CON NGƯỜI đang gõ.</span></div></div>
  <div class="lz-stage">chỉ -i</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cho ống dẫn và script</span><span class="lz-nsub">Dạng ĐÚNG trong CI và trong đường ống shell: không có TTY nghĩa là không có ký tự điều khiển lẫn vào output.</span></div></div>
</div>
<pre><code>echo '{"b":2,"a":1}' | docker run --rm -i ghcr.io/jqlang/jq -S .   <span class="tok-comment"># đúng</span>
echo '{"b":2,"a":1}' | docker run --rm    ghcr.io/jqlang/jq -S .; echo "exit=\$?"   <span class="tok-comment"># stdin bị đóng</span>
docker run --rm -t alpine echo hi | cat -v
docker run --rm -t alpine ls /etc | head -1 | cat -v</code></pre>
<div class="out">{
  "a": 1,
  "b": 2
}
exit=0
hi^M
^[[0;0malpine-release^[[m   ^[[0;0missue^[[m            ^[[1;34mopt^[[m              ^[[0;0msecuretty^[[m^M</div>
<p>Chạy lại trên Docker 29 (máy Mac của khoá). Câu lệnh thứ hai mới là câu nguy hiểm: stdin chưa từng được nối, nên jq thấy đầu vào rỗng, in ra <strong>KHÔNG GÌ</strong> và vẫn thoát với mã <strong>0</strong> — một script sẽ đi tiếp như thể đã chạy xong. (Bản trước của bài này in một thông báo lỗi jq ở đó; điều đó sai.) Hai câu cuối cho thấy vì sao <code>-t</code> trong một đường ống là một sai lầm: cái TTY biến mỗi dấu xuống dòng thành <code>\\r\\n</code> (chữ <code>^M</code>), còn <code>ls</code> thấy có terminal thì chuyển sang mã màu và xếp cột — tất cả rơi vào đúng thứ chữ mà script của bạn đang cố phân tích. Chương trình tự kiểm được điều này: <code>[ -t 1 ]</code> in <code>KHONG</code> khi không có <code>-t</code> và <code>TTY</code> khi có. <strong>Người ngồi trước bàn phím: <code>-it</code>. Script hay ống dẫn: chỉ <code>-i</code>.</strong></p>

<h3>Khi cái ảnh không có shell nào</h3>
${slide('dk-02', 18, 'Ảnh không có shell? Cho một container phụ ngồi cạnh')}
<pre><code>docker run -d --name api -p 18023:80 traefik/whoami   <span class="tok-comment"># một web server thật, dựng FROM scratch</span>
docker exec api sh; echo "exit=\$?"
docker exec api ls; echo "exit=\$?"
docker images traefik/whoami</code></pre>
<div class="out">OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH
exit=127
OCI runtime exec failed: exec failed: unable to start container process: exec: "ls": executable file not found in $PATH
exit=127
IMAGE                   ID             DISK USAGE   CONTENT SIZE   EXTRA
traefik/whoami:latest   c4717a8d1f01         18MB         4.73MB   U</div>
<p>Ảnh distroless và <code>scratch</code> chỉ chứa chương trình của bạn và không gì khác — không shell, không <code>ls</code>, không trình quản lý gói. Đó là một TÍNH NĂNG an ninh (Chương 6): một kẻ tấn công chiếm được quyền chạy mã sẽ chẳng tìm thấy công cụ nào. Nó cũng nghĩa là nước cờ gỡ lỗi quen thuộc của bạn không dùng được. Ba cách tiếp cận, xếp theo mức độ nên ưu tiên:</p>
<div class="callout warn"><strong>Đính chính.</strong> Bản demo trước ở đây lùi về một container alpine khi container distroless không khởi động được — mà alpine thì CÓ shell, nên dòng "sh not found" không thể đến từ nó. Demo ở trên dùng <code>traefik/whoami</code>, một web server thật đóng gói thành đúng một file chạy Go trên <code>scratch</code> (tải về 4,73 MB), và mọi output là từ máy Mac của khoá.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một container phụ dùng chung namespace</span><span class="lz-t">docker run --rm -it --pid=container:api --net=container:api nicolaka/netshoot</span><span class="lz-d">Một container gỡ lỗi trang bị đầy đủ, gia nhập namespace tiến trình và mạng của mục tiêu. Bạn có <code>ps</code>, <code>ss</code>, <code>dig</code>, <code>curl</code>, <code>tcpdump</code>, và đọc được file của mục tiêu qua <code>/proc/1/root/</code>. Không có gì bị cài vào cái ảnh đang bị gỡ lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">2 · docker debug</span><span class="lz-t">docker debug api</span><span class="lz-d">Bản dựng sẵn của cùng ý tưởng đó trong Docker Desktop: gắn một shell hộp công cụ vào container bất kỳ, kể cả distroless, và không để lại dấu vết. Từng chỉ dành cho gói trả phí Pro/Team/Business; trang tài liệu hiện tại không còn ghi yêu cầu đó, và <code>docker debug -c 'ps; ls /' api</code> đã chạy được trên máy Mac của khoá (Docker Desktop 4.91) sau khi tự kéo một ảnh trợ giúp nhỏ (kiểm 09/2026).</span></div>
  <div class="lz-step"><span class="lz-k">3 · Hoặc lôi bằng chứng ra thay vì chui vào</span><span class="lz-t">docker cp api:/app/config.json - | tar -xO</span><span class="lz-d">Chạy được cả với container đã dừng (Bài 1.4). Rất thường là bạn KHÔNG cần một cái shell — bạn cần MỘT file, hoặc mã thoát, hoặc môi trường, và <code>cp</code> cộng <code>inspect</code> cho bạn cả ba.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Hoặc một tag dựng riêng để gỡ lỗi</span><span class="lz-t">một stage thứ hai FROM alpine với cùng cái chương trình</span><span class="lz-d">Câu trả lời có kỷ luật: đem đi bản distroless, giữ một tag <code>:debug</code> từ cùng lượt dựng có shell bên trong. Chương 6 chỉ ra thay đổi hai dòng trong dựng nhiều tầng để có cả hai.</span></div>
</div>
<pre><code><span class="tok-comment"># Cách 1 đầy đủ — đọc hệ thống file của mục tiêu qua /proc</span>
docker run --rm --pid=container:api --net=container:api \\
  nicolaka/netshoot sh -c 'ps -o pid,args; ls /proc/1/root; ss -tlnp'</code></pre>
<div class="out">PID   COMMAND
    1 /whoami
   45 sh -c ps -o pid,args; ls /proc/1/root; ss -tlnp
   50 ps -o pid,args
dev
etc
proc
sys
usr
whoami
State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
LISTEN 0      4096               *:80              *:*    users:(("whoami",pid=1,fd=4))</div>
<p><code>/proc/1/root/</code> chính là hệ thống file gốc của container mục tiêu, nhìn thấy được vì hai container dùng chung một namespace tiến trình. Đây là mẹo gỡ lỗi hữu dụng nhất trong cả khoá này, và nó chạy được với MỌI ảnh dù tối giản tới đâu.</p>
<p>Đọc output từng dòng: PID 1 là <code>/whoami</code> — container phụ thấy tiến trình của mục tiêu chứ không phải thế giới riêng của nó; <code>/proc/1/root</code> liệt kê sáu mục của một ảnh scratch (không <code>bin</code>, không <code>sh</code>); còn <code>ss</code> cho thấy server nghe ở <code>*:80</code>, thuộc pid 1. Container phụ chạy dưới root và mục tiêu cũng chạy dưới root; nếu mục tiêu chạy dưới người dùng khác thì thêm <code>--cap-add SYS_PTRACE</code> để root trong container phụ được phép nhìn vào nó. netshoot khá nặng (918 MB trên đĩa) — hãy kéo về một lần, trước cái đêm bạn cần tới nó.</p>

<h3>Từ máy chủ, bằng nsenter</h3>
${slide('dk-02', 19, 'Bốn đường vào một container — chọn theo cái bạn có')}
<pre><code>PID=\$(docker inspect -f '{{.State.Pid}}' web)
sudo nsenter -t \$PID -n ss -tlnp          <span class="tok-comment"># chỉ vào namespace MẠNG</span>
sudo nsenter -t \$PID -m ls /etc/nginx | head -3</code></pre>
<div class="out">State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port
LISTEN 0      511           0.0.0.0:80         0.0.0.0:*
conf.d
fastcgi.conf
mime.types</div>
<p><code>nsenter</code> chạy một chương trình của <em>MÁY CHỦ</em> bên trong một tập con namespace của container mà bạn chọn. Vì công cụ đến từ máy chủ nên container không cần gì cả — điều đó khiến đây thành câu trả lời cuối cùng cho một ảnh distroless trên một cái máy mà bạn không kéo được ảnh gỡ lỗi về. Cần quyền root trên máy chủ.</p>
<p><strong>Không có sudo? Mượn nó từ Docker.</strong> Ai nằm trong nhóm <code>docker</code> cũng khởi chạy được một container trợ giúp đặc quyền dùng chung namespace PID của máy chủ và chạy <code>nsenter</code> từ đó — và đây cũng là lời nhắc vì sao thuộc nhóm docker thì tương đương root. Trên máy Linux của khoá (không sudo, Docker 29.6):</p>
<pre><code class="language-bash">PID=\$(docker inspect -f '{{.State.Pid}}' web)
docker run --rm --privileged --pid=host alpine nsenter -t \$PID -n netstat -tln
docker run --rm --privileged --pid=host alpine nsenter -t \$PID -n ip -4 -o addr</code></pre>
<div class="out">Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 :::80                   :::*                    LISTEN
1: lo    inet 127.0.0.1/8 scope host lo\\       valid_lft forever preferred_lft forever
2: eth0    inet 172.17.0.3/16 brd 172.17.255.255 scope global eth0\\       valid_lft forever preferred_lft forever</div>
<p><code>-n</code> chỉ vào namespace mạng, nên <code>netstat</code> và <code>ip</code> là công cụ của alpine đang nhìn vào mạng của container: nginx ở cổng 80 và địa chỉ <code>172.17.0.3</code> của chính container. Trên Mac, <code>--pid=host</code> nghĩa là máy ảo Docker Desktop, và mẹo này cũng chạy được ở đó.</p>
<pre><code>docker rm -f web api repl &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> ảnh API mới của nhóm là distroless. Nó "chạy" — <code>docker ps</code> báo Up — nhưng <code>curl</code> nhận về một câu trả lời rỗng, còn <code>docker exec … sh</code> thì hỏng. Tìm xem nó thật sự nghe cổng nào mà không thêm gì vào cái ảnh.</p><ol>
<li>Dựng lại: <code>docker run -d --name thu-who -p 127.0.0.1:8081:8080 traefik/whoami</code>, rồi <code>curl -s localhost:8081; echo "exit=\$?"</code>.</li>
<li>Thử cánh cửa quen thuộc: <code>docker exec thu-who sh</code>. Ghi lại mã thoát.</li>
<li>Dùng một container phụ chỉ dùng chung namespace mạng: <code>docker run --rm --net=container:thu-who nicolaka/netshoot ss -tln</code>. Nó đang ở cổng nào?</li>
<li>Sửa ánh xạ cổng (xoá rồi chạy lại với đúng cổng container) và chứng minh bằng <code>curl</code>.</li>
<li>Thêm: <code>docker run -dit --name thu-repl node:22-alpine node</code>, <code>docker attach thu-repl</code>, gõ <code>2 ** 32</code>, rời đi bằng Ctrl-P Ctrl-Q, và kiểm nó vẫn Up. Dọn dẹp: <code>docker rm -f thu-who thu-repl</code>.</li></ol>
<div class="out">exit=52
OCI runtime exec failed: … exec: "sh": executable file not found in $PATH
LISTEN 0      4096               *:80              *:*
Hostname: f91e522a2e37</div>
<p><strong>Đạt khi:</strong> lúc đầu bạn nhận curl exit 52 (câu trả lời rỗng), container phụ cho thấy server ở cổng 80, container đã sửa trả lời bằng một dòng <code>Hostname:</code>, và bạn giải thích được vì sao <code>exec</code> không giúp được mà <code>--net=container:</code> thì được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">exec (chạy thêm tiến trình)</span><span class="v">Khởi chạy một tiến trình BỔ SUNG bên trong namespace của container đang chạy. Thoát nó không dừng container.</span></div>
  <div class="kv"><span class="k">attach (gắn vào)</span><span class="v">Nối terminal của bạn vào stdin/stdout của chính PID 1. Tín hiệu bạn gửi đi tới ứng dụng.</span></div>
  <div class="kv"><span class="k">TTY / pseudo-terminal (terminal giả)</span><span class="v">Một terminal giả lập (<code>-t</code>): có dấu nhắc, màu sắc, và làm chương trình đổi cách định dạng output.</span></div>
  <div class="kv"><span class="k">stdin (đầu vào chuẩn, -i)</span><span class="v">Luồng đầu vào. Không có <code>-i</code> thì stdin của container bị đóng và dữ liệu đổ vào bị mất trong im lặng.</span></div>
  <div class="kv"><span class="k">Distroless / scratch (ảnh tối giản)</span><span class="v">Ảnh chỉ có chương trình của bạn — không shell, không <code>ls</code>. Nhỏ hơn, an toàn hơn, khó gỡ lỗi hơn.</span></div>
  <div class="kv"><span class="k">Sidecar (container phụ để gỡ lỗi)</span><span class="v">Container thứ hai gia nhập namespace của mục tiêu (<code>--pid=container:X --net=container:X</code>) và mang theo công cụ.</span></div>
  <div class="kv"><span class="k">nsenter (vào namespace)</span><span class="v">Công cụ Linux chạy một lệnh bên trong các namespace được chọn của một tiến trình khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>exec</code> thêm một tiến trình mới; rời khỏi nó là vô hại. <code>attach</code> là terminal của chính PID 1.</li>
<li>Tín hiệu gửi vào <code>docker attach</code> tới thẳng app: Ctrl-C giết vòng lặp shell (130) và nginx (0); tách an toàn bằng Ctrl-P Ctrl-Q chỉ khi có <code>-it</code>.</li>
<li>Người gõ: <code>-it</code>. Ống dẫn và script: chỉ <code>-i</code> — thiếu nó, jq im lặng không in gì mà vẫn thoát 0.</li>
<li><code>-t</code> trong đường ống thêm <code>^M</code> và mã màu vào output của bạn.</li>
<li>Ảnh không có shell: container phụ với <code>--pid=container:X --net=container:X</code> thấy tiến trình, file (qua <code>/proc/1/root</code>) và cổng của nó.</li>
<li><code>exec</code> để TÌM vấn đề; cách sửa thuộc về Dockerfile hoặc file compose.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/exec/" target="_blank" rel="noopener">
  <span class="lc-ico">🚪</span>
  <span class="lc-body"><span class="lc-title">docker exec — tài liệu tra cứu</span><span class="lc-sub">Mọi cờ, và chi tiết quan trọng rằng tiến trình được exec KHÔNG được khởi chạy lại khi container khởi động lại, và không nhận tín hiệu dừng của container.</span></span>
</a>
<a class="link-card" href="https://github.com/nicolaka/netshoot" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">netshoot — hộp công cụ gỡ lỗi container</span><span class="lc-sub">Mọi công cụ mạng bạn có thể cần gói trong một ảnh, kèm một README đầy công thức để gia nhập namespace của container khác. Đáng kéo về TRƯỚC KHI bạn cần tới.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/nsenter.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">nsenter(1)</span><span class="lc-sub">Vào namespace từ máy chủ, mỗi namespace một cái cờ. Lối thoát khi container không có công cụ nào và bạn không thêm được cái nào.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: vào được bên trong bất cứ thứ gì</span><span class="lc-sub">Bài chấm điểm: đổ JSON vào một container cho đúng, tách khỏi một phiên đã attach mà không giết nó, đọc một file ra từ một container distroless, và dùng một container phụ để tìm xem một ảnh không-shell đang lắng nghe cái gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> vá một container bằng <code>docker exec</code> rồi coi như xong việc. <code>docker exec -u root web apk add curl</code> chạy được, và thay đổi đó chỉ sống trong tầng ghi được của ĐÚNG container đó — nên nó biến mất ở lần deploy kế tiếp, vắng mặt ở mọi bản sao khác, và không tồn tại trong file nào để ai review. Cái luật: <code>exec</code> là để <em>KHÁM PHÁ</em> xem sai ở đâu; còn cách chữa thì thuộc về Dockerfile, file Compose, hoặc môi trường. Nếu bạn đã exec cùng một bản vá tới lần thứ hai thì bạn vừa tìm ra một thứ thuộc về cái ảnh.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> <code>exec</code> khởi chạy một tiến trình mới và an toàn; <code>attach</code> nối vào PID 1 và Ctrl-C ở đó sẽ dừng ứng dụng của bạn — hãy tách ra bằng Ctrl-P Ctrl-Q. Dùng <code>-it</code> khi có người đang gõ và chỉ <code>-i</code> trong ống dẫn với script, vì một cái TTY sẽ tiêm mã thoát vào đúng thứ output bạn đang phân tích. Và một ảnh không có shell KHÔNG phải là thứ không gỡ lỗi được: hãy gia nhập namespace của nó bằng một container phụ (<code>--pid=container:X</code>) rồi đọc hệ thống file của nó qua <code>/proc/1/root/</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Environment, users and arguments|||2.4 — Môi trường, người dùng và tham số',
      slug: 'dk-2-4-moi-truong-nguoi-dung',
      type: 'LESSON',
      description: 'Biến môi trường đến từ đâu và thứ tự ưu tiên, những chỗ khó chịu của --env-file, vì sao bí mật trong biến môi trường bị lộ, -u với UID số, và bảng ENTRYPOINT cộng CMD.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Environment, users and arguments</h2>
<p class="lead">Three small subjects that cause a disproportionate share of real problems: a variable that is set but not the value you expected, files on a mounted directory owned by root, and an argument that goes to the wrong program. Each has a rule, and the rules are short.</p>

<h3>Where environment variables come from</h3>
${slide('dk-02', 20, 'Bốn nguồn biến môi trường — nguồn sau đè nguồn trước')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. The image's ENV instructions</span><span class="lz-lnote">Baked in at build time and visible to anyone with the image (<code>docker history</code>). The base layer of defaults: <code>NODE_VERSION</code>, <code>PATH</code>, <code>LANG</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. --env-file, in file order</span><span class="lz-lnote">Read verbatim by Docker. Later files override earlier ones, and later lines override earlier lines within a file.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. -e / --env on the command line</span><span class="lz-lnote">Beats both of the above. <code>-e NAME</code> with no <code>=</code> copies the value from your current shell — convenient locally, and in CI, where that variable does not exist, the container silently gets no such variable at all — not even an empty string.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Anything the entrypoint script sets</span><span class="lz-lnote">Runs last, inside the container, so it wins over everything. This is how official images derive values — <code>POSTGRES_USER</code> defaulting to <code>postgres</code>, for example.</span></div>
</div>
<pre><code>printf 'MODE=file\\nSHARED=from-file\\n' &gt; a.env
printf 'SHARED=from-second-file\\n'      &gt; b.env
docker run --rm --env-file a.env --env-file b.env -e MODE=flag alpine \\
  sh -c 'echo "MODE=\$MODE SHARED=\$SHARED"'</code></pre>
<div class="out">MODE=flag SHARED=from-second-file</div>
<p><strong>Run it step by step: two details the layer diagram hides</strong> (course Mac, Docker 29). First, <code>-e</code> beats <code>--env-file</code> no matter which you write first on the line. Second, <code>-e NAME</code> without a value copies from your shell — and when your shell has no <code>NAME</code>, the variable is simply absent inside:</p>
<pre><code class="language-bash">docker run --rm -e MODE=flag --env-file a.env alpine sh -c 'echo \$MODE'
unset NAME
docker run --rm -e NAME alpine sh -c 'echo "[&#36;{NAME-KHONG_CO}]"'
export NAME=cuong
docker run --rm -e NAME alpine sh -c 'echo "[\$NAME]"'</code></pre>
<div class="out">flag
[KHONG_CO]
[cuong]</div>
<p><code>&#36;{NAME-KHONG_CO}</code> is shell for "the value of NAME, or KHONG_CO if NAME is not set at all". An earlier version of this lesson said a missing variable arrives as "a silent empty string"; measured, it does not arrive at all — which matters, because <code>&#36;{VAR:-default}</code> and <code>&#36;{VAR-default}</code> and <code>process.env.VAR ?? 'x'</code> treat "unset" and "empty" differently.</p>
<div class="pitfall"><strong>Pitfall — <code>--env-file</code> is not a shell script.</strong> Docker reads it literally, and that has three consequences people discover the hard way:
<pre><code>PASSWORD="secret with spaces"     <span class="tok-comment"># value becomes: "secret with spaces" WITH the quotes</span>
GREETING=hello world              <span class="tok-comment"># fine — everything after = is the value</span>
URL=postgres://&#36;{USER}@db/app     <span class="tok-comment"># NO expansion: the literal &#36;{USER} is passed</span>
# a comment is fine, but only on its own line</code></pre>
No quote stripping, no variable expansion, no <code>export</code>, and a trailing space is part of the value. A password ending up wrapped in quote characters is one of the most common "the credentials are right but authentication fails" causes in Compose setups. Write values bare, and verify with <code>docker exec c env</code>.</div>

<h3>Run it step by step: what --env-file really passes</h3>
${slide('dk-02', 21, '--env-file không phải shell: giữ NGUYÊN VĂN mọi thứ')}
<p>Don't take the pitfall on trust — feed Docker one file containing every trap and print each value between brackets, so quotes and trailing spaces become visible:</p>
<pre><code class="language-bash">printf 'PASSWORD="p@ss word"\\nGREETING=hello world\\nURL=postgres://&#36;{USER}@db/app\\nTRAIL=abc \\nX=1 # not a comment\\n# comment line\\n' &gt; q.env
docker run --rm --env-file q.env alpine sh -c \\
  'for v in PASSWORD GREETING URL TRAIL X; do printenv "\$v" | sed "s/^/\$v=[/; s/\\\$/]/"; done'</code></pre>
<div class="out">PASSWORD=["p@ss word"]
GREETING=[hello world]
URL=[postgres://&#36;{USER}@db/app]
TRAIL=[abc ]
X=[1 # not a comment]</div>
<table>
<tr><th>Line in the file</th><th>What the container gets</th><th>Why it bites</th></tr>
<tr><td><code>PASSWORD="p@ss word"</code></td><td>the quotes too</td><td>Your app compares <code>"p@ss word"</code> (9 chars + 2 quotes) with the real password</td></tr>
<tr><td><code>URL=…&#36;{USER}…</code></td><td>the literal text <code>&#36;{USER}</code></td><td>No shell ran, so nothing expanded it</td></tr>
<tr><td><code>TRAIL=abc␠</code></td><td><code>abc</code> + a space</td><td>Invisible in an editor, fatal in a password</td></tr>
<tr><td><code>X=1 # not a comment</code></td><td>the whole rest of the line</td><td>Only a line that STARTS with <code>#</code> is a comment</td></tr>
</table>
<div class="callout"><strong>Compose is different.</strong> The <code>.env</code> file that <code>docker compose</code> reads for variable substitution DOES strip surrounding quotes and expand <code>&#36;{VAR}</code> (Chapter 9). The same file can therefore behave differently with <code>docker run --env-file</code> and with Compose — test the path you actually deploy with.</div>

<h3>Environment variables are not secret</h3>
${slide('dk-02', 22, 'Biến môi trường KHÔNG bí mật: ai gõ docker cũng đọc được')}
<pre><code>docker run -d --name db -e POSTGRES_PASSWORD=hunter2 postgres:16-alpine
docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | grep -i pass
docker exec db env | grep -i pass</code></pre>
<div class="out">["POSTGRES_PASSWORD=hunter2"
POSTGRES_PASSWORD=hunter2</div>
<div class="callout warn"><strong>Correction (measured on Docker 29).</strong> An earlier version printed the password from <code>/proc/PID/environ</code> of the postgres process. For this particular image that is not what happens: the official postgres entrypoint removes <code>POSTGRES_PASSWORD</code> before it starts the server, and <code>/proc/1/environ</code> in the container contains no such line. It changes little: <code>docker inspect</code> and <code>docker exec … env</code> still show it, because every exec'd process gets the container's configured environment. For an ordinary app nothing is removed — <code>docker run -e APP_SECRET=hunter2 node:22-alpine …</code> shows <code>APP_SECRET=hunter2</code> in <code>/proc/1/environ</code>, readable by root on the host and inherited by every child process.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Visible to anyone with Docker access</span><span class="v"><code>docker inspect</code> shows every variable, and Docker group membership is root-equivalent (Lesson 0.2). There is no permission that hides this.</span></div>
  <div class="kv"><span class="k">Visible on the host filesystem</span><span class="v"><code>/proc/PID/environ</code> is readable by root. So is the container's config JSON under <code>/var/lib/docker/containers/</code>.</span></div>
  <div class="kv"><span class="k">Leaks into crash reports and logs</span><span class="v">Many runtimes dump the environment on an unhandled exception, and error-tracking services store it. This is how production credentials end up in a third-party SaaS.</span></div>
  <div class="kv"><span class="k">Inherited by every child process</span><span class="v">Including anything a build script or a dependency shells out to.</span></div>
  <div class="kv"><span class="k">Better: a file, mounted read-only</span><span class="v"><code>-e DB_PASSWORD_FILE=/run/secrets/db</code> plus a mounted file. Most official images already support the <code>_FILE</code> convention — <code>POSTGRES_PASSWORD_FILE</code> works today. Chapter 10 covers Compose secrets, and Chapter 6 covers keeping them out of the image entirely.</span></div>
</div>
<pre><code><span class="tok-comment"># The _FILE convention, which official images support</span>
echo -n 'hunter2' &gt; ./pgpass
docker rm -f db &gt;/dev/null
docker run -d --name db \\
  -v "\$PWD/pgpass:/run/secrets/pgpass:ro" \\
  -e POSTGRES_PASSWORD_FILE=/run/secrets/pgpass postgres:16-alpine
sleep 5; docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | grep -i pass</code></pre>
<div class="out">["POSTGRES_PASSWORD_FILE=/run/secrets/pgpass"</div>
<p>The secret is now a path, not a value. It is still readable by root on the host — nothing makes a secret invisible to the machine running the process — but it no longer appears in <code>inspect</code> output, in crash dumps, or in the environment of every child process.</p>

<h3>Users, and the bind-mount ownership problem</h3>
${slide('dk-02', 23, 'root trong container ghi file ⇒ trên Linux file thuộc root thật')}
<pre><code>mkdir -p out
docker run --rm -v "\$PWD/out:/out" alpine sh -c 'echo hi &gt; /out/root-made.txt'
ls -l out/</code></pre>
<div class="out">-rw-r--r-- 1 root root 3 Aug 22 22:04 root-made.txt</div>
<p>The container ran as root, and there is no user namespace by default (Lesson 1.1), so UID 0 inside is UID 0 outside. The file on <em>your</em> directory is owned by root: you cannot edit it without <code>sudo</code>, and if the container created a <em>directory</em>, you cannot delete what is inside it either (deleting the top-level file itself works, because the folder it sits in is yours). Every developer meets this on day one with a generated file — a build output, a migration, a lockfile.</p>
<pre><code>docker run --rm -u "\$(id -u):\$(id -g)" -v "\$PWD/out:/out" alpine \\
  sh -c 'echo hi &gt; /out/me-made.txt'
ls -l out/
sudo rm -f out/root-made.txt</code></pre>
<div class="out">-rw-r--r-- 1 root   root   3 Aug 22 22:04 root-made.txt
-rw-r--r-- 1 deploy deploy 3 Aug 22 22:05 me-made.txt</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-u 1000:1000</span><span class="v">Numeric IDs always work, because they do not need to exist in the image's <code>/etc/passwd</code>. <code>-u "\$(id -u):\$(id -g)"</code> is the portable form for development.</span></div>
  <div class="kv"><span class="k">-u node</span><span class="v">A name only works if that user exists in the image. <code>docker: Error response from daemon: unable to find user node</code> means the image has no such account — use the number.</span></div>
  <div class="kv"><span class="k">The catch: no home, no groups</span><span class="v">With a bare numeric UID the process has no entry in <code>/etc/passwd</code>, so <code>whoami</code> fails, <code>\$HOME</code> may be <code>/</code>, and tools that want a home directory (npm, pip, git) misbehave. Add <code>-e HOME=/tmp</code> when that bites.</span></div>
  <div class="kv"><span class="k">The real fix is in the image</span><span class="v">A <code>USER</code> instruction in the Dockerfile with a fixed UID, so production and development agree. Chapter 6 does this properly; <code>-u</code> at run time is the local workaround.</span></div>
</div>
<p><strong>Measured on Linux and on a Mac — they disagree.</strong> On the course's Linux machine (Docker 29.6), after a root container wrote <code>root-made.txt</code> and <code>build/app.js</code>:</p>
<pre><code class="language-bash">ls -l out/
echo more &gt;&gt; out/root-made.txt
rm -rf out/build
docker run --rm -v "\$PWD/out:/out" alpine rm -rf /out/build /out/root-made.txt   <span class="tok-comment"># clean up as root, from a container</span></code></pre>
<div class="out">drwxr-xr-x. 2 root      root      60 Sep 23 21:14 build
-rw-r--r--. 1 Cuong03dx Cuong03dx  3 Sep 23 21:14 me-made.txt
-rw-r--r--. 1 root      root       3 Sep 23 21:14 root-made.txt
bash: line 4: out/root-made.txt: Permission denied
rm: cannot remove 'out/build/app.js': Permission denied</div>
<p>On the Mac, the same root container wrote a file that <code>ls -l</code> shows as owned by <code>admin</code> (your macOS user): Docker Desktop's file sharing maps ownership to you, so the problem simply never appears on your laptop — and then appears on the Linux VPS, in CI, or on a teammate's WSL2 checkout. That asymmetry is why "it works on my Mac" is not evidence here; test file-writing containers on Linux or WSL2 as well.</p>

<h3>ENTRYPOINT + CMD: who gets the arguments</h3>
<pre><code>docker image inspect alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'
docker image inspect postgres:16-alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'</code></pre>
<div class="out">ENTRYPOINT=[] CMD=[/bin/sh]
ENTRYPOINT=[docker-entrypoint.sh] CMD=[postgres]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Neither set</span><span class="v">Nothing runs; the image is unusable without a command on the CLI.</span></div>
  <div class="kv"><span class="k">Only CMD (alpine)</span><span class="v">Runs <code>/bin/sh</code>. Anything you type after the image name <strong>replaces</strong> it entirely: <code>docker run alpine echo hi</code> runs <code>echo hi</code>.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT + CMD (postgres)</span><span class="v">Runs <code>docker-entrypoint.sh postgres</code>. Your arguments replace the CMD part and are <strong>appended</strong> to the entrypoint: <code>docker run postgres:16-alpine postgres -c log_statement=all</code> runs <code>docker-entrypoint.sh postgres -c log_statement=all</code>.</span></div>
  <div class="kv"><span class="k">--entrypoint replaces the entrypoint</span><span class="v">And note the argument order changes: <code>docker run --entrypoint sh IMAGE -c 'echo hi'</code> — the <code>-c 'echo hi'</code> goes after the image, because it is now the CMD.</span></div>
  <div class="kv"><span class="k">--entrypoint "" clears it</span><span class="v">The escape hatch for getting a raw shell in an image whose entrypoint script is in the way.</span></div>
</div>
<pre><code>docker run --rm postgres:16-alpine postgres --version
docker run --rm --entrypoint sh postgres:16-alpine -c 'echo entrypoint replaced'
docker run --rm --entrypoint "" postgres:16-alpine ls /docker-entrypoint-initdb.d</code></pre>
<div class="out">postgres (PostgreSQL) 16.4
entrypoint replaced</div>
<div class="callout ok"><strong>That empty last line is a real finding, not a missing output.</strong> <code>/docker-entrypoint-initdb.d</code> exists and is empty — which is exactly the hook you use to seed a database: any <code>.sql</code> or <code>.sh</code> file mounted there runs once, on first initialisation of an empty data directory. Chapter 10 uses it for migrations and seeds, and the "runs only when the data directory is empty" part is the detail that catches everyone.</div>

<h3>Time zones: why container logs look seven hours behind</h3>
${slide('dk-02', 24, 'Container chạy giờ UTC — TZ chỉ ăn khi ảnh có tzdata')}
<p>Lesson 1.1 showed there is only one clock; a container just displays it in UTC unless told otherwise. The usual fix is <code>-e TZ=Asia/Ho_Chi_Minh</code> — but <code>TZ</code> is only a name, and the image needs the time-zone database (<code>tzdata</code>) to turn that name into +07. Measured on the course Mac, all at the same moment:</p>
<pre><code class="language-bash">date
docker run --rm alpine date
docker run --rm -e TZ=Asia/Ho_Chi_Minh alpine date
docker run --rm -v /etc/localtime:/etc/localtime:ro alpine date
for i in ubuntu:24.04 node:22-alpine node:22-slim postgres:16-alpine python:3.12-alpine; do
  echo "\$i: \$(docker run --rm -e TZ=Asia/Ho_Chi_Minh --entrypoint date \$i)"; done</code></pre>
<div class="out">Wed Sep 23 21:16:16 +07 2026
Wed Sep 23 14:16:16 UTC 2026
Wed Sep 23 14:16:17 UTC 2026
Wed Sep 23 21:16:17 +07 2026
ubuntu:24.04: Wed Sep 23 14:23:12 Asia 2026
node:22-alpine: Wed Sep 23 14:23:12 UTC 2026
node:22-slim: Wed Sep 23 21:23:12 +07 2026
postgres:16-alpine: Wed Sep 23 21:23:12 +07 2026
python:3.12-alpine: Wed Sep 23 21:23:13 +07 2026</div>
<p>Read it carefully: plain <code>alpine</code> and <code>node:22-alpine</code> ignore <code>TZ</code> silently; <code>ubuntu:24.04</code> is worse — it prints the wrong time labelled "Asia"; images that ship tzdata (nginx and postgres on alpine, python, <code>node:22-slim</code>) get it right. Mounting the host's <code>/etc/localtime</code> works without tzdata. For your own images, <code>RUN apk add --no-cache tzdata</code> (alpine) or <code>apt-get install -y tzdata</code> (debian/ubuntu) in the Dockerfile. A good rule for a backend: keep the database and logs in UTC, and convert to Vietnam time only when showing it to a person.</p>
<pre><code>docker rm -f db &gt;/dev/null; rm -rf out a.env b.env pgpass</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the SWP391 backend cannot log in to Postgres: "password authentication failed". Everyone swears the password in <code>db.env</code> is <code>swp391</code>. Find the real value the container received, fix it the safe way, and make generated files belong to you.</p><ol>
<li>In <code>~/thu-docker</code>: <code>printf 'POSTGRES_PASSWORD="swp391"\\n' &gt; db.env</code>, then <code>docker run -d --name thu-db --env-file db.env postgres:16-alpine</code>.</li>
<li>Look at what arrived: <code>docker exec thu-db env | grep POSTGRES_PASSWORD</code> and its length: <code>docker exec thu-db sh -c 'echo &#36;{#POSTGRES_PASSWORD}'</code>.</li>
<li>Fix it with the <code>_FILE</code> convention: <code>printf 'swp391' &gt; pgpass</code>, remove <code>thu-db</code>, re-run with <code>-v "\$PWD/pgpass:/run/secrets/pgpass:ro" -e POSTGRES_PASSWORD_FILE=/run/secrets/pgpass</code>, and check <code>docker inspect</code> shows only the path.</li>
<li>Generate a file into a bind mount twice — once as root, once with <code>-u "\$(id -u):\$(id -g)"</code> — and compare <code>ls -ln</code> (on a Mac both look like yours; on Linux/WSL2 they differ).</li>
<li>Clean up: <code>docker rm -f thu-db</code>, delete <code>db.env pgpass</code> and the test files.</li></ol>
<div class="out">POSTGRES_PASSWORD="swp391"
8</div>
<p><strong>Done when:</strong> you saw the quotes and the length 8 (not 6), the new container's <code>inspect</code> output contains <code>POSTGRES_PASSWORD_FILE=/run/secrets/pgpass</code> and no password, and you can say which of your two files would be undeletable on a Linux server.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment variable</span><span class="v">A name=value pair a process inherits at start. Docker sets them from the image's ENV, <code>--env-file</code> and <code>-e</code>.</span></div>
  <div class="kv"><span class="k">Precedence</span><span class="v">Which source wins: image ENV &lt; env-file &lt; <code>-e</code> &lt; whatever the entrypoint sets.</span></div>
  <div class="kv"><span class="k">Expansion</span><span class="v">A shell replacing <code>\$VAR</code> with its value. <code>--env-file</code> never does it; your terminal does it before Docker sees the command.</span></div>
  <div class="kv"><span class="k">_FILE convention</span><span class="v">Pass the PATH of a mounted secret file instead of the secret itself, e.g. <code>POSTGRES_PASSWORD_FILE</code>.</span></div>
  <div class="kv"><span class="k">UID / GID</span><span class="v">The numbers the kernel uses for users and groups. Names are just labels looked up in <code>/etc/passwd</code>.</span></div>
  <div class="kv"><span class="k">tzdata</span><span class="v">The time-zone database. Without it, <code>TZ=Asia/Ho_Chi_Minh</code> is ignored or misread.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT / CMD</span><span class="v">The fixed first part and the replaceable default part of the command an image runs.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Order of precedence: image ENV → <code>--env-file</code> → <code>-e</code> → entrypoint; <code>-e</code> wins wherever you write it.</li>
<li><code>-e NAME</code> copies from your shell; if the shell has none, the variable is absent (not empty).</li>
<li><code>--env-file</code> is read literally: quotes, <code>&#36;{VAR}</code>, trailing spaces and inline <code>#</code> all arrive as text.</li>
<li>Environment variables are visible to <code>docker inspect</code>, <code>docker exec env</code> and child processes — use <code>_FILE</code> for secrets.</li>
<li>Root in a container writes root-owned files on Linux (not on a Mac); use <code>-u "\$(id -u):\$(id -g)"</code>, and <code>USER</code> in the image long-term.</li>
<li><code>TZ</code> needs tzdata in the image; plain alpine, <code>node:22-alpine</code> and ubuntu ignore or misread it.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/#env" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Setting environment variables</span><span class="lc-sub">The exact <code>--env-file</code> parsing rules, including the no-expansion and no-quote-stripping behaviour that surprises everyone once.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#entrypoint" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">ENTRYPOINT and CMD interaction</span><span class="lc-sub">The official truth table of all six combinations of shell/exec form for both instructions. Worth reading once slowly; it settles every argument about which one to use.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/userns-remap/" target="_blank" rel="noopener">
  <span class="lc-ico">👤</span>
  <span class="lc-body"><span class="lc-title">User namespace remapping</span><span class="lc-sub">The daemon-wide setting that maps container root to an unprivileged host UID, solving the bind-mount ownership problem at the source — with an honest list of what it breaks.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: env, users, arguments</span><span class="lc-sub">Graded exercises: predict the winning value across an env-file and a flag, fix a password that arrived with quotes attached, make a container write files you can delete, and say which program receives an argument.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> assuming <code>-e</code> reaches a shell. <code>docker run -e "GREETING=hello \$USER" alpine sh -c 'echo \$GREETING'</code> works only because <em>your</em> shell expanded <code>\$USER</code> before Docker ever saw it. Inside <code>--env-file</code> there is no shell, so the same text arrives as a literal. And in the other direction, <code>docker run alpine echo \$HOSTNAME</code> prints your host's hostname, not the container's, because the expansion happened before the container existed — you need <code>sh -c 'echo \$HOSTNAME'</code> to defer it. Whenever a variable's value looks wrong, ask which shell, on which side, expanded it.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Precedence runs image <code>ENV</code> → <code>--env-file</code> → <code>-e</code> → whatever the entrypoint sets, and <code>--env-file</code> keeps your quotes and does not expand variables. Environment variables are visible in <code>docker inspect</code> and <code>/proc/PID/environ</code>, so prefer the <code>_FILE</code> convention for anything secret. And arguments after the image name replace <code>CMD</code> and are appended to <code>ENTRYPOINT</code> — which is why <code>--entrypoint ""</code> is how you get a shell when the entrypoint is in the way.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Môi trường, người dùng và tham số</h2>
<p class="lead">Ba chủ đề nhỏ gây ra một tỷ lệ vấn đề thực tế lớn không tương xứng: một biến được đặt nhưng không mang giá trị bạn ngờ, những file trên một thư mục được gắn lại thuộc sở hữu root, và một tham số đi nhầm chương trình. Mỗi cái đều có một cái luật, và mấy cái luật đó đều ngắn.</p>

<h3>Biến môi trường đến từ đâu</h3>
${slide('dk-02', 20, 'Bốn nguồn biến môi trường — nguồn sau đè nguồn trước')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Các chỉ thị ENV của ảnh</span><span class="lz-lnote">Nướng sẵn lúc dựng và nhìn thấy được với bất cứ ai có cái ảnh (<code>docker history</code>). Tầng nền của các giá trị mặc định: <code>NODE_VERSION</code>, <code>PATH</code>, <code>LANG</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. --env-file, theo thứ tự file</span><span class="lz-lnote">Docker đọc NGUYÊN VĂN. File sau ghi đè file trước, và dòng sau ghi đè dòng trước trong cùng một file.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. -e / --env trên dòng lệnh</span><span class="lz-lnote">Thắng cả hai cái trên. <code>-e TÊN</code> không kèm <code>=</code> thì chép giá trị từ shell hiện tại của bạn — tiện khi làm cục bộ, còn trong CI, nơi biến đó không tồn tại, container âm thầm KHÔNG có biến đó luôn — chứ không phải một chuỗi rỗng.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Bất cứ thứ gì script entrypoint đặt</span><span class="lz-lnote">Chạy sau cùng, bên trong container, nên nó thắng tất cả. Đây là cách các ảnh chính thức suy ra giá trị — ví dụ <code>POSTGRES_USER</code> mặc định thành <code>postgres</code>.</span></div>
</div>
<pre><code>printf 'MODE=file\\nSHARED=from-file\\n' &gt; a.env
printf 'SHARED=from-second-file\\n'      &gt; b.env
docker run --rm --env-file a.env --env-file b.env -e MODE=flag alpine \\
  sh -c 'echo "MODE=\$MODE SHARED=\$SHARED"'</code></pre>
<div class="out">MODE=flag SHARED=from-second-file</div>
<p><strong>Chạy thử từng bước: hai chi tiết mà sơ đồ tầng giấu đi</strong> (máy Mac của khoá, Docker 29). Thứ nhất, <code>-e</code> thắng <code>--env-file</code> bất kể bạn viết cái nào trước trên dòng lệnh. Thứ hai, <code>-e NAME</code> không kèm giá trị thì chép từ shell của bạn — và khi shell KHÔNG có <code>NAME</code>, bên trong đơn giản là không có biến đó:</p>
<pre><code class="language-bash">docker run --rm -e MODE=flag --env-file a.env alpine sh -c 'echo \$MODE'
unset NAME
docker run --rm -e NAME alpine sh -c 'echo "[&#36;{NAME-KHONG_CO}]"'
export NAME=cuong
docker run --rm -e NAME alpine sh -c 'echo "[\$NAME]"'</code></pre>
<div class="out">flag
[KHONG_CO]
[cuong]</div>
<p><code>&#36;{NAME-KHONG_CO}</code> là cú pháp shell cho "giá trị của NAME, hoặc KHONG_CO nếu NAME hoàn toàn không được đặt". Bản trước của bài này nói biến thiếu sẽ tới nơi thành "một chuỗi rỗng câm lặng"; đo thật thì nó KHÔNG tới nơi chút nào — và điều đó quan trọng, vì <code>&#36;{VAR:-mặc-định}</code>, <code>&#36;{VAR-mặc-định}</code> và <code>process.env.VAR ?? 'x'</code> đối xử khác nhau với "chưa đặt" và "rỗng".</p>
<div class="pitfall"><strong>Bẫy — <code>--env-file</code> KHÔNG phải một script shell.</strong> Docker đọc nó theo nghĩa đen, và điều đó kéo theo ba hệ quả mà người ta phát hiện ra theo cách đau đớn:
<pre><code>PASSWORD="mật khẩu có dấu cách"   <span class="tok-comment"># giá trị thành: "mật khẩu có dấu cách" KÈM dấu nháy</span>
GREETING=xin chào                 <span class="tok-comment"># ổn — mọi thứ sau dấu = đều là giá trị</span>
URL=postgres://&#36;{USER}@db/app     <span class="tok-comment"># KHÔNG khai triển: cái &#36;{USER} theo nghĩa đen được truyền đi</span>
# một dòng chú thích thì được, nhưng phải nằm riêng một dòng</code></pre>
Không bóc dấu nháy, không khai triển biến, không <code>export</code>, và một dấu cách ở cuối là một phần của giá trị. Một mật khẩu rốt cuộc bị bọc trong dấu nháy là một trong những nguyên nhân phổ biến nhất của "thông tin đăng nhập đúng mà xác thực vẫn hỏng" trong các thiết lập Compose. Hãy viết giá trị trần trụi, và kiểm bằng <code>docker exec c env</code>.</div>

<h3>Chạy thử từng bước: --env-file thật ra truyền đi cái gì</h3>
${slide('dk-02', 21, '--env-file không phải shell: giữ NGUYÊN VĂN mọi thứ')}
<p>Đừng tin cái bẫy chỉ vì đọc — hãy đưa cho Docker một file chứa đủ mọi cái bẫy rồi in từng giá trị giữa hai dấu ngoặc vuông, để dấu nháy và dấu cách cuối dòng hiện ra:</p>
<pre><code class="language-bash">printf 'PASSWORD="p@ss word"\\nGREETING=hello world\\nURL=postgres://&#36;{USER}@db/app\\nTRAIL=abc \\nX=1 # not a comment\\n# comment line\\n' &gt; q.env
docker run --rm --env-file q.env alpine sh -c \\
  'for v in PASSWORD GREETING URL TRAIL X; do printenv "\$v" | sed "s/^/\$v=[/; s/\\\$/]/"; done'</code></pre>
<div class="out">PASSWORD=["p@ss word"]
GREETING=[hello world]
URL=[postgres://&#36;{USER}@db/app]
TRAIL=[abc ]
X=[1 # not a comment]</div>
<table>
<tr><th>Dòng trong file</th><th>Container nhận được</th><th>Vì sao nó cắn</th></tr>
<tr><td><code>PASSWORD="p@ss word"</code></td><td>cả hai dấu nháy</td><td>App so <code>"p@ss word"</code> (9 ký tự + 2 dấu nháy) với mật khẩu thật</td></tr>
<tr><td><code>URL=…&#36;{USER}…</code></td><td>nguyên chữ <code>&#36;{USER}</code></td><td>Không có shell nào chạy nên không ai khai triển nó</td></tr>
<tr><td><code>TRAIL=abc␠</code></td><td><code>abc</code> + một dấu cách</td><td>Vô hình trong trình soạn thảo, chết người trong một mật khẩu</td></tr>
<tr><td><code>X=1 # not a comment</code></td><td>cả phần còn lại của dòng</td><td>Chỉ dòng BẮT ĐẦU bằng <code>#</code> mới là chú thích</td></tr>
</table>
<div class="callout"><strong>Compose thì khác.</strong> File <code>.env</code> mà <code>docker compose</code> đọc để thay biến CÓ bóc dấu nháy bao ngoài và CÓ khai triển <code>&#36;{VAR}</code> (Chương 9). Nên cùng một file có thể hành xử khác nhau với <code>docker run --env-file</code> và với Compose — hãy thử đúng con đường bạn thật sự deploy.</div>

<h3>Biến môi trường KHÔNG bí mật</h3>
${slide('dk-02', 22, 'Biến môi trường KHÔNG bí mật: ai gõ docker cũng đọc được')}
<pre><code>docker run -d --name db -e POSTGRES_PASSWORD=hunter2 postgres:16-alpine
docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | grep -i pass
docker exec db env | grep -i pass</code></pre>
<div class="out">["POSTGRES_PASSWORD=hunter2"
POSTGRES_PASSWORD=hunter2</div>
<div class="callout warn"><strong>Đính chính (đo trên Docker 29).</strong> Bản trước in mật khẩu ra từ <code>/proc/PID/environ</code> của tiến trình postgres. Với riêng ảnh này thì không phải vậy: script entrypoint chính thức của postgres gỡ <code>POSTGRES_PASSWORD</code> đi trước khi khởi chạy server, và <code>/proc/1/environ</code> trong container không có dòng đó. Điều này thay đổi rất ít: <code>docker inspect</code> và <code>docker exec … env</code> vẫn hiện nó, vì mọi tiến trình được exec đều nhận môi trường đã cấu hình của container. Với một ứng dụng bình thường thì không ai gỡ gì cả — <code>docker run -e APP_SECRET=hunter2 node:22-alpine …</code> cho thấy <code>APP_SECRET=hunter2</code> trong <code>/proc/1/environ</code>, root trên máy chủ đọc được, và mọi tiến trình con đều thừa kế.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ai có quyền Docker cũng thấy</span><span class="v"><code>docker inspect</code> hiện ra mọi biến, và nằm trong nhóm Docker thì tương đương root (Bài 0.2). Không có quyền hạn nào giấu được chuyện này.</span></div>
  <div class="kv"><span class="k">Nhìn thấy được trên hệ thống file của máy chủ</span><span class="v"><code>/proc/PID/environ</code> thì root đọc được. Cái JSON cấu hình của container dưới <code>/var/lib/docker/containers/</code> cũng vậy.</span></div>
  <div class="kv"><span class="k">Rò vào báo cáo sập và log</span><span class="v">Nhiều môi trường chạy đổ trọn môi trường ra khi có ngoại lệ không bắt được, và các dịch vụ theo dõi lỗi thì lưu lại. Đó là cách thông tin đăng nhập production rốt cuộc nằm trong một SaaS của bên thứ ba.</span></div>
  <div class="kv"><span class="k">Thừa kế cho MỌI tiến trình con</span><span class="v">Bao gồm bất cứ thứ gì mà một script dựng hay một thư viện phụ thuộc gọi ra shell.</span></div>
  <div class="kv"><span class="k">Tốt hơn: một FILE, gắn ở chế độ chỉ đọc</span><span class="v"><code>-e DB_PASSWORD_FILE=/run/secrets/db</code> cộng một file được gắn vào. Phần lớn ảnh chính thức đã hỗ trợ sẵn quy ước <code>_FILE</code> — <code>POSTGRES_PASSWORD_FILE</code> dùng được ngay hôm nay. Chương 10 nói về secret của Compose, còn Chương 6 nói về việc giữ chúng nằm ngoài cái ảnh hoàn toàn.</span></div>
</div>
<pre><code><span class="tok-comment"># Quy ước _FILE mà các ảnh chính thức hỗ trợ</span>
echo -n 'hunter2' &gt; ./pgpass
docker rm -f db &gt;/dev/null
docker run -d --name db \\
  -v "\$PWD/pgpass:/run/secrets/pgpass:ro" \\
  -e POSTGRES_PASSWORD_FILE=/run/secrets/pgpass postgres:16-alpine
sleep 5; docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | grep -i pass</code></pre>
<div class="out">["POSTGRES_PASSWORD_FILE=/run/secrets/pgpass"</div>
<p>Bí mật giờ là một ĐƯỜNG DẪN, không phải một giá trị. Root trên máy chủ vẫn đọc được nó — không có gì làm cho một bí mật vô hình với cái máy đang chạy tiến trình đó — nhưng nó thôi xuất hiện trong output của <code>inspect</code>, trong bản đổ lỗi lúc sập, hay trong môi trường của mọi tiến trình con.</p>

<h3>Người dùng, và bài toán quyền sở hữu của bind mount</h3>
${slide('dk-02', 23, 'root trong container ghi file ⇒ trên Linux file thuộc root thật')}
<pre><code>mkdir -p out
docker run --rm -v "\$PWD/out:/out" alpine sh -c 'echo hi &gt; /out/root-made.txt'
ls -l out/</code></pre>
<div class="out">-rw-r--r-- 1 root root 3 Aug 22 22:04 root-made.txt</div>
<p>Container chạy dưới quyền root, và mặc định không có user namespace nào (Bài 1.1), nên UID 0 bên trong là UID 0 bên ngoài. Cái file trên thư mục của <em>BẠN</em> thuộc sở hữu root: bạn không sửa được nó nếu không có <code>sudo</code>, và nếu container tạo ra một <em>THƯ MỤC</em> thì bạn cũng không xoá được thứ nằm bên trong (còn xoá chính cái file ở tầng trên cùng thì được, vì thư mục chứa nó là của bạn). Mọi lập trình viên đều gặp chuyện này ngay ngày đầu tiên với một file được sinh ra — một kết quả build, một migration, một file khoá phiên bản.</p>
<pre><code>docker run --rm -u "\$(id -u):\$(id -g)" -v "\$PWD/out:/out" alpine \\
  sh -c 'echo hi &gt; /out/me-made.txt'
ls -l out/
sudo rm -f out/root-made.txt</code></pre>
<div class="out">-rw-r--r-- 1 root   root   3 Aug 22 22:04 root-made.txt
-rw-r--r-- 1 deploy deploy 3 Aug 22 22:05 me-made.txt</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-u 1000:1000</span><span class="v">ID dạng SỐ thì luôn chạy được, vì chúng không cần tồn tại trong <code>/etc/passwd</code> của ảnh. <code>-u "\$(id -u):\$(id -g)"</code> là dạng mang đi được cho lúc phát triển.</span></div>
  <div class="kv"><span class="k">-u node</span><span class="v">Một cái TÊN chỉ chạy nếu người dùng đó tồn tại trong ảnh. <code>docker: Error response from daemon: unable to find user node</code> nghĩa là ảnh không có tài khoản đó — hãy dùng con số.</span></div>
  <div class="kv"><span class="k">Chỗ vướng: không nhà, không nhóm</span><span class="v">Với một UID số trần trụi thì tiến trình không có dòng nào trong <code>/etc/passwd</code>, nên <code>whoami</code> hỏng, <code>\$HOME</code> có thể là <code>/</code>, và những công cụ muốn có thư mục nhà (npm, pip, git) thì trở chứng. Hãy thêm <code>-e HOME=/tmp</code> khi chuyện đó cắn bạn.</span></div>
  <div class="kv"><span class="k">Cách chữa THẬT nằm trong cái ảnh</span><span class="v">Một chỉ thị <code>USER</code> trong Dockerfile với UID cố định, để production và môi trường phát triển thống nhất. Chương 6 làm chuyện này tử tế; <code>-u</code> lúc chạy chỉ là cách đối phó cục bộ.</span></div>
</div>
<p><strong>Đo trên Linux và trên Mac — hai bên nói khác nhau.</strong> Trên máy Linux của khoá (Docker 29.6), sau khi một container chạy root ghi ra <code>root-made.txt</code> và <code>build/app.js</code>:</p>
<pre><code class="language-bash">ls -l out/
echo more &gt;&gt; out/root-made.txt
rm -rf out/build
docker run --rm -v "\$PWD/out:/out" alpine rm -rf /out/build /out/root-made.txt   <span class="tok-comment"># dọn dưới quyền root, từ một container</span></code></pre>
<div class="out">drwxr-xr-x. 2 root      root      60 Sep 23 21:14 build
-rw-r--r--. 1 Cuong03dx Cuong03dx  3 Sep 23 21:14 me-made.txt
-rw-r--r--. 1 root      root       3 Sep 23 21:14 root-made.txt
bash: line 4: out/root-made.txt: Permission denied
rm: cannot remove 'out/build/app.js': Permission denied</div>
<p>Trên Mac, cùng container chạy root đó ghi ra một file mà <code>ls -l</code> báo thuộc <code>admin</code> (người dùng macOS của bạn): tính năng chia sẻ file của Docker Desktop đổi chủ sở hữu thành bạn, nên vấn đề KHÔNG BAO GIỜ xuất hiện trên laptop của bạn — rồi xuất hiện trên VPS Linux, trong CI, hay trong bản checkout WSL2 của bạn cùng nhóm. Chính sự lệch đó là lý do "máy Mac tôi chạy được" không phải là bằng chứng ở đây; hãy thử các container ghi file trên Linux hoặc WSL2 nữa.</p>

<h3>ENTRYPOINT + CMD: ai nhận được tham số</h3>
<pre><code>docker image inspect alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'
docker image inspect postgres:16-alpine --format 'ENTRYPOINT={{.Config.Entrypoint}} CMD={{.Config.Cmd}}'</code></pre>
<div class="out">ENTRYPOINT=[] CMD=[/bin/sh]
ENTRYPOINT=[docker-entrypoint.sh] CMD=[postgres]</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không đặt cái nào</span><span class="v">Chẳng có gì chạy; cái ảnh không dùng được nếu không kèm câu lệnh trên dòng lệnh.</span></div>
  <div class="kv"><span class="k">Chỉ có CMD (alpine)</span><span class="v">Chạy <code>/bin/sh</code>. Bất cứ thứ gì bạn gõ sau tên ảnh sẽ <strong>THAY THẾ</strong> nó hoàn toàn: <code>docker run alpine echo hi</code> chạy <code>echo hi</code>.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT + CMD (postgres)</span><span class="v">Chạy <code>docker-entrypoint.sh postgres</code>. Tham số của bạn thay thế phần CMD và được <strong>NỐI THÊM</strong> vào sau entrypoint: <code>docker run postgres:16-alpine postgres -c log_statement=all</code> chạy <code>docker-entrypoint.sh postgres -c log_statement=all</code>.</span></div>
  <div class="kv"><span class="k">--entrypoint thay thế entrypoint</span><span class="v">Và chú ý thứ tự tham số đổi theo: <code>docker run --entrypoint sh IMAGE -c 'echo hi'</code> — cái <code>-c 'echo hi'</code> nằm SAU tên ảnh, vì giờ nó là CMD.</span></div>
  <div class="kv"><span class="k">--entrypoint "" xoá trắng nó</span><span class="v">Lối thoát để lấy một cái shell trần trong một ảnh mà script entrypoint đang chắn đường.</span></div>
</div>
<pre><code>docker run --rm postgres:16-alpine postgres --version
docker run --rm --entrypoint sh postgres:16-alpine -c 'echo đã thay entrypoint'
docker run --rm --entrypoint "" postgres:16-alpine ls /docker-entrypoint-initdb.d</code></pre>
<div class="out">postgres (PostgreSQL) 16.4
đã thay entrypoint</div>
<div class="callout ok"><strong>Cái dòng cuối trống kia là một phát hiện THẬT, không phải output bị thiếu.</strong> <code>/docker-entrypoint-initdb.d</code> tồn tại và đang rỗng — và đó chính là cái móc bạn dùng để seed một cơ sở dữ liệu: bất kỳ file <code>.sql</code> hay <code>.sh</code> nào được gắn vào đó sẽ chạy MỘT LẦN, lúc khởi tạo lần đầu một thư mục dữ liệu rỗng. Chương 10 dùng nó cho migration và seed, còn phần "chỉ chạy khi thư mục dữ liệu rỗng" là chi tiết bẫy được tất cả mọi người.</div>

<h3>Múi giờ: vì sao log của container trông như chậm bảy tiếng</h3>
${slide('dk-02', 24, 'Container chạy giờ UTC — TZ chỉ ăn khi ảnh có tzdata')}
<p>Bài 1.1 đã chỉ ra chỉ có MỘT đồng hồ; container chỉ hiển thị nó theo UTC nếu không ai bảo khác. Cách chữa quen thuộc là <code>-e TZ=Asia/Ho_Chi_Minh</code> — nhưng <code>TZ</code> chỉ là một cái TÊN, và ảnh cần có cơ sở dữ liệu múi giờ (<code>tzdata</code>) mới đổi được cái tên đó thành +07. Đo trên máy Mac của khoá, tất cả cùng một thời điểm:</p>
<pre><code class="language-bash">date
docker run --rm alpine date
docker run --rm -e TZ=Asia/Ho_Chi_Minh alpine date
docker run --rm -v /etc/localtime:/etc/localtime:ro alpine date
for i in ubuntu:24.04 node:22-alpine node:22-slim postgres:16-alpine python:3.12-alpine; do
  echo "\$i: \$(docker run --rm -e TZ=Asia/Ho_Chi_Minh --entrypoint date \$i)"; done</code></pre>
<div class="out">Wed Sep 23 21:16:16 +07 2026
Wed Sep 23 14:16:16 UTC 2026
Wed Sep 23 14:16:17 UTC 2026
Wed Sep 23 21:16:17 +07 2026
ubuntu:24.04: Wed Sep 23 14:23:12 Asia 2026
node:22-alpine: Wed Sep 23 14:23:12 UTC 2026
node:22-slim: Wed Sep 23 21:23:12 +07 2026
postgres:16-alpine: Wed Sep 23 21:23:12 +07 2026
python:3.12-alpine: Wed Sep 23 21:23:13 +07 2026</div>
<p>Đọc cho kỹ: <code>alpine</code> trần và <code>node:22-alpine</code> âm thầm lờ <code>TZ</code> đi; <code>ubuntu:24.04</code> còn tệ hơn — in giờ sai kèm nhãn "Asia"; những ảnh có sẵn tzdata (nginx và postgres bản alpine, python, <code>node:22-slim</code>) thì ra đúng. Gắn <code>/etc/localtime</code> của máy chủ vào thì chạy được mà không cần tzdata. Với ảnh của chính bạn: <code>RUN apk add --no-cache tzdata</code> (alpine) hoặc <code>apt-get install -y tzdata</code> (debian/ubuntu) trong Dockerfile. Một luật tốt cho backend: giữ cơ sở dữ liệu và log ở UTC, chỉ đổi sang giờ Việt Nam lúc hiển thị cho con người.</p>
<pre><code>docker rm -f db &gt;/dev/null; rm -rf out a.env b.env pgpass</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> backend SWP391 không đăng nhập được vào Postgres: "password authentication failed". Ai cũng thề mật khẩu trong <code>db.env</code> là <code>swp391</code>. Hãy tìm giá trị THẬT mà container nhận được, sửa theo cách an toàn, và làm cho file sinh ra thuộc về bạn.</p><ol>
<li>Trong <code>~/thu-docker</code>: <code>printf 'POSTGRES_PASSWORD="swp391"\\n' &gt; db.env</code>, rồi <code>docker run -d --name thu-db --env-file db.env postgres:16-alpine</code>.</li>
<li>Xem thứ đã tới nơi: <code>docker exec thu-db env | grep POSTGRES_PASSWORD</code> và độ dài của nó: <code>docker exec thu-db sh -c 'echo &#36;{#POSTGRES_PASSWORD}'</code>.</li>
<li>Sửa bằng quy ước <code>_FILE</code>: <code>printf 'swp391' &gt; pgpass</code>, xoá <code>thu-db</code>, chạy lại với <code>-v "\$PWD/pgpass:/run/secrets/pgpass:ro" -e POSTGRES_PASSWORD_FILE=/run/secrets/pgpass</code>, và kiểm <code>docker inspect</code> chỉ còn thấy đường dẫn.</li>
<li>Sinh một file vào bind mount hai lần — một lần dưới root, một lần với <code>-u "\$(id -u):\$(id -g)"</code> — rồi so <code>ls -ln</code> (trên Mac cả hai trông như của bạn; trên Linux/WSL2 thì khác nhau).</li>
<li>Dọn dẹp: <code>docker rm -f thu-db</code>, xoá <code>db.env pgpass</code> và các file thử.</li></ol>
<div class="out">POSTGRES_PASSWORD="swp391"
8</div>
<p><strong>Đạt khi:</strong> bạn thấy dấu nháy và độ dài 8 (chứ không phải 6), output <code>inspect</code> của container mới có <code>POSTGRES_PASSWORD_FILE=/run/secrets/pgpass</code> và không có mật khẩu nào, và bạn nói được file nào trong hai file của bạn sẽ không xoá được trên một máy chủ Linux.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment variable (biến môi trường)</span><span class="v">Cặp tên=giá trị mà tiến trình thừa hưởng lúc khởi chạy. Docker đặt chúng từ ENV của ảnh, <code>--env-file</code> và <code>-e</code>.</span></div>
  <div class="kv"><span class="k">Precedence (thứ tự ưu tiên)</span><span class="v">Nguồn nào thắng: ENV của ảnh &lt; env-file &lt; <code>-e</code> &lt; thứ entrypoint đặt.</span></div>
  <div class="kv"><span class="k">Expansion (khai triển biến)</span><span class="v">Shell thay <code>\$VAR</code> bằng giá trị của nó. <code>--env-file</code> không bao giờ làm; terminal của bạn làm TRƯỚC khi Docker thấy câu lệnh.</span></div>
  <div class="kv"><span class="k">_FILE convention (quy ước _FILE)</span><span class="v">Truyền ĐƯỜNG DẪN tới một file bí mật được gắn vào thay vì truyền chính bí mật, ví dụ <code>POSTGRES_PASSWORD_FILE</code>.</span></div>
  <div class="kv"><span class="k">UID / GID (mã người dùng / mã nhóm)</span><span class="v">Con số mà nhân dùng cho người dùng và nhóm. Tên chỉ là nhãn tra trong <code>/etc/passwd</code>.</span></div>
  <div class="kv"><span class="k">tzdata (dữ liệu múi giờ)</span><span class="v">Cơ sở dữ liệu múi giờ. Thiếu nó, <code>TZ=Asia/Ho_Chi_Minh</code> bị lờ đi hoặc hiểu sai.</span></div>
  <div class="kv"><span class="k">ENTRYPOINT / CMD (điểm vào / lệnh mặc định)</span><span class="v">Phần đầu cố định và phần mặc định thay được của câu lệnh mà một ảnh chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự ưu tiên: ENV của ảnh → <code>--env-file</code> → <code>-e</code> → entrypoint; <code>-e</code> thắng dù bạn viết nó ở đâu.</li>
<li><code>-e NAME</code> chép từ shell của bạn; shell không có thì biến VẮNG MẶT (không phải rỗng).</li>
<li><code>--env-file</code> được đọc nguyên văn: dấu nháy, <code>&#36;{VAR}</code>, dấu cách cuối và <code>#</code> giữa dòng đều tới nơi dưới dạng chữ.</li>
<li>Biến môi trường hiện ra trong <code>docker inspect</code>, <code>docker exec env</code> và tiến trình con — dùng <code>_FILE</code> cho bí mật.</li>
<li>Root trong container ghi ra file thuộc root trên Linux (trên Mac thì không); dùng <code>-u "\$(id -u):\$(id -g)"</code>, lâu dài thì <code>USER</code> trong ảnh.</li>
<li><code>TZ</code> cần tzdata trong ảnh; alpine trần, <code>node:22-alpine</code> và ubuntu lờ đi hoặc đọc sai.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/#env" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Đặt biến môi trường</span><span class="lc-sub">Luật phân tích <code>--env-file</code> chính xác, gồm cả hành vi không-khai-triển và không-bóc-dấu-nháy khiến ai cũng ngạc nhiên đúng một lần.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#entrypoint" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">Tương tác giữa ENTRYPOINT và CMD</span><span class="lc-sub">Bảng chân trị chính thức cho cả sáu tổ hợp dạng shell/exec của hai chỉ thị. Đáng đọc chậm một lần; nó chấm dứt mọi tranh cãi về việc nên dùng cái nào.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/security/userns-remap/" target="_blank" rel="noopener">
  <span class="lc-ico">👤</span>
  <span class="lc-body"><span class="lc-title">Ánh xạ lại user namespace</span><span class="lc-sub">Thiết lập ở mức tiến trình nền, ánh xạ root trong container sang một UID không đặc quyền của máy chủ, giải quyết bài toán quyền sở hữu bind mount từ gốc — kèm một danh sách trung thực những thứ nó làm hỏng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: môi trường, người dùng, tham số</span><span class="lc-sub">Bài chấm điểm: đoán giá trị nào thắng giữa một env-file và một cái cờ, sửa một mật khẩu bị dính dấu nháy, làm cho một container ghi ra những file bạn xoá được, và nói xem chương trình nào nhận một tham số.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng rằng <code>-e</code> đi tới một cái shell. <code>docker run -e "GREETING=chào \$USER" alpine sh -c 'echo \$GREETING'</code> chỉ chạy được vì <em>SHELL CỦA BẠN</em> đã khai triển <code>\$USER</code> trước khi Docker kịp nhìn thấy. Bên trong <code>--env-file</code> thì không có shell nào, nên cùng dòng chữ đó tới nơi theo nghĩa đen. Và theo chiều ngược lại, <code>docker run alpine echo \$HOSTNAME</code> in ra tên máy CHỦ của bạn chứ không phải của container, vì phép khai triển đã xảy ra trước khi container tồn tại — bạn cần <code>sh -c 'echo \$HOSTNAME'</code> để hoãn nó lại. Mỗi khi giá trị một biến trông có vẻ sai, hãy hỏi xem SHELL NÀO, ở PHÍA NÀO, đã khai triển nó.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Thứ tự ưu tiên chạy từ <code>ENV</code> của ảnh → <code>--env-file</code> → <code>-e</code> → thứ mà entrypoint đặt, và <code>--env-file</code> thì GIỮ NGUYÊN dấu nháy của bạn và KHÔNG khai triển biến. Biến môi trường nhìn thấy được trong <code>docker inspect</code> và <code>/proc/PID/environ</code>, nên hãy ưu tiên quy ước <code>_FILE</code> cho bất cứ thứ gì bí mật. Và tham số đứng sau tên ảnh thì THAY THẾ <code>CMD</code> và được NỐI vào sau <code>ENTRYPOINT</code> — đó là lý do <code>--entrypoint ""</code> là cách bạn lấy được một cái shell khi entrypoint đang chắn đường.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Limits, restart policies and healthchecks|||2.5 — Giới hạn, chính sách khởi động lại và healthcheck',
      slug: 'dk-2-5-gioi-han-restart',
      type: 'LESSON',
      description: 'Vì sao một container không giới hạn có thể kéo sập cả máy, --memory và --cpus làm gì thật sự, bốn chính sách restart và cái khác nhau lúc máy khởi động, và vì sao healthcheck KHÔNG tự khởi động lại thứ gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Limits, restart policies and healthchecks</h2>
<p class="lead">By default a container can use every byte of RAM and every CPU on the machine. That is fine on your laptop and a genuine outage risk on a server, because one leaking process takes down the database sharing the host with it. Three groups of flags fix that, and the third one — healthchecks — does something different from what most people assume.</p>

<h3>Memory</h3>
${slide('dk-02', 25, 'Không có --memory = container được lấy cả cái máy')}
<pre><code>docker run -d --name unbounded nginx:1.27-alpine
docker stats --no-stream unbounded --format '{{.Name}} {{.MemUsage}}'

docker run -d --name bounded --memory 256m --memory-reservation 128m nginx:1.27-alpine
docker stats --no-stream bounded --format '{{.Name}} {{.MemUsage}}'</code></pre>
<div class="out">unbounded 3.629MiB / 15.46GiB
bounded 3.598MiB / 256MiB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--memory 256m</span><span class="v">A hard ceiling. Cross it and the kernel OOM-kills a process in the container — usually the main one, giving exit 137. This is a wall, not a suggestion.</span></div>
  <div class="kv"><span class="k">--memory-reservation 128m</span><span class="v">A soft target. Under host memory pressure the kernel pushes this container back towards 128MB before touching containers that are within their reservation. Set it below <code>--memory</code>, at roughly normal usage.</span></div>
  <div class="kv"><span class="k">--memory-swap</span><span class="v">Total memory + swap. Setting it <em>equal</em> to <code>--memory</code> disables swap for the container, which is what you want for a latency-sensitive service: fail fast rather than thrash.</span></div>
  <div class="kv"><span class="k">--oom-kill-disable</span><span class="v">Almost always a mistake. The container freezes instead of dying when it hits the limit, and a frozen process that holds locks is harder to recover from than a dead one that restarts.</span></div>
</div>
<h3>Hit the wall on purpose</h3>
${slide('dk-02', 26, 'Thử chạm trần: phải cấp phát thật và tắt swap mới thấy OOM')}
<pre><code><span class="tok-comment"># Hit the wall on purpose and read the aftermath</span>
docker run --name oomtest --memory 128m --memory-swap 128m alpine \\
  dd if=/dev/zero of=/dev/null bs=200M count=1 2&gt;/dev/null
docker inspect oomtest --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}'
docker run --rm --privileged alpine dmesg | grep -i 'killed process' | tail -1</code></pre>
<div class="out">exit=137 oom=true
[80472.973730] Memory cgroup out of memory: Killed process 393902 (dd) total-vm:206436kB, anon-rss:130472kB, file-rss:928kB, shmem-rss:0kB, UID:0 pgtables:304kB oom_score_adj:0</div>
<div class="callout ok"><strong><code>.State.OOMKilled</code> is the field that ends the argument.</strong> Exit 137 alone is ambiguous — it could be a <code>docker kill</code>, a timed-out <code>docker stop</code>, or the OOM killer. That boolean says which, and <code>dmesg</code> on the host confirms it and names the process. Put both in your triage script (Lesson 2.2); together they turn the most common mystery exit into a five-second answer.</div>
<div class="callout warn"><strong>Correction (re-run September 2026).</strong> The earlier version of this demo used <code>--memory 64m</code> with <code>head -c 200m /dev/zero | tail -c 1</code>. Run for real on Docker 29 it prints <code>exit=0 oom=false</code>: <code>tail -c 1</code> only ever keeps the last byte, so nothing close to 64 MB is held in memory, and without <code>--memory-swap</code> the container could have used another 64 MB of swap anyway. A memory test must <em>hold</em> the memory (<code>dd … bs=200M</code> allocates one 200 MB buffer) and must close the swap door (<code>--memory-swap</code> equal to <code>--memory</code>). The output above is from the course's Linux machine; <code>dmesg</code> needs root, so it runs in a <code>--privileged</code> throwaway container — on a Mac the same command reads the Docker Desktop VM's kernel log.</div>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th><th>When to use it</th></tr>
<tr><td><code>--memory</code></td><td>Hard RAM ceiling</td><td><code>--memory 256m</code></td><td>Every service on a shared server</td></tr>
<tr><td><code>--memory-swap</code></td><td>RAM + swap total; equal to <code>--memory</code> = no swap</td><td><code>--memory 256m --memory-swap 256m</code></td><td>Latency-sensitive services; OOM tests</td></tr>
<tr><td><code>--memory-reservation</code></td><td>Soft target under host pressure</td><td><code>--memory-reservation 128m</code></td><td>Many containers on one host; set near normal usage</td></tr>
<tr><td><code>--oom-kill-disable</code></td><td>Freeze instead of die</td><td>—</td><td>Almost never; only together with <code>--memory</code></td></tr>
</table>

<h3>CPU</h3>
${slide('dk-02', 27, '--cpus là hạn ngạch cứng — và app tự đo lại chính nó')}
<pre><code>docker run -d --name half --cpus 0.5 alpine sh -c 'while :; do :; done'
docker run -d --name full alpine sh -c 'while :; do :; done'
sleep 3; docker stats --no-stream --format '{{.Name}} {{.CPUPerc}}' half full
docker rm -f half full &gt;/dev/null</code></pre>
<div class="out">half 50.02%
full 100.11%</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--cpus 1.5</span><span class="v">A hard quota: at most 1.5 cores' worth of CPU time per period, even when the machine is idle. The flag to use in almost every case.</span></div>
  <div class="kv"><span class="k">--cpu-shares 512</span><span class="v">A relative weight, default 1024, and it only applies <em>under contention</em>. Two containers at 512 and 1024 split a busy CPU one-third/two-thirds; on an idle machine both run flat out. Useful for prioritising, useless for capping.</span></div>
  <div class="kv"><span class="k">--cpuset-cpus "0,1"</span><span class="v">Pin to specific cores. Matters for cache locality in latency-sensitive workloads, and for keeping a noisy batch job away from the cores serving traffic.</span></div>
  <div class="kv"><span class="k">--pids-limit 200</span><span class="v">Caps the number of processes. Cheap insurance against a fork bomb — a runaway <code>child_process</code> loop can exhaust the host's PID table and make the whole machine unusable, including your SSH session.</span></div>
</div>
<div class="callout"><strong>Limits change how your runtime sizes itself, which is often the bigger effect.</strong> Modern JVMs, .NET, recent Go (<code>GOMAXPROCS</code>) and Node's heap sizing read the cgroup limits and size themselves accordingly — but only the parts that were written to look. The trap is code that sizes itself from the <em>host</em>: a Node cluster that forks <code>os.cpus().length</code> workers inside a container limited to one CPU starts one worker per host core, all fighting over a single core's quota — context-switch thrash that looks like a mysterious latency problem. (An earlier version of this callout blamed libuv's thread pool; that pool is a fixed 4 threads by default, whatever the host.) Setting limits is a correctness fix as much as a safety one — measure what your runtime sees:</div>
<pre><code class="language-bash">docker run --rm --cpus 1 node:22-alpine node -e \\
  "const os=require('os'); console.log('cpus', os.cpus().length, 'availableParallelism', os.availableParallelism())"
docker run --rm --memory 256m node:22-alpine node -e \\
  "console.log('heap MB', Math.round(require('v8').getHeapStatistics().heap_size_limit/1048576))"
docker run --rm node:22-alpine node -e \\
  "console.log('heap MB', Math.round(require('v8').getHeapStatistics().heap_size_limit/1048576))"
docker run --rm --cpus 1 python:3.12-alpine python -c "import os; print('cpu_count', os.cpu_count())"
docker run --rm --pids-limit 20 alpine sh -c 'for i in \$(seq 1 40); do sleep 30 &amp; done'</code></pre>
<div class="out">cpus 10 availableParallelism 1
heap MB 259
heap MB 2096
cpu_count 10
sh: can't fork: Resource temporarily unavailable</div>
<p>Course Mac, Docker Desktop VM with 10 CPUs. <code>os.availableParallelism()</code> respects <code>--cpus 1</code>; <code>os.cpus()</code> and Python's <code>os.cpu_count()</code> do not. Node's default heap drops from 2096 MB to 259 MB under <code>--memory 256m</code> — without a limit, Node would happily grow toward 2 GB on a 6 GB VPS that also runs Postgres. The last line is <code>--pids-limit</code> doing its job: the 21st process could not be created.</p>

<h3>Restart policies</h3>
${slide('dk-02', 28, 'restart lùi dần 0,1 → 0,2 → 0,4 s — và chỉ nhìn mã thoát')}
<pre><code>docker run -d --name flapping --restart on-failure:3 alpine sh -c 'sleep 2; exit 1'
sleep 20
docker inspect flapping --format 'status={{.State.Status}} exit={{.State.ExitCode}} restarts={{.RestartCount}}'
docker rm -f flapping &gt;/dev/null</code></pre>
<div class="out">status=exited exit=1 restarts=3</div>
<div class="lz-map">
  <div class="lz-stage">no (default)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Never restart</span><span class="lz-nsub">Correct for one-shot jobs, migrations and anything interactive. Wrong for a service — and it is the default, so a bare <code>docker run -d</code> service stays down after any crash.</span></div></div>
  <div class="lz-stage">on-failure[:N]</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Restart only on a non-zero exit, at most N times</span><span class="lz-nsub">Right for batch jobs that should retry a few times and then give up loudly. A clean exit 0 is treated as success and it stops.</span></div></div>
  <div class="lz-stage">always</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Restart on any exit, and start at boot</span><span class="lz-nsub">Including after you deliberately <code>docker stop</code> it — the daemon will start it again when it next starts. That last part surprises people.</span></div></div>
  <div class="lz-stage">unless-stopped</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Like always, but remembers that you stopped it</span><span class="lz-nsub">A container you stopped by hand stays stopped across a reboot. This is the right default for services on a server: it respects your intent.</span></div></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Backoff is built in</span><span class="v">Docker waits 100ms, then doubles — 200ms, 400ms, up to a minute — so a crash loop does not spin the CPU. <code>docker events</code> shows every attempt.</span></div>
  <div class="kv"><span class="k">RestartCount is your signal</span><span class="v">Any container with a non-zero <code>RestartCount</code> deserves a look; a growing one is a crash loop in progress. This is why it is in the sweep in Lesson 2.2.</span></div>
  <div class="kv"><span class="k">It does not react to health</span><span class="v">A restart policy responds only to the process <em>exiting</em>. A container that is running but wedged — deadlocked, event loop blocked, pool exhausted — is <code>Up</code> forever as far as Docker is concerned.</span></div>
  <div class="kv"><span class="k">Compose says restart:</span><span class="v">Same four values, same meanings (Chapter 9). <code>restart: unless-stopped</code> is what most production Compose files should say.</span></div>
</div>
<p><strong>Watch the backoff happen.</strong> The same <code>on-failure:3</code> container, with <code>docker events</code> converted to seconds since the first event (course Mac, Docker 29.8):</p>
<pre><code class="language-bash">docker run -d --name flapping --restart on-failure:3 alpine sh -c 'sleep 2; exit 1'
sleep 25
docker events --since 30s --until 0s --filter container=flapping --format '{{.TimeNano}} {{.Action}}' \\
  | awk 'NR==1{t0=\$1} {printf "%6.2fs %s\\n", (\$1-t0)/1e9, \$2}' | grep -E 'start|die'</code></pre>
<div class="out">  0.09s start
  2.16s die
  2.26s start
  4.34s die
  4.53s start
  6.61s die
  7.00s start
  9.08s die</div>
<p>Each run lives its 2 seconds; the gaps between a <code>die</code> and the next <code>start</code> are 0.10 s, 0.19 s, 0.39 s — doubling, as documented. After the third restart the policy is used up and the container stays <code>exited</code> with <code>RestartCount=3</code>.</p>
<table>
<tr><th>Situation</th><th>Policy</th><th>Why</th></tr>
<tr><td>API, web, database on the VPS</td><td><code>unless-stopped</code></td><td>Comes back after crashes and reboots, respects a deliberate stop</td></tr>
<tr><td>Nightly backup / import job that may fail on a network blip</td><td><code>on-failure:3</code></td><td>Retries a little, then stops and leaves an exit code to look at</td></tr>
<tr><td>Migration, seed, one-off script</td><td><code>no</code> (default)</td><td>Running it twice may be harmful; you want to see it fail</td></tr>
<tr><td>Something you want back even after you stopped it</td><td><code>always</code></td><td>Rare — and surprising to whoever stopped it</td></tr>
<tr><td>Anything run with <code>--rm</code></td><td>—</td><td>Docker refuses: <code>conflicting options: cannot specify both --restart and --rm</code> (exit 125)</td></tr>
</table>

<h3>Healthchecks — and what they do NOT do</h3>
${slide('dk-02', 29, 'Healthcheck chỉ BÁO — unhealthy mà vẫn Up')}
<pre><code>docker run -d --name api -p 8080:80 \\
  --health-cmd 'wget -qO- http://localhost/ &gt;/dev/null || exit 1' \\
  --health-interval 5s --health-timeout 2s --health-retries 3 --health-start-period 10s \\
  nginx:1.27-alpine
sleep 12; docker ps --format '{{.Names}} {{.Status}}'
docker inspect api --format '{{.State.Health.Status}} · {{len .State.Health.Log}} checks'</code></pre>
<div class="out">api Up 12 seconds (healthy)
healthy · 3 checks</div>
<pre><code><span class="tok-comment"># Break it and watch the state change — but NOT the container</span>
docker exec api rm /usr/share/nginx/html/index.html
sleep 25
docker ps --format '{{.Names}} {{.Status}}'
docker inspect api --format '{{.State.Health.Status}} · restarts={{.RestartCount}}'
docker inspect api --format '{{(index .State.Health.Log 0).ExitCode}} {{(index .State.Health.Log 0).Output}}'</code></pre>
<div class="out">api Up 37 seconds (unhealthy)
unhealthy · restarts=0
1 wget: server returned error: HTTP/1.1 403 Forbidden</div>
<div class="callout warn"><strong>An unhealthy container keeps running. Docker does not restart it.</strong> This is the single most common misconception about healthchecks, and it costs people an outage: they add a healthcheck, assume the platform will act on it, and nothing does. Plain Docker only <em>reports</em> health. What consumes it:
<div class="kv-grid">
  <div class="kv"><span class="k">Compose depends_on: condition: service_healthy</span><span class="v">Dependent services wait for healthy before starting. This is the big one, and Chapter 9 relies on it.</span></div>
  <div class="kv"><span class="k">Orchestrators</span><span class="v">Swarm, Kubernetes and Nomad reschedule on unhealthy. That is what the assumption is actually remembering.</span></div>
  <div class="kv"><span class="k">Load balancers and your own scripts</span><span class="v">Traefik and nginx-proxy route away from unhealthy containers; a cron job can restart them. Both are things you set up deliberately.</span></div>
  <div class="kv"><span class="k">Your deploy script</span><span class="v">Wait for <code>healthy</code> before swapping traffic, and abort the deploy if it never gets there. Chapter 11 builds exactly this.</span></div>
</div></div>
<div class="kv-grid">
  <div class="kv"><span class="k">--health-start-period</span><span class="v">A grace window during which failures do not count. Essential for anything slow to boot — a JVM, a database restoring WAL — otherwise it is marked unhealthy before it ever had a chance.</span></div>
  <div class="kv"><span class="k">Check a real dependency</span><span class="v">A healthcheck that only proves the process is alive is nearly worthless; the process being alive is already visible. Check the thing that actually breaks: can it query the database, is the queue reachable.</span></div>
  <div class="kv"><span class="k">Keep it cheap</span><span class="v">It runs every interval, forever, inside the container. A check that takes a second and hits the database is 86,400 queries a day per replica.</span></div>
  <div class="kv"><span class="k">Better in the Dockerfile</span><span class="v"><code>HEALTHCHECK</code> as an instruction travels with the image, so everyone who runs it gets the check (Chapter 4). Flags on <code>run</code> are for overriding it.</span></div>
</div>
<p><strong>Re-run on Docker 29 (course Mac).</strong> Twelve seconds in, <code>docker ps</code> said <code>Up 12 seconds (healthy)</code> after 2 checks; after deleting <code>index.html</code>, <code>Up 37 seconds (unhealthy)</code>, <code>FailingStreak=5</code> and <code>RestartCount=0</code>. The newest log entry holds the check's own output: <code>1 wget: server returned error: HTTP/1.1 403 Forbidden</code> — nginx answers 403 for a directory with no index. <code>docker events</code> recorded one <code>health_status: healthy</code>, one <code>health_status: unhealthy</code>, and seven <code>exec_start</code>: each check is simply a <code>docker exec</code> of your command. We repeated it with <code>--restart unless-stopped</code> added: still <code>unhealthy restarts=0</code>. The restart policy only reacts to the process <em>exiting</em>.</p>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th><th>When to use it</th></tr>
<tr><td><code>--health-cmd</code></td><td>Command run inside the container; exit 0 = healthy, 1 = unhealthy</td><td><code>'wget -qO- http://localhost/ &gt;/dev/null || exit 1'</code></td><td>Anything others wait for: DB, API</td></tr>
<tr><td><code>--health-interval</code></td><td>Time between checks</td><td><code>5s</code> (default 30s)</td><td>Shorter in dev, longer in production</td></tr>
<tr><td><code>--health-timeout</code></td><td>A check slower than this counts as failed</td><td><code>2s</code></td><td>Always; a hanging check must fail</td></tr>
<tr><td><code>--health-retries</code></td><td>Consecutive failures before "unhealthy"</td><td><code>3</code></td><td>Avoids flapping on one slow request</td></tr>
<tr><td><code>--health-start-period</code></td><td>Grace period at boot</td><td><code>10s</code>, <code>60s</code> for a JVM</td><td>Slow starters: databases, Java</td></tr>
<tr><td><code>--no-healthcheck</code></td><td>Disable the image's HEALTHCHECK</td><td>—</td><td>Debugging a container whose check is noisy</td></tr>
</table>
<pre><code>docker rm -f api unbounded bounded oomtest &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team VPS has 6 GB and runs Postgres, the API and sometimes a <code>next build</code>. Last week one container ate all the RAM and the database died with it. Start the web container "the production way" and prove each guard works.</p><ol>
<li>In <code>~/thu-docker</code>: <code>docker run -d --name thu-p5 --memory 64m --memory-swap 64m --cpus 0.5 --restart unless-stopped -p 127.0.0.1:8085:80 --health-cmd 'wget -qO- http://localhost/ &gt;/dev/null || exit 1' --health-interval 5s --health-retries 3 --health-start-period 10s nginx:1.27-alpine</code>.</li>
<li>After 12 seconds: <code>docker stats --no-stream thu-p5 --format '{{.Name}} {{.MemUsage}}'</code> and <code>docker ps --filter name=thu-p5</code>.</li>
<li>Break it: <code>docker exec thu-p5 rm /usr/share/nginx/html/index.html</code>; wait 20 seconds; read <code>.State.Health.Status</code>, <code>.RestartCount</code> and the restart policy in one <code>inspect</code>.</li>
<li>Explain in one sentence why the container was not restarted, and name the tool in this course that WILL act on "unhealthy".</li>
<li>Prove the memory guard separately with the <code>dd</code> test from this lesson (<code>OOMKilled=true</code>), then <code>docker rm -f thu-p5</code>.</li></ol>
<div class="out">thu-p5 9.715MiB / 64MiB
thu-p5 Up 13 seconds (healthy)
unhealthy restarts=0 policy=unless-stopped</div>
<p><strong>Done when:</strong> your three lines match these (the MiB used will differ slightly), and your sentence says "a restart policy reacts only to the process exiting; health is only reported" and names Compose <code>depends_on: service_healthy</code> or your deploy script.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Resource limit</span><span class="v">A ceiling the kernel enforces through cgroups: memory, CPU quota, number of processes.</span></div>
  <div class="kv"><span class="k">OOM kill</span><span class="v">The kernel killing a process that crossed its memory limit. Exit 137, <code>OOMKilled=true</code>.</span></div>
  <div class="kv"><span class="k">Swap</span><span class="v">Disk used as extra memory. It raises the real ceiling unless <code>--memory-swap</code> equals <code>--memory</code>.</span></div>
  <div class="kv"><span class="k">CPU quota (--cpus)</span><span class="v">How much CPU time per period a container may use — a hard cap, even on an idle machine.</span></div>
  <div class="kv"><span class="k">Restart policy</span><span class="v">What Docker does when the main process exits: <code>no</code>, <code>on-failure[:N]</code>, <code>always</code>, <code>unless-stopped</code>.</span></div>
  <div class="kv"><span class="k">Backoff</span><span class="v">Waiting longer after each failed restart (100 ms, 200 ms, 400 ms…) so a crash loop does not burn the CPU.</span></div>
  <div class="kv"><span class="k">Healthcheck</span><span class="v">A command Docker runs periodically inside the container to report healthy/unhealthy. It never restarts anything by itself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>No <code>--memory</code> means the container may take the whole machine; <code>docker stats</code> shows the host total as the "limit".</li>
<li>A real OOM test holds memory and disables swap: <code>--memory 128m --memory-swap 128m</code> + <code>dd bs=200M</code> → 137, <code>OOMKilled=true</code>.</li>
<li><code>--cpus</code> is a hard quota; some runtimes read it (<code>availableParallelism</code>), others do not (<code>os.cpus()</code>, Python <code>cpu_count</code>).</li>
<li>Restart policies react to exits only, with doubling backoff; <code>unless-stopped</code> is the default for services.</li>
<li>Healthchecks report; plain Docker never restarts an unhealthy container, even with a restart policy.</li>
<li>Read <code>RestartCount</code>, <code>OOMKilled</code> and <code>Health.Status</code> together — they explain most "it keeps dying" incidents.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/containers/resource_constraints/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Runtime options with memory, CPUs and GPUs</span><span class="lc-sub">Every limit flag with its cgroup meaning, including the swap arithmetic that is easy to get wrong and the warning about <code>--oom-kill-disable</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/containers/start-containers-automatically/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Restart policies</span><span class="lc-sub">The four values, the backoff schedule, and the precise difference between <code>always</code> and <code>unless-stopped</code> at daemon start — the part worth reading twice.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">HEALTHCHECK in the Dockerfile</span><span class="lc-sub">The instruction form, the exit-code contract (0 healthy, 1 unhealthy), and the explicit note that Docker itself takes no action on unhealthy.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: limits and restarts</span><span class="lc-sub">Graded exercises: prove a memory limit with <code>OOMKilled</code>, pick the right restart policy for three scenarios, add a healthcheck that catches a wedged process, and explain why the container did not restart.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>--restart always</code> on a container that exits immediately. If the command is wrong — a typo in the entrypoint, a missing environment variable — the container dies in milliseconds and Docker restarts it forever. The backoff caps the CPU cost at roughly one attempt per minute, but the container never runs and the failure is silent unless you look. Worse, <code>always</code> also restarts it after you deliberately stopped it, the next time the daemon starts, so "I stopped that yesterday" is not a stable state. Use <code>unless-stopped</code> for services, watch <code>RestartCount</code>, and treat a container in the <code>restarting</code> state as an incident (Chapter 12).</div>
<p class="note-ct"><strong>Three things to remember.</strong> A container with no <code>--memory</code> can take the whole host down, and limits also tell modern runtimes how to size themselves, so setting them is about correctness as well as safety. <code>unless-stopped</code> is the right restart policy for services because it respects a deliberate stop, while <code>always</code> undoes it at the next daemon start. And a healthcheck only <em>reports</em> — Docker will never restart an unhealthy container, so something else (Compose <code>depends_on</code>, an orchestrator, your deploy script) has to act on it.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Giới hạn, chính sách khởi động lại và healthcheck</h2>
<p class="lead">Mặc định thì một container dùng được MỌI byte RAM và MỌI nhân CPU của cái máy. Điều đó ổn trên laptop của bạn và là một rủi ro sự cố có thật trên máy chủ, vì một tiến trình rò rỉ sẽ kéo sập cái cơ sở dữ liệu đang ở chung máy với nó. Ba nhóm cờ chữa chuyện đó, và nhóm thứ ba — healthcheck — làm một việc KHÁC với thứ phần lớn người ta tưởng.</p>

<h3>Bộ nhớ</h3>
${slide('dk-02', 25, 'Không có --memory = container được lấy cả cái máy')}
<pre><code>docker run -d --name unbounded nginx:1.27-alpine
docker stats --no-stream unbounded --format '{{.Name}} {{.MemUsage}}'

docker run -d --name bounded --memory 256m --memory-reservation 128m nginx:1.27-alpine
docker stats --no-stream bounded --format '{{.Name}} {{.MemUsage}}'</code></pre>
<div class="out">unbounded 3.629MiB / 15.46GiB
bounded 3.598MiB / 256MiB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--memory 256m</span><span class="v">Một cái TRẦN CỨNG. Vượt qua là nhân OOM-giết một tiến trình trong container — thường là tiến trình chính, cho ra mã thoát 137. Đây là một bức tường, không phải một lời gợi ý.</span></div>
  <div class="kv"><span class="k">--memory-reservation 128m</span><span class="v">Một mục tiêu MỀM. Khi máy chủ bị ép bộ nhớ, nhân sẽ đẩy container này về phía 128MB TRƯỚC KHI đụng tới những container còn nằm trong mức đặt trước của chúng. Hãy đặt nó thấp hơn <code>--memory</code>, ở khoảng mức dùng bình thường.</span></div>
  <div class="kv"><span class="k">--memory-swap</span><span class="v">Tổng bộ nhớ + swap. Đặt nó BẰNG <code>--memory</code> là tắt swap cho container, và đó là thứ bạn muốn với một dịch vụ nhạy cảm về độ trễ: thà hỏng nhanh còn hơn giãy giụa.</span></div>
  <div class="kv"><span class="k">--oom-kill-disable</span><span class="v">Gần như luôn là một sai lầm. Container ĐÓNG BĂNG thay vì chết khi chạm trần, và một tiến trình đóng băng đang giữ khoá thì khó phục hồi hơn một tiến trình đã chết rồi khởi động lại.</span></div>
</div>
<h3>Đâm vào tường một cách có chủ ý</h3>
${slide('dk-02', 26, 'Thử chạm trần: phải cấp phát thật và tắt swap mới thấy OOM')}
<pre><code><span class="tok-comment"># Đâm vào tường một cách có chủ ý rồi đọc hậu quả</span>
docker run --name oomtest --memory 128m --memory-swap 128m alpine \\
  dd if=/dev/zero of=/dev/null bs=200M count=1 2&gt;/dev/null
docker inspect oomtest --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}'
docker run --rm --privileged alpine dmesg | grep -i 'killed process' | tail -1</code></pre>
<div class="out">exit=137 oom=true
[80472.973730] Memory cgroup out of memory: Killed process 393902 (dd) total-vm:206436kB, anon-rss:130472kB, file-rss:928kB, shmem-rss:0kB, UID:0 pgtables:304kB oom_score_adj:0</div>
<div class="callout ok"><strong><code>.State.OOMKilled</code> là cái trường chấm dứt cuộc tranh cãi.</strong> Riêng mã 137 thì mập mờ — nó có thể là một lệnh <code>docker kill</code>, một lệnh <code>docker stop</code> hết giờ, hay kẻ giết OOM. Cái boolean đó nói rõ là cái nào, và <code>dmesg</code> trên máy chủ xác nhận lại và gọi tên tiến trình. Hãy đưa cả hai vào script phân loại của bạn (Bài 2.2); cùng nhau chúng biến mã thoát bí ẩn phổ biến nhất thành một câu trả lời năm giây.</div>
<div class="callout warn"><strong>Đính chính (chạy lại tháng 9/2026).</strong> Bản demo trước dùng <code>--memory 64m</code> với <code>head -c 200m /dev/zero | tail -c 1</code>. Chạy thật trên Docker 29 nó in <code>exit=0 oom=false</code>: <code>tail -c 1</code> chỉ giữ đúng byte cuối cùng, nên chẳng bao giờ có gì gần 64 MB nằm trong bộ nhớ, và không có <code>--memory-swap</code> thì container còn được dùng thêm 64 MB swap nữa. Một phép thử bộ nhớ phải <em>GIỮ</em> bộ nhớ (<code>dd … bs=200M</code> cấp phát một vùng đệm 200 MB) và phải đóng cửa swap (<code>--memory-swap</code> bằng <code>--memory</code>). Output ở trên là của máy Linux của khoá; <code>dmesg</code> cần root nên nó chạy trong một container dùng-xong-vứt có <code>--privileged</code> — trên Mac cùng lệnh đó đọc nhật ký nhân của máy ảo Docker Desktop.</div>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th><th>Khi nào dùng</th></tr>
<tr><td><code>--memory</code></td><td>Trần RAM cứng</td><td><code>--memory 256m</code></td><td>Mọi dịch vụ trên một máy chủ dùng chung</td></tr>
<tr><td><code>--memory-swap</code></td><td>Tổng RAM + swap; bằng <code>--memory</code> = không swap</td><td><code>--memory 256m --memory-swap 256m</code></td><td>Dịch vụ nhạy độ trễ; phép thử OOM</td></tr>
<tr><td><code>--memory-reservation</code></td><td>Mục tiêu mềm khi máy chủ thiếu RAM</td><td><code>--memory-reservation 128m</code></td><td>Nhiều container trên một máy; đặt gần mức dùng thường</td></tr>
<tr><td><code>--oom-kill-disable</code></td><td>Đóng băng thay vì chết</td><td>—</td><td>Gần như không bao giờ; chỉ đi cùng <code>--memory</code></td></tr>
</table>

<h3>CPU</h3>
${slide('dk-02', 27, '--cpus là hạn ngạch cứng — và app tự đo lại chính nó')}
<pre><code>docker run -d --name half --cpus 0.5 alpine sh -c 'while :; do :; done'
docker run -d --name full alpine sh -c 'while :; do :; done'
sleep 3; docker stats --no-stream --format '{{.Name}} {{.CPUPerc}}' half full
docker rm -f half full &gt;/dev/null</code></pre>
<div class="out">half 50.02%
full 100.11%</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--cpus 1.5</span><span class="v">Một hạn ngạch CỨNG: nhiều nhất là lượng thời gian CPU tương đương 1,5 nhân mỗi chu kỳ, kể cả khi cái máy đang rảnh. Cái cờ nên dùng trong gần như mọi trường hợp.</span></div>
  <div class="kv"><span class="k">--cpu-shares 512</span><span class="v">Một TRỌNG SỐ tương đối, mặc định 1024, và nó chỉ có tác dụng <em>KHI CÓ TRANH CHẤP</em>. Hai container ở mức 512 và 1024 chia một CPU đang bận theo tỷ lệ một phần ba/hai phần ba; trên một cái máy rảnh thì cả hai chạy hết công suất. Hữu ích để ưu tiên, vô dụng để chặn trần.</span></div>
  <div class="kv"><span class="k">--cpuset-cpus "0,1"</span><span class="v">Ghim vào những nhân cụ thể. Có ý nghĩa với tính cục bộ của bộ đệm trong các tải nhạy cảm độ trễ, và để giữ một công việc nền ồn ào tránh xa những nhân đang phục vụ lưu lượng.</span></div>
  <div class="kv"><span class="k">--pids-limit 200</span><span class="v">Chặn số tiến trình. Một khoản bảo hiểm rẻ chống bom fork — một vòng lặp <code>child_process</code> mất kiểm soát có thể vét cạn bảng PID của máy chủ và làm cả cái máy không dùng được, gồm cả phiên SSH của bạn.</span></div>
</div>
<div class="callout"><strong>Giới hạn đổi cách môi trường chạy của bạn TỰ ĐỊNH KÍCH THƯỚC, và đó thường mới là tác động lớn hơn.</strong> JVM hiện đại, .NET, Go bản gần đây (<code>GOMAXPROCS</code>) và cách Node tính vùng nhớ heap đều đọc giới hạn cgroup rồi tự định kích thước theo đó — nhưng chỉ những phần được viết để đi đọc. Cái bẫy là mã tự định kích thước theo <em>MÁY CHỦ</em>: một cluster Node fork ra <code>os.cpus().length</code> worker trong một container bị giới hạn một CPU sẽ khởi chạy mỗi nhân máy chủ một worker, tất cả giành nhau hạn ngạch của một nhân — cảnh chuyển ngữ cảnh giằng xé trông y hệt một vấn đề độ trễ khó hiểu. (Bản trước của khung này đổ tại bể luồng của libuv; bể đó mặc định cố định 4 luồng, bất kể máy chủ.) Đặt giới hạn là một cách sửa TÍNH ĐÚNG ĐẮN chứ không chỉ là an toàn — hãy đo xem môi trường chạy của bạn thấy gì:</div>
<pre><code class="language-bash">docker run --rm --cpus 1 node:22-alpine node -e \\
  "const os=require('os'); console.log('cpus', os.cpus().length, 'availableParallelism', os.availableParallelism())"
docker run --rm --memory 256m node:22-alpine node -e \\
  "console.log('heap MB', Math.round(require('v8').getHeapStatistics().heap_size_limit/1048576))"
docker run --rm node:22-alpine node -e \\
  "console.log('heap MB', Math.round(require('v8').getHeapStatistics().heap_size_limit/1048576))"
docker run --rm --cpus 1 python:3.12-alpine python -c "import os; print('cpu_count', os.cpu_count())"
docker run --rm --pids-limit 20 alpine sh -c 'for i in \$(seq 1 40); do sleep 30 &amp; done'</code></pre>
<div class="out">cpus 10 availableParallelism 1
heap MB 259
heap MB 2096
cpu_count 10
sh: can't fork: Resource temporarily unavailable</div>
<p>Máy Mac của khoá, máy ảo Docker Desktop có 10 CPU. <code>os.availableParallelism()</code> tôn trọng <code>--cpus 1</code>; <code>os.cpus()</code> và <code>os.cpu_count()</code> của Python thì không. Heap mặc định của Node tụt từ 2096 MB xuống 259 MB dưới <code>--memory 256m</code> — không có trần, Node sẵn sàng phình tới gần 2 GB trên một VPS 6 GB đang chạy cả Postgres. Dòng cuối là <code>--pids-limit</code> làm đúng việc của nó: tiến trình thứ 21 không tạo được.</p>

<h3>Chính sách khởi động lại</h3>
${slide('dk-02', 28, 'restart lùi dần 0,1 → 0,2 → 0,4 s — và chỉ nhìn mã thoát')}
<pre><code>docker run -d --name flapping --restart on-failure:3 alpine sh -c 'sleep 2; exit 1'
sleep 20
docker inspect flapping --format 'status={{.State.Status}} exit={{.State.ExitCode}} restarts={{.RestartCount}}'
docker rm -f flapping &gt;/dev/null</code></pre>
<div class="out">status=exited exit=1 restarts=3</div>
<div class="lz-map">
  <div class="lz-stage">no (mặc định)</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không bao giờ khởi động lại</span><span class="lz-nsub">Đúng cho việc chạy một lần, migration và mọi thứ tương tác. SAI cho một dịch vụ — và nó là MẶC ĐỊNH, nên một dịch vụ chạy bằng <code>docker run -d</code> trần trụi sẽ nằm chết sau bất kỳ cú sập nào.</span></div></div>
  <div class="lz-stage">on-failure[:N]</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chỉ khởi động lại khi thoát khác 0, nhiều nhất N lần</span><span class="lz-nsub">Đúng cho những công việc nền nên thử lại vài lần rồi bỏ cuộc một cách ồn ào. Một cú thoát sạch mã 0 được coi là thành công và nó dừng.</span></div></div>
  <div class="lz-stage">always</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Khởi động lại ở MỌI cú thoát, và lên cùng máy</span><span class="lz-nsub">Kể cả sau khi bạn CỐ Ý <code>docker stop</code> nó — tiến trình nền sẽ khởi chạy lại nó ở lần khởi động kế tiếp của chính nó. Vế cuối đó làm người ta bất ngờ.</span></div></div>
  <div class="lz-stage">unless-stopped</div>
  <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Giống always, nhưng NHỚ rằng bạn đã dừng nó</span><span class="lz-nsub">Một container bạn dừng bằng tay sẽ vẫn dừng sau khi khởi động lại máy. Đây là mặc định đúng cho dịch vụ trên máy chủ: nó tôn trọng ý định của bạn.</span></div></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Có sẵn cơ chế lùi dần</span><span class="v">Docker chờ 100ms, rồi nhân đôi — 200ms, 400ms, tới một phút — nên một vòng lặp sập không quay tít CPU. <code>docker events</code> cho thấy từng lượt thử.</span></div>
  <div class="kv"><span class="k">RestartCount là tín hiệu của bạn</span><span class="v">Bất kỳ container nào có <code>RestartCount</code> khác 0 đều đáng nhìn; một con số đang tăng là một vòng lặp sập đang diễn ra. Đó là lý do nó có mặt trong cuộc quét ở Bài 2.2.</span></div>
  <div class="kv"><span class="k">Nó KHÔNG phản ứng với sức khoẻ</span><span class="v">Một chính sách khởi động lại chỉ đáp lại việc tiến trình <em>THOÁT</em>. Một container đang chạy mà kẹt cứng — bế tắc, vòng lặp sự kiện bị chặn, bể kết nối cạn — thì với Docker vẫn là <code>Up</code> mãi mãi.</span></div>
  <div class="kv"><span class="k">Compose ghi là restart:</span><span class="v">Vẫn bốn giá trị đó, cùng ý nghĩa (Chương 9). <code>restart: unless-stopped</code> là thứ mà phần lớn file Compose cho production nên ghi.</span></div>
</div>
<p><strong>Nhìn cơ chế lùi dần xảy ra.</strong> Cùng container <code>on-failure:3</code>, với <code>docker events</code> đổi thành số giây kể từ sự kiện đầu tiên (máy Mac của khoá, Docker 29.8):</p>
<pre><code class="language-bash">docker run -d --name flapping --restart on-failure:3 alpine sh -c 'sleep 2; exit 1'
sleep 25
docker events --since 30s --until 0s --filter container=flapping --format '{{.TimeNano}} {{.Action}}' \\
  | awk 'NR==1{t0=\$1} {printf "%6.2fs %s\\n", (\$1-t0)/1e9, \$2}' | grep -E 'start|die'</code></pre>
<div class="out">  0.09s start
  2.16s die
  2.26s start
  4.34s die
  4.53s start
  6.61s die
  7.00s start
  9.08s die</div>
<p>Mỗi lượt sống đủ 2 giây của nó; khoảng hở giữa một <code>die</code> và lượt <code>start</code> kế tiếp là 0,10 s, 0,19 s, 0,39 s — gấp đôi, đúng như tài liệu. Sau lần khởi động lại thứ ba thì chính sách hết lượt và container nằm yên ở <code>exited</code> với <code>RestartCount=3</code>.</p>
<table>
<tr><th>Tình huống</th><th>Chính sách</th><th>Vì sao</th></tr>
<tr><td>API, web, cơ sở dữ liệu trên VPS</td><td><code>unless-stopped</code></td><td>Tự lên lại sau cú sập và sau khởi động lại máy, tôn trọng lần bạn cố ý dừng</td></tr>
<tr><td>Job sao lưu / nhập dữ liệu ban đêm có thể hỏng vì mạng chập chờn</td><td><code>on-failure:3</code></td><td>Thử lại một chút rồi dừng, để lại mã thoát cho bạn xem</td></tr>
<tr><td>Migration, seed, script chạy một lần</td><td><code>no</code> (mặc định)</td><td>Chạy hai lần có thể gây hại; bạn muốn THẤY nó hỏng</td></tr>
<tr><td>Thứ bạn muốn lên lại kể cả sau khi đã tự dừng</td><td><code>always</code></td><td>Hiếm — và gây bất ngờ cho người đã dừng nó</td></tr>
<tr><td>Bất cứ thứ gì chạy với <code>--rm</code></td><td>—</td><td>Docker từ chối: <code>conflicting options: cannot specify both --restart and --rm</code> (mã 125)</td></tr>
</table>

<h3>Healthcheck — và thứ nó KHÔNG làm</h3>
${slide('dk-02', 29, 'Healthcheck chỉ BÁO — unhealthy mà vẫn Up')}
<pre><code>docker run -d --name api -p 8080:80 \\
  --health-cmd 'wget -qO- http://localhost/ &gt;/dev/null || exit 1' \\
  --health-interval 5s --health-timeout 2s --health-retries 3 --health-start-period 10s \\
  nginx:1.27-alpine
sleep 12; docker ps --format '{{.Names}} {{.Status}}'
docker inspect api --format '{{.State.Health.Status}} · {{len .State.Health.Log}} lượt kiểm'</code></pre>
<div class="out">api Up 12 seconds (healthy)
healthy · 3 lượt kiểm</div>
<pre><code><span class="tok-comment"># Phá nó rồi nhìn trạng thái đổi — nhưng container thì KHÔNG</span>
docker exec api rm /usr/share/nginx/html/index.html
sleep 25
docker ps --format '{{.Names}} {{.Status}}'
docker inspect api --format '{{.State.Health.Status}} · restarts={{.RestartCount}}'
docker inspect api --format '{{(index .State.Health.Log 0).ExitCode}} {{(index .State.Health.Log 0).Output}}'</code></pre>
<div class="out">api Up 37 seconds (unhealthy)
unhealthy · restarts=0
1 wget: server returned error: HTTP/1.1 403 Forbidden</div>
<div class="callout warn"><strong>Một container không khoẻ vẫn CHẠY TIẾP. Docker KHÔNG khởi động lại nó.</strong> Đây là hiểu lầm phổ biến nhất về healthcheck, và nó khiến người ta trả giá bằng một sự cố: họ thêm một healthcheck, cho rằng nền tảng sẽ hành động theo nó, và chẳng có gì hành động cả. Docker trần chỉ <em>BÁO CÁO</em> sức khoẻ. Những thứ TIÊU THỤ nó:
<div class="kv-grid">
  <div class="kv"><span class="k">Compose depends_on: condition: service_healthy</span><span class="v">Các dịch vụ phụ thuộc CHỜ tới khi khoẻ mới khởi chạy. Đây là cái lớn nhất, và Chương 9 dựa vào nó.</span></div>
  <div class="kv"><span class="k">Các bộ điều phối</span><span class="v">Swarm, Kubernetes và Nomad lên lịch lại khi không khoẻ. Đó chính là thứ mà cái giả định kia đang nhớ nhầm sang.</span></div>
  <div class="kv"><span class="k">Cân bằng tải và script của chính bạn</span><span class="v">Traefik và nginx-proxy định tuyến tránh những container không khoẻ; một công việc cron có thể khởi động lại chúng. Cả hai đều là thứ bạn phải chủ động dựng lên.</span></div>
  <div class="kv"><span class="k">Script deploy của bạn</span><span class="v">Hãy chờ tới <code>healthy</code> rồi mới chuyển lưu lượng sang, và huỷ bản deploy nếu nó không bao giờ tới đó. Chương 11 dựng đúng cái này.</span></div>
</div></div>
<div class="kv-grid">
  <div class="kv"><span class="k">--health-start-period</span><span class="v">Một khung ân hạn mà trong đó những lần hỏng không bị tính. Thiết yếu với bất cứ thứ gì khởi động chậm — một JVM, một cơ sở dữ liệu đang phục hồi WAL — không thì nó bị đánh dấu không khoẻ trước cả khi có cơ hội.</span></div>
  <div class="kv"><span class="k">Hãy kiểm một thứ phụ thuộc THẬT</span><span class="v">Một healthcheck chỉ chứng minh tiến trình còn sống thì gần như vô giá trị; tiến trình còn sống vốn đã nhìn thấy được. Hãy kiểm cái thứ THẬT SỰ hỏng: nó có truy vấn được cơ sở dữ liệu không, hàng đợi có với tới được không.</span></div>
  <div class="kv"><span class="k">Giữ nó RẺ</span><span class="v">Nó chạy theo mỗi chu kỳ, mãi mãi, bên trong container. Một phép kiểm tốn một giây và có đụng cơ sở dữ liệu là 86.400 truy vấn mỗi ngày cho MỖI bản sao.</span></div>
  <div class="kv"><span class="k">Tốt hơn thì đặt trong Dockerfile</span><span class="v"><code>HEALTHCHECK</code> dưới dạng một chỉ thị thì đi theo cái ảnh, nên ai chạy nó cũng có phép kiểm đó (Chương 4). Mấy cái cờ trên <code>run</code> là để GHI ĐÈ nó.</span></div>
</div>
<p><strong>Chạy lại trên Docker 29 (máy Mac của khoá).</strong> Sau mười hai giây, <code>docker ps</code> báo <code>Up 12 seconds (healthy)</code> sau 2 lượt kiểm; sau khi xoá <code>index.html</code> thì <code>Up 37 seconds (unhealthy)</code>, <code>FailingStreak=5</code> và <code>RestartCount=0</code>. Mục log mới nhất giữ chính output của lượt kiểm: <code>1 wget: server returned error: HTTP/1.1 403 Forbidden</code> — nginx trả 403 cho một thư mục không có file index. <code>docker events</code> ghi một <code>health_status: healthy</code>, một <code>health_status: unhealthy</code>, và bảy <code>exec_start</code>: mỗi lượt kiểm đơn giản là một lần <code>docker exec</code> câu lệnh của bạn. Chúng tôi làm lại, thêm <code>--restart unless-stopped</code>: vẫn <code>unhealthy restarts=0</code>. Chính sách restart chỉ phản ứng khi tiến trình <em>THOÁT</em>.</p>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th><th>Khi nào dùng</th></tr>
<tr><td><code>--health-cmd</code></td><td>Lệnh chạy bên trong container; thoát 0 = khoẻ, 1 = không khoẻ</td><td><code>'wget -qO- http://localhost/ &gt;/dev/null || exit 1'</code></td><td>Thứ mà người khác phải chờ: CSDL, API</td></tr>
<tr><td><code>--health-interval</code></td><td>Khoảng cách giữa các lượt kiểm</td><td><code>5s</code> (mặc định 30s)</td><td>Ngắn khi dev, dài hơn trên production</td></tr>
<tr><td><code>--health-timeout</code></td><td>Lượt kiểm chậm hơn mức này bị tính là hỏng</td><td><code>2s</code></td><td>Luôn đặt; một lượt kiểm treo phải bị tính hỏng</td></tr>
<tr><td><code>--health-retries</code></td><td>Số lần hỏng liên tiếp trước khi "unhealthy"</td><td><code>3</code></td><td>Tránh chập chờn vì một request chậm</td></tr>
<tr><td><code>--health-start-period</code></td><td>Khoảng ân hạn lúc khởi động</td><td><code>10s</code>, <code>60s</code> cho JVM</td><td>Thứ khởi động chậm: CSDL, Java</td></tr>
<tr><td><code>--no-healthcheck</code></td><td>Tắt HEALTHCHECK của ảnh</td><td>—</td><td>Gỡ lỗi một container có lượt kiểm ồn ào</td></tr>
</table>
<pre><code>docker rm -f api unbounded bounded oomtest &gt;/dev/null 2&gt;&amp;1</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của nhóm có 6 GB và chạy Postgres, API và thỉnh thoảng một lượt <code>next build</code>. Tuần trước một container ăn hết RAM và cơ sở dữ liệu chết theo. Hãy chạy container web "theo kiểu production" và chứng minh từng lớp bảo vệ hoạt động.</p><ol>
<li>Trong <code>~/thu-docker</code>: <code>docker run -d --name thu-p5 --memory 64m --memory-swap 64m --cpus 0.5 --restart unless-stopped -p 127.0.0.1:8085:80 --health-cmd 'wget -qO- http://localhost/ &gt;/dev/null || exit 1' --health-interval 5s --health-retries 3 --health-start-period 10s nginx:1.27-alpine</code>.</li>
<li>Sau 12 giây: <code>docker stats --no-stream thu-p5 --format '{{.Name}} {{.MemUsage}}'</code> và <code>docker ps --filter name=thu-p5</code>.</li>
<li>Phá nó: <code>docker exec thu-p5 rm /usr/share/nginx/html/index.html</code>; chờ 20 giây; đọc <code>.State.Health.Status</code>, <code>.RestartCount</code> và chính sách restart trong MỘT lệnh <code>inspect</code>.</li>
<li>Giải thích bằng một câu vì sao container KHÔNG được khởi động lại, và gọi tên công cụ trong khoá này SẼ hành động theo "unhealthy".</li>
<li>Chứng minh riêng lớp bảo vệ bộ nhớ bằng phép thử <code>dd</code> trong bài (<code>OOMKilled=true</code>), rồi <code>docker rm -f thu-p5</code>.</li></ol>
<div class="out">thu-p5 9.715MiB / 64MiB
thu-p5 Up 13 seconds (healthy)
unhealthy restarts=0 policy=unless-stopped</div>
<p><strong>Đạt khi:</strong> ba dòng của bạn khớp với ba dòng này (số MiB đang dùng sẽ lệch chút ít), và câu của bạn nói được "chính sách restart chỉ phản ứng khi tiến trình thoát; sức khoẻ chỉ được báo cáo" đồng thời gọi tên Compose <code>depends_on: service_healthy</code> hoặc script deploy của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Resource limit (giới hạn tài nguyên)</span><span class="v">Cái trần mà nhân thi hành qua cgroup: bộ nhớ, hạn ngạch CPU, số tiến trình.</span></div>
  <div class="kv"><span class="k">OOM kill (bị giết vì hết bộ nhớ)</span><span class="v">Nhân giết một tiến trình đã vượt trần bộ nhớ của nó. Mã 137, <code>OOMKilled=true</code>.</span></div>
  <div class="kv"><span class="k">Swap (bộ nhớ tráo đổi)</span><span class="v">Đĩa dùng làm bộ nhớ phụ. Nó nâng trần thật lên, trừ khi <code>--memory-swap</code> bằng <code>--memory</code>.</span></div>
  <div class="kv"><span class="k">CPU quota (hạn ngạch CPU, --cpus)</span><span class="v">Lượng thời gian CPU mỗi chu kỳ mà container được dùng — trần cứng, kể cả khi máy rảnh.</span></div>
  <div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v">Docker làm gì khi tiến trình chính thoát: <code>no</code>, <code>on-failure[:N]</code>, <code>always</code>, <code>unless-stopped</code>.</span></div>
  <div class="kv"><span class="k">Backoff (lùi dần)</span><span class="v">Chờ lâu hơn sau mỗi lần khởi động lại thất bại (100 ms, 200 ms, 400 ms…) để vòng lặp sập không đốt CPU.</span></div>
  <div class="kv"><span class="k">Healthcheck (kiểm tra sức khoẻ)</span><span class="v">Lệnh Docker chạy định kỳ bên trong container để báo khoẻ/không khoẻ. Tự nó không bao giờ khởi động lại gì.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có <code>--memory</code> nghĩa là container được lấy cả cái máy; <code>docker stats</code> hiện tổng RAM máy chủ làm "trần".</li>
<li>Phép thử OOM thật phải giữ bộ nhớ và tắt swap: <code>--memory 128m --memory-swap 128m</code> + <code>dd bs=200M</code> → 137, <code>OOMKilled=true</code>.</li>
<li><code>--cpus</code> là hạn ngạch cứng; có môi trường chạy đọc nó (<code>availableParallelism</code>), có cái không (<code>os.cpus()</code>, <code>cpu_count</code> của Python).</li>
<li>Chính sách restart chỉ phản ứng với việc thoát, kèm lùi dần gấp đôi; <code>unless-stopped</code> là mặc định cho dịch vụ.</li>
<li>Healthcheck chỉ báo cáo; Docker trần không bao giờ khởi động lại container không khoẻ, kể cả khi có chính sách restart.</li>
<li>Đọc <code>RestartCount</code>, <code>OOMKilled</code> và <code>Health.Status</code> cùng nhau — chúng giải thích phần lớn sự cố "nó cứ chết hoài".</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/containers/resource_constraints/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Tuỳ chọn lúc chạy với bộ nhớ, CPU và GPU</span><span class="lc-sub">Mọi cờ giới hạn kèm ý nghĩa cgroup của nó, gồm cả phép tính swap dễ làm sai và lời cảnh báo về <code>--oom-kill-disable</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/containers/start-containers-automatically/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Chính sách khởi động lại</span><span class="lc-sub">Bốn giá trị, lịch lùi dần, và khác biệt chính xác giữa <code>always</code> với <code>unless-stopped</code> lúc tiến trình nền khởi động — phần đáng đọc hai lần.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/dockerfile/#healthcheck" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">HEALTHCHECK trong Dockerfile</span><span class="lc-sub">Dạng chỉ thị, bản hợp đồng về mã thoát (0 khoẻ, 1 không khoẻ), và ghi chú tường minh rằng chính Docker KHÔNG hành động gì khi không khoẻ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: giới hạn và khởi động lại</span><span class="lc-sub">Bài chấm điểm: chứng minh một trần bộ nhớ bằng <code>OOMKilled</code>, chọn chính sách khởi động lại đúng cho ba tình huống, thêm một healthcheck bắt được một tiến trình kẹt cứng, và giải thích vì sao container KHÔNG khởi động lại.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>--restart always</code> trên một container thoát ngay lập tức. Nếu câu lệnh sai — gõ nhầm trong entrypoint, thiếu một biến môi trường — thì container chết trong vài mili giây và Docker khởi chạy lại nó MÃI MÃI. Cơ chế lùi dần chặn chi phí CPU ở khoảng một lần thử mỗi phút, nhưng container thì không bao giờ chạy và cú hỏng thì im lặng trừ khi bạn nhìn vào. Tệ hơn, <code>always</code> còn khởi chạy lại nó SAU KHI bạn đã cố ý dừng, ở lần tiến trình nền khởi động kế tiếp, nên "tôi tắt cái đó hôm qua rồi" không phải một trạng thái ổn định. Hãy dùng <code>unless-stopped</code> cho dịch vụ, theo dõi <code>RestartCount</code>, và coi một container ở trạng thái <code>restarting</code> là một sự cố (Chương 12).</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Một container không có <code>--memory</code> có thể kéo sập cả máy chủ, và giới hạn còn nói cho môi trường chạy hiện đại biết cách tự định kích thước, nên đặt chúng là chuyện về tính đúng đắn chứ không chỉ về an toàn. <code>unless-stopped</code> là chính sách khởi động lại đúng cho dịch vụ vì nó tôn trọng một cú dừng có chủ ý, trong khi <code>always</code> đảo ngược nó ở lần tiến trình nền khởi động kế tiếp. Và healthcheck chỉ <em>BÁO CÁO</em> — Docker sẽ KHÔNG BAO GIỜ khởi động lại một container không khoẻ, nên phải có thứ khác (Compose <code>depends_on</code>, một bộ điều phối, script deploy của bạn) hành động theo nó.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Quiz: running containers|||2.6 — Kiểm tra: chạy container',
      slug: 'dk-2-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống thật: cờ đặt sai chỗ, -p và ufw, log trống, attach và Ctrl-C, -i trong script, --env-file giữ dấu nháy, OOMKilled, healthcheck với restart, IPAddress trên Docker 29, và file thuộc root.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations you will meet in a real project — each one taken from something we actually ran while writing this chapter. Read the explanation after every answer, right or wrong: the wrong options are the mistakes people really make.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read any <code>docker run</code> line and say which words belong to Docker and which to the container.</li>
<li>I know when to publish a port on <code>127.0.0.1</code> and how to prove who can reach it.</li>
<li>I can explain an empty <code>docker logs</code> in three different ways.</li>
<li>I know which of <code>exec</code>/<code>attach</code>, <code>-i</code>/<code>-t</code> to use from a terminal and from a script.</li>
<li>I can find the real value of an environment variable inside a container, and keep a secret out of <code>inspect</code>.</li>
<li>I can tell an OOM kill from a normal stop, and I know what a healthcheck will and will not do.</li>
</ul>
${slide('dk-02', 31, 'Bảng tra nhanh Chương 2')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống bạn sẽ gặp trong một dự án thật — mỗi cái lấy từ thứ chúng tôi đã thật sự chạy khi viết chương này. Hãy đọc phần giải thích sau mỗi câu, dù đúng hay sai: các phương án sai chính là những lỗi người ta thật sự mắc.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được bất kỳ dòng <code>docker run</code> nào và chỉ ra chữ nào thuộc về Docker, chữ nào thuộc về container.</li>
<li>Tôi biết khi nào publish cổng trên <code>127.0.0.1</code> và cách chứng minh ai với tới được nó.</li>
<li>Tôi giải thích được một <code>docker logs</code> trống theo ba cách khác nhau.</li>
<li>Tôi biết dùng <code>exec</code>/<code>attach</code>, <code>-i</code>/<code>-t</code> nào khi ngồi ở terminal và khi viết script.</li>
<li>Tôi tìm được giá trị THẬT của một biến môi trường bên trong container, và giữ được bí mật khỏi <code>inspect</code>.</li>
<li>Tôi phân biệt được một cú OOM với một lần dừng bình thường, và biết healthcheck làm gì và KHÔNG làm gì.</li>
</ul>
${slide('dk-02', 31, 'Bảng tra nhanh Chương 2')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate runs docker run -d nginx:1.27-alpine -p 8080:80. It prints an ID, but the container is Exited (2) and the log says "exec: line 47: illegal option -p". What happened?|||Bạn cùng nhóm chạy docker run -d nginx:1.27-alpine -p 8080:80. Nó in ra một ID, nhưng container Exited (2) và log ghi "exec: line 47: illegal option -p". Chuyện gì đã xảy ra?',
            options: [
              'Port 8080 is already used by another program on the host|||Cổng 8080 đã bị một chương trình khác trên máy chủ chiếm',
              'The nginx image needs --init before it accepts a -p flag|||Ảnh nginx cần --init thì mới nhận cờ -p',
              'Everything after the image name is the container’s command, so "-p 8080:80" was handed to the entrypoint instead of Docker|||Mọi thứ sau tên ảnh là câu lệnh của container, nên "-p 8080:80" được giao cho entrypoint chứ không phải cho Docker',
              '-d and -p cannot be used together; publish ports in the foreground|||-d và -p không dùng chung được; phải publish cổng khi chạy ở tiền cảnh',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Flags must come before the image. After it, "-p 8080:80" became the container command; the nginx entrypoint tried to exec "-p" and died, and no port was ever published. A port conflict would make docker run itself fail with "port is already allocated" before any container starts — not an entrypoint error.|||VI: Cờ phải đứng TRƯỚC tên ảnh. Đứng sau thì "-p 8080:80" thành câu lệnh của container; entrypoint của nginx cố exec "-p" rồi chết, và không cổng nào được publish. Nếu trùng cổng thì chính lệnh docker run sẽ hỏng với "port is already allocated" trước khi container nào chạy — không phải lỗi của entrypoint.',
          },
          {
            question: 'You start Postgres on the team VPS with -p 5432:5432. ufw is set to deny 5432. Can someone on the internet reach the database?|||Bạn chạy Postgres trên VPS của nhóm với -p 5432:5432. ufw được đặt chặn cổng 5432. Người ngoài internet có với tới được cơ sở dữ liệu không?',
            options: [
              'Yes — Docker writes its own port rules that are evaluated before ufw’s; publish with -p 127.0.0.1:5432:5432 instead|||Có — Docker tự ghi luật cổng và luật đó được xét TRƯỚC luật của ufw; hãy publish bằng -p 127.0.0.1:5432:5432',
              'No — ufw sits in front of every port on the machine, including Docker’s published ones|||Không — ufw đứng trước mọi cổng của máy, kể cả cổng Docker đã publish',
              'Only over IPv6, because Docker publishes IPv4 on loopback by default|||Chỉ qua IPv6, vì mặc định Docker publish IPv4 trên loopback',
              'Only if the container also runs with --network host|||Chỉ khi container còn chạy thêm với --network host',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: -p without an address listens on 0.0.0.0 (every interface) and Docker inserts its NAT rules ahead of ufw’s, so "ufw status" looks fine while the port is open. Binding to 127.0.0.1 is the fix. The "ufw protects everything" answer is exactly the belief that exposes databases; --network host would bypass port mapping altogether, it is not a requirement for exposure.|||VI: -p không kèm địa chỉ thì nghe trên 0.0.0.0 (mọi card mạng) và Docker chèn luật NAT của nó TRƯỚC luật của ufw, nên "ufw status" trông ổn trong khi cổng vẫn mở. Cách chữa là gắn vào 127.0.0.1. Phương án "ufw bảo vệ mọi thứ" chính là niềm tin làm lộ cơ sở dữ liệu; còn --network host là bỏ qua ánh xạ cổng hoàn toàn, không phải điều kiện để bị lộ.',
          },
          {
            question: 'A Python worker clearly works — rows keep appearing in the database — but docker logs worker shows nothing, even after a minute. Most likely cause?|||Một worker Python rõ ràng đang chạy — dòng mới liên tục xuất hiện trong cơ sở dữ liệu — nhưng docker logs worker chẳng hiện gì, kể cả sau một phút. Nguyên nhân khả dĩ nhất?',
            options: [
              'The json-file log driver has a size limit and already rotated the output away|||Trình ghi log json-file có giới hạn dung lượng và đã xoay vòng mất output',
              'docker logs shows only the last 0 lines by default; add --tail all|||docker logs mặc định chỉ hiện 0 dòng cuối; phải thêm --tail all',
              'The container needs -t so that docker logs can read its output|||Container cần -t thì docker logs mới đọc được output của nó',
              'Python buffers stdout when it is not a terminal; set PYTHONUNBUFFERED=1 (or log to stdout from the start)|||Python đệm stdout khi nó không phải terminal; hãy đặt PYTHONUNBUFFERED=1 (hoặc ghi log ra stdout ngay từ đầu)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Measured in Lesson 2.2: the same print loop gave 0 lines without PYTHONUNBUFFERED and 5 lines with it after four seconds. json-file has NO size limit unless you configure one, docker logs shows everything by default, and -t would "fix" it only by accident while adding carriage returns to every line.|||VI: Đã đo ở Bài 2.2: cùng vòng lặp print cho 0 dòng khi thiếu PYTHONUNBUFFERED và 5 dòng khi có, sau bốn giây. json-file KHÔNG có giới hạn dung lượng trừ khi bạn cấu hình, docker logs mặc định hiện hết, còn -t chỉ "chữa" được một cách tình cờ và còn chèn ký tự xuống dòng \\r vào mọi dòng.',
          },
          {
            question: 'You run docker attach api to watch its output, then press Ctrl-C to leave. The API goes down. Why, and what should you have used?|||Bạn chạy docker attach api để xem output, rồi bấm Ctrl-C để rời đi. API sập. Vì sao, và lẽ ra bạn nên dùng gì?',
            options: [
              'Ctrl-C always stops a container, whichever command you are running; nothing else would have helped|||Ctrl-C luôn dừng container, dù bạn đang chạy lệnh nào; không lệnh nào khác giúp được',
              'attach connects your terminal to PID 1, so Ctrl-C sent SIGINT to the application; watch with docker logs -f instead|||attach nối terminal của bạn vào PID 1, nên Ctrl-C gửi SIGINT tới ứng dụng; lẽ ra nên xem bằng docker logs -f',
              'attach starts a second copy of the API that fights the first one for the port|||attach khởi chạy một bản thứ hai của API và nó tranh cổng với bản đầu',
              'The container lacked --init; with tini as PID 1 the signal would have been ignored|||Container thiếu --init; có tini làm PID 1 thì tín hiệu đã bị bỏ qua',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: docker attach forwards signals to PID 1 (sig-proxy). Measured in Lesson 2.3: SIGINT made nginx log "signal 2 (SIGINT) received, exiting" and the container Exited (0). docker logs -f only reads the log, so Ctrl-C there stops watching, not the app. --init would forward the signal, not swallow it.|||VI: docker attach chuyển tiếp tín hiệu tới PID 1 (sig-proxy). Đã đo ở Bài 2.3: SIGINT khiến nginx ghi "signal 2 (SIGINT) received, exiting" và container Exited (0). docker logs -f chỉ đọc log, nên Ctrl-C ở đó chỉ dừng việc xem, không dừng app. --init sẽ CHUYỂN TIẾP tín hiệu chứ không nuốt nó.',
          },
          {
            question: 'A CI step runs: cat data.json | docker run --rm ghcr.io/jqlang/jq .length — it prints nothing and exits 0, so the pipeline stays green. What is wrong?|||Một bước CI chạy: cat data.json | docker run --rm ghcr.io/jqlang/jq .length — nó không in gì và thoát 0, nên pipeline vẫn xanh. Sai ở đâu?',
            options: [
              'It needs -it so that jq can read the piped data|||Cần -it để jq đọc được dữ liệu đổ vào',
              'jq is the entrypoint, so .length must be passed with --entrypoint|||jq là entrypoint nên .length phải truyền qua --entrypoint',
              'Without -i the container’s stdin is closed, so jq silently saw empty input; add -i (and no -t in CI)|||Không có -i thì stdin của container bị đóng, nên jq âm thầm thấy đầu vào rỗng; thêm -i (và không -t trong CI)',
              'Files must be bind-mounted; containers can never read a pipe|||File phải được bind mount; container không bao giờ đọc được ống dẫn',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Measured: without -i jq printed nothing and exited 0 — a silent failure. -it looks right but in CI there is no terminal, and Docker 29 refuses with "cannot attach stdin to a TTY-enabled container because stdin is not a terminal"; even where it runs, -t adds \\r to the output. Pipes work fine once stdin is attached with -i.|||VI: Đã đo: không có -i thì jq không in gì và thoát 0 — hỏng câm. -it trông có vẻ đúng nhưng CI không có terminal, và Docker 29 từ chối với "cannot attach stdin to a TTY-enabled container because stdin is not a terminal"; kể cả ở chỗ chạy được, -t còn chèn \\r vào output. Ống dẫn chạy tốt ngay khi stdin được nối bằng -i.',
          },
          {
            question: 'db.env contains POSTGRES_PASSWORD="swp391". The backend, using swp391, gets "password authentication failed". Inside the container, the length of $POSTGRES_PASSWORD is 8. Why?|||db.env chứa POSTGRES_PASSWORD="swp391". Backend dùng swp391 thì nhận "password authentication failed". Bên trong container, độ dài của $POSTGRES_PASSWORD là 8. Vì sao?',
            options: [
              'docker run --env-file keeps the quotes as part of the value, so the real password is "swp391" with quotes (8 characters)|||docker run --env-file giữ dấu nháy như một phần của giá trị, nên mật khẩu thật là "swp391" kèm nháy (8 ký tự)',
              'Postgres adds two characters of salt to every password stored from the environment|||Postgres tự thêm hai ký tự muối vào mọi mật khẩu lấy từ biến môi trường',
              'The shell in the container counts bytes, and the file was saved with Windows line endings|||Shell trong container đếm byte, và file được lưu với ký tự xuống dòng kiểu Windows',
              '-e must be used for passwords; --env-file values are always ignored by the postgres image|||Mật khẩu phải truyền bằng -e; ảnh postgres luôn bỏ qua giá trị từ --env-file',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: --env-file is read literally: no quote stripping, no expansion, trailing spaces kept. 6 letters + 2 quotes = 8. CRLF endings would add one character (\\r), giving 7, not 8; and --env-file values are not ignored — they arrived, just with quotes. Fix: write the value bare, or better, use POSTGRES_PASSWORD_FILE.|||VI: --env-file được đọc nguyên văn: không bóc dấu nháy, không khai triển, giữ dấu cách cuối. 6 chữ + 2 dấu nháy = 8. Xuống dòng kiểu CRLF chỉ thêm một ký tự (\\r), ra 7 chứ không phải 8; và giá trị từ --env-file không hề bị bỏ qua — nó tới nơi, chỉ là kèm dấu nháy. Cách sửa: viết giá trị trần, hoặc tốt hơn là dùng POSTGRES_PASSWORD_FILE.',
          },
          {
            question: 'docker ps -a shows your API as Exited (137). Nobody ran docker stop or docker kill. Which single field tells you whether the memory limit did it?|||docker ps -a cho thấy API của bạn Exited (137). Không ai chạy docker stop hay docker kill. Trường DUY NHẤT nào cho biết có phải trần bộ nhớ gây ra không?',
            options: [
              '.State.ExitCode — 137 on its own already means out-of-memory|||.State.ExitCode — riêng 137 đã có nghĩa là hết bộ nhớ',
              '.RestartCount — a count above zero means the kernel killed it|||.RestartCount — con số lớn hơn 0 nghĩa là nhân đã giết nó',
              '.HostConfig.Memory — if it is set, the limit must have been hit|||.HostConfig.Memory — nếu có đặt thì hẳn là đã chạm trần',
              '.State.OOMKilled — 137 only means SIGKILL, and this boolean says whether the kernel’s OOM killer sent it|||.State.OOMKilled — 137 chỉ nghĩa là SIGKILL, còn boolean này nói có phải kẻ giết OOM của nhân gửi nó hay không',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: 137 = 128 + 9 (SIGKILL), which docker kill, a timed-out docker stop and the OOM killer all produce. OOMKilled=true settles it; in Lesson 2.2 the crash loop read "exited exit=137 oom=true restarts=4". RestartCount only counts restarts, and a configured limit says nothing about whether it was reached.|||VI: 137 = 128 + 9 (SIGKILL), mà docker kill, một docker stop quá hạn và kẻ giết OOM đều tạo ra được. OOMKilled=true mới phân xử; ở Bài 2.2 vòng lặp sập đọc được "exited exit=137 oom=true restarts=4". RestartCount chỉ đếm số lần khởi động lại, còn một cái trần đã đặt thì chẳng nói gì về việc có chạm tới nó hay không.',
          },
          {
            question: 'Your web container has --restart unless-stopped and a healthcheck. docker ps now shows "(unhealthy)". What will plain Docker do?|||Container web của bạn có --restart unless-stopped và một healthcheck. docker ps giờ hiện "(unhealthy)". Docker trần sẽ làm gì?',
            options: [
              'Restart it after the configured number of retries, because the restart policy watches health|||Khởi động lại nó sau số lần thử đã cấu hình, vì chính sách restart theo dõi sức khoẻ',
              'Nothing — it keeps running with RestartCount=0; restart policies react only to the process exiting|||Không gì cả — nó vẫn chạy với RestartCount=0; chính sách restart chỉ phản ứng khi tiến trình thoát',
              'Stop it and wait for you to run docker start manually|||Dừng nó và chờ bạn tự chạy docker start',
              'Remove its published ports so no traffic reaches it|||Gỡ các cổng đã publish để không lưu lượng nào tới được nó',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Measured in Lesson 2.5 with exactly this setup: "unhealthy restarts=0 policy=unless-stopped". Health is only reported; Compose depends_on: service_healthy, an orchestrator or your deploy script must act on it. Believing the restart policy covers health is the misconception that turns a wedged API into a long outage.|||VI: Đã đo ở Bài 2.5 với đúng cấu hình này: "unhealthy restarts=0 policy=unless-stopped". Sức khoẻ chỉ được BÁO CÁO; phải có Compose depends_on: service_healthy, một bộ điều phối hay script deploy của bạn hành động theo nó. Tin rằng chính sách restart lo luôn phần sức khoẻ là hiểu lầm biến một API kẹt cứng thành một sự cố kéo dài.',
          },
          {
            question: 'A script copied from a 2021 blog runs docker inspect web --format "{{.NetworkSettings.IPAddress}}". On Docker 29 it fails with "map has no entry for key IPAddress". What is the right fix?|||Một script chép từ blog năm 2021 chạy docker inspect web --format "{{.NetworkSettings.IPAddress}}". Trên Docker 29 nó hỏng với "map has no entry for key IPAddress". Sửa đúng là gì?',
            options: [
              'Read the address per network: range over .NetworkSettings.Networks and print each .IPAddress|||Đọc địa chỉ theo từng mạng: range qua .NetworkSettings.Networks và in .IPAddress của từng cái',
              'Start the container with --network host so that it gets a top-level IPAddress again|||Chạy container với --network host để nó có lại trường IPAddress ở cấp trên cùng',
              'Replace --format with jq; the Go template engine was removed in Docker 29|||Thay --format bằng jq; bộ khuôn Go đã bị gỡ khỏi Docker 29',
              'Run docker port web; it prints the container’s internal IP address|||Chạy docker port web; nó in ra địa chỉ IP bên trong của container',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: A container can be on several networks, so the address lives under .NetworkSettings.Networks.<name>.IPAddress; the range form printed "bridge 172.17.0.5" on the course Mac. Go templates still work (the failure is a template error about a missing key), --network host gives the container no own IP at all, and docker port shows published host ports, not the container IP.|||VI: Một container có thể nằm trên nhiều mạng, nên địa chỉ nằm ở .NetworkSettings.Networks.<tên>.IPAddress; dạng range in ra "bridge 172.17.0.5" trên máy Mac của khoá. Khuôn Go vẫn chạy (lỗi chính là lỗi của khuôn báo thiếu khoá), --network host khiến container chẳng có IP riêng nào, còn docker port hiện cổng đã publish ra máy chủ chứ không phải IP của container.',
          },
          {
            question: 'On the Linux VPS, a build container wrote build/ into your project through a bind mount. Now rm -rf build fails with "Permission denied". On your Mac the same command never had this problem. Why?|||Trên VPS Linux, một container build ghi thư mục build/ vào dự án của bạn qua bind mount. Giờ rm -rf build hỏng với "Permission denied". Trên Mac cùng câu lệnh đó chưa từng gặp chuyện này. Vì sao?',
            options: [
              'The bind mount was read-only, so the files were created with read-only permissions|||Bind mount ở chế độ chỉ đọc nên file được tạo với quyền chỉ đọc',
              'The container is still running and holds a lock on the directory|||Container vẫn đang chạy và giữ khoá trên thư mục đó',
              'The container ran as root and there is no user-namespace remapping, so the files belong to root on the host; Docker Desktop on Mac maps ownership to you|||Container chạy dưới root và không có ánh xạ user namespace, nên file thuộc root trên máy chủ; Docker Desktop trên Mac thì đổi chủ sở hữu thành bạn',
              'Linux requires sudo to delete any file created by Docker, whoever created it|||Linux đòi sudo để xoá mọi file do Docker tạo ra, bất kể ai tạo',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: UID 0 inside is UID 0 outside (Lesson 1.1). Measured in Lesson 2.4: on Linux build/ was owned by root and its contents could not be removed, while on the Mac the same file showed as your user. A read-only mount would have prevented the files from being written at all. Prevent it with -u "$(id -u):$(id -g)" or USER in the image; clean up by running rm inside a container.|||VI: UID 0 bên trong là UID 0 bên ngoài (Bài 1.1). Đã đo ở Bài 2.4: trên Linux build/ thuộc root và không xoá được nội dung bên trong, còn trên Mac cùng file đó hiện là người dùng của bạn. Nếu mount chỉ đọc thì file đã chẳng ghi được ngay từ đầu. Phòng bằng -u "$(id -u):$(id -g)" hoặc USER trong ảnh; dọn bằng cách chạy rm bên trong một container.',
          },
        ],
      },
    },
  ],
};
