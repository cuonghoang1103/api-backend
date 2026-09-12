/**
 * CSD203 — Data Structures and Algorithm with Python. Giáo trình FLM. Song song
 * CSD202 nhưng bằng Python. Không slide gốc → soạn từ syllabus + kiến thức, song
 * ngữ, code Python thật, kèm BÀI TẬP. Giữ NGUYÊN slug. ⚠️ code: KHÔNG backtick/${ }; "\n" viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('csd203-0-1-overview', 'Course overview: DSA with Python|||Tổng quan môn: CTDL & giải thuật với Python',
  'Mục tiêu, các chủ đề (Big-O, list/linked list, stack/queue, đệ quy, sorting/searching, tree/BST, graph, hashing), lộ trình bằng Python, đánh giá.',
  [[
    `<span class="eyebrow">CSD203 · Lesson 0.1 · Overview</span>
<h2>Data Structures &amp; Algorithms (Python)</h2>
<p class="lead">The core computer-science course, taught in <strong>Python</strong>: how to <strong>store data</strong> (structures) and <strong>process it efficiently</strong> (algorithms), measured with <strong>Big-O</strong>. Python's clean syntax lets you focus on the ideas.</p>
<h3>What you'll master</h3>
<ul>
<li><strong>Big-O</strong> complexity analysis</li>
<li><strong>Lists &amp; linked lists</strong>, <strong>stacks &amp; queues</strong></li>
<li><strong>Recursion</strong></li>
<li><strong>Sorting &amp; searching</strong> algorithms</li>
<li><strong>Trees &amp; binary search trees</strong></li>
<li><strong>Graphs</strong> (BFS/DFS) &amp; <strong>hashing</strong> (dict/set)</li>
</ul>
<p>The right data structure turns a slow program into an instant one — and this is the heart of technical interviews. Python's built-in <code>list</code>, <code>dict</code>, <code>set</code> and <code>collections</code> give you many structures for free; here you'll also build them to understand how they work.</p>`,
    `<span class="eyebrow">CSD203 · Bài 0.1 · Tổng quan</span>
<h2>Cấu trúc dữ liệu &amp; giải thuật (Python)</h2>
<p class="lead">Môn khoa học máy tính lõi, dạy bằng <strong>Python</strong>: cách <strong>lưu dữ liệu</strong> (cấu trúc) và <strong>xử lý hiệu quả</strong> (giải thuật), đo bằng <strong>Big-O</strong>. Cú pháp gọn của Python cho bạn tập trung vào ý tưởng.</p>
<h3>Bạn sẽ thành thạo</h3>
<ul>
<li>Phân tích độ phức tạp <strong>Big-O</strong></li>
<li><strong>List &amp; linked list</strong>, <strong>stack &amp; queue</strong></li>
<li><strong>Đệ quy</strong></li>
<li>Thuật toán <strong>sắp xếp &amp; tìm kiếm</strong></li>
<li><strong>Cây &amp; cây nhị phân tìm kiếm</strong></li>
<li><strong>Đồ thị</strong> (BFS/DFS) &amp; <strong>hashing</strong> (dict/set)</li>
</ul>
<p>Cấu trúc dữ liệu đúng biến chương trình chậm thành tức thời — và là trái tim phỏng vấn kỹ thuật. <code>list</code>, <code>dict</code>, <code>set</code> và <code>collections</code> dựng sẵn của Python cho nhiều cấu trúc miễn phí; ở đây bạn cũng tự dựng để hiểu cách chúng hoạt động.</p>`,
  ]]);

const c1 = doc('csd203-1-1-bigo-list', '1.1 — Big-O & Python lists|||1.1 — Big-O & list Python',
  'Phân tích Big-O (O(1)→O(n²)), và cấu trúc dữ liệu dựng sẵn: list (mảng động), độ phức tạp các thao tác (append/insert/in), tuple/dict/set.',
  [[
    `<span class="eyebrow">CSD203 · Chapter 1 · Lesson 1.1</span>
<h2>Big-O &amp; Python's built-in structures</h2>
<h3>Big-O</h3>
<p><strong>Big-O</strong> measures how run-time grows with input size n, ignoring constants: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²). Always analyze the <strong>worst case</strong>.</p>
<h3>Python list — a dynamic array</h3>
<pre><code class="language-python">a = [5, 2, 9]
a.append(1)        # add at end — O(1) amortized
a[0]               # index access — O(1)
x in a             # membership — O(n) (scans!)
a.insert(0, 7)     # insert at front — O(n) (shifts everything)
</code></pre>
<table><thead><tr><th>Structure</th><th>Access</th><th>Search</th><th>Insert end</th></tr></thead><tbody>
<tr><td>list</td><td>O(1)</td><td>O(n)</td><td>O(1)*</td></tr>
<tr><td>dict / set</td><td>—</td><td>O(1) avg</td><td>O(1) avg</td></tr>
</tbody></table>
<p><strong>Key insight:</strong> <code>x in a_list</code> is O(n), but <code>x in a_set</code> is O(1) average — choose <code>set</code>/<code>dict</code> (hash tables) for fast membership. Knowing these costs is what separates efficient code from slow code.</p>`,
    `<span class="eyebrow">CSD203 · Chương 1 · Bài 1.1</span>
<h2>Big-O &amp; các cấu trúc dựng sẵn của Python</h2>
<h3>Big-O</h3>
<p><strong>Big-O</strong> đo thời gian chạy tăng thế nào theo cỡ n, bỏ hằng số: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²). Luôn phân tích <strong>trường hợp xấu nhất</strong>.</p>
<h3>list Python — mảng động</h3>
<pre><code class="language-python">a = [5, 2, 9]
a.append(1)        # thêm cuối — O(1) amortized
a[0]               # truy cập theo index — O(1)
x in a             # kiểm thành viên — O(n) (quét!)
a.insert(0, 7)     # chèn đầu — O(n) (dịch mọi phần tử)
</code></pre>
<table><thead><tr><th>Cấu trúc</th><th>Truy cập</th><th>Tìm</th><th>Chèn cuối</th></tr></thead><tbody>
<tr><td>list</td><td>O(1)</td><td>O(n)</td><td>O(1)*</td></tr>
<tr><td>dict / set</td><td>—</td><td>O(1) TB</td><td>O(1) TB</td></tr>
</tbody></table>
<p><strong>Ý chính:</strong> <code>x in a_list</code> là O(n), nhưng <code>x in a_set</code> là O(1) trung bình — chọn <code>set</code>/<code>dict</code> (bảng băm) cho kiểm thành viên nhanh. Biết các chi phí này là cái phân biệt code hiệu quả với code chậm.</p>`,
  ]]);

const c1q = quiz('csd203-quiz-1', 'Quiz 1 — Big-O & list|||Quiz 1 — Big-O & list', [
  { id: 'q1', question: '"x in my_list" có độ phức tạp?', options: ['O(1)', 'O(n) — quét cả list', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'list là mảng → tìm tuyến tính O(n); set/dict mới O(1).' },
  { id: 'q2', question: 'Kiểm thành viên NHANH nên dùng?', options: ['list', 'set/dict (O(1) TB)', 'tuple', 'chuỗi'], correctIndex: 1, explanation: 'set/dict dùng hash → tra O(1) trung bình.' },
  { id: 'q3', question: 'list.append(x) trung bình là?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 0, explanation: 'Thêm cuối O(1) amortized; chèn đầu mới O(n).' },
]);

const c2 = doc('csd203-2-1-stack-queue-recursion', '2.1 — Stacks, queues & recursion|||2.1 — Stack, queue & đệ quy',
  'Stack (list append/pop, LIFO) & queue (collections.deque, FIFO) và ứng dụng; đệ quy (base case), ví dụ giai thừa/duyệt; và linked list tự dựng.',
  [[
    `<span class="eyebrow">CSD203 · Chapter 2 · Lesson 2.1</span>
<h2>Stacks, queues &amp; recursion</h2>
<h3>Stack (LIFO) &amp; queue (FIFO)</h3>
<pre><code class="language-python">stack = []
stack.append(1); stack.append(2)   # push
stack.pop()                        # -> 2 (LIFO)

from collections import deque
q = deque()
q.append(1); q.append(2)           # enqueue
q.popleft()                        # -> 1 (FIFO) — O(1)
</code></pre>
<p>Use a <code>list</code> as a stack (append/pop are O(1)); use <code>collections.deque</code> as a queue (<code>popleft</code> is O(1); a plain list's <code>pop(0)</code> is O(n)!). Stacks: undo, bracket matching, DFS. Queues: scheduling, BFS.</p>
<h3>Recursion</h3>
<pre><code class="language-python">def factorial(n):
    if n &lt;= 1:            # base case
        return 1
    return n * factorial(n - 1)   # recursive case
</code></pre>
<p>A recursive function calls itself on a smaller input with a <strong>base case</strong> to stop. Python's default recursion limit is ~1000 — deep recursion needs an iterative version or <code>sys.setrecursionlimit</code>.</p>`,
    `<span class="eyebrow">CSD203 · Chương 2 · Bài 2.1</span>
<h2>Stack, queue &amp; đệ quy</h2>
<h3>Stack (LIFO) &amp; queue (FIFO)</h3>
<pre><code class="language-python">stack = []
stack.append(1); stack.append(2)   # push
stack.pop()                        # -> 2 (LIFO)

from collections import deque
q = deque()
q.append(1); q.append(2)           # enqueue
q.popleft()                        # -> 1 (FIFO) — O(1)
</code></pre>
<p>Dùng <code>list</code> làm stack (append/pop O(1)); dùng <code>collections.deque</code> làm queue (<code>popleft</code> O(1); còn <code>pop(0)</code> của list là O(n)!). Stack: undo, kiểm ngoặc, DFS. Queue: lập lịch, BFS.</p>
<h3>Đệ quy</h3>
<pre><code class="language-python">def factorial(n):
    if n &lt;= 1:            # base case
        return 1
    return n * factorial(n - 1)   # recursive case
</code></pre>
<p>Hàm đệ quy gọi chính nó trên đầu vào nhỏ hơn với một <strong>base case</strong> để dừng. Giới hạn đệ quy mặc định của Python ~1000 — đệ quy sâu cần bản lặp hoặc <code>sys.setrecursionlimit</code>.</p>`,
  ]]);

const c2q = quiz('csd203-quiz-2', 'Quiz 2 — Stack/queue & recursion|||Quiz 2 — Stack/queue & đệ quy', [
  { id: 'q1', question: 'Queue hiệu quả trong Python dùng?', options: ['list.pop(0)', 'collections.deque (popleft O(1))', 'set', 'tuple'], correctIndex: 1, explanation: 'deque.popleft là O(1); list.pop(0) là O(n).' },
  { id: 'q2', question: 'Stack là nguyên tắc?', options: ['FIFO', 'LIFO (list append/pop)', 'Ngẫu nhiên', 'Sắp xếp'], correctIndex: 1, explanation: 'Stack LIFO; queue FIFO.' },
  { id: 'q3', question: 'Đệ quy sâu ở Python có thể gặp?', options: ['Chạy nhanh', 'RecursionError (giới hạn ~1000)', 'O(1)', 'Không lỗi'], correctIndex: 1, explanation: 'Vượt giới hạn đệ quy → RecursionError.' },
]);

const c3 = doc('csd203-3-1-sorting-searching', '3.1 — Sorting & searching|||3.1 — Sắp xếp & tìm kiếm',
  'Sorting (bubble/insertion O(n²), merge/quick O(n log n), Timsort của Python), binary search O(log n) trên list đã sắp; khi nào tự viết vs dùng sorted().',
  [[
    `<span class="eyebrow">CSD203 · Chapter 3 · Lesson 3.1</span>
<h2>Sorting &amp; searching</h2>
<h3>Sorting</h3>
<p>Python's built-in <code>sorted(a)</code> / <code>a.sort()</code> uses <strong>Timsort</strong> — O(n log n), stable, very fast. But you must understand the classics:</p>
<table><thead><tr><th>Algorithm</th><th>Time</th><th>Idea</th></tr></thead><tbody>
<tr><td>Bubble/Insertion</td><td>O(n²)</td><td>simple, small data</td></tr>
<tr><td>Merge sort</td><td>O(n log n)</td><td>split, sort halves, merge</td></tr>
<tr><td>Quick sort</td><td>O(n log n) avg</td><td>partition around a pivot</td></tr>
</tbody></table>
<pre><code class="language-python">def binary_search(a, key):        # a must be sorted
    lo, hi = 0, len(a) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if a[mid] == key: return mid
        if a[mid] &lt; key: lo = mid + 1
        else: hi = mid - 1
    return -1
</code></pre>
<p><strong>Binary search</strong> is O(log n) but requires a <em>sorted</em> list. In practice use <code>sorted()</code> and the <code>bisect</code> module; implement them once to understand the cost trade-offs.</p>`,
    `<span class="eyebrow">CSD203 · Chương 3 · Bài 3.1</span>
<h2>Sắp xếp &amp; tìm kiếm</h2>
<h3>Sắp xếp</h3>
<p><code>sorted(a)</code> / <code>a.sort()</code> dựng sẵn của Python dùng <strong>Timsort</strong> — O(n log n), ổn định, rất nhanh. Nhưng bạn phải hiểu các thuật toán kinh điển:</p>
<table><thead><tr><th>Thuật toán</th><th>Thời gian</th><th>Ý tưởng</th></tr></thead><tbody>
<tr><td>Bubble/Insertion</td><td>O(n²)</td><td>đơn giản, dữ liệu nhỏ</td></tr>
<tr><td>Merge sort</td><td>O(n log n)</td><td>chia, sắp hai nửa, trộn</td></tr>
<tr><td>Quick sort</td><td>O(n log n) TB</td><td>phân hoạch quanh pivot</td></tr>
</tbody></table>
<pre><code class="language-python">def binary_search(a, key):        # a phải đã sắp
    lo, hi = 0, len(a) - 1
    while lo &lt;= hi:
        mid = (lo + hi) // 2
        if a[mid] == key: return mid
        if a[mid] &lt; key: lo = mid + 1
        else: hi = mid - 1
    return -1
</code></pre>
<p><strong>Binary search</strong> là O(log n) nhưng cần list <em>đã sắp</em>. Thực tế dùng <code>sorted()</code> và module <code>bisect</code>; tự hiện thực một lần để hiểu đánh đổi chi phí.</p>`,
  ]]);

const c3q = quiz('csd203-quiz-3', 'Quiz 3 — Sorting & searching|||Quiz 3 — Sắp xếp & tìm kiếm', [
  { id: 'q1', question: 'sorted() của Python độ phức tạp?', options: ['O(n²)', 'O(n log n) — Timsort', 'O(n)', 'O(1)'], correctIndex: 1, explanation: 'Timsort là O(n log n), ổn định.' },
  { id: 'q2', question: 'Binary search cần điều kiện?', options: ['List bất kỳ', 'List ĐÃ SẮP', 'set', 'dict'], correctIndex: 1, explanation: 'Binary search chỉ đúng trên dữ liệu đã sắp.' },
]);

const c4 = doc('csd203-4-1-tree-graph-hash', '4.1 — Trees, graphs & hashing|||4.1 — Cây, đồ thị & hashing',
  'Cây nhị phân & BST (chèn/tìm O(log n), duyệt), đồ thị (danh sách kề, BFS/DFS), và hashing (dict/set) — cùng ứng dụng.',
  [[
    `<span class="eyebrow">CSD203 · Chapter 4 · Lesson 4.1</span>
<h2>Trees, graphs &amp; hashing</h2>
<h3>Binary search tree</h3>
<pre><code class="language-python">class Node:
    def __init__(self, key):
        self.key = key
        self.left = self.right = None

def insert(root, k):
    if root is None: return Node(k)
    if k &lt; root.key: root.left = insert(root.left, k)
    else: root.right = insert(root.right, k)
    return root
</code></pre>
<p>A <strong>BST</strong> keeps left &lt; node &lt; right, giving O(log n) search/insert on a balanced tree (O(n) if it degenerates from sorted input). In-order traversal visits keys in sorted order.</p>
<h3>Graphs — BFS</h3>
<pre><code class="language-python">from collections import deque
def bfs(adj, start):
    seen = {start}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in seen:
                seen.add(v); q.append(v)
    return seen
</code></pre>
<p>Represent a graph as an <strong>adjacency list</strong> (a dict of vertex → neighbors). <strong>BFS</strong> (queue) finds shortest paths in unweighted graphs; <strong>DFS</strong> (stack/recursion) detects cycles.</p>
<h3>Hashing</h3>
<p>Python's <code>dict</code> and <code>set</code> <em>are</em> hash tables — O(1) average lookup. Reach for them whenever you need fast membership, counting (<code>collections.Counter</code>), or key→value mapping.</p>`,
    `<span class="eyebrow">CSD203 · Chương 4 · Bài 4.1</span>
<h2>Cây, đồ thị &amp; hashing</h2>
<h3>Cây nhị phân tìm kiếm</h3>
<pre><code class="language-python">class Node:
    def __init__(self, key):
        self.key = key
        self.left = self.right = None

def insert(root, k):
    if root is None: return Node(k)
    if k &lt; root.key: root.left = insert(root.left, k)
    else: root.right = insert(root.right, k)
    return root
</code></pre>
<p>Một <strong>BST</strong> giữ trái &lt; node &lt; phải, cho tìm/chèn O(log n) trên cây cân bằng (O(n) nếu suy biến từ input đã sắp). Duyệt in-order thăm key theo thứ tự tăng.</p>
<h3>Đồ thị — BFS</h3>
<pre><code class="language-python">from collections import deque
def bfs(adj, start):
    seen = {start}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in seen:
                seen.add(v); q.append(v)
    return seen
</code></pre>
<p>Biểu diễn đồ thị bằng <strong>danh sách kề</strong> (dict đỉnh → hàng xóm). <strong>BFS</strong> (queue) tìm đường ngắn nhất trong đồ thị không trọng số; <strong>DFS</strong> (stack/đệ quy) phát hiện chu trình.</p>
<h3>Hashing</h3>
<p><code>dict</code> và <code>set</code> của Python <em>chính là</em> bảng băm — tra O(1) trung bình. Dùng chúng khi cần kiểm thành viên nhanh, đếm (<code>collections.Counter</code>), hoặc ánh xạ key→value.</p>`,
  ]]);

const c4e = doc('csd203-4-2-exercise', 'Exercise 1 — two-sum with a hash set|||Bài tập 1 — two-sum bằng hash set',
  'Bài tập: tìm hai số trong list có tổng bằng target, O(n) bằng dict; kèm lời giải & so với O(n²).',
  [[
    `<span class="eyebrow">CSD203 · Chapter 4 · Exercise</span>
<h2>Exercise 1 — two-sum in O(n)</h2>
<div class="callout"><span class="badge">Đề</span> Given a list of ints and a target, return the indices of two numbers that add up to the target. Do it in O(n) using a dict.</div>
<h3>Worked solution</h3>
<pre><code class="language-python">def two_sum(nums, target):
    seen = {}                       # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:            # O(1) lookup
            return (seen[need], i)
        seen[x] = i
    return None
# two_sum([2, 7, 11, 15], 9) -> (0, 1)
</code></pre>
<p><strong>Why:</strong> the naive solution checks every pair — O(n²). Using a <strong>dict</strong> to remember values we've seen turns each "does the complement exist?" check into O(1), so the whole scan is O(n). This "trade memory for speed with a hash table" pattern is one of the most useful ideas in the course (and in interviews).</p>`,
    `<span class="eyebrow">CSD203 · Chương 4 · Bài tập</span>
<h2>Bài tập 1 — two-sum O(n)</h2>
<div class="callout"><span class="badge">Đề</span> Cho một list số nguyên và target, trả về chỉ số của hai số có tổng bằng target. Làm O(n) bằng dict.</div>
<h3>Lời giải</h3>
<pre><code class="language-python">def two_sum(nums, target):
    seen = {}                       # giá trị -> chỉ số
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:            # tra O(1)
            return (seen[need], i)
        seen[x] = i
    return None
# two_sum([2, 7, 11, 15], 9) -> (0, 1)
</code></pre>
<p><strong>Vì sao:</strong> cách ngây thơ kiểm mọi cặp — O(n²). Dùng một <strong>dict</strong> nhớ giá trị đã thấy biến mỗi câu hỏi "phần bù có tồn tại?" thành O(1), nên cả lượt quét là O(n). Mẫu "đổi bộ nhớ lấy tốc độ bằng bảng băm" này là một trong những ý hữu ích nhất của môn (và trong phỏng vấn).</p>`,
  ]]);

const c4q = quiz('csd203-quiz-4', 'Quiz 4 — Tree/graph/hash|||Quiz 4 — Cây/đồ thị/hash', [
  { id: 'q1', question: 'dict và set của Python là?', options: ['Cây cân bằng', 'Bảng băm (tra O(1) TB)', 'Danh sách liên kết', 'Mảng thường'], correctIndex: 1, explanation: 'dict/set hiện thực bằng hash table.' },
  { id: 'q2', question: 'Duyệt in-order BST cho?', options: ['Thứ tự ngẫu nhiên', 'Key theo thứ tự tăng', 'Chỉ root', 'Giảm dần'], correctIndex: 1, explanation: 'In-order (trái-node-phải) của BST = sắp tăng.' },
  { id: 'q3', question: 'Two-sum dùng dict đạt độ phức tạp?', options: ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'], correctIndex: 1, explanation: 'Dùng dict để tra phần bù O(1) → tổng O(n).' },
]);

const taiLieu = doc('csd203-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CSD203 · Resource hub</span>
<h2>📚 Course materials &amp; references</h2>
<p class="lead">A curated hub for self-study: the official FLM syllabus &amp; slides, books, free authoritative DSA references, YouTube channels, tools, and a step-by-step roadmap. Every link is real and opens in a new tab.</p>
<div class="callout"><span class="badge">FLM</span> Log in to <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> with your FPTU account to read the official syllabus and lecture slides for this course.</div>
<h3>📘 Syllabus &amp; slides</h3>
<ul>
<li><strong>FLM (flm.fpt.edu.vn)</strong> — the source of truth for CSD203: learning outcomes, per-session slides, and assessment scheme. Read the slide of a topic first, then use the sources below to practise.</li>
</ul>
<h3>📗 Books</h3>
<ul>
<li><a href="https://runestone.academy/ns/books/published/pythonds/index.html" target="_blank" rel="noopener">Problem Solving with Algorithms and Data Structures using Python</a>: a free, interactive textbook that matches this course exactly.</li>
<li><a href="https://www.manning.com/books/grokking-algorithms-second-edition" target="_blank" rel="noopener">Grokking Algorithms — Aditya Bhargava (Manning)</a>: an illustrated, beginner-friendly take on Big-O, sorting, graphs, and hashing.</li>
</ul>
<h3>🌐 Free official docs</h3>
<ul>
<li><a href="https://www.geeksforgeeks.org/data-structures/" target="_blank" rel="noopener">GeeksforGeeks — Data Structures</a>: explanations and code for every structure in the syllabus.</li>
<li><a href="https://visualgo.net/" target="_blank" rel="noopener">VisuAlgo</a>: animated visualizations of sorting, trees, graphs, and hashing.</li>
<li><a href="https://docs.python.org/3/" target="_blank" rel="noopener">Python docs</a>: the official reference for list, dict, set, and the collections module (deque, Counter).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NeetCode" target="_blank" rel="noopener">NeetCode</a> — clear, pattern-based DSA and interview problems in Python.</li>
<li><a href="https://www.youtube.com/@abdul_bari" target="_blank" rel="noopener">Abdul Bari</a> — thorough algorithm lectures with intuition.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — full-length Python DSA courses.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python 3</a> — the language and interpreter for the course.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — run Python in the browser, no install.</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> — editor with a debugger to step through code.</li>
<li><a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode</a> — practise problems to cement each structure.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations for the exam</strong> — master Big-O and the cost of list/dict/set operations from the FLM slides.</li>
<li><strong>Practise by coding</strong> — implement stacks/queues, recursion, sorting, and searching yourself, then check them on VisuAlgo.</li>
<li><strong>Go deeper in practice</strong> — build a BST and a graph (BFS/DFS), and solve two-sum with a hash set in O(n).</li>
<li><strong>Job-ready</strong> — drill LeetCode patterns and explain the time/space trade-off of each solution out loud.</li>
</ol>`,
    `<span class="eyebrow">CSD203 · Trung tâm tài liệu</span>
<h2>📚 Tài liệu tham khảo môn học</h2>
<p class="lead">Trung tâm tài liệu để tự học: giáo trình &amp; slide chính thức trên FLM, sách, tài liệu DSA uy tín miễn phí, kênh YouTube, công cụ, và lộ trình từng bước. Mọi link đều thật và mở ở tab mới.</p>
<div class="callout"><span class="badge">FLM</span> Đăng nhập <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> bằng tài khoản FPTU để đọc giáo trình và slide bài giảng chính thức của môn.</div>
<h3>📘 Giáo trình &amp; slide</h3>
<ul>
<li><strong>FLM (flm.fpt.edu.vn)</strong> — nguồn chuẩn của CSD203: chuẩn đầu ra, slide từng buổi, và cách đánh giá. Đọc slide của một chủ đề trước, rồi dùng các nguồn dưới để luyện.</li>
</ul>
<h3>📗 Sách</h3>
<ul>
<li><a href="https://runestone.academy/ns/books/published/pythonds/index.html" target="_blank" rel="noopener">Problem Solving with Algorithms and Data Structures using Python</a>: sách tương tác miễn phí, bám sát đúng môn này.</li>
<li><a href="https://www.manning.com/books/grokking-algorithms-second-edition" target="_blank" rel="noopener">Grokking Algorithms — Aditya Bhargava (Manning)</a>: cách tiếp cận minh hoạ, dễ cho người mới về Big-O, sorting, đồ thị, hashing.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://www.geeksforgeeks.org/data-structures/" target="_blank" rel="noopener">GeeksforGeeks — Data Structures</a>: giải thích và code cho mọi cấu trúc trong giáo trình.</li>
<li><a href="https://visualgo.net/" target="_blank" rel="noopener">VisuAlgo</a>: minh hoạ động cho sorting, cây, đồ thị, và hashing.</li>
<li><a href="https://docs.python.org/3/" target="_blank" rel="noopener">Python docs</a>: tài liệu chính thức về list, dict, set, và module collections (deque, Counter).</li>
</ul>
<h3>▶️ YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NeetCode" target="_blank" rel="noopener">NeetCode</a> — DSA và bài phỏng vấn theo pattern bằng Python, rõ ràng.</li>
<li><a href="https://www.youtube.com/@abdul_bari" target="_blank" rel="noopener">Abdul Bari</a> — bài giảng thuật toán kỹ và có trực giác.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — khoá dài về DSA bằng Python.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.python.org/" target="_blank" rel="noopener">Python 3</a> — ngôn ngữ và trình thông dịch cho môn học.</li>
<li><a href="https://colab.research.google.com/" target="_blank" rel="noopener">Google Colab</a> — chạy Python trên trình duyệt, không cần cài.</li>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">Visual Studio Code</a> — trình soạn có debugger để chạy từng bước.</li>
<li><a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode</a> — luyện bài để khắc sâu từng cấu trúc.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng để thi</strong> — nắm chắc Big-O và chi phí thao tác list/dict/set từ slide FLM.</li>
<li><strong>Luyện bằng code</strong> — tự hiện thực stack/queue, đệ quy, sorting, và searching, rồi đối chiếu trên VisuAlgo.</li>
<li><strong>Đào sâu thực tế</strong> — dựng một BST và một đồ thị (BFS/DFS), và giải two-sum bằng hash set trong O(n).</li>
<li><strong>Sẵn sàng đi làm</strong> — luyện pattern LeetCode và nói to được đánh đổi thời gian/bộ nhớ của từng lời giải.</li>
</ol>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CSD203',
    slug: 'csd203-data-structures-and-algorithm-with-python',
    title: 'Data Structures and Algorithm with Python',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSD203.webp',
    shortDescription: 'Core CS in Python — Big-O, lists/linked lists, stacks/queues, recursion, sorting/searching, trees/BST, graphs & hashing (dict/set). Bilingual, with runnable code & exercises.|||CS lõi bằng Python — Big-O, list/linked list, stack/queue, đệ quy, sorting/searching, tree/BST, đồ thị & hashing (dict/set). Song ngữ, code chạy được & bài tập.',
    description: 'Môn <strong>CSD203 — Cấu trúc dữ liệu &amp; giải thuật với Python</strong> (ngành CNTT, kỳ 3). Nền tảng khoa học máy tính bằng <strong>Python</strong>: <strong>Big-O</strong> → <strong>list/linked list</strong> → <strong>stack/queue</strong> (deque) → <strong>đệ quy</strong> → <strong>sorting &amp; searching</strong> (Timsort, binary search) → <strong>cây &amp; BST</strong> → <strong>đồ thị (BFS/DFS) &amp; hashing (dict/set)</strong>. Bám giáo trình FLM, song ngữ, code Python chạy được và bài tập kèm lời giải. Nền cho phỏng vấn kỹ thuật.',
    whatYouLearn: 'Big-O; list (chi phí thao tác), tuple/dict/set; stack (list) & queue (deque); đệ quy (giới hạn Python); sorting (bubble/insertion/merge/quick, Timsort) & binary search; cây nhị phân & BST (chèn/tìm/duyệt); đồ thị (danh sách kề, BFS/DFS); hashing (dict/set/Counter, two-sum O(n)).',
    requirements: 'Đã biết Python cơ bản (PRF/PRP). Cần Python 3 (hoặc Google Colab).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao DSA, chủ đề, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Big-O & list|||Chapter 1 — Big-O & lists', description: 'Big-O, list/dict/set & chi phí.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Stack, queue & đệ quy|||Chapter 2 — Stacks, queues & recursion', description: 'list/deque, LIFO/FIFO, đệ quy.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sắp xếp & tìm kiếm|||Chapter 3 — Sorting & searching', description: 'Timsort, các thuật toán, binary search.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Cây, đồ thị & hashing|||Chapter 4 — Trees, graphs & hashing', description: 'BST, BFS/DFS, dict/set, two-sum.', lessons: [c4, c4e, c4q] },
  ],
};
