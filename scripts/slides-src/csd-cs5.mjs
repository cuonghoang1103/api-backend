/**
 * csd-cs5.mjs — CSD201 ⭐ Chuyên sâu 5: THAM LAM & CHIA ĐỂ TRỊ (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs5.mjs --out <dir>
 *
 * Mọi bảng từng bước, mọi con số (số ca sai, số phép so sánh, PASS/FAIL) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs5/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs5', code: 'CS5', title: 'Tham lam và chia để trị', sub: 'CSD201 · ⭐ Chuyên sâu' };

const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b', xam: '#bfbfbf', lam: '#2b6cb0' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff', lam: '#e3eefa' };

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t) => `<p class="nho">${t}</p>`;
const xanhB = (t) => `<b style="color:#2f7d4f">${t}</b>`;

/* ───────────── SVG: các khoảng trên trục thời gian ───────────── */
/**
 * rows: [[s, e, loai, nhan?]]  loai: 'xanh' (chọn) | 'xam' (bỏ) | 'do' | 'cam' | 'lam'
 * opt: { t0, t1, w (px cả hình), rowH, nhanTrai: true → in "[s,e)" bên trái }
 */
function truc(rows, { t0, t1, w = 560, rowH = 24, gap = 5, ticks = null, nhanTrai = true, dong = ')' } = {}) {
  const L = nhanTrai ? 74 : 8, R = 14, top = 6;
  const sx = (t) => L + (t - t0) / (t1 - t0) * (w - L - R);
  let s = '';
  const H = top + rows.length * (rowH + gap) + 30;
  const tk = ticks || Array.from({ length: t1 - t0 + 1 }, (_, i) => t0 + i).filter((t) => (t1 - t0 > 12 ? t % 2 === 0 : true));
  for (const t of tk) {
    s += `<line x1="${sx(t)}" y1="${top}" x2="${sx(t)}" y2="${H - 24}" stroke="#ececec" stroke-width="1"/>`;
    s += `<text x="${sx(t)}" y="${H - 8}" text-anchor="middle" font-size="14" fill="#8c8c8c">${t}</text>`;
  }
  rows.forEach(([a, b, loai = 'xam', nhan = ''], i) => {
    const y = top + i * (rowH + gap);
    const f = NEN[loai] || NEN.xam, st = MAU[loai] || MAU.xam;
    s += `<rect x="${sx(a)}" y="${y}" width="${Math.max(4, sx(b) - sx(a))}" height="${rowH}" rx="4" fill="${f}" stroke="${st}" stroke-width="${loai === 'xam' ? 1.2 : 2}"/>`;
    if (nhanTrai) s += `<text x="${L - 8}" y="${y + rowH - 6}" text-anchor="end" font-size="15" fill="#595959" font-family="Menlo, monospace">[${a},${b}${dong}</text>`;
    if (nhan) s += `<text x="${(sx(a) + sx(b)) / 2}" y="${y + rowH - 6}" text-anchor="middle" font-size="14" font-weight="800" fill="${loai === 'xam' ? '#8c8c8c' : st}">${nhan}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${H}" width="${w}" font-family="Arial, sans-serif">${s}</svg>`;
}

/** Mảng ô có chỉ số (như deck cs1). fill: {i: 'do'|'xanh'|'cam'|'xam'} */
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

/* ───────────── sơ đồ riêng ───────────── */
// slide 7: G và O, đổi chỗ phần tử đầu
function doiCho() {
  const sx = (t) => 110 + t * 30;
  const hop = (a, b, y, loai, nhan) => `<rect x="${sx(a)}" y="${y}" width="${sx(b) - sx(a)}" height="30" rx="5" fill="${NEN[loai]}" stroke="${MAU[loai]}" stroke-width="2"/><text x="${(sx(a) + sx(b)) / 2}" y="${y + 21}" text-anchor="middle" font-size="16" font-weight="800" fill="${MAU[loai]}">${nhan}</text>`;
  let s = '';
  s += `<text x="0" y="31" font-size="18" font-weight="800" fill="${MAU.xanh}">Tham lam G</text>`;
  s += hop(1, 4, 10, 'xanh', 'g₁') + hop(5, 7, 10, 'xanh', 'g₂') + hop(8, 11, 10, 'xanh', 'g₃') + hop(12, 16, 10, 'xanh', 'g₄');
  s += `<text x="0" y="91" font-size="18" font-weight="800" fill="${MAU.cam}">Tối ưu O</text>`;
  s += hop(3, 5, 70, 'cam', 'o₁') + hop(5, 7, 70, 'cam', 'o₂') + hop(8, 12, 70, 'cam', 'o₃') + hop(12, 16, 70, 'cam', 'o₄');
  s += `<line x1="${sx(4)}" y1="0" x2="${sx(4)}" y2="150" stroke="${MAU.do}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<line x1="${sx(5)}" y1="0" x2="${sx(5)}" y2="150" stroke="${MAU.do}" stroke-width="2" stroke-dasharray="5 4"/>`;
  s += `<text x="${sx(4) - 4}" y="148" text-anchor="end" font-size="15" font-weight="800" fill="${MAU.do}">end(g₁) = 4</text>`;
  s += `<text x="${sx(5) + 4}" y="148" font-size="15" font-weight="800" fill="${MAU.do}">≤ end(o₁) = 5</text>`;
  s += `<text x="${sx(5) + 4}" y="128" font-size="15" fill="#595959">o₂ bắt đầu ≥ 5 ≥ 4</text>`;
  for (let t = 0; t <= 16; t += 2) s += `<text x="${sx(t)}" y="168" text-anchor="middle" font-size="13" fill="#8c8c8c">${t}</text>`;
  return `<svg viewBox="0 0 640 176" width="600" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 12: ô thời gian của việc có hạn chót
function oViec() {
  const cells = [['c', 27, 'xanh'], ['a', 100, 'xanh'], ['e', 15, 'xanh']];
  let s = '';
  cells.forEach(([id, p, loai], i) => {
    const x = 96 + i * 120;
    s += `<rect x="${x}" y="20" width="110" height="54" rx="6" fill="${NEN[loai]}" stroke="${MAU[loai]}" stroke-width="2"/>`;
    s += `<text x="${x + 55}" y="44" text-anchor="middle" font-size="19" font-weight="800" fill="${MAU.xanh}">${id}</text>`;
    s += `<text x="${x + 55}" y="66" text-anchor="middle" font-size="15" fill="#404040">p = ${p}</text>`;
    s += `<text x="${x + 55}" y="94" text-anchor="middle" font-size="14" fill="#8c8c8c">ô ${i + 1}: (${i}, ${i + 1}]</text>`;
  });
  s += `<text x="0" y="52" font-size="16" font-weight="800" fill="${MAU.nau}">thời gian</text>`;
  return `<svg viewBox="0 0 470 104" width="440" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 14: cây đệ quy chia–trị–gộp
function cayChia() {
  let s = '';
  const lv = [[1, 'n', 'n'], [2, 'n/2', 'n'], [4, 'n/4', 'n'], [8, 'n/8', 'n']];
  lv.forEach(([k, nhan, cong], r) => {
    const y = 12 + r * 46, W = 440 / k;
    for (let i = 0; i < k; i++) {
      const x = 10 + i * W;
      s += `<rect x="${x + 3}" y="${y}" width="${W - 6}" height="30" rx="5" fill="${r === 3 ? NEN.xanh : NEN.cam}" stroke="${r === 3 ? MAU.xanh : MAU.cam}" stroke-width="1.6"/>`;
      if (k <= 4) s += `<text x="${x + W / 2}" y="${y + 21}" text-anchor="middle" font-size="16" font-weight="700" fill="#262626">${nhan}</text>`;
      if (r < 3) {
        const cy = y + 30, ny = y + 46, cW = W / 2;
        s += `<line x1="${x + W / 2}" y1="${cy}" x2="${x + cW / 2}" y2="${ny}" stroke="#bfbfbf"/><line x1="${x + W / 2}" y1="${cy}" x2="${x + cW * 1.5}" y2="${ny}" stroke="#bfbfbf"/>`;
      }
    }
    s += `<text x="470" y="${y + 21}" font-size="16" fill="${MAU.nau}" font-weight="800">${k} × ${nhan} = ${cong}</text>`;
  });
  s += `<text x="10" y="210" font-size="15" fill="#595959">… log₂ n tầng, mỗi tầng gộp tổng n ⇒ n log n</text>`;
  return `<svg viewBox="0 0 590 218" width="540" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 20: cặp điểm gần nhất — dải giữa
function daiDiem() {
  const pts = [[30, 60], [70, 150], [110, 40], [150, 110], [185, 170], [220, 75], [262, 128], [300, 52], [335, 160], [380, 95], [420, 140], [455, 60]];
  const midX = 240, d = 48;
  let s = `<rect x="${midX - d}" y="10" width="${2 * d}" height="190" fill="${NEN.cam}" opacity="0.8"/>`;
  s += `<line x1="${midX}" y1="6" x2="${midX}" y2="204" stroke="${MAU.do}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  for (const [x, y] of pts) {
    const inStrip = Math.abs(x - midX) < d;
    s += `<circle cx="${x}" cy="${y}" r="7" fill="${inStrip ? MAU.cam : x < midX ? MAU.lam : MAU.xanh}"/>`;
  }
  s += `<line x1="220" y1="75" x2="262" y2="128" stroke="${MAU.do}" stroke-width="2.5"/>`;
  s += `<text x="${midX - d}" y="224" text-anchor="middle" font-size="15" fill="${MAU.nau}" font-weight="700">x − δ</text>`;
  s += `<text x="${midX + d}" y="224" text-anchor="middle" font-size="15" fill="${MAU.nau}" font-weight="700">x + δ</text>`;
  s += `<text x="90" y="224" text-anchor="middle" font-size="16" fill="${MAU.lam}" font-weight="800">nửa trái: δ₁</text>`;
  s += `<text x="400" y="224" text-anchor="middle" font-size="16" fill="${MAU.xanh}" font-weight="800">nửa phải: δ₂</text>`;
  return `<svg viewBox="0 0 480 232" width="440" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('THAM LAM VÀ CHIA ĐỂ TRỊ', [
  /* 1 */
  { cover: true, t: 'Tham lam và chia để trị', sub: 'Khi nào tham lam đúng · lập luận đổi chỗ · xếp lịch khoảng · phòng họp · jump game · gas station<br>chia–trị–gộp · định lý Master · nghịch thế · quickselect · top-k · luỹ thừa nhanh · cặp điểm gần nhất<br>CSD201 · Java 8 — mọi bảng từng bước đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Ba chiến lược thiết kế thuật toán', body: `${bang([
    ['<b>Ý tưởng</b>', 'Mỗi bước chọn cái <b>tốt nhất lúc này</b>, không quay lại', 'Cắt bài thành các bài con <b>rời nhau</b>, giải riêng, rồi gộp', 'Bài con <b>trùng nhau</b> ⇒ nhớ kết quả, xét mọi lựa chọn'],
    ['<b>Số lựa chọn xét</b>', 'Một', 'Tất cả các nửa (thường 2)', 'Tất cả'],
    ['<b>Tốc độ</b>', 'Nhanh nhất: thường O(n log n) vì phải sắp', 'O(n log n), O(n), O(log n)…', 'Chậm hơn: O(n · số trạng thái)'],
    ['<b>Rủi ro</b>', '<span class="do">Có thể SAI</span> — phải chứng minh', 'Gộp sai, đệ quy sâu', 'Tốn bộ nhớ bảng'],
    ['<b>Đã gặp trong môn</b>', 'Huffman (8.3), Prim, Kruskal (5.6), Dijkstra (5.5)', 'Merge sort, quick sort (6.3–6.4), tìm nhị phân', 'Fibonacci nhớ (3.3), deck ⭐ CS.3–CS.4'],
  ], ['', 'Tham lam (greedy)', 'Chia để trị (divide &amp; conquer)', 'Quy hoạch động (DP)'], 'font-size:19px')}
<div class="hai">${o('<b>Câu hỏi đầu tiên khi thấy bài tối ưu:</b> "chọn cái tốt nhất lúc này có bao giờ làm hỏng về sau không?" Không ⇒ tham lam. Có ⇒ DP.', 'xanh')}
${o('<b>Câu hỏi của chia để trị:</b> "biết đáp án hai nửa thì ghép ra đáp án cả bài có <b>rẻ</b> không?" Rẻ (O(n)) ⇒ O(n log n).')}</div>` },

  /* 3 */
  { t: 'Tham lam: chọn cái tốt nhất lúc này', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<ul style="font-size:22px">
<li>Sắp dữ liệu theo một <b>khoá</b>, rồi đi một lượt, mỗi bước <b>chốt</b> một lựa chọn</li>
<li>Không thử lại, không quay lui ⇒ thường <b>O(n log n)</b> (chi phí sắp)</li>
<li>Khó không phải là code — khó là <b class="do">chọn đúng khoá</b> và <b>chứng minh</b> nó đúng</li>
</ul>
${o('<b>Phản ví dụ kinh điển</b> — đổi tiền, mệnh giá {1, 3, 4}, cần 6: tham lam lấy 4 trước ⇒ 4 + 1 + 1 = <b class="do">3 đồng</b>; đúng ra 3 + 3 = <b>2 đồng</b>. Cách đúng: quy hoạch động — deck ⭐ CS.3.', 'do2')}
<div style="height:10px"></div>${o('Mệnh giá {3, 4}, cần 6: tham lam lấy 4, còn 2 ⇒ <b class="do">kẹt</b>, dù 3 + 3 làm được.', 'do2')}</div>
<div>${out(`coins {1,3,4}, amount 6, greedy:
  take 4 -> left 2
  take 1 -> left 1
  take 1 -> left 0
greedy = 3 coins, optimum = 2 coins`)}
${bang([
    ['{1, 3, 4}', '1…100', '<b class="do">24</b> lần, đầu tiên ở 6'],
    ['{1, 5, 10, 25}', '1…1000', xanhB('0 lần')],
    ['{1, 2, 5, …, 500} (tiền VN)', '1…1000', xanhB('0 lần')],
  ], ['Mệnh giá', 'Số tiền thử', 'Tham lam sai'], 'font-size:18px;margin-top:10px')}
${nho('Hệ tiền thật được thiết kế để tham lam đúng; đề phỏng vấn cho mệnh giá tuỳ ý ⇒ đừng tin tham lam.')}</div></div>` },

  /* 4 */
  { t: 'Khi nào tham lam đúng? Knapsack phân số vs 0/1', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${o('<b>Hai tính chất cần có:</b><br>① <b>Lựa chọn tham lam</b> (greedy-choice): có một lời giải tối ưu <b>chứa</b> lựa chọn tham lam đầu tiên<br>② <b>Cấu trúc con tối ưu</b> (optimal substructure): phần còn lại là cùng bài toán, nhỏ hơn', 'xanh')}
<p style="font-size:20px;margin-top:4px">Túi sức chứa 50; món (khối lượng, giá trị): (10, 60), (20, 100), (30, 120) — tỉ số giá/khối lượng 6, 5, 4.</p>
${bang([
    ['<b>Phân số</b> (được cắt món)', '10 + 20 + <b>20/30</b> của món 3', xanhB('240 = tối ưu')],
    ['<b>0/1</b>, cùng thứ tự tỉ số', '10 + 20, món 3 không vừa', '<b class="do">160</b>'],
    ['<b>0/1</b>, tối ưu (vét cạn)', '20 + 30', '<b>220</b>'],
  ], ['Bài', 'Chọn', 'Giá trị'], 'font-size:19px;margin-top:4px')}</div>
<div>${code(`// phân số: tỉ số giảm dần, cắt món cuối
Arrays.sort(id, (a, b) -> Long.compare(
    (long) v[b] * w[a], (long) v[a] * w[b]));
for (int i : id) {
    int take = Math.min(room, w[i]);
    total += (double) v[i] * take / w[i];
    room -= take;
}`, 'java', 'sm')}
${out(`PASS fractional greedy = brute force on 2000 cases
0/1 greedy by ratio wrong in 203 of 2000 cases`, 'margin-top:8px;font-size:15px')}
${o('0/1 vỡ vì <b>không cắt được</b>: món tỉ số cao có thể để lại chỗ trống vô ích. 0/1 cần DP — deck ⭐ CS.4.', 'do2')}
${nho('So tỉ số bằng nhân chéo <code>v[b]·w[a]</code> kiểu long — không dùng double, không tràn.')}</div></div>` },

  /* 5 */
  { t: 'Chọn hoạt động: sắp theo thời điểm KẾT THÚC', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${truc([[1, 4, 'xanh', 'lấy'], [3, 5], [0, 6], [5, 7, 'xanh', 'lấy'], [3, 9], [5, 9], [6, 10], [8, 11, 'xanh', 'lấy'], [8, 12], [2, 14], [12, 16, 'xanh', 'lấy']], { t0: 0, t1: 16, w: 580, rowH: 19, gap: 4 })}
${nho('11 hoạt động đã sắp theo kết thúc; xanh = chọn, xám = bỏ vì chồng cái vừa chọn. Kết quả: <b>4</b>.')}</div>
<div>${code(`Arrays.sort(a, (x, y) ->
    Integer.compare(x[1], y[1]));   // theo KẾT THÚC
int count = 0, lastEnd = Integer.MIN_VALUE;
for (int[] x : a)
    if (x[0] >= lastEnd) {         // không chồng
        count++; lastEnd = x[1];
    }`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:8px">
<li>Khoảng <b>[s, e)</b>: cái sau được bắt đầu đúng lúc cái trước kết thúc</li>
<li>Kết thúc sớm nhất ⇒ <b>để lại nhiều thời gian nhất</b> cho phần còn lại</li>
<li><b>O(n log n)</b> sắp + O(n) một lượt; bộ nhớ O(1) ngoài bản sao</li>
</ul>
${out(`0 1 1 3 2  <- empty, one, three equal, touching, negative
PASS 3000 random cases vs brute force`, 'font-size:13.5px;margin-top:6px;padding:8px 10px')}</div></div>` },

  /* 6 */
  { t: 'Sắp theo khoá khác thì SAI — chạy thật', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
<p style="font-size:20px"><b>Theo thời điểm bắt đầu</b> — khoảng dài bắt đầu sớm nuốt hết:</p>
${truc([[0, 10, 'do', 'bắt đầu sớm nhất → lấy'], [1, 3, 'xanh'], [4, 6, 'xanh']], { t0: 0, t1: 11, w: 520, rowH: 22 })}
<p style="font-size:19px">Theo bắt đầu: <b class="do">1</b> · theo kết thúc: <b>2</b></p>
<p style="font-size:20px;margin-top:6px"><b>Theo độ dài ngắn nhất</b> — khoảng ngắn chặn hai khoảng:</p>
${truc([[0, 5, 'xanh'], [4, 7, 'do', 'ngắn nhất → lấy'], [6, 11, 'xanh']], { t0: 0, t1: 11, w: 520, rowH: 22 })}
<p style="font-size:19px">Theo độ dài: <b class="do">1</b> · theo kết thúc: <b>2</b></p></div>
<div>${bang([
    ['Kết thúc sớm nhất', xanhB('0 ca — luôn tối ưu')],
    ['Bắt đầu sớm nhất', '<b class="do">4475</b> ca ít hơn tối ưu'],
    ['Ngắn nhất trước', '<b class="do">608</b> ca'],
    ['Ít chồng lấn nhất trước', '<b class="do">17</b> ca'],
  ], ['Khoá sắp', '20000 bộ ngẫu nhiên (≤ 12 khoảng)'], 'font-size:19px')}
${o('"Ít chồng lấn nhất" sai rất hiếm — chỉ 17/20000 — nên thử tay vài ví dụ sẽ <b>tưởng là đúng</b>. Ca nhỏ nhất tìm được có 8 khoảng: nó chọn 4, tối ưu là 5.', 'do2')}
${o('<b>Bài học:</b> một khoá tham lam "nghe hợp lý" chưa là gì. Hoặc chứng minh (slide sau), hoặc đối chiếu vét cạn trên hàng nghìn bộ nhỏ.', 'xanh')}</div></div>` },

  /* 7 */
  { t: 'Chứng minh tham lam: lập luận đổi chỗ', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${doiCho()}
<ol style="font-size:20px;margin-top:4px">
<li>Lấy một lời giải <b>tối ưu bất kỳ</b> O, sắp theo kết thúc</li>
<li>g₁ kết thúc sớm nhất trong <b>mọi</b> khoảng ⇒ end(g₁) ≤ end(o₁)</li>
<li><b>Đổi</b> o₁ thành g₁: o₂ bắt đầu ≥ end(o₁) ≥ end(g₁) ⇒ vẫn không chồng, vẫn <b>cùng số lượng</b></li>
<li>Lặp lại cho o₂, o₃… (quy nạp) ⇒ G có ít nhất |O| khoảng ⇒ G tối ưu</li>
</ol></div>
<div>${out(`greedy G : [1,4) [5,7) [8,11) [12,16)
optimum O: [3,5) [5,7) [8,12) [12,16)
  swap #1: [1,4) [5,7) [8,12) [12,16)  valid
  swap #2: [1,4) [5,7) [8,12) [12,16)  valid
  swap #3: [1,4) [5,7) [8,11) [12,16)  valid
  swap #4: [1,4) [5,7) [8,11) [12,16)  valid
PASS every swap stays valid in 2000 random cases`, 'font-size:14.5px')}
${o('<b>Khuôn nói khi phỏng vấn:</b> "Giả sử có lời giải tối ưu khác lựa chọn của tôi ở bước đầu. Tôi đổi phần tử đó thành lựa chọn tham lam; lời giải vẫn hợp lệ và không tệ hơn. Lặp lại ⇒ tham lam tối ưu."', 'xanh')}
${nho('Cùng khuôn chứng minh: Huffman (gộp hai tần suất nhỏ nhất), Largest Number (bài tập 4), việc có hạn chót (slide 12).')}</div></div>` },

  /* 8 */
  { t: 'Số phòng họp tối thiểu — PriorityQueue', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${truc([[9, 10, 'lam', 'P2'], [9, 12, 'cam', 'P1'], [10, 11, 'lam', 'P2'], [10, 16, 'xanh', 'P3'], [11, 14, 'lam', 'P2'], [12, 13, 'cam', 'P1'], [13, 15, 'cam', 'P1']], { t0: 9, t1: 16, w: 520, rowH: 22 })}
${code(`Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));
PriorityQueue<Integer> ends = new PriorityQueue<>();
for (int[] x : a) {
    if (!ends.isEmpty() && ends.peek() <= x[0])
        ends.poll();          // phòng trống sớm nhất
    ends.add(x[1]);
    most = Math.max(most, ends.size());
}`, 'java', 'sm')}</div>
<div>${bang([
    ['[9,12)', '—', 'mới', '[12]'], ['[9,10)', '12 &gt; 9', 'mới', '[10, 12]'],
    ['[10,11)', '10 ≤ 10', 'dùng lại', '[11, 12]'], ['[10,16)', '11 &gt; 10', '<b>mới</b>', '<b>[11, 12, 16]</b>'],
    ['[11,14)', '11 ≤ 11', 'dùng lại', '[12, 14, 16]'], ['[12,13)', '12 ≤ 12', 'dùng lại', '[13, 14, 16]'],
    ['[13,15)', '13 ≤ 13', 'dùng lại', '[14, 15, 16]'],
  ], ['Họp', 'peek ≤ bắt đầu?', 'Phòng', 'Heap giờ kết thúc'], 'font-size:16px')}
<p style="font-size:19px;margin-top:4px">Đáp án <b class="do">3</b> = cỡ heap lớn nhất = số họp chồng nhau nhiều nhất tại một lúc.</p>
${nho('Hàng đợi ưu tiên (bài 2.5, 4.7): peek O(1), poll/add O(log n) ⇒ <b>O(n log n)</b>, bộ nhớ O(n). Rỗng → 0, [1,5)[5,8) → 1. PASS 5000 ca.')}</div></div>` },

  /* 9 */
  { t: 'Gộp khoảng (merge intervals)', body: `<div class="hai" style="grid-template-columns:0.9fr 1.1fr"><div>
<p style="font-size:19px"><b>Vào</b> (đoạn đóng, đã sắp theo điểm đầu):</p>
${truc([[1, 3, 'cam'], [2, 6, 'cam'], [6, 7, 'cam'], [8, 10, 'lam'], [9, 9, 'lam'], [15, 18, 'xanh'], [17, 20, 'xanh']], { t0: 0, t1: 20, w: 490, rowH: 18, gap: 4, dong: ']' })}
<p style="font-size:19px"><b>Ra:</b> [1,7] · [8,10] · [15,20]</p>
${truc([[1, 7, 'cam'], [8, 10, 'lam'], [15, 20, 'xanh']], { t0: 0, t1: 20, w: 490, rowH: 18, gap: 4, dong: ']' })}</div>
<div>${code(`Arrays.sort(a, (x, y) -> Integer.compare(x[0], y[0]));
for (int[] x : a) {
    int[] last = res.isEmpty() ? null
                               : res.get(res.size() - 1);
    if (last != null && x[0] <= last[1])
        last[1] = Math.max(last[1], x[1]);   // MAX!
    else res.add(new int[]{x[0], x[1]});
}`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:8px">
<li>Sắp theo <b>điểm đầu</b>: mọi khoảng chồng khối hiện tại đều tới liền nhau</li>
<li><code>&lt;=</code>: [2,6] và [6,7] chạm nhau ⇒ gộp (đề đoạn đóng)</li>
</ul>
${o('<b>Bẫy</b>: viết <code>last[1] = x[1]</code> ⇒ [8,10] rồi [9,9] thành <b class="do">[8,9]</b>. Khoảng lồng trong phải dùng <b>max</b>.', 'do2')}
${nho('O(n log n) sắp + O(n) gộp. PASS 5000 ca (rỗng, điểm, số âm, lồng nhau) so với cách tô từng điểm.')}</div></div>` },

  /* 10 */
  { t: 'Jump game: với xa nhất có thể', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">a[i] = bước nhảy <b>xa nhất</b> từ ô i. Tới được ô cuối không? Ít nhất mấy bước?</p>
${mang([2, 3, 1, 1, 4], { fill: { 0: 'cam', 1: 'cam', 2: 'xanh', 3: 'xanh', 4: 'xanh' }, tren: { 0: 'far 2', 1: 'far 4', 4: 'đích' } })}
${bang([['0', '2', '2'], ['1', '3', '<b>4</b> ≥ ô cuối'], ['2…4', '1, 1, 4', '4, 4, 8']], ['i', 'a[i]', 'far'], 'font-size:18px;margin-top:4px')}
<p style="font-size:19px;margin-top:6px">{3, 2, 1, 0, 4}: far kẹt ở 3, tới i = 4 &gt; far ⇒ <b class="do">false</b></p></div>
<div>${code(`int far = 0;                        // I (55)
for (int i = 0; i < a.length; i++) {
    if (i > far) return false;      // không tới được i
    far = Math.max(far, i + a[i]);
}
return true;

int jumps = 0, end = 0; far = 0;    // II (45)
for (int i = 0; i < a.length - 1; i++) {
    far = Math.max(far, i + a[i]);
    if (i == end) { jumps++; end = far; }
}`, 'java', 'sm')}
${o('Bản II là <b>BFS theo tầng</b> không cần hàng đợi: [.., end] tới được bằng <code>jumps</code> bước. {2,3,1,1,4} ⇒ <b>2</b>. Cả hai O(n), bộ nhớ O(1). PASS 5000 mảng so với DP O(n²).', 'xanh')}</div></div>` },

  /* 11 */
  { t: 'Gas station: một lượt, đổi điểm xuất phát', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
<p style="font-size:20px">Đường vòng; trạm i có gas[i] lít, đi tới trạm kế tốn cost[i]. Xuất phát ở đâu để đi hết vòng?</p>
${bang([['0', '1 − 3 = −2', '−2', '<b class="do">&lt; 0 → start = 1</b>'], ['1', '2 − 4 = −2', '−2', '<b class="do">start = 2</b>'], ['2', '3 − 5 = −2', '−2', '<b class="do">start = 3</b>'], ['3', '4 − 1 = 3', '3', ''], ['4', '5 − 2 = 3', '6', 'tổng = 0 ≥ 0 → <b>3</b>']], ['i', 'gain', 'tank', 'Bước'], 'font-size:18px')}
${code(`for (int i = 0; i < n; i++) {
    total += gas[i] - cost[i]; tank += gas[i] - cost[i];
    if (tank < 0) { start = i + 1; tank = 0; }
}
return total >= 0 ? start : -1;`, 'java', 'sm')}</div>
<div>${o('<b>Vì sao được bỏ cả đoạn:</b> xuất phát ở s, hụt xăng khi qua i. Mọi trạm k giữa s và i: tới k từ s thì tank ≥ 0, nên xuất phát thẳng ở k còn <b>ít xăng hơn</b> ⇒ cũng hụt ở i. Vậy thử luôn i + 1.', 'xanh')}
${o('<b>Vì sao tổng ≥ 0 là đủ:</b> đoạn trước <code>start</code> có tổng âm, nên phần từ start tới hết mang dư ≥ −(đoạn trước) ⇒ vòng lại vẫn qua được.', '')}
<ul style="font-size:20px;margin-top:4px">
<li>O(n) một lượt, O(1) bộ nhớ — vét cạn thử mọi trạm là O(n²)</li>
<li>{2,3,4}/{3,4,3}: tổng −1 ⇒ <b>−1</b>; một trạm {5}/{5} ⇒ 0</li>
<li>PASS 5000 ca so với thử mọi điểm xuất phát</li>
</ul></div></div>` },

  /* 12 */
  { t: 'Việc có hạn chót: lợi nhuận cao trước, ô muộn nhất', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">Mỗi việc tốn 1 đơn vị thời gian, có hạn chót d và lợi nhuận p. Chọn việc để <b>tổng lợi nhuận lớn nhất</b>.</p>
${bang([['a', '2', '100', 'ô 2'], ['c', '2', '27', 'ô 1 (ô 2 bận)'], ['d', '1', '25', '<b class="do">bỏ</b> — ô 1 bận'], ['b', '1', '19', '<b class="do">bỏ</b>'], ['e', '3', '15', 'ô 3']], ['Việc (theo p giảm)', 'd', 'p', 'Đặt vào'], 'font-size:18px')}
${oViec()}
<p style="font-size:20px">Tổng <b class="do">142</b> = 27 + 100 + 15</p></div>
<div>${code(`Arrays.sort(a, (x, y) -> y[1] - x[1]);  // p giảm
for (int[] j : a) {
    int t = Math.min(j[0], maxD);
    while (t >= 1 && slot[t] != 0) t--; // ô trống MUỘN nhất
    if (t >= 1) { slot[t] = j[1]; total += j[1]; }
}`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:8px">
<li>Đặt vào ô <b>muộn nhất</b> còn trống: chừa ô sớm cho việc hạn gấp hơn</li>
<li>Đổi chỗ: việc lợi nhuận cao hơn thay việc thấp hơn không bao giờ làm tổng giảm</li>
<li>O(n log n + n · D) (D = hạn lớn nhất); dùng Union-Find (A.2) để tìm ô trống ⇒ gần O(n log n)</li>
</ul>
${nho('PASS 3000 ca so với vét cạn (tập làm được ⇔ sắp theo hạn, việc thứ i có hạn ≥ i). Biến thể: mọi việc bắt buộc, cực tiểu trễ hạn ⇒ sắp theo HẠN (earliest deadline first).')}</div></div>` },

  /* 13 */
  { t: 'Tham lam bạn đã học trong môn', body: `${bang([
    ['Huffman', '8.3', 'Gộp <b>hai tần suất nhỏ nhất</b> (min-heap)', 'Đổi chỗ: hai ký tự hiếm nhất nằm sâu nhất ở một cây tối ưu', 'Không vỡ: luôn tối ưu cho mã tiền tố từng ký tự'],
    ['Prim', '5.6', 'Cạnh rẻ nhất nối cây với ngoài', 'Tính chất lát cắt (cut property)', 'Đồ thị không liên thông ⇒ chỉ ra cây của một thành phần'],
    ['Kruskal', '5.6', 'Cạnh rẻ nhất toàn cục không tạo chu trình', 'Tính chất lát cắt + Union-Find (A.2)', '—'],
    ['Dijkstra', '5.5', 'Chốt đỉnh ngoài <b>gần nguồn nhất</b>', 'Trọng số ≥ 0: đi thêm cạnh không làm đường ngắn lại', '<b class="do">Cạnh âm</b> ⇒ chốt sai (bài 5.5)'],
    ['Tô màu đồ thị', '5.D', 'Màu nhỏ nhất chưa bị hàng xóm dùng', '<b class="do">Không</b> tối ưu — chỉ cận trên Δ + 1', 'Kết quả tuỳ thứ tự đỉnh'],
  ], ['Thuật toán', 'Bài', 'Lựa chọn tham lam', 'Vì sao đúng', 'Khi nào vỡ'], 'font-size:17px')}
<div class="hai">${o('Huffman, Prim, Dijkstra dùng <b>hàng đợi ưu tiên</b> để lấy "cái tốt nhất lúc này" trong O(log n) — như phòng họp (slide 8).', 'xanh')}
${o('Tham lam đúng nào cũng có <b>lý do</b> (đổi chỗ, lát cắt, trọng số ≥ 0). Không nói được lý do ⇒ chưa biết nó đúng.')}</div>` },

  /* 14 */
  { t: 'Chia để trị: chia – trị – gộp và định lý Master', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${cayChia()}
${o('<b>Khuôn:</b> ① <b>Chia</b> thành a bài cỡ n/b · ② <b>Trị</b> đệ quy (bài nhỏ giải thẳng) · ③ <b>Gộp</b> tốn f(n). Ra <b>T(n) = a·T(n/b) + f(n)</b> — bài 3.3.', 'xanh')}</div>
<div>${bang([
    ['T(n/2) + 1', 'tìm nhị phân', '21', 'log₂ n + 1'],
    ['T(n/2) + n', 'quickselect*', '2 097 151', '≈ 2n'],
    ['2T(n/2) + 1', 'duyệt cây', '2 097 151', '≈ 2n'],
    ['2T(n/2) + n', 'merge sort', '22 020 096', 'n log₂ n + n'],
    ['4T(n/2) + n', '4 nửa', '(n = 2¹⁰) 2 096 128', '≈ 2n²'],
  ], ['T(n) =', 'Ví dụ', 'Đếm thật, n = 2²⁰', 'Bậc'], 'font-size:17px')}
${out(`Master: so f(n) với n^(log_b a)
  f nhỏ hơn  -> T = n^(log_b a)      (lá thắng)
  bằng nhau  -> T = n^(log_b a) log n
  f lớn hơn  -> T = f(n)             (gốc thắng)`, 'font-size:15px;margin-top:8px')}
${nho('* khi mỗi lần chốt chia đúng đôi. Số liệu: RecurrenceCount.java cộng việc của mọi lời gọi, T(1) = 1.')}</div></div>` },

  /* 15 */
  { t: 'Merge sort đếm số nghịch thế (inversions)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:20px">Nghịch thế = cặp i &lt; j mà a[i] &gt; a[j]. [5, 2, 3, 8, 1] có 6 — đúng bằng số lần dời của insertion sort (bài 6.A).</p>
${bang([['[5] + [2]', '[2, 5]', '+1'], ['[2, 5] + [3]', '[2, 3, 5]', '+1'], ['[8] + [1]', '[1, 8]', '+1'], ['[2, 3, 5] + [1, 8]', '[1, 2, 3, 5, 8]', '+3']], ['Gộp', 'Kết quả', 'Nghịch thế mới'], 'font-size:18px')}
<p style="font-size:20px;margin-top:6px">Tổng 1 + 1 + 1 + 3 = <b class="do">6</b>. Lần gộp cuối: 1 đứng trước <b>cả ba</b> số 2, 3, 5 còn lại bên trái ⇒ +3 một lần.</p></div>
<div>${code(`long c = count(a, lo, mid) + count(a, mid + 1, hi);
while (i <= mid && j <= hi) {
    if (a[i] <= a[j]) tmp[k++] = a[i++];
    else {                      // a[j] nhỏ hơn cả a[i..mid]
        c += mid - i + 1;
        tmp[k++] = a[j++];
    }
}`, 'java', 'sm')}
<ul style="font-size:20px;margin-top:8px">
<li>T(n) = 2T(n/2) + n ⇒ <b>O(n log n)</b>, bộ nhớ O(n); vét cạn hai vòng là O(n²)</li>
<li><code>&lt;=</code>: hai số <b>bằng nhau không</b> là nghịch thế</li>
</ul>
${o('<b>Bẫy tràn:</b> n = 100 000 sắp ngược có 4 999 950 000 nghịch thế — ép về int thành <b class="do">704 982 704</b>. Biến đếm phải là <code>long</code>.', 'do2')}
${nho('PASS 3000 mảng (rỗng, trùng, âm) so với O(n²).')}</div></div>` },

  /* 16 */
  { t: 'Quickselect: phần tử nhỏ thứ k', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
${code(`int select(int[] a, int k) {          // k = 0..n-1
    int lo = 0, hi = a.length - 1;
    while (true) {
        if (lo == hi) return a[lo];
        int p = partition(a, lo, hi); // Lomuto, bài 6.3
        if (p == k) return a[p];
        if (p < k) lo = p + 1;        // CHỈ giữ bên chứa k
        else       hi = p - 1;
    }
}`, 'java', 'sm')}
${o('Như quicksort, nhưng <b>bỏ hẳn một bên</b>: sau phân hoạch, chốt (pivot) đứng đúng vị trí cuối cùng của nó ⇒ biết ngay k nằm bên nào.', 'xanh')}</div>
<div><p style="font-size:20px">k = 4 (nhỏ thứ 5) của [7, 2, 9, 4, 3, 8, 5], chốt = phần tử cuối:</p>
${mang([2, 4, 3, 5, 9, 8, 7], { w: 54, fill: { 3: 'cam', 4: 'xanh', 5: 'xanh', 6: 'xanh' }, tren: { 3: 'chốt' } })}
${bang([['[0..6]', '5', '3', '3 &lt; 4 → sang phải'], ['[4..6]', '7', '4', '= k → <b class="do">7</b>']], ['Đoạn', 'Chốt', 'Rơi vào', 'Bước'], 'font-size:18px;margin-top:6px')}
<p style="font-size:19px;margin-top:6px">Lần 1 ra đúng [2, 4, 3, 5, 9, 8, 7] như ví dụ phân hoạch của bài 6.3; lần 2 chỉ xét 3 ô.</p>
${nho('Bản chạy thật dùng chốt ngẫu nhiên: PASS 5000 mảng (1 phần tử, trùng, âm) so với sắp xếp. Mảng bị đảo chỗ — cần giữ nguyên thì clone trước.')}</div></div>` },

  /* 17 */
  { t: 'Quickselect: vì sao trung bình O(n), khi nào O(n²)', body: `<div class="hai"><div>
<ul style="font-size:21px">
<li>Chốt chia đôi: n + n/2 + n/4 + … ≈ <b>2n</b> phép so sánh — T(n) = T(n/2) + n</li>
<li>Chốt ngẫu nhiên: trung bình vẫn O(n), hằng số lớn hơn — k ở giữa: lý thuyết ≈ 3,4n</li>
<li>Xấu nhất: chốt luôn là min/max ⇒ n + (n−1) + … = <b class="do">n(n−1)/2</b></li>
</ul>
${bang([
    ['chốt ngẫu nhiên, n = 10⁴', '1,99 n', '3,47 n'],
    ['chốt ngẫu nhiên, n = 10⁶', '2,12 n', '3,28 n'],
  ], ['Đo thật (trung bình 20 lần)', 'k = min', 'k = trung vị'], 'font-size:19px;margin-top:6px')}</div>
<div>${out(`last-element pivot, sorted input,
  n = 20000, k = min:
  199990000 comparisons = n(n-1)/2
random pivot on the same input:
  24259 comparisons`)}
${o('<b>Chốt = phần tử cuối</b> trên mảng <b>đã sắp</b> là thảm hoạ — gấp ~8000 lần. Luôn chọn chốt ngẫu nhiên (hoặc trung vị của ba) — cùng bài học với quicksort ở bài 6.3.', 'do2')}
${o('Mảng <b>toàn giá trị bằng nhau</b>: Lomuto vẫn chia lệch ⇒ O(n²). Sửa bằng phân hoạch <b>3 ngả</b> (&lt; | = | &gt;) — bài tập 6.', '')}
${nho('Có thuật toán xấu nhất O(n) (median of medians) nhưng hằng số lớn; phỏng vấn chỉ cần biết tên.')}</div></div>` },

  /* 18 */
  { t: 'Top-k: sắp xếp, heap hay quickselect?', body: `${bang([
    ['k = 10', '1 534 660', xanhB('100 587'), '155 555'],
    ['k = 1 000', '1 534 660', '203 128', xanhB('140 349')],
    ['k = 50 000', '1 534 660', '<b class="do">2 512 080</b>', xanhB('276 055')],
  ], ['n = 100 000 số ngẫu nhiên, tìm k số lớn nhất', 'Sắp cả mảng', 'Min-heap cỡ k', 'Quickselect'], 'font-size:19px')}
${nho('Đếm số phép so sánh thật (Comparator có bộ đếm); cả ba cho cùng một tập — PASS.')}
<div class="hai" style="margin-top:4px">${bang([
    ['Sắp xếp', 'O(n log n)', 'O(n)', 'Cần cả thứ tự; đơn giản nhất'],
    ['Min-heap cỡ k', 'O(n log k)', '<b>O(k)</b>', 'k nhỏ, dữ liệu <b>chảy liên tục</b> (stream)'],
    ['Quickselect', 'O(n) TB · O(n²) xấu', 'O(n) bản sao', 'Một lần, cả mảng trong RAM'],
  ], ['Cách', 'Thời gian', 'Bộ nhớ', 'Chọn khi'], 'font-size:18px')}
<div>${code(`// k số lớn nhất: giữ k số, gốc = nhỏ nhất
PriorityQueue<Integer> h = new PriorityQueue<>();
for (int x : a) {
    if (h.size() < k) h.add(x);
    else if (x > h.peek()) { h.poll(); h.add(x); }
}`, 'java', 'sm')}
${o('Muốn k <b>lớn nhất</b> thì dùng <b>min</b>-heap (bỏ cái nhỏ nhất) — ngược trực giác, hay bị hỏi.', 'do2')}</div></div>` },

  /* 19 */
  { t: 'Luỹ thừa nhanh (fast exponentiation)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`long powMod(long b, long e, long m) {
    long r = 1 % m; b %= m;
    while (e > 0) {
        if ((e & 1) == 1) r = r * b % m; // bit = 1
        e >>= 1;
        if (e > 0) b = b * b % m;       // b, b², b⁴
    }
    return r;
}`, 'java', 'sm')}
${o('Chia để trị: b^e = (b^(e/2))² (· b nếu e lẻ). T(e) = T(e/2) + 1 ⇒ <b>O(log e)</b> phép nhân.', 'xanh')}</div>
<div><p style="font-size:20px">3¹³, 13 = <b>1101</b>₂ = 8 + 4 + 1:</p>
${bang([['1101', '1', '3 = 3¹', '3'], ['110', '0', '9 = 3²', '3'], ['11', '1', '81 = 3⁴', '243 = 3⁵'], ['1', '1', '6561 = 3⁸', '<b class="do">1594323</b> = 3¹³']], ['e', 'bit', 'b', 'r'], 'font-size:18px')}
<p style="font-size:19px;margin-top:6px"><b>6</b> phép nhân (vòng lặp thường: 12). 2^(10¹⁸) mod (10⁹ + 7): <b>83</b> phép nhân. PASS 3005 ca so với BigInteger.modPow.</p>
${o('<b>Bẫy</b>: <code>r * b</code> với r, b &lt; 10⁹ + 7 cần <b>long</b> (≈ 10¹⁸). Kiểu LeetCode 50 với n = Integer.MIN_VALUE: <code>n = -n</code> vẫn âm ⇒ vòng lặp không chạy, trả <b class="do">1.0</b> thay vì 5,44·10⁻⁹⁴. Ép <code>long N = n</code> trước.', 'do2')}</div></div>` },

  /* 20 */
  { t: 'Cặp điểm gần nhất (closest pair)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${daiDiem()}
<ol style="font-size:19px;margin-top:4px">
<li>Sắp theo x, <b>chia</b> đôi bằng đường dọc giữa</li>
<li><b>Trị</b>: δ = min(δ₁, δ₂) của hai nửa</li>
<li><b>Gộp</b>: chỉ điểm trong dải |x − x_giữa| &lt; δ mới có thể tạo cặp gần hơn</li>
</ol>
${nho('Số lần tính khoảng cách, đo thật, cùng đáp án. PASS 2000 bộ (trùng điểm, cùng x, âm). So bình phương kiểu long — không căn, không làm tròn.')}</div>
<div>${code(`// strip đã sắp theo y (gộp như merge sort)
for (int a = 0; a < m; a++)
    for (int b = a + 1; b < m; b++) {
        long dy = strip[b][1] - strip[a][1];
        if (dy * dy >= best) break;  // quá xa theo y
        best = Math.min(best, d2(strip[a], strip[b]));
    }`, 'java', 'sm')}
${o('Hình chữ nhật δ × 2δ chứa <b>tối đa 8 điểm</b> cách nhau ≥ δ ⇒ mỗi điểm so với ≤ 7 điểm kế. Gộp O(n) ⇒ <b>O(n log n)</b>.', 'xanh')}
${bang([['1 000', '1 164', '499 500'], ['20 000', '26 160', '<b class="do">199 990 000</b>']], ['n', 'Chia để trị', 'Vét cạn'], 'font-size:18px;margin-top:6px')}</div></div>` },

  /* 21 */
  { t: 'Tìm nhị phân: chia để trị chỉ đi MỘT nhánh', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${code(`int find(int[] a, int key, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == key) return mid;
    return a[mid] < key ? find(a, key, mid + 1, hi)
                        : find(a, key, lo, mid - 1);
}`, 'java', 'sm')}
<p style="font-size:19px;margin-top:8px">a = {−7, −3, 0, 4, 9, 15, 21, 30, 42}, tìm 5:</p>
${out(`  find[0..8] mid=4 a[mid]=9
    find[0..3] mid=1 a[mid]=-3
      find[2..3] mid=2 a[mid]=0
        find[3..3] mid=3 a[mid]=4
          find[4..3] empty -> -1
key 5  -> -1`, 'font-size:15px')}</div>
<div>${bang([
    ['Tìm nhị phân (⭐ CS.1)', '1', '2', 'O(1)', 'O(log n)'],
    ['Quickselect', '1', '~2', 'O(n)', 'O(n) TB'],
    ['Luỹ thừa nhanh', '1', '2', 'O(1)', 'O(log e)'],
    ['Merge sort, nghịch thế', '2', '2', 'O(n)', 'O(n log n)'],
    ['Cặp điểm gần nhất', '2', '2', 'O(n)', 'O(n log n)'],
  ], ['Thuật toán', 'a', 'b', 'f(n)', 'Tổng'], 'font-size:17px')}
${o('<b>a = 1</b> ("giảm để trị" — decrease &amp; conquer): một bài con ⇒ viết được bằng vòng lặp, <b>bộ nhớ O(1)</b>. Đệ quy: n = 10⁶ sâu tới 21 lời gọi (20 lần so + 1 đoạn rỗng).', 'xanh')}</div></div>
${nho('Code có 2 lời gọi đệ quy nhưng mỗi lần <b>chỉ chạy 1</b> ⇒ a = 1, không phải 2 (bẫy của bài 3.3).')}` },

  /* 22 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['Khoảng/lịch: "nhiều nhất không chồng", "bỏ ít nhất", "bắn ít mũi tên nhất"', 'Tham lam, sắp theo <b>KẾT THÚC</b>', '5–7'],
    ['"Cần ít nhất bao nhiêu phòng/máy/xe cùng lúc"', 'Sắp theo bắt đầu + <b>min-heap</b> giờ kết thúc', '8'],
    ['"Gộp / chèn khoảng", "tổng độ dài phủ"', 'Sắp theo bắt đầu, so với khối cuối, <b>max</b>', '9'],
    ['"Tới được không / ít bước nhất", vòng tròn trạm xăng', 'Với xa nhất · một lượt, tổng ≥ 0', '10–11'],
    ['Có hạn chót + lợi nhuận, cắt được món (phân số)', 'Sắp theo lợi nhuận / tỉ số giá trị', '4, 12'],
    ['"Chọn tối ưu" mà mọi khoá tham lam đều có phản ví dụ', 'Không phải tham lam ⇒ <b>DP</b> (⭐ CS.3–CS.4)', '3–4'],
    ['"Đếm cặp i &lt; j có a[i] … a[j]" với n ~ 10⁵', 'Merge sort + đếm lúc gộp', '15'],
    ['"Phần tử lớn/nhỏ thứ k", "k lớn nhất", "trung vị"', 'Quickselect / min-heap cỡ k', '16–18'],
    ['b^e mod m với e tới 10¹⁸, ma trận luỹ thừa', 'Luỹ thừa nhanh', '19'],
    ['Hai nửa giải riêng rồi ghép được trong O(n)', 'Chia để trị, T = 2T(n/2) + n', '14, 20'],
  ], ['Thấy trong đề', 'Nghĩ tới', 'Slide'], 'font-size:18px')}` },

  /* 23 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['Chọn hoạt động · bỏ ít khoảng · mũi tên', 'O(n log n)', 'O(1)*', 'sắp + một lượt'],
    ['Phòng họp tối thiểu', 'O(n log n)', 'O(n)', 'mỗi họp một add/poll heap'],
    ['Gộp khoảng', 'O(n log n)', 'O(n)', 'sắp + một lượt'],
    ['Jump game I/II · gas station', 'O(n)', 'O(1)', 'một lượt, giữ một biến'],
    ['Knapsack phân số', 'O(n log n)', 'O(n)', 'sắp theo tỉ số'],
    ['Việc có hạn chót', 'O(n log n + n·D)', 'O(D)', 'tìm ô trống lùi dần'],
    ['Đếm nghịch thế', 'O(n log n)', 'O(n)', '2T(n/2) + n'],
    ['Quickselect', 'O(n) TB · O(n²) xấu', 'O(1)', 'T(n/2) + n'],
    ['Top-k bằng heap', 'O(n log k)', 'O(k)', 'heap giữ k phần tử'],
    ['Luỹ thừa nhanh', 'O(log e)', 'O(1)', 'mỗi vòng bỏ 1 bit'],
    ['Cặp điểm gần nhất', 'O(n log n)', 'O(n)', 'dải: ≤ 7 điểm kế'],
  ], ['Thuật toán', 'Thời gian', 'Bộ nhớ', 'Vì sao'], 'font-size:16.5px;line-height:1.25')}
${nho('* ngoài bản sao/sắp tại chỗ. Tham lam thường "đắt" nhất ở bước sắp — một lượt sau đó chỉ O(n).')}` },

  /* 24 */
  { t: 'Tóm tắt', body: `<ul style="font-size:23px">
<li>Tham lam = chọn cái tốt nhất lúc này, <b>không quay lại</b>; nhanh nhưng <b class="do">có thể sai</b> — đổi tiền {1, 3, 4}/6, knapsack 0/1</li>
<li>Đúng khi có <b>lựa chọn tham lam</b> + <b>cấu trúc con tối ưu</b>; chứng minh bằng <b>lập luận đổi chỗ</b></li>
<li>Khoảng: không chồng ⇒ sắp theo <b>kết thúc</b>; gộp/phòng họp ⇒ sắp theo <b>bắt đầu</b> (+ min-heap)</li>
<li>Khoá "nghe hợp lý" chưa đủ: đối chiếu vét cạn trên hàng nghìn bộ nhỏ (ít chồng nhất: sai 17/20000)</li>
<li>Chia để trị: chia – trị – gộp, T(n) = a·T(n/b) + f(n), giải bằng định lý Master (bài 3.3)</li>
<li>Gộp là chỗ làm việc: đếm nghịch thế lúc trộn, dải δ của cặp điểm gần nhất</li>
<li>Quickselect: một nhánh, TB O(n); chốt ngẫu nhiên; trùng nhiều ⇒ phân hoạch 3 ngả</li>
<li>Top-k: heap cỡ k (stream) hoặc quickselect; luỹ thừa nhanh O(log e) — nhớ long và MIN_VALUE</li>
</ul>` },
]);
