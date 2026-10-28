/**
 * os-02-5 — khoá "Operating Systems for Developers", bài 2.5 "Ports and file descriptors" (28/10/2026).
 * Khuôn chuẩn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Số liệu = CHẠY THẬT trong ảnh os-lab
 * (content/courses/operating-systems-for-developers/lab/out/c25-net.out.txt). Giảng: giang/os-02-5.mjs (walk()).
 */
import { lamDeck, sql, sh, two as two0, box, cards } from './_pg-chung.mjs';

export const deck = { key: 'os-02-5', code: 'OS 2.5', title: 'Ports and file descriptors', sub: 'Operating Systems · Chapter 2' };

const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, o);
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 9}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const A = (x1, y1, x2, y2, c = '#b85a2b') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3" marker-end="url(#ar)"/>`;
const DEFS = `<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
const OR = '#e08a1e', BR = '#b85a2b', BL = '#336791', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';

/* Slide 3: cổng = một fd của một tiến trình */
const portFd = () => {
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">${DEFS}`;
  s += R(20, 20, 420, 260, '#fff7ef', OR);
  s += T(230, 52, 'process node · PID 9', 21, { a: 'middle', w: 800, f: BR });
  s += T(230, 80, 'its file-descriptor table', 16, { a: 'middle', f: '#666' });
  const rows = [['0', 'stdin'], ['1', 'stdout'], ['2', 'stderr'], ['…', '…'], ['18', 'socket']];
  rows.forEach(([n, v], i) => {
    const y = 96 + i * 34, hl = n === '18';
    s += R(60, y, 70, 28, hl ? '#d6e6f5' : '#fff', hl ? BL : GY, { rx: 4, sw: hl ? 2.5 : 1.5 });
    s += T(95, y + 20, n, 17, { a: 'middle', m: 1, w: 700 });
    s += R(140, y, 260, 28, hl ? '#d6e6f5' : '#fff', hl ? BL : GY, { rx: 4, sw: hl ? 2.5 : 1.5 });
    s += T(270, y + 20, v, 17, { a: 'middle', w: hl ? 800 : 400, f: hl ? BL : '#333' });
  });
  s += A(402, 250, 600, 150);
  s += R(605, 80, 300, 140, '#eef4fa', BL);
  s += T(755, 120, 'kernel socket', 21, { a: 'middle', w: 800, f: BL });
  s += T(755, 155, 'TCP  *:3000', 22, { a: 'middle', m: 1, w: 700 });
  s += T(755, 190, 'state LISTEN', 18, { a: 'middle', f: '#555' });
  s += T(1000, 135, 'one owner', 18, { a: 'middle', w: 700, f: GR });
  s += T(1000, 160, 'per port', 18, { a: 'middle', w: 700, f: GR });
  return s + '</svg>';
};

/* Slide 5: giải phẫu một dòng ss */
const ssAnatomy = () => {
  let s = `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">`;
  const parts = [['tcp', 30, 60], ['LISTEN', 110, 100], ['0', 230, 40], ['511', 290, 60], ['*:3000', 380, 130], ['*:*', 540, 70], ['users:(("node",pid=9,fd=18))', 640, 440]];
  s += R(15, 120, 1080, 56, '#0f1720', '#0f1720', { rx: 8 });
  parts.forEach(([t, x, w]) => { s += T(x + w / 2, 156, t, 20, { a: 'middle', m: 1, f: '#d6dde6' }); });
  const lab = [
    ['Netid', 60, 92, 'protocol'],
    ['State', 160, 40, 'LISTEN = waits for clients'],
    ['Recv-Q', 250, 92, 'connections waiting for accept()'],
  ];
  lab.forEach(([h, x, y, d]) => {
    const st = h === 'Recv-Q';
    s += `<line x1="${x}" y1="${y + 6}" x2="${x}" y2="118" stroke="${GY}" stroke-width="1.5"/>`;
    s += T(st ? x - 6 : x, y - 14, h, 17, { a: st ? 'start' : 'middle', w: 800, f: BR });
    s += T(st ? x + 8 : x, y + 2, d, 15, { a: st ? 'start' : 'middle', f: '#555' });
  });
  const lab2 = [
    ['Send-Q', 320, 236, 'backlog size (Node 511)'],
    ['Local Address:Port', 445, 300, '* = every interface · 127.0.0.1 = this machine only'],
    ['Process', 860, 236, 'process, PID and the fd that IS the socket'],
  ];
  lab2.forEach(([h, x, y, d]) => {
    s += `<line x1="${x}" y1="178" x2="${x}" y2="${y - 34}" stroke="${GY}" stroke-width="1.5"/>`;
    s += T(x, y - 14, h, 17, { a: 'middle', w: 800, f: BL });
    s += T(x, y + 8, d, 15, { a: 'middle', f: '#555' });
  });
  return s + '</svg>';
};

/* Slide 9: ba cách tìm chủ cổng — cái nào bỏ sót next-server */
const threeWays = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  s += R(20, 20, 300, 210, '#fdf0ee', RD);
  s += T(170, 60, 'pkill -f "next start"', 18, { a: 'middle', m: 1, w: 700 });
  s += T(170, 100, 'matches the command line', 16, { a: 'middle', f: '#555' });
  s += T(170, 160, '✗ exit 1', 30, { a: 'middle', w: 800, f: RD });
  s += T(170, 200, 'name was overwritten', 16, { a: 'middle', f: '#555' });
  s += R(405, 20, 300, 210, '#fdf0ee', RD);
  s += T(555, 60, 'lsof -ti:3000', 18, { a: 'middle', m: 1, w: 700 });
  s += T(555, 100, 'lsof 4.99.4 on Linux', 16, { a: 'middle', f: '#555' });
  s += T(555, 160, '✗ exit 1', 30, { a: 'middle', w: 800, f: RD });
  s += T(555, 200, 'skips names with "("', 16, { a: 'middle', f: '#555' });
  s += R(790, 20, 300, 210, '#f1f9f4', GR);
  s += T(940, 60, 'ss -ltnp · fuser', 18, { a: 'middle', m: 1, w: 700 });
  s += T(940, 100, 'read the socket table', 16, { a: 'middle', f: '#555' });
  s += T(940, 160, '✓ pid=51', 30, { a: 'middle', w: 800, f: GR });
  s += T(940, 200, 'kill by port works', 16, { a: 'middle', f: '#555' });
  return s + '</svg>';
};

/* Slide 12: bảng fd đầy dần tới trần 64 */
const fdFill = () => {
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  const W = 15, G = 1.5, x0 = 40;
  for (let i = 0; i < 64; i++) {
    const x = x0 + i * (W + G);
    const kind = i < 3 ? 'std' : i < 19 ? 'node' : i < 63 ? 'leak' : 'free';
    const f = { std: '#d9d9d9', node: '#d6e6f5', leak: '#fbd3cc', free: '#ffffff' }[kind];
    const st = { std: GY, node: BL, leak: RD, free: GR }[kind];
    s += R(x, 60, W, 80, f, st, { rx: 2, sw: kind === 'free' ? 2.5 : 1 });
  }
  s += T(x0, 40, 'fd 0', 16, { m: 1, f: '#555' }); s += T(x0 + 9 * (W + G), 40, 'fd 0–18: what the fixed version also holds', 16, { f: '#555' });
  s += T(x0 + 63 * (W + G) + W, 40, 'fd 63', 16, { a: 'end', m: 1, f: '#555' });
  s += R(40, 160, 22, 22, '#d6e6f5', BL, { rx: 3, sw: 1.5 }); s += T(70, 178, 'Node’s own (pipes, epoll, listener)', 17);
  s += R(410, 160, 22, 22, '#fbd3cc', RD, { rx: 3, sw: 1.5 }); s += T(440, 178, 'audit-*.log opened, never closed', 17);
  s += R(760, 160, 22, 22, '#fff', GR, { rx: 3, sw: 2.5 }); s += T(790, 178, 'last free slot → next open() fails', 17);
  s += T(555, 222, 'measured: 63 fds open with a limit of 64 after 70 requests', 18, { a: 'middle', w: 700, f: BR });
  return s + '</svg>';
};

/* Slide 14: mềm vs cứng, Node tự nâng mềm */
const softHard = () => {
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">${DEFS}`;
  const bar = (y, lab, soft, hard, c) => {
    let t = T(20, y + 30, lab, 19, { w: 800 });
    t += R(240, y, 820, 44, '#f7f7f7', GY, { rx: 6, sw: 1.5 });
    t += R(240, y, soft, 44, c + '33', c, { rx: 6, sw: 2 });
    t += T(250 + soft, y + 29, hard, 16, { f: '#555' });
    return t;
  };
  s += bar(20, 'bash after -Sn 64', 40, 'soft 64  ·  hard 1 048 576', OR);
  s += bar(110, 'node (same shell)', 820, '', GR);
  s += T(650, 139, 'soft = hard = 1 048 576 — raised at startup', 17, { a: 'middle', w: 700, f: GR });
  s += T(555, 215, 'For Node, only the HARD limit binds: set it where the process starts (systemd, Docker)', 18, { a: 'middle', w: 700, f: BR });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.5',
}, [
  { cover: true, t: 'Ports and file descriptors', sub: 'ss, lsof, EADDRINUSE and EMFILE<br>— who holds the port, who holds the files' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read <code class="i">ss -tulpn</code>: what listens where, owned by which process and <b>fd</b></li>
<li>Fix <b>EADDRINUSE</b>: find a port's owner three ways — and the one that fails</li>
<li>The real incident: Next.js renames itself, <code class="i">pkill -f</code> misses it</li>
<li><b>TIME_WAIT</b> and ephemeral ports: when many connections hurt</li>
<li><b>EMFILE</b>: watch a descriptor leak hit the limit, then fix it in code</li>
</ul>
${box('Measured, not claimed', 'Every output comes from the course lab container (Ubuntu 26.04, Node 22). The incident is from this project’s own notes.', 'lam')}` },

  { t: 'A port is held by one file descriptor of one process', giua: true, body: `
${portFd()}
${box('Why this matters', 'EADDRINUSE and EMFILE are the same object seen from two sides: a listening socket is an fd. Find the fd and you find the owner; run out of fds and you cannot accept or open anything.', 'lam')}` },

  { t: 'ss -tulpn lists every listening socket and its owner', giua: true, to: true, body: `
${big(`$ ss -tulpn
Netid State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess
tcp   LISTEN 0      5          127.0.0.1:8080      0.0.0.0:*    users:(("python3",pid=19,fd=3))
tcp   LISTEN 0      511                *:3000            *:*    users:(("node",pid=9,fd=18))`, { hl: [3, 4] })}
<ul>
<li><code class="i">-t</code> TCP · <code class="i">-u</code> UDP · <code class="i">-l</code> listening only · <code class="i">-p</code> show the process · <code class="i">-n</code> numbers, not names</li>
<li>Python's server on <b>127.0.0.1:8080</b>: reachable only from this machine</li>
<li>Node on <b>*:3000</b>: reachable on every interface</li>
</ul>
${box('Works on my laptop, not from outside?', 'Check the Local Address first: a server bound to 127.0.0.1 cannot be reached from another machine, whatever the firewall says.', 'lam')}` },

  { t: 'One line of ss, column by column', giua: true, body: `
${ssAnatomy()}
${box('Read Recv-Q on a listener', 'It counts finished connections the app has not accepted yet. Stuck above zero = the app is not keeping up.', 'xanh')}` },

  { t: 'A second server cannot bind a port that is taken', giua: true, body: two(
    big(`$ node api.js; echo "exit=$?"
node:events:497
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle ...
  code: 'EADDRINUSE',
  errno: -98,
  syscall: 'listen',
  port: 3000
}
exit=1`, { hl: [6] }),
    `<ul style="font-size:22px">
<li>The kernel refused <b>listen</b>: a socket already owns <code class="i">:::3000</code></li>
<li><code class="i">errno -98</code> = EADDRINUSE on Linux</li>
<li>Stack trace trimmed; the numbers are the real ones</li>
</ul>
${box('Question to ask', 'Not "why does my app crash?" but "WHO holds port 3000?"', '')}`, 'r64') },

  { t: 'Three tools name the owner of a port', giua: true, body: two(
    big(`$ ss -ltnp 'sport = :3000'
State  Recv-Q Send-Q Local Address:Port ...Process
LISTEN 0      511                *:3000 ...users:(("node",pid=9,fd=18))
$ lsof -nP -iTCP:3000 -sTCP:LISTEN
COMMAND PID USER FD   TYPE ...NAME
node      9 root 18u  IPv6 ...TCP *:3000 (LISTEN)
$ fuser 3000/tcp
3000/tcp:                9
$ kill $(lsof -ti:3000); sleep 0.3
$ ss -ltn 'sport = :3000' | tail -n +2 | wc -l
0`),
    `<ul style="font-size:22px">
<li><b>ss</b>: socket table, with PID and fd</li>
<li><b>lsof</b>: open files of processes — a socket is one</li>
<li><b>fuser</b>: just the PID(s) using the port</li>
<li>Kill, then <b>verify</b>: 0 listeners left</li>
</ul>
<p class="nho">Long lines shortened with "..."; values unchanged.</p>`, 'r73') },

  { t: 'Next.js renames itself, so name patterns stop matching', giua: true, body: two(
    big(`$ node fake-next.js & sleep 0.5
ready on :3000 pid=51
$ ps -o pid,comm,args -p $(pgrep -f next-server)
    PID COMMAND         COMMAND
     51 next-server (v1 next-server (v14.
$ pkill -f "next start"; echo "pkill exit=$?"
pkill exit=1
$ pkill -f "fake-next.js"; echo "pkill exit=$?"
pkill exit=1`, { hl: [5, 7, 9] }),
    `<ul style="font-size:22px">
<li><code class="i">process.title = 'next-server (v14.2.15)'</code> overwrites the command line</li>
<li>Not even the script's own file name matches any more</li>
<li><b>30/07/2026</b>: the old Next server survived, the new one died with EADDRINUSE</li>
</ul>`, 'r64') },

  { t: 'On Linux even lsof misses it — ss and fuser do not', giua: true, body: `
${threeWays()}
${term(`$ lsof -ti:3000; echo "lsof exit=$?"
lsof exit=1
$ ss -ltnp 'sport = :3000'
LISTEN 0      511      *:3000      *:*    users:(("next-server (v1",pid=51,fd=18))`)}` },

  { t: 'Kill by port, then prove the port is free', to: true, giua: true, body: `
${big(`$ fuser -k 3000/tcp; sleep 0.3; curl -s localhost:3000; echo "curl exit=$?"
3000/tcp:               51
curl exit=7`, { hl: [3] })}
<ul>
<li><code class="i">fuser -k</code> kills whoever holds <b>3000/tcp</b> — no name needed</li>
<li><code class="i">curl exit=7</code> = connection refused: nobody listens any more</li>
<li>On macOS <code class="i">lsof -ti:3000</code> does find Next — that is why "kill by port" worked there</li>
</ul>
${box('Prevent', 'Stop servers by port or a PID file, and check the port is free (ss -ltn) before starting a new one.', 'xanh')}` },

  { t: 'TIME_WAIT is normal; reuse your connections', giua: true, body: two(
    big(`$ for i in $(seq 1 300); do curl -s -o /dev/null \\
    localhost:3000/health; done; ss -s
Total: 3
TCP:   384 (estab 0, closed 382, orphaned 0, timewait 300)
$ ss -tan state time-wait | wc -l
301
$ cat /proc/sys/net/ipv4/ip_local_port_range
32768	60999`, { hl: [4, 8] }),
    `<ul style="font-size:22px">
<li>The side that closes keeps the connection ~1 minute in <b>TIME_WAIT</b></li>
<li>Each outgoing connection takes an <b>ephemeral port</b>: only ~28 000 of them</li>
<li>Thousands of new connections/s to one DB → <code class="i">EADDRNOTAVAIL</code></li>
</ul>
${box('Fix', 'Reuse connections: HTTP keep-alive, connection pools.', 'xanh')}`, 'r64') },

  { t: 'A descriptor leak fills the table until open() fails', giua: true, body: `
${fdFill()}
${sql(`const fd = fs.openSync(\`/tmp/audit-\${n++ % 5}.log\`, 'a');   // ❌ never closed
fs.writeSync(fd, \`\${Date.now()} \${req.url}\\n\`);`, { lang: 'javascript' })}` },

  { t: 'The evidence: fd count, limit, and what is open', giua: true, body: two(
    big(`$ ulimit -n 64; node ro-ri-fd.js & sleep 0.5
audit api on :3002 pid=423
$ for i in $(seq 1 70); do curl -s \\
    localhost:3002/order/$i > /tmp/last.txt; done
$ cat /tmp/last.txt
EMFILE: EMFILE: too many open files, ...
$ ls /proc/$(pgrep -f ro-ri-fd.js)/fd | wc -l
63
$ grep 'open files' /proc/$PID/limits
Max open files      64      64      files`, { hl: [6, 8] }),
    big(`$ lsof -nP -p $PID | awk ... | uniq -c
     10 FIFO pipe
      9 REG /tmp/audit-3.log
      9 REG /tmp/audit-2.log
      9 REG /tmp/audit-1.log
$ curl -s -m 2 localhost:3002/health
ok`, { hl: [7] }) + box('The health check lies', '/health opens nothing, so it stays green while every real request fails.', 'do2')) },

  { t: 'Node raises its soft limit to the hard limit', giua: true, body: `
${softHard()}
${big(`$ bash -c 'ulimit -Sn 64; grep "open files" /proc/self/limits'
Max open files            64                   1048576              files
$ prlimit --pid $(pgrep -f ro-ri-fd.js) --nofile=1024:1024
prlimit: failed to set the NOFILE resource limit: Operation not permitted`)}` },

  { t: 'Fix the leak in code — a bigger limit only delays it', giua: true, body: two(
    big(`$ kill $(pgrep -f ro-ri-fd.js); FIX=1 node ro-ri-fd.js &
audit api on :3002 pid=556
$ for i in $(seq 1 500); do curl ...; done
$ cat /tmp/last.txt; ls /proc/$PID/fd | wc -l
ok
19`, { hl: [6] }),
    `<ul style="font-size:22px">
<li>One line: <code class="i">fs.closeSync(fd)</code> after writing</li>
<li><b>19</b> fds after 500 requests — the leaky version held <b>63</b> after 70</li>
<li>Raise limits for busy servers (systemd <code class="i">LimitNOFILE=</code>, Docker <code class="i">--ulimit nofile=</code>), not to hide a count that only grows</li>
</ul>`, 'r64') + box('Same evidence, fixed code', 'Before: EMFILE after 70 requests, 63 of 64 fds in use. After the fix: 500 requests answered ok, and the process holds only 19 fds.', 'xanh') },

  { t: 'Cheat sheet — ports and file descriptors', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:44%">You want to know…</th><th>Run</th></tr>
<tr><td>What listens, where, owned by whom</td><td><code class="i">ss -tulpn</code></td></tr>
<tr><td>Who holds port 3000</td><td><code class="i">ss -ltnp 'sport = :3000'</code> · <code class="i">fuser 3000/tcp</code></td></tr>
<tr><td>Free the port (any process name)</td><td><code class="i">fuser -k 3000/tcp</code>, then <code class="i">ss -ltn</code> again</td></tr>
<tr><td>Connection summary, TIME_WAIT</td><td><code class="i">ss -s</code> · <code class="i">ss -tan state time-wait | wc -l</code></td></tr>
<tr><td>How many fds a process holds</td><td><code class="i">ls /proc/PID/fd | wc -l</code></td></tr>
<tr><td>Its limit · what is open</td><td><code class="i">grep 'open files' /proc/PID/limits</code> · <code class="i">lsof -p PID</code></td></tr>
</table>
${box('Rule of thumb', 'Stop servers by port or PID file, never by name pattern. A count of fds that only grows is a leak — fix the close.', 'xanh')}` },
]);
