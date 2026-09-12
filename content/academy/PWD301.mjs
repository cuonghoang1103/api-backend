/**
 * PWD301 — Python Web Development (Flask). Giáo trình FLM. Soạn từ syllabus +
 * kiến thức, song ngữ, code Flask thật + bài tập. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ code mẫu: KHÔNG backtick, KHÔNG ${ }; Jinja "{{ }}" giữ nguyên được (không phải
 * template literal JS vì nằm trong chuỗi thường qua bi()); "\n" literal viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('pwd301-0-1-overview', 'Course overview: Python Web with Flask|||Tổng quan: Web Python với Flask',
  'Web hoạt động ra sao (HTTP request/response), vì sao Flask (micro-framework), cấu trúc một ứng dụng web, lộ trình: route→template→form→DB→auth→REST→deploy.',
  [[
    `<span class="eyebrow">PWD301 · Lesson 0.1 · Overview</span>
<h2>Python Web Development with Flask</h2>
<p class="lead">A web application answers <strong>HTTP requests</strong> with <strong>responses</strong> (HTML pages or JSON). This course builds them in Python with <strong>Flask</strong> — a lightweight "micro-framework" that gives you routing and templating and lets you add only what you need.</p>
<h3>How the web works (in one breath)</h3>
<p>A browser sends a <strong>request</strong> (method + URL, e.g. <code>GET /products</code>) → your Flask app matches a <strong>route</strong> → runs a <strong>view function</strong> → returns a <strong>response</strong> (rendered HTML or JSON). Data persists in a <strong>database</strong>; users are tracked with <strong>sessions</strong>.</p>
<h3>Why Flask</h3>
<ul>
<li><strong>Minimal &amp; explicit</strong> — you see exactly what happens; great for learning.</li>
<li><strong>Batteries you choose</strong> — add SQLAlchemy (DB), WTForms (forms), Flask-Login (auth) as needed.</li>
<li><strong>Same language end-to-end</strong> — Python for logic, ideal after PRF/PRP.</li>
</ul>
<h3>Course roadmap</h3>
<p>Flask basics &amp; routing → Jinja2 templates → forms &amp; validation → database with SQLAlchemy → authentication &amp; sessions → RESTful APIs (JSON) → testing, building &amp; deploying. Bilingual, with runnable code and exercises.</p>`,
    `<span class="eyebrow">PWD301 · Bài 0.1 · Tổng quan</span>
<h2>Phát triển web Python với Flask</h2>
<p class="lead">Ứng dụng web trả lời các <strong>HTTP request</strong> bằng <strong>response</strong> (trang HTML hoặc JSON). Môn này dựng chúng bằng Python với <strong>Flask</strong> — một "micro-framework" nhẹ, cho bạn routing và template rồi để bạn thêm đúng thứ cần.</p>
<h3>Web hoạt động ra sao (trong một hơi)</h3>
<p>Trình duyệt gửi một <strong>request</strong> (method + URL, vd <code>GET /products</code>) → app Flask khớp một <strong>route</strong> → chạy một <strong>view function</strong> → trả về một <strong>response</strong> (HTML dựng ra hoặc JSON). Dữ liệu lưu trong <strong>cơ sở dữ liệu</strong>; người dùng được theo dõi qua <strong>session</strong>.</p>
<h3>Vì sao Flask</h3>
<ul>
<li><strong>Tối giản &amp; tường minh</strong> — thấy rõ chuyện gì xảy ra; rất hợp để học.</li>
<li><strong>Tự chọn phụ kiện</strong> — thêm SQLAlchemy (DB), WTForms (form), Flask-Login (auth) khi cần.</li>
<li><strong>Một ngôn ngữ xuyên suốt</strong> — Python cho logic, lý tưởng sau PRF/PRP.</li>
</ul>
<h3>Lộ trình môn</h3>
<p>Flask cơ bản &amp; routing → template Jinja2 → form &amp; kiểm tra → cơ sở dữ liệu với SQLAlchemy → xác thực &amp; session → API RESTful (JSON) → kiểm thử, build &amp; triển khai. Song ngữ, code chạy được và bài tập.</p>`,
  ]]);

const c1 = doc('pwd301-1-1-flask-routing', '1.1 — Flask app & routing|||1.1 — App Flask & routing',
  'App Flask tối thiểu, route tĩnh & động (<int:id>), method GET/POST, trả HTML/redirect; cấu trúc thư mục dự án.',
  [[
    `<span class="eyebrow">PWD301 · Chapter 1 · Lesson 1.1</span>
<h2>The Flask app &amp; routing</h2>
<h3>A minimal app</h3>
<pre><code class="language-python">from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "&lt;h1&gt;Hello, Flask!&lt;/h1&gt;"

if __name__ == "__main__":
    app.run(debug=True)
</code></pre>
<p>A <strong>route</strong> maps a URL to a <strong>view function</strong>. The decorator <code>@app.route("/")</code> says "when someone requests /, run this function and send back what it returns."</p>
<h3>Dynamic routes &amp; methods</h3>
<pre><code class="language-python">@app.route("/product/&lt;int:pid&gt;")     # /product/42 -> pid = 42
def product(pid):
    return "Product #" + str(pid)

@app.route("/login", methods=["GET", "POST"])
def login():
    ...
</code></pre>
<p><strong>&lt;int:pid&gt;</strong> captures part of the URL as an argument. By default a route answers only GET; list <code>methods=["GET","POST"]</code> to also accept form submissions.</p>
<div class="callout"><span class="badge">Project layout</span> app.py (routes), templates/ (Jinja2 HTML), static/ (CSS/JS/images), models.py (DB), and a virtual environment. Keep logic out of templates and HTML out of Python.</div>`,
    `<span class="eyebrow">PWD301 · Chương 1 · Bài 1.1</span>
<h2>App Flask &amp; routing</h2>
<h3>Ứng dụng tối thiểu</h3>
<pre><code class="language-python">from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "&lt;h1&gt;Hello, Flask!&lt;/h1&gt;"

if __name__ == "__main__":
    app.run(debug=True)
</code></pre>
<p>Một <strong>route</strong> ánh xạ một URL tới một <strong>view function</strong>. Decorator <code>@app.route("/")</code> nói "khi ai đó yêu cầu /, chạy hàm này và gửi lại thứ nó trả về."</p>
<h3>Route động &amp; method</h3>
<pre><code class="language-python">@app.route("/product/&lt;int:pid&gt;")     # /product/42 -> pid = 42
def product(pid):
    return "Product #" + str(pid)

@app.route("/login", methods=["GET", "POST"])
def login():
    ...
</code></pre>
<p><strong>&lt;int:pid&gt;</strong> bắt một phần URL làm tham số. Mặc định route chỉ trả lời GET; liệt kê <code>methods=["GET","POST"]</code> để nhận cả gửi form.</p>
<div class="callout"><span class="badge">Bố cục dự án</span> app.py (route), templates/ (HTML Jinja2), static/ (CSS/JS/ảnh), models.py (DB), và một môi trường ảo. Giữ logic ngoài template và HTML ngoài Python.</div>`,
  ]]);

const c1q = quiz('pwd301-quiz-1', 'Quiz 1 — Flask & routing|||Quiz 1 — Flask & routing', [
  { id: 'q1', question: '@app.route("/product/<int:pid>") làm gì?', options: ['Trả file tĩnh', 'Bắt phần URL thành tham số nguyên pid', 'Kết nối DB', 'Tạo form'], correctIndex: 1, explanation: '<int:pid> bắt đoạn URL, ép kiểu int, truyền vào view.' },
  { id: 'q2', question: 'Để route nhận cả gửi form (POST) cần?', options: ['Không cần gì', 'methods=["GET","POST"]', 'debug=True', 'return JSON'], correctIndex: 1, explanation: 'Mặc định chỉ GET; khai methods để nhận POST.' },
  { id: 'q3', question: 'Trong Flask, "view function" là?', options: ['File CSS', 'Hàm xử lý một route và trả response', 'Bảng CSDL', 'Trình duyệt'], correctIndex: 1, explanation: 'View function chạy khi route khớp, trả HTML/JSON/redirect.' },
]);

const c2 = doc('pwd301-2-1-templates-forms', '2.1 — Jinja2 templates & forms|||2.1 — Template Jinja2 & form',
  'render_template + Jinja2 (biến {{ }}, vòng lặp {% for %}, kế thừa layout), nhận dữ liệu form qua request.form, kiểm tra hợp lệ & flash message.',
  [[
    `<span class="eyebrow">PWD301 · Chapter 2 · Lesson 2.1</span>
<h2>Templates (Jinja2) &amp; forms</h2>
<h3>Rendering HTML with Jinja2</h3>
<pre><code class="language-python">from flask import render_template

@app.route("/products")
def products():
    items = ["Pen", "Book", "Lamp"]
    return render_template("products.html", items=items)
</code></pre>
<p>In <code>templates/products.html</code>, Jinja2 mixes HTML with placeholders — <code>{{ variable }}</code> prints a value, <code>{% for %}</code> loops, <code>{% if %}</code> branches:</p>
<pre><code class="language-html">&lt;ul&gt;
{% for it in items %}
  &lt;li&gt;{{ it }}&lt;/li&gt;
{% endfor %}
&lt;/ul&gt;
</code></pre>
<p>Use <strong>template inheritance</strong> (<code>{% extends "base.html" %}</code> + <code>{% block content %}</code>) so every page shares one header/footer.</p>
<h3>Handling a form</h3>
<pre><code class="language-python">from flask import request, redirect, url_for, flash

@app.route("/add", methods=["POST"])
def add():
    name = request.form.get("name", "").strip()
    if not name:
        flash("Name is required")           # message shown next page
        return redirect(url_for("products"))
    save_product(name)
    return redirect(url_for("products"))
</code></pre>
<p>Read submitted fields from <code>request.form</code>, <strong>validate</strong> them, and <strong>redirect after POST</strong> (so a page refresh doesn't resubmit). Never trust input — always check on the server.</p>`,
    `<span class="eyebrow">PWD301 · Chương 2 · Bài 2.1</span>
<h2>Template (Jinja2) &amp; form</h2>
<h3>Dựng HTML bằng Jinja2</h3>
<pre><code class="language-python">from flask import render_template

@app.route("/products")
def products():
    items = ["Pen", "Book", "Lamp"]
    return render_template("products.html", items=items)
</code></pre>
<p>Trong <code>templates/products.html</code>, Jinja2 trộn HTML với chỗ giữ — <code>{{ variable }}</code> in giá trị, <code>{% for %}</code> lặp, <code>{% if %}</code> rẽ nhánh:</p>
<pre><code class="language-html">&lt;ul&gt;
{% for it in items %}
  &lt;li&gt;{{ it }}&lt;/li&gt;
{% endfor %}
&lt;/ul&gt;
</code></pre>
<p>Dùng <strong>kế thừa template</strong> (<code>{% extends "base.html" %}</code> + <code>{% block content %}</code>) để mọi trang chung một header/footer.</p>
<h3>Xử lý một form</h3>
<pre><code class="language-python">from flask import request, redirect, url_for, flash

@app.route("/add", methods=["POST"])
def add():
    name = request.form.get("name", "").strip()
    if not name:
        flash("Name is required")           # thông báo hiện ở trang sau
        return redirect(url_for("products"))
    save_product(name)
    return redirect(url_for("products"))
</code></pre>
<p>Đọc trường đã gửi từ <code>request.form</code>, <strong>kiểm tra hợp lệ</strong>, và <strong>redirect sau POST</strong> (để refresh không gửi lại). Đừng tin đầu vào — luôn kiểm ở máy chủ.</p>`,
  ]]);

const c2q = quiz('pwd301-quiz-2', 'Quiz 2 — Templates & forms|||Quiz 2 — Template & form', [
  { id: 'q1', question: 'Trong Jinja2, "{{ name }}" dùng để?', options: ['Vòng lặp', 'In giá trị biến vào HTML', 'Khai báo route', 'Kết nối DB'], correctIndex: 1, explanation: '{{ }} in giá trị; {% %} là câu lệnh (for/if).' },
  { id: 'q2', question: 'Đọc dữ liệu người dùng gửi qua POST form bằng?', options: ['request.form', 'render_template', 'url_for', 'app.route'], correctIndex: 0, explanation: 'request.form chứa các trường của form đã gửi.' },
  { id: 'q3', question: 'Vì sao nên "redirect sau POST"?', options: ['Cho nhanh hơn', 'Để refresh trang không gửi lại form (double submit)', 'Bắt buộc của Python', 'Để hiện JSON'], correctIndex: 1, explanation: 'Mẫu Post/Redirect/Get tránh gửi trùng khi refresh.' },
]);

const c3 = doc('pwd301-3-1-database-auth', '3.1 — Database (SQLAlchemy) & auth|||3.1 — Cơ sở dữ liệu (SQLAlchemy) & xác thực',
  'Model SQLAlchemy (bảng = lớp), CRUD, quan hệ; và xác thực: băm mật khẩu, session đăng nhập, bảo vệ route.',
  [[
    `<span class="eyebrow">PWD301 · Chapter 3 · Lesson 3.1</span>
<h2>Database with SQLAlchemy &amp; authentication</h2>
<h3>Models = tables</h3>
<pre><code class="language-python">from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, default=0)

# CRUD
db.session.add(Product(name="Pen", price=1.5))   # create
db.session.commit()
Product.query.all()                              # read
Product.query.filter_by(name="Pen").first()      # read one
</code></pre>
<p>An <strong>ORM</strong> (Object-Relational Mapper) lets you work with Python objects instead of raw SQL — a class is a table, an instance is a row. It also builds parameterized queries, which prevents <strong>SQL injection</strong>.</p>
<h3>Authentication done safely</h3>
<pre><code class="language-python">from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

# On register: NEVER store the raw password
user.password_hash = generate_password_hash(raw_password)

# On login:
if check_password_hash(user.password_hash, raw_password):
    session["user_id"] = user.id          # remember who is logged in
</code></pre>
<p>Store only a <strong>hash</strong> of the password, verify with <code>check_password_hash</code>, and record the logged-in user in the <strong>session</strong> (a signed cookie). Protect private routes by checking <code>session.get("user_id")</code> and redirecting to login if absent.</p>
<div class="callout"><span class="badge">Security</span> Never store plaintext passwords. Never build SQL by string concatenation. Set a strong <code>SECRET_KEY</code> — it signs the session cookie.</div>`,
    `<span class="eyebrow">PWD301 · Chương 3 · Bài 3.1</span>
<h2>Cơ sở dữ liệu với SQLAlchemy &amp; xác thực</h2>
<h3>Model = bảng</h3>
<pre><code class="language-python">from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, default=0)

# CRUD
db.session.add(Product(name="Pen", price=1.5))   # tạo
db.session.commit()
Product.query.all()                              # đọc
Product.query.filter_by(name="Pen").first()      # đọc một
</code></pre>
<p>Một <strong>ORM</strong> cho bạn làm việc với đối tượng Python thay vì SQL thô — lớp là bảng, thực thể là dòng. Nó cũng dựng truy vấn tham số hoá, tránh <strong>SQL injection</strong>.</p>
<h3>Xác thực an toàn</h3>
<pre><code class="language-python">from werkzeug.security import generate_password_hash, check_password_hash
from flask import session

# Khi đăng ký: TUYỆT ĐỐI không lưu mật khẩu thô
user.password_hash = generate_password_hash(raw_password)

# Khi đăng nhập:
if check_password_hash(user.password_hash, raw_password):
    session["user_id"] = user.id          # nhớ ai đang đăng nhập
</code></pre>
<p>Chỉ lưu <strong>băm (hash)</strong> của mật khẩu, xác minh bằng <code>check_password_hash</code>, và ghi người dùng đã đăng nhập vào <strong>session</strong> (cookie đã ký). Bảo vệ route riêng tư bằng cách kiểm <code>session.get("user_id")</code> và chuyển về đăng nhập nếu vắng.</p>
<div class="callout"><span class="badge">Bảo mật</span> Không lưu mật khẩu thô. Không ghép SQL bằng nối chuỗi. Đặt <code>SECRET_KEY</code> mạnh — nó ký cookie session.</div>`,
  ]]);

const c3e = doc('pwd301-3-2-exercise', 'Exercise 1 — a login-protected page|||Bài tập 1 — trang yêu cầu đăng nhập',
  'Bài tập: viết decorator login_required bảo vệ route, kèm lời giải & giải thích.',
  [[
    `<span class="eyebrow">PWD301 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — protect a page with login</h2>
<div class="callout"><span class="badge">Đề</span> Write a <code>login_required</code> decorator that redirects to /login when no user is in the session, then use it on a /dashboard route.</div>
<h3>Worked solution</h3>
<pre><code class="language-python">from functools import wraps
from flask import session, redirect, url_for

def login_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapper

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")
</code></pre>
<p><strong>Why:</strong> a <strong>decorator</strong> wraps a view so a check runs <em>before</em> it. Here every protected route just adds <code>@login_required</code> — one place to enforce auth, no copy-pasted <code>if</code> checks. <code>@wraps(view)</code> keeps the original function's name so Flask's URL map still works. This is the standard Flask auth-gating pattern (Flask-Login formalizes it).</p>`,
    `<span class="eyebrow">PWD301 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — bảo vệ trang bằng đăng nhập</h2>
<div class="callout"><span class="badge">Đề</span> Viết một decorator <code>login_required</code> chuyển hướng về /login khi session không có user, rồi dùng nó trên route /dashboard.</div>
<h3>Lời giải</h3>
<pre><code class="language-python">from functools import wraps
from flask import session, redirect, url_for

def login_required(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        if not session.get("user_id"):
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapper

@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html")
</code></pre>
<p><strong>Vì sao:</strong> một <strong>decorator</strong> bọc view để một phép kiểm chạy <em>trước</em> nó. Ở đây mỗi route cần bảo vệ chỉ thêm <code>@login_required</code> — một chỗ duy nhất áp xác thực, không phải chép câu <code>if</code> khắp nơi. <code>@wraps(view)</code> giữ tên hàm gốc để bản đồ URL của Flask vẫn chạy. Đây là mẫu chặn xác thực chuẩn của Flask (Flask-Login chính thức hoá nó).</p>`,
  ]]);

const c3q = quiz('pwd301-quiz-3', 'Quiz 3 — DB & auth|||Quiz 3 — DB & xác thực', [
  { id: 'q1', question: 'Khi đăng ký, nên lưu gì cho mật khẩu?', options: ['Mật khẩu thô', 'Băm (hash) của mật khẩu', 'Mật khẩu mã hoá base64', 'Không lưu gì'], correctIndex: 1, explanation: 'Chỉ lưu hash (generate_password_hash), xác minh bằng check_password_hash.' },
  { id: 'q2', question: 'ORM (SQLAlchemy) giúp tránh lỗ hổng nào nhờ truy vấn tham số hoá?', options: ['XSS', 'SQL injection', 'CSRF', 'DDoS'], correctIndex: 1, explanation: 'Truy vấn tham số hoá của ORM ngăn SQL injection.' },
  { id: 'q3', question: 'Flask nhớ "ai đang đăng nhập" bằng?', options: ['Biến toàn cục', 'session (cookie đã ký)', 'File .txt', 'URL parameter'], correctIndex: 1, explanation: 'session lưu trong cookie ký bằng SECRET_KEY.' },
]);

const c4 = doc('pwd301-4-1-rest-deploy', '4.1 — RESTful APIs & deploy|||4.1 — API RESTful & triển khai',
  'Trả JSON (jsonify), thiết kế REST (danh từ + method + status code), test bằng pytest, và triển khai (gunicorn + biến môi trường, KHÔNG debug=True trên prod).',
  [[
    `<span class="eyebrow">PWD301 · Chapter 4 · Lesson 4.1</span>
<h2>RESTful APIs, testing &amp; deploy</h2>
<h3>Returning JSON — a REST API</h3>
<pre><code class="language-python">from flask import jsonify, request

@app.route("/api/products", methods=["GET"])
def api_products():
    items = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name} for p in items])

@app.route("/api/products", methods=["POST"])
def api_create():
    data = request.get_json()
    p = Product(name=data["name"])
    db.session.add(p); db.session.commit()
    return jsonify({"id": p.id}), 201        # 201 Created
</code></pre>
<p><strong>REST</strong> models your app as <strong>resources</strong> (nouns) acted on by HTTP <strong>methods</strong>: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Return correct <strong>status codes</strong> — 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 401 Unauthorized.</p>
<h3>Testing</h3>
<pre><code class="language-python">def test_products(client):
    r = client.get("/api/products")
    assert r.status_code == 200
    assert isinstance(r.get_json(), list)
</code></pre>
<p>Flask's <strong>test client</strong> (with <code>pytest</code>) calls routes without a real server, so you can assert on status and JSON.</p>
<h3>Deploy</h3>
<ul>
<li>Run behind a real WSGI server — <strong>gunicorn</strong> (<code>gunicorn app:app</code>), not the dev server.</li>
<li><strong>debug=True is OFF in production</strong> — it exposes a code-executing console.</li>
<li>Config via <strong>environment variables</strong> (SECRET_KEY, DATABASE_URL) — never hard-code secrets.</li>
<li>Serve behind nginx; deploy to a VPS, container, or PaaS.</li>
</ul>
<div class="callout"><span class="badge">Prod checklist</span> gunicorn + nginx · debug OFF · secrets in env · DB migrations applied · HTTPS on.</div>`,
    `<span class="eyebrow">PWD301 · Chương 4 · Bài 4.1</span>
<h2>API RESTful, kiểm thử &amp; triển khai</h2>
<h3>Trả JSON — một REST API</h3>
<pre><code class="language-python">from flask import jsonify, request

@app.route("/api/products", methods=["GET"])
def api_products():
    items = Product.query.all()
    return jsonify([{"id": p.id, "name": p.name} for p in items])

@app.route("/api/products", methods=["POST"])
def api_create():
    data = request.get_json()
    p = Product(name=data["name"])
    db.session.add(p); db.session.commit()
    return jsonify({"id": p.id}), 201        # 201 Created
</code></pre>
<p><strong>REST</strong> mô hình hoá app thành <strong>tài nguyên</strong> (danh từ) được tác động bởi <strong>method</strong> HTTP: GET (đọc), POST (tạo), PUT/PATCH (sửa), DELETE (xoá). Trả đúng <strong>status code</strong> — 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 401 Unauthorized.</p>
<h3>Kiểm thử</h3>
<pre><code class="language-python">def test_products(client):
    r = client.get("/api/products")
    assert r.status_code == 200
    assert isinstance(r.get_json(), list)
</code></pre>
<p><strong>Test client</strong> của Flask (với <code>pytest</code>) gọi route mà không cần server thật, nên bạn khẳng định được status và JSON.</p>
<h3>Triển khai</h3>
<ul>
<li>Chạy sau một WSGI server thật — <strong>gunicorn</strong> (<code>gunicorn app:app</code>), không dùng dev server.</li>
<li><strong>debug=True TẮT trên production</strong> — nó lộ một console chạy được mã.</li>
<li>Cấu hình qua <strong>biến môi trường</strong> (SECRET_KEY, DATABASE_URL) — không nhúng cứng bí mật.</li>
<li>Đặt sau nginx; triển khai lên VPS, container hoặc PaaS.</li>
</ul>
<div class="callout"><span class="badge">Checklist prod</span> gunicorn + nginx · tắt debug · bí mật trong env · đã chạy migration · bật HTTPS.</div>`,
  ]]);

const c4q = quiz('pwd301-quiz-4', 'Quiz 4 — REST & deploy|||Quiz 4 — REST & triển khai', [
  { id: 'q1', question: 'Trả JSON từ Flask dùng?', options: ['render_template', 'jsonify', 'redirect', 'flash'], correctIndex: 1, explanation: 'jsonify tạo response JSON đúng Content-Type.' },
  { id: 'q2', question: 'Tạo mới tài nguyên thành công nên trả status code?', options: ['200 OK', '201 Created', '404 Not Found', '500'], correctIndex: 1, explanation: 'POST tạo mới thành công → 201 Created.' },
  { id: 'q3', question: 'Trên production, debug=True nên?', options: ['Bật để dễ sửa', 'TẮT — nó lộ console chạy mã', 'Không quan trọng', 'Chỉ bật ban đêm'], correctIndex: 1, explanation: 'debug=True lộ debugger chạy mã tuỳ ý → luôn tắt ở prod.' },
]);

const taiLieu = doc('pwd301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">PWD301 · Resource hub</span>
<h2>📚 Course materials &amp; references</h2>
<p class="lead">Everything you need to study Python web development with Flask beyond this course: the official FLM syllabus &amp; slides, reference books, free official docs, YouTube channels, tools, and a 4-step self-study roadmap. Every link is real and free to open.</p>
<h3>📘 Official syllabus &amp; slides</h3>
<div class="callout"><span class="badge">FLM</span> Log in to <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> with your FPTU account — the full syllabus and lecture slides for PWD301 are there.</div>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/flask-web-development/9781491991725/" target="_blank" rel="noopener">Flask Web Development (2nd ed.)</a> — Miguel Grinberg (O'Reilly).</li>
<li><a href="https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world" target="_blank" rel="noopener">The Flask Mega-Tutorial</a> — Miguel Grinberg — the definitive free step-by-step series.</li>
</ul>
<h3>🌐 Free official documentation</h3>
<ul>
<li><a href="https://flask.palletsprojects.com/" target="_blank" rel="noopener">Flask documentation</a> — including the official tutorial.</li>
<li><a href="https://jinja.palletsprojects.com/" target="_blank" rel="noopener">Jinja2 templates</a>.</li>
<li><a href="https://docs.sqlalchemy.org/" target="_blank" rel="noopener">SQLAlchemy documentation</a> — the ORM.</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — the classic complete Flask series.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — full-length Flask &amp; Python web courses.</li>
<li><a href="https://www.youtube.com/@prettyprinted" target="_blank" rel="noopener">Pretty Printed</a> — focused Flask how-tos.</li>
<li><a href="https://www.youtube.com/@TechWithTim" target="_blank" rel="noopener">Tech With Tim</a> — Flask projects for beginners.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> — editor with the Python extension.</li>
<li><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a> — test your REST API routes.</li>
<li><a href="https://flask.palletsprojects.com/en/stable/cli/" target="_blank" rel="noopener">Flask CLI</a> — run &amp; debug the dev server.</li>
<li><a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> — version control &amp; deploy.</li>
</ul>
<h3>🎯 Self-study roadmap</h3>
<ol>
<li><strong>Foundations (exam core)</strong> — master routing, Jinja2 templates, forms, SQLAlchemy and auth in this course; do every quiz.</li>
<li><strong>Small projects</strong> — build a CRUD app (blog or to-do) with login and a database; wire up templates and flash messages.</li>
<li><strong>Go deeper</strong> — follow the Flask Mega-Tutorial, add a REST API with jsonify, and write pytest tests for your routes.</li>
<li><strong>Job-ready</strong> — deploy one Flask app (gunicorn + a host) and put it on GitHub with a README; that live project is what employers read.</li>
</ol>`,
    `<span class="eyebrow">PWD301 · Trung tâm tài liệu</span>
<h2>📚 Tài liệu tham khảo môn học</h2>
<p class="lead">Mọi thứ để học lập trình web Python với Flask vượt ra ngoài môn này: giáo trình &amp; slide chính thức trên FLM, sách tham khảo, tài liệu chính thức miễn phí, kênh YouTube, công cụ, và lộ trình tự học 4 bước. Mọi link đều thật và mở được miễn phí.</p>
<h3>📘 Giáo trình &amp; slide chính thức</h3>
<div class="callout"><span class="badge">FLM</span> Đăng nhập <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">flm.fpt.edu.vn</a> bằng tài khoản FPTU — có giáo trình và slide đầy đủ cho PWD301.</div>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.oreilly.com/library/view/flask-web-development/9781491991725/" target="_blank" rel="noopener">Flask Web Development (2nd ed.)</a> — Miguel Grinberg (O'Reilly).</li>
<li><a href="https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world" target="_blank" rel="noopener">The Flask Mega-Tutorial</a> — Miguel Grinberg — loạt bài từng bước miễn phí kinh điển.</li>
</ul>
<h3>🌐 Tài liệu chính thức miễn phí</h3>
<ul>
<li><a href="https://flask.palletsprojects.com/" target="_blank" rel="noopener">Tài liệu Flask</a> — có cả tutorial chính thức.</li>
<li><a href="https://jinja.palletsprojects.com/" target="_blank" rel="noopener">Template Jinja2</a>.</li>
<li><a href="https://docs.sqlalchemy.org/" target="_blank" rel="noopener">Tài liệu SQLAlchemy</a> — ORM.</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@coreyms" target="_blank" rel="noopener">Corey Schafer</a> — loạt Flask đầy đủ kinh điển.</li>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — khoá Flask &amp; web Python dài đầy đủ.</li>
<li><a href="https://www.youtube.com/@prettyprinted" target="_blank" rel="noopener">Pretty Printed</a> — hướng dẫn Flask tập trung.</li>
<li><a href="https://www.youtube.com/@TechWithTim" target="_blank" rel="noopener">Tech With Tim</a> — project Flask cho người mới.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> — trình soạn thảo kèm extension Python.</li>
<li><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a> — kiểm thử các route REST API.</li>
<li><a href="https://flask.palletsprojects.com/en/stable/cli/" target="_blank" rel="noopener">Flask CLI</a> — chạy &amp; gỡ lỗi dev server.</li>
<li><a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> — quản lý phiên bản &amp; triển khai.</li>
</ul>
<h3>🎯 Lộ trình tự học</h3>
<ol>
<li><strong>Nền tảng (lõi thi)</strong> — nắm chắc routing, template Jinja2, form, SQLAlchemy và xác thực trong môn này; làm hết mọi quiz.</li>
<li><strong>Project nhỏ</strong> — dựng một app CRUD (blog hoặc to-do) có đăng nhập và cơ sở dữ liệu; nối template và flash message.</li>
<li><strong>Đào sâu</strong> — theo Flask Mega-Tutorial, thêm REST API với jsonify, và viết test pytest cho các route.</li>
<li><strong>Sẵn sàng đi làm</strong> — triển khai một app Flask (gunicorn + một host) và đưa lên GitHub kèm README; project chạy thật đó là thứ nhà tuyển dụng đọc.</li>
</ol>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PWD301',
    slug: 'pwd301-python-web-development',
    title: 'Python Web Development',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PWD301.webp',
    shortDescription: 'Build web apps in Python with Flask — routing, Jinja2 templates, forms, database (SQLAlchemy), authentication & sessions, RESTful JSON APIs, testing & deploy. Bilingual, with runnable code & exercises.|||Dựng web bằng Python với Flask — routing, template Jinja2, form, CSDL (SQLAlchemy), xác thực & session, API JSON RESTful, kiểm thử & triển khai. Song ngữ, code chạy được & bài tập.',
    description: 'Môn <strong>PWD301 — Python Web Development</strong> (kỳ 4) dạy dựng ứng dụng web bằng Python với <strong>Flask</strong>. Đi từ <strong>route &amp; view</strong> → <strong>template Jinja2</strong> → <strong>form &amp; kiểm tra hợp lệ</strong> → <strong>cơ sở dữ liệu với SQLAlchemy</strong> (ORM, CRUD) → <strong>xác thực &amp; session</strong> (băm mật khẩu, login_required) → <strong>API RESTful trả JSON</strong> → <strong>kiểm thử (pytest), build &amp; triển khai</strong> (gunicorn, biến môi trường, tắt debug). Bám giáo trình FLM, song ngữ, code chạy được và bài tập kèm lời giải.',
    whatYouLearn: 'HTTP request/response; Flask app, route tĩnh/động, method; Jinja2 (biến/vòng lặp/kế thừa layout); form (request.form, validate, redirect-after-post, flash); SQLAlchemy ORM (model/CRUD/quan hệ); xác thực an toàn (hash mật khẩu, session, decorator login_required); REST (danh từ + method + status code, jsonify); pytest test client; triển khai (gunicorn+nginx, env, không debug ở prod).',
    requirements: 'Đã biết Python cơ bản (PRF/PRP) và HTML cơ bản. Chút SQL là lợi thế. Cần Python 3 + pip.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Web hoạt động ra sao, vì sao Flask.', lessons: [intro] },
    { title: 'Chương 1 — Flask & routing|||Chapter 1 — Flask & routing', description: 'App, route tĩnh/động, method.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Template & form|||Chapter 2 — Templates & forms', description: 'Jinja2, xử lý form, flash.', lessons: [c2, c2q] },
    { title: 'Chương 3 — CSDL & xác thực|||Chapter 3 — Database & auth', description: 'SQLAlchemy ORM, hash mật khẩu, session.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — REST API & triển khai|||Chapter 4 — REST API & deploy', description: 'jsonify, status code, pytest, gunicorn.', lessons: [c4, c4q] },
  ],
};
