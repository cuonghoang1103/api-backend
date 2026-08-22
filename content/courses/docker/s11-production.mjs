/**
 * Docker — Chương 11: chạy trên production.
 * Chính sách restart · hạn mức tài nguyên & exit 137 · log & xoay log · cập nhật không gián đoạn & CI/CD · đĩa & giám sát · quiz.
 * Output CHẠY THẬT Docker Engine 27 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fdocker%2Flearn&reflabel=Docker';

export default {
  title: 'Chapter 11 — Running it in production|||Chương 11 — Chạy trên production',
  description: 'Cái stack chạy được rồi; giờ nó phải sống sót qua khởi động lại máy, qua rò rỉ bộ nhớ, qua log đầy đĩa, qua một lượt deploy hỏng, và qua việc bạn đang ngủ. Chương này là những cái cờ và thói quen biến "chạy được trên máy tôi" thành "chạy được lúc 3 giờ sáng".',
  lessons: [
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">no</span><span class="lz-t">the default; never restarted</span><span class="lz-d">Correct for migrations, seeds, one-off jobs, anything whose <em>job</em> is to exit. Wrong for every long-running service, and it is what you get by omitting the key.</span></div>
  <div class="lz-step"><span class="lz-k">on-failure[:5]</span><span class="lz-t">only on a non-zero exit, optionally capped</span><span class="lz-d">A clean exit is respected. Right for a batch worker that legitimately finishes; the count limit stops an unfixable failure from retrying forever.</span></div>
  <div class="lz-step"><span class="lz-k">unless-stopped</span><span class="lz-t">always, except after an explicit stop</span><span class="lz-d"><strong>The production default.</strong> Comes back after a crash and after a host reboot, but if you ran <code>docker stop</code> to work on something, it stays stopped until you say otherwise.</span></div>
  <div class="lz-step"><span class="lz-k">always</span><span class="lz-t">always, even one you deliberately stopped</span><span class="lz-d">Restarts on daemon start regardless of the state you left it in. Occasionally what you want; usually a surprise when a container you stopped last week reappears after a reboot.</span></div>
</div>
<pre><code><span class="tok-comment"># Watch a crash loop and the backoff</span>
docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'
sleep 25 &amp;&amp; docker inspect -f '{{ .RestartCount }} restarts, state={{ .State.Status }}' flaky</code></pre>
<div class="out">4 restarts, state=restarting</div>
<p>Docker does not hammer: the delay doubles from 100ms up to a one-minute ceiling, and resets once the container stays up for ten seconds. That is why a container failing every two seconds shows four restarts in twenty-five, not twelve — and why a genuinely broken service settles into a slow, quiet loop instead of consuming the machine.</p>

<h3>A reboot does not always bring the stack back</h3>
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

<h3>Reading a crash loop</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">no</span><span class="lz-t">mặc định; không bao giờ khởi động lại</span><span class="lz-d">Đúng cho migration, seed, việc chạy một lần, mọi thứ mà <em>việc</em> của nó là thoát. Sai cho mọi dịch vụ chạy dài, và đó là thứ bạn nhận được khi bỏ trống cái khoá này.</span></div>
  <div class="lz-step"><span class="lz-k">on-failure[:5]</span><span class="lz-t">chỉ khi thoát khác 0, có thể đặt trần</span><span class="lz-d">Một lần thoát sạch được tôn trọng. Đúng cho một worker theo lô kết thúc một cách chính đáng; giới hạn số lần ngăn một cái hỏng không sửa được cứ thử lại mãi.</span></div>
  <div class="lz-step"><span class="lz-k">unless-stopped</span><span class="lz-t">luôn luôn, trừ khi bạn dừng tường minh</span><span class="lz-d"><strong>Mặc định của production.</strong> Quay lại sau một cú sập và sau một lần khởi động lại máy, nhưng nếu bạn đã chạy <code>docker stop</code> để làm gì đó thì nó nằm yên cho tới khi bạn nói khác đi.</span></div>
  <div class="lz-step"><span class="lz-k">always</span><span class="lz-t">luôn luôn, kể cả cái bạn cố tình dừng</span><span class="lz-d">Khởi động lại lúc daemon lên bất kể bạn để nó ở trạng thái nào. Thỉnh thoảng đúng ý bạn; thường thì là một bất ngờ khi một container bạn dừng từ tuần trước bỗng hiện lại sau một lần khởi động máy.</span></div>
</div>
<pre><code><span class="tok-comment"># Xem một vòng lặp sập và độ trễ tăng dần</span>
docker run -d --name flaky --restart on-failure alpine:3.20 sh -c 'sleep 2; exit 1'
sleep 25 &amp;&amp; docker inspect -f '{{ .RestartCount }} restarts, state={{ .State.Status }}' flaky</code></pre>
<div class="out">4 restarts, state=restarting</div>
<p>Docker không nện liên hồi: độ trễ nhân đôi từ 100ms lên tới trần một phút, và đặt lại khi container đứng vững được mười giây. Đó là lý do một container hỏng cứ hai giây một lần chỉ hiện bốn lần khởi động lại trong hai mươi lăm giây chứ không phải mười hai — và cũng là lý do một dịch vụ hỏng thật sẽ lắng vào một vòng lặp chậm và im ắng thay vì ngốn hết cả cái máy.</p>

<h3>Khởi động lại máy không phải lúc nào cũng mang stack trở lại</h3>
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

<h3>Đọc một vòng lặp sập</h3>
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

<h3>Setting limits in compose</h3>
<pre><code>services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.5"
        reservations:
          memory: 256M
    mem_swappiness: 0            <span class="tok-comment"># do not paper over a leak with swap</span>
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
  <div class="kv"><span class="k"><code>mem_swappiness: 0</code></span><span class="v">Without it, a leaking container can push the host into swap and make <em>everything</em> slow instead of dying quickly. A fast, obvious failure beats a slow, mysterious one.</span></div>
  <div class="kv"><span class="k">Runtime heap below the container limit</span><span class="v">Node's default heap is sized from the <em>host's</em> memory, not the cgroup's. Without <code>--max-old-space-size</code>, Node happily plans for 4GB inside a 512MB container and gets killed before its own GC ever runs.</span></div>
</div>

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
<pre><code>docker run --rm -m 512m node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"
docker run --rm -m 512m -e NODE_OPTIONS=--max-old-space-size=384 node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"</code></pre>
<div class="out">heap cap: 2048MB
heap cap: 386MB</div>
<p>The first container plans to use up to 2GB of heap inside a 512MB limit. Its garbage collector will not become aggressive until it approaches 2GB, which it will never reach — the kernel kills it at 512MB first. The symptom is a container that OOMs under load while its logs show plenty of free heap, and the fix is one environment variable. The same applies to the JVM (<code>-XX:MaxRAMPercentage</code>) and to any runtime that sizes itself from <code>/proc/meminfo</code>.</p>

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
<p class="note-ct"><strong>Three things to remember.</strong> Set a memory limit on every long-running service, or one leak takes down the whole host — including the database, which the kernel will pick because it is the biggest. Exit 137 means SIGKILL; <code>docker inspect -f '{{ .State.OOMKilled }}'</code> tells you whether it was the memory limit or something else. And tell the runtime about the limit: Node sizes its heap from the host's RAM unless you set <code>--max-old-space-size</code> below the container's ceiling.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Hạn mức, và mã thoát 137</h2>
<p class="lead">Không có hạn mức thì một container được phép dùng mọi byte và mọi nhân của cái máy. Điều đó tiện tới đúng khoảnh khắc một tiến trình rò rỉ kéo cả máy chủ xuống — kể cả cơ sở dữ liệu — thay vì chỉ kéo chính nó. Hạn mức biến một cú sập toàn phần thành một container được khởi động lại, và đó là toàn bộ cuộc đánh đổi.</p>

<h3>Cái hỏng mà chúng ngăn được</h3>
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

<h3>Đặt hạn mức trong compose</h3>
<pre><code>services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.5"
        reservations:
          memory: 256M
    mem_swappiness: 0            <span class="tok-comment"># đừng lấy swap che một chỗ rò</span>
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
  <div class="kv"><span class="k"><code>mem_swappiness: 0</code></span><span class="v">Không có nó thì một container rò rỉ có thể đẩy máy chủ vào swap và làm <em>MỌI THỨ</em> chậm thay vì chết nhanh. Một cái hỏng nhanh và rõ ràng tốt hơn một cái hỏng chậm và bí ẩn.</span></div>
  <div class="kv"><span class="k">Heap của bộ chạy phải thấp hơn hạn mức container</span><span class="v">Heap mặc định của Node được tính từ bộ nhớ của <em>MÁY CHỦ</em>, không phải của cgroup. Không có <code>--max-old-space-size</code>, Node vui vẻ lập kế hoạch dùng 4GB bên trong một container 512MB rồi bị giết trước khi bộ gom rác của chính nó kịp chạy.</span></div>
</div>

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
<pre><code>docker run --rm -m 512m node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"
docker run --rm -m 512m -e NODE_OPTIONS=--max-old-space-size=384 node:22-alpine \\
  node -e "console.log('heap cap:', (require('v8').getHeapStatistics().heap_size_limit/1048576).toFixed(0)+'MB')"</code></pre>
<div class="out">heap cap: 2048MB
heap cap: 386MB</div>
<p>Container đầu tiên lập kế hoạch dùng tới 2GB heap bên trong một hạn mức 512MB. Bộ gom rác của nó sẽ không trở nên quyết liệt cho tới khi tiến gần 2GB, con số mà nó không bao giờ đạt tới — nhân giết nó ở mốc 512MB trước. Triệu chứng là một container chết OOM khi có tải trong khi log của nó cho thấy heap còn trống thoải mái, và cách chữa là một biến môi trường. Điều tương tự áp cho JVM (<code>-XX:MaxRAMPercentage</code>) và cho mọi bộ chạy tự tính kích thước từ <code>/proc/meminfo</code>.</p>

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
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy đặt hạn mức bộ nhớ cho mọi dịch vụ chạy dài, không thì một chỗ rò kéo sập cả máy chủ — kể cả cơ sở dữ liệu, thứ mà nhân sẽ chọn vì nó lớn nhất. Mã 137 nghĩa là SIGKILL; <code>docker inspect -f '{{ .State.OOMKilled }}'</code> nói cho bạn biết đó là do hạn mức bộ nhớ hay do thứ khác. Và hãy nói cho bộ chạy biết về cái hạn mức: Node tính heap từ RAM của máy chủ trừ khi bạn đặt <code>--max-old-space-size</code> thấp hơn trần của container.</p>
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
<pre><code>docker inspect -f '{{ .LogPath }}' blog-api-1
sudo ls -lh "$(docker inspect -f '{{ .LogPath }}' blog-api-1)"
docker inspect -f '{{ .HostConfig.LogConfig.Type }} {{ .HostConfig.LogConfig.Config }}' blog-api-1</code></pre>
<div class="out">/var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
-rw-r----- 1 root root 4.1G Aug 22 13:31 /var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
json-file map[]</div>
<div class="callout warn"><strong>4.1GB, and <code>map[]</code> means no rotation configured.</strong> That file grows until the disk is full, and it is not counted anywhere obvious — <code>docker system df</code> does not show it, because it is not an image, a container layer or a volume. A server that reports plenty of Docker space can still be out of disk. <code>docker logs</code> reads this file, which is also why <code>docker logs</code> on a busy container can take a very long time.</div>

<h3>Rotation, two places to set it</h3>
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
sudo systemctl reload docker
docker info --format 'driver={{ .LoggingDriver }}'</code></pre>
<div class="out">driver=json-file</div>
<div class="callout ok"><strong>Set it in <code>daemon.json</code> and set it in compose.</strong> The daemon default protects every container anyone starts on that host — including the one-off <code>docker run</code> someone leaves attached for a week. The compose entry documents the intent where a reviewer will see it, and travels with the project to a new server. Note that a daemon-level change applies only to containers created <em>after</em> the reload, so recreate the existing ones.</div>

<h3>The drivers worth knowing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>json-file</code></span><span class="v">The default. Works with <code>docker logs</code>, keeps a file per container, and does not rotate unless configured. Use it, with <code>max-size</code>.</span></div>
  <div class="kv"><span class="k"><code>local</code></span><span class="v">Docker's own format: rotation on by default, more compact, faster. The catch is that only Docker can read it — no tailing the file directly with standard tools.</span></div>
  <div class="kv"><span class="k"><code>journald</code></span><span class="v">Hands logs to systemd, which already rotates and already has retention policy. Good on a systemd host; <code>journalctl -u docker CONTAINER_NAME=blog-api-1</code> becomes your reader.</span></div>
  <div class="kv"><span class="k">Remote drivers</span><span class="v"><code>syslog</code>, <code>fluentd</code>, <code>gelf</code>, <code>awslogs</code>. They ship logs off the host, which is the real answer at scale — but <code>docker logs</code> stops working, and a blocking driver can stall your application if the collector is down.</span></div>
  <div class="kv"><span class="k"><code>mode: non-blocking</code></span><span class="v">Buffers instead of blocking the container's writes when the driver is slow. Essential with any remote driver: without it, a log collector outage becomes an application outage.</span></div>
</div>

<h3>Cleaning up after it has already happened</h3>
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

<div class="pitfall"><strong>Pitfall:</strong> reclaiming space with <code>rm</code> on a container's log file. The container still holds the file open, so the kernel keeps the blocks allocated until that process exits — <code>df</code> shows the disk just as full, and now <code>docker logs</code> is broken too, because the file it reads no longer exists at that path. <code>truncate -s 0</code> is the correct move: it frees the blocks immediately, the running container keeps writing to the same open file handle, and <code>docker logs</code> continues working. Then configure <code>max-size</code> so you do not do this again — and remember that a daemon-level change only applies to containers created after the reload, so recreate the existing ones.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The default <code>json-file</code> driver never rotates: set <code>max-size</code> and <code>max-file</code> in <code>daemon.json</code> <em>and</em> in compose, and recreate containers afterwards. Log files live outside everything <code>docker system df</code> counts, so a host can be out of disk while Docker reports plenty of room. And to reclaim space from a running container's log, <code>truncate -s 0</code> — deleting the file frees nothing until the process exits.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Log, xoay log, và cái đĩa đầy</h2>
<p class="lead">Docker hứng mọi thứ tiến trình của bạn ghi ra stdout với stderr rồi lưu trên máy chủ. Đó là một thiết kế tốt, và nó có đúng một mặc định nguy hiểm: với driver <code>json-file</code> tiêu chuẩn, KHÔNG có gì xoay vòng trừ khi bạn bảo nó xoay. Một dịch vụ lắm lời sẽ làm đầy đĩa, và trên một con VPS nhỏ thì cái đĩa nó làm đầy chính là cái đang chứa cơ sở dữ liệu của bạn.</p>

<h3>Log thật ra nằm ở đâu</h3>
<pre><code>docker inspect -f '{{ .LogPath }}' blog-api-1
sudo ls -lh "$(docker inspect -f '{{ .LogPath }}' blog-api-1)"
docker inspect -f '{{ .HostConfig.LogConfig.Type }} {{ .HostConfig.LogConfig.Config }}' blog-api-1</code></pre>
<div class="out">/var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
-rw-r----- 1 root root 4.1G Aug 22 13:31 /var/lib/docker/containers/9f2a…c1/9f2a…c1-json.log
json-file map[]</div>
<div class="callout warn"><strong>4,1GB, và <code>map[]</code> nghĩa là chưa cấu hình xoay vòng gì cả.</strong> Cái file đó phình tới khi đĩa đầy, và nó không được tính vào chỗ nào dễ thấy — <code>docker system df</code> không hiện nó, vì nó không phải một cái ảnh, một lớp container hay một volume. Một máy chủ báo rằng Docker còn nhiều chỗ vẫn có thể đã hết đĩa. <code>docker logs</code> đọc chính file này, và đó cũng là lý do <code>docker logs</code> trên một container bận rộn có thể chạy rất lâu.</div>

<h3>Xoay vòng, hai chỗ để đặt</h3>
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
sudo systemctl reload docker
docker info --format 'driver={{ .LoggingDriver }}'</code></pre>
<div class="out">driver=json-file</div>
<div class="callout ok"><strong>Hãy đặt trong <code>daemon.json</code> VÀ đặt trong compose.</strong> Mặc định ở mức daemon bảo vệ mọi container mà bất kỳ ai khởi động trên máy đó — kể cả cái <code>docker run</code> dùng một lần mà ai đó để chạy suốt một tuần. Mục trong compose ghi lại ý định ở chỗ người review sẽ nhìn thấy, và nó đi theo dự án sang một máy chủ mới. Lưu ý một thay đổi ở mức daemon chỉ áp cho những container tạo ra SAU lần nạp lại, nên hãy dựng lại những cái đang có.</div>

<h3>Những driver đáng biết</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>json-file</code></span><span class="v">Mặc định. Chạy được với <code>docker logs</code>, giữ một file cho mỗi container, và không xoay vòng nếu không cấu hình. Cứ dùng nó, kèm <code>max-size</code>.</span></div>
  <div class="kv"><span class="k"><code>local</code></span><span class="v">Định dạng riêng của Docker: xoay vòng bật sẵn, gọn hơn, nhanh hơn. Đổi lại chỉ Docker đọc được nó — không đọc trực tiếp file bằng công cụ thông thường được.</span></div>
  <div class="kv"><span class="k"><code>journald</code></span><span class="v">Giao log cho systemd, thứ vốn đã xoay vòng và đã có chính sách lưu giữ. Tốt trên máy chủ dùng systemd; khi đó <code>journalctl -u docker CONTAINER_NAME=blog-api-1</code> là công cụ đọc của bạn.</span></div>
  <div class="kv"><span class="k">Driver từ xa</span><span class="v"><code>syslog</code>, <code>fluentd</code>, <code>gelf</code>, <code>awslogs</code>. Chúng đẩy log ra khỏi máy chủ, và đó mới là câu trả lời thật khi quy mô lớn — nhưng <code>docker logs</code> ngừng chạy, và một driver kiểu chặn có thể làm treo ứng dụng của bạn nếu bên thu thập chết.</span></div>
  <div class="kv"><span class="k"><code>mode: non-blocking</code></span><span class="v">Đệm lại thay vì chặn các lệnh ghi của container khi driver chậm. Bắt buộc với mọi driver từ xa: không có nó, một sự cố của bên thu thập log biến thành một sự cố của ứng dụng.</span></div>
</div>

<h3>Dọn dẹp sau khi chuyện đã xảy ra</h3>
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

<div class="pitfall"><strong>Bẫy:</strong> lấy lại chỗ trống bằng cách <code>rm</code> file log của một container. Container vẫn giữ file đó mở, nên nhân vẫn giữ nguyên các khối đã cấp cho tới khi tiến trình ấy thoát — <code>df</code> vẫn báo đĩa đầy y như cũ, và giờ thì <code>docker logs</code> cũng hỏng nốt, vì file nó đọc không còn tồn tại ở đường dẫn đó nữa. <code>truncate -s 0</code> mới là nước đi đúng: nó giải phóng các khối ngay lập tức, container đang chạy vẫn ghi tiếp vào cùng cái file handle đang mở, và <code>docker logs</code> vẫn chạy. Rồi hãy cấu hình <code>max-size</code> để bạn không phải làm lại chuyện này — và nhớ rằng thay đổi ở mức daemon chỉ áp cho container tạo sau lần nạp lại, nên hãy dựng lại những cái đang có.</div>
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

<h3>Shut down gracefully, and the gap shrinks</h3>
<pre><code><span class="tok-comment">// Handle the signal Docker actually sends</span>
const server = app.listen(3000);
const shutdown = async (sig) =&gt; {
  console.log(&#96;\${sig}: draining&#96;);
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

<h3>Build elsewhere, swap here</h3>
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
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: \${{ github.actor }}, password: \${{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          file: Dockerfile.backend
          tags: ghcr.io/\${{ github.repository }}/api:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          push: true
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            cd /home/deployer/repo
            export TAG=\${{ github.sha }}
            docker compose -f compose.yaml -f compose.prod.yaml pull
            docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
            ./ops/smoke-test.sh</code></pre>
<div class="callout warn"><strong>Do not make deploying a side effect of <code>git push</code>.</strong> This repository ran two deploy workflows on every push to <code>main</code> and they raced each other into real outages twice: once a feed returning 500 because the schema lagged the image, once a backend recreate race leaving <code>Exited(137)</code> and orphan containers. Both workflows are now <code>workflow_dispatch</code> only, and deploying is a script a person runs. Pushing code and changing production are different decisions; keep them separate, and if you do wire them together, add a <code>concurrency</code> group so two deploys can never overlap.</div>

<h3>Rolling back in forty seconds</h3>
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

<h3>Tắt máy tử tế, và khoảng trống co lại</h3>
<pre><code><span class="tok-comment">// Xử lý đúng cái tín hiệu Docker thật sự gửi</span>
const server = app.listen(3000);
const shutdown = async (sig) =&gt; {
  console.log(&#96;\${sig}: draining&#96;);
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

<h3>Dựng ở nơi khác, tráo ở đây</h3>
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
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: \${{ github.actor }}, password: \${{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with:
          file: Dockerfile.backend
          tags: ghcr.io/\${{ github.repository }}/api:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          push: true
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.VPS_HOST }}
          username: \${{ secrets.VPS_USER }}
          key: \${{ secrets.VPS_SSH_PRIVATE_KEY }}
          script: |
            cd /home/deployer/repo
            export TAG=\${{ github.sha }}
            docker compose -f compose.yaml -f compose.prod.yaml pull
            docker compose -f compose.yaml -f compose.prod.yaml up -d --no-build
            ./ops/smoke-test.sh</code></pre>
<div class="callout warn"><strong>Đừng biến việc deploy thành hệ quả phụ của một lệnh <code>git push</code>.</strong> Kho này từng chạy hai workflow deploy ở mọi lần push vào <code>main</code> và chúng đua nhau tới hai sự cố thật: một lần feed trả 500 vì schema chạy sau cái ảnh, một lần backend đua nhau dựng lại để lại <code>Exited(137)</code> cùng container mồ côi. Giờ cả hai workflow chỉ còn <code>workflow_dispatch</code>, và deploy là một script do một CON NGƯỜI chạy. Đẩy mã lên và thay đổi production là hai quyết định khác nhau; hãy giữ chúng tách bạch, và nếu bạn có nối chúng lại thì hãy thêm một nhóm <code>concurrency</code> để hai lượt deploy không bao giờ chồng lên nhau.</div>

<h3>Quay lui trong bốn mươi giây</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker builder prune -f</span><span class="lz-t">safest and usually the biggest win</span><span class="lz-d">Removes build cache only. Nothing running is affected; the next build is slower and that is the entire cost. Start here.</span></div>
  <div class="lz-step"><span class="lz-k">docker image prune -f</span><span class="lz-t">removes dangling (untagged) images</span><span class="lz-d">Layers no tag points at any more. Safe, though it is also where a rollback image may be hiding if the tag was reused (Lesson 11.4).</span></div>
  <div class="lz-step"><span class="lz-k">docker container prune -f</span><span class="lz-t">removes stopped containers</span><span class="lz-d">Their logs go with them, which is often what you actually wanted to reclaim. Check nothing stopped is waiting to be inspected.</span></div>
  <div class="lz-step"><span class="lz-k">docker system prune -a --volumes</span><span class="lz-t">⛔ removes tagged images and named volumes too</span><span class="lz-d">The <code>-a</code> deletes every image not currently in use, and <code>--volumes</code> deletes data. On a production host this is the command that turns a disk-space problem into a data-loss incident.</span></div>
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
<div class="callout warn"><strong>Volumes still show 7.6GB reclaimable, and this is where you stop and look.</strong> <code>docker volume ls --filter dangling=true</code> lists them by name; read every line before deciding. A named volume shows as dangling whenever its container is recreated, which happens on every deploy — so "dangling" routinely includes the database of a service that is mid-restart. This is the one prune that deserves a human reading the list, not a <code>-f</code>.</div>

<h3>A cleanup job that runs itself</h3>
<pre><code><span class="tok-comment"># /etc/cron.weekly/docker-cleanup — or a scheduled CI job over ssh</span>
#!/usr/bin/env bash
set -Eeuo pipefail
BEFORE=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')

docker builder prune -f --filter 'until=168h' &gt;/dev/null
docker image   prune -f --filter 'until=168h' &gt;/dev/null
docker container prune -f --filter 'until=24h' &gt;/dev/null
<span class="tok-comment"># deliberately NOT pruning volumes — that stays a human decision</span>

AFTER=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')
echo "docker-cleanup: \${BEFORE}G → \${AFTER}G free"
[ "$AFTER" -lt 8 ] &amp;&amp; curl -fsS "https://hc-ping.com/$HC_UUID/fail" || curl -fsS "https://hc-ping.com/$HC_UUID"</code></pre>
<div class="out">docker-cleanup: 6G → 21G free</div>
<div class="callout ok"><strong>Note the last line: it reports success <em>and</em> failure to a heartbeat service.</strong> A cleanup job that silently stops running is worse than no cleanup job, because you have stopped watching the disk on the assumption that something else is. Pinging on success means the absence of a ping is itself an alert — the pattern from Lesson 7.5, and the reason this project runs a weekly VPS cleanup workflow whose secrets are documented as never-delete.</div>

<h3>The minimum monitoring worth having</h3>
<pre><code><span class="tok-comment"># ops/watch.sh — five checks, one cron, no infrastructure</span>
#!/usr/bin/env bash
set -Eeuo pipefail
fail() { echo "ALERT: $*"; curl -fsS --data-urlencode "text=$*" "$SLACK_HOOK" &gt;/dev/null; }

<span class="tok-comment"># 1 · disk</span>
avail=$(df --output=pcent /var/lib/docker | tail -1 | tr -dc '0-9')
[ "$avail" -gt 85 ] &amp;&amp; fail "disk \${avail}% full on $(hostname)"

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

<div class="pitfall"><strong>Pitfall:</strong> reaching for <code>docker system prune -a --volumes</code> when a server is out of disk. It is the command that appears first in search results and it is the one that turns an inconvenience into an incident: <code>-a</code> removes every image not attached to a running container — including the previous release you would have rolled back to — and <code>--volumes</code> removes named volumes, which on a production host means the database. The safe order is <code>builder prune</code>, then <code>image prune</code> (no <code>-a</code>), then <code>container prune</code>, checking <code>df</code> between each; that recovers most of the space with nothing at risk. If volumes really are the problem, list them by name and confirm each one by hand. And treat the whole episode as a signal: a server that reaches 90% disk once will reach it again, so the fix is log rotation, a scheduled cleanup and moving builds off the host — not a bigger prune.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Four things grow — images, build cache, volumes and log files — and only the first three appear in <code>docker system df</code>. Prune in order of safety: <code>builder</code>, then <code>image</code>, then <code>container</code>, and never <code>-a --volumes</code> on a host with data. And five scripted checks (disk, unhealthy, restarts, health endpoint, backup exists) catch nearly everything that takes a small site down — including the cleanup job that quietly stopped running.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Đĩa, dọn dẹp, và biết trước người dùng</h2>
<p class="lead">Docker tích tụ. Những cái ảnh bạn đã thay, container bạn đã dừng, cache dựng từ mọi lượt deploy, volume từ những lần thử nghiệm — tất cả nằm lại cho tới khi có thứ gì xoá chúng. Trên một con VPS một đĩa, đống tích tụ đó rốt cuộc gặp cơ sở dữ liệu của bạn, và cái hỏng khi ấy là toàn phần chứ không phải từ từ.</p>

<h3>Bốn thứ phình ra</h3>
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
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">docker builder prune -f</span><span class="lz-t">an toàn nhất và thường lãi nhất</span><span class="lz-d">Chỉ xoá cache dựng. Không thứ gì đang chạy bị ảnh hưởng; lượt dựng kế tiếp chậm hơn và đó là toàn bộ cái giá. Hãy bắt đầu ở đây.</span></div>
  <div class="lz-step"><span class="lz-k">docker image prune -f</span><span class="lz-t">xoá những ảnh mồ côi (không nhãn)</span><span class="lz-d">Những lớp không còn nhãn nào trỏ tới. An toàn, dù đây cũng là chỗ một cái ảnh để quay lui có thể đang nấp nếu cái nhãn đã bị dùng lại (Bài 11.4).</span></div>
  <div class="lz-step"><span class="lz-k">docker container prune -f</span><span class="lz-t">xoá những container đã dừng</span><span class="lz-d">Log của chúng đi theo luôn, và đó thường mới là thứ bạn thật sự muốn lấy lại. Hãy kiểm xem không có container dừng nào đang chờ được soi.</span></div>
  <div class="lz-step"><span class="lz-k">docker system prune -a --volumes</span><span class="lz-t">⛔ xoá cả ảnh có nhãn lẫn volume có tên</span><span class="lz-d">Cờ <code>-a</code> xoá mọi cái ảnh hiện không được dùng — kể cả bản phát hành trước mà bạn định quay lui về — còn <code>--volumes</code> xoá DỮ LIỆU. Trên một máy chủ production, đây là câu lệnh biến một vấn đề thiếu đĩa thành một sự cố mất dữ liệu.</span></div>
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
<div class="callout warn"><strong>Volume vẫn hiện 7,6GB lấy lại được, và đây là chỗ bạn dừng lại và NHÌN.</strong> <code>docker volume ls --filter dangling=true</code> liệt kê chúng theo tên; hãy đọc từng dòng trước khi quyết. Một volume có tên hiện ra là dangling mỗi khi container của nó được dựng lại, chuyện xảy ra ở MỌI lượt deploy — nên "dangling" thường xuyên bao gồm cả cơ sở dữ liệu của một dịch vụ đang khởi động lại dở. Đây là lượt prune duy nhất xứng đáng có một con người đọc danh sách, chứ không phải một cái <code>-f</code>.</div>

<h3>Một việc dọn tự chạy</h3>
<pre><code><span class="tok-comment"># /etc/cron.weekly/docker-cleanup — hoặc một việc CI theo lịch chạy qua ssh</span>
#!/usr/bin/env bash
set -Eeuo pipefail
BEFORE=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')

docker builder prune -f --filter 'until=168h' &gt;/dev/null
docker image   prune -f --filter 'until=168h' &gt;/dev/null
docker container prune -f --filter 'until=24h' &gt;/dev/null
<span class="tok-comment"># CỐ Ý không prune volume — chuyện đó vẫn là quyết định của con người</span>

AFTER=$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')
echo "docker-cleanup: \${BEFORE}G → \${AFTER}G free"
[ "$AFTER" -lt 8 ] &amp;&amp; curl -fsS "https://hc-ping.com/$HC_UUID/fail" || curl -fsS "https://hc-ping.com/$HC_UUID"</code></pre>
<div class="out">docker-cleanup: 6G → 21G free</div>
<div class="callout ok"><strong>Để ý dòng cuối: nó báo cáo cả THÀNH CÔNG lẫn thất bại về một dịch vụ nhịp tim.</strong> Một việc dọn dẹp lặng lẽ ngừng chạy còn tệ hơn không có việc dọn nào, vì bạn đã thôi canh cái đĩa với giả định rằng có thứ khác đang canh hộ. Ping khi thành công nghĩa là sự VẮNG MẶT của một cú ping tự nó là một cảnh báo — đúng cái mẫu ở Bài 7.5, và là lý do dự án này chạy một workflow dọn VPS hằng tuần mà các bí mật của nó được ghi rõ là không-bao-giờ-xoá.</div>

<h3>Mức giám sát tối thiểu đáng có</h3>
<pre><code><span class="tok-comment"># ops/watch.sh — năm phép kiểm, một dòng cron, không cần hạ tầng</span>
#!/usr/bin/env bash
set -Eeuo pipefail
fail() { echo "ALERT: $*"; curl -fsS --data-urlencode "text=$*" "$SLACK_HOOK" &gt;/dev/null; }

<span class="tok-comment"># 1 · đĩa</span>
avail=$(df --output=pcent /var/lib/docker | tail -1 | tr -dc '0-9')
[ "$avail" -gt 85 ] &amp;&amp; fail "disk \${avail}% full on $(hostname)"

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

<div class="pitfall"><strong>Bẫy:</strong> với tay lấy <code>docker system prune -a --volumes</code> khi một máy chủ hết đĩa. Đó là câu lệnh xuất hiện đầu tiên trong kết quả tìm kiếm và là câu lệnh biến một sự bất tiện thành một sự cố: cờ <code>-a</code> xoá mọi cái ảnh không gắn với một container đang chạy — kể cả bản phát hành trước mà lẽ ra bạn sẽ quay lui về — còn <code>--volumes</code> xoá volume có tên, mà trên một máy chủ production nghĩa là cơ sở dữ liệu. Thứ tự an toàn là <code>builder prune</code>, rồi <code>image prune</code> (không có <code>-a</code>), rồi <code>container prune</code>, kiểm <code>df</code> sau mỗi bước; chừng đó lấy lại phần lớn dung lượng mà không đặt gì vào thế nguy. Nếu volume đúng là vấn đề thì hãy liệt kê chúng theo tên và xác nhận từng cái bằng tay. Và hãy coi cả chuyện này như một tín hiệu: một máy chủ chạm 90% đĩa một lần thì sẽ chạm lại, nên cách chữa là xoay vòng log, một việc dọn theo lịch và đưa việc dựng ảnh ra khỏi máy chủ — chứ không phải một lượt prune to hơn.</div>
<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Có bốn thứ phình ra — ảnh, cache dựng, volume và file log — và chỉ ba cái đầu hiện trong <code>docker system df</code>. Hãy prune theo thứ tự an toàn: <code>builder</code>, rồi <code>image</code>, rồi <code>container</code>, và đừng bao giờ dùng <code>-a --volumes</code> trên một máy chủ có dữ liệu. Và năm phép kiểm viết thành script (đĩa, không khoẻ, restart, điểm cuối health, bản sao lưu có tồn tại) bắt được gần hết những gì kéo sập một trang nhỏ — kể cả cái việc dọn dẹp đã lặng lẽ ngừng chạy.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Quiz: production|||11.6 — Trắc nghiệm: production',
      slug: 'dk-11-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về chính sách restart, mã thoát 137, heap của Node so với hạn mức container, xoay log, truncate với rm, và quay lui khi đã có migration.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on running a stack you cannot watch all the time. Each of these is something you configure once, in a quiet moment, so that a loud moment resolves itself.</p>
<div class="callout ok">Aim for 7/8. The three that matter most: why an unlimited container can kill your database (11.2), why <code>json-file</code> fills the disk by default (11.3), and why deleting a log file frees nothing (11.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về việc chạy một stack mà bạn không thể canh suốt. Mỗi câu là một thứ bạn cấu hình một lần, vào một lúc yên ắng, để một lúc ồn ào tự nó được giải quyết.</p>
<div class="callout ok">Nhắm 7/8. Ba câu quan trọng nhất: vì sao một container không hạn mức có thể giết cơ sở dữ liệu của bạn (11.2), vì sao <code>json-file</code> mặc định làm đầy đĩa (11.3), và vì sao xoá một file log chẳng giải phóng được gì (11.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which restart policy is the right default for a long-running production service, and why?|||Chính sách restart nào là mặc định đúng cho một dịch vụ production chạy dài, và vì sao?',
            options: [
              'always — it guarantees the container is never down|||always — nó bảo đảm container không bao giờ chết',
              'unless-stopped — it survives crashes and host reboots but respects a deliberate docker stop while you work on it|||unless-stopped — nó sống sót qua sập và qua khởi động lại máy nhưng tôn trọng một lệnh docker stop có chủ đích khi bạn đang làm việc với nó',
              'on-failure:5 — it stops retrying an unfixable problem|||on-failure:5 — nó ngừng thử lại với một vấn đề không sửa được',
              'no — restarts hide bugs|||no — khởi động lại là che giấu lỗi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A container exits with code 137. What does that tell you, and what confirms the cause?|||Một container thoát với mã 137. Điều đó nói lên gì, và cái gì xác nhận nguyên nhân?',
            options: [
              'An application error; read the exception in the logs|||Một lỗi ứng dụng; hãy đọc ngoại lệ trong log',
              'A clean SIGTERM shutdown; nothing to investigate|||Một lần tắt SIGTERM sạch sẽ; không có gì phải điều tra',
              'A failed healthcheck; check the healthcheck command|||Một healthcheck hỏng; hãy kiểm câu lệnh healthcheck',
              '128 + 9, so SIGKILL — usually the memory limit; docker inspect -f "{{ .State.OOMKilled }}" confirms whether it was OOM or something else like docker kill|||128 + 9, tức SIGKILL — thường là do hạn mức bộ nhớ; docker inspect -f "{{ .State.OOMKilled }}" xác nhận đó là OOM hay thứ khác như docker kill',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'You set `memory: 512M` on a Node service, but it still OOMs under load while its logs show free heap. What is missing?|||Bạn đặt `memory: 512M` cho một dịch vụ Node, nhưng nó vẫn chết OOM khi có tải trong khi log cho thấy heap còn trống. Thiếu cái gì?',
            options: [
              'Node sizes its heap from the HOST\'s memory, so it plans for ~2GB inside a 512MB container and is killed before its GC gets aggressive — set NODE_OPTIONS=--max-old-space-size below the limit|||Node tính heap từ bộ nhớ của MÁY CHỦ, nên nó lập kế hoạch cho khoảng 2GB bên trong một container 512MB rồi bị giết trước khi bộ gom rác kịp quyết liệt — hãy đặt NODE_OPTIONS=--max-old-space-size thấp hơn hạn mức',
              'The memory limit needs mem_reservation set too|||Hạn mức bộ nhớ cần đặt kèm mem_reservation',
              'Compose ignores deploy.resources outside Swarm|||Compose phớt lờ deploy.resources ngoài Swarm',
              'The container needs a larger shm_size|||Container cần shm_size lớn hơn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why can a host be out of disk while `docker system df` reports plenty of free space?|||Vì sao một máy chủ có thể hết đĩa trong khi `docker system df` báo còn nhiều chỗ trống?',
            options: [
              'system df only counts running containers|||system df chỉ đếm các container đang chạy',
              'The disk is fragmented|||Đĩa bị phân mảnh',
              'Container log files are not images, layers or volumes, so they appear in none of its categories — a json-file log with no max-size can be gigabytes|||File log của container không phải ảnh, lớp hay volume, nên chúng không nằm trong hạng mục nào của nó — một file log json-file không có max-size có thể lên tới nhiều gigabyte',
              'system df excludes the build cache|||system df loại trừ cache dựng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A container log file is 4GB. You run `rm` on it. What happens?|||Một file log của container nặng 4GB. Bạn chạy `rm` lên nó. Chuyện gì xảy ra?',
            options: [
              'Nothing is freed — the container holds the file open so the blocks stay allocated until it exits, and docker logs is now broken too; truncate -s 0 is the correct move|||Không giải phóng được gì — container vẫn giữ file mở nên các khối vẫn được cấp cho tới khi nó thoát, và giờ docker logs cũng hỏng; truncate -s 0 mới là nước đi đúng',
              '4GB is freed immediately and logging continues|||4GB được giải phóng ngay và việc ghi log tiếp tục',
              'Docker recreates the file and rotation starts working|||Docker tạo lại file và xoay vòng bắt đầu chạy',
              'The container is restarted automatically|||Container được khởi động lại tự động',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should a deploy build images somewhere other than the production host?|||Vì sao một lượt deploy nên dựng ảnh ở nơi khác chứ không phải trên máy chủ production?',
            options: [
              'Docker cannot build and run on the same host|||Docker không thể vừa dựng vừa chạy trên cùng một máy chủ',
              'Registry images are more secure than local ones|||Ảnh trên registry an toàn hơn ảnh cục bộ',
              'Builds compete for CPU and memory with the live site and fill the disk with cache — the same disk the database is on; the server should only pull and swap|||Việc dựng tranh CPU và bộ nhớ với chính trang đang chạy và làm đầy đĩa bằng cache — đúng cái đĩa chứa cơ sở dữ liệu; máy chủ chỉ nên kéo ảnh về và tráo',
              'It is required for multi-arch images|||Nó bắt buộc với ảnh đa kiến trúc',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A deploy that included a database migration has broken production. Can you fix it by re-deploying the previous image tag?|||Một lượt deploy có kèm migration cơ sở dữ liệu đã làm hỏng production. Bạn chữa được bằng cách deploy lại nhãn ảnh trước đó không?',
            options: [
              'Yes — compose reverts migrations when the image changes|||Được — compose tự hoàn tác migration khi ảnh đổi',
              'Not safely — reverting code does not revert the schema, and the old code may not run against the new one; this needs a deliberate decision, not a reflex|||Không an toàn — quay lui mã KHÔNG quay lui schema, và mã cũ có thể không chạy được trên schema mới; chuyện này cần một quyết định có chủ đích, không phải phản xạ',
              'Yes — Prisma detects the version mismatch and adapts|||Được — Prisma phát hiện lệch phiên bản rồi tự thích ứng',
              'Only if you also run docker compose down -v first|||Chỉ khi bạn chạy docker compose down -v trước',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your server is at 96% disk. Which command should you NOT reach for first?|||Máy chủ của bạn đã dùng 96% đĩa. Câu lệnh nào bạn KHÔNG nên với tới đầu tiên?',
            options: [
              'docker builder prune -f|||docker builder prune -f',
              'docker image prune -f|||docker image prune -f',
              'docker system prune -a --volumes — the -a deletes the image you would roll back to and --volumes deletes your database; prune builder, then image, then container instead|||docker system prune -a --volumes — cờ -a xoá mất cái ảnh bạn định quay lui về còn --volumes xoá cơ sở dữ liệu của bạn; hãy prune builder, rồi image, rồi container',
              'truncate -s 0 on oversized container logs|||truncate -s 0 lên những file log container quá khổ',
            ],
            correctIndex: 2,
            points: 1,
          },
        ],
      },
    },
  ],
};
