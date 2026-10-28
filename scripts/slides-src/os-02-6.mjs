/**
 * os-02-6 — khoá "Operating Systems for Developers", bài 2.6 "The logs the system keeps" (28/10/2026).
 * Khuôn chuẩn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Số liệu = CHẠY THẬT trong container systemd vứt đi
 * (lab/out/c26-log.out.txt, c26-rotate.out.txt) và từ máy chủ Docker (c26-docker.out.txt). Giảng: giang/os-02-6.mjs (walk()).
 */
import { lamDeck, sql, sh, two as two0, box, cards } from './_pg-chung.mjs';

export const deck = { key: 'os-02-6', code: 'OS 2.6', title: 'The logs the system keeps', sub: 'Operating Systems · Chapter 2' };

const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, o);
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const A = (x1, y1, x2, y2, c = '#b85a2b') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3" marker-end="url(#ar)"/>`;
const DEFS = `<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';

/* Slide 3: ba nơi để hỏi */
const threePlaces = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  const box3 = (x, c, f, t, cmd, q1, q2) => {
    let r = R(x, 20, 340, 210, f, c);
    r += T(x + 170, 62, t, 24, { a: 'middle', w: 800, f: c });
    r += T(x + 170, 104, cmd, 19, { a: 'middle', m: 1, w: 700 });
    r += T(x + 170, 160, q1, 18, { a: 'middle', f: '#444' });
    r += T(x + 170, 190, q2, 18, { a: 'middle', f: '#444' });
    return r;
  };
  s += box3(15, BL, '#eef4fa', 'systemd', 'systemctl', 'Is the service up?', 'How often did it restart?');
  s += box3(385, OR, '#fff7ef', 'the journal', 'journalctl', 'What did it print,', 'and exactly when?');
  s += box3(755, RD, '#fdf0ee', 'the kernel log', 'dmesg · journalctl -k', 'Did the kernel kill', 'or fail something?');
  return s + '</svg>';
};

/* Slide 5: vòng lặp sập → StartLimitBurst */
const crashLoop = () => {
  let s = `<svg viewBox="0 0 1110 200" width="1110" height="200" font-family="Arial">${DEFS}`;
  const xs = [30, 230, 430, 630];
  xs.forEach((x, i) => {
    s += R(x, 40, 150, 70, '#fdf0ee', RD, { rx: 8 });
    s += T(x + 75, 70, 'start ' + (i + 1), 19, { a: 'middle', w: 800, f: RD });
    s += T(x + 75, 96, 'exit 1', 17, { a: 'middle', m: 1 });
    if (i < 3) s += A(x + 152, 75, x + 226, 75);
  });
  s += A(782, 75, 856, 75);
  s += R(860, 30, 225, 90, '#f3f3f3', '#555', { rx: 8 });
  s += T(972, 66, 'failed', 24, { a: 'middle', w: 800, f: '#333' });
  s += T(972, 96, 'systemd gives up', 17, { a: 'middle', f: '#555' });
  s += T(555, 160, 'Restart=on-failure, RestartSec=1  ·  StartLimitBurst=4 within StartLimitIntervalSec=30', 18, { a: 'middle', m: 1, f: BR });
  s += T(555, 190, '"Start request repeated too quickly" — protection against a crash loop that burns CPU and floods the log', 17, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 9: ba nhân chứng của một lần OOM kill */
const witnesses = () => {
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">${DEFS}`;
  s += R(400, 10, 310, 70, '#fdf0ee', RD);
  s += T(555, 40, 'node exceeds MemoryMax=64M', 19, { a: 'middle', w: 800, f: RD });
  s += T(555, 64, 'kernel sends SIGKILL', 17, { a: 'middle', f: '#555' });
  const w = [[20, 'systemd', 'Result: oom-kill', BL], [395, 'kernel log', 'Killed process 85118 (node)', RD], [770, 'exit status', 'status=9/KILL (= 137)', OR]];
  w.forEach(([x, h, d, c]) => {
    s += R(x, 130, 320, 90, '#fff', c);
    s += T(x + 160, 166, h, 21, { a: 'middle', w: 800, f: c });
    s += T(x + 160, 198, d, 17, { a: 'middle', m: 1 });
  });
  s += A(470, 82, 190, 126); s += A(555, 82, 555, 126); s += A(640, 82, 920, 126);
  return s + '</svg>';
};

/* Slide 12: vacuum chỉ xoá file đã lưu trữ */
const vacuum = () => {
  let s = `<svg viewBox="0 0 1110 220" width="1110" height="220" font-family="Arial">${DEFS}`;
  s += T(270, 26, '1 · vacuum alone', 20, { a: 'middle', w: 800, f: RD });
  s += R(60, 45, 420, 80, '#fff7ef', OR);
  s += T(270, 80, 'system.journal (ACTIVE, being written)', 17, { a: 'middle', w: 700 });
  s += T(270, 106, '24 MB in use', 17, { a: 'middle', f: '#555' });
  s += T(270, 160, 'vacuum skips it → freed 0B', 20, { a: 'middle', w: 800, f: RD });
  s += T(830, 26, '2 · --rotate, then vacuum', 20, { a: 'middle', w: 800, f: GR });
  s += R(620, 45, 200, 80, '#f3f3f3', GY, { dash: 1 });
  s += T(720, 80, 'system@….journal', 16, { a: 'middle', m: 1 });
  s += T(720, 106, 'archived · 21.7M', 16, { a: 'middle', f: RD, w: 700 });
  s += R(840, 45, 210, 80, '#fff7ef', OR);
  s += T(945, 80, 'new active file', 17, { a: 'middle', w: 700 });
  s += T(945, 106, 'small', 16, { a: 'middle', f: '#555' });
  s += T(830, 160, 'vacuum deletes the archive → 8M left', 20, { a: 'middle', w: 800, f: GR });
  s += T(555, 205, 'Permanent fix: SystemMaxUse= / MaxRetentionSec= in /etc/systemd/journald.conf.d/', 17, { a: 'middle', m: 1, f: BR });
  return s + '</svg>';
};

/* Slide 13: json-file không giới hạn vs có xoay vòng */
const dockerBars = () => {
  let s = `<svg viewBox="0 0 1110 210" width="1110" height="210" font-family="Arial">`;
  const max = 44323006, W = 800;
  const bar = (y, lab, sub, v, txt, c) => {
    let r = T(20, y + 26, lab, 20, { w: 800 }) + T(20, y + 50, sub, 15, { m: 1, f: '#666' });
    const w = Math.max(8, Math.round((v / max) * W));
    r += R(260, y + 6, w, 44, c + '33', c, { rx: 5, sw: 2 });
    r += T(260 + w + 12, y + 36, txt, 19, { w: 800, f: c });
    return r;
  };
  s += bar(10, 'default', 'map[]', max, '', RD);
  s += T(660, 52, '822 854 lines · 44 MB in 5 s', 20, { a: 'middle', w: 800, f: RD });
  s += bar(100, 'rotated', 'max-size:1m max-file:3', 894186, '16 559 lines · 0.9 MB kept', GR);
  s += T(555, 200, 'json-file also wraps every line in JSON with a timestamp, so the file on disk is bigger than the text', 16, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 15: logrotate create vs copytruncate — fd bám theo inode */
const rotatePic = () => {
  let s = `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial">${DEFS}`;
  // create
  s += T(270, 24, 'create (rename)', 21, { a: 'middle', w: 800, f: RD });
  s += R(20, 50, 130, 60, '#fff7ef', OR); s += T(85, 85, 'app · fd 3', 17, { a: 'middle', w: 700 });
  s += R(300, 40, 220, 50, '#fdf0ee', RD); s += T(410, 70, 'app.log.1  8271 B ↑', 16, { a: 'middle', m: 1, w: 700 });
  s += R(300, 120, 220, 50, '#fff', GY); s += T(410, 150, 'app.log  0 B', 16, { a: 'middle', m: 1 });
  s += A(152, 75, 296, 66, RD);
  s += T(270, 210, 'inode renamed — the app keeps writing into the OLD file', 16, { a: 'middle', f: RD });
  s += T(270, 236, 'fix: postrotate signal so the app reopens', 16, { a: 'middle', f: '#555' });
  // copytruncate
  s += T(840, 24, 'copytruncate', 21, { a: 'middle', w: 800, f: GR });
  s += R(590, 50, 130, 60, '#fff7ef', OR); s += T(655, 85, 'app · fd 3', 17, { a: 'middle', w: 700 });
  s += R(860, 40, 230, 50, '#f1f9f4', GR); s += T(975, 70, 'app.log  4102 B ↑', 16, { a: 'middle', m: 1, w: 700 });
  s += R(860, 120, 230, 50, '#fff', GY); s += T(975, 150, 'app.log.1.gz  651 B', 16, { a: 'middle', m: 1 });
  s += A(722, 75, 856, 66, GR);
  s += T(840, 210, 'copied, then truncated in place — same inode', 16, { a: 'middle', f: GR });
  s += T(840, 236, 'cost: lines between copy and truncate can be lost', 16, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.6',
}, [
  { cover: true, t: 'The logs the system keeps', sub: 'systemctl, journalctl, dmesg<br>— and the logs that fill the disk' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read <code class="i">systemctl status</code> line by line, and spot a <b>crash loop</b></li>
<li>Filter <code class="i">journalctl</code> by service, time window and priority</li>
<li>Find the kernel's own record of an <b>OOM kill</b> in <code class="i">dmesg</code></li>
<li>The incident: <b>logs that grow until the disk is full</b> — journald and Docker</li>
<li>Rotate file logs with <b>logrotate</b> without losing the writer</li>
</ul>
${box('A real systemd, thrown away after', 'Everything runs inside a disposable container with systemd as PID 1 — so the commands are exactly the ones you type on a VPS.', 'lam')}` },

  { t: 'Three places to ask when something died at 3 a.m.', giua: true, body: `
${threePlaces()}
${box('Order of questions', 'systemctl: is it up, restarting? → journalctl: what did it say just before? → kernel log: did the OS kill it (OOM, disk error)?', 'lam')}` },

  { t: 'systemctl status: state, PID, cgroup, last lines', giua: true, body: two(
    term(`$ systemctl status ctw-api --no-pager
● ctw-api.service - CT Work API (lab)
     Loaded: loaded (/etc/systemd/system/ctw-api.service; enabled; …)
     Active: active (running) since Wed 2026-10-28 18:09:21 +07; 12s ago
   Main PID: 127 (node)
      Tasks: 7 (limit: 9563)
     Memory: 10M (max: 300M, available: 289.9M, peak: 11M)
        CPU: 28ms
     CGroup: /system.slice/ctw-api.service
             └─127 /usr/local/bin/node /lab/ch02/api-log.js

Oct 28 18:09:26 vps-lab node[127]: ERROR GET /api/v1/orders 500 …
Oct 28 18:09:27 vps-lab node[127]: GET /api/v1/feed 200 18ms`, { hl: [4, 5, 7] }),
    `<ul style="font-size:21px">
<li><b>Loaded … enabled</b>: unit file path; starts at boot</li>
<li><b>Active … 12s ago</b>: "up 12 s" every time you look = restarting</li>
<li><b>Main PID</b>: what to inspect with ps, /proc</li>
<li><b>Tasks, Memory (max), CPU</b>: read from the service's cgroup</li>
<li>Last journal lines of this unit</li>
</ul>`, 'r64') },

  { t: 'Four quick crashes, then systemd gives up', giua: true, body: `
${crashLoop()}
${term(`$ journalctl -u bao-cao --no-pager | tail -6
… bao-cao.service: Main process exited, code=exited, status=1/FAILURE
… bao-cao.service: Scheduled restart job, restart counter is at 4.
… bao-cao.service: Start request repeated too quickly.
… Failed to start bao-cao.service - Nightly report (lab).`, { hl: [4] })}
<p style="margin:0;font-size:20px;text-align:center">After fixing the cause: <code class="i">systemctl reset-failed bao-cao &amp;&amp; systemctl start bao-cao</code></p>` },

  { t: 'journalctl: filter by unit, time and priority first', giua: true, body: `
${big(`$ journalctl -u ctw-api --since "-30s" --no-pager | tail -4
Oct 28 18:09:30 vps-lab node[127]: GET /api/v1/feed 200 14ms
Oct 28 18:09:31 vps-lab node[127]: GET /api/v1/feed 200 15ms
Oct 28 18:09:31 vps-lab node[127]: ERROR GET /api/v1/orders 500 db timeout after 3000ms (request 10)
Oct 28 18:09:32 vps-lab node[127]: GET /api/v1/feed 200 16ms
$ journalctl -u ctw-api -p err -o short-iso --no-pager -n 1
2026-10-28T18:09:31+07:00 vps-lab node[127]: ERROR GET /api/v1/orders 500 db timeout after 3000ms (request 10)`, { hl: [7] })}
<table class="t" style="font-size:20px">
<tr><th>-u UNIT</th><th>--since / --until</th><th>-p err</th><th>-n · -f · -b</th><th>-o short-iso</th></tr>
<tr><td>one service</td><td>the incident window</td><td>priority 0–3 only</td><td>last N · follow · this boot</td><td>time with zone</td></tr>
</table>` },

  { t: 'journald knows a line is an error only if the app says so', to: true, giua: true, body: `
<ul>
<li>journald gives every line a <b>priority</b>: 0 emerg … 3 err … 6 info, 7 debug</li>
<li>Our app prefixes error lines with <code class="i">&lt;3&gt;</code> (systemd's <code class="i">SyslogLevelPrefix</code>) — so <code class="i">-p err</code> finds them</li>
<li>A plain <code class="i">console.error</code> is stored as <b>info</b>: <code class="i">-p err</code> shows nothing</li>
</ul>
${box('Habit', 'Narrow by unit and time first, then grep the text: <code class="i">journalctl -u ctw-api --since "10 min ago" | grep -i error</code>', 'xanh')}` },

  { t: 'The kernel records the kills the process cannot', giua: true, body: two(
    term(`$ systemd-run --unit=oom-demo -p MemoryMax=64M \\
    -p MemorySwapMax=0 /usr/local/bin/node \\
    --max-old-space-size=1024 -e '…grow forever…'
$ systemctl status oom-demo --no-pager | head -4
× oom-demo.service - [systemd-run] …
     Active: failed (Result: oom-kill) since …
$ journalctl -u oom-demo | grep -iE 'oom|killed|exited'
…: The kernel OOM killer killed some processes in this unit.
…: Main process exited, code=killed, status=9/KILL
…: Failed with result 'oom-kill'.`, { hl: [6, 9] }),
    term(`$ journalctl -k --no-pager | grep -E 'Killed process'
Oct 28 18:09:54 vps-lab kernel: Memory cgroup
  out of memory: Killed process 85118 (node)
  total-vm:795676kB, anon-rss:63532kB, …
$ dmesg -T | grep -E 'Killed process'
[Wed Oct 28 18:09:54 2026] Memory cgroup out of
  memory: Killed process 85118 (node) …`, { hl: [3, 7] }) + box('anon-rss:63532kB', '≈ 64 MB: the memory it held when it died — right at MemoryMax.', 'lam')) },

  { t: 'Three witnesses agree on one OOM kill', giua: true, body: `
${witnesses()}
${box('Other kernel lines worth a grep', '<code class="i">segfault</code> · <code class="i">I/O error</code> · <code class="i">EXT4-fs error</code> · <code class="i">blocked for more than 120 seconds</code> (a task stuck in D state)', '')}` },

  { t: 'Incident: logs that grow until the disk is full', giua: true, body: `
<table class="t" style="font-size:20px">
<tr><th style="width:16%">Symptom</th><td>Disk use climbs every day with no deploy. The weekly VPS cleanup has a step "Truncate container logs &gt; 200MB" plus <code class="i">journalctl --vacuum-time=7d</code>; on 12/07/2026 vacuuming the journal helped recover a full disk.</td></tr>
<tr><th>Measure</th><td><code class="i">journalctl --disk-usage</code> · <code class="i">docker inspect -f '{{.HostConfig.LogConfig}}'</code> → <code class="i">json-file map[]</code></td></tr>
<tr><th>Cause</th><td>Docker's default json-file keeps every line forever; the project's compose sets no <code class="i">logging:</code>. journald keeps up to 10% of the filesystem (max 4 GB).</td></tr>
<tr><th>Fix</th><td>Rotate: journald <code class="i">SystemMaxUse=</code>, Docker <code class="i">max-size</code> + <code class="i">max-file</code>, logrotate for files; <code class="i">truncate</code> live logs, never <code class="i">rm</code>.</td></tr>
<tr><th>Prevent</th><td>Log limits from day one; info, not debug, in production; alert on disk growth rate.</td></tr>
</table>` },

  { t: 'A chatty service added 16 MB of journal in 20 seconds', giua: true, body: two(
    big(`$ journalctl --disk-usage
Archived and active journals take up 8M in the file system.
$ systemctl start chatty; sleep 20; systemctl stop chatty
$ journalctl --disk-usage
Archived and active journals take up 24M in the file system.
$ journalctl -u chatty --no-pager | wc -l
37505`, { hl: [5, 7] }),
    `<ul style="font-size:22px">
<li>One debug line per loop iteration: <b>37 505 lines</b></li>
<li>8 MB → <b>24 MB</b>: each short line costs ~400+ bytes with metadata (time, PID, unit, cgroup…)</li>
<li>Production: log at info, not debug</li>
</ul>`, 'r64') },

  { t: 'Vacuum frees nothing until the active file is rotated', giua: true, body: `
${vacuum()}
${term(`$ journalctl --vacuum-size=10M
Vacuuming done, freed 0B of archived journals from /var/log/journal/8b44…
$ journalctl --rotate; journalctl --vacuum-size=10M
Deleted archived journal /var/log/journal/8b44…/system@822e…journal (21.7M).
Vacuuming done, freed 21.7M of archived journals from /var/log/journal/8b44…`, { hl: [2, 5] })}` },

  { t: 'Docker logs grow forever unless you set max-size', giua: true, body: `
${dockerBars()}
${two(term(`$ docker info --format '{{.LoggingDriver}}'
json-file
$ docker inspect -f '{{.HostConfig.LogConfig.Type}}
    {{.HostConfig.LogConfig.Config}}' os-c26-chatty
json-file map[]`), term(`$ docker run -d --name os-c26-rot \\
    --log-opt max-size=1m --log-opt max-file=3 …
$ docker logs os-c26-rot 2>&1 | wc -lc
   16559  894186`))}` },

  { t: 'Set log limits per service in compose', giua: true, body: two(
    sql(`services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"`, { lang: 'yaml' }),
    `<ul style="font-size:23px">
<li>At most 3 files × 10 MB per container — forever</li>
<li><code class="i">"log-opts"</code> in <code class="i">/etc/docker/daemon.json</code> sets a default…</li>
<li>…but only for containers <b>created after</b> the change: recreate the old ones</li>
</ul>
${box('Until then', 'A live container log can be emptied with truncate -s 0 — never rm (the file stays open).', 'do2')}`, 'r46') },

  { t: 'logrotate: the writer follows the inode, not the name', giua: true, body: `
${rotatePic()}
${term(`$ logrotate -f /etc/logrotate.d/ctw; sleep 2; ls -l /var/log/ctw
-rw-r--r-- 1 root root    0 Oct 28 18:29 app.log
-rw-r--r-- 1 root root 8271 Oct 28 18:29 app.log.1
$ ls -l /proc/$P/fd | grep ctw
l-wx------ 1 root root 64 Oct 28 18:29 3 -> /var/log/ctw/app.log.1`, { hl: [5] })}` },

  { t: 'Cheat sheet — services and logs', giua: true, body: `
<table class="t" style="font-size:20px">
<tr><th style="width:42%">You want to know…</th><th>Run</th></tr>
<tr><td>Is the service up, restarting, how big</td><td><code class="i">systemctl status UNIT</code> · <code class="i">systemctl --failed</code></td></tr>
<tr><td>What it printed around the incident</td><td><code class="i">journalctl -u UNIT --since "10 min ago"</code></td></tr>
<tr><td>Only errors (if labelled) · live</td><td><code class="i">journalctl -u UNIT -p err</code> · <code class="i">-f</code></td></tr>
<tr><td>Did the kernel kill something</td><td><code class="i">dmesg -T | grep -i "killed process"</code> · <code class="i">journalctl -k</code></td></tr>
<tr><td>How big is the journal · shrink it</td><td><code class="i">journalctl --disk-usage</code> · <code class="i">--rotate</code> then <code class="i">--vacuum-size=…</code></td></tr>
<tr><td>Docker log limits of a container</td><td><code class="i">docker inspect -f '{{.HostConfig.LogConfig}}' NAME</code></td></tr>
</table>
${box('Rule of thumb', 'Every log needs a limit: journald SystemMaxUse, Docker max-size/max-file, logrotate for files.', 'xanh')}` },
]);
