/** 1.3 — Sắp xếp làm công cụ. Mã/output: ../ma/ch01/sort-* và Sort*.java (Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay, lienKet } from '../_chung.mjs';
import { vetMergeIntervals } from '../ma/ch01/sort-merge-intervals.vet.mjs';
import { vetTopKBucket } from '../ma/ch01/sort-top-k.vet.mjs';
import { bangDo, hang, so, lan } from './_rieng.mjs';

const IV = [[1, 3], [8, 10], [2, 6], [15, 18], [9, 12], [10, 11]];
const VM = vetMergeIntervals(IV);
const BANG_MERGE = bangVet(['#', 'current', 'last merged (before)', 'decision', 'merged (after)'],
  VM.hang.map((h, i) => [String(i), `<code>${h.cur}</code>`, `<code>${h.lastTruoc}</code>`,
    h.hanhDong.startsWith('new') ? `🆕 ${h.hanhDong}` : `🔗 ${h.hanhDong}`, `<code>${h.out}</code>`]));

const TK = [5, 3, 5, 7, 3, 5, 9, 3, 7, 5];
const VT = vetTopKBucket(TK, 2);
const BANG_TOPK = bangVet(['step', 'action', 'non-empty buckets (frequency: values)', 'answer'],
  VT.hang.map((h, i) => [String(i + 1), h.buoc, `<code>${h.xo}</code>`, `<code>${h.out}</code>`]));

// Số đo đọc từ .out. TS: sort(a-b) | Int32Array | topK sort | topK bucket · Java: Integer[] | int[] | topK sort | topK bucket.
const SN = bangDo('ch01/sort-do.ts'), SJ = bangDo('ch01/SortDo.java');
const [t5, t6, k5, k6] = [hang(SN, 100000), hang(SN, 1000000), hang(SJ, 100000), hang(SJ, 1000000)];
const do13 = (L) => ({
  cmp: so(t6[0], 1, L), typed: so(t6[1], 1, L), rTyped: lan(t6[0], t6[1], L),
  box: so(k6[0], 1, L), prim: so(k6[1], 1, L), rPrim: lan(k6[0], k6[1], L),
  g: lan(t6[0], t5[0], L),
  ns: so(t6[2], 1, L), nb: so(t6[3], 1, L), js: so(k6[2], 1, L), jb: so(k6[3], 1, L),
  nWin: t6[3] < t6[2] ? 'bucket' : 'sort', jWin: k6[3] < k6[2] ? 'bucket' : 'sort',
  nR: t6[3] < t6[2] ? lan(t6[2], t6[3], L) : lan(t6[3], t6[2], L),
  jR: k6[3] < k6[2] ? lan(k6[2], k6[3], L) : lan(k6[3], k6[2], L),
});
const E = do13('en'), V = do13('vi');
const thang = (w, L) => (L === 'en' ? (w === 'bucket' ? 'the bucket version' : 'the sort version') : (w === 'bucket' ? 'bản xô' : 'bản sắp xếp'));
const ketLuan = (L) => {
  const x = L === 'en' ? E : V;
  return L === 'en'
    ? `At n = 10⁶ Node took ${x.ns} ms (sort) vs ${x.nb} ms (bucket): ${thang(x.nWin, 'en')} was faster, by about ${x.nR}×. Java took ${x.js} ms vs ${x.jb} ms: ${thang(x.jWin, 'en')} was faster, by about ${x.jR}×.`
    : `Ở n = 10⁶, Node mất ${x.ns} ms (sắp xếp) so với ${x.nb} ms (xô): ${thang(x.nWin, 'vi')} nhanh hơn, khoảng ${x.nR} lần. Java mất ${x.js} ms so với ${x.jb} ms: ${thang(x.jWin, 'vi')} nhanh hơn, khoảng ${x.jR} lần.`;
};

const DE = [
  [lc(1051, 'height-checker', 'Height Checker', 'Easy'), 'Sort a copy, compare position by position. Two minutes — warm-up for "sort a copy, not the input".', 'Sắp một bản sao, so từng vị trí. Hai phút — khởi động cho thói quen "sắp bản sao, không sắp đầu vào".'],
  [lc(1636, 'sort-array-by-increasing-frequency', 'Sort Array by Increasing Frequency', 'Easy'), 'Two-key comparator: frequency up, then value down.', 'Comparator hai khoá: tần suất tăng, rồi giá trị giảm.'],
  [lc(56, 'merge-intervals', 'Merge Intervals', 'Medium'), 'Sort by start, then extend or start a new interval. Chapter 6 goes deeper.', 'Sắp theo điểm đầu, rồi nới hoặc mở khoảng mới. Chương 6 đi sâu hơn.'],
  [lc(347, 'top-k-frequent-elements', 'Top K Frequent Elements', 'Medium'), 'Count, then sort by count — or bucket by count for O(n).', 'Đếm, rồi sắp theo số lần — hoặc bỏ vào xô theo số lần để được O(n).'],
  [lc(451, 'sort-characters-by-frequency', 'Sort Characters By Frequency', 'Medium'), 'Same as 347 on characters; the output is the whole string.', 'Giống 347 nhưng trên ký tự; đầu ra là cả chuỗi.'],
  [lc(75, 'sort-colors', 'Sort Colors', 'Medium'), 'Three values ⇒ counting sort; the one-pass version is two pointers (Chapter 2).', 'Chỉ ba giá trị ⇒ sắp xếp đếm; bản một lượt là hai con trỏ (Chương 2).'],
  [lc(179, 'largest-number', 'Largest Number', 'Medium'), 'The comparator IS the problem: a before b iff a+b &gt; b+a as strings.', 'Comparator CHÍNH LÀ cả bài: a đứng trước b khi a+b &gt; b+a (so chuỗi).'],
  [lc(274, 'h-index', 'H-Index', 'Medium'), 'Sort descending and walk, or count with buckets capped at n.', 'Sắp giảm dần rồi đi, hoặc đếm bằng xô chặn trần ở n.'],
  [lc(452, 'minimum-number-of-arrows-to-burst-balloons', 'Minimum Number of Arrows to Burst Balloons', 'Medium'), 'Sort by end. Values reach ±2³¹: the Java comparator a[1] − b[1] overflows — use Integer.compare.', 'Sắp theo điểm cuối. Giá trị tới ±2³¹: comparator a[1] − b[1] của Java bị tràn — dùng Integer.compare.'],
  [lc(973, 'k-closest-points-to-origin', 'K Closest Points to Origin', 'Medium'), 'Sort by squared distance (no sqrt needed); Chapter 6 does it with a heap of size k.', 'Sắp theo bình phương khoảng cách (không cần căn); Chương 6 làm bằng heap cỡ k.'],
];

export default {
  title: '1.3 — Sorting as a tool: comparators, stability and top-k|||1.3 — Sắp xếp làm công cụ: comparator, tính ổn định và top-k',
  slug: 'dsa-1-3-sap-xep',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Sắp trước rồi quét (gộp khoảng), comparator đúng trong TS và Java (bẫy sort() so chuỗi, a − b tràn số), sắp ổn định, top-k bằng sắp xếp so với xô theo tần suất — kèm số đo thật và góc kẻ xấu ORDER BY.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Sorting as a tool: comparators, stability and top-k</h2>
<p class="lead">You will almost never be asked to <em>implement</em> a sort in an interview. You will very often be expected to <strong>use</strong> one: sort first, and a messy problem becomes a single left-to-right scan. Sorting costs O(n log n) — for n = 10⁵ that is about 1.7 million comparisons, a few milliseconds — and in exchange it puts related things next to each other. This lesson is about that trade, about writing comparators that are actually correct in TypeScript and Java (both languages have a trap that has failed real candidates), about stability, and about the classic "top k" question where sorting is the good first answer and a bucket sort is the better second one.</p>

<h3>The everyday picture: the exam papers on the lecturer's desk</h3>
<p>After an exam, the lecturer has 120 papers in random order and a class list sorted by student ID. Entering marks paper by paper means searching the list for each name — 120 searches. Instead, she first sorts the pile by student ID; then she walks down the pile and the list together, one line at a time. Sorting once made every later step trivial. The same move finds the two students who wrote the same name on their papers (after sorting by name they sit next to each other) and gives "the 10 best papers" (the top of the sorted pile).</p>
<p>That is what a sort buys you, in general:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Equal things become adjacent</span><span class="lz-d">Duplicates, groups, anagrams (Lesson 1.1's sorted-letters key) — compare each element with its neighbour only.</span></div>
  <div class="lz-node"><span class="lz-t">Overlaps become neighbours</span><span class="lz-d">Sorted by start, an interval can only overlap the ones right before it: merge intervals, meeting rooms (Chapter 6).</span></div>
  <div class="lz-node"><span class="lz-t">Order becomes position</span><span class="lz-d">The k largest are the last k; the median is the middle; "the h-th best" is index h.</span></div>
  <div class="lz-node"><span class="lz-t">Two pointers and binary search open up</span><span class="lz-d">Pairs with a sum from both ends (Chapter 2); "first element ≥ x" in O(log n) (Chapter 4).</span></div>
  <div class="lz-node"><span class="lz-t">The price</span><span class="lz-d">O(n log n) time, the original order is lost (sort a copy if you need it), and you must write a correct comparator.</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Sắp xếp làm công cụ: comparator, tính ổn định và top-k</h2>
<p class="lead">Khi phỏng vấn, gần như không bao giờ bạn bị bắt <em>cài đặt</em> một thuật toán sắp xếp. Nhưng rất thường xuyên bạn được kỳ vọng <strong>dùng</strong> nó: sắp trước, và một đề rối rắm biến thành một lượt quét từ trái sang phải. Sắp xếp tốn O(n log n) — với n = 10⁵ là khoảng 1,7 triệu phép so sánh, vài mili-giây — và đổi lại nó đặt những thứ liên quan đứng cạnh nhau. Bài này nói về cuộc đổi chác đó, về cách viết comparator (hàm so sánh) thật sự đúng trong TypeScript và Java (cả hai ngôn ngữ đều có một cái bẫy từng đánh trượt ứng viên thật), về tính ổn định, và về câu hỏi "top k" kinh điển — nơi sắp xếp là câu trả lời đầu tiên tốt, còn sắp xếp theo xô là câu trả lời thứ hai tốt hơn.</p>

<h3>Hình dung đời thường: chồng bài thi trên bàn giảng viên</h3>
<p>Thi xong, cô giáo có 120 bài thi xếp lộn xộn và một danh sách lớp sắp theo mã sinh viên. Nhập điểm từng bài một nghĩa là mỗi bài lại dò danh sách tìm tên — 120 lần dò. Thay vào đó, cô sắp chồng bài theo mã sinh viên trước; rồi cô đi dọc chồng bài và danh sách cùng lúc, mỗi lần một dòng. Sắp một lần làm mọi bước sau trở nên hiển nhiên. Cùng nước đi đó tìm ra hai bạn ghi trùng tên trên bài (sắp theo tên thì hai bạn đứng cạnh nhau) và cho ra "10 bài điểm cao nhất" (phần đầu của chồng đã sắp).</p>
<p>Nói chung, đây là những gì một lần sắp xếp mua được cho bạn:</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Thứ bằng nhau đứng cạnh nhau</span><span class="lz-d">Phần tử trùng, nhóm, anagram (khoá "chữ đã sắp" của bài 1.1) — chỉ cần so mỗi phần tử với hàng xóm của nó.</span></div>
  <div class="lz-node"><span class="lz-t">Khoảng chồng nhau thành hàng xóm</span><span class="lz-d">Sắp theo điểm đầu, một khoảng chỉ có thể chồng lên những khoảng ngay trước nó: gộp khoảng, phòng họp (Chương 6).</span></div>
  <div class="lz-node"><span class="lz-t">Thứ hạng thành vị trí</span><span class="lz-d">k phần tử lớn nhất là k phần tử cuối; trung vị nằm giữa; "người giỏi thứ h" là chỉ số h.</span></div>
  <div class="lz-node"><span class="lz-t">Mở đường cho hai con trỏ và tìm nhị phân</span><span class="lz-d">Cặp có tổng cho trước, đi từ hai đầu (Chương 2); "phần tử đầu tiên ≥ x" trong O(log n) (Chương 4).</span></div>
  <div class="lz-node"><span class="lz-t">Cái giá</span><span class="lz-d">O(n log n) thời gian, mất thứ tự ban đầu (cần thì sắp một bản sao), và bạn phải viết comparator đúng.</span></div>
</div>
${csd('csd201-so-sanh-sap-xep', 'vi', '6.7 Chọn thuật toán sắp xếp: bảng so sánh đầy đủ', '<p>CSD201 đã cài từng thuật toán (chèn, chọn, quick, merge, heap) và lập bảng so sánh độ phức tạp, tính ổn định, bộ nhớ. Ôn nhanh: sắp xếp dựa trên so sánh không thể nhanh hơn O(n log n) trong trường hợp xấu nhất. <strong>Ở đây đi sâu thêm:</strong> hàm sort CÓ SẴN của TypeScript và Java thật sự là thuật toán nào, viết comparator không bẫy, khi nào tính ổn định cứu bạn, và khi nào bỏ hẳn phép so sánh để được O(n).</p>')}
</div>

<div class="ml-en">
<h3>Signals: when "sort first" is the move</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">intervals, meetings, bookings, "overlap"</span><span class="v">Sort by start (or end) and scan. Lesson 6.3 has the full family.</span></div>
  <div class="kv"><span class="k">"the k largest / smallest / most frequent"</span><span class="v">Sorting is the O(n log n) first answer; bucket by count gives O(n); a heap gives O(n log k) (Chapter 6).</span></div>
  <div class="kv"><span class="k">"arrange so that…", "the largest number you can form"</span><span class="v">A custom comparator does all the work; prove it is consistent.</span></div>
  <div class="kv"><span class="k">pairs / triplets with a sum, and the indices do not matter</span><span class="v">Sort, then two pointers from both ends (Chapter 2) — O(1) extra memory instead of a hash map.</span></div>
  <div class="kv"><span class="k">"assign greedily", "minimum number of …"</span><span class="v">Most greedy algorithms start with a sort; the hard part is the sort key and why it is safe.</span></div>
  <div class="kv"><span class="k">small value range (colours, ages, grades 0–10)</span><span class="v">Skip comparisons: a counting sort is O(n + range).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào "sắp trước" là nước đi đúng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">khoảng, lịch họp, đặt chỗ, "chồng nhau"</span><span class="v">Sắp theo điểm đầu (hoặc điểm cuối) rồi quét. Bài 6.3 có trọn họ đề này.</span></div>
  <div class="kv"><span class="k">"k phần tử lớn nhất / nhỏ nhất / xuất hiện nhiều nhất"</span><span class="v">Sắp xếp là câu trả lời đầu tiên O(n log n); xô theo số lần cho O(n); heap cho O(n log k) (Chương 6).</span></div>
  <div class="kv"><span class="k">"sắp xếp sao cho…", "số lớn nhất ghép được"</span><span class="v">Một comparator tự viết làm hết việc; phải chứng minh nó nhất quán.</span></div>
  <div class="kv"><span class="k">cặp / bộ ba có tổng cho trước, và không cần chỉ số gốc</span><span class="v">Sắp, rồi hai con trỏ từ hai đầu (Chương 2) — O(1) bộ nhớ phụ thay vì một hash map.</span></div>
  <div class="kv"><span class="k">"phân công tham lam", "số … ít nhất"</span><span class="v">Đa số thuật toán tham lam (greedy) mở đầu bằng một lần sắp; phần khó là chọn khoá sắp và giải thích vì sao an toàn.</span></div>
  <div class="kv"><span class="k">giá trị nằm trong khoảng nhỏ (màu, tuổi, điểm 0–10)</span><span class="v">Bỏ qua phép so sánh: sắp xếp đếm (counting sort) là O(n + khoảng giá trị).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Sort + scan: Merge Intervals (LC 56)</h3>
<p><strong>Problem (in our words).</strong> You get a list of time ranges <code>[start, end]</code> in any order. Merge every group of overlapping ranges into one and return the result. Example: <code>[[1, 3], [2, 6], [8, 10]]</code> → <code>[[1, 6], [8, 10]]</code>. We only touch this problem lightly here — Lesson 6.3 covers the whole interval family — because it is the cleanest example of "sorting turns a hard problem into a scan".</p>
<p><strong>Brute force:</strong> repeatedly look for any two overlapping ranges and merge them until nothing changes — O(n²) comparisons per round, up to n rounds. <strong>Insight:</strong> after sorting by start, a range can only overlap the merged range that ends <em>last so far</em>; everything before it ended earlier. So one scan decides, for each range, "extend the last merged range" or "start a new one". Total: O(n log n) for the sort + O(n) for the scan.</p>
</div>
<div class="ml-vi">
<h3>Sắp + quét: Merge Intervals (LC 56)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn nhận một danh sách khoảng thời gian <code>[start, end]</code> theo thứ tự bất kỳ. Gộp mọi nhóm khoảng chồng nhau thành một và trả về kết quả. Ví dụ: <code>[[1, 3], [2, 6], [8, 10]]</code> → <code>[[1, 6], [8, 10]]</code>. Ở đây ta chỉ chạm nhẹ vào đề này — bài 6.3 lo trọn họ đề khoảng — vì nó là ví dụ sạch nhất cho câu "sắp xếp biến một bài khó thành một lượt quét".</p>
<p><strong>Vét cạn:</strong> cứ tìm hai khoảng bất kỳ chồng nhau thì gộp, lặp tới khi không còn gì đổi — O(n²) phép so mỗi vòng, tới n vòng. <strong>Ý chính:</strong> sau khi sắp theo điểm đầu, một khoảng chỉ có thể chồng lên khoảng đã gộp có điểm cuối <em>xa nhất tính tới lúc đó</em>; mọi thứ trước nữa đều đã kết thúc sớm hơn. Vậy một lượt quét quyết định, với mỗi khoảng, "nới khoảng đã gộp cuối cùng" hay "mở một khoảng mới". Tổng: O(n log n) cho phép sắp + O(n) cho lượt quét.</p>
</div>
${maHai('ch01/sort-merge-intervals.ts', 'ch01/SortMergeIntervals.java', { vung: 'merge' })}
${ketQua('ch01/sort-merge-intervals.ts')}
${ketQua('ch01/SortMergeIntervals.java')}
<div class="ml-en">
<p>The trace for the first case, generated by running the code. After sorting, the input order is <code>${VM.sorted.map((x) => `[${x.join(', ')}]`).join(' ')}</code>:</p>
</div>
<div class="ml-vi">
<p>Bảng vết của ca đầu tiên, sinh ra bằng cách chạy mã thật. Sau khi sắp, thứ tự đầu vào là <code>${VM.sorted.map((x) => `[${x.join(', ')}]`).join(' ')}</code>:</p>
</div>
${BANG_MERGE}
<div class="ml-en">
<p>Two details in this trace are exactly the bugs interviewers watch for. Row 4: <code>[10, 11]</code> lies <em>inside</em> <code>[8, 12]</code>, so the end must stay 12 — writing <code>last[1] = end</code> instead of <code>Math.max(last[1], end)</code> would shrink it to 11. And the second test case <code>[[1, 4], [4, 5]]</code> merged into <code>[1, 5]</code> because we used <code>start &lt;= last end</code>: touching ranges count as overlapping in this problem. If the problem said "half-open ranges, touching is fine" (like room bookings 8:00–10:00 and 10:00–12:00), the condition becomes <code>&lt;</code>. Ask which one it is.</p>
${moPhong('ch01/sort-merge-intervals.sim.js', 'en', 'Merge Intervals — sort, then extend or start new', 'Watch the sort line the intervals up, then a single scan merge them.')}
</div>
<div class="ml-vi">
<p>Hai chi tiết trong bảng vết này đúng là hai lỗi người phỏng vấn hay canh. Dòng 4: <code>[10, 11]</code> nằm <em>trọn trong</em> <code>[8, 12]</code>, nên điểm cuối phải giữ là 12 — viết <code>last[1] = end</code> thay vì <code>Math.max(last[1], end)</code> sẽ làm nó co lại còn 11. Và ca test thứ hai <code>[[1, 4], [4, 5]]</code> gộp thành <code>[1, 5]</code> vì ta dùng <code>start &lt;= điểm cuối</code>: trong đề này hai khoảng chạm nhau vẫn tính là chồng. Nếu đề nói "khoảng nửa mở, chạm nhau thì không sao" (như đặt phòng 8:00–10:00 và 10:00–12:00), điều kiện thành <code>&lt;</code>. Hãy hỏi rõ là loại nào.</p>
${moPhong('ch01/sort-merge-intervals.sim.js', 'vi', 'Merge Intervals — sắp, rồi nới hoặc mở khoảng mới', 'Xem phép sắp xếp xếp hàng các khoảng, rồi một lượt quét duy nhất gộp chúng lại.')}
${lienKet({ bai: 'dsa-6-3-khoang', title: '6.3 — Khoảng: gộp, chèn, phòng họp, đường quét', sub: 'Trọn họ đề intervals — sắp theo đầu hay theo cuối, và vì sao', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Comparators in TypeScript: the trap that sorts 10 before 9</h3>
<p>A <strong>comparator</strong> (comparison function) is a function <code>(a, b) =&gt; number</code>: negative means "a goes first", positive means "b goes first", zero means "equal for sorting". JavaScript's <code>Array.prototype.sort()</code> called <em>without</em> a comparator does something surprising: it converts every element to a <strong>string</strong> and compares the strings. Run it:</p>
</div>
<div class="ml-vi">
<h3>Comparator trong TypeScript: cái bẫy xếp 10 đứng trước 9</h3>
<p><strong>Comparator</strong> (hàm so sánh) là một hàm <code>(a, b) =&gt; number</code>: âm nghĩa là "a đứng trước", dương nghĩa là "b đứng trước", bằng 0 nghĩa là "coi như bằng nhau khi sắp". <code>Array.prototype.sort()</code> của JavaScript khi gọi <em>không có</em> comparator làm một việc bất ngờ: nó đổi mọi phần tử thành <strong>chuỗi</strong> rồi so các chuỗi. Chạy thử:</p>
</div>
${ma('ch01/sort-so-sanh.ts', { vung: 'macdinh', nhan: 'TypeScript' })}
${ma('ch01/sort-so-sanh.ts', { vung: 'boolean', nhan: 'TypeScript — wrong comparator' })}
${ma('ch01/sort-so-sanh.ts', { vung: 'taicho', nhan: 'TypeScript — in place vs copy' })}
${ma('ch01/sort-so-sanh.ts', { vung: 'tiengviet', nhan: 'TypeScript — Vietnamese names' })}
${ketQua('ch01/sort-so-sanh.ts')}
<div class="ml-en">
<p>Four lessons in eight lines of output:</p>
<ul>
<li><code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code> because "1" &lt; "10" &lt; "9" as text, character by character. Negative numbers are even worse: <code>[-1, -10, -2, 3]</code>. <strong>Always pass a comparator for numbers</strong>: <code>(a, b) =&gt; a - b</code> ascending, <code>(a, b) =&gt; b - a</code> descending. (In JavaScript <code>a - b</code> cannot overflow — numbers are 64-bit floats — but see the Java section.)</li>
<li>A comparator that returns a boolean, <code>(a, b) =&gt; a &gt; b</code>, is a classic copy-from-another-language bug. <code>true</code> becomes 1 and <code>false</code> becomes 0 — it never says "a goes first", and V8 left <code>[5, 1, 4, 2, 3]</code> completely unsorted, without any error.</li>
<li><code>sort()</code> sorts <strong>in place</strong> and returns the same array (the <code>true</code> in the output). If the caller still needs the original order — or the input is a parameter you do not own — use <code>toSorted()</code> (ES2023) or <code>[...arr].sort(…)</code>. Our <code>merge</code> above sorts a copy for that reason.</li>
<li>Default string order is by UTF-16 code unit: a name that starts with an accented capital A (U+00C1) lands after every unaccented letter, and a name that starts with the Vietnamese D-with-stroke (U+0110) goes last. For human names use <code>localeCompare(b, 'vi')</code>, which knows that the accented A sorts with A and D-with-stroke comes right after D.</li>
</ul>
<p>The last point is not academic: this website's friends list for its one-on-one duel game sorts with <code>.sort((a, b) =&gt; Number(b.online) - Number(a.online) || a.ten.localeCompare(b.ten, 'vi'))</code> (in <code>src/services/doiKhang/doiKhang.service.ts</code>) — online friends first, then by Vietnamese name. Note the <code>||</code>: when the first key gives 0 (both online or both offline), the second key decides. That is how you chain keys in one comparator. And the opposite case exists too: the payOS webhook check in <code>src/config/payos.ts</code> builds its signature from <code>Object.keys(data).sort()</code> — there the default string order is exactly what the payment provider specifies (keys in alphabetical order), and "fixing" it with a locale-aware comparator would break every signature.</p>
</div>
<div class="ml-vi">
<p>Bốn bài học trong tám dòng output:</p>
<ul>
<li><code>[10, 9, 1].sort()</code> cho <code>[1, 10, 9]</code> vì xét như văn bản, so từng ký tự, "1" &lt; "10" &lt; "9". Số âm còn tệ hơn: <code>[-1, -10, -2, 3]</code>. <strong>Sắp số thì luôn truyền comparator</strong>: <code>(a, b) =&gt; a - b</code> tăng dần, <code>(a, b) =&gt; b - a</code> giảm dần. (Trong JavaScript <code>a - b</code> không thể tràn — số là số thực 64 bit — nhưng hãy xem phần Java.)</li>
<li>Comparator trả về boolean, <code>(a, b) =&gt; a &gt; b</code>, là lỗi kinh điển khi chép thói quen từ ngôn ngữ khác. <code>true</code> thành 1, <code>false</code> thành 0 — nó không bao giờ nói "a đứng trước", và V8 để nguyên <code>[5, 1, 4, 2, 3]</code> không sắp chút nào, không báo lỗi gì.</li>
<li><code>sort()</code> sắp <strong>tại chỗ</strong> (in place) và trả về đúng mảng đó (chữ <code>true</code> trong output). Nếu nơi gọi vẫn cần thứ tự gốc — hoặc đầu vào là tham số không phải của bạn — hãy dùng <code>toSorted()</code> (ES2023) hoặc <code>[...arr].sort(…)</code>. Hàm <code>merge</code> ở trên sắp một bản sao chính vì lý do này.</li>
<li>Thứ tự chuỗi mặc định theo mã UTF-16: "Ánh" (Á = U+00C1) đứng sau mọi chữ không dấu, còn "Đức" xuống cuối. Tên người thì dùng <code>localeCompare(b, 'vi')</code>, nó biết Á xếp cùng A và Đ đứng ngay sau D.</li>
</ul>
<p>Điểm cuối không phải chuyện lý thuyết: danh sách bạn bè của trò chơi Đối kháng trên chính trang này sắp bằng <code>.sort((a, b) =&gt; Number(b.online) - Number(a.online) || a.ten.localeCompare(b.ten, 'vi'))</code> (trong <code>src/services/doiKhang/doiKhang.service.ts</code>) — bạn đang online lên trước, rồi theo tên tiếng Việt. Để ý dấu <code>||</code>: khi khoá thứ nhất cho 0 (cùng online hoặc cùng offline), khoá thứ hai quyết định. Đó là cách nối nhiều khoá trong một comparator. Và có cả trường hợp ngược lại: phần kiểm webhook payOS trong <code>src/config/payos.ts</code> dựng chữ ký từ <code>Object.keys(data).sort()</code> — ở đó thứ tự chuỗi mặc định chính là thứ nhà cung cấp thanh toán quy định (khoá theo thứ tự bảng chữ cái), và "sửa" nó bằng một comparator theo ngôn ngữ sẽ làm hỏng mọi chữ ký.</p>
</div>

<div class="ml-en">
<h3>Comparators in Java: <code>int[]</code> has none, and <code>a - b</code> overflows</h3>
<p>Java splits sorting in two. <code>Arrays.sort(int[])</code> sorts primitives ascending with a dual-pivot quicksort and has <strong>no comparator overload</strong> — you cannot sort an <code>int[]</code> descending directly. A comparator needs objects: <code>Integer[]</code>, <code>List&lt;Integer&gt;</code>, or an array of arrays such as <code>int[][]</code> (each row is an object). Object sorts use TimSort, a stable merge sort.</p>
<p>The famous trap is the comparator <code>(a, b) -&gt; a - b</code>. In Java, <code>int</code> subtraction overflows: 2,000,000,000 − (−2,000,000,000) is 4·10⁹, which does not fit and wraps to a <em>negative</em> number — so the comparator claims 2·10⁹ is smaller than −2·10⁹:</p>
</div>
<div class="ml-vi">
<h3>Comparator trong Java: <code>int[]</code> không nhận comparator, và <code>a - b</code> bị tràn</h3>
<p>Java chia việc sắp xếp làm hai. <code>Arrays.sort(int[])</code> sắp kiểu nguyên thuỷ (primitive) tăng dần bằng dual-pivot quicksort và <strong>không có bản nhận comparator</strong> — bạn không thể sắp trực tiếp một <code>int[]</code> giảm dần. Comparator cần đối tượng: <code>Integer[]</code>, <code>List&lt;Integer&gt;</code>, hoặc mảng của mảng như <code>int[][]</code> (mỗi hàng là một đối tượng). Sắp đối tượng dùng TimSort, một biến thể ổn định của merge sort.</p>
<p>Cái bẫy nổi tiếng là comparator <code>(a, b) -&gt; a - b</code>. Trong Java, phép trừ <code>int</code> bị tràn: 2.000.000.000 − (−2.000.000.000) là 4·10⁹, không vừa nên quay vòng thành một số <em>âm</em> — thế là comparator khẳng định 2·10⁹ nhỏ hơn −2·10⁹:</p>
</div>
${ma('ch01/SortSoSanh.java', { vung: 'nguyenthuy', nhan: 'Java' })}
${ma('ch01/SortSoSanh.java', { vung: 'transo', nhan: 'Java — the overflow' })}
${ma('ch01/SortSoSanh.java', { vung: 'mang2', nhan: 'Java — int[][]' })}
${ketQua('ch01/SortSoSanh.java')}
<div class="ml-en">
<p>With <code>p - q</code> the "sorted" array came out <code>[2000000000, -2000000000, 0]</code> — not even reversed, just wrong, because the overflowed comparator is no longer a consistent order. With <code>Integer.compare(p, q)</code> it is correct. On LeetCode this is not hypothetical: LC 452 (Minimum Number of Arrows to Burst Balloons) has coordinates from −2³¹ to 2³¹ − 1 precisely so that <code>a[1] - b[1]</code> fails. The rule: in Java, write <code>Integer.compare</code>, <code>Long.compare</code>, or <code>Comparator.comparingInt(…)</code>, never a subtraction — unless you can say out loud why the values are small. For descending order on objects: <code>Collections.reverseOrder()</code> or <code>comparator.reversed()</code>; for an <code>int[]</code>: sort ascending and read it from the end.</p>
</div>
<div class="ml-vi">
<p>Với <code>p - q</code>, mảng "đã sắp" ra <code>[2000000000, -2000000000, 0]</code> — thậm chí không phải bị đảo ngược, mà sai hẳn, vì comparator đã tràn thì không còn là một thứ tự nhất quán nữa. Với <code>Integer.compare(p, q)</code> thì đúng. Trên LeetCode chuyện này không phải giả định: LC 452 (Minimum Number of Arrows to Burst Balloons) cho toạ độ từ −2³¹ tới 2³¹ − 1 chính là để <code>a[1] - b[1]</code> sai. Quy tắc: trong Java hãy viết <code>Integer.compare</code>, <code>Long.compare</code> hoặc <code>Comparator.comparingInt(…)</code>, không bao giờ dùng phép trừ — trừ khi bạn nói to được vì sao giá trị nhỏ. Sắp giảm dần với đối tượng: <code>Collections.reverseOrder()</code> hoặc <code>comparator.reversed()</code>; với <code>int[]</code>: sắp tăng dần rồi đọc từ cuối.</p>
</div>

<div class="ml-en">
<h3>Stability: why "sort by score" keeps your name order</h3>
<p>A sort is <strong>stable</strong> if elements that compare equal keep their original relative order. That sounds minor until you need two keys. Classic case: a class list should be ordered by score (high to low), and students with the same score by name. Two correct ways: one comparator with two keys, or <em>two</em> sorts — first by name, then a <em>stable</em> sort by score, which keeps the name order inside each score. JavaScript's <code>sort</code> has been required to be stable since ES2019 (V8 switched to TimSort in 2018); Java's object sorts are stable. Selection sort, which you may write by hand, is <strong>not</strong>:</p>
</div>
<div class="ml-vi">
<h3>Tính ổn định: vì sao "sắp theo điểm" vẫn giữ thứ tự tên của bạn</h3>
<p>Một phép sắp là <strong>ổn định</strong> (stable) nếu các phần tử so bằng nhau giữ nguyên thứ tự tương đối ban đầu. Nghe nhỏ nhặt cho tới khi bạn cần hai khoá. Ví dụ kinh điển: danh sách lớp xếp theo điểm (cao xuống thấp), bạn nào cùng điểm thì theo tên. Có hai cách đúng: một comparator hai khoá, hoặc <em>hai</em> lần sắp — trước theo tên, rồi sắp <em>ổn định</em> theo điểm, phép sắp này giữ nguyên thứ tự tên bên trong mỗi mức điểm. <code>sort</code> của JavaScript bắt buộc phải ổn định từ ES2019 (V8 chuyển sang TimSort năm 2018); các phép sắp đối tượng của Java đều ổn định. Selection sort (sắp xếp chọn) mà bạn có thể tự viết thì <strong>không</strong>:</p>
</div>
${maHai('ch01/sort-on-dinh.ts', 'ch01/SortOnDinh.java', { vung: 'ondinh' })}
${maHai('ch01/sort-on-dinh.ts', 'ch01/SortOnDinh.java', { vung: 'haikhoa' })}
${maHai('ch01/sort-on-dinh.ts', 'ch01/SortOnDinh.java', { vung: 'chon' })}
${ketQua('ch01/sort-on-dinh.ts')}
<div class="ml-en">
<p>Lines 2 and 3 are identical: "by name, then stably by score" equals the two-key comparator. Line 4 is the hand-written selection sort on the same name-sorted list: Bao now comes before An, and Lan before Duc. The very first swap did it — Chi (9) at index 2 was swapped with An at index 0, and An jumped over Bao. Any sort that swaps far-apart elements (selection sort, quicksort, heap sort) can do this; merge sort and insertion sort do not. Where you meet it at work: a data table where the user clicks "Name" and then "Score" expects the names to stay ordered within each score — that only works if the table's sort is stable. And Java's <code>Arrays.sort(int[])</code> is not stable, which does not matter at all: two equal <code>int</code>s are indistinguishable.</p>
</div>
<div class="ml-vi">
<p>Dòng 2 và dòng 3 giống hệt nhau: "theo tên, rồi ổn định theo điểm" bằng đúng comparator hai khoá. Dòng 4 là selection sort tự viết chạy trên cùng danh sách đã sắp theo tên: giờ Bao đứng trước An, và Lan đứng trước Duc. Chính lần hoán đổi đầu tiên gây ra — Chi (9) ở chỉ số 2 đổi chỗ với An ở chỉ số 0, và An nhảy qua đầu Bao. Mọi thuật toán hoán đổi hai phần tử ở xa nhau (selection sort, quicksort, heap sort) đều có thể làm vậy; merge sort và insertion sort thì không. Bạn gặp nó ở đâu khi đi làm: một bảng dữ liệu mà người dùng bấm cột "Tên" rồi bấm cột "Điểm" sẽ mong tên vẫn đúng thứ tự trong mỗi mức điểm — điều đó chỉ đúng khi phép sắp của bảng là ổn định. Còn <code>Arrays.sort(int[])</code> của Java không ổn định thì chẳng sao cả: hai số <code>int</code> bằng nhau không phân biệt được với nhau.</p>
${csd('csd201-mergesort', 'vi', '6.4 Merge-sort &amp; tính ổn định', '<p>Bài CSD201 chứng minh merge sort ổn định nhờ khi hai bên bằng nhau thì lấy bên trái trước. Ở đây ta dùng tính chất đó như công cụ: sắp nhiều khoá bằng nhiều lần sắp ổn định, và nhận ra thuật toán nào (chọn, quick, heap) làm mất nó.</p>')}
</div>

<div class="ml-en">
<h3>Top k: Top K Frequent Elements (LC 347)</h3>
<p><strong>Problem (in our words).</strong> Given an integer array and k, return the k values that appear most often (any order; the answer is unique). Example: <code>[5, 3, 5, 7, 3, 5, 9, 3, 7, 5], k = 2</code> → 5 appears 4 times, 3 appears 3 times → <code>[5, 3]</code>.</p>
<p><strong>First answer — count, then sort.</strong> Count with a map (Lesson 1.1), sort the (value, count) pairs by count descending, take the first k. O(n) to count + O(m log m) to sort the m distinct values ⇒ O(n log n) worst case. This is a perfectly good first answer: say it, with its complexity.</p>
<p><strong>Better — bucket by count.</strong> The follow-up is usually "can you beat O(n log n)?". Notice that a count is an integer between 1 and n. So use the count itself as an <em>index</em>: <code>bucket[c]</code> holds every value that appears exactly c times. Then walk the buckets from n down to 1 and collect values until you have k. No comparisons at all: O(n) time, O(n) space. This is <strong>bucket sort</strong>, the same idea as counting sort: when the keys are small integers, comparisons are unnecessary.</p>
</div>
<div class="ml-vi">
<h3>Top k: Top K Frequent Elements (LC 347)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho một mảng số nguyên và k, trả về k giá trị xuất hiện nhiều nhất (thứ tự bất kỳ; đáp án là duy nhất). Ví dụ: <code>[5, 3, 5, 7, 3, 5, 9, 3, 7, 5], k = 2</code> → 5 xuất hiện 4 lần, 3 xuất hiện 3 lần → <code>[5, 3]</code>.</p>
<p><strong>Câu trả lời đầu tiên — đếm, rồi sắp.</strong> Đếm bằng map (bài 1.1), sắp các cặp (giá trị, số lần) theo số lần giảm dần, lấy k cặp đầu. O(n) để đếm + O(m log m) để sắp m giá trị khác nhau ⇒ xấu nhất O(n log n). Đây là câu trả lời đầu tiên hoàn toàn ổn: hãy nói nó ra, kèm độ phức tạp.</p>
<p><strong>Tốt hơn — bỏ vào xô theo số lần.</strong> Câu hỏi nối tiếp thường là "có vượt được O(n log n) không?". Để ý rằng số lần xuất hiện là một số nguyên từ 1 tới n. Vậy dùng chính số lần làm <em>chỉ số</em>: <code>bucket[c]</code> chứa mọi giá trị xuất hiện đúng c lần. Rồi đi các xô từ n xuống 1 và gom giá trị tới khi đủ k. Không có phép so sánh nào: O(n) thời gian, O(n) bộ nhớ. Đây là <strong>bucket sort</strong> (sắp xếp theo xô), cùng ý tưởng với sắp xếp đếm (counting sort): khi khoá là số nguyên nhỏ, không cần so sánh.</p>
</div>
${maHai('ch01/sort-top-k.ts', 'ch01/SortTopK.java', { vung: 'sort' })}
${maHai('ch01/sort-top-k.ts', 'ch01/SortTopK.java', { vung: 'bucket' })}
${ketQua('ch01/sort-top-k.ts')}
${ketQua('ch01/SortTopK.java')}
<div class="ml-en">
<p>Here is the bucket version on the example, step by step (counts: ${VT.count.map(([v, c]) => `${v}→${c}`).join(', ')}):</p>
</div>
<div class="ml-vi">
<p>Đây là bản xô chạy trên ví dụ, từng bước (số lần: ${VT.count.map(([v, c]) => `${v}→${c}`).join(', ')}):</p>
</div>
${BANG_TOPK}
<div class="ml-en">
<p>${VT.hang.length} steps: four drops into buckets, then the scan stops after two buckets because k = 2 values are collected. The array has n + 1 = 11 buckets, most of them empty; the scan may pass over empty ones, but there are only n + 1 of them, so it stays O(n). Java uses a <code>LinkedHashMap</code> only so that ties come out in the same order as TypeScript's <code>Map</code>; LeetCode accepts any order.</p>
${moPhong('ch01/sort-top-k.sim.js', 'en', 'Top K Frequent — count, bucket by frequency, scan from the top', 'The bar chart shows each value’s count; watch the values drop into buckets and the top two get picked.')}
</div>
<div class="ml-vi">
<p>${VT.hang.length} bước: bốn lần bỏ vào xô, rồi lượt quét dừng sau hai xô vì đã gom đủ k = 2 giá trị. Mảng có n + 1 = 11 xô, phần lớn rỗng; lượt quét có thể đi qua các xô rỗng, nhưng chỉ có n + 1 xô nên vẫn là O(n). Java dùng <code>LinkedHashMap</code> chỉ để các giá trị hoà nhau ra cùng thứ tự với <code>Map</code> của TypeScript; LeetCode chấp nhận thứ tự bất kỳ.</p>
${moPhong('ch01/sort-top-k.sim.js', 'vi', 'Top K Frequent — đếm, bỏ vào xô theo tần suất, quét từ trên xuống', 'Biểu đồ cột cho số lần của từng giá trị; xem các giá trị rơi vào xô và hai giá trị đầu được chọn.')}
${csd('csd201-sap-xep-tuyen-tinh', 'vi', '6.6 Sắp xếp tuyến tính: bucket &amp; radix', '<p>CSD201 dạy bucket sort và radix sort như thuật toán sắp xếp cho số. Ở đây xô được dùng làm CÔNG CỤ: khoá là tần suất (luôn nằm trong 1…n) nên nó tự thành chỉ số mảng, và O(n log n) rơi xuống O(n).</p>')}
</div>

<div class="ml-en">
<h3>Measured: comparator vs primitive sort, and top-k by sort vs by bucket</h3>
<p>Two questions on the same random data (a fixed generator; about 63 % of the n values are distinct): how much does a comparator cost when sorting n numbers, and does the O(n) bucket really beat the O(n log n) sort for top-k (k = 10)?</p>
</div>
<div class="ml-vi">
<h3>Đo thật: sắp có comparator so với sắp kiểu nguyên thuỷ, và top-k bằng sắp xếp so với bằng xô</h3>
<p>Hai câu hỏi trên cùng dữ liệu ngẫu nhiên (bộ sinh cố định; khoảng 63 % trong n giá trị là khác nhau): sắp n con số mà dùng comparator thì tốn thêm bao nhiêu, và với top-k (k = 10) bản xô O(n) có thật sự thắng bản sắp xếp O(n log n) không?</p>
</div>
${ma('ch01/sort-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch01/sort-do.ts')}
${ketQua('ch01/SortDo.java')}
<div class="ml-en">
<p><strong>Comparators cost real time.</strong> At n = 10⁶, <code>[...a].sort((x, y) =&gt; x - y)</code> took ${E.cmp} ms while <code>Int32Array.from(a).sort()</code> took ${E.typed} ms — about ${E.rTyped}× faster, because a typed array sorts numbers natively without calling a JavaScript function a million times (and, unlike a plain array, it sorts <em>numerically</em> by default). Java shows the same effect: <code>Integer[]</code> with a comparator ${E.box} ms vs <code>int[]</code> ${E.prim} ms (≈${E.rPrim}×) — boxed objects scattered in memory plus a comparator call per comparison. From 10⁵ to 10⁶, n log n predicts the sort to grow about 12× (10 × log 10⁶ / log 10⁵); the comparator sort in Node grew about ${E.g}× here. (Each number is the fastest of five runs on a machine that was also busy with other work: read the ratios, not the third digit.)</p>
<p><strong>Top-k: the gap is far smaller than "n log n vs n" suggests.</strong> ${ketLuan('en')} The theoretical log factor at n = 10⁶ is about 20; the measured gap is much smaller, and on another machine or input it can flip. Both versions share the counting pass over a hash map, which dominates; the difference is only "sort the m distinct counts" against "allocate n + 1 buckets and scan them", and a log factor of about 20 is easily eaten by constants such as allocating a million small arrays. What to say in an interview: "bucket is O(n) and sort is O(n log n); in practice they are close, so I would pick the simpler one unless n is huge, and measure."</p>
</div>
<div class="ml-vi">
<p><strong>Comparator tốn thời gian thật.</strong> Ở n = 10⁶, <code>[...a].sort((x, y) =&gt; x - y)</code> mất ${V.cmp} ms trong khi <code>Int32Array.from(a).sort()</code> mất ${V.typed} ms — nhanh hơn khoảng ${V.rTyped} lần, vì mảng có kiểu (typed array) sắp số bằng mã gốc, không phải gọi một hàm JavaScript cả triệu lần (và, khác mảng thường, nó sắp <em>theo số</em> ngay cả khi không có comparator). Java cho thấy cùng hiệu ứng: <code>Integer[]</code> có comparator ${V.box} ms so với <code>int[]</code> ${V.prim} ms (≈${V.rPrim} lần) — đối tượng đóng hộp nằm rải rác trong bộ nhớ, cộng thêm một lời gọi comparator cho mỗi lần so. Từ 10⁵ lên 10⁶, n log n dự đoán phép sắp tăng khoảng 12 lần (10 × log 10⁶ / log 10⁵); ở đây phép sắp có comparator trên Node tăng khoảng ${V.g} lần. (Mỗi số là lần nhanh nhất trong năm lượt, trên một máy đang bận cả việc khác: hãy đọc các tỉ lệ, đừng đọc chữ số thứ ba.)</p>
<p><strong>Top-k: khoảng cách nhỏ hơn nhiều so với "n log n với n".</strong> ${ketLuan('vi')} Thừa số log trên lý thuyết ở n = 10⁶ là khoảng 20; khoảng cách đo được nhỏ hơn nhiều, và trên máy khác hay dữ liệu khác nó có thể đảo chiều. Cả hai bản dùng chung lượt đếm bằng hash map, và lượt này chiếm phần lớn thời gian; khác biệt chỉ nằm ở "sắp m số lần khác nhau" so với "cấp phát n + 1 xô rồi quét", và một thừa số log cỡ 20 dễ dàng bị các hằng số nuốt mất — ví dụ cấp phát một triệu mảng nhỏ. Nói gì khi phỏng vấn: "bản xô là O(n), bản sắp là O(n log n); thực tế hai bản khá sát nhau, nên em chọn bản đơn giản hơn trừ khi n rất lớn, và em sẽ đo."</p>
</div>

<div class="ml-en">
<h3>Three variants: the comparator, the count, the tiny range</h3>
<p><strong>LC 179 Largest Number</strong> — arrange non-negative integers to form the largest number. Sorting by numeric value fails (<code>[10, 2]</code> must give "210", not "102"); sorting as strings fails too ("3" vs "30": "330" beats "303"). The right comparator compares the two possible concatenations: a goes before b when <code>a + b &gt; b + a</code>. Two edge cases make or break the solution: all zeros must return "0", not "000"; and in an interview, mention that this comparator is a consistent order (it is — it can be shown to be transitive), because an inconsistent comparator gives garbage, as we saw.</p>
<p><strong>LC 274 H-Index</strong> — the largest h such that h papers have at least h citations each. Sort descending and walk while <code>citations[h] ≥ h + 1</code>: O(n log n). Since h can never exceed n, any count above n can be capped at n, and a counting array of size n + 1 gives O(n) — the same "small integer key ⇒ bucket" idea as top-k.</p>
<p><strong>LC 75 Sort Colors</strong> — sort an array of 0s, 1s and 2s in place. Only three values: count them, then rewrite the array — two passes, O(n), O(1) extra memory. The follow-up "in one pass" is the Dutch national flag algorithm with three pointers (Chapter 2).</p>
</div>
<div class="ml-vi">
<h3>Ba đề biến thể: comparator, phép đếm, khoảng giá trị nhỏ</h3>
<p><strong>LC 179 Largest Number</strong> — sắp các số nguyên không âm để ghép thành số lớn nhất. Sắp theo giá trị số thì sai (<code>[10, 2]</code> phải ra "210", không phải "102"); sắp như chuỗi cũng sai ("3" với "30": "330" thắng "303"). Comparator đúng so sánh hai cách ghép có thể: a đứng trước b khi <code>a + b &gt; b + a</code>. Hai ca biên quyết định đúng sai: toàn số 0 phải trả "0" chứ không phải "000"; và khi phỏng vấn, hãy nhắc rằng comparator này là một thứ tự nhất quán (đúng vậy — chứng minh được nó có tính bắc cầu), vì comparator không nhất quán cho kết quả rác, như ta vừa thấy.</p>
<p><strong>LC 274 H-Index</strong> — h lớn nhất sao cho có h bài báo, mỗi bài được trích dẫn ít nhất h lần. Sắp giảm dần rồi đi tiếp khi <code>citations[h] ≥ h + 1</code>: O(n log n). Vì h không bao giờ vượt n, mọi số trích dẫn lớn hơn n có thể chặn trần ở n, và một mảng đếm cỡ n + 1 cho O(n) — cùng ý "khoá là số nguyên nhỏ ⇒ dùng xô" như top-k.</p>
<p><strong>LC 75 Sort Colors</strong> — sắp tại chỗ một mảng chỉ gồm 0, 1, 2. Chỉ ba giá trị: đếm chúng, rồi ghi lại mảng — hai lượt, O(n), O(1) bộ nhớ phụ. Câu hỏi nối tiếp "trong một lượt" là thuật toán cờ Hà Lan (Dutch national flag) với ba con trỏ (Chương 2).</p>
</div>
${maHai('ch01/sort-bien-the.ts', 'ch01/SortBienThe.java', { vung: 'largest' })}
${maHai('ch01/sort-bien-the.ts', 'ch01/SortBienThe.java', { vung: 'hindex' })}
${maHai('ch01/sort-bien-the.ts', 'ch01/SortBienThe.java', { vung: 'colors' })}
${ketQua('ch01/sort-bien-the.ts')}
<div class="ml-en">
<p>Check <code>[3, 30, 34, 5, 9]</code> → "9534330": 9 first; then 5 before 34 (because "534" &gt; "345"); then 34 before 3 (because "343" &gt; "334"); then 3 before 30 (because "330" &gt; "303"). Walking through two or three pairs out loud like this is how you convince the interviewer the comparator is right. For H-Index <code>[3, 0, 6, 1, 5]</code>: sorted descending 6, 5, 3, 1, 0 — the third paper has 3 ≥ 3 citations, the fourth has 1 &lt; 4 ⇒ h = 3, and the counting version agrees on every case. The Java version prints the same lines (checked by the runner).</p>
</div>
<div class="ml-vi">
<p>Kiểm <code>[3, 30, 34, 5, 9]</code> → "9534330": 9 đứng đầu; rồi 5 trước 34 (vì "534" &gt; "345"); rồi 34 trước 3 (vì "343" &gt; "334"); rồi 3 trước 30 (vì "330" &gt; "303"). Đi qua hai, ba cặp thành tiếng như vậy là cách thuyết phục người phỏng vấn rằng comparator đúng. Với H-Index <code>[3, 0, 6, 1, 5]</code>: sắp giảm dần 6, 5, 3, 1, 0 — bài thứ ba có 3 ≥ 3 trích dẫn, bài thứ tư có 1 &lt; 4 ⇒ h = 3, và bản đếm cho cùng đáp án ở mọi ca. Bản Java in đúng những dòng đó (bộ chạy đã so).</p>
</div>

<div class="ml-en">
<h3>Where this pattern lives in real systems</h3>
<ul>
<li><strong><code>ORDER BY … LIMIT k</code> is top-k.</strong> PostgreSQL does not sort a million rows to return ten: <code>EXPLAIN ANALYZE</code> shows <em>Sort Method: top-N heapsort</em>, a heap of size k — exactly the O(n log k) answer of Chapter 6. With an index on the sort column it does not sort at all.</li>
<li><strong>Sorted data is cheap to merge and deduplicate.</strong> <code>sort | uniq</code> on the command line, merge joins in databases, and "merge two sorted lists" in Chapter 3 all rely on sorted input.</li>
<li><strong>Calendars.</strong> "When are all members of the team free?" is merge intervals over everybody's busy times, then the gaps.</li>
<li><strong>Leaderboards and rankings</strong> sort by score, then by time to break ties — a two-key comparator, and stable sorting when the UI lets users click several columns.</li>
<li><strong>This website.</strong> The admin user list (<code>src/routes/admin.routes.ts</code>) and the GitHub repository list (<code>src/routes/github.routes.ts</code>) take the sort column from the URL — and both check it against a fixed list (<code>allowedSortColumns</code>, <code>allowedSorts</code>) before using it. The next section is why.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong><code>ORDER BY … LIMIT k</code> chính là top-k.</strong> PostgreSQL không sắp một triệu dòng chỉ để trả mười dòng: <code>EXPLAIN ANALYZE</code> hiện <em>Sort Method: top-N heapsort</em>, một heap cỡ k — đúng câu trả lời O(n log k) của Chương 6. Có chỉ mục trên cột sắp thì nó không sắp gì cả.</li>
<li><strong>Dữ liệu đã sắp thì gộp và khử trùng rẻ.</strong> <code>sort | uniq</code> trên dòng lệnh, merge join trong CSDL, và "gộp hai danh sách đã sắp" ở Chương 3 đều dựa vào đầu vào đã sắp.</li>
<li><strong>Lịch.</strong> "Khi nào cả nhóm cùng rảnh?" là gộp khoảng trên giờ bận của mọi người, rồi lấy các khe trống.</li>
<li><strong>Bảng xếp hạng</strong> sắp theo điểm, rồi theo thời gian để phân định người bằng điểm — một comparator hai khoá, và sắp ổn định khi giao diện cho người dùng bấm nhiều cột.</li>
<li><strong>Chính trang này.</strong> Danh sách người dùng của admin (<code>src/routes/admin.routes.ts</code>) và danh sách kho GitHub (<code>src/routes/github.routes.ts</code>) nhận cột sắp từ URL — và cả hai đều đối chiếu nó với một danh sách cố định (<code>allowedSortColumns</code>, <code>allowedSorts</code>) trước khi dùng. Phần tiếp theo nói vì sao.</li>
</ul>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-4-3-order-limit-distinct', title: 'PostgreSQL 4.3 — ORDER BY, LIMIT/OFFSET &amp; DISTINCT', sub: 'Sắp và lấy top-k ngay trong CSDL', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: the sort parameter and the killer input</h3>
<p><strong>1. "Sort by" is user input.</strong> A list API with <code>?sortBy=createdAt</code> is convenient — and dangerous if the value goes straight into the query. Column names cannot be passed as SQL parameters, so a hand-built <code>ORDER BY</code> string is a classic SQL-injection spot. Even with an ORM that prevents injection, sorting by a column the user is not allowed to <em>see</em> leaks it: sort the users by a hidden field (a reset-token or a password hash, say) and the order of the visible rows tells the attacker which values are bigger, one comparison at a time — enough to binary-search a secret. The defence is a whitelist, exactly as <code>admin.routes.ts</code> does: <code>allowedSortColumns.includes(sortBy) ? sortBy : 'createdAt'</code>, plus a fixed set of directions.</p>
<p><strong>2. Inputs built to make a sort slow.</strong> Quicksort is O(n log n) on average and O(n²) in the worst case. In 1999 Doug McIlroy published "A Killer Adversary for Quicksort", a method to build inputs that drive library quicksorts into their quadratic case. Competitive programmers use the same idea against each other: on contest sites, solutions that called Java's primitive <code>Arrays.sort(int[])</code> on older Java versions were "hacked" with anti-quicksort tests until they timed out — the usual advice was to shuffle first or sort an <code>Integer[]</code>/<code>ArrayList</code> (merge-sort based, guaranteed O(n log n)). Newer JDKs added a guard: in the Java 21 source of <code>DualPivotQuicksort</code>, a recursion-depth limit switches to heap sort. The general lesson for servers: anything with a bad worst case that an attacker can steer (sorts, hash tables from Lesson 1.1, regexes from Lesson 0.1) needs either a guaranteed algorithm or a cap on input size.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: tham số sắp xếp và đầu vào "sát thủ"</h3>
<p><strong>1. "Sắp theo" cũng là dữ liệu người dùng gửi.</strong> Một API danh sách có <code>?sortBy=createdAt</code> rất tiện — và nguy hiểm nếu giá trị đó đi thẳng vào truy vấn. Tên cột không truyền được dưới dạng tham số SQL, nên một chuỗi <code>ORDER BY</code> ghép tay là chỗ SQL injection kinh điển. Kể cả khi ORM chặn được injection, cho sắp theo một cột mà người dùng không được phép <em>xem</em> vẫn làm lộ cột đó: sắp danh sách người dùng theo một trường ẩn (mã đặt lại mật khẩu hay mã băm mật khẩu chẳng hạn) thì thứ tự các dòng nhìn thấy cho kẻ tấn công biết giá trị nào lớn hơn, mỗi lần một phép so — đủ để tìm nhị phân ra một bí mật. Cách phòng là danh sách trắng (whitelist), đúng như <code>admin.routes.ts</code> làm: <code>allowedSortColumns.includes(sortBy) ? sortBy : 'createdAt'</code>, cộng một tập chiều sắp cố định.</p>
<p><strong>2. Đầu vào chế ra để làm phép sắp chậm.</strong> Quicksort là O(n log n) trung bình và O(n²) xấu nhất. Năm 1999 Doug McIlroy công bố "A Killer Adversary for Quicksort", một cách dựng đầu vào đẩy quicksort của thư viện vào trường hợp bậc hai. Dân lập trình thi đấu dùng đúng ý đó để "hack" nhau: trên các trang thi, những lời giải gọi <code>Arrays.sort(int[])</code> kiểu nguyên thuỷ của các bản Java cũ bị hack bằng test chống quicksort tới mức quá giờ — lời khuyên quen thuộc là xáo trộn trước, hoặc sắp <code>Integer[]</code>/<code>ArrayList</code> (dựa trên merge sort, đảm bảo O(n log n)). Các bản JDK mới đã thêm chốt chặn: trong mã nguồn <code>DualPivotQuicksort</code> của Java 21, một giới hạn độ sâu đệ quy sẽ chuyển sang heap sort. Bài học chung cho máy chủ: bất cứ thứ gì có trường hợp xấu nhất tồi mà kẻ tấn công lái được (phép sắp, bảng băm ở bài 1.1, regex ở bài 0.1) đều cần một thuật toán có đảm bảo hoặc một trần kích thước đầu vào.</p>
</div>

<div class="ml-en">
<h3>Pitfalls</h3>
<div class="pitfall co-tieu-de"><p><strong>Sorting the caller's array.</strong></p><p><code>intervals.sort(…)</code> inside your function reorders the array the caller passed in. In LeetCode nobody notices; in real code the caller's list is suddenly in a different order — a bug that shows up far from its cause. Sort a copy (<code>toSorted</code>, <code>[...xs]</code>, <code>clone()</code>) unless reordering is part of the contract.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Sorting when the problem needs the original indices.</strong></p><p>Two Sum asks for indices; sorting destroys them. Either keep pairs <code>[value, index]</code> and sort those, or use the hash map from Lesson 1.1.</p></div>
</div>
<div class="ml-vi">
<h3>Bẫy</h3>
<div class="pitfall co-tieu-de"><p><strong>Sắp luôn mảng của nơi gọi.</strong></p><p><code>intervals.sort(…)</code> bên trong hàm của bạn đổi thứ tự chính mảng mà nơi gọi truyền vào. Trên LeetCode không ai để ý; trong code thật, danh sách của nơi gọi bỗng dưng đổi thứ tự — một lỗi lộ ra rất xa chỗ gây ra nó. Hãy sắp một bản sao (<code>toSorted</code>, <code>[...xs]</code>, <code>clone()</code>) trừ khi việc đổi thứ tự nằm trong hợp đồng của hàm.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Sắp xếp khi đề cần chỉ số gốc.</strong></p><p>Two Sum hỏi chỉ số; sắp xếp phá mất chúng. Hoặc giữ cặp <code>[giá trị, chỉ số]</code> rồi sắp các cặp, hoặc dùng hash map của bài 1.1.</p></div>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: LC 347</h3>
${hoiThoai([
  ['I', 'Return the k most frequent elements of an array.'],
  ['C', 'Is the answer guaranteed unique — no tie at the k-th place? Does the order of the output matter? And what is the range of k?'],
  ['N', 'Ties decide whether "the k most frequent" is even well defined; output order decides whether you need a final sort.'],
  ['I', 'Unique answer, any order, k between 1 and the number of distinct values.'],
  ['C', 'First, count with a hash map — O(n). Then the simplest approach sorts the distinct values by count, descending, and takes k: O(n log n) overall. Can I write that, then improve it?'],
  ['N', 'A correct O(n log n) on the board early is worth more than a perfect answer that never gets finished.'],
  ['I', 'Sure. Can you do better than n log n?'],
  ['C', 'Yes. A count is an integer from 1 to n, so I can use it as an index: bucket[c] lists the values that appear c times. Walking the buckets from n down collects the top k in O(n) time and space. A heap of size k would give O(n log k), which also helps when k is small.'],
  ['N', 'Name the property that makes the trick possible ("a count is at most n"), then mention the alternative you know.'],
  ['I', 'What if the data were a stream too large for memory?'],
  ['C', 'Then an exact answer needs the counts somewhere — a database or a disk-based map. For an approximate answer, a sketch like count-min with a small heap keeps memory bounded.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to khi phỏng vấn: LC 347</h3>
${hoiThoai([
  ['I', 'Trả về k phần tử xuất hiện nhiều nhất của một mảng.'],
  ['C', 'Đáp án có chắc là duy nhất không — không hoà nhau ở vị trí thứ k? Thứ tự đầu ra có quan trọng không? Và k nằm trong khoảng nào ạ? <em>("Is the answer unique? Does the order matter?")</em>'],
  ['N', 'Chuyện hoà nhau quyết định "k phần tử nhiều nhất" có xác định rõ hay không; thứ tự đầu ra quyết định có cần sắp lần cuối hay không.'],
  ['I', 'Đáp án duy nhất, thứ tự bất kỳ, k từ 1 tới số giá trị khác nhau.'],
  ['C', 'Trước hết em đếm bằng hash map — O(n). Rồi cách đơn giản nhất là sắp các giá trị khác nhau theo số lần giảm dần và lấy k cái đầu: tổng O(n log n). Em viết bản này trước rồi cải tiến được không ạ? <em>("Can I write that first, then improve it?")</em>'],
  ['N', 'Một bản O(n log n) đúng có trên bảng sớm đáng giá hơn một câu trả lời hoàn hảo mà không bao giờ viết xong.'],
  ['I', 'Được. Có làm tốt hơn n log n không?'],
  ['C', 'Có ạ. Số lần xuất hiện là số nguyên từ 1 tới n, nên em dùng nó làm chỉ số: bucket[c] liệt kê các giá trị xuất hiện c lần. Đi các xô từ n xuống sẽ gom được top k trong O(n) thời gian và bộ nhớ. Một heap cỡ k cho O(n log k), cũng có lợi khi k nhỏ. <em>("A count is at most n, so it can be an array index.")</em>'],
  ['N', 'Gọi tên tính chất làm mẹo này khả thi ("số lần tối đa là n"), rồi nhắc phương án khác mà mình biết.'],
  ['I', 'Nếu dữ liệu là một luồng (stream) quá lớn, không vừa bộ nhớ thì sao?'],
  ['C', 'Khi đó muốn đáp án chính xác thì số đếm phải nằm ở đâu đó — một CSDL hoặc một map trên đĩa. Nếu chấp nhận gần đúng, một cấu trúc phác thảo như count-min sketch cộng một heap nhỏ giữ bộ nhớ có giới hạn.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Calling <code>sort()</code> on numbers without a comparator in JavaScript (string order), or returning a boolean from the comparator.</li>
<li>Writing <code>(a, b) -&gt; a - b</code> in Java with values that can be far apart; trying to pass a comparator to <code>Arrays.sort(int[])</code>.</li>
<li>Assigning <code>last[1] = end</code> instead of <code>max(last[1], end)</code> when merging intervals.</li>
<li>Forgetting the "all zeros" case in Largest Number, or other edge cases created by your own sort key.</li>
<li>Sorting the input in place when the caller (or the problem's indices) still need the original order.</li>
<li>Claiming O(n) for the bucket solution while sorting the buckets' contents, or forgetting the O(n) memory.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Gọi <code>sort()</code> trên số mà không có comparator trong JavaScript (thứ tự chuỗi), hoặc comparator trả về boolean.</li>
<li>Viết <code>(a, b) -&gt; a - b</code> trong Java khi giá trị có thể cách xa nhau; cố truyền comparator vào <code>Arrays.sort(int[])</code>.</li>
<li>Gán <code>last[1] = end</code> thay vì <code>max(last[1], end)</code> khi gộp khoảng.</li>
<li>Quên ca "toàn số 0" ở Largest Number, hoặc các ca biên khác do chính khoá sắp của mình sinh ra.</li>
<li>Sắp tại chỗ đầu vào trong khi nơi gọi (hoặc chỉ số mà đề hỏi) vẫn cần thứ tự gốc.</li>
<li>Khẳng định bản xô là O(n) trong khi lại sắp nội dung từng xô, hoặc quên bộ nhớ O(n).</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Đề tổng hợp dùng comparator — LC 1029 Two City Scheduling — có lời giải từng bước ở bài 1.5 (Bộ luyện 1).</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In your browser console or Node, run <code>[10, 9, 1, 100, 25].sort()</code>. Predict the output first, then fix it with a comparator. Do the same in Java with <code>Integer[]</code> and <code>Collections.reverseOrder()</code>.</li>
<li>Write <code>merge</code> for intervals without looking. Test <code>[[1, 4], [2, 3]]</code> (inside), <code>[[1, 4], [4, 5]]</code> (touching) and <code>[[5, 6], [1, 2]]</code> (unsorted input).</li>
<li>Write <code>topKBucket</code> and run it on <code>[1, 1, 1, 2, 2, 3], k = 2</code>.</li>
<li>Submit LC 56, LC 347 and LC 179.</li>
</ol>
<p><strong>Done when:</strong> your prediction for step 1 is <code>[1, 10, 100, 25, 9]</code>; the three merge tests give <code>[[1, 4]]</code>, <code>[[1, 5]]</code>, <code>[[1, 2], [5, 6]]</code>; top-k gives <code>[1, 2]</code>; three submissions accepted.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">comparator</span><span class="v">A function (a, b) returning negative / zero / positive to define the order.</span></div>
  <div class="kv"><span class="k">stable sort</span><span class="v">Elements that compare equal keep their original relative order.</span></div>
  <div class="kv"><span class="k">in place</span><span class="v">Reorders the given array instead of returning a new one.</span></div>
  <div class="kv"><span class="k">TimSort / dual-pivot quicksort</span><span class="v">The library sorts behind JS/Java objects (stable) and Java primitives (not stable).</span></div>
  <div class="kv"><span class="k">bucket sort / counting sort</span><span class="v">Use small integer keys as array indices: O(n + range), no comparisons.</span></div>
  <div class="kv"><span class="k">top-k</span><span class="v">The k largest / most frequent items: sort O(n log n), bucket O(n), heap O(n log k).</span></div>
  <div class="kv"><span class="k">whitelist</span><span class="v">Accept only values from a fixed list — the defence for user-chosen sort columns.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Sorting costs O(n log n) and makes neighbours meaningful: merge, dedupe, rank, two pointers.</li>
<li>JS: always pass <code>(a, b) =&gt; a - b</code> for numbers, <code>localeCompare(…, 'vi')</code> for names; never return a boolean.</li>
<li>Java: <code>Integer.compare</code>, not <code>a - b</code>; <code>int[]</code> takes no comparator.</li>
<li>Stable sorts let you sort by several keys, one pass per key, last key first.</li>
<li>Top-k: sort is the first answer, bucket by count is O(n), a heap is O(n log k) — and measure before you believe a log factor.</li>
<li>Sort columns from users go through a whitelist.</li>
</ul>
${nguon('📙', 'MDN — Array.prototype.sort()', 'Default string order, comparator rules, stability, toSorted', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort')}
${nguon('⚙️', 'V8 blog — Getting things sorted in V8', 'Why V8 moved to TimSort in 2018, and what a stable sort means in practice', 'https://v8.dev/blog/array-sort')}
${nguon('☕', 'Java SE 21 — java.util.Arrays', 'Which sort each overload uses, stability guarantees, comparator overloads', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong console trình duyệt hoặc Node, chạy <code>[10, 9, 1, 100, 25].sort()</code>. Đoán output trước, rồi sửa bằng comparator. Làm lại trong Java với <code>Integer[]</code> và <code>Collections.reverseOrder()</code>.</li>
<li>Viết <code>merge</code> cho khoảng mà không nhìn bài. Test <code>[[1, 4], [2, 3]]</code> (nằm trọn trong), <code>[[1, 4], [4, 5]]</code> (chạm nhau) và <code>[[5, 6], [1, 2]]</code> (đầu vào chưa sắp).</li>
<li>Viết <code>topKBucket</code> và chạy với <code>[1, 1, 1, 2, 2, 3], k = 2</code>.</li>
<li>Nộp LC 56, LC 347 và LC 179.</li>
</ol>
<p><strong>Đạt khi:</strong> dự đoán bước 1 của bạn là <code>[1, 10, 100, 25, 9]</code>; ba test merge cho <code>[[1, 4]]</code>, <code>[[1, 5]]</code>, <code>[[1, 2], [5, 6]]</code>; top-k cho <code>[1, 2]</code>; ba lượt nộp Accepted.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">comparator (hàm so sánh)</span><span class="v">Hàm (a, b) trả về âm / 0 / dương để định nghĩa thứ tự.</span></div>
  <div class="kv"><span class="k">stable sort (sắp xếp ổn định)</span><span class="v">Các phần tử so bằng nhau giữ nguyên thứ tự tương đối ban đầu.</span></div>
  <div class="kv"><span class="k">in place (tại chỗ)</span><span class="v">Đổi thứ tự ngay trên mảng được truyền vào thay vì trả về mảng mới.</span></div>
  <div class="kv"><span class="k">TimSort / dual-pivot quicksort</span><span class="v">Thuật toán sắp của thư viện cho đối tượng JS/Java (ổn định) và kiểu nguyên thuỷ của Java (không ổn định).</span></div>
  <div class="kv"><span class="k">bucket sort / counting sort (sắp theo xô / sắp đếm)</span><span class="v">Dùng khoá số nguyên nhỏ làm chỉ số mảng: O(n + khoảng giá trị), không so sánh.</span></div>
  <div class="kv"><span class="k">top-k (k phần tử đứng đầu)</span><span class="v">k phần tử lớn nhất / xuất hiện nhiều nhất: sắp O(n log n), xô O(n), heap O(n log k).</span></div>
  <div class="kv"><span class="k">whitelist (danh sách trắng)</span><span class="v">Chỉ nhận giá trị nằm trong một danh sách cố định — cách phòng cho cột sắp do người dùng chọn.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Sắp xếp tốn O(n log n) và làm cho "hàng xóm" có nghĩa: gộp, khử trùng, xếp hạng, hai con trỏ.</li>
<li>JS: sắp số luôn truyền <code>(a, b) =&gt; a - b</code>, tên người dùng <code>localeCompare(…, 'vi')</code>; không bao giờ trả boolean.</li>
<li>Java: <code>Integer.compare</code>, không dùng <code>a - b</code>; <code>int[]</code> không nhận comparator.</li>
<li>Sắp ổn định cho phép sắp nhiều khoá, mỗi khoá một lần, khoá cuối cùng làm trước.</li>
<li>Top-k: sắp là câu trả lời đầu tiên, xô theo số lần là O(n), heap là O(n log k) — và hãy đo trước khi tin một thừa số log.</li>
<li>Cột sắp do người dùng gửi phải đi qua danh sách trắng.</li>
</ul>
${nguon('📙', 'MDN — Array.prototype.sort()', 'Thứ tự chuỗi mặc định, luật comparator, tính ổn định, toSorted (tiếng Anh)', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort')}
${nguon('⚙️', 'V8 blog — Getting things sorted in V8', 'Vì sao V8 chuyển sang TimSort năm 2018, và sắp ổn định nghĩa là gì trong thực tế', 'https://v8.dev/blog/array-sort')}
${nguon('☕', 'Java SE 21 — java.util.Arrays', 'Mỗi bản sort dùng thuật toán nào, đảm bảo ổn định, các bản nhận comparator', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html')}
</div>
`,
};
