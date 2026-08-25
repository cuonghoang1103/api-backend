/**
 * Linux & Bash — Chương 11: systemd, cron & quản trị.
 * Unit của systemd · hẹn giờ và cron · gia cố máy chủ · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 11 — systemd, cron & administration|||Chương 11 — systemd, cron & quản trị',
  description: 'Chạy ứng dụng của bạn như một dịch vụ tự khởi động lại, hẹn giờ công việc, và gia cố một máy chủ. Đây là chương biến "tôi chạy nó bằng nohup" thành một thứ sống sót qua khởi động lại máy, tự dậy khi sập, và ghi log vào đúng chỗ.',
  lessons: [
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

<h3>What a unit is</h3>
<pre><code>systemctl list-units --type=service --state=running | head
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
<pre><code>sudo systemctl start myapp
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
<pre><code>sudo systemctl daemon-reload           <span class="tok-comment"># REQUIRED after editing any unit file</span>
sudo systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">[Unit]</span><span class="lz-lnote">Metadata and ordering. <code>After=</code> says "start me after these", <code>Wants=</code> says "try to start these too". <code>Requires=</code> is stronger and usually too strong — if the dependency fails, your service is stopped as well.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Service]</span><span class="lz-lnote">How to run it: which command, as whom, with what environment, and what to do when it exits. This is the section that matters.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Install]</span><span class="lz-lnote">What <code>enable</code> should hook it into. <code>multi-user.target</code> means "normal boot". Without this section, <code>enable</code> has nothing to do and silently achieves nothing.</span></div>
</div>
<div class="callout warn"><strong><code>daemon-reload</code> after every edit.</strong> systemd caches unit files; without it, <code>restart</code> starts the <em>old</em> definition and your change appears to have no effect — so you edit again, restart again, and conclude the file is being ignored. Forgetting this is the single most common systemd mistake, and the symptom is indistinguishable from a config that does not work.</div>

<h3>The details that decide whether it works</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Type=simple</code></span><span class="v">The default: your command runs in the foreground and stays there. Correct for almost every modern application.</span></div>
  <div class="kv"><span class="k"><code>Type=forking</code></span><span class="v">For old-style daemons that fork and exit. Needs <code>PIDFile=</code>. If your app does <em>not</em> fork and you set this, systemd waits forever and then times out.</span></div>
  <div class="kv"><span class="k"><code>Type=oneshot</code></span><span class="v">Runs to completion, then the unit is "done". For migrations and setup tasks. Pair with <code>RemainAfterExit=yes</code> if later units depend on it.</span></div>
  <div class="kv"><span class="k"><code>ExecStart=</code></span><span class="v"><strong>Absolute paths only.</strong> systemd does not use a shell, so no <code>PATH</code> lookup, no globs, no <code>&amp;&amp;</code>, no redirection (Lesson 8.2). If you need shell features: <code>ExecStart=/bin/bash -c '…'</code>.</span></div>
  <div class="kv"><span class="k"><code>User=</code> <code>Group=</code></span><span class="v">Run as an unprivileged account (Lesson 4.4). Without it the service runs as <strong>root</strong>, which almost nothing needs.</span></div>
  <div class="kv"><span class="k"><code>EnvironmentFile=</code></span><span class="v">Reads <code>KEY=value</code> lines. Prefix with <code>-</code> (<code>EnvironmentFile=-/opt/app/.env</code>) to make a missing file non-fatal.</span></div>
</div>
<pre><code><span class="tok-comment"># Shell features need an explicit shell</span>
ExecStart=/bin/bash -c 'exec /srv/app/bin/server &gt;&gt; /var/log/app.log 2&gt;&amp;1'

<span class="tok-comment"># Run something before and after the main process</span>
ExecStartPre=/usr/bin/npx prisma migrate deploy
ExecStopPost=/usr/local/bin/notify-deploy-stopped</code></pre>

<h3>Restart policy, and the crash loop</h3>
<pre><code>Restart=on-failure          <span class="tok-comment"># restart on non-zero exit or a signal. The usual choice.</span>
Restart=always              <span class="tok-comment"># restart even after a clean exit 0</span>
Restart=no                  <span class="tok-comment"># the default — do NOT restart</span>
RestartSec=5s               <span class="tok-comment"># wait before restarting</span>

StartLimitIntervalSec=300   <span class="tok-comment"># within a 5-minute window…</span>
StartLimitBurst=5           <span class="tok-comment"># …allow 5 starts, then give up</span></code></pre>
<div class="out">Aug 22 17:02:11 vps systemd[1]: myapp.service: Scheduled restart job, restart counter is at 5.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Start request repeated too quickly.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Failed with result 'exit-code'.</div>
<div class="callout warn"><strong>The rate limit is a feature, and it confuses people.</strong> An application that crashes on start — a missing environment variable, a database that is not up yet — restarts five times in seconds and then systemd stops trying. <code>systemctl status</code> then says <code>Start request repeated too quickly</code>, which sounds like a systemd problem and is actually "your app has failed five times, look at the journal". Fix the cause, then <code>systemctl reset-failed myapp</code> to clear the counter before starting again.</div>
<div class="callout ok">Without the limit, a crash-looping service restarts forever, filling the journal and burning CPU — and on a machine with several such services, that alone can take the box down. Five attempts in five minutes is a sensible default; raise <code>RestartSec</code> rather than the burst if a service legitimately needs to wait for something slow.</div>

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

<h3>Drop-ins: overriding without editing</h3>
<pre><code>sudo systemctl edit nginx              <span class="tok-comment"># creates a drop-in and opens it</span></code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/nginx.service.d/override.conf</span>
[Service]
MemoryMax=1G
Restart=always</code></pre>
<pre><code>systemctl cat nginx                    <span class="tok-comment"># main file + every drop-in, in order</span>
sudo systemctl revert nginx            <span class="tok-comment"># discard all local overrides</span></code></pre>
<div class="callout ok">Never edit a unit file that came from a package: the next <code>apt upgrade</code> replaces it and your change vanishes. A drop-in in <code>/etc/systemd/system/&lt;unit&gt;.d/</code> survives upgrades, shows up clearly in <code>systemctl cat</code>, and can be removed with one command. The same layering as the <code>sshd_config.d</code> and <code>sudoers.d</code> directories from Chapters 4 and 9 — <code>/etc</code> is yours, <code>/usr/lib</code> belongs to the package.</div>
<pre><code><span class="tok-comment"># To append to a list-valued directive, reset it first</span>
[Service]
ExecStart=
ExecStart=/usr/bin/node /srv/app/dist/index.js --flag</code></pre>
<p>An empty assignment clears the inherited value. Without it, <code>ExecStart=</code> in a drop-in is <em>added</em> to the original for some directive types and rejected for others — and the resulting error message is unhelpful. Reset, then set.</p>

<h3>When it will not start</h3>
<pre><code>systemctl status myapp                 <span class="tok-comment"># 1. the summary and last few log lines</span>
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

<h3>A complete unit for a Node application</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/myapp.service</span>
[Unit]
Description=MyApp API server
After=network-online.target postgresql.service
Wants=network-online.target

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
StartLimitIntervalSec=300
StartLimitBurst=5
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

<div class="pitfall"><strong>Trap:</strong> a relative path or a shell construct in <code>ExecStart=</code>. systemd does not run a shell, so <code>ExecStart=node dist/index.js</code> fails with <code>203/EXEC</code> (no <code>PATH</code> lookup — Lesson 8.1), and <code>ExecStart=/usr/bin/node app.js &gt;&gt; /var/log/app.log</code> passes <code>&gt;&gt;</code> and the filename to node as arguments rather than redirecting. Use absolute paths always, let the journal capture stdout instead of redirecting, and when you genuinely need shell syntax, say so explicitly with <code>/bin/bash -c '…'</code>.</div>
<p class="note-ct"><strong>Three things to remember.</strong> <code>daemon-reload</code> after every unit edit, or you are testing the old file. <code>enable</code> and <code>start</code> are different — <code>--now</code> does both, and forgetting <code>enable</code> means the app is gone after the next reboot. And when a service will not start, run its exact <code>ExecStart</code> by hand as its exact <code>User=</code>: that one command separates "systemd is misconfigured" from "the application is broken" in about five seconds.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Chạy ứng dụng của bạn như một dịch vụ</h2>
<p class="lead">Bài 5.4 kết thúc bằng một quy tắc: <code>nohup</code> và <code>tmux</code> sống sót qua một lần rớt kết nối nhưng không sống sót qua một lần khởi động lại máy, và mọi thứ quan trọng đều thuộc về một trình quản lý dịch vụ. Đây chính là bài đó. Một file mười hai dòng cho bạn: tự khởi động cùng máy, tự bật lại khi sập, log nằm trong journal, một người dùng riêng, và một cách dừng nó được ghi lại rõ ràng cho người sau.</p>

<h3>Một unit là gì</h3>
<pre><code>systemctl list-units --type=service --state=running | head
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
<pre><code>sudo systemctl start myapp
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
<pre><code>sudo systemctl daemon-reload           <span class="tok-comment"># BẮT BUỘC sau khi sửa bất kỳ file unit nào</span>
sudo systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">[Unit]</span><span class="lz-lnote">Siêu dữ liệu và thứ tự. <code>After=</code> nói "hãy chạy tôi SAU những cái này", <code>Wants=</code> nói "hãy thử khởi động cả những cái này nữa". <code>Requires=</code> mạnh hơn và thường là quá mạnh — nếu thứ phụ thuộc hỏng thì dịch vụ của bạn cũng bị dừng theo.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Service]</span><span class="lz-lnote">Chạy nó ra sao: lệnh nào, với danh nghĩa ai, môi trường gì, và làm gì khi nó thoát. Đây là mục có ý nghĩa nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">[Install]</span><span class="lz-lnote">Lệnh <code>enable</code> nên móc nó vào đâu. <code>multi-user.target</code> nghĩa là "khởi động bình thường". Thiếu mục này thì <code>enable</code> chẳng có việc gì để làm và âm thầm không đạt được gì.</span></div>
</div>
<div class="callout warn"><strong>Phải <code>daemon-reload</code> sau MỖI lần sửa.</strong> systemd lưu tạm các file unit; thiếu nó, lệnh <code>restart</code> khởi động lại định nghĩa <em>CŨ</em> và thay đổi của bạn trông như chẳng có tác dụng gì — nên bạn sửa lần nữa, restart lần nữa, rồi kết luận rằng cái file đang bị bỏ qua. Quên chuyện này là sai lầm phổ biến nhất với systemd, và triệu chứng thì không phân biệt được với một cấu hình không chạy được.</div>

<h3>Những chi tiết quyết định nó có chạy hay không</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>Type=simple</code></span><span class="v">Mặc định: lệnh của bạn chạy ở tiền cảnh và ở lại đó. Đúng với gần như mọi ứng dụng đời mới.</span></div>
  <div class="kv"><span class="k"><code>Type=forking</code></span><span class="v">Dành cho daemon kiểu cũ vốn fork ra rồi thoát. Cần <code>PIDFile=</code>. Nếu ứng dụng của bạn KHÔNG fork mà bạn đặt cái này thì systemd chờ mãi rồi hết giờ.</span></div>
  <div class="kv"><span class="k"><code>Type=oneshot</code></span><span class="v">Chạy tới khi xong, rồi unit coi như "đã xong". Dành cho di trú và các tác vụ thiết lập. Ghép với <code>RemainAfterExit=yes</code> nếu có unit khác phụ thuộc vào nó.</span></div>
  <div class="kv"><span class="k"><code>ExecStart=</code></span><span class="v"><strong>CHỈ đường dẫn tuyệt đối.</strong> systemd không dùng shell, nên không tra <code>PATH</code>, không có glob, không có <code>&amp;&amp;</code>, không có chuyển hướng (Bài 8.2). Nếu bạn cần tính năng của shell: <code>ExecStart=/bin/bash -c '…'</code>.</span></div>
  <div class="kv"><span class="k"><code>User=</code> <code>Group=</code></span><span class="v">Chạy với một tài khoản không đặc quyền (Bài 4.4). Thiếu nó, dịch vụ chạy bằng <strong>root</strong>, thứ mà gần như chẳng ứng dụng nào cần.</span></div>
  <div class="kv"><span class="k"><code>EnvironmentFile=</code></span><span class="v">Đọc các dòng <code>KHOÁ=giá trị</code>. Thêm tiền tố <code>-</code> (<code>EnvironmentFile=-/opt/app/.env</code>) để một file thiếu không gây chết.</span></div>
</div>
<pre><code><span class="tok-comment"># Tính năng của shell thì cần một cái shell tường minh</span>
ExecStart=/bin/bash -c 'exec /srv/app/bin/server &gt;&gt; /var/log/app.log 2&gt;&amp;1'

<span class="tok-comment"># Chạy thứ gì đó trước và sau tiến trình chính</span>
ExecStartPre=/usr/bin/npx prisma migrate deploy
ExecStopPost=/usr/local/bin/notify-deploy-stopped</code></pre>

<h3>Chính sách khởi động lại, và vòng lặp sập</h3>
<pre><code>Restart=on-failure          <span class="tok-comment"># bật lại khi thoát khác 0 hoặc do tín hiệu. Lựa chọn thường dùng.</span>
Restart=always              <span class="tok-comment"># bật lại kể cả sau khi thoát sạch với mã 0</span>
Restart=no                  <span class="tok-comment"># mặc định — KHÔNG bật lại</span>
RestartSec=5s               <span class="tok-comment"># chờ bao lâu trước khi bật lại</span>

StartLimitIntervalSec=300   <span class="tok-comment"># trong một cửa sổ 5 phút…</span>
StartLimitBurst=5           <span class="tok-comment"># …cho phép 5 lần khởi động, rồi bỏ cuộc</span></code></pre>
<div class="out">Aug 22 17:02:11 vps systemd[1]: myapp.service: Scheduled restart job, restart counter is at 5.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Start request repeated too quickly.
Aug 22 17:02:11 vps systemd[1]: myapp.service: Failed with result 'exit-code'.</div>
<div class="callout warn"><strong>Cái giới hạn tần suất là một TÍNH NĂNG, và nó làm người ta rối.</strong> Một ứng dụng sập ngay lúc khởi động — thiếu một biến môi trường, cơ sở dữ liệu chưa lên — sẽ bật lại năm lần trong vài giây rồi systemd thôi không thử nữa. Lúc đó <code>systemctl status</code> nói <code>Start request repeated too quickly</code>, nghe như một vấn đề của systemd mà thật ra nghĩa là "ứng dụng của bạn đã hỏng năm lần, hãy nhìn vào journal". Hãy chữa nguyên nhân, rồi <code>systemctl reset-failed myapp</code> để xoá bộ đếm trước khi khởi động lại.</div>
<div class="callout ok">Không có cái giới hạn đó, một dịch vụ trong vòng lặp sập sẽ bật lại mãi mãi, làm đầy journal và đốt CPU — và trên một cái máy có vài dịch vụ như thế thì riêng chuyện đó cũng đủ hạ cả máy. Năm lần trong năm phút là một mặc định hợp lý; nếu một dịch vụ chính đáng cần chờ một thứ gì đó chậm thì hãy nâng <code>RestartSec</code> chứ đừng nâng số lần.</div>

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

<h3>Drop-in: ghi đè mà không phải sửa file gốc</h3>
<pre><code>sudo systemctl edit nginx              <span class="tok-comment"># tạo một drop-in rồi mở nó ra</span></code></pre>
<pre><code><span class="tok-comment"># /etc/systemd/system/nginx.service.d/override.conf</span>
[Service]
MemoryMax=1G
Restart=always</code></pre>
<pre><code>systemctl cat nginx                    <span class="tok-comment"># file chính + mọi drop-in, theo thứ tự</span>
sudo systemctl revert nginx            <span class="tok-comment"># bỏ hết các phần ghi đè cục bộ</span></code></pre>
<div class="callout ok">Đừng bao giờ sửa một file unit đến từ một gói phần mềm: lần <code>apt upgrade</code> kế tiếp sẽ thay nó và thay đổi của bạn biến mất. Một drop-in trong <code>/etc/systemd/system/&lt;unit&gt;.d/</code> thì sống sót qua các lần nâng cấp, hiện ra rõ ràng trong <code>systemctl cat</code>, và gỡ đi được bằng một lệnh. Cùng một lối xếp tầng với các thư mục <code>sshd_config.d</code> và <code>sudoers.d</code> ở Chương 4 và 9 — <code>/etc</code> là của bạn, <code>/usr/lib</code> thuộc về cái gói.</div>
<pre><code><span class="tok-comment"># Muốn nối thêm vào một chỉ thị dạng danh sách thì phải xoá nó trước</span>
[Service]
ExecStart=
ExecStart=/usr/bin/node /srv/app/dist/index.js --flag</code></pre>
<p>Một phép gán rỗng sẽ xoá giá trị thừa kế. Không có nó, dòng <code>ExecStart=</code> trong một drop-in sẽ được <em>CỘNG THÊM</em> vào bản gốc với vài loại chỉ thị và bị từ chối với vài loại khác — và thông báo lỗi sinh ra thì chẳng giúp gì. Hãy xoá trước, rồi mới đặt.</p>

<h3>Khi nó không khởi động</h3>
<pre><code>systemctl status myapp                 <span class="tok-comment"># 1. bản tóm tắt và vài dòng log cuối</span>
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

<h3>Một unit hoàn chỉnh cho ứng dụng Node</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/myapp.service</span>
[Unit]
Description=Máy chủ API của MyApp
After=network-online.target postgresql.service
Wants=network-online.target

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
StartLimitIntervalSec=300
StartLimitBurst=5
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

<div class="pitfall"><strong>Bẫy:</strong> một đường dẫn tương đối hoặc một cấu trúc của shell nằm trong <code>ExecStart=</code>. systemd KHÔNG chạy shell, nên <code>ExecStart=node dist/index.js</code> hỏng với <code>203/EXEC</code> (không tra <code>PATH</code> — Bài 8.1), còn <code>ExecStart=/usr/bin/node app.js &gt;&gt; /var/log/app.log</code> thì truyền <code>&gt;&gt;</code> và cái tên file cho node dưới dạng THAM SỐ chứ không chuyển hướng gì cả. Hãy luôn dùng đường dẫn tuyệt đối, để journal hứng stdout thay vì tự chuyển hướng, và khi bạn thật sự cần cú pháp của shell thì hãy nói rõ ra bằng <code>/bin/bash -c '…'</code>.</div>
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
<div class="callout"><strong>Read a line out loud before you trust it.</strong> <code>0 */6 * * *</code> is "minute 0, every 6th hour" — four times a day. <code>*/6 * * * *</code> is "every 6th minute" — 240 times a day. One character apart, forty times the load. When in doubt, paste the line into <code>systemd-analyze calendar</code> further down this lesson, or ask <code>crontab -l</code> for the file you already have and compare against a job you know works.</div>

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
<pre><code><span class="tok-comment"># The six-field system format — note the user column</span>
cat /etc/cron.d/app-cleanup</code></pre>
<div class="out">SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=root

# m h dom mon dow  user     command
17 4 * * *         deploy   /srv/app/bin/cleanup.sh</div>
<div class="pitfall"><strong>Pitfall:</strong> a file in <code>/etc/cron.d/</code> or <code>/etc/cron.daily/</code> whose name contains a <strong>dot</strong> is ignored. <code>app.sh</code>, <code>backup.cron</code>, <code>cleanup.bak</code> — all silently skipped, no error anywhere. This is <code>run-parts</code>'s rule (it also skips names with characters outside <code>[A-Za-z0-9_-]</code>), and it is the single most common reason a job that "is definitely installed" never runs. Name the file <code>app-cleanup</code>, with no extension. Verify with <code>run-parts --test /etc/cron.daily</code>, which prints exactly the scripts that WOULD run.</div>

<h3>The environment trap</h3>
<p>This is the lesson. Nine out of ten broken cron jobs are broken here, and the symptom is always the same sentence: <em>"it works when I run it by hand"</em>.</p>
<p>When cron runs your command it does <strong>not</strong> read <code>~/.bashrc</code>, <code>~/.profile</code>, or <code>/etc/profile</code> (Lesson 8.2). It gives you a nearly empty environment: <code>PATH=/usr/bin:/bin</code>, <code>HOME</code>, <code>LOGNAME</code>, <code>SHELL=/bin/sh</code>, and almost nothing else. No <code>nvm</code>, no <code>pyenv</code>, no <code>rbenv</code>, no <code>~/.local/bin</code>, none of your exports, and no <code>LANG</code> — so tools that format numbers or dates by locale change their output.</p>
<pre><code><span class="tok-comment"># Prove it: dump cron's real environment for one minute</span>
crontab -l | { cat; echo '* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1'; } | crontab -
<span class="tok-comment"># wait a minute, then</span>
cat /tmp/cron-env.txt</code></pre>
<div class="out">SHELL=/bin/sh
PWD=/home/deploy
LOGNAME=deploy
HOME=/home/deploy
LANG=en_US.UTF-8
PATH=/usr/bin:/bin
_=/usr/bin/env</div>
<p>Now compare that with your interactive shell — <code>echo "\$PATH"</code> in a terminal on the same box is often five times longer. Every tool that lives in one of those missing directories is a <code>command not found</code> waiting to happen, and cron writes that error to mail you are not reading.</p>
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
<pre><code><span class="tok-comment"># Fix C, in full — the shape every scheduled job should have</span>
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
<pre><code>sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer   <span class="tok-comment"># the TIMER, not the service</span>
systemctl list-timers backup.timer</code></pre>
<div class="out">NEXT                        LEFT       LAST                        PASSED  UNIT          ACTIVATES
Sat 2026-08-23 03:30:00 UTC 9h 48min   Fri 2026-08-22 03:31:12 UTC 14h ago backup.timer  backup.service

1 timers listed.</div>
<div class="callout"><strong><code>enable</code> the timer, never the service.</strong> Enabling <code>backup.service</code> makes it run at every boot and never again — the opposite of what you want. If the job seems to run once after a reboot and then stop forever, this is why: check <code>systemctl is-enabled backup.service</code>, and if it says <code>enabled</code>, <code>disable</code> it and enable the timer instead.</div>

<h3>OnCalendar, and a calculator that removes the guesswork</h3>
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

<h3>Which one should you use?</h3>
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
<pre><code><span class="tok-comment"># Did cron try? This is the first command, every time.</span>
journalctl -t CRON --since today | tail -20</code></pre>
<div class="out">Aug 22 03:30:01 vps-1 CRON[40112]: (deploy) CMD (/usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1)
Aug 22 03:39:14 vps-1 CRON[40112]: (deploy) MAIL (mailed 1 byte of output; but got status 0x004b)
Aug 22 04:17:01 vps-1 CRON[40255]: (root) CMD (cd / &amp;&amp; run-parts --report /etc/cron.hourly)</div>

<h3>Never let two copies run</h3>
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

<h3>A complete example</h3>
<pre><code><span class="tok-comment"># /usr/local/bin/backup.sh — quiet on success, loud on failure</span>
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
<pre><code><span class="tok-comment"># Test it before you schedule it — as the user that will run it</span>
sudo -u deploy /usr/local/bin/backup.sh
sudo systemctl start backup.service          <span class="tok-comment"># then, the way it will really run</span>
journalctl -u backup.service -n 20 --no-pager</code></pre>
<div class="out">Aug 22 18:02:41 vps-1 systemd[1]: Starting backup.service - Nightly database backup...
Aug 22 18:02:49 vps-1 backup.sh[42871]: backup: 84M -&gt; /srv/backups/app-20260822-180241.dump
Aug 22 18:02:49 vps-1 systemd[1]: backup.service: Deactivated successfully.
Aug 22 18:02:49 vps-1 systemd[1]: Finished backup.service - Nightly database backup.</div>
<div class="callout ok"><strong>A scheduled job you have never watched run is not a scheduled job, it is a hope.</strong> Run it by hand as the right user, then run it through the scheduler with <code>systemctl start</code>, then read the journal. Three commands, and they catch the environment bug, the permission bug and the "it wrote to the wrong directory" bug before 03:30 ever arrives. And for a backup specifically: restore it somewhere once. An unrestored backup is an untested backup.</div>

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
<div class="callout"><strong>Hãy đọc to một dòng lên trước khi tin nó.</strong> <code>0 */6 * * *</code> là "phút 0, mỗi 6 giờ" — bốn lần một ngày. <code>*/6 * * * *</code> là "mỗi 6 phút" — 240 lần một ngày. Cách nhau đúng một ký tự, tải nặng gấp bốn mươi lần. Khi phân vân, hãy dán dòng đó vào <code>systemd-analyze calendar</code> ở phần dưới, hoặc gọi <code>crontab -l</code> lấy file bạn đang có và so với một công việc bạn biết chắc là chạy đúng.</div>

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
<pre><code><span class="tok-comment"># Định dạng sáu trường của hệ thống — để ý cột người dùng</span>
cat /etc/cron.d/app-cleanup</code></pre>
<div class="out">SHELL=/bin/bash
PATH=/usr/local/bin:/usr/bin:/bin
MAILTO=root

# m h dom mon dow  user     command
17 4 * * *         deploy   /srv/app/bin/cleanup.sh</div>
<div class="pitfall"><strong>Bẫy:</strong> một file trong <code>/etc/cron.d/</code> hay <code>/etc/cron.daily/</code> mà tên có <strong>DẤU CHẤM</strong> thì bị bỏ qua. <code>app.sh</code>, <code>backup.cron</code>, <code>cleanup.bak</code> — tất cả đều bị bỏ im lặng, không báo lỗi ở đâu hết. Đó là luật của <code>run-parts</code> (nó cũng bỏ qua tên chứa ký tự ngoài <code>[A-Za-z0-9_-]</code>), và đây là lý do phổ biến nhất khiến một công việc "chắc chắn đã cài rồi" không bao giờ chạy. Hãy đặt tên file là <code>app-cleanup</code>, không đuôi. Kiểm bằng <code>run-parts --test /etc/cron.daily</code> — nó in ra ĐÚNG những script sẽ chạy.</div>

<h3>Cái bẫy môi trường</h3>
<p>Đây mới là bài học. Chín trên mười công việc cron hỏng là hỏng ở đây, và triệu chứng luôn là đúng một câu: <em>"chạy tay thì được mà"</em>.</p>
<p>Khi cron chạy câu lệnh của bạn, nó <strong>KHÔNG</strong> đọc <code>~/.bashrc</code>, <code>~/.profile</code> hay <code>/etc/profile</code> (Bài 8.2). Nó đưa cho bạn một môi trường gần như rỗng: <code>PATH=/usr/bin:/bin</code>, <code>HOME</code>, <code>LOGNAME</code>, <code>SHELL=/bin/sh</code>, và gần như không gì khác. Không <code>nvm</code>, không <code>pyenv</code>, không <code>rbenv</code>, không <code>~/.local/bin</code>, không một biến export nào của bạn, và không có <code>LANG</code> — nên những công cụ định dạng số hay ngày theo bản địa sẽ đổi output.</p>
<pre><code><span class="tok-comment"># Chứng minh: đổ ra môi trường THẬT của cron trong một phút</span>
crontab -l | { cat; echo '* * * * * env &gt; /tmp/cron-env.txt 2&gt;&amp;1'; } | crontab -
<span class="tok-comment"># chờ một phút, rồi</span>
cat /tmp/cron-env.txt</code></pre>
<div class="out">SHELL=/bin/sh
PWD=/home/deploy
LOGNAME=deploy
HOME=/home/deploy
LANG=en_US.UTF-8
PATH=/usr/bin:/bin
_=/usr/bin/env</div>
<p>Giờ đem so với shell tương tác của bạn — <code>echo "\$PATH"</code> trong một cửa sổ terminal trên cùng cái máy đó thường dài gấp năm. Mọi công cụ nằm trong một trong các thư mục còn thiếu kia đều là một cái <code>command not found</code> chờ sẵn, và cron ghi lỗi ấy vào một hòm thư bạn không đọc.</p>
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
<pre><code><span class="tok-comment"># Cách C, đầy đủ — hình hài mà mọi công việc hẹn giờ nên có</span>
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
<pre><code>sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer   <span class="tok-comment"># cái TIMER, không phải cái service</span>
systemctl list-timers backup.timer</code></pre>
<div class="out">NEXT                        LEFT       LAST                        PASSED  UNIT          ACTIVATES
Sat 2026-08-23 03:30:00 UTC 9h 48min   Fri 2026-08-22 03:31:12 UTC 14h ago backup.timer  backup.service

1 timers listed.</div>
<div class="callout"><strong><code>enable</code> cái TIMER, đừng bao giờ enable cái service.</strong> Enable <code>backup.service</code> khiến nó chạy mỗi lần khởi động máy rồi thôi hẳn — ngược đúng với thứ bạn muốn. Nếu công việc có vẻ chạy một lần sau khi reboot rồi im mãi thì đây là lý do: kiểm <code>systemctl is-enabled backup.service</code>, thấy nó nói <code>enabled</code> thì <code>disable</code> đi và enable cái timer thay vào.</div>

<h3>OnCalendar, và một cái máy tính xoá sạch việc phải đoán</h3>
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

<h3>Nên dùng cái nào?</h3>
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
<pre><code><span class="tok-comment"># cron có thử không? Đây là câu lệnh đầu tiên, lần nào cũng vậy.</span>
journalctl -t CRON --since today | tail -20</code></pre>
<div class="out">Aug 22 03:30:01 vps-1 CRON[40112]: (deploy) CMD (/usr/local/bin/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1)
Aug 22 03:39:14 vps-1 CRON[40112]: (deploy) MAIL (mailed 1 byte of output; but got status 0x004b)
Aug 22 04:17:01 vps-1 CRON[40255]: (root) CMD (cd / &amp;&amp; run-parts --report /etc/cron.hourly)</div>

<h3>Đừng bao giờ để hai bản cùng chạy</h3>
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

<h3>Một ví dụ hoàn chỉnh</h3>
<pre><code><span class="tok-comment"># /usr/local/bin/backup.sh — im khi thành công, ồn khi thất bại</span>
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
<pre><code><span class="tok-comment"># Thử nó TRƯỚC khi hẹn giờ — dưới đúng người dùng sẽ chạy nó</span>
sudo -u deploy /usr/local/bin/backup.sh
sudo systemctl start backup.service          <span class="tok-comment"># rồi tới cách nó sẽ chạy thật</span>
journalctl -u backup.service -n 20 --no-pager</code></pre>
<div class="out">Aug 22 18:02:41 vps-1 systemd[1]: Starting backup.service - Nightly database backup...
Aug 22 18:02:49 vps-1 backup.sh[42871]: backup: 84M -&gt; /srv/backups/app-20260822-180241.dump
Aug 22 18:02:49 vps-1 systemd[1]: backup.service: Deactivated successfully.
Aug 22 18:02:49 vps-1 systemd[1]: Finished backup.service - Nightly database backup.</div>
<div class="callout ok"><strong>Một công việc hẹn giờ mà bạn chưa từng xem nó chạy thì không phải một công việc hẹn giờ, đó là một niềm hy vọng.</strong> Chạy tay dưới đúng người dùng, rồi chạy qua bộ hẹn giờ bằng <code>systemctl start</code>, rồi đọc journal. Ba câu lệnh, và chúng bắt được con bọ môi trường, con bọ quyền hạn và con bọ "nó ghi nhầm thư mục" trước khi 03:30 kịp tới. Và riêng với sao lưu: hãy PHỤC HỒI nó ở đâu đó một lần. Một bản sao lưu chưa từng phục hồi là một bản sao lưu chưa từng được kiểm.</div>

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
<pre><code><span class="tok-comment"># Failed SSH logins — on a fresh public VPS, run this after an hour</span>
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
<p>Chapter 9 covered generating a key and copying it up. Now you turn passwords off. The danger is obvious: get this wrong, close your terminal, and the machine is gone — VPS providers sell you a console, but not every provider's console works well, and some don't have one at all.</p>
<pre><code><span class="tok-comment"># On your laptop, if you have not already</span>
ssh-keygen -t ed25519 -C "you@laptop"
ssh-copy-id deploy@203.0.113.10

<span class="tok-comment"># Prove the key works BEFORE changing anything</span>
ssh -o PasswordAuthentication=no deploy@203.0.113.10 'echo key-login-ok'</code></pre>
<div class="out">key-login-ok</div>
<p>That flag forces the client to refuse to fall back to a password, so a success means the key genuinely worked. Only now do you edit the server config — and edit it as a <strong>drop-in</strong>, not by hacking the main file:</p>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/99-hardening.conf</span>
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code>sudo sshd -t                       <span class="tok-comment"># VALIDATE. Prints nothing if the config is good.</span>
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

<h3>Step 2 — a non-root user with sudo</h3>
<pre><code>sudo adduser deploy                       <span class="tok-comment"># interactive; sets a password and home dir</span>
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
<pre><code>sudo ufw default deny incoming
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

<h3>Step 4 — automatic security updates</h3>
<p>The most valuable twenty minutes on this list, because it keeps paying out while you are asleep. Ubuntu ships the mechanism; you only have to turn it on and decide how brave you are about reboots.</p>
<pre><code>sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   <span class="tok-comment"># or edit the files below</span>
systemctl status unattended-upgrades
cat /etc/apt/apt.conf.d/20auto-upgrades</code></pre>
<div class="out">APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";</div>
<pre><code><span class="tok-comment"># /etc/apt/apt.conf.d/50unattended-upgrades — the lines worth changing</span>
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
<pre><code><span class="tok-comment"># Does this machine need a reboot right now?</span>
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
<pre><code>free -h                                   <span class="tok-comment"># check first — many images have none</span>
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile                  <span class="tok-comment"># 600, or mkswap warns and you have leaked memory contents</span>
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   <span class="tok-comment"># survive a reboot</span>
free -h</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       612Mi       138Mi        18Mi       1.2Gi       1.1Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<pre><code><span class="tok-comment"># Lower the eagerness to swap: use RAM first, swap only under real pressure</span>
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
<pre><code><span class="tok-comment"># A five-minute audit you can run on any server, any time</span>
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
  <div class="kv"><span class="k">Moving SSH to port 2222</span><span class="v">Cuts log noise substantially, stops zero determined attackers, and adds a flag to every <code>ssh</code>, <code>scp</code> and deploy script forever. Defensible for quiet logs; not security. If you do it, add <code>Port</code> to the firewall BEFORE reloading sshd.</span></div>
  <div class="kv"><span class="k">fail2ban on a key-only server</span><span class="v">Genuinely useful when passwords are enabled. Once <code>PasswordAuthentication no</code> is set, it is banning IPs that could never have got in. Keep it if you like tidy logs; do not mistake it for the thing protecting you.</span></div>
  <div class="kv"><span class="k">Disabling ping</span><span class="v">Breaks your own monitoring and diagnostics (Lesson 9.1) to hide from a scan that will find the open port anyway.</span></div>
  <div class="kv"><span class="k">Root password complexity rules</span><span class="v">Irrelevant once root login is off and passwords are off. Effort spent here is effort not spent on backups.</span></div>
  <div class="kv"><span class="k">What IS worth it</span><span class="v">Keys, no root login, updates applied, a firewall that denies by default, database bound to localhost, secrets out of the repo, and a restore you have actually performed. That list is short because it is the list that matters.</span></div>
</div>

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
<pre><code><span class="tok-comment"># Đăng nhập SSH thất bại — trên một VPS công khai mới, chạy cái này sau một giờ</span>
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
<p>Chương 9 đã nói về việc tạo khoá và chép nó lên. Giờ bạn tắt mật khẩu đi. Nguy hiểm thì rõ rồi: làm sai, đóng cửa sổ terminal, thế là mất máy — nhà cung cấp VPS có bán cho bạn một cái console, nhưng không phải console của nhà nào cũng chạy tử tế, và có nhà còn chẳng có.</p>
<pre><code><span class="tok-comment"># Trên laptop của bạn, nếu chưa làm</span>
ssh-keygen -t ed25519 -C "you@laptop"
ssh-copy-id deploy@203.0.113.10

<span class="tok-comment"># Chứng minh khoá chạy được TRƯỚC khi đổi bất cứ thứ gì</span>
ssh -o PasswordAuthentication=no deploy@203.0.113.10 'echo key-login-ok'</code></pre>
<div class="out">key-login-ok</div>
<p>Cái cờ đó ép phía máy khách từ chối lùi về mật khẩu, nên thành công nghĩa là khoá THẬT SỰ chạy được. Chỉ tới lúc đó bạn mới sửa cấu hình phía máy chủ — và sửa bằng một file <strong>drop-in</strong>, đừng băm vào file chính:</p>
<pre><code><span class="tok-comment"># /etc/ssh/sshd_config.d/99-hardening.conf</span>
PasswordAuthentication no
PermitRootLogin no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2</code></pre>
<pre><code>sudo sshd -t                       <span class="tok-comment"># KIỂM. Cấu hình tốt thì nó không in gì.</span>
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

<h3>Bước 2 — một người dùng không phải root, có sudo</h3>
<pre><code>sudo adduser deploy                       <span class="tok-comment"># tương tác; đặt mật khẩu và tạo thư mục nhà</span>
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
<pre><code>sudo ufw default deny incoming
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

<h3>Bước 4 — cập nhật bảo mật tự động</h3>
<p>Hai mươi phút đáng giá nhất trong danh sách này, vì nó tiếp tục sinh lời trong lúc bạn ngủ. Ubuntu có sẵn cơ chế; bạn chỉ phải bật nó lên và quyết xem mình gan tới đâu với chuyện khởi động lại máy.</p>
<pre><code>sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades   <span class="tok-comment"># hoặc sửa mấy file dưới</span>
systemctl status unattended-upgrades
cat /etc/apt/apt.conf.d/20auto-upgrades</code></pre>
<div class="out">APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";</div>
<pre><code><span class="tok-comment"># /etc/apt/apt.conf.d/50unattended-upgrades — những dòng đáng đổi</span>
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
<pre><code><span class="tok-comment"># Máy này có cần khởi động lại ngay bây giờ không?</span>
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
<pre><code>free -h                                   <span class="tok-comment"># kiểm trước — nhiều ảnh không có sẵn</span>
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile                  <span class="tok-comment"># 600, không thì mkswap cảnh báo và bạn đã rò nội dung bộ nhớ</span>
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   <span class="tok-comment"># sống sót qua khởi động lại</span>
free -h</code></pre>
<div class="out">               total        used        free      shared  buff/cache   available
Mem:           1.9Gi       612Mi       138Mi        18Mi       1.2Gi       1.1Gi
Swap:          2.0Gi          0B       2.0Gi</div>
<pre><code><span class="tok-comment"># Giảm độ hăng hái đẩy sang swap: dùng RAM trước, chỉ swap khi thật sự bị ép</span>
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
<pre><code><span class="tok-comment"># Một cuộc soát năm phút, chạy được trên máy chủ nào cũng được, lúc nào cũng được</span>
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
  <div class="kv"><span class="k">Chuyển SSH sang cổng 2222</span><span class="v">Cắt tiếng ồn trong log rất nhiều, chặn được ĐÚNG KHÔNG kẻ tấn công có chủ đích nào, và thêm một cái cờ vào mọi lệnh <code>ssh</code>, <code>scp</code> và script triển khai mãi mãi. Bảo vệ được nếu mục tiêu là log sạch; không phải bảo mật. Nếu làm thì thêm <code>Port</code> vào tường lửa TRƯỚC khi reload sshd.</span></div>
  <div class="kv"><span class="k">fail2ban trên máy chỉ nhận khoá</span><span class="v">Thật sự hữu ích khi mật khẩu còn bật. Một khi đã đặt <code>PasswordAuthentication no</code> thì nó đang cấm những địa chỉ IP vốn không bao giờ vào được. Giữ nó nếu bạn thích log gọn gàng; đừng nhầm nó là thứ đang bảo vệ bạn.</span></div>
  <div class="kv"><span class="k">Tắt ping</span><span class="v">Phá chính hệ giám sát và chẩn đoán của bạn (Bài 9.1) để trốn một lượt quét mà đằng nào cũng tìm ra cái cổng đang mở.</span></div>
  <div class="kv"><span class="k">Luật độ phức tạp mật khẩu root</span><span class="v">Vô nghĩa một khi đăng nhập root đã tắt và mật khẩu đã tắt. Công sức đổ vào đây là công sức không đổ vào sao lưu.</span></div>
  <div class="kv"><span class="k">Thứ ĐÁNG làm</span><span class="v">Khoá, không đăng nhập root, cập nhật đã áp, một tường lửa mặc định từ chối, cơ sở dữ liệu gắn vào localhost, bí mật nằm ngoài kho mã, và một lần phục hồi bạn đã THẬT SỰ thực hiện. Danh sách đó ngắn vì nó là danh sách có ý nghĩa.</span></div>
</div>

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
      description: 'Tám câu về daemon-reload, 203/EXEC, chặn tần suất khởi động lại, PATH của cron, dấu chấm trong tên file cron.d, Persistent=true, flock, và vì sao phải kiểm SSH bằng sshd -T.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on services, schedules and hardening. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: why a unit edit does nothing until <code>daemon-reload</code> (11.1), why a cron job that works by hand dies on a schedule (11.2), and why <code>sshd -T</code> is the only honest answer about SSH configuration (11.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về dịch vụ, lịch chạy và gia cố máy chủ. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: vì sao sửa một unit chẳng có tác dụng gì cho tới khi <code>daemon-reload</code> (bài 11.1), vì sao một công việc cron chạy tay thì được mà theo lịch thì chết (bài 11.2), và vì sao <code>sshd -T</code> là câu trả lời trung thực duy nhất về cấu hình SSH (bài 11.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You edit /etc/systemd/system/app.service, then run systemctl restart app. The old behaviour persists. Why?|||Bạn sửa /etc/systemd/system/app.service rồi chạy systemctl restart app. Hành vi cũ vẫn còn nguyên. Vì sao?',
            options: [
              'restart is not enough; you must stop and start separately|||restart là chưa đủ; bạn phải stop rồi start riêng ra',
              'systemd is still running the CACHED copy of the unit — nothing re-reads the file until systemctl daemon-reload|||systemd vẫn đang chạy bản unit ĐÃ NẠP SẴN — không có gì đọc lại cái file cho tới khi systemctl daemon-reload',
              'Unit files under /etc/systemd/system are read-only templates|||File unit dưới /etc/systemd/system là khuôn mẫu chỉ đọc',
              'The change needs a reboot to take effect|||Thay đổi đó cần khởi động lại máy mới có hiệu lực',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A unit with ExecStart=node dist/index.js fails immediately with status 203/EXEC. What is wrong?|||Một unit có ExecStart=node dist/index.js hỏng ngay với trạng thái 203/EXEC. Sai ở đâu?',
            options: [
              'systemd does NOT run a shell, so it never searches PATH — ExecStart needs the absolute path, e.g. /usr/bin/node|||systemd KHÔNG chạy shell nên nó không bao giờ tra PATH — ExecStart cần đường dẫn tuyệt đối, ví dụ /usr/bin/node',
              'The file dist/index.js does not exist|||File dist/index.js không tồn tại',
              'Node.js is not compatible with systemd|||Node.js không tương thích với systemd',
              'The service is missing a [Install] section|||Dịch vụ thiếu mục [Install]',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A service with Restart=always crashed five times in ten seconds and systemd has stopped trying. What happened, and how do you make it try again?|||Một dịch vụ có Restart=always sập năm lần trong mười giây và systemd đã thôi không thử nữa. Chuyện gì đã xảy ra, và làm sao cho nó thử lại?',
            options: [
              'systemd disabled the unit permanently; re-enable it|||systemd đã vô hiệu hoá unit vĩnh viễn; hãy enable lại nó',
              'Start rate limiting (StartLimitBurst / StartLimitIntervalSec) tripped — fix the crash, then systemctl reset-failed to clear the counter|||Cơ chế chặn tần suất khởi động (StartLimitBurst / StartLimitIntervalSec) đã kích hoạt — hãy sửa nguyên nhân sập, rồi systemctl reset-failed để xoá bộ đếm',
              'The machine ran out of process IDs|||Máy đã hết mã tiến trình',
              'Restart=always only applies to clean exits|||Restart=always chỉ áp dụng cho những lần thoát sạch',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A backup script runs perfectly when you type it in your terminal, but the cron job fails with "node: command not found". Why?|||Một script sao lưu chạy hoàn hảo khi bạn gõ trong terminal, nhưng công việc cron lại hỏng với "node: command not found". Vì sao?',
            options: [
              'cron cannot run scripts that call other programs|||cron không chạy được script có gọi chương trình khác',
              'The script needs sudo when run by cron|||Script cần sudo khi cron chạy nó',
              'cron does NOT read .bashrc or .profile — its PATH is roughly /usr/bin:/bin, so anything installed by nvm/pyenv or under ~/.local/bin is invisible|||cron KHÔNG đọc .bashrc hay .profile — PATH của nó đại khái chỉ có /usr/bin:/bin, nên mọi thứ do nvm/pyenv cài hoặc nằm dưới ~/.local/bin đều vô hình',
              'cron runs the job as root, which has a different home directory|||cron chạy công việc dưới quyền root, và root có thư mục nhà khác',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You drop a working script at /etc/cron.d/backup.sh with correct syntax and permissions. It never runs, and there is no error anywhere. What is wrong?|||Bạn thả một script chạy tốt vào /etc/cron.d/backup.sh với cú pháp và quyền đều đúng. Nó không bao giờ chạy, và không có lỗi ở đâu cả. Sai ở chỗ nào?',
            options: [
              'Files in cron.d must be owned by the cron user|||File trong cron.d phải thuộc sở hữu của người dùng cron',
              'A filename containing a DOT is silently ignored — rename it to /etc/cron.d/backup, with no extension|||Tên file có DẤU CHẤM thì bị bỏ qua trong im lặng — hãy đổi tên thành /etc/cron.d/backup, không đuôi',
              'cron.d only accepts the five-field format, not six|||cron.d chỉ nhận định dạng năm trường, không nhận sáu',
              'The file must be marked executable|||File phải được đánh dấu là thực thi được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A daily 03:30 job must still run if the machine happened to be powered off at 03:30. Which mechanism gives you that?|||Một công việc hằng ngày lúc 03:30 vẫn phải chạy nếu đúng lúc 03:30 máy đang tắt. Cơ chế nào cho bạn điều đó?',
            options: [
              'A cron line with @daily, which catches up automatically|||Một dòng cron với @daily, nó tự chạy bù',
              'A systemd timer with Persistent=true — it records the last run on disk and fires shortly after the next boot; cron simply skips the missed slot|||Một timer của systemd với Persistent=true — nó ghi lần chạy cuối xuống đĩa và nổ ngay sau lần khởi động kế tiếp; cron thì đơn giản là bỏ qua lượt bị lỡ',
              'Setting AccuracySec=1s on the timer|||Đặt AccuracySec=1s cho timer',
              'Adding @reboot alongside the daily line|||Thêm @reboot bên cạnh dòng chạy hằng ngày',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A backup normally takes 4 minutes but occasionally takes 70, and cron starts the next copy on schedule regardless. What is the standard fix?|||Một bản sao lưu bình thường mất 4 phút nhưng thỉnh thoảng mất 70, và cron vẫn khởi chạy bản kế tiếp đúng lịch bất kể điều đó. Cách chữa tiêu chuẩn là gì?',
            options: [
              'Wrap the command in flock — flock -n /var/lock/backup.lock skips the run if the previous one still holds the lock, and the kernel releases it even if the process is killed|||Bọc câu lệnh trong flock — flock -n /var/lock/backup.lock bỏ qua lượt chạy nếu lượt trước còn giữ khoá, và nhân tự nhả khoá kể cả khi tiến trình bị giết',
              'Increase the interval to every 2 hours|||Tăng khoảng cách lên mỗi 2 giờ',
              'Create a lockfile with touch and test for it with [ -f ]|||Tạo một file khoá bằng touch rồi kiểm bằng [ -f ]',
              'Add nice to lower the priority of the second copy|||Thêm nice để hạ độ ưu tiên của bản thứ hai',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You set PasswordAuthentication no in sshd_config and reloaded, but password logins still work. What is the most likely cause, and how should you verify?|||Bạn đặt PasswordAuthentication no trong sshd_config rồi reload, nhưng đăng nhập bằng mật khẩu vẫn được. Nguyên nhân khả dĩ nhất là gì, và nên xác nhận thế nào?',
            options: [
              'The reload silently failed; use restart instead|||Lệnh reload đã âm thầm thất bại; hãy dùng restart thay vào',
              'A drop-in such as 50-cloud-init.conf sets it back to yes, and in sshd_config the FIRST setting wins — verify with sshd -T, which prints the fully resolved configuration|||Một drop-in như 50-cloud-init.conf đặt nó về yes, và trong sshd_config thì thiết lập ĐẦU TIÊN thắng — hãy xác nhận bằng sshd -T, lệnh in ra cấu hình đã được giải quyết đầy đủ',
              'The setting only applies to new users|||Thiết lập đó chỉ áp dụng cho người dùng mới',
              'PasswordAuthentication has no effect while PermitRootLogin is yes|||PasswordAuthentication không có tác dụng chừng nào PermitRootLogin còn là yes',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
