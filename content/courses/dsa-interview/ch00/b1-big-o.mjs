/** 0.1 — Big-O dùng được để suy luận. Số đo thật: ../ma/ch00 (Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, lc, bangDe, moPhong, nguon, csd, hoiThoai, gap } from '../_chung.mjs';

const DE = [
  [lc(1480, 'running-sum-of-1d-array', 'Running Sum of 1d Array', 'Easy'), 'Warm-up: one pass, O(n). Say the complexity before you submit.', 'Khởi động: một lượt, O(n). Nói độ phức tạp trước khi nộp.'],
  [lc(217, 'contains-duplicate', 'Contains Duplicate', 'Easy'), 'Three solutions: O(n²) pairs, O(n log n) sort, O(n) Set. Write all three, compare.', 'Ba lời giải: O(n²) từng cặp, O(n log n) sắp xếp, O(n) Set. Viết cả ba, so sánh.'],
  [lc(704, 'binary-search', 'Binary Search', 'Easy'), 'The textbook O(log n): count how many steps for n = 10⁴.', 'O(log n) kinh điển: đếm xem n = 10⁴ cần bao nhiêu bước.'],
  [lc(509, 'fibonacci-number', 'Fibonacci Number', 'Easy'), 'Naive recursion is exponential; a loop is O(n). Count the calls like in this lesson.', 'Đệ quy ngây thơ là hàm mũ; vòng lặp là O(n). Đếm số lời gọi như trong bài.'],
  [lc(70, 'climbing-stairs', 'Climbing Stairs', 'Easy'), 'Same recurrence as Fibonacci; n ≤ 45 tells you exponential will fail.', 'Cùng công thức truy hồi với Fibonacci; n ≤ 45 cho biết hàm mũ sẽ trượt.'],
  [lc(1, 'two-sum', 'Two Sum', 'Easy'), 'O(n²) vs O(n) — you measured it in Lesson 1.1.', 'O(n²) so với O(n) — bạn đã đo ở bài 1.1.'],
];

export default {
  title: '0.1 — Big-O you can reason with|||0.1 — Big-O dùng được để suy luận',
  slug: 'dsa-0-1-big-o',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đếm bước của sáu dạng vòng lặp, đo tốc độ máy thật (~2,5·10⁸ bước/giây), bảng tra n ↔ độ phức tạp, chi phí ẩn của includes/shift/String +=, và sự cố Cloudflare 2019 do một regex hàm mũ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Big-O you can reason with</h2>
<p class="lead">In an interview, Big-O is not a piece of theory to recite. It is a tool for one decision you make in the first five minutes: <strong>"will this idea be fast enough for the input size in the constraints?"</strong> By the end of this lesson you will be able to count the steps of a loop by eye, know roughly how many steps a real machine does per second (we measured it), and look up in a small table which complexity a given <code>n</code> demands.</p>

<h3>The everyday picture: counting trips, not seconds</h3>
<p>You run a small shop and must deliver parcels. You do not ask "how many seconds will this take?" — that depends on traffic, the motorbike, the weather. You ask "how many <em>trips</em>?" If each parcel needs one trip, 100 parcels means 100 trips; double the parcels, double the trips. If for each parcel you first visit every other customer to ask a question, 100 parcels means 10,000 trips; double the parcels and the trips <em>quadruple</em>. Big-O is that question: <strong>how does the number of steps grow when the input grows?</strong> It ignores the speed of the motorbike (the machine, the language) and keeps the shape of the growth.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Big-O dùng được để suy luận</h2>
<p class="lead">Khi phỏng vấn, Big-O không phải là lý thuyết để đọc thuộc. Nó là công cụ cho đúng một quyết định bạn đưa ra trong năm phút đầu: <strong>"ý tưởng này có đủ nhanh với kích thước đầu vào ghi trong ràng buộc của đề không?"</strong> Học xong bài này bạn sẽ đếm được số bước của một vòng lặp bằng mắt, biết đại khái một máy thật chạy được bao nhiêu bước mỗi giây (ta đo thật), và tra trong một bảng nhỏ xem một giá trị <code>n</code> đòi độ phức tạp nào.</p>

<h3>Hình dung đời thường: đếm số chuyến, không đếm giây</h3>
<p>Bạn có một cửa hàng nhỏ và phải giao hàng. Bạn không hỏi "mất bao nhiêu giây?" — cái đó tuỳ kẹt xe, tuỳ xe máy, tuỳ trời mưa. Bạn hỏi "mất bao nhiêu <em>chuyến</em>?". Nếu mỗi gói cần một chuyến, 100 gói là 100 chuyến; gấp đôi số gói thì gấp đôi số chuyến. Nếu với mỗi gói bạn lại ghé hỏi thăm mọi khách khác trước, 100 gói là 10.000 chuyến; gấp đôi số gói thì số chuyến tăng <em>gấp bốn</em>. Big-O chính là câu hỏi đó: <strong>số bước tăng thế nào khi đầu vào tăng?</strong> Nó bỏ qua tốc độ chiếc xe máy (máy tính, ngôn ngữ) và giữ lại hình dạng của sự tăng trưởng.</p>
${csd('csd201-big-o', 'vi', '0.3 Big-O: ngôn ngữ của hiệu năng', '<p>CSD201 dạy định nghĩa hình thức (tồn tại c và n₀ sao cho f(n) ≤ c·g(n)), đếm phép toán cơ bản và các quy tắc bỏ hằng số. Ôn nhanh: Big-O là cận trên của tốc độ tăng, bỏ hằng số và số hạng nhỏ. <strong>Ở đây đi sâu thêm:</strong> nối Big-O với SỐ GIÂY THẬT trên máy thật, bảng tra n ↔ độ phức tạp để quyết định trong phút đầu, và những chi phí ẩn làm code "trông O(n)" thành O(n²).</p>')}
</div>

<div class="ml-en">
<h3>Three rules, and only three</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Count the steps as a function of n</span><span class="lz-d">One loop over n items: about n steps. A loop inside a loop: n × n. A loop that halves: log₂ n.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Keep the biggest term</span><span class="lz-d">n² + 3n + 7 grows like n² — for n = 10⁶ the 3n part is 0.0003 % of the total.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Drop the constant factor</span><span class="lz-d">5n and n are both O(n). Constants matter in real life (Java was ~5× faster than Node on our sort), but they never change which algorithm wins when n is large.</span></div>
</div>
<p>Add two vocabulary items. <strong>Worst case</strong> is what interviewers mean by default ("Two Sum is O(n)" means even when the pair is at the end). <strong>Space complexity</strong> is the same counting applied to extra memory: a hash map of n entries is O(n) space; recursion that goes n levels deep is O(n) space for the call stack, even if you allocate nothing.</p>
</div>
<div class="ml-vi">
<h3>Ba quy tắc, chỉ ba thôi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đếm số bước theo n</span><span class="lz-d">Một vòng lặp qua n phần tử: khoảng n bước. Vòng trong vòng: n × n. Vòng lặp chia đôi: log₂ n.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giữ số hạng lớn nhất</span><span class="lz-d">n² + 3n + 7 tăng như n² — với n = 10⁶ phần 3n chỉ chiếm 0,0003 % tổng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Bỏ hệ số hằng</span><span class="lz-d">5n và n đều là O(n). Hằng số có ý nghĩa ngoài đời (Java nhanh hơn Node ~5 lần ở phép sắp xếp ta đo), nhưng không bao giờ đổi được thuật toán nào thắng khi n lớn.</span></div>
</div>
<p>Thêm hai từ vựng. <strong>Worst case (trường hợp xấu nhất)</strong> là điều người phỏng vấn mặc định muốn nói ("Two Sum là O(n)" nghĩa là kể cả khi cặp nằm cuối mảng). <strong>Space complexity (độ phức tạp bộ nhớ)</strong> là cùng phép đếm đó áp cho bộ nhớ phụ: một hash map n phần tử là O(n) bộ nhớ; đệ quy sâu n tầng là O(n) bộ nhớ cho ngăn xếp lời gọi (call stack), dù bạn không cấp phát gì.</p>
</div>

<div class="ml-en">
<h3>Count by eye: six loop shapes</h3>
<p>Here are the six shapes you will meet 95 % of the time. The program counts the steps for n = 16 and n = 32 — check each number against the formula in the comment, then look at how each count changed when n doubled.</p>
</div>
<div class="ml-vi">
<h3>Đếm bằng mắt: sáu dạng vòng lặp</h3>
<p>Đây là sáu dạng bạn sẽ gặp 95 % thời gian. Chương trình đếm số bước với n = 16 và n = 32 — so từng con số với công thức ở chú thích, rồi nhìn xem mỗi con số đổi thế nào khi n gấp đôi.</p>
</div>
${maHai('ch00/dem-vong.ts', 'ch00/DemVong.java', { vung: 'vong' })}
${ketQua('ch00/dem-vong.ts')}
<div class="ml-en">
<table>
<thead><tr><th>Shape</th><th>n = 16</th><th>n = 32</th><th>When n doubles</th><th>Big-O</th></tr></thead>
<tbody>
<tr><td>one loop</td><td>16</td><td>32</td><td>×2</td><td>O(n)</td></tr>
<tr><td>loop in loop (full)</td><td>256</td><td>1,024</td><td>×4</td><td>O(n²)</td></tr>
<tr><td>loop in loop, j from i+1 (every pair once)</td><td>120</td><td>496</td><td>≈×4</td><td>O(n²) — n(n−1)/2 is still n²</td></tr>
<tr><td>halving i = i/2</td><td>4</td><td>5</td><td>+1</td><td>O(log n)</td></tr>
<tr><td>loop × doubling inner j *= 2</td><td>64</td><td>160</td><td>≈×2.5</td><td>O(n log n)</td></tr>
<tr><td>two loops one after the other</td><td>32</td><td>64</td><td>×2</td><td>O(n + m) — add, do not multiply</td></tr>
</tbody></table>
<p>The "triangle" row is the one people argue about in interviews: "but the inner loop gets shorter!" It does, and the total is exactly n(n−1)/2 = 120 for n = 16 — half of n², still growing ×4 when n doubles. Halving the constant does not change the class.</p>
<p>The last lines count the calls of naive recursive Fibonacci: 177 calls for n = 10, 21,891 for n = 20, 2,692,537 for n = 30. Each +10 multiplies the work by about 123: that is exponential growth, roughly 1.6ⁿ. Chapter 9 turns it into O(n) by remembering results.</p>
</div>
<div class="ml-vi">
<table>
<thead><tr><th>Dạng</th><th>n = 16</th><th>n = 32</th><th>Khi n gấp đôi</th><th>Big-O</th></tr></thead>
<tbody>
<tr><td>một vòng</td><td>16</td><td>32</td><td>×2</td><td>O(n)</td></tr>
<tr><td>vòng trong vòng (đủ)</td><td>256</td><td>1.024</td><td>×4</td><td>O(n²)</td></tr>
<tr><td>vòng trong vòng, j từ i+1 (mỗi cặp một lần)</td><td>120</td><td>496</td><td>≈×4</td><td>O(n²) — n(n−1)/2 vẫn là n²</td></tr>
<tr><td>chia đôi i = i/2</td><td>4</td><td>5</td><td>+1</td><td>O(log n)</td></tr>
<tr><td>vòng × vòng trong nhân đôi j *= 2</td><td>64</td><td>160</td><td>≈×2,5</td><td>O(n log n)</td></tr>
<tr><td>hai vòng nối tiếp nhau</td><td>32</td><td>64</td><td>×2</td><td>O(n + m) — cộng, không nhân</td></tr>
</tbody></table>
<p>Dòng "tam giác" là dòng hay bị cãi khi phỏng vấn: "nhưng vòng trong ngắn dần mà!". Đúng là ngắn dần, và tổng là đúng n(n−1)/2 = 120 với n = 16 — một nửa n², vẫn tăng ×4 khi n gấp đôi. Giảm một nửa hằng số không đổi được "hạng".</p>
<p>Mấy dòng cuối đếm số lời gọi của Fibonacci đệ quy ngây thơ: 177 lời gọi với n = 10, 21.891 với n = 20, 2.692.537 với n = 30. Mỗi lần +10 thì khối lượng việc nhân khoảng 123 lần: đó là tăng theo hàm mũ, cỡ 1,6ⁿ. Chương 9 biến nó thành O(n) bằng cách nhớ kết quả.</p>
</div>
<div class="ml-en">
${moPhong('ch00/tang-truong.sim.js', 'en', 'Watch the four growth curves pull apart', 'Bar charts of n, n log n, n² and 2ⁿ for n = 1…16, one step at a time.')}
</div>
<div class="ml-vi">
${moPhong('ch00/tang-truong.sim.js', 'vi', 'Xem bốn đường tăng trưởng tách xa nhau', 'Biểu đồ cột n, n log n, n² và 2ⁿ với n = 1…16, từng bước một.')}
</div>

<div class="ml-en">
<h3>From steps to seconds: how fast is a real machine?</h3>
<p>To turn a step count into a yes/no decision you need one number: how many simple steps per second. We measured it on an Apple M1 Max — a loop of 10⁸ iterations doing an add and a modulo — then timed an O(n) loop, an O(n log n) sort and an O(n²) double loop for growing n:</p>
</div>
<div class="ml-vi">
<h3>Từ số bước sang số giây: máy thật nhanh tới đâu?</h3>
<p>Để biến số bước thành quyết định có/không, bạn cần đúng một con số: mỗi giây chạy được bao nhiêu bước đơn giản. Ta đo trên Apple M1 Max — một vòng lặp 10⁸ lần, mỗi lần một phép cộng và một phép chia lấy dư — rồi bấm giờ một vòng O(n), một phép sắp xếp O(n log n) và một vòng lồng O(n²) với n tăng dần:</p>
</div>
${ma('ch00/toc-do.ts', { vung: 'do', nhan: 'TypeScript — the three workloads' })}
${ketQua('ch00/toc-do.ts')}
${ketQua('ch00/TocDo.java')}
<div class="ml-en">
<p>About <strong>2.5–2.8 × 10⁸ simple steps per second</strong> in both languages. Online judges run on slower shared machines and your steps are rarely this simple, so the safe rule of thumb is <strong>~10⁸ steps per second</strong>. Now read the O(n²) column: 10,000 items take 0.4 s, but 100,000 items would take about 40 s and a million about an hour. The same machine does the O(n log n) sort of a million numbers in 0.06–0.3 s. That is the whole argument for learning patterns.</p>
</div>
<div class="ml-vi">
<p>Khoảng <strong>2,5–2,8 × 10⁸ bước đơn giản mỗi giây</strong> ở cả hai ngôn ngữ. Máy chấm online chạy trên máy dùng chung chậm hơn, và "bước" của bạn hiếm khi đơn giản như vậy, nên quy tắc an toàn là <strong>~10⁸ bước mỗi giây</strong>. Giờ đọc cột O(n²): 10.000 phần tử mất 0,4 giây, nhưng 100.000 phần tử sẽ mất khoảng 40 giây và một triệu thì cỡ một tiếng. Cùng máy đó sắp xếp O(n log n) một triệu số trong 0,06–0,3 giây. Toàn bộ lý do để học mẫu bài nằm trong hai cột này.</p>
</div>

<div class="ml-en">
<h3>The table to memorise: n in the constraints → the complexity you need</h3>
<p>Assume ~10⁸ steps/second and a limit of about one second. Read the constraint line of the problem first; it tells you the target before you have any idea.</p>
<table>
<thead><tr><th>n up to</th><th>Fits in ~1 s</th><th>Typical patterns</th></tr></thead>
<tbody>
<tr><td>10–11</td><td>O(n!)</td><td>all permutations (Ch8)</td></tr>
<tr><td>20–25</td><td>O(2ⁿ), O(2ⁿ·n)</td><td>all subsets, bitmask (Ch1.4, Ch8)</td></tr>
<tr><td>~500</td><td>O(n³)</td><td>triple loop, interval DP</td></tr>
<tr><td>~5,000 (10⁴ at a push)</td><td>O(n²)</td><td>every pair, 2-D DP (Ch9)</td></tr>
<tr><td>10⁵ – 10⁶</td><td>O(n log n)</td><td>sort + scan, heap, binary search per item (Ch1, Ch4, Ch6)</td></tr>
<tr><td>10⁷ – 10⁸</td><td>O(n)</td><td>one pass: hash map, two pointers, sliding window, prefix sum (Ch1–3)</td></tr>
<tr><td>10⁹ and more</td><td>O(log n) or O(1)</td><td>binary search on the answer, math (Ch4)</td></tr>
</tbody></table>
<p>Example: "1 ≤ nums.length ≤ 10⁵" ⇒ O(n²) is 10¹⁰ steps, ~100 s: it will fail. You need O(n log n) or O(n). You now know that <em>before</em> you start thinking about the solution — and you can say it out loud, which is exactly what interviewers want to hear.</p>
</div>
<div class="ml-vi">
<h3>Bảng phải thuộc: n trong ràng buộc → độ phức tạp cần có</h3>
<p>Giả sử ~10⁸ bước/giây và giới hạn khoảng một giây. Đọc dòng ràng buộc (constraints) của đề TRƯỚC; nó cho bạn biết đích đến trước khi bạn có bất kỳ ý tưởng nào.</p>
<table>
<thead><tr><th>n tối đa</th><th>Vừa ~1 giây</th><th>Mẫu bài thường gặp</th></tr></thead>
<tbody>
<tr><td>10–11</td><td>O(n!)</td><td>mọi hoán vị (Ch8)</td></tr>
<tr><td>20–25</td><td>O(2ⁿ), O(2ⁿ·n)</td><td>mọi tập con, bitmask (Ch1.4, Ch8)</td></tr>
<tr><td>~500</td><td>O(n³)</td><td>ba vòng lồng, DP khoảng</td></tr>
<tr><td>~5.000 (cố lắm 10⁴)</td><td>O(n²)</td><td>mọi cặp, DP hai chiều (Ch9)</td></tr>
<tr><td>10⁵ – 10⁶</td><td>O(n log n)</td><td>sắp xếp + quét, heap, tìm nhị phân cho từng phần tử (Ch1, Ch4, Ch6)</td></tr>
<tr><td>10⁷ – 10⁸</td><td>O(n)</td><td>một lượt: hash map, hai con trỏ, cửa sổ trượt, tổng tiền tố (Ch1–3)</td></tr>
<tr><td>10⁹ trở lên</td><td>O(log n) hoặc O(1)</td><td>nhị phân trên đáp án, công thức toán (Ch4)</td></tr>
</tbody></table>
<p>Ví dụ: "1 ≤ nums.length ≤ 10⁵" ⇒ O(n²) là 10¹⁰ bước, ~100 giây: chắc chắn trượt. Bạn cần O(n log n) hoặc O(n). Bạn biết điều đó <em>trước khi</em> bắt đầu nghĩ lời giải — và bạn có thể nói nó ra, đúng thứ người phỏng vấn muốn nghe.</p>
</div>

<div class="ml-en">
<h3>Hidden costs: code that looks O(n) and is O(n²)</h3>
<p>The most common complexity bug is not a visible nested loop — it is a library call that is itself a loop. Three classics, measured:</p>
</div>
<div class="ml-vi">
<h3>Chi phí ẩn: code trông như O(n) mà thật ra O(n²)</h3>
<p>Lỗi độ phức tạp hay gặp nhất không phải là một vòng lồng nhìn thấy được — mà là một lời gọi thư viện mà bản thân nó là một vòng lặp. Ba trường hợp kinh điển, có số đo:</p>
</div>
${ma('ch00/an-chi-phi.ts', { vung: 'an', nhan: 'TypeScript' })}
${ketQua('ch00/an-chi-phi.ts')}
${ma('ch00/ChuoiCong.java', { vung: 'an', nhan: 'Java' })}
${ketQua('ch00/ChuoiCong.java')}
<div class="ml-en">
<ul>
<li><code>array.includes(x)</code> / <code>indexOf</code> / Java <code>list.contains(x)</code> scan the list: inside a loop that is O(n²). From 10,000 to 100,000 items the <code>includes</code> version went 10.9 → 1,093 ms (×100), the Set version 0.63 → 5.2 ms.</li>
<li><code>array.shift()</code> in JavaScript moves every remaining element. V8 has a shortcut for small arrays (look at the 1,000 and 10,000 rows), then it falls off a cliff: 846 ms for 100,000 items versus 0.17 ms with a moving head index. Remember this in Chapter 3 and Chapter 7 when you write a BFS queue.</li>
<li>Java <code>String s += c</code> in a loop copies the whole string every time (Strings are immutable): 269 ms vs 0.3 ms with <code>StringBuilder</code> at 100,000 characters. Java <code>ArrayList.remove(0)</code> has the same problem as <code>shift()</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>"It is one loop, so it is O(n)."</strong></p><p>Count what happens <em>inside</em> each iteration, including library calls. One <code>for</code> with an <code>includes</code>, a <code>shift()</code>, a <code>slice()</code> or a Java <code>String +=</code> inside is O(n²). Interviewers plant this on purpose in follow-up questions.</p></div>
<p>Keep this cheat sheet in your head: array index, push/pop at the end, Map/Set get/set/has — O(1) (average for hashes); shift/unshift/splice/includes/indexOf/slice/copy — O(n); sort — O(n log n); a Java <code>TreeMap</code> or a heap operation — O(log n).</p>
</div>
<div class="ml-vi">
<ul>
<li><code>array.includes(x)</code> / <code>indexOf</code> / <code>list.contains(x)</code> của Java đều quét danh sách: đặt trong vòng lặp là O(n²). Từ 10.000 lên 100.000 phần tử, bản <code>includes</code> đi từ 10,9 → 1.093 ms (×100), bản Set 0,63 → 5,2 ms.</li>
<li><code>array.shift()</code> trong JavaScript dời mọi phần tử còn lại lên một chỗ. V8 có đường tắt cho mảng nhỏ (nhìn dòng 1.000 và 10.000), rồi rơi xuống vực: 846 ms cho 100.000 phần tử, so với 0,17 ms khi chỉ dời một chỉ số "đầu hàng". Nhớ điều này ở Chương 3 và Chương 7 khi bạn viết hàng đợi cho BFS.</li>
<li><code>String s += c</code> của Java trong vòng lặp chép lại cả chuỗi mỗi lần (String bất biến — immutable): 269 ms so với 0,3 ms dùng <code>StringBuilder</code> ở 100.000 ký tự. <code>ArrayList.remove(0)</code> của Java mắc đúng bệnh của <code>shift()</code>.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>"Có một vòng lặp thôi, nên là O(n)."</strong></p><p>Hãy đếm cả những gì xảy ra <em>bên trong</em> mỗi vòng, kể cả lời gọi thư viện. Một vòng <code>for</code> có <code>includes</code>, <code>shift()</code>, <code>slice()</code> hay <code>String +=</code> của Java bên trong là O(n²). Người phỏng vấn cố tình cài bẫy này trong câu hỏi nối tiếp.</p></div>
<p>Giữ bảng nhớ nhanh này trong đầu: truy cập theo chỉ số, push/pop ở cuối mảng, get/set/has của Map/Set — O(1) (trung bình với bảng băm); shift/unshift/splice/includes/indexOf/slice/sao chép — O(n); sort — O(n log n); thao tác trên <code>TreeMap</code> của Java hay trên heap — O(log n).</p>
</div>

<div class="ml-en">
<h3>Amortised O(1): why push is cheap even though arrays grow</h3>
<p>A dynamic array (JS array, Java <code>ArrayList</code>) has a fixed-size block underneath. When it is full, the next push allocates a bigger block (typically 1.5–2×) and copies everything: that one push costs O(n). But it happens so rarely that the total cost of n pushes is about 2n–3n copies — on average O(1) per push. "Amortised" means exactly this: averaged over a long sequence of operations, not over random inputs. You will use the same argument in Chapter 3 (monotonic stack: each element pushed and popped once) and you already used it for Longest Consecutive Sequence in Lesson 1.1.</p>
</div>
<div class="ml-vi">
<h3>O(1) khấu hao: vì sao push vẫn rẻ dù mảng phải nới ra</h3>
<p>Mảng động (mảng JS, <code>ArrayList</code> của Java) có một khối nhớ cố định bên dưới. Khi đầy, lần push kế tiếp cấp một khối lớn hơn (thường 1,5–2 lần) và chép hết sang: riêng lần push đó tốn O(n). Nhưng chuyện đó hiếm tới mức tổng chi phí của n lần push chỉ khoảng 2n–3n lần chép — trung bình O(1) mỗi lần push. "Amortised (khấu hao)" nghĩa đúng như vậy: chia trung bình trên cả một chuỗi dài thao tác, không phải trung bình trên các đầu vào ngẫu nhiên. Bạn sẽ dùng lại lập luận này ở Chương 3 (ngăn xếp đơn điệu: mỗi phần tử được đẩy vào và lấy ra đúng một lần), và bạn đã dùng nó cho Longest Consecutive Sequence ở bài 1.1.</p>
${csd('csd201-mang', 'vi', '1.1 Mảng & mảng động', '<p>CSD201 đã cài mảng động nhân đôi và chứng minh khấu hao. Ở đây ta chỉ cần kết luận để nói khi phỏng vấn: "push cuối mảng là O(1) khấu hao".</p>')}
</div>

<div class="ml-en">
<h3>🕵️ When exponential meets production: the Cloudflare outage of 2 July 2019</h3>
<p>Exponential complexity is not only an interview topic. On 2 July 2019, Cloudflare deployed a new firewall rule containing a regular expression with the fragment <code>.*(?:.*=.*)</code>. On certain inputs, a backtracking regex engine tries an enormous number of ways to split the text between the <code>.*</code> parts — work that grows super-linearly with the length of the input. CPUs across Cloudflare's network went to nearly 100 %, visitors saw 502 errors, and much of the sites behind Cloudflare were down for about 27 minutes. Among the fixes: switching to regex engines with run-time guarantees (re2 / Rust's regex) and profiling every rule's performance in tests.</p>
<p>Attackers use the same weakness on purpose: <strong>ReDoS</strong> (regular-expression denial of service) — send a short string crafted to make a vulnerable regex backtrack, and one request burns a CPU core for seconds. In Node that also freezes the event loop for every other user. Defences: avoid nested quantifiers like <code>(a+)+</code> and <code>.*.*</code> on user input, cap input length before matching, and use a linear-time engine when the pattern comes from configuration. This is Big-O as a security property.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Khi hàm mũ gặp production: sự cố Cloudflare ngày 2/7/2019</h3>
<p>Độ phức tạp hàm mũ không chỉ là chuyện phỏng vấn. Ngày 2/7/2019, Cloudflare triển khai một luật tường lửa mới chứa một biểu thức chính quy (regex) có đoạn <code>.*(?:.*=.*)</code>. Với một số đầu vào, engine regex kiểu quay lui thử một số lượng khổng lồ cách chia đoạn văn bản giữa các phần <code>.*</code> — khối lượng việc tăng nhanh hơn tuyến tính theo độ dài đầu vào. CPU trên toàn mạng Cloudflare lên gần 100 %, người dùng thấy lỗi 502, và rất nhiều trang web đứng sau Cloudflare sập khoảng 27 phút. Trong các cách khắc phục: chuyển sang engine regex có đảm bảo thời gian chạy (re2 / regex của Rust) và đo hiệu năng từng luật ngay trong bộ test.</p>
<p>Kẻ tấn công lợi dụng đúng điểm yếu này có chủ đích: <strong>ReDoS</strong> (tấn công từ chối dịch vụ bằng biểu thức chính quy) — gửi một chuỗi ngắn được chế sẵn để một regex yếu phải quay lui, và một request đốt trọn một nhân CPU trong nhiều giây. Trong Node nó còn làm đứng vòng lặp sự kiện (event loop) của mọi người dùng khác. Cách phòng: tránh lượng từ lồng nhau kiểu <code>(a+)+</code> và <code>.*.*</code> trên dữ liệu người dùng, giới hạn độ dài trước khi so khớp, và dùng engine thời gian tuyến tính khi mẫu đến từ cấu hình. Đây là Big-O dưới vai một thuộc tính bảo mật.</p>
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Calling a loop with a shrinking inner loop "O(n log n)" — the triangle is O(n²).</li>
<li>Forgetting the cost of library calls (<code>includes</code>, <code>shift</code>, <code>slice</code>, <code>substring</code> in a loop, <code>String +=</code> in Java).</li>
<li>Multiplying two loops that run one after the other (they add: O(n + m)).</li>
<li>Saying "O(n)" for an algorithm on a string of length n and a dictionary of m words without mentioning m.</li>
<li>Forgetting space: recursion depth, the hash map, the copy you made with <code>slice()</code>.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Gọi vòng lặp có vòng trong ngắn dần là "O(n log n)" — tam giác là O(n²).</li>
<li>Quên chi phí của lời gọi thư viện (<code>includes</code>, <code>shift</code>, <code>slice</code>, <code>substring</code> trong vòng lặp, <code>String +=</code> trong Java).</li>
<li>Nhân hai vòng lặp chạy nối tiếp (chúng cộng: O(n + m)).</li>
<li>Nói "O(n)" cho thuật toán trên chuỗi dài n và từ điển m từ mà không nhắc tới m.</li>
<li>Quên bộ nhớ: độ sâu đệ quy, cái hash map, bản sao bạn tạo bằng <code>slice()</code>.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud</h3>
${hoiThoai([
  ['I', 'What is the time complexity of your solution?'],
  ['C', 'O(n log n) time: sorting dominates, and the scan after it is O(n). O(n) extra space for the sorted copy — or O(log n) if I sort in place, depending on the language’s sort.'],
  ['N', 'Name the dominant step and why; give space separately; mention the trade-off you know.'],
  ['I', 'The constraints say n can be 10⁵. Would O(n²) have been OK?'],
  ['C', 'No — that is about 10¹⁰ steps; at roughly 10⁸ simple steps per second that is around 100 seconds. O(n log n) is about 1.7 million steps, well under a second.'],
  ['N', 'Turning Big-O into seconds with the 10⁸ rule is the strongest possible answer.'],
  ['I', 'And the hash-set version you mentioned?'],
  ['C', 'O(n) expected time with O(n) space. Expected, because a hash set can degrade with bad hashing — but with the built-in Set it is fine in practice.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to khi phỏng vấn</h3>
${hoiThoai([
  ['I', 'Độ phức tạp thời gian lời giải của bạn là bao nhiêu?'],
  ['C', 'O(n log n) thời gian: phần sắp xếp chiếm ưu thế, lượt quét sau đó là O(n). Bộ nhớ phụ O(n) cho bản sao đã sắp xếp — hoặc O(log n) nếu sắp xếp tại chỗ, tuỳ hàm sort của ngôn ngữ. <em>("Sorting dominates, the scan is linear.")</em>'],
  ['N', 'Gọi tên bước chiếm ưu thế và vì sao; nói bộ nhớ riêng; nhắc đánh đổi mình biết.'],
  ['I', 'Ràng buộc ghi n có thể tới 10⁵. O(n²) có ổn không?'],
  ['C', 'Không ạ — khoảng 10¹⁰ bước; với cỡ 10⁸ bước đơn giản mỗi giây là khoảng 100 giây. O(n log n) chỉ khoảng 1,7 triệu bước, dưới một giây. <em>("That would be around 10¹⁰ operations — too slow.")</em>'],
  ['N', 'Đổi Big-O ra số giây bằng quy tắc 10⁸ là câu trả lời mạnh nhất có thể.'],
  ['I', 'Còn bản dùng hash set bạn vừa nhắc?'],
  ['C', 'O(n) thời gian kỳ vọng, O(n) bộ nhớ. "Kỳ vọng" vì bảng băm có thể suy biến nếu băm tồi — nhưng với Set có sẵn thì thực tế ổn.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Quick self-test: six snippets</h3>
<ol>
<li><code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; 10; j++)</code> — ?</li>
<li><code>for (i = 1; i &lt; n; i *= 3)</code> — ?</li>
<li><code>for (x of a) if (b.includes(x)) …</code> with |a| = n, |b| = m — ?</li>
<li><code>a.sort(); for (i…) binarySearch(a, …)</code> — ?</li>
<li><code>for (i = 0; i &lt; n; i++) for (j = i; j &lt; n; j += i + 1)</code> — ? (hard)</li>
<li>A recursive function that calls itself twice on n − 1 — ?</li>
</ol>
${gap('Answers', '<ol><li>O(n) — the inner loop is a constant 10.</li><li>O(log n) — base 3, but bases do not matter in Big-O.</li><li>O(n·m) — includes scans b.</li><li>O(n log n) — sort n log n, then n searches of log n each.</li><li>O(n log n) — the inner loop runs about n/(i+1) times; summing n/1 + n/2 + … + n/n gives n·Hₙ ≈ n ln n (harmonic series).</li><li>O(2ⁿ) — the call tree doubles at each level.</li></ol>')}
</div>
<div class="ml-vi">
<h3>Tự kiểm nhanh: sáu đoạn mã</h3>
<ol>
<li><code>for (i = 0; i &lt; n; i++) for (j = 0; j &lt; 10; j++)</code> — ?</li>
<li><code>for (i = 1; i &lt; n; i *= 3)</code> — ?</li>
<li><code>for (x of a) if (b.includes(x)) …</code> với |a| = n, |b| = m — ?</li>
<li><code>a.sort(); for (i…) binarySearch(a, …)</code> — ?</li>
<li><code>for (i = 0; i &lt; n; i++) for (j = i; j &lt; n; j += i + 1)</code> — ? (khó)</li>
<li>Hàm đệ quy gọi chính nó hai lần với n − 1 — ?</li>
</ol>
${gap('Đáp án', '<ol><li>O(n) — vòng trong là hằng số 10.</li><li>O(log n) — cơ số 3, nhưng cơ số không quan trọng trong Big-O.</li><li>O(n·m) — includes quét b.</li><li>O(n log n) — sort n log n, rồi n lần tìm nhị phân, mỗi lần log n.</li><li>O(n log n) — vòng trong chạy khoảng n/(i+1) lần; cộng n/1 + n/2 + … + n/n được n·Hₙ ≈ n ln n (chuỗi điều hoà).</li><li>O(2ⁿ) — cây lời gọi nhân đôi ở mỗi tầng.</li></ol>')}
</div>

<div class="ml-en">
<h3>Practice problems</h3>
${bangDe(DE, 'en')}
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Copy <code>dem-vong.ts</code> or <code>DemVong.java</code> into your practice folder and add a seventh shape: <code>for (i = 0; i * i &lt; n; i++)</code>. Predict the count for n = 16 and n = 64, then run it.</li>
<li>Solve LC 217 three ways (pairs, sort, Set) and write the time/space of each in your log.</li>
<li>Pick any LeetCode problem you have not seen; read only its constraints; write the target complexity from the table before reading the statement.</li>
</ol>
<p><strong>Done when:</strong> your prediction for the seventh shape matches the program (√n: 4 and 8), three LC 217 versions are accepted, and you wrote one target complexity from constraints alone.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Big-O</span><span class="v">An upper bound on how the number of steps grows with n, ignoring constants.</span></div>
  <div class="kv"><span class="k">worst case</span><span class="v">The slowest input of size n; the default meaning in interviews.</span></div>
  <div class="kv"><span class="k">space complexity</span><span class="v">Extra memory as a function of n, including the call stack.</span></div>
  <div class="kv"><span class="k">amortised</span><span class="v">Average cost per operation over a long sequence of operations.</span></div>
  <div class="kv"><span class="k">logarithmic</span><span class="v">Grows by +1 when n doubles: halving or doubling loops.</span></div>
  <div class="kv"><span class="k">exponential</span><span class="v">Multiplies when n grows by a constant: 2ⁿ, 1.6ⁿ.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Denial of service by forcing a regex to backtrack exponentially.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Big-O answers one question: does the idea fit the input size?</li>
<li>Count steps by shape: loop n, nested n², halving log n, sort n log n, two branches 2ⁿ.</li>
<li>A real machine does ~2.5·10⁸ simple steps/s; plan with 10⁸.</li>
<li>Read the constraints first and look up the target complexity in the table.</li>
<li>Library calls hide loops: includes, shift, String +=, remove(0).</li>
<li>Exponential work in production is an outage — or an attack.</li>
</ul>
${nguon('📊', 'Big-O Cheat Sheet', 'Complexity of common data-structure operations and sorts', 'https://www.bigocheatsheet.com/')}
${nguon('🔥', 'Cloudflare — details of the outage on July 2, 2019', 'The regex .*(?:.*=.*), 27 minutes, and the fixes', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/')}
${nguon('📗', 'Tech Interview Handbook — algorithms study cheatsheet', 'Time complexities to know for interviews', 'https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/')}
</div>
<div class="ml-vi">
<h3>Đề luyện</h3>
${bangDe(DE, 'vi')}
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Chép <code>dem-vong.ts</code> hoặc <code>DemVong.java</code> vào thư mục luyện tập và thêm dạng thứ bảy: <code>for (i = 0; i * i &lt; n; i++)</code>. Đoán số bước với n = 16 và n = 64, rồi chạy.</li>
<li>Giải LC 217 bằng ba cách (từng cặp, sắp xếp, Set) và ghi thời gian/bộ nhớ của từng cách vào sổ.</li>
<li>Chọn một đề LeetCode bất kỳ chưa thấy; chỉ đọc phần ràng buộc; ghi ra độ phức tạp đích theo bảng trước khi đọc đề.</li>
</ol>
<p><strong>Đạt khi:</strong> dự đoán dạng thứ bảy khớp chương trình (√n: 4 và 8), ba bản LC 217 đều Accepted, và bạn ghi được một độ phức tạp đích chỉ từ ràng buộc.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Big-O (ký hiệu O lớn)</span><span class="v">Cận trên của tốc độ tăng số bước theo n, bỏ qua hằng số.</span></div>
  <div class="kv"><span class="k">worst case (trường hợp xấu nhất)</span><span class="v">Đầu vào cỡ n chạy chậm nhất; nghĩa mặc định khi phỏng vấn.</span></div>
  <div class="kv"><span class="k">space complexity (độ phức tạp bộ nhớ)</span><span class="v">Bộ nhớ phụ theo n, tính cả ngăn xếp lời gọi.</span></div>
  <div class="kv"><span class="k">amortised (khấu hao)</span><span class="v">Chi phí trung bình mỗi thao tác trên một chuỗi dài thao tác.</span></div>
  <div class="kv"><span class="k">logarithmic (lô-ga-rit)</span><span class="v">Tăng thêm 1 khi n gấp đôi: vòng chia đôi hoặc nhân đôi.</span></div>
  <div class="kv"><span class="k">exponential (hàm mũ)</span><span class="v">Nhân lên mỗi khi n tăng một lượng cố định: 2ⁿ, 1,6ⁿ.</span></div>
  <div class="kv"><span class="k">ReDoS (từ chối dịch vụ bằng regex)</span><span class="v">Làm sập dịch vụ bằng cách ép một regex quay lui theo hàm mũ.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Big-O trả lời một câu hỏi: ý tưởng có vừa kích thước đầu vào không?</li>
<li>Đếm bước theo dạng: một vòng n, lồng n², chia đôi log n, sắp xếp n log n, hai nhánh 2ⁿ.</li>
<li>Máy thật chạy ~2,5·10⁸ bước đơn giản/giây; lập kế hoạch với 10⁸.</li>
<li>Đọc ràng buộc trước và tra độ phức tạp đích trong bảng.</li>
<li>Lời gọi thư viện giấu vòng lặp: includes, shift, String +=, remove(0).</li>
<li>Khối lượng việc hàm mũ ở production là một sự cố — hoặc một vụ tấn công.</li>
</ul>
${nguon('📊', 'Big-O Cheat Sheet', 'Độ phức tạp các thao tác cấu trúc dữ liệu và thuật toán sắp xếp', 'https://www.bigocheatsheet.com/')}
${nguon('🔥', 'Cloudflare — chi tiết sự cố ngày 2/7/2019', 'Regex .*(?:.*=.*), 27 phút sập, và cách khắc phục (tiếng Anh)', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/')}
${nguon('📗', 'Tech Interview Handbook — bảng ôn thuật toán', 'Độ phức tạp cần thuộc khi phỏng vấn', 'https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/')}
</div>
`,
};
