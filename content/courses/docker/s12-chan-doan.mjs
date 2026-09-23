/**
 * Docker — Chương 12: chẩn đoán container (sách công thức + kết khoá).
 * Phương pháp · không khởi động được · khởi động rồi chết · dựng hỏng & chỉ hỏng trên CI · kết khoá · quiz cuối.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 12.0 slide (deck dk-12, 32 slide: cây quyết định cho từng ca hỏng + output thật) +
 * slide/🧪/🗂/📌 + phần "Chạy thử từng bước" trong 12.1–12.5; quiz 12.6 thành "Kiểm tra Chương 12" (10 câu).
 * Output MỚI chạy thật 24/09/2026 trên Docker Desktop / Engine 29.8 (Mac M1, arm64, Compose v5.5.1) và
 * Docker Engine 29.6 (Linux amd64). Mọi \${VAR} của shell/compose trong nội dung viết là &#36;{VAR}.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 12 — Diagnosing containers|||Chương 12 — Chẩn đoán container',
  description: 'Một phương pháp và một sách công thức cho lúc mọi thứ hỏng: container không khởi động, container khởi động rồi chết, bản dựng chỉ hỏng trên CI — mỗi ca một cây quyết định và output thật. Kèm phần tổng kết những gì bạn đã biết và bài kiểm tra của chương.',
  lessons: [
    /* ─────────────────────────── 12.0 ─────────────────────────── */
    {
      title: '12.0 — Chapter 12 slides: the diagnosis cookbook in pictures|||12.0 — Slide Chương 12: sách công thức chẩn đoán bằng hình',
      slug: 'dk-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 12: bốn tầng có thể hỏng, bảng mã thoát đo thật, một cây quyết định cho mỗi ca (không lên, lên rồi chết, build hỏng), output thật của từng lỗi, và bản đồ toàn khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Slides</span>
<h2>The whole cookbook in 32 slides</h2>
<p class="lead">This chapter is the one you come back to when something is broken, so the slides are built to be used at that moment: every failure case has a decision tree — symptom → the one command that asks the right question → which branch you are on — and next to it the real output of that failure, produced on purpose on the course's machines.</p>
<p>Slides 3–7 belong to Lesson 12.1 (the four layers, the first three commands, the exit-code table measured for real, the STATUS fork, looking inside without a shell), 8–13 to 12.2 (it will not start), 14–19 to 12.3 (it starts, then dies), 20–26 to 12.4 (the build fails, or only fails in CI) and 27–29 to 12.5 (the map of the whole course, twelve rules, real incidents). The last three are the chapter's common mistakes, a cheat sheet, and a 45-minute practice session in which you break things deliberately and diagnose them. Every terminal is real output recorded in September 2026 on Docker Desktop / Engine 29.8 (Mac M1) and Docker Engine 29.6 (Linux amd64); names start with <code>dk12-</code> because that is how the course labels what it creates. The slides are in Vietnamese; the trees and terminals read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Slide</span>
<h2>Cả cuốn sách công thức trong 32 slide</h2>
<p class="lead">Đây là chương bạn quay lại mỗi khi có gì đó hỏng, nên bộ slide được làm để dùng ĐÚNG lúc đó: mỗi ca hỏng có một cây quyết định — triệu chứng → đúng một lệnh hỏi đúng câu → bạn đang ở nhánh nào — và ngay cạnh là output THẬT của chính cái lỗi đó, do khoá học cố tình gây ra trên máy thật.</p>
<p>Slide 3–7 thuộc Bài 12.1 (bốn tầng, ba lệnh đầu tiên, bảng mã thoát đo thật, ngã ba STATUS, soi bên trong khi không có shell), 8–13 thuộc 12.2 (không khởi động được), 14–19 thuộc 12.3 (khởi động rồi chết), 20–26 thuộc 12.4 (build hỏng, hoặc chỉ hỏng trên CI) và 27–29 thuộc 12.5 (bản đồ toàn khoá, mười hai luật, sự cố thật). Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 45 phút: tự làm hỏng rồi tự chẩn đoán. Mọi terminal là output THẬT ghi tháng 9/2026 trên Docker Desktop / Engine 29.8 (Mac M1) và Docker Engine 29.6 (Linux amd64); tên bắt đầu bằng <code>dk12-</code> vì khoá học đánh dấu mọi thứ nó tạo ra như vậy — máy bạn đặt tên gì cũng được, quy luật thì không đổi.</p>
</div>
${gallery('dk-12', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Bốn tầng có thể hỏng'], [4, 'Ba lệnh đầu tiên'], [5, 'Bảng mã thoát đo thật'], [6, 'Cột STATUS là ngã ba đầu tiên'], [7, 'Soi bên trong khi không có shell'],
  [8, 'Cây quyết định: không khởi động được'], [9, '127 khác 126'], [10, 'Shebang CRLF: no such file'], [11, 'exec format error: sai kiến trúc'], [12, 'Cổng bận: hai câu báo lỗi'], [13, 'Hai kiểu hỏng im lặng: -v và biến env'],
  [14, 'Cây quyết định: lên rồi chết'], [15, 'Vòng lặp restart và thời gian chờ gấp đôi'], [16, 'Exit 0 ngay: tự chạy nền'], [17, '137/143/130/139 và OOMKilled'], [18, 'unhealthy vì bộ kiểm hỏng'], [19, 'compose run --entrypoint sh'],
  [20, 'Cây quyết định: build hỏng'], [21, 'Đọc lỗi BuildKit'], [22, 'COPY not found và ngữ cảnh'], [23, 'Hoa-thường: Mac qua, CI hỏng'], [24, 'Cache khoá theo chuỗi lệnh'], [25, 'Ngữ cảnh và .dockerignore'], [26, 'Build xanh, ảnh chết: musl và glibc'],
  [27, 'Bản đồ toàn khoá'], [28, 'Mười hai luật'], [29, 'Sự cố thật và phép kiểm'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 12'],
])}
`,
    },
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — A method, before the cookbook|||12.1 — Một phương pháp, trước khi tới sách công thức',
      slug: 'dk-12-1-phuong-phap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn tầng có thể hỏng và cách nhận ra tầng nào, ba câu lệnh chạy trước mọi thứ khác, đọc mã thoát, và luật đổi-một-thứ-một-lần khi mọi thứ đang cháy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>A method, before the cookbook</h2>
<p class="lead">Container problems feel like they could be anywhere, and that feeling is the actual difficulty — not the individual fixes, which are usually small. This lesson gives you a way to cut the search space in half twice before you touch anything, so the cookbook that follows is a lookup rather than a hunt.</p>

<h3>Four layers, and which one is broken</h3>
${slide('dk-12', 3, 'Bốn tầng có thể hỏng — gọi tên tầng trước khi sửa')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · The image</span><span class="lz-lnote">Does it exist, can it be pulled, is it the right architecture, does it contain what you think? Symptoms: <code>not found</code>, <code>exec format error</code>, a file that is missing inside the container.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · The container's configuration</span><span class="lz-lnote">Command, environment, mounts, user, ports. Symptoms: <code>executable file not found</code>, permission denied, an empty directory where your code should be, a variable that is unset.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · The process inside</span><span class="lz-lnote">Your application, its dependencies, its own bugs. Symptoms: a stack trace, a non-zero exit with a message, a crash loop that logs the same error every time.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · The environment around it</span><span class="lz-lnote">Networks, other containers, host resources, disk. Symptoms: timeouts, <code>ECONNREFUSED</code>, exit 137, <code>no space left on device</code>, everything slow at once.</span></div>
</div>
<div class="callout ok"><strong>Each layer has a distinct signature, and the exit code usually names it.</strong> A container that never runs a single line of your code is layer 1 or 2. One that logs your application's own error is layer 3. One that was killed, or cannot reach something, is layer 4. Identify the layer first and you have eliminated three quarters of the possibilities without running a diagnostic.</div>

<h3>The three commands to run first</h3>
${slide('dk-12', 4, 'Ba lệnh đầu tiên trả lời “tầng nào” — output thật')}
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}' | head -6
docker inspect -f '{{ .State.ExitCode }} oom={{ .State.OOMKilled }} restarts={{ .RestartCount }}' blog-api-1
docker logs --tail 30 blog-api-1</code></pre>
<div class="out">NAMES        STATUS                        IMAGE
blog-api-1   Restarting (1) 2 seconds ago   ghcr.io/me/api:9f2ac1e
blog-db-1    Up 12 minutes (healthy)        postgres:16.4-alpine
1 oom=false restarts=9
blog-api-1  | Error: P1001: Can't reach database server at &#96;db&#96;:&#96;5432&#96;</div>
<p>Status, exit code, logs. Those three tell you the layer in about five seconds: the container is looping, the exit code is 1 (an application error, not a kill), and the log names a dependency it cannot reach. That is layer 3 reporting a layer 4 problem — the API is fine, the network or the database is not — and Lesson 8.5's four questions take it from there.</p>

<h3>Read STATUS before you read logs: the first fork</h3>
${slide('dk-12', 6, 'Cột STATUS là ngã ba đầu tiên của mọi ca hỏng')}
<p>The three commands above work because of the order they come in. The <code>STATUS</code> column of <code>docker ps -a</code> already tells you whether your code ever ran — before you have read a single log line. Here are six containers the course broke on purpose, one per kind of failure:</p>
<pre><code class="language-bash">docker ps -a --filter label=dkhoc=12 --format 'table {{.Names}}\\t{{.Status}}'
docker logs dk12-typo 2&gt;&amp;1 | wc -l</code></pre>
<div class="out">NAMES        STATUS
dk12-oom     Exited (137) 1 second ago
dk12-crash   Exited (1) 1 second ago
dk12-typo    Created
dk12-goapi   Up About a minute
dk12-hc      Up 10 minutes (unhealthy)
dk12-loop    Restarting (1) 59 seconds ago
…
       0</div>
<p>Real output from the course's Mac (Docker 29.8). <code>--filter label=dkhoc=12</code> keeps only the containers the course created — a filter you will want on any machine that runs other people's containers too. <code>dk12-typo</code> was started with a misspelled command (<code>nodee</code>), and its log has exactly zero lines: the process never existed, so there is nothing to read.</p>
<table>
<tr><th>STATUS says</th><th>What it means</th><th>Layer</th><th>First question to ask</th></tr>
<tr><td><code>Created</code></td><td>Docker created the container but could not start the process</td><td>1–2</td><td>the stderr of the <code>docker run</code> you typed, or <code>docker inspect -f '{{.State.Error}}' c</code> → Lesson 12.2</td></tr>
<tr><td><code>Exited (0)</code> seconds after start</td><td>PID 1 finished "successfully" — a daemon that forked away, or a one-shot job</td><td>2–3</td><td><code>docker inspect -f '{{.Config.Entrypoint}} {{.Config.Cmd}}' c</code> → Lesson 12.3</td></tr>
<tr><td><code>Exited (1)</code>, <code>(2)</code>…</td><td>your program chose to exit with an error</td><td>3</td><td><code>docker logs --timestamps c</code> — the answer is usually the first error line</td></tr>
<tr><td><code>Exited (137)</code></td><td>killed with SIGKILL</td><td>4 (or a person)</td><td><code>docker inspect -f '{{.State.OOMKilled}}' c</code></td></tr>
<tr><td><code>Exited (255)</code></td><td>the process was created but <code>exec</code> failed inside the container</td><td>1</td><td><code>docker logs c</code> — the one line there is the error</td></tr>
<tr><td><code>Restarting (n)</code></td><td>a restart policy keeps bringing back something that keeps dying</td><td>3–4</td><td>the <em>first</em> failure: <code>docker logs -t c | head</code></td></tr>
<tr><td><code>Up … (unhealthy)</code></td><td>the process runs; its healthcheck fails</td><td>3 — or the check itself</td><td><code>docker inspect -f '{{json .State.Health}}' c</code></td></tr>
</table>
<div class="callout ok"><strong>Created versus Exited is the most useful single fact in this chapter.</strong> A container stuck in <code>Created</code> means runc refused to start your process at all — a missing binary (127), a non-executable file (126). Nothing of yours ran, so <code>docker logs</code> is empty by design and the message lives on the stderr of the command you typed. The error is also stored: <code>docker inspect -f '{{.State.Error}}' dk12-typo</code> prints it again later, which saves you when the failure happened in a script whose output you did not keep.</div>

<h3>Exit codes worth memorising</h3>
${slide('dk-12', 5, 'Bảng mã thoát: mỗi mã được gây ra thật trên máy khoá học')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>0</code></span><span class="v">Clean exit. On a service, that is still a bug — servers should not finish. Check whether the command was a one-shot when you meant a daemon.</span></div>
  <div class="kv"><span class="k"><code>1</code> (or any small number)</span><span class="v">Your application exited with an error. Layer 3 — read the log; the answer is almost always in it.</span></div>
  <div class="kv"><span class="k"><code>125</code></span><span class="v"><strong>Docker itself</strong> failed before the container started: a bad flag, a conflicting name, an invalid mount. The error text is on stderr, not in the logs.</span></div>
  <div class="kv"><span class="k"><code>126</code></span><span class="v">The command was found but is <strong>not executable</strong> — missing <code>+x</code>, or a directory where a binary was expected. (A script with CRLF line endings fails differently — as <code>no such file or directory</code> with exit 255; see the table below.)</span></div>
  <div class="kv"><span class="k"><code>127</code></span><span class="v"><strong>Command not found</strong> inside the container. A typo, a binary that is not in that image, or a shell that does not exist (distroless has no <code>sh</code>).</span></div>
  <div class="kv"><span class="k"><code>137</code> / <code>143</code></span><span class="v">SIGKILL (128+9) and SIGTERM (128+15). 137 is usually OOM — confirm with <code>OOMKilled</code>. 143 is a normal stop, and on a crash loop it means something stopped it deliberately.</span></div>
</div>
<pre><code>docker run --rm alpine:3.20 nosuchcommand; echo "127? → $?"
docker run --rm --badflag alpine:3.20 true 2&gt;&amp;1 | tail -1; echo "125? → &#36;{PIPESTATUS[0]}"
docker run --rm -v "$PWD/notexec.sh:/s.sh" alpine:3.20 /s.sh; echo "126? → $?"</code></pre>
<div class="out">docker: Error response from daemon: failed to create task: exec: "nosuchcommand": executable file not found in $PATH
127? → 127
unknown flag: --badflag
125? → 125
docker: Error response from daemon: failed to create task: exec: "/s.sh": permission denied
126? → 126</div>

<h3>Run it step by step: make every exit code yourself</h3>
<p>Memorising a table is weak; having caused each code yourself is strong. Every command below was run on the course's Mac (Docker Desktop 4.91 / Engine 29.8, arm64). Run them in <code>~/thu-docker</code>; they take about two minutes and clean up after themselves at the end.</p>
<pre><code class="language-bash"><span class="tok-comment"># 0 and 1 — the program decides</span>
docker run --name t-0 alpine:3.20 true;  echo "exit=$?"
docker run --name t-1 alpine:3.20 false; echo "exit=$?"
<span class="tok-comment"># 125 — Docker itself refuses (bad flag); 127 / 126 — runc refuses at create time</span>
docker run --rm --badflag alpine:3.20 true; echo "exit=$?"
docker run --name t-127 alpine:3.20 nosuchcommand; echo "exit=$?"
docker run --name t-126 alpine:3.20 /etc/hosts;    echo "exit=$?"
<span class="tok-comment"># signals: 128 + signal number</span>
docker run -d --name t-130 --init alpine:3.20 sleep 600 &amp;&amp; sleep 1 &amp;&amp; docker kill -s INT t-130
docker run --name t-137 --memory 128m --memory-swap 128m alpine:3.20 dd if=/dev/zero of=/dev/null bs=200M count=1
docker run -d --name t-kill alpine:3.20 sleep 600 &amp;&amp; docker kill t-kill
docker run -d --name t-143 --init alpine:3.20 sleep 600 &amp;&amp; docker stop t-143
docker run --name t-139 python:3.12-alpine python -c 'import ctypes; ctypes.string_at(0)'
<span class="tok-comment"># read them all back</span>
for c in t-0 t-1 t-127 t-126 t-130 t-137 t-kill t-143 t-139; do
  docker inspect -f "{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}" $c
done</code></pre>
<div class="out">exit=0
exit=1
unknown flag: --badflag
…
exit=125
docker: Error response from daemon: failed to create task for container: … exec: "nosuchcommand": executable file not found in $PATH
exit=127
docker: Error response from daemon: … exec: "/etc/hosts": permission denied
exit=126
…
/t-0 exited exit=0 oom=false
/t-1 exited exit=1 oom=false
/t-127 created exit=127 oom=false
/t-126 created exit=126 oom=false
/t-130 exited exit=130 oom=false
/t-137 exited exit=137 oom=true
/t-kill exited exit=137 oom=false
/t-143 exited exit=143 oom=false
/t-139 exited exit=139 oom=false</div>
<p>The output above is the course machine's (container names shortened from its <code>dk12-</code> prefix). Four things are worth noticing in it:</p>
<ul>
<li><strong>127 and 126 stay <code>created</code>.</strong> They are the only two that never became a running process.</li>
<li><strong>Two 137s, two different stories.</strong> <code>t-137</code> hit its memory limit (<code>oom=true</code>); <code>t-kill</code> was killed by a person (<code>oom=false</code>). <code>docker ps</code> shows <code>Exited (137)</code> for both — only <code>OOMKilled</code> tells them apart.</li>
<li><strong>130 needed <code>--init</code>.</strong> Without it, <code>sleep</code> is PID 1 and the kernel drops a SIGINT it has no handler for: the same experiment without <code>--init</code> left the container <code>running</code> (Chapter 1).</li>
<li><strong>139 is a real segmentation fault</strong> — Python read memory address 0 on purpose. In real life it comes from a native library (an image processing module, a database driver) built for the wrong libc or architecture.</li>
</ul>
<table>
<tr><th>Code</th><th>How to read it</th><th>Next command</th></tr>
<tr><td><code>130</code></td><td>128 + 2 = SIGINT, i.e. Ctrl-C (or <code>kill -s INT</code>)</td><td>who pressed Ctrl-C in a <code>docker run -it</code>?</td></tr>
<tr><td><code>139</code></td><td>128 + 11 = SIGSEGV: the program touched memory it may not</td><td>native modules, <code>--platform</code>, musl vs glibc base image</td></tr>
<tr><td><code>255</code></td><td>created fine, but <code>exec</code> failed inside the container: wrong architecture (<code>exec format error</code>), a CRLF shebang or a missing glibc loader (<code>no such file or directory</code>)</td><td><code>docker logs c</code> — the one line in it is the error (Lesson 12.2)</td></tr>
</table>
<div class="callout warn"><strong>Mac and Linux disagree on one of these, so read the words, not only the number.</strong> Bind-mounting a script that has no <code>+x</code> (<code>-v "$PWD/notexec.sh:/s.sh"</code>, the last example in the section above) gives exit <strong>126</strong> and a <code>Created</code> container on the course's Linux machine (Docker 29.6) — but on the Mac, through Docker Desktop's file sharing, the same command printed <code>exec /s.sh: permission denied</code> and exited <strong>255</strong> with the container <code>Exited</code>. The words "permission denied" were identical; the number was not.</div>
<table>
<tr><th>Template field</th><th>What it holds</th></tr>
<tr><td><code>.State.Status</code></td><td><code>created</code>, <code>running</code>, <code>restarting</code>, <code>exited</code>, <code>paused</code>, <code>dead</code></td></tr>
<tr><td><code>.State.ExitCode</code></td><td>the last exit code (0 while running)</td></tr>
<tr><td><code>.State.OOMKilled</code></td><td><code>true</code> only when the kernel's OOM killer ended it</td></tr>
<tr><td><code>.State.Error</code></td><td>the error Docker hit while <em>starting</em> it — filled for <code>Created</code> containers</td></tr>
<tr><td><code>.RestartCount</code></td><td>how many times a restart policy has brought it back</td></tr>
<tr><td><code>.State.StartedAt</code> / <code>.State.FinishedAt</code></td><td>UTC timestamps of the last start and stop — compare them to see how long it lived</td></tr>
<tr><td><code>.State.Health</code></td><td>healthcheck status, failing streak and the last five check outputs</td></tr>
</table>
<p>Clean up everything from this exercise in one line: <code>docker rm -f t-0 t-1 t-127 t-126 t-130 t-137 t-kill t-143 t-139</code>.</p>

<h3>Look inside, even when there is no shell</h3>
${slide('dk-12', 7, 'Không có shell vẫn soi được: cp, create, mượn namespace')}
<pre><code><span class="tok-comment"># Is the file even in the image? (no container needed)</span>
docker run --rm --entrypoint sh ghcr.io/me/api:9f2ac1e -c 'ls -l dist/ | head -3'

<span class="tok-comment"># Distroless or scratch — no shell at all. Copy it out instead.</span>
cid=$(docker create ghcr.io/me/api:9f2ac1e)
docker cp "$cid:/app/dist/index.js" - | tar -t | head -2
docker rm "$cid" &gt;/dev/null

<span class="tok-comment"># Or borrow a shell from another image, sharing the namespaces</span>
docker run --rm -it --pid container:blog-api-1 --network container:blog-api-1 \\
  nicolaka/netshoot sh -c 'ps -o pid,comm; ss -lntp'</code></pre>
<div class="out">-rw-r--r--    1 root     root         84213 Aug 22 11:02 index.js
app/dist/index.js
  PID COMMAND
    1 tini
    7 node
LISTEN 0 511 0.0.0.0:3000 0.0.0.0:*</div>
<div class="callout"><strong><code>docker create</code> without <code>start</code> is underrated.</strong> It gives you a container filesystem you can <code>cp</code> from without ever running the entrypoint — which is exactly what you want when the entrypoint is the thing that is broken, or when the image has no shell to exec into. Pair it with <code>--entrypoint sh</code> for images that do have one, and you can inspect almost anything.</div>

<h3>The rule when everything is on fire</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Write down what changed</span><span class="lz-t">a deploy, an env var, a base image, a dependency</span><span class="lz-d">Containers are reproducible, so something changed. If nothing on your side changed, a mutable tag moved, or the host filled up. Both are findable.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Change one thing at a time</span><span class="lz-t">and check after each one</span><span class="lz-d">Under pressure the temptation is to change five things and restart. Then it works, you do not know why, and it happens again next month with no more information than before.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Get service back first, understand second</span><span class="lz-t">rollback is a legitimate first move</span><span class="lz-d">Re-deploying the previous tag (Lesson 11.4) buys you time to diagnose without an audience. It is not giving up; it is separating the emergency from the investigation.</span></div>
  <div class="lz-step"><span class="lz-k">4 · The finding is a new check</span><span class="lz-t">not just a restored service</span><span class="lz-d">Every incident in this course's own history ended in one: a smoke test on 404, a libc-versus-engine assertion before push, a typecheck for the seed script. That is what stops the second occurrence.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the night before your SWP391 demo, a teammate messages "the stack is broken, nothing works" and pastes nothing else. You will reproduce three broken containers of different kinds and name the layer of each <em>before</em> fixing anything — the habit this lesson is about.</p><ol>
<li>In <code>~/thu-docker</code>, start an "API" that cannot reach its cache, with a restart policy: <code>docker run -d --name thu-a --restart on-failure node:22-alpine node -e 'require("net").connect(6379, "cache").on("error", e =&gt; { console.error("Error:", e.code, e.message); process.exit(1) })'</code></li>
<li>Start one with a typo in the command: <code>docker run --name thu-b alpine:3.20 nodee server.js</code>, and one that runs out of memory: <code>docker run --name thu-c --memory 128m --memory-swap 128m alpine:3.20 dd if=/dev/zero of=/dev/null bs=200M count=1</code>.</li>
<li>Wait a few seconds, then run the three commands of this lesson in order: <code>docker ps -a --filter name=thu- --format 'table {{.Names}}\\t{{.Status}}'</code>, then <code>docker inspect -f '{{.Name}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'</code> on each, then <code>docker logs --tail 1 thu-a</code> and <code>docker inspect -f '{{.State.Error}}' thu-b</code>.</li>
<li>Write one line per container: layer (1–4), evidence, next command. Then clean up: <code>docker rm -f thu-a thu-b thu-c</code>.</li></ol>
<p>What the course's Mac printed (names with its <code>dk12-</code> prefix):</p>
<div class="out">NAMES        STATUS
dk12-thu-c   Exited (137) 6 seconds ago
dk12-thu-b   Created
dk12-thu-a   Restarting (1) 2 seconds ago
/dk12-thu-a exit=1 oom=false restarts=6
/dk12-thu-b exit=127 oom=false restarts=0
/dk12-thu-c exit=137 oom=true restarts=0
Error: ENOTFOUND getaddrinfo ENOTFOUND cache
… exec: "nodee": executable file not found in $PATH</div>
<p><strong>Done when:</strong> you wrote, without looking at the answers, that <code>thu-a</code> is layer 3 reporting a layer-4 problem (DNS: no service named <code>cache</code>), <code>thu-b</code> is layer 2 (a command that does not exist — <code>Created</code>, empty logs, 127), and <code>thu-c</code> is layer 4 (its own memory limit — <code>oom=true</code>); and <code>docker ps -a --filter name=thu-</code> is empty afterwards.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Layer (of a failure)</span><span class="v">Where a problem lives: the image, the container's configuration, your process, or the environment around it.</span></div>
  <div class="kv"><span class="k">Exit code</span><span class="v">The number PID 1 ended with; above 128 it means "killed by signal (code − 128)".</span></div>
  <div class="kv"><span class="k">STATUS</span><span class="v">The column in <code>docker ps -a</code>: <code>Created</code>, <code>Up</code>, <code>Exited (n)</code>, <code>Restarting (n)</code>, <code>(unhealthy)</code>.</span></div>
  <div class="kv"><span class="k"><code>.State.Error</code></span><span class="v">The error Docker hit while starting a container, kept for later reading.</span></div>
  <div class="kv"><span class="k">OOMKilled</span><span class="v"><code>true</code> when the kernel killed the container for exceeding its memory limit.</span></div>
  <div class="kv"><span class="k">Go template (<code>-f</code>)</span><span class="v">The <code>{{ }}</code> syntax that picks single fields out of <code>docker inspect</code> JSON.</span></div>
  <div class="kv"><span class="k">distroless</span><span class="v">An image with your app and its runtime only — no shell, no package manager.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Redeploying the previous working image tag to restore service before investigating.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Name the layer first — image, configuration, process, environment — then open the matching lesson; each layer has a distinct signature.</li>
<li>Run <code>docker ps -a</code> before <code>docker logs</code>: <code>Created</code> means your code never ran, so the logs are empty by design.</li>
<li>0/1 are your program; 125 is Docker; 126/127 are runc refusing (container stays <code>Created</code>); 255 is <code>exec</code> failing inside.</li>
<li>Above 128 is a signal: 130 SIGINT, 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM — and only <code>OOMKilled</code> separates an OOM 137 from a <code>docker kill</code>.</li>
<li>No shell in the image? <code>docker cp</code> from the running or created container, or borrow a toolbox image with <code>--pid</code>/<code>--network container:&lt;name&gt;</code>.</li>
<li>Under pressure: write down what changed, change one thing at a time, roll back first if needed, and finish with a new check.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/containers/run/#exit-status" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">docker run — exit status</span><span class="lc-sub">The official meaning of 125, 126 and 127, and how a container's own exit code is passed through. Short, and worth reading once properly.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/inspect/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">docker inspect and Go templates</span><span class="lc-sub">The <code>-f</code> syntax that turns a 400-line JSON blob into the one field you need. <code>{{ json .State }}</code> and <code>{{ range ... }}</code> are worth ten minutes.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: identify the layer</span><span class="lc-sub">Graded exercises: eight broken containers, each with a status line, an exit code and three log lines. Name the layer and the next command for each — without fixing anything.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> starting with <code>docker logs</code>. It is the right command about half the time and completely empty the other half — because a container that failed at layer 1 or 2 never ran your code, so there is nothing to log. People then conclude the logs are broken, or restart with more logging enabled, and lose ten minutes before noticing the error was printed on <code>stderr</code> by the Docker CLI at creation time. Run <code>docker ps -a</code> first: the <code>STATUS</code> column distinguishes <code>Created</code> (never started — layer 1 or 2) from <code>Exited (1)</code> (ran and failed — layer 3) from <code>Restarting</code> (a loop) before you read a single line, and the exit code tells you which cookbook entry to open.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Identify the layer first — image, container config, process, or environment — because each has a distinct signature and naming it eliminates three quarters of the possibilities. Exit codes are the fastest signal: 125 is Docker, 126 is not executable, 127 is not found, 137 is a kill, and anything small is your own application. And under pressure, change one thing at a time; a rollback that buys quiet time is a legitimate first move.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Một phương pháp, trước khi tới sách công thức</h2>
<p class="lead">Vấn đề container cho cảm giác là chúng có thể nằm ở bất cứ đâu, và chính cảm giác đó mới là cái khó — chứ không phải từng cách sửa riêng lẻ, vốn thường rất nhỏ. Bài này cho bạn một cách cắt đôi không gian tìm kiếm hai lần trước khi đụng vào bất cứ thứ gì, để cuốn sách công thức phía sau trở thành việc tra bảng chứ không phải một cuộc săn.</p>

<h3>Bốn tầng, và tầng nào đang hỏng</h3>
${slide('dk-12', 3, 'Bốn tầng có thể hỏng — gọi tên tầng trước khi sửa')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Cái ảnh</span><span class="lz-lnote">Nó có tồn tại không, kéo về được không, đúng kiến trúc không, bên trong có đúng thứ bạn nghĩ không? Triệu chứng: <code>not found</code>, <code>exec format error</code>, một file bị thiếu bên trong container.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Cấu hình của container</span><span class="lz-lnote">Câu lệnh, môi trường, phép gắn, người dùng, cổng. Triệu chứng: <code>executable file not found</code>, permission denied, một thư mục rỗng ở chỗ lẽ ra có mã của bạn, một biến chưa được đặt.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Tiến trình bên trong</span><span class="lz-lnote">Ứng dụng của bạn, các phụ thuộc của nó, lỗi của chính nó. Triệu chứng: một vết ngăn xếp, một lần thoát khác 0 kèm thông báo, một vòng lặp sập ghi ra cùng một lỗi mỗi lần.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Môi trường xung quanh nó</span><span class="lz-lnote">Mạng, các container khác, tài nguyên máy chủ, đĩa. Triệu chứng: timeout, <code>ECONNREFUSED</code>, exit 137, <code>no space left on device</code>, mọi thứ chậm cùng lúc.</span></div>
</div>
<div class="callout ok"><strong>Mỗi tầng có một dấu hiệu riêng, và mã thoát thường gọi tên nó.</strong> Một container chưa bao giờ chạy nổi một dòng mã của bạn là tầng 1 hoặc 2. Một cái ghi ra lỗi của chính ứng dụng bạn là tầng 3. Một cái bị giết, hoặc không với tới được thứ gì đó, là tầng 4. Xác định tầng trước là bạn đã loại ba phần tư khả năng mà chưa chạy một công cụ chẩn đoán nào.</div>

<h3>Ba câu lệnh chạy trước tiên</h3>
${slide('dk-12', 4, 'Ba lệnh đầu tiên trả lời “tầng nào” — output thật')}
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}' | head -6
docker inspect -f '{{ .State.ExitCode }} oom={{ .State.OOMKilled }} restarts={{ .RestartCount }}' blog-api-1
docker logs --tail 30 blog-api-1</code></pre>
<div class="out">NAMES        STATUS                        IMAGE
blog-api-1   Restarting (1) 2 seconds ago   ghcr.io/me/api:9f2ac1e
blog-db-1    Up 12 minutes (healthy)        postgres:16.4-alpine
1 oom=false restarts=9
blog-api-1  | Error: P1001: Can't reach database server at &#96;db&#96;:&#96;5432&#96;</div>
<p>Trạng thái, mã thoát, log. Ba thứ đó cho bạn biết tầng nào trong khoảng năm giây: container đang lặp, mã thoát là 1 (một lỗi ứng dụng, không phải bị giết), và log gọi tên một phụ thuộc mà nó không với tới được. Đó là tầng 3 đang báo cáo một vấn đề ở tầng 4 — API không sao, mạng hoặc cơ sở dữ liệu mới có vấn đề — và bốn câu hỏi ở Bài 8.5 sẽ tiếp quản từ đó.</p>

<h3>Đọc STATUS trước khi đọc log: ngã ba đầu tiên</h3>
${slide('dk-12', 6, 'Cột STATUS là ngã ba đầu tiên của mọi ca hỏng')}
<p>Ba lệnh ở trên hiệu quả là nhờ THỨ TỰ của chúng. Cột <code>STATUS</code> của <code>docker ps -a</code> đã cho bạn biết mã của bạn có từng chạy hay chưa — trước khi bạn đọc một dòng log nào. Đây là sáu container khoá học cố tình làm hỏng, mỗi cái một kiểu:</p>
<pre><code class="language-bash">docker ps -a --filter label=dkhoc=12 --format 'table {{.Names}}\\t{{.Status}}'
docker logs dk12-typo 2&gt;&amp;1 | wc -l</code></pre>
<div class="out">NAMES        STATUS
dk12-oom     Exited (137) 1 second ago
dk12-crash   Exited (1) 1 second ago
dk12-typo    Created
dk12-goapi   Up About a minute
dk12-hc      Up 10 minutes (unhealthy)
dk12-loop    Restarting (1) 59 seconds ago
…
       0</div>
<p>Output thật trên máy Mac của khoá học (Docker 29.8). <code>--filter label=dkhoc=12</code> chỉ giữ lại những container do khoá học tạo — một cái lọc bạn sẽ cần trên mọi máy có chạy cả container của người khác. <code>dk12-typo</code> được chạy với một câu lệnh gõ sai (<code>nodee</code>), và log của nó có đúng KHÔNG dòng: tiến trình chưa từng tồn tại, nên chẳng có gì để đọc.</p>
<table>
<tr><th>STATUS nói</th><th>Nghĩa là</th><th>Tầng</th><th>Câu hỏi đầu tiên</th></tr>
<tr><td><code>Created</code></td><td>Docker tạo được container nhưng không khởi động được tiến trình</td><td>1–2</td><td>stderr của lệnh <code>docker run</code> bạn vừa gõ, hoặc <code>docker inspect -f '{{.State.Error}}' c</code> → Bài 12.2</td></tr>
<tr><td><code>Exited (0)</code> vài giây sau khi chạy</td><td>PID 1 kết thúc "thành công" — một daemon đã rẽ nhánh chạy nền, hoặc một việc chạy một lần</td><td>2–3</td><td><code>docker inspect -f '{{.Config.Entrypoint}} {{.Config.Cmd}}' c</code> → Bài 12.3</td></tr>
<tr><td><code>Exited (1)</code>, <code>(2)</code>…</td><td>chương trình của bạn tự chọn thoát kèm lỗi</td><td>3</td><td><code>docker logs --timestamps c</code> — câu trả lời thường là dòng lỗi đầu tiên</td></tr>
<tr><td><code>Exited (137)</code></td><td>bị giết bằng SIGKILL</td><td>4 (hoặc một con người)</td><td><code>docker inspect -f '{{.State.OOMKilled}}' c</code></td></tr>
<tr><td><code>Exited (255)</code></td><td>tiến trình đã được tạo nhưng <code>exec</code> hỏng bên trong container</td><td>1</td><td><code>docker logs c</code> — dòng duy nhất trong đó chính là lỗi</td></tr>
<tr><td><code>Restarting (n)</code></td><td>chính sách restart cứ kéo lên lại một thứ cứ chết</td><td>3–4</td><td>lần hỏng ĐẦU TIÊN: <code>docker logs -t c | head</code></td></tr>
<tr><td><code>Up … (unhealthy)</code></td><td>tiến trình chạy; healthcheck của nó hỏng</td><td>3 — hoặc chính bộ kiểm</td><td><code>docker inspect -f '{{json .State.Health}}' c</code></td></tr>
</table>
<div class="callout ok"><strong>Created hay Exited là sự thật hữu ích nhất của cả chương này.</strong> Một container kẹt ở <code>Created</code> nghĩa là runc từ chối khởi động tiến trình của bạn ngay từ đầu — thiếu tệp chạy (127), file không có quyền chạy (126). Không có gì của bạn đã chạy, nên <code>docker logs</code> rỗng là ĐÚNG THIẾT KẾ và thông báo nằm ở stderr của lệnh bạn vừa gõ. Lỗi đó cũng được lưu lại: <code>docker inspect -f '{{.State.Error}}' dk12-typo</code> in lại nó về sau — cứu bạn khi lỗi xảy ra trong một script mà bạn không giữ output.</div>

<h3>Những mã thoát đáng thuộc lòng</h3>
${slide('dk-12', 5, 'Bảng mã thoát: mỗi mã được gây ra thật trên máy khoá học')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>0</code></span><span class="v">Thoát sạch. Trên một dịch vụ thì đó vẫn là một cái lỗi — máy chủ không nên kết thúc. Hãy kiểm xem câu lệnh có phải loại chạy một lần trong khi bạn định chạy nền không.</span></div>
  <div class="kv"><span class="k"><code>1</code> (hoặc một số nhỏ bất kỳ)</span><span class="v">Ứng dụng của bạn thoát kèm lỗi. Tầng 3 — hãy đọc log; câu trả lời gần như luôn nằm trong đó.</span></div>
  <div class="kv"><span class="k"><code>125</code></span><span class="v"><strong>Chính Docker</strong> hỏng trước khi container khởi động: một cái cờ sai, một cái tên bị trùng, một phép gắn không hợp lệ. Chữ báo lỗi nằm ở stderr, không nằm trong log.</span></div>
  <div class="kv"><span class="k"><code>126</code></span><span class="v">Tìm thấy câu lệnh nhưng nó <strong>không chạy được</strong> — thiếu <code>+x</code>, hoặc một thư mục ở chỗ lẽ ra là một tệp nhị phân. (Script có ký tự xuống dòng kiểu CRLF hỏng theo KIỂU KHÁC — báo <code>no such file or directory</code> với mã 255; xem bảng bên dưới.)</span></div>
  <div class="kv"><span class="k"><code>127</code></span><span class="v"><strong>Không tìm thấy câu lệnh</strong> bên trong container. Một lỗi gõ, một tệp nhị phân không có trong cái ảnh đó, hoặc một shell không tồn tại (distroless không có <code>sh</code>).</span></div>
  <div class="kv"><span class="k"><code>137</code> / <code>143</code></span><span class="v">SIGKILL (128+9) và SIGTERM (128+15). 137 thường là OOM — hãy xác nhận bằng <code>OOMKilled</code>. 143 là một lần dừng bình thường, và trong một vòng lặp sập thì nó nghĩa là có thứ gì đó cố tình dừng nó.</span></div>
</div>
<pre><code>docker run --rm alpine:3.20 nosuchcommand; echo "127? → $?"
docker run --rm --badflag alpine:3.20 true 2&gt;&amp;1 | tail -1; echo "125? → &#36;{PIPESTATUS[0]}"
docker run --rm -v "$PWD/notexec.sh:/s.sh" alpine:3.20 /s.sh; echo "126? → $?"</code></pre>
<div class="out">docker: Error response from daemon: failed to create task: exec: "nosuchcommand": executable file not found in $PATH
127? → 127
unknown flag: --badflag
125? → 125
docker: Error response from daemon: failed to create task: exec: "/s.sh": permission denied
126? → 126</div>

<h3>Chạy thử từng bước: tự tay gây ra từng mã thoát</h3>
<p>Học thuộc một cái bảng thì yếu; tự tay gây ra từng mã thì nhớ lâu. Mọi lệnh dưới đây đã chạy trên máy Mac của khoá học (Docker Desktop 4.91 / Engine 29.8, arm64). Hãy chạy chúng trong <code>~/thu-docker</code>; mất khoảng hai phút và cuối cùng có lệnh dọn sạch.</p>
<pre><code class="language-bash"><span class="tok-comment"># 0 và 1 — chương trình tự quyết</span>
docker run --name t-0 alpine:3.20 true;  echo "exit=$?"
docker run --name t-1 alpine:3.20 false; echo "exit=$?"
<span class="tok-comment"># 125 — chính Docker từ chối (cờ sai); 127 / 126 — runc từ chối lúc tạo</span>
docker run --rm --badflag alpine:3.20 true; echo "exit=$?"
docker run --name t-127 alpine:3.20 nosuchcommand; echo "exit=$?"
docker run --name t-126 alpine:3.20 /etc/hosts;    echo "exit=$?"
<span class="tok-comment"># tín hiệu: 128 + số hiệu tín hiệu</span>
docker run -d --name t-130 --init alpine:3.20 sleep 600 &amp;&amp; sleep 1 &amp;&amp; docker kill -s INT t-130
docker run --name t-137 --memory 128m --memory-swap 128m alpine:3.20 dd if=/dev/zero of=/dev/null bs=200M count=1
docker run -d --name t-kill alpine:3.20 sleep 600 &amp;&amp; docker kill t-kill
docker run -d --name t-143 --init alpine:3.20 sleep 600 &amp;&amp; docker stop t-143
docker run --name t-139 python:3.12-alpine python -c 'import ctypes; ctypes.string_at(0)'
<span class="tok-comment"># đọc lại tất cả</span>
for c in t-0 t-1 t-127 t-126 t-130 t-137 t-kill t-143 t-139; do
  docker inspect -f "{{.Name}} {{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}" $c
done</code></pre>
<div class="out">exit=0
exit=1
unknown flag: --badflag
…
exit=125
docker: Error response from daemon: failed to create task for container: … exec: "nosuchcommand": executable file not found in $PATH
exit=127
docker: Error response from daemon: … exec: "/etc/hosts": permission denied
exit=126
…
/t-0 exited exit=0 oom=false
/t-1 exited exit=1 oom=false
/t-127 created exit=127 oom=false
/t-126 created exit=126 oom=false
/t-130 exited exit=130 oom=false
/t-137 exited exit=137 oom=true
/t-kill exited exit=137 oom=false
/t-143 exited exit=143 oom=false
/t-139 exited exit=139 oom=false</div>
<p>Output ở trên là của máy khoá học (tên container rút gọn từ tiền tố <code>dk12-</code> của nó). Có bốn điều đáng để ý:</p>
<ul>
<li><strong>127 và 126 nằm lại ở <code>created</code>.</strong> Chúng là hai cái duy nhất chưa bao giờ trở thành một tiến trình đang chạy.</li>
<li><strong>Hai số 137, hai câu chuyện khác nhau.</strong> <code>t-137</code> chạm trần bộ nhớ (<code>oom=true</code>); <code>t-kill</code> bị một người giết (<code>oom=false</code>). <code>docker ps</code> in <code>Exited (137)</code> cho cả hai — chỉ <code>OOMKilled</code> phân biệt được.</li>
<li><strong>130 cần <code>--init</code>.</strong> Không có nó, <code>sleep</code> là PID 1 và nhân VỨT tín hiệu SIGINT mà nó không có hàm xử lý: cùng thí nghiệm đó bỏ <code>--init</code> thì container vẫn <code>running</code> (Chương 1).</li>
<li><strong>139 là một lỗi phân đoạn bộ nhớ (segfault) thật</strong> — Python cố tình đọc địa chỉ 0. Ngoài đời nó đến từ một thư viện native (module xử lý ảnh, driver cơ sở dữ liệu) được dựng cho sai libc hoặc sai kiến trúc.</li>
</ul>
<table>
<tr><th>Mã</th><th>Đọc thế nào</th><th>Lệnh tiếp theo</th></tr>
<tr><td><code>130</code></td><td>128 + 2 = SIGINT, tức Ctrl-C (hoặc <code>kill -s INT</code>)</td><td>ai bấm Ctrl-C trong một <code>docker run -it</code>?</td></tr>
<tr><td><code>139</code></td><td>128 + 11 = SIGSEGV: chương trình chạm vào vùng nhớ không được phép</td><td>module native, <code>--platform</code>, ảnh nền musl hay glibc</td></tr>
<tr><td><code>255</code></td><td>tạo được, nhưng <code>exec</code> hỏng bên trong container: sai kiến trúc (<code>exec format error</code>), shebang CRLF hoặc thiếu loader glibc (<code>no such file or directory</code>)</td><td><code>docker logs c</code> — dòng duy nhất trong đó là lỗi (Bài 12.2)</td></tr>
</table>
<div class="callout warn"><strong>Mac và Linux bất đồng ở một chỗ, nên hãy đọc CHỮ, đừng chỉ nhìn SỐ.</strong> Bind-mount một script không có <code>+x</code> (<code>-v "$PWD/notexec.sh:/s.sh"</code>, ví dụ cuối ở mục ngay trên) cho mã <strong>126</strong> và container <code>Created</code> trên máy Linux của khoá học (Docker 29.6) — nhưng trên máy Mac, qua cơ chế chia sẻ file của Docker Desktop, cùng lệnh đó in <code>exec /s.sh: permission denied</code> và thoát <strong>255</strong> với container <code>Exited</code>. Chữ "permission denied" y hệt nhau; con số thì không.</div>
<table>
<tr><th>Trường mẫu (template)</th><th>Chứa gì</th></tr>
<tr><td><code>.State.Status</code></td><td><code>created</code>, <code>running</code>, <code>restarting</code>, <code>exited</code>, <code>paused</code>, <code>dead</code></td></tr>
<tr><td><code>.State.ExitCode</code></td><td>mã thoát gần nhất (0 khi đang chạy)</td></tr>
<tr><td><code>.State.OOMKilled</code></td><td><code>true</code> CHỈ khi kẻ giết OOM của nhân kết liễu nó</td></tr>
<tr><td><code>.State.Error</code></td><td>lỗi Docker gặp khi <em>khởi động</em> nó — có giá trị với container <code>Created</code></td></tr>
<tr><td><code>.RestartCount</code></td><td>số lần chính sách restart đã kéo nó lên lại</td></tr>
<tr><td><code>.State.StartedAt</code> / <code>.State.FinishedAt</code></td><td>mốc giờ UTC của lần khởi động và lần dừng gần nhất — so hai cái là biết nó sống được bao lâu</td></tr>
<tr><td><code>.State.Health</code></td><td>trạng thái healthcheck, số lần hỏng liên tiếp và output của năm lần kiểm gần nhất</td></tr>
</table>
<p>Dọn mọi thứ của bài này bằng một dòng: <code>docker rm -f t-0 t-1 t-127 t-126 t-130 t-137 t-kill t-143 t-139</code>.</p>

<h3>Nhìn vào bên trong, kể cả khi không có shell</h3>
${slide('dk-12', 7, 'Không có shell vẫn soi được: cp, create, mượn namespace')}
<pre><code><span class="tok-comment"># File đó có trong ảnh không? (không cần container nào)</span>
docker run --rm --entrypoint sh ghcr.io/me/api:9f2ac1e -c 'ls -l dist/ | head -3'

<span class="tok-comment"># Distroless hay scratch — không có shell nào cả. Chép nó RA ngoài.</span>
cid=$(docker create ghcr.io/me/api:9f2ac1e)
docker cp "$cid:/app/dist/index.js" - | tar -t | head -2
docker rm "$cid" &gt;/dev/null

<span class="tok-comment"># Hoặc mượn một cái shell từ ảnh khác, dùng chung namespace</span>
docker run --rm -it --pid container:blog-api-1 --network container:blog-api-1 \\
  nicolaka/netshoot sh -c 'ps -o pid,comm; ss -lntp'</code></pre>
<div class="out">-rw-r--r--    1 root     root         84213 Aug 22 11:02 index.js
app/dist/index.js
  PID COMMAND
    1 tini
    7 node
LISTEN 0 511 0.0.0.0:3000 0.0.0.0:*</div>
<div class="callout"><strong><code>docker create</code> mà không <code>start</code> là một lệnh bị đánh giá thấp.</strong> Nó cho bạn một hệ thống file container để <code>cp</code> ra mà không bao giờ phải chạy entrypoint — và đó đúng là thứ bạn cần khi chính cái entrypoint mới là thứ đang hỏng, hoặc khi cái ảnh không có shell nào để exec vào. Ghép nó với <code>--entrypoint sh</code> cho những ảnh có shell, và bạn soi được gần như mọi thứ.</div>

<h3>Cái luật cho lúc mọi thứ đang cháy</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Viết ra thứ gì đã thay đổi</span><span class="lz-t">một lượt deploy, một biến env, một ảnh nền, một gói phụ thuộc</span><span class="lz-d">Container là thứ tái lập được, nên chắc chắn có gì đó đã đổi. Nếu phía bạn không đổi gì thì một cái nhãn hay đổi đã dịch chuyển, hoặc máy chủ đã đầy. Cả hai đều tìm ra được.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Đổi MỘT thứ một lần</span><span class="lz-t">và kiểm lại sau mỗi lần</span><span class="lz-d">Dưới áp lực thì rất muốn đổi năm thứ rồi khởi động lại. Sau đó nó chạy, bạn không biết vì sao, và tháng sau chuyện lặp lại mà bạn không có thêm thông tin nào.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Cứu dịch vụ trước, hiểu sau</span><span class="lz-t">quay lui là một nước đi đầu tiên hoàn toàn chính đáng</span><span class="lz-d">Deploy lại cái nhãn trước đó (Bài 11.4) mua cho bạn thời gian để chẩn đoán mà không có khán giả. Đó không phải là bỏ cuộc; đó là tách tình huống khẩn cấp ra khỏi cuộc điều tra.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Kết quả là một PHÉP KIỂM MỚI</span><span class="lz-t">không chỉ là một dịch vụ đã hồi phục</span><span class="lz-d">Mọi sự cố trong lịch sử của chính khoá học này đều kết thúc bằng một cái: một chốt kiểm bắt 404, một khẳng định libc-với-engine trước khi đẩy, một phép kiểm kiểu dữ liệu cho script seed. Đó mới là thứ chặn lần thứ hai.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> đêm trước buổi demo SWP391, một bạn cùng nhóm nhắn "stack hỏng rồi, không cái gì chạy" và không dán thêm gì. Bạn sẽ dựng lại ba container hỏng theo ba kiểu khác nhau và gọi tên TẦNG của từng cái <em>trước khi</em> sửa bất cứ gì — đúng thói quen bài này dạy.</p><ol>
<li>Trong <code>~/thu-docker</code>, chạy một "API" không với tới được cache của nó, kèm chính sách restart: <code>docker run -d --name thu-a --restart on-failure node:22-alpine node -e 'require("net").connect(6379, "cache").on("error", e =&gt; { console.error("Error:", e.code, e.message); process.exit(1) })'</code></li>
<li>Chạy một cái gõ sai lệnh: <code>docker run --name thu-b alpine:3.20 nodee server.js</code>, và một cái hết bộ nhớ: <code>docker run --name thu-c --memory 128m --memory-swap 128m alpine:3.20 dd if=/dev/zero of=/dev/null bs=200M count=1</code>.</li>
<li>Chờ vài giây, rồi chạy ba lệnh của bài này theo đúng thứ tự: <code>docker ps -a --filter name=thu- --format 'table {{.Names}}\\t{{.Status}}'</code>, rồi <code>docker inspect -f '{{.Name}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'</code> cho từng cái, rồi <code>docker logs --tail 1 thu-a</code> và <code>docker inspect -f '{{.State.Error}}' thu-b</code>.</li>
<li>Viết mỗi container một dòng: tầng (1–4), bằng chứng, lệnh tiếp theo. Rồi dọn: <code>docker rm -f thu-a thu-b thu-c</code>.</li></ol>
<p>Máy Mac của khoá học in ra (tên mang tiền tố <code>dk12-</code>):</p>
<div class="out">NAMES        STATUS
dk12-thu-c   Exited (137) 6 seconds ago
dk12-thu-b   Created
dk12-thu-a   Restarting (1) 2 seconds ago
/dk12-thu-a exit=1 oom=false restarts=6
/dk12-thu-b exit=127 oom=false restarts=0
/dk12-thu-c exit=137 oom=true restarts=0
Error: ENOTFOUND getaddrinfo ENOTFOUND cache
… exec: "nodee": executable file not found in $PATH</div>
<p><strong>Đạt khi:</strong> bạn tự viết được (không nhìn đáp án) rằng <code>thu-a</code> là tầng 3 đang báo lỗi của tầng 4 (DNS: không có service nào tên <code>cache</code>), <code>thu-b</code> là tầng 2 (lệnh không tồn tại — <code>Created</code>, log rỗng, 127), <code>thu-c</code> là tầng 4 (trần bộ nhớ của chính nó — <code>oom=true</code>); và <code>docker ps -a --filter name=thu-</code> rỗng sau khi dọn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Layer (tầng hỏng)</span><span class="v">Nơi vấn đề nằm: cái ảnh, cấu hình container, tiến trình của bạn, hay môi trường xung quanh.</span></div>
  <div class="kv"><span class="k">Exit code (mã thoát)</span><span class="v">Con số PID 1 trả về khi kết thúc; trên 128 nghĩa là "bị tín hiệu số (mã − 128) giết".</span></div>
  <div class="kv"><span class="k">STATUS (trạng thái)</span><span class="v">Cột trong <code>docker ps -a</code>: <code>Created</code>, <code>Up</code>, <code>Exited (n)</code>, <code>Restarting (n)</code>, <code>(unhealthy)</code>.</span></div>
  <div class="kv"><span class="k"><code>.State.Error</code> (lỗi lúc khởi động)</span><span class="v">Lỗi Docker gặp khi khởi động container, được giữ lại để đọc về sau.</span></div>
  <div class="kv"><span class="k">OOMKilled (bị giết vì hết bộ nhớ)</span><span class="v"><code>true</code> khi nhân giết container vì vượt trần bộ nhớ của nó.</span></div>
  <div class="kv"><span class="k">Go template (mẫu định dạng, cờ <code>-f</code>)</span><span class="v">Cú pháp <code>{{ }}</code> để nhặt đúng một trường ra khỏi JSON của <code>docker inspect</code>.</span></div>
  <div class="kv"><span class="k">distroless (ảnh tối giản)</span><span class="v">Ảnh chỉ có ứng dụng và runtime của nó — không shell, không trình quản lý gói.</span></div>
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Deploy lại nhãn ảnh cũ đang chạy tốt để cứu dịch vụ trước, điều tra sau.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Gọi tên tầng trước — ảnh, cấu hình, tiến trình, môi trường — rồi mới mở bài tương ứng; mỗi tầng có dấu hiệu riêng.</li>
<li>Chạy <code>docker ps -a</code> trước <code>docker logs</code>: <code>Created</code> nghĩa là mã của bạn chưa từng chạy, log rỗng là đúng thiết kế.</li>
<li>0/1 là chương trình của bạn; 125 là Docker; 126/127 là runc từ chối (container nằm ở <code>Created</code>); 255 là <code>exec</code> hỏng bên trong.</li>
<li>Trên 128 là tín hiệu: 130 SIGINT, 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM — và chỉ <code>OOMKilled</code> phân biệt 137 do OOM với 137 do <code>docker kill</code>.</li>
<li>Ảnh không có shell? <code>docker cp</code> từ container đang chạy hoặc vừa <code>create</code>, hoặc mượn ảnh công cụ với <code>--pid</code>/<code>--network container:&lt;tên&gt;</code>.</li>
<li>Dưới áp lực: ghi lại thứ đã đổi, đổi một thứ một lần, quay lui trước nếu cần, và kết thúc bằng một phép kiểm mới.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/containers/run/#exit-status" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">docker run — mã thoát</span><span class="lc-sub">Ý nghĩa chính thức của 125, 126 và 127, và cách mã thoát của chính container được chuyển ra ngoài. Ngắn, và đáng đọc kỹ một lần.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/inspect/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">docker inspect và mẫu Go</span><span class="lc-sub">Cú pháp <code>-f</code> biến một khối JSON 400 dòng thành đúng một trường bạn cần. <code>{{ json .State }}</code> và <code>{{ range ... }}</code> đáng bỏ ra mười phút.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: xác định tầng</span><span class="lc-sub">Bài chấm điểm: tám container hỏng, mỗi cái kèm một dòng trạng thái, một mã thoát và ba dòng log. Hãy gọi tên tầng và câu lệnh kế tiếp cho từng cái — không cần sửa gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> bắt đầu bằng <code>docker logs</code>. Nó là câu lệnh đúng khoảng một nửa số lần và rỗng hoàn toàn ở nửa còn lại — vì một container hỏng ở tầng 1 hay 2 chưa bao giờ chạy mã của bạn, nên chẳng có gì để ghi log. Người ta khi ấy kết luận là log hỏng, hoặc khởi động lại kèm bật thêm log, và mất mười phút trước khi nhận ra thông báo lỗi đã được CLI của Docker in ra <code>stderr</code> ngay lúc tạo container. Hãy chạy <code>docker ps -a</code> trước: cột <code>STATUS</code> phân biệt <code>Created</code> (chưa từng khởi động — tầng 1 hoặc 2) với <code>Exited (1)</code> (đã chạy rồi hỏng — tầng 3) với <code>Restarting</code> (một vòng lặp) trước khi bạn đọc một dòng nào, và mã thoát cho biết cần mở mục nào trong sách công thức.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy xác định TẦNG trước — ảnh, cấu hình container, tiến trình, hay môi trường — vì mỗi tầng có một dấu hiệu riêng và gọi tên được nó là loại ngay ba phần tư khả năng. Mã thoát là tín hiệu nhanh nhất: 125 là Docker, 126 là không chạy được, 127 là không tìm thấy, 137 là bị giết, và mọi số nhỏ là ứng dụng của chính bạn. Và dưới áp lực thì hãy đổi một thứ một lần; một lượt quay lui mua được thời gian yên tĩnh là nước đi đầu tiên chính đáng.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — It will not start|||12.2 — Nó không khởi động được',
      slug: 'dk-12-2-khong-khoi-dong',
      type: 'LESSON',
      description: 'Mười triệu chứng của tầng 1 và 2: không kéo được ảnh, exec format error, không tìm thấy câu lệnh, permission denied, cổng bị chiếm, mount hỏng, tên trùng, và biến env vắng mặt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>It will not start</h2>
<p class="lead">Everything in this lesson happens before your code runs, which is why <code>docker logs</code> is empty and the real message is on stderr from the CLI. Ten symptoms, each with the exact error text you will see and the fix.</p>

<h3>The image cannot be pulled</h3>
${slide('dk-12', 8, 'Container không lên: đọc từ khoá trong dòng lỗi rồi rẽ nhánh')}
<pre><code>docker pull ghcr.io/me/api:9f2ac1e</code></pre>
<div class="out">Error response from daemon: denied: denied
Error response from daemon: manifest unknown: manifest unknown</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>denied</code> on a private registry</span><span class="v">Not logged in, or the token lacks <code>read:packages</code>. <code>docker login ghcr.io -u &lt;user&gt;</code> with a PAT. On a server, the credentials live in <code>~/.docker/config.json</code> of the user running the deploy — often <code>root</code>, not you.</span></div>
  <div class="kv"><span class="k"><code>manifest unknown</code></span><span class="v">The tag does not exist. Usually a typo, or a CI job that failed to push while the deploy step ran anyway. <code>docker buildx imagetools inspect</code> lists what really exists.</span></div>
  <div class="kv"><span class="k"><code>pull rate limit exceeded</code></span><span class="v">Docker Hub's anonymous limit. Log in even with a free account, mirror the images you depend on, or move to GHCR.</span></div>
  <div class="kv"><span class="k"><code>no such host</code></span><span class="v">DNS or egress from the host. Test with <code>curl -sSI https://ghcr.io/v2/</code> — if that fails, the problem is the network, not Docker.</span></div>
</div>
<p>The exact wording changed with Docker 29 and its containerd image store, so here are the three pull failures as the course's Mac prints them today (September 2026, Engine 29.8) — search your terminal for the <em>last</em> words of each line:</p>
<pre><code class="language-bash">docker pull alpine:9.99
docker pull ghcr.io/cuongthai-dk12-khong-co/api:1
docker pull registry.khong-co.invalid/api:1</code></pre>
<div class="out">Error response from daemon: failed to resolve reference "docker.io/library/alpine:9.99": docker.io/library/alpine:9.99: not found
Error response from daemon: error from registry: denied
denied
Error response from daemon: failed to resolve reference "registry.khong-co.invalid/api:1": … dial tcp: lookup registry.khong-co.invalid: no such host</div>
<p>Three different last words, three different owners: <code>not found</code> is the tag (yours to fix), <code>denied</code> is credentials — GHCR says <code>denied</code> both for "you are not logged in" and for "this package does not exist or is private", on purpose, so it does not leak which private packages exist — and <code>no such host</code> is the DNS of the machine running the pull, not Docker. A <code>docker run</code> of a missing tag prints the same thing after <code>Unable to find image 'alpine:9.99' locally</code>, and no container is created.</p>

<h3>exec format error</h3>
${slide('dk-12', 11, 'exec format error: ảnh arm64 từ Mac chạy trên máy amd64 — output thật')}
<pre><code>docker run --rm ghcr.io/me/api:9f2ac1e</code></pre>
<div class="out">exec /usr/local/bin/node: exec format error</div>
<pre><code>docker image inspect ghcr.io/me/api:9f2ac1e -f '{{ .Os }}/{{ .Architecture }}'
uname -m
docker buildx imagetools inspect ghcr.io/me/api:9f2ac1e | grep -A1 Platform | head -4</code></pre>
<div class="out">linux/arm64
x86_64
  Platform:    linux/amd64
  Platform:    linux/arm64</div>
<div class="callout warn"><strong>An arm64 image on an amd64 host, or the reverse.</strong> Building on an Apple Silicon Mac and deploying to an x86 VPS produces exactly this, and the build is completely green. Fix it by building multi-arch (<code>docker buildx build --platform linux/amd64,linux/arm64</code>) or by pinning the target (<code>--platform linux/amd64</code>) — Lesson 3.4. The related trap is subtler: a <em>correct</em> architecture with the wrong libc, which starts and then dies with a missing shared library rather than failing to exec at all (Lesson 6.2).</div>
<p>The course reproduced this exact story with two real machines: an image built on the Mac M1 with no <code>--platform</code>, copied to the Linux amd64 machine with <code>docker save | ssh … docker load</code> (no registry needed), and run there:</p>
<pre><code class="language-bash"><span class="tok-comment"># Dockerfile: FROM node:22-alpine + CMD ["node","-e","console.log(process.arch)"]</span>
docker build -q -t api:mac .
docker save api:mac | ssh linux-nha docker load
ssh linux-nha docker run --name arch api:mac; echo "exit=$?"
ssh linux-nha docker image inspect api:mac -f '{{.Os}}/{{.Architecture}}'</code></pre>
<div class="out">Loaded image: api:mac
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /usr/local/bin/docker-entrypoint.sh: exec format error
exit=255
linux/arm64</div>
<p>Three details the one-line error hides. Docker <strong>warned</strong> before running — read warnings, they are usually the whole diagnosis. The exit code is <strong>255</strong> and the container ends <code>Exited</code>, not <code>Created</code>, because the failure happened inside the container when the first binary (<code>docker-entrypoint.sh</code>, whose interpreter is the arm64 <code>/bin/sh</code>) was executed. And the fix is one flag on the machine that builds:</p>
<pre><code class="language-bash">docker build -q --platform linux/amd64 -t api:amd64 .
docker save api:amd64 | ssh linux-nha docker load
ssh linux-nha docker run --rm api:amd64
docker run --rm api:amd64          <span class="tok-comment"># back on the Mac</span></code></pre>
<div class="out">Loaded image: api:amd64
x64
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
x64</div>
<div class="callout warn"><strong>Your Mac will never show you this bug.</strong> Docker Desktop emulates amd64, so the amd64 image ran on the Mac too (slower, with a warning). The reverse is not true on a plain Linux server: the course's machine has no emulator registered, so an arm64 image simply cannot run there. Build for the machine that will <em>run</em> the image, not the one that builds it — and in CI, let the runner build (it is amd64 already).</div>

<h3>executable file not found, and permission denied</h3>
${slide('dk-12', 9, '127 “không có lệnh” khác 126 “có mà không chạy được”')}
${slide('dk-12', 10, 'Shebang CRLF: file nằm đó mà vẫn “no such file or directory”')}
<pre><code>docker run --rm alpine:3.20 python
docker run --rm -v "$PWD/entrypoint.sh:/e.sh" alpine:3.20 /e.sh
docker run --rm gcr.io/distroless/nodejs22-debian12 sh</code></pre>
<div class="out">exec: "python": executable file not found in $PATH
exec: "/e.sh": permission denied
exec: "sh": executable file not found in $PATH</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Not in this image</span><span class="lz-t">alpine has no python, distroless has no shell</span><span class="lz-d">Check with <code>docker run --rm --entrypoint sh &lt;image&gt; -c 'command -v &lt;bin&gt;'</code>. If the image has no shell either, you have your answer.</span></div>
  <div class="lz-step"><span class="lz-k">Missing the executable bit</span><span class="lz-t">chmod +x, and commit the mode</span><span class="lz-d"><code>git update-index --chmod=+x entrypoint.sh</code> so it stays executable for everyone. A <code>COPY --chmod=755</code> in the Dockerfile is the belt to that braces.</span></div>
  <div class="lz-step"><span class="lz-k">CRLF line endings</span><span class="lz-t">the shebang becomes #!/bin/sh\\r</span><span class="lz-d">The kernel looks for an interpreter literally named <code>sh\\r</code> and reports "not found" for a file that is plainly there. <code>file entrypoint.sh</code> says "CRLF line terminators"; <code>dos2unix</code> or a <code>.gitattributes</code> with <code>*.sh text eol=lf</code> fixes it.</span></div>
  <div class="lz-step"><span class="lz-k">Shell form versus exec form</span><span class="lz-t">CMD node app.js vs CMD ["node","app.js"]</span><span class="lz-d">Exec form does no shell expansion, so <code>CMD ["node", "$FILE"]</code> passes the literal string <code>$FILE</code>. If you need a variable or a pipe, you need a shell (Lesson 4.3).</span></div>
</div>

<h3>Run it step by step: a CRLF shebang, and why it says "no such file"</h3>
<p>The classic group-project version: a teammate on Windows edits <code>entrypoint.sh</code>, Git (or the editor) saves it with Windows line endings, and the next build is green while the container refuses to start. Reproduce it in <code>~/thu-docker/crlf</code>:</p>
<pre><code class="language-bash">printf '#!/bin/sh\\r\\necho "api starting"\\r\\nexec sleep 600\\r\\n' &gt; entrypoint.sh
printf 'FROM alpine:3.20\\nCOPY --chmod=755 entrypoint.sh /entrypoint.sh\\nENTRYPOINT ["/entrypoint.sh"]\\n' &gt; Dockerfile
file entrypoint.sh
docker build -q -t crlf:1 . &amp;&amp; echo "build ✓"
docker run --name crlf crlf:1; echo "exit=$?"
docker run --rm --entrypoint sh crlf:1 -c 'ls -l /entrypoint.sh; head -1 /entrypoint.sh | od -c | head -1'</code></pre>
<div class="out">entrypoint.sh: POSIX shell script text executable, ASCII text, with CRLF line terminators
build ✓
exec /entrypoint.sh: no such file or directory
exit=255
-rwxr-xr-x    1 root     root            48 Sep 23 19:30 /entrypoint.sh
0000000   #   !   /   b   i   n   /   s   h  \\r  \\n</div>
<p>Real output from the course's Mac; the course's Linux machine printed the identical error and exit code. Read the evidence in order: the file exists and is executable (<code>-rwxr-xr-x</code>, thanks to <code>COPY --chmod=755</code>), yet the kernel says "no such file". The <code>od -c</code> line shows why — the first line ends in <code>\\r \\n</code>, so the interpreter the kernel looks for is literally <code>/bin/sh\\r</code>, which does not exist. The message is about the <em>interpreter</em>, not your script. Fix and verify:</p>
<pre><code class="language-bash">sed -i '' $'s/\\r$//' entrypoint.sh      <span class="tok-comment"># macOS sed; on Linux: sed -i 's/\\r$//' entrypoint.sh</span>
file entrypoint.sh
docker build -q -t crlf:2 . &gt;/dev/null &amp;&amp; docker run -d --name crlf2 crlf:2 &amp;&amp; sleep 1 &amp;&amp; docker logs crlf2
docker rm -f crlf crlf2</code></pre>
<div class="out">entrypoint.sh: POSIX shell script text executable, ASCII text
api starting</div>
<div class="callout ok"><strong>Stop it at the source, once, for the whole team:</strong> commit a <code>.gitattributes</code> with the line <code>*.sh text eol=lf</code>. Git then checks shell scripts out with LF on every machine, Windows included. (The script ends in <code>exec sleep 600</code> so it stays up; that is why the fixed version is run with <code>-d</code> and removed at the end.)</div>
<table>
<tr><th>Error text</th><th>Code / STATUS</th><th>What is really wrong</th></tr>
<tr><td><code>executable file not found in $PATH</code></td><td>127 · Created</td><td>no program by that name in this image (typo, wrong base image, distroless has no <code>sh</code>)</td></tr>
<tr><td><code>permission denied</code></td><td>126 · Created</td><td>the file is there but has no <code>+x</code>, or it is a directory</td></tr>
<tr><td><code>is a directory: permission denied</code></td><td>126 · Created</td><td>you named a directory as the command (<code>docker run alpine /etc</code>)</td></tr>
<tr><td><code>exec …: no such file or directory</code></td><td>255 · Exited</td><td>the file exists but its <em>interpreter or loader</em> does not: CRLF shebang, or a glibc binary in a musl image (Lesson 12.4)</td></tr>
<tr><td><code>exec …: exec format error</code></td><td>255 · Exited</td><td>built for another CPU architecture</td></tr>
</table>
<h3>Port and name conflicts</h3>
${slide('dk-12', 12, 'Cổng bận: hai câu báo lỗi, hai thủ phạm khác nhau')}
<pre><code>docker run -d -p 8080:80 --name web nginx:alpine</code></pre>
<div class="out">docker: Error response from daemon: driver failed programming external connectivity:
failed to bind host port for 0.0.0.0:8080: address already in use
docker: Error response from daemon: Conflict. The container name "/web" is already in use
by container "a91c4e7b2f60". You have to remove (or rename) that container.</div>
<pre><code>ss -lntp 'sport = :8080' | tail -1
docker ps -a --filter name='^/web$' --format '{{.ID}} {{.Status}}'
docker rm -f web  &amp;&amp;  docker run -d -p 8080:80 --name web nginx:alpine &gt;/dev/null &amp;&amp; echo ok</code></pre>
<div class="out">LISTEN 0 4096 0.0.0.0:8080 0.0.0.0:* users:(("docker-proxy",pid=4471,fd=4))
a91c4e7b2f60 Exited (0) 2 hours ago
ok</div>
<p>Both errors name the culprit precisely, which is unusual and worth appreciating. The port case is either another <em>running</em> container (Docker then says <code>port is already allocated</code>) or a process outside Docker such as a stray dev server (<code>address already in use</code>) — a stopped container releases its port, so it is never the culprit here (corrected September 2026, measured below); the name case is a container in <code>Exited</code> state that <code>docker ps</code> (without <code>-a</code>) does not show you.</p>

<h3>Run it step by step: both port messages, and the container a failed run leaves behind</h3>
<p>Measured on the course's machines, always publishing on <code>127.0.0.1</code> so nothing is exposed to the network while you experiment:</p>
<pre><code class="language-bash">docker run -d --name web1 -p 127.0.0.1:18120:80 nginx:1.27-alpine
docker run -d --name web2 -p 127.0.0.1:18120:80 nginx:1.27-alpine
docker ps --filter publish=18120 --format '{{.Names}} {{.Ports}}'
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker run -d --name web2 nginx:1.27-alpine</code></pre>
<div class="out">a55c56017af25f126853b140b8bc1d6197ca53678d2285597ecf0007fa54
docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint web2 (…): Bind for 127.0.0.1:18120 failed: port is already allocated
web1 127.0.0.1:18120-&gt;80/tcp
web2 Created
web1 Up Less than a second
docker: Error response from daemon: Conflict. The container name "/web2" is already in use by container "a55c56017a…". You have to remove (or rename) that container to be able to reuse that name.</div>
<p>Read it slowly. The failed <code>run -d</code> printed a container ID <em>first</em> — the container was created, then networking failed — so <code>web2</code> now sits in <code>Created</code>. Fix the port, press ↑ and Enter, and you get the <em>second</em> error, a name conflict, which looks like a new problem and is just the leftover of the first. <code>docker rm web2</code> before retrying, or use <code>--rm</code>.</p>
<p>When the port is held by something that is not Docker (here a <code>python3 -m http.server</code> on the course's Linux machine), the message changes and <code>docker ps</code> finds nothing, so ask the operating system:</p>
<pre><code class="language-bash">docker run -d --name web3 -p 127.0.0.1:18122:80 nginx:1.27-alpine
ss -lntp "sport = :18122" | tail -1          <span class="tok-comment"># Linux</span>
lsof -nP -iTCP:18122 -sTCP:LISTEN            <span class="tok-comment"># macOS</span></code></pre>
<div class="out">docker: Error response from daemon: … failed to bind host port 127.0.0.1:18122/tcp: address already in use
LISTEN 0      5          127.0.0.1:18122      0.0.0.0:*    users:(("python3",pid=514366,fd=3))</div>
<p>On the Mac, Docker Desktop words the same case as <code>ports are not available: exposing port TCP 127.0.0.1:18121 … bind: address already in use</code>. And the course checked the opposite claim too: after <code>docker stop web1</code>, a new container published <code>18120</code> immediately — a stopped container holds no port.</p>
<table>
<tr><th>Piece of <code>-p</code></th><th>Meaning</th></tr>
<tr><td><code>127.0.0.1:</code></td><td>host address to listen on; omit it and Docker listens on every interface (reachable from the network)</td></tr>
<tr><td><code>18120</code></td><td>host port — the one that can be "already allocated"</td></tr>
<tr><td><code>:80</code></td><td>container port — two containers may both use 80 inside; only host ports collide</td></tr>
</table>
<h3>Mounts that fail, or silently do nothing</h3>
${slide('dk-12', 13, 'Hai kiểu hỏng im lặng: -v tạo thư mục rỗng, biến env thành chuỗi rỗng')}
<pre><code>docker run --rm --mount type=bind,src=/no/such/path,dst=/app alpine:3.20 true
docker run --rm -v /no/such/path:/app alpine:3.20 ls -la /app</code></pre>
<div class="out">docker: Error response from daemon: invalid mount config for type "bind":
bind source path does not exist: /no/such/path
total 0
drwxr-xr-x 2 root root 40 Aug 22 14:02 .</div>
<div class="callout warn"><strong>The two syntaxes behave differently, and the quiet one is worse.</strong> <code>--mount type=bind</code> refuses to start when the source is missing; <code>-v</code> silently creates an empty directory and carries on. A typo in a config path therefore gives you a container that starts perfectly and behaves as if the config file were empty — with no error anywhere. Use <code>--mount</code> in anything committed to a repository, and <code>-v</code> only when typing interactively.</div>

<h3>Environment that is not there</h3>
<pre><code>docker compose config | grep -E 'DATABASE_URL|image:' | head -3
docker compose up -d 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">WARN[0000] The "POSTGRES_PASSWORD" variable is not set. Defaulting to a blank string.
    image: ghcr.io/me/api:
    DATABASE_URL: postgresql://blog:@db:5432/blog
Error response from daemon: invalid reference format</div>
<p>Three failures from one missing variable: an image reference with an empty tag, a connection string with an empty password, and a warning nobody read. This is exactly what <code>&#36;{VAR:?message}</code> exists to prevent (Lesson 9.4) — it turns a blank string and three downstream mysteries into one clear error at <code>up</code>. And when a value is not what you expect, <code>docker compose config</code> shows you the truth in one command.</p>

<h3>Run it step by step: the silent failures, measured on Docker 29</h3>
<pre><code class="language-bash">docker run --rm --mount type=bind,src=$PWD/khong-co,dst=/app alpine:3.20 true
docker run --rm -v $PWD/khong-co:/app alpine:3.20 ls -la /app
ls -ld khong-co</code></pre>
<div class="out">docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /host_mnt/private/tmp/…/ch12/khong-co
total 4
drwxr-xr-x    2 root     root            64 Sep 23 19:26 .
drwxr-xr-x  2 admin  wheel  64 Sep 24 02:26 khong-co</div>
<p>On the Mac the path in the error starts with <code>/host_mnt</code> — that is where Docker Desktop's Linux VM sees your Mac's files, a useful clue when a bind mount behaves strangely. And <code>-v</code> really did create <code>khong-co</code> on the Mac, owned by you and empty. On the course's Linux machine the same <code>-v</code> created the directory <strong>owned by root</strong>, which a normal user then cannot even delete without <code>sudo</code> — one more reason to prefer <code>--mount</code> in anything committed.</p>
<p>The compose side, with Compose v5.5.1: a file that uses <code>image: node:&#36;{NODE_TAG}</code> and <code>postgresql://blog:&#36;{POSTGRES_PASSWORD}@db…</code>, run with neither variable set:</p>
<pre><code class="language-bash">docker compose config 2&gt;&amp;1 | grep -E 'warn|image:|DATABASE_URL'
docker compose up -d</code></pre>
<div class="out">time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"NODE_TAG\\" variable is not set. Defaulting to a blank string."
time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"POSTGRES_PASSWORD\\" variable is not set. Defaulting to a blank string."
      DATABASE_URL: postgresql://blog:@db:5432/blog
    image: 'node:'
unable to get image 'node:': Error response from daemon: invalid reference format</div>
<p>Newer Compose prints the warning as <code>level=warning msg=…</code> instead of the older <code>WARN[0000]</code> shown above — same meaning, different look, and just as easy to scroll past. Now make the variable required with <code>&#36;{NODE_TAG:?đặt NODE_TAG trong .env, vd 22-alpine}</code> and ask again:</p>
<pre><code class="language-bash">docker compose config</code></pre>
<div class="out">time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"POSTGRES_PASSWORD\\" variable is not set. Defaulting to a blank string."
error while interpolating services.api.image: required variable NODE_TAG is missing a value: đặt NODE_TAG trong .env, vd 22-alpine</div>
<table>
<tr><th>Syntax in compose</th><th>When the variable is unset</th></tr>
<tr><td><code>&#36;{VAR}</code></td><td>empty string + a warning — the silent failure</td></tr>
<tr><td><code>&#36;{VAR:-default}</code></td><td>uses <code>default</code> (also when set but empty)</td></tr>
<tr><td><code>&#36;{VAR:?message}</code></td><td>stops with <code>message</code> — use it for anything required</td></tr>
</table>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate on Windows pushed a new <code>entrypoint.sh</code> and a <code>compose.yaml</code> that reads the image tag from <code>.env</code>. On your Mac the stack no longer starts. Reproduce both breakages, diagnose each from its first error line, and fix them.</p><ol>
<li><code>mkdir -p ~/thu-docker/khong-len &amp;&amp; cd ~/thu-docker/khong-len</code>; create the CRLF <code>entrypoint.sh</code> and the three-line <code>Dockerfile</code> from "a CRLF shebang" above; <code>docker build -q -t thu-crlf:1 .</code> and <code>docker run --name thu-crlf thu-crlf:1; echo "exit=$?"</code>.</li>
<li>Prove what is wrong without guessing: <code>docker run --rm --entrypoint sh thu-crlf:1 -c 'head -1 /entrypoint.sh | od -c | head -1'</code>. Fix the line endings, rebuild as <code>thu-crlf:2</code>, run it with <code>-d --name thu-crlf2</code>, read <code>docker logs thu-crlf2</code>.</li>
<li>Write a <code>compose.yaml</code> with <code>name: thu-env</code> and one service <code>api</code> using <code>image: node:&#36;{NODE_TAG}</code> and <code>command: ["node","-e","console.log('api up')"]</code>. Run <code>docker compose up</code> with no <code>.env</code>, and read the warning and the error.</li>
<li>Change it to <code>&#36;{NODE_TAG:?set NODE_TAG in .env}</code>, run <code>docker compose config</code>, then create <code>.env</code> with <code>NODE_TAG=22-alpine</code> and run <code>docker compose up</code> again.</li>
<li>Clean up: <code>docker rm -f thu-crlf thu-crlf2; docker compose down; cd .. &amp;&amp; rm -rf khong-len</code>.</li></ol>
<p><strong>Done when:</strong> step 1 shows <code>no such file or directory</code> with <code>exit=255</code>, step 2 shows <code>\\r \\n</code> and then <code>api starting</code>; step 3 ends in <code>invalid reference format</code>, step 4 first stops with <code>required variable NODE_TAG is missing a value</code> and then prints <code>api up</code>; and nothing named <code>thu-</code> is left in <code>docker ps -a</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Manifest unknown / not found</span><span class="v">The registry has no image under that name and tag.</span></div>
  <div class="kv"><span class="k">Platform / architecture</span><span class="v"><code>linux/amd64</code> or <code>linux/arm64</code>: the CPU an image's binaries are built for.</span></div>
  <div class="kv"><span class="k">exec format error</span><span class="v">The kernel was asked to run a binary built for another architecture.</span></div>
  <div class="kv"><span class="k">Shebang</span><span class="v">The first line <code>#!/bin/sh</code> naming the interpreter; a trailing <code>\\r</code> (CRLF) breaks it.</span></div>
  <div class="kv"><span class="k">Publish (<code>-p host:container</code>)</span><span class="v">Forwarding a host port into a container; only host ports can collide.</span></div>
  <div class="kv"><span class="k">Bind mount source</span><span class="v">The host path in a bind mount; <code>-v</code> creates it silently, <code>--mount</code> refuses.</span></div>
  <div class="kv"><span class="k">Interpolation</span><span class="v">Compose replacing <code>&#36;{VAR}</code> with values from the shell or <code>.env</code> before anything runs.</span></div>
  <div class="kv"><span class="k"><code>.gitattributes</code></span><span class="v">A Git file that can force LF line endings for scripts on every OS.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nothing in this lesson reaches your code: the message is on the CLI's stderr (or the one line in <code>docker logs</code> for 255), never in your app log.</li>
<li>Read the last words of the error: <code>not found</code> tag, <code>denied</code> credentials, <code>no such host</code> DNS, <code>executable file not found</code> 127, <code>permission denied</code> 126.</li>
<li><code>no such file or directory</code> for a file that exists means its interpreter or loader is missing — CRLF shebang or glibc-in-musl.</li>
<li><code>exec format error</code> is architecture; the Mac hides it by emulating, so build with <code>--platform</code> of the machine that runs the image.</li>
<li><code>port is already allocated</code> is another running container, <code>address already in use</code> a non-Docker process; a failed run leaves a <code>Created</code> container behind.</li>
<li><code>-v</code> creates missing sources and <code>&#36;{VAR}</code> becomes empty — both silently; prefer <code>--mount</code> and <code>&#36;{VAR:?}</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">docker run reference</span><span class="lc-sub">Every flag, and — more useful here — the exact error text the daemon produces for each class of misconfiguration. Searchable when you have an error message and no idea which flag caused it.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Multi-platform builds</span><span class="lc-sub">The fix for <code>exec format error</code>: building for several architectures at once, how the image index works, and when emulation is worth the slowdown.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: ten containers that will not start</span><span class="lc-sub">Graded exercises: ten error messages, each from a real misconfiguration. Name the cause and the single command that fixes it, then verify.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> reading "executable file not found" as "my file is missing" and going to look for it. Half the time the file is right there and the message is about something else entirely: a shell script whose shebang line ends in <code>\\r</code>, so the kernel searches for an interpreter named <code>/bin/sh\\r</code>; or an exec-form <code>CMD</code> containing <code>$VAR</code>, where the literal dollar sign is treated as part of the program name; or a binary that exists but was compiled for a different architecture, which some runtimes report the same way. The diagnostic that separates all three takes one command: <code>docker run --rm --entrypoint sh &lt;image&gt; -c 'file /app/entrypoint.sh; command -v node'</code>. If <code>file</code> says "CRLF line terminators", you have found it without searching at all.</div>
<p class="note-ct"><strong>Three things to remember.</strong> If the container never started, <code>docker logs</code> is empty by design — the message is on stderr from the CLI, and <code>docker ps -a</code>'s <code>STATUS</code> column tells you <code>Created</code> versus <code>Exited</code>. <code>exec format error</code> means the wrong architecture, which a green build on a Mac will happily produce for an x86 server. And <code>-v</code> silently creates a missing bind source while <code>--mount type=bind</code> refuses — which is why anything committed to a repository should use <code>--mount</code>.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Nó không khởi động được</h2>
<p class="lead">Mọi thứ trong bài này xảy ra TRƯỚC khi mã của bạn chạy, và đó là lý do <code>docker logs</code> rỗng còn thông báo thật nằm ở stderr do CLI in ra. Mười triệu chứng, mỗi cái kèm đúng dòng lỗi bạn sẽ thấy và cách chữa.</p>

<h3>Không kéo được ảnh</h3>
${slide('dk-12', 8, 'Container không lên: đọc từ khoá trong dòng lỗi rồi rẽ nhánh')}
<pre><code>docker pull ghcr.io/me/api:9f2ac1e</code></pre>
<div class="out">Error response from daemon: denied: denied
Error response from daemon: manifest unknown: manifest unknown</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>denied</code> trên registry riêng</span><span class="v">Chưa đăng nhập, hoặc token thiếu quyền <code>read:packages</code>. Chạy <code>docker login ghcr.io -u &lt;user&gt;</code> với một PAT. Trên máy chủ, thông tin đăng nhập nằm trong <code>~/.docker/config.json</code> của người dùng chạy lượt deploy — thường là <code>root</code>, không phải bạn.</span></div>
  <div class="kv"><span class="k"><code>manifest unknown</code></span><span class="v">Cái nhãn đó không tồn tại. Thường là lỗi gõ, hoặc một việc CI đẩy ảnh thất bại trong khi bước deploy vẫn chạy. <code>docker buildx imagetools inspect</code> liệt kê cái gì thật sự tồn tại.</span></div>
  <div class="kv"><span class="k"><code>pull rate limit exceeded</code></span><span class="v">Giới hạn cho người ẩn danh của Docker Hub. Hãy đăng nhập dù chỉ bằng tài khoản miễn phí, tự soi gương những ảnh bạn phụ thuộc, hoặc chuyển sang GHCR.</span></div>
  <div class="kv"><span class="k"><code>no such host</code></span><span class="v">DNS hoặc lối ra mạng của máy chủ. Hãy thử bằng <code>curl -sSI https://ghcr.io/v2/</code> — nếu cái đó hỏng thì vấn đề là mạng, không phải Docker.</span></div>
</div>
<p>Câu chữ đã đổi từ Docker 29 và kho ảnh containerd, nên đây là ba kiểu kéo ảnh hỏng đúng như máy Mac của khoá học in ra hôm nay (09/2026, Engine 29.8) — hãy tìm những chữ CUỐI của mỗi dòng:</p>
<pre><code class="language-bash">docker pull alpine:9.99
docker pull ghcr.io/cuongthai-dk12-khong-co/api:1
docker pull registry.khong-co.invalid/api:1</code></pre>
<div class="out">Error response from daemon: failed to resolve reference "docker.io/library/alpine:9.99": docker.io/library/alpine:9.99: not found
Error response from daemon: error from registry: denied
denied
Error response from daemon: failed to resolve reference "registry.khong-co.invalid/api:1": … dial tcp: lookup registry.khong-co.invalid: no such host</div>
<p>Ba chữ cuối khác nhau, ba "chủ" khác nhau: <code>not found</code> là cái nhãn (việc của bạn), <code>denied</code> là thông tin đăng nhập — GHCR cố tình báo <code>denied</code> cho cả "bạn chưa đăng nhập" lẫn "gói này không tồn tại hoặc là gói riêng", để không làm lộ những gói riêng nào đang tồn tại — còn <code>no such host</code> là DNS của cái máy đang kéo ảnh, không phải Docker. <code>docker run</code> một nhãn không có thì in đúng câu đó sau dòng <code>Unable to find image 'alpine:9.99' locally</code>, và không container nào được tạo.</p>

<h3>exec format error</h3>
${slide('dk-12', 11, 'exec format error: ảnh arm64 từ Mac chạy trên máy amd64 — output thật')}
<pre><code>docker run --rm ghcr.io/me/api:9f2ac1e</code></pre>
<div class="out">exec /usr/local/bin/node: exec format error</div>
<pre><code>docker image inspect ghcr.io/me/api:9f2ac1e -f '{{ .Os }}/{{ .Architecture }}'
uname -m
docker buildx imagetools inspect ghcr.io/me/api:9f2ac1e | grep -A1 Platform | head -4</code></pre>
<div class="out">linux/arm64
x86_64
  Platform:    linux/amd64
  Platform:    linux/arm64</div>
<div class="callout warn"><strong>Một cái ảnh arm64 trên máy chủ amd64, hoặc ngược lại.</strong> Dựng trên máy Mac chạy Apple Silicon rồi deploy lên một con VPS x86 đẻ ra đúng chuyện này, và lượt dựng thì xanh hoàn toàn. Hãy chữa bằng cách dựng đa kiến trúc (<code>docker buildx build --platform linux/amd64,linux/arm64</code>) hoặc ghim đích (<code>--platform linux/amd64</code>) — Bài 3.4. Cái bẫy họ hàng thì tinh vi hơn: ĐÚNG kiến trúc nhưng SAI libc, khi đó nó khởi động rồi mới chết vì thiếu thư viện chia sẻ chứ không hỏng ngay ở bước exec (Bài 6.2).</div>
<p>Khoá học đã dựng lại đúng câu chuyện này bằng hai máy thật: một ảnh dựng trên Mac M1 không có <code>--platform</code>, chép sang máy Linux amd64 bằng <code>docker save | ssh … docker load</code> (không cần registry), rồi chạy ở đó:</p>
<pre><code class="language-bash"><span class="tok-comment"># Dockerfile: FROM node:22-alpine + CMD ["node","-e","console.log(process.arch)"]</span>
docker build -q -t api:mac .
docker save api:mac | ssh linux-nha docker load
ssh linux-nha docker run --name arch api:mac; echo "exit=$?"
ssh linux-nha docker image inspect api:mac -f '{{.Os}}/{{.Architecture}}'</code></pre>
<div class="out">Loaded image: api:mac
WARNING: The requested image's platform (linux/arm64) does not match the detected host platform (linux/amd64/v3) and no specific platform was requested
exec /usr/local/bin/docker-entrypoint.sh: exec format error
exit=255
linux/arm64</div>
<p>Ba chi tiết mà dòng lỗi một dòng che mất. Docker đã <strong>cảnh báo</strong> trước khi chạy — hãy đọc WARNING, nó thường là toàn bộ lời chẩn đoán. Mã thoát là <strong>255</strong> và container kết thúc ở <code>Exited</code>, không phải <code>Created</code>, vì cái hỏng xảy ra BÊN TRONG container lúc chạy tệp đầu tiên (<code>docker-entrypoint.sh</code>, mà trình thông dịch của nó là <code>/bin/sh</code> bản arm64). Và cách chữa là một cái cờ trên máy DỰNG:</p>
<pre><code class="language-bash">docker build -q --platform linux/amd64 -t api:amd64 .
docker save api:amd64 | ssh linux-nha docker load
ssh linux-nha docker run --rm api:amd64
docker run --rm api:amd64          <span class="tok-comment"># chạy lại trên Mac</span></code></pre>
<div class="out">Loaded image: api:amd64
x64
WARNING: The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8) and no specific platform was requested
x64</div>
<div class="callout warn"><strong>Máy Mac của bạn sẽ không bao giờ cho bạn thấy con bọ này.</strong> Docker Desktop giả lập amd64, nên ảnh amd64 vẫn chạy trên Mac (chậm hơn, kèm cảnh báo). Chiều ngược lại thì không đúng trên một máy chủ Linux thường: máy của khoá học không đăng ký bộ giả lập nào, nên ảnh arm64 đơn giản là không chạy được ở đó. Hãy dựng cho cái máy sẽ <em>CHẠY</em> ảnh, không phải cái máy dựng nó — và trong CI thì để runner dựng (nó vốn đã là amd64).</div>

<h3>executable file not found, và permission denied</h3>
${slide('dk-12', 9, '127 “không có lệnh” khác 126 “có mà không chạy được”')}
${slide('dk-12', 10, 'Shebang CRLF: file nằm đó mà vẫn “no such file or directory”')}
<pre><code>docker run --rm alpine:3.20 python
docker run --rm -v "$PWD/entrypoint.sh:/e.sh" alpine:3.20 /e.sh
docker run --rm gcr.io/distroless/nodejs22-debian12 sh</code></pre>
<div class="out">exec: "python": executable file not found in $PATH
exec: "/e.sh": permission denied
exec: "sh": executable file not found in $PATH</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Không có trong cái ảnh này</span><span class="lz-t">alpine không có python, distroless không có shell</span><span class="lz-d">Hãy kiểm bằng <code>docker run --rm --entrypoint sh &lt;ảnh&gt; -c 'command -v &lt;bin&gt;'</code>. Nếu cái ảnh cũng không có shell luôn thì bạn đã có câu trả lời.</span></div>
  <div class="lz-step"><span class="lz-k">Thiếu bit thực thi</span><span class="lz-t">chmod +x, và commit cả cái mode đó</span><span class="lz-d"><code>git update-index --chmod=+x entrypoint.sh</code> để nó giữ quyền chạy với mọi người. Một dòng <code>COPY --chmod=755</code> trong Dockerfile là cái đai an toàn thứ hai.</span></div>
  <div class="lz-step"><span class="lz-k">Ký tự xuống dòng kiểu CRLF</span><span class="lz-t">dòng shebang thành #!/bin/sh\\r</span><span class="lz-d">Nhân đi tìm một trình thông dịch tên đúng nghĩa đen là <code>sh\\r</code> rồi báo "không tìm thấy" cho một file rành rành đang ở đó. <code>file entrypoint.sh</code> nói "CRLF line terminators"; <code>dos2unix</code> hoặc một file <code>.gitattributes</code> với <code>*.sh text eol=lf</code> chữa được.</span></div>
  <div class="lz-step"><span class="lz-k">Dạng shell so với dạng exec</span><span class="lz-t">CMD node app.js so với CMD ["node","app.js"]</span><span class="lz-d">Dạng exec không khai triển shell, nên <code>CMD ["node", "$FILE"]</code> truyền đi chuỗi <code>$FILE</code> theo nghĩa đen. Nếu bạn cần một biến hay một ống dẫn thì bạn cần một cái shell (Bài 4.3).</span></div>
</div>

<h3>Chạy thử từng bước: shebang CRLF, và vì sao nó báo "no such file"</h3>
<p>Phiên bản kinh điển trong đồ án nhóm: một bạn dùng Windows sửa <code>entrypoint.sh</code>, Git (hoặc trình soạn thảo) lưu nó với ký tự xuống dòng kiểu Windows, và lượt build sau đó xanh trong khi container không chịu khởi động. Hãy dựng lại trong <code>~/thu-docker/crlf</code>:</p>
<pre><code class="language-bash">printf '#!/bin/sh\\r\\necho "api starting"\\r\\nexec sleep 600\\r\\n' &gt; entrypoint.sh
printf 'FROM alpine:3.20\\nCOPY --chmod=755 entrypoint.sh /entrypoint.sh\\nENTRYPOINT ["/entrypoint.sh"]\\n' &gt; Dockerfile
file entrypoint.sh
docker build -q -t crlf:1 . &amp;&amp; echo "build ✓"
docker run --name crlf crlf:1; echo "exit=$?"
docker run --rm --entrypoint sh crlf:1 -c 'ls -l /entrypoint.sh; head -1 /entrypoint.sh | od -c | head -1'</code></pre>
<div class="out">entrypoint.sh: POSIX shell script text executable, ASCII text, with CRLF line terminators
build ✓
exec /entrypoint.sh: no such file or directory
exit=255
-rwxr-xr-x    1 root     root            48 Sep 23 19:30 /entrypoint.sh
0000000   #   !   /   b   i   n   /   s   h  \\r  \\n</div>
<p>Output thật trên máy Mac của khoá học; máy Linux của khoá học in đúng dòng lỗi và mã thoát y hệt. Đọc bằng chứng theo thứ tự: file có tồn tại và có quyền chạy (<code>-rwxr-xr-x</code>, nhờ <code>COPY --chmod=755</code>), vậy mà nhân báo "no such file". Dòng <code>od -c</code> cho thấy vì sao — dòng đầu kết thúc bằng <code>\\r \\n</code>, nên trình thông dịch mà nhân đi tìm có tên đúng nghĩa đen là <code>/bin/sh\\r</code>, thứ không hề tồn tại. Thông báo nói về <em>TRÌNH THÔNG DỊCH</em>, không phải script của bạn. Chữa và kiểm lại:</p>
<pre><code class="language-bash">sed -i '' $'s/\\r$//' entrypoint.sh      <span class="tok-comment"># sed của macOS; trên Linux: sed -i 's/\\r$//' entrypoint.sh</span>
file entrypoint.sh
docker build -q -t crlf:2 . &gt;/dev/null &amp;&amp; docker run -d --name crlf2 crlf:2 &amp;&amp; sleep 1 &amp;&amp; docker logs crlf2
docker rm -f crlf crlf2</code></pre>
<div class="out">entrypoint.sh: POSIX shell script text executable, ASCII text
api starting</div>
<div class="callout ok"><strong>Chặn tận gốc, một lần, cho cả nhóm:</strong> commit một file <code>.gitattributes</code> có dòng <code>*.sh text eol=lf</code>. Từ đó Git luôn lấy script shell ra với LF trên mọi máy, kể cả Windows. (Script kết thúc bằng <code>exec sleep 600</code> nên nó đứng yên chạy mãi; vì thế bản đã sửa được chạy với <code>-d</code> và xoá ở cuối.)</div>
<table>
<tr><th>Chữ trong lỗi</th><th>Mã / STATUS</th><th>Thật ra sai ở đâu</th></tr>
<tr><td><code>executable file not found in $PATH</code></td><td>127 · Created</td><td>ảnh này không có chương trình tên đó (gõ sai, sai ảnh nền, distroless không có <code>sh</code>)</td></tr>
<tr><td><code>permission denied</code></td><td>126 · Created</td><td>file có đó nhưng thiếu <code>+x</code>, hoặc nó là thư mục</td></tr>
<tr><td><code>is a directory: permission denied</code></td><td>126 · Created</td><td>bạn đưa một thư mục làm câu lệnh (<code>docker run alpine /etc</code>)</td></tr>
<tr><td><code>exec …: no such file or directory</code></td><td>255 · Exited</td><td>file có, nhưng <em>trình thông dịch hoặc loader</em> của nó thì không: shebang CRLF, hoặc binary glibc trong ảnh musl (Bài 12.4)</td></tr>
<tr><td><code>exec …: exec format error</code></td><td>255 · Exited</td><td>dựng cho kiến trúc CPU khác</td></tr>
</table>
<h3>Trùng cổng và trùng tên</h3>
${slide('dk-12', 12, 'Cổng bận: hai câu báo lỗi, hai thủ phạm khác nhau')}
<pre><code>docker run -d -p 8080:80 --name web nginx:alpine</code></pre>
<div class="out">docker: Error response from daemon: driver failed programming external connectivity:
failed to bind host port for 0.0.0.0:8080: address already in use
docker: Error response from daemon: Conflict. The container name "/web" is already in use
by container "a91c4e7b2f60". You have to remove (or rename) that container.</div>
<pre><code>ss -lntp 'sport = :8080' | tail -1
docker ps -a --filter name='^/web$' --format '{{.ID}} {{.Status}}'
docker rm -f web  &amp;&amp;  docker run -d -p 8080:80 --name web nginx:alpine &gt;/dev/null &amp;&amp; echo ok</code></pre>
<div class="out">LISTEN 0 4096 0.0.0.0:8080 0.0.0.0:* users:(("docker-proxy",pid=4471,fd=4))
a91c4e7b2f60 Exited (0) 2 hours ago
ok</div>
<p>Cả hai lỗi đều gọi tên thủ phạm rất chính xác, chuyện hiếm và đáng trân trọng. Trường hợp cổng là một container khác <em>ĐANG CHẠY</em> (khi đó Docker báo <code>port is already allocated</code>) hoặc một tiến trình ngoài Docker như một dev server lạc (<code>address already in use</code>) — container đã DỪNG thì nhả cổng ra rồi, nên nó không bao giờ là thủ phạm ở đây (sửa 09/2026, đo thật ở dưới); trường hợp tên là một container ở trạng thái <code>Exited</code> mà <code>docker ps</code> (không có <code>-a</code>) không hiện cho bạn thấy.</p>

<h3>Chạy thử từng bước: cả hai câu báo cổng bận, và container mà lần run hỏng bỏ lại</h3>
<p>Đo thật trên máy của khoá học, luôn công bố trên <code>127.0.0.1</code> để không lộ gì ra mạng trong lúc thử:</p>
<pre><code class="language-bash">docker run -d --name web1 -p 127.0.0.1:18120:80 nginx:1.27-alpine
docker run -d --name web2 -p 127.0.0.1:18120:80 nginx:1.27-alpine
docker ps --filter publish=18120 --format '{{.Names}} {{.Ports}}'
docker ps -a --filter name=web --format '{{.Names}} {{.Status}}'
docker run -d --name web2 nginx:1.27-alpine</code></pre>
<div class="out">a55c56017af25f126853b140b8bc1d6197ca53678d2285597ecf0007fa54
docker: Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint web2 (…): Bind for 127.0.0.1:18120 failed: port is already allocated
web1 127.0.0.1:18120-&gt;80/tcp
web2 Created
web1 Up Less than a second
docker: Error response from daemon: Conflict. The container name "/web2" is already in use by container "a55c56017a…". You have to remove (or rename) that container to be able to reuse that name.</div>
<p>Đọc chậm thôi. Lệnh <code>run -d</code> hỏng in ra một ID container <em>TRƯỚC</em> — container đã được tạo, rồi phần mạng mới hỏng — nên <code>web2</code> giờ nằm ở <code>Created</code>. Sửa cổng, bấm ↑ rồi Enter, và bạn gặp lỗi <em>THỨ HAI</em>, trùng tên, trông như một vấn đề mới mà thật ra chỉ là đồ bỏ lại của lỗi thứ nhất. Hãy <code>docker rm web2</code> trước khi thử lại, hoặc dùng <code>--rm</code>.</p>
<p>Khi cổng bị một thứ KHÔNG phải Docker giữ (ở đây là <code>python3 -m http.server</code> trên máy Linux của khoá học), câu báo lỗi đổi đi và <code>docker ps</code> không tìm thấy gì, nên hãy hỏi hệ điều hành:</p>
<pre><code class="language-bash">docker run -d --name web3 -p 127.0.0.1:18122:80 nginx:1.27-alpine
ss -lntp "sport = :18122" | tail -1          <span class="tok-comment"># Linux</span>
lsof -nP -iTCP:18122 -sTCP:LISTEN            <span class="tok-comment"># macOS</span></code></pre>
<div class="out">docker: Error response from daemon: … failed to bind host port 127.0.0.1:18122/tcp: address already in use
LISTEN 0      5          127.0.0.1:18122      0.0.0.0:*    users:(("python3",pid=514366,fd=3))</div>
<p>Trên Mac, Docker Desktop diễn đạt cùng trường hợp đó thành <code>ports are not available: exposing port TCP 127.0.0.1:18121 … bind: address already in use</code>. Và khoá học cũng kiểm cả chiều ngược lại: sau <code>docker stop web1</code>, một container mới công bố <code>18120</code> được ngay — container đã dừng không giữ cổng nào.</p>
<table>
<tr><th>Mảnh của <code>-p</code></th><th>Nghĩa</th></tr>
<tr><td><code>127.0.0.1:</code></td><td>địa chỉ máy chủ để lắng nghe; bỏ đi thì Docker nghe trên MỌI giao diện mạng (máy khác với tới được)</td></tr>
<tr><td><code>18120</code></td><td>cổng máy chủ — cái có thể bị "already allocated"</td></tr>
<tr><td><code>:80</code></td><td>cổng trong container — hai container cùng dùng 80 bên trong được; chỉ cổng máy chủ mới đụng nhau</td></tr>
</table>
<h3>Phép gắn hỏng, hoặc lặng lẽ không làm gì</h3>
${slide('dk-12', 13, 'Hai kiểu hỏng im lặng: -v tạo thư mục rỗng, biến env thành chuỗi rỗng')}
<pre><code>docker run --rm --mount type=bind,src=/no/such/path,dst=/app alpine:3.20 true
docker run --rm -v /no/such/path:/app alpine:3.20 ls -la /app</code></pre>
<div class="out">docker: Error response from daemon: invalid mount config for type "bind":
bind source path does not exist: /no/such/path
total 0
drwxr-xr-x 2 root root 40 Aug 22 14:02 .</div>
<div class="callout warn"><strong>Hai cú pháp hành xử khác nhau, và cái im lặng mới là cái tệ hơn.</strong> <code>--mount type=bind</code> từ chối khởi động khi nguồn không tồn tại; <code>-v</code> lặng lẽ tạo một thư mục rỗng rồi đi tiếp. Nên một lỗi gõ trong đường dẫn cấu hình cho bạn một container khởi động hoàn hảo và hành xử y như thể file cấu hình rỗng — mà không có lỗi ở đâu cả. Hãy dùng <code>--mount</code> trong mọi thứ commit vào kho, và chỉ dùng <code>-v</code> khi gõ tay.</div>

<h3>Môi trường không có ở đó</h3>
<pre><code>docker compose config | grep -E 'DATABASE_URL|image:' | head -3
docker compose up -d 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">WARN[0000] The "POSTGRES_PASSWORD" variable is not set. Defaulting to a blank string.
    image: ghcr.io/me/api:
    DATABASE_URL: postgresql://blog:@db:5432/blog
Error response from daemon: invalid reference format</div>
<p>Ba cái hỏng từ một biến bị thiếu: một tham chiếu ảnh với nhãn rỗng, một chuỗi kết nối với mật khẩu rỗng, và một cảnh báo không ai đọc. Đây đúng là thứ <code>&#36;{VAR:?thông báo}</code> sinh ra để ngăn (Bài 9.4) — nó biến một chuỗi rỗng cùng ba bí ẩn phía sau thành một lỗi rõ ràng ngay lúc <code>up</code>. Và khi một giá trị không đúng như bạn nghĩ, <code>docker compose config</code> cho bạn thấy sự thật trong một câu lệnh.</p>

<h3>Chạy thử từng bước: những cái hỏng im lặng, đo trên Docker 29</h3>
<pre><code class="language-bash">docker run --rm --mount type=bind,src=$PWD/khong-co,dst=/app alpine:3.20 true
docker run --rm -v $PWD/khong-co:/app alpine:3.20 ls -la /app
ls -ld khong-co</code></pre>
<div class="out">docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /host_mnt/private/tmp/…/ch12/khong-co
total 4
drwxr-xr-x    2 root     root            64 Sep 23 19:26 .
drwxr-xr-x  2 admin  wheel  64 Sep 24 02:26 khong-co</div>
<p>Trên Mac, đường dẫn trong lỗi bắt đầu bằng <code>/host_mnt</code> — đó là chỗ máy ảo Linux của Docker Desktop nhìn thấy file của Mac, một manh mối có ích khi bind mount cư xử lạ. Và <code>-v</code> đã THẬT SỰ tạo ra <code>khong-co</code> trên Mac, do bạn sở hữu và rỗng. Trên máy Linux của khoá học, cùng lệnh <code>-v</code> đó tạo thư mục <strong>thuộc root</strong>, thứ mà người dùng thường thậm chí không xoá được nếu không có <code>sudo</code> — thêm một lý do để dùng <code>--mount</code> trong mọi thứ được commit.</p>
<p>Phía compose, với Compose v5.5.1: một file dùng <code>image: node:&#36;{NODE_TAG}</code> và <code>postgresql://blog:&#36;{POSTGRES_PASSWORD}@db…</code>, chạy khi cả hai biến đều chưa đặt:</p>
<pre><code class="language-bash">docker compose config 2&gt;&amp;1 | grep -E 'warn|image:|DATABASE_URL'
docker compose up -d</code></pre>
<div class="out">time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"NODE_TAG\\" variable is not set. Defaulting to a blank string."
time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"POSTGRES_PASSWORD\\" variable is not set. Defaulting to a blank string."
      DATABASE_URL: postgresql://blog:@db:5432/blog
    image: 'node:'
unable to get image 'node:': Error response from daemon: invalid reference format</div>
<p>Compose bản mới in cảnh báo dạng <code>level=warning msg=…</code> thay cho <code>WARN[0000]</code> cũ ở trên — cùng nghĩa, khác hình thức, và cũng dễ cuộn qua y như vậy. Giờ biến nó thành biến bắt buộc với <code>&#36;{NODE_TAG:?đặt NODE_TAG trong .env, vd 22-alpine}</code> rồi hỏi lại:</p>
<pre><code class="language-bash">docker compose config</code></pre>
<div class="out">time="2026-09-24T02:27:20+07:00" level=warning msg="The \\"POSTGRES_PASSWORD\\" variable is not set. Defaulting to a blank string."
error while interpolating services.api.image: required variable NODE_TAG is missing a value: đặt NODE_TAG trong .env, vd 22-alpine</div>
<table>
<tr><th>Cú pháp trong compose</th><th>Khi biến chưa đặt</th></tr>
<tr><td><code>&#36;{VAR}</code></td><td>chuỗi rỗng + một cảnh báo — cái hỏng im lặng</td></tr>
<tr><td><code>&#36;{VAR:-mặc_định}</code></td><td>dùng <code>mặc_định</code> (kể cả khi đặt mà rỗng)</td></tr>
<tr><td><code>&#36;{VAR:?thông báo}</code></td><td>dừng lại với <code>thông báo</code> — dùng cho mọi thứ bắt buộc</td></tr>
</table>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm dùng Windows vừa đẩy lên <code>entrypoint.sh</code> mới và một <code>compose.yaml</code> đọc nhãn ảnh từ <code>.env</code>. Trên Mac của bạn stack không lên nữa. Hãy dựng lại cả hai kiểu hỏng, chẩn đoán từng cái từ dòng lỗi đầu tiên, rồi sửa.</p><ol>
<li><code>mkdir -p ~/thu-docker/khong-len &amp;&amp; cd ~/thu-docker/khong-len</code>; tạo <code>entrypoint.sh</code> kiểu CRLF và <code>Dockerfile</code> ba dòng ở mục "shebang CRLF" phía trên; <code>docker build -q -t thu-crlf:1 .</code> rồi <code>docker run --name thu-crlf thu-crlf:1; echo "exit=$?"</code>.</li>
<li>Chứng minh sai ở đâu, không đoán: <code>docker run --rm --entrypoint sh thu-crlf:1 -c 'head -1 /entrypoint.sh | od -c | head -1'</code>. Sửa ký tự xuống dòng, dựng lại thành <code>thu-crlf:2</code>, chạy với <code>-d --name thu-crlf2</code>, đọc <code>docker logs thu-crlf2</code>.</li>
<li>Viết một <code>compose.yaml</code> có <code>name: thu-env</code> và một service <code>api</code> dùng <code>image: node:&#36;{NODE_TAG}</code> cùng <code>command: ["node","-e","console.log('api up')"]</code>. Chạy <code>docker compose up</code> khi CHƯA có <code>.env</code>, đọc cảnh báo và lỗi.</li>
<li>Đổi thành <code>&#36;{NODE_TAG:?đặt NODE_TAG trong .env}</code>, chạy <code>docker compose config</code>, rồi tạo <code>.env</code> với <code>NODE_TAG=22-alpine</code> và chạy lại <code>docker compose up</code>.</li>
<li>Dọn: <code>docker rm -f thu-crlf thu-crlf2; docker compose down; cd .. &amp;&amp; rm -rf khong-len</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 1 hiện <code>no such file or directory</code> kèm <code>exit=255</code>, bước 2 hiện <code>\\r \\n</code> rồi <code>api starting</code>; bước 3 kết thúc bằng <code>invalid reference format</code>, bước 4 lúc đầu dừng với <code>required variable NODE_TAG is missing a value</code> rồi in <code>api up</code>; và <code>docker ps -a</code> không còn gì tên <code>thu-</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Manifest unknown / not found (không có ảnh)</span><span class="v">Registry không có ảnh nào mang tên và nhãn đó.</span></div>
  <div class="kv"><span class="k">Platform / architecture (nền tảng / kiến trúc)</span><span class="v"><code>linux/amd64</code> hay <code>linux/arm64</code>: loại CPU mà các tệp chạy trong ảnh được dựng cho.</span></div>
  <div class="kv"><span class="k">exec format error (sai định dạng tệp chạy)</span><span class="v">Nhân được yêu cầu chạy một tệp dựng cho kiến trúc khác.</span></div>
  <div class="kv"><span class="k">Shebang (dòng chỉ trình thông dịch)</span><span class="v">Dòng đầu <code>#!/bin/sh</code> gọi tên trình thông dịch; thêm <code>\\r</code> (CRLF) ở cuối là hỏng.</span></div>
  <div class="kv"><span class="k">Publish (công bố cổng, <code>-p máy:container</code>)</span><span class="v">Chuyển một cổng máy chủ vào container; chỉ cổng máy chủ mới đụng nhau.</span></div>
  <div class="kv"><span class="k">Bind mount source (nguồn của bind mount)</span><span class="v">Đường dẫn máy chủ trong bind mount; <code>-v</code> lặng lẽ tạo nó, <code>--mount</code> từ chối.</span></div>
  <div class="kv"><span class="k">Interpolation (thay biến)</span><span class="v">Compose thay <code>&#36;{VAR}</code> bằng giá trị từ shell hoặc <code>.env</code> trước khi chạy bất cứ gì.</span></div>
  <div class="kv"><span class="k"><code>.gitattributes</code> (thuộc tính file của Git)</span><span class="v">File của Git có thể ép script dùng xuống dòng LF trên mọi hệ điều hành.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi thứ trong bài này đều chưa chạm tới mã của bạn: thông báo nằm ở stderr của CLI (hoặc đúng một dòng trong <code>docker logs</code> với mã 255), không bao giờ ở log ứng dụng.</li>
<li>Đọc những chữ cuối của lỗi: <code>not found</code> là nhãn, <code>denied</code> là đăng nhập, <code>no such host</code> là DNS, <code>executable file not found</code> là 127, <code>permission denied</code> là 126.</li>
<li><code>no such file or directory</code> cho một file đang tồn tại nghĩa là thiếu trình thông dịch hoặc loader của nó — shebang CRLF hoặc glibc trong ảnh musl.</li>
<li><code>exec format error</code> là kiến trúc; Mac che nó đi bằng giả lập, nên hãy dựng với <code>--platform</code> của máy sẽ chạy ảnh.</li>
<li><code>port is already allocated</code> là container khác đang chạy, <code>address already in use</code> là tiến trình ngoài Docker; lần run hỏng để lại một container <code>Created</code>.</li>
<li><code>-v</code> tạo nguồn còn thiếu và <code>&#36;{VAR}</code> thành chuỗi rỗng — đều im lặng; hãy dùng <code>--mount</code> và <code>&#36;{VAR:?}</code>.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/run/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Tra cứu docker run</span><span class="lc-sub">Mọi cái cờ, và — hữu ích hơn ở đây — đúng dòng lỗi mà daemon sinh ra cho từng nhóm cấu hình sai. Tra được khi bạn có một thông báo lỗi mà không biết cờ nào gây ra.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/multi-platform/" target="_blank" rel="noopener">
  <span class="lc-ico">🏗️</span>
  <span class="lc-body"><span class="lc-title">Dựng đa nền tảng</span><span class="lc-sub">Cách chữa cho <code>exec format error</code>: dựng cho nhiều kiến trúc cùng lúc, chỉ mục ảnh hoạt động ra sao, và khi nào việc giả lập đáng để chịu chậm.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: mười container không khởi động được</span><span class="lc-sub">Bài chấm điểm: mười thông báo lỗi, mỗi cái từ một cấu hình sai có thật. Hãy gọi tên nguyên nhân và đúng một câu lệnh chữa được nó, rồi kiểm lại.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đọc "executable file not found" thành "file của tôi bị thiếu" rồi đi tìm nó. Một nửa số lần thì cái file nằm ngay đó và thông báo nói về chuyện hoàn toàn khác: một script shell có dòng shebang kết thúc bằng <code>\\r</code>, nên nhân đi tìm một trình thông dịch tên <code>/bin/sh\\r</code>; hoặc một <code>CMD</code> dạng exec chứa <code>$VAR</code>, ở đó dấu đô la theo nghĩa đen bị coi là một phần của tên chương trình; hoặc một tệp nhị phân có tồn tại nhưng được biên dịch cho kiến trúc khác, thứ mà vài bộ chạy báo cáo y hệt như vậy. Phép chẩn đoán tách được cả ba chỉ mất một câu lệnh: <code>docker run --rm --entrypoint sh &lt;ảnh&gt; -c 'file /app/entrypoint.sh; command -v node'</code>. Nếu <code>file</code> nói "CRLF line terminators" thì bạn đã tìm ra mà không cần tìm gì cả.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Nếu container chưa từng khởi động thì <code>docker logs</code> rỗng là đúng thiết kế — thông báo nằm ở stderr do CLI in ra, và cột <code>STATUS</code> của <code>docker ps -a</code> cho bạn biết là <code>Created</code> hay <code>Exited</code>. <code>exec format error</code> nghĩa là sai kiến trúc, thứ mà một lượt dựng xanh trên máy Mac sẽ vui vẻ tạo ra cho một máy chủ x86. Và <code>-v</code> lặng lẽ tạo ra nguồn bind bị thiếu trong khi <code>--mount type=bind</code> từ chối — nên mọi thứ commit vào kho đều nên dùng <code>--mount</code>.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — It starts, then dies|||12.3 — Nó khởi động, rồi chết',
      slug: 'dk-12-3-khoi-dong-roi-chet',
      type: 'LESSON',
      description: 'Vòng lặp sập và cách đọc chúng, container thoát 0 ngay lập tức, OOM, healthcheck đánh dấu sai, container treo khi dừng, và cách giữ một container đủ lâu để soi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>It starts, then dies</h2>
<p class="lead">This is layer 3 and layer 4 territory: the image is fine, the configuration is fine, and something goes wrong once the process is actually running. The good news is that the container had a chance to speak — so unlike the last lesson, the logs usually contain the answer.</p>

<h3>Reading a crash loop</h3>
${slide('dk-12', 14, 'Lên rồi chết: hỏi mã thoát trước, đọc log sau')}
${slide('dk-12', 15, 'Vòng lặp restart: Docker chờ gấp đôi mỗi lần (đo thật)')}
<pre><code>docker compose ps --format 'table {{.Service}}\\t{{.Status}}'
docker inspect -f 'exit={{ .State.ExitCode }} oom={{ .State.OOMKilled }} n={{ .RestartCount }} since={{ .State.StartedAt }}' blog-api-1
docker logs --tail 20 --timestamps blog-api-1 | tail -6</code></pre>
<div class="out">SERVICE   STATUS
api       Restarting (1) 4 seconds ago
db        Up 20 minutes (healthy)
exit=1 oom=false n=17 since=2026-08-22T14:22:08Z
2026-08-22T14:22:08.9Z Error: connect ECONNREFUSED 172.19.0.5:6379
2026-08-22T14:22:08.9Z     at TCPConnectWrap.afterConnect [as oncomplete]</div>
<div class="callout ok"><strong><code>--timestamps</code> is what makes a crash loop readable.</strong> Without it, seventeen attempts produce seventeen identical error blocks and you cannot tell which is current — or whether the error even changed at some point. With timestamps you can see the loop's period, spot the attempt where the message differed, and confirm you are reading the newest one. Pair it with <code>--since 2m</code> to cut away the history entirely.</div>

<h3>Run it step by step: a real crash loop, from STATUS to cause</h3>
<p>The course built a two-service stack — <code>api</code> (Node, connects to Redis at start-up, exits 1 if it cannot) and <code>cache</code> (Redis) — with <code>restart: unless-stopped</code> on the API and no <code>depends_on</code>. Then it started only the API: <code>docker compose up -d api</code>. Everything below is real output (Mac, Compose v5.5.1).</p>
<pre><code class="language-bash">docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
docker inspect -f 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}' blog-api-1
docker compose logs --timestamps --tail 4 api</code></pre>
<div class="out">SERVICE   STATUS
api       Restarting (1) 1 second ago
exit=1 oom=false restarts=7
api-1  | 2026-09-23T19:27:33.111308421Z 2026-09-23T19:27:33.109Z boot: connecting to cache:6379
api-1  | 2026-09-23T19:27:33.121498379Z Error: ENOTFOUND getaddrinfo ENOTFOUND cache
api-1  | 2026-09-23T19:27:36.426613339Z 2026-09-23T19:27:36.424Z boot: connecting to cache:6379
api-1  | 2026-09-23T19:27:36.436421005Z Error: ENOTFOUND getaddrinfo ENOTFOUND cache</div>
<ol>
<li><strong>STATUS</strong> <code>Restarting (1)</code>: the code runs, dies with 1, and is brought back. Layer 3 or 4.</li>
<li><strong>inspect</strong> <code>oom=false</code>, seven restarts in eight seconds: not a kill — the program chose to exit.</li>
<li><strong>logs</strong>: two timestamps per line — Docker's (from <code>--timestamps</code>) and the app's own. <code>ENOTFOUND</code> is a DNS answer: there is no container called <code>cache</code> on this network. <code>ECONNREFUSED</code> would have meant "the name exists, nobody listens on that port" — a different fix.</li>
</ol>
<p>How long does Docker wait between attempts? The course measured it with a container that only prints the time and exits 1 (<code>docker run -d --restart on-failure alpine:3.20 sh -c 'date +%T; exit 1'</code>) and read the start times back from <code>docker logs -t</code>:</p>
<div class="out">19:23:55
19:23:56
19:23:56
19:23:56
19:23:57
19:23:59
19:24:02
19:24:09
19:24:22</div>
<p>The gaps double: about 0.1 s, 0.2, 0.4, 0.8, 1.6, 3.3, 6.5, 12.9 s … (the documented behaviour is a delay that doubles from 100 ms, up to a maximum, and resets after the container stays up for 10 seconds). Two practical consequences: the <em>first</em> failures are packed into the first few seconds of the log, and after a few minutes a container that "keeps restarting" is actually down most of the time, waiting. <code>docker events --filter container=&lt;name&gt;</code> shows each cycle as a pair of <code>start</code> / <code>die exitCode=1</code> events if you want to watch it live.</p>
<p>Now reproduce the failure with your hands on the keyboard instead of reading logs — same image, same environment, same network, a shell instead of the command, and <code>--no-deps</code> so Compose does not start anything for you:</p>
<pre><code class="language-bash">docker compose run --rm --no-deps --entrypoint sh api -c \\
  'echo "REDIS_HOST=$REDIS_HOST"; getent hosts cache || echo "cache: không phân giải được"; node server.js'</code></pre>
<div class="out"> Container blog-api-run-fe6f620d5fcc Creating
 Container blog-api-run-fe6f620d5fcc Created
REDIS_HOST=cache
cache: không phân giải được
2026-09-23T19:27:37.869Z boot: connecting to cache:6379
Error: ENOTFOUND getaddrinfo ENOTFOUND cache</div>
<p>The environment variable is right; the name does not resolve; the cause is that <code>cache</code> is not running. Start it and watch the loop heal itself on the next attempt:</p>
<pre><code class="language-bash">docker compose up -d cache; sleep 15
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'
docker compose logs --tail 2 api</code></pre>
<div class="out">SERVICE   STATUS
api       Up 2 seconds
cache     Up 15 seconds
api-1  | 2026-09-23T19:27:55.857Z boot: connecting to cache:6379
api-1  | redis ok, listening on 3000</div>
<table>
<tr><th>Flag of <code>compose run</code></th><th>What it does here</th></tr>
<tr><td><code>--rm</code></td><td>remove the one-off container afterwards (leave it off if you want to <code>docker cp</code> from it after it dies)</td></tr>
<tr><td><code>--no-deps</code></td><td>do not start the services in <code>depends_on</code> — you see the failure exactly as the loop does</td></tr>
<tr><td><code>--entrypoint sh</code></td><td>replace the image's entrypoint with a shell</td></tr>
<tr><td><code>-c '…'</code></td><td>what the shell runs: checks first, then the real command</td></tr>
<tr><td><code>--service-ports</code></td><td>(not used) publish the service's ports too — off by default, so a one-off never fights the real service for a port</td></tr>
</table>
<div class="callout ok"><strong>The fix is not <code>restart</code> and not <code>sleep</code>.</strong> The API healed only because <code>cache</code> appeared. In the compose file the durable fix is <code>depends_on: { cache: { condition: service_healthy } }</code> plus a healthcheck on <code>cache</code> (Chapter 10), and in the app a retry with backoff — so that a Redis restart at 3 a.m. does not become a loop.</div>

<h3>The container exits 0 immediately</h3>
${slide('dk-12', 16, 'Exit 0 ngay lập tức: tiến trình đã tự chạy nền')}
<pre><code>docker run -d --name quiet nginx:alpine nginx
docker ps -a --filter name=quiet --format '{{.Status}}'
docker logs quiet</code></pre>
<div class="out">Exited (0) 2 seconds ago</div>
<div class="callout warn"><strong>Correction (September 2026): the log of <code>quiet</code> is not empty.</strong> The block above implies it is; re-run on Docker 29.8 with <code>nginx:1.27-alpine</code>, <code>docker logs</code> printed the whole start-up — and the last lines are the clue:</div>
<pre><code class="language-bash">docker logs quiet | tail -5</code></pre>
<div class="out">2026/09/23 19:23:56 [notice] 1#1: OS: Linux 7.0.12-linuxkit
2026/09/23 19:23:56 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2026/09/23 19:23:56 [notice] 30#30: start worker processes
2026/09/23 19:23:56 [notice] 30#30: start worker process 31
2026/09/23 19:23:56 [notice] 30#30: start worker process 32</div>
<p>nginx writes <code>PID#TID</code> in front of every line. The first lines come from process <strong>1</strong>; then they come from process <strong>30</strong>. That is the daemonising in action: PID 1 forked a background master (30) and exited, the container's life ended with PID 1, and the background master died with it a moment later. When a log looks healthy but the container is <code>Exited (0)</code>, look for exactly this change of PID.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The process daemonised</span><span class="lz-t">nginx without -g "daemon off;"</span><span class="lz-d">It forked into the background and PID 1 exited, so Docker considers the container finished. Foreground mode is mandatory: <code>nginx -g "daemon off;"</code>, <code>postgres</code> not <code>pg_ctl start</code>, <code>redis-server</code> not <code>--daemonize yes</code>.</span></div>
  <div class="lz-step"><span class="lz-k">The command genuinely finished</span><span class="lz-t">a one-shot where you meant a server</span><span class="lz-d"><code>CMD ["npm", "run", "build"]</code> in a service definition. Exit 0 is correct behaviour; the mistake is calling it a service.</span></div>
  <div class="lz-step"><span class="lz-k">No TTY and it wanted one</span><span class="lz-t">an interactive shell with no -it</span><span class="lz-d"><code>docker run -d alpine sh</code> exits instantly because stdin is closed. Add <code>-it</code>, or give it something to do.</span></div>
  <div class="lz-step"><span class="lz-k">A wrapper swallowed the real command</span><span class="lz-t">ENTRYPOINT plus CMD combining wrongly</span><span class="lz-d"><code>docker inspect -f '{{ .Config.Entrypoint }} {{ .Config.Cmd }}'</code> shows exactly what was executed (Lesson 4.3). Frequently not what the Dockerfile appears to say.</span></div>
</div>
<pre><code>docker inspect -f '{{ .Config.Entrypoint }} + {{ .Config.Cmd }}' quiet
docker run -d --name loud nginx:alpine nginx -g 'daemon off;' &gt;/dev/null
docker ps --filter name=loud --format '{{.Status}}'</code></pre>
<div class="out">[/docker-entrypoint.sh] + [nginx]
Up 4 seconds</div>

<h3>Killed, not crashed</h3>
${slide('dk-12', 17, '137 có hai nghĩa — OOMKilled phân xử; 143/130/139 là tín hiệu')}
<pre><code>docker inspect -f '{{ .State.ExitCode }} {{ .State.OOMKilled }}' blog-worker-1
sudo dmesg -T | grep -i -m1 'killed process'
docker stats --no-stream --format '{{.Name}} {{.MemUsage}}' | grep worker</code></pre>
<div class="out">137 true
[Fri Aug 22 14:31:12 2026] Memory cgroup out of memory: Killed process 9481 (node)
blog-worker-1 0B / 256MiB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">137 with <code>OOMKilled=true</code></span><span class="v">The container's own memory limit. Raise it, fix the leak, or tell the runtime about the limit (Lesson 11.2) — a Node process sizing its heap from host RAM will do this reliably.</span></div>
  <div class="kv"><span class="k">137 with <code>OOMKilled=false</code></span><span class="v">Something else sent SIGKILL: <code>docker kill</code>, a stop that exceeded <code>stop_grace_period</code>, or an orchestrator. Check who else touches this host.</span></div>
  <div class="kv"><span class="k">143 on a service</span><span class="v">A clean SIGTERM. If it keeps happening, something is stopping it deliberately — a deploy loop, a systemd unit fighting compose, or two deploys racing (Lesson 11.4).</span></div>
  <div class="kv"><span class="k">137 during a build</span><span class="v">The build ran out of memory, not the container. Reduce build parallelism; this project builds frontend and backend sequentially on the server for exactly this reason.</span></div>
  <div class="kv"><span class="k">Host-wide OOM</span><span class="v">Several unrelated containers die at once and <code>dmesg</code> names a process outside any of them. Some container without a limit exhausted the machine — put limits on everything.</span></div>
</div>

<h3>Marked unhealthy while working perfectly</h3>
${slide('dk-12', 18, 'unhealthy mà app vẫn trả lời: bộ kiểm hỏng')}
<pre><code>docker inspect -f '{{ .State.Health.Status }}' blog-web-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }}: {{ .Output }}{{ end }}' blog-web-1 | head -2
docker compose exec web sh -c 'wget -qO- http://localhost:3000/ | head -c 20'</code></pre>
<div class="out">unhealthy
127: /bin/sh: wget: not found
&lt;!DOCTYPE html&gt;&lt;html</div>
<div class="callout warn"><strong>Exit 127 in a healthcheck means the check itself is broken, not the service.</strong> The application answers perfectly; the check calls a binary the image does not ship. This project burned about 25 seconds on every deploy for months on exactly this — a frontend check calling <code>wget</code> inside a container whose Dockerfile deliberately installs neither <code>wget</code> nor <code>curl</code>. Inside a Node image use <code>node -e</code>; inside distroless use the app's own binary; and always verify the check with <code>docker exec</code> before trusting its verdict. Verify the checker before the content.</div>

<h3>Run it step by step: an unhealthy check that blocks the whole stack</h3>
<p>The course reproduced this project's healthcheck mistake exactly: a Node server in <code>node:22-alpine</code> (which ships busybox <code>wget</code> but <strong>not</strong> <code>curl</code>), a check that calls <code>curl</code>, and a proxy that waits for it with <code>condition: service_healthy</code>.</p>
<pre><code class="language-yaml">services:
  web:
    image: node:22-alpine
    command: ["node", "-e", "require('http').createServer((q,s)=&gt;s.end('ok')).listen(3000)"]
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:3000/"]
      interval: 2s
      retries: 2
  proxy:
    image: nginx:1.27-alpine
    depends_on:
      web: { condition: service_healthy }</code></pre>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
docker inspect hc-web-1 -f '{{range .State.Health.Log}}{{.ExitCode}}: {{.Output}}{{end}}' | head -2
docker compose exec web sh -c 'wget -qO- http://localhost:3000/; echo " exit=$?"; curl -fsS http://localhost:3000/; echo " exit=$?"'</code></pre>
<div class="out">dependency failed to start: container hc-web-1 is unhealthy
SERVICE   STATUS
proxy     Created
web       Up 4 seconds (unhealthy)
127: /bin/sh: curl: not found
127: /bin/sh: curl: not found
ok exit=0
 exit=127
sh: curl: not found</div>
<p>The whole chain in one screen: the app answers (<code>ok</code>), the check exits <strong>127</strong> because <code>curl</code> does not exist, two failures make <code>web</code> unhealthy, and <code>proxy</code> is left in <code>Created</code> — the entire site is down because of a checker. (Written as <code>curl … || exit 1</code>, the check hides the 127 behind a plain 1, so leave that <code>|| exit 1</code> out while debugging.) The fix uses the one program a Node image is guaranteed to have:</p>
<pre><code class="language-yaml">    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', r =&gt; process.exit(r.statusCode == 200 ? 0 : 1)).on('error', () =&gt; process.exit(1))"]</code></pre>
<div class="out">SERVICE   STATUS
proxy     Up 1 second
web       Up 3 seconds (healthy)</div>
<table>
<tr><th>Healthcheck option</th><th>Meaning</th><th>Tip</th></tr>
<tr><td><code>test</code></td><td><code>CMD</code> = run directly; <code>CMD-SHELL</code> = run through <code>/bin/sh -c</code></td><td>distroless has no <code>sh</code>: use <code>CMD</code></td></tr>
<tr><td><code>interval</code></td><td>time between checks (default 30s)</td><td>short while testing, 10–30s in production</td></tr>
<tr><td><code>timeout</code></td><td>a check slower than this counts as failed</td><td>default 30s</td></tr>
<tr><td><code>retries</code></td><td>consecutive failures before <code>unhealthy</code></td><td>default 3</td></tr>
<tr><td><code>start_period</code></td><td>grace time at start-up: failures do not count</td><td>set it for slow starters (migrations, JVM)</td></tr>
</table>
<h3>Keeping a dying container open long enough to look</h3>
${slide('dk-12', 19, 'compose run: đúng cấu hình service, thêm một cái shell')}
<pre><code><span class="tok-comment"># Replace the entrypoint with a shell and poke around by hand</span>
docker run --rm -it --entrypoint sh ghcr.io/me/api:9f2ac1e
<span class="tok-comment"># Same image and env as the failing service, but a shell instead of the command</span>
docker compose run --rm --entrypoint sh api
<span class="tok-comment"># Keep the exited container instead of --rm, then read its filesystem</span>
docker compose run --no-deps api node dist/index.js; docker ps -a --format '{{.Names}} {{.Status}}' | head -2
docker cp blog-api-run-8f3c1:/app/logs/last.json - | tar -xO | jq .</code></pre>
<div class="out">Exited (1) 1 second ago
blog-api-run-8f3c1 Exited (1) 1 second ago
{"phase":"startup","step":"prisma.connect","error":"P1001","host":"db","port":5432}</div>
<div class="callout ok"><strong><code>docker compose run --rm --entrypoint sh api</code> is the single most useful debugging command for a service that will not stay up.</strong> You get the exact image, the exact environment variables, the exact networks and mounts — with a shell instead of the failing command. From there you run the real command by hand and watch it fail with your hands on the keyboard, which is a completely different experience from reading its logs afterwards.</div>

<h3>It will not stop, either</h3>
<pre><code>time docker compose stop api</code></pre>
<div class="out"> ✔ Container blog-api-1  Stopped                          10.3s
real	0m10.312s</div>
<p>Ten seconds means the process ignored SIGTERM and Docker fell back to SIGKILL after the grace period. Either the application installs no handler, or it is not PID 1 and never received the signal — a shell-form <code>CMD</code> wraps your process in <code>/bin/sh -c</code>, and that shell does not forward signals. Use exec-form <code>CMD</code>, add <code>init: true</code> or <code>tini</code>, and handle SIGTERM (Lessons 1.3 and 11.4). Until then every deploy drops in-flight requests and costs ten seconds.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your group's API "keeps restarting" on the shared dev machine and the frontend shows 502. Build the two-service stack from this lesson, break it the same way, find the cause from evidence only, and fix it properly.</p><ol>
<li>In <code>~/thu-docker/chet</code>, create <code>server.js</code> (connect to <code>cache:6379</code> with <code>net.connect</code>; on <code>error</code> log it and <code>process.exit(1)</code>; on success start an HTTP server on 3000) and a <code>compose.yaml</code> with <code>name: thu-chet</code>, service <code>api</code> (<code>node:22-alpine</code>, the file bind-mounted read-only, <code>restart: unless-stopped</code>) and service <code>cache</code> (<code>redis:7-alpine</code>).</li>
<li><code>docker compose up -d api</code>. Wait 10 seconds and run the three commands: <code>compose ps -a</code>, <code>inspect … RestartCount</code>, <code>compose logs --timestamps --tail 4 api</code>. Name the layer.</li>
<li>Confirm by hand: <code>docker compose run --rm --no-deps --entrypoint sh api -c 'getent hosts cache || echo no-dns; node server.js'</code>.</li>
<li>Fix it durably: add a healthcheck to <code>cache</code> (<code>["CMD", "redis-cli", "ping"]</code>, <code>interval: 2s</code>) and <code>depends_on: { cache: { condition: service_healthy } }</code> to <code>api</code>; run <code>docker compose up -d</code>.</li>
<li>Clean up: <code>docker compose down</code>, <code>cd .. &amp;&amp; rm -rf chet</code>.</li></ol>
<p><strong>Done when:</strong> step 2 shows <code>Restarting (1)</code>, <code>oom=false</code> and <code>ENOTFOUND … cache</code>; step 3 prints <code>no-dns</code> before the same error; after step 4 <code>docker compose ps</code> shows <code>cache</code> <code>(healthy)</code> and <code>api</code> <code>Up</code> with <code>RestartCount</code> 0 for the new container, and the log says it is listening on 3000.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Crash loop</span><span class="v">A container that starts, dies, and is restarted by its policy, over and over.</span></div>
  <div class="kv"><span class="k">Restart policy</span><span class="v"><code>no</code>, <code>on-failure</code>, <code>always</code>, <code>unless-stopped</code>: when Docker brings a dead container back.</span></div>
  <div class="kv"><span class="k">Backoff</span><span class="v">The growing wait between restarts — it doubles each time.</span></div>
  <div class="kv"><span class="k">Daemonise</span><span class="v">A program forking itself into the background; in a container that ends PID 1 and so the container.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel mechanism that kills a process when memory runs out — inside a limit or across the host.</span></div>
  <div class="kv"><span class="k">Healthcheck</span><span class="v">A command Docker runs inside the container on a timer; its exit code sets <code>healthy</code>/<code>unhealthy</code>.</span></div>
  <div class="kv"><span class="k">ENOTFOUND / ECONNREFUSED</span><span class="v">"This name does not resolve" versus "the name resolves, nobody listens on that port".</span></div>
  <div class="kv"><span class="k">One-off container (<code>compose run</code>)</span><span class="v">A temporary container with a service's full configuration, for running something by hand.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Here your code did run, so the log has the answer — but read the first failure, with <code>--timestamps</code>, not the hundredth.</li>
<li>Restart delays double from ~0.1 s; a long-looping container is down most of the time, and <code>restart: always</code> fixes nothing.</li>
<li><code>Exited (0)</code> at once means the process went to the background (look for the PID change in the log), finished a one-shot job, or had no stdin.</li>
<li>137 needs <code>OOMKilled</code> to be read; 143/130 mean someone sent SIGTERM/SIGINT; 139 is a segfault in native code.</li>
<li><code>unhealthy</code> with 127 in <code>Health.Log</code> is a broken checker, and it can block every service that <code>depends_on</code> it — test checks with <code>docker exec</code>.</li>
<li><code>docker compose run --rm --no-deps --entrypoint sh &lt;svc&gt;</code> reproduces the failure with the exact configuration and a shell.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/logs/" target="_blank" rel="noopener">
  <span class="lc-ico">📃</span>
  <span class="lc-body"><span class="lc-title">docker logs — the flags</span><span class="lc-sub"><code>--timestamps</code>, <code>--since</code>, <code>--until</code>, <code>--tail</code> and <code>--details</code>. The first two are what make a crash loop's log readable instead of a wall of repeats.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/run/" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">docker compose run</span><span class="lc-sub">One-off containers with a service's full configuration. <code>--rm</code>, <code>--no-deps</code>, <code>--entrypoint</code> and <code>--service-ports</code> — the flags that turn it into a debugging tool.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: eight crash loops</span><span class="lc-sub">Graded exercises: eight containers that start and die — a daemonising process, an OOM, a broken healthcheck, a missing dependency, an ignored SIGTERM. Identify each from its evidence alone.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> fixing the symptom of a crash loop by adding <code>restart: always</code> and moving on. The container now flaps forever instead of staying down, which looks better in <code>docker ps</code> and is worse in every other way: the logs fill with the same error at a rate set by the backoff, the healthcheck alternates between states so monitoring cannot tell you anything stable, and the actual failure — usually one line in the log of the very first attempt — scrolls past. Read the <em>first</em> failure, not the hundredth: <code>docker logs --since &lt;container start time&gt;</code>, or stop the container and run it once by hand with <code>compose run</code>. A crash loop is a fault repeating, and the repetition adds no information after the first cycle.</div>
<p class="note-ct"><strong>Three things to remember.</strong> A container that exits 0 immediately usually daemonised — foreground mode is mandatory, from <code>nginx -g "daemon off;"</code> to <code>redis-server</code> without <code>--daemonize</code>. Exit 137 with <code>OOMKilled=true</code> is the container's own memory limit; with <code>false</code>, something else sent SIGKILL. And <code>docker compose run --rm --entrypoint sh &lt;service&gt;</code> gives you the failing service's exact image, environment and networks with a shell instead of the command — the fastest way from "it dies" to "I can see why".</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Nó khởi động, rồi chết</h2>
<p class="lead">Đây là địa hạt của tầng 3 và tầng 4: cái ảnh không sao, cấu hình không sao, và có gì đó trục trặc khi tiến trình đã thật sự chạy. Tin tốt là container đã có cơ hội LÊN TIẾNG — nên khác với bài trước, log thường chứa sẵn câu trả lời.</p>

<h3>Đọc một vòng lặp sập</h3>
${slide('dk-12', 14, 'Lên rồi chết: hỏi mã thoát trước, đọc log sau')}
${slide('dk-12', 15, 'Vòng lặp restart: Docker chờ gấp đôi mỗi lần (đo thật)')}
<pre><code>docker compose ps --format 'table {{.Service}}\\t{{.Status}}'
docker inspect -f 'exit={{ .State.ExitCode }} oom={{ .State.OOMKilled }} n={{ .RestartCount }} since={{ .State.StartedAt }}' blog-api-1
docker logs --tail 20 --timestamps blog-api-1 | tail -6</code></pre>
<div class="out">SERVICE   STATUS
api       Restarting (1) 4 seconds ago
db        Up 20 minutes (healthy)
exit=1 oom=false n=17 since=2026-08-22T14:22:08Z
2026-08-22T14:22:08.9Z Error: connect ECONNREFUSED 172.19.0.5:6379
2026-08-22T14:22:08.9Z     at TCPConnectWrap.afterConnect [as oncomplete]</div>
<div class="callout ok"><strong><code>--timestamps</code> mới là thứ làm cho một vòng lặp sập đọc được.</strong> Không có nó thì mười bảy lần thử đẻ ra mười bảy khối lỗi giống hệt nhau và bạn không phân biệt nổi cái nào là hiện tại — hay thậm chí là thông báo có đổi ở lần nào đó không. Có mốc thời gian thì bạn thấy được chu kỳ của vòng lặp, phát hiện được lần thử mà thông báo khác đi, và xác nhận được là mình đang đọc cái mới nhất. Hãy ghép với <code>--since 2m</code> để cắt hẳn phần lịch sử đi.</div>

<h3>Chạy thử từng bước: một vòng lặp sập thật, từ STATUS tới nguyên nhân</h3>
<p>Khoá học dựng một stack hai service — <code>api</code> (Node, kết nối Redis lúc khởi động, thoát 1 nếu không được) và <code>cache</code> (Redis) — với <code>restart: unless-stopped</code> trên API và không có <code>depends_on</code>. Rồi chỉ chạy API: <code>docker compose up -d api</code>. Mọi thứ dưới đây là output thật (máy Mac, Compose v5.5.1).</p>
<pre><code class="language-bash">docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
docker inspect -f 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}' blog-api-1
docker compose logs --timestamps --tail 4 api</code></pre>
<div class="out">SERVICE   STATUS
api       Restarting (1) 1 second ago
exit=1 oom=false restarts=7
api-1  | 2026-09-23T19:27:33.111308421Z 2026-09-23T19:27:33.109Z boot: connecting to cache:6379
api-1  | 2026-09-23T19:27:33.121498379Z Error: ENOTFOUND getaddrinfo ENOTFOUND cache
api-1  | 2026-09-23T19:27:36.426613339Z 2026-09-23T19:27:36.424Z boot: connecting to cache:6379
api-1  | 2026-09-23T19:27:36.436421005Z Error: ENOTFOUND getaddrinfo ENOTFOUND cache</div>
<ol>
<li><strong>STATUS</strong> <code>Restarting (1)</code>: mã chạy, chết với mã 1, và được kéo lên lại. Tầng 3 hoặc 4.</li>
<li><strong>inspect</strong> <code>oom=false</code>, bảy lần restart trong tám giây: không phải bị giết — chương trình tự chọn thoát.</li>
<li><strong>logs</strong>: mỗi dòng có hai mốc giờ — của Docker (nhờ <code>--timestamps</code>) và của chính ứng dụng. <code>ENOTFOUND</code> là câu trả lời của DNS: trên mạng này không có container nào tên <code>cache</code>. Nếu là <code>ECONNREFUSED</code> thì nghĩa là "tên có tồn tại, nhưng không ai nghe ở cổng đó" — cách chữa khác hẳn.</li>
</ol>
<p>Docker chờ bao lâu giữa các lần thử? Khoá học đo bằng một container chỉ in giờ rồi thoát 1 (<code>docker run -d --restart on-failure alpine:3.20 sh -c 'date +%T; exit 1'</code>) và đọc lại giờ khởi động từ <code>docker logs -t</code>:</p>
<div class="out">19:23:55
19:23:56
19:23:56
19:23:56
19:23:57
19:23:59
19:24:02
19:24:09
19:24:22</div>
<p>Khoảng cách tăng GẤP ĐÔI: khoảng 0,1 s, 0,2, 0,4, 0,8, 1,6, 3,3, 6,5, 12,9 s … (theo tài liệu: độ trễ gấp đôi bắt đầu từ 100 ms, tới một mức trần, và đặt lại sau khi container đứng vững được 10 giây). Hai hệ quả thực tế: những lần hỏng <em>ĐẦU TIÊN</em> dồn cả vào vài giây đầu của log, và sau vài phút một container "cứ restart mãi" thật ra phần lớn thời gian đang nằm chết chờ tới lượt. Muốn xem trực tiếp thì <code>docker events --filter container=&lt;tên&gt;</code> hiện mỗi vòng thành một cặp sự kiện <code>start</code> / <code>die exitCode=1</code>.</p>
<p>Giờ hãy tái hiện cái hỏng với tay đặt trên bàn phím thay vì đọc log — cùng ảnh, cùng môi trường, cùng mạng, một cái shell thay cho câu lệnh, và <code>--no-deps</code> để Compose không tự bật gì giúp bạn:</p>
<pre><code class="language-bash">docker compose run --rm --no-deps --entrypoint sh api -c \\
  'echo "REDIS_HOST=$REDIS_HOST"; getent hosts cache || echo "cache: không phân giải được"; node server.js'</code></pre>
<div class="out"> Container blog-api-run-fe6f620d5fcc Creating
 Container blog-api-run-fe6f620d5fcc Created
REDIS_HOST=cache
cache: không phân giải được
2026-09-23T19:27:37.869Z boot: connecting to cache:6379
Error: ENOTFOUND getaddrinfo ENOTFOUND cache</div>
<p>Biến môi trường đúng; cái tên không phân giải được; nguyên nhân là <code>cache</code> chưa chạy. Bật nó lên và nhìn vòng lặp tự lành ở lần thử kế tiếp:</p>
<pre><code class="language-bash">docker compose up -d cache; sleep 15
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'
docker compose logs --tail 2 api</code></pre>
<div class="out">SERVICE   STATUS
api       Up 2 seconds
cache     Up 15 seconds
api-1  | 2026-09-23T19:27:55.857Z boot: connecting to cache:6379
api-1  | redis ok, listening on 3000</div>
<table>
<tr><th>Cờ của <code>compose run</code></th><th>Ở đây làm gì</th></tr>
<tr><td><code>--rm</code></td><td>xoá container chạy thử khi xong (bỏ cờ này nếu muốn <code>docker cp</code> từ nó sau khi nó chết)</td></tr>
<tr><td><code>--no-deps</code></td><td>không bật các service trong <code>depends_on</code> — bạn thấy cái hỏng y như vòng lặp thấy</td></tr>
<tr><td><code>--entrypoint sh</code></td><td>thay entrypoint của ảnh bằng một shell</td></tr>
<tr><td><code>-c '…'</code></td><td>thứ shell sẽ chạy: kiểm trước, rồi mới tới câu lệnh thật</td></tr>
<tr><td><code>--service-ports</code></td><td>(không dùng) công bố cả cổng của service — mặc định TẮT, nên container chạy thử không bao giờ tranh cổng với service thật</td></tr>
</table>
<div class="callout ok"><strong>Cách chữa không phải là <code>restart</code> và cũng không phải <code>sleep</code>.</strong> API chỉ lành vì <code>cache</code> xuất hiện. Trong file compose, cách chữa bền là <code>depends_on: { cache: { condition: service_healthy } }</code> cộng một healthcheck trên <code>cache</code> (Chương 10), còn trong ứng dụng là thử lại có giãn cách — để một lần Redis khởi động lại lúc 3 giờ sáng không biến thành một vòng lặp.</div>

<h3>Container thoát 0 ngay lập tức</h3>
${slide('dk-12', 16, 'Exit 0 ngay lập tức: tiến trình đã tự chạy nền')}
<pre><code>docker run -d --name quiet nginx:alpine nginx
docker ps -a --filter name=quiet --format '{{.Status}}'
docker logs quiet</code></pre>
<div class="out">Exited (0) 2 seconds ago</div>
<div class="callout warn"><strong>Đính chính (09/2026): log của <code>quiet</code> KHÔNG rỗng.</strong> Khối ở trên ngụ ý là rỗng; chạy lại trên Docker 29.8 với <code>nginx:1.27-alpine</code>, <code>docker logs</code> in ra cả quá trình khởi động — và những dòng cuối chính là manh mối:</div>
<pre><code class="language-bash">docker logs quiet | tail -5</code></pre>
<div class="out">2026/09/23 19:23:56 [notice] 1#1: OS: Linux 7.0.12-linuxkit
2026/09/23 19:23:56 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2026/09/23 19:23:56 [notice] 30#30: start worker processes
2026/09/23 19:23:56 [notice] 30#30: start worker process 31
2026/09/23 19:23:56 [notice] 30#30: start worker process 32</div>
<p>nginx ghi <code>PID#TID</code> ở đầu mỗi dòng. Những dòng đầu đến từ tiến trình <strong>1</strong>; sau đó chúng đến từ tiến trình <strong>30</strong>. Đó chính là việc chạy nền đang diễn ra: PID 1 rẽ nhánh ra một master chạy nền (30) rồi thoát, đời container kết thúc cùng PID 1, và master chạy nền chết theo ngay sau đó. Khi log trông khoẻ mạnh mà container lại <code>Exited (0)</code>, hãy tìm đúng chỗ PID đổi như thế này.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tiến trình đã chạy nền</span><span class="lz-t">nginx không kèm -g "daemon off;"</span><span class="lz-d">Nó rẽ nhánh xuống chạy nền và PID 1 thoát, nên Docker coi như container đã xong. Chế độ chạy tiền cảnh là bắt buộc: <code>nginx -g "daemon off;"</code>, <code>postgres</code> chứ không phải <code>pg_ctl start</code>, <code>redis-server</code> chứ không phải <code>--daemonize yes</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Câu lệnh đúng là đã xong thật</span><span class="lz-t">một việc chạy một lần trong khi bạn định làm máy chủ</span><span class="lz-d"><code>CMD ["npm", "run", "build"]</code> trong một định nghĩa dịch vụ. Thoát 0 là hành vi đúng; cái sai là gọi nó là dịch vụ.</span></div>
  <div class="lz-step"><span class="lz-k">Không có TTY mà nó lại cần</span><span class="lz-t">một shell tương tác không có -it</span><span class="lz-d"><code>docker run -d alpine sh</code> thoát ngay tức khắc vì stdin đã đóng. Hãy thêm <code>-it</code>, hoặc giao cho nó việc gì đó để làm.</span></div>
  <div class="lz-step"><span class="lz-k">Một lớp bọc nuốt mất câu lệnh thật</span><span class="lz-t">ENTRYPOINT cộng CMD ghép sai</span><span class="lz-d"><code>docker inspect -f '{{ .Config.Entrypoint }} {{ .Config.Cmd }}'</code> hiện ra chính xác cái gì đã được chạy (Bài 4.3). Rất hay là không phải thứ Dockerfile trông như đang nói.</span></div>
</div>
<pre><code>docker inspect -f '{{ .Config.Entrypoint }} + {{ .Config.Cmd }}' quiet
docker run -d --name loud nginx:alpine nginx -g 'daemon off;' &gt;/dev/null
docker ps --filter name=loud --format '{{.Status}}'</code></pre>
<div class="out">[/docker-entrypoint.sh] + [nginx]
Up 4 seconds</div>

<h3>Bị GIẾT, không phải bị sập</h3>
${slide('dk-12', 17, '137 có hai nghĩa — OOMKilled phân xử; 143/130/139 là tín hiệu')}
<pre><code>docker inspect -f '{{ .State.ExitCode }} {{ .State.OOMKilled }}' blog-worker-1
sudo dmesg -T | grep -i -m1 'killed process'
docker stats --no-stream --format '{{.Name}} {{.MemUsage}}' | grep worker</code></pre>
<div class="out">137 true
[Fri Aug 22 14:31:12 2026] Memory cgroup out of memory: Killed process 9481 (node)
blog-worker-1 0B / 256MiB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">137 kèm <code>OOMKilled=true</code></span><span class="v">Hạn mức bộ nhớ của chính container. Hãy nâng nó lên, chữa chỗ rò, hoặc nói cho bộ chạy biết về cái hạn mức (Bài 11.2) — một tiến trình Node tính heap từ RAM của máy chủ sẽ gây ra chuyện này rất đều đặn.</span></div>
  <div class="kv"><span class="k">137 kèm <code>OOMKilled=false</code></span><span class="v">Thứ khác đã gửi SIGKILL: một lệnh <code>docker kill</code>, một lần dừng vượt quá <code>stop_grace_period</code>, hoặc một bộ điều phối. Hãy kiểm xem còn ai đụng vào cái máy chủ này.</span></div>
  <div class="kv"><span class="k">143 trên một dịch vụ</span><span class="v">Một cú SIGTERM sạch. Nếu nó cứ lặp lại thì có thứ gì đó đang cố tình dừng nó — một vòng lặp deploy, một unit systemd đánh nhau với compose, hoặc hai lượt deploy đua nhau (Bài 11.4).</span></div>
  <div class="kv"><span class="k">137 giữa một lượt DỰNG</span><span class="v">Lượt dựng hết bộ nhớ, không phải container. Hãy giảm mức dựng song song; dự án này dựng frontend với backend tuần tự trên máy chủ đúng vì lý do đó.</span></div>
  <div class="kv"><span class="k">OOM ở mức toàn máy</span><span class="v">Nhiều container không liên quan chết cùng lúc và <code>dmesg</code> gọi tên một tiến trình nằm ngoài tất cả chúng. Một container nào đó không có hạn mức đã vét cạn cái máy — hãy đặt hạn mức cho mọi thứ.</span></div>
</div>

<h3>Bị đánh dấu không khoẻ trong khi vẫn chạy hoàn hảo</h3>
${slide('dk-12', 18, 'unhealthy mà app vẫn trả lời: bộ kiểm hỏng')}
<pre><code>docker inspect -f '{{ .State.Health.Status }}' blog-web-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }}: {{ .Output }}{{ end }}' blog-web-1 | head -2
docker compose exec web sh -c 'wget -qO- http://localhost:3000/ | head -c 20'</code></pre>
<div class="out">unhealthy
127: /bin/sh: wget: not found
&lt;!DOCTYPE html&gt;&lt;html</div>
<div class="callout warn"><strong>Mã 127 trong một healthcheck nghĩa là CHÍNH PHÉP KIỂM hỏng, không phải dịch vụ.</strong> Ứng dụng trả lời hoàn hảo; phép kiểm gọi một tệp nhị phân mà cái ảnh không kèm theo. Dự án này đốt khoảng 25 giây ở mỗi lượt deploy suốt nhiều tháng vì đúng chuyện đó — một phép kiểm frontend gọi <code>wget</code> bên trong một container mà Dockerfile của nó cố ý không cài cả <code>wget</code> lẫn <code>curl</code>. Trong ảnh Node thì dùng <code>node -e</code>; trong distroless thì dùng chính tệp nhị phân của ứng dụng; và luôn xác minh phép kiểm bằng <code>docker exec</code> trước khi tin vào phán quyết của nó. Kiểm bộ kiểm trước khi kiểm nội dung.</div>

<h3>Chạy thử từng bước: một healthcheck hỏng chặn cả stack</h3>
<p>Khoá học dựng lại đúng sai lầm healthcheck của dự án này: một server Node trong <code>node:22-alpine</code> (có sẵn <code>wget</code> của busybox nhưng <strong>KHÔNG</strong> có <code>curl</code>), một phép kiểm gọi <code>curl</code>, và một proxy chờ nó bằng <code>condition: service_healthy</code>.</p>
<pre><code class="language-yaml">services:
  web:
    image: node:22-alpine
    command: ["node", "-e", "require('http').createServer((q,s)=&gt;s.end('ok')).listen(3000)"]
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:3000/"]
      interval: 2s
      retries: 2
  proxy:
    image: nginx:1.27-alpine
    depends_on:
      web: { condition: service_healthy }</code></pre>
<pre><code class="language-bash">docker compose up -d
docker compose ps -a --format 'table {{.Service}}\\t{{.Status}}'
docker inspect hc-web-1 -f '{{range .State.Health.Log}}{{.ExitCode}}: {{.Output}}{{end}}' | head -2
docker compose exec web sh -c 'wget -qO- http://localhost:3000/; echo " exit=$?"; curl -fsS http://localhost:3000/; echo " exit=$?"'</code></pre>
<div class="out">dependency failed to start: container hc-web-1 is unhealthy
SERVICE   STATUS
proxy     Created
web       Up 4 seconds (unhealthy)
127: /bin/sh: curl: not found
127: /bin/sh: curl: not found
ok exit=0
 exit=127
sh: curl: not found</div>
<p>Cả chuỗi trên một màn hình: ứng dụng trả lời (<code>ok</code>), phép kiểm thoát <strong>127</strong> vì <code>curl</code> không tồn tại, hai lần hỏng làm <code>web</code> thành unhealthy, và <code>proxy</code> bị bỏ lại ở <code>Created</code> — cả trang web chết vì một bộ kiểm. (Viết thành <code>curl … || exit 1</code> thì phép kiểm giấu mã 127 sau một số 1 bình thường, nên lúc gỡ lỗi hãy bỏ <code>|| exit 1</code> đi.) Cách chữa dùng đúng chương trình mà ảnh Node chắc chắn có:</p>
<pre><code class="language-yaml">    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', r =&gt; process.exit(r.statusCode == 200 ? 0 : 1)).on('error', () =&gt; process.exit(1))"]</code></pre>
<div class="out">SERVICE   STATUS
proxy     Up 1 second
web       Up 3 seconds (healthy)</div>
<table>
<tr><th>Tuỳ chọn healthcheck</th><th>Nghĩa</th><th>Mẹo</th></tr>
<tr><td><code>test</code></td><td><code>CMD</code> = chạy thẳng; <code>CMD-SHELL</code> = chạy qua <code>/bin/sh -c</code></td><td>distroless không có <code>sh</code>: dùng <code>CMD</code></td></tr>
<tr><td><code>interval</code></td><td>khoảng cách giữa hai lần kiểm (mặc định 30s)</td><td>ngắn khi thử, 10–30s trên production</td></tr>
<tr><td><code>timeout</code></td><td>lần kiểm lâu hơn mức này bị tính là hỏng</td><td>mặc định 30s</td></tr>
<tr><td><code>retries</code></td><td>số lần hỏng liên tiếp trước khi thành <code>unhealthy</code></td><td>mặc định 3</td></tr>
<tr><td><code>start_period</code></td><td>thời gian ân hạn lúc khởi động: hỏng không bị tính</td><td>đặt cho thứ khởi động chậm (migration, JVM)</td></tr>
</table>
<h3>Giữ một container đang chết lại đủ lâu để nhìn</h3>
${slide('dk-12', 19, 'compose run: đúng cấu hình service, thêm một cái shell')}
<pre><code><span class="tok-comment"># Thay entrypoint bằng một cái shell rồi tự tay ngó nghiêng</span>
docker run --rm -it --entrypoint sh ghcr.io/me/api:9f2ac1e
<span class="tok-comment"># Cùng ảnh và cùng môi trường với dịch vụ đang hỏng, nhưng có shell thay cho câu lệnh</span>
docker compose run --rm --entrypoint sh api
<span class="tok-comment"># Giữ lại container đã thoát thay vì --rm, rồi đọc hệ thống file của nó</span>
docker compose run --no-deps api node dist/index.js; docker ps -a --format '{{.Names}} {{.Status}}' | head -2
docker cp blog-api-run-8f3c1:/app/logs/last.json - | tar -xO | jq .</code></pre>
<div class="out">Exited (1) 1 second ago
blog-api-run-8f3c1 Exited (1) 1 second ago
{"phase":"startup","step":"prisma.connect","error":"P1001","host":"db","port":5432}</div>
<div class="callout ok"><strong><code>docker compose run --rm --entrypoint sh api</code> là câu lệnh gỡ lỗi hữu ích nhất cho một dịch vụ không chịu đứng vững.</strong> Bạn nhận đúng cái ảnh đó, đúng những biến môi trường đó, đúng những mạng và phép gắn đó — với một cái shell thay cho câu lệnh đang hỏng. Từ đó bạn chạy câu lệnh thật bằng tay rồi xem nó hỏng khi tay bạn đang đặt trên bàn phím, một trải nghiệm hoàn toàn khác với việc đọc log của nó sau khi mọi chuyện đã xong.</div>

<h3>Nó cũng không chịu DỪNG</h3>
<pre><code>time docker compose stop api</code></pre>
<div class="out"> ✔ Container blog-api-1  Stopped                          10.3s
real	0m10.312s</div>
<p>Mười giây nghĩa là tiến trình đã phớt lờ SIGTERM và Docker phải lùi về SIGKILL sau khoảng ân hạn. Hoặc là ứng dụng không cài bộ xử lý tín hiệu nào, hoặc là nó không phải PID 1 và chưa bao giờ nhận được tín hiệu — một <code>CMD</code> dạng shell bọc tiến trình của bạn trong <code>/bin/sh -c</code>, và cái shell đó không chuyển tiếp tín hiệu. Hãy dùng <code>CMD</code> dạng exec, thêm <code>init: true</code> hoặc <code>tini</code>, và xử lý SIGTERM (Bài 1.3 và 11.4). Cho tới lúc đó thì mọi lượt deploy đều làm rơi các yêu cầu đang dở và tốn mười giây.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> API của nhóm "cứ restart mãi" trên máy dev chung và frontend hiện 502. Hãy dựng stack hai service của bài này, làm nó hỏng y như vậy, tìm nguyên nhân chỉ bằng bằng chứng, rồi sửa cho đúng cách.</p><ol>
<li>Trong <code>~/thu-docker/chet</code>, tạo <code>server.js</code> (kết nối <code>cache:6379</code> bằng <code>net.connect</code>; khi <code>error</code> thì ghi log rồi <code>process.exit(1)</code>; khi thành công thì bật server HTTP ở cổng 3000) và một <code>compose.yaml</code> có <code>name: thu-chet</code>, service <code>api</code> (<code>node:22-alpine</code>, bind-mount file đó ở chế độ chỉ đọc, <code>restart: unless-stopped</code>) và service <code>cache</code> (<code>redis:7-alpine</code>).</li>
<li><code>docker compose up -d api</code>. Chờ 10 giây rồi chạy ba lệnh: <code>compose ps -a</code>, <code>inspect … RestartCount</code>, <code>compose logs --timestamps --tail 4 api</code>. Gọi tên tầng.</li>
<li>Xác nhận bằng tay: <code>docker compose run --rm --no-deps --entrypoint sh api -c 'getent hosts cache || echo no-dns; node server.js'</code>.</li>
<li>Sửa cho bền: thêm healthcheck cho <code>cache</code> (<code>["CMD", "redis-cli", "ping"]</code>, <code>interval: 2s</code>) và <code>depends_on: { cache: { condition: service_healthy } }</code> cho <code>api</code>; chạy <code>docker compose up -d</code>.</li>
<li>Dọn: <code>docker compose down</code>, <code>cd .. &amp;&amp; rm -rf chet</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 hiện <code>Restarting (1)</code>, <code>oom=false</code> và <code>ENOTFOUND … cache</code>; bước 3 in <code>no-dns</code> trước đúng cái lỗi đó; sau bước 4 <code>docker compose ps</code> hiện <code>cache</code> <code>(healthy)</code> và <code>api</code> <code>Up</code>, container mới có <code>RestartCount</code> bằng 0, và log nói đang nghe ở cổng 3000.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Crash loop (vòng lặp sập)</span><span class="v">Container khởi động, chết, rồi bị chính sách restart kéo lên lại, lặp mãi.</span></div>
  <div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v"><code>no</code>, <code>on-failure</code>, <code>always</code>, <code>unless-stopped</code>: khi nào Docker kéo một container chết lên lại.</span></div>
  <div class="kv"><span class="k">Backoff (giãn cách tăng dần)</span><span class="v">Thời gian chờ giữa các lần restart, gấp đôi sau mỗi lần.</span></div>
  <div class="kv"><span class="k">Daemonise (tự chạy nền)</span><span class="v">Chương trình tự rẽ nhánh xuống chạy nền; trong container điều đó kết thúc PID 1 và kết thúc luôn container.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Cơ chế của nhân giết một tiến trình khi hết bộ nhớ — trong một hạn mức hoặc trên cả máy chủ.</span></div>
  <div class="kv"><span class="k">Healthcheck (phép kiểm sức khoẻ)</span><span class="v">Lệnh Docker chạy định kỳ bên trong container; mã thoát của nó quyết định <code>healthy</code>/<code>unhealthy</code>.</span></div>
  <div class="kv"><span class="k">ENOTFOUND / ECONNREFUSED</span><span class="v">"Tên này không phân giải được" so với "tên có, nhưng không ai nghe ở cổng đó".</span></div>
  <div class="kv"><span class="k">One-off container (container chạy thử, <code>compose run</code>)</span><span class="v">Container tạm mang đủ cấu hình của một service, để chạy một thứ bằng tay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ở đây mã của bạn ĐÃ chạy, nên log có câu trả lời — nhưng hãy đọc lần hỏng đầu tiên, có <code>--timestamps</code>, không phải lần thứ một trăm.</li>
<li>Độ trễ restart gấp đôi từ khoảng 0,1 s; container lặp lâu thì phần lớn thời gian đang nằm chết, và <code>restart: always</code> không sửa được gì.</li>
<li><code>Exited (0)</code> ngay lập tức là tiến trình đã xuống nền (tìm chỗ PID đổi trong log), đã xong việc một lần, hoặc không có stdin.</li>
<li>137 phải đọc cùng <code>OOMKilled</code>; 143/130 là có người gửi SIGTERM/SIGINT; 139 là segfault trong mã native.</li>
<li><code>unhealthy</code> với 127 trong <code>Health.Log</code> là bộ kiểm hỏng, và nó chặn được mọi service <code>depends_on</code> vào nó — hãy thử lệnh kiểm bằng <code>docker exec</code>.</li>
<li><code>docker compose run --rm --no-deps --entrypoint sh &lt;svc&gt;</code> tái hiện cái hỏng với đúng cấu hình và một cái shell.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/container/logs/" target="_blank" rel="noopener">
  <span class="lc-ico">📃</span>
  <span class="lc-body"><span class="lc-title">docker logs — các cờ</span><span class="lc-sub"><code>--timestamps</code>, <code>--since</code>, <code>--until</code>, <code>--tail</code> và <code>--details</code>. Hai cái đầu là thứ biến log của một vòng lặp sập thành đọc được thay vì một bức tường lặp lại.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/run/" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">docker compose run</span><span class="lc-sub">Container dùng một lần với đầy đủ cấu hình của một dịch vụ. <code>--rm</code>, <code>--no-deps</code>, <code>--entrypoint</code> và <code>--service-ports</code> — những cờ biến nó thành một công cụ gỡ lỗi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tám vòng lặp sập</span><span class="lc-sub">Bài chấm điểm: tám container khởi động rồi chết — một tiến trình chạy nền, một cú OOM, một healthcheck hỏng, một phụ thuộc thiếu, một SIGTERM bị phớt lờ. Nhận diện từng cái chỉ bằng bằng chứng của nó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chữa triệu chứng của một vòng lặp sập bằng cách thêm <code>restart: always</code> rồi đi tiếp. Container giờ vỗ cánh mãi mãi thay vì nằm chết, trông đẹp hơn trong <code>docker ps</code> và tệ hơn ở mọi khía cạnh khác: log đầy lên bằng đúng một lỗi với nhịp do độ trễ tăng dần quyết định, healthcheck nhảy qua nhảy lại giữa các trạng thái nên giám sát không nói cho bạn điều gì ổn định, và cái hỏng THẬT — thường là một dòng trong log của chính lần thử đầu tiên — thì trôi mất. Hãy đọc lần hỏng ĐẦU TIÊN, đừng đọc lần thứ một trăm: <code>docker logs --since &lt;thời điểm container khởi động&gt;</code>, hoặc dừng container lại rồi chạy nó một lần bằng tay với <code>compose run</code>. Một vòng lặp sập là một cái lỗi đang lặp, và sự lặp lại không thêm thông tin gì sau chu kỳ đầu tiên.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một container thoát 0 ngay lập tức thì thường là đã chạy nền — chế độ tiền cảnh là bắt buộc, từ <code>nginx -g "daemon off;"</code> tới <code>redis-server</code> không kèm <code>--daemonize</code>. Mã 137 kèm <code>OOMKilled=true</code> là hạn mức bộ nhớ của chính container; kèm <code>false</code> thì có thứ khác đã gửi SIGKILL. Và <code>docker compose run --rm --entrypoint sh &lt;dịch vụ&gt;</code> cho bạn đúng ảnh, đúng môi trường và đúng mạng của dịch vụ đang hỏng với một cái shell thay cho câu lệnh — đường nhanh nhất từ "nó chết" tới "tôi thấy vì sao rồi".</p>
</div>
`,
    },
    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — The build fails, or only fails in CI|||12.4 — Bản dựng hỏng, hoặc chỉ hỏng trên CI',
      slug: 'dk-12-4-dung-hong',
      type: 'LESSON',
      description: 'Đọc kết quả BuildKit, bảy lý do một lượt dựng chỉ hỏng trên CI, cache nói dối, ngữ cảnh dựng khổng lồ, xuống tầng bằng --target, và luật build-xanh-không-nghĩa-là-chạy-được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>The build fails, or only fails in CI</h2>
<p class="lead">A build that fails on your machine tells you plainly what is wrong. A build that succeeds on your machine and fails in CI is a different animal — the difference is never random, and there are only about seven places it can hide.</p>

<h3>Reading what BuildKit tells you</h3>
${slide('dk-12', 20, 'Build hỏng: hỏng ở đâu, và chỉ hỏng ở CI hay cả máy bạn?')}
${slide('dk-12', 21, 'BuildKit: đọc từ dưới lên — dòng lỗi thật nằm phía trên')}
<pre><code>docker build -f Dockerfile.backend -t api:test . 2&gt;&amp;1 | tail -12</code></pre>
<div class="out"> =&gt; ERROR [build 5/6] RUN npm run build                                     18.2s
------
 &gt; [build 5/6] RUN npm run build:
0.412 &gt; blog@1.0.0 build
0.413 &gt; tsc -p tsconfig.json
17.8 src/services/cv/llm/index.ts(42,18): error TS2551: Property 'keyForProvider'
17.8   does not exist on type 'Gateway'. Did you mean 'gatewayKey'?
------
Dockerfile.backend:18
--------------------
  17 |     COPY . .
  18 | &gt;&gt;&gt; RUN npm run build
  19 |     RUN npm prune --omit=dev
--------------------
ERROR: failed to solve: process "/bin/sh -c npm run build" did not exit with code 0</div>
<div class="callout ok"><strong>BuildKit output is dense but complete: read it bottom-up.</strong> The last line names the failing command, the block above it points at the exact Dockerfile line with two lines of context, and the block above <em>that</em> is the command's own output with elapsed-second prefixes. <code>[build 5/6]</code> tells you the stage and the step. That is everything you need without scrolling, once you know where to look.</div>
<pre><code><span class="tok-comment"># When the interleaved progress output hides things</span>
docker build --progress=plain -f Dockerfile.backend -t api:test . 2&gt;&amp;1 | tail -20
<span class="tok-comment"># Stop just before the failing stage and get a shell there</span>
docker build --target build -t api:dbg -f Dockerfile.backend .
docker run --rm -it api:dbg sh -c 'ls -la; npx tsc --noEmit | head -3'</code></pre>
<div class="out">#12 [build 5/6] RUN npm run build
#12 0.412 &gt; blog@1.0.0 build
#12 17.80 src/services/cv/llm/index.ts(42,18): error TS2551
total 412
drwxr-xr-x  12 root root  4096 Aug 22 14:52 .
src/services/cv/llm/index.ts(42,18): error TS2551: Property 'keyForProvider' …</div>
<p><code>--target</code> is the technique worth remembering. Build up to the stage <em>before</em> the failure, get a shell inside it, and run the failing command by hand — now you can list files, check environment variables, and iterate in seconds instead of rebuilding each time.</p>
<div class="callout warn"><strong>Two things the neat example above does not show.</strong> First, the summary block under <code>&gt; [build 5/6]</code> keeps only the <em>last ten or so lines</em> of the failing command's output. When the command prints a long stack trace, the actual error line has already scrolled out of that block. Second, <code>--target</code> helps only when the failing step lives in a <em>later</em> stage than the one you target — <code>--target build</code> still runs every step of the <code>build</code> stage, including the one that fails. If the failing command is inside the stage you want a shell in, split it into its own stage first.</div>
<p>Both, measured on the course's Mac with a tiny Node project whose <code>src/index.js</code> does <code>require('./Auth.routes')</code> while the file on disk is <code>auth.routes.js</code>:</p>
<pre><code class="language-bash">docker build -t build-demo:1 . 2&gt;&amp;1 | grep -E 'Cannot find|&gt;&gt;&gt;|^ERROR|code:'</code></pre>
<div class="out">#10 0.240 Error: Cannot find module './Auth.routes'
#10 0.240   code: 'MODULE_NOT_FOUND',
#10 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
0.240   code: 'MODULE_NOT_FOUND',
   6 | &gt;&gt;&gt; RUN npm run build
ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1</div>
<p>The line that matters — <code>Cannot find module './Auth.routes'</code> — appears once, in the streamed <code>#10</code> output, and <strong>not</strong> in the summary block (which only repeats the tail of the stack trace, <code>code: 'MODULE_NOT_FOUND'</code>). Note also the Docker 29 wording of the last line: <code>did not complete successfully: exit code: 1</code>, where older versions said <code>did not exit with code 0</code>. Piping to <code>grep</code> needs <code>2&gt;&amp;1</code>, because BuildKit writes all its progress to stderr; when the output is not a terminal it switches to the plain <code>#N</code> format automatically, the same as <code>--progress=plain</code>.</p>
<p>And the <code>--target</code> technique done properly — the source copy in one stage, the build in the next:</p>
<pre><code class="language-dockerfile">FROM node:22-alpine AS src
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .

FROM src AS build
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app ./
CMD ["node", "src/index.js"]</code></pre>
<pre><code class="language-bash">docker build -q -f Dockerfile.ci --target src -t build-demo:src .
docker run --rm build-demo:src sh -c 'ls src; ls src | grep -i auth'</code></pre>
<div class="out">sha256:91a8afd712f69091e6f4300e7b14f5a5ed360fa41b407945dd4533d5129bbc11
auth.routes.js
index.js
auth.routes.js</div>
<p>Now you are standing exactly where the failing <code>RUN</code> would start, with every file it would see, and <code>node build.js</code> can be run and edited in seconds. Buildx also has an experimental <code>docker buildx debug</code> (enable with <code>BUILDX_EXPERIMENTAL=1</code>) that drops you into a shell at the failing step; it is marked experimental in buildx v0.37, so the stage split above is the method to rely on.</p>

<h3>Seven reasons it only fails in CI</h3>
${slide('dk-12', 23, 'Hoa-thường: Mac chạy được, Docker build (và CI) thì không')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · .dockerignore</span><span class="lz-t">a file exists locally and is excluded from the context</span><span class="lz-d">Your local build reads it from the filesystem; the CI build only sees the context. <code>docker build --no-cache</code> in a clean clone reproduces it.</span></div>
  <div class="lz-step"><span class="lz-k">2 · A stale local cache</span><span class="lz-t">your layers were built before the breaking change</span><span class="lz-d">The single most common cause. CI starts cold and hits the error; you never do. <code>--no-cache</code> is the test.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Uncommitted files</span><span class="lz-t">it works because of a file you never added</span><span class="lz-d">A config, a generated type, a lockfile update. <code>git stash -u &amp;&amp; docker build .</code> tells you in thirty seconds.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Case sensitivity</span><span class="lz-t">macOS is case-insensitive, Linux is not</span><span class="lz-d"><code>import { Foo } from './utils/Helper'</code> resolves locally and fails on a Linux runner. Endless in TypeScript projects developed on Macs.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Architecture</span><span class="lz-t">arm64 laptop, amd64 runner</span><span class="lz-d">Different prebuilt binaries, different native module builds, occasionally different bugs. <code>--platform linux/amd64</code> locally reproduces the runner.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Memory</span><span class="lz-t">exit 137 on a runner with less RAM than your machine</span><span class="lz-d">A build is not a container: the limit is the runner's. Reduce parallelism, or split the build — this project builds frontend and backend sequentially on its 6GB server for exactly this.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Secrets and network</span><span class="lz-t">a private registry token you have locally and CI does not</span><span class="lz-d">Or the reverse — CI has egress restrictions you do not. A <code>npm ci</code> that hangs is usually this.</span></div>
</div>
<pre><code><span class="tok-comment"># Reproduce a CI build locally, in one command</span>
git stash -u
docker build --no-cache --pull --platform linux/amd64 -f Dockerfile.backend -t api:ci . 2&gt;&amp;1 | tail -5
git stash pop</code></pre>
<div class="out"> =&gt; ERROR [build 5/6] RUN npm run build                                      21.7s
17.4 src/routes/index.ts(8,24): error TS2307: Cannot find module './Auth.routes'
ERROR: failed to solve: process "/bin/sh -c npm run build" did not exit with code 0</div>
<div class="callout warn"><strong>There it is: <code>./Auth.routes</code> versus <code>auth.routes.ts</code>.</strong> Case sensitivity, invisible on macOS, fatal on Linux. Four flags — <code>--no-cache</code>, <code>--pull</code>, <code>--platform</code>, plus a stashed working tree — reproduce almost every CI-only build failure on your own machine, where you can iterate in seconds instead of waiting for a runner.</div>

<h3>Run it step by step: <code>COPY … not found</code>, three ways</h3>
${slide('dk-12', 22, 'COPY … not found: file không nằm trong ngữ cảnh')}
<p>The most common build failure of all, and the message is identical for three different causes. All three on the course's Mac, with a two-line <code>Dockerfile.copy</code> (<code>FROM alpine:3.20</code> / <code>COPY config.json /etc/app/</code>):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1) the file does not exist</span>
docker build -f Dockerfile.copy -t copy-demo:1 . 2&gt;&amp;1 | grep ^ERROR
<span class="tok-comment"># 2) the file exists — but .dockerignore contains the line "config.json"</span>
ls -l config.json
docker build -f Dockerfile.copy -t copy-demo:1 . 2&gt;&amp;1 | grep ^ERROR
<span class="tok-comment"># 3) COPY ../secrets.env /etc/  — outside the context</span>
docker build -f Dockerfile.up -t copy-demo:2 . 2&gt;&amp;1 | grep ^ERROR</code></pre>
<div class="out">ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref …: "/config.json": not found
-rw-r--r--@ 1 admin  wheel  3 Sep 24 02:29 config.json
ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref …: "/config.json": not found
ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref …: "/secrets.env": not found</div>
<p>The leading <code>/</code> in <code>"/config.json"</code> is the root of the <strong>build context</strong> — the directory you passed as <code>.</code>, minus everything <code>.dockerignore</code> removes. BuildKit never looks at your disk directly, so a file that is excluded, or that sits above the context (<code>../</code>), simply does not exist for it. Docker 29 can tell you which of the three it is before you build:</p>
<pre><code class="language-bash">docker build --check -f Dockerfile.copy .</code></pre>
<div class="out">1 warning found (use docker --debug to expand):
 - CopyIgnoredFile: Attempting to Copy file "config.json" that is excluded by .dockerignore (line 2)</div>
<p><code>--check</code> runs the build checks (linting) without building anything. The same warning also appears as <code>WARN: CopyIgnoredFile</code> at the top of a normal build — easy to miss, so run <code>--check</code> when a COPY fails for a file you can see.</p>

<h3>Run it step by step: the case-sensitivity bug, reproduced on a Mac</h3>
<p>Same small project: <code>src/index.js</code> says <code>require('./Auth.routes')</code>, the file is <code>src/auth.routes.js</code>. Three ways of running the same build script:</p>
<pre><code class="language-bash">node build.js                                                   <span class="tok-comment"># on macOS itself</span>
docker run --rm -v "$PWD":/app -w /app node:22-alpine node build.js   <span class="tok-comment"># Linux, but a bind mount</span>
docker build -t build-demo:1 . 2&gt;&amp;1 | grep 'Cannot find'           <span class="tok-comment"># Linux, COPY into the image</span></code></pre>
<div class="out">routes: /login /logout
build ok
routes: /login /logout
build ok
#10 0.205 Error: Cannot find module './Auth.routes'</div>
<p>The surprise is the middle line. The container is Linux, yet the build passes — because a bind mount on Docker Desktop is still your Mac's filesystem underneath, and APFS does not distinguish <code>Auth</code> from <code>auth</code>. Only <code>docker build</code>, which copies files into a real Linux filesystem, fails the way a CI runner does. So "I tested it in a container" is not enough; "I tested it with <code>docker build</code>" is.</p>
<h3>When the cache is the liar</h3>
${slide('dk-12', 24, 'Cache khoá theo chuỗi lệnh, không theo thế giới bên ngoài')}
<pre><code>docker build -t api:test . 2&gt;&amp;1 | grep -c CACHED
docker build --no-cache -t api:test . 2&gt;&amp;1 | tail -3</code></pre>
<div class="out">6
 =&gt; ERROR [deps 3/4] RUN npm ci                                              9.1s
8.90 npm error notarget No matching version found for @prisma/client@6.9.0
ERROR: failed to solve: process "/bin/sh -c npm ci" did not exit with code 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">A cached <code>apt-get update</code></span><span class="v">The classic (Lesson 5.1): the package index is from whenever that layer was built, so <code>apt-get install</code> asks for versions that no longer exist. Always combine update and install in one <code>RUN</code>.</span></div>
  <div class="kv"><span class="k">A cached <code>COPY</code> of something that changed</span><span class="v">BuildKit hashes file contents, so this is rare — but a <code>.dockerignore</code> excluding the changed file makes it look exactly like a cache bug.</span></div>
  <div class="kv"><span class="k">A cached network fetch</span><span class="v"><code>RUN curl … | sh</code> is cached on the command string, not the response. The upstream script changed and your build did not notice for two months.</span></div>
  <div class="kv"><span class="k">Cache from another branch</span><span class="v">With <code>cache-from</code> in CI, a build can restore layers built from different code. Usually correct and occasionally very confusing; scope the cache key per branch when it matters.</span></div>
  <div class="kv"><span class="k">The test</span><span class="v"><code>--no-cache --pull</code>. If it passes without cache and fails with it, the cache is the bug — and the fix is nearly always instruction ordering (Lesson 5.2).</span></div>
</div>
<p>A correction first: the first command above used to be printed without <code>2&gt;&amp;1</code>. BuildKit writes its progress — including every <code>CACHED</code> line — to <strong>stderr</strong>, so <code>docker build … | grep -c CACHED</code> counts <code>0</code> no matter what. The course measured it, with a Dockerfile that records the build time and a value fetched from the network:</p>
<pre><code class="language-bash">cat Dockerfile.cache
docker run --rm cache-demo:1 cat /built-at /alpine-latest
docker build -f Dockerfile.cache -t cache-demo:1 . | grep -c CACHED
docker build -f Dockerfile.cache -t cache-demo:1 . 2&gt;&amp;1 | grep -c CACHED
docker run --rm cache-demo:1 cat /built-at
docker build -q --no-cache -f Dockerfile.cache -t cache-demo:1 . &gt;/dev/null &amp;&amp; docker run --rm cache-demo:1 cat /built-at</code></pre>
<div class="out">FROM alpine:3.20
RUN date +%T &gt; /built-at
RUN wget -qO- https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/aarch64/latest-releases.yaml | grep -m1 version: &gt; /alpine-latest
19:29:28
  version: 3.24.2
…
0
2
19:29:28
19:29:34</div>
<p>(The middle part of the real output is the full build log, printed to the terminal because it was never piped — shortened here.) Both <code>RUN</code> lines were <code>CACHED</code> on the rebuild: the time inside the image stayed <code>19:29:28</code>, and the "latest Alpine version" stays <code>3.24.2</code> forever, even the day 3.25 is released. Only <code>--no-cache</code> ran them again. The cache key of a <code>RUN</code> is its command string plus the layer below it; nothing the command reads from the outside world is part of it. To refresh deliberately, change the string — for example <code>ARG ALPINE_INDEX_DATE</code> used inside the <code>RUN</code> and passed with <code>--build-arg</code>.</p>

<h3>The build is slow, or the context is enormous</h3>
${slide('dk-12', 25, 'Ngữ cảnh 220 MB → 446 B: .dockerignore phải đặt đúng chỗ')}
<pre><code>docker build -t api:test . 2&gt;&amp;1 | head -3
du -sh .git node_modules .next 2&gt;/dev/null
cat .dockerignore</code></pre>
<div class="out"> =&gt; [internal] load build context                                            41.3s
 =&gt; =&gt; transferring context: 1.87GB                                          41.1s
612M	.git
1.1G	node_modules
184M	.next
node_modules
.git
.next
dist
*.log</div>
<p>Forty-one seconds before a single instruction runs, because the daemon is being handed 1.87GB it will not use. A <code>.dockerignore</code> fixes it completely — and note that the file above exists but the build still transferred 1.87GB, which means it is in the wrong directory: <code>.dockerignore</code> must sit next to the <em>build context</em> root, not next to the Dockerfile, when those differ.</p>
<p>Measured on the course's Mac, with 150 MB in <code>node_modules</code> and a 60 MB database dump in <code>data/</code>, and a Dockerfile that does <code>COPY . .</code>:</p>
<pre><code class="language-bash">docker build --no-cache -f Dockerfile.ctx . 2&gt;&amp;1 | grep -E 'transferring context|/app$'</code></pre>
<table>
<tr><th>Where the ignore file is</th><th>transferring context</th><th><code>du -sh /app</code> in the image</th></tr>
<tr><td>none</td><td><code>220.26MB 1.9s</code></td><td><code>210.1M</code></td></tr>
<tr><td><code>.dockerignore</code> at the context root</td><td><code>446B 0.0s</code></td><td><code>56.0K</code></td></tr>
<tr><td><code>docker/.dockerignore</code>, built with <code>-f docker/Dockerfile .</code></td><td><code>220.26MB 1.9s</code> — ignored</td><td><code>210.1M</code></td></tr>
<tr><td><code>docker/Dockerfile.dockerignore</code> (named after the Dockerfile)</td><td><code>529B 0.0s</code></td><td><code>64.0K</code></td></tr>
</table>
<p>Two facts worth keeping. The ignore file is read from the <strong>root of the context</strong> — unless a file named <code>&lt;Dockerfile name&gt;.dockerignore</code> sits next to the Dockerfile, which then wins; that is the clean way to give <code>Dockerfile.backend</code> and <code>Dockerfile.frontend</code> their own rules. And BuildKit only transfers what the instructions need: with <code>COPY package.json /app/</code> instead of <code>COPY . .</code>, the same 210 MB directory transferred <code>123B</code>. A huge context therefore means a broad <code>COPY</code> <em>and</em> a missing ignore file — and the broad <code>COPY</code> also drags your local <code>node_modules</code> (built for macOS) into a Linux image.</p>

<h3>Green build, dead image</h3>
${slide('dk-12', 26, 'Build xanh, ảnh chết: glibc trong ảnh musl')}
<pre><code>docker build -t ghcr.io/me/api:1.4.3 . &amp;&amp; echo "build ✓"
docker push ghcr.io/me/api:1.4.3 &gt;/dev/null &amp;&amp; echo "push ✓"
docker run --rm ghcr.io/me/api:1.4.3 node -e 'require("@prisma/client")' 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">build ✓
push ✓
Error: Query engine library for current platform "linux-musl-openssl-3.0.x" could not be found.
       Files in query engine directory: libquery_engine-debian-openssl-3.0.x.so.node</div>
<div class="callout warn"><strong>This is the most expensive lesson in the course, and it cost this project seven minutes of 502s.</strong> A deploy script ran <code>docker build .</code> — picking up the default <code>Dockerfile</code> instead of the <code>Dockerfile.backend</code> that compose uses — so an Alpine (musl) base received a glibc Prisma engine. Build green, push green, swap green, and then the backend restarted in an endless loop with the API returning 502. The rule that came out of it: <strong>a green build does not mean a runnable image.</strong> Always pass <code>-f</code> with the exact Dockerfile compose uses, and add one smoke run before the push:</div>
<pre><code><span class="tok-comment"># The check that would have caught it, in one line</span>
docker run --rm ghcr.io/me/api:1.4.3 node -e 'require("@prisma/client"); console.log("ok")' \\
  || { echo "image does not start — refusing to push"; exit 1; }</code></pre>
<div class="out">ok</div>

<h3>Run it step by step: a green build that cannot run, in thirty seconds</h3>
<p>You do not need Prisma to see this failure. Copy any glibc program into an Alpine (musl) image:</p>
<pre><code class="language-dockerfile">FROM debian:bookworm-slim AS tool
RUN cp /usr/bin/stat /usr/local/bin/report

FROM alpine:3.20
COPY --from=tool /usr/local/bin/report /usr/local/bin/report
CMD ["report", "/etc/hostname"]</code></pre>
<pre><code class="language-bash">docker build -q -f Dockerfile.libc -t libc-demo:1 . &amp;&amp; echo "build ✓"
docker run --name libc libc-demo:1; echo "exit=$?"
docker run --rm --entrypoint sh libc-demo:1 -c 'ls -l /usr/local/bin/report; ls /lib/ld-*'
docker run --rm debian:bookworm-slim sh -c 'ldd /usr/bin/stat | grep ld-linux'</code></pre>
<div class="out">sha256:155f4e612b750e12d23b9c770d6784be11058eb1e3af8a6945746774facbdaee
build ✓
exec /usr/local/bin/report: no such file or directory
exit=255
-rwxr-xr-x    1 root     root        134320 Sep 23 19:30 /usr/local/bin/report
/lib/ld-musl-aarch64.so.1
	/lib/ld-linux-aarch64.so.1 (0x0000ffffbafc0000)</div>
<p>The file exists and is executable, and the kernel still says "no such file". The missing file is the <strong>dynamic loader</strong>: the Debian binary asks for <code>/lib/ld-linux-aarch64.so.1</code> (glibc), while Alpine only has <code>/lib/ld-musl-aarch64.so.1</code>. It is the same shape as the CRLF shebang in Lesson 12.2 — a missing <em>interpreter</em> reported as a missing file — and the same shape as the Prisma incident, where a native engine built for glibc landed in a musl image. The smoke check that turns it into a failed build:</p>
<pre><code class="language-bash">docker run --rm libc-demo:1 report --version &gt;/dev/null 2&gt;&amp;1 || echo "ảnh không chạy — KHÔNG đẩy"</code></pre>
<div class="out">ảnh không chạy — KHÔNG đẩy</div>
<table>
<tr><th>Step in a pipeline</th><th>What it proves</th><th>What it does not</th></tr>
<tr><td><code>docker build</code> succeeds</td><td>every instruction exited 0</td><td>that the result starts, on the right CPU, with the right libc</td></tr>
<tr><td><code>docker push</code> succeeds</td><td>the registry stored the bytes</td><td>anything about the bytes</td></tr>
<tr><td><code>docker run --rm img &lt;smallest real command&gt;</code></td><td>the binary, its loader and its libraries work together</td><td>that the whole app is correct — that is what tests and a <code>/health</code> check are for</td></tr>
</table>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your pull request is green on your Mac and red on GitHub Actions with <code>Cannot find module</code>. Reproduce the CI failure locally, find the real error line, and add the check that would have stopped a broken image.</p><ol>
<li>In <code>~/thu-docker/build-hong</code> create <code>package.json</code> (<code>"scripts": { "build": "node build.js" }</code>), <code>src/auth.routes.js</code>, <code>src/index.js</code> that does <code>require('./Auth.routes')</code>, <code>build.js</code> that requires <code>./src/index.js</code>, and the six-line single-stage Dockerfile (<code>COPY package.json</code>, <code>RUN npm install --omit=dev</code>, <code>COPY . .</code>, <code>RUN npm run build</code>).</li>
<li>Run <code>node build.js</code> (passes), then <code>docker build -t thu-build:1 .</code> (fails). Find the error line with <code>docker build -t thu-build:1 . 2&gt;&amp;1 | grep -n 'Cannot find'</code> and note that it is not inside the summary block.</li>
<li>Add a <code>.dockerignore</code> containing the single line <code>package.json</code>, run <code>docker build --check .</code> and then <code>docker build -t thu-build:1 .</code>; read the warning and the error, then delete that <code>.dockerignore</code>.</li>
<li>Fix the <code>require</code>, rebuild, and add the smoke check: <code>docker run --rm thu-build:1 node -e 'require("./src/index.js")' || echo "KHÔNG đẩy"</code>.</li>
<li>Clean up: <code>docker image rm thu-build:1</code>, <code>cd .. &amp;&amp; rm -rf build-hong</code>.</li></ol>
<p><strong>Done when:</strong> step 2 shows <code>Cannot find module './Auth.routes'</code> only in a <code>#N</code> line, step 3 prints <code>WARNING: CopyIgnoredFile</code> and then <code>"/package.json": not found</code>, and after step 4 the build is green and the smoke check prints <code>routes: /login /logout</code> instead of <code>KHÔNG đẩy</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BuildKit</span><span class="v">Docker's build engine; it prints progress as numbered steps (<code>#10</code>) to stderr.</span></div>
  <div class="kv"><span class="k">Build context</span><span class="v">The directory sent to the builder, minus <code>.dockerignore</code>; <code>COPY</code> can only see this.</span></div>
  <div class="kv"><span class="k">Stage / <code>--target</code></span><span class="v">A <code>FROM … AS name</code> section; <code>--target name</code> stops the build after it.</span></div>
  <div class="kv"><span class="k">Cache key</span><span class="v">What decides whether a step is reused: the instruction text (and file hashes for <code>COPY</code>) plus the parent layer.</span></div>
  <div class="kv"><span class="k">Build checks (<code>--check</code>)</span><span class="v">Lint rules run on the Dockerfile without building, e.g. <code>CopyIgnoredFile</code>.</span></div>
  <div class="kv"><span class="k">Case sensitivity</span><span class="v">Linux treats <code>Auth</code> and <code>auth</code> as different names; macOS by default does not.</span></div>
  <div class="kv"><span class="k">Dynamic loader</span><span class="v">The program (<code>ld-linux…</code> or <code>ld-musl…</code>) that starts a dynamically linked binary.</span></div>
  <div class="kv"><span class="k">Smoke check</span><span class="v">One tiny real run of a fresh image before it is pushed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read BuildKit bottom-up for <em>where</em>, then scroll up (or grep with <code>2&gt;&amp;1</code>) for <em>why</em> — the summary block keeps only the last ~10 lines.</li>
<li><code>COPY … "/x": not found</code> means "not in the context": missing, excluded by <code>.dockerignore</code>, or outside with <code>../</code>; <code>docker build --check</code> tells which.</li>
<li>Case-sensitivity bugs pass on macOS and even in a bind-mounted container; only <code>docker build</code> (like CI) catches them.</li>
<li>A <code>RUN</code> is cached on its text, not on what it downloads; <code>--no-cache --pull</code> is the test.</li>
<li>The ignore file lives at the context root, or as <code>&lt;Dockerfile&gt;.dockerignore</code> next to the Dockerfile; a broad <code>COPY . .</code> without it ships hundreds of MB.</li>
<li>A green build proves only that instructions ran; one <code>docker run</code> smoke check before the push catches wrong libc, arch or missing files.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Dockerfile best practices</span><span class="lc-sub">The official list, worth rereading once you have built a few images — most of the CI-only failures above are a best practice not followed.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/context/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Build context and .dockerignore</span><span class="lc-sub">What gets sent to the daemon, where <code>.dockerignore</code> must live when the context and Dockerfile are in different places, and the named-context feature.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/debug/" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Debugging a build</span><span class="lc-sub"><code>--progress=plain</code>, <code>--target</code>, and <code>buildx debug --invoke</code> — which drops you into a shell at the exact failing step, keeping everything built so far.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: seven builds that only fail in CI</span><span class="lc-sub">Graded exercises: seven builds green locally and red on a runner. Identify the cause of each and write the one command that reproduces it on your own machine.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> treating a green build as a working image. Building only proves the instructions ran; it proves nothing about whether the result starts. Every failure mode in this course that reached production shares that shape — a glibc engine in a musl image, a frontend built without a public variable, a stale <code>dist/</code> that never mounted a router. All three were green at build, green at push, green at swap, and broken in production. The cheapest possible defence is one <code>docker run</code> against the image you just built, executing the smallest thing that would fail if it were wrong: load the database client, print the version, hit <code>/health</code>. Ten seconds in the pipeline, before the push — and it converts an outage into a failed build.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Read BuildKit output bottom-up: the last line names the command, the block above it names the Dockerfile line, and <code>--target</code> gets you a shell in the stage before the failure. A CI-only failure is never random — <code>--no-cache --pull --platform linux/amd64</code> on a stashed working tree reproduces almost all of them locally. And a green build is not a running image: add one <code>docker run</code> smoke check before the push.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Bản dựng hỏng, hoặc chỉ hỏng trên CI</h2>
<p class="lead">Một lượt dựng hỏng trên máy bạn thì nói thẳng cho bạn biết sai ở đâu. Một lượt dựng thành công trên máy bạn mà hỏng trên CI lại là con thú khác — khác biệt đó không bao giờ ngẫu nhiên, và chỉ có khoảng bảy chỗ nó nấp được.</p>

<h3>Đọc thứ BuildKit nói với bạn</h3>
${slide('dk-12', 20, 'Build hỏng: hỏng ở đâu, và chỉ hỏng ở CI hay cả máy bạn?')}
${slide('dk-12', 21, 'BuildKit: đọc từ dưới lên — dòng lỗi thật nằm phía trên')}
<pre><code>docker build -f Dockerfile.backend -t api:test . 2&gt;&amp;1 | tail -12</code></pre>
<div class="out"> =&gt; ERROR [build 5/6] RUN npm run build                                     18.2s
------
 &gt; [build 5/6] RUN npm run build:
0.412 &gt; blog@1.0.0 build
0.413 &gt; tsc -p tsconfig.json
17.8 src/services/cv/llm/index.ts(42,18): error TS2551: Property 'keyForProvider'
17.8   does not exist on type 'Gateway'. Did you mean 'gatewayKey'?
------
Dockerfile.backend:18
--------------------
  17 |     COPY . .
  18 | &gt;&gt;&gt; RUN npm run build
  19 |     RUN npm prune --omit=dev
--------------------
ERROR: failed to solve: process "/bin/sh -c npm run build" did not exit with code 0</div>
<div class="callout ok"><strong>Kết quả của BuildKit đặc nhưng đầy đủ: hãy đọc TỪ DƯỚI LÊN.</strong> Dòng cuối gọi tên câu lệnh hỏng, khối ngay trên nó chỉ vào đúng dòng trong Dockerfile kèm hai dòng ngữ cảnh, và khối trên nữa là kết quả của chính câu lệnh đó với tiền tố số giây đã trôi. Dòng <code>[build 5/6]</code> cho bạn biết tầng nào và bước nào. Chừng đó là tất cả những gì bạn cần mà không phải cuộn màn hình, một khi bạn biết nhìn vào đâu.</div>
<pre><code><span class="tok-comment"># Khi kết quả tiến trình đan xen che mất mọi thứ</span>
docker build --progress=plain -f Dockerfile.backend -t api:test . 2&gt;&amp;1 | tail -20
<span class="tok-comment"># Dừng ngay TRƯỚC cái tầng đang hỏng rồi lấy một cái shell ở đó</span>
docker build --target build -t api:dbg -f Dockerfile.backend .
docker run --rm -it api:dbg sh -c 'ls -la; npx tsc --noEmit | head -3'</code></pre>
<div class="out">#12 [build 5/6] RUN npm run build
#12 0.412 &gt; blog@1.0.0 build
#12 17.80 src/services/cv/llm/index.ts(42,18): error TS2551
total 412
drwxr-xr-x  12 root root  4096 Aug 22 14:52 .
src/services/cv/llm/index.ts(42,18): error TS2551: Property 'keyForProvider' …</div>
<p><code>--target</code> là kỹ thuật đáng nhớ. Hãy dựng lên tới cái tầng NGAY TRƯỚC chỗ hỏng, lấy một cái shell bên trong, rồi chạy câu lệnh hỏng bằng tay — giờ bạn liệt kê được file, kiểm được biến môi trường, và lặp trong vài giây thay vì dựng lại mỗi lần.</p>
<div class="callout warn"><strong>Hai điều mà ví dụ gọn gàng ở trên không cho thấy.</strong> Thứ nhất, khối tóm tắt dưới <code>&gt; [build 5/6]</code> chỉ giữ khoảng <em>mười dòng CUỐI</em> output của câu lệnh hỏng. Khi câu lệnh in một stack trace dài, dòng lỗi thật đã trôi ra khỏi khối đó. Thứ hai, <code>--target</code> chỉ giúp khi bước hỏng nằm ở một stage <em>SAU</em> stage bạn nhắm tới — <code>--target build</code> vẫn chạy mọi bước của stage <code>build</code>, kể cả chính bước đang hỏng. Nếu câu lệnh hỏng nằm trong đúng stage bạn muốn có shell, hãy tách nó ra một stage riêng trước.</div>
<p>Cả hai, đo trên máy Mac của khoá học với một dự án Node nhỏ có <code>src/index.js</code> gọi <code>require('./Auth.routes')</code> trong khi file trên đĩa tên <code>auth.routes.js</code>:</p>
<pre><code class="language-bash">docker build -t build-demo:1 . 2&gt;&amp;1 | grep -E 'Cannot find|&gt;&gt;&gt;|^ERROR|code:'</code></pre>
<div class="out">#10 0.240 Error: Cannot find module './Auth.routes'
#10 0.240   code: 'MODULE_NOT_FOUND',
#10 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
0.240   code: 'MODULE_NOT_FOUND',
   6 | &gt;&gt;&gt; RUN npm run build
ERROR: failed to build: failed to solve: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1</div>
<p>Dòng quan trọng — <code>Cannot find module './Auth.routes'</code> — chỉ xuất hiện MỘT lần, trong phần output <code>#10</code> chạy theo thời gian thực, và <strong>KHÔNG</strong> có trong khối tóm tắt (khối đó chỉ lặp lại đuôi stack trace, <code>code: 'MODULE_NOT_FOUND'</code>). Để ý cả câu chữ của Docker 29 ở dòng cuối: <code>did not complete successfully: exit code: 1</code>, trong khi bản cũ nói <code>did not exit with code 0</code>. Muốn đưa qua <code>grep</code> thì cần <code>2&gt;&amp;1</code>, vì BuildKit ghi mọi dòng tiến độ ra stderr; khi output không phải một terminal, nó tự chuyển sang dạng <code>#N</code> thuần, y như <code>--progress=plain</code>.</p>
<p>Và kỹ thuật <code>--target</code> làm cho đúng — chép mã nguồn ở một stage, dựng ở stage kế tiếp:</p>
<pre><code class="language-dockerfile">FROM node:22-alpine AS src
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .

FROM src AS build
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app ./
CMD ["node", "src/index.js"]</code></pre>
<pre><code class="language-bash">docker build -q -f Dockerfile.ci --target src -t build-demo:src .
docker run --rm build-demo:src sh -c 'ls src; ls src | grep -i auth'</code></pre>
<div class="out">sha256:91a8afd712f69091e6f4300e7b14f5a5ed360fa41b407945dd4533d5129bbc11
auth.routes.js
index.js
auth.routes.js</div>
<p>Giờ bạn đứng đúng chỗ lệnh <code>RUN</code> hỏng sẽ bắt đầu, với mọi file nó sẽ thấy, và chạy/sửa <code>node build.js</code> trong vài giây. Buildx còn có <code>docker buildx debug</code> (bật bằng <code>BUILDX_EXPERIMENTAL=1</code>) thả bạn vào shell ngay bước hỏng; nó vẫn ghi là thử nghiệm ở buildx v0.37, nên cách tách stage ở trên mới là cách để dựa vào.</p>

<h3>Bảy lý do nó chỉ hỏng trên CI</h3>
${slide('dk-12', 23, 'Hoa-thường: Mac chạy được, Docker build (và CI) thì không')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · .dockerignore</span><span class="lz-t">một file có ở máy bạn và bị loại khỏi ngữ cảnh</span><span class="lz-d">Lượt dựng cục bộ của bạn đọc nó từ hệ thống file; lượt dựng trên CI chỉ thấy ngữ cảnh. Chạy <code>docker build --no-cache</code> trong một bản clone sạch là tái hiện được.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cache cục bộ đã cũ</span><span class="lz-t">các lớp của bạn được dựng trước cái thay đổi gây hỏng</span><span class="lz-d">Nguyên nhân phổ biến nhất, bỏ xa các nguyên nhân khác. CI khởi động lạnh và gặp lỗi; bạn thì không bao giờ. <code>--no-cache</code> là phép thử.</span></div>
  <div class="lz-step"><span class="lz-k">3 · File chưa commit</span><span class="lz-t">nó chạy được nhờ một file bạn chưa bao giờ add</span><span class="lz-d">Một file cấu hình, một kiểu dữ liệu sinh ra, một lockfile mới cập nhật. <code>git stash -u &amp;&amp; docker build .</code> cho bạn biết trong ba mươi giây.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Phân biệt hoa thường</span><span class="lz-t">macOS không phân biệt, Linux thì có</span><span class="lz-d"><code>import { Foo } from './utils/Helper'</code> phân giải được ở máy bạn và hỏng trên một runner Linux. Bất tận trong các dự án TypeScript phát triển trên máy Mac.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Kiến trúc</span><span class="lz-t">máy cá nhân arm64, runner amd64</span><span class="lz-d">Khác tệp nhị phân dựng sẵn, khác cách dựng module gốc, thỉnh thoảng khác cả lỗi. <code>--platform linux/amd64</code> ở máy bạn tái hiện được cái runner.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Bộ nhớ</span><span class="lz-t">exit 137 trên một runner ít RAM hơn máy bạn</span><span class="lz-d">Một lượt dựng không phải một container: hạn mức ở đây là của runner. Hãy giảm mức song song, hoặc tách lượt dựng ra — dự án này dựng frontend với backend tuần tự trên con máy chủ 6GB đúng vì chuyện này.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Bí mật và mạng</span><span class="lz-t">một token registry riêng mà bạn có còn CI thì không</span><span class="lz-d">Hoặc ngược lại — CI có hạn chế lối ra mà bạn không có. Một lệnh <code>npm ci</code> treo thì thường là chuyện này.</span></div>
</div>
<pre><code><span class="tok-comment"># Tái hiện một lượt dựng CI ngay tại máy, trong một câu lệnh</span>
git stash -u
docker build --no-cache --pull --platform linux/amd64 -f Dockerfile.backend -t api:ci . 2&gt;&amp;1 | tail -5
git stash pop</code></pre>
<div class="out"> =&gt; ERROR [build 5/6] RUN npm run build                                      21.7s
17.4 src/routes/index.ts(8,24): error TS2307: Cannot find module './Auth.routes'
ERROR: failed to solve: process "/bin/sh -c npm run build" did not exit with code 0</div>
<div class="callout warn"><strong>Nó đây rồi: <code>./Auth.routes</code> so với <code>auth.routes.ts</code>.</strong> Phân biệt hoa thường, vô hình trên macOS, chí mạng trên Linux. Bốn cái cờ — <code>--no-cache</code>, <code>--pull</code>, <code>--platform</code>, cộng một cây làm việc đã stash — tái hiện được gần như mọi kiểu hỏng chỉ-xảy-ra-trên-CI ngay tại máy bạn, nơi bạn lặp trong vài giây thay vì ngồi chờ một cái runner.</div>

<h3>Chạy thử từng bước: <code>COPY … not found</code>, ba kiểu</h3>
${slide('dk-12', 22, 'COPY … not found: file không nằm trong ngữ cảnh')}
<p>Kiểu build hỏng phổ biến nhất, và câu báo lỗi giống hệt nhau cho ba nguyên nhân khác nhau. Cả ba trên máy Mac của khoá học, với một <code>Dockerfile.copy</code> hai dòng (<code>FROM alpine:3.20</code> / <code>COPY config.json /etc/app/</code>):</p>
<pre><code class="language-bash"><span class="tok-comment"># 1) file không tồn tại</span>
docker build -f Dockerfile.copy -t copy-demo:1 . 2&gt;&amp;1 | grep ^ERROR
<span class="tok-comment"># 2) file CÓ — nhưng .dockerignore có dòng "config.json"</span>
ls -l config.json
docker build -f Dockerfile.copy -t copy-demo:1 . 2&gt;&amp;1 | grep ^ERROR
<span class="tok-comment"># 3) COPY ../secrets.env /etc/  — nằm ngoài ngữ cảnh</span>
docker build -f Dockerfile.up -t copy-demo:2 . 2&gt;&amp;1 | grep ^ERROR</code></pre>
<div class="out">ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref …: "/config.json": not found
-rw-r--r--@ 1 admin  wheel  3 Sep 24 02:29 config.json
ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref …: "/config.json": not found
ERROR: failed to build: failed to solve: failed to compute cache key: failed to calculate checksum of ref …: "/secrets.env": not found</div>
<p>Dấu <code>/</code> đứng đầu trong <code>"/config.json"</code> là gốc của <strong>NGỮ CẢNH DỰNG</strong> — thư mục bạn truyền vào bằng dấu <code>.</code>, trừ đi mọi thứ <code>.dockerignore</code> loại ra. BuildKit không bao giờ nhìn thẳng vào đĩa của bạn, nên một file bị loại, hoặc nằm phía trên ngữ cảnh (<code>../</code>), đơn giản là không tồn tại với nó. Docker 29 nói được cho bạn là kiểu nào trong ba kiểu trước cả khi build:</p>
<pre><code class="language-bash">docker build --check -f Dockerfile.copy .</code></pre>
<div class="out">1 warning found (use docker --debug to expand):
 - CopyIgnoredFile: Attempting to Copy file "config.json" that is excluded by .dockerignore (line 2)</div>
<p><code>--check</code> chạy các phép kiểm của build (lint) mà không dựng gì. Cảnh báo đó cũng hiện thành <code>WARN: CopyIgnoredFile</code> ở đầu một lượt build thường — rất dễ bỏ qua, nên hãy chạy <code>--check</code> khi một lệnh COPY hỏng với một file bạn đang nhìn thấy rõ ràng.</p>

<h3>Chạy thử từng bước: lỗi hoa-thường, tái hiện ngay trên Mac</h3>
<p>Vẫn dự án nhỏ đó: <code>src/index.js</code> ghi <code>require('./Auth.routes')</code>, còn file tên <code>src/auth.routes.js</code>. Ba cách chạy cùng một script build:</p>
<pre><code class="language-bash">node build.js                                                   <span class="tok-comment"># ngay trên macOS</span>
docker run --rm -v "$PWD":/app -w /app node:22-alpine node build.js   <span class="tok-comment"># Linux, nhưng bind mount</span>
docker build -t build-demo:1 . 2&gt;&amp;1 | grep 'Cannot find'           <span class="tok-comment"># Linux, COPY vào ảnh</span></code></pre>
<div class="out">routes: /login /logout
build ok
routes: /login /logout
build ok
#10 0.205 Error: Cannot find module './Auth.routes'</div>
<p>Bất ngờ nằm ở dòng giữa. Container là Linux, vậy mà build vẫn qua — vì bind mount trên Docker Desktop bên dưới vẫn là hệ thống file của Mac, và APFS không phân biệt <code>Auth</code> với <code>auth</code>. Chỉ <code>docker build</code>, thứ chép file vào một hệ thống file Linux thật, mới hỏng giống runner CI. Nên "tôi đã thử trong container" là chưa đủ; "tôi đã thử bằng <code>docker build</code>" mới đủ.</p>
<h3>Khi cache mới là kẻ nói dối</h3>
${slide('dk-12', 24, 'Cache khoá theo chuỗi lệnh, không theo thế giới bên ngoài')}
<pre><code>docker build -t api:test . 2&gt;&amp;1 | grep -c CACHED
docker build --no-cache -t api:test . 2&gt;&amp;1 | tail -3</code></pre>
<div class="out">6
 =&gt; ERROR [deps 3/4] RUN npm ci                                              9.1s
8.90 npm error notarget No matching version found for @prisma/client@6.9.0
ERROR: failed to solve: process "/bin/sh -c npm ci" did not exit with code 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Một lệnh <code>apt-get update</code> đã lưu đệm</span><span class="v">Cái kinh điển (Bài 5.1): chỉ mục gói là từ lúc cái lớp đó được dựng, nên <code>apt-get install</code> đi xin những phiên bản không còn tồn tại. Hãy luôn gộp update với install vào cùng một lệnh <code>RUN</code>.</span></div>
  <div class="kv"><span class="k">Một lệnh <code>COPY</code> đã lưu đệm cho thứ đã đổi</span><span class="v">BuildKit băm nội dung file nên chuyện này hiếm — nhưng một dòng <code>.dockerignore</code> loại đúng cái file vừa đổi sẽ trông y hệt một cái lỗi của cache.</span></div>
  <div class="kv"><span class="k">Một lượt tải mạng đã lưu đệm</span><span class="v"><code>RUN curl … | sh</code> được lưu đệm theo CHUỖI câu lệnh, không theo phản hồi. Cái script ở thượng nguồn đã đổi và lượt dựng của bạn không nhận ra suốt hai tháng.</span></div>
  <div class="kv"><span class="k">Cache từ một nhánh khác</span><span class="v">Với <code>cache-from</code> trong CI, một lượt dựng có thể khôi phục những lớp dựng từ mã khác. Thường là đúng và thỉnh thoảng rất khó hiểu; hãy giới hạn khoá cache theo từng nhánh khi chuyện đó quan trọng.</span></div>
  <div class="kv"><span class="k">Phép thử</span><span class="v"><code>--no-cache --pull</code>. Nếu không có cache thì qua mà có cache thì hỏng, thì cache chính là cái lỗi — và cách chữa gần như luôn là thứ tự các chỉ thị (Bài 5.2).</span></div>
</div>
<p>Trước hết là một đính chính: lệnh đầu tiên ở trên trước đây in ra mà không có <code>2&gt;&amp;1</code>. BuildKit ghi tiến độ — kể cả mọi dòng <code>CACHED</code> — ra <strong>stderr</strong>, nên <code>docker build … | grep -c CACHED</code> luôn đếm được <code>0</code>. Khoá học đã đo, với một Dockerfile ghi lại giờ build và một giá trị lấy từ mạng:</p>
<pre><code class="language-bash">cat Dockerfile.cache
docker run --rm cache-demo:1 cat /built-at /alpine-latest
docker build -f Dockerfile.cache -t cache-demo:1 . | grep -c CACHED
docker build -f Dockerfile.cache -t cache-demo:1 . 2&gt;&amp;1 | grep -c CACHED
docker run --rm cache-demo:1 cat /built-at
docker build -q --no-cache -f Dockerfile.cache -t cache-demo:1 . &gt;/dev/null &amp;&amp; docker run --rm cache-demo:1 cat /built-at</code></pre>
<div class="out">FROM alpine:3.20
RUN date +%T &gt; /built-at
RUN wget -qO- https://dl-cdn.alpinelinux.org/alpine/latest-stable/releases/aarch64/latest-releases.yaml | grep -m1 version: &gt; /alpine-latest
19:29:28
  version: 3.24.2
…
0
2
19:29:28
19:29:34</div>
<p>(Phần giữa của output thật là toàn bộ log build, in thẳng ra terminal vì nó không hề đi qua ống — ở đây được rút gọn.) Cả hai dòng <code>RUN</code> đều <code>CACHED</code> ở lần dựng lại: giờ bên trong ảnh vẫn là <code>19:29:28</code>, và "phiên bản Alpine mới nhất" sẽ mãi là <code>3.24.2</code>, kể cả vào ngày 3.25 ra mắt. Chỉ <code>--no-cache</code> mới chạy lại chúng. Khoá cache của một <code>RUN</code> là chuỗi câu lệnh cộng với tầng bên dưới nó; không có thứ gì câu lệnh đọc từ thế giới bên ngoài nằm trong đó. Muốn làm mới có chủ đích thì hãy đổi chuỗi — ví dụ một <code>ARG ALPINE_INDEX_DATE</code> dùng bên trong <code>RUN</code> và truyền vào bằng <code>--build-arg</code>.</p>

<h3>Dựng chậm, hoặc ngữ cảnh khổng lồ</h3>
${slide('dk-12', 25, 'Ngữ cảnh 220 MB → 446 B: .dockerignore phải đặt đúng chỗ')}
<pre><code>docker build -t api:test . 2&gt;&amp;1 | head -3
du -sh .git node_modules .next 2&gt;/dev/null
cat .dockerignore</code></pre>
<div class="out"> =&gt; [internal] load build context                                            41.3s
 =&gt; =&gt; transferring context: 1.87GB                                          41.1s
612M	.git
1.1G	node_modules
184M	.next
node_modules
.git
.next
dist
*.log</div>
<p>Bốn mươi mốt giây trước khi một chỉ thị nào chạy, vì daemon đang được trao 1,87GB mà nó sẽ không dùng tới. Một file <code>.dockerignore</code> chữa được hoàn toàn — và để ý là file ở trên CÓ tồn tại mà lượt dựng vẫn chuyển 1,87GB, nghĩa là nó nằm sai thư mục: <code>.dockerignore</code> phải nằm cạnh gốc của <em>NGỮ CẢNH DỰNG</em>, không phải cạnh Dockerfile, khi hai chỗ đó khác nhau.</p>
<p>Đo trên máy Mac của khoá học, với 150 MB trong <code>node_modules</code> và một bản dump cơ sở dữ liệu 60 MB trong <code>data/</code>, và một Dockerfile có <code>COPY . .</code>:</p>
<pre><code class="language-bash">docker build --no-cache -f Dockerfile.ctx . 2&gt;&amp;1 | grep -E 'transferring context|/app$'</code></pre>
<table>
<tr><th>File ignore nằm ở đâu</th><th>transferring context</th><th><code>du -sh /app</code> trong ảnh</th></tr>
<tr><td>không có</td><td><code>220.26MB 1.9s</code></td><td><code>210.1M</code></td></tr>
<tr><td><code>.dockerignore</code> ở gốc ngữ cảnh</td><td><code>446B 0.0s</code></td><td><code>56.0K</code></td></tr>
<tr><td><code>docker/.dockerignore</code>, dựng bằng <code>-f docker/Dockerfile .</code></td><td><code>220.26MB 1.9s</code> — bị bỏ qua</td><td><code>210.1M</code></td></tr>
<tr><td><code>docker/Dockerfile.dockerignore</code> (đặt tên theo Dockerfile)</td><td><code>529B 0.0s</code></td><td><code>64.0K</code></td></tr>
</table>
<p>Hai sự thật đáng giữ. File ignore được đọc từ <strong>GỐC NGỮ CẢNH</strong> — trừ khi có một file tên <code>&lt;tên Dockerfile&gt;.dockerignore</code> nằm cạnh Dockerfile, khi đó file này thắng; đó là cách gọn để cho <code>Dockerfile.backend</code> và <code>Dockerfile.frontend</code> mỗi cái một bộ luật riêng. Và BuildKit chỉ chuyển những gì các chỉ thị cần: với <code>COPY package.json /app/</code> thay cho <code>COPY . .</code>, cùng thư mục 210 MB đó chỉ chuyển <code>123B</code>. Nên ngữ cảnh khổng lồ nghĩa là có một lệnh <code>COPY</code> quá rộng <em>VÀ</em> thiếu file ignore — mà <code>COPY</code> rộng còn kéo luôn <code>node_modules</code> ở máy bạn (dựng cho macOS) vào một ảnh Linux.</p>

<h3>Dựng xanh, ảnh chết</h3>
${slide('dk-12', 26, 'Build xanh, ảnh chết: glibc trong ảnh musl')}
<pre><code>docker build -t ghcr.io/me/api:1.4.3 . &amp;&amp; echo "build ✓"
docker push ghcr.io/me/api:1.4.3 &gt;/dev/null &amp;&amp; echo "push ✓"
docker run --rm ghcr.io/me/api:1.4.3 node -e 'require("@prisma/client")' 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">build ✓
push ✓
Error: Query engine library for current platform "linux-musl-openssl-3.0.x" could not be found.
       Files in query engine directory: libquery_engine-debian-openssl-3.0.x.so.node</div>
<div class="callout warn"><strong>Đây là bài học đắt nhất trong cả khoá, và nó khiến dự án này trả giá bảy phút trả 502.</strong> Một script deploy chạy <code>docker build .</code> — lấy trúng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> mà compose dùng — nên một cái nền Alpine (musl) nhận được engine Prisma bản glibc. Dựng xanh, đẩy xanh, tráo xanh, rồi backend restart thành vòng lặp vô tận với API trả 502. Cái luật rút ra: <strong>build xanh KHÔNG có nghĩa là ảnh chạy được.</strong> Hãy luôn truyền <code>-f</code> trỏ đúng cái Dockerfile mà compose dùng, và thêm một lượt chạy thử trước khi đẩy:</div>
<pre><code><span class="tok-comment"># Phép kiểm lẽ ra đã bắt được nó, gói trong một dòng</span>
docker run --rm ghcr.io/me/api:1.4.3 node -e 'require("@prisma/client"); console.log("ok")' \\
  || { echo "image does not start — refusing to push"; exit 1; }</code></pre>
<div class="out">ok</div>

<h3>Chạy thử từng bước: một lượt build xanh mà ảnh không chạy nổi, trong ba mươi giây</h3>
<p>Không cần Prisma mới thấy được kiểu hỏng này. Chép bất kỳ chương trình glibc nào vào một ảnh Alpine (musl):</p>
<pre><code class="language-dockerfile">FROM debian:bookworm-slim AS tool
RUN cp /usr/bin/stat /usr/local/bin/report

FROM alpine:3.20
COPY --from=tool /usr/local/bin/report /usr/local/bin/report
CMD ["report", "/etc/hostname"]</code></pre>
<pre><code class="language-bash">docker build -q -f Dockerfile.libc -t libc-demo:1 . &amp;&amp; echo "build ✓"
docker run --name libc libc-demo:1; echo "exit=$?"
docker run --rm --entrypoint sh libc-demo:1 -c 'ls -l /usr/local/bin/report; ls /lib/ld-*'
docker run --rm debian:bookworm-slim sh -c 'ldd /usr/bin/stat | grep ld-linux'</code></pre>
<div class="out">sha256:155f4e612b750e12d23b9c770d6784be11058eb1e3af8a6945746774facbdaee
build ✓
exec /usr/local/bin/report: no such file or directory
exit=255
-rwxr-xr-x    1 root     root        134320 Sep 23 19:30 /usr/local/bin/report
/lib/ld-musl-aarch64.so.1
	/lib/ld-linux-aarch64.so.1 (0x0000ffffbafc0000)</div>
<p>File có, quyền chạy có, vậy mà nhân vẫn nói "no such file". File bị thiếu là <strong>trình nạp động (dynamic loader)</strong>: binary của Debian đòi <code>/lib/ld-linux-aarch64.so.1</code> (glibc), trong khi Alpine chỉ có <code>/lib/ld-musl-aarch64.so.1</code>. Đây cùng hình dạng với shebang CRLF ở Bài 12.2 — thiếu <em>trình thông dịch</em> mà báo thành thiếu file — và cùng hình dạng với sự cố Prisma, khi một engine native dựng cho glibc rơi vào ảnh musl. Chốt kiểm biến nó thành một lượt build thất bại:</p>
<pre><code class="language-bash">docker run --rm libc-demo:1 report --version &gt;/dev/null 2&gt;&amp;1 || echo "ảnh không chạy — KHÔNG đẩy"</code></pre>
<div class="out">ảnh không chạy — KHÔNG đẩy</div>
<table>
<tr><th>Bước trong đường ống</th><th>Chứng minh được gì</th><th>KHÔNG chứng minh được gì</th></tr>
<tr><td><code>docker build</code> thành công</td><td>mọi chỉ thị đều thoát 0</td><td>kết quả khởi động được, đúng CPU, đúng libc</td></tr>
<tr><td><code>docker push</code> thành công</td><td>registry đã cất đống byte</td><td>bất cứ điều gì về đống byte đó</td></tr>
<tr><td><code>docker run --rm ảnh &lt;lệnh thật nhỏ nhất&gt;</code></td><td>binary, loader và thư viện của nó chạy được cùng nhau</td><td>cả ứng dụng đúng — đó là việc của test và phép kiểm <code>/health</code></td></tr>
</table>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> pull request của bạn xanh trên Mac và đỏ trên GitHub Actions với <code>Cannot find module</code>. Hãy tái hiện cái hỏng của CI ngay tại máy, tìm đúng dòng lỗi thật, và thêm phép kiểm lẽ ra đã chặn được một cái ảnh hỏng.</p><ol>
<li>Trong <code>~/thu-docker/build-hong</code> tạo <code>package.json</code> (<code>"scripts": { "build": "node build.js" }</code>), <code>src/auth.routes.js</code>, <code>src/index.js</code> gọi <code>require('./Auth.routes')</code>, <code>build.js</code> gọi <code>./src/index.js</code>, và Dockerfile một stage sáu dòng (<code>COPY package.json</code>, <code>RUN npm install --omit=dev</code>, <code>COPY . .</code>, <code>RUN npm run build</code>).</li>
<li>Chạy <code>node build.js</code> (qua), rồi <code>docker build -t thu-build:1 .</code> (hỏng). Tìm dòng lỗi bằng <code>docker build -t thu-build:1 . 2&gt;&amp;1 | grep -n 'Cannot find'</code> và để ý rằng nó không nằm trong khối tóm tắt.</li>
<li>Thêm một <code>.dockerignore</code> chỉ có một dòng <code>package.json</code>, chạy <code>docker build --check .</code> rồi <code>docker build -t thu-build:1 .</code>; đọc cảnh báo và lỗi, rồi xoá <code>.dockerignore</code> đó đi.</li>
<li>Sửa dòng <code>require</code>, dựng lại, và thêm chốt kiểm: <code>docker run --rm thu-build:1 node -e 'require("./src/index.js")' || echo "KHÔNG đẩy"</code>.</li>
<li>Dọn: <code>docker image rm thu-build:1</code>, <code>cd .. &amp;&amp; rm -rf build-hong</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 cho thấy <code>Cannot find module './Auth.routes'</code> chỉ nằm trong một dòng <code>#N</code>, bước 3 in ra <code>WARNING: CopyIgnoredFile</code> rồi <code>"/package.json": not found</code>, và sau bước 4 build xanh còn chốt kiểm in <code>routes: /login /logout</code> thay vì <code>KHÔNG đẩy</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">BuildKit (bộ máy dựng ảnh)</span><span class="v">Bộ máy build của Docker; in tiến độ thành các bước đánh số (<code>#10</code>) ra stderr.</span></div>
  <div class="kv"><span class="k">Build context (ngữ cảnh dựng)</span><span class="v">Thư mục gửi cho bộ dựng, trừ đi <code>.dockerignore</code>; <code>COPY</code> chỉ thấy được phần này.</span></div>
  <div class="kv"><span class="k">Stage / <code>--target</code> (tầng dựng / dừng ở tầng)</span><span class="v">Một đoạn <code>FROM … AS tên</code>; <code>--target tên</code> dừng lượt build sau đoạn đó.</span></div>
  <div class="kv"><span class="k">Cache key (khoá cache)</span><span class="v">Thứ quyết định một bước có được dùng lại không: chữ của chỉ thị (và mã băm file với <code>COPY</code>) cộng tầng cha.</span></div>
  <div class="kv"><span class="k">Build checks (phép kiểm build, <code>--check</code>)</span><span class="v">Các luật lint chạy trên Dockerfile mà không dựng, ví dụ <code>CopyIgnoredFile</code>.</span></div>
  <div class="kv"><span class="k">Case sensitivity (phân biệt hoa-thường)</span><span class="v">Linux coi <code>Auth</code> và <code>auth</code> là hai tên khác nhau; macOS mặc định thì không.</span></div>
  <div class="kv"><span class="k">Dynamic loader (trình nạp động)</span><span class="v">Chương trình (<code>ld-linux…</code> hay <code>ld-musl…</code>) khởi động một binary liên kết động.</span></div>
  <div class="kv"><span class="k">Smoke check (chạy thử nhanh)</span><span class="v">Một lần chạy thật, thật nhỏ, trên ảnh vừa dựng trước khi đẩy nó đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc BuildKit từ dưới lên để biết <em>ở đâu</em>, rồi cuộn lên (hoặc grep với <code>2&gt;&amp;1</code>) để biết <em>vì sao</em> — khối tóm tắt chỉ giữ khoảng 10 dòng cuối.</li>
<li><code>COPY … "/x": not found</code> nghĩa là "không có trong ngữ cảnh": thiếu file, bị <code>.dockerignore</code> loại, hoặc nằm ngoài với <code>../</code>; <code>docker build --check</code> cho biết là kiểu nào.</li>
<li>Lỗi hoa-thường qua được trên macOS và cả trong container bind-mount; chỉ <code>docker build</code> (giống CI) mới bắt được.</li>
<li>Một <code>RUN</code> được cache theo chữ của nó, không theo thứ nó tải về; <code>--no-cache --pull</code> là phép thử.</li>
<li>File ignore nằm ở gốc ngữ cảnh, hoặc là <code>&lt;Dockerfile&gt;.dockerignore</code> cạnh Dockerfile; <code>COPY . .</code> rộng mà thiếu nó thì gửi đi hàng trăm MB.</li>
<li>Build xanh chỉ chứng minh các chỉ thị đã chạy; một lệnh <code>docker run</code> chạy thử trước khi push bắt được sai libc, sai kiến trúc, thiếu file.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/build/building/best-practices/" target="_blank" rel="noopener">
  <span class="lc-ico">🧱</span>
  <span class="lc-body"><span class="lc-title">Thực hành tốt cho Dockerfile</span><span class="lc-sub">Danh sách chính thức, đáng đọc lại sau khi bạn đã dựng vài cái ảnh — phần lớn những kiểu hỏng chỉ-trên-CI ở trên đều là một thực hành tốt không được tuân theo.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/building/context/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Ngữ cảnh dựng và .dockerignore</span><span class="lc-sub">Cái gì được gửi tới daemon, <code>.dockerignore</code> phải nằm ở đâu khi ngữ cảnh với Dockerfile ở hai chỗ khác nhau, và tính năng ngữ cảnh có tên.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/debug/" target="_blank" rel="noopener">
  <span class="lc-ico">🐞</span>
  <span class="lc-body"><span class="lc-title">Gỡ lỗi một lượt dựng</span><span class="lc-sub"><code>--progress=plain</code>, <code>--target</code>, và <code>buildx debug --invoke</code> — thứ thả bạn vào một cái shell ở đúng bước đang hỏng, giữ nguyên mọi thứ đã dựng được tới đó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: bảy lượt dựng chỉ hỏng trên CI</span><span class="lc-sub">Bài chấm điểm: bảy lượt dựng xanh ở máy và đỏ trên runner. Hãy xác định nguyên nhân từng cái và viết đúng một câu lệnh tái hiện nó trên máy của bạn.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi một lượt dựng xanh là một cái ảnh chạy được. Dựng chỉ chứng minh rằng các chỉ thị đã chạy; nó không chứng minh gì về việc kết quả có khởi động được không. Mọi kiểu hỏng trong khoá này từng lọt tới production đều có cùng hình dạng đó — một engine glibc trong ảnh musl, một frontend dựng thiếu một biến công khai, một thư mục <code>dist/</code> cũ không bao giờ gắn được một cái router. Cả ba đều xanh lúc dựng, xanh lúc đẩy, xanh lúc tráo, và hỏng trên production. Cách phòng thủ rẻ nhất có thể là một lệnh <code>docker run</code> lên chính cái ảnh vừa dựng, chạy thứ nhỏ nhất mà sẽ hỏng nếu có gì sai: nạp client cơ sở dữ liệu, in ra phiên bản, gọi <code>/health</code>. Mười giây trong đường ống, trước khi đẩy — và nó biến một sự cố thành một lượt dựng thất bại.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy đọc kết quả BuildKit từ dưới lên: dòng cuối gọi tên câu lệnh, khối trên nó gọi tên dòng trong Dockerfile, và <code>--target</code> cho bạn một cái shell ở tầng ngay trước chỗ hỏng. Một cái hỏng chỉ-trên-CI không bao giờ ngẫu nhiên — <code>--no-cache --pull --platform linux/amd64</code> trên một cây làm việc đã stash tái hiện gần hết chúng ngay tại máy. Và một lượt dựng xanh không phải là một cái ảnh đang chạy: hãy thêm một lệnh <code>docker run</code> chốt kiểm trước khi đẩy.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — What you know now|||12.5 — Giờ bạn biết những gì',
      slug: 'dk-12-5-ket-khoa',
      type: 'LESSON',
      description: 'Toàn khoá gói lại: mô hình tinh thần trong một trang, mười hai luật đáng nhớ, một bảng kiểm cho dự án tiếp theo, những sai lầm đã trả giá thật, và đi tiếp về đâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What you know now</h2>
<p class="lead">Thirteen chapters ago, a container was a black box that either worked or did not. It is now a process in a set of namespaces, running a filesystem assembled from layers, attached to a bridge, with limits you chose. Everything else in this course follows from that sentence, and this lesson is the compression of it.</p>

<h3>The whole model, in one picture</h3>
${slide('dk-12', 27, 'Bản đồ toàn khoá: 13 phần, mỗi phần một câu')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">what an image is</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Layers + a manifest</span><span class="lz-nsub">Read-only, content-addressed, stacked by overlayfs. A tag is a moving label; a digest is the truth (Ch. 1, 3).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Built by a Dockerfile</span><span class="lz-nsub">Each instruction is a layer with a cache key. Order decides speed; multi-stage decides size (Ch. 4, 5, 6).</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">what a container is</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A process in namespaces</span><span class="lz-nsub">PID, network, mount, user — its own view of the machine, enforced by the kernel, limited by cgroups (Ch. 1, 2, 11).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Plus a writable layer</span><span class="lz-nsub">Which dies with it. Anything you keep is a volume, a bind mount, or object storage (Ch. 7).</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">what a stack is</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Containers on named networks</span><span class="lz-nsub">Reaching each other by service name; only the proxy publishes ports (Ch. 8, 10).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Described by one file</span><span class="lz-nsub">Compose: reproducible, reviewable, and the same on a laptop and a server (Ch. 9, 10, 11).</span></div></div>
  </div>
</div>

<h3>From symptom back to chapter: where to reread</h3>
<p>The picture above goes from concepts to chapters. When something breaks you travel the other way — from what you see on the screen to the chapter that explains it. This table is that reverse index; every row is a symptom produced for real somewhere in this course.</p>
<table>
<tr><th>You see…</th><th>Layer</th><th>Reread</th></tr>
<tr><td><code>Created</code>, empty logs, 127/126</td><td>2 · configuration</td><td>Ch. 4 (ENTRYPOINT/CMD, exec vs shell form) · Lesson 12.2</td></tr>
<tr><td><code>exec format error</code> · <code>no such file</code> for a file that exists</td><td>1 · image</td><td>Ch. 3 (platforms), Ch. 6 (musl vs glibc) · Lessons 12.2, 12.4</td></tr>
<tr><td>Build slow, cache never hits, secrets in the image</td><td>1 · image</td><td>Ch. 5 (layers and cache), Ch. 6 (multi-stage, secrets)</td></tr>
<tr><td><code>Exited (137)</code>, <code>OOMKilled=true</code></td><td>4 · environment</td><td>Ch. 1 (cgroups), Ch. 11 (limits) · Lesson 12.3</td></tr>
<tr><td><code>docker stop</code> always takes 10 s, exit 137</td><td>3 · process</td><td>Ch. 1 (PID 1 and signals), Ch. 11 (graceful shutdown)</td></tr>
<tr><td>Data gone after <code>down</code> / redeploy</td><td>2 · configuration</td><td>Ch. 1 (writable layer), Ch. 7 (volumes, backups)</td></tr>
<tr><td><code>ENOTFOUND</code> / <code>ECONNREFUSED</code> / <code>bad address</code></td><td>4 · environment</td><td>Ch. 8 (networks, DNS, <code>0.0.0.0</code>) · Lesson 12.3</td></tr>
<tr><td><code>port is already allocated</code> / <code>address already in use</code></td><td>2 / 4</td><td>Ch. 2 (<code>-p</code>), Ch. 8 (publishing) · Lesson 12.2</td></tr>
<tr><td>Starts before its database, <code>unhealthy</code>, <code>dependency failed to start</code></td><td>3 / checker</td><td>Ch. 9–10 (healthchecks, <code>depends_on</code>) · Lesson 12.3</td></tr>
<tr><td>Disk full, huge logs, old images</td><td>4 · environment</td><td>Ch. 11 (log rotation, pruning on a schedule)</td></tr>
<tr><td>Green in CI, broken after deploy</td><td>1 · image</td><td>Ch. 11 (tags, rollback) · Lesson 12.4 (smoke check)</td></tr>
</table>
<div class="callout ok"><strong>The method in one line, for the rest of your career:</strong> <code>docker ps -a</code> → STATUS tells you whether your code ran → the exit code or the error's last words tell you the layer → the table above tells you which chapter to reopen → you change one thing and verify. You have done every step of that sequence by hand in this chapter.</div>

<h3>Twelve rules worth keeping</h3>
${slide('dk-12', 28, 'Mười hai luật — mỗi luật chặn một kiểu hỏng')}
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Pin what you depend on</span><span class="v">Minor versions for base images, digests where it matters, and a bot to move the pins. <code>latest</code> is not a version.</span></div>
  <div class="kv"><span class="k">2 · A green build is not a running image</span><span class="v">One <code>docker run</code> smoke check before the push turns an outage into a failed build.</span></div>
  <div class="kv"><span class="k">3 · Order instructions by change frequency</span><span class="v">Lockfile then install then source. It is the difference between a two-minute build and a twelve-second one.</span></div>
  <div class="kv"><span class="k">4 · Multi-stage, always</span><span class="v">Compilers and dev dependencies do not ship. 1.2GB → 180MB for the same application.</span></div>
  <div class="kv"><span class="k">5 · Non-root, read-only, no capabilities</span><span class="v">Three flags, and a whole class of post-exploitation steps stops working.</span></div>
  <div class="kv"><span class="k">6 · Name your volumes; back them up; restore one</span><span class="v">A backup you have never restored has an unknown status, not a good one.</span></div>
  <div class="kv"><span class="k">7 · One service publishes ports</span><span class="v">Everything else is reachable by container name on a private network. A published database port is how small sites get compromised.</span></div>
  <div class="kv"><span class="k">8 · localhost is the container's own loopback</span><span class="v">Bind to <code>0.0.0.0</code>, reach others by service name, and let the network boundary do the protecting.</span></div>
  <div class="kv"><span class="k">9 · Healthchecks, not sleeps</span><span class="v">And <code>start_period</code>, and a check that can actually run inside that image.</span></div>
  <div class="kv"><span class="k">10 · Limits on everything</span><span class="v">Or one leak takes the whole host down, and the kernel picks your database as the victim.</span></div>
  <div class="kv"><span class="k">11 · Rotate logs, prune on a schedule</span><span class="v">On a single-disk server, a 4GB log file and a full disk are the same incident.</span></div>
  <div class="kv"><span class="k">12 · Tag by commit; deploy deliberately</span><span class="v">So "what is running" is checkable, rollback is one command, and a push is not a deploy.</span></div>
</div>

<h3>What this course cost, in real incidents</h3>
${slide('dk-12', 29, 'Sự cố thật: xanh ở mọi cửa → một phép kiểm mới')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The musl engine</span><span class="lz-t">seven minutes of 502s</span><span class="lz-d">A build that used the default <code>Dockerfile</code> instead of <code>Dockerfile.backend</code> put a glibc Prisma engine in an Alpine image. Green at every gate. The fix was a libc-versus-engine assertion before the push (Ch. 6, 12).</span></div>
  <div class="lz-step"><span class="lz-k">The stale dist/</span><span class="lz-t">a feature dead for days, container healthy</span><span class="lz-d">A <code>--no-build</code> deploy left an old image running that never mounted a router. 404 on a route that existed in the source. The fix was a smoke test that fails on 404 (Ch. 10, 11).</span></div>
  <div class="lz-step"><span class="lz-k">The full disk</span><span class="lz-t">a deploy died mid-build, Postgres at risk</span><span class="lz-d">Build cache grew to 7.6GB on the disk holding the database. The fix was moving builds off the production host entirely (Ch. 11).</span></div>
  <div class="lz-step"><span class="lz-k">The checker that could not run</span><span class="lz-t">~25 wasted seconds per deploy, checking nothing</span><span class="lz-d">A healthcheck calling <code>wget</code> in an image with neither <code>wget</code> nor <code>curl</code>. It failed every time and nobody noticed. Verify the checker before the content (Ch. 9, 12).</span></div>
</div>
<div class="callout ok"><strong>Every one of those was green at build, green at push, and broken in production.</strong> That is not a coincidence — it is the shape of container failures. The build system verifies that instructions ran, and nothing more. Each incident ended in exactly one new check, and those checks are why they have not recurred. If you take one habit from this course, take that one: an incident is not finished until it has produced a check that would have caught it.</div>

<p>One more incident belongs on that list, because it is the purest example of "green and wrong": the nginx configuration was a <strong>single-file bind mount</strong>, and a deploy script replaced the file on the host with <code>mv</code>. Docker binds a single file by its inode at container start, so the container kept reading the <em>old</em> inode — <code>nginx -t</code> passed (it tested the old, valid config), <code>reload</code> passed, and nothing changed for two deploys. The check that came out of it compares the <code>sha256</code> of the file on the host with <code>docker exec … sha256sum</code> inside the container (Chapter 7). "Written" is not "in effect" until you have checked from inside.</p>
<h3>A checklist for your next project</h3>
<pre><code><span class="tok-comment"># Before the first deploy — thirty minutes, once</span>
[ ] Dockerfile is multi-stage, non-root, pinned minor version
[ ] .dockerignore excludes .git, node_modules, .next, *.log
[ ] compose.yaml: one public network, one internal, only the proxy publishes ports
[ ] Every service: restart: unless-stopped + a memory limit + a healthcheck
[ ] Migrations are their own service with service_completed_successfully
[ ] .env is gitignored; .env.example is committed; required vars use &#36;{VAR:?}
[ ] Log rotation in daemon.json AND in compose
[ ] A backup script that runs nightly, ships off-machine, and pings a heartbeat
[ ] A smoke test that curls one route per feature module and fails on 404
[ ] Images tagged by commit SHA, and /health reports the running version</code></pre>
<div class="out">10/10 — this list is roughly a morning of work and it removes
        every failure mode described in this course.</div>

<h3>Where to go next</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Stay here longer</span><span class="v">A single server running compose handles far more traffic than people assume. Most sites never outgrow it, and the operational simplicity is worth a great deal.</span></div>
  <div class="kv"><span class="k">Kubernetes</span><span class="v">The next step when you need several machines, rolling updates as a primitive, or a team large enough that a shared platform pays for itself. Every concept here transfers: pods are namespaces, deployments are declarative <code>compose up</code>, and the images are the same images.</span></div>
  <div class="kv"><span class="k">Swarm</span><span class="v">Multi-host with the compose file you already have. Much smaller than Kubernetes and largely in maintenance mode — worth knowing exists, rarely the right new choice.</span></div>
  <div class="kv"><span class="k">Managed platforms</span><span class="v">Fly.io, Railway, Cloud Run, App Runner. You hand them a Dockerfile and they run it. Everything in Chapters 4–6 still applies; Chapters 9–11 become someone else's job.</span></div>
  <div class="kv"><span class="k">Deeper into the kernel</span><span class="v">The Linux &amp; Bash course covers namespaces, cgroups, systemd and process debugging properly. Chapter 1 of this course was the container-shaped slice of it.</span></div>
  <div class="kv"><span class="k">Supply chain</span><span class="v">SBOMs, provenance, signing and reproducible builds are becoming ordinary requirements. Lesson 6.5 is the on-ramp; sigstore and SLSA are the destination.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 group will demo on a lecturer's machine next week, and you are the one who "knows Docker". Audit your group's real <code>compose.yaml</code> and Dockerfile against the ten-line checklist above — then prove two of the items by breaking them on purpose.</p><ol>
<li>Copy the checklist into <code>~/thu-docker/audit.md</code> and mark each line ✅ / ❌ for your group project (or, if you have none yet, for the stack you built in Chapter 10).</li>
<li>Run <code>docker compose config</code> in the project and look for three things: any <code>&#36;{VAR}</code> that resolved to an empty string, any service without <code>healthcheck</code>, and any <code>ports:</code> other than the proxy's.</li>
<li>Prove the smoke check: build the API image, then run <code>docker run --rm &lt;image&gt; node -e 'console.log("ok")' || echo "KHÔNG đẩy"</code> (use your runtime's equivalent for non-Node images).</li>
<li>Prove the diagnosis method on your own stack: stop the database, watch the API with <code>docker compose ps</code> and <code>docker compose logs --timestamps --tail 5 &lt;api&gt;</code>, and write down the layer and the chapter from the table "From symptom back to chapter". Start the database again.</li></ol>
<p><strong>Done when:</strong> <code>audit.md</code> has ten marked lines with one-sentence reasons for every ❌, the smoke check prints <code>ok</code>, and for step 4 you wrote the STATUS you saw, the error's last words, the layer, and the chapter — before looking anything up.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mental model</span><span class="v">The picture in your head that lets you predict what a command will do before you run it.</span></div>
  <div class="kv"><span class="k">Reproducible</span><span class="v">Same inputs give the same result — which says nothing about whether the result is right.</span></div>
  <div class="kv"><span class="k">Smoke check</span><span class="v">The smallest real run that would fail if the artifact were broken.</span></div>
  <div class="kv"><span class="k">Post-incident check</span><span class="v">The new automatic test an incident leaves behind so it cannot happen silently again.</span></div>
  <div class="kv"><span class="k">Orchestrator (Kubernetes, Swarm)</span><span class="v">Software that runs containers across several machines and keeps them in the declared state.</span></div>
  <div class="kv"><span class="k">Supply chain (SBOM, signing)</span><span class="v">Knowing and proving what went into an image and who built it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An image is layers plus a manifest; a container is a process in namespaces with a writable layer; a stack is containers on named networks described by one file.</li>
<li>Diagnosis is a route, not a hunt: STATUS → exit code or last words → layer → chapter → change one thing.</li>
<li>Every real incident in this course was green at build, push and swap; the defence is verification at each boundary.</li>
<li>An incident is finished only when it has produced a check that would have caught it.</li>
<li>The ten-line checklist is about a morning of work and removes every failure mode shown in this course.</li>
<li>Everything bigger — Kubernetes, managed platforms — is built from these same pieces, so what you learned transfers.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Docker documentation</span><span class="lc-sub">Genuinely good, and better than most tutorials once you know the vocabulary. The reference sections for the CLI, the Dockerfile and the compose file are the three tabs worth keeping.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Kubernetes concepts</span><span class="lc-sub">Read the concepts section before any tutorial. Pods, services and deployments map cleanly onto what you now know, and skipping the vocabulary is what makes Kubernetes feel harder than it is.</span></span>
</a>
<a class="link-card" href="https://github.com/veggiemonk/awesome-docker" target="_blank" rel="noopener">
  <span class="lc-ico">🌟</span>
  <span class="lc-body"><span class="lc-title">awesome-docker</span><span class="lc-sub">A curated list of tools worth knowing: dive for layer analysis, lazydocker for a terminal UI, hadolint for Dockerfile linting, ctop for live stats.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">The full Docker track on Code Lab</span><span class="lc-sub">Every graded exercise from all thirteen chapters in one place. Working through them end to end is the difference between having read this course and being able to use it.</span></span>
</a>

<div class="pitfall"><strong>One last pitfall, and it is the meta one:</strong> believing that because a container is reproducible, it is understood. Reproducibility means the same inputs give the same result — it says nothing about whether the result is correct, and it is precisely what makes container bugs so confident-looking. The wrong architecture reproduces perfectly. So does the glibc engine in a musl image, the stale <code>dist/</code>, the healthcheck calling a binary that does not exist. In every case the system was working exactly as configured, and the configuration was wrong. The habit that protects you is not more caution; it is verification at each boundary — run the image you built, curl the route you deployed, restore the backup you took, and check the checker before you trust it.</div>
<p class="note-ct"><strong>Where you are now.</strong> You can read a Dockerfile and predict its layers, its cache behaviour and its final size. You can build a stack that separates public from private, waits for its dependencies properly, and survives a reboot. You can find out why a container will not start, will not stay up, or will not talk to another one — usually in under two minutes, because you know which of four layers to look at. That is the whole of practical Docker, and everything above it (Kubernetes, service meshes, platforms) is built from these same pieces. Thanks for reading this far — now go break something on purpose, while it is still safe to.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Giờ bạn biết những gì</h2>
<p class="lead">Mười ba chương trước, một container là một cái hộp đen hoặc chạy hoặc không. Giờ nó là một tiến trình nằm trong một bộ namespace, chạy một hệ thống file lắp từ các lớp, gắn vào một cây cầu, với những hạn mức do bạn chọn. Mọi thứ khác trong khoá này đều suy ra từ câu đó, và bài này là bản nén của nó.</p>

<h3>Toàn bộ mô hình, trong một bức tranh</h3>
${slide('dk-12', 27, 'Bản đồ toàn khoá: 13 phần, mỗi phần một câu')}
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">một cái ảnh là gì</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Các lớp + một manifest</span><span class="lz-nsub">Chỉ đọc, định địa chỉ theo nội dung, chồng lên nhau bằng overlayfs. Nhãn là một cái mác di động; digest mới là sự thật (Ch. 1, 3).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Dựng bằng một Dockerfile</span><span class="lz-nsub">Mỗi chỉ thị là một lớp có khoá cache. Thứ tự quyết định tốc độ; nhiều tầng quyết định kích thước (Ch. 4, 5, 6).</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">một container là gì</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một tiến trình trong các namespace</span><span class="lz-nsub">PID, mạng, mount, người dùng — cách nhìn riêng của nó về cái máy, do nhân cưỡng chế, do cgroup giới hạn (Ch. 1, 2, 11).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cộng một lớp ghi được</span><span class="lz-nsub">Thứ chết theo nó. Mọi thứ bạn giữ lại đều là volume, bind mount, hoặc lưu trữ đối tượng (Ch. 7).</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">một stack là gì</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Container trên những mạng có tên</span><span class="lz-nsub">Gọi nhau bằng tên dịch vụ; chỉ proxy công bố cổng (Ch. 8, 10).</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mô tả bằng một cái file</span><span class="lz-nsub">Compose: tái lập được, review được, và giống hệt nhau trên máy cá nhân lẫn máy chủ (Ch. 9, 10, 11).</span></div></div>
  </div>
</div>

<h3>Từ triệu chứng quay về chương: đọc lại ở đâu</h3>
<p>Bức tranh ở trên đi từ khái niệm tới chương. Khi có gì đó hỏng, bạn đi theo chiều ngược lại — từ thứ đang thấy trên màn hình tới chương giải thích nó. Bảng này là mục lục ngược đó; mỗi dòng là một triệu chứng đã được gây ra thật ở đâu đó trong khoá học.</p>
<table>
<tr><th>Bạn thấy…</th><th>Tầng</th><th>Đọc lại</th></tr>
<tr><td><code>Created</code>, log rỗng, 127/126</td><td>2 · cấu hình</td><td>Ch. 4 (ENTRYPOINT/CMD, dạng exec và dạng shell) · Bài 12.2</td></tr>
<tr><td><code>exec format error</code> · <code>no such file</code> cho một file đang có</td><td>1 · ảnh</td><td>Ch. 3 (nền tảng), Ch. 6 (musl và glibc) · Bài 12.2, 12.4</td></tr>
<tr><td>Build chậm, cache không bao giờ trúng, bí mật nằm trong ảnh</td><td>1 · ảnh</td><td>Ch. 5 (tầng và cache), Ch. 6 (multi-stage, bí mật)</td></tr>
<tr><td><code>Exited (137)</code>, <code>OOMKilled=true</code></td><td>4 · môi trường</td><td>Ch. 1 (cgroup), Ch. 11 (hạn mức) · Bài 12.3</td></tr>
<tr><td><code>docker stop</code> lần nào cũng mất 10 giây, mã 137</td><td>3 · tiến trình</td><td>Ch. 1 (PID 1 và tín hiệu), Ch. 11 (tắt êm)</td></tr>
<tr><td>Mất dữ liệu sau <code>down</code> / deploy lại</td><td>2 · cấu hình</td><td>Ch. 1 (tầng ghi), Ch. 7 (volume, sao lưu)</td></tr>
<tr><td><code>ENOTFOUND</code> / <code>ECONNREFUSED</code> / <code>bad address</code></td><td>4 · môi trường</td><td>Ch. 8 (mạng, DNS, <code>0.0.0.0</code>) · Bài 12.3</td></tr>
<tr><td><code>port is already allocated</code> / <code>address already in use</code></td><td>2 / 4</td><td>Ch. 2 (<code>-p</code>), Ch. 8 (công bố cổng) · Bài 12.2</td></tr>
<tr><td>Lên trước cơ sở dữ liệu, <code>unhealthy</code>, <code>dependency failed to start</code></td><td>3 / bộ kiểm</td><td>Ch. 9–10 (healthcheck, <code>depends_on</code>) · Bài 12.3</td></tr>
<tr><td>Đầy đĩa, log khổng lồ, ảnh cũ chất đống</td><td>4 · môi trường</td><td>Ch. 11 (xoay log, dọn theo lịch)</td></tr>
<tr><td>Xanh trên CI, hỏng sau khi deploy</td><td>1 · ảnh</td><td>Ch. 11 (tag, quay lui) · Bài 12.4 (chạy thử trước khi đẩy)</td></tr>
</table>
<div class="callout ok"><strong>Cả phương pháp trong một dòng, dùng cho suốt nghề của bạn:</strong> <code>docker ps -a</code> → STATUS cho biết mã của bạn đã chạy chưa → mã thoát hoặc những chữ cuối của lỗi cho biết tầng → bảng ở trên cho biết mở lại chương nào → đổi MỘT thứ rồi kiểm. Bạn đã tự tay làm từng bước của chuỗi đó trong chương này.</div>

<h3>Mười hai luật đáng giữ</h3>
${slide('dk-12', 28, 'Mười hai luật — mỗi luật chặn một kiểu hỏng')}
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Ghim thứ bạn phụ thuộc</span><span class="v">Số hiệu phụ cho ảnh nền, digest ở những chỗ quan trọng, và một con bot để dời cái ghim. <code>latest</code> không phải một phiên bản.</span></div>
  <div class="kv"><span class="k">2 · Build xanh không phải là ảnh chạy được</span><span class="v">Một lệnh <code>docker run</code> chốt kiểm trước khi đẩy biến một sự cố thành một lượt dựng thất bại.</span></div>
  <div class="kv"><span class="k">3 · Sắp chỉ thị theo tần suất thay đổi</span><span class="v">Lockfile rồi cài rồi mã nguồn. Đó là khác biệt giữa một lượt dựng hai phút và một lượt mười hai giây.</span></div>
  <div class="kv"><span class="k">4 · Nhiều tầng, luôn luôn</span><span class="v">Trình biên dịch và gói phụ thuộc dev không đi kèm. 1,2GB → 180MB cho cùng một ứng dụng.</span></div>
  <div class="kv"><span class="k">5 · Không root, chỉ đọc, không capability</span><span class="v">Ba cái cờ, và nguyên một nhóm bước hậu khai thác ngừng hoạt động.</span></div>
  <div class="kv"><span class="k">6 · Đặt tên cho volume; sao lưu chúng; khôi phục thử một cái</span><span class="v">Một bản sao lưu bạn chưa từng khôi phục có trạng thái không biết, chứ không phải trạng thái tốt.</span></div>
  <div class="kv"><span class="k">7 · Một dịch vụ công bố cổng</span><span class="v">Mọi thứ khác với tới được bằng tên container trên một mạng riêng. Một cổng cơ sở dữ liệu bị công bố là cách các trang nhỏ bị chiếm.</span></div>
  <div class="kv"><span class="k">8 · localhost là loopback của chính container</span><span class="v">Hãy gắn vào <code>0.0.0.0</code>, gọi những cái khác bằng tên dịch vụ, và để ranh giới mạng lo phần bảo vệ.</span></div>
  <div class="kv"><span class="k">9 · Healthcheck, đừng dùng sleep</span><span class="v">Và <code>start_period</code>, và một phép kiểm thật sự chạy được bên trong cái ảnh đó.</span></div>
  <div class="kv"><span class="k">10 · Hạn mức cho mọi thứ</span><span class="v">Không thì một chỗ rò kéo sập cả máy chủ, và nhân chọn cơ sở dữ liệu của bạn làm nạn nhân.</span></div>
  <div class="kv"><span class="k">11 · Xoay log, dọn theo lịch</span><span class="v">Trên một máy chủ một đĩa, một file log 4GB và một cái đĩa đầy là cùng một sự cố.</span></div>
  <div class="kv"><span class="k">12 · Gắn nhãn theo commit; deploy có chủ đích</span><span class="v">Để "cái gì đang chạy" là thứ kiểm được, quay lui là một câu lệnh, và một lệnh push không phải một lượt deploy.</span></div>
</div>

<h3>Khoá học này đã trả giá bằng những sự cố thật nào</h3>
${slide('dk-12', 29, 'Sự cố thật: xanh ở mọi cửa → một phép kiểm mới')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cái engine musl</span><span class="lz-t">bảy phút trả 502</span><span class="lz-d">Một lượt dựng dùng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> đã nhét một engine Prisma glibc vào một cái ảnh Alpine. Xanh ở mọi cửa. Cách chữa là một khẳng định libc-với-engine trước khi đẩy (Ch. 6, 12).</span></div>
  <div class="lz-step"><span class="lz-k">Thư mục dist/ cũ</span><span class="lz-t">một tính năng chết mấy ngày, container vẫn khoẻ</span><span class="lz-d">Một lượt deploy <code>--no-build</code> để lại một cái ảnh cũ đang chạy vốn không bao giờ gắn một cái router. 404 trên một tuyến có thật trong mã nguồn. Cách chữa là một chốt kiểm thất bại khi gặp 404 (Ch. 10, 11).</span></div>
  <div class="lz-step"><span class="lz-k">Cái đĩa đầy</span><span class="lz-t">một lượt deploy chết giữa chừng, Postgres bị đe doạ</span><span class="lz-d">Cache dựng phình lên 7,6GB trên cái đĩa chứa cơ sở dữ liệu. Cách chữa là chuyển hẳn việc dựng ra khỏi máy chủ production (Ch. 11).</span></div>
  <div class="lz-step"><span class="lz-k">Bộ kiểm không chạy được</span><span class="lz-t">phí khoảng 25 giây mỗi lượt deploy, kiểm được số không</span><span class="lz-d">Một healthcheck gọi <code>wget</code> trong một cái ảnh không có cả <code>wget</code> lẫn <code>curl</code>. Nó hỏng mọi lần và không ai để ý. Kiểm bộ kiểm trước khi kiểm nội dung (Ch. 9, 12).</span></div>
</div>
<div class="callout ok"><strong>Cả bốn cái đó đều xanh lúc dựng, xanh lúc đẩy, và hỏng trên production.</strong> Đó không phải trùng hợp — đó là HÌNH DẠNG của những cái hỏng liên quan tới container. Hệ thống dựng chỉ kiểm rằng các chỉ thị đã chạy, không hơn. Mỗi sự cố kết thúc bằng đúng một phép kiểm mới, và chính những phép kiểm đó là lý do chúng không tái diễn. Nếu bạn chỉ mang một thói quen ra khỏi khoá học này, hãy mang cái đó: một sự cố chưa xong cho tới khi nó đẻ ra được một phép kiểm lẽ ra đã bắt được nó.</div>

<p>Còn một sự cố nữa đáng nằm trong danh sách đó, vì nó là ví dụ thuần tuý nhất của "xanh mà sai": cấu hình nginx là một <strong>bind mount file đơn</strong>, và một script deploy thay file đó trên máy chủ bằng <code>mv</code>. Docker gắn file đơn theo inode lúc container khởi động, nên container cứ đọc inode <em>CŨ</em> — <code>nginx -t</code> qua (nó kiểm cấu hình cũ, vốn hợp lệ), <code>reload</code> qua, và chẳng có gì thay đổi suốt hai lượt deploy. Phép kiểm sinh ra từ đó so <code>sha256</code> của file trên máy chủ với <code>docker exec … sha256sum</code> bên trong container (Chương 7). "Đã ghi" chưa phải là "đã có hiệu lực" cho tới khi bạn kiểm từ BÊN TRONG.</p>
<h3>Bảng kiểm cho dự án tiếp theo của bạn</h3>
<pre><code><span class="tok-comment"># Trước lượt deploy đầu tiên — ba mươi phút, làm một lần</span>
[ ] Dockerfile nhiều tầng, không chạy root, ghim số hiệu phụ
[ ] .dockerignore loại .git, node_modules, .next, *.log
[ ] compose.yaml: một mạng công khai, một mạng nội bộ, chỉ proxy công bố cổng
[ ] Mọi dịch vụ: restart: unless-stopped + một hạn mức bộ nhớ + một healthcheck
[ ] Migration là dịch vụ riêng với service_completed_successfully
[ ] .env nằm trong gitignore; .env.example có commit; biến bắt buộc dùng &#36;{VAR:?}
[ ] Xoay log trong daemon.json VÀ trong compose
[ ] Một script sao lưu chạy hằng đêm, đẩy ra khỏi máy, và ping một nhịp tim
[ ] Một chốt kiểm curl một tuyến cho mỗi module tính năng và thất bại khi 404
[ ] Ảnh gắn nhãn theo SHA của commit, và /health báo phiên bản đang chạy</code></pre>
<div class="out">10/10 — danh sách này tốn khoảng một buổi sáng và nó gỡ bỏ
        mọi kiểu hỏng được mô tả trong khoá học này.</div>

<h3>Đi tiếp về đâu</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cứ ở lại đây lâu hơn</span><span class="v">Một máy chủ đơn chạy compose gánh được nhiều lưu lượng hơn người ta tưởng rất nhiều. Phần lớn trang web không bao giờ vượt khỏi nó, và sự đơn giản trong vận hành đáng giá lắm.</span></div>
  <div class="kv"><span class="k">Kubernetes</span><span class="v">Bước kế tiếp khi bạn cần nhiều máy, cần cập nhật cuốn chiếu như một thứ có sẵn, hoặc có một đội đủ lớn để một nền tảng chung sinh lời. Mọi khái niệm ở đây đều chuyển được: pod là namespace, deployment là <code>compose up</code> dạng khai báo, và ảnh vẫn là những cái ảnh đó.</span></div>
  <div class="kv"><span class="k">Swarm</span><span class="v">Nhiều máy với đúng cái file compose bạn đang có. Nhỏ hơn Kubernetes rất nhiều và phần lớn đang ở chế độ bảo trì — đáng biết là nó tồn tại, hiếm khi là lựa chọn mới đúng.</span></div>
  <div class="kv"><span class="k">Nền tảng có quản</span><span class="v">Fly.io, Railway, Cloud Run, App Runner. Bạn trao cho họ một Dockerfile và họ chạy nó. Mọi thứ ở Chương 4–6 vẫn áp dụng; Chương 9–11 trở thành việc của người khác.</span></div>
  <div class="kv"><span class="k">Đào sâu vào nhân</span><span class="v">Khoá Linux &amp; Bash nói về namespace, cgroup, systemd và gỡ lỗi tiến trình cho tử tế. Chương 1 của khoá này chỉ là lát cắt hình container của nó.</span></div>
  <div class="kv"><span class="k">Chuỗi cung ứng</span><span class="v">SBOM, xuất xứ, ký ảnh và dựng tái lập được đang thành yêu cầu bình thường. Bài 6.5 là đường dẫn vào; sigstore và SLSA là đích đến.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> tuần sau nhóm SWP391 của bạn demo trên máy của giảng viên, và bạn là người "biết Docker". Hãy soát <code>compose.yaml</code> và Dockerfile thật của nhóm theo bảng kiểm mười dòng ở trên — rồi chứng minh hai mục bằng cách cố tình làm hỏng.</p><ol>
<li>Chép bảng kiểm vào <code>~/thu-docker/audit.md</code> và đánh ✅ / ❌ từng dòng cho dự án nhóm (nếu chưa có dự án thì dùng stack bạn đã dựng ở Chương 10).</li>
<li>Chạy <code>docker compose config</code> trong dự án và tìm ba thứ: <code>&#36;{VAR}</code> nào ra chuỗi rỗng, service nào không có <code>healthcheck</code>, và <code>ports:</code> nào không phải của proxy.</li>
<li>Chứng minh chốt chạy thử: dựng ảnh API, rồi chạy <code>docker run --rm &lt;ảnh&gt; node -e 'console.log("ok")' || echo "KHÔNG đẩy"</code> (ảnh không phải Node thì dùng lệnh tương đương của runtime đó).</li>
<li>Chứng minh phương pháp chẩn đoán trên chính stack của bạn: dừng cơ sở dữ liệu, theo dõi API bằng <code>docker compose ps</code> và <code>docker compose logs --timestamps --tail 5 &lt;api&gt;</code>, rồi viết ra tầng và chương theo bảng "Từ triệu chứng quay về chương". Bật lại cơ sở dữ liệu.</li></ol>
<p><strong>Đạt khi:</strong> <code>audit.md</code> có đủ mười dòng đã đánh dấu, mỗi ❌ kèm một câu lý do, chốt chạy thử in ra <code>ok</code>, và ở bước 4 bạn đã viết STATUS thấy được, những chữ cuối của lỗi, tầng, và chương — trước khi tra bất cứ gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mental model (mô hình tư duy)</span><span class="v">Bức tranh trong đầu giúp bạn đoán trước một lệnh sẽ làm gì trước khi chạy nó.</span></div>
  <div class="kv"><span class="k">Reproducible (tái lập được)</span><span class="v">Cùng đầu vào cho cùng kết quả — không nói gì về việc kết quả đó đúng hay sai.</span></div>
  <div class="kv"><span class="k">Smoke check (chạy thử nhanh)</span><span class="v">Lần chạy thật nhỏ nhất mà sẽ hỏng nếu sản phẩm bị hỏng.</span></div>
  <div class="kv"><span class="k">Post-incident check (phép kiểm sau sự cố)</span><span class="v">Phép kiểm tự động mới mà một sự cố để lại, để nó không thể lặp lại trong im lặng.</span></div>
  <div class="kv"><span class="k">Orchestrator (bộ điều phối: Kubernetes, Swarm)</span><span class="v">Phần mềm chạy container trên nhiều máy và giữ chúng ở đúng trạng thái đã khai báo.</span></div>
  <div class="kv"><span class="k">Supply chain (chuỗi cung ứng: SBOM, ký ảnh)</span><span class="v">Biết và chứng minh được cái gì đã vào ảnh và ai đã dựng nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ảnh là các tầng cộng một manifest; container là một tiến trình trong các namespace kèm một tầng ghi; stack là các container trên những mạng có tên, mô tả bằng một file.</li>
<li>Chẩn đoán là một lộ trình, không phải cuộc săn: STATUS → mã thoát hoặc chữ cuối của lỗi → tầng → chương → đổi một thứ.</li>
<li>Mọi sự cố thật trong khoá học đều xanh ở build, push và lúc tráo; cách phòng thủ là kiểm chứng ở từng ranh giới.</li>
<li>Một sự cố chỉ xong khi nó đã đẻ ra một phép kiểm lẽ ra bắt được nó.</li>
<li>Bảng kiểm mười dòng tốn khoảng một buổi sáng và gỡ được mọi kiểu hỏng đã thấy trong khoá học.</li>
<li>Mọi thứ lớn hơn — Kubernetes, các nền tảng có quản — đều dựng từ chính những mảnh này, nên những gì bạn học đều mang theo được.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Docker</span><span class="lc-sub">Thật sự tốt, và tốt hơn phần lớn bài hướng dẫn một khi bạn đã có vốn từ. Ba phần tra cứu cho CLI, cho Dockerfile và cho file compose là ba tab đáng giữ.</span></span>
</a>
<a class="link-card" href="https://kubernetes.io/docs/concepts/" target="_blank" rel="noopener">
  <span class="lc-ico">☸️</span>
  <span class="lc-body"><span class="lc-title">Khái niệm Kubernetes</span><span class="lc-sub">Hãy đọc phần khái niệm trước mọi bài hướng dẫn. Pod, service và deployment ánh xạ gọn gàng vào những gì bạn vừa biết, và bỏ qua phần từ vựng chính là thứ khiến Kubernetes có vẻ khó hơn thực tế.</span></span>
</a>
<a class="link-card" href="https://github.com/veggiemonk/awesome-docker" target="_blank" rel="noopener">
  <span class="lc-ico">🌟</span>
  <span class="lc-body"><span class="lc-title">awesome-docker</span><span class="lc-sub">Một danh sách tuyển chọn những công cụ đáng biết: dive để phân tích lớp, lazydocker cho giao diện terminal, hadolint để soi Dockerfile, ctop xem số liệu trực tiếp.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Toàn bộ track Docker trên Code Lab</span><span class="lc-sub">Mọi bài chấm điểm của cả mười ba chương gom về một chỗ. Làm hết chúng từ đầu tới cuối là khác biệt giữa việc ĐÃ ĐỌC khoá này và việc DÙNG ĐƯỢC nó.</span></span>
</a>

<div class="pitfall"><strong>Một cái bẫy cuối, và nó là cái bẫy ở tầng trên:</strong> tin rằng vì một container tái lập được nên nó đã được hiểu. Tái lập được nghĩa là cùng đầu vào cho cùng kết quả — nó không nói gì về việc kết quả đó có ĐÚNG hay không, và chính điều đó khiến những cái lỗi của container trông tự tin đến thế. Sai kiến trúc thì tái lập hoàn hảo. Cái engine glibc trong ảnh musl cũng vậy, thư mục <code>dist/</code> cũ cũng vậy, cái healthcheck gọi một tệp nhị phân không tồn tại cũng vậy. Ở mọi trường hợp, hệ thống chạy đúng y như đã được cấu hình, và cấu hình thì sai. Thói quen bảo vệ bạn không phải là cẩn thận hơn; đó là KIỂM CHỨNG Ở TỪNG RANH GIỚI — chạy cái ảnh bạn vừa dựng, curl cái tuyến bạn vừa deploy, khôi phục cái bản sao lưu bạn vừa tạo, và kiểm bộ kiểm trước khi tin nó.</div>
<p class="note-ct"><strong>Bạn đang ở đâu rồi.</strong> Bạn đọc được một Dockerfile và đoán trước được các lớp của nó, hành vi cache của nó và kích thước cuối cùng của nó. Bạn dựng được một stack tách công khai khỏi riêng tư, chờ các phụ thuộc của mình cho đúng cách, và sống sót qua một lần khởi động lại máy. Bạn tìm ra được vì sao một container không khởi động, không đứng vững, hoặc không nói chuyện được với cái khác — thường trong chưa tới hai phút, vì bạn biết cần nhìn vào tầng nào trong bốn tầng. Đó là toàn bộ phần Docker thực dụng, và mọi thứ nằm trên nó (Kubernetes, service mesh, các nền tảng) đều dựng từ chính những mảnh này. Cảm ơn bạn đã đọc tới đây — giờ thì đi làm hỏng thứ gì đó một cách có chủ đích, khi việc đó còn an toàn.</p>
</div>
`,
    },
    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: '12.6 — Chapter 12 check|||12.6 — Kiểm tra Chương 12',
      slug: 'dk-12-6-quiz-cuoi',
      type: 'QUIZ',
      description: 'Mười ca hỏng thật: container Created với log rỗng, 137 có hay không OOM, vòng lặp restart, exec format error, shebang CRLF, cổng bận, healthcheck 127, COPY not found, lỗi hoa-thường chỉ trên CI, và build xanh mà ảnh chết.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Diagnose ten broken containers</h2>
<p class="lead">Ten situations, each one a failure the course produced for real while writing this chapter. For every question, first name the layer and the one command you would run — then pick the answer. Read the explanations afterwards, especially where the tempting wrong option looked right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I read <code>docker ps -a</code> before <code>docker logs</code>, and I know that <code>Created</code> means my code never ran.</li>
<li>I can decode 0, 1, 125, 126, 127, 130, 137, 139, 143 and 255, and I check <code>OOMKilled</code> before deciding what a 137 means.</li>
<li>I can explain why a file that exists can still give <code>no such file or directory</code> (CRLF shebang, missing glibc loader).</li>
<li>I can tell <code>port is already allocated</code> from <code>address already in use</code> and find who holds the port.</li>
<li>I can reproduce a crash with <code>docker compose run --rm --no-deps --entrypoint sh</code> and test a healthcheck with <code>docker exec</code>.</li>
<li>I can reproduce a CI-only build failure locally and I add a smoke run before every push.</li>
</ul>
${slide('dk-12', 31, 'Bảng tra nhanh Chương 12')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Chẩn đoán mười container hỏng</h2>
<p class="lead">Mười tình huống, mỗi cái là một kiểu hỏng mà khoá học đã gây ra thật trong lúc viết chương này. Với mỗi câu, hãy gọi tên tầng và đúng một lệnh bạn sẽ chạy trước — rồi mới chọn đáp án. Đọc phần giải thích sau khi nộp, nhất là ở những câu mà phương án sai trông rất đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc <code>docker ps -a</code> trước <code>docker logs</code>, và biết <code>Created</code> nghĩa là mã của tôi chưa từng chạy.</li>
<li>Tôi giải mã được 0, 1, 125, 126, 127, 130, 137, 139, 143 và 255, và luôn xem <code>OOMKilled</code> trước khi kết luận một mã 137.</li>
<li>Tôi giải thích được vì sao một file đang tồn tại vẫn có thể báo <code>no such file or directory</code> (shebang CRLF, thiếu loader glibc).</li>
<li>Tôi phân biệt được <code>port is already allocated</code> với <code>address already in use</code> và tìm ra ai đang giữ cổng.</li>
<li>Tôi tái hiện được cái hỏng bằng <code>docker compose run --rm --no-deps --entrypoint sh</code> và thử một healthcheck bằng <code>docker exec</code>.</li>
<li>Tôi tái hiện được một lỗi build chỉ-có-trên-CI ngay tại máy, và luôn chạy thử ảnh trước mỗi lần push.</li>
</ul>
${slide('dk-12', 31, 'Bảng tra nhanh Chương 12')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'A teammate runs `docker run --name api myapp nodee server.js`. `docker ps -a` shows `api Created`, and `docker logs api` prints nothing at all. What is the right conclusion?|||Một bạn cùng nhóm chạy `docker run --name api myapp nodee server.js`. `docker ps -a` hiện `api Created`, và `docker logs api` không in ra gì cả. Kết luận đúng là gì?',
            options: [
              'The process was never started (exit 127, command not found in the image); the message is on the stderr of that docker run or in .State.Error|||Tiến trình chưa từng được khởi động (mã 127, ảnh không có lệnh đó); thông báo nằm ở stderr của lệnh docker run đó hoặc trong .State.Error',
              'The app crashed before it could flush its log buffer; rerun it with a larger log buffer to see the stack trace|||Ứng dụng sập trước khi kịp đẩy bộ đệm log ra; chạy lại với bộ đệm log lớn hơn để thấy stack trace',
              'The logging driver is broken on this host; switch the container to the local driver and start it again|||Driver ghi log trên máy này bị hỏng; đổi container sang driver local rồi khởi động lại',
              'The container is still starting up; wait for the healthcheck to finish before reading the logs again|||Container vẫn đang khởi động; chờ healthcheck chạy xong rồi đọc log lại',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Created means runc refused to start PID 1, so not a single line of the app ran and the log is empty by design. The error ("exec: nodee: executable file not found in $PATH", exit 127) was printed by the CLI and is kept in docker inspect -f {{.State.Error}}. The "crashed before flushing" option is tempting, but a crashed app leaves the container Exited, not Created.|||VI: Created nghĩa là runc từ chối khởi động PID 1, nên không một dòng nào của ứng dụng chạy và log rỗng là đúng thiết kế. Lỗi ("exec: nodee: executable file not found in $PATH", mã 127) do CLI in ra và được giữ trong docker inspect -f {{.State.Error}}. Phương án "sập trước khi đẩy log" nghe hợp lý, nhưng ứng dụng sập thì container ở Exited, không phải Created.',
          },
          {
            question: 'Two containers both show `Exited (137)`. For the first, `docker inspect -f "{{.State.OOMKilled}}"` prints `true`; for the second, `false`. What does the second one mean?|||Hai container cùng hiện `Exited (137)`. Với cái thứ nhất, `docker inspect -f "{{.State.OOMKilled}}"` in `true`; với cái thứ hai, `false`. Cái thứ hai nghĩa là gì?',
            options: [
              'It also ran out of memory, but the host-wide OOM killer does not set the flag, so raise --memory anyway|||Nó cũng hết bộ nhớ, chỉ là kẻ giết OOM toàn máy không bật cờ đó, nên cứ tăng --memory lên',
              'Something sent SIGKILL on purpose — docker kill, a stop that ran past its grace period, another deploy; check docker events|||Có thứ gì đó cố tình gửi SIGKILL — docker kill, một lần stop quá thời gian ân hạn, một lượt deploy khác; xem docker events',
              'The process exited by itself with code 137 because its healthcheck failed three times in a row|||Tiến trình tự thoát với mã 137 vì healthcheck của nó hỏng ba lần liên tiếp',
              'The image was built for another architecture, which the kernel reports as signal 9 at start-up|||Ảnh được dựng cho kiến trúc khác, và nhân báo điều đó thành tín hiệu 9 lúc khởi động',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: 137 = 128 + 9 only says "SIGKILL". The course reproduced both: an OOM (dd with --memory 128m) gave 137 oom=true, a plain docker kill gave 137 oom=false, and docker ps showed Exited (137) for both. A failed healthcheck never kills a container by itself, and a wrong architecture gives exec format error with 255, not 137.|||VI: 137 = 128 + 9 chỉ nói "SIGKILL". Khoá học đã tái hiện cả hai: OOM (dd với --memory 128m) cho 137 oom=true, một lệnh docker kill trần cho 137 oom=false, và docker ps in Exited (137) cho cả hai. Healthcheck hỏng tự nó không bao giờ giết container, còn sai kiến trúc thì báo exec format error với mã 255, không phải 137.',
          },
          {
            question: 'The API shows `Restarting (1)` and `RestartCount` is 19. `docker logs --tail 1` shows `Error: ENOTFOUND getaddrinfo ENOTFOUND cache`. What is the best first move?|||API hiện `Restarting (1)` và `RestartCount` là 19. `docker logs --tail 1` hiện `Error: ENOTFOUND getaddrinfo ENOTFOUND cache`. Nước đi đầu tiên tốt nhất là gì?',
            options: [
              'Change the policy to restart: always so the container recovers faster from each crash|||Đổi chính sách thành restart: always để container hồi phục nhanh hơn sau mỗi lần sập',
              'Raise the API memory limit, since 19 restarts in a row usually means a slow memory leak|||Tăng trần bộ nhớ của API, vì 19 lần restart liên tiếp thường là dấu hiệu rò bộ nhớ chậm',
              'Treat it as a DNS answer — no service named cache on that network — and check whether cache is running and on the same network|||Coi đó là câu trả lời của DNS — không có service nào tên cache trên mạng đó — và kiểm xem cache có đang chạy và cùng mạng không',
              'Rebuild the API image with --no-cache, because a stale layer must be missing the cache client|||Dựng lại ảnh API với --no-cache, vì chắc một tầng cũ đang thiếu thư viện kết nối cache',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Exit 1 with oom=false means the app chose to exit, and ENOTFOUND is the resolver saying the name does not exist — layer 3 reporting a layer 4 problem. In the course demo the loop healed by itself as soon as the cache service was started. restart: always only keeps the loop flapping; the memory option ignores oom=false.|||VI: Mã 1 kèm oom=false nghĩa là ứng dụng tự chọn thoát, còn ENOTFOUND là bộ phân giải tên nói cái tên đó không tồn tại — tầng 3 đang báo lỗi của tầng 4. Trong bài demo của khoá học, vòng lặp tự lành ngay khi service cache được bật. restart: always chỉ làm vòng lặp vỗ cánh mãi; phương án bộ nhớ thì bỏ qua chuyện oom=false.',
          },
          {
            question: 'You build an image on your Mac M1 without `--platform`, load it on an x86 VPS and run it: `exec /usr/local/bin/docker-entrypoint.sh: exec format error`, exit 255. The same image runs fine on your Mac. Why, and what fixes it?|||Bạn dựng ảnh trên Mac M1 không có `--platform`, nạp nó lên một VPS x86 rồi chạy: `exec /usr/local/bin/docker-entrypoint.sh: exec format error`, mã 255. Cũng ảnh đó chạy tốt trên Mac. Vì sao, và cái gì sửa được?',
            options: [
              'The entrypoint script has Windows line endings; convert it with dos2unix and rebuild on the Mac|||Script entrypoint có ký tự xuống dòng kiểu Windows; chuyển bằng dos2unix rồi dựng lại trên Mac',
              'The VPS kernel is too old for Node 22; upgrade the kernel or switch to an older Node base image|||Nhân của VPS quá cũ cho Node 22; nâng nhân hoặc đổi sang ảnh nền Node cũ hơn',
              'The entrypoint file lost its executable bit during docker save; add COPY --chmod=755 and rebuild|||File entrypoint mất bit thực thi trong lúc docker save; thêm COPY --chmod=755 rồi dựng lại',
              'The image is linux/arm64 and the VPS has no arm64 emulation (the Mac emulates amd64, not the reverse); build with --platform linux/amd64 or multi-arch|||Ảnh là linux/arm64 và VPS không có giả lập arm64 (Mac giả lập được amd64, chiều ngược lại thì không); dựng với --platform linux/amd64 hoặc đa kiến trúc',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: "exec format error" is the kernel refusing a binary for another CPU; Docker even warned that linux/arm64 did not match linux/amd64. The CRLF option is the most tempting, but a CRLF shebang produces "no such file or directory", not "exec format error" — the course reproduced both, and both exit 255. A missing +x gives "permission denied".|||VI: "exec format error" là nhân từ chối một binary dành cho CPU khác; Docker còn cảnh báo linux/arm64 không khớp linux/amd64. Phương án CRLF hấp dẫn nhất, nhưng shebang CRLF báo "no such file or directory", không phải "exec format error" — khoá học đã tái hiện cả hai, và cả hai đều thoát 255. Thiếu +x thì báo "permission denied".',
          },
          {
            question: 'A container fails with `exec /entrypoint.sh: no such file or directory`, yet `ls -l /entrypoint.sh` inside the image shows `-rwxr-xr-x`. Which single command most directly confirms the cause?|||Một container hỏng với `exec /entrypoint.sh: no such file or directory`, vậy mà `ls -l /entrypoint.sh` trong ảnh hiện `-rwxr-xr-x`. Lệnh nào xác nhận nguyên nhân trực tiếp nhất?',
            options: [
              'docker image inspect -f "{{.Config.Entrypoint}}" to check the entrypoint path is spelled correctly|||docker image inspect -f "{{.Config.Entrypoint}}" để kiểm đường dẫn entrypoint có gõ đúng không',
              "head -1 /entrypoint.sh | od -c — to see whether the shebang ends in \\r (a CRLF file looks for an interpreter named sh\\r)|||head -1 /entrypoint.sh | od -c — để xem dòng shebang có kết thúc bằng \\r không (file CRLF đi tìm trình thông dịch tên sh\\r)",
              'docker logs with --details to see whether the file was deleted by a later layer of the build|||docker logs với --details để xem file có bị một tầng build sau xoá mất không',
              'docker diff on the container to see whether the entrypoint was modified after the container started|||docker diff trên container để xem entrypoint có bị sửa sau khi container khởi động không',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The file exists and is executable, so "no such file" must refer to something else — its interpreter. od -c showed "# ! / b i n / s h \\r \\n" in the course demo; stripping the \\r fixed it. Checking the entrypoint spelling is tempting, but ls just proved the path is right. (The other classic cause, a glibc binary in a musl image, is found with ldd.)|||VI: File có và có quyền chạy, nên "no such file" phải nói về thứ khác — trình thông dịch của nó. Trong bài demo, od -c hiện "# ! / b i n / s h \\r \\n"; bỏ \\r đi là chạy. Kiểm chính tả entrypoint nghe hợp lý, nhưng lệnh ls vừa chứng minh đường dẫn đúng rồi. (Nguyên nhân kinh điển còn lại, binary glibc trong ảnh musl, thì tìm bằng ldd.)',
          },
          {
            question: '`docker run -d --name web2 -p 127.0.0.1:18120:80 nginx` fails with `port is already allocated`. You free the port and press ↑ Enter. Now it fails with `Conflict. The container name "/web2" is already in use`. What happened?|||`docker run -d --name web2 -p 127.0.0.1:18120:80 nginx` hỏng với `port is already allocated`. Bạn giải phóng cổng rồi bấm ↑ Enter. Giờ nó hỏng với `Conflict. The container name "/web2" is already in use`. Chuyện gì đã xảy ra?',
            options: [
              'A stopped container still holds port 18120 through its docker-proxy until it is removed|||Một container đã dừng vẫn giữ cổng 18120 qua docker-proxy của nó cho tới khi bị xoá',
              'The first run created web2 before networking failed, leaving it in Created; remove it (docker rm web2) and run again|||Lần run đầu đã tạo web2 trước khi phần mạng hỏng, để nó lại ở trạng thái Created; xoá nó (docker rm web2) rồi chạy lại',
              'Docker reserves a name for ten minutes after a failed run, to stop scripts from retrying in a loop|||Docker giữ chỗ một cái tên trong mười phút sau một lần run hỏng, để chặn script thử lại liên tục',
              'Another teammate started a container with the same name on the same Docker host in the meantime|||Một bạn khác đã chạy một container trùng tên trên cùng máy Docker trong lúc đó',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The course measured it: the failed run -d printed a container ID first, and docker ps -a then showed web2 Created. The stopped-container option is the tempting one — and it is false: after docker stop web1, a new container published 18120 immediately. "port is already allocated" means a running container holds the port; a non-Docker process gives "address already in use".|||VI: Khoá học đã đo: lần run -d hỏng in ra một ID container trước, rồi docker ps -a hiện web2 Created. Phương án container đã dừng là cái hấp dẫn — và nó sai: sau docker stop web1, một container mới công bố 18120 được ngay. "port is already allocated" nghĩa là một container đang chạy giữ cổng; tiến trình ngoài Docker thì báo "address already in use".',
          },
          {
            question: 'The web service is `Up (unhealthy)` and the proxy that `depends_on` it with `service_healthy` is stuck in `Created`. `.State.Health.Log` shows `127: /bin/sh: curl: not found`, while `docker exec web wget -qO- localhost:3000` prints `ok`. What should you change?|||Service web ở `Up (unhealthy)` và proxy `depends_on` nó với `service_healthy` kẹt ở `Created`. `.State.Health.Log` hiện `127: /bin/sh: curl: not found`, trong khi `docker exec web wget -qO- localhost:3000` in `ok`. Bạn nên đổi gì?',
            options: [
              'The healthcheck: use a command the image really has (node -e … in a Node image), and test it with docker exec first|||Healthcheck: dùng lệnh mà ảnh thật sự có (node -e … trong ảnh Node), và thử nó bằng docker exec trước',
              'The app: it is not listening on 3000 yet, so add a longer start_period and more retries|||Ứng dụng: nó chưa nghe ở cổng 3000, nên thêm start_period dài hơn và nhiều retries hơn',
              'The proxy: replace condition service_healthy with a sleep 30 in its entrypoint|||Proxy: thay condition service_healthy bằng một lệnh sleep 30 trong entrypoint của nó',
              'The network: put web and proxy on a user-defined network so the check can resolve localhost|||Mạng: đặt web và proxy lên một mạng tự tạo để phép kiểm phân giải được localhost',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: 127 in Health.Log means the check command does not exist; the app answers fine (wget printed ok). node:22-alpine ships busybox wget but not curl — exactly the course demo, fixed by a node -e check. More start_period only delays the same 127, and a sleep replaces a real readiness signal with a guess.|||VI: Mã 127 trong Health.Log nghĩa là lệnh kiểm không tồn tại; ứng dụng trả lời bình thường (wget in ok). node:22-alpine có wget của busybox nhưng không có curl — đúng bài demo của khoá học, sửa bằng một phép kiểm node -e. Tăng start_period chỉ làm chậm đúng cái 127 đó, còn sleep thì thay một tín hiệu sẵn sàng thật bằng một phỏng đoán.',
          },
          {
            question: '`COPY config.json /etc/app/` fails with `"/config.json": not found`, but `ls -l config.json` in the same directory shows the file. Which explanation fits, and how do you confirm it?|||`COPY config.json /etc/app/` hỏng với `"/config.json": not found`, nhưng `ls -l config.json` trong cùng thư mục vẫn thấy file. Giải thích nào khớp, và xác nhận bằng cách nào?',
            options: [
              'COPY paths are relative to the Dockerfile, so move the Dockerfile next to config.json|||Đường dẫn trong COPY tính từ Dockerfile, nên hãy dời Dockerfile về cạnh config.json',
              'The file is too small for BuildKit to checksum; add a comment line to it and build again|||File quá nhỏ để BuildKit tính mã băm; thêm một dòng chú thích vào rồi build lại',
              '.dockerignore excludes it from the build context; docker build --check reports CopyIgnoredFile|||.dockerignore loại nó khỏi ngữ cảnh dựng; docker build --check báo CopyIgnoredFile',
              'The build cache still holds an older context; run docker builder prune -a and rebuild|||Cache build vẫn giữ một ngữ cảnh cũ; chạy docker builder prune -a rồi build lại',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: BuildKit only sees the context — the directory minus .dockerignore — and the leading "/" in the message is the context root. The course reproduced it and docker build --check printed "CopyIgnoredFile: Attempting to Copy file config.json that is excluded by .dockerignore". COPY paths are relative to the context, not to the Dockerfile, and pruning the cache (never without a filter on a shared machine) would not change the context.|||VI: BuildKit chỉ thấy ngữ cảnh — thư mục trừ đi .dockerignore — và dấu "/" đầu trong thông báo là gốc ngữ cảnh. Khoá học đã tái hiện và docker build --check in "CopyIgnoredFile: Attempting to Copy file config.json that is excluded by .dockerignore". Đường dẫn COPY tính từ ngữ cảnh chứ không từ Dockerfile, còn dọn cache (không bao giờ làm mà không có bộ lọc trên máy dùng chung) không đổi được ngữ cảnh.',
          },
          {
            question: '`node build.js` passes on your Mac, and so does `docker run --rm -v "$PWD":/app -w /app node:22-alpine node build.js`. The CI build fails with `Cannot find module "./Auth.routes"`; the file is `auth.routes.js`. Why did the container on your Mac pass?|||`node build.js` qua trên Mac, và `docker run --rm -v "$PWD":/app -w /app node:22-alpine node build.js` cũng qua. Build trên CI hỏng với `Cannot find module "./Auth.routes"`; file tên là `auth.routes.js`. Vì sao container trên Mac lại qua?',
            options: [
              'A bind mount on Docker Desktop is still the Mac filesystem underneath (APFS, case-insensitive); only docker build copies into a case-sensitive Linux filesystem|||Bind mount trên Docker Desktop bên dưới vẫn là hệ thống file của Mac (APFS, không phân biệt hoa-thường); chỉ docker build mới chép vào hệ thống file Linux có phân biệt',
              'Node 22 on Alpine resolves module names case-insensitively, while CI uses an older Node|||Node 22 trên Alpine phân giải tên module không phân biệt hoa-thường, còn CI dùng Node cũ hơn',
              'CI runs on amd64 and module resolution differs between CPU architectures|||CI chạy trên amd64 và cách phân giải module khác nhau giữa các kiến trúc CPU',
              'The Mac container had a warm build cache that still contained the old file name|||Container trên Mac có cache build còn ấm, vẫn chứa tên file cũ',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in the course: node build.js passed, the bind-mounted container passed, and docker build failed with the same error as CI. The container is Linux, but the files it read came through the Mac filesystem. docker run with a bind mount uses no build cache at all, and module resolution does not depend on the CPU.|||VI: Đo trong khoá học: node build.js qua, container bind-mount qua, và docker build hỏng đúng như CI. Container là Linux, nhưng file nó đọc đi qua hệ thống file của Mac. docker run với bind mount không dùng cache build nào cả, và cách phân giải module không phụ thuộc CPU.',
          },
          {
            question: 'A multi-stage Dockerfile copies a binary from a `debian:bookworm-slim` stage into `alpine:3.20`. Build: green. Push: green. Run: `exec /usr/local/bin/report: no such file or directory`, exit 255. Which pipeline step would have turned this into a failed build?|||Một Dockerfile nhiều stage chép một binary từ stage `debian:bookworm-slim` sang `alpine:3.20`. Build: xanh. Push: xanh. Run: `exec /usr/local/bin/report: no such file or directory`, mã 255. Bước nào trong đường ống lẽ ra đã biến nó thành một lượt build thất bại?',
            options: [
              'Adding --no-cache --pull to the build, so every layer is rebuilt from fresh base images|||Thêm --no-cache --pull vào build, để mọi tầng được dựng lại từ ảnh nền mới',
              'Running docker build --check before the build, so the Dockerfile linter flags the COPY --from|||Chạy docker build --check trước khi build, để bộ lint Dockerfile bắt lỗi dòng COPY --from',
              'Adding COPY --chmod=755 so the copied binary keeps its executable permission|||Thêm COPY --chmod=755 để binary được chép giữ quyền thực thi',
              'A smoke run before the push — docker run --rm <image> report --version || exit 1 — because the binary needs the glibc loader that Alpine lacks|||Một lần chạy thử trước khi push — docker run --rm <ảnh> report --version || exit 1 — vì binary cần loader glibc mà Alpine không có',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A build proves only that instructions ran. The Debian binary asks for /lib/ld-linux-aarch64.so.1 while Alpine has /lib/ld-musl-aarch64.so.1, so the kernel reports the missing loader as "no such file". A fresh build reproduces the same bug, the linter has no rule for it, and the file was already -rwxr-xr-x. Only running the image catches it — the lesson of the 502 incident.|||VI: Build chỉ chứng minh các chỉ thị đã chạy. Binary của Debian đòi /lib/ld-linux-aarch64.so.1 trong khi Alpine chỉ có /lib/ld-musl-aarch64.so.1, nên nhân báo thiếu loader thành "no such file". Build mới tinh tái hiện đúng con bọ đó, bộ lint không có luật nào cho nó, còn file vốn đã -rwxr-xr-x. Chỉ CHẠY ảnh mới bắt được — bài học của sự cố 502.',
          },
        ],
      },
    },
  ],
};
