/**
 * os-08-5 — khoá "Operating Systems for Developers", bài 8.5 "Memory limits for Node, JVM and containers" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c85-host.out.txt và c85-lim.out.txt (chạy thật) qua grab();
 * đoạn chú thích heap của backend đọc THẲNG từ Dockerfile.backend; giới hạn các dịch vụ đọc từ docker-compose.yml.
 * Giảng: giang/os-08-5.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, box, cards, tbl, two } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-08-5', code: 'OS 8.5', title: 'Memory limits for Node, JVM and containers', sub: 'Operating Systems · Chapter 8' };

const g = (pre, n = 1) => grab('c85-host', pre, n);
const gl = (pre, n = 1) => grab('c85-lim', pre, n);
const wrap = (t, max = 104) => t.split('\n').map((l) => {
  if (!l.startsWith('$ ') || l.length <= max) return l;
  const out = []; let rest = l;
  while (rest.length > max) { let k = rest.lastIndexOf(' ', max - 2); if (k < 20) k = max - 2; out.push(rest.slice(0, k) + ' \\'); rest = '    ' + rest.slice(k + 1); }
  return [...out, rest].join('\n');
}).join('\n');
const tiny = (t, fs = 13) => sh(wrap(t, Math.round(104 * 13 / fs)), { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.36">`);
/* Rút gọn hiển thị một chuỗi dòng cùng dạng (giữ đầu + cuối, giữa thành "…"); chữ của các dòng giữ nguyên */
const gon = (t, re, head = 1, tail = 1) => {
  const L = t.split('\n'), out = []; let run = [];
  const flush = () => { if (run.length > head + tail + 1) out.push(...run.slice(0, head), '…', ...run.slice(-tail)); else out.push(...run); run = []; };
  L.forEach((l) => { if (re.test(l)) run.push(l); else { flush(); out.push(l); } }); flush();
  return out.join('\n');
};
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e';

/* Chú thích THẬT trong Dockerfile.backend về NODE_OPTIONS của ảnh chạy */
const heapNote = (() => {
  const L = fs.readFileSync(new URL('../../Dockerfile.backend', import.meta.url), 'utf8').split('\n');
  const i = L.findIndex((l) => l.includes('Node old-space heap cap'));
  if (i < 0) throw new Error('os-08-5: không thấy ghi chú heap trong Dockerfile.backend');
  return L.slice(i, i + 8).join('\n');
})();

/* Bảng heap mặc định của Node theo --memory (từ vòng for thật) */
const heapRows = g('for m in 256m').split('\n').slice(1).map((l) => l.match(/^(\S+) +heap limit (\d+) MB/)).filter(Boolean).map((m) => [m[1], +m[2]]);
const toMiB = (s) => (s.endsWith('g') ? +s.slice(0, -1) * 1024 : +s.slice(0, -1));
const heapSvg = () => {
  const X = 170, W = 700, sc = W / 4096;
  let s = `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">`;
  heapRows.forEach(([m, h], i) => {
    const y = 8 + i * 54, c = toMiB(m), over = h > c;
    s += T(X - 14, y + 32, `--memory ${m}`, 19, { a: 'end', w: 700 });
    s += R(X, y + 6, c * sc, 38, '#f1f1f1', '#999', { dash: 1 });
    s += R(X, y + 12, h * sc, 26, (over ? RD : BL) + '44', over ? RD : BL, { rx: 4 });
    s += T(X + Math.max(c, h) * sc + 12, y + 32, `heap ${h} MB${over ? ' > the box!' : ''}`, 18, { w: 800, f: over ? RD : BL });
  });
  return s + '</svg>';
};

/* Thanh 2G của backend: heap 1536 + phần ngoài heap */
const budgetSvg = () => {
  const X = 60, W = 990, sc = W / 2048;
  let s = `<svg viewBox="0 0 1110 150" width="1110" height="150" font-family="Arial">`;
  s += R(X, 30, 1536 * sc, 64, BL + '33', BL) + T(X + 1536 * sc / 2, 70, 'V8 old space: --max-old-space-size=1536', 21, { a: 'middle', w: 800, f: BL });
  s += R(X + 1536 * sc, 30, 512 * sc, 64, OR + '33', OR) + T(X + 1536 * sc + 256 * sc, 60, '~512 MB outside the heap', 17, { a: 'middle', w: 800, f: OR }) + T(X + 1536 * sc + 256 * sc, 82, 'Buffers · sharp · ONNX · stacks', 15, { a: 'middle', f: '#555' });
  s += T(X, 20, 'backend container: deploy.resources.limits.memory = 2G', 17, { w: 700, f: '#333' }) + T(X + W, 124, 'cross this ⇒ exit 137', 17, { a: 'end', w: 800, f: RD });
  s += `<line x1="${X + W}" y1="22" x2="${X + W}" y2="104" stroke="${RD}" stroke-width="4"/>`;
  return s + '</svg>';
};

/* Giới hạn của các dịch vụ trong docker-compose.yml thật */
const composeRows = (() => {
  const L = fs.readFileSync(new URL('../../docker-compose.yml', import.meta.url), 'utf8').split('\n');
  const rows = []; let svc = null;
  L.forEach((l) => {
    const m = l.match(/^  ([a-z][a-z0-9_-]*):\s*$/); if (m) svc = m[1];
    const k = l.match(/^\s+memory:\s*(\S+)/); if (k && svc) rows.push([svc, k[1]]);
  });
  return rows;
})();

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 8 — Memory pressure', bai: '8.5',
}, [
  { cover: true, t: 'Memory limits for Node,<br>JVM and containers', sub: 'Fit the runtime to the box — and leave room for what is not heap' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What every <b>docker run --memory*</b> flag writes into the cgroup</li>
<li>Node: the default heap follows the container — almost</li>
<li>Buffers, sharp, ONNX: memory the heap limit never sees</li>
<li>JVM: <b>MaxRAMPercentage</b>, and 137 vs OutOfMemoryError</li>
<li>Kubernetes <b>requests vs limits</b>, QoS and eviction</li>
<li><b>systemd-oomd / earlyoom</b>: killing on pressure, before the kernel</li>
</ul>` },

  { t: 'What docker run actually writes', giua: true, body: `
${tiny([g('docker run --rm --name os-c85f --label oslab=1 --memory 256m os-lab cat'), g('docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swap'), g('docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-reservation'), g('docker run --rm --name os-c85f --label oslab=1 --memory 256m --memory-swappiness')].join('\n'), 13.5)}` },

  { t: 'Flag → cgroup file', to: true, giua: true, body: tbl(['docker run', 'cgroup v2 file', 'measured'], [
    ['--memory 256m', 'memory.max', '268435456'],
    ['(no --memory-swap)', 'memory.swap.max = same as memory', '268435456 ⇒ RAM + equal swap'],
    ['--memory-swap 256m (= --memory)', 'memory.swap.max', '0 ⇒ no swap at all'],
    ['--memory-reservation 128m', 'memory.low (soft protection)', '134217728'],
    ['--oom-score-adj 500', '/proc/1/oom_score_adj', '500'],
    ['--memory-swappiness 10', '— (no such file on v2)', 'WARNING … discarded'],
  ], { hl: [1, 5] }) },

  { t: 'Node’s default heap follows the container', giua: true, body: `
${heapSvg()}
<p style="margin:0;font-size:20px">Node 22 sizes the heap at about half the cgroup limit — with a <b>floor of 259 MB</b>. In a 256 MiB box the default heap is bigger than the box: the kernel will always kill first (137), V8 never gets to say “heap out of memory”.</p>` },

  { t: 'Buffers live outside the heap', giua: true, body: `
${sh(gl('node --max-old-space-size=64 buf.js') + '\n' + gl('grep oom_kill', 1))}
${box('heapUsed 4 MB, rss 151 MB — then SIGKILL', 'Buffer, typed arrays, sharp images, an ONNX model, native addons: all <b>external</b> memory. --max-old-space-size caps only the JS heap, so the cgroup limit must cover heap <b>plus</b> everything else.', 'do2')}` },

  { t: 'Sizing a real Node service: this project’s backend', giua: true, body: `
${sql(heapNote, { lang: 'bash', sm: true })}
${budgetSvg()}` },

  { t: 'The JVM reads the cgroup', giua: true, body: `
${tiny(g('docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XshowSettings') + '\n' + g('docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:+PrintFlags') + '\n' + g('docker run --rm --name os-c85j --label oslab=1 --memory 512m os-lab java -XX:MaxRAMPercentage=75'), 13.5)}
${cards([
    ['Default: 25%', 'MaxHeapSize = 134,217,728 = 128 MiB of a 512 MiB box. Safe, but wastes three quarters.'],
    ['MaxRAMPercentage=75', '402,653,184 = 384 MiB. The usual production setting: heap scales with the limit.'],
    ['Never hard-code -Xmx', 'An -Xmx copied from a laptop ignores the box it lands in — next slide.'],
  ])}` },

  { t: '137 or OutOfMemoryError: you choose', giua: true, body: `
${tiny(gon([g('docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -Xmx1g', 2), g('docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 Hog', 2), g('docker run --rm --name os-c85h --label oslab=1 --memory 256m --memory-swap 256m -v "$PWD":/lab -w /lab os-lab java -XX:MaxRAMPercentage=75 -XX:+Exit')].join('\n'), /^holding /), 13)}` },

  { t: 'Why not 100%: the JVM is more than its heap', to: true, giua: true, body: cards([
    ['Metaspace + code cache', 'Class metadata and JIT-compiled code. Tens to hundreds of MB in a Spring Boot app.'],
    ['Thread stacks', 'Up to 1 MB reserved per platform thread (-Xss); 200 Tomcat threads add up.'],
    ['Direct buffers + GC', 'NIO/Netty off-heap buffers, and the collector’s own bookkeeping.'],
  ]) + box('Rule of thumb', 'MaxRAMPercentage 70–80 for most services; lower for many threads or heavy off-heap I/O. Add -XX:+ExitOnOutOfMemoryError so a heap OOM restarts the pod cleanly (exit 3) instead of limping on.', 'xanh') },

  { t: 'Kubernetes: requests schedule, limits kill', to: true, giua: true, body: tbl(['', 'requests.memory', 'limits.memory'], [
    ['used for', 'scheduling: “does this node have room?”', 'the container’s memory.max'],
    ['exceed it', 'allowed — but first to be evicted under node pressure', 'kernel OOM kill ⇒ reason OOMKilled, exit 137'],
    ['QoS + oom_score_adj', 'Guaranteed (req = lim): −997 · BestEffort (none): 1000', 'Burstable: 1000 − 1000 × request / node RAM (2…999)'],
    ['before the kernel', 'kubelet eviction at memory.available &lt; 100Mi (default)', 'cgroup v2: memory.oom.group = 1 since 1.28'],
  ]) },

  { t: 'Kill on pressure, before the kernel has to', giua: true, body: `
${tiny(gon(gl('./ws 200 50 rand') + '\n' + gl('for t in $(seq 1 30)'), /^t=/, 2, 2), 13)}
${cards([
    ['systemd-oomd', 'Watches PSI per cgroup (default 60% for 30 s) and swap use; kills a whole cgroup. On by default in Fedora and Ubuntu desktops.'],
    ['earlyoom', 'Tiny daemon: SIGTERM when available RAM and free swap both drop under 10%, SIGKILL under 5%.'],
    ['Our 7-line imitation', 'Killed the thrashing reader after 10 s at 20% pressure. The kernel’s oom_kill never moved.'],
  ])}` },

  { t: 'Too tight hurts too', giua: true, body: `
${two(tbl(['service (docker-compose.yml)', 'memory limit'], composeRows.map(([a, b]) => [a, b]), { w: 500 }), cards([
    ['Limit = peak + headroom', 'Measure memory.peak under real load, then add 20–30%. The tts limit was raised to 2560M after measuring 973 MB plus the voice-cloning imports.'],
    ['Warn before you kill', 'Set memory.high below memory.max (or alert on PSI) so pressure shows up as slowness you can see.'],
  ], 1))}` },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>--memory → memory.max; no --memory-swap ⇒ equal swap; swappiness flag ignored on v2</li>
<li>Node 22: default heap ≈ ½ the limit, floor 259 MB; Buffers are outside it</li>
<li>Heap cap below the container limit, with room for non-heap (1536 of 2G)</li>
<li>JVM: MaxRAMPercentage ~75 ⇒ OutOfMemoryError instead of a silent 137</li>
<li>K8s requests schedule, limits kill; oomd/earlyoom act on pressure first</li>
</ul>` },
]);
