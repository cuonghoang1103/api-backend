/**
 * pro-cs8.mjs — PRO192 ⭐ Chuyên sâu 8: ĐA LUỒNG CƠ BẢN (deck tự dựng EN, khuôn _pro-chung — dáng slide trường FU, logo CuongThai.com,
 * không logo/tên FPT). 25 slide: 1–14 luồng, trạng thái, interrupt, race condition ĐO THẬT, count++ = đọc–cộng–ghi (javap), mất cập nhật
 * ép lặp lại, synchronized, Atomic/LongAdder/CAS, volatile, deadlock; 15–25 ExecutorService, Callable/Future, invokeAll, collection
 * đồng thời, CompletableFuture ×2, luồng ảo, luồng trong Spring, singleton an toàn luồng, bẫy + phỏng vấn, tóm tắt.
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-cs8.mjs --out <dir>   ⇒ <dir>/cs8/NNN.webp
 *
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/java/cs8/*.java + *.out.txt (javac/JVM 21.0.9, --release 17; LuongAoNhanh
 * --release 21). Output đa luồng KHÔNG tất định (đếm race, HashMap dùng chung, SimpleDateFormat, cờ không volatile) KHÔNG nằm trong
 * chương trình của generator — đó là số ĐO TAY trên máy dựng bài (Mac 10 lõi, JDK 21.0.9, 27/10/2026), ghi rõ "measured" trên slide
 * (bảng DO dưới đây). Code Spring là minh hoạ KHÔNG chạy.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, sql, psql, two, three, box, steps, cards, c, vsd, esc, kw, tbl } from './_pro-chung.mjs';
import { col, PG, CAM, NAU, XANH, DO, TIM, XAM } from './pro-lab-hinh.mjs';

export const deck = { key: 'cs8', code: '⭐ CS8', title: 'Multithreading basics', sub: 'PRO192 · ⭐ Advanced' };

const GEN = '/Users/admin/Documents/FLM-nguon/_repo/PRO192/gen/java';
const doc = (f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
/** Ngắt dòng mã dài cho vừa cột (chỉ để HIỂN THỊ): ưu tiên sau "{ ", rồi ", ", " && ", ".", dấu cách; dòng nối thụt thêm 4. */
function ngat(src, max) {
  const out = [];
  for (const line of src.split('\n')) {
    let rest = line;
    const ind = line.match(/^ */)[0].length;
    while (rest.length > max) {
      const head = rest.slice(0, max);
      const tim = (re) => { let k = -1; for (const m of head.matchAll(re)) k = m.index + m[0].length; return k; };
      let cut = tim(/\{ /g);
      if (cut < ind + 14) cut = tim(/, /g);
      if (cut < ind + 14) cut = tim(/ (?=&&|\|\||\+ |-> )/g);
      if (cut < ind + 14) cut = head.lastIndexOf('.');
      if (cut < ind + 14) cut = head.lastIndexOf(' ') + 1;
      if (cut < ind + 14) break;
      out.push(rest.slice(0, cut).replace(/\s+$/, ''));
      rest = ' '.repeat(ind + 4) + rest.slice(cut).replace(/^\s+/, '');
    }
    out.push(rest);
  }
  return out.join('\n');
}
/** Vùng // [ten] … // [/ten] của gen/java/<rel>.java — bỏ nửa VI của chú thích, bỏ thụt lề chung. */
function vung(rel, ten, o = {}) {
  const l = doc(`${GEN}/${rel}.java`).split('\n');
  const a = l.findIndex((x) => x.trim() === `// [${ten}]`), b = l.findIndex((x) => x.trim() === `// [/${ten}]`);
  if (a < 0 || b < 0) throw new Error(`pro-cs8: ${rel} không có vùng ${ten}`);
  let ds = l.slice(a + 1, b).map((x) => x.replace(/\s*\|\|\|.*$/, ''));
  if (o.gon) ds = ds.map((x) => (/^\s*\/\//.test(x) ? x : x.replace(/\s+\/\/.*$/, '')));
  if (o.boCmt) ds = ds.filter((x) => !/^\s*\/\//.test(x));
  if (o.boTrong) ds = ds.filter((x) => x.trim());
  const n = Math.min(...ds.filter((x) => x.trim()).map((x) => x.match(/^ */)[0].length));
  return ds.map((x) => x.slice(n)).join('\n');
}
const ra = (rel, khoang) => {
  const l = doc(`${GEN}/${rel}.out.txt`).replace(/^\/\/ sha1 [^\n]*\n/, '').replace(/\n+$/, '').split('\n');
  return (khoang ? l.slice(khoang[0] - 1, khoang[1]) : l).join('\n');
};
/** Mã Java: w = bề rộng cột (px) ⇒ ngắt dòng; hl = mảng chuỗi con (tô mọi dòng chứa) hoặc số dòng. */
const j = (src, o = {}) => {
  const max = Math.floor(((o.w || 546) - 26) / 9.05);
  const txt = ngat(src, max);
  const hl = (o.hl || []).flatMap((h) => (typeof h === 'number' ? [h] : txt.split('\n').map((x, i) => (x.includes(h) ? i + 1 : 0)).filter(Boolean)));
  return sql(txt, { lang: 'java', sm: true, hl });
};
const P = (txt, o = {}) => psql(txt, { title: o.title || 'real output', sm: true, hl: o.hl || [] }).replace('<pre>', '<pre style="white-space:pre-wrap">');
const out = (rel, o = {}) => P(ra(rel, o.khoang), { title: o.title || `real output — ${rel.split('/').pop()}`, hl: o.hl });
const spring = (src, o = {}) => j(src, o).replace('<pre class="vs sm">', '<pre class="vs sm" style="border:2px dashed #7b9cc0">');
const nhanSpring = '<div class="cap" style="color:#336791;font-weight:700;margin-top:-6px">Spring — illustration, not run here</div>';

/** Số ĐO TAY (27/10/2026, Mac 10 lõi, JDK 21.0.9) — không tất định, nên không nằm trong chương trình của generator. */
const DO_DUA_1M = [1000068, 1010984, 1004129, 1008324, 1018989];
const DO_DUA_100K = [104533, 200000, 100000, 200000, 200000];
const DO_VOLATILE = [1120302, 1173288, 1077785];
const DO_HAI_KHOA = [1981297, 1970926, 1819864];
const so = (n) => n.toLocaleString('en-US');
/** Bảng chữ (Arial) — tbl() của khuôn là bảng dữ liệu đơn cách. */
const bang = (head, rows, fs = 16.5) => `<table class="t" style="font-size:${fs}px"><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`;

/* ───────── hình ───────── */
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 17}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'middle'}"${o.i ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const mk = (id, m) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const R = (x, y, w, h, m, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${o.nen ?? m + '14'}" stroke="${m}" stroke-width="${o.sw || 2.5}"${o.net ? ' stroke-dasharray="8 6"' : ''}/>`;
const L = (x1, y1, x2, y2, m, id, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="${o.sw || 2.6}"${o.net ? ' stroke-dasharray="8 6"' : ''} marker-end="url(#${id})"/>`;
const svg = (w, h, inner, defs = '', st = '', k = 1) => `<svg viewBox="0 0 ${w} ${h}" width="${w * k}" height="${h * k}" font-family="Arial" style="flex-shrink:0;${st}"><defs>${defs}</defs>${inner}</svg>`;

/** Slide 4: hai stack riêng + một heap chung. */
function hinhStackHeap() {
  let s = '';
  [['worker-0', 20], ['worker-1', 290]].forEach(([ten, x]) => {
    s += R(x, 20, 240, 250, PG, { nen: '#eef4fa' }) + T(x + 120, 48, `stack of ${ten}`, { b: true, m: PG, fs: 16 });
    s += R(x + 20, 66, 200, 70, PG, { nen: '#fff', sw: 1.6 }) + T(x + 120, 92, 'lambda frame', { fs: 14, m: '#555' }) + T(x + 120, 120, 'local = 100000', { mono: true, b: true, fs: 16 });
    s += T(x + 120, 170, 'own copy — no one', { fs: 14, m: XANH }) + T(x + 120, 190, 'else can see it', { fs: 14, m: XANH });
    s += L(x + 120, 205, x === 20 ? 240 : 330, 326, CAM, 'ms', { sw: 2.2 });
  });
  s += R(130, 330, 300, 80, CAM, { nen: '#fff7ef' }) + T(280, 356, 'HEAP (shared)', { b: true, m: CAM, fs: 16 }) + T(280, 388, 'Tally { total }', { mono: true, b: true, fs: 17 });
  return svg(560, 420, s, mk('ms', CAM));
}

/** Slide 6: máy trạng thái của Thread. */
function hinhTrangThai() {
  const B = { NEW: [20, 150], RUNNABLE: [230, 150], TERMINATED: [440, 150], BLOCKED: [130, 20], WAITING: [330, 20], TIMED: [230, 290] };
  let s = '';
  const hop = (k, ten, m, ghi) => { const [x, y] = B[k]; s += R(x, y, 170, 62, m, { nen: m + '18' }) + T(x + 85, y + 27, ten, { b: true, mono: true, fs: 15 }) + T(x + 85, y + 49, ghi, { fs: 12.5, m: '#555' }); };
  hop('NEW', 'NEW', XAM, 'created, not started');
  hop('RUNNABLE', 'RUNNABLE', XANH, 'running or ready');
  hop('TERMINATED', 'TERMINATED', XAM, 'run() returned');
  hop('BLOCKED', 'BLOCKED', DO, 'wants a monitor lock');
  hop('WAITING', 'WAITING', TIM, 'join() · await() · wait()');
  hop('TIMED', 'TIMED_WAITING', CAM, 'sleep(ms) · join(ms)');
  s += L(190, 181, 226, 181, '#555', 'mt') + T(208, 232, 'start()', { fs: 13, mono: true, b: true });
  s += L(400, 181, 436, 181, '#555', 'mt');
  s += L(290, 148, 230, 86, DO, 'mt', { sw: 2 }) + L(250, 86, 310, 148, DO, 'mt', { sw: 2 });
  s += L(330, 148, 390, 86, TIM, 'mt', { sw: 2 }) + L(410, 86, 350, 148, TIM, 'mt', { sw: 2 });
  s += L(300, 214, 300, 286, CAM, 'mt', { sw: 2 }) + L(330, 286, 330, 214, CAM, 'mt', { sw: 2 });
  return svg(620, 360, s, mk('mt', '#555'));
}

/** Slide 9: dòng thời gian hai luồng đọc–cộng–ghi xen kẽ. */
function hinhXenKe() {
  let s = T(150, 22, 'thread A', { b: true, mono: true, m: PG }) + T(410, 22, 'thread B', { b: true, mono: true, m: CAM }) + T(540, 22, 'count', { b: true, m: '#555' });
  const B = [[1, 'getstatic → reads 41', 0, 41], [2, 'getstatic → reads 41', 1, 41], [3, 'iadd → 42 (in its stack)', 0, 41], [4, 'iadd → 42 (in its stack)', 1, 41], [5, 'putstatic 42', 0, 42], [6, 'putstatic 42', 1, 42]];
  B.forEach(([k, chu, ai, v]) => {
    const y = 36 + (k - 1) * 46, x = ai ? 290 : 30, m = ai ? CAM : PG;
    s += R(x, y, 240, 38, m, { nen: m + '18', rx: 7, sw: 2 }) + T(x + 120, y + 25, chu, { mono: true, fs: 14 });
    s += T(540, y + 25, String(v), { mono: true, b: true, fs: 17, m: k === 6 ? DO : '#262626' });
  });
  s += R(30, 318, 540, 40, DO, { nen: '#fdf0ee', rx: 7 }) + T(300, 344, 'two increments, count went 41 → 42: one update lost', { b: true, fs: 15.5, m: DO });
  return svg(600, 366, s, '', '', 0.88);
}

/** Slide 14: vòng chờ của deadlock. */
function hinhKhoaChet() {
  let s = R(20, 30, 200, 70, PG, { nen: '#eef4fa' }) + T(120, 60, 'borrow-desk', { b: true, mono: true, fs: 16 }) + T(120, 84, 'holds B001', { fs: 14, m: '#555' });
  s += R(340, 30, 200, 70, CAM, { nen: '#fff7ef' }) + T(440, 60, 'renew-desk', { b: true, mono: true, fs: 16 }) + T(440, 84, 'holds M001', { fs: 14, m: '#555' });
  s += R(20, 200, 200, 60, XAM, { nen: '#f3f3f3' }) + T(120, 236, '🔒 lock B001', { b: true, fs: 16 });
  s += R(340, 200, 200, 60, XAM, { nen: '#f3f3f3' }) + T(440, 236, '🔒 lock M001', { b: true, fs: 16 });
  s += L(120, 196, 120, 104, XANH, 'kx', { sw: 2.4 }) + L(440, 196, 440, 104, XANH, 'kx', { sw: 2.4 });
  s += L(200, 100, 360, 198, DO, 'kd', { sw: 2.6, net: true }) + L(360, 100, 200, 198, DO, 'kd', { sw: 2.6, net: true });
  s += T(280, 300, 'green = holds · red dashed = waits for', { fs: 14, m: '#555' }) + T(280, 324, 'a cycle of waits: nobody can move', { b: true, fs: 16, m: DO });
  return svg(560, 334, s, mk('kx', XANH) + mk('kd', DO));
}

/** Slide 15: bể luồng = hàng đợi + luồng thợ. */
function hinhBe() {
  let s = T(120, 22, 'submit(job) ×6', { b: true, fs: 15, m: '#555' });
  for (let i = 0; i < 4; i++) s += R(30 + i * 52, 40, 44, 44, CAM, { nen: '#fff7ef', rx: 6, sw: 2 }) + T(52 + i * 52, 68, `J${i + 3}`, { mono: true, b: true, fs: 14 });
  s += T(130, 108, 'queue (waiting jobs)', { fs: 13.5, m: '#555' });
  s += L(242, 62, 300, 40, '#555', 'mb', { sw: 2 }) + L(242, 62, 300, 110, '#555', 'mb', { sw: 2 });
  s += R(304, 14, 230, 52, PG, { nen: '#eef4fa' }) + T(419, 46, 'pool-1-thread-1 ← J1', { mono: true, fs: 14, b: true });
  s += R(304, 84, 230, 52, PG, { nen: '#eef4fa' }) + T(419, 116, 'pool-1-thread-2 ← J2', { mono: true, fs: 14, b: true });
  s += T(280, 162, 'a thread that finishes takes the next job: reused, not recreated', { fs: 13.5, m: XANH, b: true });
  return svg(560, 172, s, mk('mb', '#555'));
}

/** Slide 19: đồ thị CompletableFuture. */
function hinhCf() {
  let s = '';
  [['book', 'supplyAsync', 20], ['member', 'supplyAsync', 92], ['days → fee', 'supplyAsync + thenApply', 164]].forEach(([t, g, y]) => {
    s += R(10, y, 210, 56, PG, { nen: '#eef4fa', rx: 8 }) + T(115, y + 25, t, { b: true, fs: 15 }) + T(115, y + 45, g, { mono: true, fs: 12, m: '#555' });
  });
  s += R(270, 50, 130, 50, TIM, { nen: '#f6f0fb', rx: 8 }) + T(335, 81, 'thenCombine', { mono: true, fs: 13.5, b: true });
  s += R(270, 150, 130, 50, TIM, { nen: '#f6f0fb', rx: 8 }) + T(335, 181, 'thenCombine', { mono: true, fs: 13.5, b: true });
  s += R(430, 150, 120, 50, XANH, { nen: '#f1f9f4', rx: 8 }) + T(490, 181, 'join()', { mono: true, fs: 15, b: true });
  s += L(222, 48, 268, 70, '#555', 'mc', { sw: 1.8 }) + L(222, 120, 268, 82, '#555', 'mc', { sw: 1.8 }) + L(335, 102, 335, 148, '#555', 'mc', { sw: 1.8 }) + L(222, 192, 268, 180, '#555', 'mc', { sw: 1.8 }) + L(402, 175, 428, 175, '#555', 'mc', { sw: 1.8 });
  s += T(280, 238, '3 × 300 ms run at the same time ⇒ ~300 ms, not 900', { fs: 14, b: true, m: XANH });
  return svg(560, 248, s, mk('mc', '#555'));
}

/** Slide 22: luồng request của Tomcat dùng chung một bean. */
function hinhTomcat() {
  let s = '';
  ['http-nio-8080-exec-1', 'http-nio-8080-exec-2', 'http-nio-8080-exec-3'].forEach((t, i) => {
    s += R(10, 14 + i * 64, 250, 48, PG, { nen: '#eef4fa', rx: 8 }) + T(135, 44 + i * 64, t, { mono: true, fs: 13.5, b: true });
    s += L(262, 38 + i * 64, 330, 104, '#555', 'mq', { sw: 1.8 });
  });
  s += R(334, 70, 210, 70, CAM, { nen: '#fff7ef' }) + T(439, 100, 'LoanService', { mono: true, b: true, fs: 16 }) + T(439, 124, 'ONE singleton bean', { fs: 13.5, m: '#555' });
  s += T(280, 222, 'every request thread runs the same object at the same time', { fs: 14, b: true, m: DO });
  return svg(560, 232, s, mk('mq', '#555'), '', 0.8);
}

export const slides = lamDeck({ chuong: '⭐ CS.8 · Multithreading basics', bai: '' }, [
  /* 1 */
  { cover: true, nhan: '⭐ Advanced 8 · not on the PRO192 syllabus', t: 'Multithreading basics<br>— races you can measure', sub: 'Thread, states and interrupt · a real race on count++ · synchronized, Atomic, volatile · deadlock · ExecutorService and Future · CompletableFuture · threads inside Spring Boot' },

  /* 2 */
  { t: 'Where threads already met you', body: `<table class="t" style="font-size:18px"><tr><th>You saw</th><th>Where</th><th>This deck</th></tr>
<tr><td>${c('count++')} is not atomic, ${c('start()')} vs ${c('run()')}</td><td>⭐ CS.6 — interview Q37–40</td><td>measure the race, see why, fix it 3 ways (8–12)</td></tr>
<tr><td>virtual threads, 10,000 waiting jobs</td><td>⭐ CS.3</td><td>the executor API they plug into (15–21)</td></tr>
<tr><td>the lazy singleton creates 2 objects</td><td>⭐ CS.7</td><td>three thread-safe fixes (23)</td></tr>
<tr><td>Spring beans are shared singletons</td><td>⭐ CS.7 — slide 20</td><td>request threads, ThreadLocal (22)</td></tr></table>
${two(box('Exam room PE (JDK 8)', `<p style="margin:0">Threads are <b>not</b> in the PRO192 PE. ${c('Thread')}, ${c('synchronized')}, ${c('ExecutorService')}, ${c('AtomicInteger')} and ${c('CompletableFuture')} all exist in Java 8; virtual threads need Java 21.</p>`, 'lam'),
    box('Why it matters', `<p style="margin:0">A Spring Boot server runs every request on its own thread — up to <b>200</b> at once by default (Tomcat). Shared data + threads = the bugs of this deck.</p>`, 'do2'))}` },

  /* 3 */
  { t: 'Why threads: waiting in parallel', body: `<div class="hai">${col(j(vung('cs8/TuanTuSongSong', 'tra', { gon: true })), j(vung('cs8/TuanTuSongSong', 'song-song', { gon: true }), { hl: ['start()', 't.join()'] }))}
${col(out('cs8/TuanTuSongSong', { hl: [7, 8] }), `<table class="t" style="font-size:17px"><tr><th></th><th>meaning</th></tr><tr><td><b>concurrency</b></td><td>several tasks <b>in progress</b> at once (they may take turns on one core)</td></tr><tr><td><b>parallelism</b></td><td>several tasks <b>executing</b> at the same instant, on several cores</td></tr></table>`,
    box('', `<p style="margin:0">Waiting (database, HTTP, disk) is where threads pay off first: three 300 ms waits overlap into ~300 ms.</p>`, 'ok'))}</div>` },

  /* 4 */
  { t: 'One process, many threads, one heap', body: `<div class="hai" style="grid-template-columns:1fr 560px">${col(j(vung('cs8/NganXepRieng', 'chay', { gon: true }), { w: 540, hl: ['int local = 0', 'shared.total++'] }), out('cs8/NganXepRieng'))}
${col(hinhStackHeap(), box('', `<p style="margin:0">Locals live on <b>each thread’s own stack</b> — always safe. Objects (and static fields) live on the <b>one heap</b> — shared, so every write needs a rule.</p>`, 'lam'))}</div>` },

  /* 5 */
  { t: 'Three ways to start a thread — and run()', body: `<div class="hai">${col(j(vung('cs8/TaoLuong', 'cach1', { gon: true }) + '\n' + vung('cs8/TaoLuong', 'cach2', { gon: true })), out('cs8/TaoLuong', { hl: [4, 6] }))}
${col(j(vung('cs8/TaoLuong', 'chay', { gon: true }), { hl: ['d.run()', 'a.start()'] }))}</div>` },

  /* 6 */
  { t: 'Thread states, watched live', body: `<div class="hai" style="grid-template-columns:1fr 620px">${col(j(vung('cs8/TrangThai', 'chay', { gon: true, boCmt: true }).split('\n').slice(0, 11).join('\n') + '\n…', { w: 470, hl: ['sleep(300)', 'go.await()', 'synchronized (LOCK) { }'] }), out('cs8/TrangThai'))}
${col(hinhTrangThai(), box('', `<p style="margin:0">${c('getState()')} is a snapshot. ${c('RUNNABLE')} covers "running" <b>and</b> "ready, waiting for a core" — Java does not tell them apart.</p>`, 'lam'))}</div>` },

  /* 7 */
  { t: 'interrupt(): a polite request to stop', body: `<div class="hai">${col(j(vung('cs8/NgatLuong', 'ngu', { gon: true }), { hl: ['catch (InterruptedException', 'interrupt();'] }), j(vung('cs8/NgatLuong', 'ban', { gon: true }), { hl: ['isInterrupted()'] }))}
${col(out('cs8/NgatLuong', { hl: [1, 2] }), box('Two rules', `<p style="margin:0">1. A blocked thread (${c('sleep')}, ${c('wait')}, ${c('join')}) wakes with ${c('InterruptedException')} and the flag is <b>cleared</b> — restore it or stop. 2. A busy thread must <b>check</b> ${c('isInterrupted()')} itself.</p>`, 'ok'),
    box('Never', `<p style="margin:0">${c('Thread.stop()')} — deprecated since Java 1.2 (it could leave objects half-updated) and it throws ${c('UnsupportedOperationException')} since Java 20.</p>`, 'do2'))}</div>` },

  /* 8 */
  { t: 'A race condition, measured: count++', body: `<div class="hai">${col(j(vung('cs8/DuaDem', 'dem', { gon: true }), { hl: ['count++'] }), out('cs8/DuaDem'),
    box('Read the measured table', `<p style="margin:0">Never 2,000,000 with 2 threads × 1,000,000. With 100,000 some runs are <b>exact</b> — the first thread finished before the second started: the bug <b>hides</b>.</p>`, 'do2'))}
${col(tbl(['run', '2 × 1,000,000', '2 × 100,000'], DO_DUA_1M.map((v, i) => [String(i + 1), so(v), so(DO_DUA_100K[i])]), { cap: 'measured by hand — 10-core Mac, JDK 21.0.9 (changes every run)', hl: [] }),
    box('Expected', `<p style="margin:0"><b>2,000,000</b> and <b>200,000</b>. About half of the 2 million updates vanished — both cores were adding at the same time.</p>`, 'lam'))}</div>` },

  /* 9 */
  { t: 'Why: count++ is read, add, write', body: `<div class="hai" style="grid-template-columns:1fr 528px">${col(j(vung('cs8/DocCongGhi', 'phien', { gon: true }).split('\n').slice(0, 5).join('\n'), { w: 560 }), psql(ra('cs8/DocCongGhi'), { title: 'real console — javap -c (JDK 21)', sm: true, hl: [4, 6, 7] }))}
${col(hinhXenKe(), box('', `<p style="margin:0">Each thread copies ${c('count')} into its own stack, adds there, writes back. A write based on a <b>stale read</b> erases the other thread’s update.</p>`, 'lam'))}</div>` },

  /* 10 */
  { t: 'A lost update, made repeatable', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr">${col(j(vung('cs8/MatCapNhatChac', 'chay', { gon: true, boTrong: true }).split('\n').slice(3, 13).join('\n'), { w: 580, hl: ['int value = count', 'await(bothHaveRead)', 'count = value + 1'] }),
    out('cs8/MatCapNhatChac'))}
${col(box('What the barrier does', `<p style="margin:0">A ${c('CyclicBarrier(2)')} holds each thread right after its <b>read</b> until the other has read too — the bad interleaving of slide 9, <b>every</b> run. In production nothing forces it; it just happens sometimes.</p>`, 'lam'),
    box('The general shape', `<p style="margin:0"><b>check-then-act</b> (${c('if (x == null) x = …')}) and <b>read-modify-write</b> (${c('x++')}, ${c('balance -= fee')}) on shared data are races unless one thread at a time does the whole step.</p>`, 'do2'))}</div>` },

  /* 11 */
  { t: 'Fix 1: synchronized — one thread at a time', body: `<div class="hai">${col(j(vung('cs8/SuaSynchronized', 'dem', { gon: true }), { hl: ['synchronized void inc', 'synchronized (lock)'] }), out('cs8/SuaSynchronized'))}
${col(box('What it guarantees', `<p style="margin:0"><b>Mutual exclusion</b>: one thread inside per lock object. <b>Visibility</b>: what a thread wrote before leaving is seen by the next one that enters (happens-before).</p>`, 'ok'),
    tbl(['measured', 'two DIFFERENT locks'], DO_HAI_KHOA.map((v, i) => [`run ${i + 1}`, so(v)]), { cap: 'trap — each thread locks its own object (by hand)' }),
    box('', `<p style="margin:0">Every read and write of the shared field must use the <b>same</b> lock. Locking a different object protects nothing.</p>`, 'do2'))}</div>` },

  /* 12 */
  { t: 'Fix 2: AtomicInteger, LongAdder, CAS', body: `<div class="hai">${col(j(vung('cs8/SuaAtomic', 'chay', { gon: true })), j(vung('cs8/SuaAtomic', 'cas', { gon: true, boCmt: true }).split('\n').filter((x) => !/System\.out|CAS\(5|stock = " \+|again: "/.test(x)).join('\n'), { hl: ['compareAndSet'] }))}
${col(out('cs8/SuaAtomic', { hl: [2] }), bang(['tool', 'when'], [[c('synchronized'), 'several fields change together'], [c('AtomicInteger'), 'one counter / one value'], [c('LongAdder'), 'a hot counter many threads add to']]),
    tbl(['measured', 'volatile int count++'], DO_VOLATILE.map((v, i) => [`run ${i + 1}`, so(v)]), { cap: 'volatile is NOT atomic (by hand)' }))}</div>` },

  /* 13 */
  { t: 'Visibility: a stop flag needs volatile', body: `<div class="hai">${col(j(vung('cs8/CoDung', 'co', { gon: true }) + '\n' + vung('cs8/CoDung', 'chay', { gon: true }), { hl: ['volatile boolean stop', 'while (!stop)', 'stop = true'] }), out('cs8/CoDung'))}
${col(vsd(`<p style="margin:0">${c('static boolean stop')}<br>measured 3 runs out of 3:<br><b>still running 2 s</b> after ${c('stop = true')}</p>`, `<p style="margin:0">${c('static volatile boolean stop')}<br>the real run:<br><b>stopped</b> within 2 s</p>`, '✗ plain field', '✓ volatile'),
    box('Why', `<p style="margin:0">Without a rule that links the two threads, the JIT may read ${c('stop')} <b>once</b> and loop forever. ${c('volatile')} makes every read see the latest write — but it does not make ${c('count++')} atomic.</p>`, 'lam'))}</div>` },

  /* 14 */
  { t: 'Deadlock: two locks, opposite order', body: `<div class="hai" style="grid-template-columns:1fr 560px">${col(j(vung('cs8/KhoaChet', 'chet', { gon: true }).split('\n').slice(0, 13).join('\n'), { w: 540, hl: ['synchronized (BOOK_B001)', 'synchronized (MEMBER_M001)'] }), out('cs8/KhoaChet', { hl: [2, 3] }))}
${col(hinhKhoaChet(), box('Fix', `<p style="margin:0">Take locks in <b>one global order</b> (book, then member) — no cycle can form. Or ${c('tryLock(timeout)')} with ${c('ReentrantLock')}. ${c('jstack <pid>')} prints "Found one Java-level deadlock".</p>`, 'ok'))}</div>` },

  /* 15 */
  { t: 'Thread pools: ExecutorService', body: `<div class="hai">${col(j(vung('cs8/BeLuong', 'chay', { gon: true }), { hl: ['newFixedThreadPool(2)', 'pool.shutdown()', 'awaitTermination'] }))}
${col(hinhBe(), out('cs8/BeLuong'), box('Why a pool', `<p style="margin:0">A platform thread is an OS thread with its own stack: creating one per job is slow and unbounded. A pool <b>reuses</b> N threads and <b>queues</b> the rest — and must be <b>shut down</b> (slide 24).</p>`, 'lam'))}</div>` },

  /* 16 */
  { t: 'Callable and Future: results and errors', body: `<div class="hai">${col(j(vung('cs8/TuongLai', 'ket-qua', { gon: true }), { hl: ['fee.get()'] }), j(vung('cs8/TuongLai', 'loi', { gon: true }), { hl: ['ExecutionException'] }), j('slow.get(200, TimeUnit.MILLISECONDS);   // TimeoutException\nslow.cancel(true);', { hl: ['get(200'] }))}
${col(out('cs8/TuongLai', { hl: [2, 3] }), bang(['', 'Runnable', 'Callable&lt;T&gt;'], [['returns', 'nothing', 'a value'], ['may throw checked', 'no', 'yes'], ['submit(…) gives', c('Future<?>'), c('Future<T>')]]),
    box('', `<p style="margin:0">${c('get()')} <b>blocks</b>. An exception inside the job comes back wrapped in ${c('ExecutionException')} — read ${c('getCause()')}. Never wait without a limit on a remote call.</p>`, 'ok'))}</div>` },

  /* 17 */
  { t: 'Split the work: invokeAll', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr">${j(vung('cs8/ChiaViec', 'chay', { gon: true }), { w: 590, hl: ['long from', 'invokeAll'] })}
${col(out('cs8/ChiaViec'), box('Safe by design', `<p style="margin:0">Each part works on <b>its own range</b> and its own local ${c('s')} — no shared write, no lock. The only shared step, adding four results, happens in ${c('main')} after ${c('invokeAll')} returned.</p>`, 'ok'),
    box('', `<p style="margin:0">Divide · compute in parallel · combine: the idea behind ${c('parallelStream()')} and the Fork/Join pool (⭐ CS.2).</p>`, 'lam'))}</div>` },

  /* 18 */
  { t: 'Collections shared between threads', body: `<div class="hai">${col(j(vung('cs8/MapDongThoi', 'chay', { gon: true }).split('\n').slice(0, 14).join('\n'), { hl: ['merge(id, 1, Integer::sum)', 'synchronizedList'] }), out('cs8/MapDongThoi', { hl: [1] }))}
${col(tbl(['measured, same job', 'HashMap sum', 'ArrayList size'], [['run 1', '74,901', '58,962'], ['run 2', '61,171', '71,279'], ['run 3', '62,794', '63,979']], { cap: 'plain collections, 4 threads (by hand) — expected 120,000' }),
    bang(['need', 'use'], [['a shared map', c('ConcurrentHashMap') + ' + ' + c('merge')], ['a shared list, many writes', c('Collections.synchronizedList')], ['listeners: rare writes, many reads', c('CopyOnWriteArrayList')], ['producer → consumer', c('BlockingQueue')]]))}</div>` },

  /* 19 */
  { t: 'CompletableFuture: three calls at once', body: `<div class="hai">${col(j(vung('cs8/TuongLaiHoanTat', 'chay', { gon: true }).split('\n').slice(1, 9).join('\n'), { hl: ['supplyAsync', 'thenCombine'] }), out('cs8/TuongLaiHoanTat'))}
${col(hinhCf(), box('', `<p style="margin:0">Describe <b>what depends on what</b>; the library runs each step when its inputs are ready. ${c('supplyAsync')} uses the common ForkJoin pool (cores − 1 threads) unless you pass an executor.</p>`, 'lam'))}</div>` },

  /* 20 */
  { t: 'CompletableFuture: errors, allOf, thenCompose', body: `<div class="hai">${col(j(vung('cs8/TuongLaiLoi', 'loi', { gon: true }), { hl: ['exceptionally', 'handle'] }))}
${col(out('cs8/TuongLaiLoi', { hl: [1, 2] }), bang(['method', 'use it to'], [[c('thenApply'), 'transform a result'], [c('thenCompose'), 'start a call that needs the result'], [c('thenCombine'), 'join two independent results'], [c('allOf'), 'wait for many'], [c('exceptionally / handle'), 'fall back or translate an error']]))}</div>` },

  /* 21 */
  { t: 'The same API on virtual threads (Java 21)', body: `<div class="hai">${col(j(vung('cs8/LuongAoNhanh', 'chay', { gon: true }), { hl: ['newVirtualThreadPerTaskExecutor'] }), out('cs8/LuongAoNhanh'))}
${col(box('Only the factory changes', `<p style="margin:0">${c('Callable')}, ${c('Future')}, ${c('invokeAll')} are the same. One <b>virtual</b> thread per job, mounted on a few carrier threads, unmounted while waiting. Details and the 10,000-job measurement: ⭐ CS.3.</p>`, 'lam'),
    bang(['', 'platform pool', 'virtual'], [['threads', 'N, reused', 'one per job, never pooled'], ['good for', 'CPU work', 'many waiting jobs'], ['Spring Boot 3.2+', '—', c('spring.threads.virtual.enabled=true')]]))}</div>` },

  /* 22 */
  { t: 'Threads inside Spring Boot', body: `<div class="hai">${col(hinhTomcat(), j(vung('cs8/BeanDaLuong', 'lop', { gon: true }).split('\n').slice(0, 7).join('\n').replace(/\(String memberId, String itemId,\s*CyclicBarrier pause\)/, '(String memberId, String itemId, …)'), { w: 560, hl: ['private String member'] }), out('cs8/BeanDaLuong', { hl: [1] }))}
${col(bang(['in Spring', 'thread rule'], [[c('@Service') + ' (singleton)', 'shared by all request threads — only final dependencies'], ['request data', 'parameters, locals, request scope'], [c('SecurityContextHolder'), 'a ' + c('ThreadLocal') + ' per request thread'], [c('@Transactional'), 'bound to the current thread'], [c('@Async'), 'runs on another executor thread']]),
    box('ThreadLocal', `<p style="margin:0">One copy <b>per thread</b> — correct here. Pool threads are reused, so always ${c('remove()')} in ${c('finally')}, or the next request sees old data.</p>`, 'ok'))}</div>` },

  /* 23 */
  { t: 'The CS.7 singleton, made thread-safe', body: `<div class="hai" style="grid-template-columns:1.12fr 1fr">${j(vung('cs8/SingletonAnToan', 'ba-cach', { gon: true, boCmt: true }).split('\n').filter((x) => !/static final AtomicInteger made|made\.incrementAndGet/.test(x)).join('\n').replace(/static class HolderConfig[\s\S]*$/, '// HolderConfig: the holder idiom of CS.7'), { w: 600, hl: ['static synchronized', 'volatile DclConfig'] })}
${col(out('cs8/SingletonAnToan', { hl: [1] }), bang(['way', 'cost'], [['synchronized get()', 'a lock on every call'], ['double-checked + volatile', 'lock only on creation; volatile is required'], ['holder / enum', 'none — the JVM’s class-init lock']]),
    box('', `<p style="margin:0">Without ${c('volatile')}, double-checked locking can hand out a <b>half-built</b> object (the write of the reference may be seen before the constructor’s writes).</p>`, 'do2'))}</div>` },

  /* 24 */
  { t: 'Traps and interview questions', body: `<div class="hai">${col(out('cs8/BayHayGap', { title: 'real output — BayHayGap', hl: [2, 3] }),
    bang(['trap', 'measured / fix'], [[c('t.run()'), 'no new thread — use start()'], ['pool without shutdown', 'JVM never exits — shutdown()'], ['swallowed interrupt', 'cannot be stopped — restore the flag'], ['shared ' + c('SimpleDateFormat'), '4 threads: ~15,000 wrong dates (by hand) — use DateTimeFormatter'], [c('parallelStream') + ' for I/O', 'common pool starved — an executor']]))}
${col(steps([
  '<b>Process vs thread?</b> Own memory vs shared heap, own stack.',
  '<b>Why is count++ unsafe?</b> Read-add-write; a stale write erases an update.',
  '<b>synchronized vs volatile?</b> Exclusion + visibility vs visibility only.',
  '<b>How do you avoid deadlock?</b> One lock order; tryLock with a timeout.',
  '<b>Runnable vs Callable?</b> Callable returns a value and may throw.',
  '<b>Is a Spring singleton thread-safe?</b> Only if stateless.',
]))}</div>` },

  /* 25 */
  { t: 'Summary: threads without fear', to: true, body: `${cards([
    ['🧵 Threads', `${c('start()')} not ${c('run()')} · states · ${c('join')} · ${c('interrupt')} is a request`],
    ['⚔️ Races', 'shared + mutable + no rule = lost updates (measured ~50%)'],
    ['🔒 Fixes', `${c('synchronized')} (one lock) · ${c('AtomicInteger')}/${c('LongAdder')} · ${c('volatile')} for flags`],
    ['☠️ Deadlock', 'two locks, opposite order — one global order'],
    ['🏊 Executors', `pool + queue · ${c('Callable')}/${c('Future')} · always ${c('shutdown()')}`],
    ['🔗 CompletableFuture', `${c('supplyAsync')} · ${c('thenCombine')} · ${c('exceptionally')} · ${c('allOf')}`],
  ], 3)}
${box('Best rule of all', `<p style="margin:0"><b>Do not share mutable state.</b> Locals, immutable objects (⭐ CS.4), one owner per object, stateless beans — then most locks become unnecessary.</p>`, 'ok')}`, giua: true },
]);
