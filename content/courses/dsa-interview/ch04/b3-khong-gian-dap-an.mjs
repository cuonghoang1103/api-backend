/** 4.3 — Tìm nhị phân trên không gian đáp án. Mã/output đọc từ ../ma/ch04 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetFirstTrue } from '../ma/ch04/nhi-phan.vet.mjs';

const PILES = [4, 11, 20, 23, 30];
const H = 8;
const gio = (k) => PILES.reduce((s, p) => s + Math.ceil(p / k), 0);
const VET = vetFirstTrue(1, 30, (k) => gio(k) <= H, (k) => String(gio(k)));
const HANG_FT = Array.from({ length: 30 }, (_, i) => (gio(i + 1) <= H ? 'T' : 'F'));
const ROW = oMang(HANG_FT, { to: Object.fromEntries(HANG_FT.map((v, i) => [i, v === 'T' ? (i === VET.ketQua - 1 ? 'ok' : 'cs') : 'mo'])), nhan: { 0: 'k=1', [VET.ketQua - 1]: `k=${VET.ketQua}`, 29: 'k=30' } });
const BANG_KOKO = bangVet(['round', 'lo', 'hi', 'mid (= speed k)', 'hours(mid)', 'ok = hours ≤ 8', 'next [lo, hi)'],
  [...VET.hang.map((h) => [String(h.vong), String(h.lo), String(h.hi), `<strong>${h.mid}</strong>`, h.gt, h.t ? 'T ⇒ hi = mid' : 'F ⇒ lo = mid + 1', `[${h.loMoi}, ${h.hiMoi})`]),
    ['end', String(VET.ketQua), String(VET.ketQua), '', String(gio(VET.ketQua)), 'lo == hi', `⇒ k = ${VET.ketQua}`]]);

const DE = [
  [lc(875, 'koko-eating-bananas', 'Koko Eating Bananas', 'Medium'), 'The worked example: minimum speed; check = Σ ceil(p / k) ≤ h.', 'Đề giải mẫu: tốc độ nhỏ nhất; check = Σ ceil(p / k) ≤ h.'],
  [lc(1011, 'capacity-to-ship-packages-within-d-days', 'Capacity To Ship Packages Within D Days', 'Medium'), 'Minimum capacity; greedy day count; lo = max weight, hi = total.', 'Sức chứa nhỏ nhất; đếm ngày tham lam; lo = kiện nặng nhất, hi = tổng.'],
  [lc(1482, 'minimum-number-of-days-to-make-m-bouquets', 'Minimum Number of Days to Make m Bouquets', 'Medium'), 'Search over days; count runs of k bloomed flowers; −1 if m·k &gt; n (long!).', 'Tìm trên ngày; đếm đoạn k hoa liền đã nở; −1 nếu m·k &gt; n (dùng long!).'],
  [lc(410, 'split-array-largest-sum', 'Split Array Largest Sum', 'Hard'), '"Minimise the largest piece" — the same code as LC 1011.', '"Làm nhỏ nhất mảnh lớn nhất" — cùng code với LC 1011.'],
  [lc(1283, 'find-the-smallest-divisor-given-a-threshold', 'Find the Smallest Divisor Given a Threshold', 'Medium'), 'Koko with another story: Σ ceil(a / d) ≤ threshold.', 'Koko với câu chuyện khác: Σ ceil(a / d) ≤ threshold.'],
  [lc(2187, 'minimum-time-to-complete-trips', 'Minimum Time to Complete Trips', 'Medium'), 'Search over time; Σ t / time[i] ≥ total; hi can be 10¹⁴ ⇒ long everywhere.', 'Tìm trên thời gian; Σ t / time[i] ≥ total; hi tới 10¹⁴ ⇒ long ở mọi chỗ.'],
  [lc(1552, 'magnetic-force-between-two-balls', 'Magnetic Force Between Two Balls', 'Medium'), '"Maximise the minimum" ⇒ the LAST T = firstTrue(not ok) − 1.', '"Làm lớn nhất khoảng cách nhỏ nhất" ⇒ T CUỐI = firstTrue(không ok) − 1.'],
  [lc(2064, 'minimized-maximum-of-products-distributed-to-any-store', 'Minimized Maximum of Products Distributed to Any Store', 'Medium'), 'Minimise the max per store: Σ ceil(q / x) ≤ n.', 'Làm nhỏ nhất lượng tối đa mỗi cửa hàng: Σ ceil(q / x) ≤ n.'],
  [lc(774, 'minimize-max-distance-to-gas-station', 'Minimize Max Distance to Gas Station', 'Hard', { premium: true }), 'Answer is a real number: loop a fixed 60–100 times. Free alternative: LintCode 848.', 'Đáp án là số thực: lặp cố định 60–100 lần. Bản miễn phí: LintCode 848.'],
];

export default {
  title: '4.3 — Binary search on the answer: minimum speed, capacity and days|||4.3 — Tìm nhị phân trên không gian đáp án: tốc độ, sức chứa, số ngày nhỏ nhất',
  slug: 'dsa-4-3-khong-gian-dap-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Khi đề hỏi "x nhỏ nhất sao cho…": tìm nhị phân trên chính đáp án với một hàm check tham lam O(n) — Koko (LC 875), chở hàng D ngày (LC 1011), bó hoa (LC 1482), chia mảng (LC 410), bẫy tràn int khi cộng giờ, và dò ngưỡng thật: batch size lớn nhất không hết bộ nhớ bằng tìm phi mã.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Binary search on the answer: minimum speed, capacity and days</h2>
<p class="lead">This is the binary search that turns "Medium" and "Hard" problems into twenty lines of code, and the one interviewers like most, because nothing in the problem says "search". There is no sorted array. There is a question like "what is the <em>minimum</em> speed / capacity / number of days such that something is possible?" — and the trick is to stop looking for a clever formula and instead <strong>binary search over the possible answers</strong>, asking a simple yes/no question for each: "is this answer good enough?". You will learn a four-step recipe, apply it to four classic problems with the unchanged template, hit a Java overflow that only lies at one value, and then use the same idea the way engineers do: finding the largest batch size that does not run out of GPU memory when each try costs minutes and you do not even know an upper bound.</p>

<h3>The everyday picture</h3>
<p>Two weeks before the final exams you have five subjects with 4, 11, 20, 23 and 30 pages of notes left, and 8 evenings. Each evening you study one subject only, and you can read at most k pages per evening (if a subject has fewer pages left, you finish it early and rest). What is the <strong>smallest</strong> k that gets everything done? You could solve equations, but there is an easier way: <em>guess</em> k and check. With k = 10 you need 1 + 2 + 2 + 3 + 3 = 11 evenings — too slow. With k = 20 you need 1 + 1 + 1 + 2 + 2 = 7 — enough. And here is the key fact: if k pages an evening is enough, then k + 1 is certainly enough too. So the answers to "is k enough?" for k = 1, 2, 3, … look like F F … F T T … T. You know what to do with that row.</p>
<p>Formally: <strong>binary search on the answer</strong> (also "search on the answer space", "parametric search") applies when (1) the answer is a number in a known range, (2) you can write <code>check(x)</code> = "is x feasible?" that runs fast (usually O(n), often greedy), and (3) <code>check</code> is <strong>monotone</strong> — feasible stays feasible as x grows. Then the minimum feasible x is <code>firstTrue(lo, hi, check)</code>, and the total cost is O(n · log(range)).</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Tìm nhị phân trên không gian đáp án: tốc độ, sức chứa, số ngày nhỏ nhất</h2>
<p class="lead">Đây là kiểu tìm nhị phân biến các đề "Medium" và "Hard" thành hai mươi dòng code, và là kiểu người phỏng vấn thích nhất, vì trong đề không có chữ nào nói "tìm kiếm". Không có mảng đã sắp. Chỉ có một câu hỏi như "tốc độ / sức chứa / số ngày <em>nhỏ nhất</em> là bao nhiêu để làm được việc gì đó?" — và mẹo là thôi đi tìm một công thức thông minh, thay vào đó <strong>tìm nhị phân trên các đáp án có thể</strong>, hỏi một câu có/không đơn giản cho từng đáp án: "đáp án này đã đủ chưa?". Bạn sẽ học một công thức bốn bước, áp nó vào bốn đề kinh điển với đúng khuôn cũ, vấp một lỗi tràn số Java chỉ "nói dối" ở đúng một giá trị, rồi dùng cùng ý tưởng theo cách kỹ sư làm: tìm batch size lớn nhất không hết bộ nhớ GPU khi mỗi lần thử tốn vài phút và bạn còn không biết cận trên.</p>

<h3>Hình dung đời thường</h3>
<p>Hai tuần trước kỳ thi cuối kỳ, bạn còn năm môn với 4, 11, 20, 23 và 30 trang ghi chép chưa ôn, và 8 buổi tối. Mỗi tối bạn chỉ ôn một môn, và đọc tối đa k trang mỗi tối (môn nào còn ít trang hơn thì đọc xong sớm rồi nghỉ). k <strong>nhỏ nhất</strong> là bao nhiêu để ôn xong hết? Bạn có thể giải phương trình, nhưng có cách dễ hơn: <em>đoán</em> k rồi kiểm. Với k = 10 bạn cần 1 + 2 + 2 + 3 + 3 = 11 tối — quá chậm. Với k = 20 bạn cần 1 + 1 + 1 + 2 + 2 = 7 — đủ. Và đây là sự thật then chốt: nếu đọc k trang một tối là đủ thì k + 1 trang chắc chắn cũng đủ. Vậy các câu trả lời cho "k đã đủ chưa?" với k = 1, 2, 3, … có dạng F F … F T T … T. Bạn biết phải làm gì với hàng đó rồi.</p>
<p>Nói cho chuẩn: <strong>tìm nhị phân trên đáp án</strong> (binary search on the answer, còn gọi "tìm trên không gian đáp án", "parametric search" — tìm theo tham số) dùng được khi (1) đáp án là một con số trong một khoảng biết trước, (2) bạn viết được <code>check(x)</code> = "x có khả thi không?" chạy nhanh (thường O(n), hay là tham lam — greedy), và (3) <code>check</code> <strong>đơn điệu</strong> — đã khả thi thì x lớn hơn vẫn khả thi. Khi đó x khả thi nhỏ nhất là <code>firstTrue(lo, hi, check)</code>, và tổng chi phí là O(n · log(độ rộng khoảng)).</p>
${csd('csd201-slide-cs1-2', 'vi', '⭐ CS.1 — Tìm kiếm nhị phân (2): slide 15–19 tìm trên đáp án', '<p>Slide 15–19 đã giới thiệu "tìm trên đáp án" qua căn bậc hai nguyên, chở hàng D ngày, Koko và chia mảng, viết bằng Java không tràn số. <strong>Ở đây đi sâu thêm:</strong> công thức bốn bước để NHẬN RA dạng bài từ cách đề viết, chứng minh tính đơn điệu bằng một câu (thứ người phỏng vấn hỏi), cả bản TypeScript, một lỗi tràn int chỉ lộ ở đúng một giá trị, và dò ngưỡng thật khi không biết cận trên (tìm phi mã).</p>')}
</div>

<div class="ml-en">
<h3>Signals: the wording that gives it away</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"minimum speed / capacity / time / days such that…"</span><span class="v">Minimum feasible x, and bigger x is "easier": first T of check(x).</span></div>
  <div class="kv"><span class="k">"minimise the maximum" (largest sum, largest load, largest distance)</span><span class="v">Guess the maximum L; check "can I do it with every part ≤ L?" greedily.</span></div>
  <div class="kv"><span class="k">"maximise the minimum" (smallest gap, smallest sweetness)</span><span class="v">Now feasibility goes T…T F…F: the answer is the LAST T = firstTrue(not check) − 1.</span></div>
  <div class="kv"><span class="k">values up to 10⁹, n up to 10⁵</span><span class="v">You cannot try every value (10⁹ · 10⁵), but log₂ 10⁹ ≈ 30 checks of O(n) = 3·10⁶ steps. That ratio is the hint.</span></div>
  <div class="kv"><span class="k">checking an answer is easy, computing it is hard</span><span class="v">The universal signal. "Given k, can she finish?" is one loop; "find k" is not.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: cách đề viết đã tố cáo nó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"tốc độ / sức chứa / thời gian / số ngày nhỏ nhất sao cho…"</span><span class="v">x khả thi nhỏ nhất, và x càng lớn càng "dễ": T đầu tiên của check(x).</span></div>
  <div class="kv"><span class="k">"làm nhỏ nhất giá trị lớn nhất" (minimise the maximum — tổng lớn nhất, tải lớn nhất…)</span><span class="v">Đoán giá trị lớn nhất L; kiểm tham lam "chia được sao cho mọi phần ≤ L không?".</span></div>
  <div class="kv"><span class="k">"làm lớn nhất giá trị nhỏ nhất" (maximise the minimum — khoảng cách nhỏ nhất…)</span><span class="v">Lúc này khả thi có dạng T…T F…F: đáp án là T CUỐI CÙNG = firstTrue(không check) − 1.</span></div>
  <div class="kv"><span class="k">giá trị tới 10⁹, n tới 10⁵</span><span class="v">Không thử hết được (10⁹ · 10⁵), nhưng log₂ 10⁹ ≈ 30 lần check O(n) = 3·10⁶ bước. Chính tỉ lệ này là gợi ý.</span></div>
  <div class="kv"><span class="k">kiểm một đáp án thì dễ, tính ra đáp án thì khó</span><span class="v">Dấu hiệu vạn năng. "Cho k, có ăn kịp không?" là một vòng lặp; "tìm k" thì không.</span></div>
</div>
</div>

<div class="ml-en">
<h3>The recipe: four steps, the same template</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Name the answer</span><span class="lz-d">"The answer is a speed k (an integer)." Write it down; half of the confusion in these problems is not knowing what x is.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Write check(x), usually greedy O(n)</span><span class="lz-d">"Given k, how many hours does she need? Is it ≤ h?" No search inside — just simulate.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Prove monotone in one sentence</span><span class="lz-d">"Eating faster never takes more hours, so if k works, k + 1 works." If you cannot say this sentence, binary search is wrong here.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bounds, then firstTrue</span><span class="lz-d">lo = smallest value that could work, hi = a value that surely works (or one past). Return firstTrue(lo, hi, check).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Công thức: bốn bước, cùng một khuôn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Gọi tên đáp án</span><span class="lz-d">"Đáp án là một tốc độ k (số nguyên)." Viết ra giấy; một nửa sự bối rối ở dạng này là không biết x là gì.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Viết check(x), thường tham lam O(n)</span><span class="lz-d">"Cho k, cần bao nhiêu giờ? Có ≤ h không?" Không tìm gì bên trong — chỉ mô phỏng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chứng minh đơn điệu trong một câu</span><span class="lz-d">"Ăn nhanh hơn không bao giờ tốn nhiều giờ hơn, nên k được thì k + 1 được." Không nói được câu này thì nhị phân sai chỗ.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chọn cận, rồi firstTrue</span><span class="lz-d">lo = giá trị nhỏ nhất có thể được, hi = một giá trị chắc chắn được (hoặc ngay sau nó). Trả về firstTrue(lo, hi, check).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Koko Eating Bananas (LC 875)</h3>
<p><strong>Problem (in our words).</strong> There are n piles of bananas and h hours (h ≥ n). Each hour Koko picks one pile and eats up to k bananas from it; if the pile has fewer, she finishes it and waits for the next hour. Return the minimum integer k that lets her finish all piles within h hours. Our example is the study-plan story: piles <code>[4, 11, 20, 23, 30]</code>, h = 8 → 15.</p>
<p><strong>Brute force.</strong> Try k = 1, 2, 3, … and return the first that works. Each try costs O(n); the answer can be as large as max(piles) = 10⁹, so O(n · max) = 10⁴ · 10⁹ — hopeless. Say it, with the number, and say what you will keep: the check is fine, the <em>order of tries</em> is the waste.</p>
<p><strong>The four steps.</strong> (1) The answer is a speed k. (2) <code>hoursAt(k) = Σ ceil(p / k)</code> — each pile takes ceil(p / k) hours; check is <code>hoursAt(k) ≤ h</code>. (3) Bigger k never makes any ceil(p / k) bigger, so the total never grows: monotone. (4) k = 1 is the slowest possible; k = max(piles) always works (every pile in one hour, and h ≥ n). Answer = <code>firstTrue(1, max, check)</code> — here hi = max is itself a known T, so we do not need the "one past" slot.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Koko Eating Bananas (LC 875)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Có n đống chuối và h giờ (h ≥ n). Mỗi giờ Koko chọn một đống và ăn tối đa k quả từ đống đó; nếu đống còn ít hơn, cô ăn hết rồi chờ sang giờ sau. Trả về số nguyên k nhỏ nhất để cô ăn hết mọi đống trong h giờ. Ví dụ của ta chính là chuyện lịch ôn thi: các đống <code>[4, 11, 20, 23, 30]</code>, h = 8 → 15.</p>
<p><strong>Vét cạn.</strong> Thử k = 1, 2, 3, … và trả về giá trị đầu tiên được. Mỗi lần thử tốn O(n); đáp án có thể lớn tới max(piles) = 10⁹, nên O(n · max) = 10⁴ · 10⁹ — vô vọng. Hãy nói nó ra, kèm con số, và nói thứ bạn sẽ giữ lại: hàm kiểm thì ổn, <em>thứ tự thử</em> mới là chỗ phí.</p>
<p><strong>Bốn bước.</strong> (1) Đáp án là một tốc độ k. (2) <code>hoursAt(k) = Σ ceil(p / k)</code> — mỗi đống mất ceil(p / k) giờ (ceil = làm tròn lên); check là <code>hoursAt(k) ≤ h</code>. (3) k lớn hơn không bao giờ làm ceil(p / k) nào lớn hơn, nên tổng không bao giờ tăng: đơn điệu. (4) k = 1 là chậm nhất có thể; k = max(piles) luôn được (mỗi đống một giờ, mà h ≥ n). Đáp án = <code>firstTrue(1, max, check)</code> — ở đây hi = max tự nó đã là một T biết trước, nên không cần ô "ngay sau".</p>
</div>

${maHai('ch04/koko.ts', 'ch04/Koko.java', { vung: 'lc875' })}
${ketQua('ch04/koko.ts')}
${ketQua('ch04/Koko.java')}

<div class="ml-en">
<p>The second line prints the whole F/T row for k = 1…30 — something the real solution never computes, printed here so you can see that the row really is F…F T…T, switching at k = 15 (14 pages an evening needs 9 evenings, 15 needs exactly 8). The search found 15 after <strong>4 checks</strong>, where trying 1, 2, 3, … needs 15. On a single pile of 10⁹ with h = 2 it takes 29 checks to find 500,000,000; trying one by one would need 500 million checks of the same cost. Edge cases in the output: h equal to the number of piles forces k = max (25), and a pile of 312,884,470 with one hour less than its size forces k = 2.</p>
<p>A Java detail in the code: <code>(p + (long) k − 1) / k</code> is ceil(p / k) using only integers — <code>Math.ceil(p / k)</code> with two <code>int</code>s would first do integer division and round <em>down</em>. And the sum is a <code>long</code>. That is not decoration:</p>
</div>
<div class="ml-vi">
<p>Dòng thứ hai in cả hàng F/T với k = 1…30 — thứ lời giải thật không bao giờ tính, in ra đây để bạn thấy hàng đúng là F…F T…T, đổi ở k = 15 (14 trang một tối cần 9 tối, 15 trang cần đúng 8). Phép tìm ra 15 sau <strong>4 lần check</strong>, trong khi thử 1, 2, 3, … cần 15 lần. Với một đống 10⁹ và h = 2, nó mất 29 lần check để ra 500.000.000; thử từng số sẽ cần 500 triệu lần check cùng chi phí. Ca biên trong output: h bằng đúng số đống buộc k = max (25), và một đống 312.884.470 với số giờ ít hơn kích thước một đơn vị buộc k = 2.</p>
<p>Một chi tiết Java trong code: <code>(p + (long) k − 1) / k</code> là ceil(p / k) chỉ dùng số nguyên — <code>Math.ceil(p / k)</code> với hai <code>int</code> sẽ chia nguyên trước và làm tròn <em>xuống</em> mất rồi. Và tổng là <code>long</code>. Không phải để trang trí:</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Java: summing hours in an <code>int</code> — a check that lies at exactly one value.</strong></p><p>Four piles of 10⁹ bananas at speed 1 need 4·10⁹ hours, more than 2³¹ − 1. The <code>int</code> sum wraps to a negative number, and "negative ≤ h" says <em>true</em>.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Java: cộng số giờ vào một <code>int</code> — hàm check nói dối ở đúng một giá trị.</strong></p><p>Bốn đống 10⁹ quả với tốc độ 1 cần 4·10⁹ giờ, lớn hơn 2³¹ − 1. Tổng <code>int</code> quay vòng thành số âm, và "số âm ≤ h" trả lời <em>đúng</em>.</p></div>
</div>
${ma('ch04/KokoTran.java', { vung: 'sai', nhan: 'Java — wrong' })}
${ketQua('ch04/KokoTran.java')}
<div class="ml-en">
<p>At k = 1 the <code>int</code> version computes −294,967,296 hours and claims Koko can finish; the truth is 4,000,000,000 hours and she cannot. The binary search still returned the right 4 — <em>by luck</em>: it never asked about k = 1. A linear scan does ask, and returns 1. That is the nastiest kind of bug: the code passes, then a refactor (or a different <code>lo</code>, or a test harness that checks the whole row) makes the lie visible months later. In TypeScript numbers are doubles, exact up to 2⁵³ ≈ 9·10¹⁵, so this sum is safe there — but <code>Math.ceil(p / k)</code> on doubles is also fine only because p and k are far below 2⁵³.</p>
</div>
<div class="ml-vi">
<p>Ở k = 1, bản <code>int</code> tính ra −294.967.296 giờ và khẳng định Koko ăn kịp; sự thật là 4.000.000.000 giờ và cô không kịp. Phép tìm nhị phân vẫn trả đúng 4 — <em>nhờ may</em>: nó không hề hỏi tới k = 1. Một lần quét tuyến tính thì có hỏi, và trả về 1. Đó là kiểu bug khó chịu nhất: code qua hết, rồi một lần refactor (hoặc một <code>lo</code> khác, hoặc một bộ test kiểm cả hàng) làm lời nói dối lộ ra sau vài tháng. Trong TypeScript số là double, chính xác tới 2⁵³ ≈ 9·10¹⁵, nên tổng này an toàn ở đó — nhưng <code>Math.ceil(p / k)</code> trên double cũng chỉ ổn vì p và k còn rất xa 2⁵³.</p>
</div>

<div class="ml-en">
<h3>Watch it run: lo, mid, hi over SPEEDS, not over an array</h3>
<p>The row of answers, k = 1 to 30 (grey = F, green = T, darker green = the first T):</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: lo, mid, hi trên các TỐC ĐỘ, không phải trên một mảng</h3>
<p>Hàng các câu trả lời, k = 1 tới 30 (xám = F, xanh = T, xanh đậm = T đầu tiên):</p>
</div>
<p>${ROW}</p>
${BANG_KOKO}
<div class="ml-en">
<p>Read the "mid" column: 15, 8, 12, 14 — the speeds the search actually tried. It started in the middle of 1…30, found 15 feasible (8 hours), then never looked above 15 again; 8 and 12 and 14 were too slow, so lo climbed to 15 and met hi. Only four of the thirty cells in the row above were ever computed. The simulation draws all thirty so you can watch the range shrink:</p>
${moPhong('ch04/koko.sim.js', 'en', 'Koko: binary search over speeds — step by step', 'Each cell shows hours(k); the highlighted block is the range of speeds still in play. Change PILES and H and run again.')}
</div>
<div class="ml-vi">
<p>Đọc cột "mid": 15, 8, 12, 14 — những tốc độ phép tìm đã thật sự thử. Nó bắt đầu ở giữa 1…30, thấy 15 khả thi (8 giờ), rồi không bao giờ nhìn trên 15 nữa; 8, 12 và 14 quá chậm, nên lo leo lên 15 và gặp hi. Chỉ bốn trong ba mươi ô của hàng ở trên từng được tính. Mô phỏng vẽ cả ba mươi ô để bạn xem đoạn co lại:</p>
${moPhong('ch04/koko.sim.js', 'vi', 'Koko: tìm nhị phân trên các tốc độ — chạy từng bước', 'Mỗi ô là hours(k); khối tô màu là dải tốc độ còn đang xét. Đổi PILES và H rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>Complexity, said precisely</h3>
<p>log₂(max − 1) rounds, each one a check of O(n): <strong>O(n log M)</strong> time where M = max(piles), O(1) extra space. With n = 10⁴ and M = 10⁹ that is about 30 · 10⁴ = 3·10⁵ operations — instant. Compare the brute force's 10¹³. A good interview sentence: "The search space is the answer range, not the array; it costs log of the range times one linear check."</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp, nói cho chính xác</h3>
<p>log₂(max − 1) vòng, mỗi vòng một lần check O(n): thời gian <strong>O(n log M)</strong> với M = max(piles), bộ nhớ phụ O(1). Với n = 10⁴ và M = 10⁹ là khoảng 30 · 10⁴ = 3·10⁵ phép tính — tức thì. So với 10¹³ của vét cạn. Một câu nên nói khi phỏng vấn: "Không gian tìm là khoảng đáp án chứ không phải mảng; chi phí là log của độ rộng khoảng nhân với một lần kiểm tuyến tính." <em>("The search space is the range of answers.")</em></p>
</div>

<div class="ml-en">
<h3>Three variants, one template</h3>
<p><strong>Capacity to ship within D days (LC 1011).</strong> Boxes must be shipped in the given order; each day the ship takes boxes until the next one would exceed its capacity. Minimum capacity to finish in D days? (1) Answer: capacity c. (2) Check: greedy — load in order, start a new day when the next box does not fit; count days ≤ D. (3) Bigger ship never needs more days. (4) lo = the heaviest box (anything smaller cannot carry it at all), hi = the total weight (everything in one day).</p>
<p><strong>Minimum days to make m bouquets (LC 1482).</strong> Flower i blooms on day <code>bloomDay[i]</code>; a bouquet needs k <em>adjacent</em> bloomed flowers. Minimum day on which m bouquets can be made, or −1. (1) Answer: a day d. (2) Check: walk left to right counting runs of bloomed flowers; every k in a run make a bouquet. (3) Waiting longer never un-blooms a flower. (4) lo = earliest bloom, hi = latest bloom. If m·k &gt; n it is impossible on any day — check that first, and in Java compute it as <code>(long) m * k</code> (up to 10⁶ · 10⁵ = 10¹¹).</p>
<p><strong>Split array largest sum (LC 410, Hard).</strong> Split an array into k non-empty contiguous pieces so that the largest piece sum is as small as possible. (1) Answer: a limit L on the piece sum. (2) Check: greedily cut as late as possible so no piece exceeds L; count pieces ≤ k. (3) A larger limit never needs more pieces. (4) lo = the largest element, hi = the total. Look at the code: it is LC 1011 with different names — "days" are "pieces", "capacity" is "limit". The self-test runs both on the same 500 random inputs against brute force and gets the same answers.</p>
</div>
<div class="ml-vi">
<h3>Ba biến thể, một khuôn</h3>
<p><strong>Chở hàng trong D ngày (LC 1011).</strong> Các kiện phải chở đúng thứ tự; mỗi ngày tàu nhận kiện tới khi kiện tiếp theo làm vượt sức chứa. Sức chứa nhỏ nhất để chở xong trong D ngày? (1) Đáp án: sức chứa c. (2) Check: tham lam — xếp theo thứ tự, sang ngày mới khi kiện tiếp theo không vừa; đếm số ngày ≤ D. (3) Tàu to hơn không bao giờ cần nhiều ngày hơn. (4) lo = kiện nặng nhất (nhỏ hơn thì không chở nổi nó), hi = tổng khối lượng (chở hết trong một ngày).</p>
<p><strong>Số ngày ít nhất để làm m bó hoa (LC 1482).</strong> Hoa thứ i nở vào ngày <code>bloomDay[i]</code>; một bó cần k bông đã nở <em>liền kề</em>. Ngày sớm nhất làm được m bó, không được thì −1. (1) Đáp án: một ngày d. (2) Check: đi từ trái sang phải đếm các đoạn hoa đã nở; cứ k bông trong một đoạn thành một bó. (3) Chờ lâu hơn không làm bông nào "héo lại thành chưa nở". (4) lo = ngày nở sớm nhất, hi = ngày nở muộn nhất. Nếu m·k &gt; n thì ngày nào cũng không được — kiểm điều đó trước, và trong Java tính bằng <code>(long) m * k</code> (tới 10⁶ · 10⁵ = 10¹¹).</p>
<p><strong>Chia mảng sao cho tổng lớn nhất nhỏ nhất (LC 410, Hard).</strong> Chia mảng thành k đoạn liên tiếp khác rỗng sao cho tổng của đoạn lớn nhất là nhỏ nhất có thể. (1) Đáp án: một giới hạn L cho tổng mỗi đoạn. (2) Check: tham lam cắt muộn nhất có thể để không đoạn nào vượt L; đếm số đoạn ≤ k. (3) Giới hạn lớn hơn không bao giờ cần nhiều đoạn hơn. (4) lo = phần tử lớn nhất, hi = tổng. Nhìn code mà xem: nó là LC 1011 đổi tên — "ngày" thành "đoạn", "sức chứa" thành "giới hạn". Bộ tự kiểm chạy cả hai trên cùng 500 đầu vào ngẫu nhiên so với vét cạn và ra cùng đáp án.</p>
</div>
${maHai('ch04/dap-an.ts', 'ch04/DapAn.java', { vung: 'lc1011' })}
${maHai('ch04/dap-an.ts', 'ch04/DapAn.java', { vung: 'lc1482' })}
${maHai('ch04/dap-an.ts', 'ch04/DapAn.java', { vung: 'lc410' })}
${ketQua('ch04/dap-an.ts')}
<div class="ml-en">
<p>Check the numbers by hand once — it is the best way to trust the greedy. Ship in 3 days with capacity 13: [3, 8, 2] = 13 | [7, 5] = 12 | [4, 6, 1] = 11 — three days; with 12 the first day takes [3, 8] and four days are needed. One day ⇒ the total 36; eight days (one box per day) ⇒ the heaviest box, 8. Bouquets m = 2, k = 2: by day 4 the bloomed flowers are at indices 1, 3, 4, 6, 7, giving runs [3, 4] and [6, 7] — two bouquets; on day 3 index 7 has not bloomed. m = 5, k = 2 needs 10 flowers out of 8 ⇒ −1 with 0 checks. Split into 2: [9, 2, 6, 4] = 21 | [11, 3, 5] = 19 ⇒ 21.</p>
<div class="pitfall co-tieu-de"><p><strong>The greedy check must be right on its own — test it before the search.</strong></p><p>Most wrong answers in this family are not in the binary search (the template does not change) but in the check: starting the day counter at 0 instead of 1, forgetting to put the box that did not fit into the new day (<code>load = 0</code> then <code>load += w</code>, in that order), or not resetting the run when a flower has not bloomed. Print <code>check(x)</code> for a few x by hand-picked values first; if the row is not F…F T…T, the search will return garbage silently.</p></div>
</div>
<div class="ml-vi">
<p>Kiểm tay các con số một lần — đó là cách tốt nhất để tin cái tham lam. Chở trong 3 ngày với sức chứa 13: [3, 8, 2] = 13 | [7, 5] = 12 | [4, 6, 1] = 11 — ba ngày; với 12 thì ngày đầu nhận [3, 8] và cần bốn ngày. Một ngày ⇒ tổng 36; tám ngày (mỗi ngày một kiện) ⇒ kiện nặng nhất, 8. Bó hoa m = 2, k = 2: tới ngày 4 các bông đã nở ở chỉ số 1, 3, 4, 6, 7, cho các đoạn [3, 4] và [6, 7] — hai bó; ngày 3 thì chỉ số 7 chưa nở. m = 5, k = 2 cần 10 bông trong khi có 8 ⇒ −1 với 0 lần check. Chia thành 2: [9, 2, 6, 4] = 21 | [11, 3, 5] = 19 ⇒ 21.</p>
<div class="pitfall co-tieu-de"><p><strong>Hàm check tham lam phải tự nó đúng — test nó trước khi tìm.</strong></p><p>Phần lớn đáp án sai ở họ bài này không nằm ở phép tìm nhị phân (khuôn không đổi) mà ở hàm check: đếm ngày bắt đầu từ 0 thay vì 1, quên đưa kiện không vừa sang ngày mới (<code>load = 0</code> rồi mới <code>load += w</code>, đúng thứ tự đó), hoặc không đặt lại đoạn đếm khi gặp bông chưa nở. Hãy in <code>check(x)</code> với vài giá trị chọn tay trước; nếu hàng không phải F…F T…T thì phép tìm sẽ trả về rác một cách lặng lẽ.</p></div>
</div>

<div class="ml-en">
<h3>"Maximise the minimum": the last T without a second template</h3>
<p>Some problems flip the direction: "place m balls in baskets so that the <em>smallest</em> gap is as <em>large</em> as possible" (LC 1552). Now a bigger gap is <em>harder</em>: "can I keep every gap ≥ g?" is T…T F…F. You do not need a "last true" template with <code>mid</code> rounding up. Ask the opposite question — "is g impossible?" — which is F…F T…T, and the answer is <code>firstTrue(lo, hi, g ⇒ !check(g)) − 1</code>: the cell just before the first impossible value. The same "− 1" trick gave us "last element ≤ s" in lesson 4.1 and gives us the largest batch size below. The full LC 1552 solution is in lesson 4.4.</p>
</div>
<div class="ml-vi">
<h3>"Làm lớn nhất giá trị nhỏ nhất": T cuối cùng mà không cần khuôn thứ hai</h3>
<p>Một số đề lật ngược chiều: "đặt m quả bóng vào các giỏ sao cho khoảng cách <em>nhỏ nhất</em> là <em>lớn nhất</em> có thể" (LC 1552). Giờ khoảng cách lớn hơn thì <em>khó hơn</em>: "giữ được mọi khoảng cách ≥ g không?" có dạng T…T F…F. Bạn không cần khuôn "T cuối cùng" với <code>mid</code> làm tròn lên. Hãy hỏi câu ngược lại — "g có bất khả thi không?" — có dạng F…F T…T, và đáp án là <code>firstTrue(lo, hi, g ⇒ !check(g)) − 1</code>: ô ngay trước giá trị bất khả thi đầu tiên. Đúng mẹo "− 1" này đã cho ta "phần tử cuối ≤ s" ở bài 4.1 và sẽ cho ta batch size lớn nhất ngay dưới đây. Lời giải đầy đủ LC 1552 nằm ở bài 4.4.</p>
</div>

<div class="ml-en">
<h3>In real systems: the largest batch that fits in GPU memory</h3>
<p>Training a model, you want the largest batch size that does not crash with "CUDA out of memory". Two things make this different from LeetCode. First, <strong>one probe is expensive</strong>: you launch a training step, wait a minute, and see whether it crashed — so the number of probes is the cost, not the CPU time. Second, <strong>there is no known upper bound</strong>: is it 300? 30,000? The fix for the second problem is <strong>exponential (galloping) search</strong>: try 1, 2, 4, 8, … until the first failure. If 512 fits and 1024 does not, the answer is in [512, 1024) and the template takes over. The probes total about 2·log₂(answer). The memory model below is simulated (a fixed overhead plus a cost per sample), so the run is reproducible:</p>
</div>
<div class="ml-vi">
<h3>Trong hệ thống thật: batch lớn nhất vừa bộ nhớ GPU</h3>
<p>Khi huấn luyện mô hình, bạn muốn batch size (số mẫu mỗi bước) lớn nhất mà không chết với lỗi "CUDA out of memory" (hết bộ nhớ GPU — OOM). Hai điều làm chuyện này khác LeetCode. Thứ nhất, <strong>mỗi lần dò rất đắt</strong>: bạn chạy một bước huấn luyện, chờ một phút, xem nó có sập không — nên số lần dò mới là chi phí, không phải thời gian CPU. Thứ hai, <strong>không biết cận trên</strong>: 300? 30.000? Cách giải vấn đề thứ hai là <strong>tìm theo cấp số nhân (tìm phi mã — exponential / galloping search)</strong>: thử 1, 2, 4, 8, … tới lần hỏng đầu tiên. Nếu 512 vừa mà 1024 không, đáp án nằm trong [512, 1024) và khuôn cũ làm nốt. Tổng số lần dò khoảng 2·log₂(đáp án). Mô hình bộ nhớ dưới đây là giả lập (một phần cố định cộng chi phí mỗi mẫu) để lần chạy tái lập được:</p>
</div>
${maHai('ch04/nguong-batch.ts', 'ch04/NguongBatch.java', { vung: 'gallop' })}
${ketQua('ch04/nguong-batch.ts')}
<div class="ml-en">
<p>Read the probe order: 1, 2, 4, …, 512 all fit, 1024 runs out of memory (11 probes to find a range); then the template on "does it OOM?" over [513, 1024): 768!, 640!, 576!, 544!, then 528, 536, 540 fit, 542 does not, 541 fits — 9 more. <strong>20 launches instead of 542</strong>; at one minute each, 20 minutes instead of nine hours. The answer is "first OOM − 1" = 541, using 24,552 of 24,576 MB.</p>
<p>The engineering caveat is the most important sentence of this section: real memory use is only <em>approximately</em> monotone. Fragmentation, a longer sequence in one batch, or a different kernel chosen by the library can make 540 crash on Tuesday and pass on Wednesday. Engineers search for the threshold, then <strong>back off by a safety margin</strong> (say 10 %). That is the same lesson as flaky tests in <code>git bisect</code>: binary search is exactly as reliable as the monotonicity of the question you ask.</p>
<p>This codebase does a small version of this every time it draws a PDF report: <code>fitText</code> in <code>src/services/work/reportBuilder.ts</code> finds the longest prefix of a title that, with "…", fits a given width — width grows with every character kept, so it is a threshold search on k. The real function measures glyphs with a font and is written in the "last T" style (<code>mid = Math.ceil((lo + hi) / 2)</code>, <code>lo = mid</code>); here it is in our template, with a fixed width table:</p>
</div>
<div class="ml-vi">
<p>Đọc thứ tự dò: 1, 2, 4, …, 512 đều vừa, 1024 hết bộ nhớ (11 lần dò để có một khoảng); rồi khuôn cũ trên câu hỏi "có OOM không?" trong [513, 1024): 768!, 640!, 576!, 544!, rồi 528, 536, 540 vừa, 542 không vừa, 541 vừa — thêm 9 lần. <strong>20 lần chạy thay vì 542</strong>; mỗi lần một phút thì là 20 phút thay vì chín tiếng. Đáp án là "lần OOM đầu tiên − 1" = 541, dùng 24.552 trên 24.576 MB.</p>
<p>Lời cảnh báo kỹ thuật là câu quan trọng nhất của phần này: bộ nhớ thật chỉ <em>gần</em> đơn điệu. Phân mảnh bộ nhớ, một batch có câu dài hơn, hay thư viện chọn một kernel khác có thể làm 540 sập vào thứ Ba và chạy được vào thứ Tư. Kỹ sư tìm ra ngưỡng, rồi <strong>lùi lại một biên an toàn</strong> (chẳng hạn 10 %). Đó cũng là bài học về test chập chờn trong <code>git bisect</code>: tìm nhị phân đáng tin đúng bằng mức đơn điệu của câu hỏi bạn đặt ra.</p>
<p>Kho mã của trang này làm một bản nhỏ của việc đó mỗi lần vẽ báo cáo PDF: <code>fitText</code> trong <code>src/services/work/reportBuilder.ts</code> tìm tiền tố dài nhất của một tiêu đề mà kèm "…" vẫn vừa một bề rộng cho trước — bề rộng tăng theo mỗi ký tự giữ lại, nên đó là dò ngưỡng trên k. Hàm thật đo từng nét chữ bằng font và viết theo kiểu "T cuối cùng" (<code>mid = Math.ceil((lo + hi) / 2)</code>, <code>lo = mid</code>); đây là nó viết theo khuôn của ta, với một bảng bề rộng cố định:</p>
</div>
${ma('ch04/cat-chu.ts', { vung: 'fit', nhan: 'TypeScript — fitText with the template' })}
${ketQua('ch04/cat-chu.ts')}
<div class="ml-en">
<p>Five or six width measurements per title instead of up to 56 — and in the real report each measurement lays out glyphs with a font library, so the saving is real. The same pattern hides in "smallest number of servers so p95 latency stays under 200 ms", "smallest timeout so 99.9 % of requests succeed", "largest image quality under a 200 KB budget": a monotone yes/no question over a number, and an expensive check.</p>
${lienKet({ bai: 'dsa-4-1-co-ban', title: '4.1 — git bisect, the same idea over commits', sub: 'Binary search over versions with a test script as the check', cta: 'Back to 4.1' })}
</div>
<div class="ml-vi">
<p>Năm, sáu lần đo bề rộng cho mỗi tiêu đề thay vì tới 56 — và trong báo cáo thật mỗi lần đo là dàn chữ bằng thư viện font, nên phần tiết kiệm là thật. Cùng khuôn đó ẩn trong "số máy chủ ít nhất để độ trễ p95 dưới 200 ms", "timeout nhỏ nhất để 99,9 % request thành công", "chất lượng ảnh cao nhất mà vẫn dưới 200 KB": một câu hỏi có/không đơn điệu trên một con số, và một hàm kiểm đắt.</p>
${lienKet({ bai: 'dsa-4-1-co-ban', title: '4.1 — git bisect: cùng ý tưởng trên các commit', sub: 'Tìm nhị phân trên phiên bản với một script test làm hàm check', cta: 'Về bài 4.1' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: probing hidden thresholds</h3>
<p>Attackers use galloping search too. A web application firewall blocks request bodies above some secret size; a login form locks the account after some number of failures; a fraud filter flags transfers above some amount; a rate limiter allows some number of requests per window. Each is a monotone yes/no question ("does a body of x bytes get through?"), and each answer is one request. With exponential search plus binary search, an attacker finds the exact threshold in a few dozen requests, then operates just below it — the largest payload that is never inspected, the number of password guesses per hour that never trips the lock.</p>
<p>Defence: thresholds should not be the only control (combine per-IP, per-account and per-device counters); use sliding windows and add randomness so "just below" is not a stable place; alert on the probing pattern itself (many requests whose sizes or rates double, then halve). Note that hiding a limit is not a defence by itself: this backend's order limiter (<code>src/middleware/orderRateLimit.ts</code>) uses <code>express-rate-limit</code> with <code>standardHeaders: true</code>, so it <em>announces</em> its limit in <code>RateLimit-*</code> response headers — which is fine, because that limit protects capacity, not secrets. For security thresholds (lockouts, fraud), what matters is that staying under the limit still costs the attacker too much.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: dò những ngưỡng được giấu kín</h3>
<p>Kẻ tấn công cũng dùng tìm phi mã. Tường lửa ứng dụng web (WAF) chặn body request lớn hơn một kích thước bí mật; form đăng nhập khoá tài khoản sau một số lần sai; bộ lọc gian lận gắn cờ giao dịch trên một số tiền; bộ giới hạn tốc độ cho phép một số request mỗi cửa sổ thời gian. Mỗi cái là một câu hỏi có/không đơn điệu ("body x byte có lọt qua không?"), và mỗi câu trả lời chỉ tốn một request. Với tìm theo cấp số nhân cộng tìm nhị phân, kẻ tấn công tìm ra ngưỡng chính xác sau vài chục request, rồi hoạt động ngay dưới nó — payload lớn nhất không bao giờ bị soi, số lần đoán mật khẩu mỗi giờ không bao giờ làm khoá tài khoản.</p>
<p>Cách phòng: ngưỡng không nên là lớp kiểm soát duy nhất (kết hợp bộ đếm theo IP, theo tài khoản, theo thiết bị); dùng cửa sổ trượt và thêm ngẫu nhiên để "ngay dưới ngưỡng" không phải một chỗ đứng ổn định; cảnh báo chính mẫu hình dò (nhiều request có kích thước hoặc tần suất gấp đôi rồi chia đôi). Lưu ý giấu ngưỡng tự nó không phải biện pháp phòng: bộ giới hạn đặt hàng của backend này (<code>src/middleware/orderRateLimit.ts</code>) dùng <code>express-rate-limit</code> với <code>standardHeaders: true</code>, tức nó <em>công bố</em> giới hạn trong các header <code>RateLimit-*</code> của phản hồi — vậy là ổn, vì giới hạn đó bảo vệ năng lực xử lý chứ không bảo vệ bí mật. Với ngưỡng an ninh (khoá tài khoản, gian lận), điều quan trọng là đứng dưới ngưỡng vẫn khiến kẻ tấn công tốn quá nhiều.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: LC 875</h3>
${hoiThoai([
  ['I', 'Koko has n piles and h hours, eats up to k bananas from one pile per hour. Find the minimum integer k to finish in h hours.'],
  ['C', 'A few checks: h is at least the number of piles, so an answer always exists? Piles can be up to 10⁹ and n up to 10⁴?'],
  ['N', '"An answer always exists" fixes hi; the size of the values tells you about overflow and that you cannot try every k.'],
  ['I', 'Yes, h ≥ n, piles up to 10⁹, n up to 10⁴.'],
  ['C', 'For a fixed k it is easy to compute the hours: the sum of ceil(pile / k). So I can check any guess in O(n). Trying k = 1, 2, 3… could be 10⁹ checks. But if k works, any bigger k also works — eating faster never takes longer — so "k is enough" is false-false-…-true-true over k. I will binary search for the first true between 1 and max(piles), since max always works.'],
  ['N', 'The monotonicity sentence is the whole proof; say it before the code.'],
  ['C', 'That is about 30 checks of O(n), so O(n log M) with M the largest pile, and O(1) space.'],
  ['I', 'Go ahead.'],
  ['C', '(while coding) In Java I will sum the hours in a long: at k = 1 the sum can be 10⁴ · 10⁹. And ceil without floating point: (p + k − 1) / k, also in long.'],
  ['N', 'Name the overflow before the interviewer finds it. It is the most common bug in this problem in Java.'],
  ['C', '(testing) Piles [4, 11, 20, 23, 30], h = 8: at 15 the hours are 1 + 1 + 2 + 2 + 2 = 8, at 14 they are 9, so 15. Edge: h equal to the number of piles gives max(piles).'],
  ['I', 'Follow-up: what if k could be a real number?'],
  ['C', 'Same idea on a continuous range: I would stop after a fixed number of iterations, say 60, or when hi − lo is below the precision I need, instead of lo &lt; hi.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: LC 875</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch đó bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Koko có n đống chuối và h giờ, mỗi giờ ăn tối đa k quả từ một đống. Tìm số nguyên k nhỏ nhất để ăn xong trong h giờ.'],
  ['C', 'Em hỏi vài điều: h luôn ≥ số đống, nên luôn có đáp án đúng không ạ? Mỗi đống tới 10⁹ và n tới 10⁴? <em>("So an answer always exists?")</em>'],
  ['N', '"Luôn có đáp án" chốt được hi; độ lớn giá trị cho biết chuyện tràn số và rằng không thử hết mọi k được.'],
  ['I', 'Đúng, h ≥ n, mỗi đống tới 10⁹, n tới 10⁴.'],
  ['C', 'Với một k cố định thì tính số giờ rất dễ: tổng ceil(đống / k). Vậy em kiểm được mọi giá trị đoán trong O(n). Thử k = 1, 2, 3… có thể tới 10⁹ lần. Nhưng nếu k được thì mọi k lớn hơn cũng được — ăn nhanh hơn không bao giờ lâu hơn — nên "k có đủ không" là sai-sai-…-đúng-đúng theo k. Em tìm nhị phân chỗ đúng đầu tiên trong khoảng 1 tới max(piles), vì max luôn được. <em>("If k works, any larger k also works, so the predicate is monotonic.")</em>'],
  ['N', 'Câu về tính đơn điệu là toàn bộ chứng minh; nói nó trước khi code.'],
  ['C', 'Khoảng 30 lần check O(n), nên O(n log M) với M là đống lớn nhất, bộ nhớ O(1).'],
  ['I', 'Làm đi.'],
  ['C', '(vừa code vừa nói) Trong Java em cộng số giờ vào long: ở k = 1 tổng có thể là 10⁴ · 10⁹. Và ceil không dùng số thực: (p + k − 1) / k, cũng bằng long. <em>("I’ll use a long to avoid overflow.")</em>'],
  ['N', 'Gọi tên lỗi tràn số trước khi người phỏng vấn tìm ra. Đó là bug hay gặp nhất của đề này trong Java.'],
  ['C', '(tự test) Các đống [4, 11, 20, 23, 30], h = 8: ở 15 số giờ là 1 + 1 + 2 + 2 + 2 = 8, ở 14 là 9, nên ra 15. Ca biên: h bằng số đống thì ra max(piles).'],
  ['I', 'Câu hỏi thêm: nếu k được là số thực thì sao?'],
  ['C', 'Cùng ý tưởng trên khoảng liên tục: em dừng sau một số vòng cố định, chẳng hạn 60, hoặc khi hi − lo nhỏ hơn độ chính xác cần, thay cho điều kiện lo &lt; hi. <em>("Iterate a fixed number of times on a real range.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Searching the array (indices) instead of the answer range (speeds, capacities, days).</li>
<li>No monotonicity argument — and a check that is not monotone (e.g. "exactly h hours" instead of "at most h").</li>
<li>Wrong bounds: lo = 0 (division by zero in <code>p / k</code>), lo = 1 for LC 1011 (smaller than the heaviest box — the greedy then loops or miscounts), hi too small so the true answer is outside the range.</li>
<li><code>int</code> sums and products in Java: hours in LC 875, <code>m * k</code> in LC 1482, time × count in LC 2187.</li>
<li>"Maximise the minimum" with the minimise template, returning the first F instead of the last T.</li>
<li>A greedy check with an off-by-one (days start at 1, the box that did not fit goes into the new day).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Tìm trên mảng (chỉ số) thay vì trên khoảng đáp án (tốc độ, sức chứa, số ngày).</li>
<li>Không có lập luận đơn điệu — và hàm check không đơn điệu (vd "đúng h giờ" thay vì "tối đa h giờ").</li>
<li>Cận sai: lo = 0 (chia cho 0 trong <code>p / k</code>), lo = 1 ở LC 1011 (nhỏ hơn kiện nặng nhất — tham lam khi đó lặp vô hạn hoặc đếm sai), hi quá nhỏ nên đáp án thật nằm ngoài khoảng.</li>
<li>Tổng và tích <code>int</code> trong Java: số giờ ở LC 875, <code>m * k</code> ở LC 1482, thời gian × số chuyến ở LC 2187.</li>
<li>"Làm lớn nhất giá trị nhỏ nhất" mà dùng khuôn làm-nhỏ-nhất, trả về F đầu tiên thay vì T cuối cùng.</li>
<li>Hàm check tham lam bị lệch một (ngày bắt đầu từ 1, kiện không vừa phải sang ngày mới).</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Lời giải từng bước của LC 1552 (làm lớn nhất giá trị nhỏ nhất) và 7 đề khác nằm ở <a href="${baiNay('dsa-4-4-luyen')}">bài 4.4 (Bộ luyện 4)</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>For LC 1011, write the four steps on paper (answer, check, monotonicity sentence, bounds) <em>before</em> any code.</li>
<li>Write the check alone and print it for capacities 8 to 14 on <code>[3, 8, 2, 7, 5, 4, 6, 1]</code> with 3 days: you should see F F F F F T T.</li>
<li>Plug the check into the unchanged <code>firstTrue</code>; submit LC 875, LC 1011 and LC 1482.</li>
<li>In Java, change the hours sum in LC 875 to <code>int</code> and find, by hand, one input on which a linear scan returns a wrong answer.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, the printed F/T row matches your prediction, and your notebook has the four steps for each problem.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">binary search on the answer</span><span class="v">Binary search over the possible values of the answer, with a feasibility check.</span></div>
  <div class="kv"><span class="k">feasibility check</span><span class="v">check(x): "is x good enough?", usually a greedy O(n) simulation.</span></div>
  <div class="kv"><span class="k">monotone predicate</span><span class="v">Once check(x) is true it stays true for every larger x (or the reverse).</span></div>
  <div class="kv"><span class="k">greedy</span><span class="v">Make the locally obvious choice at each step (fill the day, cut as late as possible).</span></div>
  <div class="kv"><span class="k">minimise the maximum / maximise the minimum</span><span class="v">Two wordings of this pattern: first T vs last T.</span></div>
  <div class="kv"><span class="k">exponential (galloping) search</span><span class="v">Double the guess until it fails, then binary search the last doubling interval.</span></div>
  <div class="kv"><span class="k">OOM (out of memory)</span><span class="v">A process asks for more memory than is available and crashes.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>"Minimum x such that…" + an easy check + monotone ⇒ binary search over x.</li>
<li>Four steps: name the answer, write check(x), prove monotone in one sentence, choose bounds.</li>
<li>Cost: O(n · log(range)); Koko took 4 checks for 30 speeds and 29 for 10⁹.</li>
<li>LC 1011 and LC 410 are the same code; LC 1482 searches over days.</li>
<li>Maximise the minimum = firstTrue(not check) − 1.</li>
<li>Unknown upper bound or expensive probes ⇒ galloping search; real thresholds are only roughly monotone — keep a margin.</li>
</ul>
${nguon('📗', 'cp-algorithms — Binary search (search on a predicate)', 'The monotone-predicate view and searching over real numbers', 'https://cp-algorithms.com/num_methods/binary_search.html')}
${nguon('🔥', 'PyTorch — CUDA semantics: memory management', 'Why GPU memory use is not perfectly predictable: the caching allocator and fragmentation', 'https://pytorch.org/docs/stable/notes/cuda.html')}
${nguon('📙', 'express-rate-limit (GitHub)', 'The library behind this backend’s order limiter, including the standard RateLimit headers', 'https://github.com/express-rate-limit/express-rate-limit')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Với LC 1011, viết bốn bước ra giấy (đáp án, check, câu đơn điệu, cận) <em>trước</em> khi viết code.</li>
<li>Viết riêng hàm check và in nó với sức chứa từ 8 tới 14 trên <code>[3, 8, 2, 7, 5, 4, 6, 1]</code> với 3 ngày: bạn phải thấy F F F F F T T.</li>
<li>Cắm hàm check vào <code>firstTrue</code> không sửa; nộp LC 875, LC 1011 và LC 1482.</li>
<li>Trong Java, đổi tổng số giờ của LC 875 thành <code>int</code> và tự tìm một đầu vào khiến lần quét tuyến tính trả sai.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, hàng F/T in ra khớp với dự đoán của bạn, và sổ có bốn bước cho mỗi đề.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">binary search on the answer (tìm nhị phân trên đáp án)</span><span class="v">Tìm nhị phân trên các giá trị có thể của đáp án, kèm một hàm kiểm khả thi.</span></div>
  <div class="kv"><span class="k">feasibility check (hàm kiểm khả thi)</span><span class="v">check(x): "x đã đủ chưa?", thường là một lần mô phỏng tham lam O(n).</span></div>
  <div class="kv"><span class="k">monotone predicate (điều kiện đơn điệu)</span><span class="v">check(x) đã đúng thì đúng mãi với mọi x lớn hơn (hoặc ngược lại).</span></div>
  <div class="kv"><span class="k">greedy (tham lam)</span><span class="v">Mỗi bước chọn điều hiển nhiên tại chỗ (xếp đầy ngày, cắt muộn nhất).</span></div>
  <div class="kv"><span class="k">minimise the maximum / maximise the minimum (nhỏ nhất của lớn nhất / lớn nhất của nhỏ nhất)</span><span class="v">Hai cách phát biểu của dạng này: T đầu tiên vs T cuối cùng.</span></div>
  <div class="kv"><span class="k">exponential / galloping search (tìm theo cấp số nhân / tìm phi mã)</span><span class="v">Nhân đôi giá trị đoán tới khi hỏng, rồi tìm nhị phân trong khoảng nhân đôi cuối.</span></div>
  <div class="kv"><span class="k">OOM — out of memory (hết bộ nhớ)</span><span class="v">Tiến trình xin nhiều bộ nhớ hơn số có và bị sập.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>"x nhỏ nhất sao cho…" + hàm kiểm dễ + đơn điệu ⇒ tìm nhị phân trên x.</li>
<li>Bốn bước: gọi tên đáp án, viết check(x), chứng minh đơn điệu trong một câu, chọn cận.</li>
<li>Chi phí: O(n · log(độ rộng khoảng)); Koko mất 4 lần check cho 30 tốc độ và 29 lần cho 10⁹.</li>
<li>LC 1011 và LC 410 là cùng một code; LC 1482 tìm trên số ngày.</li>
<li>Lớn nhất của nhỏ nhất = firstTrue(không check) − 1.</li>
<li>Không biết cận trên hoặc mỗi lần dò đắt ⇒ tìm phi mã; ngưỡng thật chỉ gần đơn điệu — chừa biên an toàn.</li>
</ul>
${nguon('📗', 'cp-algorithms — Binary search (search on a predicate)', 'Góc nhìn điều kiện đơn điệu và tìm trên số thực', 'https://cp-algorithms.com/num_methods/binary_search.html')}
${nguon('🔥', 'PyTorch — CUDA semantics: memory management', 'Vì sao bộ nhớ GPU không đoán trước hoàn toàn được: bộ cấp phát có đệm và phân mảnh', 'https://pytorch.org/docs/stable/notes/cuda.html')}
${nguon('📙', 'express-rate-limit (GitHub)', 'Thư viện đứng sau bộ giới hạn đặt hàng của backend này, kể cả các header RateLimit chuẩn', 'https://github.com/express-rate-limit/express-rate-limit')}
</div>
`,
};
