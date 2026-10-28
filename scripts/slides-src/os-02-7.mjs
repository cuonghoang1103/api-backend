/**
 * os-02-7 — khoá "Operating Systems for Developers", bài 2.7 "Read along with Claude" (28/10/2026).
 * Khuôn chuẩn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output = CHẠY THẬT:
 * content/courses/operating-systems-for-developers/lab/out/c27-mac.out.txt (máy Mac soạn bài, chỉ đọc) và c27-ssh.out.txt
 * (hai container lab: máy nhà + "VPS" có systemd/sshd). Giảng: giang/os-02-7.mjs (walk()).
 */
import { lamDeck, sh, two as two0, box, cards, steps } from './_pg-chung.mjs';

export const deck = { key: 'os-02-7', code: 'OS 2.7', title: 'Read along with Claude', sub: 'Operating Systems · Chapter 2' };

const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const Lx = (x1, y1, x2, y2, c = '#b85a2b') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="2"/>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', RD = '#c0392b';

/* Slide 8: pkill -f khớp chính cái shell chạy nó */
const selfKill = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  s += R(10, 20, 1090, 70, '#0f1720', '#0f1720', { rx: 8 });
  s += T(30, 52, 'remote shell:', 16, { f: '#7d8b99', m: 1 });
  s += T(30, 76, 'bash -c \'pkill -f "f5-train|…"; rm -rf ~/<tspan fill="#f2cc60" font-weight="700">f5-train</tspan> …\'', 19, { f: '#d6dde6', m: 1 });
  s += R(10, 125, 340, 105, '#fdf0ee', RD);
  s += T(180, 162, 'pkill -f searches every', 19, { a: 'middle', w: 700, f: RD });
  s += T(180, 190, 'command line for "f5-train"', 19, { a: 'middle', w: 700, f: RD });
  s += T(180, 216, '… including its own shell', 17, { a: 'middle', f: '#555' });
  s += R(385, 125, 340, 105, '#fdf0ee', RD);
  s += T(555, 162, 'the shell is killed', 19, { a: 'middle', w: 700, f: RD });
  s += T(555, 190, 'before rm -rf runs', 19, { a: 'middle', w: 700, f: RD });
  s += T(555, 216, 'nothing deleted, log empty', 17, { a: 'middle', f: '#555' });
  s += R(760, 125, 340, 105, '#fff7ef', OR);
  s += T(930, 162, 'script still prints', 19, { a: 'middle', w: 700, f: BR });
  s += T(930, 192, '"✓ done"', 22, { a: 'middle', w: 800, f: BR });
  s += T(930, 216, 'found only by checking with ls', 17, { a: 'middle', f: '#555' });
  s += `<defs><marker id="m8" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${BR}"/></marker></defs>`;
  s += `<line x1="352" y1="178" x2="381" y2="178" stroke="${BR}" stroke-width="3" marker-end="url(#m8)"/>`;
  s += `<line x1="727" y1="178" x2="756" y2="178" stroke="${BR}" stroke-width="3" marker-end="url(#m8)"/>`;
  return s + '</svg>';
};

/* Slide 12: giải phẫu một dòng progress2 của rsync — mỗi mẩu vẽ riêng ở đúng cột ký tự (SVG gộp khoảng trắng) */
const progLine = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  s += R(20, 120, 1070, 66, '#0f1720', '#0f1720', { rx: 8 });
  const fs = 25, cw = fs * 0.602, x0 = 44;
  const line = '52,428,800  63%  19.98MB/s  0:00:02  (xfr#2, to-chk=1502/1505)';
  const toks = [];
  line.replace(/[^ ]+/g, (m, i) => { toks.push([m, i]); return m; });
  toks.forEach(([m, i]) => { s += T(x0 + i * cw, 163, m, fs, { f: '#d6dde6', m: 1 }); });
  const seg = (str) => { const i = line.indexOf(str); return [x0 + i * cw, x0 + (i + str.length) * cw]; };
  const lab = [
    ['52,428,800', 'bytes so far', 'up', OR],
    ['63%', 'of the total', 'down', BL],
    ['19.98MB/s', 'speed (cap 20 MB/s)', 'up', GR],
    ['0:00:02', 'time left (estimate)', 'down', BR],
    ['xfr#2', 'files sent so far', 'up', BL],
    ['to-chk=1502/1505', 'still to check / total', 'down', RD],
  ];
  lab.forEach(([str, txt, pos, c]) => {
    const [a, b] = seg(str); const m = (a + b) / 2;
    s += `<rect x="${a - 4}" y="134" width="${b - a + 8}" height="38" rx="5" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    if (pos === 'up') { s += Lx(m, 134, m, 92, c); s += T(m, 80, txt, 21, { a: 'middle', w: 700, f: c }); }
    else { s += Lx(m, 172, m, 218, c); s += T(m, 242, txt, 21, { a: 'middle', w: 700, f: c }); }
  });
  s += T(555, 305, 'to-chk=0/1505 = finished · after the last line come the totals (sent … bytes, speedup)', 20, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 13: delta transfer — 83 MB lần đầu vs 32 KB lần hai */
const delta = () => {
  let s = `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial">`;
  s += T(20, 58, 'first sync', 25, { w: 800 });
  s += R(240, 22, 850, 56, BR + '33', BR, { rx: 6 });
  s += T(665, 59, 'sent 83,255,621 bytes · speedup 1.00', 24, { a: 'middle', w: 700, f: BR });
  s += T(20, 158, 'after a 1-line edit', 25, { w: 800 });
  s += R(240, 122, 7, 56, GR, GR, { rx: 2 });
  s += T(264, 159, 'sent 32,774 bytes · speedup 1,308.58', 24, { w: 700, f: GR });
  s += T(555, 250, 'rsync compares block checksums with the server and sends only what changed + the file list', 21, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.7',
}, [
  { cover: true, t: 'Read along with Claude', sub: 'Real terminal sessions, annotated line by line<br>— and the one page to keep open when a box is slow' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A <b>method</b> to read any terminal log: command → header → the number → exit code</li>
<li>Transcript 1: <b>is the Mac running out of disk?</b> (df, du, docker system df)</li>
<li>Transcript 2: <b>what runs, who holds the port?</b> (pgrep, ps, lsof)</li>
<li>Transcript 3: <b>is the server healthy?</b> over ssh</li>
<li>Transcript 4: <b>deploy</b> with rsync, then the smoke test</li>
<li>The <b>one-page cheat sheet</b> for the first five minutes</li>
</ul>
${box('All real output', 'Transcripts 1–2: the Mac this course was written on (read-only). 3–4: two lab containers standing in for the home machine and the VPS.', 'lam')}` },

  { t: 'Read every transcript in the same four steps', to: true, giua: true, body: `
${steps([
    'A line starting with <code class="i">$</code> is a command; everything until the next <code class="i">$</code> is its output.',
    'Read the command as a <b>question</b>: <code class="i">df -h</code> = "how full is each disk?". Flags change the question.',
    'Read the <b>header row</b>, then find the one or two numbers that answer it. The rest is context.',
    'Look for the <b>exit code</b> (<code class="i">exit=…</code>, <code class="i">echo $?</code>): 0 = fine, anything else = read the line above.',
  ])}
${box('Why it works', 'Every tool in Chapter 2 prints a table: a header, then rows. Once you know which column answers which question, a 40-line log becomes three facts.', 'xanh')}` },

  { t: 'Transcript 1: is the Mac running out of disk?', giua: true, body: two(
    sh(`$ df -h /System/Volumes/Data
Filesystem    Size  Used  Avail Capacity
/dev/disk3s5 926Gi 847Gi  39Gi    96%
$ du -sh frontend/node_modules \\
        frontend/.next node_modules
1.5G  frontend/node_modules
1.4G  frontend/.next
750M  node_modules
$ du -sh "$TMPDIR"
6.1G  /var/folders/vz/…/T/`),
    `<ul style="font-size:23px">
<li>macOS keeps your files on the <b>Data</b> volume, not <code class="i">/</code></li>
<li><b>39 GB available</b> (96% used): above the 20 GB warning line — fine for today</li>
<li><code class="i">du -sh</code>: one total per folder. node_modules and .next are <b>rebuildable</b> (npm ci, next build)</li>
<li><code class="i">$TMPDIR</code>: where video renders leave ~12 GB bundles — 6.1 GB today</li>
</ul>
<p class="nho">df columns trimmed to fit; macOS df also prints inode columns (1% used).</p>`, 'r46') + box('Rebuildable vs precious', 'Caches, build output and installed packages can be regenerated — delete them first. Videos, databases and volumes cannot — never without the owner.', 'xanh') },

  { t: 'docker system df: what Docker holds, and what is reclaimable', giua: true, body: `
${sh(`$ docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          49        25        33.36GB   11.36GB (34%)
Containers      43        8         2.04GB    1.819GB (89%)
Local Volumes   102       32        9.715GB   3.32GB (34%)
Build Cache     100       0         5.708GB   1.585GB`)}
${cards([
    ['SIZE', 'Disk used by each kind of Docker object.'],
    ['RECLAIMABLE', 'Not used by anything right now — candidates for <b>prune</b>.'],
    ['But volumes…', 'may hold databases. Reclaimable ≠ "delete now". Ask first.'],
  ])}
${box('The decision Claude writes', '"39 GB free, no action needed; largest rebuildable items listed." Nothing of the owner’s is deleted without asking.', 'xanh')}` },

  { t: 'Transcript 2: what is running, and how much memory?', giua: true, body: `
${sh(`$ pgrep -l node | head -3
13420 node
17309 node
22318 node
$ ps -axo pid,%cpu,rss,etime,comm -m | head -4
  PID  %CPU     RSS     ELAPSED COMM
96158   0.0 1459248    15:06:23 next-server (v14.2.35)
16043 357.0 5295888    08:33:44 …/com.apple.Virtualization.VirtualMachine
 1645   1.1  983168 04-07:41:05 claude`)}
${cards([
    ['pgrep -l', 'PIDs + names. Not <b>-fl</b>: full command lines can contain tokens.'],
    ['next-server, 1.4 GB, 15 h', 'A Next dev server left running — it renamed itself (lesson 2.5).'],
    ['Virtualization VM, 357%', 'Docker Desktop’s Linux VM: 3.5 cores busy with containers.'],
  ])}
${box('Read it as', 'Who uses the most memory, for how long — then decide: leave it, stop it, or ask the owner.', 'lam')}` },

  { t: 'Same question, two different lsofs', giua: true, body: two(
    `<div class="tcap" style="font-size:20px">macOS (the Mac above)</div>` + sh(`$ lsof -nP -iTCP:3123 -sTCP:LISTEN
COMMAND   PID  USER  FD  TYPE NAME
node    96158 admin 13u  IPv6 TCP *:3123
                              (LISTEN)`, { sm: true }) + box('Found', 'macOS lsof shows the executable name <code class="i">node</code> — so "kill by port with lsof" worked on the Mac.', 'xanh'),
    `<div class="tcap" style="font-size:20px">Linux lab (lesson 2.5)</div>` + sh(`$ lsof -ti:3000; echo "lsof exit=$?"
lsof exit=1
$ ss -ltnp 'sport = :3000'
LISTEN 0 511 *:3000 *:*
 users:(("next-server (v1",pid=51,fd=18))`, { sm: true }) + box('Missed', 'lsof 4.99.4 skipped a process name containing “(”. <code class="i">ss</code> and <code class="i">fuser</code> still see it.', 'do2')) + box('Rule', 'On Linux find a port’s owner with <code class="i">ss -ltnp</code> and free it with <code class="i">fuser -k PORT/tcp</code>; on macOS <code class="i">lsof -ti:PORT</code> works.', 'lam') },

  { t: 'A pkill -f that killed itself', to: true, giua: true, body: `
${selfKill()}
${box('Rules (26/10/2026)', 'Delete first, then kill by exact name (no <code class="i">-f</code>) or by PID. Always verify the result with a separate command — a green "done" proves nothing.', 'do2')}` },

  { t: 'Transcript 3: is the server healthy? — over ssh', giua: true, body: two(
    sh(`$ ssh -o BatchMode=yes -o ConnectTimeout=5 vps \\
      'hostname; uptime'
Warning: Permanently added 'vps' (ED25519)
  to the list of known hosts.
vps-lab
 18:12:32 up 8:12, 0 users, load average: 2.41,…
$ ssh vps "df -h / | tail -1; free -m | sed -n 2p"
overlay  911G  48G  818G   6% /
Mem:  7934  3205  3382  156  1700  4728
$ ssh vps 'systemctl is-active ctw-web; …'
active
MainPID=169
NRestarts=0
MemoryCurrent=10719232`, { sm: true }),
    `<ul style="font-size:23px">
<li><b>hostname</b>: you are on the right machine</li>
<li><b>load</b> 2.41 — compare with its cores</li>
<li><b>6%</b> disk used, <b>4728</b> MB available</li>
<li><b>active</b>, <b>NRestarts=0</b>: no crash loop; ~10 MB of memory (bytes)</li>
</ul>
<p class="nho">Lines wrapped to fit.</p>`, 'r64') + box('One ssh, one question', 'Each line asks the server one thing (who, how loaded, how full, is the service up). Scripts check these before and after every deploy.', 'lam') },

  { t: 'ssh flags and exit codes you will see in scripts', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:38%">You see</th><th>It means</th></tr>
<tr><td><code class="i">-o BatchMode=yes</code></td><td>never prompt for a password — fail instead of hanging</td></tr>
<tr><td><code class="i">-o ConnectTimeout=5</code></td><td>give up after 5 s if the host does not answer</td></tr>
<tr><td><code class="i">Permanently added … known hosts</code></td><td>first connection: the server’s key is saved; a changed key is refused</td></tr>
<tr><td><code class="i">Connection refused</code>, <code class="i">exit=255</code></td><td>nothing listens on that port; 255 = <b>ssh itself</b> failed</td></tr>
<tr><td>any other exit code</td><td>the exit code of the <b>remote</b> command, passed through</td></tr>
</table>
${sh(`$ ssh -o BatchMode=yes -o ConnectTimeout=3 -p 2222 vps true; echo "exit=$?"
ssh: connect to host vps port 2222: Connection refused
exit=255`, { sm: true })}` },

  { t: 'Transcript 4: a deploy with rsync', giua: true, body: `
${sh(`$ du -sh /srv/build; find /srv/build -type f | wc -l
81M     /srv/build
1503
$ rsync -az --delete --bwlimit=20000 --info=progress2,stats1 /srv/build/ vps:/srv/app/ | …
         32,768   0%    0.00kB/s    0:00:00
     22,413,312  26%   19.55MB/s    0:00:03
     26,214,400  31%   20.69MB/s    0:00:01 (xfr#1, to-chk=1503/1505)
     52,428,800  63%   19.98MB/s    0:00:02 (xfr#2, to-chk=1502/1505)
     83,143,200 100%   19.58MB/s    0:00:04 (xfr#1503, to-chk=0/1505)
sent 83,255,621 bytes  received 28,595 bytes  18,507,603.56 bytes/sec
total size is 83,143,200  speedup is 1.00`, { sm: true })}
${box('The flags', '<code class="i">-a</code> keep permissions/times/links · <code class="i">-z</code> compress on the wire · <code class="i">--delete</code> remove files gone locally · <code class="i">progress2</code> one line for the whole transfer. Some progress lines omitted.', 'lam')}` },

  { t: 'Reading one progress2 line', giua: true, body: `
${progLine()}
${box('Watch for', 'A speed that drops to kB/s, or a time-left that keeps growing: the network or the server disk is the bottleneck.', 'lam')}` },

  { t: 'The second deploy sends only what changed', giua: true, body: `
${delta()}
${box('Why it matters', 'rsync is fast on re-deploys because of this delta transfer. It also copies whatever is on disk at that moment — the reason deploy.sh once shipped another session’s half-saved file, and why deploy-nha.sh ships commits instead.', 'do2')}` },

  { t: 'The smoke test reads status codes', giua: true, body: two(
    sh(`$ ssh vps 'for p in /health /api/v1/admin/users \\
    /api/v1/gifs; do echo "$p $(curl -s -o \\
    /dev/null -w "%{http_code}" \\
    localhost:3000$p)"; done'
/health 200
/api/v1/admin/users 401
/api/v1/gifs 404`),
    `<table class="t" style="font-size:21px">
<tr><th>Code</th><th>Meaning after a deploy</th></tr>
<tr><td><b>200</b></td><td>route mounted, public — healthy</td></tr>
<tr><td><b>401</b></td><td>route mounted, needs login — healthy</td></tr>
<tr><td><b style="color:#c0392b">404</b></td><td>route not mounted: <b>stale or partial build</b> — fail the deploy</td></tr>
</table>`, 'r64') + box('Learned the hard way (02/07/2026)', 'Production ran a stale build that never mounted /gifs; the browser looked "flaky", an unauthenticated curl said 404 in one second.', 'lam') },

  { t: 'The first five minutes when a box is slow (1/2)', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:5%">#</th><th style="width:30%">Run</th><th style="width:28%">Look at</th><th>Bad sign → lesson</th></tr>
<tr><td>1</td><td><code class="i">uptime</code></td><td>load 1/5/15 vs nproc</td><td>load ≫ cores, rising → 2.2</td></tr>
<tr><td>2</td><td><code class="i">dmesg -T | tail</code></td><td>kernel complaints</td><td>Killed process → 2.3 · I/O error → 2.4</td></tr>
<tr><td>3</td><td><code class="i">vmstat 1 5</code></td><td>r, b, si/so, us sy wa st</td><td>b + wa → disk · si/so → memory · st → noisy host</td></tr>
<tr><td>4</td><td><code class="i">mpstat -P ALL 1 1</code></td><td>per-core usage</td><td>one core at 100% → single-threaded hog</td></tr>
<tr><td>5</td><td><code class="i">pidstat 1 1</code> · <code class="i">-d</code></td><td>per-process CPU · disk</td><td>the culprit’s PID and command</td></tr>
</table>
${box('Order matters', 'USE: for each resource check utilization, saturation, errors — before you change anything.', 'xanh')}` },

  { t: 'The first five minutes when a box is slow (2/2)', giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:5%">#</th><th style="width:30%">Run</th><th style="width:28%">Look at</th><th>Bad sign → lesson</th></tr>
<tr><td>6</td><td><code class="i">iostat -dxz 1 2</code></td><td>await, aqu-sz, %util</td><td>tens–hundreds of ms, queue &gt; 1 → 2.4</td></tr>
<tr><td>7</td><td><code class="i">free -m</code></td><td>available</td><td>small and shrinking → 2.3</td></tr>
<tr><td>8</td><td><code class="i">df -h</code> · <code class="i">df -i</code></td><td>Use%, IUse%</td><td>&gt; 90% → 2.4</td></tr>
<tr><td>9</td><td><code class="i">ss -s</code> · <code class="i">ss -tulpn</code></td><td>connections, listeners</td><td>huge TIME_WAIT, missing listener → 2.5</td></tr>
<tr><td>10</td><td><code class="i">top -b -n 1</code><br><code class="i">systemctl --failed</code></td><td>the whole picture</td><td>confirm before changing anything</td></tr>
</table>
${box('In a container', '<code class="i">free</code> and the load average describe the host. Read <code class="i">docker stats</code> or the cgroup files.', 'lam')}` },

  { t: 'Symptom → first command', giua: true, body: `
<table class="t" style="font-size:19px">
<tr><th style="width:40%">Symptom</th><th>First command</th></tr>
<tr><td>"No space left on device"</td><td><code class="i">df -h</code> → <code class="i">du -xh --max-depth=1 / | sort -h</code> · <code class="i">docker system df</code></td></tr>
<tr><td>Deleted a big file, space did not return</td><td><code class="i">lsof +L1</code></td></tr>
<tr><td>"No space" but df shows free space</td><td><code class="i">df -i</code></td></tr>
<tr><td>Exit 137, killed with no error</td><td><code class="i">dmesg -T | grep -i "killed process"</code></td></tr>
<tr><td>Disk grows every day</td><td><code class="i">journalctl --disk-usage</code> · Docker LogConfig</td></tr>
<tr><td>API frozen, CPU "only 10%"</td><td><code class="i">ps -eo pid,stat,%cpu,comm --sort=-%cpu | head</code></td></tr>
<tr><td>EMFILE: too many open files</td><td><code class="i">ls /proc/PID/fd | wc -l</code> · <code class="i">/proc/PID/limits</code></td></tr>
<tr><td>EADDRINUSE</td><td><code class="i">ss -ltnp 'sport = :PORT'</code> → <code class="i">fuser -k PORT/tcp</code></td></tr>
<tr><td>"Cannot fork", many Z</td><td><code class="i">ps -eo stat,pid,ppid,comm | grep '^Z'</code></td></tr>
</table>` },
]);
