/**
 * CSD204 — Data Structures and Algorithms with Python. Ngành Khoa học Máy tính
 * FPTU (Kỳ 3). Cấu trúc dữ liệu & giải thuật: phân tích Big-O, mảng/danh sách/
 * ngăn xếp/hàng đợi, đệ quy, sắp xếp, tìm kiếm & băm, cây & heap, đồ thị, quy
 * hoạch động & tham lam. Song ngữ + Big-O + code Python + quiz mỗi chương.
 * Sách chuẩn: Goodrich/Tamassia/Goldwasser; CLRS. Giữ NGUYÊN slug/semester/
 * courseCode/thumb. ⚠️ KHÔNG backtick lồng/${; "&"→&amp; trong HTML content.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('csd204-0-1-overview', 'Course overview: Data structures & algorithms|||Tổng quan: Cấu trúc dữ liệu & giải thuật',
  'Cấu trúc dữ liệu & giải thuật là gì; vì sao Big-O quan trọng; lộ trình: phân tích độ phức tạp → cấu trúc tuyến tính → đệ quy → sắp xếp/tìm kiếm → cây → đồ thị → quy hoạch động & tham lam. Code Python.',
  [[
    `<span class="eyebrow">CSD204 · Lesson 0.1 · Overview</span>
<h2>Data Structures &amp; Algorithms in Python</h2>
<p class="lead">This course teaches you to <strong>organize data</strong> and <strong>design efficient algorithms</strong> — the core skill behind fast software and every coding interview. You will implement each structure in <strong>Python</strong> and reason about its cost with <strong>Big-O</strong>.</p>
<h3>Two questions you will always ask</h3>
<ul>
<li><strong>Which data structure?</strong> — a list, a stack, a hash table, a tree, a graph? The right choice turns a slow program into a fast one.</li>
<li><strong>How costly is my algorithm?</strong> — measured by how run time and memory grow as the input grows (Big-O), not by a stopwatch on one machine.</li>
</ul>
<h3>Roadmap</h3>
<p>Complexity analysis (Big-O) → linear structures (arrays, linked lists, stacks, queues) → recursion → sorting → searching &amp; hashing → trees &amp; heaps → graphs (BFS/DFS/Dijkstra) → dynamic programming &amp; greedy. Bilingual, with runnable Python and a quiz per chapter.</p>`,
    `<span class="eyebrow">CSD204 · Bài 0.1 · Tổng quan</span>
<h2>Cấu trúc dữ liệu &amp; giải thuật với Python</h2>
<p class="lead">Môn này dạy bạn <strong>tổ chức dữ liệu</strong> và <strong>thiết kế giải thuật hiệu quả</strong> — kỹ năng lõi đằng sau phần mềm nhanh và mọi buổi phỏng vấn code. Bạn tự cài mỗi cấu trúc bằng <strong>Python</strong> và lập luận chi phí bằng <strong>Big-O</strong>.</p>
<h3>Hai câu hỏi luôn phải đặt</h3>
<ul>
<li><strong>Dùng cấu trúc nào?</strong> — danh sách, ngăn xếp, bảng băm, cây hay đồ thị? Chọn đúng biến chương trình chậm thành nhanh.</li>
<li><strong>Giải thuật tốn bao nhiêu?</strong> — đo bằng tốc độ tăng của thời gian và bộ nhớ khi dữ liệu lớn dần (Big-O), không phải bấm giờ trên một máy.</li>
</ul>
<h3>Lộ trình</h3>
<p>Phân tích độ phức tạp (Big-O) → cấu trúc tuyến tính (mảng, danh sách liên kết, ngăn xếp, hàng đợi) → đệ quy → sắp xếp → tìm kiếm &amp; băm → cây &amp; heap → đồ thị (BFS/DFS/Dijkstra) → quy hoạch động &amp; tham lam. Song ngữ, có code Python chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('csd204-1-1-complexity', '1.1 — Complexity analysis (Big-O)|||1.1 — Phân tích độ phức tạp (Big-O)',
  'Big-O (chặn trên), Omega (chặn dưới), Theta (chặn chặt); các lớp O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n); phân tích thời gian và không gian.',
  [[
    `<span class="eyebrow">CSD204 · Chapter 1 · Lesson 1.1</span>
<h2>Complexity analysis (Big-O)</h2>
<h3>Three notations</h3>
<ul>
<li><strong>Big-O (O)</strong> — asymptotic <em>upper</em> bound: the worst-case growth. The one you quote most.</li>
<li><strong>Omega (&Omega;)</strong> — asymptotic <em>lower</em> bound: the best case cannot beat it.</li>
<li><strong>Theta (&Theta;)</strong> — a <em>tight</em> bound: upper and lower agree.</li>
</ul>
<h3>Common growth classes (fast to slow)</h3>
<pre><code>O(1)        constant     hash lookup, list[i]
O(log n)    logarithmic  binary search
O(n)        linear       one scan of n items
O(n log n)  linearithmic merge sort, heap sort
O(n^2)      quadratic    nested loop over n
O(2^n)      exponential  naive recursive subsets
</code></pre>
<p>Drop constants and lower-order terms: <code>3n + 5</code> is <strong>O(n)</strong>; <code>2n^2 + n</code> is <strong>O(n^2)</strong>.</p>
<pre><code># Count basic operations, not seconds
def has_duplicate(nums):        # time O(n^2), space O(1)
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
</code></pre>
<div class="callout"><span class="badge">Time vs space</span> Every algorithm has BOTH a time cost and a space (memory) cost. A hash set turns the loop above into O(n) time at the price of O(n) extra space — the classic time-space trade-off.</div>`,
    `<span class="eyebrow">CSD204 · Chương 1 · Bài 1.1</span>
<h2>Phân tích độ phức tạp (Big-O)</h2>
<h3>Ba ký hiệu</h3>
<ul>
<li><strong>Big-O (O)</strong> — chặn <em>trên</em> tiệm cận: mức tăng xấu nhất. Cái hay được nhắc nhất.</li>
<li><strong>Omega (&Omega;)</strong> — chặn <em>dưới</em> tiệm cận: trường hợp tốt nhất cũng không nhanh hơn.</li>
<li><strong>Theta (&Theta;)</strong> — chặn <em>chặt</em>: trên và dưới trùng nhau.</li>
</ul>
<h3>Các lớp tăng thường gặp (nhanh đến chậm)</h3>
<pre><code>O(1)        hằng số     tra bảng băm, list[i]
O(log n)    lô-ga       tìm kiếm nhị phân
O(n)        tuyến tính  duyệt n phần tử một lần
O(n log n)  á tuyến     merge sort, heap sort
O(n^2)      bậc hai     vòng lặp lồng trên n
O(2^n)      mũ          liệt kê tập con đệ quy ngây thơ
</code></pre>
<p>Bỏ hằng số và bậc thấp: <code>3n + 5</code> là <strong>O(n)</strong>; <code>2n^2 + n</code> là <strong>O(n^2)</strong>.</p>
<pre><code># Đếm số phép cơ bản, không đếm giây
def has_duplicate(nums):        # thời gian O(n^2), bộ nhớ O(1)
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
</code></pre>
<div class="callout"><span class="badge">Thời gian vs không gian</span> Mỗi giải thuật có CẢ chi phí thời gian LẪN chi phí không gian (bộ nhớ). Một hash set biến vòng lặp trên thành O(n) thời gian nhưng tốn O(n) bộ nhớ thêm — đánh đổi thời gian &amp; không gian kinh điển.</div>`,
  ]]);

const c1q = quiz('csd204-quiz-1', 'Quiz 1 — Complexity|||Quiz 1 — Độ phức tạp', [
  { id: 'q1', question: 'Big-O mô tả điều gì?', options: ['Chặn dưới tốt nhất', 'Chặn trên (tăng xấu nhất)', 'Bộ nhớ chính xác', 'Số giây chạy'], correctIndex: 1, explanation: 'Big-O là chặn trên tiệm cận — mức tăng ở trường hợp xấu nhất.' },
  { id: 'q2', question: 'Độ phức tạp của 3n + 5 rút gọn là?', options: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'], correctIndex: 1, explanation: 'Bỏ hằng số và bậc thấp: 3n + 5 là O(n).' },
  { id: 'q3', question: 'Tìm kiếm nhị phân trên mảng đã sắp có độ phức tạp?', options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], correctIndex: 2, explanation: 'Mỗi bước cắt đôi không gian tìm kiếm nên là O(log n).' },
]);

const c2 = doc('csd204-2-1-linear', '2.1 — Arrays, lists, stacks & queues|||2.1 — Mảng, danh sách, ngăn xếp & hàng đợi',
  'Python list (mảng động), danh sách liên kết, ngăn xếp (LIFO), hàng đợi (FIFO) và deque; Big-O của mỗi thao tác.',
  [[
    `<span class="eyebrow">CSD204 · Chapter 2 · Lesson 2.1</span>
<h2>Arrays, lists, stacks &amp; queues</h2>
<h3>Python list = dynamic array</h3>
<ul>
<li>Index <code>list[i]</code> and <code>append</code> (amortized): <strong>O(1)</strong>.</li>
<li>Insert/delete in the middle, or <code>x in list</code> search: <strong>O(n)</strong> (elements shift/scan).</li>
</ul>
<h3>Linked list</h3>
<p>Each node holds a value plus a pointer to the next. Insert/delete at a known node is <strong>O(1)</strong>, but random access is <strong>O(n)</strong> — you must walk the chain.</p>
<h3>Stack (LIFO) &amp; queue (FIFO)</h3>
<ul>
<li><strong>Stack</strong> — last in, first out. Use a list: <code>append</code>/<code>pop</code> are O(1). Used for undo, call stacks, DFS.</li>
<li><strong>Queue</strong> — first in, first out. Use <code>collections.deque</code>: <code>append</code>/<code>popleft</code> are O(1). Used for BFS, task buffers.</li>
</ul>
<pre><code>from collections import deque
stack = []            # LIFO
stack.append(1); stack.append(2)
stack.pop()           # -> 2   (O(1))

queue = deque()       # FIFO
queue.append(1); queue.append(2)
queue.popleft()       # -> 1   (O(1))
</code></pre>
<div class="callout"><span class="badge">Do not use list as a queue</span> A plain list <code>pop(0)</code> is O(n) because every element shifts left. Reach for <code>deque</code> whenever you need FIFO.</div>`,
    `<span class="eyebrow">CSD204 · Chương 2 · Bài 2.1</span>
<h2>Mảng, danh sách, ngăn xếp &amp; hàng đợi</h2>
<h3>Python list = mảng động</h3>
<ul>
<li>Truy cập <code>list[i]</code> và <code>append</code> (khấu hao): <strong>O(1)</strong>.</li>
<li>Chèn/xoá ở giữa, hoặc tìm <code>x in list</code>: <strong>O(n)</strong> (phải dời/duyệt phần tử).</li>
</ul>
<h3>Danh sách liên kết</h3>
<p>Mỗi nút giữ một giá trị cộng con trỏ tới nút kế. Chèn/xoá tại một nút đã biết là <strong>O(1)</strong>, nhưng truy cập ngẫu nhiên là <strong>O(n)</strong> — phải đi lần theo chuỗi.</p>
<h3>Ngăn xếp (LIFO) &amp; hàng đợi (FIFO)</h3>
<ul>
<li><strong>Ngăn xếp</strong> — vào sau ra trước. Dùng list: <code>append</code>/<code>pop</code> là O(1). Dùng cho undo, call stack, DFS.</li>
<li><strong>Hàng đợi</strong> — vào trước ra trước. Dùng <code>collections.deque</code>: <code>append</code>/<code>popleft</code> là O(1). Dùng cho BFS, bộ đệm công việc.</li>
</ul>
<pre><code>from collections import deque
stack = []            # LIFO
stack.append(1); stack.append(2)
stack.pop()           # -> 2   (O(1))

queue = deque()       # FIFO
queue.append(1); queue.append(2)
queue.popleft()       # -> 1   (O(1))
</code></pre>
<div class="callout"><span class="badge">Đừng dùng list làm hàng đợi</span> Với list thường, <code>pop(0)</code> là O(n) vì mọi phần tử phải dời sang trái. Cần FIFO thì dùng <code>deque</code>.</div>`,
  ]]);

const c2q = quiz('csd204-quiz-2', 'Quiz 2 — Linear structures|||Quiz 2 — Cấu trúc tuyến tính', [
  { id: 'q1', question: 'Ngăn xếp (stack) hoạt động theo nguyên tắc?', options: ['FIFO — vào trước ra trước', 'LIFO — vào sau ra trước', 'Ngẫu nhiên', 'Theo độ ưu tiên'], correctIndex: 1, explanation: 'Stack là LIFO: phần tử vào sau cùng được lấy ra trước.' },
  { id: 'q2', question: 'Vì sao nên dùng deque thay vì list cho hàng đợi?', options: ['deque chiếm ít bộ nhớ hơn', 'list.pop(0) là O(n) còn deque.popleft() là O(1)', 'list không có pop', 'deque tự sắp xếp'], correctIndex: 1, explanation: 'pop(0) của list phải dời mọi phần tử (O(n)); deque popleft là O(1).' },
  { id: 'q3', question: 'Truy cập ngẫu nhiên phần tử thứ i của danh sách liên kết tốn?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctIndex: 2, explanation: 'Phải đi lần theo con trỏ từ đầu nên là O(n).' },
]);

const c3 = doc('csd204-3-1-recursion', '3.1 — Recursion|||3.1 — Đệ quy',
  'Đệ quy: trường hợp cơ sở (base case) + bước đệ quy; call stack; ví dụ giai thừa/Fibonacci; so sánh đệ quy và vòng lặp.',
  [[
    `<span class="eyebrow">CSD204 · Chapter 3 · Lesson 3.1</span>
<h2>Recursion</h2>
<h3>Every recursion has two parts</h3>
<ul>
<li><strong>Base case</strong> — the smallest input, solved directly, with NO further call. Miss it and you get infinite recursion (a stack overflow).</li>
<li><strong>Recursive case</strong> — solve a smaller sub-problem, then combine.</li>
</ul>
<pre><code>def factorial(n):           # time O(n), space O(n) call stack
    if n <= 1:              # base case
        return 1
    return n * factorial(n - 1)   # recursive case

def fib(n):                 # naive: time O(2^n) — VERY slow
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
</code></pre>
<h3>Recursion vs iteration</h3>
<p>Anything recursive can be written as a loop and vice-versa. Recursion is clearer for tree/graph and divide-and-conquer problems, but each call costs a stack frame — <strong>O(depth)</strong> extra memory, and Python caps depth near 1000.</p>
<div class="callout"><span class="badge">Watch the cost</span> Naive <code>fib</code> is O(2^n) because it recomputes the same values. Chapter 8 fixes exactly this with dynamic programming — the same code becomes O(n).</div>`,
    `<span class="eyebrow">CSD204 · Chương 3 · Bài 3.1</span>
<h2>Đệ quy</h2>
<h3>Mọi đệ quy có hai phần</h3>
<ul>
<li><strong>Trường hợp cơ sở (base case)</strong> — dữ liệu nhỏ nhất, giải trực tiếp, KHÔNG gọi tiếp. Thiếu nó là đệ quy vô hạn (tràn ngăn xếp).</li>
<li><strong>Bước đệ quy</strong> — giải một bài con nhỏ hơn rồi ghép lại.</li>
</ul>
<pre><code>def factorial(n):           # thời gian O(n), bộ nhớ O(n) call stack
    if n <= 1:              # trường hợp cơ sở
        return 1
    return n * factorial(n - 1)   # bước đệ quy

def fib(n):                 # ngây thơ: thời gian O(2^n) — RẤT chậm
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
</code></pre>
<h3>Đệ quy vs vòng lặp</h3>
<p>Cái gì đệ quy được cũng viết được bằng vòng lặp và ngược lại. Đệ quy rõ ràng hơn cho bài toán cây/đồ thị và chia để trị, nhưng mỗi lời gọi tốn một khung ngăn xếp — thêm <strong>O(độ sâu)</strong> bộ nhớ, và Python chặn độ sâu quanh 1000.</p>
<div class="callout"><span class="badge">Coi chừng chi phí</span> <code>fib</code> ngây thơ là O(2^n) vì tính lại cùng một giá trị. Chương 8 chữa đúng chỗ này bằng quy hoạch động — cùng đoạn code trở thành O(n).</div>`,
  ]]);

const c3q = quiz('csd204-quiz-3', 'Quiz 3 — Recursion|||Quiz 3 — Đệ quy', [
  { id: 'q1', question: 'Thiếu trường hợp cơ sở (base case) trong đệ quy dẫn tới?', options: ['Kết quả sai một đơn vị', 'Đệ quy vô hạn, tràn ngăn xếp', 'Chạy chậm nhưng vẫn đúng', 'Không biên dịch được'], correctIndex: 1, explanation: 'Không có base case thì hàm gọi mãi không dừng, gây stack overflow.' },
  { id: 'q2', question: 'Vì sao fib(n) đệ quy ngây thơ chậm?', options: ['Vì dùng quá nhiều bộ nhớ', 'Vì tính lại cùng các giá trị con, O(2^n)', 'Vì Python chậm', 'Vì thiếu base case'], correctIndex: 1, explanation: 'Nó tính lại các bài con trùng nhau, dẫn tới O(2^n).' },
  { id: 'q3', question: 'Chi phí bộ nhớ thêm của đệ quy chủ yếu đến từ?', options: ['Bảng băm', 'Khung ngăn xếp mỗi lời gọi (O độ sâu)', 'Con trỏ danh sách liên kết', 'Việc sắp xếp'], correctIndex: 1, explanation: 'Mỗi lời gọi lồng nhau chiếm một stack frame nên tốn O(độ sâu).' },
]);

const c4 = doc('csd204-4-1-sorting', '4.1 — Sorting algorithms|||4.1 — Các giải thuật sắp xếp',
  'Bubble/selection/insertion (O(n^2)), merge sort và quick sort và heap sort (O(n log n)); tính ổn định; so sánh Big-O.',
  [[
    `<span class="eyebrow">CSD204 · Chapter 4 · Lesson 4.1</span>
<h2>Sorting algorithms</h2>
<h3>The comparison table</h3>
<pre><code>Algorithm    Best        Average     Worst       Stable?
bubble       O(n)        O(n^2)      O(n^2)      yes
selection    O(n^2)      O(n^2)      O(n^2)      no
insertion    O(n)        O(n^2)      O(n^2)      yes
merge sort   O(n log n)  O(n log n)  O(n log n)  yes
quick sort   O(n log n)  O(n log n)  O(n^2)      no
heap sort    O(n log n)  O(n log n)  O(n log n)  no
</code></pre>
<p>The three simple sorts are O(n^2) — fine for tiny or nearly-sorted data. For real workloads use an O(n log n) sort.</p>
<h3>Merge sort — divide and conquer</h3>
<pre><code>def merge_sort(a):              # time O(n log n), space O(n)
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]
</code></pre>
<div class="callout"><span class="badge">Stability matters</span> A stable sort keeps equal keys in their original order — essential when you sort by one field after another. Python built-in <code>sorted()</code> (Timsort) is stable and O(n log n).</div>`,
    `<span class="eyebrow">CSD204 · Chương 4 · Bài 4.1</span>
<h2>Các giải thuật sắp xếp</h2>
<h3>Bảng so sánh</h3>
<pre><code>Giải thuật   Tốt nhất    Trung bình  Xấu nhất    Ổn định?
bubble       O(n)        O(n^2)      O(n^2)      có
selection    O(n^2)      O(n^2)      O(n^2)      không
insertion    O(n)        O(n^2)      O(n^2)      có
merge sort   O(n log n)  O(n log n)  O(n log n)  có
quick sort   O(n log n)  O(n log n)  O(n^2)      không
heap sort    O(n log n)  O(n log n)  O(n log n)  không
</code></pre>
<p>Ba sort đơn giản là O(n^2) — chỉ ổn với dữ liệu nhỏ hoặc gần như đã sắp. Với dữ liệu thật, dùng sort O(n log n).</p>
<h3>Merge sort — chia để trị</h3>
<pre><code>def merge_sort(a):              # thời gian O(n log n), bộ nhớ O(n)
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i]); i += 1
        else:
            out.append(right[j]); j += 1
    return out + left[i:] + right[j:]
</code></pre>
<div class="callout"><span class="badge">Ổn định quan trọng</span> Sort ổn định giữ nguyên thứ tự các khoá bằng nhau — thiết yếu khi sắp theo lần lượt nhiều trường. Hàm <code>sorted()</code> của Python (Timsort) ổn định và O(n log n).</div>`,
  ]]);

const c4q = quiz('csd204-quiz-4', 'Quiz 4 — Sorting|||Quiz 4 — Sắp xếp', [
  { id: 'q1', question: 'Độ phức tạp trung bình của merge sort là?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'], correctIndex: 1, explanation: 'Merge sort chia đôi (log n mức) và ghép O(n) mỗi mức nên O(n log n).' },
  { id: 'q2', question: 'Quick sort ở trường hợp XẤU NHẤT có độ phức tạp?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctIndex: 2, explanation: 'Khi chọn pivot tệ (mảng đã sắp), quick sort suy biến thành O(n^2).' },
  { id: 'q3', question: 'Sort "ổn định" (stable) nghĩa là?', options: ['Không bao giờ lỗi', 'Giữ nguyên thứ tự các phần tử có khoá bằng nhau', 'Luôn nhanh nhất', 'Không tốn bộ nhớ thêm'], correctIndex: 1, explanation: 'Stable giữ thứ tự tương đối của các phần tử có khoá bằng nhau.' },
]);

const c5 = doc('csd204-5-1-search-hash', '5.1 — Searching & hash tables|||5.1 — Tìm kiếm & bảng băm',
  'Tìm kiếm tuyến tính (O(n)) và nhị phân (O(log n)); bảng băm (dict): tra/chèn trung bình O(1); hàm băm và xử lý va chạm (chaining/open addressing).',
  [[
    `<span class="eyebrow">CSD204 · Chapter 5 · Lesson 5.1</span>
<h2>Searching &amp; hash tables</h2>
<h3>Linear vs binary search</h3>
<ul>
<li><strong>Linear search</strong> — check every element: <strong>O(n)</strong>. Works on any list.</li>
<li><strong>Binary search</strong> — halve the range each step: <strong>O(log n)</strong>. Requires a <em>sorted</em> list.</li>
</ul>
<pre><code>def binary_search(a, target):   # a is sorted; time O(log n)
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
</code></pre>
<h3>Hash tables (Python dict / set)</h3>
<p>A <strong>hash function</strong> maps a key to a bucket index, giving <strong>average O(1)</strong> insert, lookup and delete. Two keys landing in the same bucket is a <strong>collision</strong>, resolved by <em>chaining</em> (a list per bucket) or <em>open addressing</em> (probe the next slot). Worst case is O(n) if everything collides.</p>
<pre><code>seen = {}                       # dict: average O(1) per op
seen["apple"] = 3
"apple" in seen                 # -> True  (O(1))
</code></pre>
<div class="callout"><span class="badge">When to hash</span> Need fast membership or key-value lookup? Use a set/dict — O(1) average beats sorting + binary search whenever you do many lookups.</div>`,
    `<span class="eyebrow">CSD204 · Chương 5 · Bài 5.1</span>
<h2>Tìm kiếm &amp; bảng băm</h2>
<h3>Tìm tuyến tính vs nhị phân</h3>
<ul>
<li><strong>Tìm tuyến tính</strong> — duyệt từng phần tử: <strong>O(n)</strong>. Dùng cho danh sách bất kỳ.</li>
<li><strong>Tìm nhị phân</strong> — cắt đôi khoảng mỗi bước: <strong>O(log n)</strong>. Cần danh sách <em>đã sắp</em>.</li>
</ul>
<pre><code>def binary_search(a, target):   # a đã sắp; thời gian O(log n)
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
</code></pre>
<h3>Bảng băm (dict / set của Python)</h3>
<p>Một <strong>hàm băm</strong> ánh xạ khoá thành chỉ số ô, cho chèn/tra/xoá <strong>trung bình O(1)</strong>. Hai khoá rơi vào cùng một ô là <strong>va chạm (collision)</strong>, xử lý bằng <em>chaining</em> (mỗi ô một danh sách) hoặc <em>open addressing</em> (dò ô kế). Xấu nhất là O(n) nếu mọi thứ đều va chạm.</p>
<pre><code>seen = {}                       # dict: trung bình O(1) mỗi thao tác
seen["apple"] = 3
"apple" in seen                 # -> True  (O(1))
</code></pre>
<div class="callout"><span class="badge">Khi nào dùng băm</span> Cần kiểm tra tồn tại hoặc tra khoá-giá trị nhanh? Dùng set/dict — trung bình O(1) thắng cả sắp xếp cộng tìm nhị phân khi bạn tra nhiều lần.</div>`,
  ]]);

const c5q = quiz('csd204-quiz-5', 'Quiz 5 — Search & hashing|||Quiz 5 — Tìm kiếm & băm', [
  { id: 'q1', question: 'Điều kiện BẮT BUỘC để dùng tìm kiếm nhị phân?', options: ['Danh sách phải rỗng', 'Danh sách phải đã được sắp xếp', 'Danh sách phải chứa số', 'Danh sách phải là dict'], correctIndex: 1, explanation: 'Tìm nhị phân chỉ đúng khi danh sách đã sắp xếp.' },
  { id: 'q2', question: 'Tra cứu khoá trong dict Python trung bình tốn?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 0, explanation: 'Bảng băm cho tra cứu trung bình O(1).' },
  { id: 'q3', question: 'Hai khoá băm vào cùng một ô gọi là gì?', options: ['Đệ quy', 'Va chạm (collision)', 'Cân bằng', 'Chồng ngăn xếp'], correctIndex: 1, explanation: 'Đó là va chạm, xử lý bằng chaining hoặc open addressing.' },
]);

const c6 = doc('csd204-6-1-trees', '6.1 — Trees, BST, AVL & heaps|||6.1 — Cây, BST, AVL & heap',
  'Cây nhị phân, cây tìm kiếm nhị phân (BST), duyệt cây (inorder/preorder/postorder/BFS), cân bằng AVL, heap và hàng đợi ưu tiên (heapq); Big-O từng thao tác.',
  [[
    `<span class="eyebrow">CSD204 · Chapter 6 · Lesson 6.1</span>
<h2>Trees, BST, AVL &amp; heaps</h2>
<h3>Binary search tree (BST)</h3>
<p>Each node has up to two children; the <strong>left</strong> subtree holds smaller keys, the <strong>right</strong> holds larger. Search/insert/delete are <strong>O(h)</strong> where h is the height — <strong>O(log n)</strong> when balanced, but <strong>O(n)</strong> if the tree degenerates into a chain.</p>
<h3>Traversals</h3>
<ul>
<li><strong>Inorder</strong> (left, node, right) — visits a BST in <em>sorted</em> order.</li>
<li><strong>Preorder</strong> / <strong>Postorder</strong> — node first / node last.</li>
<li><strong>BFS / level-order</strong> — level by level, using a queue.</li>
</ul>
<pre><code>class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

def insert(root, key):          # O(h): O(log n) balanced, O(n) worst
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root
</code></pre>
<h3>Balancing &amp; heaps</h3>
<p>An <strong>AVL tree</strong> rotates on insert/delete to keep height O(log n), guaranteeing O(log n) operations. A <strong>heap</strong> is a complete tree where each parent beats its children; a <strong>priority queue</strong> built on <code>heapq</code> gives push/pop in <strong>O(log n)</strong> and peek-min in O(1).</p>
<pre><code>import heapq
pq = []
heapq.heappush(pq, 5)           # O(log n)
heapq.heappush(pq, 1)
heapq.heappop(pq)               # -> 1  (smallest, O(log n))
</code></pre>
<div class="callout"><span class="badge">Why balance</span> An unbalanced BST is just a linked list in disguise — O(n) per op. AVL (or red-black) trees pay a little rotation cost to keep every operation O(log n).</div>`,
    `<span class="eyebrow">CSD204 · Chương 6 · Bài 6.1</span>
<h2>Cây, BST, AVL &amp; heap</h2>
<h3>Cây tìm kiếm nhị phân (BST)</h3>
<p>Mỗi nút có tối đa hai con; cây con <strong>trái</strong> giữ khoá nhỏ hơn, <strong>phải</strong> giữ khoá lớn hơn. Tìm/chèn/xoá là <strong>O(h)</strong> với h là chiều cao — <strong>O(log n)</strong> khi cân bằng, nhưng <strong>O(n)</strong> nếu cây suy biến thành chuỗi.</p>
<h3>Duyệt cây</h3>
<ul>
<li><strong>Inorder</strong> (trái, nút, phải) — duyệt BST theo thứ tự <em>đã sắp</em>.</li>
<li><strong>Preorder</strong> / <strong>Postorder</strong> — nút trước / nút sau.</li>
<li><strong>BFS / theo mức</strong> — từng mức một, dùng hàng đợi.</li>
</ul>
<pre><code>class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

def insert(root, key):          # O(h): O(log n) cân bằng, O(n) xấu nhất
    if root is None:
        return Node(key)
    if key < root.key:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root
</code></pre>
<h3>Cân bằng &amp; heap</h3>
<p>Cây <strong>AVL</strong> xoay khi chèn/xoá để giữ chiều cao O(log n), bảo đảm mọi thao tác O(log n). <strong>Heap</strong> là cây đầy đủ mà mỗi cha vượt các con; <strong>hàng đợi ưu tiên</strong> dựng trên <code>heapq</code> cho push/pop <strong>O(log n)</strong> và xem phần tử nhỏ nhất O(1).</p>
<pre><code>import heapq
pq = []
heapq.heappush(pq, 5)           # O(log n)
heapq.heappush(pq, 1)
heapq.heappop(pq)               # -> 1  (nhỏ nhất, O(log n))
</code></pre>
<div class="callout"><span class="badge">Vì sao cần cân bằng</span> BST mất cân bằng chỉ là danh sách liên kết trá hình — O(n) mỗi thao tác. Cây AVL (hoặc đỏ-đen) trả một chút chi phí xoay để giữ mọi thao tác O(log n).</div>`,
  ]]);

const c6q = quiz('csd204-quiz-6', 'Quiz 6 — Trees & heaps|||Quiz 6 — Cây & heap', [
  { id: 'q1', question: 'Duyệt inorder một BST cho ra dãy khoá theo?', options: ['Thứ tự ngẫu nhiên', 'Thứ tự đã sắp tăng dần', 'Thứ tự chèn', 'Thứ tự giảm dần luôn'], correctIndex: 1, explanation: 'Inorder (trái, nút, phải) của BST cho dãy khoá tăng dần.' },
  { id: 'q2', question: 'Thao tác tìm kiếm trên BST CÂN BẰNG tốn?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 1, explanation: 'Cây cân bằng có chiều cao O(log n) nên tìm kiếm là O(log n).' },
  { id: 'q3', question: 'Hàng đợi ưu tiên dựng bằng heapq có push/pop tốn?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctIndex: 1, explanation: 'Heap giữ tính chất qua sift up/down nên push và pop là O(log n).' },
]);

const c7 = doc('csd204-7-1-graphs', '7.1 — Graphs: BFS, DFS, Dijkstra & MST|||7.1 — Đồ thị: BFS, DFS, Dijkstra & MST',
  'Biểu diễn đồ thị (danh sách kề vs ma trận kề), duyệt BFS và DFS (O(V+E)), đường đi ngắn nhất Dijkstra, cây khung nhỏ nhất (MST: Kruskal/Prim).',
  [[
    `<span class="eyebrow">CSD204 · Chapter 7 · Lesson 7.1</span>
<h2>Graphs: BFS, DFS, Dijkstra &amp; MST</h2>
<h3>Representation</h3>
<ul>
<li><strong>Adjacency list</strong> — a dict of node to its neighbours. Space O(V + E). Best for sparse graphs.</li>
<li><strong>Adjacency matrix</strong> — a V x V table. Space O(V^2). Edge lookup O(1) but wasteful when sparse.</li>
</ul>
<h3>Traversals — both O(V + E)</h3>
<ul>
<li><strong>BFS</strong> — a queue; visits nearest first; finds shortest path in an <em>unweighted</em> graph.</li>
<li><strong>DFS</strong> — a stack/recursion; goes deep first; used for cycles, topological sort, components.</li>
</ul>
<pre><code>from collections import deque
def bfs(graph, start):          # O(V + E)
    seen = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in seen:
                seen.add(nb)
                q.append(nb)
    return order
</code></pre>
<h3>Weighted graphs</h3>
<p><strong>Dijkstra</strong> finds shortest paths from a source with non-negative weights using a min-heap: <strong>O((V + E) log V)</strong>. A <strong>minimum spanning tree (MST)</strong> connects all nodes at least total cost — <strong>Kruskal</strong> (sort edges + union-find) or <strong>Prim</strong> (grow from a node with a heap).</p>
<div class="callout"><span class="badge">Pick the tool</span> Unweighted shortest path? BFS. Non-negative weights? Dijkstra. Cheapest way to connect everything? An MST. Matching the algorithm to the question is the whole skill.</div>`,
    `<span class="eyebrow">CSD204 · Chương 7 · Bài 7.1</span>
<h2>Đồ thị: BFS, DFS, Dijkstra &amp; MST</h2>
<h3>Biểu diễn</h3>
<ul>
<li><strong>Danh sách kề</strong> — dict từ nút tới các nút kề. Bộ nhớ O(V + E). Tốt cho đồ thị thưa.</li>
<li><strong>Ma trận kề</strong> — bảng V x V. Bộ nhớ O(V^2). Tra cạnh O(1) nhưng lãng phí khi thưa.</li>
</ul>
<h3>Duyệt — đều O(V + E)</h3>
<ul>
<li><strong>BFS</strong> — dùng hàng đợi; thăm nút gần trước; tìm đường ngắn nhất trong đồ thị <em>không trọng số</em>.</li>
<li><strong>DFS</strong> — dùng ngăn xếp/đệ quy; đi sâu trước; dùng để tìm chu trình, sắp thứ tự tô-pô, thành phần liên thông.</li>
</ul>
<pre><code>from collections import deque
def bfs(graph, start):          # O(V + E)
    seen = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nb in graph[node]:
            if nb not in seen:
                seen.add(nb)
                q.append(nb)
    return order
</code></pre>
<h3>Đồ thị có trọng số</h3>
<p><strong>Dijkstra</strong> tìm đường ngắn nhất từ một nguồn với trọng số không âm nhờ min-heap: <strong>O((V + E) log V)</strong>. <strong>Cây khung nhỏ nhất (MST)</strong> nối mọi nút với tổng chi phí nhỏ nhất — <strong>Kruskal</strong> (sắp cạnh + union-find) hoặc <strong>Prim</strong> (mọc từ một nút bằng heap).</p>
<div class="callout"><span class="badge">Chọn đúng công cụ</span> Đường ngắn nhất không trọng số? BFS. Trọng số không âm? Dijkstra. Nối mọi thứ rẻ nhất? MST. Ghép đúng giải thuật với câu hỏi mới là kỹ năng.</div>`,
  ]]);

const c7q = quiz('csd204-quiz-7', 'Quiz 7 — Graphs|||Quiz 7 — Đồ thị', [
  { id: 'q1', question: 'Độ phức tạp của BFS/DFS trên đồ thị (danh sách kề) là?', options: ['O(V)', 'O(V + E)', 'O(V^2)', 'O(E log V)'], correctIndex: 1, explanation: 'Mỗi đỉnh và mỗi cạnh được xét một lần nên O(V + E).' },
  { id: 'q2', question: 'Giải thuật nào tìm đường đi ngắn nhất với trọng số KHÔNG ÂM?', options: ['BFS thuần', 'Dijkstra', 'Bubble sort', 'Duyệt inorder'], correctIndex: 1, explanation: 'Dijkstra dùng min-heap tìm đường ngắn nhất khi trọng số không âm.' },
  { id: 'q3', question: 'Cây khung nhỏ nhất (MST) dựng bằng giải thuật nào?', options: ['Kruskal hoặc Prim', 'Binary search', 'Merge sort', 'Quy hoạch động'], correctIndex: 0, explanation: 'Kruskal (union-find) và Prim (heap) đều dựng MST.' },
]);

const c8 = doc('csd204-8-1-dp-greedy', '8.1 — Dynamic programming & greedy|||8.1 — Quy hoạch động & tham lam',
  'Quy hoạch động (DP): bài con gối nhau + cấu trúc con tối ưu, memoization vs tabulation; tham lam (greedy) và khi nào đúng; ví dụ kinh điển (đổi tiền, cái túi, LCS).',
  [[
    `<span class="eyebrow">CSD204 · Chapter 8 · Lesson 8.1</span>
<h2>Dynamic programming &amp; greedy</h2>
<h3>Dynamic programming (DP)</h3>
<p>DP applies when a problem has <strong>overlapping sub-problems</strong> (the same sub-answer is needed many times) and <strong>optimal substructure</strong> (the best whole is built from best parts). Two styles:</p>
<ul>
<li><strong>Memoization</strong> (top-down) — recursion plus a cache.</li>
<li><strong>Tabulation</strong> (bottom-up) — fill a table from small to large.</li>
</ul>
<pre><code>def fib(n):                     # DP: time O(n), space O(n)
    memo = {0: 0, 1: 1}
    for i in range(2, n + 1):
        memo[i] = memo[i - 1] + memo[i - 2]
    return memo[n]
</code></pre>
<p>The O(2^n) recursive <code>fib</code> from Chapter 3 becomes <strong>O(n)</strong> — the headline win of DP. Classic DP problems: coin change, 0/1 knapsack, longest common subsequence (LCS), edit distance.</p>
<h3>Greedy</h3>
<p>A <strong>greedy</strong> algorithm makes the locally best choice at each step and never looks back — fast (often O(n log n)) and simple. It is correct only when a <em>greedy-choice property</em> holds (e.g. activity selection, Huffman coding, Dijkstra). When it does not, you need DP.</p>
<div class="callout"><span class="badge">Greedy vs DP</span> Coin change with arbitrary coins is NOT solvable greedily — grabbing the biggest coin can miss the optimum. DP explores all combinations and always finds the fewest coins.</div>`,
    `<span class="eyebrow">CSD204 · Chương 8 · Bài 8.1</span>
<h2>Quy hoạch động &amp; tham lam</h2>
<h3>Quy hoạch động (DP)</h3>
<p>DP dùng được khi bài toán có <strong>bài con gối nhau</strong> (cùng một bài con cần tính nhiều lần) và <strong>cấu trúc con tối ưu</strong> (lời giải tốt nhất ghép từ các phần tốt nhất). Hai kiểu:</p>
<ul>
<li><strong>Memoization</strong> (trên xuống) — đệ quy cộng bộ nhớ đệm.</li>
<li><strong>Tabulation</strong> (dưới lên) — điền bảng từ nhỏ đến lớn.</li>
</ul>
<pre><code>def fib(n):                     # DP: thời gian O(n), bộ nhớ O(n)
    memo = {0: 0, 1: 1}
    for i in range(2, n + 1):
        memo[i] = memo[i - 1] + memo[i - 2]
    return memo[n]
</code></pre>
<p><code>fib</code> đệ quy O(2^n) ở chương 3 trở thành <strong>O(n)</strong> — thắng lợi tiêu biểu của DP. Các bài DP kinh điển: đổi tiền, cái túi 0/1, dãy con chung dài nhất (LCS), khoảng cách chỉnh sửa.</p>
<h3>Tham lam (greedy)</h3>
<p>Giải thuật <strong>tham lam</strong> chọn phương án tốt nhất tại chỗ ở mỗi bước và không quay lại — nhanh (thường O(n log n)) và đơn giản. Nó chỉ đúng khi có <em>tính chất chọn tham lam</em> (vd chọn hoạt động, mã Huffman, Dijkstra). Khi không có, phải dùng DP.</p>
<div class="callout"><span class="badge">Tham lam vs DP</span> Đổi tiền với bộ mệnh giá tuỳ ý KHÔNG giải được bằng tham lam — vơ đồng lớn nhất có thể trượt lời giải tối ưu. DP xét mọi tổ hợp và luôn tìm ra số đồng ít nhất.</div>`,
  ]]);

const c8q = quiz('csd204-quiz-8', 'Quiz 8 — DP & greedy|||Quiz 8 — QHĐ & tham lam', [
  { id: 'q1', question: 'Quy hoạch động (DP) áp dụng khi bài toán có?', options: ['Bài con gối nhau và cấu trúc con tối ưu', 'Chỉ một lời giải duy nhất', 'Không có đệ quy', 'Dữ liệu đã sắp'], correctIndex: 0, explanation: 'DP cần bài con gối nhau (overlapping) và cấu trúc con tối ưu.' },
  { id: 'q2', question: 'Dùng DP, fib(n) giảm từ O(2^n) xuống?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctIndex: 2, explanation: 'Lưu lại kết quả bài con nên chỉ tính mỗi giá trị một lần: O(n).' },
  { id: 'q3', question: 'Điểm khác biệt của giải thuật tham lam so với DP?', options: ['Luôn cho lời giải tối ưu', 'Chọn tốt nhất tại chỗ mỗi bước, không quay lại', 'Luôn chậm hơn DP', 'Cần bảng băm'], correctIndex: 1, explanation: 'Greedy chọn cục bộ tốt nhất và không quay lại; chỉ đúng khi có tính chất chọn tham lam.' },
]);

const taiLieu = doc('csd204-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Goodrich, CLRS), tài liệu Python chính thức, VisuAlgo/LeetCode, YouTube, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">CSD204 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Data Structures &amp; Algorithms in Python — complexity, linear structures, trees, graphs, DP &amp; greedy — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for CSD204 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Data+Structures+and+Algorithms+in+Python-p-9781118290279" target="_blank" rel="noopener">Goodrich, Tamassia &amp; Goldwasser — <em>Data Structures and Algorithms in Python</em></a> (the course textbook)</li>
<li><a href="https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" target="_blank" rel="noopener">Cormen et al. — <em>Introduction to Algorithms</em> (CLRS)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/datastructures.html" target="_blank" rel="noopener">Python docs — Data Structures</a></li>
<li><a href="https://wiki.python.org/moin/TimeComplexity" target="_blank" rel="noopener">Python wiki — Time Complexity of built-in types</a></li>
</ul>
<h3>▶️ YouTube &amp; practice</h3>
<ul>
<li><a href="https://visualgo.net/en" target="_blank" rel="noopener">VisuAlgo</a> — animated visualizations of every structure &amp; algorithm</li>
<li><a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode</a> — practice problems by topic &amp; difficulty</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://pythontutor.com/" target="_blank" rel="noopener">Python Tutor</a> — step through code &amp; watch the call stack</li>
<li><a href="https://www.bigocheatsheet.com/" target="_blank" rel="noopener">Big-O Cheat Sheet</a> — complexity of common operations</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — Big-O, arrays/lists, stacks &amp; queues, recursion.</li>
<li><strong>Practice</strong> — implement each structure in Python and check its cost on VisuAlgo.</li>
<li><strong>Go deeper</strong> — sorting, searching &amp; hashing, trees &amp; heaps, graphs.</li>
<li><strong>Job-ready</strong> — solve LeetCode problems and explain your Big-O in interviews.</li>
</ol></div>`,
    `<span class="eyebrow">CSD204 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Cấu trúc dữ liệu &amp; giải thuật với Python — độ phức tạp, cấu trúc tuyến tính, cây, đồ thị, DP &amp; tham lam — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CSD204 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.wiley.com/en-us/Data+Structures+and+Algorithms+in+Python-p-9781118290279" target="_blank" rel="noopener">Goodrich, Tamassia &amp; Goldwasser — <em>Data Structures and Algorithms in Python</em></a> (giáo trình chính của môn)</li>
<li><a href="https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" target="_blank" rel="noopener">Cormen và cộng sự — <em>Introduction to Algorithms</em> (CLRS)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/datastructures.html" target="_blank" rel="noopener">Python docs — Data Structures</a></li>
<li><a href="https://wiki.python.org/moin/TimeComplexity" target="_blank" rel="noopener">Python wiki — Độ phức tạp thời gian của kiểu dựng sẵn</a></li>
</ul>
<h3>▶️ YouTube &amp; luyện tập</h3>
<ul>
<li><a href="https://visualgo.net/en" target="_blank" rel="noopener">VisuAlgo</a> — mô phỏng động mọi cấu trúc &amp; giải thuật</li>
<li><a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode</a> — bài luyện theo chủ đề &amp; độ khó</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://pythontutor.com/" target="_blank" rel="noopener">Python Tutor</a> — chạy từng dòng &amp; xem call stack</li>
<li><a href="https://www.bigocheatsheet.com/" target="_blank" rel="noopener">Big-O Cheat Sheet</a> — độ phức tạp các thao tác thường gặp</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — Big-O, mảng/danh sách, ngăn xếp &amp; hàng đợi, đệ quy.</li>
<li><strong>Luyện tập</strong> — tự cài mỗi cấu trúc bằng Python và đối chiếu chi phí trên VisuAlgo.</li>
<li><strong>Đào sâu</strong> — sắp xếp, tìm kiếm &amp; băm, cây &amp; heap, đồ thị.</li>
<li><strong>Sẵn sàng đi làm</strong> — giải bài LeetCode và giải thích Big-O khi phỏng vấn.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CSD204',
    slug: 'csd204-data-structures-and-algorithm-with-python',
    title: 'Data Structures and Algorithm with Python',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSD204.webp',
    shortDescription: 'Data structures & algorithms in Python — Big-O/Omega/Theta, arrays, linked lists, stacks, queues, recursion, sorting, searching & hashing, trees & heaps, graphs (BFS/DFS/Dijkstra), dynamic programming & greedy. Bilingual, with Python code & quizzes.|||Cấu trúc dữ liệu & giải thuật với Python — Big-O, mảng, danh sách liên kết, ngăn xếp, hàng đợi, đệ quy, sắp xếp, tìm kiếm & băm, cây & heap, đồ thị (BFS/DFS/Dijkstra), quy hoạch động & tham lam. Song ngữ, có code Python & quiz.',
    description: 'Môn <strong>CSD204 — Data Structures and Algorithms with Python</strong> (kỳ 3, ngành Khoa học Máy tính) dạy cách <strong>tổ chức dữ liệu</strong> và <strong>thiết kế giải thuật hiệu quả</strong>. Từ <strong>phân tích độ phức tạp</strong> (Big-O/Omega/Theta) → <strong>cấu trúc tuyến tính</strong> (mảng, danh sách liên kết, ngăn xếp, hàng đợi) → <strong>đệ quy</strong> → <strong>sắp xếp</strong> → <strong>tìm kiếm &amp; băm</strong> → <strong>cây, BST, AVL &amp; heap</strong> → <strong>đồ thị</strong> (BFS/DFS/Dijkstra/MST) → <strong>quy hoạch động &amp; tham lam</strong>. Bám sách chuẩn (Goodrich, CLRS), song ngữ, nhấn Big-O từng cấu trúc, có code Python và quiz mỗi chương.',
    whatYouLearn: 'Phân tích Big-O/Omega/Theta, thời gian &amp; không gian; Python list, danh sách liên kết, ngăn xếp/hàng đợi (deque); đệ quy &amp; call stack; sắp xếp (bubble/selection/insertion/merge/quick/heap); tìm tuyến tính/nhị phân; bảng băm &amp; va chạm; cây nhị phân, BST, duyệt cây, AVL, heap/priority queue; đồ thị (danh sách/ma trận kề), BFS/DFS, Dijkstra, MST; quy hoạch động (memoization/tabulation) &amp; tham lam.',
    requirements: 'Đã học lập trình cơ bản với Python (biến, vòng lặp, hàm, list). Toán rời rạc cơ bản là lợi thế.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, Python docs, VisuAlgo/LeetCode, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'CTDL & giải thuật là gì, vì sao Big-O quan trọng, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Phân tích độ phức tạp|||Chapter 1 — Complexity analysis', description: 'Big-O/Omega/Theta, các lớp tăng, thời gian & không gian.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấu trúc tuyến tính|||Chapter 2 — Linear structures', description: 'Mảng, danh sách liên kết, ngăn xếp, hàng đợi, deque.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đệ quy|||Chapter 3 — Recursion', description: 'Base case, call stack, đệ quy vs vòng lặp.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Sắp xếp|||Chapter 4 — Sorting', description: 'Bubble/selection/insertion, merge/quick/heap, so Big-O.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Tìm kiếm & băm|||Chapter 5 — Searching & hashing', description: 'Tìm tuyến tính/nhị phân, bảng băm, va chạm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Cây & heap|||Chapter 6 — Trees & heaps', description: 'Cây nhị phân, BST, duyệt, AVL, heap/priority queue.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Đồ thị|||Chapter 7 — Graphs', description: 'Biểu diễn, BFS/DFS, Dijkstra, MST.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy hoạch động & tham lam|||Chapter 8 — DP & greedy', description: 'DP (memoization/tabulation), tham lam, ví dụ kinh điển.', lessons: [c8, c8q] },
  ],
};
