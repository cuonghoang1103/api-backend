/**
 * os-08-4 — khoá "Operating Systems for Developers", bài 8.4 "The exit-137 incident, measured" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c84-host.out.txt và c84-high.out.txt (chạy thật) qua grab();
 * đoạn chú thích sự cố đọc THẲNG từ deploy.sh của repo; biểu đồ dòng thời gian memory.high lấy từng dòng của ./fill.
 * Giảng: giang/os-08-4.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, box, cards, tbl } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-08-4', code: 'OS 8.4', title: 'The exit-137 incident, measured', sub: 'Operating Systems · Chapter 8' };

const g = (pre, n = 1) => grab('c84-host', pre, n);
const gh = (pre, n = 1) => grab('c84-high', pre, n);
/* Dòng lệnh "$ …" quá dài cho khung ⇒ ngắt ở dấu cách thành "\\" + dòng tiếp (như người gõ trong terminal); output giữ nguyên. */
const wrap = (t, max = 104) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
/* Rút gọn hiển thị: một chuỗi dòng "heapUsed …" liên tiếp ⇒ dòng đầu + "…" + dòng cuối (chữ giữ nguyên) */
const gon = (t) => t.replace(/((?:^heapUsed[^\n]*\n){3,})/gm, (m) => { const L = m.trim().split('\n'); return `${L[0]}\n…\n${L[L.length - 1]}\n`; });
const tiny = (t, fs = 13) => sh(wrap(t, Math.round(104 * 13 / fs)), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 4}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 1.5}"/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e';

/* Đoạn chú thích THẬT trong deploy.sh (Step 2a) */
const deployNote = (() => {
  const L = fs.readFileSync(new URL('../../deploy.sh', import.meta.url), 'utf8').split('\n');
  const i = L.findIndex((l) => l.includes('Step 2a: Build images ONE AT A TIME'));
  if (i < 0) throw new Error('os-08-4: không thấy Step 2a trong deploy.sh');
  return L.slice(i, i + 7).join('\n');
})();
const upNote = (() => {
  const L = fs.readFileSync(new URL('../../deploy.sh', import.meta.url), 'utf8').split('\n');
  const i = L.findIndex((l) => l.includes('Do NOT pass `--build` here'));
  if (i < 0) throw new Error('os-08-4: không thấy ghi chú --build trong deploy.sh');
  return L.slice(i, i + 4).join('\n');
})();

/* memory.peak: song song vs tuần tự */
const peak = (txt) => +txt.match(/peak (\d+) MiB/)[1];
const peakSvg = () => {
  const par = peak(g('docker run --name os-c84a')), seq = peak(g('docker run --name os-c84b'));
  const X = 300, W = 700, sc = W / 560, lim = 512;
  let s = `<svg viewBox="0 0 1110 470" width="1110" height="470" font-family="Arial">`;
  [['A + B (parallel)', par, RD, 'both builds killed · oom_kill 2'], ['A then B (sequential)', seq, GR, 'both done · oom_kill 0']].forEach(([n, v, c, note], i) => {
    const y = 30 + i * 170;
    s += T(X - 18, y + 52, n, 24, { a: 'end', w: 800, f: c }) + R(X, y + 10, v * sc, 72, c + '33', c, { rx: 6, sw: 2 });
    s += T(X + 16, y + 56, `memory.peak ${v} MiB`, 24, { w: 800, f: c }) + T(X, y + 114, note, 20, { f: '#555' });
  });
  const lx = X + lim * sc;
  s += `<line x1="${lx}" y1="14" x2="${lx}" y2="370" stroke="#333" stroke-width="3" stroke-dasharray="8 6"/>` + T(lx, 396, '--memory 512m (the "VPS")', 19, { a: 'middle', w: 700 });
  s += T(X, 450, 'Same work (2 × 300 MB) both times — only the overlap changed.', 21, { w: 700, f: '#333' });
  return s + '</svg>';
};

/* Dòng thời gian memory.high → throttle → OOM: mỗi mẩu 8 MiB của ./fill */
const timelineSvg = () => {
  const rows = gh("sh -c 'echo $$").split('\n').map((l) => l.match(/^ *(\d+) MiB +\+ *([\d.]+) ms .*current +(\d+) MiB +swap +(\d+) MiB/)).filter(Boolean)
    .map((m) => ({ mib: +m[1], ms: +m[2], cur: +m[3], sw: +m[4] }));
  if (rows.length < 20) throw new Error('os-08-4: thiếu dòng ./fill');
  const X = 110, W = 960, H = 300, Y0 = 30, bw = W / (rows.length + 1), lg = (v) => Math.max(0, Math.log10(v) + 0.3) / 5.3 * H;
  let s = `<svg viewBox="0 0 1110 470" width="1110" height="470" font-family="Arial">`;
  [1, 10, 100, 1000, 10000].forEach((v) => {
    const y = Y0 + H - lg(v);
    s += `<line x1="${X}" y1="${y}" x2="${X + W}" y2="${y}" stroke="#e6e6e6"/>` + T(X - 10, y + 6, v >= 1000 ? `${v / 1000} s` : `${v} ms`, 15, { a: 'end', f: '#888' });
  });
  rows.forEach((r, i) => {
    const col = r.sw === 0 ? GR : r.sw < 32 ? OR : RD, h = lg(r.ms), x = X + i * bw + 3;
    s += R(x, Y0 + H - h, bw - 6, h, col + '55', col, { rx: 2 });
    if (i % 3 === 0 || i === rows.length - 1) s += T(x + (bw - 6) / 2, Y0 + H + 22, r.mib, 14, { a: 'middle', f: '#666' });
  });
  const kx = X + rows.length * bw + 3;
  s += `<line x1="${kx}" y1="${Y0}" x2="${kx}" y2="${Y0 + H}" stroke="${RD}" stroke-width="4"/>` + T(kx - 8, Y0 + 16, 'OOM kill · 137', 17, { a: 'end', w: 800, f: RD });
  s += T(X + W / 2, Y0 + H + 46, 'MiB allocated so far (8 MiB per bar) · bar height = time for that chunk, log scale', 16, { a: 'middle', f: '#777' });
  const leg = [[GR, 'under memory.high (96 MiB): ~1 ms'], [OR, 'over high: reclaim to swap, ~10 ms'], [RD, 'swap full (32 MiB): throttled, 7–43 s']];
  leg.forEach(([c, t], i) => { s += R(X + i * 330, Y0 + H + 66, 22, 22, c + '55', c) + T(X + i * 330 + 32, Y0 + H + 84, t, 17, { w: 700, f: c }); });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 8 — Memory pressure', bai: '8.4',
}, [
  { cover: true, t: 'The exit-137 incident,<br>measured', sub: 'next build on a 6 GB VPS — reproduced in a 512 MiB box' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The real incident, in the words of this project’s <b>deploy.sh</b></li>
<li>Reproduce it: two builds in parallel vs one after the other</li>
<li>Why a container can exit <b>0</b> with <b>OOMKilled=true</b></li>
<li>Exit <b>133 / 134 / 137</b>: who killed the process</li>
<li><b>memory.high → reclaim → throttling → memory.max</b>, timed</li>
<li>A five-step checklist for the next 137</li>
</ul>` },

  { t: 'The incident, as the repo remembers it', giua: true, body: `
${sql(deployNote, { lang: 'bash' })}
${sql(upNote, { lang: 'bash', sm: true })}
${box('2026-07-06 and again 2026-07-07', 'A cold build of backend + frontend in parallel on a 6 GB VPS that was also serving the live site: the kernel SIGKILLed <code class="i">next build</code>. The next day it happened again through <code class="i">compose up --build</code>, which silently builds both at once.', 'do2')}` },

  { t: 'Reproduce: two “builds” in parallel, 512 MiB', giua: true, body: `
${tiny(g('docker run --name os-c84a') + '\n' + g('echo "container exit') + '\n' + g("docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' os-c84a"))}` },

  { t: 'Same work, one after the other', giua: true, body: `
${tiny(g('docker run --name os-c84b') + '\n' + g("docker inspect -f 'OOMKilled={{.State.OOMKilled}} ExitCode={{.State.ExitCode}}' os-c84b"))}` },

  { t: 'The fix is the peak, not the total', body: peakSvg() },

  { t: 'Exit 0 and OOMKilled=true at the same time', giua: true, body: `
${tiny(g('docker run --name os-c84c', 3), 14)}
${cards([
    ['PID 1 killed', '<code class="i">node build.js</code> was PID 1 ⇒ the container dies: <b>exit 137, OOMKilled=true</b>.'],
    ['A child killed', 'The bash script was PID 1 and survived ⇒ <b>exit 0</b>, yet <b>OOMKilled=true</b>. Your CI says “success”.'],
    ['Check both', 'Exit code <b>and</b> OOMKilled <b>and</b> memory.events oom_kill. One of them alone can lie.'],
  ])}` },

  { t: 'Who killed it? 133, 134 or 137', giua: true, body: `
${tiny(gon([g('docker run --rm --name os-c84d'), g('docker run --rm --init'), g('docker run --rm --name os-c84e', 2), g('docker run --rm --name os-c84f', 2)].join('\n') + '\n'), 13)}` },

  { t: 'Decoding the number', to: true, giua: true, body: tbl(['exit', 'signal', 'who', 'what you see'], [
    ['134', 'SIGABRT (6)', 'V8 itself, heap limit reached', '"FATAL ERROR: Reached heap limit" + GC trace'],
    ['133', 'SIGTRAP (5)', 'same, but node is PID 1 (arm64)', 'same message; PID 1 ignores its own SIGABRT'],
    ['137', 'SIGKILL (9)', 'the kernel: cgroup limit', 'nothing — output just stops; dmesg + OOMKilled'],
    ['heap 259 MB', '—', 'Node default in a 256 MiB box', 'heap limit > container ⇒ the kernel always wins'],
  ], { hl: [2] }) },

  { t: 'memory.high → reclaim → throttling → memory.max', body: timelineSvg() },

  { t: 'What the cgroup recorded', giua: true, body: `
${sh(gh('grep . /sys/fs/cgroup/job/memory') + '\n' + gh('cat /sys/fs/cgroup/job/memory.events') + '\n' + gh('cat /sys/fs/cgroup/job/memory.pressure'))}
<p style="margin:0;font-size:20px"><b>high 1948</b>: times the group was over memory.high. Three minutes of throttling before the kill — PSI some <b>99.76%</b>. A build that "hangs" before it dies looks exactly like this.</p>` },

  { t: 'How this project fixed it', to: true, giua: true, body: cards([
    ['Build one at a time', 'deploy.sh Step 2a: backend, then frontend. Never <code class="i">compose up --build</code>.'],
    ['Fewer workers', 'next.config <code class="i">experimental.cpus</code> = 1: static generation forks fewer Node workers (the 137 side).'],
    ['Heap ≠ RAM', 'NODE_HEAP_MB 3072 → 4096 → 6144: each raise followed an exit <b>134</b> (V8 limit), not a 137.'],
    ['Build elsewhere', 'deploy-nha.sh builds on a 31 GB home machine with a 12,288 MB heap; the VPS only pulls the image.'],
    ['Watch the peak', 'memory.peak of the build vs free RAM on the box — not the average, not the total.'],
    ['Keep the record', 'Each incident left a dated comment in deploy.sh / Dockerfile. That is how this slide was written.'],
  ]) },

  { t: 'The next time you see 137', to: true, giua: true, body: `
<ol>
<li><b>Exit code + OOMKilled</b>: <code class="i">docker inspect -f '{{.State.OOMKilled}} {{.State.ExitCode}}'</code></li>
<li><b>memory.events</b>: oom_kill &gt; 0? high climbing?</li>
<li><b>dmesg / journalctl -k</b>: "invoked oom-killer", the task table, "Killed process"</li>
<li><b>memory.peak vs memory.max</b>: how far over, and what ran in parallel</li>
<li><b>PSI</b> before the kill: was it throttled for minutes first?</li>
</ol>` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Two cold builds at once broke a 6 GB VPS; one at a time fit</li>
<li>Reproduced: parallel peak 512 MiB (both killed) vs sequential 310 MiB</li>
<li>A child OOM can leave exit 0 with OOMKilled=true</li>
<li>134/133 = V8’s own limit; 137 = the kernel’s cgroup limit</li>
<li>memory.high throttles for minutes before memory.max kills</li>
</ul>` },
]);
