/**
 * csd-cs1.mjs — CSD201 ⭐ Chuyên sâu 1: TÌM KIẾM NHỊ PHÂN VÀ CÁC BIẾN THỂ (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs1.mjs --out <dir>
 *
 * Mọi bảng lo/mid/hi, mọi con số (số vòng, giá trị trả về, PASS/FAIL) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs1/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs1', code: 'CS1', title: 'Tìm kiếm nhị phân và các biến thể', sub: 'CSD201 · ⭐ Chuyên sâu' };

/* ───────────── SVG: mảng ô ───────────── */
const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff' };

/**
 * Mảng ô có chỉ số. opt: { w (rộng ô), fill: {i: 'do'|'xanh'|'cam'|'xam'}, ptr: [[i, 'lo', 'tren'|'duoi', màu]], mo: [từ, tới] (làm mờ ngoài đoạn) }
 */
function mang(vals, { w = 62, h = 46, fill = {}, ptr = [], mo = null, chiSo = true, nhan = '' } = {}) {
  const x0 = nhan ? 70 : 6, y0 = 30;
  let s = '';
  if (nhan) s += `<text x="0" y="${y0 + h / 2 + 7}" font-size="19" font-weight="700" fill="${MAU.nau}">${nhan}</text>`;
  vals.forEach((v, i) => {
    const f = fill[i];
    const mờ = mo && (i < mo[0] || i > mo[1]);
    s += `<g opacity="${mờ ? 0.32 : 1}"><rect x="${x0 + i * w}" y="${y0}" width="${w}" height="${h}" fill="${f ? NEN[f] : NEN.trang}" stroke="${f === 'do' ? MAU.do : MAU.vien}" stroke-width="${f === 'do' ? 3 : 1.5}"/>`;
    const col = f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : '#262626';
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h / 2 + 7}" text-anchor="middle" font-size="21" font-weight="700" fill="${col}">${v}</text></g>`;
    if (chiSo) s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h + 19}" text-anchor="middle" font-size="15" fill="#8c8c8c">${i}</text>`;
  });
  // con trỏ: phía trên ô
  const dem = {};
  for (const [i, t, mau = MAU.nau] of ptr) {
    const k = dem[i] = (dem[i] || 0) + 1;
    const cx = x0 + i * w + w / 2;
    const y = y0 - 8 - (k - 1) * 0; // cùng ô: ghép chữ
    s += `<text x="${cx + (k - 1) * 0}" y="${y - (k - 1) * 20}" text-anchor="middle" font-size="17" font-weight="800" fill="${mau}">${t}</text>`;
  }
  const W = x0 + vals.length * w + 6, H = y0 + h + (chiSo ? 26 : 8);
  return `<svg viewBox="0 ${-Math.max(0, ...Object.values(dem).map((k) => (k - 1) * 20))} ${W} ${H + Math.max(0, ...Object.values(dem).map((k) => (k - 1) * 20))}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;

/* ───────────── sơ đồ riêng ───────────── */
// slide 2: chia đôi 16 → 8 → 4 → 2 → 1
function chiaDoi() {
  const rows = [16, 8, 4, 2, 1];
  let s = '';
  rows.forEach((n, r) => {
    const y = 8 + r * 44;
    for (let i = 0; i < 16; i++) {
      const on = i >= 16 - n - (r === 0 ? 0 : 0) && i < 16 ? (i >= 5 && i < 5 + n) || r === 0 : false;
      const inRange = r === 0 ? true : (i >= 5 && i < 5 + n);
      s += `<rect x="${110 + i * 34}" y="${y}" width="30" height="32" rx="3" fill="${inRange ? (r === 4 ? NEN.do : NEN.cam) : NEN.xam}" stroke="${inRange ? (r === 4 ? MAU.do : MAU.cam) : '#d9d9d9'}" stroke-width="${inRange ? 2 : 1}"/>`;
      void on;
    }
    s += `<text x="0" y="${y + 23}" font-size="18" font-weight="700" fill="${MAU.nau}">vòng ${r + 1}</text>`;
    s += `<text x="${110 + 16 * 34 + 12}" y="${y + 23}" font-size="18" fill="#404040">còn <tspan font-weight="800">${n}</tspan></text>`;
  });
  return `<svg viewBox="0 0 740 226" width="600" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 7 / 15: dải F…F T…T với lo, hi
function daiFT({ n = 8, firstT = 4, lo = null, hi = null, nhanO = null, w = 60, ghi = '' } = {}) {
  let s = '';
  const x0 = 8, y0 = 34;
  for (let i = 0; i < n; i++) {
    const t = i >= firstT;
    s += `<rect x="${x0 + i * w}" y="${y0}" width="${w}" height="46" fill="${t ? NEN.xanh : NEN.do}" stroke="${t ? MAU.xanh : MAU.do}" stroke-width="1.8"/>`;
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + 30}" text-anchor="middle" font-size="22" font-weight="800" fill="${t ? MAU.xanh : MAU.do}">${t ? 'T' : 'F'}</text>`;
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + 66}" text-anchor="middle" font-size="15" fill="#8c8c8c">${nhanO ? nhanO[i] : i}</text>`;
  }
  const mui = (i, t) => `<text x="${x0 + i * w + w / 2}" y="24" text-anchor="middle" font-size="18" font-weight="800" fill="${MAU.nau}">${t}</text>`;
  if (lo !== null) s += mui(lo, 'lo');
  if (hi !== null) s += hi === n ? `<text x="${x0 + n * w + 18}" y="${y0 + 30}" font-size="18" font-weight="800" fill="${MAU.nau}">hi</text>` : mui(hi, 'hi');
  if (ghi) s += `<text x="${x0 + firstT * w}" y="${y0 + 90}" font-size="16" font-weight="700" fill="${MAU.xanh}">${ghi}</text>`;
  return `<svg viewBox="0 0 ${x0 + n * w + 46} ${ghi ? 132 : 108}" width="${x0 + n * w + 46}" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 11/12: mảng xoay dạng cột
function cotXoay(vals, { mid = null, hl = [] } = {}) {
  const W = 58, base = 190, k = 5.2;
  let s = `<line x1="0" y1="${base}" x2="${vals.length * W + 10}" y2="${base}" stroke="#8c8c8c" stroke-width="1.5"/>`;
  vals.forEach((v, i) => {
    const hh = v * k, x = 8 + i * W;
    const left = i < vals.indexOf(Math.min(...vals));
    const col = hl.includes(i) ? MAU.do : left ? MAU.cam : MAU.xanh;
    s += `<rect x="${x}" y="${base - hh}" width="${W - 12}" height="${hh}" fill="${col}" opacity="${hl.includes(i) ? 1 : 0.75}"/>`;
    s += `<text x="${x + (W - 12) / 2}" y="${base - hh - 7}" text-anchor="middle" font-size="17" font-weight="700" fill="#262626">${v}</text>`;
    s += `<text x="${x + (W - 12) / 2}" y="${base + 20}" text-anchor="middle" font-size="15" fill="#8c8c8c">${i}</text>`;
    if (mid === i) s += `<text x="${x + (W - 12) / 2}" y="${base + 40}" text-anchor="middle" font-size="16" font-weight="800" fill="${MAU.do}">mid</text>`;
  });
  return `<svg viewBox="0 0 ${vals.length * W + 16} ${base + 44}" width="${vals.length * W + 16}" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 13: đồ thị đường tìm đỉnh
function doThiDinh() {
  const v = [1, 3, 5, 4, 2, 6, 8, 7], W = 66, base = 176, k = 19;
  const px = (i) => 40 + i * W, py = (x) => base - x * k;
  let s = `<line x1="10" y1="${base}" x2="${px(7) + 40}" y2="${base}" stroke="#bfbfbf"/>`;
  s += `<polyline points="${v.map((x, i) => `${px(i)},${py(x)}`).join(' ')}" fill="none" stroke="${MAU.cam}" stroke-width="3"/>`;
  v.forEach((x, i) => {
    const peak = i === 2 || i === 6;
    s += `<circle cx="${px(i)}" cy="${py(x)}" r="${peak ? 9 : 6}" fill="${peak ? MAU.do : MAU.nau}"/>`;
    s += `<text x="${px(i)}" y="${py(x) - 14}" text-anchor="middle" font-size="17" font-weight="700" fill="${peak ? MAU.do : '#262626'}">${x}</text>`;
    s += `<text x="${px(i)}" y="${base + 20}" text-anchor="middle" font-size="15" fill="#8c8c8c">${i}</text>`;
  });
  s += `<text x="${px(0) - 30}" y="${base - 4}" font-size="14" fill="#8c8c8c">−∞</text><text x="${px(7) + 20}" y="${base - 4}" font-size="14" fill="#8c8c8c">−∞</text>`;
  return `<svg viewBox="0 -18 560 ${base + 46}" width="520" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 14: ma trận bậc thang
function maTran() {
  const g = [[1, 4, 7, 11], [2, 5, 8, 12], [3, 6, 9, 16], [10, 13, 14, 17]];
  const path9 = ['0,3', '0,2', '1,2', '2,2'];
  const C = 62;
  let s = '';
  g.forEach((row, r) => row.forEach((v, c) => {
    const on = path9.includes(`${r},${c}`), end = r === 2 && c === 2;
    s += `<rect x="${30 + c * C}" y="${24 + r * C}" width="${C}" height="${C}" fill="${end ? NEN.do : on ? NEN.cam : '#fff'}" stroke="${end ? MAU.do : MAU.vien}" stroke-width="${end ? 3 : 1.5}"/>`;
    s += `<text x="${30 + c * C + C / 2}" y="${24 + r * C + C / 2 + 7}" text-anchor="middle" font-size="21" font-weight="700" fill="${end ? MAU.do : '#262626'}">${v}</text>`;
  }));
  const ctr = (r, c) => [30 + c * C + C / 2, 24 + r * C + C / 2];
  const seg = [['0,3', '0,2'], ['0,2', '1,2'], ['1,2', '2,2']];
  for (const [a, b] of seg) {
    const [x1, y1] = ctr(...a.split(',').map(Number)), [x2, y2] = ctr(...b.split(',').map(Number));
    const dx = Math.sign(x2 - x1) * 18, dy = Math.sign(y2 - y1) * 18;
    s += `<line x1="${x1 + dx}" y1="${y1 + dy}" x2="${x2 - dx}" y2="${y2 - dy}" stroke="${MAU.do}" stroke-width="3" marker-end="url(#mr)"/>`;
  }
  s += `<text x="${30 + 3 * C + C / 2}" y="16" text-anchor="middle" font-size="15" font-weight="800" fill="${MAU.nau}">bắt đầu</text>`;
  return `<svg viewBox="0 0 310 280" width="300" font-family="Arial, sans-serif"><defs><marker id="mr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="${MAU.do}"/></marker></defs>${s}</svg>`;
}

// slide 15: trục đáp án
function trucDapAn() {
  const x0 = 60, x1 = 1000, y = 70;
  const sx = (c) => x0 + (c - 8) / (35 - 8) * (x1 - x0);
  let s = `<rect x="${sx(8)}" y="${y - 22}" width="${sx(14) - sx(8)}" height="44" fill="${NEN.do}" stroke="${MAU.do}" stroke-width="1.5"/>`;
  s += `<rect x="${sx(14)}" y="${y - 22}" width="${sx(35) - sx(14)}" height="44" fill="${NEN.xanh}" stroke="${MAU.xanh}" stroke-width="1.5"/>`;
  s += `<text x="${(sx(8) + sx(14)) / 2}" y="${y + 7}" text-anchor="middle" font-size="19" font-weight="800" fill="${MAU.do}">F: không kịp</text>`;
  s += `<text x="${(sx(14) + sx(35)) / 2}" y="${y + 7}" text-anchor="middle" font-size="19" font-weight="800" fill="${MAU.xanh}">T: kịp trong D ngày</text>`;
  for (const c of [8, 11, 13, 14, 21, 35]) {
    s += `<line x1="${sx(c)}" y1="${y + 22}" x2="${sx(c)}" y2="${y + 32}" stroke="#595959" stroke-width="1.5"/>`;
    s += `<text x="${sx(c)}" y="${y + 50}" text-anchor="middle" font-size="16" fill="${c === 14 ? MAU.do : '#595959'}" font-weight="${c === 14 ? 800 : 400}">${c}</text>`;
  }
  s += `<text x="${sx(8)}" y="${y - 32}" text-anchor="middle" font-size="16" font-weight="800" fill="${MAU.nau}">lo = max = 8</text>`;
  s += `<text x="${sx(35)}" y="${y - 32}" text-anchor="middle" font-size="16" font-weight="800" fill="${MAU.nau}">hi = tổng = 35</text>`;
  s += `<text x="${sx(14)}" y="${y - 32}" text-anchor="middle" font-size="16" font-weight="800" fill="${MAU.do}">đáp án 14</text>`;
  return `<svg viewBox="0 0 1060 130" width="100%" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('TÌM KIẾM NHỊ PHÂN VÀ CÁC BIẾN THỂ', [
  /* 1 */
  { cover: true, t: 'Tìm kiếm nhị phân và các biến thể', sub: 'Bất biến · lower/upper bound · mảng xoay · đỉnh · ma trận · tìm trên đáp án · số thực · TreeMap<br>CSD201 · Java 8 — mọi bảng lo/mid/hi đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Vì sao tìm nhị phân là O(log n)?', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>${chiaDoi()}
<ul style="font-size:22px;margin-top:6px">
<li>Mỗi vòng so với <b>phần tử giữa</b> rồi <b>bỏ một nửa</b></li>
<li>n → n/2 → n/4 → … → 1: số vòng ≈ <b>log₂ n</b></li>
<li>Xấu nhất đúng <b class="do">⌊log₂ n⌋ + 1</b> vòng (đo thật n = 1…2000: PASS)</li>
</ul></div><div>${bang([
    ['1.000', '10'], ['1.000.000', '20'], ['1.000.000.000', '30'], ['4.000.000.000', '32'],
  ], ['n phần tử', 'Số vòng tối đa'])}
${o('<b>Hai điều kiện:</b> dữ liệu <b>đã sắp</b> và lấy phần tử thứ i trong <b>O(1)</b> (mảng). Danh sách liên kết: đi tới giữa đã mất O(n).', 'xanh')}
<p class="nho">Bài trường 0.D (slide 37) đã có bản cơ bản; deck này đi tiếp: bẫy, khuôn, biến thể, bài phỏng vấn.</p></div></div>` },

  /* 3 */
  { t: 'Cài đặt chuẩn: đoạn đóng [lo, hi]', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`static int search(int[] a, int key) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {             // đoạn còn phần tử
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == key) return mid;
        if (a[mid] < key) lo = mid + 1;
        else              hi = mid - 1;
    }
    return -1;                     // lo = hi + 1
}`, 'java')}
${o('<b>Bất biến:</b> nếu key có trong mảng thì nó nằm trong <b>[lo, hi]</b>. Mỗi nhánh loại hẳn <code>mid</code> ⇒ đoạn luôn co lại.')}</div>
<div>${mang([-7, -3, 0, 4, 9, 15, 21, 30, 42], { w: 56, fill: { 6: 'xanh' } })}
${bang([
    ['21', '0', '8', '4', '9', 'lo = 5'], ['', '5', '8', '6', '<b class="do">21</b>', 'trả về 6'],
    ['5', '0', '8', '4', '9', 'hi = 3'], ['', '0', '3', '1', '−3', 'lo = 2'], ['', '2', '3', '2', '0', 'lo = 3'], ['', '3', '3', '3', '4', 'lo = 4 &gt; hi → −1'],
  ], ['key', 'lo', 'hi', 'mid', 'a[mid]', 'Bước'], 'font-size:18px;margin-top:6px')}
<p class="nho">Test biên đều PASS: mảng rỗng, 1 phần tử, đầu, cuối, nhỏ hơn min, lớn hơn max, 2000 mảng ngẫu nhiên có trùng &amp; số âm.</p></div></div>` },

  /* 4 */
  { t: 'Bẫy 1: tràn số khi tính mid', body: `<div class="hai"><div>${code(`int lo = 1500000000, hi = 2000000000;
(lo + hi) / 2        // -397483648  ✗
lo + (hi - lo) / 2   // 1750000000  ✓
(lo + hi) >>> 1      // 1750000000  ✓`, 'java')}
<ul style="font-size:21px;margin-top:10px">
<li><code>int</code> tối đa <b>2.147.483.647</b>; tổng thật 3,5 tỉ ⇒ <b class="do">tràn thành số âm</b></li>
<li><code>hi - lo</code> không bao giờ tràn khi 0 ≤ lo ≤ hi</li>
<li><code>&gt;&gt;&gt; 1</code>: dịch phải <b>không dấu</b> — coi tổng như số 32 bit không âm</li>
</ul></div>
<div>${o('<b>Chạy thật</b> trên "mảng ảo" a[i] = i dài 2³¹ − 1, tìm 2.000.000.000:', '')}
${out(`buggy: loop 2: lo = 1073741824,
       hi = 2147483646
       -> mid = -536870913
       -> ArrayIndexOutOfBoundsException
fixed: found at 2000000000
       after 31 loops`)}
${o('<b>Chuyện thật:</b> Joshua Bloch (2006) — bản <code>Arrays.binarySearch</code> của JDK mang đúng lỗi này <b>khoảng 9 năm</b> mới lộ. JDK nay dùng <code>(low + high) &gt;&gt;&gt; 1</code>.', 'do2')}</div></div>` },

  /* 5 */
  { t: 'Bẫy 2: vòng lặp vô hạn khi cập nhật sai biên', body: `<div class="hai"><div>${code(`// chỉ số CUỐI có a[i] <= key
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;  // làm tròn XUỐNG
    if (a[mid] <= key) lo = mid;   // giữ mid
    else               hi = mid - 1;
}`, 'java')}
${o('Khi <b>hi = lo + 1</b>: mid làm tròn xuống = lo; nếu <code>a[mid] &lt;= key</code> thì <code>lo = mid</code> = lo cũ ⇒ <b class="do">không nhích</b>.', 'do2')}
${o('<b>Sửa:</b> <code>mid = lo + (hi - lo + 1) / 2</code> (làm tròn <b>LÊN</b>). Luật: <b>lo = mid ⇒ làm tròn lên</b>; <b>hi = mid ⇒ làm tròn xuống</b>.', 'xanh')}</div>
<div>${mang([1, 3, 5, 7, 9], { w: 62, fill: { 3: 'do', 4: 'cam' }, ptr: [[3, 'lo=mid'], [4, 'hi']] })}
${bang([
    ['xuống', '0', '4', '2', '5', 'lo = 2'], ['', '2', '4', '3', '7', 'lo = 3'], ['', '3', '4', '<b class="do">3</b>', '7', '<b class="do">lo = 3 (kẹt)</b>'], ['', '3', '4', '<b class="do">3</b>', '7', '<b class="do">… mãi mãi</b>'],
    ['lên', '2', '4', '3', '7', 'lo = 3'], ['', '3', '4', '<b>4</b>', '9', 'hi = 3 → trả 3 ✓'],
  ], ['mid', 'lo', 'hi', 'mid', 'a[mid]', 'key = 8'], 'font-size:18px;margin-top:4px')}
<p class="nho">Bản làm tròn lên: PASS trên 3000 mảng ngẫu nhiên (trùng, âm, 1 phần tử).</p></div></div>` },

  /* 6 */
  { t: 'Bẫy 3: &lt; hay &lt;= ? — ghép đúng kiểu đoạn', body: `${bang([
    ['V1', '<b>[lo, hi]</b> đóng · hi = n − 1', '<code>lo &lt;= hi</code>', '<code>hi = mid − 1</code>', '<b style="color:#2f7d4f">PASS</b>'],
    ['V2', '[lo, hi] đóng · hi = n − 1', '<code class="do">lo &lt; hi</code>', 'hi = mid − 1', '<b class="do">19 sai</b> — bỏ sót ô cuối lo = hi'],
    ['V3', '[lo, hi) nửa mở · hi = n', '<code class="do">lo &lt;= hi</code>', 'hi = mid', '<b class="do">36 treo + 18 văng</b> ArrayIndexOutOfBounds'],
    ['V4', '<b>[lo, hi)</b> nửa mở · hi = n', '<code>lo &lt; hi</code>', '<code>hi = mid</code>', '<b style="color:#2f7d4f">PASS</b>'],
  ], ['', 'Kiểu đoạn', 'Điều kiện lặp', 'Cập nhật hi', 'Kết quả (90 phép tìm, n = 0…8)'])}
<div class="hai" style="margin-top:6px">${o('<b>Một quyết định, ba chỗ phải khớp:</b> giá trị khởi tạo của hi, điều kiện lặp, cách cập nhật hi. Chọn kiểu đoạn TRƯỚC, rồi suy ra ba chỗ đó — đừng sửa lẻ từng dấu.')}
${o('<b>Mẹo nhớ:</b> đoạn đóng thì <code>lo == hi</code> vẫn còn 1 phần tử ⇒ <code>&lt;=</code>. Đoạn nửa mở thì <code>lo == hi</code> là rỗng ⇒ <code>&lt;</code>.', 'xanh')}</div>
<p class="nho">Số liệu: chương trình LtVsLe chạy mọi khoá có/không có trên mảng 0, 2, 4, … kích thước 0…8; "treo" = quá 64 vòng.</p>` },

  /* 7 */
  { t: 'Khuôn bất biến: tìm T đầu tiên', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
<p style="font-size:21px">Mảng {2, 4, 4, 7, 9, 12, 15, 20}, câu hỏi <code>ok(i) = a[i] &gt;= 9</code>:</p>
${daiFT({ n: 8, firstT: 4, lo: 3, hi: 4, w: 56 })}
${bang([['0', '8', '4', 'T', 'hi = 4'], ['0', '4', '2', 'F', 'lo = 3'], ['3', '4', '3', 'F', 'lo = 4 = hi → <b class="do">4</b>']], ['lo', 'hi', 'mid', 'ok', 'Bước'], 'font-size:18px')}
${o('<b>Bất biến</b> (kiểm sau MỌI vòng: PASS): mọi ô <b>trước lo là F</b>, mọi ô <b>từ hi trở đi là T</b>. Dừng khi lo = hi ⇒ đó là T đầu tiên.', 'xanh')}</div>
<div>${code(`// ok() dạng F..F T..T trên [lo, hi)
// trả về T đầu tiên, hoặc hi nếu không có
int firstTrue(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (ok(mid)) hi = mid;   // đáp án <= mid
        else lo = mid + 1;       // đáp án > mid
    }
    return lo;
}`, 'java')}
<ul style="font-size:20px;margin-top:8px">
<li>Không có T → trả <b>n</b>; toàn T → <b>0</b>; đoạn rỗng → lo</li>
<li>Mọi biến thể = <b>chọn đúng ok()</b>: lower bound, upper bound, căn bậc hai, chở hàng, Koko…</li>
</ul></div></div>` },

  /* 8 */
  { t: 'Lower bound: phần tử đầu tiên ≥ x', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${mang([1, 3, 3, 3, 5, 8, 8, 13], { w: 60, fill: { 1: 'xanh' }, ptr: [[1, 'lower(3)', MAU.xanh], [4, 'upper(3)', MAU.do]] })}
${bang([['0', '8', '4', '5', '5 ≥ 3 → hi = 4'], ['0', '4', '2', '3', '3 ≥ 3 → hi = 2'], ['0', '2', '1', '3', '3 ≥ 3 → hi = 1'], ['0', '1', '0', '1', '1 &lt; 3 → lo = 1'], ['1', '1', '', '', 'dừng → <b class="do">1</b>']], ['lo', 'hi', 'mid', 'a[mid]', 'lowerBound(3)'], 'font-size:18px;margin-top:4px')}</div>
<div>${code(`int lowerBound(int[] a, int x) {
    int lo = 0, hi = a.length;     // [lo, hi)
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= x) hi = mid;
        else             lo = mid + 1;
    }
    return lo;                     // n nếu không có
}`, 'java')}
<ul style="font-size:21px;margin-top:8px">
<li>= <b>vị trí chèn</b> x mà mảng vẫn sắp (đứng trước các bản trùng)</li>
<li>x = 4 → 4 · x = 0 → 0 · x = 99 → <b>8 = n</b> · mảng rỗng → 0</li>
<li>Đúng khuôn T đầu tiên với <code>ok(i) = a[i] &gt;= x</code></li>
</ul></div></div>` },

  /* 9 */
  { t: 'Upper bound · đếm số lần · vị trí đầu/cuối', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Upper bound = đầu tiên <b class="do">&gt;</b> x — chỉ đổi <code>&gt;=</code> thành <code>&gt;</code>:</p>
${bang([['0', '8', '4', '5', '5 &gt; 3 → hi = 4'], ['0', '4', '2', '3', '3 ≤ 3 → lo = 3'], ['3', '4', '3', '3', '3 ≤ 3 → lo = 4'], ['4', '4', '', '', 'dừng → <b class="do">4</b>']], ['lo', 'hi', 'mid', 'a[mid]', 'upperBound(3)'], 'font-size:18px')}
${out(`count(3) = U - L = 3, first = 1, last = 3
x = 4: lower = 4, upper = 4 -> count 0
PASS 5000 random arrays (empty, dup, neg)`, 'font-size:15px;margin-top:10px')}</div>
<div>${bang([
    ['Số lần x xuất hiện', '<code>upper(x) − lower(x)</code>'],
    ['Vị trí <b>đầu</b> của x', '<code>L = lower(x)</code>, có nếu <code>L &lt; n &amp;&amp; a[L] == x</code>'],
    ['Vị trí <b>cuối</b> của x', '<code>upper(x) − 1</code> (khi count &gt; 0)'],
    ['Số phần tử &lt; x', '<code>lower(x)</code>'],
    ['Số phần tử trong [l, r]', '<code>upper(r) − lower(l)</code>'],
    ['Phần tử lớn nhất ≤ x', '<code>a[upper(x) − 1]</code> nếu upper &gt; 0'],
  ], ['Câu hỏi', 'Trả lời bằng bound'], 'font-size:19px')}
${o('Hai lần O(log n) thay vì quét O(k) các bản trùng. C++ có sẵn <code>lower_bound/upper_bound</code>; Java thì <b>tự viết</b> (hoặc TreeMap, slide 21).', 'xanh')}</div></div>` },

  /* 10 */
  { t: 'Arrays.binarySearch &amp; Collections.binarySearch', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>${bang([
    ['<code>a, 30</code>', '<b>2</b>', 'tìm thấy ở chỉ số 2'],
    ['<code>a, 35</code>', '<b class="do">−4</b>', 'không có, chèn tại −(−4) − 1 = 3'],
    ['<code>a, 5</code>', '<b class="do">−1</b>', 'không có, chèn tại 0'],
    ['<code>a, 60</code>', '<b class="do">−6</b>', 'không có, chèn tại 5 = n'],
    ['<code>a, 1, 4, 45</code>', '−5', 'chỉ tìm trong [1, 4)'],
    ['<code>{7,7,7,7,7}, 7</code>', '<b class="do">2</b>', 'KHÔNG phải số 7 đầu tiên'],
    ['<code>{50,10,40,20,30}, 10</code>', '<b class="do">−1</b>', 'mảng chưa sắp: sai, không báo lỗi'],
  ], ['a = {10,20,30,40,50}', 'Trả về', 'Nghĩa'], 'font-size:18px')}</div>
<div>${o('<b>Âm = không tìm thấy</b>, và mang theo chỗ chèn: <code>r = −(điểm chèn) − 1</code>. Trừ 1 để "chèn ở 0" không trùng với 0 = "thấy ở 0".')}
${code(`int r = Collections.binarySearch(list, "cherry");
if (r < 0) list.add(-r - 1, "cherry"); // giữ sắp
// [apple, banana, cherry, kiwi, mango]`, 'java')}
<ul style="font-size:20px;margin-top:8px">
<li>Kiểm <code>r &lt; 0</code>, <b class="do">đừng</b> kiểm <code>r == -1</code></li>
<li>List sắp <b>giảm dần</b>: phải truyền <code>Collections.reverseOrder()</code> (−1 → 3)</li>
<li>Có bản trùng thì <b>không hứa</b> trả chỉ số nào — cần đầu/cuối thì tự viết bound</li>
</ul></div></div>` },

  /* 11 */
  { t: 'Mảng đã sắp bị xoay (rotated sorted array)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>${cotXoay([15, 18, 22, 30, 2, 5, 9, 12], { mid: 3 })}
<ul style="font-size:21px">
<li>{2, 5, …, 30} bị <b>xoay</b> 4 lần: hai đoạn tăng (cam, xanh)</li>
<li>Cắt ở bất kỳ mid nào: <b class="do">ít nhất một nửa đã sắp</b></li>
</ul></div>
<div>${code(`if (a[lo] <= a[mid]) {          // nửa trái sắp
    if (a[lo] <= key && key < a[mid]) hi = mid - 1;
    else lo = mid + 1;
} else {                        // nửa phải sắp
    if (a[mid] < key && key <= a[hi]) lo = mid + 1;
    else hi = mid - 1;
}`, 'java', 'sm')}
${bang([['5', '0', '7', '3', '30', '[15..30] sắp, 5 ngoài → lo = 4'], ['', '4', '7', '5', '<b class="do">5</b>', 'thấy → 5'], ['20', '0', '7', '3', '30', '15 ≤ 20 &lt; 30 → hi = 2'], ['', '0', '2', '1', '18', 'lo = 2'], ['', '2', '2', '2', '22', '22 &gt; 20: lo = 3 &gt; hi → <b>−1</b>']], ['key', 'lo', 'hi', 'mid', 'a[mid]', 'Quyết định'], 'font-size:17px;margin-top:6px')}
<p class="nho">O(log n). PASS 1085 ca: n = 0…9, mọi độ xoay, khoá âm, khoá vắng. Giá trị phải KHÁC nhau (có trùng: bài tập 3).</p></div></div>` },

  /* 12 */
  { t: 'Mảng xoay: tìm phần tử nhỏ nhất (điểm xoay)', body: `<div class="hai"><div>${code(`int lo = 0, hi = a.length - 1;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] > a[hi]) lo = mid + 1; // chỗ tụt ở phải
    else                hi = mid;     // mid có thể là min
}
return lo;   // chỉ số min = số lần xoay`, 'java')}
${bang([['0', '7', '3', '30', '12', '30 &gt; 12 → lo = 4'], ['4', '7', '5', '5', '12', 'hi = 5'], ['4', '5', '4', '2', '5', 'hi = 4 → <b class="do">4</b>']], ['lo', 'hi', 'mid', 'a[mid]', 'a[hi]', 'Bước'], 'font-size:18px;margin-top:8px')}</div>
<div><ul style="font-size:21px">
<li>So với <b>a[hi]</b>, không so a[lo]: mảng chưa xoay thì a[lo] ≤ a[mid] mà min vẫn ở trái</li>
<li>Kết quả 4 = <b>số lần xoay</b> k; PASS n = 1…12, mọi k</li>
</ul>
${o('<b>Có phần tử trùng</b>: khi <code>a[mid] == a[hi]</code> không biết bên nào ⇒ chỉ bỏ được <code>hi--</code>.', 'do2')}
${bang([['khác nhau, n = 1000', '<b>10</b> vòng'], ['{0, 1, 1, …, 1}, n = 1000', '<b class="do">999</b> vòng']], ['Mảng', 'Đo thật'], 'font-size:19px;margin-top:6px')}
<p class="nho">⇒ Có trùng thì xấu nhất <b>O(n)</b> — không thuật toán nào tránh được: phải nhìn từng ô mới biết số 0 nằm đâu.</p></div></div>` },

  /* 13 */
  { t: 'Tìm đỉnh (peak element)', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>${doThiDinh()}
<ul style="font-size:20px">
<li>Đỉnh: lớn hơn hai hàng xóm; coi a[−1] = a[n] = <b>−∞</b></li>
<li>Mảng <b>chưa sắp</b> vẫn tìm nhị phân được!</li>
</ul></div>
<div>${code(`while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < a[mid + 1]) lo = mid + 1; // lên dốc
    else                     hi = mid;     // xuống dốc
}
return lo;`, 'java')}
${bang([['0', '7', '3', '4 → 2', 'xuống → hi = 3'], ['0', '3', '1', '3 → 5', 'lên → lo = 2'], ['2', '3', '2', '5 → 4', 'xuống → hi = 2 → <b class="do">2</b>']], ['lo', 'hi', 'mid', 'a[mid] → a[mid+1]', 'Bước'], 'font-size:18px;margin-top:6px')}
${o('<b>Vì sao đúng:</b> đang lên dốc ở mid thì bên phải chắc có đỉnh (đi lên mãi sẽ gặp −∞ ở cuối). Trả về <b>một</b> đỉnh (2), không nhất thiết đỉnh cao nhất (6). PASS 5000 mảng.', 'xanh')}</div></div>` },

  /* 14 */
  { t: 'Tìm trong ma trận đã sắp', body: `<div class="hai" style="grid-template-columns:1fr 1.15fr"><div>
<p style="font-size:21px"><b>Kiểu A</b> — hàng sắp và đầu hàng &gt; cuối hàng trước ⇒ coi như <b>một mảng m·n</b>:</p>
${code(`int v = g[mid / n][mid % n]; // chỉ số → (hàng, cột)`, 'java', 'sm')}
<p style="font-size:20px;margin-top:6px">{{1,4,7,9},{12,15,18,20},{23,26,31,40}}: 18 → true, 19 → false, 40 → true. <b>O(log(m·n))</b></p>
${o('<b>Kiểu B</b> — hàng sắp, cột sắp, nhưng hàng sau có thể nhỏ hơn cuối hàng trước ⇒ <b>đi bậc thang</b> từ góc trên phải: lớn hơn key → sang trái (bỏ cả cột), nhỏ hơn → xuống (bỏ cả hàng). <b>O(m + n)</b>.', 'xanh')}</div>
<div style="display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start">${maTran()}
<div>${out(`key 9:
(0,3)=11 (0,2)=7
(1,2)=8 (2,2)=9 found
key 15:
(0,3)=11 (1,3)=12
(2,3)=16 (2,2)=9
(3,2)=14 absent`, 'font-size:15px')}
<p class="nho" style="margin-top:8px">PASS 2000 ma trận ngẫu nhiên (0 hàng, trùng, âm).</p></div>
<p class="nho" style="grid-column:1 / span 2">Kiểu B mà tìm nhị phân từng hàng: O(m log n) — chậm hơn bậc thang khi m ≈ n.</p></div></div>` },

  /* 15 */
  { t: 'Tìm kiếm trên đáp án (binary search on answer)', body: `${trucDapAn()}
<div class="hai" style="margin-top:2px"><ul style="font-size:21px">
<li>Không tìm trong mảng, mà tìm <b>trên miền đáp án</b> [lo, hi]</li>
<li>Viết <code>check(x)</code>: "đáp án x có <b>làm được</b> không?" — thường O(n), tham lam</li>
<li>Điều kiện sống còn: check <b class="do">đơn điệu</b> — x làm được thì mọi x lớn hơn cũng được (F..F T..T)</li>
<li>Rồi dùng đúng khuôn <b>T đầu tiên</b> (slide 7). Tổng: <b>O(n · log(hi − lo))</b></li>
</ul>
<div>${bang([
    ['"… <b>nhỏ nhất</b> sao cho kịp / đủ …"', 'T đầu tiên'],
    ['"… <b>lớn nhất</b> sao cho vẫn …"', 'T cuối (làm tròn lên)'],
    ['"cực tiểu giá trị lớn nhất" / "cực đại giá trị nhỏ nhất"', 'gần như chắc chắn'],
    ['Đáp án trong khoảng lớn (tới 10⁹), kiểm một đáp án thì dễ', 'nghĩ ngay tới nó'],
  ], ['Thấy trong đề', 'Nghĩ tới'], 'font-size:18px')}</div></div>` },

  /* 16 */
  { t: 'Căn bậc hai nguyên: r lớn nhất có r² ≤ x', body: `<div class="hai"><div>${code(`int lo = 0, hi = Math.min(x, 46340);
while (lo < hi) {               // T cuối của r*r <= x
    int mid = lo + (hi - lo + 1) / 2;   // tròn LÊN
    if ((long) mid * mid <= x) lo = mid;
    else                       hi = mid - 1;
}
return lo;`, 'java')}
${bang([['0', '40', '20', '400 &gt; 40'], ['0', '19', '10', '100 &gt; 40'], ['0', '9', '5', '25 ≤ 40 → lo = 5'], ['5', '9', '7', '49 &gt; 40'], ['5', '6', '6', '36 ≤ 40 → <b class="do">6</b>']], ['lo', 'hi', 'mid', 'mid² so với x = 40'], 'font-size:18px;margin-top:6px')}</div>
<div><ul style="font-size:21px">
<li>"<b>Lớn nhất</b> sao cho" ⇒ T..T F..F ⇒ tìm T cuối ⇒ <code>lo = mid</code> ⇒ <b>làm tròn lên</b> (bẫy 2)</li>
<li>46340² ≤ 2³¹ − 1 &lt; 46341² ⇒ hi không cần quá 46340</li>
</ul>
${o('<b>Bẫy tràn:</b> <code>mid * mid</code> kiểu int với mid ~ 10⁹ tràn âm. Chạy thật x = 2147395599:<br>đúng <b>46339</b> · bản int <b class="do">2147395599</b> (vô nghĩa). Sửa: ép <code>(long)</code> hoặc so <code>mid &lt;= x / mid</code>.', 'do2')}
<p class="nho">PASS x = 0…100000 và hai biên 2147395599, Integer.MAX_VALUE.</p></div></div>` },

  /* 17 */
  { t: 'Chở hàng trong D ngày (ý bài LeetCode 1011)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Kiện hàng theo <b>đúng thứ tự</b>, mỗi ngày một chuyến, tải trọng tàu C. <b>C nhỏ nhất</b> để xong trong D ngày?</p>
${code(`int daysNeeded(int[] w, int cap) {
    int days = 1, load = 0;
    for (int x : w) {
        if (load + x > cap) { days++; load = 0; }
        load += x;
    }
    return days;
}
// lo = max(w)  (nhỏ hơn: kiện nặng nhất không lên)
// hi = sum(w)  (một ngày chở hết)`, 'java', 'sm')}</div>
<div><p style="font-size:20px">w = {4, 8, 3, 6, 5, 2, 7}, D = 3:</p>
${bang([['8', '35', '21', '2', 'kịp → hi = 21'], ['8', '21', '14', '3', 'kịp → hi = 14'], ['8', '14', '11', '4', 'chậm → lo = 12'], ['12', '14', '13', '4', 'chậm → lo = 14'], ['14', '14', '', '', '<b class="do">C = 14</b>']], ['lo', 'hi', 'C = mid', 'số ngày', 'Bước'], 'font-size:18px')}
${o('C = 14: [4, 8] · [3, 6, 5] · [2, 7] — đúng 3 ngày. C lớn hơn thì số ngày <b>không tăng</b> ⇒ đơn điệu.', 'xanh')}
<p class="nho">O(n · log(sum)). PASS 1000 ca so với thử mọi C. Một kiện, D ≥ n (→ kiện nặng nhất) đều đúng.</p></div></div>` },

  /* 18 */
  { t: 'Ăn chuối Koko (ý bài LeetCode 875)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Mỗi giờ ăn tối đa k quả từ <b>một</b> đống; đống còn ít hơn k thì giờ đó chỉ ăn đống đó. <b>k nhỏ nhất</b> để hết trong H giờ?</p>
${code(`long hours(int[] piles, int k) {
    long h = 0;                    // long: tổng lớn
    for (int p : piles)
        h += (p + (long) k - 1) / k;   // = ceil(p / k)
    return h;
}
// lo = 1, hi = đống to nhất (mỗi đống 1 giờ)`, 'java', 'sm')}
${o('<code>(p + k − 1) / k</code> = làm tròn lên, không cần <code>double</code>. <b>h phải là long</b>: k nhỏ thì tổng giờ ≈ tổng số quả, dễ vượt 2³¹. Ép <code>(long) k</code> để p + k − 1 không tràn khi p gần Integer.MAX_VALUE.', 'do2')}</div>
<div><p style="font-size:20px">piles = {9, 25, 4, 17}, H = 8:</p>
${bang([['1', '25', '13', '6', 'kịp → hi = 13'], ['1', '13', '7', '10', 'chậm → lo = 8'], ['8', '13', '10', '7', 'kịp → hi = 10'], ['8', '10', '9', '7', 'kịp → hi = 9'], ['8', '9', '8', '10', 'chậm → lo = 9 → <b class="do">9</b>']], ['lo', 'hi', 'k', 'số giờ', 'Bước'], 'font-size:18px')}
<ul style="font-size:20px;margin-top:6px">
<li>H = số đống (4) → 25 = đống to nhất</li>
<li>{10⁹, 10⁹}, H = 3 → 10⁹ (không tràn)</li>
<li>O(n · log(max)). PASS 1000 ca so với thử mọi k</li>
</ul></div></div>` },

  /* 19 */
  { t: 'Chia mảng: cực tiểu tổng lớn nhất (ý bài LC 410)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Cắt mảng thành <b>k đoạn liên tiếp</b>, cực tiểu <b>tổng của đoạn lớn nhất</b>.</p>
${code(`int pieces(int[] a, long limit) {   // tham lam
    int cnt = 1; long sum = 0;
    for (int x : a) {
        if (sum + x > limit) { cnt++; sum = 0; }
        sum += x;
    }
    return cnt;
}
// check(limit) = pieces(a, limit) <= k`, 'java', 'sm')}
${o('Cùng một khuôn với "chở hàng": <b>limit</b> = tải trọng, <b>đoạn</b> = ngày. Ít đoạn hơn k vẫn được: cắt thêm là đủ k.', 'xanh')}</div>
<div><p style="font-size:20px">a = {5, 9, 3, 7, 4, 8}, k = 3:</p>
${bang([['9', '36', '22', '2', 'được → hi = 22'], ['9', '22', '15', '3', 'được → hi = 15'], ['9', '15', '12', '4', 'nhiều → lo = 13'], ['13', '15', '14', '3', 'được → hi = 14'], ['13', '14', '13', '4', 'nhiều → lo = 14 → <b class="do">14</b>']], ['lo', 'hi', 'limit', 'số đoạn', 'Bước'], 'font-size:18px')}
<p style="font-size:20px;margin-top:6px">[5, 9] · [3, 7, 4] · [8] → 14, 14, 8. k = 1 → 36 (tổng), k = n → 9 (max).</p>
<p style="font-size:20px">Tìm trên đáp án <b>O(n · log(sum))</b> so với quy hoạch động O(k · n²).</p>
<p class="nho">PASS 1000 ca ngẫu nhiên (có số 0) so với quy hoạch động.</p></div></div>` },

  /* 20 */
  { t: 'Tìm nhị phân trên số thực', body: `<div class="hai"><div>${code(`double lo = 0, hi = Math.max(1, x);  // x < 1: căn > x
for (int i = 0; i < 100; i++) {      // số vòng CỐ ĐỊNH
    double mid = (lo + hi) / 2;
    if (mid * mid < x) lo = mid;     // không +1!
    else               hi = mid;
}
return (lo + hi) / 2;`, 'java')}
${bang([['10', '1.415039062500000'], ['20', '1.414214134216309'], ['40', '1.414213562372424'], ['100', '<b>1.414213562373095</b>'], ['Math.sqrt(2)', '1.414213562373095']], ['Số lần chia đôi', '√2 tìm được'], 'font-size:18px;margin-top:6px')}</div>
<div><ul style="font-size:21px">
<li>Số thực không có "phần tử kế tiếp" ⇒ <code>lo = mid</code>, <code>hi = mid</code></li>
<li>Mỗi vòng độ rộng ÷ 2: 100 vòng ⇒ ÷ 2¹⁰⁰ — thừa cho mọi double</li>
<li>√0.25 = 0.5 &gt; 0.25 ⇒ hi phải là <b>max(1, x)</b>; căn bậc ba của −27 = −3 (miền âm)</li>
</ul>
${o('<b>Bẫy dừng theo eps:</b> <code>while (hi - lo &gt; 1e-12)</code> với x = 10¹⁰ ⇒ lo = 99999.99999999999, hi = 100000.0 — khoảng cách hai double kề nhau ở đó ≈ 1,5·10⁻¹¹ &gt; eps ⇒ <b class="do">chạy mãi</b> (đo: quá 100000 vòng vẫn chưa dừng).', 'do2')}
<p class="nho">eps = 1e-9 với x = 2 thì dừng sau 31 vòng. An toàn nhất: <b>đếm vòng</b>, hoặc eps tương đối.</p></div></div>` },

  /* 21 */
  { t: 'TreeSet / TreeMap: floor, ceiling — tìm nhị phân có sẵn', body: `<div class="hai"><div>${bang([
    ['<code>floor(25)</code>', 'lớn nhất ≤ 25', '<b>20</b>'],
    ['<code>ceiling(25)</code>', 'nhỏ nhất ≥ 25', '<b>30</b>'],
    ['<code>lower(20)</code>', 'lớn nhất <b>&lt;</b> 20', '10'],
    ['<code>higher(20)</code>', 'nhỏ nhất <b>&gt;</b> 20', '30'],
    ['<code>floor(5)</code>, <code>ceiling(45)</code>', 'không có', '<b class="do">null</b>'],
    ['<code>subSet(15, true, 35, true).size()</code>', 'đếm trong [15, 35]', '2'],
  ], ['set = {10, 20, 30, 40}', 'Nghĩa', 'Kết quả'], 'font-size:18px')}
</div>
<div>${code(`TreeMap<Integer,Integer> fee = new TreeMap<>();
fee.put(0, 15000);   fee.put(1000, 22000);
fee.put(3000, 35000); fee.put(10000, 80000);
fee.floorEntry(2500).getValue();  // 22000
fee.floorEntry(12000).getValue(); // 80000`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:8px">
<li>Bảng bậc (phí ship, thuế, hạng thành viên): khoá = <b>mốc dưới</b> của bậc</li>
<li>Dòng thời gian: <code>floorEntry(t)</code> = phiên bản đang hiệu lực lúc t</li>
<li>Cây đỏ–đen: tìm / chèn / xoá <b>O(log n)</b> ⇒ dùng khi dữ liệu <b>thay đổi</b>; mảng tĩnh: sắp một lần + tự viết bound</li>
</ul></div></div>
${o('<b>Đối chiếu</b> — Trên mảng sắp: floor(x) = a[upperBound(x) − 1] · ceiling(x) = a[lowerBound(x)] · lower(x) = a[lowerBound(x) − 1] · higher(x) = a[upperBound(x)]. Không có ⇒ <b>null</b>: kiểm null trước khi unbox sang int.', 'do2')}` },

  /* 22 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['Mảng/danh sách <b>đã sắp</b>, hỏi có/không, vị trí', 'Tìm nhị phân chuẩn, <code>Arrays.binarySearch</code>'],
    ['Có <b>trùng</b>, hỏi đầu/cuối/đếm/vị trí chèn', 'lower / upper bound'],
    ['"Đã sắp nhưng bị xoay", "dịch vòng"', 'Một nửa luôn sắp; so a[mid] với a[hi]'],
    ['Mảng chưa sắp, hỏi một cực trị địa phương (đỉnh, đáy)', 'Theo dốc a[mid] vs a[mid + 1]'],
    ['Ma trận: hàng và cột đều sắp', 'Bậc thang O(m + n) hoặc làm phẳng O(log mn)'],
    ['"<b>Nhỏ nhất</b> sao cho đủ/kịp", "<b>lớn nhất</b> sao cho vẫn…", cực tiểu cái lớn nhất', 'Tìm trên đáp án + check tham lam'],
    ['Đáp án là số thực, sai số cho trước', 'Chia đôi cố định ~100 vòng'],
    ['Dữ liệu thêm/xoá liên tục, hỏi "gần nhất ≤ / ≥ x"', 'TreeSet/TreeMap floor/ceiling'],
    ['n tới 10⁵–10⁶ mà ràng buộc đòi O(n log n) hoặc tốt hơn', 'Nghi ngờ có một lớp tìm nhị phân'],
  ], ['Thấy trong đề', 'Nghĩ tới'], 'font-size:19px')}` },

  /* 23 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['Tìm nhị phân / lower / upper bound', 'O(log n)', 'O(1)', 'mỗi vòng bỏ một nửa'],
    ['Mảng xoay (giá trị khác nhau)', 'O(log n)', 'O(1)', 'một nửa luôn sắp'],
    ['Mảng xoay có trùng', '<b class="do">O(n)</b> xấu nhất', 'O(1)', 'a[lo] = a[mid] = a[hi] chỉ bỏ 1 ô'],
    ['Tìm đỉnh', 'O(log n)', 'O(1)', 'đi theo dốc lên'],
    ['Ma trận làm phẳng / bậc thang', 'O(log mn) / O(m + n)', 'O(1)', 'mỗi bước bỏ một hàng hoặc cột'],
    ['Tìm trên đáp án', 'O(C(check) · log R)', 'như check', 'R = hi − lo; check thường O(n)'],
    ['Số thực, 100 vòng', 'O(100 · C(f))', 'O(1)', 'hằng số vòng'],
    ['TreeMap floor/ceiling/put', 'O(log n)', 'O(n)', 'cây đỏ–đen cân bằng'],
    ['Trung vị hai mảng sắp (bài tập 7)', 'O(log min(m, n))', 'O(1)', 'tìm trên cách chia'],
  ], ['Thuật toán', 'Thời gian', 'Bộ nhớ', 'Vì sao'], 'font-size:19px')}
<p class="nho">Bản đệ quy của tìm nhị phân tốn thêm O(log n) ngăn xếp — bản vòng lặp chỉ O(1).</p>` },

  /* 24 */
  { t: 'Tóm tắt', body: `<ul style="font-size:22px">
<li>Mỗi vòng bỏ một nửa ⇒ <b>⌊log₂ n⌋ + 1</b> vòng; cần dữ liệu <b>đã sắp</b> + truy cập O(1)</li>
<li><code>mid = lo + (hi − lo) / 2</code> — <code>(lo + hi) / 2</code> tràn số (JDK mang lỗi này ~9 năm)</li>
<li>Chọn kiểu đoạn trước: <b>[lo, hi]</b> ⇒ <code>&lt;=</code>, <code>hi = mid − 1</code>; <b>[lo, hi)</b> ⇒ <code>&lt;</code>, <code>hi = mid</code></li>
<li><code>lo = mid</code> ⇒ làm tròn <b>lên</b>, không thì lặp vô hạn</li>
<li><b>Khuôn T đầu tiên</b> trên F..F T..T — mọi biến thể chỉ là chọn đúng <code>ok()</code></li>
<li><code>Arrays.binarySearch</code> âm = <b>−(điểm chèn) − 1</b>; có trùng thì không hứa chỉ số nào</li>
<li>Mảng xoay, đỉnh, ma trận: tìm được <b>tính chất đơn điệu ẩn</b> là chia đôi được</li>
<li><b>Tìm trên đáp án</b>: "nhỏ nhất sao cho / lớn nhất sao cho" + check đơn điệu; số thực: đếm vòng; dữ liệu động: TreeMap</li>
</ul>` },
]);
