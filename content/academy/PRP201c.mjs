/**
 * PRP201c — Python Programming. Giáo trình FLM. Không slide gốc → soạn từ
 * syllabus + kiến thức, song ngữ, code Python thật, kèm BÀI TẬP. Giữ NGUYÊN slug.
 * ⚠️ code mẫu: KHÔNG backtick/${ } (vỡ template literal .mjs).
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 420, questions } });

const intro = doc('prp201c-0-1-overview', 'Course overview: Python Programming|||Tổng quan môn: Lập trình Python',
  'Mục tiêu, 4 CLO (cơ bản lập trình; cấu trúc dữ liệu; app xử lý dữ liệu; SQL & thiết kế CSDL), lộ trình, và cách đánh giá.',
  [[
    `<span class="eyebrow">PRP201c · Lesson 0.1 · Overview</span>
<h2>Python Programming</h2>
<p class="lead">Python is a clean, readable, batteries-included language — ideal for a first or second language, automation, data processing and AI. This course goes from <strong>fundamentals</strong> → <strong>data structures</strong> → <strong>functions &amp; files</strong> → <strong>data retrieval/processing</strong> → <strong>SQL &amp; databases</strong>.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — the basics of programming in Python</li>
<li><strong>CLO2</strong> — fundamental concepts such as data structures</li>
<li><strong>CLO3</strong> — build applications for data retrieval and processing</li>
<li><strong>CLO4</strong> — the basics of SQL and database design</li>
</ul>
<h3>Why Python</h3>
<p>Python reads almost like English, uses <strong>indentation</strong> (not braces) to define blocks, and comes with a huge standard library plus packages (via <code>pip</code>). Run code with <code>python file.py</code> or interactively in the REPL / Jupyter.</p>`,
    `<span class="eyebrow">PRP201c · Bài 0.1 · Tổng quan</span>
<h2>Lập trình Python</h2>
<p class="lead">Python gọn, dễ đọc, "pin sẵn trong hộp" — lý tưởng làm ngôn ngữ đầu/thứ hai, tự động hoá, xử lý dữ liệu và AI. Môn này đi từ <strong>nền tảng</strong> → <strong>cấu trúc dữ liệu</strong> → <strong>hàm &amp; file</strong> → <strong>truy xuất/xử lý dữ liệu</strong> → <strong>SQL &amp; cơ sở dữ liệu</strong>.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — cơ bản lập trình bằng Python</li>
<li><strong>CLO2</strong> — khái niệm nền như cấu trúc dữ liệu</li>
<li><strong>CLO3</strong> — xây ứng dụng truy xuất và xử lý dữ liệu</li>
<li><strong>CLO4</strong> — cơ bản SQL và thiết kế cơ sở dữ liệu</li>
</ul>
<h3>Vì sao Python</h3>
<p>Python đọc gần như tiếng Anh, dùng <strong>thụt lề</strong> (không phải ngoặc) để định nghĩa khối, và có thư viện chuẩn khổng lồ cùng gói (qua <code>pip</code>). Chạy bằng <code>python file.py</code> hoặc tương tác trong REPL / Jupyter.</p>`,
  ]]);

const c1 = doc('prp201c-1-1-basics', '1.1 — Python basics: variables, types, I/O|||1.1 — Python cơ bản: biến, kiểu, nhập/xuất',
  'Biến & kiểu động (int/float/str/bool), f-string, ép kiểu, toán tử, input()/print(), và thụt lề định nghĩa khối.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 1 · Lesson 1.1</span>
<h2>Variables, types &amp; I/O</h2>
<p class="lead">Python is <strong>dynamically typed</strong>: you don't declare types, the value decides. Core types: <code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code>.</p>
<pre><code class="language-python">name = input("Your name: ")     # always a str
age = int(input("Age: "))       # convert to int
height = 1.72
is_student = True

print(f"Hi {name}, next year you are {age + 1}")   # f-string
print(type(height))             # &lt;class 'float'&gt;
</code></pre>
<p><strong>f-strings</strong> (<code>f"...{expr}..."</code>) embed expressions in text. Convert with <code>int()</code>, <code>float()</code>, <code>str()</code>. Blocks are defined by <strong>indentation</strong> (4 spaces), not braces — consistent indentation is required, not optional.</p>`,
    `<span class="eyebrow">PRP201c · Chương 1 · Bài 1.1</span>
<h2>Biến, kiểu &amp; nhập/xuất</h2>
<p class="lead">Python <strong>định kiểu động</strong>: không khai báo kiểu, giá trị quyết định. Kiểu cốt lõi: <code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code>.</p>
<pre><code class="language-python">name = input("Tên: ")           # luôn là str
age = int(input("Tuổi: "))      # ép sang int
height = 1.72
is_student = True

print(f"Chào {name}, sang năm bạn {age + 1} tuổi")   # f-string
print(type(height))             # &lt;class 'float'&gt;
</code></pre>
<p><strong>f-string</strong> (<code>f"...{biểu_thức}..."</code>) nhúng biểu thức vào chuỗi. Ép kiểu bằng <code>int()</code>, <code>float()</code>, <code>str()</code>. Khối định nghĩa bằng <strong>thụt lề</strong> (4 dấu cách), không phải ngoặc — thụt lề nhất quán là bắt buộc.</p>`,
  ]]);

const c1q = quiz('prp201c-quiz-1', 'Quiz 1 — Basics|||Quiz 1 — Cơ bản', [
  { id: 'q1', question: 'input() trong Python luôn trả về kiểu?', options: ['int', 'str', 'float', 'tuỳ dữ liệu'], correctIndex: 1, explanation: 'input() luôn trả str; cần int()/float() để ép.' },
  { id: 'q2', question: 'Python định nghĩa khối lệnh bằng?', options: ['{ }', 'Thụt lề (indentation)', 'begin/end', ';'], correctIndex: 1, explanation: 'Thụt lề nhất quán (4 space) định nghĩa khối.' },
  { id: 'q3', question: 'f"{x+1}" là gì?', options: ['Lỗi cú pháp', 'f-string nhúng biểu thức x+1', 'Comment', 'Chia lấy dư'], correctIndex: 1, explanation: 'f-string cho nhúng biểu thức vào chuỗi.' },
]);

const c2 = doc('prp201c-2-1-control-flow', '2.1 — Control flow: if, for, while|||2.1 — Điều khiển luồng: if, for, while',
  'Rẽ nhánh if/elif/else, vòng lặp for (range, duyệt collection) & while, break/continue; ví dụ đọc dữ liệu và lọc.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 2 · Lesson 2.1</span>
<h2>Control flow</h2>
<pre><code class="language-python"># branching
score = 72
if score &gt;= 80:
    grade = "A"
elif score &gt;= 50:
    grade = "C"
else:
    grade = "F"

# for over a range and over a list
for i in range(3):          # 0,1,2
    print(i)

for name in ["An", "Binh"]:
    print(name)

# while with break/continue
n = 0
while True:
    n += 1
    if n % 2 == 0:
        continue            # skip evens
    if n &gt; 5:
        break               # stop
    print(n)                # 1,3,5
</code></pre>
<p><code>range(start, stop, step)</code> generates numbers; <code>for x in collection</code> iterates directly (no index needed). <code>break</code> exits the loop; <code>continue</code> skips to the next iteration.</p>`,
    `<span class="eyebrow">PRP201c · Chương 2 · Bài 2.1</span>
<h2>Điều khiển luồng</h2>
<pre><code class="language-python"># rẽ nhánh
score = 72
if score &gt;= 80:
    grade = "A"
elif score &gt;= 50:
    grade = "C"
else:
    grade = "F"

# for trên range và trên list
for i in range(3):          # 0,1,2
    print(i)

for name in ["An", "Binh"]:
    print(name)

# while với break/continue
n = 0
while True:
    n += 1
    if n % 2 == 0:
        continue            # bỏ số chẵn
    if n &gt; 5:
        break               # dừng
    print(n)                # 1,3,5
</code></pre>
<p><code>range(start, stop, step)</code> sinh số; <code>for x in collection</code> duyệt trực tiếp (không cần chỉ số). <code>break</code> thoát vòng lặp; <code>continue</code> nhảy sang vòng kế.</p>`,
  ]]);

const c2q = quiz('prp201c-quiz-2', 'Quiz 2 — Control flow|||Quiz 2 — Điều khiển luồng', [
  { id: 'q1', question: 'range(3) sinh ra?', options: ['1,2,3', '0,1,2', '0,1,2,3', '3'], correctIndex: 1, explanation: 'range(3) → 0,1,2 (không gồm 3).' },
  { id: 'q2', question: 'continue trong vòng lặp làm gì?', options: ['Thoát vòng lặp', 'Nhảy sang vòng lặp kế', 'Dừng chương trình', 'Lặp lại từ đầu'], correctIndex: 1, explanation: 'continue bỏ phần còn lại và sang vòng tiếp; break mới thoát.' },
]);

const c3 = doc('prp201c-3-1-data-structures', '3.1 — Data structures: list, tuple, dict, set|||3.1 — Cấu trúc dữ liệu: list, tuple, dict, set',
  'list (thay đổi được), tuple (bất biến), dict (key→value), set (không trùng); các thao tác chính và list comprehension.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 3 · Lesson 3.1</span>
<h2>Data structures</h2>
<pre><code class="language-python">nums = [5, 2, 9]            # list — ordered, mutable
nums.append(1); nums.sort() # [1,2,5,9]

point = (3, 4)              # tuple — immutable

ages = {"An": 20, "Binh": 21}   # dict — key → value
ages["Cuong"] = 22
for name, age in ages.items():
    print(name, age)

unique = {1, 2, 2, 3}      # set — no duplicates → {1,2,3}

# list comprehension: squares of evens
evens_sq = [x*x for x in range(10) if x % 2 == 0]   # [0,4,16,36,64]
</code></pre>
<p>Pick the right structure: <strong>list</strong> for an ordered, changeable sequence; <strong>tuple</strong> for a fixed record; <strong>dict</strong> for fast key lookups; <strong>set</strong> for membership and de-duplication. <strong>Comprehensions</strong> build lists/dicts/sets concisely.</p>`,
    `<span class="eyebrow">PRP201c · Chương 3 · Bài 3.1</span>
<h2>Cấu trúc dữ liệu</h2>
<pre><code class="language-python">nums = [5, 2, 9]            # list — có thứ tự, đổi được
nums.append(1); nums.sort() # [1,2,5,9]

point = (3, 4)              # tuple — bất biến

ages = {"An": 20, "Binh": 21}   # dict — key → value
ages["Cuong"] = 22
for name, age in ages.items():
    print(name, age)

unique = {1, 2, 2, 3}      # set — không trùng → {1,2,3}

# list comprehension: bình phương số chẵn
evens_sq = [x*x for x in range(10) if x % 2 == 0]   # [0,4,16,36,64]
</code></pre>
<p>Chọn đúng cấu trúc: <strong>list</strong> cho chuỗi có thứ tự, đổi được; <strong>tuple</strong> cho bản ghi cố định; <strong>dict</strong> cho tra key nhanh; <strong>set</strong> cho kiểm tra thành viên và khử trùng. <strong>Comprehension</strong> dựng list/dict/set gọn.</p>`,
  ]]);

const c3e = doc('prp201c-3-2-exercise', 'Exercise 1 — word frequency|||Bài tập 1 — đếm tần suất từ',
  'Bài tập: đếm số lần xuất hiện mỗi từ trong một câu bằng dict; kèm lời giải.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 3 · Exercise</span>
<h2>Exercise 1 — count word frequencies</h2>
<div class="callout"><span class="badge">Đề</span> Given a sentence, print each distinct word and how many times it appears (case-insensitive).</div>
<h3>Worked solution</h3>
<pre><code class="language-python">text = "the cat sat on the mat the cat"
counts = {}
for word in text.lower().split():
    counts[word] = counts.get(word, 0) + 1

for word, n in sorted(counts.items()):
    print(f"{word}: {n}")
# cat: 2 / mat: 1 / on: 1 / sat: 1 / the: 3
</code></pre>
<p><strong>Why:</strong> <code>split()</code> tokenizes on whitespace; <code>dict.get(word, 0)</code> returns 0 for unseen words so the counter starts cleanly. This dict-as-counter pattern is everywhere in data processing (Python even has <code>collections.Counter</code> that does it in one line).</p>`,
    `<span class="eyebrow">PRP201c · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — đếm tần suất từ</h2>
<div class="callout"><span class="badge">Đề</span> Cho một câu, in mỗi từ khác nhau và số lần xuất hiện (không phân biệt hoa/thường).</div>
<h3>Lời giải</h3>
<pre><code class="language-python">text = "the cat sat on the mat the cat"
counts = {}
for word in text.lower().split():
    counts[word] = counts.get(word, 0) + 1

for word, n in sorted(counts.items()):
    print(f"{word}: {n}")
# cat: 2 / mat: 1 / on: 1 / sat: 1 / the: 3
</code></pre>
<p><strong>Vì sao:</strong> <code>split()</code> tách theo khoảng trắng; <code>dict.get(word, 0)</code> trả 0 cho từ chưa gặp nên bộ đếm khởi sạch. Mẫu dùng dict làm bộ đếm này có mặt khắp xử lý dữ liệu (Python còn có <code>collections.Counter</code> làm một dòng).</p>`,
  ]]);

const c3q = quiz('prp201c-quiz-3', 'Quiz 3 — Data structures|||Quiz 3 — Cấu trúc dữ liệu', [
  { id: 'q1', question: 'Cấu trúc nào BẤT BIẾN?', options: ['list', 'tuple', 'dict', 'set'], correctIndex: 1, explanation: 'tuple bất biến; list/dict/set đổi được.' },
  { id: 'q2', question: 'dict dùng để?', options: ['Chuỗi có thứ tự', 'Tra key → value', 'Khử trùng', 'Bản ghi cố định'], correctIndex: 1, explanation: 'dict ánh xạ key→value, tra nhanh.' },
  { id: 'q3', question: '[x*x for x in range(4)] cho?', options: ['[0,1,4,9]', '[1,4,9,16]', '[0,1,2,3]', 'Lỗi'], correctIndex: 0, explanation: 'x=0,1,2,3 → bình phương 0,1,4,9.' },
]);

const c4 = doc('prp201c-4-1-functions-files', '4.1 — Functions, modules & files|||4.1 — Hàm, module & file',
  'Định nghĩa hàm (tham số mặc định, *args/**kwargs), import module, đọc/ghi file với with, và xử lý ngoại lệ try/except.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 4 · Lesson 4.1</span>
<h2>Functions, modules &amp; files</h2>
<pre><code class="language-python">def greet(name, greeting="Hi"):        # default parameter
    return f"{greeting}, {name}!"

print(greet("An"))                     # Hi, An!
print(greet("Binh", greeting="Hello")) # Hello, Binh!

import math
print(math.sqrt(16))                   # 4.0

# read/write files — 'with' closes the file automatically
with open("data.txt", "w") as f:
    f.write("line1\\nline2\\n")

with open("data.txt") as f:
    for line in f:
        print(line.strip())

# exceptions
try:
    x = int("abc")
except ValueError as e:
    print("bad number:", e)
</code></pre>
<p>Functions organize reusable logic; <code>import</code> pulls in the standard library and packages; the <code>with</code> block guarantees the file closes even on error; <code>try/except</code> handles failures gracefully.</p>`,
    `<span class="eyebrow">PRP201c · Chương 4 · Bài 4.1</span>
<h2>Hàm, module &amp; file</h2>
<pre><code class="language-python">def greet(name, greeting="Hi"):        # tham số mặc định
    return f"{greeting}, {name}!"

print(greet("An"))                     # Hi, An!
print(greet("Binh", greeting="Hello")) # Hello, Binh!

import math
print(math.sqrt(16))                   # 4.0

# đọc/ghi file — 'with' tự đóng file
with open("data.txt", "w") as f:
    f.write("line1\\nline2\\n")

with open("data.txt") as f:
    for line in f:
        print(line.strip())

# ngoại lệ
try:
    x = int("abc")
except ValueError as e:
    print("số sai:", e)
</code></pre>
<p>Hàm gói logic tái dùng; <code>import</code> nạp thư viện chuẩn và gói; khối <code>with</code> bảo đảm file đóng kể cả khi lỗi; <code>try/except</code> xử lý thất bại gọn.</p>`,
  ]]);

const c4q = quiz('prp201c-quiz-4', 'Quiz 4 — Functions & files|||Quiz 4 — Hàm & file', [
  { id: 'q1', question: 'with open(...) as f: bảo đảm điều gì?', options: ['File nhanh hơn', 'File tự đóng kể cả khi lỗi', 'Không bao giờ lỗi', 'Ghi nhanh hơn'], correctIndex: 1, explanation: 'with tự gọi close() ở cuối khối, kể cả khi có ngoại lệ.' },
  { id: 'q2', question: 'def f(x, y=5): thì y là?', options: ['Bắt buộc', 'Tham số mặc định (=5 nếu không truyền)', 'Kiểu int', 'Biến toàn cục'], correctIndex: 1, explanation: 'y=5 là tham số mặc định.' },
]);

const c5 = doc('prp201c-5-1-data-apps', '5.1 — Data retrieval & processing (JSON, CSV, API)|||5.1 — Truy xuất & xử lý dữ liệu (JSON, CSV, API)',
  'Đọc/ghi CSV & JSON, gọi API web bằng requests, và xử lý dữ liệu (lọc/tổng hợp); ví dụ end-to-end nhỏ.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 5 · Lesson 5.1</span>
<h2>Data retrieval &amp; processing</h2>
<p class="lead">Real apps read data from files and web APIs, transform it, and write results. Python's standard library (<code>csv</code>, <code>json</code>) plus <code>requests</code> covers most of it.</p>
<pre><code class="language-python">import csv, json, requests

# read a CSV into dicts
with open("people.csv") as f:
    rows = list(csv.DictReader(f))
adults = [r for r in rows if int(r["age"]) &gt;= 18]

# call a web API (returns JSON)
resp = requests.get("https://api.example.com/users")
users = resp.json()                      # list of dicts
names = [u["name"] for u in users]

# write results as JSON
with open("adults.json", "w") as f:
    json.dump(adults, f, indent=2)
</code></pre>
<p><code>csv.DictReader</code> yields each row as a dict keyed by header; <code>requests.get(...).json()</code> fetches and parses JSON; list comprehensions filter/transform. This read → filter → write pipeline is the heart of data processing.</p>`,
    `<span class="eyebrow">PRP201c · Chương 5 · Bài 5.1</span>
<h2>Truy xuất &amp; xử lý dữ liệu</h2>
<p class="lead">Ứng dụng thật đọc dữ liệu từ file và API web, biến đổi, rồi ghi kết quả. Thư viện chuẩn Python (<code>csv</code>, <code>json</code>) cộng <code>requests</code> phủ hầu hết.</p>
<pre><code class="language-python">import csv, json, requests

# đọc CSV thành list dict
with open("people.csv") as f:
    rows = list(csv.DictReader(f))
adults = [r for r in rows if int(r["age"]) &gt;= 18]

# gọi API web (trả JSON)
resp = requests.get("https://api.example.com/users")
users = resp.json()                      # list dict
names = [u["name"] for u in users]

# ghi kết quả dạng JSON
with open("adults.json", "w") as f:
    json.dump(adults, f, indent=2)
</code></pre>
<p><code>csv.DictReader</code> trả mỗi hàng thành dict theo header; <code>requests.get(...).json()</code> tải và parse JSON; list comprehension lọc/biến đổi. Pipeline đọc → lọc → ghi này là trái tim của xử lý dữ liệu.</p>`,
  ]]);

const c5q = quiz('prp201c-quiz-5', 'Quiz 5 — Data processing|||Quiz 5 — Xử lý dữ liệu', [
  { id: 'q1', question: 'csv.DictReader trả mỗi hàng dưới dạng?', options: ['list', 'dict (theo header)', 'tuple', 'str'], correctIndex: 1, explanation: 'DictReader map mỗi hàng thành dict keyed theo dòng header.' },
  { id: 'q2', question: 'requests.get(url).json() làm gì?', options: ['Chỉ tải HTML', 'Tải và parse JSON thành object Python', 'Ghi file', 'Mở socket'], correctIndex: 1, explanation: 'Tải phản hồi và parse JSON thành list/dict Python.' },
]);

const c6 = doc('prp201c-6-1-sql', '6.1 — SQL & databases (sqlite3)|||6.1 — SQL & cơ sở dữ liệu (sqlite3)',
  'Cơ bản thiết kế CSDL (bảng, khoá chính/ngoại), SQL (CREATE/INSERT/SELECT/WHERE/JOIN), và dùng sqlite3 trong Python (tham số hoá chống SQL injection).',
  [[
    `<span class="eyebrow">PRP201c · Chapter 6 · Lesson 6.1</span>
<h2>SQL &amp; databases</h2>
<p class="lead">A relational database stores data in <strong>tables</strong> (rows &amp; typed columns). A <strong>primary key</strong> uniquely identifies a row; a <strong>foreign key</strong> links to another table. <strong>SQL</strong> is the query language.</p>
<pre><code class="language-sql">CREATE TABLE product (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  price REAL
);
INSERT INTO product (name, price) VALUES ('Book', 120000);
SELECT name, price FROM product WHERE price &lt; 200000 ORDER BY name;
</code></pre>
<pre><code class="language-python">import sqlite3
conn = sqlite3.connect("shop.db")
cur = conn.cursor()
# parameterized query — prevents SQL injection
cur.execute("SELECT * FROM product WHERE price &lt; ?", (200000,))
for row in cur.fetchall():
    print(row)
conn.commit(); conn.close()
</code></pre>
<div class="pitfall"><b>ĐỪNG ghép chuỗi vào câu SQL</b> (vd "... WHERE name='" + user + "'") — đó là lỗ hổng <b>SQL injection</b>. Luôn dùng tham số hoá với dấu <code>?</code> như trên.</div>`,
    `<span class="eyebrow">PRP201c · Chương 6 · Bài 6.1</span>
<h2>SQL &amp; cơ sở dữ liệu</h2>
<p class="lead">Cơ sở dữ liệu quan hệ lưu dữ liệu trong <strong>bảng</strong> (hàng &amp; cột có kiểu). <strong>Khoá chính</strong> định danh duy nhất một hàng; <strong>khoá ngoại</strong> liên kết tới bảng khác. <strong>SQL</strong> là ngôn ngữ truy vấn.</p>
<pre><code class="language-sql">CREATE TABLE product (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  price REAL
);
INSERT INTO product (name, price) VALUES ('Book', 120000);
SELECT name, price FROM product WHERE price &lt; 200000 ORDER BY name;
</code></pre>
<pre><code class="language-python">import sqlite3
conn = sqlite3.connect("shop.db")
cur = conn.cursor()
# truy vấn tham số hoá — chống SQL injection
cur.execute("SELECT * FROM product WHERE price &lt; ?", (200000,))
for row in cur.fetchall():
    print(row)
conn.commit(); conn.close()
</code></pre>
<div class="pitfall"><b>ĐỪNG ghép chuỗi vào câu SQL</b> (vd "... WHERE name='" + user + "'") — đó là lỗ hổng <b>SQL injection</b>. Luôn dùng tham số hoá với dấu <code>?</code> như trên.</div>`,
  ]]);

const c6e = doc('prp201c-6-2-exercise', 'Exercise 2 — a mini product store|||Bài tập 2 — cửa hàng sản phẩm nhỏ',
  'Bài tập: tạo bảng product, chèn vài dòng, và truy vấn tổng giá trị kho theo tham số; kèm lời giải.',
  [[
    `<span class="eyebrow">PRP201c · Chapter 6 · Exercise</span>
<h2>Exercise 2 — a mini product store</h2>
<div class="callout"><span class="badge">Đề</span> Using sqlite3: create a product table, insert 3 products, then print all products priced above a given threshold, sorted by price descending.</div>
<h3>Worked solution</h3>
<pre><code class="language-python">import sqlite3
conn = sqlite3.connect(":memory:")     # in-memory DB
cur = conn.cursor()
cur.execute("CREATE TABLE product (id INTEGER PRIMARY KEY, name TEXT, price REAL)")
cur.executemany("INSERT INTO product (name, price) VALUES (?, ?)",
                [("Book", 120000), ("Pen", 15000), ("Bag", 350000)])

threshold = 100000
cur.execute("SELECT name, price FROM product WHERE price &gt; ? ORDER BY price DESC",
            (threshold,))
for name, price in cur.fetchall():
    print(f"{name}: {price:,.0f}")
# Bag: 350,000 / Book: 120,000
conn.close()
</code></pre>
<p><strong>Why:</strong> <code>executemany</code> inserts several rows at once; the parameterized <code>WHERE price &gt; ?</code> is safe and reusable; <code>:memory:</code> gives a throwaway DB for practice. This is exactly the CRUD + query loop you'll use in any data app.</p>`,
    `<span class="eyebrow">PRP201c · Chương 6 · Bài tập</span>
<h2>Bài tập 2 — cửa hàng sản phẩm nhỏ</h2>
<div class="callout"><span class="badge">Đề</span> Dùng sqlite3: tạo bảng product, chèn 3 sản phẩm, rồi in các sản phẩm có giá trên một ngưỡng, sắp theo giá giảm dần.</div>
<h3>Lời giải</h3>
<pre><code class="language-python">import sqlite3
conn = sqlite3.connect(":memory:")     # DB trong bộ nhớ
cur = conn.cursor()
cur.execute("CREATE TABLE product (id INTEGER PRIMARY KEY, name TEXT, price REAL)")
cur.executemany("INSERT INTO product (name, price) VALUES (?, ?)",
                [("Book", 120000), ("Pen", 15000), ("Bag", 350000)])

threshold = 100000
cur.execute("SELECT name, price FROM product WHERE price &gt; ? ORDER BY price DESC",
            (threshold,))
for name, price in cur.fetchall():
    print(f"{name}: {price:,.0f}")
# Bag: 350,000 / Book: 120,000
conn.close()
</code></pre>
<p><strong>Vì sao:</strong> <code>executemany</code> chèn nhiều hàng cùng lúc; <code>WHERE price &gt; ?</code> tham số hoá vừa an toàn vừa tái dùng; <code>:memory:</code> cho một DB tạm để luyện. Đây đúng là vòng CRUD + query bạn dùng trong mọi app dữ liệu.</p>`,
  ]]);

const c6q = quiz('prp201c-quiz-6', 'Quiz 6 — SQL & DB|||Quiz 6 — SQL & CSDL', [
  { id: 'q1', question: 'Khoá nào định danh DUY NHẤT một hàng?', options: ['Foreign key', 'Primary key', 'Index', 'Unique constraint'], correctIndex: 1, explanation: 'Primary key định danh duy nhất mỗi hàng.' },
  { id: 'q2', question: 'Cách CHỐNG SQL injection trong Python?', options: ['Ghép chuỗi', 'Truy vấn tham số hoá (dấu ?)', 'Viết hoa SQL', 'Dùng try/except'], correctIndex: 1, explanation: 'Tham số hoá tách dữ liệu khỏi câu lệnh → chống injection.' },
  { id: 'q3', question: 'SELECT ... WHERE price < 200000 ORDER BY name làm gì?', options: ['Xoá hàng', 'Lọc giá < 200000 và sắp theo tên', 'Thêm cột', 'Tạo bảng'], correctIndex: 1, explanation: 'WHERE lọc, ORDER BY sắp xếp kết quả.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'PRP201c',
    slug: 'prp201c-python-programming',
    title: 'Python programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v2/PRP201c.webp',
    shortDescription: 'Learn Python from scratch — basics, data structures, functions & files, data retrieval/processing (JSON/CSV/API), and SQL. Bilingual, runnable code & exercises.|||Học Python từ đầu — cơ bản, cấu trúc dữ liệu, hàm & file, truy xuất/xử lý dữ liệu (JSON/CSV/API), và SQL. Song ngữ, code chạy được & bài tập.',
    description: 'Môn <strong>PRP201c — Lập trình Python</strong> (kỳ 5). Đi từ <strong>nền tảng</strong> (biến, kiểu, điều khiển luồng) → <strong>cấu trúc dữ liệu</strong> (list/tuple/dict/set, comprehension) → <strong>hàm, module &amp; file</strong> → <strong>truy xuất/xử lý dữ liệu</strong> (CSV/JSON/API với requests) → <strong>SQL &amp; cơ sở dữ liệu</strong> (sqlite3, thiết kế bảng, chống SQL injection). Bám giáo trình FLM (4 CLO), song ngữ, code Python chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'Biến/kiểu/f-string; if/for/while; list/tuple/dict/set & comprehension; hàm, module, file, try/except; đọc/ghi CSV & JSON, gọi API web (requests); SQL cơ bản (CREATE/INSERT/SELECT/WHERE/ORDER BY/JOIN) & sqlite3 với truy vấn tham số hoá.',
    requirements: 'Không cần nền lập trình trước. Cần cài Python 3 (hoặc dùng Google Colab); gói requests qua pip.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao Python, 4 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Python cơ bản|||Chapter 1 — Basics', description: 'Biến, kiểu, nhập/xuất, thụt lề.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Điều khiển luồng|||Chapter 2 — Control flow', description: 'if/elif/else, for, while, break/continue.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cấu trúc dữ liệu|||Chapter 3 — Data structures', description: 'list/tuple/dict/set, comprehension.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — Hàm, module & file|||Chapter 4 — Functions, modules & files', description: 'Hàm, import, file với with, try/except.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xử lý dữ liệu|||Chapter 5 — Data processing', description: 'CSV, JSON, API (requests).', lessons: [c5, c5q] },
    { title: 'Chương 6 — SQL & cơ sở dữ liệu|||Chapter 6 — SQL & databases', description: 'Thiết kế bảng, SQL, sqlite3, chống injection.', lessons: [c6, c6e, c6q] },
  ],
};
