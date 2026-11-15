/** 9.5 — Tham lam (bài MỚI ★, slug dsa-9-5-greedy). Mọi mã/output đọc từ ../ma/ch09/b5 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { vetCanJump, vetJump, vetGas } from '../ma/ch09/b5/tl.vet.mjs';

/* ── Bảng vết, sinh từ thuật toán thật ─────────────────────────────────────────────────────── */
const J1 = [1, 3, 0, 0, 2, 0, 1];
const J2 = [3, 2, 1, 0, 4];
const bangCanJump = (A) => bangVet(['i', 'nums (green = reachable)', 'i + nums[i]', 'far: before → after', 'decision'],
  vetCanJump(A).hang.map((h) => [
    String(h.i),
    oMang(A, { tu: 0, den: Math.min(h.far, A.length - 1), to: { [h.i]: h.chet ? 'x' : 'l', ...(h.xong ? { [A.length - 1]: 'ok' } : {}) }, chiSo: true }),
    h.chet ? '—' : String(h.i + A[h.i]),
    `${h.farTruoc} → ${h.far}`,
    h.chet ? '✗ i &gt; far ⇒ false' : h.xong ? `✅ far ≥ ${A.length - 1} ⇒ true` : 'go on',
  ]));
const BANG_J1 = bangCanJump(J1);
const BANG_J2 = bangCanJump(J2);

const J3 = [2, 3, 1, 1, 4];
const v3 = vetJump(J3);
const BANG_J3 = bangVet(['i', 'nums', 'far', 'i == end ?', 'jumps', 'end (edge of this level)'],
  v3.hang.map((h) => [
    String(h.i),
    oMang(J3, { to: { [h.i]: 'l', [Math.min(h.far, J3.length - 1)]: 'r' }, chiSo: true }),
    String(h.far),
    h.het ? '✔ level used up ⇒ jump' : '—',
    String(h.jumps),
    String(h.end),
  ]));

const GAS = [5, 1, 2, 3, 4], COST = [4, 4, 1, 5, 1];
const GAIN = GAS.map((g, i) => g - COST[i]);
const vg = vetGas(GAS, COST);
let tu = 0;
const BANG_GAS = bangVet(['i', 'gain = gas − cost (green = since start)', 'tank', 'total', 'start after this step'],
  vg.hang.map((h) => {
    const o = oMang(GAIN, { tu, den: h.i, to: { [h.i]: h.am ? 'x' : 'l' }, chiSo: true });
    if (h.am) tu = h.i + 1;
    return [String(h.i), o, h.am ? `${h.tank} &lt; 0 ⇒ reset to 0` : String(h.tank), String(h.total), h.am ? `<strong>${h.start}</strong>` : String(h.start)];
  }));

const DE = [
  [lc(455, 'assign-cookies', 'Assign Cookies', 'Easy'), 'Sort both; give the smallest cookie that satisfies the least greedy child.', 'Sắp xếp cả hai; đưa cái bánh nhỏ nhất đủ làm vừa lòng đứa trẻ dễ tính nhất.'],
  [lc(860, 'lemonade-change', 'Lemonade Change', 'Easy'), 'Making change with 5/10/20: when giving 15 back, spend a 10 first (keep the 5s, they are more useful).', 'Thối tiền với 5/10/20: khi phải thối 15, tiêu tờ 10 trước (giữ tờ 5 vì nó dùng được nhiều hơn).'],
  [lc(55, 'jump-game', 'Jump Game', 'Medium'), 'Keep one number: the farthest index reachable so far.', 'Giữ đúng một con số: chỉ số xa nhất tới được cho đến lúc này.'],
  [lc(45, 'jump-game-ii', 'Jump Game II', 'Medium'), 'BFS levels without a queue: count how many times a level is used up.', 'BFS theo tầng mà không cần hàng đợi: đếm số lần dùng hết một tầng.'],
  [lc(134, 'gas-station', 'Gas Station', 'Medium'), 'Reset the start when the tank goes negative; check the total once.', 'Đổi điểm xuất phát khi bình xăng âm; kiểm tổng một lần.'],
  [lc(435, 'non-overlapping-intervals', 'Non-overlapping Intervals', 'Medium'), 'Sort by END time; keep whatever ends earliest.', 'Sắp theo điểm KẾT THÚC; giữ cái kết thúc sớm nhất.'],
  [lc(1029, 'two-city-scheduling', 'Two City Scheduling', 'Medium'), 'Sort people by costA − costB; first half to A. Prove it by exchanging two people.', 'Sắp người theo costA − costB; nửa đầu đi A. Chứng minh bằng cách đổi chỗ hai người.'],
  [lc(678, 'valid-parenthesis-string', 'Valid Parenthesis String', 'Medium'), 'Track the RANGE [low, high] of possible open counts instead of every choice of *.', 'Theo dõi KHOẢNG [low, high] số ngoặc mở có thể có thay vì mọi cách chọn *.'],
  [lc(846, 'hand-of-straights', 'Hand of Straights', 'Medium'), 'The smallest card must start a group — no choice, so greedy is forced.', 'Lá nhỏ nhất bắt buộc mở đầu một nhóm — không có lựa chọn nào khác, nên tham lam là đương nhiên.'],
  [lc(135, 'candy', 'Candy', 'Hard'), 'Two passes (left→right, right→left), take the max of both constraints.', 'Hai lượt quét (trái→phải, phải→trái), lấy max của hai ràng buộc.'],
];

export default {
  title: '9.5 — Greedy: when the local best is the global best, and when it is not|||9.5 — Tham lam: khi nào chọn tốt nhất trước mắt là tốt nhất cả bài, và khi nào không',
  slug: 'dsa-9-5-greedy',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tham lam đúng và sai: phản ví dụ thối tiền [1,3,4] chạy thật, đối chiếu ngẫu nhiên để máy tự tìm phản ví dụ, Jump Game I/II, Gas Station, xếp lịch khoảng, và bộ lập sprint tham lam thật trong repo.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Greedy: when the local best is the global best, and when it is not</h2>
<p class="lead">Dynamic programming looks at <em>every</em> choice and keeps the best. A greedy algorithm looks at the choices in front of it, takes the one that looks best <em>right now</em>, and never looks back. When that works, it is the shortest, fastest code you can write in an interview — often O(n) with O(1) memory. When it does not work, it is confidently wrong, and it passes the three examples in the problem statement. This lesson teaches you to tell the two apart: with a real counterexample, a habit of letting the computer hunt for counterexamples, two proof sentences you can say out loud, and four classic problems.</p>

<h3>The everyday picture: the canteen cashier, again</h3>
<p>In lesson 1.1 you were the canteen cashier giving 9k change. Here is the other half of that job: choosing <em>which notes</em> to hand back. Every cashier in Vietnam does it the same way without thinking: take the biggest note that is not too big, subtract, repeat. 9k = 5k + 2k + 2k. That is a greedy algorithm, and for Vietnamese money it always gives the fewest notes.</p>
<p>Now imagine a game shop whose tokens come in 1, 3 and 4. A kid needs 6 tokens back. The cashier's reflex says 4 + 1 + 1 = three tokens. But 3 + 3 is two. The reflex was not lazy — it was <em>structurally</em> wrong for this set of values: taking the 4 first destroyed the possibility of using two 3s. That single example is the whole lesson in miniature: a greedy choice is safe only when it never closes a door that the best answer needs.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Tham lam: khi nào chọn tốt nhất trước mắt là tốt nhất cả bài, và khi nào không</h2>
<p class="lead">Quy hoạch động (dynamic programming) xét <em>mọi</em> lựa chọn rồi giữ cái tốt nhất. Thuật toán tham lam (greedy) nhìn những lựa chọn đang ở trước mặt, lấy cái trông tốt nhất <em>ngay lúc này</em>, và không bao giờ quay lại. Khi nó đúng, đó là đoạn code ngắn nhất, nhanh nhất bạn có thể viết trong buổi phỏng vấn — thường O(n) thời gian, O(1) bộ nhớ. Khi nó sai, nó sai một cách rất tự tin, và vẫn qua ba ví dụ trong đề. Bài này dạy bạn phân biệt hai trường hợp đó: bằng một phản ví dụ chạy thật, một thói quen để máy tự đi tìm phản ví dụ, hai câu chứng minh nói được thành lời, và bốn đề kinh điển.</p>

<h3>Hình dung đời thường: lại là quầy thu ngân căng-tin</h3>
<p>Ở bài 1.1 bạn đứng quầy thu ngân căng-tin và phải thối 9k. Đây là nửa còn lại của công việc đó: chọn <em>những tờ nào</em> để đưa lại. Thu ngân nào ở Việt Nam cũng làm y như nhau mà không cần nghĩ: lấy tờ lớn nhất chưa vượt quá số còn phải thối, trừ đi, lặp lại. 9k = 5k + 2k + 2k. Đó chính là một thuật toán tham lam, và với tiền Việt Nam nó luôn cho số tờ ít nhất.</p>
<p>Giờ tưởng tượng một tiệm game phát xu loại 1, 3 và 4. Một đứa trẻ cần nhận lại 6 xu. Phản xạ của thu ngân nói 4 + 1 + 1 = ba xu. Nhưng 3 + 3 chỉ có hai xu. Phản xạ đó không phải do lười — nó sai <em>về cấu trúc</em> với bộ mệnh giá này: lấy tờ 4 trước đã phá mất khả năng dùng hai tờ 3. Đúng một ví dụ đó là cả bài học thu nhỏ: một lựa chọn tham lam chỉ an toàn khi nó không bao giờ đóng lại cánh cửa mà đáp án tốt nhất cần đi qua.</p>
</div>

<div class="ml-en">
<h3>What "greedy" means, precisely</h3>
<p>A <strong>greedy algorithm</strong> builds the answer in steps; at each step it commits to the locally best option by some fixed rule (biggest coin, earliest end time, farthest reach) and never undoes that commitment. It is correct only when the problem has two properties:</p>
<ul>
<li><strong>Greedy-choice property</strong>: there is always <em>some</em> optimal answer that agrees with the greedy first choice. Taking it never makes the best result unreachable.</li>
<li><strong>Optimal substructure</strong>: after the first choice, what remains is a smaller copy of the same problem, and an optimal answer to it plus the first choice is optimal overall. DP needs this property too.</li>
</ul>
<p>So the difference from DP is one word: DP <em>tries</em> every first choice and compares; greedy <em>proves</em> one first choice is safe and skips the comparison. That is why greedy is faster — and why it needs an argument, not just examples.</p>
</div>
<div class="ml-vi">
<h3>"Tham lam" nghĩa là gì, cho chính xác</h3>
<p><strong>Thuật toán tham lam</strong> (greedy algorithm) dựng đáp án theo từng bước; ở mỗi bước nó cam kết với phương án tốt nhất <em>tại chỗ</em> theo một luật cố định (đồng xu lớn nhất, giờ kết thúc sớm nhất, nhảy được xa nhất) và không bao giờ huỷ cam kết đó. Nó chỉ đúng khi bài toán có hai tính chất:</p>
<ul>
<li><strong>Greedy-choice property</strong> (tính chất lựa chọn tham lam): luôn tồn tại <em>một</em> đáp án tối ưu nào đó trùng với lựa chọn đầu tiên của tham lam. Lấy lựa chọn đó không bao giờ làm đáp án tốt nhất trở nên không với tới được.</li>
<li><strong>Optimal substructure</strong> (cấu trúc con tối ưu): sau lựa chọn đầu tiên, phần còn lại là một bản nhỏ hơn của chính bài đó, và đáp án tối ưu của phần còn lại cộng lựa chọn đầu tiên là tối ưu cho cả bài. DP cũng cần tính chất này.</li>
</ul>
<p>Vậy khác biệt với DP gói trong một chữ: DP <em>thử</em> mọi lựa chọn đầu tiên rồi so sánh; tham lam <em>chứng minh</em> một lựa chọn đầu tiên là an toàn và bỏ qua phép so sánh. Vì thế tham lam nhanh hơn — và cũng vì thế nó cần một lập luận, chứ không chỉ cần vài ví dụ chạy đúng.</p>
${csd('csd201-slide-cs5-1', 'vi', 'CS.5 Tham lam: lập luận đổi chỗ, xếp lịch khoảng, jump game', '<p>Ở CSD201 bạn đã đi qua định nghĩa tham lam, lập luận đổi chỗ và bài xếp lịch khoảng theo slide. Ôn nhanh một câu: tham lam = chọn tốt nhất tại chỗ, không quay lại, phải chứng minh. <strong>Ở đây đi sâu thêm:</strong> phản ví dụ chạy thật, kỹ thuật đối chiếu ngẫu nhiên để tự tìm phản ví dụ trong 10 giây, cách NÓI chứng minh khi phỏng vấn, và một bộ lập sprint tham lam có thật trong chính repo này.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when to try greedy (and when to distrust it)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"maximum number of non-overlapping …", "minimum number of … to cover / remove"</span><span class="v">Scheduling and covering problems on intervals: sort by end time is the first thing to try.</span></div>
  <div class="kv"><span class="k">"can you reach …", "minimum number of jumps / refuels"</span><span class="v">Reachability on a line: keep the farthest point reachable.</span></div>
  <div class="kv"><span class="k">a circular route, a running balance going negative</span><span class="v">Gas Station shape: reset when the balance dips, check the total once.</span></div>
  <div class="kv"><span class="k">n ≤ 10⁵ and a DP would be O(n²) or O(n·W)</span><span class="v">The constraint hints at O(n log n) — often "sort, then one greedy pass".</span></div>
  <div class="kv"><span class="k">⚠ "minimum number of coins / items with arbitrary values", "maximise value under a weight limit"</span><span class="v">These smell greedy and are usually NOT: coin change and 0/1 knapsack need DP (lessons 9.2, 9.3).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào thử tham lam (và khi nào phải nghi ngờ nó)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"nhiều nhất bao nhiêu … không chồng nhau", "ít nhất bao nhiêu … để phủ / để bỏ"</span><span class="v">Bài xếp lịch và phủ trên các khoảng (interval): thứ đầu tiên nên thử là sắp theo điểm kết thúc.</span></div>
  <div class="kv"><span class="k">"có tới được … không", "ít nhất mấy lần nhảy / đổ xăng"</span><span class="v">Bài tới-được trên một đường thẳng: giữ điểm xa nhất tới được.</span></div>
  <div class="kv"><span class="k">một vòng tròn, một số dư chạy dần có thể bị âm</span><span class="v">Dạng Gas Station: đặt lại khi số dư tụt âm, kiểm tổng một lần.</span></div>
  <div class="kv"><span class="k">n ≤ 10⁵ mà DP sẽ là O(n²) hay O(n·W)</span><span class="v">Ràng buộc gợi ý O(n log n) — thường là "sắp xếp, rồi một lượt quét tham lam".</span></div>
  <div class="kv"><span class="k">⚠ "ít đồng xu / ít món nhất với giá trị tuỳ ý", "giá trị lớn nhất dưới giới hạn cân nặng"</span><span class="v">Nghe rất tham lam nhưng thường KHÔNG phải: đổi tiền (coin change) và cái túi 0/1 (0/1 knapsack) cần DP (bài <a href="${baiNay('dsa-9-2-mot-chieu')}">9.2</a>, <a href="${baiNay('dsa-9-3-hai-chieu')}">9.3</a>).</span></div>
</div>
</div>

<div class="ml-en">
<h3>The counterexample, run for real</h3>
<p>Below, <code>greedyCoins</code> is the cashier's reflex and <code>dpTable</code> is the exact answer from lesson 9.2 (${lc(322, 'coin-change', 'Coin Change', 'Medium')}). The last function compares them for <em>every</em> amount from 1 to 10,000 — not three examples, ten thousand.</p>
</div>
<div class="ml-vi">
<h3>Phản ví dụ, chạy thật</h3>
<p>Bên dưới, <code>greedyCoins</code> là phản xạ của thu ngân, còn <code>dpTable</code> là đáp án chính xác của bài 9.2 (${lc(322, 'coin-change', 'Coin Change', 'Medium')}). Hàm cuối so hai cái với <em>mọi</em> số tiền từ 1 tới 10.000 — không phải ba ví dụ, mà mười nghìn.</p>
</div>
${maHai('ch09/b5/tl-coin.ts', 'ch09/b5/TlCoin.java', { vung: 'greedy' })}
${ma('ch09/b5/tl-coin.ts', { vung: 'kiem', nhan: 'TypeScript — compare with DP on every amount' })}
${ketQua('ch09/b5/tl-coin.ts')}
${ketQua('ch09/b5/TlCoin.java')}
<div class="ml-en">
<p>Read the four lines. With a Vietnamese-style set (1, 2, 5 × 10ᵏ) greedy is right on all 10,000 amounts. With [1, 3, 4] it is wrong on <strong>2,499</strong> of them — 6, 10, 14, 18… every amount of the form 4k + 2, where it grabs a 4 and then pays 2 with two 1s instead of using two 3s. The US coins [1, 5, 10, 25] are also safe, but remove the nickel and greedy fails already at 30 (25 + 1 + 1 + 1 + 1 + 1 = six coins vs 10 + 10 + 10 = three). A set of denominations on which greedy is always optimal is called a <strong>canonical coin system</strong>. Real currencies are designed to be canonical precisely so that cashiers can be greedy. In an interview, LeetCode 322 gives you <em>arbitrary</em> coins — so the answer is DP, and saying "greedy fails on [1, 3, 4] with amount 6" is the one-sentence justification.</p>
</div>
<div class="ml-vi">
<p>Đọc bốn dòng. Với bộ mệnh giá kiểu Việt Nam (1, 2, 5 × 10ᵏ), tham lam đúng ở cả 10.000 số tiền. Với [1, 3, 4] nó sai ở <strong>2.499</strong> số — 6, 10, 14, 18… mọi số dạng 4k + 2, nơi nó vồ lấy một tờ 4 rồi phải trả 2 bằng hai tờ 1 thay vì dùng hai tờ 3. Bộ xu Mỹ [1, 5, 10, 25] cũng an toàn, nhưng bỏ đồng 5 xu đi thì tham lam sai ngay ở 30 (25 + 1 + 1 + 1 + 1 + 1 = sáu đồng, so với 10 + 10 + 10 = ba đồng). Một bộ mệnh giá mà trên đó tham lam luôn tối ưu gọi là <strong>canonical coin system</strong> (hệ mệnh giá chính tắc). Tiền thật được thiết kế chính tắc chính là để thu ngân được phép tham lam. Khi phỏng vấn, LeetCode 322 cho bạn mệnh giá <em>tuỳ ý</em> — nên đáp án là DP, và câu "tham lam sai với [1, 3, 4], số tiền 6" là lời biện minh gói trong một câu.</p>
</div>

<div class="ml-en">
<h3>How to decide in an interview: a five-step routine</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Name the greedy rule</span><span class="lz-d">"Always take the interval that ends first." One sentence, a fixed rule.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Attack it by hand for 2 minutes</span><span class="lz-d">Small, unbalanced inputs: one long item against many short ones, equal values, a value that "blocks" a better pair.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Stress test against brute force</span><span class="lz-d">Random tiny inputs, compare with an obviously correct slow solution. A counterexample appears in seconds if one exists.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Say the proof</span><span class="lz-d">Exchange argument or "greedy stays ahead" — two sentences, not a paper.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Or switch to DP</span><span class="lz-d">A counterexample means the choice depends on the future: that is the definition of a DP problem.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Quyết định khi phỏng vấn: quy trình năm bước</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gọi tên luật tham lam</span><span class="lz-d">"Luôn lấy khoảng kết thúc sớm nhất." Một câu, một luật cố định.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tấn công nó bằng tay trong 2 phút</span><span class="lz-d">Input nhỏ, lệch: một món dài chống lại nhiều món ngắn, giá trị bằng nhau, một giá trị "chặn" mất một cặp tốt hơn.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đối chiếu ngẫu nhiên với vét cạn</span><span class="lz-d">Input ngẫu nhiên thật nhỏ, so với một lời giải chậm nhưng hiển nhiên đúng. Nếu có phản ví dụ, nó lộ ra trong vài giây.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nói chứng minh</span><span class="lz-d">Lập luận đổi chỗ hoặc "tham lam luôn đi trước" — hai câu, không phải một bài báo.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Hoặc chuyển sang DP</span><span class="lz-d">Có phản ví dụ nghĩa là lựa chọn bây giờ phụ thuộc vào tương lai: đó chính là định nghĩa của một bài DP.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Step 3 as code: let the computer find the counterexample</h3>
<p>A <strong>stress test</strong> (randomised cross-check) is ten lines you can write in any practice session: generate thousands of tiny random inputs, run your fast idea and a slow but obviously correct solution, and stop at the first disagreement. The program below tries 500 random coin systems {1, a, b}; it uses a fixed seed so the output is the same on every run and in both languages.</p>
</div>
<div class="ml-vi">
<h3>Bước 3 thành code: để máy tự tìm phản ví dụ</h3>
<p><strong>Stress test</strong> (đối chiếu ngẫu nhiên) là mười dòng code bạn viết được trong bất kỳ buổi luyện nào: sinh hàng nghìn input ngẫu nhiên thật nhỏ, chạy ý tưởng nhanh của bạn và một lời giải chậm nhưng hiển nhiên đúng, dừng ở chỗ hai bên trả lời khác nhau đầu tiên. Chương trình bên dưới thử 500 bộ mệnh giá ngẫu nhiên {1, a, b}; nó dùng một seed (hạt giống ngẫu nhiên) cố định nên output giống hệt nhau ở mọi lần chạy và ở cả hai ngôn ngữ.</p>
</div>
${maHai('ch09/b5/tl-stress.ts', 'ch09/b5/TlStress.java', { vung: 'stress' })}
${ketQua('ch09/b5/tl-stress.ts')}
<div class="ml-en">
<p>The very first random system is already a counterexample: coins [1, 6, 13], amount 18 — greedy pays 13 + 1 + 1 + 1 + 1 + 1 (six coins), DP pays 6 + 6 + 6 (three). Across 500 systems greedy is wrong on 267. Nobody would have guessed that by staring at the code. Make this a reflex: whenever you are about to submit a greedy solution in practice, spend five minutes on a stress test. In a live interview you will not run it, but you will have built the intuition for <em>which</em> inputs break greedy — and you can say "I would verify this with a randomised check against brute force", which interviewers like to hear.</p>
</div>
<div class="ml-vi">
<p>Ngay bộ ngẫu nhiên đầu tiên đã là phản ví dụ: xu [1, 6, 13], số tiền 18 — tham lam trả 13 + 1 + 1 + 1 + 1 + 1 (sáu đồng), DP trả 6 + 6 + 6 (ba đồng). Trên 500 bộ, tham lam sai ở 267. Không ai đoán được điều đó chỉ bằng cách nhìn chằm chằm vào code. Hãy biến việc này thành phản xạ: mỗi lần sắp nộp một lời giải tham lam lúc luyện, bỏ năm phút viết stress test. Khi phỏng vấn trực tiếp bạn sẽ không chạy nó, nhưng bạn đã có trực giác về <em>loại</em> input nào làm tham lam gãy — và bạn có thể nói "em sẽ kiểm lại bằng một phép đối chiếu ngẫu nhiên với vét cạn" (<em>"I would verify this with a randomised check against brute force"</em>), câu mà người phỏng vấn rất thích nghe.</p>
</div>

<div class="ml-en">
<h3>Two proofs you can say out loud</h3>
<p><strong>Exchange argument.</strong> "Take any optimal answer. If it does not start with my greedy choice, swap its first choice for mine. The swap does not make it worse (and keeps it valid). Repeat, and the optimal answer becomes my greedy answer — so greedy is optimal." You will use it below for intervals.</p>
<p><strong>Greedy stays ahead.</strong> "After every step, my greedy solution is at least as far along as any other solution after the same number of steps — so it cannot finish later or with less." You will use it for the jump games: after k jumps, greedy has reached at least as far as any other way of jumping k times.</p>
<p>An interviewer does not expect a formal proof. They expect you to know that greedy <em>needs</em> one, to state which kind, and to name the counterexample when greedy fails.</p>
</div>
<div class="ml-vi">
<h3>Hai cách chứng minh nói được thành lời</h3>
<p><strong>Exchange argument</strong> (lập luận đổi chỗ). "Lấy một đáp án tối ưu bất kỳ. Nếu nó không bắt đầu bằng lựa chọn tham lam của em, đổi lựa chọn đầu của nó thành lựa chọn của em. Phép đổi không làm nó tệ đi (và vẫn hợp lệ). Lặp lại, đáp án tối ưu biến thành đáp án tham lam của em — vậy tham lam là tối ưu." Bạn sẽ dùng nó bên dưới cho bài khoảng.</p>
<p><strong>Greedy stays ahead</strong> (tham lam luôn đi trước). "Sau mỗi bước, lời giải tham lam của em đi được ít nhất xa bằng bất kỳ lời giải nào khác sau cùng số bước — nên nó không thể về đích muộn hơn hay ít hơn." Bạn sẽ dùng nó cho các bài nhảy: sau k lần nhảy, tham lam đã tới ít nhất xa bằng mọi cách nhảy k lần khác.</p>
<p>Người phỏng vấn không chờ một chứng minh hình thức. Họ chờ bạn biết rằng tham lam <em>cần</em> chứng minh, nói được dùng kiểu nào, và chỉ ra phản ví dụ khi tham lam sai.</p>
</div>

<div class="ml-en">
<h3>Worked example: Jump Game — ${lc(55, 'jump-game', 'Jump Game', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> You stand on index 0 of an array of non-negative integers; <code>nums[i]</code> is the <em>maximum</em> jump length from index i (you may jump shorter). Can you reach the last index? <code>[1, 3, 0, 0, 2, 0, 1]</code> → true; <code>[3, 2, 1, 0, 4]</code> → false (every path lands on the 0 at index 3).</p>
<p><strong>Step 1 — DP first, out loud.</strong> "Let <code>ok[i]</code> mean: from i I can reach the end. <code>ok[n−1]</code> is true; <code>ok[i]</code> is true if any j in (i, i + nums[i]] has <code>ok[j]</code>. Fill from the right." That is O(n²) time in the worst case, O(n) memory, and it is correct.</p>
<p><strong>Step 2 — find the waste.</strong> We never need to know <em>which</em> cells are reachable, only <em>how far</em> the reachable region extends. Reachable cells always form one block starting at 0: if you can reach index 7, you can reach 1…6 too (jump shorter). So one number describes everything: <code>far</code>, the farthest index reachable so far.</p>
<p><strong>Step 3 — one pass.</strong> Walk i from left to right. If <code>i &gt; far</code>, you are looking at a cell nobody can reach: answer false. Otherwise extend <code>far = max(far, i + nums[i])</code>; once <code>far ≥ n − 1</code>, answer true.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Jump Game — ${lc(55, 'jump-game', 'Jump Game', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn đứng ở chỉ số 0 của một mảng số nguyên không âm; <code>nums[i]</code> là độ dài bước nhảy <em>tối đa</em> từ ô i (được nhảy ngắn hơn). Có tới được ô cuối không? <code>[1, 3, 0, 0, 2, 0, 1]</code> → true; <code>[3, 2, 1, 0, 4]</code> → false (mọi đường đều rơi vào số 0 ở chỉ số 3).</p>
<p><strong>Bước 1 — nói bản DP trước.</strong> "Gọi <code>ok[i]</code> là: từ ô i em tới được ô cuối. <code>ok[n−1]</code> đúng; <code>ok[i]</code> đúng nếu có j trong (i, i + nums[i]] mà <code>ok[j]</code> đúng. Điền từ phải sang." Xấu nhất O(n²) thời gian, O(n) bộ nhớ, và đúng.</p>
<p><strong>Bước 2 — tìm chỗ phí.</strong> Ta không cần biết <em>ô nào</em> tới được, chỉ cần biết vùng tới được kéo dài <em>tới đâu</em>. Các ô tới được luôn tạo thành một khối liền bắt đầu từ 0: tới được ô 7 thì tới được cả 1…6 (cứ nhảy ngắn lại). Vậy một con số mô tả được tất cả: <code>far</code>, chỉ số xa nhất tới được cho đến lúc này.</p>
<p><strong>Bước 3 — một lượt.</strong> Đi i từ trái sang phải. Nếu <code>i &gt; far</code>, bạn đang nhìn một ô không ai tới được: trả false. Không thì nới <code>far = max(far, i + nums[i])</code>; khi <code>far ≥ n − 1</code>, trả true.</p>
</div>
${maHai('ch09/b5/tl-jump.ts', 'ch09/b5/TlJump.java', { vung: 'lc55' })}
${ma('ch09/b5/tl-jump.ts', { vung: 'dp', nhan: 'TypeScript — the O(n²) DP we started from' })}
${ketQua('ch09/b5/tl-jump.ts')}
${ketQua('ch09/b5/TlJump.java')}

<div class="ml-en">
<h3>Watch it run</h3>
<p>Two traces produced by running the algorithm. Blue = the cell we stand on; green = the block reachable so far; red = a cell beyond <code>far</code>. First the "true" case <code>[1, 3, 0, 0, 2, 0, 1]</code>:</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy</h3>
<p>Hai bảng vết sinh ra bằng cách chạy thuật toán thật. Xanh dương = ô đang đứng; xanh lá = khối tới được cho đến lúc này; đỏ = ô nằm ngoài <code>far</code>. Trước hết là ca "true" <code>[1, 3, 0, 0, 2, 0, 1]</code>:</p>
</div>
${BANG_J1}
<div class="ml-en">
<p>Five steps. The two zeros at indices 2 and 3 do not matter, because when we stand on them <code>far</code> is already 4 — someone else (index 1) has carried the frontier past them. Now the "false" case <code>[3, 2, 1, 0, 4]</code>:</p>
</div>
<div class="ml-vi">
<p>Năm bước. Hai số 0 ở chỉ số 2 và 3 không có ý nghĩa gì, vì khi đứng trên chúng <code>far</code> đã là 4 — ô khác (chỉ số 1) đã đẩy biên đi qua chúng rồi. Giờ là ca "false" <code>[3, 2, 1, 0, 4]</code>:</p>
</div>
${BANG_J2}
<div class="ml-en">
<p>Indices 0, 1, 2 all reach exactly 3 — the frontier is stuck on the 0. At i = 4 we have <code>i &gt; far</code>: nothing can land here, so nothing can continue. This is the "stays ahead" proof in action: <code>far</code> after processing 0…i is the maximum over every possible path, so if even that maximum is below i, no path reaches i.</p>
${moPhong('ch09/b5/tl-jump.sim.js', 'en', 'Jump Game — one number, the farthest reach', 'Opens /algorithms with this exact program: the green "reachable" row grows as far moves; change the array and run again.')}
</div>
<div class="ml-vi">
<p>Các chỉ số 0, 1, 2 đều tới đúng 3 — biên kẹt ở số 0. Tại i = 4 ta có <code>i &gt; far</code>: không gì đáp xuống được ô này, nên không gì đi tiếp được. Đây là chứng minh "luôn đi trước" chạy thật: <code>far</code> sau khi xử lý 0…i là giá trị lớn nhất trên mọi đường có thể, nên nếu cả giá trị lớn nhất đó còn nhỏ hơn i thì không đường nào tới được i.</p>
${moPhong('ch09/b5/tl-jump.sim.js', 'vi', 'Jump Game — một con số: chỗ xa nhất tới được', 'Mở trang /algorithms với đúng chương trình này: hàng "tới được" màu xanh dài ra khi far dịch chuyển; đổi mảng rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>Complexity, and why it beats the DP</h3>
<p>One pass, O(n) time, O(1) extra memory, against O(n²) / O(n) for the DP. The last line of the output is the stress test we just learned: 2,000 random arrays, greedy and DP agree on all of them. That is not a proof, but it is strong evidence, and it took ten lines.</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp, và vì sao nó thắng DP</h3>
<p>Một lượt, O(n) thời gian, O(1) bộ nhớ phụ, so với O(n²) / O(n) của DP. Dòng cuối của output chính là stress test vừa học: 2.000 mảng ngẫu nhiên, tham lam và DP khớp nhau toàn bộ. Đó không phải chứng minh, nhưng là bằng chứng mạnh, và chỉ tốn mười dòng.</p>
</div>

<div class="ml-en">
<h3>Variant 1 — Jump Game II: the fewest jumps — ${lc(45, 'jump-game-ii', 'Jump Game II', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> Same array, the end is guaranteed reachable; return the <em>minimum number of jumps</em>. <code>[2, 3, 1, 1, 4]</code> → 2 (0 → 1 → 4).</p>
<p><strong>Idea.</strong> This is BFS (breadth-first search, lesson <a href="${baiNay('dsa-7-2-bfs-dfs')}">7.2</a>) on a line, without a queue. Level 0 is index 0. Level 1 is every index reachable with one jump: a contiguous block [1, end]. While walking through a level we compute <code>far</code>, the farthest index the <em>next</em> level reaches. When i hits <code>end</code>, the current level is used up: we must jump once more, and the next level ends at <code>far</code>. Same "stays ahead" argument: after k jumps, <code>end</code> is the farthest anyone can be.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Jump Game II: ít lần nhảy nhất — ${lc(45, 'jump-game-ii', 'Jump Game II', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cùng mảng đó, đề đảm bảo tới được ô cuối; trả về <em>số lần nhảy ít nhất</em>. <code>[2, 3, 1, 1, 4]</code> → 2 (0 → 1 → 4).</p>
<p><strong>Ý tưởng.</strong> Đây là BFS (breadth-first search — duyệt theo chiều rộng, bài <a href="${baiNay('dsa-7-2-bfs-dfs')}">7.2</a>) trên một đường thẳng, không cần hàng đợi. Tầng 0 là chỉ số 0. Tầng 1 là mọi chỉ số tới được bằng một lần nhảy: một khối liền [1, end]. Trong lúc đi qua một tầng ta tính <code>far</code>, chỉ số xa nhất mà tầng <em>kế tiếp</em> với tới. Khi i chạm <code>end</code>, tầng hiện tại đã dùng hết: phải nhảy thêm một lần, và tầng kế tiếp kết thúc ở <code>far</code>. Cùng lập luận "luôn đi trước": sau k lần nhảy, <code>end</code> là chỗ xa nhất mà bất kỳ ai có thể đứng.</p>
</div>
${maHai('ch09/b5/tl-jump.ts', 'ch09/b5/TlJump.java', { vung: 'lc45' })}
${BANG_J3}
<div class="ml-en">
<p>Read the trace: at i = 0 the level {0} is used up, so we jump (jumps = 1) and the next level is [1, 2]. While walking 1 and 2, <code>far</code> grows to 4. At i = 2 that level is used up: jumps = 2, end = 4 = the last index. Four rows, two jumps. Notice the loop stops at i = n − 2 — the next box explains why that matters.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: Jump Game II with the loop <code>i &lt; n</code> counts one jump too many.</strong></p><p>Standing on the last index means you have arrived; no jump is needed. But if the loop runs up to i = n − 1, then when i reaches <code>end</code> at the last index the code still "jumps once more". Run for real (the <code>wrong loop</code> lines in the output above): <code>[2,3,1,1,4]</code> gives 3 instead of 2, and <code>[0]</code> — a one-element array that needs 0 jumps — gives 1. The one-element edge case is the one to test before you say "done".</p></div>
</div>
<div class="ml-vi">
<p>Đọc bảng: ở i = 0 tầng {0} đã dùng hết, nên ta nhảy (jumps = 1) và tầng kế là [1, 2]. Trong lúc đi qua 1 và 2, <code>far</code> tăng lên 4. Ở i = 2 tầng đó dùng hết: jumps = 2, end = 4 = ô cuối. Bốn dòng, hai lần nhảy. Để ý vòng lặp dừng ở i = n − 2 — hộp bên dưới giải thích vì sao điều đó quan trọng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: Jump Game II với vòng lặp <code>i &lt; n</code> đếm thừa một lần nhảy.</strong></p><p>Đứng ở ô cuối là đã tới nơi, không cần nhảy. Nhưng nếu vòng lặp đi tới tận i = n − 1 thì khi i chạm <code>end</code> ở ô cuối, code vẫn "nhảy thêm một lần". Chạy thật (các dòng <code>wrong loop</code> trong output phía trên): <code>[2,3,1,1,4]</code> ra 3 thay vì 2, và <code>[0]</code> — mảng một phần tử, vốn cần 0 lần nhảy — ra 1. Ca biên một phần tử là thứ phải tự test trước khi nói "xong".</p></div>
</div>
${ma('ch09/b5/tl-jump.ts', { vung: 'sai', nhan: 'TypeScript — wrong: the loop also visits the last index' })}

<div class="ml-en">
<h3>Variant 2 — Gas Station: a running balance on a circle — ${lc(134, 'gas-station', 'Gas Station', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> n stations on a circular road. At station i you can fill <code>gas[i]</code> litres; driving from i to i + 1 burns <code>cost[i]</code>. Starting with an empty tank, which station lets you drive the full loop? Return its index, or −1. The answer, if it exists, is unique.</p>
<p><strong>Brute force.</strong> Try every start and simulate the loop: O(n²). <strong>Greedy.</strong> Two facts make one pass enough:</p>
<ol>
<li>If the <em>total</em> gas is less than the total cost, no start works — the car simply does not have enough fuel for one lap. If the total is ≥ 0, some start works (the problem's guarantee, and provable).</li>
<li>If, starting from s, the tank first goes negative when leaving station i, then <em>no</em> start between s and i works either. Why: every station s′ in (s, i] was reached from s with a tank ≥ 0, so starting at s′ with an empty tank is never better than arriving there from s — and from s we already failed at i. So the next candidate is i + 1, and we skip everything in between.</li>
</ol>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Gas Station: số dư chạy trên một vòng tròn — ${lc(134, 'gas-station', 'Gas Station', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> n trạm xăng trên một con đường vòng. Ở trạm i đổ được <code>gas[i]</code> lít; đi từ i tới i + 1 tốn <code>cost[i]</code>. Xuất phát với bình rỗng, trạm nào cho phép đi trọn một vòng? Trả về chỉ số của nó, hoặc −1. Nếu có thì đáp án là duy nhất.</p>
<p><strong>Vét cạn.</strong> Thử mọi điểm xuất phát và mô phỏng cả vòng: O(n²). <strong>Tham lam.</strong> Hai sự thật làm cho một lượt là đủ:</p>
<ol>
<li>Nếu <em>tổng</em> xăng nhỏ hơn tổng chi phí thì không điểm xuất phát nào đi được — chiếc xe đơn giản là không đủ xăng cho một vòng. Nếu tổng ≥ 0 thì có một điểm xuất phát đi được (đề đảm bảo, và chứng minh được).</li>
<li>Nếu xuất phát từ s mà bình xăng âm lần đầu khi rời trạm i, thì <em>không</em> điểm nào giữa s và i đi được. Vì sao: mọi trạm s′ trong (s, i] đều được tới từ s với bình ≥ 0, nên xuất phát ở s′ với bình rỗng không bao giờ tốt hơn việc tới s′ từ s — mà từ s ta đã gãy ở i. Vậy ứng viên kế tiếp là i + 1, bỏ qua hết các trạm ở giữa.</li>
</ol>
</div>
${maHai('ch09/b5/tl-gas.ts', 'ch09/b5/TlGas.java', { vung: 'lc134' })}
${ketQua('ch09/b5/tl-gas.ts')}
<div class="ml-en">
<p>The trace for <code>gas = [5, 1, 2, 3, 4]</code>, <code>cost = [4, 4, 1, 5, 1]</code>. The row of numbers is <code>gain = gas − cost</code>; green = the stretch since the current start; red = the step where the tank goes negative.</p>
</div>
<div class="ml-vi">
<p>Bảng vết cho <code>gas = [5, 1, 2, 3, 4]</code>, <code>cost = [4, 4, 1, 5, 1]</code>. Hàng số là <code>gain = gas − cost</code> (lời/lỗ ở mỗi trạm); xanh lá = đoạn tính từ điểm xuất phát hiện tại; đỏ = bước bình xăng bị âm.</p>
</div>
${BANG_GAS}
<div class="ml-en">
<p>Starting at 0 we fail leaving station 1 (tank −2), so 0 and 1 are both ruled out. Starting at 2 we fail leaving 3 (tank −1), so 2 and 3 are ruled out. Only 4 is left; the total ends at 0 ≥ 0, so the answer is 4 — matching the brute force in the output. O(n) time, O(1) memory. The random line of the output compares the greedy with the O(n²) brute force on 3,000 random cases: 0 mismatches.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: forgetting the total.</strong></p><p>Drop the <code>total</code> variable and return "the last start" and the code still passes the first example. On <code>gas = [2, 3, 4]</code>, <code>cost = [3, 4, 3]</code> it returns 2, although the lap needs 10 litres and only 9 exist — the correct answer is −1. On the 3,000 random cases the forgot-total version is wrong 581 times. The local resets only tell you <em>where</em> to start; only the total tells you <em>whether</em> any start works.</p></div>
</div>
<div class="ml-vi">
<p>Xuất phát từ 0 ta gãy khi rời trạm 1 (bình −2), nên cả 0 và 1 bị loại. Xuất phát từ 2 ta gãy khi rời 3 (bình −1), nên 2 và 3 bị loại. Chỉ còn 4; tổng kết thúc ở 0 ≥ 0, nên đáp án là 4 — khớp với vét cạn trong output. O(n) thời gian, O(1) bộ nhớ. Dòng ngẫu nhiên của output so tham lam với vét cạn O(n²) trên 3.000 ca ngẫu nhiên: 0 chỗ lệch.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: quên kiểm tổng.</strong></p><p>Bỏ biến <code>total</code> và trả về "điểm xuất phát cuối cùng" thì code vẫn qua ví dụ đầu tiên. Với <code>gas = [2, 3, 4]</code>, <code>cost = [3, 4, 3]</code> nó trả 2, dù đi một vòng cần 10 lít mà chỉ có 9 — đáp án đúng là −1. Trên 3.000 ca ngẫu nhiên, bản quên tổng sai 581 lần. Các lần đặt lại tại chỗ chỉ cho bạn biết <em>xuất phát ở đâu</em>; chỉ có tổng mới cho biết <em>có</em> điểm xuất phát nào đi được hay không.</p></div>
</div>
${ma('ch09/b5/tl-gas.ts', { vung: 'sai', nhan: 'TypeScript — wrong: no total check' })}

<div class="ml-en">
<h3>Variant 3 — interval scheduling: book the most lab sessions — ${lc(435, 'non-overlapping-intervals', 'Non-overlapping Intervals', 'Medium')}</h3>
<p><strong>The real situation.</strong> One lab room at school, a list of booking requests [start, end). You want to accept as many as possible without any two overlapping (a booking that ends at 9:00 and one that starts at 9:00 do not overlap). LeetCode 435 asks the mirror question: how many requests must you <em>remove</em>? Same thing: n − (maximum you can keep). Example: <code>[[1,2],[2,3],[3,4],[1,3]]</code> → remove 1 (drop [1,3]).</p>
<p>Three rules sound reasonable: take the request that <em>starts</em> first, the <em>shortest</em> one, or the one that <em>ends</em> first. Only the last is correct. Exchange argument: let x be the request that ends first. Take any optimal schedule; its first request y ends no earlier than x. Replace y with x: x ends no later, so it does not collide with anything after y. The schedule is still valid and just as large — so some optimal schedule starts with x. Remove everything overlapping x and repeat on the rest.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 3 — xếp lịch khoảng: nhận nhiều buổi lab nhất — ${lc(435, 'non-overlapping-intervals', 'Non-overlapping Intervals', 'Medium')}</h3>
<p><strong>Tình huống thật.</strong> Trường có một phòng lab, một danh sách yêu cầu đặt phòng [bắt đầu, kết thúc). Bạn muốn nhận càng nhiều càng tốt mà không có hai yêu cầu nào chồng nhau (một buổi kết thúc lúc 9:00 và một buổi bắt đầu lúc 9:00 thì không chồng). LeetCode 435 hỏi câu ngược lại: phải <em>bỏ</em> ít nhất bao nhiêu yêu cầu? Cùng một bài: n − (số lớn nhất giữ được). Ví dụ: <code>[[1,2],[2,3],[3,4],[1,3]]</code> → bỏ 1 (bỏ [1,3]).</p>
<p>Ba luật nghe đều hợp lý: lấy yêu cầu <em>bắt đầu</em> sớm nhất, yêu cầu <em>ngắn</em> nhất, hoặc yêu cầu <em>kết thúc</em> sớm nhất. Chỉ luật cuối đúng. Lập luận đổi chỗ: gọi x là yêu cầu kết thúc sớm nhất. Lấy một lịch tối ưu bất kỳ; yêu cầu đầu tiên y của nó kết thúc không sớm hơn x. Thay y bằng x: x kết thúc không muộn hơn, nên không đụng bất cứ thứ gì sau y. Lịch vẫn hợp lệ và vẫn lớn như cũ — vậy có một lịch tối ưu bắt đầu bằng x. Bỏ mọi thứ chồng lên x rồi lặp lại với phần còn lại.</p>
</div>
${maHai('ch09/b5/tl-interval.ts', 'ch09/b5/TlInterval.java', { vung: 'lc435' })}
${ketQua('ch09/b5/tl-interval.ts')}
<div class="ml-en">
<p>The two counterexamples in the output are the ones to remember. <strong>Start first</strong> fails on <code>[[1,10],[2,3],[4,5],[6,7]]</code>: it grabs the all-day booking [1,10] and must refuse the three short ones (remove 3 instead of 1). <strong>Shortest first</strong> fails on <code>[[1,5],[4,7],[6,10]]</code>: the short [4,7] sits in the middle and blocks both neighbours (remove 2 instead of 1). Over 2,000 random cases against a brute force that tries every subset, "by end" is wrong 0 times, "by start" 323 times, "by length" 32 times. Note how rare the length bug is: you could practise a dozen problems without ever seeing it — which is exactly why a stress test beats a handful of examples.</p>
<p>Java detail: the comparator is <code>Integer.compare(p[1], q[1])</code>, not <code>p[1] - q[1]</code>, which overflows when ends can be near ±2³¹ (the same trap as in lesson 6.1's heaps). This chapter's interval problems with meeting rooms and merging live in lesson <a href="${baiNay('dsa-6-3-khoang')}">6.3</a>; this lesson only adds the greedy proof behind "sort by end".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: "right on three examples" does not mean right.</strong></p><p>All three sort rules give 1 on the problem's own example <code>[[1,2],[2,3],[3,4],[1,3]]</code>. Someone who only tries the given example submits "sort by start" and gets Wrong Answer on a hidden test — or worse, "shortest first" and passes almost every test. The cure is not "try a few more examples" but an argument (exchange) plus a stress test.</p></div>
</div>
<div class="ml-vi">
<p>Hai phản ví dụ trong output là thứ nên thuộc. <strong>Bắt đầu sớm nhất</strong> sai với <code>[[1,10],[2,3],[4,5],[6,7]]</code>: nó vồ lấy buổi đặt cả ngày [1,10] rồi phải từ chối ba buổi ngắn (bỏ 3 thay vì 1). <strong>Ngắn nhất</strong> sai với <code>[[1,5],[4,7],[6,10]]</code>: buổi ngắn [4,7] nằm ở giữa và chặn cả hai buổi hai bên (bỏ 2 thay vì 1). Trên 2.000 ca ngẫu nhiên so với vét cạn thử mọi tập con, "theo điểm kết thúc" sai 0 lần, "theo điểm bắt đầu" 323 lần, "theo độ dài" 32 lần. Để ý lỗi theo độ dài hiếm thế nào: bạn có thể luyện cả chục đề mà không gặp nó lần nào — đó chính là lý do stress test thắng vài ví dụ chọn tay.</p>
<p>Chi tiết Java: comparator là <code>Integer.compare(p[1], q[1])</code>, không phải <code>p[1] - q[1]</code> — phép trừ tràn số khi điểm kết thúc có thể gần ±2³¹ (cùng cái bẫy với heap ở bài 6.1). Các bài khoảng về phòng họp và gộp khoảng nằm ở bài <a href="${baiNay('dsa-6-3-khoang')}">6.3</a>; bài này chỉ bổ sung chứng minh tham lam đứng sau "sắp theo điểm kết thúc".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: "đúng trên ba ví dụ" không có nghĩa là đúng.</strong></p><p>Cả ba luật sắp xếp đều cho đáp án 1 với ví dụ của đề <code>[[1,2],[2,3],[3,4],[1,3]]</code>. Người chỉ thử ví dụ của đề sẽ nộp bản "sắp theo điểm bắt đầu" và nhận Wrong Answer ở test ẩn — hoặc tệ hơn, bản "ngắn nhất" và qua gần hết test. Cách chữa không phải là "thử thêm vài ví dụ", mà là một lập luận (đổi chỗ) cộng một stress test.</p></div>
</div>
${ma('ch09/b5/tl-interval.ts', { vung: 'sai', nhan: 'TypeScript — the same loop with a wrong sort key' })}

<div class="ml-en">
<h3>Where greedy lives in real systems — including this repository</h3>
<p><strong>The sprint planner of CT Work.</strong> This website has a project tracker (CT Work), and its AI sprint planner is a greedy algorithm. In <code>src/services/work/ai.service.ts</code>, function <code>planSprint</code> loads the backlog sorted by <code>rank</code> (the product owner's priority order), sets a target from the team's average velocity, and then does exactly this for each issue: <code>if (total + pts &gt; target) continue;</code> — too big for what is left, skip it; otherwise take it. That is a "first fit in priority order" greedy. It is <em>not</em> the answer to "maximise the points in the sprint" — that question is the 0/1 knapsack of lesson <a href="${baiNay('dsa-9-3-hai-chieu')}">9.3</a>. The toy version below (made-up backlog, no database) runs both:</p>
</div>
<div class="ml-vi">
<h3>Tham lam sống ở đâu trong hệ thống thật — kể cả chính repo này</h3>
<p><strong>Bộ lập sprint của CT Work.</strong> Trang web này có công cụ quản lý dự án (CT Work), và bộ lập sprint bằng AI của nó là một thuật toán tham lam. Trong <code>src/services/work/ai.service.ts</code>, hàm <code>planSprint</code> nạp backlog đã sắp theo <code>rank</code> (thứ tự ưu tiên của product owner), đặt mục tiêu bằng vận tốc (velocity) trung bình của nhóm, rồi với mỗi issue làm đúng một việc: <code>if (total + pts &gt; target) continue;</code> — quá lớn so với phần còn lại thì bỏ qua; vừa thì lấy. Đó là tham lam "vừa thì lấy theo thứ tự ưu tiên" (first fit). Nó <em>không</em> phải đáp án cho câu "nhồi được nhiều điểm nhất vào sprint" — câu đó là bài cái túi 0/1 của bài <a href="${baiNay('dsa-9-3-hai-chieu')}">9.3</a>. Bản đồ chơi bên dưới (backlog bịa, không chạm CSDL) chạy cả hai:</p>
</div>
${maHai('ch09/b5/tl-sprint.ts', 'ch09/b5/TlSprint.java', { vung: 'greedy' })}
${ketQua('ch09/b5/tl-sprint.ts')}
<div class="ml-en">
<p>Greedy by rank plans 19 of 20 points and leaves out CTW-2 (13 points, the <em>second</em> most important issue) because after CTW-1 it no longer fits — while CTW-6, the least important, gets in. The knapsack fills all 20 points — by dropping CTW-1, the <em>most</em> important issue. Which one is "right"? For a product, greedy by rank: the team must work on what matters most first, the plan is easy to explain ("we went down the list and took what fit"), and a one-point gap is irrelevant. The knapsack optimises a number nobody actually cares about. This is a useful thing to say in a system-design or behavioural question: <strong>the optimal algorithm for the wrong objective is the wrong algorithm.</strong> The real cost of the greedy choice is also visible: a big high-priority story can be skipped while small low-priority ones slip in — which is why <code>planSprint</code> returns warnings and a rationale for a human to review instead of committing the plan silently.</p>
<p><strong>Elsewhere.</strong> Huffman coding — one of the two halves of the Deflate format behind gzip (the other is LZ77) — is a greedy algorithm that repeatedly merges the two least frequent symbols; this site's <code>nginx/nginx.conf</code> has <code>gzip on</code>, so every page you read here was compressed by it. Dijkstra's shortest-path algorithm (lesson <a href="${baiNay('dsa-7-4-dijkstra')}">7.4</a>) is greedy too: it permanently settles the closest unsettled node, and it is correct only because edge weights are non-negative — add a negative edge and the greedy choice becomes unsafe, exactly like the [1, 3, 4] coins.</p>
</div>
<div class="ml-vi">
<p>Tham lam theo rank lập được 19/20 điểm và bỏ CTW-2 (13 điểm, issue quan trọng <em>thứ hai</em>) vì sau CTW-1 nó không còn vừa — trong khi CTW-6, việc ít quan trọng nhất, lại được vào. Cái túi lấp đủ 20 điểm — bằng cách bỏ CTW-1, issue quan trọng <em>nhất</em>. Cái nào "đúng"? Với một sản phẩm thì tham lam theo rank: nhóm phải làm việc quan trọng nhất trước, kế hoạch dễ giải thích ("đi dọc danh sách, cái nào vừa thì lấy"), còn hụt một điểm thì chẳng ai bận tâm. Cái túi tối ưu một con số mà thực ra không ai quan tâm. Đây là một câu đáng nói khi gặp câu hỏi thiết kế hệ thống hay câu hỏi hành vi: <strong>thuật toán tối ưu cho mục tiêu sai là thuật toán sai.</strong> Cái giá thật của lựa chọn tham lam cũng hiện rõ: một story lớn ưu tiên cao có thể bị bỏ qua trong khi những việc nhỏ ưu tiên thấp chen vào — đó là lý do <code>planSprint</code> trả về các cảnh báo (warnings) và lời giải thích (rationale) để con người xem lại, chứ không lặng lẽ chốt kế hoạch.</p>
<p><strong>Ở những chỗ khác.</strong> Mã Huffman — một trong hai nửa của định dạng Deflate đứng sau gzip (nửa kia là LZ77) — là một thuật toán tham lam liên tục gộp hai ký hiệu ít xuất hiện nhất; tệp <code>nginx/nginx.conf</code> của trang này có <code>gzip on</code>, nên mỗi trang bạn đang đọc ở đây đều được nó nén. Thuật toán đường đi ngắn nhất Dijkstra (bài <a href="${baiNay('dsa-7-4-dijkstra')}">7.4</a>) cũng là tham lam: nó chốt vĩnh viễn đỉnh gần nhất chưa chốt, và chỉ đúng vì trọng số cạnh không âm — thêm một cạnh âm là lựa chọn tham lam mất an toàn, y như bộ xu [1, 3, 4].</p>
${csd('csd201-cs5-on', 'vi', 'CS.5 Bài tập tham lam và chia để trị', '<p>Bộ bài tập CS.5 có 7 đề tham lam kiểu phỏng vấn (bỏ ít khoảng nhất, xăng, nhảy…). Làm nó sau bài này: với MỖI đề, viết thêm một stress test 10 dòng so với vét cạn trước khi tin lời giải tham lam của mình.</p>')}
</div>

<div class="ml-en">
<h3>Complexity at a glance</h3>
<ul>
<li>Jump Game, Jump Game II, Gas Station: one pass, O(n) time, O(1) memory.</li>
<li>Interval scheduling: O(n log n) for the sort + O(n) for the pass; O(n) memory for a sorted copy (or O(log n) if you sort in place).</li>
<li>Greedy change-making: O(number of denominations) — but only valid on canonical systems; the DP is O(amount × coins).</li>
<li>The stress tests: brute force on tiny inputs (2⁸ subsets, 7-station loops) — slow per case, but thousands of cases finish in well under a second.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Độ phức tạp nhìn một lượt</h3>
<ul>
<li>Jump Game, Jump Game II, Gas Station: một lượt, O(n) thời gian, O(1) bộ nhớ.</li>
<li>Xếp lịch khoảng: O(n log n) cho sắp xếp + O(n) cho lượt quét; O(n) bộ nhớ cho bản sao đã sắp (hoặc O(log n) nếu sắp tại chỗ).</li>
<li>Thối tiền tham lam: O(số mệnh giá) — nhưng chỉ đúng với hệ chính tắc; bản DP là O(số tiền × số mệnh giá).</li>
<li>Các stress test: vét cạn trên input rất nhỏ (2⁸ tập con, vòng 7 trạm) — mỗi ca chậm, nhưng hàng nghìn ca vẫn xong trong chưa tới một giây.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Each element is your maximum jump from that position. Starting at index 0, can you reach the last index?'],
  ['C', 'Can values be zero, and is the array ever empty? And do I only need true or false, not the path?'],
  ['N', 'Zeros are where the problem lives; "true/false only" tells you no path reconstruction is needed.'],
  ['I', 'Zeros yes, at least one element, just true or false.'],
  ['C', 'A safe first version is DP: ok[i] means I can reach the end from i, filled from the right, checking up to nums[i] cells — O(n²) worst case. But I notice the reachable cells always form one block from 0, because I can jump shorter. So I only need the farthest reachable index. One pass, O(n) time, O(1) space.'],
  ['N', 'DP first shows you can always fall back; the observation "reachable = one block" is what makes greedy legal. Say it explicitly.'],
  ['I', 'Why is that enough? Convince me.'],
  ['C', 'After processing indices 0 to i, far is the maximum of j + nums[j] over every reachable j — no path can be further than that. So if I ever stand on i greater than far, nothing can land there and the answer is false; otherwise far keeps growing until it covers the end.'],
  ['N', 'That is "greedy stays ahead" in two sentences. No formal proof needed.'],
  ['C', '(after coding) Testing [0]: far is 0, which already covers the last index, so true. And [3,2,1,0,4]: far gets stuck at 3, at i = 4 I return false.'],
  ['I', 'Follow-up: the end is reachable — what is the minimum number of jumps?'],
  ['C', 'That is BFS by levels on a line. I track the end of the current level and the farthest reach of the next one; when i hits the end of the level, I add a jump. I stop the loop at n − 2, because standing on the last index needs no jump.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Bản tiếng Anh nằm ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Mỗi phần tử là bước nhảy tối đa từ vị trí đó. Bắt đầu ở chỉ số 0, có tới được chỉ số cuối không?'],
  ['C', 'Giá trị có thể bằng 0 không ạ, và mảng có khi nào rỗng không? Em chỉ cần trả true/false, không cần đường đi đúng không? <em>("Do I only need true or false, not the path?")</em>'],
  ['N', 'Số 0 là chỗ cái khó nằm; "chỉ true/false" cho biết không cần dựng lại đường đi.'],
  ['I', 'Có số 0, ít nhất một phần tử, chỉ cần true/false.'],
  ['C', 'Bản an toàn đầu tiên là DP: ok[i] nghĩa là từ i tới được cuối, điền từ phải sang, xét tối đa nums[i] ô — xấu nhất O(n²). Nhưng em để ý các ô tới được luôn là một khối liền từ 0, vì em được nhảy ngắn hơn. Vậy em chỉ cần chỉ số xa nhất tới được. Một lượt, O(n) thời gian, O(1) bộ nhớ. <em>("I only need the farthest reachable index.")</em>'],
  ['N', 'Nói DP trước cho thấy bạn luôn có đường lui; quan sát "tới được = một khối liền" là thứ làm cho tham lam hợp lệ. Hãy nói nó ra thành lời.'],
  ['I', 'Vì sao như thế là đủ? Thuyết phục tôi đi.'],
  ['C', 'Sau khi xử lý các chỉ số 0 tới i, far là giá trị lớn nhất của j + nums[j] trên mọi j tới được — không đường nào đi xa hơn thế. Nên nếu em đứng ở i lớn hơn far thì không gì đáp xuống đó được, trả false; còn không thì far cứ tăng tới khi phủ được ô cuối. <em>("Greedy stays ahead.")</em>'],
  ['N', 'Đó là lập luận "tham lam luôn đi trước" trong hai câu. Không cần chứng minh hình thức.'],
  ['C', '(sau khi code) Em test [0]: far bằng 0, đã phủ ô cuối nên true. Và [3,2,1,0,4]: far kẹt ở 3, tới i = 4 em trả false.'],
  ['I', 'Câu nối tiếp: chắc chắn tới được cuối — số lần nhảy ít nhất là bao nhiêu?'],
  ['C', 'Đó là BFS theo tầng trên một đường thẳng. Em giữ biên của tầng hiện tại và chỗ xa nhất của tầng kế; khi i chạm biên tầng thì cộng một lần nhảy. Em dừng vòng lặp ở n − 2, vì đứng ở ô cuối thì không cần nhảy nữa.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Trusting a greedy rule because it passes the given examples — every wrong rule in this lesson passes them.</li>
<li>Using greedy for coin change or 0/1 knapsack with arbitrary values; the counterexample is [1, 3, 4] with 6.</li>
<li>Sorting intervals by start (or by length) for "keep the most"; the right key is the end.</li>
<li>Gas Station without the total check, or Jump Game II looping to n − 1 and counting an extra jump.</li>
<li>Java comparators written as <code>a[1] - b[1]</code>: overflow on large values; use <code>Integer.compare</code>.</li>
<li>Saying "greedy works" without one sentence of why — interviewers will ask.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Tin một luật tham lam vì nó qua ví dụ của đề — mọi luật sai trong bài này đều qua chúng.</li>
<li>Dùng tham lam cho đổi tiền hay cái túi 0/1 với giá trị tuỳ ý; phản ví dụ là [1, 3, 4] với 6.</li>
<li>Sắp khoảng theo điểm bắt đầu (hay theo độ dài) cho câu "giữ được nhiều nhất"; khoá đúng là điểm kết thúc.</li>
<li>Gas Station không kiểm tổng, hoặc Jump Game II lặp tới n − 1 rồi đếm thừa một lần nhảy.</li>
<li>Comparator Java viết <code>a[1] - b[1]</code>: tràn số với giá trị lớn; dùng <code>Integer.compare</code>.</li>
<li>Nói "tham lam chạy được" mà không có một câu giải thích vì sao — người phỏng vấn sẽ hỏi.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Bộ luyện 9.6 có thêm một đề tham lam (Partition Labels) với lời giải từng bước.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write Jump Game (greedy) and run it on <code>[2,3,1,1,4]</code>, <code>[3,2,1,0,4]</code>, <code>[0]</code>.</li>
<li>Write a stress test for it: 1,000 random arrays of length 1–8 with values 0–3, compared with the O(n²) DP. It must print 0 mismatches.</li>
<li>Change the sort key of Non-overlapping Intervals to "by start" and make your stress test find a counterexample. Write it down in your notebook.</li>
<li>Submit LC 55, LC 134 and LC 435. For each, write one line: <em>greedy rule → proof type → complexity</em>.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, a stress test that prints 0 mismatches for the right rule and a counterexample for the wrong one, and three notebook lines.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">greedy algorithm</span><span class="v">Commit to the locally best option at each step, never undo it.</span></div>
  <div class="kv"><span class="k">greedy-choice property</span><span class="v">Some optimal answer agrees with the greedy first choice.</span></div>
  <div class="kv"><span class="k">optimal substructure</span><span class="v">An optimal answer is built from optimal answers to smaller copies of the problem.</span></div>
  <div class="kv"><span class="k">exchange argument</span><span class="v">Swap an optimal answer's choice for the greedy one without making it worse.</span></div>
  <div class="kv"><span class="k">greedy stays ahead</span><span class="v">After every step, greedy is at least as far along as any other solution.</span></div>
  <div class="kv"><span class="k">canonical coin system</span><span class="v">Denominations on which greedy change-making is always optimal.</span></div>
  <div class="kv"><span class="k">stress test</span><span class="v">Random small inputs, fast solution vs brute force, stop at the first mismatch.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Greedy commits to one choice per step; DP tries them all. Greedy needs a reason, not just examples.</li>
<li>Coin change: greedy is right for real currencies (canonical), wrong for [1, 3, 4] at 6 — so LeetCode 322 is DP.</li>
<li>Jump Game I/II: one number (farthest reach, level end) replaces a whole DP table.</li>
<li>Gas Station: reset the start when the tank dips; the total decides whether any start works.</li>
<li>Interval scheduling: sort by end; by start or by length is wrong, and a stress test proves it in seconds.</li>
<li>In real products, "optimal" depends on the objective: CT Work's planner is greedy by rank on purpose.</li>
</ul>
${nguon('📘', 'Greedy algorithm — Wikipedia', 'Greedy-choice property, matroids, and classic examples where greedy fails', 'https://en.wikipedia.org/wiki/Greedy_algorithm')}
${nguon('🪙', 'Change-making problem — Wikipedia', 'Canonical coin systems and why greedy change works for real currencies', 'https://en.wikipedia.org/wiki/Change-making_problem')}
${nguon('📗', 'NeetCode roadmap — Greedy', 'The standard greedy problem list with video solutions', 'https://neetcode.io/roadmap')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết Jump Game (bản tham lam) rồi chạy với <code>[2,3,1,1,4]</code>, <code>[3,2,1,0,4]</code>, <code>[0]</code>.</li>
<li>Viết stress test cho nó: 1.000 mảng ngẫu nhiên dài 1–8, giá trị 0–3, so với bản DP O(n²). Nó phải in 0 chỗ lệch.</li>
<li>Đổi khoá sắp xếp của Non-overlapping Intervals thành "theo điểm bắt đầu" và để stress test của bạn tìm ra một phản ví dụ. Chép phản ví dụ đó vào sổ.</li>
<li>Nộp LC 55, LC 134 và LC 435. Mỗi đề ghi một dòng: <em>luật tham lam → kiểu chứng minh → độ phức tạp</em>.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, một stress test in 0 chỗ lệch với luật đúng và in ra phản ví dụ với luật sai, và ba dòng trong sổ.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">greedy algorithm (thuật toán tham lam)</span><span class="v">Mỗi bước cam kết với phương án tốt nhất tại chỗ, không bao giờ huỷ.</span></div>
  <div class="kv"><span class="k">greedy-choice property (tính chất lựa chọn tham lam)</span><span class="v">Có một đáp án tối ưu trùng với lựa chọn đầu tiên của tham lam.</span></div>
  <div class="kv"><span class="k">optimal substructure (cấu trúc con tối ưu)</span><span class="v">Đáp án tối ưu được dựng từ đáp án tối ưu của các bản nhỏ hơn của cùng bài.</span></div>
  <div class="kv"><span class="k">exchange argument (lập luận đổi chỗ)</span><span class="v">Đổi một lựa chọn của đáp án tối ưu thành lựa chọn tham lam mà không làm nó tệ đi.</span></div>
  <div class="kv"><span class="k">greedy stays ahead (tham lam luôn đi trước)</span><span class="v">Sau mỗi bước, tham lam đi được ít nhất xa bằng mọi lời giải khác.</span></div>
  <div class="kv"><span class="k">canonical coin system (hệ mệnh giá chính tắc)</span><span class="v">Bộ mệnh giá mà thối tiền tham lam luôn tối ưu (tiền thật được thiết kế như vậy).</span></div>
  <div class="kv"><span class="k">stress test (đối chiếu ngẫu nhiên)</span><span class="v">Input nhỏ ngẫu nhiên, so lời giải nhanh với vét cạn, dừng ở chỗ lệch đầu tiên.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Tham lam cam kết một lựa chọn mỗi bước; DP thử hết. Tham lam cần một lý do, không chỉ cần vài ví dụ.</li>
<li>Đổi tiền: tham lam đúng với tiền thật (hệ chính tắc), sai với [1, 3, 4] ở số 6 — nên LeetCode 322 là DP.</li>
<li>Jump Game I/II: một con số (chỗ xa nhất, biên tầng) thay được cả một bảng DP.</li>
<li>Gas Station: đặt lại điểm xuất phát khi bình xăng âm; tổng quyết định có điểm xuất phát nào đi được hay không.</li>
<li>Xếp lịch khoảng: sắp theo điểm kết thúc; theo điểm bắt đầu hay theo độ dài đều sai, và stress test chứng minh điều đó trong vài giây.</li>
<li>Trong sản phẩm thật, "tối ưu" tuỳ vào mục tiêu: bộ lập sprint của CT Work cố ý tham lam theo rank.</li>
</ul>
${nguon('📘', 'Greedy algorithm — Wikipedia', 'Tính chất lựa chọn tham lam, matroid, và các ví dụ kinh điển nơi tham lam sai (tiếng Anh)', 'https://en.wikipedia.org/wiki/Greedy_algorithm')}
${nguon('🪙', 'Change-making problem — Wikipedia', 'Hệ mệnh giá chính tắc và vì sao thối tiền tham lam đúng với tiền thật (tiếng Anh)', 'https://en.wikipedia.org/wiki/Change-making_problem')}
${nguon('📗', 'NeetCode roadmap — Greedy', 'Danh sách đề tham lam chuẩn, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
</div>
`,
};
