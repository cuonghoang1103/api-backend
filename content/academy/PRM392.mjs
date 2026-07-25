/**
 * PRM392 — Mobile Programming (Kỳ 9). Native Android + Java (Android Studio).
 * Prereq PRO192. Android OS, UI/layouts, activities/lifecycle/intents, RecyclerView,
 * data storage (SharedPreferences/SQLite/Room/ContentProvider), Services/threads/Fragments,
 * networking (Retrofit/web services), architecture (MVC/MVP/MVVM) + team project.
 * CODE course → deep-link CodeLab java-core/sqlite/rest-apis; Exp Hub = Android Studio setup.
 * Grading: Practical 15% (>=4) + Progress Test 15% + Project 30% + Final 40% (>=4), avg>=5.
 * Chuẩn SWP391 gold: Mục 0 6 bài (intro+lz-map, thang điểm 4 phần, CLO, công cụ,
 * ngân hàng đề tài project 12 + rubric, anti-fail/high-mark) + chương bám 60 session
 * + chương ÔN THI (ngân hàng câu hỏi theo CLO + chiến lược thi) + chương NÂNG CAO ★.
 * Song ngữ EN/VN đối xứng (ml-en == ml-vi). shortDescription < 500.
 */
export default {
  semester: { code: 'FPTU_Hola9', name: 'Kỳ 9', ordinal: 11 },
  course: {
    academyType: 'FPT',
    courseCode: 'PRM392',
    title: 'Mobile Programming',
    slug: 'mobile-programming',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build real native Android apps in Java with Android Studio: UI & layouts, activities & lifecycle, RecyclerView, SQLite/Room storage, Retrofit networking, Services & threads, and MVVM architecture — capped by a team app project.|||Xây app Android native thật bằng Java với Android Studio: UI & layout, activity & vòng đời, RecyclerView, lưu trữ SQLite/Room, mạng Retrofit, Service & luồng, và kiến trúc MVVM — kết bằng một đồ án app theo nhóm.',
    description: 'PRM392 (Mobile Programming — Lập trình di động) dạy bạn xây ứng dụng Android NATIVE bằng Java trên Android Studio. Đây là môn CODE thực chiến, tiếp nối PRO192 (Java): bạn đi từ cấu trúc một app Android, dựng giao diện bằng XML layout (LinearLayout, ConstraintLayout) và xử lý sự kiện, hiểu Activity và vòng đời, điều hướng bằng Intent, hiển thị danh sách bằng RecyclerView, lưu dữ liệu (SharedPreferences, file, SQLite, Room, ContentProvider), chạy nền bằng Service và đa luồng (Executor), tách UI bằng Fragment, tích hợp Google Maps & vị trí, gọi API bằng Retrofit, lập trình socket & BroadcastReceiver, và cuối cùng tổ chức code theo kiến trúc MVC/MVP/MVVM. Đánh giá gồm Practical Exam 15% + 3 Progress Test 15% + Project nhóm 30% + Final 40%. Môn này ăn điểm bằng CODE CHẠY THẬT và một đồ án app hoàn chỉnh, nên phải gõ tay đều tay từ đầu kỳ.',
    whatYouLearn: 'Cấu trúc dự án Android & Gradle; dựng UI bằng XML (LinearLayout/ConstraintLayout), styles & themes, view binding; xử lý sự kiện trên View; Activity, vòng đời Activity và Intent (tường minh/ngầm) để liên kết màn hình; RecyclerView + Adapter + ViewHolder để hiển thị danh sách; menu, permission runtime, notification; lưu trữ dữ liệu SharedPreferences, internal/external storage, SQLite, Room ORM và ContentProvider; Service, đa luồng bằng Executor/ExecutorService, Fragment và giao tiếp Fragment↔Activity; Google Maps & định vị; web service với Retrofit + JSON, socket, BroadcastReceiver; và kiến trúc MVC/MVP/MVVM với ViewModel + LiveData. Kèm phần nâng cao ngoài giáo trình: Coroutine/Kotlin, Jetpack Compose, và checklist phát hành lên Google Play.',
    requirements: 'Tiên quyết PRO192 (Java OOP). Cần: laptop ≥ 16GB RAM, ≥ 25GB trống trước khi cài; Android Studio (bản mới nhất) + một virtual device (AVD) hoặc điện thoại Android thật để chạy thử. Cài đủ công cụ TRƯỚC buổi đầu (xem Exp Hub). Nên biết Java cơ bản (class, kế thừa, interface, collection) vững vì Android dùng Java xuyên suốt.',
    documentsNote: 'Tài liệu chính: Android Developer Fundamentals v2 — Concepts (google-developer-training.github.io) • Google Android developer reference (developer.android.com) • Android Studio Development Essentials — Java Edition (Neil Smyth). Công cụ cài đặt (Android Studio + AVD) → Exp Hub. Luyện code nền Java → Code Lab track java-core; luyện SQL/SQLite → track sqlite; luyện gọi API → track rest-apis. Đây là môn CODE — vừa học vừa gõ app thật.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học vận hành thế nào, thang điểm 4 phần, CLO, công cụ Android Studio, ngân hàng đề tài project và cách không trượt / ăn điểm cao.',
      lessons: [
        {
          title: '0.1 — What PRM392 is & the Android app map|||0.1 — PRM392 là gì & bản đồ app Android',
          slug: 'prm392-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Bức tranh toàn cảnh: môn code Android native bằng Java, đi từ màn hình đầu tiên tới một app nhiều màn có dữ liệu & mạng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>PRM392 — you build a real Android app, screen by screen</h2>
<p class="lead">PRM392 (Mobile Programming) is a <strong>hands-on coding course</strong>: you write native <strong>Android apps in Java</strong> using Android Studio. It builds directly on PRO192 (Java) — every Activity, Adapter and model is a Java class. By the end you ship a multi-screen app with a database and a network connection, defended as a team project.</p>
<p>Android is a <strong>component + lifecycle</strong> platform: the OS creates and destroys your screens, so you must cooperate with its rules instead of controlling a single &#96;main()&#96;. Learning that mental shift is the heart of the course.</p>

<h3>The whole course in one map</h3>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Android & Studio</div><div class="lz-nsub">OS · project structure · first app</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">UI & layouts</div><div class="lz-nsub">widgets · Constraint/Linear · events</div></div></div>
  <div class="lz-stage">App logic</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Activities, lifecycle, intents</div><div class="lz-nsub">screens · navigation · pass data</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Lists, media, permissions</div><div class="lz-nsub">RecyclerView · images · notifications</div></div></div>
  <div class="lz-stage">Data</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Data storage</div><div class="lz-nsub">Preferences · SQLite · Room · provider</div></div></div>
  <div class="lz-stage">Advanced components</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Services, threads, fragments</div><div class="lz-nsub">background · Executor · maps</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Networking</div><div class="lz-nsub">Retrofit · JSON · sockets · broadcast</div></div></div>
  <div class="lz-stage">Architecture</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">MVC / MVP / MVVM</div><div class="lz-nsub">ViewModel · LiveData · the project</div></div></div>
  <div class="lz-stage">Beyond the syllabus ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Kotlin · Jetpack Compose · Play release</div><div class="lz-nsub">where Android is heading</div></div></div>
</div>

<div class="callout ok"><strong>The one habit that decides this course:</strong> <em>run your app on every small change.</em> Android has many moving parts (manifest, resources, lifecycle) and a bug in any one crashes the app. Students who build in tiny, tested steps finish; students who write 200 lines then hit "run" spend the night reading stack traces.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Java now, Kotlin next.</b> This course teaches Android in Java (matching PRO192), but Google's official language for Android since 2019 is <em>Kotlin</em>. Everything you learn — lifecycle, RecyclerView, Room, Retrofit — maps 1:1 to Kotlin with shorter syntax. Learning the Android <em>concepts</em> in Java transfers directly. <em>We flag this so you know what to learn after PRM392.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>PRM392 — bạn xây một app Android thật, từng màn hình một</h2>
<p class="lead">PRM392 (Lập trình di động) là môn <strong>code thực chiến</strong>: bạn viết app <strong>Android native bằng Java</strong> trên Android Studio. Nó nối thẳng từ PRO192 (Java) — mỗi Activity, Adapter và model là một class Java. Cuối kỳ bạn ra một app nhiều màn có cơ sở dữ liệu và kết nối mạng, bảo vệ dưới dạng đồ án nhóm.</p>
<p>Android là nền tảng <strong>component + vòng đời</strong>: hệ điều hành tạo và huỷ màn hình của bạn, nên bạn phải HỢP TÁC với luật của nó thay vì kiểm soát một &#96;main()&#96; duy nhất. Học được cú chuyển tư duy đó là trái tim của môn học.</p>

<h3>Cả môn học trong một bản đồ</h3>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Android & Studio</div><div class="lz-nsub">HĐH · cấu trúc dự án · app đầu tiên</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">UI & layout</div><div class="lz-nsub">widget · Constraint/Linear · sự kiện</div></div></div>
  <div class="lz-stage">Logic app</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Activity, vòng đời, intent</div><div class="lz-nsub">màn hình · điều hướng · truyền dữ liệu</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Danh sách, media, permission</div><div class="lz-nsub">RecyclerView · ảnh · notification</div></div></div>
  <div class="lz-stage">Dữ liệu</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Lưu trữ dữ liệu</div><div class="lz-nsub">Preferences · SQLite · Room · provider</div></div></div>
  <div class="lz-stage">Component nâng cao</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Service, luồng, fragment</div><div class="lz-nsub">chạy nền · Executor · maps</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Mạng</div><div class="lz-nsub">Retrofit · JSON · socket · broadcast</div></div></div>
  <div class="lz-stage">Kiến trúc</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">MVC / MVP / MVVM</div><div class="lz-nsub">ViewModel · LiveData · đồ án</div></div></div>
  <div class="lz-stage">Ngoài giáo trình ★</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Kotlin · Jetpack Compose · phát hành Play</div><div class="lz-nsub">Android đang đi về đâu</div></div></div>
</div>

<div class="callout ok"><strong>Một thói quen quyết định môn này:</strong> <em>chạy app sau mỗi thay đổi nhỏ.</em> Android có nhiều bộ phận (manifest, resource, vòng đời) và một lỗi ở bất kỳ đâu làm crash app. Sinh viên xây từng bước nhỏ có kiểm thì về đích; sinh viên viết 200 dòng rồi mới bấm "run" thì thức đêm đọc stack trace.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Java bây giờ, Kotlin tiếp theo.</b> Môn này dạy Android bằng Java (khớp PRO192), nhưng ngôn ngữ chính thức của Google cho Android từ 2019 là <em>Kotlin</em>. Mọi thứ bạn học — vòng đời, RecyclerView, Room, Retrofit — ánh xạ 1:1 sang Kotlin với cú pháp ngắn hơn. Học <em>khái niệm</em> Android bằng Java chuyển thẳng được. <em>Chúng tôi nêu điều này để bạn biết học gì sau PRM392.</em></div>
</div>`,
        },
        {
          title: '0.2 — How you are graded: 4 components|||0.2 — Cách tính điểm: 4 thành phần',
          slug: 'prm392-thang-diem',
          type: 'article',
          description: 'Bảng thang điểm đầy đủ: Practical 15% + Progress Test 15% + Project 30% + Final 40%, cùng cổng điểm & công thức pass.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The grade breakdown — where every point comes from</h2>
<p class="lead">PRM392 mixes continuous coding work with a final exam. Two components have a hard <strong>≥ 4 gate</strong>: if you score below 4 on the Practical Exam or the Final Exam, you fail regardless of your average.</p>
<table>
<thead><tr><th>Component</th><th>Weight</th><th>Gate</th><th>Form</th></tr></thead>
<tbody>
<tr><td>Practical Exam (on-going)</td><td><strong>15%</strong></td><td>≥ 4</td><td>Code an app feature live, 90'</td></tr>
<tr><td>Progress Test ×3</td><td><strong>15%</strong></td><td>—</td><td>Short quizzes, 25' each</td></tr>
<tr><td>Project (team)</td><td><strong>30%</strong></td><td>—</td><td>A full app + presentation</td></tr>
<tr><td>Final Exam</td><td><strong>40%</strong></td><td>≥ 4</td><td>60', theory + code reading</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Scale</span><span class="v">10</span></div>
<div class="kv"><span class="k">Pass average</span><span class="v">≥ 5.0</span></div>
<div class="kv"><span class="k">Practical gate</span><span class="v">≥ 4.0</span></div>
<div class="kv"><span class="k">Final gate</span><span class="v">≥ 4.0</span></div>
<div class="kv"><span class="k">Attendance</span><span class="v">≥ 80% to sit the final</span></div>
</div>
<div class="formula"><span class="lbl">PASS</span> avg = 0.15·PE + 0.15·PT + 0.30·Project + 0.40·Final ≥ 5 &nbsp;AND&nbsp; PE ≥ 4 &nbsp;AND&nbsp; Final ≥ 4</div>
<div class="out"><strong>Worked example:</strong> PE = 6, PT = 7, Project = 8, Final = 3.5.
avg = 0.15·6 + 0.15·7 + 0.30·8 + 0.40·3.5 = 0.9 + 1.05 + 2.4 + 1.4 = 5.75.
Average ≥ 5 ✓ but Final = 3.5 < 4 → <strong>FAIL</strong> on the gate. The 40% final can sink you even with strong coursework.</div>
<div class="callout warn"><strong>The Project (30%) + Final (40%) = 70%.</strong> The Practical Exam (15%) is easy points if you code weekly; the Project rewards a working app; but the Final (40%, gated) decides the course. Don't treat theory as optional — the final reads code and asks about lifecycle/components.</div>
<div class="pitfall"><strong>The Practical Exam is timed and live.</strong> You get 90' to code a feature (e.g. a RecyclerView bound to SQLite). Students who only ever copied tutorials freeze here. Practise building small features <em>from a blank Activity, without notes</em>, before the PE.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Grade the project like a demo, not a report.</b> The 30% project is scored on a working app + presentation. A clean 4-screen app that actually runs (list → detail → add → sync) beats an ambitious 10-screen app that crashes on the demo. Scope small, make it <em>run</em>, rehearse the demo. <em>Scoping discipline is not in the syllabus but wins project marks.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cấu trúc điểm — mỗi điểm đến từ đâu</h2>
<p class="lead">PRM392 trộn công việc code liên tục với một bài thi cuối. Hai thành phần có <strong>cổng ≥ 4</strong> cứng: nếu Practical Exam hoặc Final Exam dưới 4, bạn trượt bất kể điểm trung bình.</p>
<table>
<thead><tr><th>Thành phần</th><th>Trọng số</th><th>Cổng</th><th>Hình thức</th></tr></thead>
<tbody>
<tr><td>Practical Exam (liên tục)</td><td><strong>15%</strong></td><td>≥ 4</td><td>Code một tính năng app tại chỗ, 90'</td></tr>
<tr><td>Progress Test ×3</td><td><strong>15%</strong></td><td>—</td><td>Quiz ngắn, 25'/lần</td></tr>
<tr><td>Project (nhóm)</td><td><strong>30%</strong></td><td>—</td><td>Một app hoàn chỉnh + thuyết trình</td></tr>
<tr><td>Final Exam</td><td><strong>40%</strong></td><td>≥ 4</td><td>60', lý thuyết + đọc code</td></tr>
</tbody>
</table>
<div class="kv-grid">
<div class="kv"><span class="k">Thang</span><span class="v">10</span></div>
<div class="kv"><span class="k">Trung bình qua</span><span class="v">≥ 5.0</span></div>
<div class="kv"><span class="k">Cổng Practical</span><span class="v">≥ 4.0</span></div>
<div class="kv"><span class="k">Cổng Final</span><span class="v">≥ 4.0</span></div>
<div class="kv"><span class="k">Điểm danh</span><span class="v">≥ 80% mới được thi cuối</span></div>
</div>
<div class="formula"><span class="lbl">QUA MÔN</span> tb = 0.15·PE + 0.15·PT + 0.30·Project + 0.40·Final ≥ 5 &nbsp;VÀ&nbsp; PE ≥ 4 &nbsp;VÀ&nbsp; Final ≥ 4</div>
<div class="out"><strong>Ví dụ có lời giải:</strong> PE = 6, PT = 7, Project = 8, Final = 3.5.
tb = 0.15·6 + 0.15·7 + 0.30·8 + 0.40·3.5 = 0.9 + 1.05 + 2.4 + 1.4 = 5.75.
Trung bình ≥ 5 ✓ nhưng Final = 3.5 < 4 → <strong>TRƯỢT</strong> ở cổng. Final 40% có thể nhấn chìm bạn dù bài trên lớp tốt.</div>
<div class="callout warn"><strong>Project (30%) + Final (40%) = 70%.</strong> Practical Exam (15%) là điểm dễ nếu bạn code hàng tuần; Project thưởng một app chạy được; nhưng Final (40%, có cổng) quyết định môn học. Đừng coi lý thuyết là tuỳ chọn — bài final đọc code và hỏi về vòng đời/component.</div>
<div class="pitfall"><strong>Practical Exam có tính giờ và làm tại chỗ.</strong> Bạn có 90' để code một tính năng (vd RecyclerView gắn với SQLite). Sinh viên chỉ từng chép tutorial sẽ đơ ở đây. Luyện xây các tính năng nhỏ <em>từ một Activity trống, không nhìn ghi chú</em>, trước kỳ PE.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chấm project như một buổi demo, không phải báo cáo.</b> Project 30% chấm theo app chạy được + thuyết trình. Một app 4 màn gọn thực sự chạy (danh sách → chi tiết → thêm → đồng bộ) thắng một app 10 màn tham vọng nhưng crash lúc demo. Giới hạn nhỏ, làm cho nó <em>CHẠY</em>, tập demo. <em>Kỷ luật giới hạn phạm vi không có trong syllabus nhưng thắng điểm project.</em></div>
</div>`,
        },
        {
          title: '0.3 — Course learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra môn học (CLO)',
          slug: 'prm392-clo',
          type: 'article',
          description: '5 CLO của môn và bản đồ CLO → chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>What you must be able to do by the end</h2>
<p class="lead">FPT defines five CLOs. Use this as a checklist — the Final Exam and Practical Exam draw from all of them.</p>
<table>
<thead><tr><th>CLO</th><th>You can…</th><th>Covered in</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Describe the Android OS and Android programming model</td><td>Ch 1</td></tr>
<tr><td>CLO2</td><td>Build an Android GUI and handle events on it</td><td>Ch 2</td></tr>
<tr><td>CLO3</td><td>Explain and use the necessary Android components</td><td>Ch 3, 4, 6, 7</td></tr>
<tr><td>CLO4</td><td>Save data to the device and access a database / API</td><td>Ch 5, 7</td></tr>
<tr><td>CLO5</td><td>Demonstrate Android architecture (MVC/MVP/MVVM)</td><td>Ch 8</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Three pillars.</b> The CLOs collapse into three pillars: <em>UI</em> (CLO2), <em>components & data</em> (CLO3, CLO4), and <em>architecture</em> (CLO5), all resting on <em>the platform model</em> (CLO1). If you can build a screen, wire it to data, and organize the code cleanly, you have the whole course. <em>This grouping is our study aid.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Kết thúc môn bạn phải LÀM được gì</h2>
<p class="lead">FPT định nghĩa năm CLO. Dùng đây làm checklist — Final Exam và Practical Exam rút từ tất cả.</p>
<table>
<thead><tr><th>CLO</th><th>Bạn có thể…</th><th>Học ở</th></tr></thead>
<tbody>
<tr><td>CLO1</td><td>Mô tả HĐH Android và mô hình lập trình Android</td><td>Ch 1</td></tr>
<tr><td>CLO2</td><td>Dựng GUI Android và xử lý sự kiện trên nó</td><td>Ch 2</td></tr>
<tr><td>CLO3</td><td>Giải thích và dùng các component Android cần thiết</td><td>Ch 3, 4, 6, 7</td></tr>
<tr><td>CLO4</td><td>Lưu dữ liệu vào thiết bị và truy cập cơ sở dữ liệu / API</td><td>Ch 5, 7</td></tr>
<tr><td>CLO5</td><td>Trình bày kiến trúc Android (MVC/MVP/MVVM)</td><td>Ch 8</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ba trụ cột.</b> Các CLO thu về ba trụ: <em>UI</em> (CLO2), <em>component & dữ liệu</em> (CLO3, CLO4), và <em>kiến trúc</em> (CLO5), tất cả tựa trên <em>mô hình nền tảng</em> (CLO1). Nếu bạn dựng được một màn hình, nối nó với dữ liệu, và tổ chức code gọn gàng, bạn nắm cả môn. <em>Cách gom này là công cụ học của chúng tôi.</em></div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup (Exp Hub)|||0.4 — Công cụ & cài đặt (Exp Hub)',
          slug: 'prm392-cong-cu',
          type: 'article',
          description: 'Android Studio + AVD (virtual device) + JDK; luyện nền Java/SQLite/API trên Code Lab. Hướng dẫn cài đặt ở Exp Hub.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Install everything before day one</h2>
<p class="lead">The syllabus is explicit: install all tools <em>before the first session</em>. Android Studio is a large download and the first SDK/emulator setup takes time — don't do it in class.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">IDE</div><div class="lz-t">Android Studio</div><div class="lz-d">SDK + emulator bundled</div></div>
  <div class="lz-step"><div class="lz-k">Run</div><div class="lz-t">AVD / phone</div><div class="lz-d">virtual device or real device</div></div>
  <div class="lz-step"><div class="lz-k">Practise Java</div><div class="lz-t">Code Lab</div><div class="lz-d">java-core track</div></div>
  <div class="lz-step"><div class="lz-k">Practise data/API</div><div class="lz-t">Code Lab</div><div class="lz-d">sqlite · rest-apis</div></div>
</div>
<a class="link-card exphub" href="/exp-hub/prm392-cai-dat-android-studio?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%20Cài%20đặt" >
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — Android Studio + AVD setup</span><span class="lc-sub">JDK · SDK · emulator · first run · common install errors</span></span>
  <span class="lc-cta">Open →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%20Java#module-246" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java core (foundation for Android)</span><span class="lc-sub">java-core · classes, collections, threads used all over Android</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout ok"><strong>Minimum machine:</strong> 16GB RAM and 25GB free space <em>before</em> installing (the SDK + one emulator system image eats most of it). On a weaker laptop, run on a real Android phone over USB instead of the emulator — it's faster.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đủ mọi thứ trước buổi đầu</h2>
<p class="lead">Syllabus nói rõ: cài tất cả công cụ <em>trước buổi học đầu tiên</em>. Android Studio là bản tải lớn và lần đầu cấu hình SDK/emulator tốn thời gian — đừng làm trong lớp.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">IDE</div><div class="lz-t">Android Studio</div><div class="lz-d">kèm SDK + emulator</div></div>
  <div class="lz-step"><div class="lz-k">Chạy</div><div class="lz-t">AVD / điện thoại</div><div class="lz-d">máy ảo hoặc máy thật</div></div>
  <div class="lz-step"><div class="lz-k">Luyện Java</div><div class="lz-t">Code Lab</div><div class="lz-d">track java-core</div></div>
  <div class="lz-step"><div class="lz-k">Luyện data/API</div><div class="lz-t">Code Lab</div><div class="lz-d">sqlite · rest-apis</div></div>
</div>
<a class="link-card exphub" href="/exp-hub/prm392-cai-dat-android-studio?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%20Cài%20đặt" >
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Exp Hub — Cài Android Studio + AVD</span><span class="lc-sub">JDK · SDK · emulator · chạy lần đầu · lỗi cài hay gặp</span></span>
  <span class="lc-cta">Mở →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%20Java#module-246" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java core (nền cho Android)</span><span class="lc-sub">java-core · class, collection, thread dùng khắp Android</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout ok"><strong>Máy tối thiểu:</strong> 16GB RAM và 25GB trống <em>trước khi</em> cài (SDK + một system image emulator ăn phần lớn). Trên laptop yếu, chạy trên điện thoại Android thật qua USB thay vì emulator — nhanh hơn.</div>
</div>`,
        },
        {
          title: '0.5 — Project topic bank (12 apps) + how to pick|||0.5 — Ngân hàng đề tài project (12 app) + cách chọn',
          slug: 'prm392-ngan-hang-de-tai',
          type: 'article',
          description: 'Ngân hàng 12 đề tài app đã kiểm scope + rubric 6 phép thử chọn đề vừa sức một đội trong một kỳ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Pick an app your team can actually finish and demo</h2>
<p class="lead">The 30% project wants a <em>working</em> app, not an ambitious broken one. The best PRM392 projects share a shape: a list of things, a detail screen, add/edit, local storage, and one network call. Below are 12 pre-scoped ideas that all fit that shape and show every CLO.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Productivity</span> 1) To-do / task manager · 2) Note app with categories · 3) Expense tracker · 4) Habit tracker</div>
  <div class="lz-layer"><span class="lz-lk">Campus</span> 5) Class schedule + reminders · 6) Flashcard study app · 7) Canteen menu & order</div>
  <div class="lz-layer"><span class="lz-lk">Lifestyle</span> 8) Recipe book (with photos) · 9) Movie/book catalog from a public API · 10) Weather app (API + location)</div>
  <div class="lz-layer"><span class="lz-lk">Utility</span> 11) News reader (Retrofit + RecyclerView) · 12) Simple chat (socket) — advanced</div>
</div>
<h3>The 6-test rubric — score a topic before you commit</h3>
<table>
<thead><tr><th>Test</th><th>Ask</th><th>Red flag</th></tr></thead>
<tbody>
<tr><td>Core CRUD</td><td>Does it have list + add + edit + delete?</td><td>No obvious data to manage</td></tr>
<tr><td>Local storage</td><td>Can I use SQLite/Room to persist it?</td><td>Nothing worth saving</td></tr>
<tr><td>One network call</td><td>Is there a free public API or a small backend?</td><td>Needs a complex paid API</td></tr>
<tr><td>Small screen count</td><td>4-6 screens, not 20?</td><td>A whole super-app</td></tr>
<tr><td>Team-splittable</td><td>Can 3-4 people work in parallel?</td><td>One giant tangled screen</td></tr>
<tr><td>Demoable in 8'</td><td>Can we show the full flow live?</td><td>Needs 15 min just to set up</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Green light:</strong> passes 5-6 tests. A "Note app with categories + cloud sync" passes all six; "a full social network" fails small-screen-count and demoable. Start green, then add stretch features only if the core runs.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Build a vertical slice first.</b> Instead of building all screens half-way, build ONE feature fully end-to-end (list → Room → detail → edit → save) in week 1 of the project. It proves your architecture works and gives you a demoable core immediately; the rest is repetition. <em>Vertical-slice delivery is how pros de-risk a project — not in the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn app mà đội bạn thực sự làm xong và demo được</h2>
<p class="lead">Project 30% muốn một app <em>chạy được</em>, không phải một app tham vọng mà hỏng. Project PRM392 tốt nhất có chung một dáng: một danh sách các thứ, một màn chi tiết, thêm/sửa, lưu trữ cục bộ, và một lời gọi mạng. Dưới đây là 12 ý tưởng đã kiểm scope đều vừa dáng đó và thể hiện mọi CLO.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">Năng suất</span> 1) To-do / quản lý việc · 2) App ghi chú có danh mục · 3) Quản lý chi tiêu · 4) Theo dõi thói quen</div>
  <div class="lz-layer"><span class="lz-lk">Trường học</span> 5) Lịch học + nhắc · 6) App flashcard học từ · 7) Thực đơn & đặt căng-tin</div>
  <div class="lz-layer"><span class="lz-lk">Đời sống</span> 8) Sổ công thức nấu ăn (có ảnh) · 9) Danh mục phim/sách từ API công khai · 10) App thời tiết (API + vị trí)</div>
  <div class="lz-layer"><span class="lz-lk">Tiện ích</span> 11) Đọc báo (Retrofit + RecyclerView) · 12) Chat đơn giản (socket) — nâng cao</div>
</div>
<h3>Rubric 6 phép thử — chấm đề trước khi cam kết</h3>
<table>
<thead><tr><th>Phép thử</th><th>Hỏi</th><th>Cờ đỏ</th></tr></thead>
<tbody>
<tr><td>CRUD cốt lõi</td><td>Có danh sách + thêm + sửa + xoá không?</td><td>Không có dữ liệu rõ để quản lý</td></tr>
<tr><td>Lưu trữ cục bộ</td><td>Dùng SQLite/Room lưu lại được không?</td><td>Không có gì đáng lưu</td></tr>
<tr><td>Một lời gọi mạng</td><td>Có API công khai miễn phí hoặc backend nhỏ?</td><td>Cần API phức tạp có phí</td></tr>
<tr><td>Số màn ít</td><td>4-6 màn, không phải 20?</td><td>Cả một siêu ứng dụng</td></tr>
<tr><td>Chia được cho đội</td><td>3-4 người làm song song được không?</td><td>Một màn khổng lồ rối bù</td></tr>
<tr><td>Demo được trong 8'</td><td>Trình diễn trọn luồng trực tiếp được không?</td><td>Mất 15 phút chỉ để cài đặt</td></tr>
</tbody>
</table>
<div class="callout ok"><strong>Đèn xanh:</strong> qua 5-6 phép thử. "App ghi chú có danh mục + đồng bộ đám mây" qua cả sáu; "một mạng xã hội đầy đủ" trượt số-màn-ít và demo-được. Bắt đầu xanh, rồi thêm tính năng mở rộng chỉ khi lõi đã chạy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dựng một lát cắt dọc trước.</b> Thay vì dựng mọi màn nửa vời, dựng MỘT tính năng trọn đầu-cuối (danh sách → Room → chi tiết → sửa → lưu) ngay tuần 1 của project. Nó chứng minh kiến trúc chạy được và cho bạn một lõi demo được ngay; phần còn lại là lặp lại. <em>Giao theo lát cắt dọc là cách dân chuyên giảm rủi ro dự án — không có trong syllabus.</em></div>
</div>`,
        },
        {
          title: '0.6 — How not to fail & how to score high|||0.6 — Cách không trượt & cách ăn điểm cao',
          slug: 'prm392-chong-truot-diem-cao',
          type: 'article',
          description: '7 kiểu mất điểm phổ biến của môn Android + cờ xanh/đỏ theo tuần + công thức điểm cao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Anti-fail & high-mark guide</h2>
<p class="lead">PRM392 fails students in two ways: the gated Final (theory + code reading), and a Practical Exam / project they can't build without notes. Both are beaten by coding weekly, not cramming.</p>
<h3>7 ways students lose points</h3>
<table>
<thead><tr><th>#</th><th>How you lose</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>1</td><td>Only copied tutorials → froze in the 90' Practical Exam</td><td>Rebuild features from a blank Activity, no notes</td></tr>
<tr><td>2</td><td>Ignored theory → failed the gated 40% Final</td><td>Learn lifecycle & components, not just how to click</td></tr>
<tr><td>3</td><td>Ambitious project that crashed on demo</td><td>Vertical slice first; scope to 4-6 screens</td></tr>
<tr><td>4</td><td>Did network / DB work on the UI thread → app froze (ANR)</td><td>Always background threads / Executor for I/O</td></tr>
<tr><td>5</td><td>Lost state on rotation → data disappeared</td><td>Understand the lifecycle & ViewModel</td></tr>
<tr><td>6</td><td>Below 80% attendance → barred from the final</td><td>Track attendance from week 1</td></tr>
<tr><td>7</td><td>All code by one teammate → others couldn't defend it</td><td>Everyone codes a slice; everyone can explain</td></tr>
</tbody>
</table>
<h3>Weekly green / red flags</h3>
<div class="kv-grid">
<div class="kv"><span class="k">🟢 Green</span><span class="v">Your app runs after each lab; you can rebuild it blind</span></div>
<div class="kv"><span class="k">🟢 Green</span><span class="v">You can explain the Activity lifecycle out loud</span></div>
<div class="kv"><span class="k">🔴 Red</span><span class="v">You only ever paste code you don't understand</span></div>
<div class="kv"><span class="k">🔴 Red</span><span class="v">One person owns the whole project repo</span></div>
</div>
<h3>The high-mark formula</h3>
<div class="formula"><span class="lbl">SCORE HIGH</span> code every lab from scratch &nbsp;+&nbsp; understand lifecycle/components for the final &nbsp;+&nbsp; a small app that <em>runs</em> &nbsp;+&nbsp; everyone can defend their slice</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Read the Logcat, don't fear it.</b> Most Android failures print a clear cause in Logcat (e.g. NullPointerException at a line, or NetworkOnMainThreadException). Students who learn to read the stack trace fix bugs in minutes; students who guess spend hours. Filter Logcat by your package and read the <em>first</em> "Caused by" line. <em>Debugging fluency is the single biggest speed multiplier and it isn't formally taught.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Cẩm nang chống trượt & ăn điểm cao</h2>
<p class="lead">PRM392 làm trượt sinh viên theo hai cách: bài Final có cổng (lý thuyết + đọc code), và một Practical Exam / project mà họ không dựng nổi nếu không nhìn ghi chú. Cả hai bị đánh bại bằng code hàng tuần, không nhồi phút chót.</p>
<h3>7 cách mất điểm</h3>
<table>
<thead><tr><th>#</th><th>Cách bạn mất</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>1</td><td>Chỉ chép tutorial → đơ trong Practical Exam 90'</td><td>Dựng lại tính năng từ Activity trống, không ghi chú</td></tr>
<tr><td>2</td><td>Bỏ qua lý thuyết → trượt Final 40% có cổng</td><td>Học vòng đời & component, không chỉ cách bấm</td></tr>
<tr><td>3</td><td>Project tham vọng crash lúc demo</td><td>Lát cắt dọc trước; giới hạn 4-6 màn</td></tr>
<tr><td>4</td><td>Làm mạng / DB trên UI thread → app đơ (ANR)</td><td>Luôn dùng thread nền / Executor cho I/O</td></tr>
<tr><td>5</td><td>Mất state khi xoay màn → dữ liệu biến mất</td><td>Hiểu vòng đời & ViewModel</td></tr>
<tr><td>6</td><td>Điểm danh dưới 80% → bị cấm thi cuối</td><td>Theo dõi điểm danh từ tuần 1</td></tr>
<tr><td>7</td><td>Một người code hết → người khác không bảo vệ được</td><td>Mỗi người code một lát; ai cũng giải thích được</td></tr>
</tbody>
</table>
<h3>Cờ xanh / đỏ theo tuần</h3>
<div class="kv-grid">
<div class="kv"><span class="k">🟢 Xanh</span><span class="v">App chạy sau mỗi lab; bạn dựng lại được không nhìn</span></div>
<div class="kv"><span class="k">🟢 Xanh</span><span class="v">Bạn nói miệng được vòng đời Activity</span></div>
<div class="kv"><span class="k">🔴 Đỏ</span><span class="v">Bạn chỉ dán code không hiểu</span></div>
<div class="kv"><span class="k">🔴 Đỏ</span><span class="v">Một người ôm cả repo project</span></div>
</div>
<h3>Công thức điểm cao</h3>
<div class="formula"><span class="lbl">ĐIỂM CAO</span> code mỗi lab từ đầu &nbsp;+&nbsp; hiểu vòng đời/component cho final &nbsp;+&nbsp; một app nhỏ <em>chạy được</em> &nbsp;+&nbsp; ai cũng bảo vệ được lát của mình</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc Logcat, đừng sợ nó.</b> Đa số lỗi Android in ra nguyên nhân rõ trong Logcat (vd NullPointerException tại một dòng, hoặc NetworkOnMainThreadException). Sinh viên biết đọc stack trace sửa lỗi trong vài phút; sinh viên đoán mò tốn hàng giờ. Lọc Logcat theo package của bạn và đọc dòng "Caused by" <em>đầu tiên</em>. <em>Thành thạo gỡ lỗi là bội số tốc độ lớn nhất và nó không được dạy chính thức.</em></div>
</div>`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — ANDROID FOUNDATIONS ══════════════════ */
    {
      title: 'Chapter 1 — Android foundations|||Chương 1 — Nền tảng Android',
      description: 'Session 1-4: HĐH Android, Android Studio, cấu trúc dự án, và xây app đầu tiên.',
      lessons: [
        {
          title: '1.1 — The Android platform & project structure|||1.1 — Nền tảng Android & cấu trúc dự án',
          slug: 'prm392-1-1-platform',
          type: 'VIDEO',
          description: 'HĐH Android là gì, các thành phần một app, và ý nghĩa từng thư mục/tệp trong dự án Android Studio.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Android is a stack of layers and four kinds of component</h2>
<p class="lead">Android is a Linux-based OS. Your Java app runs on top of the Android framework (managed by the ART runtime), not directly on hardware. You never write a &#96;main()&#96; — instead the system starts your <strong>components</strong> when needed.</p>
<h3>The four app components (CLO1)</h3>
<table>
<thead><tr><th>Component</th><th>Role</th></tr></thead>
<tbody>
<tr><td>Activity</td><td>One screen the user interacts with</td></tr>
<tr><td>Service</td><td>Background work with no UI (e.g. play music)</td></tr>
<tr><td>BroadcastReceiver</td><td>Reacts to system/app events (e.g. battery low)</td></tr>
<tr><td>ContentProvider</td><td>Shares data between apps (e.g. contacts)</td></tr>
</tbody>
</table>
<h3>What's in an Android Studio project</h3>
<div class="diagram">app/
 ├─ manifests/AndroidManifest.xml   → declares components, permissions
 ├─ java/com.example.app/           → your Java code (Activities, models)
 │    └─ MainActivity.java
 ├─ res/                            → resources (never hard-code these)
 │    ├─ layout/activity_main.xml   → screen layouts (XML)
 │    ├─ values/strings.xml         → text (for i18n)
 │    ├─ drawable/                  → images, shapes
 │    └─ mipmap/                    → app icons
 └─ build.gradle (Module: app)      → dependencies, SDK versions</div>
<div class="callout ok"><strong>The manifest is the app's table of contents.</strong> Every Activity, Service and permission must be declared in &#96;AndroidManifest.xml&#96;. A very common beginner bug — "ActivityNotFoundException" — is simply forgetting to register a new Activity there.</div>
<div class="pitfall"><strong>Never hard-code strings, sizes or colors in code or layout.</strong> Put text in &#96;res/values/strings.xml&#96;, dimensions in &#96;dimens.xml&#96;. It's required for translation and for the exam's "good practice" questions — and it keeps one change from touching twenty files.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Gradle & the two build.gradle files.</b> Android builds with Gradle. There are two &#96;build.gradle&#96; files — project-level (repositories, plugin versions) and module-level (your dependencies, &#96;minSdk&#96;/&#96;targetSdk&#96;). Knowing which is which saves hours of "why won't my library resolve" — the syllabus assumes it but never explains it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Android là một chồng lớp và bốn loại component</h2>
<p class="lead">Android là HĐH nền Linux. App Java của bạn chạy trên khung Android (do runtime ART quản lý), không chạy thẳng trên phần cứng. Bạn không bao giờ viết &#96;main()&#96; — thay vào đó hệ thống khởi động các <strong>component</strong> của bạn khi cần.</p>
<h3>Bốn component của app (CLO1)</h3>
<table>
<thead><tr><th>Component</th><th>Vai trò</th></tr></thead>
<tbody>
<tr><td>Activity</td><td>Một màn hình người dùng tương tác</td></tr>
<tr><td>Service</td><td>Việc chạy nền không có UI (vd phát nhạc)</td></tr>
<tr><td>BroadcastReceiver</td><td>Phản ứng sự kiện hệ thống/app (vd pin yếu)</td></tr>
<tr><td>ContentProvider</td><td>Chia sẻ dữ liệu giữa các app (vd danh bạ)</td></tr>
</tbody>
</table>
<h3>Trong một dự án Android Studio có gì</h3>
<div class="diagram">app/
 ├─ manifests/AndroidManifest.xml   → khai báo component, permission
 ├─ java/com.example.app/           → code Java của bạn (Activity, model)
 │    └─ MainActivity.java
 ├─ res/                            → tài nguyên (đừng hard-code)
 │    ├─ layout/activity_main.xml   → layout màn hình (XML)
 │    ├─ values/strings.xml         → chữ (cho đa ngôn ngữ)
 │    ├─ drawable/                  → ảnh, hình
 │    └─ mipmap/                    → icon app
 └─ build.gradle (Module: app)      → thư viện, phiên bản SDK</div>
<div class="callout ok"><strong>Manifest là mục lục của app.</strong> Mọi Activity, Service và permission phải được khai báo trong &#96;AndroidManifest.xml&#96;. Một lỗi người mới rất hay gặp — "ActivityNotFoundException" — đơn giản là quên đăng ký Activity mới ở đó.</div>
<div class="pitfall"><strong>Đừng bao giờ hard-code chữ, kích thước hay màu trong code hoặc layout.</strong> Đặt chữ vào &#96;res/values/strings.xml&#96;, kích thước vào &#96;dimens.xml&#96;. Nó bắt buộc để dịch và cho các câu hỏi "thực hành tốt" của bài thi — và giữ một thay đổi khỏi đụng hai mươi tệp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Gradle & hai tệp build.gradle.</b> Android build bằng Gradle. Có hai tệp &#96;build.gradle&#96; — cấp dự án (repository, phiên bản plugin) và cấp module (thư viện của bạn, &#96;minSdk&#96;/&#96;targetSdk&#96;). Biết cái nào là cái nào tiết kiệm hàng giờ "sao thư viện không resolve" — syllabus giả định nhưng không giải thích.</div>
</div>`,
        },
        {
          title: '1.2 — Build your first app: Activity + layout + R|||1.2 — Xây app đầu tiên: Activity + layout + R',
          slug: 'prm392-1-2-first-app',
          type: 'VIDEO',
          description: 'Ghép một Activity Java với một layout XML qua setContentView và lớp R sinh tự động — vòng lặp cơ bản của mọi màn hình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Every screen = a Java Activity + an XML layout, joined by R</h2>
<p class="lead">The core pattern you'll repeat all course: define the look in an XML layout, define the behavior in a Java Activity, and connect them with &#96;setContentView&#96; and the auto-generated &#96;R&#96; class (which gives every resource a unique int id).</p>
<div class="out"><strong>res/layout/activity_main.xml</strong>
&lt;LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"&gt;

    &lt;TextView
        android:id="@+id/tvHello"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/hello" /&gt;

    &lt;Button
        android:id="@+id/btnGo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Tap me" /&gt;
&lt;/LinearLayout&gt;</div>
<div class="out"><strong>MainActivity.java</strong>
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);      // inflate the XML

        TextView tv = findViewById(R.id.tvHello);      // R.id.* from the layout
        Button btn = findViewById(R.id.btnGo);
        btn.setOnClickListener(v -&gt; tv.setText("You tapped!"));
    }
}</div>
<p><strong>What happens:</strong> the system calls &#96;onCreate&#96; when the screen is created; &#96;setContentView&#96; turns the XML into real View objects (inflation); &#96;findViewById&#96; looks up a widget by its &#96;R.id&#96;; and the click listener runs your code when tapped.</p>
<div class="pitfall"><strong>&#96;findViewById&#96; before &#96;setContentView&#96; = NullPointerException.</strong> The views don't exist until the layout is inflated. Always call &#96;setContentView&#96; first, then look up views. This is the #1 first-week crash.</div>
<div class="callout ok"><strong>Practise the Java behind Android.</strong> Activities, listeners and adapters are ordinary Java classes and anonymous/lambda callbacks. Solid Java makes Android easy.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%201.2#module-248" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java control flow & methods</span><span class="lc-sub">java-core · module 248 · the Java under every Activity</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>View Binding replaces findViewById.</b> Modern Android generates a binding class so you write &#96;binding.tvHello&#96; instead of &#96;findViewById(R.id.tvHello)&#96; — type-safe, null-safe, no casting. Enable it with &#96;viewBinding true&#96; in build.gradle. It's the current best practice the reference materials now recommend. <em>Beyond the syllabus but worth adopting for the project.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Mỗi màn hình = một Activity Java + một layout XML, nối bằng R</h2>
<p class="lead">Mẫu cốt lõi bạn lặp lại suốt môn: định nghĩa giao diện trong layout XML, định nghĩa hành vi trong Activity Java, và nối chúng bằng &#96;setContentView&#96; và lớp &#96;R&#96; sinh tự động (cho mỗi tài nguyên một id int duy nhất).</p>
<div class="out"><strong>res/layout/activity_main.xml</strong>
&lt;LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"&gt;

    &lt;TextView
        android:id="@+id/tvHello"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/hello" /&gt;

    &lt;Button
        android:id="@+id/btnGo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Tap me" /&gt;
&lt;/LinearLayout&gt;</div>
<div class="out"><strong>MainActivity.java</strong>
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);      // dựng XML thành View

        TextView tv = findViewById(R.id.tvHello);      // R.id.* từ layout
        Button btn = findViewById(R.id.btnGo);
        btn.setOnClickListener(v -&gt; tv.setText("Bạn vừa chạm!"));
    }
}</div>
<p><strong>Điều xảy ra:</strong> hệ thống gọi &#96;onCreate&#96; khi màn hình được tạo; &#96;setContentView&#96; biến XML thành các đối tượng View thật (inflation); &#96;findViewById&#96; tra một widget theo &#96;R.id&#96; của nó; và listener sự kiện chạy code của bạn khi chạm.</p>
<div class="pitfall"><strong>&#96;findViewById&#96; trước &#96;setContentView&#96; = NullPointerException.</strong> Các view chưa tồn tại cho tới khi layout được inflate. Luôn gọi &#96;setContentView&#96; trước, rồi mới tra view. Đây là lỗi crash số 1 tuần đầu.</div>
<div class="callout ok"><strong>Luyện phần Java đằng sau Android.</strong> Activity, listener và adapter là các class Java bình thường và callback ẩn danh/lambda. Java vững làm Android dễ.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%201.2#module-248" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java control flow & methods</span><span class="lc-sub">java-core · module 248 · Java dưới mỗi Activity</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>View Binding thay findViewById.</b> Android hiện đại sinh một lớp binding để bạn viết &#96;binding.tvHello&#96; thay vì &#96;findViewById(R.id.tvHello)&#96; — an toàn kiểu, an toàn null, không ép kiểu. Bật bằng &#96;viewBinding true&#96; trong build.gradle. Đây là thực hành tốt hiện hành mà tài liệu tham khảo nay khuyến nghị. <em>Ngoài syllabus nhưng đáng dùng cho project.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Which Android component represents a single screen the user interacts with?|||Component Android nào đại diện một màn hình duy nhất người dùng tương tác?',
                options: ['Service', 'Activity', 'BroadcastReceiver', 'ContentProvider'],
                correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Where must every Activity and permission be declared?|||Mọi Activity và permission phải được khai báo ở đâu?',
                options: [
                  'In strings.xml|||Trong strings.xml',
                  'In AndroidManifest.xml|||Trong AndroidManifest.xml',
                  'In build.gradle only|||Chỉ trong build.gradle',
                  'Nowhere, they are automatic|||Không đâu cả, tự động',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'In onCreate, setContentView(R.layout.activity_main) does what?|||Trong onCreate, setContentView(R.layout.activity_main) làm gì?',
                options: [
                  'Deletes the layout|||Xoá layout',
                  'Inflates the XML layout into View objects for the screen|||Dựng layout XML thành các đối tượng View cho màn hình',
                  'Starts a new app|||Khởi động app mới',
                  'Connects to the internet|||Kết nối internet',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Calling findViewById before setContentView typically causes:|||Gọi findViewById trước setContentView thường gây:',
                options: [
                  'A faster app|||App nhanh hơn',
                  'A NullPointerException (views not inflated yet)|||NullPointerException (view chưa được inflate)',
                  'A compile error only|||Chỉ lỗi biên dịch',
                  'Nothing|||Không gì cả',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) Why put text in res/values/strings.xml instead of hard-coding it?|||(Ngoài giáo trình) Vì sao đặt chữ trong res/values/strings.xml thay vì hard-code?',
                options: [
                  'It runs faster|||Chạy nhanh hơn',
                  'It enables translation and keeps text in one place|||Cho phép dịch và giữ chữ ở một nơi',
                  'It is required by Java|||Java bắt buộc',
                  'It hides the text|||Nó giấu chữ',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — UI & LAYOUTS ══════════════════ */
    {
      title: 'Chapter 2 — Building the UI: widgets, layouts & events|||Chương 2 — Dựng UI: widget, layout & sự kiện',
      description: 'Session 5-16: widget, LinearLayout/ConstraintLayout, styles/themes, view binding và xử lý sự kiện (CLO2).',
      lessons: [
        {
          title: '2.1 — Widgets & layout managers (Linear/Constraint)|||2.1 — Widget & layout manager (Linear/Constraint)',
          slug: 'prm392-2-1-layouts',
          type: 'VIDEO',
          description: 'Các widget cơ bản và hai layout chính: LinearLayout (xếp hàng) và ConstraintLayout (ràng buộc phẳng, hiệu năng tốt).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Widgets go inside layouts; layouts decide position (CLO2)</h2>
<p class="lead"><strong>Widgets</strong> (a.k.a. Views) are the pieces users see: &#96;TextView&#96;, &#96;EditText&#96;, &#96;Button&#96;, &#96;ImageView&#96;, &#96;CheckBox&#96;. <strong>Layout managers</strong> (ViewGroups) arrange them. The two you'll use most are LinearLayout and ConstraintLayout.</p>
<table>
<thead><tr><th>Layout</th><th>How it positions</th><th>Use when</th></tr></thead>
<tbody>
<tr><td>LinearLayout</td><td>Stacks children in a row or column</td><td>Simple lists of fields</td></tr>
<tr><td>ConstraintLayout</td><td>Each view is constrained to others/parent</td><td>Complex, flat, responsive UIs</td></tr>
<tr><td>FrameLayout</td><td>Stacks children on top of each other</td><td>Overlays, single fragment host</td></tr>
</tbody>
</table>
<h3>Every view needs width & height</h3>
<div class="out">android:layout_width / android:layout_height take:
  • match_parent  → fill the parent
  • wrap_content  → just big enough for the content
  • 0dp           → (ConstraintLayout) "match constraints", stretch to fit
Use dp for sizes (density-independent), sp for text (respects user font size).</div>
<div class="out"><strong>ConstraintLayout — a centered button</strong>
&lt;Button
    android:id="@+id/btnGo"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent" /&gt;
<!-- 4 opposing constraints = centered both ways --></div>
<div class="pitfall"><strong>A view with no constraints jumps to (0,0).</strong> In ConstraintLayout, every view needs at least one horizontal and one vertical constraint, or it collapses to the top-left at runtime even though the editor looked fine. The design preview lies; run it.</div>
<div class="callout ok"><strong>Prefer ConstraintLayout over nested LinearLayouts.</strong> Deeply nested LinearLayouts are slow to measure and hard to change. A single flat ConstraintLayout does the same job faster — the syllabus explicitly teaches the four constraint attributes for this reason.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>dp vs px vs sp.</b> A pixel is not a fixed size — phones have different densities. &#96;dp&#96; (density-independent pixels) keeps sizes physically consistent across devices; &#96;sp&#96; additionally scales with the user's font-size accessibility setting. Using raw &#96;px&#96; makes your UI look wrong on other phones. <em>A units detail that trips up beginners but isn't drilled in the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Widget nằm trong layout; layout quyết định vị trí (CLO2)</h2>
<p class="lead"><strong>Widget</strong> (còn gọi View) là các mảnh người dùng thấy: &#96;TextView&#96;, &#96;EditText&#96;, &#96;Button&#96;, &#96;ImageView&#96;, &#96;CheckBox&#96;. <strong>Layout manager</strong> (ViewGroup) sắp xếp chúng. Hai loại bạn dùng nhiều nhất là LinearLayout và ConstraintLayout.</p>
<table>
<thead><tr><th>Layout</th><th>Cách đặt vị trí</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td>LinearLayout</td><td>Xếp con thành hàng hoặc cột</td><td>Danh sách ô đơn giản</td></tr>
<tr><td>ConstraintLayout</td><td>Mỗi view ràng buộc vào view khác/cha</td><td>UI phức tạp, phẳng, đáp ứng</td></tr>
<tr><td>FrameLayout</td><td>Xếp con chồng lên nhau</td><td>Lớp phủ, chứa một fragment</td></tr>
</tbody>
</table>
<h3>Mỗi view cần rộng & cao</h3>
<div class="out">android:layout_width / android:layout_height nhận:
  • match_parent  → lấp đầy cha
  • wrap_content  → vừa đủ với nội dung
  • 0dp           → (ConstraintLayout) "khớp ràng buộc", giãn cho vừa
Dùng dp cho kích thước (độc lập mật độ), sp cho chữ (theo cỡ chữ người dùng).</div>
<div class="out"><strong>ConstraintLayout — một nút căn giữa</strong>
&lt;Button
    android:id="@+id/btnGo"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:layout_constraintTop_toTopOf="parent"
    app:layout_constraintBottom_toBottomOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintEnd_toEndOf="parent" /&gt;
<!-- 4 ràng buộc đối nhau = căn giữa cả hai chiều --></div>
<div class="pitfall"><strong>Một view không có ràng buộc nhảy về (0,0).</strong> Trong ConstraintLayout, mỗi view cần ít nhất một ràng buộc ngang và một dọc, nếu không nó co về góc trên-trái lúc chạy dù trình sửa trông ổn. Bản xem trước "nói dối"; hãy chạy thật.</div>
<div class="callout ok"><strong>Ưu tiên ConstraintLayout hơn LinearLayout lồng nhau.</strong> LinearLayout lồng sâu chậm khi đo và khó đổi. Một ConstraintLayout phẳng duy nhất làm cùng việc nhanh hơn — syllabus dạy rõ bốn thuộc tính ràng buộc vì lý do này.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>dp vs px vs sp.</b> Một pixel không phải kích thước cố định — điện thoại có mật độ khác nhau. &#96;dp&#96; (pixel độc lập mật độ) giữ kích thước nhất quán vật lý trên các máy; &#96;sp&#96; còn co giãn theo cài đặt cỡ chữ accessibility của người dùng. Dùng &#96;px&#96; thô làm UI sai trên máy khác. <em>Chi tiết đơn vị hay làm người mới vấp nhưng syllabus không luyện kỹ.</em></div>
</div>`,
        },
        {
          title: '2.2 — Handling events, styles & themes|||2.2 — Xử lý sự kiện, styles & themes',
          slug: 'prm392-2-2-events-styles',
          type: 'VIDEO',
          description: 'Bắt sự kiện người dùng bằng listener, và tách hình thức ra styles/themes để nhất quán & dễ đổi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Respond to the user with listeners; style with styles & themes</h2>
<p class="lead">A GUI is dead until it responds. You attach a <strong>listener</strong> — a callback object — to a widget, and Android calls it when the event happens (click, text change, checked).</p>
<div class="out"><strong>Reading input & reacting</strong>
EditText etName = findViewById(R.id.etName);
Button btnGreet = findViewById(R.id.btnGreet);
TextView tvOut = findViewById(R.id.tvOut);

btnGreet.setOnClickListener(v -&gt; {
    String name = etName.getText().toString().trim();
    if (name.isEmpty()) {
        etName.setError("Please enter a name");     // inline validation
        return;
    }
    tvOut.setText("Hello, " + name + "!");
});</div>
<p>Common listeners: &#96;setOnClickListener&#96; (button tap), &#96;addTextChangedListener&#96; (live text), &#96;setOnCheckedChangeListener&#96; (switch/checkbox), &#96;setOnItemClickListener&#96; (list rows).</p>
<h3>Styles & themes — write appearance once</h3>
<p>A <strong>style</strong> is a named bundle of attributes (text size, color, padding) applied to a view; a <strong>theme</strong> is a style applied app-wide (colors, default widget look). They enforce Nielsen's consistency for free and let one change restyle the whole app.</p>
<div class="out"><strong>res/values/styles.xml</strong>
&lt;style name="PrimaryButton" parent="Widget.MaterialComponents.Button"&gt;
    &lt;item name="android:textAllCaps"&gt;false&lt;/item&gt;
    &lt;item name="android:padding"&gt;12dp&lt;/item&gt;
&lt;/style&gt;
<!-- use in layout:  style="@style/PrimaryButton" --></div>
<div class="pitfall"><strong>Do heavy work off the click callback.</strong> A listener runs on the UI (main) thread. If your click does a network call or a big DB query directly, the UI freezes and Android may kill the app with an ANR ("Application Not Responding"). Move I/O to a background thread (Chapter 6).</div>
<div class="callout ok"><strong>Validate input where the user is.</strong> &#96;editText.setError("...")&#96; shows a message right on the field — better UX than a Toast, and it maps to the "help users recover from errors" heuristic.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Material Design & theming.</b> Android apps are expected to follow <em>Material Design</em>. Using &#96;Theme.MaterialComponents&#96; and Material widgets (MaterialButton, TextInputLayout) gives you ripple effects, elevation and dark-mode support for free, and makes your project look professional in the demo. <em>A design-system layer the syllabus doesn't require but graders notice.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Phản hồi người dùng bằng listener; tạo hình thức bằng styles & themes</h2>
<p class="lead">Một GUI vô hồn cho tới khi nó phản hồi. Bạn gắn một <strong>listener</strong> — một đối tượng callback — vào widget, và Android gọi nó khi sự kiện xảy ra (click, đổi chữ, tick).</p>
<div class="out"><strong>Đọc input & phản ứng</strong>
EditText etName = findViewById(R.id.etName);
Button btnGreet = findViewById(R.id.btnGreet);
TextView tvOut = findViewById(R.id.tvOut);

btnGreet.setOnClickListener(v -&gt; {
    String name = etName.getText().toString().trim();
    if (name.isEmpty()) {
        etName.setError("Vui lòng nhập tên");        // kiểm tra tại chỗ
        return;
    }
    tvOut.setText("Xin chào, " + name + "!");
});</div>
<p>Listener hay dùng: &#96;setOnClickListener&#96; (chạm nút), &#96;addTextChangedListener&#96; (chữ trực tiếp), &#96;setOnCheckedChangeListener&#96; (switch/checkbox), &#96;setOnItemClickListener&#96; (hàng danh sách).</p>
<h3>Styles & themes — viết hình thức một lần</h3>
<p>Một <strong>style</strong> là bó thuộc tính đặt tên (cỡ chữ, màu, padding) áp cho một view; một <strong>theme</strong> là style áp toàn app (màu, hình thức widget mặc định). Chúng thực thi tính nhất quán Nielsen miễn phí và cho một thay đổi làm lại hình thức cả app.</p>
<div class="out"><strong>res/values/styles.xml</strong>
&lt;style name="PrimaryButton" parent="Widget.MaterialComponents.Button"&gt;
    &lt;item name="android:textAllCaps"&gt;false&lt;/item&gt;
    &lt;item name="android:padding"&gt;12dp&lt;/item&gt;
&lt;/style&gt;
<!-- dùng trong layout:  style="@style/PrimaryButton" --></div>
<div class="pitfall"><strong>Làm việc nặng ngoài callback click.</strong> Listener chạy trên UI (main) thread. Nếu click của bạn gọi mạng hoặc truy vấn DB lớn trực tiếp, UI đơ và Android có thể giết app bằng ANR ("Application Not Responding"). Chuyển I/O sang thread nền (Chương 6).</div>
<div class="callout ok"><strong>Kiểm tra input ngay nơi người dùng đứng.</strong> &#96;editText.setError("...")&#96; hiện thông báo ngay trên ô — UX tốt hơn Toast, và khớp heuristic "giúp người dùng phục hồi lỗi".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Material Design & theming.</b> App Android nên theo <em>Material Design</em>. Dùng &#96;Theme.MaterialComponents&#96; và widget Material (MaterialButton, TextInputLayout) cho bạn hiệu ứng ripple, độ nổi và hỗ trợ dark-mode miễn phí, và làm project trông chuyên nghiệp lúc demo. <em>Một lớp design-system syllabus không bắt buộc nhưng người chấm để ý.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'To center a view both ways in ConstraintLayout you add:|||Để căn giữa một view cả hai chiều trong ConstraintLayout bạn thêm:',
                options: [
                  'Only a top constraint|||Chỉ một ràng buộc trên',
                  'Four opposing constraints (top, bottom, start, end to parent)|||Bốn ràng buộc đối nhau (top, bottom, start, end vào cha)',
                  'A gravity=center on the button only|||Chỉ gravity=center trên nút',
                  'Nothing, it centers by default|||Không gì, nó tự căn giữa',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which unit should you use for TEXT sizes so it respects the user\'s font setting?|||Đơn vị nào nên dùng cho cỡ CHỮ để tôn trọng cài đặt font người dùng?',
                options: ['px', 'dp', 'sp', 'pt'],
                correctIndex: 2,
              },
              {
                id: 'q3', points: 1,
                question: 'setOnClickListener callbacks run on which thread?|||Callback setOnClickListener chạy trên thread nào?',
                options: [
                  'A random background thread|||Một thread nền ngẫu nhiên',
                  'The UI (main) thread|||Thread UI (main)',
                  'The database thread|||Thread cơ sở dữ liệu',
                  'No thread|||Không thread nào',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Doing a long network call directly inside a click listener risks:|||Gọi mạng lâu trực tiếp trong click listener có nguy cơ:',
                options: [
                  'A faster UI|||UI nhanh hơn',
                  'Freezing the UI and an ANR (Application Not Responding)|||Đơ UI và ANR (Application Not Responding)',
                  'A compile error|||Lỗi biên dịch',
                  'Better battery life|||Pin tốt hơn',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'A style/theme is mainly used to:|||Một style/theme chủ yếu dùng để:',
                options: [
                  'Store data|||Lưu dữ liệu',
                  'Define appearance once and apply it consistently|||Định nghĩa hình thức một lần và áp nhất quán',
                  'Handle clicks|||Xử lý click',
                  'Connect to the internet|||Kết nối internet',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — ACTIVITIES, LIFECYCLE & INTENTS ══════════════════ */
    {
      title: 'Chapter 3 — Activities, lifecycle & intents|||Chương 3 — Activity, vòng đời & intent',
      description: 'Session 13-18: Activity, vòng đời Activity, và Intent để mở màn hình + truyền dữ liệu (CLO3).',
      lessons: [
        {
          title: '3.1 — The Activity lifecycle|||3.1 — Vòng đời Activity',
          slug: 'prm392-3-1-lifecycle',
          type: 'VIDEO',
          description: 'Bảy callback vòng đời, khi nào mỗi cái chạy, và vì sao xoay màn hình phá app nếu bạn không hiểu chúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>The system owns your screen's life — learn its callbacks</h2>
<p class="lead">You don't create or destroy an Activity; the OS does, calling <strong>lifecycle methods</strong> so you can react. Master these and most "my data disappeared" bugs vanish.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Create</div><div class="lz-t">onCreate</div><div class="lz-d">build UI, once</div></div>
  <div class="lz-step"><div class="lz-k">Show</div><div class="lz-t">onStart → onResume</div><div class="lz-d">visible &amp; interactive</div></div>
  <div class="lz-step"><div class="lz-k">Leave</div><div class="lz-t">onPause → onStop</div><div class="lz-d">save, release</div></div>
  <div class="lz-step"><div class="lz-k">End</div><div class="lz-t">onDestroy</div><div class="lz-d">final cleanup</div></div>
</div>
<table>
<thead><tr><th>Callback</th><th>When</th><th>Do</th></tr></thead>
<tbody>
<tr><td>onCreate</td><td>Screen created (once)</td><td>setContentView, init views</td></tr>
<tr><td>onStart</td><td>Becoming visible</td><td>—</td></tr>
<tr><td>onResume</td><td>In foreground, interactive</td><td>start camera/sensors</td></tr>
<tr><td>onPause</td><td>Losing focus</td><td>pause, save light state (fast!)</td></tr>
<tr><td>onStop</td><td>No longer visible</td><td>release heavy resources</td></tr>
<tr><td>onDestroy</td><td>Being destroyed</td><td>final cleanup</td></tr>
</tbody>
</table>
<h3>The rotation trap</h3>
<p>Rotating the phone <strong>destroys and recreates</strong> the Activity (onDestroy → onCreate). Any data held only in a field is lost. Fix: save small state in &#96;onSaveInstanceState(Bundle)&#96; and restore it in &#96;onCreate&#96;, or (better) hold it in a ViewModel (Chapter 8).</p>
<div class="out"><strong>Surviving rotation with a Bundle</strong>
@Override protected void onSaveInstanceState(Bundle out) {
    super.onSaveInstanceState(out);
    out.putInt("count", count);          // save before destroy
}
@Override protected void onCreate(Bundle saved) {
    super.onCreate(saved);
    setContentView(R.layout.activity_main);
    if (saved != null) count = saved.getInt("count");   // restore
}</div>
<div class="pitfall"><strong>onPause must be fast.</strong> The next Activity can't resume until your onPause returns. Don't do disk or network work there — do only quick saves, and heavier release in onStop.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Configuration changes are more than rotation.</b> Language change, dark-mode toggle, font-size change, and multi-window resize all recreate the Activity the same way. Designing every screen to rebuild cleanly from saved state (rather than fighting it with &#96;android:configChanges&#96;) is the robust approach real apps take. <em>Beyond the syllabus but explains a whole class of bugs.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Hệ thống sở hữu vòng đời màn hình của bạn — học callback của nó</h2>
<p class="lead">Bạn không tạo hay huỷ Activity; HĐH làm, gọi các <strong>phương thức vòng đời</strong> để bạn phản ứng. Nắm vững chúng và đa số lỗi "dữ liệu biến mất" biến mất theo.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tạo</div><div class="lz-t">onCreate</div><div class="lz-d">dựng UI, một lần</div></div>
  <div class="lz-step"><div class="lz-k">Hiện</div><div class="lz-t">onStart → onResume</div><div class="lz-d">thấy &amp; tương tác</div></div>
  <div class="lz-step"><div class="lz-k">Rời</div><div class="lz-t">onPause → onStop</div><div class="lz-d">lưu, giải phóng</div></div>
  <div class="lz-step"><div class="lz-k">Kết</div><div class="lz-t">onDestroy</div><div class="lz-d">dọn dẹp cuối</div></div>
</div>
<table>
<thead><tr><th>Callback</th><th>Khi nào</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td>onCreate</td><td>Màn hình được tạo (một lần)</td><td>setContentView, khởi tạo view</td></tr>
<tr><td>onStart</td><td>Sắp hiện</td><td>—</td></tr>
<tr><td>onResume</td><td>Ở tiền cảnh, tương tác</td><td>bật camera/cảm biến</td></tr>
<tr><td>onPause</td><td>Mất focus</td><td>tạm dừng, lưu state nhẹ (nhanh!)</td></tr>
<tr><td>onStop</td><td>Không còn hiện</td><td>giải phóng tài nguyên nặng</td></tr>
<tr><td>onDestroy</td><td>Đang bị huỷ</td><td>dọn dẹp cuối</td></tr>
</tbody>
</table>
<h3>Bẫy xoay màn hình</h3>
<p>Xoay điện thoại <strong>huỷ và tạo lại</strong> Activity (onDestroy → onCreate). Bất kỳ dữ liệu chỉ giữ trong một field đều mất. Cách sửa: lưu state nhỏ trong &#96;onSaveInstanceState(Bundle)&#96; và khôi phục trong &#96;onCreate&#96;, hoặc (tốt hơn) giữ nó trong ViewModel (Chương 8).</p>
<div class="out"><strong>Sống sót khi xoay bằng Bundle</strong>
@Override protected void onSaveInstanceState(Bundle out) {
    super.onSaveInstanceState(out);
    out.putInt("count", count);          // lưu trước khi huỷ
}
@Override protected void onCreate(Bundle saved) {
    super.onCreate(saved);
    setContentView(R.layout.activity_main);
    if (saved != null) count = saved.getInt("count");   // khôi phục
}</div>
<div class="pitfall"><strong>onPause phải nhanh.</strong> Activity kế tiếp không resume được cho tới khi onPause của bạn trả về. Đừng làm việc đĩa hay mạng ở đó — chỉ lưu nhanh, và giải phóng nặng hơn ở onStop.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thay đổi cấu hình không chỉ là xoay.</b> Đổi ngôn ngữ, bật dark-mode, đổi cỡ chữ, và resize multi-window đều tạo lại Activity theo cùng cách. Thiết kế mỗi màn để dựng lại sạch từ state đã lưu (thay vì chống nó bằng &#96;android:configChanges&#96;) là cách bền vững app thật dùng. <em>Ngoài syllabus nhưng giải thích cả một lớp lỗi.</em></div>
</div>`,
        },
        {
          title: '3.2 — Intents: navigate & pass data|||3.2 — Intent: điều hướng & truyền dữ liệu',
          slug: 'prm392-3-2-intents',
          type: 'VIDEO',
          description: 'Intent tường minh (mở Activity của mình) vs ngầm (nhờ hệ thống), truyền dữ liệu bằng extras và nhận kết quả trả về.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Intents are messages that start components and carry data</h2>
<p class="lead">To move between screens you fire an <strong>Intent</strong>. An <em>explicit</em> intent names your target class; an <em>implicit</em> intent describes an action ("view this URL") and lets the system pick an app.</p>
<div class="out"><strong>Explicit — open your own DetailActivity with data</strong>
Intent i = new Intent(this, DetailActivity.class);
i.putExtra("productId", 42);
i.putExtra("name", "Coffee");
startActivity(i);

// In DetailActivity.onCreate:
int id = getIntent().getIntExtra("productId", -1);
String name = getIntent().getStringExtra("name");</div>
<div class="out"><strong>Implicit — let the system handle it</strong>
// open a web page
startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://fpt.edu.vn")));
// dial a number
startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:1900")));</div>
<h3>Getting a result back</h3>
<p>Old apps used &#96;startActivityForResult&#96;; the modern API is the <strong>Activity Result API</strong> (&#96;registerForActivityResult&#96;) — cleaner and lifecycle-safe. You register a launcher, launch it, and a callback receives the result.</p>
<div class="pitfall"><strong>Extras are typed — mismatches return the default silently.</strong> If you &#96;putExtra("id", 42)&#96; (an int) but read &#96;getStringExtra("id")&#96;, you get null with no error. Keep put/get types identical, and define key names as constants shared by both Activities.</div>
<div class="callout ok"><strong>Explicit for your app, implicit for the world.</strong> Use explicit intents to move inside your app (you know the class); use implicit intents to hand off to other apps (browser, dialer, maps, share sheet) — that reuse is a big part of Android's power.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Passing whole objects: Parcelable.</b> Extras hold primitives and strings. To pass a whole model object, implement &#96;Parcelable&#96; (Android's fast serialization) or pass just an id and reload from the database in the next screen. The id-passing pattern is usually cleaner and avoids stale copies. <em>An architecture choice the syllabus glosses over.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Intent là thông điệp khởi động component và mang dữ liệu</h2>
<p class="lead">Để chuyển giữa các màn bạn bắn một <strong>Intent</strong>. Intent <em>tường minh</em> gọi đích danh class của bạn; intent <em>ngầm</em> mô tả một hành động ("xem URL này") và để hệ thống chọn app.</p>
<div class="out"><strong>Tường minh — mở DetailActivity của mình kèm dữ liệu</strong>
Intent i = new Intent(this, DetailActivity.class);
i.putExtra("productId", 42);
i.putExtra("name", "Coffee");
startActivity(i);

// Trong DetailActivity.onCreate:
int id = getIntent().getIntExtra("productId", -1);
String name = getIntent().getStringExtra("name");</div>
<div class="out"><strong>Ngầm — để hệ thống xử lý</strong>
// mở trang web
startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://fpt.edu.vn")));
// gọi số điện thoại
startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse("tel:1900")));</div>
<h3>Nhận kết quả trả về</h3>
<p>App cũ dùng &#96;startActivityForResult&#96;; API hiện đại là <strong>Activity Result API</strong> (&#96;registerForActivityResult&#96;) — gọn hơn và an toàn vòng đời. Bạn đăng ký một launcher, chạy nó, và một callback nhận kết quả.</p>
<div class="pitfall"><strong>Extras có kiểu — sai kiểu trả mặc định âm thầm.</strong> Nếu bạn &#96;putExtra("id", 42)&#96; (int) nhưng đọc &#96;getStringExtra("id")&#96;, bạn nhận null không lỗi. Giữ kiểu put/get y hệt, và định nghĩa tên key thành hằng dùng chung cho cả hai Activity.</div>
<div class="callout ok"><strong>Tường minh cho app của bạn, ngầm cho thế giới.</strong> Dùng intent tường minh để di chuyển trong app (bạn biết class); dùng intent ngầm để chuyển giao cho app khác (trình duyệt, gọi điện, bản đồ, share) — sự tái dùng đó là phần lớn sức mạnh Android.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Truyền cả đối tượng: Parcelable.</b> Extras chứa kiểu nguyên thuỷ và chuỗi. Để truyền cả một model, hiện thực &#96;Parcelable&#96; (serialization nhanh của Android) hoặc chỉ truyền id và tải lại từ cơ sở dữ liệu ở màn kế. Mẫu truyền id thường sạch hơn và tránh bản sao cũ. <em>Một lựa chọn kiến trúc syllabus nói lướt qua.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'When you rotate the phone, an Activity by default:|||Khi bạn xoay điện thoại, một Activity theo mặc định:',
                options: [
                  'Keeps all field values automatically|||Tự động giữ mọi giá trị field',
                  'Is destroyed and recreated (onDestroy → onCreate)|||Bị huỷ và tạo lại (onDestroy → onCreate)',
                  'Pauses forever|||Tạm dừng mãi mãi',
                  'Closes the app|||Đóng app',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which callback should build the UI and run once when the screen is created?|||Callback nào nên dựng UI và chạy một lần khi màn hình được tạo?',
                options: ['onResume', 'onCreate', 'onStop', 'onDestroy'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'To open YOUR own DetailActivity, you use:|||Để mở DetailActivity của CHÍNH bạn, bạn dùng:',
                options: [
                  'An implicit intent (action + data)|||Một intent ngầm (action + data)',
                  'An explicit intent naming DetailActivity.class|||Một intent tường minh gọi tên DetailActivity.class',
                  'A BroadcastReceiver|||Một BroadcastReceiver',
                  'A ContentProvider|||Một ContentProvider',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'You putExtra("id", 42) as an int but read getStringExtra("id"). Result:|||Bạn putExtra("id", 42) kiểu int nhưng đọc getStringExtra("id"). Kết quả:',
                options: [
                  'The value 42 as a string|||Giá trị 42 dạng chuỗi',
                  'null, silently (type mismatch)|||null, âm thầm (sai kiểu)',
                  'A crash|||Một crash',
                  'A compile error|||Lỗi biên dịch',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'onPause should be kept fast because:|||onPause nên giữ nhanh vì:',
                options: [
                  'It runs on a background thread|||Nó chạy trên thread nền',
                  'The next Activity cannot resume until it returns|||Activity kế tiếp không resume được cho tới khi nó trả về',
                  'It is called a hundred times|||Nó được gọi cả trăm lần',
                  'It saves to the cloud|||Nó lưu lên đám mây',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — LISTS, MEDIA & PERMISSIONS ══════════════════ */
    {
      title: 'Chapter 4 — RecyclerView, media & permissions|||Chương 4 — RecyclerView, media & permission',
      description: 'Session 19-28: RecyclerView + Adapter, hiển thị ảnh, menu, permission runtime và notification (CLO3).',
      lessons: [
        {
          title: '4.1 — RecyclerView, Adapter & ViewHolder|||4.1 — RecyclerView, Adapter & ViewHolder',
          slug: 'prm392-4-1-recyclerview',
          type: 'VIDEO',
          description: 'Cách RecyclerView tái dùng view để cuộn mượt danh sách dài, và bộ ba Adapter/ViewHolder/layout hàng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>RecyclerView shows long lists efficiently by recycling views</h2>
<p class="lead">A list of 10,000 items can't create 10,000 view objects — the phone would run out of memory. <strong>RecyclerView</strong> creates only enough rows to fill the screen and <em>reuses</em> them as you scroll. You supply an <strong>Adapter</strong> that binds your data to a reusable <strong>ViewHolder</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Data</div><div class="lz-t">List&lt;Product&gt;</div><div class="lz-d">your model list</div></div>
  <div class="lz-step"><div class="lz-k">Row layout</div><div class="lz-t">item_product.xml</div><div class="lz-d">how one row looks</div></div>
  <div class="lz-step"><div class="lz-k">ViewHolder</div><div class="lz-t">holds row views</div><div class="lz-d">cache findViewById</div></div>
  <div class="lz-step"><div class="lz-k">Adapter</div><div class="lz-t">binds data→views</div><div class="lz-d">onCreate/onBind/getItemCount</div></div>
</div>
<div class="out"><strong>The Adapter (the 3 methods you always implement)</strong>
class ProductAdapter extends RecyclerView.Adapter&lt;ProductAdapter.VH&gt; {
    private final List&lt;Product&gt; items;
    ProductAdapter(List&lt;Product&gt; items) { this.items = items; }

    static class VH extends RecyclerView.ViewHolder {
        TextView tvName;
        VH(View v) { super(v); tvName = v.findViewById(R.id.tvName); }
    }
    @Override public VH onCreateViewHolder(ViewGroup p, int type) {
        View v = LayoutInflater.from(p.getContext())
                    .inflate(R.layout.item_product, p, false);
        return new VH(v);
    }
    @Override public void onBindViewHolder(VH h, int pos) {
        h.tvName.setText(items.get(pos).getName());   // reuse the row
    }
    @Override public int getItemCount() { return items.size(); }
}
// Wire it up:
rv.setLayoutManager(new LinearLayoutManager(this));
rv.setAdapter(new ProductAdapter(products));</div>
<div class="pitfall"><strong>Because rows are recycled, always set every field in onBindViewHolder.</strong> If you set text only when non-empty, a reused row keeps the previous item's text. Set (or clear) each view every bind — this "ghost data" bug is a classic.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%204.1#module-251" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java Collections Framework</span><span class="lc-sub">java-core · module 251 · List/Map behind your adapter data</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>DiffUtil + ListAdapter for smooth updates.</b> Calling &#96;notifyDataSetChanged()&#96; redraws everything and loses animations. &#96;ListAdapter&#96; with &#96;DiffUtil&#96; computes the minimal changes and animates inserts/removals automatically — the modern, performant way to update lists. <em>Beyond the syllabus but the standard in real apps.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>RecyclerView hiện danh sách dài hiệu quả bằng cách tái dùng view</h2>
<p class="lead">Một danh sách 10.000 mục không thể tạo 10.000 view — điện thoại sẽ hết bộ nhớ. <strong>RecyclerView</strong> chỉ tạo đủ hàng lấp đầy màn hình và <em>tái dùng</em> chúng khi bạn cuộn. Bạn cung cấp một <strong>Adapter</strong> gắn dữ liệu vào một <strong>ViewHolder</strong> tái dùng được.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Dữ liệu</div><div class="lz-t">List&lt;Product&gt;</div><div class="lz-d">danh sách model của bạn</div></div>
  <div class="lz-step"><div class="lz-k">Layout hàng</div><div class="lz-t">item_product.xml</div><div class="lz-d">một hàng trông thế nào</div></div>
  <div class="lz-step"><div class="lz-k">ViewHolder</div><div class="lz-t">giữ view của hàng</div><div class="lz-d">cache findViewById</div></div>
  <div class="lz-step"><div class="lz-k">Adapter</div><div class="lz-t">gắn dữ liệu→view</div><div class="lz-d">onCreate/onBind/getItemCount</div></div>
</div>
<div class="out"><strong>Adapter (3 phương thức bạn luôn hiện thực)</strong>
class ProductAdapter extends RecyclerView.Adapter&lt;ProductAdapter.VH&gt; {
    private final List&lt;Product&gt; items;
    ProductAdapter(List&lt;Product&gt; items) { this.items = items; }

    static class VH extends RecyclerView.ViewHolder {
        TextView tvName;
        VH(View v) { super(v); tvName = v.findViewById(R.id.tvName); }
    }
    @Override public VH onCreateViewHolder(ViewGroup p, int type) {
        View v = LayoutInflater.from(p.getContext())
                    .inflate(R.layout.item_product, p, false);
        return new VH(v);
    }
    @Override public void onBindViewHolder(VH h, int pos) {
        h.tvName.setText(items.get(pos).getName());   // tái dùng hàng
    }
    @Override public int getItemCount() { return items.size(); }
}
// Nối lại:
rv.setLayoutManager(new LinearLayoutManager(this));
rv.setAdapter(new ProductAdapter(products));</div>
<div class="pitfall"><strong>Vì hàng được tái dùng, luôn set MỌI field trong onBindViewHolder.</strong> Nếu bạn chỉ set chữ khi không rỗng, một hàng tái dùng giữ chữ của mục trước. Set (hoặc xoá) mỗi view mỗi lần bind — lỗi "dữ liệu ma" này rất kinh điển.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%204.1#module-251" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java Collections Framework</span><span class="lc-sub">java-core · module 251 · List/Map đằng sau dữ liệu adapter</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>DiffUtil + ListAdapter cho cập nhật mượt.</b> Gọi &#96;notifyDataSetChanged()&#96; vẽ lại tất cả và mất animation. &#96;ListAdapter&#96; với &#96;DiffUtil&#96; tính thay đổi tối thiểu và tự animate thêm/xoá — cách hiện đại, hiệu năng để cập nhật danh sách. <em>Ngoài syllabus nhưng là chuẩn trong app thật.</em></div>
</div>`,
        },
        {
          title: '4.2 — Menus, runtime permissions & notifications|||4.2 — Menu, permission runtime & notification',
          slug: 'prm392-4-2-permissions',
          type: 'VIDEO',
          description: 'Menu tuỳ chọn, xin permission nguy hiểm lúc chạy (đúng cách), và bắn notification qua kênh (channel).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Ask for dangerous permissions at runtime, notify via channels</h2>
<p class="lead">Some permissions (camera, location, contacts) are "dangerous" — since Android 6 you must request them <em>at runtime</em>, not just in the manifest. And notifications since Android 8 must go through a <strong>channel</strong>.</p>
<h3>Runtime permission flow</h3>
<div class="out"><strong>Request location at runtime</strong>
// 1) declare in AndroidManifest.xml:
//    &lt;uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/&gt;

// 2) check, then request at runtime:
if (ContextCompat.checkSelfPermission(this, ACCESS_FINE_LOCATION)
        != PackageManager.PERMISSION_GRANTED) {
    requestPermissions(new String[]{ACCESS_FINE_LOCATION}, REQ_LOC);
} else {
    useLocation();
}

// 3) handle the user's answer:
@Override public void onRequestPermissionsResult(int code,
        String[] perms, int[] results) {
    if (code == REQ_LOC && results.length &gt; 0
            && results[0] == PackageManager.PERMISSION_GRANTED) {
        useLocation();
    } else {
        Toast.makeText(this, "Location denied", Toast.LENGTH_SHORT).show();
    }
}</div>
<div class="pitfall"><strong>Declaring a dangerous permission in the manifest is not enough.</strong> On modern Android it stays denied until the user grants it at runtime, and they can revoke it any time — so always <em>check</em> before using, and handle the "denied" path gracefully. Assuming it's granted is a top crash cause.</div>
<h3>Notifications need a channel (Android 8+)</h3>
<div class="out">// create a channel once (e.g. in Application.onCreate)
NotificationChannel ch = new NotificationChannel(
    "orders", "Orders", NotificationManager.IMPORTANCE_DEFAULT);
getSystemService(NotificationManager.class).createNotificationChannel(ch);

// then post a notification
Notification n = new NotificationCompat.Builder(this, "orders")
    .setSmallIcon(R.drawable.ic_bell)
    .setContentTitle("Order ready")
    .setContentText("Your coffee is ready to pick up")
    .build();
NotificationManagerCompat.from(this).notify(1, n);</div>
<div class="callout ok"><strong>Menus come from XML too.</strong> Inflate a menu resource in &#96;onCreateOptionsMenu&#96; and react in &#96;onOptionsItemSelected&#96; — same resource + callback pattern as everything else in Android.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>POST_NOTIFICATIONS on Android 13+.</b> From Android 13, even posting a notification requires a <em>runtime</em> permission (&#96;POST_NOTIFICATIONS&#96;). Older tutorials skip this, so a notification that "worked on the emulator" silently shows nothing on a new phone. Request it like any dangerous permission. <em>A recent change beyond the syllabus that catches many students.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Xin permission nguy hiểm lúc chạy, thông báo qua kênh</h2>
<p class="lead">Một số permission (camera, vị trí, danh bạ) là "nguy hiểm" — từ Android 6 bạn phải xin <em>lúc chạy</em>, không chỉ khai trong manifest. Và notification từ Android 8 phải đi qua một <strong>channel (kênh)</strong>.</p>
<h3>Luồng xin permission runtime</h3>
<div class="out"><strong>Xin vị trí lúc chạy</strong>
// 1) khai trong AndroidManifest.xml:
//    &lt;uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/&gt;

// 2) kiểm, rồi xin lúc chạy:
if (ContextCompat.checkSelfPermission(this, ACCESS_FINE_LOCATION)
        != PackageManager.PERMISSION_GRANTED) {
    requestPermissions(new String[]{ACCESS_FINE_LOCATION}, REQ_LOC);
} else {
    useLocation();
}

// 3) xử lý câu trả lời của người dùng:
@Override public void onRequestPermissionsResult(int code,
        String[] perms, int[] results) {
    if (code == REQ_LOC && results.length &gt; 0
            && results[0] == PackageManager.PERMISSION_GRANTED) {
        useLocation();
    } else {
        Toast.makeText(this, "Đã từ chối vị trí", Toast.LENGTH_SHORT).show();
    }
}</div>
<div class="pitfall"><strong>Khai permission nguy hiểm trong manifest là chưa đủ.</strong> Trên Android hiện đại nó vẫn bị từ chối cho tới khi người dùng cấp lúc chạy, và họ có thể thu hồi bất cứ lúc nào — nên luôn <em>kiểm</em> trước khi dùng, và xử lý nhánh "bị từ chối" đàng hoàng. Giả định đã được cấp là nguyên nhân crash hàng đầu.</div>
<h3>Notification cần một channel (Android 8+)</h3>
<div class="out">// tạo channel một lần (vd trong Application.onCreate)
NotificationChannel ch = new NotificationChannel(
    "orders", "Đơn hàng", NotificationManager.IMPORTANCE_DEFAULT);
getSystemService(NotificationManager.class).createNotificationChannel(ch);

// rồi bắn một notification
Notification n = new NotificationCompat.Builder(this, "orders")
    .setSmallIcon(R.drawable.ic_bell)
    .setContentTitle("Đơn đã sẵn sàng")
    .setContentText("Cà phê của bạn đã sẵn để lấy")
    .build();
NotificationManagerCompat.from(this).notify(1, n);</div>
<div class="callout ok"><strong>Menu cũng đến từ XML.</strong> Inflate một menu resource trong &#96;onCreateOptionsMenu&#96; và phản ứng trong &#96;onOptionsItemSelected&#96; — cùng mẫu resource + callback như mọi thứ khác trong Android.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>POST_NOTIFICATIONS trên Android 13+.</b> Từ Android 13, kể cả bắn một notification cũng cần permission <em>runtime</em> (&#96;POST_NOTIFICATIONS&#96;). Tutorial cũ bỏ qua điều này, nên một notification "chạy trên emulator" âm thầm không hiện gì trên máy mới. Xin nó như bất kỳ permission nguy hiểm nào. <em>Một thay đổi gần đây ngoài syllabus làm nhiều sinh viên vấp.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'RecyclerView is efficient for long lists because it:|||RecyclerView hiệu quả cho danh sách dài vì nó:',
                options: [
                  'Loads all items into memory at once|||Tải mọi mục vào bộ nhớ cùng lúc',
                  'Creates only enough rows for the screen and reuses them|||Chỉ tạo đủ hàng cho màn hình và tái dùng chúng',
                  'Uses the internet for each row|||Dùng internet cho mỗi hàng',
                  'Disables scrolling|||Tắt cuộn',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Which three methods does a RecyclerView.Adapter always implement?|||Ba phương thức nào một RecyclerView.Adapter luôn hiện thực?',
                options: [
                  'onCreate / onStart / onStop|||onCreate / onStart / onStop',
                  'onCreateViewHolder / onBindViewHolder / getItemCount|||onCreateViewHolder / onBindViewHolder / getItemCount',
                  'onClick / onLongClick / onScroll|||onClick / onLongClick / onScroll',
                  'insert / update / delete|||insert / update / delete',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Because rows are recycled, in onBindViewHolder you should:|||Vì hàng được tái dùng, trong onBindViewHolder bạn nên:',
                options: [
                  'Set every field for the current item every time|||Set mọi field cho mục hiện tại mỗi lần',
                  'Set text only when it is not empty|||Chỉ set chữ khi không rỗng',
                  'Never touch the views|||Không bao giờ chạm view',
                  'Create a new database|||Tạo cơ sở dữ liệu mới',
                ], correctIndex: 0,
              },
              {
                id: 'q4', points: 1,
                question: 'For a dangerous permission like location on modern Android, you must:|||Với một permission nguy hiểm như vị trí trên Android hiện đại, bạn phải:',
                options: [
                  'Only declare it in the manifest|||Chỉ khai trong manifest',
                  'Declare it AND request it at runtime, then handle the result|||Khai nó VÀ xin lúc chạy, rồi xử lý kết quả',
                  'Do nothing|||Không làm gì',
                  'Ask the Play Store|||Hỏi Play Store',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'On Android 8+, posting a notification requires:|||Trên Android 8+, bắn một notification cần:',
                options: [
                  'Nothing special|||Không gì đặc biệt',
                  'A NotificationChannel to be created first|||Một NotificationChannel được tạo trước',
                  'Root access|||Quyền root',
                  'A paid account|||Tài khoản trả phí',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — DATA STORAGE ══════════════════ */
    {
      title: 'Chapter 5 — Data storage: Preferences, SQLite, Room|||Chương 5 — Lưu trữ dữ liệu: Preferences, SQLite, Room',
      description: 'Session 29-34: SharedPreferences, internal/external storage, SQLite, Room ORM và ContentProvider (CLO4).',
      lessons: [
        {
          title: '5.1 — SharedPreferences, files & SQLite|||5.1 — SharedPreferences, tệp & SQLite',
          slug: 'prm392-5-1-storage',
          type: 'VIDEO',
          description: 'Chọn đúng cơ chế lưu: Preferences cho cài đặt nhỏ, file cho blob, SQLite cho dữ liệu có cấu trúc, truy vấn được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Pick the right storage for the shape of your data (CLO4)</h2>
<p class="lead">Android offers several storage options. Choosing wrong is a common design mistake — don't store a list of records in SharedPreferences.</p>
<table>
<thead><tr><th>Option</th><th>Best for</th><th>Not for</th></tr></thead>
<tbody>
<tr><td>SharedPreferences</td><td>Small key-value settings (theme, token)</td><td>Lists / structured records</td></tr>
<tr><td>Internal storage (files)</td><td>Private app files, cached blobs</td><td>Querying / relations</td></tr>
<tr><td>External storage</td><td>User media (photos) shared with others</td><td>Sensitive data</td></tr>
<tr><td>SQLite / Room</td><td>Structured, queryable records</td><td>A single flag</td></tr>
</tbody>
</table>
<div class="out"><strong>SharedPreferences — save a setting</strong>
SharedPreferences sp = getSharedPreferences("cfg", MODE_PRIVATE);
sp.edit().putBoolean("darkMode", true).apply();   // apply() = async
boolean dark = sp.getBoolean("darkMode", false);</div>
<div class="out"><strong>SQLite — a relational store on the device</strong>
CREATE TABLE product (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  price INTEGER NOT NULL
);
-- query from Java via SQLiteOpenHelper + Cursor
Cursor c = db.rawQuery("SELECT id, name FROM product WHERE price &lt; ?",
                       new String[]{"50000"});
while (c.moveToNext()) { /* read columns */ }
c.close();</div>
<div class="pitfall"><strong>Always close Cursors and use parameter binding.</strong> Leaked Cursors leak memory; string-concatenating values into SQL invites SQL injection. Use &#96;?&#96; placeholders with a &#96;selectionArgs&#96; array — the same rule you learned in DBI202.</div>
<a class="link-card codelab" href="/code-lab/sqlite?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%205.1#module-1463" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — SQLite queries</span><span class="lc-sub">sqlite · module 1463 · the exact engine Android ships with</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>EncryptedSharedPreferences for secrets.</b> Plain SharedPreferences is world-readable on a rooted device, so never store a raw password or token there. Jetpack Security's &#96;EncryptedSharedPreferences&#96; encrypts keys and values transparently. <em>A security upgrade the syllabus omits but graders and real apps expect for tokens.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Chọn đúng cơ chế lưu theo hình dạng dữ liệu (CLO4)</h2>
<p class="lead">Android có vài lựa chọn lưu trữ. Chọn sai là lỗi thiết kế phổ biến — đừng lưu một danh sách bản ghi trong SharedPreferences.</p>
<table>
<thead><tr><th>Lựa chọn</th><th>Tốt cho</th><th>Không dùng cho</th></tr></thead>
<tbody>
<tr><td>SharedPreferences</td><td>Cài đặt key-value nhỏ (theme, token)</td><td>Danh sách / bản ghi có cấu trúc</td></tr>
<tr><td>Internal storage (tệp)</td><td>Tệp riêng của app, blob cache</td><td>Truy vấn / quan hệ</td></tr>
<tr><td>External storage</td><td>Media người dùng (ảnh) chia sẻ được</td><td>Dữ liệu nhạy cảm</td></tr>
<tr><td>SQLite / Room</td><td>Bản ghi có cấu trúc, truy vấn được</td><td>Một cờ đơn lẻ</td></tr>
</tbody>
</table>
<div class="out"><strong>SharedPreferences — lưu một cài đặt</strong>
SharedPreferences sp = getSharedPreferences("cfg", MODE_PRIVATE);
sp.edit().putBoolean("darkMode", true).apply();   // apply() = bất đồng bộ
boolean dark = sp.getBoolean("darkMode", false);</div>
<div class="out"><strong>SQLite — kho quan hệ trên thiết bị</strong>
CREATE TABLE product (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  price INTEGER NOT NULL
);
-- truy vấn từ Java qua SQLiteOpenHelper + Cursor
Cursor c = db.rawQuery("SELECT id, name FROM product WHERE price &lt; ?",
                       new String[]{"50000"});
while (c.moveToNext()) { /* đọc cột */ }
c.close();</div>
<div class="pitfall"><strong>Luôn đóng Cursor và dùng ràng buộc tham số.</strong> Cursor rò làm rò bộ nhớ; nối chuỗi giá trị vào SQL mời gọi SQL injection. Dùng placeholder &#96;?&#96; với mảng &#96;selectionArgs&#96; — cùng quy tắc bạn học ở DBI202.</div>
<a class="link-card codelab" href="/code-lab/sqlite?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%205.1#module-1463" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — SQLite queries</span><span class="lc-sub">sqlite · module 1463 · đúng engine Android đi kèm</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>EncryptedSharedPreferences cho bí mật.</b> SharedPreferences thường đọc được trên máy root, nên đừng bao giờ lưu mật khẩu hay token thô ở đó. &#96;EncryptedSharedPreferences&#96; của Jetpack Security mã hoá key và value trong suốt. <em>Một nâng cấp bảo mật syllabus bỏ qua nhưng người chấm và app thật mong đợi cho token.</em></div>
</div>`,
        },
        {
          title: '5.2 — Room ORM & ContentProvider|||5.2 — Room ORM & ContentProvider',
          slug: 'prm392-5-2-room',
          type: 'VIDEO',
          description: 'Room bọc SQLite bằng annotation an toàn kiểu (Entity/DAO/Database), và ContentProvider chia sẻ dữ liệu giữa app.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Room makes SQLite type-safe; ContentProvider shares data across apps</h2>
<p class="lead">Raw SQLite is verbose and error-prone (string SQL, manual Cursor parsing). <strong>Room</strong> is Google's ORM over SQLite: you annotate classes and it generates the boilerplate, checking your SQL <em>at compile time</em>.</p>
<div class="out"><strong>Room = Entity + DAO + Database</strong>
@Entity
class Product {
    @PrimaryKey(autoGenerate = true) public int id;
    public String name;
    public int price;
}

@Dao
interface ProductDao {
    @Insert void insert(Product p);
    @Query("SELECT * FROM Product WHERE price &lt; :max")
    List&lt;Product&gt; cheaperThan(int max);      // SQL checked at compile time
}

@Database(entities = {Product.class}, version = 1)
abstract class AppDb extends RoomDatabase {
    abstract ProductDao productDao();
}</div>
<div class="pitfall"><strong>Room forbids database access on the main thread by default.</strong> That's a feature — DB I/O must run on a background thread (Executor / coroutine), or Room throws. It's protecting you from an ANR. Wire your DAO calls through an Executor (Chapter 6).</div>
<h3>ContentProvider — the shareable data door</h3>
<p>A <strong>ContentProvider</strong> exposes your data through a &#96;content://&#96; URI so <em>other apps</em> can query it safely (this is how you read the system Contacts). For data used only inside your app, Room is enough; use a ContentProvider when you must share.</p>
<a class="link-card codelab" href="/code-lab/sqlite?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%205.2#module-1466" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — SQLite relationships & joins</span><span class="lc-sub">sqlite · module 1466 · model relations behind your Room entities</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout ok"><strong>Prefer Room for the project.</strong> It removes whole classes of bugs (typos in SQL, leaked cursors, threading mistakes) and pairs cleanly with LiveData/ViewModel in Chapter 8 — so the UI updates automatically when data changes.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Room + Flow/LiveData = reactive data.</b> Declare a DAO query to return &#96;LiveData&lt;List&lt;Product&gt;&gt;&#96; and the UI re-renders automatically whenever the table changes — no manual refresh. This reactive pattern is the backbone of modern Android architecture and makes your MVVM project noticeably cleaner. <em>Beyond the syllabus but the direction everything is heading.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Room làm SQLite an toàn kiểu; ContentProvider chia sẻ dữ liệu giữa app</h2>
<p class="lead">SQLite thô dài dòng và dễ sai (SQL chuỗi, đọc Cursor thủ công). <strong>Room</strong> là ORM của Google trên SQLite: bạn gắn annotation cho class và nó sinh boilerplate, kiểm SQL của bạn <em>lúc biên dịch</em>.</p>
<div class="out"><strong>Room = Entity + DAO + Database</strong>
@Entity
class Product {
    @PrimaryKey(autoGenerate = true) public int id;
    public String name;
    public int price;
}

@Dao
interface ProductDao {
    @Insert void insert(Product p);
    @Query("SELECT * FROM Product WHERE price &lt; :max")
    List&lt;Product&gt; cheaperThan(int max);      // SQL kiểm lúc biên dịch
}

@Database(entities = {Product.class}, version = 1)
abstract class AppDb extends RoomDatabase {
    abstract ProductDao productDao();
}</div>
<div class="pitfall"><strong>Room cấm truy cập DB trên main thread theo mặc định.</strong> Đó là tính năng — DB I/O phải chạy trên thread nền (Executor / coroutine), nếu không Room ném lỗi. Nó đang bảo vệ bạn khỏi ANR. Nối các lời gọi DAO qua một Executor (Chương 6).</div>
<h3>ContentProvider — cánh cửa dữ liệu chia sẻ</h3>
<p>Một <strong>ContentProvider</strong> phơi dữ liệu của bạn qua một URI &#96;content://&#96; để <em>app khác</em> truy vấn an toàn (đây là cách bạn đọc Danh bạ hệ thống). Với dữ liệu chỉ dùng trong app, Room là đủ; dùng ContentProvider khi bạn phải chia sẻ.</p>
<a class="link-card codelab" href="/code-lab/sqlite?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%205.2#module-1466" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — SQLite relationships & joins</span><span class="lc-sub">sqlite · module 1466 · quan hệ model đằng sau Room entity</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout ok"><strong>Ưu tiên Room cho project.</strong> Nó loại cả lớp lỗi (gõ sai SQL, rò cursor, sai luồng) và ghép sạch với LiveData/ViewModel ở Chương 8 — nên UI tự cập nhật khi dữ liệu đổi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Room + Flow/LiveData = dữ liệu phản ứng.</b> Khai một truy vấn DAO trả về &#96;LiveData&lt;List&lt;Product&gt;&gt;&#96; và UI tự render lại mỗi khi bảng đổi — không refresh thủ công. Mẫu reactive này là xương sống của kiến trúc Android hiện đại và làm project MVVM của bạn gọn thấy rõ. <em>Ngoài syllabus nhưng là hướng mọi thứ đang đi.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Where should you store a small boolean like "dark mode on"?|||Bạn nên lưu một boolean nhỏ như "bật dark mode" ở đâu?',
                options: [
                  'A full SQLite table|||Một bảng SQLite đầy đủ',
                  'SharedPreferences|||SharedPreferences',
                  'External storage as a photo|||External storage dạng ảnh',
                  'A ContentProvider|||Một ContentProvider',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'To store a queryable list of structured records on the device, use:|||Để lưu một danh sách bản ghi có cấu trúc, truy vấn được trên thiết bị, dùng:',
                options: ['SharedPreferences', 'SQLite / Room', 'A Toast', 'An Intent extra'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Room checks your @Query SQL:|||Room kiểm SQL trong @Query của bạn:',
                options: [
                  'Never|||Không bao giờ',
                  'At compile time|||Lúc biên dịch',
                  'Only in production|||Chỉ khi lên production',
                  'Only if you ask|||Chỉ khi bạn yêu cầu',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Why does Room refuse database access on the main thread by default?|||Vì sao Room từ chối truy cập DB trên main thread theo mặc định?',
                options: [
                  'To slow the app|||Để làm chậm app',
                  'To prevent freezing the UI (ANR); DB I/O belongs on a background thread|||Để tránh đơ UI (ANR); DB I/O thuộc về thread nền',
                  'Because SQLite is broken|||Vì SQLite hỏng',
                  'For no reason|||Không vì lý do gì',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'A ContentProvider is mainly for:|||ContentProvider chủ yếu để:',
                options: [
                  'Drawing the UI|||Vẽ UI',
                  'Sharing data with OTHER apps via a content:// URI|||Chia sẻ dữ liệu với app KHÁC qua URI content://',
                  'Running background music|||Chạy nhạc nền',
                  'Requesting permissions|||Xin permission',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — SERVICES, THREADS & FRAGMENTS ══════════════════ */
    {
      title: 'Chapter 6 — Services, threads, fragments & maps|||Chương 6 — Service, luồng, fragment & maps',
      description: 'Session 35-44, 51-52: Service, đa luồng (Executor), Fragment, Google Maps/vị trí và BroadcastReceiver (CLO3).',
      lessons: [
        {
          title: '6.1 — Background work: Services & threads (Executor)|||6.1 — Việc nền: Service & luồng (Executor)',
          slug: 'prm392-6-1-threads',
          type: 'VIDEO',
          description: 'Vì sao I/O phải rời main thread, dùng ExecutorService + Handler để chạy nền rồi cập nhật UI đúng cách.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Keep the main thread free — do work in the background, update UI safely</h2>
<p class="lead">Android has one <strong>main (UI) thread</strong>. If you block it for more than ~5 seconds you get an <strong>ANR</strong>; even a short freeze feels janky. So all network, database and heavy work goes on a <em>background thread</em> — but <strong>only the main thread may touch Views</strong>.</p>
<div class="out"><strong>ExecutorService — background work + main-thread UI update</strong>
ExecutorService io = Executors.newSingleThreadExecutor();
Handler main = new Handler(Looper.getMainLooper());

io.execute(() -&gt; {
    List&lt;Product&gt; data = db.productDao().cheaperThan(50000);   // background
    main.post(() -&gt; adapter.submit(data));                     // back to UI
});</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Executor</div><div class="lz-d">run I/O off UI thread</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Do work</div><div class="lz-d">DB / network / parse</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Handler.post</div><div class="lz-d">hop back to main</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Update Views</div><div class="lz-d">on UI thread only</div></div>
</div>
<h3>Services — work without a UI</h3>
<p>A <strong>Service</strong> runs background work with no screen (play music, sync). Note a plain Service still runs on the main thread — you still spawn a worker thread inside it. For long/deferrable jobs, modern Android prefers <strong>WorkManager</strong> over raw Services.</p>
<div class="pitfall"><strong>Touching a View from a background thread crashes.</strong> "CalledFromWrongThreadException: Only the original thread that created a view hierarchy can touch its views." Do the work in the background, then post the UI update back to the main thread (Handler / runOnUiThread).</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%206.1#module-253" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java multithreading & concurrency</span><span class="lc-sub">java-core · module 253 · Executor/Runnable used here</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>WorkManager & foreground services.</b> For guaranteed, deferrable background work (sync when online, periodic upload) that survives app death and reboots, use <em>WorkManager</em>. For ongoing user-visible work (music, navigation) use a <em>foreground service</em> with a persistent notification. Choosing the right background mechanism is a modern skill the syllabus predates. <em>Beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Giữ main thread rảnh — làm việc ở nền, cập nhật UI an toàn</h2>
<p class="lead">Android có một <strong>main (UI) thread</strong> duy nhất. Nếu bạn chặn nó quá ~5 giây bạn nhận <strong>ANR</strong>; kể cả một khựng ngắn cũng thấy giật. Nên mọi việc mạng, cơ sở dữ liệu và việc nặng đi trên <em>thread nền</em> — nhưng <strong>chỉ main thread được chạm View</strong>.</p>
<div class="out"><strong>ExecutorService — việc nền + cập nhật UI trên main thread</strong>
ExecutorService io = Executors.newSingleThreadExecutor();
Handler main = new Handler(Looper.getMainLooper());

io.execute(() -&gt; {
    List&lt;Product&gt; data = db.productDao().cheaperThan(50000);   // nền
    main.post(() -&gt; adapter.submit(data));                     // về UI
});</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Executor</div><div class="lz-d">chạy I/O ngoài UI thread</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Làm việc</div><div class="lz-d">DB / mạng / parse</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Handler.post</div><div class="lz-d">nhảy về main</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Cập nhật View</div><div class="lz-d">chỉ trên UI thread</div></div>
</div>
<h3>Service — việc không có UI</h3>
<p>Một <strong>Service</strong> chạy việc nền không màn hình (phát nhạc, đồng bộ). Lưu ý một Service thường vẫn chạy trên main thread — bạn vẫn phải sinh một worker thread bên trong nó. Với việc dài/trì hoãn được, Android hiện đại ưu tiên <strong>WorkManager</strong> hơn Service thô.</p>
<div class="pitfall"><strong>Chạm View từ thread nền gây crash.</strong> "CalledFromWrongThreadException: Only the original thread that created a view hierarchy can touch its views." Làm việc ở nền, rồi post cập nhật UI về main thread (Handler / runOnUiThread).</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%206.1#module-253" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — Java multithreading & concurrency</span><span class="lc-sub">java-core · module 253 · Executor/Runnable dùng ở đây</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>WorkManager & foreground service.</b> Với việc nền đảm bảo, trì hoãn được (đồng bộ khi online, tải định kỳ) sống sót qua app chết và khởi động lại, dùng <em>WorkManager</em>. Với việc người dùng thấy đang chạy (nhạc, dẫn đường) dùng <em>foreground service</em> có notification thường trực. Chọn đúng cơ chế nền là kỹ năng hiện đại syllabus có trước. <em>Ngoài syllabus.</em></div>
</div>`,
        },
        {
          title: '6.2 — Fragments, maps & broadcast receivers|||6.2 — Fragment, maps & broadcast receiver',
          slug: 'prm392-6-2-fragments',
          type: 'VIDEO',
          description: 'Fragment là màn con tái dùng trong Activity, giao tiếp Fragment↔Activity, Google Maps/vị trí và BroadcastReceiver.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Fragments split screens; maps & broadcasts add platform power</h2>
<p class="lead">A <strong>Fragment</strong> is a reusable, self-contained piece of a screen with its own lifecycle, hosted inside an Activity. Fragments enable one-Activity apps with bottom-navigation and adapt to tablets (list + detail side by side).</p>
<div class="out"><strong>Fragment ↔ Activity: talk via a shared ViewModel or an interface</strong>
// The modern way: both observe a ViewModel scoped to the Activity
MainViewModel vm = new ViewModelProvider(requireActivity())
                       .get(MainViewModel.class);
vm.selected().observe(getViewLifecycleOwner(), item -&gt; render(item));
// Fragment A sets vm.select(item); Fragment B observes it — decoupled.</div>
<div class="pitfall"><strong>Don't hold an Activity reference in a Fragment, and use getViewLifecycleOwner for UI observers.</strong> Fragments outlive their Views (during transactions); observing with the Fragment lifecycle instead of the <em>view</em> lifecycle leaks Views and crashes on back-stack navigation.</div>
<h3>Google Maps & location</h3>
<p>Show a map with the &#96;SupportMapFragment&#96; + a Maps API key, and get the device position via the <strong>Fused Location Provider</strong> — after requesting the runtime location permission (Chapter 4).</p>
<h3>BroadcastReceiver — react to events</h3>
<p>A <strong>BroadcastReceiver</strong> listens for system or app broadcasts (connectivity change, battery low, boot completed). Register it in the manifest (for some system events) or dynamically in code (register in onResume, unregister in onPause).</p>
<div class="callout ok"><strong>Fragments make the project scalable.</strong> A single-Activity app with a few fragments and bottom navigation is the pattern most PRM392 projects should adopt — it's cleaner than a dozen Activities and matches how modern apps are built.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Navigation Component.</b> Instead of manual FragmentTransactions, the Jetpack <em>Navigation Component</em> defines your screens and their connections in a visual graph, handles the back stack and argument passing safely, and pairs with bottom navigation out of the box. It's the current recommended way to move between fragments. <em>Beyond the syllabus but a big project-quality win.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Fragment chia màn hình; maps & broadcast thêm sức mạnh nền tảng</h2>
<p class="lead">Một <strong>Fragment</strong> là một mảnh màn hình tái dùng, khép kín với vòng đời riêng, được chứa trong một Activity. Fragment cho phép app một-Activity với bottom-navigation và thích ứng máy tính bảng (danh sách + chi tiết cạnh nhau).</p>
<div class="out"><strong>Fragment ↔ Activity: nói chuyện qua ViewModel chung hoặc interface</strong>
// Cách hiện đại: cả hai quan sát một ViewModel phạm vi Activity
MainViewModel vm = new ViewModelProvider(requireActivity())
                       .get(MainViewModel.class);
vm.selected().observe(getViewLifecycleOwner(), item -&gt; render(item));
// Fragment A gọi vm.select(item); Fragment B quan sát — tách rời.</div>
<div class="pitfall"><strong>Đừng giữ tham chiếu Activity trong Fragment, và dùng getViewLifecycleOwner cho observer UI.</strong> Fragment sống lâu hơn View của nó (trong transaction); quan sát bằng vòng đời Fragment thay vì vòng đời <em>view</em> làm rò View và crash khi điều hướng back-stack.</div>
<h3>Google Maps & vị trí</h3>
<p>Hiện bản đồ bằng &#96;SupportMapFragment&#96; + một Maps API key, và lấy vị trí thiết bị qua <strong>Fused Location Provider</strong> — sau khi xin permission vị trí lúc chạy (Chương 4).</p>
<h3>BroadcastReceiver — phản ứng sự kiện</h3>
<p>Một <strong>BroadcastReceiver</strong> lắng nghe broadcast hệ thống hoặc app (đổi kết nối, pin yếu, khởi động xong). Đăng ký nó trong manifest (cho vài sự kiện hệ thống) hoặc động trong code (đăng ký ở onResume, huỷ ở onPause).</p>
<div class="callout ok"><strong>Fragment làm project mở rộng được.</strong> Một app một-Activity với vài fragment và bottom navigation là mẫu đa số project PRM392 nên dùng — sạch hơn cả chục Activity và khớp cách app hiện đại được xây.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Navigation Component.</b> Thay vì FragmentTransaction thủ công, <em>Navigation Component</em> của Jetpack định nghĩa các màn và liên kết trong một đồ thị trực quan, xử lý back stack và truyền tham số an toàn, và ghép sẵn với bottom navigation. Đây là cách khuyến nghị hiện hành để chuyển giữa các fragment. <em>Ngoài syllabus nhưng nâng chất project rõ rệt.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Doing a long network call on the main thread causes:|||Gọi mạng lâu trên main thread gây:',
                options: [
                  'Faster UI|||UI nhanh hơn',
                  'An ANR / frozen UI|||Một ANR / UI đơ',
                  'Better battery|||Pin tốt hơn',
                  'Automatic threading|||Tự động phân luồng',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'After doing work on a background thread, to update a TextView you must:|||Sau khi làm việc trên thread nền, để cập nhật một TextView bạn phải:',
                options: [
                  'Update it directly from the background thread|||Cập nhật thẳng từ thread nền',
                  'Post back to the main thread (Handler / runOnUiThread)|||Post về main thread (Handler / runOnUiThread)',
                  'Restart the app|||Khởi động lại app',
                  'Use a ContentProvider|||Dùng ContentProvider',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Touching a View from a background thread throws:|||Chạm một View từ thread nền ném:',
                options: [
                  'NullPointerException',
                  'CalledFromWrongThreadException',
                  'FileNotFoundException',
                  'Nothing|||Không gì cả',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A Fragment is best described as:|||Một Fragment được mô tả đúng nhất là:',
                options: [
                  'A background service|||Một service nền',
                  'A reusable, self-contained part of a screen hosted in an Activity|||Một phần màn hình tái dùng, khép kín, chứa trong một Activity',
                  'A database table|||Một bảng cơ sở dữ liệu',
                  'A permission|||Một permission',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'A BroadcastReceiver is used to:|||Một BroadcastReceiver dùng để:',
                options: [
                  'Draw maps|||Vẽ bản đồ',
                  'React to system/app events like connectivity or battery changes|||Phản ứng sự kiện hệ thống/app như đổi kết nối hay pin',
                  'Store structured data|||Lưu dữ liệu có cấu trúc',
                  'Inflate layouts|||Dựng layout',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — NETWORKING ══════════════════ */
    {
      title: 'Chapter 7 — Networking: Retrofit & web services|||Chương 7 — Mạng: Retrofit & web service',
      description: 'Session 45-50: gọi REST API bằng Retrofit, ánh xạ JSON, và lập trình socket (CLO4).',
      lessons: [
        {
          title: '7.1 — Consuming a REST API with Retrofit|||7.1 — Gọi REST API bằng Retrofit',
          slug: 'prm392-7-1-retrofit',
          type: 'VIDEO',
          description: 'Định nghĩa API bằng interface + annotation, ánh xạ JSON sang model bằng Gson, và gọi bất đồng bộ đúng luồng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Retrofit turns a REST API into a Java interface (CLO4)</h2>
<p class="lead">Most real apps read data from a server over HTTP. <strong>Retrofit</strong> (by Square) lets you describe the API as a Java <em>interface</em> with annotations; it generates the networking code and converts JSON to your model objects with Gson.</p>
<div class="out"><strong>1) Model + 2) API interface + 3) client</strong>
// model — field names match the JSON keys
class Product { int id; String name; int price; }

// API description
interface ApiService {
    @GET("products")
    Call&lt;List&lt;Product&gt;&gt; getProducts();

    @GET("products/{id}")
    Call&lt;Product&gt; getProduct(@Path("id") int id);
}

// build the client once
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();
ApiService api = retrofit.create(ApiService.class);</div>
<div class="out"><strong>Call asynchronously — Retrofit gives you the result on the main thread</strong>
api.getProducts().enqueue(new Callback&lt;List&lt;Product&gt;&gt;() {
    @Override public void onResponse(Call&lt;List&lt;Product&gt;&gt; c,
                                     Response&lt;List&lt;Product&gt;&gt; r) {
        if (r.isSuccessful()) adapter.submit(r.body());   // update UI
        else showError("HTTP " + r.code());
    }
    @Override public void onFailure(Call&lt;List&lt;Product&gt;&gt; c, Throwable t) {
        showError("Network error: " + t.getMessage());
    }
});</div>
<div class="pitfall"><strong>Add the INTERNET permission and handle both failure paths.</strong> Forgetting &#96;&lt;uses-permission android:name="android.permission.INTERNET"/&gt;&#96; makes every call fail. And &#96;onResponse&#96; firing does not mean success — check &#96;isSuccessful()&#96; (a 404/500 still calls onResponse); &#96;onFailure&#96; is only for no-network/timeout.</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%207.1#module-526" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — REST fundamentals & HTTP</span><span class="lc-sub">rest-apis · module 526 · the HTTP model Retrofit speaks</span></span>
  <span class="lc-cta">Practise →</span>
</a>
<div class="callout ok"><strong>&#96;enqueue&#96; is asynchronous.</strong> It does the network on a background thread and calls you back on the main thread, so you can update Views directly in &#96;onResponse&#96;. (&#96;execute()&#96; is synchronous and would block the UI — never call it on the main thread.)</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Interceptors, auth headers & error bodies.</b> A Retrofit/OkHttp <em>interceptor</em> lets you attach an auth token to every request, log traffic, or retry — in one place instead of per-call. Pair it with a sealed &#96;Result&#96; type so the UI cleanly renders loading/success/error states. <em>Production networking hygiene beyond the syllabus.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Retrofit biến một REST API thành một interface Java (CLO4)</h2>
<p class="lead">Đa số app thật đọc dữ liệu từ máy chủ qua HTTP. <strong>Retrofit</strong> (của Square) cho bạn mô tả API dưới dạng một <em>interface</em> Java với annotation; nó sinh code mạng và chuyển JSON thành các đối tượng model của bạn bằng Gson.</p>
<div class="out"><strong>1) Model + 2) interface API + 3) client</strong>
// model — tên field khớp key JSON
class Product { int id; String name; int price; }

// mô tả API
interface ApiService {
    @GET("products")
    Call&lt;List&lt;Product&gt;&gt; getProducts();

    @GET("products/{id}")
    Call&lt;Product&gt; getProduct(@Path("id") int id);
}

// dựng client một lần
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build();
ApiService api = retrofit.create(ApiService.class);</div>
<div class="out"><strong>Gọi bất đồng bộ — Retrofit trả kết quả trên main thread</strong>
api.getProducts().enqueue(new Callback&lt;List&lt;Product&gt;&gt;() {
    @Override public void onResponse(Call&lt;List&lt;Product&gt;&gt; c,
                                     Response&lt;List&lt;Product&gt;&gt; r) {
        if (r.isSuccessful()) adapter.submit(r.body());   // cập nhật UI
        else showError("HTTP " + r.code());
    }
    @Override public void onFailure(Call&lt;List&lt;Product&gt;&gt; c, Throwable t) {
        showError("Lỗi mạng: " + t.getMessage());
    }
});</div>
<div class="pitfall"><strong>Thêm permission INTERNET và xử lý cả hai nhánh lỗi.</strong> Quên &#96;&lt;uses-permission android:name="android.permission.INTERNET"/&gt;&#96; làm mọi lời gọi thất bại. Và &#96;onResponse&#96; chạy không có nghĩa là thành công — kiểm &#96;isSuccessful()&#96; (404/500 vẫn gọi onResponse); &#96;onFailure&#96; chỉ dành cho không-mạng/timeout.</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fmobile-programming%2Flearn&reflabel=PRM392%20·%207.1#module-526" >
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Code Lab — REST fundamentals & HTTP</span><span class="lc-sub">rest-apis · module 526 · mô hình HTTP Retrofit nói</span></span>
  <span class="lc-cta">Luyện →</span>
</a>
<div class="callout ok"><strong>&#96;enqueue&#96; là bất đồng bộ.</strong> Nó làm mạng trên thread nền và gọi lại bạn trên main thread, nên bạn cập nhật View thẳng trong &#96;onResponse&#96;. (&#96;execute()&#96; là đồng bộ và sẽ chặn UI — đừng bao giờ gọi trên main thread.)</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Interceptor, header auth & body lỗi.</b> Một <em>interceptor</em> Retrofit/OkHttp cho bạn gắn token auth vào mọi request, ghi log traffic, hoặc thử lại — ở một nơi thay vì từng call. Ghép nó với một kiểu &#96;Result&#96; để UI render sạch trạng thái loading/success/error. <em>Vệ sinh mạng production ngoài syllabus.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'In Retrofit, you describe a REST API as:|||Trong Retrofit, bạn mô tả một REST API dưới dạng:',
                options: [
                  'A SQL table|||Một bảng SQL',
                  'A Java interface with annotations (@GET, @Path...)|||Một interface Java với annotation (@GET, @Path...)',
                  'An XML layout|||Một layout XML',
                  'A BroadcastReceiver|||Một BroadcastReceiver',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'What converts JSON responses into your model objects in the example?|||Cái gì chuyển phản hồi JSON thành đối tượng model trong ví dụ?',
                options: [
                  'SQLite|||SQLite',
                  'GsonConverterFactory|||GsonConverterFactory',
                  'The manifest|||Manifest',
                  'RecyclerView|||RecyclerView',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'Which permission must be declared to make network calls?|||Permission nào phải khai để gọi mạng?',
                options: ['CAMERA', 'INTERNET', 'ACCESS_FINE_LOCATION', 'READ_CONTACTS'],
                correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A Retrofit onResponse fires with HTTP 404. This means:|||Retrofit onResponse chạy với HTTP 404. Điều này nghĩa là:',
                options: [
                  'Success, use the body|||Thành công, dùng body',
                  'The call reached the server but you must still check isSuccessful()|||Lời gọi tới được server nhưng bạn vẫn phải kiểm isSuccessful()',
                  'The device has no network|||Thiết bị không có mạng',
                  'The app will crash|||App sẽ crash',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'enqueue(...) differs from execute() in that enqueue:|||enqueue(...) khác execute() ở chỗ enqueue:',
                options: [
                  'Blocks the main thread|||Chặn main thread',
                  'Runs the request asynchronously and calls back on the main thread|||Chạy request bất đồng bộ và gọi lại trên main thread',
                  'Deletes the request|||Xoá request',
                  'Requires no internet|||Không cần internet',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — ARCHITECTURE & PROJECT ══════════════════ */
    {
      title: 'Chapter 8 — Architecture (MVC/MVP/MVVM) & the project|||Chương 8 — Kiến trúc (MVC/MVP/MVVM) & đồ án',
      description: 'Session 53-56: tổ chức code theo MVC/MVP/MVVM với ViewModel + LiveData, và ráp thành đồ án nhóm (CLO5).',
      lessons: [
        {
          title: '8.1 — MVC vs MVP vs MVVM + the team project|||8.1 — MVC vs MVP vs MVVM + đồ án nhóm',
          slug: 'prm392-8-1-architecture',
          type: 'VIDEO',
          description: 'Vì sao tách UI khỏi logic, ba mẫu kiến trúc phổ biến, và MVVM với ViewModel/LiveData là chuẩn Android hiện đại (CLO5).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Separate UI from logic so the app is testable and survives rotation (CLO5)</h2>
<p class="lead">Putting all code in the Activity ("God Activity") becomes unmaintainable and loses state on rotation. Architecture patterns <strong>separate concerns</strong>: what the data is (Model), what's shown (View), and the logic in between.</p>
<table>
<thead><tr><th>Pattern</th><th>Middle layer</th><th>Note</th></tr></thead>
<tbody>
<tr><td>MVC</td><td>Controller</td><td>Activity often acts as both View + Controller → muddy</td></tr>
<tr><td>MVP</td><td>Presenter</td><td>Presenter holds a View interface; testable, but lots of boilerplate</td></tr>
<tr><td>MVVM</td><td>ViewModel</td><td>View observes ViewModel; survives rotation; Google-recommended</td></tr>
</tbody>
</table>
<h3>MVVM in Android = ViewModel + LiveData</h3>
<div class="out"><strong>ViewModel survives configuration changes; LiveData pushes updates to the UI</strong>
class ProductViewModel extends ViewModel {
    private final MutableLiveData&lt;List&lt;Product&gt;&gt; products =
        new MutableLiveData&lt;&gt;();
    LiveData&lt;List&lt;Product&gt;&gt; getProducts() { return products; }

    void load() {                    // called once; not lost on rotation
        repo.fetch(products::postValue);
    }
}
// In the Activity/Fragment:
vm.getProducts().observe(this, list -&gt; adapter.submit(list));
vm.load();</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">View</span> Activity/Fragment — only displays state &amp; forwards user events. No business logic.</div>
  <div class="lz-layer"><span class="lz-lk">ViewModel</span> Holds UI state in LiveData; survives rotation; calls the repository. No View references.</div>
  <div class="lz-layer"><span class="lz-lk">Repository / Model</span> Single source of truth: Room + Retrofit behind one clean API.</div>
</div>
<div class="pitfall"><strong>Never keep a View or Context reference in a ViewModel.</strong> The ViewModel outlives the Activity across rotation; holding the old Activity leaks it and can crash. Expose state via LiveData and let the View observe.</div>
<h3>Wiring it into the 30% project</h3>
<p>A strong PRM392 project layers cleanly: Room (data) → Repository → ViewModel (state) → Activity/Fragment (UI), with Retrofit for one network feature. Everyone on the team owns a vertical slice (one screen end-to-end) so all can defend the code.</p>
<div class="callout ok"><strong>MVVM is what the exam and the market want.</strong> CLO5 asks you to "demonstrate Android architecture." Be able to draw the MVVM diagram and explain why ViewModel survives rotation and why LiveData avoids manual refresh — it's a favorite exam and defense question.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Repository + single source of truth.</b> The professional MVVM adds a <em>Repository</em> that decides whether to serve cached Room data or fetch from Retrofit, exposing one clean stream to the ViewModel. The UI shows local data instantly and updates when the network returns — the "offline-first" pattern behind apps that feel fast. <em>Beyond the syllabus but the mark of a mature architecture.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Tách UI khỏi logic để app kiểm thử được và sống sót khi xoay (CLO5)</h2>
<p class="lead">Nhét mọi code vào Activity ("God Activity") trở nên không bảo trì nổi và mất state khi xoay. Các mẫu kiến trúc <strong>tách mối quan tâm</strong>: dữ liệu là gì (Model), hiện gì (View), và logic ở giữa.</p>
<table>
<thead><tr><th>Mẫu</th><th>Lớp giữa</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>MVC</td><td>Controller</td><td>Activity thường vừa là View vừa Controller → lộn xộn</td></tr>
<tr><td>MVP</td><td>Presenter</td><td>Presenter giữ một interface View; kiểm thử được, nhưng nhiều boilerplate</td></tr>
<tr><td>MVVM</td><td>ViewModel</td><td>View quan sát ViewModel; sống sót khi xoay; Google khuyến nghị</td></tr>
</tbody>
</table>
<h3>MVVM trong Android = ViewModel + LiveData</h3>
<div class="out"><strong>ViewModel sống sót thay đổi cấu hình; LiveData đẩy cập nhật tới UI</strong>
class ProductViewModel extends ViewModel {
    private final MutableLiveData&lt;List&lt;Product&gt;&gt; products =
        new MutableLiveData&lt;&gt;();
    LiveData&lt;List&lt;Product&gt;&gt; getProducts() { return products; }

    void load() {                    // gọi một lần; không mất khi xoay
        repo.fetch(products::postValue);
    }
}
// Trong Activity/Fragment:
vm.getProducts().observe(this, list -&gt; adapter.submit(list));
vm.load();</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">View</span> Activity/Fragment — chỉ hiển thị state &amp; chuyển tiếp sự kiện người dùng. Không logic nghiệp vụ.</div>
  <div class="lz-layer"><span class="lz-lk">ViewModel</span> Giữ state UI trong LiveData; sống sót khi xoay; gọi repository. Không tham chiếu View.</div>
  <div class="lz-layer"><span class="lz-lk">Repository / Model</span> Nguồn sự thật duy nhất: Room + Retrofit sau một API sạch.</div>
</div>
<div class="pitfall"><strong>Đừng bao giờ giữ tham chiếu View hay Context trong ViewModel.</strong> ViewModel sống lâu hơn Activity qua lần xoay; giữ Activity cũ làm rò nó và có thể crash. Phơi state qua LiveData và để View quan sát.</div>
<h3>Ráp vào đồ án 30%</h3>
<p>Một project PRM392 mạnh phân lớp sạch: Room (dữ liệu) → Repository → ViewModel (state) → Activity/Fragment (UI), với Retrofit cho một tính năng mạng. Mỗi người trong đội sở hữu một lát cắt dọc (một màn đầu-cuối) để tất cả bảo vệ được code.</p>
<div class="callout ok"><strong>MVVM là thứ bài thi và thị trường muốn.</strong> CLO5 yêu cầu bạn "trình bày kiến trúc Android". Hãy vẽ được sơ đồ MVVM và giải thích vì sao ViewModel sống sót khi xoay và vì sao LiveData tránh refresh thủ công — đây là câu thi và câu bảo vệ được ưa chuộng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Repository + nguồn sự thật duy nhất.</b> MVVM chuyên nghiệp thêm một <em>Repository</em> quyết định phục vụ dữ liệu Room cache hay tải từ Retrofit, phơi một luồng sạch tới ViewModel. UI hiện dữ liệu cục bộ tức thì và cập nhật khi mạng trả về — mẫu "offline-first" đằng sau các app thấy nhanh. <em>Ngoài syllabus nhưng là dấu hiệu kiến trúc chín.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Why separate UI from logic with an architecture pattern?|||Vì sao tách UI khỏi logic bằng một mẫu kiến trúc?',
                options: [
                  'To make the app slower|||Để app chậm hơn',
                  'For maintainability, testability, and surviving config changes|||Để dễ bảo trì, kiểm thử, và sống sót thay đổi cấu hình',
                  'Because Java requires it|||Vì Java bắt buộc',
                  'To hide the code|||Để giấu code',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'In Android MVVM, which component survives a screen rotation?|||Trong MVVM Android, component nào sống sót một lần xoay màn hình?',
                options: ['The Activity|||Activity', 'The ViewModel|||ViewModel', 'The layout XML|||Layout XML', 'The Toast|||Toast'],
                correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'LiveData helps the UI by:|||LiveData giúp UI bằng cách:',
                options: [
                  'Blocking the main thread|||Chặn main thread',
                  'Pushing updates to observers so the View refreshes automatically|||Đẩy cập nhật tới observer để View tự refresh',
                  'Storing files|||Lưu tệp',
                  'Drawing maps|||Vẽ bản đồ',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'A ViewModel must NOT hold:|||Một ViewModel KHÔNG được giữ:',
                options: [
                  'LiveData|||LiveData',
                  'A reference to a View or Activity Context|||Một tham chiếu tới View hay Activity Context',
                  'A repository|||Một repository',
                  'A list of data|||Một danh sách dữ liệu',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: '(Beyond syllabus) In a Repository "single source of truth" pattern, the UI typically:|||(Ngoài giáo trình) Trong mẫu Repository "nguồn sự thật duy nhất", UI thường:',
                options: [
                  'Waits for the network before showing anything|||Đợi mạng trước khi hiện gì',
                  'Shows cached local data instantly, then updates when the network returns|||Hiện dữ liệu cục bộ cache tức thì, rồi cập nhật khi mạng trả về',
                  'Never uses a database|||Không bao giờ dùng cơ sở dữ liệu',
                  'Ignores errors|||Bỏ qua lỗi',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — ÔN THI (EXAM PREP) ══════════════════ */
    {
      title: 'Chapter 9 — Exam prep: question bank, code reading & defense|||Chương 9 — Ôn thi: ngân hàng câu hỏi, đọc code & bảo vệ',
      description: 'Ngân hàng câu hỏi theo CLO cho Final + luyện Practical Exam + ngân hàng câu vấn đáp bảo vệ project.',
      lessons: [
        {
          title: '9.1 — Final/Practical question bank + defense Q&A|||9.1 — Ngân hàng câu Final/Practical + vấn đáp bảo vệ',
          slug: 'prm392-9-1-exam-prep',
          type: 'article',
          description: 'Câu hỏi ôn theo từng CLO, checklist luyện Practical Exam 90 phút, và ngân hàng câu hỏi giám khảo hỏi khi bảo vệ project.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Prepare for the gated Final (40%), the live Practical (15%) and the project defense</h2>
<p class="lead">Two exams have a ≥4 gate. The Final mixes theory with <em>reading code</em>; the Practical asks you to <em>write</em> a feature live. And the project (30%) ends in a defense where anyone may be asked to explain any line. Prepare all three.</p>

<h3>Self-check question bank (by CLO)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">CLO1 Platform</span> Name the 4 components. What's in the manifest? What is the R class? Why no main()?</div>
  <div class="lz-layer"><span class="lz-lk">CLO2 UI/events</span> LinearLayout vs ConstraintLayout? dp vs sp? What thread do click listeners run on?</div>
  <div class="lz-layer"><span class="lz-lk">CLO3 Components</span> Order the lifecycle. What happens on rotation? Explicit vs implicit intent. RecyclerView's 3 adapter methods. Why request permissions at runtime?</div>
  <div class="lz-layer"><span class="lz-lk">CLO4 Data/network</span> When Prefs vs SQLite vs Room? Why can't Room run on the main thread? What does Retrofit generate? INTERNET permission.</div>
  <div class="lz-layer"><span class="lz-lk">CLO5 Architecture</span> MVC vs MVP vs MVVM. Why does ViewModel survive rotation? Why must it not hold a View?</div>
</div>

<h3>Practical Exam drill (90', from a blank Activity)</h3>
<div class="out"><strong>Rehearse these end-to-end WITHOUT notes:</strong>
1. A screen with an EditText + Button + RecyclerView.
2. Add a Room entity + DAO; insert on button tap (on a background thread).
3. Show all rows in the RecyclerView via an Adapter.
4. Tap a row → open a DetailActivity via an explicit intent passing the id.
If you can build this blind in ~40', the Practical holds no surprises.</div>

<h3>Project defense — question bank the examiner asks</h3>
<table>
<thead><tr><th>Area</th><th>Likely question</th></tr></thead>
<tbody>
<tr><td>Architecture</td><td>"Show me your ViewModel — why is this logic not in the Activity?"</td></tr>
<tr><td>Data</td><td>"Where is data persisted? Show the Room entity and a query."</td></tr>
<tr><td>Threading</td><td>"This network/DB call — what thread runs it, and why?"</td></tr>
<tr><td>Lifecycle</td><td>"What happens to this screen on rotation? Do you lose data?"</td></tr>
<tr><td>Permissions</td><td>"How do you handle the user denying location?"</td></tr>
<tr><td>Contribution</td><td>"Which parts did YOU write? Explain this method."</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>"My teammate wrote that part" fails the defense.</strong> Marks are individual at the defense. If you can't explain a screen you're credited for, you lose points even if the app is great. Everyone must own — and be able to walk through — their vertical slice.</div>
<div class="formula"><span class="lbl">PACING (Final 60')</span> read each code snippet twice · eliminate wrong options · flag &amp; return; never leave the gated Final blank</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Answer "what should the app do here" like an engineer.</b> On lifecycle/threading questions, the correct option almost always <em>respects the platform's rules</em> — do I/O off the main thread, save state for rotation, check permissions before use. When two options look plausible, pick the one that cooperates with Android's lifecycle and threading model. <em>A reliable exam reflex.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Chuẩn bị cho Final có cổng (40%), Practical trực tiếp (15%) và bảo vệ project</h2>
<p class="lead">Hai bài thi có cổng ≥4. Final trộn lý thuyết với <em>đọc code</em>; Practical yêu cầu bạn <em>viết</em> một tính năng tại chỗ. Và project (30%) kết bằng buổi bảo vệ nơi bất kỳ ai cũng có thể bị hỏi giải thích bất kỳ dòng nào. Chuẩn bị cả ba.</p>

<h3>Ngân hàng câu tự kiểm (theo CLO)</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lk">CLO1 Nền tảng</span> Kể 4 component. Manifest chứa gì? Lớp R là gì? Vì sao không có main()?</div>
  <div class="lz-layer"><span class="lz-lk">CLO2 UI/sự kiện</span> LinearLayout vs ConstraintLayout? dp vs sp? Click listener chạy trên thread nào?</div>
  <div class="lz-layer"><span class="lz-lk">CLO3 Component</span> Sắp thứ tự vòng đời. Xoay màn xảy ra gì? Intent tường minh vs ngầm. 3 phương thức adapter của RecyclerView. Vì sao xin permission lúc chạy?</div>
  <div class="lz-layer"><span class="lz-lk">CLO4 Dữ liệu/mạng</span> Khi nào Prefs vs SQLite vs Room? Vì sao Room không chạy trên main thread? Retrofit sinh ra gì? Permission INTERNET.</div>
  <div class="lz-layer"><span class="lz-lk">CLO5 Kiến trúc</span> MVC vs MVP vs MVVM. Vì sao ViewModel sống sót khi xoay? Vì sao nó không được giữ View?</div>
</div>

<h3>Luyện Practical Exam (90', từ Activity trống)</h3>
<div class="out"><strong>Tập các bước đầu-cuối KHÔNG nhìn ghi chú:</strong>
1. Một màn có EditText + Button + RecyclerView.
2. Thêm một Room entity + DAO; insert khi bấm nút (trên thread nền).
3. Hiện mọi hàng trong RecyclerView qua một Adapter.
4. Chạm một hàng → mở DetailActivity qua intent tường minh truyền id.
Nếu bạn dựng được cái này không nhìn trong ~40', Practical không còn bất ngờ.</div>

<h3>Bảo vệ project — ngân hàng câu giám khảo hỏi</h3>
<table>
<thead><tr><th>Mảng</th><th>Câu hỏi hay gặp</th></tr></thead>
<tbody>
<tr><td>Kiến trúc</td><td>"Cho tôi xem ViewModel — vì sao logic này không nằm trong Activity?"</td></tr>
<tr><td>Dữ liệu</td><td>"Dữ liệu lưu ở đâu? Cho xem Room entity và một truy vấn."</td></tr>
<tr><td>Luồng</td><td>"Lời gọi mạng/DB này — thread nào chạy, và vì sao?"</td></tr>
<tr><td>Vòng đời</td><td>"Màn này ra sao khi xoay? Có mất dữ liệu không?"</td></tr>
<tr><td>Permission</td><td>"Bạn xử lý thế nào khi người dùng từ chối vị trí?"</td></tr>
<tr><td>Đóng góp</td><td>"Phần nào do BẠN viết? Giải thích phương thức này."</td></tr>
</tbody>
</table>
<div class="pitfall"><strong>"Bạn cùng nhóm viết phần đó" là trượt buổi bảo vệ.</strong> Điểm bảo vệ là cá nhân. Nếu bạn không giải thích được một màn được ghi tên bạn, bạn mất điểm dù app tuyệt. Ai cũng phải sở hữu — và đi qua được — lát cắt dọc của mình.</div>
<div class="formula"><span class="lbl">NHỊP ĐỘ (Final 60')</span> đọc mỗi đoạn code hai lần · loại phương án sai · đánh dấu &amp; quay lại; không bỏ trống Final có cổng</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trả lời "app nên làm gì ở đây" như một kỹ sư.</b> Với câu vòng đời/luồng, phương án đúng gần như luôn <em>tôn trọng luật nền tảng</em> — làm I/O ngoài main thread, lưu state cho xoay màn, kiểm permission trước khi dùng. Khi hai phương án đều hợp lý, chọn cái hợp tác với mô hình vòng đời và luồng của Android. <em>Một phản xạ thi đáng tin.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'The correct Activity lifecycle order when a screen starts is:|||Thứ tự vòng đời Activity đúng khi màn hình khởi động là:',
                options: [
                  'onResume → onCreate → onStart|||onResume → onCreate → onStart',
                  'onCreate → onStart → onResume|||onCreate → onStart → onResume',
                  'onStart → onResume → onCreate|||onStart → onResume → onCreate',
                  'onDestroy → onCreate → onStart|||onDestroy → onCreate → onStart',
                ], correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'On the gated Final (needs ≥4), the smartest habit for code-reading MCQs is:|||Với Final có cổng (cần ≥4), thói quen khôn nhất cho câu đọc code trắc nghiệm là:',
                options: [
                  'Leave hard ones blank|||Bỏ trống câu khó',
                  'Read the snippet twice, eliminate wrong options, flag & return|||Đọc đoạn code hai lần, loại phương án sai, đánh dấu & quay lại',
                  'Answer only theory|||Chỉ trả lời lý thuyết',
                  'Guess randomly|||Đoán ngẫu nhiên',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'At the project defense, marks are:|||Ở buổi bảo vệ project, điểm là:',
                options: [
                  'Shared equally no matter what|||Chia đều bất kể thế nào',
                  'Individual — you must explain the parts credited to you|||Cá nhân — bạn phải giải thích phần được ghi tên bạn',
                  'Only for the team leader|||Chỉ cho nhóm trưởng',
                  'Based on app size|||Theo kích cỡ app',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'For the 90-minute Practical Exam, the best preparation is:|||Cho Practical Exam 90 phút, chuẩn bị tốt nhất là:',
                options: [
                  'Memorize the whole textbook|||Học thuộc cả giáo trình',
                  'Rehearse building a small feature end-to-end from a blank Activity, no notes|||Tập dựng một tính năng nhỏ đầu-cuối từ Activity trống, không ghi chú',
                  'Only read code, never write it|||Chỉ đọc code, không bao giờ viết',
                  'Copy a tutorial the night before|||Chép tutorial đêm trước',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'A network call in your project should run on:|||Một lời gọi mạng trong project của bạn nên chạy trên:',
                options: [
                  'The main/UI thread|||Main/UI thread',
                  'A background thread, updating the UI back on the main thread|||Một thread nền, cập nhật UI về main thread',
                  'The database thread only|||Chỉ thread cơ sở dữ liệu',
                  'No thread|||Không thread nào',
                ], correctIndex: 1,
              },
              {
                id: 'q6', points: 1,
                question: '(Judgment) When two exam options seem plausible on a lifecycle question, prefer the one that:|||(Phán đoán) Khi hai phương án đều hợp lý ở câu vòng đời, ưu tiên cái:',
                options: [
                  'Ignores the platform rules|||Phớt lờ luật nền tảng',
                  'Cooperates with Android\'s lifecycle & threading (save state, I/O off main thread)|||Hợp tác với vòng đời & luồng Android (lưu state, I/O ngoài main thread)',
                  'Uses the most code|||Dùng nhiều code nhất',
                  'Is the longest option|||Là phương án dài nhất',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 10 — NÂNG CAO ★ (BEYOND SYLLABUS) ══════════════════ */
    {
      title: 'Chapter 10 — Beyond the syllabus ★: Kotlin, Compose & shipping|||Chương 10 — Nâng cao ★: Kotlin, Compose & phát hành',
      description: 'Cả chương ★ ngoài giáo trình: Kotlin (ngôn ngữ chính thức), Jetpack Compose (UI khai báo), và phát hành app lên Google Play.',
      lessons: [
        {
          title: '10.1 — Kotlin, Jetpack Compose & Google Play release ★|||10.1 — Kotlin, Jetpack Compose & phát hành Google Play ★',
          slug: 'prm392-10-1-advanced',
          type: 'VIDEO',
          description: 'Ba bước tiến ngoài giáo trình: chuyển sang Kotlin, dựng UI khai báo với Compose, và đóng gói ký + phát hành app.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1 · ★ Beyond the syllabus</span>
<h2>Where Android actually is today — and how to ship your app</h2>
<p class="lead">This whole chapter is <span class="badge">★ Beyond the syllabus</span>. PRM392 teaches Android in Java with XML layouts (a solid foundation), but modern professional Android has moved on. Learn these to be job-ready and to make your project stand out.</p>

<h3>1 — Kotlin: the official Android language</h3>
<p>Since 2019 Google recommends <strong>Kotlin</strong> for new Android code. It's fully interoperable with Java, so everything you learned maps over — with less boilerplate and built-in null safety (no more surprise NullPointerExceptions).</p>
<div class="out"><strong>The same click listener, Java vs Kotlin</strong>
// Java
btn.setOnClickListener(v -&gt; tv.setText("Hi"));
// Kotlin
btn.setOnClickListener { tv.text = "Hi" }</div>

<h3>2 — Jetpack Compose: declarative UI (no XML)</h3>
<p>Compose replaces XML layouts + findViewById with UI written directly in Kotlin as functions. You describe <em>what</em> the screen looks like for a given state, and it re-renders when state changes — the same idea as React on the web.</p>
<div class="out"><strong>A whole screen, no XML</strong>
@Composable
fun Greeting(name: String) {
    Column(Modifier.padding(16.dp)) {
        Text("Hello, ${'$'}name!")
        Button(onClick = { /* ... */ }) { Text("Tap me") }
    }
}</div>

<h3>3 — Shipping: sign, bundle, publish</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Release build</div><div class="lz-d">minify + shrink (R8)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Sign</div><div class="lz-d">a keystore proves it's you</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">AAB</div><div class="lz-d">build an Android App Bundle</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Play Console</div><div class="lz-d">upload, test track, release</div></div>
</div>
<div class="pitfall"><strong>Guard your keystore and its passwords forever.</strong> Google identifies your app by its signing key. Lose the keystore and you can never update the published app under the same identity. Back it up securely the moment you create it.</div>
<div class="callout ok"><strong>How this helps your PRM392 project.</strong> You don't need to publish, but building a signed release APK and installing it on a real phone is a strong demo move — and adopting Material theming, ViewModel and Navigation (even in Java) makes your app look and behave like a real product to the graders.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The modern Android stack in one line.</b> Kotlin + Coroutines/Flow + Jetpack Compose + ViewModel + Room + Retrofit + Hilt (DI) + Navigation is today's default. You now know the <em>concepts</em> behind each (in Java); learning the Kotlin/Compose syntax on top is a short, high-value next step after PRM392. <em>This roadmap is your bridge from coursework to a real Android job.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1 · ★ Ngoài giáo trình</span>
<h2>Android thực sự đang ở đâu hôm nay — và cách phát hành app của bạn</h2>
<p class="lead">Cả chương này là <span class="badge">★ Ngoài giáo trình</span>. PRM392 dạy Android bằng Java với XML layout (một nền tảng vững), nhưng Android chuyên nghiệp hiện đại đã tiến xa. Học những cái này để sẵn sàng đi làm và làm project nổi bật.</p>

<h3>1 — Kotlin: ngôn ngữ chính thức của Android</h3>
<p>Từ 2019 Google khuyến nghị <strong>Kotlin</strong> cho code Android mới. Nó tương thích hoàn toàn với Java, nên mọi thứ bạn học ánh xạ sang — với ít boilerplate hơn và an toàn null tích hợp sẵn (hết NullPointerException bất ngờ).</p>
<div class="out"><strong>Cùng một click listener, Java vs Kotlin</strong>
// Java
btn.setOnClickListener(v -&gt; tv.setText("Hi"));
// Kotlin
btn.setOnClickListener { tv.text = "Hi" }</div>

<h3>2 — Jetpack Compose: UI khai báo (không XML)</h3>
<p>Compose thay XML layout + findViewById bằng UI viết thẳng trong Kotlin dưới dạng hàm. Bạn mô tả màn hình <em>trông thế nào</em> cho một state, và nó tự render lại khi state đổi — cùng ý tưởng như React trên web.</p>
<div class="out"><strong>Cả một màn hình, không XML</strong>
@Composable
fun Greeting(name: String) {
    Column(Modifier.padding(16.dp)) {
        Text("Xin chào, ${'$'}name!")
        Button(onClick = { /* ... */ }) { Text("Chạm tôi") }
    }
}</div>

<h3>3 — Phát hành: ký, đóng gói, đăng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Build release</div><div class="lz-d">minify + rút gọn (R8)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Ký</div><div class="lz-d">keystore chứng minh là bạn</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">AAB</div><div class="lz-d">dựng Android App Bundle</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Play Console</div><div class="lz-d">tải lên, track test, phát hành</div></div>
</div>
<div class="pitfall"><strong>Giữ keystore và mật khẩu của nó mãi mãi.</strong> Google nhận diện app của bạn qua khoá ký. Mất keystore là bạn không bao giờ cập nhật được app đã đăng dưới cùng danh tính. Sao lưu an toàn ngay khi tạo nó.</div>
<div class="callout ok"><strong>Điều này giúp gì cho project PRM392.</strong> Bạn không cần đăng, nhưng dựng một APK release đã ký và cài lên điện thoại thật là một nước demo mạnh — và áp Material theming, ViewModel và Navigation (kể cả trong Java) làm app của bạn trông và chạy như một sản phẩm thật trước người chấm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Stack Android hiện đại trong một dòng.</b> Kotlin + Coroutines/Flow + Jetpack Compose + ViewModel + Room + Retrofit + Hilt (DI) + Navigation là mặc định hôm nay. Bạn nay đã biết <em>khái niệm</em> đằng sau mỗi cái (bằng Java); học cú pháp Kotlin/Compose lên trên là bước tiếp ngắn, giá trị cao sau PRM392. <em>Lộ trình này là cây cầu từ bài học tới một việc làm Android thật.</em></div>
</div>`,
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              {
                id: 'q1', points: 1,
                question: 'Since 2019, Google\'s officially recommended language for new Android code is:|||Từ 2019, ngôn ngữ Google chính thức khuyến nghị cho code Android mới là:',
                options: ['Java', 'Kotlin', 'Dart', 'Swift'],
                correctIndex: 1,
              },
              {
                id: 'q2', points: 1,
                question: 'Jetpack Compose differs from XML layouts in that it:|||Jetpack Compose khác XML layout ở chỗ nó:',
                options: [
                  'Requires more XML|||Cần nhiều XML hơn',
                  'Describes UI declaratively in Kotlin, re-rendering on state change|||Mô tả UI khai báo trong Kotlin, tự render lại khi state đổi',
                  'Cannot show text|||Không hiện chữ được',
                  'Only works in Java|||Chỉ chạy trong Java',
                ], correctIndex: 1,
              },
              {
                id: 'q3', points: 1,
                question: 'A key advantage of Kotlin over Java for Android is:|||Một lợi thế then chốt của Kotlin so với Java cho Android là:',
                options: [
                  'It cannot call Java|||Không gọi được Java',
                  'Built-in null safety and less boilerplate|||An toàn null tích hợp và ít boilerplate',
                  'It removes the lifecycle|||Nó bỏ vòng đời',
                  'It needs no Android Studio|||Không cần Android Studio',
                ], correctIndex: 1,
              },
              {
                id: 'q4', points: 1,
                question: 'Why must you carefully back up your app signing keystore?|||Vì sao phải cẩn thận sao lưu keystore ký app?',
                options: [
                  'It makes the app faster|||Làm app nhanh hơn',
                  'Google identifies your app by its key; losing it blocks future updates|||Google nhận diện app qua khoá; mất nó chặn cập nhật sau này',
                  'It stores user data|||Nó lưu dữ liệu người dùng',
                  'It is required to compile|||Bắt buộc để biên dịch',
                ], correctIndex: 1,
              },
              {
                id: 'q5', points: 1,
                question: 'Which format does Google Play recommend for publishing today?|||Định dạng nào Google Play khuyến nghị để đăng hôm nay?',
                options: [
                  'A raw APK only|||Chỉ APK thô',
                  'An Android App Bundle (AAB)|||Một Android App Bundle (AAB)',
                  'A ZIP file|||Một tệp ZIP',
                  'A JAR file|||Một tệp JAR',
                ], correctIndex: 1,
              },
            ],
          },
        },
      ],
    },
  ],
};
