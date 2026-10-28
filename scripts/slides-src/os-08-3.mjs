/**
 * os-08-3 — khoá "Operating Systems for Developers", bài 8.3 "The OOM killer: how it picks a victim" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c83-oom.out.txt (chạy thật) qua grab(); biểu đồ chọn nạn nhân lấy
 * số trang rss từ chính bảng dmesg. Giảng: giang/os-08-3.mjs.
 */
import { lamDeck, sh, box, cards, flow, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-08-3', code: 'OS 8.3', title: 'The OOM killer: how it picks a victim', sub: 'Operating Systems · Chapter 8' };

const g = (pre, n = 1) => grab('c83-oom', pre, n);
const tiny = (t, fs = 13) => sh(t, { sm: true }).replace('<pre>', `<pre style="font-size:${fs}px;line-height:1.38">`);
const T = (x, y, s, fs = 18, o = {}) => `<text x="${x}" y="${y}" font-size="${fs}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''} fill="${o.f || '#333'}"${o.m ? ' font-family="Menlo,monospace"' : ''}>${s}</text>`;
const R = (x, y, w, h, f, st, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${f}" stroke="${st}" stroke-width="${o.sw ?? 2}"${o.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
const BL = '#336791', GR = '#2f7d4f', RD = '#c0392b', OR = '#e08a1e';

/* CommitLimit vs Committed_AS (MiB) của lần chạy thật, từ dòng in của ./overc 64 */
const CM = (() => { const m = g('./overc 64').match(/CommitLimit (\d+) MiB · Committed_AS (\d+)/); return { lim: +m[1], used: +m[2] }; })();
const fmt = (n) => n.toLocaleString('en-US');

/* dmesg rút gọn: bỏ cột giờ cho vừa khung */
const dm = () => g('dmesg | grep -E', 1).split('\n').slice(1).map((l) => l.replace(/^\[ *[0-9.]+\] /, '')).join('\n');
/* dòng "Killed process" quá dài cho khung: xuống dòng trước total-vm (giữ nguyên chữ) */
const dmWrap = () => dm().replace(' total-vm:', '\n    total-vm:');

/* Slide 10: điểm "badness" trong memcg — rss (trang) của bảng dmesg so với giới hạn 256 MiB = 65.536 trang */
const pickSvg = () => {
  const rows = dm().split('\n').filter((l) => /\d (postgres|api)$/.test(l)).map((l) => {
    const f = l.trim().split(/ +/), e = (k) => f[f.length - k]; return { name: e(1), rss: +e(8), pt: +e(4) };
  });
  if (rows.length !== 2) throw new Error('os-08-3: cần 2 dòng bảng dmesg');
  const lim = 65536, X = 250, W = 760;
  let s = `<svg viewBox="0 0 1110 440" width="1110" height="440" font-family="Arial">`;
  s += R(X, 14, W, 44, '#f4f4f4', '#999', { dash: 1 }) + T(X + W / 2, 43, 'memory.max = 256 MiB = 65,536 pages (the denominator inside this cgroup)', 18, { a: 'middle', f: '#555' });
  rows.forEach((r, i) => {
    const y = 96 + i * 132, pts = r.rss + Math.round(r.pt / 4096), w = (pts / lim) * W, col = r.name === 'postgres' ? RD : BL;
    s += T(X - 18, y + 40, r.name, 26, { a: 'end', w: 800, f: col });
    s += R(X, y + 8, w, 54, col + '33', col) + T(X + 14, y + 43, `${r.rss.toLocaleString('en-US')} pages rss + page tables`, 19, { w: 700, f: col });
    s += T(X + w + 14, y + 43, `≈ ${Math.round((pts / lim) * 1000)} / 1000`, 22, { w: 800, f: col });
  });
  s += T(X, 380, 'Both have oom_score_adj 0: the bigger one loses — though api was the one asking.', 19, { w: 700, f: '#333' });
  s += T(X, 412, 'badness = rss + swap + page tables (+ adj × limit / 1000) — numbers from the real dmesg table', 15, { f: '#777' });
  return s + '</svg>';
};

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 8 — Memory pressure', bai: '8.3',
}, [
  { cover: true, t: 'The OOM killer:<br>how it picks a victim', sub: 'Overcommit, oom_score, and protecting your database' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Overcommit</b>: why malloc(4 TiB) succeeds on an 8 GB machine</li>
<li>The three <b>vm.overcommit_memory</b> modes — and failing early</li>
<li><b>oom_score</b> and <b>oom_score_adj</b>: read and change them</li>
<li>Watch the killer pick the <b>database</b> instead of the leaker</li>
<li>Read every field of the <b>dmesg</b> lines</li>
<li>Protect PostgreSQL the way its documentation says</li>
</ul>` },

  { t: 'malloc promises, page faults deliver', giua: true, body: `
${flow([
    { t: 'malloc / mmap', s: 'only address space', mau: BL },
    { t: 'first touch', s: 'page fault → need a frame', mau: OR },
    { t: 'no free frame', s: 'reclaim cache, swap', mau: OR },
    { t: 'still nothing', s: 'OOM killer → SIGKILL', mau: RD },
  ], { fs: 21, h: 160 })}
${box('The promise is made early, the bill arrives late', 'Linux hands out <b>address space</b> at malloc time and <b>RAM</b> one page at a time on first touch (Chapter 7). If the bill cannot be paid, there is no error code to return any more — the process is in the middle of an ordinary memory write. The only way out is to kill someone.', 'lam')}` },

  { t: 'This VM says yes to everything (mode 1)', giua: true, body: `
${sh(g('cat /proc/sys/vm/overcommit_memory') + '\n' + g('grep -E') + '\n' + g('./overc 64') + '\n' + g('./overc 4096'))}` },

  { t: 'Three overcommit modes', to: true, giua: true, body: cards([
    ['0 — heuristic (default)', 'Refuses only allocations that obviously cannot fit (bigger than RAM + swap). Ubuntu/Debian VPS default. A 64 GiB malloc on 8 GB fails here.'],
    ['1 — always', 'Never refuses. Docker Desktop’s VM uses it (above: 4 TiB "OK"). Redis recommends it so fork() for BGSAVE never fails.'],
    ['2 — strict', `Refuses once Committed_AS would pass CommitLimit = swap + ratio% × RAM. Here ${fmt(CM.lim)} MiB, with ${fmt(CM.used)} MiB already promised: <b>only ${fmt(CM.lim - CM.used)} MiB more for the whole VM.</b>`],
  ]) },

  { t: 'Fail early, or die late', giua: true, body: `
${sh(g('(ulimit -v 1048576; ./overc 2)'))}
${vsd('Overcommit: <b>malloc succeeds</b>, the program carries on, and minutes later a page fault finds no RAM — SIGKILL, exit 137, no log line, no stack trace.',
    'A hard limit (<code class="i">ulimit -v</code>, mode 2, a JVM -Xmx): <b>malloc returns NULL</b> / OutOfMemoryError at the exact line — the program can log, shed load, or exit cleanly.',
    '✗ Die late', '✓ Fail early')}
<p style="margin:0;font-size:19px">We did <b>not</b> switch this shared VM to mode 2: it is a global sysctl, and with ${Math.round(CM.used / CM.lim * 100)}% of CommitLimit already promised, every other container would soon start failing.</p>` },

  { t: 'oom_score: 0 to 1333, read it in /proc', giua: true, body: `
${sh(g('cat /proc/self/oom_score_adj') + '\n' + g('./postgres 140 &') + '\n' + g('cat /proc/$(pidof postgres)/oom_score'))}
${box('How the kernel prints it', 'oom_score = (1000 + oom_score_adj + 1000 × memory used / (RAM + swap)) × 2/3. A tiny shell: (1000 + 0 + ~0) × 2/3 = <b>666</b>. postgres holding 140 MiB of 8.7 GiB RAM + swap: (1000 + 15) × 2/3 = <b>676</b>. adj = −1000 ⇒ 0 = never chosen; +1000 ⇒ always first.', 'lam')}` },

  { t: 'The experiment: a database and a leaky API', giua: true, body: `
${sh(g('./api 200 16 q', 1) + '\n' + g('pidof postgres || echo'))}
<p style="margin:0;font-size:21px">256 MiB container, no swap. <b>postgres</b> holds 140 MiB. <b>api</b> grows to 200 MiB. api triggers the OOM — and api finishes. <b>postgres is the one killed.</b></p>` },

  { t: 'What dmesg says, field by field', giua: true, body: `
${tiny(dmWrap(), 12.6)}
${cards([
    ['invoked oom-killer', 'Who was allocating when it ran out (api) — <b>not</b> necessarily who dies.'],
    ['the task table', 'Every candidate: rss in pages, page tables, swap, oom_score_adj.'],
    ['CONSTRAINT_MEMCG', 'A cgroup limit ran out, not the whole machine. "Memory cgroup out of memory: Killed process".'],
  ])}` },

  { t: 'Why postgres: the biggest score loses', body: pickSvg() },

  { t: 'oom_score_adj −1000: now the leaker dies', giua: true, body: `
${sh(g('echo -1000 > /proc', 4))}
<p style="margin:0;font-size:20px">Lowering the score needs <code class="i">CAP_SYS_RESOURCE</code> (raising it does not). memory.events: <code class="i">oom 2 · oom_kill 2</code>.</p>` },

  { t: 'Protecting PostgreSQL for real', to: true, giua: true, body: cards([
    ['Its own cgroup', 'This project’s compose gives postgres <code class="i">limits: memory: 2G</code>: a leak in the backend container OOMs <b>its own</b> cgroup, never Postgres’s.'],
    ['−1000 for the postmaster only', 'PostgreSQL docs: OOMScoreAdjust=-1000 for the postmaster, PG_OOM_ADJUST_FILE so backends reset to 0 — a runaway query can still be killed.'],
    ['Why it matters', 'If a backend dies by SIGKILL, the postmaster restarts <b>every</b> session and runs crash recovery. If the postmaster dies, the database is down.'],
  ]) },

  { t: 'Rules of the killing order', to: true, giua: true, body: cards([
    ['Scope', 'Machine-wide OOM looks at every process; a cgroup OOM (CONSTRAINT_MEMCG) only at tasks inside that cgroup.'],
    ['Score', 'Largest rss + swap + page tables wins, shifted by oom_score_adj. Not "newest", not "the one that asked".'],
    ['Group kill', 'memory.oom.group = 1 kills the whole cgroup at once. Docker leaves it 0 (measured); Kubernetes sets 1 on cgroup v2 since 1.28.'],
  ]) },

  { t: 'Key takeaways', to: true, giua: true, body: `
<ul>
<li>malloc reserves address space; RAM is paid on first touch — overcommit</li>
<li>Mode 0 refuses the absurd, 1 refuses nothing, 2 enforces CommitLimit</li>
<li>oom_score = (1000 + adj + usage‰) × 2/3; adj −1000 = never</li>
<li>The OOM killer picks the <b>biggest</b>, not the guilty: here, postgres</li>
<li>dmesg: "invoked oom-killer" (who asked), task table, "Killed process"</li>
</ul>` },
]);
