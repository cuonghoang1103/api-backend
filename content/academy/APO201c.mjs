/**
 * APO201c — Advanced Python with OOP (Python nâng cao với Lập trình hướng đối
 * tượng). Ngành An toàn thông tin FPTU, kỳ 2. Song ngữ VI+EN, nhiều code Python.
 * Giáo trình chuẩn: Lutz "Learning Python", Ramalho "Fluent Python", Python.org
 * docs, Real Python, LeetCode. 8 chương: ôn Python cốt lõi → lớp & đối tượng →
 * bốn trụ OOP → magic method → ngoại lệ & file → module/venv → lập trình hàm &
 * nâng cao → kiểm thử & thực hành tốt.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${ lồng; & → &amp;.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('apo201c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách kinh điển (Lutz, Ramalho), tài liệu chính thức Python.org, Real Python, LeetCode, công cụ, lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">APO201c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to master <strong>Advanced Python with OOP</strong> — the language core, classes, the four OOP pillars, dunder methods, exceptions, packaging, functional tools and testing — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for APO201c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://learning-python.com/" target="_blank" rel="noopener"><em>Learning Python</em> — Mark Lutz (the classic deep reference)</a></li>
<li><a href="https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/" target="_blank" rel="noopener"><em>Fluent Python</em> — Luciano Ramalho (idiomatic, dunder-first)</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">The official Python Tutorial (docs.python.org)</a></li>
<li><a href="https://realpython.com/" target="_blank" rel="noopener">Real Python — tutorials &amp; deep dives</a></li>
<li><a href="https://peps.python.org/pep-0008/" target="_blank" rel="noopener">PEP 8 — the style guide for Python code</a></li>
</ul>
<h3>▶️ Practice</h3>
<ul>
<li><a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode — algorithm practice in Python</a></li>
<li><a href="https://exercism.org/tracks/python" target="_blank" rel="noopener">Exercism — Python track with mentoring</a></li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code — editor with the Python extension</a></li>
<li><a href="https://docs.pytest.org/" target="_blank" rel="noopener">pytest — the go-to testing framework</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — solidify the language core: data types, collections, comprehensions and functions.</li>
<li><strong>Object-oriented</strong> — classes, the four pillars, dunder methods; model a small domain yourself.</li>
<li><strong>Go deeper</strong> — exceptions &amp; files, modules &amp; virtual environments, decorators, generators and iterators.</li>
<li><strong>Job-ready</strong> — write tests (pytest), add type hints, follow PEP 8, and structure a real project.</li>
</ol></div>`,
    `<span class="eyebrow">APO201c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để thành thạo <strong>Python nâng cao với OOP</strong> — lõi ngôn ngữ, lớp, bốn trụ OOP, magic method, ngoại lệ, đóng gói, công cụ hàm và kiểm thử — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của APO201c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://learning-python.com/" target="_blank" rel="noopener"><em>Learning Python</em> — Mark Lutz (kinh điển, tra cứu sâu)</a></li>
<li><a href="https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/" target="_blank" rel="noopener"><em>Fluent Python</em> — Luciano Ramalho (viết Python đúng chất, ưu tiên dunder)</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener">Python Tutorial chính thức (docs.python.org)</a></li>
<li><a href="https://realpython.com/" target="_blank" rel="noopener">Real Python — hướng dẫn &amp; đào sâu</a></li>
<li><a href="https://peps.python.org/pep-0008/" target="_blank" rel="noopener">PEP 8 — quy ước viết code Python</a></li>
</ul>
<h3>▶️ Luyện tập</h3>
<ul>
<li><a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode — luyện thuật toán bằng Python</a></li>
<li><a href="https://exercism.org/tracks/python" target="_blank" rel="noopener">Exercism — lộ trình Python có người kèm</a></li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code — trình soạn với extension Python</a></li>
<li><a href="https://docs.pytest.org/" target="_blank" rel="noopener">pytest — framework kiểm thử phổ biến</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — nắm chắc lõi ngôn ngữ: kiểu dữ liệu, tập hợp, comprehension và hàm.</li>
<li><strong>Hướng đối tượng</strong> — lớp, bốn trụ, magic method; tự mô hình hoá một miền nhỏ.</li>
<li><strong>Đào sâu</strong> — ngoại lệ &amp; file, module &amp; môi trường ảo, decorator, generator và iterator.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết test (pytest), thêm type hint, theo PEP 8, và cấu trúc một dự án thật.</li>
</ol></div>`,
  ]]);

const intro = doc('apo201c-0-1-overview', 'Course overview: Advanced Python with OOP|||Tổng quan: Python nâng cao với OOP',
  'Python là gì và vì sao dùng OOP; từ script thủ tục sang mô hình đối tượng; lộ trình 8 chương: lõi ngôn ngữ → lớp & đối tượng → bốn trụ → dunder → ngoại lệ/file → module/venv → hàm nâng cao → kiểm thử.',
  [[
    `<span class="eyebrow">APO201c · Lesson 0.1 · Overview</span>
<h2>Advanced Python with OOP</h2>
<p class="lead">This course takes you from writing simple Python scripts to designing <strong>clean, object-oriented programs</strong>. You will refresh the language core, then learn to model problems with <strong>classes and objects</strong>, apply the four OOP pillars, customize behavior with dunder methods, and finish with professional practices: exceptions, packaging, functional tools and testing.</p>
<h3>Why OOP?</h3>
<p>As programs grow, loose functions and global variables become hard to maintain. <strong>Object-oriented programming</strong> bundles data and the behavior that acts on it into <strong>objects</strong>, so code mirrors the real domain (a User, an Account, a File) and stays easy to extend.</p>
<pre><code>Procedural  -&gt; data and functions are separate, passed around by hand
Object-oriented -&gt; data + behavior live together inside an object
</code></pre>
<h3>Roadmap</h3>
<p>Core Python (types, collections, functions) &amp; then: classes &amp; objects → the four pillars (encapsulation, inheritance, polymorphism, abstraction) → dunder/magic methods → exceptions &amp; files → modules, packages &amp; venv → functional &amp; advanced features → testing &amp; best practices. Bilingual, with runnable Python examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">APO201c · Bài 0.1 · Tổng quan</span>
<h2>Python nâng cao với OOP</h2>
<p class="lead">Môn này đưa bạn từ viết script Python đơn giản đến thiết kế <strong>chương trình hướng đối tượng gọn gàng</strong>. Bạn ôn lại lõi ngôn ngữ, rồi học mô hình hoá bài toán bằng <strong>lớp và đối tượng</strong>, áp dụng bốn trụ OOP, tuỳ biến hành vi bằng dunder method, và kết bằng các thực hành chuyên nghiệp: ngoại lệ, đóng gói, công cụ hàm và kiểm thử.</p>
<h3>Vì sao dùng OOP?</h3>
<p>Khi chương trình lớn dần, hàm rời rạc và biến toàn cục trở nên khó bảo trì. <strong>Lập trình hướng đối tượng</strong> gói dữ liệu và hành vi tác động lên nó vào trong <strong>đối tượng</strong>, nên code phản chiếu đúng miền thực tế (User, Account, File) và dễ mở rộng.</p>
<pre><code>Thủ tục     -&gt; dữ liệu và hàm tách rời, truyền qua lại bằng tay
Hướng đối tượng -&gt; dữ liệu + hành vi sống chung trong một đối tượng
</code></pre>
<h3>Lộ trình</h3>
<p>Lõi Python (kiểu, tập hợp, hàm) &amp; sau đó: lớp &amp; đối tượng → bốn trụ (đóng gói, kế thừa, đa hình, trừu tượng) → magic/dunder method → ngoại lệ &amp; file → module, package &amp; venv → hàm &amp; tính năng nâng cao → kiểm thử &amp; thực hành tốt. Song ngữ, có ví dụ Python chạy được và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('apo201c-1-1-core-python', '1.1 — Core Python refresher|||1.1 — Ôn Python cốt lõi',
  'Kiểu dữ liệu (int/float/str/bool), tập hợp list/dict/set/tuple, comprehension, hàm và tham số linh hoạt *args/**kwargs.',
  [[
    `<span class="eyebrow">APO201c · Chapter 1 · Lesson 1.1</span>
<h2>Core Python refresher</h2>
<h3>Types &amp; collections</h3>
<ul>
<li><strong>Scalars</strong> — int, float, str, bool. Strings are immutable.</li>
<li><strong>list</strong> — ordered, mutable sequence.</li>
<li><strong>tuple</strong> — ordered, <em>immutable</em>; good for fixed records.</li>
<li><strong>dict</strong> — key to value mapping, fast lookup.</li>
<li><strong>set</strong> — unordered collection of unique items.</li>
</ul>
<pre><code>nums = [1, 2, 3, 3]          # list
point = (10, 20)            # tuple
user = {"name": "An", "age": 20}  # dict
unique = set(nums)          # {1, 2, 3}

# Comprehension: build a list in one expression
squares = [n * n for n in nums if n &gt; 1]   # [4, 9, 9]
</code></pre>
<h3>Functions &amp; flexible arguments</h3>
<p><code>*args</code> collects extra positional arguments into a tuple; <code>**kwargs</code> collects extra keyword arguments into a dict.</p>
<pre><code>def report(title, *args, **kwargs):
    print(title)
    for a in args:
        print("item:", a)
    for key, value in kwargs.items():
        print(key, "=", value)

report("Scores", 8, 9, name="An", passed=True)
</code></pre>
<div class="callout"><span class="badge">Pick the right collection</span> Need order and change? list. Fixed record? tuple. Lookup by key? dict. Uniqueness? set. Choosing well makes code simpler and faster.</div>`,
    `<span class="eyebrow">APO201c · Chương 1 · Bài 1.1</span>
<h2>Ôn Python cốt lõi</h2>
<h3>Kiểu dữ liệu &amp; tập hợp</h3>
<ul>
<li><strong>Kiểu vô hướng</strong> — int, float, str, bool. Chuỗi là bất biến.</li>
<li><strong>list</strong> — dãy có thứ tự, thay đổi được.</li>
<li><strong>tuple</strong> — có thứ tự, <em>bất biến</em>; hợp cho bản ghi cố định.</li>
<li><strong>dict</strong> — ánh xạ khoá tới giá trị, tra cứu nhanh.</li>
<li><strong>set</strong> — tập không thứ tự gồm phần tử duy nhất.</li>
</ul>
<pre><code>nums = [1, 2, 3, 3]          # list
point = (10, 20)            # tuple
user = {"name": "An", "age": 20}  # dict
unique = set(nums)          # {1, 2, 3}

# Comprehension: dựng một list trong một biểu thức
squares = [n * n for n in nums if n &gt; 1]   # [4, 9, 9]
</code></pre>
<h3>Hàm &amp; tham số linh hoạt</h3>
<p><code>*args</code> gom các đối vị trí dư vào một tuple; <code>**kwargs</code> gom các đối từ khoá dư vào một dict.</p>
<pre><code>def report(title, *args, **kwargs):
    print(title)
    for a in args:
        print("item:", a)
    for key, value in kwargs.items():
        print(key, "=", value)

report("Scores", 8, 9, name="An", passed=True)
</code></pre>
<div class="callout"><span class="badge">Chọn đúng tập hợp</span> Cần thứ tự và thay đổi? list. Bản ghi cố định? tuple. Tra theo khoá? dict. Cần duy nhất? set. Chọn đúng làm code gọn và nhanh hơn.</div>`,
  ]]);

const c1q = quiz('apo201c-quiz-1', 'Quiz 1 — Core Python|||Quiz 1 — Python cốt lõi', [
  { id: 'q1', question: 'Kiểu tập hợp nào KHÔNG thay đổi được (bất biến)?', options: ['list', 'dict', 'tuple', 'set'], correctIndex: 2, explanation: 'tuple là bất biến — không thêm/sửa/xoá phần tử sau khi tạo.' },
  { id: 'q2', question: '**kwargs trong định nghĩa hàm gom các đối dư vào?', options: ['một list', 'một tuple', 'một dict (đối từ khoá)', 'một set'], correctIndex: 2, explanation: '**kwargs gom các đối từ khoá dư thành một dict; *args gom đối vị trí thành tuple.' },
  { id: 'q3', question: '[n*n for n in nums] là cú pháp gì?', options: ['Vòng lặp while', 'List comprehension', 'Định nghĩa hàm', 'Khối try/except'], correctIndex: 1, explanation: 'Đó là list comprehension — dựng list mới bằng một biểu thức ngắn gọn.' },
]);

const c2 = doc('apo201c-2-1-classes', '2.1 — Classes & objects|||2.1 — Lớp & đối tượng',
  'Định nghĩa class, hàm khởi tạo __init__, tham số self, phân biệt instance attribute và class attribute, method của đối tượng.',
  [[
    `<span class="eyebrow">APO201c · Chapter 2 · Lesson 2.1</span>
<h2>Classes &amp; objects</h2>
<p>A <strong>class</strong> is a blueprint; an <strong>object</strong> (instance) is a concrete thing built from it. <code>__init__</code> runs when you create an instance, and <code>self</code> refers to that instance.</p>
<pre><code>class Dog:
    species = "Canis familiaris"   # class attribute (shared by all)

    def __init__(self, name, age):
        self.name = name           # instance attribute (per object)
        self.age = age

    def bark(self):                # method
        return self.name + " says woof"

d1 = Dog("Rex", 3)
d2 = Dog("Kiki", 5)
print(d1.bark())        # Rex says woof
print(d2.species)       # Canis familiaris (shared)
</code></pre>
<h3>Instance vs class attribute</h3>
<ul>
<li><strong>Instance attribute</strong> — set on <code>self</code>, unique to each object.</li>
<li><strong>Class attribute</strong> — defined in the class body, shared by every instance unless shadowed.</li>
</ul>
<div class="callout"><span class="badge">self is not magic</span> The first parameter of a method is always the instance. Python passes it for you when you write <code>d1.bark()</code> — that is the same as <code>Dog.bark(d1)</code>.</div>`,
    `<span class="eyebrow">APO201c · Chương 2 · Bài 2.1</span>
<h2>Lớp &amp; đối tượng</h2>
<p>Một <strong>lớp (class)</strong> là bản thiết kế; một <strong>đối tượng (instance)</strong> là thực thể cụ thể dựng từ nó. <code>__init__</code> chạy khi bạn tạo một instance, và <code>self</code> trỏ tới chính instance đó.</p>
<pre><code>class Dog:
    species = "Canis familiaris"   # class attribute (mọi con dùng chung)

    def __init__(self, name, age):
        self.name = name           # instance attribute (riêng mỗi đối tượng)
        self.age = age

    def bark(self):                # method
        return self.name + " says woof"

d1 = Dog("Rex", 3)
d2 = Dog("Kiki", 5)
print(d1.bark())        # Rex says woof
print(d2.species)       # Canis familiaris (dùng chung)
</code></pre>
<h3>Instance attribute và class attribute</h3>
<ul>
<li><strong>Instance attribute</strong> — gán trên <code>self</code>, riêng từng đối tượng.</li>
<li><strong>Class attribute</strong> — khai trong thân lớp, mọi instance dùng chung trừ khi bị che.</li>
</ul>
<div class="callout"><span class="badge">self không phải phép màu</span> Tham số đầu của method luôn là chính đối tượng. Python tự truyền nó khi bạn viết <code>d1.bark()</code> — đúng bằng <code>Dog.bark(d1)</code>.</div>`,
  ]]);

const c2q = quiz('apo201c-quiz-2', 'Quiz 2 — Classes & objects|||Quiz 2 — Lớp & đối tượng', [
  { id: 'q1', question: 'Phương thức nào chạy tự động khi tạo một đối tượng mới?', options: ['__new__ mà lập trình viên phải gọi', '__init__', '__str__', 'main'], correctIndex: 1, explanation: '__init__ là hàm khởi tạo, chạy ngay khi bạn tạo instance.' },
  { id: 'q2', question: 'Tham số self trong method là gì?', options: ['Tên lớp', 'Chính đối tượng (instance) đang gọi method', 'Một biến toàn cục', 'Class attribute'], correctIndex: 1, explanation: 'self trỏ tới chính instance; d1.bark() tương đương Dog.bark(d1).' },
  { id: 'q3', question: 'Thuộc tính khai trong THÂN lớp (ngoài __init__), dùng chung mọi instance gọi là?', options: ['Instance attribute', 'Class attribute', 'Biến cục bộ', 'Tham số'], correctIndex: 1, explanation: 'Class attribute được chia sẻ cho mọi đối tượng, trừ khi bị che bởi instance attribute.' },
]);

const c3 = doc('apo201c-3-1-four-pillars', '3.1 — The four pillars of OOP|||3.1 — Bốn trụ của OOP',
  'Đóng gói (encapsulation), kế thừa (inheritance) với super(), đa hình (polymorphism), trừu tượng (abstraction) qua abstract base class.',
  [[
    `<span class="eyebrow">APO201c · Chapter 3 · Lesson 3.1</span>
<h2>The four pillars of OOP</h2>
<ul>
<li><strong>Encapsulation</strong> — hide internal state; expose a clean interface. A leading underscore signals private by convention.</li>
<li><strong>Inheritance</strong> — a subclass reuses and extends a parent; <code>super()</code> calls the parent version.</li>
<li><strong>Polymorphism</strong> — different classes offer the same method name; the caller does not care which class it is.</li>
<li><strong>Abstraction</strong> — hide details behind a simple contract (an abstract base class defines what, not how).</li>
</ul>
<pre><code>class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):                 # override (polymorphism)
        return self.name + ": meow"

class Kitten(Cat):
    def __init__(self, name):
        super().__init__(name)       # reuse parent init (inheritance)
        self.baby = True

for a in [Cat("Tom"), Kitten("Mi")]:
    print(a.speak())                 # same call, different behavior
</code></pre>
<div class="callout"><span class="badge">Favor composition too</span> Inheritance is powerful but tight. When two things are not truly a subtype, prefer composition (hold an object) over deep inheritance chains.</div>`,
    `<span class="eyebrow">APO201c · Chương 3 · Bài 3.1</span>
<h2>Bốn trụ của OOP</h2>
<ul>
<li><strong>Đóng gói (encapsulation)</strong> — giấu trạng thái bên trong; lộ ra một giao diện gọn. Dấu gạch dưới đầu tên báo hiệu "riêng tư" theo quy ước.</li>
<li><strong>Kế thừa (inheritance)</strong> — lớp con dùng lại và mở rộng lớp cha; <code>super()</code> gọi bản của lớp cha.</li>
<li><strong>Đa hình (polymorphism)</strong> — nhiều lớp cùng tên method; người gọi không cần biết đó là lớp nào.</li>
<li><strong>Trừu tượng (abstraction)</strong> — giấu chi tiết sau một hợp đồng đơn giản (abstract base class định nghĩa cái gì, không phải làm thế nào).</li>
</ul>
<pre><code>class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):                 # ghi đè (đa hình)
        return self.name + ": meow"

class Kitten(Cat):
    def __init__(self, name):
        super().__init__(name)       # dùng lại init của cha (kế thừa)
        self.baby = True

for a in [Cat("Tom"), Kitten("Mi")]:
    print(a.speak())                 # cùng lời gọi, hành vi khác nhau
</code></pre>
<div class="callout"><span class="badge">Ưu tiên cả composition</span> Kế thừa mạnh nhưng ràng buộc chặt. Khi hai thứ không thật sự là quan hệ cha-con, hãy ưu tiên composition (giữ một đối tượng) thay vì chuỗi kế thừa sâu.</div>`,
  ]]);

const c3q = quiz('apo201c-quiz-3', 'Quiz 3 — Four pillars|||Quiz 3 — Bốn trụ OOP', [
  { id: 'q1', question: 'super() dùng để?', options: ['Xoá lớp cha', 'Gọi phiên bản method/khởi tạo của lớp CHA', 'Tạo class attribute', 'Định nghĩa abstract method'], correctIndex: 1, explanation: 'super() truy cập triển khai của lớp cha, hay dùng trong __init__ của lớp con.' },
  { id: 'q2', question: 'Nhiều lớp cùng cung cấp method speak() và người gọi dùng chung một lời gọi — đó là trụ nào?', options: ['Đóng gói', 'Đa hình (polymorphism)', 'Trừu tượng', 'Kế thừa'], correctIndex: 1, explanation: 'Đa hình: cùng một giao diện, hành vi khác nhau tuỳ lớp thực tế.' },
  { id: 'q3', question: 'Giấu trạng thái bên trong và chỉ lộ giao diện gọn là trụ nào?', options: ['Đóng gói (encapsulation)', 'Đa hình', 'Kế thừa', 'Đệ quy'], correctIndex: 0, explanation: 'Đóng gói bảo vệ dữ liệu nội bộ; quy ước dấu gạch dưới đánh dấu thành phần riêng tư.' },
]);

const c4 = doc('apo201c-4-1-dunder', '4.1 — Magic (dunder) methods|||4.1 — Magic method (dunder)',
  'Các method đặc biệt __str__/__repr__/__eq__/__len__, và nạp chồng toán tử (operator overloading) như __add__ để đối tượng hoạt động tự nhiên.',
  [[
    `<span class="eyebrow">APO201c · Chapter 4 · Lesson 4.1</span>
<h2>Magic (dunder) methods</h2>
<p><strong>Dunder</strong> means double-underscore. These special methods let your objects work with built-in syntax: printing, comparison, <code>len()</code>, and operators like <code>+</code>.</p>
<ul>
<li><code>__str__</code> — friendly text for <code>print()</code>.</li>
<li><code>__repr__</code> — unambiguous text for developers/debugging.</li>
<li><code>__eq__</code> — defines what <code>==</code> means.</li>
<li><code>__len__</code> — makes <code>len(obj)</code> work.</li>
</ul>
<pre><code>class Money:
    def __init__(self, amount):
        self.amount = amount
    def __repr__(self):
        return "Money(" + str(self.amount) + ")"
    def __eq__(self, other):
        return self.amount == other.amount
    def __add__(self, other):          # operator overloading: +
        return Money(self.amount + other.amount)

a = Money(10)
b = Money(5)
print(a + b)          # Money(15)
print(a == Money(10)) # True
</code></pre>
<div class="callout"><span class="badge">repr for you, str for users</span> If you write only one, write <code>__repr__</code> — the interactive shell and containers fall back to it, so your objects never print as a cryptic memory address.</div>`,
    `<span class="eyebrow">APO201c · Chương 4 · Bài 4.1</span>
<h2>Magic method (dunder)</h2>
<p><strong>Dunder</strong> nghĩa là hai dấu gạch dưới. Các method đặc biệt này cho đối tượng của bạn làm việc với cú pháp có sẵn: in ra, so sánh, <code>len()</code>, và toán tử như <code>+</code>.</p>
<ul>
<li><code>__str__</code> — văn bản thân thiện cho <code>print()</code>.</li>
<li><code>__repr__</code> — văn bản rõ ràng cho lập trình viên/gỡ lỗi.</li>
<li><code>__eq__</code> — định nghĩa <code>==</code> nghĩa là gì.</li>
<li><code>__len__</code> — làm <code>len(obj)</code> chạy được.</li>
</ul>
<pre><code>class Money:
    def __init__(self, amount):
        self.amount = amount
    def __repr__(self):
        return "Money(" + str(self.amount) + ")"
    def __eq__(self, other):
        return self.amount == other.amount
    def __add__(self, other):          # nạp chồng toán tử: +
        return Money(self.amount + other.amount)

a = Money(10)
b = Money(5)
print(a + b)          # Money(15)
print(a == Money(10)) # True
</code></pre>
<div class="callout"><span class="badge">repr cho bạn, str cho người dùng</span> Nếu chỉ viết một cái, hãy viết <code>__repr__</code> — shell tương tác và các container rơi về nó, nên đối tượng của bạn không in ra dưới dạng địa chỉ bộ nhớ khó hiểu.</div>`,
  ]]);

const c4q = quiz('apo201c-quiz-4', 'Quiz 4 — Dunder methods|||Quiz 4 — Magic method', [
  { id: 'q1', question: 'Method nào định nghĩa ý nghĩa của toán tử == giữa hai đối tượng?', options: ['__str__', '__eq__', '__len__', '__add__'], correctIndex: 1, explanation: '__eq__ định nghĩa hành vi của == cho lớp của bạn.' },
  { id: 'q2', question: 'Định nghĩa __add__ cho một lớp để làm gì?', options: ['In đối tượng', 'Nạp chồng toán tử + (cộng hai đối tượng)', 'Đo độ dài', 'So sánh bằng'], correctIndex: 1, explanation: '__add__ là operator overloading cho dấu +.' },
  { id: 'q3', question: 'Nếu chỉ viết được MỘT method biểu diễn văn bản, nên viết cái nào?', options: ['__str__', '__repr__', '__len__', '__init__'], correctIndex: 1, explanation: '__repr__ được shell và container dùng làm dự phòng, nên nên ưu tiên nó.' },
]);

const c5 = doc('apo201c-5-1-exceptions-files', '5.1 — Exceptions & files|||5.1 — Ngoại lệ & file',
  'Xử lý ngoại lệ try/except/finally, tạo custom exception, dùng khối with để quản lý tài nguyên, đọc/ghi file an toàn.',
  [[
    `<span class="eyebrow">APO201c · Chapter 5 · Lesson 5.1</span>
<h2>Exceptions &amp; files</h2>
<h3>try / except / finally</h3>
<p>Catch errors so the program does not crash. <code>finally</code> always runs — even after a return or an error — so it is where cleanup goes.</p>
<pre><code>class InvalidAgeError(Exception):    # custom exception
    pass

def set_age(age):
    if age &lt; 0:
        raise InvalidAgeError("age must be non-negative")
    return age

try:
    set_age(-1)
except InvalidAgeError as e:
    print("rejected:", e)
finally:
    print("done checking")
</code></pre>
<h3>Files with <code>with</code></h3>
<p>The <code>with</code> statement (a context manager) closes the file automatically, even if an error is raised inside the block.</p>
<pre><code>with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("hello\\n")

with open("notes.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())
</code></pre>
<div class="callout"><span class="badge">Catch narrow, not bare</span> Prefer <code>except ValueError</code> over a bare <code>except:</code>. A blanket catch hides real bugs and swallows Ctrl+C.</div>`,
    `<span class="eyebrow">APO201c · Chương 5 · Bài 5.1</span>
<h2>Ngoại lệ &amp; file</h2>
<h3>try / except / finally</h3>
<p>Bắt lỗi để chương trình không sập. <code>finally</code> luôn chạy — kể cả sau return hay sau lỗi — nên đó là chỗ dọn dẹp tài nguyên.</p>
<pre><code>class InvalidAgeError(Exception):    # ngoại lệ tự định nghĩa
    pass

def set_age(age):
    if age &lt; 0:
        raise InvalidAgeError("age must be non-negative")
    return age

try:
    set_age(-1)
except InvalidAgeError as e:
    print("rejected:", e)
finally:
    print("done checking")
</code></pre>
<h3>File với <code>with</code></h3>
<p>Câu lệnh <code>with</code> (một context manager) tự đóng file, kể cả khi có lỗi phát sinh bên trong khối.</p>
<pre><code>with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("hello\\n")

with open("notes.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())
</code></pre>
<div class="callout"><span class="badge">Bắt hẹp, đừng bắt trống</span> Ưu tiên <code>except ValueError</code> hơn <code>except:</code> trống. Bắt tất giấu đi lỗi thật và nuốt cả Ctrl+C.</div>`,
  ]]);

const c5q = quiz('apo201c-quiz-5', 'Quiz 5 — Exceptions & files|||Quiz 5 — Ngoại lệ & file', [
  { id: 'q1', question: 'Khối nào LUÔN chạy, kể cả khi có lỗi hay return, dùng để dọn dẹp?', options: ['try', 'except', 'finally', 'else'], correctIndex: 2, explanation: 'finally luôn được thực thi — nơi lý tưởng để giải phóng tài nguyên.' },
  { id: 'q2', question: 'Câu lệnh with khi mở file có lợi gì?', options: ['Chạy nhanh hơn', 'Tự đóng file kể cả khi có lỗi', 'Bỏ qua mọi ngoại lệ', 'Ghi đè file cũ'], correctIndex: 1, explanation: 'with là context manager, tự đóng tài nguyên khi ra khỏi khối.' },
  { id: 'q3', question: 'Cách tạo một ngoại lệ tùy chỉnh (custom exception) là?', options: ['Tạo hàm trả về False', 'Tạo class kế thừa Exception', 'Dùng print', 'Đặt biến toàn cục'], correctIndex: 1, explanation: 'Custom exception là một class kế thừa từ Exception (hoặc lớp con của nó).' },
]);

const c6 = doc('apo201c-6-1-modules-venv', '6.1 — Modules, packages & virtual environments|||6.1 — Module, package & môi trường ảo',
  'Cơ chế import, tổ chức code thành module và package, cài thư viện bằng pip, cô lập phụ thuộc bằng venv và requirements.txt.',
  [[
    `<span class="eyebrow">APO201c · Chapter 6 · Lesson 6.1</span>
<h2>Modules, packages &amp; virtual environments</h2>
<h3>Modules &amp; packages</h3>
<ul>
<li>A <strong>module</strong> is a single <code>.py</code> file you can <code>import</code>.</li>
<li>A <strong>package</strong> is a folder of modules (traditionally with an <code>__init__.py</code>).</li>
</ul>
<pre><code># mathx.py  (a module)
def area(r):
    return 3.14159 * r * r

# main.py
import mathx
from mathx import area
print(area(2))          # 12.56636
</code></pre>
<h3>pip &amp; virtual environments</h3>
<p><code>pip</code> installs third-party libraries. A <strong>virtual environment</strong> (venv) gives each project its own isolated set of packages, so versions do not clash between projects.</p>
<pre><code>python -m venv .venv          # create an isolated environment
source .venv/bin/activate     # activate it (macOS/Linux)
pip install requests          # install into THIS project only
pip freeze &gt; requirements.txt # record exact versions
</code></pre>
<div class="callout"><span class="badge">One venv per project</span> Never install project libraries globally. A venv plus a committed <code>requirements.txt</code> makes your project reproducible on any machine.</div>`,
    `<span class="eyebrow">APO201c · Chương 6 · Bài 6.1</span>
<h2>Module, package &amp; môi trường ảo</h2>
<h3>Module &amp; package</h3>
<ul>
<li>Một <strong>module</strong> là một file <code>.py</code> đơn mà bạn có thể <code>import</code>.</li>
<li>Một <strong>package</strong> là một thư mục chứa nhiều module (thường có <code>__init__.py</code>).</li>
</ul>
<pre><code># mathx.py  (một module)
def area(r):
    return 3.14159 * r * r

# main.py
import mathx
from mathx import area
print(area(2))          # 12.56636
</code></pre>
<h3>pip &amp; môi trường ảo</h3>
<p><code>pip</code> cài các thư viện bên thứ ba. Một <strong>môi trường ảo</strong> (venv) cho mỗi dự án một bộ package cô lập riêng, nên phiên bản không xung đột giữa các dự án.</p>
<pre><code>python -m venv .venv          # tạo môi trường cô lập
source .venv/bin/activate     # kích hoạt (macOS/Linux)
pip install requests          # cài CHỈ cho dự án này
pip freeze &gt; requirements.txt # ghi lại phiên bản chính xác
</code></pre>
<div class="callout"><span class="badge">Mỗi dự án một venv</span> Đừng bao giờ cài thư viện dự án ra toàn cục. Một venv cộng với <code>requirements.txt</code> đã commit giúp dự án chạy lại được trên mọi máy.</div>`,
  ]]);

const c6q = quiz('apo201c-quiz-6', 'Quiz 6 — Modules & venv|||Quiz 6 — Module & venv', [
  { id: 'q1', question: 'Một môi trường ảo (venv) dùng để?', options: ['Tăng tốc CPU', 'Cô lập phụ thuộc riêng cho từng dự án', 'Biên dịch Python ra C', 'Nén file .py'], correctIndex: 1, explanation: 'venv cách ly các package của dự án, tránh xung đột phiên bản.' },
  { id: 'q2', question: 'Lệnh nào cài một thư viện bên thứ ba?', options: ['python new', 'pip install <ten>', 'import install', 'venv add'], correctIndex: 1, explanation: 'pip install <ten> cài thư viện; trong venv thì chỉ cài cho dự án đó.' },
  { id: 'q3', question: 'Một package trong Python là?', options: ['Một biến toàn cục', 'Một thư mục chứa nhiều module', 'Một hàm lambda', 'Một câu lệnh with'], correctIndex: 1, explanation: 'Package là thư mục gồm các module (thường có __init__.py); module là một file .py.' },
]);

const c7 = doc('apo201c-7-1-functional-advanced', '7.1 — Functional & advanced features|||7.1 — Lập trình hàm & nâng cao',
  'Hàm lambda, map/filter, decorator (bọc hàm), generator với yield, và iterator — nền của xử lý dữ liệu tiết kiệm bộ nhớ.',
  [[
    `<span class="eyebrow">APO201c · Chapter 7 · Lesson 7.1</span>
<h2>Functional &amp; advanced features</h2>
<h3>lambda, map, filter</h3>
<pre><code>nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, nums))    # [2, 4, 6, 8]
evens = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]
</code></pre>
<h3>Decorators</h3>
<p>A <strong>decorator</strong> is a function that wraps another function to add behavior (logging, timing, auth) without changing its body.</p>
<pre><code>def log(fn):
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@log
def greet(name):
    return "hi " + name

greet("An")     # prints: calling greet
</code></pre>
<h3>Generators &amp; iterators</h3>
<p>A <strong>generator</strong> uses <code>yield</code> to produce values lazily, one at a time — huge or infinite sequences without holding them all in memory.</p>
<pre><code>def countdown(n):
    while n &gt; 0:
        yield n
        n = n - 1

for x in countdown(3):
    print(x)      # 3, 2, 1
</code></pre>
<div class="callout"><span class="badge">Lazy is powerful</span> Generators produce values on demand, so you can stream a huge log file or an endless sequence with a tiny, constant memory footprint.</div>`,
    `<span class="eyebrow">APO201c · Chương 7 · Bài 7.1</span>
<h2>Lập trình hàm &amp; nâng cao</h2>
<h3>lambda, map, filter</h3>
<pre><code>nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, nums))    # [2, 4, 6, 8]
evens = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]
</code></pre>
<h3>Decorator</h3>
<p>Một <strong>decorator</strong> là một hàm bọc quanh hàm khác để thêm hành vi (ghi log, đo thời gian, xác thực) mà không sửa thân hàm gốc.</p>
<pre><code>def log(fn):
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper

@log
def greet(name):
    return "hi " + name

greet("An")     # in ra: calling greet
</code></pre>
<h3>Generator &amp; iterator</h3>
<p>Một <strong>generator</strong> dùng <code>yield</code> để sinh giá trị lười biếng, từng cái một — xử lý dãy khổng lồ hoặc vô hạn mà không giữ tất cả trong bộ nhớ.</p>
<pre><code>def countdown(n):
    while n &gt; 0:
        yield n
        n = n - 1

for x in countdown(3):
    print(x)      # 3, 2, 1
</code></pre>
<div class="callout"><span class="badge">Lười biếng là sức mạnh</span> Generator sinh giá trị theo yêu cầu, nên bạn có thể duyệt một file log khổng lồ hay một dãy vô tận với bộ nhớ nhỏ và không đổi.</div>`,
  ]]);

const c7q = quiz('apo201c-quiz-7', 'Quiz 7 — Functional & advanced|||Quiz 7 — Hàm & nâng cao', [
  { id: 'q1', question: 'Từ khoá nào biến một hàm thành generator (sinh giá trị lười biếng)?', options: ['return', 'yield', 'lambda', 'async'], correctIndex: 1, explanation: 'yield tạm dừng hàm và trả về một giá trị mỗi lần lặp — đó là generator.' },
  { id: 'q2', question: 'Một decorator về bản chất là?', options: ['Một class attribute', 'Một hàm bọc quanh hàm khác để thêm hành vi', 'Một kiểu dữ liệu', 'Một câu lệnh import'], correctIndex: 1, explanation: 'Decorator nhận một hàm, trả về hàm mới có thêm hành vi, dùng qua cú pháp @.' },
  { id: 'q3', question: 'lambda x: x * 2 là gì?', options: ['Một hàm ẩn danh (nặc danh) ngắn gọn', 'Một vòng lặp', 'Một class', 'Một ngoại lệ'], correctIndex: 0, explanation: 'lambda tạo một hàm nhỏ không tên, thường truyền vào map/filter/sorted.' },
]);

const c8 = doc('apo201c-8-1-testing-best-practices', '8.1 — Testing & best practices|||8.1 — Kiểm thử & thực hành tốt',
  'Viết test với unittest và pytest, thêm type hints, tuân thủ PEP8, và tổ chức cấu trúc một dự án Python đúng chuẩn.',
  [[
    `<span class="eyebrow">APO201c · Chapter 8 · Lesson 8.1</span>
<h2>Testing &amp; best practices</h2>
<h3>Testing with pytest</h3>
<p>Automated tests prove your code works and keep it working as it changes. <strong>pytest</strong> keeps tests short: just plain functions and <code>assert</code>.</p>
<pre><code># mathx.py
def add(a, b):
    return a + b

# test_mathx.py
from mathx import add

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
# run:  pytest -q
</code></pre>
<h3>Type hints &amp; PEP 8</h3>
<p><strong>Type hints</strong> document intent and let tools catch mistakes early. <strong>PEP 8</strong> is the standard style (4-space indent, snake_case names, clear spacing).</p>
<pre><code>def total(prices: list[float], tax: float = 0.0) -&gt; float:
    return sum(prices) * (1 + tax)
</code></pre>
<h3>Project structure</h3>
<pre><code>myproject/
  src/mypkg/__init__.py
  src/mypkg/core.py
  tests/test_core.py
  requirements.txt
  README.md
</code></pre>
<div class="callout"><span class="badge">Tests are documentation</span> A good test suite is executable documentation: it shows how the code is meant to be used and fails loudly the moment a change breaks that contract.</div>`,
    `<span class="eyebrow">APO201c · Chương 8 · Bài 8.1</span>
<h2>Kiểm thử &amp; thực hành tốt</h2>
<h3>Kiểm thử với pytest</h3>
<p>Test tự động chứng minh code chạy đúng và giữ nó đúng khi thay đổi. <strong>pytest</strong> giữ test ngắn gọn: chỉ là hàm thường và <code>assert</code>.</p>
<pre><code># mathx.py
def add(a, b):
    return a + b

# test_mathx.py
from mathx import add

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
# chạy:  pytest -q
</code></pre>
<h3>Type hints &amp; PEP 8</h3>
<p><strong>Type hints</strong> nói rõ ý định và giúp công cụ bắt lỗi sớm. <strong>PEP 8</strong> là quy ước style chuẩn (thụt 4 khoảng trắng, tên snake_case, giãn cách rõ ràng).</p>
<pre><code>def total(prices: list[float], tax: float = 0.0) -&gt; float:
    return sum(prices) * (1 + tax)
</code></pre>
<h3>Cấu trúc dự án</h3>
<pre><code>myproject/
  src/mypkg/__init__.py
  src/mypkg/core.py
  tests/test_core.py
  requirements.txt
  README.md
</code></pre>
<div class="callout"><span class="badge">Test là tài liệu</span> Một bộ test tốt là tài liệu chạy được: nó cho thấy code được dùng thế nào và báo lỗi to ngay khi một thay đổi phá vỡ hợp đồng đó.</div>`,
  ]]);

const c8q = quiz('apo201c-quiz-8', 'Quiz 8 — Testing & best practices|||Quiz 8 — Kiểm thử & thực hành tốt', [
  { id: 'q1', question: 'PEP 8 là gì?', options: ['Một thư viện kiểm thử', 'Quy ước (style guide) viết code Python', 'Một trình thông dịch', 'Một loại ngoại lệ'], correctIndex: 1, explanation: 'PEP 8 là hướng dẫn phong cách chuẩn: thụt 4 khoảng, snake_case, giãn cách rõ.' },
  { id: 'q2', question: 'Trong pytest, một hàm test thường khẳng định kết quả bằng?', options: ['print', 'assert', 'return True', 'raise'], correctIndex: 1, explanation: 'pytest dùng assert; nếu biểu thức sai, test thất bại và báo chi tiết.' },
  { id: 'q3', question: 'def total(x: list[float]) -> float: phần list[float] và float là?', options: ['Chú thích type hint', 'Giá trị mặc định', 'Decorator', 'Import'], correctIndex: 0, explanation: 'Đó là type hints — nói rõ kiểu tham số và kiểu trả về, giúp công cụ bắt lỗi sớm.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'APO201c',
    slug: 'apo201c-advanced-python-with-oop',
    title: 'Advanced Python with OOP',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/APO201c.webp',
    shortDescription: 'Advanced Python with OOP — core Python refresher, classes & objects, four OOP pillars, dunder methods, exceptions & files, modules & venv, functional & advanced features, testing & best practices. Bilingual with Python code & quizzes.|||Python nâng cao với OOP — ôn Python cốt lõi, lớp & đối tượng, bốn trụ OOP, magic method, ngoại lệ & file, module & venv, lập trình hàm & nâng cao, kiểm thử & thực hành tốt. Song ngữ, có code Python & quiz.',
    description: 'Môn <strong>APO201c — Advanced Python with OOP</strong> (kỳ 2, ngành An toàn thông tin) đưa bạn từ script Python sang <strong>thiết kế hướng đối tượng</strong> gọn gàng. Từ <strong>ôn lõi ngôn ngữ</strong> (kiểu dữ liệu, list/dict/set/tuple, comprehension, hàm, *args/**kwargs) → <strong>lớp &amp; đối tượng</strong> (__init__, self, instance/class attribute) → <strong>bốn trụ OOP</strong> (đóng gói, kế thừa, đa hình, trừu tượng, super()) → <strong>magic method</strong> (__str__/__repr__/__eq__, nạp chồng toán tử) → <strong>ngoại lệ &amp; file</strong> → <strong>module, package &amp; venv</strong> → <strong>lập trình hàm &amp; nâng cao</strong> (lambda, decorator, generator) → <strong>kiểm thử &amp; thực hành tốt</strong> (pytest, type hints, PEP 8). Bám giáo trình chuẩn (Lutz, Ramalho, Python.org), song ngữ, nhiều code Python và quiz mỗi chương.',
    whatYouLearn: 'Kiểu dữ liệu &amp; tập hợp (list/dict/set/tuple), comprehension, hàm với *args/**kwargs; định nghĩa class, __init__, self, instance vs class attribute; bốn trụ OOP (encapsulation, inheritance với super(), polymorphism, abstraction); magic/dunder method &amp; operator overloading; try/except/finally, custom exception, with, đọc/ghi file; module, package, pip &amp; venv; lambda, map/filter, decorator, generator, iterator; unittest/pytest, type hints, PEP 8 &amp; cấu trúc dự án.',
    requirements: 'Đã học lập trình Python cơ bản (biến, if/for/while, hàm) — ví dụ PRF192 hoặc tương đương. Cần cài Python 3 và một trình soạn thảo (khuyến nghị VS Code).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Lutz, Ramalho), Python.org, Real Python, LeetCode, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Python & OOP, từ thủ tục sang đối tượng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Ôn Python cốt lõi|||Chapter 1 — Core Python', description: 'Kiểu dữ liệu, list/dict/set/tuple, comprehension, hàm, *args/**kwargs.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Lớp & đối tượng|||Chapter 2 — Classes & objects', description: 'class, __init__, self, instance/class attribute, method.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Bốn trụ OOP|||Chapter 3 — Four pillars', description: 'Đóng gói, kế thừa (super()), đa hình, trừu tượng.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Magic method|||Chapter 4 — Dunder methods', description: '__str__/__repr__/__eq__/__len__, nạp chồng toán tử.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Ngoại lệ & file|||Chapter 5 — Exceptions & files', description: 'try/except/finally, custom exception, with, đọc/ghi file.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Module, package & venv|||Chapter 6 — Modules & venv', description: 'import, package, pip, môi trường ảo.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Hàm & nâng cao|||Chapter 7 — Functional & advanced', description: 'lambda, map/filter, decorator, generator, iterator.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Kiểm thử & thực hành tốt|||Chapter 8 — Testing & best practices', description: 'unittest/pytest, type hints, PEP 8, cấu trúc dự án.', lessons: [c8, c8q] },
  ],
};
