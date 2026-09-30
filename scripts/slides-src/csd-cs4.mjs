/**
 * csd-cs4.mjs — CSD201 ⭐ Chuyên sâu 4: QUY HOẠCH ĐỘNG (PHẦN 2) — DP hai chiều và các dạng kinh điển
 * (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs4.mjs --out <dir>
 *
 * Mọi bảng dp, mọi con số (PASS/FAIL, số ca khác nhau, số đường đi…) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs4/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs4', code: 'CS4', title: 'Quy hoạch động (phần 2)', sub: 'CSD201 · ⭐ Chuyên sâu' };

/* ───────────── màu ───────────── */
const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', da: '#5a5a5a' };

/**
 * Bảng dp 2 chiều bằng SVG. rows: mảng hàng (giá trị; '#' = vật cản tô xám đậm).
 * opt: { w, h, fs, rowLbl, colLbl, lblW, fill: {'r,c': 'do'|'xanh'|'cam'|'xam'}, width }
 */
function luoi(rows, { w = 46, h = 36, fs = 17, rowLbl = null, colLbl = null, lblW = 44, fill = {}, width = null } = {}) {
  const x0 = rowLbl ? lblW : 2, y0 = colLbl ? 26 : 2;
  let s = '';
  if (colLbl) colLbl.forEach((t, c) => { s += `<text x="${x0 + c * w + w / 2}" y="18" text-anchor="middle" font-size="15" font-weight="700" fill="${MAU.nau}">${t}</text>`; });
  rows.forEach((row, r) => {
    if (rowLbl) s += `<text x="${lblW - 8}" y="${y0 + r * h + h / 2 + 6}" text-anchor="end" font-size="15" font-weight="700" fill="${MAU.nau}">${rowLbl[r]}</text>`;
    row.forEach((v, c) => {
      const f = fill[`${r},${c}`];
      const rock = v === '#';
      const bg = rock ? NEN.da : f ? NEN[f] : NEN.trang;
      const bd = f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : MAU.vien;
      s += `<rect x="${x0 + c * w}" y="${y0 + r * h}" width="${w}" height="${h}" fill="${bg}" stroke="${bd}" stroke-width="${f === 'do' || f === 'xanh' ? 2.6 : 1.2}"/>`;
      if (!rock && v !== '') {
        const col = f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : '#262626';
        s += `<text x="${x0 + c * w + w / 2}" y="${y0 + r * h + h / 2 + 6}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}">${v}</text>`;
      }
    });
  });
  const W = x0 + rows[0].length * w + 3, H = y0 + rows.length * h + 3;
  return `<svg viewBox="0 0 ${W} ${H}" width="${width || W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/** Một hàng ô 1 chiều (như deck cs3). */
function hang(vals, { w = 56, h = 40, fill = {}, nhan = '', nhanW = 70, chiSo = null, fs = 18 } = {}) {
  const x0 = nhan ? nhanW : 4, y0 = 4;
  let s = '';
  if (nhan) s += `<text x="0" y="${y0 + h / 2 + 6}" font-size="17" font-weight="700" fill="${MAU.nau}">${nhan}</text>`;
  vals.forEach((v, i) => {
    const f = fill[i];
    s += `<rect x="${x0 + i * w}" y="${y0}" width="${w}" height="${h}" fill="${f ? NEN[f] : NEN.trang}" stroke="${f === 'do' ? MAU.do : MAU.vien}" stroke-width="${f === 'do' ? 2.6 : 1.2}"/>`;
    const col = f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : '#262626';
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h / 2 + 6}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}">${v}</text>`;
    const cs = chiSo ? chiSo[i] : i;
    if (cs !== '' && cs !== undefined) s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h + 16}" text-anchor="middle" font-size="14" fill="#8c8c8c">${cs}</text>`;
  });
  const W = x0 + vals.length * w + 4, H = y0 + h + (chiSo && chiSo.every((x) => x === '') ? 4 : 22);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:8px 12px;font:15px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t, st = '') => `<p class="nho"${st ? ` style="${st}"` : ''}>${t}</p>`;
const ul = (items, fs = 20) => `<ul style="font-size:${fs}px">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;

/* ───────────── sơ đồ riêng ───────────── */
// slide 2: ba kiểu phụ thuộc giữa các ô
function phuThuoc() {
  const o3 = (x, y, t, f, w = 56) => `<rect x="${x}" y="${y}" width="${w}" height="36" fill="${f}" stroke="#8c8c8c" stroke-width="1.3"/><text x="${x + w / 2}" y="${y + 24}" text-anchor="middle" font-size="15" font-weight="700" fill="#262626">${t}</text>`;
  const mt = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${MAU.nau}" stroke-width="2.4" marker-end="url(#m)"/>`;
  let s = `<defs><marker id="m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${MAU.nau}"/></marker></defs>`;
  // A: trên, trái, chéo — các ô cách nhau để thấy mũi tên
  s += `<text x="82" y="16" text-anchor="middle" font-size="15" font-weight="800" fill="#262626">A. trên · trái · chéo</text>`;
  s += o3(10, 30, 'chéo', NEN.cam) + o3(98, 30, 'trên', NEN.cam) + o3(10, 96, 'trái', NEN.cam) + o3(98, 96, 'i, j', NEN.do);
  s += mt(126, 66, 126, 92) + mt(66, 114, 94, 114) + mt(66, 66, 96, 94);
  s += `<text x="82" y="152" text-anchor="middle" font-size="13" fill="#555">hàng tăng, cột tăng</text>`;
  s += `<text x="82" y="169" text-anchor="middle" font-size="13" fill="#555">LCS · sửa xâu · lưới</text>`;
  // B: hàng trên (knapsack)
  s += `<text x="280" y="16" text-anchor="middle" font-size="15" font-weight="800" fill="#262626">B. chỉ đọc hàng trên</text>`;
  for (let c = 0; c < 5; c++) s += o3(190 + c * 36, 30, c === 1 ? 'c−w' : c === 4 ? 'c' : '', c === 1 || c === 4 ? NEN.cam : NEN.trang, 36).replace('font-size="15"', 'font-size="12"');
  for (let c = 0; c < 5; c++) s += o3(190 + c * 36, 96, c === 4 ? 'i, c' : '', c === 4 ? NEN.do : NEN.trang, 36).replace('font-size="15"', 'font-size="13"');
  s += `<text x="178" y="54" text-anchor="end" font-size="13" fill="#555">i−1</text><text x="178" y="120" text-anchor="end" font-size="13" fill="#555">i</text>`;
  s += mt(352, 66, 352, 92) + mt(244, 66, 334, 96);
  s += `<text x="280" y="152" text-anchor="middle" font-size="13" fill="#555">ô c và ô c − w của hàng i−1</text>`;
  s += `<text x="280" y="169" text-anchor="middle" font-size="13" fill="#555">cái túi (knapsack)</text>`;
  // C: khoảng
  s += `<text x="470" y="16" text-anchor="middle" font-size="15" font-weight="800" fill="#262626">C. đoạn ngắn hơn</text>`;
  const seg = (y, x1, x2, f, t) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="26" rx="4" fill="${f}" stroke="#8c8c8c" stroke-width="1.2"/><text x="${(x1 + x2) / 2}" y="${y + 18}" text-anchor="middle" font-size="13" font-weight="700" fill="#262626">${t}</text>`;
  s += seg(30, 400, 540, NEN.do, 's[i..j]') + seg(68, 414, 526, NEN.cam, 's[i+1..j−1]') + seg(106, 400, 466, NEN.xam, 'i..k') + seg(106, 472, 540, NEN.xam, 'k+1..j');
  s += `<text x="470" y="152" text-anchor="middle" font-size="13" fill="#555">theo độ dài tăng dần</text>`;
  s += `<text x="470" y="169" text-anchor="middle" font-size="13" fill="#555">đối xứng · đặt ngoặc</text>`;
  return `<svg viewBox="0 0 560 178" width="580" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 14: vì sao lấy min của 3 ô
function baVuong() {
  let s = '';
  const q = (x, y, n, f, t) => `<rect x="${x}" y="${y}" width="${n * 22}" height="${n * 22}" fill="${f}" fill-opacity=".55" stroke="${t}" stroke-width="2.2"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) s += `<rect x="${20 + c * 22}" y="${10 + r * 22}" width="22" height="22" fill="#fff" stroke="#ccc"/>`;
  s += q(20, 10, 3, NEN.cam, MAU.cam) + q(42, 10, 3, NEN.xanh, MAU.xanh) + q(20, 32, 3, '#e3ecff', '#4a6fd6');
  s += `<rect x="86" y="76" width="22" height="22" fill="${NEN.do}" stroke="${MAU.do}" stroke-width="2.6"/>`;
  s += `<text x="150" y="30" font-size="14" fill="${MAU.cam}" font-weight="700">chéo trên-trái = 3</text>`;
  s += `<text x="150" y="52" font-size="14" fill="${MAU.xanh}" font-weight="700">trên = 3</text>`;
  s += `<text x="150" y="74" font-size="14" fill="#4a6fd6" font-weight="700">trái = 3</text>`;
  s += `<text x="150" y="96" font-size="14" fill="${MAU.do}" font-weight="700">⇒ ô đỏ = 1 + min = 4</text>`;
  return `<svg viewBox="0 0 320 110" width="340" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 18: máy trạng thái cổ phiếu có thời gian chờ
function mayTrangThai() {
  const nut = (x, y, t, d, f, b) => `<ellipse cx="${x}" cy="${y}" rx="62" ry="30" fill="${f}" stroke="${b}" stroke-width="2.4"/><text x="${x}" y="${y - 2}" text-anchor="middle" font-size="17" font-weight="800" fill="#262626">${t}</text><text x="${x}" y="${y + 17}" text-anchor="middle" font-size="12" fill="#555">${d}</text>`;
  const cung = (d, t, tx, ty) => `<path d="${d}" fill="none" stroke="${MAU.nau}" stroke-width="2.2" marker-end="url(#m2)"/><text x="${tx}" y="${ty}" text-anchor="middle" font-size="14" font-weight="700" fill="${MAU.nau}">${t}</text>`;
  let s = `<defs><marker id="m2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${MAU.nau}"/></marker></defs>`;
  s += nut(90, 150, 'REST', 'rảnh, được mua', NEN.xanh, MAU.xanh);
  s += nut(250, 50, 'HOLD', 'đang giữ 1 cổ', NEN.cam, MAU.cam);
  s += nut(410, 150, 'SOLD', 'vừa bán hôm nay', NEN.do, MAU.do);
  s += cung('M 110 121 Q 140 60 190 48', 'mua: −p', 78, 92);
  s += cung('M 310 48 Q 370 60 392 121', 'bán: +p', 378, 72);
  s += cung('M 350 160 Q 250 200 150 160', 'hôm sau (chờ xong)', 250, 206);
  s += cung('M 228 21 C 200 -6 300 -6 272 21', 'giữ', 250, 12).replace('y="12"', 'y="-2"');
  s += cung('M 40 170 C 0 200 0 110 36 132', 'nghỉ', 10, 196);
  return `<svg viewBox="-10 -14 500 230" width="470" font-family="Arial, sans-serif">${s}</svg>`;
}

// khoảng cách giữa các khối trong một cột (khuôn chung không đặt)
const ST = '<style>.cs .nd .hai>div:not(.o){display:flex;flex-direction:column;gap:9px}</style>';

export const slides = lamDeck('QUY HOẠCH ĐỘNG — PHẦN 2', [
  /* 1 */
  { cover: true, t: 'Quy hoạch động (phần 2)', sub: 'DP hai chiều và các dạng kinh điển<br>Cái túi 0/1 &amp; không giới hạn · tập con · LCS · sửa xâu · lưới<br>Xâu đối xứng · DP khoảng · máy trạng thái · bitmask<br>CSD201 · Java 8 — mọi bảng dp đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Từ bảng 1 chiều sang bảng 2 chiều', body: `<div class="hai" style="grid-template-columns:1.02fr 1fr"><div>
${o('Công thức <b>4 bước</b> của deck CS3 giữ nguyên: <b>trạng thái → truy hồi → cơ sở → thứ tự tính</b> (+ lấy lại lời giải). Chỉ khác: trạng thái cần <b>hai</b> con số.', 'xanh')}
${bang([
    ['Hai chuỗi / hai dãy', 'dp[i][j]: tiền tố i của a, j của b'],
    ['Đồ vật × sức chứa', 'dp[i][c]: i món đầu, túi chứa c'],
    ['Lưới', 'dp[r][c]: ô hàng r, cột c'],
    ['Đoạn con', 'dp[i][j]: đoạn s[i..j]'],
    ['Vị trí × tình trạng', 'dp[i][giữ/bán/rảnh]'],
    ['Tập đã đi × chỗ đứng', 'dp[mask][v]'],
  ], ['Đề có…', 'Trạng thái'], 'font-size:18px')}</div>
<div>${phuThuoc()}
${ul([
    '<b>Thứ tự tính</b> = nhìn ô (i, j) đọc những ô nào, rồi chọn vòng lặp để chúng có trước',
    'A: hai vòng tăng · B: theo hàng · C: theo <b>độ dài</b> đoạn (hoặc i giảm)',
    'Độ phức tạp = <b>số ô × công mỗi ô</b>',
  ], 19)}</div></div>` },

  /* 3 */
  { t: 'Cái túi 0/1 (0/1 knapsack): đề và 4 bước', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">n món, món k nặng <b>w[k]</b>, giá trị <b>v[k]</b>. Túi chứa tối đa <b>W</b>. Mỗi món lấy <b class="do">0 hoặc 1 lần</b>. Tổng giá trị lớn nhất?</p>
${bang([
    ['Trạng thái', 'dp[i][c] = tốt nhất với <b>i món đầu</b>, sức chứa <b>c</b>'],
    ['Truy hồi', 'món i−1: <b>bỏ</b> → dp[i−1][c]<br><b>lấy</b> (w ≤ c) → dp[i−1][c−w] + v · lấy max'],
    ['Cơ sở', 'dp[0][c] = 0 (chưa có món nào)'],
    ['Thứ tự', 'i = 1 → n; hàng i chỉ đọc hàng i−1'],
  ], ['Bước', 'Cái túi 0/1'], 'font-size:18px')}</div>
<div>${code(`int[][] dp = new int[n + 1][W + 1];
for (int i = 1; i <= n; i++)
    for (int c = 0; c <= W; c++) {
        dp[i][c] = dp[i - 1][c];              // bỏ
        if (w[i - 1] <= c)                    // lấy: 1 lần
            dp[i][c] = Math.max(dp[i][c],
                dp[i - 1][c - w[i - 1]] + v[i - 1]);
    }
return dp[n][W];`, 'java')}
${o('Tham lam "tỉ lệ v/w cao nhất trước" với (w1,v1) (w3,v4) (w4,v5) (w5,v7), W = 7: lấy (w5,v7) rồi (w1,v1) = <b class="do">8</b>. DP: (w3,v4) + (w4,v5) = <b style="color:#2f7d4f">9</b>. Tham lam chỉ đúng khi được <b>cắt</b> đồ vật (fractional knapsack).', 'do2')}</div></div>` },

  /* 4 */
  { t: 'Cái túi 0/1: điền bảng từng ô và lấy lại đồ vật', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>
${luoi([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 4, 5, 5, 5, 5],
    [0, 1, 1, 4, 5, 6, 6, 9],
    [0, 1, 1, 4, 5, 7, 8, 9],
  ], { w: 52, h: 42, fs: 19, lblW: 96, rowLbl: ['chưa có', '+(1,1)', '+(3,4)', '+(4,5)', '+(5,7)'], colLbl: ['c=0', '1', '2', '3', '4', '5', '6', '7'], fill: { '4,7': 'do', '3,7': 'do', '2,3': 'xanh', '1,0': 'xanh', '2,7': 'cam' } })}
${nho('Hàng = đã xét thêm món (w,v). Output thật Knapsack01.java; PASS 3000 ca so với mọi tập con.')}</div>
<div>${o('<b>Một ô:</b> dp[3][7] = max(bỏ: dp[2][7] = 5, lấy (4,5): dp[2][3] + 5 = 4 + 5) = <b>9</b>', 'xanh')}
<p style="font-size:19px;margin-top:4px"><b>Lấy lại</b>: đi từ ô dưới-phải lên; ô <b>khác</b> ô ngay trên ⇒ đã lấy món đó, trừ sức chứa:</p>
${out(`dp[4][7]=9 = dp[3][7]=9  -> bo (5,7)
dp[3][7]=9 ≠ dp[2][7]=5  -> LAY (4,5), c = 3
dp[2][3]=4 ≠ dp[1][3]=1  -> LAY (3,4), c = 0
dp[1][0]=0 = dp[0][0]    -> bo (1,1)
best = 9, items taken (index) = [1, 2]`, 'font-size:15px')}
${nho('Thời gian <b>O(n·W)</b>, bộ nhớ O(n·W). W lớn (10⁹) thì bảng không dựng nổi — đó là giả đa thức (pseudo-polynomial).')}</div></div>` },

  /* 5 */
  { t: 'Rút về 1 hàng: vì sao phải duyệt dung lượng NGƯỢC', body: `<div class="hai" style="grid-template-columns:1fr 1.08fr"><div>${code(`int[] dp = new int[W + 1];
for (int i = 0; i < n; i++)
    for (int c = W; c >= w[i]; c--)   // NGƯỢC
        dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);`, 'java')}
${ul([
    'Hàng i chỉ đọc hàng i−1 ⇒ ghi đè <b>một mảng</b>: bộ nhớ <b>O(W)</b>',
    'Duyệt <b>ngược</b>: khi tính dp[c], ô dp[c − w] bên trái <b>chưa bị ghi</b> ⇒ vẫn là giá trị "chưa có món i"',
    'Duyệt <b>xuôi</b>: dp[c − w] <b>đã chứa món i</b> ⇒ món i bị lấy lần nữa',
  ], 19)}</div>
<div><p style="font-size:18px">Món (w2,v3), (w3,v4), W = 6 — chạy thật:</p>
${out(`backward after (w2,v3): [0, 0, 3, 3, 3, 3, 3]
backward after (w3,v4): [0, 0, 3, 4, 4, 7, 7]
backward = 7
forward  after (w2,v3): [0, 0, 3, 3, 6, 6, 9]
forward  after (w3,v4): [0, 0, 3, 4, 6, 7, 9]
forward  = 9  <- (w2,v3) used 3 times: unbounded!`, 'font-size:14px')}
${o('Duyệt xuôi: dp[4] = dp[2] + 3 = 6 — dp[2] vừa được gán 3 <b>trong cùng lượt</b> ⇒ (w2,v3) dùng 2 lần, dp[6] dùng 3 lần.', 'do2')}
${out(`PASS backward == 0/1 brute force (3000 cases)
PASS forward == UNBOUNDED brute force (3000 cases)
forward gave a different answer from 0/1 in 1834 of 3000 cases`, 'font-size:14px;margin-top:4px')}</div></div>` },

  /* 6 */
  { t: 'Cái túi không giới hạn (unbounded knapsack)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">Mỗi món lấy <b>bao nhiêu lần cũng được</b>. Ví dụ: cắt thanh sắt (rod cutting) dài 8, mẩu dài L bán price[L].</p>
${code(`// dp[x] = thu nhập tốt nhất cho thanh dài x
for (int x = 1; x <= n; x++)          // XUÔI
    for (int L = 1; L <= x; L++)      // mẩu cuối dài L
        dp[x] = Math.max(dp[x],
                         dp[x - L] + price[L]);`, 'java')}
${bang([
    ['0/1', 'dp[<b>i−1</b>][c−w] + v', '<b>ngược</b>'],
    ['không giới hạn', 'dp[<b>i</b>][c−w] + v', '<b>xuôi</b>'],
  ], ['Loại', 'Bảng 2D: "lấy" đọc hàng', 'Mảng 1D duyệt'], 'font-size:18px')}</div>
<div>${hang([1, 5, 8, 9, 10, 17, 17, 20], { w: 50, nhan: 'price', nhanW: 60, chiSo: ['1', '2', '3', '4', '5', '6', '7', '8'] })}
${hang([0, 1, 5, 8, 10, 13, 17, 18, 22], { w: 50, nhan: 'dp', nhanW: 60, fill: { 0: 'xanh', 8: 'do' } })}
${out(`best = 22, pieces = [2, 6]  (no cut: 20)
PASS 300 random price lists (length 0..12) vs trying every cut`, 'font-size:14px')}
${ul([
    '22 = price[2] + price[6] = 5 + 17; lưu "mẩu đầu" firstCut[x] để lấy lại',
    'Đổi tiền (deck CS3) chính là cái túi không giới hạn: min số đồng thay cho max giá trị',
    'O(n²) ở đây (n độ dài × n mẩu); tổng quát O(số món × W)',
  ], 18)}</div></div>` },

  /* 7 */
  { t: 'Tổng tập con &amp; chia hai tập tổng bằng nhau', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${o('<b>Subset sum</b>: có tập con tổng đúng bằng S? <b>Chia tập</b> (partition, ý bài LC 416): tổng lẻ ⇒ <b>false</b>; chẵn ⇒ hỏi subset sum với S = tổng / 2.', 'xanh')}
${code(`boolean[] can = new boolean[S + 1];
can[0] = true;                     // tập rỗng
for (int x : a)
    for (int s = S; s >= x; s--)   // NGƯỢC: 0/1
        if (can[s - x]) can[s] = true;
return can[S];`, 'java')}
${nho('Là cái túi 0/1 với "giá trị" true/false. O(n·S) thời gian, O(S) bộ nhớ.')}</div>
<div><p style="font-size:18px">a = [2, 7, 4, 5, 6], tổng 24 ⇒ S = 12; cột s = 0…12 (T = làm được):</p>
${out(`           s: 0123456789012
  after  2: T.T..........
  after  7: T.T....T.T...
  after  4: T.T.T.TT.T.T.
  after  5: T.T.TTTT.T.TT
  after  6: T.T.TTTTTTTTT
partition [2, 7, 4, 5, 6] -> true`, 'font-size:15px')}
${ul([
    's = 12 bật ở món 5: can[12 − 5] = can[7] (từ 7) ⇒ {7, 5} | {2, 4, 6}',
    '[3, 1, 5]: tổng 9 lẻ → false ngay · [1, 3, 8]: tổng 12, không tạo được 6 → false',
    '<b>Đếm</b> số tập con thay vì true/false: cộng dồn (bài tập 1)',
  ], 18)}
${nho('PASS 3000 ca (mảng rỗng, S = 0) so với mọi tập con.')}</div></div>` },

  /* 8 */
  { t: 'Dãy con chung dài nhất (LCS)', body: `<div class="hai" style="grid-template-columns:1fr 1.08fr"><div>
${o('<b>dp[i][j]</b> = độ dài LCS của <b>a[0..i)</b> và <b>b[0..j)</b>. Hàng 0, cột 0 = chuỗi rỗng = 0.', 'xanh')}
${ul([
    'Ký tự cuối <b>bằng nhau</b>: nối vào LCS của hai phần trước ⇒ <b>dp[i−1][j−1] + 1</b> (ô chéo)',
    '<b>Khác nhau</b>: ít nhất một ký tự không dùng ⇒ <b>max(dp[i−1][j], dp[i][j−1])</b>',
    'Thứ tự: i tăng, j tăng (kiểu A)',
    'O(n·m) thời gian và bộ nhớ',
  ], 19)}
${nho('Dãy con (subsequence): giữ thứ tự, <b>được bỏ</b> ký tự. Khác <b>xâu con</b> (substring) liên tiếp — bài tập 3.')}</div>
<div>${luoi([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 2],
    [0, 0, 1, 1, 1, 1, 1, 2],
    [0, 0, 1, 2, 2, 2, 2, 2],
    [0, 0, 1, 2, 2, 3, 3, 3],
  ], { w: 54, h: 42, fs: 19, lblW: 44, rowLbl: ['""', 'S', 'T', 'O', 'N', 'E'], colLbl: ['""', 'L', 'O', 'N', 'G', 'E', 'S', 'T'], fill: { '3,2': 'xanh', '4,3': 'xanh', '5,5': 'xanh', '5,7': 'do', '5,6': 'cam', '4,4': 'cam', '2,1': 'cam', '1,1': 'cam' } })}
${nho('a = STONE, b = LONGEST. Ô xanh: ký tự khớp trên đường truy vết → "ONE", độ dài <b>3</b>. Output thật Lcs.java.')}</div></div>` },

  /* 9 */
  { t: 'LCS: truy vết in ra dãy, và tối ưu bộ nhớ', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`int i = n, j = m;
StringBuilder s = new StringBuilder();
while (i > 0 && j > 0) {
    if (a.charAt(i - 1) == b.charAt(j - 1)) {
        s.append(a.charAt(i - 1)); i--; j--;   // chéo
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;                  // đi về ô lớn hơn
}
return s.reverse().toString();`, 'java')}
${out(`LCS length 3: "ONE"  subsequence of both: true
PASS 3000 random pairs over {A,B,C}: length vs
     brute force, rebuilt string valid`, 'font-size:14px;margin-top:6px')}</div>
<div>${ul([
    'Đi từ (n, m) ngược về: <b>khớp</b> ⇒ lấy ký tự, đi chéo; không khớp ⇒ sang ô <b>lớn hơn</b> (trên hoặc trái)',
    'Nhặt ký tự từ cuối ⇒ <b>đảo</b> chuỗi ở cuối',
    'Nhiều LCS cùng độ dài: thứ tự ưu tiên (trên trước trái) quyết định in ra cái nào',
  ], 19)}
${o('<b>Bộ nhớ</b>: ô chỉ đọc hàng trên + hàng hiện tại ⇒ 2 hàng, <b>O(min(n, m))</b>. Nhưng mất bảng ⇒ <b class="do">không truy vết được</b> (muốn cả hai: thuật toán Hirschberg).', 'do2')}
${nho('Ứng dụng: công cụ so sánh file (diff) tìm phần chung lớn nhất của hai bản để in các dòng thêm/xoá.')}</div></div>` },

  /* 10 */
  { t: 'Khoảng cách chỉnh sửa (edit distance)', body: `<div class="hai" style="grid-template-columns:1fr 1.12fr"><div>
${o('<b>dp[i][j]</b> = số phép sửa <b>ít nhất</b> biến a[0..i) thành b[0..j). Ba phép: <b>chèn</b>, <b>xoá</b>, <b>thay</b> một ký tự.', 'xanh')}
${code(`dp[i][0] = i;  dp[0][j] = j;     // xoá hết / chèn hết
int same = a[i-1] == b[j-1] ? 0 : 1;
dp[i][j] = min(dp[i-1][j-1] + same, // giữ / thay
               dp[i-1][j]   + 1,    // xoá a[i-1]
               dp[i][j-1]   + 1);   // chèn b[j-1]`, 'java')}
${nho('Ý bài LC 72. Cơ sở <b>không phải 0</b>: biến "SUN" thành "" cần 3 phép xoá.')}</div>
<div>${luoi([
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [1, 0, 1, 2, 3, 4, 5, 6, 7],
    [2, 1, 1, 2, 2, 3, 4, 5, 6],
    [3, 2, 2, 2, 3, 3, 4, 5, 6],
    [4, 3, 3, 3, 3, 4, 3, 4, 5],
    [5, 4, 3, 4, 4, 4, 4, 3, 4],
    [6, 5, 4, 4, 5, 5, 5, 4, 3],
  ], { w: 50, h: 38, fs: 18, lblW: 40, rowLbl: ['""', 'S', 'U', 'N', 'D', 'A', 'Y'], colLbl: ['""', 'S', 'A', 'T', 'U', 'R', 'D', 'A', 'Y'], fill: { '0,0': 'cam', '1,1': 'cam', '1,2': 'cam', '1,3': 'cam', '2,4': 'cam', '3,5': 'cam', '4,6': 'cam', '5,7': 'cam', '6,8': 'do' } })}
${nho('SUNDAY → SATURDAY = <b>3</b>. Ô cam: đường truy vết (slide sau). Output thật EditDistance.java.')}</div></div>` },

  /* 11 */
  { t: 'Edit distance: truy vết ra các thao tác', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${bang([
    ['(6,8) Y = Y, bằng ô chéo', 'giữ Y', '3'],
    ['(5,7) A = A · (4,6) D = D', 'giữ A, D', '3'],
    ['(3,5) N ≠ R, = chéo + 1', '<b>thay N → R</b>', '3 → 2'],
    ['(2,4) U = U', 'giữ U', '2'],
    ['(1,3) = ô trái + 1', '<b>chèn T</b>', '2 → 1'],
    ['(1,2) = ô trái + 1', '<b>chèn A</b>', '1 → 0'],
    ['(1,1) S = S', 'giữ S', '0'],
  ], ['Ô (i, j)', 'Thao tác', 'dp'], 'font-size:17px')}
${out(`distance = 3, edits = [insert A, insert T, replace N->R]
PASS 2000 random pairs (empty strings too) vs plain
     recursion; edit list has that length`, 'font-size:14px;margin-top:6px')}</div>
<div>${ul([
    'Đi từ (n, m) về (0, 0), mỗi bước hỏi: ô này <b>đến từ</b> ô nào?',
    '<b>Chéo</b>, ký tự bằng ⇒ giữ · <b>chéo + 1</b> ⇒ thay · <b>trên + 1</b> ⇒ xoá a[i−1] · <b>trái + 1</b> ⇒ chèn b[j−1]',
    'Số thao tác in ra = dp[n][m] (chương trình tự kiểm)',
  ], 19)}
${o('Thời gian <b>O(n·m)</b>. Bộ nhớ: 2 hàng O(m); hoặc 1 hàng + biến giữ ô <b>chéo cũ</b> (bị ghi đè trước khi dùng).', 'xanh')}
${o('Đệ quy không nhớ: mỗi lần khác nhau tách <b>3 nhánh</b> ⇒ cỡ O(3<sup>n+m</sup>). Chỉ dùng làm "vét cạn" để kiểm trên chuỗi ≤ 6 ký tự.', 'do2')}
${nho('Ứng dụng: gợi ý sửa chính tả, so khớp gần đúng, so sánh chuỗi DNA.')}</div></div>` },

  /* 12 */
  { t: 'DP trên lưới: số đường đi có vật cản', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">Chỉ đi <b>phải</b> hoặc <b>xuống</b>, từ góc trên-trái tới góc dưới-phải; ô ■ là vật cản (ý bài LC 63).</p>
${luoi([
    [1, 1, 1, 1, 1],
    [1, '#', 1, 2, '#'],
    [1, 1, 2, 4, 4],
    ['#', 1, 3, '#', 4],
  ], { w: 62, h: 50, fs: 22, fill: { '0,0': 'xanh', '3,4': 'do' } })}
${nho('Output thật GridPaths.java: đáp án <b>4</b>. PASS 2000 lưới ngẫu nhiên (1×1, vật cản ở đầu/cuối) so với đi thử mọi đường.')}</div>
<div>${code(`if (g[r][c] == 1) dp[r][c] = 0;       // vật cản
else if (r == 0 && c == 0) dp[r][c] = 1;
else dp[r][c] = (r > 0 ? dp[r-1][c] : 0)  // từ trên
              + (c > 0 ? dp[r][c-1] : 0); // từ trái`, 'java', 'sm')}
${ul([
    'Bước cuối vào (r, c) đến từ <b>trên</b> hoặc <b>trái</b> ⇒ cộng',
    'Không vật cản: 4×5 → <b>35</b> = C(7, 3) (chọn 3 bước xuống trong 7 bước)',
    'O(R·C); bộ nhớ 1 hàng: <code>dp[c] += dp[c-1]</code>',
  ], 19)}
${o('<b>Bẫy</b>: "hàng đầu toàn 1" chỉ đúng tới vật cản — sau ■ là <b>0</b>. Vật cản ở ô xuất phát ⇒ 0. Lưới 18×18 trống: <b>2.333.606.220</b> đường &gt; trần int ⇒ <b>long</b>.', 'do2')}</div></div>` },

  /* 13 */
  { t: 'DP trên lưới: đường đi có tổng nhỏ nhất', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">Mỗi ô có chi phí ≥ 0; đi phải/xuống; tìm tổng nhỏ nhất (ý bài LC 64).</p>
<div style="display:flex;gap:18px;align-items:flex-start">
<div>${nho('lưới', 'margin-bottom:4px')}${luoi([[3, 1, 4, 8], [2, 7, 1, 2], [6, 1, 5, 3]], { w: 50, h: 44, fs: 20, fill: { '0,0': 'cam', '0,1': 'cam', '0,2': 'cam', '1,2': 'cam', '1,3': 'cam', '2,3': 'cam' } })}</div>
<div>${nho('dp', 'margin-bottom:4px')}${luoi([[3, 4, 8, 16], [5, 11, 9, 11], [11, 12, 14, 14]], { w: 50, h: 44, fs: 20, fill: { '0,0': 'cam', '0,1': 'cam', '0,2': 'cam', '1,2': 'cam', '1,3': 'cam', '2,3': 'do' } })}</div></div>
${out(`min sum = 14, path:(0,0) (0,1) (0,2) (1,2) (1,3) (2,3)
PASS 2000 random grids (1 row, 1 column, zeros) vs every path`, 'font-size:14px;margin-top:8px')}</div>
<div>${ul([
    '<b>dp[r][c] = g[r][c] + min(dp[r−1][c], dp[r][c−1])</b>',
    'Hàng đầu chỉ đến từ trái, cột đầu chỉ từ trên — <b>cộng dồn</b>, không lấy min với ô ngoài lưới',
    'Truy vết: từ góc cuối, lùi về ô hàng xóm có dp <b>nhỏ hơn</b>',
    '3 + 1 + 4 + 1 + 2 + 3 = 14',
  ], 19)}
${o('Tham lam "luôn bước sang ô rẻ hơn": ở lưới này may mắn ra 14, nhưng lưới [1,2,9] [5,9,9] [1,1,1] thì tham lam <b class="do">22</b>, DP <b style="color:#2f7d4f">9</b>. Chọn rẻ lúc đầu, trả đắt về sau.', 'do2')}
${nho('O(R·C) thời gian; bộ nhớ O(C) nếu ghi đè một hàng (mất đường đi).')}</div></div>` },

  /* 14 */
  { t: 'Hình vuông lớn nhất toàn số 1', body: `<div class="hai" style="grid-template-columns:1fr 1.02fr"><div>
<div style="display:flex;gap:16px;align-items:flex-start">
<div>${nho('lưới 0/1', 'margin-bottom:4px')}${luoi([[1, 0, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 1], [1, 1, 1, 1, 0]], { w: 40, h: 40, fs: 18, fill: { '1,1': 'xanh', '1,2': 'xanh', '1,3': 'xanh', '2,1': 'xanh', '2,2': 'xanh', '2,3': 'xanh', '3,1': 'xanh', '3,2': 'xanh', '3,3': 'xanh' } })}</div>
<div>${nho('dp', 'margin-bottom:4px')}${luoi([[1, 0, 1, 1, 1], [1, 1, 1, 2, 2], [0, 1, 2, 2, 3], [1, 1, 2, 3, 0]], { w: 40, h: 40, fs: 18, fill: { '3,3': 'do', '2,4': 'do' } })}</div></div>
${out(`largest square: side 3, area 9
PASS 2000 random 0/1 grids (all 0, all 1, 1 x n)
     vs checking every square`, 'font-size:14px;margin-top:8px')}</div>
<div>${o('<b>dp[r][c]</b> = cạnh hình vuông toàn 1 lớn nhất có góc <b>dưới-phải</b> tại (r, c).<br>Ô 0 ⇒ 0 · hàng/cột đầu ⇒ 1<br><b>dp = 1 + min(chéo, trên, trái)</b>', 'xanh')}
${baVuong()}
${ul([
    'Ô đỏ mở rộng được tới cạnh k + 1 chỉ khi <b>cả ba</b> hình vuông cạnh k quanh nó có đủ ⇒ lấy <b>min</b>',
    'Đáp án = <b>max mọi ô</b> (ở đây hai ô = 3), diện tích = cạnh²',
    'O(R·C); vét cạn mọi góc × cỡ × kiểm là O(R·C·k³)',
  ], 18)}</div></div>` },

  /* 15 */
  { t: 'Xâu con đối xứng dài nhất (palindromic substring)', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${o('<b>pal[i][j]</b> = s[i..j] đối xứng ⇔ <b>s[i] == s[j]</b> và (độ dài ≤ 2 hoặc <b>pal[i+1][j−1]</b>).<br>pal[i][j] đọc đoạn <b>ngắn hơn</b> ⇒ điền theo <b>độ dài tăng dần</b> (kiểu C).', 'xanh')}
${code(`for (int len = 1; len <= n; len++)
    for (int i = 0; i + len - 1 < n; i++) {
        int j = i + len - 1;
        pal[i][j] = s.charAt(i) == s.charAt(j)
                 && (len <= 2 || pal[i + 1][j - 1]);
    }`, 'java')}
${out(`s = xabcbayy, palindromes longer than 1 (in the order they are filled):
  len 2: s[6..7] = yy
  len 3: s[2..4] = bcb
  len 5: s[1..5] = abcba
table  -> abcba
centre -> abcba`, 'font-size:14px;margin-top:6px')}</div>
<div>${bang([
    ['Bảng pal', 'O(n²)', 'O(n²)'],
    ['<b>Nở từ tâm</b> (expand around center)', 'O(n²)', '<b>O(1)</b>'],
    ['Manacher (tham khảo)', 'O(n)', 'O(n)'],
  ], ['Cách (ý bài LC 5)', 'Thời gian', 'Bộ nhớ'], 'font-size:18px')}
${ul([
    'Nở từ tâm: <b>2n − 1</b> tâm (n tâm lẻ "a", n − 1 tâm chẵn "bb"), nở tới khi hai đầu khác nhau',
    'Phỏng vấn thường chọn nở từ tâm: ngắn, ít bộ nhớ',
    'Quên tâm chẵn ⇒ sai với "abba"',
  ], 18)}
${nho('PASS 3000 chuỗi {a,b} (cả chuỗi rỗng): cả hai cách so với mọi xâu con. Output thật PalSubstring.java.')}</div></div>` },

  /* 16 */
  { t: 'Dãy con đối xứng dài nhất (palindromic subsequence)', body: `<div class="hai" style="grid-template-columns:1fr 1.02fr"><div>
${o('<b>dp[i][j]</b> = dãy con đối xứng dài nhất trong s[i..j] (ý bài LC 516).<br>s[i] == s[j] ⇒ <b>dp[i+1][j−1] + 2</b> · khác ⇒ <b>max(dp[i+1][j], dp[i][j−1])</b> · dp[i][i] = 1', 'xanh')}
${code(`for (int i = n - 1; i >= 0; i--) {   // i GIẢM
    dp[i][i] = 1;
    for (int j = i + 1; j < n; j++)      // j TĂNG
        dp[i][j] = s.charAt(i) == s.charAt(j)
            ? dp[i + 1][j - 1] + 2
            : Math.max(dp[i + 1][j], dp[i][j - 1]);
}`, 'java')}
${nho('Hàng i đọc hàng i + 1 ⇒ i phải chạy <b>ngược</b>. Thứ tự "theo độ dài" cũng đúng.')}</div>
<div>${luoi([
    [1, 1, 1, 1, 3, 3, 5],
    ['', 1, 1, 1, 3, 3, 3],
    ['', '', 1, 1, 3, 3, 3],
    ['', '', '', 1, 1, 1, 1],
    ['', '', '', '', 1, 1, 1],
    ['', '', '', '', '', 1, 1],
    ['', '', '', '', '', '', 1],
  ], { w: 46, h: 34, fs: 17, lblW: 34, rowLbl: ['A', 'G', 'B', 'C', 'B', 'X', 'A'], colLbl: ['A', 'G', 'B', 'C', 'B', 'X', 'A'], fill: { '0,6': 'do', '2,4': 'cam', '3,3': 'cam' } })}
${ul([
    'AGBCBXA → <b>5</b> (ABCBA). Chỉ nửa trên đường chéo có nghĩa',
    'Cách 2: <b>LCS(s, đảo ngược s)</b> = LCS(AGBCBXA, AXBCBGA) = 5',
    'O(n²) thời gian và bộ nhớ',
  ], 18)}
${nho('PASS 2000 chuỗi so với mọi dãy con, cả hai cách.')}</div></div>` },

  /* 17 */
  { t: 'DP khoảng: nhân chuỗi ma trận, bắn bóng (ý tưởng)', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
<p style="font-size:19px"><b>Nhân chuỗi ma trận</b>: A 10×30, B 30×5, C 5×60. Nhân (p×q)(q×r) tốn p·q·r phép nhân.</p>
${out(`A 10x30, B 30x5, C 5x60:  (AB)C = 4500, A(BC) = 27000
5 matrices, d = [4, 10, 3, 12, 20, 7]:
best = 1344 as ((AB)((CD)E))`, 'font-size:14px')}
${nho('Đặt ngoặc sai tốn gấp <b>6 lần</b>. Tích ma trận có tính kết hợp nên kết quả như nhau — chỉ chi phí khác.')}
${o('<b>cost[i][j]</b> = rẻ nhất để nhân A<sub>i</sub>…A<sub>j</sub>. Hỏi: phép nhân <b>CUỐI CÙNG</b> tách ở k nào?<br>cost[i][j] = min<sub>k</sub> cost[i][k] + cost[k+1][j] + d[i]·d[k+1]·d[j+1]', 'xanh')}
${nho('PASS 1000 chuỗi (1…7 ma trận) so với mọi cách đặt ngoặc. Output thật MatrixChain.java.')}</div>
<div><p style="font-size:19px"><b>Bắn bóng</b> (burst balloons, ý bài LC 312): nổ quả k được <b>trái·k·phải</b> (hàng xóm lúc đó).</p>
${out(`balloons [2, 4, 3]: best = 33
  burst 4 first, then 2, then 3:
  2*4*3=24 1*2*3=6 1*3*1=3  total 33`, 'font-size:14px')}
${o('Mẹo: chọn quả nổ <b>CUỐI</b> trong khoảng (l, r) — lúc đó hai hàng xóm chắc chắn là <b>l và r</b>. Chọn quả nổ <b>đầu</b> thì hai nửa còn dính nhau ⇒ không tách được.', 'do2')}
${ul([
    'Cả hai: <b>O(n²) khoảng × n điểm tách = O(n³)</b>, bộ nhớ O(n²)',
    'Điền theo <b>độ dài khoảng</b> tăng dần',
  ], 18)}
${nho('PASS 500 hàng (0…6 quả, có số 0) so với thử mọi thứ tự nổ.')}</div></div>` },

  /* 18 */
  { t: 'DP có trạng thái: mua bán cổ phiếu có thời gian chờ', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:19px">Mua/bán nhiều lần, giữ tối đa 1 cổ; bán xong phải <b>nghỉ 1 ngày</b> mới được mua (ý bài LC 309).</p>
${mayTrangThai()}
${o('Mỗi ngày là một <b>máy trạng thái</b>: dp[i][HOLD / SOLD / REST] — thêm một chiều "tình trạng" nhỏ (3 giá trị).', 'xanh')}</div>
<div>${code(`int h = Math.max(hold, rest - p[i]); // giữ / mua
int s = hold + p[i];                 // bán hôm nay
int r = Math.max(rest, sold);        // hết chờ
hold = h; sold = s; rest = r;`, 'java', 'sm')}
${out(`prices [3, 1, 4, 2, 6, 0, 5]  (sold -99 = impossible)
  day 0 price 3:  hold  -3  sold -99  rest   0
  day 1 price 1:  hold  -1  sold  -2  rest   0
  day 2 price 4:  hold  -1  sold   3  rest   0
  day 3 price 2:  hold  -1  sold   1  rest   3
  day 4 price 6:  hold  -1  sold   5  rest   3
  day 5 price 0:  hold   3  sold  -1  rest   5
  day 6 price 5:  hold   3  sold   8  rest   5
best with cooldown = 8;  no rule = 12`, 'font-size:13.5px')}
${nho('Mua 1 bán 4, nghỉ ngày 3, mua 0 bán 5: 3 + 5 = 8. <b>Mua chỉ từ REST</b> — đó là cách cài luật "chờ".')}</div></div>` },

  /* 19 */
  { t: 'Họ bài cổ phiếu: cùng một máy trạng thái', body: `<div class="hai" style="grid-template-columns:1.1fr 1fr"><div>
${bang([
    ['1 lần mua–bán (LC 121)', 'giữ giá thấp nhất đã qua', 'O(n), O(1)'],
    ['Không giới hạn (LC 122)', 'HOLD / CASH', 'O(n), O(1)'],
    ['Có thời gian chờ (LC 309)', 'HOLD / SOLD / REST', 'O(n), O(1)'],
    ['Có phí mỗi lần bán (LC 714)', 'HOLD / CASH, trừ phí khi bán', 'O(n), O(1)'],
    ['Tối đa k lần (LC 188)', 'dp[số lần][HOLD / CASH]', 'O(n·k), O(k)'],
  ], ['Biến thể', 'Trạng thái', 'Độ phức tạp'], 'font-size:17px')}
${code(`int c = Math.max(cash, hold + x - fee); // bán, trả phí
hold = Math.max(hold, cash - x);        // mua
cash = c;`, 'java', 'sm')}</div>
<div>${out(`prices [3, 1, 4, 2, 6, 0, 5]
best with cooldown = 8;  no rule = 12
fee 2, no cooldown = 6
PASS 2000 random price lists (0..10 days)
     vs trying every buy/sell/wait`, 'font-size:14px')}
${ul([
    'Không luật: 1→4, 2→6, 0→5 = 3 + 4 + 5 = <b>12</b>',
    'Phí 2 mỗi lần bán: 1→6, 0→5 = (5 − 2) + (5 − 2) = <b>6</b> (ba giao dịch nhỏ cũng chỉ 1 + 2 + 3 = 6)',
    'Cách nghĩ: vẽ các "tình trạng" và mũi tên giữa chúng <b>trước</b>, rồi mỗi mũi tên thành một vế max',
  ], 18)}
${o('"Không thể" (chưa có cổ để bán) dùng <code>Integer.MIN_VALUE / 2</code>, không dùng MIN_VALUE: cộng giá vào sẽ <b class="do">tràn thành số dương lớn</b>.', 'do2')}</div></div>` },

  /* 20 */
  { t: 'Bitmask DP: người du lịch (TSP) cỡ nhỏ', body: `<div class="hai" style="grid-template-columns:1.08fr 1fr"><div>
<p style="font-size:19px">Đi qua <b>mọi</b> thành phố đúng một lần rồi về 0, tổng đường ngắn nhất (travelling salesman problem).</p>
${code(`// dp[mask][v]: đã đi đúng tập mask, đang ở v
dp[1][0] = 0;                    // mask 0001
for (int mask = 1; mask < (1 << n); mask++)
  for (int v = 0; v < n; v++) {
    if (dp[mask][v] == INF) continue;
    for (int u = 0; u < n; u++)
      if ((mask & (1 << u)) == 0)          // u chưa đi
        dp[mask | 1 << u][u] = Math.min(
          dp[mask | 1 << u][u], dp[mask][v] + d[v][u]);
  }
// đáp án: min dp[full][v] + d[v][0]`, 'java', 'sm')}</div>
<div>${ul([
    '<b>mask</b>: bit k = 1 ⇔ đã qua thành phố k. mask | 1 &lt;&lt; u luôn <b>lớn hơn</b> mask ⇒ duyệt mask tăng là đúng thứ tự',
    'Chỉ cần nhớ <b>tập</b> đã đi + chỗ đứng, không cần nhớ <b>thứ tự</b> đã đi',
  ], 18)}
${out(`4 cities, shortest round trip from city 0 = 97
  (0-1-2-3-0: 20+30+12+35)
n = 20 -> 2^20 x 20 = 20971520 states
  (vs 19! orders = 121645100408832000)`, 'font-size:14px')}
${o('Thời gian <b>O(2ⁿ·n²)</b>, bộ nhớ O(2ⁿ·n). Dùng được tới n ≈ 20; vét cạn (n−1)! đã là 479 triệu thứ tự với n = 13.', 'xanh')}
${nho('PASS 300 bảng khoảng cách ngẫu nhiên (1…7 thành phố, không đối xứng) so với thử mọi thứ tự.')}</div></div>` },

  /* 21 */
  { t: 'Tối ưu bộ nhớ: giữ bao nhiêu hàng, duyệt chiều nào', body: `${bang([
    ['Cái túi 0/1, tổng tập con', 'hàng i−1: ô c và c − w', '1 hàng, dung lượng <b>NGƯỢC</b>', 'O(W)'],
    ['Cái túi không giới hạn, đổi tiền', 'hàng i: ô c − w (đã có món i)', '1 hàng, dung lượng <b>XUÔI</b>', 'O(W)'],
    ['Lưới: số đường, tổng nhỏ nhất', 'trên + trái', '1 hàng, cột xuôi', 'O(C)'],
    ['LCS, edit distance', 'trên + trái + <b>chéo</b>', '2 hàng, hoặc 1 hàng + biến giữ chéo cũ', 'O(m)'],
    ['Xâu/dãy con đối xứng', 'hàng i + 1', '2 hàng (i giảm)', 'O(n)'],
    ['Cổ phiếu (máy trạng thái)', 'ngày hôm trước', 'vài biến', 'O(1)'],
    ['TSP bitmask, DP khoảng (O(n³))', 'nhiều ô rải rác', 'giữ cả bảng', 'O(2ⁿ·n), O(n²)'],
  ], ['Bài', 'Ô (i, ·) đọc', 'Rút gọn', 'Bộ nhớ'], 'font-size:18px')}
<div class="hai" style="margin-top:6px">${o('Quy tắc: nhìn <b>mũi tên phụ thuộc</b>. Ô cần đọc phải <b>chưa bị ghi đè</b> lúc đọc — chiều duyệt quyết định điều đó.', 'xanh')}
${o('Rút gọn = <b>mất bảng</b> ⇒ không truy vết được. Đề hỏi "chọn những gì / in dãy / in thao tác" ⇒ giữ bảng đầy đủ.', 'do2')}</div>` },

  /* 22 */
  { t: 'Bẫy hay mất điểm', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
${o('<b>① Chiều duyệt 1D</b>: cái túi 0/1 duyệt xuôi = âm thầm thành không giới hạn (1834/3000 ca sai trong phép đo). Không lỗi, không ngoại lệ — chỉ sai số.', 'do2')}
${o('<b>② Lệch một</b>: dp[i][j] ứng với a[i−1], b[j−1]; bảng <b>(n+1)×(m+1)</b>. Cơ sở edit distance là i và j, <b>không phải 0</b>.')}
${o('<b>③ Hàng/cột đầu của lưới</b>: sau vật cản là 0; tổng nhỏ nhất thì hàng đầu là cộng dồn, không phải min.')}</div>
<div>${o('<b>④ Thứ tự tính</b>: DP khoảng/đối xứng điền theo i tăng ⇒ đọc pal[i+1][·] <b>chưa tính</b>. Phải theo độ dài, hoặc i giảm.', 'do2')}
${o('<b>⑤ Xâu con vs dãy con</b>: substring ô khác nhau ⇒ <b>0</b> (đứt), đáp án = max mọi ô; subsequence ⇒ max(trên, trái), đáp án = ô cuối.')}
${o('<b>⑥ Tràn số</b>: lưới 18×18 = 2.333.606.220 đường; C(60, 30) = 118.264.581.564.861.424 — dùng <b>long</b> hoặc modulo. "Không thể" = MIN_VALUE / 2.')}</div></div>` },

  /* 23 */
  { t: 'Nhận dạng: đây là dạng DP nào?', body: `${bang([
    ['Chọn / không chọn từng món, có giới hạn tổng (cân nặng, tiền, số 0/1)', 'Cái túi 0/1 — 1D duyệt ngược', 'LC 416, 494, 474'],
    ['Món dùng lại được, đạt đúng / tối đa một tổng', 'Cái túi không giới hạn — duyệt xuôi', 'LC 322, 518, 279'],
    ['Hai chuỗi: chung dài nhất, biến chuỗi này thành chuỗi kia, trộn, đếm cách chọn', 'dp[i][j] trên hai tiền tố', 'LC 1143, 72, 97, 115'],
    ['Lưới, chỉ đi phải/xuống', 'dp[r][c] từ trên + trái', 'LC 62, 63, 64, 221'],
    ['Đối xứng, đặt ngoặc, "nổ/gộp/cắt" trong một đoạn', 'DP khoảng dp[i][j], theo độ dài; thử điểm tách / phần tử cuối', 'LC 5, 516, 312, 1039'],
    ['Mỗi bước có vài "tình trạng": giữ/không, chờ, số lần còn lại', 'dp[i][trạng thái] — vẽ máy trạng thái', 'LC 309, 714, 188'],
    ['n ≤ 20, "đi qua mọi…", "gán mỗi người một việc"', 'Bitmask dp[mask][·]', 'TSP, LC 847, 1879'],
  ], ['Thấy trong đề', 'Nghĩ tới', 'Ví dụ'], 'font-size:17px')}
${nho('Mẹo cỡ dữ liệu: n ≤ 20 → 2ⁿ; n ≤ 500 → O(n³); n ≤ 5000 → O(n²); tổng/sức chứa ≤ 10⁴–10⁵ → bảng theo tổng.', 'margin-top:4px')}` },

  /* 24 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['Cái túi 0/1 (bảng / 1 hàng)', 'O(n·W)', 'O(n·W) / O(W)', 'n món × W sức chứa'],
    ['Cái túi không giới hạn, cắt thanh', 'O(n·W)', 'O(W)', 'W ô × n món'],
    ['Tổng tập con, chia tập', 'O(n·S)', 'O(S)', 'S = tổng / 2'],
    ['LCS, edit distance', 'O(n·m)', 'O(n·m), 2 hàng O(m)', 'mỗi ô O(1)'],
    ['Lưới (đường đi, tổng nhỏ nhất, hình vuông)', 'O(R·C)', 'O(R·C) / O(C)', 'mỗi ô đọc 2–3 ô'],
    ['Xâu con đối xứng (bảng / nở từ tâm)', 'O(n²)', 'O(n²) / O(1)', '2n − 1 tâm'],
    ['Dãy con đối xứng', 'O(n²)', 'O(n²)', 'n² đoạn'],
    ['Nhân chuỗi ma trận, bắn bóng', 'O(n³)', 'O(n²)', 'n² đoạn × n điểm tách'],
    ['Cổ phiếu (máy trạng thái)', 'O(n) · O(n·k)', 'O(1) · O(k)', 'vài trạng thái mỗi ngày'],
    ['TSP bitmask', 'O(2ⁿ·n²)', 'O(2ⁿ·n)', '2ⁿ tập × n chỗ đứng × n bước tiếp'],
  ], ['Bài', 'Thời gian', 'Bộ nhớ', 'Vì sao'], 'font-size:17px')}
${nho('Vẫn là quy tắc deck CS3: <b>thời gian = số trạng thái × công mỗi trạng thái</b>.', 'margin-top:2px')}` },

  /* 25 */
  { t: 'Tóm tắt', body: `<ul style="font-size:21px">
<li>DP 2 chiều = cùng <b>4 bước</b>, trạng thái có 2 chỉ số; thứ tự tính theo <b>mũi tên phụ thuộc</b> (hàng/cột, hàng trên, độ dài đoạn)</li>
<li><b>Cái túi 0/1</b>: max(bỏ, lấy từ hàng trên); lấy lại món bằng "ô khác ô trên"; 1 hàng thì dung lượng <b>ngược</b> — xuôi là <b>không giới hạn</b></li>
<li>Tổng tập con / chia tập = cái túi true/false; tổng lẻ ⇒ false ngay</li>
<li><b>LCS</b>: khớp ⇒ chéo + 1, không ⇒ max(trên, trái); <b>edit distance</b>: min(chéo + khác, trên + 1, trái + 1), cơ sở i, j</li>
<li><b>Lưới</b>: từ trên + trái; vật cản = 0; hình vuông = 1 + min của 3 ô</li>
<li><b>DP khoảng</b>: đối xứng, nhân ma trận, bắn bóng — theo độ dài, thử điểm tách / phần tử <b>cuối</b>, O(n³)</li>
<li><b>Máy trạng thái</b> (cổ phiếu) và <b>bitmask</b> (TSP, n ≤ 20): thêm một chiều nhỏ cho "tình trạng"</li>
<li>Truy vết cần cả bảng; tối ưu bộ nhớ thì mất truy vết</li>
</ul>` },
].map((it) => (it.body ? { ...it, body: ST + it.body } : it)));
