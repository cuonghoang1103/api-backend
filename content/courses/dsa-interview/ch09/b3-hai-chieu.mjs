/** 9.3 — Quy hoạch động hai chiều. Mọi mã/output đọc từ ../ma/ch09/b3 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { bangDP } from './_rieng.mjs';
import { vetLcs, vetEdit, vetKnap, vetPal, vetPaths } from '../ma/ch09/b3/dp2.vet.mjs';

const R = 'ch09/b3/';

/* ── Unique Paths 3×4 ─────────────────────────────────────────────────────────────────────────────── */
const P = vetPaths(3, 4);
const BANG_PATHS = bangDP(P.dp, { hang: ['r=0', 'r=1', 'r=2'], cot: ['c=0', 'c=1', 'c=2', 'c=3'], coSo: true, to: { '2,3': 'ok', '1,3': 'cs', '2,2': 'cs' } });
const VET_PATHS = bangVet(['after row r', 'row[] (ONE array, overwritten left → right)'],
  P.hang.map((h) => [String(h.r), oMang(h.row, { to: h.r === 2 ? { 3: 'ok' } : {}, chiSo: true })]));

/* ── LCS ───────────────────────────────────────────────────────────────────────────────────────────── */
const LA = 'ABCBDA', LB = 'BDCABA';
const L = vetLcs(LA, LB);
const toL = {}, chuL = {};
for (const [i, j, m] of L.duong) { toL[`${i},${j}`] = m === '↖' ? 'ok' : 'r'; chuL[`${i},${j}`] = m; }
const BANG_LCS = bangDP(L.dp, { hang: ['""', ...LA], cot: ['""', ...LB], goc: 'A ↓ · B →', coSo: true, to: toL, chu: chuL });
const VET_LCS = bangVet(['i', 'A[i−1]', 'row i of dp, j = 0..6 (green = A[i−1] == B[j−1])', 'row max'],
  L.hang.map((h) => [String(h.i), `<code>${h.ch}</code>`, oMang(h.row, { to: Object.fromEntries(h.khop.map((j) => [j, 'ok'])), chiSo: true }), String(Math.max(...h.row))]));

/* ── Edit distance ─────────────────────────────────────────────────────────────────────────────────── */
const EA = 'horse', EB = 'ros';
const E = vetEdit(EA, EB);
const toE = {}, chuE = {};
for (const [i, j, m] of E.duong) { toE[`${i},${j}`] = m === '↖=' ? 'cs' : 'ok'; if (m) chuE[`${i},${j}`] = m; }
const BANG_EDIT = bangDP(E.dp, { hang: ['""', ...EA], cot: ['""', ...EB], goc: 'a ↓ · b →', to: toE, chu: chuE });
const VET_EDIT = bangVet(['step', 'cell (i, j)', 'dp', 'move', 'edit'],
  [...E.duong].reverse().map((d, k) => [String(k), `(${d[0]}, ${d[1]})`, String(E.dp[d[0]][d[1]]), d[2] || '·', d[3]]));

/* ── Knapsack ──────────────────────────────────────────────────────────────────────────────────────── */
const KW = [1, 3, 4, 5], KV = [1, 4, 5, 7];
const K = vetKnap(KW, KV, 7);
const toK = {};
for (let i = 1; i <= KW.length; i++) for (let c = 0; c <= 7; c++) if (K.lay[i][c]) toK[`${i},${c}`] = 'cs';
for (let i = KW.length, c = 7; i > 0; i--) { toK[`${i},${c}`] = 'ok'; if (K.lay[i][c]) c -= KW[i - 1]; }
const BANG_KNAP = bangDP(K.dp, {
  hang: ['no item', ...KW.map((w, k) => `+item ${k} (w${w}, v${KV[k]})`)],
  cot: [0, 1, 2, 3, 4, 5, 6, 7], goc: 'items ↓ · capacity →', to: toK,
});

/* ── Longest palindromic substring ─────────────────────────────────────────────────────────────────── */
const PS = 'cabbad';
const PV = vetPal(PS);
const toP = {};
for (let i = 0; i < PS.length; i++) for (let j = i; j < PS.length; j++) if (PV.is[i][j]) toP[`${i},${j}`] = 'cs';
toP[`${PV.best[0]},${PV.best[1]}`] = 'ok';
const BANG_PAL = bangDP(PV.is, { hang: [...PS].map((ch, i) => `i=${i} ${ch}`), cot: [...PS].map((ch, j) => `${ch}·${j}`), goc: 'start ↓ · end →', to: toP });
const VET_PAL = bangVet(['len', '(i, j)', 'S[i..j]', 'ends equal?', 'inside is[i+1][j−1]', 'is[i][j]'],
  PV.thuTu.filter((x) => x.len >= 3).map((x) => [String(x.len), `(${x.i}, ${x.j})`, `<code>${PS.slice(x.i, x.j + 1)}</code>`,
    PS[x.i] === PS[x.j] ? `${PS[x.i]} = ${PS[x.j]}` : `${PS[x.i]} ≠ ${PS[x.j]}`, String(PV.is[x.i + 1][x.j - 1]), x.v ? '✅ 1' : '0']));

const DE = [
  [lc(62, 'unique-paths', 'Unique Paths', 'Medium'), 'Cell = from above + from the left; base row and column are 1.', 'Ô = từ trên + từ trái; hàng và cột cơ sở bằng 1.'],
  [lc(63, 'unique-paths-ii', 'Unique Paths II', 'Medium'), 'Same table, a rock forces the cell to 0 — including in the first row.', 'Cùng bảng, ô có đá thì ép về 0 — kể cả ở hàng đầu.'],
  [lc(64, 'minimum-path-sum', 'Minimum Path Sum', 'Medium'), 'Same shape, min instead of +, plus the cell’s own cost.', 'Cùng hình dạng, đổi + thành min, cộng giá của chính ô.'],
  [lc(1143, 'longest-common-subsequence', 'Longest Common Subsequence', 'Medium'), 'Two strings ⇒ dp[i][j] over two prefixes; match ⇒ diagonal + 1.', 'Hai chuỗi ⇒ dp[i][j] trên hai tiền tố; khớp ⇒ chéo + 1.'],
  [lc(583, 'delete-operation-for-two-strings', 'Delete Operation for Two Strings', 'Medium'), 'Only deletions allowed: answer = n + m − 2·LCS.', 'Chỉ được xoá: đáp án = n + m − 2·LCS.'],
  [lc(72, 'edit-distance', 'Edit Distance', 'Medium'), 'Three edits ↔ three neighbours (diagonal, up, left); base = i and j.', 'Ba phép sửa ↔ ba ô hàng xóm (chéo, trên, trái); cơ sở = i và j.'],
  [lc(416, 'partition-equal-subset-sum', 'Partition Equal Subset Sum', 'Medium'), '0/1 knapsack on booleans with target sum/2; inner loop goes DOWN.', 'Cái túi 0/1 trên giá trị đúng/sai với đích tổng/2; vòng trong chạy NGƯỢC.'],
  [lc(5, 'longest-palindromic-substring', 'Longest Palindromic Substring', 'Medium'), 'is[i][j] needs is[i+1][j−1] ⇒ fill by length; or expand from each centre.', 'is[i][j] cần is[i+1][j−1] ⇒ điền theo độ dài; hoặc nở từ từng tâm.'],
  [lc(647, 'palindromic-substrings', 'Palindromic Substrings', 'Medium'), 'Same table as LC 5, count the true cells instead of the longest.', 'Cùng bảng với LC 5, đếm số ô đúng thay vì lấy ô dài nhất.'],
  [lc(115, 'distinct-subsequences', 'Distinct Subsequences', 'Hard'), 'LCS-shaped counting: match ⇒ diagonal + up; watch for overflow.', 'Đếm cùng khuôn LCS: khớp ⇒ chéo + trên; cẩn thận tràn số.'],
];

export default {
  title: '9.3 — Two-dimensional DP: grids, LCS, edit distance, knapsack, palindromes|||9.3 — Quy hoạch động hai chiều: lưới, LCS, khoảng cách sửa, cái túi, đối xứng',
  slug: 'dsa-9-3-hai-chieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảng dp[i][j] tô màu từng ô cho Unique Paths, LCS (và git diff), Edit Distance (và "Did you mean"), cái túi 0/1 (và lập sprint), xâu đối xứng điền theo đường chéo — kèm đo thật đệ quy 2 tỉ lời gọi so với bảng 0,002 ms.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Two-dimensional DP: grids, LCS, edit distance, knapsack, palindromes</h2>
<p class="lead">In lesson 9.2 the state was one number: "the best answer for the first i houses". Many interview problems need <strong>two</strong> numbers to describe where you are: a row and a column of a grid, a position in each of two strings, an item and a remaining capacity, the start and the end of a substring. The answer then lives in a <strong>table</strong> <code>dp[i][j]</code>. This lesson fills five such tables cell by cell, in colour, so you can see what every cell looks at — and then shows you where the same tables run inside this very website: the diff you approve in the desktop app, the "Did you mean?" of the CT Work search box, the score of a speaking exercise.</p>
<p>The method does not change from lesson 9.1: before any code, answer the four questions <strong>state · transition · base case · order of computation</strong>. What changes is that "order" stops being obvious — and one problem in this lesson must be filled diagonal by diagonal.</p>

<h3>The everyday picture: a spreadsheet where every cell is a formula</h3>
<p>Open Excel and type <code>1</code> in the whole first row and the whole first column. In cell B2 type <code>=B1+A2</code> ("the cell above plus the cell to the left") and drag that formula across the sheet. Without writing a single loop you have just solved Unique Paths: every cell now holds the number of ways to walk there from the top-left corner moving only right or down. Excel even computes the cells in a safe order, because it knows which cell each formula reads.</p>
<p>That is exactly what a two-dimensional DP is: a grid of cells, one formula shared by all of them that reads a few <em>neighbouring</em> cells (above, left, diagonal), some fixed values on the border, and an order of computation in which every cell is computed after the cells it reads. Your job in an interview is to find the meaning of a cell and its formula; the code is the dragging.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Quy hoạch động hai chiều: lưới, LCS, khoảng cách sửa, cái túi, đối xứng</h2>
<p class="lead">Ở bài 9.2 trạng thái chỉ là một con số: "đáp án tốt nhất cho i căn nhà đầu tiên". Rất nhiều đề phỏng vấn cần <strong>hai</strong> con số mới tả được bạn đang đứng ở đâu: hàng và cột của một lưới, vị trí trên mỗi chuỗi trong hai chuỗi, một món đồ và sức chứa còn lại, điểm đầu và điểm cuối của một xâu con. Khi đó đáp án nằm trong một <strong>bảng</strong> <code>dp[i][j]</code>. Bài này điền năm cái bảng như vậy từng ô một, có tô màu, để bạn THẤY mỗi ô nhìn vào những ô nào — rồi chỉ ra chính những cái bảng đó đang chạy ở đâu trong trang web này: bản diff bạn duyệt trong app desktop, dòng "Did you mean?" của ô tìm kiếm CT Work, điểm của bài luyện nói.</p>
<p>Phương pháp không đổi so với bài 9.1: trước khi viết dòng code nào, trả lời bốn câu hỏi <strong>trạng thái · chuyển · cơ sở · thứ tự tính</strong>. Cái thay đổi là "thứ tự tính" không còn hiển nhiên nữa — và có một đề trong bài này phải điền theo từng đường chéo.</p>

<h3>Hình dung đời thường: một trang Excel mà ô nào cũng là công thức</h3>
<p>Mở Excel, gõ <code>1</code> vào cả hàng đầu và cả cột đầu. Ở ô B2 gõ <code>=B1+A2</code> ("ô bên trên cộng ô bên trái") rồi kéo công thức đó phủ cả trang. Không viết một vòng lặp nào, bạn vừa giải xong Unique Paths: mỗi ô giờ chứa số cách đi từ góc trên trái tới đó nếu chỉ được sang phải hoặc xuống dưới. Excel còn tự tính các ô theo một thứ tự an toàn, vì nó biết công thức của mỗi ô đọc những ô nào.</p>
<p>Quy hoạch động hai chiều (2D dynamic programming) chính là vậy: một lưới ô, MỘT công thức dùng chung cho mọi ô và chỉ đọc vài ô <em>hàng xóm</em> (trên, trái, chéo), vài giá trị cố định ở viền, và một thứ tự tính sao cho mỗi ô được tính SAU những ô nó đọc. Việc của bạn khi phỏng vấn là tìm ra ý nghĩa của một ô và công thức của nó; phần code chỉ là "kéo công thức".</p>
${csd('csd201-slide-cs4-1', 'vi', 'CS.4 — Quy hoạch động (3): bảng 2 chiều, cái túi 0/1', '<p>Ôn nhanh một câu: khi trạng thái cần hai chỉ số, bảng có kích thước (n+1)×(m+1), hàng 0/cột 0 là "chưa có gì". <strong>Ở đây đi sâu thêm:</strong> tô màu đường truy vết để khôi phục đáp án, nén bảng còn một/hai hàng (và cái bẫy chiều của vòng lặp), đo thật đệ quy so với bảng, và chỉ ra các bảng này trong mã thật của repo.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when the state needs two numbers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">two strings or two arrays</span><span class="v">"common", "transform A into B", "interleave", "match a pattern" ⇒ <code>dp[i][j]</code> = answer for the prefix of length i of the first and length j of the second.</span></div>
  <div class="kv"><span class="k">a grid with moves right/down</span><span class="v">Count paths, minimum cost path, largest square ⇒ <code>dp[r][c]</code> reads above / left / diagonal.</span></div>
  <div class="kv"><span class="k">items + a budget</span><span class="v">"choose a subset with total weight ≤ W", "can we reach sum S", "how many ways to reach S" ⇒ knapsack: <code>dp[i][c]</code> = first i items, capacity c.</span></div>
  <div class="kv"><span class="k">a substring / interval</span><span class="v">"palindrome", "burst / merge a range", "best way to split [i..j]" ⇒ <code>dp[i][j]</code> on the interval, filled by length.</span></div>
  <div class="kv"><span class="k">constraints n, m ≤ 1,000–5,000</span><span class="v">n·m = 10⁶–2.5·10⁷ cells: an O(n·m) table is the expected answer (lesson 0.1's table). n ≤ 10⁵ on both sides would be 10¹⁰ cells — then the problem wants something smarter.</span></div>
</div>
<h3>The recipe for every table in this lesson</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">State</span><span class="lz-d">Say in one sentence what <code>dp[i][j]</code> means, with the word "prefix", "first i items" or "substring i..j".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Transition</span><span class="lz-d">Look at the LAST decision (last character, last item, last move) and write the formula from smaller cells.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Base case</span><span class="lz-d">Row 0 / column 0 (empty prefix, no item) or the diagonal (substrings of length 1).</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Order</span><span class="lz-d">Draw arrows from each cell to the cells it reads; pick a loop order that visits the arrow targets first.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Answer + memory</span><span class="lz-d">Which cell is the answer? Then: do I only read the previous row? ⇒ keep two rows, or one.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi trạng thái cần hai con số</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hai chuỗi hoặc hai mảng</span><span class="v">"chung", "biến A thành B", "xen kẽ", "khớp mẫu" ⇒ <code>dp[i][j]</code> = đáp án cho tiền tố dài i của chuỗi thứ nhất và tiền tố dài j của chuỗi thứ hai.</span></div>
  <div class="kv"><span class="k">lưới, chỉ đi phải/xuống</span><span class="v">Đếm số đường, đường đi rẻ nhất, hình vuông lớn nhất ⇒ <code>dp[r][c]</code> đọc ô trên / trái / chéo.</span></div>
  <div class="kv"><span class="k">đồ vật + ngân sách</span><span class="v">"chọn tập con có tổng khối lượng ≤ W", "có đạt đúng tổng S không", "bao nhiêu cách đạt S" ⇒ cái túi (knapsack): <code>dp[i][c]</code> = i món đầu, sức chứa c.</span></div>
  <div class="kv"><span class="k">xâu con / một đoạn</span><span class="v">"đối xứng" (palindrome), "nổ / gộp một đoạn", "cách chia [i..j] tốt nhất" ⇒ <code>dp[i][j]</code> trên đoạn, điền theo độ dài.</span></div>
  <div class="kv"><span class="k">ràng buộc n, m ≤ 1.000–5.000</span><span class="v">n·m = 10⁶–2,5·10⁷ ô: bảng O(n·m) là đáp án được chờ đợi (bảng giới hạn n ở bài 0.1). Nếu cả hai phía tới 10⁵ thì là 10¹⁰ ô — đề đang đòi một ý thông minh hơn.</span></div>
</div>
<h3>Công thức chung cho mọi bảng trong bài</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trạng thái</span><span class="lz-d">Nói trong một câu <code>dp[i][j]</code> nghĩa là gì, có chữ "tiền tố", "i món đầu" hay "xâu con i..j".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chuyển</span><span class="lz-d">Nhìn vào quyết định CUỐI CÙNG (ký tự cuối, món cuối, bước đi cuối) rồi viết công thức từ các ô nhỏ hơn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cơ sở</span><span class="lz-d">Hàng 0 / cột 0 (tiền tố rỗng, chưa có món nào) hoặc đường chéo (xâu con dài 1).</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thứ tự tính</span><span class="lz-d">Vẽ mũi tên từ mỗi ô tới các ô nó đọc; chọn thứ tự vòng lặp ghé các ô đích của mũi tên TRƯỚC.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Đáp án + bộ nhớ</span><span class="lz-d">Ô nào là đáp án? Rồi: mình chỉ đọc hàng ngay trước thôi à? ⇒ giữ hai hàng, hoặc một hàng.</span></div>
</div>
<p>Năm bước này là bốn câu hỏi của bài 9.1 cộng thêm câu "đáp án ở ô nào, nén được không". Bài 9.4 (<a href="${baiNay('dsa-9-4-nhan-dien')}">nhận ra quy hoạch động</a>) luyện nói chúng thành lời trước người phỏng vấn; bài này luyện TÍNH chúng cho đúng.</p>
</div>

<div class="ml-en">
<h3>Warm-up: Unique Paths (and Excel's formula, in code)</h3>
<p><strong>Problem (in our words).</strong> A robot stands in the top-left cell of an <code>m × n</code> grid and may only move right or down. How many different paths reach the bottom-right cell? On a 3 × 4 grid the answer is 10.</p>
<p><strong>Brute force, out loud.</strong> Every path is a sequence of (m−1) "down" and (n−1) "right" moves; trying them all recursively explores a binary tree of depth m+n−2 — exponential. And the tree repeats itself: "how many ways from cell (1, 2)?" is asked again by every path that passes through (1, 2).</p>
<p><strong>The four questions.</strong> <em>State:</em> <code>dp[r][c]</code> = number of paths from the start to cell (r, c). <em>Transition:</em> the last move into (r, c) came either from above or from the left, and those two groups of paths do not overlap, so <code>dp[r][c] = dp[r−1][c] + dp[r][c−1]</code>. <em>Base:</em> the first row and first column have exactly one path each (a straight line). <em>Order:</em> each cell reads up and left, so rows top to bottom, columns left to right is safe.</p>
</div>
<div class="ml-vi">
<h3>Khởi động: Unique Paths (công thức Excel, viết thành code)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một robot đứng ở ô trên trái của lưới <code>m × n</code> và chỉ được đi sang phải hoặc xuống dưới. Có bao nhiêu đường đi khác nhau tới ô dưới phải? Với lưới 3 × 4 đáp án là 10.</p>
<p><strong>Vét cạn, nói thành lời.</strong> Mỗi đường là một dãy gồm (m−1) bước "xuống" và (n−1) bước "phải"; thử hết bằng đệ quy là duyệt một cây nhị phân sâu m+n−2 — hàm mũ. Và cây đó tự lặp lại: câu "từ ô (1, 2) có bao nhiêu cách?" bị hỏi lại bởi MỌI đường đi qua (1, 2) — đúng dấu hiệu "bài toán con chồng nhau" (overlapping subproblems) của bài 9.1.</p>
<p><strong>Bốn câu hỏi.</strong> <em>Trạng thái:</em> <code>dp[r][c]</code> = số đường từ điểm xuất phát tới ô (r, c). <em>Chuyển:</em> bước cuối cùng vào (r, c) hoặc đến từ bên trên, hoặc từ bên trái, và hai nhóm đường đó không trùng nhau, nên <code>dp[r][c] = dp[r−1][c] + dp[r][c−1]</code>. <em>Cơ sở:</em> hàng đầu và cột đầu, mỗi ô có đúng một đường (đi thẳng). <em>Thứ tự:</em> mỗi ô đọc ô trên và ô trái, nên đi hàng từ trên xuống, cột từ trái sang là an toàn.</p>
</div>
${maHai(R + 'unique-paths.ts', R + 'HcUniquePaths.java', { vung: 'bang' })}
${ketQua(R + 'unique-paths.ts')}
<div class="ml-en">
<p>Here is the 3 × 4 table produced by running the code. Grey = base cells (row 0, column 0). The answer cell (green) is 6 + 4: the cell above it (4) plus the cell to its left (6), both shaded.</p>
</div>
<div class="ml-vi">
<p>Đây là bảng 3 × 4 sinh ra bằng cách chạy mã. Xám = ô cơ sở (hàng 0, cột 0). Ô đáp án (xanh lá đậm) bằng 6 + 4: ô ngay trên nó (4) cộng ô bên trái nó (6), cả hai được tô nhạt.</p>
</div>
${BANG_PATHS}
<div class="ml-en">
<p><strong>From a table to one row.</strong> Cell (r, c) reads only row r−1 and row r. Keep ONE array <code>row</code>: before the update, <code>row[c]</code> still holds the value from the previous row ("above"); <code>row[c−1]</code> has already been updated in this row ("left"). So <code>row[c] += row[c−1]</code> is the whole formula. The trace below shows that single array after each row — read it as the rows of the table above, written over the same memory:</p>
</div>
<div class="ml-vi">
<p><strong>Từ cả bảng xuống một hàng.</strong> Ô (r, c) chỉ đọc hàng r−1 và hàng r. Giữ MỘT mảng <code>row</code>: trước khi cập nhật, <code>row[c]</code> vẫn còn giá trị của hàng trước ("ô trên"); <code>row[c−1]</code> đã được cập nhật trong hàng này rồi ("ô trái"). Vậy <code>row[c] += row[c−1]</code> là toàn bộ công thức. Bảng vết dưới đây cho thấy đúng một mảng đó sau từng hàng — đọc nó như các hàng của bảng phía trên, chép đè lên cùng một vùng nhớ:</p>
</div>
${VET_PATHS}
${maHai(R + 'unique-paths.ts', R + 'HcUniquePaths.java', { vung: 'mot-hang' })}
<div class="ml-en">
<p>Memory went from O(m·n) to O(n), time stays O(m·n). The follow-up <em>Unique Paths II</em> adds rocks (cells with 1). One line changes: a rock cell gets 0, because no path passes through it. The trap is the first row: in the original problem every first-row cell is 1, but after a rock everything to its right in the first row is unreachable. Starting with <code>row[0] = 1</code> and letting the same loop handle row 0 avoids writing the base case by hand — and the output above shows the case <code>[[1]]</code> (a rock on the start) returns 0.</p>
</div>
<div class="ml-vi">
<p>Bộ nhớ giảm từ O(m·n) xuống O(n), thời gian vẫn O(m·n). Đề nối tiếp <em>Unique Paths II</em> thêm đá (ô có số 1). Chỉ đổi một dòng: ô có đá nhận 0, vì không đường nào đi qua được. Cái bẫy nằm ở hàng đầu: ở đề gốc mọi ô hàng đầu đều bằng 1, nhưng sau một hòn đá thì mọi ô bên phải nó ở hàng đầu đều không tới được. Khởi tạo <code>row[0] = 1</code> rồi để chính vòng lặp xử lý cả hàng 0 giúp khỏi viết tay ca cơ sở — và output phía trên cho thấy ca <code>[[1]]</code> (đá nằm ngay chỗ xuất phát) trả về 0.</p>
</div>
${ma(R + 'unique-paths.ts', { vung: 'vat-can', nhan: 'TypeScript — LC 63' })}

<div class="ml-en">
<h3>Main problem 1: Longest Common Subsequence (LCS)</h3>
<p><strong>Problem (in our words).</strong> Given two strings, return the length of their longest common <em>subsequence</em>: letters that appear in both strings in the same order, not necessarily next to each other. <code>"abcde"</code> and <code>"ace"</code> → 3 (<code>"ace"</code>). A <em>substring</em> must be contiguous; a <em>subsequence</em> may skip letters — say that difference out loud, it is the first thing interviewers check.</p>
<p><strong>Brute force.</strong> A string of length n has 2ⁿ subsequences; generating all of them for the first string and checking each against the second is O(2ⁿ·m). Hopeless beyond n ≈ 25.</p>
<p><strong>Think about the last characters.</strong> Compare the last letter of each string. If they are equal, that letter can end a common subsequence, and the rest is the LCS of both strings without their last letter. If they differ, at least one of the two last letters is not used: drop the last letter of A <em>or</em> the last letter of B, and take the better of the two. Every question asked is about two <em>prefixes</em> — and there are only (n+1)·(m+1) different pairs of prefixes.</p>
<p><strong>The four questions.</strong> <em>State:</em> <code>dp[i][j]</code> = LCS length of the prefixes <code>a[0..i)</code> and <code>b[0..j)</code> (the first i letters of a, the first j of b). <em>Transition:</em> if <code>a[i−1] == b[j−1]</code> then <code>dp[i−1][j−1] + 1</code> (diagonal), else <code>max(dp[i−1][j], dp[i][j−1])</code> (up, left). <em>Base:</em> row 0 and column 0 are 0 — an empty prefix shares nothing. <em>Order:</em> rows top to bottom, columns left to right; the answer is <code>dp[n][m]</code>.</p>
</div>
<div class="ml-vi">
<h3>Đề chính 1: Longest Common Subsequence (LCS — dãy con chung dài nhất)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho hai chuỗi, trả về độ dài <em>dãy con</em> chung dài nhất: các chữ cái xuất hiện trong cả hai chuỗi theo đúng thứ tự, không bắt buộc đứng liền nhau. <code>"abcde"</code> và <code>"ace"</code> → 3 (<code>"ace"</code>). <em>Xâu con</em> (substring) phải liền mạch; <em>dãy con</em> (subsequence) được phép bỏ qua chữ — hãy nói rõ khác biệt này, đó là điều người phỏng vấn kiểm đầu tiên.</p>
<p><strong>Vét cạn.</strong> Một chuỗi dài n có 2ⁿ dãy con; sinh hết dãy con của chuỗi thứ nhất rồi kiểm từng cái với chuỗi thứ hai tốn O(2ⁿ·m). Vô vọng khi n vượt khoảng 25.</p>
<p><strong>Nghĩ về ký tự cuối.</strong> So chữ cuối của hai chuỗi. Nếu bằng nhau, chữ đó có thể là chữ cuối của một dãy chung, và phần còn lại là LCS của hai chuỗi đã bỏ chữ cuối. Nếu khác nhau, ít nhất một trong hai chữ cuối không được dùng: bỏ chữ cuối của A <em>hoặc</em> chữ cuối của B, lấy kết quả tốt hơn. Mọi câu hỏi phát sinh đều là về hai <em>tiền tố</em> (prefix) — mà chỉ có (n+1)·(m+1) cặp tiền tố khác nhau. Từ 2ⁿ xuống n·m: đó là cú nhảy của quy hoạch động.</p>
<p><strong>Bốn câu hỏi.</strong> <em>Trạng thái:</em> <code>dp[i][j]</code> = độ dài LCS của hai tiền tố <code>a[0..i)</code> và <code>b[0..j)</code> (i chữ đầu của a, j chữ đầu của b). <em>Chuyển:</em> nếu <code>a[i−1] == b[j−1]</code> thì <code>dp[i−1][j−1] + 1</code> (ô chéo), ngược lại <code>max(dp[i−1][j], dp[i][j−1])</code> (ô trên, ô trái). <em>Cơ sở:</em> hàng 0 và cột 0 bằng 0 — tiền tố rỗng không chung được gì. <em>Thứ tự:</em> hàng từ trên xuống, cột từ trái sang; đáp án là <code>dp[n][m]</code>.</p>
</div>
${maHai(R + 'lcs.ts', R + 'HcLcs.java', { vung: 'bang' })}
${ketQua(R + 'lcs.ts')}
${ketQua(R + 'HcLcs.java')}
<div class="ml-en">
<p>Why <code>i − 1</code> and not <code>i</code>? Because <code>dp</code> has one extra row and column for the empty prefix: row i is about the first i letters, whose <em>last</em> letter sits at index i−1 of the string. Mixing the two indexings is the most common bug in this whole lesson; the trap section below runs it.</p>
<h3>Watch the table fill, row by row</h3>
<p>A = <code>ABCBDA</code> (rows), B = <code>BDCABA</code> (columns). Each row of the trace is one value of i; green cells are the columns where <code>A[i−1]</code> equals <code>B[j−1]</code> — the only places where a value can go up by one (diagonal + 1). Everywhere else a cell copies the larger of its up and left neighbours.</p>
</div>
<div class="ml-vi">
<p>Vì sao <code>i − 1</code> mà không phải <code>i</code>? Vì <code>dp</code> có thêm một hàng và một cột cho tiền tố rỗng: hàng i nói về i chữ đầu tiên, mà chữ <em>cuối</em> của chúng nằm ở chỉ số i−1 trong chuỗi. Lẫn hai cách đánh số này là lỗi phổ biến nhất của cả bài; mục "Bẫy" phía dưới chạy thật nó.</p>
<h3>Xem bảng điền dần, từng hàng</h3>
<p>A = <code>ABCBDA</code> (theo hàng), B = <code>BDCABA</code> (theo cột). Mỗi dòng của bảng vết là một giá trị i; ô xanh là các cột mà <code>A[i−1]</code> bằng <code>B[j−1]</code> — chỗ DUY NHẤT một giá trị có thể tăng thêm một (chéo + 1). Mọi chỗ khác, ô chỉ chép giá trị lớn hơn trong hai ô trên và trái.</p>
</div>
${VET_LCS}
<div class="ml-en">
<p>Now the finished table, with the <strong>traceback</strong> (walking back to recover one actual common subsequence) drawn on it. Start at the bottom-right corner. On a match (↖, dark green) the letter belongs to the answer: step diagonally. Otherwise step towards the neighbour that holds the same value (↑ or ←, orange) — that is the branch the max came from. The diagonal steps, read from top-left to bottom-right, spell <code>${L.chu}</code>, and the length is ${L.dp[LA.length][LB.length]}.</p>
</div>
<div class="ml-vi">
<p>Giờ là bảng đã điền xong, có vẽ <strong>đường truy vết</strong> (traceback — đi ngược lại để khôi phục một dãy chung cụ thể). Bắt đầu ở góc dưới phải. Gặp chữ khớp (↖, xanh đậm) thì chữ đó thuộc đáp án: bước chéo lên. Không khớp thì bước về phía ô hàng xóm giữ cùng giá trị (↑ hoặc ←, cam) — đó là nhánh mà phép max đã lấy. Các bước chéo, đọc từ trên trái xuống dưới phải, ghép thành <code>${L.chu}</code>, độ dài ${L.dp[LA.length][LB.length]}.</p>
</div>
${BANG_LCS}
<div class="ml-en">
<p>Here <code>BCBA</code> is the only longest one, but in general there can be several: <code>"abc"</code> and <code>"acb"</code> share both <code>"ab"</code> and <code>"ac"</code>. The tie-breaking rule "prefer ↑ when up ≥ left" just picks one, deterministically. If the interviewer asks "return the subsequence, not its length", this walk is the answer — O(n + m) extra steps on the table you already have.</p>
${moPhong(R + 'lcs.sim.js', 'en', 'LCS table — every cell, then the walk back', 'Opens /algorithms with this program: each cell highlights the cells it reads (diagonal on a match, up + left otherwise), then the traceback.')}
</div>
<div class="ml-vi">
<p>Ở đây <code>BCBA</code> là dãy dài nhất duy nhất, nhưng nói chung có thể có nhiều: <code>"abc"</code> và <code>"acb"</code> chung cả <code>"ab"</code> lẫn <code>"ac"</code>. Luật phá hoà "ưu tiên ↑ khi trên ≥ trái" chỉ chọn ra một cái, một cách tất định. Nếu người phỏng vấn hỏi "trả về chính dãy con, không phải độ dài", phép đi ngược này là câu trả lời — thêm O(n + m) bước trên cái bảng bạn đã có.</p>
${moPhong(R + 'lcs.sim.js', 'vi', 'Bảng LCS — từng ô, rồi đi ngược', 'Mở trang /algorithms với chương trình này: mỗi ô tô sáng các ô nó đọc (chéo khi khớp, trên + trái khi không), rồi tới đường truy vết.')}
</div>
${ma(R + 'lcs.ts', { vung: 'truy-vet', nhan: 'TypeScript — recover one LCS' })}
${maHai(R + 'lcs.ts', R + 'HcLcs.java', { vung: 'hai-hang' })}
<div class="ml-en">
<p><strong>Two rows are enough for the length.</strong> Each cell reads the previous row (up, diagonal) and the current row (left), so keep <code>prev</code> and <code>cur</code> and swap the references after each row — O(m) memory instead of O(n·m). Swapping references (not copying) matters: copying a row of 5,000 numbers 5,000 times is 25 million extra writes. The price: with two rows you can no longer walk back to recover the subsequence. "Length only ⇒ two rows; the actual answer ⇒ full table (or Hirschberg's divide-and-conquer trick, which you only need to <em>name</em>)" is a good sentence to have ready.</p>
</div>
<div class="ml-vi">
<p><strong>Chỉ cần độ dài thì hai hàng là đủ.</strong> Mỗi ô đọc hàng trước (trên, chéo) và hàng hiện tại (trái), nên giữ <code>prev</code> và <code>cur</code> rồi tráo tham chiếu sau mỗi hàng — bộ nhớ O(m) thay vì O(n·m). Tráo tham chiếu (không chép) là quan trọng: chép một hàng 5.000 số đi 5.000 lần là 25 triệu lần ghi thừa. Cái giá: chỉ còn hai hàng thì không đi ngược để khôi phục dãy con được nữa. Câu "chỉ cần độ dài ⇒ hai hàng; cần đáp án cụ thể ⇒ cả bảng (hoặc mẹo chia để trị của Hirschberg, chỉ cần <em>gọi tên</em> được)" là câu nên thuộc sẵn.</p>
</div>

<div class="ml-en">
<h3>LCS in real systems: every diff you have ever read</h3>
<p>A line diff is LCS on <em>lines</em> instead of letters: lines in the common subsequence are kept, lines only in the old file are removed (−), lines only in the new file are added (+). This repository has four places that do it by hand:</p>
<ul>
<li><strong><code>desktop/src/main/agent/diff.ts › soSanhDong</code></strong> — the diff the CuongThai desktop app shows before you approve an AI edit. It fills <code>bang[i][j]</code> = LCS of the <em>suffixes</em> (from the bottom-right corner, so the walk can go forward) and has a ceiling: <code>TRAN_O = 4_000_000</code> cells. Above it the function gives up and shows "everything removed, everything added", because freezing the window for seconds is the worst possible feedback. That ceiling is the n·m cost of this lesson turned into a product decision.</li>
<li><strong><code>src/services/work/collabRules.ts › lcsPairs</code></strong> — CT Work Docs merges a server-side edit (for example one written by the assistant) into a page someone may be typing in: LCS on the page's blocks finds what is unchanged, so only the changed stretches are applied (a three-way merge). It stores rows as <code>Uint32Array</code> to keep the table compact.</li>
<li><strong><code>src/services/ctlanguage/thiNoiThuan.ts › doKhopNhacLai</code></strong> — the "repeat after me" speaking exercise scores <code>2·LCS / (|said| + |original|)</code> on normalised letters, with the two-row trick. Saying extra words grows the denominator, so it is penalised too.</li>
<li><strong><code>src/services/makerlab/kiemTuAnh.ts › chamCauAnh</code></strong> — compares the sentence a speaker read with what Whisper heard, word by word, with LCS "so that one word missed in the middle does not shift the whole second half" (a position-by-position comparison would mark everything after the gap as wrong).</li>
</ul>
<p>What about <code>git diff</code>? Be precise: Git's default is <strong>Myers' algorithm</strong> (1986), which solves the same problem — fewest insertions and deletions, which is the same as the longest common subsequence — in O((n + m)·D) time, where D is the number of differences. It never builds the n × m table, so a 10,000-line file with three changed lines is almost instant. On our six-line example both give the same answer:</p>
</div>
<div class="ml-vi">
<h3>LCS trong hệ thống thật: mọi bản diff bạn từng đọc</h3>
<p>Diff theo dòng chính là LCS trên <em>dòng</em> thay vì chữ cái: dòng nằm trong dãy chung thì giữ, dòng chỉ có ở bản cũ thì bỏ (−), dòng chỉ có ở bản mới thì thêm (+). Repo này có bốn chỗ tự viết đúng việc đó:</p>
<ul>
<li><strong><code>desktop/src/main/agent/diff.ts › soSanhDong</code></strong> — bản diff app desktop CuongThai hiện ra trước khi bạn bấm duyệt một lần sửa của AI. Nó điền <code>bang[i][j]</code> = LCS của các <em>hậu tố</em> (từ góc dưới phải, để phép đi có thể đi xuôi) và có TRẦN: <code>TRAN_O = 4_000_000</code> ô. Vượt trần thì hàm bỏ cuộc và hiện "bỏ hết, thêm hết", vì đứng hình cửa sổ vài giây là phản hồi tệ nhất có thể. Cái trần đó chính là chi phí n·m của bài này biến thành một quyết định sản phẩm.</li>
<li><strong><code>src/services/work/collabRules.ts › lcsPairs</code></strong> — CT Work Docs gộp một lần sửa phía máy chủ (ví dụ do trợ lý viết) vào trang mà người khác có thể đang gõ: LCS trên các khối của trang tìm ra phần không đổi, để chỉ áp những đoạn thật sự thay đổi (gộp ba chiều — three-way merge). Nó lưu các hàng bằng <code>Uint32Array</code> cho bảng gọn.</li>
<li><strong><code>src/services/ctlanguage/thiNoiThuan.ts › doKhopNhacLai</code></strong> — bài luyện nói "nhắc lại theo mẫu" chấm <code>2·LCS / (|câu nói| + |câu gốc|)</code> trên chữ đã chuẩn hoá, dùng đúng mẹo hai hàng. Nói thừa chữ làm mẫu số lớn lên, nên cũng bị trừ điểm.</li>
<li><strong><code>src/services/makerlab/kiemTuAnh.ts › chamCauAnh</code></strong> — so câu người đọc với chữ Whisper nghe ra, theo TỪ, bằng LCS "để một từ đọc sót ở giữa không kéo lệch cả nửa câu sau" (so theo vị trí thì mọi từ sau chỗ hụt đều bị chấm sai).</li>
</ul>
<p>Còn <code>git diff</code>? Nói cho chính xác: mặc định Git dùng <strong>thuật toán Myers</strong> (1986), giải đúng bài toán này — ít phép thêm/bỏ nhất, tương đương dãy chung dài nhất — trong O((n + m)·D), với D là số chỗ khác nhau. Nó không bao giờ dựng cả bảng n × m, nên tệp 10.000 dòng mà chỉ sửa ba dòng thì gần như tức thì. Trên ví dụ sáu dòng của ta, hai cách cho cùng đáp án:</p>
</div>
${ma(R + 'git-diff.ts', { vung: 'lcs-diff', nhan: 'TypeScript — diff from an LCS table (the shape of diff.ts)' })}
${ketQua(R + 'git-diff.ts')}
<div class="ml-en">
<p>Four kept lines = LCS length 4, the same number as our table. In an interview, "LCS is the textbook model of diff; production tools use Myers because real diffs are small" is a strong one-liner.</p>
</div>
<div class="ml-vi">
<p>Bốn dòng được giữ = LCS dài 4, đúng con số trong bảng của ta. Khi phỏng vấn, câu "LCS là mô hình sách giáo khoa của diff; công cụ thật dùng Myers vì phần khác nhau thường nhỏ" là một câu ăn điểm.</p>
</div>

<div class="ml-en">
<h3>Main problem 2: Edit Distance</h3>
<p><strong>Problem (in our words).</strong> You may <em>insert</em> a character, <em>delete</em> a character or <em>replace</em> one character by another; each costs 1. What is the fewest number of edits that turns word <code>a</code> into word <code>b</code>? <code>horse → ros</code> takes 3: replace h by r (<code>rorse</code>), delete r (<code>rose</code>), delete e (<code>ros</code>). This number is the <strong>Levenshtein distance</strong>.</p>
<p><strong>Brute force.</strong> Look at the last characters. If they are equal, they cost nothing: solve the two shorter words. If not, try all three edits on the last position and keep the cheapest — three recursive calls each time, so the recursion tree has up to 3 branches per level. We will measure how bad that is.</p>
<p><strong>The four questions.</strong> <em>State:</em> <code>dp[i][j]</code> = fewest edits turning the first i letters of a into the first j letters of b. <em>Transition:</em> if <code>a[i−1] == b[j−1]</code>, <code>dp[i][j] = dp[i−1][j−1]</code>. Otherwise <code>1 + min(</code> <code>dp[i−1][j−1]</code> (replace: both last letters are now dealt with — <strong>diagonal</strong>), <code>dp[i−1][j]</code> (delete <code>a[i−1]</code> — <strong>up</strong>), <code>dp[i][j−1]</code> (insert <code>b[j−1]</code> at the end — <strong>left</strong>) <code>)</code>. <em>Base:</em> <code>dp[i][0] = i</code> (delete everything), <code>dp[0][j] = j</code> (insert everything) — <strong>not</strong> zeros, unlike LCS. <em>Order:</em> rows top to bottom, columns left to right; answer <code>dp[n][m]</code>.</p>
</div>
<div class="ml-vi">
<h3>Đề chính 2: Edit Distance (khoảng cách sửa)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn được <em>chèn</em> một ký tự, <em>xoá</em> một ký tự hoặc <em>thay</em> một ký tự bằng ký tự khác; mỗi phép tốn 1. Cần ít nhất bao nhiêu phép để biến từ <code>a</code> thành từ <code>b</code>? <code>horse → ros</code> cần 3: thay h bằng r (<code>rorse</code>), xoá r (<code>rose</code>), xoá e (<code>ros</code>). Con số này gọi là <strong>khoảng cách Levenshtein</strong>.</p>
<p><strong>Vét cạn.</strong> Nhìn chữ cuối. Nếu bằng nhau thì không tốn gì: giải tiếp hai từ ngắn hơn. Nếu khác, thử cả ba phép sửa ở vị trí cuối rồi giữ cái rẻ nhất — mỗi lần ba lời gọi đệ quy, nên cây đệ quy có tới 3 nhánh mỗi tầng. Lát nữa ta sẽ ĐO nó tệ tới mức nào.</p>
<p><strong>Bốn câu hỏi.</strong> <em>Trạng thái:</em> <code>dp[i][j]</code> = số phép sửa ít nhất biến i chữ đầu của a thành j chữ đầu của b. <em>Chuyển:</em> nếu <code>a[i−1] == b[j−1]</code> thì <code>dp[i][j] = dp[i−1][j−1]</code>. Ngược lại <code>1 + min(</code> <code>dp[i−1][j−1]</code> (thay: cả hai chữ cuối đã xử lý xong — ô <strong>chéo</strong>), <code>dp[i−1][j]</code> (xoá <code>a[i−1]</code> — ô <strong>trên</strong>), <code>dp[i][j−1]</code> (chèn <code>b[j−1]</code> vào cuối — ô <strong>trái</strong>) <code>)</code>. <em>Cơ sở:</em> <code>dp[i][0] = i</code> (xoá hết), <code>dp[0][j] = j</code> (chèn hết) — <strong>không</strong> phải số 0 như LCS. <em>Thứ tự:</em> hàng trên xuống, cột trái sang; đáp án <code>dp[n][m]</code>.</p>
<p>Mẹo nhớ ba ô: đứng ở ô (i, j), đi <strong>chéo</strong> là "cả hai chuỗi cùng lùi một chữ" (khớp hoặc thay), đi <strong>lên</strong> là "chỉ chuỗi a lùi" (a mất một chữ = xoá), đi <strong>trái</strong> là "chỉ chuỗi b lùi" (b có thêm một chữ mà a không có = chèn).</p>
</div>
${maHai(R + 'edit-distance.ts', R + 'HcEditDistance.java', { vung: 'bang' })}
${ketQua(R + 'edit-distance.ts')}
${ketQua(R + 'HcEditDistance.java')}
<div class="ml-en">
<p>The table for <code>horse → ros</code>, from the run. Row 0 and column 0 are the base (0, 1, 2, 3 and 0…5). The walk back from the corner is drawn on it: light green = a free diagonal step (letters equal, "keep"), dark green = a step that costs 1. The trace below the table lists the same walk from the start: it is exactly the list of edits.</p>
</div>
<div class="ml-vi">
<p>Bảng của <code>horse → ros</code>, lấy từ lần chạy. Hàng 0 và cột 0 là cơ sở (0, 1, 2, 3 và 0…5). Đường đi ngược từ góc được vẽ lên bảng: xanh nhạt = bước chéo miễn phí (chữ bằng nhau, "giữ"), xanh đậm = bước tốn 1. Bảng vết bên dưới liệt kê đúng con đường đó tính từ điểm xuất phát: nó chính là danh sách phép sửa.</p>
</div>
${BANG_EDIT}
${VET_EDIT}
<div class="ml-en">
<p>Read it: replace h→r, keep o, delete r, keep s, delete e — three paid steps, and the corner says 3. The program's own <code>editScript</code> prints the same list (<code>["replace h->r at 0","delete r at 2","delete e at 4"]</code>, positions in the original word). Notice <code>Bgu → Bug</code> = 2 in the output: plain Levenshtein needs two replacements to fix a swap of two neighbours. Keep that in mind for the "Did you mean" section.</p>
</div>
<div class="ml-vi">
<p>Đọc bảng: thay h→r, giữ o, xoá r, giữ s, xoá e — ba bước trả phí, và ô góc nói 3. Hàm <code>editScript</code> của chương trình in đúng danh sách ấy (<code>["replace h->r at 0","delete r at 2","delete e at 4"]</code>, vị trí tính trên từ gốc). Để ý <code>Bgu → Bug</code> = 2 trong output: Levenshtein thuần cần hai phép thay để sửa một lần gõ đảo hai chữ cạnh nhau. Nhớ điều này cho mục "Did you mean" bên dưới.</p>
</div>
${ma(R + 'edit-distance.ts', { vung: 'cac-phep', nhan: 'TypeScript — follow-up: return the edits' })}
${maHai(R + 'edit-distance.ts', R + 'HcEditDistance.java', { vung: 'hai-hang' })}
<div class="ml-en">
<p>The two-row version has one detail that LCS did not: column 0 is not zero. <code>cur[0] = i</code> must be set at the start of every row, otherwise row i starts from a stale value of row i−2 — the answer comes out wrong only for some inputs, which is the worst kind of bug.</p>

<h3>Measured: plain recursion vs memo vs table</h3>
<p>The same recurrence, three implementations. Plain recursion is run on its worst case — the two words share no letter, so every call branches three ways until one word is empty. The program also counts the calls.</p>
</div>
<div class="ml-vi">
<p>Bản hai hàng có một chi tiết mà LCS không có: cột 0 không phải số 0. Phải gán <code>cur[0] = i</code> ở đầu MỖI hàng, không thì hàng i khởi đầu bằng một giá trị cũ của hàng i−2 — đáp án chỉ sai với một số đầu vào, đúng kiểu lỗi tệ nhất.</p>

<h3>Đo thật: đệ quy thuần vs nhớ vs bảng</h3>
<p>Cùng một công thức truy hồi, ba cách cài đặt. Đệ quy thuần chạy trên trường hợp xấu nhất của nó — hai từ không chung chữ nào, nên mọi lời gọi đều rẽ ba nhánh cho tới khi một từ rỗng. Chương trình đếm luôn số lời gọi.</p>
</div>
${ma(R + 'edit-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua(R + 'edit-do.ts')}
${ketQua(R + 'HcEditDo.java')}
<div class="ml-en">
<p>Read it like lesson 1.1. Each extra letter on <em>both</em> words multiplies the calls by about <strong>5.6</strong> (12,146,179 → 67,570,078 → 377,393,953 → 2,114,900,428). People often quote O(3^(n+m)) for this recursion; that is a loose upper bound — the measured growth tends to 3 + 2√2 ≈ 5.83 per letter on each word, the growth rate of the Delannoy numbers that count exactly these paths. Java's time follows the calls cleanly (113.9 → 649.7 → 3,641 ms, ×5.6 each step). Node's last step is ×10 rather than ×5.6; in a scratch run, the call counter itself passing V8's small-integer range slowed the same function by about 1.5×, which explains part of it — another reason to trust the <em>counted calls</em> for the shape and the Java column for the timing. At n = 14 the recursion would make 11,885,772,379 calls, so it was not run.</p>
<p>The table does n·m cells and nothing else: 25 million cells for two 5,000-letter strings in 118.5 ms (Node) and 83.2 ms (Java), while the plain recursion needs 22.8 seconds in Node for two 13-letter words. Memo is the same O(n·m) but 3–6× slower than the table here (function calls, a recursion that can go n + m levels deep); it survived 5,000 letters this time, but it is the version that could hit the stack limit you measured in lesson 5.2. When you can see the order of computation, write the table.</p>
</div>
<div class="ml-vi">
<p>Đọc như bài 1.1. Mỗi chữ thêm vào <em>cả hai</em> từ làm số lời gọi nhân khoảng <strong>5,6</strong> lần (12.146.179 → 67.570.078 → 377.393.953 → 2.114.900.428). Người ta hay nói đệ quy này là O(3^(n+m)); đó là chặn trên lỏng — tốc độ tăng đo được tiến dần tới 3 + 2√2 ≈ 5,83 mỗi chữ ở mỗi từ, chính là tốc độ tăng của số Delannoy (dãy số đếm đúng những con đường này). Thời gian Java bám đúng số lời gọi (113,9 → 649,7 → 3.641 ms, mỗi bước ×5,6). Bước cuối của Node là ×10 thay vì ×5,6; trong một lần chạy nháp, riêng việc biến đếm lời gọi vượt khỏi vùng số nguyên nhỏ của V8 đã làm cùng hàm đó chậm khoảng 1,5 lần, giải thích được một phần — thêm một lý do để tin <em>số lời gọi đếm được</em> khi nói về hình dạng, và tin cột Java khi nói về thời gian. Ở n = 14 đệ quy sẽ gọi 11.885.772.379 lần, nên không chạy.</p>
<p>Bảng chỉ làm n·m ô và không gì khác: 25 triệu ô cho hai chuỗi 5.000 chữ trong 118,5 ms (Node) và 83,2 ms (Java), trong khi đệ quy thuần cần 22,8 giây trên Node cho hai từ 13 chữ. Bản nhớ (memo) cũng O(n·m) nhưng chậm hơn bảng 3–6 lần ở đây (chi phí lời gọi hàm, đệ quy có thể sâu tới n + m tầng); lần này nó sống sót ở 5.000 chữ, nhưng nó là bản có thể đụng giới hạn ngăn xếp mà bạn đã đo ở <a href="${baiNay('dsa-5-2-de-quy')}">bài 5.2</a>. Khi đã nhìn ra thứ tự tính, hãy viết bảng.</p>
</div>

<div class="ml-en">
<h3>Edit distance in real systems: "Did you mean …?"</h3>
<p>Spelling suggestions are edit distance plus a threshold: among the words you know, suggest the closest one if it is close enough. CT Work's search language (JQL) does exactly this in <strong><code>src/services/work/jql.ts</code></strong>: <code>levenshtein()</code> fills the same table as above plus one extra rule — swapping two neighbouring letters counts as 1 edit (the "optimal string alignment" variant of Damerau–Levenshtein), so <code>Bgu</code> is one edit from <code>Bug</code> instead of two. Then <code>suggest()</code> lets a prefix win first (you are still typing <code>In Prog</code>), and otherwise accepts a distance ≤ 2 — but only ≤ 1 when one of the words has 3 letters or fewer, because 2 edits on a 3-letter word can turn it into almost anything. A self-contained copy, run on field names:</p>
</div>
<div class="ml-vi">
<h3>Khoảng cách sửa trong hệ thống thật: "Did you mean …?"</h3>
<p>Gợi ý sửa chính tả là khoảng cách sửa cộng một ngưỡng: trong các từ đã biết, gợi ý từ gần nhất nếu nó đủ gần. Ngôn ngữ tìm kiếm của CT Work (JQL) làm đúng như vậy ở <strong><code>src/services/work/jql.ts</code></strong>: <code>levenshtein()</code> điền đúng cái bảng phía trên, thêm một luật — đảo hai chữ cạnh nhau tính là 1 phép sửa (biến thể "optimal string alignment" của Damerau–Levenshtein), nên <code>Bgu</code> chỉ cách <code>Bug</code> một phép thay vì hai. Rồi <code>suggest()</code> cho tiền tố thắng trước (bạn đang gõ dở <code>In Prog</code>), còn không thì nhận khoảng cách ≤ 2 — nhưng chỉ ≤ 1 khi một trong hai từ dài 3 chữ trở xuống, vì 2 phép sửa trên một từ 3 chữ biến nó thành gần như bất cứ thứ gì. Một bản chép độc lập, chạy trên tên trường:</p>
</div>
${ma(R + 'goi-y.ts', { vung: 'suggest', nhan: 'TypeScript — the suggest() rule of jql.ts' })}
${ketQua(R + 'goi-y.ts')}
<div class="ml-en">
<p><code>stauts</code> is 2 by plain Levenshtein but 1 with swaps, so a typo that real fingers make often is caught. <code>tip</code> is 2 edits from <code>type</code>: allowed for long words, refused here by the short-word rule — without it, every three-letter typo would "mean" something. A second, smaller copy lives in <strong><code>src/services/makerlab/danhThuc.ts › khoangCachSua</code></strong>: the two-row version, used to detect that speech recognition <em>almost</em> heard the robot's wake word (distance ≤ 2 for names of 4+ letters). Its comments are a lesson in themselves: a near miss is only <em>logged</em> (so the list of accepted spellings can grow from real data), it never wakes the robot; and the exact-match rules refuse to accept a name with a letter <em>missing</em>, because the clipped name "odi" sounds like an everyday Vietnamese phrase ("uh, go") that people say all day.</p>
</div>
<div class="ml-vi">
<p><code>stauts</code> cách 2 theo Levenshtein thuần nhưng cách 1 khi tính đảo chữ, nên một lỗi gõ mà ngón tay thật hay mắc được bắt. <code>tip</code> cách <code>type</code> 2 phép: từ dài thì được chấp nhận, ở đây bị luật từ ngắn từ chối — không có luật đó, mọi lỗi gõ ba chữ đều "có nghĩa là" một thứ gì đó. Một bản nhỏ hơn nằm ở <strong><code>src/services/makerlab/danhThuc.ts › khoangCachSua</code></strong>: bản hai hàng, dùng để phát hiện bộ nhận dạng giọng nói <em>suýt</em> nghe đúng tên đánh thức robot (khoảng cách ≤ 2 với tên từ 4 chữ trở lên). Chú thích của nó là cả một bài học: "suýt trúng" chỉ được <em>ghi log</em> (để danh sách cách viết được chấp nhận lớn lên bằng dữ liệu thật), không bao giờ đánh thức robot; và các luật khớp chính xác từ chối tên bị <em>hụt</em> một chữ, vì tên hụt "odi" nghe như "ờ đi" — câu nói thật, nói suốt ngày.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: fuzzy matching as an oracle, and n·m as a weapon</h3>
<p><strong>User enumeration.</strong> The last two lines of the output above are a login form that "helpfully" suggests among <em>all</em> accounts: type <code>cuonghoag</code> and it answers "Did you mean cuonghoang?". An attacker who types guesses learns which usernames exist — the first step of password spraying and phishing. The same leak hides in "forgot password" forms and in search boxes that suggest names of people you are not allowed to see. The rule: <strong>the candidate list must be exactly what the caller is already allowed to see</strong>. <code>jql.ts</code> follows it: the "No member" error suggests only from <code>ctx.members</code>, the members of the project the caller is querying, whom they can already see in the people picker. On a login form, the only safe suggestion is none, and the error message is the same whether the account exists or not.</p>
<p><strong>Quadratic inputs.</strong> An O(n·m) table on attacker-controlled strings is an O(n²) endpoint. Two 100,000-character fields are 10¹⁰ cells — seconds of CPU and, at 4 bytes per cell, 40 GB if you keep the whole table. That is why <code>diff.ts</code> has <code>TRAN_O</code>, why the speaking scorer works on short sentences, and why any server endpoint that compares texts needs a length limit <em>before</em> the DP (and the two-row version when the length is legitimately large).</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: so khớp gần đúng thành "nhà tiên tri", và n·m thành vũ khí</h3>
<p><strong>Dò tên tài khoản (user enumeration).</strong> Hai dòng cuối của output ở trên là một form đăng nhập "tốt bụng" gợi ý trong <em>mọi</em> tài khoản: gõ <code>cuonghoag</code> thì nó đáp "Did you mean cuonghoang?". Kẻ tấn công gõ thử vài tên là biết tên đăng nhập nào tồn tại — bước đầu của tấn công rải mật khẩu (password spraying) và lừa đảo. Cùng lỗ rò đó trốn trong form "quên mật khẩu" và trong ô tìm kiếm gợi ý tên người mà bạn không được phép thấy. Quy tắc: <strong>danh sách ứng viên phải đúng bằng những gì người gọi ĐÃ được phép thấy</strong>. <code>jql.ts</code> làm đúng như vậy: lỗi "No member" chỉ gợi ý trong <code>ctx.members</code>, các thành viên của chính dự án người gọi đang truy vấn, những người họ vốn đã thấy trong ô chọn người. Ở form đăng nhập, gợi ý an toàn duy nhất là không gợi ý, và thông báo lỗi phải giống hệt nhau dù tài khoản có tồn tại hay không.</p>
<p><strong>Đầu vào bậc hai.</strong> Một bảng O(n·m) trên chuỗi do kẻ tấn công điều khiển là một endpoint O(n²). Hai trường 100.000 ký tự là 10¹⁰ ô — hàng giây CPU, và 4 byte mỗi ô thì 40 GB nếu giữ cả bảng. Đó là lý do <code>diff.ts</code> có <code>TRAN_O</code>, bộ chấm luyện nói chỉ làm trên câu ngắn, và mọi endpoint máy chủ so sánh văn bản đều cần giới hạn độ dài <em>trước</em> khi chạy DP (và dùng bản hai hàng khi độ dài lớn là hợp lệ).</p>
</div>

<div class="ml-en">
<h3>Main problem 3: 0/1 knapsack, then Partition Equal Subset Sum</h3>
<p><strong>The classic.</strong> Items with weights <code>w</code> and values <code>v</code>, a bag of capacity W; each item is taken <em>at most once</em> (that is the "0/1"). Maximise the total value. Our example: weights [1, 3, 4, 5], values [1, 4, 5, 7], W = 7.</p>
<p><strong>Why not greedy?</strong> The tempting shortcut is "best value per kilogram first". Item 3 (7 per 5 kg = 1.4) goes in first, then only item 0 fits: 7 + 1 = 8. The table below finds 9 (items 1 and 2: 3 + 4 kg, value 4 + 5). Greedy is not wrong because it is lazy; it is wrong because taking item 3 changes which items can still fit. That interaction is what the second dimension — capacity — keeps track of. (When greedy <em>is</em> right, and how to prove it, is lesson 9.5.)</p>
<p><strong>The four questions.</strong> <em>State:</em> <code>dp[i][c]</code> = the best value using only the first i items with capacity c. <em>Transition:</em> about item i−1 there are two choices — skip it: <code>dp[i−1][c]</code>; take it (if it fits): <code>dp[i−1][c − w[i−1]] + v[i−1]</code>. Both read row <strong>i−1</strong>, the row <em>without</em> item i−1: that is what guarantees "at most once". <em>Base:</em> row 0 (no items) is all 0. <em>Order:</em> item by item, any order of capacities. Answer: <code>dp[n][W]</code>.</p>
</div>
<div class="ml-vi">
<h3>Đề chính 3: cái túi 0/1, rồi Partition Equal Subset Sum</h3>
<p><strong>Bài kinh điển.</strong> Các món đồ có khối lượng <code>w</code> và giá trị <code>v</code>, một cái túi sức chứa W; mỗi món lấy <em>tối đa một lần</em> (đó là chữ "0/1": lấy 0 hoặc 1 lần). Tối đa hoá tổng giá trị. Ví dụ của ta: khối lượng [1, 3, 4, 5], giá trị [1, 4, 5, 7], W = 7.</p>
<p><strong>Sao không tham lam?</strong> Lối tắt hấp dẫn là "món nào đáng tiền nhất trên mỗi kg thì lấy trước". Món 3 (7 trên 5 kg = 1,4) vào trước, rồi chỉ còn món 0 vừa: 7 + 1 = 8. Bảng bên dưới tìm ra 9 (món 1 và món 2: 3 + 4 kg, giá trị 4 + 5). Tham lam sai không phải vì lười; nó sai vì lấy món 3 làm thay đổi việc những món nào còn nhét vừa. Chính sự ràng buộc qua lại đó là thứ chiều thứ hai — sức chứa — theo dõi. (Khi nào tham lam ĐÚNG, và chứng minh thế nào, là chuyện của <a href="${baiNay('dsa-9-5-greedy')}">bài 9.5</a>.)</p>
<p><strong>Bốn câu hỏi.</strong> <em>Trạng thái:</em> <code>dp[i][c]</code> = giá trị tốt nhất khi chỉ dùng i món đầu với sức chứa c. <em>Chuyển:</em> với món i−1 có hai lựa chọn — bỏ qua: <code>dp[i−1][c]</code>; lấy (nếu vừa): <code>dp[i−1][c − w[i−1]] + v[i−1]</code>. Cả hai đều đọc hàng <strong>i−1</strong>, tức hàng CHƯA có món i−1: chính điều đó đảm bảo "tối đa một lần". <em>Cơ sở:</em> hàng 0 (chưa có món nào) toàn 0. <em>Thứ tự:</em> từng món một, sức chứa theo thứ tự nào cũng được. Đáp án: <code>dp[n][W]</code>.</p>
</div>
${maHai(R + 'knapsack.ts', R + 'HcKnapsack.java', { vung: 'bang' })}
${ma(R + 'knapsack.ts', { vung: 'ty-le', nhan: 'TypeScript — the greedy shortcut, for comparison' })}
${ketQua(R + 'knapsack.ts')}
<div class="ml-en">
<p>The table from the run. Light green = cells where taking the new item beat skipping it. Dark green = the walk back from <code>dp[4][7]</code>: in row 4 the value equals the row above (item 3 skipped), in row 3 it jumped (item 2 taken, capacity 7 − 4 = 3), in row 2 it jumped again (item 1 taken, capacity 3 − 3 = 0). Chosen: items ${K.chon.join(' and ')}.</p>
</div>
<div class="ml-vi">
<p>Bảng lấy từ lần chạy. Xanh nhạt = ô mà lấy món mới thắng bỏ qua. Xanh đậm = đường đi ngược từ <code>dp[4][7]</code>: ở hàng 4 giá trị bằng hàng trên (bỏ món 3), ở hàng 3 nó nhảy lên (lấy món 2, sức chứa còn 7 − 4 = 3), ở hàng 2 lại nhảy (lấy món 1, sức chứa còn 3 − 3 = 0). Kết quả chọn: món ${K.chon.join(' và ')}.</p>
${csd('csd201-cs4-on', 'vi', 'CS.4 — Bài tập quy hoạch động 2 chiều', '<p>Bộ bài tập CS.4 có cái túi và tổng tập con ở dạng bài nộp. <strong>Ở đây thêm:</strong> phản ví dụ tham lam chạy thật (8 so với 9), và cái bẫy chiều vòng lặp khi nén một hàng — chạy thật cho thấy test mẫu KHÔNG bắt được nó.</p>')}
</div>
${BANG_KNAP}
<div class="ml-en">
<p><strong>One row, and the direction of the loop.</strong> Row i reads only row i−1, so one array is enough — if the inner loop goes <strong>down</strong> from W to <code>w[k]</code>. Going down, <code>dp[c − w[k]]</code> (a smaller index) has not been updated yet in this round: it still means "without item k". Going <em>up</em>, it has already been updated, so it may already include item k — and item k gets taken twice. That is a different problem (the <em>unbounded</em> knapsack, used for coin change in lesson 9.2), solved by accident.</p>
</div>
<div class="ml-vi">
<p><strong>Một hàng, và chiều của vòng lặp.</strong> Hàng i chỉ đọc hàng i−1, nên một mảng là đủ — nếu vòng trong chạy <strong>ngược</strong> từ W xuống <code>w[k]</code>. Chạy ngược thì <code>dp[c − w[k]]</code> (chỉ số nhỏ hơn) chưa bị cập nhật trong lượt này: nó vẫn mang nghĩa "chưa có món k". Chạy <em>xuôi</em> thì nó đã được cập nhật rồi, có thể đã chứa món k — và món k bị lấy hai lần. Đó là một bài khác (cái túi <em>không giới hạn</em> — unbounded knapsack, dùng cho đổi tiền ở bài 9.2), vô tình bị giải thay.</p>
</div>
${maHai(R + 'knapsack.ts', R + 'HcKnapsack.java', { vung: 'mot-hang' })}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap: the inner loop of a 0/1 knapsack going UP — and the sample test does not catch it.</strong></p><p>Look at the output again. On our main example the wrong version prints 9, the correct answer, by luck (reusing items happens not to help there). With a single item of weight 3 and value 4 and W = 7, it prints 8: the item was taken twice. On LC 416 below, <code>[1, 2, 5]</code> has no equal split, yet the UP version says true (it used 2 twice to make 4). A bug that passes the example is exactly the bug that fails the hidden tests — always run one tiny case designed to break your direction.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy: vòng trong của cái túi 0/1 chạy XUÔI — và test mẫu không bắt được.</strong></p><p>Nhìn lại output. Trên ví dụ chính, bản sai in 9, đúng đáp án, do may mắn (dùng lại món không giúp gì ở đó). Với một món khối lượng 3, giá trị 4 và W = 7, nó in 8: món bị lấy hai lần. Ở LC 416 bên dưới, <code>[1, 2, 5]</code> không chia đôi được, vậy mà bản XUÔI nói true (nó dùng số 2 hai lần để ra 4). Lỗi qua được ví dụ mẫu chính là lỗi trượt các test ẩn — luôn chạy một ca tí hon được thiết kế để làm gãy chiều vòng lặp của bạn.</p></div>
</div>
${ma(R + 'knapsack.ts', { vung: 'sai', nhan: 'TypeScript — wrong: c goes up' })}
<div class="ml-en">
<p><strong>LC 416 Partition Equal Subset Sum.</strong> Can the array be split into two groups with equal sums? If the total is odd, no. Otherwise the question is "is there a subset with sum = total / 2?" — a knapsack where every item's "value" is irrelevant and the cell is a boolean: <code>can[s]</code> = some subset of the numbers seen so far sums to exactly s. Base <code>can[0] = true</code> (the empty subset). Same downward loop. O(n · total/2) time, O(total/2) memory; with n ≤ 200 and values ≤ 100 that is at most 200 × 10,000 = 2 million steps.</p>
</div>
<div class="ml-vi">
<p><strong>LC 416 Partition Equal Subset Sum.</strong> Mảng có chia được thành hai nhóm có tổng bằng nhau không? Tổng lẻ thì không. Còn lại câu hỏi thành "có tập con nào tổng = tổng / 2 không?" — một cái túi mà "giá trị" của món không quan trọng và mỗi ô là đúng/sai: <code>can[s]</code> = có một tập con của các số đã xét có tổng đúng bằng s. Cơ sở <code>can[0] = true</code> (tập rỗng). Cùng vòng chạy ngược. Thời gian O(n · tổng/2), bộ nhớ O(tổng/2); với n ≤ 200 và giá trị ≤ 100 là tối đa 200 × 10.000 = 2 triệu bước.</p>
</div>
${maHai(R + 'knapsack.ts', R + 'HcKnapsack.java', { vung: 'lc416' })}

<div class="ml-en">
<h3>Knapsack at work: planning a sprint</h3>
<p>A sprint is a knapsack: the team can do about 20 story points (the capacity), each backlog issue has an estimate (the weight). CT Work's "plan this sprint" feature (<strong><code>src/services/work/ai.service.ts › planSprint</code></strong>) does <em>not</em> run a knapsack. It walks the backlog in rank order — the product owner's priority — and takes an issue unless it would overflow: <code>if (total + pts &gt; target) continue;</code>. Run both rules on a made-up backlog:</p>
</div>
<div class="ml-vi">
<h3>Cái túi ở chỗ làm: lập kế hoạch sprint</h3>
<p>Một sprint là một cái túi: nhóm làm được khoảng 20 điểm (sức chứa), mỗi việc trong backlog có ước lượng điểm (khối lượng). Tính năng "lập kế hoạch sprint" của CT Work (<strong><code>src/services/work/ai.service.ts › planSprint</code></strong>) KHÔNG chạy cái túi. Nó đi qua backlog theo thứ tự rank — mức ưu tiên do product owner xếp — và lấy một việc trừ khi việc đó làm tràn: <code>if (total + pts &gt; target) continue;</code>. Chạy cả hai luật trên một backlog giả:</p>
</div>
${ma(R + 'sprint.ts', { vung: 'tham-lam', nhan: 'TypeScript — the planSprint rule' })}
${ketQua(R + 'sprint.ts', { lenh: '$ npx tsx sprint.ts' })}
<div class="ml-en">
<p>The knapsack fills the sprint perfectly (20 points) — by dropping CT-1 and CT-2, the two most important issues. The rank-order rule wastes one point and keeps the priorities. Here the "worse" algorithm is the right product: estimates are rough (an 8 is "about a week", not 8.0), so one point of fill is noise, while shipping the login fix is not. If a value per issue existed (business value, not just size), a knapsack on <em>value</em> with points as weight would be the honest model — and it would still be presented as a suggestion, as <code>planSprint</code> is. Saying "the textbook optimum optimises the wrong objective here" is the kind of judgement interviewers remember.</p>
</div>
<div class="ml-vi">
<p>Cái túi lấp đầy sprint hoàn hảo (20 điểm) — bằng cách bỏ CT-1 và CT-2, hai việc quan trọng nhất. Luật theo thứ tự rank phí một điểm nhưng giữ đúng ưu tiên. Ở đây thuật toán "kém hơn" lại là sản phẩm đúng: ước lượng vốn thô (8 điểm là "khoảng một tuần", không phải 8,0), nên lấp thêm một điểm chỉ là nhiễu, còn sửa lỗi đăng nhập thì không. Nếu mỗi việc có một giá trị (giá trị kinh doanh, không chỉ độ lớn), cái túi trên <em>giá trị</em> với điểm làm khối lượng mới là mô hình trung thực — và kết quả vẫn chỉ nên là gợi ý, như <code>planSprint</code> đang làm. Câu "lời giải tối ưu sách giáo khoa đang tối ưu sai mục tiêu" là kiểu nhận định mà người phỏng vấn nhớ lâu.</p>
</div>

<div class="ml-en">
<h3>When the order is diagonal: Longest Palindromic Substring</h3>
<p><strong>Problem (in our words).</strong> Return the longest <em>substring</em> (contiguous) that reads the same forwards and backwards. In <code>"cabbad"</code> it is <code>"abba"</code>.</p>
<p><strong>The four questions.</strong> <em>State:</em> <code>is[i][j]</code> = the substring from index i to index j (both included) is a palindrome. <em>Transition:</em> <code>s[i] == s[j]</code> <strong>and</strong> the inside <code>is[i+1][j−1]</code> is a palindrome. <em>Base:</em> length 1 is always a palindrome; length 2 is one exactly when the two letters are equal (the "inside" is empty). <em>Order:</em> here is the new part. <code>is[i][j]</code> reads <code>is[i+1][j−1]</code> — the cell one row <em>below</em> and one column to the left. Row by row from the top would read a row that is not computed yet. The cell it reads is always a <strong>shorter</strong> substring, so the safe order is <strong>by length</strong>: all substrings of length 1, then 2, then 3… — the table fills diagonal by diagonal. (Going rows from bottom to top also works; say whichever you can justify.)</p>
</div>
<div class="ml-vi">
<h3>Khi thứ tự là đường chéo: Longest Palindromic Substring</h3>
<p><strong>Đề (diễn đạt lại).</strong> Trả về <em>xâu con</em> (liền mạch) dài nhất đọc xuôi hay ngược đều như nhau. Trong <code>"cabbad"</code> đó là <code>"abba"</code>.</p>
<p><strong>Bốn câu hỏi.</strong> <em>Trạng thái:</em> <code>is[i][j]</code> = xâu con từ chỉ số i tới chỉ số j (tính cả hai đầu) là xâu đối xứng. <em>Chuyển:</em> <code>s[i] == s[j]</code> <strong>và</strong> phần bên trong <code>is[i+1][j−1]</code> đối xứng. <em>Cơ sở:</em> dài 1 luôn đối xứng; dài 2 đối xứng đúng khi hai chữ bằng nhau ("bên trong" rỗng). <em>Thứ tự:</em> đây là phần mới. <code>is[i][j]</code> đọc <code>is[i+1][j−1]</code> — ô ở hàng <em>dưới</em> một và cột trái một. Đi hàng từ trên xuống sẽ đọc phải một hàng chưa tính. Ô nó đọc luôn là một xâu <strong>ngắn hơn</strong>, nên thứ tự an toàn là <strong>theo độ dài</strong>: mọi xâu dài 1, rồi dài 2, rồi dài 3… — bảng được điền theo từng đường chéo. (Đi hàng từ dưới lên cũng đúng; nói cách nào bạn giải thích được.)</p>
${csd('csd201-slide-cs4-2', 'vi', 'CS.4 — Quy hoạch động (4): lưới, xâu đối xứng, DP khoảng', '<p>Slide CS.4 phần 2 có bảng xâu đối xứng và DP trên đoạn. <strong>Ở đây thêm:</strong> lập luận "ô này đọc ô nào ⇒ thứ tự tính" nói thành lời, bảng vết từng ô theo độ dài, mô phỏng tô từng đường chéo, và so với cách "nở từ tâm" O(1) bộ nhớ mà người phỏng vấn thường chờ.</p>')}
</div>
${maHai(R + 'palindrome.ts', R + 'HcPalindrome.java', { vung: 'bang' })}
${ketQua(R + 'palindrome.ts')}
<div class="ml-en">
<p>The table for <code>"cabbad"</code> (only i ≤ j is used; the dots below the diagonal are never touched). Light green = palindromes, dark green = the longest, <code>(1, 4)</code> = <code>abba</code>. Then the trace of every cell of length ≥ 3 in the order they were computed: each one reads a cell of the previous length.</p>
</div>
<div class="ml-vi">
<p>Bảng của <code>"cabbad"</code> (chỉ dùng i ≤ j; các dấu chấm dưới đường chéo không bao giờ bị đụng). Xanh nhạt = xâu đối xứng, xanh đậm = dài nhất, <code>(1, 4)</code> = <code>abba</code>. Tiếp theo là bảng vết mọi ô có độ dài ≥ 3 theo đúng thứ tự được tính: mỗi ô đọc một ô của độ dài trước đó.</p>
</div>
${BANG_PAL}
${VET_PAL}
<div class="ml-en">
<p>Ten cells, and only one of them is true: <code>(1, 4)</code>, because its ends are equal (a = a) <em>and</em> its inside <code>bb</code> was already marked true at length 2. Cell <code>(0, 5)</code> has unequal ends and is rejected without looking inside.</p>
${moPhong(R + 'palindrome.sim.js', 'en', 'Palindrome table — filled diagonal by diagonal', 'Opens /algorithms: each cell lights up the inside cell it reads, length 1, then 2, then 3…')}
<p><strong>The answer interviewers expect next.</strong> The table is O(n²) time <em>and</em> O(n²) memory. "Expand around the centre" keeps the time and drops the memory to O(1): every palindrome has a centre — a letter (odd length) or the gap between two letters (even length) — so try all 2n − 1 centres and grow outwards while the two ends match. Mention the table to show the DP, then offer the centre version.</p>
</div>
<div class="ml-vi">
<p>Mười ô, chỉ một ô đúng: <code>(1, 4)</code>, vì hai đầu bằng nhau (a = a) <em>và</em> phần trong <code>bb</code> đã được đánh dấu đúng ở độ dài 2. Ô <code>(0, 5)</code> có hai đầu khác nhau, bị loại mà không cần nhìn vào trong.</p>
${moPhong(R + 'palindrome.sim.js', 'vi', 'Bảng xâu đối xứng — điền theo từng đường chéo', 'Mở /algorithms: mỗi ô tô sáng ô bên trong mà nó đọc, độ dài 1, rồi 2, rồi 3…')}
<p><strong>Câu trả lời người phỏng vấn chờ tiếp theo.</strong> Bảng tốn O(n²) thời gian <em>và</em> O(n²) bộ nhớ. "Nở từ tâm" (expand around centre) giữ nguyên thời gian và hạ bộ nhớ xuống O(1): mọi xâu đối xứng đều có một tâm — một chữ cái (độ dài lẻ) hoặc khe giữa hai chữ (độ dài chẵn) — nên thử cả 2n − 1 tâm rồi nở ra hai phía khi hai đầu còn khớp. Nêu bảng để chứng tỏ bạn hiểu DP, rồi đề xuất bản tâm.</p>
</div>
${maHai(R + 'palindrome.ts', R + 'HcPalindrome.java', { vung: 'tam' })}

<div class="ml-en">
<h3>The off-by-one trap, run for real</h3>
<div class="pitfall co-tieu-de"><p><strong>Trap: a table of size (n+1)×(m+1) indexed like the string.</strong></p><p>The table has an extra row/column for the empty prefix, so row i talks about letter <code>a[i−1]</code>. Write <code>a[i]</code> instead and look at what TypeScript does:</p></div>
</div>
<div class="ml-vi">
<h3>Bẫy lệch một chỉ số, chạy thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: bảng (n+1)×(m+1) mà lại đánh chỉ số như chuỗi.</strong></p><p>Bảng có thêm một hàng/cột cho tiền tố rỗng, nên hàng i nói về chữ <code>a[i−1]</code>. Viết nhầm thành <code>a[i]</code> rồi xem TypeScript làm gì:</p></div>
</div>
${ma(R + 'lech-mot.ts', { vung: 'sai', nhan: 'TypeScript — wrong index' })}
${ketQua(R + 'lech-mot.ts')}
${ketQua(R + 'HcLechMot.java')}
<div class="ml-en">
<p>The first line is 3 — the right answer — so the classic example passes. Then <code>"abc"</code> vs <code>"def"</code> share nothing but the function says 1: at the last cell it compares <code>"abc"[3]</code> with <code>"def"[3]</code>, both <code>undefined</code>, and <code>undefined === undefined</code> is true. JavaScript turns an out-of-range read into a silent wrong answer; Java throws <code>StringIndexOutOfBoundsException</code> immediately. Two habits: name the table index and the string index differently in your head ("row i ↔ letter i−1"), and test with two strings that share <em>nothing</em> — the answer must be 0.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: forgetting what n·m means in memory.</strong></p><p>"n, m ≤ 10⁵" with a full <code>int[n+1][m+1]</code> is 10¹⁰ cells, 40 GB: Java throws <code>OutOfMemoryError</code> and JavaScript dies trying. If the cell reads only the previous row, keep two rows (O(m)); if you need the full table for a traceback, check that n·m fits first (≤ about 10⁷–10⁸ cells).</p></div>
</div>
<div class="ml-vi">
<p>Dòng đầu là 3 — đúng đáp án — nên ví dụ kinh điển qua. Rồi <code>"abc"</code> với <code>"def"</code> không chung gì mà hàm nói 1: ở ô cuối nó so <code>"abc"[3]</code> với <code>"def"[3]</code>, cả hai là <code>undefined</code>, và <code>undefined === undefined</code> là true. JavaScript biến một lần đọc ra ngoài mảng thành một đáp án sai lặng lẽ; Java ném <code>StringIndexOutOfBoundsException</code> ngay lập tức. Hai thói quen: trong đầu đặt tên khác nhau cho chỉ số bảng và chỉ số chuỗi ("hàng i ↔ chữ i−1"), và luôn test với hai chuỗi KHÔNG chung chữ nào — đáp án phải là 0.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: quên n·m nghĩa là gì về bộ nhớ.</strong></p><p>"n, m ≤ 10⁵" mà cấp nguyên <code>int[n+1][m+1]</code> là 10¹⁰ ô, 40 GB: Java ném <code>OutOfMemoryError</code>, JavaScript chết trong lúc cố cấp. Nếu ô chỉ đọc hàng trước thì giữ hai hàng (O(m)); nếu cần cả bảng để truy vết thì kiểm trước rằng n·m vừa (tối đa khoảng 10⁷–10⁸ ô).</p></div>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: Edit Distance</h3>
${hoiThoai([
  ['I', 'Given two words, return the minimum number of single-character insertions, deletions and replacements to turn the first into the second.'],
  ['C', 'Do all three operations cost 1? Is it case-sensitive, and can either word be empty? And do you want just the number, or the actual edits?'],
  ['N', 'If a replacement cost 2, the formula changes (replace = delete + insert). "Number or edits" decides whether you can compress to two rows.'],
  ['I', 'All cost 1, case-sensitive, empty words are possible, just the number for now.'],
  ['C', 'Brute force: compare the last letters. If they match, recurse on both words without them; otherwise try replace, delete and insert, take the minimum plus one. That is up to three branches per call — exponential. But every call is about a prefix of a and a prefix of b, so there are only (n+1)(m+1) distinct calls.'],
  ['C', 'So dp[i][j] is the edits for the first i letters into the first j letters. Match: diagonal. Otherwise 1 + min(diagonal for replace, up for delete, left for insert). Base: dp[i][0] = i and dp[0][j] = j. Rows top to bottom. O(nm) time and memory — and since a row only reads the previous row, I can keep two rows for O(m) memory. Shall I code the table first?'],
  ['N', 'State, transition, base, order — in that order, before code. Then the complexity and the memory improvement in one breath.'],
  ['I', 'Go ahead.'],
  ['C', '(coding) In the two-row version I must reset cur[0] = i at the start of each row — column 0 is not zero here, unlike LCS… Let me trace horse and ros: the corner comes out 3. Edge cases: empty a gives m, two words with no common letter give max(n, m).'],
  ['I', 'Now return the list of edits, not just the count.'],
  ['C', 'Then I keep the full table and walk back from the corner: equal letters, go diagonal for free; otherwise follow whichever neighbour plus one equals the current cell — diagonal is a replace, up a delete, left an insert. That is O(n + m) extra, but I lose the two-row memory saving.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: Edit Distance</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho hai từ, trả về số phép chèn, xoá, thay một ký tự ít nhất để biến từ thứ nhất thành từ thứ hai.'],
  ['C', 'Ba phép đều tốn 1 phải không ạ? Có phân biệt hoa thường không, và từ nào có thể rỗng không? Anh/chị cần mỗi con số, hay cần cả danh sách phép sửa? <em>("Do all three operations cost 1? Do you want the number or the actual edits?")</em>'],
  ['N', 'Nếu phép thay tốn 2 thì công thức đổi (thay = xoá + chèn). "Con số hay danh sách phép sửa" quyết định có nén được xuống hai hàng không.'],
  ['I', 'Đều tốn 1, phân biệt hoa thường, từ có thể rỗng, tạm thời chỉ cần con số.'],
  ['C', 'Vét cạn: so chữ cuối. Khớp thì đệ quy trên hai từ đã bỏ chữ cuối; không khớp thì thử thay, xoá, chèn, lấy nhỏ nhất cộng một. Mỗi lời gọi rẽ tới ba nhánh — hàm mũ. Nhưng mọi lời gọi đều hỏi về một tiền tố của a và một tiền tố của b, nên chỉ có (n+1)(m+1) lời gọi khác nhau. <em>("Every call is about two prefixes, so there are only (n+1)(m+1) distinct subproblems.")</em>'],
  ['C', 'Vậy dp[i][j] là số phép sửa biến i chữ đầu thành j chữ đầu. Khớp: lấy ô chéo. Không thì 1 + min(chéo là thay, trên là xoá, trái là chèn). Cơ sở: dp[i][0] = i, dp[0][j] = j. Điền hàng từ trên xuống. O(nm) thời gian và bộ nhớ — mà một hàng chỉ đọc hàng trước, nên em giữ hai hàng, bộ nhớ O(m). Em code bản bảng trước nhé?'],
  ['N', 'Trạng thái, chuyển, cơ sở, thứ tự — đúng thứ tự đó, trước khi code. Rồi độ phức tạp và cách giảm bộ nhớ trong cùng một hơi.'],
  ['I', 'Ừ, làm đi.'],
  ['C', '(vừa code vừa nói) Ở bản hai hàng em phải gán lại cur[0] = i đầu mỗi hàng — ở bài này cột 0 không phải số 0, khác LCS… Em chạy tay horse và ros: ô góc ra 3. Ca biên: a rỗng thì ra m, hai từ không chung chữ nào thì ra max(n, m). <em>("Edge cases: an empty word, and two words with no common letter.")</em>'],
  ['I', 'Giờ trả về danh sách phép sửa, không chỉ con số.'],
  ['C', 'Vậy em giữ cả bảng và đi ngược từ ô góc: chữ bằng nhau thì đi chéo miễn phí; không thì đi theo ô hàng xóm nào cộng một bằng ô hiện tại — chéo là thay, lên là xoá, trái là chèn. Tốn thêm O(n + m), nhưng mất phần tiết kiệm bộ nhớ của hai hàng. <em>("I keep the full table and walk back from the corner.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Mixing table index and string index: row i is about <code>a[i−1]</code>. In JavaScript the slip gives a silent wrong answer, not an error.</li>
<li>Edit distance with a zero border: <code>dp[i][0] = i</code> and <code>dp[0][j] = j</code>; and in the two-row version, resetting <code>cur[0] = i</code> every row.</li>
<li>0/1 knapsack compressed to one row with the inner loop going up — items get reused; the sample test may still pass.</li>
<li>Filling a substring table row by row from the top when the cell reads the row below — fill by length (or rows bottom-up).</li>
<li>Confusing subsequence (may skip) with substring (contiguous) — they are different tables (LCS vs longest common substring, which resets to 0 on a mismatch).</li>
<li>Allocating n·m cells without checking n·m: 10¹⁰ cells do not fit anywhere.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Lẫn chỉ số bảng và chỉ số chuỗi: hàng i nói về <code>a[i−1]</code>. Trong JavaScript lỗi này cho đáp án sai lặng lẽ, không báo lỗi.</li>
<li>Edit distance mà viền bằng 0: phải là <code>dp[i][0] = i</code> và <code>dp[0][j] = j</code>; và ở bản hai hàng, gán lại <code>cur[0] = i</code> mỗi hàng.</li>
<li>Cái túi 0/1 nén một hàng mà vòng trong chạy xuôi — món bị dùng lại; test mẫu vẫn có thể qua.</li>
<li>Điền bảng xâu con theo hàng từ trên xuống trong khi ô đọc hàng bên dưới — phải điền theo độ dài (hoặc hàng từ dưới lên).</li>
<li>Lẫn dãy con (được bỏ chữ) với xâu con (liền mạch) — đó là hai bảng khác nhau (LCS khác với xâu con chung dài nhất, bài sau đặt ô về 0 khi không khớp).</li>
<li>Cấp n·m ô mà không tính trước n·m: 10¹⁰ ô không vừa ở đâu cả.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm được trên LeetCode/NeetCode. Bộ luyện 9 (bài 9.6) có lời giải từng bước cho thêm các đề hai chiều khác (xen kẽ chuỗi, dãy con đối xứng dài nhất, khớp biểu thức chính quy).</p>
${lienKet({ bai: 'dsa-9-1-nhap-mon', title: '9.1 — Quy hoạch động từ số 0', sub: 'Bốn câu hỏi trạng thái · chuyển · cơ sở · thứ tự, và vì sao nhớ kết quả biến hàm mũ thành tuyến tính', cta: 'Ôn lại' })}
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>On paper, fill the LCS table of <code>"ABCD"</code> and <code>"ACBD"</code> (5 × 5 with the empty row/column), then walk back from the corner. Check your corner value by running <code>lcs.ts</code> with these two strings.</li>
<li>Write Edit Distance from memory (table version), then the two-row version. Run both on <code>horse/ros</code>, <code>""/"abc"</code> and <code>"abc"/"xyz"</code> — expected 3, 3, 3.</li>
<li>In the two-row version, delete the line <code>cur[0] = i</code>. Find an input where the answer becomes wrong and write down why.</li>
<li>Submit LC 62, LC 1143 and LC 416 on LeetCode. For LC 416, first submit with the inner loop going up and read the failing test.</li>
</ol>
<p><strong>Done when:</strong> your hand-filled table matches the program, three accepted submissions, and one sentence each for the <code>cur[0]</code> bug and the loop-direction bug.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">2D DP table</span><span class="v">Cells <code>dp[i][j]</code> indexed by two numbers; each cell reads a few neighbours.</span></div>
  <div class="kv"><span class="k">prefix</span><span class="v">The first i letters of a string; row 0 = the empty prefix.</span></div>
  <div class="kv"><span class="k">subsequence vs substring</span><span class="v">May skip characters vs must be contiguous.</span></div>
  <div class="kv"><span class="k">traceback</span><span class="v">Walking back from the answer cell to recover the actual solution.</span></div>
  <div class="kv"><span class="k">Levenshtein / edit distance</span><span class="v">Fewest single-character inserts, deletes, replacements.</span></div>
  <div class="kv"><span class="k">0/1 vs unbounded knapsack</span><span class="v">Each item at most once (inner loop down) vs any number of times (inner loop up).</span></div>
  <div class="kv"><span class="k">rolling array</span><span class="v">Keeping only the rows the formula reads (two rows, or one).</span></div>
  <div class="kv"><span class="k">user enumeration</span><span class="v">Learning which accounts exist from an application's different responses.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Two-dimensional DP = a spreadsheet: one formula for every cell, reading up / left / diagonal; answer the four questions before coding.</li>
<li>LCS: match ⇒ diagonal + 1, else max(up, left); the walk back recovers the subsequence; it is the model of every line diff.</li>
<li>Edit distance: diagonal = replace, up = delete, left = insert; the border is i and j; it powers "Did you mean".</li>
<li>0/1 knapsack reads the previous row; compressed to one row, the inner loop must go down.</li>
<li>The order of computation follows the arrows: substrings are filled by length.</li>
<li>Measured: plain recursion 2.1 billion calls (22.8 s in Node) for two 13-letter words; the table does 25 million cells in about 0.1 s.</li>
</ul>
${nguon('📗', 'Levenshtein distance — Wikipedia', 'Definition, the Wagner–Fischer table and the two-row version', 'https://en.wikipedia.org/wiki/Levenshtein_distance')}
${nguon('📘', 'Longest common subsequence — Wikipedia', 'The LCS table, traceback, and its use in diff tools', 'https://en.wikipedia.org/wiki/Longest_common_subsequence')}
${nguon('🛠', 'git diff — Git documentation', 'Options --diff-algorithm=myers|minimal|patience|histogram', 'https://git-scm.com/docs/git-diff')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên giấy, điền bảng LCS của <code>"ABCD"</code> và <code>"ACBD"</code> (5 × 5 tính cả hàng/cột rỗng), rồi đi ngược từ ô góc. Kiểm giá trị ô góc bằng cách chạy <code>lcs.ts</code> với hai chuỗi này.</li>
<li>Viết Edit Distance không nhìn bài (bản bảng), rồi bản hai hàng. Chạy cả hai với <code>horse/ros</code>, <code>""/"abc"</code> và <code>"abc"/"xyz"</code> — kỳ vọng 3, 3, 3.</li>
<li>Ở bản hai hàng, xoá dòng <code>cur[0] = i</code>. Tìm một đầu vào làm đáp án sai và ghi lại vì sao.</li>
<li>Nộp LC 62, LC 1143 và LC 416 trên LeetCode. Với LC 416, nộp trước một bản có vòng trong chạy xuôi rồi đọc test bị trượt.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng bạn điền tay khớp chương trình, ba lượt nộp Accepted, và mỗi lỗi (<code>cur[0]</code> và chiều vòng lặp) có một câu giải thích.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">2D DP table (bảng quy hoạch động hai chiều)</span><span class="v">Các ô <code>dp[i][j]</code> đánh chỉ số bằng hai con số; mỗi ô đọc vài ô hàng xóm.</span></div>
  <div class="kv"><span class="k">prefix (tiền tố)</span><span class="v">i chữ đầu tiên của một chuỗi; hàng 0 = tiền tố rỗng.</span></div>
  <div class="kv"><span class="k">subsequence / substring (dãy con / xâu con)</span><span class="v">Được bỏ qua ký tự / phải liền mạch.</span></div>
  <div class="kv"><span class="k">traceback (truy vết)</span><span class="v">Đi ngược từ ô đáp án để khôi phục lời giải cụ thể.</span></div>
  <div class="kv"><span class="k">Levenshtein / edit distance (khoảng cách sửa)</span><span class="v">Số phép chèn, xoá, thay một ký tự ít nhất.</span></div>
  <div class="kv"><span class="k">0/1 vs unbounded knapsack (cái túi 0/1 / không giới hạn)</span><span class="v">Mỗi món tối đa một lần (vòng trong chạy ngược) / bao nhiêu lần cũng được (vòng trong chạy xuôi).</span></div>
  <div class="kv"><span class="k">rolling array (mảng cuốn)</span><span class="v">Chỉ giữ những hàng công thức cần đọc (hai hàng, hoặc một).</span></div>
  <div class="kv"><span class="k">user enumeration (dò tên tài khoản)</span><span class="v">Biết được tài khoản nào tồn tại nhờ phản hồi khác nhau của ứng dụng.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Quy hoạch động hai chiều = một trang tính: một công thức cho mọi ô, đọc trên / trái / chéo; trả lời bốn câu hỏi trước khi code.</li>
<li>LCS: khớp ⇒ chéo + 1, không thì max(trên, trái); đi ngược khôi phục dãy con; đó là mô hình của mọi bản diff theo dòng.</li>
<li>Edit distance: chéo = thay, trên = xoá, trái = chèn; viền là i và j; nó đứng sau "Did you mean".</li>
<li>Cái túi 0/1 đọc hàng trước; nén còn một hàng thì vòng trong phải chạy ngược.</li>
<li>Thứ tự tính đi theo mũi tên: bảng xâu con điền theo độ dài.</li>
<li>Đo thật: đệ quy thuần 2,1 tỉ lời gọi (22,8 giây trên Node) cho hai từ 13 chữ; bảng làm 25 triệu ô trong khoảng 0,1 giây.</li>
</ul>
${nguon('📗', 'Levenshtein distance — Wikipedia', 'Định nghĩa, bảng Wagner–Fischer và bản hai hàng (tiếng Anh)', 'https://en.wikipedia.org/wiki/Levenshtein_distance')}
${nguon('📘', 'Longest common subsequence — Wikipedia', 'Bảng LCS, truy vết, và cách công cụ diff dùng nó (tiếng Anh)', 'https://en.wikipedia.org/wiki/Longest_common_subsequence')}
${nguon('🛠', 'git diff — tài liệu Git', 'Các lựa chọn --diff-algorithm=myers|minimal|patience|histogram', 'https://git-scm.com/docs/git-diff')}
</div>
`,
};
