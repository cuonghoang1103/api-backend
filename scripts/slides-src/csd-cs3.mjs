/**
 * csd-cs3.mjs — CSD201 ⭐ Chuyên sâu 3: QUY HOẠCH ĐỘNG (PHẦN 1) (deck tự dựng, không có trong giáo trình trường).
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/csd-cs3.mjs --out <dir>
 *
 * Mọi bảng dp, mọi con số (số lời gọi, giá trị tràn số, PASS/FAIL) lấy từ chương trình Java CHẠY THẬT:
 * flm-nguon/_repo/CSD201/gen/java/cs3/*.java (javac --release 8, JDK 21).
 */
import { lamDeck, code } from './_cs-chung.mjs';

export const deck = { key: 'cs3', code: 'CS3', title: 'Quy hoạch động (phần 1)', sub: 'CSD201 · ⭐ Chuyên sâu' };

/* ───────────── màu ───────────── */
const MAU = { vien: '#8c8c8c', do: '#e02020', xanh: '#2f7d4f', cam: '#e08a1e', nau: '#b85a2b' };
const NEN = { do: '#fde2e2', xanh: '#dff3e6', cam: '#fff1de', xam: '#f0f0f0', trang: '#ffffff' };

/**
 * Một hàng ô dp có chỉ số. opt: { w, fill: {i: 'do'|'xanh'|'cam'|'xam'}, nhan (chữ bên trái), chiSo (mảng nhãn chỉ số), top: {i: 'chữ trên ô'} }
 */
function hang(vals, { w = 56, h = 44, fill = {}, nhan = '', nhanW = 70, chiSo = null, top = {}, fs = 20 } = {}) {
  const x0 = nhan ? nhanW : 4, y0 = Object.keys(top).length ? 24 : 4;
  let s = '';
  if (nhan) s += `<text x="0" y="${y0 + h / 2 + 7}" font-size="19" font-weight="700" fill="${MAU.nau}">${nhan}</text>`;
  vals.forEach((v, i) => {
    const f = fill[i];
    s += `<rect x="${x0 + i * w}" y="${y0}" width="${w}" height="${h}" fill="${f ? NEN[f] : NEN.trang}" stroke="${f === 'do' ? MAU.do : MAU.vien}" stroke-width="${f === 'do' ? 3 : 1.5}"/>`;
    const col = f === 'do' ? MAU.do : f === 'xanh' ? MAU.xanh : '#262626';
    s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h / 2 + 7}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}">${v}</text>`;
    const cs = chiSo ? chiSo[i] : i;
    if (cs !== '' && cs !== undefined) s += `<text x="${x0 + i * w + w / 2}" y="${y0 + h + 18}" text-anchor="middle" font-size="15" fill="#8c8c8c">${cs}</text>`;
    if (top[i]) s += `<text x="${x0 + i * w + w / 2}" y="${y0 - 7}" text-anchor="middle" font-size="15" font-weight="800" fill="${MAU.nau}">${top[i]}</text>`;
  });
  const W = x0 + vals.length * w + 4, H = y0 + h + 24;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" font-family="Arial, sans-serif">${s}</svg>`;
}

/* ───────────── khối nhỏ ───────────── */
const o = (html, cls = '') => `<div class="o ${cls}">${html}</div>`;
const bang = (rows, head, st = '') => `<table${st ? ` style="${st}"` : ''}><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
const out = (txt, st = '') => `<pre style="margin:0;background:#f7f7f7;border:1.5px solid #d9d9d9;border-radius:8px;padding:9px 13px;font:16px/1.4 Menlo,Consolas,monospace;color:#262626;white-space:pre;overflow:hidden;${st}">${txt}</pre>`;
const nho = (t, st = '') => `<p class="nho"${st ? ` style="${st}"` : ''}>${t}</p>`;
const ul = (items, fs = 21) => `<ul style="font-size:${fs}px">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;

/* ───────────── sơ đồ riêng ───────────── */
// slide 2: cây lời gọi fib(5), tô các nút lặp lại
function cayFib() {
  // nút: [nhãn, x, y, cha]
  const N = [
    ['f5', 330, 24, -1],
    ['f4', 170, 84, 0], ['f3', 490, 84, 0],
    ['f3', 90, 144, 1], ['f2', 250, 144, 1], ['f2', 430, 144, 2], ['f1', 550, 144, 2],
    ['f2', 45, 204, 3], ['f1', 135, 204, 3], ['f1', 215, 204, 4], ['f0', 285, 204, 4], ['f1', 395, 204, 5], ['f0', 465, 204, 5],
    ['f1', 15, 264, 7], ['f0', 75, 264, 7],
  ];
  const mauNut = { f3: [NEN.do, MAU.do], f2: [NEN.cam, MAU.cam] };
  let s = '';
  N.forEach(([, x, y, p]) => { if (p >= 0) s += `<line x1="${N[p][1]}" y1="${N[p][2] + 14}" x2="${x}" y2="${y - 14}" stroke="#bfbfbf" stroke-width="1.5"/>`; });
  N.forEach(([t, x, y]) => {
    const [bg, bd] = mauNut[t] || [NEN.trang, MAU.vien];
    s += `<rect x="${x - 22}" y="${y - 14}" width="44" height="28" rx="6" fill="${bg}" stroke="${bd}" stroke-width="1.8"/>`;
    s += `<text x="${x}" y="${y + 6}" text-anchor="middle" font-size="16" font-weight="700" fill="#262626">${t}</text>`;
  });
  return `<svg viewBox="-10 0 600 290" width="480" font-family="Arial, sans-serif">${s}</svg>`;
}

// slide 7: 4 bước
function bonBuoc() {
  const B = [
    ['1', 'Trạng thái', 'dp[i] nghĩa là gì?'],
    ['2', 'Truy hồi', 'dp[i] tính từ ô nào?'],
    ['3', 'Cơ sở', 'ô đầu tiên = ?'],
    ['4', 'Thứ tự', 'tính ô nào trước?'],
    ['+', 'Lấy lời giải', 'đi ngược bảng'],
  ];
  let s = '';
  B.forEach(([n, t, d], i) => {
    const x = 6 + i * 222, last = i === 4;
    s += `<rect x="${x}" y="10" width="196" height="104" rx="12" fill="${last ? NEN.xanh : NEN.cam}" stroke="${last ? MAU.xanh : MAU.cam}" stroke-width="2"/>`;
    s += `<circle cx="${x + 26}" cy="36" r="17" fill="${last ? MAU.xanh : MAU.nau}"/><text x="${x + 26}" y="42" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">${n}</text>`;
    s += `<text x="${x + 52}" y="43" font-size="21" font-weight="800" fill="#262626">${t}</text>`;
    s += `<text x="${x + 98}" y="92" text-anchor="middle" font-size="18" fill="#404040">${d}</text>`;
    if (i < 4) s += `<text x="${x + 209}" y="70" text-anchor="middle" font-size="24" font-weight="800" fill="${MAU.nau}">›</text>`;
  });
  return `<svg viewBox="0 0 1110 124" width="100%" font-family="Arial, sans-serif">${s}</svg>`;
}

export const slides = lamDeck('QUY HOẠCH ĐỘNG — PHẦN 1', [
  /* 1 */
  { cover: true, t: 'Quy hoạch động (phần 1)', sub: 'Đệ quy → nhớ → bảng → tối ưu bộ nhớ · công thức 4 bước<br>Leo cầu thang · cướp nhà · đổi tiền · giải mã · tách từ · LIS<br>CSD201 · Java 8 — mọi bảng dp đều in ra từ chương trình chạy thật' },

  /* 2 */
  { t: 'Quy hoạch động là gì?', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${o('<b>Ví dụ đời thường:</b> viết lên bảng 1+1+1+1+1+1+1+1 — "bằng mấy?" → đếm: <b>8</b>. Viết thêm "+1" — "giờ bằng mấy?" → <b>9</b>, ngay lập tức. Bạn <b class="do">không đếm lại</b>: bạn <b>nhớ</b> kết quả cũ.')}
${ul([
    'Quy hoạch động (dynamic programming, DP) = <b>giải mỗi bài toán con một lần</b>, ghi lại, rồi dùng lại',
    'Cần hai dấu hiệu:<br>① <b>bài toán con gối nhau</b> (overlapping subproblems)<br>② <b>cấu trúc con tối ưu</b> (optimal substructure): đáp án lớn ghép từ đáp án con',
  ], 21)}</div>
<div>${cayFib()}
${nho('Cây lời gọi fib(5): <b style="color:#e02020">f3</b> tính 2 lần, <b style="color:#e08a1e">f2</b> tính 3 lần. Bài 3.A (slide 17–18) đã gặp "đệ quy thừa" này — deck này đi tiếp: biến nó thành <b>phương pháp</b> giải cả một họ bài.')}</div></div>` },

  /* 3 */
  { t: 'Bước 0: đệ quy thuần — đếm lời gọi thật', body: `<div class="hai" style="grid-template-columns:1fr 1.1fr"><div>${code(`static long calls;
static long naive(int n) {
    calls++;
    if (n < 2) return n;
    return naive(n - 1) + naive(n - 2);
}`, 'java')}
${o('Số lời gọi = <b>2·fib(n+1) − 1</b> (kiểm n = 0…38: PASS). Tăng ≈ <b>1,618 lần</b> mỗi khi n tăng 1 ⇒ <b class="do">hàm mũ O(φⁿ)</b>.', 'do2')}</div>
<div>${bang([
    ['10', '55', '177', '19'],
    ['20', '6.765', '21.891', '39'],
    ['30', '832.040', '<b class="do">2.692.537</b>', '<b>59</b>'],
    ['40', '102.334.155', '<b class="do">331.160.281</b>', '<b>79</b>'],
  ], ['n', 'fib(n)', 'Đệ quy thuần', 'Có nhớ (memo)'], 'font-size:20px')}
${ul([
    'fib(40): <b>331 triệu</b> lời gọi cho <b>41</b> bài toán con khác nhau',
    'Có nhớ: đúng <b>2n − 1</b> lời gọi ⇒ O(n)',
  ], 20)}
${nho('Output thật của FibCalls.java.')}</div></div>` },

  /* 4 */
  { t: 'Cách 1: nhớ — từ trên xuống (memoization, top-down)', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`static long[] memo;          // -1 = chưa tính
static long top(int n) {
    if (n < 2) return n;                 // cơ sở
    if (memo[n] != -1) return memo[n];   // đã biết
    long v = top(n - 1) + top(n - 2);
    memo[n] = v;                         // ghi lại
    return v;
}
// trước khi gọi: Arrays.fill(memo, -1)`, 'java')}</div>
<div>${ul([
    'Viết <b>y như đệ quy</b>, thêm 2 dòng: tra memo, ghi memo',
    'Hỏi từ n <b>xuống</b>; ô được điền khi lời gọi <b>trả về</b>:',
  ], 21)}
${out('memo filled in this order:\n f2=1 f3=2 f4=3 f5=5 f6=8')}
${o('Thời gian <b>O(n)</b> (mỗi ô tính 1 lần) · bộ nhớ <b>O(n)</b> mảng + <b>O(n)</b> ngăn xếp đệ quy. Đo thật: n = 10.000 chạy được, n = 100.000 ⇒ <b class="do">StackOverflowError</b>.', 'do2')}
${nho('Dùng −1 đánh dấu "chưa tính", vì ở nhiều bài 0 là một đáp án thật.')}</div></div>` },

  /* 5 */
  { t: 'Cách 2: bảng — từ dưới lên (tabulation, bottom-up)', body: `${hang([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144], { w: 72, nhan: 'dp[i]', fill: { 0: 'xanh', 1: 'xanh', 12: 'do' } })}
<div class="hai" style="grid-template-columns:1fr 1.05fr;margin-top:6px"><div>${code(`long[] dp = new long[n + 2];
dp[0] = 0; dp[1] = 1;            // cơ sở
for (int i = 2; i <= n; i++)     // nhỏ → lớn
    dp[i] = dp[i - 1] + dp[i - 2];
return dp[n];`, 'java')}</div>
<div>${ul([
    'Không đệ quy: điền ô <b>từ trái sang phải</b>',
    'Khi tính dp[i], hai ô nó cần <b>đã có sẵn</b> — đó là "thứ tự tính"',
    '<code>n + 2</code> ô: dp[1] vẫn tồn tại khi n = 0',
    'O(n) thời gian, O(n) bộ nhớ, <b>không</b> tốn ngăn xếp',
  ], 21)}</div></div>
${nho('Hàng trên: output thật "dp: 0 1 1 2 3 5 8 13 21 34 55 89 144" (FibFourWays.java).')}` },

  /* 6 */
  { t: 'Cách 3: tối ưu bộ nhớ — và bẫy tràn số', body: `<div class="hai" style="grid-template-columns:1fr 1.1fr"><div>${code(`long prev = 0, cur = 1;     // fib(0), fib(1)
if (n == 0) return 0;
for (int i = 2; i <= n; i++) {
    long next = prev + cur;
    prev = cur;
    cur = next;
}
return cur;`, 'java')}
${nho('dp[i] chỉ đọc <b>2 ô cuối</b> ⇒ giữ 2 biến: bộ nhớ O(1).')}</div>
<div>${bang([
    ['Đệ quy thuần', 'O(φⁿ)', 'O(n) ngăn xếp'],
    ['Nhớ (top-down)', 'O(n)', 'O(n) + ngăn xếp'],
    ['Bảng (bottom-up)', 'O(n)', 'O(n)'],
    ['Hai biến', 'O(n)', '<b>O(1)</b>'],
  ], ['Cách', 'Thời gian', 'Bộ nhớ'], 'font-size:19px')}
${out(`fib(46) int  = 1836311903
fib(47) int  = -1323752223   (overflow!)
fib(92) long = 7540113804746346429
fib(93) long = -6246583658587674878`, 'font-size:15px;margin-top:8px')}
${nho('Java không báo lỗi khi tràn: int chỉ tới fib(46), long tới fib(92). Đếm "số cách" thường lớn rất nhanh ⇒ <b>long</b>, hoặc đề cho "modulo 10⁹+7".')}</div></div>` },

  /* 7 */
  { t: 'Công thức 4 bước cho mọi bài DP', body: `${bonBuoc()}
${bang([
    ['1. Trạng thái', 'dp[i] = số cách đứng ở bậc i', 'Một câu tiếng Việt rõ nghĩa — sai ở đây là sai hết'],
    ['2. Truy hồi', 'dp[i] = dp[i−1] + dp[i−2]', 'Hỏi: "bước <b>cuối cùng</b> là gì?" rồi cộng/min/max các khả năng'],
    ['3. Cơ sở', 'dp[0] = 1, dp[1] = 1', 'Ô không suy ra được từ ô khác; kiểm bằng n nhỏ nhất'],
    ['4. Thứ tự', 'i = 2 → n', 'Ô cần dùng phải được tính <b>trước</b>'],
    ['+ Lấy lời giải', 'đi ngược từ dp[n]', 'Lưu "chọn gì" (last, prev) nếu đề hỏi cách làm, không chỉ con số'],
  ], ['Bước', 'Ví dụ: leo cầu thang', 'Câu hỏi tự đặt'], 'font-size:19px;margin-top:4px')}` },

  /* 8 */
  { t: 'Leo cầu thang: mỗi lần 1 hoặc 2 bậc', body: `${hang([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], { w: 70, nhan: 'dp[i]', fill: { 0: 'xanh', 1: 'xanh', 10: 'do' } })}
<div class="hai" style="grid-template-columns:1fr 1fr;margin-top:6px"><div>${ul([
    '<b>Trạng thái</b>: dp[i] = số cách đứng ở bậc i',
    '<b>Bước cuối</b> là 1 bậc (từ i−1) hoặc 2 bậc (từ i−2) ⇒ <b>dp[i] = dp[i−1] + dp[i−2]</b>',
    '<b>Cơ sở</b>: dp[0] = 1 (đứng yên = <b>1 cách</b>, không phải 0), dp[1] = 1',
  ], 21)}</div>
<div>${o('Chính là Fibonacci lệch một: dp[n] = fib(n+1). Đo thật: n = 45 → <b>1.836.311.903</b> (sát trần int), n = 90 → 4.660.046.610.375.530.309 ⇒ <b>long</b>.')}
${o('dp[0] = 0 là bẫy: cả bảng thành 0, 1, 1, 2… ⇒ lệch một. Kiểm nhanh: n = 2 phải ra 2 (1+1, 2).', 'do2')}
${nho('PASS n = 0…20 so với vét cạn thử mọi bước đầu.')}</div></div>` },

  /* 9 */
  { t: 'Leo cầu thang: mỗi lần 1…k bậc', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
<p style="font-size:21px"><b>dp[i] = dp[i−1] + dp[i−2] + … + dp[i−k]</b> (bỏ ô âm)</p>
${code(`long[] dp = new long[n + 1];
dp[0] = 1;
long window = 1;          // = dp[i-1] + ... + dp[i-k]
for (int i = 1; i <= n; i++) {
    dp[i] = window;
    window += dp[i];                     // ô mới vào
    if (i - k >= 0) window -= dp[i - k]; // ô cũ ra
}`, 'java')}</div>
<div><p style="font-size:20px">k = 3 (thang "tribonacci"):</p>
${hang([1, 1, 2, 4, 7, 13, 24, 44, 81, 149, 274], { w: 44, fs: 17, fill: { 0: 'xanh', 10: 'do' } })}
${ul([
    'Cộng k ô mỗi lần: <b>O(n·k)</b>',
    'Giữ <b>tổng cửa sổ trượt</b> (sliding window — deck CS2): <b>O(n)</b>, không phụ thuộc k',
    'k = 1 → luôn 1 cách; k = 2 → bảng slide trước',
  ], 20)}
${nho('PASS n = 0…20, k = 1…6 so với vét cạn.')}</div></div>` },

  /* 10 */
  { t: 'Leo cầu thang tốn phí ít nhất (ý bài LC 746)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Đứng ở bậc j thì trả <b>cost[j]</b> rồi lên 1 hoặc 2 bậc. Bắt đầu ở bậc 0 hoặc 1. Đỉnh = <b>bậc n</b> (ngoài mảng).</p>
${hang([2, 7, 3, 9, 4, 1, 8], { w: 50, nhan: 'cost', nhanW: 64 })}
${hang([0, 0, 2, 5, 5, 9, 9, 10], { w: 50, nhan: 'dp', nhanW: 64, fill: { 0: 'xanh', 1: 'xanh', 7: 'do' } })}
${o('<b>Trạng thái</b>: dp[i] = phí ít nhất để <b>đứng</b> ở bậc i (chưa trả cost[i]).<br><b>dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2])</b>', 'xanh')}</div>
<div>${out(`dp[2] = min(0+7, 0+2) = 2
dp[3] = min(2+3, 0+7) = 5
dp[4] = min(5+9, 2+3) = 5
dp[5] = min(5+4, 5+9) = 9
dp[6] = min(9+1, 5+4) = 9
dp[7] = min(9+8, 9+1) = 10
answer = 10`, 'font-size:16px')}
${ul([
    'Mảng dp có <b>n + 1</b> ô — ô n là đỉnh',
    'Đi: 0 → 2 → 4 → 5 → đỉnh (bậc 7), trả 2+3+4+1 = 10',
    'O(n) thời gian, O(1) nếu giữ 2 biến',
  ], 20)}
${nho('PASS 3000 ca so với vét cạn (n = 0, 1, phí 0).')}</div></div>` },

  /* 11 */
  { t: 'Cướp nhà (ý bài LC 198)', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>
<p style="font-size:21px">Nhà thẳng hàng, <b>không được lấy hai nhà kề nhau</b>. Tổng lớn nhất?</p>
${hang([6, 1, 2, 7, 3, 4], { w: 56, nhan: 'a', nhanW: 60, fill: { 0: 'xanh', 3: 'xanh', 5: 'xanh' } })}
${hang([0, 6, 6, 8, 13, 13, 17], { w: 56, nhan: 'dp', nhanW: 60, fill: { 0: 'xam', 6: 'do' } })}
${o('<b>dp[i]</b> = tốt nhất với <b>i nhà đầu</b>. Nhà i−1: <b>bỏ</b> → dp[i−1]; <b>lấy</b> → dp[i−2] + a[i−1].<br><b>dp[i] = max(dp[i−1], dp[i−2] + a[i−1])</b>', 'xanh')}</div>
<div>${out(`dp = [0, 6, 6, 8, 13, 13, 17]
houses taken (index) = [0, 3, 5]
best = 17`, 'font-size:16px')}
${ul([
    '<b>Lấy lại lời giải</b>: đi từ i = n; dp[i] ≠ dp[i−1] ⇒ đã lấy nhà i−1, nhảy i −= 2; ngược lại i −= 1',
    '6 + 7 + 4 = 17',
    'Hai biến prev2, prev1 ⇒ bộ nhớ O(1)',
  ], 20)}
${o('Tham lam sai: {2, 3, 2} "lấy nhà lớn nhất" được 3, DP được <b>4</b>. "Chẵn/lẻ" cũng sai: ở đây 11 và 12, DP <b>17</b>.', 'do2')}
${nho('PASS 3000 dãy so với mọi tập con (rỗng, 1 nhà, số 0).')}</div></div>` },

  /* 12 */
  { t: 'Cướp nhà trên vòng tròn (ý bài LC 213)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Nhà <b>đầu</b> và nhà <b>cuối</b> giờ kề nhau ⇒ không lấy cả hai.</p>
${ul([
    'Tách thành <b>2 bài thẳng hàng</b>:<br>① bỏ nhà cuối: a[0..n−2]<br>② bỏ nhà đầu: a[1..n−1]',
    'Đáp án = <b>max</b> của hai lần chạy — O(n), O(1)',
    'Đáp án tối ưu luôn thiếu ít nhất một trong hai nhà đầu/cuối ⇒ nằm trọn trong ① hoặc ②',
  ], 21)}</div>
<div>${out(`a = [6, 1, 2, 7, 3, 4] in a circle
  without last  a[0..4] -> 13
  without first a[1..5] -> 12
  answer = 13   (line version would say 17)
  {9} -> 9   {} -> 0`, 'font-size:16px')}
${o('<b>Bẫy n = 1:</b> cả hai đoạn đều <b>rỗng</b> ⇒ trả 0 thay vì a[0]. Phải xét riêng n = 1.', 'do2')}
${nho('17 cũ lấy nhà 0 và nhà 5 — trên vòng tròn chúng kề nhau. PASS 3000 vòng so với mọi tập con.')}</div></div>` },

  /* 13 */
  { t: 'Khi nào tham lam SAI mà phải DP', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">Đồng xu <b>{1, 3, 4}</b>, cần <b>6</b>. Tham lam (greedy): luôn lấy đồng lớn nhất còn vừa.</p>
${bang([['Tham lam', '4 + 1 + 1', '<b class="do">3 đồng</b>'], ['DP', '3 + 3', '<b style="color:#2f7d4f">2 đồng</b>']], ['Cách', 'Chọn', 'Số đồng'], 'font-size:20px')}
${ul([
    'Lấy 4 trước "trông" tốt, nhưng khoá mất đường 3 + 3',
    'Tham lam <b>không quay lại</b>; DP <b>xét mọi đồng cuối</b> có thể',
    '{3, 4}, cần 6: tham lam lấy 4, còn 2 ⇒ <b class="do">kẹt</b>, dù 3 + 3 được',
  ], 20)}</div>
<div>${bang([
    ['{1, 3, 4}', '1…100', '<b class="do">24</b> số (6, 10, 14, …)'],
    ['{1, 7, 10}', '1…100', '<b class="do">27</b> số (14, 15, 16, …)'],
    ['{1, 5, 10, 25} (xu Mỹ)', '1…1000', '<b>0</b>'],
    ['{1, 2, 5, 10, …, 500} (kiểu tiền VN)', '1…1000', '<b>0</b>'],
  ], ['Mệnh giá', 'Số tiền thử', 'Tham lam sai ở'], 'font-size:19px')}
${o('Hệ tiền thật được <b>thiết kế</b> để tham lam đúng (hệ "chuẩn" — canonical). Đề phỏng vấn cho mệnh giá <b>tuỳ ý</b> ⇒ phải DP.', 'xanh')}
${nho('Output thật GreedyVsDp.java: so tham lam với DP trên từng số tiền.')}</div></div>` },

  /* 14 */
  { t: 'Đổi tiền: số đồng ít nhất (ý bài LC 322)', body: `${hang(['0', '1', '2', '1', '1', '2', '2', '2', '2', '3', '3'], { w: 62, nhan: 'dp[x]', nhanW: 80, fill: { 0: 'xanh', 10: 'do' } })}
${hang(['–', '1', '1', '3', '4', '1', '3', '3', '4', '1', '3'], { w: 62, nhan: 'last', nhanW: 80, chiSo: Array(11).fill('') })}
<div class="hai" style="grid-template-columns:1.1fr 1fr;margin-top:2px"><div>${code(`final int INF = amount + 1;     // không tràn
Arrays.fill(dp, INF);
dp[0] = 0;
for (int x = 1; x <= amount; x++)
    for (int c : coins)
        if (c <= x && dp[x - c] + 1 < dp[x]) {
            dp[x] = dp[x - c] + 1;
            last[x] = c;                // để lấy lại
        }
return dp[amount] >= INF ? -1 : dp[amount];`, 'java', 'sm')}</div>
<div>${ul([
    '<b>Đồng cuối</b> là c ⇒ <b>dp[x] = min(dp[x − c] + 1)</b>',
    'Lấy lại: 10 → last 3 → 7 → last 3 → 4 → last 4 ⇒ <b>[3, 3, 4]</b> (tham lam: 4+4+1+1)',
    'Không đổi được ({5, 7}, 3) → <b>−1</b>; số tiền 0 → 0',
    'O(n·A) thời gian, O(A) bộ nhớ (n loại xu, A = số tiền)',
  ], 20)}
${nho('Coins {1, 3, 4}, amount 10. PASS 3000 ca so với vét cạn.')}</div></div>` },

  /* 15 */
  { t: 'Đổi tiền: đếm số cách (ý bài LC 518)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>${code(`long[] dp = new long[amount + 1];
dp[0] = 1;              // 1 cách tạo 0: không lấy gì
for (int c : coins)                 // XU ở ngoài
    for (int x = c; x <= amount; x++)
        dp[x] += dp[x - c];`, 'java')}
${ul([
    'Đếm ⇒ <b>cộng</b>, không min; dp[0] = <b>1</b>, không phải 0',
    'Mỗi hàng: "được dùng thêm loại xu c"',
  ], 21)}</div>
<div><p style="font-size:20px">Xu {1, 2, 5}, số tiền 5 — bảng sau mỗi loại xu:</p>
${hang([1, 1, 1, 1, 1, 1], { w: 52, nhan: 'xu 1', nhanW: 64, chiSo: Array(6).fill('') })}
${hang([1, 1, 2, 2, 3, 3], { w: 52, nhan: 'xu 2', nhanW: 64, chiSo: Array(6).fill(''), fill: { 2: 'cam', 3: 'cam', 4: 'cam', 5: 'cam' } })}
${hang([1, 1, 2, 2, 3, 4], { w: 52, nhan: 'xu 5', nhanW: 64, fill: { 5: 'do' } })}
${nho('4 cách: 1+1+1+1+1 · 1+1+1+2 · 1+2+2 · 5. PASS 2000 ca so với liệt kê tổ hợp.')}</div></div>` },

  /* 16 */
  { t: 'Vì sao vòng lặp ngoài khác nhau?', body: `${bang([
    ['<b>Xu</b> ở ngoài, số tiền ở trong', 'xu loại 1 dùng xong mới tới loại 2 ⇒ mỗi cách chỉ xuất hiện theo <b>một thứ tự</b>', '<b>Tổ hợp</b> (combination): 1+2 = 2+1', '{1,2,5}, 5 → <b>4</b> · {1,2}, 3 → 2'],
    ['<b>Số tiền</b> ở ngoài, xu ở trong', 'với mỗi x, đồng cuối là <b>bất kỳ</b> xu ⇒ 1+2 và 2+1 là hai cách', '<b>Dãy có thứ tự</b> (permutation)', '{1,2,5}, 5 → <b class="do">9</b> · {1,2}, 3 → 3'],
  ], ['Cách viết', 'Điều gì xảy ra', 'Đếm ra', 'Đo thật'], 'font-size:19px')}
<div class="hai" style="margin-top:8px">${o('<b>Số đồng ít nhất:</b> thứ tự vòng lặp <b>không quan trọng</b> — min của cùng một tập đáp án thì như nhau dù đếm trùng. Chỉ bài <b>đếm</b> mới nhạy với thứ tự. (Đo: hai thứ tự đều PASS 3000 ca.)', 'xanh')}
${o('<b>Đọc đề:</b> "bao nhiêu <b>tổ hợp</b>/cách chọn" → xu ngoài (LC 518). "bao nhiêu <b>dãy</b>, thứ tự khác là khác" → số tiền ngoài (LC 377, bài tập 4).', 'do2')}</div>
${nho('Dãy thứ tự {1,2,5}, 5: dp = [1, 1, 2, 3, 5, 9]. Hai cách đều PASS 2000 ca so với vét cạn tương ứng.')}` },

  /* 17 */
  { t: 'Giải mã chuỗi số (decode ways, ý bài LC 91)', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
<p style="font-size:21px">A = 1, …, Z = 26. Chuỗi số có bao nhiêu cách đọc thành chữ?</p>
${ul([
    'dp[i] = số cách giải mã <b>i chữ số đầu</b>; dp[0] = 1',
    'Chữ cuối dùng <b>1 số</b> (1…9): + dp[i−1]',
    'Chữ cuối dùng <b>2 số</b> (10…26): + dp[i−2]',
    '<b class="do">"0" đứng một mình không phải chữ</b>; "05" không phải 5',
  ], 21)}
${hang([1, 1, 2, 2, 4], { w: 54, nhan: '"2326"', nhanW: 78, fill: { 4: 'do' } })}
${nho('2·3·2·6 · 23·2·6 · 2·3·26 · 23·26 → <b>4</b>')}</div>
<div>${bang([
    ['"12120"', '1 1 2 3 5 <b class="do">3</b>', 'số 0 cuối bắt buộc đi với 2 ⇒ = dp[3]'],
    ['"1010"', '1 1 1 1 1', 'chỉ 10·10'],
    ['"30", "100"', '… <b class="do">0</b>', '30 &gt; 26; "00" không đọc được'],
    ['"0"', '1 <b class="do">0</b>', 'bắt đầu bằng 0'],
    ['""', '1', 'chuỗi rỗng: 1 cách'],
  ], ['Chuỗi', 'dp[0..n]', 'Vì sao'], 'font-size:19px')}
${nho('O(n) thời gian, O(1) nếu giữ 2 biến. PASS 3000 chuỗi (nhiều 0, 1, 2) so với thử mọi cách cắt.')}</div></div>` },

  /* 18 */
  { t: 'Tách từ (word break, ý bài LC 139)', body: `<div class="hai" style="grid-template-columns:1.05fr 1fr"><div>${code(`boolean[] dp = new boolean[n + 1];
dp[0] = true;                   // tiền tố rỗng
for (int i = 1; i <= n; i++)
    for (int j = 0; j < i && !dp[i]; j++)
        if (dp[j] && dict.contains(s.substring(j, i)))
            dp[i] = true;       // s[0..j) tách được + từ s[j..i)`, 'java', 'sm')}
${o('<b>dp[i]</b> = s[0..i) tách được thành các từ trong từ điển? Từ <b>cuối cùng</b> là s[j..i) với một j nào đó.', 'xanh')}</div>
<div><p style="font-size:19px">Từ điển {hoc, java, jav, ado, day, a}, s = "hocjavaday":</p>
${hang(['T', 'F', 'F', 'T', 'F', 'F', 'T', 'T', 'F', 'F', 'T'], { w: 42, fs: 18, fill: { 0: 'xanh', 3: 'xanh', 6: 'xanh', 7: 'xanh', 10: 'do' } })}
${ul([
    'Lưu j ⇒ tách được: <b>[hoc, java, day]</b>',
    '"hocjavadoday" → [hoc, jav, ado, day]; "hocx" → false',
    'O(n²) cặp (j, i) × O(L) mỗi substring ⇒ <b>O(n²·L)</b>; bộ nhớ O(n)',
  ], 19)}
${nho('Đệ quy không nhớ, "a"×25 + "b", từ điển {a, aa, aaa}: <b class="do">5.600.910</b> lời gọi. PASS 3000 chuỗi so với đệ quy thuần.')}</div></div>` },

  /* 19 */
  { t: 'Dãy con tăng dài nhất (LIS) — O(n²)', body: `<div>
${hang([5, 2, 8, 6, 3, 6, 9, 7], { w: 62, nhan: 'a', nhanW: 64, fill: { 1: 'xanh', 4: 'xanh', 5: 'xanh', 6: 'xanh' } })}
${hang([1, 1, 2, 2, 2, 3, 4, 4], { w: 62, nhan: 'dp', nhanW: 64, chiSo: Array(8).fill(''), fill: { 6: 'do', 7: 'do' } })}
${hang([-1, -1, 0, 0, 1, 4, 5, 5], { w: 62, nhan: 'prev', nhanW: 64, chiSo: Array(8).fill('') })}</div>
<div class="hai" style="grid-template-columns:1fr 1fr;margin-top:-4px"><div>${ul([
    '<b>dp[i]</b> = LIS <b>kết thúc đúng tại</b> a[i] (không phải "trong a[0..i]")',
    'dp[i] = 1 + max dp[j] với j &lt; i và <b>a[j] &lt; a[i]</b>',
    'Đáp án = <b>max mọi dp[i]</b>, không phải dp[n−1]',
  ], 20)}</div>
<div>${out('LIS length 4: [2, 3, 6, 9]', 'font-size:16px')}
${ul([
    'Lấy lại: từ ô có dp lớn nhất, đi theo prev: 9 ← 6 ← 3 ← 2',
    'O(n²) thời gian, O(n) bộ nhớ',
    '{4, 4, 4} → 1 (tăng <b>ngặt</b>) · {} → 0',
  ], 19)}
${nho('PASS 3000 mảng so với mọi tập con (trùng, âm, rỗng).')}</div></div>` },

  /* 20 */
  { t: 'LIS O(n log n): mảng tails + tìm nhị phân', body: `<div class="hai" style="grid-template-columns:1fr 1.05fr"><div>
${o('<b>tails[k]</b> = số <b>cuối nhỏ nhất</b> của một dãy tăng dài k + 1. tails luôn tăng ⇒ <b>tìm nhị phân được</b>.', 'xanh')}
${ul([
    'Với mỗi x: tìm <b>lower bound</b> (ô đầu ≥ x) — deck CS1 slide 8',
    'Thay ô đó bằng x (đuôi nhỏ hơn = dễ nối hơn); ô ngoài cuối ⇒ dãy dài thêm 1',
    'Không giảm (≤): dùng <b>upper bound</b> (ô đầu &gt; x). {4,4,4}: ngặt 1, không giảm 3',
  ], 20)}
${o('tails <b class="do">không phải</b> là LIS: {2, 5, 1} kết thúc tails = [1, 5] — 1 đứng sau 5. Chỉ độ dài là đúng.', 'do2')}</div>
<div>${out(`x=5  pos=0  tails=[5]
x=2  pos=0  tails=[2]
x=8  pos=1  tails=[2, 8]
x=6  pos=1  tails=[2, 6]
x=3  pos=1  tails=[2, 3]
x=6  pos=2  tails=[2, 3, 6]
x=9  pos=3  tails=[2, 3, 6, 9]
x=7  pos=3  tails=[2, 3, 6, 7]
length = 4`, 'font-size:16px')}
${nho('n lần tìm nhị phân ⇒ <b>O(n log n)</b>, bộ nhớ O(n). PASS 3000 mảng (ngặt và không giảm) so với bản O(n²).')}</div></div>` },

  /* 21 */
  { t: 'Ba bẫy hay mất điểm', body: `<div class="hai" style="grid-template-columns:1fr 1fr"><div>
${o('<b>① Giá trị khởi tạo</b><br>• Min: INF = <code>Integer.MAX_VALUE</code> rồi <code>+ 1</code> ⇒ tràn âm, <b class="do">thắng mọi min</b><br>• Đếm: dp[0] = <b>1</b>; max/min: dp[0] = 0 hoặc INF tuỳ nghĩa<br>• Memo: đánh dấu "chưa tính" bằng −1 khi 0 là đáp án thật')}
${out(`coins {2}, amount 3 (impossible):
  INF = Integer.MAX_VALUE -> -2147483648
  INF = amount + 1        -> -1`, 'font-size:15px;margin-top:6px')}</div>
<div>${o('<b>② Tràn int</b><br>• fib(47), leo thang n = 46 đã vượt int<br>• Đếm dãy {1,2,3} tổng 40: long 23.837.527.729, int <b class="do">−1.932.276.047</b><br>⇒ dùng <b>long</b> hoặc modulo', 'do2')}
${o('<b>③ Lệch một</b><br>• dp có <b>n + 1</b> ô khi ô 0 là "rỗng" (cầu thang, đổi tiền, giải mã, tách từ)<br>• dp[i] ứng với phần tử <b>a[i−1]</b> — viết rõ trong chú thích<br>• Vòng lặp chạy tới <code>i &lt;= n</code>, không phải <code>&lt; n</code>', '')}
${nho('Mẹo tự kiểm: chạy tay n = 0, 1, 2 trước khi nộp.')}</div></div>` },

  /* 22 */
  { t: 'Nhận dạng dạng bài', body: `${bang([
    ['"Có bao nhiêu cách…", "đếm số đường đi…"', 'DP đếm: cộng các khả năng, dp[0] = 1, coi chừng tràn'],
    ['"Nhỏ nhất / lớn nhất / rẻ nhất…" và chọn ở mỗi bước ảnh hưởng bước sau', 'DP tối ưu: min/max; thử tham lam bằng phản ví dụ trước'],
    ['Chọn / bỏ từng phần tử, <b>không kề nhau</b>', 'Cướp nhà: max(bỏ, lấy + dp[i−2])'],
    ['Vòng tròn: đầu và cuối ràng buộc nhau', 'Chạy 2 lần: bỏ đầu / bỏ cuối'],
    ['Tổng bằng đúng X từ các "đồng xu" dùng lại được', 'Đổi tiền; tổ hợp → xu ngoài, dãy → số tiền ngoài'],
    ['Cắt chuỗi thành các mẩu hợp lệ', 'dp[i] trên tiền tố, thử mẩu cuối (giải mã, tách từ)'],
    ['"Dãy con" (không cần liền nhau) tăng / dài nhất', 'LIS: O(n²) có prev; O(n log n) với tails'],
    ['n ≤ 20–25 mà thử mọi cách chạy được, n lớn hơn thì không', 'Vét cạn có bài toán con trùng ⇒ thêm memo'],
  ], ['Thấy trong đề', 'Nghĩ tới'], 'font-size:19px')}` },

  /* 23 */
  { t: 'Bảng độ phức tạp', body: `${bang([
    ['Fibonacci đệ quy thuần', 'O(φⁿ)', 'O(n) ngăn xếp', '2·fib(n+1) − 1 lời gọi'],
    ['Fibonacci nhớ / bảng / 2 biến', 'O(n)', 'O(n) / O(n) / O(1)', 'mỗi ô tính một lần'],
    ['Leo thang 1…k bậc', 'O(n)', 'O(n)', 'tổng cửa sổ trượt, không O(n·k)'],
    ['Phí leo thang, cướp nhà (cả vòng tròn)', 'O(n)', 'O(1)', 'chỉ đọc 2 ô trước'],
    ['Đổi tiền: ít đồng nhất / số cách', 'O(n·A)', 'O(A)', 'A ô × n loại xu'],
    ['Giải mã chuỗi số', 'O(n)', 'O(1)', '2 ô trước'],
    ['Tách từ', 'O(n²·L)', 'O(n)', 'mọi cặp (j, i), substring O(L)'],
    ['LIS cơ bản / có tails', 'O(n²) / O(n log n)', 'O(n)', 'mọi j &lt; i / tìm nhị phân trên tails'],
  ], ['Bài', 'Thời gian', 'Bộ nhớ', 'Vì sao'], 'font-size:19px')}
${nho('Quy tắc chung: <b>thời gian = số trạng thái × chi phí mỗi trạng thái</b>; bộ nhớ = số ô phải giữ cùng lúc.')}` },

  /* 24 */
  { t: 'Tóm tắt', body: `<ul style="font-size:22px">
<li>DP = <b>bài toán con gối nhau</b> + <b>cấu trúc con tối ưu</b>: giải mỗi bài con một lần, ghi lại</li>
<li>Đệ quy thuần fib(40): <b>331 triệu</b> lời gọi → nhớ: <b>79</b> → bảng → <b>2 biến</b> O(1)</li>
<li><b>4 bước</b>: trạng thái → truy hồi (hỏi "bước cuối là gì?") → cơ sở → thứ tự tính; + lấy lại lời giải</li>
<li>Cầu thang, phí cầu thang, cướp nhà: đọc <b>2 ô trước</b>; vòng tròn = 2 lần chạy; k bậc = cửa sổ trượt</li>
<li>Tham lam sai với {1, 3, 4} → 6; đổi tiền: min = dp[x − c] + 1; đếm: <b>xu ngoài = tổ hợp</b>, <b>số tiền ngoài = dãy</b></li>
<li>Giải mã, tách từ: dp trên tiền tố, thử <b>mẩu cuối</b>; "0" không đứng một mình</li>
<li>LIS: dp "kết thúc tại i" O(n²); tails + lower bound O(n log n) — tails không phải LIS</li>
<li>Bẫy: INF + 1 tràn, dp[0] = 1 khi đếm, dùng long, mảng n + 1 ô</li>
</ul>` },
]);
