/**
 * os-11-3 — khoá "Operating Systems for Developers", bài 11.3 "strace and ltrace in anger" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output + số đo đọc THẲNG từ lab/out/c113-strace.out.txt qua grab(); dòng thời gian curl và bảng
 * "syscall mỗi request" tính từ chính các dòng đó. Giảng: content/courses/operating-systems-for-developers/giang/os-11-3.mjs.
 */
import { lamDeck, sh, box, cards, vsd, steps, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-11-3', code: 'OS 11.3', title: 'strace and ltrace in anger', sub: 'Operating Systems · Chapter 11' };

const g = (pre, n = 1) => grab('c113-strace', pre, n);
const wrap = (t, max) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k + 1) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 14) => sh(wrap(t, Math.floor(1060 / (fs * 0.602))), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"/>`;
const A = (x1, y1, x2, y2, c, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${o.sw ?? 2.5}"${o.dash ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#ar${c.slice(1)})"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', GY = '#8a8a8a', PU = '#7b4fa0';
const mk = (m) => `<marker id="ar${m.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial" style="display:block;margin:0 auto"><defs>${[BL, GR, RD, OR, GY, PU].map(mk).join('')}</defs>${inner}</svg>`;

/* dòng thời gian curl → example.com, tính từ dấu thời gian -tt */
const sec = (l) => { const m = l.match(/(\d\d):(\d\d):(\d\d\.\d+)/); return +m[1] * 3600 + +m[2] * 60 + +m[3]; };
const curlLines = g("grep -E 'htons").split('\n').slice(1);
const ev = {
  dns0: sec(curlLines.find((l) => /htons\(53\)/.test(l) && /connect/.test(l))),
  dns1: sec(curlLines.slice(0, curlLines.findIndex((l) => /htons\(80\)/.test(l))).filter((l) => /recvfrom/.test(l)).pop()),
  tcp: sec(curlLines.find((l) => /EINPROGRESS/.test(l))),
  get: sec(curlLines.find((l) => /GET \//.test(l))),
  ok: sec(curlLines.find((l) => /HTTP\/1.1 200/.test(l))),
};
const ms = (a, b) => Math.round((b - a) * 1000);
const curlSvg = () => {
  const t0 = ev.dns0, span = ev.ok - t0, X = 40, W = 1020, sx = (t) => X + (t - t0) / span * W;
  const bars = [['DNS lookup', ev.dns0, ev.dns1, PU], ['TCP connect (EINPROGRESS → writable)', ev.tcp, ev.get, OR], ['waiting for the response', ev.get, ev.ok, BL]];
  let s = `<line x1="${X}" y1="40" x2="${X + W}" y2="40" stroke="#bbb" stroke-width="2"/>`;
  for (let k = 0; k <= 4; k++) { const t = t0 + span * k / 4; s += `<line x1="${sx(t)}" y1="34" x2="${sx(t)}" y2="46" stroke="#bbb" stroke-width="2"/>` + T(sx(t), 26, `${Math.round((t - t0) * 1000)} ms`, 14, { a: 'middle', f: '#888' }); }
  bars.forEach(([n, a, b, c], i) => {
    const y = 70 + i * 74, w = Math.max(6, sx(b) - sx(a));
    s += R(sx(a), y, w, 40, c + '33', c, { rx: 4 }) + T(sx(a) + (sx(a) + w + 260 > X + W ? -10 : w + 10), y + 27, `${n}: ${ms(a, b)} ms`, 18, { a: sx(a) + w + 260 > X + W ? 'end' : 'start', w: 700, f: c });
  });
  return svg(1110, 290, s);
};

/* Nagle + delayed ACK: hai lần write nhỏ ⇒ chờ ACK trễ ~40 ms */
const nagleSvg = () => {
  let s = '';
  s += T(150, 26, 'server (Python / Java)', 18, { a: 'middle', w: 800, f: BL }) + T(940, 26, 'client (curl)', 18, { a: 'middle', w: 800, f: GR });
  s += `<line x1="150" y1="40" x2="150" y2="340" stroke="${BL}" stroke-width="3"/><line x1="940" y1="40" x2="940" y2="340" stroke="${GR}" stroke-width="3"/>`;
  s += A(152, 70, 936, 100, BL) + T(545, 72, 'write #1: headers (111 bytes) — sent at once', 16, { a: 'middle', f: BL, w: 700 });
  s += R(166, 112, 236, 56, RD + '14', RD) + T(284, 136, 'write #2: body (6 B)', 15, { a: 'middle', f: RD, w: 700 }) + T(284, 157, 'Nagle: wait for an ACK', 15, { a: 'middle', f: RD });
  s += R(688, 112, 236, 56, OR + '14', OR) + T(806, 136, 'delayed ACK: wait', 15, { a: 'middle', f: OR, w: 700 }) + T(806, 157, 'for more data…', 15, { a: 'middle', f: OR });
  s += `<line x1="545" y1="126" x2="545" y2="214" stroke="${RD}" stroke-width="2" stroke-dasharray="4 5"/>` + T(545, 112, '≈ 40 ms nobody moves', 19, { a: 'middle', w: 800, f: RD });
  s += A(936, 240, 154, 262, OR) + T(545, 238, 'ACK (timer fired)', 16, { a: 'middle', f: OR, w: 700 });
  s += A(152, 290, 936, 318, BL) + T(545, 292, 'now the body goes', 16, { a: 'middle', f: BL, w: 700 });
  return svg(1110, 350, s);
};

const perReq = () => {
  const tot = (txt) => +txt.split('\n').filter((l) => /total$/.test(l)).pop().trim().split(/ +/)[3];
  const node = tot(g("kill -INT $ST; wait $ST; head -7 node.sc"));
  const py = tot(g("kill -INT $ST; wait $ST; grep -v '^100.00' py.sc"));
  const java = tot(g("kill -INT $ST; wait $ST; head -10 java.sc"));
  const t = (pre, n) => g(pre, n).split('\n').filter((l) => / s$/.test(l));
  return tbl(['server (1,000 keep-alive requests)', 'syscalls', 'per request', 'what they are'], [
    ['Node http', node.toLocaleString('en'), (node / 1000).toFixed(1), 'epoll_pwait + read + one <b>writev</b> (+ futex on other threads)'],
    ['Python http.server (NODELAY)', py.toLocaleString('en'), (py / 1000).toFixed(1), 'recvfrom + <b>two sendto</b> (headers, then body)'],
    ['Java HttpServer (nodelay)', java.toLocaleString('en'), (java / 1000).toFixed(1), '3 write · 4 fcntl · 3 epoll_pwait · 2 epoll_ctl · 2 read · futex'],
  ], { hl: [2] });
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 11 — System calls', bai: '11.3',
}, [
  { cover: true, t: 'strace and ltrace<br>in anger', sub: 'Why does it fail, why does it hang, why is it slow — read the syscalls' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>strace flags</b> that answer real questions</li>
<li>Three incidents: a vague error, a silent hang, a slow call</li>
<li><b>Syscalls per request</b> for Node, Python and Java servers</li>
<li>A real <b>40 ms</b> bug found by reading a trace</li>
<li>What strace costs — and <b>ltrace</b> one level up</li>
</ul>` },

  { t: 'The flags you will actually use', giua: true, body: tbl(['flag', 'answers'], [
    ['<b>-f</b>', 'follow threads and children (Node, Java, any server)'],
    ['<b>-e trace=</b>openat,connect · <b>%file</b> · <b>%network</b>', 'only the calls you care about'],
    ['<b>-Z</b> (--failed-only)', 'only calls that returned an error'],
    ['<b>-p PID</b>', 'attach to a process that is already running (and stuck)'],
    ['<b>-T</b> · <b>-tt</b>', 'time spent inside each call · wall-clock timestamps'],
    ['<b>-c</b>', 'a summary table: count, errors, time per syscall'],
    ['<b>-o file</b> · <b>-y</b>', 'write to a file · show the path behind each fd'],
    ['<b>-k</b>', 'user stack of each call (if this strace build supports it)'],
  ]) },

  { t: 'Why does it fail? Ask for the failed calls', giua: true, body: `
${tiny(g('node cfg.js') + '\n' + g('strace -f -qq -Z') + '\n' + g('grep settings cfg.txt'), 14)}
${box('', 'The app only says “could not load configuration”. <b>-Z -e trace=%file</b> leaves 10 failed file calls; one of them is the path it really tried.', 'xanh')}` },

  { t: 'Why does it hang? Attach and look', giua: true, body: `
${tiny(g('python3 hang.py') + '\n' + g('timeout 2 strace -p'), 15)}
${box('', 'Blocked in <b>connect()</b> to 10.255.255.1:5432 — nobody answers, and the default socket has no timeout. Lesson 11.6 reads the same fact from <b>/proc</b>.', 'lam')}` },

  { t: `Why is it slow? -tt shows where ${ms(ev.dns0, ev.ok)} ms went`, giua: true, body: `
${curlSvg()}
${tiny(g("grep -E 'htons"), 12)}` },

  { t: 'One HTTP request to Node, call by call', giua: true, body: `
${tiny(g('cut -c1-130 one.txt').split('\n').slice(1).join('\n'), 13)}
${box('', 'accept → set TCP_NODELAY → register in epoll → read the request → (first request only: V8 loads the time zone file /etc/localtime while building the Date header) → <b>one writev</b> → close.', 'lam')}` },

  { t: '1,000 requests: count, then divide', giua: true, body: `
${tiny(g("time curl -s -o /dev/null \"http://127.0.0.1:3000/[1-1000]\"") + '\n' + g('strace -f -qq -c -p $NODE', 3), 13.5)}` },

  { t: 'Python’s server: 200 requests take 8.4 s', giua: true, to: true, body: `
${tiny(g('python3 pyserver.py & PY') + '\n' + g('time curl -s -o /dev/null "http://127.0.0.1:3000/[1-200]"'), 16)}
${box('Same machine, same curl', 'Node answered 1,000 requests in 0.135 s. Python needs <b>~42 ms per request</b> — on localhost, where nothing should take milliseconds.', 'do2')}` },

  { t: 'The client trace shows a 41 ms hole', giua: true, body: `
${tiny(g('strace -qq -tt -T -e trace=sendto,recvfrom -o client.txt'), 13)}
${box('', 'Request 2: the 111 header bytes arrive, the 6-byte body arrives <b>41 ms later</b>; meanwhile recvfrom says EAGAIN. The server wrote headers and body in <b>two syscalls</b>.', 'do2')}` },

  { t: 'Nagle meets delayed ACK', body: nagleSvg() + box('Fix', 'TCP_NODELAY (Python: <code class="i">disable_nagle_algorithm</code>, JDK: <code class="i">-Dsun.net.httpserver.nodelay=true</code>) — or send the response in one call, like Node’s writev.', 'xanh') },

  { t: 'After the fix: 8.4 s → 0.028 s', giua: true, body: `
${tiny(g('NODELAY=1 python3 pyserver.py', 2), 15)}
${tiny(g("javac HelloServer.java && java HelloServer", 2) + '\n' + g('java -Dsun.net.httpserver.nodelay=true', 3), 13)}` },

  { t: 'Syscalls per request, three servers', giua: true, body: perReq() + box('', 'Same answer “hello”, 3 vs 15 kernel crossings per request. Counting is how you find the expensive design — here the JDK server toggles blocking mode with <b>fcntl</b> 4 times per request.', 'lam') },

  { t: 'strace is not free: every call stops the program', giua: true, body: `
${tiny(g('time dd if=/dev/zero', 4), 13)}
${box('', 'ptrace stops the process twice per syscall: 0.05 s → 8 s. <b>--seccomp-bpf</b> lets the kernel skip the calls you did not ask for. Under load, prefer eBPF (lesson 11.6).', 'do2')}` },

  { t: '-k is not in every build: use gdb', giua: true, to: true, body: `
${tiny(g('strace -k'), 15)}
${cards([
    ['why', 'Ubuntu 26.04 builds strace for arm64 without the stack unwinder that <b>-k</b> needs.'],
    ['instead', '<code class="i">gdb -ex "catch syscall write" -ex run -ex bt</code> — the stack of lesson 11.1.'],
    ['on your VPS', 'Many x86-64 builds include it: just try <b>strace -k</b> there.'],
  ])}` },

  { t: 'ltrace: one level up — library calls', giua: true, body: `
${tiny(g('ltrace -c ./words', 2), 12.5)}
${tiny(g("ltrace -S -e malloc+strtok+fgets"), 12.5)}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li><b>-Z %file</b> for failures, <b>-p</b> for hangs, <b>-tt -T</b> for slowness</li>
<li>Count with <b>-c</b>, divide by requests — design costs become visible</li>
<li>Two small writes on a socket ⇒ Nagle + delayed ACK ⇒ <b>40 ms</b></li>
<li>strace slows a busy program badly; filter with <b>--seccomp-bpf</b></li>
<li><b>ltrace</b> shows library calls; most never reach the kernel</li>
</ul>` },
]);
