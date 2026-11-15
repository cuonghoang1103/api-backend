/** 3.2 — Queue và deque. Mọi mã/output đọc từ ../ma/ch03 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetSlidingMax } from '../ma/ch03/sliding-max.vet.mjs';

const A = [1, 3, -1, -3, 5, 3, 6, 7];
const K = 3;
const vs = vetSlidingMax(A, K);
const BANG = bangVet(['i', 'nums (window green, i blue)', 'deque operations', 'deque (indices)', 'deque values', 'window max'],
  vs.map((h) => {
    const to = {};
    for (let j = h.tu; j <= h.i; j++) to[j] = 'cs';
    to[h.i] = 'l';
    if (h.max !== null) to[h.dq[0]] = to[h.dq[0]] === 'l' ? 'l' : 'ok';
    return [
      String(h.i),
      oMang(A, { to, nhan: h.max !== null ? { [h.dq[0]]: 'max' } : {} }),
      h.viec.join('<br>'),
      `<code>[${h.dq.join(', ')}]</code>`,
      `<code>[${h.dq.map((j) => A[j]).join(', ')}]</code>`,
      h.max === null ? '— (window not full)' : `<strong>${h.max}</strong>`,
    ];
  }));
const SO_BO_SAU = vs.reduce((s, h) => s + h.viec.filter((v) => v.startsWith('pop back')).reduce((t, v) => t + v.split(',').length, 0), 0);

const DE = [
  [lc(232, 'implement-queue-using-stacks', 'Implement Queue using Stacks', 'Easy'), 'Inbox + outbox; refill the outbox only when it is empty ⇒ amortised O(1).', 'Hộp vào + hộp ra; chỉ đổ sang hộp ra khi nó rỗng ⇒ O(1) khấu hao.'],
  [lc(225, 'implement-stack-using-queues', 'Implement Stack using Queues', 'Easy'), 'The mirror exercise: after each push, rotate the queue so the newest is at the front.', 'Bài ngược lại: sau mỗi push, xoay hàng đợi để phần tử mới nhất ra đầu.'],
  [lc(933, 'number-of-recent-calls', 'Number of Recent Calls', 'Easy'), 'Timestamps in a queue; drop the front while it is too old = sliding log.', 'Hàng đợi mốc thời gian; bỏ đầu hàng khi đã quá cũ = sliding log.'],
  [lc(2073, 'time-needed-to-buy-tickets', 'Time Needed to Buy Tickets', 'Easy'), 'Simulate the line once, then find the O(n) formula without simulating.', 'Mô phỏng hàng người một lần, rồi tìm công thức O(n) không cần mô phỏng.'],
  [lc(622, 'design-circular-queue', 'Design Circular Queue', 'Medium'), 'Fixed array + head + count; tail = (head + count) % cap.', 'Mảng cố định + head + số phần tử; tail = (head + count) % cap.'],
  [lc(641, 'design-circular-deque', 'Design Circular Deque', 'Medium'), 'Same ring, plus insertFront: head = (head − 1 + cap) % cap.', 'Cùng vòng đó, thêm insertFront: head = (head − 1 + cap) % cap.'],
  [lc(649, 'dota2-senate', 'Dota2 Senate', 'Medium'), 'Two queues of indices; the smaller index acts first and re-queues at i + n.', 'Hai hàng đợi chỉ số; chỉ số nhỏ hơn hành động trước và xếp lại ở i + n.'],
  [lc(1091, 'shortest-path-in-binary-matrix', 'Shortest Path in Binary Matrix', 'Medium'), 'Unweighted shortest path ⇒ BFS; mark visited when you enqueue.', 'Đường ngắn nhất không trọng số ⇒ BFS; đánh dấu đã thăm lúc đưa vào hàng.'],
  [lc(239, 'sliding-window-maximum', 'Sliding Window Maximum', 'Hard'), 'Monotonic decreasing deque of indices; front = max, drop it when it leaves.', 'Deque giảm dần chứa chỉ số; đầu = max, bỏ khi nó rời cửa sổ.'],
  [lc(1696, 'jump-game-vi', 'Jump Game VI', 'Medium'), 'DP where dp[i] needs the max of the last k dp values ⇒ the same deque.', 'Quy hoạch động mà dp[i] cần max của k giá trị dp gần nhất ⇒ đúng cái deque đó.'],
  [lc(862, 'shortest-subarray-with-sum-at-least-k', 'Shortest Subarray with Sum at Least K', 'Hard'), 'Negative numbers break the sliding window; an increasing deque of prefix sums fixes it.', 'Số âm phá hỏng cửa sổ trượt; deque tăng dần trên tổng tiền tố sửa được.'],
  [lc(346, 'moving-average-from-data-stream', 'Moving Average from Data Stream', 'Easy', { premium: true }), 'Premium. Free equivalent: LintCode 642 — a queue of the last k values + a running sum.', 'Premium. Bản miễn phí tương đương: LintCode 642 — hàng đợi k giá trị gần nhất + tổng chạy.'],
];

export default {
  title: '3.2 — Queues and deques: BFS order, sliding window maximum|||3.2 — Queue và deque: thứ tự BFS, max cửa sổ trượt',
  slug: 'dsa-3-2-queue',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Queue bằng hai stack, mảng vòng, deque đơn điệu cho sliding window maximum, sliding log và BFS mở màn — kèm số đo thật vì sao Array.shift() trong JS sập ở khoảng 12–16 nghìn phần tử.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Queues and deques: BFS order, sliding window maximum</h2>
<p class="lead">A stack serves the newest first; a queue serves <strong>whoever has waited the longest</strong>. That single rule gives you fairness (requests, print jobs, a line of students), and it gives you <em>order by distance</em> — the reason BFS finds shortest paths. Add the ability to work at both ends and you get a <strong>deque</strong>, which powers one of the most-asked hard problems, Sliding Window Maximum. And in JavaScript there is a trap worth real money: the obvious queue, <code>Array.shift()</code>, is fast in your tests and collapses in production. We measure exactly where.</p>

<h3>The everyday picture</h3>
<p>The lunch line at the canteen: you join at the back, the person at the front is served, nobody is served out of turn. That is a <strong>queue</strong>, <strong>FIFO</strong> — first in, first out. Now imagine a bus with a front door and a back door, where people can get on or off at either end: that is a <strong>deque</strong> (double-ended queue, pronounced "deck"). A real system on this website is a mix: the AI request queue lets the robot cut to the front of the line — something a pure queue cannot do and a deque can.</p>
<p>Operations, all <strong>O(1)</strong> when implemented properly: <code>enqueue</code> (Java <code>offer</code>, add at the back), <code>dequeue</code> (Java <code>poll</code>, remove from the front), <code>peek</code> (read the front). A deque adds <code>pushFront</code>/<code>popBack</code> (Java <code>offerFirst</code>/<code>pollLast</code>). Java gives you <code>ArrayDeque</code>; JavaScript gives you nothing built in — and that is where the trouble starts.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">enqueue A, B, C</span><span class="lz-d">front [A, B, C] back</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">dequeue → A</span><span class="lz-d">the first in leaves first</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">enqueue D</span><span class="lz-d">[B, C, D]</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">deque: pushFront X</span><span class="lz-d">[X, B, C, D] — cutting the line</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Queue và deque: thứ tự BFS, max cửa sổ trượt</h2>
<p class="lead">Stack phục vụ người mới nhất trước; queue (hàng đợi) phục vụ <strong>người đã chờ lâu nhất</strong>. Chỉ một quy tắc đó mang lại sự công bằng (request, lệnh in, một hàng sinh viên), và mang lại <em>thứ tự theo khoảng cách</em> — lý do BFS tìm được đường ngắn nhất. Thêm khả năng thao tác ở cả hai đầu ta có <strong>deque</strong> (hàng đợi hai đầu), thứ đứng sau một trong những đề khó bị hỏi nhiều nhất, Sliding Window Maximum. Và trong JavaScript có một cái bẫy đáng giá thật: cách làm hàng đợi hiển nhiên nhất, <code>Array.shift()</code>, chạy nhanh trong test của bạn rồi sập ở production. Ta sẽ đo chính xác nó sập ở đâu.</p>

<h3>Hình dung đời thường</h3>
<p>Hàng lấy cơm ở căng-tin: bạn đứng vào cuối hàng, người đầu hàng được phục vụ, không ai được lấy trước lượt. Đó là <strong>queue</strong>, <strong>FIFO</strong> (first in, first out — vào trước, ra trước). Giờ hình dung một chiếc xe buýt có cửa trước và cửa sau, người lên xuống được ở cả hai đầu: đó là <strong>deque</strong> (double-ended queue, đọc là "đéc"). Một hệ thống thật trên chính trang này là thứ lai giữa hai cái: hàng đợi gọi AI cho phép robot chen lên đầu hàng — việc mà queue thuần không làm được còn deque thì làm được.</p>
<p>Các thao tác, đều <strong>O(1)</strong> nếu cài đúng: <code>enqueue</code> (đưa vào — Java <code>offer</code>, thêm ở cuối), <code>dequeue</code> (lấy ra — Java <code>poll</code>, gỡ ở đầu), <code>peek</code> (đọc đầu hàng). Deque thêm <code>pushFront</code>/<code>popBack</code> (Java <code>offerFirst</code>/<code>pollLast</code>). Java cho sẵn <code>ArrayDeque</code>; JavaScript không cho sẵn gì cả — và rắc rối bắt đầu từ đó.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">enqueue A, B, C</span><span class="lz-d">đầu [A, B, C] cuối</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">dequeue → A</span><span class="lz-d">vào trước thì ra trước</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">enqueue D</span><span class="lz-d">[B, C, D]</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">deque: pushFront X</span><span class="lz-d">[X, B, C, D] — chen lên đầu hàng</span></div>
</div>
${csd('csd201-stack-queue-cai-dat', 'vi', '2.2 Cài đặt stack &amp; queue: mảng vòng vs liên kết', '<p>Ở CSD201 bạn đã cài queue bằng mảng vòng và bằng danh sách liên kết. Ôn nhanh: mảng vòng dùng hai chỉ số quay vòng bằng phép %, nên không bao giờ phải dời phần tử. <strong>Ở đây đi sâu thêm:</strong> vì sao cách "dời phần tử" (<code>shift()</code>, <code>remove(0)</code>) lại là thứ người ta viết thật trong phỏng vấn và trong code đi làm — và nó tốn bao nhiêu, đo bằng số.</p>')}
${csd('csd201-deque', 'vi', '2.4 Deque &amp; bài toán cửa sổ trượt', '<p>Bài CSD201 giới thiệu deque và ý tưởng cửa sổ trượt. Ở đây ta biến nó thành <strong>deque đơn điệu</strong> (monotonic deque) — giữ cho deque luôn giảm dần để đầu deque luôn là max của cửa sổ — và chạy bảng vết từng bước để thấy vì sao tổng chi phí chỉ là O(n).</p>')}
</div>

<div class="ml-en">
<h3>Signals: when the answer is a queue or a deque</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"in the order they arrived"</span><span class="v">Processing requests, tasks, messages, people in line — fairness means FIFO.</span></div>
  <div class="kv"><span class="k">"minimum number of steps / moves / levels"</span><span class="v">Unweighted shortest path, level-order traversal, spreading (rotting oranges, fire, infection): BFS with a queue.</span></div>
  <div class="kv"><span class="k">"in the last k elements / the last t seconds"</span><span class="v">Old items leave from the front as new ones arrive at the back: moving average, recent calls, rate limiting.</span></div>
  <div class="kv"><span class="k">"max (or min) of every window of size k"</span><span class="v">A monotonic deque: O(n) instead of O(n·k).</span></div>
  <div class="kv"><span class="k">"design a queue / buffer with a fixed capacity"</span><span class="v">A circular array (ring buffer).</span></div>
  <div class="kv"><span class="k">TypeScript and a queue that may hold more than ~10⁴ items</span><span class="v">Never <code>shift()</code> it. Use a head index or a ring buffer (measured below).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đáp án là queue hay deque</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"theo thứ tự đến"</span><span class="v">Xử lý request, tác vụ, tin nhắn, người xếp hàng — công bằng nghĩa là FIFO.</span></div>
  <div class="kv"><span class="k">"số bước / số nước / số tầng ít nhất"</span><span class="v">Đường ngắn nhất không trọng số, duyệt theo tầng, lan truyền (cam thối, cháy rừng, lây nhiễm): BFS với một queue.</span></div>
  <div class="kv"><span class="k">"trong k phần tử gần nhất / t giây gần nhất"</span><span class="v">Thứ cũ rời khỏi đầu khi thứ mới vào ở cuối: trung bình trượt, số lời gọi gần đây, giới hạn tốc độ.</span></div>
  <div class="kv"><span class="k">"max (hoặc min) của mọi cửa sổ độ dài k"</span><span class="v">Deque đơn điệu: O(n) thay vì O(n·k).</span></div>
  <div class="kv"><span class="k">"thiết kế hàng đợi / bộ đệm có sức chứa cố định"</span><span class="v">Mảng vòng (ring buffer — bộ đệm vòng).</span></div>
  <div class="kv"><span class="k">TypeScript và một hàng đợi có thể chứa hơn ~10⁴ phần tử</span><span class="v">Đừng bao giờ <code>shift()</code> nó. Dùng chỉ số đầu hàng hoặc ring buffer (đo ngay dưới đây).</span></div>
</div>
</div>

<div class="ml-en">
<h3>The JavaScript trap first: <code>Array.shift()</code>, measured</h3>
<p><code>shift()</code> removes the first element of an array — which, in principle, means moving every other element one slot to the left: O(n) per call, O(n²) for a whole BFS. In practice V8 has an optimisation ("left-trimming") that makes it cheap for small arrays, so your tests look fine. The question is where "small" ends. Here are three queues on a BFS-like workload (n/2 items waiting, then n rounds of enqueue-one, dequeue-one): plain <code>shift()</code>; an array plus a <em>head index</em> that never removes anything; and a small ring-buffer deque you can write in an interview:</p>
</div>
<div class="ml-vi">
<h3>Bẫy của JavaScript trước đã: <code>Array.shift()</code>, đo bằng số</h3>
<p><code>shift()</code> gỡ phần tử đầu của mảng — về nguyên tắc nghĩa là dời mọi phần tử còn lại sang trái một ô: O(n) mỗi lần gọi, O(n²) cho cả một lượt BFS. Trên thực tế V8 có một phép tối ưu ("left-trimming" — cắt đầu tại chỗ) khiến nó rẻ với mảng nhỏ, nên test của bạn trông vẫn ổn. Câu hỏi là "nhỏ" kết thúc ở đâu. Dưới đây là ba kiểu hàng đợi trên một khối việc giống BFS (n/2 phần tử đang chờ, rồi n vòng: đưa vào một, lấy ra một): <code>shift()</code> thường; mảng cộng một <em>chỉ số đầu hàng</em> (head index) không bao giờ gỡ gì; và một deque ring buffer nhỏ mà bạn viết được ngay trong buổi phỏng vấn:</p>
</div>
${ma('ch03/queue-do.ts', { vung: 'deque', nhan: 'TypeScript — ring-buffer deque' })}
${ketQua('ch03/queue-do.ts')}
${ketQua('ch03/QueueDo.java')}
<div class="ml-en">
<p>Read it carefully, because it is surprising. Up to n = 20,000 (about 10,000 items in the queue) <code>shift()</code> is within a millisecond — V8's trick works. At n = 100,000 (50,000 waiting) it suddenly costs <strong>863 ms</strong> against 1.15 ms for the head index — 750× slower; doubling n to 200,000 multiplies it by 5.6 (4,854 ms): that is the quadratic curve. The head-index queue and the ring deque stay linear all the way to a million (≈13 ms). Java shows the same story without the trick: <code>ArrayList.remove(0)</code> copies the array every time (4.9 ms → 513 ms from 10⁴ to 10⁵), while <code>ArrayDeque</code> handles a million in about 5 ms — faster than <code>LinkedList</code> because it does not allocate a node per element.</p>
<p>Interview rule: in TypeScript, write BFS with <code>let head = 0; while (head &lt; q.length) { const x = q[head++]; … }</code>. It is one line longer than <code>shift()</code> and it is never the reason you time out. If you need both ends, use the deque class above.</p>
</div>
<div class="ml-vi">
<p>Đọc kỹ, vì nó bất ngờ. Tới n = 20.000 (khoảng 10.000 phần tử trong hàng) <code>shift()</code> vẫn dưới một mili giây — mẹo của V8 có tác dụng. Tới n = 100.000 (50.000 người đang chờ), nó đột ngột tốn <strong>863 ms</strong> so với 1,15 ms của chỉ số đầu hàng — chậm hơn 750 lần; nhân đôi n lên 200.000 thì thời gian nhân 5,6 (4.854 ms): đó là đường cong bậc hai. Hàng đợi chỉ-số-đầu và deque vòng giữ tuyến tính tới tận một triệu (≈13 ms). Java kể cùng câu chuyện mà không có mẹo nào: <code>ArrayList.remove(0)</code> chép lại mảng mỗi lần (4,9 ms → 513 ms từ 10⁴ lên 10⁵), còn <code>ArrayDeque</code> xử lý một triệu trong khoảng 5 ms — nhanh hơn <code>LinkedList</code> vì không phải cấp phát một nút cho mỗi phần tử.</p>
<p>Luật khi phỏng vấn: trong TypeScript, viết BFS bằng <code>let head = 0; while (head &lt; q.length) { const x = q[head++]; … }</code>. Nó chỉ dài hơn <code>shift()</code> một dòng và không bao giờ là lý do bạn bị quá giờ. Cần cả hai đầu thì dùng lớp deque ở trên.</p>
</div>
<div class="ml-en">
<p>Where exactly does the cheap <code>shift()</code> stop? A second, smaller measurement: fill an array with n numbers, then empty it with <code>shift()</code>, and divide by n.</p>
</div>
<div class="ml-vi">
<p>Chính xác thì <code>shift()</code> rẻ tới đâu? Một phép đo thứ hai, nhỏ hơn: đổ n số vào mảng, rồi rút cạn bằng <code>shift()</code>, và chia cho n.</p>
</div>
${ma('ch03/shift-nguong.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch03/shift-nguong.ts')}
<div class="ml-en">
<p>About 30 ns per call up to 12,000 elements, then 1,159 ns at 16,000 — a 38× jump — and from there the cost <em>per call</em> keeps growing with the array (3,442 ns at 40,000), which is exactly what "O(n) per shift" looks like. The cliff is an implementation detail of this V8 version, not a promise: it can move between Node releases. That is the real lesson — do not build on an optimisation you cannot see in the language specification.</p>
</div>
<div class="ml-vi">
<p>Khoảng 30 ns mỗi lần gọi cho tới 12.000 phần tử, rồi 1.159 ns ở 16.000 — nhảy 38 lần — và từ đó chi phí <em>mỗi lần gọi</em> cứ tăng theo kích thước mảng (3.442 ns ở 40.000), đúng hình hài của "O(n) mỗi lần shift". Vách đá này là chi tiết cài đặt của phiên bản V8 này, không phải lời hứa: nó có thể dịch chuyển giữa các bản Node. Đó mới là bài học thật — đừng xây trên một phép tối ưu mà bạn không thấy trong đặc tả của ngôn ngữ.</p>
</div>

<div class="ml-en">
<h3>Pattern 1 — a queue from two stacks (LC 232)</h3>
<p>A classic "can you reason about amortised cost?" question. Keep an <em>inbox</em> stack for pushes and an <em>outbox</em> stack for pops. Popping from the outbox gives the oldest element — because pouring the inbox into the outbox reverses it. The crucial rule: <strong>pour only when the outbox is empty</strong>. Then every element is moved from inbox to outbox at most once in its life, so n operations cost O(n) moves in total.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 1 — queue từ hai stack (LC 232)</h3>
<p>Một câu hỏi kinh điển kiểu "bạn có lập luận được chi phí khấu hao không?". Giữ một stack <em>hộp vào</em> (inbox) cho push và một stack <em>hộp ra</em> (outbox) cho pop. Pop từ hộp ra cho phần tử cũ nhất — vì đổ hộp vào sang hộp ra làm thứ tự bị đảo ngược. Quy tắc then chốt: <strong>chỉ đổ khi hộp ra đã rỗng</strong>. Khi đó mỗi phần tử chỉ bị chuyển từ hộp vào sang hộp ra tối đa một lần trong đời, nên n thao tác tốn tổng cộng O(n) lần chuyển.</p>
</div>
${maHai('ch03/queue-hai-stack.ts', 'ch03/QueueHaiStack.java', { vung: 'giai' })}
${ketQua('ch03/queue-hai-stack.ts')}
<div class="ml-en">
<p>The second line is the amortised argument, measured: 200,000 operations caused exactly 100,000 element moves — 0.50 moves per operation. One unlucky <code>pop</code> may move 30,000 elements at once; on average it is O(1). If you poured on every pop instead of only when the outbox is empty, the order would break as well as the cost.</p>
</div>
<div class="ml-vi">
<p>Dòng thứ hai là lập luận khấu hao, đo bằng số: 200.000 thao tác gây ra đúng 100.000 lần chuyển phần tử — 0,50 lần chuyển mỗi thao tác. Một lần <code>pop</code> xui xẻo có thể chuyển 30.000 phần tử một lúc; tính trung bình vẫn là O(1). Nếu đổ ở MỌI lần pop thay vì chỉ khi hộp ra rỗng, cả thứ tự lẫn chi phí đều hỏng.</p>
</div>

<div class="ml-en">
<h3>Pattern 2 — the ring buffer (LC 622 Design Circular Queue)</h3>
<p>A fixed array of capacity <code>cap</code>, an index <code>head</code> for the front, and a <code>size</code>. The back is not stored — it is <code>(head + size) % cap</code>. Why store a size instead of a tail index? Because with only <code>head</code> and <code>tail</code>, "full" and "empty" both look like <code>head === tail</code>; you would have to waste one slot or add a flag. The count makes both tests trivial.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — bộ đệm vòng (LC 622 Design Circular Queue)</h3>
<p>Một mảng cố định sức chứa <code>cap</code>, một chỉ số <code>head</code> cho đầu hàng, và một biến <code>size</code>. Cuối hàng không lưu — nó là <code>(head + size) % cap</code>. Vì sao lưu số phần tử thay cho chỉ số cuối? Vì nếu chỉ có <code>head</code> và <code>tail</code>, "đầy" và "rỗng" đều trông như <code>head === tail</code>; bạn sẽ phải bỏ phí một ô hoặc thêm một cờ. Có biến đếm thì cả hai phép kiểm trở nên tầm thường.</p>
</div>
${maHai('ch03/circular-queue.ts', 'ch03/CircularQueue.java', { vung: 'giai' })}
${ketQua('ch03/circular-queue.ts')}
<div class="ml-en">
<p>Trace the third line: after one <code>deQueue</code>, <code>head</code> is 1 and the new 4 is written at <code>(1 + 2) % 3 = 0</code> — the slot that 1 used to occupy. Nothing moved; the indices wrapped. That is why ring buffers are everywhere a fixed memory budget matters: audio buffers, network card queues, logging (keep the last N lines).</p>
</div>
<div class="ml-vi">
<p>Lần theo dòng thứ ba: sau một lần <code>deQueue</code>, <code>head</code> là 1 và số 4 mới được ghi ở <code>(1 + 2) % 3 = 0</code> — đúng ô số 1 từng chiếm. Không phần tử nào bị dời; chỉ số quay vòng. Vì vậy ring buffer có mặt ở mọi nơi mà ngân sách bộ nhớ cố định quan trọng: bộ đệm âm thanh, hàng đợi của card mạng, ghi log (giữ N dòng cuối).</p>
</div>

<div class="ml-en">
<h3>Worked example: Sliding Window Maximum (LC 239)</h3>
<p><strong>Problem (in our words).</strong> Given <code>nums</code> and a window size <code>k</code>, return the maximum of every window of k consecutive elements as the window slides from left to right. <code>[1, 3, −1, −3, 5, 3, 6, 7]</code>, k = 3 → <code>[3, 3, 5, 5, 6, 7]</code>.</p>
<p><strong>Brute force.</strong> For each of the n − k + 1 windows, scan k elements: O(n·k). With n = 10⁵ and k = 5·10⁴ that is billions of steps. A heap gives O(n log n) — a good intermediate answer to mention.</p>
<p><strong>The insight.</strong> When a new element x enters the window, every element in the window that is <em>smaller than or equal to x and older than x</em> can never be a window maximum again: x is at least as big and will stay in the window longer. So throw them away — from the <em>back</em>, because those are the most recent. What remains is decreasing from front to back, and the front is the maximum. The front also leaves when it falls out of the window — from the <em>front</em>. Both ends are needed: a deque.</p>
<p><strong>The invariant:</strong> <em>"the deque holds indices inside the current window, and their values are strictly decreasing from front to back."</em> Four steps per element: drop the front if it left the window; pop the back while it is ≤ x; push x's index at the back; once the first window is full, the front is the answer.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Sliding Window Maximum (LC 239)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho <code>nums</code> và độ dài cửa sổ <code>k</code>, trả về giá trị lớn nhất của mọi cửa sổ gồm k phần tử liên tiếp khi cửa sổ trượt từ trái sang phải. <code>[1, 3, −1, −3, 5, 3, 6, 7]</code>, k = 3 → <code>[3, 3, 5, 5, 6, 7]</code>.</p>
<p><strong>Vét cạn.</strong> Với mỗi cửa sổ trong n − k + 1 cửa sổ, quét k phần tử: O(n·k). Với n = 10⁵ và k = 5·10⁴ là hàng tỷ bước. Dùng heap được O(n log n) — một câu trả lời trung gian tốt để nhắc tới.</p>
<p><strong>Ý chính.</strong> Khi phần tử mới x vào cửa sổ, mọi phần tử trong cửa sổ mà <em>nhỏ hơn hoặc bằng x và cũ hơn x</em> sẽ không bao giờ còn là max của cửa sổ nào nữa: x lớn ít nhất bằng chúng và còn ở lại trong cửa sổ lâu hơn. Vậy vứt chúng đi — từ phía <em>cuối</em>, vì đó là những phần tử mới nhất. Phần còn lại giảm dần từ đầu tới cuối, và đầu là max. Đầu cũng phải rời đi khi nó rơi khỏi cửa sổ — từ phía <em>đầu</em>. Cần cả hai đầu: một deque.</p>
<p><strong>Bất biến:</strong> <em>"deque chứa chỉ số nằm trong cửa sổ hiện tại, và giá trị của chúng giảm hẳn từ đầu tới cuối."</em> Bốn bước cho mỗi phần tử: bỏ đầu nếu nó đã rời cửa sổ; pop cuối chừng nào nó ≤ x; push chỉ số của x vào cuối; khi cửa sổ đầu tiên đã đủ, đầu deque là đáp án.</p>
</div>
${maHai('ch03/sliding-max.ts', 'ch03/SlidingMax.java', { vung: 'deque' })}
${ketQua('ch03/sliding-max.ts')}
${ketQua('ch03/SlidingMax.java')}
<div class="ml-en">
<p>The TypeScript version keeps the deque as an array with two indices, <code>head</code> and <code>tail</code>, exactly so it never calls <code>shift()</code>. The Java version uses <code>ArrayDeque</code>'s <code>peekFirst/pollFirst/peekLast/pollLast/offerLast</code> — say the four names out loud, they make the two ends explicit.</p>
<h3>Watch the deque</h3>
<p>Green = the window, blue = the new element, the label "max" marks the front of the deque. Every row is one iteration of the real algorithm.</p>
</div>
<div class="ml-vi">
<p>Bản TypeScript giữ deque là một mảng với hai chỉ số <code>head</code> và <code>tail</code>, chính để không bao giờ gọi <code>shift()</code>. Bản Java dùng <code>peekFirst/pollFirst/peekLast/pollLast/offerLast</code> của <code>ArrayDeque</code> — hãy đọc to bốn cái tên đó, chúng làm rõ bạn đang thao tác ở đầu nào.</p>
<h3>Nhìn deque chạy</h3>
<p>Xanh lá = cửa sổ, xanh dương = phần tử mới, nhãn "max" đánh dấu đầu deque. Mỗi dòng là một vòng lặp của thuật toán thật.</p>
</div>
${BANG}
<div class="ml-en">
<p>Row 1: 3 arrives and pops 1 from the back — 1 is older and smaller, it is finished. Row 4: first the front (3, index 1) has left the window [2..4], so it is dropped from the front; then 5 pops −3 and −1 from the back — the deque collapses to just [4]. Row 6: 6 pops 3 and 5. In total there were ${SO_BO_SAU} pops from the back over ${A.length} elements; each index enters once and leaves once (from one end or the other), so the whole run is <strong>O(n) amortised</strong>, with O(k) extra memory.</p>
${moPhong('ch03/sliding-max.sim.js', 'en', 'Sliding Window Maximum — monotonic deque', 'Watch elements leave from the front (too old) and from the back (can never win); edit A and K and run again.')}
</div>
<div class="ml-vi">
<p>Dòng 1: 3 tới và pop 1 khỏi cuối — 1 cũ hơn và nhỏ hơn, hết vai. Dòng 4: trước hết đầu deque (3, chỉ số 1) đã rời cửa sổ [2..4] nên bị bỏ từ phía đầu; rồi 5 pop −3 và −1 khỏi cuối — deque co lại chỉ còn [4]. Dòng 6: 6 pop 3 và 5. Tổng cộng có ${SO_BO_SAU} lần pop từ cuối trên ${A.length} phần tử; mỗi chỉ số vào một lần và ra một lần (từ đầu này hoặc đầu kia), nên cả lượt chạy là <strong>O(n) khấu hao</strong>, bộ nhớ phụ O(k).</p>
${moPhong('ch03/sliding-max.sim.js', 'vi', 'Sliding Window Maximum — deque đơn điệu', 'Xem phần tử rời khỏi đầu (quá cũ) và khỏi cuối (không bao giờ thắng được nữa); sửa A và K rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>Variant: Number of Recent Calls — and a real rate limiter</h3>
<p>LC 933: each <code>ping(t)</code> (t increasing) returns how many pings happened in <code>[t − 3000, t]</code>. Keep timestamps in a queue and drop the front while it is too old; the size is the answer. Change "count" to "allow if fewer than <code>limit</code>" and you have the <strong>sliding-log rate limiter</strong> — exact, at the cost of storing every timestamp in the window.</p>
</div>
<div class="ml-vi">
<h3>Biến thể: Number of Recent Calls — và một bộ giới hạn tốc độ thật</h3>
<p>LC 933: mỗi lần <code>ping(t)</code> (t tăng dần) trả về số lần ping nằm trong <code>[t − 3000, t]</code>. Giữ các mốc thời gian trong một queue và bỏ đầu hàng chừng nào nó còn quá cũ; kích thước hàng chính là đáp án. Đổi "đếm" thành "cho qua nếu ít hơn <code>limit</code>" là bạn có <strong>bộ giới hạn tốc độ kiểu sliding log</strong> (nhật ký trượt) — chính xác tuyệt đối, đổi lại phải lưu mọi mốc thời gian trong cửa sổ.</p>
</div>
${maHai('ch03/recent-calls.ts', 'ch03/RecentCalls.java', { vung: 'giai' })}
${ma('ch03/recent-calls.ts', { vung: 'limiter', nhan: 'TypeScript — sliding-log limiter' })}
${ketQua('ch03/recent-calls.ts')}
<div class="ml-en">
<p>Read the limiter line: three requests at 0, 100, 200 pass; 300 and 999 are refused (three already in the last second); at 1000 the request from t = 0 has left the window (<code>q[head] &lt;= t − windowMs</code>), so it passes. This website's payment endpoints use <code>express-rate-limit</code> with a Redis store (<code>src/middleware/orderRateLimit.ts</code>) — a <em>fixed</em> window counter, which needs O(1) memory per user but allows a burst of up to 2× the limit around a window boundary. Lesson 2.2 compares the two.</p>
</div>
<div class="ml-vi">
<p>Đọc dòng của bộ giới hạn: ba request ở 0, 100, 200 được qua; 300 và 999 bị từ chối (đã có ba cái trong một giây gần nhất); tới 1000 thì request ở t = 0 đã rời cửa sổ (<code>q[head] &lt;= t − windowMs</code>), nên được qua. Các cổng thanh toán của chính trang này dùng <code>express-rate-limit</code> với kho Redis (<code>src/middleware/orderRateLimit.ts</code>) — một bộ đếm cửa sổ <em>cố định</em> (fixed window), chỉ tốn O(1) bộ nhớ mỗi người nhưng cho phép dồn tới gấp đôi giới hạn quanh ranh giới hai cửa sổ. Bài 2.2 so sánh hai kiểu này.</p>
${lienKet({ bai: 'dsa-2-2-cua-so', title: '2.2 — Cửa sổ trượt cố định và co giãn', sub: 'Rate limiter cửa sổ cố định vs cửa sổ trượt, cùng khuôn "mở rộng phải, co trái"', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Preview: BFS is a queue (LC 1091)</h3>
<p>Shortest path from the top-left to the bottom-right cell of a 0/1 grid, moving in 8 directions through 0-cells; the length counts cells. Why a queue? Because a queue processes cells <strong>in order of distance</strong>: all cells at distance d leave the queue before any cell at distance d + 1, since those were enqueued later. So the first time the target is dequeued, its distance is the shortest. Two details that separate a correct BFS from a slow or wrong one: mark a cell visited <em>when you enqueue it</em> (otherwise the same cell enters the queue many times), and use a head index or <code>ArrayDeque</code>, never <code>shift()</code>. Chapter 7 goes deep on graphs; this is the mechanical core.</p>
</div>
<div class="ml-vi">
<h3>Mở màn: BFS chính là một queue (LC 1091)</h3>
<p>Đường ngắn nhất từ ô trên-trái tới ô dưới-phải của một lưới 0/1, đi 8 hướng qua các ô 0; độ dài tính bằng số ô. Vì sao lại là queue? Vì queue xử lý các ô <strong>theo thứ tự khoảng cách</strong>: mọi ô ở khoảng cách d đều rời hàng trước bất kỳ ô nào ở khoảng cách d + 1, vì những ô đó được đưa vào sau. Nên lần đầu tiên ô đích được lấy ra, khoảng cách của nó là ngắn nhất. Hai chi tiết phân biệt BFS đúng với BFS chậm hoặc sai: đánh dấu đã thăm <em>ngay lúc đưa vào hàng</em> (không thì một ô sẽ vào hàng nhiều lần), và dùng chỉ số đầu hàng hoặc <code>ArrayDeque</code>, không bao giờ <code>shift()</code>. Chương 7 đi sâu về đồ thị; đây là phần lõi cơ học.</p>
</div>
${maHai('ch03/bfs-preview.ts', 'ch03/BfsPreview.java', { vung: 'giai' })}
${ketQua('ch03/bfs-preview.ts')}
<div class="ml-en">
<p>The four outputs: a 2×2 grid crossed diagonally (2 cells); a path around the wall (4); a blocked start (−1, checked before anything else); and a 4×4 maze whose shortest route needs 6 cells. Note the third case: forgetting the "start is blocked" check is a classic failure on hidden tests.</p>
</div>
<div class="ml-vi">
<p>Bốn output: lưới 2×2 đi chéo (2 ô); một đường vòng qua bức tường (4); ô xuất phát bị chặn (−1, kiểm trước mọi thứ); và một mê cung 4×4 có đường ngắn nhất cần 6 ô. Để ý ca thứ ba: quên kiểm "ô xuất phát bị chặn" là lỗi kinh điển trượt test ẩn.</p>
${lienKet({ bai: 'dsa-7-2-bfs-dfs', title: '7.2 — BFS và DFS trên đồ thị', sub: 'Số hòn đảo, BFS nhiều nguồn, word ladder', cta: 'Xem trước' })}
</div>

<div class="ml-en">
<h3>Where queues live in real systems</h3>
<ul>
<li><strong>The AI request queue of this website</strong> — <code>src/services/llm/hangDoi.ts</code>. The home GPU serves one request at a time, so callers wait in a FIFO queue; the file's own measurement shows the cost of pure FIFO: one user alone waits 3.36 s, four users at once wait 3.36 · 6.72 · 10.11 · 13.48 s. Two deque-like rules sit on top: the robot <em>cuts to the front</em> (inserted before every non-robot waiter), and the queue is <strong>bounded</strong> (<code>LLM_LOCAL_HANG_TOI_DA</code>) — when it is full, a new caller is not queued at all but routed to the cloud gateway. Every waiter also has a timeout, after which it leaves the queue.</li>
<li><strong>Image decoding</strong> — <code>src/storage/imageOptimizer.ts</code> allows at most <code>MAX_CONCURRENT_DECODES = 4</code> decodes at once; extra uploads wait in <code>decodeWaiters</code>, and each finished decode wakes the next one with <code>decodeWaiters.shift()</code>. Here <code>shift()</code> is fine — the line is a handful of requests, far below the 12–16k cliff measured above. Knowing <em>why</em> it is fine is the skill.</li>
<li><strong>Kahn's algorithm</strong> in <code>src/services/work/planning.service.ts</code> (critical path of a project) and the layering of <code>src/services/work/sqlDesign/layout.ts</code> (ER-diagram layout) are queues of "nodes whose prerequisites are done" — Chapter 7's topological sort, running in production.</li>
<li><strong>Job queues and the event loop.</strong> BullMQ jobs on Redis lists, Node's callback queues, Kafka partitions — all FIFO at heart.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Queue sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Hàng đợi gọi AI của chính trang này</strong> — <code>src/services/llm/hangDoi.ts</code>. GPU ở nhà mỗi lúc chỉ phục vụ một lượt, nên người gọi phải chờ trong một hàng FIFO; chính tệp đó ghi lại số đo cái giá của FIFO thuần: một người một mình chờ 3,36 giây, bốn người cùng lúc chờ 3,36 · 6,72 · 10,11 · 13,48 giây. Bên trên có hai luật kiểu deque: robot <em>chen lên đầu</em> (chèn trước mọi người không phải robot), và hàng đợi <strong>có giới hạn</strong> (<code>LLM_LOCAL_HANG_TOI_DA</code>) — hàng đầy thì người mới tới không xếp hàng nữa mà được chuyển thẳng sang cổng AI trên mây. Mỗi người chờ còn có hạn giờ, quá hạn thì tự rời hàng.</li>
<li><strong>Giải mã ảnh</strong> — <code>src/storage/imageOptimizer.ts</code> chỉ cho tối đa <code>MAX_CONCURRENT_DECODES = 4</code> lượt giải mã cùng lúc; ảnh tải lên dư ra phải chờ trong <code>decodeWaiters</code>, và mỗi lượt xong sẽ đánh thức người kế tiếp bằng <code>decodeWaiters.shift()</code>. Ở đây <code>shift()</code> không sao — hàng chỉ vài request, thấp hơn rất xa vách 12–16 nghìn đo ở trên. Biết <em>vì sao</em> nó không sao mới là kỹ năng.</li>
<li><strong>Thuật toán Kahn</strong> trong <code>src/services/work/planning.service.ts</code> (đường găng của một dự án) và việc xếp tầng trong <code>src/services/work/sqlDesign/layout.ts</code> (bố cục sơ đồ ER) là các hàng đợi "những nút đã xong điều kiện tiên quyết" — sắp xếp topo của Chương 7, đang chạy ở production.</li>
<li><strong>Hàng đợi job và event loop.</strong> Job của BullMQ trên Redis list, các hàng callback của Node, partition của Kafka — tất cả cốt lõi đều là FIFO.</li>
</ul>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-13-2-bullmq-co-ban', title: 'Node.js 13.2 — BullMQ: Queue, Worker, và một job thực chất là gì trong Redis', sub: 'Hàng đợi job thật: thử lại, hạn giờ, nhiều worker', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: unbounded queues and quadratic queues</h3>
<p>A queue in front of a slow resource is a promise: "you will be served eventually". An attacker tests that promise by sending requests faster than you can serve them. If the queue has no bound, it grows until memory runs out, and long before that every legitimate user waits minutes — a denial of service without a single bug in the "business logic". Defences: a <strong>maximum queue length</strong> with an immediate refusal (HTTP 429/503) or a fallback route, exactly what <code>hangDoi.ts</code> does; a <strong>timeout per waiter</strong>; and per-client rate limits so one client cannot fill the whole queue.</p>
<p>The second attack is quieter: an <strong>algorithmic complexity attack</strong>. If a server-side BFS (a graph search, a dependency resolver, a flood fill on an uploaded image) uses <code>shift()</code>, an input that makes the queue hold 10⁵ items turns an O(n) job into seconds of CPU — the 863 ms row above, per request. Same root cause as HashDoS in lesson 1.1: an operation that is "usually O(1)" has a worst case the attacker can choose.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: hàng đợi không đáy và hàng đợi bậc hai</h3>
<p>Một hàng đợi đặt trước một tài nguyên chậm là một lời hứa: "rồi bạn sẽ được phục vụ". Kẻ tấn công thử lời hứa đó bằng cách gửi request nhanh hơn tốc độ bạn phục vụ. Nếu hàng đợi không có giới hạn, nó phình tới khi hết bộ nhớ, và rất lâu trước đó mọi người dùng thật đã phải chờ hàng phút — từ chối dịch vụ mà không cần một lỗi nào trong "logic nghiệp vụ". Cách phòng: <strong>độ dài hàng tối đa</strong> kèm từ chối ngay (HTTP 429/503) hoặc một đường dự phòng, đúng như <code>hangDoi.ts</code> làm; <strong>hạn giờ cho từng người chờ</strong>; và giới hạn tốc độ theo từng client để một client không lấp đầy cả hàng.</p>
<p>Kiểu tấn công thứ hai lặng lẽ hơn: <strong>tấn công độ phức tạp thuật toán</strong> (algorithmic complexity attack). Nếu một BFS phía máy chủ (tìm kiếm đồ thị, bộ giải phụ thuộc, tô loang trên ảnh tải lên) dùng <code>shift()</code>, một đầu vào khiến hàng đợi chứa 10⁵ phần tử biến một việc O(n) thành hàng giây CPU — đúng dòng 863 ms ở trên, cho MỖI request. Cùng gốc rễ với HashDoS ở bài 1.1: một thao tác "thường là O(1)" có trường hợp xấu nhất mà kẻ tấn công tự chọn được.</p>
</div>

<div class="ml-en">
<h3>Traps in Java's queue API</h3>
<div class="pitfall co-tieu-de"><p><strong>Trap — one <code>ArrayDeque</code>, two personalities.</strong></p><p><code>ArrayDeque</code> implements both stack methods (<code>push</code>/<code>pop</code>, at the head) and queue methods (<code>offer</code>/<code>poll</code>, tail in, head out). Mix <code>push</code> with <code>poll</code> and your "queue" is a stack. It also refuses <code>null</code>, while <code>LinkedList</code> accepts it — and then <code>poll()</code> returning <code>null</code> no longer tells you whether the queue is empty. And on any <code>List&lt;Integer&gt;</code>, <code>remove(1)</code> removes the element at <em>index</em> 1, not the value 1:</p></div>
</div>
<div class="ml-vi">
<h3>Bẫy trong API hàng đợi của Java</h3>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một <code>ArrayDeque</code>, hai tính cách.</strong></p><p><code>ArrayDeque</code> cài cả phương thức của stack (<code>push</code>/<code>pop</code>, ở đầu) lẫn phương thức của queue (<code>offer</code>/<code>poll</code>, vào ở cuối, ra ở đầu). Trộn <code>push</code> với <code>poll</code> là "hàng đợi" của bạn thành stack. Nó còn từ chối <code>null</code>, trong khi <code>LinkedList</code> nhận — và khi đó <code>poll()</code> trả <code>null</code> không còn cho bạn biết hàng có rỗng hay không. Còn trên mọi <code>List&lt;Integer&gt;</code>, <code>remove(1)</code> gỡ phần tử ở <em>chỉ số</em> 1, không phải giá trị 1:</p></div>
</div>
${ma('ch03/JavaDequeBay.java', { vung: 'tron', nhan: 'Java — mixing stack and queue methods' })}
${ma('ch03/JavaDequeBay.java', { vung: 'remove', nhan: 'Java — remove(int) vs remove(Object)' })}
${ketQua('ch03/JavaDequeBay.java')}
<div class="ml-en">
<p>Rule: pick one vocabulary per deque and stick to it — <code>offerLast/pollFirst</code> for a queue, <code>push/pop</code> for a stack, the explicit <code>…First/…Last</code> names for a deque. And never store <code>null</code> in a queue.</p>
</div>
<div class="ml-vi">
<p>Quy tắc: mỗi deque chọn một bộ từ vựng và giữ nguyên — <code>offerLast/pollFirst</code> cho queue, <code>push/pop</code> cho stack, các tên tường minh <code>…First/…Last</code> cho deque. Và không bao giờ cất <code>null</code> vào hàng đợi.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: Sliding Window Maximum</h3>
${hoiThoai([
  ['I', 'Return the maximum of every window of size k.'],
  ['C', 'Can k be larger than n, or zero? Can values be negative? Do you want the result as an array of n − k + 1 values?'],
  ['N', 'k = 0 and k > n are the edge cases that crash index arithmetic; negatives rule out initialising max with 0.'],
  ['I', '1 ≤ k ≤ n, values can be negative, yes an array.'],
  ['C', 'Brute force rescans each window: O(n·k). A max-heap with lazy deletion gets O(n log n). But I can do O(n) with a deque: when a new element arrives, anything older and not larger can never be a maximum again, so I pop it from the back. The deque stays decreasing, the front is the window max, and I drop the front when it slides out.'],
  ['N', 'Three levels of solution in one breath shows range; the reason for popping is the whole proof.'],
  ['I', 'Okay, code the deque version.'],
  ['C', '(coding) I store indices, so I can tell when the front has left the window: front ≤ i − k. I pop the back with ≤, not <, so equal values do not pile up — either is correct, ≤ keeps the deque shorter.'],
  ['C', 'Test: [1, 3, −1, −3, 5, 3, 6, 7], k = 3 gives [3, 3, 5, 5, 6, 7]. A decreasing array [9, 8, 7, 6], k = 2 never pops the back, only the front: [9, 8, 7]. k = 1 returns the array itself.'],
  ['N', 'The decreasing case is the one that exercises the "drop the front" line; pick tests by which line they hit.'],
  ['I', 'Complexity, and could you do it in O(1) extra space?'],
  ['C', 'O(n) time — each index is pushed once and removed once — and O(k) space for the deque. Truly O(1) space is not possible with this approach; the block-based prefix/suffix-max trick uses O(n). I would keep the deque.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: Sliding Window Maximum</h3>
<p>Cùng mạch hội thoại bằng tiếng Việt, kèm các cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Trả về giá trị lớn nhất của mọi cửa sổ độ dài k.'],
  ['C', 'k có thể lớn hơn n, hoặc bằng 0 không ạ? Giá trị có âm không? Anh muốn kết quả là mảng n − k + 1 phần tử đúng không? <em>("Can k be larger than n? Can values be negative?")</em>'],
  ['N', 'k = 0 và k &gt; n là ca biên làm vỡ phép tính chỉ số; có số âm thì không được khởi tạo max bằng 0.'],
  ['I', '1 ≤ k ≤ n, giá trị có thể âm, ừ trả mảng.'],
  ['C', 'Vét cạn là quét lại từng cửa sổ: O(n·k). Max-heap kèm xoá trễ được O(n log n). Nhưng em làm được O(n) bằng deque: khi phần tử mới tới, mọi phần tử cũ hơn mà không lớn hơn nó sẽ không bao giờ là max nữa, nên em pop nó khỏi cuối. Deque luôn giảm dần, đầu deque là max của cửa sổ, và em bỏ đầu khi nó trượt ra ngoài. <em>("Anything older and not larger can never be a maximum again.")</em>'],
  ['N', 'Ba mức lời giải trong một hơi thể hiện độ rộng; lý do để pop chính là toàn bộ chứng minh.'],
  ['I', 'Được, code bản deque.'],
  ['C', '(vừa code vừa nói) Em lưu chỉ số để biết khi nào đầu deque đã rời cửa sổ: đầu ≤ i − k. Em pop cuối bằng ≤ chứ không phải &lt;, để các giá trị bằng nhau không chất đống — cả hai đều đúng, ≤ giữ deque ngắn hơn.'],
  ['C', 'Test: [1, 3, −1, −3, 5, 3, 6, 7], k = 3 ra [3, 3, 5, 5, 6, 7]. Mảng giảm [9, 8, 7, 6], k = 2 không bao giờ pop cuối, chỉ bỏ đầu: [9, 8, 7]. k = 1 trả lại chính mảng đó.'],
  ['N', 'Ca mảng giảm là ca chạy tới dòng "bỏ đầu"; hãy chọn test theo dòng code mà nó chạm tới.'],
  ['I', 'Độ phức tạp, và làm được với bộ nhớ phụ O(1) không?'],
  ['C', 'O(n) thời gian — mỗi chỉ số vào một lần và ra một lần — và O(k) bộ nhớ cho deque. O(1) bộ nhớ thật sự thì cách này không làm được; mẹo chia khối với max tiền tố/hậu tố tốn O(n). Em sẽ giữ bản deque. <em>("Each index is pushed once and removed once.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li><code>shift()</code> as a queue in TypeScript for anything that can grow past ~10⁴ elements.</li>
<li>Marking BFS cells visited when you <em>dequeue</em> instead of when you enqueue — the queue fills with duplicates.</li>
<li>Storing values instead of indices in the monotonic deque — you can no longer tell when the front left the window.</li>
<li>Emitting a window maximum before the first window is full (<code>i &gt;= k − 1</code>).</li>
<li>Ring buffer: distinguishing full from empty with <code>head === tail</code> only; forgetting <code>+ cap</code> before <code>%</code> when moving backwards (JS and Java <code>%</code> keep the sign: <code>−1 % 3</code> is −1).</li>
<li>Java: mixing <code>push</code> and <code>poll</code>; putting <code>null</code> into a queue; <code>list.remove(1)</code> meaning the index.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dùng <code>shift()</code> làm hàng đợi trong TypeScript cho thứ có thể vượt ~10⁴ phần tử.</li>
<li>Đánh dấu ô BFS đã thăm lúc <em>lấy ra</em> thay vì lúc đưa vào — hàng đợi đầy bản trùng.</li>
<li>Lưu giá trị thay cho chỉ số trong deque đơn điệu — không còn biết khi nào đầu deque đã rời cửa sổ.</li>
<li>Xuất max của cửa sổ trước khi cửa sổ đầu tiên đủ k phần tử (<code>i &gt;= k − 1</code>).</li>
<li>Ring buffer: phân biệt đầy với rỗng chỉ bằng <code>head === tail</code>; quên <code>+ cap</code> trước <code>%</code> khi lùi chỉ số (phép <code>%</code> của JS và Java giữ dấu: <code>−1 % 3</code> là −1).</li>
<li>Java: trộn <code>push</code> với <code>poll</code>; cất <code>null</code> vào hàng đợi; <code>list.remove(1)</code> nghĩa là gỡ theo chỉ số.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Đề Premium (LC 346) có bản miễn phí tương đương trên LintCode (642). Lời giải từng bước của các đề tổng hợp nằm ở <a href="${baiNay('dsa-3-4-luyen')}">bài 3.4 (Bộ luyện 3)</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write a BFS queue three ways in TypeScript (shift, head index, the ring deque) and time each on 200,000 enqueue/dequeue pairs on your machine. Write the three numbers in your notebook next to the ones above.</li>
<li>Open the Sliding Window Maximum simulation, change <code>A</code> to <code>[4, 2, 12, 3, 8, 1, 7]</code> and <code>K</code> to 3. Predict the deque after each step on paper, then step through and compare.</li>
<li>Submit LC 232, LC 622 and LC 239. For LC 232, write one sentence explaining why it is amortised O(1).</li>
<li>Bonus: LC 1696 Jump Game VI — find the line where the same deque appears.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, your own shift() measurement shows the jump, and your paper trace of the deque matches the simulation.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">queue / FIFO</span><span class="v">First in, first out; enqueue at the back, dequeue at the front.</span></div>
  <div class="kv"><span class="k">deque</span><span class="v">Double-ended queue: O(1) insert and remove at both ends.</span></div>
  <div class="kv"><span class="k">ring buffer / circular queue</span><span class="v">A fixed array with wrapping indices (<code>% cap</code>); nothing ever moves.</span></div>
  <div class="kv"><span class="k">monotonic deque</span><span class="v">A deque kept decreasing (or increasing) so its front is the window max (or min).</span></div>
  <div class="kv"><span class="k">BFS (breadth-first search)</span><span class="v">Explore in order of distance using a queue; finds unweighted shortest paths.</span></div>
  <div class="kv"><span class="k">sliding log</span><span class="v">A rate limiter that stores every timestamp in the window; exact, O(limit) memory.</span></div>
  <div class="kv"><span class="k">backpressure / load shedding</span><span class="v">Refusing or rerouting work when the queue is full instead of letting it grow.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A queue serves whoever waited longest; BFS uses that to visit by distance.</li>
<li>In JavaScript, <code>shift()</code> is cheap up to ~12k elements and quadratic beyond ~16k — use a head index or a ring buffer.</li>
<li>Queue from two stacks: pour only when the outbox is empty ⇒ amortised O(1).</li>
<li>Ring buffer: head + size, tail = (head + size) % cap.</li>
<li>Monotonic deque: pop the back while ≤ x, drop the front when it leaves; front = max; O(n).</li>
<li>Real queues need a bound, a timeout and a refusal path — otherwise they are a DoS waiting to happen.</li>
</ul>
${nguon('📙', 'MDN — Array.prototype.shift()', 'What shift does and why it re-indexes every element', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift')}
${nguon('📙', 'Java Deque interface (Java SE 21 API)', 'The table of first/last methods and which ones throw vs return null', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Deque.html')}
${nguon('📗', 'NeetCode roadmap — Sliding Window &amp; Stack', 'Where Sliding Window Maximum sits in the standard practice order', 'https://neetcode.io/roadmap')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết hàng đợi BFS theo ba cách trong TypeScript (shift, chỉ số đầu hàng, deque vòng) và bấm giờ từng cách trên 200.000 cặp đưa vào/lấy ra trên máy bạn. Ghi ba con số vào sổ cạnh các số ở trên.</li>
<li>Mở mô phỏng Sliding Window Maximum, đổi <code>A</code> thành <code>[4, 2, 12, 3, 8, 1, 7]</code> và <code>K</code> thành 3. Đoán deque sau từng bước trên giấy, rồi chạy từng bước và so.</li>
<li>Nộp LC 232, LC 622 và LC 239. Với LC 232, viết một câu giải thích vì sao nó là O(1) khấu hao.</li>
<li>Thêm: LC 1696 Jump Game VI — tìm dòng code mà đúng cái deque này xuất hiện.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, số đo shift() của chính bạn cho thấy cú nhảy, và vết deque bạn viết tay khớp với mô phỏng.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">queue / FIFO (hàng đợi / vào trước ra trước)</span><span class="v">Đưa vào ở cuối, lấy ra ở đầu.</span></div>
  <div class="kv"><span class="k">deque (hàng đợi hai đầu)</span><span class="v">Thêm và gỡ O(1) ở cả hai đầu.</span></div>
  <div class="kv"><span class="k">ring buffer / circular queue (bộ đệm vòng / hàng đợi vòng)</span><span class="v">Mảng cố định với chỉ số quay vòng (<code>% cap</code>); không phần tử nào phải dời.</span></div>
  <div class="kv"><span class="k">monotonic deque (deque đơn điệu)</span><span class="v">Deque luôn giảm (hoặc tăng) để đầu nó là max (hoặc min) của cửa sổ.</span></div>
  <div class="kv"><span class="k">BFS — breadth-first search (tìm kiếm theo chiều rộng)</span><span class="v">Duyệt theo thứ tự khoảng cách bằng queue; tìm đường ngắn nhất không trọng số.</span></div>
  <div class="kv"><span class="k">sliding log (nhật ký trượt)</span><span class="v">Bộ giới hạn tốc độ lưu mọi mốc thời gian trong cửa sổ; chính xác, tốn O(limit) bộ nhớ.</span></div>
  <div class="kv"><span class="k">backpressure / load shedding (đẩy ngược / cắt tải)</span><span class="v">Từ chối hoặc chuyển hướng việc khi hàng đầy thay vì để nó phình ra.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Queue phục vụ người chờ lâu nhất; BFS dùng điều đó để duyệt theo khoảng cách.</li>
<li>Trong JavaScript, <code>shift()</code> rẻ tới ~12 nghìn phần tử và thành bậc hai từ ~16 nghìn — dùng chỉ số đầu hàng hoặc ring buffer.</li>
<li>Queue từ hai stack: chỉ đổ khi hộp ra rỗng ⇒ O(1) khấu hao.</li>
<li>Ring buffer: head + size, tail = (head + size) % cap.</li>
<li>Deque đơn điệu: pop cuối khi ≤ x, bỏ đầu khi nó rời cửa sổ; đầu = max; O(n).</li>
<li>Hàng đợi thật cần giới hạn, hạn giờ và đường từ chối — không thì nó là một vụ DoS đang chờ xảy ra.</li>
</ul>
${nguon('📙', 'MDN — Array.prototype.shift()', 'shift làm gì và vì sao nó đánh lại chỉ số mọi phần tử', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift')}
${nguon('📙', 'Java Deque interface (Java SE 21 API)', 'Bảng các phương thức first/last, cái nào ném ngoại lệ, cái nào trả null', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Deque.html')}
${nguon('📗', 'NeetCode roadmap — Sliding Window &amp; Stack', 'Vị trí của Sliding Window Maximum trong thứ tự luyện chuẩn', 'https://neetcode.io/roadmap')}
</div>
`,
};
