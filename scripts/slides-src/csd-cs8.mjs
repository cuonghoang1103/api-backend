/**
 * csd-cs8.mjs — CSD201 ⭐ Chuyên sâu 8: ĐỒ THỊ NÂNG CAO (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs8.mjs --out <dir>
 *
 * Nối tiếp bài trường Chương 5 (biểu diễn, BFS/DFS, Dijkstra, Floyd + ma trận P, Prim/Kruskal, Euler/Hamilton,
 * tô màu, khớp/cầu bằng cách xoá thử) và A.2 (Union-Find) — không giảng lại. Mọi bảng từng bước, mọi con số
 * (PASS/FAIL, số nút mở rộng, số lần sai) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs8/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs8', code: 'CS8', title: 'Đồ thị nâng cao', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf', lam: '#2b6cb0', tim: '#7b3fa0' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', lam: '#e3eefa', tim: '#f1e6f8' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '', st = '') => `<div class="o ${cls}"${st ? ` style="${st}"` : ''}>${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;
const xanhB = (t) => `<b style="color:#2f7d4f">${t}</b>`;
const hai = (a, b, cols = '1fr 1fr') => `<div class="hai" style="grid-template-columns:${cols.split(' ').map((c) => `minmax(0,${c})`).join(' ')}"><div>${a}</div><div>${b}</div></div>`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ───────────── SVG: đồ thị ─────────────
 * nut: { id: [x, y] } · canh: [[u, v, nhãn?, màu?, cong?]] · co: có hướng (mũi tên)
 * mau: { id: 'do'|'xanh'|'cam'|'lam'|'xam'|'tim' } · tren/duoi: { id: chữ nhỏ trên/dưới nút }
 */
function doThi(nut, canh, { w = 460, h = 300, r = 20, fs = 17, co = true, mau = {}, tren = {}, duoi = {}, nhanFs = 15 } = {}) {
  let e = '', s = '';
  for (const [u, v, nhan, m, cong = 0] of canh) {
    const [x1, y1] = nut[u], [x2, y2] = nut[v];
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const px = -uy, py = ux;                                    // vuông góc
    const cx = (x1 + x2) / 2 + px * cong, cy = (y1 + y2) / 2 + py * cong;
    // điểm đầu/cuối cắt ở mép nút, theo hướng tới điểm điều khiển
    const a1 = Math.atan2(cy - y1, cx - x1), a2 = Math.atan2(cy - y2, cx - x2);
    const sx = x1 + Math.cos(a1) * r, sy = y1 + Math.sin(a1) * r;
    const ex = x2 + Math.cos(a2) * (r + (co ? 3 : 0)), ey = y2 + Math.sin(a2) * (r + (co ? 3 : 0));
    const col = m ? MAU[m] : '#8c8c8c', sw = m ? 3.6 : 2;
    e += `<path d="M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}" fill="none" stroke="${col}" stroke-width="${sw}"/>`;
    if (co) {
      const ang = Math.atan2(ey - cy, ex - cx), k = 12;
      const p1 = [ex + Math.cos(ang) * 3, ey + Math.sin(ang) * 3];
      const p2 = [p1[0] - k * Math.cos(ang - 0.42), p1[1] - k * Math.sin(ang - 0.42)];
      const p3 = [p1[0] - k * Math.cos(ang + 0.42), p1[1] - k * Math.sin(ang + 0.42)];
      e += `<polygon points="${p1.join(',')} ${p2.join(',')} ${p3.join(',')}" fill="${col}"/>`;
    }
    if (nhan !== undefined && nhan !== '') {
      const mx = 0.25 * x1 + 0.5 * cx + 0.25 * x2, my = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
      const off = cong ? Math.sign(cong) * 13 : 13;
      const tx = mx + px * off, ty = my + py * off + 5;
      const neg = String(nhan).startsWith('-') || String(nhan).startsWith('−');
      e += `<rect x="${tx - 15}" y="${ty - 15}" width="30" height="20" rx="4" fill="#fff" opacity="0.9"/>`;
      e += `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="${nhanFs}" font-weight="800" fill="${neg ? MAU.do : MAU.nau}">${String(nhan).replace('-', '−')}</text>`;
    }
  }
  for (const [id, [x, y]] of Object.entries(nut)) {
    const m = mau[id];
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${m ? NEN[m] : NEN.trang}" stroke="${m ? MAU[m] : MAU.vien}" stroke-width="${m ? 2.8 : 1.8}"/>`;
    s += `<text x="${x}" y="${y + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#262626">${id}</text>`;
    if (tren[id] !== undefined) s += `<text x="${x}" y="${y - r - 7}" text-anchor="middle" font-size="14" font-weight="700" fill="${MAU.lam}">${tren[id]}</text>`;
    if (duoi[id] !== undefined) s += `<text x="${x}" y="${y + r + 17}" text-anchor="middle" font-size="14" font-weight="700" fill="${MAU.nau}">${duoi[id]}</text>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" font-family="Arial, sans-serif">${e}${s}</svg>`;
}

/* ───────────── SVG: lưới ─────────────
 * rows: mảng chuỗi; kieu: { ký tự: { nen, vien?, chu? } }; so: mảng số (hoặc chuỗi) in giữa ô (null = không in)
 */
function luoi(rows, kieu, { o: cs = 40, so = null, fs = 16, gap = 0 } = {}) {
  const R = rows.length, C = rows[0].length;
  let s = '';
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const ch = rows[r][c], k = kieu[ch] || { nen: '#fff' };
    s += `<rect x="${c * cs + 1}" y="${r * cs + 1}" width="${cs - 2 - gap}" height="${cs - 2 - gap}" rx="3" fill="${k.nen}" stroke="${k.vien || '#cfcfcf'}" stroke-width="1.2"/>`;
    const t = so ? so[r][c] : k.chu;
    if (t !== null && t !== undefined && t !== '') s += `<text x="${c * cs + cs / 2}" y="${r * cs + cs / 2 + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${k.mauChu || '#262626'}">${t}</text>`;
  }
  return `<svg viewBox="0 0 ${C * cs + 2} ${R * cs + 2}" width="${C * cs + 2}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── dữ liệu đồ thị dùng lại ───────────── */
const MON = { PRF: [45, 70], DBI: [45, 230], PRO: [185, 70], CSD: [330, 30], LAB: [330, 130], PRJ: [330, 230], SWP: [470, 130] };
const MON_CANH = [['PRF', 'PRO'], ['PRO', 'CSD'], ['PRO', 'LAB'], ['PRO', 'PRJ'], ['DBI', 'PRJ'], ['PRJ', 'SWP'], ['CSD', 'SWP']];

const BF = { S: [45, 150], A: [200, 45], B: [200, 255], C: [320, 150], D: [445, 150] };
const BF_CANH = (to = {}) => [['S', 'A', 5, to.SA], ['S', 'B', 8, to.SB], ['A', 'D', -3, to.AD], ['A', 'B', 9, to.AB], ['B', 'C', -4, to.BC],
  ['B', 'D', 7, to.BD], ['A', 'C', 6, to.AC, -18], ['C', 'A', -2, to.CA, -18], ['D', 'C', 6, to.DC]];

const A_STAR_DJ = [
  'oooooooooooooooo', 'oooooooooooooooo', 'oooooooooo#ooooo', 'oooooooooo#ooooo',
  'ooS****ooo#oo*G.', 'oooooo*ooo#oo*o.', 'oooooo***o#oo*oo', 'oooooooo******oo'];
const A_STAR_AS = [
  '................', '................', '..oooooooo#.....', '.ooooooooo#.....',
  'ooS*******#***G.', '.oooooooo*#*....', '..ooooooo*#*....', '.........***....'];
const KIEU_AS = {
  '.': { nen: '#ffffff' }, o: { nen: '#dbe9f8', vien: '#9fc0e6' }, '#': { nen: '#404040', vien: '#404040' },
  '*': { nen: '#f7c98b', vien: '#e08a1e' }, S: { nen: '#2f7d4f', vien: '#2f7d4f', chu: 'S', mauChu: '#fff' }, G: { nen: '#e02020', vien: '#e02020', chu: 'G', mauChu: '#fff' },
};

export const slides = lamDeck('ĐỒ THỊ NÂNG CAO', [
  /* 1 */
  { cover: true, t: 'Đồ thị nâng cao', sub: 'Tô-pô Kahn · Bellman-Ford · chu trình âm · Floyd truy vết · 0-1 BFS · BFS nhiều nguồn<br>hai phía · SCC (Kosaraju, Tarjan) · cầu &amp; khớp · A* · BFS trên trạng thái<br>CSD201 · Java 8 — mọi bảng từng bước đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Bản đồ: câu hỏi nào dùng thuật toán nào', body: `${bang([
    ['<b>Tô-pô (Kahn)</b>', '"làm A trước B", có vòng phụ thuộc không', 'O(V + E)', '4–6'],
    ['<b>Bellman-Ford</b>', 'đường ngắn nhất khi có <b>cạnh âm</b>, chu trình âm', 'O(V · E)', '7–9'],
    ['<b>Floyd + next[][]</b>', 'mọi cặp đỉnh, <b>in ra đường đi</b>', 'O(V³)', '10'],
    ['<b>0-1 BFS</b> · <b>BFS nhiều nguồn</b>', 'trọng số chỉ 0/1 · "tới nguồn gần nhất"', 'O(V + E)', '11–12'],
    ['<b>Hai phía</b> (tô 2 màu)', 'chia hai nhóm, không cạnh nào trong cùng nhóm', 'O(V + E)', '13'],
    ['<b>SCC</b> Kosaraju / Tarjan', 'nhóm đỉnh đi tới nhau được', 'O(V + E)', '14–15'],
    ['<b>Cầu &amp; khớp</b> (low-link)', 'cạnh/đỉnh mà mất đi thì mạng đứt', 'O(V + E)', '16'],
    ['<b>A*</b>', 'một đích, có ước lượng khoảng cách', '≤ Dijkstra', '17–18'],
    ['<b>BFS trên trạng thái</b>', 'ít bước nhất giữa hai cấu hình', 'O(số trạng thái)', '19–20'],
  ], ['Thuật toán', 'Câu hỏi nó trả lời', 'Chi phí', 'Slide'], 'font-size:16px;line-height:1.15')}
${hai(o('<b>Trường đã dạy (không lặp):</b> biểu diễn, BFS/DFS, Dijkstra, Floyd + ma trận P, Prim/Kruskal, Euler/Hamilton, tô màu, khớp/cầu bằng xoá thử; Union-Find (A.2).', 'xanh', 'font-size:17px;padding:7px 14px'),
    o('<b>Deck này đi tiếp:</b> dạng đồ thị hỏi nhiều khi phỏng vấn — phụ thuộc, cạnh âm, lưới, liên thông mạnh, tìm đường có ước lượng.', '', 'font-size:17px;padding:7px 14px'))}` },

  /* 3 */
  { t: 'Nhận dạng: đề không nói chữ "đồ thị"', body: `${hai(o(`<b>Lưới (grid)</b><br>đỉnh = ô · cạnh = hai ô trống kề nhau<br><span class="nho">"đảo", "mê cung", "cam thối", "ô gần nhất"</span>`),
    o(`<b>Quan hệ phụ thuộc</b><br>"A trước B" = cạnh có hướng A → B<br><span class="nho">"môn tiên quyết", "build module", "thứ tự chữ cái"</span>`), '1fr 1fr')}
${hai(o(`<b>Biến đổi trạng thái</b><br>đỉnh = <b>cả một cấu hình</b> · cạnh = một nước đi<br><span class="nho">"ít bước nhất", "xoay khoá", "đổi một chữ", "trượt ô"</span>`),
    o(`<b>Bốn câu tự hỏi</b><br>Đỉnh là gì? Cạnh là gì? Có hướng? Có trọng số (âm?)<br><span class="nho">Trả lời xong là chọn được thuật toán (slide 21)</span>`, 'xanh'), '1fr 1fr')}
${out(`grid 3x4 with 2 walls: 10 vertices, 11 edges, no adjacency list stored
prerequisites as edges: {DBI=[PRJ], PRF=[PRO], PRO=[CSD, PRJ]}
lock state 0000 has 8 neighbours [1000, 9000, 0100, 0900, 0010, 0090, 0001, 0009], 10000 states in all
word cold links to any word matching [*old, c*ld, co*d, col*]`, 'font-size:15px')}
${nho('Lưới và trạng thái: <b>không dựng danh sách kề</b> — tính hàng xóm ngay khi cần (4 hướng, 8 cách xoay, 4 mẫu chữ).')}` },

  /* 4 */
  { t: 'Sắp xếp tô-pô bằng Kahn: bóc đỉnh bậc vào 0', body: hai(`${doThi(MON, MON_CANH, { w: 520, h: 270, r: 25, fs: 14, tren: { PRF: 'vào 0', DBI: 'vào 0', PRO: 'vào 1', CSD: '', LAB: 'vào 1', PRJ: 'vào 2', SWP: 'vào 2' }, duoi: { CSD: 'vào 1' }, mau: { PRF: 'xanh', DBI: 'xanh' } })}
${code(`for (int[] e : edges) indeg[e[1]]++;
for (v …) if (indeg[v] == 0) q.add(v); // rảnh
while (!q.isEmpty()) {
    int u = q.poll(); order.add(u);
    for (int w : adj.get(u))
        if (--indeg[w] == 0) q.add(w); // xong
}`, 'java', 'sm')}`,
  `${bang([
    ['PRF', 'PRO', '[DBI PRO]'], ['DBI', '–', '[PRO]'], ['PRO', 'CSD LAB PRJ', '[CSD LAB PRJ]'], ['CSD', '–', '[LAB PRJ]'],
    ['LAB', '–', '[PRJ]'], ['PRJ', 'SWP', '[SWP]'], ['SWP', '–', '[ ]'],
  ], ['Lấy ra', 'Bậc vào về 0', 'Hàng đợi sau'], 'font-size:15.5px;line-height:1.1')}
${out('order [PRF DBI PRO CSD LAB PRJ SWP]', 'margin-top:4px;font-size:15px')}
${o('<b>Bậc vào (in-degree)</b> = số điều kiện còn thiếu. Vào hàng đợi khi điều kiện cuối vừa xong ⇒ mọi cạnh u → v có u đứng <b>trước</b> v. <b>O(V + E)</b>.', 'xanh', 'font-size:18px')}`, '1fr 1fr') },

  /* 5 */
  { t: 'Kahn phát hiện chu trình — và so với cách DFS', body: hai(`${out(`Kahn, thêm cạnh SWP -> PRO:
with SWP->PRO: only 2 of 7 [PRF DBI] -> cycle

DFS 3 màu (đảo hậu thứ tự):
finish order [SWP CSD LAB PRJ PRO PRF DBI]
reversed     [DBI PRF PRO PRJ LAB CSD SWP]
with SWP->PRO: null, back edge SWP -> PRO`, 'font-size:14.5px')}
${out(`PASS 20000 random graphs (12230 with a cycle)
     vs DFS reachability
PASS 20000 random graphs (7770 DAGs) vs Kahn`, 'margin-top:8px;font-size:14px')}
${o('Kahn: vòng PRO → PRJ → SWP → PRO không đỉnh nào về bậc 0 ⇒ lấy ra <b class="do">ít hơn n</b> đỉnh = có chu trình.', 'do2', 'font-size:19px')}
${o('<b>Bẫy DFS:</b> chỉ dùng <code>visited</code> 2 trạng thái ⇒ đỉnh <b>đen</b> (đã xong) bị tưởng là chu trình. Phải phân biệt xám (đang mở) và đen.', 'do2', 'font-size:19px')}`,
  `${bang([
    ['Ý tưởng', 'bóc đỉnh bậc vào 0', 'đỉnh xong DFS sau cùng đứng đầu'],
    ['Cấu trúc', 'hàng đợi + mảng indeg', 'đệ quy + 3 màu'],
    ['Có chu trình khi', 'lấy ra &lt; n đỉnh', 'gặp đỉnh <b>xám</b> (cạnh ngược)'],
    ['Chỉ ra được', 'các đỉnh bị kẹt', 'đúng một cạnh của vòng'],
    ['Theo tầng / học kỳ', xanhB('dễ (slide 6)'), 'khó'],
    ['Rủi ro', '—', 'tràn ngăn xếp khi V lớn'],
  ], ['', 'Kahn (BFS)', 'DFS'], 'font-size:16px;line-height:1.15')}
${o('<b>Hai thứ tự khác nhau, cả hai đều đúng:</b> tô-pô thường <b>không duy nhất</b>. Cần một đáp án cố định (vd. nhỏ nhất theo từ điển) ⇒ Kahn với <code>PriorityQueue</code>.', 'xanh', 'font-size:19px')}`, '1fr 1.05fr') },

  /* 6 */
  { t: 'Xếp lịch môn học có điều kiện tiên quyết', body: hai(`${doThi(MON, MON_CANH, { w: 520, h: 285, r: 25, fs: 14, mau: { PRF: 'xanh', DBI: 'xanh', PRO: 'lam', CSD: 'cam', LAB: 'cam', PRJ: 'cam', SWP: 'tim' }, duoi: { PRF: 'HK1', DBI: 'HK1', PRO: 'HK2', CSD: 'HK3', LAB: 'HK3', PRJ: 'HK3', SWP: 'HK4' } })}
${out(`semester 1: PRF DBI
semester 2: PRO
semester 3: CSD LAB PRJ
semester 4: SWP
minimum semesters = 4
with SWP->PRO: -1
PASS 20000 random graphs (7753 DAGs)
  vs longest chain by brute force`, 'font-size:14.5px')}`,
  `${code(`List<Integer> cur = đỉnh có indeg 0;
int sem = 0, taken = 0;
while (!cur.isEmpty()) {
    sem++; taken += cur.size();  // 1 tầng = 1 HK
    List<Integer> next = new ArrayList<>();
    for (int u : cur)
        for (int w : adj.get(u))
            if (--indeg[w] == 0) next.add(w);
    cur = next;
}
return taken == n ? sem : -1;       // kẹt = vòng`, 'java', 'sm')}
${bang([
    ['Học hết được không? (LC 207)', 'Kahn: lấy ra đủ n'],
    ['Một thứ tự học (LC 210)', 'Kahn: danh sách order'],
    ['Ít học kỳ nhất (LC 1136)', 'Kahn <b>theo tầng</b> = chuỗi dài nhất'],
  ], ['Đề hỏi', 'Trả lời'], 'font-size:16px;line-height:1.1;margin-top:4px')}
${nho('Số học kỳ = số đỉnh trên <b>chuỗi dài nhất</b> PRF → PRO → PRJ → SWP.')}`, '1fr 1fr') },

  /* 7 */
  { t: 'Bellman-Ford: nới MỌI cạnh, lặp V − 1 vòng', body: hai(`${doThi(BF, BF_CANH(), { w: 470, h: 300, r: 21 })}
${bang([
    ['1', 'A=5 B=8 C=11 D=2 <b>C=4 A=2</b>', '0 2 8 4 2'],
    ['2', 'D=−1', '0 2 8 4 <b class="do">−1</b>'],
    ['3', 'không đổi ⇒ dừng sớm', '0 2 8 4 −1'],
  ], ['Vòng', 'Nới được (theo thứ tự cạnh)', 'S A B C D'], 'font-size:16px;line-height:1.1')}
${nho('PASS 4000 đồ thị ngẫu nhiên có cạnh âm so với duyệt mọi đường đơn.')}`,
  `${code(`Arrays.fill(d, INF); d[s] = 0;
for (int r = 1; r <= n - 1; r++) {
    boolean changed = false;
    for (int[] x : edges) {        // x = {u, v, w}
        if (d[x[0]] == INF) continue;
        if (d[x[0]] + x[2] < d[x[1]]) {
            d[x[1]] = d[x[0]] + x[2]; // nới
            changed = true;
        }
    }
    if (!changed) break;           // dừng sớm
}`, 'java', 'sm')}
${o('<b>Vì sao V − 1 vòng đủ:</b> đường ngắn nhất (không có chu trình âm) có ≤ V − 1 cạnh; sau vòng k, mọi đường ngắn nhất ≤ k cạnh đã đúng. <b>O(V · E)</b>.', 'xanh', 'font-size:19px')}
${o('Bỏ qua <code>d[u] == INF</code> là bắt buộc: INF + (−3) &lt; INF ⇒ đỉnh <b class="do">chưa tới được</b> lại "được nới".', 'do2', 'font-size:19px')}
`, '1fr 1fr') },

  /* 8 */
  { t: 'Chạy thật: Dijkstra SAI khi có cạnh âm', body: hai(`${doThi(BF, BF_CANH({ SB: 'cam', BC: 'cam', CA: 'cam' }), { w: 470, h: 300, r: 21, mau: { A: 'do' } })}
${nho('Cam: S → B → C → A = 8 − 4 − 2 = <b>2</b>. Dijkstra đã <b>chốt</b> A = 5 từ bước 2.')}`,
  `${out(`Dijkstra takes S(0) A(5) D(2) B(8) C(4)
Dijkstra S A B C D = [0, 5, 8, 4, 2]
Bellman  S A B C D = [0, 2, 8, 4, -1]
weights  0..10: Dijkstra wrong on 0 of 10000 graphs
weights -5..10: Dijkstra wrong on 1577 of 10000 graphs`, 'font-size:14.5px')}
${o('<b>Vì sao sai:</b> Dijkstra tin "đỉnh nhỏ nhất trong hàng đợi không thể giảm nữa" — chỉ đúng khi mọi cạnh ≥ 0. Cạnh âm đi <b>sau</b> có thể kéo nó xuống. Sai kéo theo: D = 2 tính từ A = 5.', 'do2', 'font-size:19px')}
${o('10000 đồ thị <b>không có chu trình</b> (nên không có chu trình âm), trọng số −5..10: sai <b>1577</b> lần (≈ 16%). Trọng số ≥ 0: <b>0</b> lần.', 'xanh', 'font-size:19px')}
${nho('Bài 5.B của trường đã cho một ví dụ 3 đỉnh; ở đây là thống kê + thuật toán thay thế. "Cộng hằng số cho hết âm" cũng <b class="do">sai</b>: đường nhiều cạnh bị phạt nhiều hơn.')}`, '1fr 1.05fr') },

  /* 9 */
  { t: 'Chu trình âm: vòng thứ V vẫn còn nới được', body: hai(`${doThi({ F: [40, 150], S: [150, 150], E: [150, 270], A: [280, 60], B: [450, 60], C: [365, 205], D: [500, 250] },
    [['F', 'S', 1], ['S', 'A', 4], ['S', 'E', 3], ['A', 'B', 1, 'do'], ['B', 'C', -3, 'do'], ['C', 'A', 1, 'do'], ['C', 'D', 2]],
    { w: 540, h: 310, r: 21, mau: { A: 'do', B: 'do', C: 'do', D: 'do', E: 'xanh', S: 'xanh', F: 'xam' }, duoi: { A: '−∞', B: '−∞', C: '−∞', D: '−∞', F: 'inf' }, tren: { S: 'd = 0', E: '' } })}
${nho('Vòng A → B → C → A = 1 − 3 + 1 = <b class="do">−1</b>: đi thêm một vòng lại rẻ hơn ⇒ không có "đường ngắn nhất". E = 3 không bị ảnh hưởng, F không tới được.')}
${o('<b>Bẫy:</b> chỉ đánh dấu đỉnh vừa nới ở vòng n (ở đây chỉ B) là <b class="do">thiếu</b>: A, C trên vòng và D sau vòng cũng −∞.', 'do2', 'font-size:19px')}`,
  `${out(`after n-1 = 6 rounds:
  S=0 A=-2 B=0 C=-3 D=-1 E=3 F=inf
round 7 still relaxes A->B
final: S=0 A=-inf B=-inf C=-inf D=-inf
       E=3 F=inf
PASS 4000 random graphs (1872 vertices
  at -inf) vs cycle enumeration`, 'font-size:14px')}
${code(`// vòng n còn nới được: đích = -vô cực
for (int[] x : e)
    if (d[x[0]] != INF
        && d[x[0]] + x[2] < d[x[1]]) q.add(x[1]);
for (int v : q) d[v] = NEG;
while (!q.isEmpty()) {       // lan đi tiếp
    int u = q.poll();
    for (int[] x : e)
        if (x[0] == u && d[x[1]] != NEG) {
            d[x[1]] = NEG; q.add(x[1]);
        }
}`, 'java', 'sm')}`, '1fr 1fr') },

  /* 10 */
  { t: 'Floyd-Warshall: truy vết đường đi bằng next[][]', body: hai(`${doThi({ A: [60, 55], B: [320, 55], C: [60, 245], D: [320, 245] },
    [['A', 'B', 3, 'cam'], ['A', 'C', 8], ['B', 'D', 1, 'cam'], ['C', 'B', 5, undefined, -40], ['D', 'A', 2, undefined, -40], ['D', 'C', -5, 'cam']],
    { w: 380, h: 300, r: 22 })}
${nho('Đồ thị của bài trường 5.B (slide 33). Cam: A → B → D → C = 3 + 1 − 5 = −1.')}`,
  `${code(`// đầu: next[i][j] = j nếu có cạnh i -> j
if (d[i][k] + d[k][j] < d[i][j]) {
    d[i][j] = d[i][k] + d[k][j];
    next[i][j] = next[i][k];  // đi về phía k
}
// in đường: theo bước đầu tới khi gặp j
while (i != j) { i = next[i][j]; path.add(i); }`, 'java', 'sm')}
${hai(out(`next[][] (first hop):
  A: A B B B
  B: D B D D
  C: B B C B
  D: A C C D`, 'font-size:14px'), out(`path A->C: A B D C  length -1
path C->A: C B D A  length 8
path B->C: B D C  length -4
C->B = 3: negative cycle?
  true, d[B][B] = -1`, 'font-size:14px'), '0.8fr 1.2fr')}
${o('Trường dùng P[i][j] = k rồi <b>đệ quy</b> hai nửa. <code>next</code> cho đường bằng <b>một vòng lặp</b>. Chu trình âm ⇔ có <code>d[i][i] &lt; 0</code>. PASS 3000 đồ thị (277 có chu trình âm) so với Bellman-Ford từ mọi đỉnh.', 'xanh')}`, '0.85fr 1.15fr') },

  /* 11 */
  { t: '0-1 BFS: trọng số chỉ 0 hoặc 1 — dùng deque', body: hai(`${luoi(['.#..', '##.#', '..#.'], { '.': { nen: '#ffffff' }, '#': { nen: '#595959', vien: '#404040', mauChu: '#fff' } }, { o: 78, fs: 22, so: [[0, 1, 1, 1], [1, 2, 1, 2], [1, 1, 2, 2]] })}
${nho('Ô xám = tường; bước <b>vào</b> tường tốn 1 (phá nó), vào ô trống tốn 0. Số trong ô = số tường phải phá ít nhất để tới đó.')}
${out('walls to break to reach the corner: 2\nPASS 3000 random grids vs Dijkstra', 'font-size:14.5px')}`,
  `${bang([
    ['(0,0) d=0', 'cuối (1,0)=1, cuối (0,1)=1'], ['(1,0) d=1', '<b>đầu</b> (2,0)=1, cuối (1,1)=2'], ['(2,0) d=1', '<b>đầu</b> (2,1)=1'],
    ['(2,1) d=1', 'cuối (2,2)=2'], ['(0,1) d=1', '<b>đầu</b> (0,2)=1'],
  ], ['Lấy ra (pollFirst)', 'Thêm vào deque'], 'font-size:16.5px')}
${code(`if (d[u] + w < d[v]) {
    d[v] = d[u] + w;
    if (w == 0) dq.addFirst(v); // lên ĐẦU
    else        dq.addLast(v);  // xuống CUỐI
}`, 'java', 'sm')}
${o('Deque chỉ chứa hai mức d và d + 1, mức nhỏ ở đầu ⇒ đầu deque luôn nhỏ nhất, như hàng đợi ưu tiên nhưng <b>O(1)</b>. Tổng <b>O(V + E)</b> thay vì O(E log V).', 'xanh', 'font-size:18px')}`, '1fr 1.1fr') },

  /* 12 */
  { t: 'BFS nhiều nguồn: cam thối và ô gần nhất', body: `${hai(`<div style="display:flex;gap:18px;align-items:flex-end">${['Xoo. oo.o .ooX', 'XXo. Xo.X .oXX', 'XXX. XX.X .XXX'].map((g, i) => `<div style="text-align:center">${luoi(g.split(' '), { X: { nen: '#b85a2b', vien: '#8a3f1c' }, o: { nen: '#f6b24a', vien: '#e08a1e' }, '.': { nen: '#ffffff' } }, { o: 42 })}<div style="font-size:17px;font-weight:700">phút ${i}</div></div>`).join('')}</div>
${nho('Nâu = thối, cam = lành, trắng = trống. Mỗi phút cam thối lây sang 4 ô kề.')}`,
  `${code(`// MỌI nguồn vào hàng đợi cùng lúc, khoảng cách 0
for (mọi ô thối) q.add(ô);
for (int minute = 0; !q.isEmpty(); minute++)
    // 1 tầng = 1 phút
    for (int s = q.size(); s > 0; s--) {
        int[] p = q.poll();
        // ô lành kề p: đánh dấu, q.add(...)
    }
// còn ô lành chưa chạm tới => -1`, 'java', 'sm')}`, '1.05fr 1fr')}
${hai(out(`answer 2        isolated fresh orange: -1
PASS 2000 grids vs minute-by-minute simulation,
     2000 nearest-0 grids vs Manhattan`, 'font-size:14px'),
    `${out(`60x60, 355 zeros: one multi-source BFS polls 3600 cells,
                  one BFS per zero 1278000`, 'font-size:14px')}
${o('Như có một <b>siêu nguồn</b> nối cạnh 0 tới mọi nguồn: một lần BFS, <b>O(R · C)</b>. Chạy BFS riêng từng nguồn chậm hơn 355 lần.', 'xanh')}`, '1fr 1.1fr')}` },

  /* 13 */
  { t: 'Đồ thị hai phía: tô 2 màu bằng BFS', body: hai(`<div style="display:flex;gap:10px;align-items:flex-start">${doThi({ A: [40, 40], B: [150, 40], C: [150, 150], D: [40, 150], E: [40, 260], F: [150, 260], G: [245, 40], H: [245, 150] },
    [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['D', 'E'], ['E', 'F'], ['G', 'H']], { w: 280, h: 290, r: 19, co: false, mau: { A: 'lam', C: 'lam', E: 'lam', G: 'lam', B: 'cam', D: 'cam', F: 'cam', H: 'cam' } })}
${doThi({ A: [130, 35], B: [225, 105], C: [190, 225], D: [70, 225], E: [35, 105] },
    [['A', 'B'], ['B', 'C'], ['C', 'D', '', 'do'], ['D', 'E'], ['E', 'A']], { w: 260, h: 260, r: 19, co: false, mau: { A: 'lam', B: 'cam', E: 'cam', C: 'lam', D: 'lam' } })}</div>
${out(`graph 1: {ACEG} {BDFH}
graph 2: null, both ends of C-D got the same colour
PASS 5000 random graphs (2367 bipartite,
     self-loops included) vs 2^n colourings`, 'font-size:14px')}
${nho('Trường (5.D) tô màu tham lam nhiều màu; <b>2 màu</b> thì có thuật toán chính xác O(V + E).')}`,
  `${code(`for (int s = 0; s < n; s++) {    // MỌI thành phần
    if (col[s] != -1) continue;
    col[s] = 0; q.add(s);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int w : adj.get(u))
            if (col[w] == -1) {
                col[w] = 1 - col[u]; q.add(w);
            } else if (col[w] == col[u])
                return false;         // vòng lẻ
    }
}`, 'java', 'sm')}
${o('<b>Hai phía ⇔ không có chu trình lẻ.</b> Vòng 5 đỉnh: màu đổi 5 lần, về đỉnh đầu sai màu ⇒ C-D cùng màu.', 'xanh', 'font-size:19px')}
${o('<b>Bẫy:</b> chỉ BFS từ đỉnh 0 ⇒ bỏ sót G-H. Ý bài LC 785, LC 886 (chia hai nhóm).', 'do2', 'font-size:19px')}`, '1fr 1fr') },

  /* 14 */
  { t: 'Thành phần liên thông mạnh (SCC): Kosaraju', body: hai(`${doThi({ A: [45, 150], B: [165, 60], C: [165, 240], D: [320, 60], E: [470, 60], F: [320, 240], G: [470, 240], H: [590, 150] },
    [['A', 'B'], ['B', 'C'], ['C', 'A'], ['B', 'D'], ['D', 'E', '', undefined, -16], ['E', 'D', '', undefined, -16], ['C', 'F'], ['F', 'G', '', undefined, -16], ['G', 'F', '', undefined, -16], ['E', 'H'], ['G', 'H']],
    { w: 630, h: 300, r: 21, mau: { A: 'cam', B: 'cam', C: 'cam', D: 'lam', E: 'lam', F: 'xanh', G: 'xanh', H: 'tim' } })}
${out(`finish order HGFCEDBA
  start A on reversed graph -> {ACB}
  start D on reversed graph -> {DE}
  start F on reversed graph -> {FG}
  start H on reversed graph -> {H}
4 strongly connected components
PASS 5000 random digraphs vs mutual reachability`, 'font-size:14px')}`,
  `<ul style="font-size:19px">
<li><b>SCC</b>: nhóm lớn nhất mà <b>đi tới nhau được hai chiều</b></li>
<li>Lượt 1: DFS trên G, ghi thứ tự <b>xong</b></li>
<li>Lượt 2: DFS trên <b>đồ thị đảo</b>, bắt đầu từ đỉnh xong <b>muộn nhất</b>; mỗi lần DFS = một SCC</li>
</ul>
${o('<b>Vì sao đúng:</b> đỉnh xong muộn nhất thuộc SCC "nguồn". Trên đồ thị đảo, từ nó không <b>thoát</b> sang SCC khác ⇒ DFS nhặt đúng nhóm.', 'xanh', 'font-size:18px')}
${o('<b>Bẫy:</b> lượt 2 chạy trên đồ thị <b>gốc</b> ⇒ từ A đi hết 8 đỉnh, gộp sai thành 1 nhóm.', 'do2', 'font-size:18px')}
${nho('Hai DFS + đồ thị đảo: <b>O(V + E)</b>. Co mỗi SCC thành một đỉnh ⇒ một DAG: ABC → DE, FG → H.')}`, '1.1fr 0.9fr') },

  /* 15 */
  { t: 'SCC bằng Tarjan: low-link, một lượt DFS', body: hai(`${code(`void dfs(int u) {
    disc[u] = low[u] = ++time;
    st.push(u); onStack[u] = true;
    for (int w : g.get(u)) {
        if (disc[w] == 0) {        // cạnh cây
            dfs(w);
            low[u] = Math.min(low[u], low[w]);
        } else if (onStack[w])     // còn mở
            low[u] = Math.min(low[u], disc[w]);
    }
    if (low[u] == disc[u]) {       // u là gốc SCC
        int w;
        do { w = st.pop(); onStack[w] = false;
             comp[w] = count; } while (w != u);
        count++;
    }
}`, 'java', 'sm')}`,
  `${bang([
    ['disc', '1', '2', '3', '7', '8', '4', '5', '6'],
    ['low', '1', '1', '1', '7', '7', '4', '4', '6'],
  ], ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], 'font-size:16px;line-height:1.1')}
${out(`  low = disc at H -> pop {H}
  low = disc at F -> pop {GF}
  low = disc at D -> pop {ED}
  low = disc at A -> pop {CBA}
4 SCCs, found in reverse topological order`, 'margin-top:6px;font-size:13.5px')}
${o('<b>low[u]</b> = số thăm nhỏ nhất u leo tới qua cây DFS + một cạnh về đỉnh <b>còn trên ngăn xếp</b>. <code>low == disc</code> ⇒ u là gốc, bật cả nhóm.', 'xanh', 'font-size:18px')}
${o('<b>Bẫy:</b> quên <code>onStack</code> ⇒ cạnh E → H (H đã xong) kéo low sai. PASS 5000 đồ thị.', 'do2', 'font-size:18px')}`, '1fr 1fr') },

  /* 16 */
  { t: 'Cầu và khớp: cùng ý low-link trên đồ thị vô hướng', body: hai(`${doThi({ A: [30, 70], B: [30, 225], C: [140, 150], D: [265, 150], E: [355, 55], F: [395, 220], G: [510, 220] },
    [['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D', '', 'do'], ['D', 'E'], ['D', 'F'], ['E', 'F'], ['F', 'G', '', 'do']],
    { w: 540, h: 270, r: 21, co: false, mau: { C: 'cam', D: 'cam', F: 'cam' }, duoi: { B: '2/1', C: '3/1', D: '4/4', F: '6/4', G: '7/7' }, tren: { A: '1/1', E: '5/4' } })}
${nho('Đồ thị bài trường 5.A. Số dưới nút = disc/low. Cam = khớp (articulation point), đỏ = cầu (bridge).')}
${out(`articulation points: C D F   bridges: C-D F-G
PASS 5000 random graphs (parallel edges too)
     vs removing each vertex/edge
skipping the parent VERTEX instead:
     wrong bridges on 1464 of them`, 'font-size:14px')}`,
  `${bang([
    ['Cạnh cây u – w là <b>cầu</b>', '<code>low[w] &gt; disc[u]</code>', 'w không leo tới u'],
    ['u (không gốc) là <b>khớp</b>', '<code>low[w] &gt;= disc[u]</code>', 'w không leo quá u'],
    ['Gốc DFS là khớp', '≥ 2 con trong cây DFS', ''],
  ], ['Kết luận', 'Điều kiện', 'Nghĩa'], 'font-size:15px;line-height:1.1')}
${code(`for (int[] x : adj.get(u)) {   // {w, số hiệu cạnh}
    int w = x[0];
    if (x[1] == parentEdge) continue; // bỏ CẠNH
    if (disc[w] != 0) {               // cạnh ngược
        low[u] = Math.min(low[u], disc[w]);
        continue;
    }
    dfs(w, x[1]);
    low[u] = Math.min(low[u], low[w]);
    if (low[w] > disc[u]) bridge[x[1]] = true;
}`, 'java', 'sm')}
${o('Xoá thử: O(V · (V + E)); low-link: <b>một DFS</b>. <b>Bẫy:</b> bỏ qua <b>đỉnh</b> cha thay vì <b>cạnh</b> ⇒ cạnh song song bị báo là cầu.', 'do2', 'font-size:17px;padding:6px 14px')}`, '1fr 1fr') },

  /* 17 */
  { t: 'A*: f = g + h, h = khoảng cách Manhattan', body: `${hai(`<div style="text-align:center">${luoi(A_STAR_DJ, KIEU_AS, { o: 30, fs: 15 })}<div style="font-size:19px;font-weight:700;margin-top:4px">Dijkstra: 18 bước, mở rộng <span class="do">121</span> ô</div></div>`,
    `<div style="text-align:center">${luoi(A_STAR_AS, KIEU_AS, { o: 30, fs: 15 })}<div style="font-size:19px;font-weight:700;margin-top:4px">A*: 18 bước, mở rộng <span style="color:#2f7d4f">53</span> ô</div></div>`)}
${hai(o('<b>Dijkstra</b> lấy ô có <code>g</code> nhỏ nhất (đã đi bao xa) ⇒ loang tròn <b>mọi hướng</b>, kể cả phía sau S. <b>A*</b> lấy ô có <code>f = g + h</code> nhỏ nhất, <code>h</code> = ước lượng còn bao xa tới G ⇒ loang <b>về phía đích</b>.', 'xanh'),
    `${nho('Xanh = đã mở rộng, cam = đường tìm được, đen = tường. Cùng độ dài 18; hai đường khác nhau vì có nhiều đường ngắn nhất bằng nhau.')}
${nho('Hoà <code>f</code> thì ưu tiên <code>h</code> nhỏ hơn — số ô mở rộng phụ thuộc cách phá hoà này.')}`, '1.2fr 1fr')}` },

  /* 18 */
  { t: 'A*: khi nào vẫn cho đường NGẮN NHẤT', body: hai(`${code(`// w = 0: Dijkstra · w = 1: A*
int h = w * (Math.abs(x - tr)
           + Math.abs(y - tc));   // Manhattan
pq.add(new int[]{d[x][y] + h, h, x, y});
// … vòng lặp chính:
int[] p = pq.poll();              // f nhỏ nhất
if (closed[r][c]) continue;
closed[r][c] = true; expanded++;
if (r == tr && c == tc)           // tới đích
    return d[r][c];`, 'java', 'sm')}
${out(`PASS 3000 random grids: A* length = Dijkstra length
expanded in total: Dijkstra 79352, A* 50594
h = 5 x Manhattan (too big): wrong length on 302 grids`, 'margin-top:8px;font-size:14px')}`,
  `${bang([
    ['<b>Chấp nhận được</b> (admissible)', 'h(x) ≤ khoảng cách thật tới đích', 'đường tìm được là ngắn nhất'],
    ['<b>Nhất quán</b> (consistent)', 'h(x) ≤ w(x, y) + h(y)', 'mỗi ô chỉ mở rộng một lần'],
  ], ['Tính chất', 'Điều kiện', 'Được gì'], 'font-size:16.5px')}
<ul style="font-size:18px;margin-top:4px">
<li>Lưới 4 hướng, bước 1: Manhattan có cả hai tính chất — không bao giờ đi được ngắn hơn |Δx| + |Δy|</li>
<li>h = 0 ⇒ A* thành Dijkstra (đúng, nhưng không nhanh hơn)</li>
<li>h ước lượng <b class="do">quá tay</b> (5 × Manhattan) ⇒ nhanh hơn nhưng <b class="do">sai</b> độ dài trên 302/3000 lưới</li>
</ul>
${o('Lưới 8 hướng ⇒ Chebyshev / octile (Manhattan sẽ ước lượng quá tay khi đi chéo). Xấu nhất vẫn O(E log V); A* chỉ lợi khi có <b>một đích</b> và <b>ước lượng</b> tốt.', 'xanh', 'font-size:18px')}`, '1fr 1fr') },

  /* 19 */
  { t: 'BFS trên trạng thái: bậc thang chữ (word ladder)', body: hai(`${doThi({ cold: [50, 150], cord: [165, 90], gold: [165, 230], word: [285, 40], card: [285, 150], golf: [285, 260], ward: [405, 90], warm: [520, 90] },
    [['cold', 'cord', '', 'cam'], ['cold', 'gold'], ['cord', 'word', '', 'cam'], ['cord', 'card'], ['word', 'ward', '', 'cam'], ['card', 'ward'], ['gold', 'golf'], ['ward', 'warm', '', 'cam']],
    { w: 570, h: 320, r: 30, fs: 15, co: false, mau: { cold: 'xanh', warm: 'do' }, duoi: { cold: 'tầng 0', gold: 'tầng 1', golf: 'tầng 2', warm: 'tầng 4' } })}
${out(`cold -> warm: [cold, cord, word, ward, warm], polled 12 words
cold -> golf: [cold, gold, golf]
cold -> warp: null (not in the list)
PASS 3000 random dictionaries vs comparing all pairs`, 'font-size:14px')}`,
  `${code(`// "c*ld" -> [cold, gold]: khác đúng MỘT chữ
for (String w : dict)
    for (int i = 0; i < w.length(); i++)
        bucket(w.substring(0, i) + '*'
               + w.substring(i + 1)).add(w);
// BFS: hàng xóm của u = các từ trong L thùng
for (String w : bucket(mẫu thứ i của u))
    if (!parent.containsKey(w)) {
        parent.put(w, u); q.add(w);  // ngay
    }`, 'java', 'sm')}
${o('<b>Đỉnh = một từ</b>, cạnh = đổi một chữ ⇒ <b>BFS</b>; lưu <code>parent</code> để in lại đường (ý bài LC 127/126). So mọi cặp: O(n² · L); thùng mẫu: O(n · L²).', 'xanh', 'font-size:18px')}
${nho('Đánh dấu đã thăm lúc <b>cho vào</b> hàng đợi, không phải lúc lấy ra — nếu không một từ vào hàng đợi nhiều lần.')}`, '1.02fr 0.98fr') },

  /* 20 */
  { t: 'BFS trên trạng thái: mở khoá 4 bánh xe', body: hai(`${code(`// trạng thái = số 0..9999; 8 nước
int[] next(int s) {
    int[] out = new int[8]; int k = 0;
    for (int i = 0, p = 1; i < 4; i++, p *= 10) {
        int dg = s / p % 10;
        out[k++] = s + ((dg + 1) % 10 - dg) * p;
        out[k++] = s + ((dg + 9) % 10 - dg) * p;
    }
    return out;
}`, 'java', 'sm')}
${nho('Dòng 1: bánh +1 (9 → 0) · dòng 2: bánh −1 (0 → 9).')}
${o('10 000 đỉnh, mỗi đỉnh 8 cạnh — <b>không</b> dựng ra; BFS gọi <code>next(u)</code> khi cần. Trạng thái là <b>số</b> ⇒ mảng <code>d[10000]</code> thay HashMap.', 'xanh', 'font-size:19px')}`,
  `${out(`0000 -> 0202 avoiding 0201 0101 0102 1212 2002:
  6 moves, 723 states polled
no dead ends: 4 moves, 147 states polled
0000 -> 8888 with 8887 8889 8878 8898 8788 8988
  7888 9888 dead: -1
PASS 100 targets vs sum of min(x, 10-x),
     300 with dead ends vs two-ended BFS`, 'font-size:14px')}
${bang([
    ['Không có ô cấm', 'Σ min(x, 10 − x) mỗi bánh', '0202 → 4'],
    ['Có ô cấm', 'BFS, bỏ qua trạng thái cấm', '6, phải đi vòng'],
    ['Đích bị vây kín', 'BFS hết mà không tới', '−1'],
  ], ['Tình huống', 'Cách tính', 'Ví dụ'], 'font-size:15.5px;line-height:1.1;margin-top:4px')}
${o('<b>Bẫy:</b> 0000 bị cấm ⇒ trả −1 <b>ngay</b>. Quên chiều 0 → 9 (xoay lùi) ⇒ 0909 thành 18 bước thay vì 2. Ý bài LC 752.', 'do2', 'font-size:18px')}
${o('<b>BFS hai đầu</b>: loang từ cả 0000 và đích, luôn loang phía nhỏ hơn, dừng khi chạm nhau — ở đây dùng làm phép kiểm độc lập.', '', 'font-size:18px')}`, '1fr 1fr') },

  /* 21 */
  { t: 'Chọn thuật toán đường đi ngắn nhất', body: `${bang([
    ['Không trọng số (mỗi bước = 1)', '<b>BFS</b>', 'O(V + E)', 'lưới, trạng thái, bậc thang chữ'],
    ['Trọng số chỉ 0 hoặc 1', '<b>0-1 BFS</b> (deque)', 'O(V + E)', 'phá tường, đổi mũi tên'],
    ['Trọng số ≥ 0, một nguồn', '<b>Dijkstra</b> (heap)', 'O(E log V)', 'bài trường 5.B'],
    ['≥ 0, một đích, có ước lượng', '<b>A*</b>', '≤ Dijkstra', 'tìm đường trên bản đồ'],
    ['Có <b>cạnh âm</b>', '<b>Bellman-Ford</b>', 'O(V · E)', 'Dijkstra sai ~16% (slide 8)'],
    ['Tối đa k cạnh', 'Bellman-Ford <b>k vòng</b> + bản sao', 'O(k · E)', 'bài tập 2 (LC 787)'],
    ['DAG (kể cả cạnh âm)', 'thứ tự tô-pô rồi nới', 'O(V + E)', 'bài tập 7'],
    ['<b>Mọi cặp</b>, V ≤ ~400', '<b>Floyd-Warshall</b>', 'O(V³)', 'in đường bằng next[][]'],
    ['Có chu trình âm không?', 'BF vòng V · Floyd <code>d[i][i] &lt; 0</code>', 'như trên', 'slide 9–10'],
  ], ['Điều kiện', 'Dùng', 'Chi phí', 'Gặp ở'], 'font-size:17px')}
${o('Hỏi theo thứ tự: <b>có trọng số không?</b> → <b>có âm không?</b> → <b>một nguồn hay mọi cặp?</b> Chọn thuật toán <b>mạnh vừa đủ</b>: BFS chạy được thì đừng dùng Dijkstra, Dijkstra chạy được thì đừng dùng Bellman-Ford.', 'xanh')}` },

  /* 22 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['"Tiên quyết", "phụ thuộc", "thứ tự build", "bảng chữ cái lạ"', 'Kahn / tô-pô; kẹt ⇒ chu trình', '4–6'],
    ['"Ít học kỳ nhất", "đường dài nhất trong DAG"', 'Kahn theo tầng', '6'],
    ['Có cạnh âm, "tối đa k chặng", "chu trình âm"', 'Bellman-Ford', '7–9'],
    ['Khoảng cách giữa mọi cặp, cần in đường', 'Floyd + next[][]', '10'],
    ['"Ít tường phải phá", "đổi ít hướng nhất"', '0-1 BFS', '11'],
    ['"Cam thối", "ô 0 gần nhất", "cách đất liền xa nhất"', 'BFS nhiều nguồn', '12'],
    ['"Chia hai nhóm", "không ai cùng nhóm với người ghét"', 'Tô 2 màu', '13'],
    ['"Nhóm đi tới nhau được", co đồ thị thành DAG', 'SCC: Kosaraju / Tarjan', '14–15'],
    ['"Kết nối quan trọng", "điểm yếu của mạng"', 'Cầu / khớp (low-link)', '16'],
    ['Tìm đường trên bản đồ, biết toạ độ đích', 'A* + Manhattan', '17–18'],
    ['"Ít bước nhất" giữa hai cấu hình', 'BFS trên trạng thái', '19–20'],
  ], ['Thấy trong đề', 'Nghĩ tới', 'Slide'], 'font-size:17px')}` },

  /* 23 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['Kahn / tô-pô DFS', 'O(V + E)', 'O(V)', 'mỗi đỉnh vào hàng đợi, mỗi cạnh giảm indeg một lần'],
    ['Bellman-Ford', 'O(V · E)', 'O(V)', 'V − 1 vòng × E cạnh (dừng sớm khi không đổi)'],
    ['Floyd-Warshall + next', 'O(V³)', 'O(V²)', '3 vòng lặp k, i, j; in đường O(độ dài)'],
    ['0-1 BFS', 'O(V + E)', 'O(V)', 'deque thay heap: thêm/lấy O(1)'],
    ['BFS nhiều nguồn', 'O(V + E)', 'O(V)', 'một lần BFS cho mọi nguồn'],
    ['Tô 2 màu', 'O(V + E)', 'O(V)', 'mỗi cạnh xét hai lần'],
    ['Kosaraju / Tarjan', 'O(V + E)', 'O(V + E) / O(V)', 'hai DFS + đồ thị đảo / một DFS'],
    ['Cầu và khớp', 'O(V + E)', 'O(V)', 'một DFS; xoá thử là O(V · (V + E))'],
    ['A* (h nhất quán)', 'O(E log V) xấu nhất', 'O(V)', 'như Dijkstra, thường mở ít ô hơn'],
    ['BFS trên trạng thái', 'O(S · số nước)', 'O(S)', 'S = số trạng thái (10 000 khoá, 720 bàn 2×3)'],
  ], ['Thuật toán', 'Thời gian', 'Bộ nhớ', 'Vì sao'], 'font-size:16px;line-height:1.22')}
${nho('V = số đỉnh, E = số cạnh. Trên lưới R × C: V = R·C, E ≤ 2·R·C ⇒ O(R·C). Đệ quy DFS sâu V có thể ném StackOverflowError.')}` },

  /* 24 */
  { t: 'Tóm tắt', body: `<ul style="font-size:22.5px">
<li>Đề không nói "đồ thị": hỏi <b>đỉnh là gì, cạnh là gì</b> — ô lưới, quan hệ trước/sau, cả một cấu hình</li>
<li>Kahn: bóc đỉnh bậc vào 0; lấy ra <b>&lt; n</b> đỉnh = chu trình; theo tầng = số học kỳ ít nhất</li>
<li>Cạnh âm: <span class="do">Dijkstra sai</span> (16% đồ thị thử) ⇒ Bellman-Ford V − 1 vòng; vòng V còn nới = chu trình âm, lan −∞</li>
<li>Floyd: <code>next[i][j] = next[i][k]</code> để in đường; <code>d[i][i] &lt; 0</code> = chu trình âm</li>
<li>Trọng số 0/1 ⇒ deque (0 lên đầu, 1 xuống cuối); nhiều nguồn ⇒ cho <b>tất cả</b> vào hàng đợi từ đầu</li>
<li>Hai phía ⇔ không có vòng lẻ; nhớ duyệt <b>mọi</b> thành phần</li>
<li>SCC: Kosaraju hai lượt (lượt 2 trên đồ thị <b>đảo</b>) hoặc Tarjan low-link; cầu <code>low[w] &gt; disc[u]</code>, khớp <code>&gt;=</code>, bỏ qua <b>cạnh</b> cha</li>
<li>A*: f = g + h, h không được ước lượng quá tay; "ít bước nhất" giữa hai cấu hình ⇒ BFS trên trạng thái</li>
</ul>` },
]);
