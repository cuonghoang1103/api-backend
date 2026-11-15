/** 9.4 — Nhận ra DP và nói trạng thái trước khi code. Mọi mã/output đọc từ ../ma/ch09/b4 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { bangDP } from './_rieng.mjs';
import { vetDeleteEarn, vetCooldown, vetSquare } from '../ma/ch09/b4/nd.vet.mjs';

/* LC 740 trên [1,1,1,2,4,5,5,5,6] */
const DE_NUMS = [1, 1, 1, 2, 4, 5, 5, 5, 6];
const VDE = vetDeleteEarn(DE_NUMS);
const DIEM = oMang(VDE.points, { chiSo: true, to: { 0: 'mo' } });
const BANG_DE = bangVet(['v', 'points[v]', 'skip v: dp[v−1]', 'take v: dp[v−2] + points[v]', 'dp[v]', 'choice'],
  VDE.hang.map((h) => [String(h.v), String(h.diem), String(h.bo), `${h.lay - h.diem} + ${h.diem} = ${h.lay}`, `<strong>${h.dp}</strong>`, h.chon === 'take' ? '✅ take' : 'skip']));

/* LC 309 trên [1,2,3,0,2] */
const CD_P = [1, 2, 3, 0, 2];
const VCD = vetCooldown(CD_P);
const CD_TO = { [`3,${CD_P.length - 1}`]: 'ok' };
for (let d = 0; d < CD_P.length; d++) CD_TO[`0,${d}`] = 'mo';
VCD.cot.forEach((c, d) => { if (c.mua) CD_TO[`1,${d}`] = 'l'; });
const BANG_CD = bangDP([CD_P, VCD.cot.map((c) => c.hold), VCD.cot.map((c) => c.sold), VCD.cot.map((c) => c.rest)],
  { hang: ['price', 'hold', 'sold', 'rest'], cot: CD_P.map((_, d) => `day ${d}`), to: CD_TO });

/* LC 221 */
const SQ = ['1101', '1111', '0111', '1111'];
const VSQ = vetSquare(SQ);
const SQ_TO = {};
const [br, bc] = VSQ.at;
for (let r = br - VSQ.best + 1; r <= br; r++) for (let c = bc - VSQ.best + 1; c <= bc; c++) SQ_TO[`${r},${c}`] = 'cs';
SQ_TO[`${br},${bc}`] = 'ok';
const BANG_SQ_IN = bangVet(['row', 'matrix'], SQ.map((s, r) => [String(r), oMang(s.split(''), { to: Object.fromEntries(s.split('').map((ch, c) => [c, ch === '1' ? 'cs' : 'mo'])) })]));
const BANG_SQ = bangDP(VSQ.dp, { hang: ['pad', 'r0', 'r1', 'r2', 'r3'], cot: ['pad', 'c0', 'c1', 'c2', 'c3'], coSo: true, to: SQ_TO });

const DE = [
  [lc(740, 'delete-and-earn', 'Delete and Earn', 'Medium'), 'Bucket by value ⇒ House Robber on the value axis.', 'Gom theo giá trị ⇒ House Robber trên trục giá trị.'],
  [lc(309, 'best-time-to-buy-and-sell-stock-with-cooldown', 'Best Time to Buy and Sell Stock with Cooldown', 'Medium'), 'Name the situations (hold / sold / rest) — that is the state.', 'Gọi tên các tình huống (giữ / vừa bán / rảnh) — đó chính là trạng thái.'],
  [lc(714, 'best-time-to-buy-and-sell-stock-with-transaction-fee', 'Best Time to Buy and Sell Stock with Transaction Fee', 'Medium'), 'Same machine with two states; subtract the fee on one transition.', 'Cùng máy trạng thái hai trạng thái; trừ phí ở một mũi chuyển.'],
  [lc(221, 'maximal-square', 'Maximal Square', 'Medium'), '"Largest … ending at (r, c)" + min of three neighbours.', '"Lớn nhất … kết thúc tại (r, c)" + min của ba ô láng giềng.'],
  [lc(120, 'triangle', 'Triangle', 'Medium'), 'Go bottom-up so the base case is the last row and the answer is one cell.', 'Đi từ dưới lên để ca cơ sở là hàng cuối và đáp án là một ô.'],
  [lc(1035, 'uncrossed-lines', 'Uncrossed Lines', 'Medium'), 'Lines that never cross = a common subsequence: LCS in disguise (9.3).', 'Các đường không cắt nhau = một dãy con chung: LCS đội lốt (9.3).'],
  [lc(343, 'integer-break', 'Integer Break', 'Medium'), 'dp[n] = best product for n; try the first piece j: max(j, dp[j]) × …', 'dp[n] = tích lớn nhất cho n; thử mảnh đầu j: max(j, dp[j]) × …'],
  [lc(1218, 'longest-arithmetic-subsequence-of-given-difference', 'Longest Arithmetic Subsequence of Given Difference', 'Medium'), '"Ending at value x" state stored in a hash map, not an array.', 'Trạng thái "kết thúc ở giá trị x" cất trong hash map, không phải mảng.'],
];

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Brute force as recursion</span><span class="lz-d">"At this point I can choose A or B…" — write the recursive function header and say what it returns.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Do arguments repeat?</span><span class="lz-d">Expand two or three levels by hand. Same arguments twice ⇒ overlapping subproblems ⇒ DP. Never ⇒ backtracking (Chapter 8).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Is one local rule provably enough?</span><span class="lz-d">If yes, greedy (9.5) is simpler. If you cannot prove it, or a small counterexample exists, stay with DP.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Say the four sentences</span><span class="lz-d">State = the arguments of your recursion. Transition, base, order + answer.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Code, test, then shrink</span><span class="lz-d">Memo or table; trace one small input; then ask "which cells does the transition read?" to save memory.</span></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Vét cạn dạng đệ quy</span><span class="lz-d">"Ở bước này tôi chọn được A hoặc B…" — viết đầu hàm đệ quy và nói nó trả về gì.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tham số có lặp lại không?</span><span class="lz-d">Bung tay hai, ba tầng. Cùng tham số hai lần ⇒ bài toán con gối nhau ⇒ DP. Không bao giờ lặp ⇒ quay lui (Chương 8).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Một luật cục bộ có chứng minh được là đủ?</span><span class="lz-d">Nếu có, tham lam (9.5) đơn giản hơn. Không chứng minh được, hoặc có phản ví dụ nhỏ, thì ở lại với DP.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nói bốn câu</span><span class="lz-d">Trạng thái = các tham số của hàm đệ quy. Chuyển, cơ sở, thứ tự + đáp án.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Code, test, rồi thu gọn</span><span class="lz-d">Memo hoặc bảng; chạy tay một đầu vào nhỏ; rồi hỏi "công thức chuyển đọc những ô nào?" để tiết kiệm bộ nhớ.</span></div>
</div>`;

const HO_EN = [
  ['I', 'You get an array of integers. In one move you pick a number x, earn x points, and every element equal to x − 1 or x + 1 is deleted. Return the maximum points. Example: [2, 2, 3, 3, 3, 4] gives 9.'],
  ['C', 'Let me restate it: picking x removes all x−1 and x+1 — what about the other copies of x? Can I keep picking them?'],
  ['I', 'Yes. Once x−1 and x+1 are gone, the other copies of x are free to take.'],
  ['C', 'Then I will never take only some copies of a value: if taking one x is worth it, taking all of them costs nothing more. So the real decision is per <em>distinct value</em>: take all of v, or none. What are the bounds?'],
  ['N', 'The clarifying question turned "choose elements" into "choose values". Most of the solution is in that sentence.'],
  ['I', 'Up to 2·10⁴ elements, each between 1 and 10⁴.'],
  ['C', 'Brute force: try every subset of distinct values with no two consecutive — 2 to the number of distinct values, far too many. Recursively: walking values in order, at value v I either skip it or take it and then cannot take v−1. Expanding that, best(v−2) is needed by both best(v) and best(v−1): the subproblems repeat.'],
  ['N', 'Steps 1 and 2 of the recognition flow, out loud: brute force as a recursion, then the repeat that proves it is DP.'],
  ['C', 'And this is exactly House Robber: the "houses" are the values 1 to max, each house holds points[v] = v times its count, and neighbours cannot both be robbed. So — state: dp[v] = best total using values 1..v. Transition: dp[v] = max(dp[v−1], dp[v−2] + points[v]). Base: dp[0] = 0, and dp[1] = points[1]. Order: v from 1 to max. Answer: dp[max].'],
  ['N', 'Recognising a known problem in disguise is the most valuable DP skill. Name it — "this is House Robber on the values" — and the interviewer relaxes.'],
  ['C', 'Time O(n + maxValue), memory O(maxValue) for points, and the dp itself can roll into two variables. Can I code it?'],
  ['I', 'Please.'],
  ['C', '(coding) points array of size max + 1… prev2 and prev1 start at 0… Checking [2, 2, 3, 3, 3, 4]: points 2→4, 3→9, 4→4. v=2 gives 4, v=3 max(4, 0+9) = 9, v=4 max(9, 4+4) = 9. Answer 9, matches.'],
  ['I', 'Which values did you actually take?'],
  ['C', 'Then I keep the whole dp array and walk back from max: if dp[v] equals dp[v−1], v was skipped, go to v−1; otherwise v was taken, go to v−2. Here: dp[4] = dp[3], skip 4; take 3; then v = 1, skip. So I take the three 3s.'],
  ['I', 'And if values could be up to 10⁹?'],
  ['C', 'Then an array indexed by value is too big. I would sort the distinct values; consecutive distinct values that differ by more than 1 do not conflict, so for them dp just adds points; when they differ by exactly 1, it is the House Robber choice. O(n log n) for the sort.'],
];
const HO_VI = [
  ['I', 'Cho một mảng số nguyên. Mỗi lượt bạn chọn một số x, được x điểm, và mọi phần tử bằng x − 1 hoặc x + 1 bị xoá. Trả về điểm lớn nhất. Ví dụ: [2, 2, 3, 3, 3, 4] ra 9.'],
  ['C', 'Em nói lại: chọn x thì xoá hết x−1 và x+1 — còn các bản sao khác của x thì sao ạ? Em có được chọn tiếp chúng không? <em>("What happens to the other copies of x?")</em>'],
  ['I', 'Được. Khi x−1 và x+1 đã mất, các bản sao khác của x lấy thoải mái.'],
  ['C', 'Vậy em sẽ không bao giờ chỉ lấy một phần các bản sao: nếu lấy một x là đáng, thì lấy hết cũng chẳng tốn thêm gì. Nên quyết định thật sự là theo <em>từng giá trị khác nhau</em>: lấy hết v, hoặc không lấy. Ràng buộc là bao nhiêu ạ?'],
  ['N', 'Câu hỏi làm rõ đã biến "chọn phần tử" thành "chọn giá trị". Phần lớn lời giải nằm trong câu đó.'],
  ['I', 'Tối đa 2·10⁴ phần tử, mỗi số từ 1 tới 10⁴.'],
  ['C', 'Vét cạn: thử mọi tập giá trị khác nhau mà không có hai số liền nhau — 2 mũ số giá trị khác nhau, quá nhiều. Viết đệ quy: đi qua các giá trị theo thứ tự, ở v em bỏ qua nó, hoặc lấy nó và khi đó không được lấy v−1. Bung ra thì best(v−2) được cả best(v) lẫn best(v−1) cần tới: bài toán con lặp lại. <em>("The subproblems overlap.")</em>'],
  ['N', 'Bước 1 và 2 của quy trình nhận diện, nói thành lời: vét cạn dạng đệ quy, rồi chỉ ra chỗ lặp chứng minh đây là DP.'],
  ['C', 'Và đây đúng là House Robber: "các ngôi nhà" là các giá trị từ 1 tới max, mỗi nhà chứa points[v] = v nhân số lần xuất hiện, và hai nhà kề nhau không được cướp cùng lúc. Vậy — trạng thái: dp[v] = tổng lớn nhất khi chỉ dùng các giá trị 1..v. Chuyển: dp[v] = max(dp[v−1], dp[v−2] + points[v]). Cơ sở: dp[0] = 0, dp[1] = points[1]. Thứ tự: v từ 1 tới max. Đáp án: dp[max]. <em>("This is House Robber on the values.")</em>'],
  ['N', 'Nhận ra một bài quen đội lốt là kỹ năng DP đáng giá nhất. Gọi tên nó ra — "đây là House Robber trên các giá trị" — và người phỏng vấn sẽ yên tâm.'],
  ['C', 'Thời gian O(n + giá trị lớn nhất), bộ nhớ O(giá trị lớn nhất) cho mảng points, còn dp thì cuộn được về hai biến. Em code nhé?'],
  ['I', 'Ừ.'],
  ['C', '(vừa code vừa nói) mảng points cỡ max + 1… prev2 và prev1 bắt đầu bằng 0… Kiểm [2, 2, 3, 3, 3, 4]: points 2→4, 3→9, 4→4. v=2 ra 4, v=3 max(4, 0+9) = 9, v=4 max(9, 4+4) = 9. Đáp án 9, khớp.'],
  ['I', 'Cụ thể em đã lấy những giá trị nào?'],
  ['C', 'Khi đó em giữ cả mảng dp rồi đi ngược từ max: nếu dp[v] bằng dp[v−1] thì v bị bỏ qua, lùi về v−1; ngược lại v được lấy, lùi về v−2. Ở đây: dp[4] = dp[3], bỏ 4; lấy 3; rồi v = 1, bỏ. Vậy em lấy ba số 3. <em>("I walk the table backwards to rebuild the choice.")</em>'],
  ['I', 'Nếu giá trị lên tới 10⁹ thì sao?'],
  ['C', 'Khi đó mảng đánh chỉ số theo giá trị quá lớn. Em sắp xếp các giá trị khác nhau; hai giá trị kề nhau trong danh sách mà lệch hơn 1 thì không xung đột, dp chỉ việc cộng thêm điểm; lệch đúng 1 thì là lựa chọn House Robber. O(n log n) cho phép sắp xếp.'],
];

export default {
  title: '9.4 — Recognising DP and saying the state before the code|||9.4 — Nhận ra quy hoạch động và nói trạng thái trước khi code',
  slug: 'dsa-9-4-nhan-dien',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Quy trình nhận ra DP (vét cạn đệ quy → tham số lặp → tham lam đủ chưa → 4 câu), các họ trạng thái, Delete and Earn = House Robber đội lốt với kịch bản phỏng vấn dài, máy trạng thái mua bán cổ phiếu, hình vuông lớn nhất, và phép đo khoá memo chuỗi chậm gấp 25 lần.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Recognising DP and saying the state before the code</h2>
<p class="lead">Lessons 9.1–9.3 taught you to solve DP problems when you already know they are DP problems. In an interview nobody tells you. This lesson is about the two minutes <em>before</em> the code: noticing that a problem wants DP, choosing the state, and saying the four sentences out loud in a way that makes the interviewer stop worrying. It ends with the problem of this chapter that most often fails real candidates — not because the code is hard, but because they started typing before they knew what <code>dp[i]</code> meant.</p>

<h3>The everyday picture: a save file</h3>
<p>Think of the save file of a game. When you save in the middle of a level, the game does not record every key you pressed since the start. It records the <em>smallest amount of information the future needs</em>: which level, how many lives, what is in your inventory. Two players who reached the same level with the same lives and items are, from the game's point of view, in the same situation — whatever path they took to get there.</p>
<p>That is exactly what a DP <strong>state</strong> is: <em>the smallest summary of the past that the rest of the problem needs</em>. Too little information and the future cannot be computed correctly (you forgot that the player has the key, and now the door logic is wrong). Too much and you never get repeats (if the save file kept every key press, no two players would ever share a save, and there would be nothing to reuse). Choosing the state is choosing what goes into the save file.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Nhận ra quy hoạch động và nói trạng thái trước khi code</h2>
<p class="lead">Các bài 9.1–9.3 dạy bạn giải bài DP khi đã biết trước nó là bài DP. Trong phòng phỏng vấn không ai báo trước cho bạn. Bài này nói về hai phút <em>trước</em> khi code: nhận ra đề đang đòi DP, chọn trạng thái, và nói to bốn câu theo cách làm người phỏng vấn thôi lo lắng. Bài kết thúc bằng đề làm trượt nhiều ứng viên thật nhất của chương — không phải vì code khó, mà vì họ bắt đầu gõ trước khi biết <code>dp[i]</code> nghĩa là gì.</p>

<h3>Hình dung đời thường: tệp lưu game</h3>
<p>Nghĩ tới tệp lưu (save file) của một trò chơi. Khi bạn lưu giữa màn, game không ghi lại mọi phím bạn đã bấm từ đầu. Nó ghi <em>lượng thông tin nhỏ nhất mà phần còn lại cần tới</em>: màn nào, còn mấy mạng, trong túi có gì. Hai người chơi tới cùng một màn với cùng số mạng và cùng đồ vật thì, dưới con mắt của game, đang ở CÙNG một tình huống — bất kể họ đi đường nào để tới đó.</p>
<p>Đó chính xác là <strong>trạng thái</strong> (state) của DP: <em>bản tóm tắt nhỏ nhất của quá khứ mà phần còn lại của bài toán cần</em>. Quá ít thông tin thì tương lai tính sai (bạn quên rằng người chơi đang cầm chìa khoá, và giờ logic cánh cửa sai). Quá nhiều thì không bao giờ có chỗ lặp (nếu tệp lưu giữ mọi phím đã bấm, không hai người chơi nào có chung một bản lưu, và chẳng có gì để dùng lại). Chọn trạng thái là chọn những gì được ghi vào tệp lưu.</p>
${csd('csd201-cs3-on', 'vi', 'CS.3 Bài tập: 7 bài quy hoạch động kiểu phỏng vấn', '<p>Bộ bài tập CS.3 đã cho bạn luyện công thức 4 bước trên từng đề riêng lẻ. Ôn nhanh một câu: <em>mỗi đề DP là một câu trạng thái + một công thức chuyển + ca cơ sở + thứ tự</em>. <strong>Ở đây đi sâu thêm:</strong> làm sao nhận ra một đề lạ là DP, chọn họ trạng thái nào, nhận ra bài quen "đội lốt", và nói tất cả thành lời theo một kịch bản phỏng vấn dài.</p>')}
</div>

<div class="ml-en">
<h3>The recognition flow</h3>
${FLOW_EN}
<p>Step 2 deserves a word. Backtracking (Chapter 8) and DP both start from the same recursive brute force. The difference is in the arguments: if every call has a <em>different</em> argument tuple (a permutation built so far, a board with queens placed), nothing repeats and memoisation cannot help — you need pruning. If the arguments are small numbers that keep coming back (an index, a remaining amount, two positions in two strings), the answer only depends on those numbers, and DP applies. That is why the state is "the arguments of your recursion": it is the save file of the recursive call.</p>
</div>
<div class="ml-vi">
<h3>Quy trình nhận diện</h3>
${FLOW_VI}
<p>Bước 2 đáng nói thêm một chút. Quay lui (Chương 8) và DP cùng xuất phát từ một bản vét cạn đệ quy. Khác nhau ở tham số: nếu mỗi lời gọi có một bộ tham số <em>khác hẳn</em> (một hoán vị đang dựng dở, một bàn cờ đã đặt vài quân hậu), chẳng có gì lặp lại và nhớ lại không giúp được gì — bạn cần cắt nhánh. Nếu tham số là những con số nhỏ cứ quay lại mãi (một chỉ số, số tiền còn lại, hai vị trí trong hai chuỗi), thì đáp án chỉ phụ thuộc vào mấy con số đó, và DP dùng được. Vì vậy trạng thái chính là "các tham số của hàm đệ quy": nó là tệp lưu của lời gọi đệ quy.</p>
${lienKet({ bai: 'dsa-8-1-mau', title: '8.1 — Khuôn quay lui: chọn → đệ quy → bỏ chọn', sub: 'Khi các tham số KHÔNG lặp lại: cắt nhánh thay cho nhớ', cta: 'So sánh' })}
</div>

<div class="ml-en">
<h3>Read the constraints: they often name the complexity</h3>
<table>
<thead><tr><th>n in the statement</th><th>What the setter expects</th><th>Typical DP shape</th></tr></thead>
<tbody>
<tr><td>n ≤ 20</td><td>O(2ⁿ · n)</td><td>Bitmask DP or backtracking — the set of used items IS the state</td></tr>
<tr><td>n ≤ 100–500</td><td>O(n³)</td><td>Interval DP: dp[i][j] over a substring, try every split point</td></tr>
<tr><td>n ≤ 1,000–5,000</td><td>O(n²)</td><td>Two sequences dp[i][j], or "ending at i" with a loop over j &lt; i (LIS)</td></tr>
<tr><td>n ≤ 10⁵–10⁶</td><td>O(n) or O(n log n)</td><td>dp[i] with O(1) transition, rolling variables; or greedy</td></tr>
<tr><td>an amount / capacity W ≤ 10⁴</td><td>O(n · W)</td><td>Knapsack and coin change: the remaining amount is part of the state</td></tr>
</tbody></table>
<p>The rule of thumb from lesson 0.1 still holds: roughly 10⁸ simple steps per second. A DP's cost is <em>number of states × cost of one transition</em> — compute that product before you code.</p>
</div>
<div class="ml-vi">
<h3>Đọc ràng buộc: chúng thường gọi tên luôn độ phức tạp</h3>
<table>
<thead><tr><th>n trong đề</th><th>Người ra đề chờ</th><th>Hình dạng DP thường gặp</th></tr></thead>
<tbody>
<tr><td>n ≤ 20</td><td>O(2ⁿ · n)</td><td>DP bitmask hoặc quay lui — tập các phần tử đã dùng CHÍNH LÀ trạng thái</td></tr>
<tr><td>n ≤ 100–500</td><td>O(n³)</td><td>DP khoảng: dp[i][j] trên một đoạn, thử mọi điểm cắt</td></tr>
<tr><td>n ≤ 1.000–5.000</td><td>O(n²)</td><td>Hai dãy dp[i][j], hoặc "kết thúc tại i" với vòng lặp qua j &lt; i (LIS)</td></tr>
<tr><td>n ≤ 10⁵–10⁶</td><td>O(n) hoặc O(n log n)</td><td>dp[i] với công thức chuyển O(1), biến trượt; hoặc tham lam</td></tr>
<tr><td>một số tiền / sức chứa W ≤ 10⁴</td><td>O(n · W)</td><td>Cái túi và đổi tiền: phần còn lại là một chiều của trạng thái</td></tr>
</tbody></table>
<p>Quy tắc ngón tay cái từ bài 0.1 vẫn đúng: khoảng 10⁸ bước đơn giản mỗi giây. Chi phí của một DP là <em>số trạng thái × chi phí một lần chuyển</em> — tính tích đó trước khi code.</p>
${lienKet({ bai: 'dsa-0-1-big-o', title: '0.1 — Big-O dùng được để suy luận', sub: 'Bảng giới hạn n ↔ độ phức tạp đầy đủ', cta: 'Xem lại' })}
</div>

<div class="ml-en">
<h3>The families of states you will meet</h3>
<p>Almost every interview DP uses one of these state sentences. When a problem feels new, try each sentence in turn and see which one makes the transition easy to say.</p>
<table>
<thead><tr><th>Family</th><th>State sentence</th><th>Examples</th></tr></thead>
<tbody>
<tr><td>Prefix</td><td>dp[i] = best answer using only the first i items</td><td>House Robber, Word Break, Decode Ways (9.2)</td></tr>
<tr><td>Ending here</td><td>dp[i] = best answer for a piece that <em>ends exactly at</em> i</td><td>Kadane, LIS (9.2), Maximal Square below</td></tr>
<tr><td>Remaining amount</td><td>dp[a] = best way to make amount a</td><td>Coin Change (9.2), Perfect Squares (9.6)</td></tr>
<tr><td>Two sequences</td><td>dp[i][j] = answer for a[0..i) and b[0..j)</td><td>LCS, Edit Distance (9.3), Interleaving String (9.6)</td></tr>
<tr><td>Items × capacity</td><td>dp[i][w] = best using the first i items within capacity w</td><td>0/1 knapsack, Partition Equal Subset Sum (9.3)</td></tr>
<tr><td>Interval</td><td>dp[i][j] = answer for the substring i..j</td><td>Longest Palindromic Subsequence (9.6)</td></tr>
<tr><td>Grid</td><td>dp[r][c] = answer for reaching (or ending at) cell (r, c)</td><td>Unique Paths (9.3), Triangle below</td></tr>
<tr><td>State machine</td><td>dp[i][s] = best after day i while in situation s</td><td>Stock with Cooldown below</td></tr>
</tbody></table>
</div>
<div class="ml-vi">
<h3>Các họ trạng thái bạn sẽ gặp</h3>
<p>Gần như mọi bài DP phỏng vấn dùng một trong các câu trạng thái dưới đây. Khi một đề có vẻ lạ, hãy thử lần lượt từng câu và xem câu nào làm công thức chuyển dễ nói nhất.</p>
<table>
<thead><tr><th>Họ</th><th>Câu trạng thái</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Tiền tố (prefix)</td><td>dp[i] = đáp án tốt nhất khi chỉ dùng i phần tử đầu</td><td>House Robber, Word Break, Decode Ways (9.2)</td></tr>
<tr><td>Kết thúc tại đây (ending here)</td><td>dp[i] = đáp án tốt nhất cho một đoạn <em>kết thúc đúng tại</em> i</td><td>Kadane, LIS (9.2), Maximal Square bên dưới</td></tr>
<tr><td>Phần còn lại (remaining amount)</td><td>dp[a] = cách tốt nhất để tạo ra số tiền a</td><td>Coin Change (9.2), Perfect Squares (9.6)</td></tr>
<tr><td>Hai dãy</td><td>dp[i][j] = đáp án cho a[0..i) và b[0..j)</td><td>LCS, Edit Distance (9.3), Interleaving String (9.6)</td></tr>
<tr><td>Vật × sức chứa</td><td>dp[i][w] = tốt nhất khi dùng i vật đầu trong sức chứa w</td><td>Cái túi 0/1, Partition Equal Subset Sum (9.3)</td></tr>
<tr><td>Khoảng (interval)</td><td>dp[i][j] = đáp án cho đoạn i..j</td><td>Longest Palindromic Subsequence (9.6)</td></tr>
<tr><td>Lưới (grid)</td><td>dp[r][c] = đáp án khi tới (hoặc kết thúc tại) ô (r, c)</td><td>Unique Paths (9.3), Triangle bên dưới</td></tr>
<tr><td>Máy trạng thái (state machine)</td><td>dp[i][s] = tốt nhất sau ngày i khi đang ở tình huống s</td><td>Stock with Cooldown bên dưới</td></tr>
</tbody></table>
</div>

<div class="ml-en">
<h3>Worked example 1: Delete and Earn — a known problem in disguise</h3>
<p><strong>Problem (in our words).</strong> You get an array of positive integers. In one move you pick a number x, earn x points, and every element equal to x − 1 or x + 1 disappears. Maximise the total. Example: <code>[2, 2, 3, 3, 3, 4]</code> → 9 (take the three 3s; the 2s and the 4 vanish).</p>
<p><strong>The whole solution, as a conversation.</strong> This is the long version of "say the state before the code": read the interviewer's lines as the problem being revealed, and the candidate's lines as the recognition flow above, step by step. The 💡 notes say why each line is there.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu 1: Delete and Earn — bài quen đội lốt</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên dương. Mỗi lượt bạn chọn một số x, được x điểm, và mọi phần tử bằng x − 1 hoặc x + 1 biến mất. Tìm tổng điểm lớn nhất. Ví dụ: <code>[2, 2, 3, 3, 3, 4]</code> → 9 (lấy ba số 3; các số 2 và số 4 biến mất).</p>
<p><strong>Toàn bộ lời giải, dưới dạng một cuộc hội thoại.</strong> Đây là phiên bản dài của "nói trạng thái trước khi code": đọc lời người phỏng vấn như đề bài đang được hé dần, và lời ứng viên như quy trình nhận diện ở trên, từng bước một. Các dòng 💡 giải thích vì sao có câu đó.</p>
</div>
<div class="ml-en">
<h3>🎤 Saying it out loud: the long exchange</h3>
${hoiThoai(HO_EN, 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: kịch bản hội thoại dài</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm các cụm tiếng Anh nên thuộc.</p>
${hoiThoai(HO_VI, 'vi')}
</div>

<div class="ml-en">
<h3>The code, and the table behind it</h3>
<p>The solution is House Robber after one preprocessing line (<code>points[x] += x</code>); the second function keeps the full table so it can walk back and report which values were taken. A random self-test against a brute force that tries every set of values guards both.</p>
</div>
<div class="ml-vi">
<h3>Mã, và cái bảng đằng sau nó</h3>
<p>Lời giải là House Robber sau đúng một dòng tiền xử lý (<code>points[x] += x</code>); hàm thứ hai giữ cả bảng để đi ngược lại và báo những giá trị nào đã được lấy. Một phép tự kiểm ngẫu nhiên so với vét cạn thử mọi tập giá trị canh giữ cả hai.</p>
</div>
${maHai('ch09/b4/delete-earn.ts', 'ch09/b4/NdDeleteEarn.java', { vung: 'giai' })}
${maHai('ch09/b4/delete-earn.ts', 'ch09/b4/NdDeleteEarn.java', { vung: 'chon' })}
${ketQua('ch09/b4/delete-earn.ts')}
${ketQua('ch09/b4/NdDeleteEarn.java')}
<div class="ml-en">
<p>Trace the third example, <code>[1, 1, 1, 2, 4, 5, 5, 5, 6]</code>. First the points per value (index = value):</p>
</div>
<div class="ml-vi">
<p>Chạy vết ví dụ thứ ba, <code>[1, 1, 1, 2, 4, 5, 5, 5, 6]</code>. Trước hết là điểm theo từng giá trị (chỉ số = giá trị):</p>
</div>
<p>${DIEM}</p>
${BANG_DE}
<div class="ml-en">
<p>Read the "choice" column together with the walk-back rule: v = 6 — dp[6] = dp[5] = 18, so 6 was skipped; v = 5 was taken (18 ≠ 7), jump to 3; dp[3] = dp[2], skip; dp[2] = dp[1], skip; v = 1 taken. Values {1, 5}: 3 + 15 = 18, exactly the output above. Notice v = 3 has 0 points and is "skipped" for free — that gap is why taking 4 costs nothing on its left: dp[2] = 3 (the three 1s) plus 4 gives 7. Also notice the row for v = 6 says "skip" although 6 is worth 6 points: taking it would forbid 5, which is worth 15.</p>
</div>
<div class="ml-vi">
<p>Đọc cột "choice" cùng với luật đi ngược: v = 6 — dp[6] = dp[5] = 18, nên 6 bị bỏ; v = 5 được lấy (18 ≠ 7), nhảy về 3; dp[3] = dp[2], bỏ; dp[2] = dp[1], bỏ; v = 1 được lấy. Các giá trị {1, 5}: 3 + 15 = 18, đúng output ở trên. Để ý v = 3 có 0 điểm và bị "bỏ" miễn phí — chính khoảng trống đó làm việc lấy 4 không mất gì ở bên trái: dp[2] = 3 (ba số 1) cộng 4 ra 7. Cũng để ý dòng v = 6 ghi "skip" dù 6 đáng 6 điểm: lấy nó sẽ cấm 5, mà 5 đáng 15 điểm.</p>
</div>

<div class="ml-en">
<h3>Worked example 2: a state machine — Stock with Cooldown</h3>
<p><strong>Problem (in our words).</strong> <code>prices[d]</code> is a share's price on day d. You may buy and sell as many times as you like, holding at most one share, but after a sale you must wait one full day before buying again. Maximise profit. Example: <code>[1, 2, 3, 0, 2]</code> → 3 (buy 1, sell 2, cool down, buy 0, sell 2).</p>
<p><strong>Choosing the state.</strong> "dp[d] = best profit after day d" is not enough — the future depends on whether you hold a share and whether you are cooling down. So name the situations, exactly like the save file: at the end of a day you are in one of three situations.</p>
<ul>
<li><strong>hold</strong>: you own a share.</li>
<li><strong>sold</strong>: you sold today, so tomorrow is a forced cooldown.</li>
<li><strong>rest</strong>: you own nothing and are free to buy tomorrow.</li>
</ul>
<p><strong>Transitions</strong> (each from yesterday's values): hold = max(hold, rest − p) — keep holding, or buy today, and only from <em>rest</em>, never right after selling; sold = hold + p; rest = max(rest, sold) — do nothing, and yesterday's sale finishes cooling down. <strong>Base:</strong> before day 0, hold and sold are impossible (−∞), rest = 0. <strong>Answer:</strong> max(sold, rest) on the last day — ending while holding a share is never best.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu 2: máy trạng thái — mua bán cổ phiếu có ngày nghỉ</h3>
<p><strong>Đề (diễn đạt lại).</strong> <code>prices[d]</code> là giá một cổ phiếu ngày d. Bạn được mua bán bao nhiêu lần tuỳ ý, mỗi lúc giữ tối đa một cổ phiếu, nhưng sau khi bán phải đợi trọn một ngày mới được mua lại (cooldown — ngày nghỉ). Tìm lãi lớn nhất. Ví dụ: <code>[1, 2, 3, 0, 2]</code> → 3 (mua 1, bán 2, nghỉ, mua 0, bán 2).</p>
<p><strong>Chọn trạng thái.</strong> "dp[d] = lãi tốt nhất sau ngày d" là chưa đủ — tương lai phụ thuộc vào việc bạn có đang giữ cổ phiếu không và có đang trong ngày nghỉ không. Vậy hãy gọi tên các tình huống, y như tệp lưu game: cuối mỗi ngày bạn ở một trong ba tình huống.</p>
<ul>
<li><strong>hold</strong> (đang giữ): bạn đang có một cổ phiếu.</li>
<li><strong>sold</strong> (vừa bán): bạn bán hôm nay, nên ngày mai bắt buộc nghỉ.</li>
<li><strong>rest</strong> (rảnh): bạn không giữ gì và ngày mai được mua.</li>
</ul>
<p><strong>Công thức chuyển</strong> (mỗi cái tính từ giá trị của hôm qua): hold = max(hold, rest − p) — giữ tiếp, hoặc mua hôm nay, và chỉ mua được từ <em>rest</em>, không bao giờ ngay sau khi bán; sold = hold + p; rest = max(rest, sold) — không làm gì, và lần bán hôm qua đã nghỉ xong. <strong>Cơ sở:</strong> trước ngày 0, hold và sold là bất khả (−∞), rest = 0. <strong>Đáp án:</strong> max(sold, rest) ở ngày cuối — kết thúc mà còn ôm cổ phiếu thì không bao giờ là tốt nhất.</p>
${csd('csd201-slide-cs4-2', 'vi', 'CS.4 Quy hoạch động (4): lưới, xâu đối xứng, DP khoảng, máy trạng thái', '<p>Slide CS.4 phần 4 giới thiệu DP máy trạng thái bằng sơ đồ các trạng thái và mũi tên. Ôn nhanh một câu: <em>mỗi trạng thái là một biến, mỗi mũi tên là một hạng trong max</em>. <strong>Ở đây đi sâu thêm:</strong> cách TÌM ra các trạng thái từ câu "tương lai cần biết gì", cái bẫy quên một trạng thái (chạy thật ra lãi 4 thay vì 3), và cách cập nhật ba biến cùng lúc cho đúng.</p>')}
</div>
${maHai('ch09/b4/cooldown.ts', 'ch09/b4/NdCooldown.java', { vung: 'giai' })}
<div class="ml-en">
<p>The whole table for <code>[1, 2, 3, 0, 2]</code> (grey = input row, blue = a day where "buy from rest" won, green = the answer). −∞ means "impossible so far":</p>
</div>
<div class="ml-vi">
<p>Toàn bộ bảng cho <code>[1, 2, 3, 0, 2]</code> (xám = hàng đầu vào, xanh dương = ngày mà "mua từ rest" thắng, xanh lá = đáp án). −∞ nghĩa là "chưa thể xảy ra":</p>
</div>
${BANG_CD}
<div class="ml-en">
<p>Read the table column by column. Day 0: buying costs 1 ⇒ hold −1. Day 1: selling gives −1 + 2 = 1 ⇒ sold 1. Day 2: sold = −1 + 3 = 2, but the better plan is hidden in <em>rest</em>: day 2's rest takes day 1's sale (1). Day 3: buying at 0 from rest 1 gives hold 1. Day 4: selling at 2 gives sold 3. The answer, max(sold 3, rest 2) = ${VCD.dapAn}. The cooldown is enforced by the shape of the transitions, not by an if-statement: <em>hold</em> can only be entered from <em>rest</em>, and <em>rest</em> only absorbs a sale one day later.</p>
${moPhong('ch09/b4/cooldown.sim.js', 'en', 'Stock with cooldown: three states, one day at a time', 'Opens /algorithms: the 3 × 5 table fills column by column, with the two cells of yesterday each new value reads.')}
</div>
<div class="ml-vi">
<p>Đọc bảng theo từng cột. Ngày 0: mua mất 1 ⇒ hold −1. Ngày 1: bán được −1 + 2 = 1 ⇒ sold 1. Ngày 2: sold = −1 + 3 = 2, nhưng kế hoạch tốt hơn đang nằm trong <em>rest</em>: rest của ngày 2 nhận lấy lần bán của ngày 1 (1). Ngày 3: mua ở giá 0 từ rest 1 cho hold 1. Ngày 4: bán ở giá 2 cho sold 3. Đáp án: max(sold 3, rest 2) = ${VCD.dapAn}. Ngày nghỉ được bảo đảm bằng HÌNH DẠNG của các mũi chuyển, không cần câu lệnh if nào: chỉ vào được <em>hold</em> từ <em>rest</em>, và <em>rest</em> chỉ nhận một lần bán sau một ngày.</p>
${moPhong('ch09/b4/cooldown.sim.js', 'vi', 'Mua bán có ngày nghỉ: ba trạng thái, từng ngày một', 'Mở trang /algorithms: bảng 3 × 5 được điền theo từng cột, kèm hai ô của hôm qua mà mỗi giá trị mới đọc tới.')}
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap — a state that is missing a dimension still compiles, still runs, and answers a different problem.</strong></p><p>Drop the cooldown and keep only two situations (hold / free). The code looks almost the same:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một trạng thái thiếu một chiều vẫn biên dịch, vẫn chạy, và trả lời một bài khác.</strong></p><p>Bỏ ngày nghỉ, chỉ giữ hai tình huống (giữ / rảnh). Code trông gần như y hệt:</p></div>
</div>
${ma('ch09/b4/cooldown.ts', { vung: 'sai', nhan: 'TypeScript — wrong state' })}
${ketQua('ch09/b4/cooldown.ts')}
<div class="ml-en">
<p>On <code>[1, 2, 3, 0, 2]</code> the two-state version answers 4: it sells on day 2 and buys again on day 3, which the rules forbid. On a falling market (<code>[5,4,3,2,1]</code>) and a single day both versions agree — the examples you are most likely to try by hand do not reveal the bug. The defence is the save-file question asked honestly: "does the future depend on anything my state does not record?" Here: "can I buy tomorrow?" depends on "did I sell today?", so that fact must be in the state. The last line is the other defence: a random self-test against a brute force over every sequence of actions, 2,000 cases, 0 mismatches.</p>
</div>
<div class="ml-vi">
<p>Trên <code>[1, 2, 3, 0, 2]</code> bản hai trạng thái trả lời 4: nó bán ngày 2 rồi mua lại ngay ngày 3, điều luật chơi cấm. Trên thị trường đi xuống (<code>[5,4,3,2,1]</code>) và trên một ngày duy nhất thì hai bản trùng nhau — đúng những ví dụ bạn hay thử tay nhất lại không làm lộ lỗi. Cách phòng là hỏi thật lòng câu hỏi của tệp lưu: "tương lai có phụ thuộc vào điều gì mà trạng thái của tôi không ghi lại không?" Ở đây: "mai có được mua không?" phụ thuộc "hôm nay có vừa bán không?", nên điều đó phải nằm trong trạng thái. Dòng cuối là cách phòng thứ hai: tự kiểm ngẫu nhiên so với vét cạn mọi chuỗi hành động, 2.000 ca, 0 chỗ lệch.</p>
</div>

<div class="ml-en">
<h3>Worked example 3: "ending here" on a grid — Maximal Square</h3>
<p><strong>Problem (in our words).</strong> In a grid of '0' and '1', find the area of the largest square made only of '1's. Our grid below has a 3 × 3 square, area 9.</p>
<p><strong>Choosing the state.</strong> "dp = largest square in the top-left part" (the prefix family) gives no usable transition — knowing the best square somewhere above tells you nothing about the cell you are on. Switch family: <strong>dp[r][c] = side of the largest all-'1' square whose bottom-right corner is exactly (r, c)</strong>. Now the transition is a small geometric fact: a square of side k ends at (r, c) only if squares of side k − 1 end at the cell above, the cell to the left and the cell diagonally up-left. So dp[r][c] = 1 + min(up, left, up-left) when the cell is '1', else 0. <strong>Base:</strong> an extra row and column of zeros, so the border needs no special case. <strong>Order:</strong> row by row, left to right. <strong>Answer:</strong> the maximum over all cells, squared — "ending here" states always need a final max, unlike prefix states whose answer is the last cell.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu 3: "kết thúc tại đây" trên lưới — Maximal Square</h3>
<p><strong>Đề (diễn đạt lại).</strong> Trên một lưới gồm '0' và '1', tìm diện tích hình vuông lớn nhất chỉ gồm các ô '1'. Lưới của ta bên dưới có một hình vuông 3 × 3, diện tích 9.</p>
<p><strong>Chọn trạng thái.</strong> "dp = hình vuông lớn nhất ở phần trên bên trái" (họ tiền tố) không cho ra công thức chuyển dùng được — biết hình vuông tốt nhất ở đâu đó phía trên chẳng nói gì về ô bạn đang đứng. Đổi họ: <strong>dp[r][c] = cạnh của hình vuông toàn '1' lớn nhất có góc DƯỚI-PHẢI đúng tại (r, c)</strong>. Giờ công thức chuyển là một sự thật hình học nhỏ: một hình vuông cạnh k kết thúc tại (r, c) chỉ khi có hình vuông cạnh k − 1 kết thúc ở ô phía trên, ô bên trái và ô chéo trên-trái. Vậy dp[r][c] = 1 + min(trên, trái, chéo) nếu ô là '1', ngược lại 0. <strong>Cơ sở:</strong> thêm một hàng và một cột số 0, để viền không cần xử lý riêng. <strong>Thứ tự:</strong> từng hàng, trái sang phải. <strong>Đáp án:</strong> giá trị lớn nhất trên mọi ô, bình phương lên — trạng thái "kết thúc tại đây" luôn cần một phép max cuối cùng, khác với trạng thái tiền tố có đáp án nằm ở ô cuối.</p>
</div>
${maHai('ch09/b4/square.ts', 'ch09/b4/NdSquare.java', { vung: 'square' })}
${BANG_SQ_IN}
${BANG_SQ}
<div class="ml-en">
<p>The input on top (green = '1'), the filled dp table below (grey = padding, green = the winning square, dark green = its bottom-right corner). The 3 sits at (r3, c3) because its three neighbours are all 2: three overlapping 2 × 2 squares glue into one 3 × 3. The min in the transition is the whole proof: if any neighbour were 1, a hole would sit inside the bigger square.</p>
</div>
<div class="ml-vi">
<p>Đầu vào ở trên (xanh = '1'), bảng dp đã điền ở dưới (xám = phần đệm, xanh lá = hình vuông thắng, xanh đậm = góc dưới-phải của nó). Số 3 nằm ở (r3, c3) vì ba láng giềng của nó đều là 2: ba hình vuông 2 × 2 chồng lên nhau dán thành một hình 3 × 3. Phép min trong công thức chính là toàn bộ chứng minh: nếu một láng giềng nào đó chỉ là 1, sẽ có một lỗ hổng nằm bên trong hình vuông lớn.</p>
</div>

<div class="ml-en">
<h3>Choosing the order: Triangle, solved upside down</h3>
<p><strong>Problem (in our words).</strong> A triangle of numbers; from the apex, step down to one of the two adjacent numbers in the row below; minimise the sum to the bottom. Top-down you would need dp for every cell of the last row and then a final min. Bottom-up is cleaner: <strong>state</strong> below[c] = cheapest path from (r, c) <em>down to the bottom</em>; <strong>base</strong> = the last row itself; <strong>transition</strong> x + min(below[c], below[c+1]); <strong>order</strong> from the second-to-last row up; <strong>answer</strong> the single cell at the apex. Choosing the direction so that the base case is trivial and the answer is one cell is a decision worth saying aloud.</p>
</div>
<div class="ml-vi">
<h3>Chọn thứ tự tính: Triangle, giải ngược từ đáy</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một tam giác số; từ đỉnh, mỗi bước đi xuống một trong hai số kề ở hàng dưới; tìm tổng nhỏ nhất xuống tới đáy. Đi từ trên xuống thì bạn cần dp cho mọi ô ở hàng cuối rồi lấy min thêm một lần. Đi từ dưới lên gọn hơn: <strong>trạng thái</strong> below[c] = đường rẻ nhất từ (r, c) <em>xuống tới đáy</em>; <strong>cơ sở</strong> = chính hàng cuối; <strong>chuyển</strong> x + min(below[c], below[c+1]); <strong>thứ tự</strong> từ hàng áp chót đi lên; <strong>đáp án</strong> là ô duy nhất ở đỉnh. Chọn chiều đi sao cho ca cơ sở tầm thường và đáp án là một ô là một quyết định đáng nói ra.</p>
</div>
${maHai('ch09/b4/square.ts', 'ch09/b4/NdSquare.java', { vung: 'triangle' })}
${ketQua('ch09/b4/square.ts')}
<div class="ml-en">
<p>In the Java version one array is reused in place: <code>below[c]</code> is read for the last time while computing position c, before being overwritten, and <code>below[c + 1]</code> is still the old row — left-to-right is safe here. The second triangle checks negative numbers: −3 → −1 → −9 = −13.</p>
</div>
<div class="ml-vi">
<p>Ở bản Java, một mảng được dùng lại tại chỗ: <code>below[c]</code> được đọc lần cuối lúc tính vị trí c, trước khi bị ghi đè, còn <code>below[c + 1]</code> vẫn là hàng cũ — đi trái sang phải ở đây là an toàn. Tam giác thứ hai kiểm số âm: −3 → −1 → −9 = −13.</p>
</div>

<div class="ml-en">
<h3>The memo key is part of the algorithm: measured</h3>
<p>Two-dimensional memo tables tempt you to write <code>memo.get(i + "," + j)</code> — readable, and on LeetCode it often passes. But it builds a new string on every call and hashes it. The same memoised LCS on two random DNA-like strings, four ways to store the memo:</p>
</div>
<div class="ml-vi">
<h3>Khoá memo cũng là một phần của thuật toán: đo thật</h3>
<p>Memo hai chiều dễ dụ bạn viết <code>memo.get(i + "," + j)</code> — dễ đọc, và trên LeetCode thường vẫn qua. Nhưng nó dựng một chuỗi mới ở MỖI lời gọi rồi đem băm. Cùng một LCS có nhớ trên hai chuỗi ngẫu nhiên kiểu ADN, bốn cách cất memo:</p>
</div>
${ma('ch09/b4/khoa-memo-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch09/b4/khoa-memo-do.ts')}
${ketQua('ch09/b4/KhoaMemoDo.java')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap — string memo keys: same complexity, 25× slower.</strong></p><p>At L = 1,000 (about a million states) Node needs 412.0 ms with string keys, 107.5 ms with a number key in a Map, 16.8 ms with a flat <code>Int32Array</code> and 3.3 ms bottom-up. Java shows the same order: 98.4 → 40.1 → 9.6 → 2.6 ms. All four are O(n·m); the constant differs by about 25× between the first and the third, and over 100× to the table. When an interviewer's hidden tests have n = m = 5,000 (25 million states), that constant is the difference between Accepted and Time Limit Exceeded — and string keys also cost tens of bytes per entry. Rule: index states with numbers (<code>i * (m + 1) + j</code>) or a real 2D array; use a <code>Map</code> only when the state space is sparse or not a small range of integers.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy — khoá memo dạng chuỗi: cùng độ phức tạp, chậm gấp 25 lần.</strong></p><p>Ở L = 1.000 (khoảng một triệu trạng thái), Node cần 412,0 ms với khoá chuỗi, 107,5 ms với khoá số trong Map, 16,8 ms với <code>Int32Array</code> phẳng và 3,3 ms với bản từ dưới lên. Java cho cùng thứ tự: 98,4 → 40,1 → 9,6 → 2,6 ms. Cả bốn đều O(n·m); hằng số chênh khoảng 25 lần giữa cách thứ nhất và thứ ba, và hơn 100 lần so với bản bảng. Khi test ẩn có n = m = 5.000 (25 triệu trạng thái), hằng số đó là ranh giới giữa Accepted và Time Limit Exceeded — chưa kể khoá chuỗi còn tốn vài chục byte mỗi mục. Luật: đánh chỉ số trạng thái bằng số (<code>i * (m + 1) + j</code>) hoặc mảng 2 chiều thật; chỉ dùng <code>Map</code> khi không gian trạng thái thưa hoặc không phải một dải số nguyên nhỏ.</p></div>
</div>

<div class="ml-en">
<h3>Where this skill lives in real work</h3>
<ul>
<li><strong>Spreadsheets are DP tables.</strong> A cell's formula reads other cells; Excel and Google Sheets recompute cells in an order where every input is ready — the "order of computation" sentence, done for you. A "circular reference" warning is a DP whose order cannot exist, because a cell would have to read itself.</li>
<li><strong>Cache keys are states.</strong> Lesson 9.1 showed this site's GIF route turning its key from the query into <code>query@offset</code> when paging arrived: a key missing one input returns another page's answer. Asking "does the answer depend on anything my key does not record?" is the save-file question, and it prevents the same class of bug in caches and in DP.</li>
<li><strong>Recognising a known problem in disguise</strong> is how senior engineers work: "this deployment ordering is a topological sort", "this text comparison is an edit distance", "this budget allocation is a knapsack". Lesson 9.3 shows that very knapsack hiding inside sprint planning in this repo.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Kỹ năng này sống ở đâu trong công việc thật</h3>
<ul>
<li><strong>Bảng tính chính là bảng DP.</strong> Công thức của một ô đọc các ô khác; Excel và Google Sheets tính lại các ô theo một thứ tự mà mọi đầu vào đều đã sẵn — câu "thứ tự tính" được làm hộ bạn. Cảnh báo "tham chiếu vòng" (circular reference) là một DP không thể có thứ tự tính, vì một ô sẽ phải đọc chính nó.</li>
<li><strong>Khoá cache là trạng thái.</strong> Bài 9.1 cho thấy route GIF của trang này đổi khoá từ câu tìm kiếm thành <code>query@offset</code> khi có phân trang: một khoá thiếu một đầu vào sẽ trả đáp án của trang khác. Hỏi "đáp án có phụ thuộc vào điều gì mà khoá của tôi không ghi lại không?" chính là câu hỏi của tệp lưu game, và nó chặn cùng một loại lỗi ở cả cache lẫn DP.</li>
<li><strong>Nhận ra bài quen đội lốt</strong> là cách kỹ sư lâu năm làm việc: "thứ tự triển khai này là sắp xếp topo", "phép so văn bản này là khoảng cách sửa", "việc chia ngân sách này là bài cái túi". Bài 9.3 chỉ ra đúng bài cái túi đó đang nằm trong phần lập kế hoạch sprint của repo này.</li>
</ul>
${lienKet({ bai: 'dsa-9-3-hai-chieu', title: '9.3 — Quy hoạch động hai chiều', sub: 'Cái túi trong lập kế hoạch sprint, LCS trong diff, khoảng cách sửa trong gợi ý "Did you mean"', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Typing before the state sentence exists — then patching special cases until the code "works" on the examples.</li>
<li>A state missing a dimension (cooldown, "holding or not", "how many transactions left"): it runs and answers a different problem.</li>
<li>Choosing the prefix family when the transition needs "ending here" (Maximal Square, LIS) — and forgetting the final max when you do use "ending here".</li>
<li>Not recognising a known problem in disguise and re-deriving it under pressure (Delete and Earn = House Robber, Uncrossed Lines = LCS).</li>
<li>Updating several state variables one by one so the second reads the first's <em>new</em> value — compute all from yesterday, then assign together.</li>
<li>String keys for dense integer states; a Map where a 2D array would do.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Gõ code khi chưa có câu trạng thái — rồi vá các ca đặc biệt cho tới khi code "chạy được" trên ví dụ.</li>
<li>Trạng thái thiếu một chiều (ngày nghỉ, "đang giữ hay không", "còn mấy lượt giao dịch"): vẫn chạy, nhưng trả lời một bài khác.</li>
<li>Chọn họ tiền tố khi công thức cần "kết thúc tại đây" (Maximal Square, LIS) — và quên phép max cuối cùng khi đã dùng "kết thúc tại đây".</li>
<li>Không nhận ra bài quen đội lốt nên phải tự suy lại dưới áp lực (Delete and Earn = House Robber, Uncrossed Lines = LCS).</li>
<li>Cập nhật nhiều biến trạng thái lần lượt, khiến biến thứ hai đọc phải giá trị <em>mới</em> của biến thứ nhất — hãy tính tất cả từ giá trị hôm qua rồi gán cùng lúc.</li>
<li>Khoá chuỗi cho trạng thái số nguyên dày đặc; dùng Map ở chỗ mảng 2 chiều là đủ.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Với mỗi đề: viết bốn câu vào sổ TRƯỚC, ghi rõ nó thuộc họ trạng thái nào, rồi mới code. Lời giải từng bước của 8 đề tổng hợp nằm ở bài <a href="${baiNay('dsa-9-6-luyen')}">9.6 — Bộ luyện 9</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Close this page. Say the Delete and Earn exchange out loud in English, in under 4 minutes, from the clarifying question to the four sentences. Record yourself if you can.</li>
<li>For LC 714 (stock with a fee), write the state machine first: the situations, the arrows, the base, the answer. Then code and submit.</li>
<li>Write Maximal Square with the prefix-family state on purpose and find the input where it breaks; then fix it with "ending here".</li>
<li>Take any three problems from lessons 9.2–9.3 and classify each one into a family from the table above, in one line each.</li>
</ol>
<p><strong>Done when:</strong> the spoken explanation reaches the four sentences without notes, LC 740 and LC 714 are accepted, and your notebook has three "problem → family → state sentence" lines.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state</span><span class="v">The smallest summary of the past that the rest of the problem needs — the "save file".</span></div>
  <div class="kv"><span class="k">state family</span><span class="v">A standard shape of state sentence: prefix, ending here, remaining amount, two sequences, interval, grid, state machine.</span></div>
  <div class="kv"><span class="k">state machine DP</span><span class="v">A few named situations per step, with transitions between them as arrows.</span></div>
  <div class="kv"><span class="k">reduction (in disguise)</span><span class="v">Transforming a new problem into a known one (Delete and Earn → House Robber).</span></div>
  <div class="kv"><span class="k">reconstruction</span><span class="v">Walking the filled table backwards to recover which choices produced the optimum.</span></div>
  <div class="kv"><span class="k">number of states × transition cost</span><span class="v">The complexity of any DP; compute it from the constraints before coding.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Recognise DP by writing the brute force as a recursion and checking whether its arguments repeat.</li>
<li>The state is the arguments of that recursion: the smallest "save file" the future needs.</li>
<li>Try the families in turn — prefix, ending here, remaining amount, two sequences, interval, grid, state machine.</li>
<li>Delete and Earn is House Robber on values; Stock with Cooldown is three states; Maximal Square is "ending here".</li>
<li>A missing dimension still compiles: test against a brute force.</li>
<li>Memo keys matter: string keys measured 25× slower than an indexed array for the same O(n·m).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D and 2-D Dynamic Programming', 'Problems grouped by pattern, with video explanations', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Introduction to Dynamic Programming — cp-algorithms', 'States, transitions and the top-down vs bottom-up choice, with exercises', 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html')}
${nguon('📘', 'Finite-state machine — Wikipedia', 'The model behind "state machine DP": states, inputs and transitions', 'https://en.wikipedia.org/wiki/Finite-state_machine')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đóng trang này. Nói to cuộc hội thoại Delete and Earn bằng tiếng Anh trong dưới 4 phút, từ câu hỏi làm rõ tới bốn câu. Ghi âm lại nếu được.</li>
<li>Với LC 714 (mua bán có phí), vẽ máy trạng thái trước: các tình huống, các mũi tên, cơ sở, đáp án. Rồi code và nộp.</li>
<li>Cố ý viết Maximal Square với trạng thái họ tiền tố và tìm đầu vào làm nó sai; rồi sửa bằng "kết thúc tại đây".</li>
<li>Lấy ba đề bất kỳ của bài 9.2–9.3 và xếp mỗi đề vào một họ trong bảng ở trên, mỗi đề một dòng.</li>
</ol>
<p><strong>Đạt khi:</strong> phần nói tới được bốn câu mà không cần nhìn ghi chú, LC 740 và LC 714 Accepted, và sổ có ba dòng "đề → họ → câu trạng thái".</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state (trạng thái)</span><span class="v">Bản tóm tắt nhỏ nhất của quá khứ mà phần còn lại của bài cần — "tệp lưu game".</span></div>
  <div class="kv"><span class="k">state family (họ trạng thái)</span><span class="v">Một khuôn câu trạng thái chuẩn: tiền tố, kết thúc tại đây, phần còn lại, hai dãy, khoảng, lưới, máy trạng thái.</span></div>
  <div class="kv"><span class="k">state machine DP (DP máy trạng thái)</span><span class="v">Vài tình huống có tên ở mỗi bước, chuyển giữa chúng là các mũi tên.</span></div>
  <div class="kv"><span class="k">reduction (quy về bài quen — "đội lốt")</span><span class="v">Biến một đề mới thành một đề đã biết (Delete and Earn → House Robber).</span></div>
  <div class="kv"><span class="k">reconstruction (khôi phục lời giải)</span><span class="v">Đi ngược bảng đã điền để tìm lại những lựa chọn tạo ra giá trị tối ưu.</span></div>
  <div class="kv"><span class="k">states × transition cost (số trạng thái × chi phí chuyển)</span><span class="v">Độ phức tạp của mọi DP; tính từ ràng buộc trước khi code.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Nhận ra DP bằng cách viết vét cạn dạng đệ quy và kiểm xem tham số của nó có lặp lại không.</li>
<li>Trạng thái là các tham số của hàm đệ quy đó: "tệp lưu" nhỏ nhất mà tương lai cần.</li>
<li>Thử lần lượt các họ — tiền tố, kết thúc tại đây, phần còn lại, hai dãy, khoảng, lưới, máy trạng thái.</li>
<li>Delete and Earn là House Robber trên các giá trị; Stock with Cooldown là ba trạng thái; Maximal Square là "kết thúc tại đây".</li>
<li>Trạng thái thiếu một chiều vẫn biên dịch được: hãy kiểm so với vét cạn.</li>
<li>Khoá memo có ý nghĩa: khoá chuỗi đo được chậm 25 lần so với mảng đánh chỉ số, cùng O(n·m).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D và 2-D Dynamic Programming', 'Đề gom theo mẫu, có video giải thích (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Introduction to Dynamic Programming — cp-algorithms', 'Trạng thái, chuyển, và chọn từ trên xuống hay từ dưới lên, có bài tập', 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html')}
${nguon('📘', 'Finite-state machine — Wikipedia', 'Mô hình đằng sau "DP máy trạng thái": trạng thái, đầu vào và các mũi chuyển', 'https://en.wikipedia.org/wiki/Finite-state_machine')}
</div>
`,
};
