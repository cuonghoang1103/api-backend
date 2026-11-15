/** 6.5 — Kiểm tra Chương 6 — 10 câu tình huống. Mọi output nhắc tới là output thật (../ma/ch06 hoặc nháp $TMPDIR/dsa-nhap/ch06/quiz.mjs). */
export default {
  title: '6.5 — Chapter 6 check|||6.5 — Kiểm tra Chương 6',
  slug: 'dsa-6-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về heap, PriorityQueue, comparator tràn số, top-k, hai heap trung vị, khoảng nửa mở/đóng, tham lam theo điểm cuối và đường quét — đọc mã đoán output, chọn cấu trúc, bắt ca biên.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Chapter 6 check</h2>
<p class="lead">Ten situations, fifteen minutes. Every output quoted in a question comes from running the code. Each explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a min-heap with a comparator from memory and explain sift-up and sift-down.</li>
<li>I know which heap (min or max) keeps the k largest, and why.</li>
<li>I never write a Java comparator that subtracts, and I can show the input that breaks it.</li>
<li>I can state the two invariants of the running-median heaps.</li>
<li>Before any interval problem I decide half-open or closed, and I know where that choice appears in the code.</li>
<li>I can count rooms both with a heap of end times and with a +1/−1 sweep.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6</h2>
<p class="lead">Mười tình huống, mười lăm phút. Mọi output được trích trong câu hỏi đều đến từ việc chạy mã thật. Mỗi lời giải thích nói vì sao đáp án đúng là đúng, và vì sao phương án hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được min-heap có comparator từ trí nhớ và giải thích được nổi lên, chìm xuống.</li>
<li>Tôi biết heap nào (min hay max) giữ k số lớn nhất, và vì sao.</li>
<li>Tôi không bao giờ viết comparator Java bằng phép trừ, và chỉ ra được đầu vào làm nó hỏng.</li>
<li>Tôi phát biểu được hai bất biến của cặp heap trung vị động.</li>
<li>Trước mọi bài khoảng tôi quyết định nửa mở hay đóng, và biết lựa chọn đó nằm ở đâu trong code.</li>
<li>Tôi đếm được số phòng bằng heap giờ kết thúc và bằng phép quét +1/−1.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A service receives 10⁶ exam scores as a stream and must report the 5 highest at the end, using O(k) memory. Which structure?|||Một dịch vụ nhận 10⁶ điểm thi theo luồng và cuối cùng phải báo 5 điểm cao nhất, chỉ dùng bộ nhớ O(k). Chọn cấu trúc nào?',
        options: [
          'A max-heap of all scores, then pop 5 times|||Một max-heap chứa mọi điểm, rồi pop 5 lần',
          'A min-heap that pops whenever its size exceeds 5|||Một min-heap, hễ kích thước vượt 5 thì pop',
          'A max-heap that pops whenever its size exceeds 5|||Một max-heap, hễ kích thước vượt 5 thì pop',
          'Collect all scores in an array, sort, take the last 5|||Gom mọi điểm vào mảng, sắp xếp, lấy 5 phần tử cuối',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: To keep the 5 largest you must be able to throw out the SMALLEST of the kept ones, so the smallest must be on top: a min-heap of size 5, O(n log 5) time, O(5) memory. A max-heap of size 5 would evict the largest — it keeps the 5 smallest. A heap of all scores or a sorted array works but uses O(n) memory.|||VI: Muốn giữ 5 số lớn nhất thì phải loại được số NHỎ nhất trong những số đang giữ, nên số nhỏ nhất phải nằm trên đỉnh: min-heap kích thước 5, O(n log 5) thời gian, O(5) bộ nhớ. Max-heap kích thước 5 sẽ loại số lớn nhất — nó giữ 5 số nhỏ nhất. Heap chứa mọi điểm hay mảng đã sắp đều ra đúng nhưng tốn O(n) bộ nhớ.',
      },
      {
        question: 'Java: PriorityQueue<Integer> pq = new PriorityQueue<>(); you offer 5, 3, 8, 1, 9, 2 in that order, then System.out.println(pq). What is printed?|||Java: PriorityQueue<Integer> pq = new PriorityQueue<>(); bạn offer 5, 3, 8, 1, 9, 2 theo đúng thứ tự đó, rồi System.out.println(pq). In ra gì?',
        options: [
          '[1, 2, 3, 5, 8, 9]',
          '[9, 8, 5, 3, 2, 1]',
          '[5, 3, 8, 1, 9, 2]',
          '[1, 3, 2, 5, 9, 8]',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: toString (and for-each) shows the internal heap array, not sorted order. Real output from HeapDemo.java: [1, 3, 2, 5, 9, 8] — 1 is at the root and every parent is ≤ its children, but 3 comes before 2. Only repeated poll() gives 1, 2, 3, 5, 8, 9, which is why the first option is tempting and wrong.|||VI: toString (và for-each) in ra mảng heap bên trong, không phải thứ tự đã sắp. Output thật của HeapDemo.java: [1, 3, 2, 5, 9, 8] — 1 ở gốc và mọi cha ≤ con, nhưng 3 đứng trước 2. Chỉ poll() lặp lại mới cho 1, 2, 3, 5, 8, 9, nên phương án đầu hấp dẫn nhưng sai.',
      },
      {
        question: 'Java: new PriorityQueue<Integer>((a, b) -> a - b), offering 5, 2_000_000_000, -7, -2_000_000_000, 0, then polling everything. What order comes out?|||Java: new PriorityQueue<Integer>((a, b) -> a - b), offer 5, 2_000_000_000, -7, -2_000_000_000, 0, rồi poll hết. Thứ tự lấy ra là gì?',
        options: [
          '[-7, 0, -2000000000, 5, 2000000000]',
          '[-2000000000, -7, 0, 5, 2000000000]',
          'It throws ArithmeticException on overflow|||Ném ArithmeticException khi tràn số',
          '[2000000000, 5, 0, -7, -2000000000]',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 2,000,000,000 − (−2,000,000,000) overflows int and wraps to −294,967,296, so the comparator says 2·10⁹ is smaller than −2·10⁹. Real output of ComparatorTran.java: [-7, 0, -2000000000, 5, 2000000000] — the most negative value comes out third. Java int arithmetic never throws on overflow; the sorted answer is what Integer.compare gives.|||VI: 2.000.000.000 − (−2.000.000.000) tràn int và quay vòng thành −294.967.296, nên comparator nói 2·10⁹ nhỏ hơn −2·10⁹. Output thật của ComparatorTran.java: [-7, 0, -2000000000, 5, 2000000000] — giá trị âm nhất ra thứ ba. Phép tính int của Java không bao giờ ném lỗi khi tràn; thứ tự đúng là thứ Integer.compare cho ra.',
      },
      {
        question: 'A job queue orders jobs by deadline (epoch milliseconds, long) with (a, b) -> (int) (a.deadline() - b.deadline()). Three jobs: due now, due in 7 days, due in 30 days. Which runs first?|||Một hàng đợi việc sắp theo hạn chót (mili giây epoch, kiểu long) bằng (a, b) -> (int) (a.deadline() - b.deadline()). Ba việc: hạn ngay bây giờ, hạn sau 7 ngày, hạn sau 30 ngày. Việc nào chạy trước?',
        options: [
          'The job due now|||Việc có hạn ngay bây giờ',
          'The job due in 7 days|||Việc hạn sau 7 ngày',
          'The job due in 30 days|||Việc hạn sau 30 ngày',
          'It depends on insertion order, randomly|||Tuỳ thứ tự thêm vào, ngẫu nhiên',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: 30 days = 2,592,000,000 ms, which does not fit in an int: the cast gives −1,702,967,296, so the 30-day job compares as EARLIER than the job due now. Real output: "(int) (a - b) runs first : attacker (in 30 days)". 7 days = 604,800,000 ms fits, so the 7-day job is ordered correctly. Fix: Comparator.comparingLong or Long.compare.|||VI: 30 ngày = 2.592.000.000 ms, không vừa int: ép kiểu ra −1.702.967.296, nên việc 30 ngày được so là SỚM hơn việc hạn ngay bây giờ. Output thật: "(int) (a - b) runs first : attacker (in 30 days)". 7 ngày = 604.800.000 ms vẫn vừa, nên việc 7 ngày được xếp đúng. Sửa: Comparator.comparingLong hoặc Long.compare.',
      },
      {
        question: 'MedianFinder with lo = max-heap, hi = min-heap; addNum routes x to lo if x ≤ top(lo), else to hi, then moves one top if sizes differ by more than allowed (lo = hi or hi + 1). After adding 5, 15, 1, 3 — what is the state?|||MedianFinder với lo = max-heap, hi = min-heap; addNum đưa x vào lo nếu x ≤ đỉnh(lo), ngược lại vào hi, rồi chuyển một đỉnh nếu kích thước lệch quá mức cho phép (lo = hi hoặc hi + 1). Sau khi thêm 5, 15, 1, 3 — trạng thái là gì?',
        options: [
          'lo = {5, 3, 1}, hi = {15}, median 5.0',
          'lo = {3, 1}, hi = {5, 15}, median 4.0',
          'lo = {1, 3}, hi = {5, 15}, median 3.0',
          'lo = {5, 1}, hi = {3, 15}, median 4.0',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: 5 → lo; 15 > 5 → hi; 1 → lo (sizes 2/1, allowed); 3 ≤ 5 → lo, now 3/1, so lo’s top 5 moves to hi: lo {3, 1}, hi {5, 15}, median (3 + 5) / 2 = 4.0 — the trace table of lesson 6.2. The first option forgets to rebalance; the last breaks the order invariant (3 in hi while 5 is in lo).|||VI: 5 → lo; 15 > 5 → hi; 1 → lo (kích thước 2/1, được phép); 3 ≤ 5 → lo, giờ 3/1, nên đỉnh 5 của lo chuyển sang hi: lo {3, 1}, hi {5, 15}, trung vị (3 + 5) / 2 = 4.0 — đúng bảng vết của bài 6.2. Phương án đầu quên cân bằng; phương án cuối phá bất biến thứ tự (3 ở hi trong khi 5 ở lo).',
      },
      {
        question: 'Java, sliding window median: a = b = Integer.MAX_VALUE, and you compute (a + b) / 2.0. What is the result?|||Java, sliding window median: a = b = Integer.MAX_VALUE, và bạn tính (a + b) / 2.0. Kết quả là gì?',
        options: [
          '-1.0',
          '2.147483647E9',
          'It throws ArithmeticException|||Ném ArithmeticException',
          '1.0737418235E9',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: a + b is evaluated as int + int first and wraps to −2; only then is it divided by 2.0: −1.0 (real output of TranTrungVi.java). The tempting 2.147483647E9 is what you get after widening — ((double) a + b) / 2.0 or a / 2.0 + b / 2.0. TypeScript would print 2147483647 because all numbers are doubles.|||VI: a + b được tính theo int + int trước và quay vòng thành −2; chỉ sau đó mới chia cho 2.0: −1.0 (output thật của TranTrungVi.java). Con số hấp dẫn 2.147483647E9 là thứ bạn có sau khi nới kiểu — ((double) a + b) / 2.0 hoặc a / 2.0 + b / 2.0. TypeScript sẽ in 2147483647 vì mọi số đều là double.',
      },
      {
        question: 'Lab bookings [[9,11],[10,12],[11,13],[13,14],[9,10]]. Minimum rooms if bookings are half-open [start, end), and minimum groups if they are closed [start, end] (LC 2406)?|||Các lượt đặt lab [[9,11],[10,12],[11,13],[13,14],[9,10]]. Số phòng tối thiểu nếu lượt đặt là nửa mở [start, end), và số nhóm tối thiểu nếu là khoảng đóng [start, end] (LC 2406)?',
        options: [
          '2 and 2|||2 và 2',
          '3 and 3|||3 và 3',
          '2 and 3|||2 và 3',
          '3 and 2|||3 và 2',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Half-open: a room freed at 10 or 11 is reused at that same time, the count never exceeds 2. Closed: the point 10 lies in [9,10], [9,11] and [10,12] at once ⇒ 3. Real output of min-groups.ts: half-open heap=2 sweep=2, closed heap=3 sweep=3. Closed intervals can never need FEWER groups than half-open ones, so "3 and 2" is impossible.|||VI: Nửa mở: phòng trả lúc 10 hoặc 11 được dùng lại ngay lúc đó, bộ đếm không bao giờ vượt 2. Đóng: điểm 10 nằm cùng lúc trong [9,10], [9,11] và [10,12] ⇒ 3. Output thật của min-groups.ts: half-open heap=2 sweep=2, closed heap=3 sweep=3. Khoảng đóng không bao giờ cần ÍT nhóm hơn khoảng nửa mở, nên "3 và 2" là không thể.',
      },
      {
        question: 'Max number of non-overlapping intervals. A teammate sorts by START and keeps an interval when it starts at or after the end of the last kept one. On [[1,10],[2,3],[4,5],[6,7]], how many does their code keep, and what is optimal?|||Số khoảng không chồng lấn nhiều nhất. Một bạn trong nhóm sắp theo điểm ĐẦU và giữ một khoảng khi nó bắt đầu từ điểm cuối của khoảng vừa giữ trở đi. Với [[1,10],[2,3],[4,5],[6,7]], code của bạn ấy giữ được bao nhiêu, và tối ưu là bao nhiêu?',
        options: [
          'Keeps 3; optimal 3|||Giữ 3; tối ưu 3',
          'Keeps 1; optimal 1|||Giữ 1; tối ưu 1',
          'Keeps 2; optimal 3|||Giữ 2; tối ưu 3',
          'Keeps 1; optimal 3|||Giữ 1; tối ưu 3',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Sorted by start, [1,10] comes first and is kept; every other interval starts before 10 and is rejected: 1 kept (checked in scratch). Sorting by END keeps [2,3], [4,5], [6,7]: 3, which is optimal (lesson 6.3: erase = 1). The exchange argument is why the greedy must sort by end — whoever finishes first leaves the most room.|||VI: Sắp theo điểm đầu thì [1,10] đứng đầu và được giữ; mọi khoảng khác bắt đầu trước 10 nên bị loại: giữ 1 (đã chạy kiểm trong nháp). Sắp theo điểm CUỐI giữ [2,3], [4,5], [6,7]: 3, là tối ưu (bài 6.3: erase = 1). Lập luận đổi chỗ là lý do tham lam phải sắp theo điểm cuối — ai xong sớm nhất chừa nhiều chỗ nhất.',
      },
      {
        question: 'Half-open meetings, sweep line with events (time, +1/−1). You sort ties so that START (+1) comes before END (−1). On the lab bookings of question 7, what maximum count does the sweep report?|||Cuộc họp nửa mở, đường quét với sự kiện (thời điểm, +1/−1). Bạn sắp các trường hợp bằng giờ sao cho BẮT ĐẦU (+1) đứng trước KẾT THÚC (−1). Trên các lượt đặt lab của câu 7, phép quét báo giá trị lớn nhất là bao nhiêu?',
        options: [
          '2 — tie order never matters|||2 — thứ tự khi bằng giờ không bao giờ quan trọng',
          '4',
          '3 — one room too many|||3 — thừa một phòng',
          '1',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: At t = 10 the start of [10,12) is counted before the end of [9,10), so for an instant three meetings look active; same at t = 11. Checked in scratch: end-first 2, start-first 3. For half-open intervals ends must come first; start-first is exactly the closed-interval answer. Tie order is the whole difference, so "never matters" is the trap.|||VI: Tại t = 10, sự kiện bắt đầu của [10,12) được đếm trước sự kiện kết thúc của [9,10), nên trong một khoảnh khắc trông như có ba cuộc họp đang diễn ra; tương tự tại t = 11. Đã chạy kiểm trong nháp: kết thúc trước ra 2, bắt đầu trước ra 3. Với khoảng nửa mở thì kết thúc phải đứng trước; bắt đầu trước chính là đáp án của khoảng đóng. Thứ tự khi bằng giờ là toàn bộ sự khác biệt, nên "không bao giờ quan trọng" là cái bẫy.',
      },
      {
        question: 'Measured in Java at n = 10⁶, k = n/2: Arrays.sort(int[]) 59.4 ms, PriorityQueue<Integer> of size k 140.0 ms (after JIT warm-up). What best explains the heap being slower than its O(n log k) suggests?|||Đo trong Java với n = 10⁶, k = n/2: Arrays.sort(int[]) 59,4 ms, PriorityQueue<Integer> kích thước k 140,0 ms (đã làm nóng JIT). Điều gì giải thích tốt nhất việc heap chậm hơn mức O(n log k) gợi ý?',
        options: [
          'The heap of size k is really O(n²) when k = n/2|||Heap kích thước k thật ra là O(n²) khi k = n/2',
          'The JIT compiler never optimises PriorityQueue|||Trình biên dịch JIT không bao giờ tối ưu PriorityQueue',
          'Arrays.sort uses a heap internally, so it is the same work|||Arrays.sort dùng heap bên trong nên là cùng một công việc',
          'With k = n/2, log k ≈ log n, and every Integer in the queue is a boxed object|||Với k = n/2 thì log k ≈ log n, và mỗi Integer trong hàng đợi là một đối tượng đóng hộp',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: When k is half of n the heap’s advantage (log k instead of log n) disappears, and PriorityQueue<Integer> stores boxed objects (allocation, pointer chasing) while Arrays.sort(int[]) works on raw ints. Real numbers from TopKDo.java. The heap is still O(n log k), not O(n²); Arrays.sort on int[] is a dual-pivot quicksort, not a heap.|||VI: Khi k bằng nửa n thì lợi thế của heap (log k thay vì log n) biến mất, và PriorityQueue<Integer> chứa các đối tượng đóng hộp (cấp phát, nhảy con trỏ) trong khi Arrays.sort(int[]) làm trên số nguyên thô. Số đo thật từ TopKDo.java. Heap vẫn là O(n log k), không phải O(n²); Arrays.sort trên int[] là quicksort hai chốt (dual-pivot), không phải heap.',
      },
    ],
  },
};
