/** 9.2 — Quy hoạch động một chiều. Mọi mã/output đọc từ ../ma/ch09/b2 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { vetRob } from '../ma/ch09/b2/house-robber.vet.mjs';
import { vetCoin } from '../ma/ch09/b2/coin-change.vet.mjs';
import { vetLis, vetLisN2 } from '../ma/ch09/b2/lis.vet.mjs';
import { vetKadane } from '../ma/ch09/b2/kadane.vet.mjs';

/* ── Bảng vết House Robber (chạy thật) ─────────────────────────────────────────────────────────────── */
const NUMS = [2, 7, 9, 3, 1, 5, 8];
const VR = vetRob(NUMS);
const BANG_ROB = bangVet(['i', 'nums[i]', 'skip = dp[i−1]', 'rob = nums[i] + dp[i−2]', 'dp after step i', 'choice'],
  VR.hang.map((h) => [
    String(h.i),
    String(NUMS[h.i]),
    h.bo == null ? '—' : String(h.bo),
    String(h.lay),
    oMang(h.dp.map((v) => (v == null ? '·' : v)), { to: { ...(h.i >= 2 ? { [h.i - 2]: 'r' } : {}), ...(h.i >= 1 ? { [h.i - 1]: 'cs' } : {}), [h.i]: 'ok' } }),
    h.chon === 'base' ? 'base' : h.chon === 'rob' ? `rob ${NUMS[h.i]}` : `skip ${NUMS[h.i]}`,
  ]).concat([[
    'back',
    '', '', '',
    oMang(VR.dp, { to: Object.fromEntries(VR.nhaLay.map((i) => [i, 'ok'])) }),
    `houses ${VR.nhaLay.join(', ')} ⇒ ${VR.nhaLay.map((i) => NUMS[i]).join(' + ')} = ${VR.dp[NUMS.length - 1]}`,
  ]]));

/* ── Bảng vết Coin Change [1, 3, 4], amount 6 ─────────────────────────────────────────────────────── */
const COINS = [1, 3, 4];
const VC = vetCoin(COINS, 6);
const BANG_COIN = bangVet(['a', 'candidates (last coin c)', 'dp[0..6] after a', 'best from'],
  VC.hang.map((h) => [
    String(h.a),
    h.ungVien.join('<br>'),
    oMang(h.dp.map((v) => (v === Infinity ? '∞' : v)), { to: { [h.a]: 'ok', ...(h.tu >= 0 ? { [h.tu]: 'cs' } : {}) }, chiSo: true }),
    h.tu >= 0 ? `dp[${h.tu}] + coin ${h.a - h.tu}` : '—',
  ]));

/* ── Bảng vết LIS ──────────────────────────────────────────────────────────────────────────────────── */
const LIS_A = [2, 6, 3, 7, 1, 8, 4];
const VL = vetLis(LIS_A);
const BANG_TAILS = bangVet(['step', 'x', 'tails before', 'firstTrue(0, len, tails[i] ≥ x)', 'tails after'],
  VL.map((h) => [
    String(h.idx),
    String(h.x),
    h.truoc.length ? oMang(h.truoc, { chiSo: true }) : '[ ]',
    h.noi ? `k = ${h.k} = len ⇒ push` : `k = ${h.k} ⇒ replace ${h.truoc[h.k]} by ${h.x}`,
    oMang(h.sau, { to: { [h.k]: h.noi ? 'ok' : 'r' }, chiSo: true }),
  ]));
const VN2 = vetLisN2(LIS_A);
const DONG_N2 = `<p><strong>nums</strong> ${oMang(LIS_A, { to: Object.fromEntries(VN2.day.map((i) => [i, 'ok'])), chiSo: true })}</p>\n` +
  `<p><strong>dp</strong> ${oMang(VN2.dp, { to: Object.fromEntries(VN2.day.map((i) => [i, 'ok'])), chiSo: true })} &nbsp; <strong>prev</strong> ${oMang(VN2.truoc.map((v) => (v < 0 ? '–' : v)), { chiSo: true })}</p>`;

/* ── Bảng vết Kadane ───────────────────────────────────────────────────────────────────────────────── */
const KA = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const VK = vetKadane(KA);
const BANG_KADANE = bangVet(['i', 'nums[i]', 'endHere = max(nums[i], endHere + nums[i])', 'run kept', 'best (range)'],
  VK.map((h) => [
    String(h.i),
    String(h.x),
    `${h.endHere}${h.i === 0 ? ' (base)' : h.moi ? ' ← start fresh' : ' ← extend'}`,
    `[${KA.slice(h.start, h.i + 1).join(', ')}]`,
    `${h.best} [${h.bestL}..${h.bestR}]`,
  ]));
const DONG_KADANE = `<p>${oMang(KA, { tu: VK[VK.length - 1].bestL, den: VK[VK.length - 1].bestR, chiSo: true })}</p>`;

const L = {
  rob: lc(198, 'house-robber', 'House Robber', 'Medium'),
  rob2: lc(213, 'house-robber-ii', 'House Robber II', 'Medium'),
  coin: lc(322, 'coin-change', 'Coin Change', 'Medium'),
  coin2: lc(518, 'coin-change-ii', 'Coin Change II', 'Medium'),
  cs4: lc(377, 'combination-sum-iv', 'Combination Sum IV', 'Medium'),
  decode: lc(91, 'decode-ways', 'Decode Ways', 'Medium'),
  wb: lc(139, 'word-break', 'Word Break', 'Medium'),
  lis: lc(300, 'longest-increasing-subsequence', 'Longest Increasing Subsequence', 'Medium'),
  max: lc(53, 'maximum-subarray', 'Maximum Subarray', 'Medium'),
};

const DE = [
  [L.rob, 'Take or skip each house; the choice depends on the previous two answers.', 'Lấy hay bỏ từng nhà; lựa chọn chỉ phụ thuộc hai đáp án trước.'],
  [L.rob2, 'Circle ⇒ first and last cannot both be taken ⇒ two straight-line runs.', 'Vòng tròn ⇒ nhà đầu và nhà cuối không thể cùng lấy ⇒ chạy hai lần trên đường thẳng.'],
  [L.max, 'State "best sum ENDING at i" — Kadane is a two-variable DP.', 'Trạng thái "tổng lớn nhất KẾT THÚC tại i" — Kadane là DP hai biến.'],
  [L.coin, 'Fewest items to reach an amount, unlimited reuse ⇒ dp over amounts, min of dp[a − c] + 1.', 'Ít món nhất để đạt một tổng, dùng lại thoải mái ⇒ dp theo tổng, min của dp[a − c] + 1.'],
  [L.coin2, 'Count combinations ⇒ coins in the OUTER loop.', 'Đếm tổ hợp ⇒ đồng xu ở vòng NGOÀI.'],
  [L.cs4, 'Count ordered sequences ⇒ amount in the OUTER loop (same code, loops swapped).', 'Đếm dãy có thứ tự ⇒ tổng ở vòng NGOÀI (cùng mã, đổi chỗ hai vòng).'],
  [L.decode, 'dp over prefixes; one digit or two digits; zeros are the whole difficulty.', 'dp theo tiền tố; đọc một chữ số hay hai; khó nằm hết ở số 0.'],
  [L.wb, 'dp[i] = prefix of length i can be cut; try every last word.', 'dp[i] = tiền tố dài i cắt được; thử mọi từ cuối.'],
  [L.lis, 'O(n²) dp ending at i, then tails + binary search (Chapter 4 template).', 'O(n²) dp kết thúc tại i, rồi tails + nhị phân (khuôn Chương 4).'],
  [lc(983, 'minimum-cost-for-tickets', 'Minimum Cost For Tickets', 'Medium'), 'Coin Change in disguise: dp over days, three "coins" (1, 7, 30-day passes).', 'Coin Change đội lốt: dp theo ngày, ba "đồng xu" (vé 1, 7, 30 ngày).'],
  [lc(2140, 'solving-questions-with-brainpower', 'Solving Questions With Brainpower', 'Medium'), 'House Robber where "rob" skips a variable number of houses — fill right to left.', 'House Robber mà "lấy" thì bỏ qua số nhà thay đổi — điền từ phải sang trái.'],
  [lc(673, 'number-of-longest-increasing-subsequence', 'Number of Longest Increasing Subsequence', 'Medium'), 'O(n²) LIS with a second array: how many runs reach each length.', 'LIS O(n²) thêm một mảng: có bao nhiêu dãy đạt mỗi độ dài.'],
  [lc(354, 'russian-doll-envelopes', 'Russian Doll Envelopes', 'Hard'), 'Sort by width ascending, height DESCENDING, then LIS on heights in O(n log n).', 'Sắp theo rộng tăng, cao GIẢM, rồi LIS trên chiều cao O(n log n).'],
];

export default {
  title: '9.2 — One-dimensional DP: robbers, coins, decoding, word break, LIS, Kadane|||9.2 — Quy hoạch động một chiều: kẻ trộm, đổi tiền, giải mã, tách từ, LIS, Kadane',
  slug: 'dsa-9-2-mot-chieu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bảy đề DP một chiều kinh điển giải bằng cùng một khuôn bốn câu hỏi — kèm bảng dp tô màu từng bước, hai mô phỏng, bẫy tràn số Integer.MAX_VALUE và đổi thứ tự vòng lặp, đo đệ quy tách từ nổ hàm mũ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>One-dimensional DP: robbers, coins, decoding, word break, LIS, Kadane</h2>
<p class="lead">Lesson 9.1 turned a slow recursion into a table. This lesson uses that table on seven problems that interviewers ask again and again. They look unrelated — robbing houses, paying with coins, decoding a message, cutting a string into words, finding a rising sequence, the best stretch of profit — but every one is a <strong>one-dimensional</strong> table: one row of answers, <code>dp[0], dp[1], …</code>, where each cell is built from a few cells before it. You will solve each with the same four questions, see each table being filled cell by cell, and meet the three bugs that make correct-looking DP code return wrong answers.</p>

<h3>The everyday picture</h3>
<p>You are choosing part-time shifts for the week at a café. Each day pays a different amount, but the manager has one rule: <em>never two days in a row</em>. You could write down all 2⁷ = 128 possible schedules and add each one up. Or you could walk through the week once and, every evening, write a single number on a sticky note: "the most I can have earned by tonight, following the rule". Tonight's note only needs yesterday's note (if I rest today) and the day-before-yesterday's note plus today's pay (if I work today). That row of sticky notes is a one-dimensional DP table. The whole lesson is variations of that row.</p>
<p>Formally: <strong>dynamic programming</strong> (DP) solves a problem by solving smaller versions of it, <em>storing</em> each answer, and building bigger answers from stored ones. It works when the small problems <strong>overlap</strong> (the same one is needed many times) and the best answer is made of best answers to the parts (<strong>optimal substructure</strong>). "One-dimensional" means a single index describes each small problem: "houses 0..i", "amount a", "the first i characters".</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Quy hoạch động một chiều: kẻ trộm, đổi tiền, giải mã, tách từ, LIS, Kadane</h2>
<p class="lead">Bài 9.1 đã biến một hàm đệ quy chậm thành một cái bảng. Bài này đem cái bảng đó đi giải bảy đề mà người phỏng vấn hỏi đi hỏi lại. Nhìn qua chúng chẳng liên quan gì nhau — trộm nhà, trả tiền bằng xu, giải mã tin nhắn, cắt chuỗi thành từ, tìm dãy tăng, đoạn lãi tốt nhất — nhưng tất cả đều là bảng <strong>một chiều</strong>: một hàng đáp án <code>dp[0], dp[1], …</code>, mỗi ô dựng từ vài ô đứng trước nó. Bạn sẽ giải từng đề bằng cùng bốn câu hỏi, thấy từng bảng được điền từng ô một, và gặp ba con bọ khiến code DP trông đúng mà trả sai.</p>

<h3>Hình dung đời thường</h3>
<p>Bạn chọn ca làm thêm trong tuần ở một quán cà phê. Mỗi ngày trả lương khác nhau, nhưng quản lý có đúng một luật: <em>không bao giờ làm hai ngày liền nhau</em>. Bạn có thể viết ra cả 2⁷ = 128 lịch có thể rồi cộng từng lịch. Hoặc bạn đi qua tuần đúng một lần, và mỗi tối viết lên một tờ giấy nhớ đúng một con số: "số tiền nhiều nhất tôi có thể đã kiếm được tính tới tối nay, theo đúng luật". Tờ giấy tối nay chỉ cần tờ của hôm qua (nếu hôm nay tôi nghỉ) và tờ của hôm kia cộng lương hôm nay (nếu hôm nay tôi làm). Hàng giấy nhớ đó chính là một bảng DP một chiều. Cả bài này là các biến tấu của hàng giấy nhớ ấy.</p>
<p>Nói cho chuẩn: <strong>dynamic programming</strong> (quy hoạch động, DP) giải một bài bằng cách giải các phiên bản nhỏ hơn của nó, <em>cất</em> từng đáp án lại, rồi dựng đáp án lớn từ các đáp án đã cất. Nó dùng được khi các bài nhỏ <strong>chồng lấn</strong> (overlapping subproblems — cùng một bài nhỏ bị cần tới nhiều lần) và đáp án tốt nhất được ghép từ đáp án tốt nhất của các phần (<strong>optimal substructure</strong> — cấu trúc con tối ưu). "Một chiều" nghĩa là chỉ cần MỘT chỉ số để gọi tên mỗi bài nhỏ: "các nhà 0..i", "số tiền a", "i ký tự đầu".</p>
${csd('csd201-slide-cs3-1', 'vi', 'CS.3 Quy hoạch động (1): leo cầu thang, cướp nhà', '<p>Ở CSD201 bạn đã thấy công thức 4 bước và hai đề leo cầu thang, cướp nhà bằng Java. Ôn một câu: định nghĩa dp[i], viết công thức truy hồi, đặt ca cơ sở, điền theo thứ tự. <strong>Ở đây đi sâu thêm:</strong> truy vết ra đúng những nhà được chọn, biến thể vòng tròn (213), bảng vết sinh từ code thật, và cách NÓI bốn câu hỏi đó thành tiếng trong phỏng vấn.</p>')}
</div>

<div class="ml-en">
<h3>The four questions — answer them out loud before any code</h3>
<p>Lesson 9.1 introduced them; lesson 9.4 practises them on unfamiliar problems. In this lesson every problem starts with these four lines. If you cannot fill one of them, you are not ready to code.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">State</span><span class="lz-d">What does <code>dp[i]</code> mean, in one sentence with the word "best" or "number of ways"? House Robber: "the most money from houses 0..i".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Transition</span><span class="lz-d">How is <code>dp[i]</code> built from smaller cells? List the choices for the LAST step: skip house i, or rob it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Base cases</span><span class="lz-d">Which cells cannot use the formula because they would read outside the table? <code>dp[0]</code>, <code>dp[1]</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Order</span><span class="lz-d">In which order must cells be filled so that every cell you read is already done? Left to right.</span></div>
</div>
<p>Full introduction: <a href="${baiNay('dsa-9-1-nhap-mon')}">lesson 9.1</a> · more practice: <a href="${baiNay('dsa-9-4-nhan-dien')}">lesson 9.4</a>.</p>
<h3>Signals: this is a one-dimensional DP</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"maximum / minimum / number of ways"</span><span class="v">An optimisation or counting question over a sequence or an amount, not "list all of them" (listing is backtracking, Chapter 8).</span></div>
  <div class="kv"><span class="k">each element: take it or not, with a rule between neighbours</span><span class="v">House Robber, "no two adjacent", "cooldown after selling". The rule is why greedy fails and DP is needed.</span></div>
  <div class="kv"><span class="k">"reach exactly this amount" with items you may reuse</span><span class="v">Coin Change family: dp indexed by the amount, size amount + 1.</span></div>
  <div class="kv"><span class="k">"the prefix of length i can be …"</span><span class="v">Decode Ways, Word Break: dp over prefixes, size n + 1, with dp[0] = the empty prefix.</span></div>
  <div class="kv"><span class="k">"subsequence" (keeps order, may skip)</span><span class="v">LIS: dp[i] = best answer ENDING at i, then take the maximum over all i.</span></div>
  <div class="kv"><span class="k">n ≤ 10³ … 10⁴ and the obvious search is exponential</span><span class="v">O(n²) DP fits; n ≤ 10⁵ needs O(n) or O(n log n) (Kadane, LIS with binary search).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Bốn câu hỏi — trả lời thành tiếng trước khi viết một dòng code</h3>
<p>Bài 9.1 đã giới thiệu chúng; bài 9.4 luyện chúng trên đề lạ. Trong bài này, đề nào cũng mở đầu bằng bốn dòng này. Dòng nào bạn chưa điền được thì bạn chưa sẵn sàng để code.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trạng thái (state)</span><span class="lz-d"><code>dp[i]</code> nghĩa là gì, trong một câu có chữ "lớn nhất/nhỏ nhất" hoặc "số cách"? House Robber: "số tiền nhiều nhất lấy được từ các nhà 0..i".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chuyển (transition)</span><span class="lz-d"><code>dp[i]</code> dựng từ các ô nhỏ hơn thế nào? Liệt kê các lựa chọn ở BƯỚC CUỐI: bỏ qua nhà i, hoặc lấy nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cơ sở (base case)</span><span class="lz-d">Ô nào không dùng được công thức vì sẽ đọc ra ngoài bảng? <code>dp[0]</code>, <code>dp[1]</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thứ tự tính (order)</span><span class="lz-d">Điền theo thứ tự nào để mọi ô được đọc đều đã xong? Từ trái sang phải.</span></div>
</div>
<p>Giới thiệu đầy đủ: <a href="${baiNay('dsa-9-1-nhap-mon')}">bài 9.1</a> · luyện thêm: <a href="${baiNay('dsa-9-4-nhan-dien')}">bài 9.4</a>.</p>
<h3>Dấu hiệu nhận ra: đây là DP một chiều</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"lớn nhất / nhỏ nhất / có bao nhiêu cách"</span><span class="v">Câu hỏi tối ưu hoặc đếm trên một dãy hay một số tiền, KHÔNG phải "liệt kê hết" (liệt kê là quay lui, Chương 8).</span></div>
  <div class="kv"><span class="k">mỗi phần tử: lấy hay không, có luật giữa hai phần tử kề nhau</span><span class="v">House Robber, "không lấy hai cái liền nhau", "bán xong phải nghỉ một ngày". Chính cái luật đó làm tham lam thất bại và cần DP.</span></div>
  <div class="kv"><span class="k">"đạt đúng số tiền này" với món được dùng lại</span><span class="v">Họ Coin Change: dp đánh chỉ số theo số tiền, kích thước amount + 1.</span></div>
  <div class="kv"><span class="k">"tiền tố dài i thì có thể …"</span><span class="v">Decode Ways, Word Break: dp theo tiền tố (prefix), kích thước n + 1, dp[0] = tiền tố rỗng.</span></div>
  <div class="kv"><span class="k">"dãy con" (subsequence — giữ thứ tự, được bỏ phần tử)</span><span class="v">LIS: dp[i] = đáp án tốt nhất KẾT THÚC tại i, rồi lấy max trên mọi i.</span></div>
  <div class="kv"><span class="k">n ≤ 10³ … 10⁴ và cách tìm hiển nhiên là hàm mũ</span><span class="v">DP O(n²) vừa giờ; n ≤ 10⁵ thì cần O(n) hoặc O(n log n) (Kadane, LIS bằng nhị phân).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example 1: House Robber — ${L.rob}</h3>
<p><strong>Problem (in our words).</strong> A street of houses, each with some money. Robbing two neighbouring houses sets off the alarm. What is the most you can take? Example: <code>[2, 7, 9, 3, 1]</code> → 12 (houses 0, 2, 4: 2 + 9 + 1).</p>
<p><strong>Brute force, said out loud.</strong> "Every house is in or out, so try all 2ⁿ subsets, drop those with two neighbours, keep the best." n = 100 gives 2¹⁰⁰ subsets — hopeless. A smarter recursion: <code>best(i)</code> = the most from houses 0..i = <code>max(best(i − 1), nums[i] + best(i − 2))</code>. It is still exponential because <code>best(i − 2)</code> is reached from both branches — exactly the overlapping calls of Fibonacci in lesson 9.1. Store each <code>best(i)</code> once and the work becomes n steps.</p>
<p><strong>The four questions.</strong></p>
<ul>
<li><strong>State:</strong> <code>dp[i]</code> = the most money from houses <code>0..i</code> (house i may or may not be robbed).</li>
<li><strong>Transition:</strong> look at the last house. Skip it ⇒ <code>dp[i − 1]</code>. Rob it ⇒ house i − 1 must be skipped ⇒ <code>nums[i] + dp[i − 2]</code>. Take the larger.</li>
<li><strong>Base:</strong> <code>dp[0] = nums[0]</code>; <code>dp[1] = max(nums[0], nums[1])</code>.</li>
<li><strong>Order:</strong> i = 2, 3, …, n − 1. Answer: <code>dp[n − 1]</code>.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Đề giải mẫu 1: House Robber — ${L.rob}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một dãy nhà, mỗi nhà có một ít tiền. Trộm hai nhà sát nhau thì chuông báo động kêu. Lấy được nhiều nhất bao nhiêu? Ví dụ: <code>[2, 7, 9, 3, 1]</code> → 12 (nhà 0, 2, 4: 2 + 9 + 1).</p>
<p><strong>Vét cạn, nói thành lời.</strong> "Mỗi nhà lấy hoặc không, nên thử cả 2ⁿ tập con, bỏ tập nào có hai nhà kề nhau, giữ tập tốt nhất." n = 100 thì 2¹⁰⁰ tập — vô vọng. Một hàm đệ quy khôn hơn: <code>best(i)</code> = nhiều nhất từ các nhà 0..i = <code>max(best(i − 1), nums[i] + best(i − 2))</code>. Vẫn là hàm mũ vì <code>best(i − 2)</code> bị gọi tới từ cả hai nhánh — đúng kiểu lời gọi chồng lấn của Fibonacci ở bài 9.1. Cất mỗi <code>best(i)</code> một lần là khối lượng việc chỉ còn n bước.</p>
<p><strong>Bốn câu hỏi.</strong></p>
<ul>
<li><strong>Trạng thái:</strong> <code>dp[i]</code> = số tiền nhiều nhất từ các nhà <code>0..i</code> (nhà i có thể bị lấy hoặc không).</li>
<li><strong>Chuyển:</strong> nhìn nhà cuối. Bỏ nó ⇒ <code>dp[i − 1]</code>. Lấy nó ⇒ nhà i − 1 phải bỏ ⇒ <code>nums[i] + dp[i − 2]</code>. Chọn cái lớn hơn.</li>
<li><strong>Cơ sở:</strong> <code>dp[0] = nums[0]</code>; <code>dp[1] = max(nums[0], nums[1])</code>.</li>
<li><strong>Thứ tự:</strong> i = 2, 3, …, n − 1. Đáp án: <code>dp[n − 1]</code>.</li>
</ul>
</div>
${maHai('ch09/b2/house-robber.ts', 'ch09/b2/McHouseRobber.java', { vung: 'rob' })}

<div class="ml-en">
<h3>Watch the table fill: one row of sticky notes</h3>
<p>Input <code>nums = [2, 7, 9, 3, 1, 5, 8]</code>. In the dp row, orange = <code>dp[i − 2]</code> (read when robbing), green = <code>dp[i − 1]</code> (read when skipping), dark green = the cell just written. The last row walks back through the table to recover <em>which</em> houses were robbed. Generated by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem bảng được điền: một hàng giấy nhớ</h3>
<p>Đầu vào <code>nums = [2, 7, 9, 3, 1, 5, 8]</code>. Ở hàng dp, cam = <code>dp[i − 2]</code> (đọc khi lấy), xanh lá nhạt = <code>dp[i − 1]</code> (đọc khi bỏ), xanh lá đậm = ô vừa ghi. Dòng cuối đi lùi qua bảng để tìm ra <em>những nhà nào</em> đã bị lấy. Bảng sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_ROB}
<div class="ml-en">
<p>Read row 3: robbing house 3 would give 3 + dp[1] = 10, but skipping keeps 11, so <code>dp[3] = 11</code> and house 3 is skipped. That single comparison is the whole algorithm. The answer is <code>dp[6] = ${VR.dp[6]}</code>. To recover the houses, walk back from the end: if <code>dp[i] ≠ dp[i − 1]</code>, house i was robbed (jump to i − 2); otherwise it was skipped (step to i − 1). Interviewers often ask "can you also return the houses?" — this is the answer, and it costs no extra memory beyond the table.</p>
${moPhong('ch09/b2/house-robber.sim.js', 'en', 'House Robber — the dp row filled step by step', 'Opens /algorithms with this program: each step highlights the two cells it reads, then writes the new one; the end shows the houses robbed.')}
</div>
<div class="ml-vi">
<p>Đọc dòng 3: lấy nhà 3 thì được 3 + dp[1] = 10, nhưng bỏ thì giữ được 11, nên <code>dp[3] = 11</code> và nhà 3 bị bỏ. Chính phép so sánh đó là toàn bộ thuật toán. Đáp án là <code>dp[6] = ${VR.dp[6]}</code>. Muốn biết những nhà nào, đi lùi từ cuối: nếu <code>dp[i] ≠ dp[i − 1]</code> thì nhà i đã bị lấy (nhảy về i − 2); không thì nó bị bỏ (lùi về i − 1). Người phỏng vấn rất hay hỏi "trả luôn danh sách nhà được không?" — đây là câu trả lời, và nó không tốn thêm bộ nhớ nào ngoài cái bảng.</p>
${moPhong('ch09/b2/house-robber.sim.js', 'vi', 'House Robber — hàng dp được điền từng bước', 'Mở trang /algorithms với chương trình này: mỗi bước tô hai ô được đọc rồi ghi ô mới; cuối cùng hiện các nhà bị lấy.')}
</div>

<div class="ml-en">
<h3>Shrinking the memory: two variables</h3>
<p>The formula only ever reads <code>dp[i − 1]</code> and <code>dp[i − 2]</code>. So the whole array can be two variables, <code>prev1</code> and <code>prev2</code>, exactly like the two-variable Fibonacci of lesson 9.1. Time stays O(n); memory drops from O(n) to O(1). Say this as a follow-up after the array version works — but keep the array version if the interviewer asks for the list of houses, because walking back needs the table.</p>
</div>
<div class="ml-vi">
<h3>Thu nhỏ bộ nhớ: hai biến</h3>
<p>Công thức chỉ bao giờ đọc <code>dp[i − 1]</code> và <code>dp[i − 2]</code>. Nên cả mảng thay được bằng hai biến <code>prev1</code> và <code>prev2</code>, y hệt Fibonacci hai biến của bài 9.1. Thời gian vẫn O(n); bộ nhớ giảm từ O(n) xuống O(1). Hãy nói ý này như một bước cải tiến SAU khi bản mảng đã chạy — nhưng giữ bản mảng nếu người phỏng vấn đòi danh sách nhà, vì đi lùi cần cả bảng.</p>
</div>
${maHai('ch09/b2/house-robber.ts', 'ch09/b2/McHouseRobber.java', { vung: 'rob2bien' })}

<div class="ml-en">
<h3>Variant: House Robber II — ${L.rob2}</h3>
<p><strong>Problem (in our words).</strong> Same, but the houses stand in a <em>circle</em>: the first and the last are neighbours. <code>[2, 3, 2]</code> → 3 (you cannot take both 2s).</p>
<p><strong>The idea.</strong> A circle has no "first cell" to start a row of sticky notes. Break the circle instead: the first and the last house can never both be robbed, so at least one of them is skipped. Case A: pretend the last house does not exist (houses 0..n−2). Case B: pretend the first house does not exist (houses 1..n−1). Each case is an ordinary straight street — run House Robber on it — and the answer is the larger of the two. The one trap: with a single house, both ranges are empty and you would return 0; a lone house has no neighbour, so the answer is that house.</p>
</div>
<div class="ml-vi">
<h3>Biến thể: House Robber II — ${L.rob2}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Như trên, nhưng các nhà xếp thành <em>vòng tròn</em>: nhà đầu và nhà cuối là hàng xóm. <code>[2, 3, 2]</code> → 3 (không thể lấy cả hai số 2).</p>
<p><strong>Ý chính.</strong> Vòng tròn không có "ô đầu tiên" để bắt đầu hàng giấy nhớ. Thì cắt vòng ra: nhà đầu và nhà cuối không bao giờ cùng bị lấy, nên ít nhất một trong hai bị bỏ. Trường hợp A: coi như nhà cuối không tồn tại (nhà 0..n−2). Trường hợp B: coi như nhà đầu không tồn tại (nhà 1..n−1). Mỗi trường hợp là một con phố thẳng bình thường — chạy House Robber trên đó — và đáp án là cái lớn hơn. Bẫy duy nhất: chỉ có một nhà thì cả hai đoạn đều rỗng và bạn sẽ trả về 0; một nhà đứng một mình không có hàng xóm, nên đáp án chính là nhà đó.</p>
</div>
${maHai('ch09/b2/house-robber.ts', 'ch09/b2/McHouseRobber.java', { vung: 'rob2' })}
${ketQua('ch09/b2/house-robber.ts')}
${ketQua('ch09/b2/McHouseRobber.java')}
<div class="ml-en">
<p>Compare <code>[5, 1, 1, 5]</code>: on a straight street the answer is 10 (both 5s), in a circle it is 6, because the two 5s became neighbours. And <code>[200, 3, 140, 20, 10]</code> → 340: case A (without the 10) takes 200 + 140.</p>
</div>
<div class="ml-vi">
<p>So sánh <code>[5, 1, 1, 5]</code>: trên phố thẳng đáp án là 10 (cả hai số 5), trên vòng tròn chỉ còn 6, vì hai số 5 đã thành hàng xóm. Còn <code>[200, 3, 140, 20, 10]</code> → 340: trường hợp A (bỏ số 10) lấy 200 + 140.</p>
</div>

<div class="ml-en">
<h3>Worked example 2: Coin Change — ${L.coin}</h3>
<p><strong>Problem (in our words).</strong> Coins of given values, unlimited of each. What is the fewest number of coins that adds up to <code>amount</code>? If impossible, −1. <code>coins = [1, 2, 5], amount = 11</code> → 3 (5 + 5 + 1).</p>
<p><strong>Why not just take the biggest coin first?</strong> With <code>[1, 3, 4]</code> and 6, "biggest first" pays 4 + 1 + 1 = three coins, while 3 + 3 is two. Greedy works for some coin systems and fails for others; lesson <a href="${baiNay('dsa-9-5-greedy')}">9.5</a> runs that counterexample and explains when greedy is safe. DP never has to guess.</p>
<p><strong>The four questions.</strong></p>
<ul>
<li><strong>State:</strong> <code>dp[a]</code> = the fewest coins that make exactly <code>a</code>, for every a from 0 to amount. The index is the <em>amount</em>, not a position in the coins array.</li>
<li><strong>Transition:</strong> think about the <em>last</em> coin. If it is c, the rest is a − c, paid as cheaply as possible: <code>dp[a − c] + 1</code>. Try every coin, keep the minimum.</li>
<li><strong>Base:</strong> <code>dp[0] = 0</code> (nothing to pay). Every other cell starts as "impossible".</li>
<li><strong>Order:</strong> a = 1, 2, …, amount — smaller amounts first, because <code>a − c &lt; a</code>.</li>
</ul>
<p>Cost: amount × (number of coins) cells checks — O(amount · k) time, O(amount) memory.</p>
</div>
<div class="ml-vi">
<h3>Đề giải mẫu 2: Coin Change — ${L.coin}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Có các đồng xu mệnh giá cho trước, mỗi loại không giới hạn số lượng. Cần ít nhất bao nhiêu đồng để cộng lại đúng bằng <code>amount</code>? Không được thì trả −1. <code>coins = [1, 2, 5], amount = 11</code> → 3 (5 + 5 + 1).</p>
<p><strong>Sao không cứ lấy đồng to nhất trước?</strong> Với <code>[1, 3, 4]</code> và 6, "to nhất trước" trả 4 + 1 + 1 = ba đồng, trong khi 3 + 3 chỉ hai đồng. Tham lam đúng với một số hệ mệnh giá và sai với hệ khác; bài <a href="${baiNay('dsa-9-5-greedy')}">9.5</a> chạy thật phản ví dụ này và giải thích khi nào tham lam an toàn. DP thì không bao giờ phải đoán.</p>
<p><strong>Bốn câu hỏi.</strong></p>
<ul>
<li><strong>Trạng thái:</strong> <code>dp[a]</code> = số đồng ít nhất để ra đúng <code>a</code>, với mọi a từ 0 tới amount. Chỉ số là <em>số tiền</em>, không phải vị trí trong mảng coins.</li>
<li><strong>Chuyển:</strong> nghĩ về đồng xu <em>cuối cùng</em>. Nếu nó là c, phần còn lại là a − c, trả rẻ nhất có thể: <code>dp[a − c] + 1</code>. Thử mọi đồng, giữ giá trị nhỏ nhất.</li>
<li><strong>Cơ sở:</strong> <code>dp[0] = 0</code> (không phải trả gì). Mọi ô khác khởi đầu là "không thể".</li>
<li><strong>Thứ tự:</strong> a = 1, 2, …, amount — số tiền nhỏ trước, vì <code>a − c &lt; a</code>.</li>
</ul>
<p>Chi phí: amount × (số loại xu) lần kiểm — thời gian O(amount · k), bộ nhớ O(amount).</p>
</div>
${maHai('ch09/b2/coin-change.ts', 'ch09/b2/McCoinChange.java', { vung: 'coin' })}
${ketQua('ch09/b2/coin-change.ts')}

<div class="ml-en">
<p>Here is the table for <code>coins = [1, 3, 4]</code>, <code>amount = 6</code> — the counterexample to greedy. For each amount a, the second column lists what each possible last coin would cost; dark green is the cell written, light green the cell it came from.</p>
</div>
<div class="ml-vi">
<p>Đây là bảng cho <code>coins = [1, 3, 4]</code>, <code>amount = 6</code> — chính phản ví dụ của tham lam. Với mỗi số tiền a, cột thứ hai liệt kê giá của từng lựa chọn đồng xu cuối; xanh đậm là ô vừa ghi, xanh nhạt là ô nó lấy từ.</p>
</div>
${BANG_COIN}
<div class="ml-en">
<p>Row a = 6: last coin 1 costs dp[5] + 1 = 3, last coin 3 costs dp[3] + 1 = 2, last coin 4 costs dp[2] + 1 = 3. The minimum is 2, coming from dp[3]; dp[3] itself came from dp[0] with a 3. Walking back gives the coins: 3 + 3. Notice that the "4" option was considered at every row and simply lost — DP does not refuse greedy's idea, it compares it.</p>
${moPhong('ch09/b2/coin-change.sim.js', 'en', 'Coin Change — every amount looks back once per coin', 'Opens /algorithms: watch dp[a] try each last coin, with 7 standing for "impossible so far".')}
</div>
<div class="ml-vi">
<p>Dòng a = 6: đồng cuối là 1 thì tốn dp[5] + 1 = 3, đồng cuối là 3 thì dp[3] + 1 = 2, đồng cuối là 4 thì dp[2] + 1 = 3. Nhỏ nhất là 2, đến từ dp[3]; còn dp[3] đến từ dp[0] bằng một đồng 3. Đi lùi ra các đồng: 3 + 3. Để ý lựa chọn "4" được xét ở mọi dòng và chỉ đơn giản là thua — DP không gạt bỏ ý của tham lam, nó đem ra so.</p>
${moPhong('ch09/b2/coin-change.sim.js', 'vi', 'Coin Change — mỗi số tiền nhìn lùi một lần cho mỗi đồng xu', 'Mở trang /algorithms: xem dp[a] thử từng đồng xu cuối, số 7 nghĩa là "tạm thời chưa ra được".')}
</div>

<div class="ml-en">
<h3>Trap 1: "infinity" in Java is a number that wraps around</h3>
<div class="pitfall co-tieu-de"><p><strong>Initialising the table with <code>Integer.MAX_VALUE</code> and then computing <code>dp[a − c] + 1</code>.</strong></p><p>When <code>dp[a − c]</code> is still "impossible", adding one overflows the 32-bit int and becomes the most negative number. <code>Math.min</code> happily picks it, and the bug spreads to every cell built from it:</p></div>
</div>
<div class="ml-vi">
<h3>Bẫy 1: "vô cực" trong Java là một con số biết quay vòng</h3>
<div class="pitfall co-tieu-de"><p><strong>Khởi tạo bảng bằng <code>Integer.MAX_VALUE</code> rồi tính <code>dp[a − c] + 1</code>.</strong></p><p>Khi <code>dp[a − c]</code> còn là "không thể", cộng thêm một làm số int 32 bit tràn và biến thành số âm nhỏ nhất. <code>Math.min</code> vui vẻ chọn nó, và lỗi lan sang mọi ô dựng từ ô đó:</p></div>
</div>
${ma('ch09/b2/McCoinTran.java', { vung: 'sai', nhan: 'Java — wrong' })}
${ma('ch09/b2/McCoinTran.java', { vung: 'dung', nhan: 'Java — right' })}
${ketQua('ch09/b2/McCoinTran.java')}
${ketQua('ch09/b2/coin-js-inf.ts')}
<div class="ml-en">
<p>Look at the four rows. With <code>[5, 10]</code> and 3 the wrong version is <em>accidentally right</em>: no coin fits, so <code>+ 1</code> never runs. With <code>[1, 2, 5]</code> and 11 it is also right, because every amount is reachable. It only breaks when some amount is unreachable <em>and</em> a bigger amount is built from it: <code>[2]</code> with 3 returns −2147483648 instead of −1. That is exactly the kind of bug that passes the examples and fails a hidden test. JavaScript's <code>Infinity + 1</code> stays <code>Infinity</code>, so the TypeScript version with <code>Infinity</code> would be safe — but the habit that works in both languages is the <strong>sentinel</strong> <code>amount + 1</code>: no real answer can use more coins than the amount itself (the smallest coin is at least 1), and adding 1 to it cannot overflow. Same family: <code>Integer.MAX_VALUE / 2</code> also works, and Chapter 6 shows the same overflow inside a comparator <code>a − b</code>.</p>
</div>
<div class="ml-vi">
<p>Nhìn bốn dòng. Với <code>[5, 10]</code> và 3, bản sai <em>tình cờ đúng</em>: không đồng nào vừa, nên <code>+ 1</code> không bao giờ chạy. Với <code>[1, 2, 5]</code> và 11 cũng đúng, vì số tiền nào cũng ra được. Nó chỉ hỏng khi có một số tiền không ra được <em>và</em> một số tiền lớn hơn được dựng từ nó: <code>[2]</code> với 3 trả −2147483648 thay vì −1. Đúng loại lỗi qua hết ví dụ rồi trượt một test ẩn. <code>Infinity + 1</code> của JavaScript vẫn là <code>Infinity</code>, nên bản TypeScript dùng <code>Infinity</code> thì an toàn — nhưng thói quen dùng được ở cả hai ngôn ngữ là <strong>giá trị canh</strong> (sentinel) <code>amount + 1</code>: không đáp án thật nào dùng nhiều đồng hơn chính số tiền (đồng nhỏ nhất ít nhất là 1), và cộng 1 vào nó không thể tràn. Cùng họ: <code>Integer.MAX_VALUE / 2</code> cũng được, và Chương 6 cho thấy đúng kiểu tràn này bên trong comparator <code>a − b</code>.</p>
</div>

<div class="ml-en">
<h3>Counting instead of minimising: Coin Change II vs Combination Sum IV</h3>
<p>Change the question from "fewest coins" to "how many ways". <strong>Coin Change II</strong> (${L.coin2}) counts <em>combinations</em>: 1 + 2 + 2 and 2 + 1 + 2 are the same way. <strong>Combination Sum IV</strong> (${L.cs4}) counts <em>ordered sequences</em>: they are different. The code for both is the same two loops — <code>ways[a] += ways[a − c]</code> with <code>ways[0] = 1</code> — and the <em>only</em> difference is which loop is outside.</p>
<ul>
<li><strong>Coins outside, amounts inside:</strong> first every way that uses only 1s is counted, then 2s are allowed on top of that, then 5s. A combination is always built in coin order, so each is counted once.</li>
<li><strong>Amounts outside, coins inside:</strong> at every amount, any coin may be the last one. So "…then 1" and "…then 2" are counted separately at every step: that is counting orders.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Đếm thay vì tìm nhỏ nhất: Coin Change II và Combination Sum IV</h3>
<p>Đổi câu hỏi từ "ít đồng nhất" sang "có bao nhiêu cách". <strong>Coin Change II</strong> (${L.coin2}) đếm <em>tổ hợp</em> (combination): 1 + 2 + 2 và 2 + 1 + 2 là CÙNG một cách. <strong>Combination Sum IV</strong> (${L.cs4}) đếm <em>dãy có thứ tự</em> (hoán vị lặp): chúng là hai cách KHÁC nhau. Mã của cả hai là cùng hai vòng lặp — <code>ways[a] += ways[a − c]</code> với <code>ways[0] = 1</code> — và khác biệt <em>duy nhất</em> là vòng nào nằm ngoài.</p>
<ul>
<li><strong>Đồng xu ở ngoài, số tiền ở trong:</strong> đầu tiên đếm mọi cách chỉ dùng đồng 1, rồi cho phép thêm đồng 2 lên trên đó, rồi đồng 5. Một tổ hợp luôn được dựng theo thứ tự mệnh giá, nên mỗi tổ hợp chỉ được đếm một lần.</li>
<li><strong>Số tiền ở ngoài, đồng xu ở trong:</strong> ở mỗi số tiền, đồng nào cũng có thể là đồng cuối. Nên "…rồi 1" và "…rồi 2" được đếm riêng ở mọi bước: đó là đếm theo thứ tự.</li>
</ul>
</div>
${maHai('ch09/b2/dem-cach.ts', 'ch09/b2/McDemCach.java', { vung: 'tohop' })}
${maHai('ch09/b2/dem-cach.ts', 'ch09/b2/McDemCach.java', { vung: 'hoanvi' })}
${ketQua('ch09/b2/dem-cach.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Swapping the two loops silently changes the question.</strong></p><p>The output above lists every way by brute force so you can check the numbers: amount 5 with <code>[1, 2, 5]</code> has <strong>4</strong> combinations but <strong>9</strong> ordered sequences. Both programs compile, both run, both return a plausible number. In an interview, say which one you mean before writing the loops: "coins outside because order does not matter here".</p></div>
<p>Also note <code>change(0, [7]) = 1</code>: there is exactly one way to pay nothing — take no coin. That is why the base case is <code>ways[0] = 1</code> and not 0; with 0, every count in the table would stay 0.</p>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Đổi chỗ hai vòng lặp là lặng lẽ đổi luôn câu hỏi.</strong></p><p>Output trên liệt kê mọi cách bằng vét cạn để bạn tự kiểm con số: số tiền 5 với <code>[1, 2, 5]</code> có <strong>4</strong> tổ hợp nhưng <strong>9</strong> dãy có thứ tự. Cả hai chương trình đều biên dịch, đều chạy, đều trả một con số trông hợp lý. Khi phỏng vấn, hãy nói rõ bạn đếm cái nào trước khi viết vòng lặp: "đồng xu ở ngoài vì ở đây thứ tự không quan trọng".</p></div>
<p>Để ý thêm <code>change(0, [7]) = 1</code>: có đúng một cách trả 0 đồng — không lấy đồng nào. Vì thế ca cơ sở là <code>ways[0] = 1</code> chứ không phải 0; đặt 0 thì mọi con số trong bảng mãi mãi là 0.</p>
</div>

<div class="ml-en">
<h3>Worked example 3: Decode Ways — ${L.decode}</h3>
<p><strong>Problem (in our words).</strong> Letters were encoded as A = 1, B = 2, …, Z = 26 and the digits glued together. How many ways can the digit string be read back? <code>"226"</code> → 3: "2 2 6" (BBF), "22 6" (VF), "2 26" (BZ).</p>
<p><strong>The four questions.</strong> This time the index is a <em>prefix length</em>, which is why the table has n + 1 cells.</p>
<ul>
<li><strong>State:</strong> <code>dp[i]</code> = the number of ways to decode the first i characters.</li>
<li><strong>Transition:</strong> the last letter used either one digit (<code>s[i−1]</code>, valid if it is 1–9) ⇒ add <code>dp[i − 1]</code>; or two digits (<code>s[i−2..i−1]</code>, valid if 10–26) ⇒ add <code>dp[i − 2]</code>.</li>
<li><strong>Base:</strong> <code>dp[0] = 1</code> — the empty prefix has one decoding, "nothing". It is the same "one way to pay nothing" as in Coin Change II.</li>
<li><strong>Order:</strong> i = 1 … n.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Đề giải mẫu 3: Decode Ways — ${L.decode}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Các chữ cái được mã hoá A = 1, B = 2, …, Z = 26 rồi dán liền các chữ số. Chuỗi chữ số đó đọc ngược lại được bằng bao nhiêu cách? <code>"226"</code> → 3: "2 2 6" (BBF), "22 6" (VF), "2 26" (BZ).</p>
<p><strong>Bốn câu hỏi.</strong> Lần này chỉ số là <em>độ dài tiền tố</em>, đó là lý do bảng có n + 1 ô.</p>
<ul>
<li><strong>Trạng thái:</strong> <code>dp[i]</code> = số cách giải mã i ký tự đầu.</li>
<li><strong>Chuyển:</strong> chữ cái cuối hoặc dùng một chữ số (<code>s[i−1]</code>, hợp lệ khi là 1–9) ⇒ cộng <code>dp[i − 1]</code>; hoặc hai chữ số (<code>s[i−2..i−1]</code>, hợp lệ khi 10–26) ⇒ cộng <code>dp[i − 2]</code>.</li>
<li><strong>Cơ sở:</strong> <code>dp[0] = 1</code> — tiền tố rỗng có một cách giải mã: "không có gì". Chính là "một cách trả 0 đồng" của Coin Change II.</li>
<li><strong>Thứ tự:</strong> i = 1 … n.</li>
</ul>
</div>
${maHai('ch09/b2/decode-ways.ts', 'ch09/b2/McDecodeWays.java', { vung: 'decode' })}
${ketQua('ch09/b2/decode-ways.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Treating "0" as a letter and "06" as 6.</strong></p><p>The "wrong" column is the version most people write first: every digit counts as a letter and any pair ≤ 26 counts as a letter. It agrees on <code>"12"</code>, <code>"226"</code>, <code>"27"</code> and even on ten 1s (both give 89, a Fibonacci number) — and is wrong on every string with a zero: <code>"06"</code> gives 2 instead of 0, <code>"100"</code> gives 3 instead of 0, <code>"11106"</code> gives 8 instead of 2. The two rules to say out loud: a single <code>0</code> is never a letter; a pair is a letter only from 10 to 26.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Coi "0" là một chữ cái và "06" là 6.</strong></p><p>Cột "wrong" là bản mà đa số người viết lần đầu: chữ số nào cũng là một chữ cái, cặp nào ≤ 26 cũng là một chữ cái. Nó khớp ở <code>"12"</code>, <code>"226"</code>, <code>"27"</code>, thậm chí ở mười số 1 (cả hai ra 89, một số Fibonacci) — và sai ở MỌI chuỗi có số 0: <code>"06"</code> ra 2 thay vì 0, <code>"100"</code> ra 3 thay vì 0, <code>"11106"</code> ra 8 thay vì 2. Hai luật cần nói thành tiếng: một số <code>0</code> đứng một mình không bao giờ là chữ cái; một cặp chỉ là chữ cái khi từ 10 tới 26.</p></div>
</div>

<div class="ml-en">
<h3>Worked example 4: Word Break — ${L.wb}</h3>
<p><strong>Problem (in our words).</strong> Given a string with no spaces and a dictionary, can the string be cut into dictionary words (a word may be used many times)? <code>"applepenapple"</code> with [apple, pen] → true; <code>"catsandog"</code> with [cats, dog, sand, and, cat] → false.</p>
<ul>
<li><strong>State:</strong> <code>dp[i]</code> = true if the first i characters can be cut into words.</li>
<li><strong>Transition:</strong> the last word is <code>s[j..i−1]</code> for some j. So <code>dp[i]</code> is true if, for some j, <code>dp[j]</code> is true <em>and</em> <code>s[j..i−1]</code> is in the dictionary.</li>
<li><strong>Base:</strong> <code>dp[0] = true</code> (the empty prefix needs no cut).</li>
<li><strong>Order:</strong> i = 1 … n. Only j ≥ i − maxWordLength can matter, which turns O(n²) checks into O(n · L).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Đề giải mẫu 4: Word Break — ${L.wb}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho một chuỗi không có dấu cách và một từ điển, chuỗi có cắt được thành các từ trong từ điển không (một từ dùng nhiều lần cũng được)? <code>"applepenapple"</code> với [apple, pen] → true; <code>"catsandog"</code> với [cats, dog, sand, and, cat] → false.</p>
<ul>
<li><strong>Trạng thái:</strong> <code>dp[i]</code> = true nếu i ký tự đầu cắt được thành các từ.</li>
<li><strong>Chuyển:</strong> từ cuối cùng là <code>s[j..i−1]</code> với một j nào đó. Nên <code>dp[i]</code> đúng nếu có một j mà <code>dp[j]</code> đúng <em>và</em> <code>s[j..i−1]</code> nằm trong từ điển.</li>
<li><strong>Cơ sở:</strong> <code>dp[0] = true</code> (tiền tố rỗng không cần cắt).</li>
<li><strong>Thứ tự:</strong> i = 1 … n. Chỉ những j ≥ i − (độ dài từ dài nhất) mới có ý nghĩa, nên O(n²) lần kiểm thu lại còn O(n · L).</li>
</ul>
</div>
${maHai('ch09/b2/word-break.ts', 'ch09/b2/McWordBreak.java', { vung: 'wb' })}
${ma('ch09/b2/word-break.ts', { vung: 'cat', nhan: 'TypeScript — also return one segmentation' })}
${ketQua('ch09/b2/word-break.ts')}
<div class="ml-en">
<p>The follow-up "print the words" again needs only one extra array: <code>from[i]</code> remembers where the last word started, and we walk back from the end, as in House Robber. Note the result <code>"thanhtoan that bai"</code>: "thanh toan that bai" is an equally valid cut. The table answers <em>whether</em> a cut exists; which cut you get depends on the order you try j. Real segmenters have to choose — by word frequency, by a language model — and that choice is where they get things wrong.</p>
<h3>Where word breaking lives in real systems</h3>
<ul>
<li><strong>Languages without spaces.</strong> Chinese and Japanese text has no spaces between words, so search engines, input methods and pronunciation tools must segment it first. This site's CT Language app teaches both languages; it does not segment on its own — its pronunciation tests describe the speech service doing it (<code>src/services/ctlanguage/phatAm.test.ts</code>: "Azure tách TỪ nhiều chữ" — Azure splits multi-character words). Production segmenters use the same "best way to cut the prefix" table, with probabilities instead of true/false.</li>
<li><strong>Glued text.</strong> Hashtags, domain names and Vietnamese typed without diacritics or spaces (<code>#thanhtoanthatbai</code>) have several valid cuts; the table tells you a cut exists, a scoring rule must pick the intended one.</li>
</ul>
</div>
<div class="ml-vi">
<p>Câu hỏi nối tiếp "in ra các từ" lại chỉ cần thêm một mảng: <code>from[i]</code> nhớ từ cuối bắt đầu ở đâu, rồi đi lùi từ cuối như House Robber. Để ý kết quả <code>"thanhtoan that bai"</code>: "thanh toan that bai" cũng là một cách cắt hợp lệ. Bảng trả lời <em>có hay không</em> một cách cắt; bạn nhận được cách nào phụ thuộc thứ tự thử j. Bộ tách từ thật phải chọn — theo tần suất từ, theo mô hình ngôn ngữ — và chính chỗ chọn đó là nơi chúng hay sai.</p>
<h3>Tách từ sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Ngôn ngữ không có dấu cách.</strong> Tiếng Trung và tiếng Nhật không có dấu cách giữa các từ, nên công cụ tìm kiếm, bộ gõ, công cụ chấm phát âm đều phải tách từ trước. App CT Language của trang này dạy cả hai thứ tiếng; nó không tự tách từ — chính test phát âm của nó mô tả dịch vụ giọng nói làm việc đó (<code>src/services/ctlanguage/phatAm.test.ts</code>: "Azure tách TỪ nhiều chữ"). Bộ tách từ thật dùng đúng bảng "cách tốt nhất để cắt tiền tố", chỉ thay true/false bằng xác suất.</li>
<li><strong>Chữ dính liền.</strong> Hashtag, tên miền, và tiếng Việt gõ không dấu không cách (<code>#thanhtoanthatbai</code>) có nhiều cách cắt hợp lệ; bảng cho biết CÓ cách cắt, còn chọn đúng cách người viết muốn thì cần một luật chấm điểm.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: one request that freezes the server</h3>
<p>Write Word Break as plain recursion — "for every word that matches here, recurse on the rest" — and it passes LeetCode's examples. Now let a user choose the input. The attacker sends <code>"aaa…a" + "b"</code> with a dictionary containing a, aa, aaa. The answer is false (nothing ends in "b"), but the recursion only learns that after trying <em>every</em> way to cut the a's into pieces of length 1–3. Measured on this machine:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: một request làm đứng máy chủ</h3>
<p>Viết Word Break bằng đệ quy trần — "với mỗi từ khớp ở đây, đệ quy phần còn lại" — thì vẫn qua ví dụ của LeetCode. Giờ để người dùng tự chọn đầu vào. Kẻ tấn công gửi <code>"aaa…a" + "b"</code> với từ điển gồm a, aa, aaa. Đáp án là false (không gì kết thúc bằng "b"), nhưng đệ quy chỉ biết điều đó sau khi thử <em>mọi</em> cách cắt dãy chữ a thành các mẩu dài 1–3. Đo trên chính máy này:</p>
</div>
${ma('ch09/b2/word-break-do.ts', { vung: 'ngay-tho', nhan: 'TypeScript — plain recursion' })}
${ma('ch09/b2/word-break-do.ts', { vung: 'nho', nhan: 'TypeScript — with memo' })}
${ketQua('ch09/b2/word-break-do.ts')}
<div class="ml-en">
<p>Every two more letters multiply the naive work by about 3.4 (the calls grow like the Tribonacci numbers, ≈ 1.84 per letter): 26 letters take about 0.2 s, 30 letters about 2.3 s, and 40 letters would take around a quarter of an hour (extrapolated). The memo version makes about 3 calls per letter — 88 calls at n = 30, in hundredths of a millisecond. In Node a single request like that blocks the event loop, so <em>every other user</em> waits too. This is the same shape as ReDoS (a regular expression that backtracks exponentially) and you defend the same way: never run an exponential algorithm on user input; memoise or use the table; cap input length; put a time budget on the work.</p>
</div>
<div class="ml-vi">
<p>Cứ thêm hai chữ cái là khối lượng việc của bản trần nhân khoảng 3,4 lần (số lời gọi tăng theo dãy Tribonacci, ≈ 1,84 lần mỗi chữ): 26 chữ mất khoảng 0,2 giây, 30 chữ khoảng 2,3 giây, 40 chữ sẽ mất cỡ mười lăm phút (ngoại suy). Bản có nhớ chỉ tốn khoảng 3 lời gọi mỗi chữ — 88 lời gọi ở n = 30, vài phần trăm mili-giây. Trên Node, một request như vậy chặn đứng event loop, nên <em>mọi người dùng khác</em> cũng phải chờ. Đây cùng hình dạng với ReDoS (biểu thức chính quy quay lui theo hàm mũ) và cách phòng cũng vậy: không bao giờ chạy thuật toán hàm mũ trên dữ liệu người dùng gửi; nhớ kết quả hoặc dùng bảng; giới hạn độ dài đầu vào; đặt ngân sách thời gian cho công việc.</p>
</div>

<div class="ml-en">
<h3>Worked example 5: Longest Increasing Subsequence — ${L.lis}</h3>
<p><strong>Problem (in our words).</strong> Return the length of the longest strictly increasing <em>subsequence</em> — elements in their original order, gaps allowed. <code>[10, 9, 2, 5, 3, 7, 101, 18]</code> → 4 (2, 3, 7, 18).</p>
<p><strong>O(n²) first — the four questions.</strong></p>
<ul>
<li><strong>State:</strong> <code>dp[i]</code> = the length of the longest increasing subsequence that <em>ends at</em> index i. "Ends at" is the trick: it tells us the last value, so we know what may come next.</li>
<li><strong>Transition:</strong> <code>dp[i] = 1 + max(dp[j])</code> over all <code>j &lt; i</code> with <code>nums[j] &lt; nums[i]</code> (or 1 if there is none).</li>
<li><strong>Base:</strong> every <code>dp[i]</code> starts at 1 — the element alone.</li>
<li><strong>Order:</strong> i left to right. Answer: the maximum over all <code>dp[i]</code>, <em>not</em> <code>dp[n − 1]</code> — the best run may end anywhere.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Đề giải mẫu 5: Longest Increasing Subsequence — ${L.lis}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Trả về độ dài <em>dãy con</em> tăng ngặt dài nhất — các phần tử giữ thứ tự ban đầu, được bỏ cách quãng. <code>[10, 9, 2, 5, 3, 7, 101, 18]</code> → 4 (2, 3, 7, 18).</p>
<p><strong>O(n²) trước — bốn câu hỏi.</strong></p>
<ul>
<li><strong>Trạng thái:</strong> <code>dp[i]</code> = độ dài dãy con tăng dài nhất <em>kết thúc tại</em> chỉ số i. "Kết thúc tại" là mẹo: nó cho biết giá trị cuối, nên ta biết phần tử nào được phép đi tiếp.</li>
<li><strong>Chuyển:</strong> <code>dp[i] = 1 + max(dp[j])</code> trên mọi <code>j &lt; i</code> có <code>nums[j] &lt; nums[i]</code> (không có j nào thì là 1).</li>
<li><strong>Cơ sở:</strong> mọi <code>dp[i]</code> bắt đầu bằng 1 — riêng phần tử đó.</li>
<li><strong>Thứ tự:</strong> i từ trái sang phải. Đáp án: max của mọi <code>dp[i]</code>, <em>không phải</em> <code>dp[n − 1]</code> — dãy tốt nhất có thể kết thúc ở bất kỳ đâu.</li>
</ul>
${csd('csd201-slide-cs3-2', 'vi', 'CS.3 Quy hoạch động (2): đổi tiền, giải mã, tách từ, LIS', '<p>Bài CSD201 đi qua bốn đề này bằng Java và công thức truy hồi. Ôn một câu: LIS O(n²) lấy "dãy kết thúc tại i" làm trạng thái. <strong>Ở đây đi sâu thêm:</strong> bẫy tràn số và đổi thứ tự vòng lặp chạy thật, phép đo đệ quy tách từ nổ hàm mũ, và LIS O(n log n) viết bằng ĐÚNG khuôn nhị phân của Chương 4 thay vì một biến thể nhị phân mới.</p>')}
</div>
${maHai('ch09/b2/lis.ts', 'ch09/b2/McLis.java', { vung: 'n2' })}
<div class="ml-en">
<p>For <code>[2, 6, 3, 7, 1, 8, 4]</code> the dp row and the "previous index" row look like this (green = one longest run, recovered by following <code>prev</code> back from the largest dp):</p>
</div>
<div class="ml-vi">
<p>Với <code>[2, 6, 3, 7, 1, 8, 4]</code>, hàng dp và hàng "chỉ số trước đó" trông như sau (xanh = một dãy dài nhất, tìm lại bằng cách lần theo <code>prev</code> từ ô dp lớn nhất):</p>
</div>
${DONG_N2}

<div class="ml-en">
<h3>From O(n²) to O(n log n): keep the smallest tails</h3>
<p>n ≤ 2 500 on LeetCode, so O(n²) passes — but "can you do better?" is the standard follow-up. The idea (from the card game patience): keep an array <code>tails</code> where <code>tails[k]</code> is the <em>smallest possible last value</em> of an increasing subsequence of length k + 1 seen so far. A smaller tail is always better, because more future numbers can extend it. <code>tails</code> is always sorted, so for each new x we ask a binary-search question: "where is the first tail ≥ x?". If there is none, x extends the longest run (push); otherwise x becomes a smaller tail for that length (replace).</p>
<p>That question is <code>lowerBound</code> — and we write it with the very same <code>firstTrue(lo, hi, ok)</code> template of <a href="${baiNay('dsa-4-1-co-ban')}">lesson 4.1</a>, unchanged, not a new binary search: <code>firstTrue(0, tails.length, i =&gt; tails[i] &gt;= x)</code>. Use <code>&gt;=</code> for a <em>strictly</em> increasing run (an equal value replaces, never extends); <code>&gt;</code> would give the longest non-decreasing run.</p>
</div>
<div class="ml-vi">
<h3>Từ O(n²) xuống O(n log n): giữ những cái đuôi nhỏ nhất</h3>
<p>Trên LeetCode n ≤ 2 500 nên O(n²) qua — nhưng "làm tốt hơn được không?" là câu hỏi nối tiếp kinh điển. Ý tưởng (từ trò bài patience): giữ mảng <code>tails</code> với <code>tails[k]</code> là <em>giá trị cuối nhỏ nhất có thể</em> của một dãy con tăng dài k + 1 đã gặp tới giờ. Đuôi càng nhỏ càng tốt, vì càng nhiều số về sau nối được vào. <code>tails</code> luôn được sắp xếp, nên với mỗi x mới ta hỏi một câu nhị phân: "đuôi đầu tiên ≥ x ở đâu?". Không có thì x nối dài dãy dài nhất (push); có thì x trở thành cái đuôi nhỏ hơn cho độ dài đó (thay thế).</p>
<p>Câu hỏi đó chính là <code>lowerBound</code> — và ta viết nó bằng ĐÚNG khuôn <code>firstTrue(lo, hi, ok)</code> của <a href="${baiNay('dsa-4-1-co-ban')}">bài 4.1</a>, giữ nguyên, không học thêm một kiểu nhị phân mới: <code>firstTrue(0, tails.length, i =&gt; tails[i] &gt;= x)</code>. Dùng <code>&gt;=</code> cho dãy tăng <em>ngặt</em> (giá trị bằng nhau thì thay, không bao giờ nối); dùng <code>&gt;</code> thì ra dãy không giảm dài nhất.</p>
</div>
${maHai('ch09/b2/lis.ts', 'ch09/b2/McLis.java', { vung: 'khuon' })}
${maHai('ch09/b2/lis.ts', 'ch09/b2/McLis.java', { vung: 'nlogn' })}
${ketQua('ch09/b2/lis.ts')}
${BANG_TAILS}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Believing <code>tails</code> is a longest increasing subsequence.</strong></p><p>The final <code>tails</code> above is <code>[${VL[VL.length - 1].sau.join(', ')}]</code> — length 4, correct — but it is <em>not</em> a subsequence of the input: the 1 sits at index 4, after the 3 (index 2) that follows it in <code>tails</code>. Each cell of <code>tails</code> belongs to a different candidate run. Its <em>length</em> is the answer; its <em>contents</em> are not. If you need the actual run in O(n log n), store for every element the index of its predecessor at the moment it was placed, and walk back — or use the O(n²) <code>prev</code> array shown earlier.</p></div>
<p>Step 4 is the moment to understand: x = 1 replaces the 2 at <code>tails[0]</code>. The run "2, 3, 7" is not destroyed — its length is still recorded as the length of <code>tails</code> — we only remembered that a run of length 1 can now end with something smaller.</p>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Tưởng <code>tails</code> là một dãy con tăng dài nhất.</strong></p><p><code>tails</code> cuối cùng ở trên là <code>[${VL[VL.length - 1].sau.join(', ')}]</code> — dài 4, đúng — nhưng nó <em>không</em> phải một dãy con của đầu vào: số 1 nằm ở chỉ số 4, tức là đứng SAU số 3 (chỉ số 2) vốn đứng sau nó trong <code>tails</code>. Mỗi ô của <code>tails</code> thuộc về một dãy ứng viên khác nhau. <em>Độ dài</em> của nó là đáp án; <em>nội dung</em> của nó thì không. Cần đúng dãy trong O(n log n) thì lưu cho mỗi phần tử chỉ số của phần tử đứng trước nó lúc nó được đặt vào, rồi đi lùi — hoặc dùng mảng <code>prev</code> của bản O(n²) ở trên.</p></div>
<p>Bước 4 là khoảnh khắc cần hiểu: x = 1 thay số 2 ở <code>tails[0]</code>. Dãy "2, 3, 7" không bị phá — độ dài của nó vẫn được ghi nhận bằng độ dài của <code>tails</code> — ta chỉ ghi nhớ rằng một dãy dài 1 giờ có thể kết thúc bằng một số nhỏ hơn.</p>
</div>

<div class="ml-en">
<h3>Worked example 6: Maximum Subarray (Kadane) — ${L.max}</h3>
<p><strong>Problem (in our words).</strong> The largest sum of a non-empty <em>contiguous</em> subarray. <code>[−2, 1, −3, 4, −1, 2, 1, −5, 4]</code> → 6 (4, −1, 2, 1).</p>
<p>Kadane's algorithm is usually taught as a trick. It is really the smallest possible DP:</p>
<ul>
<li><strong>State:</strong> <code>endHere</code> = the best sum of a subarray that <em>ends exactly at</em> i (the same "ends at" idea as LIS).</li>
<li><strong>Transition:</strong> either the run ending at i − 1 is worth extending, or it is not and we start fresh at i: <code>endHere = max(nums[i], endHere + nums[i])</code>.</li>
<li><strong>Base:</strong> <code>endHere = best = nums[0]</code>.</li>
<li><strong>Order:</strong> left to right; answer = the maximum <code>endHere</code> ever seen. Only the previous cell is read, so the table is one variable: O(n) time, O(1) memory.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Đề giải mẫu 6: Maximum Subarray (Kadane) — ${L.max}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Tổng lớn nhất của một mảng con <em>liên tiếp</em> không rỗng. <code>[−2, 1, −3, 4, −1, 2, 1, −5, 4]</code> → 6 (4, −1, 2, 1).</p>
<p>Thuật toán Kadane thường được dạy như một mẹo. Thật ra nó là bài DP nhỏ nhất có thể:</p>
<ul>
<li><strong>Trạng thái:</strong> <code>endHere</code> = tổng lớn nhất của một mảng con <em>kết thúc đúng tại</em> i (cùng ý "kết thúc tại" như LIS).</li>
<li><strong>Chuyển:</strong> hoặc đoạn kết thúc tại i − 1 đáng để nối thêm, hoặc không và ta bắt đầu lại tại i: <code>endHere = max(nums[i], endHere + nums[i])</code>.</li>
<li><strong>Cơ sở:</strong> <code>endHere = best = nums[0]</code>.</li>
<li><strong>Thứ tự:</strong> trái sang phải; đáp án = <code>endHere</code> lớn nhất từng thấy. Chỉ đọc ô liền trước, nên bảng chỉ còn một biến: thời gian O(n), bộ nhớ O(1).</li>
</ul>
</div>
${maHai('ch09/b2/kadane.ts', 'ch09/b2/McKadane.java', { vung: 'kadane' })}
${BANG_KADANE}
${DONG_KADANE}
<div class="ml-en">
<p>Rows 1 and 3 start fresh: the run so far had a negative sum, and carrying a negative sum forward can only hurt. Row 3 (x = 4) is where the winning run begins; rows 4–6 extend it even through the −1, because 4 − 1 = 3 is still worth keeping. The best stays 6 to the end.</p>
</div>
<div class="ml-vi">
<p>Dòng 1 và 3 bắt đầu lại: đoạn trước đó có tổng âm, mà mang một tổng âm đi tiếp chỉ có hại. Dòng 3 (x = 4) là chỗ đoạn thắng bắt đầu; dòng 4–6 nối dài nó, kể cả qua số −1, vì 4 − 1 = 3 vẫn đáng giữ. best giữ nguyên 6 tới cuối.</p>
</div>
${ma('ch09/b2/kadane.ts', { vung: 'sai', nhan: 'TypeScript — a common wrong start' })}
${ketQua('ch09/b2/kadane.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Starting <code>best</code> at 0.</strong></p><p>The version that resets to 0 is a well-known form of Kadane — for problems where the empty subarray is allowed. Here it is not: on <code>[−3, −1, −2]</code> it returns 0, a sum of nothing, while the right answer is −1. Always ask "can the answer be empty?" and start from <code>nums[0]</code> when it cannot.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Cho <code>best</code> bắt đầu từ 0.</strong></p><p>Bản đặt lại về 0 là một dạng Kadane nổi tiếng — cho đề CHO PHÉP mảng con rỗng. Đề này thì không: trên <code>[−3, −1, −2]</code> nó trả 0, tổng của "không gì cả", trong khi đáp án đúng là −1. Luôn hỏi "đáp án có được rỗng không?" và bắt đầu từ <code>nums[0]</code> khi không được.</p></div>
</div>

<div class="ml-en">
<h3>Complexity at a glance</h3>
<table>
<thead><tr><th>Problem</th><th>State</th><th>Time</th><th>Memory (table → optimised)</th></tr></thead>
<tbody>
<tr><td>House Robber I / II</td><td>best from houses 0..i</td><td>O(n)</td><td>O(n) → O(1)</td></tr>
<tr><td>Coin Change</td><td>fewest coins for amount a</td><td>O(amount · k)</td><td>O(amount)</td></tr>
<tr><td>Coin Change II / Comb. Sum IV</td><td>ways to make amount a</td><td>O(amount · k)</td><td>O(amount)</td></tr>
<tr><td>Decode Ways</td><td>ways to decode a prefix</td><td>O(n)</td><td>O(n) → O(1)</td></tr>
<tr><td>Word Break</td><td>prefix can be cut</td><td>O(n · L) lookups (+ substring cost)</td><td>O(n)</td></tr>
<tr><td>LIS</td><td>longest run ending at i / tails</td><td>O(n²) → O(n log n)</td><td>O(n)</td></tr>
<tr><td>Maximum Subarray</td><td>best sum ending at i</td><td>O(n)</td><td>O(1)</td></tr>
</tbody></table>
<p>The rule behind the last column: if the transition reads only the last one or two cells, the array can shrink to one or two variables. Coin Change cannot shrink that way, because <code>dp[a − c]</code> can be far back.</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp nhìn một lượt</h3>
<table>
<thead><tr><th>Đề</th><th>Trạng thái</th><th>Thời gian</th><th>Bộ nhớ (bảng → tối ưu)</th></tr></thead>
<tbody>
<tr><td>House Robber I / II</td><td>nhiều nhất từ nhà 0..i</td><td>O(n)</td><td>O(n) → O(1)</td></tr>
<tr><td>Coin Change</td><td>ít đồng nhất cho số tiền a</td><td>O(amount · k)</td><td>O(amount)</td></tr>
<tr><td>Coin Change II / Comb. Sum IV</td><td>số cách ra số tiền a</td><td>O(amount · k)</td><td>O(amount)</td></tr>
<tr><td>Decode Ways</td><td>số cách giải mã một tiền tố</td><td>O(n)</td><td>O(n) → O(1)</td></tr>
<tr><td>Word Break</td><td>tiền tố cắt được</td><td>O(n · L) lần tra (+ chi phí cắt chuỗi)</td><td>O(n)</td></tr>
<tr><td>LIS</td><td>dãy dài nhất kết thúc tại i / tails</td><td>O(n²) → O(n log n)</td><td>O(n)</td></tr>
<tr><td>Maximum Subarray</td><td>tổng lớn nhất kết thúc tại i</td><td>O(n)</td><td>O(1)</td></tr>
</tbody></table>
<p>Luật đứng sau cột cuối: nếu phép chuyển chỉ đọc một hai ô cuối, mảng thu được về một hai biến. Coin Change không thu kiểu đó được, vì <code>dp[a − c]</code> có thể nằm rất xa phía sau.</p>
</div>

<div class="ml-en">
<h3>Where these patterns live at work</h3>
<ul>
<li><strong>Kadane on a price chart.</strong> "The best day to buy and the best day to sell" is Maximum Subarray on the day-to-day price <em>changes</em> — the stock problem of lesson 0.2 seen from a different angle. The same scan finds the worst stretch (minimise instead) in an error-rate graph during an incident review.</li>
<li><strong>Change-making machines.</strong> A vending machine or a self-checkout must return change with the coins it currently holds. When some denominations run out, the remaining set may no longer be "greedy-safe", and the machine needs exactly the Coin Change table (lesson 9.5 shows when greedy is safe).</li>
<li><strong>Diff tools.</strong> <code>git diff --patience</code> matches lines that appear exactly once in both files and keeps the longest run that is increasing in both — an LIS, computed with the same patience-sorting tails.</li>
<li><strong>Segmentation.</strong> Search engines and input methods for Chinese and Japanese, hashtag splitting, URL slugs — all Word Break with scores.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Các mẫu này sống ở đâu khi đi làm</h3>
<ul>
<li><strong>Kadane trên biểu đồ giá.</strong> "Ngày mua và ngày bán tốt nhất" chính là Maximum Subarray trên các <em>chênh lệch</em> giá giữa hai ngày liên tiếp — đề cổ phiếu của bài 0.2 nhìn từ góc khác. Cùng phép quét đó (đổi max thành min) tìm ra quãng tệ nhất trên đồ thị tỉ lệ lỗi khi họp rút kinh nghiệm sau sự cố.</li>
<li><strong>Máy trả tiền thừa.</strong> Máy bán hàng tự động hay quầy tự thanh toán phải trả tiền thừa bằng số tờ/đồng nó đang có. Khi vài mệnh giá hết, tập còn lại có thể không còn "an toàn cho tham lam", và máy cần đúng cái bảng Coin Change (bài 9.5 chỉ ra khi nào tham lam an toàn).</li>
<li><strong>Công cụ diff.</strong> <code>git diff --patience</code> ghép những dòng xuất hiện đúng một lần ở cả hai tệp rồi giữ dãy dài nhất tăng ở cả hai phía — một LIS, tính bằng đúng mảng tails của patience sorting.</li>
<li><strong>Tách từ.</strong> Tìm kiếm và bộ gõ tiếng Trung, tiếng Nhật, tách hashtag, sinh slug URL — đều là Word Break có điểm số.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: House Robber II</h3>
${hoiThoai([
  ['I', 'Houses on a circular street, each with some money; you cannot rob two neighbours. Maximum total?'],
  ['C', 'Just to confirm: amounts are non-negative, the first and last houses are neighbours, and with one house I simply take it?'],
  ['N', 'The one-house case is the edge case of this problem; asking about it early shows you see the circle.'],
  ['I', 'Yes to all three.'],
  ['C', 'Brute force tries every subset with no two neighbours — exponential. For a straight street I know a DP: dp[i] is the best from houses 0 to i; the last house is either skipped, giving dp[i−1], or robbed, giving nums[i] plus dp[i−2]. The circle only adds one constraint: house 0 and house n−1 are not both taken. So I run the straight version twice, once without the last house and once without the first, and take the max. O(n) time, O(1) space with two variables. Shall I code it?'],
  ['N', 'State, transition, base and order in a few sentences, then the reduction of the new problem to the known one.'],
  ['I', 'Go ahead.'],
  ['C', '(while coding) robLine takes an inclusive range so I do not copy arrays… prev2 and prev1 start at zero, which also handles an empty range. Then the single-house guard. Tracing [2, 3, 2]: without the last, best is 3; without the first, best is 3; answer 3. And [5, 1, 1, 5] gives 6, not 10, because the two 5s are neighbours.'],
  ['N', 'Narrate the decisions that prevent bugs (inclusive range, zero start, guard), then test the case that distinguishes the circle from the line.'],
  ['I', 'What if I also want to know which houses?'],
  ['C', 'Then I keep the full dp array for the winning range and walk back: if dp[i] differs from dp[i−1], house i was robbed and I jump two; otherwise I step one. Still O(n).'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: House Robber II</h3>
<p>Cùng mạch hội thoại bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Các nhà trên một con phố vòng tròn, mỗi nhà có ít tiền; không được trộm hai nhà kề nhau. Tổng nhiều nhất?'],
  ['C', 'Em xác nhận chút: số tiền không âm, nhà đầu và nhà cuối là hàng xóm, và nếu chỉ có một nhà thì em lấy luôn nhà đó ạ? <em>("Just to confirm: with one house I simply take it?")</em>'],
  ['N', 'Ca một nhà là ca biên của đề này; hỏi sớm cho thấy bạn đã thấy vòng tròn.'],
  ['I', 'Đúng cả ba.'],
  ['C', 'Vét cạn thử mọi tập con không có hai nhà kề — hàm mũ. Với phố thẳng em biết một DP: dp[i] là nhiều nhất từ nhà 0 tới i; nhà cuối hoặc bị bỏ, được dp[i−1], hoặc bị lấy, được nums[i] cộng dp[i−2]. Vòng tròn chỉ thêm một ràng buộc: nhà 0 và nhà n−1 không cùng bị lấy. Nên em chạy bản thẳng hai lần, một lần bỏ nhà cuối, một lần bỏ nhà đầu, rồi lấy max. O(n) thời gian, O(1) bộ nhớ với hai biến. Em code nhé? <em>("I run the straight version twice and take the max.")</em>'],
  ['N', 'Trạng thái, chuyển, cơ sở, thứ tự trong vài câu, rồi quy bài mới về bài đã biết.'],
  ['I', 'Ừ, làm đi.'],
  ['C', '(vừa code vừa nói) robLine nhận một đoạn đóng hai đầu để khỏi chép mảng… prev2 và prev1 bắt đầu bằng 0, nên đoạn rỗng cũng xử lý luôn. Rồi chặn ca một nhà. Chạy tay [2, 3, 2]: bỏ nhà cuối được 3; bỏ nhà đầu được 3; đáp án 3. Còn [5, 1, 1, 5] ra 6 chứ không phải 10, vì hai số 5 là hàng xóm.'],
  ['N', 'Thuật lại các quyết định chặn lỗi (đoạn đóng, bắt đầu từ 0, chặn ca biên), rồi test đúng ca phân biệt vòng tròn với đường thẳng.'],
  ['I', 'Nếu tôi muốn biết luôn những nhà nào thì sao?'],
  ['C', 'Thì em giữ cả mảng dp cho đoạn thắng rồi đi lùi: dp[i] khác dp[i−1] thì nhà i bị lấy và em nhảy lùi hai; không thì lùi một. Vẫn O(n). <em>("I walk back through the table.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Writing code before saying what <code>dp[i]</code> means — then the transition changes meaning halfway through and the base cases do not fit.</li>
<li>Table of size n when the state is "prefix of length i" (needs n + 1), or reading <code>dp[i − 2]</code> at i = 1.</li>
<li>Returning <code>dp[n − 1]</code> for LIS instead of the maximum over all i.</li>
<li><code>Integer.MAX_VALUE</code> as "impossible" followed by <code>+ 1</code>; use <code>amount + 1</code>.</li>
<li>Swapping the loops of a counting DP (combinations ↔ ordered sequences) without noticing.</li>
<li>Forgetting the edge cases each problem is built around: one house in a circle, a <code>'0'</code> in Decode Ways, an all-negative array in Kadane.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Viết code trước khi nói <code>dp[i]</code> nghĩa là gì — rồi giữa chừng phép chuyển đổi nghĩa và ca cơ sở không khớp.</li>
<li>Bảng kích thước n trong khi trạng thái là "tiền tố dài i" (cần n + 1), hoặc đọc <code>dp[i − 2]</code> khi i = 1.</li>
<li>Trả <code>dp[n − 1]</code> cho LIS thay vì max trên mọi i.</li>
<li>Dùng <code>Integer.MAX_VALUE</code> làm "không thể" rồi <code>+ 1</code>; hãy dùng <code>amount + 1</code>.</li>
<li>Đổi chỗ hai vòng của một DP đếm (tổ hợp ↔ dãy có thứ tự) mà không nhận ra.</li>
<li>Quên đúng ca biên mà mỗi đề được dựng quanh: một nhà trên vòng tròn, số <code>'0'</code> ở Decode Ways, mảng toàn số âm ở Kadane.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm trên LeetCode/NeetCode. Lời giải từng bước của 8 đề tổng hợp cả chương nằm ở bài 9.6 (Bộ luyện 9).</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write the four lines (state, transition, base, order) for House Robber, Coin Change and Decode Ways on paper. Only then code House Robber and run it on <code>[2, 7, 9, 3, 1]</code> (expect 12).</li>
<li>Write Coin Change in Java with <code>Integer.MAX_VALUE</code> on purpose, run <code>coins = [2], amount = 3</code>, see the negative number, then fix it with <code>amount + 1</code>.</li>
<li>Swap the two loops of Coin Change II and check that amount 5 with <code>[1, 2, 5]</code> gives 9 instead of 4. Write one sentence explaining why.</li>
<li>Submit LC 198, LC 322 and LC 300 (the O(n log n) version, using your <code>firstTrue</code> from Chapter 4).</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the 4 vs 9 explained in one sentence, and the four lines written for three problems before coding.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state</span><span class="v">What one cell of the table means, in one sentence.</span></div>
  <div class="kv"><span class="k">transition / recurrence</span><span class="v">The formula that builds a cell from smaller cells, found by looking at the last choice.</span></div>
  <div class="kv"><span class="k">base case</span><span class="v">The cells filled directly, because the formula would read outside the table.</span></div>
  <div class="kv"><span class="k">overlapping subproblems</span><span class="v">The same smaller problem is needed many times — the reason storing answers pays off.</span></div>
  <div class="kv"><span class="k">sentinel</span><span class="v">A value that means "impossible" and is safe to do arithmetic on (<code>amount + 1</code>).</span></div>
  <div class="kv"><span class="k">subsequence vs subarray</span><span class="v">Subsequence keeps order but may skip; subarray is contiguous.</span></div>
  <div class="kv"><span class="k">combination vs ordered sequence</span><span class="v">1+2 and 2+1 are one combination but two sequences; the loop order decides which you count.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Every 1D DP starts with four sentences: state, transition, base, order.</li>
<li>"Look at the last choice" finds the transition: last house, last coin, last letter, last word.</li>
<li>If only the last one or two cells are read, shrink the table to variables.</li>
<li>"Ends at i" states (LIS, Kadane) need a final maximum over all i.</li>
<li>Safe "impossible" = <code>amount + 1</code>; loop order decides combinations vs sequences.</li>
<li>Exponential recursion on user input is a denial-of-service bug; memo or table fixes it.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D Dynamic Programming', 'The standard problem order of this lesson, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📘', 'cp-algorithms — Longest increasing subsequence', 'O(n²) and O(n log n) versions, with recovery of the actual sequence', 'https://cp-algorithms.com/sequences/longest_increasing_subsequence.html')}
${nguon('📙', 'Maximum subarray problem (Wikipedia)', 'Kadane’s algorithm, its history and the empty-subarray variant', 'https://en.wikipedia.org/wiki/Maximum_subarray_problem')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết ra giấy bốn dòng (trạng thái, chuyển, cơ sở, thứ tự) cho House Robber, Coin Change và Decode Ways. Xong mới code House Robber và chạy với <code>[2, 7, 9, 3, 1]</code> (phải ra 12).</li>
<li>Cố tình viết Coin Change bằng Java với <code>Integer.MAX_VALUE</code>, chạy <code>coins = [2], amount = 3</code>, nhìn con số âm, rồi sửa bằng <code>amount + 1</code>.</li>
<li>Đổi chỗ hai vòng lặp của Coin Change II, kiểm số tiền 5 với <code>[1, 2, 5]</code> ra 9 thay vì 4. Viết một câu giải thích vì sao.</li>
<li>Nộp LC 198, LC 322 và LC 300 (bản O(n log n), dùng chính hàm <code>firstTrue</code> của bạn từ Chương 4).</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, giải thích được 4 với 9 trong một câu, và có bốn dòng viết sẵn cho ba đề trước khi code.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state (trạng thái)</span><span class="v">Một ô của bảng nghĩa là gì, nói trong một câu.</span></div>
  <div class="kv"><span class="k">transition / recurrence (phép chuyển / công thức truy hồi)</span><span class="v">Công thức dựng một ô từ các ô nhỏ hơn, tìm ra bằng cách nhìn lựa chọn cuối cùng.</span></div>
  <div class="kv"><span class="k">base case (ca cơ sở)</span><span class="v">Những ô điền trực tiếp, vì công thức sẽ đọc ra ngoài bảng.</span></div>
  <div class="kv"><span class="k">overlapping subproblems (bài con chồng lấn)</span><span class="v">Cùng một bài nhỏ bị cần nhiều lần — lý do cất đáp án lại là đáng.</span></div>
  <div class="kv"><span class="k">sentinel (giá trị canh)</span><span class="v">Giá trị mang nghĩa "không thể" mà vẫn an toàn khi làm phép tính (<code>amount + 1</code>).</span></div>
  <div class="kv"><span class="k">subsequence / subarray (dãy con / mảng con liên tiếp)</span><span class="v">Dãy con giữ thứ tự nhưng được bỏ phần tử; mảng con phải liền nhau.</span></div>
  <div class="kv"><span class="k">combination / ordered sequence (tổ hợp / dãy có thứ tự)</span><span class="v">1+2 và 2+1 là một tổ hợp nhưng hai dãy; thứ tự vòng lặp quyết định bạn đếm cái nào.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>DP một chiều nào cũng mở đầu bằng bốn câu: trạng thái, chuyển, cơ sở, thứ tự.</li>
<li>"Nhìn lựa chọn cuối cùng" là cách tìm phép chuyển: nhà cuối, đồng xu cuối, chữ cái cuối, từ cuối.</li>
<li>Chỉ đọc một hai ô cuối thì thu bảng về vài biến.</li>
<li>Trạng thái "kết thúc tại i" (LIS, Kadane) cần lấy max trên mọi i ở cuối.</li>
<li>"Không thể" an toàn = <code>amount + 1</code>; thứ tự vòng lặp quyết định tổ hợp hay dãy có thứ tự.</li>
<li>Đệ quy hàm mũ trên dữ liệu người dùng là lỗi từ chối dịch vụ; nhớ kết quả hoặc dùng bảng là chữa được.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D Dynamic Programming', 'Thứ tự đề chuẩn của bài này, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📘', 'cp-algorithms — Longest increasing subsequence', 'Bản O(n²) và O(n log n), kèm cách dựng lại chính dãy con', 'https://cp-algorithms.com/sequences/longest_increasing_subsequence.html')}
${nguon('📙', 'Maximum subarray problem (Wikipedia)', 'Thuật toán Kadane, lịch sử và biến thể cho phép mảng rỗng', 'https://en.wikipedia.org/wiki/Maximum_subarray_problem')}
</div>
`,
};
