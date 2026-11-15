/** 6.4 — Bộ luyện 6: 8 đề heap / hai heap / khoảng, có lời giải từng bước. Mã/output đọc từ ../ma/ch06 (chạy thật). */
import { maHai, ketQua, oMang, bangVet, lc, nguon, gap, baiNay } from '../_chung.mjs';
import { vetPhongIII } from '../ma/ch06/l7-meeting-rooms-iii.vet.mjs';

const D = {
  l1: lc(1046, 'last-stone-weight', 'Last Stone Weight', 'Easy'),
  l2: lc(703, 'kth-largest-element-in-a-stream', 'Kth Largest Element in a Stream', 'Easy'),
  l3: lc(767, 'reorganize-string', 'Reorganize String', 'Medium'),
  l4: lc(1642, 'furthest-building-you-can-reach', 'Furthest Building You Can Reach', 'Medium'),
  l5: lc(1288, 'remove-covered-intervals', 'Remove Covered Intervals', 'Medium'),
  l6: lc(1353, 'maximum-number-of-events-that-can-be-attended', 'Maximum Number of Events That Can Be Attended', 'Medium'),
  l7: lc(2402, 'meeting-rooms-iii', 'Meeting Rooms III', 'Hard'),
  l8: lc(632, 'smallest-range-covering-elements-from-k-lists', 'Smallest Range Covering Elements from K Lists', 'Hard'),
};

const BANG_L7 = bangVet(['meeting (by start)', 'decision', 'free rooms (heap)', 'busy rooms: free-at·room (heap)', 'meetings per room'],
  vetPhongIII(3, [[1, 20], [2, 10], [3, 5], [4, 9], [6, 8]]).map((h) => [
    `<strong>${h.hop}</strong>`,
    h.viec,
    h.free.length ? oMang(h.free) : '∅',
    h.busy.join(' · '),
    oMang(h.used, { chiSo: true }),
  ]));

export default {
  title: '6.4 — Practice set 6: eight heap and interval problems|||6.4 — Bộ luyện 6: tám đề heap và khoảng',
  slug: 'dsa-6-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề từ dễ tới khó phủ cả chương — max-heap mô phỏng, heap kích thước k trên luồng, tham lam giữ lại một bước, thang cho lần leo cao nhất, khoảng bị phủ, sự kiện theo ngày, Meeting Rooms III hai heap, khoảng nhỏ nhất phủ k danh sách — mỗi đề có gợi ý gập và lời giải TS + Java chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Practice set 6: eight heap and interval problems</h2>
<p class="lead">Eight problems, easy to hard, mixing the chapter on purpose: a plain max-heap, a heap of size k, a greedy that needs a heap <em>and</em> a one-step delay, two problems where the heap decides who pays, two interval problems that hinge on the sort order, and two Hard ones built from two heaps and from merge-k. In an interview nobody tells you "this is a heap problem" — for each one, name the pattern <em>before</em> you open a hint, set a timer, and talk out loud. Open a hint only after five minutes stuck; open the solution only after you have submitted something.</p>
<table>
<thead><tr><th>#</th><th>Problem</th><th>Pattern</th><th>Target time</th></tr></thead>
<tbody>
<tr><td>1</td><td>${D.l1}</td><td>max-heap simulation</td><td>15′</td></tr>
<tr><td>2</td><td>${D.l2}</td><td>min-heap of size k on a stream</td><td>15′</td></tr>
<tr><td>3</td><td>${D.l3}</td><td>max-heap greedy + hold back one step</td><td>25′</td></tr>
<tr><td>4</td><td>${D.l4}</td><td>min-heap decides who pays</td><td>25′</td></tr>
<tr><td>5</td><td>${D.l5}</td><td>sort start ↑, end ↓, one scan</td><td>25′</td></tr>
<tr><td>6</td><td>${D.l6}</td><td>sort by start + min-heap of ends</td><td>25′</td></tr>
<tr><td>7</td><td>${D.l7}</td><td>two heaps: free rooms + busy rooms</td><td>40′</td></tr>
<tr><td>8</td><td>${D.l8}</td><td>merge-k heap + running max</td><td>40′</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Read + restate</span><span class="lz-d">2 min; half-open or closed?</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Name the pattern</span><span class="lz-d">which heap, ordered by what — or which sort</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Code, out loud</span><span class="lz-d">timer running</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Test edge cases</span><span class="lz-d">empty, ties, touching ends, ±2³¹</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Log it</span><span class="lz-d">signal → pattern → mistake</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Bộ luyện 6: tám đề heap và khoảng</h2>
<p class="lead">Tám đề, từ dễ tới khó, cố ý trộn cả chương: một max-heap trơn, một heap kích thước k, một bài tham lam cần heap <em>và</em> một bước giữ lại, hai đề mà heap quyết định ai phải trả giá, hai đề khoảng xoay quanh thứ tự sắp xếp, và hai đề Hard dựng từ hai heap và từ merge-k. Khi phỏng vấn, không ai bảo bạn "đây là đề heap" — với mỗi đề, gọi tên mẫu <em>trước khi</em> mở gợi ý, bấm giờ, và nói to. Chỉ mở gợi ý sau năm phút bí; chỉ mở lời giải sau khi đã nộp một bản nào đó.</p>
<table>
<thead><tr><th>#</th><th>Đề</th><th>Mẫu</th><th>Thời gian mục tiêu</th></tr></thead>
<tbody>
<tr><td>1</td><td>${D.l1}</td><td>mô phỏng bằng max-heap</td><td>15′</td></tr>
<tr><td>2</td><td>${D.l2}</td><td>min-heap kích thước k trên luồng</td><td>15′</td></tr>
<tr><td>3</td><td>${D.l3}</td><td>tham lam max-heap + giữ lại một bước</td><td>25′</td></tr>
<tr><td>4</td><td>${D.l4}</td><td>min-heap quyết định ai trả giá</td><td>25′</td></tr>
<tr><td>5</td><td>${D.l5}</td><td>sắp đầu ↑, cuối ↓, quét một lượt</td><td>25′</td></tr>
<tr><td>6</td><td>${D.l6}</td><td>sắp theo đầu + min-heap điểm cuối</td><td>25′</td></tr>
<tr><td>7</td><td>${D.l7}</td><td>hai heap: phòng trống + phòng bận</td><td>40′</td></tr>
<tr><td>8</td><td>${D.l8}</td><td>heap merge-k + max đang chạy</td><td>40′</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc + diễn đạt lại</span><span class="lz-d">2 phút; nửa mở hay đóng?</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Gọi tên mẫu</span><span class="lz-d">heap nào, xếp theo gì — hay sắp kiểu gì</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Code, nói to</span><span class="lz-d">đồng hồ đang chạy</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Test ca biên</span><span class="lz-d">rỗng, bằng nhau, chạm mép, ±2³¹</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Ghi sổ</span><span class="lz-d">dấu hiệu → mẫu → lỗi đã mắc</span></div>
</div>
<p>Khung 6 bước cho mọi đề ở <a href="${baiNay('dsa-0-2-khung')}">bài 0.2</a>; ôn lại mẫu nào thì về <a href="${baiNay('dsa-6-1-heap')}">6.1 heap</a>, <a href="${baiNay('dsa-6-2-trung-vi')}">6.2 hai heap</a>, <a href="${baiNay('dsa-6-3-khoang')}">6.3 khoảng</a>. Viết bằng TypeScript thì chép sẵn lớp <code>MinHeap</code> 25 dòng của bài 6.1 — mọi lời giải dưới đây dùng đúng lớp đó.</p>
</div>

<div class="ml-en">
<h3>1. ${D.l1}</h3>
<p><strong>Problem.</strong> Stones with weights; repeatedly smash the two heaviest. Equal weights both disappear; otherwise the lighter disappears and the heavier loses that much. Return the last weight, or 0. <code>[6, 9, 4, 1, 7]</code>: 9 vs 7 → 2; 6 vs 4 → 2; 2 vs 2 → both gone; 1 is left.</p>
<p><strong>Recognising the pattern.</strong> "Repeatedly take the two largest" while the set changes (a new stone is created) — the definition of a max-heap.</p>
${gap('💡 Hint 1', '<p>Sorting once is not enough: the new stone y − x has to be placed back somewhere in the order. What structure gives the max and accepts inserts in O(log n)?</p>')}
${gap('💡 Hint 2', '<p>Max-heap = your min-heap with the comparator flipped. Loop while it has at least two stones.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Push all stones into a max-heap. While size ≥ 2: pop y (heaviest), pop x; if they differ, push y − x. Return the remaining stone or 0. <strong>Complexity:</strong> each smash removes at least one stone, so at most n rounds of O(log n): O(n log n) time, O(n) space. <strong>Edge cases tried:</strong> one stone (returned as is), two equal stones (0), a stone list that ends with two equal stones (0). Java: <code>new PriorityQueue&lt;&gt;(Collections.reverseOrder())</code>.</p>')}
</div>
<div class="ml-vi">
<h3>1. ${D.l1}</h3>
<p><strong>Đề.</strong> Có các hòn đá với cân nặng; lặp lại: đập hai hòn nặng nhất vào nhau. Bằng nhau thì cả hai biến mất; khác nhau thì hòn nhẹ biến mất và hòn nặng mất đi đúng chừng ấy. Trả về cân nặng hòn cuối, hoặc 0. <code>[6, 9, 4, 1, 7]</code>: 9 với 7 → 2; 6 với 4 → 2; 2 với 2 → mất cả hai; còn lại 1.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Lặp lại: lấy hai cái lớn nhất" trong khi tập hợp thay đổi (sinh ra hòn đá mới) — đúng định nghĩa max-heap.</p>
${gap('💡 Gợi ý 1', '<p>Sắp xếp một lần là không đủ: hòn mới y − x phải được đặt lại đúng chỗ trong thứ tự. Cấu trúc nào cho ra max và nhận chèn trong O(log n)?</p>')}
${gap('💡 Gợi ý 2', '<p>Max-heap = min-heap của bạn với comparator đảo ngược. Lặp khi còn ít nhất hai hòn.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Đẩy hết đá vào max-heap. Khi size ≥ 2: pop y (nặng nhất), pop x; khác nhau thì push y − x. Trả về hòn còn lại hoặc 0. <strong>Độ phức tạp:</strong> mỗi lần đập bớt ít nhất một hòn, nên tối đa n vòng O(log n): O(n log n) thời gian, O(n) bộ nhớ. <strong>Ca biên đã thử:</strong> một hòn (trả nguyên), hai hòn bằng nhau (0), danh sách kết thúc bằng hai hòn bằng nhau (0). Java: <code>new PriorityQueue&lt;&gt;(Collections.reverseOrder())</code>.</p>')}
</div>
${maHai('ch06/l1-last-stone.ts', 'ch06/L1LastStone.java', { vung: 'giai' })}
${ketQua('ch06/l1-last-stone.ts')}

<div class="ml-en">
<h3>2. ${D.l2}</h3>
<p><strong>Problem.</strong> A class is created with k and some initial numbers; each <code>add(val)</code> inserts a number and returns the k-th largest so far. k = 3, start <code>[5, 1, 9]</code>: add 4 → 4 (top three 9, 5, 4); add 10 → 5; add 2 → 5; add 7 → 7.</p>
<p><strong>Recognising the pattern.</strong> "k-th largest" + a stream = the gatekeeper heap of lesson 6.1, kept alive between calls.</p>
${gap('💡 Hint 1', '<p>You never need numbers smaller than the current k-th largest again. How many numbers do you actually have to keep?</p>')}
${gap('💡 Hint 2', '<p>A min-heap holding exactly the k largest: its top is the answer. The constructor can simply call <code>add</code> for each initial number.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Keep a min-heap of at most k numbers. <code>add</code>: push, and if the size exceeds k, pop the smallest; return the top. <strong>Complexity:</strong> O(log k) per <code>add</code>, O(k) memory — independent of how long the stream gets, which is the point. <strong>Edge cases tried:</strong> k = 1 starting from an empty list (the first <code>add</code> must work), negative numbers, a value equal to the current k-th largest.</p>')}
</div>
<div class="ml-vi">
<h3>2. ${D.l2}</h3>
<p><strong>Đề.</strong> Một lớp được tạo với k và vài số ban đầu; mỗi lần <code>add(val)</code> thêm một số và trả về số lớn thứ k tính tới lúc đó. k = 3, ban đầu <code>[5, 1, 9]</code>: thêm 4 → 4 (ba số lớn nhất 9, 5, 4); thêm 10 → 5; thêm 2 → 5; thêm 7 → 7.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "lớn thứ k" + luồng dữ liệu = heap người gác cửa của bài 6.1, giữ sống giữa các lần gọi.</p>
${gap('💡 Gợi ý 1', '<p>Những số nhỏ hơn số lớn thứ k hiện tại sẽ không bao giờ cần tới nữa. Thật ra bạn phải giữ bao nhiêu số?</p>')}
${gap('💡 Gợi ý 2', '<p>Một min-heap giữ đúng k số lớn nhất: đỉnh của nó là đáp án. Hàm khởi tạo chỉ cần gọi <code>add</code> cho từng số ban đầu.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Giữ một min-heap tối đa k số. <code>add</code>: push, nếu size vượt k thì pop số nhỏ nhất; trả về đỉnh. <strong>Độ phức tạp:</strong> O(log k) mỗi lần <code>add</code>, bộ nhớ O(k) — không phụ thuộc luồng dài bao nhiêu, và đó chính là điểm mấu chốt. <strong>Ca biên đã thử:</strong> k = 1 với danh sách ban đầu rỗng (lần <code>add</code> đầu phải chạy), số âm, giá trị bằng đúng số lớn thứ k hiện tại.</p>')}
</div>
${maHai('ch06/l2-kth-stream.ts', 'ch06/L2KthStream.java', { vung: 'giai' })}
${ketQua('ch06/l2-kth-stream.ts')}

<div class="ml-en">
<h3>3. ${D.l3}</h3>
<p><strong>Problem.</strong> Rearrange the letters of a string so that no two neighbours are equal; return any valid result, or "" if impossible. <code>"aaabc"</code> → <code>"abaca"</code>; <code>"aaab"</code> → "" (three a's need at least two separators).</p>
<p><strong>Recognising the pattern.</strong> It is Task Scheduler (lesson 6.1) with cooldown 1: the most frequent letter is the danger, so place it as often as allowed.</p>
${gap('💡 Hint 1', '<p>Greedy: at each position, write the letter with the most copies left — except the one you just wrote. When is it impossible? Compare the largest count with the rest.</p>')}
${gap('💡 Hint 2', '<p>Max-heap of (count, letter). Pop the top, write it, and keep it <em>aside</em> for one step; push the previously held letter back before holding the new one.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Count letters, push (letter, count) into a max-heap (ties by letter so the output is deterministic). Loop: pop the top, append it, decrement; if the letter held from the previous step still has copies, push it back; hold the current one. If the loop ends with letters still held, the output is shorter than the input ⇒ return "". Equivalent check up front: impossible iff max count &gt; ⌈n / 2⌉. <strong>Complexity:</strong> n pops and pushes on a heap of at most 26 letters: O(n log 26) = O(n). <strong>Edge cases tried:</strong> one letter ("z"), all counts equal ("aabbcc" → "abcabc"), impossible ("aaab").</p>')}
</div>
<div class="ml-vi">
<h3>3. ${D.l3}</h3>
<p><strong>Đề.</strong> Sắp lại các chữ cái của một chuỗi để không có hai chữ kề nhau giống nhau; trả về một kết quả hợp lệ bất kỳ, hoặc "" nếu không thể. <code>"aaabc"</code> → <code>"abaca"</code>; <code>"aaab"</code> → "" (ba chữ a cần ít nhất hai chữ ngăn cách).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đây là Task Scheduler (bài 6.1) với thời gian nguội 1: chữ xuất hiện nhiều nhất là mối nguy, nên đặt nó dày nhất có thể.</p>
${gap('💡 Gợi ý 1', '<p>Tham lam: ở mỗi vị trí, viết chữ còn nhiều bản nhất — trừ chữ vừa viết. Khi nào thì không thể? So số đếm lớn nhất với phần còn lại.</p>')}
${gap('💡 Gợi ý 2', '<p>Max-heap (số đếm, chữ). Pop đỉnh, viết ra, và để nó <em>sang một bên</em> một bước; đẩy chữ đang giữ từ bước trước trở lại heap rồi mới giữ chữ mới.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Đếm chữ, đẩy (chữ, số đếm) vào max-heap (bằng nhau thì theo thứ tự chữ để output tất định). Lặp: pop đỉnh, nối vào kết quả, giảm đếm; nếu chữ đang giữ từ bước trước còn bản thì push lại; giữ chữ hiện tại. Nếu vòng lặp kết thúc mà vẫn còn chữ đang giữ, kết quả ngắn hơn đầu vào ⇒ trả "". Phép kiểm tương đương làm trước: không thể khi và chỉ khi số đếm lớn nhất &gt; ⌈n / 2⌉. <strong>Độ phức tạp:</strong> n lần pop và push trên heap tối đa 26 chữ: O(n log 26) = O(n). <strong>Ca biên đã thử:</strong> một chữ ("z"), mọi số đếm bằng nhau ("aabbcc" → "abcabc"), không thể ("aaab").</p>')}
</div>
${maHai('ch06/l3-reorganize.ts', 'ch06/L3Reorganize.java', { vung: 'giai' })}
${ketQua('ch06/l3-reorganize.ts')}

<div class="ml-en">
<h3>4. ${D.l4}</h3>
<p><strong>Problem.</strong> Buildings in a row with given heights; you walk from building 0 to the right. Going down or level is free; going up by d costs d bricks or one ladder (a ladder covers any height). With b bricks and L ladders, how far can you get? Heights <code>[3, 8, 6, 12, 13, 9, 15, 20]</code>, 6 bricks, 1 ladder → building 5.</p>
<p><strong>Recognising the pattern.</strong> Ladders are worth most on the <em>biggest</em> climbs — but you only know which climbs are biggest after seeing them. "Keep the L largest so far" is a min-heap of size L (lesson 6.1's gatekeeper again).</p>
${gap('💡 Hint 1', '<p>Pretend you use a ladder on every climb, and fix your mistakes as soon as you run out: which climb should be "paid with bricks instead"?</p>')}
${gap('💡 Hint 2', '<p>Min-heap of climbs currently on ladders. When it holds L + 1 climbs, pop the smallest and pay it with bricks. If bricks go negative, you are stuck at the current building.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> For each upward step d: push d into the heap; if size &gt; L, the smallest climb in it is paid with bricks (pop, subtract); if bricks &lt; 0, return the current index. Reaching the end returns n − 1. The heap is "regret": you reassign the cheapest ladder use to bricks. Trace on the example: climbs 5, 6, 1 reduce bricks to 0 while the ladder keeps the 6; the climb of 6 at building 5 forces paying 6 with bricks: −6 ⇒ stuck at 5. <strong>Complexity:</strong> O(n log L) time, O(L) space. <strong>Edge cases tried:</strong> only downhill (reach the end with nothing), an impossible first climb with 0 bricks and 0 ladders (stay at 0).</p>')}
</div>
<div class="ml-vi">
<h3>4. ${D.l4}</h3>
<p><strong>Đề.</strong> Các toà nhà xếp thành hàng với chiều cao cho trước; bạn đi từ toà 0 sang phải. Đi xuống hoặc ngang thì miễn phí; đi lên d mét tốn d viên gạch hoặc một cái thang (thang leo được mọi độ cao). Có b viên gạch và L cái thang, đi xa nhất tới đâu? Chiều cao <code>[3, 8, 6, 12, 13, 9, 15, 20]</code>, 6 viên gạch, 1 thang → toà 5.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Thang đáng giá nhất khi dùng cho những lần leo <em>cao nhất</em> — nhưng chỉ sau khi thấy các lần leo bạn mới biết lần nào cao nhất. "Giữ L lần lớn nhất tới giờ" là một min-heap kích thước L (lại là người gác cửa của bài 6.1).</p>
${gap('💡 Gợi ý 1', '<p>Cứ giả vờ dùng thang cho mọi lần leo, rồi sửa sai ngay khi hết thang: lần leo nào nên "trả bằng gạch thay vào"?</p>')}
${gap('💡 Gợi ý 2', '<p>Min-heap các lần leo đang dùng thang. Khi nó chứa L + 1 lần leo, pop lần nhỏ nhất và trả bằng gạch. Gạch âm thì bạn kẹt ở toà hiện tại.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Với mỗi bước đi lên d: push d vào heap; nếu size &gt; L, lần leo nhỏ nhất trong heap được trả bằng gạch (pop, trừ đi); nếu gạch &lt; 0 thì trả về chỉ số hiện tại. Đi hết hàng thì trả n − 1. Heap ở đây là "sự hối tiếc": bạn chuyển lần dùng thang rẻ nhất sang trả bằng gạch. Chạy tay ví dụ: các lần leo 5, 6, 1 làm gạch còn 0 trong khi thang giữ lần leo 6; lần leo 6 ở toà 5 buộc trả 6 bằng gạch: −6 ⇒ kẹt ở toà 5. <strong>Độ phức tạp:</strong> O(n log L) thời gian, O(L) bộ nhớ. <strong>Ca biên đã thử:</strong> toàn dốc xuống (tới cuối mà không tốn gì), lần leo đầu tiên không thể với 0 gạch 0 thang (đứng ở 0).</p>')}
</div>
${maHai('ch06/l4-furthest.ts', 'ch06/L4Furthest.java', { vung: 'giai' })}
${ketQua('ch06/l4-furthest.ts')}

<div class="ml-en">
<h3>5. ${D.l5}</h3>
<p><strong>Problem.</strong> Remove every interval that is covered by another one ([a, b] is covered by [c, d] when c ≤ a and b ≤ d); return how many remain. <code>[[1,4],[2,3],[3,6],[2,8],[5,7]]</code> → 2 (only [1,4] and [2,8] survive).</p>
<p><strong>Recognising the pattern.</strong> Covering is about both ends; a sort by start lets you compare only with the furthest end seen so far.</p>
${gap('💡 Hint 1', '<p>After sorting by start, every earlier interval starts no later than the current one. So the current one is covered iff some earlier interval ends no earlier. What single number summarises "some earlier interval"?</p>')}
${gap('💡 Hint 2', '<p>Keep <code>maxEnd</code>. And for equal starts, put the LONGER interval first — otherwise [1,2] before [1,5] is counted as not covered.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Sort by start ascending and, for equal starts, by end <em>descending</em>. Scan: if the end is greater than <code>maxEnd</code>, the interval is not covered — count it and update <code>maxEnd</code>; otherwise it is covered. <strong>Complexity:</strong> O(n log n) for the sort, O(1) extra. <strong>Edge cases tried:</strong> same start ([[1,2],[1,5]] → 1, which only works thanks to the descending tie-break), two identical intervals (one covers the other → 1).</p>')}
<div class="pitfall co-tieu-de"><p><strong>Trap: forgetting the tie-breaker for equal starts.</strong></p><p>Sorting by start only, JavaScript (a stable sort) keeps the input order of [1,2] and [1,5]: if [1,2] comes first it is counted, then [1,5] is counted too — 2 instead of 1. Every interval problem about "covering/containing" needs this secondary key.</p></div>
</div>
<div class="ml-vi">
<h3>5. ${D.l5}</h3>
<p><strong>Đề.</strong> Bỏ mọi khoảng bị một khoảng khác phủ ([a, b] bị [c, d] phủ khi c ≤ a và b ≤ d); trả về còn lại bao nhiêu. <code>[[1,4],[2,3],[3,6],[2,8],[5,7]]</code> → 2 (chỉ [1,4] và [2,8] sống sót).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Phủ" liên quan tới cả hai đầu; sắp theo điểm đầu cho phép chỉ so với điểm cuối xa nhất đã thấy.</p>
${gap('💡 Gợi ý 1', '<p>Sau khi sắp theo điểm đầu, mọi khoảng phía trước đều bắt đầu không muộn hơn khoảng hiện tại. Vậy khoảng hiện tại bị phủ khi và chỉ khi có khoảng phía trước kết thúc không sớm hơn. Một con số nào tóm tắt được "có khoảng phía trước"?</p>')}
${gap('💡 Gợi ý 2', '<p>Giữ <code>maxEnd</code>. Và khi bằng điểm đầu, đặt khoảng DÀI hơn lên trước — không thì [1,2] đứng trước [1,5] sẽ bị đếm là không bị phủ.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Sắp theo điểm đầu tăng dần, bằng điểm đầu thì theo điểm cuối <em>giảm dần</em>. Quét: nếu điểm cuối lớn hơn <code>maxEnd</code>, khoảng đó không bị phủ — đếm và cập nhật <code>maxEnd</code>; ngược lại nó bị phủ. <strong>Độ phức tạp:</strong> O(n log n) cho phép sắp, O(1) bộ nhớ thêm. <strong>Ca biên đã thử:</strong> cùng điểm đầu ([[1,2],[1,5]] → 1, chỉ đúng nhờ tiêu chí phụ giảm dần), hai khoảng giống hệt (khoảng này phủ khoảng kia → 1).</p>')}
<div class="pitfall co-tieu-de"><p><strong>Bẫy: quên tiêu chí phụ khi bằng điểm đầu.</strong></p><p>Chỉ sắp theo điểm đầu thì JavaScript (sort ổn định) giữ nguyên thứ tự đầu vào cho [1,2] và [1,5]: nếu [1,2] đứng trước, nó được đếm, rồi [1,5] cũng được đếm — ra 2 thay vì 1. Mọi bài khoảng có "phủ/chứa" đều cần nghĩ tới tiêu chí phụ này.</p></div>
</div>
${maHai('ch06/l5-covered.ts', 'ch06/L5Covered.java', { vung: 'giai' })}
${ketQua('ch06/l5-covered.ts')}

<div class="ml-en">
<h3>6. ${D.l6}</h3>
<p><strong>Problem.</strong> Each event runs over days [start, end] (closed); you may attend an event on any single day inside it, at most one event per day. Maximise the number of events attended. <code>[[1,3],[1,3],[1,3],[2,2],[4,4]]</code> → 4.</p>
<p><strong>Recognising the pattern.</strong> A scheduling choice under deadlines: "of everything available today, do the one that expires soonest" — earliest-deadline-first, a min-heap of end days.</p>
${gap('💡 Hint 1', '<p>Walk the days in order. On a given day, which of the events that are open today is the best to attend?</p>')}
${gap('💡 Hint 2', '<p>Sort by start; each day push the ends of events starting today, discard ends that are already in the past, then attend (pop) the smallest end.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Sorting by end alone (as in lesson 6.3) fails here because an event can be attended on any day of its range. Instead simulate days: push today’s new events’ end days, pop expired ones (<code>end &lt; day</code>), and if anything remains attend the one ending first. Exchange argument: if an optimal plan attends a later-ending event today, swapping it with the earliest-ending one never hurts. On the example: day 1 attends a [1,3], day 2 attends [2,2] (it ends today — the heap puts it first), day 3 another [1,3], day 4 [4,4]: 4. <strong>Complexity:</strong> O((n + D) log n) with D the last day. <strong>Edge cases tried:</strong> three one-day events on the same day (only 1), events given out of order.</p>')}
</div>
<div class="ml-vi">
<h3>6. ${D.l6}</h3>
<p><strong>Đề.</strong> Mỗi sự kiện kéo dài các ngày [start, end] (đóng); bạn có thể dự một sự kiện vào một ngày bất kỳ trong khoảng đó, mỗi ngày tối đa một sự kiện. Hãy dự được nhiều sự kiện nhất. <code>[[1,3],[1,3],[1,3],[2,2],[4,4]]</code> → 4.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Chọn lịch có hạn chót: "trong mọi thứ đang mở hôm nay, làm cái sắp hết hạn nhất" — hạn chót sớm nhất trước (earliest deadline first), một min-heap các ngày kết thúc.</p>
${gap('💡 Gợi ý 1', '<p>Đi qua từng ngày theo thứ tự. Trong một ngày, giữa các sự kiện đang mở hôm đó, dự cái nào là tốt nhất?</p>')}
${gap('💡 Gợi ý 2', '<p>Sắp theo ngày bắt đầu; mỗi ngày push ngày kết thúc của các sự kiện bắt đầu hôm nay, bỏ những ngày kết thúc đã qua, rồi dự (pop) cái kết thúc sớm nhất.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Chỉ sắp theo điểm cuối (như bài 6.3) không đủ ở đây vì một sự kiện dự được vào bất kỳ ngày nào trong khoảng của nó. Thay vào đó mô phỏng từng ngày: push ngày kết thúc của sự kiện mới mở hôm nay, pop những cái đã hết hạn (<code>end &lt; day</code>), còn gì thì dự cái kết thúc sớm nhất. Lập luận đổi chỗ: nếu một kế hoạch tối ưu hôm nay dự một sự kiện kết thúc muộn hơn, đổi nó lấy sự kiện kết thúc sớm nhất không bao giờ làm hại. Trên ví dụ: ngày 1 dự một [1,3], ngày 2 dự [2,2] (nó hết hạn hôm nay — heap đặt nó lên đầu), ngày 3 một [1,3] khác, ngày 4 [4,4]: 4. <strong>Độ phức tạp:</strong> O((n + D) log n) với D là ngày cuối. <strong>Ca biên đã thử:</strong> ba sự kiện một ngày cùng một ngày (chỉ được 1), sự kiện đưa vào không theo thứ tự.</p>')}
</div>
${maHai('ch06/l6-max-events.ts', 'ch06/L6MaxEvents.java', { vung: 'giai' })}
${ketQua('ch06/l6-max-events.ts')}

<div class="ml-en">
<h3>7. ${D.l7}</h3>
<p><strong>Problem.</strong> n rooms numbered 0…n−1 and meetings [start, end) with distinct starts. Each meeting, in order of start, takes the free room with the lowest number; if none is free it waits for the room that frees up first (lowest number on a tie) and keeps its duration. Return the room that hosted the most meetings (lowest number on a tie). n = 3, <code>[[1,20],[2,10],[3,5],[4,9],[6,8]]</code> → room 1.</p>
<p><strong>Recognising the pattern.</strong> Two different questions are asked at every step — "lowest free room number" and "which busy room frees first" — so two heaps, each ordered by its own question.</p>
${gap('💡 Hint 1', '<p>A min-heap of free room numbers, and a min-heap of busy rooms ordered by (free-at time, room number). Before placing a meeting, move every busy room that is free by its start back into the free heap.</p>')}
${gap('💡 Hint 2', '<p>If no room is free, pop the busy heap: that room hosts the meeting from its free-at time t to t + (end − start). In Java, times must be <code>long</code>: delays accumulate.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Sort meetings by start. For each: release busy rooms with free-at ≤ start into the free heap; if the free heap is non-empty take its smallest room, else take the busy room that frees first and delay the meeting. Count meetings per room, pick the max with the lowest index. Releasing before choosing matters: a room that freed at time 3 must compete by <em>number</em>, not by time. <strong>Complexity:</strong> O(m log m + m log n). <strong>Edge cases tried:</strong> one room (every meeting queues behind the previous one), input not sorted by start, ties in free-at time (room number decides). <strong>Overflow:</strong> with up to 10⁵ meetings each delayed by up to 5·10⁵, end times can exceed 2³¹ — LeetCode’s own tests break <code>int</code> solutions.</p>')}
</div>
<div class="ml-vi">
<h3>7. ${D.l7}</h3>
<p><strong>Đề.</strong> n phòng đánh số 0…n−1 và các cuộc họp [start, end) có giờ bắt đầu khác nhau. Mỗi cuộc họp, theo thứ tự giờ bắt đầu, lấy phòng trống có số nhỏ nhất; nếu không phòng nào trống thì chờ phòng trống sớm nhất (bằng giờ thì số nhỏ hơn) và giữ nguyên thời lượng. Trả về phòng tổ chức nhiều cuộc họp nhất (bằng nhau thì số nhỏ nhất). n = 3, <code>[[1,20],[2,10],[3,5],[4,9],[6,8]]</code> → phòng 1.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Mỗi bước hỏi hai câu khác nhau — "phòng trống số nhỏ nhất" và "phòng bận nào trống sớm nhất" — nên dùng hai heap, mỗi heap xếp theo câu hỏi của riêng nó.</p>
${gap('💡 Gợi ý 1', '<p>Một min-heap số phòng đang trống, và một min-heap phòng đang bận xếp theo (giờ trống, số phòng). Trước khi xếp một cuộc họp, chuyển mọi phòng bận đã trống kịp giờ bắt đầu về heap phòng trống.</p>')}
${gap('💡 Gợi ý 2', '<p>Không phòng nào trống thì pop heap phòng bận: phòng đó tổ chức cuộc họp từ giờ trống t tới t + (end − start). Trong Java, thời gian phải là <code>long</code>: độ trễ cộng dồn.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Sắp cuộc họp theo giờ bắt đầu. Với mỗi cuộc: trả các phòng bận có giờ trống ≤ start về heap phòng trống; heap phòng trống không rỗng thì lấy phòng số nhỏ nhất, không thì lấy phòng bận trống sớm nhất và lùi cuộc họp. Đếm số cuộc họp mỗi phòng, chọn max với chỉ số nhỏ nhất. Trả phòng trước khi chọn là quan trọng: một phòng trống từ lúc 3 phải cạnh tranh bằng <em>số phòng</em>, không phải bằng giờ. <strong>Độ phức tạp:</strong> O(m log m + m log n). <strong>Ca biên đã thử:</strong> một phòng (mọi cuộc họp xếp sau cuộc trước), đầu vào chưa sắp theo giờ bắt đầu, bằng giờ trống (số phòng quyết định). <strong>Tràn số:</strong> với tới 10⁵ cuộc họp, mỗi cuộc bị lùi tới 5·10⁵, giờ kết thúc có thể vượt 2³¹ — chính test của LeetCode đánh trượt các lời giải dùng <code>int</code>.</p>')}
</div>
${maHai('ch06/l7-meeting-rooms-iii.ts', 'ch06/L7MeetingRoomsIII.java', { vung: 'giai' })}
${ketQua('ch06/l7-meeting-rooms-iii.ts')}
<div class="ml-en">
<p>The first example step by step (generated by running the algorithm): rows 4 and 5 are where both heaps work — no free room, so the busy heap decides who waits for whom.</p>
</div>
<div class="ml-vi">
<p>Ví dụ đầu, từng bước (sinh ra bằng cách chạy thuật toán): dòng 4 và 5 là chỗ cả hai heap cùng làm việc — không còn phòng trống, nên heap phòng bận quyết định ai chờ ai.</p>
</div>
${BANG_L7}

<div class="ml-en">
<h3>8. ${D.l8}</h3>
<p><strong>Problem.</strong> k sorted lists; find the smallest range [a, b] that contains at least one number from every list (smaller = shorter, or same length and smaller a). <code>[[1,9,17],[4,10,22],[6,11,20]]</code> → [9, 11] (9 from the first list, 10 from the second, 11 from the third).</p>
<p><strong>Recognising the pattern.</strong> "One element from each of k sorted lists", advancing the smallest — the merge-k heap of lesson 6.1, plus a running maximum.</p>
${gap('💡 Hint 1', '<p>Pick the first element of every list: that is a valid range [min, max]. To possibly shrink it, which element should you replace with its successor?</p>')}
${gap('💡 Hint 2', '<p>Always advance the list holding the current minimum (a min-heap of [value, list, index]); track the max as you push. Stop as soon as one list runs out.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> The heap always holds exactly one value from each list, so [heap min, current max] is always a valid range. Moving any element other than the minimum can only widen it, so pop the minimum, record the range if it is narrower than the best, and push that list’s next value (updating the max). When the popped list has no next value, no later range can include that list: stop. On the example: start {1, 4, 6} → [1, 6] width 5; … at {9, 10, 11} the width is 2: [9, 11]. <strong>Complexity:</strong> O(N log k) for N total numbers. <strong>Edge cases tried:</strong> identical lists ([1, 1]), a list with one element (stops after its first pop), negative values. In Java compare widths as <code>long</code> — values reach ±10⁵ here, but the habit matters.</p>')}
</div>
<div class="ml-vi">
<h3>8. ${D.l8}</h3>
<p><strong>Đề.</strong> Có k danh sách đã sắp; tìm khoảng [a, b] nhỏ nhất chứa ít nhất một số của mỗi danh sách (nhỏ hơn = ngắn hơn, hoặc cùng độ dài và a nhỏ hơn). <code>[[1,9,17],[4,10,22],[6,11,20]]</code> → [9, 11] (9 từ danh sách thứ nhất, 10 từ thứ hai, 11 từ thứ ba).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mỗi danh sách trong k danh sách đã sắp lấy một phần tử", tiến phần tử nhỏ nhất — đúng heap merge-k của bài 6.1, cộng thêm một max đang chạy.</p>
${gap('💡 Gợi ý 1', '<p>Lấy phần tử đầu của mọi danh sách: đó là một khoảng hợp lệ [min, max]. Muốn có cơ hội thu hẹp nó, nên thay phần tử nào bằng phần tử kế tiếp?</p>')}
${gap('💡 Gợi ý 2', '<p>Luôn tiến danh sách đang giữ giá trị nhỏ nhất (min-heap [giá trị, danh sách, chỉ số]); cập nhật max mỗi lần push. Dừng ngay khi một danh sách cạn.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Heap luôn giữ đúng một giá trị của mỗi danh sách, nên [min của heap, max hiện tại] luôn là một khoảng hợp lệ. Tiến bất kỳ phần tử nào khác phần tử nhỏ nhất chỉ có thể làm khoảng rộng ra, nên pop phần tử nhỏ nhất, ghi lại khoảng nếu nó hẹp hơn khoảng tốt nhất, và push giá trị kế tiếp của danh sách đó (cập nhật max). Khi danh sách vừa pop không còn giá trị kế, không khoảng nào về sau còn chứa được danh sách đó: dừng. Trên ví dụ: bắt đầu {1, 4, 6} → [1, 6] rộng 5; … tới {9, 10, 11} độ rộng là 2: [9, 11]. <strong>Độ phức tạp:</strong> O(N log k) với N tổng số phần tử. <strong>Ca biên đã thử:</strong> các danh sách giống hệt ([1, 1]), danh sách chỉ một phần tử (dừng sau lần pop đầu của nó), giá trị âm. Trong Java so độ rộng bằng <code>long</code> — ở đây giá trị chỉ tới ±10⁵, nhưng thói quen mới là thứ quan trọng.</p>')}
</div>
${maHai('ch06/l8-smallest-range.ts', 'ch06/L8SmallestRange.java', { vung: 'giai' })}
${ketQua('ch06/l8-smallest-range.ts')}

<div class="ml-en">
<h3>🧪 Practice (one week)</h3>
<div class="callout ok"><ol>
<li>Day 1–2: problems 1–4, timed (15′/15′/25′/25′), out loud. Submit each before opening its solution.</li>
<li>Day 3–4: problems 5–6, then redo 6.3’s LC 2406 and LC 452 from memory in your weaker language.</li>
<li>Day 5–7: problems 7–8 (40′ each). For problem 7, draw the two heaps for the example on paper before coding, and compare with the table above.</li>
<li>For every problem write one line in your notebook: <em>signal → which heap / which sort → the mistake I made</em>.</li>
</ol>
<p><strong>Done when:</strong> eight accepted submissions, at least six within the target time, and eight notebook lines.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">gatekeeper heap</span><span class="v">A heap of size k whose top decides who gets in (top-k, ladders).</span></div>
  <div class="kv"><span class="k">hold back one step</span><span class="v">Keep the last used item out of the heap for one round (Reorganize String).</span></div>
  <div class="kv"><span class="k">regret</span><span class="v">Undo the cheapest earlier choice when a constraint is exceeded (ladders → bricks).</span></div>
  <div class="kv"><span class="k">earliest deadline first</span><span class="v">Among available jobs, do the one that expires soonest.</span></div>
  <div class="kv"><span class="k">tie-breaker</span><span class="v">The secondary sort key that decides equal primary keys (end descending, room number).</span></div>
  <div class="kv"><span class="k">merge-k frontier</span><span class="v">One current element per list held in a heap.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Every heap problem starts with two decisions: what is on top (min or max), and ordered by what.</li>
<li>Size-k heaps keep the best k; when a constraint breaks, pop the cheapest to "regret" it.</li>
<li>Greedy + heap needs a delay when the same item cannot be used twice in a row.</li>
<li>Interval problems hinge on the sort key and the tie-breaker; covering needs end descending.</li>
<li>Two questions at every step ⇒ two heaps, each ordered by its own question.</li>
<li>In Java, times and widths that accumulate need <code>long</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Heap / Priority Queue and Intervals', 'The standard problem order for both patterns, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java PriorityQueue (Java SE 21 API)', 'offer / poll / peek, comparator constructors', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một tuần)</h3>
<div class="callout ok"><ol>
<li>Ngày 1–2: đề 1–4, bấm giờ (15′/15′/25′/25′), nói to. Nộp từng đề trước khi mở lời giải của nó.</li>
<li>Ngày 3–4: đề 5–6, rồi làm lại LC 2406 và LC 452 của bài 6.3 từ trí nhớ bằng ngôn ngữ bạn yếu hơn.</li>
<li>Ngày 5–7: đề 7–8 (40′ mỗi đề). Với đề 7, vẽ hai heap của ví dụ ra giấy trước khi code, rồi so với bảng ở trên.</li>
<li>Mỗi đề ghi một dòng vào sổ: <em>dấu hiệu → heap nào / sắp kiểu gì → lỗi mình đã mắc</em>.</li>
</ol>
<p><strong>Đạt khi:</strong> tám lượt nộp Accepted, ít nhất sáu đề trong thời gian mục tiêu, và tám dòng trong sổ.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">gatekeeper heap (heap gác cửa)</span><span class="v">Heap kích thước k mà đỉnh quyết định ai được vào (top-k, thang).</span></div>
  <div class="kv"><span class="k">hold back one step (giữ lại một bước)</span><span class="v">Để phần tử vừa dùng ra ngoài heap một vòng (Reorganize String).</span></div>
  <div class="kv"><span class="k">regret (hối tiếc)</span><span class="v">Hoàn lại lựa chọn rẻ nhất trước đó khi vượt một ràng buộc (thang → gạch).</span></div>
  <div class="kv"><span class="k">earliest deadline first (hạn chót sớm nhất trước)</span><span class="v">Trong các việc đang làm được, làm việc sắp hết hạn nhất.</span></div>
  <div class="kv"><span class="k">tie-breaker (tiêu chí phụ)</span><span class="v">Khoá sắp thứ hai quyết định khi khoá chính bằng nhau (điểm cuối giảm dần, số phòng).</span></div>
  <div class="kv"><span class="k">merge-k frontier (biên gộp k)</span><span class="v">Mỗi danh sách một phần tử hiện tại, giữ trong một heap.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi đề heap bắt đầu bằng hai quyết định: cái gì nằm trên đỉnh (min hay max), và xếp theo gì.</li>
<li>Heap kích thước k giữ k cái tốt nhất; khi vượt ràng buộc thì pop cái rẻ nhất để "hối tiếc" nó.</li>
<li>Tham lam + heap cần một bước giữ lại khi cùng một thứ không được dùng hai lần liền.</li>
<li>Bài khoảng xoay quanh khoá sắp và tiêu chí phụ; bài "phủ" cần điểm cuối giảm dần.</li>
<li>Mỗi bước hỏi hai câu ⇒ hai heap, mỗi heap xếp theo câu hỏi của nó.</li>
<li>Trong Java, thời gian và độ rộng có cộng dồn cần <code>long</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Heap / Priority Queue và Intervals', 'Thứ tự đề chuẩn cho cả hai mẫu, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java PriorityQueue (Java SE 21 API)', 'offer / poll / peek, các hàm khởi tạo nhận comparator', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/PriorityQueue.html')}
</div>
`,
};
