/**
 * Docker — Chương 11: chạy trên production.
 * Chính sách restart · hạn mức tài nguyên & exit 137 · log & xoay log · cập nhật không gián đoạn & CI/CD · đĩa & giám sát · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → &#36;{;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 *
 * Nâng cấp 09/2026: bài 11.0 slide (deck dk-11, 32 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 11.1–11.5;
 * quiz 10 câu. Output MỚI chạy thật 24/09/2026 trên Docker Engine 29.6 (Fedora 44, amd64) và Docker Desktop
 * 4.91 / Engine 29.8 (Mac M1). Đã sửa các chỗ cũ SAI: số lần restart sau 25 s, heap mặc định của Node 20+,
 * mem_swappiness trên cgroup v2, "reload" không áp log-opts, và prune --volumes không xoá volume có tên (Engine 23+).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 11 — Running it in production|||Chương 11 — Chạy trên production',
  description: 'Cái stack chạy được rồi; giờ nó phải sống sót qua khởi động lại máy, qua rò rỉ bộ nhớ, qua log đầy đĩa, qua một lượt deploy hỏng, và qua việc bạn đang ngủ. Chương này là những cái cờ và thói quen biến "chạy được trên máy tôi" thành "chạy được lúc 3 giờ sáng".',
  lessons: [
    /* ─────────────────────────── 11.0 ─────────────────────────── */
    {
      title: '11.0 — Chapter 11 slides: running it in production, in pictures|||11.0 — Slide Chương 11: chạy trên production bằng hình',
      slug: 'dk-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 11: chính sách restart và độ trễ nhân đôi, reboot và depends_on, hạn mức RAM/CPU và exit 137, heap của Node trong container, log json-file phình ra và cách xoay vòng, khoảng trống khi tráo container, tag theo commit và quay lui, thang prune an toàn và năm phép kiểm giám sát — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">This is the "operations" chapter: what keeps a Docker stack alive on a small VPS while you sleep. Skim the slides first to see the five failure modes — a crash nobody restarts, a leak that kills the database, logs that fill the disk, a deploy that leaves a gap or cannot be undone, and a disk that quietly fills with images and build cache — then read the lessons, then come back to the slides as a revision sheet.</p>
<p>Slides 3–7 belong to Lesson 11.1, 8–13 to 11.2, 14–18 to 11.3, 19–25 to 11.4 and 26–29 to 11.5. The last three are the chapter's common mistakes, a cheat sheet and a 45-minute practice session. Every terminal is real output recorded in September 2026 on Docker Engine 29.6 (Linux) and Docker Desktop 4.91 (Mac M1): the restart delays were timed with <code>docker events</code>, the log file really grew to 33 MB, the deploy gap was measured by a script calling the API every 50 ms. The incidents on slides 21–22 — a build killed with exit 137, a disk filled by build cache, an image with the wrong C library — happened to one real student project. Only the reboot slide is drawn from the documentation, because rebooting a machine that runs other people's work is not an experiment worth doing. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Đây là chương "vận hành": thứ giữ cho một stack Docker sống trên một con VPS nhỏ trong lúc bạn ngủ. Lướt bộ slide trước để thấy năm kiểu hỏng — một cú sập không ai khởi động lại, một chỗ rò bộ nhớ giết luôn cơ sở dữ liệu, log làm đầy đĩa, một lượt deploy để lại khoảng trống hoặc không hoàn tác được, và một cái đĩa lặng lẽ đầy vì ảnh cũ với cache build — rồi đọc bài, rồi quay lại bộ slide như một tờ ôn tập.</p>
<p>Slide 3–7 thuộc Bài 11.1, 8–13 thuộc 11.2, 14–18 thuộc 11.3, 19–25 thuộc 11.4 và 26–29 thuộc 11.5. Ba slide cuối là những sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 45 phút. Mọi terminal là output THẬT, ghi tháng 9/2026 trên Docker Engine 29.6 (Linux) và Docker Desktop 4.91 (Mac M1): độ trễ restart được bấm giờ bằng <code>docker events</code>, file log thật sự phình tới 33 MB, khoảng trống khi deploy được đo bằng một script gọi API mỗi 50 ms. Các sự cố ở slide 21–22 — lượt build bị giết với exit 137, đĩa đầy vì cache build, ảnh mang sai thư viện C — là chuyện thật của một dự án sinh viên. Riêng slide khởi động lại máy được vẽ theo tài liệu, vì reboot một cái máy đang chạy việc của người khác không phải thí nghiệm đáng làm. Con số trên máy bạn có thể khác; quy luật thì không.</p>
</div>
${gallery('dk-11', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Bốn chính sách restart'], [4, 'Độ trễ restart nhân đôi'], [5, 'docker update và on-failure:3'],
  [6, 'Reboot: dockerd dựng lại, không theo depends_on'], [7, 'Ba con số đọc vòng lặp sập'],
  [8, 'Không hạn mức: một chỗ rò giết luôn Postgres'], [9, 'Exit 137, sự kiện oom, dòng dmesg'], [10, 'deploy.resources thành con số cgroup'],
  [11, 'Hết CPU thì chậm, hết RAM thì chết'], [12, 'Swap gấp đôi và mem_swappiness bị bỏ qua'], [13, 'Heap của Node và trần cgroup'],
  [14, 'Log đi đâu'], [15, '300.000 dòng = 33 MB'], [16, 'Không bảng nào đếm log'],
  [17, 'rm file đang mở không trả chỗ'], [18, 'Xoay vòng ở hai nơi, restart chứ không reload'],
  [19, 'Khoảng trống khi tráo container'], [20, 'Bắt SIGTERM và stop_grace_period'], [21, 'Dựng ở máy khác, VPS chỉ tráo'],
  [22, 'Deploy là script người chạy'], [23, 'Tag theo commit và quay lui'], [24, 'up -d --wait bắt ảnh hỏng'], [25, 'Có migration thì quay lui khác'],
  [26, 'Bốn thứ phình ra'], [27, 'Thang prune'], [28, 'Dọn tự động có nhịp tim'], [29, 'Năm phép kiểm giám sát'],
  [30, 'Sai lầm hay gặp'], [31, 'Bảng tra nhanh'], [32, 'Thực hành chương 11'],
])}
`,
    },
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Restart policies and surviving a reboot|||11.1 — Chính sách restart và sống sót qua khởi động lại',
      slug: 'dk-11-1-restart',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn chính sách restart và cái nào đúng cho việc gì, độ trễ tăng dần của Docker, vì sao khởi động lại máy có thể không mang stack trở lại, systemd với compose, và vòng lặp sập cần nhận ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Restart policies and surviving a reboot</h2>
<p class="lead">A container that has crashed is not automatically a problem; a container that stays crashed is. Restart policies are the cheapest resilience Docker offers — one word per service — and the difference between the right word and the wrong one shows up at three in the morning, or after a power cut you did not know about.</p>

<h3>The four policies</h3>
${slide('dk-11', 3, 'Bốn chính sách restart — unless-stopped là mặc định đúng')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">no</span><span class="lz-t">the default; never restarted</span><span class="lz-d">Correct for migrations, seeds, one-off jobs, anything whose <em>job</em> is to exit. Wrong for every long-running service, and it is what you get by omitting the key.</span></div>
  <div class="lz-step"><span class="lz-k">on-failure[:5]</span><span class="lz-t">only on a non-zero exit, optionally capped</span><span class="lz-d">A clean exit is respected. Right for a batch worker that legitimately finishes; the count limit stops an unfixable failure from retrying forever.</span></div>
  <div class="lz-step"><span class="lz-k">unless-stopped</span><span class="lz-t">always, except after an explicit stop</span><span class="lz-d"><strong>The production default.</strong> Comes back after a crash and after a host reboot, but if you ran <code>docker stop</code> to work on something, it stays stopped until you say otherwise.</span></div>
  <div class="lz-step"><span class="lz-k">always</span><span class="lz-t">always, even one you deliberately stopped</span><span class="lz-d">Restarts on daemon start regardless of the state you left it in. Occasionally what you want; usually a surprise when a container you stopped last week reappears after a reboot.</span></div>
</div>
<pre><code><span class="tok-comment"># Watch a crash loop and the backoff</span>
docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'
sleep 25 &amp;&amp; docker inspect -f '{{ .RestartCount }} restarts, state={{ .State.Status }}' flaky</code></pre>
<div class="out">7 restarts, state=restarting</div>
<p>Docker does not hammer: the delay doubles from 100ms up to a one-minute ceiling, and resets once the container stays up for ten seconds. That is why a container failing every two seconds shows seven restarts in twenty-five seconds (measured on Docker Engine 29.6), not twelve — and why a genuinely broken service settles into a slow, quiet loop instead of consuming the machine.</p>

<h3>Run it step by step: time the backoff yourself</h3>
${slide('dk-11', 4, 'Độ trễ restart nhân đôi — đo thật bằng docker events')}
<p>"The delay doubles" is easy to read and hard to picture. You can watch it happen in two terminals. The container below sleeps two seconds and exits with code 1 — a stand-in for an API that crashes because the database is not up yet.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1 · start a container that always fails</span><span class="lz-t">docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'</span><span class="lz-d"><code>--restart on-failure</code> means "restart me only when I exit with a non-zero code", and <code>exit 1</code> guarantees that.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2 · in a second terminal, watch the events</span><span class="lz-t">docker events --filter container=flaky --filter event=start --filter event=die</span><span class="lz-d"><code>docker events</code> streams everything the daemon does; the two filters keep only the moments the container starts and dies. Leave it running.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3 · read the gaps</span><span class="lz-t">die → start → die → start …</span><span class="lz-d">Subtract each <code>die</code> timestamp from the next <code>start</code>. That difference is the delay Docker chose before trying again.</span></div>
  <div class="lz-step"><span class="lz-k">Step 4 · count and clean up</span><span class="lz-t">docker inspect -f '{{.RestartCount}}' flaky ; docker rm -f flaky</span><span class="lz-d"><code>RestartCount</code> is Docker's own counter. <code>rm -f</code> stops and removes it in one go.</span></div>
</div>
<pre><code class="language-bash">docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'
docker events --filter container=flaky --filter event=start --filter event=die \\
  --format '{{.TimeNano}} {{.Action}} {{index .Actor.Attributes "exitCode"}}'</code></pre>
<div class="out">1790191047841188522 die 1
1790191047981449573 start
1790191050122884735 die 1
1790191050361034953 start
1790191052507681761 die 1
1790191052944934811 start
…
1790191090817545899 die 1
1790191116456385883 start</div>
<p>Real output from the course's Linux machine (Docker Engine 29.6), cut in the middle. The numbers are nanoseconds; turned into seconds, the waits between a <code>die</code> and the next <code>start</code> were 0.14, 0.24, 0.44, 0.86, 1.63, 3.23, 6.43, 12.84 and 25.64 seconds — each roughly double the last. After 25 seconds <code>RestartCount</code> was 7; after 77 seconds it was only 10. Docker's source caps the wait at one minute, and the counter of delays resets once a container stays up for ten seconds — which is also why the documentation says a policy "only takes effect after a container starts successfully", meaning it ran for at least ten seconds.</p>
<table>
<tr><th>Piece</th><th>What it means</th></tr>
<tr><td><code>--restart on-failure</code></td><td>The policy. <code>on-failure:5</code> adds a cap of five attempts; <code>unless-stopped</code> and <code>always</code> take no number.</td></tr>
<tr><td><code>sh -c 'sleep 2; exit 1'</code></td><td>Run two commands in a shell: wait two seconds, then exit with code 1 (failure).</td></tr>
<tr><td><code>--filter event=start</code></td><td>Only show events of that type. Several <code>--filter</code> flags of the same key are OR-ed together.</td></tr>
<tr><td><code>{{.TimeNano}}</code>, <code>{{.Action}}</code></td><td>Go-template fields of each event: time in nanoseconds since 1970, and what happened.</td></tr>
<tr><td><code>{{index .Actor.Attributes "exitCode"}}</code></td><td>The exit code travels as an attribute of the <code>die</code> event; <code>index</code> reads one key from that map.</td></tr>
</table>
<div class="callout"><strong>On a Mac the same demo works</strong>, with one difference: <code>timeout</code> does not exist in macOS's shell, so stop the <code>docker events</code> window with <code>Ctrl+C</code>. The delays are decided by the daemon inside Docker Desktop's VM and follow the same doubling.</div>

<h3>Change a policy without recreating the container</h3>
${slide('dk-11', 5, 'docker update sửa chính sách tại chỗ; on-failure:3 bỏ cuộc sau 3 lần')}
<p>Two small facts save a lot of pain on a live server. First, you do not need to delete a container to fix a forgotten <code>--restart</code>: <code>docker update</code> changes the policy of a running container in place, keeping its writable layer and its logs. Second, a capped <code>on-failure</code> really does give up — and when it does, the container just sits in <code>Exited</code>, with nothing else to tell you.</p>
<pre><code class="language-bash">docker run -d --name cap --restart on-failure:3 alpine sh -c 'exit 3'
sleep 5
docker inspect -f '{{.RestartCount}} restarts · {{.State.Status}} · exit {{.State.ExitCode}}' cap
docker ps -a --filter name=cap --format '{{.Status}}'

docker run -d --name web nginx:1.27-alpine
docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' web
docker update --restart unless-stopped web
docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' web</code></pre>
<div class="out">3 restarts · exited · exit 3
Exited (3) 4 seconds ago
no
web
unless-stopped</div>
<p>Real output from a Mac (Docker Desktop, Engine 29.8). In Compose you do not use <code>docker update</code>: write <code>restart: unless-stopped</code> in the file and run <code>docker compose up -d</code>, which recreates only the services whose configuration changed.</p>

<h3>A reboot does not always bring the stack back</h3>
${slide('dk-11', 6, 'Reboot: dockerd dựng lại container theo chính sách — không theo depends_on')}
<pre><code>systemctl is-enabled docker
docker info --format '{{ .LiveRestoreEnabled }}'
sudo reboot
<span class="tok-comment"># …after it comes back</span>
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">enabled
false
SERVICE   STATUS
api       Up 41 seconds (healthy)
db        Up 53 seconds (healthy)
nginx     Up 39 seconds (healthy)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">The daemon must be enabled</span><span class="v"><code>systemctl enable docker</code>. Most distributions do this on install, but a hand-installed daemon or a minimal image may not — and nothing tells you until the reboot.</span></div>
  <div class="kv"><span class="k">Only <code>always</code> and <code>unless-stopped</code> survive</span><span class="v"><code>on-failure</code> containers are <em>not</em> restarted on daemon start unless they were running and failed. A worker with <code>on-failure</code> quietly does not come back after a reboot.</span></div>
  <div class="kv"><span class="k">Volumes and networks are recreated</span><span class="v">Named volumes persist across reboots (Lesson 7.1); Docker recreates the bridge networks. Nothing to do here — this part is reliable.</span></div>
  <div class="kv"><span class="k">Order is not guaranteed</span><span class="v">On a reboot, Docker restarts containers without honouring <code>depends_on</code>. Your API may start before Postgres is ready — which is exactly why the application must retry (Lesson 9.3).</span></div>
  <div class="kv"><span class="k">Test it once, deliberately</span><span class="v">Reboot the server on a quiet afternoon and watch what comes back. Finding out during an unplanned reboot is the expensive version of the same experiment.</span></div>
</div>
<div class="callout warn"><strong><code>depends_on</code> has no effect on a reboot.</strong> It orders <code>docker compose up</code>, and nothing else — the daemon restarting containers on boot knows nothing about it. Your API will sometimes start before the database is accepting connections, and if it exits on that, <code>unless-stopped</code> will restart it until it succeeds. That works, and it means a reboot produces sixty seconds of restart noise in the logs. A retry loop in the application (Lesson 9.3) turns that into a clean start.</div>
<p><strong>What happens at boot, in order</strong> — drawn from the documentation, not from rebooting the course's machines (restarting a daemon that runs other people's work is not an experiment worth doing):</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · systemd starts docker.service</span><span class="lz-t">only if it is enabled</span><span class="lz-d"><code>systemctl is-enabled docker</code> must print <code>enabled</code>. On the course's Linux machine it does; on a hand-built server, check it once.</span></div>
  <div class="lz-step"><span class="lz-k">2 · dockerd reads every container's policy</span><span class="lz-t">always and unless-stopped come back</span><span class="lz-d"><code>unless-stopped</code> skips containers you had stopped yourself; <code>always</code> starts even those. <code>no</code> and <code>on-failure</code> stay down.</span></div>
  <div class="lz-step"><span class="lz-k">3 · in no particular order</span><span class="lz-t">the API may start before Postgres listens</span><span class="lz-d">The daemon knows nothing about Compose's <code>depends_on</code> or healthchecks; that ordering exists only while <code>docker compose up</code> is running.</span></div>
  <div class="lz-step"><span class="lz-k">4 · the application retries, or a unit runs compose</span><span class="lz-t">two ways to get a clean start</span><span class="lz-d">A retry loop in the app (Lesson 9.3), or the systemd unit in the next section, which runs <code>compose up</code> and so honours <code>depends_on</code> again.</span></div>
</div>
<div class="callout"><strong>Restarting the daemon is a smaller reboot.</strong> Upgrading Docker or running <code>systemctl restart docker</code> stops every container, then brings back those with a restart policy — unless <code>live-restore</code> is on, in which case containers keep running while the daemon is away (Lesson 1.5). Check yours with <code>docker info -f '{{.LiveRestoreEnabled}}'</code>; both the course's Linux machine and Docker Desktop print <code>false</code>.</div>

<h3>Making compose itself a systemd unit</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/blog.service</span>
[Unit]
Description=blog stack
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/deployer/repo
EnvironmentFile=/opt/cuonghoangdev/.env
ExecStart=/usr/bin/docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
ExecStop=/usr/bin/docker compose -f compose.yaml -f compose.prod.yaml stop
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target</code></pre>
<pre><code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now blog.service
systemctl status blog --no-pager | head -4</code></pre>
<div class="out">● blog.service - blog stack
     Loaded: loaded (/etc/systemd/system/blog.service; enabled; preset: enabled)
     Active: active (exited) since Fri 2026-08-22 13:02:11 +07; 8s ago
    Process: 5121 ExecStart=/usr/bin/docker compose ... up -d --no-build (code=exited, status=0)</div>
<p>Restart policies bring individual containers back; a unit like this brings the <em>stack</em> back — with <code>depends_on</code> honoured, with the production env file loaded, and with the correct file combination. It is worth the fifteen lines on any server you care about, and it also gives you <code>systemctl restart blog</code> as a single, memorable command that cannot accidentally include <code>-v</code>.</p>
<table>
<tr><th>Line of the unit</th><th>Why it is there</th></tr>
<tr><td><code>Requires=docker.service</code> + <code>After=docker.service</code></td><td>Start only once the daemon is up; if Docker is stopped, stop this unit too.</td></tr>
<tr><td><code>network-online.target</code></td><td>Wait until the network is really configured, so pulls and DNS work.</td></tr>
<tr><td><code>Type=oneshot</code> + <code>RemainAfterExit=yes</code></td><td><code>up -d</code> returns immediately; these two tell systemd "the job is done, but count the service as active".</td></tr>
<tr><td><code>WorkingDirectory</code></td><td>Where the compose files live — relative paths in them resolve from here.</td></tr>
<tr><td><code>EnvironmentFile</code></td><td>Loads the production secrets that <code>&#36;{VAR}</code> in the compose file expects.</td></tr>
<tr><td><code>--no-build</code></td><td>Never build on boot; use the images already pulled (Lesson 11.4).</td></tr>
<tr><td><code>ExecStop=… stop</code></td><td><code>stop</code>, not <code>down</code>: containers and their writable layers survive a shutdown.</td></tr>
<tr><td><code>TimeoutStartSec=0</code></td><td>No start timeout — a slow pull on boot must not make systemd give up.</td></tr>
</table>

<h3>Reading a crash loop</h3>
${slide('dk-11', 7, 'Ba con số đọc một vòng lặp sập trước khi đọc log')}
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}' | head -4
docker inspect -f '{{ .RestartCount }} {{ .State.ExitCode }} {{ .State.OOMKilled }}' blog-api-1
docker compose logs --tail 5 api</code></pre>
<div class="out">NAMES        STATUS
blog-api-1   Restarting (1) 3 seconds ago
blog-db-1    Up 4 minutes (healthy)
12 1 false
blog-api-1  | Error: P1001: Can't reach database server at &#96;db&#96;:&#96;5432&#96;
blog-api-1  | node:internal/process/promises:391
blog-api-1  |    triggerUncaughtException(err)</div>
<div class="callout ok"><strong>Three numbers tell you most of what you need.</strong> <code>RestartCount</code> rising means a loop, not a one-off. <code>ExitCode</code> names the cause: 1 is an application error, 137 is a kill (usually OOM — Lesson 11.2), 143 is a clean SIGTERM. And <code>OOMKilled</code> distinguishes a memory kill from every other 137. Then read the logs of the <em>last</em> attempt, because a restarting container's logs accumulate across every attempt and only the newest one is current.</div>
<p>The same three numbers, read on the flaky container from the step-by-step section on the course's Linux machine, 77 seconds in: <code>docker ps -a</code> printed <code>flaky Restarting (1) 3 seconds ago</code> and <code>docker inspect</code> printed <code>10 1 false</code> — ten attempts, exit code 1, not a memory kill. That alone says "the program itself keeps failing on start", and <code>docker logs --tail 20</code> will say why.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 group's VPS rebooted overnight after a kernel update. In the morning the website works but nobody has received a notification email: the email worker was started with <code>--restart on-failure</code> and never came back. Rebuild the situation in <code>~/thu-docker</code> and fix it properly.</p><ol>
<li>Start a "worker" that crashes every two seconds: <code>docker run -d --name thu-worker --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'</code>. In a second terminal, watch it with the <code>docker events</code> command from the step-by-step section for about 30 seconds and write down the waits between <code>die</code> and <code>start</code>.</li>
<li>Read the three numbers: <code>docker inspect -f '{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}' thu-worker</code>. Decide from them alone whether this is a memory kill or an application error.</li>
<li>Change the policy in place: <code>docker update --restart unless-stopped thu-worker</code>, and confirm with <code>docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' thu-worker</code>.</li>
<li>Prove that <code>unless-stopped</code> respects you: <code>docker stop thu-worker</code>, wait 20 seconds, and check <code>docker ps -a --filter name=thu-worker</code> — it must still be <code>Exited</code>.</li>
<li>Clean up: <code>docker rm -f thu-worker</code>.</li></ol>
<p><strong>Done when:</strong> your list of waits roughly doubles each time (about 0.1 → 0.2 → 0.4 → 0.9 s…), the three numbers show exit code 1 with <code>OOMKilled=false</code>, the policy reads <code>unless-stopped</code>, and after <code>docker stop</code> the container stays <code>Exited</code> instead of coming back.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Restart policy</span><span class="v">The rule the daemon follows when a container stops: <code>no</code>, <code>on-failure[:N]</code>, <code>always</code>, <code>unless-stopped</code>.</span></div>
  <div class="kv"><span class="k">Backoff</span><span class="v">The growing wait between restart attempts: about 0.1 s, doubling each time, capped at one minute.</span></div>
  <div class="kv"><span class="k">Crash loop</span><span class="v">A container that starts, dies and is restarted again and again; <code>docker ps</code> shows <code>Restarting (code)</code>.</span></div>
  <div class="kv"><span class="k">RestartCount</span><span class="v">Docker's own counter of automatic restarts for one container, read with <code>docker inspect</code>.</span></div>
  <div class="kv"><span class="k">systemd unit</span><span class="v">A file under <code>/etc/systemd/system/</code> that tells Linux's init system what to start at boot and in what order.</span></div>
  <div class="kv"><span class="k">docker update</span><span class="v">Changes some settings of an existing container — restart policy, memory and CPU limits — without recreating it.</span></div>
  <div class="kv"><span class="k">live-restore</span><span class="v">A daemon option that keeps containers running while <code>dockerd</code> itself restarts. Off by default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Put <code>restart: unless-stopped</code> on every long-running service and write <code>restart: "no"</code> explicitly on jobs that are meant to exit.</li>
<li>Docker waits about 0.1 s before the first restart and doubles the wait each time (measured: 7 restarts in 25 s), so a crash loop is quiet rather than loud.</li>
<li><code>on-failure:N</code> gives up after N attempts and then sits in <code>Exited</code>; it also does not come back when the daemon restarts.</li>
<li>After a reboot the daemon restarts containers in no particular order and ignores <code>depends_on</code>; the app must retry, or a systemd unit must run <code>compose up</code>.</li>
<li><code>docker update --restart</code> fixes a forgotten policy on a running container without losing anything.</li>
<li><code>RestartCount</code>, <code>ExitCode</code> and <code>OOMKilled</code> classify a crash loop before you read a single log line.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/containers/start-containers-automatically/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Start containers automatically</span><span class="lc-sub">The four policies, the exact backoff behaviour, how they interact with the daemon starting, and the process-manager alternatives when a policy is not enough.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/daemon/live-restore/" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Live restore</span><span class="lc-sub">Keeping containers running while the Docker daemon itself restarts — useful for daemon upgrades, with the caveats about what it does not cover.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: survive a reboot</span><span class="lc-sub">Graded exercises: choose a restart policy for six services, predict which containers return after a reboot, and read three crash loops from <code>RestartCount</code>, <code>ExitCode</code> and <code>OOMKilled</code> alone.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> leaving <code>restart</code> unset on production services. The default is <code>no</code>, so a container that crashes once at four in the morning — an unhandled promise rejection, a brief network partition, a transient database error — stays down until a human notices. Everything looks fine on the host: the other containers are up, the disk is not full, nothing in <code>dmesg</code>. The only symptom is that your site is down and nothing tried to fix it. Put <code>restart: unless-stopped</code> on every long-running service, and <code>restart: "no"</code> explicitly on the jobs that are supposed to exit, so a reader can tell the difference between a deliberate choice and an omission.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>unless-stopped</code> is the production default: it survives crashes and reboots but respects a deliberate stop. A reboot restarts containers without honouring <code>depends_on</code>, so the application must retry its dependencies — and a systemd unit that runs <code>compose up</code> brings the whole stack back in the right order. And <code>RestartCount</code>, <code>ExitCode</code> and <code>OOMKilled</code> from <code>docker inspect</code> identify most crash loops before you read a single log line.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Chính sách restart và sống sót qua khởi động lại</h2>
<p class="lead">Một container đã sập chưa hẳn là vấn đề; một container CỨ NẰM đó sập mới là. Chính sách restart là thứ sức chịu đựng rẻ nhất Docker cho bạn — một từ cho mỗi dịch vụ — và khác biệt giữa từ đúng với từ sai lộ ra lúc ba giờ sáng, hoặc sau một lần mất điện mà bạn không hay biết.</p>

<h3>Bốn chính sách</h3>
${slide('dk-11', 3, 'Bốn chính sách restart — unless-stopped là mặc định đúng')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">no</span><span class="lz-t">mặc định; không bao giờ khởi động lại</span><span class="lz-d">Đúng cho migration, seed, việc chạy một lần, mọi thứ mà <em>việc</em> của nó là thoát. Sai cho mọi dịch vụ chạy dài, và đó là thứ bạn nhận được khi bỏ trống cái khoá này.</span></div>
  <div class="lz-step"><span class="lz-k">on-failure[:5]</span><span class="lz-t">chỉ khi thoát khác 0, có thể đặt trần</span><span class="lz-d">Một lần thoát sạch được tôn trọng. Đúng cho một worker theo lô kết thúc một cách chính đáng; giới hạn số lần ngăn một cái hỏng không sửa được cứ thử lại mãi.</span></div>
  <div class="lz-step"><span class="lz-k">unless-stopped</span><span class="lz-t">luôn luôn, trừ khi bạn dừng tường minh</span><span class="lz-d"><strong>Mặc định của production.</strong> Quay lại sau một cú sập và sau một lần khởi động lại máy, nhưng nếu bạn đã chạy <code>docker stop</code> để làm gì đó thì nó nằm yên cho tới khi bạn nói khác đi.</span></div>
  <div class="lz-step"><span class="lz-k">always</span><span class="lz-t">luôn luôn, kể cả cái bạn cố tình dừng</span><span class="lz-d">Khởi động lại lúc daemon lên bất kể bạn để nó ở trạng thái nào. Thỉnh thoảng đúng ý bạn; thường thì là một bất ngờ khi một container bạn dừng từ tuần trước bỗng hiện lại sau một lần khởi động máy.</span></div>
</div>
<pre><code><span class="tok-comment"># Xem một vòng lặp sập và độ trễ tăng dần</span>
docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'
sleep 25 &amp;&amp; docker inspect -f '{{ .RestartCount }} restarts, state={{ .State.Status }}' flaky</code></pre>
<div class="out">7 restarts, state=restarting</div>
<p>Docker không nện liên hồi: độ trễ nhân đôi từ 100ms lên tới trần một phút, và đặt lại khi container đứng vững được mười giây. Đó là lý do một container hỏng cứ hai giây một lần chỉ hiện bảy lần khởi động lại trong hai mươi lăm giây (đo trên Docker Engine 29.6) chứ không phải mười hai — và cũng là lý do một dịch vụ hỏng thật sẽ lắng vào một vòng lặp chậm và im ắng thay vì ngốn hết cả cái máy.</p>

<h3>Chạy thử từng bước: tự bấm giờ độ trễ restart</h3>
${slide('dk-11', 4, 'Độ trễ restart nhân đôi — đo thật bằng docker events')}
<p>"Độ trễ nhân đôi" đọc thì dễ mà hình dung thì khó. Bạn có thể nhìn nó xảy ra bằng hai cửa sổ terminal. Container dưới đây ngủ hai giây rồi thoát với mã 1 — đóng vai một API sập vì cơ sở dữ liệu chưa lên.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1 · chạy một container lần nào cũng hỏng</span><span class="lz-t">docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'</span><span class="lz-d"><code>--restart on-failure</code> nghĩa là "chỉ khởi động lại khi tôi thoát với mã khác 0", và <code>exit 1</code> bảo đảm điều đó.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2 · ở cửa sổ thứ hai, xem sự kiện</span><span class="lz-t">docker events --filter container=flaky --filter event=start --filter event=die</span><span class="lz-d"><code>docker events</code> (luồng sự kiện) in ra mọi việc daemon làm; hai bộ lọc chỉ giữ lại lúc container khởi động và lúc chết. Để nó chạy.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3 · đọc khoảng cách</span><span class="lz-t">die → start → die → start …</span><span class="lz-d">Lấy mốc <code>start</code> kế tiếp trừ mốc <code>die</code>. Hiệu đó là khoảng Docker chọn chờ trước khi thử lại.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 4 · đếm rồi dọn</span><span class="lz-t">docker inspect -f '{{.RestartCount}}' flaky ; docker rm -f flaky</span><span class="lz-d"><code>RestartCount</code> là bộ đếm của chính Docker. <code>rm -f</code> dừng và xoá trong một lệnh.</span></div>
</div>
<pre><code class="language-bash">docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'
docker events --filter container=flaky --filter event=start --filter event=die \\
  --format '{{.TimeNano}} {{.Action}} {{index .Actor.Attributes "exitCode"}}'</code></pre>
<div class="out">1790191047841188522 die 1
1790191047981449573 start
1790191050122884735 die 1
1790191050361034953 start
1790191052507681761 die 1
1790191052944934811 start
…
1790191090817545899 die 1
1790191116456385883 start</div>
<p>Output thật trên máy Linux của khoá (Docker Engine 29.6), cắt bớt ở giữa. Các con số là nano giây; đổi ra giây thì khoảng chờ giữa một lần <code>die</code> và lần <code>start</code> kế tiếp là 0,14 · 0,24 · 0,44 · 0,86 · 1,63 · 3,23 · 6,43 · 12,84 và 25,64 giây — mỗi lần gần gấp đôi lần trước. Sau 25 giây <code>RestartCount</code> là 7; sau 77 giây cũng mới 10. Mã nguồn Docker đặt trần chờ một phút, và bộ đếm độ trễ về 0 khi container đứng vững được mười giây — cũng là lý do tài liệu nói chính sách "chỉ có hiệu lực sau khi container khởi động thành công", tức đã chạy được ít nhất mười giây.</p>
<table>
<tr><th>Mảnh lệnh</th><th>Nghĩa là</th></tr>
<tr><td><code>--restart on-failure</code></td><td>Chính sách. <code>on-failure:5</code> thêm trần năm lần thử; <code>unless-stopped</code> và <code>always</code> không nhận con số.</td></tr>
<tr><td><code>sh -c 'sleep 2; exit 1'</code></td><td>Chạy hai lệnh trong một shell: chờ hai giây, rồi thoát với mã 1 (thất bại).</td></tr>
<tr><td><code>--filter event=start</code></td><td>Chỉ hiện sự kiện loại đó. Nhiều <code>--filter</code> cùng khoá thì được HOẶC với nhau.</td></tr>
<tr><td><code>{{.TimeNano}}</code>, <code>{{.Action}}</code></td><td>Trường Go-template của mỗi sự kiện: thời điểm tính bằng nano giây từ năm 1970, và chuyện gì xảy ra.</td></tr>
<tr><td><code>{{index .Actor.Attributes "exitCode"}}</code></td><td>Mã thoát đi kèm sự kiện <code>die</code> dưới dạng thuộc tính; <code>index</code> đọc một khoá trong bảng đó.</td></tr>
</table>
<div class="callout"><strong>Trên Mac demo này chạy y hệt</strong>, chỉ khác một chỗ: shell của macOS không có lệnh <code>timeout</code>, nên hãy dừng cửa sổ <code>docker events</code> bằng <code>Ctrl+C</code>. Độ trễ do daemon bên trong máy ảo Docker Desktop quyết định và cũng nhân đôi như thế.</div>

<h3>Đổi chính sách mà không phải tạo lại container</h3>
${slide('dk-11', 5, 'docker update sửa chính sách tại chỗ; on-failure:3 bỏ cuộc sau 3 lần')}
<p>Hai sự thật nhỏ cứu bạn rất nhiều trên một máy chủ đang chạy. Thứ nhất, không cần xoá container để sửa một cái <code>--restart</code> bị quên: <code>docker update</code> đổi chính sách của container đang chạy ngay tại chỗ, giữ nguyên tầng ghi và log. Thứ hai, một <code>on-failure</code> có trần thì bỏ cuộc thật — và khi đó container chỉ nằm im ở <code>Exited</code>, không có gì khác báo cho bạn.</p>
<pre><code class="language-bash">docker run -d --name cap --restart on-failure:3 alpine sh -c 'exit 3'
sleep 5
docker inspect -f '{{.RestartCount}} restarts · {{.State.Status}} · exit {{.State.ExitCode}}' cap
docker ps -a --filter name=cap --format '{{.Status}}'

docker run -d --name web nginx:1.27-alpine
docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' web
docker update --restart unless-stopped web
docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' web</code></pre>
<div class="out">3 restarts · exited · exit 3
Exited (3) 4 seconds ago
no
web
unless-stopped</div>
<p>Output thật trên Mac (Docker Desktop, Engine 29.8). Trong Compose thì không dùng <code>docker update</code>: ghi <code>restart: unless-stopped</code> vào file rồi chạy <code>docker compose up -d</code>, lệnh này chỉ tạo lại những dịch vụ có cấu hình thay đổi.</p>

<h3>Khởi động lại máy không phải lúc nào cũng mang stack trở lại</h3>
${slide('dk-11', 6, 'Reboot: dockerd dựng lại container theo chính sách — không theo depends_on')}
<pre><code>systemctl is-enabled docker
docker info --format '{{ .LiveRestoreEnabled }}'
sudo reboot
<span class="tok-comment"># …sau khi nó lên lại</span>
docker compose ps --format 'table {{.Service}}\\t{{.Status}}'</code></pre>
<div class="out">enabled
false
SERVICE   STATUS
api       Up 41 seconds (healthy)
db        Up 53 seconds (healthy)
nginx     Up 39 seconds (healthy)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Daemon phải được bật</span><span class="v"><code>systemctl enable docker</code>. Phần lớn bản phân phối làm sẵn lúc cài, nhưng một daemon cài tay hay một ảnh tối giản thì có thể không — và không có gì báo cho bạn tới tận lúc khởi động lại máy.</span></div>
  <div class="kv"><span class="k">Chỉ <code>always</code> và <code>unless-stopped</code> sống sót</span><span class="v">Container <code>on-failure</code> <em>KHÔNG</em> được khởi động lại lúc daemon lên, trừ khi chúng đang chạy rồi hỏng. Một worker đặt <code>on-failure</code> sẽ lặng lẽ không quay lại sau một lần khởi động máy.</span></div>
  <div class="kv"><span class="k">Volume và mạng được dựng lại</span><span class="v">Volume có tên sống sót qua khởi động lại máy (Bài 7.1); Docker dựng lại các mạng bridge. Không phải làm gì ở đây — phần này đáng tin.</span></div>
  <div class="kv"><span class="k">Thứ tự KHÔNG được bảo đảm</span><span class="v">Khi máy khởi động lại, Docker khởi động lại các container mà không tôn trọng <code>depends_on</code>. API của bạn có thể lên trước khi Postgres sẵn sàng — và đó đúng là lý do ứng dụng phải tự thử lại (Bài 9.3).</span></div>
  <div class="kv"><span class="k">Hãy thử một lần, có chủ đích</span><span class="v">Khởi động lại máy chủ vào một buổi chiều vắng rồi xem cái gì quay lại. Biết được điều đó giữa một lần khởi động lại ngoài kế hoạch là phiên bản đắt tiền của cùng thí nghiệm.</span></div>
</div>
<div class="callout warn"><strong><code>depends_on</code> KHÔNG có tác dụng gì khi máy khởi động lại.</strong> Nó sắp thứ tự cho <code>docker compose up</code>, và chỉ thế thôi — daemon khởi động lại container lúc boot hoàn toàn không biết tới nó. API của bạn đôi lúc sẽ lên trước khi cơ sở dữ liệu nhận kết nối, và nếu nó thoát vì chuyện đó thì <code>unless-stopped</code> sẽ khởi động lại cho tới khi thành công. Cách đó chạy được, và nó nghĩa là một lần khởi động lại máy đẻ ra sáu mươi giây ồn ào restart trong log. Một vòng thử lại trong ứng dụng (Bài 9.3) biến chuyện đó thành một lần khởi động sạch.</div>
<p><strong>Chuyện gì xảy ra lúc máy khởi động, theo thứ tự</strong> — vẽ theo tài liệu, không phải bằng cách reboot máy của khoá (khởi động lại một daemon đang chạy việc của người khác không phải thí nghiệm đáng làm):</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · systemd bật docker.service</span><span class="lz-t">chỉ khi nó đã được enable</span><span class="lz-d"><code>systemctl is-enabled docker</code> phải in <code>enabled</code>. Máy Linux của khoá in đúng như vậy; máy chủ tự dựng thì hãy kiểm một lần.</span></div>
  <div class="lz-step"><span class="lz-k">2 · dockerd đọc chính sách từng container</span><span class="lz-t">always và unless-stopped quay lại</span><span class="lz-d"><code>unless-stopped</code> bỏ qua những container chính bạn đã dừng; <code>always</code> bật cả chúng. <code>no</code> và <code>on-failure</code> nằm im.</span></div>
  <div class="lz-step"><span class="lz-k">3 · không theo thứ tự nào</span><span class="lz-t">API có thể lên trước khi Postgres nghe cổng</span><span class="lz-d">Daemon không biết gì về <code>depends_on</code> hay healthcheck của Compose; thứ tự đó chỉ tồn tại trong lúc <code>docker compose up</code> đang chạy.</span></div>
  <div class="lz-step"><span class="lz-k">4 · ứng dụng tự thử lại, hoặc một unit chạy compose</span><span class="lz-t">hai cách để có một lần khởi động sạch</span><span class="lz-d">Một vòng thử lại trong ứng dụng (Bài 9.3), hoặc unit systemd ở mục kế tiếp, chạy <code>compose up</code> nên <code>depends_on</code> lại có tác dụng.</span></div>
</div>
<div class="callout"><strong>Khởi động lại daemon là một lần reboot thu nhỏ.</strong> Nâng cấp Docker hay chạy <code>systemctl restart docker</code> sẽ dừng MỌI container, rồi mang về những cái có chính sách restart — trừ khi bật <code>live-restore</code>, khi đó container vẫn chạy tiếp trong lúc daemon vắng mặt (Bài 1.5). Kiểm máy bạn bằng <code>docker info -f '{{.LiveRestoreEnabled}}'</code>; cả máy Linux của khoá lẫn Docker Desktop đều in <code>false</code>.</div>

<h3>Biến chính compose thành một unit của systemd</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/blog.service</span>
[Unit]
Description=blog stack
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/deployer/repo
EnvironmentFile=/opt/cuonghoangdev/.env
ExecStart=/usr/bin/docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
ExecStop=/usr/bin/docker compose -f compose.yaml -f compose.prod.yaml stop
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target</code></pre>
<pre><code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl enable --now blog.service
systemctl status blog --no-pager | head -4</code></pre>
<div class="out">● blog.service - blog stack
     Loaded: loaded (/etc/systemd/system/blog.service; enabled; preset: enabled)
     Active: active (exited) since Fri 2026-08-22 13:02:11 +07; 8s ago
    Process: 5121 ExecStart=/usr/bin/docker compose ... up -d --no-build (code=exited, status=0)</div>
<p>Chính sách restart mang từng container trở lại; một unit như thế này mang cả <em>STACK</em> trở lại — có tôn trọng <code>depends_on</code>, có nạp file env của production, và đúng tổ hợp file. Nó đáng bỏ ra mười lăm dòng trên bất cứ máy chủ nào bạn quan tâm, và nó cũng cho bạn <code>systemctl restart blog</code> làm một câu lệnh duy nhất, dễ nhớ, và không thể vô tình kèm theo <code>-v</code>.</p>
<table>
<tr><th>Dòng trong unit</th><th>Vì sao có nó</th></tr>
<tr><td><code>Requires=docker.service</code> + <code>After=docker.service</code></td><td>Chỉ chạy khi daemon đã lên; Docker dừng thì unit này cũng dừng.</td></tr>
<tr><td><code>network-online.target</code></td><td>Chờ tới khi mạng được cấu hình xong thật, để kéo ảnh và DNS chạy được.</td></tr>
<tr><td><code>Type=oneshot</code> + <code>RemainAfterExit=yes</code></td><td><code>up -d</code> trả về ngay; hai dòng này bảo systemd "việc xong rồi, nhưng coi dịch vụ là đang hoạt động".</td></tr>
<tr><td><code>WorkingDirectory</code></td><td>Nơi đặt file compose — đường dẫn tương đối trong đó tính từ đây.</td></tr>
<tr><td><code>EnvironmentFile</code></td><td>Nạp các bí mật production mà <code>&#36;{VAR}</code> trong file compose cần.</td></tr>
<tr><td><code>--no-build</code></td><td>Không bao giờ dựng ảnh lúc khởi động; dùng ảnh đã kéo sẵn (Bài 11.4).</td></tr>
<tr><td><code>ExecStop=… stop</code></td><td><code>stop</code> chứ không phải <code>down</code>: container và tầng ghi của chúng sống qua lần tắt máy.</td></tr>
<tr><td><code>TimeoutStartSec=0</code></td><td>Không giới hạn thời gian khởi động — kéo ảnh chậm lúc boot không được làm systemd bỏ cuộc.</td></tr>
</table>

<h3>Đọc một vòng lặp sập</h3>
${slide('dk-11', 7, 'Ba con số đọc một vòng lặp sập trước khi đọc log')}
<pre><code>docker ps -a --format 'table {{.Names}}\\t{{.Status}}' | head -4
docker inspect -f '{{ .RestartCount }} {{ .State.ExitCode }} {{ .State.OOMKilled }}' blog-api-1
docker compose logs --tail 5 api</code></pre>
<div class="out">NAMES        STATUS
blog-api-1   Restarting (1) 3 seconds ago
blog-db-1    Up 4 minutes (healthy)
12 1 false
blog-api-1  | Error: P1001: Can't reach database server at &#96;db&#96;:&#96;5432&#96;
blog-api-1  | node:internal/process/promises:391
blog-api-1  |    triggerUncaughtException(err)</div>
<div class="callout ok"><strong>Ba con số nói cho bạn gần hết những gì cần biết.</strong> <code>RestartCount</code> tăng nghĩa là một vòng lặp, không phải chuyện xảy ra một lần. <code>ExitCode</code> gọi tên nguyên nhân: 1 là lỗi ứng dụng, 137 là bị giết (thường do OOM — Bài 11.2), 143 là một cú SIGTERM sạch. Và <code>OOMKilled</code> phân biệt một cú giết vì bộ nhớ với mọi cú 137 khác. Rồi hãy đọc log của lần thử <em>CUỐI</em>, vì log của một container đang restart tích lại qua mọi lần thử và chỉ lần mới nhất mới là hiện tại.</div>
<p>Vẫn ba con số đó, đọc trên container flaky của mục "Chạy thử từng bước" ở máy Linux của khoá, sau 77 giây: <code>docker ps -a</code> in <code>flaky Restarting (1) 3 seconds ago</code> và <code>docker inspect</code> in <code>10 1 false</code> — mười lần thử, mã thoát 1, không phải bị giết vì bộ nhớ. Chỉ chừng đó đã nói "chính chương trình cứ hỏng lúc khởi động", và <code>docker logs --tail 20</code> sẽ nói vì sao.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của nhóm SWP391 tự khởi động lại trong đêm sau một bản vá nhân. Sáng ra trang web vẫn chạy nhưng không ai nhận được email thông báo: con worker gửi email được chạy bằng <code>--restart on-failure</code> và đã không quay lại. Dựng lại tình huống trong <code>~/thu-docker</code> và sửa cho đúng.</p><ol>
<li>Chạy một "worker" sập mỗi hai giây: <code>docker run -d --name thu-worker --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'</code>. Ở cửa sổ thứ hai, xem nó bằng lệnh <code>docker events</code> ở mục "Chạy thử từng bước" khoảng 30 giây và ghi lại các khoảng chờ giữa <code>die</code> và <code>start</code>.</li>
<li>Đọc ba con số: <code>docker inspect -f '{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}' thu-worker</code>. Chỉ dựa vào chúng, kết luận đây là bị giết vì bộ nhớ hay lỗi ứng dụng.</li>
<li>Đổi chính sách tại chỗ: <code>docker update --restart unless-stopped thu-worker</code>, rồi xác nhận bằng <code>docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' thu-worker</code>.</li>
<li>Chứng minh <code>unless-stopped</code> tôn trọng bạn: <code>docker stop thu-worker</code>, chờ 20 giây, rồi kiểm <code>docker ps -a --filter name=thu-worker</code> — nó phải vẫn là <code>Exited</code>.</li>
<li>Dọn dẹp: <code>docker rm -f thu-worker</code>.</li></ol>
<p><strong>Đạt khi:</strong> danh sách khoảng chờ của bạn gần như gấp đôi mỗi lần (khoảng 0,1 → 0,2 → 0,4 → 0,9 giây…), ba con số cho mã thoát 1 kèm <code>OOMKilled=false</code>, chính sách đọc ra <code>unless-stopped</code>, và sau <code>docker stop</code> container nằm yên ở <code>Exited</code> chứ không tự dậy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Restart policy (chính sách khởi động lại)</span><span class="v">Luật daemon làm theo khi một container dừng: <code>no</code>, <code>on-failure[:N]</code>, <code>always</code>, <code>unless-stopped</code>.</span></div>
  <div class="kv"><span class="k">Backoff (lùi dần)</span><span class="v">Khoảng chờ tăng dần giữa các lần thử lại: khoảng 0,1 giây, nhân đôi mỗi lần, trần một phút.</span></div>
  <div class="kv"><span class="k">Crash loop (vòng lặp sập)</span><span class="v">Container cứ khởi động, chết rồi được bật lại mãi; <code>docker ps</code> hiện <code>Restarting (mã)</code>.</span></div>
  <div class="kv"><span class="k">RestartCount (số lần khởi động lại)</span><span class="v">Bộ đếm của chính Docker cho số lần tự khởi động lại một container, đọc bằng <code>docker inspect</code>.</span></div>
  <div class="kv"><span class="k">systemd unit (đơn vị systemd)</span><span class="v">Một file trong <code>/etc/systemd/system/</code> bảo hệ thống khởi động của Linux bật gì lúc boot và theo thứ tự nào.</span></div>
  <div class="kv"><span class="k">docker update (cập nhật container)</span><span class="v">Đổi một số thiết lập của container đang có — chính sách restart, trần RAM và CPU — mà không phải tạo lại.</span></div>
  <div class="kv"><span class="k">live-restore (giữ container khi daemon khởi động lại)</span><span class="v">Tuỳ chọn của daemon giữ container chạy tiếp trong lúc chính <code>dockerd</code> khởi động lại. Mặc định tắt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt <code>restart: unless-stopped</code> cho mọi dịch vụ chạy dài và ghi tường minh <code>restart: "no"</code> cho những việc vốn phải thoát.</li>
<li>Docker chờ khoảng 0,1 giây trước lần restart đầu rồi nhân đôi mỗi lần (đo được: 7 lần trong 25 giây), nên vòng lặp sập âm thầm chứ không ồn ào.</li>
<li><code>on-failure:N</code> bỏ cuộc sau N lần rồi nằm ở <code>Exited</code>; nó cũng không quay lại khi daemon khởi động lại.</li>
<li>Sau reboot, daemon bật lại container không theo thứ tự nào và bỏ qua <code>depends_on</code>; ứng dụng phải tự thử lại, hoặc một unit systemd chạy <code>compose up</code>.</li>
<li><code>docker update --restart</code> sửa một chính sách bị quên trên container đang chạy mà không mất gì.</li>
<li><code>RestartCount</code>, <code>ExitCode</code> và <code>OOMKilled</code> phân loại một vòng lặp sập trước khi bạn đọc dòng log nào.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/containers/start-containers-automatically/" target="_blank" rel="noopener">
  <span class="lc-ico">🔁</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Tự khởi động container</span><span class="lc-sub">Bốn chính sách, hành vi tăng độ trễ chính xác, chúng tương tác thế nào với việc daemon khởi động, và các phương án dùng trình quản tiến trình khi một chính sách là chưa đủ.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/daemon/live-restore/" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Live restore</span><span class="lc-sub">Giữ container chạy trong lúc chính daemon Docker khởi động lại — hữu ích khi nâng cấp daemon, kèm những lưu ý về phần nó KHÔNG lo được.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: sống sót qua một lần khởi động lại</span><span class="lc-sub">Bài chấm điểm: chọn chính sách restart cho sáu dịch vụ, đoán trước container nào quay lại sau một lần khởi động máy, và đọc ba vòng lặp sập chỉ bằng <code>RestartCount</code>, <code>ExitCode</code> và <code>OOMKilled</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> để trống <code>restart</code> trên các dịch vụ production. Mặc định là <code>no</code>, nên một container sập một lần lúc bốn giờ sáng — một promise bị từ chối không ai bắt, một lần mạng phân mảnh chớp nhoáng, một lỗi cơ sở dữ liệu thoáng qua — sẽ nằm chết cho tới khi có người để ý. Trên máy chủ mọi thứ trông vẫn ổn: các container khác đang chạy, đĩa chưa đầy, <code>dmesg</code> không có gì. Triệu chứng duy nhất là trang của bạn chết và không có gì thử sửa nó. Hãy đặt <code>restart: unless-stopped</code> lên mọi dịch vụ chạy dài, và đặt tường minh <code>restart: "no"</code> cho những việc lẽ ra phải thoát, để người đọc phân biệt được đâu là lựa chọn có chủ đích và đâu là chỗ bị quên.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>unless-stopped</code> là mặc định của production: nó sống sót qua sập và qua khởi động lại máy nhưng tôn trọng một lệnh dừng có chủ đích. Khởi động lại máy thì container được dựng lại mà KHÔNG tôn trọng <code>depends_on</code>, nên ứng dụng phải tự thử lại các phụ thuộc — và một unit systemd chạy <code>compose up</code> sẽ mang cả stack về đúng thứ tự. Và <code>RestartCount</code>, <code>ExitCode</code> với <code>OOMKilled</code> từ <code>docker inspect</code> nhận diện được phần lớn vòng lặp sập trước khi bạn đọc một dòng log nào.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Limits, and exit 137|||11.2 — Hạn mức, và mã thoát 137',
      slug: 'dk-11-2-han-muc-137',
      type: 'LESSON',
      description: 'Vì sao một container không hạn mức làm chết cả máy chủ, đặt bộ nhớ và CPU trong compose, phân biệt OOM của container với OOM của nhân, đọc docker stats, và điều chỉnh heap của Node cho khớp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Limits, and exit 137</h2>
<p class="lead">Without limits, a container may use every byte and every core on the machine. That is convenient right up to the moment one leaking process takes the whole server down — the database included — instead of just itself. Limits turn a total outage into one restarted container, which is the entire trade.</p>

<h3>The failure they prevent</h3>
${slide('dk-11', 8, 'Không hạn mức: một chỗ rò kéo chết luôn Postgres')}
<pre><code><span class="tok-comment"># No limit: this container will happily consume the host</span>
docker run --rm alpine:3.20 sh -c 'x=""; while :; do x="$x$(head -c 1M /dev/zero | tr "\\0" "a")"; done' &amp;
free -m | head -2</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:            5943        5601          88           2         254          61</div>
<pre><code><span class="tok-comment"># With a limit: the container dies, the host does not</span>
docker run --rm -m 128m --name greedy alpine:3.20 \\
  sh -c 'x=""; while :; do x="$x$(head -c 1M /dev/zero | tr "\\0" "a")"; done'; echo "exit=$?"</code></pre>
<div class="out">exit=137</div>
<div class="callout warn"><strong>Exit 137 is 128 + 9: the process was killed by SIGKILL.</strong> On a container with a memory limit that almost always means the cgroup OOM killer, but not always — a <code>docker kill</code> produces the same code. <code>docker inspect -f '{{ .State.OOMKilled }}'</code> is the field that tells you which, and it is worth checking before you go looking for a memory leak that is not there.</div>

<h3>Run it step by step: an OOM kill and its three pieces of evidence</h3>
${slide('dk-11', 9, 'Exit 137, sự kiện oom và dòng dmesg — ba bằng chứng của một cú OOM')}
<p>The loop above works, but it takes a while and on a host with swap it may not die at all (Lesson 1.1: the real ceiling is RAM + swap). This version is instant and certain: <code>dd</code> asks for one 200 MB buffer inside a 128 MB container that is not allowed any swap.</p>
<pre><code class="language-bash">docker run --name oom --memory 128m --memory-swap 128m \\
  alpine dd if=/dev/zero of=/dev/null bs=200M count=1 ; echo "exit: $?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}}' oom
docker run --rm --pid=host --privileged alpine dmesg | grep -i "killed process"
docker rm oom</code></pre>
<div class="out">exit: 137
OOMKilled=true
Memory cgroup out of memory: Killed process 511503 (dd) total-vm:206436kB, anon-rss:130476kB, file-rss:900kB, shmem-rss:0kB, UID:0 pgtables:292kB oom_score_adj:0</div>
<p>Real output from the course's Linux machine (Docker Engine 29.6). While it ran, a second terminal with <code>docker events --filter container=oom</code> printed <code>create</code>, <code>attach</code>, <code>start</code>, <code>oom</code>, <code>die 137</code> — the daemon records the OOM as its own event, which is what a monitoring script can listen for (Lesson 11.5). Three pieces of evidence, three places:</p>
<table>
<tr><th>Evidence</th><th>Where</th><th>What it proves</th></tr>
<tr><td>exit code 137</td><td><code>$?</code>, <code>docker ps -a</code></td><td>The process died of SIGKILL (128 + 9) — but so does a <code>docker kill</code> or a stop that timed out.</td></tr>
<tr><td><code>OOMKilled=true</code></td><td><code>docker inspect</code></td><td>It was the memory limit, not a person.</td></tr>
<tr><td><code>Memory cgroup out of memory</code></td><td>kernel log (<code>dmesg</code>)</td><td>The kernel killed it for exceeding <em>its own</em> cgroup. <code>anon-rss:130476kB</code> ≈ 127 MB: it was stopped right at the 128 MB line.</td></tr>
</table>
<table>
<tr><th>Flag</th><th>Meaning</th></tr>
<tr><td><code>--memory 128m</code> (<code>-m</code>)</td><td>Hard RAM ceiling for the container's cgroup.</td></tr>
<tr><td><code>--memory-swap 128m</code></td><td>Ceiling for RAM <em>plus</em> swap. Equal to <code>--memory</code> means zero swap. Left out, Docker allows as much swap again as RAM.</td></tr>
<tr><td><code>dd if=/dev/zero of=/dev/null bs=200M count=1</code></td><td>Copy one block of 200 MB from a source of zeros to nowhere — which forces <code>dd</code> to allocate a 200 MB buffer.</td></tr>
<tr><td><code>--pid=host --privileged</code></td><td>Only for reading the kernel log without sudo: the helper shares the host's view and may call <code>dmesg</code>. Never use these on a real service.</td></tr>
</table>
<div class="callout"><strong>On a Mac</strong> the first two commands give exactly the same <code>exit: 137</code> and <code>OOMKilled=true</code>. The <code>dmesg</code> line comes from Docker Desktop's VM kernel, not from macOS.</div>

<h3>Setting limits in compose</h3>
${slide('dk-11', 10, 'deploy.resources trong compose = mấy con số ghi vào cgroup')}
<pre><code>services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.5"
        reservations:
          memory: 256M
    memswap_limit: 512M          <span class="tok-comment"># = memory ⇒ no swap (mem_swappiness is ignored on cgroup v2)</span>
    environment:
      NODE_OPTIONS: "--max-old-space-size=384"   <span class="tok-comment"># heap BELOW the container limit</span>

  db:
    deploy:
      resources:
        limits: { memory: 1G, cpus: "1.0" }
    shm_size: 256mb              <span class="tok-comment"># Postgres parallel workers need it</span></code></pre>
<pre><code>docker compose up -d api &amp;&amp; docker inspect -f \\
  'mem={{ .HostConfig.Memory }} cpus={{ .HostConfig.NanoCpus }}' blog-api-1</code></pre>
<div class="out">mem=536870912 cpus=1500000000</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>limits.memory</code></span><span class="v">A hard ceiling. Exceed it and the process is killed, not slowed. This is the one that matters — set it on every service.</span></div>
  <div class="kv"><span class="k"><code>limits.cpus</code></span><span class="v">A quota, not a ceiling on cores: <code>"1.5"</code> means 150% of one core's time. CPU pressure throttles a container; it never kills it.</span></div>
  <div class="kv"><span class="k"><code>reservations</code></span><span class="v">A soft floor used for scheduling. On a single host it mostly documents intent — useful documentation, no enforcement.</span></div>
  <div class="kv"><span class="k"><code>memswap_limit</code> equal to <code>memory</code></span><span class="v">Without it, a leaking container can push the host into swap and make <em>everything</em> slow instead of dying quickly. A fast, obvious failure beats a slow, mysterious one. <strong>Corrected 09/2026:</strong> an earlier version of this lesson used <code>mem_swappiness: 0</code> for this. On cgroup v2 — every current Ubuntu, Fedora and Docker Desktop — Docker prints "Memory swappiness discarded" and ignores it; setting <code>memswap_limit</code> to the same value as the memory limit is what actually forbids swap.</span></div>
  <div class="kv"><span class="k">Runtime heap below the container limit</span><span class="v">Node 18 and older size their default heap from the <em>host's</em> memory, not the cgroup's: without <code>--max-old-space-size</code> they plan for about 2GB inside a 512MB container and are killed before their own GC gets serious. <strong>Corrected 09/2026:</strong> Node 20 and 22 read the cgroup limit and take roughly half of it (measured below). Set the flag anyway — to about three quarters of the limit — so the number is a decision, not a version accident.</span></div>
</div>

<h3>CPU runs out slowly, memory runs out suddenly</h3>
${slide('dk-11', 11, 'Hết CPU thì CHẬM, hết RAM thì CHẾT')}
<p>The two limits look alike in YAML and behave completely differently. Memory is a wall: one byte over and the kernel kills the process. CPU is a tap: the container gets a fixed share of time per 100 ms and simply runs slower when it wants more. You can see the tap closing with an infinite loop that would happily use a whole core:</p>
<pre><code class="language-yaml">services:
  burn:
    image: alpine
    command: ["sh", "-c", "while :; do :; done"]   <span class="tok-comment"># a busy loop</span>
    deploy:
      resources:
        limits: { memory: 64M, cpus: "0.5" }</code></pre>
<pre><code class="language-bash">docker compose up -d
docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}'</code></pre>
<div class="out">NAME              CPU %     MEM USAGE / LIMIT
dk11-lim-burn-1   49.77%    660KiB / 64MiB</div>
<p>Real output from a Mac. The loop wants 100% of a core and gets 49.77% — the <code>"0.5"</code> quota — and nothing else happens: no kill, no restart, just slowness. That is why a CPU limit is safe to set generously and a memory limit must be measured. And yes, <code>deploy.resources</code> works with plain <code>docker compose</code>, no Swarm needed: the <code>LIMIT</code> column of <code>docker stats</code> is the proof.</p>
<table>
<tr><th>In compose</th><th>Same as <code>docker run</code></th><th>cgroup v2 file</th><th>On overflow</th></tr>
<tr><td><code>limits.memory: 512M</code></td><td><code>--memory 512m</code></td><td><code>memory.max</code></td><td>SIGKILL, exit 137</td></tr>
<tr><td><code>memswap_limit: 512M</code></td><td><code>--memory-swap 512m</code></td><td><code>memory.swap.max</code> (= swap − memory)</td><td>no swap to fall into</td></tr>
<tr><td><code>limits.cpus: "1.5"</code></td><td><code>--cpus 1.5</code></td><td><code>cpu.max</code> = <code>150000 100000</code></td><td>throttled, never killed</td></tr>
<tr><td><code>reservations.memory: 256M</code></td><td><code>--memory-reservation 256m</code></td><td><code>memory.low</code></td><td>nothing on its own — a soft hint</td></tr>
<tr><td><code>pids_limit: 200</code></td><td><code>--pids-limit 200</code></td><td><code>pids.max</code></td><td><code>fork</code> fails — stops a fork bomb</td></tr>
</table>

<h3>Swap: the ceiling you did not set</h3>
${slide('dk-11', 12, 'Chỉ đặt memory thì swap được gấp đôi; mem_swappiness bị bỏ qua trên cgroup v2')}
<p>Set only a memory limit and Docker quietly allows the same amount again in swap. Here is the <code>burn</code> service above, which set <code>memory: 64M</code> and nothing else, and then the old <code>mem_swappiness</code> trick:</p>
<pre><code class="language-bash">docker inspect -f 'mem={{.HostConfig.Memory}} swap={{.HostConfig.MemorySwap}}' dk11-lim-burn-1
docker run --rm --memory 128m --memory-swappiness 0 alpine echo ok</code></pre>
<div class="out">mem=67108864 swap=134217728
WARNING: Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded.
ok</div>
<p>Real output, identical on the Mac and on the course's Linux machine (both cgroup v2). <code>MemorySwap</code> is RAM + swap, so 134217728 bytes = 64 MiB of RAM + 64 MiB of swap. On a host that has swap, a leaking service does not die at its limit: it pages out and gets slower and slower, which is much harder to notice than an exit 137. And <code>--memory-swappiness</code> (compose: <code>mem_swappiness</code>) is simply thrown away on cgroup v2, with only a warning that nobody reads in a compose deploy. The reliable way to say "no swap" is to set <code>memswap_limit</code> equal to the memory limit — which is what the <code>api</code> service above does: <code>swap=536870912</code>, the same as its memory.</p>
<div class="callout warn"><strong>Many VPSes have no swap at all</strong> (<code>free -m</code> shows <code>Swap: 0</code>), and then none of this matters. Check before you reason about it: the same compose file behaves differently on a laptop with swap and on a server without.</div>

<h3>Two different OOM kills</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">cgroup OOM · the container's own limit</span><span class="lz-t">exit 137, OOMKilled=true, host unaffected</span><span class="lz-d">The container exceeded <em>its</em> memory limit. Only that container dies; the restart policy brings it back. This is the outcome you designed for.</span></div>
  <div class="lz-step"><span class="lz-k">system OOM · the host ran out</span><span class="lz-t">dmesg shows the kernel choosing a victim</span><span class="lz-d">Some container without a limit exhausted the machine, and the kernel killed whichever process scored highest — frequently Postgres, because it is the largest. Unrelated services die.</span></div>
  <div class="lz-step"><span class="lz-k">Telling them apart</span><span class="lz-t">docker inspect OOMKilled, then dmesg -T</span><span class="lz-d">If <code>OOMKilled</code> is true and the host is fine, it is the first case. If several containers died at once, read <code>dmesg</code> — it names the killed process and its memory usage.</span></div>
  <div class="lz-step"><span class="lz-k">Build-time OOM</span><span class="lz-t">exit 137 during docker build</span><span class="lz-d">A different instance of the same problem. Parallel cold builds of a frontend and backend on a 6GB VPS have killed <code>next build</code> here with exit 137, which is why those builds run sequentially on the server.</span></div>
</div>
<pre><code>docker inspect -f '{{ .State.OOMKilled }} {{ .State.ExitCode }}' blog-api-1
sudo dmesg -T | grep -i -m2 'killed process'</code></pre>
<div class="out">true 137
[Fri Aug 22 03:14:07 2026] Memory cgroup out of memory: Killed process 8123 (node)
  total-vm:1284552kB, anon-rss:521884kB, file-rss:31220kB</div>

<h3>Watching usage, and choosing a number</h3>
<pre><code>docker stats --no-stream --format \\
  'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.MemPerc}}'</code></pre>
<div class="out">NAME           CPU %     MEM USAGE / LIMIT     MEM %
blog-api-1     2.14%     193.4MiB / 512MiB     37.77%
blog-web-1     1.02%     241.8MiB / 512MiB     47.23%
blog-db-1      0.61%     412.1MiB / 1GiB       40.24%
blog-cache-1   0.18%     14.2MiB / 256MiB      5.55%
blog-worker-1  0.44%     88.7MiB / 256MiB      34.65%</div>
<div class="callout ok"><strong>Pick limits from measurement, not from a round number you liked.</strong> Run the service under realistic load, watch <code>MEM USAGE</code> for a day, and set the limit at roughly twice the steady-state peak. Too tight and you get restarts under normal traffic spikes; too loose and the limit never fires, which means it is not protecting anything. And leave headroom on the host: the sum of all limits should be comfortably below total RAM, because limits cap containers, not the kernel, the daemon, or your ssh session.</div>

<h3>The runtime has its own idea of memory</h3>
${slide('dk-11', 13, 'Node 20+ tự đọc trần cgroup — Node 18 thì không')}
<pre><code>docker run --rm -m 512m node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"
docker run --rm -m 512m -e NODE_OPTIONS=--max-old-space-size=384 node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"</code></pre>
<div class="out">heap cap: 259MB
heap cap: 387MB</div>
<p><strong>Corrected 09/2026.</strong> An earlier version of this lesson printed <code>heap cap: 2048MB</code> for the first command and built its explanation on it. That was true of Node 18 and older; the output above is real, from Node 22.23 on a Mac, and it says 259 MB: modern Node reads the cgroup limit and gives the heap about half of it. The measurements:</p>
<table>
<tr><th>Image</th><th>Container limit</th><th><code>heap_size_limit</code></th><th>What it means</th></tr>
<tr><td><code>node:18-alpine</code> (v18.20.8)</td><td>512 MB</td><td>2096 MB</td><td>Plans for four times the limit — GC stays lazy, the kernel kills it first</td></tr>
<tr><td><code>node:20-alpine</code> (v20.20.2)</td><td>512 MB</td><td>259 MB</td><td>Reads the cgroup, takes about half</td></tr>
<tr><td><code>node:22-alpine</code> (v22.23.2)</td><td>512 MB</td><td>259 MB</td><td>Same</td></tr>
<tr><td><code>node:22-alpine</code></td><td>2 GB</td><td>1048 MB</td><td>Still about half</td></tr>
<tr><td><code>node:22-alpine</code> + <code>--max-old-space-size=384</code></td><td>512 MB</td><td>387 MB</td><td>Exactly what you asked for</td></tr>
</table>
<p>So the old failure — a container that OOMs under load while its logs show plenty of free heap — is what you get on Node 18 and older, and the fix is still one environment variable. On Node 20+ the default is safe but conservative: a 512 MB service that could use 380 MB of heap is held to 259 MB and spends more time in garbage collection. Setting <code>NODE_OPTIONS=--max-old-space-size</code> to roughly 75% of the limit gives the heap the room while leaving the rest for buffers, native modules and the runtime itself. One thing did not change: <code>require('os').totalmem()</code> inside the 512 MB container still printed <code>7934</code> — the RAM of Docker Desktop's VM — while <code>process.constrainedMemory()</code> printed <code>512</code>. Any library that sizes a cache from <code>os.totalmem()</code> or <code>/proc/meminfo</code> is still wrong inside a container. The same applies to the JVM (<code>-XX:MaxRAMPercentage</code>) and to any runtime that sizes itself from <code>/proc/meminfo</code>.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your group's image-resize worker has a leak. Last night it ate the VPS's RAM and the kernel killed Postgres instead of the worker. Prove, in <code>~/thu-docker</code>, that a limit makes the worker the only victim — and collect the evidence a teammate would ask for.</p><ol>
<li>Create <code>thu-lim/compose.yaml</code> with two services: <code>db</code> (<code>postgres:16-alpine</code>, <code>POSTGRES_PASSWORD: thu</code>, <code>limits.memory: 256M</code>) and <code>worker</code> (<code>alpine</code>, command <code>["dd","if=/dev/zero","of=/dev/null","bs=200M","count=1"]</code>, <code>limits.memory: 128M</code>, <code>memswap_limit: 128M</code>, <code>restart: "no"</code>). Run <code>docker compose -p thu-lim up -d</code>.</li>
<li>Read the evidence: <code>docker inspect -f '{{.State.ExitCode}} {{.State.OOMKilled}}' thu-lim-worker-1</code> and <code>docker compose -p thu-lim ps</code>. Is <code>db</code> still up?</li>
<li>Compare limits with reality: <code>docker stats --no-stream</code> — note the <code>LIMIT</code> column of <code>db</code>.</li>
<li>Measure Node's heap in a 512 MB container with and without <code>NODE_OPTIONS=--max-old-space-size=384</code> (the two commands in the section above).</li>
<li>Clean up: <code>docker compose -p thu-lim down -v</code>.</li></ol>
<p><strong>Done when:</strong> the worker shows <code>137 true</code>, <code>db</code> is still <code>Up</code> with a <code>256MiB</code> limit in <code>docker stats</code>, and you have two heap numbers (about 259 MB and 387 MB on Node 22) and can say which one you would ship.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Memory limit</span><span class="v">The hard RAM ceiling of a container's cgroup (<code>--memory</code>, <code>limits.memory</code>). Crossing it means SIGKILL.</span></div>
  <div class="kv"><span class="k">OOM killer</span><span class="v">The kernel mechanism that kills a process when memory runs out — inside one cgroup, or on the whole host.</span></div>
  <div class="kv"><span class="k">OOMKilled</span><span class="v">The field in <code>docker inspect</code> that says a container's last death came from the memory limit.</span></div>
  <div class="kv"><span class="k">CPU quota</span><span class="v">A share of CPU time per 100 ms period (<code>--cpus</code>). Exceeding it throttles; it never kills.</span></div>
  <div class="kv"><span class="k">Swap</span><span class="v">Disk space used as overflow RAM. Allowed by default up to the memory limit again; forbid it with <code>memswap_limit</code> = <code>memory</code>.</span></div>
  <div class="kv"><span class="k">Heap</span><span class="v">The part of memory where a JavaScript program keeps its objects; V8 picks its maximum size at start-up.</span></div>
  <div class="kv"><span class="k">dmesg</span><span class="v">The kernel's own log — where every OOM kill is written with the victim's PID and memory use.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Put <code>limits.memory</code> on every long-running service; without it one leak can make the kernel kill the biggest process on the host — usually Postgres.</li>
<li>Exit 137 is SIGKILL; <code>OOMKilled=true</code>, the <code>oom</code> event and a <code>Memory cgroup out of memory</code> line in <code>dmesg</code> prove it was the memory limit.</li>
<li>A CPU limit throttles and never kills (a busy loop capped at <code>"0.5"</code> showed 49.77%); a memory limit kills without warning.</li>
<li>A memory limit alone still allows the same amount of swap; <code>mem_swappiness</code> is ignored on cgroup v2, so set <code>memswap_limit</code> equal to <code>memory</code>.</li>
<li>Node 18 sizes its heap from the host (2096 MB in a 512 MB box); Node 20+ takes about half the cgroup limit — set <code>--max-old-space-size</code> to about 75% yourself.</li>
<li>Choose limits from <code>docker stats</code> under real load — roughly twice the steady peak — and keep the sum of all limits well below the host's RAM.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/containers/resource_constraints/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Resource constraints</span><span class="lc-sub">Memory, CPU and GPU limits with the exact cgroup semantics: hard versus soft limits, swap accounting, <code>--cpus</code> versus <code>--cpu-shares</code>, and the OOM behaviour.</span></span>
</a>
<a class="link-card" href="https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Node — --max-old-space-size</span><span class="lc-sub">How V8 chooses its default heap limit and why that default is wrong inside a memory-limited container. Set it via <code>NODE_OPTIONS</code> so it applies to every entry point.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: limits and OOM</span><span class="lc-sub">Graded exercises: trigger a container OOM deliberately and read the evidence, distinguish a cgroup kill from a host kill, and choose memory limits for five services from a <code>docker stats</code> sample.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> running production without memory limits because "the server has plenty of RAM". It does, until one service leaks — and then the kernel's OOM killer picks a victim by score, which is usually the largest process on the box. That is Postgres. Your database gets killed by a bug in an image-processing worker, the data survives but the restart takes minutes, and the logs of the service that actually leaked show nothing wrong because it was not the one killed. Limits on every service turn that into one container restarting while everything else keeps serving. Add them before you need them; the day you need them, you will be reading <code>dmesg</code> instead of writing YAML.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Set a memory limit on every long-running service, or one leak takes down the whole host — including the database, which the kernel will pick because it is the biggest. Exit 137 means SIGKILL; <code>docker inspect -f '{{ .State.OOMKilled }}'</code> tells you whether it was the memory limit or something else. And tell the runtime about the limit: Node 18 and older size their heap from the host's RAM, Node 20+ take only about half the cgroup limit — set <code>--max-old-space-size</code> yourself, below the container's ceiling, so the number is deliberate.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Hạn mức, và mã thoát 137</h2>
<p class="lead">Không có hạn mức thì một container được phép dùng mọi byte và mọi nhân của cái máy. Điều đó tiện tới đúng khoảnh khắc một tiến trình rò rỉ kéo cả máy chủ xuống — kể cả cơ sở dữ liệu — thay vì chỉ kéo chính nó. Hạn mức biến một cú sập toàn phần thành một container được khởi động lại, và đó là toàn bộ cuộc đánh đổi.</p>

<h3>Cái hỏng mà chúng ngăn được</h3>
${slide('dk-11', 8, 'Không hạn mức: một chỗ rò kéo chết luôn Postgres')}
<pre><code><span class="tok-comment"># Không hạn mức: container này sẽ vui vẻ ăn hết cả máy chủ</span>
docker run --rm alpine:3.20 sh -c 'x=""; while :; do x="$x$(head -c 1M /dev/zero | tr "\\0" "a")"; done' &amp;
free -m | head -2</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:            5943        5601          88           2         254          61</div>
<pre><code><span class="tok-comment"># Có hạn mức: container chết, máy chủ thì không</span>
docker run --rm -m 128m --name greedy alpine:3.20 \\
  sh -c 'x=""; while :; do x="$x$(head -c 1M /dev/zero | tr "\\0" "a")"; done'; echo "exit=$?"</code></pre>
<div class="out">exit=137</div>
<div class="callout warn"><strong>Mã 137 là 128 + 9: tiến trình bị giết bằng SIGKILL.</strong> Trên một container có hạn mức bộ nhớ thì hầu như luôn là do bộ giết OOM của cgroup, nhưng không phải luôn luôn — một lệnh <code>docker kill</code> cũng sinh ra đúng mã đó. <code>docker inspect -f '{{ .State.OOMKilled }}'</code> là trường nói cho bạn biết là cái nào, và đáng kiểm trước khi bạn đi tìm một chỗ rò bộ nhớ vốn không tồn tại.</div>

<h3>Chạy thử từng bước: một cú OOM và ba bằng chứng của nó</h3>
${slide('dk-11', 9, 'Exit 137, sự kiện oom và dòng dmesg — ba bằng chứng của một cú OOM')}
<p>Vòng lặp ở trên chạy được, nhưng mất một lúc và trên máy có swap thì có khi không chết (Bài 1.1: trần thật là RAM + swap). Bản dưới đây chết ngay và chắc chắn: <code>dd</code> xin một bộ đệm 200 MB bên trong một container 128 MB không được phép dùng swap.</p>
<pre><code class="language-bash">docker run --name oom --memory 128m --memory-swap 128m \\
  alpine dd if=/dev/zero of=/dev/null bs=200M count=1 ; echo "exit: $?"
docker inspect -f 'OOMKilled={{.State.OOMKilled}}' oom
docker run --rm --pid=host --privileged alpine dmesg | grep -i "killed process"
docker rm oom</code></pre>
<div class="out">exit: 137
OOMKilled=true
Memory cgroup out of memory: Killed process 511503 (dd) total-vm:206436kB, anon-rss:130476kB, file-rss:900kB, shmem-rss:0kB, UID:0 pgtables:292kB oom_score_adj:0</div>
<p>Output thật trên máy Linux của khoá (Docker Engine 29.6). Trong lúc nó chạy, một cửa sổ thứ hai với <code>docker events --filter container=oom</code> in ra <code>create</code>, <code>attach</code>, <code>start</code>, <code>oom</code>, <code>die 137</code> — daemon ghi cú OOM thành một sự kiện riêng, và đó là thứ một script giám sát có thể lắng nghe (Bài 11.5). Ba bằng chứng, ba chỗ:</p>
<table>
<tr><th>Bằng chứng</th><th>Ở đâu</th><th>Chứng minh điều gì</th></tr>
<tr><td>mã thoát 137</td><td><code>$?</code>, <code>docker ps -a</code></td><td>Tiến trình chết vì SIGKILL (128 + 9) — nhưng <code>docker kill</code> hay một lần stop quá hạn cũng cho mã này.</td></tr>
<tr><td><code>OOMKilled=true</code></td><td><code>docker inspect</code></td><td>Là do trần bộ nhớ, không phải do người.</td></tr>
<tr><td><code>Memory cgroup out of memory</code></td><td>log của nhân (<code>dmesg</code>)</td><td>Nhân giết nó vì vượt cgroup <em>của chính nó</em>. <code>anon-rss:130476kB</code> ≈ 127 MB: nó bị chặn đúng ở vạch 128 MB.</td></tr>
</table>
<table>
<tr><th>Cờ</th><th>Nghĩa là</th></tr>
<tr><td><code>--memory 128m</code> (<code>-m</code>)</td><td>Trần RAM cứng cho cgroup của container.</td></tr>
<tr><td><code>--memory-swap 128m</code></td><td>Trần của RAM <em>cộng</em> swap. Bằng <code>--memory</code> nghĩa là không có swap. Bỏ trống thì Docker cho thêm lượng swap bằng lượng RAM.</td></tr>
<tr><td><code>dd if=/dev/zero of=/dev/null bs=200M count=1</code></td><td>Chép một khối 200 MB từ nguồn toàn số 0 ra hư không — buộc <code>dd</code> phải cấp một bộ đệm 200 MB.</td></tr>
<tr><td><code>--pid=host --privileged</code></td><td>Chỉ để đọc log của nhân mà không cần sudo: container phụ nhìn như máy chủ và được gọi <code>dmesg</code>. Đừng bao giờ dùng cho dịch vụ thật.</td></tr>
</table>
<div class="callout"><strong>Trên Mac</strong> hai lệnh đầu cho đúng <code>exit: 137</code> và <code>OOMKilled=true</code> như trên. Dòng <code>dmesg</code> là của nhân máy ảo Docker Desktop, không phải của macOS.</div>

<h3>Đặt hạn mức trong compose</h3>
${slide('dk-11', 10, 'deploy.resources trong compose = mấy con số ghi vào cgroup')}
<pre><code>services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.5"
        reservations:
          memory: 256M
    memswap_limit: 512M          <span class="tok-comment"># = memory ⇒ không swap (mem_swappiness bị bỏ qua trên cgroup v2)</span>
    environment:
      NODE_OPTIONS: "--max-old-space-size=384"   <span class="tok-comment"># heap THẤP HƠN hạn mức container</span>

  db:
    deploy:
      resources:
        limits: { memory: 1G, cpus: "1.0" }
    shm_size: 256mb              <span class="tok-comment"># worker song song của Postgres cần nó</span></code></pre>
<pre><code>docker compose up -d api &amp;&amp; docker inspect -f \\
  'mem={{ .HostConfig.Memory }} cpus={{ .HostConfig.NanoCpus }}' blog-api-1</code></pre>
<div class="out">mem=536870912 cpus=1500000000</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>limits.memory</code></span><span class="v">Một cái trần CỨNG. Vượt qua là tiến trình bị giết chứ không phải bị làm chậm. Đây là cái quan trọng — hãy đặt nó cho mọi dịch vụ.</span></div>
  <div class="kv"><span class="k"><code>limits.cpus</code></span><span class="v">Một hạn ngạch, không phải trần số nhân: <code>"1.5"</code> nghĩa là 150% thời gian của một nhân. Áp lực CPU làm container bị bóp lại; nó không bao giờ giết container.</span></div>
  <div class="kv"><span class="k"><code>reservations</code></span><span class="v">Một cái sàn MỀM dùng cho việc xếp lịch. Trên một máy chủ đơn thì nó chủ yếu ghi lại ý định — tài liệu hữu ích, không có sự cưỡng chế nào.</span></div>
  <div class="kv"><span class="k"><code>memswap_limit</code> bằng <code>memory</code></span><span class="v">Không có nó thì một container rò rỉ có thể đẩy máy chủ vào swap và làm <em>MỌI THỨ</em> chậm thay vì chết nhanh. Một cái hỏng nhanh và rõ ràng tốt hơn một cái hỏng chậm và bí ẩn. <strong>Đã sửa 09/2026:</strong> bản trước của bài dùng <code>mem_swappiness: 0</code> cho việc này. Trên cgroup v2 — mọi bản Ubuntu, Fedora và Docker Desktop hiện nay — Docker in "Memory swappiness discarded" rồi bỏ qua nó; đặt <code>memswap_limit</code> bằng đúng trần bộ nhớ mới là thứ thật sự cấm swap.</span></div>
  <div class="kv"><span class="k">Heap của bộ chạy phải thấp hơn hạn mức container</span><span class="v">Node 18 trở về trước tính heap mặc định từ bộ nhớ của <em>MÁY CHỦ</em>, không phải của cgroup: không có <code>--max-old-space-size</code>, chúng lập kế hoạch dùng khoảng 2GB bên trong một container 512MB rồi bị giết trước khi bộ gom rác kịp làm việc nghiêm túc. <strong>Đã sửa 09/2026:</strong> Node 20 và 22 đọc được trần của cgroup và lấy khoảng một nửa (đo ở dưới). Vẫn nên đặt cờ — khoảng ba phần tư trần — để con số là một quyết định của bạn chứ không phải một sự tình cờ theo phiên bản.</span></div>
</div>

<h3>Hết CPU thì chậm dần, hết RAM thì chết ngay</h3>
${slide('dk-11', 11, 'Hết CPU thì CHẬM, hết RAM thì CHẾT')}
<p>Hai hạn mức trông giống nhau trong YAML nhưng hành xử hoàn toàn khác. Bộ nhớ là một bức tường: vượt một byte là nhân giết tiến trình. CPU là một cái vòi: container được một phần thời gian cố định mỗi 100 ms và chỉ đơn giản là chạy chậm lại khi muốn nhiều hơn. Bạn có thể nhìn cái vòi khép lại bằng một vòng lặp vô tận sẵn sàng ăn trọn một nhân:</p>
<pre><code class="language-yaml">services:
  burn:
    image: alpine
    command: ["sh", "-c", "while :; do :; done"]   <span class="tok-comment"># vòng lặp bận</span>
    deploy:
      resources:
        limits: { memory: 64M, cpus: "0.5" }</code></pre>
<pre><code class="language-bash">docker compose up -d
docker stats --no-stream --format 'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}'</code></pre>
<div class="out">NAME              CPU %     MEM USAGE / LIMIT
dk11-lim-burn-1   49.77%    660KiB / 64MiB</div>
<p>Output thật trên Mac. Vòng lặp muốn 100% một nhân và nhận 49,77% — đúng hạn ngạch <code>"0.5"</code> — và không có gì khác xảy ra: không bị giết, không khởi động lại, chỉ chậm. Đó là lý do trần CPU đặt rộng tay cũng an toàn, còn trần bộ nhớ thì phải đo. Và đúng vậy, <code>deploy.resources</code> chạy với <code>docker compose</code> thường, không cần Swarm: cột <code>LIMIT</code> của <code>docker stats</code> là bằng chứng.</p>
<table>
<tr><th>Trong compose</th><th>Tương đương <code>docker run</code></th><th>File cgroup v2</th><th>Khi vượt</th></tr>
<tr><td><code>limits.memory: 512M</code></td><td><code>--memory 512m</code></td><td><code>memory.max</code></td><td>SIGKILL, exit 137</td></tr>
<tr><td><code>memswap_limit: 512M</code></td><td><code>--memory-swap 512m</code></td><td><code>memory.swap.max</code> (= swap − memory)</td><td>không có swap để lún vào</td></tr>
<tr><td><code>limits.cpus: "1.5"</code></td><td><code>--cpus 1.5</code></td><td><code>cpu.max</code> = <code>150000 100000</code></td><td>bị bóp, không bao giờ bị giết</td></tr>
<tr><td><code>reservations.memory: 256M</code></td><td><code>--memory-reservation 256m</code></td><td><code>memory.low</code></td><td>tự nó không làm gì — chỉ là gợi ý mềm</td></tr>
<tr><td><code>pids_limit: 200</code></td><td><code>--pids-limit 200</code></td><td><code>pids.max</code></td><td><code>fork</code> thất bại — chặn được bom fork</td></tr>
</table>

<h3>Swap: cái trần bạn không hề đặt</h3>
${slide('dk-11', 12, 'Chỉ đặt memory thì swap được gấp đôi; mem_swappiness bị bỏ qua trên cgroup v2')}
<p>Chỉ đặt trần bộ nhớ thì Docker lặng lẽ cho thêm đúng lượng đó dưới dạng swap. Đây là dịch vụ <code>burn</code> ở trên, chỉ ghi <code>memory: 64M</code>, và tiếp theo là mẹo <code>mem_swappiness</code> cũ:</p>
<pre><code class="language-bash">docker inspect -f 'mem={{.HostConfig.Memory}} swap={{.HostConfig.MemorySwap}}' dk11-lim-burn-1
docker run --rm --memory 128m --memory-swappiness 0 alpine echo ok</code></pre>
<div class="out">mem=67108864 swap=134217728
WARNING: Your kernel does not support memory swappiness capabilities or the cgroup is not mounted. Memory swappiness discarded.
ok</div>
<p>Output thật, giống hệt nhau trên Mac và trên máy Linux của khoá (cả hai đều cgroup v2). <code>MemorySwap</code> là RAM + swap, nên 134217728 byte = 64 MiB RAM + 64 MiB swap. Trên máy có swap, một dịch vụ rò rỉ không chết ở trần của nó: nó bị đẩy ra swap rồi chậm dần, chậm dần — khó nhận ra hơn nhiều so với một cú exit 137. Còn <code>--memory-swappiness</code> (trong compose là <code>mem_swappiness</code>) thì bị vứt thẳng trên cgroup v2, chỉ kèm một dòng cảnh báo mà chẳng ai đọc trong một lượt deploy bằng compose. Cách chắc chắn để nói "không swap" là đặt <code>memswap_limit</code> bằng trần bộ nhớ — đúng như dịch vụ <code>api</code> ở trên: <code>swap=536870912</code>, bằng đúng bộ nhớ của nó.</p>
<div class="callout warn"><strong>Nhiều VPS không hề có swap</strong> (<code>free -m</code> hiện <code>Swap: 0</code>), và khi đó chuyện này không quan trọng. Hãy kiểm trước khi suy luận: cùng một file compose hành xử khác nhau trên laptop có swap và trên máy chủ không có.</div>

<h3>Hai kiểu giết OOM khác nhau</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">OOM của cgroup · hạn mức của chính container</span><span class="lz-t">exit 137, OOMKilled=true, máy chủ không sao</span><span class="lz-d">Container vượt hạn mức bộ nhớ của <em>chính nó</em>. Chỉ container đó chết; chính sách restart mang nó về. Đây là kết cục bạn đã thiết kế sẵn.</span></div>
  <div class="lz-step"><span class="lz-k">OOM của hệ thống · máy chủ hết bộ nhớ</span><span class="lz-t">dmesg cho thấy nhân đang chọn nạn nhân</span><span class="lz-d">Một container nào đó không có hạn mức đã vét cạn cái máy, và nhân giết bất cứ tiến trình nào có điểm cao nhất — rất hay là Postgres, vì nó lớn nhất. Những dịch vụ không liên quan cũng chết theo.</span></div>
  <div class="lz-step"><span class="lz-k">Phân biệt hai cái</span><span class="lz-t">docker inspect OOMKilled, rồi dmesg -T</span><span class="lz-d">Nếu <code>OOMKilled</code> là true và máy chủ vẫn ổn thì đó là trường hợp thứ nhất. Nếu nhiều container chết cùng lúc thì hãy đọc <code>dmesg</code> — nó gọi tên tiến trình bị giết và mức bộ nhớ nó dùng.</span></div>
  <div class="lz-step"><span class="lz-k">OOM lúc DỰNG</span><span class="lz-t">exit 137 ngay giữa docker build</span><span class="lz-d">Một biến thể của cùng bài toán. Dựng song song frontend với backend khi cache đã bị dọn, trên một con VPS 6GB, đã giết <code>next build</code> ở đây với mã 137, và đó là lý do các lượt dựng trên máy chủ chạy tuần tự.</span></div>
</div>
<pre><code>docker inspect -f '{{ .State.OOMKilled }} {{ .State.ExitCode }}' blog-api-1
sudo dmesg -T | grep -i -m2 'killed process'</code></pre>
<div class="out">true 137
[Fri Aug 22 03:14:07 2026] Memory cgroup out of memory: Killed process 8123 (node)
  total-vm:1284552kB, anon-rss:521884kB, file-rss:31220kB</div>

<h3>Theo dõi mức dùng, và chọn một con số</h3>
<pre><code>docker stats --no-stream --format \\
  'table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.MemPerc}}'</code></pre>
<div class="out">NAME           CPU %     MEM USAGE / LIMIT     MEM %
blog-api-1     2.14%     193.4MiB / 512MiB     37.77%
blog-web-1     1.02%     241.8MiB / 512MiB     47.23%
blog-db-1      0.61%     412.1MiB / 1GiB       40.24%
blog-cache-1   0.18%     14.2MiB / 256MiB      5.55%
blog-worker-1  0.44%     88.7MiB / 256MiB      34.65%</div>
<div class="callout ok"><strong>Hãy chọn hạn mức từ ĐO ĐẠC, đừng chọn một con số tròn mà bạn thấy thuận mắt.</strong> Chạy dịch vụ dưới tải thực tế, theo dõi <code>MEM USAGE</code> trong một ngày, rồi đặt hạn mức khoảng gấp đôi đỉnh ở trạng thái ổn định. Chật quá thì bạn nhận restart ngay ở những đợt tăng tải bình thường; rộng quá thì hạn mức không bao giờ kích hoạt, nghĩa là nó chẳng bảo vệ gì. Và hãy chừa chỗ trên máy chủ: tổng mọi hạn mức phải thấp hơn tổng RAM một cách thoải mái, vì hạn mức chặn container chứ không chặn nhân, không chặn daemon, cũng không chặn phiên ssh của bạn.</div>

<h3>Bộ chạy có cách hiểu riêng về bộ nhớ</h3>
${slide('dk-11', 13, 'Node 20+ tự đọc trần cgroup — Node 18 thì không')}
<pre><code>docker run --rm -m 512m node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"
docker run --rm -m 512m -e NODE_OPTIONS=--max-old-space-size=384 node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"</code></pre>
<div class="out">heap cap: 259MB
heap cap: 387MB</div>
<p><strong>Đã sửa 09/2026.</strong> Bản trước của bài in <code>heap cap: 2048MB</code> cho lệnh thứ nhất và dựng cả lời giải thích trên con số đó. Điều ấy đúng với Node 18 trở về trước; output ở trên là thật, chạy Node 22.23 trên Mac, và nó nói 259 MB: Node đời mới đọc được trần của cgroup và cho heap khoảng một nửa. Số đo:</p>
<table>
<tr><th>Ảnh</th><th>Trần container</th><th><code>heap_size_limit</code></th><th>Nghĩa là</th></tr>
<tr><td><code>node:18-alpine</code> (v18.20.8)</td><td>512 MB</td><td>2096 MB</td><td>Lập kế hoạch gấp bốn lần trần — GC lười, nhân giết trước</td></tr>
<tr><td><code>node:20-alpine</code> (v20.20.2)</td><td>512 MB</td><td>259 MB</td><td>Đọc cgroup, lấy khoảng một nửa</td></tr>
<tr><td><code>node:22-alpine</code> (v22.23.2)</td><td>512 MB</td><td>259 MB</td><td>Như trên</td></tr>
<tr><td><code>node:22-alpine</code></td><td>2 GB</td><td>1048 MB</td><td>Vẫn khoảng một nửa</td></tr>
<tr><td><code>node:22-alpine</code> + <code>--max-old-space-size=384</code></td><td>512 MB</td><td>387 MB</td><td>Đúng con số bạn xin</td></tr>
</table>
<p>Vậy kiểu hỏng cũ — container chết OOM khi có tải trong khi log cho thấy heap còn trống thoải mái — là thứ bạn gặp trên Node 18 trở về trước, và cách chữa vẫn là một biến môi trường. Trên Node 20+ mặc định an toàn nhưng dè dặt: một dịch vụ 512 MB lẽ ra dùng được 380 MB heap bị giữ ở 259 MB và tốn nhiều thời gian gom rác hơn. Đặt <code>NODE_OPTIONS=--max-old-space-size</code> khoảng 75% trần cho heap đủ chỗ mà vẫn chừa phần còn lại cho bộ đệm, module gốc và chính bộ chạy. Có một thứ không đổi: <code>require('os').totalmem()</code> bên trong container 512 MB vẫn in <code>7934</code> — RAM của máy ảo Docker Desktop — trong khi <code>process.constrainedMemory()</code> in <code>512</code>. Thư viện nào tính kích thước bộ nhớ đệm từ <code>os.totalmem()</code> hay <code>/proc/meminfo</code> thì vẫn sai bên trong container. Điều tương tự áp cho JVM (<code>-XX:MaxRAMPercentage</code>) và cho mọi bộ chạy tự tính kích thước từ <code>/proc/meminfo</code>.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> con worker thu nhỏ ảnh của nhóm bị rò bộ nhớ. Đêm qua nó ăn hết RAM của VPS và nhân lại giết Postgres chứ không giết nó. Hãy chứng minh trong <code>~/thu-docker</code> rằng một cái trần khiến worker là nạn nhân duy nhất — và thu đủ bằng chứng mà bạn cùng nhóm sẽ hỏi.</p><ol>
<li>Tạo <code>thu-lim/compose.yaml</code> với hai dịch vụ: <code>db</code> (<code>postgres:16-alpine</code>, <code>POSTGRES_PASSWORD: thu</code>, <code>limits.memory: 256M</code>) và <code>worker</code> (<code>alpine</code>, command <code>["dd","if=/dev/zero","of=/dev/null","bs=200M","count=1"]</code>, <code>limits.memory: 128M</code>, <code>memswap_limit: 128M</code>, <code>restart: "no"</code>). Chạy <code>docker compose -p thu-lim up -d</code>.</li>
<li>Đọc bằng chứng: <code>docker inspect -f '{{.State.ExitCode}} {{.State.OOMKilled}}' thu-lim-worker-1</code> và <code>docker compose -p thu-lim ps</code>. <code>db</code> còn sống không?</li>
<li>So trần với thực tế: <code>docker stats --no-stream</code> — ghi lại cột <code>LIMIT</code> của <code>db</code>.</li>
<li>Đo heap của Node trong container 512 MB, có và không có <code>NODE_OPTIONS=--max-old-space-size=384</code> (hai lệnh ở mục ngay trên).</li>
<li>Dọn dẹp: <code>docker compose -p thu-lim down -v</code>.</li></ol>
<p><strong>Đạt khi:</strong> worker hiện <code>137 true</code>, <code>db</code> vẫn <code>Up</code> với trần <code>256MiB</code> trong <code>docker stats</code>, và bạn có hai con số heap (khoảng 259 MB và 387 MB với Node 22) và nói được mình sẽ đưa cái nào lên production.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Memory limit (trần bộ nhớ)</span><span class="v">Trần RAM cứng của cgroup container (<code>--memory</code>, <code>limits.memory</code>). Vượt qua là SIGKILL.</span></div>
  <div class="kv"><span class="k">OOM killer (kẻ giết khi hết bộ nhớ)</span><span class="v">Cơ chế của nhân giết một tiến trình khi cạn bộ nhớ — trong một cgroup, hoặc trên cả máy.</span></div>
  <div class="kv"><span class="k">OOMKilled (bị giết vì hết bộ nhớ)</span><span class="v">Trường trong <code>docker inspect</code> cho biết lần chết gần nhất của container là do trần bộ nhớ.</span></div>
  <div class="kv"><span class="k">CPU quota (hạn ngạch CPU)</span><span class="v">Phần thời gian CPU trong mỗi chu kỳ 100 ms (<code>--cpus</code>). Vượt thì bị bóp, không bao giờ bị giết.</span></div>
  <div class="kv"><span class="k">Swap (bộ nhớ tráo đổi)</span><span class="v">Chỗ trên đĩa dùng làm RAM tràn. Mặc định được thêm bằng đúng trần bộ nhớ; cấm bằng <code>memswap_limit</code> = <code>memory</code>.</span></div>
  <div class="kv"><span class="k">Heap (vùng nhớ động)</span><span class="v">Phần bộ nhớ nơi chương trình JavaScript giữ các đối tượng; V8 chọn kích thước tối đa lúc khởi động.</span></div>
  <div class="kv"><span class="k">dmesg (log của nhân)</span><span class="v">Nhật ký của chính nhân Linux — nơi mỗi cú OOM được ghi kèm PID và mức bộ nhớ của nạn nhân.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt <code>limits.memory</code> cho mọi dịch vụ chạy dài; không có nó, một chỗ rò có thể khiến nhân giết tiến trình to nhất máy — thường là Postgres.</li>
<li>Exit 137 là SIGKILL; <code>OOMKilled=true</code>, sự kiện <code>oom</code> và dòng <code>Memory cgroup out of memory</code> trong <code>dmesg</code> chứng minh đó là do trần bộ nhớ.</li>
<li>Trần CPU làm chậm chứ không giết (vòng lặp bận bị trần <code>"0.5"</code> hiện 49,77%); trần bộ nhớ giết không báo trước.</li>
<li>Chỉ đặt trần bộ nhớ thì vẫn được thêm bấy nhiêu swap; <code>mem_swappiness</code> bị bỏ qua trên cgroup v2, nên hãy đặt <code>memswap_limit</code> bằng <code>memory</code>.</li>
<li>Node 18 tính heap từ máy chủ (2096 MB trong hộp 512 MB); Node 20+ lấy khoảng nửa trần cgroup — hãy tự đặt <code>--max-old-space-size</code> khoảng 75%.</li>
<li>Chọn trần từ <code>docker stats</code> dưới tải thật — khoảng gấp đôi đỉnh ổn định — và giữ tổng mọi trần thấp hơn hẳn RAM của máy.</li>
</ul>


<a class="link-card" href="https://docs.docker.com/engine/containers/resource_constraints/" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Ràng buộc tài nguyên</span><span class="lc-sub">Hạn mức bộ nhớ, CPU và GPU với ngữ nghĩa cgroup chính xác: hạn mức cứng so với mềm, cách tính swap, <code>--cpus</code> so với <code>--cpu-shares</code>, và hành vi OOM.</span></span>
</a>
<a class="link-card" href="https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-mib" target="_blank" rel="noopener">
  <span class="lc-ico">🟩</span>
  <span class="lc-body"><span class="lc-title">Node — --max-old-space-size</span><span class="lc-sub">V8 chọn hạn mức heap mặc định thế nào và vì sao mặc định đó sai bên trong một container bị giới hạn bộ nhớ. Hãy đặt qua <code>NODE_OPTIONS</code> để nó áp cho mọi điểm vào.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: hạn mức và OOM</span><span class="lc-sub">Bài chấm điểm: cố ý gây một cú OOM cho container rồi đọc bằng chứng, phân biệt một cú giết của cgroup với một cú giết của máy chủ, và chọn hạn mức bộ nhớ cho năm dịch vụ từ một mẫu <code>docker stats</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chạy production mà không đặt hạn mức bộ nhớ vì "máy chủ nhiều RAM lắm". Đúng là nhiều, cho tới khi một dịch vụ rò rỉ — và rồi bộ giết OOM của nhân chọn nạn nhân theo điểm số, mà điểm cao nhất thường là tiến trình lớn nhất trên máy. Đó là Postgres. Cơ sở dữ liệu của bạn bị giết vì một cái lỗi trong con worker xử lý ảnh, dữ liệu thì còn nhưng khởi động lại mất mấy phút, và log của cái dịch vụ thật sự rò rỉ chẳng cho thấy gì bất thường vì nó đâu phải cái bị giết. Đặt hạn mức cho mọi dịch vụ là biến chuyện đó thành một container khởi động lại trong khi mọi thứ khác vẫn phục vụ. Hãy thêm chúng TRƯỚC khi bạn cần; đúng cái ngày bạn cần, bạn sẽ đang ngồi đọc <code>dmesg</code> chứ không phải ngồi viết YAML.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy đặt hạn mức bộ nhớ cho mọi dịch vụ chạy dài, không thì một chỗ rò kéo sập cả máy chủ — kể cả cơ sở dữ liệu, thứ mà nhân sẽ chọn vì nó lớn nhất. Mã 137 nghĩa là SIGKILL; <code>docker inspect -f '{{ .State.OOMKilled }}'</code> nói cho bạn biết đó là do hạn mức bộ nhớ hay do thứ khác. Và hãy nói cho bộ chạy biết về cái hạn mức: Node 18 trở về trước tính heap từ RAM của máy chủ, Node 20+ chỉ lấy khoảng một nửa trần cgroup — hãy tự đặt <code>--max-old-space-size</code> thấp hơn trần của container để con số đó là có chủ đích.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Logs, rotation, and the disk that fills|||11.3 — Log, xoay log, và cái đĩa đầy',
      slug: 'dk-11-3-log',
      type: 'LESSON',
      description: 'Log đi đâu, vì sao json-file mặc định KHÔNG xoay, đặt max-size trên toàn daemon, các driver khác, log có cấu trúc, và dọn một cái đĩa đã đầy vì log.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Logs, rotation, and the disk that fills</h2>
<p class="lead">Docker captures whatever your process writes to stdout and stderr and stores it on the host. That is a good design, and it has one dangerous default: with the standard <code>json-file</code> driver, nothing rotates unless you say so. A chatty service will fill the disk, and on a small VPS the disk it fills is the one holding your database.</p>

<h3>Where the logs actually are</h3>
${slide('dk-11', 14, 'Log đi đâu: stdout → dockerd → một file JSON trên máy chủ')}
<pre><code>docker inspect -f '{{ .LogPath }}' blog-api-1
sudo ls -lh "$(docker inspect -f '{{ .LogPath }}' blog-api-1)"
docker inspect -f '{{ .HostConfig.LogConfig.Type }} {{ .HostConfig.LogConfig.Config }}' blog-api-1</code></pre>
<div class="out">/var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
-rw-r----- 1 root root 4.1G Aug 22 13:31 /var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
json-file map[]</div>
<div class="callout warn"><strong>4.1GB, and <code>map[]</code> means no rotation configured.</strong> That file grows until the disk is full, and it is not counted anywhere obvious — <code>docker system df</code> does not show it, because it is not an image, a container layer or a volume. A server that reports plenty of Docker space can still be out of disk. <code>docker logs</code> reads this file, which is also why <code>docker logs</code> on a busy container can take a very long time.</div>

<h3>Run it step by step: watch a log grow, then cap it</h3>
${slide('dk-11', 15, '300.000 dòng log = 33 MB; có max-size thì dừng ở 2,6 MB')}
<p>Numbers like "4.1G" are easy to shrug off. Make your own: two identical containers print the same 300,000 access-log-style lines; one uses the default, the other caps its log at three files of 1 MB.</p>
<pre><code class="language-bash">docker run -d --name noisy alpine sh -c 'i=0; while [ $i -lt 300000 ]; do echo "GET /api/v1/posts 200 12ms user=42 req=$i"; i=$((i+1)); done; sleep 600'
docker run -d --name quiet --log-opt max-size=1m --log-opt max-file=3 \\
  alpine sh -c 'i=0; while [ $i -lt 300000 ]; do echo "GET /api/v1/posts 200 12ms user=42 req=$i"; i=$((i+1)); done; sleep 600'
sleep 15
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}' noisy quiet
<span class="tok-comment"># the log files live on the Docker host; on a Mac that is Docker Desktop's VM, so look through a helper container</span>
N=$(docker inspect -f '{{.Id}}' noisy) ; Q=$(docker inspect -f '{{.Id}}' quiet)
docker run --rm -v /var/lib/docker/containers:/c:ro alpine sh -c "ls -lh /c/$N /c/$Q | grep json"</code></pre>
<div class="out">json-file map[]
json-file map[max-file:3 max-size:1m]
-rw-r-----    1 root     root       33.0M Sep 23 19:20 4199a2e6…-json.log
-rw-r-----    1 root     root      638.9K Sep 23 19:20 6827e421…-json.log
-rw-r-----    1 root     root      976.6K Sep 23 19:20 6827e421…-json.log.1
-rw-r-----    1 root     root      976.6K Sep 23 19:20 6827e421…-json.log.2</div>
<p>Real output from a Mac (Docker Desktop; long IDs shortened with …). Same program, same 300,000 lines: <strong>33 MB</strong> without a limit, <strong>2.6 MB</strong> in three rotating files with one. The file is bigger than the text printed because every line is wrapped in JSON — this is the first line of <code>noisy</code>'s file:</p>
<div class="out">{"log":"GET /api/v1/posts 200 12ms user=42 req=0\\n","stream":"stdout","time":"2026-09-23T19:20:55.359874875Z"}</div>
<table>
<tr><th>Field</th><th>Meaning</th></tr>
<tr><td><code>log</code></td><td>Exactly what the process wrote, including the newline.</td></tr>
<tr><td><code>stream</code></td><td><code>stdout</code> or <code>stderr</code> — which is how <code>docker logs</code> can split them again.</td></tr>
<tr><td><code>time</code></td><td>When dockerd received the line, in UTC with nanoseconds — the source of <code>docker logs --since</code> and <code>-t</code>.</td></tr>
</table>
<p>With rotation on, <code>docker logs quiet | wc -l</code> counted only <code>22882</code> lines: the oldest lines are gone, which is the price of a capped disk. Keep the window big enough to cover the time between "something broke" and "someone looked" — for a student VPS, <code>10m</code> × <code>3</code> is a common, sane starting point.</p>

<h3>Nothing counts the log files for you</h3>
${slide('dk-11', 16, 'docker ps -s nói 4,1 kB — file log 33 MB: không bảng nào đếm log')}
<pre><code class="language-bash">docker ps -s --filter name=noisy --format '{{.Names}} {{.Size}}'
docker system df</code></pre>
<div class="out">noisy 4.1kB (virtual 9.33MB)
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          72        21        37.63GB   24.88GB (66%)
Containers      38        11        882.6MB   553.8MB (62%)
…</div>
<p>Real output, same Mac, a few seconds later. <code>docker ps -s</code> reports the container's <em>writable layer</em> — 4.1 kB — and the 33 MB log file is not part of it. <code>docker system df</code> counts images, containers' writable layers, volumes and build cache, and the log file is none of those. The only honest instruments are <code>du</code> on <code>/var/lib/docker/containers</code> and, in the end, <code>df -h /var/lib/docker</code>.</p>

<h3>Rotation, two places to set it</h3>
${slide('dk-11', 18, 'Đặt xoay vòng ở hai nơi — daemon.json phải RESTART, không phải reload')}
<pre><code><span class="tok-comment"># Per service, in compose — explicit and reviewable</span>
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        compress: "true"
        labels: "service"</code></pre>
<pre><code><span class="tok-comment"># Or once, for every container the daemon ever starts</span>
sudo tee /etc/docker/daemon.json &lt;&lt;'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3", "compress": "true" }
}
JSON
sudo systemctl restart docker   <span class="tok-comment"># restart, NOT reload: log-opts cannot be reloaded — and this stops containers unless live-restore is on</span>
docker info --format 'driver={{ .LoggingDriver }}'</code></pre>
<div class="out">driver=json-file</div>
<div class="callout ok"><strong>Set it in <code>daemon.json</code> and set it in compose.</strong> The daemon default protects every container anyone starts on that host — including the one-off <code>docker run</code> someone leaves attached for a week. The compose entry documents the intent where a reviewer will see it, and travels with the project to a new server. Note that a daemon-level change applies only to containers created <em>after</em> the daemon restart, so recreate the existing ones. <strong>Corrected 09/2026:</strong> an earlier version said <code>systemctl reload docker</code>. The dockerd reference lists which options a reload (SIGHUP) can change — <code>debug</code>, <code>labels</code>, <code>live-restore</code>, registry mirrors and a few more — and <code>log-driver</code>/<code>log-opts</code> are not among them. The logging docs say the same: restart Docker, and only new containers pick it up.</div>

<h3>The drivers worth knowing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>json-file</code></span><span class="v">The default. Works with <code>docker logs</code>, keeps a file per container, and does not rotate unless configured. Use it, with <code>max-size</code>.</span></div>
  <div class="kv"><span class="k"><code>local</code></span><span class="v">Docker's own format: rotation on by default, more compact, faster. The catch is that only Docker can read it — no tailing the file directly with standard tools.</span></div>
  <div class="kv"><span class="k"><code>journald</code></span><span class="v">Hands logs to systemd, which already rotates and already has retention policy. Good on a systemd host; <code>journalctl -u docker CONTAINER_NAME=blog-api-1</code> becomes your reader.</span></div>
  <div class="kv"><span class="k">Remote drivers</span><span class="v"><code>syslog</code>, <code>fluentd</code>, <code>gelf</code>, <code>awslogs</code>. They ship logs off the host, which is the real answer at scale — but <code>docker logs</code> stops working, and a blocking driver can stall your application if the collector is down.</span></div>
  <div class="kv"><span class="k"><code>mode: non-blocking</code></span><span class="v">Buffers instead of blocking the container's writes when the driver is slow. Essential with any remote driver: without it, a log collector outage becomes an application outage.</span></div>
</div>

<h3>Cleaning up after it has already happened</h3>
${slide('dk-11', 17, 'rm một file đang mở KHÔNG trả chỗ — truncate thì trả ngay')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Confirm it is logs</span><span class="lz-t">du -sh on the containers directory</span><span class="lz-d">Compare against <code>docker system df</code>. Big number here and a small one there means log files, not images or volumes.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Truncate, do not delete</span><span class="lz-t">truncate -s 0 the log file</span><span class="lz-d">Deleting the file while the container holds it open frees nothing — the space returns only when the process exits. Truncating reclaims it immediately, with the container still running.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Configure rotation</span><span class="lz-t">daemon.json, then recreate containers</span><span class="lz-d">Otherwise you are back here next month. The fix is not the truncate; the fix is the rotation you add afterwards.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Ask why it was chatty</span><span class="lz-t">4GB of logs is usually a bug</span><span class="lz-d">A request logged at debug level, a retry loop printing every attempt, a healthcheck logging every 5 seconds. Rotation caps the damage; the log line itself is often the real fix.</span></div>
</div>
<pre><code>sudo du -sh /var/lib/docker/containers/* 2&gt;/dev/null | sort -rh | head -3
sudo truncate -s 0 /var/lib/docker/containers/*/*-json.log
df -h /var/lib/docker | tail -1</code></pre>
<div class="out">4.1G	/var/lib/docker/containers/9f2ac1…
118M	/var/lib/docker/containers/3b81e7…
12M	/var/lib/docker/containers/aa41f0…
/dev/vda1        49G   19G   28G  41% /var/lib/docker</div>
<div class="callout warn"><strong>A full disk takes the database down, and it is not always obvious afterwards.</strong> Postgres cannot write its WAL, refuses transactions and may not restart cleanly; this project has had a deploy die mid-build with <code>no space left on device</code> after the build cache grew to 7.6GB on the same disk as Postgres. The lesson generalised: on a single-disk VPS, <em>everything</em> shares the failure. Rotation on logs, a periodic <code>docker system prune</code>, and building images somewhere other than the production host are three cheap ways to keep that disk from ever getting close.</div>

<h3>Why deleting frees nothing — shown, not told</h3>
<p>"The space returns only when the process exits" sounds like a detail until you watch it. This runs entirely inside one throwaway container with a 100 MB in-memory disk (<code>tmpfs</code>), so nothing on your machine is touched: a background <code>tail -f</code> plays the role of dockerd holding the log open.</p>
<pre><code class="language-bash">docker run --rm --tmpfs /t:size=100m alpine sh -c '
  dd if=/dev/zero of=/t/app.log bs=1M count=60 2&gt;/dev/null
  tail -f /t/app.log &gt;/dev/null &amp;  sleep 1
  df -h /t | tail -1
  rm /t/app.log ; ls /t | wc -l
  df -h /t | tail -1
  kill $! ; sleep 1
  df -h /t | tail -1'</code></pre>
<div class="out">tmpfs                   100.0M     60.0M     40.0M  60% /t
0
tmpfs                   100.0M     60.0M     40.0M  60% /t
tmpfs                   100.0M         0    100.0M   0% /t</div>
<p>Real output from a Mac. After <code>rm</code> the directory is empty (<code>0</code> files) and the disk is exactly as full: the name is gone, the data is not, because a process still has it open. Only when that process dies does the space come back. On a server, the process holding a container's log open is <code>dockerd</code> — which you do not want to kill. Hence <code>truncate</code>, which empties the file in place:</p>
<pre><code class="language-bash">docker run -d --name tick alpine sh -c 'i=0; while :; do echo "tick $i"; i=$((i+1)); sleep 0.2; done'
T=$(docker inspect -f '{{.Id}}' tick)
docker run --rm -v /var/lib/docker/containers:/c alpine truncate -s 0 /c/$T/$T-json.log
sleep 2 ; docker logs tick | head -3</code></pre>
<div class="out">tick 16
tick 17
tick 18</div>
<p>The log starts again from the lines written after the truncate, and <code>docker logs</code> keeps working (on the 33 MB file from the step-by-step section, <code>du</code> went from <code>33.0M</code> to <code>0</code>). One honest caveat: Docker's own documentation says these files "are designed to be exclusively accessed by the Docker daemon" and warns that touching them with other tools may interfere with logging. Treat <code>truncate</code> as first aid on a full disk, never as the plan; the plan is <code>max-size</code>.</p>

<h3>Logging in a way that is worth reading</h3>
<pre><code><span class="tok-comment">// Write JSON to stdout — Docker captures it, and tools can parse it</span>
const log = (level, msg, extra = {}) =&gt; process.stdout.write(
  JSON.stringify({ t: new Date().toISOString(), level, msg, ...extra }) + '\\n'
);
log('info', 'request', { method: 'GET', path: '/api/v1/posts', ms: 42, status: 200 });</code></pre>
<pre><code>docker compose logs --no-log-prefix --tail 2 api | jq -c '{t, level, msg, ms}'</code></pre>
<div class="out">{"t":"2026-08-22T13:44:02.118Z","level":"info","msg":"request","ms":42}
{"t":"2026-08-22T13:44:02.663Z","level":"warn","msg":"slow query","ms":812}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">stdout and stderr, nothing else</span><span class="v">Never write to a file inside the container. Docker only captures the two streams; a log file in the container is invisible to <code>docker logs</code> and dies with the container.</span></div>
  <div class="kv"><span class="k">One line per event</span><span class="v">A multi-line stack trace becomes several unrelated log entries in most collectors. Serialise the stack into one JSON field instead.</span></div>
  <div class="kv"><span class="k">Structured beats pretty</span><span class="v">JSON is unpleasant to read raw and trivial to filter: <code>jq 'select(.ms &gt; 500)'</code> answers a question that grep cannot.</span></div>
  <div class="kv"><span class="k">Never log secrets</span><span class="v">Tokens, passwords, full request bodies, <code>Authorization</code> headers. Log storage is rarely as protected as you assume, and rotation means old copies linger.</span></div>
  <div class="kv"><span class="k">Useful flags</span><span class="v"><code>docker compose logs -f --tail 100 --since 10m api</code>. <code>--since</code> in particular turns a 4GB log into the last ten minutes, instantly.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the group's VPS monitor says the disk is 95% full, yet <code>docker system df</code> shows nothing alarming. You suspect the API, which logs every request. Reproduce it in <code>~/thu-docker</code>, find the culprit, rescue the disk and make sure it cannot happen again.</p><ol>
<li>Start the chatty service: the <code>noisy</code> command from the step-by-step section, named <code>thu-noisy</code>. Wait 15 seconds.</li>
<li>Prove what <code>docker</code> itself reports: <code>docker ps -s --filter name=thu-noisy</code>. Then measure the real file with the helper: <code>docker run --rm -v /var/lib/docker/containers:/c:ro alpine sh -c 'du -sh /c/*' | sort -rh | head -3</code>.</li>
<li>Rescue without stopping it: truncate its log file with the helper container (the <code>tick</code> example above) and confirm the file is now <code>0</code>.</li>
<li>Prevent it: run the same service again as <code>thu-quiet</code> with <code>--log-opt max-size=1m --log-opt max-file=3</code>, and check <code>docker inspect -f '{{.HostConfig.LogConfig.Config}}' thu-quiet</code>.</li>
<li>Clean up: <code>docker rm -f thu-noisy thu-quiet</code>.</li></ol>
<p><strong>Done when:</strong> you can show the two numbers that disagree (a few kB from <code>docker ps -s</code>, tens of MB from <code>du</code>), the truncated file reads <code>0</code>, and <code>thu-quiet</code> shows <code>map[max-file:3 max-size:1m]</code> with at most three files of about 1 MB.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Logging driver</span><span class="v">The component inside dockerd that decides where a container's stdout/stderr goes: <code>json-file</code>, <code>local</code>, <code>journald</code>, …</span></div>
  <div class="kv"><span class="k">json-file</span><span class="v">The default driver: one JSON line per output line in <code>&lt;id&gt;-json.log</code>. Unlimited unless you set <code>max-size</code>.</span></div>
  <div class="kv"><span class="k">Log rotation</span><span class="v">Closing the current file at a size limit, starting a new one and deleting the oldest; <code>max-size</code> × <code>max-file</code> is the ceiling.</span></div>
  <div class="kv"><span class="k">daemon.json</span><span class="v"><code>/etc/docker/daemon.json</code>: defaults for every <em>new</em> container. Log options there need a daemon restart.</span></div>
  <div class="kv"><span class="k">truncate</span><span class="v">Cut a file to a given size in place (<code>-s 0</code> = empty), keeping it open for whoever writes to it.</span></div>
  <div class="kv"><span class="k">Open file handle</span><span class="v">A running process's reference to a file. While one exists, deleting the name does not free the data.</span></div>
  <div class="kv"><span class="k">Structured logging</span><span class="v">Writing each event as one JSON object so tools like <code>jq</code> can filter by field.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Docker writes each container's stdout/stderr to a JSON file on the host; with the default <code>json-file</code> driver it grows forever.</li>
<li>Measured: 300,000 lines became a 33 MB file; the same lines with <code>max-size=1m</code>, <code>max-file=3</code> stayed at 2.6 MB.</li>
<li><code>docker ps -s</code> and <code>docker system df</code> do not count log files; <code>du</code> and <code>df -h /var/lib/docker</code> do.</li>
<li>Set rotation in compose (<code>logging.options</code>) and as a daemon default; the daemon default needs <code>systemctl restart docker</code> and only affects new containers.</li>
<li>Deleting an open log frees nothing; <code>truncate -s 0</code> frees it at once — as first aid, since Docker says its log files are for dockerd only.</li>
<li>Log to stdout, one JSON line per event, never secrets; read with <code>--since</code> and <code>--tail</code> instead of the whole file.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/logging/configure/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Configure logging drivers</span><span class="lc-sub">Every driver, the daemon-wide versus per-container precedence, the <code>mode</code> and <code>max-buffer-size</code> options, and which drivers keep <code>docker logs</code> working.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/logging/drivers/local/" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">The local logging driver</span><span class="lc-sub">Rotation on by default and a more efficient format. Worth considering as the daemon default if nothing outside Docker needs to read the raw files.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: tame the logs</span><span class="lc-sub">Graded exercises: find which container is filling the disk, reclaim the space without stopping it, configure rotation in both places, and explain why deleting the log file frees nothing.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> reclaiming space with <code>rm</code> on a container's log file. The container still holds the file open, so the kernel keeps the blocks allocated until that process exits — <code>df</code> shows the disk just as full, and now <code>docker logs</code> is broken too, because the file it reads no longer exists at that path. <code>truncate -s 0</code> is the correct move: it frees the blocks immediately, the running container keeps writing to the same open file handle, and <code>docker logs</code> continues working. Then configure <code>max-size</code> so you do not do this again — and remember that a daemon-level change needs a daemon <em>restart</em> (not a reload) and only applies to containers created afterwards, so recreate the existing ones.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The default <code>json-file</code> driver never rotates: set <code>max-size</code> and <code>max-file</code> in <code>daemon.json</code> <em>and</em> in compose, and recreate containers afterwards. Log files live outside everything <code>docker system df</code> counts, so a host can be out of disk while Docker reports plenty of room. And to reclaim space from a running container's log, <code>truncate -s 0</code> — deleting the file frees nothing until the process exits.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Log, xoay log, và cái đĩa đầy</h2>
<p class="lead">Docker hứng mọi thứ tiến trình của bạn ghi ra stdout với stderr rồi lưu trên máy chủ. Đó là một thiết kế tốt, và nó có đúng một mặc định nguy hiểm: với driver <code>json-file</code> tiêu chuẩn, KHÔNG có gì xoay vòng trừ khi bạn bảo nó xoay. Một dịch vụ lắm lời sẽ làm đầy đĩa, và trên một con VPS nhỏ thì cái đĩa nó làm đầy chính là cái đang chứa cơ sở dữ liệu của bạn.</p>

<h3>Log thật ra nằm ở đâu</h3>
${slide('dk-11', 14, 'Log đi đâu: stdout → dockerd → một file JSON trên máy chủ')}
<pre><code>docker inspect -f '{{ .LogPath }}' blog-api-1
sudo ls -lh "$(docker inspect -f '{{ .LogPath }}' blog-api-1)"
docker inspect -f '{{ .HostConfig.LogConfig.Type }} {{ .HostConfig.LogConfig.Config }}' blog-api-1</code></pre>
<div class="out">/var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
-rw-r----- 1 root root 4.1G Aug 22 13:31 /var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
json-file map[]</div>
<div class="callout warn"><strong>4,1GB, và <code>map[]</code> nghĩa là chưa cấu hình xoay vòng gì cả.</strong> Cái file đó phình tới khi đĩa đầy, và nó không được tính vào chỗ nào dễ thấy — <code>docker system df</code> không hiện nó, vì nó không phải một cái ảnh, một lớp container hay một volume. Một máy chủ báo rằng Docker còn nhiều chỗ vẫn có thể đã hết đĩa. <code>docker logs</code> đọc chính file này, và đó cũng là lý do <code>docker logs</code> trên một container bận rộn có thể chạy rất lâu.</div>

<h3>Chạy thử từng bước: nhìn một file log phình ra, rồi chặn nó lại</h3>
${slide('dk-11', 15, '300.000 dòng log = 33 MB; có max-size thì dừng ở 2,6 MB')}
<p>Những con số như "4.1G" rất dễ bị lướt qua. Hãy tự tạo con số của mình: hai container giống hệt nhau in cùng 300.000 dòng kiểu log truy cập; một cái dùng mặc định, cái kia giới hạn log ở ba file mỗi file 1 MB.</p>
<pre><code class="language-bash">docker run -d --name noisy alpine sh -c 'i=0; while [ $i -lt 300000 ]; do echo "GET /api/v1/posts 200 12ms user=42 req=$i"; i=$((i+1)); done; sleep 600'
docker run -d --name quiet --log-opt max-size=1m --log-opt max-file=3 \\
  alpine sh -c 'i=0; while [ $i -lt 300000 ]; do echo "GET /api/v1/posts 200 12ms user=42 req=$i"; i=$((i+1)); done; sleep 600'
sleep 15
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}' noisy quiet
<span class="tok-comment"># file log nằm trên máy chạy Docker; trên Mac đó là máy ảo Docker Desktop, nên nhìn qua một container phụ</span>
N=$(docker inspect -f '{{.Id}}' noisy) ; Q=$(docker inspect -f '{{.Id}}' quiet)
docker run --rm -v /var/lib/docker/containers:/c:ro alpine sh -c "ls -lh /c/$N /c/$Q | grep json"</code></pre>
<div class="out">json-file map[]
json-file map[max-file:3 max-size:1m]
-rw-r-----    1 root     root       33.0M Sep 23 19:20 4199a2e6…-json.log
-rw-r-----    1 root     root      638.9K Sep 23 19:20 6827e421…-json.log
-rw-r-----    1 root     root      976.6K Sep 23 19:20 6827e421…-json.log.1
-rw-r-----    1 root     root      976.6K Sep 23 19:20 6827e421…-json.log.2</div>
<p>Output thật trên Mac (Docker Desktop; ID dài được rút gọn bằng …). Cùng chương trình, cùng 300.000 dòng: <strong>33 MB</strong> khi không giới hạn, <strong>2,6 MB</strong> trong ba file xoay vòng khi có. File to hơn chữ in ra vì mỗi dòng bị bọc trong JSON — đây là dòng đầu tiên trong file của <code>noisy</code>:</p>
<div class="out">{"log":"GET /api/v1/posts 200 12ms user=42 req=0\\n","stream":"stdout","time":"2026-09-23T19:20:55.359874875Z"}</div>
<table>
<tr><th>Trường</th><th>Nghĩa là</th></tr>
<tr><td><code>log</code></td><td>Đúng những gì tiến trình ghi ra, kể cả dấu xuống dòng.</td></tr>
<tr><td><code>stream</code></td><td><code>stdout</code> hay <code>stderr</code> — nhờ đó <code>docker logs</code> tách lại được hai luồng.</td></tr>
<tr><td><code>time</code></td><td>Lúc dockerd nhận dòng đó, giờ UTC đến nano giây — nguồn của <code>docker logs --since</code> và <code>-t</code>.</td></tr>
</table>
<p>Khi bật xoay vòng, <code>docker logs quiet | wc -l</code> chỉ đếm được <code>22882</code> dòng: những dòng cũ nhất đã mất, và đó là cái giá của một cái đĩa có trần. Hãy để cửa sổ đủ lớn để phủ khoảng thời gian từ "có gì đó hỏng" tới "có người nhìn vào" — với VPS của sinh viên, <code>10m</code> × <code>3</code> là điểm khởi đầu phổ biến và hợp lý.</p>

<h3>Không ai đếm file log giùm bạn</h3>
${slide('dk-11', 16, 'docker ps -s nói 4,1 kB — file log 33 MB: không bảng nào đếm log')}
<pre><code class="language-bash">docker ps -s --filter name=noisy --format '{{.Names}} {{.Size}}'
docker system df</code></pre>
<div class="out">noisy 4.1kB (virtual 9.33MB)
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          72        21        37.63GB   24.88GB (66%)
Containers      38        11        882.6MB   553.8MB (62%)
…</div>
<p>Output thật, cùng máy Mac, vài giây sau. <code>docker ps -s</code> báo <em>tầng ghi</em> của container — 4,1 kB — và file log 33 MB không thuộc về nó. <code>docker system df</code> đếm ảnh, tầng ghi của container, volume và cache build, mà file log chẳng phải thứ nào trong số đó. Công cụ trung thực duy nhất là <code>du</code> trên <code>/var/lib/docker/containers</code> và rốt cuộc là <code>df -h /var/lib/docker</code>.</p>

<h3>Xoay vòng, hai chỗ để đặt</h3>
${slide('dk-11', 18, 'Đặt xoay vòng ở hai nơi — daemon.json phải RESTART, không phải reload')}
<pre><code><span class="tok-comment"># Theo từng dịch vụ, trong compose — tường minh và review được</span>
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
        compress: "true"
        labels: "service"</code></pre>
<pre><code><span class="tok-comment"># Hoặc đặt một lần, cho mọi container daemon từng khởi động</span>
sudo tee /etc/docker/daemon.json &lt;&lt;'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "3", "compress": "true" }
}
JSON
sudo systemctl restart docker   <span class="tok-comment"># restart, KHÔNG phải reload: log-opts không nạp lại được — và lệnh này dừng container nếu chưa bật live-restore</span>
docker info --format 'driver={{ .LoggingDriver }}'</code></pre>
<div class="out">driver=json-file</div>
<div class="callout ok"><strong>Hãy đặt trong <code>daemon.json</code> VÀ đặt trong compose.</strong> Mặc định ở mức daemon bảo vệ mọi container mà bất kỳ ai khởi động trên máy đó — kể cả cái <code>docker run</code> dùng một lần mà ai đó để chạy suốt một tuần. Mục trong compose ghi lại ý định ở chỗ người review sẽ nhìn thấy, và nó đi theo dự án sang một máy chủ mới. Lưu ý một thay đổi ở mức daemon chỉ áp cho những container tạo ra SAU lần khởi động lại daemon, nên hãy dựng lại những cái đang có. <strong>Đã sửa 09/2026:</strong> bản trước ghi <code>systemctl reload docker</code>. Tài liệu tham chiếu của dockerd liệt kê những tuỳ chọn mà một lần reload (SIGHUP) đổi được — <code>debug</code>, <code>labels</code>, <code>live-restore</code>, registry mirror và vài cái nữa — và <code>log-driver</code>/<code>log-opts</code> KHÔNG nằm trong đó. Tài liệu về log cũng nói vậy: khởi động lại Docker, và chỉ container mới nhận cấu hình mới.</div>

<h3>Những driver đáng biết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>json-file</code></span><span class="v">Mặc định. Chạy được với <code>docker logs</code>, giữ một file cho mỗi container, và không xoay vòng nếu không cấu hình. Cứ dùng nó, kèm <code>max-size</code>.</span></div>
  <div class="kv"><span class="k"><code>local</code></span><span class="v">Định dạng riêng của Docker: xoay vòng bật sẵn, gọn hơn, nhanh hơn. Đổi lại chỉ Docker đọc được nó — không đọc trực tiếp file bằng công cụ thông thường được.</span></div>
  <div class="kv"><span class="k"><code>journald</code></span><span class="v">Giao log cho systemd, thứ vốn đã xoay vòng và đã có chính sách lưu giữ. Tốt trên máy chủ dùng systemd; khi đó <code>journalctl -u docker CONTAINER_NAME=blog-api-1</code> là công cụ đọc của bạn.</span></div>
  <div class="kv"><span class="k">Driver từ xa</span><span class="v"><code>syslog</code>, <code>fluentd</code>, <code>gelf</code>, <code>awslogs</code>. Chúng đẩy log ra khỏi máy chủ, và đó mới là câu trả lời thật khi quy mô lớn — nhưng <code>docker logs</code> ngừng chạy, và một driver kiểu chặn có thể làm treo ứng dụng của bạn nếu bên thu thập chết.</span></div>
  <div class="kv"><span class="k"><code>mode: non-blocking</code></span><span class="v">Đệm lại thay vì chặn các lệnh ghi của container khi driver chậm. Bắt buộc với mọi driver từ xa: không có nó, một sự cố của bên thu thập log biến thành một sự cố của ứng dụng.</span></div>
</div>

<h3>Dọn dẹp sau khi chuyện đã xảy ra</h3>
${slide('dk-11', 17, 'rm một file đang mở KHÔNG trả chỗ — truncate thì trả ngay')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Xác nhận thủ phạm là log</span><span class="lz-t">du -sh trên thư mục containers</span><span class="lz-d">Đối chiếu với <code>docker system df</code>. Số lớn ở đây và số nhỏ ở kia nghĩa là file log, không phải ảnh hay volume.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cắt cụt, đừng xoá</span><span class="lz-t">truncate -s 0 lên file log</span><span class="lz-d">Xoá file trong lúc container vẫn giữ nó mở thì chẳng giải phóng được gì — chỗ đó chỉ trả về khi tiến trình thoát. Cắt cụt lấy lại chỗ ngay lập tức, container vẫn chạy.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Cấu hình xoay vòng</span><span class="lz-t">daemon.json, rồi dựng lại container</span><span class="lz-d">Không thì tháng sau bạn lại quay lại đây. Cách chữa không phải là lệnh truncate; cách chữa là cái xoay vòng bạn thêm vào sau đó.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Hỏi vì sao nó lắm lời</span><span class="lz-t">4GB log thường là một cái lỗi</span><span class="lz-d">Một yêu cầu ghi log ở mức debug, một vòng thử lại in ra mọi lần thử, một healthcheck ghi log mỗi 5 giây. Xoay vòng chặn thiệt hại; chính cái dòng log kia mới thường là cách chữa thật.</span></div>
</div>
<pre><code>sudo du -sh /var/lib/docker/containers/* 2&gt;/dev/null | sort -rh | head -3
sudo truncate -s 0 /var/lib/docker/containers/*/*-json.log
df -h /var/lib/docker | tail -1</code></pre>
<div class="out">4.1G	/var/lib/docker/containers/9f2ac1…
118M	/var/lib/docker/containers/3b81e7…
12M	/var/lib/docker/containers/aa41f0…
/dev/vda1        49G   19G   28G  41% /var/lib/docker</div>
<div class="callout warn"><strong>Một cái đĩa đầy kéo cơ sở dữ liệu xuống theo, và sau đó không phải lúc nào cũng dễ nhận ra.</strong> Postgres không ghi được WAL, từ chối giao dịch và có thể không khởi động lại sạch sẽ; chính dự án này từng có một lượt deploy chết giữa chừng với <code>no space left on device</code> sau khi cache dựng phình lên 7,6GB trên đúng cái đĩa chứa Postgres. Bài học khái quát ra: trên một con VPS một đĩa, <em>MỌI THỨ</em> cùng chia nhau cái hỏng. Xoay vòng log, một lượt <code>docker system prune</code> định kỳ, và dựng ảnh ở nơi khác chứ không phải trên máy chủ production là ba cách rẻ để cái đĩa đó không bao giờ tiến gần tới giới hạn.</div>

<h3>Vì sao xoá chẳng giải phóng được gì — cho thấy, không chỉ kể</h3>
<p>"Chỗ trống chỉ trả về khi tiến trình thoát" nghe như tiểu tiết cho tới khi bạn tận mắt thấy. Demo này chạy trọn trong một container dùng-một-lần với ổ đĩa 100 MB nằm trong RAM (<code>tmpfs</code>), nên không đụng gì tới máy bạn: một lệnh <code>tail -f</code> chạy nền đóng vai dockerd đang giữ file log mở.</p>
<pre><code class="language-bash">docker run --rm --tmpfs /t:size=100m alpine sh -c '
  dd if=/dev/zero of=/t/app.log bs=1M count=60 2&gt;/dev/null
  tail -f /t/app.log &gt;/dev/null &amp;  sleep 1
  df -h /t | tail -1
  rm /t/app.log ; ls /t | wc -l
  df -h /t | tail -1
  kill $! ; sleep 1
  df -h /t | tail -1'</code></pre>
<div class="out">tmpfs                   100.0M     60.0M     40.0M  60% /t
0
tmpfs                   100.0M     60.0M     40.0M  60% /t
tmpfs                   100.0M         0    100.0M   0% /t</div>
<p>Output thật trên Mac. Sau <code>rm</code> thư mục trống trơn (<code>0</code> file) mà đĩa vẫn đầy y nguyên: cái tên mất rồi, dữ liệu thì chưa, vì vẫn có một tiến trình đang mở nó. Chỉ khi tiến trình đó chết thì chỗ mới quay về. Trên máy chủ, tiến trình giữ log của container là <code>dockerd</code> — thứ bạn không muốn giết. Vì thế mới cần <code>truncate</code>, làm rỗng file ngay tại chỗ:</p>
<pre><code class="language-bash">docker run -d --name tick alpine sh -c 'i=0; while :; do echo "tick $i"; i=$((i+1)); sleep 0.2; done'
T=$(docker inspect -f '{{.Id}}' tick)
docker run --rm -v /var/lib/docker/containers:/c alpine truncate -s 0 /c/$T/$T-json.log
sleep 2 ; docker logs tick | head -3</code></pre>
<div class="out">tick 16
tick 17
tick 18</div>
<p>Log bắt đầu lại từ những dòng ghi sau lần truncate, và <code>docker logs</code> vẫn chạy (với file 33 MB ở mục "Chạy thử từng bước", <code>du</code> từ <code>33.0M</code> xuống <code>0</code>). Một lưu ý trung thực: chính tài liệu Docker nói các file này "được thiết kế để chỉ daemon Docker truy cập" và cảnh báo đụng vào chúng bằng công cụ khác có thể làm rối hệ thống log. Hãy coi <code>truncate</code> là sơ cứu khi đĩa đầy, đừng bao giờ coi là kế hoạch; kế hoạch là <code>max-size</code>.</p>

<h3>Ghi log theo cách đáng đọc</h3>
<pre><code><span class="tok-comment">// Ghi JSON ra stdout — Docker hứng được, và công cụ phân tích được</span>
const log = (level, msg, extra = {}) =&gt; process.stdout.write(
  JSON.stringify({ t: new Date().toISOString(), level, msg, ...extra }) + '\\n'
);
log('info', 'request', { method: 'GET', path: '/api/v1/posts', ms: 42, status: 200 });</code></pre>
<pre><code>docker compose logs --no-log-prefix --tail 2 api | jq -c '{t, level, msg, ms}'</code></pre>
<div class="out">{"t":"2026-08-22T13:44:02.118Z","level":"info","msg":"request","ms":42}
{"t":"2026-08-22T13:44:02.663Z","level":"warn","msg":"slow query","ms":812}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">stdout và stderr, không gì khác</span><span class="v">Đừng bao giờ ghi vào một file bên trong container. Docker chỉ hứng hai luồng đó; một file log trong container thì vô hình với <code>docker logs</code> và chết theo container.</span></div>
  <div class="kv"><span class="k">Một dòng cho một sự kiện</span><span class="v">Một vết ngăn xếp nhiều dòng biến thành nhiều mục log không liên quan trong phần lớn bộ thu thập. Hãy tuần tự hoá cái ngăn xếp đó vào một trường JSON.</span></div>
  <div class="kv"><span class="k">Có cấu trúc hơn là đẹp mắt</span><span class="v">JSON đọc thô thì khó chịu và lọc thì dễ như bỡn: <code>jq 'select(.ms &gt; 500)'</code> trả lời được câu hỏi mà grep không trả lời nổi.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ ghi log bí mật</span><span class="v">Token, mật khẩu, toàn bộ thân yêu cầu, header <code>Authorization</code>. Chỗ lưu log hiếm khi được bảo vệ kỹ như bạn tưởng, và xoay vòng nghĩa là các bản cũ còn nằm lại.</span></div>
  <div class="kv"><span class="k">Những cờ hữu ích</span><span class="v"><code>docker compose logs -f --tail 100 --since 10m api</code>. Riêng <code>--since</code> biến một cuốn log 4GB thành mười phút gần nhất, ngay lập tức.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bộ giám sát VPS của nhóm báo đĩa đầy 95%, vậy mà <code>docker system df</code> chẳng có gì đáng lo. Bạn nghi con API, thứ ghi log mọi request. Dựng lại trong <code>~/thu-docker</code>, tìm thủ phạm, cứu cái đĩa và bảo đảm chuyện này không lặp lại.</p><ol>
<li>Chạy dịch vụ lắm lời: lệnh <code>noisy</code> ở mục "Chạy thử từng bước", đặt tên <code>thu-noisy</code>. Chờ 15 giây.</li>
<li>Chứng minh chính <code>docker</code> báo gì: <code>docker ps -s --filter name=thu-noisy</code>. Rồi đo file thật bằng container phụ: <code>docker run --rm -v /var/lib/docker/containers:/c:ro alpine sh -c 'du -sh /c/*' | sort -rh | head -3</code>.</li>
<li>Cứu mà không phải dừng nó: truncate file log bằng container phụ (như ví dụ <code>tick</code> ở trên) và xác nhận file giờ là <code>0</code>.</li>
<li>Phòng ngừa: chạy lại dịch vụ đó với tên <code>thu-quiet</code> kèm <code>--log-opt max-size=1m --log-opt max-file=3</code>, rồi kiểm <code>docker inspect -f '{{.HostConfig.LogConfig.Config}}' thu-quiet</code>.</li>
<li>Dọn dẹp: <code>docker rm -f thu-noisy thu-quiet</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được hai con số vênh nhau (vài kB từ <code>docker ps -s</code>, hàng chục MB từ <code>du</code>), file sau khi truncate đọc ra <code>0</code>, và <code>thu-quiet</code> hiện <code>map[max-file:3 max-size:1m]</code> với tối đa ba file khoảng 1 MB.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Logging driver (trình ghi log)</span><span class="v">Bộ phận trong dockerd quyết định stdout/stderr của container đi đâu: <code>json-file</code>, <code>local</code>, <code>journald</code>, …</span></div>
  <div class="kv"><span class="k">json-file (file JSON)</span><span class="v">Driver mặc định: mỗi dòng output thành một dòng JSON trong <code>&lt;id&gt;-json.log</code>. Không giới hạn nếu không đặt <code>max-size</code>.</span></div>
  <div class="kv"><span class="k">Log rotation (xoay vòng log)</span><span class="v">Đóng file hiện tại khi chạm trần kích thước, mở file mới và xoá file cũ nhất; <code>max-size</code> × <code>max-file</code> là trần tổng.</span></div>
  <div class="kv"><span class="k">daemon.json (cấu hình daemon)</span><span class="v"><code>/etc/docker/daemon.json</code>: giá trị mặc định cho mọi container <em>mới</em>. Tuỳ chọn log ở đây cần khởi động lại daemon.</span></div>
  <div class="kv"><span class="k">truncate (cắt cụt)</span><span class="v">Cắt một file về kích thước cho trước ngay tại chỗ (<code>-s 0</code> = rỗng), vẫn để mở cho ai đang ghi vào nó.</span></div>
  <div class="kv"><span class="k">Open file handle (file đang được mở)</span><span class="v">Tham chiếu của một tiến trình đang chạy tới một file. Còn nó thì xoá tên file cũng không giải phóng dữ liệu.</span></div>
  <div class="kv"><span class="k">Structured logging (log có cấu trúc)</span><span class="v">Ghi mỗi sự kiện thành một đối tượng JSON để công cụ như <code>jq</code> lọc theo trường.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Docker ghi stdout/stderr của mỗi container vào một file JSON trên máy chủ; với driver mặc định <code>json-file</code> nó phình mãi.</li>
<li>Đo được: 300.000 dòng thành file 33 MB; cùng số dòng đó với <code>max-size=1m</code>, <code>max-file=3</code> chỉ còn 2,6 MB.</li>
<li><code>docker ps -s</code> và <code>docker system df</code> không đếm file log; <code>du</code> và <code>df -h /var/lib/docker</code> mới đếm.</li>
<li>Đặt xoay vòng trong compose (<code>logging.options</code>) và làm mặc định của daemon; mặc định của daemon cần <code>systemctl restart docker</code> và chỉ áp cho container mới.</li>
<li>Xoá một file log đang mở chẳng giải phóng gì; <code>truncate -s 0</code> giải phóng ngay — như sơ cứu, vì Docker nói file log là để dockerd dùng riêng.</li>
<li>Ghi log ra stdout, mỗi sự kiện một dòng JSON, không bao giờ ghi bí mật; đọc bằng <code>--since</code> và <code>--tail</code> thay vì cả file.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/logging/configure/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Cấu hình driver ghi log</span><span class="lc-sub">Mọi driver, thứ tự ưu tiên giữa mức daemon với mức từng container, các tuỳ chọn <code>mode</code> và <code>max-buffer-size</code>, và driver nào còn giữ được <code>docker logs</code>.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/engine/logging/drivers/local/" target="_blank" rel="noopener">
  <span class="lc-ico">🗃️</span>
  <span class="lc-body"><span class="lc-title">Driver ghi log local</span><span class="lc-sub">Xoay vòng bật sẵn và định dạng hiệu quả hơn. Đáng cân nhắc làm mặc định ở mức daemon nếu không có gì ngoài Docker cần đọc file thô.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: thuần hoá đám log</span><span class="lc-sub">Bài chấm điểm: tìm ra container nào đang làm đầy đĩa, lấy lại chỗ mà không phải dừng nó, cấu hình xoay vòng ở cả hai nơi, và giải thích vì sao xoá file log chẳng giải phóng được gì.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> lấy lại chỗ trống bằng cách <code>rm</code> file log của một container. Container vẫn giữ file đó mở, nên nhân vẫn giữ nguyên các khối đã cấp cho tới khi tiến trình ấy thoát — <code>df</code> vẫn báo đĩa đầy y như cũ, và giờ thì <code>docker logs</code> cũng hỏng nốt, vì file nó đọc không còn tồn tại ở đường dẫn đó nữa. <code>truncate -s 0</code> mới là nước đi đúng: nó giải phóng các khối ngay lập tức, container đang chạy vẫn ghi tiếp vào cùng cái file handle đang mở, và <code>docker logs</code> vẫn chạy. Rồi hãy cấu hình <code>max-size</code> để bạn không phải làm lại chuyện này — và nhớ rằng thay đổi ở mức daemon cần <em>khởi động lại</em> daemon (không phải reload) và chỉ áp cho container tạo sau đó, nên hãy dựng lại những cái đang có.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Driver mặc định <code>json-file</code> KHÔNG bao giờ xoay vòng: hãy đặt <code>max-size</code> với <code>max-file</code> trong <code>daemon.json</code> <em>và</em> trong compose, rồi dựng lại container sau đó. File log nằm ngoài mọi thứ <code>docker system df</code> đếm, nên một máy chủ có thể hết đĩa trong khi Docker báo còn rộng rãi. Và để lấy lại chỗ từ log của một container đang chạy thì dùng <code>truncate -s 0</code> — xoá file chẳng giải phóng được gì cho tới khi tiến trình thoát.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Updates, CI/CD, and rollback|||11.4 — Cập nhật, CI/CD, và quay lui',
      slug: 'dk-11-4-cap-nhat-quay-lui',
      type: 'LESSON',
      description: 'Vì sao up -d không phải không gián đoạn, tắt máy tử tế và SIGTERM, dựng ở nơi khác rồi chỉ tráo ảnh, một đường ống CI/CD hoàn chỉnh, quay lui trong bốn mươi giây, và vì sao deploy không nên là hệ quả phụ của một lệnh push.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Updates, CI/CD, and rollback</h2>
<p class="lead">Deploying is where a working stack meets the one thing containers do not give you for free: continuity. <code>docker compose up -d</code> recreates changed containers, and recreating means stopping one and starting another — a gap. This lesson is about making that gap small, making it safe, and being able to undo it in under a minute.</p>

<h3>What actually happens on an update</h3>
${slide('dk-11', 19, 'up -d tráo container = một khoảng trống: đo được 2,2 giây lỗi')}
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -4</code></pre>
<div class="out">[+] Running 3/3
 ✔ Container blog-api-1  Recreated                          10.4s
 ✔ Container blog-web-1  Running                             0.0s
 ✔ Container blog-db-1   Running                             0.0s</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Compose diffs, not restarts</span><span class="lz-t">unchanged services say "Running", not "Recreated"</span><span class="lz-d">Only containers whose image, environment, mounts or config differ are touched. That is why <code>up -d</code> is safe to run repeatedly and why the database is not disturbed by an API deploy.</span></div>
  <div class="lz-step"><span class="lz-k">2 · SIGTERM to the old container</span><span class="lz-t">then a grace period, then SIGKILL</span><span class="lz-d">Default grace is 10 seconds. A process that ignores SIGTERM is killed, dropping every in-flight request. This is where most "deploys cause errors" reports come from.</span></div>
  <div class="lz-step"><span class="lz-k">3 · New container starts</span><span class="lz-t">and is immediately in the load path</span><span class="lz-d">Between the old one stopping and the new one being ready, requests fail. Ten seconds of 502s per deploy, unless you do something about it.</span></div>
  <div class="lz-step"><span class="lz-k">4 · The gap is the whole problem</span><span class="lz-t">and there are two honest answers</span><span class="lz-d">Either accept a few seconds and deploy when it is quiet, or run two replicas behind the proxy and swap them one at a time. Pretending the gap is not there is not one of them.</span></div>
</div>

<h3>Run it step by step: measure the gap on your own machine</h3>
<p>"A few seconds of errors" is a guess until you count them. The experiment below needs a tiny API that answers <code>{"version":"v1"}</code> and, like a real one that connects to a database first, waits two seconds before listening. Two images of it are built and tagged with their git commit (the next sections explain why), and a probe script calls it every 50 ms while compose swaps one for the other.</p>
<pre><code class="language-javascript">// server.js
const http = require('http');
const V = process.env.APP_VERSION || 'dev';
const server = http.createServer((req, res) =&gt; res.end(JSON.stringify({ version: V }) + '\\n'));
setTimeout(() =&gt; server.listen(3000, () =&gt; console.log('api ' + V + ' listening')), 2000);  <span class="tok-comment">// "connect to the DB" first</span>
process.on('SIGTERM', () =&gt; { console.log('SIGTERM: draining'); server.close(() =&gt; process.exit(0)); });</code></pre>
<pre><code class="language-yaml"># compose.yaml
name: blog
services:
  api:
    image: api:&#36;{TAG:-v1}         <span class="tok-comment"># which image runs is decided by the TAG variable</span>
    ports: ["18110:3000"]
    restart: unless-stopped
    stop_grace_period: 30s</code></pre>
<pre><code class="language-bash">#!/bin/bash
# probe.sh — gọi API mỗi 50ms trong N giây, đếm mã HTTP (call every 50 ms for N seconds, count failures)
end=$((SECONDS+$1)); ok=0; fail=0; first=""; last=""
while [ $SECONDS -lt $end ]; do
  r=$(curl -s -m 1 -w ' %{http_code}' localhost:18110 2&gt;/dev/null); code=&#36;{r##* }
  if [ "$code" = "200" ]; then ok=$((ok+1)); else fail=$((fail+1)); [ -z "$first" ] &amp;&amp; first=$(date +%T.%N | cut -c1-12); last=$(date +%T.%N | cut -c1-12); fi
  sleep 0.05
done
echo "200: $ok  lỗi: $fail  (lỗi đầu $first, lỗi cuối $last)"</code></pre>
<pre><code class="language-bash">TAG=5a06493 docker compose up -d          <span class="tok-comment"># v1 running</span>
./probe.sh 12 &amp;                           <span class="tok-comment"># start counting</span>
sleep 2 ; TAG=e76553c docker compose up -d  <span class="tok-comment"># deploy v2 in the middle</span></code></pre>
<div class="out"> Container blog-api-1 Recreate
 Container blog-api-1 Recreated
 Container blog-api-1 Starting
 Container blog-api-1 Started
200: 111  lỗi: 26  (lỗi đầu 02:22:09.783, lỗi cuối 02:22:11.954)</div>
<p>Real output from a Mac (container names shortened from <code>dk11-blog-api-1</code>; <em>lỗi</em> = errors, <em>lỗi đầu/cuối</em> = first/last error; <code>date +%N</code> needs GNU date or a recent macOS). <code>up -d</code> itself returned in 0.34 seconds, and yet 26 requests failed across 2.2 seconds: the old container stopped in about 0.2 s, and the new one then spent its 2 seconds "connecting to the database" while the port refused connections. The gap is not the stop — it is how long the <em>new</em> container needs before it can answer. A real API that runs Prisma migrations or warms a cache on start has a bigger gap, and that is the number to measure before you promise anyone "zero downtime".</p>

<h3>Shut down gracefully, and the gap shrinks</h3>
${slide('dk-11', 20, 'Bắt SIGTERM + stop_grace_period ⇒ dừng trong 0,2 giây, không rơi request')}
<pre><code><span class="tok-comment">// Handle the signal Docker actually sends</span>
const server = app.listen(3000);
const shutdown = async (sig) =&gt; {
  console.log(&#96;&#36;{sig}: draining&#96;);
  server.close(async () =&gt; {                <span class="tok-comment">// stop accepting, finish in-flight</span>
    await prisma.\$disconnect();
    await redis.quit();
    process.exit(0);
  });
  setTimeout(() =&gt; process.exit(1), 25_000).unref();   <span class="tok-comment">// hard cap</span>
};
process.on('SIGTERM', () =&gt; shutdown('SIGTERM'));
process.on('SIGINT',  () =&gt; shutdown('SIGINT'));</code></pre>
<pre><code>services:
  api:
    stop_grace_period: 30s        <span class="tok-comment"># longer than the app's own 25s cap</span>
    stop_signal: SIGTERM</code></pre>
<pre><code>docker compose stop api &amp;&amp; docker compose logs --tail 3 api</code></pre>
<div class="out">blog-api-1  | SIGTERM: draining
blog-api-1  | 3 requests in flight, waiting
blog-api-1  | closed cleanly in 412ms</div>
<div class="callout ok"><strong>412ms instead of 10 seconds, and no dropped requests.</strong> The pieces are small: handle SIGTERM, stop accepting new connections, let in-flight work finish, close your database pool, exit 0. And remember PID 1 — if your process is not PID 1 or does not install a handler, the signal goes nowhere, which is what <code>tini</code> and <code>init: true</code> fix (Lesson 1.3).</div>
<p>Measured with the small API from the previous section, which has exactly this handler: <code>docker compose stop api</code> took <strong>213 ms</strong> from command to "Stopped", and the logs read <code>SIGTERM: draining</code> followed by <code>closed cleanly in 0ms</code> (no requests were in flight). Without the handler, the same stop takes the full 10-second grace period and ends in SIGKILL, exit 137 — Lesson 1.3 measured 10.17 s for a Node process that ignores SIGTERM.</p>

<h3>Build elsewhere, swap here</h3>
${slide('dk-11', 21, 'Dựng ở máy khác, VPS chỉ kéo về và tráo — ba sự cố thật khi dựng trên VPS')}
<p>Three real incidents from one student project running on a 6 GB VPS explain this section better than any rule. <strong>First</strong>, building the frontend and backend images in parallel on the server killed <code>next build</code> with exit 137 — the same OOM as Lesson 11.2, but during a build, so the deploy simply failed; the fix at the time was to build one image after the other, which took about 15 minutes. <strong>Second</strong>, the build cache grew to 7.6 GB on the very disk that held Postgres, and one deploy died halfway with <code>no space left on device</code> while <code>next build</code> was writing. <strong>Third</strong>, after moving builds to a home machine, a script built the wrong Dockerfile: an Alpine (musl) base carrying a Prisma engine compiled for glibc. The build was green, the push was green, the swap was green — and the API restarted forever and answered 502 for seven minutes. A green build does not prove the image runs; that project now checks the libc ↔ engine pair before pushing.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Do not build on the production host</span><span class="v">A build competes for CPU and memory with the running site, and it fills the disk with cache. On a 6GB VPS, parallel frontend and backend builds have been OOM-killed here; on the same machine, build cache once grew to 7.6GB on the disk holding Postgres.</span></div>
  <div class="kv"><span class="k">Build on a machine with headroom</span><span class="v">A developer machine or a CI runner. This project builds both images in parallel at home in 3–6 minutes; the same builds took ~15 minutes sequentially on the VPS, and had to be sequential to avoid the OOM.</span></div>
  <div class="kv"><span class="k">Push to a registry, pull on the server</span><span class="v">The server then does one thing: <code>pull</code> and swap. Seconds instead of minutes, no build cache on the production disk, and the artifact is identical to the one you tested.</span></div>
  <div class="kv"><span class="k">Only committed code goes out</span><span class="v">Building from a git push rather than rsyncing a working tree means a half-edited file cannot reach production — a real failure mode when two people work on the same machine.</span></div>
  <div class="kv"><span class="k">Tag by commit, never <code>:latest</code></span><span class="v"><code>ghcr.io/me/api:9f2ac1e</code> makes "what is running?" a fact you can check, and makes rollback a matter of naming the previous tag.</span></div>
</div>
<pre><code><span class="tok-comment"># .github/workflows/deploy.yml — the shape, not the whole file</span>
on:
  workflow_dispatch:            <span class="tok-comment"># MANUAL. See the pitfall below.</span>
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with: { registry: ghcr.io, username: &#36;{{ github.actor }}, password: &#36;{{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v7
        with:
          file: Dockerfile.backend
          tags: ghcr.io/&#36;{{ github.repository }}/api:&#36;{{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          push: true
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: &#36;{{ secrets.VPS_HOST }}
          username: &#36;{{ secrets.VPS_USER }}
          key: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            cd /home/deployer/repo
            export TAG=&#36;{{ github.sha }}
            docker compose -f compose.yaml -f compose.prod.yaml pull
            docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
            ./ops/smoke-test.sh</code></pre>
<div class="callout warn"><strong>Do not make deploying a side effect of <code>git push</code>.</strong> This repository ran two deploy workflows on every push to <code>main</code> and they raced each other into real outages twice: once a feed returning 500 because the schema lagged the image, once a backend recreate race leaving <code>Exited(137)</code> and orphan containers. Both workflows are now <code>workflow_dispatch</code> only, and deploying is a script a person runs. Pushing code and changing production are different decisions; keep them separate, and if you do wire them together, add a <code>concurrency</code> group so two deploys can never overlap.</div>

<h3>A deploy workflow you can copy — started by hand, one at a time</h3>
${slide('dk-11', 22, 'Deploy là một script NGƯỜI chạy — không phải hệ quả của git push')}
<p>The workflow above is "the shape". Here is a complete version with the two lessons of that project built in: it only starts when a person clicks <em>Run workflow</em>, and a <code>concurrency</code> group makes a second run wait instead of racing the first. It is written for learning and was not run on GitHub for this course; the action versions are the current major releases as of 09/2026. The GitHub Actions course on this site explains every line of Actions itself, and the Deploy to VPS course covers the server side (users, SSH keys, firewall).</p>
<pre><code class="language-yaml"># .github/workflows/deploy.yml
name: deploy
on:
  workflow_dispatch:                 <span class="tok-comment"># only by hand: Actions → deploy → Run workflow</span>
concurrency:
  group: deploy-production           <span class="tok-comment"># one deploy at a time…</span>
  cancel-in-progress: false          <span class="tok-comment"># …and a second one waits, it does not kill the first</span>
permissions:
  contents: read
  packages: write                    <span class="tok-comment"># allows pushing to ghcr.io with GITHUB_TOKEN</span>
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with: { registry: ghcr.io, username: &#36;{{ github.actor }}, password: &#36;{{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v7
        with:
          file: Dockerfile.backend
          tags: ghcr.io/&#36;{{ github.repository }}/api:&#36;{{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          push: true
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production          <span class="tok-comment"># optional: require a reviewer's approval</span>
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: &#36;{{ secrets.VPS_HOST }}
          username: &#36;{{ secrets.VPS_USER }}
          key: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            set -e
            cd /home/deployer/repo
            PREV=$(cat .deployed-tag 2&gt;/dev/null || echo none)
            export TAG=&#36;{{ github.sha }}
            docker compose -f compose.yaml -f compose.prod.yaml pull api
            if docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build --wait --wait-timeout 90 api; then
              echo "$TAG" &gt; .deployed-tag
            else
              echo "unhealthy — rolling back to $PREV"
              TAG=$PREV docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api
              exit 1
            fi</code></pre>
<table>
<tr><th>Piece</th><th>Why it is there</th></tr>
<tr><td><code>workflow_dispatch</code></td><td>No <code>push:</code> trigger. Pushing code and changing production stay two separate decisions.</td></tr>
<tr><td><code>concurrency</code> + <code>cancel-in-progress: false</code></td><td>The fix for the race: a second run queues. Cancelling a deploy half-way would be worse than waiting.</td></tr>
<tr><td><code>permissions: packages: write</code></td><td>The built-in <code>GITHUB_TOKEN</code> may push images to GHCR only if the workflow asks for it.</td></tr>
<tr><td><code>tags: …:&#36;{{ github.sha }}</code></td><td>Every image is named after its commit — never <code>:latest</code>.</td></tr>
<tr><td><code>cache-from/cache-to: type=gha</code></td><td>BuildKit keeps its layer cache in GitHub's cache, so the next build reuses unchanged layers.</td></tr>
<tr><td><code>pull</code> then <code>up -d --no-build</code></td><td>The server never builds: it downloads the tested image and swaps.</td></tr>
<tr><td><code>--wait --wait-timeout 90</code></td><td>Block until healthchecks pass; on failure return non-zero (next section) so the script can roll back.</td></tr>
<tr><td><code>.deployed-tag</code></td><td>A one-line record of what is live — the answer to "what do we roll back to?".</td></tr>
</table>

<h3>Run it step by step: tag by commit, ship a broken version, roll back</h3>
${slide('dk-11', 23, 'Tag theo commit ⇒ biết đang chạy bản nào, quay lui là một lệnh')}
<p>The same small API, three commits. v3 is deliberately broken: it answers every request with HTTP 500, like a release whose code expects a schema the database does not have.</p>
<pre><code class="language-bash">git log --oneline
TAG=5b502fc docker compose up -d ; sleep 3 ; curl -s -w '%{http_code}\\n' localhost:18110
docker images api --format 'table {{.Repository}}:{{.Tag}}\\t{{.ID}}\\t{{.CreatedSince}}'
TAG=e76553c docker compose up -d --no-build api ; sleep 3 ; curl -s localhost:18110
docker compose ps --format 'table {{.Service}}\\t{{.Image}}\\t{{.Status}}'</code></pre>
<div class="out">5b502fc api v3
e76553c api v2
5a06493 api v1
{"error":"schema mismatch"}
500
REPOSITORY:TAG     IMAGE ID       CREATED
api:5b502fc        3d6c00cdb484   4 seconds ago
api:e76553c        8a1b48ee6730   40 seconds ago
api:5a06493        e3ad108a96d5   41 seconds ago
 Container blog-api-1 Recreate
 Container blog-api-1 Recreated
 Container blog-api-1 Starting
 Container blog-api-1 Started
{"version":"v2"}
SERVICE   IMAGE         STATUS
api       api:e76553c   Up 3 seconds</div>
<p>Real output from a Mac (names shortened from <code>dk11-api</code>/<code>dk11-blog</code>). The rollback command itself took 0.35 s; the service was answering again after its own 2-second start. Nothing had to be rebuilt, and nothing had to be guessed: the previous version has a name.</p>

<h3>Let the deploy notice a broken release: up --wait</h3>
${slide('dk-11', 24, 'up -d --wait bắt ảnh hỏng NGAY lúc deploy (exit 1)')}
<p>Plain <code>up -d</code> returned 0 for the broken v3 above — it only reports that the container <em>started</em>. Add a healthcheck and <code>--wait</code>, and compose waits until the container is healthy, or fails:</p>
<pre><code class="language-yaml">    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/"]   <span class="tok-comment"># busybox wget exists in node:22-alpine</span>
      interval: 2s
      timeout: 2s
      retries: 3
      start_period: 10s</code></pre>
<pre><code class="language-bash">TAG=e76553c docker compose up -d --wait
TAG=5b502fc docker compose up -d --wait --wait-timeout 20 ; echo "exit=$?"
docker inspect -f '{{.State.Health.Status}} {{(index .State.Health.Log 0).Output}}' blog-api-1</code></pre>
<div class="out"> Container blog-api-1 Waiting
 Container blog-api-1 Healthy
 Container blog-api-1 Waiting
container blog-api-1 is unhealthy
exit=1
unhealthy wget: server returned error: HTTP/1.1 500 Internal Server Error</div>
<p>Real output from a Mac: the good version became healthy in 6 seconds; the broken one was reported unhealthy after 14 seconds and the command exited with 1. That exit code is what turns "we found out from users" into "the script rolled back by itself": <code>TAG=$NEW docker compose up -d --wait || TAG=$PREV docker compose up -d --no-build --wait</code>. One limit to know: <code>--wait</code> catches a release that is broken <em>on start</em>. A bug that appears only for some requests needs the smoke test and the monitoring of Lesson 11.5.</p>

<h3>Rolling back in forty seconds</h3>
${slide('dk-11', 25, 'Có migration thì quay lui KHÔNG còn là một lệnh')}
<pre><code><span class="tok-comment"># The best case: the previous image is still on the host</span>
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.CreatedSince}}' | grep api | head -3
TAG=&lt;previous-sha&gt; docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api
curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com/api/v1/health</code></pre>
<div class="out">ghcr.io/me/api:9f2ac1e	14 minutes ago
ghcr.io/me/api:3b81e77	2 days ago
[+] Running 1/1
 ✔ Container blog-api-1  Recreated                          4.1s
200</div>
<pre><code><span class="tok-comment"># If the swap landed a dead image, the old one is often still there as a dangling layer</span>
docker images -a --filter dangling=true --format '{{.ID}}\\t{{.Size}}' | head -3
docker tag &lt;id&gt; ghcr.io/me/api:rollback
TAG=rollback docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api</code></pre>
<div class="out">7f3a2b1c9d8e	214MB
a91c4e7b2f60	213MB</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Code-only change</span><span class="lz-t">re-deploy the previous tag</span><span class="lz-d">Forty seconds, no data involved, no thinking required. This is why tagging by commit matters.</span></div>
  <div class="lz-step"><span class="lz-k">Change that included a migration</span><span class="lz-t">STOP — reverting code does not revert the database</span><span class="lz-d">The old code may not run against the new schema. Talk it through before acting; a down-migration is a separate, deliberate decision (Lesson 12.4).</span></div>
  <div class="lz-step"><span class="lz-k">Reverting in git</span><span class="lz-t">git revert &lt;sha&gt;, then deploy normally</span><span class="lz-d">The durable fix once the emergency is handled. Never <code>push --force</code> to undo a deploy — you lose the record of what happened.</span></div>
  <div class="lz-step"><span class="lz-k">Afterwards: why did it reach production?</span><span class="lz-t">the missing check is the real finding</span><span class="lz-d">A rollback is a symptom. The output of an incident is one new check — a test, a smoke-test route, a build-time assertion — not just a restored service.</span></div>
</div>
<div class="callout warn"><strong>Do not count on the dangling image on Docker 29.</strong> The second recipe above — find the old image as <code>&lt;none&gt;</code> and <code>docker tag</code> it — works on engines that use the classic <code>overlay2</code> image store, where an image that loses its tag stays behind as dangling. On a fresh Docker 29 install (containerd image store, both the course's Mac and Linux machine) we rebuilt <code>api:latest</code> over an older <code>api:latest</code>, even while a container was still using the old one, and <code>docker images -a --filter dangling=true</code> listed nothing: the old image is gone as soon as nothing references it. Check which store your server uses (<code>docker info -f '{{.DriverStatus}}'</code> shows <code>io.containerd.snapshotter.v1</code> for the new one), and keep the commit tags of the last two or three releases instead of hoping for an orphan.</div>
<p><strong>The migration rule that keeps rollback cheap.</strong> Make every schema change <em>expand, then contract</em>: this release only adds (a new nullable column, a new table), and the release after removes what the old code needed. Then the previous image still runs against the new schema, and rolling back remains the forty-second command above instead of a decision to take with a database dump in hand.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team deploys the booking API every evening. Last Friday a release answered 500 to everything and nobody noticed for an hour, and nobody knew which image to go back to. Build the safe version of that deploy in <code>~/thu-docker/thu-api</code>.</p><ol>
<li>Create <code>server.js</code>, a <code>Dockerfile</code> (<code>FROM node:22-alpine</code>, <code>COPY server.js .</code>, <code>ARG APP_VERSION</code>, <code>ENV APP_VERSION=$APP_VERSION</code>, <code>CMD ["node","server.js"]</code>) and the <code>compose.yaml</code> from this lesson with the healthcheck. <code>git init</code> and commit.</li>
<li>Build one image per commit: <code>docker build -t api:$(git rev-parse --short HEAD) --build-arg APP_VERSION=v1 .</code>; make a second commit and build it with <code>APP_VERSION=v2</code>. Deploy v1 with <code>TAG=&lt;sha1&gt; docker compose up -d --wait</code>.</li>
<li>Measure the gap: start <code>./probe.sh 12 &amp;</code>, then deploy v2 with <code>TAG=&lt;sha2&gt; docker compose up -d</code>. Write down the error count.</li>
<li>Ship a broken release: commit a third version whose handler returns <code>res.statusCode = 500</code>, build it, and deploy with <code>TAG=&lt;sha3&gt; docker compose up -d --wait --wait-timeout 20 || TAG=&lt;sha2&gt; docker compose up -d --no-build --wait</code>.</li>
<li>Clean up: <code>docker compose down</code> and <code>docker rmi</code> the three <code>api:&lt;sha&gt;</code> images.</li></ol>
<p><strong>Done when:</strong> the probe reports a small, non-zero number of errors during the v1 → v2 swap (about the start-up time of your API), the broken deploy prints <code>is unhealthy</code> and the fallback brings <code>curl localhost:18110</code> back to <code>{"version":"v2"}</code>, and <code>docker compose ps</code> shows the v2 commit tag as the running image.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Recreate</span><span class="v">What <code>up -d</code> does to a changed service: stop and remove the old container, create and start a new one.</span></div>
  <div class="kv"><span class="k">Graceful shutdown</span><span class="v">On SIGTERM, stop accepting new work, finish what is in flight, close connections and exit 0.</span></div>
  <div class="kv"><span class="k">stop_grace_period</span><span class="v">How long compose waits after SIGTERM before sending SIGKILL (default 10 s).</span></div>
  <div class="kv"><span class="k">Registry</span><span class="v">A server that stores images (GHCR, Docker Hub); built somewhere, pulled on the server.</span></div>
  <div class="kv"><span class="k">Immutable tag</span><span class="v">A tag that always means the same image — the git commit SHA — unlike <code>:latest</code>.</span></div>
  <div class="kv"><span class="k">Rollback</span><span class="v">Running the previous release again: <code>TAG=&lt;previous sha&gt; docker compose up -d --no-build</code>.</span></div>
  <div class="kv"><span class="k">concurrency (GitHub Actions)</span><span class="v">A group name that allows only one run at a time; others queue or are cancelled.</span></div>
  <div class="kv"><span class="k">Expand / contract migration</span><span class="v">Add first, remove one release later, so old and new code both work with the schema.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>up -d</code> recreates changed services, and the gap equals the new container's start-up time — measured: 26 failed requests over 2.2 s for an API that takes 2 s to start.</li>
<li>Handle SIGTERM and set <code>stop_grace_period</code> above your own shutdown cap: the measured stop took 213 ms instead of 10 s.</li>
<li>Build on a machine with headroom and let the server only pull and swap; building on a 6 GB VPS caused an exit 137 and a disk full of build cache in one real project.</li>
<li>Deploying is a deliberate, one-at-a-time act: <code>workflow_dispatch</code> plus a <code>concurrency</code> group, never a side effect of <code>git push</code>.</li>
<li>Tag images by commit and roll back with <code>TAG=&lt;previous sha&gt; up -d --no-build</code>; on Docker 29 do not rely on dangling images.</li>
<li><code>up -d --wait</code> exits 1 when the new release is unhealthy, which is what lets a script roll back automatically; a release with a migration needs expand/contract to stay rollback-able.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/up/" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">docker compose up — the flags that matter</span><span class="lc-sub"><code>--no-build</code>, <code>--force-recreate</code>, <code>--no-deps</code>, <code>--wait</code> and <code>--wait-timeout</code>. <code>--wait</code> in particular makes a deploy script block until healthchecks pass.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/using-jobs/using-concurrency" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions — concurrency</span><span class="lc-sub">How to guarantee two deploys never run at once, and the difference between queuing and cancelling in-progress runs. The fix for the race described above.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/ci/github-actions/cache/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Build cache in GitHub Actions</span><span class="lc-sub"><code>type=gha</code>, registry cache and the <code>mode=max</code> distinction that decides whether intermediate stages are cached — the difference between a two-minute and an eleven-minute CI build.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: deploy and undo</span><span class="lc-sub">Graded exercises: add graceful shutdown and measure the difference, write the two commands a rollback needs, and explain why a deploy that included a migration cannot be rolled back the same way.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> deploying with a moving tag like <code>:latest</code> and no record of what is running. When something breaks you cannot answer the first question — "what changed?" — because the tag pointed at one image an hour ago and another one now, and <code>docker images</code> only shows you the current meaning. Rollback becomes archaeology: you are digging through registry timestamps trying to identify an image you have no name for. Tag every image with the commit SHA, keep the tag in the deploy log, and put the running version somewhere the application itself reports — a <code>/health</code> response that includes it costs one line and turns "which version is live?" into a <code>curl</code>. Then a rollback is one command with a name you already have.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>up -d</code> recreates changed containers, which means a gap: handle SIGTERM, drain in-flight requests, and set <code>stop_grace_period</code> longer than your own timeout. Build on a machine with headroom and let the server only <code>pull</code> and swap — a build on the production host competes for memory and fills the disk that holds your database. And tag by commit SHA so "what is running" is checkable and a rollback is one command, remembering that a deploy containing a migration cannot be undone by re-deploying the old image.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Cập nhật, CI/CD, và quay lui</h2>
<p class="lead">Deploy là chỗ một stack đang chạy ngon va vào đúng thứ mà container không cho không: TÍNH LIÊN TỤC. <code>docker compose up -d</code> dựng lại những container đã đổi, và dựng lại nghĩa là dừng một cái rồi khởi động một cái khác — một khoảng trống. Bài này nói về việc làm cho khoảng trống đó nhỏ lại, làm cho nó an toàn, và có thể hoàn tác nó trong chưa tới một phút.</p>

<h3>Chuyện gì thật sự xảy ra khi cập nhật</h3>
${slide('dk-11', 19, 'up -d tráo container = một khoảng trống: đo được 2,2 giây lỗi')}
<pre><code>docker compose up -d 2&gt;&amp;1 | tail -4</code></pre>
<div class="out">[+] Running 3/3
 ✔ Container blog-api-1  Recreated                          10.4s
 ✔ Container blog-web-1  Running                             0.0s
 ✔ Container blog-db-1   Running                             0.0s</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Compose SO SÁNH, không phải khởi động lại tất</span><span class="lz-t">dịch vụ không đổi ghi "Running", không phải "Recreated"</span><span class="lz-d">Chỉ những container có ảnh, môi trường, phép gắn hay cấu hình khác đi mới bị đụng tới. Đó là lý do <code>up -d</code> chạy lại nhiều lần vẫn an toàn và vì sao một lượt deploy API không làm phiền cơ sở dữ liệu.</span></div>
  <div class="lz-step"><span class="lz-k">2 · SIGTERM tới container cũ</span><span class="lz-t">rồi một khoảng ân hạn, rồi SIGKILL</span><span class="lz-d">Ân hạn mặc định là 10 giây. Một tiến trình phớt lờ SIGTERM sẽ bị giết, làm rơi mọi yêu cầu đang dở. Đây là chỗ phần lớn những báo cáo "deploy gây lỗi" bắt nguồn.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Container mới khởi động</span><span class="lz-t">và lập tức nằm trên đường nhận tải</span><span class="lz-d">Giữa lúc cái cũ dừng và cái mới sẵn sàng, các yêu cầu thất bại. Mười giây trả 502 cho mỗi lượt deploy, trừ khi bạn làm gì đó về chuyện này.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Khoảng trống đó chính là toàn bộ vấn đề</span><span class="lz-t">và có hai câu trả lời trung thực</span><span class="lz-d">Hoặc chấp nhận vài giây và deploy lúc vắng, hoặc chạy hai bản sao sau proxy rồi tráo từng cái một. Giả vờ rằng khoảng trống đó không tồn tại thì không nằm trong hai câu ấy.</span></div>
</div>

<h3>Chạy thử từng bước: đo khoảng trống trên chính máy bạn</h3>
<p>"Vài giây lỗi" chỉ là phỏng đoán cho tới khi bạn đếm. Thí nghiệm dưới đây cần một API tí hon trả <code>{"version":"v1"}</code> và, giống một API thật phải nối cơ sở dữ liệu trước, chờ hai giây rồi mới nghe cổng. Hai ảnh của nó được dựng và gắn tag bằng commit git (các mục sau giải thích vì sao), và một script thăm dò gọi nó mỗi 50 ms trong lúc compose tráo cái này sang cái kia.</p>
<pre><code class="language-javascript">// server.js
const http = require('http');
const V = process.env.APP_VERSION || 'dev';
const server = http.createServer((req, res) =&gt; res.end(JSON.stringify({ version: V }) + '\\n'));
setTimeout(() =&gt; server.listen(3000, () =&gt; console.log('api ' + V + ' listening')), 2000);  <span class="tok-comment">// "nối CSDL" trước đã</span>
process.on('SIGTERM', () =&gt; { console.log('SIGTERM: draining'); server.close(() =&gt; process.exit(0)); });</code></pre>
<pre><code class="language-yaml"># compose.yaml
name: blog
services:
  api:
    image: api:&#36;{TAG:-v1}         <span class="tok-comment"># ảnh nào chạy do biến TAG quyết định</span>
    ports: ["18110:3000"]
    restart: unless-stopped
    stop_grace_period: 30s</code></pre>
<pre><code class="language-bash">#!/bin/bash
# probe.sh — gọi API mỗi 50ms trong N giây, đếm mã HTTP
end=$((SECONDS+$1)); ok=0; fail=0; first=""; last=""
while [ $SECONDS -lt $end ]; do
  r=$(curl -s -m 1 -w ' %{http_code}' localhost:18110 2&gt;/dev/null); code=&#36;{r##* }
  if [ "$code" = "200" ]; then ok=$((ok+1)); else fail=$((fail+1)); [ -z "$first" ] &amp;&amp; first=$(date +%T.%N | cut -c1-12); last=$(date +%T.%N | cut -c1-12); fi
  sleep 0.05
done
echo "200: $ok  lỗi: $fail  (lỗi đầu $first, lỗi cuối $last)"</code></pre>
<pre><code class="language-bash">TAG=5a06493 docker compose up -d          <span class="tok-comment"># v1 đang chạy</span>
./probe.sh 12 &amp;                           <span class="tok-comment"># bắt đầu đếm</span>
sleep 2 ; TAG=e76553c docker compose up -d  <span class="tok-comment"># deploy v2 giữa chừng</span></code></pre>
<div class="out"> Container blog-api-1 Recreate
 Container blog-api-1 Recreated
 Container blog-api-1 Starting
 Container blog-api-1 Started
200: 111  lỗi: 26  (lỗi đầu 02:22:09.783, lỗi cuối 02:22:11.954)</div>
<p>Output thật trên Mac (tên container rút gọn từ <code>dk11-blog-api-1</code>; <code>date +%N</code> cần GNU date hoặc macOS đời mới). Bản thân <code>up -d</code> trả về sau 0,34 giây, vậy mà 26 request lỗi trải trên 2,2 giây: container cũ dừng trong khoảng 0,2 giây, rồi container mới mất 2 giây "nối cơ sở dữ liệu" trong lúc cổng từ chối kết nối. Khoảng trống không nằm ở lúc dừng — nó là thời gian container <em>MỚI</em> cần để trả lời được. Một API thật chạy migration Prisma hay làm nóng bộ đệm lúc khởi động sẽ có khoảng trống lớn hơn, và đó là con số cần đo trước khi hứa với ai "không gián đoạn".</p>

<h3>Tắt máy tử tế, và khoảng trống co lại</h3>
${slide('dk-11', 20, 'Bắt SIGTERM + stop_grace_period ⇒ dừng trong 0,2 giây, không rơi request')}
<pre><code><span class="tok-comment">// Xử lý đúng cái tín hiệu Docker thật sự gửi</span>
const server = app.listen(3000);
const shutdown = async (sig) =&gt; {
  console.log(&#96;&#36;{sig}: draining&#96;);
  server.close(async () =&gt; {                <span class="tok-comment">// ngừng nhận mới, làm nốt việc đang dở</span>
    await prisma.\$disconnect();
    await redis.quit();
    process.exit(0);
  });
  setTimeout(() =&gt; process.exit(1), 25_000).unref();   <span class="tok-comment">// trần cứng</span>
};
process.on('SIGTERM', () =&gt; shutdown('SIGTERM'));
process.on('SIGINT',  () =&gt; shutdown('SIGINT'));</code></pre>
<pre><code>services:
  api:
    stop_grace_period: 30s        <span class="tok-comment"># dài hơn cái trần 25s của chính ứng dụng</span>
    stop_signal: SIGTERM</code></pre>
<pre><code>docker compose stop api &amp;&amp; docker compose logs --tail 3 api</code></pre>
<div class="out">blog-api-1  | SIGTERM: draining
blog-api-1  | 3 requests in flight, waiting
blog-api-1  | closed cleanly in 412ms</div>
<div class="callout ok"><strong>412ms thay vì 10 giây, và không rơi yêu cầu nào.</strong> Các mảnh ghép đều nhỏ: bắt SIGTERM, ngừng nhận kết nối mới, để việc đang dở làm nốt, đóng bể kết nối cơ sở dữ liệu, thoát 0. Và nhớ chuyện PID 1 — nếu tiến trình của bạn không phải PID 1 hoặc không cài bộ xử lý tín hiệu thì tín hiệu ấy rơi vào hư không, và đó là thứ <code>tini</code> với <code>init: true</code> chữa (Bài 1.3).</div>
<p>Đo bằng API nhỏ ở mục trên, thứ có đúng bộ xử lý này: <code>docker compose stop api</code> mất <strong>213 ms</strong> từ lúc gõ lệnh tới "Stopped", và log ghi <code>SIGTERM: draining</code> rồi <code>closed cleanly in 0ms</code> (không có request nào đang dở). Không có bộ xử lý thì cũng lệnh stop đó chờ hết 10 giây ân hạn rồi kết thúc bằng SIGKILL, exit 137 — Bài 1.3 đo được 10,17 giây cho một tiến trình Node phớt lờ SIGTERM.</p>

<h3>Dựng ở nơi khác, tráo ở đây</h3>
${slide('dk-11', 21, 'Dựng ở máy khác, VPS chỉ kéo về và tráo — ba sự cố thật khi dựng trên VPS')}
<p>Ba sự cố thật của một dự án sinh viên chạy trên VPS 6 GB giải thích mục này rõ hơn mọi quy tắc. <strong>Thứ nhất</strong>, dựng song song ảnh frontend và backend ngay trên máy chủ đã khiến <code>next build</code> bị giết với exit 137 — đúng cú OOM của Bài 11.2, chỉ là xảy ra lúc dựng, nên lượt deploy đơn giản là hỏng; cách chữa khi đó là dựng lần lượt từng ảnh, mất khoảng 15 phút. <strong>Thứ hai</strong>, cache dựng phình tới 7,6 GB trên chính cái đĩa chứa Postgres, và một lượt deploy chết giữa chừng với <code>no space left on device</code> trong lúc <code>next build</code> đang ghi. <strong>Thứ ba</strong>, sau khi chuyển việc dựng về máy nhà, một script dựng nhầm Dockerfile: ảnh nền Alpine (musl) mang engine Prisma biên dịch cho glibc. Dựng xanh, đẩy xanh, tráo xanh — rồi API khởi động lại vô tận và trả 502 suốt bảy phút. Dựng xanh không chứng minh ảnh chạy được; dự án đó giờ kiểm cặp libc ↔ engine trước khi đẩy.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đừng dựng trên máy chủ production</span><span class="v">Một lượt dựng tranh CPU và bộ nhớ với chính trang web đang chạy, và nó làm đầy đĩa bằng cache. Trên một con VPS 6GB, dựng song song frontend với backend đã bị OOM giết ở đây; cũng trên cái máy đó, cache dựng từng phình lên 7,6GB trên đúng cái đĩa chứa Postgres.</span></div>
  <div class="kv"><span class="k">Dựng trên một cái máy còn chỗ thở</span><span class="v">Máy của lập trình viên hoặc một runner CI. Dự án này dựng cả hai ảnh song song ở nhà trong 3–6 phút; cũng những lượt dựng ấy mất khoảng 15 phút khi chạy tuần tự trên VPS, và buộc phải tuần tự để tránh OOM.</span></div>
  <div class="kv"><span class="k">Đẩy lên registry, kéo về ở máy chủ</span><span class="v">Máy chủ khi ấy chỉ làm một việc: <code>pull</code> rồi tráo. Vài giây thay vì vài phút, không có cache dựng trên đĩa production, và hiện vật đúng bằng cái bạn đã kiểm.</span></div>
  <div class="kv"><span class="k">Chỉ mã đã COMMIT mới đi ra</span><span class="v">Dựng từ một lệnh git push chứ không phải rsync cây làm việc nghĩa là một file sửa dở không thể lên tới production — một kiểu hỏng có thật khi hai người cùng làm trên một cái máy.</span></div>
  <div class="kv"><span class="k">Gắn nhãn theo commit, đừng bao giờ <code>:latest</code></span><span class="v"><code>ghcr.io/me/api:9f2ac1e</code> biến câu "cái gì đang chạy?" thành một sự thật kiểm được, và biến quay lui thành chuyện gọi tên cái nhãn trước đó.</span></div>
</div>
<pre><code><span class="tok-comment"># .github/workflows/deploy.yml — cái hình dạng, không phải cả file</span>
on:
  workflow_dispatch:            <span class="tok-comment"># CHẠY TAY. Xem phần bẫy bên dưới.</span>
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with: { registry: ghcr.io, username: &#36;{{ github.actor }}, password: &#36;{{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v7
        with:
          file: Dockerfile.backend
          tags: ghcr.io/&#36;{{ github.repository }}/api:&#36;{{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          push: true
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: &#36;{{ secrets.VPS_HOST }}
          username: &#36;{{ secrets.VPS_USER }}
          key: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            cd /home/deployer/repo
            export TAG=&#36;{{ github.sha }}
            docker compose -f compose.yaml -f compose.prod.yaml pull
            docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
            ./ops/smoke-test.sh</code></pre>
<div class="callout warn"><strong>Đừng biến việc deploy thành hệ quả phụ của một lệnh <code>git push</code>.</strong> Kho này từng chạy hai workflow deploy ở mọi lần push vào <code>main</code> và chúng đua nhau tới hai sự cố thật: một lần feed trả 500 vì schema chạy sau cái ảnh, một lần backend đua nhau dựng lại để lại <code>Exited(137)</code> cùng container mồ côi. Giờ cả hai workflow chỉ còn <code>workflow_dispatch</code>, và deploy là một script do một CON NGƯỜI chạy. Đẩy mã lên và thay đổi production là hai quyết định khác nhau; hãy giữ chúng tách bạch, và nếu bạn có nối chúng lại thì hãy thêm một nhóm <code>concurrency</code> để hai lượt deploy không bao giờ chồng lên nhau.</div>

<h3>Một workflow deploy chép được — chạy bằng tay, mỗi lần một lượt</h3>
${slide('dk-11', 22, 'Deploy là một script NGƯỜI chạy — không phải hệ quả của git push')}
<p>Workflow ở trên chỉ là "cái hình dạng". Đây là bản đầy đủ đã gài sẵn hai bài học của dự án kia: nó chỉ chạy khi một người bấm <em>Run workflow</em>, và một nhóm <code>concurrency</code> bắt lượt thứ hai phải chờ chứ không đua với lượt đầu. Nó được viết để học và KHÔNG chạy thật lên GitHub trong khoá này; phiên bản các action là bản lớn mới nhất tính đến 09/2026. Khoá GitHub Actions trên trang này giải thích từng dòng của chính Actions, còn khoá Deploy lên VPS lo phía máy chủ (người dùng, khoá SSH, tường lửa).</p>
<pre><code class="language-yaml"># .github/workflows/deploy.yml
name: deploy
on:
  workflow_dispatch:                 <span class="tok-comment"># chỉ chạy tay: Actions → deploy → Run workflow</span>
concurrency:
  group: deploy-production           <span class="tok-comment"># mỗi lúc một lượt deploy…</span>
  cancel-in-progress: false          <span class="tok-comment"># …lượt thứ hai chờ, không giết lượt đầu</span>
permissions:
  contents: read
  packages: write                    <span class="tok-comment"># cho GITHUB_TOKEN đẩy ảnh lên ghcr.io</span>
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        with: { registry: ghcr.io, username: &#36;{{ github.actor }}, password: &#36;{{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v7
        with:
          file: Dockerfile.backend
          tags: ghcr.io/&#36;{{ github.repository }}/api:&#36;{{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          push: true
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production          <span class="tok-comment"># tuỳ chọn: bắt một người duyệt trước</span>
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: &#36;{{ secrets.VPS_HOST }}
          username: &#36;{{ secrets.VPS_USER }}
          key: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            set -e
            cd /home/deployer/repo
            PREV=$(cat .deployed-tag 2&gt;/dev/null || echo none)
            export TAG=&#36;{{ github.sha }}
            docker compose -f compose.yaml -f compose.prod.yaml pull api
            if docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build --wait --wait-timeout 90 api; then
              echo "$TAG" &gt; .deployed-tag
            else
              echo "unhealthy — rolling back to $PREV"
              TAG=$PREV docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api
              exit 1
            fi</code></pre>
<table>
<tr><th>Mảnh</th><th>Vì sao có nó</th></tr>
<tr><td><code>workflow_dispatch</code></td><td>Không có trigger <code>push:</code>. Đẩy mã và đổi production vẫn là hai quyết định riêng.</td></tr>
<tr><td><code>concurrency</code> + <code>cancel-in-progress: false</code></td><td>Cách chữa cuộc đua: lượt thứ hai xếp hàng. Huỷ một lượt deploy giữa chừng còn tệ hơn phải chờ.</td></tr>
<tr><td><code>permissions: packages: write</code></td><td><code>GITHUB_TOKEN</code> có sẵn chỉ được đẩy ảnh lên GHCR khi workflow xin quyền này.</td></tr>
<tr><td><code>tags: …:&#36;{{ github.sha }}</code></td><td>Mỗi ảnh mang tên commit của nó — không bao giờ <code>:latest</code>.</td></tr>
<tr><td><code>cache-from/cache-to: type=gha</code></td><td>BuildKit giữ cache tầng trong bộ đệm của GitHub, lượt dựng sau dùng lại tầng không đổi.</td></tr>
<tr><td><code>pull</code> rồi <code>up -d --no-build</code></td><td>Máy chủ không bao giờ dựng: nó tải ảnh đã kiểm về rồi tráo.</td></tr>
<tr><td><code>--wait --wait-timeout 90</code></td><td>Chặn tới khi healthcheck qua; hỏng thì trả mã khác 0 (mục sau) để script quay lui.</td></tr>
<tr><td><code>.deployed-tag</code></td><td>Một dòng ghi bản đang chạy — câu trả lời cho "quay lui về đâu?".</td></tr>
</table>

<h3>Chạy thử từng bước: tag theo commit, đưa lên một bản hỏng, rồi quay lui</h3>
${slide('dk-11', 23, 'Tag theo commit ⇒ biết đang chạy bản nào, quay lui là một lệnh')}
<p>Vẫn API nhỏ đó, ba commit. v3 cố tình hỏng: trả HTTP 500 cho mọi request, giống một bản phát hành mà mã chờ một schema cơ sở dữ liệu chưa có.</p>
<pre><code class="language-bash">git log --oneline
TAG=5b502fc docker compose up -d ; sleep 3 ; curl -s -w '%{http_code}\\n' localhost:18110
docker images api --format 'table {{.Repository}}:{{.Tag}}\\t{{.ID}}\\t{{.CreatedSince}}'
TAG=e76553c docker compose up -d --no-build api ; sleep 3 ; curl -s localhost:18110
docker compose ps --format 'table {{.Service}}\\t{{.Image}}\\t{{.Status}}'</code></pre>
<div class="out">5b502fc api v3
e76553c api v2
5a06493 api v1
{"error":"schema mismatch"}
500
REPOSITORY:TAG     IMAGE ID       CREATED
api:5b502fc        3d6c00cdb484   4 seconds ago
api:e76553c        8a1b48ee6730   40 seconds ago
api:5a06493        e3ad108a96d5   41 seconds ago
 Container blog-api-1 Recreate
 Container blog-api-1 Recreated
 Container blog-api-1 Starting
 Container blog-api-1 Started
{"version":"v2"}
SERVICE   IMAGE         STATUS
api       api:e76553c   Up 3 seconds</div>
<p>Output thật trên Mac (tên rút gọn từ <code>dk11-api</code>/<code>dk11-blog</code>). Bản thân lệnh quay lui mất 0,35 giây; dịch vụ trả lời lại sau 2 giây khởi động của chính nó. Không phải dựng lại gì, cũng không phải đoán gì: bản trước đó có tên.</p>

<h3>Để lượt deploy tự nhận ra bản hỏng: up --wait</h3>
${slide('dk-11', 24, 'up -d --wait bắt ảnh hỏng NGAY lúc deploy (exit 1)')}
<p><code>up -d</code> trơn trả 0 cho bản v3 hỏng ở trên — nó chỉ báo container đã <em>khởi động</em>. Thêm healthcheck và <code>--wait</code>, compose sẽ chờ tới khi container khoẻ, hoặc báo hỏng:</p>
<pre><code class="language-yaml">    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/"]   <span class="tok-comment"># node:22-alpine có sẵn wget của busybox</span>
      interval: 2s
      timeout: 2s
      retries: 3
      start_period: 10s</code></pre>
<pre><code class="language-bash">TAG=e76553c docker compose up -d --wait
TAG=5b502fc docker compose up -d --wait --wait-timeout 20 ; echo "exit=$?"
docker inspect -f '{{.State.Health.Status}} {{(index .State.Health.Log 0).Output}}' blog-api-1</code></pre>
<div class="out"> Container blog-api-1 Waiting
 Container blog-api-1 Healthy
 Container blog-api-1 Waiting
container blog-api-1 is unhealthy
exit=1
unhealthy wget: server returned error: HTTP/1.1 500 Internal Server Error</div>
<p>Output thật trên Mac: bản tốt khoẻ sau 6 giây; bản hỏng bị báo unhealthy sau 14 giây và lệnh thoát với mã 1. Chính mã thoát đó biến "người dùng báo mới biết" thành "script tự quay lui": <code>TAG=$NEW docker compose up -d --wait || TAG=$PREV docker compose up -d --no-build --wait</code>. Một giới hạn cần biết: <code>--wait</code> bắt được bản hỏng <em>ngay lúc khởi động</em>. Lỗi chỉ lộ ra với một số request thì cần smoke test và giám sát của Bài 11.5.</p>

<h3>Quay lui trong bốn mươi giây</h3>
${slide('dk-11', 25, 'Có migration thì quay lui KHÔNG còn là một lệnh')}
<pre><code><span class="tok-comment"># Trường hợp tốt nhất: cái ảnh trước đó vẫn còn trên máy chủ</span>
docker images --format '{{.Repository}}:{{.Tag}}\\t{{.CreatedSince}}' | grep api | head -3
TAG=&lt;sha-trước-đó&gt; docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api
curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com/api/v1/health</code></pre>
<div class="out">ghcr.io/me/api:9f2ac1e	14 minutes ago
ghcr.io/me/api:3b81e77	2 days ago
[+] Running 1/1
 ✔ Container blog-api-1  Recreated                          4.1s
200</div>
<pre><code><span class="tok-comment"># Nếu lượt tráo trúng một cái ảnh chết, ảnh cũ thường vẫn còn dạng lớp mồ côi</span>
docker images -a --filter dangling=true --format '{{.ID}}\\t{{.Size}}' | head -3
docker tag &lt;id&gt; ghcr.io/me/api:rollback
TAG=rollback docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build api</code></pre>
<div class="out">7f3a2b1c9d8e	214MB
a91c4e7b2f60	213MB</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thay đổi chỉ có mã</span><span class="lz-t">deploy lại cái nhãn trước đó</span><span class="lz-d">Bốn mươi giây, không dính tới dữ liệu, không phải suy nghĩ gì. Đây là lý do việc gắn nhãn theo commit quan trọng.</span></div>
  <div class="lz-step"><span class="lz-k">Thay đổi có kèm migration</span><span class="lz-t">DỪNG LẠI — quay lui mã KHÔNG quay lui cơ sở dữ liệu</span><span class="lz-d">Mã cũ có thể không chạy được trên schema mới. Hãy trao đổi cho rõ trước khi hành động; một migration lùi là một quyết định riêng và có chủ đích (Bài 12.4).</span></div>
  <div class="lz-step"><span class="lz-k">Quay lui trong git</span><span class="lz-t">git revert &lt;sha&gt;, rồi deploy như bình thường</span><span class="lz-d">Cách chữa bền vững sau khi tình huống khẩn cấp đã được xử lý. Đừng bao giờ <code>push --force</code> để hoàn tác một lượt deploy — bạn mất luôn bản ghi về những gì đã xảy ra.</span></div>
  <div class="lz-step"><span class="lz-k">Sau đó: vì sao nó lọt tới production?</span><span class="lz-t">cái phép kiểm còn thiếu mới là phát hiện thật</span><span class="lz-d">Một lần quay lui là một triệu chứng. Sản phẩm của một sự cố là MỘT phép kiểm mới — một bài kiểm thử, một tuyến trong chốt kiểm, một khẳng định lúc dựng — chứ không chỉ là một dịch vụ đã hồi phục.</span></div>
</div>
<div class="callout warn"><strong>Đừng trông vào ảnh mồ côi trên Docker 29.</strong> Công thức thứ hai ở trên — tìm ảnh cũ dạng <code>&lt;none&gt;</code> rồi <code>docker tag</code> nó — chạy được trên những engine dùng kho ảnh <code>overlay2</code> cổ điển, nơi một ảnh mất tag vẫn nằm lại dạng dangling. Trên một bản cài Docker 29 mới (kho ảnh containerd, cả máy Mac lẫn máy Linux của khoá) chúng tôi dựng lại <code>api:latest</code> đè lên một <code>api:latest</code> cũ, kể cả khi còn một container đang dùng bản cũ, và <code>docker images -a --filter dangling=true</code> không liệt kê gì: ảnh cũ biến mất ngay khi không còn gì tham chiếu tới nó. Hãy kiểm máy chủ của bạn dùng kho nào (<code>docker info -f '{{.DriverStatus}}'</code> hiện <code>io.containerd.snapshotter.v1</code> với kho mới), và giữ tag commit của hai ba bản gần nhất thay vì hy vọng vào một ảnh mồ côi.</div>
<p><strong>Luật migration giữ cho quay lui luôn rẻ.</strong> Mọi thay đổi schema đi theo kiểu <em>mở rộng rồi thu hẹp</em> (expand/contract): bản phát hành này chỉ THÊM (một cột mới cho phép null, một bảng mới), bản sau mới XOÁ thứ mà mã cũ cần. Khi đó ảnh trước vẫn chạy được trên schema mới, và quay lui vẫn là câu lệnh bốn mươi giây ở trên chứ không phải một quyết định phải đưa ra với bản dump cơ sở dữ liệu trong tay.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn deploy API đặt lịch mỗi tối. Thứ Sáu vừa rồi một bản phát hành trả 500 cho mọi thứ suốt một tiếng mà không ai hay, và không ai biết phải quay về ảnh nào. Dựng phiên bản an toàn của lượt deploy đó trong <code>~/thu-docker/thu-api</code>.</p><ol>
<li>Tạo <code>server.js</code>, một <code>Dockerfile</code> (<code>FROM node:22-alpine</code>, <code>COPY server.js .</code>, <code>ARG APP_VERSION</code>, <code>ENV APP_VERSION=$APP_VERSION</code>, <code>CMD ["node","server.js"]</code>) và <code>compose.yaml</code> của bài kèm healthcheck. <code>git init</code> rồi commit.</li>
<li>Dựng mỗi commit một ảnh: <code>docker build -t api:$(git rev-parse --short HEAD) --build-arg APP_VERSION=v1 .</code>; commit lần hai rồi dựng với <code>APP_VERSION=v2</code>. Deploy v1 bằng <code>TAG=&lt;sha1&gt; docker compose up -d --wait</code>.</li>
<li>Đo khoảng trống: chạy <code>./probe.sh 12 &amp;</code>, rồi deploy v2 bằng <code>TAG=&lt;sha2&gt; docker compose up -d</code>. Ghi lại số lỗi.</li>
<li>Đưa lên một bản hỏng: commit bản thứ ba mà handler đặt <code>res.statusCode = 500</code>, dựng nó, rồi deploy bằng <code>TAG=&lt;sha3&gt; docker compose up -d --wait --wait-timeout 20 || TAG=&lt;sha2&gt; docker compose up -d --no-build --wait</code>.</li>
<li>Dọn dẹp: <code>docker compose down</code> và <code>docker rmi</code> ba ảnh <code>api:&lt;sha&gt;</code>.</li></ol>
<p><strong>Đạt khi:</strong> script thăm dò báo một số lỗi nhỏ nhưng khác 0 lúc tráo v1 → v2 (xấp xỉ thời gian khởi động của API), lượt deploy hỏng in <code>is unhealthy</code> và lệnh dự phòng đưa <code>curl localhost:18110</code> về lại <code>{"version":"v2"}</code>, và <code>docker compose ps</code> cho thấy ảnh đang chạy mang tag commit của v2.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Recreate (tạo lại)</span><span class="v">Việc <code>up -d</code> làm với dịch vụ đã đổi: dừng và xoá container cũ, tạo và chạy một cái mới.</span></div>
  <div class="kv"><span class="k">Graceful shutdown (tắt tử tế)</span><span class="v">Nhận SIGTERM thì ngừng nhận việc mới, làm nốt việc đang dở, đóng kết nối rồi thoát 0.</span></div>
  <div class="kv"><span class="k">stop_grace_period (thời gian ân hạn khi dừng)</span><span class="v">Compose chờ bao lâu sau SIGTERM trước khi gửi SIGKILL (mặc định 10 giây).</span></div>
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Máy chủ lưu ảnh (GHCR, Docker Hub); dựng ở một nơi, kéo về máy chủ.</span></div>
  <div class="kv"><span class="k">Immutable tag (tag bất biến)</span><span class="v">Tag luôn trỏ tới cùng một ảnh — mã SHA của commit — khác với <code>:latest</code>.</span></div>
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Chạy lại bản phát hành trước: <code>TAG=&lt;sha trước&gt; docker compose up -d --no-build</code>.</span></div>
  <div class="kv"><span class="k">concurrency (đồng thời, GitHub Actions)</span><span class="v">Tên nhóm chỉ cho phép một lượt chạy mỗi lúc; lượt khác xếp hàng hoặc bị huỷ.</span></div>
  <div class="kv"><span class="k">Expand / contract (mở rộng / thu hẹp)</span><span class="v">Thêm trước, xoá ở bản sau, để cả mã cũ và mới đều chạy được với schema.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>up -d</code> tạo lại dịch vụ đã đổi, và khoảng trống bằng thời gian khởi động của container mới — đo được: 26 request lỗi trong 2,2 giây với một API mất 2 giây để lên.</li>
<li>Bắt SIGTERM và đặt <code>stop_grace_period</code> lớn hơn trần tắt của chính bạn: lần dừng đo được mất 213 ms thay vì 10 giây.</li>
<li>Dựng trên một máy còn chỗ thở và để máy chủ chỉ kéo về rồi tráo; dựng trên VPS 6 GB đã gây exit 137 và đĩa đầy cache trong một dự án thật.</li>
<li>Deploy là một việc có chủ đích, mỗi lần một lượt: <code>workflow_dispatch</code> cộng một nhóm <code>concurrency</code>, không bao giờ là hệ quả của <code>git push</code>.</li>
<li>Gắn tag ảnh theo commit và quay lui bằng <code>TAG=&lt;sha trước&gt; up -d --no-build</code>; trên Docker 29 đừng trông vào ảnh dangling.</li>
<li><code>up -d --wait</code> thoát 1 khi bản mới không khoẻ, nhờ đó script tự quay lui được; bản có migration cần expand/contract để vẫn quay lui được.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/reference/cli/docker/compose/up/" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">docker compose up — những cờ quan trọng</span><span class="lc-sub"><code>--no-build</code>, <code>--force-recreate</code>, <code>--no-deps</code>, <code>--wait</code> và <code>--wait-timeout</code>. Riêng <code>--wait</code> khiến một script deploy chờ tới khi healthcheck qua.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/using-jobs/using-concurrency" target="_blank" rel="noopener">
  <span class="lc-ico">🚦</span>
  <span class="lc-body"><span class="lc-title">GitHub Actions — concurrency</span><span class="lc-sub">Cách bảo đảm hai lượt deploy không bao giờ chạy cùng lúc, và khác biệt giữa xếp hàng với huỷ lượt đang chạy. Chính là cách chữa cho cuộc đua mô tả ở trên.</span></span>
</a>
<a class="link-card" href="https://docs.docker.com/build/ci/github-actions/cache/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">Cache dựng trong GitHub Actions</span><span class="lc-sub"><code>type=gha</code>, cache trên registry và phân biệt <code>mode=max</code> vốn quyết định các tầng trung gian có được lưu đệm hay không — khác biệt giữa một lượt dựng CI hai phút và mười một phút.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: deploy và hoàn tác</span><span class="lc-sub">Bài chấm điểm: thêm tắt máy tử tế rồi đo khác biệt, viết hai câu lệnh mà một lượt quay lui cần, và giải thích vì sao một lượt deploy có kèm migration không quay lui được theo cùng cách đó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> deploy bằng một cái nhãn hay đổi như <code>:latest</code> và không có bản ghi nào về thứ đang chạy. Khi có gì hỏng, bạn không trả lời nổi câu hỏi đầu tiên — "cái gì đã thay đổi?" — vì cái nhãn đó một giờ trước trỏ vào một cái ảnh và bây giờ trỏ vào cái khác, còn <code>docker images</code> chỉ cho bạn xem nghĩa hiện tại của nó. Quay lui biến thành khảo cổ: bạn ngồi đào mốc thời gian trên registry để cố nhận diện một cái ảnh mà bạn không có tên gọi. Hãy gắn nhãn mọi cái ảnh bằng mã SHA của commit, giữ cái nhãn đó trong log deploy, và để chính ứng dụng báo cáo phiên bản đang chạy — một phản hồi <code>/health</code> có kèm nó tốn một dòng và biến câu "bản nào đang sống?" thành một lệnh <code>curl</code>. Khi ấy quay lui là một câu lệnh với một cái tên bạn đã có sẵn.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>up -d</code> dựng lại những container đã đổi, nghĩa là có một khoảng trống: hãy bắt SIGTERM, rút cạn các yêu cầu đang dở, và đặt <code>stop_grace_period</code> dài hơn thời gian chờ của chính bạn. Hãy dựng trên một cái máy còn chỗ thở rồi để máy chủ chỉ <code>pull</code> và tráo — một lượt dựng trên máy chủ production tranh bộ nhớ và làm đầy cái đĩa đang chứa cơ sở dữ liệu của bạn. Và hãy gắn nhãn theo mã SHA của commit để "cái gì đang chạy" là thứ kiểm được và quay lui là một câu lệnh, nhớ rằng một lượt deploy có kèm migration thì không hoàn tác được bằng cách deploy lại ảnh cũ.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — Disk, cleanup, and knowing before users do|||11.5 — Đĩa, dọn dẹp, và biết trước người dùng',
      slug: 'dk-11-5-dia-giam-sat',
      type: 'LESSON',
      description: 'Bốn thứ ăn đĩa và cách đo từng cái, prune an toàn với prune nguy hiểm, một việc dọn theo lịch, giám sát tối thiểu đáng có, và một danh sách kiểm sau deploy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Disk, cleanup, and knowing before users do</h2>
<p class="lead">Docker accumulates. Images you replaced, containers you stopped, build cache from every deploy, volumes from experiments — all of it stays until something removes it. On a single-disk VPS that accumulation eventually meets your database, and the failure is total rather than gradual.</p>

<h3>The four things that grow</h3>
${slide('dk-11', 26, 'Bốn thứ phình ra — docker system df trên máy Mac của người viết')}
<pre><code>docker system df</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          24        6         8.412GB   6.109GB (72%)
Containers      11        6         184.2MB   41.11MB (22%)
Local Volumes   9         5         11.84GB   7.663GB (64%)
Build Cache     412       0         7.611GB   7.611GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Images</span><span class="v">Every deploy leaves the previous one behind. Keep two or three for rollback (Lesson 11.4) and remove the rest — but never prune while a rollback might still be needed.</span></div>
  <div class="kv"><span class="k">Build cache</span><span class="v">The biggest surprise on a server that builds. 7.6GB here, reclaimable in full, and invisible unless you look. This is why builds belong on a different machine.</span></div>
  <div class="kv"><span class="k">Volumes</span><span class="v">Anonymous volumes from experiments accumulate silently (Lesson 7.2). "64% reclaimable" needs reading carefully — <em>dangling</em> is not the same as unused.</span></div>
  <div class="kv"><span class="k">Container logs</span><span class="v">Not in this table at all (Lesson 11.3). A host can be out of disk while <code>docker system df</code> reports plenty free.</span></div>
  <div class="kv"><span class="k">The one to watch</span><span class="v"><code>df -h /var/lib/docker</code>. That is the number that actually ends your day; everything above just explains it.</span></div>
</div>

<h3>Safe cleanup, and the flag that is not</h3>
${slide('dk-11', 27, 'Thang prune: bắt đầu ở bậc an toàn, dừng lại trước bậc đỏ')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker builder prune -f</span><span class="lz-t">safest and usually the biggest win</span><span class="lz-d">Removes build cache only. Nothing running is affected; the next build is slower and that is the entire cost. Start here.</span></div>
  <div class="lz-step"><span class="lz-k">docker image prune -f</span><span class="lz-t">removes dangling (untagged) images</span><span class="lz-d">Layers no tag points at any more. Safe, though it is also where a rollback image may be hiding if the tag was reused (Lesson 11.4).</span></div>
  <div class="lz-step"><span class="lz-k">docker container prune -f</span><span class="lz-t">removes stopped containers</span><span class="lz-d">Their logs go with them, which is often what you actually wanted to reclaim. Check nothing stopped is waiting to be inspected.</span></div>
  <div class="lz-step"><span class="lz-k">docker system prune -a --volumes</span><span class="lz-t">⛔ removes every unused tagged image, and anonymous volumes too</span><span class="lz-d">The <code>-a</code> deletes every image not currently in use — including the one you would roll back to — and <code>--volumes</code> deletes data: every <em>anonymous</em> volume no container uses, such as the one a Postgres container started without <code>-v</code> keeps its database in (Lesson 1.4). On a production host this is the command that turns a disk-space problem into a data-loss incident. <strong>Corrected 09/2026:</strong> since Engine 23 (API 1.42), <code>--volumes</code> no longer removes <em>named</em> volumes — the docs say "Prune anonymous volumes", and the test in this lesson confirms it. Named volumes go only with <code>docker volume prune -a</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># The safe sequence, with age filters so recent work survives</span>
docker builder prune -f --filter 'until=168h'
docker image   prune -f --filter 'until=168h'
docker container prune -f --filter 'until=24h'
docker system df --format 'table {{.Type}}\\t{{.Reclaimable}}'</code></pre>
<div class="out">TYPE            RECLAIMABLE
Images          412.1MB (11%)
Containers      0B
Local Volumes   7.663GB (64%)
Build Cache     0B</div>
<div class="callout warn"><strong>Volumes still show 7.6GB reclaimable, and this is where you stop and look.</strong> <code>docker volume ls --filter dangling=true</code> lists them by name; read every line before deciding. A named volume shows as dangling whenever no container references it — for example the database volume of a stack you took <code>down</code> for maintenance, or of a project you only start once a week. <strong>Corrected 09/2026:</strong> an earlier version said this happens on every deploy; it does not, because during a recreate the volume is always attached to either the old container or the new one. What is true is that "dangling" means "unused right now", not "unwanted". This is the one prune that deserves a human reading the list, not a <code>-f</code> — and it is exactly the list <code>docker volume prune -a</code> would delete.</div>

<h3>Run it step by step: prove what each prune touches — on your things only</h3>
<p>Reading a table of prune commands is not the same as trusting it. The safe way to see for yourself on a machine that holds other projects is to give your test objects a <strong>label</strong> and pass <code>--filter label=…</code> to every prune, so nothing without the label can be touched. One named volume (like a <code>pgdata</code>) and one anonymous volume (like the one Postgres gets when you forget <code>-v</code>):</p>
<pre><code class="language-bash">docker volume create --label dkhoc=11 pgdata
docker run --name anon --mount type=volume,dst=/data,volume-label=dkhoc=11 alpine true
docker inspect -f '{{range .Mounts}}{{.Name}}{{end}}' anon    <span class="tok-comment"># note the ID before removing the container</span>
docker rm anon
docker volume prune -f --filter label=dkhoc=11
docker volume ls --filter label=dkhoc=11 --format '{{.Name}}'
docker volume prune -a -f --filter label=dkhoc=11</code></pre>
<div class="out">12795f713c63eaff4a70aef336bff4243a7021b15873f6cfad13702722ee867d
Deleted Volumes:
12795f713c63eaff4a70aef336bff4243a7021b15873f6cfad13702722ee867d

Total reclaimed space: 0B
pgdata
Deleted Volumes:
pgdata

Total reclaimed space: 0B</div>
<p>Real output from a Mac, Engine 29.8 (names shortened from <code>dk11-</code>). Plain <code>volume prune</code> removed only the anonymous volume; <code>pgdata</code> survived until <code>-a</code>. Two details make this demo work: <code>--mount …,volume-label=…</code> puts the label on the volume Docker creates for you (a label on the container alone is not copied to its volumes), and Docker marks such volumes with <code>com.docker.volume.anonymous</code> — that label is how <code>prune</code> tells anonymous from named.</p>
<p>Build cache can be measured and pruned the same careful way, on a builder that belongs only to you:</p>
<pre><code class="language-bash">docker buildx create --name mybuilder --driver docker-container
docker buildx build --builder mybuilder .              <span class="tok-comment"># a Dockerfile that installs git, python3, make, g++ on node:22-alpine</span>
docker buildx du --builder mybuilder | tail -1
docker buildx prune --builder mybuilder -f --filter until=168h | tail -1
docker buildx prune --builder mybuilder -f | tail -1
docker buildx rm mybuilder</code></pre>
<div class="out">Total:		580.9MB
Total:	0B
Total:	580.9MB</div>
<p>Real output from a Mac. One small build left 580.9 MB of cache. <code>--filter until=168h</code> reclaimed <strong>nothing</strong>, because the cache was minutes old — which is exactly the point of the filter in a weekly job: it removes last month's layers and keeps the ones your next deploy needs. The unfiltered prune took everything. On a server the default builder is the one to prune, with the same commands minus <code>--builder</code>.</p>
<table>
<tr><th>Command</th><th>Removes</th><th>Keeps</th></tr>
<tr><td><code>docker builder prune -f --filter until=168h</code></td><td>build cache older than 7 days</td><td>recent cache, all images, containers, volumes</td></tr>
<tr><td><code>docker image prune -f</code></td><td>untagged (dangling) images</td><td>every tagged image, so your rollback tags stay</td></tr>
<tr><td><code>docker container prune -f --filter until=24h</code></td><td>containers stopped for more than a day — and their logs</td><td>running containers</td></tr>
<tr><td><code>docker volume prune -f</code></td><td>unused <em>anonymous</em> volumes</td><td>named volumes</td></tr>
<tr><td><code>docker image prune -a</code> · <code>docker volume prune -a</code></td><td>every unused image · every unused volume</td><td>only what a container uses right now</td></tr>
</table>

<h3>A cleanup job that runs itself</h3>
${slide('dk-11', 28, 'Dọn tự động, nhưng phải báo cả khi THÀNH CÔNG')}
<pre><code><span class="tok-comment"># /etc/cron.weekly/docker-cleanup — or a scheduled CI job over ssh</span>
#!/usr/bin/env bash
set -Eeuo pipefail
BEFORE=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')

docker builder prune -f --filter 'until=168h' &gt;/dev/null
docker image   prune -f --filter 'until=168h' &gt;/dev/null
docker container prune -f --filter 'until=24h' &gt;/dev/null
<span class="tok-comment"># deliberately NOT pruning volumes — that stays a human decision</span>

AFTER=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')
echo "docker-cleanup: &#36;{BEFORE}G → &#36;{AFTER}G free"
[ "$AFTER" -lt 8 ] &amp;&amp; curl -fsS "https://hc-ping.com/$HC_UUID/fail" || curl -fsS "https://hc-ping.com/$HC_UUID"</code></pre>
<div class="out">docker-cleanup: 6G → 21G free</div>
<div class="callout ok"><strong>Note the last line: it reports success <em>and</em> failure to a heartbeat service.</strong> A cleanup job that silently stops running is worse than no cleanup job, because you have stopped watching the disk on the assumption that something else is. Pinging on success means the absence of a ping is itself an alert — the pattern from Lesson 7.5, and the reason this project runs a weekly VPS cleanup workflow whose secrets are documented as never-delete.</div>

<h3>The minimum monitoring worth having</h3>
${slide('dk-11', 29, 'Giám sát tối thiểu: 5 phép kiểm bắt gần hết những gì làm sập trang nhỏ')}
<pre><code><span class="tok-comment"># ops/watch.sh — five checks, one cron, no infrastructure</span>
#!/usr/bin/env bash
set -Eeuo pipefail
fail() { echo "ALERT: $*"; curl -fsS --data-urlencode "text=$*" "$SLACK_HOOK" &gt;/dev/null; }

<span class="tok-comment"># 1 · disk</span>
avail=$(df --output=pcent /var/lib/docker | tail -1 | tr -dc '0-9')
[ "$avail" -gt 85 ] &amp;&amp; fail "disk &#36;{avail}% full on $(hostname)"

<span class="tok-comment"># 2 · anything unhealthy or restarting</span>
bad=$(docker ps --filter health=unhealthy --format '{{.Names}}')
[ -n "$bad" ] &amp;&amp; fail "unhealthy: $bad"

<span class="tok-comment"># 3 · anything that restarted recently</span>
for c in $(docker ps -q); do
  n=$(docker inspect -f '{{ .Name }} {{ .RestartCount }}' "$c")
  case "$n" in *' 0') ;; *) fail "restarts: $n" ;; esac
done

<span class="tok-comment"># 4 · the site answers</span>
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://cuongthai.com/api/v1/health)
[ "$code" = "200" ] || fail "health returned $code"

<span class="tok-comment"># 5 · last night's backup exists and is not tiny</span>
find /opt/backup/out -name "db-$(date +%F).dump" -size +1M | grep -q . || fail "no backup today"</code></pre>
<div class="out">ALERT: disk 89% full on vps-sg-1
ALERT: restarts: /blog-worker-1 4</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Five checks beat none</span><span class="v">This is thirty lines and a cron entry. It is not Prometheus, and it catches the failures that actually take small sites down: full disk, unhealthy container, crash loop, site down, missing backup.</span></div>
  <div class="kv"><span class="k">Alert on the symptom, not the cause</span><span class="v">"health returned 502" is actionable at 3am. "CPU is at 78%" is not — it is a dashboard number, and paging on it trains people to ignore pages.</span></div>
  <div class="kv"><span class="k">Check the backup, not just the service</span><span class="v">A backup that stopped running two weeks ago is discovered either by this check or by needing it. Only one of those is survivable.</span></div>
  <div class="kv"><span class="k">Graduate when it hurts</span><span class="v">cAdvisor, Prometheus and Grafana are three more containers and real value once you have several services — but they answer "why", and the script above answers "is it broken", which is the more urgent question.</span></div>
  <div class="kv"><span class="k">Uptime from outside</span><span class="v">A monitor running on the same host cannot tell you the host is unreachable. A free external check — UptimeRobot, healthchecks.io — covers the case your own script cannot.</span></div>
</div>

<h3>Where the alerts come from: health status and docker events</h3>
<p>Checks 2 and 3 of the script above only work if your containers have a healthcheck (Lesson 9.3). With one, Docker keeps a live verdict you can filter on, and it also announces every change as an event. Using the broken v3 API of Lesson 11.4:</p>
<pre><code class="language-bash">docker events --filter type=container --filter event=health_status \\
  --filter event=die --filter event=oom \\
  --format '{{.Time}} {{.Actor.Attributes.name}} {{.Action}}' &amp;
TAG=5b502fc docker compose up -d --wait --wait-timeout 20
docker ps --filter health=unhealthy --format '{{.Names}}\\t{{.Status}}'
docker inspect -f '{{.State.Health.Status}} {{.State.Health.FailingStreak}} {{(index .State.Health.Log 0).Output}}' blog-api-1</code></pre>
<div class="out">1790191991 blog-api-1 die
1790192005 blog-api-1 health_status: unhealthy
blog-api-1	Up 16 seconds (unhealthy)
unhealthy 4 wget: server returned error: HTTP/1.1 500 Internal Server Error</div>
<p>Real output from a Mac (names shortened from <code>dk11-</code>; the first line is the old container being replaced, the time is Unix seconds). <code>FailingStreak 4</code> means four checks in a row failed, and the last check's own output tells you why. A tiny watcher that pipes <code>docker events</code> into your alert webhook reacts within seconds instead of at the next cron run — but it dies with the host, so keep the outside check too.</p>

<h3>A post-deploy checklist</h3>
<pre><code>docker compose ps --format 'table {{.Service}}\\t{{.Status}}'          <span class="tok-comment"># all Up, all (healthy)</span>
for r in health posts auth/me; do
  printf '%-10s %s\\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://cuongthai.com/api/v1/$r)"
done                                                                  <span class="tok-comment"># 200/401, never 404</span>
docker compose logs --since 3m 2&gt;&amp;1 | grep -iE 'error|fatal' | head -5 <span class="tok-comment"># quiet?</span>
docker stats --no-stream --format '{{.Name}} {{.MemPerc}}' | head -5   <span class="tok-comment"># nothing near its limit</span>
df -h /var/lib/docker | tail -1                                       <span class="tok-comment"># room to breathe</span></code></pre>
<div class="out">SERVICE   STATUS
api       Up 2 minutes (healthy)
db        Up 9 days (healthy)
nginx     Up 2 minutes (healthy)
health     200
posts      200
auth/me    401
blog-api-1 38.12%
/dev/vda1  49G  19G  28G  41% /var/lib/docker</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate asks in the group chat: "The VPS is at 92%, can I just run <code>docker system prune -a --volumes</code>?" Before answering, find out on your own machine what is actually eating the disk, and prove which prune touches what — without risking anything that is not yours.</p><ol>
<li>Read your own machine: <code>docker system df</code> and, on Linux, <code>df -h /var/lib/docker</code>. Write down the four rows and which one is largest.</li>
<li>Create two volumes with a label so you can prune only them: <code>docker volume create --label dkhoc=thu thu-pgdata</code> and <code>docker run --name thu-anon --mount type=volume,dst=/data,volume-label=dkhoc=thu alpine true</code>, then <code>docker rm thu-anon</code>.</li>
<li>Prune with the label filter and watch what goes: <code>docker volume prune -f --filter label=dkhoc=thu</code>, then <code>docker volume ls --filter label=dkhoc=thu</code>; then the same with <code>-a</code>.</li>
<li>Make a container unhealthy on purpose: <code>docker run -d --name thu-sick --health-cmd 'false' --health-interval 2s --health-retries 2 alpine sleep 300</code>, wait 10 seconds, and find it with <code>docker ps --filter health=unhealthy</code>.</li>
<li>Clean up: <code>docker rm -f thu-sick</code>.</li></ol>
<p><strong>Done when:</strong> you can tell your teammate which of the four rows is biggest on your machine, the first prune removed only the anonymous volume and <code>-a</code> removed <code>thu-pgdata</code>, and <code>thu-sick</code> appeared in the unhealthy list — and your answer to the teammate names the safe order (builder → image → container) instead of <code>system prune -a --volumes</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">docker system df</span><span class="v">Disk used by images, containers' writable layers, volumes and build cache — but not log files.</span></div>
  <div class="kv"><span class="k">Build cache</span><span class="v">Layers BuildKit keeps to make the next build fast; often the biggest and least visible thing on a building host.</span></div>
  <div class="kv"><span class="k">Dangling</span><span class="v">For images: no tag points at it. For volumes: no container references it right now — not the same as "unwanted".</span></div>
  <div class="kv"><span class="k">Anonymous volume</span><span class="v">A volume with a random ID for a name, created by <code>VOLUME</code> in an image or <code>-v /path</code>; removed by plain <code>volume prune</code>.</span></div>
  <div class="kv"><span class="k">prune filter</span><span class="v"><code>--filter until=168h</code> or <code>label=…</code>: limits what a prune may remove.</span></div>
  <div class="kv"><span class="k">Heartbeat / dead man's switch</span><span class="v">A job pings an outside service when it succeeds; the <em>absence</em> of a ping raises the alarm.</span></div>
  <div class="kv"><span class="k">Healthcheck</span><span class="v">A command Docker runs inside the container on a schedule; its result sets <code>healthy</code>/<code>unhealthy</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Four things grow — images, build cache, volumes and log files; the author's Mac showed 37 GB of build cache and 38 GB of images, and logs appear in no table.</li>
<li>Prune from the safe end: <code>builder prune</code>, then <code>image prune</code>, then <code>container prune</code>, with <code>--filter until=…</code>, checking <code>df</code> after each.</li>
<li>Since Engine 23, <code>volume prune</code> and <code>system prune --volumes</code> remove only anonymous volumes; <code>-a</code> is what reaches named volumes — and databases.</li>
<li>A cleanup job must report success to a heartbeat service, so that a job that stopped running is itself an alarm.</li>
<li>Five checks catch most small-site failures: disk, unhealthy containers, restarts, the health endpoint from outside, and today's backup.</li>
<li><code>docker events</code> with <code>health_status</code>, <code>die</code> and <code>oom</code> filters is the live feed a monitor can listen to.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pruning/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Prune unused objects</span><span class="lc-sub">What each prune command removes, the <code>until</code> and <code>label</code> filters, and the exact meaning of <code>-a</code> and <code>--volumes</code>. Read before running either on a server.</span></span>
</a>
<a class="link-card" href="https://healthchecks.io/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">💓</span>
  <span class="lc-body"><span class="lc-title">healthchecks.io — dead man's switch monitoring</span><span class="lc-sub">Alerting on the <em>absence</em> of a ping, which is the only way to notice a cron job that stopped running. Free tier is enough for a small server.</span></span>
</a>
<a class="link-card" href="https://github.com/google/cadvisor" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">cAdvisor</span><span class="lc-sub">Per-container CPU, memory, network and disk metrics, exportable to Prometheus. The next step once "is it broken" is handled and you need "why is it slow".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reclaim disk and watch a host</span><span class="lc-sub">Graded exercises: identify what is consuming 15GB, reclaim it without losing data, explain why <code>system prune -a --volumes</code> is not the answer, and write three checks worth alerting on.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> reaching for <code>docker system prune -a --volumes</code> when a server is out of disk. It is the command that appears first in search results and it is the one that turns an inconvenience into an incident: <code>-a</code> removes every image not attached to a running container — including the previous release you would have rolled back to — and <code>--volumes</code> removes every unused anonymous volume, which on a host where Postgres was once started without a named volume means the database (on engines older than 23 it removed named volumes too; today that takes <code>docker volume prune -a</code>). The safe order is <code>builder prune</code>, then <code>image prune</code> (no <code>-a</code>), then <code>container prune</code>, checking <code>df</code> between each; that recovers most of the space with nothing at risk. If volumes really are the problem, list them by name and confirm each one by hand. And treat the whole episode as a signal: a server that reaches 90% disk once will reach it again, so the fix is log rotation, a scheduled cleanup and moving builds off the host — not a bigger prune.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Four things grow — images, build cache, volumes and log files — and only the first three appear in <code>docker system df</code>. Prune in order of safety: <code>builder</code>, then <code>image</code>, then <code>container</code>, and never <code>system prune -a --volumes</code> or <code>volume prune -a</code> on a host with data. And five scripted checks (disk, unhealthy, restarts, health endpoint, backup exists) catch nearly everything that takes a small site down — including the cleanup job that quietly stopped running.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Đĩa, dọn dẹp, và biết trước người dùng</h2>
<p class="lead">Docker tích tụ. Những cái ảnh bạn đã thay, container bạn đã dừng, cache dựng từ mọi lượt deploy, volume từ những lần thử nghiệm — tất cả nằm lại cho tới khi có thứ gì xoá chúng. Trên một con VPS một đĩa, đống tích tụ đó rốt cuộc gặp cơ sở dữ liệu của bạn, và cái hỏng khi ấy là toàn phần chứ không phải từ từ.</p>

<h3>Bốn thứ phình ra</h3>
${slide('dk-11', 26, 'Bốn thứ phình ra — docker system df trên máy Mac của người viết')}
<pre><code>docker system df</code></pre>
<div class="out">TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          24        6         8.412GB   6.109GB (72%)
Containers      11        6         184.2MB   41.11MB (22%)
Local Volumes   9         5         11.84GB   7.663GB (64%)
Build Cache     412       0         7.611GB   7.611GB</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Ảnh</span><span class="v">Mỗi lượt deploy để lại cái trước đó. Hãy giữ hai hoặc ba cái để quay lui (Bài 11.4) rồi xoá phần còn lại — nhưng đừng bao giờ prune trong lúc còn có thể phải quay lui.</span></div>
  <div class="kv"><span class="k">Cache dựng</span><span class="v">Bất ngờ lớn nhất trên một máy chủ có dựng ảnh. 7,6GB ở đây, lấy lại được toàn bộ, và vô hình nếu bạn không nhìn. Đây là lý do việc dựng thuộc về một cái máy khác.</span></div>
  <div class="kv"><span class="k">Volume</span><span class="v">Volume vô danh từ những lần thử nghiệm tích lại trong im lặng (Bài 7.2). Con số "lấy lại được 64%" phải đọc rất kỹ — <em>dangling</em> không đồng nghĩa với không dùng.</span></div>
  <div class="kv"><span class="k">Log của container</span><span class="v">Hoàn toàn không có trong bảng này (Bài 11.3). Một máy chủ có thể hết đĩa trong khi <code>docker system df</code> báo còn rộng rãi.</span></div>
  <div class="kv"><span class="k">Con số cần nhìn</span><span class="v"><code>df -h /var/lib/docker</code>. Đó mới là con số thật sự kết thúc một ngày của bạn; mọi thứ phía trên chỉ giải thích nó.</span></div>
</div>

<h3>Dọn an toàn, và cái cờ KHÔNG an toàn</h3>
${slide('dk-11', 27, 'Thang prune: bắt đầu ở bậc an toàn, dừng lại trước bậc đỏ')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker builder prune -f</span><span class="lz-t">an toàn nhất và thường lãi nhất</span><span class="lz-d">Chỉ xoá cache dựng. Không thứ gì đang chạy bị ảnh hưởng; lượt dựng kế tiếp chậm hơn và đó là toàn bộ cái giá. Hãy bắt đầu ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">docker image prune -f</span><span class="lz-t">xoá những ảnh mồ côi (không nhãn)</span><span class="lz-d">Những lớp không còn nhãn nào trỏ tới. An toàn, dù đây cũng là chỗ một cái ảnh để quay lui có thể đang nấp nếu cái nhãn đã bị dùng lại (Bài 11.4).</span></div>
  <div class="lz-step"><span class="lz-k">docker container prune -f</span><span class="lz-t">xoá những container đã dừng</span><span class="lz-d">Log của chúng đi theo luôn, và đó thường mới là thứ bạn thật sự muốn lấy lại. Hãy kiểm xem không có container dừng nào đang chờ được soi.</span></div>
  <div class="lz-step"><span class="lz-k">docker system prune -a --volumes</span><span class="lz-t">⛔ xoá mọi ảnh có tag không ai dùng, và cả volume vô danh</span><span class="lz-d">Cờ <code>-a</code> xoá mọi cái ảnh hiện không được dùng — kể cả bản phát hành trước mà bạn định quay lui về — còn <code>--volumes</code> xoá DỮ LIỆU: mọi volume <em>vô danh</em> không container nào dùng, ví dụ cái volume mà một container Postgres chạy thiếu <code>-v</code> dùng để chứa cơ sở dữ liệu (Bài 1.4). Trên một máy chủ production, đây là câu lệnh biến một vấn đề thiếu đĩa thành một sự cố mất dữ liệu. <strong>Đã sửa 09/2026:</strong> từ Engine 23 (API 1.42), <code>--volumes</code> KHÔNG còn xoá volume <em>có tên</em> — tài liệu ghi "Prune anonymous volumes", và phép thử trong bài này xác nhận điều đó. Volume có tên chỉ đi khi dùng <code>docker volume prune -a</code>.</span></div>
</div>
<pre><code><span class="tok-comment"># Trình tự an toàn, có lọc theo tuổi để việc gần đây sống sót</span>
docker builder prune -f --filter 'until=168h'
docker image   prune -f --filter 'until=168h'
docker container prune -f --filter 'until=24h'
docker system df --format 'table {{.Type}}\\t{{.Reclaimable}}'</code></pre>
<div class="out">TYPE            RECLAIMABLE
Images          412.1MB (11%)
Containers      0B
Local Volumes   7.663GB (64%)
Build Cache     0B</div>
<div class="callout warn"><strong>Volume vẫn hiện 7,6GB lấy lại được, và đây là chỗ bạn dừng lại và NHÌN.</strong> <code>docker volume ls --filter dangling=true</code> liệt kê chúng theo tên; hãy đọc từng dòng trước khi quyết. Một volume có tên hiện ra là dangling bất cứ khi nào không container nào tham chiếu tới nó — ví dụ volume cơ sở dữ liệu của một stack bạn vừa <code>down</code> để bảo trì, hay của một dự án mỗi tuần mới bật một lần. <strong>Đã sửa 09/2026:</strong> bản trước nói chuyện này xảy ra ở mọi lượt deploy; không phải vậy, vì trong lúc tạo lại, volume luôn được gắn vào container cũ hoặc container mới. Điều đúng là "dangling" nghĩa là "lúc này không ai dùng", không phải "không ai cần". Đây là lượt prune duy nhất xứng đáng có một con người đọc danh sách, chứ không phải một cái <code>-f</code> — và đó chính là danh sách mà <code>docker volume prune -a</code> sẽ xoá.</div>

<h3>Chạy thử từng bước: chứng minh mỗi lượt prune đụng tới gì — chỉ trên đồ của bạn</h3>
<p>Đọc một bảng lệnh prune không giống với tin nó. Cách an toàn để tự kiểm trên một máy đang chứa dự án khác là gắn <strong>nhãn</strong> (label) cho đồ thử nghiệm và truyền <code>--filter label=…</code> cho mọi lượt prune, để thứ gì không mang nhãn thì không thể bị đụng. Một volume có tên (như <code>pgdata</code>) và một volume vô danh (như cái mà Postgres nhận khi bạn quên <code>-v</code>):</p>
<pre><code class="language-bash">docker volume create --label dkhoc=11 pgdata
docker run --name anon --mount type=volume,dst=/data,volume-label=dkhoc=11 alpine true
docker inspect -f '{{range .Mounts}}{{.Name}}{{end}}' anon    <span class="tok-comment"># ghi lại ID trước khi xoá container</span>
docker rm anon
docker volume prune -f --filter label=dkhoc=11
docker volume ls --filter label=dkhoc=11 --format '{{.Name}}'
docker volume prune -a -f --filter label=dkhoc=11</code></pre>
<div class="out">12795f713c63eaff4a70aef336bff4243a7021b15873f6cfad13702722ee867d
Deleted Volumes:
12795f713c63eaff4a70aef336bff4243a7021b15873f6cfad13702722ee867d

Total reclaimed space: 0B
pgdata
Deleted Volumes:
pgdata

Total reclaimed space: 0B</div>
<p>Output thật trên Mac, Engine 29.8 (tên rút gọn từ <code>dk11-</code>). <code>volume prune</code> thường chỉ xoá volume vô danh; <code>pgdata</code> sống sót tới khi có <code>-a</code>. Hai chi tiết làm demo này chạy được: <code>--mount …,volume-label=…</code> gắn nhãn lên chính volume Docker tạo ra giùm bạn (nhãn chỉ gắn trên container thì không được chép sang volume của nó), và Docker đánh dấu những volume như thế bằng nhãn <code>com.docker.volume.anonymous</code> — đó là cách <code>prune</code> phân biệt vô danh với có tên.</p>
<p>Cache dựng cũng đo và dọn được theo cùng lối cẩn thận đó, trên một builder chỉ thuộc về bạn:</p>
<pre><code class="language-bash">docker buildx create --name mybuilder --driver docker-container
docker buildx build --builder mybuilder .              <span class="tok-comment"># Dockerfile cài git, python3, make, g++ trên node:22-alpine</span>
docker buildx du --builder mybuilder | tail -1
docker buildx prune --builder mybuilder -f --filter until=168h | tail -1
docker buildx prune --builder mybuilder -f | tail -1
docker buildx rm mybuilder</code></pre>
<div class="out">Total:		580.9MB
Total:	0B
Total:	580.9MB</div>
<p>Output thật trên Mac. Một lượt dựng nhỏ để lại 580,9 MB cache. <code>--filter until=168h</code> lấy lại được <strong>KHÔNG</strong> gì, vì cache mới được vài phút — và đó chính là ý nghĩa của bộ lọc trong một việc chạy hằng tuần: nó xoá tầng của tháng trước và giữ những tầng lượt deploy kế tiếp cần. Lượt prune không lọc thì lấy sạch. Trên máy chủ, builder cần dọn là builder mặc định, với đúng các lệnh này bỏ <code>--builder</code>.</p>
<table>
<tr><th>Lệnh</th><th>Xoá</th><th>Giữ</th></tr>
<tr><td><code>docker builder prune -f --filter until=168h</code></td><td>cache dựng cũ hơn 7 ngày</td><td>cache gần đây, mọi ảnh, container, volume</td></tr>
<tr><td><code>docker image prune -f</code></td><td>ảnh không tag (dangling)</td><td>mọi ảnh có tag, nên tag để quay lui vẫn còn</td></tr>
<tr><td><code>docker container prune -f --filter until=24h</code></td><td>container đã dừng hơn một ngày — và log của chúng</td><td>container đang chạy</td></tr>
<tr><td><code>docker volume prune -f</code></td><td>volume <em>vô danh</em> không ai dùng</td><td>volume có tên</td></tr>
<tr><td><code>docker image prune -a</code> · <code>docker volume prune -a</code></td><td>mọi ảnh không dùng · mọi volume không dùng</td><td>chỉ thứ container đang dùng lúc này</td></tr>
</table>

<h3>Một việc dọn tự chạy</h3>
${slide('dk-11', 28, 'Dọn tự động, nhưng phải báo cả khi THÀNH CÔNG')}
<pre><code><span class="tok-comment"># /etc/cron.weekly/docker-cleanup — hoặc một việc CI theo lịch chạy qua ssh</span>
#!/usr/bin/env bash
set -Eeuo pipefail
BEFORE=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')

docker builder prune -f --filter 'until=168h' &gt;/dev/null
docker image   prune -f --filter 'until=168h' &gt;/dev/null
docker container prune -f --filter 'until=24h' &gt;/dev/null
<span class="tok-comment"># CỐ Ý không prune volume — chuyện đó vẫn là quyết định của con người</span>

AFTER=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')
echo "docker-cleanup: &#36;{BEFORE}G → &#36;{AFTER}G free"
[ "$AFTER" -lt 8 ] &amp;&amp; curl -fsS "https://hc-ping.com/$HC_UUID/fail" || curl -fsS "https://hc-ping.com/$HC_UUID"</code></pre>
<div class="out">docker-cleanup: 6G → 21G free</div>
<div class="callout ok"><strong>Để ý dòng cuối: nó báo cáo cả THÀNH CÔNG lẫn thất bại về một dịch vụ nhịp tim.</strong> Một việc dọn dẹp lặng lẽ ngừng chạy còn tệ hơn không có việc dọn nào, vì bạn đã thôi canh cái đĩa với giả định rằng có thứ khác đang canh hộ. Ping khi thành công nghĩa là sự VẮNG MẶT của một cú ping tự nó là một cảnh báo — đúng cái mẫu ở Bài 7.5, và là lý do dự án này chạy một workflow dọn VPS hằng tuần mà các bí mật của nó được ghi rõ là không-bao-giờ-xoá.</div>

<h3>Mức giám sát tối thiểu đáng có</h3>
${slide('dk-11', 29, 'Giám sát tối thiểu: 5 phép kiểm bắt gần hết những gì làm sập trang nhỏ')}
<pre><code><span class="tok-comment"># ops/watch.sh — năm phép kiểm, một dòng cron, không cần hạ tầng</span>
#!/usr/bin/env bash
set -Eeuo pipefail
fail() { echo "ALERT: $*"; curl -fsS --data-urlencode "text=$*" "$SLACK_HOOK" &gt;/dev/null; }

<span class="tok-comment"># 1 · đĩa</span>
avail=$(df --output=pcent /var/lib/docker | tail -1 | tr -dc '0-9')
[ "$avail" -gt 85 ] &amp;&amp; fail "disk &#36;{avail}% full on $(hostname)"

<span class="tok-comment"># 2 · có gì không khoẻ hoặc đang restart không</span>
bad=$(docker ps --filter health=unhealthy --format '{{.Names}}')
[ -n "$bad" ] &amp;&amp; fail "unhealthy: $bad"

<span class="tok-comment"># 3 · có gì vừa khởi động lại gần đây không</span>
for c in $(docker ps -q); do
  n=$(docker inspect -f '{{ .Name }} {{ .RestartCount }}' "$c")
  case "$n" in *' 0') ;; *) fail "restarts: $n" ;; esac
done

<span class="tok-comment"># 4 · trang web có trả lời không</span>
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 https://cuongthai.com/api/v1/health)
[ "$code" = "200" ] || fail "health returned $code"

<span class="tok-comment"># 5 · bản sao lưu đêm qua có tồn tại và không bé tí</span>
find /opt/backup/out -name "db-$(date +%F).dump" -size +1M | grep -q . || fail "no backup today"</code></pre>
<div class="out">ALERT: disk 89% full on vps-sg-1
ALERT: restarts: /blog-worker-1 4</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Năm phép kiểm hơn hẳn không có cái nào</span><span class="v">Đây là ba mươi dòng và một mục cron. Nó không phải Prometheus, và nó bắt được đúng những kiểu hỏng thật sự kéo sập các trang nhỏ: đĩa đầy, container không khoẻ, vòng lặp sập, trang chết, thiếu bản sao lưu.</span></div>
  <div class="kv"><span class="k">Báo động theo TRIỆU CHỨNG, đừng theo nguyên nhân</span><span class="v">"health trả 502" là thứ hành động được lúc 3 giờ sáng. "CPU đang 78%" thì không — đó là một con số trên bảng điều khiển, và gọi người dậy vì nó là dạy người ta phớt lờ các cuộc gọi.</span></div>
  <div class="kv"><span class="k">Kiểm cả bản sao lưu, đừng chỉ kiểm dịch vụ</span><span class="v">Một bản sao lưu đã ngừng chạy hai tuần trước thì hoặc được phát hiện bởi phép kiểm này, hoặc được phát hiện lúc bạn cần tới nó. Chỉ một trong hai là sống sót được.</span></div>
  <div class="kv"><span class="k">Nâng cấp khi nào thấy đau</span><span class="v">cAdvisor, Prometheus và Grafana là ba container nữa và có giá trị thật khi bạn đã có nhiều dịch vụ — nhưng chúng trả lời câu "vì sao", còn cái script ở trên trả lời câu "có hỏng không", vốn là câu gấp hơn.</span></div>
  <div class="kv"><span class="k">Theo dõi từ BÊN NGOÀI</span><span class="v">Một bộ giám sát chạy trên chính máy chủ đó không thể nói cho bạn biết là máy chủ không với tới được. Một phép kiểm ngoài miễn phí — UptimeRobot, healthchecks.io — bao được trường hợp mà script của chính bạn không bao nổi.</span></div>
</div>

<h3>Cảnh báo đến từ đâu: trạng thái health và docker events</h3>
<p>Phép kiểm 2 và 3 của script trên chỉ có tác dụng khi container có healthcheck (Bài 9.3). Có nó, Docker giữ một phán quyết sống mà bạn lọc được, và còn loan báo mọi thay đổi thành sự kiện. Dùng bản API v3 hỏng ở Bài 11.4:</p>
<pre><code class="language-bash">docker events --filter type=container --filter event=health_status \\
  --filter event=die --filter event=oom \\
  --format '{{.Time}} {{.Actor.Attributes.name}} {{.Action}}' &amp;
TAG=5b502fc docker compose up -d --wait --wait-timeout 20
docker ps --filter health=unhealthy --format '{{.Names}}\\t{{.Status}}'
docker inspect -f '{{.State.Health.Status}} {{.State.Health.FailingStreak}} {{(index .State.Health.Log 0).Output}}' blog-api-1</code></pre>
<div class="out">1790191991 blog-api-1 die
1790192005 blog-api-1 health_status: unhealthy
blog-api-1	Up 16 seconds (unhealthy)
unhealthy 4 wget: server returned error: HTTP/1.1 500 Internal Server Error</div>
<p>Output thật trên Mac (tên rút gọn từ <code>dk11-</code>; dòng đầu là container cũ bị thay, thời điểm tính bằng giây Unix). <code>FailingStreak 4</code> nghĩa là bốn lần kiểm liên tiếp thất bại, và output của lần kiểm cuối nói luôn vì sao. Một bộ canh tí hon dẫn <code>docker events</code> vào webhook cảnh báo sẽ phản ứng trong vài giây thay vì chờ lượt cron kế tiếp — nhưng nó chết theo máy chủ, nên vẫn giữ phép kiểm từ bên ngoài.</p>

<h3>Danh sách kiểm sau deploy</h3>
<pre><code>docker compose ps --format 'table {{.Service}}\\t{{.Status}}'          <span class="tok-comment"># đều Up, đều (healthy)</span>
for r in health posts auth/me; do
  printf '%-10s %s\\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' https://cuongthai.com/api/v1/$r)"
done                                                                  <span class="tok-comment"># 200/401, không bao giờ 404</span>
docker compose logs --since 3m 2&gt;&amp;1 | grep -iE 'error|fatal' | head -5 <span class="tok-comment"># có im ắng không?</span>
docker stats --no-stream --format '{{.Name}} {{.MemPerc}}' | head -5   <span class="tok-comment"># không cái nào gần trần</span>
df -h /var/lib/docker | tail -1                                       <span class="tok-comment"># còn chỗ thở</span></code></pre>
<div class="out">SERVICE   STATUS
api       Up 2 minutes (healthy)
db        Up 9 days (healthy)
nginx     Up 2 minutes (healthy)
health     200
posts      200
auth/me    401
blog-api-1 38.12%
/dev/vda1  49G  19G  28G  41% /var/lib/docker</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm hỏi trong nhóm chat: "VPS đầy 92% rồi, mình chạy luôn <code>docker system prune -a --volumes</code> được không?" Trước khi trả lời, hãy tìm xem trên máy của chính bạn thứ gì thật sự ăn đĩa, và chứng minh lượt prune nào đụng tới cái gì — mà không liều với bất cứ thứ gì không phải của bạn.</p><ol>
<li>Đọc máy mình: <code>docker system df</code> và, trên Linux, <code>df -h /var/lib/docker</code>. Ghi lại bốn dòng và dòng nào lớn nhất.</li>
<li>Tạo hai volume có nhãn để chỉ prune đúng chúng: <code>docker volume create --label dkhoc=thu thu-pgdata</code> và <code>docker run --name thu-anon --mount type=volume,dst=/data,volume-label=dkhoc=thu alpine true</code>, rồi <code>docker rm thu-anon</code>.</li>
<li>Prune kèm bộ lọc nhãn và xem cái gì biến mất: <code>docker volume prune -f --filter label=dkhoc=thu</code>, rồi <code>docker volume ls --filter label=dkhoc=thu</code>; sau đó làm lại với <code>-a</code>.</li>
<li>Cố ý làm một container không khoẻ: <code>docker run -d --name thu-sick --health-cmd 'false' --health-interval 2s --health-retries 2 alpine sleep 300</code>, chờ 10 giây, rồi tìm nó bằng <code>docker ps --filter health=unhealthy</code>.</li>
<li>Dọn dẹp: <code>docker rm -f thu-sick</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn nói được với bạn cùng nhóm dòng nào lớn nhất trên máy mình, lượt prune đầu chỉ xoá volume vô danh còn <code>-a</code> xoá <code>thu-pgdata</code>, và <code>thu-sick</code> hiện trong danh sách unhealthy — và câu trả lời cho bạn cùng nhóm nêu thứ tự an toàn (builder → image → container) thay vì <code>system prune -a --volumes</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">docker system df (dung lượng của Docker)</span><span class="v">Đĩa mà ảnh, tầng ghi của container, volume và cache build đang dùng — nhưng không tính file log.</span></div>
  <div class="kv"><span class="k">Build cache (cache dựng ảnh)</span><span class="v">Các tầng BuildKit giữ lại để lần dựng sau nhanh; thường là thứ lớn nhất và khó thấy nhất trên máy có dựng ảnh.</span></div>
  <div class="kv"><span class="k">Dangling (lơ lửng)</span><span class="v">Với ảnh: không tag nào trỏ tới. Với volume: lúc này không container nào tham chiếu — không đồng nghĩa với "không cần nữa".</span></div>
  <div class="kv"><span class="k">Anonymous volume (volume vô danh)</span><span class="v">Volume mang tên là một ID ngẫu nhiên, sinh ra từ <code>VOLUME</code> trong ảnh hay <code>-v /đường-dẫn</code>; bị <code>volume prune</code> thường xoá.</span></div>
  <div class="kv"><span class="k">prune filter (bộ lọc khi dọn)</span><span class="v"><code>--filter until=168h</code> hay <code>label=…</code>: giới hạn những gì một lượt prune được phép xoá.</span></div>
  <div class="kv"><span class="k">Heartbeat / dead man's switch (nhịp tim / công tắc người chết)</span><span class="v">Một việc gửi ping tới dịch vụ bên ngoài mỗi khi chạy xong; <em>thiếu</em> ping thì báo động.</span></div>
  <div class="kv"><span class="k">Healthcheck (kiểm tra sức khoẻ)</span><span class="v">Lệnh Docker chạy định kỳ bên trong container; kết quả đặt trạng thái <code>healthy</code>/<code>unhealthy</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn thứ phình ra — ảnh, cache dựng, volume và file log; máy Mac của người viết có 37 GB cache dựng và 38 GB ảnh, còn log thì không nằm trong bảng nào.</li>
<li>Prune từ phía an toàn: <code>builder prune</code>, rồi <code>image prune</code>, rồi <code>container prune</code>, kèm <code>--filter until=…</code>, kiểm <code>df</code> sau mỗi bước.</li>
<li>Từ Engine 23, <code>volume prune</code> và <code>system prune --volumes</code> chỉ xoá volume vô danh; <code>-a</code> mới với tới volume có tên — và cơ sở dữ liệu.</li>
<li>Việc dọn dẹp phải báo thành công về một dịch vụ nhịp tim, để một việc đã ngừng chạy tự nó thành một cảnh báo.</li>
<li>Năm phép kiểm bắt được phần lớn sự cố của trang nhỏ: đĩa, container không khoẻ, số lần restart, điểm health nhìn từ ngoài, và bản sao lưu hôm nay.</li>
<li><code>docker events</code> lọc theo <code>health_status</code>, <code>die</code> và <code>oom</code> là luồng tin trực tiếp mà một bộ giám sát có thể lắng nghe.</li>
</ul>

<a class="link-card" href="https://docs.docker.com/engine/manage-resources/pruning/" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Docker docs — Dọn các đối tượng không dùng</span><span class="lc-sub">Từng lệnh prune xoá cái gì, các bộ lọc <code>until</code> với <code>label</code>, và ý nghĩa chính xác của <code>-a</code> và <code>--volumes</code>. Hãy đọc trước khi chạy bất kỳ cái nào trên một máy chủ.</span></span>
</a>
<a class="link-card" href="https://healthchecks.io/docs/" target="_blank" rel="noopener">
  <span class="lc-ico">💓</span>
  <span class="lc-body"><span class="lc-title">healthchecks.io — giám sát kiểu công tắc người chết</span><span class="lc-sub">Báo động khi <em>VẮNG</em> một cú ping, cách duy nhất để nhận ra một việc cron đã ngừng chạy. Gói miễn phí là đủ cho một máy chủ nhỏ.</span></span>
</a>
<a class="link-card" href="https://github.com/google/cadvisor" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">cAdvisor</span><span class="lc-sub">Số liệu CPU, bộ nhớ, mạng và đĩa cho từng container, xuất được sang Prometheus. Bước kế tiếp khi câu "có hỏng không" đã được lo và bạn cần câu "vì sao nó chậm".</span></span>
</a>
<a class="link-card codelab" href="/code-lab/docker${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: lấy lại đĩa và canh một máy chủ</span><span class="lc-sub">Bài chấm điểm: xác định cái gì đang ngốn 15GB, lấy lại chỗ mà không mất dữ liệu, giải thích vì sao <code>system prune -a --volumes</code> không phải câu trả lời, và viết ba phép kiểm đáng báo động.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> với tay lấy <code>docker system prune -a --volumes</code> khi một máy chủ hết đĩa. Đó là câu lệnh xuất hiện đầu tiên trong kết quả tìm kiếm và là câu lệnh biến một sự bất tiện thành một sự cố: cờ <code>-a</code> xoá mọi cái ảnh không gắn với một container đang chạy — kể cả bản phát hành trước mà lẽ ra bạn sẽ quay lui về — còn <code>--volumes</code> xoá mọi volume vô danh không ai dùng, mà trên một máy chủ từng chạy Postgres thiếu volume có tên thì nghĩa là cơ sở dữ liệu (engine cũ hơn bản 23 còn xoá cả volume có tên; ngày nay việc đó cần <code>docker volume prune -a</code>). Thứ tự an toàn là <code>builder prune</code>, rồi <code>image prune</code> (không có <code>-a</code>), rồi <code>container prune</code>, kiểm <code>df</code> sau mỗi bước; chừng đó lấy lại phần lớn dung lượng mà không đặt gì vào thế nguy. Nếu volume đúng là vấn đề thì hãy liệt kê chúng theo tên và xác nhận từng cái bằng tay. Và hãy coi cả chuyện này như một tín hiệu: một máy chủ chạm 90% đĩa một lần thì sẽ chạm lại, nên cách chữa là xoay vòng log, một việc dọn theo lịch và đưa việc dựng ảnh ra khỏi máy chủ — chứ không phải một lượt prune to hơn.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Có bốn thứ phình ra — ảnh, cache dựng, volume và file log — và chỉ ba cái đầu hiện trong <code>docker system df</code>. Hãy prune theo thứ tự an toàn: <code>builder</code>, rồi <code>image</code>, rồi <code>container</code>, và đừng bao giờ dùng <code>system prune -a --volumes</code> hay <code>volume prune -a</code> trên một máy chủ có dữ liệu. Và năm phép kiểm viết thành script (đĩa, không khoẻ, restart, điểm cuối health, bản sao lưu có tồn tại) bắt được gần hết những gì kéo sập một trang nhỏ — kể cả cái việc dọn dẹp đã lặng lẽ ngừng chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Quiz: production|||11.6 — Trắc nghiệm: production',
      slug: 'dk-11-6-quiz',
      type: 'QUIZ',
      description: 'Mười tình huống vận hành thật: worker không quay lại sau reboot, đọc một vòng lặp sập, OOM giết Postgres, heap của Node trong container, swap ngầm, log phình mà system df không thấy, daemon.json phải restart, khoảng trống khi tráo container, quay lui bằng tag commit, và prune nào xoá volume có tên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from a small production server — the kind a student project on one VPS actually meets. Each one is something you configure once, in a quiet moment, so that a loud moment resolves itself. Read every explanation after submitting, especially for the questions you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can choose a restart policy per service and explain which containers come back after a reboot — and why <code>depends_on</code> does not help then.</li>
<li>I can cause an OOM kill on purpose and prove it with exit 137, <code>OOMKilled=true</code> and the <code>oom</code> event.</li>
<li>I can set memory, swap and CPU limits in compose and read them back with <code>docker inspect</code> and <code>docker stats</code>.</li>
<li>I can find a log file that is filling the disk, rescue the space and configure rotation in compose and in <code>daemon.json</code>.</li>
<li>I can deploy by commit tag, measure the gap, catch a broken release with <code>up -d --wait</code> and roll back with one command.</li>
<li>I can clean a disk in a safe order and name the prune that would delete a named volume.</li>
</ul>
${slide('dk-11', 31, 'Bảng tra nhanh Chương 11')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Mười tình huống từ một máy chủ production nhỏ — đúng loại mà một dự án sinh viên chạy trên một con VPS thật sự gặp. Mỗi câu là một thứ bạn cấu hình một lần, vào một lúc yên ắng, để một lúc ồn ào tự nó được giải quyết. Đọc mọi lời giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chọn được chính sách restart cho từng dịch vụ và giải thích được container nào quay lại sau reboot — và vì sao lúc đó <code>depends_on</code> không giúp gì.</li>
<li>Tôi cố ý gây được một cú OOM và chứng minh nó bằng exit 137, <code>OOMKilled=true</code> và sự kiện <code>oom</code>.</li>
<li>Tôi đặt được trần bộ nhớ, swap và CPU trong compose rồi đọc lại bằng <code>docker inspect</code> và <code>docker stats</code>.</li>
<li>Tôi tìm được file log đang làm đầy đĩa, cứu lại chỗ trống và cấu hình xoay vòng trong compose lẫn <code>daemon.json</code>.</li>
<li>Tôi deploy được theo tag commit, đo được khoảng trống, bắt được bản hỏng bằng <code>up -d --wait</code> và quay lui bằng một lệnh.</li>
<li>Tôi dọn được đĩa theo thứ tự an toàn và gọi đúng tên lệnh prune sẽ xoá một volume có tên.</li>
</ul>
${slide('dk-11', 31, 'Bảng tra nhanh Chương 11')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'After an overnight kernel update the VPS rebooted. The web and API are back, but the email worker is not running and docker ps -a shows it Exited. Its compose entry has restart: on-failure. What explains it?|||Sau bản vá nhân, VPS tự khởi động lại trong đêm. Web và API đã lên lại, nhưng worker gửi email không chạy và docker ps -a hiện nó Exited. Trong compose nó có restart: on-failure. Điều gì giải thích chuyện này?',
            options: [
              'on-failure only restarts after a crash with a non-zero exit, so a reboot left it untouched; the API also started earlier because it has a healthcheck|||on-failure chỉ khởi động lại sau cú sập có mã khác 0, nên reboot không đụng tới nó; API lên trước vì có healthcheck',
              'on-failure containers are not started when the daemon starts; only always and unless-stopped come back after a reboot|||Container on-failure không được bật khi daemon khởi động; chỉ always và unless-stopped quay lại sau reboot',
              'The worker depends_on the API, and Docker waited for the API to become healthy but the timeout expired during boot|||Worker depends_on API, và Docker đã chờ API khoẻ nhưng hết thời gian chờ trong lúc khởi động máy',
              'Docker stops retrying on-failure containers after five attempts by default, and the reboot counted as those attempts|||Mặc định Docker ngừng thử lại container on-failure sau năm lần, và lần reboot đã tính vào số lần đó',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: When dockerd starts, it brings back containers whose policy is always or unless-stopped (unless you had stopped them yourself); no and on-failure stay down. The depends_on option is tempting, but the daemon knows nothing about it on boot — it only orders docker compose up. There is no default cap of five: on-failure retries forever unless you write on-failure:N.|||VI: Khi dockerd khởi động, nó mang về những container có chính sách always hoặc unless-stopped (trừ cái bạn đã tự dừng); no và on-failure nằm im. Phương án depends_on nghe hợp lý, nhưng lúc boot daemon không biết gì về nó — nó chỉ sắp thứ tự cho docker compose up. Cũng không có trần mặc định năm lần: on-failure thử lại mãi trừ khi bạn ghi on-failure:N.',
          },
          {
            question: 'docker ps shows "api Restarting (1) 3 seconds ago", and docker inspect -f "{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}" api prints "10 1 false". What is the most sensible next step?|||docker ps hiện "api Restarting (1) 3 seconds ago", và docker inspect -f "{{.RestartCount}} {{.State.ExitCode}} {{.State.OOMKilled}}" api in "10 1 false". Bước tiếp theo hợp lý nhất là gì?',
            options: [
              'Raise the memory limit, because a container that keeps restarting is almost always being killed by the OOM killer|||Tăng trần bộ nhớ, vì một container cứ khởi động lại gần như luôn là bị kẻ giết OOM hạ',
              'Wait: Docker restarts every 100 ms forever, so the loop will fix itself once the database comes up|||Chờ thôi: Docker khởi động lại mỗi 100 ms mãi mãi, nên vòng lặp sẽ tự hết khi cơ sở dữ liệu lên',
              'Remove the restart policy so the container stays down and its logs stop growing while you investigate|||Bỏ chính sách restart để container nằm im và log thôi phình trong lúc bạn điều tra',
              'Read docker logs --tail of the last attempt: exit 1 with OOMKilled=false means the program itself fails on start|||Đọc docker logs --tail của lần thử cuối: exit 1 kèm OOMKilled=false nghĩa là chính chương trình hỏng khi khởi động',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Ten restarts is a loop; exit code 1 is the application choosing to fail; OOMKilled=false rules out the memory limit. So the answer is in the application logs of the newest attempt. The memory option ignores the evidence, and the "every 100 ms" option is wrong twice: the delay starts near 0.1 s and doubles (measured 0.14 → 25.6 s), capped at a minute.|||VI: Mười lần restart là một vòng lặp; mã 1 là ứng dụng tự báo lỗi; OOMKilled=false loại trừ trần bộ nhớ. Vậy câu trả lời nằm trong log của lần thử mới nhất. Phương án tăng bộ nhớ bỏ qua bằng chứng, còn phương án "mỗi 100 ms" sai hai chỗ: độ trễ bắt đầu gần 0,1 giây rồi nhân đôi (đo được 0,14 → 25,6 giây), trần một phút.',
          },
          {
            question: 'On a 6 GB VPS with no memory limits, a leaking image worker grew to 4 GB. Now Postgres and the API are down, and the worker is still running. What happened, and what prevents it?|||Trên một VPS 6 GB không đặt trần bộ nhớ, con worker xử lý ảnh bị rò phình lên 4 GB. Giờ Postgres và API chết, còn worker vẫn chạy. Chuyện gì đã xảy ra, và cái gì ngăn được?',
            options: [
              'The host ran out of RAM and the kernel OOM killer chose the biggest process, Postgres; a limits.memory on every service makes the leaking worker the only victim|||Máy cạn RAM và kẻ giết OOM của nhân chọn tiến trình to nhất là Postgres; limits.memory cho mọi dịch vụ khiến worker rò rỉ là nạn nhân duy nhất',
              'Docker noticed the worker used more than half the host and paused the other containers to protect it; docker unpause fixes it|||Docker thấy worker dùng quá nửa máy nên tạm dừng các container khác để bảo vệ nó; docker unpause là xong',
              'Postgres crashed from disk pressure caused by the worker writing swap; adding more swap to the VPS prevents it next time|||Postgres sập vì áp lực đĩa do worker ghi swap; thêm swap cho VPS sẽ ngăn được lần sau',
              'The API depends_on Postgres, so compose stopped both when Postgres used too much memory; removing depends_on prevents it|||API depends_on Postgres, nên compose dừng cả hai khi Postgres dùng quá nhiều bộ nhớ; bỏ depends_on là ngăn được',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Without cgroup limits the only ceiling is the whole machine, and the kernel picks its victim by score — usually the largest process, often the database. With a limit, the kernel kills the worker at its own ceiling (exit 137, OOMKilled=true) and nothing else notices. More swap only makes the host slower before the same end; Docker never pauses containers on its own, and compose does not stop services at runtime.|||VI: Không có trần cgroup thì trần duy nhất là cả cái máy, và nhân chọn nạn nhân theo điểm — thường là tiến trình to nhất, rất hay là cơ sở dữ liệu. Có trần thì nhân giết worker ở trần của chính nó (exit 137, OOMKilled=true) và không ai khác hay biết. Thêm swap chỉ làm máy chậm hơn trước cùng một kết cục; Docker không bao giờ tự pause container, và compose không dừng dịch vụ lúc đang chạy.',
          },
          {
            question: 'Your Node 22 API has limits.memory: 512M and no NODE_OPTIONS. Inside the container, v8.getHeapStatistics().heap_size_limit is measured. What will you see, and what should you do?|||API Node 22 của bạn có limits.memory: 512M và không có NODE_OPTIONS. Bên trong container bạn đo v8.getHeapStatistics().heap_size_limit. Bạn sẽ thấy gì, và nên làm gì?',
            options: [
              'About 2 GB, because Node sizes the heap from the host RAM; set --max-old-space-size below 512 or it will be OOM-killed under load|||Khoảng 2 GB, vì Node tính heap từ RAM máy chủ; đặt --max-old-space-size dưới 512 kẻo bị OOM giết khi có tải',
              'Exactly 512 MB, because Docker rewrites the heap size to match the cgroup; nothing needs to be set|||Đúng 512 MB, vì Docker viết lại kích thước heap cho khớp cgroup; không cần đặt gì',
              'About 259 MB — Node 20+ reads the cgroup limit and takes about half; set --max-old-space-size to about 75% of the limit|||Khoảng 259 MB — Node 20+ đọc trần cgroup và lấy khoảng một nửa; đặt --max-old-space-size khoảng 75% trần',
              'About 4 GB, because V8 always reserves 4 GB on 64-bit systems; the value is meaningless inside containers|||Khoảng 4 GB, vì V8 luôn giữ sẵn 4 GB trên hệ 64-bit; giá trị này vô nghĩa trong container',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Measured in this chapter: node:22-alpine and node:20-alpine with -m 512m report 259 MB; node:18-alpine reports 2096 MB. The 2 GB option is the attractive one because it was true for Node 18 and older — and many old articles still say it. On Node 20+ the default is safe but conservative, so setting the flag (e.g. 384 for 512M) makes the number a decision. Docker never rewrites a runtime setting.|||VI: Đo trong chương này: node:22-alpine và node:20-alpine với -m 512m báo 259 MB; node:18-alpine báo 2096 MB. Phương án 2 GB hấp dẫn vì nó đúng với Node 18 trở về trước — và nhiều bài viết cũ vẫn nói vậy. Trên Node 20+ mặc định an toàn nhưng dè dặt, nên đặt cờ (vd 384 cho 512M) để con số là một quyết định. Docker không bao giờ viết lại thiết lập của bộ chạy.',
          },
          {
            question: 'A compose service sets only deploy.resources.limits.memory: 64M. docker inspect shows Memory=67108864 and MemorySwap=134217728. On a laptop with swap, a leak in this service makes everything slow instead of an exit 137. What is the reliable fix?|||Một dịch vụ compose chỉ đặt deploy.resources.limits.memory: 64M. docker inspect hiện Memory=67108864 và MemorySwap=134217728. Trên laptop có swap, chỗ rò của dịch vụ này làm mọi thứ chậm thay vì exit 137. Cách sửa chắc chắn là gì?',
            options: [
              'Add memswap_limit: 64M so RAM + swap equals the memory limit — the container then has no swap and dies at its ceiling|||Thêm memswap_limit: 64M để RAM + swap bằng trần bộ nhớ — container khi đó không có swap và chết đúng ở trần',
              'Add mem_swappiness: 0, which tells the kernel never to swap this container on every current Linux|||Thêm mem_swappiness: 0, thứ bảo nhân không bao giờ swap container này trên mọi bản Linux hiện nay',
              'Double the memory limit to 128M, because 134217728 shows the container actually needs twice as much RAM|||Tăng gấp đôi trần lên 128M, vì 134217728 cho thấy container thật sự cần gấp đôi RAM',
              'Set reservations.memory: 64M, which turns the soft limit into a hard one and disables swap for the service|||Đặt reservations.memory: 64M, thứ biến trần mềm thành trần cứng và tắt swap cho dịch vụ',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: MemorySwap is RAM + swap, so 134217728 = 64 MiB RAM + 64 MiB swap: a memory limit alone allows the same amount again in swap. memswap_limit equal to memory removes it. mem_swappiness is the tempting answer, but on cgroup v2 (current Ubuntu, Fedora, Docker Desktop) Docker prints "Memory swappiness discarded" and ignores it — measured in 11.2. Reservations are a soft hint and never disable swap.|||VI: MemorySwap là RAM + swap, nên 134217728 = 64 MiB RAM + 64 MiB swap: chỉ đặt trần bộ nhớ thì vẫn được thêm bấy nhiêu swap. memswap_limit bằng memory bỏ phần đó đi. mem_swappiness là đáp án hấp dẫn, nhưng trên cgroup v2 (Ubuntu, Fedora, Docker Desktop hiện nay) Docker in "Memory swappiness discarded" rồi bỏ qua — đã đo ở 11.2. Reservations chỉ là gợi ý mềm, không bao giờ tắt swap.',
          },
          {
            question: 'df -h /var/lib/docker shows 94% used, but docker system df shows only a few GB, and docker ps -s reports the api container at 4.1kB. Where is the space most likely going?|||df -h /var/lib/docker báo dùng 94%, nhưng docker system df chỉ hiện vài GB, và docker ps -s báo container api chỉ 4.1kB. Chỗ trống nhiều khả năng đang đi đâu?',
            options: [
              'Into the writable layer of api, which docker ps -s under-reports when the container is running|||Vào tầng ghi của api, thứ mà docker ps -s báo thiếu khi container đang chạy',
              'Into dangling images, which docker system df hides unless you pass -v|||Vào ảnh dangling, thứ docker system df giấu đi trừ khi bạn thêm -v',
              'Into the container log files under /var/lib/docker/containers, which neither command counts; json-file without max-size grows forever|||Vào file log của container trong /var/lib/docker/containers, thứ mà cả hai lệnh đều không đếm; json-file không có max-size thì phình mãi',
              'Into the swap file Docker creates for containers that have no memswap_limit|||Vào file swap mà Docker tạo cho những container không có memswap_limit',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: In this chapter 300,000 lines produced a 33 MB json.log while docker ps -s said 4.1kB — the log is not part of the writable layer, and docker system df counts images, containers, volumes and build cache only. du on /var/lib/docker/containers finds it. The writable-layer option is attractive but backwards: ps -s is exact for the layer; the log simply is not in it. Docker creates no swap files.|||VI: Trong chương này 300.000 dòng tạo ra file json.log 33 MB trong khi docker ps -s nói 4.1kB — log không thuộc tầng ghi, và docker system df chỉ đếm ảnh, container, volume và cache build. du trên /var/lib/docker/containers mới thấy nó. Phương án tầng ghi hấp dẫn nhưng ngược: ps -s đo tầng ghi chính xác; chỉ là log không nằm trong đó. Docker không tạo file swap nào.',
          },
          {
            question: 'You add "log-opts": {"max-size": "10m", "max-file": "3"} to /etc/docker/daemon.json and run sudo systemctl reload docker. A week later the old api container log is still growing. Why?|||Bạn thêm "log-opts": {"max-size": "10m", "max-file": "3"} vào /etc/docker/daemon.json rồi chạy sudo systemctl reload docker. Một tuần sau log của container api cũ vẫn phình. Vì sao?',
            options: [
              'max-size needs a unit in capitals ("10M"); lowercase is silently ignored by the json-file driver|||max-size cần đơn vị viết hoa ("10M"); viết thường thì driver json-file lặng lẽ bỏ qua',
              'log-opts cannot be changed by a reload, and even after a restart only new containers get them — restart dockerd at a quiet time and recreate the container|||log-opts không đổi được bằng reload, và kể cả sau restart thì chỉ container mới nhận — restart dockerd lúc vắng rồi tạo lại container',
              'daemon.json only applies to containers started with docker run, never to containers created by docker compose|||daemon.json chỉ áp cho container chạy bằng docker run, không bao giờ áp cho container do docker compose tạo',
              'Rotation needs compress: true as well; without compression Docker keeps writing to the first file|||Xoay vòng cần thêm compress: true; không nén thì Docker cứ ghi vào file đầu tiên',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The dockerd reference lists what a reload (SIGHUP) can change — debug, labels, live-restore, registry settings… — and log-driver/log-opts are not on it; the logging docs add that existing containers keep their old configuration. So: restart the daemon (which stops containers unless live-restore is on) and recreate. Units are case-insensitive, compose containers do use daemon defaults, and compress is optional.|||VI: Tài liệu tham chiếu dockerd liệt kê những gì một lần reload (SIGHUP) đổi được — debug, labels, live-restore, thiết lập registry… — và log-driver/log-opts không nằm trong đó; tài liệu log thêm rằng container đang có giữ cấu hình cũ. Vậy: restart daemon (việc này dừng container nếu chưa bật live-restore) rồi tạo lại. Đơn vị không phân biệt hoa thường, container của compose vẫn dùng mặc định của daemon, và compress là tuỳ chọn.',
          },
          {
            question: 'Deploying a new API image with docker compose up -d, a probe calling the API every 50 ms counted 26 failed requests over 2.2 seconds, although up -d itself returned in 0.34 s and the old container stopped in 0.2 s. What does the gap measure?|||Khi deploy ảnh API mới bằng docker compose up -d, một script gọi API mỗi 50 ms đếm được 26 request lỗi trong 2,2 giây, dù bản thân up -d trả về sau 0,34 giây và container cũ dừng trong 0,2 giây. Khoảng trống đó đo cái gì?',
            options: [
              'The time compose spends pulling the new image, which up -d does silently in the background|||Thời gian compose kéo ảnh mới, việc up -d làm âm thầm ở chế độ nền',
              'The default 10-second grace period, shortened because the container handled SIGTERM|||Thời gian ân hạn mặc định 10 giây, được rút ngắn vì container đã bắt SIGTERM',
              'The DNS cache of the probe, which keeps resolving the old container IP for two seconds|||Bộ đệm DNS của script thăm dò, thứ vẫn phân giải IP container cũ trong hai giây',
              'How long the NEW container needs before it can answer — here its 2-second start-up; only a second replica or a quieter moment hides it|||Thời gian container MỚI cần trước khi trả lời được — ở đây là 2 giây khởi động của nó; chỉ một bản sao thứ hai hoặc lúc vắng người mới che được',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Recreate means stop the old one, then start the new one; between the two nothing listens on the port. With graceful shutdown the stop is short (0.2 s measured), so the gap is dominated by the new container getting ready — the demo API waits 2 s, like one connecting to a database. The grace-period option is attractive, but the grace period only matters when the app ignores SIGTERM; no pull happened because the image was already local.|||VI: Tạo lại nghĩa là dừng cái cũ rồi mới chạy cái mới; ở giữa không ai nghe cổng. Có tắt tử tế thì lúc dừng rất ngắn (đo được 0,2 giây), nên khoảng trống chủ yếu là thời gian container mới sẵn sàng — API demo chờ 2 giây, như một API phải nối cơ sở dữ liệu. Phương án thời gian ân hạn hấp dẫn, nhưng ân hạn chỉ có ý nghĩa khi app phớt lờ SIGTERM; cũng không có lượt kéo ảnh nào vì ảnh đã có sẵn trên máy.',
          },
          {
            question: 'Release 5b502fc answers HTTP 500 to everything. It contained no database migration. The previous release was e76553c, and the compose file uses image: api:${TAG}. What is the fastest safe rollback?|||Bản 5b502fc trả HTTP 500 cho mọi thứ. Nó không có migration cơ sở dữ liệu nào. Bản trước là e76553c, và file compose dùng image: api:${TAG}. Cách quay lui nhanh và an toàn nhất là gì?',
            options: [
              'git revert 5b502fc, push, and wait for CI to build a new image before deploying it|||git revert 5b502fc, push, rồi chờ CI dựng ảnh mới trước khi deploy',
              'docker system prune -a to remove the broken image, then docker compose up -d so compose rebuilds from source|||docker system prune -a để xoá ảnh hỏng, rồi docker compose up -d để compose dựng lại từ mã nguồn',
              'TAG=e76553c docker compose up -d --no-build api — the previous image still exists under its commit tag|||TAG=e76553c docker compose up -d --no-build api — ảnh trước vẫn còn dưới tag commit của nó',
              'Find the old image with docker images --filter dangling=true and docker tag it as api:latest|||Tìm ảnh cũ bằng docker images --filter dangling=true rồi docker tag nó thành api:latest',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: With commit tags, the previous release has a name, so rollback is one command (measured: 0.35 s plus the app start-up). git revert is the durable fix afterwards, not the emergency step. The dangling-image trick is attractive but unreliable on Docker 29 with the containerd image store: an image that loses its tag disappears instead of becoming <none> — tested in 11.4. And prune -a would delete the good previous image too.|||VI: Có tag theo commit thì bản trước có tên, nên quay lui là một lệnh (đo được: 0,35 giây cộng thời gian khởi động app). git revert là cách chữa bền vững sau đó, không phải bước cấp cứu. Mẹo ảnh dangling hấp dẫn nhưng không đáng tin trên Docker 29 với kho ảnh containerd: ảnh mất tag là biến mất chứ không thành <none> — đã thử ở 11.4. Còn prune -a thì xoá luôn cả ảnh tốt của bản trước.',
          },
          {
            question: 'On Docker Engine 29, a stack was taken down with docker compose down (no -v), so its named volume pgdata is unused. Which command would delete pgdata?|||Trên Docker Engine 29, một stack đã bị hạ bằng docker compose down (không có -v), nên volume có tên pgdata đang không ai dùng. Lệnh nào sẽ xoá pgdata?',
            options: [
              'docker volume prune -a — since Engine 23, only -a (all) reaches named volumes|||docker volume prune -a — từ Engine 23, chỉ -a (all) mới với tới volume có tên',
              'docker volume prune — it removes every volume that no container uses|||docker volume prune — nó xoá mọi volume không container nào dùng',
              'docker system prune --volumes — it removes every unused volume, named or not|||docker system prune --volumes — nó xoá mọi volume không dùng, có tên hay không',
              'docker builder prune -a — build cache and volumes share the same storage|||docker builder prune -a — cache dựng và volume dùng chung một chỗ lưu',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Tested in 11.5 with a label filter: plain volume prune removed only the anonymous volume, and pgdata went only with -a. Since API 1.42 (Engine 23) volume prune and system prune --volumes are limited to anonymous volumes — the attractive "every unused volume" answers describe older engines. Anonymous volumes still hold real data (a Postgres started without -v), so neither command is harmless.|||VI: Đã thử ở 11.5 với bộ lọc nhãn: volume prune thường chỉ xoá volume vô danh, còn pgdata chỉ đi khi có -a. Từ API 1.42 (Engine 23), volume prune và system prune --volumes chỉ giới hạn ở volume vô danh — các đáp án "mọi volume không dùng" hấp dẫn là mô tả engine cũ. Volume vô danh vẫn có thể chứa dữ liệu thật (Postgres chạy thiếu -v), nên không lệnh nào là vô hại.',
          },
        ],
      },
    },
  ],
};
