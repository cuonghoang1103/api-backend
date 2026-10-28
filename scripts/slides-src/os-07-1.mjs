/**
 * os-07-1 — khoá "Operating Systems for Developers", bài 7.1 "Address spaces" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c71-kgdc.out.txt (chạy thật trong ảnh os-lab) qua grab();
 * sơ đồ bố cục và biểu đồ RSS/PSS lấy số từ chính output đó. Giảng: giang/os-07-1.mjs.
 */
import { lamDeck, sql, sh, two as two0, box, cards, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-07-1', code: 'OS 7.1', title: 'Address spaces: stack, heap, code, mmap, ASLR', sub: 'Operating Systems · Chapter 7' };

const g = (pre, n = 1) => grab('c71-kgdc', pre, n);
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b, ti = '') => two0(col(a), col(b), ti);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e', PU = '#7b4ea3', GY = '#8a8a8a';

/* Slide 3: bố cục không gian địa chỉ — địa chỉ lấy từ output ./layout */
const layout = () => {
  const out = g('./layout').split('\n').slice(1);
  const addr = (k) => out.find((l) => l.includes(k)).trim().split(/\s+/).pop();
  const rows = [ // từ trên (địa chỉ cao) xuống dưới
    ['stack', 'local variable · grows ↓', addr('local'), RD, 52],
    ['', 'free', '', GY, 26],
    ['mmap region', 'libc printf · malloc(8 MiB) · /etc/hostname', addr('printf()'), PU, 70],
    ['', 'huge free gap', '', GY, 50],
    ['heap', 'malloc(32) · grows ↑', addr('malloc(32)'), OR, 52],
    ['data + bss', 'global_init = 42 · global_zero', addr('global_init'), GR, 46],
    ['text + rodata', 'main() · "hello"', addr('main()'), BL, 52],
  ];
  let s = `<svg viewBox="0 0 1110 470" width="1110" height="470" font-family="Arial">`, y = 8;
  s += T(14, 22, '0xffff ffff ffff  (top, 256 TiB)', 16, { f: '#666', m: 1 });
  y = 34;
  rows.forEach(([n, sub, a, m, h]) => {
    if (!n) { s += R(250, y, 460, h, '#fafafa', '#cfcfcf', { dash: 1, sw: 1.5 }); s += T(480, y + h / 2 + 6, sub, 16, { a: 'middle', f: '#999' }); y += h + 6; return; }
    s += R(250, y, 460, h, m + '22', m);
    s += T(266, y + h / 2 + 7, n, 21, { w: 800, f: m });
    s += T(694, y + h / 2 + 6, sub, 15, { a: 'end', f: '#444' });
    s += T(730, y + h / 2 + 7, a, 18, { m: 1, w: 700, f: m });
    y += h + 6;
  });
  s += T(14, y + 14, '0x0000 0000 0000  (bottom)', 16, { f: '#666', m: 1 });
  s += T(14, 236, 'virtual', 18, { w: 700, f: '#555' }) + T(14, 258, 'addresses', 18, { w: 700, f: '#555' });
  return s + '</svg>';
};

/* Slide 13: tổng RSS vs tổng PSS — số đọc từ ./pss 200 3 */
const pssBars = () => {
  const sum = g('./pss 200 3').split('\n').find((l) => l.startsWith('sum')).trim().split(/\s+/);
  const rss = +sum[1], pss = +sum[2];
  const X = 260, W = 700, max = rss;
  let s = `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">`;
  [['sum of RSS', rss, RD, 'counts the shared 200 MiB four times'], ['sum of PSS', pss, GR, 'each shared page split between its 4 users']].forEach(([n, v, m, note], i) => {
    const y = 18 + i * 100, w = (v / max) * W;
    s += T(X - 16, y + 44, n, 24, { a: 'end', w: 800, f: m });
    s += R(X, y + 12, w, 52, m + '55', m, { rx: 6 });
    s += T(X + w + 14, y + 47, `${v} MiB`, 26, { w: 800, f: m });
    s += T(X, y + 90, note, 17, { f: '#555' });
  });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 7 — Memory', bai: '7.1',
}, [
  { cover: true, t: 'Address spaces', sub: 'stack, heap, code, mmap, ASLR —<br>and which memory number to believe' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Draw a process’s <b>address space</b> from a real run: text, data, heap, mmap, stack</li>
<li>Read <code class="i">/proc/&lt;pid&gt;/maps</code> and <code class="i">pmap -x</code>: mapped vs resident</li>
<li>See <b>ASLR</b> move everything — and turn it off</li>
<li>Hit the stack’s hard edge: depth, SIGSEGV, exit 139</li>
<li>Know when to quote <b>VSZ</b>, <b>RSS</b> or <b>PSS</b></li>
</ul>` },

  { t: 'One program, one address in every region', body: layout() },

  { t: 'The kernel’s map: /proc/self/maps', giua: true, body: `
${term(g('./layout maps').split('\n').slice(0, 13).join('\n') + '\n…')}
<p style="margin:0;font-size:20px">range · <b>permissions</b> (r w x, p = private) · file offset · device · inode · file. The program file appears 3 times (code, read-only data, globals), libc 4 times.</p>` },

  { t: 'Mapped is not resident: pmap -x', giua: true, body: two(
    term(g('pmap -x').split('\n').filter((l, i) => i < 8 || /stack|total|---/.test(l)).join('\n')),
    `${cards([
      ['Kbytes', 'Addresses that are valid. The 8 MiB malloc: <b>8196</b>.'],
      ['RSS', 'Pages in RAM right now. The same 8 MiB malloc: <b>4</b> kB.'],
      ['Whole process', '<b>10.9 MB</b> mapped, <b>1.3 MB</b> resident.'],
    ], 1)}`) },

  { t: 'ASLR moves every region at each run', giua: true, body: `
${term(g('cat /proc/sys/kernel/randomize_va_space'))}
${term(g('for i in 1 2 3; do ./layout short'))}
${term(g('for i in 1 2 3; do setarch -R'))}
<p style="margin:0;font-size:20px"><b>2</b> = full randomisation. <code class="i">setarch -R</code> turns it off: identical runs, program at <code class="i">0xaaaaaaaa0000</code>. The last 3 hex digits of main/heap/libc never change: ASLR moves whole 4 KiB pages.</p>` },

  { t: 'Without PIE, the code stops moving', giua: true, body: `
${term(g('gcc -O0 -no-pie', 2))}
${box('Why distributions build PIE', 'A fixed <code class="i">main</code> at <code class="i">0x400a6c</code> tells an attacker where every instruction is. With PIE, ASLR moves the program too. Debuggers switch ASLR off for you — the reason some bugs “vanish under gdb”.', 'lam')}` },

  { t: 'The stack is 8 MiB, and it has a hard edge', giua: true, body: `
${two(sql(`static long dive(void) {
    char frame[1024];      // 1 KiB per call
    memset(frame, (int)depth, sizeof frame);
    depth++;
    return dive() + frame[depth % 1024];
}`, { lang: 'c', sm: true }), term(g('ulimit -s')) + `<p style="margin:0;font-size:20px">A SIGSEGV handler on a separate emergency stack prints where it died.</p>`)}
${term(g('./rec;'))}
${term(g('(ulimit -s 2048'))}` },

  { t: 'Managed runtimes throw before the edge', giua: true, body: `
${two(sql(`let d = 0;
function f() { d++; f(); }
try { f(); }
catch (e) { console.log(e.constructor.name + ': '
  + e.message + ' after ' + d + ' calls'); }`, { lang: 'javascript', sm: true }),
    sh('$ node -e "…"\n' + g('node -e').split('\n').slice(1).join('\n'), { sm: true }))}
${sh(g('java Deep', 2))}
${box('Backend rule', 'Never recurse on user-controlled nesting (JSON, comment trees, categories) without a depth cap. In C the overflow is a SIGSEGV that kills the whole server, not one request.', 'do2')}` },

  { t: 'malloc(1 GiB) moves VSZ, not RSS', giua: true, body: `
${sh(g('./reserve 1024 100'))}
${sh(g('ps -o pid,vsz,rss,comm'))}
<p style="margin:0;font-size:21px"><b>VSZ</b> = every mapped address. <b>RSS</b> = pages in RAM. RAM arrives on <b>first touch</b>, page by page (lesson 7.3).</p>` },

  { t: 'An idle JVM: 4.8 GB of VSZ, 77 MB of RSS', giua: true, body: `
${sh(g('ps -o pid,vsz,rss,nlwp,comm'))}
${cards([
    ['Node', '485 MB VSZ — V8 reserves its heap ranges up front. 45 MB really used.'],
    ['JVM', '4.8 GB VSZ — max heap (¼ of RAM), code cache, 18 thread stacks: reserved, untouched.'],
    ['Takeaway', 'VSZ says almost nothing about memory use. Never alert on it.'],
  ])}` },

  { t: 'RSS counts shared pages in every process', giua: true, body: two(
    sql(`char *data = malloc(n);
memset(data, 7, n);    // 200 MiB in RAM
for (int i = 1; i <= k; i++)
    if ((pids[i] = fork()) == 0) {
        sleep(3);      // never writes
        _exit(0);
    }
/* then print Rss, Pss, Shared, Private
   of all 4 from /proc/PID/smaps_rollup */`, { lang: 'c' }),
    sh(g('./pss 200 3'))) },

  { t: 'Sum PSS, not RSS', body: `
${pssBars()}
${box('Where you meet this', 'Gunicorn / PHP-FPM / Puma workers, Node <code class="i">cluster</code>, PostgreSQL backends sharing <code class="i">shared_buffers</code>. Read <code class="i">Pss</code> from <code class="i">/proc/&lt;pid&gt;/smaps_rollup</code>.', 'lam')}` },

  { t: 'Which number, when', giua: true, body: vsd(
    `<ul style="font-size:26px"><li>“The JVM uses 4.8 GB!” — that is <b>VSZ</b></li><li>“4 workers use 3.2 GB on a 2 GB box!” — that is a <b>sum of RSS</b></li><li>Paging the on-call before naming the number</li></ul>`,
    `<ul style="font-size:26px"><li><b>RSS</b> for one process</li><li><b>PSS</b> when processes share memory (sum PSS)</li><li><b>VSZ</b> only to explain reservations — never to alert</li></ul>`,
    '✗ False alarms', '✓ Use') },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>Private 48-bit space: text · data/bss · heap ↑ · mmap · stack ↓</li>
<li><code class="i">maps</code> / <code class="i">pmap -x</code>: mapped ≠ resident</li>
<li>ASLR moves every region per run; <code class="i">-no-pie</code> pins the code</li>
<li>8 MiB stack: 1 KiB frames die at depth <b>7,941</b>, exit <b>139</b></li>
<li>VSZ ≫ RSS for runtimes; sum <b>PSS</b>, not RSS</li>
</ul>` },
]);
