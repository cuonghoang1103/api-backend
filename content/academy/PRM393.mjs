/**
 * PRM393 — Mobile Programming (Flutter/Dart). Giáo trình FLM (syl 13822): Dart,
 * widget, state management, navigation, async Future/async-await, REST API, lưu
 * cục bộ (SharedPreferences/SQLite), notification. Song ngữ, code Dart thật + bài
 * tập. Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ code: KHÔNG backtick, KHÔNG ${ }; "\n" literal viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('prm393-0-1-overview', 'Course overview: Mobile with Flutter|||Tổng quan: Di động với Flutter',
  'Vì sao Flutter (một mã, hai nền tảng), Dart là gì, cây widget, lộ trình: widget→state→navigation→async→REST→lưu cục bộ→notification.',
  [[
    `<span class="eyebrow">PRM393 · Lesson 0.1 · Overview</span>
<h2>Mobile Programming with Flutter</h2>
<p class="lead"><strong>Flutter</strong> is Google's UI toolkit for building <strong>one codebase that runs on both Android and iOS</strong> (and web/desktop). You write in <strong>Dart</strong>, and Flutter draws every pixel itself — so the app looks and behaves the same everywhere.</p>
<h3>The big idea: everything is a widget</h3>
<p>A Flutter UI is a <strong>tree of widgets</strong> — text, buttons, rows, padding, the whole screen. You describe <em>what</em> the UI should look like for the current state, and Flutter figures out <em>how</em> to update the screen. This is <strong>declarative UI</strong>.</p>
<h3>What you'll build toward</h3>
<ul>
<li>Dart fundamentals (types, null-safety, collections, classes)</li>
<li>Widgets &amp; layout (Stateless vs Stateful)</li>
<li>State management &amp; navigation between screens</li>
<li>Asynchronous programming (Future, async/await)</li>
<li>Calling REST APIs (JSON) and storing data locally (SharedPreferences, SQLite)</li>
<li>Local &amp; push notifications</li>
</ul>
<div class="callout"><span class="badge">Prerequisite</span> PRO192 (OOP). Dart will feel familiar if you know Java/C#. Bilingual, with runnable Dart snippets and exercises.</div>`,
    `<span class="eyebrow">PRM393 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình di động với Flutter</h2>
<p class="lead"><strong>Flutter</strong> là bộ công cụ UI của Google để dựng <strong>một mã nguồn chạy trên cả Android và iOS</strong> (và web/desktop). Bạn viết bằng <strong>Dart</strong>, và Flutter tự vẽ từng điểm ảnh — nên app trông và chạy giống nhau ở mọi nơi.</p>
<h3>Ý lớn: mọi thứ là widget</h3>
<p>Giao diện Flutter là một <strong>cây widget</strong> — chữ, nút, hàng, padding, cả màn hình. Bạn mô tả UI <em>trông thế nào</em> ứng với trạng thái hiện tại, và Flutter lo <em>cách</em> cập nhật màn hình. Đây là <strong>UI khai báo (declarative)</strong>.</p>
<h3>Bạn sẽ tiến tới</h3>
<ul>
<li>Nền tảng Dart (kiểu, null-safety, tập hợp, lớp)</li>
<li>Widget &amp; bố cục (Stateless vs Stateful)</li>
<li>Quản lý state &amp; điều hướng giữa màn hình</li>
<li>Lập trình bất đồng bộ (Future, async/await)</li>
<li>Gọi REST API (JSON) và lưu dữ liệu cục bộ (SharedPreferences, SQLite)</li>
<li>Thông báo cục bộ &amp; đẩy (push)</li>
</ul>
<div class="callout"><span class="badge">Điều kiện</span> PRO192 (OOP). Dart sẽ quen thuộc nếu bạn biết Java/C#. Song ngữ, có đoạn Dart chạy được và bài tập.</div>`,
  ]]);

const c1 = doc('prm393-1-1-dart-widgets', '1.1 — Dart & the widget tree|||1.1 — Dart & cây widget',
  'Dart cơ bản (biến, null-safety, hàm, lớp), Stateless vs Stateful widget, build(), bố cục Column/Row/Container.',
  [[
    `<span class="eyebrow">PRM393 · Chapter 1 · Lesson 1.1</span>
<h2>Dart &amp; the widget tree</h2>
<h3>Dart in a nutshell</h3>
<pre><code class="language-dart">void main() {
  String name = "Flutter";
  int? age;                 // null-safety: ? = có thể null
  var items = ["a", "b"];   // suy kiểu
  print("Hello, " + name);
}

class Product {
  final String name;
  final double price;
  Product(this.name, this.price);            // constructor gọn
}
</code></pre>
<p>Dart is typed, object-oriented, with <strong>sound null-safety</strong> — a variable can't be null unless its type ends in <code>?</code>.</p>
<h3>Stateless vs Stateful widgets</h3>
<pre><code class="language-dart">class Greeting extends StatelessWidget {
  final String who;
  const Greeting(this.who, {super.key});
  @override
  Widget build(BuildContext context) {
    return Text("Hi, " + who);
  }
}
</code></pre>
<p>A <strong>StatelessWidget</strong> never changes after it's built (a label, an icon). A <strong>StatefulWidget</strong> can rebuild when its data changes (a counter, a form). The <code>build()</code> method returns the widget subtree; compose UI with <strong>Column</strong> (vertical), <strong>Row</strong> (horizontal), <strong>Container</strong> (box with padding/margin/decoration).</p>`,
    `<span class="eyebrow">PRM393 · Chương 1 · Bài 1.1</span>
<h2>Dart &amp; cây widget</h2>
<h3>Dart trong một hơi</h3>
<pre><code class="language-dart">void main() {
  String name = "Flutter";
  int? age;                 // null-safety: ? = có thể null
  var items = ["a", "b"];   // suy kiểu
  print("Hello, " + name);
}

class Product {
  final String name;
  final double price;
  Product(this.name, this.price);            // constructor gọn
}
</code></pre>
<p>Dart có kiểu, hướng đối tượng, với <strong>null-safety chặt</strong> — một biến không thể null trừ khi kiểu kết thúc bằng <code>?</code>.</p>
<h3>Stateless vs Stateful widget</h3>
<pre><code class="language-dart">class Greeting extends StatelessWidget {
  final String who;
  const Greeting(this.who, {super.key});
  @override
  Widget build(BuildContext context) {
    return Text("Hi, " + who);
  }
}
</code></pre>
<p><strong>StatelessWidget</strong> không đổi sau khi dựng (nhãn, icon). <strong>StatefulWidget</strong> dựng lại khi dữ liệu đổi (bộ đếm, form). Hàm <code>build()</code> trả về cây con; ghép UI bằng <strong>Column</strong> (dọc), <strong>Row</strong> (ngang), <strong>Container</strong> (hộp có padding/margin/trang trí).</p>`,
  ]]);

const c1q = quiz('prm393-quiz-1', 'Quiz 1 — Dart & widgets|||Quiz 1 — Dart & widget', [
  { id: 'q1', question: 'Trong Dart null-safety, "int? age" nghĩa là?', options: ['age luôn có giá trị', 'age có thể null', 'age là hằng', 'lỗi cú pháp'], correctIndex: 1, explanation: 'Hậu tố ? cho phép biến nhận null.' },
  { id: 'q2', question: 'Widget nào dựng lại khi dữ liệu thay đổi (vd bộ đếm)?', options: ['StatelessWidget', 'StatefulWidget', 'Container', 'Text'], correctIndex: 1, explanation: 'StatefulWidget có state, gọi setState để dựng lại.' },
  { id: 'q3', question: 'Xếp các widget theo chiều dọc dùng?', options: ['Row', 'Column', 'Stack chồng', 'Text'], correctIndex: 1, explanation: 'Column xếp dọc, Row xếp ngang.' },
]);

const c2 = doc('prm393-2-1-state-navigation', '2.1 — State management & navigation|||2.1 — Quản lý state & điều hướng',
  'setState (state cục bộ), nâng state lên (lift up), giới thiệu Provider; điều hướng Navigator.push/pop, truyền dữ liệu giữa màn hình.',
  [[
    `<span class="eyebrow">PRM393 · Chapter 2 · Lesson 2.1</span>
<h2>State management &amp; navigation</h2>
<h3>setState — local state</h3>
<pre><code class="language-dart">class Counter extends StatefulWidget {
  const Counter({super.key});
  @override State&lt;Counter&gt; createState() =&gt; _CounterState();
}
class _CounterState extends State&lt;Counter&gt; {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () =&gt; setState(() =&gt; count++),   // rebuild
      child: Text("Count: " + count.toString()),
    );
  }
}
</code></pre>
<p><strong>setState</strong> tells Flutter the state changed → it re-runs <code>build()</code>. For state shared across many screens, <strong>lift it up</strong> or use a package like <strong>Provider</strong> (an InheritedWidget-based store) so widgets read/observe shared data without passing it down manually.</p>
<h3>Navigation between screens</h3>
<pre><code class="language-dart">// go to a new screen
Navigator.push(context,
  MaterialPageRoute(builder: (_) =&gt; DetailScreen(id: 42)));

// come back
Navigator.pop(context);
</code></pre>
<p>Flutter keeps a <strong>stack of routes</strong>. <code>push</code> adds a screen on top; <code>pop</code> removes it (the back button). Pass data to a screen via its constructor; return data by awaiting the <code>push</code> and having the screen <code>pop(result)</code>.</p>`,
    `<span class="eyebrow">PRM393 · Chương 2 · Bài 2.1</span>
<h2>Quản lý state &amp; điều hướng</h2>
<h3>setState — state cục bộ</h3>
<pre><code class="language-dart">class Counter extends StatefulWidget {
  const Counter({super.key});
  @override State&lt;Counter&gt; createState() =&gt; _CounterState();
}
class _CounterState extends State&lt;Counter&gt; {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () =&gt; setState(() =&gt; count++),   // dựng lại
      child: Text("Count: " + count.toString()),
    );
  }
}
</code></pre>
<p><strong>setState</strong> báo cho Flutter state đã đổi → nó chạy lại <code>build()</code>. Với state dùng chung nhiều màn hình, hãy <strong>nâng state lên</strong> hoặc dùng gói như <strong>Provider</strong> (kho dựa trên InheritedWidget) để widget đọc/quan sát dữ liệu chung mà không phải truyền tay xuống.</p>
<h3>Điều hướng giữa màn hình</h3>
<pre><code class="language-dart">// sang màn hình mới
Navigator.push(context,
  MaterialPageRoute(builder: (_) =&gt; DetailScreen(id: 42)));

// quay lại
Navigator.pop(context);
</code></pre>
<p>Flutter giữ một <strong>ngăn xếp route</strong>. <code>push</code> thêm màn hình lên đỉnh; <code>pop</code> gỡ nó (nút back). Truyền dữ liệu vào màn hình qua constructor; trả dữ liệu về bằng cách await <code>push</code> và cho màn hình <code>pop(result)</code>.</p>`,
  ]]);

const c2q = quiz('prm393-quiz-2', 'Quiz 2 — State & navigation|||Quiz 2 — State & điều hướng', [
  { id: 'q1', question: 'Cập nhật giao diện khi state đổi trong StatefulWidget dùng?', options: ['print()', 'setState(() {...})', 'build() gọi tay', 'Navigator.pop'], correctIndex: 1, explanation: 'setState báo Flutter dựng lại build().' },
  { id: 'q2', question: 'Sang màn hình mới trong Flutter dùng?', options: ['Navigator.push', 'setState', 'Provider', 'print'], correctIndex: 0, explanation: 'Navigator.push đẩy route mới lên ngăn xếp.' },
  { id: 'q3', question: 'State dùng chung nhiều màn hình nên?', options: ['Chép ở mỗi màn', 'Nâng lên/dùng Provider', 'Lưu vào biến toàn cục bừa', 'Không quản lý'], correctIndex: 1, explanation: 'Lift state up hoặc Provider để chia sẻ có kiểm soát.' },
]);

const c3 = doc('prm393-3-1-async-rest', '3.1 — Async & calling REST APIs|||3.1 — Bất đồng bộ & gọi REST API',
  'Future & async/await, gọi HTTP (package http), phân tích JSON thành model, hiển thị bằng FutureBuilder.',
  [[
    `<span class="eyebrow">PRM393 · Chapter 3 · Lesson 3.1</span>
<h2>Asynchronous programming &amp; REST</h2>
<h3>Future, async &amp; await</h3>
<p>Network and disk calls take time. Dart represents "a value that will arrive later" as a <strong>Future</strong>. Mark a function <code>async</code> and <code>await</code> the Future to write asynchronous code that reads top-to-bottom — without freezing the UI.</p>
<pre><code class="language-dart">import 'package:http/http.dart' as http;
import 'dart:convert';

Future&lt;List&lt;Product&gt;&gt; fetchProducts() async {
  final res = await http.get(Uri.parse("https://api.example.com/products"));
  if (res.statusCode == 200) {
    final List data = jsonDecode(res.body);
    return data.map((j) =&gt; Product(j["name"], j["price"] * 1.0)).toList();
  }
  throw Exception("Failed to load");
}
</code></pre>
<h3>Showing async data with FutureBuilder</h3>
<pre><code class="language-dart">FutureBuilder&lt;List&lt;Product&gt;&gt;(
  future: fetchProducts(),
  builder: (context, snap) {
    if (snap.connectionState != ConnectionState.done)
      return const CircularProgressIndicator();
    if (snap.hasError) return Text("Error: " + snap.error.toString());
    return ListView(children: snap.data!.map((p) =&gt; Text(p.name)).toList());
  },
)
</code></pre>
<p><strong>FutureBuilder</strong> rebuilds itself as the Future moves through loading → done/error, so you show a spinner, then the data (or an error) — the standard pattern for API-backed screens.</p>`,
    `<span class="eyebrow">PRM393 · Chương 3 · Bài 3.1</span>
<h2>Lập trình bất đồng bộ &amp; REST</h2>
<h3>Future, async &amp; await</h3>
<p>Gọi mạng và đĩa tốn thời gian. Dart biểu diễn "giá trị sẽ tới sau" bằng một <strong>Future</strong>. Đánh dấu hàm <code>async</code> và <code>await</code> Future để viết mã bất đồng bộ đọc từ trên xuống — mà không đơ giao diện.</p>
<pre><code class="language-dart">import 'package:http/http.dart' as http;
import 'dart:convert';

Future&lt;List&lt;Product&gt;&gt; fetchProducts() async {
  final res = await http.get(Uri.parse("https://api.example.com/products"));
  if (res.statusCode == 200) {
    final List data = jsonDecode(res.body);
    return data.map((j) =&gt; Product(j["name"], j["price"] * 1.0)).toList();
  }
  throw Exception("Failed to load");
}
</code></pre>
<h3>Hiển thị dữ liệu async bằng FutureBuilder</h3>
<pre><code class="language-dart">FutureBuilder&lt;List&lt;Product&gt;&gt;(
  future: fetchProducts(),
  builder: (context, snap) {
    if (snap.connectionState != ConnectionState.done)
      return const CircularProgressIndicator();
    if (snap.hasError) return Text("Error: " + snap.error.toString());
    return ListView(children: snap.data!.map((p) =&gt; Text(p.name)).toList());
  },
)
</code></pre>
<p><strong>FutureBuilder</strong> tự dựng lại khi Future đi qua loading → done/error, nên bạn hiện spinner, rồi dữ liệu (hoặc lỗi) — mẫu chuẩn cho màn hình lấy dữ liệu từ API.</p>`,
  ]]);

const c3q = quiz('prm393-quiz-3', 'Quiz 3 — Async & REST|||Quiz 3 — Async & REST', [
  { id: 'q1', question: 'Kiểu biểu diễn "giá trị sẽ tới sau" trong Dart?', options: ['Stream duy nhất', 'Future', 'List', 'int'], correctIndex: 1, explanation: 'Future là kết quả bất đồng bộ; await để lấy giá trị.' },
  { id: 'q2', question: 'Widget dựng UI theo trạng thái của một Future (loading/done/error)?', options: ['FutureBuilder', 'Column', 'Navigator', 'setState'], correctIndex: 0, explanation: 'FutureBuilder tự dựng lại theo snapshot của Future.' },
  { id: 'q3', question: 'Chuyển chuỗi JSON thành object Dart dùng?', options: ['jsonDecode', 'toString', 'print', 'await'], correctIndex: 0, explanation: 'jsonDecode (dart:convert) phân tích JSON thành Map/List.' },
]);

const c4 = doc('prm393-4-1-storage-notifications', '4.1 — Local storage & notifications|||4.1 — Lưu cục bộ & thông báo',
  'SharedPreferences (key-value nhỏ) vs SQLite (dữ liệu có cấu trúc); thông báo cục bộ & push (khái niệm FCM).',
  [[
    `<span class="eyebrow">PRM393 · Chapter 4 · Lesson 4.1</span>
<h2>Local storage &amp; notifications</h2>
<h3>Two ways to persist data</h3>
<ul>
<li><strong>SharedPreferences</strong> — tiny key-value pairs (a theme choice, a token, "onboarding seen"). Simple, not for lots of structured data.</li>
<li><strong>SQLite</strong> (via the <code>sqflite</code> package) — a real on-device relational database for structured, queryable data (a cart, offline records).</li>
</ul>
<pre><code class="language-dart">final prefs = await SharedPreferences.getInstance();
await prefs.setString("token", "abc123");   // save
final token = prefs.getString("token");      // read
</code></pre>
<h3>Notifications</h3>
<ul>
<li><strong>Local notifications</strong> — scheduled by the app itself (a reminder, a timer) with <code>flutter_local_notifications</code>. No server needed.</li>
<li><strong>Push notifications</strong> — sent from a server through <strong>Firebase Cloud Messaging (FCM)</strong> to reach users even when the app is closed. The device registers a token; your backend sends messages to that token.</li>
</ul>
<div class="callout"><span class="badge">Choosing storage</span> A few settings → SharedPreferences. Many rows you query/filter → SQLite. Data that must sync across devices → a remote API + local cache.</div>`,
    `<span class="eyebrow">PRM393 · Chương 4 · Bài 4.1</span>
<h2>Lưu cục bộ &amp; thông báo</h2>
<h3>Hai cách lưu dữ liệu</h3>
<ul>
<li><strong>SharedPreferences</strong> — cặp key-value nhỏ (lựa chọn giao diện, token, "đã xem onboarding"). Đơn giản, không hợp dữ liệu có cấu trúc nhiều.</li>
<li><strong>SQLite</strong> (qua gói <code>sqflite</code>) — cơ sở dữ liệu quan hệ thật trên máy cho dữ liệu có cấu trúc, truy vấn được (giỏ hàng, bản ghi offline).</li>
</ul>
<pre><code class="language-dart">final prefs = await SharedPreferences.getInstance();
await prefs.setString("token", "abc123");   // lưu
final token = prefs.getString("token");      // đọc
</code></pre>
<h3>Thông báo</h3>
<ul>
<li><strong>Thông báo cục bộ</strong> — do chính app lên lịch (nhắc nhở, hẹn giờ) với <code>flutter_local_notifications</code>. Không cần máy chủ.</li>
<li><strong>Thông báo đẩy (push)</strong> — gửi từ máy chủ qua <strong>Firebase Cloud Messaging (FCM)</strong> để tới người dùng cả khi app đóng. Thiết bị đăng ký một token; backend gửi tin tới token đó.</li>
</ul>
<div class="callout"><span class="badge">Chọn kho lưu</span> Vài cài đặt → SharedPreferences. Nhiều dòng cần truy vấn/lọc → SQLite. Dữ liệu phải đồng bộ nhiều máy → API từ xa + cache cục bộ.</div>`,
  ]]);

const c4q = quiz('prm393-quiz-4', 'Quiz 4 — Storage & notifications|||Quiz 4 — Lưu & thông báo', [
  { id: 'q1', question: 'Lưu một token nhỏ, một cờ "đã xem" nên dùng?', options: ['SQLite', 'SharedPreferences', 'File ảnh', 'Biến toàn cục'], correctIndex: 1, explanation: 'SharedPreferences hợp key-value nhỏ.' },
  { id: 'q2', question: 'Dữ liệu có cấu trúc, cần truy vấn/lọc trên máy nên dùng?', options: ['SharedPreferences', 'SQLite (sqflite)', 'print', 'Text widget'], correctIndex: 1, explanation: 'SQLite là CSDL quan hệ trên thiết bị.' },
  { id: 'q3', question: 'Gửi thông báo tới người dùng khi app đã đóng cần?', options: ['Thông báo cục bộ', 'Push qua FCM (máy chủ gửi)', 'setState', 'Không làm được'], correctIndex: 1, explanation: 'Push notification qua Firebase Cloud Messaging từ backend.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'PRM393',
    slug: 'prm393-mobile-programming',
    title: 'Mobile Programming',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRM393.webp',
    shortDescription: 'Cross-platform mobile apps with Flutter & Dart — widgets, state management, navigation, async (Future/async-await), REST APIs, local storage (SharedPreferences/SQLite) and notifications. Bilingual, with runnable Dart & quizzes.|||App di động đa nền tảng với Flutter & Dart — widget, quản lý state, điều hướng, async (Future/async-await), REST API, lưu cục bộ (SharedPreferences/SQLite) và thông báo. Song ngữ, có Dart chạy được & quiz.',
    description: 'Môn <strong>PRM393 — Mobile Programming</strong> (kỳ 8) dựng ứng dụng di động <strong>đa nền tảng bằng Flutter &amp; Dart</strong> (một mã, chạy Android + iOS). Đi từ <strong>Dart &amp; cây widget</strong> (Stateless/Stateful) → <strong>quản lý state &amp; điều hướng</strong> (setState, Provider, Navigator) → <strong>bất đồng bộ &amp; REST API</strong> (Future/async-await, http, jsonDecode, FutureBuilder) → <strong>lưu cục bộ &amp; thông báo</strong> (SharedPreferences, SQLite, local &amp; push/FCM). Bám giáo trình FLM (syl 13822), song ngữ, code Dart chạy được và quiz mỗi chương.',
    whatYouLearn: 'Dart (kiểu, null-safety, lớp); widget & bố cục (Column/Row/Container, Stateless vs Stateful); setState & Provider; Navigator push/pop & truyền dữ liệu; Future/async/await; gọi HTTP + phân tích JSON thành model; FutureBuilder; SharedPreferences vs SQLite; thông báo cục bộ & push (FCM).',
    requirements: 'Đã học PRO192 (OOP). Quen Java/C# giúp học Dart nhanh. Cần cài Flutter SDK + một emulator/thiết bị.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao Flutter, Dart, cây widget.', lessons: [intro] },
    { title: 'Chương 1 — Dart & widget|||Chapter 1 — Dart & widgets', description: 'Dart cơ bản, Stateless/Stateful, bố cục.', lessons: [c1, c1q] },
    { title: 'Chương 2 — State & điều hướng|||Chapter 2 — State & navigation', description: 'setState, Provider, Navigator.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Async & REST|||Chapter 3 — Async & REST', description: 'Future/async-await, http, FutureBuilder.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Lưu cục bộ & thông báo|||Chapter 4 — Storage & notifications', description: 'SharedPreferences/SQLite, local/push.', lessons: [c4, c4q] },
  ],
};
