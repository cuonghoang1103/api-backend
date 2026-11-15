/** 6.1 — Heap và hàng đợi ưu tiên. Mọi mã/output đọc từ ../ma/ch06 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { vetHeap } from '../ma/ch06/heap.vet.mjs';
import { vetMergeK } from '../ma/ch06/merge-k.vet.mjs';

const veMang = (h) => oMang(h.mang, { to: h.to, chiSo: true });
const BANG_LEN = bangVet(['step', 'heap array (index below)', 'what happens'],
  vetHeap([1, 2], [3, 5, 8, 6, 9]).map((h) => [h.op, veMang(h), h.viec]));
const BANG_XUONG = bangVet(['step', 'heap array (index below)', 'what happens'],
  vetHeap(['pop'], [1, 2, 3, 4, 5, 6, 7, 8, 9]).map((h) => [h.op, veMang(h), h.viec]));
const LISTS = [[2, 6, 9], [1, 7], [3, 4, 8]];
const tenDs = ['A', 'B', 'C'];
const nut = (e) => `${e[0]}<sub>${tenDs[e[1]]}</sub>`;
const BANG_MERGE = bangVet(['popped (smallest head)', 'its successor pushed', 'heap after (sorted for reading)', 'output so far'],
  vetMergeK(LISTS).map((h) => [
    h.lay ? `<strong>${nut(h.lay)}</strong>` : '— (start: push the 3 heads)',
    h.vao ? nut(h.vao) : (h.lay ? '— (list ' + tenDs[h.lay[1]] + ' is empty)' : ''),
    h.heap.length ? h.heap.map(nut).join(' · ') : '∅',
    h.out.length ? oMang(h.out, { to: { [h.out.length - 1]: 'ok' } }) : '',
  ]));

const DE = [
  [lc(1046, 'last-stone-weight', 'Last Stone Weight', 'Easy'), 'Repeatedly take the two largest ⇒ a max-heap, nothing else.', 'Lặp lại "lấy hai cái lớn nhất" ⇒ một max-heap, không hơn.'],
  [lc(703, 'kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', 'Easy'), 'Numbers keep arriving ⇒ a min-heap of size k, the top is the answer.', 'Số đổ về liên tục ⇒ min-heap kích thước k, đỉnh chính là đáp án.'],
  [lc(215, 'kth-largest-element-in-an-array', 'Kth Largest Element in an Array', 'Medium'), 'This lesson’s main problem: sort vs heap of k vs quickselect.', 'Đề chính của bài: sort vs heap kích thước k vs quickselect.'],
  [lc(347, 'top-k-frequent-elements', 'Top K Frequent Elements', 'Medium'), 'Count, then top k by count: heap of size k (or the bucket trick of lesson 1.3).', 'Đếm, rồi lấy k cái đếm nhiều nhất: heap kích thước k (hoặc mẹo bucket ở bài 1.3).'],
  [lc(973, 'k-closest-points-to-origin', 'K Closest Points to Origin', 'Medium'), '"k smallest" ⇒ a MAX-heap of size k; compare squared distances.', '"k cái nhỏ nhất" ⇒ MAX-heap kích thước k; so khoảng cách bình phương.'],
  [lc(621, 'task-scheduler', 'Task Scheduler', 'Medium'), 'Greedy: always run the most frequent ready task; max-heap + cooldown queue, or a formula.', 'Tham lam: luôn chạy việc còn nhiều nhất đang sẵn sàng; max-heap + hàng chờ nguội, hoặc công thức.'],
  [lc(767, 'reorganize-string', 'Reorganize String', 'Medium'), 'Same greedy as 621 with cooldown 1: take the top, hold it back one step.', 'Cùng kiểu tham lam như 621 với thời gian nguội 1: lấy đỉnh, giữ lại một bước.'],
  [lc(1642, 'furthest-building-you-can-reach', 'Furthest Building You Can Reach', 'Medium'), 'Give ladders to the k biggest climbs so far ⇒ min-heap of size = ladders.', 'Dành thang cho k lần leo cao nhất tới giờ ⇒ min-heap kích thước = số thang.'],
  [lc(23, 'merge-k-sorted-lists', 'Merge k Sorted Lists', 'Hard'), 'A heap of the k current heads; pop one, push its successor. O(N log k).', 'Heap chứa k đầu danh sách; lấy một, đẩy phần tử kế của nó. O(N log k).'],
  [lc(355, 'design-twitter', 'Design Twitter', 'Medium'), 'The news feed IS merge-k: each followee’s tweets are a sorted list by time.', 'News feed CHÍNH LÀ merge-k: tweet của mỗi người được theo dõi là một danh sách sắp theo thời gian.'],
];

export default {
  title: '6.1 — Heaps and priority queues: top-k, merge k lists, a heap you write yourself|||6.1 — Heap và hàng đợi ưu tiên: top-k, gộp k danh sách, tự viết heap',
  slug: 'dsa-6-1-heap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Heap 25 dòng viết lại được khi phỏng vấn JS, PriorityQueue của Java và bẫy comparator tràn số, top-k bằng sort vs heap vs quickselect đo thật tới 10⁶, merge k sorted lists, k closest points, task scheduler.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Heaps and priority queues: top-k, merge k lists, a heap you write yourself</h2>
<p class="lead">Some problems do not need everything sorted — they need <strong>the best one right now</strong>, again and again, while new items keep arriving: the most urgent ticket, the nearest point, the smallest head among k lists, the next timer to fire. A heap answers "what is the smallest?" in O(1) and absorbs a new item or removes the top in O(log n). Interviewers love it because it separates candidates who know <em>which tool fits</em> from those who sort everything. And it hides a practical trap: JavaScript has no heap built in. This lesson gives you one you can write from memory in 25 lines, Java's <code>PriorityQueue</code> with the comparator bug that reorders real queues, and measured numbers for the three ways to get the top k.</p>

<h3>The everyday picture</h3>
<p>The emergency room of a hospital does not serve patients in arrival order. A nurse gives each new patient a severity number, and whoever is most severe goes next — even if they arrived last. Nobody sorts the whole waiting room every time someone walks in; the nurse only needs to know <em>who is the most severe right now</em>. That is a <strong>priority queue</strong>: an abstract "bag" with three operations — <code>push(item)</code>, <code>peek()</code> (look at the best), <code>pop()</code> (remove the best).</p>
<p>A <strong>binary heap</strong> is the standard way to build one. It is a binary tree with two rules:</p>
<ul>
<li><strong>Shape rule:</strong> the tree is <em>complete</em> — every level is full except possibly the last, which fills left to right. Because of this, the tree fits in a plain array with no pointers: the node at index <code>i</code> has children <code>2i + 1</code> and <code>2i + 2</code> and parent <code>(i − 1) &gt;&gt; 1</code>.</li>
<li><strong>Order rule (min-heap):</strong> every parent is ≤ its children. So the smallest element is always <code>a[0]</code>. Nothing is said about left vs right, or about cousins — a heap is only <em>partly</em> ordered, and that is exactly why it is cheaper than a sorted array.</li>
</ul>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">a[0]</span><span class="lz-t">root = minimum</span><span class="lz-d">peek is O(1)</span></div>
  <div class="lz-step"><span class="lz-k">a[1], a[2]</span><span class="lz-t">its two children</span><span class="lz-d">2·0+1, 2·0+2</span></div>
  <div class="lz-step"><span class="lz-k">a[3..6]</span><span class="lz-t">the next level</span><span class="lz-d">children of 1 are 3, 4; of 2 are 5, 6</span></div>
  <div class="lz-step"><span class="lz-k">height</span><span class="lz-t">⌊log₂ n⌋</span><span class="lz-d">10⁶ items ⇒ height 19 (20 levels)</span></div>
</div>
<p>A <strong>max-heap</strong> is the same thing with the comparison flipped. In code you never write two heaps: you write one heap that takes a comparator, and flip the comparator.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Heap và hàng đợi ưu tiên: top-k, gộp k danh sách, tự viết heap</h2>
<p class="lead">Có những bài không cần sắp xếp TẤT CẢ — chúng chỉ cần <strong>cái tốt nhất ngay lúc này</strong>, lặp đi lặp lại, trong khi phần tử mới vẫn liên tục đổ vào: phiếu hỗ trợ khẩn nhất, điểm gần nhất, đầu nhỏ nhất trong k danh sách, bộ hẹn giờ sắp nổ tiếp theo. Heap (đống) trả lời "cái nhỏ nhất là gì?" trong O(1), nhận thêm phần tử hoặc lấy đỉnh ra trong O(log n). Người phỏng vấn thích dạng này vì nó tách người biết <em>chọn đúng công cụ</em> khỏi người gặp gì cũng sort. Và nó giấu một cái bẫy rất thực tế: JavaScript không có heap sẵn. Bài này cho bạn một cái heap 25 dòng viết lại được từ trí nhớ, <code>PriorityQueue</code> của Java kèm lỗi comparator làm đảo lộn hàng đợi thật, và số đo thật cho ba cách lấy top k.</p>

<h3>Hình dung đời thường</h3>
<p>Phòng cấp cứu của bệnh viện không khám theo thứ tự đến. Điều dưỡng phân loại (triage) mỗi bệnh nhân mới bằng một mức độ nặng, và ai nặng nhất được vào trước — kể cả khi người đó tới sau cùng. Không ai đi sắp xếp lại cả phòng chờ mỗi khi có người bước vào; điều dưỡng chỉ cần biết <em>ai đang nặng nhất ngay lúc này</em>. Đó chính là <strong>priority queue</strong> (hàng đợi ưu tiên): một "cái túi" trừu tượng có ba thao tác — <code>push(item)</code> (thêm vào), <code>peek()</code> (xem cái tốt nhất), <code>pop()</code> (lấy cái tốt nhất ra).</p>
<p><strong>Binary heap</strong> (đống nhị phân) là cách chuẩn để cài đặt nó. Đó là một cây nhị phân tuân hai luật:</p>
<ul>
<li><strong>Luật hình dạng:</strong> cây <em>đầy đủ</em> (complete) — mọi tầng đều kín, trừ tầng cuối được lấp từ trái sang phải. Nhờ vậy cây nằm gọn trong một mảng thường, không cần con trỏ: nút ở chỉ số <code>i</code> có hai con <code>2i + 1</code>, <code>2i + 2</code> và cha <code>(i − 1) &gt;&gt; 1</code> (dịch phải 1 bit = chia 2 lấy phần nguyên).</li>
<li><strong>Luật thứ tự (min-heap — đống nhỏ nhất):</strong> mọi nút cha ≤ các con của nó. Vì thế phần tử nhỏ nhất luôn nằm ở <code>a[0]</code>. Luật không nói gì về con trái so với con phải, hay về "anh em họ" — heap chỉ có thứ tự <em>một phần</em> (partial order), và chính vì vậy nó rẻ hơn một mảng đã sắp xếp hoàn toàn.</li>
</ul>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">a[0]</span><span class="lz-t">gốc = nhỏ nhất</span><span class="lz-d">peek tốn O(1)</span></div>
  <div class="lz-step"><span class="lz-k">a[1], a[2]</span><span class="lz-t">hai con của gốc</span><span class="lz-d">2·0+1, 2·0+2</span></div>
  <div class="lz-step"><span class="lz-k">a[3..6]</span><span class="lz-t">tầng kế tiếp</span><span class="lz-d">con của 1 là 3, 4; của 2 là 5, 6</span></div>
  <div class="lz-step"><span class="lz-k">chiều cao</span><span class="lz-t">⌊log₂ n⌋</span><span class="lz-d">10⁶ phần tử ⇒ cao 19 (20 tầng)</span></div>
</div>
<p><strong>Max-heap</strong> (đống lớn nhất) là đúng thứ đó với phép so sánh đảo ngược. Khi code, bạn không bao giờ viết hai cái heap: bạn viết MỘT heap nhận vào một comparator (hàm so sánh), rồi đảo comparator.</p>
${csd('csd201-priority-queue-heap', 'vi', '2.5 Hàng đợi ưu tiên &amp; Heap', '<p>Ôn một câu: hàng đợi ưu tiên là kiểu dữ liệu trừu tượng (ADT) "lấy ra phần tử ưu tiên nhất"; heap là một cách cài đặt nó trên mảng. <strong>Ở đây đi sâu thêm:</strong> nhận ra lúc nào đề "đòi" heap, heap kích thước k thay vì heap n phần tử, và cái giá thật (đo) so với sort và quickselect.</p>')}
${csd('csd201-heap-cai-dat', 'vi', '4.7 Dựng heap: sift-up, sift-down, Floyd', '<p>Bài CSD201 dựng heap bằng Java và chứng minh dựng heap kiểu Floyd chỉ tốn O(n). <strong>Ở đây</strong> ta cô lại thành một lớp TypeScript ~25 dòng viết lại được trong 3 phút khi phỏng vấn bằng JS, và dùng thẳng <code>PriorityQueue</code> khi phỏng vấn bằng Java.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when the problem wants a heap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"k-th largest / smallest", "top k", "k closest", "k most frequent"</span><span class="v">You need the best k, not a full ranking. A heap of size k gives O(n log k).</span></div>
  <div class="kv"><span class="k">"repeatedly take the smallest/largest", while new items arrive</span><span class="v">Last Stone Weight, merging, scheduling, simulations. Sorting once is not enough because the set keeps changing.</span></div>
  <div class="kv"><span class="k">"merge k sorted …"</span><span class="v">k lists, files, feeds. The heap holds one candidate per source.</span></div>
  <div class="kv"><span class="k">"a stream", "online", "after each insertion report …"</span><span class="v">The data never stops, so you cannot sort it. Heaps (or two heaps — lesson 6.2) keep the answer ready.</span></div>
  <div class="kv"><span class="k">"cheapest / shortest next step" in a graph</span><span class="v">Dijkstra and Prim are a priority queue of frontier nodes (lesson 7.4).</span></div>
  <div class="kv"><span class="k">n up to 10⁵–10⁶ and you need the best item many times</span><span class="v">Scanning for the minimum each time is O(n) per query ⇒ O(n²) overall. A heap makes each query O(log n).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đề "đòi" heap</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"lớn/nhỏ thứ k", "top k", "k điểm gần nhất", "k phần tử hay gặp nhất"</span><span class="v">Bạn cần k cái tốt nhất, không cần cả bảng xếp hạng. Heap kích thước k cho O(n log k).</span></div>
  <div class="kv"><span class="k">"lặp lại: lấy cái nhỏ/lớn nhất", trong khi phần tử mới vẫn đến</span><span class="v">Last Stone Weight, gộp danh sách, lập lịch, mô phỏng. Sắp xếp một lần là không đủ vì tập hợp cứ thay đổi.</span></div>
  <div class="kv"><span class="k">"gộp k dãy đã sắp xếp …"</span><span class="v">k danh sách, k tệp, k nguồn tin. Heap giữ mỗi nguồn đúng một ứng viên.</span></div>
  <div class="kv"><span class="k">"luồng dữ liệu (stream)", "trực tuyến (online)", "sau mỗi lần thêm hãy báo …"</span><span class="v">Dữ liệu không bao giờ dừng nên không thể sắp xếp. Heap (hoặc hai heap — bài 6.2) luôn giữ sẵn đáp án.</span></div>
  <div class="kv"><span class="k">"bước tiếp theo rẻ nhất / gần nhất" trên đồ thị</span><span class="v">Dijkstra và Prim chính là một hàng đợi ưu tiên của các đỉnh biên (bài 7.4).</span></div>
  <div class="kv"><span class="k">n tới 10⁵–10⁶ và cần lấy phần tử tốt nhất rất nhiều lần</span><span class="v">Mỗi lần quét tìm min là O(n) ⇒ cả bài O(n²). Heap đưa mỗi lần xuống O(log n).</span></div>
</div>
</div>

<div class="ml-en">
<h3>The 25-line heap (TypeScript) — write it from memory</h3>
<p>JavaScript and TypeScript have no heap in the standard library. On LeetCode the JavaScript runtime ships the <code>@datastructures-js/priority-queue</code> package, but in a live interview (CoderPad, a Google Doc, a whiteboard) or an online assessment you usually cannot count on it. Spend 30 minutes now so that this class costs you three minutes then:</p>
</div>
<div class="ml-vi">
<h3>Heap 25 dòng (TypeScript) — viết lại được từ trí nhớ</h3>
<p>JavaScript và TypeScript không có heap trong thư viện chuẩn. Trên LeetCode, môi trường JavaScript có cài sẵn gói <code>@datastructures-js/priority-queue</code>, nhưng khi phỏng vấn trực tiếp (CoderPad, Google Doc, bảng trắng) hay làm bài online assessment, thường bạn không thể trông vào nó. Bỏ 30 phút bây giờ để lúc đó lớp này chỉ tốn bạn ba phút:</p>
</div>
${ma('ch06/heap.ts', { vung: 'heap', nhan: 'TypeScript — MinHeap<T>' })}
${ma('ch06/heap.ts', { vung: 'dung', nhan: 'TypeScript — using it' })}
${ma('ch06/HeapDemo.java', { vung: 'pq', nhan: 'Java — the built-in PriorityQueue' })}
${ketQua('ch06/heap.ts')}
${ketQua('ch06/HeapDemo.java')}
<div class="ml-en">
<p>Identical output, including the internal array after every push: Java's <code>PriorityQueue</code> uses exactly this algorithm. Read the class as two short stories:</p>
<ul>
<li><strong>push = "append, then sift up".</strong> Adding at the end keeps the shape rule. The new item may break the order rule with its parent, so it swaps upward while it is smaller than its parent. It climbs at most the height of the tree: O(log n).</li>
<li><strong>pop = "the last leaf takes the root, then sifts down".</strong> Removing the root would leave a hole; the only element we can move without breaking the shape is the last leaf. It is probably too big for the root, so it swaps with its <em>smaller</em> child (swapping with the bigger child would put the bigger one above the smaller — order broken) until no child is smaller. Again O(log n).</li>
</ul>
<p>Details worth saying out loud: <code>&gt;= 0 ⇒ break</code> in sift-up stops on a tie (fewer swaps, still correct); <code>(i − 1) &gt;&gt; 1</code> is integer division by 2; <code>pop()</code> on an empty heap returns <code>undefined</code> (Java's <code>poll()</code> returns <code>null</code>, while <code>remove()</code> throws). The comparator follows the Java convention — negative means "x comes out first" — so <code>(a, b) =&gt; a − b</code> is a min-heap and <code>(a, b) =&gt; b − a</code> a max-heap, and for objects you chain tie-breakers with <code>||</code> exactly like <code>thenComparing</code>.</p>
<p>Notice line 4 of the Java output: <code>push 1 -&gt; array [1, 3, 8, 5]</code>. Printing a <code>PriorityQueue</code> shows the heap array, <strong>not</strong> sorted order (5 sits after 8). Iterating it with for-each gives the same unsorted order. Only repeated <code>poll()</code> yields sorted output — a classic "my queue is broken" false alarm.</p>
</div>
<div class="ml-vi">
<p>Output y hệt nhau, kể cả mảng bên trong sau mỗi lần push: <code>PriorityQueue</code> của Java dùng đúng thuật toán này. Đọc lớp trên như hai câu chuyện ngắn:</p>
<ul>
<li><strong>push = "thêm vào cuối, rồi sift up (nổi lên)".</strong> Thêm vào cuối mảng thì giữ được luật hình dạng. Phần tử mới có thể phá luật thứ tự với cha nó, nên nó đổi chỗ đi lên chừng nào còn nhỏ hơn cha. Nó leo tối đa bằng chiều cao của cây: O(log n).</li>
<li><strong>pop = "lá cuối lên thay gốc, rồi sift down (chìm xuống)".</strong> Lấy gốc ra sẽ để lại một lỗ; phần tử duy nhất di chuyển được mà không phá hình dạng là lá cuối cùng. Nó thường quá lớn so với vị trí gốc, nên nó đổi chỗ với đứa con <em>nhỏ hơn</em> (đổi với con lớn hơn thì con lớn sẽ nằm trên con nhỏ — hỏng thứ tự) cho tới khi không còn con nào nhỏ hơn nó. Cũng O(log n).</li>
</ul>
<p>Các chi tiết đáng nói ra miệng: <code>&gt;= 0 ⇒ break</code> ở sift up dừng luôn khi bằng nhau (ít phép đổi hơn, vẫn đúng); <code>(i − 1) &gt;&gt; 1</code> là chia nguyên cho 2; <code>pop()</code> trên heap rỗng trả <code>undefined</code> (còn <code>poll()</code> của Java trả <code>null</code>, <code>remove()</code> thì ném ngoại lệ). Comparator theo đúng quy ước Java — số âm nghĩa là "x ra trước" — nên <code>(a, b) =&gt; a − b</code> là min-heap, <code>(a, b) =&gt; b − a</code> là max-heap, và với đối tượng bạn nối tiêu chí phụ bằng <code>||</code> y như <code>thenComparing</code>.</p>
<p>Để ý dòng 4 của output Java: <code>push 1 -&gt; array [1, 3, 8, 5]</code>. In một <code>PriorityQueue</code> ra là in <strong>mảng heap</strong>, KHÔNG phải thứ tự đã sắp (5 đứng sau 8). Duyệt nó bằng for-each cũng ra đúng thứ tự lộn xộn đó. Chỉ <code>poll()</code> lặp lại mới cho ra thứ tự tăng dần — một lần "hàng đợi của em hỏng rồi" báo động giả kinh điển.</p>
</div>

<div class="ml-en">
<h3>Watch it run: sift up, then sift down</h3>
<p>First table: start from the heap <code>[3, 5, 8, 6, 9]</code> and push 1, then 2. Blue = the element that is moving; orange = the one it just swapped with; green = settled; grey = the parent that stopped it. The small number under each cell is its index — check that a swap always pairs <code>i</code> with <code>(i − 1) &gt;&gt; 1</code>.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: nổi lên, rồi chìm xuống</h3>
<p>Bảng thứ nhất: bắt đầu từ heap <code>[3, 5, 8, 6, 9]</code>, push 1 rồi push 2. Xanh dương = phần tử đang di chuyển; cam = phần tử vừa bị đổi chỗ với nó; xanh lá = đã yên vị; xám = nút cha đã chặn nó lại. Số nhỏ dưới mỗi ô là chỉ số — hãy tự kiểm rằng mỗi lần đổi luôn ghép <code>i</code> với <code>(i − 1) &gt;&gt; 1</code>.</p>
</div>
${BANG_LEN}
<div class="ml-en">
<p>Pushing 1 took two swaps (index 5 → 2 → 0) because 1 is smaller than everything: it climbs the whole height. Pushing 2 took one swap and stopped under the root 1. Now the opposite direction: pop from <code>[1, 2, …, 9]</code> (a sorted array is always a valid min-heap — the converse is false).</p>
</div>
<div class="ml-vi">
<p>Push 1 tốn hai lần đổi (chỉ số 5 → 2 → 0) vì 1 nhỏ hơn tất cả: nó leo hết chiều cao cây. Push 2 tốn một lần đổi rồi dừng dưới gốc 1. Giờ chiều ngược lại: pop từ <code>[1, 2, …, 9]</code> (mảng đã sắp xếp tăng luôn là một min-heap hợp lệ — điều ngược lại thì sai).</p>
</div>
${BANG_XUONG}
<div class="ml-en">
<p>The 9 that replaced the root sank three levels (0 → 1 → 3 → 7), each time choosing the smaller child: 2 rather than 3, then 4 rather than 5. Nine elements, three swaps — ⌊log₂ 9⌋ = 3. That logarithm is the entire reason heaps exist.</p>
${moPhong('ch06/heap.sim.js', 'en', 'Binary heap — the array and the tree side by side', 'Push 5, 3, 8, 1, 9, 2, 7 then pop twice: watch each sift-up and sift-down move along one root-to-leaf path.')}
</div>
<div class="ml-vi">
<p>Số 9 thay chỗ gốc đã chìm ba tầng (0 → 1 → 3 → 7), mỗi lần chọn đứa con nhỏ hơn: 2 chứ không phải 3, rồi 4 chứ không phải 5. Chín phần tử, ba lần đổi — ⌊log₂ 9⌋ = 3. Cái logarit đó là toàn bộ lý do heap tồn tại.</p>
${moPhong('ch06/heap.sim.js', 'vi', 'Binary heap — mảng và cây đặt cạnh nhau', 'Push 5, 3, 8, 1, 9, 2, 7 rồi pop hai lần: xem từng lần nổi lên/chìm xuống chỉ đi dọc một đường từ gốc tới lá.')}
</div>

<div class="ml-en">
<h3>Worked example: Kth Largest Element in an Array, three ways</h3>
<p><strong>Problem (in our words).</strong> Given an unsorted integer array and k, return the k-th largest value (counting duplicates: in <code>[5, 5, 1, 5, 2]</code> the 2nd largest is 5). Example: <code>[7, 2, 9, 4, 1, 8, 3]</code>, k = 3 → 9, 8, <strong>7</strong>.</p>
<p><strong>Answer 1 — sort.</strong> Sort descending, return index k − 1. O(n log n) time. Say it first: it is correct, simple, and the baseline.</p>
<p><strong>Answer 2 — a min-heap of size k.</strong> We only care about the k largest. Picture a team of k selected players and a gatekeeper at the door: the <em>weakest of the selected</em>. Each newcomer is compared to the gatekeeper only. Implementation: push every number; whenever the heap holds k + 1 items, pop the smallest. At the end the heap holds the k largest and its top — the smallest of them — is the answer. O(n log k) time, O(k) memory. Note the counter-intuitive direction: for the k <em>largest</em> you use a <em>min</em>-heap, because the one you need to throw out is the smallest.</p>
<p><strong>Answer 3 — quickselect.</strong> Quicksort's partition puts a pivot in its final sorted position. If that position is the one we want (index n − k in ascending order), stop; otherwise recurse into <em>one</em> side only. On average the sizes shrink n, n/2, n/4…, which sums to 2n: O(n) on average, O(n²) in the worst case. We split three ways (&lt; pivot, = pivot, &gt; pivot) and pick a random pivot — the measurement below shows why both matter.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Kth Largest Element in an Array, ba cách</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên chưa sắp xếp và số k, trả về giá trị lớn thứ k (có tính cả phần tử trùng: trong <code>[5, 5, 1, 5, 2]</code> số lớn thứ 2 là 5). Ví dụ: <code>[7, 2, 9, 4, 1, 8, 3]</code>, k = 3 → 9, 8, <strong>7</strong>.</p>
<p><strong>Cách 1 — sắp xếp.</strong> Sắp giảm dần, trả về chỉ số k − 1. Thời gian O(n log n). Hãy nói cách này trước: nó đúng, đơn giản, và là mốc để cải tiến.</p>
<p><strong>Cách 2 — min-heap kích thước k.</strong> Ta chỉ quan tâm k số lớn nhất. Hình dung một đội tuyển k người và một "người gác cửa" chính là <em>người yếu nhất trong đội</em>. Mỗi người mới tới chỉ cần so với người gác cửa. Cài đặt: push mọi số; hễ heap có k + 1 phần tử thì pop cái nhỏ nhất ra. Cuối cùng heap chứa đúng k số lớn nhất, và đỉnh của nó — số nhỏ nhất trong k số đó — là đáp án. Thời gian O(n log k), bộ nhớ O(k). Để ý chiều ngược trực giác: muốn k số <em>lớn</em> nhất thì dùng <em>min</em>-heap, vì thứ cần loại ra là số nhỏ nhất.</p>
<p><strong>Cách 3 — quickselect (chọn nhanh).</strong> Phép phân hoạch (partition) của quicksort đặt chốt (pivot) vào đúng vị trí cuối cùng của nó khi đã sắp xếp. Nếu vị trí đó là vị trí ta cần (chỉ số n − k theo thứ tự tăng) thì dừng; không thì chỉ đi tiếp vào <em>một</em> phía. Trung bình kích thước giảm n, n/2, n/4…, tổng là 2n: O(n) trung bình, O(n²) trường hợp xấu nhất. Ta chia ba phần (&lt; chốt, = chốt, &gt; chốt) và chọn chốt ngẫu nhiên — phép đo bên dưới cho thấy vì sao cả hai đều quan trọng.</p>
${csd('csd201-slide-cs5-2', 'vi', 'CS.5 Chia để trị: quickselect, top-k', '<p>Phần chuyên sâu CS.5 của CSD201 chứng minh quickselect O(n) trung bình bằng định lý Master. <strong>Ở đây</strong> ta đặt nó cạnh heap kích thước k bằng số đo thật, và chỉ ra cái bẫy phần tử trùng làm phân hoạch hai phía suy biến thành O(n²).</p>')}
</div>
${maHai('ch06/kth-largest.ts', 'ch06/KthLargest.java', { vung: 'heap' })}
${maHai('ch06/kth-largest.ts', 'ch06/KthLargest.java', { vung: 'quickselect' })}
${ketQua('ch06/kth-largest.ts')}
${ketQua('ch06/KthLargest.java')}
<div class="ml-en">
<p>Lines that matter. In the heap version, <code>if (h.size &gt; k) h.pop()</code> runs <em>after</em> the push, so a newcomer smaller than the gatekeeper goes in and comes straight back out — simpler than "compare with peek first", same complexity. In quickselect, the target index is <code>n − k</code> because the partition orders ascending; the 3-way split returns as soon as the target falls inside the "= pivot" block, which is what makes <code>[6, 6, 6, 6]</code> instant. The tiny LCG random generator is only there so that the program prints the same thing every run — in an interview, <code>Math.random()</code> is fine.</p>
<h3>The real cost, measured: sort vs heap of k vs quickselect</h3>
<p>Random integers, two values of k (10 and n/2), best of 3 runs on an Apple M1 Max. The second block is an array where every value is equal.</p>
</div>
<div class="ml-vi">
<p>Những dòng đáng chú ý. Ở bản heap, <code>if (h.size &gt; k) h.pop()</code> chạy <em>sau</em> push, nên một người mới yếu hơn người gác cửa sẽ vào rồi bị đẩy ra ngay — đơn giản hơn kiểu "so với peek trước", cùng độ phức tạp. Ở quickselect, chỉ số đích là <code>n − k</code> vì phân hoạch xếp tăng dần; phép chia ba trả về ngay khi đích rơi vào khối "= chốt", nhờ vậy <code>[6, 6, 6, 6]</code> xong tức thì. Bộ sinh số ngẫu nhiên LCG tí hon chỉ để chương trình in ra giống nhau mỗi lần chạy — khi phỏng vấn, <code>Math.random()</code> là đủ.</p>
<h3>Cái giá thật, đo bằng số: sort vs heap kích thước k vs quickselect</h3>
<p>Số nguyên ngẫu nhiên, hai giá trị k (10 và n/2), lấy lần nhanh nhất trong 3 lượt trên Apple M1 Max. Khối thứ hai là một mảng mà mọi giá trị đều bằng nhau.</p>
</div>
${ma('ch06/topk-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch06/topk-do.ts')}
${ketQua('ch06/TopKDo.java')}
<div class="ml-en">
<p>Read it like an engineer:</p>
<ul>
<li><strong>Small k: the heap wins big over sorting.</strong> At n = 10⁶, k = 10, Node sorts in 224.9 ms and the heap of 10 needs 15.8 ms — about 14× less, because log 10 ≈ 3.3 while log 10⁶ ≈ 20, and the heap barely moves (most newcomers lose to the gatekeeper at once).</li>
<li><strong>Big k: the heap's advantage melts.</strong> With k = n/2 the heap has 500,000 items and log k ≈ log n: Node 122.1 ms, still better than the 225.8 ms sort; in Java the heap (140.0 ms) is <em>slower</em> than <code>Arrays.sort</code> on <code>int[]</code> (59.4 ms) — every <code>Integer</code> in a <code>PriorityQueue</code> is a boxed object, while <code>Arrays.sort(int[])</code> works on raw ints. Big-O hides constants; boxing is a big one.</li>
<li><strong>Quickselect is flat in k.</strong> 14.2–16.4 ms in Node, 2.1–10.3 ms in Java at n = 10⁶, whatever k is — linear on average. Its catch: it needs the whole array in memory and it rearranges it (we copied it). The heap of k works on a <em>stream</em> with O(k) memory — the reason it is the default answer in interviews ("what if the data doesn't fit in memory?").</li>
<li><strong>Equal values break 2-way partition.</strong> Doubling n from 10,000 to 20,000 to 40,000 multiplies the Lomuto time by 3.8× then 3.4× (30.5 → 115.0 → 386.4 ms in Node): that is the n² signature. Every element equals the pivot, so each partition peels off a single element. The 3-way split puts them all in the "=" block and finishes in one pass (0.0–0.1 ms).</li>
</ul>
</div>
<div class="ml-vi">
<p>Đọc như một kỹ sư:</p>
<ul>
<li><strong>k nhỏ: heap thắng đậm so với sort.</strong> Ở n = 10⁶, k = 10, Node sort mất 224,9 ms còn heap 10 phần tử cần 15,8 ms — ít hơn khoảng 14 lần, vì log 10 ≈ 3,3 trong khi log 10⁶ ≈ 20, và heap gần như đứng yên (đa số người mới thua người gác cửa ngay).</li>
<li><strong>k lớn: lợi thế của heap tan dần.</strong> Với k = n/2, heap chứa 500.000 phần tử và log k ≈ log n: Node 122,1 ms, vẫn hơn mức 225,8 ms của sort; nhưng trong Java, heap (140,0 ms) <em>chậm hơn</em> <code>Arrays.sort</code> trên <code>int[]</code> (59,4 ms) — mỗi <code>Integer</code> trong <code>PriorityQueue</code> là một đối tượng đóng hộp (boxed), còn <code>Arrays.sort(int[])</code> làm trên số nguyên thô. Big-O giấu hằng số; đóng hộp là một hằng số lớn.</li>
<li><strong>Quickselect gần như không đổi theo k.</strong> 14,2–16,4 ms ở Node, 2,1–10,3 ms ở Java với n = 10⁶, k bao nhiêu cũng vậy — tuyến tính trung bình. Điểm yếu: nó cần cả mảng trong bộ nhớ và xáo trộn mảng (ta đã sao chép ra). Heap kích thước k chạy được trên <em>luồng dữ liệu</em> với bộ nhớ O(k) — đó là lý do nó là đáp án mặc định khi phỏng vấn ("nếu dữ liệu không vừa bộ nhớ thì sao?").</li>
<li><strong>Giá trị bằng nhau phá hỏng phân hoạch hai phía.</strong> Tăng n gấp đôi từ 10.000 lên 20.000 rồi 40.000 làm thời gian Lomuto tăng 3,8 lần rồi 3,4 lần (30,5 → 115,0 → 386,4 ms ở Node): đó là chữ ký của n². Mọi phần tử đều bằng chốt nên mỗi lần phân hoạch chỉ bóc ra đúng một phần tử. Chia ba phần thì gom hết vào khối "=" và xong trong một lượt (0,0–0,1 ms).</li>
</ul>
<p>Liên hệ: bài 1.3 đã lấy top k bằng sort và bằng bucket theo tần suất — <a href="${baiNay('dsa-1-3-sap-xep')}">ôn lại bài 1.3</a> để có đủ cả bốn cách khi bị hỏi "còn cách nào nữa không?".</p>
</div>

<div class="ml-en">
<h3>Java's PriorityQueue and the comparator that lies</h3>
<p>In Java you never write the heap — but you always write the comparator, and that is where people fail. The textbook shortcut <code>(a, b) -&gt; a - b</code> is correct only while the subtraction cannot overflow. Feed it priorities near ±2·10⁹:</p>
</div>
<div class="ml-vi">
<h3>PriorityQueue của Java và cái comparator nói dối</h3>
<p>Trong Java bạn không bao giờ phải viết heap — nhưng bạn luôn phải viết comparator, và người ta trượt chính ở đó. Lối tắt trong sách <code>(a, b) -&gt; a - b</code> chỉ đúng khi phép trừ không thể tràn số (overflow). Đưa vào các độ ưu tiên gần ±2·10⁹:</p>
</div>
${ma('ch06/ComparatorTran.java', { vung: 'tran', nhan: 'Java — overflow' })}
${ma('ch06/ComparatorTran.java', { vung: 'deadline', nhan: 'Java — deadlines in epoch milliseconds' })}
${ketQua('ch06/ComparatorTran.java')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap: <code>a - b</code> overflows; <code>(int) (a - b)</code> on longs truncates.</strong></p><p>2,000,000,000 − (−2,000,000,000) = 4·10⁹, which does not fit in an <code>int</code> (max ≈ 2.147·10⁹) and wraps to −294,967,296. The comparator now claims 2·10⁹ is <em>smaller</em> than −2·10⁹, and the most urgent value −2·10⁹ comes out third. The second bug is more common in real systems: ordering jobs by a <code>long</code> deadline with <code>(int) (a.deadline() - b.deadline())</code>. Seven days is 604,800,000 ms — fine; thirty days is 2,592,000,000 ms, which becomes −1,702,967,296 after the cast. A job due in 30 days now sorts <em>before</em> a job due right now. Fix: <code>Integer.compare(a, b)</code>, <code>Long.compare</code>, <code>Comparator.comparingInt / comparingLong</code>, or <code>Collections.reverseOrder()</code> for a max-heap. They never subtract.</p></div>
<p>On LeetCode most values are below 10⁹, so <code>a - b</code> passes — until a problem like Minimum Number of Arrows (lesson 6.3) includes −2³¹ and 2³¹ − 1 in the tests. Make <code>Integer.compare</code> your reflex.</p>
<p>TypeScript cannot overflow at 2³¹ (numbers are 64-bit floats), but it has its own version of the same lie: comparing values that are secretly <em>strings</em>.</p>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy: <code>a - b</code> tràn số; <code>(int) (a - b)</code> trên long thì bị cắt cụt.</strong></p><p>2.000.000.000 − (−2.000.000.000) = 4·10⁹, không vừa một <code>int</code> (tối đa ≈ 2,147·10⁹) nên quay vòng thành −294.967.296. Comparator giờ khẳng định 2·10⁹ <em>nhỏ hơn</em> −2·10⁹, và giá trị khẩn nhất −2·10⁹ ra ở vị trí thứ ba. Lỗi thứ hai còn hay gặp hơn trong hệ thống thật: sắp việc theo hạn chót kiểu <code>long</code> bằng <code>(int) (a.deadline() - b.deadline())</code>. Bảy ngày là 604.800.000 ms — ổn; ba mươi ngày là 2.592.000.000 ms, ép sang int thành −1.702.967.296. Một việc hạn 30 ngày nữa giờ đứng <em>trước</em> việc phải làm ngay bây giờ. Cách sửa: <code>Integer.compare(a, b)</code>, <code>Long.compare</code>, <code>Comparator.comparingInt / comparingLong</code>, hoặc <code>Collections.reverseOrder()</code> cho max-heap. Chúng không bao giờ trừ.</p></div>
<p>Trên LeetCode đa số giá trị dưới 10⁹ nên <code>a - b</code> vẫn qua — cho tới khi gặp đề như Minimum Number of Arrows (bài 6.3) có cả −2³¹ và 2³¹ − 1 trong bộ test. Hãy biến <code>Integer.compare</code> thành phản xạ.</p>
<p>TypeScript không tràn ở 2³¹ (số là số thực 64 bit), nhưng có phiên bản riêng của cùng lời nói dối đó: so sánh những giá trị mà thực ra là <em>chuỗi</em>.</p>
</div>
${ma('ch06/uu-tien-chuoi.ts', { vung: 'tran', nhan: 'TypeScript — priorities from a query string' })}
${ketQua('ch06/uu-tien-chuoi.ts')}
<div class="ml-en">
<p>Everything that comes from a URL, a form or many JSON payloads is a string. <code>"10" &lt; "9"</code> is <code>true</code> because strings compare character by character and "1" &lt; "9". The ticket with priority 2 comes out third. Convert at the boundary (and validate: <code>Number("abc")</code> is <code>NaN</code>, and a <code>NaN</code> comparator result silently counts as "equal").</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: a heap is not stable.</strong></p><p>"Equal priority ⇒ first come, first served" is what users expect from a queue, and a heap does not give it to you:</p></div>
</div>
<div class="ml-vi">
<p>Mọi thứ đến từ URL, từ form hay từ nhiều payload JSON đều là chuỗi. <code>"10" &lt; "9"</code> là <code>true</code> vì chuỗi so từng ký tự và "1" &lt; "9". Phiếu có độ ưu tiên 2 lại ra thứ ba. Hãy chuyển kiểu ngay tại biên hệ thống (và kiểm tra: <code>Number("abc")</code> là <code>NaN</code>, mà comparator trả về <code>NaN</code> thì lặng lẽ bị coi như "bằng nhau").</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: heap không ổn định (not stable).</strong></p><p>"Cùng độ ưu tiên ⇒ ai đến trước phục vụ trước" là điều người dùng mong đợi ở một hàng đợi, và heap KHÔNG cho bạn điều đó:</p></div>
</div>
${maHai('ch06/heap-on-dinh.ts', 'ch06/HeapOnDinh.java', { vung: 'ondinh' })}
${ketQua('ch06/heap-on-dinh.ts')}
<div class="ml-en">
<p>With priority only, u6 (arrived 6th) is served before u1 (arrived 1st) — the swaps of sift-down shuffle equal elements. The fix is one tie-breaker: an increasing sequence number. This is exactly what the event heap of this website's OS lab does (see "Where heaps live" below).</p>
</div>
<div class="ml-vi">
<p>Chỉ theo độ ưu tiên thì u6 (đến thứ 6) được phục vụ trước u1 (đến đầu tiên) — các lần đổi chỗ khi chìm xuống đã xáo trộn những phần tử bằng nhau. Cách sửa là thêm đúng một tiêu chí phụ: một số thứ tự tăng dần (sequence number). Đây chính là điều mà heap sự kiện trong phòng lab hệ điều hành của trang này làm (xem mục "Heap sống ở đâu" bên dưới).</p>
</div>

<div class="ml-en">
<h3>Variant 1 — K Closest Points to Origin</h3>
<p>Return the k points closest to (0, 0). "k smallest distances" is the mirror of "k largest values", so the heap flips too: a <strong>max</strong>-heap of size k, whose top is the <em>farthest</em> of the current k — the one to evict. Compare <strong>squared</strong> distances: <code>x² + y²</code> preserves the order, avoids <code>Math.sqrt</code> and floating-point noise. With coordinates up to 10⁴ (LeetCode's limit), x² + y² ≤ 2·10⁸ still fits in a Java <code>int</code> — say that check out loud.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — K Closest Points to Origin</h3>
<p>Trả về k điểm gần gốc toạ độ (0, 0) nhất. "k khoảng cách nhỏ nhất" là ảnh gương của "k giá trị lớn nhất", nên heap cũng lật ngược: <strong>max</strong>-heap kích thước k, đỉnh là điểm <em>xa nhất</em> trong k điểm hiện có — điểm cần loại. So khoảng cách <strong>bình phương</strong>: <code>x² + y²</code> giữ nguyên thứ tự, tránh <code>Math.sqrt</code> và sai số số thực. Với toạ độ tối đa 10⁴ (giới hạn của LeetCode), x² + y² ≤ 2·10⁸ vẫn vừa <code>int</code> của Java — hãy nói to phép kiểm này.</p>
</div>
${maHai('ch06/k-closest.ts', 'ch06/KClosest.java', { vung: 'giai' })}
${ketQua('ch06/k-closest.ts')}

<div class="ml-en">
<h3>Variant 2 — Merge k Sorted Lists</h3>
<p>k sorted linked lists, N nodes in total; merge them into one sorted list. Merging two lists you know from lesson 3.3. For k lists the question at every step is "which of the k current heads is smallest?" — scanning k heads each time costs O(N·k). A heap of the k heads answers it in O(log k): pop the smallest head, append it to the result, push <em>its</em> successor (the new head of that list). Total O(N log k) time, O(k) extra memory. The dummy node from Chapter 3 removes the "is the result empty?" special case.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Merge k Sorted Lists</h3>
<p>k danh sách liên kết đã sắp xếp, tổng cộng N nút; gộp thành một danh sách đã sắp xếp. Gộp hai danh sách thì bạn đã biết từ bài 3.3. Với k danh sách, câu hỏi ở mỗi bước là "trong k đầu danh sách hiện tại, đầu nào nhỏ nhất?" — quét k đầu mỗi lần tốn O(N·k). Heap chứa k đầu trả lời câu đó trong O(log k): lấy đầu nhỏ nhất, nối vào kết quả, đẩy phần tử kế tiếp <em>của nó</em> (đầu mới của danh sách đó) vào heap. Tổng O(N log k) thời gian, O(k) bộ nhớ phụ. Nút giả (dummy) của Chương 3 xoá trường hợp đặc biệt "kết quả đang rỗng".</p>
</div>
${maHai('ch06/merge-k.ts', 'ch06/MergeK.java', { vung: 'giai' })}
${ketQua('ch06/merge-k.ts')}
<div class="ml-en">
<p>The heap never holds more than k = 3 entries — one per list (subscripts A, B, C say which list a value came from). Lists A = [2, 6, 9], B = [1, 7], C = [3, 4, 8]:</p>
</div>
<div class="ml-vi">
<p>Heap không bao giờ chứa quá k = 3 phần tử — mỗi danh sách một (chỉ số dưới A, B, C cho biết giá trị đến từ danh sách nào). Danh sách A = [2, 6, 9], B = [1, 7], C = [3, 4, 8]:</p>
</div>
${BANG_MERGE}
<div class="ml-en">
<p>Read row 4: popping 3 from C pushes 4 from C, and the next pop takes that same 4 — the heap does not care that a list "just had its turn". Rows 7–8: lists B and C run dry, the heap shrinks, and the last pops need no comparisons at all.</p>
</div>
<div class="ml-vi">
<p>Đọc dòng 4: lấy 3 của C thì đẩy 4 của C vào, và lần lấy kế tiếp lấy luôn số 4 đó — heap không quan tâm danh sách nào "vừa được lượt". Dòng 7–8: danh sách B và C cạn, heap nhỏ lại, các lần lấy cuối không còn phép so sánh nào.</p>
</div>

<div class="ml-en">
<h3>Variant 3 — Task Scheduler</h3>
<p>Tasks are letters; the same letter must be separated by at least n time slots (other tasks or idle). Find the minimum total number of slots. Greedy idea: at every slot, run the <strong>ready task with the most copies left</strong> — the most frequent task is the one that can create idle time, so you want to start it as early and as often as possible. Max-heap of remaining counts + a FIFO "cooling" queue of (count, time it becomes ready). Then the formula an interviewer may ask for as a follow-up: if the most frequent letter appears <code>maxC</code> times, it forms <code>maxC − 1</code> full frames of length <code>n + 1</code>, plus one last slot per letter that ties for <code>maxC</code>; if there are many distinct tasks, there is no idle at all and the answer is just the number of tasks.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 3 — Task Scheduler</h3>
<p>Các việc là chữ cái; hai lần chạy cùng một chữ phải cách nhau ít nhất n ô thời gian (ô đó chạy việc khác hoặc để trống). Tìm tổng số ô tối thiểu. Ý tham lam: ở mỗi ô, chạy <strong>việc đang sẵn sàng còn nhiều bản nhất</strong> — việc nhiều nhất là việc có thể gây ra ô trống, nên phải cho nó chạy sớm và đều nhất có thể. Max-heap các số lần còn lại + một hàng đợi FIFO "đang nguội" (cooldown) chứa (số lần còn, thời điểm sẵn sàng lại). Rồi tới công thức mà người phỏng vấn có thể hỏi tiếp: nếu chữ nhiều nhất xuất hiện <code>maxC</code> lần, nó tạo <code>maxC − 1</code> khung đầy đủ dài <code>n + 1</code>, cộng thêm một ô cuối cho mỗi chữ cũng có đúng <code>maxC</code> lần; nếu có rất nhiều việc khác nhau thì không có ô trống nào và đáp án chỉ là số việc.</p>
</div>
${maHai('ch06/task-scheduler.ts', 'ch06/TaskScheduler.java', { vung: 'heap' })}
${maHai('ch06/task-scheduler.ts', 'ch06/TaskScheduler.java', { vung: 'congthuc' })}
${ketQua('ch06/task-scheduler.ts')}
<div class="ml-en">
<p>Check two rows by hand. <code>AAABBC, n = 2</code>: A _ _ A _ _ A needs frames of 3 → A B C A B _ A = 7 = (3 − 1)·3 + 1. <code>ABCDEFA, n = 2</code>: A appears twice, the frame formula gives (2 − 1)·3 + 1 = 4, but there are 7 tasks, so the <code>max</code> picks 7 — there is no idle slot. The simulation is the safer thing to write under pressure; the formula is the "can you do it in O(n)?" follow-up.</p>
</div>
<div class="ml-vi">
<p>Kiểm tay hai dòng. <code>AAABBC, n = 2</code>: A _ _ A _ _ A cần các khung dài 3 → A B C A B _ A = 7 = (3 − 1)·3 + 1. <code>ABCDEFA, n = 2</code>: A xuất hiện hai lần, công thức khung cho (2 − 1)·3 + 1 = 4, nhưng có tới 7 việc nên <code>max</code> chọn 7 — không có ô trống nào. Bản mô phỏng là thứ an toàn hơn để viết khi bị áp lực; công thức là câu hỏi nối tiếp "em làm được O(n) không?".</p>
</div>

<div class="ml-en">
<h3>Where heaps live in real systems</h3>
<ul>
<li><strong>Node.js timers.</strong> Every <code>setTimeout</code> in your backend ends up in a binary heap: Node keeps its timer lists in <code>timerListQueue</code>, an instance of its internal <code>PriorityQueue</code> class keyed by expiry time. You can check it yourself: <code>node --expose-internals -p "require('internal/timers').timerListQueue.constructor.name"</code> prints <code>PriorityQueue</code>. That class also takes a <code>setPosition</code> callback — each element remembers its index, so a cancelled timer (<code>clearTimeout</code>) can be removed from the middle in O(log n). Plain heaps cannot do that.</li>
<li><strong>Discrete-event simulation on this website.</strong> The queueing simulator of the OS lab (<code>frontend/src/components/os-lab/engine/queueing.ts</code>) has a 10-line <code>class Heap</code> of events ordered by time, with the comparator <code>x.t &lt; y.t || (x.t === y.t &amp;&amp; x.seq &lt; y.seq)</code> — the sequence-number tie-break from the stability trap above, written by someone who hit it.</li>
<li><strong>The AI request queue of this website</strong> (<code>src/services/llm/hangDoi.ts</code>) has three priority levels — robot, a person at the screen, background jobs. It does <em>not</em> use a heap: the robot is inserted with <code>findIndex</code> + <code>splice</code> before the first non-robot, everyone else is appended. With at most a handful of waiters and the need to remove an arbitrary waiter on timeout (<code>indexOf</code> + <code>splice</code> in <code>boKhoiHang</code>), an array is simpler and just as fast — and it is stable for free. Knowing when <em>not</em> to reach for a heap is part of the skill.</li>
<li><strong>Shortest paths.</strong> Dijkstra's algorithm is a priority queue of "tentative distance → node" (lesson 7.4); map apps and network routing (OSPF) run it constantly.</li>
<li><strong>Merging sorted runs.</strong> Databases and big-data tools sort data larger than memory by sorting chunks to disk, then doing a k-way merge with a heap — Merge k Sorted Lists at the scale of terabytes.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Heap sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Bộ hẹn giờ của Node.js.</strong> Mọi <code>setTimeout</code> trong backend của bạn rốt cuộc nằm trong một binary heap: Node giữ các danh sách hẹn giờ trong <code>timerListQueue</code>, một đối tượng thuộc lớp <code>PriorityQueue</code> nội bộ, xếp theo thời điểm hết hạn. Tự kiểm được: <code>node --expose-internals -p "require('internal/timers').timerListQueue.constructor.name"</code> in ra <code>PriorityQueue</code>. Lớp đó còn nhận một hàm <code>setPosition</code> — mỗi phần tử nhớ chỉ số của mình, nhờ vậy một hẹn giờ bị huỷ (<code>clearTimeout</code>) gỡ được khỏi giữa heap trong O(log n). Heap trơn không làm được việc đó.</li>
<li><strong>Mô phỏng sự kiện rời rạc trên chính trang này.</strong> Bộ mô phỏng hàng đợi trong phòng lab hệ điều hành (<code>frontend/src/components/os-lab/engine/queueing.ts</code>) có một <code>class Heap</code> 10 dòng chứa các sự kiện xếp theo thời gian, với comparator <code>x.t &lt; y.t || (x.t === y.t &amp;&amp; x.seq &lt; y.seq)</code> — đúng mẹo số thứ tự ở cái bẫy "không ổn định" bên trên, do người đã từng dính lỗi viết.</li>
<li><strong>Hàng đợi request AI của trang này</strong> (<code>src/services/llm/hangDoi.ts</code>) có ba mức ưu tiên — robot, người đang nhìn màn hình, việc chạy nền. Nó KHÔNG dùng heap: robot được chèn bằng <code>findIndex</code> + <code>splice</code> vào trước người đầu tiên không phải robot, những người khác xếp cuối. Với tối đa vài người chờ, cộng thêm nhu cầu gỡ một người bất kỳ khi hết giờ chờ (<code>indexOf</code> + <code>splice</code> trong <code>boKhoiHang</code>), mảng đơn giản hơn, nhanh không kém — và ổn định miễn phí. Biết lúc nào <em>không</em> cần heap cũng là một phần của kỹ năng.</li>
<li><strong>Đường đi ngắn nhất.</strong> Dijkstra là một hàng đợi ưu tiên "khoảng cách tạm → đỉnh" (<a href="${baiNay('dsa-7-4-dijkstra')}">bài 7.4</a>); ứng dụng bản đồ và định tuyến mạng (OSPF) chạy nó liên tục.</li>
<li><strong>Gộp các đoạn đã sắp xếp.</strong> CSDL và công cụ dữ liệu lớn sắp xếp dữ liệu to hơn bộ nhớ bằng cách sắp từng khúc ra đĩa rồi gộp k đường bằng heap — Merge k Sorted Lists ở quy mô terabyte.</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: jumping the queue</h3>
<p>A priority queue is a promise of fairness, and fairness is an attack surface.</p>
<ul>
<li><strong>A comparator that can be steered.</strong> The deadline bug above is exploitable: if users can schedule a job (a reminder, an export, a report) and the server orders by <code>(int) (a.deadline - b.deadline)</code>, a job scheduled ~25–50 days ahead wraps negative and is served before urgent ones. Repeat it a thousand times and the real urgent jobs (OTP e-mails!) starve. Fix the comparator, and cap how far ahead a user may schedule.</li>
<li><strong>Client-chosen priority.</strong> If the request body carries <code>"priority": "high"</code>, every client will send "high". Priority must be decided by the server from facts it trusts (who the user is, what the action is) — this website decides <code>'robot' | 'nguoi' | 'nen'</code> in code, never from the request.</li>
<li><strong>Starvation.</strong> Even an honest stream of high-priority work can keep low-priority jobs waiting forever. Defences: <em>aging</em> (a job's priority improves the longer it waits), a quota per priority level, or a separate path for the low level — <code>hangDoi.ts</code> lets background jobs give up immediately and use the paid gateway instead of waiting behind people.</li>
<li><strong>Unbounded heaps.</strong> A queue that accepts everything is a memory leak an attacker can drive. Put a size limit and reject (HTTP 429/503) when full — <code>hangDoi.ts</code> refuses with reason <code>'day-hang'</code> when the line is full.</li>
</ul>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: chen ngang hàng đợi</h3>
<p>Hàng đợi ưu tiên là một lời hứa về sự công bằng, và công bằng là một bề mặt tấn công.</p>
<ul>
<li><strong>Comparator bị lái được.</strong> Lỗi hạn chót ở trên khai thác được: nếu người dùng tự đặt lịch được một việc (nhắc hẹn, xuất file, báo cáo) và máy chủ sắp theo <code>(int) (a.deadline - b.deadline)</code>, một việc đặt trước khoảng 25–50 ngày sẽ quay vòng thành số âm và được phục vụ trước những việc khẩn. Lặp lại một nghìn lần là các việc khẩn thật (email mã OTP!) bị bỏ đói. Sửa comparator, và giới hạn người dùng được đặt lịch xa tối đa bao lâu.</li>
<li><strong>Độ ưu tiên do client tự chọn.</strong> Nếu body request mang <code>"priority": "high"</code> thì client nào cũng sẽ gửi "high". Độ ưu tiên phải do máy chủ quyết định từ những dữ kiện nó tin được (người dùng là ai, hành động là gì) — trang này quyết định <code>'robot' | 'nguoi' | 'nen'</code> trong code, không bao giờ lấy từ request.</li>
<li><strong>Bỏ đói (starvation).</strong> Ngay cả một dòng việc ưu tiên cao hoàn toàn trung thực cũng có thể khiến việc ưu tiên thấp chờ mãi. Cách phòng: <em>aging</em> (lão hoá — chờ càng lâu ưu tiên càng tăng), hạn mức theo từng mức ưu tiên, hoặc đường riêng cho mức thấp — <code>hangDoi.ts</code> cho việc chạy nền bỏ cuộc ngay và đi cổng trả phí thay vì đứng chờ sau người thật.</li>
<li><strong>Heap không giới hạn.</strong> Hàng đợi nhận mọi thứ là một chỗ rò bộ nhớ mà kẻ tấn công điều khiển được. Đặt trần kích thước và từ chối (HTTP 429/503) khi đầy — <code>hangDoi.ts</code> từ chối với lý do <code>'day-hang'</code> khi hàng đã đầy.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Find the k-th largest element in an unsorted array.'],
  ['C', 'Quick checks: can k be larger than n? Do duplicates count separately — so in [5, 5, 1] the 2nd largest is 5? And roughly how big is n?'],
  ['N', 'Duplicates change the answer, and n decides whether O(n log n) is fine. Asking about k ≤ n tells you whether you need an error path.'],
  ['I', 'k is valid, duplicates count, n up to 10⁵.'],
  ['C', 'The baseline is sorting descending and taking index k − 1: O(n log n). Since I only need the top k, I can keep a min-heap of size k — the smallest of my current top k sits on top as a gatekeeper. Each number costs O(log k), so O(n log k) time and O(k) space. There is also quickselect at O(n) average. I’d code the heap: it’s simple, safe, and it works on a stream.'],
  ['N', 'Three options in three sentences, with complexities, then a reasoned choice. Mentioning the stream argument pre-empts the follow-up.'],
  ['I', 'Go with the heap. You’re in JavaScript — no built-in heap.'],
  ['C', 'Right, I’ll write a small MinHeap with a comparator: push appends and sifts up, pop moves the last leaf to the root and sifts down to the smaller child… Then: push each number, if size exceeds k pop. Trace [7, 2, 9, 4], k = 2: after 7, 2 the heap is {2, 7}; 9 comes in, size 3, pop 2; 4 comes in, size 3, pop 4; top is 7 — the 2nd largest. Correct.'],
  ['N', 'Naming the two invariants while coding the helper shows you are not reciting. The trace hits both branches: a newcomer that stays and one that is thrown straight back out.'],
  ['I', 'Can you do better than O(n log k)?'],
  ['C', 'Quickselect: partition around a random pivot and recurse into one side — O(n) average, O(n²) worst case. I’d use a three-way partition so many equal values don’t degrade it, and a random pivot so sorted input doesn’t either.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Tìm phần tử lớn thứ k trong một mảng chưa sắp xếp.'],
  ['C', 'Em hỏi nhanh: k có thể lớn hơn n không? Phần tử trùng có tính riêng không — tức trong [5, 5, 1] số lớn thứ 2 là 5? Và n cỡ bao nhiêu ạ? <em>("Do duplicates count separately?")</em>'],
  ['N', 'Phần tử trùng đổi đáp án, còn n quyết định O(n log n) có ổn không. Hỏi k ≤ n cho biết có cần nhánh báo lỗi.'],
  ['I', 'k hợp lệ, trùng thì tính riêng, n tới 10⁵.'],
  ['C', 'Mốc ban đầu là sắp giảm dần rồi lấy chỉ số k − 1: O(n log n). Vì em chỉ cần top k, em giữ một min-heap kích thước k — số nhỏ nhất trong top k hiện tại nằm trên đỉnh như người gác cửa. Mỗi số tốn O(log k), nên O(n log k) thời gian, O(k) bộ nhớ. Còn có quickselect O(n) trung bình. Em sẽ code bản heap: đơn giản, an toàn, và chạy được trên luồng dữ liệu. <em>("It works on a stream.")</em>'],
  ['N', 'Ba phương án trong ba câu, có độ phức tạp, rồi một lựa chọn có lý do. Nhắc chuyện luồng dữ liệu là chặn trước câu hỏi nối tiếp.'],
  ['I', 'Làm bản heap đi. Em đang dùng JavaScript — không có heap sẵn đâu.'],
  ['C', 'Vâng, em viết một MinHeap nhỏ nhận comparator: push thêm vào cuối rồi nổi lên, pop đưa lá cuối lên gốc rồi chìm xuống phía con nhỏ hơn… Sau đó: push từng số, size vượt k thì pop. Chạy tay [7, 2, 9, 4], k = 2: sau 7, 2 heap là {2, 7}; 9 vào, size 3, pop 2; 4 vào, size 3, pop 4; đỉnh là 7 — số lớn thứ 2. Đúng.'],
  ['N', 'Gọi tên hai bất biến trong lúc code hàm phụ cho thấy bạn không học thuộc. Lượt chạy tay đi qua cả hai nhánh: người mới ở lại, và người mới bị đẩy ra ngay.'],
  ['I', 'Làm tốt hơn O(n log k) được không?'],
  ['C', 'Quickselect: phân hoạch quanh một chốt ngẫu nhiên rồi chỉ đi vào một phía — O(n) trung bình, O(n²) xấu nhất. Em sẽ phân hoạch ba phần để nhiều giá trị bằng nhau không làm nó suy biến, và chốt ngẫu nhiên để mảng đã sắp xếp cũng không làm vậy. <em>("three-way partition", "random pivot")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Min-heap vs max-heap backwards: for the k <em>largest</em> keep a <em>min</em>-heap (you evict the smallest); for the k smallest/closest keep a max-heap.</li>
<li>Pushing all n items into a heap and popping k times when k is small: O(n log n) memory-hungry version of an O(n log k) idea.</li>
<li>In sift-down, swapping with the <em>left</em> child (or the bigger one) instead of the smaller child.</li>
<li>Java: <code>(a, b) -&gt; a - b</code> / <code>(int) (x - y)</code> comparators; printing or iterating a <code>PriorityQueue</code> and expecting sorted order.</li>
<li>Expecting FIFO among equal priorities without a sequence-number tie-breaker.</li>
<li>Calling quickselect "O(n)" without "on average", or using a fixed first-element pivot (sorted input ⇒ O(n²)).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Lộn min-heap với max-heap: muốn k số <em>lớn</em> nhất thì giữ <em>min</em>-heap (thứ bị loại là số nhỏ nhất); muốn k số nhỏ nhất/gần nhất thì giữ max-heap.</li>
<li>Đẩy cả n phần tử vào heap rồi pop k lần khi k nhỏ: một phiên bản O(n log n), tốn bộ nhớ, của ý tưởng O(n log k).</li>
<li>Khi chìm xuống lại đổi chỗ với con <em>trái</em> (hoặc con lớn hơn) thay vì con nhỏ hơn.</li>
<li>Java: comparator <code>(a, b) -&gt; a - b</code> / <code>(int) (x - y)</code>; in hoặc duyệt một <code>PriorityQueue</code> rồi tưởng nó đã sắp xếp.</li>
<li>Mong FIFO giữa các phần tử cùng độ ưu tiên mà không thêm số thứ tự làm tiêu chí phụ.</li>
<li>Nói quickselect là "O(n)" mà thiếu chữ "trung bình", hoặc lấy chốt cố định là phần tử đầu (mảng đã sắp xếp ⇒ O(n²)).</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Lời giải từng bước của LC 1046, 703, 767, 1642 (cùng các đề khoảng) nằm ở <a href="${baiNay('dsa-6-4-luyen')}">bài 6.4 — Bộ luyện 6</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Close this page. Write <code>MinHeap&lt;T&gt;</code> with a comparator from memory, in TypeScript, in under 10 minutes. Test: push 5, 3, 8, 1, 9, 2; pop everything; you must get 1, 2, 3, 5, 8, 9.</li>
<li>Turn it into a max-heap without touching the class (comparator only) and solve LC 1046 Last Stone Weight with it on LeetCode.</li>
<li>Solve LC 215 with the heap of size k. Then, in Java, write the comparator wrong on purpose as <code>(a, b) -&gt; a - b</code> for a max-heap of the values 2,000,000,000 and −2,000,000,000 and see the order flip; fix it with <code>Integer.compare</code>.</li>
<li>Solve LC 23 Merge k Sorted Lists and write its complexity as O(N log k) with one sentence explaining the k.</li>
</ol>
<p><strong>Done when:</strong> your heap passes the test on the first or second run, three accepted submissions (1046, 215, 23), and you can explain in one sentence why the k largest need a <em>min</em>-heap.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">priority queue</span><span class="v">Abstract type: push, peek the best, pop the best.</span></div>
  <div class="kv"><span class="k">binary heap</span><span class="v">Complete binary tree stored in an array; every parent ≤ its children (min-heap).</span></div>
  <div class="kv"><span class="k">sift up / sift down</span><span class="v">Swap upward with the parent after push; swap downward with the smaller child after pop. O(log n).</span></div>
  <div class="kv"><span class="k">comparator</span><span class="v">Function deciding order: negative means the first argument comes out first.</span></div>
  <div class="kv"><span class="k">top-k with a heap of size k</span><span class="v">Keep only k candidates; the worst of them sits on top and is evicted. O(n log k), O(k) memory.</span></div>
  <div class="kv"><span class="k">quickselect</span><span class="v">Partition-based selection of the k-th element; O(n) average, O(n²) worst.</span></div>
  <div class="kv"><span class="k">stable / unstable</span><span class="v">Whether equal keys keep arrival order. Heaps are unstable; add a sequence number.</span></div>
  <div class="kv"><span class="k">starvation / aging</span><span class="v">Low-priority work never served / raising priority with waiting time to prevent it.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A heap keeps the best item at <code>a[0]</code>; push and pop walk one root-to-leaf path: O(log n).</li>
<li>JavaScript has no heap: memorise the 25-line <code>MinHeap&lt;T&gt;</code> with a comparator. Java: <code>PriorityQueue</code>.</li>
<li>Top k: heap of size k (O(n log k), works on streams) vs sort (O(n log n)) vs quickselect (O(n) average, needs a 3-way split and a random pivot).</li>
<li>Merge k sorted lists = a heap of the k current heads, O(N log k).</li>
<li>Comparators: never subtract in Java (<code>Integer.compare</code>), never compare numbers as strings in TS, add a sequence number for FIFO ties.</li>
<li>Priorities are a security decision: server-assigned, bounded, protected from starvation.</li>
</ul>
${nguon('📙', 'Java PriorityQueue (Java SE 21 API)', 'Official documentation: ordering, iterator not in priority order, O(log n) offer/poll', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html')}
${nguon('📗', 'Node.js source — lib/internal/priority_queue.js', 'The binary heap behind every setTimeout in Node, with setPosition for removal', 'https://github.com/nodejs/node/blob/main/lib/internal/priority_queue.js')}
${nguon('🎞️', 'VisuAlgo — Binary Heap', 'Interactive heap: insert, extract-max, build heap in O(n)', 'https://visualgo.net/en/heap')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Đóng trang này. Viết <code>MinHeap&lt;T&gt;</code> có comparator từ trí nhớ, bằng TypeScript, dưới 10 phút. Test: push 5, 3, 8, 1, 9, 2; pop hết; phải ra 1, 2, 3, 5, 8, 9.</li>
<li>Biến nó thành max-heap mà không sửa lớp (chỉ đổi comparator) rồi giải LC 1046 Last Stone Weight bằng nó trên LeetCode.</li>
<li>Giải LC 215 bằng heap kích thước k. Sau đó, trong Java, cố tình viết sai comparator <code>(a, b) -&gt; a - b</code> cho max-heap gồm 2.000.000.000 và −2.000.000.000 và xem thứ tự bị lật; sửa bằng <code>Integer.compare</code>.</li>
<li>Giải LC 23 Merge k Sorted Lists và ghi độ phức tạp O(N log k) kèm một câu giải thích chữ k.</li>
</ol>
<p><strong>Đạt khi:</strong> heap của bạn qua test ngay lần chạy thứ nhất hoặc thứ hai, ba lượt nộp Accepted (1046, 215, 23), và bạn giải thích được trong một câu vì sao k số lớn nhất lại cần <em>min</em>-heap.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">priority queue (hàng đợi ưu tiên)</span><span class="v">Kiểu dữ liệu trừu tượng: thêm vào, xem cái tốt nhất, lấy cái tốt nhất ra.</span></div>
  <div class="kv"><span class="k">binary heap (đống nhị phân)</span><span class="v">Cây nhị phân đầy đủ lưu trong mảng; mọi cha ≤ con (min-heap).</span></div>
  <div class="kv"><span class="k">sift up / sift down (nổi lên / chìm xuống)</span><span class="v">Đổi chỗ đi lên với cha sau khi push; đi xuống với con nhỏ hơn sau khi pop. O(log n).</span></div>
  <div class="kv"><span class="k">comparator (hàm so sánh)</span><span class="v">Hàm quyết định thứ tự: âm nghĩa là tham số thứ nhất ra trước.</span></div>
  <div class="kv"><span class="k">top-k bằng heap kích thước k</span><span class="v">Chỉ giữ k ứng viên; kẻ yếu nhất nằm trên đỉnh và bị loại. O(n log k), bộ nhớ O(k).</span></div>
  <div class="kv"><span class="k">quickselect (chọn nhanh)</span><span class="v">Chọn phần tử thứ k dựa trên phân hoạch; O(n) trung bình, O(n²) xấu nhất.</span></div>
  <div class="kv"><span class="k">stable / unstable (ổn định / không ổn định)</span><span class="v">Phần tử bằng nhau có giữ thứ tự đến hay không. Heap không ổn định; thêm số thứ tự.</span></div>
  <div class="kv"><span class="k">starvation / aging (bỏ đói / lão hoá)</span><span class="v">Việc ưu tiên thấp không bao giờ được phục vụ / tăng ưu tiên theo thời gian chờ để chống bỏ đói.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Heap giữ phần tử tốt nhất ở <code>a[0]</code>; push và pop chỉ đi một đường từ gốc tới lá: O(log n).</li>
<li>JavaScript không có heap: thuộc lòng <code>MinHeap&lt;T&gt;</code> 25 dòng có comparator. Java: <code>PriorityQueue</code>.</li>
<li>Top k: heap kích thước k (O(n log k), chạy được trên luồng) vs sort (O(n log n)) vs quickselect (O(n) trung bình, cần chia ba phần và chốt ngẫu nhiên).</li>
<li>Gộp k danh sách đã sắp xếp = heap chứa k đầu hiện tại, O(N log k).</li>
<li>Comparator: trong Java không bao giờ trừ (<code>Integer.compare</code>), trong TS không so số như chuỗi, thêm số thứ tự khi cần FIFO giữa các phần tử bằng nhau.</li>
<li>Độ ưu tiên là quyết định bảo mật: do máy chủ gán, có giới hạn, có chống bỏ đói.</li>
</ul>
${nguon('📙', 'Java PriorityQueue (Java SE 21 API)', 'Tài liệu chính thức: thứ tự, iterator không theo thứ tự ưu tiên, offer/poll O(log n)', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html')}
${nguon('📗', 'Mã nguồn Node.js — lib/internal/priority_queue.js', 'Binary heap đứng sau mọi setTimeout của Node, có setPosition để gỡ phần tử', 'https://github.com/nodejs/node/blob/main/lib/internal/priority_queue.js')}
${nguon('🎞️', 'VisuAlgo — Binary Heap', 'Heap tương tác: chèn, lấy max, dựng heap O(n)', 'https://visualgo.net/en/heap')}
</div>
`,
};
