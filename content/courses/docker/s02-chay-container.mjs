/**
 * Docker — Chương 2: chạy container.
 * docker run và bản đồ cờ · quan sát · vào bên trong · môi trường/người dùng ·
 * giới hạn & restart · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 2 — Running containers|||Chương 2 — Chạy container',
  description: 'Mọi cờ của docker run mà bạn thật sự dùng, cách quan sát một container đang chạy, cách vào bên trong (kể cả khi nó không có shell), biến môi trường và người dùng, rồi giới hạn tài nguyên và chính sách khởi động lại.',
  lessons: [
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
<div class="kv-grid">
  <div class="kv"><span class="k">-d, --detach</span><span class="v">Background it and print the container ID. Without it you are attached: the container's output is your terminal, and Ctrl-C signals the container.</span></div>
  <div class="kv"><span class="k">-it</span><span class="v">Two flags: <code>-i</code> keeps stdin open, <code>-t</code> allocates a pseudo-TTY. Together they make an interactive shell behave normally. Lesson 2.3 explains when you want only one of them.</span></div>
  <div class="kv"><span class="k">--rm</span><span class="v">Delete the container the moment it exits. Right for anything interactive or one-shot; wrong when you will want the logs or exit code afterwards.</span></div>
  <div class="kv"><span class="k">--name</span><span class="v">A stable name instead of <code>musing_hopper</code>. Required for anything you will reference again, and unique per machine — including stopped containers.</span></div>
  <div class="kv"><span class="k">--restart</span><span class="v"><code>no</code> (default), <code>on-failure[:n]</code>, <code>always</code>, <code>unless-stopped</code>. Lesson 2.5 covers which to choose; the short version is <code>unless-stopped</code> for services.</span></div>
  <div class="kv"><span class="k">--init</span><span class="v">Insert <code>tini</code> as PID 1 to forward signals and reap zombies (Lesson 1.3). Cheap insurance for anything that spawns child processes.</span></div>
</div>

<h3>Group 2 — networking</h3>
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
  <div class="kv"><span class="k">--mount type=…</span><span class="v">The verbose, explicit form: <code>--mount type=bind,source=…,target=…,readonly</code>. More typing, but it errors instead of silently creating an empty volume when you typo a source path.</span></div>
  <div class="kv"><span class="k">--tmpfs /path</span><span class="v">In-memory scratch space that never hits disk. Good for temp files, and for sensitive data you do not want in a layer.</span></div>
</div>

<h3>Group 4 — configuration</h3>
<pre><code>docker run --rm -e GREETING=hello -e NAME alpine env | grep -E 'GREETING|NAME'
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
<p>Note that <code>docker stats</code> now shows <code>/ 256MiB</code> rather than the host's total. Inside the container, tools that read cgroup limits — modern JVMs, Node 20+, Python's <code>os.cpu_count()</code> in recent versions — will size their thread pools and heaps to that number instead of the host's, which is a large part of why setting limits matters even on a machine with plenty of RAM.</p>

<h3>Group 6 — overriding the image</h3>
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

<h3>Read a running container back as a command</h3>
<pre><code>docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | head -3
docker inspect db --format '{{range \$p, \$v := .NetworkSettings.Ports}}{{\$p}} {{end}}'
docker inspect db --format '{{.HostConfig.RestartPolicy.Name}} {{.Config.Image}}'
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  ghcr.io/nexdrew/rekcod db 2&gt;/dev/null | head -4</code></pre>
<div class="out">["POSTGRES_PASSWORD=x"
"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
"GOSU_VERSION=1.17"
5432/tcp
no postgres:16-alpine</div>
<p>Being able to reconstruct the command from a running container is a real operational skill: it answers "what exactly is production running?" without trusting a wiki. <code>docker inspect</code> with a <code>--format</code> template does it precisely; tools like <code>rekcod</code> do it approximately but instantly. Once a stack is more than two containers, this is what Compose replaces (Chapter 9).</p>
<pre><code>docker rm -f a b c l db &gt;/dev/null; docker volume rm pgdata; rm -f app.env</code></pre>

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
<div class="kv-grid">
  <div class="kv"><span class="k">-d, --detach</span><span class="v">Đẩy xuống nền và in ra ID container. Không có nó thì bạn đang bị gắn vào: output của container chính là terminal của bạn, và Ctrl-C gửi tín hiệu cho container.</span></div>
  <div class="kv"><span class="k">-it</span><span class="v">Là HAI cờ: <code>-i</code> giữ stdin mở, <code>-t</code> cấp một TTY giả. Đi cùng nhau thì một shell tương tác hành xử bình thường. Bài 2.3 giải thích khi nào bạn chỉ muốn một trong hai.</span></div>
  <div class="kv"><span class="k">--rm</span><span class="v">Xoá container ngay khoảnh khắc nó thoát. Đúng cho mọi thứ tương tác hoặc chạy một lần; sai khi bạn còn sẽ cần log hay mã thoát của nó.</span></div>
  <div class="kv"><span class="k">--name</span><span class="v">Một cái tên ổn định thay cho <code>musing_hopper</code>. Bắt buộc với bất cứ thứ gì bạn sẽ nhắc lại, và phải duy nhất trên mỗi máy — kể cả so với container đã dừng.</span></div>
  <div class="kv"><span class="k">--restart</span><span class="v"><code>no</code> (mặc định), <code>on-failure[:n]</code>, <code>always</code>, <code>unless-stopped</code>. Bài 2.5 nói chọn cái nào; bản ngắn gọn là <code>unless-stopped</code> cho dịch vụ.</span></div>
  <div class="kv"><span class="k">--init</span><span class="v">Chèn <code>tini</code> làm PID 1 để chuyển tiếp tín hiệu và thu dọn tiến trình xác (Bài 1.3). Một khoản bảo hiểm rẻ cho bất cứ thứ gì có sinh tiến trình con.</span></div>
</div>

<h3>Nhóm 2 — mạng</h3>
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
  <div class="kv"><span class="k">--mount type=…</span><span class="v">Dạng dài dòng và tường minh: <code>--mount type=bind,source=…,target=…,readonly</code>. Gõ nhiều hơn, nhưng nó BÁO LỖI thay vì âm thầm tạo một volume rỗng khi bạn gõ sai đường dẫn nguồn.</span></div>
  <div class="kv"><span class="k">--tmpfs /đường/dẫn</span><span class="v">Chỗ nháp nằm trong bộ nhớ, không bao giờ chạm đĩa. Tốt cho file tạm, và cho dữ liệu nhạy cảm mà bạn không muốn nằm trong một tầng ảnh.</span></div>
</div>

<h3>Nhóm 4 — cấu hình</h3>
<pre><code>docker run --rm -e GREETING=hello -e NAME alpine env | grep -E 'GREETING|NAME'
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
<p>Hãy để ý <code>docker stats</code> giờ hiện <code>/ 256MiB</code> chứ không phải tổng RAM của máy chủ. Bên trong container, những công cụ biết đọc giới hạn cgroup — JVM hiện đại, Node 20 trở lên, <code>os.cpu_count()</code> của Python bản gần đây — sẽ tính kích thước bể luồng và vùng nhớ theo con số đó thay vì theo máy chủ, và đó là một phần lớn lý do đặt giới hạn vẫn quan trọng ngay cả trên một cái máy dư dả RAM.</p>

<h3>Nhóm 6 — ghi đè cái ảnh</h3>
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

<h3>Đọc ngược một container đang chạy thành câu lệnh</h3>
<pre><code>docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | head -3
docker inspect db --format '{{range \$p, \$v := .NetworkSettings.Ports}}{{\$p}} {{end}}'
docker inspect db --format '{{.HostConfig.RestartPolicy.Name}} {{.Config.Image}}'
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
  ghcr.io/nexdrew/rekcod db 2&gt;/dev/null | head -4</code></pre>
<div class="out">["POSTGRES_PASSWORD=x"
"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
"GOSU_VERSION=1.17"
5432/tcp
no postgres:16-alpine</div>
<p>Dựng lại được câu lệnh từ một container đang chạy là một kỹ năng vận hành có thật: nó trả lời "production đang chạy CHÍNH XÁC cái gì?" mà không phải tin vào một trang wiki. <code>docker inspect</code> với khuôn <code>--format</code> làm chuyện đó một cách chính xác; những công cụ như <code>rekcod</code> làm gần đúng nhưng tức thì. Một khi hệ thống có hơn hai container thì đây chính là thứ mà Compose thay thế (Chương 9).</p>
<pre><code>docker rm -f a b c l db &gt;/dev/null; docker volume rm pgdata; rm -f app.env</code></pre>

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

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">What did it SAY?</span><span class="lz-t">docker logs --since 10m --tail 50 -f</span><span class="lz-d">The first command, every time. Bound it to a window; a bare <code>docker logs</code> on a busy container is a mistake you make once.</span></div>
  <div class="lz-step"><span class="lz-k">What IS it?</span><span class="lz-t">docker inspect --format</span><span class="lz-d">Configuration, environment, mounts, exit code, OOM flag, restart count, health. Everything Docker knows, in one queryable document.</span></div>
  <div class="lz-step"><span class="lz-k">What is it USING?</span><span class="lz-t">docker stats --no-stream</span><span class="lz-d">CPU, memory against its limit, network and PID counts. The fastest way to spot the container eating the machine.</span></div>
  <div class="lz-step"><span class="lz-k">What is it RUNNING?</span><span class="lz-t">docker top</span><span class="lz-d">The process list with host PIDs, without needing a shell inside — which matters for minimal images.</span></div>
  <div class="lz-step"><span class="lz-k">What has it CHANGED?</span><span class="lz-t">docker diff</span><span class="lz-d">Every file added, changed or deleted in the writable layer. Finds state that should have been on a volume.</span></div>
  <div class="lz-step"><span class="lz-k">What HAPPENED?</span><span class="lz-t">docker events --since 1h</span><span class="lz-d">The daemon's own record: creates, starts, dies, OOM kills, health status changes. The answer to "what went on while I was asleep?".</span></div>
</div>
<h3>docker logs, and where the logs actually are</h3>
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

<h3>stdout is the contract</h3>
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

<h3>docker inspect: everything, in JSON</h3>
<pre><code>docker inspect web | head -12
docker inspect web --format '{{.State.Status}} · pid {{.State.Pid}} · started {{.State.StartedAt}}'
docker inspect web --format '{{.NetworkSettings.IPAddress}}'
docker inspect web --format '{{range .Mounts}}{{.Type}} {{.Source}} -&gt; {{.Destination}}{{"\\n"}}{{end}}'
docker inspect web --format '{{json .Config.Env}}' | tr ',' '\\n' | head -2</code></pre>
<div class="out">running · pid 40122 · started 2026-08-22T21:30:58.412Z
172.17.0.2
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

<h3>stats, top, port, diff</h3>
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

<h3>A thirty-second sweep</h3>
<pre><code>{
  echo "=== running ==="; docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'
  echo "=== unhealthy or exited ==="; docker ps -a --filter 'status=exited' --filter 'health=unhealthy' \\
      --format '{{.Names}} {{.Status}}'
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
<pre><code>docker rm -f web filelog &gt;/dev/null</code></pre>

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

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó đã NÓI gì?</span><span class="lz-t">docker logs --since 10m --tail 50 -f</span><span class="lz-d">Câu lệnh đầu tiên, lần nào cũng vậy. Hãy khoanh nó vào một khung thời gian; một lệnh <code>docker logs</code> trần trên một container bận rộn là sai lầm bạn chỉ phạm một lần.</span></div>
  <div class="lz-step"><span class="lz-k">Nó LÀ gì?</span><span class="lz-t">docker inspect --format</span><span class="lz-d">Cấu hình, môi trường, các điểm gắn, mã thoát, cờ OOM, số lần khởi động lại, sức khoẻ. Mọi thứ Docker biết, gói trong một tài liệu tra được.</span></div>
  <div class="lz-step"><span class="lz-k">Nó đang DÙNG bao nhiêu?</span><span class="lz-t">docker stats --no-stream</span><span class="lz-d">CPU, bộ nhớ so với trần của nó, mạng và số PID. Cách nhanh nhất để phát hiện container đang ăn cả cái máy.</span></div>
  <div class="lz-step"><span class="lz-k">Nó đang CHẠY gì?</span><span class="lz-t">docker top</span><span class="lz-d">Danh sách tiến trình kèm PID của máy chủ, không cần một cái shell bên trong — điều đó quan trọng với những ảnh tối giản.</span></div>
  <div class="lz-step"><span class="lz-k">Nó đã ĐỔI gì?</span><span class="lz-t">docker diff</span><span class="lz-d">Mọi file được thêm, đổi hay xoá trong tầng ghi được. Tìm ra trạng thái lẽ ra phải nằm trên một volume.</span></div>
  <div class="lz-step"><span class="lz-k">Chuyện gì ĐÃ XẢY RA?</span><span class="lz-t">docker events --since 1h</span><span class="lz-d">Sổ ghi của chính tiến trình nền: tạo, khởi chạy, chết, bị OOM giết, đổi trạng thái sức khoẻ. Câu trả lời cho "lúc tôi ngủ thì có chuyện gì?".</span></div>
</div>
<h3>docker logs, và log thật sự nằm ở đâu</h3>
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

<h3>stdout là bản hợp đồng</h3>
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

<h3>docker inspect: mọi thứ, dưới dạng JSON</h3>
<pre><code>docker inspect web | head -12
docker inspect web --format '{{.State.Status}} · pid {{.State.Pid}} · bắt đầu {{.State.StartedAt}}'
docker inspect web --format '{{.NetworkSettings.IPAddress}}'
docker inspect web --format '{{range .Mounts}}{{.Type}} {{.Source}} -&gt; {{.Destination}}{{"\\n"}}{{end}}'
docker inspect web --format '{{json .Config.Env}}' | tr ',' '\\n' | head -2</code></pre>
<div class="out">running · pid 40122 · bắt đầu 2026-08-22T21:30:58.412Z
172.17.0.2
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

<h3>stats, top, port, diff</h3>
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

<h3>Một cuộc quét ba mươi giây</h3>
<pre><code>{
  echo "=== đang chạy ==="; docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'
  echo "=== không khoẻ hoặc đã thoát ==="; docker ps -a --filter 'status=exited' --filter 'health=unhealthy' \\
      --format '{{.Names}} {{.Status}}'
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
<pre><code>docker rm -f web filelog &gt;/dev/null</code></pre>

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

<h3>attach: connecting to PID 1's own terminal</h3>
<pre><code>docker run -d --name t alpine sh -c 'while true; do date; sleep 2; done'
timeout 5 docker attach t
docker ps --filter name=t --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">Fri Aug 22 21:52:10 UTC 2026
Fri Aug 22 21:52:12 UTC 2026
t Up 40 seconds</div>
<div class="callout warn"><strong><code>docker attach</code> connects your terminal to PID 1's stdin/stdout — so Ctrl-C sends SIGINT to the application and usually stops the container.</strong> This surprises people who reach for attach expecting something like <code>tail -f</code>. If you attached and want out without killing anything, the detach sequence is <strong>Ctrl-P Ctrl-Q</strong>. To watch output safely, use <code>docker logs -f</code>; to get a prompt, use <code>docker exec</code>. Attach is genuinely useful only when you need to <em>send input</em> to PID 1 — an interactive REPL you started with <code>-d</code>, for instance.</div>
<pre><code>docker rm -f t &gt;/dev/null
docker run -d --name repl -it node:22-alpine node        <span class="tok-comment"># -it, but detached</span>
docker attach repl                                        <span class="tok-comment"># now you have the REPL</span>
<span class="tok-comment"># type: 2 ** 32   then Ctrl-P Ctrl-Q to leave it running</span></code></pre>

<h3>What -i and -t actually do</h3>
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
echo '{"b":2,"a":1}' | docker run --rm    ghcr.io/jqlang/jq -S .   <span class="tok-comment"># stdin closed</span>
docker run --rm -it alpine ls --color=always /etc | head -2 | cat -v | head -2</code></pre>
<div class="out">{
  "a": 1,
  "b": 2
}
jq: error (at &lt;stdin&gt;:0): Cannot index number with "a"
^[[1;34mconf.d^[[m
^[[1;34mssl^[[m</div>
<p>The second command failed because stdin was never connected. The third shows why <code>-t</code> in a pipeline is a mistake: the TTY made <code>ls</code> emit colour escape codes into what your script is trying to parse. <strong>Human at a keyboard: <code>-it</code>. Script or pipe: <code>-i</code> only.</strong></p>

<h3>When the image has no shell</h3>
<pre><code>docker run -d --name api gcr.io/distroless/static-debian12 2&gt;/dev/null || \\
  docker run -d --name api --entrypoint sleep alpine 600
docker exec -it api sh 2&gt;&amp;1 | head -1</code></pre>
<div class="out">OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH: unknown</div>
<p>Distroless and <code>scratch</code> images contain your binary and nothing else — no shell, no <code>ls</code>, no package manager. That is a security feature (Chapter 6): an attacker who gets code execution finds no tools. It also means your usual debugging move does not work. Three approaches, in order of preference:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · A sidecar sharing the namespaces</span><span class="lz-t">docker run --rm -it --pid=container:api --net=container:api nicolaka/netshoot</span><span class="lz-d">A fully-equipped debug container that joins the target's process and network namespaces. You get <code>ps</code>, <code>ss</code>, <code>dig</code>, <code>curl</code>, <code>tcpdump</code>, and can read the target's files through <code>/proc/1/root/</code>. Nothing is installed into the image being debugged.</span></div>
  <div class="lz-step"><span class="lz-k">2 · docker debug</span><span class="lz-t">docker debug api</span><span class="lz-d">Docker Desktop's built-in version of the same idea: attaches a toolbox shell to any container, including distroless ones, and leaves no trace. Requires a Pro/Team/Business subscription.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Pull the evidence out instead</span><span class="lz-t">docker cp api:/app/config.json - | tar -xO</span><span class="lz-d">Works on stopped containers too (Lesson 1.4). Often you do not need a shell — you need one file, or the exit code, or the environment, and <code>cp</code> plus <code>inspect</code> give you all three.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Or a debug build tag</span><span class="lz-t">a second Dockerfile stage FROM alpine with the same binary</span><span class="lz-d">The disciplined answer: ship distroless, keep a <code>:debug</code> tag from the same build with a shell in it. Chapter 6 shows the two-line multi-stage change that produces both.</span></div>
</div>
<pre><code><span class="tok-comment"># Approach 1 in full — read the target's filesystem through /proc</span>
docker run --rm -it --pid=container:api --net=container:api \\
  --cap-add SYS_PTRACE nicolaka/netshoot sh -c \\
  'ps aux; ls /proc/1/root/; ss -tlnp'</code></pre>
<div class="out">PID   USER     COMMAND
    1 root     sleep 600
   14 root     sh -c ps aux; ls /proc/1/root/; ss -tlnp
bin  dev  etc  home  lib  proc  root  sys  tmp  usr  var
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
LISTEN 0      511          0.0.0.0:80         0.0.0.0:*</div>
<p><code>/proc/1/root/</code> is the target container's root filesystem, visible because the two containers share a PID namespace. This is the single most useful debugging trick in the course, and it works on any image no matter how minimal.</p>

<h3>From the host, with nsenter</h3>
<pre><code>PID=\$(docker inspect -f '{{.State.Pid}}' web)
sudo nsenter -t \$PID -n ss -tlnp          <span class="tok-comment"># enter only the NETWORK namespace</span>
sudo nsenter -t \$PID -m ls /etc/nginx | head -3</code></pre>
<div class="out">State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port
LISTEN 0      511           0.0.0.0:80         0.0.0.0:*
conf.d
fastcgi.conf
mime.types</div>
<p><code>nsenter</code> runs a <em>host</em> binary inside a chosen subset of the container's namespaces. Because the tool comes from the host, the container needs nothing at all — which makes this the last-resort answer for a distroless image on a machine where you cannot pull a debug image. Requires root on the host.</p>
<pre><code>docker rm -f web api repl &gt;/dev/null 2&gt;&amp;1</code></pre>

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
docker run --rm ubuntu:24.04 bash -c 'ubuntu có bash'</code></pre>
<div class="out">lrwxrwxrwx 1 root root 12 Aug  1 12:03 /bin/sh -&gt; /bin/busybox
không có bash
ubuntu có bash</div>
<p>Ảnh nền Alpine có <code>/bin/sh</code> (ash của busybox) và KHÔNG có <code>bash</code>. <code>docker exec -it web bash</code> hỏng với <code>exec: "bash": executable file not found in $PATH</code>, nghe như container hỏng và chẳng có nghĩa gì như thế cả. Hãy với tay tới <code>sh</code> trước; nó có mặt gần như ở mọi nơi.</p>

<h3>attach: nối vào chính cái terminal của PID 1</h3>
<pre><code>docker run -d --name t alpine sh -c 'while true; do date; sleep 2; done'
timeout 5 docker attach t
docker ps --filter name=t --format '{{.Names}} {{.Status}}'</code></pre>
<div class="out">Fri Aug 22 21:52:10 UTC 2026
Fri Aug 22 21:52:12 UTC 2026
t Up 40 seconds</div>
<div class="callout warn"><strong><code>docker attach</code> nối terminal của bạn vào stdin/stdout của PID 1 — nên Ctrl-C gửi SIGINT cho ỨNG DỤNG và thường là dừng container.</strong> Điều này làm bất ngờ những người với tay tới attach mà chờ đợi một thứ kiểu <code>tail -f</code>. Nếu bạn đã attach và muốn thoát ra mà không giết gì thì tổ hợp tách rời là <strong>Ctrl-P Ctrl-Q</strong>. Muốn xem output an toàn thì dùng <code>docker logs -f</code>; muốn có dấu nhắc thì dùng <code>docker exec</code>. Attach chỉ thật sự hữu ích khi bạn cần <em>GỬI ĐẦU VÀO</em> cho PID 1 — chẳng hạn một REPL tương tác mà bạn đã khởi chạy với <code>-d</code>.</div>
<pre><code>docker rm -f t &gt;/dev/null
docker run -d --name repl -it node:22-alpine node        <span class="tok-comment"># -it, nhưng chạy nền</span>
docker attach repl                                        <span class="tok-comment"># giờ bạn có cái REPL</span>
<span class="tok-comment"># gõ: 2 ** 32   rồi Ctrl-P Ctrl-Q để rời đi mà vẫn để nó chạy</span></code></pre>

<h3>-i và -t thật ra làm gì</h3>
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
echo '{"b":2,"a":1}' | docker run --rm    ghcr.io/jqlang/jq -S .   <span class="tok-comment"># stdin bị đóng</span>
docker run --rm -it alpine ls --color=always /etc | head -2 | cat -v | head -2</code></pre>
<div class="out">{
  "a": 1,
  "b": 2
}
jq: error (at &lt;stdin&gt;:0): Cannot index number with "a"
^[[1;34mconf.d^[[m
^[[1;34mssl^[[m</div>
<p>Câu lệnh thứ hai hỏng vì stdin chưa từng được nối. Câu thứ ba cho thấy vì sao <code>-t</code> trong một đường ống là một sai lầm: cái TTY khiến <code>ls</code> phun ra mã thoát màu vào đúng thứ mà script của bạn đang cố phân tích. <strong>Người ngồi trước bàn phím: <code>-it</code>. Script hay ống dẫn: chỉ <code>-i</code>.</strong></p>

<h3>Khi cái ảnh không có shell nào</h3>
<pre><code>docker run -d --name api gcr.io/distroless/static-debian12 2&gt;/dev/null || \\
  docker run -d --name api --entrypoint sleep alpine 600
docker exec -it api sh 2&gt;&amp;1 | head -1</code></pre>
<div class="out">OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH: unknown</div>
<p>Ảnh distroless và <code>scratch</code> chỉ chứa chương trình của bạn và không gì khác — không shell, không <code>ls</code>, không trình quản lý gói. Đó là một TÍNH NĂNG an ninh (Chương 6): một kẻ tấn công chiếm được quyền chạy mã sẽ chẳng tìm thấy công cụ nào. Nó cũng nghĩa là nước cờ gỡ lỗi quen thuộc của bạn không dùng được. Ba cách tiếp cận, xếp theo mức độ nên ưu tiên:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Một container phụ dùng chung namespace</span><span class="lz-t">docker run --rm -it --pid=container:api --net=container:api nicolaka/netshoot</span><span class="lz-d">Một container gỡ lỗi trang bị đầy đủ, gia nhập namespace tiến trình và mạng của mục tiêu. Bạn có <code>ps</code>, <code>ss</code>, <code>dig</code>, <code>curl</code>, <code>tcpdump</code>, và đọc được file của mục tiêu qua <code>/proc/1/root/</code>. Không có gì bị cài vào cái ảnh đang bị gỡ lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">2 · docker debug</span><span class="lz-t">docker debug api</span><span class="lz-d">Bản dựng sẵn của cùng ý tưởng đó trong Docker Desktop: gắn một shell hộp công cụ vào container bất kỳ, kể cả distroless, và không để lại dấu vết. Cần thuê bao Pro/Team/Business.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Hoặc lôi bằng chứng ra thay vì chui vào</span><span class="lz-t">docker cp api:/app/config.json - | tar -xO</span><span class="lz-d">Chạy được cả với container đã dừng (Bài 1.4). Rất thường là bạn KHÔNG cần một cái shell — bạn cần MỘT file, hoặc mã thoát, hoặc môi trường, và <code>cp</code> cộng <code>inspect</code> cho bạn cả ba.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Hoặc một tag dựng riêng để gỡ lỗi</span><span class="lz-t">một stage thứ hai FROM alpine với cùng cái chương trình</span><span class="lz-d">Câu trả lời có kỷ luật: đem đi bản distroless, giữ một tag <code>:debug</code> từ cùng lượt dựng có shell bên trong. Chương 6 chỉ ra thay đổi hai dòng trong dựng nhiều tầng để có cả hai.</span></div>
</div>
<pre><code><span class="tok-comment"># Cách 1 đầy đủ — đọc hệ thống file của mục tiêu qua /proc</span>
docker run --rm -it --pid=container:api --net=container:api \\
  --cap-add SYS_PTRACE nicolaka/netshoot sh -c \\
  'ps aux; ls /proc/1/root/; ss -tlnp'</code></pre>
<div class="out">PID   USER     COMMAND
    1 root     sleep 600
   14 root     sh -c ps aux; ls /proc/1/root/; ss -tlnp
bin  dev  etc  home  lib  proc  root  sys  tmp  usr  var
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port
LISTEN 0      511          0.0.0.0:80         0.0.0.0:*</div>
<p><code>/proc/1/root/</code> chính là hệ thống file gốc của container mục tiêu, nhìn thấy được vì hai container dùng chung một namespace tiến trình. Đây là mẹo gỡ lỗi hữu dụng nhất trong cả khoá này, và nó chạy được với MỌI ảnh dù tối giản tới đâu.</p>

<h3>Từ máy chủ, bằng nsenter</h3>
<pre><code>PID=\$(docker inspect -f '{{.State.Pid}}' web)
sudo nsenter -t \$PID -n ss -tlnp          <span class="tok-comment"># chỉ vào namespace MẠNG</span>
sudo nsenter -t \$PID -m ls /etc/nginx | head -3</code></pre>
<div class="out">State  Recv-Q Send-Q  Local Address:Port  Peer Address:Port
LISTEN 0      511           0.0.0.0:80         0.0.0.0:*
conf.d
fastcgi.conf
mime.types</div>
<p><code>nsenter</code> chạy một chương trình của <em>MÁY CHỦ</em> bên trong một tập con namespace của container mà bạn chọn. Vì công cụ đến từ máy chủ nên container không cần gì cả — điều đó khiến đây thành câu trả lời cuối cùng cho một ảnh distroless trên một cái máy mà bạn không kéo được ảnh gỡ lỗi về. Cần quyền root trên máy chủ.</p>
<pre><code>docker rm -f web api repl &gt;/dev/null 2&gt;&amp;1</code></pre>

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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. The image's ENV instructions</span><span class="lz-lnote">Baked in at build time and visible to anyone with the image (<code>docker history</code>). The base layer of defaults: <code>NODE_VERSION</code>, <code>PATH</code>, <code>LANG</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. --env-file, in file order</span><span class="lz-lnote">Read verbatim by Docker. Later files override earlier ones, and later lines override earlier lines within a file.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. -e / --env on the command line</span><span class="lz-lnote">Beats both of the above. <code>-e NAME</code> with no <code>=</code> copies the value from your current shell — convenient locally, and a silent empty string in CI where it does not exist.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Anything the entrypoint script sets</span><span class="lz-lnote">Runs last, inside the container, so it wins over everything. This is how official images derive values — <code>POSTGRES_USER</code> defaulting to <code>postgres</code>, for example.</span></div>
</div>
<pre><code>printf 'MODE=file\\nSHARED=from-file\\n' &gt; a.env
printf 'SHARED=from-second-file\\n'      &gt; b.env
docker run --rm --env-file a.env --env-file b.env -e MODE=flag alpine \\
  sh -c 'echo "MODE=\$MODE SHARED=\$SHARED"'</code></pre>
<div class="out">MODE=flag SHARED=from-second-file</div>
<div class="pitfall"><strong>Pitfall — <code>--env-file</code> is not a shell script.</strong> Docker reads it literally, and that has three consequences people discover the hard way:
<pre><code>PASSWORD="secret with spaces"     <span class="tok-comment"># value becomes: "secret with spaces" WITH the quotes</span>
GREETING=hello world              <span class="tok-comment"># fine — everything after = is the value</span>
URL=postgres://\${USER}@db/app     <span class="tok-comment"># NO expansion: the literal \${USER} is passed</span>
# a comment is fine, but only on its own line</code></pre>
No quote stripping, no variable expansion, no <code>export</code>, and a trailing space is part of the value. A password ending up wrapped in quote characters is one of the most common "the credentials are right but authentication fails" causes in Compose setups. Write values bare, and verify with <code>docker exec c env</code>.</div>

<h3>Environment variables are not secret</h3>
<pre><code>docker run -d --name db -e POSTGRES_PASSWORD=hunter2 postgres:16-alpine
docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | grep -i pass
PID=\$(docker inspect -f '{{.State.Pid}}' db)
sudo tr '\\0' '\\n' &lt; /proc/\$PID/environ | grep -i pass</code></pre>
<div class="out">["POSTGRES_PASSWORD=hunter2"
POSTGRES_PASSWORD=hunter2</div>
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
<pre><code>mkdir -p out
docker run --rm -v "\$PWD/out:/out" alpine sh -c 'echo hi &gt; /out/root-made.txt'
ls -l out/</code></pre>
<div class="out">-rw-r--r-- 1 root root 3 Aug 22 22:04 root-made.txt</div>
<p>The container ran as root, and there is no user namespace by default (Lesson 1.1), so UID 0 inside is UID 0 outside. The file on <em>your</em> directory is owned by root and you cannot edit or delete it without <code>sudo</code>. Every developer meets this on day one with a generated file — a build output, a migration, a lockfile.</p>
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
<pre><code>docker rm -f db &gt;/dev/null; rm -rf out a.env b.env pgpass</code></pre>

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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Các chỉ thị ENV của ảnh</span><span class="lz-lnote">Nướng sẵn lúc dựng và nhìn thấy được với bất cứ ai có cái ảnh (<code>docker history</code>). Tầng nền của các giá trị mặc định: <code>NODE_VERSION</code>, <code>PATH</code>, <code>LANG</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. --env-file, theo thứ tự file</span><span class="lz-lnote">Docker đọc NGUYÊN VĂN. File sau ghi đè file trước, và dòng sau ghi đè dòng trước trong cùng một file.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. -e / --env trên dòng lệnh</span><span class="lz-lnote">Thắng cả hai cái trên. <code>-e TÊN</code> không kèm <code>=</code> thì chép giá trị từ shell hiện tại của bạn — tiện khi làm cục bộ, và là một chuỗi rỗng câm lặng trong CI nơi nó không tồn tại.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Bất cứ thứ gì script entrypoint đặt</span><span class="lz-lnote">Chạy sau cùng, bên trong container, nên nó thắng tất cả. Đây là cách các ảnh chính thức suy ra giá trị — ví dụ <code>POSTGRES_USER</code> mặc định thành <code>postgres</code>.</span></div>
</div>
<pre><code>printf 'MODE=file\\nSHARED=from-file\\n' &gt; a.env
printf 'SHARED=from-second-file\\n'      &gt; b.env
docker run --rm --env-file a.env --env-file b.env -e MODE=flag alpine \\
  sh -c 'echo "MODE=\$MODE SHARED=\$SHARED"'</code></pre>
<div class="out">MODE=flag SHARED=from-second-file</div>
<div class="pitfall"><strong>Bẫy — <code>--env-file</code> KHÔNG phải một script shell.</strong> Docker đọc nó theo nghĩa đen, và điều đó kéo theo ba hệ quả mà người ta phát hiện ra theo cách đau đớn:
<pre><code>PASSWORD="mật khẩu có dấu cách"   <span class="tok-comment"># giá trị thành: "mật khẩu có dấu cách" KÈM dấu nháy</span>
GREETING=xin chào                 <span class="tok-comment"># ổn — mọi thứ sau dấu = đều là giá trị</span>
URL=postgres://\${USER}@db/app     <span class="tok-comment"># KHÔNG khai triển: cái \${USER} theo nghĩa đen được truyền đi</span>
# một dòng chú thích thì được, nhưng phải nằm riêng một dòng</code></pre>
Không bóc dấu nháy, không khai triển biến, không <code>export</code>, và một dấu cách ở cuối là một phần của giá trị. Một mật khẩu rốt cuộc bị bọc trong dấu nháy là một trong những nguyên nhân phổ biến nhất của "thông tin đăng nhập đúng mà xác thực vẫn hỏng" trong các thiết lập Compose. Hãy viết giá trị trần trụi, và kiểm bằng <code>docker exec c env</code>.</div>

<h3>Biến môi trường KHÔNG bí mật</h3>
<pre><code>docker run -d --name db -e POSTGRES_PASSWORD=hunter2 postgres:16-alpine
docker inspect db --format '{{json .Config.Env}}' | tr ',' '\\n' | grep -i pass
PID=\$(docker inspect -f '{{.State.Pid}}' db)
sudo tr '\\0' '\\n' &lt; /proc/\$PID/environ | grep -i pass</code></pre>
<div class="out">["POSTGRES_PASSWORD=hunter2"
POSTGRES_PASSWORD=hunter2</div>
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
<pre><code>mkdir -p out
docker run --rm -v "\$PWD/out:/out" alpine sh -c 'echo hi &gt; /out/root-made.txt'
ls -l out/</code></pre>
<div class="out">-rw-r--r-- 1 root root 3 Aug 22 22:04 root-made.txt</div>
<p>Container chạy dưới quyền root, và mặc định không có user namespace nào (Bài 1.1), nên UID 0 bên trong là UID 0 bên ngoài. Cái file trên thư mục của <em>BẠN</em> thuộc sở hữu root và bạn không sửa hay xoá nó được nếu không có <code>sudo</code>. Mọi lập trình viên đều gặp chuyện này ngay ngày đầu tiên với một file được sinh ra — một kết quả build, một migration, một file khoá phiên bản.</p>
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
<pre><code>docker rm -f db &gt;/dev/null; rm -rf out a.env b.env pgpass</code></pre>

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
<pre><code><span class="tok-comment"># Hit the wall on purpose and read the aftermath</span>
docker run --name oomtest --memory 64m alpine sh -c \\
  'head -c 200m /dev/zero | tail -c 1 &gt; /dev/null' 2&gt;/dev/null
docker inspect oomtest --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}'
sudo dmesg -T | grep -i 'killed process' | tail -1</code></pre>
<div class="out">exit=137 oom=true
[Fri Aug 22 22:31:07 2026] Memory cgroup out of memory: Killed process 41903 (tail) total-vm:205140kB, anon-rss:64200kB</div>
<div class="callout ok"><strong><code>.State.OOMKilled</code> is the field that ends the argument.</strong> Exit 137 alone is ambiguous — it could be a <code>docker kill</code>, a timed-out <code>docker stop</code>, or the OOM killer. That boolean says which, and <code>dmesg</code> on the host confirms it and names the process. Put both in your triage script (Lesson 2.2); together they turn the most common mystery exit into a five-second answer.</div>

<h3>CPU</h3>
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
<div class="callout"><strong>Limits change how your runtime sizes itself, which is often the bigger effect.</strong> Modern JVMs, Node 20+, .NET and Go's <code>GOMAXPROCS</code> (via <code>automaxprocs</code>) read the cgroup limits and size heaps and thread pools accordingly. Without <code>--cpus</code>, a Node process on a 64-core host creates a libuv thread pool and cluster sizing for 64 cores while being allowed a fraction of one — which produces context-switch thrash that looks like a mysterious latency problem. Setting limits is a correctness fix as much as a safety one.</div>

<h3>Restart policies</h3>
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

<h3>Healthchecks — and what they do NOT do</h3>
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
1</div>
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
<pre><code>docker rm -f api unbounded bounded oomtest &gt;/dev/null 2&gt;&amp;1</code></pre>

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
<pre><code><span class="tok-comment"># Đâm vào tường một cách có chủ ý rồi đọc hậu quả</span>
docker run --name oomtest --memory 64m alpine sh -c \\
  'head -c 200m /dev/zero | tail -c 1 &gt; /dev/null' 2&gt;/dev/null
docker inspect oomtest --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}'
sudo dmesg -T | grep -i 'killed process' | tail -1</code></pre>
<div class="out">exit=137 oom=true
[Fri Aug 22 22:31:07 2026] Memory cgroup out of memory: Killed process 41903 (tail) total-vm:205140kB, anon-rss:64200kB</div>
<div class="callout ok"><strong><code>.State.OOMKilled</code> là cái trường chấm dứt cuộc tranh cãi.</strong> Riêng mã 137 thì mập mờ — nó có thể là một lệnh <code>docker kill</code>, một lệnh <code>docker stop</code> hết giờ, hay kẻ giết OOM. Cái boolean đó nói rõ là cái nào, và <code>dmesg</code> trên máy chủ xác nhận lại và gọi tên tiến trình. Hãy đưa cả hai vào script phân loại của bạn (Bài 2.2); cùng nhau chúng biến mã thoát bí ẩn phổ biến nhất thành một câu trả lời năm giây.</div>

<h3>CPU</h3>
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
<div class="callout"><strong>Giới hạn đổi cách môi trường chạy của bạn TỰ ĐỊNH KÍCH THƯỚC, và đó thường mới là tác động lớn hơn.</strong> JVM hiện đại, Node 20 trở lên, .NET và <code>GOMAXPROCS</code> của Go (qua <code>automaxprocs</code>) đều đọc giới hạn cgroup rồi tính kích thước vùng nhớ và bể luồng theo đó. Không có <code>--cpus</code> thì một tiến trình Node trên một máy chủ 64 nhân sẽ tạo bể luồng libuv và cấu hình cluster cho 64 nhân trong khi chỉ được phép dùng một phần của một nhân — và điều đó sinh ra cảnh chuyển ngữ cảnh giằng xé trông y hệt một vấn đề độ trễ khó hiểu. Đặt giới hạn là một cách sửa TÍNH ĐÚNG ĐẮN chứ không chỉ là an toàn.</div>

<h3>Chính sách khởi động lại</h3>
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

<h3>Healthcheck — và thứ nó KHÔNG làm</h3>
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
1</div>
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
<pre><code>docker rm -f api unbounded bounded oomtest &gt;/dev/null 2&gt;&amp;1</code></pre>

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
      description: 'Tám câu về vị trí của cờ, -p và loopback, stdout là hợp đồng, exec với attach, -i với -t, --env-file, OOMKilled, và healthcheck không khởi động lại gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on running containers. These are the day-to-day mistakes, so being sure here saves real time later.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: which side of the image name a flag goes on (2.1), why an application's log file is invisible to <code>docker logs</code> (2.2), and what a healthcheck does and does not do (2.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về việc chạy container. Đây là những lỗi hằng ngày, nên chắc chắn ở đây là tiết kiệm thời gian thật về sau.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất: một cái cờ nằm ở phía nào của tên ảnh (bài 2.1), vì sao file log của ứng dụng vô hình với <code>docker logs</code> (bài 2.2), và healthcheck làm gì và KHÔNG làm gì (bài 2.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'docker run alpine -it fails with exec: "-it": executable file not found. Why?|||docker run alpine -it hỏng với exec: "-it": executable file not found. Vì sao?',
            options: [
              'Alpine does not support interactive terminals|||Alpine không hỗ trợ terminal tương tác',
              'Everything after the image name is the command and arguments for the container, so -it was passed to the container as a program name; Docker flags must come BEFORE the image|||Mọi thứ sau tên ảnh là câu lệnh và tham số CHO container, nên -it đã bị truyền vào container như một tên chương trình; cờ của Docker phải đứng TRƯỚC tên ảnh',
              'The image needs an ENTRYPOINT for -it to work|||Ảnh cần có ENTRYPOINT thì -it mới chạy',
              '-it must be written as two separate flags|||-it phải viết thành hai cờ riêng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You run a database with -p 5432:5432 on a public VPS with ufw configured to deny that port. Is it exposed?|||Bạn chạy một cơ sở dữ liệu với -p 5432:5432 trên một VPS công khai có ufw cấu hình chặn cổng đó. Nó có bị phơi ra không?',
            options: [
              'No — ufw denies the port, so the rule protects it|||Không — ufw chặn cổng đó nên luật ấy bảo vệ được nó',
              'Yes — Docker writes its rules into the DOCKER iptables chain, which is evaluated BEFORE ufw’s; bind to loopback with -p 127.0.0.1:5432:5432 instead|||CÓ — Docker ghi luật của nó vào chuỗi iptables DOCKER, và chuỗi đó được duyệt TRƯỚC luật của ufw; hãy gắn vào loopback bằng -p 127.0.0.1:5432:5432',
              'Only if the container also has --network host|||Chỉ khi container còn có thêm --network host',
              'Only on IPv6|||Chỉ trên IPv6',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'docker logs on your application container shows nothing, but the app is clearly working. What is the most likely cause?|||docker logs trên container ứng dụng của bạn chẳng hiện gì, nhưng ứng dụng thì rõ ràng đang chạy. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The log driver is broken and needs restarting|||Trình ghi log hỏng và cần khởi động lại',
              'The app writes to a log FILE inside the container instead of stdout/stderr — or its runtime is buffering stdout (e.g. Python without PYTHONUNBUFFERED)|||Ứng dụng ghi vào một FILE log bên trong container thay vì stdout/stderr — hoặc môi trường chạy của nó đang đệm stdout (ví dụ Python không có PYTHONUNBUFFERED)',
              'docker logs only works on stopped containers|||docker logs chỉ chạy với container đã dừng',
              'Logs are only kept for 60 seconds by default|||Log mặc định chỉ được giữ 60 giây',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the practical difference between docker exec -it c sh and docker attach c?|||Khác biệt thực tế giữa docker exec -it c sh và docker attach c là gì?',
            options: [
              'They are equivalent; attach is the older spelling|||Chúng tương đương; attach chỉ là cách viết cũ',
              'exec starts a NEW process inside the container, so exiting is harmless; attach connects to PID 1’s stdio, so Ctrl-C signals the application and usually stops the container (detach with Ctrl-P Ctrl-Q)|||exec khởi chạy một tiến trình MỚI bên trong container nên thoát ra là vô hại; attach nối vào stdio của PID 1 nên Ctrl-C gửi tín hiệu cho ứng dụng và thường là dừng container (tách ra bằng Ctrl-P Ctrl-Q)',
              'attach works on stopped containers; exec does not|||attach chạy được với container đã dừng; exec thì không',
              'exec requires the container to have bash installed|||exec đòi container phải có cài bash',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You are piping JSON into a container from a shell script. Should you use -it, -i, or neither?|||Bạn đang đổ JSON vào một container từ một script shell. Nên dùng -it, -i, hay không dùng cờ nào?',
            options: [
              '-it, so the container can read input|||-it, để container đọc được đầu vào',
              '-i only — you need stdin open, but a TTY makes programs emit colour escape codes and interactive formatting into the output you are parsing|||CHỈ -i — bạn cần stdin mở, nhưng một cái TTY khiến các chương trình phun mã thoát màu và định dạng tương tác vào đúng cái output bạn đang phân tích',
              'Neither; Docker connects stdin automatically|||Không cờ nào; Docker tự nối stdin',
              '-t only|||Chỉ -t',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An --env-file line reads PASSWORD="p@ss word". What value does the container receive?|||Một dòng trong --env-file ghi PASSWORD="p@ss word". Container nhận được giá trị nào?',
            options: [
              'p@ss word — Docker strips the surrounding quotes|||p@ss word — Docker bóc cặp dấu nháy bao ngoài',
              'The literal "p@ss word" WITH the quote characters — Docker reads env files verbatim: no quote stripping, no variable expansion, no shell|||Đúng chuỗi "p@ss word" KÈM cả dấu nháy — Docker đọc file env theo nghĩa đen: không bóc dấu nháy, không khai triển biến, không có shell nào',
              'p@ss — everything after the space is dropped|||p@ss — mọi thứ sau dấu cách bị bỏ',
              'It is an error; env files cannot contain spaces|||Đó là một lỗi; file env không chứa được dấu cách',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A container exited with 137. Which single field tells you whether the memory limit caused it?|||Một container thoát với mã 137. Trường DUY NHẤT nào cho bạn biết có phải trần bộ nhớ gây ra nó không?',
            options: [
              '.State.ExitCode — 137 always means OOM|||.State.ExitCode — 137 luôn nghĩa là OOM',
              '.State.OOMKilled — 137 only means SIGKILL, which could also be docker kill or a timed-out docker stop; the boolean disambiguates, and dmesg on the host confirms|||.State.OOMKilled — 137 chỉ nghĩa là SIGKILL, mà đó cũng có thể là docker kill hay một lệnh docker stop hết giờ; cái boolean đó phân định, và dmesg trên máy chủ xác nhận',
              '.RestartCount|||.RestartCount',
              '.HostConfig.Memory|||.HostConfig.Memory',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You add a HEALTHCHECK and the container goes unhealthy. What does plain Docker do about it?|||Bạn thêm một HEALTHCHECK và container chuyển sang unhealthy. Docker trần làm gì với chuyện đó?',
            options: [
              'Restarts the container automatically|||Tự động khởi động lại container',
              'Nothing — it only reports the status; something else must act on it: Compose depends_on: service_healthy, an orchestrator, a proxy, or your deploy script|||Không gì cả — nó chỉ BÁO CÁO trạng thái; phải có thứ khác hành động theo: Compose depends_on: service_healthy, một bộ điều phối, một proxy, hay script deploy của bạn',
              'Stops the container and marks it dead|||Dừng container và đánh dấu nó là dead',
              'Removes it from any published ports|||Gỡ nó khỏi mọi cổng đã publish',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
