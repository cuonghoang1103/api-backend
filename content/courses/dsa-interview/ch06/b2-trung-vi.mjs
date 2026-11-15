/** 6.2 — Hai heap: trung vị động. Mọi mã/output đọc từ ../ma/ch06 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { vetTrungVi } from '../ma/ch06/median.vet.mjs';

const STREAM = [5, 15, 1, 3, 8, 7, 9, 10];
const BANG = bangVet(['add', 'goes to', 'rebalance', 'lo (max-heap, top first)', 'hi (min-heap, top first)', 'median'],
  vetTrungVi(STREAM).map((h) => [
    `<strong>${h.x}</strong>`,
    h.vao,
    h.chuyen ?? '—',
    h.lo.length ? oMang(h.lo, { to: { 0: 'l' } }) : '∅',
    h.hi.length ? oMang(h.hi, { to: { 0: 'r' } }) : '∅',
    `<strong>${h.med}</strong>`,
  ]));

const DE = [
  [lc(703, 'kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', 'Easy'), 'Warm-up with ONE heap on a stream: a min-heap of size k.', 'Khởi động với MỘT heap trên luồng: min-heap kích thước k.'],
  [lc(295, 'find-median-from-data-stream', 'Find Median from Data Stream', 'Hard'), 'This lesson’s main problem: max-heap of the lower half + min-heap of the upper half.', 'Đề chính của bài: max-heap nửa dưới + min-heap nửa trên.'],
  [lc(2462, 'total-cost-to-hire-k-workers', 'Total Cost to Hire K Workers', 'Medium'), 'Two min-heaps, one per end of the array; take the cheaper top, refill from that side.', 'Hai min-heap, mỗi đầu mảng một cái; lấy đỉnh rẻ hơn, nạp thêm từ phía đó.'],
  [lc(502, 'ipo', 'IPO', 'Hard'), 'One heap unlocks (by capital), the other chooses (by profit).', 'Một heap mở khoá (theo vốn), heap kia chọn (theo lợi nhuận).'],
  [lc(480, 'sliding-window-median', 'Sliding Window Median', 'Hard'), 'Two heaps + lazy deletion, or an ordered multiset; watch the int overflow in the average.', 'Hai heap + xoá lười, hoặc multiset có thứ tự; coi chừng tràn int khi lấy trung bình.'],
  [lc(2102, 'sequentially-ordinal-rank-tracker', 'Sequentially Ordinal Rank Tracker', 'Hard'), 'Two heaps split at a moving rank i instead of at the middle.', 'Hai heap chia tại thứ hạng i di động thay vì tại điểm giữa.'],
  [lc(857, 'minimum-cost-to-hire-k-workers', 'Minimum Cost to Hire K Workers', 'Hard'), 'Sort by wage/quality ratio, keep the k smallest qualities in a max-heap.', 'Sắp theo tỉ lệ lương/chất lượng, giữ k chất lượng nhỏ nhất trong max-heap.'],
  [lc(4, 'median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'Hard'), 'Contrast: the word "median" but NOT heaps — both arrays are sorted ⇒ binary search on the cut (Chapter 4).', 'Đối chiếu: có chữ "median" nhưng KHÔNG phải heap — hai mảng đã sắp ⇒ tìm nhị phân trên vết cắt (Chương 4).'],
];

export default {
  title: '6.2 — Two heaps: the running median|||6.2 — Hai heap: trung vị động',
  slug: 'dsa-6-2-trung-vi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Find Median from Data Stream bằng max-heap nửa dưới + min-heap nửa trên, bảng vết hai heap qua từng phần tử, đo thật so với sort lại và chèn vào mảng đã sắp, sliding window median bằng xoá lười, IPO và bẫy tràn số khi lấy trung bình.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Two heaps: the running median</h2>
<p class="lead">"Numbers arrive one at a time; after each one, tell me the median." It is one of the most famous Hard problems in interview lists, and it is a <em>design</em> question in disguise: which structure keeps the middle of a growing set ready at all times? Sorting after every insertion is too slow, inserting into a sorted array is quadratic, and the elegant answer is two heaps facing each other. This lesson builds it with two invariants you can state in one breath, traces both heaps through every element, measures it against the slow versions, then bends the same idea to a sliding window (with <em>lazy deletion</em>) and to a greedy problem where two heaps play different roles.</p>

<h3>The everyday picture</h3>
<p>Line a class up by height and split it into two groups at the middle: the short group on the left, the tall group on the right. You do not care about the order <em>inside</em> each group. You only need two people: the <strong>tallest of the short group</strong> and the <strong>shortest of the tall group</strong> — they stand at the seam, and the median height is one of them (or their average). When a new student arrives, they join the group they belong to; if one group gets too big, its person at the seam steps across. That is the whole algorithm: the "short" group is a <strong>max-heap</strong> (its top is its tallest), the "tall" group is a <strong>min-heap</strong> (its top is its shortest).</p>
<p>Why the median and not the average? The <strong>median</strong> (trung vị) is the middle value of the sorted data; with an even count, the average of the two middle values. One billionaire walking into a café raises the <em>mean</em> income of the room enormously and the <em>median</em> barely at all. That robustness is why salary reports, house prices and latency dashboards ("p50 = 120 ms") use medians and percentiles.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Route</span><span class="lz-d">x ≤ top of lo ⇒ lo, otherwise hi</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Rebalance</span><span class="lz-d">sizes must be equal, or lo one bigger: move one top across</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Read</span><span class="lz-d">odd ⇒ top of lo; even ⇒ average of the two tops</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Hai heap: trung vị động</h2>
<p class="lead">"Các số đến lần lượt từng số một; sau mỗi số, cho tôi biết trung vị." Đây là một trong những đề Hard nổi tiếng nhất trong các danh sách luyện phỏng vấn, và thật ra là một câu hỏi <em>thiết kế</em> trá hình: cấu trúc nào giữ được "điểm giữa" của một tập hợp đang lớn dần, lúc nào cũng sẵn? Sắp xếp lại sau mỗi lần thêm thì quá chậm, chèn vào mảng đã sắp xếp thì bậc hai, còn lời giải đẹp là hai cái heap quay mặt vào nhau. Bài này dựng nó bằng hai bất biến nói được trong một hơi thở, vết hai heap qua từng phần tử, đo nó với các bản chậm, rồi uốn cùng ý tưởng sang cửa sổ trượt (với kỹ thuật <em>xoá lười</em> — lazy deletion) và sang một bài tham lam nơi hai heap đóng hai vai khác nhau.</p>

<h3>Hình dung đời thường</h3>
<p>Xếp cả lớp theo chiều cao rồi chia đôi ở giữa: nhóm thấp bên trái, nhóm cao bên phải. Bạn không quan tâm thứ tự <em>bên trong</em> mỗi nhóm. Bạn chỉ cần hai người: <strong>người cao nhất của nhóm thấp</strong> và <strong>người thấp nhất của nhóm cao</strong> — họ đứng ở đường nối giữa hai nhóm, và chiều cao trung vị chính là một trong hai người đó (hoặc trung bình của hai người). Khi một bạn mới vào lớp, bạn ấy nhập vào nhóm đúng với mình; nếu một nhóm đông quá, người đứng ở đường nối của nhóm đó bước sang nhóm kia. Toàn bộ thuật toán chỉ có vậy: nhóm "thấp" là một <strong>max-heap</strong> (đỉnh là người cao nhất nhóm), nhóm "cao" là một <strong>min-heap</strong> (đỉnh là người thấp nhất nhóm).</p>
<p>Vì sao trung vị mà không phải trung bình? <strong>Median</strong> (trung vị) là giá trị đứng giữa của dữ liệu đã sắp xếp; số phần tử chẵn thì lấy trung bình hai giá trị giữa. Một tỷ phú bước vào quán cà phê làm thu nhập <em>trung bình</em> của cả quán tăng vọt, còn <em>trung vị</em> gần như không nhúc nhích. Sự "lì" đó là lý do báo cáo lương, giá nhà và bảng theo dõi độ trễ ("p50 = 120 ms") dùng trung vị và phân vị (percentile).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Định tuyến</span><span class="lz-d">x ≤ đỉnh lo ⇒ vào lo, ngược lại vào hi</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cân bằng</span><span class="lz-d">kích thước bằng nhau, hoặc lo hơn đúng 1: chuyển một đỉnh sang</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đọc</span><span class="lz-d">lẻ ⇒ đỉnh lo; chẵn ⇒ trung bình hai đỉnh</span></div>
</div>
${csd('csd201-slide-csd9-2', 'vi', '4.D Heap, hàng đợi ưu tiên', '<p>Slide CSD201 dạy một heap và các thao tác của nó. <strong>Ở đây đi sâu thêm:</strong> ghép HAI heap ngược chiều nhau, mỗi heap giữ một nửa dữ liệu, và giữ hai bất biến để đọc trung vị trong O(1) — mẫu "two heaps" mà đề Hard hay dùng.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when two heaps are the answer</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"median" / "middle" / "p50" of a set that keeps changing</span><span class="v">Insertions (and maybe deletions) between queries ⇒ two heaps split at the middle.</span></div>
  <div class="kv"><span class="k">"the i-th best so far", i moving</span><span class="v">Same split, but at rank i instead of n/2 (LC 2102).</span></div>
  <div class="kv"><span class="k">"pick the best among what is currently allowed"</span><span class="v">One heap holds the locked items ordered by the unlock condition, another holds unlocked items ordered by value (IPO, LC 502).</span></div>
  <div class="kv"><span class="k">"cheapest from either end"</span><span class="v">One heap per side, take the better top (LC 2462).</span></div>
  <div class="kv"><span class="k">the data is static and you query once</span><span class="v">Not two heaps! Sort once (or quickselect, lesson 6.1). Two heaps pay off only when the set changes between queries.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đáp án là hai heap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"trung vị" / "ở giữa" / "p50" của một tập luôn thay đổi</span><span class="v">Có thêm (và có thể bớt) giữa các lần hỏi ⇒ hai heap chia nhau tại điểm giữa.</span></div>
  <div class="kv"><span class="k">"phần tử tốt thứ i tính tới giờ", i dịch dần</span><span class="v">Cùng cách chia, nhưng tại thứ hạng i thay vì n/2 (LC 2102).</span></div>
  <div class="kv"><span class="k">"chọn cái tốt nhất trong những cái hiện ĐƯỢC PHÉP chọn"</span><span class="v">Một heap giữ các món còn khoá, xếp theo điều kiện mở khoá; heap kia giữ các món đã mở, xếp theo giá trị (IPO, LC 502).</span></div>
  <div class="kv"><span class="k">"rẻ nhất từ một trong hai đầu"</span><span class="v">Mỗi đầu một heap, lấy đỉnh tốt hơn (LC 2462).</span></div>
  <div class="kv"><span class="k">dữ liệu đứng yên và chỉ hỏi một lần</span><span class="v">KHÔNG phải hai heap! Sắp xếp một lần (hoặc quickselect, bài 6.1). Hai heap chỉ có lợi khi tập hợp thay đổi giữa các lần hỏi.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Find Median from Data Stream</h3>
<p><strong>Problem (in our words).</strong> Design a class with <code>addNum(x)</code> and <code>findMedian()</code>. Calls are interleaved: after any number of additions you may be asked for the median of everything added so far. Example: add 5 → 5; add 15 → 10; add 1 → 5.</p>
<p><strong>Step 1 — the honest baselines.</strong> (a) Keep a list, and on <code>findMedian</code> copy it and sort: O(n log n) per query. If the interviewer queries after every insertion, n insertions cost O(n² log n). (b) Keep the list <em>sorted</em>: binary search finds the position in O(log n), but inserting shifts up to n elements, so each <code>addNum</code> is O(n) and the median is O(1). Say both, with their costs.</p>
<p><strong>Step 2 — what is wasted.</strong> Both baselines maintain the <em>full</em> order, but the median only needs to know where the middle is. Everything left of the middle can be in any order, as long as we can find its maximum; everything right of the middle likewise with its minimum. "Any order, but give me the max quickly" is exactly a heap.</p>
<p><strong>Step 3 — two heaps with two invariants.</strong> <code>lo</code> is a max-heap with the smaller half, <code>hi</code> a min-heap with the larger half.</p>
<ul>
<li><strong>Order invariant:</strong> every value in <code>lo</code> ≤ every value in <code>hi</code>. Equivalently: top(lo) ≤ top(hi). We guarantee it by <em>routing</em> — a new x goes to <code>lo</code> if x ≤ top(lo), otherwise to <code>hi</code>.</li>
<li><strong>Size invariant:</strong> size(lo) = size(hi) or size(hi) + 1. After routing, at most one heap is one too big; moving its top to the other heap fixes the sizes without breaking the order (the top of lo is the largest of the small half, so it is still ≤ everything in hi).</li>
</ul>
<p>Then the median is top(lo) when the count is odd, and the average of the two tops when it is even. Each <code>addNum</code> is at most three heap operations: O(log n). <code>findMedian</code> is O(1).</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Find Median from Data Stream</h3>
<p><strong>Đề (diễn đạt lại).</strong> Thiết kế một lớp có <code>addNum(x)</code> và <code>findMedian()</code>. Các lời gọi đan xen nhau: sau bao nhiêu lần thêm cũng có thể bị hỏi trung vị của mọi số đã thêm. Ví dụ: thêm 5 → 5; thêm 15 → 10; thêm 1 → 5.</p>
<p><strong>Bước 1 — các mốc trung thực.</strong> (a) Giữ một danh sách, mỗi lần <code>findMedian</code> thì sao chép rồi sắp xếp: O(n log n) mỗi lần hỏi. Nếu người phỏng vấn hỏi sau mỗi lần thêm, n lần thêm tốn O(n² log n). (b) Giữ danh sách <em>luôn được sắp xếp</em>: tìm nhị phân ra vị trí trong O(log n), nhưng chèn vào phải dời tới n phần tử, nên mỗi <code>addNum</code> là O(n), còn trung vị O(1). Hãy nói cả hai, kèm cái giá của chúng.</p>
<p><strong>Bước 2 — chỗ phí phạm.</strong> Cả hai mốc đều duy trì thứ tự <em>đầy đủ</em>, trong khi trung vị chỉ cần biết điểm giữa nằm ở đâu. Mọi thứ bên trái điểm giữa có thể lộn xộn tuỳ ý, miễn là tìm được phần tử lớn nhất của nó; bên phải cũng vậy với phần tử nhỏ nhất. "Lộn xộn cũng được, nhưng đưa tôi cái lớn nhất cho nhanh" chính là định nghĩa của heap.</p>
<p><strong>Bước 3 — hai heap với hai bất biến (invariant).</strong> <code>lo</code> là max-heap chứa nửa nhỏ, <code>hi</code> là min-heap chứa nửa lớn.</p>
<ul>
<li><strong>Bất biến thứ tự:</strong> mọi giá trị trong <code>lo</code> ≤ mọi giá trị trong <code>hi</code>. Tương đương: đỉnh(lo) ≤ đỉnh(hi). Ta đảm bảo nó bằng <em>định tuyến</em> — x mới vào <code>lo</code> nếu x ≤ đỉnh(lo), ngược lại vào <code>hi</code>.</li>
<li><strong>Bất biến kích thước:</strong> size(lo) = size(hi) hoặc size(hi) + 1. Sau khi định tuyến, nhiều nhất một heap thừa đúng một phần tử; chuyển đỉnh của nó sang heap kia là sửa xong kích thước mà không phá thứ tự (đỉnh của lo là số lớn nhất của nửa nhỏ, nên nó vẫn ≤ mọi số trong hi).</li>
</ul>
<p>Khi đó trung vị là đỉnh(lo) nếu số lượng lẻ, và trung bình hai đỉnh nếu chẵn. Mỗi <code>addNum</code> tốn tối đa ba thao tác heap: O(log n). <code>findMedian</code> là O(1).</p>
</div>
${maHai('ch06/median.ts', 'ch06/MedianFinder.java', { vung: 'giai' })}
${ketQua('ch06/median.ts')}
${ketQua('ch06/MedianFinder.java')}
<div class="ml-en">
<p>Lines that deserve a sentence each:</p>
<ul>
<li><code>this.lo.size === 0 || x &lt;= this.lo.peek()</code> — the empty check must come first; reading the top of an empty heap gives <code>undefined</code> in TS (and <code>x &lt;= undefined</code> is silently <code>false</code>) or a <code>NullPointerException</code> in Java when <code>null</code> is unboxed.</li>
<li>The two rebalancing branches are an <code>if / else if</code>: after one routing step, at most one of them can be true, and one move is always enough.</li>
<li>Java: <code>((double) lo.peek() + hi.peek()) / 2.0</code> widens <em>before</em> adding. <code>(lo.peek() + hi.peek()) / 2.0</code> adds two <code>int</code>s first and can overflow — demonstrated below.</li>
<li>The test <code>[-4, -4, -4, 2]</code> checks duplicates and negatives: the two middle values are −4 and −4, median −4.0.</li>
</ul>
<p>A common alternative you will see online: "always push into lo, then move lo's top to hi, then if hi is bigger move hi's top back". It is correct and branch-free but always does 2–3 heap operations; the routing version does the extra move only when needed and is easier to explain with the two invariants.</p>
</div>
<div class="ml-vi">
<p>Mấy dòng xứng đáng một câu giải thích:</p>
<ul>
<li><code>this.lo.size === 0 || x &lt;= this.lo.peek()</code> — kiểm rỗng phải đứng trước; đọc đỉnh của heap rỗng cho <code>undefined</code> trong TS (và <code>x &lt;= undefined</code> lặng lẽ là <code>false</code>) hoặc <code>NullPointerException</code> trong Java khi <code>null</code> bị mở hộp.</li>
<li>Hai nhánh cân bằng là <code>if / else if</code>: sau một bước định tuyến, nhiều nhất một nhánh đúng, và một lần chuyển luôn là đủ.</li>
<li>Java: <code>((double) lo.peek() + hi.peek()) / 2.0</code> nới kiểu <em>trước</em> khi cộng. <code>(lo.peek() + hi.peek()) / 2.0</code> cộng hai <code>int</code> trước nên có thể tràn — có demo bên dưới.</li>
<li>Test <code>[-4, -4, -4, 2]</code> kiểm phần tử trùng và số âm: hai giá trị giữa là −4 và −4, trung vị −4.0.</li>
</ul>
<p>Một cách khác hay thấy trên mạng: "luôn push vào lo, rồi chuyển đỉnh lo sang hi, rồi nếu hi lớn hơn thì chuyển đỉnh hi về". Nó đúng và không rẽ nhánh nhưng lần nào cũng tốn 2–3 thao tác heap; bản định tuyến chỉ chuyển thêm khi cần, và dễ giải thích bằng hai bất biến hơn.</p>
</div>

<div class="ml-en">
<h3>Watch both heaps through the stream</h3>
<p>Stream <code>[5, 15, 1, 3, 8, 7, 9, 10]</code>. Each heap is printed <em>sorted</em> for reading, top first (blue = top of lo, orange = top of hi) — the real arrays are in heap order, but the tops are the same. Produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem hai heap qua từng phần tử của luồng</h3>
<p>Luồng <code>[5, 15, 1, 3, 8, 7, 9, 10]</code>. Mỗi heap được in ra <em>đã sắp xếp</em> cho dễ đọc, đỉnh đứng đầu (xanh dương = đỉnh lo, cam = đỉnh hi) — mảng thật ở dạng heap, nhưng đỉnh thì y hệt. Bảng sinh ra bằng cách chạy thuật toán.</p>
</div>
${BANG}
<div class="ml-en">
<p>Read three rows. <strong>Add 3:</strong> 3 ≤ 5 goes to lo, which now has 3 items against 1 — the size invariant breaks, so lo's top 5 steps across; the median is (3 + 5) / 2 = 4. <strong>Add 8:</strong> 8 &gt; 3 goes to hi, which now has 3 against 2 — hi's top 5 steps back. The same 5 crossed twice: that is normal, it is the value sitting at the seam. <strong>Add 10:</strong> sizes become 4/4, nothing moves, median (7 + 8) / 2 = 7.5. Across 8 additions there were only 3 moves.</p>
${moPhong('ch06/median.sim.js', 'en', 'Two heaps — the running median', 'The stream, the lo max-heap and the hi min-heap side by side; the log says where each number goes and why a top moves.')}
</div>
<div class="ml-vi">
<p>Đọc ba dòng. <strong>Thêm 3:</strong> 3 ≤ 5 nên vào lo, lo giờ có 3 phần tử so với 1 — bất biến kích thước bị phá, nên đỉnh 5 của lo bước sang; trung vị (3 + 5) / 2 = 4. <strong>Thêm 8:</strong> 8 &gt; 3 nên vào hi, hi giờ có 3 so với 2 — đỉnh 5 của hi bước về. Cùng số 5 đi qua lại hai lần: bình thường, nó là giá trị đứng ngay đường nối. <strong>Thêm 10:</strong> kích thước thành 4/4, không chuyển gì, trung vị (7 + 8) / 2 = 7.5. Qua 8 lần thêm chỉ có 3 lần chuyển.</p>
${moPhong('ch06/median.sim.js', 'vi', 'Hai heap — trung vị động', 'Luồng số, max-heap lo và min-heap hi đặt cạnh nhau; log nói mỗi số đi vào đâu và vì sao một đỉnh phải chuyển sang.')}
</div>

<div class="ml-en">
<h3>The real cost, measured: median after every insertion</h3>
<p>Random integers; after each insertion we read the median and add it to a checksum (so all three methods are verified to give identical answers). Best of up to 3 runs, Apple M1 Max.</p>
</div>
<div class="ml-vi">
<h3>Cái giá thật, đo bằng số: trung vị sau MỖI lần thêm</h3>
<p>Số nguyên ngẫu nhiên; sau mỗi lần thêm ta đọc trung vị và cộng vào một tổng kiểm tra (nhờ vậy cả ba cách được kiểm là ra cùng đáp án). Lấy lần nhanh nhất trong tối đa 3 lượt, Apple M1 Max.</p>
</div>
${ma('ch06/median-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch06/median-do.ts')}
${ketQua('ch06/MedianDo.java')}
<div class="ml-en">
<ul>
<li><strong>Copy + sort each time</strong> goes from 63.3 ms at n = 1,000 to 11,630 ms at n = 10,000 in Node — 184× for 10× more data, the n² log n curve. Java is faster per step (sorting raw <code>int[]</code>) but grows the same way: 20.8 → 1,937 ms (93×).</li>
<li><strong>Sorted array + splice</strong> is surprisingly good at small n (0.1 ms at 1,000 — <code>splice</code> is a single memory move, very fast for short arrays) and then shows its O(n²): 3.9 → 427.9 ms from 10⁴ to 10⁵ in Node (110×). At 10⁶ it would need roughly another 100×, so it was not run.</li>
<li><strong>Two heaps</strong> grow almost linearly: 1.6 → 16.6 → 142.8 ms in Node from 10⁴ to 10⁶. At 1,000 elements the heap version is actually slower than splice (0.8 vs 0.1 ms) — constants win at tiny n. That is a fair thing to say in an interview: "for a few thousand items a sorted array is fine; two heaps are for large or unbounded streams".</li>
</ul>
</div>
<div class="ml-vi">
<ul>
<li><strong>Sao chép + sắp xếp mỗi lần</strong> đi từ 63,3 ms ở n = 1.000 lên 11.630 ms ở n = 10.000 trên Node — 184 lần cho dữ liệu gấp 10, đúng đường cong n² log n. Java mỗi bước nhanh hơn (sắp mảng <code>int[]</code> thô) nhưng tăng cùng kiểu: 20,8 → 1.937 ms (93 lần).</li>
<li><strong>Mảng đã sắp + splice</strong> bất ngờ tốt ở n nhỏ (0,1 ms ở 1.000 — <code>splice</code> chỉ là một lần dời bộ nhớ, rất nhanh với mảng ngắn) rồi lộ ra O(n²): 3,9 → 427,9 ms từ 10⁴ lên 10⁵ trên Node (110 lần). Ở 10⁶ sẽ cần khoảng 100 lần nữa nên không chạy.</li>
<li><strong>Hai heap</strong> tăng gần như tuyến tính: 1,6 → 16,6 → 142,8 ms trên Node từ 10⁴ tới 10⁶. Ở 1.000 phần tử bản heap thậm chí chậm hơn splice (0,8 so với 0,1 ms) — ở n tí hon thì hằng số thắng. Đó là một câu rất "đáng điểm" khi phỏng vấn: "vài nghìn phần tử thì mảng đã sắp là đủ; hai heap dành cho luồng lớn hoặc không giới hạn".</li>
</ul>
</div>

<div class="ml-en">
<h3>Trap: the average that overflows</h3>
<div class="pitfall co-tieu-de"><p><strong>In Java, <code>(a + b) / 2.0</code> adds two ints before anything becomes a double.</strong></p><p>Sliding Window Median includes a test with two copies of <code>Integer.MAX_VALUE</code>. The sum wraps to −2 and the "median" becomes −1.0:</p></div>
</div>
<div class="ml-vi">
<h3>Bẫy: phép lấy trung bình bị tràn số</h3>
<div class="pitfall co-tieu-de"><p><strong>Trong Java, <code>(a + b) / 2.0</code> cộng hai int TRƯỚC khi có bất cứ thứ gì thành double.</strong></p><p>Sliding Window Median có một test gồm hai lần <code>Integer.MAX_VALUE</code>. Tổng quay vòng thành −2 và "trung vị" thành −1.0:</p></div>
</div>
${ma('ch06/TranTrungVi.java', { vung: 'tran', nhan: 'Java' })}
${ketQua('ch06/TranTrungVi.java')}
<div class="ml-en">
<p>Java evaluates <code>a + b</code> as <code>int + int</code> because both operands are ints; the <code>2.0</code> only matters for the division that comes after. Any of the three fixes works; <code>a / 2.0 + b / 2.0</code> is the one that is hard to get wrong. TypeScript is immune here (all numbers are doubles up to 2⁵³), which is exactly why a JS-first candidate forgets it when the interviewer says "now do it in Java". The same family of bug: <code>lo.peek() == hi.peek()</code> on two <code>Integer</code>s compares <em>references</em> (lesson 1.1's trap) — unbox or use <code>equals</code>.</p>
</div>
<div class="ml-vi">
<p>Java tính <code>a + b</code> theo kiểu <code>int + int</code> vì cả hai toán hạng đều là int; số <code>2.0</code> chỉ có tác dụng với phép chia đứng sau. Cách sửa nào trong ba cách cũng được; <code>a / 2.0 + b / 2.0</code> là cách khó viết sai nhất. TypeScript miễn nhiễm ở đây (mọi số đều là double tới 2⁵³), và chính vì thế người quen JS hay quên nó khi người phỏng vấn nói "giờ viết bằng Java đi". Cùng họ lỗi: <code>lo.peek() == hi.peek()</code> trên hai <code>Integer</code> là so <em>tham chiếu</em> (bẫy của bài 1.1) — hãy mở hộp hoặc dùng <code>equals</code>.</p>
</div>

<div class="ml-en">
<h3>Variant 1 — Sliding Window Median: deleting from a heap, lazily</h3>
<p>Return the median of every window of size k. The window adds one number and removes one number each step. Adding is easy; <strong>removing an arbitrary value from a heap is the problem</strong>: a binary heap can only remove its top cheaply, and finding a value inside it is O(k).</p>
<p><strong>Lazy deletion:</strong> do not remove it now. Record "one copy of x is dead" in a map, adjust the <em>live</em> size counters as if it were gone, and physically pop dead values only when they reach a top (a <code>prune</code> loop). Two rules keep it correct: (1) decide which side the dead value belongs to by comparing with top(lo) — the same rule as routing; (2) after every operation, make sure both tops are alive, because the median is read from the tops. Each value is pushed once and popped at most once, so the total is O(n log n) and the heaps hold at most O(n) items, dead ones included.</p>
<p>In Java you may also answer with an ordered multiset: two <code>TreeMap&lt;Integer, Integer&gt;</code> (value → count) or two <code>TreeSet</code>s of indices ordered by (value, index), which support removal in O(log k). Saying "<code>PriorityQueue.remove(Object)</code> works but is O(k), so O(n·k) overall" shows you know the cost of the easy route.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Sliding Window Median: xoá khỏi heap, kiểu "lười"</h3>
<p>Trả về trung vị của mọi cửa sổ kích thước k. Mỗi bước cửa sổ thêm một số và bỏ một số. Thêm thì dễ; <strong>bỏ một giá trị bất kỳ khỏi heap mới là vấn đề</strong>: binary heap chỉ gỡ được đỉnh với giá rẻ, còn tìm một giá trị bên trong nó tốn O(k).</p>
<p><strong>Lazy deletion (xoá lười):</strong> đừng gỡ ngay. Ghi vào một map "một bản của x đã chết", chỉnh bộ đếm kích thước <em>sống</em> như thể nó đã đi, và chỉ thật sự pop các giá trị chết khi chúng trồi lên đỉnh (vòng lặp <code>prune</code>). Hai luật giữ cho nó đúng: (1) quyết định giá trị chết thuộc phía nào bằng cách so với đỉnh(lo) — đúng luật định tuyến; (2) sau mọi thao tác, đảm bảo cả hai đỉnh đều đang sống, vì trung vị đọc từ đỉnh. Mỗi giá trị được push một lần và pop nhiều nhất một lần, nên tổng là O(n log n), và hai heap chứa tối đa O(n) phần tử kể cả phần tử chết.</p>
<p>Trong Java bạn cũng có thể trả lời bằng một multiset có thứ tự: hai <code>TreeMap&lt;Integer, Integer&gt;</code> (giá trị → số lần) hoặc hai <code>TreeSet</code> chỉ số sắp theo (giá trị, chỉ số), xoá được trong O(log k). Nói thêm "<code>PriorityQueue.remove(Object)</code> chạy được nhưng O(k), cả bài O(n·k)" cho thấy bạn biết cái giá của đường dễ.</p>
</div>
${maHai('ch06/window-median.ts', 'ch06/WindowMedian.java', { vung: 'giai' })}
${ketQua('ch06/window-median.ts')}
<div class="ml-en">
<p>The last line matters more than the examples: 300 random arrays drawn from only 7 distinct values (so duplicates crossing the seam happen all the time) agree with a brute force that sorts every window. Lazy deletion is easy to get <em>almost</em> right; a randomised check against brute force is how you know it is right. The <code>[2147483647, 2147483647]</code> case passes because both versions halve before adding.</p>
</div>
<div class="ml-vi">
<p>Dòng cuối quan trọng hơn các ví dụ: 300 mảng ngẫu nhiên chỉ gồm 7 giá trị khác nhau (nên phần tử trùng nằm vắt qua đường nối xảy ra liên tục) cho kết quả khớp với bản vét cạn sắp xếp từng cửa sổ. Xoá lười rất dễ viết <em>gần</em> đúng; kiểm ngẫu nhiên đối chiếu với vét cạn là cách để biết nó đúng thật. Ca <code>[2147483647, 2147483647]</code> qua được vì cả hai bản đều chia đôi trước khi cộng.</p>
</div>

<div class="ml-en">
<h3>Variant 2 — IPO: two heaps with two different jobs</h3>
<p>You start with capital w and may finish at most k projects; project i needs capital[i] to start and adds profits[i] when done. Maximise the final capital. Greedy: in each round, among the projects you can <em>afford now</em>, take the most profitable — profit only increases w, so taking the biggest now never hurts later. Two heaps: <code>locked</code> orders projects by required capital (a min-heap), and each round we pop from it every project that became affordable into <code>open</code>, a max-heap by profit. Each project moves once: O(n log n).</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — IPO: hai heap với hai việc khác nhau</h3>
<p>Bạn có vốn w, được làm tối đa k dự án; dự án i cần vốn capital[i] để bắt đầu và cộng thêm profits[i] khi xong. Hãy làm vốn cuối cùng lớn nhất. Tham lam: mỗi vòng, trong các dự án <em>đủ tiền làm ngay</em>, chọn dự án lời nhất — lợi nhuận chỉ làm w tăng, nên lấy cái lớn nhất bây giờ không bao giờ làm hại về sau. Hai heap: <code>locked</code> xếp dự án theo vốn cần (min-heap), và mỗi vòng ta lấy ra khỏi nó mọi dự án vừa đủ tiền, đưa sang <code>open</code>, một max-heap theo lợi nhuận. Mỗi dự án chỉ di chuyển một lần: O(n log n).</p>
</div>
${maHai('ch06/ipo.ts', 'ch06/Ipo.java', { vung: 'giai' })}
${ketQua('ch06/ipo.ts')}
<div class="ml-en">
<p>First case by hand: w = 1 affords projects 0 (+3) and 1 (+1) → take +3, w = 4; now projects 2 (needs 4, +5) and 3 (needs 2, +2) unlock → take +5, w = 9; take +2, w = 11. Third case: nothing is affordable, the early <code>break</code> returns 0 instead of looping k times. The heaps store <strong>indices</strong> and the comparators look up the arrays — no tuple objects to allocate.</p>
</div>
<div class="ml-vi">
<p>Chạy tay ca đầu: w = 1 đủ làm dự án 0 (+3) và 1 (+1) → lấy +3, w = 4; giờ dự án 2 (cần 4, +5) và 3 (cần 2, +2) được mở → lấy +5, w = 9; lấy +2, w = 11. Ca thứ ba: không gì đủ tiền, lệnh <code>break</code> sớm trả về 0 thay vì lặp đủ k lần. Hai heap lưu <strong>chỉ số</strong> còn comparator tra mảng — không phải tạo đối tượng bộ đôi nào.</p>
</div>

<div class="ml-en">
<h3>Follow-ups interviewers actually ask</h3>
<ul>
<li><strong>"All numbers are integers in [0, 100]."</strong> Then you do not need heaps: keep <code>count[0..100]</code> and walk it to the middle. <code>addNum</code> O(1), <code>findMedian</code> O(101) = O(1).</li>
<li><strong>"99% of the numbers are in [0, 100]."</strong> Counting array for the common range, plus two counters (how many below 0, how many above 100) — or small heaps for the outliers. The median is almost surely inside the array.</li>
<li><strong>"Now the 90th percentile."</strong> Same two heaps, different size invariant: keep size(lo) ≈ 0.9 · n.</li>
<li><strong>"Billions of numbers across many machines."</strong> Exact medians need all the data; production systems use approximate sketches — fixed histograms (Prometheus) or t-digest — that use a few kilobytes and give an answer within a known error.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Những câu hỏi nối tiếp mà người phỏng vấn hay hỏi thật</h3>
<ul>
<li><strong>"Mọi số đều là số nguyên trong [0, 100]."</strong> Khi đó không cần heap: giữ <code>count[0..100]</code> và đi dọc nó tới điểm giữa. <code>addNum</code> O(1), <code>findMedian</code> O(101) = O(1).</li>
<li><strong>"99% số nằm trong [0, 100]."</strong> Mảng đếm cho miền phổ biến, cộng hai bộ đếm (bao nhiêu số dưới 0, bao nhiêu số trên 100) — hoặc hai heap nhỏ cho phần ngoại lai. Trung vị gần như chắc chắn nằm trong mảng.</li>
<li><strong>"Giờ là phân vị 90."</strong> Vẫn hai heap, khác bất biến kích thước: giữ size(lo) ≈ 0,9 · n.</li>
<li><strong>"Hàng tỷ số trên nhiều máy."</strong> Trung vị chính xác cần toàn bộ dữ liệu; hệ thống thật dùng bản phác thảo xấp xỉ (sketch) — histogram cố định (Prometheus) hoặc t-digest — chỉ tốn vài kilobyte và cho đáp án trong một sai số biết trước.</li>
</ul>
</div>

<div class="ml-en">
<h3>Where this lives in real systems</h3>
<ul>
<li><strong>CT Work cycle-time reports on this website</strong> show P50/P85/P95 of how long issues take (<code>GET /projects/:pid/reports/cycle-time</code>). The function behind them, <code>percentile()</code> in <code>src/services/work/flowMetrics.ts</code>, does exactly baseline (a): copy the values, sort, interpolate. And that is the <em>right</em> choice there — the report is computed once per request over a finite set, so "sort once" beats two heaps. (A small free improvement: <code>percentiles()</code> calls <code>percentile()</code> three times, sorting three copies; sorting once and reading three positions would do.) Choosing the simpler tool when the data is static is a skill, not laziness.</li>
<li><strong>The OS-lab queueing simulator</strong> (<code>frontend/src/components/os-lab/engine/queueing.ts</code>) reports p50 and p99 latency per simulated second with a small <code>pct(sorted, q)</code> helper over that second's sorted latencies — again batch, again sorting.</li>
<li><strong>Live dashboards</strong> (Grafana over Prometheus) cannot keep every request: they bucket latencies into a histogram and estimate quantiles from it. Two heaps are the exact, in-memory version of the same question.</li>
<li><strong>Scheduling with gates</strong> — the IPO shape — appears in job schedulers ("among jobs whose dependencies are done, run the highest priority") and in cloud autoscalers.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Báo cáo cycle time của CT Work trên chính trang này</strong> hiện P50/P85/P95 thời gian xử lý một thẻ (<code>GET /projects/:pid/reports/cycle-time</code>). Hàm đứng sau, <code>percentile()</code> trong <code>src/services/work/flowMetrics.ts</code>, làm đúng mốc (a): sao chép các giá trị, sắp xếp, nội suy. Và ở đó đấy là lựa chọn <em>đúng</em> — báo cáo được tính một lần mỗi request trên một tập hữu hạn, nên "sắp một lần" thắng hai heap. (Một cải tiến nhỏ miễn phí: <code>percentiles()</code> gọi <code>percentile()</code> ba lần, sắp ba bản sao; sắp một lần rồi đọc ba vị trí là đủ.) Chọn công cụ đơn giản hơn khi dữ liệu đứng yên là kỹ năng, không phải lười.</li>
<li><strong>Bộ mô phỏng hàng đợi của phòng lab hệ điều hành</strong> (<code>frontend/src/components/os-lab/engine/queueing.ts</code>) báo p50 và p99 độ trễ cho từng giây mô phỏng bằng hàm nhỏ <code>pct(sorted, q)</code> trên các độ trễ đã sắp của giây đó — lại là xử lý theo lô, lại là sắp xếp.</li>
<li><strong>Bảng theo dõi trực tiếp</strong> (Grafana trên Prometheus) không thể giữ mọi request: chúng gom độ trễ vào các ngăn histogram rồi ước lượng phân vị từ đó. Hai heap là phiên bản chính xác, trong bộ nhớ, của cùng câu hỏi ấy.</li>
<li><strong>Lập lịch có điều kiện mở</strong> — dáng của bài IPO — xuất hiện trong bộ lập lịch công việc ("trong các việc đã xong phụ thuộc, chạy việc ưu tiên cao nhất") và trong bộ tự co giãn máy chủ đám mây.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: why platforms prefer medians</h3>
<ul>
<li><strong>Review bombing.</strong> A product rated 4.5 by 1,000 people: 50 fake one-star accounts drag the <em>mean</em> down noticeably, but the <em>median</em> does not move until the attacker controls close to half of all votes. The same logic protects latency SLOs from a few pathological requests, and "median of several measurements" is how benchmark tools (including the ones in this course, which keep the <em>best</em> run) resist noise. Defence in depth: median or trimmed mean, plus rate limits and identity checks on who may vote.</li>
<li><strong>Unbounded memory.</strong> Two heaps keep every number ever added. On a public endpoint that accepts numbers from users ("report your score", "submit a measurement") an attacker can grow your heaps until the process dies. Bound the stream: a sliding window (Variant 1), a fixed-size reservoir sample, or a sketch with constant memory.</li>
<li><strong>Precision games.</strong> If values can be huge (2³¹ − 1) or non-finite (<code>Infinity</code>, <code>NaN</code> from a JSON field), validate them at the boundary — a single <code>NaN</code> pushed into a heap makes every comparison with it false and silently corrupts the order.</li>
</ul>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: vì sao các nền tảng thích trung vị</h3>
<ul>
<li><strong>Đánh giá phá hoại (review bombing).</strong> Một sản phẩm được 1.000 người chấm 4,5 sao: 50 tài khoản giả chấm một sao kéo điểm <em>trung bình</em> xuống thấy rõ, còn <em>trung vị</em> không nhúc nhích cho tới khi kẻ tấn công nắm gần một nửa số phiếu. Cùng lý lẽ đó bảo vệ cam kết độ trễ (SLO) khỏi vài request bất thường, và "lấy trung vị (hoặc lần tốt nhất) của nhiều lần đo" là cách các công cụ đo hiệu năng (kể cả các phép đo trong khoá này, vốn giữ lần <em>nhanh nhất</em>) chống nhiễu. Phòng thủ nhiều lớp: trung vị hoặc trung bình cắt bớt (trimmed mean), cộng giới hạn tần suất và xác minh danh tính người được chấm.</li>
<li><strong>Bộ nhớ không giới hạn.</strong> Hai heap giữ mọi số từng được thêm vào. Trên một endpoint công khai nhận số từ người dùng ("gửi điểm của bạn", "gửi số đo"), kẻ tấn công có thể làm heap phình tới khi tiến trình chết. Giới hạn luồng: cửa sổ trượt (Biến thể 1), lấy mẫu reservoir kích thước cố định, hoặc sketch có bộ nhớ hằng số.</li>
<li><strong>Trò chơi độ chính xác.</strong> Nếu giá trị có thể rất lớn (2³¹ − 1) hoặc không hữu hạn (<code>Infinity</code>, <code>NaN</code> từ một trường JSON), hãy kiểm tra ngay tại biên — chỉ một <code>NaN</code> đẩy vào heap là mọi phép so sánh với nó đều sai và thứ tự bị hỏng trong im lặng.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Design a structure that supports adding numbers and returning the median of everything added so far.'],
  ['C', 'How often is the median requested compared with additions — after every addition? Are the numbers integers, and is there a known range? Roughly how many numbers?'],
  ['N', 'The ratio of reads to writes decides the design; the range question sets up the counting-array follow-up before it is asked.'],
  ['I', 'Interleaved, possibly after every add. Integers, any range, up to 5·10⁴ operations.'],
  ['C', 'Simplest: keep a sorted list; binary search plus insert is O(n) per add because of shifting, median O(1). To do better I don’t need full order — only the max of the lower half and the min of the upper half. So: a max-heap lo for the lower half, a min-heap hi for the upper half, with two invariants: everything in lo ≤ everything in hi, and lo has the same size as hi or one more. Add is O(log n), median O(1).'],
  ['N', 'State the baseline, name the waste ("I don’t need full order"), then the invariants. Invariants are what the interviewer will check your code against.'],
  ['I', 'Code it.'],
  ['C', '(coding) Route by comparing with lo’s top, empty check first… then one rebalance step, if / else if, because routing can unbalance by at most one… For the even case I return the average of the tops — in Java I cast to double before adding to avoid overflow. Trace 5, 15, 1, 3: medians 5, 10, 5, 4 — after 3, lo had three items so 5 moved to hi. Correct.'],
  ['N', 'The trace is chosen to trigger a rebalance. Mentioning the overflow cast unprompted is a strong signal.'],
  ['I', 'What if 99% of numbers are between 0 and 100?'],
  ['C', 'Then a count array of 101 buckets handles almost everything in O(1), plus counters for values below 0 and above 100; the median is almost always inside the buckets, and if not, I fall back to small heaps for the outliers.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Thiết kế một cấu trúc cho phép thêm số và trả về trung vị của mọi số đã thêm.'],
  ['C', 'Trung vị được hỏi thường xuyên cỡ nào so với số lần thêm — sau mỗi lần thêm ạ? Các số là số nguyên chứ, có miền giá trị biết trước không? Khoảng bao nhiêu số? <em>("How often is the median requested?")</em>'],
  ['N', 'Tỉ lệ đọc/ghi quyết định thiết kế; câu hỏi về miền giá trị dọn đường cho câu hỏi nối tiếp "mảng đếm" trước khi nó được hỏi.'],
  ['I', 'Đan xen, có thể sau mỗi lần thêm. Số nguyên, miền bất kỳ, tới 5·10⁴ thao tác.'],
  ['C', 'Đơn giản nhất: giữ một danh sách đã sắp; tìm nhị phân cộng chèn là O(n) mỗi lần thêm vì phải dời phần tử, trung vị O(1). Muốn tốt hơn thì em không cần thứ tự đầy đủ — chỉ cần số lớn nhất của nửa dưới và số nhỏ nhất của nửa trên. Vậy: max-heap lo cho nửa dưới, min-heap hi cho nửa trên, với hai bất biến: mọi số trong lo ≤ mọi số trong hi, và lo bằng hi hoặc hơn đúng một phần tử. Thêm là O(log n), trung vị O(1). <em>("two invariants")</em>'],
  ['N', 'Nêu mốc, gọi tên chỗ phí ("em không cần thứ tự đầy đủ"), rồi tới bất biến. Bất biến là thứ người phỏng vấn sẽ dùng để soát code của bạn.'],
  ['I', 'Code đi.'],
  ['C', '(đang code) Định tuyến bằng cách so với đỉnh lo, kiểm rỗng trước… rồi một bước cân bằng, if / else if, vì định tuyến chỉ lệch được tối đa một… Trường hợp chẵn em trả trung bình hai đỉnh — trong Java em ép sang double trước khi cộng để tránh tràn số. Chạy tay 5, 15, 1, 3: trung vị 5, 10, 5, 4 — sau số 3, lo có ba phần tử nên 5 chuyển sang hi. Đúng.'],
  ['N', 'Lượt chạy tay được chọn để kích hoạt một lần cân bằng. Tự nhắc chuyện ép kiểu chống tràn số mà không đợi hỏi là một tín hiệu rất mạnh.'],
  ['I', 'Nếu 99% số nằm trong khoảng 0 tới 100 thì sao?'],
  ['C', 'Khi đó mảng đếm 101 ô xử lý gần như mọi thứ trong O(1), cộng hai bộ đếm cho số dưới 0 và trên 100; trung vị gần như luôn nằm trong các ô, còn nếu không thì em lùi về hai heap nhỏ cho phần ngoại lai. <em>("a count array of 101 buckets")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Both heaps as min-heaps (forgetting to flip the comparator for <code>lo</code>) — the "top of lo" is then the <em>smallest</em> of the small half.</li>
<li>Rebalancing by size only, without routing by value: sizes are right but the order invariant breaks (a big number ends up in lo).</li>
<li>Reading <code>peek()</code> of an empty heap on the first insertion.</li>
<li>Integer overflow or integer division in the average: <code>(a + b) / 2</code> in Java truncates <em>and</em> can overflow.</li>
<li>In the sliding version, removing with <code>PriorityQueue.remove(Object)</code> and calling it O(log k) — it is O(k).</li>
<li>Reaching for two heaps when the data is static and queried once — sort (or quickselect) is simpler and faster.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Cả hai heap đều là min-heap (quên đảo comparator cho <code>lo</code>) — "đỉnh của lo" khi đó lại là số <em>nhỏ</em> nhất của nửa nhỏ.</li>
<li>Chỉ cân bằng theo kích thước mà không định tuyến theo giá trị: kích thước đúng nhưng bất biến thứ tự bị phá (một số lớn lọt vào lo).</li>
<li>Đọc <code>peek()</code> của heap rỗng ngay lần thêm đầu tiên.</li>
<li>Tràn số hoặc chia nguyên khi lấy trung bình: <code>(a + b) / 2</code> trong Java vừa cắt phần thập phân <em>vừa</em> có thể tràn.</li>
<li>Ở bản cửa sổ trượt, gỡ bằng <code>PriorityQueue.remove(Object)</code> rồi nói nó O(log k) — thực ra là O(k).</li>
<li>Vớ ngay hai heap khi dữ liệu đứng yên và chỉ hỏi một lần — sắp xếp (hoặc quickselect) đơn giản và nhanh hơn.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Đề cuối (LC 4) cố ý đặt vào để luyện phản xạ "đừng thấy chữ median là vớ heap": hai mảng đã sắp xếp ⇒ tìm nhị phân, ôn ở <a href="${baiNay('dsa-4-1-co-ban')}">bài 4.1</a>. Bài toán khoảng (meeting rooms) dùng heap theo một kiểu khác nữa ở <a href="${baiNay('dsa-6-3-khoang')}">bài 6.3</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>From memory, write <code>MedianFinder</code> in your interview language using your own heap (TS) or <code>PriorityQueue</code> (Java). Run it on <code>5, 15, 1, 3, 8, 7, 9, 10</code>: the medians must be 5, 10, 5, 4, 5, 6, 7, 7.5.</li>
<li>Draw the two heaps after each of the 8 additions on paper (like the table above) <em>before</em> running the code, then compare.</li>
<li>Submit LC 295. Then, in Java, change the average to <code>(lo.peek() + hi.peek()) / 2.0</code> and explain in one sentence why LC 295 still passes but LC 480 would not.</li>
<li>Bonus: submit LC 480 with lazy deletion and test it against a brute force on random small arrays first.</li>
</ol>
<p><strong>Done when:</strong> LC 295 accepted, your paper trace matches the program, and you can state both invariants without looking.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">median</span><span class="v">Middle of the sorted data; average of the two middles when the count is even.</span></div>
  <div class="kv"><span class="k">two heaps</span><span class="v">A max-heap of the lower half + a min-heap of the upper half; the median sits at the tops.</span></div>
  <div class="kv"><span class="k">invariant</span><span class="v">A property that is true after every operation (order: lo ≤ hi; size: lo = hi or hi + 1).</span></div>
  <div class="kv"><span class="k">rebalance</span><span class="v">Moving one top to the other heap to restore the size invariant.</span></div>
  <div class="kv"><span class="k">lazy deletion</span><span class="v">Mark a value dead in a map; pop it only when it reaches a top.</span></div>
  <div class="kv"><span class="k">percentile (p50, p95)</span><span class="v">Value below which a given share of data falls; p50 = median.</span></div>
  <div class="kv"><span class="k">sketch (histogram, t-digest)</span><span class="v">Small, approximate summary of a huge stream that can answer quantile queries.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Running median = max-heap of the lower half + min-heap of the upper half.</li>
<li>Route by value, then rebalance by size: O(log n) per add, O(1) per median.</li>
<li>Measured: copy+sort per query is n² log n, sorted array + splice is n² (fine for a few thousand), two heaps ≈ n log n.</li>
<li>Sliding window: heaps cannot delete from the middle — use lazy deletion or an ordered multiset.</li>
<li>Two heaps can also play different roles: one gates (locked by capital), one chooses (by profit).</li>
<li>Java averages: widen or halve before adding; static data queried once ⇒ just sort.</li>
</ul>
${nguon('📙', 'Java TreeMap (Java SE 21 API)', 'Ordered map for the multiset version of Sliding Window Median: floorKey, ceilingKey, pollFirstEntry', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html')}
${nguon('📈', 'Prometheus — Histograms and summaries', 'How production systems estimate p50/p99 from a stream without keeping every value', 'https://prometheus.io/docs/practices/histograms/')}
${nguon('📄', 'Computing Extremely Accurate Quantiles Using t-Digests (Dunning, Ertl)', 'The sketch behind many "approximate percentile" functions', 'https://arxiv.org/abs/1902.04023')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Từ trí nhớ, viết <code>MedianFinder</code> bằng ngôn ngữ phỏng vấn của bạn, dùng heap tự viết (TS) hoặc <code>PriorityQueue</code> (Java). Chạy với <code>5, 15, 1, 3, 8, 7, 9, 10</code>: trung vị phải là 5, 10, 5, 4, 5, 6, 7, 7.5.</li>
<li>Vẽ hai heap sau mỗi lần trong 8 lần thêm ra giấy (như bảng ở trên) <em>trước khi</em> chạy code, rồi so.</li>
<li>Nộp LC 295. Sau đó trong Java, đổi phép trung bình thành <code>(lo.peek() + hi.peek()) / 2.0</code> và giải thích trong một câu vì sao LC 295 vẫn qua mà LC 480 thì không.</li>
<li>Thêm: nộp LC 480 bằng xoá lười, và kiểm nó với bản vét cạn trên các mảng nhỏ ngẫu nhiên trước.</li>
</ol>
<p><strong>Đạt khi:</strong> LC 295 Accepted, bảng vẽ tay khớp với chương trình, và bạn nói được cả hai bất biến mà không nhìn bài.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">median (trung vị)</span><span class="v">Giá trị giữa của dữ liệu đã sắp; số lượng chẵn thì lấy trung bình hai giá trị giữa.</span></div>
  <div class="kv"><span class="k">two heaps (hai heap)</span><span class="v">Max-heap nửa dưới + min-heap nửa trên; trung vị nằm ở hai đỉnh.</span></div>
  <div class="kv"><span class="k">invariant (bất biến)</span><span class="v">Tính chất luôn đúng sau mọi thao tác (thứ tự: lo ≤ hi; kích thước: lo = hi hoặc hi + 1).</span></div>
  <div class="kv"><span class="k">rebalance (cân bằng lại)</span><span class="v">Chuyển một đỉnh sang heap kia để khôi phục bất biến kích thước.</span></div>
  <div class="kv"><span class="k">lazy deletion (xoá lười)</span><span class="v">Đánh dấu giá trị đã chết trong một map; chỉ pop khi nó trồi lên đỉnh.</span></div>
  <div class="kv"><span class="k">percentile (phân vị: p50, p95)</span><span class="v">Giá trị mà một tỉ lệ dữ liệu cho trước nằm dưới nó; p50 = trung vị.</span></div>
  <div class="kv"><span class="k">sketch (bản phác thảo: histogram, t-digest)</span><span class="v">Bản tóm tắt nhỏ, xấp xỉ của một luồng khổng lồ, trả lời được câu hỏi phân vị.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Trung vị động = max-heap nửa dưới + min-heap nửa trên.</li>
<li>Định tuyến theo giá trị, rồi cân bằng theo kích thước: O(log n) mỗi lần thêm, O(1) mỗi lần hỏi trung vị.</li>
<li>Đo thật: sao chép + sắp mỗi lần hỏi là n² log n, mảng đã sắp + splice là n² (ổn với vài nghìn phần tử), hai heap ≈ n log n.</li>
<li>Cửa sổ trượt: heap không xoá được ở giữa — dùng xoá lười hoặc multiset có thứ tự.</li>
<li>Hai heap cũng có thể đóng hai vai khác nhau: một heap gác cửa (khoá theo vốn), một heap chọn (theo lợi nhuận).</li>
<li>Trung bình trong Java: nới kiểu hoặc chia đôi trước khi cộng; dữ liệu đứng yên chỉ hỏi một lần ⇒ cứ sắp xếp.</li>
</ul>
${nguon('📙', 'Java TreeMap (Java SE 21 API)', 'Map có thứ tự cho bản multiset của Sliding Window Median: floorKey, ceilingKey, pollFirstEntry', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html')}
${nguon('📈', 'Prometheus — Histograms and summaries', 'Cách hệ thống thật ước lượng p50/p99 từ một luồng mà không giữ mọi giá trị', 'https://prometheus.io/docs/practices/histograms/')}
${nguon('📄', 'Computing Extremely Accurate Quantiles Using t-Digests (Dunning, Ertl)', 'Bản phác thảo đứng sau nhiều hàm "phân vị xấp xỉ"', 'https://arxiv.org/abs/1902.04023')}
</div>
`,
};
