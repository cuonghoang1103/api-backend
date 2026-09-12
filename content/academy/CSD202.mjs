/**
 * CSD202 — Data Structures and Algorithms (C++). Giáo trình FLM. Không slide gốc
 * → soạn từ syllabus (OOP C++, Big-O, linked list, stack/queue, recursion,
 * sorting/searching, tree/BST, graph, hashing) + kiến thức, song ngữ, code C++
 * thật, kèm BÀI TẬP. Giữ NGUYÊN slug. ⚠️ code: KHÔNG backtick/${ }; "\n" trong code viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('csd202-0-1-overview', 'Course overview: Data Structures & Algorithms|||Tổng quan môn: Cấu trúc dữ liệu & giải thuật',
  'Mục tiêu, 9 CLO (OOP C++; Big-O; linked list; stack/queue; recursion; sorting/searching; tree/BST; graph; hashing), lộ trình, đánh giá.',
  [[
    `<span class="eyebrow">CSD202 · Lesson 0.1 · Overview</span>
<h2>Data Structures &amp; Algorithms (C++)</h2>
<p class="lead">This is the course that turns a programmer into an engineer: how to <strong>store data</strong> (structures) and <strong>process it efficiently</strong> (algorithms), analyzed with <strong>Big-O</strong>. You'll implement everything in <strong>C++</strong>.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — OOP in C++ (encapsulation, inheritance, polymorphism)</li>
<li><strong>CLO2</strong> — complexity &amp; performance analysis (Big-O)</li>
<li><strong>CLO3</strong> — linked lists &amp; dynamic structures</li>
<li><strong>CLO4</strong> — stacks, queues &amp; applications</li>
<li><strong>CLO5</strong> — recursion &amp; its applications</li>
<li><strong>CLO6</strong> — sorting &amp; searching algorithms</li>
<li><strong>CLO7</strong> — trees &amp; binary search trees (BST)</li>
<li><strong>CLO8</strong> — graphs</li>
<li><strong>CLO9</strong> — hashing &amp; efficient retrieval</li>
</ul>
<h3>Why it matters</h3>
<p>The <em>right</em> data structure turns a slow program into an instant one. Choosing between an array, a linked list, a tree or a hash table — and knowing the Big-O cost of each operation — is the core skill this course builds. It's also the heart of technical interviews.</p>`,
    `<span class="eyebrow">CSD202 · Bài 0.1 · Tổng quan</span>
<h2>Cấu trúc dữ liệu &amp; giải thuật (C++)</h2>
<p class="lead">Đây là môn biến một lập trình viên thành kỹ sư: cách <strong>lưu dữ liệu</strong> (cấu trúc) và <strong>xử lý hiệu quả</strong> (giải thuật), phân tích bằng <strong>Big-O</strong>. Bạn hiện thực mọi thứ bằng <strong>C++</strong>.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — OOP trong C++ (đóng gói, kế thừa, đa hình)</li>
<li><strong>CLO2</strong> — phân tích độ phức tạp &amp; hiệu năng (Big-O)</li>
<li><strong>CLO3</strong> — linked list &amp; cấu trúc động</li>
<li><strong>CLO4</strong> — stack, queue &amp; ứng dụng</li>
<li><strong>CLO5</strong> — đệ quy &amp; ứng dụng</li>
<li><strong>CLO6</strong> — thuật toán sắp xếp &amp; tìm kiếm</li>
<li><strong>CLO7</strong> — cây &amp; cây nhị phân tìm kiếm (BST)</li>
<li><strong>CLO8</strong> — đồ thị</li>
<li><strong>CLO9</strong> — hashing &amp; truy xuất hiệu quả</li>
</ul>
<h3>Vì sao quan trọng</h3>
<p>Cấu trúc dữ liệu <em>đúng</em> biến một chương trình chậm thành tức thời. Chọn giữa mảng, linked list, cây hay bảng băm — và biết chi phí Big-O của mỗi thao tác — là kỹ năng lõi môn này xây. Nó cũng là trái tim của phỏng vấn kỹ thuật.</p>`,
  ]]);

/* Ch1: OOP C++ + Big-O */
const c1 = doc('csd202-1-1-cpp-bigo', '1.1 — C++ OOP recap & Big-O complexity|||1.1 — Ôn OOP C++ & độ phức tạp Big-O',
  'Ôn OOP C++ (class, con trỏ, template); và phân tích độ phức tạp Big-O (O(1)/O(log n)/O(n)/O(n log n)/O(n²)), best/worst/average, vì sao đo theo tăng trưởng.',
  [[
    `<span class="eyebrow">CSD202 · Chapter 1 · Lesson 1.1</span>
<h2>C++ OOP recap &amp; Big-O</h2>
<h3>C++ essentials for DSA</h3>
<p>You'll use <strong>classes</strong> (encapsulation), <strong>pointers</strong> (<code>new</code>/<code>delete</code> for dynamic memory), and <strong>templates</strong> (generic containers). A quick reminder:</p>
<pre><code class="language-cpp">template &lt;typename T&gt;
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
};
Box&lt;int&gt; b(42);   // works for any type
</code></pre>
<h3>Big-O: measuring growth</h3>
<p><strong>Big-O</strong> describes how an algorithm's time (or space) grows as input size <em>n</em> grows — ignoring constants. From fastest to slowest:</p>
<table><thead><tr><th>Big-O</th><th>Name</th><th>Example</th></tr></thead><tbody>
<tr><td>O(1)</td><td>constant</td><td>array index, hash lookup</td></tr>
<tr><td>O(log n)</td><td>logarithmic</td><td>binary search, BST</td></tr>
<tr><td>O(n)</td><td>linear</td><td>scan a list</td></tr>
<tr><td>O(n log n)</td><td>linearithmic</td><td>merge/quick sort</td></tr>
<tr><td>O(n²)</td><td>quadratic</td><td>bubble/insertion sort</td></tr>
</tbody></table>
<p>Analyze the <strong>worst case</strong> by default. Constants and lower-order terms drop: O(2n + 5) = O(n). Big-O is <em>why</em> we pick one structure/algorithm over another.</p>`,
    `<span class="eyebrow">CSD202 · Chương 1 · Bài 1.1</span>
<h2>Ôn OOP C++ &amp; Big-O</h2>
<h3>C++ cần cho DSA</h3>
<p>Bạn dùng <strong>class</strong> (đóng gói), <strong>con trỏ</strong> (<code>new</code>/<code>delete</code> cho bộ nhớ động), và <strong>template</strong> (container generic). Nhắc nhanh:</p>
<pre><code class="language-cpp">template &lt;typename T&gt;
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
};
Box&lt;int&gt; b(42);   // dùng được cho mọi kiểu
</code></pre>
<h3>Big-O: đo mức tăng trưởng</h3>
<p><strong>Big-O</strong> mô tả thời gian (hoặc bộ nhớ) của một thuật toán tăng thế nào khi cỡ đầu vào <em>n</em> tăng — bỏ qua hằng số. Từ nhanh tới chậm:</p>
<table><thead><tr><th>Big-O</th><th>Tên</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>O(1)</td><td>hằng</td><td>truy cập mảng, tra hash</td></tr>
<tr><td>O(log n)</td><td>logarit</td><td>binary search, BST</td></tr>
<tr><td>O(n)</td><td>tuyến tính</td><td>quét một danh sách</td></tr>
<tr><td>O(n log n)</td><td>tuyến-log</td><td>merge/quick sort</td></tr>
<tr><td>O(n²)</td><td>bậc hai</td><td>bubble/insertion sort</td></tr>
</tbody></table>
<p>Mặc định phân tích <strong>trường hợp xấu nhất</strong>. Hằng số và số hạng bậc thấp bị bỏ: O(2n + 5) = O(n). Big-O là <em>lý do</em> ta chọn cấu trúc/thuật toán này thay vì cái khác.</p>`,
  ]]);

const c1q = quiz('csd202-quiz-1', 'Quiz 1 — Big-O|||Quiz 1 — Big-O', [
  { id: 'q1', question: 'Binary search có độ phức tạp?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 1, explanation: 'Mỗi bước loại nửa dữ liệu → O(log n).' },
  { id: 'q2', question: 'O(2n + 5) rút gọn thành?', options: ['O(2n)', 'O(n)', 'O(n+5)', 'O(1)'], correctIndex: 1, explanation: 'Bỏ hằng số và bậc thấp → O(n).' },
  { id: 'q3', question: 'Truy cập arr[i] là?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 0, explanation: 'Truy cập mảng theo chỉ số là O(1).' },
]);

/* Ch2: Linked lists */
const c2 = doc('csd202-2-1-linked-list', '2.1 — Linked lists|||2.1 — Danh sách liên kết',
  'Node & con trỏ, singly vs doubly linked list, chèn/xoá/duyệt (Big-O), so với mảng; hiện thực C++ và bẫy quản lý bộ nhớ.',
  [[
    `<span class="eyebrow">CSD202 · Chapter 2 · Lesson 2.1</span>
<h2>Linked lists</h2>
<p class="lead">A <strong>linked list</strong> is a chain of <strong>nodes</strong>, each holding data + a pointer to the next. Unlike an array, it grows dynamically and inserts/deletes in O(1) once you have the node — but has no O(1) random access.</p>
<pre><code class="language-cpp">struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void push_front(int d) {          // insert at head — O(1)
        Node* n = new Node(d);
        n-&gt;next = head;
        head = n;
    }
    void print() {                    // traverse — O(n)
        for (Node* p = head; p; p = p-&gt;next)
            cout &lt;&lt; p-&gt;data &lt;&lt; " ";
    }
    ~LinkedList() {                   // free all nodes
        while (head) { Node* t = head; head = head-&gt;next; delete t; }
    }
};
</code></pre>
<table><thead><tr><th>Op</th><th>Array</th><th>Linked list</th></tr></thead><tbody>
<tr><td>Index access</td><td>O(1)</td><td>O(n)</td></tr>
<tr><td>Insert at head</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>Search</td><td>O(n)</td><td>O(n)</td></tr>
</tbody></table>
<p>A <strong>doubly linked list</strong> adds a <code>prev</code> pointer for backward traversal. <strong>Always free nodes</strong> (destructor) to avoid memory leaks.</p>`,
    `<span class="eyebrow">CSD202 · Chương 2 · Bài 2.1</span>
<h2>Danh sách liên kết</h2>
<p class="lead">Một <strong>linked list</strong> là chuỗi các <strong>node</strong>, mỗi node giữ dữ liệu + con trỏ tới node kế. Khác mảng, nó lớn động và chèn/xoá O(1) khi đã có node — nhưng không có truy cập ngẫu nhiên O(1).</p>
<pre><code class="language-cpp">struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void push_front(int d) {          // chèn đầu — O(1)
        Node* n = new Node(d);
        n-&gt;next = head;
        head = n;
    }
    void print() {                    // duyệt — O(n)
        for (Node* p = head; p; p = p-&gt;next)
            cout &lt;&lt; p-&gt;data &lt;&lt; " ";
    }
    ~LinkedList() {                   // giải phóng mọi node
        while (head) { Node* t = head; head = head-&gt;next; delete t; }
    }
};
</code></pre>
<table><thead><tr><th>Thao tác</th><th>Mảng</th><th>Linked list</th></tr></thead><tbody>
<tr><td>Truy cập theo index</td><td>O(1)</td><td>O(n)</td></tr>
<tr><td>Chèn đầu</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>Tìm kiếm</td><td>O(n)</td><td>O(n)</td></tr>
</tbody></table>
<p><strong>Doubly linked list</strong> thêm con trỏ <code>prev</code> để duyệt ngược. <strong>Luôn giải phóng node</strong> (destructor) để tránh rò rỉ bộ nhớ.</p>`,
  ]]);

const c2q = quiz('csd202-quiz-2', 'Quiz 2 — Linked lists|||Quiz 2 — Danh sách liên kết', [
  { id: 'q1', question: 'Chèn vào đầu linked list là?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 0, explanation: 'Chỉ đổi head → O(1); mảng chèn đầu là O(n).' },
  { id: 'q2', question: 'Nhược điểm của linked list so với mảng?', options: ['Không lớn được', 'Không truy cập ngẫu nhiên O(1) (phải duyệt)', 'Không xoá được', 'Tốn ít bộ nhớ hơn'], correctIndex: 1, explanation: 'Truy cập phần tử thứ i là O(n) vì phải đi từ head.' },
  { id: 'q3', question: 'Vì sao cần destructor trong LinkedList?', options: ['Cho đẹp', 'Giải phóng node (new) để tránh rò rỉ bộ nhớ', 'Để sắp xếp', 'Bắt buộc bởi C++'], correctIndex: 1, explanation: 'Node cấp bằng new phải delete, nếu không leak.' },
]);

/* Ch3: Stack & Queue */
const c3 = doc('csd202-3-1-stack-queue', '3.1 — Stacks & queues|||3.1 — Ngăn xếp & hàng đợi',
  'Stack (LIFO: push/pop/top) & ứng dụng (undo, kiểm ngoặc, gọi hàm); queue (FIFO: enqueue/dequeue) & ứng dụng (BFS, hàng chờ); hiện thực C++.',
  [[
    `<span class="eyebrow">CSD202 · Chapter 3 · Lesson 3.1</span>
<h2>Stacks &amp; queues</h2>
<h3>Stack — Last In, First Out</h3>
<p>A <strong>stack</strong> only touches its top: <code>push</code>, <code>pop</code>, <code>top</code> — all O(1). Uses: undo, the function call stack, expression evaluation, balanced-brackets checking.</p>
<pre><code class="language-cpp">// balanced brackets using std::stack
#include &lt;stack&gt;
bool balanced(const string&amp; s) {
    stack&lt;char&gt; st;
    for (char c : s) {
        if (c == '(' ) st.push(c);
        else if (c == ')') {
            if (st.empty()) return false;   // ) with no (
            st.pop();
        }
    }
    return st.empty();                      // all matched?
}
</code></pre>
<h3>Queue — First In, First Out</h3>
<p>A <strong>queue</strong> adds at the back, removes from the front: <code>push</code>/<code>enqueue</code>, <code>pop</code>/<code>dequeue</code> — O(1). Uses: task scheduling, print queues, <strong>BFS</strong> on graphs. A <strong>deque</strong> allows both ends; a <strong>priority queue</strong> pops the smallest/largest.</p>`,
    `<span class="eyebrow">CSD202 · Chương 3 · Bài 3.1</span>
<h2>Ngăn xếp &amp; hàng đợi</h2>
<h3>Stack — Vào sau, ra trước (LIFO)</h3>
<p>Một <strong>stack</strong> chỉ chạm đỉnh: <code>push</code>, <code>pop</code>, <code>top</code> — đều O(1). Ứng dụng: undo, call stack của hàm, tính biểu thức, kiểm ngoặc cân.</p>
<pre><code class="language-cpp">// kiểm ngoặc cân bằng std::stack
#include &lt;stack&gt;
bool balanced(const string&amp; s) {
    stack&lt;char&gt; st;
    for (char c : s) {
        if (c == '(' ) st.push(c);
        else if (c == ')') {
            if (st.empty()) return false;   // ) mà không có (
            st.pop();
        }
    }
    return st.empty();                      // khớp hết chưa?
}
</code></pre>
<h3>Queue — Vào trước, ra trước (FIFO)</h3>
<p>Một <strong>queue</strong> thêm ở cuối, lấy ở đầu: <code>push</code>/<code>enqueue</code>, <code>pop</code>/<code>dequeue</code> — O(1). Ứng dụng: lập lịch tác vụ, hàng in, <strong>BFS</strong> trên đồ thị. <strong>Deque</strong> cho cả hai đầu; <strong>priority queue</strong> lấy nhỏ nhất/lớn nhất.</p>`,
  ]]);

const c3e = doc('csd202-3-2-exercise', 'Exercise 1 — evaluate & reverse|||Bài tập 1 — đảo chuỗi bằng stack',
  'Bài tập: đảo ngược một chuỗi bằng stack; kèm lời giải và giải thích LIFO.',
  [[
    `<span class="eyebrow">CSD202 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — reverse a string with a stack</h2>
<div class="callout"><span class="badge">Đề</span> Reverse a string using a stack (no built-in reverse). Explain why a stack does this naturally.</div>
<h3>Worked solution</h3>
<pre><code class="language-cpp">#include &lt;stack&gt;
#include &lt;string&gt;
using namespace std;

string reverseStr(const string&amp; s) {
    stack&lt;char&gt; st;
    for (char c : s) st.push(c);      // push all: last char ends on top
    string out;
    while (!st.empty()) {
        out += st.top();             // pop in reverse order
        st.pop();
    }
    return out;
}
// reverseStr("abc") == "cba"
</code></pre>
<p><strong>Why:</strong> a stack is LIFO — the last character pushed is the first popped, so popping yields the reversed order for free. Complexity is O(n): each character is pushed once and popped once.</p>`,
    `<span class="eyebrow">CSD202 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — đảo chuỗi bằng stack</h2>
<div class="callout"><span class="badge">Đề</span> Đảo ngược một chuỗi bằng stack (không dùng reverse có sẵn). Giải thích vì sao stack làm việc này tự nhiên.</div>
<h3>Lời giải</h3>
<pre><code class="language-cpp">#include &lt;stack&gt;
#include &lt;string&gt;
using namespace std;

string reverseStr(const string&amp; s) {
    stack&lt;char&gt; st;
    for (char c : s) st.push(c);      // push hết: ký tự cuối nằm trên đỉnh
    string out;
    while (!st.empty()) {
        out += st.top();             // pop ra theo thứ tự ngược
        st.pop();
    }
    return out;
}
// reverseStr("abc") == "cba"
</code></pre>
<p><strong>Vì sao:</strong> stack là LIFO — ký tự push cuối là cái pop đầu, nên pop ra cho thứ tự ngược miễn phí. Độ phức tạp O(n): mỗi ký tự push một lần, pop một lần.</p>`,
  ]]);

const c3q = quiz('csd202-quiz-3', 'Quiz 3 — Stack & queue|||Quiz 3 — Stack & queue', [
  { id: 'q1', question: 'Stack hoạt động theo nguyên tắc?', options: ['FIFO', 'LIFO (vào sau ra trước)', 'Ngẫu nhiên', 'Sắp xếp'], correctIndex: 1, explanation: 'Stack = LIFO; queue = FIFO.' },
  { id: 'q2', question: 'Cấu trúc nào dùng cho BFS trên đồ thị?', options: ['Stack', 'Queue', 'Tree', 'Hash'], correctIndex: 1, explanation: 'BFS dùng queue (FIFO); DFS dùng stack/đệ quy.' },
  { id: 'q3', question: 'push/pop/top của stack là?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 0, explanation: 'Chỉ thao tác đỉnh → O(1).' },
]);

/* Ch4: Recursion + Sorting/Searching */
const c4 = doc('csd202-4-1-recursion-sorting', '4.1 — Recursion, sorting & searching|||4.1 — Đệ quy, sắp xếp & tìm kiếm',
  'Đệ quy (base case + recursive case, ngăn xếp gọi), ví dụ (giai thừa, Fibonacci, Hanoi); sorting (bubble/insertion O(n²) vs merge/quick O(n log n)); searching (linear vs binary).',
  [[
    `<span class="eyebrow">CSD202 · Chapter 4 · Lesson 4.1</span>
<h2>Recursion, sorting &amp; searching</h2>
<h3>Recursion</h3>
<p>A recursive function calls itself on a smaller input, with a <strong>base case</strong> to stop. Each call adds a frame to the call stack.</p>
<pre><code class="language-cpp">int factorial(int n) {
    if (n &lt;= 1) return 1;           // base case
    return n * factorial(n - 1);    // recursive case
}
</code></pre>
<p>Classic examples: factorial, Fibonacci, Tower of Hanoi, and traversals of trees/graphs. Recursion is natural for divide-and-conquer.</p>
<h3>Sorting</h3>
<table><thead><tr><th>Algorithm</th><th>Time (avg)</th><th>Idea</th></tr></thead><tbody>
<tr><td>Bubble/Insertion</td><td>O(n²)</td><td>simple, in-place, small data</td></tr>
<tr><td>Merge sort</td><td>O(n log n)</td><td>divide, sort halves, merge (stable)</td></tr>
<tr><td>Quick sort</td><td>O(n log n) avg, O(n²) worst</td><td>partition around a pivot</td></tr>
</tbody></table>
<h3>Searching</h3>
<p><strong>Linear search</strong> O(n) scans everything. <strong>Binary search</strong> O(log n) halves a <em>sorted</em> array each step — the payoff of keeping data sorted.</p>
<pre><code class="language-cpp">int binarySearch(int a[], int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo &lt;= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == key) return mid;
        if (a[mid] &lt; key) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
</code></pre>`,
    `<span class="eyebrow">CSD202 · Chương 4 · Bài 4.1</span>
<h2>Đệ quy, sắp xếp &amp; tìm kiếm</h2>
<h3>Đệ quy</h3>
<p>Một hàm đệ quy gọi chính nó trên đầu vào nhỏ hơn, có <strong>base case</strong> để dừng. Mỗi lời gọi thêm một frame vào call stack.</p>
<pre><code class="language-cpp">int factorial(int n) {
    if (n &lt;= 1) return 1;           // base case
    return n * factorial(n - 1);    // recursive case
}
</code></pre>
<p>Ví dụ kinh điển: giai thừa, Fibonacci, Tháp Hà Nội, và duyệt cây/đồ thị. Đệ quy tự nhiên cho chia-để-trị.</p>
<h3>Sắp xếp</h3>
<table><thead><tr><th>Thuật toán</th><th>Thời gian (TB)</th><th>Ý tưởng</th></tr></thead><tbody>
<tr><td>Bubble/Insertion</td><td>O(n²)</td><td>đơn giản, tại chỗ, dữ liệu nhỏ</td></tr>
<tr><td>Merge sort</td><td>O(n log n)</td><td>chia, sắp hai nửa, trộn (ổn định)</td></tr>
<tr><td>Quick sort</td><td>O(n log n) TB, O(n²) xấu</td><td>phân hoạch quanh pivot</td></tr>
</tbody></table>
<h3>Tìm kiếm</h3>
<p><strong>Linear search</strong> O(n) quét hết. <strong>Binary search</strong> O(log n) chia đôi một mảng <em>đã sắp</em> mỗi bước — phần thưởng của việc giữ dữ liệu sắp xếp.</p>
<pre><code class="language-cpp">int binarySearch(int a[], int n, int key) {
    int lo = 0, hi = n - 1;
    while (lo &lt;= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == key) return mid;
        if (a[mid] &lt; key) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}
</code></pre>`,
  ]]);

const c4q = quiz('csd202-quiz-4', 'Quiz 4 — Recursion & sorting|||Quiz 4 — Đệ quy & sắp xếp', [
  { id: 'q1', question: 'Thiếu base case trong đệ quy gây?', options: ['Chạy nhanh', 'Đệ quy vô hạn → tràn stack (stack overflow)', 'Kết quả đúng', 'O(1)'], correctIndex: 1, explanation: 'Không có điều kiện dừng → gọi mãi → stack overflow.' },
  { id: 'q2', question: 'Merge sort có độ phức tạp trung bình?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], correctIndex: 1, explanation: 'Chia-trộn → O(n log n), ổn định.' },
  { id: 'q3', question: 'Binary search cần điều kiện gì?', options: ['Mảng bất kỳ', 'Mảng ĐÃ SẮP XẾP', 'Linked list', 'Dữ liệu ngẫu nhiên'], correctIndex: 1, explanation: 'Binary search chỉ đúng trên mảng đã sắp.' },
]);

/* Ch5: Trees & BST */
const c5 = doc('csd202-5-1-tree-bst', '5.1 — Trees & binary search trees (BST)|||5.1 — Cây & cây nhị phân tìm kiếm (BST)',
  'Thuật ngữ cây (root/leaf/height), cây nhị phân & duyệt (in/pre/post-order), BST (tính chất trái<gốc<phải), tìm/chèn/xoá O(log n) và trường hợp suy biến O(n).',
  [[
    `<span class="eyebrow">CSD202 · Chapter 5 · Lesson 5.1</span>
<h2>Trees &amp; binary search trees</h2>
<h3>Tree terms &amp; traversal</h3>
<p>A <strong>tree</strong> is a hierarchy: a <strong>root</strong>, internal nodes, and <strong>leaves</strong>. A <strong>binary tree</strong> has ≤ 2 children per node. Three depth-first traversals (recursion!):</p>
<ul>
<li><strong>In-order</strong> (left, node, right) — for a BST, visits values in sorted order.</li>
<li><strong>Pre-order</strong> (node, left, right) — copy/serialize a tree.</li>
<li><strong>Post-order</strong> (left, right, node) — delete/free a tree.</li>
</ul>
<h3>Binary search tree (BST)</h3>
<p>A <strong>BST</strong> keeps the invariant: every node's left subtree is smaller, right subtree is larger. This makes search/insert/delete <strong>O(log n)</strong> on a balanced tree.</p>
<pre><code class="language-cpp">struct TNode { int key; TNode *left = nullptr, *right = nullptr; TNode(int k):key(k){} };

TNode* insert(TNode* root, int k) {
    if (!root) return new TNode(k);
    if (k &lt; root-&gt;key) root-&gt;left  = insert(root-&gt;left, k);
    else               root-&gt;right = insert(root-&gt;right, k);
    return root;
}
bool search(TNode* root, int k) {
    if (!root) return false;
    if (k == root-&gt;key) return true;
    return k &lt; root-&gt;key ? search(root-&gt;left, k) : search(root-&gt;right, k);
}
</code></pre>
<p><strong>Warning:</strong> inserting sorted data makes a BST degenerate into a linked list — O(n). Balanced trees (AVL, Red-Black) fix this by keeping height ≈ log n.</p>`,
    `<span class="eyebrow">CSD202 · Chương 5 · Bài 5.1</span>
<h2>Cây &amp; cây nhị phân tìm kiếm</h2>
<h3>Thuật ngữ cây &amp; duyệt</h3>
<p>Một <strong>cây</strong> là phân cấp: một <strong>root</strong>, node trong, và <strong>lá</strong>. <strong>Cây nhị phân</strong> có ≤ 2 con mỗi node. Ba cách duyệt theo chiều sâu (đệ quy!):</p>
<ul>
<li><strong>In-order</strong> (trái, node, phải) — với BST, thăm giá trị theo thứ tự tăng.</li>
<li><strong>Pre-order</strong> (node, trái, phải) — sao chép/serialize cây.</li>
<li><strong>Post-order</strong> (trái, phải, node) — xoá/giải phóng cây.</li>
</ul>
<h3>Cây nhị phân tìm kiếm (BST)</h3>
<p>Một <strong>BST</strong> giữ bất biến: cây con trái mỗi node nhỏ hơn, cây con phải lớn hơn. Điều này làm tìm/chèn/xoá <strong>O(log n)</strong> trên cây cân bằng.</p>
<pre><code class="language-cpp">struct TNode { int key; TNode *left = nullptr, *right = nullptr; TNode(int k):key(k){} };

TNode* insert(TNode* root, int k) {
    if (!root) return new TNode(k);
    if (k &lt; root-&gt;key) root-&gt;left  = insert(root-&gt;left, k);
    else               root-&gt;right = insert(root-&gt;right, k);
    return root;
}
bool search(TNode* root, int k) {
    if (!root) return false;
    if (k == root-&gt;key) return true;
    return k &lt; root-&gt;key ? search(root-&gt;left, k) : search(root-&gt;right, k);
}
</code></pre>
<p><strong>Cảnh báo:</strong> chèn dữ liệu đã sắp làm BST suy biến thành linked list — O(n). Cây cân bằng (AVL, Red-Black) chữa bằng cách giữ chiều cao ≈ log n.</p>`,
  ]]);

const c5q = quiz('csd202-quiz-5', 'Quiz 5 — Trees & BST|||Quiz 5 — Cây & BST', [
  { id: 'q1', question: 'Duyệt in-order một BST cho?', options: ['Thứ tự ngẫu nhiên', 'Giá trị theo thứ tự TĂNG DẦN', 'Chỉ root', 'Thứ tự giảm'], correctIndex: 1, explanation: 'In-order (trái-node-phải) của BST = sắp tăng.' },
  { id: 'q2', question: 'Tìm kiếm trong BST CÂN BẰNG là?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 1, explanation: 'Mỗi bước loại nửa cây → O(log n) khi cân bằng.' },
  { id: 'q3', question: 'Chèn dữ liệu ĐÃ SẮP vào BST thường gây?', options: ['Cây tối ưu', 'Cây suy biến thành danh sách → O(n)', 'Lỗi biên dịch', 'O(1)'], correctIndex: 1, explanation: 'BST suy biến (skewed) → chiều cao n → thao tác O(n).' },
]);

/* Ch6: Graphs + Hashing */
const c6 = doc('csd202-6-1-graph-hash', '6.1 — Graphs & hashing|||6.1 — Đồ thị & hashing',
  'Đồ thị (đỉnh/cạnh, có hướng/vô hướng, biểu diễn ma trận kề vs danh sách kề), duyệt BFS/DFS; và hashing (hàm băm, bảng băm, xung đột & chaining) cho tra cứu O(1).',
  [[
    `<span class="eyebrow">CSD202 · Chapter 6 · Lesson 6.1</span>
<h2>Graphs &amp; hashing</h2>
<h3>Graphs</h3>
<p>A <strong>graph</strong> is vertices connected by <strong>edges</strong> (directed or undirected, weighted or not) — modeling maps, networks, dependencies. Two representations:</p>
<ul>
<li><strong>Adjacency matrix</strong> — a V×V grid; O(1) edge check, O(V²) space.</li>
<li><strong>Adjacency list</strong> — each vertex lists its neighbors; O(V+E) space, better for sparse graphs.</li>
</ul>
<p>Traversals: <strong>BFS</strong> (queue, shortest path in unweighted graphs), <strong>DFS</strong> (stack/recursion, cycle detection, topological sort).</p>
<pre><code class="language-cpp">// BFS from source s over an adjacency list
#include &lt;queue&gt;
#include &lt;vector&gt;
void bfs(vector&lt;vector&lt;int&gt;&gt;&amp; adj, int s) {
    vector&lt;bool&gt; seen(adj.size(), false);
    queue&lt;int&gt; q; q.push(s); seen[s] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (!seen[v]) { seen[v] = true; q.push(v); }
    }
}
</code></pre>
<h3>Hashing</h3>
<p>A <strong>hash table</strong> maps a key to an index via a <strong>hash function</strong>, giving <strong>O(1)</strong> average insert/search/delete. <strong>Collisions</strong> (two keys → same index) are handled by <strong>chaining</strong> (a list per bucket) or open addressing. This is what <code>unordered_map</code> uses — the fastest lookup structure when you don't need order.</p>`,
    `<span class="eyebrow">CSD202 · Chương 6 · Bài 6.1</span>
<h2>Đồ thị &amp; hashing</h2>
<h3>Đồ thị</h3>
<p>Một <strong>đồ thị</strong> là các đỉnh nối bằng <strong>cạnh</strong> (có hướng/vô hướng, có trọng số hay không) — mô hình bản đồ, mạng, phụ thuộc. Hai cách biểu diễn:</p>
<ul>
<li><strong>Ma trận kề</strong> — lưới V×V; kiểm cạnh O(1), tốn O(V²) bộ nhớ.</li>
<li><strong>Danh sách kề</strong> — mỗi đỉnh liệt kê hàng xóm; O(V+E) bộ nhớ, tốt cho đồ thị thưa.</li>
</ul>
<p>Duyệt: <strong>BFS</strong> (queue, đường ngắn nhất trong đồ thị không trọng số), <strong>DFS</strong> (stack/đệ quy, phát hiện chu trình, topological sort).</p>
<pre><code class="language-cpp">// BFS từ nguồn s trên danh sách kề
#include &lt;queue&gt;
#include &lt;vector&gt;
void bfs(vector&lt;vector&lt;int&gt;&gt;&amp; adj, int s) {
    vector&lt;bool&gt; seen(adj.size(), false);
    queue&lt;int&gt; q; q.push(s); seen[s] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) if (!seen[v]) { seen[v] = true; q.push(v); }
    }
}
</code></pre>
<h3>Hashing</h3>
<p>Một <strong>bảng băm</strong> ánh xạ key sang chỉ số qua một <strong>hàm băm</strong>, cho insert/search/delete <strong>O(1)</strong> trung bình. <strong>Xung đột</strong> (hai key → cùng chỉ số) xử bằng <strong>chaining</strong> (một danh sách mỗi bucket) hoặc open addressing. Đây là cái <code>unordered_map</code> dùng — cấu trúc tra cứu nhanh nhất khi không cần thứ tự.</p>`,
  ]]);

const c6q = quiz('csd202-quiz-6', 'Quiz 6 — Graphs & hashing|||Quiz 6 — Đồ thị & hashing', [
  { id: 'q1', question: 'BFS trên đồ thị dùng cấu trúc?', options: ['Stack', 'Queue', 'BST', 'Heap'], correctIndex: 1, explanation: 'BFS dùng queue; DFS dùng stack/đệ quy.' },
  { id: 'q2', question: 'Bảng băm cho tra cứu trung bình?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctIndex: 0, explanation: 'Hash table: insert/search/delete trung bình O(1).' },
  { id: 'q3', question: 'Xung đột hash xử lý bằng?', options: ['Bỏ key', 'Chaining (list mỗi bucket) hoặc open addressing', 'Sắp xếp', 'Tăng O'], correctIndex: 1, explanation: 'Chaining hoặc open addressing giải quyết collision.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'CSD202',
    slug: 'csd202-data-structures-and-algorithms-in-c',
    title: 'Data structures and algorithms (C++)',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CSD202.webp',
    shortDescription: 'The core CS course — Big-O, linked lists, stacks/queues, recursion, sorting/searching, trees/BST, graphs & hashing, all in C++. Bilingual, with runnable code & exercises.|||Môn CS lõi — Big-O, linked list, stack/queue, đệ quy, sorting/searching, tree/BST, đồ thị & hashing, tất cả bằng C++. Song ngữ, code chạy được & bài tập.',
    description: 'Môn <strong>CSD202 — Cấu trúc dữ liệu &amp; giải thuật (C++)</strong> (ngành Kỹ thuật phần mềm, kỳ 3). Nền tảng của khoa học máy tính: <strong>Big-O</strong> → <strong>linked list</strong> → <strong>stack/queue</strong> → <strong>đệ quy, sorting &amp; searching</strong> → <strong>cây &amp; BST</strong> → <strong>đồ thị &amp; hashing</strong>, hiện thực bằng <strong>C++</strong>. Bám giáo trình FLM (9 CLO), song ngữ, code C++ chạy được và bài tập kèm lời giải. Đây cũng là nền cho phỏng vấn kỹ thuật.',
    whatYouLearn: 'OOP C++ & template; phân tích Big-O (O(1)→O(n²), best/worst/average); linked list (singly/doubly); stack (LIFO) & queue (FIFO) + ứng dụng; đệ quy; sorting (bubble/insertion/merge/quick) & searching (linear/binary); cây nhị phân, duyệt in/pre/post-order, BST (chèn/tìm/xoá, suy biến, AVL/RB); đồ thị (ma trận/danh sách kề, BFS/DFS); hashing (hàm băm, collision, chaining, unordered_map).',
    requirements: 'Đã học lập trình cơ bản (PRF/PRO) và C++ nền. Cần trình biên dịch C++ (g++/clang, hoặc IDE như Visual Studio/CLion).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao DSA, 9 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Big-O & C++|||Chapter 1 — Big-O & C++', description: 'OOP C++/template, phân tích độ phức tạp.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Linked list|||Chapter 2 — Linked lists', description: 'Node/con trỏ, singly/doubly, so mảng.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Stack & Queue|||Chapter 3 — Stacks & queues', description: 'LIFO/FIFO, ứng dụng, hiện thực.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — Đệ quy, sorting & searching|||Chapter 4 — Recursion, sorting & searching', description: 'Đệ quy, các thuật toán sắp/tìm.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cây & BST|||Chapter 5 — Trees & BST', description: 'Duyệt cây, BST, cân bằng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Đồ thị & hashing|||Chapter 6 — Graphs & hashing', description: 'BFS/DFS, biểu diễn, bảng băm.', lessons: [c6, c6q] },
  ],
};
