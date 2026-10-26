/**
 * osg-cs1 — OSG202 · ⭐ Advanced 1 · Lesson CS.1 "Linux process model in practice" (slide EN, khuôn _pg-chung, 25–26/10/2026).
 * Mọi output = CHẠY THẬT, lưu ở kho nguồn riêng của khoá (cs-nguon/cs1, chạy lại trong runner) (mỗi chương trình 1 tệp + <ten>.out.txt):
 *   image osg-cs1-lab (Dockerfile.lab: node:22-bookworm + Temurin 21.0.12 + gcc 12.2 + procps + psmisc + strace + tini; kernel 7.0.12-linuxkit),
 *   Spring Boot 4.1.2 (11-spring/), systemd 252 (debian:12). Docker Desktop 29.8.0.
 * Nguồn tra: man7 pid_namespaces(7), signal(7), signal-safety(7); docs.docker.com docker stop (10 s mặc định);
 *   docs.spring.io graceful-shutdown + metadata trong app.jar (server.shutdown=graceful, timeout 30s); nodejs/node v22 src/node.cc (SignalExit, SA_RESETHAND).
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, steps, kw, vsd } from './_pg-chung.mjs';

/* mỗi cột bọc 1 div — two() gốc đặt thẳng vào lưới, cột nhiều phần tử sẽ vỡ lưới (ghi chú điều phối 26/10) */
const col = (x) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${x}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);

export const deck = { key: 'cs1', code: 'CS.1', title: 'Linux process model in practice', sub: 'OSG202 · ⭐ Advanced' };

const out = (t, o = {}) => psql(t, { title: 'output', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const C = (s, o = {}) => sql(s, { lang: 'c', sm: true, ...o });
const tw = (s, fs) => s.length * 0.602 * fs; // bề rộng chữ SVG (công thức khuôn)

/* hộp SVG có nhãn căn giữa; bề rộng tối thiểu theo công thức */
const bx = (x, y, w, h, t, mau = '#336791', fs = 18, s = '', fill) => {
  const ww = Math.max(w, tw(t, fs) + 22);
  return `<rect x="${x}" y="${y}" width="${ww}" height="${h}" rx="9" fill="${fill || mau + '14'}" stroke="${mau}" stroke-width="2.5"/>` +
    `<text x="${x + ww / 2}" y="${y + (s ? h / 2 - 3 : h / 2 + fs * 0.36)}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${mau}">${t}</text>` +
    (s ? `<text x="${x + ww / 2}" y="${y + h / 2 + fs * 0.95}" text-anchor="middle" font-size="${fs - 4}" fill="#555">${s}</text>` : '');
};
const MK = (id, mau) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${mau}"/></marker>`;
const ar = (x1, y1, x2, y2, mau = '#b85a2b', id = 'osg-a', dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${mau}" stroke-width="3" ${dash ? `stroke-dasharray="${dash}"` : ''} marker-end="url(#${id})"/>`;

/* ── Slide 4: một chương trình → nhiều tiến trình ── */
const progVsProc = () => {
  const P = [['PID 9', 'node app.js', '7 threads'], ['PID 31', 'node worker.js', '7 threads'], ['PID 52', 'node app.js', '7 threads']];
  let s = `<svg viewBox="0 0 1110 210" width="1110" height="210" font-family="Arial"><defs>${MK('osg-a', '#b85a2b')}</defs>`;
  s += `<rect x="10" y="55" width="270" height="100" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="2.5" stroke-dasharray="8 5"/>`;
  s += `<text x="145" y="92" text-anchor="middle" font-size="20" font-weight="800" fill="#b85a2b">PROGRAM (a file)</text>`;
  s += `<text x="145" y="124" text-anchor="middle" font-size="17" fill="#333" font-family="Menlo,monospace">/usr/local/bin/node</text>`;
  s += `<text x="145" y="182" text-anchor="middle" font-size="16" fill="#777">on disk · does nothing by itself</text>`;
  P.forEach(([pid, cmd, th], i) => {
    const y = 8 + i * 68;
    s += ar(284, 105, 430, y + 29);
    s += `<rect x="440" y="${y}" width="640" height="58" rx="9" fill="#eef4fa" stroke="#336791" stroke-width="2.5"/>`;
    s += `<text x="460" y="${y + 37}" font-size="20" font-weight="800" fill="#336791">PROCESS · ${pid}</text>`;
    s += `<text x="680" y="${y + 37}" font-size="18" fill="#333" font-family="Menlo,monospace">${cmd}</text>`;
    s += `<text x="1065" y="${y + 37}" text-anchor="end" font-size="16" fill="#555">own memory · fds · ${th}</text>`;
  });
  return s + '</svg>';
};

/* ── Slide 5: cây tiến trình (vẽ từ output thật 01-tree) ── */
const treeSvg = () => {
  let s = `<svg viewBox="0 0 560 300" style="width:100%;height:auto" font-family="Arial">`;
  const L = '#9a9a9a';
  s += `<path d="M280,58 L280,82 M95,82 L465,82 M95,82 L95,104 M280,82 L280,104 M465,82 L465,104" stroke="${L}" stroke-width="2.5" fill="none"/>`;
  s += `<path d="M280,150 L280,176 M190,176 L370,176 M190,176 L190,198 M370,176 L370,198" stroke="${L}" stroke-width="2.5" fill="none"/>`;
  s += bx(190, 8, 180, 50, 'bash · PID 1', '#b85a2b', 19);
  s += bx(20, 104, 150, 46, 'node · 9', '#336791', 18);
  s += bx(205, 104, 150, 46, 'bash · 10', '#e08a1e', 18);
  s += bx(390, 104, 150, 46, 'ps · 20', '#777777', 18);
  s += bx(115, 198, 150, 46, 'sleep · 12', '#2f7d4f', 18);
  s += bx(295, 198, 150, 46, 'sleep · 13', '#2f7d4f', 18);
  s += `<path d="M95,150 L95,262" stroke="#336791" stroke-width="2" stroke-dasharray="5 4" fill="none"/>`;
  s += `<rect x="10" y="262" width="250" height="32" rx="7" fill="#fff" stroke="#336791" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  s += `<text x="135" y="284" text-anchor="middle" font-size="16" fill="#336791">{node} 14–19 = 6 threads</text>`;
  return s + '</svg>';
};

/* ── Slide 7: dòng thời gian fork / exec / wait (PID thật 13/14) ── */
const forkTimeline = () => {
  let s = `<svg viewBox="0 0 1110 270" width="1110" height="270" font-family="Arial"><defs>${MK('osg-a', '#b85a2b')}${MK('osg-g', '#2f7d4f')}</defs>`;
  s += `<text x="10" y="72" font-size="19" font-weight="800" fill="#336791">parent 13</text>`;
  s += `<text x="10" y="196" font-size="19" font-weight="800" fill="#e08a1e">child 14</text>`;
  s += `<line x1="120" y1="66" x2="1090" y2="66" stroke="#336791" stroke-width="6" stroke-linecap="round"/>`;
  s += `<line x1="520" y1="66" x2="900" y2="66" stroke="#fff" stroke-width="3" stroke-dasharray="10 8"/>`;
  s += `<circle cx="250" cy="66" r="11" fill="#fff" stroke="#b85a2b" stroke-width="4"/>`;
  s += `<text x="250" y="40" text-anchor="middle" font-size="20" font-weight="800" fill="#b85a2b">fork()</text>`;
  s += `<path d="M250,77 C250,140 300,190 330,190" stroke="#b85a2b" stroke-width="3" fill="none" marker-end="url(#osg-a)"/>`;
  s += `<text x="395" y="40" text-anchor="middle" font-size="17" fill="#333">returns 14</text>`;
  s += `<text x="710" y="40" text-anchor="middle" font-size="18" font-weight="700" fill="#336791">waitpid(14) … blocked, 0 % CPU</text>`;
  s += `<line x1="340" y1="190" x2="520" y2="190" stroke="#e08a1e" stroke-width="6" stroke-linecap="round"/>`;
  s += `<text x="430" y="226" text-anchor="middle" font-size="17" fill="#333">returns 0 · a copy</text>`;
  s += `<circle cx="530" cy="190" r="11" fill="#fff" stroke="#e08a1e" stroke-width="4"/>`;
  s += `<text x="530" y="164" text-anchor="middle" font-size="19" font-weight="800" fill="#b85a2b">execvp("ls")</text>`;
  s += `<line x1="545" y1="190" x2="820" y2="190" stroke="#2f7d4f" stroke-width="6" stroke-linecap="round"/>`;
  s += `<text x="682" y="226" text-anchor="middle" font-size="17" fill="#2f7d4f">same PID 14, now it IS ls</text>`;
  s += `<text x="840" y="196" font-size="19" font-weight="800" fill="#c0392b">exit(2)</text>`;
  s += `<path d="M880,176 C900,140 905,100 905,82" stroke="#2f7d4f" stroke-width="3" fill="none" marker-end="url(#osg-g)"/>`;
  s += `<text x="1000" y="112" text-anchor="middle" font-size="17" font-weight="700" fill="#2f7d4f">status = 2</text>`;
  s += `<text x="1000" y="136" text-anchor="middle" font-size="16" fill="#555">parent wakes up</text>`;
  return s + '</svg>';
};

/* ── Slide 11: vòng đời zombie / orphan ── */
const zombieLife = () => {
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial"><defs>${MK('osg-a', '#b85a2b')}</defs>`;
  s += bx(10, 30, 190, 66, 'Running', '#336791', 21, 'STAT R or S');
  s += ar(205, 63, 268, 63);
  s += `<text x="236" y="50" text-anchor="middle" font-size="16" fill="#555">exit</text>`;
  s += bx(275, 22, 330, 82, 'Zombie · STAT Z', '#c0392b', 21, 'only PID + exit status left', '#fdf0ee');
  s += ar(610, 63, 728, 63, '#2f7d4f', 'osg-g');
  s += `<text x="668" y="50" text-anchor="middle" font-size="16" fill="#2f7d4f" font-weight="700">parent wait()</text>`;
  s += bx(735, 30, 360, 66, 'Gone · PID is free again', '#2f7d4f', 21);
  s += `<path d="M440,106 L440,150" stroke="#b85a2b" stroke-width="3" fill="none" marker-end="url(#osg-a)"/>`;
  s += `<text x="452" y="134" font-size="16" fill="#555">parent dies first</text>`;
  s += bx(275, 156, 330, 62, 'Adopted by PID 1', '#e08a1e', 20, 'the orphan’s new parent');
  s += `<path d="M610,187 C680,187 700,120 730,90" stroke="#2f7d4f" stroke-width="3" fill="none" marker-end="url(#osg-g)" stroke-dasharray="8 6"/>`;
  s += `<text x="830" y="170" font-size="16" fill="#2f7d4f" font-weight="700">…only if PID 1 calls wait()</text>`;
  s += `<defs>${MK('osg-g', '#2f7d4f')}</defs>`;
  return s + '</svg>';
};

/* ── Slide 17: dòng thời gian graceful shutdown ── */
const gracefulTL = () => {
  let s = `<svg viewBox="0 60 1110 185" width="1110" height="185" font-family="Arial"><defs>${MK('osg-a', '#b85a2b')}</defs>`;
  s += `<line x1="20" y1="120" x2="1085" y2="120" stroke="#bfbfbf" stroke-width="4"/>`;
  const st = [
    [110, 'SIGTERM', 'docker stop · deploy', '#c0392b'],
    [290, '1 · stop accepting', 'close the listen socket', '#336791'],
    [530, '2 · drain', 'finish in-flight requests', '#336791'],
    [760, '3 · clean up', 'DB pool · queues · logs', '#336791'],
    [960, '4 · exit 0', 'before the deadline', '#2f7d4f'],
  ];
  st.forEach(([x, t, d, m]) => {
    s += `<circle cx="${x}" cy="120" r="13" fill="#fff" stroke="${m}" stroke-width="5"/>`;
    s += `<text x="${x}" y="88" text-anchor="middle" font-size="20" font-weight="800" fill="${m}">${t}</text>`;
    s += `<text x="${x}" y="160" text-anchor="middle" font-size="16" fill="#555">${d}</text>`;
  });
  s += `<rect x="20" y="186" width="1065" height="54" rx="9" fill="#fdf0ee" stroke="#e3a59c" stroke-width="2"/>`;
  s += `<text x="552" y="211" text-anchor="middle" font-size="18" font-weight="800" fill="#a52a1d">Deadline, then SIGKILL (exit 137): Docker 10 s · Kubernetes 30 s · systemd 90 s</text>`;
  s += `<text x="552" y="232" text-anchor="middle" font-size="15" fill="#555">docker stop --time / terminationGracePeriodSeconds / TimeoutStopSec — your app’s own timer must be SHORTER</text>`;
  return s + '</svg>';
};

/* ── Slide 20: PID 1 nhận SIGTERM ── */
const pid1Svg = () => {
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial"><defs>${MK('osg-a', '#b85a2b')}${MK('osg-g', '#2f7d4f')}${MK('osg-r', '#c0392b')}</defs>`;
  // hàng A
  s += `<text x="10" y="30" font-size="17" font-weight="800" fill="#a52a1d">CMD node app.js   (shell form)</text>`;
  s += bx(10, 44, 150, 56, 'docker stop', '#777', 19);
  s += ar(165, 72, 240, 72, '#c0392b', 'osg-r');
  s += `<text x="202" y="62" text-anchor="middle" font-size="15" fill="#c0392b" font-weight="700">TERM</text>`;
  s += bx(245, 44, 250, 56, 'PID 1: sh -c', '#c0392b', 19, 'no handler → dropped', '#fdf0ee');
  s += `<line x1="500" y1="72" x2="610" y2="72" stroke="#c0392b" stroke-width="3" stroke-dasharray="6 6"/>`;
  s += `<text x="555" y="62" text-anchor="middle" font-size="22" fill="#c0392b" font-weight="800">✗</text>`;
  s += bx(615, 44, 200, 56, 'node · PID 7', '#336791', 19, 'never told');
  s += `<text x="840" y="66" font-size="17" fill="#a52a1d" font-weight="800">10 s later: SIGKILL</text>`;
  s += `<text x="840" y="90" font-size="17" fill="#a52a1d">→ exit 137, requests cut</text>`;
  // hàng B
  s += `<text x="10" y="150" font-size="17" font-weight="800" fill="#1f6b40">docker run --init   (or ENTRYPOINT tini)</text>`;
  s += bx(10, 164, 150, 56, 'docker stop', '#777', 19);
  s += ar(165, 192, 240, 192, '#2f7d4f', 'osg-g');
  s += `<text x="202" y="182" text-anchor="middle" font-size="15" fill="#2f7d4f" font-weight="700">TERM</text>`;
  s += bx(245, 164, 250, 56, 'PID 1: tini', '#2f7d4f', 19, 'forwards + reaps', '#f1f9f4');
  s += ar(500, 192, 608, 192, '#2f7d4f', 'osg-g');
  s += bx(615, 164, 200, 56, 'node · PID 7', '#336791', 19, 'handler runs');
  s += `<text x="840" y="186" font-size="17" fill="#1f6b40" font-weight="800">0.1 s, clean exit</text>`;
  s += `<text x="840" y="210" font-size="17" fill="#1f6b40">→ exit 0 / 143</text>`;
  return s + '</svg>';
};

const zm = (h, z) => `<div style="zoom:${z}">${h}</div>`;
const T = (h) => `<p style="margin:0;font-size:21px">${h}</p>`;

export const slides = lamDeck({ khoa: 'Operating Systems', duong: 'academy/osg202', bieuTuong: '🐧', khau: 'from zero to real backend work',
  chuong: '⭐ Advanced 1 — Linux process model in practice', bai: 'CS.1' }, [

  { cover: true, t: 'Linux process model<br>in practice', sub: 'Process tree · fork / exec / wait · exit codes ·<br>signals · graceful shutdown · PID 1 in containers' },

  /* 2 */
  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Read a <b>process tree</b> and look inside any process through <code class="i">/proc</code></li>
<li>How a program really starts: <b>fork → exec → wait</b> (in C, run for real)</li>
<li>Decode any <b>exit code</b>: 0, 1, 2, 126, 127 and <b>128 + N</b> (137, 143)</li>
<li>Create <b>zombies</b> and <b>orphans</b> on purpose, then fix them</li>
<li><b>Signals</b> and <b>graceful shutdown</b> in bash, C, Node.js, Java, Spring Boot</li>
<li>Why a container takes <b>10 s to stop</b> — and the one-line fix (<b>PID 1</b>, <code class="i">--init</code>)</li>
</ul>
${box('Beyond the school slides', 'Lessons 2.A–2.C taught <i>what</i> a process is. This deck shows what you meet on a real Linux server and in Docker. Every output was produced by a real run: Debian 12, kernel 7.0, Node 22.23, Java 21.0.12, Spring Boot 4.1.2.', 'lam')}` },

  /* 3 */
  { t: 'First, a picture: a restaurant kitchen', body: `
<table class="t" style="font-size:22px">
<tr><th style="width:42%">In the kitchen</th><th style="width:30%">In Linux</th><th>Call / tool</th></tr>
<tr><td>The head chef runs the kitchen</td><td>a <b>parent process</b></td><td>PID, PPID</td></tr>
<tr><td>She clones herself into a helper</td><td>a <b>child</b> is created</td><td><code class="i">fork()</code></td></tr>
<tr><td>She hands the helper a new recipe card</td><td>the child runs a new program</td><td><code class="i">exec()</code></td></tr>
<tr><td>She waits for the dish and reads the report</td><td>collect the <b>exit code</b></td><td><code class="i">wait()</code></td></tr>
<tr><td>A helper finished, nobody read the report</td><td><b>zombie</b></td><td>STAT <b>Z</b></td></tr>
<tr><td>The chef left; the manager adopts the helpers</td><td><b>orphan</b> → PID 1</td><td>PPID becomes 1</td></tr>
<tr><td>Fire alarm: finish plating, switch stoves off</td><td><b>SIGTERM</b> — please stop</td><td><code class="i">kill</code>, <code class="i">docker stop</code></td></tr>
<tr><td>Power cut: everything stops mid-dish</td><td><b>SIGKILL</b> — no choice</td><td><code class="i">kill -9</code>, OOM killer</td></tr>
</table>
<p class="nho" style="margin:0">Keep this kitchen in mind — every slide below is one row of this table, run on a real Linux machine.</p>` },

  /* 4 */
  { t: 'Program, process, thread — the definitions', giua: true, body: `
${progVsProc()}
${cards([
    ['Program', 'A file on disk (instructions). One file can be started many times.'],
    ['Process', 'A <b>running instance</b>: its own virtual memory, open files (fds), a state, and a number — the <b>PID</b>.'],
    ['Thread', 'A worker <b>inside</b> a process; threads share its memory. Node shows 7 even for “single-threaded” JS.'],
  ])}
<p style="margin:0;font-size:21px">${kw('PID', 'process ID')} ${kw('PPID', 'parent’s PID')} ${kw('PID 1', 'the first process: init / systemd / your container’s CMD')}</p>` },

  /* 5 */
  { t: 'The process tree: every process has a parent', body: `
${term(`$ ps -ef --forest
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  1 16:31 ?        00:00:00 bash /lab/01-tree.sh
root           9       1 19 16:31 ?        00:00:00 node /tmp/app.js
root          10       1  0 16:31 ?        00:00:00 bash /lab/01-tree.sh
root          12      10  0 16:31 ?        00:00:00  \\_ sleep 300
root          13      10  0 16:31 ?        00:00:00  \\_ sleep 300
root          20       1  0 16:31 ?        00:00:00 ps -ef --forest`)}
${two(treeSvg(), `<ul style="font-size:21px">
<li><b>PPID</b> column = the parent. Follow it up and you always reach <b>PID 1</b></li>
<li><code class="i">pstree -p</code> draws the same tree; names in <code class="i">{braces}</code> are <b>threads</b></li>
<li>On a VM, PID 1 is <b>systemd</b>; in a container it is <b>whatever your CMD starts</b> — remember this for slide 20</li>
</ul>`)}` },

  /* 6 */
  { t: '/proc/&lt;pid&gt;: look inside a running process', body: two(
    term(`$ grep -E '^(Name|State|Pid|PPid|Threads|VmRSS)' /proc/9/status
Name:	node
State:	S (sleeping)
Pid:	9
PPid:	1
VmRSS:	   50336 kB
Threads:	7

$ tr '\\0' ' ' < /proc/9/cmdline
node /tmp/app.js

$ tr '\\0' '\\n' < /proc/9/environ | grep -E 'PORT|APP_ENV|NODE_VERSION'
PORT=3000
APP_ENV=demo
NODE_VERSION=22.23.4

$ ls -l /proc/9/exe /proc/9/cwd
/proc/9/cwd -> /lab
/proc/9/exe -> /usr/local/bin/node`, { hl: [3, 6, 7] }),
    `<ul style="font-size:20px">
<li><code class="i">/proc</code> is not on disk: the <b>kernel</b> generates these files when you read them</li>
<li><b>status</b>: state, parent, memory in RAM (<b>VmRSS</b>, cs5), threads</li>
<li><b>cmdline</b> / <b>environ</b>: arguments and environment, separated by <code class="i">\\0</code></li>
<li><b>exe</b>, <b>cwd</b>, <b>fd/</b> (cs2): which binary, which folder, which open files</li>
</ul>
${box('Security', 'Any user can read your <b>cmdline</b> (it is what <code class="i">ps</code> shows) — never pass a password as an argument. <b>environ</b> is readable by the same user and root: secrets in env vars are visible to anyone who gets a shell as that user.', 'do2')}`, 'r64') },

  /* 7 */
  { t: 'How a new program starts: fork → exec → wait', giua: true, body: `
${forkTimeline()}
${cards([
    ['fork()', 'Copies the caller. Returns <b>twice</b>: <b>0</b> in the child, the <b>child’s PID</b> in the parent.'],
    ['exec()', 'Replaces the program in this process (same PID). Returns only on failure.'],
    ['wait() / waitpid()', 'Parent sleeps until a child ends, then reads its <b>exit status</b>.'],
  ])}` },

  /* 8 */
  { t: 'fork / exec / wait in C — run for real', body: `
${C(`printf("parent: pid=%d ppid=%d\\n", getpid(), getppid());
fflush(stdout);                    /* empty the buffer BEFORE fork */
pid_t pid = fork();                /* 1 process in, 2 processes out */
if (pid == 0) {                    /* ---- child ---- */
    printf("child : pid=%d ppid=%d  fork() returned 0\\n", getpid(), getppid());
    fflush(stdout);
    char *argv[] = { "ls", "-1", "/lab/nope", NULL };
    execvp("ls", argv);            /* becomes ls — same PID */
    _exit(127);                    /* only reached if exec failed */
}
printf("parent: fork() returned %d (the child's pid)\\n", pid);
int status; waitpid(pid, &status, 0);          /* block until the child ends */
if (WIFEXITED(status))
    printf("parent: child %d exited, status=%d\\n", pid, WEXITSTATUS(status));`, { hl: [3, 8, 12] })}
${out(`parent: pid=13 ppid=1
parent: fork() returned 14 (the child's pid)
child : pid=14 ppid=13  fork() returned 0
ls: cannot access '/lab/nope': No such file or directory
parent: child 14 exited, status=2`, { title: 'gcc -Wall -o fork 02-fork.c && ./fork', hl: [5] })}
<p class="nho" style="margin:0">Your shell does exactly this for every command; so do Node <code class="i">child_process.spawn</code>, Java <code class="i">ProcessBuilder</code> and Python <code class="i">subprocess</code>.</p>` },

  /* 9 */
  { t: 'Exit codes: one byte that says how it ended', giua: true, body: two(`
<table class="t" style="font-size:19px">
<tr><th style="width:90px">Code</th><th>Meaning</th></tr>
<tr><td><b>0</b></td><td>success — the only “OK”</td></tr>
<tr><td><b>1</b></td><td>general error (<code class="i">false</code>, an uncaught exception in Node)</td></tr>
<tr><td><b>2</b></td><td>misuse / serious trouble (<code class="i">ls</code> on a missing path)</td></tr>
<tr><td><b>126</b></td><td>found, but <b>not executable</b> (missing <code class="i">chmod +x</code>)</td></tr>
<tr><td><b>127</b></td><td><b>command not found</b> (typo, not in PATH, not installed in the image)</td></tr>
<tr><td><b>128+N</b></td><td>killed by <b>signal N</b> — next slide</td></tr>
</table>
<p style="font-size:20px;margin:8px 0 0">Only <b>8 bits</b> survive: <code class="i">exit 300</code> → <b>44</b> (300 mod 256). Keep your own codes in 1–125.</p>`,
    term(`$ true
  -> exit code $? = 0
$ false
  -> exit code $? = 1
$ ls /nope
ls: cannot access '/nope': No such file or directory
  -> exit code $? = 2
$ /tmp/script.sh
/lab/03-exitcodes.sh: line 4: /tmp/script.sh: Permission denied
  -> exit code $? = 126
$ nosuchcmd
/lab/03-exitcodes.sh: line 4: nosuchcmd: command not found
  -> exit code $? = 127
$ bash -c "exit 300"
  -> exit code $? = 44`), 'r46') },

  /* 10 */
  { t: '128 + N: the process was killed by signal N', giua: true, body: `
${term(`$ kill -s INT 12   (signal 2)  -> exit code $? = 130
$ kill -s TERM 14   (signal 15)  -> exit code $? = 143
/lab/03-exitcodes.sh: line 16:    16 Killed                  sleep 100
$ kill -s KILL 16   (signal 9)  -> exit code $? = 137`)}
${out(`child called exit(3)   WIFEXITED   status=3
kill(child, SIGTERM)   WIFSIGNALED signal=15 (Terminated) -> a shell shows 143
kill(child, SIGKILL)   WIFSIGNALED signal=9 (Killed) -> a shell shows 137`, { title: 'what the parent really receives — 03-waitstatus.c' })}
${two(`<table class="t" style="font-size:18px">
<tr><th>You see</th><th>Signal</th><th>Usually means</th></tr>
<tr><td><b>130</b></td><td>2 SIGINT</td><td>someone pressed Ctrl+C</td></tr>
<tr><td><b>137</b></td><td>9 SIGKILL</td><td>OOM killer · stop timeout · <code class="i">kill -9</code></td></tr>
<tr><td><b>139</b></td><td>11 SIGSEGV</td><td>crash: bad memory access</td></tr>
<tr><td><b>143</b></td><td>15 SIGTERM</td><td>a normal stop, no handler</td></tr>
</table>`, box('The kernel never stores “137”', 'It records <i>“ended by signal 9”</i>. Shells, Docker and Kubernetes <b>display</b> it as 128 + 9 = 137, so it never collides with a normal exit code.', 'lam'), 'r64')}` },

  /* 11 */
  { t: 'Zombies: finished, but nobody read the report', body: `
${zombieLife()}
${two(term(`$ ./zombie &        # parent never calls wait()
parent 13: 3 children finished, I am busy and never call wait()
$ ps -o pid,ppid,stat,cmd --ppid 13
    PID    PPID STAT CMD
     15      13 Z+   [zombie] <defunct>
     16      13 Z+   [zombie] <defunct>
     17      13 Z+   [zombie] <defunct>
$ kill -9 <zombie pid>      # try to kill a zombie
     15      13 Z+   [zombie] <defunct>`, { hl: [5, 9] }),
    `<ul style="font-size:20px">
<li>A zombie uses <b>no CPU and no memory</b> — just a slot in the process table</li>
<li><code class="i">kill -9</code> does nothing: <b>it is already dead</b></li>
<li>The danger: thousands of them use up PIDs (<code class="i">pids.max</code>, cs6) → <code class="i">fork: Resource temporarily unavailable</code></li>
</ul>`, 'r64')}` },

  /* 12 */
  { t: 'Fixing zombies, and what happens to orphans', giua: true, body: two(
    `${C(`static void on_sigchld(int sig) {
    (void)sig;            /* reap EVERY finished child */
    while (waitpid(-1, NULL, WNOHANG) > 0) { }
}
/* in main(): */
struct sigaction sa = { .sa_handler = on_sigchld,
        .sa_flags = SA_RESTART | SA_NOCLDSTOP };
sigemptyset(&sa.sa_mask);
sigaction(SIGCHLD, &sa, NULL);`)}
${term(`$ ./zombie fix &
parent 25: 3 children finished, I am busy and never call wait()
$ ps -o pid,ppid,stat,cmd --ppid 25
    PID    PPID STAT CMD
(no children left - all reaped)`)}`,
    `${term(`child  14: my parent is 13
parent 13: exiting without waiting for my child
child  14: my parent is now 1  (adopted)`, { title: 'orphan — 05-orphan.c' })}
<ul style="font-size:20px">
<li><b>SIGCHLD</b> = “one of your children changed state”</li>
<li><code class="i">WNOHANG</code> + a loop: several children can end while you handle one signal</li>
<li>An orphan is <b>re-parented to PID 1</b> (or to a “subreaper”); from then on, <b>PID 1 must reap it</b></li>
</ul>`) },

  /* 13 */
  { t: 'Real trap: zombies pile up under a Node PID 1', giua: true, body: `
${sql(`// 06-pid1-zombies.js — the shell starts sleep in the background and exits at once -> sleep becomes an orphan
for (let i = 0; i < 5; i++) execSync("sh -c 'sleep 0.2 & exit 0'");`, { lang: 'javascript', sm: true })}
${two(term(`### docker run osg-cs1-lab node app.js   (node = PID 1)
    PID    PPID STAT CMD
      1       0 Ssl+ node /lab/06-pid1-zombies.js
     16       1 Z+   [sleep] <defunct>
     19       1 Z+   [sleep] <defunct>
     22       1 Z+   [sleep] <defunct>
     25       1 Z+   [sleep] <defunct>
     28       1 Z+   [sleep] <defunct>`, { hl: [4, 5, 6, 7, 8] }),
    term(`### docker run --init ...   (tini = PID 1)
    PID    PPID STAT CMD
      1       0 Ss   /sbin/docker-init -- docker-
      7       1 Sl+  node /lab/06-pid1-zombies.js`) + box('', 'tini reaps every orphan it adopts — <b>no zombies</b>.', 'xanh'))}
<ul style="font-size:21px">
<li>Orphans land on PID 1. Node (libuv) only <b>waits for the children it spawned itself</b> — adopted ones stay <b>Z forever</b></li>
<li>Seen in production with headless Chrome/Puppeteer, PDF converters, shell scripts. Fix: a real init as PID 1 — <code class="i">docker run --init</code></li>
</ul>` },

  /* 14 */
  { t: 'Signals: short messages from the kernel', giua: true, body: `
${term(`$ kill -l | head -4
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP`)}
<table class="t" style="font-size:19px">
<tr><th>Signal</th><th>Default action</th><th>Who sends it in real life</th><th>Catch it?</th></tr>
<tr><td><b>SIGTERM 15</b></td><td>terminate</td><td><code class="i">kill</code>, <code class="i">docker stop</code>, <code class="i">systemctl stop</code>, Kubernetes, deploys</td><td class="xanh">yes — clean up!</td></tr>
<tr><td><b>SIGINT 2</b></td><td>terminate</td><td>Ctrl+C in the terminal</td><td class="xanh">yes</td></tr>
<tr><td><b>SIGHUP 1</b></td><td>terminate</td><td>terminal closed · by convention “reload config” (nginx)</td><td class="xanh">yes</td></tr>
<tr><td><b>SIGQUIT 3</b></td><td>core dump</td><td>Ctrl+\\ · the JVM prints a <b>thread dump</b> instead</td><td class="xanh">yes</td></tr>
<tr><td><b>SIGCHLD 17</b></td><td>ignore</td><td>the kernel: “your child changed state”</td><td class="xanh">yes</td></tr>
<tr><td><b>SIGKILL 9</b> / <b>SIGSTOP 19</b></td><td>kill / pause</td><td><code class="i">kill -9</code>, the OOM killer, the stop timeout</td><td class="do">NEVER</td></tr>
</table>` },

  /* 15 */
  { t: 'Catching a signal in bash: trap', body: two(
    sql(`#!/bin/bash   # /tmp/worker.sh
cleanup() {
  echo "worker: got $1 -> removing /tmp/worker.lock, bye"
  rm -f /tmp/worker.lock; exit 0
}
trap 'cleanup SIGTERM' TERM
trap 'cleanup SIGINT'  INT
trap 'echo "worker: SIGHUP -> reload config (keep running)"' HUP
touch /tmp/worker.lock
echo "worker: pid $$ started, lock created"
while true; do sleep 0.1; done`, { lang: 'bash', sm: true, hl: [6, 7, 8] }).replace('<pre class="vs sm"', '<pre class="vs sm" style="zoom:.9"'),
    term(`worker: pid 12 started, lock created
$ kill -HUP 12
worker: SIGHUP -> reload config (keep running)
$ kill -TERM 12
worker: got SIGTERM -> removing /tmp/worker.lock, bye
  -> exit code 0
$ ls /tmp/worker.lock
ls: cannot access '/tmp/worker.lock': No such file or directory

--- the same worker, killed with -9 ---
worker: pid 27 started, lock created
$ kill -9 27
  -> exit code 137  (trap never ran)
$ ls /tmp/worker.lock
/tmp/worker.lock`, { hl: [5, 13, 15] })) + box('Lesson', '<code class="i">kill -9</code> skips every cleanup: stale lock files, half-written files, open transactions left to time out. Always send SIGTERM first.', 'do2') },

  /* 16 */
  { t: 'A signal handler in C — and the one rule', giua: true, body: two(
    C(`static volatile sig_atomic_t stop = 0;
static void on_term(int sig) { (void)sig; stop = 1; }

int main(void) {
    struct sigaction sa = { .sa_handler = on_term };
    sigemptyset(&sa.sa_mask);
    sigaction(SIGTERM, &sa, NULL);
    sigaction(SIGINT,  &sa, NULL);
    if (sigaction(SIGKILL, &sa, NULL) == -1)   /* refused */
        printf("sigaction(SIGKILL): %s\\n", strerror(errno));
    while (!stop) usleep(100000);              /* serve */
    printf("server: SIGTERM received -> finish work ...\\n");
    return 0;
}`, { hl: [2, 9] }).replace('<pre class="vs sm"', '<pre class="vs sm" style="zoom:.93"'),
    `${term(`sigaction(SIGKILL): Invalid argument
server 12: running, send me SIGTERM
$ kill -TERM 12
server: SIGTERM received -> finish work,
        close DB, flush logs (10 ticks)
  -> exit code 0`, { hl: [1], title: '08-handler.c (long line wrapped)' })}
${box('The rule (signal-safety(7))', 'A handler can interrupt your code <b>anywhere</b> — even inside <code class="i">malloc</code> or <code class="i">printf</code>. So it only <b>sets a flag</b>; the main loop sees the flag and does the real cleanup.', 'lam')}
<p style="font-size:20px;margin:0">Node and the JVM follow the same rule for you: your JS callback / shutdown hook runs <b>later</b>, on a normal thread.</p>`) },

  /* 17 */
  { t: 'Graceful shutdown: what “stop nicely” means', body: `
${gracefulTL()}
${two(`<ul style="font-size:21px">
<li>Every <b>deploy</b> stops the old version — without a graceful stop, users see errors on <b>every release</b></li>
<li>Stop accepting first, so the load balancer sends new requests elsewhere</li>
</ul>`, box('Kubernetes / Docker / systemd', 'All three send <b>SIGTERM</b>, wait, then send <b>SIGKILL</b>. Only the length of the wait differs.', 'lam'))}
${cards([
    ['🐳 Docker / Compose', '<code class="i" style="white-space:nowrap">docker stop -t 30</code> · <code class="i" style="white-space:nowrap">--stop-timeout 30</code> · compose <code class="i">stop_grace_period</code>'],
    ['☸️ Kubernetes', '<code class="i">terminationGracePeriodSeconds</code> (30) · a <code class="i">preStop</code> sleep lets the load balancer drop the pod first'],
    ['⚙️ systemd', '<code class="i">KillSignal=SIGTERM</code> · <code class="i">TimeoutStopSec=30</code> · then SIGKILL to the whole cgroup'],
  ])}` },

  /* 18 */
  { t: 'Graceful shutdown in Node.js — measured', body: `
${sql(`const server = http.createServer((req, res) => {
  setTimeout(() => res.end(\`done \${req.url}\\n\`), 2000);   // every request takes 2 s
});
server.listen(3000, () => console.log(\`node \${process.pid}: listening on :3000\`));

if (process.env.GRACEFUL) {
  process.on('SIGTERM', () => {
    console.log('SIGTERM: stop accepting, finish in-flight requests...');
    server.close(() => {                     // callback runs when the last request is done
      console.log('all requests done, closing DB pool... exit 0');
      process.exit(0);
    });
    setTimeout(() => { console.log('timeout: forcing exit'); process.exit(1); }, 10_000).unref();
  });
}`, { lang: 'javascript', sm: true, hl: [7, 9, 13] })}
${two(term(`$ kill -TERM 8     # naive: GRACEFUL unset
[in-flight request] curl: (52) Empty reply from server
[new request] curl: (7) Failed to connect
              to localhost port 3000 after 0 ms
node exit code: 143`, { hl: [2], title: '09-graceful.sh · naive (long lines trimmed)' }),
    term(`$ kill -TERM 23    # GRACEFUL=1
SIGTERM: stop accepting, finish in-flight requests...
[new request] curl: (7) Failed to connect ...
[in-flight request] done /order-42
all requests done, closing DB pool... exit 0
node exit code: 0`, { hl: [4], title: '09-graceful.sh · graceful (trimmed)' }))}` },

  /* 19 */
  { t: 'Java hooks · Spring Boot graceful by default', body: two(
    `${sql(`Runtime.getRuntime().addShutdownHook(new Thread(() -> {
  System.out.println("hook: SIGTERM -> ...");
}));`, { lang: 'java', sm: true })}
${zm(term(`$ kill -TERM 32
hook: SIGTERM -> stop taking jobs, finish current job, close pool
hook: done
  -> exit code 143
$ kill -KILL 53
  -> exit code 137`, { hl: [4, 6], title: '10-Shutdown.java · Java 21.0.12' }), .88)}
<p style="font-size:20px;margin:0">The JVM runs hooks on SIGTERM, SIGINT and <code class="i">System.exit</code>, then still exits <b>143</b> — that is normal. On SIGKILL no hook runs.</p>`,
    `${term(`$ kill -TERM 8   (request /slow is in flight)
Tomcat started on port 8080 (http) ...
Started App in 3.719 seconds
GracefulShutdown: Commencing graceful shutdown.
                  Waiting for active requests to complete
GracefulShutdown: Graceful shutdown complete
[in-flight request] done /slow
java exit code: 143   (shutdown took 2.6 s)
---- with server.shutdown=immediate ----
[in-flight request] curl: (52) Empty reply from server
java exit code: 143   (shutdown took 0.1 s)`, { title: 'Spring Boot 4.1.2 · log lines trimmed', hl: [4, 6, 10] })}
${sql(`# both values are the defaults in Spring Boot 4.1.2
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s`, { lang: 'properties', sm: true })}`) },

  /* 20 */
  { t: 'PID 1 in a container: the signal never arrives', giua: true, body: `
${pid1Svg()}
${box('The kernel rule (man7 pid_namespaces)', '“Only signals for which the <i>init</i> process has established a signal handler can be sent to the <i>init</i> process.” A signal with the <b>default action</b> sent to PID 1 is simply <b>dropped</b> — SIGTERM does not kill PID 1. Only SIGKILL from outside (the Docker engine) gets through.', 'lam')}
<p style="font-size:20px;margin:0">Shell form <code class="i">CMD node app.js</code> runs <code class="i">/bin/sh -c "node app.js"</code>: <b>sh</b> becomes PID 1 and does not forward the signal to node.</p>` },

  /* 21 */
  { t: 'Measured: how long does docker stop take?', body: `
${term(`A exec form, no handler           PID 1 = node /lab/12-app.js         stop  10.1 s  exit 137  handler: -
B exec form + --init              PID 1 = /sbin/docker-init -- ...    stop   0.1 s  exit 143  handler: -
C exec form, SIGTERM handler      PID 1 = node /lab/12-app.js         stop   0.1 s  exit 0    handler: yes
D shell form + handler in app     PID 1 = sh -c node /lab/12-app.js   stop  10.2 s  exit 137  handler: NO
E sh -c "exec node app"           PID 1 = node /lab/12-app.js         stop   0.1 s  exit 0    handler: yes
F npm start (handler in app)      PID 1 = npm start                   stop   0.7 s  exit 1    handler: NO`, { sm: false, title: '12-pid1.sh — docker run --stop-timeout 10 (columns shortened)', hl: [1, 4, 6] })}
${two(`<ul style="font-size:19px">
<li><b>A</b>: Node’s built-in SIGTERM handler resets itself and re-raises the signal — and the kernel drops it for PID 1 (proof on the right)</li>
<li><b>D</b>: your handler exists, but <b>sh</b> swallows the signal</li>
<li><b>F</b>: npm signals its child <code class="i">sh</code>, sh dies, npm exits 1 — <b>your handler never runs</b></li>
</ul>`, term(`$ grep SigCgt /proc/1/status      # node as PID 1
SigCgt:	0000000100004602     # 0x4000 = SIGTERM caught
$ docker kill -s TERM osg-cs1-mask
container still running: true
SigCgt:	0000000100000602     # 0x4000 now cleared`, { title: '13-sigmask.sh (annotated)' }), 'r46')}
<p class="nho" style="margin:0">10 s = Docker’s documented default (pinned with <code class="i">--stop-timeout 10</code>). This Docker Desktop 29.8 used ~3 s when not pinned — measure, don’t assume.</p>` },

  /* 22 */
  { t: 'Trap: Dockerfiles that ignore SIGTERM', giua: true, body: vsd(
    `${sql(`# shell form: sh -c is PID 1
CMD node dist/index.js

# npm sits in the middle
CMD ["npm", "start"]

# entrypoint script without exec
#   #!/bin/sh
#   ./migrate.sh
#   node dist/index.js`, { lang: 'dockerfile', sm: true })}
<ul style="font-size:19px;margin-top:8px"><li>every <code class="i">docker stop</code> waits the full timeout</li><li>then SIGKILL: requests cut, exit 137</li><li>orphans become zombies</li></ul>`,
    `${sql(`# a real init as PID 1 + exec form
RUN apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--", "/entry.sh"]
CMD ["node", "dist/index.js"]

# entry.sh: prepare, then REPLACE itself
#   #!/bin/sh
#   ./migrate.sh
#   exec "$@"          # node takes over the PID`, { lang: 'dockerfile', sm: true, hl: [3, 4, 9] })}
<ul style="font-size:19px;margin-top:8px"><li>or simply <code class="i">docker run --init</code> / compose <code class="i">init: true</code></li><li>plus a <code class="i">SIGTERM</code> handler in the app</li><li>this is exactly cuongthai.com’s <code class="i">Dockerfile.backend</code></li></ul>`) },

  /* 23 */
  { t: 'Job control: &, jobs, Ctrl+Z, nohup', giua: true, body: two(
    term(`$ sleep 600 &
$ sleep 700 &
$ jobs -l
[1]-     7 Running                 sleep 600 &
[2]+     8 Running                 sleep 700 &
$ kill -STOP %1        # what Ctrl+Z does (SIGTSTP)
[1]+     7 Stopped (signal)        sleep 600
[2]-     8 Running                 sleep 700 &
$ ps -o pid,stat,cmd -p 7,8
    PID STAT CMD
      7 T    sleep 600
      8 S    sleep 700
$ kill -CONT %1        # what \`bg\` does
$ kill %1 %2; jobs
[1]+  Terminated              sleep 600
[2]-  Terminated              sleep 700`, { hl: [7, 11] }),
    `${term(`$ sleep 800 &
$ nohup sleep 900 > /dev/null 2>&1 &
$ grep SigIgn /proc/15/status /proc/16/status
15/status:SigIgn:	0000000000000000
16/status:SigIgn:	0000000000000001
$ kill -HUP 15 16
  plain sleep -> exit code 129 (128+1 = killed by SIGHUP)
    PID STAT CMD
     16 S    sleep 900`, { title: 'nohup = ignore SIGHUP (14-jobs.sh, trimmed)', hl: [5, 7, 9] })}
<ul style="font-size:19px">
<li>Closing an SSH session sends <b>SIGHUP</b> to your jobs — that is why <code class="i">node app.js &amp;</code> “dies when I log out”</li>
<li><code class="i">nohup</code>/<code class="i">disown</code>/<code class="i">tmux</code> are for one-off tasks; a <b>server</b> belongs to systemd or Docker</li>
</ul>`) },

  /* 24 */
  { t: 'Daemons the right way: a systemd unit', giua: true, body: two(
    sql(`[Unit]
Description=CT Shop API (Node.js)
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
User=deployer
WorkingDirectory=/srv/ctshop
EnvironmentFile=/srv/ctshop/.env
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=2
KillSignal=SIGTERM
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target`, { lang: 'ini', sm: true, hl: [10, 11, 13, 14] }),
    `${term(`$ systemd-analyze verify ctshop-api.service
  -> exit code 0
$ grep Restart= typo.service      # one letter missing
Restart=on-failur
$ systemd-analyze verify typo.service
typo.service:13: Failed to parse service restart
  specifier, ignoring: on-failur
  -> exit code 0`, { title: 'systemd 252 · Debian 12 (paths shortened)', hl: [6, 7, 8] })}
<p style="font-size:18px;margin:0">Even <code class="i">verify</code> exits 0: the bad line is <b>ignored</b> and the service silently gets the default <code class="i">Restart=no</code>. Read the warnings.</p>
<ul style="font-size:19px">
<li><b>Restart=on-failure</b>: restarts on a non-zero exit or a signal death — but a crash loop is still a crash loop</li>
<li><b>TimeoutStopSec</b>: SIGTERM → wait → SIGKILL (default 90 s)</li>
<li><code class="i">systemctl stop</code> signals the <b>whole cgroup</b>, so no child is left behind</li>
</ul>`, 'r46') },

  /* 25 */
  { t: '🧭 On a real server / in this project', giua: true, body: two(
    `${box('cuongthai.com backend — done right', `<code class="i">Dockerfile.backend</code>: <b>tini</b> → <code class="i">fix-uploads-perms.sh</code> → <code class="i">exec "$@"</code> → <code class="i">node dist/index.js</code>.<br><code class="i">src/index.ts</code>: on SIGTERM → <code class="i">server.close()</code> → <code class="i">prisma.$disconnect()</code> → flush Sentry → <b>exit 0</b>; force-exit after <b>30 s</b>.`, 'xanh')}
${box('…with one mismatch to check', `<code class="i">docker-compose.yml</code> sets no <code class="i">stop_grace_period</code> for <b>backend</b> → Docker waits <b>10 s</b>. The 30 s safety timer can never fire: a request longer than 10 s is cut by SIGKILL (137). Fix: grace period ≥ 35 s, or an app timer &lt; 10 s.`, 'do2')}`,
    `${box('Incidents in this repo (2026-07)', `<b>07-06</b>: two image builds in parallel on the 6 GB VPS → the kernel OOM-killed <code class="i">next build</code>, <b>exit 137</b> → builds made sequential.<br><b>07-06</b>: a backend recreate race → <b>Exited (137)</b> + orphan containers; recovered with <code class="i">docker start</code>.`, '')}
${steps([
      'Read the code: <code class="i">docker ps -a</code> / <code class="i">kubectl describe pod</code>',
      '137? who sent SIGKILL: <code class="i">docker inspect -f {{.State.OOMKilled}}</code>, <code class="i">dmesg | grep -i oom</code> (cs5)',
      '143 / 0 = a normal stop · 127 = missing binary in the image',
    ])}`) },

  /* 26 */
  { t: '🎤 Interview questions you will be asked', to: true, giua: true, body: cards([
    ['fork() vs exec()?', 'fork copies the process (new PID, returns twice); exec replaces the program inside the same PID. Together = “start a program”.'],
    ['What is a zombie?', 'A finished child whose parent has not called wait(). Fix the parent (wait / SIGCHLD) or kill the parent so PID 1 reaps it.'],
    ['Exit 137 vs 143?', '128 + 9 = SIGKILL (OOM, timeout, kill -9). 128 + 15 = SIGTERM, a normal stop request.'],
    ['SIGTERM vs SIGKILL?', 'TERM can be caught → clean up. KILL and STOP cannot be caught, blocked or ignored — the kernel acts directly.'],
    ['Why does my container take 10 s to stop?', 'Your app is PID 1 (or behind sh/npm) and SIGTERM is dropped. Exec form + tini/--init + a handler.'],
    ['How do you shut down gracefully?', 'Stop accepting → drain in-flight → close pools → exit, within the orchestrator’s deadline. Node: server.close; Spring: graceful by default.'],
  ], 3) },

  /* 27 */
  { t: 'Check yourself', giua: true, body: `
<ol style="font-size:23px">
<li>A pod shows <b>Exit Code 137</b>, <code class="i">OOMKilled: false</code>. Name two other things that could have sent SIGKILL.</li>
<li><code class="i">ps</code> shows 300 processes in state <b>Z</b> with PPID 1 inside your container. What is PID 1, and what one flag fixes it?</li>
<li>Your Dockerfile ends with <code class="i">CMD npm start</code> and your Node app has <code class="i">process.on('SIGTERM')</code>. Will the handler run on <code class="i">docker stop</code>? Why?</li>
</ol>
${box('Answers', '1) The stop timeout expiring after SIGTERM (docker stop / Kubernetes grace period) or someone running <code class="i">kill -9</code>. 2) An app that does not reap adopted orphans (e.g. node); <code class="i">--init</code> (tini) as PID 1. 3) No — measured: npm signals its <code class="i">sh</code> child, sh dies, npm exits 1 and the app is killed without its handler. Use <code class="i">CMD ["node","dist/index.js"]</code>.', 'xanh')}` },

  /* 28 */
  { t: 'Summary', to: true, body: `
<ul>
<li>Every process has a parent; <code class="i">ps -ef --forest</code>, <code class="i">pstree</code>, <code class="i">/proc/&lt;pid&gt;</code> show it all</li>
<li><b>fork</b> copies, <b>exec</b> replaces, <b>wait</b> collects the exit code</li>
<li>Exit codes: 0 ok · 126/127 not executable/not found · <b>128+N</b> = killed by signal N (137, 143)</li>
<li>Zombie = not reaped; orphan = adopted by <b>PID 1</b>, which must reap</li>
<li>SIGTERM → clean up and exit before the deadline; SIGKILL cannot be caught</li>
<li>In Docker: <b>exec form + tini/--init + a SIGTERM handler</b></li>
</ul>
${box('Next', '<b>CS.2 — File descriptors &amp; I/O plumbing</b>: <code class="i">/proc/&lt;pid&gt;/fd</code>, pipes, “Too many open files”, fsync.', 'lam')}` },
]);
