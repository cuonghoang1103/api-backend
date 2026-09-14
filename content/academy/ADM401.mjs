/**
 * ADM401 — Mobility Application Design. Thiên về XÂY DỰNG app di động (khác
 * ADH301/ADT401 vốn thiên thiết kế UX/UI): hiện thực hoá thiết kế thành app
 * chạy được — chọn nền tảng, Dart/Flutter (& React Native), widget/layout,
 * navigation, state, API/lưu cục bộ, tính năng thiết bị + kiểm thử, build &
 * phát hành. Song ngữ + ví dụ code + quiz. Nguồn: Flutter docs & "Flutter in
 * Action" (Windmill), React Native docs, "Head First Android/iOS", Google/
 * Apple developer guides. GIỮ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${
 * lồng; "<"→&lt; ">"→&gt; trong code; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('adm401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (kèm link), tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">ADM401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to <strong>build a real mobile app</strong> — from picking a platform to shipping on the store — in one place. The full official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for ADM401 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.manning.com/books/flutter-in-action" target="_blank" rel="noopener"><em>Flutter in Action</em> — Eric Windmill (Manning)</a></li>
<li><a href="https://www.oreilly.com/library/view/head-first-android/9781491974049/" target="_blank" rel="noopener"><em>Head First Android Development</em> — O&#39;Reilly</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.flutter.dev/" target="_blank" rel="noopener">Flutter documentation (docs.flutter.dev)</a> &amp; <a href="https://dart.dev/guides" target="_blank" rel="noopener">Dart language guide</a></li>
<li><a href="https://reactnative.dev/docs/getting-started" target="_blank" rel="noopener">React Native documentation</a></li>
<li><a href="https://developer.android.com/guide" target="_blank" rel="noopener">Android developer guide</a> &amp; <a href="https://developer.apple.com/documentation/" target="_blank" rel="noopener">Apple developer documentation</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@flutterdev" target="_blank" rel="noopener">Flutter</a> — official channel, widget of the week</li>
<li><a href="https://www.youtube.com/@TheNetNinja" target="_blank" rel="noopener">The Net Ninja</a> — Flutter &amp; React Native tutorials</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://dartpad.dev/" target="_blank" rel="noopener">DartPad</a> — run Dart/Flutter in the browser, no install</li>
<li><a href="https://developer.android.com/studio" target="_blank" rel="noopener">Android Studio</a> — IDE + emulator; <a href="https://developer.apple.com/xcode/" target="_blank" rel="noopener">Xcode</a> for iOS</li>
<li><a href="https://snack.expo.dev/" target="_blank" rel="noopener">Expo Snack</a> — run React Native in the browser</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — pick a platform, install the SDK, run the starter app on an emulator.</li>
<li><strong>Build UI</strong> — widgets/components, layout, navigation between screens.</li>
<li><strong>Add logic</strong> — state management, call a REST API, save data locally.</li>
<li><strong>Ship</strong> — use device features, write tests, build a release &amp; publish to the store.</li>
</ol></div>`,
    `<span class="eyebrow">ADM401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để <strong>dựng một app di động chạy thật</strong> — từ chọn nền tảng đến phát hành lên store — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của ADM401 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.manning.com/books/flutter-in-action" target="_blank" rel="noopener"><em>Flutter in Action</em> — Eric Windmill (Manning)</a></li>
<li><a href="https://www.oreilly.com/library/view/head-first-android/9781491974049/" target="_blank" rel="noopener"><em>Head First Android Development</em> — O&#39;Reilly</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.flutter.dev/" target="_blank" rel="noopener">Tài liệu Flutter (docs.flutter.dev)</a> &amp; <a href="https://dart.dev/guides" target="_blank" rel="noopener">hướng dẫn ngôn ngữ Dart</a></li>
<li><a href="https://reactnative.dev/docs/getting-started" target="_blank" rel="noopener">Tài liệu React Native</a></li>
<li><a href="https://developer.android.com/guide" target="_blank" rel="noopener">Hướng dẫn Android developer</a> &amp; <a href="https://developer.apple.com/documentation/" target="_blank" rel="noopener">tài liệu Apple developer</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@flutterdev" target="_blank" rel="noopener">Flutter</a> — kênh chính thức, widget mỗi tuần</li>
<li><a href="https://www.youtube.com/@TheNetNinja" target="_blank" rel="noopener">The Net Ninja</a> — hướng dẫn Flutter &amp; React Native</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://dartpad.dev/" target="_blank" rel="noopener">DartPad</a> — chạy Dart/Flutter trên trình duyệt, không cần cài</li>
<li><a href="https://developer.android.com/studio" target="_blank" rel="noopener">Android Studio</a> — IDE + máy ảo; <a href="https://developer.apple.com/xcode/" target="_blank" rel="noopener">Xcode</a> cho iOS</li>
<li><a href="https://snack.expo.dev/" target="_blank" rel="noopener">Expo Snack</a> — chạy React Native trên trình duyệt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — chọn nền tảng, cài SDK, chạy app mẫu trên máy ảo.</li>
<li><strong>Dựng giao diện</strong> — widget/component, layout, điều hướng giữa màn hình.</li>
<li><strong>Thêm logic</strong> — quản lý trạng thái, gọi REST API, lưu dữ liệu cục bộ.</li>
<li><strong>Phát hành</strong> — dùng tính năng thiết bị, viết kiểm thử, build bản release &amp; đưa lên store.</li>
</ol></div>`,
  ]]);

const intro = doc('adm401-0-1-overview', 'Course overview: from design to a running app|||Tổng quan: từ thiết kế đến app chạy được',
  'Môn XÂY DỰNG app di động: hiện thực hoá thiết kế thành sản phẩm chạy được. Lộ trình 8 chương: chọn nền tảng → ngôn ngữ/môi trường → widget/layout → navigation → state → API/lưu cục bộ → tính năng thiết bị & kiểm thử → build & phát hành.',
  [[
    `<span class="eyebrow">ADM401 · Lesson 0.1 · Overview</span>
<h2>From design to a running app</h2>
<p class="lead">Where ADH301/ADT401 focus on <strong>designing</strong> the experience (UX/UI), ADM401 is about <strong>building it</strong> — turning a mockup into a mobile app that installs, runs and ships. You write real code, run it on an emulator and a phone, and publish it.</p>
<h3>What you will be able to do</h3>
<ul>
<li>Choose a platform strategy (native vs cross-platform) and set up the SDK.</li>
<li>Compose UI from <strong>widgets/components</strong>, lay screens out, and navigate between them.</li>
<li>Manage <strong>state</strong>, call a <strong>REST API</strong>, and store data on the device.</li>
<li>Use <strong>device features</strong> (camera, GPS, notifications), write tests, and <strong>publish</strong> to the App Store / Google Play.</li>
</ul>
<h3>Roadmap (8 chapters)</h3>
<pre><code>1 Platforms   2 Language/env   3 Widgets/layout   4 Navigation
5 State        6 API + storage  7 Device + testing 8 Build + ship
</code></pre>
<div class="callout"><span class="badge">Tooling</span> Examples use <strong>Flutter (Dart)</strong> as the main stack, with <strong>React Native</strong> notes alongside — the concepts (widgets, navigation, state, API) transfer either way.</div>`,
    `<span class="eyebrow">ADM401 · Bài 0.1 · Tổng quan</span>
<h2>Từ thiết kế đến app chạy được</h2>
<p class="lead">Nếu ADH301/ADT401 tập trung <strong>thiết kế</strong> trải nghiệm (UX/UI), thì ADM401 tập trung <strong>hiện thực hoá</strong> — biến bản mockup thành một app di động cài được, chạy được và phát hành được. Bạn viết code thật, chạy trên máy ảo và điện thoại, rồi đưa lên store.</p>
<h3>Sau môn này bạn làm được</h3>
<ul>
<li>Chọn chiến lược nền tảng (native vs cross-platform) và cài đặt SDK.</li>
<li>Dựng giao diện từ <strong>widget/component</strong>, bố cục màn hình, điều hướng giữa các màn.</li>
<li>Quản lý <strong>trạng thái</strong>, gọi <strong>REST API</strong>, và lưu dữ liệu trên thiết bị.</li>
<li>Dùng <strong>tính năng thiết bị</strong> (camera, GPS, thông báo), viết kiểm thử, và <strong>phát hành</strong> lên App Store / Google Play.</li>
</ul>
<h3>Lộ trình (8 chương)</h3>
<pre><code>1 Nền tảng   2 Ngôn ngữ/môi trường  3 Widget/layout  4 Navigation
5 Trạng thái 6 API + lưu trữ        7 Thiết bị + test 8 Build + phát hành
</code></pre>
<div class="callout"><span class="badge">Công cụ</span> Ví dụ dùng <strong>Flutter (Dart)</strong> làm stack chính, kèm ghi chú <strong>React Native</strong> — các khái niệm (widget, navigation, state, API) đều chuyển được sang cả hai.</div>`,
  ]]);

const c1 = doc('adm401-1-1-platforms', '1.1 — Mobile development & choosing a platform|||1.1 — Phát triển app di động & chọn nền tảng',
  'Native (Kotlin/Swift) vs cross-platform (Flutter/React Native); vòng đời dựng app; tiêu chí chọn nền tảng.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 1 · Lesson 1.1</span>
<h2>Mobile app development &amp; choosing a platform</h2>
<p class="lead">The first real decision when building an app is the <strong>platform strategy</strong> — it shapes the language, tools and team you will need.</p>
<h3>Native vs cross-platform</h3>
<ul>
<li><strong>Native</strong> — Kotlin/Java for Android, Swift for iOS. Best performance and earliest access to new OS features, but you maintain <em>two</em> codebases.</li>
<li><strong>Cross-platform</strong> — one codebase, both stores. <strong>Flutter</strong> (Dart) draws its own widgets with a fast engine; <strong>React Native</strong> (JavaScript) renders real native views.</li>
</ul>
<h3>How to choose</h3>
<ul>
<li>Team already knows JS &rarr; React Native feels natural. Want one consistent UI on both OSes &rarr; Flutter.</li>
<li>Heavy platform-specific hardware/graphics or a single-OS product &rarr; consider native.</li>
</ul>
<h3>The build lifecycle</h3>
<pre><code>Idea/Design -&gt; Setup SDK -&gt; Build UI -&gt; Add logic/state
  -&gt; Connect API/data -&gt; Test -&gt; Build release -&gt; Publish -&gt; Update</code></pre>
<div class="callout"><span class="badge">Why Flutter here</span> One language (Dart), hot reload, and a single UI toolkit that looks the same on Android and iOS — fast to go from mockup to product.</div>`,
    `<span class="eyebrow">ADM401 · Chương 1 · Bài 1.1</span>
<h2>Phát triển app di động &amp; chọn nền tảng</h2>
<p class="lead">Quyết định thật đầu tiên khi dựng app là <strong>chiến lược nền tảng</strong> — nó định hình ngôn ngữ, công cụ và đội ngũ bạn cần.</p>
<h3>Native vs cross-platform</h3>
<ul>
<li><strong>Native</strong> — Kotlin/Java cho Android, Swift cho iOS. Hiệu năng tốt nhất và tiếp cận tính năng OS mới sớm nhất, nhưng phải nuôi <em>hai</em> codebase.</li>
<li><strong>Cross-platform</strong> — một codebase, cả hai store. <strong>Flutter</strong> (Dart) tự vẽ widget bằng engine nhanh; <strong>React Native</strong> (JavaScript) render view native thật.</li>
</ul>
<h3>Chọn thế nào</h3>
<ul>
<li>Đội đã biết JS &rarr; React Native thấy quen. Muốn một UI đồng nhất trên cả hai OS &rarr; Flutter.</li>
<li>Cần đồ hoạ/phần cứng đặc thù nặng hoặc sản phẩm một OS &rarr; cân nhắc native.</li>
</ul>
<h3>Vòng đời dựng app</h3>
<pre><code>Ý tưởng/Thiết kế -&gt; Cài SDK -&gt; Dựng UI -&gt; Thêm logic/state
  -&gt; Nối API/dữ liệu -&gt; Kiểm thử -&gt; Build release -&gt; Phát hành -&gt; Cập nhật</code></pre>
<div class="callout"><span class="badge">Vì sao chọn Flutter</span> Một ngôn ngữ (Dart), hot reload, và một bộ UI duy nhất trông giống nhau trên Android lẫn iOS — đi từ mockup đến sản phẩm rất nhanh.</div>`,
  ]]);

const c1q = quiz('adm401-quiz-1', 'Quiz 1 — Platforms|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Cách tiếp cận nào dùng MỘT codebase cho cả Android và iOS?', options: ['Native (Kotlin + Swift)', 'Cross-platform (Flutter/React Native)', 'Chỉ viết cho iOS', 'Web tĩnh'], correctIndex: 1, explanation: 'Cross-platform (Flutter, React Native) dùng một codebase build ra cả hai store; native cần hai codebase riêng.' },
  { id: 'q2', question: 'Điểm khác nhau chính giữa Flutter và React Native khi render giao diện?', options: ['Flutter tự vẽ widget bằng engine; React Native render view native', 'Cả hai đều chỉ chạy trên web', 'React Native tự vẽ, Flutter dùng view native', 'Không cái nào chạy trên iOS'], correctIndex: 0, explanation: 'Flutter tự vẽ widget bằng engine riêng; React Native ánh xạ sang view native thật của hệ điều hành.' },
  { id: 'q3', question: 'Ưu điểm lớn nhất của phát triển native so với cross-platform là?', options: ['Chỉ cần một codebase', 'Hiệu năng và tiếp cận tính năng OS mới sớm nhất', 'Không cần biết lập trình', 'Không cần store'], correctIndex: 1, explanation: 'Native cho hiệu năng tối đa và tiếp cận API mới sớm nhất, đổi lại phải duy trì hai codebase.' },
]);

const c2 = doc('adm401-2-1-language-env', '2.1 — Language & environment (Dart/Flutter)|||2.1 — Ngôn ngữ & môi trường (Dart/Flutter)',
  'Cài SDK, cấu trúc dự án, main()/runApp(); cú pháp Dart cơ bản (biến, kiểu, hàm, null-safety, async/await); hot reload.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 2 · Lesson 2.1</span>
<h2>Language &amp; environment</h2>
<p class="lead">Install the SDK, open the starter project, and learn just enough <strong>Dart</strong> to be productive.</p>
<h3>Set up &amp; run</h3>
<pre><code>flutter create my_app     # scaffold a project
cd my_app
flutter run               # run on an emulator or device</code></pre>
<p>Every Flutter app starts at <code>main()</code>, which hands a root widget to <code>runApp()</code>:</p>
<pre><code>import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: Scaffold(body: Center(child: Text('Hello'))));
  }
}</code></pre>
<h3>Dart essentials</h3>
<ul>
<li><strong>Types &amp; null-safety</strong> — <code>int</code>, <code>String</code>, <code>bool</code>; a nullable type is written <code>String?</code>. A typed list is <code>List&lt;String&gt;</code>.</li>
<li><strong>Functions</strong> — <code>int add(int a, int b) =&gt; a + b;</code></li>
<li><strong>Async</strong> — a network call returns a <code>Future&lt;T&gt;</code>; use <code>await</code> inside an <code>async</code> function.</li>
</ul>
<div class="callout"><span class="badge">Hot reload</span> Save the file and the running app updates in under a second, keeping its state — the single biggest reason Flutter/React Native feel fast to build in.</div>`,
    `<span class="eyebrow">ADM401 · Chương 2 · Bài 2.1</span>
<h2>Ngôn ngữ &amp; môi trường</h2>
<p class="lead">Cài SDK, mở dự án mẫu, và học vừa đủ <strong>Dart</strong> để làm việc hiệu quả.</p>
<h3>Cài đặt &amp; chạy</h3>
<pre><code>flutter create my_app     # tạo khung dự án
cd my_app
flutter run               # chạy trên máy ảo hoặc thiết bị</code></pre>
<p>Mọi app Flutter bắt đầu ở <code>main()</code>, hàm này trao widget gốc cho <code>runApp()</code>:</p>
<pre><code>import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: Scaffold(body: Center(child: Text('Hello'))));
  }
}</code></pre>
<h3>Dart cốt lõi</h3>
<ul>
<li><strong>Kiểu &amp; null-safety</strong> — <code>int</code>, <code>String</code>, <code>bool</code>; kiểu cho phép null viết là <code>String?</code>. Danh sách có kiểu là <code>List&lt;String&gt;</code>.</li>
<li><strong>Hàm</strong> — <code>int add(int a, int b) =&gt; a + b;</code></li>
<li><strong>Bất đồng bộ</strong> — lời gọi mạng trả về <code>Future&lt;T&gt;</code>; dùng <code>await</code> bên trong hàm <code>async</code>.</li>
</ul>
<div class="callout"><span class="badge">Hot reload</span> Lưu file là app đang chạy cập nhật trong chưa tới một giây và GIỮ nguyên trạng thái — lý do lớn nhất khiến Flutter/React Native dựng nhanh.</div>`,
  ]]);

const c2q = quiz('adm401-quiz-2', 'Quiz 2 — Language & env|||Quiz 2 — Ngôn ngữ & môi trường', [
  { id: 'q1', question: 'Trong Flutter, hàm nào là điểm khởi đầu và nhận widget gốc?', options: ['start()', 'main() gọi runApp()', 'build()', 'init()'], correctIndex: 1, explanation: 'main() là điểm vào; nó gọi runApp() với widget gốc để dựng cây widget của app.' },
  { id: 'q2', question: 'Trong Dart, một lời gọi mạng bất đồng bộ thường trả về kiểu gì?', options: ['void', 'Future<T>', 'int', 'Widget'], correctIndex: 1, explanation: 'Tác vụ bất đồng bộ trả về Future<T>; dùng await trong hàm async để chờ kết quả.' },
  { id: 'q3', question: 'Tính năng nào cập nhật app đang chạy trong chưa tới một giây mà vẫn giữ trạng thái?', options: ['Hot reload', 'Cold start', 'Garbage collection', 'Code signing'], correctIndex: 0, explanation: 'Hot reload nạp lại code vào máy ảo Dart mà không khởi động lại app, giữ nguyên state hiện tại.' },
]);

const c3 = doc('adm401-3-1-widgets-layout', '3.1 — Widgets/components & layout|||3.1 — Widget/component & layout',
  'Stateless vs stateful; widget dựng khối (Text, Image, Button); bố cục Row/Column/Stack/Container; padding, flex, alignment.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 3 · Lesson 3.1</span>
<h2>Widgets/components &amp; layout</h2>
<p class="lead">In Flutter <em>everything is a widget</em> — text, a button, padding, even the whole screen. You compose them like Lego bricks.</p>
<h3>Two kinds of widget</h3>
<ul>
<li><strong>StatelessWidget</strong> — draws from fixed inputs, never changes itself (a label, an icon).</li>
<li><strong>StatefulWidget</strong> — holds mutable state and redraws when it changes (a counter, a form).</li>
</ul>
<h3>Building blocks &amp; layout</h3>
<p><code>Text</code>, <code>Image</code>, <code>Icon</code>, <code>ElevatedButton</code> are content; <code>Row</code>, <code>Column</code>, <code>Stack</code>, <code>Container</code>, <code>Padding</code> arrange them. A <code>Column</code> takes a <code>List&lt;Widget&gt;</code>:</p>
<pre><code>Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    Text('Welcome'),
    SizedBox(height: 12),
    ElevatedButton(onPressed: () {}, child: Text('Start')),
  ],
)</code></pre>
<p>In <strong>React Native</strong> the same idea uses components inside JSX:</p>
<pre><code>&lt;View style={styles.center}&gt;
  &lt;Text&gt;Welcome&lt;/Text&gt;
  &lt;Button title="Start" onPress={handleStart} /&gt;
&lt;/View&gt;</code></pre>
<div class="callout"><span class="badge">Compose, do not inherit</span> Build complex UI by nesting small widgets, not by subclassing big ones — the same design principle you saw in your UX/UI courses, now in code.</div>`,
    `<span class="eyebrow">ADM401 · Chương 3 · Bài 3.1</span>
<h2>Widget/component &amp; layout</h2>
<p class="lead">Trong Flutter <em>mọi thứ đều là widget</em> — chữ, nút, padding, cả màn hình. Bạn ghép chúng như xếp Lego.</p>
<h3>Hai loại widget</h3>
<ul>
<li><strong>StatelessWidget</strong> — vẽ từ dữ liệu cố định, tự nó không đổi (nhãn, biểu tượng).</li>
<li><strong>StatefulWidget</strong> — giữ trạng thái thay đổi được và vẽ lại khi state đổi (bộ đếm, form).</li>
</ul>
<h3>Khối dựng &amp; bố cục</h3>
<p><code>Text</code>, <code>Image</code>, <code>Icon</code>, <code>ElevatedButton</code> là nội dung; <code>Row</code>, <code>Column</code>, <code>Stack</code>, <code>Container</code>, <code>Padding</code> để sắp xếp. Một <code>Column</code> nhận một <code>List&lt;Widget&gt;</code>:</p>
<pre><code>Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    Text('Welcome'),
    SizedBox(height: 12),
    ElevatedButton(onPressed: () {}, child: Text('Start')),
  ],
)</code></pre>
<p>Trong <strong>React Native</strong> cùng ý tưởng dùng component trong JSX:</p>
<pre><code>&lt;View style={styles.center}&gt;
  &lt;Text&gt;Welcome&lt;/Text&gt;
  &lt;Button title="Start" onPress={handleStart} /&gt;
&lt;/View&gt;</code></pre>
<div class="callout"><span class="badge">Ghép, đừng kế thừa</span> Dựng UI phức tạp bằng cách lồng các widget nhỏ, không phải kế thừa widget lớn — đúng nguyên tắc thiết kế bạn học ở môn UX/UI, nay bằng code.</div>`,
  ]]);

const c3q = quiz('adm401-quiz-3', 'Quiz 3 — Widgets & layout|||Quiz 3 — Widget & layout', [
  { id: 'q1', question: 'Widget nào PHÙ HỢP cho phần giao diện có trạng thái thay đổi được (ví dụ bộ đếm)?', options: ['StatelessWidget', 'StatefulWidget', 'Container', 'Text'], correctIndex: 1, explanation: 'StatefulWidget giữ state thay đổi được và vẽ lại khi state đổi; StatelessWidget chỉ vẽ từ dữ liệu cố định.' },
  { id: 'q2', question: 'Trong Flutter, widget nào sắp các con theo chiều DỌC?', options: ['Row', 'Column', 'Stack', 'Padding'], correctIndex: 1, explanation: 'Column xếp các con theo trục dọc; Row xếp ngang; Stack chồng lên nhau.' },
  { id: 'q3', question: 'Câu nào đúng về nguyên tắc dựng UI trong Flutter?', options: ['Mọi thứ là widget và được ghép bằng cách lồng nhau', 'UI chỉ viết bằng HTML thuần', 'Không thể lồng widget vào nhau', 'Phải kế thừa một widget khổng lồ'], correctIndex: 0, explanation: 'Trong Flutter mọi thứ là widget; UI phức tạp dựng bằng cách lồng (compose) các widget nhỏ.' },
]);

const c4 = doc('adm401-4-1-navigation', '4.1 — Navigation & routing|||4.1 — Điều hướng & routing',
  'Stack điều hướng (push/pop); truyền dữ liệu giữa màn hình; named routes; tab & bottom navigation.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 4 · Lesson 4.1</span>
<h2>Navigation &amp; routing</h2>
<p class="lead">Real apps have many screens. Navigation is a <strong>stack</strong>: you <em>push</em> a new screen on top and <em>pop</em> to go back.</p>
<h3>Push &amp; pop</h3>
<pre><code>// Go to a detail screen
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) =&gt; const DetailPage()),
);

// Return to the previous screen
Navigator.pop(context);</code></pre>
<h3>Passing data</h3>
<p>Pass arguments into the screen constructor, and return a result with <code>pop(value)</code>:</p>
<pre><code>MaterialPageRoute(builder: (_) =&gt; DetailPage(id: 42))</code></pre>
<h3>Named routes &amp; tabs</h3>
<ul>
<li><strong>Named routes</strong> — register screens by name and navigate with <code>Navigator.pushNamed(context, '/detail')</code>; cleaner for big apps.</li>
<li><strong>Bottom navigation / tabs</strong> — a <code>BottomNavigationBar</code> switches between top-level sections (Home, Search, Profile).</li>
</ul>
<div class="callout"><span class="badge">React Native</span> The same model exists via <strong>React Navigation</strong>: <code>navigation.navigate('Detail')</code> and stack/tab navigators.</div>`,
    `<span class="eyebrow">ADM401 · Chương 4 · Bài 4.1</span>
<h2>Điều hướng &amp; routing</h2>
<p class="lead">App thật có nhiều màn hình. Điều hướng là một <strong>ngăn xếp (stack)</strong>: bạn <em>push</em> màn mới lên trên và <em>pop</em> để quay lại.</p>
<h3>Push &amp; pop</h3>
<pre><code>// Sang màn chi tiết
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) =&gt; const DetailPage()),
);

// Quay lại màn trước
Navigator.pop(context);</code></pre>
<h3>Truyền dữ liệu</h3>
<p>Truyền tham số qua constructor của màn, và trả kết quả về bằng <code>pop(value)</code>:</p>
<pre><code>MaterialPageRoute(builder: (_) =&gt; DetailPage(id: 42))</code></pre>
<h3>Named routes &amp; tab</h3>
<ul>
<li><strong>Named routes</strong> — đăng ký màn theo tên rồi điều hướng bằng <code>Navigator.pushNamed(context, '/detail')</code>; gọn cho app lớn.</li>
<li><strong>Bottom navigation / tab</strong> — <code>BottomNavigationBar</code> chuyển giữa các mục cấp cao (Trang chủ, Tìm kiếm, Hồ sơ).</li>
</ul>
<div class="callout"><span class="badge">React Native</span> Cùng mô hình qua <strong>React Navigation</strong>: <code>navigation.navigate('Detail')</code> với stack/tab navigator.</div>`,
  ]]);

const c4q = quiz('adm401-quiz-4', 'Quiz 4 — Navigation|||Quiz 4 — Điều hướng', [
  { id: 'q1', question: 'Điều hướng giữa các màn hình trong Flutter dựa trên cấu trúc dữ liệu nào?', options: ['Hàng đợi (queue)', 'Ngăn xếp (stack): push/pop', 'Cây nhị phân', 'Bảng băm'], correctIndex: 1, explanation: 'Navigator quản lý màn hình như một stack: push để mở màn mới, pop để quay lại.' },
  { id: 'q2', question: 'Muốn quay lại màn hình trước đó, gọi lệnh nào?', options: ['Navigator.push', 'Navigator.pop(context)', 'Navigator.replace', 'runApp'], correctIndex: 1, explanation: 'Navigator.pop(context) gỡ màn hiện tại khỏi stack và hiện lại màn trước; có thể trả kèm giá trị bằng pop(value).' },
  { id: 'q3', question: 'Cách truyền dữ liệu vào màn hình đích thường dùng là?', options: ['Ghi ra file rồi đọc lại', 'Truyền tham số qua constructor của màn đó', 'Không thể truyền dữ liệu', 'Dùng biến toàn cục bắt buộc'], correctIndex: 1, explanation: 'Cách phổ biến và rõ ràng là truyền tham số qua constructor của widget màn đích khi tạo route.' },
]);

const c5 = doc('adm401-5-1-state', '5.1 — State management|||5.1 — Quản lý trạng thái',
  'setState cục bộ; nâng state lên cha; giải pháp app-wide (Provider/ChangeNotifier, Riverpod/Bloc); tránh rebuild thừa.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 5 · Lesson 5.1</span>
<h2>State management</h2>
<p class="lead"><strong>State</strong> is data that changes while the app runs — a counter, a logged-in user, items in a cart. Managing it well is what keeps a growing app sane.</p>
<h3>Local state: setState</h3>
<pre><code>class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State&lt;Counter&gt; createState() =&gt; _CounterState();
}

class _CounterState extends State&lt;Counter&gt; {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () =&gt; setState(() =&gt; _count++),
      child: Text('Count: ' + _count.toString()),
    );
  }
}</code></pre>
<h3>App-wide state</h3>
<p>When many screens share data, lift it out of a single widget. A common pattern is <strong>Provider + ChangeNotifier</strong>:</p>
<pre><code>class CartModel extends ChangeNotifier {
  final items = &lt;String&gt;[];
  void add(String p) {
    items.add(p);
    notifyListeners();   // tells listeners to rebuild
  }
}</code></pre>
<div class="callout"><span class="badge">Choose the smallest tool</span> Local UI &rarr; <code>setState</code>. Shared across screens &rarr; Provider/Riverpod/Bloc. Do not reach for a global store until you actually share state.</div>`,
    `<span class="eyebrow">ADM401 · Chương 5 · Bài 5.1</span>
<h2>Quản lý trạng thái</h2>
<p class="lead"><strong>Trạng thái (state)</strong> là dữ liệu thay đổi khi app chạy — bộ đếm, người dùng đã đăng nhập, món trong giỏ. Quản lý tốt là thứ giữ cho app lớn dần vẫn gọn.</p>
<h3>State cục bộ: setState</h3>
<pre><code>class Counter extends StatefulWidget {
  const Counter({super.key});
  @override
  State&lt;Counter&gt; createState() =&gt; _CounterState();
}

class _CounterState extends State&lt;Counter&gt; {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () =&gt; setState(() =&gt; _count++),
      child: Text('Count: ' + _count.toString()),
    );
  }
}</code></pre>
<h3>State toàn app</h3>
<p>Khi nhiều màn cùng dùng chung dữ liệu, nâng nó ra khỏi một widget. Mẫu phổ biến là <strong>Provider + ChangeNotifier</strong>:</p>
<pre><code>class CartModel extends ChangeNotifier {
  final items = &lt;String&gt;[];
  void add(String p) {
    items.add(p);
    notifyListeners();   // báo cho listener vẽ lại
  }
}</code></pre>
<div class="callout"><span class="badge">Chọn công cụ nhỏ nhất</span> UI cục bộ &rarr; <code>setState</code>. Dùng chung nhiều màn &rarr; Provider/Riverpod/Bloc. Đừng vội dùng store toàn cục khi chưa thực sự chia sẻ state.</div>`,
  ]]);

const c5q = quiz('adm401-quiz-5', 'Quiz 5 — State|||Quiz 5 — Trạng thái', [
  { id: 'q1', question: 'Trong một StatefulWidget, gọi gì để cập nhật state và yêu cầu vẽ lại?', options: ['print()', 'setState(() { ... })', 'runApp()', 'pop()'], correctIndex: 1, explanation: 'setState báo cho Flutter rằng state đã đổi và widget cần build lại với dữ liệu mới.' },
  { id: 'q2', question: 'Với ChangeNotifier, phương thức nào báo cho các listener biết dữ liệu đã đổi?', options: ['setState()', 'notifyListeners()', 'dispose()', 'build()'], correctIndex: 1, explanation: 'notifyListeners() phát tín hiệu để các widget đang lắng nghe model vẽ lại theo dữ liệu mới.' },
  { id: 'q3', question: 'Khi nào NÊN dùng giải pháp state toàn app (Provider/Bloc) thay vì setState?', options: ['Luôn luôn, kể cả state chỉ dùng trong một widget', 'Khi dữ liệu được chia sẻ giữa nhiều màn hình', 'Chỉ khi app không có màn hình nào', 'Không bao giờ cần'], correctIndex: 1, explanation: 'setState hợp cho state cục bộ; khi nhiều màn cùng đọc/ghi một dữ liệu thì mới nâng lên giải pháp app-wide.' },
]);

const c6 = doc('adm401-6-1-api-storage', '6.1 — Calling APIs, local storage & backend|||6.1 — Gọi API, lưu cục bộ & tích hợp backend',
  'Gọi REST bằng http; parse JSON thành model; async/await + xử lý lỗi; lưu cục bộ (SharedPreferences/SQLite); tích hợp backend.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 6 · Lesson 6.1</span>
<h2>Calling APIs, local storage &amp; backend</h2>
<p class="lead">Most apps are a UI over data that lives on a <strong>server</strong> — plus a little kept on the <strong>device</strong>. This chapter connects both.</p>
<h3>Call a REST API</h3>
<pre><code>import 'package:http/http.dart' as http;
import 'dart:convert';

Future&lt;List&lt;Post&gt;&gt; fetchPosts() async {
  final res = await http.get(Uri.parse('https://api.example.com/posts'));
  if (res.statusCode != 200) {
    throw Exception('Failed: ' + res.statusCode.toString());
  }
  final data = jsonDecode(res.body) as List;
  return data.map((j) =&gt; Post.fromJson(j)).toList();
}</code></pre>
<p>Parse the JSON into a typed <strong>model</strong> with a <code>fromJson</code> factory, so the rest of the app works with objects, not raw maps.</p>
<h3>Store data on the device</h3>
<ul>
<li><strong>Key/value</strong> — <code>SharedPreferences</code> for small things (a token, a theme flag).</li>
<li><strong>Structured</strong> — <code>sqflite</code> (SQLite) or <code>Hive</code> for lists/records, offline caching.</li>
</ul>
<div class="callout"><span class="badge">Always handle failure</span> Networks fail — wrap calls in try/catch, show a loading and an error state, and never assume the response is 200.</div>`,
    `<span class="eyebrow">ADM401 · Chương 6 · Bài 6.1</span>
<h2>Gọi API, lưu cục bộ &amp; tích hợp backend</h2>
<p class="lead">Phần lớn app là một UI phủ lên dữ liệu nằm trên <strong>server</strong> — cộng thêm một ít lưu trên <strong>thiết bị</strong>. Chương này nối cả hai.</p>
<h3>Gọi REST API</h3>
<pre><code>import 'package:http/http.dart' as http;
import 'dart:convert';

Future&lt;List&lt;Post&gt;&gt; fetchPosts() async {
  final res = await http.get(Uri.parse('https://api.example.com/posts'));
  if (res.statusCode != 200) {
    throw Exception('Failed: ' + res.statusCode.toString());
  }
  final data = jsonDecode(res.body) as List;
  return data.map((j) =&gt; Post.fromJson(j)).toList();
}</code></pre>
<p>Parse JSON thành <strong>model</strong> có kiểu bằng factory <code>fromJson</code>, để phần còn lại của app làm việc với đối tượng thay vì map thô.</p>
<h3>Lưu dữ liệu trên thiết bị</h3>
<ul>
<li><strong>Khóa/giá trị</strong> — <code>SharedPreferences</code> cho thứ nhỏ (token, cờ giao diện).</li>
<li><strong>Có cấu trúc</strong> — <code>sqflite</code> (SQLite) hoặc <code>Hive</code> cho danh sách/bản ghi, cache offline.</li>
</ul>
<div class="callout"><span class="badge">Luôn xử lý lỗi</span> Mạng có thể hỏng — bọc lời gọi trong try/catch, hiện trạng thái đang tải và trạng thái lỗi, đừng bao giờ mặc định phản hồi là 200.</div>`,
  ]]);

const c6q = quiz('adm401-quiz-6', 'Quiz 6 — API & storage|||Quiz 6 — API & lưu trữ', [
  { id: 'q1', question: 'Dữ liệu JSON nhận từ REST API nên được xử lý thế nào trước khi dùng trong app?', options: ['Hiển thị nguyên chuỗi thô', 'Parse (jsonDecode) và ánh xạ thành model có kiểu', 'Bỏ qua, không cần đọc', 'Ghi thẳng vào giao diện'], correctIndex: 1, explanation: 'jsonDecode chuyển chuỗi JSON thành cấu trúc Dart; rồi map sang model có kiểu (fromJson) để app làm việc với đối tượng.' },
  { id: 'q2', question: 'Lưu một giá trị nhỏ như token đăng nhập trên thiết bị nên dùng?', options: ['SharedPreferences (khóa/giá trị)', 'Một REST API mới', 'Biến toàn cục mất khi tắt app', 'Không lưu được'], correctIndex: 0, explanation: 'SharedPreferences hợp cho dữ liệu nhỏ dạng khóa/giá trị; dữ liệu có cấu trúc lớn hơn thì dùng SQLite/Hive.' },
  { id: 'q3', question: 'Vì sao phải bọc lời gọi mạng trong try/catch và kiểm tra statusCode?', options: ['Để app chạy nhanh hơn', 'Vì mạng có thể lỗi và phản hồi không phải lúc nào cũng 200', 'Vì Dart bắt buộc mọi hàm phải có try/catch', 'Không cần thiết'], correctIndex: 1, explanation: 'Mạng có thể timeout/lỗi và server có thể trả mã khác 200; xử lý lỗi giúp hiện trạng thái phù hợp thay vì app crash.' },
]);

const c7 = doc('adm401-7-1-device-testing', '7.1 — Device features & testing|||7.1 — Tính năng thiết bị & kiểm thử',
  'Xin quyền; camera, GPS, thông báo (plugins); kiểm thử unit/widget/integration; chạy trên máy thật.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 7 · Lesson 7.1</span>
<h2>Device features &amp; testing</h2>
<p class="lead">A mobile app can use the phone itself — camera, location, notifications — but only with the user&#39;s <strong>permission</strong>. And before you ship, you <strong>test</strong>.</p>
<h3>Access device features (plugins)</h3>
<pre><code>// Camera / gallery
final image = await ImagePicker().pickImage(source: ImageSource.camera);

// Location
final pos = await Geolocator.getCurrentPosition();
print(pos.latitude.toString() + ', ' + pos.longitude.toString());</code></pre>
<p>Each feature needs a permission declared in <code>AndroidManifest.xml</code> / iOS <code>Info.plist</code>, and requested at runtime. <strong>Local notifications</strong> use a plugin such as <code>flutter_local_notifications</code>.</p>
<h3>Testing pyramid</h3>
<ul>
<li><strong>Unit</strong> — pure logic, fast, many.</li>
<li><strong>Widget</strong> — a single widget renders and reacts.</li>
<li><strong>Integration</strong> — the whole app on a device/emulator.</li>
</ul>
<pre><code>testWidgets('increments the counter', (tester) async {
  await tester.pumpWidget(const MyApp());
  expect(find.text('Count: 0'), findsOneWidget);
  await tester.tap(find.byType(TextButton));
  await tester.pump();
  expect(find.text('Count: 1'), findsOneWidget);
});</code></pre>
<div class="callout"><span class="badge">Test on real hardware</span> Emulators miss real cameras, GPS drift, slow networks and small screens — always run on a physical phone before release.</div>`,
    `<span class="eyebrow">ADM401 · Chương 7 · Bài 7.1</span>
<h2>Tính năng thiết bị &amp; kiểm thử</h2>
<p class="lead">App di động có thể dùng chính chiếc điện thoại — camera, vị trí, thông báo — nhưng chỉ khi được người dùng <strong>cấp quyền</strong>. Và trước khi phát hành, bạn phải <strong>kiểm thử</strong>.</p>
<h3>Truy cập tính năng thiết bị (plugin)</h3>
<pre><code>// Camera / thư viện ảnh
final image = await ImagePicker().pickImage(source: ImageSource.camera);

// Vị trí
final pos = await Geolocator.getCurrentPosition();
print(pos.latitude.toString() + ', ' + pos.longitude.toString());</code></pre>
<p>Mỗi tính năng cần khai quyền trong <code>AndroidManifest.xml</code> / <code>Info.plist</code> (iOS) và xin lúc chạy. <strong>Thông báo cục bộ</strong> dùng plugin như <code>flutter_local_notifications</code>.</p>
<h3>Kim tự tháp kiểm thử</h3>
<ul>
<li><strong>Unit</strong> — logic thuần, nhanh, nhiều.</li>
<li><strong>Widget</strong> — một widget render và phản ứng.</li>
<li><strong>Integration</strong> — cả app trên thiết bị/máy ảo.</li>
</ul>
<pre><code>testWidgets('increments the counter', (tester) async {
  await tester.pumpWidget(const MyApp());
  expect(find.text('Count: 0'), findsOneWidget);
  await tester.tap(find.byType(TextButton));
  await tester.pump();
  expect(find.text('Count: 1'), findsOneWidget);
});</code></pre>
<div class="callout"><span class="badge">Kiểm trên máy thật</span> Máy ảo bỏ sót camera thật, GPS lệch, mạng chậm và màn hình nhỏ — luôn chạy trên điện thoại thật trước khi phát hành.</div>`,
  ]]);

const c7q = quiz('adm401-quiz-7', 'Quiz 7 — Device & testing|||Quiz 7 — Thiết bị & kiểm thử', [
  { id: 'q1', question: 'Trước khi dùng camera hoặc GPS, app BẮT BUỘC phải làm gì?', options: ['Không cần làm gì', 'Khai quyền và xin quyền của người dùng lúc chạy', 'Tắt hết tính năng khác', 'Đưa lên store trước'], correctIndex: 1, explanation: 'Tính năng nhạy cảm cần khai trong AndroidManifest.xml/Info.plist và xin quyền runtime; không có quyền thì hệ điều hành từ chối.' },
  { id: 'q2', question: 'Loại kiểm thử nào chạy toàn bộ app trên thiết bị/máy ảo?', options: ['Unit test', 'Widget test', 'Integration test', 'Không có loại nào'], correctIndex: 2, explanation: 'Integration test kiểm cả app end-to-end trên thiết bị/máy ảo; unit test kiểm logic, widget test kiểm một widget.' },
  { id: 'q3', question: 'Vì sao vẫn nên kiểm trên điện thoại thật dù đã chạy tốt trên máy ảo?', options: ['Máy thật luôn chạy chậm hơn nên cần đo', 'Máy ảo bỏ sót camera thật, GPS lệch, mạng chậm, màn hình nhỏ', 'Máy ảo không chạy được app', 'Không có lý do gì'], correctIndex: 1, explanation: 'Máy ảo không tái hiện đầy đủ phần cứng và điều kiện thực (camera, GPS, mạng, kích thước màn), nên phải kiểm trên máy thật.' },
]);

const c8 = doc('adm401-8-1-build-publish', '8.1 — Build, performance & publishing|||8.1 — Build, hiệu năng & phát hành',
  'Build release (APK/AAB, IPA); tối ưu hiệu năng (rebuild, ảnh, list dài); ký app; đưa lên Google Play & App Store; cập nhật.',
  [[
    `<span class="eyebrow">ADM401 · Chapter 8 · Lesson 8.1</span>
<h2>Build, performance &amp; publishing</h2>
<p class="lead">The last mile: turn your project into a signed <strong>release build</strong>, make it fast, and get it onto the stores.</p>
<h3>Build a release</h3>
<pre><code>flutter build appbundle --release   # Google Play (.aab, preferred)
flutter build apk --release         # Android APK (sideload/test)
flutter build ipa --release         # iOS -&gt; App Store (needs Xcode/macOS)</code></pre>
<p>A release build must be <strong>signed</strong> — an Android keystore, an Apple signing certificate + provisioning profile.</p>
<h3>Performance basics</h3>
<ul>
<li>Keep <code>build()</code> cheap; avoid rebuilding large subtrees — use <code>const</code> widgets and scope <code>setState</code>.</li>
<li>Render long lists lazily with <code>ListView.builder</code>, not a giant <code>Column</code>.</li>
<li>Size and cache images; do heavy work off the UI thread.</li>
</ul>
<h3>Publish</h3>
<ul>
<li><strong>Google Play</strong> — Play Console: upload the <code>.aab</code>, fill the store listing, roll out.</li>
<li><strong>App Store</strong> — App Store Connect + Xcode: submit the build for App Review.</li>
<li>Bump the <strong>version</strong> for every update; ship fixes as new builds.</li>
</ul>
<div class="callout"><span class="badge">You built an app</span> Design &rarr; platform &rarr; language &rarr; UI &rarr; navigation &rarr; state &rarr; data &rarr; device &rarr; test &rarr; ship. That full loop is what this course is for.</div>`,
    `<span class="eyebrow">ADM401 · Chương 8 · Bài 8.1</span>
<h2>Build, hiệu năng &amp; phát hành</h2>
<p class="lead">Chặng cuối: biến dự án thành bản <strong>release đã ký</strong>, làm cho nó mượt, và đưa lên store.</p>
<h3>Build bản release</h3>
<pre><code>flutter build appbundle --release   # Google Play (.aab, nên dùng)
flutter build apk --release         # APK Android (cài tay/test)
flutter build ipa --release         # iOS -&gt; App Store (cần Xcode/macOS)</code></pre>
<p>Bản release phải được <strong>ký (sign)</strong> — keystore cho Android, chứng chỉ ký + provisioning profile cho Apple.</p>
<h3>Cơ bản về hiệu năng</h3>
<ul>
<li>Giữ <code>build()</code> nhẹ; tránh vẽ lại cây con lớn — dùng widget <code>const</code> và thu hẹp phạm vi <code>setState</code>.</li>
<li>Vẽ danh sách dài kiểu lười bằng <code>ListView.builder</code>, đừng dùng một <code>Column</code> khổng lồ.</li>
<li>Chỉnh cỡ và cache ảnh; đưa việc nặng ra khỏi luồng UI.</li>
</ul>
<h3>Phát hành</h3>
<ul>
<li><strong>Google Play</strong> — Play Console: tải <code>.aab</code> lên, điền store listing, phát hành dần.</li>
<li><strong>App Store</strong> — App Store Connect + Xcode: nộp bản build cho App Review.</li>
<li>Tăng <strong>version</strong> mỗi lần cập nhật; sửa lỗi bằng bản build mới.</li>
</ul>
<div class="callout"><span class="badge">Bạn đã dựng một app</span> Thiết kế &rarr; nền tảng &rarr; ngôn ngữ &rarr; UI &rarr; điều hướng &rarr; state &rarr; dữ liệu &rarr; thiết bị &rarr; kiểm thử &rarr; phát hành. Vòng lặp đầy đủ đó chính là điều môn học này hướng tới.</div>`,
  ]]);

const c8q = quiz('adm401-quiz-8', 'Quiz 8 — Build & publish|||Quiz 8 — Build & phát hành', [
  { id: 'q1', question: 'Định dạng nào được ưu tiên để tải lên Google Play?', options: ['APK', 'App Bundle (.aab)', 'IPA', 'ZIP'], correctIndex: 1, explanation: 'Google Play ưu tiên Android App Bundle (.aab); IPA dành cho App Store của iOS.' },
  { id: 'q2', question: 'Để render một danh sách RẤT DÀI hiệu quả, nên dùng?', options: ['Một Column khổng lồ chứa hết item', 'ListView.builder (vẽ lười theo nhu cầu)', 'Nhiều setState liên tục', 'Không hiển thị danh sách'], correctIndex: 1, explanation: 'ListView.builder chỉ dựng các item đang hiển thị (lazy), tránh dựng toàn bộ danh sách như một Column lớn gây tốn bộ nhớ.' },
  { id: 'q3', question: 'Một bản release trước khi đưa lên store bắt buộc phải?', options: ['Được ký (signed) bằng keystore/chứng chỉ', 'Chạy ở chế độ debug', 'Bỏ hết tính năng thiết bị', 'Không tăng version'], correctIndex: 0, explanation: 'Bản release phải được ký bằng keystore (Android) hoặc chứng chỉ + provisioning profile (Apple) thì store mới chấp nhận.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'ADM401',
    slug: 'adm401-mobility-application-design',
    title: 'Mobility Application Design',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/ADM401.webp',
    shortDescription: 'Build real mobile apps — native vs cross-platform, Dart/Flutter, widgets & layout, navigation, state, REST APIs & local storage, device features & testing, then build & ship to App Store/Google Play. Bilingual, code examples & quizzes.|||Dựng app di động chạy thật — native/cross-platform, Dart/Flutter, widget & layout, điều hướng, state, REST API & lưu cục bộ, tính năng thiết bị & kiểm thử, rồi build & phát hành App Store/Google Play. Song ngữ, ví dụ code & quiz.',
    description: 'Môn <strong>ADM401 — Mobility Application Design</strong> (kỳ 8, ngành Thiết kế mỹ thuật số) thiên về <strong>XÂY DỰNG</strong> app di động: hiện thực hoá thiết kế thành sản phẩm chạy được (khác ADH301/ADT401 vốn thiên thiết kế UX/UI). Lộ trình: <strong>chọn nền tảng</strong> (native vs cross-platform) → <strong>ngôn ngữ &amp; môi trường</strong> (Dart/Flutter, kèm React Native) → <strong>widget/component &amp; layout</strong> → <strong>navigation</strong> → <strong>quản lý trạng thái</strong> → <strong>gọi API, lưu cục bộ &amp; tích hợp backend</strong> → <strong>tính năng thiết bị (camera/GPS/thông báo) &amp; kiểm thử</strong> → <strong>build, tối ưu hiệu năng &amp; phát hành</strong> lên App Store/Google Play. Song ngữ, nhiều ví dụ code, quiz mỗi chương. Nguồn: Flutter docs &amp; <em>Flutter in Action</em> (Windmill), React Native docs, <em>Head First Android/iOS</em>, Google/Apple developer guides.',
    whatYouLearn: 'Chọn native vs cross-platform &amp; cài SDK; cú pháp Dart (kiểu, null-safety, Future/async-await) &amp; hot reload; widget stateless/stateful, Row/Column/Stack, layout; navigation push/pop, truyền dữ liệu, named routes, tab; state management (setState, Provider/ChangeNotifier, Bloc); gọi REST bằng http, parse JSON thành model, lưu cục bộ (SharedPreferences/SQLite); tính năng thiết bị (camera, GPS, thông báo) &amp; xin quyền; kiểm thử unit/widget/integration; build release (APK/AAB/IPA), tối ưu hiệu năng, ký &amp; phát hành lên Google Play/App Store.',
    requirements: 'Đã có nền lập trình cơ bản (biến, hàm, lớp, OOP) và quen với thiết kế UX/UI (ADH301/ADT401 hoặc tương đương). Nên cài Flutter SDK + Android Studio (hoặc dùng DartPad để thử nhanh).',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Flutter/React Native docs, sách, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ thiết kế đến app chạy được; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng|||Chapter 1 — Platforms', description: 'Native vs cross-platform, vòng đời dựng app.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngôn ngữ & môi trường|||Chapter 2 — Language & env', description: 'Dart/Flutter, cài SDK, hot reload.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Widget & layout|||Chapter 3 — Widgets & layout', description: 'Stateless/stateful, Row/Column/Stack.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Điều hướng|||Chapter 4 — Navigation', description: 'Push/pop, truyền dữ liệu, named routes, tab.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quản lý trạng thái|||Chapter 5 — State', description: 'setState, Provider/ChangeNotifier, Bloc.', lessons: [c5, c5q] },
    { title: 'Chương 6 — API & lưu trữ|||Chapter 6 — API & storage', description: 'Gọi REST, JSON model, lưu cục bộ, backend.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Thiết bị & kiểm thử|||Chapter 7 — Device & testing', description: 'Camera/GPS/thông báo, quyền, unit/widget/integration test.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Build & phát hành|||Chapter 8 — Build & publish', description: 'Release build, hiệu năng, ký & lên store.', lessons: [c8, c8q] },
  ],
};
