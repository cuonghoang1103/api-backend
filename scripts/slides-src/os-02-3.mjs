/**
 * os-02-3 — khoá "Operating Systems for Developers", bài 2.3 "Memory: free, available, exit 137" (28/10/2026).
 * Khuôn _pg-chung.mjs (slide EN, dáng FU, logo CuongThai.com). Output đọc THẲNG từ lab/out/c23-mem.out.txt và
 * c23-oom.out.txt (chạy thật trong ảnh os-lab) qua grab() — không chép tay. Giảng: giang/os-02-3.mjs (walk()).
 */
import { lamDeck, sql, sh, two as two0, box, cards } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-02-3', code: 'OS 2.3', title: 'Memory: free, available, exit 137', sub: 'Operating Systems · Chapter 2' };

const cut = (t, n) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const gm = (pre, n = 1, w = 200, o) => cut(grab('c23-mem', pre, n, o), w);
const go = (pre, n = 1, w = 200, o) => cut(grab('c23-oom', pre, n, o), w);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="8 5"' : ''}/>`;
const BL = '#336791', OR = '#e08a1e', BR = '#b85a2b', GR = '#2f7d4f', GY = '#8a8a8a', RD = '#c0392b';

/* Slide 3: thanh 7934 MiB chia used / buff-cache / free, ngoặc "available" = free + phần cache bỏ được. */
const freeBar = () => {
  const W = 1000, x0 = 55, tot = 7934, sc = (v) => (v / tot) * W;
  const u = 3262, c = 4030, f = 996, av = 4671;
  let s = `<svg viewBox="0 0 1110 250" width="1110" height="250" font-family="Arial">`;
  s += R(x0, 70, sc(u), 70, '#d9d9d9', GY) + T(x0 + sc(u) / 2, 103, 'used 3262', 22, { a: 'middle', w: 800 }) + T(x0 + sc(u) / 2, 128, 'processes + kernel', 16, { a: 'middle', f: '#555' });
  s += R(x0 + sc(u), 70, sc(c), 70, BL + '33', BL) + T(x0 + sc(u) + sc(c) / 2, 103, 'buff/cache 4030', 22, { a: 'middle', w: 800, f: BL }) + T(x0 + sc(u) + sc(c) / 2, 128, 'page cache — given back on demand', 16, { a: 'middle', f: BL });
  s += R(x0 + sc(u) + sc(c), 70, sc(f), 70, GR + '33', GR) + T(x0 + sc(u) + sc(c) + sc(f) / 2, 103, 'free', 20, { a: 'middle', w: 800, f: GR }) + T(x0 + sc(u) + sc(c) + sc(f) / 2, 128, '996', 18, { a: 'middle', f: GR, w: 700 });
  s += T(x0, 50, 'total 7934 MiB', 20, { w: 700 });
  // ngoặc available ở dưới, phủ từ cuối thanh lùi sang trái đúng 4671
  const xa = x0 + W - sc(av);
  s += `<path d="M${xa},160 L${xa},180 L${x0 + W},180 L${x0 + W},160" fill="none" stroke="${OR}" stroke-width="3"/>`;
  s += T(xa + sc(av) / 2, 212, 'available 4671 = free + cache the kernel can drop', 22, { a: 'middle', w: 800, f: BR });
  s += T(xa + sc(av) / 2, 238, '← the number to watch', 18, { a: 'middle', f: BR });
  return s + '</svg>';
};

/* Slide 6: tốc độ đọc 400 MB — lần đầu (sau khi bỏ cache) vs lần hai (từ RAM). */
const readBars = () => {
  let s = `<svg viewBox="0 0 1110 170" width="1110" height="170" font-family="Arial">`;
  const max = 28, W = 760;
  [['1st read (not cached)', 8.9, GY], ['2nd read (page cache)', 28, GR]].forEach(([n, v, c], i) => {
    const y = 20 + i * 70;
    s += T(250, y + 34, n, 21, { a: 'end', w: 700 });
    s += R(265, y + 8, (v / max) * W, 40, c + '33', c);
    s += T(265 + (v / max) * W - 12, y + 35, v + ' GB/s', 21, { a: 'end', w: 800, f: c === GY ? '#444' : GR });
  });
  return s + '</svg>';
};

/* Slide 11: hai build song song vượt vạch 1 GB ⇒ OOM; một build một lần thì dưới vạch. */
const buildBars = () => {
  const H = 250, top = 34, mx = 1100, sc = (v) => (v / mx) * H, base = top + H;
  let s = `<svg viewBox="0 0 1110 340" width="1110" height="340" font-family="Arial">`;
  const lim = base - sc(1024);
  const bar = (x, v, c, lab) => R(x, base - sc(v), 120, sc(v), c + '33', c, { rx: 3 }) + T(x + 60, base - sc(v) + 26, lab, 18, { a: 'middle', w: 800, f: c });
  // một build
  s += bar(80, 657, GR, '657 MB');
  s += T(140, base + 26, 'one build', 19, { a: 'middle', w: 700 }) + T(140, base + 34 + 14, 'exit 0', 17, { a: 'middle', f: GR, w: 700 });
  // hai build song song (chồng lên nhau)
  s += R(360, base - sc(456), 120, sc(456), BL + '33', BL, { rx: 3 }) + T(420, base - sc(456) / 2, 'backend', 18, { a: 'middle', w: 800, f: BL });
  s += R(360, base - sc(912), 120, sc(456), OR + '33', OR, { rx: 3 }) + T(420, base - sc(456) - sc(456) / 2, 'frontend', 18, { a: 'middle', w: 800, f: BR });
  s += T(420, base + 26, 'two in parallel', 19, { a: 'middle', w: 700 }) + T(420, base + 48, 'both exit 137', 17, { a: 'middle', f: RD, w: 700 });
  // tuần tự
  s += bar(760, 656, GR, '656 MB') + bar(900, 656, GR, '656 MB');
  s += T(890, base + 26, 'one after the other', 19, { a: 'middle', w: 700 }) + T(890, base + 48, 'exit 0', 17, { a: 'middle', f: GR, w: 700 });
  // vạch giới hạn
  s += `<line x1="40" y1="${lim}" x2="1080" y2="${lim}" stroke="${RD}" stroke-width="3" stroke-dasharray="10 6"/>`;
  s += T(1075, lim - 10, '--memory 1g (no swap)', 19, { a: 'end', w: 800, f: RD });
  s += T(500, lim + 60, '≈ 912 MB + overhead', 18, { a: 'start', f: RD, w: 700 });
  s += T(500, lim + 84, '→ OOM killer', 18, { a: 'start', f: RD, w: 700 });
  return s + '</svg>';
};

/* Slide 10: thẻ sự cố 5 dòng. */
const incident = (rows) => `<table class="t" style="font-size:23px">${rows.map(([k, v]) => `<tr><th style="width:150px">${k}</th><td>${v}</td></tr>`).join('')}</table>`;

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 2 — Observing Linux', bai: '2.3',
}, [
  { cover: true, t: 'Memory: free,<br>available, exit 137', sub: '"Only 1 GB free" is usually fine —<br>and a build killed with no error is not' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The one memory column that matters: <b>available</b>, not free</li>
<li>The <b>page cache</b> filling and emptying, with real numbers</li>
<li>Catch a <b>memory leak</b> with RSS — and why VSZ misleads</li>
<li>Replay this project's <b>exit 137</b> build incident on a 1 GB "VPS"</li>
<li>Read container memory with <b>docker stats</b> and the cgroup files</li>
</ul>
${box('Measured, not claimed', 'Every output is a real run in the course lab: Docker Desktop VM, 10 cores, 7.7 GiB RAM, Node 22.', 'lam')}` },

  { t: 'Read available, not free', giua: true, body: `
${sh(gm('free -m'), { sm: true })}
${freeBar()}` },

  { t: 'Each column of free, in one line', to: true, giua: true, body: `
<table class="t" style="font-size:23px">
<tr><th style="width:24%">Column</th><th>Meaning</th></tr>
<tr><td><b>total</b></td><td>RAM the kernel can use</td></tr>
<tr><td><b>used</b></td><td>taken by processes and the kernel, cannot simply be dropped</td></tr>
<tr><td><b>free</b></td><td>used by nobody — <i>wasted</i>; Linux keeps it small on purpose</td></tr>
<tr><td><b>buff/cache</b></td><td>file contents kept in RAM; handed back the moment programs need it</td></tr>
<tr><td><b>available</b></td><td>what a new program can get <b>without swapping</b> = free + droppable cache</td></tr>
</table>
${box('Same numbers, one source', 'free, top and every monitoring agent read <code>/proc/meminfo</code>: MemTotal, MemFree, <b>MemAvailable</b>, Buffers, Cached.', 'lam')}` },

  { t: 'Writing a file fills the page cache', giua: true, body: `
${sh(gm('free -m', 1).split('\n').slice(0, 3).join('\n') + '\n' + gm('dd if=/dev/urandom', 2, 100), { sm: true })}
<ul style="font-size:23px;margin:0">
<li>Writing 400 MB: buff/cache <b>4030 → 4430</b>, free <b>996 → 617</b></li>
<li>available: <b>4671 → 4692</b> — barely moved: the file's pages sit in RAM, and cache <b>counts as available</b></li>
</ul>
${box('Free going down is not memory going away', 'The kernel turned spare RAM into a disk cache. It gives it back instantly when a program asks for memory.', 'xanh')}` },

  { t: 'Reading from the cache was 3× faster', giua: true, body: `
${term(gm('python3 -c', 4, 110, { drop: /records (in|out)/ }))}
${readBars()}
<p style="margin:0;font-size:19px;color:#666">Honest note: the lab's "disk" is a file on the Mac's SSD that macOS caches too, so even the first read is fast. On a cloud disk the gap is far wider.</p>` },

  { t: 'Delete the file and its cache is gone; no swapping at all', giua: true, body: `
${term(gm('rm /data/big.bin'))}
${term(gm('vmstat -S M', 1, 110))}
<ul style="font-size:23px;margin:0">
<li>buff/cache back to <b>4030</b> the moment the file disappears</li>
<li><code class="i">swpd</code>, <code class="i">si</code>, <code class="i">so</code> all <b>0</b> — no memory pressure</li>
<li>Worry when <b>available keeps shrinking</b> or <b>si/so</b> stay above 0</li>
</ul>` },

  { t: 'A cache that never forgets is a memory leak', giua: true, body: two(
    sql(`const cache = new Map();   // ❌ no size limit, no TTL
http.createServer((req, res) => {
  const id = new URL(req.url, 'http://x')
               .searchParams.get('id');
  if (!cache.has(id))
    cache.set(id, Buffer.alloc(200 * 1024, 1));
  res.end(\`cached=\${cache.size}\\n\`);
}).listen(3001);`, { lang: 'javascript', sm: true }),
    term(gm('ps -o pid,rss,vsz,comm -p', 3, 62)),
  ) + box('RSS 49 MB → 373 MB', 'after 1 500 distinct ids × 200 KB: the growth matches the cache exactly. Under steady traffic, a leak is an RSS line that only goes up.', 'do2') },

  { t: 'What /proc says about the leak', giua: true, body: two(
    term(gm("grep -E '^(VmRSS") + '\n' + gm('ps -eo pid,rss,vsz,%mem,comm --sort')),
    `<ul style="font-size:22px">
<li><b>VmRSS</b> — RAM really used now</li>
<li><b>VmHWM</b> — the peak ("high-water mark")</li>
<li><b>RssAnon</b> — heap + buffers: here the leak</li>
<li><b>RssFile</b> — code and libraries mapped from files</li>
<li><b>VSZ</b> 1 GB — reserved address space, not RAM (lesson 1.1)</li>
</ul>`, 'r64') + box('Catch it over time', '<code>pidstat -r 60</code> or a monitoring graph of RSS. One snapshot cannot tell a leak from a big cache.', 'lam') },

  { t: 'Incident: next build dies with exit 137', giua: true, body: incident([
    ['Symptom', '06/07/2026: deploy on the 6 GB VPS stops in the middle of <code class="i">next build</code>: <b>exit 137</b>, no stack trace, no "error".'],
    ['Measure', '137 = 128 + 9 → SIGKILL. Backend and frontend images were built <b>at the same time</b>, on a cold cache.'],
    ['Cause', 'Two big Node builds needed more RAM than the box had; the kernel’s <b>OOM killer</b> killed the largest. <code class="i">--max-old-space-size</code> let Node grow past the real RAM.'],
    ['Fix', 'Build one image at a time (deploy.sh step 2a); later, build off the VPS (deploy-nha.sh).'],
    ['Prevent', 'Heap below the real limit · never two heavy builds on a small box · watch docker stats · alert on OOM kills.'],
  ]) },

  { t: 'One build fits in 1 GB; two in parallel are both killed', giua: true, body: `
${buildBars()}
${term(cut(go('docker run --rm --name os-c23b', 1).split('\n').slice(5, 9).join('\n'), 110))}` },

  { t: 'The only witness is the kernel', giua: true, body: `
${term(go('docker run --rm --name os-c23b', 1).split('\n').slice(-3).join('\n'), { title: 'memory.events (inside the container)' })}
${term(go('docker run --rm --label oslab=1 --privileged', 1).split('\n').slice(1).join('\n').replace(' total-vm', '\ntotal-vm'), { title: 'dmesg (line wrapped to fit)' })}
${box('No message from Node', 'SIGKILL cannot be caught: the process is gone before it can log. <code>oom_kill 2</code> and the "Killed process … (node)" line are all the evidence you get.', 'do2')}` },

  { t: 'Sequential builds pass; a lower heap limit fails loudly', giua: true, body: two(
    term(cut(go('docker run --rm --name os-c23c', 1).split('\n').slice(1).join('\n'), 60), { title: 'one after the other (same 1 GB box)' }),
    term(go('docker run --rm --name os-c23d', 1).split('\n').slice(1).join('\n').replace(' Allocation failed', '\nAllocation failed'), { title: '--max-old-space-size=256 (wrapped)' }),
  ) + `<ul style="font-size:22px;margin:0">
<li>Heap limit <b>below</b> the box: Node stops itself with a readable <b>FATAL ERROR</b></li>
<li>Exit <b>133</b> here (arm64, SIGTRAP); on x86-64 servers usually <b>134</b> (SIGABRT)</li>
</ul>` },

  { t: 'docker stats reads the cgroup; free inside does not', giua: true, body: `
${term(cut(go('docker run --name os-c23e', 2).split('\n').slice(1).join('\n'), 100), { title: 'build.js 1500 as the container’s main process, --memory 1g' })}
${term(go('docker stats'))}
${term(go('docker exec os-c23f'))}
<p style="margin:0;font-size:21px">Container uses <b>627 MiB of 1 GiB</b> (<code class="i">memory.current / memory.max</code>) — while <code class="i">free</code> inside the same container shows the VM's <b>7934</b>.</p>` },

  { t: 'Cheat sheet — memory on a live system', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:44%">You want to know…</th><th>Run</th></tr>
<tr><td>Is the box short of memory?</td><td><code class="i">free -m</code> → <b>available</b> · <code class="i">vmstat 1 5</code> → si/so</td></tr>
<tr><td>Who uses the RAM?</td><td><code class="i">ps -eo pid,rss,comm --sort=-rss | head</code></td></tr>
<tr><td>Is it a leak?</td><td><code class="i">pidstat -r 60</code> — RSS that only grows</td></tr>
<tr><td>Was something OOM-killed?</td><td><code class="i">dmesg -T | grep -i "killed process"</code></td></tr>
<tr><td>In a container</td><td><code class="i">docker stats</code> · <code class="i">memory.current</code> · <code class="i">memory.events</code></td></tr>
<tr><td>Exit code</td><td><b>137</b> kernel SIGKILL · <b>133/134</b> Node's own heap limit</td></tr>
</table>
${box('Rule of thumb', 'Near-zero free is the page cache doing its job. Watch available and swapping; keep Node’s heap below the real limit.', 'xanh')}` },
]);
