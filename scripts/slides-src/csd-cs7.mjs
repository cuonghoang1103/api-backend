/**
 * csd-cs7.mjs — CSD201 ⭐ Chuyên sâu 7: CÂY NÂNG CAO (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs7.mjs --out <dir>
 *
 * Nối tiếp bài trường Chương 4 (BST, AVL, heap), A.1 (Red-Black, B-tree, skip list), A.2 (Union-Find) — không giảng
 * lại. Mọi bảng từng bước, mọi con số (PASS/FAIL, số nút, số bước) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs7/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs7', code: 'CS7', title: 'Cây nâng cao', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf', lam: '#2b6cb0' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', lam: '#e3eefa' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;
const xanhB = (t) => `<b style="color:#2f7d4f">${t}</b>`;
const hai = (a, b, cols = '1fr 1fr') => `<div class="hai" style="grid-template-columns:${cols}"><div>${a}</div><div>${b}</div></div>`;

/* ───────────── SVG: cây nhị phân ─────────────
 * t = [val, trái, phải] lồng nhau (null = không có con). Vị trí x theo thứ tự inorder, y theo độ sâu.
 * opt.mau {val: 'do'|'xanh'|'cam'|'lam'|'xam'} tô nút · opt.canh {"cha-con": màu} tô cạnh · opt.nhan {val: chữ nhỏ dưới nút}
 */
function cay(t, { w = 460, dy = 62, r = 19, mau = {}, canh = {}, nhan = {}, trenNhan = {}, fs = 17, tang = false } = {}) {
  const nodes = [];
  let idx = 0;
  (function walk(x, d, par) {
    if (!x) return;
    const me = { v: x[0], d, par };
    walk(x[1], d + 1, me);
    me.i = idx++;
    nodes.push(me);
    walk(x[2], d + 1, me);
  })(t, 0, null);
  const n = nodes.length, maxD = Math.max(...nodes.map((k) => k.d));
  const pad = r + 8, L = tang ? 62 : 0;
  const sx = (i) => (n === 1 ? w / 2 : L + pad + i * (w - L - 2 * pad) / (n - 1));
  const sy = (d) => pad + 4 + d * dy;
  const H = sy(maxD) + r + 26;
  let e = '', s = '';
  if (tang) for (let d = 0; d <= maxD; d++) s += `<text x="0" y="${sy(d) + 5}" font-size="14.5" font-weight="700" fill="${MAU.lam}">tầng ${d}</text>`;
  for (const k of nodes) {
    if (!k.par) continue;
    const c = canh[`${k.par.v}-${k.v}`];
    e += `<line x1="${sx(k.par.i)}" y1="${sy(k.par.d)}" x2="${sx(k.i)}" y2="${sy(k.d)}" stroke="${c ? MAU[c] : '#a6a6a6'}" stroke-width="${c ? 4 : 1.8}"/>`;
  }
  for (const k of nodes) {
    const m = mau[k.v];
    s += `<circle cx="${sx(k.i)}" cy="${sy(k.d)}" r="${r}" fill="${m ? NEN[m] : NEN.trang}" stroke="${m ? MAU[m] : MAU.vien}" stroke-width="${m ? 2.6 : 1.6}"/>`;
    s += `<text x="${sx(k.i)}" y="${sy(k.d) + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${m === 'do' ? MAU.do : '#262626'}">${k.v}</text>`;
    if (nhan[k.v] !== undefined) s += `<text x="${sx(k.i)}" y="${sy(k.d) + r + 16}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${MAU.nau}">${nhan[k.v]}</text>`;
    if (trenNhan[k.v] !== undefined) s += `<text x="${sx(k.i) + r + 4}" y="${sy(k.d) - r + 4}" font-size="13.5" font-weight="700" fill="${MAU.lam}">${trenNhan[k.v]}</text>`;
  }
  return `<svg viewBox="0 0 ${w} ${H}" width="${w}" font-family="Arial, sans-serif">${e}${s}</svg>`;
}

/* ───────────── SVG: cây tổng quát (trie, cây có gốc) ─────────────
 * node = { v, k: [con…], m: màu nền, tron: vòng kép (kết thúc từ), nhan } — xếp theo số lá.
 */
function cayTQ(root, { w = 520, dy = 56, r = 17, fs = 16, canh = {} } = {}) {
  let leaf = 0;
  const all = [];
  (function lay(x, d, par) {
    x.d = d; x.par = par; all.push(x);
    if (!x.k || !x.k.length) { x.pos = leaf++; return; }
    x.k.forEach((c) => lay(c, d + 1, x));
    x.pos = (x.k[0].pos + x.k[x.k.length - 1].pos) / 2;
  })(root, 0, null);
  const maxD = Math.max(...all.map((x) => x.d)), pad = r + 10;
  const sx = (p) => (leaf === 1 ? w / 2 : pad + p * (w - 2 * pad) / (leaf - 1));
  const sy = (d) => pad + d * dy;
  let e = '', s = '';
  for (const x of all) {
    if (x.par) {
      const c = canh[x.id];
      e += `<line x1="${sx(x.par.pos)}" y1="${sy(x.par.d)}" x2="${sx(x.pos)}" y2="${sy(x.d)}" stroke="${c ? MAU[c] : '#a6a6a6'}" stroke-width="${c ? 4 : 1.8}"/>`;
      if (x.canhChu) e += `<text x="${(sx(x.par.pos) + sx(x.pos)) / 2 - 8}" y="${(sy(x.par.d) + sy(x.d)) / 2 + 4}" text-anchor="end" font-size="14" font-weight="800" fill="${MAU.nau}">${x.canhChu}</text>`;
    }
  }
  for (const x of all) {
    const m = x.m;
    if (x.tron) s += `<circle cx="${sx(x.pos)}" cy="${sy(x.d)}" r="${r + 4}" fill="none" stroke="${MAU.xanh}" stroke-width="2.4"/>`;
    s += `<circle cx="${sx(x.pos)}" cy="${sy(x.d)}" r="${r}" fill="${m ? NEN[m] : NEN.trang}" stroke="${m ? MAU[m] : MAU.vien}" stroke-width="${m ? 2.4 : 1.6}"/>`;
    s += `<text x="${sx(x.pos)}" y="${sy(x.d) + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#262626">${x.v}</text>`;
    if (x.nhan) s += `<text x="${sx(x.pos) + r + 5}" y="${sy(x.d) + 5}" font-size="13" font-weight="700" fill="${MAU.lam}">${x.nhan}</text>`;
  }
  return `<svg viewBox="0 0 ${w} ${sy(maxD) + r + 12}" width="${w}" font-family="Arial, sans-serif">${e}${s}</svg>`;
}

/** Trie dựng từ danh sách từ; tô các nút trên đường của `to` (chuỗi tiền tố). */
function trieSvg(words, { to = '', w = 520, dy = 52, nhanPass = false } = {}) {
  const root = { v: '•', k: [], id: '', pass: 0 };
  for (const wd of words) {
    let x = root; x.pass++;
    for (const ch of wd) {
      let y = x.k.find((c) => c.ch === ch);
      if (!y) { y = { v: ch, ch, k: [], id: x.id + ch, pass: 0, canhChu: '' }; x.k.push(y); x.k.sort((a, b) => a.ch.localeCompare(b.ch)); }
      x = y; x.pass++;
    }
    x.tron = true;
  }
  const canh = {};
  (function mark(x) {
    if (to && x.id && to.startsWith(x.id)) { x.m = 'cam'; canh[x.id] = 'cam'; }
    if (nhanPass && x.id) x.nhan = String(x.pass);
    x.k.forEach(mark);
  })(root);
  root.m = 'xam';
  return cayTQ(root, { w, dy, canh });
}

/* ───────────── SVG: cây phân đoạn trên mảng 8 phần tử ─────────────
 * st: {"l-r": 'xanh'|'cam'|'xam'|'do'} tô trạng thái nút.
 */
const A8 = [5, 3, 7, 9, 6, 4, 1, 2];
function segSvg(arr, { st = {}, w = 620, hien = 'sum', soNut = true } = {}) {
  const n = arr.length, sum = [], mn = [], lr = [];
  (function build(v, l, r, d) {
    lr.push({ v, l, r, d });
    if (l === r) { sum[v] = mn[v] = arr[l]; return; }
    const m = Math.floor((l + r) / 2);
    build(2 * v, l, m, d + 1); build(2 * v + 1, m + 1, r, d + 1);
    sum[v] = sum[2 * v] + sum[2 * v + 1]; mn[v] = Math.min(mn[2 * v], mn[2 * v + 1]);
  })(1, 0, n - 1, 0);
  const cell = (w - 12) / n, bh = 44, dy = 64;
  let s = '', e = '';
  const box = (x) => ({ x: 6 + x.l * cell + 3, y: 6 + x.d * dy, bw: (x.r - x.l + 1) * cell - 6 });
  for (const x of lr) {
    if (x.l === x.r) continue;
    const b = box(x);
    for (const c of lr.filter((y) => y.v === 2 * x.v || y.v === 2 * x.v + 1)) {
      const cb = box(c);
      e += `<line x1="${b.x + b.bw / 2}" y1="${b.y + bh}" x2="${cb.x + cb.bw / 2}" y2="${cb.y}" stroke="#bfbfbf" stroke-width="1.5"/>`;
    }
  }
  for (const x of lr) {
    const b = box(x), k = st[`${x.l}-${x.r}`];
    const val = hien === 'min' ? mn[x.v] : sum[x.v];
    s += `<rect x="${b.x}" y="${b.y}" width="${b.bw}" height="${bh}" rx="6" fill="${k ? NEN[k] : NEN.trang}" stroke="${k ? MAU[k] : MAU.vien}" stroke-width="${k ? 2.6 : 1.4}"/>`;
    s += `<text x="${b.x + b.bw / 2}" y="${b.y + 19}" text-anchor="middle" font-size="14" fill="#595959">[${x.l}..${x.r}]</text>`;
    s += `<text x="${b.x + b.bw / 2}" y="${b.y + 38}" text-anchor="middle" font-size="17" font-weight="800" fill="${k === 'do' ? MAU.do : '#262626'}">${val}</text>`;
    if (soNut) s += `<text x="${b.x + 5}" y="${b.y + 13}" font-size="11.5" font-weight="700" fill="${MAU.lam}">${x.v}</text>`;
  }
  const H = 6 + 3 * dy + bh + 8;
  return `<svg viewBox="0 0 ${w} ${H}" width="${w}" font-family="Arial, sans-serif">${e}${s}</svg>`;
}

/* ───────────── SVG: Fenwick — t[i] phụ trách đoạn (i − lowbit(i), i] ───────────── */
function fenSvg({ n = 16, doc = [], ghi = [], w = 560 } = {}) {
  const cw = (w - 30) / n, rowH = 22, lv = (i) => Math.log2(i & -i);
  const maxLv = Math.log2(n);
  let s = '';
  for (let i = 1; i <= n; i++) {
    const lb = i & -i, y = 8 + (maxLv - lv(i)) * (rowH + 6);
    const loai = doc.includes(i) ? 'cam' : ghi.includes(i) ? 'lam' : null;
    s += `<rect x="${20 + (i - lb) * cw + 2}" y="${y}" width="${lb * cw - 4}" height="${rowH}" rx="4" fill="${loai ? NEN[loai] : NEN.xam}" stroke="${loai ? MAU[loai] : MAU.xam}" stroke-width="${loai ? 2.4 : 1.2}"/>`;
    s += `<text x="${20 + i * cw - 8}" y="${y + 16}" text-anchor="end" font-size="13" font-weight="800" fill="${loai ? MAU[loai] : '#595959'}">t[${i}]</text>`;
  }
  const yb = 8 + (maxLv + 1) * (rowH + 6) + 4;
  for (let i = 1; i <= n; i++) s += `<text x="${20 + (i - 0.5) * cw}" y="${yb + 12}" text-anchor="middle" font-size="13" fill="#8c8c8c">${i}</text>`;
  return `<svg viewBox="0 0 ${w} ${yb + 20}" width="${w}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* cây của binary lifting: parent = {-1,0,0,1,1,2,3,3,5,6} */
const LIFT = (mau = {}) => {
  const mk = (v, k = []) => ({ v, k, m: mau[v] });
  return mk(0, [mk(1, [mk(3, [mk(6, [mk(9)]), mk(7)]), mk(4)]), mk(2, [mk(5, [mk(8)])])]);
};

export const slides = lamDeck('CÂY NÂNG CAO', [
  /* 1 */
  { cover: true, t: 'Cây nâng cao', sub: 'Duyệt theo tầng · kiểm BST · LCA · đường kính · serialize · Trie<br>cây phân đoạn (segment tree) · lazy propagation · Fenwick (BIT) · binary lifting · TreeMap<br>CSD201 · Java 8 — mọi bảng từng bước đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Bản đồ: cây nào trả lời câu hỏi nào', body: `${bang([
    ['Duyệt theo tầng (BFS) + biến thể', '"theo từng tầng", "nhìn từ bên phải", "rộng nhất"', 'O(n)', '3–4'],
    ['Bài cây phỏng vấn', 'BST hợp lệ, LCA, đường kính, dựng lại, serialize', 'O(n)', '5–9'],
    ['<b>Trie</b> (cây tiền tố)', '"từ nào bắt đầu bằng …", gợi ý tự hoàn thành', 'O(độ dài từ)', '10–12'],
    ['<b>Segment tree</b> (cây phân đoạn)', 'tổng/min của đoạn [l..r] khi mảng <b>bị sửa</b>', 'O(log n)', '13–15'],
    ['<b>Fenwick</b> (BIT)', 'tổng tiền tố + sửa điểm, code 5 dòng', 'O(log n)', '16–18'],
    ['<b>Binary lifting</b>', 'LCA, tổ tiên thứ k, rất nhiều truy vấn', 'O(log n)', '19–20'],
    ['<b>TreeMap / TreeSet</b>', 'floor, ceiling, khoảng khoá — cây đỏ-đen có sẵn', 'O(log n)', '21–22'],
  ], ['Cấu trúc', 'Câu hỏi nó trả lời', 'Mỗi thao tác', 'Slide'], 'font-size:19px')}
${hai(o('<b>Đã học ở trường — không giảng lại:</b> duyệt pre/in/post/BFS, BST, AVL, heap (Chương 4); Red-Black, B-tree, skip list (A.1); Union-Find (A.2).', 'xanh'),
    o('<b>Deck này đi tiếp:</b> các bài cây hỏi nhiều nhất khi phỏng vấn, và bốn cấu trúc "trả lời truy vấn trên đoạn / trên tiền tố / trên tổ tiên" mà trường chưa dạy.'), '1fr 1fr')}` },

  /* 3 */
  { t: 'Duyệt theo tầng: chụp cỡ hàng đợi', body: hai(`${cay([1, [2, [4, null, null], [5, [7, null, null], [8, null, null]]], [3, null, [6, null, null]]], { w: 440, dy: 56, tang: true })}
${out(`  level 0 size 1: [1]  queue after [2, 3]
  level 1 size 2: [2, 3]  queue after [4, 5, 6]
  level 2 size 3: [4, 5, 6]  queue after [7, 8]
  level 3 size 2: [7, 8]  queue after []`, 'font-size:14px')}
${nho('O(n) thời gian, O(chiều rộng) bộ nhớ. PASS 3000 cây ngẫu nhiên so với DFS ghi độ sâu.')}`,
  `${code(`while (!q.isEmpty()) {
    int size = q.size();          // CHỤP: số nút tầng này
    List<Integer> row = new ArrayList<>();
    for (int i = 0; i < size; i++) {
        Node x = q.poll();
        row.add(x.val);
        if (x.left != null)  q.add(x.left);
        if (x.right != null) q.add(x.right);
    }
    res.add(row);                 // xong MỘT tầng
}`, 'java', 'sm')}
${o('Bài 4.A đã in BFS thành <b>một dãy</b>. Phỏng vấn hỏi <b>từng tầng riêng</b>: lúc bắt đầu tầng, hàng đợi chứa <b>đúng</b> các nút của tầng đó ⇒ chụp <code>size</code> trước khi thêm con.', 'xanh')}
${o('<b>Bẫy:</b> viết <code>i &lt; q.size()</code> trong vòng for — cỡ hàng đợi <b class="do">đổi</b> khi thêm con ⇒ trộn hai tầng.', 'do2')}`, '0.95fr 1.05fr') },

  /* 4 */
  { t: 'Biến thể BFS: zigzag, nhìn từ phải, độ rộng', body: hai(`${cay([1, [2, [4, null, null], [5, [7, null, null], [8, null, null]]], [3, null, [6, null, null]]], { w: 420, dy: 56, mau: { 1: 'cam', 3: 'cam', 6: 'cam', 8: 'cam' }, nhan: { 4: 'vị trí 0', 5: '1', 6: 'vị trí 3' } })}
${out(`zigzag [[1], [3, 2], [4, 5, 6], [8, 7]]
right view [1, 3, 6, 8]    max width 4
empty tree: [] [] 0`, 'font-size:14.5px')}`,
  `${bang([
    ['Zigzag (LC 103)', 'tầng lẻ đảo ngược <code>row</code>', '[3, 2], [8, 7]'],
    ['Nhìn từ phải (LC 199)', 'phần tử <b>cuối</b> của mỗi tầng', '1, 3, 6, 8 (cam)'],
    ['Độ rộng lớn nhất (LC 662)', 'đánh số như heap: con 2p, 2p+1; rộng = cuối − đầu + 1', '<b>4</b> ở tầng 2'],
  ], ['Bài', 'Thêm vào khuôn slide 3', 'Cây bên trái'], 'font-size:17.5px')}
${o('<b>Độ rộng tính cả chỗ trống null:</b> tầng 2 có 3 nút nhưng ở vị trí 0, 1, 3 ⇒ rộng <b class="do">4</b>, không phải 3.', 'do2')}
${o('<b>Bẫy tràn:</b> cây dây 64 tầng ⇒ vị trí 2⁶³ tràn <code>long</code>. Đánh số lại từ 0 ở <b>đầu mỗi tầng</b> (<code>p − first</code>) thì số luôn nhỏ.', 'do2')}
${nho('Nhìn từ trái = phần tử đầu mỗi tầng. Cả ba vẫn O(n).')}`, '0.95fr 1.05fr') },

  /* 5 */
  { t: 'Kiểm BST hợp lệ: bẫy "chỉ so với con"', body: hai(`${cay([5, [3, [1, null, null], [6, null, null]], [8, null, null]], { w: 380, dy: 60, mau: { 6: 'do', 5: 'cam' }, nhan: { 6: '6 > 5 mà ở bên TRÁI' } })}
${out(`tree 5(3(1,6),8): childOnly=true
                  bounds=false inorder=false
MAX(MIN,-): true true    empty: true
duplicate 2(2,-): false false
PASS bounds + inorder, 20000 random trees
  (6747 invalid) vs the definition
child-only check wrong on 3281 trees`, 'font-size:14px')}`,
  `${code(`// ĐÚNG: mỗi nút phải nằm trong (lo, hi)
// do MỌI tổ tiên để lại, không chỉ cha
boolean ok(Node x, long lo, long hi) {
    if (x == null) return true;
    if (x.val <= lo || x.val >= hi) return false;
    return ok(x.left, lo, x.val)     // trái: trần = x
        && ok(x.right, x.val, hi);   // phải: sàn = x
}
ok(root, Long.MIN_VALUE, Long.MAX_VALUE);`, 'java', 'sm')}
${o('<b>Cách 2:</b> BST ⇔ dãy <b>inorder tăng ngặt</b> — duyệt inorder, giữ <code>prev</code>. Cây trên: 1 3 <b class="do">6 5</b> 8 ⇒ sai.', 'xanh')}
${o('<b>Bẫy biên:</b> dùng <code>int</code> với Integer.MIN_VALUE làm sàn ⇒ nút có giá trị MIN bị loại oan. Dùng <code>long</code> hoặc <code>null</code>. Trùng (2 dưới 2) ⇒ <b>không</b> hợp lệ (LC 98).', 'do2')}`, '0.9fr 1.1fr') },

  /* 6 */
  { t: 'Tổ tiên chung gần nhất (LCA): trên BST và cây thường', body: hai(`${cay([20, [10, [5, null, null], [15, [12, null, null], [17, null, null]]], [30, [25, null, null], [35, null, null]]], { w: 420, dy: 58, mau: { 12: 'lam', 17: 'lam', 15: 'xanh' }, canh: { '20-10': 'cam', '10-15': 'cam' } })}
${out(`BST lca(12,17): path 20 10 15 -> 15
BST lca(5,17): path 20 10 -> 10
BST lca(12,30): path 20 -> 20
BST lca(10,17): path 20 10 -> 10`, 'font-size:14.5px')}`,
  `${code(`// BST: đi xuống tới chỗ p, q TÁCH nhau — O(h)
while (x != null) {
    if (p < x.val && q < x.val) x = x.left;
    else if (p > x.val && q > x.val) x = x.right;
    else return x;          // tách (hoặc gặp p/q)
}
// cây THƯỜNG: báo lên p/q tìm thấy — O(n)
Node lca(Node x, Node p, Node q) {
    if (x == null || x == p || x == q) return x;
    Node l = lca(x.left, p, q), r = lca(x.right, p, q);
    if (l != null && r != null) return x;  // hai phía
    return l != null ? l : r;
}`, 'java', 'sm')}
${o('lca(10, 17) = <b>10</b>: một nút là tổ tiên của chính nó. PASS 3000 BST + 3000 cây thường (p = q, trùng giá trị) so với đánh dấu tổ tiên.', 'xanh')}
${nho('Nhiều truy vấn ⇒ binary lifting (slide 19–20).')}`, '0.9fr 1.1fr') },

  /* 7 */
  { t: 'Đường kính và đường đi có tổng lớn nhất', body: hai(`${cay([1, [2, [4, [-1, [3, null, null], null], null], [5, null, [6, null, [-2, null, null]]]], [-9, null, null]], { w: 440, dy: 54, r: 18, mau: { 3: 'cam', '-1': 'cam', 4: 'cam', 2: 'cam', 5: 'cam', 6: 'cam' }, canh: { '-1-3': 'cam', '4--1': 'cam', '2-4': 'cam', '2-5': 'cam', '5-6': 'cam', '6--2': 'lam' } })}
${out(`diameter = 6 edges, max path sum = 19
single node -3: diameter 0, max path sum -3
PASS 2000 random trees vs every pair of nodes`, 'font-size:14px')}
${nho('Cam: đường tổng 19 = 3 − 1 + 4 + 2 + 5 + 6. Đường kính 6 cạnh: thêm −2 (cạnh xanh). Cả hai <b>gập ở 2</b>, không qua gốc.')}`,
  `${code(`long gain(Node x) {       // tốt nhất đi XUỐNG từ x
    if (x == null) return 0;
    long l = Math.max(0, gain(x.left));   // âm thì bỏ
    long r = Math.max(0, gain(x.right));
    best = Math.max(best, x.val + l + r); // gập tại x
    return x.val + Math.max(l, r);        // cha: 1 phía
}`, 'java', 'sm')}
${o('<b>Khuôn "trả một thứ, cập nhật một thứ khác":</b> hàm trả về đường <b>một nhánh</b> (cha còn nối tiếp được), còn đáp án là đường <b>gập</b> dùng cả hai nhánh. Đường kính: trả chiều cao, cập nhật <code>l + r + 2</code>.', 'xanh')}
${o('<b>Bẫy:</b> khởi tạo <code>best = 0</code> ⇒ cây toàn số âm trả <b class="do">0</b> thay vì −3. Dùng Long.MIN_VALUE. Đường phải có ≥ 1 nút.', 'do2')}
${nho('O(n), bộ nhớ O(h) cho đệ quy. LC 543 và LC 124.')}`, '0.95fr 1.05fr') },

  /* 8 */
  { t: 'Đảo ngược cây và dựng cây từ preorder + inorder', body: hai(`${code(`Node invert(Node x) {         // LC 226
    if (x == null) return null;
    Node t = x.left;
    x.left = invert(x.right);
    x.right = invert(t);
    return x;
}`, 'java', 'sm')}
${out(`built    8(3(5,1),6(-,4))
inverted 8(6(4,-),3(1,5))`, 'margin-top:8px;font-size:15px')}
${o('Kiểm: inorder của cây đảo = inorder cũ <b>đọc ngược</b>. O(n).', 'xanh')}
${o('Bài 4.A dựng cây bằng cách <b>quét</b> tìm gốc trong inorder ⇒ O(n²) khi cây là dây. Ở đây tra <b>HashMap</b> ⇒ <b>O(n)</b>.', '')}`,
  `<p style="font-size:18px;margin:0">pre = {8, 3, 5, 1, 6, 4} · in = {5, 3, 1, 8, 6, 4}:</p>
${out(`  root 8 = in[3]: left 3 node(s), right 2
    root 3 = in[1]: left 1 node(s), right 1
      root 5 = in[0]: left 0 node(s), right 0
      root 1 = in[2]: left 0 node(s), right 0
    root 6 = in[4]: left 0 node(s), right 1
      root 4 = in[5]: left 0 node(s), right 0`, 'font-size:14px')}
${code(`Node build(int lo, int hi) {       // đoạn inorder
    if (lo > hi) return null;
    int v = pre[next++];            // preorder: gốc kế
    int m = pos.get(v);             // HashMap: O(1)
    Node x = new Node(v);
    x.left  = build(lo, m - 1);     // TRÁI trước
    x.right = build(m + 1, hi);
    return x;
}`, 'java', 'sm')}
${nho('<b class="do">Giá trị trùng</b> ⇒ HashMap không biết gốc ở vị trí nào: bài này (LC 105) cho giá trị phân biệt. PASS 3000 cây.')}`, '1fr 1.1fr') },

  /* 9 */
  { t: 'Serialize / deserialize cây nhị phân', body: hai(`${cay([1, [2, null, null], [-12, [4, null, null], null]], { w: 300, dy: 56 })}
${out(`serialize   1,2,#,#,-12,4,#,#,#
deserialize 1,2,#,#,-12,4,#,#,#
empty tree  #   one node 7,#,#`, 'font-size:14.5px')}
${o('<b>Vì sao cần "#":</b> 1 có con <b>trái</b> 2 và 1 có con <b>phải</b> 2 đều có preorder <code>1 2</code>. Có "#": <code>1,2,#,#,#</code> khác <code>1,#,2,#,#</code>.', 'do2')}`,
  `${code(`void ser(Node x, StringBuilder sb) {   // preorder
    if (sb.length() > 0) sb.append(',');
    if (x == null) { sb.append('#'); return; }
    sb.append(x.val);
    ser(x.left, sb); ser(x.right, sb);
}
Node des() {             // đọc ĐÚNG thứ tự đã ghi
    String t = tok[i++];
    if (t.equals("#")) return null;
    Node x = new Node(Integer.parseInt(t));
    x.left = des(); x.right = des();
    return x;
}`, 'java', 'sm')}
<ul style="font-size:19px;margin-top:6px">
<li>n nút ⇒ n + 1 dấu "#" ⇒ chuỗi O(n), hai chiều đều <b>O(n)</b></li>
<li>Tách theo dấu phẩy: <code>-12</code> là <b>một</b> token, không phải "-", "1", "2"</li>
</ul>
${nho('PASS round trip 5000 cây ngẫu nhiên + MIN/MAX. LC 297.')}`, '0.85fr 1.15fr') },

  /* 10 */
  { t: 'Trie (cây tiền tố): mỗi cạnh là một chữ', body: hai(`${trieSvg(['car', 'cart', 'care', 'cat', 'do', 'dog'], { w: 470, dy: 58 })}
${nho('Chèn car, cart, care, cat, do, dog. Vòng xanh kép = có từ <b>kết thúc</b> ở nút đó (<code>end = true</code>).')}
${out('6 words, 19 letters -> 10 nodes (root included)', 'margin-top:8px;font-size:15px')}`,
  `${code(`class TrieNode {
    TrieNode[] next = new TrieNode[26]; // a..z
    boolean end;     // có từ KẾT THÚC ở đây
    int pass;        // số từ đi QUA đây
}
void insert(String w) {
    TrieNode x = root; x.pass++;
    for (char c : w.toCharArray()) {
        if (x.next[c - 'a'] == null)
            x.next[c - 'a'] = new TrieNode();
        x = x.next[c - 'a']; x.pass++;
    }
    x.end = true;
}`, 'java', 'sm')}
${o('<b>Tiền tố chung chỉ lưu một lần:</b> "car", "cart", "care", "cat" dùng chung c → a. Chèn/tìm một từ độ dài L: <b>O(L)</b>, không phụ thuộc số từ.', 'xanh')}`, '0.95fr 1.05fr') },

  /* 11 */
  { t: 'Trie: tìm từ, tìm theo tiền tố, đếm', body: hai(`${trieSvg(['car', 'cart', 'care', 'cat', 'do', 'dog'], { w: 440, dy: 54, to: 'car', nhanPass: true })}
${nho('Số xanh cạnh nút = <code>pass</code>. Đi theo "car" (cam): dừng ở nút r, pass = <b>3</b> (car, care, cart).')}
${out(`search(ca)=false startsWith(ca)=true
search(car)=true search(ce)=false
countPrefix(car)=3 countPrefix(do)=2 countPrefix(x)=0`, 'margin-top:6px;font-size:13.5px')}`,
  `${code(`TrieNode walk(String s) {        // O(len(s))
    TrieNode x = root;
    for (char c : s.toCharArray()) {
        x = x.next[c - 'a'];
        if (x == null) return null;
    }
    return x;
}
boolean search(String w) {
    TrieNode x = walk(w); return x != null && x.end; }
boolean startsWith(String p) {
    TrieNode x = walk(p); return x != null && x.pass > 0; }
int countPrefix(String p) {
    TrieNode x = walk(p); return x == null ? 0 : x.pass; }`, 'java', 'sm')}
${o('<b>Bẫy:</b> "ca" đi tới được nhưng <code>end = false</code> ⇒ search <b class="do">false</b>. Trie rỗng: root vẫn có ⇒ <code>startsWith("")</code> phải xét <code>pass &gt; 0</code>.', 'do2')}`, '0.9fr 1.1fr') },

  /* 12 */
  { t: 'Trie: gợi ý tự hoàn thành — và khi nào hơn HashSet', body: hai(`${code(`// DFS dưới nút tiền tố, chữ a..z
// ⇒ từ ra theo thứ tự TỪ ĐIỂN
void dfs(TrieNode x, StringBuilder sb) {
    if (out.size() == k) return;
    if (x.end) out.add(sb.toString());
    for (int c = 0; c < 26; c++)
        if (x.next[c] != null) {
            sb.append((char) ('a' + c));
            dfs(x.next[c], sb);
            sb.setLength(sb.length() - 1);  // quay lui
        }
}`, 'java', 'sm')}
${out(`suggest(ca, 3)=[car, care, cart]
suggest(d, 5)=[do, dog]
PASS 15000 queries vs scanning a word list`, 'margin-top:6px;font-size:14px')}`,
  `${out(`20000 words, 120251 letters, trie nodes 72505
pointer slots 26 x nodes = 1885130, used 72504 (3%)
1000 prefix counts:
  trie 1997 node steps
  scan 20000000 words examined`, 'font-size:13.5px')}
${bang([
    ['Có đúng từ w không?', 'O(L)', 'O(L), thường nhanh hơn'],
    ['Bao nhiêu từ bắt đầu bằng p?', xanhB('O(|p|)'), '<b class="do">quét n từ</b>'],
    ['Gợi ý theo thứ tự từ điển', xanhB('DFS, có sẵn thứ tự'), 'quét + sắp'],
    ['Bộ nhớ', '<b class="do">26 con trỏ/nút</b>, 97% trống', 'gọn hơn'],
  ], ['Câu hỏi', 'Trie', 'HashSet'], 'font-size:16px;margin-top:6px')}
${o('Chỉ cần "có hay không" ⇒ <b>HashSet</b>. Cần <b>tiền tố</b> ⇒ <b>Trie</b>.', 'xanh')}`, '1fr 1fr') },

  /* 13 */
  { t: 'Cây phân đoạn (segment tree): cây nằm trong mảng', body: `${segSvg(A8, { w: 900 })}
${hai(`<ul style="font-size:19px">
<li>Mảng a = [5, 3, 7, 9, 6, 4, 1, 2]; mỗi nút giữ <b>tổng</b> của đoạn [l..r] ghi trên nó</li>
<li>Nút 1 = cả mảng; con của nút v là <b>2v</b> và <b>2v + 1</b> — như heap (bài 4.D), không cần con trỏ</li>
<li>Mảng <code>new long[4 * n]</code> luôn đủ; cao ⌈log₂ n⌉ + 1</li>
</ul>`, `${code(`void build(int v, int l, int r) {
    if (l == r) { sum[v] = a[l]; return; }
    int m = (l + r) / 2;
    build(2 * v, l, m); build(2 * v + 1, m + 1, r);
    sum[v] = sum[2 * v] + sum[2 * v + 1];
}`, 'java', 'sm')}
${nho('Số xanh nhỏ = chỉ số nút trong mảng. Dựng: O(n). Đổi <code>+</code> thành <code>Math.min</code> là có cây min.')}`, '1fr 1.05fr')}` },

  /* 14 */
  { t: 'Segment tree: truy vấn tổng a[2..6] và cập nhật điểm', body: `${segSvg(A8, { w: 900, st: { '0-7': 'cam', '0-3': 'cam', '4-7': 'cam', '6-7': 'cam', '2-3': 'xanh', '4-5': 'xanh', '6-6': 'xanh', '0-1': 'xam', '7-7': 'xam' } })}
${hai(`${bang([
    ['<span style="color:#2f7d4f;font-weight:800">nằm trọn</span> trong [2..6]', 'trả <code>sum[v]</code>, dừng', '[2..3]=16, [4..5]=10, [6..6]=1'],
    ['<span style="color:#e08a1e;font-weight:800">cắt ngang</span>', 'chia xuống hai con', '[0..7], [0..3], [4..7], [6..7]'],
    ['<span style="color:#8c8c8c;font-weight:800">ngoài</span>', 'trả 0', '[0..1], [7..7]'],
  ], ['Nút', 'Làm gì', 'Ở đây'], 'font-size:16.5px')}
${nho('16 + 10 + 1 = <b>27</b>, thăm 9 nút. Mỗi tầng ≤ 4 nút được thăm ⇒ <b>O(log n)</b>. Đo thật n = 1000: nhiều nhất 39 nút.')}`,
  `${out(`a[3] = 0, path: [3]=0 [2..3]=7 [0..3]=15 [0..7]=28
sum a[2..6] = 18, min a[2..6] = 0
PASS 60000 random updates/queries vs a loop`, 'font-size:14px')}
${o('<b>Cập nhật điểm:</b> chỉ các nút trên đường lá → gốc đổi (4 nút) ⇒ <b>O(log n)</b>. Mảng tiền tố (⭐ CS.2) phải dựng lại <b class="do">O(n)</b> mỗi lần sửa.', 'xanh')}`, '1.05fr 1fr')}` },

  /* 15 */
  { t: 'Lazy propagation: cộng cả đoạn trong O(log n)', body: hai(`${out(`a = 8 zeros; add +3 on a[2..5]:
    tag [2..3] +3, sum 6
    tag [4..5] +3, sum 6
add +10 on a[5..7]:
    push +3 from [4..5] to [4..4] and [5..5]
    tag [5..5] +10, sum 13
    tag [6..7] +10, sum 20
sum a[3..5]:
    push +3 from [2..3] to [2..2] and [3..3]
  = 19`, 'font-size:14px')}
${o('<b>Ý tưởng:</b> nút nằm trọn trong đoạn cần cộng ⇒ cộng vào tổng của nó và <b>ghi nợ</b> <code>tag</code> cho các con, <b>không</b> đi xuống. Chỉ khi buộc phải đi xuống mới <b>đẩy nợ</b> (push).', 'xanh')}
${nho('<code>query</code> cũng gọi <code>push</code> trước khi chia. <b class="do">Quên push</b> ⇒ con đọc tổng cũ. PASS 90000 phép so với vòng lặp.')}`,
  `${code(`void apply(int v, int l, int r, long x) {
    sum[v] += x * (r - l + 1);   // cả đoạn tăng x
    tag[v] += x;                 // con còn NỢ x
}
void push(int v, int l, int r) {
    if (tag[v] == 0) return;
    int m = (l + r) / 2;
    apply(2 * v, l, m, tag[v]);
    apply(2 * v + 1, m + 1, r, tag[v]);
    tag[v] = 0;
}
void add(int v, int l, int r, int ql, int qr, long x) {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) { apply(v, l, r, x); return; }
    push(v, l, r);               // xuống thì trả nợ trước
    int m = (l + r) / 2;
    add(2 * v, l, m, ql, qr, x); add(2 * v + 1, m + 1, r, ql, qr, x);
    sum[v] = sum[2 * v] + sum[2 * v + 1];
}`, 'java', 'sm')}`, '0.9fr 1.1fr') },

  /* 16 */
  { t: 'Fenwick (BIT): lowbit = i &amp; −i', body: hai(`${out(` i  i(bin)  -i(low 5 bits)  i & -i  t[i] covers
 1  00001   11111            1      (0..1]
 2  00010   11110            2      (0..2]
 3  00011   11101            1      (2..3]
 4  00100   11100            4      (0..4]
 6  00110   11010            2      (4..6]
 8  01000   11000            8      (0..8]
12  01100   10100            4      (8..12]
13  01101   10011            1      (12..13]`, 'font-size:14px')}
${o('<b>Vì sao i &amp; −i ra bit 1 thấp nhất:</b> −i = ~i + 1 (bù hai). Đảo bit rồi cộng 1 làm các số 0 cuối thành 0 trở lại và bit 1 thấp nhất quay về 1; mọi bit cao hơn bị đảo ⇒ AND chỉ còn đúng bit đó.', 'xanh')}`,
  `${fenSvg({ n: 16, w: 540, doc: [13, 12, 8] })}
${nho('Mỗi thanh: đoạn <b>(i − lowbit(i), i]</b> mà <code>t[i]</code> giữ tổng. Cam: ba thanh ghép thành tổng a[1..13].')}
<ul style="font-size:19px;margin-top:4px">
<li>i lẻ ⇒ lowbit 1 ⇒ t[i] chỉ giữ a[i]</li>
<li>i = 2ᵏ ⇒ t[i] giữ cả tiền tố a[1..i]</li>
<li>Đánh số <b>từ 1</b>: lowbit(0) = 0 ⇒ vòng lặp đứng yên mãi</li>
</ul>`, '1fr 1fr') },

  /* 17 */
  { t: 'Fenwick: tổng tiền tố và cập nhật trong O(log n)', body: hai(`${code(`long[] t = new long[n + 1];          // 1-based
void add(int i, long x) {             // a[i] += x
    for (; i <= n; i += i & -i) t[i] += x;
}
long prefix(int i) {                  // a[1] + … + a[i]
    long s = 0;
    for (; i > 0; i -= i & -i) s += t[i];
    return s;
}
long range(int l, int r) { return prefix(r) - prefix(l - 1); }`, 'java', 'sm')}
${fenSvg({ n: 16, w: 520, ghi: [5, 6, 8, 16] })}
${nho('Xanh: add(5) phải sửa mọi thanh <b>chứa</b> ô 5 — t[5], t[6], t[8], t[16].')}`,
  `${out(`prefix(13) reads t[13], t[12], t[8]
add(5) writes t[5], t[6], t[8], t[16] (n = 16)
t[1..8] = [5, 8, 7, 24, 6, 10, 1, 37]
sum a[2..6] = 27
after a[3] = 0: sum a[2..6] = 18`, 'font-size:14.5px')}
${o('<b>prefix</b> bỏ bit 1 thấp nhất mỗi vòng (13 → 12 → 8 → 0); <b>add</b> cộng lowbit (5 → 6 → 8 → 16). Số bit ≤ log₂ n ⇒ cả hai <b>O(log n)</b>, bộ nhớ n + 1.', 'xanh')}
${o('<b>Bẫy:</b> Fenwick lưu <b>phần cộng thêm</b>. "Đặt a[3] = 0" (đang là 9) là <code>add(4, −9)</code>, không phải <code>add(4, 0)</code>. Chỉ số mảng 0-based ⇒ <b class="do">+1</b>.', 'do2')}
${nho('Fenwick ngắn hơn segment tree nhưng chỉ hợp phép có "trừ ngược" (tổng, đếm) — min/max đoạn thì dùng segment tree.')}`, '1fr 1fr') },

  /* 18 */
  { t: 'Đếm nghịch thế bằng Fenwick (nối ⭐ CS.5)', body: hai(`${bang([
    ['0', '5', '4', '0', '0', '+0'], ['1', '2', '2', '1', '0', '+1'], ['2', '3', '3', '2', '1', '+1'],
    ['3', '8', '5', '3', '3', '+0'], ['4', '1', '1', '4', '0', '<b class="do">+4</b>'],
  ], ['j', 'a[j]', 'hạng', 'số trước', 'trước ≤ nó', 'lớn hơn'], 'font-size:17px')}
<p style="font-size:20px;margin-top:6px">[5, 2, 3, 8, 1] ⇒ 1 + 1 + 4 = <b class="do">6</b> — đúng như merge sort ở ⭐ CS.5.</p>
${out(`huge values [1000000000, -1000000000, 7, 7, 0]
  -> 6 (brute 6)
n = 100000 reversed -> 4999950000
PASS 3000 random arrays vs O(n^2)`, 'font-size:14px')}`,
  `${code(`// nén toạ độ: giá trị -> hạng 1..m
int[] s = distinctSorted(a);   // m giá trị
for (int j = 0; j < a.length; j++) {
    int r = Arrays.binarySearch(s, 0, m, a[j]) + 1;
    inv += j - prefix(r);   // trước mà LỚN hơn a[j]
    add(r, 1);              // đánh dấu đã gặp a[j]
}`, 'java', 'sm')}
${o('Fenwick đánh chỉ số theo <b>giá trị</b>: <code>prefix(r)</code> = số phần tử đã gặp có giá trị ≤ a[j]. Giá trị tới 10⁹ hay âm ⇒ <b>nén toạ độ</b> về 1..m trước.', 'xanh')}
${bang([['Merge sort (CS.5)', 'O(n log n)', 'O(n)', 'đảo chỗ mảng'], ['Fenwick', 'O(n log n)', 'O(n)', 'đi một lượt, trả lời <b>từng</b> j']], ['', 'Thời gian', 'Bộ nhớ', 'Ghi chú'], 'font-size:16.5px;margin-top:6px')}
${nho('<code>inv</code> phải là <b>long</b>: 4 999 950 000 &gt; 2³¹. Bài tập 6 (LC 315) dùng đúng khuôn này, đi từ phải.')}`, '1fr 1fr') },

  /* 19 */
  { t: 'LCA bằng nhảy nhị phân (binary lifting): bảng up', body: hai(`${cayTQ(LIFT({ 9: 'lam', 8: 'lam', 0: 'xanh' }), { w: 360, dy: 58 })}
${nho('Cây có gốc 0: parent = {−, 0, 0, 1, 1, 2, 3, 3, 5, 6}.')}`,
  `${out(`up[0] = [0, 0, 0, 1, 1, 2, 3, 3, 5, 6]
up[1] = [0, 0, 0, 0, 0, 0, 1, 1, 2, 3]
up[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
up[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
3rd ancestor of 9 = 1, 4th = 0`, 'font-size:15px')}
${code(`// up[k][v] = tổ tiên cách v đúng 2^k bước
for (int k = 1; k < LOG; k++)
    for (int v = 0; v < n; v++)
        up[k][v] = up[k - 1][up[k - 1][v]];  // 2^k = 2^(k-1) + 2^(k-1)`, 'java', 'sm')}
${o('<b>Tổ tiên thứ k</b>: viết k ở nhị phân, nhảy <code>up[b]</code> cho mỗi bit 1 — 3 = 2 + 1: 9 → 6 → <b>1</b>. Chuẩn bị O(n log n) thời gian + bộ nhớ; mỗi truy vấn O(log n).', 'xanh')}
${nho('Cha của gốc = chính gốc ⇒ nhảy quá cao thì dừng ở gốc, không ra −1 gây lỗi chỉ số.')}`, '0.8fr 1.2fr') },

  /* 20 */
  { t: 'Binary lifting: truy vấn LCA từng bước', body: hai(`${code(`int lca(int u, int v) {
    if (depth[u] < depth[v]) { int t = u; u = v; v = t; }
    u = kth(u, depth[u] - depth[v]);  // 1) cùng độ sâu
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; k--)  // 2) nhảy lớn trước
        if (up[k][u] != up[k][v]) {     //    chỉ khi còn KHÁC
            u = up[k][u]; v = up[k][v];
        }
    return up[0][u];                    // 3) cha = LCA
}`, 'java', 'sm')}
${o('<b>Vì sao chỉ nhảy khi khác nhau:</b> tới cùng một nút thì đó là LCA <b>hoặc cao hơn</b> — không biết đã quá chưa. Giữ u, v ngay <b>dưới</b> LCA, cuối cùng lên một bước.', 'xanh')}`,
  `${out(`lca(9, 7):
  same depth: 6 and 7
  2^3: both reach 0 (at or above LCA) -> skip
  2^2: both reach 0 (at or above LCA) -> skip
  2^1: both reach 1 (at or above LCA) -> skip
  2^0: both reach 3 (at or above LCA) -> skip
  = 3
lca(9, 8):
  same depth: 6 and 8
  2^3: both reach 0 (at or above LCA) -> skip
  2^2: both reach 0 (at or above LCA) -> skip
  jump 2^1 -> 1, 2
  2^0: both reach 0 (at or above LCA) -> skip
  = 0`, 'font-size:13px;line-height:1.3')}
${nho('PASS 40000 truy vấn (dây sâu 3000, u = v) so với leo từng bước.')}
${bang([['Leo từng bước', 'O(1)', 'O(n) mỗi lần'], ['Binary lifting', 'O(n log n)', xanhB('O(log n)')]], ['', 'Chuẩn bị', 'Mỗi truy vấn'], 'font-size:17px;margin-top:6px')}`, '1.05fr 0.95fr') },

  /* 21 */
  { t: 'TreeMap / TreeSet: cây đỏ-đen có sẵn trong Java', body: hai(`${code(`TreeMap<Integer, String> price = new TreeMap<>();
// khoá 10, 25, 40, 55, 70, 90
price.floorKey(50);    // lớn nhất ≤ 50
price.ceilingKey(50);  // nhỏ nhất ≥ 50
price.lowerKey(55);    // lớn nhất < 55 (ngặt)
price.higherKey(90);   // nhỏ nhất > 90
price.subMap(25, true, 70, false);  // [25, 70)
price.headMap(40);     // < 40
price.tailMap(70);     // ≥ 70`, 'java', 'sm')}
${o('Cây đỏ-đen của A.1 ⇒ mọi thao tác trên <b>O(log n)</b>, duyệt theo thứ tự khoá. <code>subMap/headMap</code> là <b>khung nhìn</b> (view), không sao chép.', 'xanh')}`,
  `${out(`floorKey(50)=40 ceilingKey(50)=55
floorKey(55)=55 lowerKey(55)=40 higherKey(90)=null
subMap[25, 70) = {25=book, 40=bag, 55=shoes}
headMap(40) = {10=pen, 25=book}
tailMap(70) = {70=watch, 90=phone}
first 10 last 90
descending [90, 70, 55, 40, 25, 10]
floorKey(5) = null
int x = price.floorKey(5) -> NullPointerException`, 'font-size:14px')}
${o('<b>Bẫy:</b> không có khoá phù hợp ⇒ trả <b>null</b>. Gán vào <code>int</code> ⇒ tự mở hộp (unboxing) ⇒ <b class="do">NullPointerException</b>. Luôn nhận bằng <code>Integer</code> rồi kiểm null.', 'do2')}
${nho('floor/ceiling dùng ≤ ≥; lower/higher dùng &lt; &gt;. TreeSet có đúng các hàm này (floor, ceiling…).')}`, '1fr 1fr') },

  /* 22 */
  { t: 'TreeMap giải bài đặt lịch — và chọn cấu trúc nào', body: hai(`${code(`// lịch [start, end), không được chồng (LC 729)
boolean book(int s, int e) {
    Map.Entry<Integer, Integer> before = cal.floorEntry(s);
    Integer after = cal.ceilingKey(s);
    if (before != null && before.getValue() > s) return false;
    if (after != null && after < e) return false;
    cal.put(s, e); return true;
}`, 'java', 'sm')}
${out(`[10,20)=true [15,25)=false [20,30)=true
[5,10)=true [8,12)=false [30,31)=true
PASS 80000 random bookings vs checking all`, 'margin-top:6px;font-size:14px')}
${nho('Chỉ hai <b>hàng xóm</b> theo khoá có thể va ⇒ O(log n) mỗi lần đặt, thay vì so với cả n lịch.')}
${o('Phỏng vấn Java: có sẵn TreeMap thì <b>đừng tự viết</b> cây cân bằng. Segment tree, Fenwick, Trie <b>không</b> có trong JDK — phải tự viết.', 'xanh')}`,
  `${bang([
    ['Tập khoá thêm/xoá, hỏi "gần nhất ≤ x"', '<b>TreeMap/TreeSet</b>'],
    ['Mảng cố định chỗ, sửa phần tử, hỏi tổng đoạn', '<b>Fenwick</b> (ngắn) hoặc segment tree'],
    ['Hỏi min/max đoạn, hoặc cộng cả đoạn', '<b>Segment tree</b> (+ lazy)'],
    ['Mảng KHÔNG đổi, hỏi tổng đoạn', 'mảng tiền tố O(1) (⭐ CS.2)'],
    ['Cửa sổ trượt cần giá trị gần x', 'TreeSet (bài tập 7)'],
    ['Chuỗi, tiền tố, gợi ý', '<b>Trie</b>'],
  ], ['Tình huống', 'Dùng'], 'font-size:17.5px')}`, '1.05fr 0.95fr') },

  /* 23 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['"Theo từng tầng", "zigzag", "nhìn từ phải", "rộng nhất", "khoảng cách k"', 'BFS chụp <code>size</code>', '3–4'],
    ['"Có phải BST", "nhỏ thứ k trong BST"', 'Cận (lo, hi) / inorder tăng', '5'],
    ['"Tổ tiên chung", nhiều truy vấn trên cùng cây', 'LCA đệ quy · binary lifting', '6, 19–20'],
    ['"Đường dài nhất / tổng lớn nhất" giữa hai nút bất kỳ', 'Trả một nhánh, cập nhật đường gập', '7'],
    ['"Dựng lại cây", "lưu cây xuống chuỗi"', 'HashMap vị trí inorder · preorder + "#"', '8–9'],
    ['"Bắt đầu bằng", "gợi ý", "từ có dấu .", XOR lớn nhất', 'Trie (chữ / bit)', '10–12'],
    ['Tổng/min đoạn <b>và</b> có sửa, n, q ~ 10⁵', 'Segment tree · Fenwick', '13–17'],
    ['"Cộng x vào cả đoạn [l..r]" rồi hỏi tổng', 'Lazy propagation', '15'],
    ['"Đếm số nhỏ hơn đứng sau", nghịch thế', 'Fenwick + nén toạ độ', '18'],
    ['"Gần nhất ≤ x", đặt lịch, khoảng khoá', 'TreeMap / TreeSet', '21–22'],
  ], ['Thấy trong đề', 'Nghĩ tới', 'Slide'], 'font-size:17.5px')}` },

  /* 24 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['BFS theo tầng + biến thể', 'O(n)', 'O(chiều rộng)', 'mỗi nút vào/ra hàng đợi một lần'],
    ['Kiểm BST · đường kính · tổng lớn nhất', 'O(n)', 'O(h)', 'một lần DFS'],
    ['LCA trên BST / cây thường', 'O(h) / O(n)', 'O(1) / O(h)', 'đi một đường / thăm mọi nút'],
    ['Dựng từ pre + in · serialize', 'O(n)', 'O(n)', 'HashMap vị trí · n + 1 dấu #'],
    ['Trie: chèn, tìm, đếm tiền tố', 'O(L)', 'O(tổng độ dài · 26)', 'một nút mỗi chữ'],
    ['Segment tree: dựng · truy vấn · sửa', 'O(n) · O(log n) · O(log n)', 'O(4n)', '≤ 4 nút mỗi tầng'],
    ['Lazy: cộng đoạn · tổng đoạn', 'O(log n)', 'O(4n) + tag', 'nợ đẩy xuống khi cần'],
    ['Fenwick: tiền tố · sửa', 'O(log n)', 'O(n)', 'mỗi vòng bỏ/thêm một bit'],
    ['Nghịch thế bằng Fenwick', 'O(n log n)', 'O(n)', 'sắp để nén + n lần O(log n)'],
    ['Binary lifting: dựng · LCA', 'O(n log n) · O(log n)', 'O(n log n)', 'bảng log n tầng'],
    ['TreeMap: put/get/floor/ceiling', 'O(log n)', 'O(n)', 'cây đỏ-đen cao ≤ 2 log n'],
  ], ['Thuật toán', 'Thời gian', 'Bộ nhớ', 'Vì sao'], 'font-size:16px;line-height:1.22')}
${nho('h = chiều cao cây: log n nếu cân bằng, tới n nếu là dây — đệ quy sâu n có thể tràn ngăn xếp (StackOverflowError).')}` },

  /* 25 */
  { t: 'Tóm tắt', body: `<ul style="font-size:22px">
<li>BFS theo tầng: <b>chụp <code>size</code></b> đầu mỗi tầng ⇒ zigzag, nhìn từ phải, độ rộng (đánh số lại mỗi tầng)</li>
<li>BST hợp lệ: cận (lo, hi) từ <b>mọi tổ tiên</b> hoặc inorder tăng ngặt — <span class="do">chỉ so với con là sai</span></li>
<li>Đường kính / tổng lớn nhất: <b>trả một nhánh, cập nhật đường gập</b>; khởi tạo MIN, không phải 0</li>
<li>Dựng cây: HashMap vị trí inorder ⇒ O(n); serialize: preorder <b>kèm "#"</b></li>
<li>Trie: O(L) mỗi thao tác, mạnh ở <b>tiền tố</b>; tốn bộ nhớ — chỉ cần "có/không" thì HashSet</li>
<li>Segment tree: nút v có con 2v, 2v+1, truy vấn/sửa O(log n); cộng cả đoạn ⇒ <b>lazy</b> (ghi nợ, đẩy khi cần)</li>
<li>Fenwick: <b>i &amp; −i</b> = bit 1 thấp nhất; prefix bỏ bit, add thêm bit; lưu phần <b>cộng thêm</b>, đánh số từ 1</li>
<li>Binary lifting: up[k][v] = 2ᵏ bước; LCA nhảy lớn trước khi còn khác. TreeMap: floor/ceiling O(log n), <span class="do">coi chừng null</span></li>
</ul>` },
]);
