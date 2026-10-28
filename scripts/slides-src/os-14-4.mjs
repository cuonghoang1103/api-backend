/**
 * os-14-4 — khoá "Operating Systems for Developers", bài 14.4 "Memory on three systems" (29/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c144-mac.out.txt (Mac thật, đã ẩn danh) và c144-lx.out.txt (container lab)
 * qua grab(); mọi con số đổi đơn vị trên slide được TÍNH từ output đó (không gõ tay). Windows: theo tài liệu — ghi "per the docs".
 * Giảng: content/courses/operating-systems-for-developers/giang/os-14-4.mjs.
 */
import fs from 'node:fs';
import { lamDeck, sh, sql, two, box, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-14-4', code: 'OS 14.4', title: 'Memory on three systems', sub: 'Operating Systems · Chapter 14 — Windows & macOS' };

const m = (pre, n = 1) => grab('c144-mac', pre, n);
const l = (pre, n = 1) => grab('c144-lx', pre, n);
const cut = (t, w) => t.split('\n').map((x) => (x.length > w ? x.slice(0, w - 1) + '…' : x)).join('\n');
const term = (text, fs = 19, w = 1100) => sh(cut(text, Math.floor((w - 30) / (fs * 0.602)))).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.42">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.m ? ' font-family="Menlo,monospace"' : ''} fill="${o.f || '#333'}">${s}</text>`;
const R = (x, y, w, hh, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.rx ?? 10}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2.5}"${o.d ? ' stroke-dasharray="8 6"' : ''}/>`;
const A = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#m1)"/>`;
const BL = '#336791', OR = '#e08a1e', GR = '#2f7d4f', RD = '#c0392b', GY = '#777777';
const svg = (w, hh, inner) => `<svg viewBox="0 0 ${w} ${hh}" width="${w}" height="${hh}" font-family="Arial" style="display:block;margin:0 auto">` +
  `<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>${inner}</svg>`;
const bang = (cols, rows, fs = 20) => `<table class="t" style="font-size:${fs}px"><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
const c = (t) => `<code class="i">${t}</code>`;

/* số liệu tính từ output thật */
const VM = m('vm_stat');
const PAGE = +VM.match(/page size of (\d+) bytes/)[1];
const pages = (label) => +VM.match(new RegExp(`${label}:\\s+(\\d+)\\.`))[1];
const gib = (n) => (n * PAGE / 2 ** 30).toFixed(1);
const fmt = (n) => n.toLocaleString('en-US');
const ROWS = [['Pages free', 'free'], ['Pages wired down', 'wired (kernel, never paged out)'], ['Anonymous pages', 'anonymous (heaps, stacks)'], ['File-backed pages', 'file-backed (cache, code)'], ['Pages stored in compressor', 'data held by the compressor'], ['Pages occupied by compressor', 'RAM the compressor uses']];
const LX = l('free -m', 4);
const kb = (k) => +LX.match(new RegExp(`${k}:\\s+(\\d+) kB`))[1];
const commitLimit = kb('CommitLimit'), committed = kb('Committed_AS');
const gi = (k) => (k / 2 ** 20).toFixed(2);
const PY = m('python3 an.py', 2);
const pyCols = PY.split('\n').find((x) => /^\d+\s+\d+\s+\d+/.test(x)).trim().split(/\s+/);
const rssMiB = (+pyCols[1] / 1024).toFixed(0), vszGiB = (+pyCols[2] / 2 ** 20).toFixed(0), foot = PY.match(/Footprint: (\d+ MB)/)[1];
const LPY = l('python3 an.py');
const lRssMiB = (+LPY.match(/VmRSS:\s+(\d+)/)[1] / 1024).toFixed(0);
const CMP = m('vm_stat | awk').match(/holds ([\d.]+) GiB of data in ([\d.]+) GiB/);
const TOP = m('top -l 1 -n 0 -s 0', 4);
const swapUsed = (+TOP.match(/used = ([\d.]+)M/)[1] / 1000).toFixed(1), freePct = TOP.match(/percentage: (\d+%)/)[1], nSwap = TOP.trim().split('\n').pop().trim();
const availGiB = (+LX.match(/MemAvailable:\s+(\d+)/)[1] / 2 ** 20).toFixed(1);
const anPy = fs.readFileSync(new URL('../../content/courses/operating-systems-for-developers/lab/code/ch14/an.py', import.meta.url), 'utf8').split('\n').slice(1).join('\n').trim();

/* hành trình một trang ẩn danh khi RAM thiếu, theo từng hệ */
const ladder = () => {
  let s = '';
  const row = (y, name, c, steps) => {
    s += T(10, y + 38, name, 22, { w: 700, f: c });
    steps.forEach(([t, sub], i) => {
      const x = 150 + i * 238;
      s += R(x, y, 214, 64, c + '14', c) + T(x + 107, y + 28, t, 18, { a: 'middle', w: 700 }) + T(x + 107, y + 50, sub, 14, { a: 'middle', f: '#555' });
      if (i < steps.length - 1) s += A(x + 216, y + 32, x + 236, y + 32);
    });
  };
  row(10, 'Linux', GR, [['drop clean cache', 'page cache shrinks'], ['swap out', 'if swap exists'], ['thrash', 'PSI memory high'], ['OOM killer', 'exit 137']]);
  row(110, 'macOS', BL, [['purge cache', 'cached files'], ['compress', `in RAM, ×${(+CMP[1] / +CMP[2]).toFixed(1)}`], ['swapfiles', 'grow 1 GiB each'], ['"out of memory"', 'dialog, force quit']]);
  row(210, 'Windows', OR, [['trim working sets', 'to standby list'], ['compress', 'Windows 10+'], ['pagefile.sys', 'grows to 3× RAM'], ['commit fails', 'nobody is killed']]);
  s += T(555, 312, 'Windows row: per the docs', 15, { a: 'middle', f: OR });
  return svg(1110, 322, s);
};

/* compressor: dữ liệu giữ vs RAM chiếm */
const cmpBars = () => {
  const a = +CMP[1], b = +CMP[2], W = 760, x0 = 300;
  let s = R(x0, 20, W, 54, BL + '22', BL) + T(20, 54, 'data held', 22, { w: 700 }) + T(x0 + W - 12, 54, `${a} GiB`, 22, { a: 'end', m: 1, w: 700, f: BL });
  s += R(x0, 92, W * b / a, 54, GR + '33', GR) + T(20, 126, 'RAM it occupies', 22, { w: 700 }) + T(x0 + W * b / a + 12, 126, `${b} GiB`, 22, { m: 1, w: 700, f: GR });
  return svg(1110, 160, s);
};
/* commit: lời hứa vs khả năng bảo đảm (Linux đo thật) */
const commitBars = () => {
  const max = Math.max(commitLimit, committed) * 1.08, W = 700, x0 = 300;
  const bar = (y, val, lab, col) => R(x0, y, W * val / max, 46, col + '30', col) + T(20, y + 30, lab, 20, { w: 700 }) + T(x0 + W * val / max + 12, y + 30, `${gi(val)} GiB`, 20, { m: 1, w: 700, f: col });
  let s = bar(20, commitLimit, 'CommitLimit', GR) + bar(86, committed, 'Committed_AS', RD);
  s += T(20, 182, 'Linux (overcommit_memory = 1): promised more than it can back — allowed;', 21, { f: '#333' });
  s += T(20, 212, 'the OOM killer settles the bet later.', 21, { f: '#333' });
  s += T(20, 252, 'Windows (per the docs): the same commit would FAIL — charge ≤ RAM + pagefile.', 21, { f: OR, w: 700 });
  return svg(1110, 266, s);
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 14 — Windows & macOS', bai: '14.4',
}, [
  { cover: true, t: 'Memory on three systems', sub: 'Page cache, compressed memory, swap files and the Windows commit limit — which number really means "trouble"' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Three strategies for "not enough RAM": Linux, macOS, Windows</li>
<li>Reading <b>vm_stat</b> in <b>16 KiB</b> pages, and the compressor</li>
<li>Why ${swapUsed} GB of swap on a Mac can be harmless</li>
<li>One process, three sizes: <b>RSS</b>, <b>VSZ</b>, <b>footprint</b></li>
<li><b>Overcommit</b> on Linux vs the <b>commit limit</b> on Windows</li>
</ul>` },

  { t: 'Three strategies for "not enough RAM"', giua: true, body: bang(['', 'Linux', 'macOS', 'Windows (per the docs)'], [
    ['spare RAM holds', 'page cache', 'cached files', 'standby list'],
    ['first move', 'drop cache, then swap', '<b>compress</b> in RAM', 'trim working sets, compress'],
    ['backing store', 'fixed swap (often none on a VPS)', 'swapfiles that <b>grow</b>, 1 GiB each', 'pagefile.sys'],
    ['promises', '<b>overcommit</b>', 'no commit limit', '<b>no overcommit</b>: charge ≤ RAM + pagefile'],
    ['last resort', 'OOM killer → 137', '"out of application memory" dialog', 'allocations fail'],
    ['number that means trouble', 'MemAvailable low + PSI', '<b>memory pressure</b>, swapins', '<b>Committed</b> near limit'],
  ], 20) },

  { t: 'The same three moves, in a different order', giua: true, body: ladder() +
    box('', 'macOS compresses <b>before</b> touching the disk; Linux on a VPS often has no swap at all; Windows never promises more than it can back.', 'lam') },

  { t: 'vm_stat counts in pages of 16,384 bytes', giua: true, body: two(
    term(VM.split('\n').slice(0, 10).join('\n') + '\n…', 15, 560),
    bang(['line', 'pages', 'GiB'], ROWS.map(([k, d]) => [d, fmt(pages(k)), gib(pages(k))]), 20)) +
    box('', `Header: <code class="i">page size of ${PAGE} bytes</code>. Every count × ${fmt(PAGE)} — never × 4096 on Apple Silicon.`, 'lam') },

  { t: `The compressor: ${CMP[1]} GiB of data in ${CMP[2]} GiB of RAM`, giua: true, to: true, body: term(m('vm_stat | awk'), 17) + cmpBars() +
    box('', 'Compressing a 16 KiB page costs microseconds; reading it back from an SSD swapfile costs far more. That is why macOS compresses first — and why "Memory Used: 30 GB" alone is not alarming.', 'lam') },

  { t: 'Watch pressure, not "swap used"', giua: true, body: term(m('top -l 1 -n 0 -s 0', 4), 20) +
    box('', `${swapUsed} GB of swap in ${nSwap} self-created 1 GiB swapfiles — yet <b>${freePct.replace('%', ' %')} free</b>: the swapped data is cold. Trouble = pressure yellow/red and <code class="i">swapins</code> rising in <code class="i">vm_stat 1</code>.`, 'xanh') },

  { t: 'One process, three sizes', giua: true, body: two(
    sql(anPy, { lang: 'python' }).replace('<pre class="vs">', '<pre class="vs" style="font-size:15px">'),
    term(PY.replace(/\/opt\/homebrew\/Cellar\/python@3\.14\/3\.14\S*/, 'Python'), 15, 560)) +
    bang(['size', 'value', 'meaning'], [
      ['RSS', `${rssMiB} MiB`, 'pages resident in RAM — drops when pages are compressed'],
      ['VSZ', `${vszGiB} GiB`, 'huge reserved regions in every macOS process — meaningless'],
      ['footprint', foot, 'dirty memory incl. compressed + swapped — Activity Monitor’s "Memory"'],
    ], 18) },

  { t: `Linux beside it: ${availGiB} GiB available, no compression`, giua: true, body: term(LX.replace(/^(SwapTotal|SwapFree):.*\n/gm, ''), 19) +
    box('', `Docker’s VM: ${c('available')} is the honest number. ${c('zswap')} = N: this Linux does not compress. And it has promised more memory than it can guarantee…`, 'lam') },

  { t: 'Overcommit vs the commit limit', giua: true, to: true, body: commitBars() +
    box('', 'That is how a Windows laptop says "out of memory" with RAM free: the <b>commit limit</b> ran out, not the RAM (per the docs).', 'do2') },

  { t: 'The same Python process on Linux', giua: true, to: true, body: term(LPY, 23) +
    box('', `RSS ≈ ${lRssMiB} MiB, all anonymous, no swap. Same allocation, same RSS idea — but no footprint and no compressor in this VM.`, 'lam') },

  { t: 'Pitfall: the 4096 script and the missing pagefile', giua: true, to: true, body: vsd(
    'Multiply vm_stat by 4096 (an Intel-Mac habit) → Apple Silicon looks 4× smaller. Disable the pagefile on Windows "to speed it up".',
    'Read the page size from the vm_stat header or <code class="i">sysctl -n hw.pagesize</code>. Keep a system-managed pagefile: without it the commit limit = RAM, and allocations fail with RAM free (per the docs).') },

  { t: 'Practice: buy more RAM?', giua: true, body: `
<ol>
<li>Mac: ${c('vm_stat')} (× 16 KiB), ${c('memory_pressure | tail -1')}, ${c('sysctl vm.swapusage')}, then ${c('vm_stat 1')} — watch swapins</li>
<li>${c('python3 an.py 512 60 &amp;')} → ${c('ps -o rss')} vs ${c('footprint -p PID')} vs Activity Monitor</li>
<li>Lab: ${c('free -m')}, ${c("grep Commit /proc/meminfo")}</li>
<li>Windows teammate: Task Manager → Memory → "Committed x / y GB" (per the docs)</li>
</ol>` + box('Done when', 'for each machine you name the one number that decides "short of memory", say whether it is short, and explain why 12 GB of swap on the Mac can be harmless.', 'xanh') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Spare RAM becomes cache everywhere — "free" near zero means nothing</li>
<li>macOS <b>compresses first</b> (${CMP[1]} GiB in ${CMP[2]} GiB), then swaps to growing swapfiles</li>
<li>Watch <b>memory pressure</b> + swapins, not "swap used"</li>
<li>Windows never overcommits: <b>commit charge ≤ RAM + pagefile</b></li>
<li>RSS ≠ footprint; VSZ is meaningless on macOS; pages are <b>16 KiB</b></li>
</ul>` },
]);
