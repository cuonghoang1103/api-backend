/**
 * csd-cs6.mjs — CSD201 ⭐ Chuyên sâu 6: QUAY LUI (BACKTRACKING) (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs6.mjs --out <dir>
 *
 * Mọi bảng từng bước, mọi con số (số lời giải, số nút duyệt, PASS/FAIL) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs6/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs6', code: 'CS6', title: 'Quay lui (Backtracking)', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf', lam: '#2b6cb0' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', lam: '#e3eefa' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;
const xanhB = (t) => `<b style="color:#2f7d4f">${t}</b>`;
const doB = (t) => `<b style="color:#e02020">${t}</b>`;

/* ───────────── SVG: mê cung với đường đi ───────────── */
function maze() {
  // S . # . .
  // . # # . #
  // . . . # .
  // # . # . .
  // # . . . E
  const grid = ['S.#..', '.##.#', '...#.', '#.#..', '#...E'];
  const path = new Set(['0,0', '1,0', '2,0', '2,1', '3,1', '4,1', '4,2', '4,3', '3,3', '3,4', '4,4']);
  const cs = 42, x0 = 6, y0 = 6;
  let s = '';
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const ch = grid[r][c];
    const wall = ch === '#';
    const onPath = path.has(`${r},${c}`);
    const fill = wall ? '#595959' : ch === 'S' ? NEN.xanh : ch === 'E' ? NEN.do : onPath ? NEN.cam : NEN.trang;
    const stroke = wall ? '#404040' : ch === 'S' ? MAU.xanh : ch === 'E' ? MAU.do : onPath ? MAU.cam : MAU.vien;
    s += `<rect x="${x0 + c * cs}" y="${y0 + r * cs}" width="${cs - 3}" height="${cs - 3}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    if (ch === 'S' || ch === 'E') s += `<text x="${x0 + c * cs + (cs - 3) / 2}" y="${y0 + r * cs + (cs - 3) / 2 + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${wall ? '#fff' : stroke}">${ch}</text>`;
  }
  const W = x0 + 5 * cs, H = y0 + 5 * cs;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── SVG: cây trạng thái — tập con {1,2,3} ───────────── */
function cayTrangThai() {
  // node: {x, y, label, kind: 'root'|'take'|'skip'|'leaf'}
  const nodes = [
    { x: 300, y: 8, t: '{ }', k: 'root' },
    { x: 150, y: 58, t: 'bỏ 1', k: 'skip' }, { x: 450, y: 58, t: 'lấy 1 → {1}', k: 'take' },
    { x: 75, y: 108, t: 'bỏ 2', k: 'skip' }, { x: 225, y: 108, t: 'lấy 2 → {2}', k: 'take' },
    { x: 375, y: 108, t: 'bỏ 2', k: 'skip' }, { x: 525, y: 108, t: 'lấy 2 → {1,2}', k: 'take' },
    { x: 37, y: 158, t: '{ }', k: 'leaf' }, { x: 112, y: 158, t: '{3}', k: 'leaf' },
    { x: 187, y: 158, t: '{2}', k: 'leaf' }, { x: 262, y: 158, t: '{2,3}', k: 'leaf' },
    { x: 337, y: 158, t: '{1}', k: 'leaf' }, { x: 412, y: 158, t: '{1,3}', k: 'leaf' },
    { x: 487, y: 158, t: '{1,2}', k: 'leaf' }, { x: 562, y: 158, t: '{1,2,3}', k: 'leaf' },
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [3, 8], [4, 9], [4, 10], [5, 11], [5, 12], [6, 13], [6, 14]];
  let s = '';
  for (const [a, b] of edges) s += `<line x1="${nodes[a].x}" y1="${nodes[a].y + 12}" x2="${nodes[b].x}" y2="${nodes[b].y}" stroke="#bfbfbf" stroke-width="1.4"/>`;
  nodes.forEach((n) => {
    const fill = n.k === 'root' ? NEN.cam : n.k === 'take' ? NEN.xanh : n.k === 'skip' ? NEN.xam : NEN.lam;
    const st = n.k === 'root' ? MAU.cam : n.k === 'take' ? MAU.xanh : n.k === 'skip' ? MAU.vien : MAU.lam;
    const w = 12 + n.t.length * 6.6;
    s += `<rect x="${n.x - w / 2}" y="${n.y - 12}" width="${w}" height="24" rx="6" fill="${fill}" stroke="${st}" stroke-width="1.6"/>`;
    s += `<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#262626">${n.t}</text>`;
  });
  return `<svg viewBox="0 0 600 178" width="600" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── SVG: bàn cờ N-Queens (đọc từ mảng cột mỗi hàng) ───────────── */
function ban(cols, cellSize = 34) {
  const n = cols.length, cs = cellSize, x0 = 4, y0 = 4;
  let s = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const dark = (r + c) % 2 === 1;
    s += `<rect x="${x0 + c * cs}" y="${y0 + r * cs}" width="${cs}" height="${cs}" fill="${dark ? '#e8dccb' : '#fbf6ec'}"/>`;
  }
  for (let r = 0; r < n; r++) {
    const c = cols[r];
    s += `<circle cx="${x0 + c * cs + cs / 2}" cy="${y0 + r * cs + cs / 2}" r="${cs / 2 - 5}" fill="${MAU.do}" stroke="#7a1414" stroke-width="1.6"/>`;
    s += `<text x="${x0 + c * cs + cs / 2}" y="${y0 + r * cs + cs / 2 + 6}" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">Q</text>`;
  }
  const W = x0 * 2 + n * cs;
  return `<svg viewBox="0 0 ${W} ${W}" width="${Math.min(W, 300)}" font-family="Arial, sans-serif">${s}</svg>`;
}

/** Lưới chữ RxC gọn (word search). */
function luoiChu(rows) {
  const cs = 40, x0 = 4, y0 = 4, R = rows.length, C = rows[0].length;
  let s = '';
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    s += `<rect x="${x0 + c * cs}" y="${y0 + r * cs}" width="${cs - 4}" height="${cs - 4}" rx="4" fill="${NEN.trang}" stroke="${MAU.vien}" stroke-width="1.6"/>`;
    s += `<text x="${x0 + c * cs + (cs - 4) / 2}" y="${y0 + r * cs + (cs - 4) / 2 + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="#262626">${rows[r][c]}</text>`;
  }
  const W = x0 + C * cs, H = y0 + R * cs;
  return `<svg viewBox="0 0 ${W} ${H}" width="${Math.min(W, 190)}" font-family="Arial, sans-serif">${s}</svg>`;
}

/** Mảng ô có chỉ số (như deck cs1/cs5). fill: {i: 'do'|'xanh'|'cam'|'xam'} */
function mang(vals, { w = 58, h = 44, fill = {}, tren = {}, chiSo = true } = {}) {
  const x0 = 6, y0 = 26;
  let s = '';
  vals.forEach((v, i) => {
    const f = fill[i];
    s += `<rect x="${x0 + i * w}" y="${y0}" width="${w}" height="${h}" fill="${f ? NEN[f] : NEN.trang}" stroke="${f === 'do' ? MAU.do : MAU.vien}" stroke-width="${f === 'do' ? 3 : 1.5}"/>`;
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h / 2 + 7}" text-anchor="middle" font-size="21" font-weight="700" fill="${f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : '#262626'}">${v}</text>`;
    if (chiSo) s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h + 18}" text-anchor="middle" font-size="14" fill="#8c8c8c">${i}</text>`;
    if (tren[i]) s += `<text x="${x0 + i * w + w / 2}" y="${y0 - 8}" text-anchor="middle" font-size="15" font-weight="800" fill="${MAU.nau}">${tren[i]}</text>`;
  });
  const W = x0 + vals.length * w + 6;
  return `<svg viewBox="0 0 ${W} ${y0 + h + 24}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('QUAY LUI (BACKTRACKING)', [
  /* 1 */
  { cover: true, t: 'Quay lui (backtracking)', sub: 'Thử — đi sâu — quay lại · khuôn chọn/đệ quy/bỏ chọn · cây trạng thái<br>tập con, hoán vị, tổ hợp, combination sum · N-Queens · Sudoku · tìm từ trong lưới<br>phân tách đối xứng · sinh ngoặc hợp lệ · cắt nhánh · quay lui vs DP<br>CSD201 · Java 8 — mọi số liệu đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Ý tưởng: đi trong mê cung', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${maze()}
${nho('S → E: đi một ô, nếu ô đó bế tắc thì <b>lùi lại đúng ô vừa tới</b> và thử hướng khác — không phải "đi lại từ đầu".')}</div>
<div>${o('<b>Ba việc mỗi bước:</b><br>① <b>Thử</b> một lựa chọn (đi một hướng)<br>② <b>Đi sâu</b> — đệ quy từ trạng thái mới<br>③ Nếu đường đó chết, <b>quay lại</b> trạng thái trước khi thử, rồi thử lựa chọn khác', 'xanh')}
${out(`found = true
path  = DDRDDRRURDE
calls = 32, backtracks = 21`, 'margin-top:8px;font-size:15px')}
${nho('21 trên 32 lời gọi phải lùi lại — mê cung nhỏ 5×5 này minh hoạ đúng bản chất: quay lui thử NHIỀU đường và bỏ những đường chết, không phải "đoán đúng ngay".')}</div></div>` },

  /* 3 */
  { t: 'Khuôn quay lui: chọn → đệ quy → bỏ chọn', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${code(`void backtrack(Trạng_thái state) {
    if (state.làĐáp_án()) { ghiLại(state); return; }
    for (Lựa_chọn c : state.cácLựaChọnỞĐây()) {
        if (!hợpLệ(c)) continue;      // CẮT NHÁNH sớm
        state.chọn(c);                // 1. CHỌN
        backtrack(state);             // 2. ĐI SÂU (đệ quy)
        state.bỏChọn(c);              // 3. BỎ CHỌN — trả state
    }                                 //    về ĐÚNG như trước bước 1
}`, 'java', 'sm')}
${o('Bước 3 là <b>trái tim</b> của quay lui: nếu quên bỏ chọn, state ở bước sau vẫn "nhớ" lựa chọn cũ — bẫy phổ biến nhất khi mới học kỹ thuật này.', 'do2')}</div>
<div>${bang([
    ['Trạng thái', 'MazeDemo: (hàng, cột)', 'Subsets: chỉ số đang xét'],
    ['Lựa chọn', 'lên/xuống/trái/phải', 'lấy hay bỏ phần tử'],
    ['Hợp lệ?', 'không tường, chưa thăm', '(tuỳ bài — combination sum: không vượt tổng)'],
    ['Chọn', 'đánh dấu đã thăm', 'thêm vào danh sách đang xây'],
    ['Bỏ chọn', 'bỏ đánh dấu', 'xoá phần tử vừa thêm'],
  ], ['', 'Ví dụ 1', 'Ví dụ 2'], 'font-size:17px')}
${nho('Khuôn NÀY lặp lại ở mọi slide sau — chỉ 4 chữ đổi: trạng thái, lựa chọn, điều kiện hợp lệ, lúc nào là đáp án.')}</div></div>` },

  /* 4 */
  { t: 'Cây trạng thái (state tree / decision tree)', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>
${cayTrangThai()}
${nho('Tập con của {1,2,3}: mỗi phần tử rẽ hai nhánh (lấy / bỏ) — cây có đúng <b>2³ = 8</b> lá, mỗi lá một tập con.')}</div>
<div>${o('<b>Quay lui = duyệt cây trạng thái theo chiều sâu (DFS)</b>: đi xuống một nhánh tới lá hoặc tới chỗ chắc chắn sai, rồi lùi lên nút cha để thử nhánh chưa đi.', 'xanh')}
${o('Số nút của cây quyết định <b>trực tiếp</b> độ phức tạp: cây tập con có O(2ⁿ) nút, cây hoán vị có O(n!) nút (slide 19) — quay lui không "nhanh hơn duyệt cây", nó <b>chính là</b> duyệt cây.')}</div></div>` },

  /* 5 */
  { t: 'Đã gặp đệ quy ở chương 3 — quay lui KHÔNG mới', body: `${bang([
    ['fib(4) — cây lời gọi (bài 3, slide 18)', 'không có bước "bỏ chọn": không thay đổi trạng thái ngoài, chỉ tính và trả về', 'không phải quay lui — là đệ quy thường, T(n) = T(n-1) + T(n-2)'],
    ['Tower of Hanoi (bài 3, slide 19–20)', 'mỗi lời gọi sinh đúng lời giải, không thử-sai', 'cũng không phải quay lui — không có nhánh nào bị bỏ'],
    ['Quay lui (deck này)', 'MỗI lời gọi thử một <b>lựa chọn</b>, có thể phải huỷ nếu sai/kẹt', 'khác ở chỗ: có trạng thái dùng chung bị SỬA rồi phải TRẢ LẠI'],
  ], ['So với', 'Đặc điểm', 'Khác quay lui ở đâu'], 'font-size:18px')}
<div class="hai">${o('<b>Điểm chung:</b> cả ba đều là đệ quy — hàm gọi lại chính nó, có ca dừng (base case), có ngăn xếp lời gọi (call stack) như bài 3 đã học.', 'xanh')}
${o('<b>Điểm riêng của quay lui:</b> có MỘT trạng thái dùng chung (mảng <code>used[]</code>, chuỗi đang xây…) được SỬA trước khi đệ quy và PHẢI trả về nguyên trạng sau — đây là thứ chương 3 chưa cần vì các bài ở đó không có "lựa chọn" để thử.')}</div>` },

  /* 6 */
  { t: 'Tập con (subsets) bằng quay lui', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`void go(int[] a, int i) {
    if (i == a.length) { ghiLại(cur); return; }
    go(a, i + 1);          // 1. KHÔNG lấy a[i]
    cur.addLast(a[i]);     // 2. lấy a[i]
    go(a, i + 1);
    cur.removeLast();      // 3. bỏ chọn
}`, 'java', 'sm')}
${o('Ở mỗi chỉ số chỉ có <b>hai</b> lựa chọn (lấy/bỏ) — không có điều kiện hợp lệ nào để cắt, nên cây có đủ 2ⁿ lá.', 'xanh')}</div>
<div>${out(`[]
[3]
[2]
[2, 3]
[1]
[1, 3]
[1, 2]
[1, 2, 3]
count = 8 = 2^3`, 'font-size:14px')}
${nho('Không quan tâm thứ tự (như "chọn hay không"): kết quả là tập, không phải dãy — khác hoán vị (slide 8) ở chỗ đó.')}</div></div>` },

  /* 7 */
  { t: 'Tập con bằng bitmask — không đệ quy', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> s = new ArrayList<>();
    for (int i = 0; i < n; i++)
        if ((mask & (1 << i)) != 0) s.add(a[i]);
    // mask CHÍNH LÀ một tập con
}`, 'java', 'sm')}
${o('Mỗi số nguyên 0..2ⁿ−1 là một cách bật/tắt n bit ⇒ đúng bằng một cách lấy/bỏ n phần tử. Không cần đệ quy, không cần bỏ chọn.', 'xanh')}</div>
<div>${bang([
    ['000', '[]'], ['001', '[1]'], ['010', '[2]'], ['011', '[1, 2]'],
    ['100', '[3]'], ['101', '[1, 3]'], ['110', '[2, 3]'], ['111', '[1, 2, 3]'],
  ], ['mask', 'Tập con'], 'font-size:17px')}
${out('PASS bitmask == backtracking for n = 0..16', 'margin-top:6px;font-size:15px')}
${nho('Chỉ dùng được khi n ≤ ~20 (2²⁰ ≈ 1 triệu) — n lớn hơn thì <code>1 << n</code> tràn hoặc quá chậm, phải quay lại quay lui.')}</div></div>` },

  /* 8 */
  { t: 'Hoán vị (permutations)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`boolean[] used = new boolean[n];
void go() {
    if (cur.size() == n) { ghiLại(cur); return; }
    for (int i = 0; i < n; i++) {
        if (used[i]) continue;      // CẮT: giá trị đã đặt ở tầng trên
        used[i] = true; cur.addLast(a[i]);
        go();
        cur.removeLast(); used[i] = false;
    }
}`, 'java', 'sm')}
${o('Khác tập con: ở ĐÂY thứ tự có nghĩa và mỗi tầng thử LẠI mọi giá trị chưa dùng (không phải chỉ chỉ số hiện tại) — cây rẽ n, n−1, n−2… nhánh mỗi tầng.', 'xanh')}</div>
<div>${out(`[1, 2, 3]
[1, 3, 2]
[2, 1, 3]
[2, 3, 1]
[3, 1, 2]
[3, 2, 1]
count = 6 = 3!`, 'font-size:14.5px')}
${nho('PASS count == n! và mọi hoán vị khác nhau, n = 0..8 — kiểm bằng HashSet để chắc không trùng.')}</div></div>` },

  /* 9 */
  { t: 'Hoán vị có phần tử trùng: sắp rồi bỏ qua', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${code(`Arrays.sort(a);                       // BẮT BUỘC: trùng phải đứng cạnh nhau
for (int i = 0; i < a.length; i++) {
    if (used[i]) continue;
    // bản sao TRƯỚC a[i] chưa dùng -> nó sẽ được
    // thử ở đây trước, khỏi sinh hoán vị y hệt lần nữa
    if (i > 0 && a[i] == a[i-1] && !used[i-1]) continue;
    used[i] = true; cur.addLast(a[i]);
    go(); cur.removeLast(); used[i] = false;
}`, 'java', 'sm')}</div>
<div><p style="font-size:19px">{1, 1, 2} — không lọc trùng ra <b class="do">6</b> hoán vị (hai bản "112" y hệt vì hai số 1 đổi chỗ); có lọc:</p>
${out(`[1, 1, 2]
[1, 2, 1]
[2, 1, 1]
count = 3 (naive gives 6)`, 'font-size:14.5px')}
${bang([
    ['{1,1,2}', '3!/2!', xanhB('3')],
    ['{1,1,1}', '3!/3!', xanhB('1')],
    ['{1,1,2,2}', '4!/(2!·2!)', xanhB('6')],
  ], ['Bộ', 'Công thức', 'Số hoán vị khác'], 'font-size:16.5px;margin-top:6px')}
${nho('Công thức tổng quát: n! / (tích giai thừa số lần lặp mỗi giá trị). PASS khớp công thức trên 6 bộ.')}</div></div>` },

  /* 10 */
  { t: 'Tổ hợp chọn k (combinations)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`void go(int n, int k, int start) {
    if (cur.size() == k) { ghiLại(cur); return; }
    for (int i = start; i <= n; i++) {
        cur.addLast(i);
        go(n, k, i + 1);   // tầng sau CHỈ xét i+1..n
        cur.removeLast();  //  -> không có [2,1] sau khi đã có [1,2]
    }
}`, 'java', 'sm')}
${o('Khác hoán vị ở đúng MỘT chữ: dùng <code>start</code> để chỉ nhìn về phía trước, không dùng mảng <code>used[]</code> nhìn cả hai phía.', 'xanh')}</div>
<div>${out(`[1, 2]
[1, 3]
[1, 4]
[2, 3]
[2, 4]
[3, 4]
count = 6 = C(4,2)`, 'font-size:15px')}
${nho('PASS |kết quả| = C(n,k) đúng công thức, n = 0..10, mọi k. Đây là khuôn dùng lại nguyên vẹn ở combination sum (slide 11–12).')}</div></div>` },

  /* 11 */
  { t: 'Combination sum — ĐƯỢC dùng lại một số', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:19px">Ứng viên {2, 3, 6, 7}, đích 7, mỗi số dùng lại bao nhiêu lần cũng được (ý bài LeetCode 39).</p>
${code(`void go(int[] a, int i, int remain) {
    if (remain == 0) { ghiLại(cur); return; }
    if (remain < 0 || i == a.length) return;   // CẮT
    cur.addLast(a[i]);
    go(a, i, remain - a[i]);     // DÙNG LẠI a[i]: vẫn i
    cur.removeLast();
    go(a, i + 1, remain);        // bỏ hẳn a[i]: sang i+1
}`, 'java', 'sm')}</div>
<div>${out(`[2, 2, 3]
[7]
count = 2`, 'font-size:15px')}
${o('Khác combinations (slide 10) đúng một chỗ: nhánh "dùng lại" gọi <code>go(a, i, ...)</code> — vẫn <b>i</b>, không phải i+1.', 'xanh')}
${nho('PASS mọi tổ hợp cộng đúng đích và không có tổ hợp trùng nhau, 5 bộ dữ liệu kể cả đích = 0.')}</div></div>` },

  /* 12 */
  { t: 'Combination sum II — KHÔNG dùng lại, có số trùng', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${code(`Arrays.sort(a);
void go(int[] a, int start, int remain) {
    if (remain == 0) { ghiLại(cur); return; }
    for (int i = start; i < a.length; i++) {
        if (a[i] > remain) break;                 // đã sắp: dừng hẳn
        if (i > start && a[i] == a[i-1]) continue; // cùng tầng, cùng giá trị: bỏ
        cur.addLast(a[i]);
        go(a, i + 1, remain - a[i]);              // i+1: mỗi chỉ số 1 lần
        cur.removeLast();
    }
}`, 'java', 'sm')}</div>
<div><p style="font-size:19px">{10,1,2,7,6,1,5}, đích 8 (ý bài LeetCode 40):</p>
${out(`[1, 1, 6]
[1, 2, 5]
[1, 7]
[2, 6]
count = 4`, 'font-size:14.5px')}
${o('Ba kỹ thuật gặp lại một chỗ: <code>i+1</code> của combinations (không dùng lại) + điều kiện bỏ trùng của hoán vị có lặp (slide 9) + cắt theo tổng của combination sum.', 'xanh')}</div></div>` },

  /* 13 */
  { t: 'N-Queens: cắt nhánh theo cột/đường chéo', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`for (int c = 0; c < n; c++) {
    int d1 = row + c, d2 = row - c + n;      // 2 hướng chéo
    if (usedCol[c] || usedDiag1[d1] || usedDiag2[d2])
        continue;                             // CẮT: đang bị chiếu
    usedCol[c] = usedDiag1[d1] = usedDiag2[d2] = true;
    place(row + 1);
    usedCol[c] = usedDiag1[d1] = usedDiag2[d2] = false;
}`, 'java', 'sm')}
${o('Mỗi hàng đặt đúng một quân hậu ⇒ trạng thái chỉ cần 3 mảng boolean (cột, chéo ↘, chéo ↙) — không phải quét lại bàn cờ mỗi lần.', 'xanh')}</div>
<div>${bang([
    ['1', '0', '0', '2', '10', '4', '40', xanhB('92'), '352', '724'],
  ], ['n=1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], 'font-size:15px')}
${nho('n trong hàng tiêu đề, số lời giải ở dưới — cả 10 giá trị khớp dãy đã biết (OEIS A000170).')}
${ban([0, 4, 7, 5, 2, 6, 1, 3], 20)}
${nho('Một trong 92 lời giải n = 8, cột theo hàng: [0,4,7,5,2,6,1,3].')}</div></div>` },

  /* 14 */
  { t: 'Cắt nhánh (pruning) — đo thật số nút', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${bang([
    ['4', '17', '341', '20×'],
    ['5', '54', '3 906', '72×'],
    ['6', '153', '55 987', '366×'],
    ['7', '552', '960 800', '1 741×'],
    ['8', '2 057', '19 173 961', xanhB('9 321×')],
  ], ['n', 'CÓ cắt nhánh', 'KHÔNG cắt (thử hết rồi mới kiểm)', 'Tỉ lệ'], 'font-size:16.5px')}
${nho('"Không cắt" vẫn không phải vét cạn mọi bàn cờ (nⁿ) — chỉ là đợi đủ n hàng mới kiểm, thay vì kiểm ngay khi đặt quân. Cắt sớm hơn = ít nút hơn NHIỀU.')}</div>
<div>${o('<b>Cắt nhánh = kiểm điều kiện hợp lệ TRƯỚC khi đệ quy</b>, không phải sau. Muộn một bước (đợi đủ bàn cờ rồi mới kiểm) là bỏ lỡ toàn bộ phần cây con đáng lẽ chết ngay ở gốc.', 'xanh')}
${o('Quy tắc chung: cắt càng SỚM (càng gần gốc) tiết kiệm càng nhiều — vì một nhát cắt ở tầng nông chặn đứng cả một cây con lớn phía dưới nó.')}
${nho('Cùng ý tưởng ở Sudoku (slide 15: kiểm hàng/cột/khối trước khi điền) và combination sum (slide 11: <code>remain &lt; 0</code> dừng ngay, không đợi hết mảng).')}</div></div>` },

  /* 15 */
  { t: 'Sudoku: điền ô trống đầu tiên, thử 1..9', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`for (char d = '1'; d <= '9'; d++) {
    if (!ok(r, c, d)) continue;  // CẮT: phạm hàng/cột/khối 3x3
    b[r][c] = d;
    if (solve()) return true;    // đi sâu
    b[r][c] = '.';                // bỏ chọn
}
return false;   // không số nào hợp lệ -> báo cha thử số khác`, 'java', 'sm')}
${o('Không tìm "ô trống bất kỳ" — luôn lấy ô trống ĐẦU TIÊN theo thứ tự duyệt, để mọi lời gọi con nhất quán và không lặp vô hạn.', 'xanh')}</div>
<div>${out(`solved = true, digits tried = 37652
534678912
672195348
198342567
859761423
426853791
713924856
961537284
287419635
345286179`, 'font-size:13.5px')}
${nho('37 652 chữ số được THỬ (không phải 37 652 lần backtrack) trước khi ra lời giải — mỗi ô trống thử tối đa 9 chữ số, phần lớn bị cắt ngay bởi <code>ok()</code>.')}
${o('PASS: mọi hàng, cột, khối 3×3 của kết quả đều chứa đúng 1..9 một lần.', 'xanh')}</div></div>` },

  /* 16 */
  { t: 'Tìm từ trong lưới (word search)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`boolean dfs(int r, int c, String w, int k) {
    if (ngoàiLưới || seen[r][c] || g[r][c] != w.charAt(k))
        return false;                              // CẮT
    if (k == w.length() - 1) return true;           // khớp hết
    seen[r][c] = true;
    boolean found = dfs(r-1,c,..) || dfs(r+1,c,..)
                  || dfs(r,c-1,..) || dfs(r,c+1,..);
    seen[r][c] = false;   // bỏ chọn: ô này có thể cần cho đường KHÁC
    return found;
}`, 'java', 'sm')}</div>
<div>${luoiChu([['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']])}
${bang([
    ['"ABCCED"', xanhB('true')], ['"SEE"', xanhB('true')], ['"ABCB"', doB('false')],
  ], ['Từ', 'Có trong lưới?'], 'font-size:16.5px;margin-top:6px')}
${o('"ABCB" sai: ô B(0,1) đã dùng cho chữ B đầu, <b>không được dùng lại cùng một ô</b> trong một đường — vì thế phải đánh dấu/bỏ đánh dấu <code>seen</code>.', 'do2')}</div></div>` },

  /* 17 */
  { t: 'Phân tách xâu đối xứng (palindrome partitioning)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`void go(String s, int start) {
    if (start == s.length()) { ghiLại(cur); return; }
    for (int end = start+1; end <= s.length(); end++) {
        String piece = s.substring(start, end);
        if (!doiXung(piece)) continue;   // CẮT: mảnh này không đối xứng
        cur.addLast(piece);
        go(s, end);
        cur.removeLast();
    }
}`, 'java', 'sm')}
${o('Lựa chọn ở đây không phải "lấy phần tử" mà là "cắt ở đâu" — mỗi vị trí <code>end</code> thử một nhát cắt khác nhau.', 'xanh')}</div>
<div><p style="font-size:19px">"aab":</p>
${out(`[a, a, b]
[aa, b]
count = 2`, 'font-size:15px')}
${bang([
    ['"aab"', '2'], ['"aaa"', '4'], ['"aba"', '2'], ['"abc"', '1'], ['"racecar"', '4'],
  ], ['Chuỗi', 'Số cách cắt'], 'font-size:17px;margin-top:6px')}
${nho('PASS mọi cách cắt: ghép lại đúng chuỗi gốc, mảnh nào cũng đối xứng — 7 bộ kể cả chuỗi rỗng.')}</div></div>` },

  /* 18 */
  { t: 'Sinh ngoặc hợp lệ (generate parentheses)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`void go(int open, int close) {
    if (open == 0 && close == 0) { ghiLại(cur); return; }
    if (open > 0) {                 // còn '(' để dùng
        cur.append('('); go(open-1, close); bỏKýTựCuối();
    }
    if (close > open) {             // CẮT: không để ')' nhiều hơn '('
        cur.append(')'); go(open, close-1); bỏKýTựCuối();
    }
}`, 'java', 'sm')}
${o('Điều kiện <code>close &gt; open</code> chính là bộ lọc hợp lệ — không sinh chuỗi sai rồi lọc sau, mà <b>không bao giờ sinh ra</b> chuỗi sai.', 'xanh')}</div>
<div><p style="font-size:19px">n = 3 cặp:</p>
${out(`((()))
(()())
(())()
()(())
()()()
count = 5 = Catalan(3)`, 'font-size:14.5px')}
${bang([['0', '1'], ['1', '1'], ['2', '2'], ['3', '5'], ['4', xanhB('14')], ['5', '42']], ['n', 'Catalan(n)'], 'font-size:17px;margin-top:6px')}
${nho('PASS count == Catalan(n), mọi chuỗi cân bằng và khác nhau, n = 0..8. Catalan(n) = C(2n,n)/(n+1).')}</div></div>` },

  /* 19 */
  { t: 'Vì sao O(2ⁿ), O(n!) — và khi nào quay lui là lựa chọn duy nhất', body: `<div class="hai"><div>
${bang([
    ['Tập con', '2 (lấy/bỏ)', 'n', 'O(2ⁿ)'],
    ['Hoán vị', 'giảm dần: n, n−1, …, 1', 'n', 'O(n!)'],
    ['Tổ hợp chọn k', '≤ n mỗi tầng', 'k', 'O(C(n,k)) ≤ O(2ⁿ)'],
    ['N-Queens (không cắt)', 'n', 'n', 'O(nⁿ) — cắt còn lại rất ít, xem slide 14'],
  ], ['Bài', 'Số nhánh mỗi tầng', 'Số tầng (độ sâu)', 'Cây có khoảng'], 'font-size:17px')}
${o('<b>Công thức chung:</b> số nút cây ≈ (số nhánh mỗi tầng)^(số tầng). Quay lui không đổi được công thức này — nó chỉ QUYẾT ĐỊNH có đi hết cây hay cắt bớt (slide 14).', 'xanh')}</div>
<div>${o('<b>Khi nào quay lui là lựa chọn DUY NHẤT:</b> đề bài hỏi liệt kê TẤT CẢ lời giải (mọi tập con, mọi cách sắp, mọi cách điền Sudoku) — không có cách nào rẻ hơn O(số lời giải), vì phải in ra hết.', 'xanh')}
${o('Ngược lại đề chỉ hỏi CÓ tồn tại hay ĐẾM bao nhiêu (không cần liệt kê) → tìm xem có DP/công thức đóng không trước (slide sau).')}
${nho('N-Queens KHÔNG hỏi liệt kê 92 bàn cờ trong đa số đề phỏng vấn — chỉ hỏi ĐẾM hoặc GIẢI MỘT — nhưng chưa ai biết công thức đóng cho n bất kỳ, nên quay lui vẫn là cách duy nhất đã biết.')}</div></div>` },

  /* 20 */
  { t: 'Quay lui vs DP — chỉ ĐẾM thì DP thường nhanh hơn', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${bang([
    ['Leo cầu thang: đếm số cách (⭐ CS.3)', 'O(2ⁿ) thử mọi dãy bước', 'O(n) — dp[i]=dp[i-1]+dp[i-2]'],
    ['Coin change: đếm/ít đồng nhất (⭐ CS.3)', 'O(2ⁿ) thử mọi tổ hợp đồng', 'O(n·amount)'],
    ['Combination sum II (slide 12): LIỆT KÊ hết', 'phải quay lui — DP không in được từng tổ hợp', '— (DP chỉ đếm được SỐ LƯỢNG, không liệt kê)'],
    ['N-Queens: ĐẾM số lời giải', 'quay lui — chưa có công thức', 'chưa có (bài con không tách rời nhau)'],
  ], ['Bài', 'Quay lui', 'DP (nếu có)'], 'font-size:15.5px')}
${o('Dấu hiệu nên tìm DP: bài con TRÙNG NHAU thật sự (dp[i] chỉ phụ thuộc vài dp[j] cố định) — leo cầu thang, coin change đều vậy.', 'xanh')}</div>
<div>${o('<b>Vì sao combination sum KHÔNG chuyển được sang DP thuần:</b> đề hỏi liệt kê TỪNG tổ hợp cụ thể, DP chỉ trả lời "có bao nhiêu / có tồn tại không" bằng một bảng số — muốn in ra hết vẫn phải quay lui trên bảng đó.', '')}
${o('<b>N-Queens vì sao không có DP:</b> không tách được thành "bài con của n-1 hàng đầu" độc lập — hàng cuối phụ thuộc TOÀN BỘ cách đặt n-1 hàng trước, không chỉ một con số tổng hợp như dp[i-1].', 'do2')}
${nho('Quy tắc thực dụng: thấy "đếm/tồn tại" + bài con thật sự lặp lại → thử DP trước (⭐ CS.3–CS.4). Thấy "liệt kê" hoặc bài con không rời nhau → quay lui.')}</div></div>` },

  /* 21 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['"Mọi tập con", "mọi cách chọn không kể thứ tự"', 'Quay lui trên chỉ số + lấy/bỏ, hoặc bitmask nếu n ≤ 20', '6–7'],
    ['"Mọi cách sắp xếp", có/không phần tử trùng', 'Hoán vị: mảng used[]; trùng thì sắp trước + bỏ qua', '8–9'],
    ['"Chọn k trong n", không kể thứ tự', 'Combinations: vòng lặp từ start, gọi i+1', '10'],
    ['"Tổng bằng target", được/không được dùng lại phần tử', 'Combination sum: gọi lại i (dùng lại) hoặc i+1 (không)', '11–12'],
    ['Bàn cờ/lưới: đặt sao cho không phạm luật, ĐẾM hoặc GIẢI', 'Cắt nhánh theo cột/đường chéo (Queens) hoặc hàng/cột/khối (Sudoku)', '13–15'],
    ['Tìm đường/từ trong lưới 2D, không lặp ô', 'DFS + đánh dấu/bỏ đánh dấu (seen[][])', '16'],
    ['"Mọi cách cắt chuỗi thoả điều kiện"', 'Thử mọi nhát cắt tại `start`, cắt nhánh nếu mảnh không hợp lệ', '17'],
    ['Sinh chuỗi/cấu trúc hợp lệ theo luật xây dần', 'Chỉ thêm ký tự/phần tử KHÔNG BAO GIỜ phá luật', '18'],
    ['Chỉ hỏi ĐẾM/CÓ TỒN TẠI, bài con trùng nhau thật sự', 'Không phải quay lui — thử DP trước (⭐ CS.3–CS.4)', '20'],
  ], ['Thấy trong đề', 'Nghĩ tới', 'Slide'], 'font-size:17px')}` },

  /* 22 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['Tập con (quay lui)', 'O(2ⁿ · n)', 'O(n)', 'đệ quy sâu n, mỗi lá tốn O(n) chép kết quả'],
    ['Tập con (bitmask)', 'O(2ⁿ · n)', 'O(1) ngoài kết quả', 'không có ngăn xếp đệ quy'],
    ['Hoán vị', 'O(n! · n)', 'O(n)', 'n! lá, mỗi lá O(n) chép'],
    ['Tổ hợp chọn k', 'O(C(n,k) · k)', 'O(k)', 'C(n,k) lá'],
    ['Combination sum (dùng lại)', 'O(2^target) xấu nhất', 'O(target)', 'độ sâu tới target/số nhỏ nhất'],
    ['N-Queens (có cắt)', '≪ O(nⁿ), không có công thức đóng', 'O(n)', '3 mảng boolean — xem bảng đo thật slide 14'],
    ['Sudoku', 'xấu nhất mũ, thực tế rất nhanh nhờ cắt', 'O(81)', '37 652 lần thử cho đề chuẩn (slide 15)'],
    ['Word search', 'O(R·C·4^L)', 'O(L)', 'L = độ dài từ, đệ quy theo từ'],
    ['Palindrome partitioning', 'O(2ⁿ)', 'O(n)', 'n nhát cắt có thể, mỗi cái đôi nhánh'],
    ['Sinh ngoặc hợp lệ', 'O(Catalan(n))', 'O(n)', 'chặt hơn 2ⁿ nhờ cắt close &gt; open'],
  ], ['Thuật toán', 'Thời gian', 'Bộ nhớ (ngoài kết quả)', 'Vì sao'], 'font-size:15.5px;line-height:1.25')}
${nho('Mọi độ phức tạp ở đây là "chưa cắt gì thêm" — cắt nhánh tốt (slide 14) không đổi công thức Big-O trong trường hợp xấu nhất, nhưng đổi hẳn số nút thực tế phải đi qua.')}` },

  /* 23 */
  { t: 'Tóm tắt', body: `<ul style="font-size:22px">
<li>Quay lui = duyệt <b>cây trạng thái</b> theo chiều sâu bằng khuôn <b>chọn → đệ quy → bỏ chọn</b>; quên "bỏ chọn" là bẫy số một</li>
<li>Đã dùng đệ quy ở chương 3 (Fibonacci, Hanoi) — khác quay lui ở chỗ có <b>trạng thái dùng chung bị sửa rồi phải trả lại</b></li>
<li>Tập con: lấy/bỏ mỗi chỉ số (2ⁿ) — hoán vị: thử mọi giá trị chưa dùng (n!) — tổ hợp: chỉ nhìn về phía trước (C(n,k))</li>
<li>Có phần tử trùng ⇒ <b>sắp trước rồi bỏ qua</b> giá trị lặp ở cùng tầng (hoán vị, combination sum II, subsets II)</li>
<li>Combination sum: gọi lại CÙNG chỉ số để dùng lại, gọi i+1 để bỏ hẳn</li>
<li>N-Queens/Sudoku: cắt nhánh theo luật (cột/chéo, hàng/cột/khối) <b>trước khi đệ quy</b> — đo thật: cắt nhánh giảm số nút tới hơn 9000 lần (n=8)</li>
<li>Word search, palindrome partitioning, generate parentheses: cùng khuôn, khác "lựa chọn" là gì (ô lưới / nhát cắt / ký tự tiếp theo)</li>
<li>Chỉ hỏi ĐẾM hoặc TỒN TẠI mà bài con trùng nhau thật ⇒ thử DP trước (⭐ CS.3–CS.4); LIỆT KÊ hết hoặc bài con không tách rời ⇒ quay lui là lựa chọn duy nhất</li>
</ul>` },
]);
