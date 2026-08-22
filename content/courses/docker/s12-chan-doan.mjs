/**
 * Docker — Chương 12: chẩn đoán container (sách công thức + kết khoá).
 * Phương pháp · không khởi động được · khởi động rồi chết · dựng hỏng & chỉ hỏng trên CI · kết khoá · quiz cuối.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 12 — Diagnosing containers|||Chương 12 — Chẩn đoán container',
  description: 'Một phương pháp và một sách công thức cho lúc mọi thứ hỏng: container không khởi động, container khởi động rồi chết, bản dựng chỉ hỏng trên CI. Kèm phần kết khoá và bài kiểm cuối cùng trải khắp mười ba chương.',
  lessons: [
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · The image</span><span class="lz-lnote">Does it exist, can it be pulled, is it the right architecture, does it contain what you think? Symptoms: <code>not found</code>, <code>exec format error</code>, a file that is missing inside the container.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · The container's configuration</span><span class="lz-lnote">Command, environment, mounts, user, ports. Symptoms: <code>executable file not found</code>, permission denied, an empty directory where your code should be, a variable that is unset.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · The process inside</span><span class="lz-lnote">Your application, its dependencies, its own bugs. Symptoms: a stack trace, a non-zero exit with a message, a crash loop that logs the same error every time.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · The environment around it</span><span class="lz-lnote">Networks, other containers, host resources, disk. Symptoms: timeouts, <code>ECONNREFUSED</code>, exit 137, <code>no space left on device</code>, everything slow at once.</span></div>
</div>
<div class="callout ok"><strong>Each layer has a distinct signature, and the exit code usually names it.</strong> A container that never runs a single line of your code is layer 1 or 2. One that logs your application's own error is layer 3. One that was killed, or cannot reach something, is layer 4. Identify the layer first and you have eliminated three quarters of the possibilities without running a diagnostic.</div>

<h3>The three commands to run first</h3>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}' | head -6
docker inspect -f '{{ .State.ExitCode }} oom={{ .State.OOMKilled }} restarts={{ .RestartCount }}' blog-api-1
docker logs --tail 30 blog-api-1</code></pre>
<div class="out">NAMES        STATUS                        IMAGE
blog-api-1   Restarting (1) 2 seconds ago   ghcr.io/me/api:9f2ac1e
blog-db-1    Up 12 minutes (healthy)        postgres:16.4-alpine
1 oom=false restarts=9
blog-api-1  | Error: P1001: Can't reach database server at &#96;db&#96;:&#96;5432&#96;</div>
<p>Status, exit code, logs. Those three tell you the layer in about five seconds: the container is looping, the exit code is 1 (an application error, not a kill), and the log names a dependency it cannot reach. That is layer 3 reporting a layer 4 problem — the API is fine, the network or the database is not — and Lesson 8.5's four questions take it from there.</p>

<h3>Exit codes worth memorising</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>0</code></span><span class="v">Clean exit. On a service, that is still a bug — servers should not finish. Check whether the command was a one-shot when you meant a daemon.</span></div>
  <div class="kv"><span class="k"><code>1</code> (or any small number)</span><span class="v">Your application exited with an error. Layer 3 — read the log; the answer is almost always in it.</span></div>
  <div class="kv"><span class="k"><code>125</code></span><span class="v"><strong>Docker itself</strong> failed before the container started: a bad flag, a conflicting name, an invalid mount. The error text is on stderr, not in the logs.</span></div>
  <div class="kv"><span class="k"><code>126</code></span><span class="v">The command was found but is <strong>not executable</strong> — missing <code>+x</code>, a script with CRLF line endings, or a directory where a binary was expected.</span></div>
  <div class="kv"><span class="k"><code>127</code></span><span class="v"><strong>Command not found</strong> inside the container. A typo, a binary that is not in that image, or a shell that does not exist (distroless has no <code>sh</code>).</span></div>
  <div class="kv"><span class="k"><code>137</code> / <code>143</code></span><span class="v">SIGKILL (128+9) and SIGTERM (128+15). 137 is usually OOM — confirm with <code>OOMKilled</code>. 143 is a normal stop, and on a crash loop it means something stopped it deliberately.</span></div>
</div>
<pre><code>docker run --rm alpine:3.20 nosuchcommand; echo "127? → $?"
docker run --rm --badflag alpine:3.20 true 2&gt;&amp;1 | tail -1; echo "125? → \${PIPESTATUS[0]}"
docker run --rm -v "$PWD/notexec.sh:/s.sh" alpine:3.20 /s.sh; echo "126? → $?"</code></pre>
<div class="out">docker: Error response from daemon: failed to create task: exec: "nosuchcommand": executable file not found in $PATH
127? → 127
unknown flag: --badflag
125? → 125
docker: Error response from daemon: failed to create task: exec: "/s.sh": permission denied
126? → 126</div>

<h3>Look inside, even when there is no shell</h3>
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Cái ảnh</span><span class="lz-lnote">Nó có tồn tại không, kéo về được không, đúng kiến trúc không, bên trong có đúng thứ bạn nghĩ không? Triệu chứng: <code>not found</code>, <code>exec format error</code>, một file bị thiếu bên trong container.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Cấu hình của container</span><span class="lz-lnote">Câu lệnh, môi trường, phép gắn, người dùng, cổng. Triệu chứng: <code>executable file not found</code>, permission denied, một thư mục rỗng ở chỗ lẽ ra có mã của bạn, một biến chưa được đặt.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Tiến trình bên trong</span><span class="lz-lnote">Ứng dụng của bạn, các phụ thuộc của nó, lỗi của chính nó. Triệu chứng: một vết ngăn xếp, một lần thoát khác 0 kèm thông báo, một vòng lặp sập ghi ra cùng một lỗi mỗi lần.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Môi trường xung quanh nó</span><span class="lz-lnote">Mạng, các container khác, tài nguyên máy chủ, đĩa. Triệu chứng: timeout, <code>ECONNREFUSED</code>, exit 137, <code>no space left on device</code>, mọi thứ chậm cùng lúc.</span></div>
</div>
<div class="callout ok"><strong>Mỗi tầng có một dấu hiệu riêng, và mã thoát thường gọi tên nó.</strong> Một container chưa bao giờ chạy nổi một dòng mã của bạn là tầng 1 hoặc 2. Một cái ghi ra lỗi của chính ứng dụng bạn là tầng 3. Một cái bị giết, hoặc không với tới được thứ gì đó, là tầng 4. Xác định tầng trước là bạn đã loại ba phần tư khả năng mà chưa chạy một công cụ chẩn đoán nào.</div>

<h3>Ba câu lệnh chạy trước tiên</h3>
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Image}}' | head -6
docker inspect -f '{{ .State.ExitCode }} oom={{ .State.OOMKilled }} restarts={{ .RestartCount }}' blog-api-1
docker logs --tail 30 blog-api-1</code></pre>
<div class="out">NAMES        STATUS                        IMAGE
blog-api-1   Restarting (1) 2 seconds ago   ghcr.io/me/api:9f2ac1e
blog-db-1    Up 12 minutes (healthy)        postgres:16.4-alpine
1 oom=false restarts=9
blog-api-1  | Error: P1001: Can't reach database server at &#96;db&#96;:&#96;5432&#96;</div>
<p>Trạng thái, mã thoát, log. Ba thứ đó cho bạn biết tầng nào trong khoảng năm giây: container đang lặp, mã thoát là 1 (một lỗi ứng dụng, không phải bị giết), và log gọi tên một phụ thuộc mà nó không với tới được. Đó là tầng 3 đang báo cáo một vấn đề ở tầng 4 — API không sao, mạng hoặc cơ sở dữ liệu mới có vấn đề — và bốn câu hỏi ở Bài 8.5 sẽ tiếp quản từ đó.</p>

<h3>Những mã thoát đáng thuộc lòng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>0</code></span><span class="v">Thoát sạch. Trên một dịch vụ thì đó vẫn là một cái lỗi — máy chủ không nên kết thúc. Hãy kiểm xem câu lệnh có phải loại chạy một lần trong khi bạn định chạy nền không.</span></div>
  <div class="kv"><span class="k"><code>1</code> (hoặc một số nhỏ bất kỳ)</span><span class="v">Ứng dụng của bạn thoát kèm lỗi. Tầng 3 — hãy đọc log; câu trả lời gần như luôn nằm trong đó.</span></div>
  <div class="kv"><span class="k"><code>125</code></span><span class="v"><strong>Chính Docker</strong> hỏng trước khi container khởi động: một cái cờ sai, một cái tên bị trùng, một phép gắn không hợp lệ. Chữ báo lỗi nằm ở stderr, không nằm trong log.</span></div>
  <div class="kv"><span class="k"><code>126</code></span><span class="v">Tìm thấy câu lệnh nhưng nó <strong>không chạy được</strong> — thiếu <code>+x</code>, một script có ký tự xuống dòng kiểu CRLF, hoặc một thư mục ở chỗ lẽ ra là một tệp nhị phân.</span></div>
  <div class="kv"><span class="k"><code>127</code></span><span class="v"><strong>Không tìm thấy câu lệnh</strong> bên trong container. Một lỗi gõ, một tệp nhị phân không có trong cái ảnh đó, hoặc một shell không tồn tại (distroless không có <code>sh</code>).</span></div>
  <div class="kv"><span class="k"><code>137</code> / <code>143</code></span><span class="v">SIGKILL (128+9) và SIGTERM (128+15). 137 thường là OOM — hãy xác nhận bằng <code>OOMKilled</code>. 143 là một lần dừng bình thường, và trong một vòng lặp sập thì nó nghĩa là có thứ gì đó cố tình dừng nó.</span></div>
</div>
<pre><code>docker run --rm alpine:3.20 nosuchcommand; echo "127? → $?"
docker run --rm --badflag alpine:3.20 true 2&gt;&amp;1 | tail -1; echo "125? → \${PIPESTATUS[0]}"
docker run --rm -v "$PWD/notexec.sh:/s.sh" alpine:3.20 /s.sh; echo "126? → $?"</code></pre>
<div class="out">docker: Error response from daemon: failed to create task: exec: "nosuchcommand": executable file not found in $PATH
127? → 127
unknown flag: --badflag
125? → 125
docker: Error response from daemon: failed to create task: exec: "/s.sh": permission denied
126? → 126</div>

<h3>Nhìn vào bên trong, kể cả khi không có shell</h3>
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
<pre><code>docker pull ghcr.io/me/api:9f2ac1e</code></pre>
<div class="out">Error response from daemon: denied: denied
Error response from daemon: manifest unknown: manifest unknown</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>denied</code> on a private registry</span><span class="v">Not logged in, or the token lacks <code>read:packages</code>. <code>docker login ghcr.io -u &lt;user&gt;</code> with a PAT. On a server, the credentials live in <code>~/.docker/config.json</code> of the user running the deploy — often <code>root</code>, not you.</span></div>
  <div class="kv"><span class="k"><code>manifest unknown</code></span><span class="v">The tag does not exist. Usually a typo, or a CI job that failed to push while the deploy step ran anyway. <code>docker buildx imagetools inspect</code> lists what really exists.</span></div>
  <div class="kv"><span class="k"><code>pull rate limit exceeded</code></span><span class="v">Docker Hub's anonymous limit. Log in even with a free account, mirror the images you depend on, or move to GHCR.</span></div>
  <div class="kv"><span class="k"><code>no such host</code></span><span class="v">DNS or egress from the host. Test with <code>curl -sSI https://ghcr.io/v2/</code> — if that fails, the problem is the network, not Docker.</span></div>
</div>

<h3>exec format error</h3>
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

<h3>executable file not found, and permission denied</h3>
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

<h3>Port and name conflicts</h3>
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
<p>Both errors name the culprit precisely, which is unusual and worth appreciating. The port case is almost always a stopped-but-not-removed container's <code>docker-proxy</code> or a stray dev server; the name case is a container in <code>Exited</code> state that <code>docker ps</code> (without <code>-a</code>) does not show you.</p>

<h3>Mounts that fail, or silently do nothing</h3>
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
<p>Three failures from one missing variable: an image reference with an empty tag, a connection string with an empty password, and a warning nobody read. This is exactly what <code>\${VAR:?message}</code> exists to prevent (Lesson 9.4) — it turns a blank string and three downstream mysteries into one clear error at <code>up</code>. And when a value is not what you expect, <code>docker compose config</code> shows you the truth in one command.</p>

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
<pre><code>docker pull ghcr.io/me/api:9f2ac1e</code></pre>
<div class="out">Error response from daemon: denied: denied
Error response from daemon: manifest unknown: manifest unknown</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>denied</code> trên registry riêng</span><span class="v">Chưa đăng nhập, hoặc token thiếu quyền <code>read:packages</code>. Chạy <code>docker login ghcr.io -u &lt;user&gt;</code> với một PAT. Trên máy chủ, thông tin đăng nhập nằm trong <code>~/.docker/config.json</code> của người dùng chạy lượt deploy — thường là <code>root</code>, không phải bạn.</span></div>
  <div class="kv"><span class="k"><code>manifest unknown</code></span><span class="v">Cái nhãn đó không tồn tại. Thường là lỗi gõ, hoặc một việc CI đẩy ảnh thất bại trong khi bước deploy vẫn chạy. <code>docker buildx imagetools inspect</code> liệt kê cái gì thật sự tồn tại.</span></div>
  <div class="kv"><span class="k"><code>pull rate limit exceeded</code></span><span class="v">Giới hạn cho người ẩn danh của Docker Hub. Hãy đăng nhập dù chỉ bằng tài khoản miễn phí, tự soi gương những ảnh bạn phụ thuộc, hoặc chuyển sang GHCR.</span></div>
  <div class="kv"><span class="k"><code>no such host</code></span><span class="v">DNS hoặc lối ra mạng của máy chủ. Hãy thử bằng <code>curl -sSI https://ghcr.io/v2/</code> — nếu cái đó hỏng thì vấn đề là mạng, không phải Docker.</span></div>
</div>

<h3>exec format error</h3>
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

<h3>executable file not found, và permission denied</h3>
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

<h3>Trùng cổng và trùng tên</h3>
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
<p>Cả hai lỗi đều gọi tên thủ phạm rất chính xác, chuyện hiếm và đáng trân trọng. Trường hợp cổng gần như luôn là <code>docker-proxy</code> của một container đã dừng mà chưa xoá, hoặc một dev server lạc; trường hợp tên là một container ở trạng thái <code>Exited</code> mà <code>docker ps</code> (không có <code>-a</code>) không hiện cho bạn thấy.</p>

<h3>Phép gắn hỏng, hoặc lặng lẽ không làm gì</h3>
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
<p>Ba cái hỏng từ một biến bị thiếu: một tham chiếu ảnh với nhãn rỗng, một chuỗi kết nối với mật khẩu rỗng, và một cảnh báo không ai đọc. Đây đúng là thứ <code>\${VAR:?thông báo}</code> sinh ra để ngăn (Bài 9.4) — nó biến một chuỗi rỗng cùng ba bí ẩn phía sau thành một lỗi rõ ràng ngay lúc <code>up</code>. Và khi một giá trị không đúng như bạn nghĩ, <code>docker compose config</code> cho bạn thấy sự thật trong một câu lệnh.</p>

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

<h3>The container exits 0 immediately</h3>
<pre><code>docker run -d --name quiet nginx:alpine nginx
docker ps -a --filter name=quiet --format '{{.Status}}'
docker logs quiet</code></pre>
<div class="out">Exited (0) 2 seconds ago</div>
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
<pre><code>docker inspect -f '{{ .State.Health.Status }}' blog-web-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }}: {{ .Output }}{{ end }}' blog-web-1 | head -2
docker compose exec web sh -c 'wget -qO- http://localhost:3000/ | head -c 20'</code></pre>
<div class="out">unhealthy
127: /bin/sh: wget: not found
&lt;!DOCTYPE html&gt;&lt;html</div>
<div class="callout warn"><strong>Exit 127 in a healthcheck means the check itself is broken, not the service.</strong> The application answers perfectly; the check calls a binary the image does not ship. This project burned about 25 seconds on every deploy for months on exactly this — a frontend check calling <code>wget</code> inside a container whose Dockerfile deliberately installs neither <code>wget</code> nor <code>curl</code>. Inside a Node image use <code>node -e</code>; inside distroless use the app's own binary; and always verify the check with <code>docker exec</code> before trusting its verdict. Verify the checker before the content.</div>

<h3>Keeping a dying container open long enough to look</h3>
<pre><code><span class="tok-comment"># Replace the entrypoint with a shell and poke around by hand</span>
docker run --rm -it --entrypoint sh ghcr.io/me/api:9f2ac1e
<span class="tok-comment"># Same image and env as the failing service, but a shell instead of the command</span>
docker compose run --rm --entrypoint sh api
<span class="tok-comment"># Keep the exited container instead of --rm, then read its filesystem</span>
docker compose run --no-deps api node dist/index.js; docker ps -a --format '{{.Names}} {{.Status}}' | head -2
docker cp blog-api-run-1:/app/logs/last.json - | tar -xO | jq .</code></pre>
<div class="out">Exited (1) 1 second ago
blog-api-run-8f3c1 Exited (1) 1 second ago
{"phase":"startup","step":"prisma.connect","error":"P1001","host":"db","port":5432}</div>
<div class="callout ok"><strong><code>docker compose run --rm --entrypoint sh api</code> is the single most useful debugging command for a service that will not stay up.</strong> You get the exact image, the exact environment variables, the exact networks and mounts — with a shell instead of the failing command. From there you run the real command by hand and watch it fail with your hands on the keyboard, which is a completely different experience from reading its logs afterwards.</div>

<h3>It will not stop, either</h3>
<pre><code>time docker compose stop api</code></pre>
<div class="out"> ✔ Container blog-api-1  Stopped                          10.3s
real	0m10.312s</div>
<p>Ten seconds means the process ignored SIGTERM and Docker fell back to SIGKILL after the grace period. Either the application installs no handler, or it is not PID 1 and never received the signal — a shell-form <code>CMD</code> wraps your process in <code>/bin/sh -c</code>, and that shell does not forward signals. Use exec-form <code>CMD</code>, add <code>init: true</code> or <code>tini</code>, and handle SIGTERM (Lessons 1.3 and 11.4). Until then every deploy drops in-flight requests and costs ten seconds.</p>

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

<h3>Container thoát 0 ngay lập tức</h3>
<pre><code>docker run -d --name quiet nginx:alpine nginx
docker ps -a --filter name=quiet --format '{{.Status}}'
docker logs quiet</code></pre>
<div class="out">Exited (0) 2 seconds ago</div>
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
<pre><code>docker inspect -f '{{ .State.Health.Status }}' blog-web-1
docker inspect -f '{{ range .State.Health.Log }}{{ .ExitCode }}: {{ .Output }}{{ end }}' blog-web-1 | head -2
docker compose exec web sh -c 'wget -qO- http://localhost:3000/ | head -c 20'</code></pre>
<div class="out">unhealthy
127: /bin/sh: wget: not found
&lt;!DOCTYPE html&gt;&lt;html</div>
<div class="callout warn"><strong>Mã 127 trong một healthcheck nghĩa là CHÍNH PHÉP KIỂM hỏng, không phải dịch vụ.</strong> Ứng dụng trả lời hoàn hảo; phép kiểm gọi một tệp nhị phân mà cái ảnh không kèm theo. Dự án này đốt khoảng 25 giây ở mỗi lượt deploy suốt nhiều tháng vì đúng chuyện đó — một phép kiểm frontend gọi <code>wget</code> bên trong một container mà Dockerfile của nó cố ý không cài cả <code>wget</code> lẫn <code>curl</code>. Trong ảnh Node thì dùng <code>node -e</code>; trong distroless thì dùng chính tệp nhị phân của ứng dụng; và luôn xác minh phép kiểm bằng <code>docker exec</code> trước khi tin vào phán quyết của nó. Kiểm bộ kiểm trước khi kiểm nội dung.</div>

<h3>Giữ một container đang chết lại đủ lâu để nhìn</h3>
<pre><code><span class="tok-comment"># Thay entrypoint bằng một cái shell rồi tự tay ngó nghiêng</span>
docker run --rm -it --entrypoint sh ghcr.io/me/api:9f2ac1e
<span class="tok-comment"># Cùng ảnh và cùng môi trường với dịch vụ đang hỏng, nhưng có shell thay cho câu lệnh</span>
docker compose run --rm --entrypoint sh api
<span class="tok-comment"># Giữ lại container đã thoát thay vì --rm, rồi đọc hệ thống file của nó</span>
docker compose run --no-deps api node dist/index.js; docker ps -a --format '{{.Names}} {{.Status}}' | head -2
docker cp blog-api-run-1:/app/logs/last.json - | tar -xO | jq .</code></pre>
<div class="out">Exited (1) 1 second ago
blog-api-run-8f3c1 Exited (1) 1 second ago
{"phase":"startup","step":"prisma.connect","error":"P1001","host":"db","port":5432}</div>
<div class="callout ok"><strong><code>docker compose run --rm --entrypoint sh api</code> là câu lệnh gỡ lỗi hữu ích nhất cho một dịch vụ không chịu đứng vững.</strong> Bạn nhận đúng cái ảnh đó, đúng những biến môi trường đó, đúng những mạng và phép gắn đó — với một cái shell thay cho câu lệnh đang hỏng. Từ đó bạn chạy câu lệnh thật bằng tay rồi xem nó hỏng khi tay bạn đang đặt trên bàn phím, một trải nghiệm hoàn toàn khác với việc đọc log của nó sau khi mọi chuyện đã xong.</div>

<h3>Nó cũng không chịu DỪNG</h3>
<pre><code>time docker compose stop api</code></pre>
<div class="out"> ✔ Container blog-api-1  Stopped                          10.3s
real	0m10.312s</div>
<p>Mười giây nghĩa là tiến trình đã phớt lờ SIGTERM và Docker phải lùi về SIGKILL sau khoảng ân hạn. Hoặc là ứng dụng không cài bộ xử lý tín hiệu nào, hoặc là nó không phải PID 1 và chưa bao giờ nhận được tín hiệu — một <code>CMD</code> dạng shell bọc tiến trình của bạn trong <code>/bin/sh -c</code>, và cái shell đó không chuyển tiếp tín hiệu. Hãy dùng <code>CMD</code> dạng exec, thêm <code>init: true</code> hoặc <code>tini</code>, và xử lý SIGTERM (Bài 1.3 và 11.4). Cho tới lúc đó thì mọi lượt deploy đều làm rơi các yêu cầu đang dở và tốn mười giây.</p>

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

<h3>Seven reasons it only fails in CI</h3>
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

<h3>When the cache is the liar</h3>
<pre><code>docker build -t api:test . | grep -c CACHED
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

<h3>The build is slow, or the context is enormous</h3>
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

<h3>Green build, dead image</h3>
<pre><code>docker build -t api:1.4.3 . &amp;&amp; echo "build ✓"
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

<h3>Bảy lý do nó chỉ hỏng trên CI</h3>
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

<h3>Khi cache mới là kẻ nói dối</h3>
<pre><code>docker build -t api:test . | grep -c CACHED
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

<h3>Dựng chậm, hoặc ngữ cảnh khổng lồ</h3>
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

<h3>Dựng xanh, ảnh chết</h3>
<pre><code>docker build -t api:1.4.3 . &amp;&amp; echo "build ✓"
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

<h3>Twelve rules worth keeping</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The musl engine</span><span class="lz-t">seven minutes of 502s</span><span class="lz-d">A build that used the default <code>Dockerfile</code> instead of <code>Dockerfile.backend</code> put a glibc Prisma engine in an Alpine image. Green at every gate. The fix was a libc-versus-engine assertion before the push (Ch. 6, 12).</span></div>
  <div class="lz-step"><span class="lz-k">The stale dist/</span><span class="lz-t">a feature dead for days, container healthy</span><span class="lz-d">A <code>--no-build</code> deploy left an old image running that never mounted a router. 404 on a route that existed in the source. The fix was a smoke test that fails on 404 (Ch. 10, 11).</span></div>
  <div class="lz-step"><span class="lz-k">The full disk</span><span class="lz-t">a deploy died mid-build, Postgres at risk</span><span class="lz-d">Build cache grew to 7.6GB on the disk holding the database. The fix was moving builds off the production host entirely (Ch. 11).</span></div>
  <div class="lz-step"><span class="lz-k">The checker that could not run</span><span class="lz-t">~25 wasted seconds per deploy, checking nothing</span><span class="lz-d">A healthcheck calling <code>wget</code> in an image with neither <code>wget</code> nor <code>curl</code>. It failed every time and nobody noticed. Verify the checker before the content (Ch. 9, 12).</span></div>
</div>
<div class="callout ok"><strong>Every one of those was green at build, green at push, and broken in production.</strong> That is not a coincidence — it is the shape of container failures. The build system verifies that instructions ran, and nothing more. Each incident ended in exactly one new check, and those checks are why they have not recurred. If you take one habit from this course, take that one: an incident is not finished until it has produced a check that would have caught it.</div>

<h3>A checklist for your next project</h3>
<pre><code><span class="tok-comment"># Before the first deploy — thirty minutes, once</span>
[ ] Dockerfile is multi-stage, non-root, pinned minor version
[ ] .dockerignore excludes .git, node_modules, .next, *.log
[ ] compose.yaml: one public network, one internal, only the proxy publishes ports
[ ] Every service: restart: unless-stopped + a memory limit + a healthcheck
[ ] Migrations are their own service with service_completed_successfully
[ ] .env is gitignored; .env.example is committed; required vars use \${VAR:?}
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

<h3>Mười hai luật đáng giữ</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cái engine musl</span><span class="lz-t">bảy phút trả 502</span><span class="lz-d">Một lượt dựng dùng <code>Dockerfile</code> mặc định thay vì <code>Dockerfile.backend</code> đã nhét một engine Prisma glibc vào một cái ảnh Alpine. Xanh ở mọi cửa. Cách chữa là một khẳng định libc-với-engine trước khi đẩy (Ch. 6, 12).</span></div>
  <div class="lz-step"><span class="lz-k">Thư mục dist/ cũ</span><span class="lz-t">một tính năng chết mấy ngày, container vẫn khoẻ</span><span class="lz-d">Một lượt deploy <code>--no-build</code> để lại một cái ảnh cũ đang chạy vốn không bao giờ gắn một cái router. 404 trên một tuyến có thật trong mã nguồn. Cách chữa là một chốt kiểm thất bại khi gặp 404 (Ch. 10, 11).</span></div>
  <div class="lz-step"><span class="lz-k">Cái đĩa đầy</span><span class="lz-t">một lượt deploy chết giữa chừng, Postgres bị đe doạ</span><span class="lz-d">Cache dựng phình lên 7,6GB trên cái đĩa chứa cơ sở dữ liệu. Cách chữa là chuyển hẳn việc dựng ra khỏi máy chủ production (Ch. 11).</span></div>
  <div class="lz-step"><span class="lz-k">Bộ kiểm không chạy được</span><span class="lz-t">phí khoảng 25 giây mỗi lượt deploy, kiểm được số không</span><span class="lz-d">Một healthcheck gọi <code>wget</code> trong một cái ảnh không có cả <code>wget</code> lẫn <code>curl</code>. Nó hỏng mọi lần và không ai để ý. Kiểm bộ kiểm trước khi kiểm nội dung (Ch. 9, 12).</span></div>
</div>
<div class="callout ok"><strong>Cả bốn cái đó đều xanh lúc dựng, xanh lúc đẩy, và hỏng trên production.</strong> Đó không phải trùng hợp — đó là HÌNH DẠNG của những cái hỏng liên quan tới container. Hệ thống dựng chỉ kiểm rằng các chỉ thị đã chạy, không hơn. Mỗi sự cố kết thúc bằng đúng một phép kiểm mới, và chính những phép kiểm đó là lý do chúng không tái diễn. Nếu bạn chỉ mang một thói quen ra khỏi khoá học này, hãy mang cái đó: một sự cố chưa xong cho tới khi nó đẻ ra được một phép kiểm lẽ ra đã bắt được nó.</div>

<h3>Bảng kiểm cho dự án tiếp theo của bạn</h3>
<pre><code><span class="tok-comment"># Trước lượt deploy đầu tiên — ba mươi phút, làm một lần</span>
[ ] Dockerfile nhiều tầng, không chạy root, ghim số hiệu phụ
[ ] .dockerignore loại .git, node_modules, .next, *.log
[ ] compose.yaml: một mạng công khai, một mạng nội bộ, chỉ proxy công bố cổng
[ ] Mọi dịch vụ: restart: unless-stopped + một hạn mức bộ nhớ + một healthcheck
[ ] Migration là dịch vụ riêng với service_completed_successfully
[ ] .env nằm trong gitignore; .env.example có commit; biến bắt buộc dùng \${VAR:?}
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
      title: '12.6 — Final quiz: the whole course|||12.6 — Bài kiểm cuối: cả khoá học',
      slug: 'dk-12-6-quiz-cuoi',
      type: 'QUIZ',
      description: 'Mười hai câu trải khắp mười ba chương: lớp và cache, mạng và cổng, volume và sao lưu, compose và healthcheck, hạn mức và log, cùng bốn tầng chẩn đoán.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final quiz</span>
<h2>The whole course</h2>
<p class="lead">Twelve questions, one from roughly each chapter. There is no new material here — every answer is something you have already read, and getting them right is the check that the model has actually settled rather than merely been recognised.</p>
<div class="callout ok">Aim for 10/12. The questions that separate "read it" from "know it": what a bind mount does to an existing directory (7.1), why a published port ignores UFW (8.2), why plain <code>depends_on</code> does not prevent a race (9.3), and what a green build does <em>not</em> prove (12.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài kiểm cuối</span>
<h2>Cả khoá học</h2>
<p class="lead">Mười hai câu, mỗi chương khoảng một câu. Ở đây không có tài liệu mới nào — mọi câu trả lời đều là thứ bạn đã đọc, và trả lời đúng chúng là phép kiểm xem cái mô hình đã thật sự lắng xuống hay mới chỉ được nhận mặt.</p>
<div class="callout ok">Nhắm 10/12. Những câu tách "đã đọc" khỏi "đã biết": bind mount làm gì với một thư mục có sẵn (7.1), vì sao một cổng công bố phớt lờ UFW (8.2), vì sao <code>depends_on</code> trần không ngăn được cuộc đua (9.3), và một lượt dựng xanh KHÔNG chứng minh điều gì (12.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'What is a container, in one sentence?|||Một container là gì, gói trong một câu?',
            options: [
              'A lightweight virtual machine with its own kernel|||Một máy ảo nhẹ có nhân riêng',
              'A process on the host kernel, isolated by namespaces and limited by cgroups, running a filesystem assembled from image layers|||Một tiến trình trên nhân của máy chủ, được cách ly bằng namespace và giới hạn bằng cgroup, chạy một hệ thống file lắp từ các lớp của ảnh',
              'A compressed archive that Docker extracts and runs|||Một kho lưu trữ nén mà Docker giải nén rồi chạy',
              'An emulator that translates instructions for portability|||Một trình giả lập dịch các chỉ thị để chạy được ở nhiều nơi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your Dockerfile copies the whole source before running `npm ci`. What is the consequence?|||Dockerfile của bạn chép toàn bộ mã nguồn TRƯỚC khi chạy `npm ci`. Hệ quả là gì?',
            options: [
              'Nothing — BuildKit reorders instructions automatically|||Không sao — BuildKit tự sắp xếp lại các chỉ thị',
              'The image is larger but builds at the same speed|||Ảnh to hơn nhưng dựng nhanh như nhau',
              'npm ci runs without a lockfile and installs wrong versions|||npm ci chạy mà không có lockfile và cài nhầm phiên bản',
              'Every source edit invalidates the install layer, so dependencies reinstall on every build — copy the lockfile, install, then copy the source|||Mọi lần sửa mã nguồn đều làm hỏng lớp cài đặt, nên gói phụ thuộc bị cài lại ở mọi lượt dựng — hãy chép lockfile, cài, rồi mới chép mã nguồn',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Why does adding `RUN rm -rf /large-dir` at the end of a Dockerfile not shrink the image?|||Vì sao thêm `RUN rm -rf /large-dir` ở cuối một Dockerfile lại không làm ảnh nhỏ đi?',
            options: [
              'Layers are additive: the bytes stay in the layer that created them, and the delete only adds whiteout metadata — delete in the same RUN, or use multi-stage|||Các lớp chỉ cộng thêm: số byte đó nằm lại trong cái lớp đã tạo ra chúng, và lệnh xoá chỉ thêm siêu dữ liệu whiteout — hãy xoá ngay trong cùng lệnh RUN, hoặc dùng multi-stage',
              'rm needs the -f flag twice to affect a layer|||rm cần cờ -f hai lần mới tác động được tới một lớp',
              'Docker only reclaims space after docker system prune|||Docker chỉ lấy lại chỗ sau khi chạy docker system prune',
              'The directory is recreated by the next instruction|||Thư mục đó được tạo lại bởi chỉ thị kế tiếp',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You mount an empty host directory over `/app` in an image that has files there. What does the container see, and what would a named volume do instead?|||Bạn gắn một thư mục máy chủ rỗng đè lên `/app` trong một cái ảnh vốn có file ở đó. Container thấy gì, và một volume có tên sẽ làm gì khác?',
            options: [
              'Both show the image files; mounts never hide anything|||Cả hai đều hiện file của ảnh; phép gắn không bao giờ che gì',
              'Both show an empty directory|||Cả hai đều hiện một thư mục rỗng',
              'A bind mount shows an EMPTY directory (the host always wins, no copying ever); an empty named VOLUME receives a copy of the image files on first use|||Bind mount hiện một thư mục RỖNG (phía máy chủ luôn thắng, không bao giờ chép); một VOLUME có tên còn rỗng thì được chép file của ảnh vào ở lần dùng đầu',
              'The bind mount merges both sides|||Bind mount trộn cả hai phía',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'UFW allows only 22, 80 and 443, yet a container started with `-p 6379:6379` answers from the internet. Why?|||UFW chỉ cho phép 22, 80 và 443, vậy mà một container khởi động với `-p 6379:6379` vẫn trả lời từ Internet. Vì sao?',
            options: [
              'Docker writes DNAT rules in the nat table, which run before UFW\'s filter rules, so UFW is never consulted — bind to 127.0.0.1, or do not publish at all|||Docker ghi luật DNAT vào bảng nat, chạy TRƯỚC luật filter của UFW, nên UFW không hề được hỏi — hãy gắn vào 127.0.0.1, hoặc đừng công bố gì cả',
              'UFW does not filter ports above 1024|||UFW không lọc những cổng trên 1024',
              'Redis binds to 0.0.0.0 which bypasses the firewall|||Redis gắn vào 0.0.0.0 nên đi vòng qua tường lửa',
              'The rule takes effect only after a UFW reload|||Luật đó chỉ có hiệu lực sau khi nạp lại UFW',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Two containers are on the same user-defined network. One resolves the other\'s name correctly but every connection is refused instantly. Most likely cause?|||Hai container nằm trên cùng một mạng tự tạo. Một cái phân giải đúng tên cái kia nhưng mọi kết nối đều bị từ chối tức thì. Nguyên nhân nhiều khả năng nhất?',
            options: [
              'A firewall is dropping packets between them|||Một tường lửa đang vứt gói tin giữa chúng',
              'The service inside is bound to 127.0.0.1, which in a namespace is reachable only from itself — bind to 0.0.0.0|||Dịch vụ bên trong đang gắn vào 127.0.0.1, thứ mà trong một namespace chỉ chính nó với tới được — hãy gắn vào 0.0.0.0',
              'The DNS entry is stale after a restart|||Bản ghi DNS đã cũ sau một lần khởi động lại',
              'They need to be on the default bridge instead|||Chúng cần nằm trên bridge mặc định thì mới được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You have `depends_on: [db]` and the API still crashes at startup with ECONNREFUSED. What actually fixes it?|||Bạn đã có `depends_on: [db]` mà API vẫn chết lúc khởi động với ECONNREFUSED. Cái gì mới thật sự chữa được?',
            options: [
              'restart: always on the API|||restart: always trên API',
              'Publishing the database port|||Công bố cổng của cơ sở dữ liệu',
              'Adding sleep 15 to the API entrypoint|||Thêm sleep 15 vào entrypoint của API',
              'A healthcheck on db plus condition: service_healthy — depends_on orders STARTS, not readiness; and the app should still retry|||Một healthcheck trên db cộng condition: service_healthy — depends_on sắp thứ tự KHỞI ĐỘNG chứ không sắp mức sẵn sàng; và ứng dụng thì vẫn nên tự thử lại',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Which backup of a running PostgreSQL container is valid?|||Bản sao lưu nào của một container PostgreSQL ĐANG CHẠY là hợp lệ?',
            options: [
              'tar of the data volume while it runs|||tar cái volume dữ liệu trong lúc nó đang chạy',
              'docker commit of the container|||docker commit cái container',
              'A logical dump via docker exec pg_dump — the engine gives a consistent transactional snapshot; a file-level copy of a live database is a torn snapshot|||Một bản xuất logic qua docker exec pg_dump — engine cho một ảnh chụp nhất quán ở mức giao dịch; chép ở mức file một cơ sở dữ liệu đang sống là một ảnh chụp rách',
              'docker save of the postgres image|||docker save cái ảnh postgres',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A container exits 137 with `OOMKilled=true`, and the host has plenty of free RAM. What happened?|||Một container thoát 137 kèm `OOMKilled=true`, và máy chủ còn rất nhiều RAM trống. Chuyện gì đã xảy ra?',
            options: [
              'It exceeded its OWN cgroup memory limit — only that container died, which is the outcome limits are for; check whether the runtime heap is sized above the limit|||Nó vượt hạn mức bộ nhớ cgroup của CHÍNH NÓ — chỉ container đó chết, và đó đúng là kết cục mà hạn mức sinh ra để tạo; hãy kiểm xem heap của bộ chạy có được đặt cao hơn hạn mức không',
              'The host OOM killer chose it at random|||Bộ giết OOM của máy chủ chọn nó một cách ngẫu nhiên',
              'Someone ran docker kill|||Ai đó đã chạy docker kill',
              'The healthcheck failed three times|||Healthcheck hỏng ba lần',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A server is out of disk but `docker system df` shows little reclaimable. What have you not looked at?|||Một máy chủ hết đĩa nhưng `docker system df` chỉ hiện rất ít chỗ lấy lại được. Bạn chưa nhìn vào cái gì?',
            options: [
              'The image layer cache, which df excludes|||Cache lớp của ảnh, thứ mà df loại trừ',
              'Swap usage|||Mức dùng swap',
              'Container log files — they are not images, layers or volumes, so they appear in none of df\'s categories; an unrotated json-file log can be gigabytes|||File log của container — chúng không phải ảnh, lớp hay volume, nên không nằm trong hạng mục nào của df; một file log json-file không xoay vòng có thể lên nhiều gigabyte',
              'The number of stopped containers|||Số lượng container đã dừng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'What does a successful `docker build` prove about the resulting image?|||Một lệnh `docker build` thành công chứng minh điều gì về cái ảnh sinh ra?',
            options: [
              'That it will start and run correctly|||Rằng nó sẽ khởi động và chạy đúng',
              'That its dependencies are compatible with the base image|||Rằng các phụ thuộc của nó tương thích với ảnh nền',
              'That it is the right architecture for the deployment target|||Rằng nó đúng kiến trúc với đích triển khai',
              'Only that the instructions ran without error — architecture, libc compatibility and whether the process starts are all unverified; add one docker run smoke check before pushing|||Chỉ rằng các chỉ thị đã chạy mà không lỗi — kiến trúc, tương thích libc và việc tiến trình có khởi động được không đều CHƯA được kiểm; hãy thêm một lệnh docker run chốt kiểm trước khi đẩy',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'A container is in state `Created` and `docker logs` is empty. Which layer is broken?|||Một container ở trạng thái `Created` và `docker logs` thì rỗng. Tầng nào đang hỏng?',
            options: [
              'Layer 3 — the application crashed before it could log|||Tầng 3 — ứng dụng sập trước khi kịp ghi log',
              'Layer 4 — a dependency is unreachable|||Tầng 4 — một phụ thuộc không với tới được',
              'Layer 1 or 2 — the image or the container configuration; your code never ran, so the real message is on stderr from the CLI, not in the logs|||Tầng 1 hoặc 2 — cái ảnh hoặc cấu hình container; mã của bạn chưa từng chạy, nên thông báo thật nằm ở stderr do CLI in ra, không nằm trong log',
              'The logging driver is misconfigured|||Driver ghi log bị cấu hình sai',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
