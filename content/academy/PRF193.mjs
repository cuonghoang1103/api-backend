/**
 * PRF193 — Programming Fundamentals (with C/C++). Giáo trình FLM. Kỳ 1, môn nhập
 * môn. Không slide gốc → soạn từ syllabus + kiến thức, song ngữ, code C/C++ thật,
 * kèm BÀI TẬP. Giữ NGUYÊN slug. ⚠️ code: KHÔNG backtick/${ }; "\n" viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('prf193-0-1-overview', 'Course overview: Programming Fundamentals|||Tổng quan môn: Cơ sở lập trình',
  'Mục tiêu, 6 CLO (C/C++ cơ bản; control flow; hàm/đệ quy; OOP C++/bộ nhớ động; file; AI & computational thinking), lộ trình, đánh giá.',
  [[
    `<span class="eyebrow">PRF193 · Lesson 0.1 · Overview</span>
<h2>Programming Fundamentals (C/C++)</h2>
<p class="lead">Your first programming course. You'll learn to think like a programmer and write real programs in <strong>C/C++</strong>: variables, control flow, arrays &amp; pointers, functions, object-oriented programming, and files — plus computational thinking and AI tools.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — C/C++ basics: variables, types, operators, strings, arrays, pointers</li>
<li><strong>CLO2</strong> — decisions (if-else, switch) &amp; loops (for, while, do-while)</li>
<li><strong>CLO3</strong> — functions, recursion, parameter passing</li>
<li><strong>CLO4</strong> — OOP in C++ &amp; memory management (pointers, dynamic allocation, no leaks)</li>
<li><strong>CLO5</strong> — file handling (text/binary, read/write)</li>
<li><strong>CLO6</strong> — AI tools &amp; computational thinking for problem-solving</li>
</ul>
<h3>Computational thinking</h3>
<p>Programming is <strong>problem-solving</strong>: <em>decompose</em> a problem into steps, find the <em>pattern</em>, <em>abstract</em> away detail, and write an <em>algorithm</em>. The language (C/C++) is just how you tell the computer the steps.</p>`,
    `<span class="eyebrow">PRF193 · Bài 0.1 · Tổng quan</span>
<h2>Cơ sở lập trình (C/C++)</h2>
<p class="lead">Môn lập trình đầu tiên của bạn. Bạn học tư duy như một lập trình viên và viết chương trình thật bằng <strong>C/C++</strong>: biến, điều khiển luồng, mảng &amp; con trỏ, hàm, lập trình hướng đối tượng, và file — cộng tư duy tính toán và công cụ AI.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — C/C++ cơ bản: biến, kiểu, toán tử, chuỗi, mảng, con trỏ</li>
<li><strong>CLO2</strong> — rẽ nhánh (if-else, switch) &amp; vòng lặp (for, while, do-while)</li>
<li><strong>CLO3</strong> — hàm, đệ quy, truyền tham số</li>
<li><strong>CLO4</strong> — OOP trong C++ &amp; quản lý bộ nhớ (con trỏ, cấp phát động, không rò rỉ)</li>
<li><strong>CLO5</strong> — xử lý file (text/binary, đọc/ghi)</li>
<li><strong>CLO6</strong> — công cụ AI &amp; tư duy tính toán để giải quyết vấn đề</li>
</ul>
<h3>Tư duy tính toán</h3>
<p>Lập trình là <strong>giải quyết vấn đề</strong>: <em>phân rã</em> vấn đề thành bước, tìm <em>mẫu</em>, <em>trừu tượng hoá</em> chi tiết, và viết một <em>thuật toán</em>. Ngôn ngữ (C/C++) chỉ là cách bạn báo máy các bước.</p>`,
  ]]);

const c1 = doc('prf193-1-1-basics', '1.1 — C/C++ basics: variables, types & I/O|||1.1 — C/C++ cơ bản: biến, kiểu & nhập/xuất',
  'Cấu trúc chương trình C++, biến & kiểu (int/double/char/bool/string), nhập/xuất (cin/cout), toán tử số học/so sánh/logic, và ép kiểu.',
  [[
    `<span class="eyebrow">PRF193 · Chapter 1 · Lesson 1.1</span>
<h2>Variables, types &amp; I/O</h2>
<pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    int age;
    double height;
    cout &lt;&lt; "Enter age and height: ";
    cin &gt;&gt; age &gt;&gt; height;                 // read input
    cout &lt;&lt; "Next year you are " &lt;&lt; age + 1 &lt;&lt; endl;
    return 0;
}
</code></pre>
<p>Every C++ program has a <code>main()</code>. <strong>Types:</strong> <code>int</code> (whole), <code>double</code> (decimal), <code>char</code> (one character), <code>bool</code> (true/false), <code>string</code>. <code>cin &gt;&gt;</code> reads, <code>cout &lt;&lt;</code> writes; <code>endl</code> is a newline.</p>
<h3>Operators</h3>
<ul>
<li><strong>Arithmetic</strong> — <code>+ - * / %</code> (<code>%</code> = remainder). Note: <code>7 / 2 == 3</code> (integer division!), <code>7.0 / 2 == 3.5</code>.</li>
<li><strong>Comparison</strong> — <code>== != &lt; &gt; &lt;= &gt;=</code> (give a bool).</li>
<li><strong>Logical</strong> — <code>&amp;&amp;</code> (and), <code>||</code> (or), <code>!</code> (not).</li>
</ul>
<div class="pitfall"><b>Bẫy chia số nguyên:</b> <code>int</code> chia <code>int</code> bỏ phần lẻ (<code>7/2=3</code>). Muốn kết quả thực, ép một toán hạng sang <code>double</code>: <code>(double)7 / 2 = 3.5</code>.</div>`,
    `<span class="eyebrow">PRF193 · Chương 1 · Bài 1.1</span>
<h2>Biến, kiểu &amp; nhập/xuất</h2>
<pre><code class="language-cpp">#include &lt;iostream&gt;
using namespace std;

int main() {
    int age;
    double height;
    cout &lt;&lt; "Nhap tuoi va chieu cao: ";
    cin &gt;&gt; age &gt;&gt; height;                 // đọc input
    cout &lt;&lt; "Sang nam ban " &lt;&lt; age + 1 &lt;&lt; " tuoi" &lt;&lt; endl;
    return 0;
}
</code></pre>
<p>Mọi chương trình C++ có một <code>main()</code>. <strong>Kiểu:</strong> <code>int</code> (nguyên), <code>double</code> (thập phân), <code>char</code> (một ký tự), <code>bool</code> (đúng/sai), <code>string</code>. <code>cin &gt;&gt;</code> đọc, <code>cout &lt;&lt;</code> ghi; <code>endl</code> là xuống dòng.</p>
<h3>Toán tử</h3>
<ul>
<li><strong>Số học</strong> — <code>+ - * / %</code> (<code>%</code> = phần dư). Lưu ý: <code>7 / 2 == 3</code> (chia nguyên!), <code>7.0 / 2 == 3.5</code>.</li>
<li><strong>So sánh</strong> — <code>== != &lt; &gt; &lt;= &gt;=</code> (cho bool).</li>
<li><strong>Logic</strong> — <code>&amp;&amp;</code> (và), <code>||</code> (hoặc), <code>!</code> (phủ định).</li>
</ul>
<div class="pitfall"><b>Bẫy chia số nguyên:</b> <code>int</code> chia <code>int</code> bỏ phần lẻ (<code>7/2=3</code>). Muốn kết quả thực, ép một toán hạng sang <code>double</code>: <code>(double)7 / 2 = 3.5</code>.</div>`,
  ]]);

const c1q = quiz('prf193-quiz-1', 'Quiz 1 — Basics|||Quiz 1 — Cơ bản', [
  { id: 'q1', question: 'Trong C++, 7 / 2 cho kết quả?', options: ['3.5', '3 (chia nguyên)', '4', 'Lỗi'], correctIndex: 1, explanation: 'int/int bỏ phần lẻ → 3; cần double để ra 3.5.' },
  { id: 'q2', question: 'Toán tử % cho?', options: ['Phần dư', 'Phần trăm', 'Chia', 'Nhân'], correctIndex: 0, explanation: '% là phép lấy phần dư (modulo).' },
  { id: 'q3', question: 'cin >> x dùng để?', options: ['Ghi ra màn hình', 'Đọc input vào x', 'Khai báo biến', 'Xoá x'], correctIndex: 1, explanation: 'cin >> đọc dữ liệu từ bàn phím vào biến.' },
]);

const c2 = doc('prf193-2-1-control-flow', '2.1 — Control flow: if, switch & loops|||2.1 — Điều khiển luồng: if, switch & vòng lặp',
  'if/else if/else, switch, vòng lặp for/while/do-while, break/continue; ví dụ tính tổng, đếm, kiểm tra.',
  [[
    `<span class="eyebrow">PRF193 · Chapter 2 · Lesson 2.1</span>
<h2>Control flow</h2>
<pre><code class="language-cpp">// decisions
if (score &gt;= 80) cout &lt;&lt; "A";
else if (score &gt;= 50) cout &lt;&lt; "C";
else cout &lt;&lt; "F";

switch (day) {
    case 1: cout &lt;&lt; "Mon"; break;
    case 2: cout &lt;&lt; "Tue"; break;
    default: cout &lt;&lt; "Other";
}

// loops
int sum = 0;
for (int i = 1; i &lt;= 100; i++) sum += i;      // 1..100
while (n &gt; 0) { cout &lt;&lt; n % 2; n /= 2; }       // binary digits
do { cin &gt;&gt; x; } while (x &lt; 0);                 // repeat until valid
</code></pre>
<p><code>for</code> when you know the count; <code>while</code> for a condition; <code>do-while</code> runs at least once. <code>break</code> exits a loop; <code>continue</code> skips to the next iteration. In <code>switch</code>, <strong>don't forget <code>break</code></strong> or cases "fall through".</p>`,
    `<span class="eyebrow">PRF193 · Chương 2 · Bài 2.1</span>
<h2>Điều khiển luồng</h2>
<pre><code class="language-cpp">// rẽ nhánh
if (score &gt;= 80) cout &lt;&lt; "A";
else if (score &gt;= 50) cout &lt;&lt; "C";
else cout &lt;&lt; "F";

switch (day) {
    case 1: cout &lt;&lt; "Mon"; break;
    case 2: cout &lt;&lt; "Tue"; break;
    default: cout &lt;&lt; "Other";
}

// vòng lặp
int sum = 0;
for (int i = 1; i &lt;= 100; i++) sum += i;      // 1..100
while (n &gt; 0) { cout &lt;&lt; n % 2; n /= 2; }       // các chữ số nhị phân
do { cin &gt;&gt; x; } while (x &lt; 0);                 // lặp đến khi hợp lệ
</code></pre>
<p><code>for</code> khi biết số lần; <code>while</code> theo điều kiện; <code>do-while</code> chạy ít nhất một lần. <code>break</code> thoát vòng lặp; <code>continue</code> nhảy sang vòng kế. Trong <code>switch</code>, <strong>đừng quên <code>break</code></strong> nếu không các case "rơi xuống" (fall through).</p>`,
  ]]);

const c2q = quiz('prf193-quiz-2', 'Quiz 2 — Control flow|||Quiz 2 — Điều khiển luồng', [
  { id: 'q1', question: 'Vòng lặp nào chạy ÍT NHẤT một lần?', options: ['for', 'while', 'do-while', 'không cái nào'], correctIndex: 2, explanation: 'do-while kiểm điều kiện SAU thân → chạy ≥1 lần.' },
  { id: 'q2', question: 'Quên break trong switch gây?', options: ['Lỗi biên dịch', 'Fall through (chạy luôn case sau)', 'Bỏ qua case', 'Vô hại'], correctIndex: 1, explanation: 'Không break → thực thi rơi xuống các case tiếp theo.' },
  { id: 'q3', question: 'continue trong vòng lặp?', options: ['Thoát vòng lặp', 'Nhảy sang vòng lặp kế', 'Dừng chương trình', 'Lặp lại từ đầu'], correctIndex: 1, explanation: 'continue bỏ phần còn lại, sang vòng tiếp; break mới thoát.' },
]);

const c3 = doc('prf193-3-1-array-pointer', '3.1 — Arrays, strings & pointers|||3.1 — Mảng, chuỗi & con trỏ',
  'Mảng (khai báo, duyệt, giới hạn cố định), string, và con trỏ (địa chỉ &, giải tham chiếu *, quan hệ mảng-con trỏ); bẫy chỉ số ngoài mảng.',
  [[
    `<span class="eyebrow">PRF193 · Chapter 3 · Lesson 3.1</span>
<h2>Arrays, strings &amp; pointers</h2>
<h3>Arrays</h3>
<pre><code class="language-cpp">int a[5] = {10, 20, 30, 40, 50};
for (int i = 0; i &lt; 5; i++) cout &lt;&lt; a[i] &lt;&lt; " ";   // index 0..4
</code></pre>
<p>An array is a fixed-size, contiguous block; indices run <strong>0 to n-1</strong>. Accessing <code>a[5]</code> here is <strong>out of bounds</strong> — undefined behavior, a classic bug.</p>
<h3>Pointers</h3>
<pre><code class="language-cpp">int x = 42;
int* p = &amp;x;        // p holds the address of x
cout &lt;&lt; *p;         // *p dereferences → 42
*p = 99;           // changes x through the pointer → x == 99
</code></pre>
<p><code>&amp;x</code> is "address of x"; <code>*p</code> is "the value p points to". An array name is essentially a pointer to its first element (<code>a</code> == <code>&amp;a[0]</code>), so <code>*(a + i)</code> == <code>a[i]</code>. Pointers are how C/C++ share and modify data efficiently — and the source of many bugs, so handle with care.</p>`,
    `<span class="eyebrow">PRF193 · Chương 3 · Bài 3.1</span>
<h2>Mảng, chuỗi &amp; con trỏ</h2>
<h3>Mảng</h3>
<pre><code class="language-cpp">int a[5] = {10, 20, 30, 40, 50};
for (int i = 0; i &lt; 5; i++) cout &lt;&lt; a[i] &lt;&lt; " ";   // chỉ số 0..4
</code></pre>
<p>Mảng là một khối cố định, liền kề; chỉ số chạy <strong>0 tới n-1</strong>. Truy cập <code>a[5]</code> ở đây là <strong>ngoài mảng</strong> — hành vi không xác định, một bug kinh điển.</p>
<h3>Con trỏ</h3>
<pre><code class="language-cpp">int x = 42;
int* p = &amp;x;        // p giữ địa chỉ của x
cout &lt;&lt; *p;         // *p giải tham chiếu → 42
*p = 99;           // đổi x qua con trỏ → x == 99
</code></pre>
<p><code>&amp;x</code> là "địa chỉ của x"; <code>*p</code> là "giá trị p trỏ tới". Tên mảng về cơ bản là con trỏ tới phần tử đầu (<code>a</code> == <code>&amp;a[0]</code>), nên <code>*(a + i)</code> == <code>a[i]</code>. Con trỏ là cách C/C++ chia sẻ và sửa dữ liệu hiệu quả — và nguồn nhiều bug, nên cẩn thận.</p>`,
  ]]);

const c3q = quiz('prf193-quiz-3', 'Quiz 3 — Arrays & pointers|||Quiz 3 — Mảng & con trỏ', [
  { id: 'q1', question: 'Mảng int a[5], chỉ số hợp lệ là?', options: ['1..5', '0..4', '0..5', '1..4'], correctIndex: 1, explanation: 'Chỉ số 0 tới n-1 = 0..4; a[5] là ngoài mảng.' },
  { id: 'q2', question: '&x nghĩa là?', options: ['Giá trị của x', 'Địa chỉ của x', 'x nhân 2', 'Con trỏ null'], correctIndex: 1, explanation: '& là toán tử lấy địa chỉ.' },
  { id: 'q3', question: '*p (p là con trỏ) cho?', options: ['Địa chỉ p', 'Giá trị mà p trỏ tới', 'p nhân', 'Null'], correctIndex: 1, explanation: '* giải tham chiếu → giá trị tại địa chỉ p.' },
]);

const c4 = doc('prf193-4-1-functions', '4.1 — Functions & recursion|||4.1 — Hàm & đệ quy',
  'Định nghĩa hàm (tham số, kiểu trả về), truyền theo giá trị vs tham chiếu (&), phạm vi biến, và đệ quy (base case); ví dụ giai thừa/Fibonacci.',
  [[
    `<span class="eyebrow">PRF193 · Chapter 4 · Lesson 4.1</span>
<h2>Functions &amp; recursion</h2>
<pre><code class="language-cpp">int add(int a, int b) { return a + b; }         // returns a value

void swap(int&amp; a, int&amp; b) {                      // pass by reference
    int t = a; a = b; b = t;                     // changes the originals
}
// swap(x, y) actually swaps x and y
</code></pre>
<p><strong>Pass by value</strong> copies the argument (changes stay local); <strong>pass by reference</strong> (<code>int&amp;</code>) lets the function modify the caller's variable. Functions break a big problem into named, reusable pieces (modular programming).</p>
<h3>Recursion</h3>
<pre><code class="language-cpp">int factorial(int n) {
    if (n &lt;= 1) return 1;            // base case — stops recursion
    return n * factorial(n - 1);     // recursive case
}
</code></pre>
<p>A recursive function calls itself on a smaller input with a <strong>base case</strong> to stop. Without a base case → infinite recursion → stack overflow. Great for problems that break into smaller identical sub-problems (factorial, Fibonacci, traversals).</p>`,
    `<span class="eyebrow">PRF193 · Chương 4 · Bài 4.1</span>
<h2>Hàm &amp; đệ quy</h2>
<pre><code class="language-cpp">int add(int a, int b) { return a + b; }         // trả về giá trị

void swap(int&amp; a, int&amp; b) {                      // truyền theo tham chiếu
    int t = a; a = b; b = t;                     // đổi biến gốc
}
// swap(x, y) thực sự hoán đổi x và y
</code></pre>
<p><strong>Truyền theo giá trị</strong> sao chép tham số (thay đổi ở lại cục bộ); <strong>truyền theo tham chiếu</strong> (<code>int&amp;</code>) cho hàm sửa biến của người gọi. Hàm chia vấn đề lớn thành mảnh có tên, tái dùng (lập trình module).</p>
<h3>Đệ quy</h3>
<pre><code class="language-cpp">int factorial(int n) {
    if (n &lt;= 1) return 1;            // base case — dừng đệ quy
    return n * factorial(n - 1);     // recursive case
}
</code></pre>
<p>Hàm đệ quy gọi chính nó trên đầu vào nhỏ hơn với một <strong>base case</strong> để dừng. Không có base case → đệ quy vô hạn → tràn stack. Tốt cho vấn đề tách thành sub-problem giống hệt nhỏ hơn (giai thừa, Fibonacci, duyệt).</p>`,
  ]]);

const c4e = doc('prf193-4-2-exercise', 'Exercise 1 — sum of digits (recursive)|||Bài tập 1 — tổng chữ số (đệ quy)',
  'Bài tập: viết hàm đệ quy tính tổng các chữ số của một số nguyên; kèm lời giải.',
  [[
    `<span class="eyebrow">PRF193 · Chapter 4 · Exercise</span>
<h2>Exercise 1 — sum of digits, recursively</h2>
<div class="callout"><span class="badge">Đề</span> Write a recursive function that returns the sum of the digits of a non-negative integer. E.g. sumDigits(1234) = 1+2+3+4 = 10.</div>
<h3>Worked solution</h3>
<pre><code class="language-cpp">int sumDigits(int n) {
    if (n &lt; 10) return n;                  // base case: one digit
    return n % 10 + sumDigits(n / 10);     // last digit + rest
}
// sumDigits(1234) = 4 + sumDigits(123) = 4 + 3 + 2 + 1 = 10
</code></pre>
<p><strong>Why:</strong> <code>n % 10</code> peels off the last digit; <code>n / 10</code> drops it, giving a smaller problem; the base case (a single digit) stops the recursion. Each call handles one digit — a clean example of decomposing a problem into an identical smaller one.</p>`,
    `<span class="eyebrow">PRF193 · Chương 4 · Bài tập</span>
<h2>Bài tập 1 — tổng chữ số, bằng đệ quy</h2>
<div class="callout"><span class="badge">Đề</span> Viết hàm đệ quy trả về tổng các chữ số của một số nguyên không âm. Vd sumDigits(1234) = 1+2+3+4 = 10.</div>
<h3>Lời giải</h3>
<pre><code class="language-cpp">int sumDigits(int n) {
    if (n &lt; 10) return n;                  // base case: một chữ số
    return n % 10 + sumDigits(n / 10);     // chữ số cuối + phần còn lại
}
// sumDigits(1234) = 4 + sumDigits(123) = 4 + 3 + 2 + 1 = 10
</code></pre>
<p><strong>Vì sao:</strong> <code>n % 10</code> tách chữ số cuối; <code>n / 10</code> bỏ nó, cho bài toán nhỏ hơn; base case (một chữ số) dừng đệ quy. Mỗi lời gọi xử lý một chữ số — ví dụ sạch của phân rã vấn đề thành cái nhỏ hơn giống hệt.</p>`,
  ]]);

const c4q = quiz('prf193-quiz-4', 'Quiz 4 — Functions|||Quiz 4 — Hàm', [
  { id: 'q1', question: 'Truyền theo tham chiếu (int&) cho phép?', options: ['Chỉ đọc', 'Hàm sửa biến GỐC của người gọi', 'Chạy nhanh hơn', 'Không truyền được'], correctIndex: 1, explanation: 'Tham chiếu thao tác trực tiếp biến gốc; giá trị thì chỉ sao chép.' },
  { id: 'q2', question: 'Đệ quy thiếu base case gây?', options: ['Kết quả đúng', 'Đệ quy vô hạn → tràn stack', 'O(1)', 'Lỗi biên dịch'], correctIndex: 1, explanation: 'Không có điều kiện dừng → gọi mãi → stack overflow.' },
]);

const c5 = doc('prf193-5-1-oop-files', '5.1 — OOP in C++, memory & files|||5.1 — OOP C++, bộ nhớ & file',
  'Class/object (encapsulation, constructor/destructor), kế thừa & đa hình, cấp phát động (new/delete, smart pointer, tránh leak); và đọc/ghi file (ifstream/ofstream).',
  [[
    `<span class="eyebrow">PRF193 · Chapter 5 · Lesson 5.1</span>
<h2>OOP in C++, memory &amp; files</h2>
<h3>Classes</h3>
<pre><code class="language-cpp">class Circle {
    double r;
public:
    Circle(double radius) : r(radius) {}     // constructor
    double area() const { return 3.14159 * r * r; }
};
Circle c(2.0);
cout &lt;&lt; c.area();
</code></pre>
<p>A <strong>class</strong> bundles data + methods (<strong>encapsulation</strong>). <strong>Inheritance</strong> (<code>class Dog : public Animal</code>) and <strong>polymorphism</strong> (<code>virtual</code> methods) build on it.</p>
<h3>Dynamic memory</h3>
<pre><code class="language-cpp">int* arr = new int[100];   // allocate on the heap
// ... use arr ...
delete[] arr;              // MUST free, or memory leak

#include &lt;memory&gt;
auto p = make_unique&lt;int&gt;(42);   // smart pointer: frees itself
</code></pre>
<p>Every <code>new</code> needs a matching <code>delete</code> or you <strong>leak memory</strong>; using freed memory is a <strong>dangling pointer</strong>. Modern C++ prefers <strong>smart pointers</strong> (<code>unique_ptr</code>) that free automatically.</p>
<h3>Files</h3>
<pre><code class="language-cpp">#include &lt;fstream&gt;
ofstream out("data.txt");  out &lt;&lt; "hello" &lt;&lt; endl;  out.close();
ifstream in("data.txt");   string line;  getline(in, line);  in.close();
</code></pre>`,
    `<span class="eyebrow">PRF193 · Chương 5 · Bài 5.1</span>
<h2>OOP C++, bộ nhớ &amp; file</h2>
<h3>Class</h3>
<pre><code class="language-cpp">class Circle {
    double r;
public:
    Circle(double radius) : r(radius) {}     // constructor
    double area() const { return 3.14159 * r * r; }
};
Circle c(2.0);
cout &lt;&lt; c.area();
</code></pre>
<p>Một <strong>class</strong> gói dữ liệu + phương thức (<strong>đóng gói</strong>). <strong>Kế thừa</strong> (<code>class Dog : public Animal</code>) và <strong>đa hình</strong> (phương thức <code>virtual</code>) xây trên đó.</p>
<h3>Bộ nhớ động</h3>
<pre><code class="language-cpp">int* arr = new int[100];   // cấp phát trên heap
// ... dùng arr ...
delete[] arr;              // PHẢI giải phóng, nếu không rò rỉ bộ nhớ

#include &lt;memory&gt;
auto p = make_unique&lt;int&gt;(42);   // smart pointer: tự giải phóng
</code></pre>
<p>Mỗi <code>new</code> cần một <code>delete</code> tương ứng, nếu không <strong>rò rỉ bộ nhớ</strong>; dùng bộ nhớ đã giải phóng là <strong>dangling pointer</strong>. C++ hiện đại ưa <strong>smart pointer</strong> (<code>unique_ptr</code>) tự giải phóng.</p>
<h3>File</h3>
<pre><code class="language-cpp">#include &lt;fstream&gt;
ofstream out("data.txt");  out &lt;&lt; "hello" &lt;&lt; endl;  out.close();
ifstream in("data.txt");   string line;  getline(in, line);  in.close();
</code></pre>`,
  ]]);

const c5q = quiz('prf193-quiz-5', 'Quiz 5 — OOP, memory & files|||Quiz 5 — OOP, bộ nhớ & file', [
  { id: 'q1', question: 'Mỗi new[] cần gì để tránh rò rỉ bộ nhớ?', options: ['free()', 'delete[] tương ứng', 'return', 'close()'], correctIndex: 1, explanation: 'new[] phải delete[]; new phải delete.' },
  { id: 'q2', question: 'Smart pointer (unique_ptr) lợi ở?', options: ['Chạy nhanh gấp đôi', 'Tự giải phóng bộ nhớ → tránh leak', 'Không cần class', 'Bắt buộc'], correctIndex: 1, explanation: 'unique_ptr tự delete khi hết phạm vi → chống leak.' },
  { id: 'q3', question: 'Ghi ra file trong C++ dùng?', options: ['cin', 'ofstream', 'ifstream', 'cout'], correctIndex: 1, explanation: 'ofstream để ghi, ifstream để đọc file.' },
]);

export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'PRF193',
    slug: 'prf193-programming-fundamentals',
    title: 'Programming Fundamentals (with C/C++)',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRF193.webp',
    shortDescription: 'Your first programming course in C/C++ — variables, control flow, arrays & pointers, functions & recursion, OOP, memory & files. Bilingual, with runnable code & exercises.|||Môn lập trình đầu tiên bằng C/C++ — biến, điều khiển luồng, mảng & con trỏ, hàm & đệ quy, OOP, bộ nhớ & file. Song ngữ, code chạy được & bài tập.',
    description: 'Môn <strong>PRF193 — Cơ sở lập trình (với C/C++)</strong> (kỳ 1, môn nhập môn). Học tư duy lập trình và viết chương trình thật bằng <strong>C/C++</strong>: biến &amp; kiểu → <strong>điều khiển luồng</strong> (if/switch/loop) → <strong>mảng, chuỗi &amp; con trỏ</strong> → <strong>hàm &amp; đệ quy</strong> → <strong>OOP, bộ nhớ động &amp; file</strong>, cùng <strong>tư duy tính toán</strong> và công cụ AI. Bám giáo trình FLM (6 CLO), song ngữ, code C/C++ chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'Biến/kiểu (int/double/char/bool/string), cin/cout, toán tử (bẫy chia nguyên); if/switch, for/while/do-while, break/continue; mảng, chuỗi, con trỏ (& và *, quan hệ mảng-con trỏ, ngoài mảng); hàm (giá trị vs tham chiếu), đệ quy; OOP C++ (class/constructor, kế thừa/đa hình); bộ nhớ động (new/delete, smart pointer, tránh leak/dangling); file (ifstream/ofstream); tư duy tính toán & AI.',
    requirements: 'Không cần nền lập trình trước. Cần trình biên dịch C++ (g++/clang, hoặc IDE như Visual Studio/Code::Blocks).',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Tư duy tính toán, 6 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — C/C++ cơ bản|||Chapter 1 — Basics', description: 'Biến, kiểu, nhập/xuất, toán tử.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Điều khiển luồng|||Chapter 2 — Control flow', description: 'if/switch, for/while/do-while.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Mảng, chuỗi & con trỏ|||Chapter 3 — Arrays & pointers', description: 'Mảng, string, con trỏ (& và *).', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hàm & đệ quy|||Chapter 4 — Functions & recursion', description: 'Hàm, tham chiếu, đệ quy.', lessons: [c4, c4e, c4q] },
    { title: 'Chương 5 — OOP, bộ nhớ & file|||Chapter 5 — OOP, memory & files', description: 'Class, new/delete, smart pointer, file.', lessons: [c5, c5q] },
  ],
};
