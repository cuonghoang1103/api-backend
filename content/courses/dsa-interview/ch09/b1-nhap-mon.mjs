/** 9.1 — Quy hoạch động từ số 0. Mọi mã/output đọc từ ../ma/ch09/b1 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetDemLap, vetBang, vetHaiBien } from '../ma/ch09/b1/nhap.vet.mjs';

const N = 6;
const DL = vetDemLap(N);
const BANG_LAP = bangVet(['k', 'naive: how many times climb(k) runs', 'memo: computed', 'memo: looked up'],
  [...DL.hang.map((h) => [
    `<strong>${h.k}</strong>`,
    `${h.ngay} <span style="opacity:.6">${'●'.repeat(h.ngay)}</span>`,
    String(h.tinh),
    h.tra ? String(h.tra) : '·',
  ]), ['total', `<strong>${DL.tongNgay} calls</strong>`, `${DL.hang.reduce((s, h) => s + h.tinh, 0)}`, `${DL.hang.reduce((s, h) => s + h.tra, 0)} ⇒ ${DL.tongNho} calls`]]);

const BANG_DP = bangVet(['i', `dp[0..${N}] after this step`, 'how dp[i] was made'],
  vetBang(N).map((h) => [
    String(h.i),
    oMang(h.dp.map((v) => (v == null ? '·' : v)), { to: h.coSo ? { [h.i]: 'mo' } : { [h.i]: 'l', [h.i - 1]: 'cs', [h.i - 2]: 'cs' }, chiSo: true }),
    h.coSo ? 'base case' : `dp[${h.i - 1}] + dp[${h.i - 2}] = ${h.a} + ${h.b} = ${h.a + h.b}`,
  ]));

const BANG_2B = bangVet(['i', 'prev2, prev1 (before)', 'cur = prev1 + prev2', 'prev2, prev1 (after)'],
  vetHaiBien(N).map((h) => [String(h.i), `${h.p2}, ${h.p1}`, `${h.p1} + ${h.p2} = <strong>${h.cur}</strong>`, `${h.p2m}, ${h.p1m}`]));

const DE = [
  [lc(509, 'fibonacci-number', 'Fibonacci Number', 'Easy'), 'Write all four versions; count the calls of each.', 'Viết đủ bốn phiên bản; đếm số lời gọi của từng bản.'],
  [lc(70, 'climbing-stairs', 'Climbing Stairs', 'Easy'), 'Case split on the LAST move; n ≤ 45 is exactly the int limit.', 'Chia trường hợp theo bước CUỐI; n ≤ 45 đúng bằng giới hạn của int.'],
  [lc(746, 'min-cost-climbing-stairs', 'Min Cost Climbing Stairs', 'Easy'), 'Same shape, but min instead of +; define where "the top" is.', 'Cùng hình dạng, nhưng min thay cho +; định nghĩa rõ "đỉnh" nằm ở đâu.'],
  [lc(1137, 'n-th-tribonacci-number', 'N-th Tribonacci Number', 'Easy'), 'Three previous cells ⇒ three rolling variables.', 'Ba ô phía trước ⇒ ba biến trượt.'],
  [lc(338, 'counting-bits', 'Counting Bits', 'Easy'), 'ans[i] built from a smaller index (i &gt;&gt; 1): DP without the word DP.', 'ans[i] dựng từ một chỉ số nhỏ hơn (i &gt;&gt; 1): DP mà không ai gọi tên.'],
  [lc(198, 'house-robber', 'House Robber', 'Medium'), 'Preview of 9.2: at each house, take it or skip it.', 'Xem trước bài 9.2: ở mỗi nhà, lấy hoặc bỏ qua.'],
  [lc(62, 'unique-paths', 'Unique Paths', 'Medium'), 'Preview of 9.3: the same recipe on a 2D table.', 'Xem trước bài 9.3: cùng công thức trên bảng hai chiều.'],
];

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">State</span><span class="lz-d">What does one cell mean, in one sentence? "dp[i] = number of ways to stand on step i."</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Transition</span><span class="lz-d">How is a cell built from smaller cells? Case split on the last decision: dp[i] = dp[i−1] + dp[i−2].</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Base cases</span><span class="lz-d">Which cells are known without the rule? dp[0] = 1, dp[1] = 1 — and check them on a tiny input.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Order + answer</span><span class="lz-d">Which cell must be filled first (i from small to large), and which cell holds the answer (dp[n])?</span></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trạng thái</span><span class="lz-d">Một ô nghĩa là gì, nói trong một câu? "dp[i] = số cách đứng được trên bậc i."</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chuyển</span><span class="lz-d">Một ô dựng từ những ô nhỏ hơn thế nào? Chia trường hợp theo quyết định cuối cùng: dp[i] = dp[i−1] + dp[i−2].</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cơ sở</span><span class="lz-d">Ô nào biết sẵn, không cần công thức? dp[0] = 1, dp[1] = 1 — và thử lại trên một đầu vào tí hon.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Thứ tự tính + đáp án</span><span class="lz-d">Ô nào phải điền trước (i từ nhỏ tới lớn), và đáp án nằm ở ô nào (dp[n])?</span></div>
</div>`;

export default {
  title: '9.1 — Dynamic programming from zero: recursion, memo, table, two variables|||9.1 — Quy hoạch động từ số 0: đệ quy, nhớ, bảng, hai biến',
  slug: 'dsa-9-1-nhap-mon',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Climbing Stairs viết bốn lần (đệ quy → nhớ → bảng → hai biến), đo thật fib n = 10…45 từ 3,67 tỉ lời gọi xuống 89, khuôn 4 câu hỏi trạng thái · chuyển · cơ sở · thứ tự, cùng các bẫy tràn số, tràn ngăn xếp và memo bằng 0.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Dynamic programming from zero: recursion, memo, table, two variables</h2>
<p class="lead">Dynamic programming (DP) is the topic candidates fear most, and interviewers know it: a DP question separates "memorised the answer" from "can build the answer". The good news is that DP is not a bag of tricks. It is one idea — <strong>never solve the same small problem twice</strong> — plus one habit: say four sentences before you write a line. This lesson builds both slowly, on the smallest problem there is, and keeps a promise made in lesson 0.1: the naive Fibonacci that needed 2,692,537 calls for n = 30 becomes O(n), and you will see the measured numbers.</p>

<h3>The everyday picture</h3>
<p>A friend writes <code>1+1+1+1+1+1+1+1</code> on the board and asks for the total. You count: 8. Then they add <code>+1</code> at the end and ask again. You do not count nine ones from the start — you say "9" at once, because you <em>remember</em> that the first part was 8. That is all of dynamic programming. The rest of the chapter is about two engineering questions: <em>what exactly</em> do you write down (the state), and <em>in what order</em> do you fill your notes so that every note you need is ready.</p>
<p>A second picture, closer to the problem we will solve: the staircase to your lab room has n steps, and you climb one or two steps at a time. How many different ways are there? You could list them all — but for 45 steps there are 1,836,311,903 of them. You need to count without listing.</p>
<p>Formally: <strong>dynamic programming</strong> solves a problem by combining answers of smaller <strong>subproblems</strong>, and stores each subproblem's answer so it is computed only once. It pays off when two things are true. <strong>Overlapping subproblems</strong>: the same small question comes up again and again (you will see it in a picture below). <strong>Optimal substructure</strong>: the answer to the big question can be built from answers to small ones (for counting problems: the count is a sum of smaller counts).</p>
<p>The name is famously misleading. Richard Bellman chose it at the RAND Corporation in the 1950s; in his autobiography he wrote that the Secretary of Defense of the time disliked the word "research", so he picked "dynamic" because it sounded impressive and could not be used as an insult, and "programming" in its old sense of <em>planning</em> — filling in a schedule, a table. It has nothing to do with writing code. Think "table-filling".</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Quy hoạch động từ số 0: đệ quy, nhớ, bảng, hai biến</h2>
<p class="lead">Quy hoạch động (dynamic programming — DP) là chủ đề ứng viên sợ nhất, và người phỏng vấn biết điều đó: một câu DP tách người "thuộc đáp án" khỏi người "dựng được đáp án". Tin tốt là DP không phải một túi mẹo. Nó là MỘT ý — <strong>không bao giờ giải cùng một bài toán nhỏ hai lần</strong> — cộng một thói quen: nói bốn câu trước khi viết một dòng code. Bài này dựng cả hai thật chậm, trên bài toán nhỏ nhất có thể, và giữ lời hứa ở bài 0.1: Fibonacci ngây thơ cần 2.692.537 lời gọi với n = 30 sẽ trở thành O(n), và bạn sẽ thấy số đo thật.</p>

<h3>Hình dung đời thường</h3>
<p>Bạn cùng lớp viết lên bảng <code>1+1+1+1+1+1+1+1</code> rồi hỏi tổng bằng mấy. Bạn đếm: 8. Rồi bạn ấy viết thêm <code>+1</code> vào cuối và hỏi lại. Bạn không đếm lại chín số 1 từ đầu — bạn nói ngay "9", vì bạn <em>nhớ</em> phần đầu là 8. Đó là toàn bộ quy hoạch động. Phần còn lại của chương chỉ trả lời hai câu hỏi kỹ thuật: ghi lại <em>chính xác cái gì</em> (trạng thái), và điền sổ ghi chép <em>theo thứ tự nào</em> để mỗi lần cần tra thì điều cần tra đã có sẵn.</p>
<p>Hình dung thứ hai, gần với bài ta sắp giải: cầu thang lên phòng lab có n bậc, mỗi bước bạn leo 1 hoặc 2 bậc. Có bao nhiêu cách leo khác nhau? Bạn có thể liệt kê hết — nhưng với 45 bậc thì có 1.836.311.903 cách. Bạn cần ĐẾM mà không LIỆT KÊ.</p>
<p>Nói cho chuẩn: <strong>quy hoạch động</strong> giải một bài toán bằng cách ghép đáp án của các <strong>bài toán con</strong> (subproblem) nhỏ hơn, và cất đáp án của mỗi bài toán con để mỗi cái chỉ phải tính một lần. Nó đáng dùng khi có đủ hai điều. <strong>Bài toán con gối nhau</strong> (overlapping subproblems): cùng một câu hỏi nhỏ lặp đi lặp lại (bạn sẽ thấy tận mắt trong hình bên dưới). <strong>Cấu trúc con tối ưu</strong> (optimal substructure): đáp án của câu hỏi lớn dựng được từ đáp án các câu hỏi nhỏ (với bài đếm: số cách là tổng các số cách nhỏ hơn).</p>
<p>Cái tên nổi tiếng là gây hiểu lầm. Richard Bellman đặt nó ở tập đoàn RAND những năm 1950; trong tự truyện ông kể Bộ trưởng Quốc phòng thời đó ghét chữ "nghiên cứu" (research), nên ông chọn "dynamic" (động) vì nghe oai và không ai dùng nó để chê được, còn "programming" theo nghĩa cũ là <em>lập kế hoạch</em> — điền một lịch biểu, một cái bảng. Nó chẳng liên quan gì tới viết code. Tiếng Việt dịch "quy hoạch" là sát nghĩa: hãy nghĩ "điền bảng".</p>
${csd('csd201-slide-cs3-1', 'vi', 'CS.3 Quy hoạch động (1): nhớ, bảng, công thức 4 bước', '<p>Ở CSD201 bạn đã thấy hai cách cài DP (nhớ từ trên xuống, bảng từ dưới lên) và công thức 4 bước trên leo cầu thang, cướp nhà. Ôn nhanh một câu: <em>đệ quy + cất đáp án = nhớ; bỏ đệ quy, điền mảng từ nhỏ tới lớn = bảng.</em> <strong>Ở đây đi sâu thêm:</strong> đo thật cái giá của từng bản (3,67 tỉ lời gọi xuống còn 89), cách NÓI bốn câu trước khi code trong phòng phỏng vấn, và ba cái bẫy làm trượt ứng viên thật — tràn số, tràn ngăn xếp, và memo bằng 0.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when a problem is asking for DP</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"how many ways…"</span><span class="v">Counting without listing: ways to climb, to decode, to make change, paths in a grid. Listing is exponential; counting by addition is not.</span></div>
  <div class="kv"><span class="k">"minimum / maximum cost, longest, fewest"</span><span class="v">An optimum over many choices: cheapest climb, fewest coins, longest increasing subsequence.</span></div>
  <div class="kv"><span class="k">"is it possible…"</span><span class="v">Can the string be split into dictionary words, can the array be split into two equal halves.</span></div>
  <div class="kv"><span class="k">a choice at every step, and the choices interact</span><span class="v">Take this house or skip it; use this coin or not. If one greedy rule obviously works, it is lesson 9.5 instead.</span></div>
  <div class="kv"><span class="k">your recursive brute force calls itself with the SAME arguments</span><span class="v">The decisive test. Draw three levels of the recursion tree: if you see f(3) twice, memoise.</span></div>
  <div class="kv"><span class="k">small n with an exponential brute force</span><span class="v">n ≤ 45 (Climbing Stairs), n ≤ 100 or ≤ 1000 with "choices" in the statement: the setter expects O(n) or O(n²), not 2ⁿ.</span></div>
</div>
<p>Lesson 9.4 turns these signals into a full recognition drill. Today we learn the recipe on the simplest case.</p>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đề đang đòi DP</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"có bao nhiêu cách…"</span><span class="v">Đếm mà không liệt kê: số cách leo, cách giải mã, cách đổi tiền, số đường đi trên lưới. Liệt kê là hàm mũ; đếm bằng phép cộng thì không.</span></div>
  <div class="kv"><span class="k">"chi phí nhỏ nhất / lớn nhất, dài nhất, ít nhất"</span><span class="v">Tối ưu trên rất nhiều lựa chọn: leo rẻ nhất, ít đồng xu nhất, dãy con tăng dài nhất.</span></div>
  <div class="kv"><span class="k">"có làm được không…"</span><span class="v">Chuỗi có tách được thành các từ trong từ điển không, mảng có chia được thành hai nửa bằng nhau không.</span></div>
  <div class="kv"><span class="k">mỗi bước có một lựa chọn, và các lựa chọn ảnh hưởng lẫn nhau</span><span class="v">Lấy nhà này hay bỏ qua; dùng đồng xu này hay không. Nếu một luật tham lam hiển nhiên đúng thì đó là bài 9.5.</span></div>
  <div class="kv"><span class="k">bản vét cạn đệ quy của bạn tự gọi lại với CÙNG tham số</span><span class="v">Phép thử quyết định. Vẽ ba tầng của cây đệ quy: thấy f(3) hai lần ⇒ nhớ lại (memoise).</span></div>
  <div class="kv"><span class="k">n nhỏ mà vét cạn là hàm mũ</span><span class="v">n ≤ 45 (Climbing Stairs), n ≤ 100 hay ≤ 1000 cùng chữ "lựa chọn" trong đề: người ra đề chờ O(n) hoặc O(n²), không phải 2ⁿ.</span></div>
</div>
<p>Bài 9.4 biến các dấu hiệu này thành một bài tập nhận diện đầy đủ. Hôm nay ta học công thức trên trường hợp đơn giản nhất.</p>
</div>

<div class="ml-en">
<h3>Worked example: Climbing Stairs, written four times</h3>
<p><strong>Problem (in our words).</strong> A staircase has <code>n</code> steps (1 ≤ n ≤ 45). Each move climbs 1 or 2 steps. In how many different orders of moves can you reach the top? Example: n = 3 → 3 ways (1+1+1, 1+2, 2+1).</p>
<p><strong>Step 1 — think about the LAST move, not the first.</strong> Every way of reaching step n ends with either a 1-step move (from step n−1) or a 2-step move (from step n−2). These two groups do not overlap (the last move is different) and together they cover every way. So the number of ways to reach n is the number of ways to reach n−1 <em>plus</em> the number of ways to reach n−2:</p>
<p style="text-align:center"><code>ways(n) = ways(n − 1) + ways(n − 2)</code></p>
<p>This sentence — "split on the last decision; the cases are disjoint and complete" — is the heart of every counting DP. Say it out loud in the interview: it is your proof.</p>
<p><strong>Step 2 — base cases.</strong> ways(1) = 1 (one single step). ways(0) = 1: there is exactly one way to "climb" zero steps — do nothing. It sounds like a trick, so check it: ways(2) = ways(1) + ways(0) = 2, and indeed 2 = 1+1 or 2. A base case is right when it makes the first non-trivial case come out right.</p>
<p><strong>Version 1 — plain recursion.</strong> Translate the sentence directly into code. It is correct. It is also hopeless for n = 45, and the next section shows why.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Climbing Stairs, viết bốn lần</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cầu thang có <code>n</code> bậc (1 ≤ n ≤ 45). Mỗi bước leo 1 hoặc 2 bậc. Có bao nhiêu thứ tự bước khác nhau để lên tới đỉnh? Ví dụ: n = 3 → 3 cách (1+1+1, 1+2, 2+1).</p>
<p><strong>Bước 1 — nghĩ về bước CUỐI CÙNG, không phải bước đầu.</strong> Mọi cách lên bậc n đều kết thúc bằng một bước 1 bậc (từ bậc n−1) hoặc một bước 2 bậc (từ bậc n−2). Hai nhóm này không giao nhau (bước cuối khác nhau) và gộp lại thì đủ mọi cách. Vậy số cách lên bậc n bằng số cách lên n−1 <em>cộng</em> số cách lên n−2:</p>
<p style="text-align:center"><code>ways(n) = ways(n − 1) + ways(n − 2)</code></p>
<p>Câu này — "chia trường hợp theo quyết định cuối cùng; các trường hợp rời nhau và phủ đủ" — là trái tim của mọi bài DP đếm. Hãy nói to nó khi phỏng vấn: đó chính là phần chứng minh của bạn.</p>
<p><strong>Bước 2 — ca cơ sở (base case).</strong> ways(1) = 1 (một bước đơn). ways(0) = 1: có đúng một cách "leo" 0 bậc — đứng yên. Nghe như ăn gian, nên hãy kiểm: ways(2) = ways(1) + ways(0) = 2, và đúng là 2 = 1+1 hoặc 2. Một ca cơ sở là đúng khi nó làm ca không tầm thường đầu tiên ra đúng.</p>
<p><strong>Phiên bản 1 — đệ quy trần.</strong> Dịch thẳng câu nói thành code. Nó đúng. Nó cũng vô vọng với n = 45, và mục tiếp theo cho thấy vì sao.</p>
</div>
${maHai('ch09/b1/leo-cau-thang.ts', 'ch09/b1/LeoCauThang.java', { vung: 'de-quy' })}

<div class="ml-en">
<h3>See the waste: the recursion tree</h3>
<p>Call <code>climbNaive(5)</code>. It calls climb(4) and climb(3). climb(4) calls climb(3) <em>again</em> and climb(2). Each of those spreads further. The simulation draws the whole tree (15 calls for n = 5), says "computing it AGAIN" every time a value of n is solved for the second, third, fifth time, and then draws the same question asked with a memo — where every repeat becomes a one-step lookup.</p>
${moPhong('ch09/b1/cay-de-quy.sim.js', 'en', 'Climbing Stairs: the recursion tree, without and with a memo', 'Opens /algorithms with this exact program: watch climb(2) get solved again and again, then watch the memo cut every repeated branch.')}
<p>Counting the same thing for n = 6, by running both versions and recording how often each subproblem k is touched:</p>
</div>
<div class="ml-vi">
<h3>Thấy chỗ phí: cây đệ quy</h3>
<p>Gọi <code>climbNaive(5)</code>. Nó gọi climb(4) và climb(3). climb(4) lại gọi climb(3) <em>một lần nữa</em> và climb(2). Mỗi lời gọi đó lại tỏa ra tiếp. Mô phỏng vẽ cả cây (15 lời gọi với n = 5), báo "computing it AGAIN" (tính LẠI lần nữa) mỗi khi một giá trị n bị giải lần thứ hai, thứ ba, thứ năm, rồi vẽ cùng câu hỏi đó khi có sổ nhớ (memo) — mọi lần lặp lại thành một phép tra một bước.</p>
${moPhong('ch09/b1/cay-de-quy.sim.js', 'vi', 'Climbing Stairs: cây đệ quy, không nhớ và có nhớ', 'Mở trang /algorithms với đúng chương trình này: xem climb(2) bị giải đi giải lại, rồi xem memo cắt mọi nhánh lặp.')}
<p>Đếm cùng điều đó với n = 6, bằng cách chạy thật cả hai phiên bản và ghi lại mỗi bài toán con k bị đụng tới bao nhiêu lần:</p>
</div>
${BANG_LAP}
<div class="ml-en">
<p>Read the "naive" column from the top: 1, 1, 2, 3, 5, 8, 5. The repeats grow like the Fibonacci numbers themselves — climb(1) alone runs 8 times for n = 6. In total ${DL.tongNgay} calls to answer a question whose table has only 7 cells. The memo columns show the cure: every k from 2 to 6 is <em>computed</em> exactly once; the three repeats (k = 2, 3, 4) become lookups; ${DL.tongNho} calls in total. In general the memo version makes 2n − 1 calls, the naive one about 1.6ⁿ.</p>
</div>
<div class="ml-vi">
<p>Đọc cột "naive" từ trên xuống: 1, 1, 2, 3, 5, 8, 5. Số lần lặp tăng y như chính dãy Fibonacci — riêng climb(1) đã chạy 8 lần với n = 6. Tổng cộng ${DL.tongNgay} lời gọi để trả lời một câu hỏi mà cái bảng chỉ có 7 ô. Hai cột memo cho thấy thuốc chữa: mỗi k từ 2 tới 6 được <em>tính</em> đúng một lần; ba lần lặp (k = 2, 3, 4) thành phép tra; tổng ${DL.tongNho} lời gọi. Tổng quát, bản có nhớ gọi 2n − 1 lần, bản ngây thơ khoảng 1,6ⁿ lần.</p>
</div>

<div class="ml-en">
<h3>Version 2 — memoisation (top-down)</h3>
<p><strong>Memoisation</strong> (from "memo", a note to yourself) keeps the recursive code and adds a notebook: before computing <code>climb(n)</code>, look it up; after computing it, write it down. Three lines changed, and the exponential tree collapses into a path. This is called <strong>top-down</strong> DP because you start from the big question (n) and recurse towards the small ones.</p>
</div>
<div class="ml-vi">
<h3>Phiên bản 2 — nhớ (memoisation, từ trên xuống)</h3>
<p><strong>Memoisation</strong> (từ chữ "memo" — mẩu ghi chú cho chính mình) giữ nguyên code đệ quy và thêm một cuốn sổ: trước khi tính <code>climb(n)</code> thì tra sổ; tính xong thì ghi vào sổ. Đổi ba dòng, và cái cây hàm mũ sụp xuống thành một đường thẳng. Cách này gọi là DP <strong>từ trên xuống</strong> (top-down) vì bạn bắt đầu từ câu hỏi lớn (n) và đệ quy dần về các câu hỏi nhỏ.</p>
</div>
${maHai('ch09/b1/leo-cau-thang.ts', 'ch09/b1/LeoCauThang.java', { vung: 'nho' })}
<div class="ml-en">
<p>Two details worth saying aloud. First, the lookup checks <code>!== undefined</code> (Java: <code>!= null</code>), not "is it truthy" — a stored answer can be 0, and the trap section below shows what happens when you forget. Second, the memo is written <em>before</em> returning; returning <code>climbMemo(n−1) + climbMemo(n−2)</code> directly and forgetting <code>memo.set</code> gives a program that looks memoised and is still exponential.</p>
<h3>Version 3 — the table (bottom-up)</h3>
<p>Look at the memo version from the side: every <code>climb(i)</code> needs only smaller indices. So we can skip the recursion entirely and fill an array from small to large — by the time we reach <code>dp[i]</code>, <code>dp[i−1]</code> and <code>dp[i−2]</code> are already there. This is <strong>tabulation</strong>, or <strong>bottom-up</strong> DP: the same recurrence, run as a loop.</p>
</div>
<div class="ml-vi">
<p>Hai chi tiết đáng nói to. Thứ nhất, phép tra kiểm <code>!== undefined</code> (Java: <code>!= null</code>), không phải "có truthy không" — một đáp án đã cất có thể bằng 0, và mục Bẫy bên dưới cho thấy chuyện gì xảy ra khi quên. Thứ hai, memo được ghi <em>trước</em> khi return; nếu return thẳng <code>climbMemo(n−1) + climbMemo(n−2)</code> mà quên <code>memo.set</code> thì bạn có một chương trình trông như có nhớ mà vẫn là hàm mũ.</p>
<h3>Phiên bản 3 — bảng (tabulation, từ dưới lên)</h3>
<p>Nhìn bản có nhớ từ bên cạnh: mỗi <code>climb(i)</code> chỉ cần các chỉ số nhỏ hơn. Vậy ta bỏ hẳn đệ quy, điền một mảng từ nhỏ tới lớn — khi tới <code>dp[i]</code> thì <code>dp[i−1]</code> và <code>dp[i−2]</code> đã nằm sẵn đó. Đây là <strong>lập bảng</strong> (tabulation), hay DP <strong>từ dưới lên</strong> (bottom-up): cùng công thức truy hồi, chạy bằng vòng lặp.</p>
</div>
${maHai('ch09/b1/leo-cau-thang.ts', 'ch09/b1/LeoCauThang.java', { vung: 'bang' })}
<div class="ml-en">
<p>Watch the table fill for n = ${N}. Grey = base case, blue = the cell being written, green = the two cells it reads. Produced by running the code, not typed:</p>
</div>
<div class="ml-vi">
<p>Xem cái bảng được điền với n = ${N}. Xám = ca cơ sở, xanh dương = ô đang ghi, xanh lá = hai ô nó đọc. Bảng sinh ra bằng cách chạy code, không gõ tay:</p>
</div>
${BANG_DP}
<div class="ml-en">
<p>Every row reads two green cells that were written in earlier rows — that is what "the order of computation is right" means. If you filled the array from right to left, the green cells would still be "·" (empty) when you need them. Keep that picture: in lesson 9.3 the order becomes row by row, and for palindromes even diagonal by diagonal, but the rule is always the same — <strong>a cell may only read cells that are already filled</strong>.</p>
<h3>Version 4 — two variables (O(1) memory)</h3>
<p>Look at the green cells again: row i reads only dp[i−1] and dp[i−2]. Everything to the left of them is never read again. So keep two variables instead of an array and slide them one step right on every iteration. This optimisation is what interviewers mean by "can you reduce the space?" — and the answer always starts with the question "which cells does the transition read?".</p>
</div>
<div class="ml-vi">
<p>Mỗi dòng đọc hai ô xanh lá đã được ghi ở những dòng trước — "thứ tự tính đúng" nghĩa là vậy. Nếu bạn điền mảng từ phải sang trái, các ô xanh lá vẫn còn là "·" (trống) đúng lúc bạn cần chúng. Giữ lấy hình ảnh này: ở bài 9.3 thứ tự thành từng hàng một, với xâu đối xứng thậm chí theo từng đường chéo, nhưng luật luôn là một — <strong>một ô chỉ được đọc những ô đã được điền</strong>.</p>
<h3>Phiên bản 4 — hai biến (bộ nhớ O(1))</h3>
<p>Nhìn lại các ô xanh lá: dòng i chỉ đọc dp[i−1] và dp[i−2]. Mọi thứ bên trái chúng không bao giờ được đọc lại. Vậy giữ hai biến thay cho cả mảng, và trượt chúng sang phải một bước sau mỗi vòng. Phép tối ưu này chính là thứ người phỏng vấn muốn khi hỏi "bạn giảm bộ nhớ được không?" — và câu trả lời luôn bắt đầu bằng câu hỏi "công thức chuyển đọc những ô nào?".</p>
</div>
${maHai('ch09/b1/leo-cau-thang.ts', 'ch09/b1/LeoCauThang.java', { vung: 'hai-bien' })}
${BANG_2B}
<div class="ml-en">
<p>The "after" pair of each row is the "before" pair of the next one: the window of two cells slides. The order of the two assignments matters — write <code>prev1 = cur</code> before <code>prev2 = prev1</code> and both variables end up equal to <code>cur</code>. All four versions, checked against each other:</p>
</div>
<div class="ml-vi">
<p>Cặp "after" (sau) của mỗi dòng chính là cặp "before" (trước) của dòng kế: cửa sổ hai ô trượt đi. Thứ tự hai phép gán là quan trọng — viết <code>prev1 = cur</code> trước <code>prev2 = prev1</code> thì cả hai biến cùng bằng <code>cur</code>. Cả bốn phiên bản, đối chiếu với nhau:</p>
</div>
${ketQua('ch09/b1/leo-cau-thang.ts')}
${ketQua('ch09/b1/LeoCauThang.java')}
<div class="ml-en">
<p>Same answers, wildly different work: for n = 30 the naive version makes 2,692,537 calls — the exact number lesson 0.1 counted for Fibonacci, because the two recursions have the same shape — and the memo version makes 59. And the last line is a small gift from the problem setter: ways(45) = 1,836,311,903, just under the int limit 2,147,483,647. The constraint "n ≤ 45" is not random; one step more overflows (see the traps).</p>
</div>
<div class="ml-vi">
<p>Cùng đáp án, khối lượng việc khác nhau một trời một vực: với n = 30 bản ngây thơ gọi 2.692.537 lần — đúng con số bài 0.1 đếm cho Fibonacci, vì hai phép đệ quy có cùng hình dạng — còn bản có nhớ gọi 59 lần. Và dòng cuối là món quà nhỏ của người ra đề: ways(45) = 1.836.311.903, vừa dưới giới hạn int 2.147.483.647. Ràng buộc "n ≤ 45" không phải ngẫu nhiên; thêm một bậc là tràn số (xem mục Bẫy).</p>
</div>

<div class="ml-en">
<h3>The recipe: four sentences before any code</h3>
<p>Everything above can be compressed into four questions. Answer them out loud, in this order, before writing code — in this lesson and in every DP problem of this chapter. Lesson 9.4 practises this until it is automatic.</p>
${FLOW_EN}
<p>Notice what is <em>not</em> in the recipe: no "which data structure", no "think of a trick". Most failed DP attempts in interviews fail at sentence 1: the candidate starts coding with a vague idea of what <code>dp[i]</code> means, and then cannot decide whether the answer is <code>dp[n]</code> or <code>dp[n−1]</code>. A precise state sentence makes the other three almost mechanical.</p>
</div>
<div class="ml-vi">
<h3>Công thức: bốn câu nói trước mọi dòng code</h3>
<p>Mọi thứ ở trên nén được thành bốn câu hỏi. Trả lời to, đúng thứ tự này, trước khi code — trong bài này và trong mọi bài DP của chương. Bài 9.4 luyện tới khi nó thành phản xạ.</p>
${FLOW_VI}
<p>Để ý những gì <em>không</em> có trong công thức: không có "dùng cấu trúc dữ liệu nào", không có "nghĩ ra một mẹo". Phần lớn các lần làm DP hỏng khi phỏng vấn hỏng ngay ở câu 1: ứng viên lao vào code với một ý mơ hồ về nghĩa của <code>dp[i]</code>, rồi không quyết được đáp án là <code>dp[n]</code> hay <code>dp[n−1]</code>. Một câu trạng thái chính xác làm ba câu còn lại gần như máy móc.</p>
</div>

<div class="ml-en">
<h3>The promise of lesson 0.1, measured: n = 10 … 45</h3>
<p>The same four versions for Fibonacci (fib(n) = fib(n−1) + fib(n−2), the recursion lesson 0.1 counted). Calls are counted exactly; time is the best of several laps. The naive version for n = 40 and 45 is run once, because it is slow on purpose:</p>
</div>
<div class="ml-vi">
<h3>Lời hứa của bài 0.1, đo bằng số: n = 10 … 45</h3>
<p>Cùng bốn phiên bản cho Fibonacci (fib(n) = fib(n−1) + fib(n−2), đúng phép đệ quy bài 0.1 đã đếm). Số lời gọi đếm chính xác; thời gian lấy lần nhanh nhất trong vài lượt. Bản ngây thơ với n = 40 và 45 chỉ chạy một lần, vì nó chậm một cách cố ý:</p>
</div>
${ma('ch09/b1/fib-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch09/b1/fib-do.ts')}
${ketQua('ch09/b1/FibDo.java')}
<div class="ml-en">
<p>Read it like an engineer. In the naive column, every +5 in n multiplies the calls by about 11 (2,692,537 → 29,860,703 → 331,160,281): that is 1.618⁵ ≈ 11.09, the golden ratio to the fifth power, i.e. O(φⁿ). Time follows the calls: Java goes 648.9 ms → 6,921.5 ms from n = 40 to 45 (×10.7). Node's last jump is larger (×17.7, 1,071.9 → 18,986.8 ms) because other heavy jobs were running on the machine during that single lap — one lap, one noisy number; the shape is what matters. At n = 45 the naive version makes <strong>3,672,623,805</strong> calls and needs about 19 seconds in Node; the memo version makes <strong>89</strong> calls (2n − 1) and needs 0.48 microseconds. That is about forty million times less work, for three changed lines. The table and the two-variable versions are faster still, because they skip the function calls and the map entirely: 0.20 µs and 0.04 µs.</p>
<p>Complexities, said precisely: naive — O(φⁿ) time, O(n) stack depth; memo — O(n) time, O(n) memory (the memo) plus O(n) stack; table — O(n) time, O(n) memory, no recursion; two variables — O(n) time, <strong>O(1)</strong> memory.</p>
</div>
<div class="ml-vi">
<p>Đọc như một kỹ sư. Ở cột naive, mỗi lần n tăng 5 thì số lời gọi nhân khoảng 11 (2.692.537 → 29.860.703 → 331.160.281): đó là 1,618⁵ ≈ 11,09, tỉ lệ vàng mũ năm, tức O(φⁿ). Thời gian đi theo số lời gọi: Java từ 648,9 ms lên 6.921,5 ms khi n đi từ 40 tới 45 (×10,7). Bước nhảy cuối của Node lớn hơn (×17,7, 1.071,9 → 18.986,8 ms) vì trong lượt đo duy nhất đó máy đang chạy song song những việc nặng khác — một lượt, một con số nhiễu; cái cần nhìn là hình dạng. Với n = 45, bản ngây thơ gọi <strong>3.672.623.805</strong> lần và cần khoảng 19 giây trên Node; bản có nhớ gọi <strong>89</strong> lần (2n − 1) và cần 0,48 micro giây. Tức ít việc hơn khoảng bốn mươi triệu lần, đổi lấy ba dòng code. Bản bảng và bản hai biến còn nhanh hơn nữa vì bỏ hẳn lời gọi hàm và cái Map: 0,20 µs và 0,04 µs.</p>
<p>Độ phức tạp, nói cho chính xác: ngây thơ — thời gian O(φⁿ), độ sâu ngăn xếp O(n); nhớ — thời gian O(n), bộ nhớ O(n) (cuốn sổ) cộng O(n) ngăn xếp; bảng — thời gian O(n), bộ nhớ O(n), không đệ quy; hai biến — thời gian O(n), bộ nhớ <strong>O(1)</strong>.</p>
${lienKet({ bai: 'dsa-0-1-big-o', title: '0.1 — Big-O dùng được để suy luận', sub: 'Nơi con số 2.692.537 lời gọi xuất hiện lần đầu — và lời hứa mà bài này vừa giữ', cta: 'Xem lại' })}
</div>

<div class="ml-en">
<h3>Top-down or bottom-up: which one in an interview?</h3>
<p>Both are accepted, and good candidates can switch between them. A practical rule:</p>
<ul>
<li><strong>Start top-down</strong> when the recurrence is not obvious yet. You write the brute-force recursion (which you should say first anyway), then add the memo — the interviewer watches you turn an exponential solution into a polynomial one in three lines. It also only visits the subproblems that are actually needed.</li>
<li><strong>Go bottom-up</strong> when you can state the order of computation, when n is large (no recursion depth — see the trap below), or when you are asked to reduce memory: you can only roll a table into a few variables once it is a table.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Từ trên xuống hay từ dưới lên: chọn cái nào khi phỏng vấn?</h3>
<p>Cả hai đều được chấp nhận, và ứng viên giỏi chuyển qua lại được. Một luật thực dụng:</p>
<ul>
<li><strong>Bắt đầu từ trên xuống</strong> khi công thức truy hồi chưa hiện rõ. Bạn viết đệ quy vét cạn (thứ đằng nào cũng nên nói trước), rồi thêm memo — người phỏng vấn được xem bạn biến lời giải hàm mũ thành đa thức bằng ba dòng. Nó cũng chỉ ghé những bài toán con thật sự cần.</li>
<li><strong>Chuyển sang từ dưới lên</strong> khi bạn nói được thứ tự tính, khi n lớn (không có độ sâu đệ quy — xem cái bẫy bên dưới), hoặc khi được yêu cầu giảm bộ nhớ: chỉ khi đã là một cái bảng thì mới cuộn nó lại thành vài biến được.</li>
</ul>
</div>

<div class="ml-en">
<h3>Same recipe, different skin: two variations</h3>
<p><strong>Min Cost Climbing Stairs (LC 746).</strong> <code>cost[i]</code> is the price of stepping on stair i; you may start on stair 0 or 1 for free, and "the top" is one past the last stair. State: <em>best(i) = cheapest total paid to stand on stair i</em> (not yet paying for i). Transition: you arrived from i−1 (paying cost[i−1]) or from i−2 (paying cost[i−2]) — take the min. Base: best(0) = best(1) = 0. Order: i = 2 … n. Answer: best(n). The only real difficulty is the state sentence — "stand on, not yet paid" — and that is exactly why it is worth saying.</p>
<p><strong>N-th Tribonacci (LC 1137).</strong> T(n) = T(n−1) + T(n−2) + T(n−3): the transition reads three cells, so you roll three variables.</p>
</div>
<div class="ml-vi">
<h3>Cùng công thức, khác vỏ: hai biến thể</h3>
<p><strong>Min Cost Climbing Stairs (LC 746).</strong> <code>cost[i]</code> là phí đặt chân lên bậc i; bạn được bắt đầu ở bậc 0 hoặc 1 miễn phí, và "đỉnh" là ngay sau bậc cuối. Trạng thái: <em>best(i) = tổng tiền ít nhất đã trả để đứng trên bậc i</em> (chưa trả phí của chính bậc i). Chuyển: bạn tới từ i−1 (trả cost[i−1]) hoặc từ i−2 (trả cost[i−2]) — lấy min. Cơ sở: best(0) = best(1) = 0. Thứ tự: i = 2 … n. Đáp án: best(n). Chỗ khó thật sự duy nhất là câu trạng thái — "đứng trên, chưa trả" — và đó chính là lý do đáng nói nó ra.</p>
<p><strong>N-th Tribonacci (LC 1137).</strong> T(n) = T(n−1) + T(n−2) + T(n−3): công thức chuyển đọc ba ô, nên bạn trượt ba biến.</p>
</div>
${maHai('ch09/b1/bien-the.ts', 'ch09/b1/BienThe91.java', { vungTs: 'lc746', vungJava: 'lc746' })}
${maHai('ch09/b1/bien-the.ts', 'ch09/b1/BienThe91.java', { vungTs: 'lc1137', vungJava: 'lc1137' })}
${ketQua('ch09/b1/bien-the.ts')}
<div class="ml-en">
<p>Check the second example by hand once: step on the four cheap 1s and jump over every 100 — 1+1+1+1+1+1 = 6. And note tribonacci(37) = 2,082,876,103: LeetCode caps this problem at n ≤ 37 for the same reason Climbing Stairs stops at 45 — the next value no longer fits in a 32-bit int.</p>
</div>
<div class="ml-vi">
<p>Kiểm tay ví dụ thứ hai một lần: đặt chân lên các bậc giá 1 và nhảy qua mọi bậc 100 — 1+1+1+1+1+1 = 6. Và để ý tribonacci(37) = 2.082.876.103: LeetCode chặn đề này ở n ≤ 37 cùng lý do Climbing Stairs dừng ở 45 — giá trị kế tiếp không còn vừa số nguyên 32 bit.</p>
</div>

<div class="ml-en">
<h3>Where this idea lives in real systems</h3>
<ul>
<li><strong>Every cache is a memo.</strong> This website's GIF search (<code>src/routes/gifs.routes.ts</code>) is memoisation over the network: <code>cache.get(cacheKey)</code> before calling GIPHY, <code>cache.set(cacheKey, …)</code> after. Two DP lessons are written into that file. The key had to grow from the query to <code>query@offset</code> once paging arrived — a memo key must contain <em>every</em> input that changes the answer, exactly like a DP state. And the map is capped at 200 entries "so a burst of unique queries can't grow memory forever": an unbounded memo on user-chosen keys is a memory leak an attacker can drive.</li>
<li><strong>Build systems and incremental compilation.</strong> Docker reuses a cached layer when its inputs did not change; <code>tsc --incremental</code> and Next.js skip work whose inputs hash the same. Same idea: answer = f(inputs), store it, reuse it.</li>
<li><strong>React <code>useMemo</code>.</strong> The frontend of this site uses it in hundreds of files: recompute a derived value only when its dependency list (the "state") changes. A missing dependency is the React version of an incomplete DP state — a stale answer.</li>
<li><strong>Counting without listing</strong> is everyday engineering: how many ways can a request be routed, how many test cases does a combination of options produce. When someone writes nested loops to <em>enumerate</em> something they only need to <em>count</em>, DP is the fix.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Ý tưởng này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Mọi bộ nhớ đệm (cache) đều là một memo.</strong> Ô tìm GIF của chính trang này (<code>src/routes/gifs.routes.ts</code>) là memoisation qua mạng: <code>cache.get(cacheKey)</code> trước khi gọi GIPHY, <code>cache.set(cacheKey, …)</code> sau khi có kết quả. Trong tệp đó có sẵn hai bài học DP. Khoá phải nở từ câu tìm kiếm thành <code>query@offset</code> khi có phân trang — khoá memo phải chứa <em>mọi</em> đầu vào làm đổi đáp án, y như trạng thái DP. Và cái Map bị chặn ở 200 mục "để một loạt truy vấn khác nhau không làm bộ nhớ phình mãi": một memo không giới hạn với khoá do người dùng chọn là rò rỉ bộ nhớ mà kẻ tấn công điều khiển được.</li>
<li><strong>Hệ thống build và biên dịch tăng dần.</strong> Docker dùng lại một lớp (layer) đã cache khi đầu vào không đổi; <code>tsc --incremental</code> và Next.js bỏ qua phần việc có đầu vào băm ra giống hệt. Cùng một ý: đáp án = f(đầu vào), cất lại, dùng lại.</li>
<li><strong><code>useMemo</code> của React.</strong> Frontend của trang dùng nó trong hàng trăm tệp: chỉ tính lại một giá trị dẫn xuất khi danh sách phụ thuộc (chính là "trạng thái") đổi. Thiếu một phụ thuộc là phiên bản React của một trạng thái DP thiếu chiều — trả về đáp án cũ.</li>
<li><strong>Đếm mà không liệt kê</strong> là việc kỹ thuật hằng ngày: có bao nhiêu cách định tuyến một request, một tổ hợp tuỳ chọn sinh ra bao nhiêu ca kiểm thử. Khi ai đó viết vòng lặp lồng để <em>liệt kê</em> thứ họ chỉ cần <em>đếm</em>, DP là thuốc chữa.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: exponential recursion on input you do not control</h3>
<p>Imagine an endpoint <code>GET /api/fib?n=…</code> written with the naive recursion — or, more realistically, any handler whose work is exponential in a number or a string length the client sends. Node runs your handlers on <strong>one thread</strong>. While one request computes, every other request waits. The program below schedules a 10 ms timer (think: the next user's request), then runs the handler synchronously:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: đệ quy hàm mũ trên đầu vào bạn không kiểm soát</h3>
<p>Thử tưởng tượng một endpoint <code>GET /api/fib?n=…</code> viết bằng đệ quy ngây thơ — hay thực tế hơn, bất kỳ handler nào có khối lượng việc tăng hàm mũ theo một con số hoặc độ dài chuỗi do client gửi lên. Node chạy các handler trên <strong>một luồng duy nhất</strong>. Trong lúc một request đang tính, mọi request khác phải đợi. Chương trình dưới đây hẹn một bộ hẹn giờ 10 ms (hãy nghĩ: request của người dùng tiếp theo), rồi chạy handler một cách đồng bộ:</p>
</div>
${ma('ch09/b1/chan-event-loop.ts', { nhan: 'TypeScript — event loop' })}
${ketQua('ch09/b1/chan-event-loop.ts')}
<div class="ml-en">
<p>With n = 40 the "next request" due in 10 ms was served after 1,757 ms; with the O(n) loop it was served on time (11 ms). One attacker sending <code>n=50</code> in a loop takes the whole server down — no botnet, no exploit, just your own algorithm. This is the same family as ReDoS (exponential regular expressions, practice set 9.6) and hash flooding (lesson 1.1). Defences: (1) the algorithm — DP turns the exponential into O(n); (2) <strong>validate bounds</strong> before doing work (a schema like <code>z.number().int().max(90)</code>); (3) cap the input size (<code>express.json({ limit })</code>, <code>.slice(0, 100)</code> on a query — exactly what the GIF route does); (4) move genuinely heavy work off the event loop (worker threads, a job queue) and give it a timeout.</p>
</div>
<div class="ml-vi">
<p>Với n = 40, "request kế tiếp" đáng lẽ được phục vụ sau 10 ms phải đợi tới 1.757 ms; với vòng lặp O(n) thì nó được phục vụ đúng hẹn (11 ms). Một kẻ tấn công gửi <code>n=50</code> liên tục là hạ cả máy chủ — không cần botnet, không cần lỗ hổng, chỉ cần chính thuật toán của bạn. Đây là cùng họ với ReDoS (biểu thức chính quy hàm mũ, bộ luyện 9.6) và làm ngập bảng băm (bài 1.1). Cách phòng: (1) thuật toán — DP biến hàm mũ thành O(n); (2) <strong>kiểm biên</strong> trước khi làm việc (một schema kiểu <code>z.number().int().max(90)</code>); (3) chặn kích thước đầu vào (<code>express.json({ limit })</code>, <code>.slice(0, 100)</code> cho câu truy vấn — đúng như route GIF đang làm); (4) đưa việc nặng thật sự ra khỏi event loop (worker thread, hàng đợi job) và cho nó một thời hạn.</p>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-2-4-chan-event-loop', title: 'Node.js 2.4 — Chặn event loop: đo bằng số thật', sub: 'Đi sâu hơn về vì sao một handler nặng làm đứng cả máy chủ, và cách đo nó', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Three traps that fail real candidates</h3>
<div class="pitfall co-tieu-de"><p><strong>Trap 1 — the answer outgrows your number type.</strong></p><p>Fibonacci-like numbers grow like 1.6ⁿ. In Java, <code>int</code> overflows silently (no exception) and <code>long</code> follows a bit later; in JavaScript there is no overflow, but a <code>Number</code> is exact only up to 2⁵³ − 1:</p></div>
</div>
<div class="ml-vi">
<h3>Ba cái bẫy làm trượt ứng viên thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Bẫy 1 — đáp án lớn vượt kiểu số của bạn.</strong></p><p>Các số kiểu Fibonacci tăng như 1,6ⁿ. Trong Java, <code>int</code> tràn một cách im lặng (không ném ngoại lệ) và <code>long</code> theo sau không lâu; trong JavaScript không có tràn số, nhưng một <code>Number</code> chỉ chính xác tới 2⁵³ − 1:</p></div>
</div>
${ma('ch09/b1/TranSo91.java', { vung: 'bay', nhan: 'Java' })}
${ketQua('ch09/b1/TranSo91.java')}
${ketQua('ch09/b1/tran-so.ts')}
<div class="ml-en">
<p>Java: ways(46) came out as −1,323,752,223 — a negative number of ways, and no error. <code>Math.addExact</code> turns the silent overflow into an exception, which is what you want while testing. JavaScript: from fib(79) on, the Number answer is wrong in the last digits (…220 instead of …221) and fib(100) is off by about 85,000. When a problem says "return the answer modulo 10⁹ + 7", apply <code>% MOD</code> after every addition, so every intermediate value stays small and exact; when it does not, read the constraint (n ≤ 45, n ≤ 37) — it tells you which type is enough.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap 2 — <code>if (memo[n])</code>: a stored 0 looks like "not computed".</strong></p><p>Counting problems are full of zero answers. Here: ways to climb n steps using only 2-step and 4-step moves — every odd n has 0 ways. Same code, one character of difference in the lookup:</p></div>
</div>
<div class="ml-vi">
<p>Java: ways(46) ra −1.323.752.223 — một số cách leo ÂM, mà chẳng có lỗi gì. <code>Math.addExact</code> biến cú tràn im lặng thành một ngoại lệ, đúng thứ bạn muốn khi đang test. JavaScript: từ fib(79) trở đi, đáp án kiểu Number sai ở mấy chữ số cuối (…220 thay vì …221) và fib(100) lệch khoảng 85.000. Khi đề nói "trả về đáp án modulo 10⁹ + 7", hãy áp <code>% MOD</code> sau MỖI phép cộng để mọi giá trị trung gian luôn nhỏ và chính xác; khi đề không nói, hãy đọc ràng buộc (n ≤ 45, n ≤ 37) — nó cho biết kiểu nào là đủ.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy 2 — <code>if (memo[n])</code>: một số 0 đã cất trông như "chưa tính".</strong></p><p>Các bài đếm đầy những đáp án bằng 0. Ở đây: số cách leo n bậc chỉ bằng bước 2 và bước 4 — mọi n lẻ đều có 0 cách. Cùng một đoạn code, khác đúng một chỗ trong phép tra:</p></div>
</div>
${ma('ch09/b1/bay-memo-0.ts', { vung: 'sai', nhan: 'TypeScript — wrong' })}
${ma('ch09/b1/bay-memo-0.ts', { vung: 'dung', nhan: 'TypeScript — right' })}
${ketQua('ch09/b1/bay-memo-0.ts')}
<div class="ml-en">
<p>Both versions return the right answer — that is why this bug survives the examples. But for n = 61 the falsy check makes 7,049,155 calls instead of 63: every zero is recomputed, so the "memoised" solution is exponential again and times out on the big tests. For n = 60 (an even number, no zeros on the path) the two are identical, which is how the bug hides. Java has the mirror image: an <code>int[] memo</code> starts full of 0s, so "0 means not computed" breaks on problems whose answers can be 0 — fill it with −1 (<code>Arrays.fill(memo, -1)</code>) or use <code>Integer[]</code> and test for <code>null</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap 3 — top-down is still recursion: its depth is n.</strong></p><p>The memo removes the repeated work, not the call stack. For n = 100,000 the memo version needs 100,000 nested calls:</p></div>
</div>
<div class="ml-vi">
<p>Cả hai bản đều trả đáp án đúng — chính vì thế lỗi này sống sót qua các ví dụ. Nhưng với n = 61 phép kiểm truthy gọi 7.049.155 lần thay vì 63: mọi số 0 bị tính lại, nên lời giải "có nhớ" lại thành hàm mũ và quá giờ ở các test lớn. Với n = 60 (số chẵn, không có số 0 nào trên đường đi) hai bản giống hệt nhau — đó là cách lỗi ẩn mình. Java có hình ảnh phản chiếu: một <code>int[] memo</code> mới tạo toàn số 0, nên quy ước "0 nghĩa là chưa tính" vỡ ở những bài có đáp án bằng 0 — hãy điền −1 (<code>Arrays.fill(memo, -1)</code>) hoặc dùng <code>Integer[]</code> và kiểm <code>null</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy 3 — từ trên xuống vẫn là đệ quy: độ sâu của nó là n.</strong></p><p>Memo bỏ đi phần việc lặp lại, không bỏ được ngăn xếp lời gọi. Với n = 100.000, bản có nhớ cần 100.000 lời gọi lồng nhau:</p></div>
</div>
${ma('ch09/b1/nho-sau.ts', { vung: 'sau', nhan: 'TypeScript' })}
${ketQua('ch09/b1/nho-sau.ts')}
<div class="ml-en">
<p>n = 1,000 is fine; n = 100,000 throws <code>RangeError: Maximum call stack size exceeded</code>, while the table answers instantly even for a million. Lesson 5.2 measured where the stack runs out: between about 6,900 and 10,400 frames in Node, depending on how warm the JIT is. When the constraints allow n ≥ 10⁴, write the bottom-up version — or say in the interview "the memoised version recurses n deep; for this n I would convert it to a loop".</p>
</div>
<div class="ml-vi">
<p>n = 1.000 thì ổn; n = 100.000 ném <code>RangeError: Maximum call stack size exceeded</code>, trong khi bản bảng trả lời ngay cả với một triệu. Bài 5.2 đã đo chỗ ngăn xếp cạn: khoảng 6.900 tới 10.400 tầng trên Node, tuỳ JIT đã "nóng" chưa. Khi ràng buộc cho n ≥ 10⁴, hãy viết bản từ dưới lên — hoặc nói khi phỏng vấn "bản có nhớ đệ quy sâu n tầng; với n cỡ này em sẽ đổi sang vòng lặp".</p>
${lienKet({ bai: 'dsa-5-2-de-quy', title: '5.2 — Mẫu đệ quy trên cây', sub: 'Đo thật độ sâu đệ quy làm sập Node và Java', cta: 'Xem lại' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'You climb a staircase of n steps, one or two steps at a time. How many distinct ways are there to reach the top?'],
  ['C', 'Just to confirm: the order matters, so 1+2 and 2+1 are different? And n is at least 1 — what is the upper bound?'],
  ['N', 'Order mattering is the whole difference between "permutations" and "combinations" in DP. The bound tells you the number type.'],
  ['I', 'Yes, order matters. n is between 1 and 45.'],
  ['C', 'Let me look at the last move. Any way to reach step n ends with a 1-step from n−1 or a 2-step from n−2; those groups are disjoint and cover everything, so ways(n) = ways(n−1) + ways(n−2), with ways(0) = ways(1) = 1. Written as plain recursion that is exponential — about 1.6 to the n — because ways(n−2) is computed inside ways(n−1) again.'],
  ['N', 'The recurrence with its one-line proof, the base cases, and the reason the naive version is slow. That is the four-question recipe, spoken.'],
  ['C', 'So: state dp[i] = ways to stand on step i; transition dp[i] = dp[i−1] + dp[i−2]; base dp[0] = dp[1] = 1; fill i from 2 to n; answer dp[n]. O(n) time. And since each step reads only the previous two cells, I can keep two variables: O(1) space. Shall I code that?'],
  ['I', 'Go ahead.'],
  ['C', '(coding) prev2 and prev1 start at 1… I compute cur first, then shift: prev2 = prev1, then prev1 = cur — in that order, or both become cur. Check n = 3: i = 2 gives 2, i = 3 gives 3. Matches 1+1+1, 1+2, 2+1. And n = 45 gives 1,836,311,903, which still fits in an int.'],
  ['N', 'Narrate the one order-sensitive line, then test with the example and the upper bound.'],
  ['I', 'What if you could also take 3 steps at a time? Or if some steps were broken?'],
  ['C', 'Three steps: the transition reads three cells, dp[i−1] + dp[i−2] + dp[i−3], three variables. Broken steps: set dp[i] = 0 for a broken i and keep the same loop — a cell you cannot stand on contributes nothing.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Bạn leo cầu thang n bậc, mỗi lần 1 hoặc 2 bậc. Có bao nhiêu cách khác nhau để lên đỉnh?'],
  ['C', 'Em xác nhận chút: thứ tự có tính, tức 1+2 và 2+1 là khác nhau ạ? Và n ít nhất là 1 — chặn trên là bao nhiêu? <em>("Does the order matter? What is the upper bound on n?")</em>'],
  ['N', 'Thứ tự có tính hay không là toàn bộ khác biệt giữa "hoán vị" và "tổ hợp" trong DP. Chặn trên cho biết dùng kiểu số nào.'],
  ['I', 'Có, thứ tự có tính. n từ 1 tới 45.'],
  ['C', 'Em nhìn bước cuối. Mọi cách lên bậc n đều kết thúc bằng bước 1 từ n−1 hoặc bước 2 từ n−2; hai nhóm rời nhau và phủ đủ, nên ways(n) = ways(n−1) + ways(n−2), với ways(0) = ways(1) = 1. Viết thành đệ quy trần thì là hàm mũ — cỡ 1,6 mũ n — vì ways(n−2) lại bị tính lại bên trong ways(n−1). <em>("The cases are disjoint and complete.")</em>'],
  ['N', 'Công thức truy hồi kèm chứng minh một câu, ca cơ sở, và lý do bản ngây thơ chậm. Đó là công thức bốn câu hỏi, nói thành lời.'],
  ['C', 'Vậy: trạng thái dp[i] = số cách đứng trên bậc i; chuyển dp[i] = dp[i−1] + dp[i−2]; cơ sở dp[0] = dp[1] = 1; điền i từ 2 tới n; đáp án dp[n]. Thời gian O(n). Và vì mỗi bước chỉ đọc hai ô trước, em giữ hai biến: bộ nhớ O(1). Em code bản này nhé? <em>("State, transition, base case, order of computation.")</em>'],
  ['I', 'Ừ, làm đi.'],
  ['C', '(vừa code vừa nói) prev2 và prev1 khởi đầu bằng 1… Em tính cur trước, rồi dịch: prev2 = prev1, sau đó prev1 = cur — đúng thứ tự này, không thì cả hai thành cur. Thử n = 3: i = 2 ra 2, i = 3 ra 3. Khớp 1+1+1, 1+2, 2+1. Và n = 45 ra 1.836.311.903, vẫn vừa int.'],
  ['N', 'Thuật lại đúng một dòng nhạy thứ tự, rồi test bằng ví dụ và bằng chặn trên.'],
  ['I', 'Nếu được leo cả 3 bậc một lần thì sao? Hoặc nếu có vài bậc bị hỏng?'],
  ['C', 'Ba bậc: công thức đọc ba ô, dp[i−1] + dp[i−2] + dp[i−3], giữ ba biến. Bậc hỏng: đặt dp[i] = 0 với bậc i hỏng và giữ nguyên vòng lặp — một ô không đứng được thì không đóng góp gì. <em>("A broken step contributes zero ways.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Coding before saying what <code>dp[i]</code> means — then mixing up "ways to reach i" and "ways from i to the top", and returning <code>dp[n−1]</code>.</li>
<li>Forgetting <code>memo.set</code> (or putting it after a <code>return</code>): the code looks memoised and is still exponential.</li>
<li>Checking the memo with a truthy test, or initialising a Java <code>int[]</code> memo with 0 when 0 is a legal answer.</li>
<li>An array of size n instead of n + 1 when the state runs from 0 to n — the classic off-by-one of tabulation.</li>
<li>Rolling variables in the wrong order (<code>prev1 = cur; prev2 = prev1;</code>).</li>
<li>Ignoring the type: <code>int</code> for answers that pass 2³¹, <code>Number</code> for answers that pass 2⁵³, or forgetting <code>% MOD</code> on an intermediate sum.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Code trước khi nói <code>dp[i]</code> nghĩa là gì — rồi lẫn "số cách tới được i" với "số cách từ i lên đỉnh", và trả về <code>dp[n−1]</code>.</li>
<li>Quên <code>memo.set</code> (hoặc đặt nó sau một <code>return</code>): code trông như có nhớ mà vẫn là hàm mũ.</li>
<li>Tra memo bằng phép kiểm truthy, hoặc khởi tạo memo <code>int[]</code> của Java bằng 0 trong khi 0 là một đáp án hợp lệ.</li>
<li>Mảng kích thước n thay vì n + 1 khi trạng thái chạy từ 0 tới n — lỗi lệch một kinh điển của lập bảng.</li>
<li>Trượt biến sai thứ tự (<code>prev1 = cur; prev2 = prev1;</code>).</li>
<li>Bỏ qua kiểu số: <code>int</code> cho đáp án vượt 2³¹, <code>Number</code> cho đáp án vượt 2⁵³, hoặc quên <code>% MOD</code> ở một tổng trung gian.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để tìm trên LeetCode/NeetCode. Hai đề cuối là bước sang bài <a href="${baiNay('dsa-9-2-mot-chieu')}">9.2</a> và <a href="${baiNay('dsa-9-3-hai-chieu')}">9.3</a>; làm thử trước bằng công thức bốn câu hỏi rồi đối chiếu.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write Climbing Stairs four times — recursion, memo, table, two variables — in your interview language. Print n = 1…10 from all four and check they agree.</li>
<li>Add a call counter to the naive and memo versions and reproduce the numbers 177 / 19 (n = 10) and 2,692,537 / 59 (n = 30).</li>
<li>Before coding LC 746, write the four sentences (state, transition, base, order + answer) in your notebook. Then code and submit it.</li>
<li>Break your memo on purpose with <code>if (memo[n])</code> on the 2-and-4-steps problem and see the call count explode for an odd n.</li>
</ol>
<p><strong>Done when:</strong> four agreeing versions, both pairs of call counts reproduced, LC 70 and LC 746 accepted, and the four sentences for LC 746 written down before its code.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dynamic programming (DP)</span><span class="v">Build the answer from answers to smaller subproblems, computing each subproblem once.</span></div>
  <div class="kv"><span class="k">overlapping subproblems</span><span class="v">The same small question appears many times in the brute-force recursion.</span></div>
  <div class="kv"><span class="k">optimal substructure</span><span class="v">The answer to the big problem is assembled from answers to smaller ones.</span></div>
  <div class="kv"><span class="k">memoisation (top-down)</span><span class="v">Recursion plus a lookup table: check before computing, store before returning.</span></div>
  <div class="kv"><span class="k">tabulation (bottom-up)</span><span class="v">Fill an array from the base cases upward, in an order where every needed cell is ready.</span></div>
  <div class="kv"><span class="k">state / transition / base case</span><span class="v">What a cell means; how it is built from smaller cells; which cells are known up front.</span></div>
  <div class="kv"><span class="k">space optimisation (rolling variables)</span><span class="v">Keep only the cells the transition still reads.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>DP = never solve the same subproblem twice; it applies when subproblems overlap and the answer is built from smaller answers.</li>
<li>Find the recurrence by splitting on the last decision; check the base cases on the smallest non-trivial input.</li>
<li>Four versions: recursion (φⁿ) → memo (O(n), stack n) → table (O(n), no recursion) → rolling variables (O(1) memory).</li>
<li>Measured: fib(45) went from 3,672,623,805 calls (19 s) to 89 calls (0.48 µs).</li>
<li>Say state, transition, base, order before coding — every time.</li>
<li>Traps: overflow (int at 46, Number at 79), falsy memo checks, recursion depth; exponential work on user input is a DoS.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D Dynamic Programming', 'The standard problem order for this chapter, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Dynamic programming — Wikipedia', 'Definitions, history of the name (Bellman), and many worked examples', 'https://en.wikipedia.org/wiki/Dynamic_programming')}
${nguon('📘', 'Memoization — Wikipedia', 'Where the word comes from, and memoisation beyond algorithms', 'https://en.wikipedia.org/wiki/Memoization')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết Climbing Stairs bốn lần — đệ quy, nhớ, bảng, hai biến — bằng ngôn ngữ bạn dùng khi phỏng vấn. In n = 1…10 từ cả bốn bản và kiểm chúng khớp nhau.</li>
<li>Thêm bộ đếm lời gọi vào bản ngây thơ và bản có nhớ, tái hiện các con số 177 / 19 (n = 10) và 2.692.537 / 59 (n = 30).</li>
<li>Trước khi code LC 746, viết bốn câu (trạng thái, chuyển, cơ sở, thứ tự + đáp án) vào sổ. Rồi code và nộp.</li>
<li>Cố ý làm hỏng memo bằng <code>if (memo[n])</code> trên bài bước 2 và bước 4, xem số lời gọi bùng nổ với một n lẻ.</li>
</ol>
<p><strong>Đạt khi:</strong> bốn bản khớp nhau, tái hiện được cả hai cặp số lời gọi, LC 70 và LC 746 Accepted, và bốn câu của LC 746 nằm trong sổ TRƯỚC code của nó.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">dynamic programming — DP (quy hoạch động)</span><span class="v">Dựng đáp án từ đáp án của các bài toán con nhỏ hơn, mỗi bài toán con tính một lần.</span></div>
  <div class="kv"><span class="k">overlapping subproblems (bài toán con gối nhau)</span><span class="v">Cùng một câu hỏi nhỏ xuất hiện nhiều lần trong đệ quy vét cạn.</span></div>
  <div class="kv"><span class="k">optimal substructure (cấu trúc con tối ưu)</span><span class="v">Đáp án bài lớn ghép được từ đáp án các bài nhỏ hơn.</span></div>
  <div class="kv"><span class="k">memoisation / top-down (nhớ / từ trên xuống)</span><span class="v">Đệ quy cộng một bảng tra: tra trước khi tính, cất trước khi trả về.</span></div>
  <div class="kv"><span class="k">tabulation / bottom-up (lập bảng / từ dưới lên)</span><span class="v">Điền mảng từ ca cơ sở trở lên, theo thứ tự mà mọi ô cần đọc đều đã sẵn.</span></div>
  <div class="kv"><span class="k">state / transition / base case (trạng thái / chuyển / ca cơ sở)</span><span class="v">Một ô nghĩa là gì; dựng từ các ô nhỏ hơn thế nào; ô nào biết sẵn.</span></div>
  <div class="kv"><span class="k">rolling variables (biến trượt — tối ưu bộ nhớ)</span><span class="v">Chỉ giữ những ô mà công thức chuyển còn đọc tới.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>DP = không bao giờ giải một bài toán con hai lần; dùng khi các bài toán con gối nhau và đáp án dựng từ các đáp án nhỏ hơn.</li>
<li>Tìm công thức truy hồi bằng cách chia trường hợp theo quyết định cuối; kiểm ca cơ sở trên đầu vào không tầm thường nhỏ nhất.</li>
<li>Bốn phiên bản: đệ quy (φⁿ) → nhớ (O(n), ngăn xếp sâu n) → bảng (O(n), không đệ quy) → biến trượt (bộ nhớ O(1)).</li>
<li>Đo thật: fib(45) từ 3.672.623.805 lời gọi (19 giây) xuống 89 lời gọi (0,48 µs).</li>
<li>Nói trạng thái, chuyển, cơ sở, thứ tự trước khi code — lần nào cũng vậy.</li>
<li>Bẫy: tràn số (int ở 46, Number ở 79), tra memo kiểu truthy, độ sâu đệ quy; việc hàm mũ trên đầu vào người dùng là một cửa DoS.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D Dynamic Programming', 'Thứ tự đề chuẩn cho chương này, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Dynamic programming — Wikipedia', 'Định nghĩa, lịch sử cái tên (Bellman), và nhiều ví dụ giải mẫu', 'https://en.wikipedia.org/wiki/Dynamic_programming')}
${nguon('📘', 'Memoization — Wikipedia', 'Nguồn gốc chữ "memoization", và việc nhớ kết quả ngoài phạm vi thuật toán', 'https://en.wikipedia.org/wiki/Memoization')}
</div>
`,
};
