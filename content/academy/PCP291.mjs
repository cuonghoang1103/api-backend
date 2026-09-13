/**
 * PCP291 — C++ Programming (Lập trình C++). Ngành Kỹ thuật phần mềm ô tô, kỳ 2.
 * Giáo trình chuẩn (trích dẫn, KHÔNG upload PDF): Stroustrup "The C++
 * Programming Language" & "A Tour of C++"; Lippman "C++ Primer"; Meyers
 * "Effective Modern C++"; cppreference.com. Song ngữ VI+EN, ví dụ C++, quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n;
 * escape < > & trong nội dung: &lt; &gt; &amp; (chú ý std::vector<int>, <<, >>, ->).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('pcp291-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Stroustrup, Lippman, Meyers), cppreference, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PCP291 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>C++</strong> — from variables and I/O to classes, templates, the STL and modern C++ — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are the standard books and free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for PCP291 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Standard reference books</h3>
<ul>
<li><a href="https://www.stroustrup.com/4th.html" target="_blank" rel="noopener">Bjarne Stroustrup — <em>The C++ Programming Language</em></a> (the definitive reference, by C++ creator)</li>
<li><a href="https://www.stroustrup.com/tour3.html" target="_blank" rel="noopener">Bjarne Stroustrup — <em>A Tour of C++</em></a> (concise modern overview)</li>
<li><a href="https://www.informit.com/store/c-plus-plus-primer-9780321714114" target="_blank" rel="noopener">Lippman, Lajoie &amp; Moo — <em>C++ Primer</em></a> (best full tutorial)</li>
<li><a href="https://www.oreilly.com/library/view/effective-modern-c/9781491908419/" target="_blank" rel="noopener">Scott Meyers — <em>Effective Modern C++</em></a> (42 items on C++11/14)</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://en.cppreference.com/w/" target="_blank" rel="noopener">cppreference.com</a> — the authoritative online language &amp; library reference</li>
<li><a href="https://isocpp.org/faq" target="_blank" rel="noopener">isocpp.org — the C++ Super-FAQ</a></li>
<li><a href="https://google.github.io/styleguide/cppguide.html" target="_blank" rel="noopener">Google C++ Style Guide</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TheCherno" target="_blank" rel="noopener">The Cherno</a> — a deep, practical C++ series</li>
<li><a href="https://www.youtube.com/@CppCon" target="_blank" rel="noopener">CppCon</a> — conference talks from C++ experts</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer (godbolt.org)</a> — see the assembly your C++ compiles to</li>
<li><a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC (g++)</a> / <a href="https://clang.llvm.org/" target="_blank" rel="noopener">Clang</a> — the standard compilers</li>
<li><a href="https://www.onlinegdb.com/online_c++_compiler" target="_blank" rel="noopener">OnlineGDB</a> — run &amp; debug C++ in the browser</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — variables &amp; types, I/O, control flow, functions, pointers &amp; references.</li>
<li><strong>OOP</strong> — classes, encapsulation, constructors/destructors, inheritance &amp; polymorphism.</li>
<li><strong>Generic &amp; library</strong> — templates, the STL (containers, iterators, algorithms).</li>
<li><strong>Modern &amp; job-ready</strong> — smart pointers, move semantics, lambdas, RAII; write and debug real programs.</li>
</ol></div>`,
    `<span class="eyebrow">PCP291 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>C++</strong> — từ biến và I/O đến lớp, template, STL và C++ hiện đại — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là sách chuẩn và nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của PCP291 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo chuẩn</h3>
<ul>
<li><a href="https://www.stroustrup.com/4th.html" target="_blank" rel="noopener">Bjarne Stroustrup — <em>The C++ Programming Language</em></a> (sách tham khảo chuẩn mực, do cha đẻ C++ viết)</li>
<li><a href="https://www.stroustrup.com/tour3.html" target="_blank" rel="noopener">Bjarne Stroustrup — <em>A Tour of C++</em></a> (tổng quan C++ hiện đại, ngắn gọn)</li>
<li><a href="https://www.informit.com/store/c-plus-plus-primer-9780321714114" target="_blank" rel="noopener">Lippman, Lajoie &amp; Moo — <em>C++ Primer</em></a> (giáo trình đầy đủ, tốt nhất để học)</li>
<li><a href="https://www.oreilly.com/library/view/effective-modern-c/9781491908419/" target="_blank" rel="noopener">Scott Meyers — <em>Effective Modern C++</em></a> (42 lời khuyên cho C++11/14)</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.cppreference.com/w/" target="_blank" rel="noopener">cppreference.com</a> — tra cứu ngôn ngữ &amp; thư viện chuẩn, đáng tin nhất</li>
<li><a href="https://isocpp.org/faq" target="_blank" rel="noopener">isocpp.org — C++ Super-FAQ</a></li>
<li><a href="https://google.github.io/styleguide/cppguide.html" target="_blank" rel="noopener">Google C++ Style Guide</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TheCherno" target="_blank" rel="noopener">The Cherno</a> — loạt bài C++ sâu, thực chiến</li>
<li><a href="https://www.youtube.com/@CppCon" target="_blank" rel="noopener">CppCon</a> — bài nói hội nghị từ các chuyên gia C++</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://godbolt.org/" target="_blank" rel="noopener">Compiler Explorer (godbolt.org)</a> — xem mã assembly mà C++ của bạn biên dịch ra</li>
<li><a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC (g++)</a> / <a href="https://clang.llvm.org/" target="_blank" rel="noopener">Clang</a> — trình biên dịch chuẩn</li>
<li><a href="https://www.onlinegdb.com/online_c++_compiler" target="_blank" rel="noopener">OnlineGDB</a> — chạy &amp; debug C++ trên trình duyệt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — biến &amp; kiểu, I/O, điều khiển luồng, hàm, con trỏ &amp; tham chiếu.</li>
<li><strong>OOP</strong> — lớp, đóng gói, hàm khởi tạo/hủy, kế thừa &amp; đa hình.</li>
<li><strong>Tổng quát &amp; thư viện</strong> — template, STL (container, iterator, thuật toán).</li>
<li><strong>Hiện đại &amp; sẵn sàng đi làm</strong> — smart pointer, move, lambda, RAII; viết và debug chương trình thật.</li>
</ol></div>`,
  ]]);

const intro = doc('pcp291-0-1-overview', 'Course overview: C++ Programming|||Tổng quan: Lập trình C++',
  'C++ là gì và mạnh ở đâu; compile so với interpret; lộ trình 8 chương: nền tảng → OOP → template & STL → C++ hiện đại; vì sao C++ ngự trị nhúng ô tô.',
  [[
    `<span class="eyebrow">PCP291 · Lesson 0.1 · Overview</span>
<h2>C++ Programming</h2>
<p class="lead">C++ is a <strong>compiled, statically-typed</strong> language that gives you both <strong>high-level abstraction</strong> (classes, templates, the STL) and <strong>low-level control</strong> (pointers, direct memory management). That combination is why it runs game engines, browsers, databases — and the <strong>embedded controllers inside a car</strong>.</p>
<h3>Compiled vs interpreted</h3>
<p>Unlike Python (interpreted line by line), a C++ program is <strong>translated ahead of time</strong> into native machine code by a compiler (g++/clang), then run directly by the CPU. You pay a build step; in return you get speed and a compiler that catches many mistakes <em>before</em> the program ever runs.</p>
<pre><code>source.cpp  --[compiler g++]--&gt;  machine code (app)  --[CPU]--&gt;  runs
</code></pre>
<h3>Roadmap (8 chapters)</h3>
<ol>
<li>Intro, variables, types, I/O &amp; compilation</li>
<li>Control flow &amp; functions</li>
<li>Pointers, references &amp; memory management</li>
<li>Classes &amp; object-oriented programming</li>
<li>Inheritance &amp; polymorphism</li>
<li>Templates &amp; generic programming</li>
<li>The STL — containers, iterators, algorithms</li>
<li>Modern C++ (smart pointers, move, lambdas, RAII) &amp; automotive embedded</li>
</ol>
<div class="callout"><span class="badge">Why C++ in cars</span> Automotive software needs to be fast, deterministic and close to the hardware, with no garbage-collector pauses. C++ gives predictable performance and RAII-based resource safety — the reason AUTOSAR Adaptive and most ECUs are written in it.</div>`,
    `<span class="eyebrow">PCP291 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình C++</h2>
<p class="lead">C++ là ngôn ngữ <strong>biên dịch, kiểu tĩnh</strong>, cho bạn cả <strong>trừu tượng bậc cao</strong> (lớp, template, STL) lẫn <strong>kiểm soát bậc thấp</strong> (con trỏ, quản lý bộ nhớ trực tiếp). Chính sự kết hợp đó khiến nó chạy game engine, trình duyệt, cơ sở dữ liệu — và các <strong>bộ điều khiển nhúng trong xe hơi</strong>.</p>
<h3>Biên dịch so với thông dịch</h3>
<p>Khác Python (thông dịch từng dòng), chương trình C++ được <strong>dịch trước</strong> thành mã máy bởi trình biên dịch (g++/clang), rồi CPU chạy trực tiếp. Bạn trả giá bằng một bước build; đổi lại có tốc độ và một trình biên dịch bắt được nhiều lỗi <em>trước</em> khi chương trình chạy.</p>
<pre><code>source.cpp  --[trình biên dịch g++]--&gt;  mã máy (app)  --[CPU]--&gt;  chạy
</code></pre>
<h3>Lộ trình (8 chương)</h3>
<ol>
<li>Nhập môn, biến, kiểu, I/O &amp; biên dịch</li>
<li>Điều khiển luồng &amp; hàm</li>
<li>Con trỏ, tham chiếu &amp; quản lý bộ nhớ</li>
<li>Lớp &amp; lập trình hướng đối tượng</li>
<li>Kế thừa &amp; đa hình</li>
<li>Template &amp; lập trình tổng quát</li>
<li>STL — container, iterator, thuật toán</li>
<li>C++ hiện đại (smart pointer, move, lambda, RAII) &amp; nhúng ô tô</li>
</ol>
<div class="callout"><span class="badge">Vì sao C++ trong ô tô</span> Phần mềm ô tô cần nhanh, tất định và sát phần cứng, không có khựng do bộ dọn rác. C++ cho hiệu năng dự đoán được và an toàn tài nguyên nhờ RAII — lý do AUTOSAR Adaptive và hầu hết ECU đều viết bằng nó.</div>`,
  ]]);

const c1 = doc('pcp291-1-1-basics', '1.1 — Intro, variables, types, I/O & compilation|||1.1 — Nhập môn, biến, kiểu, I/O & biên dịch',
  'Cấu trúc chương trình C++ (main, include), biến & kiểu cơ bản (int/double/char/bool), nhập/xuất với cin/cout, và cách biên dịch bằng g++.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 1 · Lesson 1.1</span>
<h2>Intro, variables, types, I/O &amp; compilation</h2>
<h3>The shape of a program</h3>
<p>Every C++ program starts execution at <code>main()</code>. You <code>#include</code> headers to pull in library features — <code>&lt;iostream&gt;</code> gives you input/output.</p>
<h3>Fundamental types</h3>
<ul>
<li><strong>int</strong> — whole numbers; <strong>double</strong> / <strong>float</strong> — real numbers.</li>
<li><strong>char</strong> — a single character; <strong>bool</strong> — <code>true</code>/<code>false</code>.</li>
<li>C++ is <strong>statically typed</strong>: a variable's type is fixed at compile time, so the compiler catches type errors early.</li>
</ul>
<h3>Input &amp; output</h3>
<p><code>std::cout &lt;&lt; x</code> prints; <code>std::cin &gt;&gt; x</code> reads. The <code>&lt;&lt;</code> and <code>&gt;&gt;</code> are stream operators.</p>
<pre><code>#include &lt;iostream&gt;

int main() {
    int age = 20;            // integer
    double gpa = 3.5;        // floating point
    char grade = 'A';        // single character
    bool passed = true;      // boolean

    std::cout &lt;&lt; "GPA: " &lt;&lt; gpa &lt;&lt; std::endl;
    std::cout &lt;&lt; "Enter age: ";
    std::cin  &gt;&gt; age;        // read from keyboard
    return 0;                // 0 = success
}
</code></pre>
<h3>Compile &amp; run</h3>
<pre><code>g++ -std=c++17 main.cpp -o app
./app
</code></pre>
<div class="callout"><span class="badge">Static typing</span> Because types are checked when you compile, a whole class of bugs is caught before the program runs — a key reason C++ suits safety-critical code.</div>`,
    `<span class="eyebrow">PCP291 · Chương 1 · Bài 1.1</span>
<h2>Nhập môn, biến, kiểu, I/O &amp; biên dịch</h2>
<h3>Hình hài một chương trình</h3>
<p>Mọi chương trình C++ bắt đầu chạy tại <code>main()</code>. Bạn dùng <code>#include</code> để nạp tính năng thư viện — <code>&lt;iostream&gt;</code> cho nhập/xuất.</p>
<h3>Các kiểu cơ bản</h3>
<ul>
<li><strong>int</strong> — số nguyên; <strong>double</strong> / <strong>float</strong> — số thực.</li>
<li><strong>char</strong> — một ký tự; <strong>bool</strong> — <code>true</code>/<code>false</code>.</li>
<li>C++ là <strong>kiểu tĩnh</strong>: kiểu của biến cố định lúc biên dịch, nên trình biên dịch bắt lỗi kiểu sớm.</li>
</ul>
<h3>Nhập &amp; xuất</h3>
<p><code>std::cout &lt;&lt; x</code> in ra; <code>std::cin &gt;&gt; x</code> đọc vào. Cặp <code>&lt;&lt;</code> và <code>&gt;&gt;</code> là toán tử luồng.</p>
<pre><code>#include &lt;iostream&gt;

int main() {
    int age = 20;            // số nguyên
    double gpa = 3.5;        // số thực
    char grade = 'A';        // một ký tự
    bool passed = true;      // luận lý

    std::cout &lt;&lt; "GPA: " &lt;&lt; gpa &lt;&lt; std::endl;
    std::cout &lt;&lt; "Nhap tuoi: ";
    std::cin  &gt;&gt; age;        // đọc từ bàn phím
    return 0;                // 0 = thành công
}
</code></pre>
<h3>Biên dịch &amp; chạy</h3>
<pre><code>g++ -std=c++17 main.cpp -o app
./app
</code></pre>
<div class="callout"><span class="badge">Kiểu tĩnh</span> Vì kiểu được kiểm lúc biên dịch, cả một lớp lỗi bị bắt trước khi chương trình chạy — lý do lớn khiến C++ hợp với mã an toàn trọng yếu.</div>`,
  ]]);

const c1q = quiz('pcp291-quiz-1', 'Quiz 1 — Basics & I/O|||Quiz 1 — Nền tảng & I/O', [
  { id: 'q1', question: 'Chương trình C++ bắt đầu chạy từ đâu?', options: ['Dòng đầu tiên của file', 'Hàm main()', 'Câu lệnh include', 'Hàm được khai báo cuối cùng'], correctIndex: 1, explanation: 'Thực thi luôn bắt đầu tại hàm main().' },
  { id: 'q2', question: 'Toán tử nào dùng để ĐỌC dữ liệu từ bàn phím với std::cin?', options: ['Toán tử chèn ra luồng (in ra)', 'Toán tử trích từ luồng (đọc vào)', 'Toán tử gán =', 'Toán tử cộng +'], correctIndex: 1, explanation: 'std::cin dùng toán tử trích (>>) để đọc; std::cout dùng toán tử chèn (<<) để in.' },
  { id: 'q3', question: 'Vì sao C++ được gọi là ngôn ngữ kiểu tĩnh?', options: ['Biến không bao giờ đổi giá trị', 'Kiểu của biến cố định và được kiểm lúc biên dịch', 'Chương trình chạy chậm', 'Không cần khai báo kiểu'], correctIndex: 1, explanation: 'Kiểu tĩnh: kiểu xác định lúc biên dịch nên lỗi kiểu bị bắt sớm.' },
]);

const c2 = doc('pcp291-2-1-control-functions', '2.1 — Control flow & functions|||2.1 — Điều khiển luồng & hàm',
  'Rẽ nhánh (if/else, switch), vòng lặp (for/while), và hàm: khai báo, tham số, giá trị trả về, nạp chồng (overload), đối số mặc định, đệ quy.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 2 · Lesson 2.1</span>
<h2>Control flow &amp; functions</h2>
<h3>Branching &amp; loops</h3>
<p><strong>Control flow</strong> decides which statements run. <code>if/else</code> and <code>switch</code> branch; <code>for</code>, <code>while</code>, <code>do-while</code> repeat.</p>
<pre><code>for (int i = 0; i &lt; 5; ++i) {
    if (i % 2 == 0) std::cout &lt;&lt; i &lt;&lt; " is even ";
    else            std::cout &lt;&lt; i &lt;&lt; " is odd ";
}
</code></pre>
<h3>Functions</h3>
<p>A <strong>function</strong> packages logic behind a name. It has a <em>return type</em>, a <em>name</em>, and <em>parameters</em>. C++ passes arguments <strong>by value</strong> by default (a copy).</p>
<ul>
<li><strong>Overloading</strong> — same name, different parameter lists.</li>
<li><strong>Default arguments</strong> — a parameter can have a fallback value.</li>
<li><strong>Recursion</strong> — a function calling itself.</li>
</ul>
<pre><code>int add(int a, int b = 0) {   // default argument
    return a + b;
}
double add(double a, double b) {   // overload
    return a + b;
}
int factorial(int n) {             // recursion
    if (n &lt;= 1) return 1;
    return n * factorial(n - 1);
}
</code></pre>
<div class="callout"><span class="badge">By value vs by reference</span> Passing by value copies the argument, so the original is untouched. To let a function change the caller's variable (or to avoid copying a big object), pass by reference — Chapter 3.</div>`,
    `<span class="eyebrow">PCP291 · Chương 2 · Bài 2.1</span>
<h2>Điều khiển luồng &amp; hàm</h2>
<h3>Rẽ nhánh &amp; vòng lặp</h3>
<p><strong>Điều khiển luồng</strong> quyết định lệnh nào chạy. <code>if/else</code> và <code>switch</code> rẽ nhánh; <code>for</code>, <code>while</code>, <code>do-while</code> lặp lại.</p>
<pre><code>for (int i = 0; i &lt; 5; ++i) {
    if (i % 2 == 0) std::cout &lt;&lt; i &lt;&lt; " chan ";
    else            std::cout &lt;&lt; i &lt;&lt; " le ";
}
</code></pre>
<h3>Hàm</h3>
<p><strong>Hàm</strong> đóng gói logic sau một cái tên. Nó có <em>kiểu trả về</em>, một <em>tên</em>, và các <em>tham số</em>. Mặc định C++ truyền đối số <strong>theo giá trị</strong> (một bản sao).</p>
<ul>
<li><strong>Nạp chồng (overload)</strong> — cùng tên, khác danh sách tham số.</li>
<li><strong>Đối số mặc định</strong> — một tham số có thể có giá trị dự phòng.</li>
<li><strong>Đệ quy</strong> — hàm tự gọi chính nó.</li>
</ul>
<pre><code>int add(int a, int b = 0) {   // đối số mặc định
    return a + b;
}
double add(double a, double b) {   // nạp chồng
    return a + b;
}
int factorial(int n) {             // đệ quy
    if (n &lt;= 1) return 1;
    return n * factorial(n - 1);
}
</code></pre>
<div class="callout"><span class="badge">Theo giá trị so với tham chiếu</span> Truyền theo giá trị sao chép đối số nên bản gốc không đổi. Muốn hàm sửa được biến của người gọi (hoặc tránh sao chép đối tượng lớn), hãy truyền theo tham chiếu — Chương 3.</div>`,
  ]]);

const c2q = quiz('pcp291-quiz-2', 'Quiz 2 — Control flow & functions|||Quiz 2 — Luồng & hàm', [
  { id: 'q1', question: 'Nạp chồng hàm (function overloading) nghĩa là gì?', options: ['Nhiều hàm cùng tên nhưng khác danh sách tham số', 'Một hàm gọi chính nó', 'Hàm có quá nhiều dòng lệnh', 'Hàm không trả về gì'], correctIndex: 0, explanation: 'Overload: cùng tên hàm, khác kiểu/số lượng tham số; trình biên dịch chọn bản phù hợp.' },
  { id: 'q2', question: 'Mặc định C++ truyền đối số cho hàm theo cách nào?', options: ['Theo tham chiếu', 'Theo con trỏ', 'Theo giá trị (một bản sao)', 'Không truyền gì cả'], correctIndex: 2, explanation: 'Mặc định truyền theo giá trị: hàm nhận bản sao, không đổi được bản gốc.' },
  { id: 'q3', question: 'Điều kiện dừng của một hàm đệ quy factorial thường là?', options: ['Khi n lớn hơn 100', 'Khi n nhỏ hơn hoặc bằng 1 thì trả về 1', 'Không cần điều kiện dừng', 'Khi bộ nhớ đầy'], correctIndex: 1, explanation: 'Phải có trường hợp cơ sở (n <= 1 trả 1) để đệ quy dừng, tránh lặp vô hạn.' },
]);

const c3 = doc('pcp291-3-1-pointers-memory', '3.1 — Pointers, references & memory|||3.1 — Con trỏ, tham chiếu & quản lý bộ nhớ',
  'Con trỏ (địa chỉ, giải tham chiếu), tham chiếu (bí danh), stack so với heap, cấp phát động new/delete, và rò rỉ bộ nhớ (memory leak).',
  [[
    `<span class="eyebrow">PCP291 · Chapter 3 · Lesson 3.1</span>
<h2>Pointers, references &amp; memory</h2>
<h3>Pointers</h3>
<p>A <strong>pointer</strong> stores the <em>address</em> of another variable. <code>&amp;x</code> takes an address; <code>*p</code> <em>dereferences</em> — reads the value at that address.</p>
<h3>References</h3>
<p>A <strong>reference</strong> is an <em>alias</em> for an existing variable — another name for the same storage. It cannot be re-seated. References are the clean way to pass big objects without copying.</p>
<pre><code>int x = 42;
int* p = &amp;x;        // p holds the address of x
int&amp; r = x;         // r is an alias for x
std::cout &lt;&lt; *p;    // dereference -&gt; prints 42
r = 100;            // changes x through the alias
</code></pre>
<h3>Stack vs heap</h3>
<ul>
<li><strong>Stack</strong> — local variables; freed automatically when scope ends.</li>
<li><strong>Heap</strong> — allocated with <code>new</code>, lives until you <code>delete</code> it. Forgetting to free is a <strong>memory leak</strong>.</li>
</ul>
<pre><code>int* arr = new int[10];   // heap allocation
arr[0] = 5;
delete[] arr;             // MUST free, or it leaks
</code></pre>
<div class="callout"><span class="badge">Every new needs a delete</span> Manual memory is powerful but error-prone. Chapter 8's smart pointers automate the <code>delete</code> so leaks and double-frees become nearly impossible.</div>`,
    `<span class="eyebrow">PCP291 · Chương 3 · Bài 3.1</span>
<h2>Con trỏ, tham chiếu &amp; quản lý bộ nhớ</h2>
<h3>Con trỏ</h3>
<p><strong>Con trỏ</strong> lưu <em>địa chỉ</em> của một biến khác. <code>&amp;x</code> lấy địa chỉ; <code>*p</code> <em>giải tham chiếu</em> — đọc giá trị tại địa chỉ đó.</p>
<h3>Tham chiếu</h3>
<p><strong>Tham chiếu</strong> là một <em>bí danh</em> cho biến đã có — một tên khác cho cùng ô nhớ. Nó không thể trỏ lại chỗ khác. Tham chiếu là cách gọn để truyền đối tượng lớn mà không sao chép.</p>
<pre><code>int x = 42;
int* p = &amp;x;        // p giữ địa chỉ của x
int&amp; r = x;         // r là bí danh của x
std::cout &lt;&lt; *p;    // giải tham chiếu -&gt; in ra 42
r = 100;            // đổi x thông qua bí danh
</code></pre>
<h3>Stack so với heap</h3>
<ul>
<li><strong>Stack</strong> — biến cục bộ; tự giải phóng khi hết phạm vi.</li>
<li><strong>Heap</strong> — cấp bằng <code>new</code>, sống đến khi bạn <code>delete</code>. Quên giải phóng là <strong>rò rỉ bộ nhớ</strong>.</li>
</ul>
<pre><code>int* arr = new int[10];   // cấp phát trên heap
arr[0] = 5;
delete[] arr;             // BẮT BUỘC giải phóng, không thì rò rỉ
</code></pre>
<div class="callout"><span class="badge">Mỗi new cần một delete</span> Bộ nhớ thủ công mạnh nhưng dễ sai. Smart pointer ở Chương 8 tự động <code>delete</code> giúp, khiến rò rỉ và giải phóng hai lần gần như không thể xảy ra.</div>`,
  ]]);

const c3q = quiz('pcp291-quiz-3', 'Quiz 3 — Pointers & memory|||Quiz 3 — Con trỏ & bộ nhớ', [
  { id: 'q1', question: 'Toán tử * đứng trước một con trỏ (ví dụ *p) làm gì?', options: ['Lấy địa chỉ của biến', 'Giải tham chiếu: đọc giá trị tại địa chỉ con trỏ giữ', 'Nhân hai con trỏ', 'Xóa con trỏ'], correctIndex: 1, explanation: 'Toán tử * giải tham chiếu, truy cập giá trị tại địa chỉ; & mới là lấy địa chỉ.' },
  { id: 'q2', question: 'Bộ nhớ cấp phát bằng new nằm ở đâu và giải phóng thế nào?', options: ['Trên stack, tự giải phóng', 'Trên heap, phải giải phóng bằng delete', 'Trong CPU, không cần giải phóng', 'Trên stack, giải phóng bằng free'], correctIndex: 1, explanation: 'new cấp trên heap; phải delete (hoặc delete[]) thủ công nếu không sẽ rò rỉ.' },
  { id: 'q3', question: 'Rò rỉ bộ nhớ (memory leak) xảy ra khi nào?', options: ['Khi dùng quá nhiều biến cục bộ', 'Khi cấp phát trên heap mà quên giải phóng', 'Khi khai báo con trỏ null', 'Khi truyền tham chiếu'], correctIndex: 1, explanation: 'Quên delete vùng heap đã cấp khiến bộ nhớ không được thu hồi trong khi chương trình chạy.' },
]);

const c4 = doc('pcp291-4-1-classes-oop', '4.1 — Classes & object-oriented programming|||4.1 — Lớp & lập trình hướng đối tượng',
  'Lớp là gì (dữ liệu + phương thức), đóng gói (private/public), hàm khởi tạo (constructor) và hủy (destructor), getter/setter, con trỏ this.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 4 · Lesson 4.1</span>
<h2>Classes &amp; object-oriented programming</h2>
<h3>A class bundles data + behavior</h3>
<p>A <strong>class</strong> is a blueprint: it groups <em>data members</em> (state) and <em>member functions</em> (behavior). An <strong>object</strong> is one instance of that blueprint.</p>
<h3>Encapsulation</h3>
<p><strong>Encapsulation</strong> hides internal state behind <code>private</code> and exposes a controlled interface via <code>public</code> — you touch the data only through getters/setters that can validate.</p>
<h3>Constructor &amp; destructor</h3>
<ul>
<li><strong>Constructor</strong> runs when an object is created — it initializes members.</li>
<li><strong>Destructor</strong> (<code>~ClassName</code>) runs when the object is destroyed — it releases resources.</li>
</ul>
<pre><code>class Motor {
private:                              // encapsulated state
    int rpm;
public:
    Motor(int r) : rpm(r) {}         // constructor (init list)
    ~Motor() {}                      // destructor
    int getRpm() const { return rpm; }        // getter
    void setRpm(int r) {                       // setter (validates)
        if (r &gt;= 0) rpm = r;
    }
};

Motor m(3000);
m.setRpm(4500);
std::cout &lt;&lt; m.getRpm();   // 4500
</code></pre>
<div class="callout"><span class="badge">const member functions</span> Marking a getter <code>const</code> promises it will not modify the object — the compiler enforces it, and it lets you call the getter on read-only objects.</div>`,
    `<span class="eyebrow">PCP291 · Chương 4 · Bài 4.1</span>
<h2>Lớp &amp; lập trình hướng đối tượng</h2>
<h3>Lớp gói dữ liệu + hành vi</h3>
<p><strong>Lớp (class)</strong> là bản thiết kế: nó gom <em>thành viên dữ liệu</em> (trạng thái) và <em>hàm thành viên</em> (hành vi). <strong>Đối tượng</strong> là một thể hiện của bản thiết kế đó.</p>
<h3>Đóng gói</h3>
<p><strong>Đóng gói</strong> giấu trạng thái bên trong sau <code>private</code> và mở giao diện có kiểm soát qua <code>public</code> — bạn chạm dữ liệu chỉ qua getter/setter có thể kiểm hợp lệ.</p>
<h3>Hàm khởi tạo &amp; hủy</h3>
<ul>
<li><strong>Constructor</strong> chạy khi đối tượng được tạo — khởi tạo các thành viên.</li>
<li><strong>Destructor</strong> (<code>~TenLop</code>) chạy khi đối tượng bị hủy — giải phóng tài nguyên.</li>
</ul>
<pre><code>class Motor {
private:                              // trạng thái được đóng gói
    int rpm;
public:
    Motor(int r) : rpm(r) {}         // constructor (danh sách khởi tạo)
    ~Motor() {}                      // destructor
    int getRpm() const { return rpm; }        // getter
    void setRpm(int r) {                       // setter (kiểm hợp lệ)
        if (r &gt;= 0) rpm = r;
    }
};

Motor m(3000);
m.setRpm(4500);
std::cout &lt;&lt; m.getRpm();   // 4500
</code></pre>
<div class="callout"><span class="badge">Hàm thành viên const</span> Đánh dấu getter là <code>const</code> hứa rằng nó không sửa đối tượng — trình biên dịch bắt buộc điều đó, và cho phép gọi getter trên đối tượng chỉ đọc.</div>`,
  ]]);

const c4q = quiz('pcp291-quiz-4', 'Quiz 4 — Classes & OOP|||Quiz 4 — Lớp & OOP', [
  { id: 'q1', question: 'Đóng gói (encapsulation) trong C++ đạt được chủ yếu nhờ?', options: ['Từ khóa virtual', 'Che dữ liệu bằng private và mở giao diện qua public', 'Dùng con trỏ', 'Nạp chồng toán tử'], correctIndex: 1, explanation: 'Đóng gói: giấu trạng thái sau private, chỉ cho truy cập qua hàm public có kiểm soát.' },
  { id: 'q2', question: 'Hàm khởi tạo (constructor) chạy khi nào?', options: ['Khi chương trình kết thúc', 'Khi đối tượng bị hủy', 'Khi đối tượng được tạo ra', 'Chỉ khi gọi thủ công'], correctIndex: 2, explanation: 'Constructor chạy tự động lúc tạo đối tượng để khởi tạo các thành viên.' },
  { id: 'q3', question: 'Vai trò của hàm hủy (destructor, ký hiệu ~TenLop) là gì?', options: ['Khởi tạo dữ liệu', 'Giải phóng tài nguyên khi đối tượng bị hủy', 'Sao chép đối tượng', 'Trả về giá trị'], correctIndex: 1, explanation: 'Destructor chạy khi đối tượng bị hủy, thường để giải phóng tài nguyên đã cấp.' },
]);

const c5 = doc('pcp291-5-1-inheritance-polymorphism', '5.1 — Inheritance & polymorphism|||5.1 — Kế thừa & đa hình',
  'Kế thừa (tái dùng và mở rộng lớp), lớp cơ sở/dẫn xuất, hàm ảo (virtual) và override, đa hình lúc chạy, lớp trừu tượng (pure virtual), destructor ảo.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 5 · Lesson 5.1</span>
<h2>Inheritance &amp; polymorphism</h2>
<h3>Inheritance</h3>
<p><strong>Inheritance</strong> lets a <em>derived</em> class reuse and extend a <em>base</em> class. A <code>TempSensor</code> <strong>is-a</strong> <code>Sensor</code>, so it gets the base interface for free.</p>
<h3>Polymorphism</h3>
<p><strong>Polymorphism</strong> means one interface, many behaviors. A <code>virtual</code> function called through a base pointer dispatches to the <em>actual</em> object's override at run time — <strong>dynamic dispatch</strong>.</p>
<pre><code>class Sensor {
public:
    virtual double read() const = 0;   // pure virtual -&gt; abstract class
    virtual ~Sensor() {}               // virtual destructor!
};

class TempSensor : public Sensor {     // inheritance
public:
    double read() const override { return 25.0; }
};

Sensor* s = new TempSensor();
double v = s-&gt;read();   // dynamic dispatch -&gt; 25.0
delete s;              // virtual dtor frees TempSensor correctly
</code></pre>
<ul>
<li><strong>= 0</strong> makes a <em>pure virtual</em> function — the class becomes <strong>abstract</strong> (cannot be instantiated).</li>
<li><code>override</code> asks the compiler to verify you really are overriding a base function.</li>
</ul>
<div class="callout"><span class="badge">Always a virtual destructor</span> When you delete a derived object through a base pointer, the base destructor MUST be virtual — otherwise only the base part is destroyed and resources leak.</div>`,
    `<span class="eyebrow">PCP291 · Chương 5 · Bài 5.1</span>
<h2>Kế thừa &amp; đa hình</h2>
<h3>Kế thừa</h3>
<p><strong>Kế thừa</strong> cho lớp <em>dẫn xuất</em> tái dùng và mở rộng lớp <em>cơ sở</em>. <code>TempSensor</code> <strong>là một</strong> <code>Sensor</code>, nên nó có sẵn giao diện của lớp cơ sở.</p>
<h3>Đa hình</h3>
<p><strong>Đa hình</strong> nghĩa là một giao diện, nhiều hành vi. Một hàm <code>virtual</code> gọi qua con trỏ lớp cơ sở sẽ điều hướng tới bản override của <em>đối tượng thực</em> lúc chạy — <strong>điều phối động</strong>.</p>
<pre><code>class Sensor {
public:
    virtual double read() const = 0;   // thuần ảo -&gt; lớp trừu tượng
    virtual ~Sensor() {}               // destructor ảo!
};

class TempSensor : public Sensor {     // kế thừa
public:
    double read() const override { return 25.0; }
};

Sensor* s = new TempSensor();
double v = s-&gt;read();   // điều phối động -&gt; 25.0
delete s;              // dtor ảo hủy TempSensor đúng cách
</code></pre>
<ul>
<li><strong>= 0</strong> tạo hàm <em>thuần ảo</em> — lớp trở thành <strong>trừu tượng</strong> (không thể tạo thể hiện).</li>
<li><code>override</code> yêu cầu trình biên dịch kiểm rằng bạn thực sự đang ghi đè một hàm của lớp cơ sở.</li>
</ul>
<div class="callout"><span class="badge">Luôn có destructor ảo</span> Khi bạn delete một đối tượng dẫn xuất qua con trỏ lớp cơ sở, destructor cơ sở BẮT BUỘC phải là virtual — nếu không chỉ phần cơ sở bị hủy và tài nguyên rò rỉ.</div>`,
  ]]);

const c5q = quiz('pcp291-quiz-5', 'Quiz 5 — Inheritance & polymorphism|||Quiz 5 — Kế thừa & đa hình', [
  { id: 'q1', question: 'Đa hình lúc chạy (runtime polymorphism) trong C++ dựa vào?', options: ['Hàm ảo (virtual) gọi qua con trỏ/tham chiếu lớp cơ sở', 'Nạp chồng hàm', 'Template', 'Biến toàn cục'], correctIndex: 0, explanation: 'Hàm virtual cho điều phối động: gọi qua con trỏ cơ sở sẽ chạy bản override của đối tượng thực.' },
  { id: 'q2', question: 'Một hàm thuần ảo (khai báo = 0) khiến lớp trở thành?', options: ['Lớp cuối cùng không kế thừa được', 'Lớp trừu tượng, không thể tạo thể hiện trực tiếp', 'Lớp bạn (friend)', 'Lớp template'], correctIndex: 1, explanation: 'Có hàm thuần ảo thì lớp là abstract, phải kế thừa và override mới dùng được.' },
  { id: 'q3', question: 'Vì sao destructor của lớp cơ sở nên là virtual?', options: ['Để chạy nhanh hơn', 'Để khi delete qua con trỏ cơ sở, phần dẫn xuất cũng được hủy đúng', 'Để tiết kiệm bộ nhớ mã', 'Vì bắt buộc theo cú pháp'], correctIndex: 1, explanation: 'Destructor ảo đảm bảo hủy đúng đối tượng dẫn xuất khi xóa qua con trỏ lớp cơ sở, tránh rò rỉ.' },
]);

const c6 = doc('pcp291-6-1-templates', '6.1 — Templates & generic programming|||6.1 — Template & lập trình tổng quát',
  'Template hàm và template lớp, tham số kiểu (typename), suy luận kiểu khi gọi, vì sao template tránh lặp mã và giữ an toàn kiểu.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 6 · Lesson 6.1</span>
<h2>Templates &amp; generic programming</h2>
<h3>Write once, work for any type</h3>
<p>A <strong>template</strong> lets you write code parameterized by <em>type</em>. Instead of one <code>maxInt</code> and one <code>maxDouble</code>, you write one <code>maxOf&lt;T&gt;</code> and the compiler generates a version per type used — with full <strong>type safety</strong> and no runtime cost.</p>
<pre><code>template &lt;typename T&gt;
T maxOf(T a, T b) {
    return (a &gt; b) ? a : b;
}

int    i = maxOf(3, 7);        // T deduced as int
double d = maxOf(2.5, 1.0);    // T deduced as double
</code></pre>
<h3>Class templates</h3>
<p>Classes can be templated too — this is exactly how the STL containers (Chapter 7) are built.</p>
<pre><code>template &lt;typename T&gt;
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
};

Box&lt;int&gt; bi(42);
Box&lt;double&gt; bd(3.14);
</code></pre>
<div class="callout"><span class="badge">Generic vs duplicated</span> Templates replace copy-pasted, type-specific functions with one definition. The compiler stamps out (instantiates) a concrete version for each type — you keep DRY code and static type checking.</div>`,
    `<span class="eyebrow">PCP291 · Chương 6 · Bài 6.1</span>
<h2>Template &amp; lập trình tổng quát</h2>
<h3>Viết một lần, dùng cho mọi kiểu</h3>
<p><strong>Template</strong> cho phép viết mã tham số hóa theo <em>kiểu</em>. Thay vì một <code>maxInt</code> và một <code>maxDouble</code>, bạn viết một <code>maxOf&lt;T&gt;</code> và trình biên dịch sinh ra bản cho mỗi kiểu dùng tới — với <strong>an toàn kiểu</strong> đầy đủ và không tốn chi phí lúc chạy.</p>
<pre><code>template &lt;typename T&gt;
T maxOf(T a, T b) {
    return (a &gt; b) ? a : b;
}

int    i = maxOf(3, 7);        // T suy ra là int
double d = maxOf(2.5, 1.0);    // T suy ra là double
</code></pre>
<h3>Template lớp</h3>
<p>Lớp cũng có thể là template — đây chính là cách các container của STL (Chương 7) được xây.</p>
<pre><code>template &lt;typename T&gt;
class Box {
    T value;
public:
    Box(T v) : value(v) {}
    T get() const { return value; }
};

Box&lt;int&gt; bi(42);
Box&lt;double&gt; bd(3.14);
</code></pre>
<div class="callout"><span class="badge">Tổng quát so với lặp mã</span> Template thay các hàm sao chép theo từng kiểu bằng một định nghĩa duy nhất. Trình biên dịch dập ra (khởi tạo) một bản cụ thể cho mỗi kiểu — bạn giữ mã DRY và vẫn kiểm kiểu tĩnh.</div>`,
  ]]);

const c6q = quiz('pcp291-quiz-6', 'Quiz 6 — Templates|||Quiz 6 — Template', [
  { id: 'q1', question: 'Mục đích chính của template trong C++ là gì?', options: ['Chạy chương trình nhanh hơn lúc khởi động', 'Viết mã tổng quát dùng cho nhiều kiểu mà vẫn an toàn kiểu', 'Ẩn dữ liệu private', 'Thay thế cho con trỏ'], correctIndex: 1, explanation: 'Template cho phép viết một lần, dùng cho nhiều kiểu; trình biên dịch sinh bản cụ thể cho từng kiểu.' },
  { id: 'q2', question: 'Khi gọi maxOf(2.5, 1.0) với template hàm, kiểu T được xác định thế nào?', options: ['Luôn là int', 'Được suy luận là double từ đối số', 'Phải khai báo thủ công mỗi lần', 'Do người dùng nhập lúc chạy'], correctIndex: 1, explanation: 'Trình biên dịch suy luận T từ kiểu của đối số truyền vào (ở đây là double).' },
  { id: 'q3', question: 'Template được xử lý ở thời điểm nào?', options: ['Lúc chạy chương trình', 'Lúc biên dịch, trình biên dịch dập ra bản cụ thể cho mỗi kiểu', 'Khi cài đặt hệ điều hành', 'Không bao giờ, chỉ là chú thích'], correctIndex: 1, explanation: 'Template được khởi tạo (instantiate) lúc biên dịch, không tốn chi phí điều phối lúc chạy.' },
]);

const c7 = doc('pcp291-7-1-stl', '7.1 — The STL: containers, iterators, algorithms|||7.1 — STL: container, iterator, thuật toán',
  'Thư viện chuẩn STL: container (vector, map, set), iterator để duyệt, và thuật toán (sort, find). Cách chúng ghép với nhau và range-for.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 7 · Lesson 7.1</span>
<h2>The STL: containers, iterators, algorithms</h2>
<p class="lead">The <strong>Standard Template Library</strong> is C++'s ready-made toolbox of data structures and algorithms, all built from templates. Three pieces click together: <strong>containers</strong> hold data, <strong>iterators</strong> walk over it, <strong>algorithms</strong> operate through iterators.</p>
<h3>Containers</h3>
<ul>
<li><code>std::vector&lt;T&gt;</code> — a dynamic array (grows on demand).</li>
<li><code>std::map&lt;K,V&gt;</code> — key/value pairs, sorted by key.</li>
<li><code>std::set&lt;T&gt;</code> — unique, sorted elements.</li>
</ul>
<h3>Iterators &amp; algorithms</h3>
<pre><code>#include &lt;vector&gt;
#include &lt;algorithm&gt;

std::vector&lt;int&gt; v = {5, 2, 8, 1};
v.push_back(9);                    // now {5,2,8,1,9}
std::sort(v.begin(), v.end());     // algorithm via iterators

for (auto it = v.begin(); it != v.end(); ++it)
    std::cout &lt;&lt; *it &lt;&lt; " ";       // iterator: *it is the element

for (int x : v)                    // range-for (cleaner)
    std::cout &lt;&lt; x &lt;&lt; " ";

auto found = std::find(v.begin(), v.end(), 8);
if (found != v.end()) std::cout &lt;&lt; "found 8";
</code></pre>
<div class="callout"><span class="badge">Don't reinvent it</span> Before writing a loop by hand, check the STL — <code>sort</code>, <code>find</code>, <code>count</code>, <code>accumulate</code> and dozens more are tested, fast, and expressive. Prefer a container + algorithm over raw arrays and manual loops.</div>`,
    `<span class="eyebrow">PCP291 · Chương 7 · Bài 7.1</span>
<h2>STL: container, iterator, thuật toán</h2>
<p class="lead"><strong>Thư viện template chuẩn (STL)</strong> là hộp công cụ sẵn có của C++ gồm cấu trúc dữ liệu và thuật toán, tất cả dựng từ template. Ba mảnh khớp vào nhau: <strong>container</strong> chứa dữ liệu, <strong>iterator</strong> duyệt qua nó, <strong>thuật toán</strong> làm việc thông qua iterator.</p>
<h3>Container</h3>
<ul>
<li><code>std::vector&lt;T&gt;</code> — mảng động (tự nới rộng).</li>
<li><code>std::map&lt;K,V&gt;</code> — cặp khóa/giá trị, sắp theo khóa.</li>
<li><code>std::set&lt;T&gt;</code> — phần tử duy nhất, đã sắp xếp.</li>
</ul>
<h3>Iterator &amp; thuật toán</h3>
<pre><code>#include &lt;vector&gt;
#include &lt;algorithm&gt;

std::vector&lt;int&gt; v = {5, 2, 8, 1};
v.push_back(9);                    // giờ là {5,2,8,1,9}
std::sort(v.begin(), v.end());     // thuật toán qua iterator

for (auto it = v.begin(); it != v.end(); ++it)
    std::cout &lt;&lt; *it &lt;&lt; " ";       // iterator: *it là phần tử

for (int x : v)                    // range-for (gọn hơn)
    std::cout &lt;&lt; x &lt;&lt; " ";

auto found = std::find(v.begin(), v.end(), 8);
if (found != v.end()) std::cout &lt;&lt; "tim thay 8";
</code></pre>
<div class="callout"><span class="badge">Đừng phát minh lại</span> Trước khi tự viết vòng lặp, hãy xem STL — <code>sort</code>, <code>find</code>, <code>count</code>, <code>accumulate</code> và hàng chục hàm khác đều đã kiểm thử, nhanh và diễn đạt tốt. Ưu tiên container + thuật toán hơn mảng thô và vòng lặp thủ công.</div>`,
  ]]);

const c7q = quiz('pcp291-quiz-7', 'Quiz 7 — STL|||Quiz 7 — STL', [
  { id: 'q1', question: 'std::vector là loại cấu trúc dữ liệu gì?', options: ['Mảng động tự nới rộng khi thêm phần tử', 'Danh sách khóa-giá trị', 'Cây nhị phân cân bằng', 'Ngăn xếp cố định kích thước'], correctIndex: 0, explanation: 'std::vector là mảng động, có thể push_back để lớn dần khi cần.' },
  { id: 'q2', question: 'Trong STL, iterator dùng để làm gì?', options: ['Cấp phát bộ nhớ', 'Duyệt qua các phần tử của container và cho thuật toán truy cập', 'Đóng gói dữ liệu private', 'Biên dịch mã'], correctIndex: 1, explanation: 'Iterator là cách duyệt phần tử; các thuật toán như sort/find nhận cặp iterator begin/end.' },
  { id: 'q3', question: 'std::sort(v.begin(), v.end()) làm gì?', options: ['Xóa toàn bộ phần tử', 'Sắp xếp các phần tử trong khoảng iterator được truyền', 'Đảo ngược con trỏ', 'Sao chép vector'], correctIndex: 1, explanation: 'sort là thuật toán STL, sắp xếp các phần tử trong khoảng [begin, end).' },
]);

const c8 = doc('pcp291-8-1-modern-cpp', '8.1 — Modern C++ & automotive embedded|||8.1 — C++ hiện đại & nhúng ô tô',
  'C++ hiện đại: smart pointer (unique_ptr/shared_ptr), move semantics, lambda, và RAII; vì sao RAII và không GC làm C++ hợp cho ECU/AUTOSAR ô tô.',
  [[
    `<span class="eyebrow">PCP291 · Chapter 8 · Lesson 8.1</span>
<h2>Modern C++ &amp; automotive embedded</h2>
<h3>RAII — the big idea</h3>
<p><strong>RAII</strong> (Resource Acquisition Is Initialization) ties a resource's lifetime to an object's scope: acquire in the constructor, release in the destructor. When the object goes out of scope, cleanup happens automatically — no manual <code>delete</code>, no leaks.</p>
<h3>Smart pointers</h3>
<ul>
<li><code>std::unique_ptr&lt;T&gt;</code> — sole owner; frees automatically. Cannot be copied, only moved.</li>
<li><code>std::shared_ptr&lt;T&gt;</code> — shared ownership via reference counting.</li>
</ul>
<h3>Move semantics &amp; lambdas</h3>
<pre><code>#include &lt;memory&gt;

auto p = std::make_unique&lt;Motor&gt;(3000);  // RAII: auto-freed
std::vector&lt;int&gt; a = {1, 2, 3};
std::vector&lt;int&gt; b = std::move(a);        // transfer, no deep copy

auto square = [](int n) { return n * n; }; // lambda (anonymous fn)
int r = square(5);                          // 25
</code></pre>
<p><strong>Move semantics</strong> transfers ownership of resources instead of copying them — vital for performance. A <strong>lambda</strong> is an inline anonymous function, often passed to STL algorithms.</p>
<h3>Why C++ owns automotive</h3>
<p>Cars need <strong>deterministic timing</strong> and tight memory — a garbage collector's unpredictable pauses are unacceptable when braking. C++ gives bare-metal performance <em>plus</em> RAII safety, which is why <strong>AUTOSAR Adaptive</strong> and most <strong>ECUs</strong> are written in it.</p>
<div class="callout"><span class="badge">Prefer smart pointers</span> In modern C++ you rarely write raw <code>new</code>/<code>delete</code>. Reach for <code>make_unique</code>/<code>make_shared</code> — RAII then guarantees release even when exceptions are thrown.</div>`,
    `<span class="eyebrow">PCP291 · Chương 8 · Bài 8.1</span>
<h2>C++ hiện đại &amp; nhúng ô tô</h2>
<h3>RAII — ý tưởng cốt lõi</h3>
<p><strong>RAII</strong> (Giành tài nguyên là khởi tạo) gắn vòng đời tài nguyên vào phạm vi của một đối tượng: giành trong constructor, trả trong destructor. Khi đối tượng hết phạm vi, dọn dẹp xảy ra tự động — không <code>delete</code> thủ công, không rò rỉ.</p>
<h3>Smart pointer</h3>
<ul>
<li><code>std::unique_ptr&lt;T&gt;</code> — chủ sở hữu duy nhất; tự giải phóng. Không sao chép được, chỉ move.</li>
<li><code>std::shared_ptr&lt;T&gt;</code> — sở hữu chung nhờ đếm tham chiếu.</li>
</ul>
<h3>Move semantics &amp; lambda</h3>
<pre><code>#include &lt;memory&gt;

auto p = std::make_unique&lt;Motor&gt;(3000);  // RAII: tự giải phóng
std::vector&lt;int&gt; a = {1, 2, 3};
std::vector&lt;int&gt; b = std::move(a);        // chuyển giao, không sao chép sâu

auto square = [](int n) { return n * n; }; // lambda (hàm vô danh)
int r = square(5);                          // 25
</code></pre>
<p><strong>Move semantics</strong> chuyển giao quyền sở hữu tài nguyên thay vì sao chép — thiết yếu cho hiệu năng. <strong>Lambda</strong> là hàm vô danh viết tại chỗ, thường truyền cho thuật toán STL.</p>
<h3>Vì sao C++ ngự trị ô tô</h3>
<p>Ô tô cần <strong>thời gian tất định</strong> và bộ nhớ chặt chẽ — những lần khựng khó lường của bộ dọn rác là không chấp nhận được khi đang phanh. C++ cho hiệu năng sát phần cứng <em>cộng</em> an toàn nhờ RAII, đó là lý do <strong>AUTOSAR Adaptive</strong> và hầu hết <strong>ECU</strong> đều viết bằng nó.</p>
<div class="callout"><span class="badge">Ưu tiên smart pointer</span> Trong C++ hiện đại bạn hiếm khi viết <code>new</code>/<code>delete</code> thô. Hãy dùng <code>make_unique</code>/<code>make_shared</code> — RAII khi đó bảo đảm giải phóng ngay cả khi có ngoại lệ ném ra.</div>`,
  ]]);

const c8q = quiz('pcp291-quiz-8', 'Quiz 8 — Modern C++|||Quiz 8 — C++ hiện đại', [
  { id: 'q1', question: 'RAII trong C++ nghĩa là gì?', options: ['Cấp phát mọi thứ trên heap', 'Gắn vòng đời tài nguyên vào phạm vi đối tượng: giành ở constructor, trả ở destructor', 'Luôn dùng con trỏ thô', 'Chạy bộ dọn rác định kỳ'], correctIndex: 1, explanation: 'RAII: tài nguyên được giành khi khởi tạo và tự trả khi đối tượng hết phạm vi, tránh rò rỉ.' },
  { id: 'q2', question: 'std::unique_ptr khác con trỏ thô ở điểm nào?', options: ['Chạy chậm hơn nhiều', 'Tự động giải phóng bộ nhớ khi hết phạm vi, không cần delete thủ công', 'Không thể trỏ tới đối tượng', 'Phải gọi free()'], correctIndex: 1, explanation: 'unique_ptr sở hữu độc quyền và tự delete khi hủy, nhờ RAII nên không cần delete tay.' },
  { id: 'q3', question: 'Vì sao C++ được ưa dùng cho phần mềm nhúng ô tô (ECU)?', options: ['Vì nó có bộ dọn rác mạnh', 'Vì hiệu năng tất định, sát phần cứng và an toàn tài nguyên nhờ RAII, không có khựng do GC', 'Vì cú pháp đơn giản nhất', 'Vì không cần biên dịch'], correctIndex: 1, explanation: 'Ô tô cần thời gian tất định; C++ cho hiệu năng dự đoán được, không có khựng của bộ dọn rác.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'PCP291',
    slug: 'pcp291-c-programming',
    title: 'C++ Programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PCP291.webp',
    shortDescription: 'C++ from basics to modern — types & I/O, control flow & functions, pointers & memory, classes & OOP, inheritance & polymorphism, templates, STL, and modern C++ (smart pointers, move, lambdas, RAII). Bilingual, examples & quizzes.|||C++ từ cơ bản đến hiện đại — kiểu & I/O, luồng & hàm, con trỏ & bộ nhớ, lớp & OOP, kế thừa & đa hình, template, STL, C++ hiện đại (smart pointer, move, lambda, RAII). Song ngữ, ví dụ & quiz.',
    description: 'Môn <strong>PCP291 — C++ Programming</strong> (kỳ 2, ngành Kỹ thuật phần mềm ô tô) dạy <strong>lập trình C++</strong> từ gốc. Từ <strong>nền tảng</strong> (biến, kiểu, I/O, biên dịch, điều khiển luồng &amp; hàm) → <strong>con trỏ, tham chiếu &amp; bộ nhớ</strong> → <strong>OOP</strong> (lớp, đóng gói, kế thừa &amp; đa hình) → <strong>template &amp; STL</strong> → <strong>C++ hiện đại</strong> (smart pointer, move, lambda, RAII) và ứng dụng nhúng ô tô. Bám các giáo trình chuẩn (Stroustrup, Lippman, Meyers, cppreference), song ngữ, nhiều ví dụ C++, quiz mỗi chương.',
    whatYouLearn: 'Biến & kiểu, I/O (cin/cout), biên dịch g++; điều khiển luồng & hàm (overload, đối số mặc định, đệ quy); con trỏ, tham chiếu, stack/heap, new/delete, rò rỉ bộ nhớ; lớp & OOP (đóng gói, constructor/destructor); kế thừa & đa hình (virtual, override, lớp trừu tượng); template hàm & lớp; STL (vector/map/set, iterator, sort/find); C++ hiện đại (unique_ptr/shared_ptr, move, lambda, RAII) & vì sao C++ hợp nhúng ô tô.',
    requirements: 'Biết lập trình cơ bản (biến, vòng lặp, hàm) ở một ngôn ngữ bất kỳ là lợi thế. Cần trình biên dịch C++ (g++/clang) hoặc dùng trình biên dịch trực tuyến (OnlineGDB, godbolt.org).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn (Stroustrup, Lippman, Meyers), cppreference, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'C++ là gì, biên dịch, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nhập môn & I/O|||Chapter 1 — Intro & I/O', description: 'Biến, kiểu, cin/cout, biên dịch g++.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Luồng & hàm|||Chapter 2 — Control flow & functions', description: 'if/switch, for/while, hàm, overload, đệ quy.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Con trỏ & bộ nhớ|||Chapter 3 — Pointers & memory', description: 'Con trỏ, tham chiếu, stack/heap, new/delete.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lớp & OOP|||Chapter 4 — Classes & OOP', description: 'Đóng gói, constructor/destructor, getter/setter.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kế thừa & đa hình|||Chapter 5 — Inheritance & polymorphism', description: 'virtual, override, lớp trừu tượng, dtor ảo.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Template|||Chapter 6 — Templates', description: 'Template hàm & lớp, suy luận kiểu, lập trình tổng quát.', lessons: [c6, c6q] },
    { title: 'Chương 7 — STL|||Chapter 7 — The STL', description: 'vector/map/set, iterator, sort/find, range-for.', lessons: [c7, c7q] },
    { title: 'Chương 8 — C++ hiện đại & nhúng ô tô|||Chapter 8 — Modern C++ & automotive', description: 'Smart pointer, move, lambda, RAII, AUTOSAR/ECU.', lessons: [c8, c8q] },
  ],
};
