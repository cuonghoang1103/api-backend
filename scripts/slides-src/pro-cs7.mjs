/**
 * pro-cs7.mjs — PRO192 ⭐ Chuyên sâu 7: SOLID + DESIGN PATTERNS (deck tự dựng EN, khuôn _pro-chung — dáng slide trường FU, logo CuongThai.com,
 * không logo/tên FPT). 26 slide: 1–12 SOLID trên CT Library (god class, S, O, L ×2, I, D, SOLID trong Spring, khi nào KHÔNG, mùi code + phỏng vấn),
 * 13–26 sáu mẫu GoF (Strategy ×2, Factory ×2, Singleton ×3, Builder, Observer ×2, Template Method ×2, chọn mẫu + phỏng vấn).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pro-cs7.mjs --out <dir>   ⇒ <dir>/cs7/NNN.webp
 *
 * Code + output ĐỌC THẲNG từ flm-nguon/_repo/PRO192/gen/java/cs7/*.java (vùng // [ten] … // [/ten]) và *.out.txt (chạy thật
 * javac/JVM 21.0.9, --release 17; FactoryJdk --release 21) — không gõ tay output. Code Spring (slide 10, 15, 20, 23, 25) là
 * code minh hoạ KHÔNG chạy (đánh dấu "Spring — not run here").
 * Nguồn: Gamma, Helm, Johnson, Vlissides, Design Patterns (1994, 23 mẫu: 5 creational · 7 structural · 11 behavioral);
 * R. C. Martin, Clean Architecture (2017) — SRP "responsible to one, and only one, actor"; B. Meyer, Object-Oriented Software
 * Construction (1988) — OCP; B. Liskov, OOPSLA 1987 keynote "Data Abstraction and Hierarchy" + Liskov & Wing 1994; Spring Framework
 * reference "Bean Scopes — The Singleton Scope" ("per-container and per-bean"), "Standard and Custom Events" (đồng bộ mặc định).
 */
import { readFileSync } from 'node:fs';
import { lamDeck, sql, psql, two, three, box, steps, cards, c, vsd, esc, kw } from './_pro-chung.mjs';
import { col, PG, CAM, NAU, XANH, DO, TIM, XAM } from './pro-lab-hinh.mjs';

export const deck = { key: 'cs7', code: '⭐ CS7', title: 'SOLID and design patterns', sub: 'PRO192 · ⭐ Advanced' };

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
  if (a < 0 || b < 0) throw new Error(`pro-cs7: ${rel} không có vùng ${ten}`);
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

/* ───────── hình ───────── */
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 17}" ${o.b ? 'font-weight="700"' : ''} fill="${o.m || '#262626'}" ${o.mono ? 'font-family="Menlo,monospace"' : ''} text-anchor="${o.a || 'middle'}"${o.i ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const mk = (id, m) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`;
const R = (x, y, w, h, m, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${o.nen ?? m + '14'}" stroke="${m}" stroke-width="${o.sw || 2.5}"${o.net ? ' stroke-dasharray="8 6"' : ''}/>`;
const L = (x1, y1, x2, y2, m, id, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m}" stroke-width="${o.sw || 2.6}"${o.net ? ' stroke-dasharray="8 6"' : ''} marker-end="url(#${id})"/>`;

/** Slide 3: bốn "người ra lệnh" (actor) cùng chĩa vào MỘT lớp. */
function hinhGod() {
  const W = 540, H = 330;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('gd', DO)}</defs>`;
  const A = [['👩‍💼 librarian', 'borrow rules', 40], ['💰 treasurer', 'fee rules', 120], ['🧾 front desk', 'receipt layout', 200], ['🛠️ developer', 'file format', 280]];
  A.forEach(([ai, viec, y]) => {
    s += R(6, y - 30, 210, 66, CAM, { nen: '#fff7ef' }) + T(111, y - 4, ai, { b: true, fs: 18 }) + T(111, y + 22, `changes ${viec}`, { fs: 15, m: '#555' });
    s += L(218, y + 3, 318, 165, DO, 'gd', { sw: 2.2 });
  });
  s += R(322, 40, 210, 200, DO, { nen: '#fdf0ee', sw: 3.5 }) + T(427, 78, 'LibraryManager', { b: true, mono: true, fs: 18 });
  ['borrow()', 'fee()', 'returnBook()', 'saveLine()'].forEach((m, i) => { s += T(427, 116 + i * 30, m, { mono: true, fs: 16 }); });
  s += T(427, 272, '4 reasons to change', { b: true, m: DO, fs: 18 }) + T(427, 298, '= 4 people editing one file', { fs: 15, m: '#555' });
  return s + '</svg>';
}

/** Slide 4: sau khi tách — mỗi lớp một actor. */
function hinhSrp() {
  const W = 1110, H = 128;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('sr', XANH)}</defs>`;
  const B = [['👩‍💼', 'LoanService', 'borrow rules'], ['💰', 'FeeCalculator', 'fee rules'], ['🧾', 'ReceiptPrinter', 'receipt layout'], ['🛠️', 'LoanRepository', 'storage format']];
  B.forEach(([ai, lop, viec], i) => {
    const x = 8 + i * 276;
    s += T(x + 128, 28, ai, { fs: 26 }) + L(x + 128, 36, x + 128, 50, XANH, 'sr', { sw: 2 });
    s += R(x, 54, 256, 70, XANH, { nen: '#f1f9f4' }) + T(x + 128, 84, lop, { b: true, mono: true, fs: 18 }) + T(x + 128, 110, `only: ${viec}`, { fs: 15, m: '#555' });
  });
  return s + '</svg>';
}

/** Slide 9: DIP — trước / sau. */
function hinhDip() {
  const W = 1110, H = 300;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W * 0.78}" height="${H * 0.78}" style="align-self:center;flex-shrink:0" font-family="Arial"><defs>${mk('dd', DO)}${mk('dx', XANH)}
  <marker id="dk" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13" markerHeight="13" orient="auto"><path d="M0,0 L12,6 L0,12 z" fill="#fff" stroke="${XANH}" stroke-width="1.6"/></marker></defs>`;
  // trước
  s += T(260, 24, '✗ BEFORE — high level depends on a detail', { b: true, m: DO, fs: 18 });
  s += R(130, 44, 260, 64, PG, { nen: '#eef4fa' }) + T(260, 72, 'LoanService', { b: true, mono: true, fs: 19 }) + T(260, 96, 'high level: the rules', { fs: 14, m: '#555' });
  s += L(260, 110, 260, 186, DO, 'dd') + T(272, 154, 'new FileLoanRepository()', { a: 'start', mono: true, fs: 14, m: DO });
  s += R(130, 190, 260, 64, XAM, { nen: '#f3f3f3' }) + T(260, 218, 'FileLoanRepository', { b: true, mono: true, fs: 18 }) + T(260, 242, 'low level: CSV on disk', { fs: 14, m: '#555' });
  s += T(260, 284, 'test = needs a real file', { fs: 15, m: DO, b: true });
  // sau
  s += T(830, 24, '✓ AFTER — both depend on an abstraction', { b: true, m: XANH, fs: 18 });
  s += R(620, 44, 250, 64, PG, { nen: '#eef4fa' }) + T(745, 72, 'LoanService', { b: true, mono: true, fs: 19 }) + T(745, 96, 'owns the interface ↓', { fs: 14, m: '#555' });
  s += R(890, 44, 210, 64, XANH, { nen: '#f1f9f4', net: true }) + T(995, 68, '«interface»', { fs: 13, m: XANH }) + T(995, 92, 'ILoanRepository', { b: true, mono: true, fs: 16 });
  s += L(872, 76, 886, 76, XANH, 'dx');
  s += R(620, 190, 220, 64, XAM, { nen: '#f3f3f3' }) + T(730, 218, 'InMemoryLoan…', { b: true, mono: true, fs: 16 }) + T(730, 242, 'for tests', { fs: 14, m: '#555' });
  s += R(880, 190, 220, 64, XAM, { nen: '#f3f3f3' }) + T(990, 218, 'CsvLoanRepository', { b: true, mono: true, fs: 15 }) + T(990, 242, 'for real', { fs: 14, m: '#555' });
  s += `<line x1="730" y1="188" x2="975" y2="112" stroke="${XANH}" stroke-width="2.4" stroke-dasharray="8 6" marker-end="url(#dk)"/>`;
  s += `<line x1="990" y1="188" x2="995" y2="112" stroke="${XANH}" stroke-width="2.4" stroke-dasharray="8 6" marker-end="url(#dk)"/>`;
  s += T(860, 284, 'the arrow from the detail now points UP: inverted', { fs: 15, m: XANH, b: true });
  s += `<line x1="555" y1="20" x2="555" y2="290" stroke="#ccc" stroke-width="2"/>`;
  return s + '</svg>';
}

/** Slide 13: bản đồ 23 mẫu GoF — 3 nhóm, tô 6 mẫu của deck + 3 đã gặp. */
function hinhGof() {
  const W = 1110, H = 330;
  const G = [
    ['Creational — how objects are made', '5', CAM, [['Factory Method', 'n'], ['Abstract Factory', ''], ['Builder', 'n'], ['Prototype', ''], ['Singleton', 'n']]],
    ['Structural — how objects are combined', '7', PG, [['Adapter', ''], ['Bridge', ''], ['Composite', ''], ['Decorator', 'g'], ['Facade', ''], ['Flyweight', ''], ['Proxy', 'g']]],
    ['Behavioral — how objects talk', '11', TIM, [['Strategy', 'n'], ['Observer', 'n'], ['Template Method', 'n'], ['Iterator', 'g'], ['Command', ''], ['State', ''], ['Chain of Resp.', ''], ['Mediator', ''], ['Memento', ''], ['Visitor', ''], ['Interpreter', '']]],
  ];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  G.forEach(([ten, so, m, ds], gi) => {
    const x = gi * 372;
    s += R(x + 2, 4, 362, H - 8, m, { nen: m + '0d' }) + T(x + 183, 30, ten, { b: true, fs: 16, m }) + T(x + 183, 52, `${so} patterns`, { fs: 14, m: '#666' });
    ds.forEach(([p, k], i) => {
      const cot = gi === 2 ? i % 2 : 0, hang = gi === 2 ? Math.floor(i / 2) : i;
      const bx = gi === 2 ? x + 12 + cot * 172 : x + 40, bw = gi === 2 ? 166 : 282, by = 64 + hang * (gi === 2 ? 42 : 36);
      const nen = k === 'n' ? m : k === 'g' ? '#fff' : '#fff';
      s += R(bx, by, bw, gi === 2 ? 36 : 31, k ? m : '#c9c9c9', { nen: k === 'n' ? m : '#fff', sw: k === 'g' ? 2.6 : 1.5, rx: 6, net: k === 'g' });
      s += T(bx + bw / 2, by + (gi === 2 ? 24 : 21), p + (k === 'g' ? ' ✓' : ''), { fs: 15, b: !!k, m: k === 'n' ? '#fff' : k === 'g' ? m : '#777' });
      void nen;
    });
  });
  return s + '</svg>';
}

/** Slide 19: dòng thời gian hai luồng gọi getInstance() cùng lúc. */
function hinhDuaSingleton() {
  const W = 560, H = 330;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('ds', '#888')}</defs>`;
  s += T(140, 24, 'request-1', { b: true, mono: true, m: PG, fs: 17 }) + T(420, 24, 'request-2', { b: true, mono: true, m: CAM, fs: 17 });
  s += L(30, 40, 30, 318, '#888', 'ds', { sw: 1.8 }) + T(30, 330, 'time', { fs: 13, m: '#888' }).replace('y="330"', 'y="20"');
  const B = [[1, 62, 'instance == null ? yes', PG], [2, 112, 'instance == null ? yes', CAM], [1, 172, 'instance = new …  (#1)', PG], [2, 222, 'instance = new …  (#2)', CAM]];
  B.forEach(([k, y, chu, m]) => { const x = k === 1 ? 50 : 300; s += R(x, y, 240, 40, m, { nen: m + '18', rx: 7, sw: 2 }) + T(x + 120, y + 26, chu, { mono: true, fs: 14.5 }); });
  s += R(50, 276, 490, 40, DO, { nen: '#fdf0ee', rx: 7 }) + T(295, 302, 'two objects — and the second overwrote the first', { b: true, fs: 15.5, m: DO });
  return s + '</svg>';
}

/** Slide 22: Observer — chủ thể và các listener. */
function hinhObserver() {
  const W = 540, H = 300;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>${mk('ob', TIM)}</defs>`;
  s += R(10, 110, 170, 80, PG, { nen: '#eef4fa' }) + T(95, 142, 'LoanDesk', { b: true, mono: true, fs: 18 }) + T(95, 168, 'giveBack(…)', { mono: true, fs: 14 });
  const ds = [['[log]', 40], ['[email]', 125], ['WaitList', 210]];
  ds.forEach(([t, y]) => { s += L(182, 150, 330, y + 25, TIM, 'ob', { sw: 2.2 }) + R(334, y, 196, 50, TIM, { nen: '#f6f0fb', rx: 8 }) + T(432, y + 32, t, { b: true, mono: true, fs: 16 }); });
  s += T(250, 290, 'ReturnedEvent(memberId, itemId) — one call per listener, in order', { fs: 14, m: '#555' });
  return s + '</svg>';
}

/* ───────── ghép mã gọn cho slide ───────── */
/** Gập thân các phương thức có chữ ký chứa một trong `ten` thành "{ … }" (giữ chú thích cuối dòng chữ ký). */
const gap = (src, ten) => {
  const l = src.split('\n'), o = [];
  for (let i = 0; i < l.length; i++) {
    const x = l[i];
    if (ten.some((t) => x.includes(t)) && /\{\s*(\/\/.*)?$/.test(x)) {
      const ind = x.match(/^ */)[0];
      o.push(x.replace(/\{\s*(\/\/.*)?$/, (m, cm) => `{ … }${cm ? '   ' + cm : ''}`));
      while (i < l.length - 1 && l[i] !== ind + '}') i++;
    } else o.push(x);
  }
  return o.join('\n');
};
const ispVai = () => vung('cs7/IspTach', 'vai-lop', { gon: true, boTrong: true }).split('\n').reduce((a, x) => {
  if (/^(interface|class RepairDesk|    void fix)/.test(x) || (x === '}' && a.at(-1)?.startsWith('    void fix'))) a.push(x);
  else if (/^class Slim/.test(x)) a.push(x.replace(/\{$/, '{ … }'));
  return a;
}, []).join('\n');
const dipCao = () => {
  const l = vung('cs7/DipDaoChieu', 'cao', { gon: true }).split('\n');
  return [...l.slice(0, 5), ...l.slice(6, 9), '    void borrow(…) { if (repo.isOut(…)) throw …; repo.save(…); }', '}'].join('\n');
};
const builderLop = () => {
  const l = vung('cs7/BuilderPhieu', 'lop', { gon: true, boCmt: true, boTrong: true }).split('\n');
  const a = l.findIndex((x) => x.includes('static final class Builder'));
  return ['final class LoanReceipt {', '    // 5 final fields + private LoanReceipt(Builder b)', ...l.slice(a, l.length - 1), '}'].join('\n');
};

export const slides = lamDeck({ chuong: '⭐ CS.7 · SOLID and design patterns', bai: '' }, [
  /* 1 */
  { cover: true, nhan: '⭐ Advanced 7 · not on the PRO192 syllabus', t: 'SOLID and design patterns<br>in plain Java', sub: 'Five principles and six GoF patterns on CT Library — Strategy, Factory, Singleton, Builder, Observer, Template Method — every output from a real run, and where Spring Boot uses each one' },

  /* 2 */
  { t: 'Where you are, where this deck goes', body: `<table class="t" style="font-size:18px"><tr><th>You already have</th><th>This deck adds</th><th>Slides</th></tr>
<tr><td>N2.1 — SOLID on one page</td><td>each letter <b>measured</b> on CT Library: the class that breaks, then the fix</td><td>3–12</td></tr>
<tr><td>Lab 5 ${c('IFeePolicy')} · ⭐ CS.1 ${c('Comparator')}</td><td>the name of what you did: <b>Strategy</b></td><td>14–15</td></tr>
<tr><td>⭐ CS.4 — static factory, builder</td><td><b>Factory</b> and <b>Builder</b> as patterns, in the JDK and Spring</td><td>16–17 · 21</td></tr>
<tr><td>⭐ CS.6 — composition, DI by hand</td><td><b>Singleton</b> (and Spring’s), <b>Observer</b>, <b>Template Method</b></td><td>18–25</td></tr>
<tr><td>—</td><td>how to choose, when not to, interview answers</td><td>11–12 · 26</td></tr></table>
${two(box('Exam room PE (JDK 8)', `<p style="margin:0">Principles and patterns are plain classes and interfaces — they <b>work in Java 8</b>. Only the ${c('record')} / ${c('switch ->')} spellings here need Java 17.</p>`, 'lam'),
    box('Why now', `<p style="margin:0">Spring Boot <b>is</b> these patterns: a container of singletons built by factories, talking by events, with ${c('JdbcTemplate')} doing the boring steps.</p>`, 'ok'))}` },

  /* 3 */
  { t: 'One class, four jobs: LibraryManager', body: `<div class="hai" style="grid-template-columns:1fr 540px">${col(j(gap(vung('cs7/GodClass', 'god', { gon: true, boTrong: true }), ['void borrow', 'String returnBook', 'String saveLine']), { w: 552, hl: ['void borrow', 'int fee', 'String returnBook', 'String saveLine'] }),
    box('', `<p style="margin:0">Bodies of jobs 1, 3, 4 folded here. Four methods, <b>four different people</b> asking for changes — all in one file.</p>`, 'do2'))}
${col(hinhGod(), out('cs7/GodClass'))}</div>` },

  /* 4 */
  { t: 'S — Single Responsibility: one actor each', body: `${hinhSrp()}<div class="hai r64">${col(j(vung('cs7/SrpTach', 'chay', { gon: true }), { w: 650, hl: ['ShortReceiptPrinter'] }), out('cs7/SrpTach', { hl: [2] }))}
${col(box('Robert C. Martin, 2017', `<p style="margin:0">"A module should be responsible to <b>one, and only one, actor</b>." Not "do one thing" — one <b>group of people</b> who ask for changes.</p>`, 'lam'),
    box('Measured', `<p style="margin:0">Same receipt, same 5000 VND. A short receipt = <b>one new class</b>; ${c('LoanService')} untouched.</p>`, 'ok'))}</div>` },

  /* 5 */
  { t: 'O — Open/Closed: extend, don’t edit', body: `<div class="hai" style="grid-template-columns:1fr 1.08fr">${col(j(vung('cs7/OcpPhi', 'cu', { gon: true }), { w: 530, hl: ['default'] }),
    out('cs7/OcpPhi', { title: 'real output — OcpPhi: 5 days late', hl: [4] }))}
${col(j(vung('cs7/OcpPhi', 'moi', { gon: true }).split('\n').filter((x) => !/^class (Staff|Guest)Fee/.test(x)).join('\n').replace('class StudentFee', '// StaffFee, GuestFee: the same shape\nclass StudentFee'), { w: 580, hl: ['AlumniFee', '"ALUMNI"'] }),
    box('Bertrand Meyer, 1988', `<p style="margin:0">Open for <b>extension</b>, closed for <b>modification</b>: new behaviour = new code, not edits to tested code.</p>`, 'lam'))}</div>` },

  /* 6 */
  { t: 'L — Liskov: keep the parent’s promises', body: `<div class="hai">${j(vung('cs7/LspEBook', 'lop', { gon: true }), { hl: ['void borrow(String memberId) {', 'throw new Unsupported'] })}
${col(j(vung('cs7/LspEBook', 'khach')), out('cs7/LspEBook', { hl: [1, 3, 4] }),
    box('Barbara Liskov, 1987', `<p style="margin:0">Code written for ${c('Book')} must work with <b>any</b> subtype. ${c('EBook')} compiles — and breaks the caller.</p>`, 'do2'))}</div>` },

  /* 7 */
  { t: 'L — the Square trap and a safe design', body: `<div class="hai">${col(j(vung('cs7/LspHinhVuong', 'hinh', { gon: true, boTrong: true }), { hl: ['this.w = w; this.h = w', 'this.w = h; this.h = h'] }),
    j(vung('cs7/LspHinhVuong', 'khach', { gon: true })), out('cs7/LspHinhVuong', { khoang: [1, 2], hl: [2] }))}
${col(`<table class="t" style="font-size:16.5px"><tr><th>A subtype may</th><th>A subtype must not</th></tr>
<tr><td>accept <b>more</b> inputs</td><td>demand more (stronger precondition)</td></tr>
<tr><td>promise <b>more</b></td><td>promise less (weaker postcondition)</td></tr>
<tr><td>throw subtypes of declared exceptions</td><td>throw new surprises</td></tr></table>`,
    j(vung('cs7/LspHinhVuong', 'tach', { gon: true }).split('\n').slice(0, 2).join('\n') + '\n// PaperBook, Dvd: IBorrowable · EBook2: IDownloadable'),
    out('cs7/LspHinhVuong', { khoang: [3, 5], title: 'real output — split by ability' }))}</div>` },

  /* 8 */
  { t: 'I — Interface Segregation: small roles', body: `<div class="hai">${col(`<div class="vsd" style="grid-template-columns:1fr"><div class="sai"><div class="h">✗ one fat interface: stubs that throw</div>${j(vung('cs7/IspTach', 'beo-lop', { gon: true }), { w: 520, hl: ['throw new'] })}</div></div>`)}
${col(`<div class="vsd" style="grid-template-columns:1fr"><div class="dung"><div class="h">✓ three small roles (bodies hidden)</div>${j(ispVai(), { w: 520, hl: ['IRepairable item'] })}</div></div>`,
    out('cs7/IspTach', { title: 'real output — IspTach (lines 1–5)', khoang: [1, 5], hl: [2] }))}</div>` },

  /* 9 */
  { t: 'D — Dependency Inversion: own the interface', body: `${hinhDip()}<div class="hai">${j(dipCao(), { hl: ['ILoanRepository repo'] })}
${col(out('cs7/DipDaoChieu', { khoang: [1, 2], title: 'real output — one service, two stores' }), box('DIP · DI · IoC', `<p style="margin:0"><b>DIP</b> = the rule (depend on abstractions) · <b>DI</b> = the technique (pass them in, ⭐ CS.6) · <b>IoC</b> = a framework doing it (Spring).</p>`, 'lam'))}</div>` },

  /* 10 */
  { t: 'SOLID inside a Spring Boot project', body: `<div class="hai r46"><table class="t" style="font-size:17.5px"><tr><th></th><th>In CT Library / LabFlow on Spring Boot</th></tr>
<tr><td><b>S</b></td><td>${c('@RestController')} maps HTTP; ${c('@Service')} holds rules; ${c('@Repository')} talks to the DB</td></tr>
<tr><td><b>O</b></td><td>a new ${c('IFeePolicy')} = a new ${c('@Component')}; nothing else edited</td></tr>
<tr><td><b>L</b></td><td>any ${c('JpaRepository')} works where ${c('CrudRepository')} is expected</td></tr>
<tr><td><b>I</b></td><td>${c('CrudRepository')}, ${c('PagingAndSortingRepository')} — take the role you need</td></tr>
<tr><td><b>D</b></td><td>constructor injection of interfaces; Spring is the composition root</td></tr></table>
${col(spring(`@Service
public class LoanService {
    private final ILoanRepository loans;  // interface
    private final List<IFeePolicy> fees;  // all beans of the type

    public LoanService(ILoanRepository loans, List<IFeePolicy> fees) {
        this.loans = loans;
        this.fees = fees;
    }
}

@Component
class AlumniFee implements IFeePolicy { … }  // O: just add`, { w: 650 }), nhanSpring,
    box('', `<p style="margin:0">Spring fills ${c('List<IFeePolicy>')} with <b>every</b> bean of that type — adding a class is the whole change.</p>`, 'ok'))}</div>` },

  /* 11 */
  { t: 'When SOLID hurts: over-engineering', body: `${cards([
    ['🧱 An interface per class', `${c('IBookService')} with one implementation and no test double. Add the interface when the <b>second</b> implementation (or a fake) arrives.`],
    ['🧩 7 classes for a 10-line rule', 'A strategy family for a rule that never changed. <b>Rule of three</b>: refactor when the third variant appears.'],
    ['🔮 Designing for "maybe"', '<b>YAGNI</b> — You Aren’t Gonna Need It. Unused extension points still cost reading time.'],
    ['🌀 Indirection everywhere', 'To see what happens you open 6 files. <b>KISS</b> — the simplest design that passes the tests.'],
  ], 2)}
${box('A useful test', `<p style="margin:0">Name the <b>change</b> the principle protects you from. If you cannot name a likely one, keep the simple version — and keep it easy to split later (small methods, no static state).</p>`, 'lam')}`, giua: true, to: true },

  /* 12 */
  { t: 'Code smells, principles, interview answers', body: `<div class="hai r46"><table class="t" style="font-size:17px"><tr><th>Smell in your code</th><th></th><th>Fix</th></tr>
<tr><td>a "Manager" class with 30 methods</td><td><b>S</b></td><td>split by actor</td></tr>
<tr><td>${c('if (type.equals(…))')} in many places</td><td><b>O</b></td><td>a strategy per type</td></tr>
<tr><td>an override that throws ${c('UnsupportedOperation…')}</td><td><b>L</b></td><td>split the hierarchy</td></tr>
<tr><td>throwing stubs to satisfy an interface</td><td><b>I</b></td><td>smaller interfaces</td></tr>
<tr><td>${c('new FileRepository()')} inside a service</td><td><b>D</b></td><td>inject an interface</td></tr></table>
${steps([
  '<b>What is SOLID?</b> Five design principles (Martin, ~2000) so a change touches few classes.',
  '<b>SRP?</b> One actor per class — fee rules and receipt layout change for different people.',
  '<b>An LSP example?</b> Square/Rectangle: same calls, area 16 instead of 20.',
  '<b>DIP vs DI?</b> Principle vs technique; Spring is the IoC container.',
  '<b>Downside?</b> Over-engineering — add the abstraction when the change is real.',
])}</div>`, giua: true },

  /* 13 */
  { t: 'Design patterns: the GoF map', body: `${hinhGof()}
${two(box('Gamma, Helm, Johnson, Vlissides — 1994', `<p style="margin:0"><i>Design Patterns</i> ("Gang of Four", GoF): <b>23</b> patterns in 3 groups. A pattern = a <b>name</b> + problem + solution + trade-offs — a shared vocabulary.</p>`, 'lam'),
    box('Legend', `<p style="margin:0"><b style="background:${CAM};color:#fff;padding:0 5px;border-radius:4px">filled</b> = this deck (6) · <b style="color:${PG}">dashed ✓</b> = met before: Iterator (Ch.8), Decorator (⭐ CS.6), Proxy (Spring ${c('@Transactional')}).</p>`, ''))}` },

  /* 14 */
  { t: 'Strategy: pass the "how" as an object', body: `<div class="hai">${col(j(vung('cs7/StrategyPhi', 'phi-lop', { gon: true }), { hl: ['setPolicy', 'Checkout(IFeePolicy'] }), j(vung('cs7/StrategyPhi', 'phi', { gon: true })),
    '')}
${col(j(vung('cs7/StrategyPhi', 'chien-luoc', { gon: true }).replace(/\n\s+\.thenComparing/, '\n        .thenComparing')), out('cs7/StrategyPhi'),
    box('You already used it', `<p style="margin:0">${c('Comparator')} = a sort strategy; Lab 5 ${c('IFeePolicy')} = a fee strategy. The context never asks <b>which</b> one.</p>`, 'ok'))}</div>` },

  /* 15 */
  { t: 'Strategy with lambdas — and in Spring', body: `<div class="hai">${col(j(vung('cs7/StrategyLambda', 'so', { gon: true, boTrong: true }), { hl: ['"ALUMNI"', 'getOrDefault'] }), out('cs7/StrategyLambda', { khoang: [1, 5] }))}
${col(spring(`@Component("STUDENT")
class StudentFee implements IFeePolicy { … }
@Component("ALUMNI")
class AlumniFee implements IFeePolicy { … }

@Service
class FeeService {
    private final Map<String, IFeePolicy> byType;
    FeeService(Map<String, IFeePolicy> byType) {
        this.byType = byType;   // keys = bean names
    }
}`), nhanSpring,
    box('Lambda or class?', `<p style="margin:0">One method, no state ⇒ a <b>lambda</b>. Several methods or its own dependencies ⇒ a <b>class</b> (a Spring bean).</p>`, 'lam'))}</div>` },

  /* 16 */
  { t: 'Factory: one place decides what to create', body: `<div class="hai">${col(j(vung('cs7/FactoryDon', 'nha-may', { gon: true }).split('\n').filter((x) => !/^class (Student|Staff|Guest)Fee/.test(x)).join('\n'), { hl: ['trim()', 'default'] }),
    box('', `<p style="margin:0">Callers say <b>what</b>, not <b>which class</b>; input checked once.</p>`, 'ok'))}
${col(j(vung('cs7/FactoryDon', 'chay', { gon: true })), out('cs7/FactoryDon', { hl: [4] }))}</div>` },

  /* 17 */
  { t: 'Three kinds of "factory" — and the JDK’s', body: `<table class="t" style="font-size:18.5px"><tr><th>Name</th><th>What it is</th><th>Example</th></tr>
<tr><td><b>Simple factory</b></td><td>one method with a switch that news the right class</td><td>${c('FeePolicyFactory.create("staff")')}</td></tr>
<tr><td><b>Static factory method</b> (Bloch, ⭐ CS.4)</td><td>a named static method instead of a constructor; may cache, may return a subtype</td><td>${c('Integer.valueOf')}, ${c('List.of')}</td></tr>
<tr><td><b>Factory Method</b> (GoF)</td><td>an overridable method — the <b>subclass</b> decides what to create</td><td>${c('iterator()')} of every collection</td></tr></table>
${two(out('cs7/FactoryJdk', { title: 'real output — FactoryJdk (JDK 21)', hl: [1, 2, 4] }),
    box('Read the output', `<p style="margin:0">You asked for "a List" and got ${c('List12')} or ${c('ListN')}; "an Integer" and got a <b>cached</b> one up to 127. Spring: every ${c('@Bean')} method is a factory method; ${c('BeanFactory')} is the factory of all beans.</p>`, 'lam'), 'r64')}`, giua: true },

  /* 18 */
  { t: 'Singleton: three correct ways', body: `<div class="hai" style="grid-template-columns:1.08fr 1fr">${j(vung('cs7/SingletonCach', 'ba-cach', { gon: true }), { w: 580, hl: ['INSTANCE = new EagerConfig', 'class Holder', 'INSTANCE;'] })}
${col(out('cs7/SingletonCach', { hl: [3, 6] }),
    `<table class="t" style="font-size:16px"><tr><th>Way</th><th>Created</th><th>Thread-safe</th></tr><tr><td>eager</td><td>class initialised</td><td>✓ (JVM)</td></tr><tr><td>holder</td><td>first ${c('getInstance()')}</td><td>✓ (JVM)</td></tr><tr><td>enum</td><td>first use of the enum</td><td>✓ + no reflection</td></tr></table>`,
    box('Look at line 2', `<p style="margin:0">${c('EagerConfig.class')} alone does <b>not</b> initialise the class — the first ${c('getInstance()')} does.</p>`, 'lam'))}</div>` },

  /* 19 */
  { t: 'Lazy singleton: two threads, two objects', body: `<div class="hai" style="grid-template-columns:1fr 560px">${col(j(vung('cs7/SingletonDua', 'lop', { gon: true }), { w: 530, hl: ['if (instance == null)', 'Demo.both', 'instance = new'] }),
    out('cs7/SingletonDua', { hl: [1] }))}
${col(hinhDuaSingleton(), box('→ ⭐ CS.8', `<p style="margin:0">The demo waits on purpose so it fails <b>every</b> run; in production it fails rarely — worse. Fixes (synchronized, volatile, holder) are measured in CS.8.</p>`, 'do2'))}</div>` },

  /* 20 */
  { t: 'Spring’s singleton: one bean, stateless', body: `<div class="hai">${col(box('Spring reference — Bean Scopes', `<p style="margin:0">Spring’s singleton "differs from the singleton pattern as defined in the GoF patterns book… best described as <b>per-container and per-bean</b>." Fields may hold <b>dependencies</b> only — never one request’s data.</p>`, 'lam'),
    j(vung('cs7/BeanCoTrangThai', 'lop', { gon: true }), { hl: ['private String currentMember'] }))}
${col(out('cs7/BeanCoTrangThai', { title: 'real output — one shared object, two requests', hl: [1] }), spring(`// default scope = "singleton"
@Service
class ReceiptService { … }   // stateless

// a new object per injection
@Component
@Scope("prototype")
class ImportJob { … }`), nhanSpring)}</div>` },

  /* 21 */
  { t: 'Builder: optional parts, one check', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr">${j(builderLop(), { w: 590, hl: ['return this', 'if (days < 1'] })}
${col(j(vung('cs7/BuilderPhieu', 'chay', { gon: true }).split('\n').slice(0, 6).join('\n')), out('cs7/BuilderPhieu', { hl: [3] }),
    box('Builder in your stack', `<p style="margin:0">Lombok ${c('@Builder')}, ${c('ResponseEntity.status(201).body(dto)')}, ${c('HttpRequest.newBuilder()')}. The immutable class itself: ⭐ CS.4.</p>`, 'lam'))}</div>` },

  /* 22 */
  { t: 'Observer: announce, let others react', body: `<div class="hai" style="grid-template-columns:1fr 540px">${col(j(vung('cs7/ObserverSuKien', 'lop', { gon: true }).split('\n').slice(0, 14).join('\n'), { w: 552, hl: ['interface IReturnListener', 'l.onReturned(e)'] }))}
${col(hinhObserver(), out('cs7/ObserverSuKien', { hl: [5] }))}</div>` },

  /* 23 */
  { t: 'Observer for real — and in Spring', body: `<div class="hai">${col(out('cs7/ObserverDongBo', { hl: [3, 7, 8] }),
    box('Measured', `<p style="margin:0">Listeners run on the caller’s thread, <b>in order</b>. One exception aborts the return <b>and</b> skips listener 3 — isolate them. ${c('java.util.Observable')} has been deprecated since Java 9.</p>`, 'do2'))}
${col(spring(`record BookReturned(String memberId, String itemId) {}

@Service
class LoanService {
    private final ApplicationEventPublisher events;
    LoanService(ApplicationEventPublisher events) { this.events = events; }
    void giveBack(String m, String item) {
        // … update the database …
        events.publishEvent(new BookReturned(m, item));
    }
}
@Component
class WaitListNotifier {
    @EventListener
    void on(BookReturned e) { … }   // same thread by default
}`), nhanSpring)}</div>` },

  /* 24 */
  { t: 'Template Method: fixed steps, blanks to fill', body: `<div class="hai" style="grid-template-columns:1.08fr 1fr">${col(j(vung('cs7/TemplateBaoCao', 'khuon', { gon: true, boCmt: true }).split('\n').slice(0, 13).join('\n').replace(/TemplateBaoCao\.Row/g, 'Row'), { w: 580, hl: ['final String export', 'abstract String', 'wantsTotal() { return false'] }),
    box('', `<p style="margin:0">${c('final export()')} = the algorithm nobody may reorder · ${c('abstract')} = steps you must write · a <b>hook</b> = optional, has a default.</p>`, 'lam'))}
${col(j(vung('cs7/TemplateBaoCao', 'khuon', { gon: true }).split('\n').slice(15).join('\n').replace(/^\n+/, '').replace(/TemplateBaoCao\.Row/g, 'Row').replace(/class CsvExporter[\s\S]*?\n\}\n\n/, 'class CsvExporter extends ReportExporter { … }\n\n'), { hl: ['wantsTotal'] }), out('cs7/TemplateBaoCao', { hl: [7] }))}</div>` },

  /* 25 */
  { t: 'Template by callback: JdbcTemplate', body: `<div class="hai">${col(j(vung('cs7/TemplateCallback', 'abstract-list', { gon: true }).split('\n').slice(0, 5).join('\n') + '\ndays.contains("TUE"); days.indexOf("WED");  // free'), j(vung('cs7/TemplateCallback', 'mini', { gon: true }).split('\n').slice(0, 13).join('\n') + '\n        }  …\n}', { w: 560, hl: ['mapper.mapRow', 'finally'] }))}
${col(out('cs7/TemplateCallback'), spring(`List<String> titles = jdbcTemplate.query(
    "SELECT title FROM book",
    (rs, rowNum) -> rs.getString("title"));  // RowMapper`), nhanSpring,
    box('Two faces', `<p style="margin:0"><b>Inheritance</b>: a subclass fills the ${c('abstract')} steps (${c('AbstractList')}). <b>Callback</b>: you pass a lambda (${c('JdbcTemplate')}, ${c('TransactionTemplate')}) — the template opens and <b>always closes</b> the connection.</p>`, 'ok'))}</div>` },

  /* 26 */
  { t: 'Choosing a pattern, answering interviews', body: `<table class="t" style="font-size:18px"><tr><th>The problem</th><th>Pattern</th><th>Java / Spring</th><th>Cost</th></tr>
<tr><td>many ways to do one step, chosen at run time</td><td><b>Strategy</b></td><td>${c('Comparator')}, a list of beans</td><td>one class per variant</td></tr>
<tr><td>which class to create depends on input</td><td><b>Factory</b></td><td>${c('List.of')}, ${c('@Bean')}</td><td>one more indirection</td></tr>
<tr><td>one shared object for the whole app</td><td><b>Singleton</b></td><td>bean scope, ${c('enum')}</td><td>global state, hard to test</td></tr>
<tr><td>an object with many optional parts</td><td><b>Builder</b></td><td>Lombok ${c('@Builder')}</td><td>a second class</td></tr>
<tr><td>others must react to an event</td><td><b>Observer</b></td><td>${c('@EventListener')}</td><td>hidden flow, order, errors</td></tr>
<tr><td>same algorithm, a few steps differ</td><td><b>Template</b></td><td>${c('JdbcTemplate')}</td><td>inheritance is rigid</td></tr></table>
${two(box('Answer in three beats', `<p style="margin:0">1. the <b>problem</b> it solves · 2. a <b>real</b> example (CT Library, JDK, Spring) · 3. the <b>cost</b>.</p>`, 'ok'),
    box('Trap: "Is Singleton an anti-pattern?"', `<p style="margin:0">Global mutable state and hidden dependencies make it hard to test — prefer <b>one instance by DI</b> (Spring) over ${c('getInstance()')}.</p>`, 'do2'))}`, giua: true },
]);
