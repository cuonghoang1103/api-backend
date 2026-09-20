/**
 * APO202 — Advanced Python with OOP (Python nâng cao với Lập trình hướng đối
 * tượng). Ngành Khoa học Máy tính, kỳ 2, FPTU. Giáo trình tham khảo: Fluent
 * Python (Ramalho), Python Cookbook (Beazley/Jones), Effective Python
 * (Slatkin), docs.python.org. Song ngữ VI+EN, nhiều ví dụ Python, quiz/chương.
 * ⚠️ KHÔNG backtick lồng / ${...}; "\n" trong bi giữ nguyên; escape < > & trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('apo202-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo (Fluent Python, Python Cookbook, Effective Python), tài liệu chính thức docs.python.org, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">APO202 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything for <strong>Advanced Python with OOP</strong> — the data model, classes and the four pillars, inheritance and MRO, decorators, generators, functional style, type hints and testing — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for APO202 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/" target="_blank" rel="noopener"><em>Fluent Python</em> (2nd ed.) — Luciano Ramalho</a> — the data model &amp; idiomatic OOP</li>
<li><a href="https://www.oreilly.com/library/view/python-cookbook-3rd/9781449357337/" target="_blank" rel="noopener"><em>Python Cookbook</em> (3rd ed.) — Beazley &amp; Jones</a> — recipes &amp; patterns</li>
<li><a href="https://effectivepython.com/" target="_blank" rel="noopener"><em>Effective Python</em> — Brett Slatkin</a> — 90 ways to write better Python</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.python.org/3/" target="_blank" rel="noopener">docs.python.org — the official Python documentation</a></li>
<li><a href="https://docs.python.org/3/reference/datamodel.html" target="_blank" rel="noopener">The Python Data Model (language reference)</a></li>
<li><a href="https://peps.python.org/pep-0008/" target="_blank" rel="noopener">PEP 8 — Style Guide for Python Code</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@ArjanCodes" target="_blank" rel="noopener">ArjanCodes</a> — software design &amp; OOP in Python</li>
<li><a href="https://www.youtube.com/@mCoding" target="_blank" rel="noopener">mCoding</a> — deep dives into how Python really works</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://docs.pytest.org/" target="_blank" rel="noopener">pytest</a> — the de-facto testing framework</li>
<li><a href="https://mypy.readthedocs.io/" target="_blank" rel="noopener">mypy</a> — static type checker for type hints</li>
<li><a href="https://docs.astral.sh/ruff/" target="_blank" rel="noopener">Ruff</a> — fast linter &amp; formatter (PEP 8)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — the data model &amp; dunder methods, classes and the four OOP pillars.</li>
<li><strong>Design</strong> — inheritance, MRO, ABCs, properties, descriptors and decorators.</li>
<li><strong>Idioms</strong> — iterators, generators, context managers, functional style and type hints.</li>
<li><strong>Professional</strong> — pytest, packaging, PEP 8 and the SOLID principles.</li>
</ol></div>`,
    `<span class="eyebrow">APO202 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ cho <strong>Python nâng cao với OOP</strong> — mô hình dữ liệu, lớp và bốn trụ cột, kế thừa và MRO, decorator, generator, phong cách hàm, type hints và kiểm thử — gom về một chỗ. Slide &amp; giáo trình chính thức FPTU nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của APO202 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/" target="_blank" rel="noopener"><em>Fluent Python</em> (tái bản 2) — Luciano Ramalho</a> — mô hình dữ liệu &amp; OOP thuần Python</li>
<li><a href="https://www.oreilly.com/library/view/python-cookbook-3rd/9781449357337/" target="_blank" rel="noopener"><em>Python Cookbook</em> (tái bản 3) — Beazley &amp; Jones</a> — công thức &amp; mẫu thiết kế</li>
<li><a href="https://effectivepython.com/" target="_blank" rel="noopener"><em>Effective Python</em> — Brett Slatkin</a> — 90 cách viết Python tốt hơn</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.python.org/3/" target="_blank" rel="noopener">docs.python.org — tài liệu Python chính thức</a></li>
<li><a href="https://docs.python.org/3/reference/datamodel.html" target="_blank" rel="noopener">Mô hình dữ liệu Python (tham chiếu ngôn ngữ)</a></li>
<li><a href="https://peps.python.org/pep-0008/" target="_blank" rel="noopener">PEP 8 — Hướng dẫn phong cách viết mã Python</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@ArjanCodes" target="_blank" rel="noopener">ArjanCodes</a> — thiết kế phần mềm &amp; OOP trong Python</li>
<li><a href="https://www.youtube.com/@mCoding" target="_blank" rel="noopener">mCoding</a> — mổ xẻ Python hoạt động thực sự thế nào</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://docs.pytest.org/" target="_blank" rel="noopener">pytest</a> — framework kiểm thử phổ biến nhất</li>
<li><a href="https://mypy.readthedocs.io/" target="_blank" rel="noopener">mypy</a> — kiểm tra kiểu tĩnh cho type hints</li>
<li><a href="https://docs.astral.sh/ruff/" target="_blank" rel="noopener">Ruff</a> — linter &amp; formatter tốc độ cao (PEP 8)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — mô hình dữ liệu &amp; dunder methods, lớp và bốn trụ cột OOP.</li>
<li><strong>Thiết kế</strong> — kế thừa, MRO, ABC, property, descriptor và decorator.</li>
<li><strong>Thành ngữ</strong> — iterator, generator, context manager, phong cách hàm và type hints.</li>
<li><strong>Chuyên nghiệp</strong> — pytest, đóng gói, PEP 8 và các nguyên lý SOLID.</li>
</ol></div>`,
  ]]);

const intro = doc('apo202-0-1-overview', 'Course overview: Advanced Python with OOP|||Tổng quan: Python nâng cao với OOP',
  'Vì sao học Python nâng cao; "mọi thứ là đối tượng"; OOP giải quyết gì; lộ trình 8 chương: mô hình dữ liệu → lớp & trụ cột → kế thừa/MRO/ABC → property/descriptor/decorator → iterator/generator/context manager → ngoại lệ/package → functional & type hints → testing & đóng gói.',
  [[
    `<span class="eyebrow">APO202 · Lesson 0.1 · Overview</span>
<h2>Advanced Python with OOP</h2>
<p class="lead">This course takes you from "I can write Python scripts" to <strong>designing clean, idiomatic Python programs with objects</strong>. You will master the Python <strong>data model</strong>, the four pillars of OOP as Python actually expresses them, and the professional tools — decorators, generators, type hints and pytest — used in real codebases.</p>
<h3>Everything is an object</h3>
<p>In Python, integers, functions, classes and modules are all <strong>objects</strong> with a type and attributes. Understanding this uniform model is the key that unlocks the language's power.</p>
<pre><code>&gt;&gt;&gt; x = 42
&gt;&gt;&gt; type(x)
&lt;class 'int'&gt;
&gt;&gt;&gt; isinstance(x, object)
True
&gt;&gt;&gt; (2).__add__(3)     # even '+' is a method call
5
</code></pre>
<h3>Roadmap</h3>
<p>Data model &amp; dunder methods → classes &amp; the four pillars → inheritance, polymorphism, MRO &amp; ABCs → properties, descriptors &amp; decorators → iterators, generators &amp; context managers → exceptions, packages &amp; venv → functional Python &amp; type hints → testing (pytest), packaging &amp; SOLID. Bilingual, with runnable examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">APO202 · Bài 0.1 · Tổng quan</span>
<h2>Python nâng cao với OOP</h2>
<p class="lead">Môn này đưa bạn từ "viết được script Python" đến <strong>thiết kế chương trình Python sạch, thuần Python bằng đối tượng</strong>. Bạn sẽ nắm vững <strong>mô hình dữ liệu</strong> của Python, bốn trụ cột OOP theo đúng cách Python thể hiện, và các công cụ chuyên nghiệp — decorator, generator, type hints và pytest — dùng trong mã nguồn thật.</p>
<h3>Mọi thứ đều là đối tượng</h3>
<p>Trong Python, số nguyên, hàm, lớp và module đều là <strong>đối tượng</strong> có kiểu và thuộc tính. Hiểu mô hình thống nhất này chính là chìa khoá mở ra sức mạnh của ngôn ngữ.</p>
<pre><code>&gt;&gt;&gt; x = 42
&gt;&gt;&gt; type(x)
&lt;class 'int'&gt;
&gt;&gt;&gt; isinstance(x, object)
True
&gt;&gt;&gt; (2).__add__(3)     # ngay cả '+' cũng là lời gọi method
5
</code></pre>
<h3>Lộ trình</h3>
<p>Mô hình dữ liệu &amp; dunder methods → lớp &amp; bốn trụ cột → kế thừa, đa hình, MRO &amp; ABC → property, descriptor &amp; decorator → iterator, generator &amp; context manager → ngoại lệ, package &amp; venv → functional Python &amp; type hints → kiểm thử (pytest), đóng gói &amp; SOLID. Song ngữ, có ví dụ chạy được và một quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('apo202-1-1-data-model', '1.1 — Python quick review & the data model|||1.1 — Ôn nhanh Python & mô hình dữ liệu',
  'Ôn kiểu dữ liệu, tham chiếu & tính bất biến; "mọi thứ là đối tượng"; mô hình dữ liệu và các dunder methods (__init__, __repr__, __str__, __len__, __eq__) biến lớp tự viết thành công dân hạng nhất.',
  [[
    `<span class="eyebrow">APO202 · Chapter 1 · Lesson 1.1</span>
<h2>Python quick review &amp; the data model</h2>
<h3>Objects, references &amp; mutability</h3>
<ul>
<li>A <strong>variable</strong> is a name bound to an object, not a box holding a value. Assignment binds a name; it never copies.</li>
<li><strong>Immutable</strong> types (int, str, tuple, frozenset) cannot change in place; <strong>mutable</strong> ones (list, dict, set) can.</li>
<li><code>is</code> compares identity (same object); <code>==</code> compares value.</li>
</ul>
<h3>The data model &amp; dunder methods</h3>
<p>Python's power comes from the <strong>data model</strong>: your classes plug into language features by implementing special "dunder" (double-underscore) methods. The interpreter calls them for you.</p>
<pre><code>class Vector:
    def __init__(self, x, y):     # constructor
        self.x, self.y = x, y

    def __repr__(self):           # unambiguous, for developers
        return f"Vector({self.x}, {self.y})"

    def __eq__(self, other):      # powers ==
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):     # powers +
        return Vector(self.x + other.x, self.y + other.y)

v = Vector(1, 2) + Vector(3, 4)
print(v)                          # Vector(4, 6)  -&gt; uses __repr__
</code></pre>
<div class="callout"><span class="badge">__repr__ vs __str__</span> <code>__repr__</code> is for developers (unambiguous, ideally reproduces the object); <code>__str__</code> is for end users (readable). If you write only one, write <code>__repr__</code> — <code>str()</code> falls back to it.</div>`,
    `<span class="eyebrow">APO202 · Chương 1 · Bài 1.1</span>
<h2>Ôn nhanh Python &amp; mô hình dữ liệu</h2>
<h3>Đối tượng, tham chiếu &amp; tính khả biến</h3>
<ul>
<li>Một <strong>biến</strong> là một cái tên trỏ tới đối tượng, không phải cái hộp chứa giá trị. Phép gán chỉ gắn tên; nó không sao chép.</li>
<li>Kiểu <strong>bất biến</strong> (int, str, tuple, frozenset) không thể đổi tại chỗ; kiểu <strong>khả biến</strong> (list, dict, set) thì có.</li>
<li><code>is</code> so sánh danh tính (cùng một đối tượng); <code>==</code> so sánh giá trị.</li>
</ul>
<h3>Mô hình dữ liệu &amp; dunder methods</h3>
<p>Sức mạnh của Python đến từ <strong>mô hình dữ liệu</strong>: lớp của bạn cắm vào các tính năng ngôn ngữ bằng cách hiện thực các method đặc biệt "dunder" (hai gạch dưới). Trình thông dịch sẽ tự gọi chúng.</p>
<pre><code>class Vector:
    def __init__(self, x, y):     # hàm khởi tạo
        self.x, self.y = x, y

    def __repr__(self):           # rõ ràng, cho lập trình viên
        return f"Vector({self.x}, {self.y})"

    def __eq__(self, other):      # cấp sức cho ==
        return (self.x, self.y) == (other.x, other.y)

    def __add__(self, other):     # cấp sức cho +
        return Vector(self.x + other.x, self.y + other.y)

v = Vector(1, 2) + Vector(3, 4)
print(v)                          # Vector(4, 6)  -&gt; dùng __repr__
</code></pre>
<div class="callout"><span class="badge">__repr__ vs __str__</span> <code>__repr__</code> dành cho lập trình viên (rõ ràng, lý tưởng là tái tạo lại đối tượng); <code>__str__</code> dành cho người dùng cuối (dễ đọc). Nếu chỉ viết một cái, hãy viết <code>__repr__</code> — <code>str()</code> sẽ dùng nó khi thiếu.</div>`,
  ]]);

const c1q = quiz('apo202-quiz-1', 'Quiz 1 — Data model|||Quiz 1 — Mô hình dữ liệu', [
  { id: 'q1', question: 'Trong Python, phép gán "b = a" (với a là list) làm gì?', options: ['Sao chép sâu list', 'Gắn tên b vào CÙNG đối tượng list mà a trỏ tới', 'Tạo list rỗng mới', 'Chuyển a thành bất biến'], correctIndex: 1, explanation: 'Phép gán chỉ gắn tên, không sao chép; b và a cùng trỏ một đối tượng.' },
  { id: 'q2', question: 'Method dunder nào được gọi khi bạn viết a + b?', options: ['__plus__', '__add__', '__sum__', '__concat__'], correctIndex: 1, explanation: 'Toán tử + gọi __add__ của toán hạng bên trái.' },
  { id: 'q3', question: 'Nếu một lớp chỉ định nghĩa __repr__ mà không có __str__ thì str(obj) sẽ?', options: ['Báo lỗi', 'Trả về địa chỉ bộ nhớ', 'Dùng __repr__ làm dự phòng', 'Trả về chuỗi rỗng'], correctIndex: 2, explanation: 'Khi thiếu __str__, str() rơi về __repr__.' },
]);

const c2 = doc('apo202-2-1-classes-pillars', '2.1 — Classes, objects & the four OOP pillars|||2.1 — Lớp, đối tượng & 4 trụ cột OOP',
  'Định nghĩa lớp, instance vs class attribute, self; bốn trụ cột trong Python: đóng gói (quy ước _/__ và name mangling), trừu tượng, kế thừa, đa hình; so sánh với dataclass.',
  [[
    `<span class="eyebrow">APO202 · Chapter 2 · Lesson 2.1</span>
<h2>Classes, objects &amp; the four OOP pillars</h2>
<h3>Instances, attributes &amp; self</h3>
<p>A <strong>class attribute</strong> is shared by all instances; an <strong>instance attribute</strong> (set on <code>self</code>) belongs to one object. The first parameter <code>self</code> is the instance the method is called on.</p>
<pre><code>class Account:
    bank = "FPT Bank"            # class attribute (shared)

    def __init__(self, owner, balance=0):
        self.owner = owner        # instance attribute
        self.__balance = balance  # "private" via name mangling

    def deposit(self, amount):
        if amount &lt;= 0:
            raise ValueError("amount must be positive")
        self.__balance += amount

    @property
    def balance(self):            # read-only access
        return self.__balance
</code></pre>
<h3>The four pillars, the Pythonic way</h3>
<ul>
<li><strong>Encapsulation</strong> — bundle data + behaviour; signal "internal" with a leading underscore (<code>_x</code>), force name-mangling with two (<code>__x</code> becomes <code>_Class__x</code>).</li>
<li><strong>Abstraction</strong> — expose a simple interface, hide the mechanism (e.g. <code>deposit()</code> hides the balance check).</li>
<li><strong>Inheritance</strong> — a subclass reuses and extends a base class.</li>
<li><strong>Polymorphism</strong> — the same call works on different types (Python leans on <em>duck typing</em>: "if it quacks like a duck…").</li>
</ul>
<div class="callout"><span class="badge">dataclass</span> For data-holding classes, <code>@dataclass</code> auto-generates <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> — less boilerplate, same behaviour.</div>`,
    `<span class="eyebrow">APO202 · Chương 2 · Bài 2.1</span>
<h2>Lớp, đối tượng &amp; bốn trụ cột OOP</h2>
<h3>Instance, thuộc tính &amp; self</h3>
<p>Một <strong>thuộc tính lớp (class attribute)</strong> được mọi instance dùng chung; một <strong>thuộc tính instance</strong> (đặt trên <code>self</code>) thuộc về một đối tượng. Tham số đầu <code>self</code> là chính instance mà method được gọi trên đó.</p>
<pre><code>class Account:
    bank = "FPT Bank"            # thuộc tính lớp (dùng chung)

    def __init__(self, owner, balance=0):
        self.owner = owner        # thuộc tính instance
        self.__balance = balance  # "riêng tư" nhờ name mangling

    def deposit(self, amount):
        if amount &lt;= 0:
            raise ValueError("amount must be positive")
        self.__balance += amount

    @property
    def balance(self):            # chỉ cho đọc
        return self.__balance
</code></pre>
<h3>Bốn trụ cột theo lối Python</h3>
<ul>
<li><strong>Đóng gói (encapsulation)</strong> — gói dữ liệu + hành vi; báo hiệu "nội bộ" bằng một gạch dưới (<code>_x</code>), ép name-mangling bằng hai gạch (<code>__x</code> thành <code>_Class__x</code>).</li>
<li><strong>Trừu tượng (abstraction)</strong> — phơi ra giao diện đơn giản, giấu cơ chế (vd <code>deposit()</code> giấu bước kiểm tra số dư).</li>
<li><strong>Kế thừa (inheritance)</strong> — lớp con tái sử dụng và mở rộng lớp cha.</li>
<li><strong>Đa hình (polymorphism)</strong> — cùng một lời gọi chạy trên nhiều kiểu (Python dựa vào <em>duck typing</em>: "nếu nó kêu quạc như vịt…").</li>
</ul>
<div class="callout"><span class="badge">dataclass</span> Với lớp chỉ chứa dữ liệu, <code>@dataclass</code> tự sinh <code>__init__</code>, <code>__repr__</code> và <code>__eq__</code> — ít mã lặp, cùng hành vi.</div>`,
  ]]);

const c2q = quiz('apo202-quiz-2', 'Quiz 2 — Classes & pillars|||Quiz 2 — Lớp & trụ cột', [
  { id: 'q1', question: 'Thuộc tính khai báo ngay trong thân lớp (ngoài __init__) là loại gì?', options: ['Thuộc tính instance', 'Thuộc tính lớp (dùng chung mọi instance)', 'Biến cục bộ', 'Hằng số module'], correctIndex: 1, explanation: 'Đó là class attribute, chia sẻ cho mọi instance.' },
  { id: 'q2', question: 'Tiền tố hai gạch dưới __balance trong lớp Account gây ra hiện tượng gì?', options: ['Xoá thuộc tính', 'Name mangling: đổi tên thành _Account__balance', 'Biến thành class attribute', 'Cấm mọi truy cập vĩnh viễn'], correctIndex: 1, explanation: 'Hai gạch dưới kích hoạt name mangling thành _Account__balance.' },
  { id: 'q3', question: 'Duck typing trong Python nghĩa là?', options: ['Phải khai báo kiểu tường minh', 'Chỉ quan tâm đối tượng CÓ hành vi cần dùng, không quan tâm kiểu chính xác', 'Chỉ dùng được với lớp con', 'Cấm đa hình'], correctIndex: 1, explanation: 'Duck typing: nếu đối tượng hỗ trợ hành vi cần thiết thì dùng được, bất kể kiểu.' },
]);

const c3 = doc('apo202-3-1-inheritance-mro-abc', '3.1 — Inheritance, polymorphism, MRO & ABCs|||3.1 — Kế thừa, đa hình, MRO & abstract base class',
  'Kế thừa đơn/đa; super() và MRO (C3 linearization); đa hình qua ghi đè method; abstract base class (abc) buộc lớp con hiện thực; isinstance với ABC.',
  [[
    `<span class="eyebrow">APO202 · Chapter 3 · Lesson 3.1</span>
<h2>Inheritance, polymorphism, MRO &amp; ABCs</h2>
<h3>super() and overriding</h3>
<p>A subclass overrides a method by redefining it; <code>super()</code> calls the base version so you extend rather than replace.</p>
<pre><code>class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):                 # override -&gt; polymorphism
        return "Woof"

for a in (Animal(), Dog()):
    print(a.speak())                 # ... then Woof
</code></pre>
<h3>MRO — Method Resolution Order</h3>
<p>With multiple inheritance, Python resolves attribute lookups in a fixed order computed by the <strong>C3 linearization</strong> algorithm. Inspect it with <code>Cls.__mro__</code> or <code>Cls.mro()</code>.</p>
<pre><code>class A: ...
class B(A): ...
class C(A): ...
class D(B, C): ...
print([c.__name__ for c in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']
</code></pre>
<h3>Abstract Base Classes</h3>
<pre><code>from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -&gt; float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

# Shape() -&gt; TypeError: can't instantiate abstract class
</code></pre>
<div class="callout"><span class="badge">Why ABCs</span> An ABC defines a contract: any subclass MUST implement the abstract methods, or it cannot be instantiated. Great for enforcing a common interface across a family of types.</div>`,
    `<span class="eyebrow">APO202 · Chương 3 · Bài 3.1</span>
<h2>Kế thừa, đa hình, MRO &amp; abstract base class</h2>
<h3>super() và ghi đè</h3>
<p>Lớp con ghi đè một method bằng cách định nghĩa lại; <code>super()</code> gọi phiên bản của lớp cha để bạn mở rộng thay vì thay thế hoàn toàn.</p>
<pre><code>class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):                 # ghi đè -&gt; đa hình
        return "Woof"

for a in (Animal(), Dog()):
    print(a.speak())                 # ... rồi Woof
</code></pre>
<h3>MRO — thứ tự phân giải method</h3>
<p>Với đa kế thừa, Python phân giải việc tra cứu thuộc tính theo một thứ tự cố định tính bằng thuật toán <strong>C3 linearization</strong>. Xem bằng <code>Cls.__mro__</code> hoặc <code>Cls.mro()</code>.</p>
<pre><code>class A: ...
class B(A): ...
class C(A): ...
class D(B, C): ...
print([c.__name__ for c in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']
</code></pre>
<h3>Abstract Base Class</h3>
<pre><code>from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -&gt; float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

# Shape() -&gt; TypeError: không thể tạo instance của lớp trừu tượng
</code></pre>
<div class="callout"><span class="badge">Vì sao dùng ABC</span> ABC định nghĩa một hợp đồng: mọi lớp con BẮT BUỘC hiện thực các method trừu tượng, nếu không sẽ không tạo được instance. Rất hợp để ép một giao diện chung cho một họ kiểu.</div>`,
  ]]);

const c3q = quiz('apo202-quiz-3', 'Quiz 3 — Inheritance & MRO|||Quiz 3 — Kế thừa & MRO', [
  { id: 'q1', question: 'super() trong một method của lớp con dùng để?', options: ['Xoá lớp cha', 'Gọi phiên bản method của lớp cha', 'Tạo instance mới', 'Bỏ qua kế thừa'], correctIndex: 1, explanation: 'super() truy cập hiện thực của lớp cha theo MRO.' },
  { id: 'q2', question: 'MRO (Method Resolution Order) trong Python được tính bằng?', options: ['Thứ tự chữ cái', 'Thuật toán C3 linearization', 'Ngẫu nhiên', 'Thứ tự định nghĩa file'], correctIndex: 1, explanation: 'Python dùng C3 linearization để xác định thứ tự tra cứu.' },
  { id: 'q3', question: 'Điều gì xảy ra khi cố tạo instance của một lớp ABC còn abstractmethod chưa hiện thực?', options: ['Chạy bình thường', 'TypeError: không thể tạo instance', 'Trả về None', 'Tự động hiện thực method rỗng'], correctIndex: 1, explanation: 'Lớp còn abstractmethod chưa cài đặt không thể được instantiate → TypeError.' },
]);

const c4 = doc('apo202-4-1-property-descriptor-decorator', '4.1 — Properties, descriptors & decorators|||4.1 — Property, descriptor & decorator',
  'property (getter/setter/deleter) để kiểm soát truy cập; giao thức descriptor (__get__/__set__) đứng sau property; decorator hàm và decorator có tham số; functools.wraps.',
  [[
    `<span class="eyebrow">APO202 · Chapter 4 · Lesson 4.1</span>
<h2>Properties, descriptors &amp; decorators</h2>
<h3>property — managed attributes</h3>
<p><code>@property</code> lets a method look like an attribute, so you add validation without changing the public API.</p>
<pre><code>class Celsius:
    def __init__(self, t): self._t = t

    @property
    def temp(self): return self._t

    @temp.setter
    def temp(self, value):
        if value &lt; -273.15:
            raise ValueError("below absolute zero")
        self._t = value

c = Celsius(25)
c.temp = 30        # calls the setter (validation runs)
</code></pre>
<h3>The descriptor protocol</h3>
<p>A <strong>descriptor</strong> is any object defining <code>__get__</code>, <code>__set__</code> or <code>__delete__</code>. <code>property</code> is itself a descriptor. Descriptors power reusable, class-level attribute logic.</p>
<h3>Decorators</h3>
<p>A <strong>decorator</strong> is a callable that takes a function and returns a new function — wrapping behaviour around it.</p>
<pre><code>import functools

def timed(func):
    @functools.wraps(func)          # keep name/docstring
    def wrapper(*args, **kwargs):
        # ... start timer ...
        result = func(*args, **kwargs)
        # ... stop timer, log ...
        return result
    return wrapper

@timed
def work(n): return sum(range(n))
</code></pre>
<div class="callout"><span class="badge">functools.wraps</span> Always wrap the inner function with <code>@functools.wraps(func)</code> so the decorated function keeps its original <code>__name__</code> and docstring — otherwise introspection and debugging break.</div>`,
    `<span class="eyebrow">APO202 · Chương 4 · Bài 4.1</span>
<h2>Property, descriptor &amp; decorator</h2>
<h3>property — thuộc tính có kiểm soát</h3>
<p><code>@property</code> giúp một method trông như một thuộc tính, để bạn thêm kiểm tra mà không đổi API công khai.</p>
<pre><code>class Celsius:
    def __init__(self, t): self._t = t

    @property
    def temp(self): return self._t

    @temp.setter
    def temp(self, value):
        if value &lt; -273.15:
            raise ValueError("below absolute zero")
        self._t = value

c = Celsius(25)
c.temp = 30        # gọi setter (kiểm tra chạy)
</code></pre>
<h3>Giao thức descriptor</h3>
<p>Một <strong>descriptor</strong> là đối tượng bất kỳ có định nghĩa <code>__get__</code>, <code>__set__</code> hoặc <code>__delete__</code>. Bản thân <code>property</code> là một descriptor. Descriptor cấp sức cho logic thuộc tính tái sử dụng ở cấp lớp.</p>
<h3>Decorator</h3>
<p>Một <strong>decorator</strong> là một callable nhận vào một hàm và trả về một hàm mới — bọc thêm hành vi quanh nó.</p>
<pre><code>import functools

def timed(func):
    @functools.wraps(func)          # giữ tên/docstring
    def wrapper(*args, **kwargs):
        # ... bắt đầu đo giờ ...
        result = func(*args, **kwargs)
        # ... dừng đo, ghi log ...
        return result
    return wrapper

@timed
def work(n): return sum(range(n))
</code></pre>
<div class="callout"><span class="badge">functools.wraps</span> Luôn bọc hàm bên trong bằng <code>@functools.wraps(func)</code> để hàm đã trang trí giữ nguyên <code>__name__</code> và docstring gốc — nếu không thì introspection và debug sẽ hỏng.</div>`,
  ]]);

const c4q = quiz('apo202-quiz-4', 'Quiz 4 — Property & decorator|||Quiz 4 — Property & decorator', [
  { id: 'q1', question: '@property dùng để làm gì?', options: ['Xoá thuộc tính', 'Cho một method trông như thuộc tính, thêm được kiểm tra khi đọc/ghi', 'Tạo class attribute', 'Ép kiểu dữ liệu'], correctIndex: 1, explanation: 'property biến method thành thuộc tính có kiểm soát mà không đổi API.' },
  { id: 'q2', question: 'Một descriptor là đối tượng định nghĩa method nào?', options: ['__init__', '__get__ / __set__ / __delete__', '__str__', '__call__'], correctIndex: 1, explanation: 'Descriptor cài đặt giao thức __get__/__set__/__delete__.' },
  { id: 'q3', question: 'Vì sao nên dùng @functools.wraps trong decorator?', options: ['Tăng tốc hàm', 'Giữ __name__ và docstring gốc của hàm được trang trí', 'Bắt buộc để decorator chạy', 'Ẩn hàm khỏi module'], correctIndex: 1, explanation: 'functools.wraps sao chép metadata (tên, docstring) sang wrapper, giữ introspection đúng.' },
]);

const c5 = doc('apo202-5-1-iterator-generator-context', '5.1 — Iterators, generators & context managers|||5.1 — Iterator, generator & context manager',
  'Giao thức iterator (__iter__/__next__) và StopIteration; generator với yield để lười tính, tiết kiệm bộ nhớ; generator expression; context manager (__enter__/__exit__) và with, contextlib.contextmanager.',
  [[
    `<span class="eyebrow">APO202 · Chapter 5 · Lesson 5.1</span>
<h2>Iterators, generators &amp; context managers</h2>
<h3>The iterator protocol</h3>
<p>An <strong>iterable</strong> returns an <strong>iterator</strong> from <code>__iter__</code>; the iterator yields items from <code>__next__</code> and raises <code>StopIteration</code> when done. This is what <code>for</code> uses under the hood.</p>
<h3>Generators — lazy sequences with yield</h3>
<p>A <strong>generator</strong> function uses <code>yield</code>; calling it returns an iterator that produces values <em>on demand</em> — you can model infinite or huge sequences without storing them.</p>
<pre><code>def countdown(n):
    while n &gt; 0:
        yield n            # pauses here, resumes on next()
        n -= 1

for x in countdown(3):
    print(x)              # 3, 2, 1

squares = (i * i for i in range(5))   # generator expression
</code></pre>
<h3>Context managers — with</h3>
<pre><code>class Timer:
    def __enter__(self):
        # ... setup (e.g. start timer) ...
        return self
    def __exit__(self, exc_type, exc, tb):
        # ... teardown, ALWAYS runs (even on error) ...
        return False       # False -&gt; do not suppress exceptions

with open("data.txt") as f:   # file is closed automatically
    text = f.read()
</code></pre>
<div class="callout"><span class="badge">contextlib</span> Instead of a class, decorate a generator with <code>@contextlib.contextmanager</code>: code before <code>yield</code> is setup, code after is teardown. <code>__exit__</code> always runs, so resources are released even if an exception is raised.</div>`,
    `<span class="eyebrow">APO202 · Chương 5 · Bài 5.1</span>
<h2>Iterator, generator &amp; context manager</h2>
<h3>Giao thức iterator</h3>
<p>Một <strong>iterable</strong> trả về một <strong>iterator</strong> từ <code>__iter__</code>; iterator sinh phần tử qua <code>__next__</code> và ném <code>StopIteration</code> khi hết. Đây chính là thứ mà <code>for</code> dùng bên dưới.</p>
<h3>Generator — dãy lười với yield</h3>
<p>Một hàm <strong>generator</strong> dùng <code>yield</code>; gọi nó trả về một iterator sinh giá trị <em>theo yêu cầu</em> — bạn có thể mô hình hoá dãy vô hạn hay cực lớn mà không lưu hết vào bộ nhớ.</p>
<pre><code>def countdown(n):
    while n &gt; 0:
        yield n            # tạm dừng ở đây, chạy tiếp khi next()
        n -= 1

for x in countdown(3):
    print(x)              # 3, 2, 1

squares = (i * i for i in range(5))   # generator expression
</code></pre>
<h3>Context manager — with</h3>
<pre><code>class Timer:
    def __enter__(self):
        # ... thiết lập (vd bắt đầu đo giờ) ...
        return self
    def __exit__(self, exc_type, exc, tb):
        # ... dọn dẹp, LUÔN chạy (kể cả khi lỗi) ...
        return False       # False -&gt; không nuốt ngoại lệ

with open("data.txt") as f:   # file tự động được đóng
    text = f.read()
</code></pre>
<div class="callout"><span class="badge">contextlib</span> Thay vì viết lớp, hãy trang trí một generator bằng <code>@contextlib.contextmanager</code>: mã trước <code>yield</code> là thiết lập, mã sau là dọn dẹp. <code>__exit__</code> luôn chạy, nên tài nguyên được giải phóng ngay cả khi có ngoại lệ.</div>`,
  ]]);

const c5q = quiz('apo202-quiz-5', 'Quiz 5 — Generators & context|||Quiz 5 — Generator & context manager', [
  { id: 'q1', question: 'Từ khoá nào biến một hàm thành generator?', options: ['return', 'yield', 'async', 'lambda'], correctIndex: 1, explanation: 'Hàm chứa yield trở thành generator, sinh giá trị theo yêu cầu.' },
  { id: 'q2', question: 'Ưu điểm chính của generator so với việc trả về một list đầy đủ?', options: ['Luôn nhanh hơn tuyệt đối', 'Tính lười, tiết kiệm bộ nhớ (không lưu hết phần tử cùng lúc)', 'Tự động sắp xếp', 'Không thể lặp lại'], correctIndex: 1, explanation: 'Generator sinh từng phần tử theo yêu cầu nên tiết kiệm bộ nhớ, làm được dãy vô hạn.' },
  { id: 'q3', question: 'Trong context manager, method __exit__ được gọi khi nào?', options: ['Chỉ khi không có lỗi', 'Chỉ khi có lỗi', 'Luôn luôn, kể cả khi khối with ném ngoại lệ', 'Không bao giờ tự gọi'], correctIndex: 2, explanation: '__exit__ luôn chạy khi rời khối with, đảm bảo dọn dẹp tài nguyên.' },
]);

const c6 = doc('apo202-6-1-exceptions-packages-venv', '6.1 — Exceptions, modules, packages & virtual environments|||6.1 — Xử lý ngoại lệ, module, package & môi trường ảo',
  'try/except/else/finally; cây kế thừa Exception & ngoại lệ tự định nghĩa; raise/raise from; module vs package (__init__.py); import tuyệt đối/tương đối; venv & pip cách ly phụ thuộc.',
  [[
    `<span class="eyebrow">APO202 · Chapter 6 · Lesson 6.1</span>
<h2>Exceptions, modules, packages &amp; venv</h2>
<h3>Handling exceptions</h3>
<pre><code>class InsufficientFunds(Exception):     # custom exception
    pass

try:
    withdraw(amount)
except InsufficientFunds as e:
    log(e)                              # handle a specific error
except (ValueError, KeyError):
    ...                                 # handle several
else:
    commit()                            # runs if NO exception
finally:
    close()                             # ALWAYS runs (cleanup)
</code></pre>
<p>Catch the <em>most specific</em> exception you can; never write a bare <code>except:</code> that swallows everything. Use <code>raise ... from e</code> to preserve the original cause.</p>
<h3>Modules &amp; packages</h3>
<ul>
<li>A <strong>module</strong> is a single <code>.py</code> file; a <strong>package</strong> is a directory of modules (traditionally with <code>__init__.py</code>).</li>
<li><code>import pkg.mod</code> is an <strong>absolute import</strong>; <code>from . import mod</code> is a <strong>relative import</strong>.</li>
<li>The <code>if __name__ == "__main__":</code> guard makes a file usable both as a script and as an importable module.</li>
</ul>
<h3>Virtual environments</h3>
<pre><code>python -m venv .venv          # create an isolated environment
source .venv/bin/activate     # activate (Linux/macOS)
pip install requests          # installs only into .venv
pip freeze &gt; requirements.txt # pin dependencies
</code></pre>
<div class="callout"><span class="badge">Why venv</span> A virtual environment isolates each project's dependencies so versions never clash — never <code>pip install</code> into the system Python for project work.</div>`,
    `<span class="eyebrow">APO202 · Chương 6 · Bài 6.1</span>
<h2>Ngoại lệ, module, package &amp; môi trường ảo</h2>
<h3>Xử lý ngoại lệ</h3>
<pre><code>class InsufficientFunds(Exception):     # ngoại lệ tự định nghĩa
    pass

try:
    withdraw(amount)
except InsufficientFunds as e:
    log(e)                              # bắt một lỗi cụ thể
except (ValueError, KeyError):
    ...                                 # bắt nhiều loại
else:
    commit()                            # chạy nếu KHÔNG có ngoại lệ
finally:
    close()                             # LUÔN chạy (dọn dẹp)
</code></pre>
<p>Hãy bắt ngoại lệ <em>cụ thể nhất</em> có thể; đừng bao giờ viết <code>except:</code> trống nuốt mọi lỗi. Dùng <code>raise ... from e</code> để giữ lại nguyên nhân gốc.</p>
<h3>Module &amp; package</h3>
<ul>
<li>Một <strong>module</strong> là một file <code>.py</code>; một <strong>package</strong> là một thư mục chứa các module (truyền thống có <code>__init__.py</code>).</li>
<li><code>import pkg.mod</code> là <strong>import tuyệt đối</strong>; <code>from . import mod</code> là <strong>import tương đối</strong>.</li>
<li>Chốt <code>if __name__ == "__main__":</code> giúp một file dùng được vừa như script vừa như module import được.</li>
</ul>
<h3>Môi trường ảo</h3>
<pre><code>python -m venv .venv          # tạo môi trường cách ly
source .venv/bin/activate     # kích hoạt (Linux/macOS)
pip install requests          # chỉ cài vào .venv
pip freeze &gt; requirements.txt # ghim phiên bản phụ thuộc
</code></pre>
<div class="callout"><span class="badge">Vì sao dùng venv</span> Môi trường ảo cách ly phụ thuộc của từng dự án để các phiên bản không xung đột — đừng <code>pip install</code> thẳng vào Python hệ thống khi làm dự án.</div>`,
  ]]);

const c6q = quiz('apo202-quiz-6', 'Quiz 6 — Exceptions & packages|||Quiz 6 — Ngoại lệ & package', [
  { id: 'q1', question: 'Khối nào trong try/except LUÔN chạy dù có hay không có ngoại lệ?', options: ['else', 'except', 'finally', 'raise'], correctIndex: 2, explanation: 'finally luôn chạy, thường dùng để dọn dẹp tài nguyên.' },
  { id: 'q2', question: 'Sự khác nhau giữa module và package là?', options: ['Không khác gì', 'Module là một file .py; package là thư mục chứa các module', 'Package là một hàm', 'Module phải có __init__.py'], correctIndex: 1, explanation: 'Module = một file .py; package = thư mục các module (thường có __init__.py).' },
  { id: 'q3', question: 'Lệnh "python -m venv .venv" làm gì?', options: ['Cài mọi thư viện toàn cục', 'Tạo một môi trường ảo cách ly phụ thuộc cho dự án', 'Chạy test', 'Xoá Python hệ thống'], correctIndex: 1, explanation: 'venv tạo môi trường cách ly để phụ thuộc dự án không xung đột nhau.' },
]);

const c7 = doc('apo202-7-1-functional-typehints', '7.1 — Functional Python & type hints|||7.1 — Functional Python & type hints',
  'lambda, map/filter/reduce; list/dict/set comprehension & generator expression thay thế vòng lặp; hàm bậc cao, closure; type hints (typing: List, Dict, Optional, Callable) và kiểm tra tĩnh với mypy.',
  [[
    `<span class="eyebrow">APO202 · Chapter 7 · Lesson 7.1</span>
<h2>Functional Python &amp; type hints</h2>
<h3>Functions as first-class objects</h3>
<p>Functions can be passed, returned and stored. <code>lambda</code> makes small anonymous functions; <code>map</code>/<code>filter</code> apply a function across an iterable.</p>
<pre><code>nums = [1, 2, 3, 4, 5]
evens = list(filter(lambda n: n % 2 == 0, nums))   # [2, 4]
doubled = list(map(lambda n: n * 2, nums))         # [2,4,6,8,10]

# comprehensions are usually clearer than map/filter:
evens = [n for n in nums if n % 2 == 0]
lookup = {name: len(name) for name in ("Ann", "Bo")}
</code></pre>
<h3>Type hints</h3>
<p><strong>Type hints</strong> document the intended types. They do not change runtime behaviour, but tools like <strong>mypy</strong> check them statically and IDEs use them for autocomplete.</p>
<pre><code>from typing import Optional, Callable

def greet(name: str, times: int = 1) -&gt; str:
    return (f"Hi {name} " * times).strip()

def apply(f: Callable[[int], int], x: int) -&gt; int:
    return f(x)

user: Optional[str] = None      # str or None

# modern (3.9+): list[int], dict[str, int]
scores: dict[str, int] = {"a": 90}
</code></pre>
<div class="callout"><span class="badge">Hints are not enforced</span> Python does not check types at runtime — <code>greet(123)</code> still runs. Run <code>mypy</code> in CI to catch mismatches before they ship.</div>`,
    `<span class="eyebrow">APO202 · Chương 7 · Bài 7.1</span>
<h2>Functional Python &amp; type hints</h2>
<h3>Hàm là công dân hạng nhất</h3>
<p>Hàm có thể được truyền đi, trả về và lưu trữ. <code>lambda</code> tạo hàm vô danh nhỏ gọn; <code>map</code>/<code>filter</code> áp một hàm lên một iterable.</p>
<pre><code>nums = [1, 2, 3, 4, 5]
evens = list(filter(lambda n: n % 2 == 0, nums))   # [2, 4]
doubled = list(map(lambda n: n * 2, nums))         # [2,4,6,8,10]

# comprehension thường rõ ràng hơn map/filter:
evens = [n for n in nums if n % 2 == 0]
lookup = {name: len(name) for name in ("Ann", "Bo")}
</code></pre>
<h3>Type hints</h3>
<p><strong>Type hints</strong> ghi chú kiểu dự kiến. Chúng không đổi hành vi lúc chạy, nhưng công cụ như <strong>mypy</strong> kiểm tra chúng tĩnh và IDE dùng chúng để gợi ý tự động.</p>
<pre><code>from typing import Optional, Callable

def greet(name: str, times: int = 1) -&gt; str:
    return (f"Hi {name} " * times).strip()

def apply(f: Callable[[int], int], x: int) -&gt; int:
    return f(x)

user: Optional[str] = None      # str hoặc None

# cú pháp mới (3.9+): list[int], dict[str, int]
scores: dict[str, int] = {"a": 90}
</code></pre>
<div class="callout"><span class="badge">Hints không bị ép buộc</span> Python không kiểm tra kiểu lúc chạy — <code>greet(123)</code> vẫn chạy. Chạy <code>mypy</code> trong CI để bắt sai kiểu trước khi lên production.</div>`,
  ]]);

const c7q = quiz('apo202-quiz-7', 'Quiz 7 — Functional & type hints|||Quiz 7 — Functional & type hints', [
  { id: 'q1', question: 'Biểu thức [n for n in nums if n % 2 == 0] là gì?', options: ['Một lambda', 'Một list comprehension lọc số chẵn', 'Một generator vô hạn', 'Một câu lệnh import'], correctIndex: 1, explanation: 'List comprehension tạo list mới gồm các phần tử thoả điều kiện.' },
  { id: 'q2', question: 'Type hint "user: Optional[str]" nghĩa là user có kiểu?', options: ['Chỉ str', 'str hoặc None', 'Chỉ None', 'Bất kỳ kiểu nào'], correctIndex: 1, explanation: 'Optional[str] tương đương "str hoặc None".' },
  { id: 'q3', question: 'Type hints ảnh hưởng thế nào lúc chạy (runtime)?', options: ['Ép buộc kiểu, sai kiểu là lỗi ngay', 'Không đổi hành vi runtime; chỉ công cụ như mypy kiểm tra tĩnh', 'Làm chương trình chạy nhanh hơn', 'Chuyển đổi kiểu tự động'], correctIndex: 1, explanation: 'Python không ép kiểu lúc chạy; type hints để công cụ tĩnh (mypy) và IDE dùng.' },
]);

const c8 = doc('apo202-8-1-testing-packaging-pro', '8.1 — Testing (pytest), packaging & professional practice|||8.1 — Testing (pytest), đóng gói & thực hành chuyên nghiệp',
  'pytest: viết test, assert, fixture, parametrize; đóng gói dự án (pyproject.toml, pip install -e); PEP 8 & công cụ định dạng; nguyên lý SOLID áp dụng cho lớp Python.',
  [[
    `<span class="eyebrow">APO202 · Chapter 8 · Lesson 8.1</span>
<h2>Testing (pytest), packaging &amp; professional practice</h2>
<h3>Testing with pytest</h3>
<p><strong>pytest</strong> discovers files named <code>test_*.py</code> and functions named <code>test_*</code>; you just use plain <code>assert</code>.</p>
<pre><code>import pytest

def add(a, b): return a + b

def test_add():
    assert add(2, 3) == 5

@pytest.mark.parametrize("a,b,expected", [(1, 1, 2), (0, 5, 5)])
def test_add_cases(a, b, expected):
    assert add(a, b) == expected

@pytest.fixture
def account():
    return Account("Ann", 100)      # reusable setup

def test_deposit(account):
    account.deposit(50)
    assert account.balance == 150
</code></pre>
<h3>Packaging</h3>
<p>Describe the project in <code>pyproject.toml</code> (name, version, dependencies), then <code>pip install -e .</code> for an editable install during development.</p>
<h3>PEP 8 &amp; SOLID</h3>
<ul>
<li><strong>PEP 8</strong> — 4-space indent, <code>snake_case</code> functions, <code>CapWords</code> classes; enforce with Ruff/Black.</li>
<li><strong>S</strong>ingle responsibility · <strong>O</strong>pen-closed · <strong>L</strong>iskov substitution · <strong>I</strong>nterface segregation · <strong>D</strong>ependency inversion — five principles for classes that stay easy to change.</li>
</ul>
<div class="callout"><span class="badge">Professional habit</span> Small classes with one responsibility, tests that pin behaviour, and consistent style are what separate a script from a maintainable codebase — and what reviewers look for.</div>`,
    `<span class="eyebrow">APO202 · Chương 8 · Bài 8.1</span>
<h2>Testing (pytest), đóng gói &amp; thực hành chuyên nghiệp</h2>
<h3>Kiểm thử với pytest</h3>
<p><strong>pytest</strong> tự tìm file tên <code>test_*.py</code> và hàm tên <code>test_*</code>; bạn chỉ cần dùng <code>assert</code> thuần.</p>
<pre><code>import pytest

def add(a, b): return a + b

def test_add():
    assert add(2, 3) == 5

@pytest.mark.parametrize("a,b,expected", [(1, 1, 2), (0, 5, 5)])
def test_add_cases(a, b, expected):
    assert add(a, b) == expected

@pytest.fixture
def account():
    return Account("Ann", 100)      # thiết lập tái sử dụng

def test_deposit(account):
    account.deposit(50)
    assert account.balance == 150
</code></pre>
<h3>Đóng gói</h3>
<p>Mô tả dự án trong <code>pyproject.toml</code> (tên, phiên bản, phụ thuộc), rồi <code>pip install -e .</code> để cài dạng editable khi phát triển.</p>
<h3>PEP 8 &amp; SOLID</h3>
<ul>
<li><strong>PEP 8</strong> — thụt lề 4 khoảng trắng, hàm <code>snake_case</code>, lớp <code>CapWords</code>; ép bằng Ruff/Black.</li>
<li><strong>S</strong>ingle responsibility · <strong>O</strong>pen-closed · <strong>L</strong>iskov substitution · <strong>I</strong>nterface segregation · <strong>D</strong>ependency inversion — năm nguyên lý cho lớp dễ thay đổi về sau.</li>
</ul>
<div class="callout"><span class="badge">Thói quen chuyên nghiệp</span> Lớp nhỏ một trách nhiệm, test ghim hành vi, và phong cách nhất quán là thứ tách một script khỏi một mã nguồn dễ bảo trì — và là thứ người review tìm kiếm.</div>`,
  ]]);

const c8q = quiz('apo202-quiz-8', 'Quiz 8 — Testing & SOLID|||Quiz 8 — Testing & SOLID', [
  { id: 'q1', question: 'Trong pytest, một hàm test thường kiểm tra kết quả bằng?', options: ['print()', 'câu lệnh assert', 'return True', 'try/except bắt buộc'], correctIndex: 1, explanation: 'pytest dùng assert thuần; assert sai thì test thất bại.' },
  { id: 'q2', question: '@pytest.fixture dùng để?', options: ['Bỏ qua test', 'Cung cấp dữ liệu/thiết lập tái sử dụng cho nhiều test', 'Đo thời gian chạy', 'Đóng gói dự án'], correctIndex: 1, explanation: 'Fixture cung cấp thiết lập tái sử dụng, được inject vào test theo tên tham số.' },
  { id: 'q3', question: 'Chữ "S" trong SOLID là nguyên lý nào?', options: ['Static typing', 'Single Responsibility (một lớp một trách nhiệm)', 'Simple design', 'Standard library'], correctIndex: 1, explanation: 'S = Single Responsibility Principle: mỗi lớp nên có một lý do để thay đổi.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'APO202',
    slug: 'apo202-advanced-python-with-oop',
    title: 'Advanced Python with OOP',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/APO202.webp',
    shortDescription: 'Advanced Python & OOP: the data model & dunder methods, the four pillars, inheritance/MRO/ABCs, properties, descriptors & decorators, generators & context managers, functional style, type hints, pytest & SOLID. Bilingual with examples.|||Python nâng cao & OOP: mô hình dữ liệu & dunder, bốn trụ cột, kế thừa/MRO/ABC, property, descriptor & decorator, generator & context manager, phong cách hàm, type hints, pytest & SOLID. Song ngữ, có ví dụ.',
    description: 'Môn <strong>APO202 — Advanced Python with OOP</strong> (Python nâng cao với Lập trình hướng đối tượng, ngành Khoa học Máy tính, kỳ 2) đưa bạn từ viết script đến <strong>thiết kế chương trình Python thuần Python bằng đối tượng</strong>. Từ <strong>mô hình dữ liệu &amp; dunder methods</strong> → <strong>lớp &amp; bốn trụ cột OOP</strong> → <strong>kế thừa, đa hình, MRO &amp; ABC</strong> → <strong>property, descriptor &amp; decorator</strong> → <strong>iterator, generator &amp; context manager</strong> → <strong>ngoại lệ, package &amp; venv</strong> → <strong>functional Python &amp; type hints</strong> → <strong>testing (pytest), đóng gói &amp; SOLID</strong>. Bám các giáo trình Fluent Python, Python Cookbook, Effective Python và docs.python.org; song ngữ, nhiều ví dụ Python, quiz mỗi chương.',
    whatYouLearn: 'Mô hình dữ liệu &amp; dunder (__init__/__repr__/__eq__/__add__); lớp, class vs instance attribute, đóng gói &amp; name mangling; kế thừa, super(), đa hình, MRO (C3), abstract base class; property, giao thức descriptor, decorator &amp; functools.wraps; iterator, generator (yield), context manager (with); try/except/finally, ngoại lệ tự định nghĩa, module/package, venv &amp; pip; lambda, map/filter, comprehension, closure, type hints &amp; mypy; pytest (fixture, parametrize), đóng gói pyproject.toml, PEP 8 &amp; SOLID.',
    requirements: 'Đã biết Python cơ bản (biến, hàm, list/dict, vòng lặp, if). Nên cài Python 3.10+ và một editor (VS Code) để chạy thử ví dụ.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, sách (Fluent Python, Cookbook, Effective Python), docs.python.org, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao Python nâng cao; mọi thứ là đối tượng; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Mô hình dữ liệu|||Chapter 1 — Data model', description: 'Đối tượng, tham chiếu, dunder methods.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lớp & 4 trụ cột|||Chapter 2 — Classes & pillars', description: 'self, attribute, đóng gói/trừu tượng/kế thừa/đa hình.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kế thừa, MRO & ABC|||Chapter 3 — Inheritance, MRO & ABC', description: 'super(), đa hình, C3, abstract base class.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Property, descriptor & decorator|||Chapter 4 — Property, descriptor & decorator', description: 'property, giao thức descriptor, decorator.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Iterator, generator & context manager|||Chapter 5 — Iterator, generator & context manager', description: 'yield, dãy lười, with, contextlib.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Ngoại lệ, package & venv|||Chapter 6 — Exceptions, packages & venv', description: 'try/except/finally, module/package, môi trường ảo.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Functional & type hints|||Chapter 7 — Functional & type hints', description: 'lambda, comprehension, type hints, mypy.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Testing, đóng gói & SOLID|||Chapter 8 — Testing, packaging & SOLID', description: 'pytest, pyproject.toml, PEP 8, SOLID.', lessons: [c8, c8q] },
  ],
};
