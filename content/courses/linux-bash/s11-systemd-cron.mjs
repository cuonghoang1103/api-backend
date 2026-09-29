/**
 * Linux & Bash — Chương 11: systemd, cron & quản trị.
 * Unit của systemd · hẹn giờ và cron · gia cố máy chủ · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 * Nâng cấp 28/09/2026: bài 11.0 slide (deck lx-11, 26 slide) + slide/🧪/🗂/📌 trong 11.1–11.3; đào sâu: lịch sử init,
 * Wants/Requires/After đo thật (Requires không theo khi sập ⇒ BindsTo), StartLimitIntervalSec trong [Service] bị BỎ QUA
 * (đã sửa unit mẫu), RestartSec làm giới hạn vô dụng, tên trần trong ExecStart được tra 4 thư mục cố định (đã sửa câu
 * "không bao giờ tra PATH"), mã 203/200/217 đo thật, systemd-run; cron: PATH thật của cron Ubuntu (đã sửa output cũ
 * PATH=/usr/bin:/bin), crontab nhận phút 61, cron ⇄ OnCalendar (đã sửa câu "dán dòng cron vào systemd-analyze"),
 * UTC vs +07 và CRON_TZ bị Ubuntu lờ, dấu chấm trong cron.d, flock -E và fd; gia cố: 01- vs 50-cloud-init (đã sửa tên
 * file mẫu 99-), sshd -T không tính Match (-C), ssh.socket đổi cổng, fail2ban mức nền, unattended-upgrades chạy bằng
 * timer; quiz 10 câu. Output MỚI chạy thật trong container ubuntu:24.04 có systemd 255 (arm64), Fedora 44, macOS 27.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 11 — systemd, cron & administration|||Chương 11 — systemd, cron & quản trị',
  description: 'Chạy ứng dụng của bạn như một dịch vụ tự khởi động lại, hẹn giờ công việc, và gia cố một máy chủ. Đây là chương biến "tôi chạy nó bằng nohup" thành một thứ sống sót qua khởi động lại máy, tự dậy khi sập, và ghi log vào đúng chỗ.',
  lessons: [
    /* ─────────────────────────── 11.0 ─────────────────────────── */
    {
      title: '11.0 — Chapter 11 slides: services, schedules and hardening in pictures|||11.0 — Slide Chương 11: dịch vụ, lịch chạy và gia cố bằng hình',
      slug: 'lnx-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 26 slide của Chương 11: lịch sử init, file unit, Wants/Requires/After đo thật, vòng đời Restart= và giới hạn tần suất, mã 203/200/217, drop-in và hộp cát, cron 5 trường, cron ⇄ OnCalendar, môi trường của cron, UTC và +07, timer, flock, sshd "giá trị đầu tiên thắng", ssh.socket, fail2ban và unattended-upgrades.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Slides</span>
<h2>The whole chapter in 26 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: where systemd came from, a unit file read line by line, what <code>Wants=</code>, <code>Requires=</code> and <code>After=</code> really do when a database fails (measured, not guessed), the <code>Restart=</code> life cycle and the rate limit that silently stops working, a cron line taken apart field by field, why a backup written for 2am ran at 9am, and the order in which <code>sshd</code> reads its drop-ins.</p>
<p>Slides 3–8 belong to Lesson 11.1 (units and services), 9–15 to 11.2 (cron and timers) and 16–21 to 11.3 (hardening a server). The last five are the chapter's common mistakes, an Ubuntu/Fedora/macOS/WSL comparison, a two-page cheat sheet and a 45-minute practice session. Every terminal is real output recorded on 28/09/2026 in an Ubuntu 24.04 container running real systemd 255, on a Fedora 44 machine and on a Mac. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Slide</span>
<h2>Cả chương trong 26 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: systemd từ đâu ra, một file unit đọc từng dòng, <code>Wants=</code>, <code>Requires=</code> và <code>After=</code> thật sự làm gì khi cơ sở dữ liệu hỏng (đo, không đoán), vòng đời <code>Restart=</code> và cái giới hạn tần suất lặng lẽ mất tác dụng, một dòng cron tháo ra từng trường, vì sao bản sao lưu viết cho 2 giờ sáng lại chạy lúc 9 giờ, và thứ tự <code>sshd</code> đọc các file drop-in.</p>
<p>Slide 3–8 thuộc Bài 11.1 (unit và dịch vụ), 9–15 thuộc 11.2 (cron và timer), 16–21 thuộc 11.3 (gia cố máy chủ). Năm slide cuối là những sai lầm hay gặp, bảng so sánh Ubuntu/Fedora/macOS/WSL, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 trong một container Ubuntu 24.04 chạy systemd 255 thật, trên máy Fedora 44 và trên Mac — con số trên máy bạn sẽ khác, quy luật thì không.</p>
</div>
${gallery('lx-11', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Từ SysV init tới systemd'], [4, 'Một unit = một file INI ba mục'], [5, 'Wants, Requires, After đo thật'],
  [6, 'Vòng đời Restart= và giới hạn tần suất'], [7, 'Mã 203/200/217 trong status và journal'], [8, 'Drop-in, hộp cát, security'],
  [9, 'Một dòng cron: 5 trường'], [10, 'cron ⇄ OnCalendar, systemd-analyze calendar'], [11, 'Môi trường của cron, tên có dấu chấm'],
  [12, 'Máy UTC, bạn +07'], [13, 'Timer = .timer + .service'], [14, 'cron hay timer'], [15, 'flock'],
  [16, 'Sáu lớp phòng thủ'], [17, 'sshd: giá trị đầu tiên thắng'], [18, 'ssh.socket giữ cổng'], [19, 'fail2ban'],
  [20, 'unattended-upgrades'], [21, 'Giờ đầu tiên: 8 việc'],
  [22, 'Sai lầm hay gặp'], [23, 'Ubuntu · Fedora · macOS · WSL'], [24, 'Bảng tra nhanh (1/2)'], [25, 'Bảng tra nhanh (2/2)'], [26, 'Thực hành chương 11'],
])}
`,
    },
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — systemd units: running your app as a service|||11.1 — Unit của systemd: chạy ứng dụng của bạn như một dịch vụ',
      slug: 'lnx-11-1-systemd-unit',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một unit là gì, các động từ của systemctl, viết một file service từ đầu, Restart= và các cờ chống vòng lặp sập, chạy dưới một người dùng riêng, và những chỉ thị hộp cát đáng bật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Running your app as a service</h2>
<p class="lead">Lesson 5.4 ended with a rule: <code>nohup</code> and <code>tmux</code> survive a dropped connection but not a reboot, and anything that matters belongs in a service manager. This is that lesson. A twelve-line file gets you automatic start at boot, restart on crash, logs in the journal, a dedicated user, and a documented way for the next person to stop it.</p>

<h3>Why a service manager — a little history</h3>
${slide('lx-11', 3, 'Từ SysV init tới systemd: ai trông các dịch vụ')}
<p>Every process on Linux has a parent (Lesson 5.1). The first process the kernel starts — <strong>PID 1</strong>, generically called <em>init</em> — is the ancestor of everything else, and it decides which services run at boot, in what order, and who brings them back when they die. Linux has been through three generations of init:</p>
<table>
<tr><th>Generation</th><th>Born</th><th>How it works</th><th>Weak spot</th></tr>
<tr><td>SysV init</td><td>UNIX System V (1983)</td><td>One shell script per service in <code>/etc/init.d/</code> implementing <code>start|stop|status</code> and writing its own PID file; run one after another by number</td><td>Sequential and slow; every vendor wrote scripts differently; nobody restarts a crashed service</td></tr>
<tr><td>Upstart</td><td>Ubuntu 6.10 (2006), Scott James Remnant</td><td><em>Event</em>-driven: "when the network is up, start X"</td><td>Only Ubuntu (and Fedora for a while) used it</td></tr>
<tr><td>systemd</td><td>30/03/2010, Lennart Poettering and Kay Sievers</td><td><strong>Declarative</strong> files (units), parallel start ordered by dependencies, every child process tracked in a cgroup, logs collected in the journal</td><td>Large and does many jobs — the reason for a long community debate</td></tr>
</table>
<p>Fedora 15 (05/2011) was the first major distribution to use systemd by default; Debian 8 and Ubuntu 15.04 (both 04/2015) followed. As of 09/2026 almost every distribution you will meet on a server — Ubuntu, Debian, Fedora, RHEL/Rocky, Arch — runs systemd (Ubuntu 24.04 ships systemd 255, Fedora 44 ships 259). The exceptions worth remembering are containers (usually no init at all) and Alpine (OpenRC).</p>
<p><strong>What goes wrong if you do not know it?</strong> Exactly the three things a student project on a VPS keeps hitting: an app started with <code>nohup</code> disappears after the provider reboots the box for a kernel patch; the app crashes at 2am and stays dead until someone wakes up; <code>nohup.out</code> grows until the disk is full (Lesson 10.1). The table is what a dozen-line unit file gives you that <code>nohup</code> does not:</p>
<table>
<tr><th>Job</th><th><code>nohup</code> / <code>tmux</code></th><th>systemd service</th></tr>
<tr><td>Comes back after a reboot</td><td>No</td><td><code>enable</code></td></tr>
<tr><td>Brought back after a crash</td><td>No</td><td><code>Restart=on-failure</code></td></tr>
<tr><td>Timestamped, rotated logs</td><td>One ever-growing <code>nohup.out</code></td><td><code>journalctl -u app</code></td></tr>
<tr><td>Stops child processes cleanly</td><td><code>kill</code> leaves orphans</td><td><code>systemctl stop</code> clears the whole cgroup</td></tr>
<tr><td>Unprivileged user, memory limit</td><td>Do it yourself</td><td><code>User=</code>, <code>MemoryMax=</code></td></tr>
<tr><td>The next person knows how to stop/start it</td><td>Ask you</td><td><code>systemctl status app</code></td></tr>
</table>

<h3>What a unit is</h3>
<pre><code class="language-bash">systemctl list-units --type=service --state=running | head
systemctl status nginx
systemctl cat nginx                    <span class="tok-comment"># the unit file, including drop-ins</span>
systemctl show nginx | head -20        <span class="tok-comment"># every resolved property</span></code></pre>
<div class="out">● nginx.service - A high performance web server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Fri 2026-08-22 09:14:02 UTC; 7h ago
   Main PID: 812 (nginx)
      Tasks: 3 (limit: 9432)
     Memory: 8.4M
        CPU: 1.204s
     CGroup: /system.slice/nginx.service
             ├─812 "nginx: master process /usr/sbin/nginx"
             └─813 "nginx: worker process"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Loaded</code></span><span class="v">Where the file is, and whether it is <strong>enabled</strong> (starts at boot) — a different thing from <strong>active</strong> (running now).</span></div>
  <div class="kv"><span class="k"><code>Active</code></span><span class="v">Current state and how long. <code>active (running)</code>, <code>failed</code>, <code>activating (auto-restart)</code> — the last one means it is crash-looping.</span></div>
  <div class="kv"><span class="k"><code>CGroup</code></span><span class="v">Every process systemd considers part of this service. This is why <code>systemctl stop</code> reliably kills child processes that a plain <code>kill</code> would orphan.</span></div>
</div>
<div class="callout"><strong>enabled and active are independent.</strong> A service can be running now but not set to start at boot — which works perfectly until the machine reboots at 4am after a kernel update and the application simply never comes back. <code>systemctl is-enabled myapp</code> answers it in one word, and <code>--now</code> on <code>enable</code> does both at once.</div>

<h3>The verbs</h3>
<pre><code class="language-bash">sudo systemctl start myapp
sudo systemctl stop myapp
sudo systemctl restart myapp           <span class="tok-comment"># stop then start — brief downtime</span>
sudo systemctl reload myapp            <span class="tok-comment"># SIGHUP: re-read config, keep serving (Lesson 5.3)</span>
sudo systemctl reload-or-restart myapp <span class="tok-comment"># reload if supported, else restart</span>

sudo systemctl enable myapp            <span class="tok-comment"># start at boot</span>
sudo systemctl enable --now myapp      <span class="tok-comment"># …and start it right now</span>
sudo systemctl disable --now myapp
sudo systemctl mask myapp              <span class="tok-comment"># make it UNSTARTABLE, even as a dependency</span>

systemctl is-active myapp              <span class="tok-comment"># scriptable: exit 0 if running</span>
systemctl is-enabled myapp
systemctl is-failed myapp
systemctl list-units --failed          <span class="tok-comment"># everything currently broken</span></code></pre>
<div class="callout ok"><code>systemctl list-units --failed</code> is the first command to run on a server you have just been handed. It takes one second and lists every service that tried to start and could not — often including something nobody noticed was broken weeks ago. <code>systemctl is-active</code> and friends exit 0 or non-zero without printing, which makes them usable directly in the conditionals from Lesson 6.4.</div>

<h3>Writing a service unit</h3>
${slide('lx-11', 4, 'Một unit = một file INI ba mục')}
<pre><code><span class="tok-comment"># /etc/systemd/system/myapp.service</span>
[Unit]
Description=My application
Documentation=https://github.com/me/myapp
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/srv/app
EnvironmentFile=/opt/app/.env
ExecStart=/usr/bin/node /srv/app/dist/index.js
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target</code></pre>
<pre><code class="language-bash">sudo systemctl daemon-reload           <span class="tok-comment"># REQUIRED after editing any unit file</span>
sudo systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">[Unit]</span><span class="lz-lnote">Metadata and ordering. <code>After=</code> says "start me after these", <code>Wants=</code> says "try to start these too". <code>Requires=</code> is stronger and usually too strong — if the dependency fails, your service is stopped as well.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Service]</span><span class="lz-lnote">How to run it: which command, as whom, with what environment, and what to do when it exits. This is the section that matters.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Install]</span><span class="lz-lnote">What <code>enable</code> should hook it into. <code>multi-user.target</code> means "normal boot". Without this section, <code>enable</code> has nothing to do and silently achieves nothing.</span></div>
</div>
<div class="callout warn"><strong><code>daemon-reload</code> after every edit.</strong> systemd caches unit files; without it, <code>restart</code> starts the <em>old</em> definition and your change appears to have no effect — so you edit again, restart again, and conclude the file is being ignored. Forgetting this is the single most common systemd mistake, and the symptom is indistinguishable from a config that does not work.</div>
<p>That warning is real, and systemd says it in words — if you read them. Measured in an Ubuntu 24.04 container running real systemd: change <code>RestartSec=2s</code> to <code>3s</code>, then <code>restart</code> without reloading:</p>
<div class="out">$ sudo systemctl restart myapp
Warning: The unit file, source configuration file or drop-ins of myapp.service changed on disk. Run 'systemctl daemon-reload' to reload units.
$ systemctl show myapp -p RestartUSec
RestartUSec=2s
$ sudo systemctl daemon-reload; systemctl show myapp -p RestartUSec
RestartUSec=3s</div>

<h3>Wants, Requires, After — the three most-confused words (measured)</h3>
${slide('lx-11', 5, 'Wants, Requires, After: bốn tình huống đo thật')}
<p>The <code>[Unit]</code> section holds two completely different kinds of relationship, and beginners tend to think one line does both:</p>
<ul>
<li><strong>Pulling in</strong> (requirement — "start me, start it too"): <code>Wants=</code> (soft) and <code>Requires=</code> (hard), with <code>BindsTo=</code> the strongest.</li>
<li><strong>Ordering</strong> ("I run AFTER it"): <code>After=</code> and <code>Before=</code>. On its own it pulls nothing in: <code>After=postgresql.service</code> without <code>Wants=</code>/<code>Requires=</code> only means "if both are being started, wait for postgres first".</li>
</ul>
<p>To stop guessing, this lesson built three fake units in a container: <code>db.service</code>, <code>web-wants.service</code> (<code>Wants=db.service</code> + <code>After=db.service</code>) and <code>web-req.service</code> (<code>Requires=db.service</code> + <code>After=db.service</code>), then broke <code>db</code> three ways:</p>
<table>
<tr><th>What happens to db</th><th>web-wants</th><th>web-req</th></tr>
<tr><td><code>systemctl stop db</code> (a DELIBERATE stop)</td><td>keeps running</td><td>stopped with it</td></tr>
<tr><td>db fails to start (<code>Type=oneshot</code>, command exits 1)</td><td>keeps running</td><td>NOT started — <code>Dependency failed</code></td></tr>
<tr><td>db crashes while running (<code>kill -9</code>)</td><td>keeps running</td><td><strong>STILL running</strong></td></tr>
</table>
<div class="out">$ sudo systemctl start web-req
A dependency job for web-req.service failed. See 'journalctl -xe' for details.
$ journalctl -u web-req -n 1 -o cat
web-req.service: Job web-req.service/start failed with result 'dependency'.
$ systemctl list-dependencies --reverse db
db.service
● ├─web-req.service
● └─web-wants.service</div>
<p>Two common false beliefs, both exposed by the table:</p>
<ol>
<li><strong><code>Requires=</code> does not follow a dependency that crashes on its own.</strong> It only propagates <em>deliberate</em> stops and restarts. For "if db dies, web dies too" you need <code>BindsTo=</code>. In practice the better answer is to let the application retry its database connection — Prisma, pg and every decent driver can.</li>
<li><strong><code>After=</code> only waits until the other unit has "started" by systemd's definition.</strong> With <code>Type=simple</code> (the default), "started" means <em>just forked</em> — Postgres may still be replaying WAL. This lesson's first attempt used a <code>Type=simple</code> <code>db.service</code> running <code>/usr/bin/false</code>: systemd considered it started, <code>web-req</code> came up anyway, and only then did db report failure. Only units that report real readiness (<code>Type=notify</code> like <code>postgresql@16-main</code>, or <code>Type=oneshot</code>) make <code>After=</code> wait in the sense you mean.</li>
</ol>
<div class="callout ok"><strong>The recipe for your web app:</strong> <code>Wants=</code> + <code>After=</code> for the network and the database (exactly as in the unit above), plus <code>Restart=on-failure</code> so that if the app comes up before the database the next attempt recovers. <code>Requires=</code> is rarely worth its cost.</div>

<h3>The details that decide whether it works</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Type=simple</code></span><span class="v">The default: your command runs in the foreground and stays there. Correct for almost every modern application.</span></div>
  <div class="kv"><span class="k"><code>Type=forking</code></span><span class="v">For old-style daemons that fork and exit. Needs <code>PIDFile=</code>. If your app does <em>not</em> fork and you set this, systemd waits forever and then times out.</span></div>
  <div class="kv"><span class="k"><code>Type=oneshot</code></span><span class="v">Runs to completion, then the unit is "done". For migrations and setup tasks. Pair with <code>RemainAfterExit=yes</code> if later units depend on it.</span></div>
  <div class="kv"><span class="k"><code>ExecStart=</code></span><span class="v"><strong>Prefer absolute paths.</strong> systemd does not use a shell, so no lookup in YOUR <code>PATH</code> (a bare name like <code>python3</code> is searched only in four fixed directories, <code>/usr/local/sbin</code>, <code>/usr/local/bin</code>, <code>/usr/sbin</code>, <code>/usr/bin</code> — a node installed by nvm lives elsewhere and fails with <code>203/EXEC</code>), no globs, no <code>&amp;&amp;</code>, no redirection (Lesson 8.2). If you need shell features: <code>ExecStart=/bin/bash -c '…'</code>.</span></div>
  <div class="kv"><span class="k"><code>User=</code> <code>Group=</code></span><span class="v">Run as an unprivileged account (Lesson 4.4). Without it the service runs as <strong>root</strong>, which almost nothing needs.</span></div>
  <div class="kv"><span class="k"><code>EnvironmentFile=</code></span><span class="v">Reads <code>KEY=value</code> lines. Prefix with <code>-</code> (<code>EnvironmentFile=-/opt/app/.env</code>) to make a missing file non-fatal.</span></div>
</div>
<pre><code><span class="tok-comment"># Shell features need an explicit shell</span>
ExecStart=/bin/bash -c 'exec /srv/app/bin/server &gt;&gt; /var/log/app.log 2&gt;&amp;1'

<span class="tok-comment"># Run something before and after the main process</span>
ExecStartPre=/usr/bin/npx prisma migrate deploy
ExecStopPost=/usr/local/bin/notify-deploy-stopped</code></pre>

<h3>Restart policy, and the crash loop</h3>
${slide('lx-11', 6, 'Vòng đời Restart= và giới hạn tần suất')}
<pre><code>Restart=on-failure          <span class="tok-comment"># restart on non-zero exit or a signal. The usual choice.</span>
Restart=always              <span class="tok-comment"># restart even after a clean exit 0</span>
Restart=no                  <span class="tok-comment"># the default — do NOT restart</span>
RestartSec=5s               <span class="tok-comment"># how long to wait before restarting</span>

<span class="tok-comment"># ⚠️ the next two lines belong in [Unit] — in [Service], IntervalSec is IGNORED (see below)</span>
StartLimitIntervalSec=300   <span class="tok-comment"># within a 5-minute window…</span>
StartLimitBurst=5           <span class="tok-comment"># …allow 5 starts, then give up</span></code></pre>
<div class="out">Aug 22 17:02:11 vps systemd[1]: myapp.service: Scheduled restart job, restart counter is at 5.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Start request repeated too quickly.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Failed with result 'exit-code'.</div>
<div class="callout warn"><strong>The rate limit is a feature, and it confuses people.</strong> An application that crashes on start — a missing environment variable, a database that is not up yet — restarts five times in seconds and then systemd stops trying. <code>systemctl status</code> then says <code>Start request repeated too quickly</code>, which sounds like a systemd problem and is actually "your app has failed five times, look at the journal". Fix the cause, then <code>systemctl reset-failed myapp</code> to clear the counter before starting again.</div>
<div class="callout ok">Without the limit, a crash-looping service restarts forever, filling the journal and burning CPU — and on a machine with several such services, that alone can take the box down. Five attempts in five minutes is a sensible default; raise <code>RestartSec</code> rather than the burst if a service legitimately needs to wait for something slow.</div>

<h3>Deeper: two traps in the rate limit (measured)</h3>
<p>systemd's real defaults (as of 255/259) are <code>RestartSec=100ms</code>, <code>StartLimitBurst=5</code>, <code>StartLimitIntervalSec=10s</code> — "five starts within ten seconds, then give up". An app that crashes on start burns all five in under a second:</p>
<div class="out">$ systemctl show crashy -p NRestarts -p RestartUSec -p StartLimitBurst -p StartLimitIntervalUSec
RestartUSec=100ms
NRestarts=5
StartLimitIntervalUSec=10s
StartLimitBurst=5</div>
<p><strong>Trap 1 — in the wrong section, systemd silently ignores it.</strong> <code>StartLimitIntervalSec=</code> and <code>StartLimitBurst=</code> are <code>[Unit]</code> options (since systemd 230). Written in <code>[Service]</code> — as many online tutorials do, and as the first version of this very lesson did — <code>StartLimitBurst</code> is still accepted for compatibility but <code>StartLimitIntervalSec</code> is ignored, and the window stays at 10 seconds:</p>
<div class="out">$ systemd-analyze verify sl.service
sl.service:5: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
$ systemctl show sl -p StartLimitBurst -p StartLimitIntervalUSec
StartLimitIntervalUSec=10s
StartLimitBurst=5</div>
<p>Only <code>systemd-analyze verify</code> tells you — <code>daemon-reload</code> says nothing. Run <code>verify</code> after every new unit.</p>
<p><strong>Trap 2 — a large enough <code>RestartSec</code> means the limit never trips.</strong> Keep the default 10-second window, set <code>RestartSec=3s</code> on the same broken app, wait 25 seconds:</p>
<div class="out">$ systemctl show crashy -p NRestarts -p ActiveState -p SubState
NRestarts=7
ActiveState=activating
SubState=auto-restart</div>
<p>One start every 3 seconds never fits five into 10 seconds — the service crashes and restarts forever, exactly what the limit exists to stop. The rule: <strong><code>RestartSec</code> × (<code>StartLimitBurst</code> − 1) must be smaller than <code>StartLimitIntervalSec</code></strong>, or the limit is useless. The complete unit at the end of this lesson uses 5s × 4 = 20s &lt; 300s, so it can still stop — provided those two lines sit in <code>[Unit]</code> (now fixed in the sample unit).</p>
<p>Since systemd 254 there is also <code>RestartSteps=</code> + <code>RestartMaxDelaySec=</code>: the delay grows from <code>RestartSec</code> up to a ceiling (say 5 steps up to 60 seconds) — a good fit for a service waiting on something external to recover. Ubuntu 24.04 (systemd 255) accepts both.</p>

<h3>Sandboxing: cheap and worth it</h3>
<pre><code>[Service]
NoNewPrivileges=true          <span class="tok-comment"># cannot gain privileges via setuid (Lesson 4.3)</span>
PrivateTmp=true               <span class="tok-comment"># its own /tmp — no symlink games (Lesson 7.3)</span>
ProtectSystem=strict          <span class="tok-comment"># the whole filesystem read-only…</span>
ReadWritePaths=/srv/app/uploads /var/lib/myapp   <span class="tok-comment"># …except these</span>
ProtectHome=true              <span class="tok-comment"># /home, /root, /run/user invisible</span>
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
MemoryMax=512M                <span class="tok-comment"># killed by cgroup, not by the system OOM killer</span>
CPUQuota=50%</code></pre>
<pre><code>systemd-analyze security myapp</code></pre>
<div class="out">→ Overall exposure level for myapp.service: 6.7 MEDIUM 😐
NAME                     DESCRIPTION                        EXPOSURE
PrivateNetwork=          Service has access to the host…    0.5
ProtectSystem=           Service has strict read-only acc…  0.0
User=/DynamicUser=       Service runs under a static non…   0.3</div>
<p><code>systemd-analyze security</code> scores every unit on the machine and lists what each directive would improve. It is the fastest way to harden a service you did not write: run it, read the top three rows, add those directives, run it again. Most applications tolerate <code>NoNewPrivileges</code>, <code>PrivateTmp</code> and <code>ProtectSystem=strict</code> with no changes at all.</p>
<div class="callout"><code>MemoryMax=</code> is worth singling out. It puts the service in a cgroup with a hard limit, so a memory leak kills <em>that service</em> instead of letting the kernel's OOM killer pick a victim — which, as Lesson 5.2 showed, is usually your database rather than the actual offender. One line, and a leak becomes a contained failure with an obvious cause in the journal.</div>
<p>Measured on the same <code>myapp.service</code> as in "Try it step by step" below (Python, <code>User=appuser</code>): the score before and after adding a drop-in with the eight sandboxing lines above — LOWER is tighter:</p>
<div class="out">$ systemd-analyze security myapp | tail -1
→ Overall exposure level for myapp.service: 9.2 UNSAFE :-{
$ systemd-analyze security myapp | tail -1         <span class="tok-comment"># after the hardening.conf drop-in</span>
→ Overall exposure level for myapp.service: 7.5 EXPOSED :-(
$ sudo systemd-run --wait -p ProtectSystem=strict -p User=appuser /usr/bin/touch /srv/app/x.txt
/usr/bin/touch: cannot touch '/srv/app/x.txt': Read-only file system
$ sudo systemd-run --unit=leak -p MemoryMax=64M -p MemorySwapMax=0 /usr/bin/python3 /srv/app/leak.py
$ systemctl status leak | grep -E 'Active|OOM'
     Active: failed (Result: oom-kill) since Mon 2026-09-28 15:24:51 UTC; 2s ago
Sep 28 15:24:51 vps-1 systemd[1]: leak.service: A process of this unit has been killed by the OOM killer.</div>
<p><code>systemd-run</code> is the fastest way to try a directive without writing a file: it builds a TRANSIENT unit with exactly the <code>-p</code> properties you pass, runs the command inside it, and disappears. <code>leak.py</code> here asks for another 10 MB every 50 ms; with a 64M ceiling it dies at about 60 MB — and only it dies, not the database next to it.</p>

<h3>Drop-ins: overriding without editing</h3>
${slide('lx-11', 8, 'Drop-in, hộp cát và điểm systemd-analyze security')}
<pre><code class="language-bash">sudo systemctl edit nginx              <span class="tok-comment"># creates a drop-in and opens it</span></code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/nginx.service.d/override.conf</span>
[Service]
MemoryMax=1G
Restart=always</code></pre>
<pre><code class="language-bash">systemctl cat nginx                    <span class="tok-comment"># main file + every drop-in, in order</span>
sudo systemctl revert nginx            <span class="tok-comment"># discard all local overrides</span></code></pre>
<div class="callout ok">Never edit a unit file that came from a package: the next <code>apt upgrade</code> replaces it and your change vanishes. A drop-in in <code>/etc/systemd/system/&lt;unit&gt;.d/</code> survives upgrades, shows up clearly in <code>systemctl cat</code>, and can be removed with one command. The same layering as the <code>sshd_config.d</code> and <code>sudoers.d</code> directories from Chapters 4 and 9 — <code>/etc</code> is yours, <code>/usr/lib</code> belongs to the package.</div>
<pre><code><span class="tok-comment"># To append to a list-valued directive, reset it first</span>
[Service]
ExecStart=
ExecStart=/usr/bin/node /srv/app/dist/index.js --flag</code></pre>
<p>An empty assignment clears the inherited value. Without it, <code>ExecStart=</code> in a drop-in is <em>added</em> to the original for some directive types and rejected for others — and the resulting error message is unhelpful. Reset, then set.</p>

<h3>When it will not start</h3>
${slide('lx-11', 7, 'status và journal: đọc mã sau dấu /')}
<pre><code class="language-bash">systemctl status myapp                 <span class="tok-comment"># 1. the summary and last few log lines</span>
journalctl -u myapp -n 50 --no-pager   <span class="tok-comment"># 2. the actual output (Lesson 10.3)</span>
journalctl -u myapp -p err --since '10 min ago'
systemd-analyze verify /etc/systemd/system/myapp.service   <span class="tok-comment"># 3. syntax</span>
systemctl show myapp -p ExecStart -p User -p Environment   <span class="tok-comment"># 4. what it RESOLVED to</span>
sudo -u appuser /usr/bin/node /srv/app/dist/index.js       <span class="tok-comment"># 5. run it by hand, as that user</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">status=203/EXEC</span><span class="v">The <code>ExecStart</code> path does not exist or is not executable. A relative path, or a missing <code>chmod +x</code> (Chapter 4).</span></div>
  <div class="kv"><span class="k">status=200/CHDIR</span><span class="v"><code>WorkingDirectory=</code> does not exist, or the <code>User=</code> cannot reach it (Lesson 4.5's path traversal).</span></div>
  <div class="kv"><span class="k">status=1/FAILURE</span><span class="v">The application itself exited non-zero. The journal has its output — this is an app problem, not a systemd one.</span></div>
  <div class="kv"><span class="k">Failed to determine user credentials</span><span class="v">The <code>User=</code> does not exist. Create it (Lesson 4.4) or fix the typo.</span></div>
  <div class="kv"><span class="k">Start request repeated too quickly</span><span class="v">The rate limit above. The real error is earlier in the journal, before the restart storm began.</span></div>
</div>
<div class="callout ok">Step 5 is the one that resolves ambiguity fastest. Running the exact <code>ExecStart</code> command by hand as the exact <code>User=</code> reproduces the environment systemd gives it — and if that works while the service does not, the difference is the environment (Lesson 8.3), the working directory, or a sandboxing directive. That narrows it from "systemd is broken" to one of three specific things.</div>
<p>The first three codes in that table, measured with three deliberately broken units (<code>ExecStart=node server.js</code> on a machine without node, <code>WorkingDirectory=/srv/khong-co</code>, <code>User=appusr</code> with a missing letter):</p>
<div class="out">$ systemctl status t-node | grep Process
    Process: 200 ExecStart=node server.js (code=exited, status=203/EXEC)
$ journalctl -u t-chdir -n 3 -o cat
t-chdir.service: Changing to the requested working directory failed: No such file or directory
t-chdir.service: Main process exited, code=exited, status=200/CHDIR
t-chdir.service: Failed with result 'exit-code'.
$ journalctl -u t-user -n 3 -o cat
t-user.service: Failed to determine user credentials: No such process
t-user.service: Main process exited, code=exited, status=217/USER
t-user.service: Failed with result 'exit-code'.
$ systemd-path search-binaries-default
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin</div>
<p>The last line is the list of directories systemd searches for a bare name in <code>ExecStart=</code> (systemd.service(5): "a fixed search path determined at compilation time"). <code>python3</code> lives in <code>/usr/bin</code>, so <code>ExecStart=python3 server.py</code> works; nvm's node lives under <code>~/.nvm/…</code>, so it does not. And <code>ExecStart=/usr/bin/echo hello &gt;&gt; /tmp/out.log</code> prints the literal line <code>hello &gt;&gt; /tmp/out.log</code> to the journal — <code>&gt;&gt;</code> is just an argument and <code>/tmp/out.log</code> is never created.</p>

<h3>A complete unit for a Node application</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/myapp.service</span>
[Unit]
Description=MyApp API server
After=network-online.target postgresql.service
Wants=network-online.target
StartLimitIntervalSec=300      <span class="tok-comment"># belongs in [Unit], not [Service]</span>
StartLimitBurst=5

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/srv/app
EnvironmentFile=/opt/app/.env
Environment=NODE_ENV=production

ExecStartPre=/usr/bin/npx prisma migrate deploy
ExecStart=/usr/bin/node /srv/app/dist/index.js
ExecReload=/bin/kill -HUP \$MAINPID

Restart=on-failure
RestartSec=5s
TimeoutStopSec=30

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/app/uploads
MemoryMax=1G

[Install]
WantedBy=multi-user.target</code></pre>
<div class="out">$ sudo systemctl enable --now myapp
$ systemctl is-active myapp
active
$ journalctl -u myapp -n 3 -o cat
listening on 127.0.0.1:3000
connected to postgres
ready</div>
<p><code>TimeoutStopSec=30</code> connects to Lesson 5.3: systemd sends <code>SIGTERM</code>, waits, then <code>SIGKILL</code>. An application that handles <code>SIGTERM</code> and closes its connections shuts down in a second; one that ignores it takes the full thirty and dies violently every restart. The signal handler is five lines in the application, and it is what makes deploys fast and safe.</p>


<h3>Common systemctl flags</h3>
<table>
<tr><th>Flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>--now</code></td><td>With <code>enable</code>/<code>disable</code>: also <code>start</code>/<code>stop</code></td><td><code>systemctl enable --now myapp</code></td></tr>
<tr><td><code>--failed</code></td><td>List only failed units</td><td><code>systemctl list-units --failed</code></td></tr>
<tr><td><code>--type=</code> · <code>--state=</code></td><td>Filter by unit type / state</td><td><code>systemctl list-units --type=service --state=running</code></td></tr>
<tr><td><code>-p</code> · <code>--value</code></td><td>Pick one property / print only its value (for scripts)</td><td><code>systemctl show -p MainPID --value myapp</code> → <code>477</code></td></tr>
<tr><td><code>--no-pager</code> · <code>-n N</code></td><td>Do not open <code>less</code> · how many log lines to include</td><td><code>systemctl status myapp --no-pager -n 0</code></td></tr>
<tr><td><code>--all</code></td><td>Include inactive units</td><td><code>systemctl list-timers --all</code></td></tr>
<tr><td><code>--reverse</code></td><td>Reverse dependency tree: who relies on this unit</td><td><code>systemctl list-dependencies --reverse db</code></td></tr>
<tr><td><code>--user</code></td><td>Your own per-user manager, no sudo; to keep it alive after you log out it needs "linger"</td><td><code>systemctl --user status</code> · <code>loginctl show-user "$USER" -p Linger</code></td></tr>
</table>
<p>Three verbs answer with an exit code instead of prose — use them directly in <code>if</code> (Lesson 6.4): <code>systemctl is-active myapp</code> prints <code>active</code> and exits 0; <code>is-enabled</code> prints <code>enabled</code>/<code>disabled</code>/<code>static</code> (<code>static</code> = a unit without an <code>[Install]</code> section, like <code>backup.service</code> in Lesson 11.2 — it only runs when something else pulls it in).</p>

<h3>Try it step by step: a real service in a container with systemd</h3>
<p>A normal container has no systemd (PID 1 is your command). To practise without touching a real machine, build an Ubuntu 24.04 container with systemd as PID 1 — it needs <code>--privileged</code>, so only do this on a practice machine and delete it straight after:</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. an image with systemd (once)</span>
docker run -d --name lab-b ubuntu:24.04 sleep infinity
docker exec lab-b bash -c 'apt-get update -qq &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq systemd systemd-sysv python3 cron openssh-server &gt;/dev/null'
docker commit lab-b lab-sd:img &amp;&amp; docker rm -f lab-b
<span class="tok-comment"># 2. run it with systemd as PID 1</span>
docker run -d --name lab-sd --hostname vps-1 --privileged --cgroupns=private \\
  --tmpfs /run --tmpfs /run/lock lab-sd:img /sbin/init
docker exec lab-sd systemctl is-system-running
docker exec -it lab-sd bash</code></pre>
<div class="out">running</div>
<pre><code class="language-python"><span class="tok-comment"># 3. inside the container: a small app and its unit</span>
useradd -r -s /usr/sbin/nologin appuser
mkdir -p /srv/app &amp;&amp; cd /srv/app
cat &gt; server.py &lt;&lt;'EOF'
import http.server
print("listening on 127.0.0.1:19110", flush=True)
http.server.HTTPServer(("127.0.0.1", 19110), http.server.SimpleHTTPRequestHandler).serve_forever()
EOF
cat &gt; /etc/systemd/system/myapp.service &lt;&lt;'EOF'
[Unit]
Description=My app (lx11 demo)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/srv/app
ExecStart=python3 server.py
Restart=on-failure
RestartSec=2s

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now myapp
systemctl status myapp --no-pager</code></pre>
<div class="out">Created symlink /etc/systemd/system/multi-user.target.wants/myapp.service → /etc/systemd/system/myapp.service.
● myapp.service - My app (lx11 demo)
     Loaded: loaded (/etc/systemd/system/myapp.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-09-28 15:23:06 UTC; 1s ago
   Main PID: 167 (python3)
      Tasks: 1 (limit: 9563)
     Memory: 8.8M (peak: 9.0M)
        CPU: 51ms
     CGroup: /system.slice/myapp.service
             └─167 python3 server.py

Sep 28 15:23:06 vps-1 systemd[1]: Started myapp.service - My app (lx11 demo).
Sep 28 15:23:06 vps-1 python3[167]: listening on 127.0.0.1:19110</div>
<pre><code class="language-bash"><span class="tok-comment"># 4. kill it hard — systemd brings it back</span>
kill -9 "$(systemctl show -p MainPID --value myapp)"
sleep 4
journalctl -u myapp -n 5 --no-pager
systemctl show myapp -p NRestarts</code></pre>
<div class="out">Sep 28 15:23:43 vps-1 systemd[1]: myapp.service: Main process exited, code=killed, status=9/KILL
Sep 28 15:23:43 vps-1 systemd[1]: myapp.service: Failed with result 'signal'.
Sep 28 15:23:47 vps-1 systemd[1]: myapp.service: Scheduled restart job, restart counter is at 1.
Sep 28 15:23:47 vps-1 systemd[1]: Started myapp.service - My app (lx11 demo).
Sep 28 15:23:47 vps-1 python3[293]: listening on 127.0.0.1:19110
NRestarts=1</div>
<p>Read it: the Main PID changed from 167 to 293, <code>NRestarts=1</code>. That is the thing <code>nohup</code> can never do. When done, leave the container and run <code>docker rm -f lab-sd &amp;&amp; docker rmi lab-sd:img</code>.</p>

<h3>How macOS and WSL differ</h3>
<table>
<tr><th>Job</th><th>Ubuntu / Fedora</th><th>macOS (measured on macOS 27)</th><th>WSL2</th></tr>
<tr><td>PID 1 / service manager</td><td>systemd</td><td><strong>launchd</strong>; <code>systemctl</code> → <code>command not found</code></td><td>systemd if enabled (Ubuntu installed with <code>wsl --install</code> has it on)</td></tr>
<tr><td>Service definition files</td><td><code>/etc/systemd/system/*.service</code></td><td><code>.plist</code> files in <code>/Library/LaunchDaemons</code>, <code>~/Library/LaunchAgents</code> (Chapters 13–15)</td><td>as Ubuntu</td></tr>
<tr><td>Turning systemd on</td><td>built in</td><td>—</td><td><code>/etc/wsl.conf</code>: <code>[boot]</code> / <code>systemd=true</code>, then <code>wsl.exe --shutdown</code> (WSL ≥ 0.67.6)</td></tr>
</table>
<p>Two notes for a teammate on Windows: systemd services inside WSL <strong>do not keep WSL alive</strong> — close every window and the VM shuts down after a while, taking the services with it (Microsoft's documentation says so explicitly), so WSL is a place to PRACTISE writing units, not to run them for real. And on a Mac there is no systemd to practise on — use the container from "Try it step by step" above.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team runs the API with <code>nohup node dist/index.js &amp;</code> on a VPS; this morning the provider rebooted the machine and the API was dead from 4am until someone noticed. Redo it properly, in the <code>lab-sd</code> container from "Try it step by step".</p><ol>
<li>Write <code>/etc/systemd/system/api.service</code> running <code>python3 -m http.server 19111 --bind 127.0.0.1</code> as <code>appuser</code>, with <code>Restart=on-failure</code>, and put <code>StartLimitIntervalSec=60</code> + <code>StartLimitBurst=3</code> in the RIGHT section. Run <code>systemd-analyze verify</code> — it must print nothing.</li>
<li><code>systemctl enable --now api</code>, then <code>systemctl is-enabled api; systemctl is-active api</code>.</li>
<li><code>kill -9</code> its Main PID; prove it came back with <code>systemctl show api -p NRestarts -p MainPID</code>.</li>
<li>Deliberately change <code>User=appuser</code> to <code>User=apuser</code>, forget <code>daemon-reload</code>, <code>restart</code> — read the warning; then reload, restart, and read the code after the <code>/</code> in <code>systemctl status</code> (with <code>Restart=on-failure</code> + <code>StartLimitBurst=3</code> you will also see <code>Start request repeated too quickly</code>). Fix it, <code>daemon-reload</code>, <code>reset-failed</code>, <code>restart</code>.</li>
<li>Add a drop-in <code>/etc/systemd/system/api.service.d/limits.conf</code> with <code>MemoryMax=128M</code>; check with <code>systemctl cat api</code> and <code>systemctl show api -p MemoryMax</code>.</li></ol>
<p><strong>Done when:</strong> <code>verify</code> is silent; <code>enabled</code> + <code>active</code>; <code>NRestarts=1</code> with a new Main PID; you can read <code>status=217/USER</code>; <code>systemctl show api -p MemoryMax</code> prints <code>MemoryMax=134217728</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">init / PID 1</span><span class="v">The first process the kernel runs, ancestor of every other; on today's servers it is systemd.</span></div>
  <div class="kv"><span class="k">Unit</span><span class="v">One thing systemd manages, described by one file: <code>.service</code>, <code>.timer</code>, <code>.socket</code>, <code>.target</code>…</span></div>
  <div class="kv"><span class="k">Enabled / active</span><span class="v">Enabled = will start at boot; active = running right now. Independent of each other.</span></div>
  <div class="kv"><span class="k">Dependency / ordering</span><span class="v"><code>Wants</code>/<code>Requires</code> pull another unit in; <code>After</code>/<code>Before</code> only order them.</span></div>
  <div class="kv"><span class="k">Drop-in</span><span class="v">A <code>*.conf</code> file in <code>&lt;unit&gt;.d/</code> that overrides individual lines of the original without editing it.</span></div>
  <div class="kv"><span class="k">Rate limit / start limit</span><span class="v">More than <code>StartLimitBurst</code> starts within <code>StartLimitIntervalSec</code> and systemd stops trying.</span></div>
  <div class="kv"><span class="k">Sandboxing</span><span class="v">Directives such as <code>ProtectSystem</code> and <code>PrivateTmp</code> that limit what a service can see and change.</span></div>
  <div class="kv"><span class="k">Transient unit</span><span class="v">A unit built on the spot by <code>systemd-run</code>, with no file, gone when it finishes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>systemd is PID 1 on almost every server; a three-section unit file replaces <code>nohup</code> with start-at-boot, restart-on-crash, logs and resource limits.</li>
<li>After editing a unit you must <code>daemon-reload</code>; <code>enable</code> (at boot) and <code>start</code> (now) are two jobs, and <code>--now</code> combines them.</li>
<li><code>Wants</code>/<code>Requires</code> pull in, <code>After</code> only orders; <code>Requires</code> does not follow a dependency that crashes on its own.</li>
<li><code>StartLimitIntervalSec</code>/<code>Burst</code> belong in <code>[Unit]</code>, and a large <code>RestartSec</code> makes the limit useless — <code>systemd-analyze verify</code> catches the wrong-section mistake.</li>
<li>The code after the <code>/</code> names the failure: <code>203/EXEC</code>, <code>200/CHDIR</code>, <code>217/USER</code>, while <code>1/FAILURE</code> is the app's own error.</li>
<li>Drop-ins to override, <code>systemd-run -p …</code> to try a directive, <code>systemd-analyze security</code> to score the sandbox.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/systemd.unit.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">systemd.unit(5) — the [Unit] and [Install] sections</span><span class="lc-sub">The exact definitions of <code>Wants=</code>, <code>Requires=</code>, <code>BindsTo=</code>, <code>After=</code> and <code>StartLimitIntervalSec=</code> — the source behind the measured table in this lesson.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/systemd.service.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">Every <code>[Service]</code> directive, including all the <code>Type=</code> values and the exact restart semantics. The reference for this lesson.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/systemd.exec.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">systemd.exec(5) — the sandboxing directives</span><span class="lc-sub"><code>ProtectSystem</code>, <code>ReadWritePaths</code>, <code>RestrictAddressFamilies</code> and the rest, each with what it actually blocks.</span></span>
</a>
<a class="link-card" href="https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Understanding systemd units and unit files</span><span class="lc-sub">A readable walkthrough of unit types, targets and dependency ordering — good background before writing your first unit.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: turn a script into a service</span><span class="lc-sub">Graded tasks: write a unit with a dedicated user, diagnose 203/EXEC and 200/CHDIR, add a drop-in override, and clear a rate-limited crash loop.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> a relative path or a shell construct in <code>ExecStart=</code>. systemd does not run a shell, so <code>ExecStart=node dist/index.js</code> fails with <code>203/EXEC</code> as soon as node is not in the four standard directories (installed with nvm, say — systemd searches only a fixed list, never your <code>PATH</code>, Lesson 8.1), and <code>ExecStart=/usr/bin/node app.js &gt;&gt; /var/log/app.log</code> passes <code>&gt;&gt;</code> and the filename to node as arguments rather than redirecting. Use absolute paths always, let the journal capture stdout instead of redirecting, and when you genuinely need shell syntax, say so explicitly with <code>/bin/bash -c '…'</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>daemon-reload</code> after every unit edit, or you are testing the old file. <code>enable</code> and <code>start</code> are different — <code>--now</code> does both, and forgetting <code>enable</code> means the app is gone after the next reboot. And when a service will not start, run its exact <code>ExecStart</code> by hand as its exact <code>User=</code>: that one command separates "systemd is misconfigured" from "the application is broken" in about five seconds.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Chạy ứng dụng của bạn như một dịch vụ</h2>
<p class="lead">Bài 5.4 kết thúc bằng một quy tắc: <code>nohup</code> và <code>tmux</code> sống sót qua một lần rớt kết nối nhưng không sống sót qua một lần khởi động lại máy, và mọi thứ quan trọng đều thuộc về một trình quản lý dịch vụ. Đây chính là bài đó. Một file mười hai dòng cho bạn: tự khởi động cùng máy, tự bật lại khi sập, log nằm trong journal, một người dùng riêng, và một cách dừng nó được ghi lại rõ ràng cho người sau.</p>

<h3>Vì sao cần một trình quản lý dịch vụ — một chút lịch sử</h3>
${slide('lx-11', 3, 'Từ SysV init tới systemd: ai trông các dịch vụ')}
<p>Mọi tiến trình trên Linux đều có cha (Bài 5.1). Tiến trình đầu tiên mà nhân khởi chạy — <strong>PID 1</strong>, gọi chung là <em>init</em> — là tổ tiên của mọi thứ còn lại, và là thứ quyết định dịch vụ nào chạy khi máy lên, theo thứ tự nào, và ai dựng chúng dậy khi chúng chết. Linux đã đi qua ba thế hệ init:</p>
<table>
<tr><th>Thế hệ</th><th>Ra đời</th><th>Cách làm</th><th>Điểm yếu</th></tr>
<tr><td>SysV init</td><td>UNIX System V (1983)</td><td>Mỗi dịch vụ một script shell trong <code>/etc/init.d/</code> tự viết <code>start|stop|status</code>, tự ghi file PID; chạy lần lượt theo số thứ tự</td><td>Khởi động tuần tự, chậm; script mỗi nhà viết một kiểu; không ai dựng dịch vụ dậy khi nó sập</td></tr>
<tr><td>Upstart</td><td>Ubuntu 6.10 (2006), Scott James Remnant</td><td>Theo <em>sự kiện</em>: "khi mạng lên thì chạy X"</td><td>Chỉ Ubuntu (và một thời Fedora) dùng</td></tr>
<tr><td>systemd</td><td>30/03/2010, Lennart Poettering và Kay Sievers</td><td>File <strong>khai báo</strong> (unit), khởi động song song theo quan hệ phụ thuộc, theo dõi mọi tiến trình con bằng cgroup, gom log vào journal</td><td>To và làm nhiều việc — lý do của một cuộc tranh luận dài trong cộng đồng</td></tr>
</table>
<p>Fedora 15 (05/2011) là bản phân phối lớn đầu tiên dùng systemd mặc định; Debian 8 và Ubuntu 15.04 (cùng tháng 04/2015) theo sau. Tính đến 09/2026, gần như mọi bản phân phối bạn sẽ gặp trên máy chủ — Ubuntu, Debian, Fedora, RHEL/Rocky, Arch — đều chạy systemd (Ubuntu 24.04 có systemd 255, Fedora 44 có 259). Ngoại lệ đáng nhớ là container (thường không có init nào cả) và Alpine (OpenRC).</p>
<p><strong>Không biết nó thì gặp gì?</strong> Đúng ba chuyện mà một dự án sinh viên deploy lên VPS hay gặp: ứng dụng chạy bằng <code>nohup</code> biến mất sau lần nhà cung cấp khởi động lại máy để vá nhân; app sập lúc 2 giờ sáng và nằm chết tới khi có người thức dậy; <code>nohup.out</code> phình tới mức đầy đĩa (Bài 10.1). Bảng dưới là thứ một file unit mười mấy dòng cho bạn mà <code>nohup</code> không cho:</p>
<table>
<tr><th>Việc</th><th><code>nohup</code> / <code>tmux</code></th><th>Dịch vụ systemd</th></tr>
<tr><td>Chạy lại sau khi máy khởi động lại</td><td>Không</td><td><code>enable</code></td></tr>
<tr><td>Dựng dậy khi sập</td><td>Không</td><td><code>Restart=on-failure</code></td></tr>
<tr><td>Log có mốc thời gian, tự xoay vòng</td><td>Một file <code>nohup.out</code> lớn dần</td><td><code>journalctl -u app</code></td></tr>
<tr><td>Dừng sạch cả tiến trình con</td><td><code>kill</code> để lại con mồ côi</td><td><code>systemctl stop</code> dọn cả cgroup</td></tr>
<tr><td>Chạy bằng người dùng không đặc quyền, giới hạn RAM</td><td>Tự lo</td><td><code>User=</code>, <code>MemoryMax=</code></td></tr>
<tr><td>Người sau biết cách dừng/khởi động</td><td>Hỏi bạn</td><td><code>systemctl status app</code></td></tr>
</table>

<h3>Một unit là gì</h3>
<pre><code class="language-bash">systemctl list-units --type=service --state=running | head
systemctl status nginx
systemctl cat nginx                    <span class="tok-comment"># file unit, kèm cả các phần chèn thêm</span>
systemctl show nginx | head -20        <span class="tok-comment"># mọi thuộc tính đã giải xong</span></code></pre>
<div class="out">● nginx.service - A high performance web server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Fri 2026-08-22 09:14:02 UTC; 7h ago
   Main PID: 812 (nginx)
      Tasks: 3 (limit: 9432)
     Memory: 8.4M
        CPU: 1.204s
     CGroup: /system.slice/nginx.service
             ├─812 "nginx: master process /usr/sbin/nginx"
             └─813 "nginx: worker process"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Loaded</code></span><span class="v">File nằm ở đâu, và nó có <strong>enabled</strong> hay không (tức là có chạy cùng máy không) — một thứ KHÁC với <strong>active</strong> (đang chạy ngay lúc này).</span></div>
  <div class="kv"><span class="k"><code>Active</code></span><span class="v">Trạng thái hiện tại và được bao lâu rồi. <code>active (running)</code>, <code>failed</code>, <code>activating (auto-restart)</code> — cái cuối nghĩa là nó đang trong vòng lặp sập.</span></div>
  <div class="kv"><span class="k"><code>CGroup</code></span><span class="v">Mọi tiến trình mà systemd coi là thuộc về dịch vụ này. Đó là lý do <code>systemctl stop</code> giết được cả tiến trình con một cách đáng tin, trong khi một lệnh <code>kill</code> trần thì để lại chúng mồ côi.</span></div>
</div>
<div class="callout"><strong>enabled và active là hai chuyện độc lập.</strong> Một dịch vụ có thể đang chạy ngay lúc này mà không được đặt để khởi động cùng máy — chuyện đó chạy hoàn hảo cho tới khi máy khởi động lại lúc 4 giờ sáng sau một bản vá nhân và ứng dụng đơn giản là không bao giờ quay lại. <code>systemctl is-enabled myapp</code> trả lời trong đúng một chữ, còn cờ <code>--now</code> của <code>enable</code> làm cả hai việc cùng lúc.</div>

<h3>Các động từ</h3>
<pre><code class="language-bash">sudo systemctl start myapp
sudo systemctl stop myapp
sudo systemctl restart myapp           <span class="tok-comment"># dừng rồi chạy lại — có gián đoạn ngắn</span>
sudo systemctl reload myapp            <span class="tok-comment"># SIGHUP: đọc lại cấu hình, vẫn phục vụ (Bài 5.3)</span>
sudo systemctl reload-or-restart myapp <span class="tok-comment"># reload nếu hỗ trợ, không thì restart</span>

sudo systemctl enable myapp            <span class="tok-comment"># chạy cùng máy</span>
sudo systemctl enable --now myapp      <span class="tok-comment"># …và chạy luôn ngay bây giờ</span>
sudo systemctl disable --now myapp
sudo systemctl mask myapp              <span class="tok-comment"># làm nó KHÔNG THỂ khởi động, kể cả khi bị phụ thuộc</span>

systemctl is-active myapp              <span class="tok-comment"># dùng được trong script: thoát 0 nếu đang chạy</span>
systemctl is-enabled myapp
systemctl is-failed myapp
systemctl list-units --failed          <span class="tok-comment"># mọi thứ đang hỏng</span></code></pre>
<div class="callout ok"><code>systemctl list-units --failed</code> là lệnh đầu tiên nên chạy trên một máy chủ bạn vừa được giao. Nó tốn một giây và liệt kê mọi dịch vụ đã thử khởi động mà không được — thường có cả thứ mà mấy tuần rồi chẳng ai để ý là đang hỏng. <code>systemctl is-active</code> và họ hàng thoát ra 0 hoặc khác 0 mà không in gì, nên dùng thẳng được trong các câu điều kiện ở Bài 6.4.</div>

<h3>Viết một unit dịch vụ</h3>
${slide('lx-11', 4, 'Một unit = một file INI ba mục')}
<pre><code><span class="tok-comment"># /etc/systemd/system/myapp.service</span>
[Unit]
Description=Ứng dụng của tôi
Documentation=https://github.com/me/myapp
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/srv/app
EnvironmentFile=/opt/app/.env
ExecStart=/usr/bin/node /srv/app/dist/index.js
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target</code></pre>
<pre><code class="language-bash">sudo systemctl daemon-reload           <span class="tok-comment"># BẮT BUỘC sau khi sửa bất kỳ file unit nào</span>
sudo systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">[Unit]</span><span class="lz-lnote">Siêu dữ liệu và thứ tự. <code>After=</code> nói "hãy chạy tôi SAU những cái này", <code>Wants=</code> nói "hãy thử khởi động cả những cái này nữa". <code>Requires=</code> mạnh hơn và thường là quá mạnh — nếu thứ phụ thuộc hỏng thì dịch vụ của bạn cũng bị dừng theo.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Service]</span><span class="lz-lnote">Chạy nó ra sao: lệnh nào, với danh nghĩa ai, môi trường gì, và làm gì khi nó thoát. Đây là mục có ý nghĩa nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Install]</span><span class="lz-lnote">Lệnh <code>enable</code> nên móc nó vào đâu. <code>multi-user.target</code> nghĩa là "khởi động bình thường". Thiếu mục này thì <code>enable</code> chẳng có việc gì để làm và âm thầm không đạt được gì.</span></div>
</div>
<div class="callout warn"><strong>Phải <code>daemon-reload</code> sau MỖI lần sửa.</strong> systemd lưu tạm các file unit; thiếu nó, lệnh <code>restart</code> khởi động lại định nghĩa <em>CŨ</em> và thay đổi của bạn trông như chẳng có tác dụng gì — nên bạn sửa lần nữa, restart lần nữa, rồi kết luận rằng cái file đang bị bỏ qua. Quên chuyện này là sai lầm phổ biến nhất với systemd, và triệu chứng thì không phân biệt được với một cấu hình không chạy được.</div>
<p>Cảnh báo đó có thật và systemd nói ra thành chữ — nếu bạn chịu đọc. Đo trong container Ubuntu 24.04 chạy systemd thật: sửa <code>RestartSec=2s</code> thành <code>3s</code> rồi <code>restart</code> mà chưa reload:</p>
<div class="out">$ sudo systemctl restart myapp
Warning: The unit file, source configuration file or drop-ins of myapp.service changed on disk. Run 'systemctl daemon-reload' to reload units.
$ systemctl show myapp -p RestartUSec
RestartUSec=2s
$ sudo systemctl daemon-reload; systemctl show myapp -p RestartUSec
RestartUSec=3s</div>

<h3>Wants, Requires, After — ba chữ hay bị nhầm nhất (đo thật)</h3>
${slide('lx-11', 5, 'Wants, Requires, After: bốn tình huống đo thật')}
<p>Mục <code>[Unit]</code> có hai loại quan hệ khác hẳn nhau, và người mới hay tưởng một dòng làm được cả hai:</p>
<ul>
<li><strong>Kéo theo</strong> (requirement — "bật tôi thì bật cả nó"): <code>Wants=</code> (mềm) và <code>Requires=</code> (cứng), mạnh nhất là <code>BindsTo=</code>.</li>
<li><strong>Thứ tự</strong> (ordering — "tôi chạy SAU nó"): <code>After=</code> và <code>Before=</code>. Tự nó KHÔNG kéo gì theo cả: <code>After=postgresql.service</code> mà không có <code>Wants=</code>/<code>Requires=</code> chỉ có nghĩa "nếu cả hai cùng được khởi động thì đợi postgres trước".</li>
</ul>
<p>Để khỏi đoán, bài này dựng ba unit giả trong container: <code>db.service</code>, <code>web-wants.service</code> (<code>Wants=db.service</code> + <code>After=db.service</code>) và <code>web-req.service</code> (<code>Requires=db.service</code> + <code>After=db.service</code>), rồi làm hỏng <code>db</code> theo ba kiểu:</p>
<table>
<tr><th>Tình huống với db</th><th>web-wants</th><th>web-req</th></tr>
<tr><td><code>systemctl stop db</code> (dừng CÓ CHỦ ĐÍCH)</td><td>vẫn chạy</td><td>bị dừng theo</td></tr>
<tr><td>db không khởi động được (<code>Type=oneshot</code>, lệnh thoát 1)</td><td>vẫn chạy</td><td>KHÔNG chạy — <code>Dependency failed</code></td></tr>
<tr><td>db đang chạy thì tự sập (<code>kill -9</code>)</td><td>vẫn chạy</td><td><strong>VẪN chạy</strong></td></tr>
</table>
<div class="out">$ sudo systemctl start web-req
A dependency job for web-req.service failed. See 'journalctl -xe' for details.
$ journalctl -u web-req -n 1 -o cat
web-req.service: Job web-req.service/start failed with result 'dependency'.
$ systemctl list-dependencies --reverse db
db.service
● ├─web-req.service
● └─web-wants.service</div>
<p>Hai điều người ta hay tin sai, cả hai đều lộ ra ở bảng trên:</p>
<ol>
<li><strong><code>Requires=</code> không theo khi thứ nó cần tự sập.</strong> Nó chỉ lan theo những lần dừng/khởi động lại <em>có chủ đích</em>. Muốn "db chết thì web chết theo" phải dùng <code>BindsTo=</code>. Còn trong thực tế, cách tốt hơn cả là để ứng dụng tự thử kết nối lại cơ sở dữ liệu — Prisma, pg, mọi driver tử tế đều làm được.</li>
<li><strong><code>After=</code> chỉ chờ tới khi unit kia "khởi động xong" theo định nghĩa của systemd.</strong> Với <code>Type=simple</code> (mặc định) "xong" nghĩa là <em>vừa fork xong</em> — lúc đó Postgres có khi còn đang đọc WAL. Lần thử đầu tiên của bài này dùng <code>db.service</code> <code>Type=simple</code> chạy <code>/usr/bin/false</code>: systemd coi nó đã khởi động, <code>web-req</code> vẫn lên, rồi db mới báo hỏng. Chỉ các unit báo "sẵn sàng" thật (<code>Type=notify</code> như <code>postgresql@16-main</code>, hoặc <code>Type=oneshot</code>) mới làm <code>After=</code> đợi đúng nghĩa.</li>
</ol>
<div class="callout ok"><strong>Công thức cho ứng dụng web của bạn:</strong> <code>Wants=</code> + <code>After=</code> cho mạng và cơ sở dữ liệu (đúng như unit mẫu ở trên), cộng <code>Restart=on-failure</code> để nếu lần đầu app lên sớm hơn DB thì lần sau nó tự khá. <code>Requires=</code> hiếm khi đáng cái giá của nó.</div>

<h3>Những chi tiết quyết định nó có chạy hay không</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Type=simple</code></span><span class="v">Mặc định: lệnh của bạn chạy ở tiền cảnh và ở lại đó. Đúng với gần như mọi ứng dụng đời mới.</span></div>
  <div class="kv"><span class="k"><code>Type=forking</code></span><span class="v">Dành cho daemon kiểu cũ vốn fork ra rồi thoát. Cần <code>PIDFile=</code>. Nếu ứng dụng của bạn KHÔNG fork mà bạn đặt cái này thì systemd chờ mãi rồi hết giờ.</span></div>
  <div class="kv"><span class="k"><code>Type=oneshot</code></span><span class="v">Chạy tới khi xong, rồi unit coi như "đã xong". Dành cho di trú và các tác vụ thiết lập. Ghép với <code>RemainAfterExit=yes</code> nếu có unit khác phụ thuộc vào nó.</span></div>
  <div class="kv"><span class="k"><code>ExecStart=</code></span><span class="v"><strong>Nên dùng đường dẫn tuyệt đối.</strong> systemd không dùng shell, nên không tra <code>PATH</code> CỦA BẠN (một tên trần như <code>python3</code> chỉ được tìm trong bốn thư mục cố định <code>/usr/local/sbin</code>, <code>/usr/local/bin</code>, <code>/usr/sbin</code>, <code>/usr/bin</code> — node cài bằng nvm nằm ngoài đó nên hỏng <code>203/EXEC</code>), không có glob, không có <code>&amp;&amp;</code>, không có chuyển hướng (Bài 8.2). Nếu bạn cần tính năng của shell: <code>ExecStart=/bin/bash -c '…'</code>.</span></div>
  <div class="kv"><span class="k"><code>User=</code> <code>Group=</code></span><span class="v">Chạy với một tài khoản không đặc quyền (Bài 4.4). Thiếu nó, dịch vụ chạy bằng <strong>root</strong>, thứ mà gần như chẳng ứng dụng nào cần.</span></div>
  <div class="kv"><span class="k"><code>EnvironmentFile=</code></span><span class="v">Đọc các dòng <code>KHOÁ=giá trị</code>. Thêm tiền tố <code>-</code> (<code>EnvironmentFile=-/opt/app/.env</code>) để một file thiếu không gây chết.</span></div>
</div>
<pre><code><span class="tok-comment"># Tính năng của shell thì cần một cái shell tường minh</span>
ExecStart=/bin/bash -c 'exec /srv/app/bin/server &gt;&gt; /var/log/app.log 2&gt;&amp;1'

<span class="tok-comment"># Chạy thứ gì đó trước và sau tiến trình chính</span>
ExecStartPre=/usr/bin/npx prisma migrate deploy
ExecStopPost=/usr/local/bin/notify-deploy-stopped</code></pre>

<h3>Chính sách khởi động lại, và vòng lặp sập</h3>
${slide('lx-11', 6, 'Vòng đời Restart= và giới hạn tần suất')}
<pre><code>Restart=on-failure          <span class="tok-comment"># bật lại khi thoát khác 0 hoặc do tín hiệu. Lựa chọn thường dùng.</span>
Restart=always              <span class="tok-comment"># bật lại kể cả sau khi thoát sạch với mã 0</span>
Restart=no                  <span class="tok-comment"># mặc định — KHÔNG bật lại</span>
RestartSec=5s               <span class="tok-comment"># chờ bao lâu trước khi bật lại</span>

<span class="tok-comment"># ⚠️ hai dòng dưới thuộc mục [Unit] — đặt trong [Service] thì IntervalSec bị BỎ QUA (xem dưới)</span>
StartLimitIntervalSec=300   <span class="tok-comment"># trong một cửa sổ 5 phút…</span>
StartLimitBurst=5           <span class="tok-comment"># …cho phép 5 lần khởi động, rồi bỏ cuộc</span></code></pre>
<div class="out">Aug 22 17:02:11 vps systemd[1]: myapp.service: Scheduled restart job, restart counter is at 5.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Start request repeated too quickly.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Failed with result 'exit-code'.</div>
<div class="callout warn"><strong>Cái giới hạn tần suất là một TÍNH NĂNG, và nó làm người ta rối.</strong> Một ứng dụng sập ngay lúc khởi động — thiếu một biến môi trường, cơ sở dữ liệu chưa lên — sẽ bật lại năm lần trong vài giây rồi systemd thôi không thử nữa. Lúc đó <code>systemctl status</code> nói <code>Start request repeated too quickly</code>, nghe như một vấn đề của systemd mà thật ra nghĩa là "ứng dụng của bạn đã hỏng năm lần, hãy nhìn vào journal". Hãy chữa nguyên nhân, rồi <code>systemctl reset-failed myapp</code> để xoá bộ đếm trước khi khởi động lại.</div>
<div class="callout ok">Không có cái giới hạn đó, một dịch vụ trong vòng lặp sập sẽ bật lại mãi mãi, làm đầy journal và đốt CPU — và trên một cái máy có vài dịch vụ như thế thì riêng chuyện đó cũng đủ hạ cả máy. Năm lần trong năm phút là một mặc định hợp lý; nếu một dịch vụ chính đáng cần chờ một thứ gì đó chậm thì hãy nâng <code>RestartSec</code> chứ đừng nâng số lần.</div>

<h3>Đào sâu: hai cái bẫy của giới hạn tần suất (đo thật)</h3>
<p>Mặc định thật của systemd (tính đến 255/259) là <code>RestartSec=100ms</code>, <code>StartLimitBurst=5</code>, <code>StartLimitIntervalSec=10s</code> — tức "5 lần khởi động trong 10 giây thì thôi". Một ứng dụng sập ngay lúc khởi động đốt hết 5 lần trong chưa tới một giây:</p>
<div class="out">$ systemctl show crashy -p NRestarts -p RestartUSec -p StartLimitBurst -p StartLimitIntervalUSec
RestartUSec=100ms
NRestarts=5
StartLimitIntervalUSec=10s
StartLimitBurst=5</div>
<p><strong>Bẫy 1 — đặt nhầm mục thì systemd lặng lẽ bỏ qua.</strong> <code>StartLimitIntervalSec=</code> và <code>StartLimitBurst=</code> là tuỳ chọn của mục <code>[Unit]</code> (từ systemd 230). Viết trong <code>[Service]</code> — như rất nhiều bài hướng dẫn trên mạng, và như bản đầu tiên của chính bài này — thì <code>StartLimitBurst</code> vẫn được nhận vì lý do tương thích, còn <code>StartLimitIntervalSec</code> bị bỏ qua, cửa sổ vẫn là 10 giây:</p>
<div class="out">$ systemd-analyze verify sl.service
sl.service:5: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
$ systemctl show sl -p StartLimitBurst -p StartLimitIntervalUSec
StartLimitIntervalUSec=10s
StartLimitBurst=5</div>
<p>Chỉ có <code>systemd-analyze verify</code> nói ra điều này — <code>daemon-reload</code> không kêu một tiếng nào. Hãy chạy <code>verify</code> sau mỗi lần viết unit mới.</p>
<p><strong>Bẫy 2 — <code>RestartSec</code> đủ lớn thì giới hạn không bao giờ kích hoạt.</strong> Giữ cửa sổ mặc định 10 giây, đặt <code>RestartSec=3s</code> cho cùng ứng dụng hỏng đó, chờ 25 giây:</p>
<div class="out">$ systemctl show crashy -p NRestarts -p ActiveState -p SubState
NRestarts=7
ActiveState=activating
SubState=auto-restart</div>
<p>Mỗi 3 giây một lần thì không bao giờ có đủ 5 lần trong 10 giây — dịch vụ sập và bật lại mãi mãi, đúng thứ giới hạn sinh ra để chặn. Quy tắc: <strong><code>RestartSec</code> × (<code>StartLimitBurst</code> − 1) phải nhỏ hơn <code>StartLimitIntervalSec</code></strong>, không thì giới hạn vô dụng. Unit hoàn chỉnh ở cuối bài dùng 5s × 4 = 20s &lt; 300s — nên nó vẫn dừng lại được, với điều kiện hai dòng đó nằm đúng mục <code>[Unit]</code> (đã sửa trong unit mẫu).</p>
<p>Từ systemd 254 còn có <code>RestartSteps=</code> + <code>RestartMaxDelaySec=</code>: thời gian chờ tăng dần từ <code>RestartSec</code> tới trần (ví dụ 5 bước tới 60 giây) — hợp với dịch vụ phải chờ một thứ bên ngoài hồi lại. Ubuntu 24.04 (systemd 255) nhận cả hai.</p>

<h3>Hộp cát: rẻ và đáng làm</h3>
<pre><code>[Service]
NoNewPrivileges=true          <span class="tok-comment"># không thể lên quyền qua setuid (Bài 4.3)</span>
PrivateTmp=true               <span class="tok-comment"># có /tmp riêng — hết trò symlink (Bài 7.3)</span>
ProtectSystem=strict          <span class="tok-comment"># cả hệ thống file thành chỉ-đọc…</span>
ReadWritePaths=/srv/app/uploads /var/lib/myapp   <span class="tok-comment"># …trừ những chỗ này</span>
ProtectHome=true              <span class="tok-comment"># /home, /root, /run/user thành vô hình</span>
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
MemoryMax=512M                <span class="tok-comment"># bị cgroup giết, không phải OOM killer của hệ thống</span>
CPUQuota=50%</code></pre>
<pre><code>systemd-analyze security myapp</code></pre>
<div class="out">→ Overall exposure level for myapp.service: 6.7 MEDIUM 😐
NAME                     DESCRIPTION                        EXPOSURE
PrivateNetwork=          Service has access to the host…    0.5
ProtectSystem=           Service has strict read-only acc…  0.0
User=/DynamicUser=       Service runs under a static non…   0.3</div>
<p><code>systemd-analyze security</code> chấm điểm mọi unit trên máy và liệt kê từng chỉ thị sẽ cải thiện được gì. Đây là cách nhanh nhất để gia cố một dịch vụ không phải do bạn viết: chạy nó, đọc ba dòng đầu, thêm những chỉ thị đó vào, rồi chạy lại. Phần lớn ứng dụng chịu được <code>NoNewPrivileges</code>, <code>PrivateTmp</code> và <code>ProtectSystem=strict</code> mà chẳng phải sửa gì.</p>
<div class="callout"><code>MemoryMax=</code> đáng được nêu riêng. Nó đặt dịch vụ vào một cgroup với một trần cứng, nên một chỗ rò rỉ bộ nhớ sẽ giết <em>CHÍNH DỊCH VỤ ĐÓ</em> thay vì để OOM killer của nhân đi chọn một nạn nhân — mà như Bài 5.2 đã cho thấy, nạn nhân thường là cơ sở dữ liệu của bạn chứ không phải kẻ gây chuyện. Một dòng, và một chỗ rò rỉ trở thành một chỗ hỏng bị khoanh vùng, có nguyên nhân hiển nhiên ngay trong journal.</div>
<p>Đo thật trên cùng <code>myapp.service</code> của phần "Chạy thử từng bước" dưới đây (Python, <code>User=appuser</code>): điểm ban đầu và sau khi thêm một drop-in có tám dòng hộp cát ở trên — con số càng THẤP càng kín:</p>
<div class="out">$ systemd-analyze security myapp | tail -1
→ Overall exposure level for myapp.service: 9.2 UNSAFE :-{
$ systemd-analyze security myapp | tail -1         <span class="tok-comment"># sau drop-in hardening.conf</span>
→ Overall exposure level for myapp.service: 7.5 EXPOSED :-(
$ sudo systemd-run --wait -p ProtectSystem=strict -p User=appuser /usr/bin/touch /srv/app/x.txt
/usr/bin/touch: cannot touch '/srv/app/x.txt': Read-only file system
$ sudo systemd-run --unit=leak -p MemoryMax=64M -p MemorySwapMax=0 /usr/bin/python3 /srv/app/leak.py
$ systemctl status leak | grep -E 'Active|OOM'
     Active: failed (Result: oom-kill) since Mon 2026-09-28 15:24:51 UTC; 2s ago
Sep 28 15:24:51 vps-1 systemd[1]: leak.service: A process of this unit has been killed by the OOM killer.</div>
<p><code>systemd-run</code> là cách nhanh nhất để thử một chỉ thị mà không phải viết file: nó dựng một unit TẠM (transient) với đúng các thuộc tính <code>-p</code> bạn đưa, chạy lệnh trong đó, rồi biến mất. <code>leak.py</code> ở đây cứ mỗi 50 ms xin thêm 10 MB; với trần 64M nó chết ở khoảng 60 MB — và chỉ nó chết, không phải cơ sở dữ liệu nằm cạnh.</p>

<h3>Drop-in: ghi đè mà không phải sửa file gốc</h3>
${slide('lx-11', 8, 'Drop-in, hộp cát và điểm systemd-analyze security')}
<pre><code class="language-bash">sudo systemctl edit nginx              <span class="tok-comment"># tạo một drop-in rồi mở nó ra</span></code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/nginx.service.d/override.conf</span>
[Service]
MemoryMax=1G
Restart=always</code></pre>
<pre><code class="language-bash">systemctl cat nginx                    <span class="tok-comment"># file chính + mọi drop-in, theo thứ tự</span>
sudo systemctl revert nginx            <span class="tok-comment"># bỏ hết các phần ghi đè cục bộ</span></code></pre>
<div class="callout ok">Đừng bao giờ sửa một file unit đến từ một gói phần mềm: lần <code>apt upgrade</code> kế tiếp sẽ thay nó và thay đổi của bạn biến mất. Một drop-in trong <code>/etc/systemd/system/&lt;unit&gt;.d/</code> thì sống sót qua các lần nâng cấp, hiện ra rõ ràng trong <code>systemctl cat</code>, và gỡ đi được bằng một lệnh. Cùng một lối xếp tầng với các thư mục <code>sshd_config.d</code> và <code>sudoers.d</code> ở Chương 4 và 9 — <code>/etc</code> là của bạn, <code>/usr/lib</code> thuộc về cái gói.</div>
<pre><code><span class="tok-comment"># Muốn nối thêm vào một chỉ thị dạng danh sách thì phải xoá nó trước</span>
[Service]
ExecStart=
ExecStart=/usr/bin/node /srv/app/dist/index.js --flag</code></pre>
<p>Một phép gán rỗng sẽ xoá giá trị thừa kế. Không có nó, dòng <code>ExecStart=</code> trong một drop-in sẽ được <em>CỘNG THÊM</em> vào bản gốc với vài loại chỉ thị và bị từ chối với vài loại khác — và thông báo lỗi sinh ra thì chẳng giúp gì. Hãy xoá trước, rồi mới đặt.</p>

<h3>Khi nó không khởi động</h3>
${slide('lx-11', 7, 'status và journal: đọc mã sau dấu /')}
<pre><code class="language-bash">systemctl status myapp                 <span class="tok-comment"># 1. bản tóm tắt và vài dòng log cuối</span>
journalctl -u myapp -n 50 --no-pager   <span class="tok-comment"># 2. output thật sự (Bài 10.3)</span>
journalctl -u myapp -p err --since '10 min ago'
systemd-analyze verify /etc/systemd/system/myapp.service   <span class="tok-comment"># 3. cú pháp</span>
systemctl show myapp -p ExecStart -p User -p Environment   <span class="tok-comment"># 4. nó GIẢI RA thành gì</span>
sudo -u appuser /usr/bin/node /srv/app/dist/index.js       <span class="tok-comment"># 5. chạy tay, với đúng người dùng đó</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">status=203/EXEC</span><span class="v">Đường dẫn trong <code>ExecStart</code> không tồn tại hoặc không chạy được. Một đường dẫn tương đối, hoặc thiếu <code>chmod +x</code> (Chương 4).</span></div>
  <div class="kv"><span class="k">status=200/CHDIR</span><span class="v"><code>WorkingDirectory=</code> không tồn tại, hoặc cái <code>User=</code> không với tới được nó (chính là chuyện đi xuyên đường dẫn ở Bài 4.5).</span></div>
  <div class="kv"><span class="k">status=1/FAILURE</span><span class="v">Chính ứng dụng thoát ra khác 0. Journal có output của nó — đây là vấn đề của ỨNG DỤNG, không phải của systemd.</span></div>
  <div class="kv"><span class="k">Failed to determine user credentials</span><span class="v">Cái <code>User=</code> không tồn tại. Hãy tạo nó (Bài 4.4) hoặc sửa chỗ gõ sai.</span></div>
  <div class="kv"><span class="k">Start request repeated too quickly</span><span class="v">Chính cái giới hạn tần suất ở trên. Lỗi THẬT nằm sớm hơn trong journal, trước khi cơn bão restart bắt đầu.</span></div>
</div>
<div class="callout ok">Bước 5 là bước gỡ bỏ sự mơ hồ nhanh nhất. Chạy đúng cái lệnh <code>ExecStart</code> bằng tay với đúng cái <code>User=</code> sẽ tái hiện môi trường mà systemd trao cho nó — và nếu cách đó CHẠY ĐƯỢC trong khi dịch vụ thì không, thì khác biệt nằm ở môi trường (Bài 8.3), ở thư mục làm việc, hoặc ở một chỉ thị hộp cát. Điều đó thu hẹp từ "systemd hỏng" xuống một trong ba thứ cụ thể.</div>
<p>Ba mã đầu tiên trong bảng, đo thật bằng ba unit cố ý viết sai (<code>ExecStart=node server.js</code> trên máy không cài node, <code>WorkingDirectory=/srv/khong-co</code>, <code>User=appusr</code> gõ thiếu một chữ):</p>
<div class="out">$ systemctl status t-node | grep Process
    Process: 200 ExecStart=node server.js (code=exited, status=203/EXEC)
$ journalctl -u t-chdir -n 3 -o cat
t-chdir.service: Changing to the requested working directory failed: No such file or directory
t-chdir.service: Main process exited, code=exited, status=200/CHDIR
t-chdir.service: Failed with result 'exit-code'.
$ journalctl -u t-user -n 3 -o cat
t-user.service: Failed to determine user credentials: No such process
t-user.service: Main process exited, code=exited, status=217/USER
t-user.service: Failed with result 'exit-code'.
$ systemd-path search-binaries-default
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin</div>
<p>Dòng cuối là danh sách thư mục systemd tra cho một tên trần trong <code>ExecStart=</code> (systemd.service(5): "a fixed search path determined at compilation time"). <code>python3</code> nằm trong <code>/usr/bin</code> nên <code>ExecStart=python3 server.py</code> chạy được; node của nvm nằm ở <code>~/.nvm/…</code> nên không. Và <code>ExecStart=/usr/bin/echo hello &gt;&gt; /tmp/out.log</code> in ra đúng dòng <code>hello &gt;&gt; /tmp/out.log</code> vào journal — <code>&gt;&gt;</code> chỉ là một tham số, file <code>/tmp/out.log</code> không bao giờ được tạo.</p>

<h3>Một unit hoàn chỉnh cho ứng dụng Node</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/myapp.service</span>
[Unit]
Description=Máy chủ API của MyApp
After=network-online.target postgresql.service
Wants=network-online.target
StartLimitIntervalSec=300      <span class="tok-comment"># thuộc [Unit], không phải [Service]</span>
StartLimitBurst=5

[Service]
Type=simple
User=appuser
Group=appuser
WorkingDirectory=/srv/app
EnvironmentFile=/opt/app/.env
Environment=NODE_ENV=production

ExecStartPre=/usr/bin/npx prisma migrate deploy
ExecStart=/usr/bin/node /srv/app/dist/index.js
ExecReload=/bin/kill -HUP \$MAINPID

Restart=on-failure
RestartSec=5s
TimeoutStopSec=30

NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/app/uploads
MemoryMax=1G

[Install]
WantedBy=multi-user.target</code></pre>
<div class="out">$ sudo systemctl enable --now myapp
$ systemctl is-active myapp
active
$ journalctl -u myapp -n 3 -o cat
listening on 127.0.0.1:3000
connected to postgres
ready</div>
<p><code>TimeoutStopSec=30</code> nối về Bài 5.3: systemd gửi <code>SIGTERM</code>, chờ, rồi mới <code>SIGKILL</code>. Một ứng dụng có xử lý <code>SIGTERM</code> và đóng các kết nối của nó sẽ tắt trong một giây; một ứng dụng lờ nó đi thì tốn trọn ba mươi giây và chết một cách bạo lực ở mỗi lần khởi động lại. Bộ xử lý tín hiệu ấy tốn năm dòng trong ứng dụng, và nó chính là thứ làm cho việc deploy vừa nhanh vừa an toàn.</p>


<h3>Bảng cờ của systemctl hay dùng</h3>
<table>
<tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>--now</code></td><td>Với <code>enable</code>/<code>disable</code>: làm luôn <code>start</code>/<code>stop</code></td><td><code>systemctl enable --now myapp</code></td></tr>
<tr><td><code>--failed</code></td><td>Chỉ liệt kê unit hỏng</td><td><code>systemctl list-units --failed</code></td></tr>
<tr><td><code>--type=</code> · <code>--state=</code></td><td>Lọc theo loại unit / trạng thái</td><td><code>systemctl list-units --type=service --state=running</code></td></tr>
<tr><td><code>-p</code> · <code>--value</code></td><td>Chọn một thuộc tính / chỉ in giá trị (dùng trong script)</td><td><code>systemctl show -p MainPID --value myapp</code> → <code>477</code></td></tr>
<tr><td><code>--no-pager</code> · <code>-n N</code></td><td>Không mở <code>less</code> · số dòng log kèm theo</td><td><code>systemctl status myapp --no-pager -n 0</code></td></tr>
<tr><td><code>--all</code></td><td>Cả unit đang không hoạt động</td><td><code>systemctl list-timers --all</code></td></tr>
<tr><td><code>--reverse</code></td><td>Cây phụ thuộc ngược: ai dựa vào unit này</td><td><code>systemctl list-dependencies --reverse db</code></td></tr>
<tr><td><code>--user</code></td><td>Trình quản lý riêng của người dùng, không cần sudo; muốn nó sống khi bạn đăng xuất thì cần "linger"</td><td><code>systemctl --user status</code> · <code>loginctl show-user "$USER" -p Linger</code></td></tr>
</table>
<p>Ba động từ trả về mã thoát thay vì chữ — dùng thẳng trong <code>if</code> (Bài 6.4): <code>systemctl is-active myapp</code> in <code>active</code> và thoát 0; <code>is-enabled</code> in <code>enabled</code>/<code>disabled</code>/<code>static</code> (<code>static</code> = unit không có mục <code>[Install]</code>, như <code>backup.service</code> ở Bài 11.2 — nó chỉ chạy khi thứ khác kéo nó).</p>

<h3>Chạy thử từng bước: một dịch vụ thật trong container có systemd</h3>
<p>Container bình thường không có systemd (PID 1 là lệnh của bạn). Muốn tập mà không đụng máy thật, dựng một container Ubuntu 24.04 có systemd làm PID 1 — cần <code>--privileged</code>, nên chỉ làm trên máy tập và xoá ngay sau đó:</p>
<pre><code class="language-bash"><span class="tok-comment"># 1. ảnh có systemd (một lần)</span>
docker run -d --name lab-b ubuntu:24.04 sleep infinity
docker exec lab-b bash -c 'apt-get update -qq &amp;&amp; DEBIAN_FRONTEND=noninteractive apt-get install -y -qq systemd systemd-sysv python3 cron openssh-server &gt;/dev/null'
docker commit lab-b lab-sd:img &amp;&amp; docker rm -f lab-b
<span class="tok-comment"># 2. chạy với systemd là PID 1</span>
docker run -d --name lab-sd --hostname vps-1 --privileged --cgroupns=private \\
  --tmpfs /run --tmpfs /run/lock lab-sd:img /sbin/init
docker exec lab-sd systemctl is-system-running
docker exec -it lab-sd bash</code></pre>
<div class="out">running</div>
<pre><code class="language-python"><span class="tok-comment"># 3. trong container: một app nhỏ và unit của nó</span>
useradd -r -s /usr/sbin/nologin appuser
mkdir -p /srv/app &amp;&amp; cd /srv/app
cat &gt; server.py &lt;&lt;'EOF'
import http.server
print("listening on 127.0.0.1:19110", flush=True)
http.server.HTTPServer(("127.0.0.1", 19110), http.server.SimpleHTTPRequestHandler).serve_forever()
EOF
cat &gt; /etc/systemd/system/myapp.service &lt;&lt;'EOF'
[Unit]
Description=My app (lx11 demo)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/srv/app
ExecStart=python3 server.py
Restart=on-failure
RestartSec=2s

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now myapp
systemctl status myapp --no-pager</code></pre>
<div class="out">Created symlink /etc/systemd/system/multi-user.target.wants/myapp.service → /etc/systemd/system/myapp.service.
● myapp.service - My app (lx11 demo)
     Loaded: loaded (/etc/systemd/system/myapp.service; enabled; preset: enabled)
     Active: active (running) since Mon 2026-09-28 15:23:06 UTC; 1s ago
   Main PID: 167 (python3)
      Tasks: 1 (limit: 9563)
     Memory: 8.8M (peak: 9.0M)
        CPU: 51ms
     CGroup: /system.slice/myapp.service
             └─167 python3 server.py

Sep 28 15:23:06 vps-1 systemd[1]: Started myapp.service - My app (lx11 demo).
Sep 28 15:23:06 vps-1 python3[167]: listening on 127.0.0.1:19110</div>
<pre><code class="language-bash"><span class="tok-comment"># 4. giết nó thật mạnh — systemd dựng lại</span>
kill -9 "$(systemctl show -p MainPID --value myapp)"
sleep 4
journalctl -u myapp -n 5 --no-pager
systemctl show myapp -p NRestarts</code></pre>
<div class="out">Sep 28 15:23:43 vps-1 systemd[1]: myapp.service: Main process exited, code=killed, status=9/KILL
Sep 28 15:23:43 vps-1 systemd[1]: myapp.service: Failed with result 'signal'.
Sep 28 15:23:47 vps-1 systemd[1]: myapp.service: Scheduled restart job, restart counter is at 1.
Sep 28 15:23:47 vps-1 systemd[1]: Started myapp.service - My app (lx11 demo).
Sep 28 15:23:47 vps-1 python3[293]: listening on 127.0.0.1:19110
NRestarts=1</div>
<p>Đọc: Main PID đổi từ 167 thành 293, <code>NRestarts=1</code>. Đây là thứ <code>nohup</code> không bao giờ làm được. Xong thì ra khỏi container và <code>docker rm -f lab-sd &amp;&amp; docker rmi lab-sd:img</code>.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Việc</th><th>Ubuntu / Fedora</th><th>macOS (đo trên macOS 27)</th><th>WSL2</th></tr>
<tr><td>PID 1 / trình quản lý dịch vụ</td><td>systemd</td><td><strong>launchd</strong>; <code>systemctl</code> → <code>command not found</code></td><td>systemd nếu đã bật (Ubuntu cài bằng <code>wsl --install</code> bật sẵn)</td></tr>
<tr><td>File định nghĩa dịch vụ</td><td><code>/etc/systemd/system/*.service</code></td><td>file <code>.plist</code> trong <code>/Library/LaunchDaemons</code>, <code>~/Library/LaunchAgents</code> (Chương 13–15)</td><td>như Ubuntu</td></tr>
<tr><td>Bật systemd</td><td>có sẵn</td><td>—</td><td><code>/etc/wsl.conf</code>: <code>[boot]</code> / <code>systemd=true</code>, rồi <code>wsl.exe --shutdown</code> (WSL ≥ 0.67.6)</td></tr>
</table>
<p>Hai lưu ý cho bạn cùng nhóm dùng Windows: dịch vụ systemd trong WSL <strong>không giữ WSL sống</strong> — đóng hết cửa sổ thì cả máy ảo tắt sau một lúc, kéo theo dịch vụ (tài liệu của Microsoft nói rõ điều này), nên WSL là chỗ để TẬP viết unit chứ không phải để chạy thật. Và trên Mac bạn không có systemd để tập — dùng container ở phần "Chạy thử từng bước" ngay trên.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 chạy API bằng <code>nohup node dist/index.js &amp;</code> trên VPS; sáng nay nhà cung cấp khởi động lại máy và API chết từ 4 giờ sáng tới lúc có người phát hiện. Làm lại cho đúng, trong container <code>lab-sd</code> ở phần "Chạy thử từng bước".</p><ol>
<li>Viết <code>/etc/systemd/system/api.service</code> chạy <code>python3 -m http.server 19111 --bind 127.0.0.1</code> dưới người dùng <code>appuser</code>, <code>Restart=on-failure</code>, và đặt <code>StartLimitIntervalSec=60</code> + <code>StartLimitBurst=3</code> ĐÚNG mục. Chạy <code>systemd-analyze verify</code> — phải không in gì.</li>
<li><code>systemctl enable --now api</code>, rồi <code>systemctl is-enabled api; systemctl is-active api</code>.</li>
<li><code>kill -9</code> Main PID của nó; chứng minh nó tự dậy bằng <code>systemctl show api -p NRestarts -p MainPID</code>.</li>
<li>Cố ý đổi <code>User=appuser</code> thành <code>User=apuser</code>, quên <code>daemon-reload</code>, <code>restart</code> — đọc cảnh báo; rồi reload, restart, đọc mã sau dấu <code>/</code> trong <code>systemctl status</code> (vì <code>Restart=on-failure</code> + <code>StartLimitBurst=3</code>, bạn sẽ thấy luôn <code>Start request repeated too quickly</code>). Sửa lại, <code>daemon-reload</code>, <code>reset-failed</code>, <code>restart</code>.</li>
<li>Thêm drop-in <code>/etc/systemd/system/api.service.d/limits.conf</code> với <code>MemoryMax=128M</code>; kiểm bằng <code>systemctl cat api</code> và <code>systemctl show api -p MemoryMax</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>verify</code> im lặng; <code>enabled</code> + <code>active</code>; <code>NRestarts=1</code> với Main PID mới; bạn đọc được <code>status=217/USER</code>; <code>systemctl show api -p MemoryMax</code> in <code>MemoryMax=134217728</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">init / PID 1 (tiến trình khởi đầu)</span><span class="v">Tiến trình đầu tiên nhân chạy, tổ tiên của mọi tiến trình; trên máy chủ hiện nay là systemd.</span></div>
  <div class="kv"><span class="k">Unit (đơn vị)</span><span class="v">Một thứ systemd quản lý, mô tả bằng một file: <code>.service</code>, <code>.timer</code>, <code>.socket</code>, <code>.target</code>…</span></div>
  <div class="kv"><span class="k">Enabled / active (được bật / đang chạy)</span><span class="v">Enabled = sẽ chạy khi máy khởi động; active = đang chạy ngay lúc này. Hai thứ độc lập.</span></div>
  <div class="kv"><span class="k">Dependency / ordering (phụ thuộc / thứ tự)</span><span class="v"><code>Wants</code>/<code>Requires</code> kéo unit khác theo; <code>After</code>/<code>Before</code> chỉ xếp thứ tự.</span></div>
  <div class="kv"><span class="k">Drop-in (file chèn thêm)</span><span class="v">File <code>*.conf</code> trong <code>&lt;unit&gt;.d/</code> ghi đè từng dòng của unit gốc mà không sửa nó.</span></div>
  <div class="kv"><span class="k">Rate limit / start limit (giới hạn tần suất)</span><span class="v">Quá <code>StartLimitBurst</code> lần khởi động trong <code>StartLimitIntervalSec</code> thì systemd thôi thử.</span></div>
  <div class="kv"><span class="k">Sandboxing (hộp cát)</span><span class="v">Các chỉ thị như <code>ProtectSystem</code>, <code>PrivateTmp</code> giới hạn thứ dịch vụ nhìn thấy và sửa được.</span></div>
  <div class="kv"><span class="k">Transient unit (unit tạm)</span><span class="v">Unit do <code>systemd-run</code> dựng tại chỗ, không có file, biến mất khi xong.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>systemd là PID 1 trên gần như mọi máy chủ; một file unit ba mục thay cho <code>nohup</code> với khởi động cùng máy, tự dựng dậy, log và giới hạn tài nguyên.</li>
<li>Sửa unit xong phải <code>daemon-reload</code>; <code>enable</code> (cùng máy) và <code>start</code> (ngay) là hai việc, <code>--now</code> gộp lại.</li>
<li><code>Wants</code>/<code>Requires</code> kéo theo, <code>After</code> chỉ xếp thứ tự; <code>Requires</code> không theo khi dịch vụ kia tự sập.</li>
<li><code>StartLimitIntervalSec</code>/<code>Burst</code> thuộc <code>[Unit]</code>, và <code>RestartSec</code> quá lớn làm giới hạn vô dụng — <code>systemd-analyze verify</code> bắt được lỗi đặt nhầm mục.</li>
<li>Mã sau dấu <code>/</code> gọi tên chỗ hỏng: <code>203/EXEC</code>, <code>200/CHDIR</code>, <code>217/USER</code>, còn <code>1/FAILURE</code> là lỗi của chính app.</li>
<li>Drop-in để ghi đè, <code>systemd-run -p …</code> để thử chỉ thị, <code>systemd-analyze security</code> để chấm điểm hộp cát.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man5/systemd.unit.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">systemd.unit(5) — mục [Unit] và [Install]</span><span class="lc-sub">Định nghĩa chính xác của <code>Wants=</code>, <code>Requires=</code>, <code>BindsTo=</code>, <code>After=</code> và <code>StartLimitIntervalSec=</code> — nguồn của bảng đo thật trong bài.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/systemd.service.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">Mọi chỉ thị của <code>[Service]</code>, gồm tất cả các giá trị của <code>Type=</code> và ngữ nghĩa chính xác của việc khởi động lại. Tài liệu tra cứu cho bài này.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/systemd.exec.html" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">systemd.exec(5) — các chỉ thị hộp cát</span><span class="lc-sub"><code>ProtectSystem</code>, <code>ReadWritePaths</code>, <code>RestrictAddressFamilies</code> và phần còn lại, mỗi cái kèm mô tả nó thật sự chặn cái gì.</span></span>
</a>
<a class="link-card" href="https://www.digitalocean.com/community/tutorials/understanding-systemd-units-and-unit-files" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Hiểu về unit và file unit của systemd</span><span class="lc-sub">Một bài dẫn dắt dễ đọc về các loại unit, target và thứ tự phụ thuộc — nền tốt để đọc trước khi viết cái unit đầu tiên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: biến một script thành một dịch vụ</span><span class="lc-sub">Bài chấm điểm: viết một unit có người dùng riêng, chẩn đoán lỗi 203/EXEC và 200/CHDIR, thêm một drop-in ghi đè, và gỡ một vòng lặp sập đã bị chặn tần suất.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một đường dẫn tương đối hoặc một cấu trúc của shell nằm trong <code>ExecStart=</code>. systemd KHÔNG chạy shell, nên <code>ExecStart=node dist/index.js</code> hỏng với <code>203/EXEC</code> ngay khi node không nằm trong bốn thư mục chuẩn (cài bằng nvm chẳng hạn — systemd chỉ tra một danh sách cố định, không tra <code>PATH</code> của bạn, Bài 8.1), còn <code>ExecStart=/usr/bin/node app.js &gt;&gt; /var/log/app.log</code> thì truyền <code>&gt;&gt;</code> và cái tên file cho node dưới dạng THAM SỐ chứ không chuyển hướng gì cả. Hãy luôn dùng đường dẫn tuyệt đối, để journal hứng stdout thay vì tự chuyển hướng, và khi bạn thật sự cần cú pháp của shell thì hãy nói rõ ra bằng <code>/bin/bash -c '…'</code>.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Phải <code>daemon-reload</code> sau mỗi lần sửa unit, không thì bạn đang thử cái file cũ. <code>enable</code> và <code>start</code> là hai chuyện khác nhau — <code>--now</code> làm cả hai, và quên <code>enable</code> nghĩa là ứng dụng biến mất sau lần khởi động lại kế tiếp. Và khi một dịch vụ không khởi động được, hãy chạy đúng cái <code>ExecStart</code> của nó bằng tay với đúng cái <code>User=</code> của nó: riêng lệnh đó phân tách "systemd cấu hình sai" với "ứng dụng hỏng" trong khoảng năm giây.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Scheduling: cron and systemd timers|||11.2 — Hẹn giờ: cron và timer của systemd',
      slug: 'lnx-11-2-cron-timer',
      type: 'LESSON',
      description: 'Năm trường của crontab, cái bẫy môi trường giết chín trên mười công việc cron, output đi đâu mất, timer của systemd và OnCalendar, chống chạy chồng bằng flock, và một ví dụ sao lưu hoàn chỉnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Scheduling: cron and systemd timers</h2>
<p class="lead">Every Ubuntu server ships two schedulers. <strong>cron</strong> is older than most of the people reading this, exists on every Unix ever made, and is configured in one cryptic line. <strong>systemd timers</strong> are newer and more verbose, and hand you the journal, dependencies, and a calculator that tells you exactly when the thing will next fire. You need both — cron because you will meet it on other people's machines, timers because that is what you should be writing on yours.</p>
<p>They fail the same way, and it is almost never the schedule. It is the environment.</p>

<h3>The five fields</h3>
${slide('lx-11', 9, 'Một dòng cron: 5 trường + câu lệnh')}
<p>A crontab line is five time fields and then everything else is the command.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · minute</span><span class="lz-t">0–59</span><span class="lz-d">The only field with no "every day" escape hatch — a job with <code>*</code> here runs sixty times an hour. This is the field people get wrong at 3am.</span></div>
  <div class="lz-step"><span class="lz-k">2 · hour</span><span class="lz-t">0–23</span><span class="lz-d">24-hour clock, and in the machine's timezone — which on a VPS is usually UTC, not yours. <code>timedatectl</code> tells you which.</span></div>
  <div class="lz-step"><span class="lz-k">3 · day of month</span><span class="lz-t">1–31</span><span class="lz-d">There is no "last day of the month". People fake it with <code>28-31</code> plus a test inside the script.</span></div>
  <div class="lz-step"><span class="lz-k">4 · month</span><span class="lz-t">1–12 or jan–dec</span><span class="lz-d">Rarely anything but <code>*</code>. Names are case-insensitive and cannot be used with step syntax.</span></div>
  <div class="lz-step"><span class="lz-k">5 · day of week</span><span class="lz-t">0–7 (0 and 7 = Sunday) or sun–sat</span><span class="lz-d">The trap: if BOTH day-of-month and day-of-week are restricted, cron runs when EITHER matches, not both.</span></div>
  <div class="lz-step"><span class="lz-k">6 · the command</span><span class="lz-t">the rest of the line, run by /bin/sh</span><span class="lz-d">Not bash. <code>sh</code> on Ubuntu is dash, so bashisms like <code>[[ ]]</code> and arrays are syntax errors here (Lesson 6.2).</span></div>
</div>
<pre><code><span class="tok-comment"># minute hour day-of-month month day-of-week  command</span>
30 3 * * *      /usr/local/bin/backup.sh          <span class="tok-comment"># 03:30 every day</span>
*/5 * * * *     /usr/local/bin/health-check.sh    <span class="tok-comment"># every 5 minutes</span>
0 */6 * * *     /usr/local/bin/sync.sh            <span class="tok-comment"># at 00:00, 06:00, 12:00, 18:00</span>
0 9 * * 1-5     /usr/local/bin/weekday-report.sh  <span class="tok-comment"># 09:00 Mon–Fri</span>
0 0 1 * *       /usr/local/bin/monthly.sh         <span class="tok-comment"># midnight on the 1st</span>
15 2 * * 0      /usr/local/bin/weekly.sh          <span class="tok-comment"># 02:15 Sunday</span>
0,30 * * * *    /usr/local/bin/twice-hourly.sh    <span class="tok-comment"># lists work too</span></code></pre>
<div class="callout"><strong>Read a line out loud before you trust it.</strong> <code>0 */6 * * *</code> is "minute 0, every 6th hour" — four times a day. <code>*/6 * * * *</code> is "every 6th minute" — 240 times a day. One character apart, forty times the load. When in doubt, TRANSLATE the line into <code>OnCalendar</code> form (table just below) and feed it to <code>systemd-analyze calendar</code> further down this lesson — paste the raw cron line and all it says is <code>Failed to parse calendar specification</code>, or ask <code>crontab -l</code> for the file you already have and compare against a job you know works.</div>

<h3>Deeper: a cron ⇄ OnCalendar translation table, and crontab does not catch everything</h3>
<table>
<tr><th>cron</th><th>OnCalendar=</th><th>Meaning</th></tr>
<tr><td><code>30 3 * * *</code></td><td><code>*-*-* 03:30</code></td><td>03:30 every day</td></tr>
<tr><td><code>*/15 * * * *</code></td><td><code>*:0/15</code></td><td>every 15 minutes (:00 :15 :30 :45)</td></tr>
<tr><td><code>0 */6 * * *</code></td><td><code>*-*-* 0/6:00</code></td><td>00:00, 06:00, 12:00, 18:00</td></tr>
<tr><td><code>0 9 * * 1-5</code></td><td><code>Mon..Fri 09:00</code></td><td>weekdays at 09:00</td></tr>
<tr><td><code>0 0 * * 1</code> · <code>@weekly</code> (cron: Sunday!)</td><td><code>weekly</code> (= Monday 00:00)</td><td>two "weekly"s on different days</td></tr>
<tr><td>(cannot be written)</td><td><code>Sat *-*-1..7 02:00</code></td><td>FIRST Saturday of the month</td></tr>
<tr><td>(cannot be written)</td><td><code>*-*~01 23:00</code></td><td>23:00 on the LAST day of the month (<code>~</code> = count from the end)</td></tr>
</table>
<div class="out">$ systemd-analyze calendar '0 */6 * * *'
Failed to parse calendar specification '0 */6 * * *': Invalid argument
$ systemd-analyze calendar '*-*~01 23:00' --iterations=3
  Original form: *-*~01 23:00
Normalized form: *-*~01 23:00:00
    Next elapse: Wed 2026-09-30 23:00:00 UTC
       From now: 2 days left
   Iteration #2: Sat 2026-10-31 23:00:00 UTC
       From now: 1 month 2 days left
   Iteration #3: Mon 2026-11-30 23:00:00 UTC
       From now: 2 months 2 days left</div>
<p>Note the <code>@weekly</code> row: in cron it is <code>0 0 * * 0</code> (midnight Sunday), while systemd's <code>weekly</code> is Monday 00:00 — same word, one day apart.</p>
<p><strong>crontab checks syntax, but only COARSE errors.</strong> Measured on Ubuntu 24.04 (cron 3.0pl1-184ubuntu2): a garbage line is rejected, but minute 61, hour 25, or a line missing a whole field are all installed silently:</p>
<div class="out">$ echo 'abc' &gt; c.txt; crontab c.txt
"c.txt":1: bad command
errors in crontab file, can't install.
$ echo '61 3 * * * /bin/true' &gt; c.txt; crontab c.txt; echo "rc=$?"
rc=0
$ echo '* * * * /bin/true' &gt; c.txt; crontab c.txt; echo "rc=$?"
rc=0</div>
<p>The third one is the most dangerous: four stars, and <code>/bin/true</code> is read as the fifth field. crontab says nothing, and that job will never run the way you think. So "crontab accepted it" does not mean "the line is right" — read it aloud, translate it into <code>OnCalendar</code> and ask the machine, or paste it into crontab.guru.</p>

<h3>Editing a crontab</h3>
<pre><code>crontab -e            <span class="tok-comment"># edit YOUR crontab (opens \$EDITOR, defaults to nano)</span>
crontab -l            <span class="tok-comment"># list it</span>
crontab -l &gt; ~/cron.bak   <span class="tok-comment"># back it up BEFORE you touch it</span>
sudo crontab -e -u deploy <span class="tok-comment"># edit another user's</span>
crontab -r            <span class="tok-comment"># DELETE it. No confirmation. See the pitfall.</span></code></pre>
<div class="out">$ crontab -l
# m h  dom mon dow   command
MAILTO=""
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

30 3 * * * /usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1
*/10 * * * * /usr/local/bin/health-check.sh &gt;/dev/null 2&gt;&amp;1</div>
<p><code>crontab -e</code> is not just "open a file in an editor". It writes to a spool directory you should never edit by hand, and it <strong>validates the syntax on save</strong> — if you get <code>errors in crontab file, can't install</code>, your old crontab is still running and the new one was rejected. That validation is the reason to use <code>crontab -e</code> instead of editing the spool file directly.</p>

<h3>Where crontabs live</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">/var/spool/cron/crontabs/&lt;user&gt;</span><span class="lz-lnote">Per-user crontabs, written by <code>crontab -e</code>. Five time fields, then the command. The job runs as that user. Do not edit these files directly — no syntax check, and cron may not notice the change.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/crontab</span><span class="lz-lnote">System crontab. <strong>Six</strong> fields: the same five plus a <strong>username</strong> before the command. Editing it by hand is fine, but prefer a file in <code>/etc/cron.d/</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/cron.d/&lt;name&gt;</span><span class="lz-lnote">One file per package or per job, same six-field format. This is the right place for anything you deploy, because a config-management tool or a package can own the whole file. Filenames must not contain a dot.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/cron.{hourly,daily,weekly,monthly}/</span><span class="lz-lnote">Drop an executable script in, no schedule line at all. Run by <code>run-parts</code>. The script must be executable and — same rule as above — <strong>must not have a <code>.sh</code> extension</strong>, or run-parts silently skips it.</span></div>
  <div class="lz-layer"><span class="lz-lname">systemd timers</span><span class="lz-lnote">A different mechanism entirely, covered below. On a modern Ubuntu, <code>apt</code> updates, <code>logrotate</code>, <code>fstrim</code> and <code>man-db</code> have all already moved here — which is why <code>/etc/cron.daily</code> can look emptier than you expect.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># The six-field system format — note the user column</span>
cat /etc/cron.d/app-cleanup</code></pre>
<div class="out">SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=root

# m h dom mon dow  user     command
17 4 * * *         deploy   /srv/app/bin/cleanup.sh</div>
<div class="pitfall"><strong>Pitfall:</strong> a file in <code>/etc/cron.d/</code> or <code>/etc/cron.daily/</code> whose name contains a <strong>dot</strong> is ignored. <code>app.sh</code>, <code>backup.cron</code>, <code>cleanup.bak</code> — all silently skipped, no error anywhere. This is <code>run-parts</code>'s rule (it also skips names with characters outside <code>[A-Za-z0-9_-]</code>), and it is the single most common reason a job that "is definitely installed" never runs. Name the file <code>app-cleanup</code>, with no extension. Verify with <code>run-parts --test /etc/cron.daily</code>, which prints exactly the scripts that WOULD run.</div>
<p>Measured on Ubuntu 24.04: four scripts in <code>/etc/cron.daily/</code> (two with a dot in the name, one without the execute bit) and two files in <code>/etc/cron.d/</code> that differ by exactly one character:</p>
<div class="out">$ ls /etc/cron.daily
apt-compat  backup-db  backup.sh  dpkg  noexec-job  rotate.bak
$ run-parts --test /etc/cron.daily
/etc/cron.daily/apt-compat
/etc/cron.daily/backup-db
/etc/cron.daily/dpkg
$ cat /etc/cron.d/app.cleanup /etc/cron.d/app-cleanup
* * * * * root touch /tmp/co-cham
* * * * * root touch /tmp/khong-cham
$ journalctl -t CRON | grep cham       <span class="tok-comment"># two minutes later</span>
Sep 28 15:26:01 vps-1 CRON[821]: (root) CMD (touch /tmp/khong-cham)
Sep 28 15:27:01 vps-1 CRON[864]: (root) CMD (touch /tmp/khong-cham)</div>
<p><code>app.cleanup</code> does not get a single log line — cron does not consider it a file at all, so there is no error to report either.</p>

<h3>The environment trap</h3>
${slide('lx-11', 11, 'Môi trường của cron và tên file có dấu chấm')}
<p>This is the lesson. Nine out of ten broken cron jobs are broken here, and the symptom is always the same sentence: <em>"it works when I run it by hand"</em>.</p>
<p>When cron runs your command it does <strong>not</strong> read <code>~/.bashrc</code>, <code>~/.profile</code>, or <code>/etc/profile</code> (Lesson 8.2). It gives you a very thin environment: <code>HOME</code>, <code>LOGNAME</code>, <code>SHELL=/bin/sh</code>, a default <code>PATH</code>, and almost nothing else. No <code>nvm</code>, no <code>pyenv</code>, no <code>rbenv</code>, no <code>~/.local/bin</code>, none of your exports. <strong>That default PATH differs between cron implementations</strong> (corrected from a real measurement on 28/09/2026 — an earlier version of this lesson said <code>PATH=/usr/bin:/bin</code> and "no <code>LANG</code>", which is WRONG on Ubuntu): Ubuntu/Debian cron loads <code>/etc/environment</code> and <code>/etc/default/locale</code> through PAM (<code>pam_env</code> in <code>/etc/pam.d/cron</code>), so PATH is as long as the system one and <code>LANG=C.UTF-8</code> is set; Fedora/RHEL cronie defaults to <code>/usr/bin:/bin:/usr/sbin:/sbin</code> (per the cronie source). None of them has the directories that <code>~/.bashrc</code>/<code>~/.profile</code> add — and that is exactly where nvm's node lives.</p>
<pre><code class="language-bash"><span class="tok-comment"># Prove it: dump cron's real environment for one minute</span>
crontab -l | { cat; echo '* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1'; } | crontab -
<span class="tok-comment"># wait a minute, then</span>
cat /tmp/cron-env.txt</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
LANG=C.UTF-8
SHELL=/bin/sh
PWD=/home/deploy</div>
<p class="note-ct">Real output: Ubuntu 24.04 cron (3.0pl1-184ubuntu2), user <code>deploy</code>, measured 28/09/2026. The <code>PATH</code> line is the content of <code>/etc/environment</code>.</p>
<p>Now compare that with your interactive shell — <code>echo "\$PATH"</code> in a terminal on the same box has the extra directories that <code>~/.profile</code> and <code>~/.bashrc</code> add (<code>~/.local/bin</code>, <code>~/.nvm/versions/node/…/bin</code>, <code>~/.cargo/bin</code>…); on Fedora/RHEL it is several times longer than cron's. Every tool that lives in one of those missing directories is a <code>command not found</code> waiting to happen, and cron writes that error to mail you are not reading.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Symptom</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">node: command not found</span><span class="lz-nsub">…or <code>python: not found</code>, or the job exits 127. Runs perfectly in your terminal.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cause</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The binary is on YOUR PATH, not cron's</span><span class="lz-nsub">nvm puts node under <code>~/.nvm/versions/node/&lt;ver&gt;/bin</code> and adds it in <code>~/.bashrc</code> — a file cron never reads.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Fix A</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Absolute paths everywhere</span><span class="lz-nsub"><code>/home/deploy/.nvm/versions/node/v22.11.0/bin/node</code>. Find it once with <code>command -v node</code>. Blunt, and it always works.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Fix B</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Set PATH at the top of the crontab</span><span class="lz-nsub">A <code>PATH=…</code> line before the jobs applies to all of them. Cleanest when several jobs need the same tools.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Fix C — best</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Let a wrapper script own the environment</span><span class="lz-nsub">cron calls <code>/usr/local/bin/nightly</code>; the script sets its own PATH, <code>cd</code>s where it needs to be, and sources what it needs. cron stays one line.</span></div></div>
  </div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Fix C, in full — the shape every scheduled job should have</span>
<span class="tok-comment"># /usr/local/bin/nightly</span>
#!/usr/bin/env bash
set -Eeuo pipefail                                   <span class="tok-comment"># Lesson 7.1</span>
export PATH=/usr/local/bin:/usr/bin:/bin
export HOME=/home/deploy
cd /srv/app || exit 1                                <span class="tok-comment"># cron starts you in \$HOME, not here</span>
[ -f /srv/app/.env ] &amp;&amp; set -a &amp;&amp; . /srv/app/.env &amp;&amp; set +a
exec /usr/bin/node scripts/nightly.js</code></pre>
<div class="callout ok"><strong>Test it the way cron will run it.</strong> This one line gets you a shell with a cron-like environment, and it turns a "why does it only fail at 3am" mystery into a normal error you can read:
<pre><code>env -i HOME="\$HOME" LOGNAME="\$LOGNAME" PATH=/usr/bin:/bin SHELL=/bin/sh /bin/sh -c '/usr/local/bin/nightly'</code></pre>
<code>env -i</code> wipes the environment first, so nothing of yours leaks in. If it passes here, it will pass in cron.</div>

<h3>Where the output goes</h3>
<p>By default cron captures whatever the job writes to stdout and stderr and <strong>emails it to the user</strong>. On a normal VPS there is no mail transport installed, so the mail is generated, fails to send, and disappears. Your job's error message never existed as far as you are concerned.</p>
<pre><code><span class="tok-comment"># The three things people write at the end of a cron line</span>
30 3 * * * /usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1   <span class="tok-comment"># keep everything ✅</span>
30 3 * * * /usr/local/bin/backup.sh 2&gt;&amp;1 | logger -t backup       <span class="tok-comment"># into the journal ✅</span>
30 3 * * * /usr/local/bin/backup.sh &gt;/dev/null 2&gt;&amp;1               <span class="tok-comment"># deliberate silence ⚠️</span></code></pre>
<div class="out">$ logger -t backup "test line"
$ journalctl -t backup -n 1
Aug 22 17:41:09 vps-1 backup[41233]: test line</div>
<p><code>logger</code> is the underrated one: it puts cron output into the journal, where it inherits rotation, timestamps, and <code>journalctl -t backup --since today</code> (Lesson 10.3). No log file to rotate yourself, no <code>/var/log</code> filling up (Lesson 10.1).</p>
<div class="callout warn"><strong><code>&gt;/dev/null 2&gt;&amp;1</code> is how monitoring dies.</strong> It is the most-copied fragment in all of cron, and it throws away the error message along with the noise. If the job is chatty on success, fix the job — make it quiet on success and loud on failure (Lesson 7.2), then keep the output. A backup job whose failures go to <code>/dev/null</code> is a backup job you will discover is broken on the day you need it.</div>
<p>Two more crontab variables worth knowing: <code>MAILTO=you@example.com</code> sends the output somewhere real if you do have mail configured, and <code>MAILTO=""</code> disables the mail attempt entirely. Both go on a line of their own, above the jobs.</p>

<h3>The @ shortcuts</h3>
<pre><code>@reboot     /usr/local/bin/start-tunnel.sh   <span class="tok-comment"># once, at boot</span>
@daily      /usr/local/bin/rotate.sh         <span class="tok-comment"># same as 0 0 * * *</span>
@hourly     /usr/local/bin/poll.sh           <span class="tok-comment"># same as 0 * * * *</span>
@weekly @monthly @yearly                     <span class="tok-comment"># and the obvious rest</span></code></pre>
<div class="pitfall"><strong>Pitfall:</strong> <code>@reboot</code> looks like the easy way to start your app at boot. It is not. It runs when <em>cron</em> starts, with no ordering relative to the network, the database, or the filesystems being mounted — so a job that needs any of those wins a race it did not know it was in. It also has no restart-on-crash and no supervision: if the process dies at 4am, nothing brings it back. Starting a long-running program is a <strong>systemd service</strong> (Lesson 11.1), not a cron line. <code>@reboot</code> is for one-shot chores like clearing a scratch directory.</div>

<h3>systemd timers: the pair</h3>
${slide('lx-11', 13, 'Timer = .timer (lúc nào) + .service (làm gì)')}
<p>A timer is <strong>two units</strong>: a <code>.service</code> that says what to do, and a <code>.timer</code> with the same base name that says when. The timer starts the service; the service runs once and exits.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">backup.service</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">What to run — Type=oneshot</span><span class="lz-nsub">An ordinary unit with <code>ExecStart=</code>, <code>User=</code>, and any sandboxing you want. On its own it never runs: there is no <code>[Install]</code> section and nothing enables it.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">backup.timer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">When to run — OnCalendar=</span><span class="lz-nsub">This is the unit you <code>enable --now</code>. It matches <code>backup.service</code> by name; <code>Unit=</code> overrides that if you want a different name.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Every run</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Journal, exit code, duration — free</span><span class="lz-nsub"><code>journalctl -u backup.service</code> has every run's output with timestamps. <code>systemctl status backup.service</code> shows the last exit code. Nothing to configure.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># /etc/systemd/system/backup.service</span>
[Unit]
Description=Nightly database backup
After=network-online.target postgresql.service

[Service]
Type=oneshot
User=deploy
WorkingDirectory=/srv/app
EnvironmentFile=/srv/app/.env
ExecStart=/usr/local/bin/backup.sh</code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/backup.timer</span>
[Unit]
Description=Run the nightly backup at 03:30

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true                  <span class="tok-comment"># run on boot if the machine was off at 03:30</span>
RandomizedDelaySec=300           <span class="tok-comment"># spread the load over 5 minutes</span>
AccuracySec=1s                   <span class="tok-comment"># default is 1min; only tighten if you need to</span>

[Install]
WantedBy=timers.target</code></pre>
<pre><code class="language-bash">sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer   <span class="tok-comment"># the TIMER, not the service</span>
systemctl list-timers backup.timer</code></pre>
<div class="out">NEXT                        LEFT       LAST                        PASSED  UNIT          ACTIVATES
Sat 2026-08-23 03:30:00 UTC 9h 48min   Fri 2026-08-22 03:31:12 UTC 14h ago backup.timer  backup.service

1 timers listed.</div>
<div class="callout"><strong><code>enable</code> the timer, never the service.</strong> Enabling <code>backup.service</code> makes it run at every boot and never again — the opposite of what you want. If the job seems to run once after a reboot and then stop forever, this is why: check <code>systemctl is-enabled backup.service</code>, and if it says <code>enabled</code>, <code>disable</code> it and enable the timer instead.</div>

<p>Two more things measured on a real machine. <code>Persistent=true</code> remembers the last run in a timestamp file — delete it and the timer "forgets" to catch up. And to try a schedule without writing any file, <code>systemd-run --on-calendar</code> builds a TRANSIENT timer + service pair:</p>
<div class="out">$ ls /var/lib/systemd/timers/ | grep backup
stamp-backup.timer
$ sudo systemd-run --on-calendar='*:0/2' --unit=lx-demo /usr/bin/true
Running timer as unit: lx-demo.timer
Will run service as unit: lx-demo.service
$ systemctl list-timers lx-demo.timer | head -2
NEXT                            LEFT LAST PASSED UNIT          ACTIVATES
Mon 2026-09-28 15:32:00 UTC 1min 30s -         - lx-demo.timer lx-demo.service</div>
<p>The transient unit disappears when you <code>systemctl stop lx-demo.timer</code> or when the machine reboots — handy for trying calendar syntax on a real box without leaving litter behind.</p>

<h3>OnCalendar, and a calculator that removes the guesswork</h3>
${slide('lx-11', 10, 'Dịch cron sang OnCalendar, hỏi systemd-analyze calendar')}
<p>The format is <code>DayOfWeek Year-Month-Day Hour:Minute:Second</code>, with <code>*</code> as a wildcard, <code>/</code> for steps, and <code>,</code> for lists. The genuinely useful part is that systemd will tell you what your expression means before you ship it.</p>
<pre><code>systemd-analyze calendar '*-*-* 03:30:00'
systemd-analyze calendar 'Mon..Fri 09:00' --iterations=3
systemd-analyze calendar 'daily'
systemd-analyze calendar '*:0/15'          <span class="tok-comment"># every 15 minutes</span></code></pre>
<div class="out">$ systemd-analyze calendar 'Mon..Fri 09:00' --iterations=3
  Original form: Mon..Fri 09:00
Normalized form: Mon..Fri *-*-* 09:00:00
    Next elapse: Mon 2026-08-24 09:00:00 UTC
       (in UTC): Mon 2026-08-24 09:00:00 UTC
       From now: 1 day 15h left
       Iter. #2: Tue 2026-08-25 09:00:00 UTC
       From now: 2 days 15h left
       Iter. #3: Wed 2026-08-26 09:00:00 UTC
       From now: 3 days 15h left</div>
<div class="kv-grid">
  <div class="kv"><span class="k">hourly · daily · weekly · monthly</span><span class="v">Named shorthands. <code>daily</code> is midnight, <code>weekly</code> is Monday 00:00 — check with the calculator rather than assuming.</span></div>
  <div class="kv"><span class="k">*-*-* 03:30:00</span><span class="v">03:30 every day. The most common line you will write.</span></div>
  <div class="kv"><span class="k">Mon..Fri 09:00</span><span class="v">Weekdays at 09:00. Seconds default to 0 when omitted.</span></div>
  <div class="kv"><span class="k">*:0/15</span><span class="v">Every 15 minutes — at :00, :15, :30, :45.</span></div>
  <div class="kv"><span class="k">*-*-01 04:00:00</span><span class="v">04:00 on the first of every month.</span></div>
  <div class="kv"><span class="k">Sat *-*-1..7 02:00</span><span class="v">The first Saturday of the month — day ranges and weekday together, which cron cannot express.</span></div>
  <div class="kv"><span class="k">OnBootSec=5min</span><span class="v">Monotonic: 5 minutes after boot. Not a wall-clock time at all.</span></div>
  <div class="kv"><span class="k">OnUnitActiveSec=1h</span><span class="v">One hour after the service last ran. Use with <code>OnBootSec=</code> for "every hour, starting shortly after boot" — a genuinely different meaning from <code>0 * * * *</code>, because it never overlaps a slow run with the next start.</span></div>
</div>
<p>Two directives have no cron equivalent at all and are the reason to prefer timers. <code>Persistent=true</code> remembers the last run on disk: if the machine was powered off at 03:30, the job fires shortly after the next boot instead of being silently skipped — which is what cron does, and it is how a "daily" backup quietly misses the three days a laptop was closed. <code>RandomizedDelaySec=</code> jitters the start, so fifty servers with the same timer do not hit your database in the same second.</p>

<h3>UTC and +07: why the backup ran at 9 in the morning</h3>
${slide('lx-11', 12, 'Máy chủ UTC, bạn +07: cron lệch 7 tiếng')}
<p>A true story from this course's project: the containers and the VPS run on <strong>UTC</strong>, while the person writing the schedule lives on Vietnam time (<strong>+07</strong>). The line <code>0 2 * * * backup.sh</code> was written to mean "2am, when nobody is using it" — and it ran at exactly 02:00… UTC, which is <strong>09:00 in Vietnam</strong>, at peak hour, competing for the disk with real users. There was no error line, because as far as cron was concerned nothing was wrong.</p>
<div class="out">$ date; TZ=Asia/Ho_Chi_Minh date
Mon Sep 28 15:26:06 UTC 2026
Mon Sep 28 22:26:06 +07 2026</div>
<p>Three fixes, in order of preference:</p>
<ol>
<li><strong>Write the schedule in the MACHINE's time.</strong> For 02:00 Vietnam time write <code>0 19 * * *</code> (19:00 UTC the day BEFORE). Check the machine's zone with <code>timedatectl</code> before writing any line.</li>
<li><strong>Use a timer and put the zone in the schedule itself</strong> — systemd understands it and lets you ask back in UTC:
<div class="out">$ systemd-analyze calendar '*-*-* 02:00 Asia/Ho_Chi_Minh'
  Original form: *-*-* 02:00 Asia/Ho_Chi_Minh
Normalized form: *-*-* 02:00:00 Asia/Ho_Chi_Minh
    Next elapse: Mon 2026-09-28 19:00:00 UTC
       From now: 3h 11min left</div></li>
<li><strong>Change the whole machine's zone</strong> (<code>timedatectl set-timezone Asia/Ho_Chi_Minh</code>) — possible, but Lesson 11.3 explains why servers are better left on UTC; and Debian/Ubuntu cron reads the zone at startup, so you also need <code>systemctl restart cron</code>.</li>
</ol>
<div class="callout warn"><strong><code>CRON_TZ=</code> does NOT work in Ubuntu's cron.</strong> Plenty of articles say to add <code>CRON_TZ=Asia/Ho_Chi_Minh</code> at the top of the crontab. That is a cronie feature (Fedora/RHEL — <code>man 5 crontab</code> on Fedora 44 documents it). Ubuntu 24.04's cron treats it as an ordinary environment variable. Measured: a job at 22:28 "Vietnam time" set while the Vietnam clock read 22:27:</div>
<div class="out">$ crontab -l
CRON_TZ=Asia/Ho_Chi_Minh
28 22 * * * touch /tmp/crontz-vn
* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1
$ date      <span class="tok-comment"># two minutes later</span>
Mon Sep 28 15:28:21 UTC 2026
$ ls /tmp/crontz-vn
ls: cannot access '/tmp/crontz-vn': No such file or directory
$ grep CRON_TZ /tmp/cron-env.txt
CRON_TZ=Asia/Ho_Chi_Minh</div>
<p>The last line is the proof: <code>CRON_TZ</code> just becomes a variable in the job's environment. The schedule is still computed in UTC — the job will run at 22:28 UTC (05:28 the next morning in Vietnam).</p>

<h3>Which one should you use?</h3>
${slide('lx-11', 14, 'cron hay timer: bảng so sánh')}
<div class="kv-grid">
  <div class="kv"><span class="k">Use cron when…</span><span class="v">The job is trivial, the machine may not be systemd (containers, Alpine, BSD), or you are editing someone else's server and one line is the whole change. Also: cron is the only one of the two that a non-root user can set up with zero permissions beyond their own account.</span></div>
  <div class="kv"><span class="k">Use a timer when…</span><span class="v">You want logs in the journal, an exit code you can query, a dependency on another unit (<code>After=postgresql.service</code>), a resource limit, catch-up after downtime, or the same sandboxing you gave the service in Lesson 11.1.</span></div>
  <div class="kv"><span class="k">Debuggability</span><span class="v">Not close. <code>systemctl start backup.service</code> runs the job right now, exactly as the schedule would, and <code>journalctl -u backup.service -n 50</code> shows what happened. cron's equivalent is waiting until 03:30 and hoping you redirected the output.</span></div>
  <div class="kv"><span class="k">Verbosity</span><span class="v">cron wins: one line versus two files and a <code>daemon-reload</code>. That is a real cost for a five-second chore, and a rounding error for anything that matters.</span></div>
  <div class="kv"><span class="k">Overlap</span><span class="v">A timer will not start a <code>oneshot</code> service that is still running from the last time — it queues or skips. cron will happily start a second, third and fourth copy. See <code>flock</code> below.</span></div>
</div>

<h3>"My job didn't run" — the ladder</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Is the scheduler even running?</span><span class="lz-t">systemctl status cron · systemctl status systemd-timers is not a thing — use list-timers</span><span class="lz-d">Rare, but free to rule out. <code>systemctl list-timers --all</code> shows timers that exist but are inactive.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Did it TRY?</span><span class="lz-t">journalctl -t CRON --since today · journalctl -u backup.service --since today</span><span class="lz-d">cron logs a line every time it starts a job, even when the job then fails. No line means the schedule or the file is wrong; a line means the schedule was right and the job is what broke. This single check splits the problem in half.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Is the file readable and correctly named?</span><span class="lz-t">run-parts --test /etc/cron.daily · ls -l /etc/cron.d/</span><span class="lz-d">Dots in the name, missing execute bit, wrong owner, or a missing final newline in the crontab file — all silent.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Run it the way the scheduler would</span><span class="lz-t">systemctl start backup.service · env -i … /bin/sh -c '…'</span><span class="lz-d">Do not run it from your own shell — your environment hides the bug. This is where <code>command not found</code> and <code>permission denied</code> finally appear.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Check the clock and the timezone</span><span class="lz-t">timedatectl</span><span class="lz-d">"It runs three hours late" is almost always UTC versus local. Timers can use <code>OnCalendar</code> with an explicit timezone on modern systemd; cron follows the system timezone and needs a restart after you change it.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Look for the second copy</span><span class="lz-t">pgrep -af backup.sh</span><span class="lz-d">A job that overlaps itself can look like "it didn't run" when in fact it never finished. Lock it (below).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Did cron try? This is the first command, every time.</span>
journalctl -t CRON --since today | tail -20</code></pre>
<div class="out">Aug 22 03:30:01 vps-1 CRON[40112]: (deploy) CMD (/usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1)
Aug 22 03:39:14 vps-1 CRON[40112]: (deploy) MAIL (mailed 1 byte of output; but got status 0x004b)
Aug 22 04:17:01 vps-1 CRON[40255]: (root) CMD (cd / &amp;&amp; run-parts --report /etc/cron.hourly)</div>

<h3>Never let two copies run</h3>
${slide('lx-11', 15, 'flock: bản thứ hai tự lui')}
<p>A backup that normally takes four minutes will one day take seventy, and cron will start the next one on schedule regardless. Now two <code>pg_dump</code>s are competing for the same disk, each making the other slower, and the queue grows until the machine falls over. The fix is one word (Lesson 7.3):</p>
<pre><code><span class="tok-comment"># Skip this run entirely if the last one is still going</span>
30 3 * * * /usr/bin/flock -n /var/lock/backup.lock /usr/local/bin/backup.sh

<span class="tok-comment"># Or wait up to 60s for the lock, then give up</span>
30 3 * * * /usr/bin/flock -w 60 /var/lock/backup.lock /usr/local/bin/backup.sh</code></pre>
<div class="out">$ flock -n /var/lock/backup.lock sleep 300 &amp;
[1] 41902
$ flock -n /var/lock/backup.lock echo "second copy"
$ echo \$?
1</div>
<p>Nothing printed and an exit code of 1: the second copy correctly refused to start. <code>flock</code> holds the lock for as long as the command runs and releases it when the process exits <em>however</em> it exits — including a crash or a <code>kill -9</code>, because the kernel drops the lock with the file descriptor. That is why it beats a hand-rolled <code>if [ -f /tmp/lock ]</code>, which leaves a stale lockfile behind and blocks every future run.</p>
<p>Timers get part of this for free — systemd will not start a second instance of a <code>oneshot</code> service that is still running — but add the <code>flock</code> anyway if the same script can also be launched by hand.</p>
<table>
<tr><th>flock flag</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>-n</code></td><td>Do not wait: if the lock is busy, exit at once (code 1 by default)</td><td><code>flock -n /var/lock/x.lock cmd</code></td></tr>
<tr><td><code>-w 60</code></td><td>Wait up to 60 seconds, then give up</td><td><code>flock -w 60 /var/lock/x.lock cmd</code></td></tr>
<tr><td><code>-E 75</code></td><td>Exit code when the lock cannot be taken — to tell it apart from <code>cmd</code>'s own errors</td><td><code>flock -w 2 -E 75 … ; echo $?</code> → <code>75</code></td></tr>
<tr><td><code>-x</code> / <code>-s</code></td><td>Exclusive lock (default) / shared lock (many readers at once)</td><td><code>flock -s /var/lock/x.lock cat …</code></td></tr>
<tr><td><code>-u</code></td><td>Release early (with the <code>flock 9</code> form inside a script)</td><td><code>flock -u 9</code></td></tr>
</table>
<div class="out">$ flock -w 2 -E 75 /tmp/backup.lock echo hi; echo "exit=$?"
exit=75</div>
<p><strong>One measured detail:</strong> the lock is tied to a <em>file descriptor</em>, and child processes inherit file descriptors. Run <code>flock -n /tmp/backup.lock sleep 30 &amp;</code> then <code>kill %1</code> — what gets killed is <code>flock</code>, while <code>sleep</code> (its child) lives on and still holds the lock: the next <code>flock -n</code> keeps failing until <code>sleep</code> dies. A systemd service does not have this problem because <code>systemctl stop</code> kills the whole cgroup; with cron an orphaned child can hold the lock and block every later run — check with <code>fuser -v /var/lock/backup.lock</code> or <code>lsof /var/lock/backup.lock</code>.</p>

<h3>A complete example</h3>
<pre><code class="language-bash"><span class="tok-comment"># /usr/local/bin/backup.sh — quiet on success, loud on failure</span>
#!/usr/bin/env bash
set -Eeuo pipefail
export PATH=/usr/local/bin:/usr/bin:/bin

DEST=/srv/backups
KEEP_DAYS=14
STAMP=\$(date +%Y%m%d-%H%M%S)
FILE="\$DEST/app-\$STAMP.dump"

mkdir -p "\$DEST"
trap 'rm -f "\$FILE.part"' ERR INT TERM        <span class="tok-comment"># Lesson 7.3 — no half-written backups</span>

<span class="tok-comment"># Fail early if there is nowhere to put it (Lesson 10.1)</span>
avail=\$(df --output=avail -BM "\$DEST" | tail -1 | tr -dc '0-9')
[ "\$avail" -lt 2048 ] &amp;&amp; { echo "backup: only \${avail}MB free, refusing" &gt;&amp;2; exit 1; }

pg_dump --format=custom --compress=9 "\$DATABASE_URL" &gt; "\$FILE.part"
mv "\$FILE.part" "\$FILE"                        <span class="tok-comment"># atomic: the .dump only ever exists complete</span>

find "\$DEST" -name 'app-*.dump' -mtime +"\$KEEP_DAYS" -print -delete
echo "backup: \$(du -h "\$FILE" | cut -f1) -&gt; \$FILE"</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Test it before you schedule it — as the user that will run it</span>
sudo -u deploy /usr/local/bin/backup.sh
sudo systemctl start backup.service          <span class="tok-comment"># then, the way it will really run</span>
journalctl -u backup.service -n 20 --no-pager</code></pre>
<div class="out">Aug 22 18:02:41 vps-1 systemd[1]: Starting backup.service - Nightly database backup...
Aug 22 18:02:49 vps-1 backup.sh[42871]: backup: 84M -&gt; /srv/backups/app-20260822-180241.dump
Aug 22 18:02:49 vps-1 systemd[1]: backup.service: Deactivated successfully.
Aug 22 18:02:49 vps-1 systemd[1]: Finished backup.service - Nightly database backup.</div>
<div class="callout ok"><strong>A scheduled job you have never watched run is not a scheduled job, it is a hope.</strong> Run it by hand as the right user, then run it through the scheduler with <code>systemctl start</code>, then read the journal. Three commands, and they catch the environment bug, the permission bug and the "it wrote to the wrong directory" bug before 03:30 ever arrives. And for a backup specifically: restore it somewhere once. An unrestored backup is an untested backup.</div>


<h3>Try it step by step: cron and a timer in a container with systemd</h3>
<p>Reuse the <code>lab-sd</code> container from Lesson 11.1 (it has <code>cron</code> installed). Every output below is real, recorded on 28/09/2026:</p>
<pre><code class="language-bash">useradd -m -s /bin/bash deploy
echo '* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1' | crontab -u deploy -
printf '* * * * * root touch /tmp/co-cham\\n'   &gt; /etc/cron.d/app.cleanup
printf '* * * * * root touch /tmp/khong-cham\\n' &gt; /etc/cron.d/app-cleanup
sleep 70
cat /tmp/cron-env.txt; ls /tmp/co-cham /tmp/khong-cham
journalctl -t CRON --since '-2min' | grep CMD</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
LANG=C.UTF-8
SHELL=/bin/sh
PWD=/home/deploy
ls: cannot access '/tmp/co-cham': No such file or directory
/tmp/khong-cham
Sep 28 15:26:01 vps-1 CRON[821]: (root) CMD (touch /tmp/khong-cham)
Sep 28 15:26:01 vps-1 CRON[822]: (deploy) CMD (env &gt; /tmp/cron-env.txt 2&gt;&amp;1)</div>
<p>Then do the same job with a timer: write <code>/usr/local/bin/backup.sh</code> (tars <code>/srv/app</code> into <code>/srv/backups</code>), <code>backup.service</code> (<code>Type=oneshot</code>, <code>User=deploy</code>) and <code>backup.timer</code> (<code>OnCalendar=*-*-* 03:30:00</code>, <code>Persistent=true</code>, <code>RandomizedDelaySec=300</code>) exactly as in the sample above, then:</p>
<pre><code class="language-bash">systemctl daemon-reload
systemctl enable --now backup.timer
systemctl list-timers backup.timer
systemctl start backup.service
journalctl -u backup.service -n 6 --no-pager</code></pre>
<div class="out">Created symlink /etc/systemd/system/timers.target.wants/backup.timer → /etc/systemd/system/backup.timer.
NEXT                        LEFT LAST PASSED UNIT         ACTIVATES
Tue 2026-09-29 03:32:04 UTC  12h -         - backup.timer backup.service

1 timers listed.
Sep 28 15:25:48 vps-1 systemd[1]: Starting backup.service - Nightly backup...
Sep 28 15:25:48 vps-1 backup.sh[775]: backup: 4.0K -&gt; /srv/backups/app-20260928-152548.tar.gz
Sep 28 15:25:48 vps-1 systemd[1]: backup.service: Deactivated successfully.
Sep 28 15:25:48 vps-1 systemd[1]: Finished backup.service - Nightly backup.</div>
<p>Notice <code>NEXT</code> is 03:32:04, not 03:30 — that is <code>RandomizedDelaySec=300</code> doing its job.</p>

<h3>How macOS and WSL differ</h3>
<table>
<tr><th>Job</th><th>Ubuntu 24.04</th><th>macOS (measured on macOS 27)</th><th>WSL2</th></tr>
<tr><td>cron</td><td><code>cron</code> 3.0pl1 (Vixie)</td><td>has <code>/usr/bin/crontab</code> and <code>com.vix.cron.plist</code> in <code>/System/Library/LaunchDaemons</code>, but Apple recommends launchd (<code>StartCalendarInterval</code>, Chapters 13–15)</td><td>as Ubuntu — only runs when systemd is on (or you <code>service cron start</code> yourself) and while the WSL VM is alive</td></tr>
<tr><td>Timers</td><td>systemd</td><td>no <code>systemctl</code></td><td>once systemd is enabled</td></tr>
<tr><td><code>flock</code></td><td>yes (util-linux)</td><td><code>flock not found</code> (install with Homebrew if needed)</td><td>yes</td></tr>
<tr><td>Tomorrow</td><td><code>date -d tomorrow +%F</code></td><td><code>date -v+1d +%F</code> → <code>2026-09-29</code>; <code>date -d</code> → <code>illegal option -- d</code></td><td>as Ubuntu</td></tr>
<tr><td>Time zone</td><td><code>timedatectl</code></td><td>no <code>timedatectl</code>; <code>readlink /etc/localtime</code> → <code>…/zoneinfo/Asia/Ho_Chi_Minh</code></td><td>as Ubuntu (<code>timedatectl</code> once systemd is on)</td></tr>
</table>
<p>The practical consequence: a backup script using <code>date -d</code> or <code>flock</code> runs fine on the VPS but breaks when you try it on a Mac — test in an Ubuntu container, not on the Mac, before it goes to the server.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> a teammate reports "the backup runs at 9am and slows the site down, and yesterday it did not run at all". In the <code>lab-sd</code> container:</p><ol>
<li>Install a crontab line for <code>deploy</code> that writes <code>env</code> to <code>/tmp/cron-env.txt</code>; after a minute, name two variables where cron differs from your login shell (does <code>PATH</code> contain <code>~/.local/bin</code>?).</li>
<li>Create <code>/etc/cron.d/backup.job</code> running <code>touch /tmp/bk</code> every minute; after two minutes prove with <code>journalctl -t CRON</code> that it did NOT run; rename it to <code>backup-job</code> and prove it runs.</li>
<li>Turn it into a <code>bk.service</code> + <code>bk.timer</code> pair with <code>OnCalendar=*-*-* 02:00 Asia/Ho_Chi_Minh</code>; use <code>systemd-analyze calendar</code> to read the matching UTC time, then <code>systemctl list-timers bk.timer</code>.</li>
<li>Prove it cannot overlap: <code>flock -n /tmp/bk.lock sleep 20 &amp;</code> then <code>flock -n /tmp/bk.lock echo lan-2; echo $?</code>.</li></ol>
<p><strong>Done when:</strong> step 2 shows exactly one kind of <code>CMD</code> line (from <code>backup-job</code>); step 3 prints <code>Next elapse: … 19:00:00 UTC</code>; step 4 does not print <code>lan-2</code> and the exit code is <code>1</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">cron / crontab</span><span class="v">The service that runs commands on a schedule; a crontab is a user's schedule file, edited with <code>crontab -e</code>.</span></div>
  <div class="kv"><span class="k">Field</span><span class="v">The five time columns — minute · hour · day · month · weekday — before the command.</span></div>
  <div class="kv"><span class="k">run-parts</span><span class="v">The program that runs every valid script in <code>/etc/cron.daily/</code>… — skipping names with a dot.</span></div>
  <div class="kv"><span class="k">Timer</span><span class="v">A <code>.timer</code> unit that starts the same-named <code>.service</code> on an <code>OnCalendar=</code> schedule or a monotonic clock.</span></div>
  <div class="kv"><span class="k">Persistent</span><span class="v">The timer remembers its last run on disk; if the slot was missed because the machine was off, it runs as soon as it boots.</span></div>
  <div class="kv"><span class="k">Time zone / UTC</span><span class="v">cron reads the MACHINE's time; a VPS is usually on UTC, seven hours behind Vietnam.</span></div>
  <div class="kv"><span class="k">Lock</span><span class="v"><code>flock</code> holds a lock on a file for as long as the command runs so a second copy cannot start.</span></div>
  <div class="kv"><span class="k">Environment</span><span class="v">The set of variables like <code>PATH</code> and <code>HOME</code> the job receives — cron's is much thinner than your shell's.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A cron line is five time fields in the MACHINE's time, then a command run by <code>/bin/sh</code>; crontab only catches coarse errors, minute 61 still installs.</li>
<li>cron does not read <code>~/.bashrc</code>: its PATH (long on Ubuntu, short on Fedora) has no nvm or <code>~/.local/bin</code> — a wrapper script that sets its own environment is the durable fix.</li>
<li>File names with a dot in <code>/etc/cron.d/</code> and <code>/etc/cron.daily/</code> are skipped without a single log line; check with <code>run-parts --test</code> and <code>journalctl -t CRON</code>.</li>
<li>UTC machine + +07 person = a schedule seven hours off; Ubuntu ignores <code>CRON_TZ</code>, while a timer can carry the zone inside <code>OnCalendar</code>.</li>
<li>A timer is a <code>.timer</code> + <code>.service</code> pair: enable the timer, test with <code>systemctl start x.service</code>, ask about the schedule with <code>systemd-analyze calendar</code>.</li>
<li><code>flock -n</code> prevents overlap; the lock is released only when EVERY process holding the file descriptor has exited.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/flock.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">flock(1) — file locks from the shell</span><span class="lc-sub">All the flags — <code>-n</code>, <code>-w</code>, <code>-E</code>, <code>-s</code> — and the <code>flock 9</code> form used inside scripts, with an anti-overlap example.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">systemd.timer — official manual</span><span class="lc-sub">Every directive, including <code>Persistent=</code>, <code>RandomizedDelaySec=</code> and the monotonic <code>OnBootSec=</code> family. Short and worth reading end to end.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗓️</span>
  <span class="lc-body"><span class="lc-title">systemd.time — the calendar syntax</span><span class="lc-sub">The grammar behind <code>OnCalendar=</code>, with a table of shorthands. Pair it with <code>systemd-analyze calendar</code> and you never have to guess.</span></span>
</a>
<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/en/man5/crontab.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">crontab(5) — Ubuntu manual</span><span class="lc-sub">The authority on the five fields, the <code>@</code> shortcuts, and the day-of-month/day-of-week OR rule that surprises everyone once.</span></span>
</a>
<a class="link-card" href="https://crontab.guru/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">crontab.guru</span><span class="lc-sub">Paste an expression, read it back in English, see the next runs. The cron equivalent of <code>systemd-analyze calendar</code>, and the fastest way to check a line before you install it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: schedule a job that actually runs</span><span class="lc-sub">Graded exercises: read six crontab lines back in English, fix a job broken by cron's PATH, convert it to a timer with <code>Persistent=</code>, and stop a slow job from overlapping itself.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> <code>crontab -r</code> deletes your entire crontab, immediately, with no confirmation — and it sits one key away from <code>crontab -e</code> on the keyboard. There is no undo and no backup file. Two habits make it survivable: keep the real schedule in <code>/etc/cron.d/</code> or in timer units under version control, and if you must use a personal crontab, run <code>crontab -l &gt; ~/crontab.bak</code> before every edit. On some systems <code>crontab -i -r</code> asks first; do not rely on it being configured.</div>
<p class="note-ct"><strong>Three things to remember.</strong> The schedule is almost never the bug — the environment is, so test every job with <code>env -i</code> or <code>systemctl start</code> before you trust the clock. Redirect the output somewhere you will actually look, because <code>&gt;/dev/null 2&gt;&amp;1</code> turns a failing job into a silent one. And for anything that must not be skipped after downtime or must not overlap itself, use a timer with <code>Persistent=true</code> and wrap the command in <code>flock</code> — those two lines are the difference between a schedule and a promise.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Hẹn giờ: cron và timer của systemd</h2>
<p class="lead">Mọi máy chủ Ubuntu đều có sẵn HAI bộ hẹn giờ. <strong>cron</strong> già hơn phần lớn người đang đọc dòng này, có mặt trên mọi bản Unix từng tồn tại, và được cấu hình bằng đúng một dòng khó hiểu. <strong>Timer của systemd</strong> mới hơn, dài dòng hơn, và cho bạn journal, quan hệ phụ thuộc, cùng một cái máy tính nói chính xác lần chạy kế tiếp rơi vào lúc nào. Bạn cần cả hai — cron vì bạn sẽ gặp nó trên máy của người khác, timer vì đó là thứ bạn nên viết trên máy của mình.</p>
<p>Cả hai hỏng theo cùng một kiểu, và gần như không bao giờ là do cái lịch. Là do MÔI TRƯỜNG.</p>

<h3>Năm cái trường</h3>
${slide('lx-11', 9, 'Một dòng cron: 5 trường + câu lệnh')}
<p>Một dòng crontab gồm năm trường thời gian, rồi tất cả phần còn lại là câu lệnh.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · phút</span><span class="lz-t">0–59</span><span class="lz-d">Trường duy nhất không có lối thoát kiểu "mỗi ngày" — để <code>*</code> ở đây là chạy sáu mươi lần một giờ. Đây là cái trường người ta viết sai lúc 3 giờ sáng.</span></div>
  <div class="lz-step"><span class="lz-k">2 · giờ</span><span class="lz-t">0–23</span><span class="lz-d">Đồng hồ 24 giờ, và theo MÚI GIỜ CỦA MÁY — trên VPS thường là UTC chứ không phải giờ của bạn. <code>timedatectl</code> cho biết là múi nào.</span></div>
  <div class="lz-step"><span class="lz-k">3 · ngày trong tháng</span><span class="lz-t">1–31</span><span class="lz-d">KHÔNG có "ngày cuối tháng". Người ta giả lập nó bằng <code>28-31</code> cộng một phép kiểm bên trong script.</span></div>
  <div class="lz-step"><span class="lz-k">4 · tháng</span><span class="lz-t">1–12 hoặc jan–dec</span><span class="lz-d">Hiếm khi là gì khác ngoài <code>*</code>. Tên tháng không phân biệt hoa thường và không dùng chung được với cú pháp bước nhảy.</span></div>
  <div class="lz-step"><span class="lz-k">5 · thứ trong tuần</span><span class="lz-t">0–7 (0 và 7 đều là Chủ nhật) hoặc sun–sat</span><span class="lz-d">Cái bẫy: nếu CẢ ngày-trong-tháng lẫn thứ-trong-tuần đều bị giới hạn, cron chạy khi MỘT TRONG HAI khớp, không phải cả hai.</span></div>
  <div class="lz-step"><span class="lz-k">6 · câu lệnh</span><span class="lz-t">phần còn lại của dòng, do /bin/sh chạy</span><span class="lz-d">KHÔNG phải bash. <code>sh</code> trên Ubuntu là dash, nên những thứ riêng của bash như <code>[[ ]]</code> và mảng là lỗi cú pháp ở đây (Bài 6.2).</span></div>
</div>
<pre><code><span class="tok-comment"># phút giờ ngày-tháng tháng thứ  câu-lệnh</span>
30 3 * * *      /usr/local/bin/backup.sh          <span class="tok-comment"># 03:30 mỗi ngày</span>
*/5 * * * *     /usr/local/bin/health-check.sh    <span class="tok-comment"># mỗi 5 phút</span>
0 */6 * * *     /usr/local/bin/sync.sh            <span class="tok-comment"># lúc 00:00, 06:00, 12:00, 18:00</span>
0 9 * * 1-5     /usr/local/bin/weekday-report.sh  <span class="tok-comment"># 09:00 thứ Hai–thứ Sáu</span>
0 0 1 * *       /usr/local/bin/monthly.sh         <span class="tok-comment"># nửa đêm ngày mùng 1</span>
15 2 * * 0      /usr/local/bin/weekly.sh          <span class="tok-comment"># 02:15 Chủ nhật</span>
0,30 * * * *    /usr/local/bin/twice-hourly.sh    <span class="tok-comment"># liệt kê cũng được</span></code></pre>
<div class="callout"><strong>Hãy đọc to một dòng lên trước khi tin nó.</strong> <code>0 */6 * * *</code> là "phút 0, mỗi 6 giờ" — bốn lần một ngày. <code>*/6 * * * *</code> là "mỗi 6 phút" — 240 lần một ngày. Cách nhau đúng một ký tự, tải nặng gấp bốn mươi lần. Khi phân vân, hãy DỊCH dòng đó sang dạng <code>OnCalendar</code> (bảng ngay dưới) rồi đưa vào <code>systemd-analyze calendar</code> ở phần dưới — dán nguyên dòng cron vào thì nó chỉ báo <code>Failed to parse calendar specification</code>, hoặc gọi <code>crontab -l</code> lấy file bạn đang có và so với một công việc bạn biết chắc là chạy đúng.</div>

<h3>Đào sâu: bảng dịch cron ⇄ OnCalendar, và crontab không bắt hết lỗi</h3>
<table>
<tr><th>cron</th><th>OnCalendar=</th><th>Nghĩa</th></tr>
<tr><td><code>30 3 * * *</code></td><td><code>*-*-* 03:30</code></td><td>03:30 mỗi ngày</td></tr>
<tr><td><code>*/15 * * * *</code></td><td><code>*:0/15</code></td><td>mỗi 15 phút (:00 :15 :30 :45)</td></tr>
<tr><td><code>0 */6 * * *</code></td><td><code>*-*-* 0/6:00</code></td><td>00:00, 06:00, 12:00, 18:00</td></tr>
<tr><td><code>0 9 * * 1-5</code></td><td><code>Mon..Fri 09:00</code></td><td>ngày làm việc 09:00</td></tr>
<tr><td><code>0 0 * * 1</code> · <code>@weekly</code> (cron: Chủ nhật!)</td><td><code>weekly</code> (= thứ Hai 00:00)</td><td>hai "hằng tuần" khác ngày nhau</td></tr>
<tr><td>(không viết được)</td><td><code>Sat *-*-1..7 02:00</code></td><td>thứ Bảy ĐẦU tiên của tháng</td></tr>
<tr><td>(không viết được)</td><td><code>*-*~01 23:00</code></td><td>23:00 ngày CUỐI tháng (<code>~</code> = đếm từ cuối)</td></tr>
</table>
<div class="out">$ systemd-analyze calendar '0 */6 * * *'
Failed to parse calendar specification '0 */6 * * *': Invalid argument
$ systemd-analyze calendar '*-*~01 23:00' --iterations=3
  Original form: *-*~01 23:00
Normalized form: *-*~01 23:00:00
    Next elapse: Wed 2026-09-30 23:00:00 UTC
       From now: 2 days left
   Iteration #2: Sat 2026-10-31 23:00:00 UTC
       From now: 1 month 2 days left
   Iteration #3: Mon 2026-11-30 23:00:00 UTC
       From now: 2 months 2 days left</div>
<p>Lưu ý dòng <code>@weekly</code>: với cron nó là <code>0 0 * * 0</code> (nửa đêm Chủ nhật), còn <code>weekly</code> của systemd là thứ Hai 00:00 — cùng chữ, lệch một ngày.</p>
<p><strong>crontab kiểm cú pháp, nhưng chỉ kiểm lỗi THÔ.</strong> Đo trên Ubuntu 24.04 (cron 3.0pl1-184ubuntu2): một dòng rác bị từ chối, nhưng phút 61, giờ 25, hay một dòng thiếu hẳn một trường đều được cài vào im lặng:</p>
<div class="out">$ echo 'abc' &gt; c.txt; crontab c.txt
"c.txt":1: bad command
errors in crontab file, can't install.
$ echo '61 3 * * * /bin/true' &gt; c.txt; crontab c.txt; echo "rc=$?"
rc=0
$ echo '* * * * /bin/true' &gt; c.txt; crontab c.txt; echo "rc=$?"
rc=0</div>
<p>Dòng thứ ba là cái nguy hiểm nhất: bốn dấu sao, và <code>/bin/true</code> bị hiểu thành trường thứ năm. crontab không nói gì, và công việc đó sẽ không bao giờ chạy như bạn nghĩ. Vì thế "crontab nhận rồi" không có nghĩa là "dòng đúng" — hãy đọc to nó, dịch sang <code>OnCalendar</code> để hỏi máy, hoặc dán vào crontab.guru.</p>

<h3>Sửa một crontab</h3>
<pre><code>crontab -e            <span class="tok-comment"># sửa crontab CỦA BẠN (mở \$EDITOR, mặc định là nano)</span>
crontab -l            <span class="tok-comment"># liệt kê nó ra</span>
crontab -l &gt; ~/cron.bak   <span class="tok-comment"># sao lưu TRƯỚC khi đụng vào</span>
sudo crontab -e -u deploy <span class="tok-comment"># sửa crontab của người dùng khác</span>
crontab -r            <span class="tok-comment"># XOÁ nó. Không hỏi lại. Xem phần bẫy.</span></code></pre>
<div class="out">$ crontab -l
# m h  dom mon dow   command
MAILTO=""
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

30 3 * * * /usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1
*/10 * * * * /usr/local/bin/health-check.sh &gt;/dev/null 2&gt;&amp;1</div>
<p><code>crontab -e</code> không chỉ là "mở một file trong trình soạn thảo". Nó ghi vào một thư mục spool mà bạn không nên sửa tay, và nó <strong>KIỂM CÚ PHÁP lúc lưu</strong> — nếu bạn thấy <code>errors in crontab file, can't install</code> thì crontab cũ vẫn đang chạy và cái mới đã bị từ chối. Chính phép kiểm đó là lý do phải dùng <code>crontab -e</code> thay vì sửa thẳng file spool.</p>

<h3>Crontab nằm ở đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">/var/spool/cron/crontabs/&lt;người dùng&gt;</span><span class="lz-lnote">Crontab riêng của từng người, do <code>crontab -e</code> ghi. Năm trường thời gian rồi tới câu lệnh. Công việc chạy dưới danh nghĩa người đó. Đừng sửa thẳng những file này — không có phép kiểm cú pháp, và cron có thể không nhận ra thay đổi.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/crontab</span><span class="lz-lnote">Crontab của hệ thống. <strong>SÁU</strong> trường: vẫn năm trường đó cộng thêm <strong>TÊN NGƯỜI DÙNG</strong> đứng trước câu lệnh. Sửa tay thì được, nhưng nên ưu tiên một file trong <code>/etc/cron.d/</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/cron.d/&lt;tên&gt;</span><span class="lz-lnote">Mỗi gói hoặc mỗi công việc một file, cùng định dạng sáu trường. Đây là chỗ đúng cho bất cứ thứ gì bạn triển khai, vì một công cụ quản lý cấu hình hay một gói phần mềm có thể sở hữu trọn cái file. Tên file KHÔNG được chứa dấu chấm.</span></div>
  <div class="lz-layer"><span class="lz-lname">/etc/cron.{hourly,daily,weekly,monthly}/</span><span class="lz-lnote">Thả một script chạy được vào, khỏi cần dòng lịch nào cả. Do <code>run-parts</code> chạy. Script phải có bit thực thi và — vẫn luật trên — <strong>KHÔNG được có đuôi <code>.sh</code></strong>, không thì run-parts lặng lẽ bỏ qua.</span></div>
  <div class="lz-layer"><span class="lz-lname">Timer của systemd</span><span class="lz-lnote">Một cơ chế hoàn toàn khác, nói ở dưới. Trên Ubuntu hiện đại, cập nhật <code>apt</code>, <code>logrotate</code>, <code>fstrim</code> và <code>man-db</code> đều đã dọn sang đây — vì thế <code>/etc/cron.daily</code> trông trống hơn bạn tưởng.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Định dạng sáu trường của hệ thống — để ý cột người dùng</span>
cat /etc/cron.d/app-cleanup</code></pre>
<div class="out">SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=root

# m h dom mon dow  user     command
17 4 * * *         deploy   /srv/app/bin/cleanup.sh</div>
<div class="pitfall"><strong>Bẫy:</strong> một file trong <code>/etc/cron.d/</code> hay <code>/etc/cron.daily/</code> mà tên có <strong>DẤU CHẤM</strong> thì bị bỏ qua. <code>app.sh</code>, <code>backup.cron</code>, <code>cleanup.bak</code> — tất cả đều bị bỏ im lặng, không báo lỗi ở đâu hết. Đó là luật của <code>run-parts</code> (nó cũng bỏ qua tên chứa ký tự ngoài <code>[A-Za-z0-9_-]</code>), và đây là lý do phổ biến nhất khiến một công việc "chắc chắn đã cài rồi" không bao giờ chạy. Hãy đặt tên file là <code>app-cleanup</code>, không đuôi. Kiểm bằng <code>run-parts --test /etc/cron.daily</code> — nó in ra ĐÚNG những script sẽ chạy.</div>
<p>Đo thật trên Ubuntu 24.04: bốn script trong <code>/etc/cron.daily/</code> (hai cái tên có dấu chấm, một cái thiếu bit thực thi) và hai file trong <code>/etc/cron.d/</code> chỉ khác nhau đúng một ký tự:</p>
<div class="out">$ ls /etc/cron.daily
apt-compat  backup-db  backup.sh  dpkg  noexec-job  rotate.bak
$ run-parts --test /etc/cron.daily
/etc/cron.daily/apt-compat
/etc/cron.daily/backup-db
/etc/cron.daily/dpkg
$ cat /etc/cron.d/app.cleanup /etc/cron.d/app-cleanup
* * * * * root touch /tmp/co-cham
* * * * * root touch /tmp/khong-cham
$ journalctl -t CRON | grep cham       <span class="tok-comment"># sau hai phút</span>
Sep 28 15:26:01 vps-1 CRON[821]: (root) CMD (touch /tmp/khong-cham)
Sep 28 15:27:01 vps-1 CRON[864]: (root) CMD (touch /tmp/khong-cham)</div>
<p><code>app.cleanup</code> không có lấy một dòng trong log — cron không coi nó là một file, nên cũng chẳng có lỗi nào để báo.</p>

<h3>Cái bẫy môi trường</h3>
${slide('lx-11', 11, 'Môi trường của cron và tên file có dấu chấm')}
<p>Đây mới là bài học. Chín trên mười công việc cron hỏng là hỏng ở đây, và triệu chứng luôn là đúng một câu: <em>"chạy tay thì được mà"</em>.</p>
<p>Khi cron chạy câu lệnh của bạn, nó <strong>KHÔNG</strong> đọc <code>~/.bashrc</code>, <code>~/.profile</code> hay <code>/etc/profile</code> (Bài 8.2). Nó đưa cho bạn một môi trường rất mỏng: <code>HOME</code>, <code>LOGNAME</code>, <code>SHELL=/bin/sh</code>, một <code>PATH</code> mặc định, và gần như không gì khác. Không <code>nvm</code>, không <code>pyenv</code>, không <code>rbenv</code>, không <code>~/.local/bin</code>, không một biến export nào của bạn. <strong>Cái PATH mặc định đó khác nhau theo bản cron</strong> (đã sửa lại theo đo thật 28/09/2026 — bản trước của bài ghi <code>PATH=/usr/bin:/bin</code> và "không có <code>LANG</code>", điều đó SAI trên Ubuntu): cron của Ubuntu/Debian nạp <code>/etc/environment</code> và <code>/etc/default/locale</code> qua PAM (<code>pam_env</code> trong <code>/etc/pam.d/cron</code>), nên PATH dài như của hệ thống và có <code>LANG=C.UTF-8</code>; cronie của Fedora/RHEL thì mặc định <code>/usr/bin:/bin:/usr/sbin:/sbin</code> (theo mã nguồn cronie). Không bản nào có những thư mục mà <code>~/.bashrc</code>/<code>~/.profile</code> thêm vào — và đó mới là chỗ node của nvm nằm.</p>
<pre><code class="language-bash"><span class="tok-comment"># Chứng minh: đổ ra môi trường THẬT của cron trong một phút</span>
crontab -l | { cat; echo '* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1'; } | crontab -
<span class="tok-comment"># chờ một phút, rồi</span>
cat /tmp/cron-env.txt</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
LANG=C.UTF-8
SHELL=/bin/sh
PWD=/home/deploy</div>
<p class="note-ct">Output thật: cron của Ubuntu 24.04 (3.0pl1-184ubuntu2), người dùng <code>deploy</code>, đo 28/09/2026. Dòng <code>PATH</code> là nội dung của <code>/etc/environment</code>.</p>
<p>Giờ đem so với shell tương tác của bạn — <code>echo "\$PATH"</code> trong một cửa sổ terminal trên cùng cái máy đó có thêm những thư mục mà <code>~/.profile</code> và <code>~/.bashrc</code> cộng vào (<code>~/.local/bin</code>, <code>~/.nvm/versions/node/…/bin</code>, <code>~/.cargo/bin</code>…); trên Fedora/RHEL nó còn dài gấp mấy lần PATH của cron. Mọi công cụ nằm trong một trong các thư mục còn thiếu kia đều là một cái <code>command not found</code> chờ sẵn, và cron ghi lỗi ấy vào một hòm thư bạn không đọc.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Triệu chứng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">node: command not found</span><span class="lz-nsub">…hoặc <code>python: not found</code>, hoặc công việc thoát mã 127. Chạy trong terminal của bạn thì ngon lành.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nguyên nhân</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chương trình nằm trên PATH CỦA BẠN, không phải của cron</span><span class="lz-nsub">nvm đặt node ở <code>~/.nvm/versions/node/&lt;phiên bản&gt;/bin</code> rồi thêm vào trong <code>~/.bashrc</code> — cái file mà cron không bao giờ đọc.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cách sửa A</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đường dẫn tuyệt đối ở mọi chỗ</span><span class="lz-nsub"><code>/home/deploy/.nvm/versions/node/v22.11.0/bin/node</code>. Tìm một lần bằng <code>command -v node</code>. Thô, nhưng luôn đúng.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cách sửa B</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Đặt PATH ở đầu crontab</span><span class="lz-nsub">Một dòng <code>PATH=…</code> đứng trước các công việc thì áp cho tất cả. Gọn nhất khi nhiều công việc cùng cần một bộ công cụ.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cách sửa C — tốt nhất</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Để một script bao ngoài tự lo môi trường</span><span class="lz-nsub">cron gọi <code>/usr/local/bin/nightly</code>; script tự đặt PATH, tự <code>cd</code> tới chỗ nó cần, tự nạp thứ nó cần. cron vẫn chỉ một dòng.</span></div></div>
  </div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Cách C, đầy đủ — hình hài mà mọi công việc hẹn giờ nên có</span>
<span class="tok-comment"># /usr/local/bin/nightly</span>
#!/usr/bin/env bash
set -Eeuo pipefail                                   <span class="tok-comment"># Bài 7.1</span>
export PATH=/usr/local/bin:/usr/bin:/bin
export HOME=/home/deploy
cd /srv/app || exit 1                                <span class="tok-comment"># cron thả bạn ở \$HOME, không phải ở đây</span>
[ -f /srv/app/.env ] &amp;&amp; set -a &amp;&amp; . /srv/app/.env &amp;&amp; set +a
exec /usr/bin/node scripts/nightly.js</code></pre>
<div class="callout ok"><strong>Hãy thử nó theo đúng cách cron sẽ chạy nó.</strong> Đúng một dòng này cho bạn một shell có môi trường giống cron, và nó biến bí ẩn "sao chỉ 3 giờ sáng mới hỏng" thành một lỗi bình thường đọc được:
<pre><code>env -i HOME="\$HOME" LOGNAME="\$LOGNAME" PATH=/usr/bin:/bin SHELL=/bin/sh /bin/sh -c '/usr/local/bin/nightly'</code></pre>
<code>env -i</code> xoá sạch môi trường trước, nên không có gì của bạn lọt vào. Qua được ở đây thì qua được trong cron.</div>

<h3>Output đi đâu</h3>
<p>Mặc định cron hứng mọi thứ công việc ghi ra stdout và stderr rồi <strong>GỬI EMAIL cho người dùng</strong>. Trên một VPS bình thường không có phần mềm gửi thư nào được cài, nên lá thư được tạo ra, gửi thất bại, rồi biến mất. Với bạn thì thông báo lỗi của công việc chưa từng tồn tại.</p>
<pre><code><span class="tok-comment"># Ba thứ người ta viết ở cuối một dòng cron</span>
30 3 * * * /usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1   <span class="tok-comment"># giữ lại tất cả ✅</span>
30 3 * * * /usr/local/bin/backup.sh 2&gt;&amp;1 | logger -t backup       <span class="tok-comment"># đẩy vào journal ✅</span>
30 3 * * * /usr/local/bin/backup.sh &gt;/dev/null 2&gt;&amp;1               <span class="tok-comment"># im lặng có chủ ý ⚠️</span></code></pre>
<div class="out">$ logger -t backup "test line"
$ journalctl -t backup -n 1
Aug 22 17:41:09 vps-1 backup[41233]: test line</div>
<p><code>logger</code> là món bị đánh giá thấp: nó đẩy output của cron vào journal, nơi nó thừa hưởng sẵn cơ chế xoay vòng, mốc thời gian, và <code>journalctl -t backup --since today</code> (Bài 10.3). Không phải tự xoay vòng file log nào, không có <code>/var/log</code> phình lên (Bài 10.1).</p>
<div class="callout warn"><strong><code>&gt;/dev/null 2&gt;&amp;1</code> là cách giám sát chết.</strong> Nó là mẩu được chép lại nhiều nhất trong toàn bộ thế giới cron, và nó vứt luôn thông báo lỗi cùng với đám ồn ào. Nếu công việc lắm lời lúc thành công thì hãy sửa CÔNG VIỆC — cho nó im khi thành công và ồn khi thất bại (Bài 7.2), rồi giữ lại output. Một công việc sao lưu có lỗi chảy vào <code>/dev/null</code> là một công việc sao lưu mà bạn sẽ phát hiện ra là hỏng đúng vào ngày bạn cần tới nó.</div>
<p>Hai biến nữa của crontab đáng biết: <code>MAILTO=you@example.com</code> gửi output tới một chỗ có thật nếu bạn thực sự có cấu hình mail, còn <code>MAILTO=""</code> tắt hẳn việc thử gửi thư. Cả hai đều nằm trên một dòng riêng, phía trên các công việc.</p>

<h3>Các lối tắt @</h3>
<pre><code>@reboot     /usr/local/bin/start-tunnel.sh   <span class="tok-comment"># một lần, lúc khởi động máy</span>
@daily      /usr/local/bin/rotate.sh         <span class="tok-comment"># giống 0 0 * * *</span>
@hourly     /usr/local/bin/poll.sh           <span class="tok-comment"># giống 0 * * * *</span>
@weekly @monthly @yearly                     <span class="tok-comment"># và phần còn lại hiển nhiên</span></code></pre>
<div class="pitfall"><strong>Bẫy:</strong> <code>@reboot</code> trông như cách dễ để khởi động ứng dụng lúc máy lên. Không phải. Nó chạy khi <em>cron</em> khởi động, không có thứ tự gì so với mạng, cơ sở dữ liệu, hay việc các hệ thống file được gắn xong — nên một công việc cần bất cứ thứ nào trong đó là đang thắng thua một cuộc đua mà nó không biết mình có tham gia. Nó cũng không có khởi động lại khi sập và không có giám sát: tiến trình chết lúc 4 giờ sáng thì chẳng có gì dựng nó dậy. Khởi chạy một chương trình chạy dài là việc của một <strong>dịch vụ systemd</strong> (Bài 11.1), không phải một dòng cron. <code>@reboot</code> dành cho những việc vặt một-lần như dọn một thư mục tạm.</div>

<h3>Timer của systemd: cặp đôi</h3>
${slide('lx-11', 13, 'Timer = .timer (lúc nào) + .service (làm gì)')}
<p>Một timer là <strong>HAI unit</strong>: một <code>.service</code> nói làm gì, và một <code>.timer</code> cùng tên gốc nói lúc nào. Timer khởi chạy service; service chạy một lượt rồi thoát.</p>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">backup.service</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy cái gì — Type=oneshot</span><span class="lz-nsub">Một unit bình thường với <code>ExecStart=</code>, <code>User=</code>, và mọi chỉ thị hộp cát bạn muốn. Tự nó không bao giờ chạy: nó không có mục <code>[Install]</code> và không có gì enable nó.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">backup.timer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Chạy lúc nào — OnCalendar=</span><span class="lz-nsub">Đây mới là unit bạn <code>enable --now</code>. Nó khớp <code>backup.service</code> theo TÊN; <code>Unit=</code> ghi đè điều đó nếu bạn muốn một cái tên khác.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Mỗi lượt chạy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Journal, mã thoát, thời lượng — có sẵn</span><span class="lz-nsub"><code>journalctl -u backup.service</code> có output của mọi lượt kèm mốc thời gian. <code>systemctl status backup.service</code> cho thấy mã thoát lần cuối. Không phải cấu hình gì cả.</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># /etc/systemd/system/backup.service</span>
[Unit]
Description=Nightly database backup
After=network-online.target postgresql.service

[Service]
Type=oneshot
User=deploy
WorkingDirectory=/srv/app
EnvironmentFile=/srv/app/.env
ExecStart=/usr/local/bin/backup.sh</code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/backup.timer</span>
[Unit]
Description=Run the nightly backup at 03:30

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true                  <span class="tok-comment"># chạy bù lúc khởi động nếu 03:30 máy đang tắt</span>
RandomizedDelaySec=300           <span class="tok-comment"># rải tải ra trong 5 phút</span>
AccuracySec=1s                   <span class="tok-comment"># mặc định là 1min; chỉ siết lại khi thật cần</span>

[Install]
WantedBy=timers.target</code></pre>
<pre><code class="language-bash">sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer   <span class="tok-comment"># cái TIMER, không phải cái service</span>
systemctl list-timers backup.timer</code></pre>
<div class="out">NEXT                        LEFT       LAST                        PASSED  UNIT          ACTIVATES
Sat 2026-08-23 03:30:00 UTC 9h 48min   Fri 2026-08-22 03:31:12 UTC 14h ago backup.timer  backup.service

1 timers listed.</div>
<div class="callout"><strong><code>enable</code> cái TIMER, đừng bao giờ enable cái service.</strong> Enable <code>backup.service</code> khiến nó chạy mỗi lần khởi động máy rồi thôi hẳn — ngược đúng với thứ bạn muốn. Nếu công việc có vẻ chạy một lần sau khi reboot rồi im mãi thì đây là lý do: kiểm <code>systemctl is-enabled backup.service</code>, thấy nó nói <code>enabled</code> thì <code>disable</code> đi và enable cái timer thay vào.</div>

<p>Hai thứ nữa đo được trên máy thật. <code>Persistent=true</code> nhớ lần chạy cuối bằng một file dấu thời gian — xoá nó là timer "quên" lần chạy bù. Và muốn thử một lịch mà chưa cần viết file, <code>systemd-run --on-calendar</code> dựng một cặp timer + service TẠM:</p>
<div class="out">$ ls /var/lib/systemd/timers/ | grep backup
stamp-backup.timer
$ sudo systemd-run --on-calendar='*:0/2' --unit=lx-demo /usr/bin/true
Running timer as unit: lx-demo.timer
Will run service as unit: lx-demo.service
$ systemctl list-timers lx-demo.timer | head -2
NEXT                            LEFT LAST PASSED UNIT          ACTIVATES
Mon 2026-09-28 15:32:00 UTC 1min 30s -         - lx-demo.timer lx-demo.service</div>
<p>Unit tạm biến mất khi bạn <code>systemctl stop lx-demo.timer</code> hoặc khi máy khởi động lại — tiện để thử cú pháp lịch trên máy thật mà không để lại rác.</p>

<h3>OnCalendar, và một cái máy tính xoá sạch việc phải đoán</h3>
${slide('lx-11', 10, 'Dịch cron sang OnCalendar, hỏi systemd-analyze calendar')}
<p>Định dạng là <code>Thứ Năm-Tháng-Ngày Giờ:Phút:Giây</code>, với <code>*</code> là ký tự đại diện, <code>/</code> cho bước nhảy, và <code>,</code> cho danh sách. Phần thật sự hữu ích là systemd sẽ nói cho bạn biết biểu thức của bạn nghĩa là gì TRƯỚC khi bạn đem nó lên máy chủ.</p>
<pre><code>systemd-analyze calendar '*-*-* 03:30:00'
systemd-analyze calendar 'Mon..Fri 09:00' --iterations=3
systemd-analyze calendar 'daily'
systemd-analyze calendar '*:0/15'          <span class="tok-comment"># mỗi 15 phút</span></code></pre>
<div class="out">$ systemd-analyze calendar 'Mon..Fri 09:00' --iterations=3
  Original form: Mon..Fri 09:00
Normalized form: Mon..Fri *-*-* 09:00:00
    Next elapse: Mon 2026-08-24 09:00:00 UTC
       (in UTC): Mon 2026-08-24 09:00:00 UTC
       From now: 1 day 15h left
       Iter. #2: Tue 2026-08-25 09:00:00 UTC
       From now: 2 days 15h left
       Iter. #3: Wed 2026-08-26 09:00:00 UTC
       From now: 3 days 15h left</div>
<div class="kv-grid">
  <div class="kv"><span class="k">hourly · daily · weekly · monthly</span><span class="v">Tên viết tắt. <code>daily</code> là nửa đêm, <code>weekly</code> là thứ Hai 00:00 — hãy kiểm bằng cái máy tính kia thay vì đoán.</span></div>
  <div class="kv"><span class="k">*-*-* 03:30:00</span><span class="v">03:30 mỗi ngày. Dòng bạn sẽ viết nhiều nhất.</span></div>
  <div class="kv"><span class="k">Mon..Fri 09:00</span><span class="v">Ngày trong tuần lúc 09:00. Bỏ trống giây thì mặc định là 0.</span></div>
  <div class="kv"><span class="k">*:0/15</span><span class="v">Mỗi 15 phút — vào phút :00, :15, :30, :45.</span></div>
  <div class="kv"><span class="k">*-*-01 04:00:00</span><span class="v">04:00 ngày mùng 1 hằng tháng.</span></div>
  <div class="kv"><span class="k">Sat *-*-1..7 02:00</span><span class="v">Thứ Bảy đầu tiên của tháng — khoảng ngày và thứ dùng chung, thứ mà cron KHÔNG diễn đạt nổi.</span></div>
  <div class="kv"><span class="k">OnBootSec=5min</span><span class="v">Đồng hồ đơn điệu: 5 phút sau khi máy khởi động. Không phải một mốc giờ treo tường nào cả.</span></div>
  <div class="kv"><span class="k">OnUnitActiveSec=1h</span><span class="v">Một giờ sau lần chạy gần nhất của service. Dùng chung với <code>OnBootSec=</code> cho "mỗi giờ, bắt đầu ngay sau khi máy lên" — nghĩa THẬT SỰ khác với <code>0 * * * *</code>, vì nó không bao giờ chồng một lượt chạy chậm lên lượt kế tiếp.</span></div>
</div>
<p>Hai chỉ thị không có thứ tương đương nào bên cron và chính là lý do nên chọn timer. <code>Persistent=true</code> ghi nhớ lần chạy cuối xuống đĩa: nếu 03:30 máy đang tắt thì công việc nổ ngay sau lần khởi động kế tiếp thay vì bị bỏ qua trong im lặng — đó là điều cron làm, và đó là cách một bản sao lưu "hằng ngày" lặng lẽ bỏ sót ba ngày cái laptop gập lại. <code>RandomizedDelaySec=</code> làm nhiễu điểm bắt đầu, để năm mươi máy chủ cùng một timer không đập vào cơ sở dữ liệu của bạn trong cùng một giây.</p>

<h3>UTC và +07: vì sao bản sao lưu chạy lúc 9 giờ sáng</h3>
${slide('lx-11', 12, 'Máy chủ UTC, bạn +07: cron lệch 7 tiếng')}
<p>Chuyện có thật của dự án khoá này: container và VPS chạy giờ <strong>UTC</strong>, còn người viết lịch sống ở giờ Việt Nam (<strong>+07</strong>). Dòng <code>0 2 * * * backup.sh</code> được viết với ý "2 giờ sáng, lúc không ai dùng" — và nó chạy đúng 02:00… UTC, tức <strong>09:00 sáng giờ Việt Nam</strong>, giữa giờ cao điểm, tranh đĩa với chính người dùng. Không có dòng lỗi nào, vì với cron chẳng có gì sai cả.</p>
<div class="out">$ date; TZ=Asia/Ho_Chi_Minh date
Mon Sep 28 15:26:06 UTC 2026
Mon Sep 28 22:26:06 +07 2026</div>
<p>Ba cách sửa, theo thứ tự nên dùng:</p>
<ol>
<li><strong>Viết lịch theo giờ của MÁY.</strong> Muốn 02:00 giờ VN thì viết <code>0 19 * * *</code> (19:00 UTC hôm TRƯỚC). Kiểm múi giờ máy bằng <code>timedatectl</code> trước khi viết bất cứ dòng nào.</li>
<li><strong>Dùng timer và ghi múi giờ ngay trong lịch</strong> — systemd hiểu, và cho bạn hỏi lại bằng giờ UTC:
<div class="out">$ systemd-analyze calendar '*-*-* 02:00 Asia/Ho_Chi_Minh'
  Original form: *-*-* 02:00 Asia/Ho_Chi_Minh
Normalized form: *-*-* 02:00:00 Asia/Ho_Chi_Minh
    Next elapse: Mon 2026-09-28 19:00:00 UTC
       From now: 3h 11min left</div></li>
<li><strong>Đổi múi giờ cả máy</strong> (<code>timedatectl set-timezone Asia/Ho_Chi_Minh</code>) — được, nhưng Bài 11.3 giải thích vì sao nên để máy chủ ở UTC; và cron của Debian/Ubuntu đọc múi giờ lúc khởi động nên còn phải <code>systemctl restart cron</code>.</li>
</ol>
<div class="callout warn"><strong><code>CRON_TZ=</code> KHÔNG chạy trên cron của Ubuntu.</strong> Nhiều bài trên mạng bảo thêm <code>CRON_TZ=Asia/Ho_Chi_Minh</code> vào đầu crontab. Đó là tính năng của cronie (Fedora/RHEL — <code>man 5 crontab</code> trên Fedora 44 có mô tả nó). Cron của Ubuntu 24.04 coi nó chỉ là một biến môi trường bình thường. Đo thật: đặt một công việc lúc 22:28 "giờ VN" khi đồng hồ VN đang là 22:27:</div>
<div class="out">$ crontab -l
CRON_TZ=Asia/Ho_Chi_Minh
28 22 * * * touch /tmp/crontz-vn
* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1
$ date      <span class="tok-comment"># hai phút sau</span>
Mon Sep 28 15:28:21 UTC 2026
$ ls /tmp/crontz-vn
ls: cannot access '/tmp/crontz-vn': No such file or directory
$ grep CRON_TZ /tmp/cron-env.txt
CRON_TZ=Asia/Ho_Chi_Minh</div>
<p>Dòng cuối là bằng chứng: <code>CRON_TZ</code> chỉ bị chuyển thành một biến trong môi trường của công việc. Lịch vẫn tính theo UTC — công việc sẽ chạy lúc 22:28 UTC (05:28 sáng hôm sau giờ VN).</p>

<h3>Nên dùng cái nào?</h3>
${slide('lx-11', 14, 'cron hay timer: bảng so sánh')}
<div class="kv-grid">
  <div class="kv"><span class="k">Dùng cron khi…</span><span class="v">Công việc nhỏ xíu, máy có thể không chạy systemd (container, Alpine, BSD), hoặc bạn đang sửa máy chủ của người khác và một dòng là toàn bộ thay đổi. Thêm nữa: cron là cái duy nhất trong hai thứ mà một người dùng thường tự dựng được, không cần quyền gì ngoài tài khoản của chính họ.</span></div>
  <div class="kv"><span class="k">Dùng timer khi…</span><span class="v">Bạn muốn log trong journal, một mã thoát tra được, một quan hệ phụ thuộc vào unit khác (<code>After=postgresql.service</code>), một giới hạn tài nguyên, chạy bù sau khi máy tắt, hoặc đúng bộ hộp cát bạn đã cho service ở Bài 11.1.</span></div>
  <div class="kv"><span class="k">Khả năng gỡ lỗi</span><span class="v">Không ngang cơ. <code>systemctl start backup.service</code> chạy công việc NGAY BÂY GIỜ, y hệt cách cái lịch sẽ chạy nó, và <code>journalctl -u backup.service -n 50</code> cho thấy chuyện gì đã xảy ra. Thứ tương đương bên cron là chờ tới 03:30 và hy vọng mình đã chuyển hướng output.</span></div>
  <div class="kv"><span class="k">Độ dài dòng</span><span class="v">cron thắng: một dòng so với hai file cộng một lần <code>daemon-reload</code>. Đó là cái giá có thật cho một việc vặt năm giây, và là con số làm tròn cho bất cứ thứ gì quan trọng.</span></div>
  <div class="kv"><span class="k">Chạy chồng</span><span class="v">Timer sẽ KHÔNG khởi chạy lượt thứ hai của một service <code>oneshot</code> còn đang chạy từ lượt trước — nó xếp hàng hoặc bỏ qua. cron thì vui vẻ khởi chạy bản thứ hai, thứ ba và thứ tư. Xem <code>flock</code> ở dưới.</span></div>
</div>

<h3>"Công việc của tôi không chạy" — cái thang</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bộ hẹn giờ có đang chạy không?</span><span class="lz-t">systemctl status cron · với timer thì dùng list-timers</span><span class="lz-d">Hiếm, nhưng loại trừ nó không tốn gì. <code>systemctl list-timers --all</code> cho thấy cả những timer tồn tại mà không hoạt động.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nó có THỬ không?</span><span class="lz-t">journalctl -t CRON --since today · journalctl -u backup.service --since today</span><span class="lz-d">cron ghi một dòng mỗi lần nó khởi chạy một công việc, kể cả khi công việc đó sau đó hỏng. Không có dòng nào nghĩa là cái lịch hoặc cái file sai; CÓ dòng nghĩa là lịch đúng và thứ hỏng là công việc. Riêng phép kiểm này chẻ đôi bài toán.</span></div>
  <div class="lz-step"><span class="lz-k">3 · File có đọc được và đặt tên đúng không?</span><span class="lz-t">run-parts --test /etc/cron.daily · ls -l /etc/cron.d/</span><span class="lz-d">Dấu chấm trong tên, thiếu bit thực thi, sai chủ sở hữu, hoặc thiếu dòng trống cuối file crontab — tất cả đều im lặng.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Chạy nó theo cách bộ hẹn giờ sẽ chạy</span><span class="lz-t">systemctl start backup.service · env -i … /bin/sh -c '…'</span><span class="lz-d">Đừng chạy từ shell của chính bạn — môi trường của bạn che mất con bọ. Đây là chỗ <code>command not found</code> và <code>permission denied</code> cuối cùng cũng lộ ra.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Kiểm đồng hồ và múi giờ</span><span class="lz-t">timedatectl</span><span class="lz-d">"Nó chạy trễ ba tiếng" gần như luôn là chuyện UTC so với giờ địa phương. Timer trên systemd hiện đại có thể ghi múi giờ ngay trong <code>OnCalendar</code>; cron thì theo múi giờ hệ thống và cần khởi động lại sau khi bạn đổi múi giờ.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Tìm bản sao thứ hai</span><span class="lz-t">pgrep -af backup.sh</span><span class="lz-d">Một công việc chồng lên chính nó trông y hệt "nó không chạy", trong khi sự thật là nó chưa bao giờ chạy XONG. Hãy khoá nó lại (ngay dưới).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># cron có thử không? Đây là câu lệnh đầu tiên, lần nào cũng vậy.</span>
journalctl -t CRON --since today | tail -20</code></pre>
<div class="out">Aug 22 03:30:01 vps-1 CRON[40112]: (deploy) CMD (/usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1)
Aug 22 03:39:14 vps-1 CRON[40112]: (deploy) MAIL (mailed 1 byte of output; but got status 0x004b)
Aug 22 04:17:01 vps-1 CRON[40255]: (root) CMD (cd / &amp;&amp; run-parts --report /etc/cron.hourly)</div>

<h3>Đừng bao giờ để hai bản cùng chạy</h3>
${slide('lx-11', 15, 'flock: bản thứ hai tự lui')}
<p>Một bản sao lưu bình thường mất bốn phút thì sẽ có một ngày mất bảy mươi phút, và cron vẫn khởi chạy bản kế tiếp đúng lịch bất kể điều đó. Giờ hai tiến trình <code>pg_dump</code> giành nhau cùng một cái đĩa, mỗi cái làm cái kia chậm thêm, và hàng đợi dài ra cho tới khi cả máy đổ. Cách sửa gói gọn trong một từ (Bài 7.3):</p>
<pre><code><span class="tok-comment"># Bỏ hẳn lượt này nếu lượt trước còn đang chạy</span>
30 3 * * * /usr/bin/flock -n /var/lock/backup.lock /usr/local/bin/backup.sh

<span class="tok-comment"># Hoặc chờ khoá tối đa 60 giây rồi bỏ cuộc</span>
30 3 * * * /usr/bin/flock -w 60 /var/lock/backup.lock /usr/local/bin/backup.sh</code></pre>
<div class="out">$ flock -n /var/lock/backup.lock sleep 300 &amp;
[1] 41902
$ flock -n /var/lock/backup.lock echo "second copy"
$ echo \$?
1</div>
<p>Không in gì và mã thoát 1: bản sao thứ hai đã từ chối khởi động, đúng như mong muốn. <code>flock</code> giữ khoá suốt thời gian câu lệnh chạy và nhả ra khi tiến trình thoát — thoát KIỂU GÌ cũng nhả, kể cả sập hay bị <code>kill -9</code>, vì nhân buông khoá cùng với bộ mô tả file. Đó là lý do nó hơn hẳn một cái <code>if [ -f /tmp/lock ]</code> tự chế, thứ để lại một file khoá mồ côi và chặn mọi lượt chạy sau này.</p>
<p>Timer được tặng một phần chuyện này — systemd sẽ không khởi chạy bản thứ hai của một service <code>oneshot</code> còn đang chạy — nhưng vẫn cứ thêm <code>flock</code> nếu cùng cái script đó có thể được người ta gọi tay.</p>
<table>
<tr><th>Cờ của flock</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>-n</code></td><td>Không chờ: khoá đang bận thì thoát ngay (mặc định mã 1)</td><td><code>flock -n /var/lock/x.lock cmd</code></td></tr>
<tr><td><code>-w 60</code></td><td>Chờ tối đa 60 giây rồi bỏ</td><td><code>flock -w 60 /var/lock/x.lock cmd</code></td></tr>
<tr><td><code>-E 75</code></td><td>Mã thoát khi không lấy được khoá — để phân biệt với lỗi của chính <code>cmd</code></td><td><code>flock -w 2 -E 75 … ; echo $?</code> → <code>75</code></td></tr>
<tr><td><code>-x</code> / <code>-s</code></td><td>Khoá độc quyền (mặc định) / khoá chia sẻ (nhiều người đọc cùng lúc)</td><td><code>flock -s /var/lock/x.lock cat …</code></td></tr>
<tr><td><code>-u</code></td><td>Nhả khoá sớm (dùng với dạng <code>flock 9</code> trong script)</td><td><code>flock -u 9</code></td></tr>
</table>
<div class="out">$ flock -w 2 -E 75 /tmp/backup.lock echo hi; echo "exit=$?"
exit=75</div>
<p><strong>Một chi tiết đo thật:</strong> khoá gắn với <em>bộ mô tả file</em>, mà tiến trình con thừa hưởng bộ mô tả file. Chạy <code>flock -n /tmp/backup.lock sleep 30 &amp;</code> rồi <code>kill %1</code> — thứ bị giết là <code>flock</code>, còn <code>sleep</code> (con của nó) vẫn sống và vẫn giữ khoá: lần <code>flock -n</code> kế tiếp vẫn thất bại cho tới khi <code>sleep</code> chết. Với dịch vụ systemd chuyện này không xảy ra vì <code>systemctl stop</code> giết cả cgroup; với cron thì một tiến trình con mồ côi có thể giữ khoá và chặn mọi lượt sau — kiểm bằng <code>fuser -v /var/lock/backup.lock</code> hoặc <code>lsof /var/lock/backup.lock</code>.</p>

<h3>Một ví dụ hoàn chỉnh</h3>
<pre><code class="language-bash"><span class="tok-comment"># /usr/local/bin/backup.sh — im khi thành công, ồn khi thất bại</span>
#!/usr/bin/env bash
set -Eeuo pipefail
export PATH=/usr/local/bin:/usr/bin:/bin

DEST=/srv/backups
KEEP_DAYS=14
STAMP=\$(date +%Y%m%d-%H%M%S)
FILE="\$DEST/app-\$STAMP.dump"

mkdir -p "\$DEST"
trap 'rm -f "\$FILE.part"' ERR INT TERM        <span class="tok-comment"># Bài 7.3 — không có bản sao lưu viết dở</span>

<span class="tok-comment"># Hỏng sớm nếu không còn chỗ để đặt nó (Bài 10.1)</span>
avail=\$(df --output=avail -BM "\$DEST" | tail -1 | tr -dc '0-9')
[ "\$avail" -lt 2048 ] &amp;&amp; { echo "backup: chỉ còn \${avail}MB trống, từ chối chạy" &gt;&amp;2; exit 1; }

pg_dump --format=custom --compress=9 "\$DATABASE_URL" &gt; "\$FILE.part"
mv "\$FILE.part" "\$FILE"                        <span class="tok-comment"># nguyên tử: file .dump chỉ tồn tại khi đã hoàn chỉnh</span>

find "\$DEST" -name 'app-*.dump' -mtime +"\$KEEP_DAYS" -print -delete
echo "backup: \$(du -h "\$FILE" | cut -f1) -&gt; \$FILE"</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># Thử nó TRƯỚC khi hẹn giờ — dưới đúng người dùng sẽ chạy nó</span>
sudo -u deploy /usr/local/bin/backup.sh
sudo systemctl start backup.service          <span class="tok-comment"># rồi tới cách nó sẽ chạy thật</span>
journalctl -u backup.service -n 20 --no-pager</code></pre>
<div class="out">Aug 22 18:02:41 vps-1 systemd[1]: Starting backup.service - Nightly database backup...
Aug 22 18:02:49 vps-1 backup.sh[42871]: backup: 84M -&gt; /srv/backups/app-20260822-180241.dump
Aug 22 18:02:49 vps-1 systemd[1]: backup.service: Deactivated successfully.
Aug 22 18:02:49 vps-1 systemd[1]: Finished backup.service - Nightly database backup.</div>
<div class="callout ok"><strong>Một công việc hẹn giờ mà bạn chưa từng xem nó chạy thì không phải một công việc hẹn giờ, đó là một niềm hy vọng.</strong> Chạy tay dưới đúng người dùng, rồi chạy qua bộ hẹn giờ bằng <code>systemctl start</code>, rồi đọc journal. Ba câu lệnh, và chúng bắt được con bọ môi trường, con bọ quyền hạn và con bọ "nó ghi nhầm thư mục" trước khi 03:30 kịp tới. Và riêng với sao lưu: hãy PHỤC HỒI nó ở đâu đó một lần. Một bản sao lưu chưa từng phục hồi là một bản sao lưu chưa từng được kiểm.</div>


<h3>Chạy thử từng bước: cron và timer trong container có systemd</h3>
<p>Dùng lại container <code>lab-sd</code> của Bài 11.1 (đã cài <code>cron</code>). Mọi output dưới đây là thật, chạy ngày 28/09/2026:</p>
<pre><code class="language-bash">useradd -m -s /bin/bash deploy
echo '* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1' | crontab -u deploy -
printf '* * * * * root touch /tmp/co-cham\\n'   &gt; /etc/cron.d/app.cleanup
printf '* * * * * root touch /tmp/khong-cham\\n' &gt; /etc/cron.d/app-cleanup
sleep 70
cat /tmp/cron-env.txt; ls /tmp/co-cham /tmp/khong-cham
journalctl -t CRON --since '-2min' | grep CMD</code></pre>
<div class="out">HOME=/home/deploy
LOGNAME=deploy
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
LANG=C.UTF-8
SHELL=/bin/sh
PWD=/home/deploy
ls: cannot access '/tmp/co-cham': No such file or directory
/tmp/khong-cham
Sep 28 15:26:01 vps-1 CRON[821]: (root) CMD (touch /tmp/khong-cham)
Sep 28 15:26:01 vps-1 CRON[822]: (deploy) CMD (env &gt; /tmp/cron-env.txt 2&gt;&amp;1)</div>
<p>Rồi cùng công việc đó làm bằng timer: viết <code>/usr/local/bin/backup.sh</code> (nén <code>/srv/app</code> vào <code>/srv/backups</code>), <code>backup.service</code> (<code>Type=oneshot</code>, <code>User=deploy</code>) và <code>backup.timer</code> (<code>OnCalendar=*-*-* 03:30:00</code>, <code>Persistent=true</code>, <code>RandomizedDelaySec=300</code>) đúng như mẫu ở trên, rồi:</p>
<pre><code class="language-bash">systemctl daemon-reload
systemctl enable --now backup.timer
systemctl list-timers backup.timer
systemctl start backup.service
journalctl -u backup.service -n 6 --no-pager</code></pre>
<div class="out">Created symlink /etc/systemd/system/timers.target.wants/backup.timer → /etc/systemd/system/backup.timer.
NEXT                        LEFT LAST PASSED UNIT         ACTIVATES
Tue 2026-09-29 03:32:04 UTC  12h -         - backup.timer backup.service

1 timers listed.
Sep 28 15:25:48 vps-1 systemd[1]: Starting backup.service - Nightly backup...
Sep 28 15:25:48 vps-1 backup.sh[775]: backup: 4.0K -&gt; /srv/backups/app-20260928-152548.tar.gz
Sep 28 15:25:48 vps-1 systemd[1]: backup.service: Deactivated successfully.
Sep 28 15:25:48 vps-1 systemd[1]: Finished backup.service - Nightly backup.</div>
<p>Để ý <code>NEXT</code> là 03:32:04 chứ không phải 03:30 — đó là <code>RandomizedDelaySec=300</code> đang làm việc của nó.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Việc</th><th>Ubuntu 24.04</th><th>macOS (đo trên macOS 27)</th><th>WSL2</th></tr>
<tr><td>cron</td><td><code>cron</code> 3.0pl1 (Vixie)</td><td>có <code>/usr/bin/crontab</code> và <code>com.vix.cron.plist</code> trong <code>/System/Library/LaunchDaemons</code>, nhưng Apple khuyên dùng launchd (<code>StartCalendarInterval</code>, Chương 13–15)</td><td>như Ubuntu — chỉ chạy khi có systemd (hoặc bạn tự <code>service cron start</code>) và khi máy ảo WSL còn sống</td></tr>
<tr><td>Timer</td><td>systemd</td><td>không có <code>systemctl</code></td><td>khi đã bật systemd</td></tr>
<tr><td><code>flock</code></td><td>có (util-linux)</td><td><code>flock not found</code> (cài bằng Homebrew nếu cần)</td><td>có</td></tr>
<tr><td>Ngày mai</td><td><code>date -d tomorrow +%F</code></td><td><code>date -v+1d +%F</code> → <code>2026-09-29</code>; <code>date -d</code> → <code>illegal option -- d</code></td><td>như Ubuntu</td></tr>
<tr><td>Múi giờ</td><td><code>timedatectl</code></td><td>không có <code>timedatectl</code>; <code>readlink /etc/localtime</code> → <code>…/zoneinfo/Asia/Ho_Chi_Minh</code></td><td>như Ubuntu (<code>timedatectl</code> khi đã bật systemd)</td></tr>
</table>
<p>Hệ quả thực tế: script sao lưu dùng <code>date -d</code> hay <code>flock</code> chạy ngon trên VPS nhưng vỡ khi bạn thử trên Mac — hãy thử trong container Ubuntu, đừng thử trên Mac rồi đem lên máy chủ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm báo "bản sao lưu chạy lúc 9 giờ sáng làm web chậm, và hôm qua nó còn không chạy". Trong container <code>lab-sd</code>:</p><ol>
<li>Cài một dòng crontab cho <code>deploy</code> ghi <code>env</code> ra <code>/tmp/cron-env.txt</code>; sau một phút chỉ ra hai biến mà cron có còn shell đăng nhập của bạn khác đi (<code>PATH</code> có <code>~/.local/bin</code> không?).</li>
<li>Tạo <code>/etc/cron.d/backup.job</code> chạy <code>touch /tmp/bk</code> mỗi phút; sau hai phút chứng minh nó KHÔNG chạy bằng <code>journalctl -t CRON</code>; đổi tên thành <code>backup-job</code> và chứng minh nó chạy.</li>
<li>Chuyển thành cặp <code>bk.service</code> + <code>bk.timer</code> với <code>OnCalendar=*-*-* 02:00 Asia/Ho_Chi_Minh</code>; dùng <code>systemd-analyze calendar</code> để đọc ra giờ UTC tương ứng, rồi <code>systemctl list-timers bk.timer</code>.</li>
<li>Chứng minh không chạy chồng được: <code>flock -n /tmp/bk.lock sleep 20 &amp;</code> rồi <code>flock -n /tmp/bk.lock echo lan-2; echo $?</code>.</li></ol>
<p><strong>Đạt khi:</strong> bước 2 có đúng một loại dòng <code>CMD</code> (của <code>backup-job</code>); bước 3 in <code>Next elapse: … 19:00:00 UTC</code>; bước 4 không in <code>lan-2</code> và mã thoát là <code>1</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">cron / crontab (bộ hẹn giờ / bảng lịch)</span><span class="v">Dịch vụ chạy lệnh theo lịch; crontab là file lịch của từng người, sửa bằng <code>crontab -e</code>.</span></div>
  <div class="kv"><span class="k">Field (trường)</span><span class="v">Năm cột thời gian phút · giờ · ngày · tháng · thứ đứng trước câu lệnh.</span></div>
  <div class="kv"><span class="k">run-parts (chạy cả thư mục)</span><span class="v">Chương trình chạy mọi script hợp lệ trong <code>/etc/cron.daily/</code>… — bỏ qua tên có dấu chấm.</span></div>
  <div class="kv"><span class="k">Timer (bộ hẹn giờ của systemd)</span><span class="v">Unit <code>.timer</code> khởi chạy một <code>.service</code> cùng tên theo lịch <code>OnCalendar=</code> hoặc theo đồng hồ đơn điệu.</span></div>
  <div class="kv"><span class="k">Persistent (chạy bù)</span><span class="v">Timer nhớ lần chạy cuối trên đĩa; lỡ giờ vì máy tắt thì chạy ngay khi máy lên.</span></div>
  <div class="kv"><span class="k">Time zone / UTC (múi giờ / giờ quốc tế)</span><span class="v">Cron đọc giờ của MÁY; VPS thường ở UTC, chậm hơn giờ Việt Nam 7 tiếng.</span></div>
  <div class="kv"><span class="k">Lock (khoá)</span><span class="v"><code>flock</code> giữ một khoá trên file suốt thời gian lệnh chạy để bản thứ hai không khởi động.</span></div>
  <div class="kv"><span class="k">Environment (môi trường)</span><span class="v">Tập biến như <code>PATH</code>, <code>HOME</code> mà công việc nhận được — của cron mỏng hơn shell của bạn nhiều.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một dòng cron là năm trường thời gian theo giờ của MÁY rồi tới câu lệnh chạy bằng <code>/bin/sh</code>; crontab chỉ bắt lỗi thô, phút 61 vẫn được cài.</li>
<li>Cron không đọc <code>~/.bashrc</code>: PATH của nó (dài trên Ubuntu, ngắn trên Fedora) không có nvm hay <code>~/.local/bin</code> — script bọc tự đặt môi trường là cách sửa bền.</li>
<li>Tên file có dấu chấm trong <code>/etc/cron.d/</code> và <code>/etc/cron.daily/</code> bị bỏ qua không một dòng log; kiểm bằng <code>run-parts --test</code> và <code>journalctl -t CRON</code>.</li>
<li>Máy UTC + người +07 = lịch lệch 7 tiếng; Ubuntu lờ <code>CRON_TZ</code>, timer thì ghi được múi giờ trong <code>OnCalendar</code>.</li>
<li>Timer là cặp <code>.timer</code> + <code>.service</code>: enable timer, chạy thử bằng <code>systemctl start x.service</code>, hỏi lịch bằng <code>systemd-analyze calendar</code>.</li>
<li><code>flock -n</code> chặn chạy chồng; khoá nhả khi MỌI tiến trình giữ bộ mô tả file đã thoát.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/flock.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">flock(1) — khoá file từ shell</span><span class="lc-sub">Đủ các cờ <code>-n</code>, <code>-w</code>, <code>-E</code>, <code>-s</code> và dạng <code>flock 9</code> dùng bên trong script — kèm ví dụ chống chạy chồng.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">systemd.timer — sổ tay chính thức</span><span class="lc-sub">Mọi chỉ thị, gồm <code>Persistent=</code>, <code>RandomizedDelaySec=</code> và họ đồng hồ đơn điệu <code>OnBootSec=</code>. Ngắn và đáng đọc từ đầu tới cuối.</span></span>
</a>
<a class="link-card" href="https://www.freedesktop.org/software/systemd/man/latest/systemd.time.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗓️</span>
  <span class="lc-body"><span class="lc-title">systemd.time — cú pháp lịch</span><span class="lc-sub">Ngữ pháp đứng sau <code>OnCalendar=</code>, kèm bảng các tên viết tắt. Ghép nó với <code>systemd-analyze calendar</code> là bạn không bao giờ phải đoán nữa.</span></span>
</a>
<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/en/man5/crontab.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">crontab(5) — sổ tay Ubuntu</span><span class="lc-sub">Nguồn chuẩn về năm trường, các lối tắt <code>@</code>, và cái luật HOẶC giữa ngày-trong-tháng và thứ-trong-tuần khiến ai cũng ngạc nhiên đúng một lần.</span></span>
</a>
<a class="link-card" href="https://crontab.guru/" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">crontab.guru</span><span class="lc-sub">Dán một biểu thức vào, đọc lại nó bằng tiếng Anh, xem các lần chạy kế tiếp. Bản tương đương của <code>systemd-analyze calendar</code> cho cron, và là cách nhanh nhất để kiểm một dòng trước khi cài nó.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: hẹn giờ một công việc CHẠY THẬT</span><span class="lc-sub">Bài chấm điểm: đọc lại sáu dòng crontab bằng tiếng Việt, sửa một công việc hỏng vì PATH của cron, chuyển nó thành timer có <code>Persistent=</code>, và chặn một công việc chậm chồng lên chính nó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>crontab -r</code> xoá sạch crontab của bạn, ngay lập tức, không hỏi lại — và trên bàn phím nó nằm cách <code>crontab -e</code> đúng một phím. Không có hoàn tác, không có file sao lưu nào. Hai thói quen giúp bạn sống sót: giữ lịch thật trong <code>/etc/cron.d/</code> hoặc trong các unit timer nằm dưới quản lý phiên bản, và nếu buộc phải dùng crontab cá nhân thì chạy <code>crontab -l &gt; ~/crontab.bak</code> trước mỗi lần sửa. Trên vài hệ thống <code>crontab -i -r</code> có hỏi lại; đừng trông vào việc nó đã được cấu hình sẵn.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Cái lịch gần như không bao giờ là con bọ — MÔI TRƯỜNG mới là, nên hãy thử mọi công việc bằng <code>env -i</code> hoặc <code>systemctl start</code> trước khi bạn tin vào cái đồng hồ. Hãy chuyển output tới một nơi bạn thật sự sẽ nhìn, vì <code>&gt;/dev/null 2&gt;&amp;1</code> biến một công việc đang hỏng thành một công việc im lặng. Và với bất cứ thứ gì KHÔNG được bỏ sót sau khi máy tắt hay KHÔNG được chồng lên chính nó, hãy dùng timer với <code>Persistent=true</code> và bọc câu lệnh trong <code>flock</code> — hai dòng đó là khác biệt giữa một cái lịch và một lời hứa.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Hardening a server: the first hour, and the routine after|||11.3 — Gia cố một máy chủ: giờ đầu tiên, và nếp thường ngày sau đó',
      slug: 'lnx-11-3-gia-co-may-chu',
      type: 'LESSON',
      description: 'Khoá SSH lại mà không tự nhốt mình ở ngoài, người dùng triển khai không phải root, cập nhật bảo mật tự động, swap cho VPS nhỏ, đồng bộ giờ, khởi động lại khi nhân đổi, và một danh sách kiểm cho giờ đầu tiên trên một máy chủ mới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Hardening a server: the first hour, and the routine after</h2>
<p class="lead">A brand-new VPS with a public IP starts receiving SSH login attempts within minutes. Not eventually — minutes. They are automated, they are constant, and they are trying <code>root</code> with a dictionary. None of that matters if you spend twenty minutes doing five specific things, and all of it matters if you do not.</p>
<p>This lesson is those five things, plus the small number of chores that keep a server healthy afterwards. It is deliberately short on theory. Everything here you will type on a real machine within your first hour of owning it.</p>

<h3>What the internet is already doing to your box</h3>
${slide('lx-11', 16, 'Sáu lớp phòng thủ cho một VPS công khai')}
<pre><code class="language-bash"><span class="tok-comment"># Failed SSH logins — on a fresh public VPS, run this after an hour</span>
sudo journalctl -u ssh --since '1 hour ago' | grep -c 'Failed password'
sudo journalctl -u ssh --since '1 hour ago' | grep 'Invalid user' | tail -5
sudo lastb | head -5              <span class="tok-comment"># the bad-login log, needs /var/log/btmp</span></code></pre>
<div class="out">$ sudo journalctl -u ssh --since '1 hour ago' | grep -c 'Failed password'
1477
$ sudo journalctl -u ssh --since '1 hour ago' | grep 'Invalid user' | tail -5
Aug 22 17:12:04 vps-1 sshd[9912]: Invalid user admin from 45.148.10.62 port 51234
Aug 22 17:12:11 vps-1 sshd[9918]: Invalid user test from 218.92.0.115 port 33188
Aug 22 17:13:02 vps-1 sshd[9931]: Invalid user ubuntu from 92.255.85.107 port 40022
Aug 22 17:13:44 vps-1 sshd[9944]: Invalid user postgres from 45.148.10.62 port 39900
Aug 22 17:14:20 vps-1 sshd[9950]: Invalid user oracle from 141.98.11.29 port 62112</div>
<p>Fourteen hundred attempts in one hour, on a machine nobody knows exists. This is background radiation on the public internet, and it is why "nobody will find my little server" is not a plan. The good news: every single one of those is a <em>password</em> attempt, and step one below makes passwords impossible.</p>

<h3>Step 1 — SSH keys only, and prove it before you disconnect</h3>
${slide('lx-11', 17, 'sshd: giá trị ĐẦU TIÊN thắng — 01- thắng 50-cloud-init')}
<p>Chapter 9 covered generating a key and copying it up. Now you turn passwords off. The danger is obvious: get this wrong, close your terminal, and the machine is gone — VPS providers sell you a console, but not every provider's console works well, and some don't have one at all.</p>
<pre><code class="language-bash"><span class="tok-comment"># On your laptop, if you have not already</span>
ssh-keygen -t ed25519 -C "you@laptop"
ssh-copy-id deploy@203.0.113.10

<span class="tok-comment"># Prove the key works BEFORE changing anything</span>
ssh -o PasswordAuthentication=no deploy@203.0.113.10 'echo key-login-ok'</code></pre>
<div class="out">key-login-ok</div>
<p>That flag forces the client to refuse to fall back to a password, so a success means the key genuinely worked. Only now do you edit the server config — and edit it as a <strong>drop-in</strong>, not by hacking the main file:</p>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/01-hardening.conf   ← 01-, NOT 99- (see the pitfall below)</span>
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code class="language-bash">sudo sshd -t                       <span class="tok-comment"># VALIDATE. Prints nothing if the config is good.</span>
sudo systemctl reload ssh          <span class="tok-comment"># reload, not restart — existing sessions survive</span></code></pre>
<div class="callout warn"><strong>Keep the old session open and test from a SECOND terminal.</strong> This is the whole safety procedure and it takes ten seconds: your current SSH session stays connected across a <code>reload</code> even if the new config is broken, so it is your lifeline. Open a new terminal, connect, and only when that works do you close the first one. Doing it the other way round is how people end up rebuilding a server because of one typo. <code>sshd -t</code> catches syntax errors; it cannot catch "you locked out your own username".</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">PasswordAuthentication no</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The one that ends the attacks</span><span class="lz-nsub">A brute-force attempt against a key-only server cannot succeed at any speed. Those 1,477 attempts become 1,477 instant rejections that never reach a password check.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">PermitRootLogin no</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Removes the one username everyone guesses</span><span class="lz-nsub">You log in as <code>deploy</code> and use <code>sudo</code> (Lesson 4.4). Now an attacker must guess a username AND hold a private key. Also gives you an audit trail: <code>sudo</code> logs who did what.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">AllowUsers deploy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">An explicit allow-list</span><span class="lz-nsub">Every other account — including service accounts a package creates later — cannot log in at all, even with a valid key. Cheap, and it prevents a whole class of surprise.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">ClientAliveInterval 300</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Not security — comfort</span><span class="lz-nsub">Stops your session freezing behind a NAT that drops idle connections. Pairs with <code>ServerAliveInterval</code> on the client side (Lesson 9.3).</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Confirm what the server ACTUALLY resolved to, not what you think you wrote</span>
sudo sshd -T | grep -iE '^(passwordauthentication|permitrootlogin|pubkeyauthentication|allowusers|port) '</code></pre>
<div class="out">port 22
permitrootlogin no
pubkeyauthentication yes
passwordauthentication no
allowusers deploy</div>
<p><code>sshd -T</code> dumps the fully resolved configuration, drop-ins and defaults included. It is the only honest answer to "is password login really off?" — reading the config files can lie to you, because a <code>Match</code> block or a later drop-in may override what you read.</p>
<div class="pitfall"><strong>Pitfall:</strong> on Ubuntu 22.04 and later, <code>/etc/ssh/sshd_config</code> begins with <code>Include /etc/ssh/sshd_config.d/*.conf</code>, and <strong>in this file the FIRST setting wins</strong>, not the last. So a drop-in named <code>50-cloud-init.conf</code> containing <code>PasswordAuthentication yes</code> — which many cloud images ship — beats your edit further down the main file, and beats a drop-in named <code>99-…</code> too, because <code>50</code> sorts first. Name yours so it sorts EARLY, or delete the offending line from the cloud-init drop-in. Then verify with <code>sshd -T</code>, which is the only check that survives this rule.</div>
<p>Measured on Ubuntu 24.04 (OpenSSH 9.6p1), in exactly the situation cloud images create — <code>50-cloud-init.conf</code> says <code>yes</code>, your file says <code>no</code>:</p>
<div class="out">$ ls /etc/ssh/sshd_config.d/
50-cloud-init.conf  99-hardening.conf
$ sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
permitrootlogin no
passwordauthentication yes
$ sudo mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/01-hardening.conf
$ sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
permitrootlogin no
passwordauthentication no</div>
<p>Notice <code>permitrootlogin no</code> took effect even with the <code>99-</code> name: cloud-init does not set that line, so nothing competes. <strong>Half working, half not, is the signature of an ORDER collision</strong>, not a syntax error — a syntax error is something <code>sshd -t</code> says outright:</p>
<div class="out">$ sudo sshd -t
/etc/ssh/sshd_config.d/03-typo.conf: line 1: Bad configuration option: PasswordAuthentcation
/etc/ssh/sshd_config.d/03-typo.conf: terminating, 1 bad configuration options
$ echo $?
255</div>
<p><strong>One limit of <code>sshd -T</code>:</strong> it prints the configuration for a "generic" connection, so <code>Match</code> blocks are not applied. With <code>Match User deploy</code> / <code>PasswordAuthentication yes</code>, plain <code>sshd -T</code> still prints <code>no</code>; ask about a specific connection with <code>-C</code>:</p>
<div class="out">$ sudo sshd -T | grep ^passwordauth
passwordauthentication no
$ sudo sshd -T -C user=deploy,host=laptop,addr=203.0.113.5 | grep ^passwordauth
passwordauthentication yes</div>

<h3>Changing the SSH port on Ubuntu 24.04: ssh.socket owns the port</h3>
${slide('lx-11', 18, 'Ubuntu 24.04: ssh.socket giữ cổng SSH')}
<p>Since Ubuntu 22.10, <code>sshd</code> is <strong>socket-activated</strong>: systemd itself listens on port 22 through the <code>ssh.socket</code> unit and only starts <code>sshd</code> when a connection arrives (Chapter 9 met this with port 993). The consequence when hardening: change <code>Port</code>, <code>restart ssh</code>, and <code>sshd -T</code> reports the new port while the real port is still 22. Re-measured in an Ubuntu 24.04 container running real systemd:</p>
<div class="out">$ systemctl is-enabled ssh.socket ssh.service
enabled
disabled
$ echo 'Port 2222' | sudo tee /etc/ssh/sshd_config.d/02-port.conf &gt;/dev/null
$ sudo systemctl restart ssh; sudo sshd -T | grep ^port
port 2222
$ sudo ss -tlnp | grep -E ':22 |:2222 '
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=902,fd=3),("systemd",pid=1,fd=57))
LISTEN 0      4096            [::]:22            [::]:*    users:(("sshd",pid=902,fd=4),("systemd",pid=1,fd=58))
$ sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart ssh.socket
$ sudo ss -tlnp | grep -E ':22 |:2222 '
LISTEN 0      4096         0.0.0.0:2222       0.0.0.0:*    users:(("systemd",pid=1,fd=51))
LISTEN 0      4096            [::]:2222          [::]:*    users:(("systemd",pid=1,fd=52))
$ cat /run/systemd/generator/ssh.socket.d/addresses.conf
# Automatically generated by sshd-socket-generator

[Socket]
ListenStream=
ListenStream=0.0.0.0:2222
ListenStream=[::]:2222</div>
<p>The mechanism: a <em>generator</em> reads <code>Port</code>/<code>ListenAddress</code> from <code>sshd_config</code> on every <code>daemon-reload</code> and writes a drop-in for <code>ssh.socket</code>; only <code>restart ssh.socket</code> opens the new port. Because <code>Port 2222</code> on its own REPLACES port 22 (it does not add to it), the safe order is: <code>ufw allow 2222/tcp</code> → edit <code>Port</code> (keeping <code>Port 22</code> for now) → <code>daemon-reload</code> → <code>restart ssh.socket</code> → log in on the new port from a SECOND terminal → only then drop port 22. One more measured detail: before any connection has arrived, <code>ssh.service</code> is not running, so <code>systemctl reload ssh</code> says <code>ssh.service is not active, cannot reload.</code> — on a VPS you are SSH'd into it is already running and reload works normally.</p>

<h3>Step 2 — a non-root user with sudo</h3>
<pre><code class="language-bash">sudo adduser deploy                       <span class="tok-comment"># interactive; sets a password and home dir</span>
sudo usermod -aG sudo deploy              <span class="tok-comment"># -aG: APPEND, never plain -G (Lesson 4.4)</span>
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys</code></pre>
<div class="callout"><strong>Those permissions are not optional.</strong> sshd refuses a key if <code>~/.ssh</code> is group- or world-writable, or if <code>authorized_keys</code> is readable by anyone else — and it refuses <em>silently from the client's point of view</em>, which is why "the key just doesn't work" is usually a <code>chmod</code> problem. <code>700</code> on the directory, <code>600</code> on the file, owned by the user. Confirm from the server side with <code>sudo journalctl -u ssh -n 20</code>, which says <code>Authentication refused: bad ownership or modes</code> in plain English.</div>
<p>For deploy scripts and CI, a password prompt in the middle of an automated run is a hang, not a failure. Grant a narrow passwordless rule instead of blanket <code>NOPASSWD: ALL</code>:</p>
<pre><code><span class="tok-comment"># sudo visudo -f /etc/sudoers.d/deploy   ← ALWAYS visudo; it validates before saving</span>
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart app, /usr/bin/systemctl reload nginx</code></pre>
<div class="pitfall"><strong>Pitfall:</strong> never edit anything under <code>/etc/sudoers.d/</code> with a plain editor. A syntax error in a sudoers file breaks <code>sudo</code> for <strong>everyone, immediately</strong> — including your ability to fix it — and on a machine where root login is disabled that is a rescue-console job. <code>visudo</code> parses the file before installing it and refuses to save garbage. Also: files in <code>/etc/sudoers.d/</code> with a dot in the name are ignored, exactly like <code>cron.d</code> (Lesson 11.2).</div>

<h3>Step 3 — the firewall</h3>
<p>Lesson 9.5 covered <code>ufw</code> in depth. The three-line version, for completeness:</p>
<pre><code class="language-bash">sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH                    <span class="tok-comment"># do this BEFORE enabling, every time</span>
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status verbose</code></pre>
<div class="out">Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80,443/tcp                 ALLOW IN    Anywhere</div>
<div class="callout warn"><strong>Docker publishes past ufw.</strong> A container started with <code>-p 5432:5432</code> writes its own rule directly into the <code>DOCKER</code> iptables chain, which is consulted <em>before</em> ufw's — so your database is on the public internet and <code>ufw status</code> shows nothing wrong. Bind to localhost instead: <code>-p 127.0.0.1:5432:5432</code>. Verify what is genuinely listening on a public interface with <code>sudo ss -tlnp</code> and look at the Address column — <code>0.0.0.0:5432</code> is exposed, <code>127.0.0.1:5432</code> is not.</div>

<h3>Step 3b — fail2ban, the basics</h3>
${slide('lx-11', 19, 'fail2ban: đếm lần hỏng, cấm IP bằng nftables')}
<p><strong>fail2ban</strong> reads logs, counts failed logins per IP address, and when an IP crosses a threshold within a time window it adds a firewall rule banning it for a while. It does NOT replace Step 1 (once passwords are off, those attempts could never succeed anyway — see "What is NOT worth your time" at the end), but it cuts log noise and slows down persistent probers. This lesson covers the basics; Chapter 14.4 goes deeper (nginx jails, custom filters).</p>
<pre><code class="language-bash">sudo apt install -y fail2ban
cat /etc/fail2ban/jail.d/defaults-debian.conf       <span class="tok-comment"># Ubuntu's defaults</span>
sudo tee /etc/fail2ban/jail.local &gt;/dev/null &lt;&lt;'EOF'
[sshd]
enabled  = true
maxretry = 3
findtime = 10m
bantime  = 1h
EOF
sudo systemctl restart fail2ban</code></pre>
<div class="out">[DEFAULT]
banaction = nftables
banaction_allports = nftables[type=allports]
backend = systemd

[sshd]
enabled = true</div>
<table>
<tr><th>Option</th><th>Meaning</th><th>Default (<code>jail.conf</code>)</th></tr>
<tr><td><code>maxretry</code></td><td>Failures allowed</td><td>5</td></tr>
<tr><td><code>findtime</code></td><td>…within this window</td><td>10m</td></tr>
<tr><td><code>bantime</code></td><td>How long to ban</td><td>10m</td></tr>
<tr><td><code>ignoreip</code></td><td>IPs never banned — add your home/school IP</td><td>(empty; <code>ignoreself = true</code>)</td></tr>
<tr><td><code>backend</code> · <code>banaction</code></td><td>Where to read logs · how to ban</td><td>Ubuntu 24.04: <code>systemd</code> (journal) · <code>nftables</code></td></tr>
</table>
<p>Measured: four logins with non-existent user names from the same address (the lab temporarily set <code>ignoreself = false</code> so it could ban 127.0.0.1 itself):</p>
<div class="out">$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	4
|  &#96;- Journal matches:	_SYSTEMD_UNIT=sshd.service + _COMM=sshd
&#96;- Actions
   |- Currently banned:	1
   |- Total banned:	1
   &#96;- Banned IP list:	127.0.0.1
$ sudo nft list ruleset | grep -A2 'chain f2b-chain'
	chain f2b-chain {
		type filter hook input priority filter - 1; policy accept;
		tcp dport 22 ip saddr @addr-set-sshd reject with icmp port-unreachable
$ ssh x@127.0.0.1
ssh: connect to host 127.0.0.1 port 22: Connection refused
$ sudo fail2ban-client set sshd unbanip 127.0.0.1
1</div>
<div class="pitfall co-tieu-de"><strong>Always set <code>ignoreip</code> for your own IP, and edit <code>jail.local</code>, never <code>jail.conf</code>.</strong> Mistype your SSH key three times from the school network and you have banned yourself for an hour — from exactly the place you need to get in from. <code>jail.conf</code> is overwritten on package upgrades; <code>jail.local</code> (and <code>jail.d/*.local</code>) are not. And remember the ban rule is tied to a port (<code>tcp dport 22</code>): move SSH without setting <code>port =</code> in the jail and fail2ban bans the wrong port.</div>

<h3>Step 4 — automatic security updates</h3>
${slide('lx-11', 20, 'unattended-upgrades chạy bằng timer lúc 6 giờ')}
<p>Measured on a fresh Ubuntu 24.04 with the package installed: it is already enabled, and it runs from a systemd <strong>timer</strong> (Lesson 11.2) — at 6am MACHINE time, jittered by up to 60 minutes, with catch-up:</p>
<div class="out">$ systemctl is-enabled unattended-upgrades apt-daily-upgrade.timer
enabled
enabled
$ systemctl cat apt-daily-upgrade.timer | grep -A3 '\\[Timer\\]'
[Timer]
OnCalendar=*-*-* 6:00
RandomizedDelaySec=60m
Persistent=true
$ sudo unattended-upgrade --dry-run --debug 2&gt;&amp;1 | grep 'Allowed origins'
Allowed origins are: o=Ubuntu,a=noble, o=Ubuntu,a=noble-security, o=UbuntuESMApps,a=noble-apps-security, o=UbuntuESM,a=noble-infra-security</div>
<p>UTC machine ⇒ "6:00" is 13:00 in Vietnam — the same time-zone shift as Lesson 11.2. And the default origin list is <code>noble</code> (the release pocket, frozen after release day) plus the <code>-security</code> pockets, NOT <code>noble-updates</code>.</p>
<p>The most valuable twenty minutes on this list, because it keeps paying out while you are asleep. Ubuntu ships the mechanism; you only have to turn it on and decide how brave you are about reboots.</p>
<pre><code class="language-bash">sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   <span class="tok-comment"># or edit the files below</span>
systemctl status unattended-upgrades
cat /etc/apt/apt.conf.d/20auto-upgrades</code></pre>
<div class="out">APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";</div>
<pre><code class="language-bash"><span class="tok-comment"># /etc/apt/apt.conf.d/50unattended-upgrades — the lines worth changing</span>
Unattended-Upgrade::Allowed-Origins {
        "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";   <span class="tok-comment"># /boot fills up otherwise</span>
Unattended-Upgrade::Automatic-Reboot "false";               <span class="tok-comment"># see the note below</span>
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
Unattended-Upgrade::Mail "you@example.com";</code></pre>
<pre><code><span class="tok-comment"># Dry-run it — shows exactly what it WOULD install, changes nothing</span>
sudo unattended-upgrade --dry-run --debug 2&gt;&amp;1 | tail -20</code></pre>
<div class="out">Checking: openssl (["&lt;Origin component:'main' archive:'noble-security' ..."])
Checking: libssl3t64 (["&lt;Origin component:'main' archive:'noble-security' ..."])
Packages that will be upgraded: libssl3t64 openssl
Writing dpkg log to /var/log/unattended-upgrades/unattended-upgrades-dpkg.log</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Security-only, always</span><span class="v">Leave <code>-security</code> as the only allowed origin. Pulling <code>-updates</code> automatically means a feature change can land on your production box at 6am unannounced.</span></div>
  <div class="kv"><span class="k">Remove-Unused-Kernel-Packages</span><span class="v">Set it to <code>true</code>. <code>/boot</code> is a small separate partition on many images, and three or four leftover kernels fill it — after which <code>apt</code> fails on every future upgrade with a confusing error about <code>initramfs</code>.</span></div>
  <div class="kv"><span class="k">Automatic-Reboot</span><span class="v">The real trade-off. <code>true</code> means kernel fixes actually take effect and your app has an unannounced restart at 04:00. <code>false</code> means you must reboot yourself — and most people never do, so the patched kernel sits on disk unused for months.</span></div>
  <div class="kv"><span class="k">The honest middle</span><span class="v">Leave it <code>false</code>, and put a weekly reminder in your calendar to check <code>/var/run/reboot-required</code>. If your app cannot survive an unannounced restart at 04:00, that is a resilience problem worth fixing on its own terms (Lesson 11.1: <code>Restart=always</code>).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Does this machine need a reboot right now?</span>
[ -f /var/run/reboot-required ] &amp;&amp; cat /var/run/reboot-required{,.pkgs}</code></pre>
<div class="out">*** System restart required ***
linux-image-6.8.0-45-generic
linux-base</div>
<p><code>needrestart</code> (installed by default on Ubuntu Server) answers the narrower question — which <em>services</em> are running against libraries that have since been patched, and therefore need a restart even if the kernel does not:</p>
<pre><code>sudo needrestart -r l          <span class="tok-comment"># l = list only, do not restart anything</span></code></pre>
<div class="out">Services to be restarted:
 systemctl restart nginx.service
 systemctl restart postgresql@16-main.service

No containers need to be restarted.
No user sessions are running outdated binaries.
No VM guests are running outdated hypervisor (qemu) binaries on this host.</div>

<h3>Step 5 — swap, so the OOM killer is a last resort</h3>
<p>Lesson 5.2 explained what happens when memory runs out: the kernel picks a process and kills it, and it will not be the process you would have chosen. A 1–2GB VPS with no swap hits that path far too easily — often during a <code>npm ci</code> or a <code>next build</code>, which is exactly the 2026-07-06 <code>Exited(137)</code> in this project's own history.</p>
<pre><code class="language-bash">free -h                                   <span class="tok-comment"># check first — many images have none</span>
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile                  <span class="tok-comment"># 600, or mkswap warns and you have leaked memory contents</span>
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   <span class="tok-comment"># survive a reboot</span>
free -h</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       612Mi       138Mi        18Mi       1.2Gi       1.1Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<pre><code class="language-bash"><span class="tok-comment"># Lower the eagerness to swap: use RAM first, swap only under real pressure</span>
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf
sudo sysctl --system | grep swappiness</code></pre>
<div class="callout"><strong>Swap is a shock absorber, not more RAM.</strong> A server that is <em>using</em> swap steadily is a server that is thrashing, and every disk read that should have been a memory read is roughly a hundred thousand times slower. What swap buys you is that a brief spike — a build, a burst of traffic, a leaky request — degrades to "slow for thirty seconds" instead of "the database got killed". Watch <code>si</code>/<code>so</code> in <code>vmstat 1</code>: nonzero for more than a moment means you need more RAM, not more swap.</div>

<h3>The clock</h3>
<p>Wrong time is a debugging tax you pay every day without noticing: log lines that do not line up between two machines, TLS handshakes that fail because a certificate is "not yet valid", cron jobs firing three hours off (Lesson 11.2), and JWTs rejected as expired.</p>
<pre><code>timedatectl
timedatectl set-timezone Asia/Ho_Chi_Minh   <span class="tok-comment"># or leave it UTC — see below</span>
timedatectl show-timesync --all | head -5</code></pre>
<div class="out">               Local time: Fri 2026-08-22 18:21:07 UTC
           Universal time: Fri 2026-08-22 18:21:07 UTC
                 RTC time: Fri 2026-08-22 18:21:08
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: active</div>
<p>Two things to check: <code>System clock synchronized: yes</code> and <code>NTP service: active</code>. If either says no, install <code>systemd-timesyncd</code> or <code>chrony</code> and start it — an unsynchronised clock drifts by seconds a day and the failures it causes look like everything except a clock problem.</p>
<div class="callout ok"><strong>Leave servers on UTC.</strong> It costs you one mental conversion when reading logs and saves you every ambiguity that daylight-saving creates — including one hour that happens twice a year, during which timestamps genuinely go backwards and "ORDER BY created_at" stops meaning what you think. Set the timezone on the <em>display</em> side, in your app or your log viewer, not on the machine.</div>

<h3>The first hour, as a checklist</h3>
${slide('lx-11', 21, 'Giờ đầu tiên với một VPS mới: 8 việc')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Update everything</span><span class="lz-t">apt update &amp;&amp; apt full-upgrade -y &amp;&amp; reboot</span><span class="lz-d">Do it before you build anything on top, while a reboot costs nothing. A fresh image is usually weeks behind.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Non-root user + key</span><span class="lz-t">adduser · usermod -aG sudo · authorized_keys 600</span><span class="lz-d">Test the key login from a second terminal before going further.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Lock SSH</span><span class="lz-t">PasswordAuthentication no · PermitRootLogin no · sshd -t · reload</span><span class="lz-d">Keep the first session open. Verify with <code>sshd -T</code>, not by reading the file.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Firewall</span><span class="lz-t">ufw allow OpenSSH → allow 80,443 → enable</span><span class="lz-d">SSH rule first, always. Then check <code>ss -tlnp</code> for anything listening on 0.0.0.0 that should not be.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Automatic security updates</span><span class="lz-t">unattended-upgrades + Remove-Unused-Kernel-Packages</span><span class="lz-d">Dry-run it once so you know it works, rather than assuming.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Swap + swappiness</span><span class="lz-t">2GB swapfile, vm.swappiness=10</span><span class="lz-d">Only on small machines, and only if <code>free -h</code> shows none. Put it in <code>/etc/fstab</code> or it vanishes on reboot.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Clock + hostname</span><span class="lz-t">timedatectl · hostnamectl set-hostname</span><span class="lz-d">A real hostname makes every log line and every prompt tell you which machine you are on. <code>vps-1</code> beats <code>ubuntu-2gb-sgp1-01</code>.</span></div>
  <div class="lz-step"><span class="lz-k">8 · Backups, and one restore</span><span class="lz-t">a timer (Lesson 11.2) + a test restore, today</span><span class="lz-d">The last step, and the one everyone skips. A backup you have never restored is a file, not a backup.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># A five-minute audit you can run on any server, any time</span>
echo "== reboot needed? ==";   [ -f /var/run/reboot-required ] &amp;&amp; echo YES || echo no
echo "== listening publicly ==";  sudo ss -tlnp | grep -v '127.0.0.1\\|::1'
echo "== ssh password auth ==";   sudo sshd -T | grep -i '^passwordauthentication'
echo "== disk ==";             df -h / | tail -1
echo "== failed units ==";     systemctl --failed --no-legend
echo "== unattended ==";       systemctl is-active unattended-upgrades
echo "== last logins ==";      last -n 5</code></pre>
<div class="out">== reboot needed? ==
no
== listening publicly ==
LISTEN 0  511   0.0.0.0:80    0.0.0.0:*  users:(("nginx",pid=812,fd=6))
LISTEN 0  511   0.0.0.0:443   0.0.0.0:*  users:(("nginx",pid=812,fd=7))
LISTEN 0  4096  0.0.0.0:22    0.0.0.0:*  users:(("sshd",pid=744,fd=3))
== ssh password auth ==
passwordauthentication no
== disk ==
/dev/vda1        79G   31G   45G  41% /
== failed units ==
== unattended ==
active
== last logins ==
deploy   pts/0   203.0.113.55  Fri Aug 22 17:58   still logged in</div>
<p>Three lines and no ports you did not expect, <code>passwordauthentication no</code>, and an empty <code>--failed</code> list. That is what a healthy server looks like, and it takes five seconds to confirm.</p>

<h3>What is NOT worth your time</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Moving SSH to port 2222</span><span class="v">Cuts log noise substantially, stops zero determined attackers, and adds a flag to every <code>ssh</code>, <code>scp</code> and deploy script forever. Defensible for quiet logs; not security. If you do it, add <code>Port</code> to the firewall BEFORE reloading sshd — and on Ubuntu 22.10 and later, reloading sshd does NOT change the port: you need <code>daemon-reload</code> then <code>restart ssh.socket</code> (the ssh.socket section in Step 1).</span></div>
  <div class="kv"><span class="k">fail2ban on a key-only server</span><span class="v">Genuinely useful when passwords are enabled. Once <code>PasswordAuthentication no</code> is set, it is banning IPs that could never have got in. Keep it if you like tidy logs; do not mistake it for the thing protecting you.</span></div>
  <div class="kv"><span class="k">Disabling ping</span><span class="v">Breaks your own monitoring and diagnostics (Lesson 9.1) to hide from a scan that will find the open port anyway.</span></div>
  <div class="kv"><span class="k">Root password complexity rules</span><span class="v">Irrelevant once root login is off and passwords are off. Effort spent here is effort not spent on backups.</span></div>
  <div class="kv"><span class="k">What IS worth it</span><span class="v">Keys, no root login, updates applied, a firewall that denies by default, database bound to localhost, secrets out of the repo, and a restore you have actually performed. That list is short because it is the list that matters.</span></div>
</div>


<h3>SSH and fail2ban check commands</h3>
<table>
<tr><th>Command</th><th>Answers</th><th>Note</th></tr>
<tr><td><code>sudo sshd -t</code></td><td>Can the config be parsed?</td><td>Silent + exit 0 = fine; errors name the exact file and line, exit 255</td></tr>
<tr><td><code>sudo sshd -T</code></td><td>What REAL values apply?</td><td>After every drop-in and first-wins; does NOT apply <code>Match</code> blocks</td></tr>
<tr><td><code>sudo sshd -T -C user=…,host=…,addr=…</code></td><td>Values for ONE specific connection</td><td>Applies <code>Match</code></td></tr>
<tr><td><code>sudo ss -tlnp | grep sshd</code> · <code>ssh.socket</code></td><td>Which port is REALLY open?</td><td>Ubuntu 22.10+: the process column shows <code>systemd</code></td></tr>
<tr><td><code>sudo fail2ban-client status [sshd]</code></td><td>Which jails are on, which IPs are banned</td><td></td></tr>
<tr><td><code>sudo fail2ban-client get sshd maxretry</code></td><td>The value of one option in use</td><td>measured: <code>3</code>; <code>bantime</code> → <code>3600</code></td></tr>
<tr><td><code>sudo fail2ban-client set sshd unbanip IP</code></td><td>Unban one IP</td><td></td></tr>
</table>

<h3>Try it step by step: the first-wins rule in a container</h3>
<p>In the <code>lab-sd</code> container (Lesson 11.1, with <code>openssh-server</code> installed; create <code>/run/sshd</code> if <code>sshd -T</code> complains it is missing):</p>
<pre><code class="language-bash">mkdir -p /run/sshd
cd /etc/ssh/sshd_config.d
echo 'PasswordAuthentication yes' &gt; 50-cloud-init.conf
printf 'PasswordAuthentication no\\nPermitRootLogin no\\n' &gt; 99-hardening.conf
sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
mv 99-hardening.conf 01-hardening.conf
sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '</code></pre>
<div class="out">permitrootlogin no
passwordauthentication yes
permitrootlogin no
passwordauthentication no</div>
<p>Then repeat the <code>ssh.socket</code> sequence from Step 1 with port 2222, read <code>ss -tlnp</code> at each step, and delete <code>02-port.conf</code> + <code>daemon-reload</code> + <code>restart ssh.socket</code> to get port 22 back.</p>

<h3>How macOS and WSL differ</h3>
<p>On a Mac (measured on macOS 27, OpenSSH 10.3p1) the same idea appears under another name: <code>/etc/ssh/sshd_config</code> also has <code>Include /etc/ssh/sshd_config.d/*</code> with a ready-made <code>100-macos.conf</code> (<code>UsePAM yes</code>, <code>AcceptEnv LANG LC_*</code>), and <code>sshd</code> is also socket-activated — but by <strong>launchd</strong>: <code>/System/Library/LaunchDaemons/ssh.plist</code> has a <code>Sockets</code> block with <code>SockServiceName = ssh</code>, switched on and off by Remote Login in System Settings. A Mac has no <code>ufw</code> or <code>fail2ban</code>. WSL2 with systemd on behaves exactly like Ubuntu (<code>ssh.socket</code> too); but WSL's ports sit behind the Windows host, so whether outsiders can reach them also depends on Windows' firewall and port forwarding.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team's VPS was just created from a cloud image; the team lead "turned passwords off" with a <code>99-hardening.conf</code> file but the log is still full of <code>Failed password</code>. In the <code>lab-sd</code> container:</p><ol>
<li>Recreate that setup (<code>50-cloud-init.conf</code> = yes, <code>99-hardening.conf</code> = no) and prove with <code>sshd -T</code> that passwords are STILL on. Fix it by renaming, prove it again.</li>
<li>Add <code>Match User deploy</code> / <code>PasswordAuthentication yes</code> in a drop-in; show that <code>sshd -T</code> does not see it while <code>sshd -T -C user=deploy,host=x,addr=203.0.113.5</code> does. Remove that drop-in.</li>
<li>Move SSH to port 2222 in the safe order (keeping <code>Port 22</code>), prove with <code>ss -tlnp</code> that BOTH ports listen, then put it back.</li>
<li>Install fail2ban with <code>maxretry = 3</code>, <code>ignoreself = false</code>; run <code>ssh -o BatchMode=yes khongco@127.0.0.1 true</code> three times; read <code>fail2ban-client status sshd</code>; unban.</li></ol>
<p><strong>Done when:</strong> step 1 has the <code>yes</code> → <code>no</code> pair; step 2 shows <code>no</code> and <code>yes</code> for the same config; step 3 has two <code>LISTEN</code> lines, <code>:22</code> and <code>:2222</code>; step 4 shows <code>Banned IP list: 127.0.0.1</code> and an empty list after <code>unbanip</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hardening</span><span class="v">Shrinking a machine's attack surface: turn off what is unused, tighten what must stay open.</span></div>
  <div class="kv"><span class="k">Brute force</span><span class="v">Automated trial of many passwords/usernames — what you see in sshd's journal.</span></div>
  <div class="kv"><span class="k">Drop-in</span><span class="v">A file in <code>sshd_config.d/</code>; for sshd the FIRST value read wins, so the name that sorts first wins.</span></div>
  <div class="kv"><span class="k">Socket activation</span><span class="v">systemd (or launchd on a Mac) holds the port and starts the service only when a connection arrives.</span></div>
  <div class="kv"><span class="k">Jail (fail2ban)</span><span class="v">One rule set: which log to read, which failures to count, how and how long to ban.</span></div>
  <div class="kv"><span class="k">Unattended upgrades</span><span class="v">The Ubuntu package that installs security patches daily through the <code>apt-daily-upgrade</code> timer.</span></div>
  <div class="kv"><span class="k">Allowlist</span><span class="v"><code>AllowUsers</code>, <code>ignoreip</code>: only what is on the list gets through / is exempt.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Key-only SSH (<code>PasswordAuthentication no</code>) is the layer that stops password probing; every other layer sits behind it.</li>
<li>sshd drop-ins: the FIRST value wins ⇒ name yours <code>01-</code>, verify with <code>sshd -T</code> — and <code>-C</code> when there is a <code>Match</code>.</li>
<li>Ubuntu 22.10+: <code>ssh.socket</code> owns the SSH port; changing <code>Port</code> needs <code>daemon-reload</code> + <code>restart ssh.socket</code>, firewall opened FIRST.</li>
<li>fail2ban counts failures in the journal and bans IPs with nftables; edit <code>jail.local</code>, always set <code>ignoreip</code>.</li>
<li>unattended-upgrades is on by default, runs from a timer at 6:00 machine time, takes security origins only; a new kernel needs a reboot.</li>
<li>Keep one SSH session open and test every change from a second terminal.</li>
</ul>

<a class="link-card" href="https://github.com/fail2ban/fail2ban" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">fail2ban — source and documentation</span><span class="lc-sub">README, the list of built-in jails and how to write filters — read before Chapter 14.4.</span></span>
</a>
<a class="link-card" href="https://documentation.ubuntu.com/server/how-to/software/automatic-updates/" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Server — automatic updates</span><span class="lc-sub">The official guide to <code>unattended-upgrades</code>: allowed origins, automatic reboot, mail notifications.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/security-introduction" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Server — security documentation</span><span class="lc-sub">The vendor's own guidance for users, SSH, firewalls and automatic updates. Matches the distribution you are actually running, which most hardening blog posts do not.</span></span>
</a>
<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/en/man5/sshd_config.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">Every directive with its default. Read the <code>Include</code> and <code>Match</code> sections carefully — they are the reason <code>sshd -T</code> exists and the reason reading the file can mislead you.</span></span>
</a>
<a class="link-card" href="https://wiki.debian.org/UnattendedUpgrades" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">UnattendedUpgrades — Debian wiki</span><span class="lc-sub">Applies directly to Ubuntu. Covers origins, blacklists, the reboot options and how to test without waiting for the timer.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: harden a server without locking yourself out</span><span class="lc-sub">Graded exercises: fix a drop-in that silently re-enables password login, repair <code>authorized_keys</code> permissions from the sshd log alone, add swap that survives a reboot, and run the five-minute audit on a machine with three deliberate problems.</span></span>
</a>

<div class="pitfall"><strong>Pitfall:</strong> the fastest way to lose a server is to change SSH config and firewall rules in the same breath, then disconnect. <code>ufw enable</code> without an SSH rule, an <code>AllowUsers</code> line with a typo, a <code>Port</code> change the firewall does not know about — each of these is fatal only because you closed the session that could have fixed it. The rule that makes all of them survivable: <strong>never close a working SSH session until a NEW one has connected successfully</strong>. If you must automate a risky change, schedule an undo first: <code>echo 'ufw disable' | sudo at now + 10 minutes</code>, then cancel it once you have confirmed you are still in.</div>
<p class="note-ct"><strong>Three things to remember.</strong> Key-only authentication is the single change that ends the attacks you saw in the journal at the top of this lesson — everything else on the list is defence in depth behind it. Verify with <code>sshd -T</code> rather than by reading a config file, because drop-ins and first-wins ordering make the files lie. And the difference between a hardened server and a hardened server that is still up tomorrow is one habit: a second terminal, open, connected, before you touch anything.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Gia cố một máy chủ: giờ đầu tiên, và nếp thường ngày sau đó</h2>
<p class="lead">Một VPS mới toanh có địa chỉ IP công khai bắt đầu nhận những lượt thử đăng nhập SSH trong vòng vài PHÚT. Không phải "rồi sẽ có" — vài phút. Chúng tự động, chúng liên tục, và chúng đang thử <code>root</code> với một cuốn từ điển. Tất cả những chuyện đó chẳng nghĩa lý gì nếu bạn bỏ ra hai mươi phút làm năm việc cụ thể, và có nghĩa lý toàn bộ nếu bạn không làm.</p>
<p>Bài này chính là năm việc đó, cộng thêm một nhúm việc vặt giữ cho máy chủ khoẻ mạnh về sau. Nó cố ý ít lý thuyết. Mọi thứ ở đây bạn sẽ gõ trên một cái máy thật ngay trong giờ đầu tiên sở hữu nó.</p>

<h3>Internet đang làm gì với cái máy của bạn</h3>
${slide('lx-11', 16, 'Sáu lớp phòng thủ cho một VPS công khai')}
<pre><code class="language-bash"><span class="tok-comment"># Đăng nhập SSH thất bại — trên một VPS công khai mới, chạy cái này sau một giờ</span>
sudo journalctl -u ssh --since '1 hour ago' | grep -c 'Failed password'
sudo journalctl -u ssh --since '1 hour ago' | grep 'Invalid user' | tail -5
sudo lastb | head -5              <span class="tok-comment"># nhật ký đăng nhập hỏng, cần /var/log/btmp</span></code></pre>
<div class="out">$ sudo journalctl -u ssh --since '1 hour ago' | grep -c 'Failed password'
1477
$ sudo journalctl -u ssh --since '1 hour ago' | grep 'Invalid user' | tail -5
Aug 22 17:12:04 vps-1 sshd[9912]: Invalid user admin from 45.148.10.62 port 51234
Aug 22 17:12:11 vps-1 sshd[9918]: Invalid user test from 218.92.0.115 port 33188
Aug 22 17:13:02 vps-1 sshd[9931]: Invalid user ubuntu from 92.255.85.107 port 40022
Aug 22 17:13:44 vps-1 sshd[9944]: Invalid user postgres from 45.148.10.62 port 39900
Aug 22 17:14:20 vps-1 sshd[9950]: Invalid user oracle from 141.98.11.29 port 62112</div>
<p>Một nghìn bốn trăm lượt thử trong một giờ, trên một cái máy không ai biết là có tồn tại. Đây là bức xạ nền của internet công cộng, và đó là lý do "chẳng ai tìm ra cái máy chủ bé tí của tôi đâu" không phải một kế hoạch. Tin tốt: từng lượt một trong số đó là thử <em>MẬT KHẨU</em>, và bước một ngay dưới đây làm cho mật khẩu trở thành bất khả.</p>

<h3>Bước 1 — chỉ khoá SSH, và chứng minh trước khi ngắt kết nối</h3>
${slide('lx-11', 17, 'sshd: giá trị ĐẦU TIÊN thắng — 01- thắng 50-cloud-init')}
<p>Chương 9 đã nói về việc tạo khoá và chép nó lên. Giờ bạn tắt mật khẩu đi. Nguy hiểm thì rõ rồi: làm sai, đóng cửa sổ terminal, thế là mất máy — nhà cung cấp VPS có bán cho bạn một cái console, nhưng không phải console của nhà nào cũng chạy tử tế, và có nhà còn chẳng có.</p>
<pre><code class="language-bash"><span class="tok-comment"># Trên laptop của bạn, nếu chưa làm</span>
ssh-keygen -t ed25519 -C "you@laptop"
ssh-copy-id deploy@203.0.113.10

<span class="tok-comment"># Chứng minh khoá chạy được TRƯỚC khi đổi bất cứ thứ gì</span>
ssh -o PasswordAuthentication=no deploy@203.0.113.10 'echo key-login-ok'</code></pre>
<div class="out">key-login-ok</div>
<p>Cái cờ đó ép phía máy khách từ chối lùi về mật khẩu, nên thành công nghĩa là khoá THẬT SỰ chạy được. Chỉ tới lúc đó bạn mới sửa cấu hình phía máy chủ — và sửa bằng một file <strong>drop-in</strong>, đừng băm vào file chính:</p>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/01-hardening.conf   ← 01-, KHÔNG phải 99- (xem bẫy ngay dưới)</span>
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code class="language-bash">sudo sshd -t                       <span class="tok-comment"># KIỂM. Cấu hình tốt thì nó không in gì.</span>
sudo systemctl reload ssh          <span class="tok-comment"># reload, không phải restart — phiên đang mở sống sót</span></code></pre>
<div class="callout warn"><strong>Hãy GIỮ phiên cũ mở và thử từ một terminal THỨ HAI.</strong> Đây là toàn bộ quy trình an toàn và nó tốn mười giây: phiên SSH hiện tại của bạn vẫn nối qua một lần <code>reload</code> kể cả khi cấu hình mới hỏng, nên nó là sợi dây cứu mạng. Mở một terminal mới, kết nối, và chỉ khi cái đó chạy được thì mới đóng cái đầu tiên. Làm ngược lại là cách người ta phải dựng lại cả một máy chủ vì đúng một lỗi gõ. <code>sshd -t</code> bắt lỗi cú pháp; nó KHÔNG bắt được chuyện "bạn vừa nhốt chính tên đăng nhập của mình ở ngoài".</div>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">PasswordAuthentication no</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cái chấm dứt các cuộc tấn công</span><span class="lz-nsub">Một lượt dò mật khẩu nhắm vào máy chủ chỉ nhận khoá thì không thể thành công ở bất kỳ tốc độ nào. 1.477 lượt kia biến thành 1.477 lượt từ chối tức thì, chưa từng chạm tới một phép kiểm mật khẩu nào.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">PermitRootLogin no</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bỏ đi cái tên đăng nhập ai cũng đoán</span><span class="lz-nsub">Bạn đăng nhập là <code>deploy</code> rồi dùng <code>sudo</code> (Bài 4.4). Giờ kẻ tấn công phải đoán ĐƯỢC tên người dùng VÀ giữ được khoá riêng. Nó cũng cho bạn dấu vết kiểm toán: <code>sudo</code> ghi lại ai đã làm gì.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">AllowUsers deploy</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một danh sách cho phép tường minh</span><span class="lz-nsub">Mọi tài khoản khác — kể cả tài khoản dịch vụ mà một gói phần mềm tạo ra sau này — hoàn toàn không đăng nhập được, dù có khoá hợp lệ. Rẻ, và nó chặn cả một lớp bất ngờ.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">ClientAliveInterval 300</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Không phải bảo mật — là dễ chịu</span><span class="lz-nsub">Chặn chuyện phiên của bạn đơ ra sau một cái NAT hay ngắt kết nối rảnh rỗi. Đi cặp với <code>ServerAliveInterval</code> ở phía máy khách (Bài 9.3).</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment"># Xác nhận máy chủ THỰC SỰ hiểu thành gì, không phải thứ bạn nghĩ mình đã viết</span>
sudo sshd -T | grep -iE '^(passwordauthentication|permitrootlogin|pubkeyauthentication|allowusers|port) '</code></pre>
<div class="out">port 22
permitrootlogin no
pubkeyauthentication yes
passwordauthentication no
allowusers deploy</div>
<p><code>sshd -T</code> đổ ra cấu hình đã được giải quyết đầy đủ, gồm cả drop-in lẫn giá trị mặc định. Đó là câu trả lời trung thực duy nhất cho "đăng nhập bằng mật khẩu đã tắt thật chưa?" — đọc file cấu hình có thể nói dối bạn, vì một khối <code>Match</code> hay một drop-in đứng sau có thể ghi đè thứ bạn vừa đọc.</p>
<div class="pitfall"><strong>Bẫy:</strong> trên Ubuntu 22.04 trở lên, <code>/etc/ssh/sshd_config</code> mở đầu bằng <code>Include /etc/ssh/sshd_config.d/*.conf</code>, và <strong>trong file này thiết lập ĐẦU TIÊN thắng</strong>, không phải cái cuối cùng. Nên một drop-in tên <code>50-cloud-init.conf</code> chứa <code>PasswordAuthentication yes</code> — thứ mà nhiều ảnh đám mây có sẵn — thắng phần bạn sửa ở dưới trong file chính, và thắng luôn một drop-in tên <code>99-…</code>, vì <code>50</code> xếp trước. Hãy đặt tên file của bạn sao cho nó xếp SỚM, hoặc xoá cái dòng phiền phức trong drop-in của cloud-init. Rồi kiểm bằng <code>sshd -T</code> — phép kiểm duy nhất sống sót qua cái luật này.</div>
<p>Đo thật trên Ubuntu 24.04 (OpenSSH 9.6p1), đúng cảnh ảnh đám mây hay gặp — <code>50-cloud-init.conf</code> nói <code>yes</code>, file của bạn nói <code>no</code>:</p>
<div class="out">$ ls /etc/ssh/sshd_config.d/
50-cloud-init.conf  99-hardening.conf
$ sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
permitrootlogin no
passwordauthentication yes
$ sudo mv /etc/ssh/sshd_config.d/99-hardening.conf /etc/ssh/sshd_config.d/01-hardening.conf
$ sudo sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
permitrootlogin no
passwordauthentication no</div>
<p>Để ý <code>permitrootlogin no</code> đã ăn ngay cả khi file tên <code>99-</code>: cloud-init không khai dòng đó nên chẳng ai tranh. <strong>Nửa ăn nửa trượt là dấu hiệu của va chạm THỨ TỰ</strong>, không phải lỗi cú pháp — lỗi cú pháp thì <code>sshd -t</code> nói thẳng:</p>
<div class="out">$ sudo sshd -t
/etc/ssh/sshd_config.d/03-typo.conf: line 1: Bad configuration option: PasswordAuthentcation
/etc/ssh/sshd_config.d/03-typo.conf: terminating, 1 bad configuration options
$ echo $?
255</div>
<p><strong>Một giới hạn của <code>sshd -T</code>:</strong> nó in cấu hình cho một kết nối "chung chung", nên các khối <code>Match</code> không được tính. Có <code>Match User deploy</code> / <code>PasswordAuthentication yes</code> thì <code>sshd -T</code> vẫn in <code>no</code>; phải hỏi đúng kết nối bằng <code>-C</code>:</p>
<div class="out">$ sudo sshd -T | grep ^passwordauth
passwordauthentication no
$ sudo sshd -T -C user=deploy,host=laptop,addr=203.0.113.5 | grep ^passwordauth
passwordauthentication yes</div>

<h3>Đổi cổng SSH trên Ubuntu 24.04: cổng do ssh.socket giữ</h3>
${slide('lx-11', 18, 'Ubuntu 24.04: ssh.socket giữ cổng SSH')}
<p>Từ Ubuntu 22.10, <code>sshd</code> được <strong>kích hoạt theo socket</strong> (socket activation): chính systemd nghe cổng 22 qua unit <code>ssh.socket</code> và chỉ khởi chạy <code>sshd</code> khi có kết nối tới (Chương 9 đã gặp chuyện này với cổng 993). Hệ quả cho người gia cố máy: đổi <code>Port</code> rồi <code>restart ssh</code> thì <code>sshd -T</code> nói cổng mới, còn cổng thật vẫn là 22. Đo lại trong container Ubuntu 24.04 chạy systemd thật:</p>
<div class="out">$ systemctl is-enabled ssh.socket ssh.service
enabled
disabled
$ echo 'Port 2222' | sudo tee /etc/ssh/sshd_config.d/02-port.conf &gt;/dev/null
$ sudo systemctl restart ssh; sudo sshd -T | grep ^port
port 2222
$ sudo ss -tlnp | grep -E ':22 |:2222 '
LISTEN 0      4096         0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=902,fd=3),("systemd",pid=1,fd=57))
LISTEN 0      4096            [::]:22            [::]:*    users:(("sshd",pid=902,fd=4),("systemd",pid=1,fd=58))
$ sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart ssh.socket
$ sudo ss -tlnp | grep -E ':22 |:2222 '
LISTEN 0      4096         0.0.0.0:2222       0.0.0.0:*    users:(("systemd",pid=1,fd=51))
LISTEN 0      4096            [::]:2222          [::]:*    users:(("systemd",pid=1,fd=52))
$ cat /run/systemd/generator/ssh.socket.d/addresses.conf
# Automatically generated by sshd-socket-generator

[Socket]
ListenStream=
ListenStream=0.0.0.0:2222
ListenStream=[::]:2222</div>
<p>Cơ chế: một <em>generator</em> đọc <code>Port</code>/<code>ListenAddress</code> trong <code>sshd_config</code> mỗi lần <code>daemon-reload</code> và sinh ra file drop-in cho <code>ssh.socket</code>; phải <code>restart ssh.socket</code> nó mới mở cổng mới. Vì <code>Port 2222</code> một mình THAY cổng 22 (không cộng thêm), thứ tự an toàn là: <code>ufw allow 2222/tcp</code> → sửa <code>Port</code> (tạm giữ cả <code>Port 22</code>) → <code>daemon-reload</code> → <code>restart ssh.socket</code> → đăng nhập thử cổng mới từ terminal THỨ HAI → rồi mới bỏ cổng 22. Và một chi tiết đo được luôn: khi chưa có kết nối nào, <code>ssh.service</code> chưa chạy nên <code>systemctl reload ssh</code> báo <code>ssh.service is not active, cannot reload.</code> — trên một VPS bạn đang SSH vào thì nó đã chạy, reload bình thường.</p>

<h3>Bước 2 — một người dùng không phải root, có sudo</h3>
<pre><code class="language-bash">sudo adduser deploy                       <span class="tok-comment"># tương tác; đặt mật khẩu và tạo thư mục nhà</span>
sudo usermod -aG sudo deploy              <span class="tok-comment"># -aG: NỐI THÊM, đừng bao giờ -G trần (Bài 4.4)</span>
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys</code></pre>
<div class="callout"><strong>Mấy con số quyền đó không phải tuỳ chọn.</strong> sshd từ chối một cái khoá nếu <code>~/.ssh</code> cho nhóm hay cho mọi người ghi được, hoặc nếu <code>authorized_keys</code> ai cũng đọc được — và nó từ chối <em>trong im lặng dưới góc nhìn của máy khách</em>, vì thế "cái khoá tự dưng không chạy" thường là một vấn đề <code>chmod</code>. <code>700</code> cho thư mục, <code>600</code> cho file, thuộc sở hữu của đúng người. Xác nhận từ phía máy chủ bằng <code>sudo journalctl -u ssh -n 20</code> — nó nói <code>Authentication refused: bad ownership or modes</code> bằng tiếng Anh rõ ràng.</div>
<p>Với script triển khai và CI, một lời hỏi mật khẩu giữa một lượt chạy tự động là một cú TREO, không phải một cú hỏng. Hãy cấp một luật không-mật-khẩu hẹp thay vì <code>NOPASSWD: ALL</code> bao trùm:</p>
<pre><code><span class="tok-comment"># sudo visudo -f /etc/sudoers.d/deploy   ← LUÔN dùng visudo; nó kiểm trước khi lưu</span>
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart app, /usr/bin/systemctl reload nginx</code></pre>
<div class="pitfall"><strong>Bẫy:</strong> đừng bao giờ sửa bất cứ thứ gì dưới <code>/etc/sudoers.d/</code> bằng một trình soạn thảo thường. Một lỗi cú pháp trong file sudoers làm hỏng <code>sudo</code> cho <strong>TẤT CẢ MỌI NGƯỜI, NGAY LẬP TỨC</strong> — kể cả khả năng sửa lại của chính bạn — và trên một cái máy đã tắt đăng nhập root thì đó là việc phải mở console cứu hộ. <code>visudo</code> phân tích file trước khi cài đặt nó và từ chối lưu rác. Thêm nữa: file trong <code>/etc/sudoers.d/</code> có dấu chấm trong tên thì bị bỏ qua, y hệt <code>cron.d</code> (Bài 11.2).</div>

<h3>Bước 3 — tường lửa</h3>
<p>Bài 9.5 đã nói kỹ về <code>ufw</code>. Bản ba dòng, cho đủ bộ:</p>
<pre><code class="language-bash">sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH                    <span class="tok-comment"># làm cái này TRƯỚC khi enable, lần nào cũng vậy</span>
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status verbose</code></pre>
<div class="out">Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80,443/tcp                 ALLOW IN    Anywhere</div>
<div class="callout warn"><strong>Docker công bố cổng VƯỢT QUA ufw.</strong> Một container khởi chạy với <code>-p 5432:5432</code> tự ghi luật của nó thẳng vào chuỗi iptables <code>DOCKER</code>, và chuỗi đó được tra <em>TRƯỚC</em> chuỗi của ufw — nên cơ sở dữ liệu của bạn đang nằm trên internet công cộng trong khi <code>ufw status</code> chẳng hiện gì bất thường. Hãy gắn vào localhost thay vì thế: <code>-p 127.0.0.1:5432:5432</code>. Kiểm xem thứ gì thật sự đang lắng nghe trên giao diện công khai bằng <code>sudo ss -tlnp</code> rồi nhìn cột Address — <code>0.0.0.0:5432</code> là phơi ra, <code>127.0.0.1:5432</code> thì không.</div>

<h3>Bước 3b — fail2ban, ở mức nền</h3>
${slide('lx-11', 19, 'fail2ban: đếm lần hỏng, cấm IP bằng nftables')}
<p><strong>fail2ban</strong> đọc log, đếm số lần đăng nhập hỏng của từng địa chỉ IP, và khi một IP vượt ngưỡng trong một khoảng thời gian thì thêm một luật tường lửa cấm nó một lúc. Nó KHÔNG thay được Bước 1 (một khi mật khẩu đã tắt, những lượt dò kia vốn đã không thể thành công — xem mục "Những thứ KHÔNG đáng bỏ thời gian" cuối bài), nhưng nó cắt tiếng ồn trong log và làm chậm những kẻ dò dai. Bài này dạy mức nền; Chương 14.4 đào sâu (jail cho nginx, bộ lọc tự viết).</p>
<pre><code class="language-bash">sudo apt install -y fail2ban
cat /etc/fail2ban/jail.d/defaults-debian.conf       <span class="tok-comment"># mặc định của Ubuntu</span>
sudo tee /etc/fail2ban/jail.local &gt;/dev/null &lt;&lt;'EOF'
[sshd]
enabled  = true
maxretry = 3
findtime = 10m
bantime  = 1h
EOF
sudo systemctl restart fail2ban</code></pre>
<div class="out">[DEFAULT]
banaction = nftables
banaction_allports = nftables[type=allports]
backend = systemd

[sshd]
enabled = true</div>
<table>
<tr><th>Tuỳ chọn</th><th>Nghĩa</th><th>Mặc định (<code>jail.conf</code>)</th></tr>
<tr><td><code>maxretry</code></td><td>Số lần hỏng cho phép</td><td>5</td></tr>
<tr><td><code>findtime</code></td><td>…trong khoảng thời gian này</td><td>10m</td></tr>
<tr><td><code>bantime</code></td><td>Cấm bao lâu</td><td>10m</td></tr>
<tr><td><code>ignoreip</code></td><td>IP không bao giờ bị cấm — thêm IP nhà/trường của bạn</td><td>(trống; <code>ignoreself = true</code>)</td></tr>
<tr><td><code>backend</code> · <code>banaction</code></td><td>Đọc log ở đâu · cấm bằng gì</td><td>Ubuntu 24.04: <code>systemd</code> (journal) · <code>nftables</code></td></tr>
</table>
<p>Đo thật: bốn lượt đăng nhập bằng tên người dùng không tồn tại từ cùng một địa chỉ (bài lab tạm đặt <code>ignoreself = false</code> để tự cấm được chính 127.0.0.1):</p>
<div class="out">$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	4
|  &#96;- Journal matches:	_SYSTEMD_UNIT=sshd.service + _COMM=sshd
&#96;- Actions
   |- Currently banned:	1
   |- Total banned:	1
   &#96;- Banned IP list:	127.0.0.1
$ sudo nft list ruleset | grep -A2 'chain f2b-chain'
	chain f2b-chain {
		type filter hook input priority filter - 1; policy accept;
		tcp dport 22 ip saddr @addr-set-sshd reject with icmp port-unreachable
$ ssh x@127.0.0.1
ssh: connect to host 127.0.0.1 port 22: Connection refused
$ sudo fail2ban-client set sshd unbanip 127.0.0.1
1</div>
<div class="pitfall co-tieu-de"><strong>Luôn đặt <code>ignoreip</code> cho IP của bạn, và sửa <code>jail.local</code> chứ đừng sửa <code>jail.conf</code>.</strong> Gõ sai khoá SSH ba lần từ mạng trường là tự cấm mình một giờ — từ đúng chỗ bạn cần vào. <code>jail.conf</code> bị ghi đè khi nâng cấp gói; <code>jail.local</code> (và <code>jail.d/*.local</code>) thì không. Và nhớ luật cấm gắn với cổng (<code>tcp dport 22</code>): đổi cổng SSH mà không khai <code>port =</code> trong jail thì fail2ban cấm nhầm cổng.</div>

<h3>Bước 4 — cập nhật bảo mật tự động</h3>
${slide('lx-11', 20, 'unattended-upgrades chạy bằng timer lúc 6 giờ')}
<p>Đo trên Ubuntu 24.04 mới cài gói: nó đã bật sẵn, và bản thân nó chạy bằng một <strong>timer</strong> của systemd (Bài 11.2) — lúc 6 giờ sáng giờ MÁY, lệch ngẫu nhiên tới 60 phút, có chạy bù:</p>
<div class="out">$ systemctl is-enabled unattended-upgrades apt-daily-upgrade.timer
enabled
enabled
$ systemctl cat apt-daily-upgrade.timer | grep -A3 '\\[Timer\\]'
[Timer]
OnCalendar=*-*-* 6:00
RandomizedDelaySec=60m
Persistent=true
$ sudo unattended-upgrade --dry-run --debug 2&gt;&amp;1 | grep 'Allowed origins'
Allowed origins are: o=Ubuntu,a=noble, o=Ubuntu,a=noble-security, o=UbuntuESMApps,a=noble-apps-security, o=UbuntuESM,a=noble-infra-security</div>
<p>Máy UTC ⇒ "6:00" là 13:00 giờ Việt Nam — cùng chuyện lệch múi giờ ở Bài 11.2. Và danh sách nguồn mặc định gồm <code>noble</code> (bản phát hành gốc, không đổi sau ngày phát hành) cùng các nguồn <code>-security</code>, KHÔNG có <code>noble-updates</code>.</p>
<p>Hai mươi phút đáng giá nhất trong danh sách này, vì nó tiếp tục sinh lời trong lúc bạn ngủ. Ubuntu có sẵn cơ chế; bạn chỉ phải bật nó lên và quyết xem mình gan tới đâu với chuyện khởi động lại máy.</p>
<pre><code class="language-bash">sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   <span class="tok-comment"># hoặc sửa mấy file dưới</span>
systemctl status unattended-upgrades
cat /etc/apt/apt.conf.d/20auto-upgrades</code></pre>
<div class="out">APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";</div>
<pre><code class="language-bash"><span class="tok-comment"># /etc/apt/apt.conf.d/50unattended-upgrades — những dòng đáng đổi</span>
Unattended-Upgrade::Allowed-Origins {
        "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";   <span class="tok-comment"># không thì /boot đầy</span>
Unattended-Upgrade::Automatic-Reboot "false";               <span class="tok-comment"># xem ghi chú dưới</span>
Unattended-Upgrade::Automatic-Reboot-Time "04:00";
Unattended-Upgrade::Mail "you@example.com";</code></pre>
<pre><code><span class="tok-comment"># Chạy thử — cho thấy chính xác nó SẼ cài gì, không đổi gì cả</span>
sudo unattended-upgrade --dry-run --debug 2&gt;&amp;1 | tail -20</code></pre>
<div class="out">Checking: openssl (["&lt;Origin component:'main' archive:'noble-security' ..."])
Checking: libssl3t64 (["&lt;Origin component:'main' archive:'noble-security' ..."])
Packages that will be upgraded: libssl3t64 openssl
Writing dpkg log to /var/log/unattended-upgrades/unattended-upgrades-dpkg.log</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ bảo mật, luôn luôn</span><span class="v">Giữ <code>-security</code> là nguồn duy nhất được phép. Kéo tự động cả <code>-updates</code> nghĩa là một thay đổi tính năng có thể đáp xuống máy production của bạn lúc 6 giờ sáng mà không báo trước.</span></div>
  <div class="kv"><span class="k">Remove-Unused-Kernel-Packages</span><span class="v">Đặt là <code>true</code>. <code>/boot</code> là một phân vùng riêng nhỏ trên nhiều ảnh, và ba bốn cái nhân sót lại là đầy — sau đó <code>apt</code> hỏng ở MỌI lần nâng cấp về sau với một lỗi khó hiểu về <code>initramfs</code>.</span></div>
  <div class="kv"><span class="k">Automatic-Reboot</span><span class="v">Đây mới là chỗ đánh đổi thật. <code>true</code> nghĩa là các bản vá nhân thật sự có hiệu lực và ứng dụng của bạn bị khởi động lại lúc 04:00 không báo trước. <code>false</code> nghĩa là bạn phải tự khởi động lại — và phần lớn người ta không bao giờ làm, nên cái nhân đã vá nằm im trên đĩa hàng tháng trời.</span></div>
  <div class="kv"><span class="k">Đường giữa trung thực</span><span class="v">Để <code>false</code>, rồi đặt một lời nhắc hằng tuần trong lịch để kiểm <code>/var/run/reboot-required</code>. Nếu ứng dụng của bạn KHÔNG sống nổi qua một cú khởi động lại không báo trước lúc 04:00 thì đó là một vấn đề về khả năng chịu đựng, đáng sửa theo cách của riêng nó (Bài 11.1: <code>Restart=always</code>).</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Máy này có cần khởi động lại ngay bây giờ không?</span>
[ -f /var/run/reboot-required ] &amp;&amp; cat /var/run/reboot-required{,.pkgs}</code></pre>
<div class="out">*** System restart required ***
linux-image-6.8.0-45-generic
linux-base</div>
<p><code>needrestart</code> (có sẵn trên Ubuntu Server) trả lời câu hỏi hẹp hơn — những <em>DỊCH VỤ</em> nào đang chạy dựa trên các thư viện từ đó đã được vá, và vì thế cần khởi động lại kể cả khi nhân thì không:</p>
<pre><code>sudo needrestart -r l          <span class="tok-comment"># l = chỉ liệt kê, không khởi động lại gì cả</span></code></pre>
<div class="out">Services to be restarted:
 systemctl restart nginx.service
 systemctl restart postgresql@16-main.service

No containers need to be restarted.
No user sessions are running outdated binaries.
No VM guests are running outdated hypervisor (qemu) binaries on this host.</div>

<h3>Bước 5 — swap, để kẻ giết OOM chỉ là phương án cuối</h3>
<p>Bài 5.2 đã giải thích chuyện gì xảy ra khi hết bộ nhớ: nhân chọn một tiến trình và giết nó, và nó sẽ không chọn cái tiến trình mà bạn chọn. Một VPS 1–2GB không có swap rơi vào đường đó quá dễ — thường là ngay giữa một lượt <code>npm ci</code> hay <code>next build</code>, đúng là cái <code>Exited(137)</code> ngày 06/07/2026 trong chính lịch sử của dự án này.</p>
<pre><code class="language-bash">free -h                                   <span class="tok-comment"># kiểm trước — nhiều ảnh không có sẵn</span>
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile                  <span class="tok-comment"># 600, không thì mkswap cảnh báo và bạn đã rò nội dung bộ nhớ</span>
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   <span class="tok-comment"># sống sót qua khởi động lại</span>
free -h</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       612Mi       138Mi        18Mi       1.2Gi       1.1Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<pre><code class="language-bash"><span class="tok-comment"># Giảm độ hăng hái đẩy sang swap: dùng RAM trước, chỉ swap khi thật sự bị ép</span>
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swap.conf
sudo sysctl --system | grep swappiness</code></pre>
<div class="callout"><strong>Swap là một cái giảm xóc, không phải thêm RAM.</strong> Một máy chủ ĐANG dùng swap đều đặn là một máy chủ đang giãy giụa, và mỗi lần đọc đĩa lẽ ra phải là một lần đọc bộ nhớ thì chậm hơn cỡ một trăm nghìn lần. Thứ swap mua cho bạn là: một cơn tăng vọt ngắn — một lượt build, một đợt truy cập dồn, một request rò rỉ — thoái hoá thành "chậm ba mươi giây" thay vì "cơ sở dữ liệu bị giết". Hãy theo dõi <code>si</code>/<code>so</code> trong <code>vmstat 1</code>: khác 0 lâu hơn một khoảnh khắc nghĩa là bạn cần thêm RAM, không phải thêm swap.</div>

<h3>Cái đồng hồ</h3>
<p>Giờ sai là một thứ thuế gỡ lỗi bạn trả mỗi ngày mà không nhận ra: những dòng log không khớp nhau giữa hai cái máy, những cú bắt tay TLS hỏng vì chứng chỉ "chưa có hiệu lực", những công việc cron nổ lệch ba tiếng (Bài 11.2), và những JWT bị từ chối vì hết hạn.</p>
<pre><code>timedatectl
timedatectl set-timezone Asia/Ho_Chi_Minh   <span class="tok-comment"># hoặc cứ để UTC — xem dưới</span>
timedatectl show-timesync --all | head -5</code></pre>
<div class="out">               Local time: Fri 2026-08-22 18:21:07 UTC
           Universal time: Fri 2026-08-22 18:21:07 UTC
                 RTC time: Fri 2026-08-22 18:21:08
                Time zone: Etc/UTC (UTC, +0000)
System clock synchronized: yes
              NTP service: active</div>
<p>Hai thứ cần kiểm: <code>System clock synchronized: yes</code> và <code>NTP service: active</code>. Nếu cái nào nói không, hãy cài <code>systemd-timesyncd</code> hoặc <code>chrony</code> rồi khởi chạy nó — một cái đồng hồ không đồng bộ trôi vài giây mỗi ngày, và những cú hỏng nó gây ra trông giống MỌI THỨ trừ một vấn đề về đồng hồ.</p>
<div class="callout ok"><strong>Hãy để máy chủ ở UTC.</strong> Nó tốn của bạn đúng một phép quy đổi trong đầu khi đọc log và tiết kiệm cho bạn mọi sự mập mờ mà giờ mùa hè tạo ra — trong đó có một giờ xảy ra HAI LẦN mỗi năm, khoảng thời gian mà mốc thời gian thật sự đi ngược và "ORDER BY created_at" thôi mang nghĩa bạn tưởng. Hãy đặt múi giờ ở phía <em>HIỂN THỊ</em>, trong ứng dụng hay trong trình xem log của bạn, chứ không phải trên cái máy.</div>

<h3>Giờ đầu tiên, dưới dạng một danh sách kiểm</h3>
${slide('lx-11', 21, 'Giờ đầu tiên với một VPS mới: 8 việc')}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Cập nhật hết</span><span class="lz-t">apt update &amp;&amp; apt full-upgrade -y &amp;&amp; reboot</span><span class="lz-d">Làm trước khi bạn dựng bất cứ thứ gì lên trên, lúc khởi động lại chẳng tốn gì. Một ảnh mới thường đã tụt sau vài tuần.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Người dùng không phải root + khoá</span><span class="lz-t">adduser · usermod -aG sudo · authorized_keys 600</span><span class="lz-d">Thử đăng nhập bằng khoá từ một terminal thứ hai trước khi đi tiếp.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Khoá SSH lại</span><span class="lz-t">PasswordAuthentication no · PermitRootLogin no · sshd -t · reload</span><span class="lz-d">Giữ phiên đầu tiên mở. Xác nhận bằng <code>sshd -T</code>, đừng xác nhận bằng cách đọc file.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Tường lửa</span><span class="lz-t">ufw allow OpenSSH → allow 80,443 → enable</span><span class="lz-d">Luật SSH trước, lần nào cũng vậy. Rồi soi <code>ss -tlnp</code> tìm thứ gì đang lắng nghe trên 0.0.0.0 mà lẽ ra không nên.</span></div>
  <div class="lz-step"><span class="lz-k">5 · Cập nhật bảo mật tự động</span><span class="lz-t">unattended-upgrades + Remove-Unused-Kernel-Packages</span><span class="lz-d">Chạy thử một lần để BIẾT là nó chạy, thay vì cho rằng nó chạy.</span></div>
  <div class="lz-step"><span class="lz-k">6 · Swap + swappiness</span><span class="lz-t">file swap 2GB, vm.swappiness=10</span><span class="lz-d">Chỉ trên máy nhỏ, và chỉ khi <code>free -h</code> cho thấy chưa có. Ghi vào <code>/etc/fstab</code> không thì nó biến mất sau khi khởi động lại.</span></div>
  <div class="lz-step"><span class="lz-k">7 · Đồng hồ + tên máy</span><span class="lz-t">timedatectl · hostnamectl set-hostname</span><span class="lz-d">Một cái tên máy tử tế khiến mọi dòng log và mọi dấu nhắc nói cho bạn biết mình đang ở máy nào. <code>vps-1</code> hơn <code>ubuntu-2gb-sgp1-01</code>.</span></div>
  <div class="lz-step"><span class="lz-k">8 · Sao lưu, và một lần phục hồi</span><span class="lz-t">một timer (Bài 11.2) + một lần thử phục hồi, hôm nay</span><span class="lz-d">Bước cuối cùng, và là bước ai cũng bỏ. Một bản sao lưu bạn chưa từng phục hồi là một cái file, không phải một bản sao lưu.</span></div>
</div>
<pre><code class="language-bash"><span class="tok-comment"># Một cuộc soát năm phút, chạy được trên máy chủ nào cũng được, lúc nào cũng được</span>
echo "== cần khởi động lại? ==";   [ -f /var/run/reboot-required ] &amp;&amp; echo CÓ || echo không
echo "== đang lắng nghe công khai ==";  sudo ss -tlnp | grep -v '127.0.0.1\\|::1'
echo "== ssh có nhận mật khẩu? ==";   sudo sshd -T | grep -i '^passwordauthentication'
echo "== đĩa ==";             df -h / | tail -1
echo "== unit hỏng ==";       systemctl --failed --no-legend
echo "== unattended ==";      systemctl is-active unattended-upgrades
echo "== đăng nhập gần đây ==";  last -n 5</code></pre>
<div class="out">== cần khởi động lại? ==
không
== đang lắng nghe công khai ==
LISTEN 0  511   0.0.0.0:80    0.0.0.0:*  users:(("nginx",pid=812,fd=6))
LISTEN 0  511   0.0.0.0:443   0.0.0.0:*  users:(("nginx",pid=812,fd=7))
LISTEN 0  4096  0.0.0.0:22    0.0.0.0:*  users:(("sshd",pid=744,fd=3))
== ssh có nhận mật khẩu? ==
passwordauthentication no
== đĩa ==
/dev/vda1        79G   31G   45G  41% /
== unit hỏng ==
== unattended ==
active
== đăng nhập gần đây ==
deploy   pts/0   203.0.113.55  Fri Aug 22 17:58   still logged in</div>
<p>Ba dòng và không có cổng nào bạn không ngờ tới, <code>passwordauthentication no</code>, và một danh sách <code>--failed</code> rỗng. Đó là hình hài của một máy chủ khoẻ mạnh, và mất năm giây để xác nhận.</p>

<h3>Những thứ KHÔNG đáng bỏ thời gian</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chuyển SSH sang cổng 2222</span><span class="v">Cắt tiếng ồn trong log rất nhiều, chặn được ĐÚNG KHÔNG kẻ tấn công có chủ đích nào, và thêm một cái cờ vào mọi lệnh <code>ssh</code>, <code>scp</code> và script triển khai mãi mãi. Bảo vệ được nếu mục tiêu là log sạch; không phải bảo mật. Nếu làm thì thêm <code>Port</code> vào tường lửa TRƯỚC khi reload sshd — và trên Ubuntu 22.10 trở lên, reload sshd KHÔNG đổi cổng: phải <code>daemon-reload</code> rồi <code>restart ssh.socket</code> (phần ssh.socket ở Bước 1).</span></div>
  <div class="kv"><span class="k">fail2ban trên máy chỉ nhận khoá</span><span class="v">Thật sự hữu ích khi mật khẩu còn bật. Một khi đã đặt <code>PasswordAuthentication no</code> thì nó đang cấm những địa chỉ IP vốn không bao giờ vào được. Giữ nó nếu bạn thích log gọn gàng; đừng nhầm nó là thứ đang bảo vệ bạn.</span></div>
  <div class="kv"><span class="k">Tắt ping</span><span class="v">Phá chính hệ giám sát và chẩn đoán của bạn (Bài 9.1) để trốn một lượt quét mà đằng nào cũng tìm ra cái cổng đang mở.</span></div>
  <div class="kv"><span class="k">Luật độ phức tạp mật khẩu root</span><span class="v">Vô nghĩa một khi đăng nhập root đã tắt và mật khẩu đã tắt. Công sức đổ vào đây là công sức không đổ vào sao lưu.</span></div>
  <div class="kv"><span class="k">Thứ ĐÁNG làm</span><span class="v">Khoá, không đăng nhập root, cập nhật đã áp, một tường lửa mặc định từ chối, cơ sở dữ liệu gắn vào localhost, bí mật nằm ngoài kho mã, và một lần phục hồi bạn đã THẬT SỰ thực hiện. Danh sách đó ngắn vì nó là danh sách có ý nghĩa.</span></div>
</div>


<h3>Bảng lệnh kiểm SSH và fail2ban</h3>
<table>
<tr><th>Lệnh</th><th>Trả lời câu hỏi</th><th>Ghi chú</th></tr>
<tr><td><code>sudo sshd -t</code></td><td>File cấu hình có đọc được không?</td><td>Im lặng + mã 0 = ổn; lỗi thì nêu đúng file và dòng, mã 255</td></tr>
<tr><td><code>sudo sshd -T</code></td><td>Giá trị THẬT đang áp dụng?</td><td>Sau mọi drop-in và "đầu tiên thắng"; KHÔNG tính khối <code>Match</code></td></tr>
<tr><td><code>sudo sshd -T -C user=…,host=…,addr=…</code></td><td>Giá trị cho MỘT kết nối cụ thể</td><td>Có tính <code>Match</code></td></tr>
<tr><td><code>sudo ss -tlnp | grep sshd</code> · <code>ssh.socket</code></td><td>Cổng nào đang THẬT SỰ mở?</td><td>Ubuntu 22.10+: cột process có <code>systemd</code></td></tr>
<tr><td><code>sudo fail2ban-client status [sshd]</code></td><td>Jail nào bật, IP nào đang bị cấm</td><td></td></tr>
<tr><td><code>sudo fail2ban-client get sshd maxretry</code></td><td>Giá trị một tuỳ chọn đang dùng</td><td>đo: <code>3</code>; <code>bantime</code> → <code>3600</code></td></tr>
<tr><td><code>sudo fail2ban-client set sshd unbanip IP</code></td><td>Gỡ cấm một IP</td><td></td></tr>
</table>

<h3>Chạy thử từng bước: luật "đầu tiên thắng" trong container</h3>
<p>Trong container <code>lab-sd</code> (Bài 11.1, đã cài <code>openssh-server</code>; tạo <code>/run/sshd</code> nếu <code>sshd -T</code> báo thiếu):</p>
<pre><code class="language-bash">mkdir -p /run/sshd
cd /etc/ssh/sshd_config.d
echo 'PasswordAuthentication yes' &gt; 50-cloud-init.conf
printf 'PasswordAuthentication no\\nPermitRootLogin no\\n' &gt; 99-hardening.conf
sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '
mv 99-hardening.conf 01-hardening.conf
sshd -T | grep -E '^(passwordauthentication|permitrootlogin) '</code></pre>
<div class="out">permitrootlogin no
passwordauthentication yes
permitrootlogin no
passwordauthentication no</div>
<p>Rồi lặp lại đoạn <code>ssh.socket</code> ở Bước 1 với cổng 2222, đọc <code>ss -tlnp</code> ở từng bước, và xoá <code>02-port.conf</code> + <code>daemon-reload</code> + <code>restart ssh.socket</code> để trả lại cổng 22.</p>

<h3>Trên macOS và WSL khác gì</h3>
<p>Trên Mac (đo trên macOS 27, OpenSSH 10.3p1) cùng một ý tưởng xuất hiện dưới tên khác: <code>/etc/ssh/sshd_config</code> cũng có dòng <code>Include /etc/ssh/sshd_config.d/*</code> với sẵn một file <code>100-macos.conf</code> (<code>UsePAM yes</code>, <code>AcceptEnv LANG LC_*</code>), và <code>sshd</code> cũng được kích hoạt theo socket — nhưng bởi <strong>launchd</strong>: <code>/System/Library/LaunchDaemons/ssh.plist</code> có khối <code>Sockets</code> với <code>SockServiceName = ssh</code>, và bật/tắt bằng Remote Login trong System Settings. Mac không có <code>ufw</code> hay <code>fail2ban</code>. WSL2 với systemd bật thì giống hệt Ubuntu (cũng <code>ssh.socket</code>); nhưng cổng của WSL nằm sau máy Windows, nên người ngoài vào được hay không còn phụ thuộc tường lửa và cách chuyển cổng của Windows.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> VPS của nhóm vừa tạo từ ảnh đám mây; trưởng nhóm đã "tắt mật khẩu" bằng file <code>99-hardening.conf</code> nhưng log vẫn đầy <code>Failed password</code>. Trong container <code>lab-sd</code>:</p><ol>
<li>Dựng lại cảnh đó (<code>50-cloud-init.conf</code> = yes, <code>99-hardening.conf</code> = no) và chứng minh bằng <code>sshd -T</code> rằng mật khẩu VẪN bật. Sửa bằng cách đổi tên, chứng minh lại.</li>
<li>Thêm <code>Match User deploy</code> / <code>PasswordAuthentication yes</code> vào một drop-in; cho thấy <code>sshd -T</code> không thấy nó còn <code>sshd -T -C user=deploy,host=x,addr=203.0.113.5</code> thì thấy. Xoá drop-in đó.</li>
<li>Đổi SSH sang cổng 2222 theo đúng thứ tự an toàn (giữ cả <code>Port 22</code>), chứng minh bằng <code>ss -tlnp</code> rằng CẢ HAI cổng đang nghe, rồi trả lại như cũ.</li>
<li>Cài fail2ban với <code>maxretry = 3</code>, <code>ignoreself = false</code>; ba lần <code>ssh -o BatchMode=yes khongco@127.0.0.1 true</code>; đọc <code>fail2ban-client status sshd</code>; gỡ cấm.</li></ol>
<p><strong>Đạt khi:</strong> bước 1 có cặp output <code>yes</code> → <code>no</code>; bước 2 có <code>no</code> và <code>yes</code> cho cùng một cấu hình; bước 3 có hai dòng <code>LISTEN</code> <code>:22</code> và <code>:2222</code>; bước 4 thấy <code>Banned IP list: 127.0.0.1</code> rồi danh sách trống sau <code>unbanip</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hardening (gia cố)</span><span class="v">Giảm bề mặt tấn công của một máy: tắt thứ không dùng, siết thứ phải mở.</span></div>
  <div class="kv"><span class="k">Brute force (dò vét cạn)</span><span class="v">Thử hàng loạt mật khẩu/tên người dùng tự động — thứ bạn thấy trong journal của sshd.</span></div>
  <div class="kv"><span class="k">Drop-in (file chèn thêm)</span><span class="v">File trong <code>sshd_config.d/</code>; với sshd giá trị ĐẦU TIÊN đọc được thắng, nên tên xếp trước thắng.</span></div>
  <div class="kv"><span class="k">Socket activation (kích hoạt theo socket)</span><span class="v">systemd (hoặc launchd trên Mac) giữ cổng và chỉ khởi chạy dịch vụ khi có kết nối.</span></div>
  <div class="kv"><span class="k">Jail (trại giam — của fail2ban)</span><span class="v">Một bộ luật: đọc log nào, đếm lỗi gì, cấm bằng cách nào và bao lâu.</span></div>
  <div class="kv"><span class="k">Unattended upgrades (cập nhật không cần người)</span><span class="v">Gói Ubuntu tự cài bản vá bảo mật mỗi ngày qua timer <code>apt-daily-upgrade</code>.</span></div>
  <div class="kv"><span class="k">Allowlist (danh sách cho phép)</span><span class="v"><code>AllowUsers</code>, <code>ignoreip</code>: chỉ những thứ trong danh sách được qua / được miễn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ khoá SSH (<code>PasswordAuthentication no</code>) là lớp chặn các lượt dò mật khẩu; mọi lớp khác nằm sau nó.</li>
<li>Drop-in của sshd: giá trị ĐẦU TIÊN thắng ⇒ đặt tên <code>01-</code>, nghiệm thu bằng <code>sshd -T</code> — và <code>-C</code> khi có <code>Match</code>.</li>
<li>Ubuntu 22.10+: cổng SSH do <code>ssh.socket</code> giữ; đổi <code>Port</code> cần <code>daemon-reload</code> + <code>restart ssh.socket</code>, mở tường lửa TRƯỚC.</li>
<li>fail2ban đếm lỗi trong journal và cấm IP bằng nftables; sửa <code>jail.local</code>, luôn có <code>ignoreip</code>.</li>
<li>unattended-upgrades bật sẵn, chạy bằng timer lúc 6:00 giờ máy, chỉ lấy nguồn bảo mật; nhân mới cần reboot.</li>
<li>Giữ một phiên SSH mở và thử mọi thay đổi từ terminal thứ hai.</li>
</ul>

<a class="link-card" href="https://github.com/fail2ban/fail2ban" target="_blank" rel="noopener">
  <span class="lc-ico">🚫</span>
  <span class="lc-body"><span class="lc-title">fail2ban — mã nguồn và tài liệu</span><span class="lc-sub">README, danh sách jail có sẵn và cách viết bộ lọc — đọc trước khi sang Chương 14.4.</span></span>
</a>
<a class="link-card" href="https://documentation.ubuntu.com/server/how-to/software/automatic-updates/" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Server — cập nhật tự động</span><span class="lc-sub">Hướng dẫn chính thức cho <code>unattended-upgrades</code>: nguồn được phép, khởi động lại tự động, thông báo qua mail.</span></span>
</a>
<a class="link-card" href="https://ubuntu.com/server/docs/security-introduction" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Ubuntu Server — tài liệu bảo mật</span><span class="lc-sub">Hướng dẫn của chính nhà phát hành về người dùng, SSH, tường lửa và cập nhật tự động. Khớp với bản phân phối bạn đang chạy thật, thứ mà phần lớn bài blog về gia cố máy chủ thì không.</span></span>
</a>
<a class="link-card" href="https://manpages.ubuntu.com/manpages/noble/en/man5/sshd_config.5.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">sshd_config(5)</span><span class="lc-sub">Mọi chỉ thị kèm giá trị mặc định. Hãy đọc kỹ phần <code>Include</code> và <code>Match</code> — chúng là lý do <code>sshd -T</code> tồn tại và là lý do đọc file có thể dẫn bạn đi sai.</span></span>
</a>
<a class="link-card" href="https://wiki.debian.org/UnattendedUpgrades" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">UnattendedUpgrades — wiki của Debian</span><span class="lc-sub">Áp dụng trực tiếp cho Ubuntu. Nói về nguồn gói, danh sách loại trừ, các lựa chọn khởi động lại và cách thử mà không phải chờ tới giờ hẹn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: gia cố một máy chủ mà không tự nhốt mình ở ngoài</span><span class="lc-sub">Bài chấm điểm: sửa một drop-in âm thầm bật lại đăng nhập mật khẩu, chữa quyền của <code>authorized_keys</code> chỉ dựa vào log của sshd, thêm swap sống sót qua khởi động lại, và chạy cuộc soát năm phút trên một máy có ba lỗi cố ý.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cách nhanh nhất để mất một máy chủ là đổi cấu hình SSH và luật tường lửa trong cùng một hơi, rồi ngắt kết nối. <code>ufw enable</code> mà không có luật SSH, một dòng <code>AllowUsers</code> gõ sai, một lần đổi <code>Port</code> mà tường lửa không biết — mỗi thứ đó chỉ chí mạng VÌ bạn đã đóng cái phiên lẽ ra sửa được nó. Cái luật khiến tất cả chúng đều sống sót được: <strong>đừng bao giờ đóng một phiên SSH đang chạy được cho tới khi một phiên MỚI đã kết nối thành công</strong>. Nếu buộc phải tự động hoá một thay đổi rủi ro thì hãy hẹn sẵn một cú hoàn tác trước: <code>echo 'ufw disable' | sudo at now + 10 minutes</code>, rồi huỷ nó khi bạn đã xác nhận mình vẫn còn ở trong.</div>
<p class="note-ct"><strong>Ba thứ cần nhớ.</strong> Xác thực chỉ bằng khoá là thay đổi duy nhất chấm dứt những cuộc tấn công bạn thấy trong journal ở đầu bài này — mọi thứ khác trong danh sách là phòng thủ nhiều lớp nằm SAU nó. Hãy xác nhận bằng <code>sshd -T</code> chứ đừng xác nhận bằng cách đọc một file cấu hình, vì drop-in và cái luật "đầu tiên thắng" khiến mấy file đó nói dối. Và khác biệt giữa một máy chủ đã gia cố với một máy chủ đã gia cố mà ngày mai vẫn còn sống nằm ở đúng một thói quen: một terminal thứ hai, đang mở, đang kết nối, TRƯỚC khi bạn đụng vào bất cứ thứ gì.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Quiz: systemd, cron & administration|||11.4 — Kiểm tra: systemd, cron & quản trị',
      slug: 'lnx-11-4-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống: daemon-reload, 203/EXEC với node của nvm, StartLimitIntervalSec đặt nhầm mục, Requires khi dịch vụ kia sập, PATH của cron, dấu chấm trong cron.d, UTC và CRON_TZ, flock, sshd 01- vs 50-cloud-init, và ssh.socket.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real servers — a unit that ignores your edit, a job that runs at the wrong hour, a password login that will not die. Every answer about output was run on Ubuntu 24.04 with real systemd. Aim for 8/10; each explanation says why the tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a service unit with <code>User=</code>, <code>Restart=on-failure</code> and a start limit in the right section, and check it with <code>systemd-analyze verify</code>.</li>
<li>I can tell <code>Wants=</code>, <code>Requires=</code>, <code>BindsTo=</code> and <code>After=</code> apart.</li>
<li>I can read <code>203/EXEC</code>, <code>200/CHDIR</code> and <code>217/USER</code> in <code>systemctl status</code>.</li>
<li>I can explain why a job works by hand but not in cron, and test it the way cron runs it.</li>
<li>I can write a timer, ask <code>systemd-analyze calendar</code> when it fires, and account for UTC vs +07.</li>
<li>I can prove password login is off with <code>sshd -T</code> and change the SSH port on Ubuntu 24.04 without locking myself out.</li>
</ul>
${slide('lx-11', 24, 'Bảng tra nhanh Chương 11 (1/2)')}
${slide('lx-11', 25, 'Bảng tra nhanh Chương 11 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ máy chủ thật — một unit lờ đi thay đổi của bạn, một công việc chạy sai giờ, một kiểu đăng nhập bằng mật khẩu mãi không chịu tắt. Mọi đáp án về output đều đã chạy thật trên Ubuntu 24.04 có systemd thật. Nhắm 8/10; mỗi lời giải thích nói vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được một unit dịch vụ có <code>User=</code>, <code>Restart=on-failure</code> và giới hạn khởi động đặt đúng mục, rồi kiểm bằng <code>systemd-analyze verify</code>.</li>
<li>Tôi phân biệt được <code>Wants=</code>, <code>Requires=</code>, <code>BindsTo=</code> và <code>After=</code>.</li>
<li>Tôi đọc được <code>203/EXEC</code>, <code>200/CHDIR</code> và <code>217/USER</code> trong <code>systemctl status</code>.</li>
<li>Tôi giải thích được vì sao một công việc chạy tay thì được mà cron thì không, và thử nó đúng cách cron chạy.</li>
<li>Tôi viết được một timer, hỏi <code>systemd-analyze calendar</code> khi nào nó chạy, và tính đến chuyện UTC với +07.</li>
<li>Tôi chứng minh được đăng nhập mật khẩu đã tắt bằng <code>sshd -T</code>, và đổi cổng SSH trên Ubuntu 24.04 mà không tự nhốt mình ở ngoài.</li>
</ul>
${slide('lx-11', 24, 'Bảng tra nhanh Chương 11 (1/2)')}
${slide('lx-11', 25, 'Bảng tra nhanh Chương 11 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You change RestartSec=2s to 3s in /etc/systemd/system/myapp.service and run systemctl restart myapp. systemctl show myapp -p RestartUSec still prints RestartUSec=2s. What did systemd already tell you, and what fixes it?|||Bạn đổi RestartSec=2s thành 3s trong /etc/systemd/system/myapp.service rồi chạy systemctl restart myapp. systemctl show myapp -p RestartUSec vẫn in RestartUSec=2s. systemd đã báo gì với bạn, và sửa thế nào?',
            options: [
              'Nothing — restart only re-reads the file if you stop and start separately|||Không báo gì — restart chỉ đọc lại file nếu bạn stop rồi start riêng',
              '"Warning: The unit file … changed on disk. Run ’systemctl daemon-reload’" — run systemctl daemon-reload, then restart|||"Warning: The unit file … changed on disk. Run ’systemctl daemon-reload’" — chạy systemctl daemon-reload rồi restart',
              'An error that RestartSec only accepts whole minutes|||Một lỗi rằng RestartSec chỉ nhận số phút tròn',
              'Nothing — the new value only applies after a reboot|||Không báo gì — giá trị mới chỉ có hiệu lực sau khi khởi động lại máy',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: systemd keeps its own parsed copy of every unit; restart reuses it and prints exactly that warning. daemon-reload re-reads the files (measured: 2s → 3s after reload). Stopping and starting separately uses the same cached copy, and no reboot is needed.|||VI: systemd giữ bản unit đã phân tích của riêng nó; restart dùng lại bản đó và in đúng dòng cảnh báo ấy. daemon-reload mới đọc lại file (đo thật: 2s → 3s sau khi reload). Stop rồi start riêng vẫn dùng bản cũ trong bộ nhớ, và không cần khởi động lại máy.',
          },
          {
            question: 'ExecStart=node dist/index.js fails with status=203/EXEC on a VPS where node was installed with nvm. The same unit with ExecStart=python3 server.py works. Why?|||ExecStart=node dist/index.js hỏng với status=203/EXEC trên một VPS cài node bằng nvm. Cùng unit đó với ExecStart=python3 server.py thì chạy. Vì sao?',
            options: [
              'systemd never accepts a bare program name — only absolute paths|||systemd không bao giờ nhận tên chương trình trần — chỉ nhận đường dẫn tuyệt đối',
              'dist/index.js is relative, and relative arguments are forbidden|||dist/index.js là đường dẫn tương đối, mà tham số tương đối bị cấm',
              'Node.js needs Type=forking under systemd|||Node.js cần Type=forking khi chạy dưới systemd',
              'systemd looks up bare names only in /usr/local/sbin, /usr/local/bin, /usr/sbin, /usr/bin — not in your PATH, so nvm’s node is not found; use its absolute path|||systemd chỉ tra tên trần trong /usr/local/sbin, /usr/local/bin, /usr/sbin, /usr/bin — không tra PATH của bạn, nên node của nvm không được tìm thấy; hãy dùng đường dẫn tuyệt đối của nó',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: systemd-path search-binaries-default prints exactly those four directories; python3 lives in /usr/bin, nvm’s node under ~/.nvm. "Never accepts bare names" is the tempting answer — it was true of old systemd, but the python3 unit in the question works. Relative ARGUMENTS are fine: they resolve against WorkingDirectory.|||VI: systemd-path search-binaries-default in đúng bốn thư mục đó; python3 nằm ở /usr/bin, node của nvm nằm dưới ~/.nvm. "Không bao giờ nhận tên trần" là phương án hấp dẫn — nó đúng với systemd cũ, nhưng unit python3 trong đề đang chạy. Tham số tương đối thì hợp lệ: nó được hiểu theo WorkingDirectory.',
          },
          {
            question: 'You put StartLimitIntervalSec=300 and StartLimitBurst=5 under [Service] and run systemd-analyze verify. What happens?|||Bạn đặt StartLimitIntervalSec=300 và StartLimitBurst=5 dưới mục [Service] rồi chạy systemd-analyze verify. Chuyện gì xảy ra?',
            options: [
              '"Unknown key name ’StartLimitIntervalSec’ in section ’Service’, ignoring." — the window stays at the default 10 s; move both lines to [Unit]|||"Unknown key name ’StartLimitIntervalSec’ in section ’Service’, ignoring." — cửa sổ vẫn là 10 giây mặc định; chuyển cả hai dòng sang [Unit]',
              'Nothing is printed and both values apply — the section does not matter|||Không in gì và cả hai giá trị đều có hiệu lực — đặt ở mục nào cũng được',
              'verify refuses the file and the service will not start at all|||verify từ chối file và dịch vụ không khởi động được',
              'Both keys are ignored, so the service restarts forever|||Cả hai khoá đều bị bỏ qua nên dịch vụ bật lại mãi mãi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: measured on systemd 255 — StartLimitBurst is still accepted in [Service] for compatibility, StartLimitIntervalSec is ignored with that warning, and systemctl show reports StartLimitIntervalUSec=10s. daemon-reload says nothing, which is why "the section does not matter" feels true. The unit still starts.|||VI: đo trên systemd 255 — StartLimitBurst vẫn được nhận trong [Service] vì tương thích, StartLimitIntervalSec bị bỏ qua kèm đúng cảnh báo đó, và systemctl show báo StartLimitIntervalUSec=10s. daemon-reload không nói gì, nên "mục nào cũng được" nghe có vẻ đúng. Unit vẫn khởi động.',
          },
          {
            question: 'web.service has Requires=db.service and After=db.service. Both are running. The db process is killed with kill -9 and db.service goes to failed. What happens to web.service?|||web.service có Requires=db.service và After=db.service. Cả hai đang chạy. Tiến trình db bị kill -9 và db.service thành failed. web.service ra sao?',
            options: [
              'It is stopped immediately, because Requires= propagates every failure|||Nó bị dừng ngay, vì Requires= lan theo mọi lỗi',
              'It is restarted together with db|||Nó được khởi động lại cùng db',
              'It keeps running — Requires= only propagates deliberate stops/restarts and failed starts; use BindsTo= (or make the app reconnect) for crashes|||Nó vẫn chạy — Requires= chỉ lan theo những lần stop/restart có chủ đích và những lần khởi động hỏng; muốn theo cả khi sập thì dùng BindsTo= (hoặc để app tự kết nối lại)',
              'It becomes failed with result ’dependency’|||Nó thành failed với kết quả ’dependency’',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: measured: after kill -9 of db, web-req stayed active. It WAS stopped by systemctl stop db, and it refused to start with result ’dependency’ when db failed to START — that is why the last option is tempting, but it describes a different situation.|||VI: đo thật: sau kill -9 db, web-req vẫn active. Nó CÓ bị dừng khi systemctl stop db, và nó từ chối khởi động với kết quả ’dependency’ khi db KHỞI ĐỘNG hỏng — vì thế phương án cuối hấp dẫn, nhưng nó tả một tình huống khác.',
          },
          {
            question: 'On Ubuntu 24.04 a backup script runs fine in your terminal, but cron mails "node: command not found". /usr/local/bin is in cron’s PATH there. What is the real cause?|||Trên Ubuntu 24.04, một script sao lưu chạy ngon trong terminal, nhưng cron báo "node: command not found". Ở đó PATH của cron có /usr/local/bin. Nguyên nhân thật là gì?',
            options: [
              'cron runs every job as root, which has no node|||cron chạy mọi công việc bằng root, mà root không có node',
              'cron never reads ~/.bashrc or ~/.profile, so the directory nvm adds (~/.nvm/versions/node/…/bin) is missing from its PATH|||cron không bao giờ đọc ~/.bashrc hay ~/.profile, nên thư mục nvm thêm vào (~/.nvm/versions/node/…/bin) không có trong PATH của nó',
              'cron’s PATH is only /usr/bin:/bin on every Linux|||PATH của cron luôn chỉ là /usr/bin:/bin trên mọi Linux',
              'cron uses /bin/sh, and sh cannot run node|||cron dùng /bin/sh, mà sh không chạy được node',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: measured: Ubuntu cron loads /etc/environment through PAM, so its PATH is long — but nothing from your shell start-up files. "/usr/bin:/bin everywhere" is the popular myth (cronie on Fedora uses /usr/bin:/bin:/usr/sbin:/sbin; Ubuntu differs). A user crontab runs as that user, not root, and sh runs node just fine.|||VI: đo thật: cron của Ubuntu nạp /etc/environment qua PAM nên PATH dài — nhưng không có gì từ các file khởi động shell của bạn. "/usr/bin:/bin ở mọi nơi" là lời đồn phổ biến (cronie của Fedora dùng /usr/bin:/bin:/usr/sbin:/sbin; Ubuntu thì khác). Crontab của một người chạy bằng chính người đó chứ không phải root, và sh chạy node bình thường.',
          },
          {
            question: 'You create /etc/cron.d/app.cleanup containing "* * * * * root touch /tmp/x". Two minutes later /tmp/x does not exist and journalctl -t CRON shows nothing about it. Fix?|||Bạn tạo /etc/cron.d/app.cleanup chứa "* * * * * root touch /tmp/x". Hai phút sau /tmp/x không có và journalctl -t CRON không có dòng nào về nó. Sửa thế nào?',
            options: [
              'Rename it without the dot, e.g. /etc/cron.d/app-cleanup — files whose names contain a dot are silently ignored|||Đổi tên bỏ dấu chấm, ví dụ /etc/cron.d/app-cleanup — file có dấu chấm trong tên bị bỏ qua trong im lặng',
              'Remove "root": cron.d uses the five-field user format|||Bỏ chữ "root": cron.d dùng định dạng năm trường của người dùng',
              'chmod +x the file — cron.d entries must be executable|||chmod +x file đó — file trong cron.d phải thực thi được',
              'Restart cron: it only reads cron.d at boot|||Khởi động lại cron: nó chỉ đọc cron.d lúc khởi động',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: measured side by side: app.cleanup never ran and produced no log line, app-cleanup ran on the next minute without any restart. cron.d files use SIX fields (with the user), and they are read, not executed, so +x is irrelevant.|||VI: đo song song: app.cleanup không bao giờ chạy và không sinh dòng log nào, app-cleanup chạy ngay phút kế tiếp mà không cần khởi động lại gì. File trong cron.d dùng SÁU trường (có tên người dùng), và chúng được đọc chứ không được chạy, nên +x chẳng liên quan.',
          },
          {
            question: 'The VPS clock is UTC. A teammate writes "0 2 * * * /usr/local/bin/backup.sh" meaning 2am Vietnam time, and adds CRON_TZ=Asia/Ho_Chi_Minh at the top of the crontab. On Ubuntu 24.04, when does the job run?|||Đồng hồ VPS là UTC. Bạn cùng nhóm viết "0 2 * * * /usr/local/bin/backup.sh" với ý 2 giờ sáng giờ Việt Nam, và thêm CRON_TZ=Asia/Ho_Chi_Minh ở đầu crontab. Trên Ubuntu 24.04, công việc chạy lúc nào?',
            options: [
              '02:00 Vietnam time — CRON_TZ converts the schedule|||02:00 giờ Việt Nam — CRON_TZ đổi lịch sang múi giờ đó',
              'It never runs — an unknown variable makes crontab refuse the file|||Không bao giờ chạy — một biến lạ khiến crontab từ chối cả file',
              '19:00 Vietnam time, because cron subtracts the offset|||19:00 giờ Việt Nam, vì cron trừ đi độ lệch',
              '02:00 UTC = 09:00 Vietnam time — Ubuntu’s cron ignores CRON_TZ (it only becomes an environment variable); write 0 19 * * * or use a timer with OnCalendar=… Asia/Ho_Chi_Minh|||02:00 UTC = 09:00 giờ Việt Nam — cron của Ubuntu lờ CRON_TZ (nó chỉ thành một biến môi trường); viết 0 19 * * * hoặc dùng timer với OnCalendar=… Asia/Ho_Chi_Minh',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: measured: with CRON_TZ set, a job at "22:28 Vietnam time" did not run at 22:28 +07, and CRON_TZ=Asia/Ho_Chi_Minh showed up in the job’s env. CRON_TZ is a cronie (Fedora/RHEL) feature, which is why so many articles recommend it. crontab accepts the line without complaint.|||VI: đo thật: có CRON_TZ, một công việc "22:28 giờ VN" không chạy lúc 22:28 +07, và CRON_TZ=Asia/Ho_Chi_Minh xuất hiện trong env của công việc. CRON_TZ là tính năng của cronie (Fedora/RHEL), lý do rất nhiều bài viết khuyên dùng nó. crontab nhận dòng đó không một lời phàn nàn.',
          },
          {
            question: 'Two lines are typed one after the other: (1) flock -n /tmp/x.lock sleep 30 &  (2) flock -n /tmp/x.lock echo "second copy"; echo "exit=$?". What does line 2 print?|||Gõ lần lượt hai dòng: (1) flock -n /tmp/x.lock sleep 30 &  (2) flock -n /tmp/x.lock echo "second copy"; echo "exit=$?". Dòng 2 in ra gì?',
            options: [
              'second copy  then  exit=0|||second copy  rồi  exit=0',
              'second copy  then  exit=1|||second copy  rồi  exit=1',
              'only exit=1|||chỉ exit=1',
              'flock: waiting for lock… (and it hangs for 30 seconds)|||flock: waiting for lock… (và treo 30 giây)',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: -n means "do not wait": the lock is held by the first flock, so the second one does not run echo at all and exits 1 (measured). It would only wait with -w or with no flag; -E would change the 1 to a code of your choice.|||VI: -n nghĩa là "không chờ": khoá đang bị flock thứ nhất giữ, nên flock thứ hai không chạy echo chút nào và thoát 1 (đo thật). Nó chỉ chờ khi có -w hoặc không có cờ; -E đổi số 1 thành mã bạn chọn.',
          },
          {
            question: '/etc/ssh/sshd_config.d/ holds 50-cloud-init.conf (PasswordAuthentication yes) and 99-hardening.conf (PasswordAuthentication no, PermitRootLogin no). sshd -T shows passwordauthentication yes and permitrootlogin no. What fixes it?|||/etc/ssh/sshd_config.d/ có 50-cloud-init.conf (PasswordAuthentication yes) và 99-hardening.conf (PasswordAuthentication no, PermitRootLogin no). sshd -T in passwordauthentication yes và permitrootlogin no. Sửa thế nào?',
            options: [
              'Rename yours to 01-hardening.conf — sshd keeps the FIRST value it reads and drop-ins are read in name order; then confirm with sshd -T|||Đổi tên file của bạn thành 01-hardening.conf — sshd giữ giá trị ĐẦU TIÊN nó đọc và drop-in được đọc theo thứ tự tên; rồi xác nhận bằng sshd -T',
              'Rename it to 100-hardening.conf so it is read last and wins|||Đổi tên thành 100-hardening.conf để nó được đọc cuối cùng và thắng',
              'Run systemctl reload ssh — sshd -T shows the old values until then|||Chạy systemctl reload ssh — sshd -T hiện giá trị cũ cho tới lúc đó',
              'Fix a typo: PermitRootLogin worked, so the other line must be misspelled|||Sửa lỗi chính tả: PermitRootLogin đã ăn, nên dòng kia chắc gõ sai',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: measured: renaming 99- to 01- flips sshd -T to passwordauthentication no. "Last one wins" is the intuition from most config files, but sshd is first-wins. sshd -T reads the files directly, so reload changes nothing about its output; and a typo would make sshd -t fail loudly (Bad configuration option). Half working = order collision, not a typo.|||VI: đo thật: đổi 99- thành 01- làm sshd -T chuyển sang passwordauthentication no. "Cái cuối cùng thắng" là trực giác từ phần lớn file cấu hình, nhưng sshd là "đầu tiên thắng". sshd -T đọc thẳng file nên reload chẳng đổi gì output của nó; còn gõ sai thì sshd -t báo to (Bad configuration option). Nửa ăn nửa trượt = va chạm thứ tự, không phải gõ sai.',
          },
          {
            question: 'On Ubuntu 24.04 you add "Port 2222" to a drop-in and run systemctl restart ssh. sshd -T | grep ^port prints port 2222, but ss -tlnp still shows only :22 (owned by systemd). What is the next step?|||Trên Ubuntu 24.04 bạn thêm "Port 2222" vào một drop-in rồi chạy systemctl restart ssh. sshd -T | grep ^port in port 2222, nhưng ss -tlnp vẫn chỉ thấy :22 (do systemd giữ). Bước tiếp theo là gì?',
            options: [
              'Reboot — port changes need a reboot on Ubuntu|||Khởi động lại máy — đổi cổng trên Ubuntu cần reboot',
              'systemctl daemon-reload, then systemctl restart ssh.socket — the generator turns Port into ListenStream= only on daemon-reload (open 2222 in the firewall first)|||systemctl daemon-reload rồi systemctl restart ssh.socket — generator chỉ dịch Port thành ListenStream= khi daemon-reload (mở 2222 trên tường lửa trước)',
              'Put the Port line in sshd_config itself, drop-ins cannot set Port|||Đặt dòng Port vào chính sshd_config, drop-in không đặt được Port',
              'systemctl reload ssh instead of restart|||systemctl reload ssh thay cho restart',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: measured: after daemon-reload + restart ssh.socket, ss shows 0.0.0.0:2222 owned by systemd, and /run/systemd/generator/ssh.socket.d/addresses.conf holds ListenStream=0.0.0.0:2222. The drop-in was fine (sshd -T already read it); reload/restart of ssh.service never touch the socket that systemd holds. Keep Port 22 too until you have logged in on 2222.|||VI: đo thật: sau daemon-reload + restart ssh.socket, ss thấy 0.0.0.0:2222 do systemd giữ, và /run/systemd/generator/ssh.socket.d/addresses.conf chứa ListenStream=0.0.0.0:2222. Drop-in không có lỗi (sshd -T đã đọc được); reload hay restart ssh.service không bao giờ đụng tới cái socket systemd đang giữ. Giữ cả Port 22 cho tới khi đã đăng nhập được qua 2222.',
          },
        ],
      },
    },
  ],
};
