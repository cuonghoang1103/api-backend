/**
 * GitHub Actions · Deck ga-07 — Chương 7: Tốc độ, concurrency, và cái giá của nó.
 *
 * MỌI log/con số mới trên slide là THẬT, chạy 24/09/2026 trên sân tập công khai
 * github.com/cuonghoang1103/ga-san-tap, nhánh ch07-toc-do (runner 2.337.0, ảnh ubuntu-24.04 20260920.314.1):
 *   ch07-do-thi-chuoi.yml  36009578496 · 36010873956 · 36011282047 · 36011550990 · 36012034033 (kiểm CHẶN trước)
 *   ch07-do-thi-song.yml   36009578213 · 36010879542 · 36011288239 · 36011556092 · 36012040208 (kiểm song song)
 *   ch07-cc-huy.yml        36009923442 ✗ · 36009970441 ✗ · 36010016477 ✓ (cancel-in-progress: true)
 *   ch07-cc-xep.yml        36009923032 ✓ · 36009970458 ✗ (chờ, bị thay) · 36010016461 ✓ (false)
 *   ch07-cc-hang.yml       36009923057 ✓ · 36009970451 ✓ · 36010016184 ✓ (queue: max)
 *   ch07-chung-a/b.yml     36011098744 · 36011098857 (hai workflow, CHUNG một group)
 *   ch07-phuong-sai.yml    14 lần chạy cùng commit (36009578248 … 36012722129)
 *   ch07-tach-job.yml      36009578382 · 36012332612 · 36012449538 · 36012595590 · 36012717191
 * Run 32662461744 là của api-backend (desktop-release.yml), đọc bằng API (chỉ đọc).
 * Giá: docs.github.com/en/billing/reference/actions-runner-pricing — đọc 24/09/2026.
 */
import { S, cover, cards, box, table, two, list, mindmap, term as gaTerm, yaml, bars, kpis, steps, diagram, sv, R, T, A, D } from './_ga-chung.mjs';

export const deck = { key: 'ga-07', code: 'GITHUB ACTIONS · CHƯƠNG 7', title: 'Tốc độ, concurrency, và cái giá', sub: 'GitHub Actions · Chương 7' };

const t = (lines, title, fs = 15) => gaTerm(lines, { title, dir: '~/ga-san-tap', fs });
const fill = (c, p = 26) => `color-mix(in srgb, ${D[c] || c} ${p}%, #0f182a)`;

/* ───────────── Slide 3 — đồ thị job, đường tới hạn tô đậm ───────────── */
const doThi = () => {
  let s = '';
  const N = {
    kiem: [30, 185, 'Kiểm tra mã', '72 s', true],
    lin: [390, 40, 'Dựng Linux', '241 s', false],
    mac: [390, 185, 'Dựng macOS', '437 s', true],
    win: [390, 330, 'Dựng Windows', '323 s', false],
    pub: [770, 185, 'Công bố', '34 s', true],
  };
  const W = 250, H = 76;
  const E = [['kiem', 'lin'], ['kiem', 'mac'], ['kiem', 'win'], ['lin', 'pub'], ['mac', 'pub'], ['win', 'pub']];
  for (const [a, b] of E) {
    const p = N[a], q = N[b], crit = p[4] && q[4];
    const x1 = p[0] + W, y1 = p[1] + H / 2, x2 = q[0] - 6, y2 = q[1] + H / 2, mx = (x1 + x2) / 2;
    s += `<path d="M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}" stroke="${crit ? D.amb : D.dim}" stroke-width="${crit ? 6 : 2.5}" fill="none"${crit ? '' : ' marker-end="url(#m-dim)" stroke-dasharray="7 6"'}/>`;
    if (crit) s += `<polygon points="${x2 + 4},${y2} ${x2 - 14},${y2 - 10} ${x2 - 14},${y2 + 10}" fill="${D.amb}"/>`;
  }
  for (const [x, y, n, d, crit] of Object.values(N)) {
    s += R(x, y, W, H, { c: crit ? 'amb' : 'grn', fill: crit ? fill('amb', 22) : '#0f182a', sw: crit ? 4 : 2 });
    s += `<circle cx="${x + 28}" cy="${y + H / 2}" r="13" fill="${D.grn}"/>` + T(x + 28, y + H / 2 + 6, '✓', { fs: 16, a: 'middle', b: true, c: '#08101e' });
    s += T(x + 52, y + 34, n, { fs: 19, b: true }) + T(x + 52, y + 60, d, { fs: 17, mono: true, c: crit ? 'amb' : 'mu' });
  }
  s += R(1050, 60, 1, 1, { c: 'dim', sw: 0 });
  s += T(28, 470, 'Vàng đậm = đường tới hạn: 72 + 437 + 34 = 543 s.  Xám nét đứt = nhánh có độ chùng (Linux chờ 199 s, Windows chờ 117 s).', { fs: 16, c: 'mu' });
  s += R(1050, 40, 1, 1, { c: 'dim', sw: 0 });
  // cột số bên phải
  const K = [['1.107 s', 'máy-giây (trả tiền)', 'blu'], ['553 s', 'đồng hồ (người chờ)', 'tea'], ['543 s', 'đường tới hạn (sàn)', 'amb']];
  K.forEach(([v, l, c], i) => { const y = 40 + i * 130; s += R(1060, y, 150, 104, { c, fill: '#0f182a' }) + T(1135, y + 50, v, { fs: 25, b: true, a: 'middle', c }) + T(1135, y + 80, l, { fs: 13.5, a: 'middle', c: 'mu' }); });
  return sv(1220, 480, s);
};

/* ───────────── Gantt dùng chung (slide 4, 6) ───────────── */
const gantt = (rows, { max, K, X0 = 250, w = 1160, h, tick = 60, note, unit = 's' }) => {
  let s = '';
  const X = (v) => X0 + v * K;
  const H = h || 40 + rows.length * 62 + (note ? 40 : 0);
  for (let i = 0; i <= max; i += tick) s += `<line x1="${X(i)}" y1="26" x2="${X(i)}" y2="${40 + rows.length * 62}" stroke="#1d2a40" stroke-width="1"/>` + T(X(i), 18, `${i}${unit}`, { fs: 13.5, a: 'middle', c: 'dim', mono: true });
  rows.forEach(([lb, a, d, c, crit, wait, txt], i) => {
    const y = 36 + i * 62;
    s += T(0, y + 32, lb, { fs: 16, b: true, c: crit ? 'amb' : '#e6edf3' });
    if (wait) s += R(X(a + d), y + 14, wait * K, 28, { c: 'dim', dash: true, fill: 'rgba(255,255,255,.03)', r: 6, sw: 1.5 }) + T(X(a + d) + wait * K / 2, y + 33, `chờ ${wait} s`, { fs: 13.5, a: 'middle', c: 'mu' });
    s += R(X(a), y + 8, Math.max(4, d * K), 40, { c: crit ? 'amb' : c, fill: fill(crit ? 'amb' : c, crit ? 34 : 24), r: 7, sw: crit ? 3.5 : 2 });
    const lab = txt ?? `${d} s`;
    if (d * K > 60) s += T(X(a) + 10, y + 34, lab, { fs: 15, c: '#fff', b: crit });
    else s += T(X(a + d) + 8, y + 34, lab, { fs: 14.5, c: 'mu' });
  });
  if (note) s += T(0, 40 + rows.length * 62 + 26, note, { fs: 14.5, c: 'mu' });
  return sv(w, H, s);
};

/* ───────────── Slide 9 — ba làn concurrency ───────────── */
const baLan = () => {
  let s = '';
  const X0 = 250, K = 3.0; // px / giây, mốc 0 = 14:02:40
  const X = (v) => X0 + v * K;
  for (let i = 0; i <= 280; i += 40) s += `<line x1="${X(i)}" y1="34" x2="${X(i)}" y2="420" stroke="#1d2a40" stroke-width="1"/>` + T(X(i), 24, `+${i}s`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  [[3, '1'], [26, '2'], [49, '3']].forEach(([p, n]) => { s += `<line x1="${X(p)}" y1="34" x2="${X(p)}" y2="420" stroke="${D.vio}" stroke-width="2" stroke-dasharray="4 4"/>` + T(X(p) + 4, 48, `push ${n}`, { fs: 13, c: 'vio', b: true }); });
  const lanes = [
    ['cancel-in-progress: true', 'huỷ', [[1, 6, 10, 42, 'x'], [2, 29, 46, 64, 'x'], [3, 51, 68, 154, 'ok']], 'commit 3 xong +154 s'],
    ['cancel-in-progress: false', 'xếp', [[1, 5, 10, 94, 'ok'], [2, 29, null, 53, 'p'], [3, 51, 98, 183, 'ok']], 'commit 3 xong +183 s'],
    ['queue: max', 'hàng', [[1, 5, 9, 95, 'ok'], [2, 29, 99, 185, 'ok'], [3, 51, 189, 274, 'ok']], 'commit 3 xong +274 s'],
  ];
  lanes.forEach(([lb, ten, runs, kq], li) => {
    const y0 = 62 + li * 122;
    const [k1, k2] = lb.includes(': ') && lb.startsWith('cancel') ? ['cancel-in-progress:', lb.split(': ')[1]] : [lb, ''];
    s += T(0, y0 + 22, k1, { fs: 14.5, b: true, mono: true }) + (k2 ? T(0, y0 + 44, k2, { fs: 16, b: true, mono: true, c: k2 === 'true' ? 'red' : 'grn' }) : '') + T(0, y0 + (k2 ? 68 : 46), kq, { fs: 14, c: 'mu' });
    runs.forEach(([n, tao, bd, kt, kind], ri) => {
      const y = y0 + ri * 36;
      const bdx = bd ?? kt;
      s += R(X(tao), y + 6, Math.max(3, (bdx - tao) * K), 24, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.08)', r: 5, sw: 1.5 });
      if (bd != null) {
        const c = kind === 'x' ? 'red' : 'grn';
        s += R(X(bd), y + 4, (kt - bd) * K, 28, { c, fill: fill(c, 30), r: 6, sw: 2 });
        s += T(X(bd) + 8, y + 23, `run ${n} ${kind === 'x' ? '✗' : '✓'}`, { fs: 13.5, c: '#fff' });
        if (kind === 'x') s += T(X(kt) + 8, y + 23, 'huỷ giữa bước', { fs: 13.5, c: 'red' });
      } else s += T(X(kt) + 8, y + 23, `run ${n}: chờ → bị thay, 0 job`, { fs: 13.5, c: 'red' });
    });
  });
  s += R(0, 430, 16, 12, { c: 'vio', dash: true, fill: 'rgba(188,140,255,.08)', r: 3, sw: 1.5 }) + T(24, 441, 'đang chờ (pending)', { fs: 13.5, c: 'mu' });
  s += R(190, 430, 16, 12, { c: 'grn', fill: fill('grn', 30), r: 3, sw: 1.5 }) + T(214, 441, 'chạy xong', { fs: 13.5, c: 'mu' });
  s += R(320, 430, 16, 12, { c: 'red', fill: fill('red', 30), r: 3, sw: 1.5 }) + T(344, 441, 'bị huỷ', { fs: 13.5, c: 'mu' });
  s += T(460, 441, 'Mỗi run = 2 bước giả lập 40 s + dọn dẹp. Mốc 0 = 14:02:40 UTC.', { fs: 13.5, c: 'mu' });
  return sv(1160, 450, s);
};

/* ───────────── Slide 11 — bậc thang huỷ ───────────── */
const thangHuy = () => {
  let s = '';
  const X0 = 60, K = 80; // px / giây
  const X = (v) => X0 + v * K;
  s += `<line x1="${X(0)}" y1="150" x2="${X(12.5)}" y2="150" stroke="${D.mu}" stroke-width="2"/>`;
  for (let i = 0; i <= 12; i += 1) s += `<line x1="${X(i)}" y1="145" x2="${X(i)}" y2="155" stroke="${D.mu}"/>` + T(X(i), 176, `${i}s`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  const P = [[0, 'yêu cầu huỷ', 'SIGINT (Ctrl-C) tới tiến trình chính', 'amb'], [7.5, '+7,5 s', 'chưa thoát ⇒ SIGTERM', 'ora'], [10, '+10 s', 'vẫn chưa ⇒ GIẾT cả cây tiến trình', 'red']];
  P.forEach(([v, a, b, c], i) => {
    s += `<circle cx="${X(v)}" cy="150" r="11" fill="${D[c]}"/>`;
    const y = i % 2 ? 216 : 62, anchor = i === 2 ? 'end' : 'start', dx = i === 2 ? 14 : -10;
    s += A(X(v), i % 2 ? 196 : 118, X(v), i % 2 ? 166 : 136, { c, sw: 2 });
    s += T(X(v) + dx, y, a, { fs: 17, b: true, c, a: anchor }) + T(X(v) + dx, y + 26, b, { fs: 15, a: anchor });
  });
  s += R(X(0), 270, 10 * K, 40, { c: 'red', fill: fill('red', 22), r: 7 }) + T(X(0) + 12, 296, 'đo trên sân tập: bước "đẩy ảnh" bị cắt 10 s sau khi run mới được tạo (hai lần) — khớp 7,5 + 2,5 s', { fs: 15, c: '#fff' });
  s += T(X(0), 348, 'run 36009923442: run mới tạo 14:03:09 → "The operation was canceled." 14:03:19 → job của run mới tạo 14:03:23', { fs: 14.5, c: 'mu', mono: true });
  s += T(X(0), 374, 'run 36009970441: run mới tạo 14:03:31 → bị cắt 14:03:41', { fs: 14.5, c: 'mu', mono: true });
  s += T(X(0), 410, 'Sau đó: bước if: always() / if: cancelled() VẪN chạy; server cưỡng chế dừng sau 5 phút.', { fs: 15.5, b: true });
  return sv(1160, 430, s);
};

/* ───────────── Slide 16 — 14 lần chạy cùng commit ───────────── */
const PS = [77, 72, 62, 51, 47, 42, 47, 37, 49, 50, 51, 55, 46, 51];
const PS_WHY = { 0: 'đuôi 30 s', 1: 'khởi động 20 s', 2: 'setup-node 20 s' };
const cot = () => {
  let s = '';
  const X0 = 70, Y0 = 370, KY = 4.2, BW = 50, G = 14;
  for (let v = 0; v <= 80; v += 20) s += `<line x1="${X0}" y1="${Y0 - v * KY}" x2="${X0 + 14 * (BW + G)}" y2="${Y0 - v * KY}" stroke="#1d2a40"/>` + T(X0 - 10, Y0 - v * KY + 5, `${v}s`, { fs: 13.5, a: 'end', c: 'dim', mono: true });
  PS.forEach((v, i) => {
    const x = X0 + 10 + i * (BW + G), out = PS_WHY[i];
    s += R(x, Y0 - v * KY, BW, v * KY, { c: out ? 'red' : 'blu', fill: fill(out ? 'red' : 'blu', 34), r: 5, sw: 2 });
    s += T(x + BW / 2, Y0 - v * KY - 8, `${v}`, { fs: 15, a: 'middle', b: true, c: out ? 'red' : '#e6edf3' });
    s += T(x + BW / 2, Y0 + 22, `#${i + 1}`, { fs: 13, a: 'middle', c: 'dim' });
    if (out) s += T(x + BW / 2, Y0 + 42 + (i % 2) * 20, out, { fs: 13, a: 'middle', c: 'red' });
  });
  const med = 50.5;
  s += `<line x1="${X0}" y1="${Y0 - med * KY}" x2="${X0 + 14 * (BW + G)}" y2="${Y0 - med * KY}" stroke="${D.amb}" stroke-width="2.5" stroke-dasharray="8 5"/>`;
  s += T(X0 + 14 * (BW + G) + 8, Y0 - med * KY + 5, 'trung vị 50,5 s', { fs: 15, c: 'amb', b: true });
  const x = X0 + 14 * (BW + G) + 8;
  s += T(x, 30, 'min 37 · max 77', { fs: 15 }) + T(x, 56, 'max/min = 2,08×', { fs: 15, b: true, c: 'red' }) + T(x, 82, 'độ lệch chuẩn 10,9 s', { fs: 15 }) + T(x, 230, 'bỏ 3 cột đỏ:', { fs: 14, c: 'mu' }) + T(x, 252, '37–55 s (1,49×)', { fs: 14.5, c: 'mu' });
  return sv(1160, 440, s);
};

/* ───────────── Slide 17 — phân rã lần nhanh nhất / chậm nhất ───────────── */
const phanRa = () => {
  const rows = [
    ['#8 nhanh nhất · 37 s', [[0, 3, 'dim', ''], [3, 2, 'blu', ''], [5, 11, 'amb', 'npm ci 11'], [16, 2, 'tea', ''], [18, 9, 'vio', 'test 9'], [27, 3, 'grn', ''], [30, 7, 'dim', '']]],
    ['#1 · 77 s', [[0, 5, 'dim', ''], [5, 4, 'blu', ''], [9, 16, 'amb', 'npm ci 16'], [25, 3, 'tea', ''], [28, 12, 'vio', 'test 12'], [40, 3, 'grn', ''], [43, 4, 'dim', ''], [47, 30, 'red', 'đuôi job 30 s — sau bước cuối']]],
    ['#2 · 72 s', [[0, 3, 'dim', ''], [3, 20, 'red', 'khởi động 20 s — trước bước đầu'], [23, 2, 'dim', ''], [25, 6, 'blu', ''], [31, 14, 'amb', 'npm ci 14'], [45, 2, 'tea', ''], [47, 15, 'vio', 'test 15 (Xeon)'], [62, 3, 'grn', ''], [65, 7, 'dim', '']]],
    ['#3 · 62 s', [[0, 4, 'dim', ''], [4, 20, 'red', 'setup-node 20 s'], [24, 17, 'amb', 'npm ci 17'], [41, 2, 'tea', ''], [43, 10, 'vio', 'test 10'], [53, 2, 'grn', ''], [55, 7, 'dim', '']]],
  ];
  let s = '';
  const X0 = 210, K = 11.6;
  for (let i = 0; i <= 80; i += 10) s += `<line x1="${X0 + i * K}" y1="22" x2="${X0 + i * K}" y2="${30 + rows.length * 74}" stroke="#1d2a40"/>` + T(X0 + i * K, 16, `${i}s`, { fs: 13, a: 'middle', c: 'dim', mono: true });
  rows.forEach(([lb, segs], i) => {
    const y = 30 + i * 74;
    s += T(0, y + 34, lb, { fs: 15.5, b: true, c: i === 0 ? 'grn' : '#e6edf3' });
    segs.forEach(([a, w, c, txt]) => {
      s += R(X0 + a * K, y + 8, Math.max(3, w * K - 2), 42, { c, fill: fill(c, c === 'red' ? 40 : 28), r: 6, sw: 1.8 });
      if (txt) s += T(X0 + a * K + 8, y + 35, txt, { fs: 14, c: '#fff' });
    });
  });
  const L = [['dim', 'xếp hàng + checkout + chuyển tiếp'], ['blu', 'setup-node (khôi phục cache)'], ['amb', 'npm ci'], ['tea', 'tsc'], ['vio', 'test (CPU)'], ['grn', 'build']];
  L.forEach(([c, l], i) => { const x = (i % 3) * 360, y = 340 + Math.floor(i / 3) * 28; s += R(x, y, 18, 14, { c, fill: fill(c, 40), r: 3, sw: 1.5 }) + T(x + 26, y + 13, l, { fs: 14, c: 'mu' }); });
  s += T(0, 418, 'Ba lần chậm nhất chậm vì BA lý do khác nhau — và không lý do nào nằm trong mã của bạn.', { fs: 15.5, b: true });
  return sv(1160, 430, s);
};

export const slides = S([
  /* 1 */ cover({ t: 'Chương 7 — Tốc độ, concurrency, và cái giá của nó', sub: 'đường tới hạn · concurrency · phương sai · xếp hạng tăng tốc · CI tốn gì, đáng gì', chap: 'CHƯƠNG 7' }),

  /* 2 */ { t: 'Bản đồ chương: đo trước, tối ưu sau, và biết giá', body: mindmap('tốc độ & giá', 'năm câu hỏi trước khi "làm CI nhanh lên"', [
    { t: '7.1 Đường tới hạn', d: 'chuỗi job dài nhất = cái sàn · job ngoài đường có độ chùng', c: 'amb' },
    { t: '7.2 Concurrency', d: 'huỷ · xếp · hàng — và nó KHÔNG làm bất biến', c: 'dk' },
    { t: '7.3 Phương sai', d: '14 lần cùng commit: 37–77 s', c: 'red' },
    { t: '7.4 Xếp hạng', d: 'gỡ một cạnh needs: > mọi cache', c: 'tea' },
    { t: '7.5 Giá trị', d: '$0,006 · $0,010 · $0,062 mỗi phút', c: 'grn' },
  ]) },

  /* ───── 7.1 ───── */
  /* 3 */ { t: 'Đường tới hạn: 3 trong 5 job quyết định cả lần chạy', body: doThi() },

  /* 4 */ { t: 'Dòng thời gian: Linux và Windows xong sớm rồi ngồi chờ', body: gantt([
    ['Kiểm tra mã', 0, 72, 'blu', true, 0],
    ['Dựng Linux', 75, 241, 'grn', false, 199],
    ['Dựng macOS', 75, 437, 'grn', true, 0],
    ['Dựng Windows', 75, 323, 'grn', false, 117],
    ['Công bố', 517, 34, 'blu', true, 0],
  ], { max: 540, K: 1.5, tick: 60, note: 'api-backend · desktop-release.yml · run 32662461744. Vàng = trên đường tới hạn. Ô nét đứt = độ chùng: giảm job đó bao nhiêu cũng không nhanh thêm giây nào.' }) },

  /* 5 */ { t: 'Một script đọc đường tới hạn từ API — không cần mở giao diện', body: t([
    '$ node ch07/duong-toi-han.mjs 32662461744 cuonghoang1103/api-backend',
    'run 32662461744 · Desktop — dựng bản cài 3 nền tảng · workflow_dispatch',
    'job                         cho may  chay   xong luc',
    '! Kiểm tra mã                     3s    72s   19:50:44   <- TREN duong toi han',
    'Dựng Linux                      3s   241s   19:54:49   ngoai: cho 199s',
    '! Dựng macOS                      3s   437s   19:58:05   <- TREN duong toi han',
    'Dựng Windows                    3s   323s   19:56:11   ngoai: cho 117s',
    '! Công bố bản phát hành           2s    34s   19:58:42   <- TREN duong toi han',
    'tong MAY-GIAY      1107 s',
    'DONG HO (job dau tao -> job cuoi xong)  553 s',
    '+ duong TOI HAN      72 + 437 + 34 = 543 s',
    'phan con lai = cho runner + ban giao giua job: 10 s',
  ], 'đi ngược: job xong cuối ← job xong muộn nhất trước khi nó được tạo', 14.5) + box('tip', 'Cùng script chạy như bước cuối của workflow (<code>GH_TOKEN</code> + <code>permissions: actions: read</code>) ⇒ mỗi lần chạy tự ghi đường tới hạn vào Summary.') },

  /* 6 */ { t: 'Sân tập: dời MỘT cạnh needs: — trung vị 124 s → 95 s', body: two(
    gantt([
      ['kiểm CHẶN · kiểm', 0, 39, 'blu', true, 0],
      ['kiểm CHẶN · Windows', 44, 63, 'grn', true, 0],
      ['kiểm CHẶN · công bố', 113, 7, 'blu', true, 0],
      ['song song · kiểm', 0, 47, 'blu', false, 36],
      ['song song · Windows', 0, 83, 'grn', true, 0],
      ['song song · công bố', 89, 10, 'blu', true, 0],
    ], { max: 120, K: 2.85, X0: 190, w: 580, tick: 20, note: 'run 36010873956 (trên) · 36010879542 (dưới)' }),
    `${table(['5 cặp chạy cùng lúc', 'kiểm chặn', 'song song'], [
      ['đồng hồ (s)', '113 · 124 · 117 · <strong>229</strong> · 128', '96 · 99 · 95 · 79 · 76'],
      ['trung vị', '124 s', '+95 s (−23%)'],
      ['máy-giây (trung vị)', '175', '195 — gần như nhau'],
      ['job trên đường', 'kiểm → Windows → công bố', 'Windows → công bố'],
    ], { sm: true })}
     ${box('info', 'Windows nằm trên đường tới hạn ở <strong>10/10</strong> lần — không phải macOS như ở api-backend. Đường tới hạn thuộc về <em>khối việc</em>, không thuộc về nền tảng.')}`) },

  /* 7 */ { t: 'Hai workflow khác nhau đúng một dòng', body: two(
    yaml([['# ch07-do-thi-chuoi.yml', ''], ['dung:', ''], ['  needs: kiem', 'chờ kiểm xong mới dựng'], ['  strategy: { matrix: … }', ''], ['cong-bo:', ''], ['  needs: dung', 'chờ 3 bản dựng']], { fs: 16 }),
    yaml([['# ch07-do-thi-song.yml', ''], ['dung:', ''], ['  # (không needs)', 'dựng ngay từ đầu'], ['  strategy: { matrix: … }', ''], ['cong-bo:', ''], ['  needs: [kiem, dung]', 'kiểm VẪN chặn công bố']], { fs: 16 })) +
    box('good', 'Phép thử của một cạnh <code>needs:</code>: job sau có <strong>DÙNG</strong> đầu ra của job trước không? Bản dựng không đọc gì từ lint ⇒ cạnh ấy là sở thích. Dời cổng tới chỗ thật sự cần nó — bước công bố — thì an toàn giữ nguyên, thời gian thì không.') },

  /* 8 */ { t: 'Bốn hình dạng đồ thị, bốn công thức cho cái sàn', body: table(['Hình dạng', 'Ví dụ', 'Sàn thời gian', 'Đòn bẩy'], [
    ['Không <code>needs:</code>', '<code>ci-lint.yml</code> (2 job độc lập)', '<strong>max</strong>(các job)', 'làm nhanh job dài nhất'],
    ['Chuỗi thẳng', 'lint → test → build → deploy', '<strong>tổng</strong> các job', '!gỡ cạnh không phải phụ thuộc dữ liệu'],
    ['Toả ra rồi gộp', 'desktop-release, sân tập', 'trước + <strong>max</strong>(nhánh) + sau', 'nhánh chậm nhất · cân bằng nhánh'],
    ['Đồng hồ ≫ đường tới hạn', 'job chờ máy (hết suất đồng thời)', 'không phải đồ thị', '-xem hàng đợi, giới hạn 20 job / 5 macOS'],
  ], { sm: true }) + box('info', 'Kiểm tỉnh táo: đồng hồ − đường tới hạn = thời gian chờ máy + bàn giao. Sân tập: 6–15 s. Api-backend: 10 s. Lớn hơn nhiều ⇒ vấn đề nằm ở hàng đợi, không ở YAML.') },

  /* ───── 7.2 ───── */
  /* 9 */ { t: 'Ba cú push, ba cách xử lý: huỷ · xếp · xếp hàng dài', body: baLan() },

  /* 10 */ { t: 'Huỷ là dừng GIỮA bước — và bước dọn dẹp vẫn chạy', body: two(
    t(['# run 36009923442 · cc-huy · commit 1', '2 · day anh (gia lap 40 giay)', 'day anh ... 5 s  (14:02:59)', 'day anh ... 10 s  (14:03:04)', 'day anh ... 15 s  (14:03:09)', 'day anh ... 20 s  (14:03:14)', '! ##[error]The operation was canceled.', '3 · chay migration    → skipped', '4 · don dep (if always)', '+ job.status=cancelled · noi dung cc=commit thu 1', '5 · chi chay khi BI HUY (if cancelled)', '+ run nay bi huy giua chung luc 14:03:19'], 'đẩy ảnh được một nửa, migration chưa chạy', 14),
    `${t(['$ gh api …/check-runs/<id>/annotations', '! Canceling since a higher priority waiting', '!   request for ch07 · cc huy (…)-refs/heads/', '!   ch07-toc-do exists'], 'lý do huỷ nằm ở annotation', 14)}
     ${box('bad', 'Deploy thật mà bị cắt ở đây: ảnh mới đã đẩy, migration chưa chạy ⇒ code mới + schema cũ. Chính là hình dạng sự cố 03/07/2026 (feed 500).')}`) },

  /* 11 */ { t: 'Huỷ không tức thời: tiến trình có 10 giây để dọn', body: thangHuy() },

  /* 12 */ { t: 'Chọn group và cancel-in-progress theo việc, không theo khuôn', body: table(['Workflow làm gì', 'group', 'cancel-in-progress', 'Vì sao'], [
    ['Kiểm PR / push (lint, test)', '<code>&#36;{{ github.workflow }}-&#36;{{ github.ref }}</code>', '+true', 'chỉ commit mới nhất có nghĩa; tiết kiệm máy'],
    ['Deploy lên MỘT máy chủ', '<code>prod-vps</code> — <strong>chung</strong> cho mọi workflow chạm máy đó', '!tuỳ: bước nguy hiểm phải bất biến', 'một lúc một cuộc deploy'],
    ['Phát hành (tải tệp lên release)', '<code>desktop-release</code>', '-false', 'bị cắt ⇒ release dở dang'],
    ['Deploy theo thứ tự, không bỏ bản nào', '<code>production-deploy</code>', '<code>queue: max</code> (tối đa 100 chờ)', 'mới — không đi cùng cancel: true'],
    ['Cron dọn dẹp + chạy tay', '<code>vps-cleanup</code>', '-false', 'lịch và người bấm không chồng nhau'],
  ], { sm: true }) + box('warn', 'Nhóm quá RỘNG (<code>group: ci</code>) ⇒ PR này huỷ PR kia. Nhóm quá HẸP (mỗi workflow một tên) ⇒ hai workflow deploy vẫn chạy song song.') },

  /* 13 */ { t: 'Hai workflow, hai group = KHÔNG có khoá — cơ chế sự cố 06/07', body: two(
    diagram({ w: 600, h: 420, nodes: [
      { id: 'p', x: 190, y: 0, w: 220, h: 64, t: 'push lên main', d: 'sửa src/**', c: 'vio' },
      { id: 'a', x: 0, y: 150, w: 260, h: 80, t: 'deploy-ghcr.yml', d: 'group: deploy-ghcr', c: 'dk', mono: true },
      { id: 'b', x: 340, y: 150, w: 260, h: 80, t: 'backend-vps.yml', d: '(không có group)', c: 'amb', mono: true },
      { id: 'v', x: 150, y: 320, w: 300, h: 80, t: 'VPS · docker compose up', d: 'hai lượt recreate cùng lúc', c: 'red' },
    ], edges: [{ from: 'p', to: 'a' }, { from: 'p', to: 'b' }, { from: 'a', to: 'v', c: 'red' }, { from: 'b', to: 'v', c: 'red' }] }),
    `${t(['# ch07-chung-a.yml và ch07-chung-b.yml', '#   concurrency: { group: ch07-vps-chung-<ref> }', '# MỘT cú push kích cả hai:', 'b: job 14:12:33 → 14:13:06', '+ a: job TẠO 14:13:07 — chờ b xong', '# cùng group ⇒ hai workflow thành một hàng'], 'sân tập · run 36011098857 + 36011098744', 14)}
     ${box('info', 'Api-backend 06/07/2026: container <code>Exited(137)</code> + container mồ côi. Cách vá của repo là bỏ trigger push (chỉ <code>workflow_dispatch</code>). Chương 9 mổ xẻ sự cố; ở đây chỉ cần cơ chế: <strong>group theo TÀI NGUYÊN, không theo tệp</strong>.')}`) },

  /* 14 */ { t: 'concurrency xếp hàng — nó không làm việc thành bất biến', body: two(
    diagram({ w: 560, h: 380, nodes: [
      { id: 'a', x: 0, y: 20, w: 215, h: 80, t: 'lượt A · v0.5.40', d: 'công bố 18:08:17', c: 'grn' },
      { id: 'b', x: 345, y: 20, w: 215, h: 80, t: 'lượt B · v0.5.40', d: 'CHỜ A (đúng luật)', c: 'vio' },
      { id: 'r', x: 150, y: 250, w: 260, h: 90, t: 'release v0.5.40', d: 'B tải ĐÈ lúc 18:15:37', c: 'red' },
    ], edges: [{ from: 'a', to: 'r', t: 'ghi' }, { from: 'b', to: 'r', t: 'ghi đè', c: 'red' }, { from: 'a', to: 'b', t: 'A xong', dash: true }] }),
    `${box('bad', 'Sân tập, <code>queue: max</code>: cả 3 commit đều chạy hết, lần lượt (run 36009923057 → 36009970451 → 36010016184). Nếu mỗi lượt "công bố cùng một số phiên bản" thì bản cuối thắng — âm thầm.')}
     ${box('good', 'Cách vá của repo: script phát hành từ chối khi đang có lượt dựng, và bước <em>"Chặn dựng đè bản đã công bố"</em> hỏi GitHub Releases trước. <strong>Thứ tự</strong> là việc của lịch; <strong>"đã tồn tại chưa"</strong> là câu hỏi trạng thái.')}`) },

  /* 15 */ { t: 'queue: max mới có — và actionlint chưa biết tới nó', body: two(
    yaml([['concurrency:', ''], ["  group: '${{ github.workflow }}-${{ github.ref }}'", ''], ['  queue: max', 'giữ tới 100 run chờ']], { fs: 16 }) +
    t(['$ docker run --rm -v "$PWD":/repo rhysd/actionlint …', '! ch07-cc-hang.yml:12:3: unexpected key "queue" for', '!   "concurrency" section. expected one of', '!   "cancel-in-progress", "group" [syntax-check]', '# GitHub vẫn CHẠY nó: 3 run, 0 run bị huỷ'], 'bộ kiểm lạc hậu hơn nền tảng', 14),
    `${table(['Thiết lập', 'Run đang chạy', 'Run đang chờ khi có run mới'], [
      ['<code>cancel-in-progress: true</code>', '-bị huỷ', 'bị thay'],
      ['<code>false</code> (mặc định)', '+chạy tiếp', '!bị huỷ — chỉ giữ 1 run chờ'],
      ['<code>queue: max</code>', '+chạy tiếp', '+xếp sau, tối đa 100'],
    ], { sm: true })}
     ${box('warn', 'Docs (đọc 24/09/2026): <code>queue: max</code> + <code>cancel-in-progress: true</code> là lỗi kiểm tra workflow. Bộ lint báo sai ≠ workflow sai — kiểm bằng một lần chạy thật.')}`) },

  /* ───── 7.3 ───── */
  /* 16 */ { t: '14 lần chạy CÙNG commit: 37 s tới 77 s', body: cot() },

  /* 17 */ { t: 'Phân rã: ba lần chậm nhất chậm vì ba lý do khác nhau', body: phanRa() },

  /* 18 */ { t: 'Ở mức bước, phương sai nhỏ hơn — trừ bước dùng mạng', body: two(
    table(['Bước (14 lần)', 'min', 'trung vị', 'max', 'max/min'], [
      ['cả lần chạy', '37', '50,5', '77', '<strong>2,08×</strong>'],
      ['các bước (đầu → cuối)', '29', '40', '53', '!1,83×'],
      ['setup-node (cache)', '2', '4', '20', '<strong>10×</strong>'],
      ['npm ci', '11', '15', '17', '1,55×'],
      ['test (CPU thuần)', '9,5', '12,5', '14,2', '1,49×'],
      ['tsc · build', '2', '3', '4', '±1 s'],
      ['xếp hàng (tạo → nhận)', '3', '3', '4', '+ổn định'],
    ], { sm: true, center: [1, 2, 3, 4] }),
    `${kpis([{ v: '3', l: 'dòng CPU khác nhau', c: 'amb' }, { v: '9,5 s', l: 'test trên EPYC 9V74', c: 'grn' }, { v: '14,2 s', l: 'cùng test, Xeon 8370C', c: 'red' }])}
     ${box('info', 'Runner in <code>cpu=4 · AMD EPYC 7763 / EPYC 9V74 / Xeon Platinum 8370C</code>: cùng nhãn <code>ubuntu-24.04</code>, ba loại máy. Bạn không chọn được.')}`) },

  /* 19 */ { t: 'Quy tắc đo: trung vị của nhiều lần, so từng bước', body: steps([
    ['Đo ít nhất 5 lần mỗi bên, <strong>cùng lúc</strong> nếu được', 'hai workflow chạy xen kẽ ⇒ cùng điều kiện mạng/máy (như 5 cặp ở slide 6)'],
    ['So <strong>trung vị</strong>, đừng so TB hay lần nhanh nhất', 'một đuôi 30 s kéo TB lên 52,6 s; trung vị 50,5 s không nhúc nhích'],
    ['Khoản tiết kiệm < ~½ độ trải ⇒ đo ở mức <strong>BƯỚC</strong>', 'độ trải ở đây 40 s; một tối ưu 5 s chỉ thấy được ở bước nó chạm vào'],
    ['Lấy số bằng API, không bằng mắt', '<code>gh api …/runs/&lt;id&gt;/jobs --jq \'.jobs[].steps[] | [.name,.started_at,.completed_at]\'</code>'],
    ['Ghi kèm loại máy', '<code>nproc</code> + <code>/proc/cpuinfo</code> ⇒ tách "máy chậm" khỏi "mã chậm"'],
  ]) },

  /* 20 */ { t: 'Thời lượng là tín hiệu phân loại, trước khi mở log', body: two(
    cards([
      { ic: '⚡', t: 'Ngắn hơn nhiều', d: 'bỏ cuộc sớm — nhìn job ĐẦU (release: 80 s so với 458 s)', c: 'amb' },
      { ic: '⏱', t: 'Quanh mức thường', d: 'chạy tới nơi rồi hỏng — nhìn chỗ DỪNG (334 s)', c: 'blu' },
      { ic: '🐌', t: 'Dài hơn nhiều', d: 'treo / thử lại — <code>timeout-minutes</code> sinh ra cho ca này', c: 'red' },
      { ic: '🧭', t: 'Đồng hồ ≫ bước', d: 'đuôi/khởi động máy — không phải lỗi của bạn, chạy lại', c: 'vio' },
    ], 2),
    `${box('warn', 'Ngưỡng cứng "hỏng nếu &gt; 60 s" trên workflow này sẽ đỏ ở 3/14 lần chạy mà KHÔNG có gì thay đổi. Người ta sẽ học cách lờ nó đi.')}
     ${box('good', 'Muốn canh thoái lui: so trung vị trượt của 10 lần gần nhất với trung vị nền, lề vài độ lệch chuẩn — hoặc canh đúng bước bạn quan tâm.')}`) },

  /* ───── 7.4 ───── */
  /* 21 */ { t: 'Tách ba việc ra ba job: đồng hồ −13%, máy-giây ×2', body: two(
    bars([
      { l: 'một job nối tiếp', sub: 'đồng hồ, trung vị 14 lần', v: 50.5, txt: '50,5 s', c: 'blu' },
      { l: 'ba job song song', sub: 'đồng hồ, trung vị 5 lần', v: 44, txt: '44 s', c: 'grn' },
      { l: 'một job nối tiếp', sub: 'máy-giây', v: 44, txt: '44 máy-giây', c: 'blu' },
      { l: 'ba job song song', sub: 'máy-giây', v: 86, txt: '86 máy-giây', c: 'red' },
    ], { lw: 260, max: 90 }),
    `${box('info', 'Mỗi job mới phải tự checkout + setup-node + <code>npm ci</code> (~15 s). Ba job = trả ba lần. Nhánh dài nhất (test: 13 s + 15 s cài) vẫn quyết định đồng hồ.')}
     ${box('tip', 'Song song hoá chỉ đáng khi phần việc tách ra <strong>lớn hơn nhiều</strong> phần chi phí lặp lại (cài đặt). Kho riêng tư: máy-giây ×2 là hoá đơn ×2.')}`) },

  /* 22 */ { t: 'Bảng xếp hạng: phép tăng tốc nào rơi TRÊN đường tới hạn', body: table(['Phép', 'Đo được', 'Trên đường?', 'Trả về đồng hồ', 'Tốn'], [
    ['gỡ cạnh <code>needs:</code> không phải dữ liệu', '72 s (api) · 29 s (sân tập)', '+có', '+72 s · 29 s (−23%)', 'một dòng YAML'],
    ['làm nhanh job chậm nhất TRÊN đường', 'macOS 437 s: −20%', '+có', '+~87 s', 'công sức thật'],
    ['bước có điều kiện (<code>if:</code>)', '24 s', '+có', '+24 s khi bỏ qua', 'trung bình'],
    ['<code>cache: npm</code> (Ch5, runner)', '3,8 s / job', '!tuỳ job', '0–3,8 s', 'một dòng'],
    ['cache <code>node_modules</code> (Ch5, runner)', '13,9 s / job', '!tuỳ job', '0–13,9 s', 'một khối + khoá chặt'],
    ['làm nhanh bản dựng Linux 50%', '120 s máy', '-không', '-0 s — không giây nào', 'công sức thật'],
    ['tách job cho song song', '−6,5 s đồng hồ', '+có', '+nhỏ', '-máy-giây ×2'],
  ], { sm: true }) + box('warn', 'Bài 7.4 cũ ghi cache <code>node_modules</code> "4,1 s, dấu chưa biết" — Chương 5 đã đo lại trên runner: <strong>lãi 13,9 s</strong>. Nhưng vẫn là 0 s nếu job đó có độ chùng.') },

  /* 23 */ { t: 'Nhân với tần suất: workflow chạy nhiều mới là workflow đắt', body: two(
    table(['Workflow (api-backend)', 'lần chạy', 'TB', 'tổng'], [
      ['<code>ci-lint</code>', '526', '141 s', '!~20,6 giờ'],
      ['<code>desktop-release</code>', '85', '458 s', '~10,8 giờ'],
    ], { sm: true }) + box('info', '10 s bớt trên <code>ci-lint</code> = 526 × 10 s ≈ 88 phút người chờ. 2 phút bớt trên release = 85 × 120 s ≈ 170 phút — nhưng không ai NGỒI chờ release.'),
    box('tip', '<strong>Định luật Amdahl</strong>: tăng tốc một phần chỉ lợi theo TỈ PHẦN của phần ấy. Job ngoài đường tới hạn có tỉ phần 0. Workflow chạy hiếm có trọng số nhỏ.<br><br>Công thức xếp hạng thực dụng:<br><code>giá trị = giây bớt trên đường tới hạn × số lần chạy × (có người chờ? 1 : ~0)</code>')) },

  /* 24 */ { t: 'Thứ tự làm việc khi ai đó nói "CI chậm quá"', body: steps([
    ['Đo phân bố: 5–10 lần, trung vị, loại máy', 'không có phân bố thì không biết "chậm" là thật hay là đuôi 30 s'],
    ['Đọc đường tới hạn (script / <code>gh api</code>)', 'liệt kê job TRÊN chuỗi; mọi job khác được phép chậm'],
    ['Gỡ cạnh <code>needs:</code> không phải phụ thuộc dữ liệu', 'miễn phí: không đổi mã, không thêm máy-giây'],
    ['Đánh vào job chậm nhất trên đường, theo từng bước', 'bước nào đắt? cài / dựng / test / tải artifact — mỗi thứ một cách vá'],
    ['Rồi mới cache, <code>if:</code>, tách job', 'đo lại bằng phân bố; ghi số trước/sau vào PR'],
  ]) },

  /* ───── 7.5 ───── */
  /* 25 */ { t: 'Giá mỗi phút (09/2026): macOS đắt gấp ~10 lần Linux', body: two(
    table(['Runner tiêu chuẩn', '$/phút', 'so với Linux'], [
      ['Linux 2 nhân (x64)', '$0,006', '1×'],
      ['Windows 2 nhân (x64)', '$0,010', '1,7×'],
      ['macOS 3–4 nhân (M1/Intel)', '!$0,062', '!~10,3×'],
      ['Kho CÔNG KHAI, runner tiêu chuẩn', '+miễn phí', '—'],
      ['Runner tự vận hành', '+miễn phí (tính đến 09/2026)', 'bạn trả máy + bảo trì'],
    ], { sm: true }),
    `${table(['Gói (kho riêng tư)', 'phút kèm / tháng', 'artifact'], [
      ['Free', '2.000', '500 MB'], ['Pro', '3.000', '1 GB'], ['Team', '3.000', '2 GB'], ['Enterprise Cloud', '50.000', '50 GB'],
    ], { sm: true })}
     ${box('warn', 'Làm tròn LÊN phút theo <strong>từng job</strong>: job 5 giây vẫn là 1 phút. Nhiều job ngắn ⇒ trả nhiều phút lẻ. Nguồn: docs.github.com, đọc 24/09/2026.')}`) },

  /* 26 */ { t: 'Nếu kho riêng tư: 76% tiền nằm ở workflow phát hành', body: two(
    bars([
      { l: 'macOS 437 s → 8 phút', sub: '× $0,062', v: 0.496, txt: '$0,496', c: 'red' },
      { l: 'Windows 323 s → 6 phút', sub: '× $0,010', v: 0.06, txt: '$0,060', c: 'amb' },
      { l: 'Linux 72+241+34 s → 8 phút', sub: '× $0,006 (làm tròn từng job)', v: 0.048, txt: '$0,048', c: 'grn' },
    ], { lw: 300, max: 0.5 }),
    `${table(['Ước lượng cả lịch sử', 'lần', '$/lần', 'tổng'], [
      ['desktop-release', '85', '$0,604', '!$51,3'],
      ['ci-lint (5 phút Linux)', '526', '$0,030', '$15,8'],
      ['cộng', '', '', '$67,1'],
    ], { sm: true })}
     ${box('info', 'Nhánh macOS = <strong>82%</strong> một lần phát hành, <strong>63%</strong> tổng. Chỉ là ước lượng (thời lượng TB × giá niêm yết) — kho thật công khai nên hoá đơn = $0.')}`) },

  /* 27 */ { t: 'Phía bên kia cán cân: cú hỏng chỉ CI thấy', body: two(
    t(['# api-backend · run 32399243354 · job "Dựng macOS"', '> vite build', '54597 ms: Scavenge … 2027.5 (2084.4) -> 2027.1 MB', '! FATAL ERROR: Reached heap limit Allocation failed', '!   - JavaScript heap out of memory', '! ##[error]Process completed with exit code 134.', '# theo ghi chép: máy người viết dựng XANH commit ấy', '# bài 1.5: 147/200 commit trên main (73,5%)', '#   không kích hoạt CI nào khi push'], 'CI bắt được nhờ chạy trên máy KHÁC', 14.5),
    `${box('good', 'Giá trị của CI không phải tốc độ: là chạy cùng commit ở <strong>một máy khác máy đã đồng ý với bạn</strong>.')}
     ${box('tip', 'Thay đổi đáng tiền nhất chương này tìm ra: một bản dựng <code>desktop/</code> chỉ-Linux ở mỗi push (~$0,006/phút, 149 s) — thay vì chờ tới lúc phát hành trên macOS ($0,062/phút).')}
     ${box('warn', 'Trước khi cắt một job vì "chậm": tìm lần gần nhất nó bắt được lỗi. Chưa từng bắt gì trong một năm mới là lý do.')}`) },

  /* 28 */ { t: 'Sai lầm hay gặp ở Chương 7', body: cards([
    { ic: '🎯', t: 'Tối ưu job có độ chùng', d: 'Linux −50% = 0 s đồng hồ. Đọc đường tới hạn trước.', c: 'amb' },
    { ic: '🔗', t: 'needs: cho "ngăn nắp"', d: 'Mỗi cạnh cộng trọn job trước vào MỌI lần chạy.', c: 'red' },
    { ic: '✂️', t: 'cancel: true trên deploy', d: 'Cắt giữa bước: ảnh mới + schema cũ.', c: 'ora' },
    { ic: '🧩', t: 'Mỗi workflow một group', d: 'Hai workflow deploy cùng máy vẫn đua nhau.', c: 'vio' },
    { ic: '🎲', t: 'Đo một lần rồi kết luận', d: '37–77 s trên cùng commit. So trung vị, so bước.', c: 'blu' },
    { ic: '🔁', t: 'Tin concurrency = bất biến', d: 'Xếp hàng rồi ghi đè vẫn sai. Kiểm trạng thái.', c: 'pnk' },
  ], 3) },

  /* 29 */ { t: 'Bảng tra nhanh Chương 7', body: table(['Muốn', 'Viết / làm'], [
    ['Đường tới hạn của một run', '<code>node ch07/duong-toi-han.mjs &lt;run_id&gt; [owner/repo]</code> · hoặc <code>gh api …/runs/&lt;id&gt;/jobs</code>'],
    ['Thời gian từng bước', '<code>gh run view &lt;id&gt; --json jobs --jq \'.jobs[].steps[] | [.name,.startedAt,.completedAt]\'</code>'],
    ['PR: chỉ giữ lần chạy mới nhất', '<code>group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}</code> + <code>cancel-in-progress: true</code>'],
    ['Deploy/phát hành: không bỏ dở', '<code>cancel-in-progress: false</code> · không bỏ bản nào: <code>queue: max</code>'],
    ['Nhiều workflow cùng chạm một máy', 'CÙNG một tên <code>group</code> trong mọi workflow ấy'],
    ['Chỉ khoá job deploy', '<code>jobs.&lt;id&gt;.concurrency</code>'],
    ['Dọn khi bị huỷ', '<code>if: always()</code> / <code>if: cancelled()</code> — có ~10 s trước khi bị giết'],
    ['Thời lượng + hoá đơn', '<code>gh api repos/{o}/{r}/actions/runs/&lt;id&gt;/timing</code>'],
  ], { sm: true }) },

  /* 30 */ { t: 'Thực hành Chương 7 (45 phút) trên kho của chính bạn', body: two(list([
    '<strong>1.</strong> Chạy script đường tới hạn trên 3 run gần nhất của workflow nhiều job nhất; ghi job trên đường và độ chùng.',
    '<strong>2.</strong> Tìm một cạnh <code>needs:</code> không phải phụ thuộc dữ liệu; tạo bản song song; chạy 5 cặp cùng lúc; so trung vị.',
    '<strong>3.</strong> Thêm <code>concurrency</code> cho workflow kiểm PR; đẩy 3 commit liên tiếp; chụp annotation "Canceling since…".',
    '<strong>4.</strong> Chạy lại một workflow 10 lần; lập bảng min/trung vị/max cho lần chạy và cho 3 bước.',
    '<strong>5.</strong> Tính giá một lần chạy nếu kho riêng tư (làm tròn từng job, giá 09/2026).',
  ]), box('good', '<strong>Đạt khi</strong> bạn có: đường tới hạn của 3 run; hai trung vị (trước/sau gỡ cạnh); ảnh chụp run bị huỷ + lý do; bảng phương sai 10 lần; một con số $ mỗi lần chạy.<br><br>Soi: <code>gh run list --workflow &lt;tệp&gt; --json databaseId,conclusion,createdAt,updatedAt</code>.')) },
]);
