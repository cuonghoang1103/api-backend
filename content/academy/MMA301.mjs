/**
 * MMA301 — Multiplatform Mobile App Development (Phát triển ứng dụng di động đa nền tảng). Kỳ 7.
 * Bám syllabus FPTU (sylID 12848, 13 CLO, 60 buổi). Tiên quyết: FER202. 3 tín chỉ.
 * Môn CODE MOBILE: React Native + Expo. Coursera 2-course + Expo docs + tích hợp Gemini AI.
 * Grading: Assignment 10% + Practical Exam 20% + Progress Test 10% + Project 20% + Final Exam 40% (>=4), avg >=5.
 *   Có FINAL PROJECT DEFENSE (buổi 60) → ngân hàng vấn đáp.
 * Chuẩn CHUYÊN NGHIỆP như SWP391: thang điểm, checklist, anti-fail/high-mark, ngân hàng câu hỏi thi + vấn đáp theo CLO,
 *   ngân hàng đề tài app + rubric, kịch bản demo, code snippet bank.
 * Song ngữ EN/VN đối xứng. Ví dụ có lời giải + ★ ngoài giáo trình.
 * Deep-link CodeLab: react-native / expo / react. Setup → Exp Hub.
 * ESCAPE: backtick trong code -> &#96; ; ${..} -> \${ ; < > & trong <pre> -> &lt; &gt; &amp;
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/MMA301.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    academyType: 'FPT',
    courseCode: 'MMA301',
    title: 'Multiplatform Mobile App Development',
    slug: 'multiplatform-mobile-app-development',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build real iOS & Android apps with React Native and Expo: components & navigation, styling, hooks & Redux, FlatList, SQLite/Firebase, push notifications, Gemini AI, debugging and publishing — one codebase, two platforms.|||Xây app iOS & Android thật với React Native và Expo: component & điều hướng, styling, hooks & Redux, FlatList, SQLite/Firebase, push notification, Gemini AI, debug và phát hành — một codebase, hai nền tảng.',
    description: 'MMA301 là môn PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG ĐA NỀN TẢNG của Kỳ 7, dạy React Native + Expo để xây một app chạy trên CẢ iOS và Android từ một codebase JavaScript/TypeScript. Bạn đi từ nền tảng (React Native là gì, cách hoạt động, cài môi trường, chạy trên simulator/emulator) → component & styling (View/Text/Image, Flexbox, StyleSheet) → điều hướng (React Navigation, nhiều màn hình) & xử lý input/touch → quản lý state (hooks + Redux) & hiển thị danh sách (FlatList/SectionList) → dữ liệu (SQLite, Firebase Realtime Database, AsyncStorage) & push notification (FCM/Expo) → tích hợp Gemini AI → debug & phát hành bằng Expo. Có Project + Practical Exam + Final Project Defense nên phần lớn điểm là app THẬT chạy được. Tiên quyết: FER202 (React). Đây là nền cho đồ án mobile PRM392 và mọi vai trò mobile sau này.',
    whatYouLearn: 'Hiểu React Native là gì và cách bridge sang native; cài môi trường Expo và chạy app trên iOS simulator / Android emulator / thiết bị thật; dùng core component (View, Text, Image, ScrollView, TextInput) và style bằng StyleSheet + Flexbox; điều hướng nhiều màn hình với React Navigation (stack, tab); xử lý input người dùng và sự kiện touch; quản lý state với useState/useEffect và Redux (Toolkit); hiển thị danh sách hiệu quả với FlatList/SectionList; lưu dữ liệu bằng AsyncStorage, SQLite và Firebase Realtime Database; gửi push notification (Firebase FCM / Expo Notifications); tích hợp Gemini AI vào app; debug bằng React Native DevTools; và build + phát hành app bằng Expo EAS.',
    requirements: 'Tiên quyết: FER202 (React). Cần: Node.js LTS, Visual Studio Code, Expo Go (app trên điện thoại thật để chạy thử nhanh nhất), và tuỳ chọn Android Studio (emulator) / Xcode (iOS simulator, chỉ trên macOS). Nên biết React (component, props, state, hooks) và JavaScript ES6.',
    documentsNote: 'Giáo trình & tài liệu: Coursera — "React Native: Developing Android and iOS Apps" và "Mobile App Notifications, Databases, & Publishing" • Expo docs (docs.expo.dev) • React Navigation docs • Firebase docs. Công cụ AI hỗ trợ (được phép, dùng có trách nhiệm): ChatGPT, Gemini, V0 by Vercel. Luyện tập trực tiếp trên Code Lab: track React Native, Expo, React (deep-link theo từng bài). Cài đặt môi trường → Exp Hub. Kèm file syllabus gốc MMA301.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn xây gì, kiến trúc React Native, điều kiện qua môn & 5 thành phần điểm, chuẩn đầu ra, công cụ, ngân hàng đề tài app, và bí quyết điểm cao.',
      lessons: [
        {
          title: '0.1 — About MMA301 & the mobile-app map|||0.1 — Giới thiệu MMA301 & bản đồ ứng dụng di động',
          slug: 'mma301-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'React Native là gì, vì sao một codebase chạy hai nền tảng, và bản đồ hành trình từ component tới app đã phát hành.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About MMA301 — Multiplatform Mobile App Development</h2>
<p class="lead">React Native lets you write <strong>one codebase in JavaScript/TypeScript</strong> that runs as a real, native app on <strong>both iOS and Android</strong>. Instead of learning Swift and Kotlin separately, you reuse your React skills (from FER202) and ship to two platforms at once.</p>
<p>By the end you can build, debug, and publish a real mobile app with navigation, state, a database, push notifications and even Gemini AI — the exact skill the PRM392 project and mobile jobs demand.</p>
<h3>How React Native works</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Your JS/TSX</b><span>React components (View, Text…)</span></div>
  <div class="lz-step"><b>The bridge</b><span>translates to native UI calls</span></div>
  <div class="lz-step"><b>Native views</b><span>real iOS UIView / Android View — not a webview</span></div>
</div>
<p>Unlike a web app in a wrapper, React Native renders <strong>real native components</strong>, so your app looks and feels native on each platform.</p>
<h3>Your journey — from component to published app</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">RN foundations &amp; styling</div><div class="lz-nsub">Expo setup · core components · Flexbox · StyleSheet</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Navigation &amp; input</div><div class="lz-nsub">React Navigation · touch events · forms</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State &amp; lists</div><div class="lz-nsub">hooks · Redux · FlatList / SectionList</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Data &amp; notifications</div><div class="lz-nsub">AsyncStorage · SQLite · Firebase · push</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Gemini AI &amp; publishing</div><div class="lz-nsub">GenAI in-app · debugging · Expo EAS</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Project &amp; defense</div><div class="lz-nsub">build the app · demo · final defense</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Performance · architecture · offline-first</div><div class="lz-nsub">ship a smooth, robust app</div></div></div>
</div>
<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fmultiplatform-mobile-app-development%2Flearn&reflabel=MMA301#module-454" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: Setting Up React Native (Code Lab)</span><span class="lc-sub">Hands-on exercises on the React Native track — build as you learn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout ok">The core reuse insight: <strong>React Native IS React</strong> — same components, props, state and hooks. You swap <code>&lt;div&gt;</code> for <code>&lt;View&gt;</code> and <code>&lt;p&gt;</code> for <code>&lt;Text&gt;</code>, and CSS becomes a StyleSheet object. Everything you learned in FER202 transfers.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu MMA301 — Phát triển ứng dụng di động đa nền tảng</h2>
<p class="lead">React Native cho bạn viết <strong>một codebase bằng JavaScript/TypeScript</strong> chạy như một app native thật trên <strong>cả iOS và Android</strong>. Thay vì học Swift và Kotlin riêng, bạn tái dùng kỹ năng React (từ FER202) và ship cho hai nền tảng cùng lúc.</p>
<p>Kết thúc môn, bạn xây, debug, và phát hành được một app di động thật có điều hướng, state, database, push notification và cả Gemini AI — đúng kỹ năng đồ án PRM392 và việc mobile đòi hỏi.</p>
<h3>React Native hoạt động thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><b>JS/TSX của bạn</b><span>component React (View, Text…)</span></div>
  <div class="lz-step"><b>Cầu nối (bridge)</b><span>dịch sang lời gọi UI native</span></div>
  <div class="lz-step"><b>View native</b><span>UIView iOS / View Android thật — không phải webview</span></div>
</div>
<p>Khác một web app bọc trong khung, React Native render <strong>component native thật</strong>, nên app trông và cảm giác native trên mỗi nền tảng.</p>
<h3>Hành trình của bạn — từ component tới app đã phát hành</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng RN &amp; styling</div><div class="lz-nsub">cài Expo · core component · Flexbox · StyleSheet</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Điều hướng &amp; input</div><div class="lz-nsub">React Navigation · sự kiện touch · form</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State &amp; danh sách</div><div class="lz-nsub">hooks · Redux · FlatList / SectionList</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Dữ liệu &amp; notification</div><div class="lz-nsub">AsyncStorage · SQLite · Firebase · push</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Gemini AI &amp; phát hành</div><div class="lz-nsub">GenAI trong app · debug · Expo EAS</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Project &amp; vấn đáp</div><div class="lz-nsub">xây app · demo · bảo vệ cuối</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Hiệu năng · kiến trúc · offline-first</div><div class="lz-nsub">ship một app mượt, bền</div></div></div>
</div>
<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fmultiplatform-mobile-app-development%2Flearn&reflabel=MMA301#module-454" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: Setting Up React Native (Code Lab)</span><span class="lc-sub">Bài tập thực hành trên track React Native — vừa học vừa xây.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout ok">Insight tái dùng cốt lõi: <strong>React Native CHÍNH LÀ React</strong> — cùng component, props, state và hooks. Bạn đổi <code>&lt;div&gt;</code> thành <code>&lt;View&gt;</code> và <code>&lt;p&gt;</code> thành <code>&lt;Text&gt;</code>, và CSS thành một object StyleSheet. Mọi thứ bạn học ở FER202 đều chuyển qua được.</div>
</div>`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'mma301-dieu-kien-qua-mon',
          type: 'VIDEO',
          description: 'Tín chỉ, tiên quyết, 5 thành phần điểm, cổng Final Exam ≥4, và Final Project Defense.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">MMA301 is graded across five components. The Final Exam carries the most weight (40%) and has a ≥4 gate; the Project ends in a live <strong>Final Project Defense</strong>.</p>
<div class="kv-grid">
  <div class="kv"><b>Credits</b><span>3</span></div>
  <div class="kv"><b>Prerequisite</b><span>FER202</span></div>
  <div class="kv"><b>Attendance</b><span>≥80% contact slots to sit the exam</span></div>
  <div class="kv"><b>Pass</b><span>Final Exam ≥4 AND average ≥5</span></div>
</div>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Format</th><th>Gate</th></tr></thead>
  <tbody>
    <tr><td>Assignment (×2)</td><td>10%</td><td>Coding tasks, in tutorials &amp; at home</td><td>submit on time</td></tr>
    <tr><td>Practical Exam</td><td>20%</td><td>Build/extend an app feature live, 85 min</td><td>—</td></tr>
    <tr><td>Progress Test (×2)</td><td>10%</td><td>Short tests, 20–40 min</td><td>—</td></tr>
    <tr><td>Project</td><td>20%</td><td>A full mobile app + Final Project Defense</td><td>—</td></tr>
    <tr><td>Final Exam</td><td>40%</td><td>Theory + applied, 60 min</td><td><b>≥ 4</b></td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">TO PASS</span> Final Exam ≥ 4 &nbsp;AND&nbsp; weighted average ≥ 5</div>
<div class="callout warn">The <strong>Final Project Defense</strong> (session 60) is a live oral: you demo your app and answer questions about your code and decisions. It is not enough that the app runs — you must explain <em>why</em> you built it that way. We prepare a defense question bank in Chapter 6.</div>
<div class="out"><b>Worked example:</b> Student has Assignment 8, Practical 7, Project 8, but Final Exam 3.5. The <b>Final ≥4 gate fails them</b> despite a high average. Lesson: the 40% Final Exam is where most of the risk sits — protect it.</div>
<div class="pitfall">Missing more than 20% of contact slots bars you from the final exam entirely. And the Final Exam's ≥4 gate means you cannot coast on project marks alone — study the theory too.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">MMA301 chấm qua năm thành phần. Final Exam mang trọng số cao nhất (40%) và có cổng ≥4; Project kết thúc bằng một <strong>Final Project Defense</strong> trực tiếp.</p>
<div class="kv-grid">
  <div class="kv"><b>Tín chỉ</b><span>3</span></div>
  <div class="kv"><b>Tiên quyết</b><span>FER202</span></div>
  <div class="kv"><b>Điểm danh</b><span>≥80% buổi mới được thi</span></div>
  <div class="kv"><b>Đậu</b><span>Final Exam ≥4 VÀ trung bình ≥5</span></div>
</div>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th><th>Cổng</th></tr></thead>
  <tbody>
    <tr><td>Assignment (×2)</td><td>10%</td><td>Bài code, ở tutorial &amp; ở nhà</td><td>nộp đúng hạn</td></tr>
    <tr><td>Practical Exam</td><td>20%</td><td>Xây/mở rộng một tính năng app tại chỗ, 85 phút</td><td>—</td></tr>
    <tr><td>Progress Test (×2)</td><td>10%</td><td>Test ngắn, 20–40 phút</td><td>—</td></tr>
    <tr><td>Project</td><td>20%</td><td>Một app di động đầy đủ + Final Project Defense</td><td>—</td></tr>
    <tr><td>Final Exam</td><td>40%</td><td>Lý thuyết + áp dụng, 60 phút</td><td><b>≥ 4</b></td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">ĐỂ ĐẬU</span> Final Exam ≥ 4 &nbsp;VÀ&nbsp; trung bình có trọng số ≥ 5</div>
<div class="callout warn"><strong>Final Project Defense</strong> (buổi 60) là một buổi vấn đáp trực tiếp: bạn demo app và trả lời câu hỏi về code và quyết định của mình. App chạy được là chưa đủ — bạn phải giải thích <em>vì sao</em> bạn làm như vậy. Chúng ta chuẩn bị ngân hàng câu hỏi vấn đáp ở Chương 6.</div>
<div class="out"><b>Ví dụ có lời giải:</b> Sinh viên có Assignment 8, Practical 7, Project 8, nhưng Final Exam 3.5. <b>Cổng Final ≥4 làm rớt</b> dù trung bình cao. Bài học: Final Exam 40% là nơi rủi ro lớn nhất — bảo vệ nó.</div>
<div class="pitfall">Vắng quá 20% số buổi là bị cấm thi cuối kỳ hoàn toàn. Và cổng ≥4 của Final Exam nghĩa là bạn không thể chỉ dựa điểm project — hãy học cả lý thuyết.</div>
</div>`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra (CLO)',
          slug: 'mma301-chuan-dau-ra',
          type: 'VIDEO',
          description: '13 chuẩn đầu ra và cách chúng gắn vào các chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Course learning outcomes (CLOs)</h2>
<p class="lead">Thirteen CLOs cover the full mobile stack — from "what is React Native" to publishing and Gemini AI. Here they are grouped by chapter.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to…</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1-2</td><td>Understand what React Native is and how it works</td><td>Ch1</td></tr>
    <tr><td>CLO3-4</td><td>Build a React Native app and use mobile components</td><td>Ch1-2</td></tr>
    <tr><td>CLO5</td><td>Style React Native apps</td><td>Ch1</td></tr>
    <tr><td>CLO6</td><td>Manage state using hooks and Redux</td><td>Ch3</td></tr>
    <tr><td>CLO7</td><td>Use lists (FlatList/SectionList) for data presentation</td><td>Ch3</td></tr>
    <tr><td>CLO8</td><td>Use debugging &amp; developer tools</td><td>Ch5</td></tr>
    <tr><td>CLO9</td><td>Model and store data</td><td>Ch4</td></tr>
    <tr><td>CLO11-12</td><td>Integrate Firebase (FCM, Realtime DB) &amp; push notifications</td><td>Ch4</td></tr>
    <tr><td>CLO10</td><td>Integrate Gemini AI &amp; apply GenAI to solve problems</td><td>Ch5</td></tr>
    <tr><td>CLO13</td><td>Understand how to publish an application</td><td>Ch5</td></tr>
  </tbody>
</table>
<div class="callout">Almost every CLO is "be able to" — the Project and Practical Exam grade you on <em>doing</em>. Pair each CLO with a tiny app feature you build yourself until it is automatic.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mười ba CLO bao trọn ngăn xếp mobile — từ "React Native là gì" tới phát hành và Gemini AI. Đây là bản gom theo chương.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ có thể…</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1-2</td><td>Hiểu React Native là gì và cách nó hoạt động</td><td>Ch1</td></tr>
    <tr><td>CLO3-4</td><td>Xây app React Native và dùng component mobile</td><td>Ch1-2</td></tr>
    <tr><td>CLO5</td><td>Style cho app React Native</td><td>Ch1</td></tr>
    <tr><td>CLO6</td><td>Quản lý state bằng hooks và Redux</td><td>Ch3</td></tr>
    <tr><td>CLO7</td><td>Dùng danh sách (FlatList/SectionList) để hiển thị dữ liệu</td><td>Ch3</td></tr>
    <tr><td>CLO8</td><td>Dùng công cụ debug &amp; developer tools</td><td>Ch5</td></tr>
    <tr><td>CLO9</td><td>Mô hình hoá và lưu trữ dữ liệu</td><td>Ch4</td></tr>
    <tr><td>CLO11-12</td><td>Tích hợp Firebase (FCM, Realtime DB) &amp; push notification</td><td>Ch4</td></tr>
    <tr><td>CLO10</td><td>Tích hợp Gemini AI &amp; áp dụng GenAI giải quyết vấn đề</td><td>Ch5</td></tr>
    <tr><td>CLO13</td><td>Hiểu cách phát hành một ứng dụng</td><td>Ch5</td></tr>
  </tbody>
</table>
<div class="callout">Hầu như mọi CLO là "có thể làm" — Project và Practical Exam chấm bạn ở việc <em>làm</em>. Ghép mỗi CLO với một tính năng app nhỏ bạn tự xây đến khi tự động.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & environment setup|||0.4 — Công cụ & cài đặt môi trường',
          slug: 'mma301-cong-cu',
          type: 'VIDEO',
          description: 'Node, Expo, Expo Go trên điện thoại, VS Code, emulator — và cách chạy app đầu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your mobile toolkit</h2>
<p class="lead">Expo removes almost all the native setup pain. The fastest path: install Expo, run on your real phone via the Expo Go app — no Android Studio or Xcode needed to start.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Node.js LTS + npm</b> — the JavaScript runtime and package manager.</div>
  <div class="lz-layer"><b>Expo</b> — the toolchain that builds &amp; runs your RN app (<code>npx create-expo-app</code>).</div>
  <div class="lz-layer"><b>Expo Go (phone app)</b> — scan a QR code to run your app instantly on a real device.</div>
  <div class="lz-layer"><b>VS Code</b> — editor with the React Native / ESLint / Prettier extensions.</div>
  <div class="lz-layer"><b>Android Studio / Xcode (optional)</b> — emulators/simulators if you have no phone.</div>
</div>
<div class="out"><b>Create and run your first app:</b>
<pre><span class="tok-comment"># Create a new Expo app</span>
npx create-expo-app@latest myapp
cd myapp
npx expo start
<span class="tok-comment"># then scan the QR code with Expo Go on your phone</span></pre></div>
<a class="link-card exphub" href="/exp-hub/mma301-cai-dat-moi-truong?ref=%2Fcourses%2Fmultiplatform-mobile-app-development%2Flearn&reflabel=MMA301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up Expo + Expo Go + an emulator — step by step</span><span class="lc-sub">Install everything and run your first app, with links, on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Use a <strong>real phone with Expo Go</strong> for daily development — it is faster to start than an emulator and shows real touch, camera and notification behaviour. Save the emulator for testing the other platform you do not own.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ mobile của bạn</h2>
<p class="lead">Expo loại bỏ gần hết nỗi đau cài native. Đường nhanh nhất: cài Expo, chạy trên điện thoại thật qua app Expo Go — không cần Android Studio hay Xcode để bắt đầu.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Node.js LTS + npm</b> — runtime JavaScript và trình quản lý package.</div>
  <div class="lz-layer"><b>Expo</b> — bộ công cụ build &amp; chạy app RN (<code>npx create-expo-app</code>).</div>
  <div class="lz-layer"><b>Expo Go (app điện thoại)</b> — quét QR để chạy app tức thì trên thiết bị thật.</div>
  <div class="lz-layer"><b>VS Code</b> — trình soạn với extension React Native / ESLint / Prettier.</div>
  <div class="lz-layer"><b>Android Studio / Xcode (tuỳ chọn)</b> — emulator/simulator nếu không có điện thoại.</div>
</div>
<div class="out"><b>Tạo và chạy app đầu tiên:</b>
<pre><span class="tok-comment"># Tao mot app Expo moi</span>
npx create-expo-app@latest myapp
cd myapp
npx expo start
<span class="tok-comment"># roi quet QR code bang Expo Go tren dien thoai</span></pre></div>
<a class="link-card exphub" href="/exp-hub/mma301-cai-dat-moi-truong?ref=%2Fcourses%2Fmultiplatform-mobile-app-development%2Flearn&reflabel=MMA301" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Expo + Expo Go + emulator — từng bước</span><span class="lc-sub">Cài mọi thứ và chạy app đầu tiên, kèm link, trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Dùng <strong>điện thoại thật với Expo Go</strong> cho phát triển hằng ngày — nhanh khởi động hơn emulator và cho thấy hành vi touch, camera, notification thật. Để dành emulator để test nền tảng còn lại mà bạn không có.</div>
</div>`,
        },
        {
          title: '0.5 — App project topic bank & how to choose (mentor guide)|||0.5 — Ngân hàng đề tài app & cách chọn (mentor)',
          slug: 'mma301-ngan-hang-de-tai',
          type: 'VIDEO',
          description: '12 đề tài app đã kiểm phạm vi cho project + rubric 6 phép thử chọn đề vừa sức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Choosing your app project</h2>
<p class="lead">The Project (20%) asks for a full mobile app <strong>you choose</strong>, ending in a live defense. The best project has 3–5 screens, real navigation, a list of data, persistence, and one "wow" feature (notifications, camera, or Gemini AI) — small enough to finish, rich enough to show every CLO.</p>
<h3>The 6-test rubric — score an app before committing</h3>
<table>
  <thead><tr><th>#</th><th>Test</th><th>Ask yourself</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Right size</td><td>3–5 screens (e.g., list, detail, add, profile)? Not 1, not 20.</td></tr>
    <tr><td>2</td><td>Navigation</td><td>Do screens link (stack + tab) to demo React Navigation?</td></tr>
    <tr><td>3</td><td>A data list</td><td>Is there a FlatList of items to show (CLO7)?</td></tr>
    <tr><td>4</td><td>Persistence</td><td>Does data survive a restart (AsyncStorage / SQLite / Firebase)?</td></tr>
    <tr><td>5</td><td>State management</td><td>Is there shared state worth a hook/Redux (CLO6)?</td></tr>
    <tr><td>6</td><td>A standout feature</td><td>Notifications, camera, maps, or Gemini AI to impress at defense?</td></tr>
  </tbody>
</table>
<h3>Topic bank — 12 scope-checked apps</h3>
<ol>
  <li>Habit tracker — list of habits, daily check-off, streak, reminders (notifications)</li>
  <li>Expense tracker — add/list transactions, categories, monthly total, chart</li>
  <li>Recipe book — list, detail, favourites, add your own (persisted)</li>
  <li>Note / to-do app — CRUD notes, categories, search, SQLite storage</li>
  <li>Weather app — city search, fetch from an API, saved cities</li>
  <li>Movie browser — fetch a movie API, list + detail, watchlist</li>
  <li>Flashcard study app — decks, cards, quiz mode, progress</li>
  <li>Fitness log — workouts, exercises, timer, history</li>
  <li>Shopping list — items, quantities, check off, share</li>
  <li>Book library — books, reading status, notes, rating</li>
  <li>AI chat assistant — chat UI powered by Gemini AI (CLO10)</li>
  <li>Event countdown — events, live countdown, push notification on the day</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Design the navigation and screen list first, on paper.</b> Sketch the screens as boxes and draw arrows for navigation (Home → Detail, Tab: List / Add / Profile). This "screen map" is your app's skeleton — once it is clear, each screen is a small, independent component. Starting from a screen map prevents the tangled navigation that sinks student projects. The syllabus lists features; professionals start from the user's flow between screens.</div>
<div class="pitfall">Avoid a single-screen app with no navigation and no persistence — it cannot demonstrate navigation (CLO3-4), lists (CLO7), or storage (CLO9), capping your project and defense marks.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn đề tài app của bạn</h2>
<p class="lead">Project (20%) yêu cầu một app di động đầy đủ <strong>bạn tự chọn</strong>, kết thúc bằng vấn đáp trực tiếp. App tốt nhất có 3–5 màn hình, điều hướng thật, một danh sách dữ liệu, lưu trữ, và một tính năng "wow" (notification, camera, hoặc Gemini AI) — đủ nhỏ để hoàn thành, đủ giàu để thể hiện mọi CLO.</p>
<h3>Rubric 6 phép thử — chấm app trước khi cam kết</h3>
<table>
  <thead><tr><th>#</th><th>Phép thử</th><th>Tự hỏi</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Đúng cỡ</td><td>3–5 màn hình (vd list, detail, add, profile)? Không 1, không 20.</td></tr>
    <tr><td>2</td><td>Điều hướng</td><td>Các màn có nối (stack + tab) để demo React Navigation không?</td></tr>
    <tr><td>3</td><td>Một danh sách dữ liệu</td><td>Có một FlatList các mục để hiển thị (CLO7) không?</td></tr>
    <tr><td>4</td><td>Lưu trữ</td><td>Dữ liệu có sống sót sau restart (AsyncStorage / SQLite / Firebase) không?</td></tr>
    <tr><td>5</td><td>Quản lý state</td><td>Có state dùng chung đáng dùng hook/Redux (CLO6) không?</td></tr>
    <tr><td>6</td><td>Một tính năng nổi bật</td><td>Notification, camera, bản đồ, hoặc Gemini AI để gây ấn tượng lúc vấn đáp?</td></tr>
  </tbody>
</table>
<h3>Ngân hàng đề tài — 12 app đã kiểm phạm vi</h3>
<ol>
  <li>Theo dõi thói quen — danh sách thói quen, tick mỗi ngày, chuỗi ngày, nhắc (notification)</li>
  <li>Theo dõi chi tiêu — thêm/liệt kê giao dịch, danh mục, tổng tháng, biểu đồ</li>
  <li>Sổ công thức — list, detail, yêu thích, tự thêm (đã lưu)</li>
  <li>App ghi chú / to-do — CRUD note, danh mục, tìm kiếm, lưu SQLite</li>
  <li>App thời tiết — tìm thành phố, fetch từ API, thành phố đã lưu</li>
  <li>Duyệt phim — fetch API phim, list + detail, danh sách xem sau</li>
  <li>App học flashcard — bộ thẻ, thẻ, chế độ quiz, tiến độ</li>
  <li>Nhật ký tập luyện — buổi tập, bài tập, timer, lịch sử</li>
  <li>Danh sách mua sắm — mục, số lượng, tick, chia sẻ</li>
  <li>Thư viện sách — sách, trạng thái đọc, ghi chú, đánh giá</li>
  <li>Trợ lý chat AI — giao diện chat dùng Gemini AI (CLO10)</li>
  <li>Đếm ngược sự kiện — sự kiện, đếm ngược trực tiếp, push đúng ngày</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thiết kế điều hướng và danh sách màn hình trước, trên giấy.</b> Phác các màn thành ô và vẽ mũi tên cho điều hướng (Home → Detail, Tab: List / Add / Profile). "Bản đồ màn hình" này là bộ khung app — khi nó rõ, mỗi màn là một component nhỏ, độc lập. Bắt đầu từ bản đồ màn hình chặn kiểu điều hướng rối làm chìm project của sinh viên. Giáo trình liệt kê tính năng; người chuyên nghiệp bắt đầu từ luồng của người dùng giữa các màn.</div>
<div class="pitfall">Tránh một app một-màn-hình không điều hướng, không lưu trữ — nó không thể thể hiện điều hướng (CLO3-4), danh sách (CLO7), hay lưu trữ (CLO9), giới hạn điểm project và vấn đáp.</div>
</div>`,
        },
        {
          title: '0.6 — Why students lose marks & the formula for a high grade|||0.6 — Vì sao mất điểm & công thức điểm cao',
          slug: 'mma301-chong-mat-diem',
          type: 'VIDEO',
          description: '7 kiểu mất điểm trong MMA301 + cờ xanh/đỏ + công thức điểm cao — kiểu SWP391.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Why students lose marks — and how to score high</h2>
<p class="lead">Mobile has its own recurring traps. Know them, and you protect both the Practical Exam and the Final Project Defense.</p>
<h3>The 7 ways to lose marks</h3>
<table>
  <thead><tr><th>#</th><th>Loss</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Using web tags (&lt;div&gt;, &lt;p&gt;)</td><td>RN uses <code>&lt;View&gt;</code>, <code>&lt;Text&gt;</code> — all text MUST be inside <code>&lt;Text&gt;</code>.</td></tr>
    <tr><td>2</td><td>Broken styling (CSS habits)</td><td>Style is a JS object; use Flexbox (default flexDirection is column), no CSS units.</td></tr>
    <tr><td>3</td><td>Missing <code>key</code> in lists</td><td>FlatList needs <code>keyExtractor</code>; missing keys cause re-render bugs.</td></tr>
    <tr><td>4</td><td>State not persisted</td><td>useState resets on restart — persist with AsyncStorage/SQLite/Firebase.</td></tr>
    <tr><td>5</td><td>Blocking the UI thread</td><td>Do fetches in useEffect with async; never freeze the UI.</td></tr>
    <tr><td>6</td><td>Hard-coded secrets/keys</td><td>Gemini/Firebase keys in env or a config, never committed.</td></tr>
    <tr><td>7</td><td>Can't explain your code at defense</td><td>Understand every line; rehearse the defense question bank (Ch6).</td></tr>
  </tbody>
</table>
<h3>Green flags vs red flags</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Green</b><span>View/Text correctly · Flexbox layout · FlatList + keyExtractor · persisted state · async in useEffect · can explain choices</span></div>
  <div class="kv"><b>🔴 Red</b><span>div/p · broken layout · list without keys · data lost on restart · UI freezes · "I copied this"</span></div>
</div>
<div class="formula"><span class="lbl">HIGH-GRADE FORMULA</span> Correct RN components + Flexbox styling + FlatList with keys + persisted state + a standout feature + being able to defend every decision live</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Rehearse the demo, not just the app.</b> The defense is a performance: know the exact tap sequence that shows your best features in 3 minutes, and have a fallback if the network fails (screenshots, a recorded clip). Students whose live demo crashes and who freeze lose defense marks even with great code. Preparing the demo path is a professional presentation skill the syllabus assumes but never teaches.</div>
<div class="pitfall">"It works on my phone" is not enough for the defense — the examiner may ask you to change something live or explain a design choice. Deep understanding, not a memorised tap sequence, is what carries the oral.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Vì sao sinh viên mất điểm — và cách điểm cao</h2>
<p class="lead">Mobile có những cái bẫy lặp lại riêng. Biết chúng là bảo vệ được cả Practical Exam lẫn Final Project Defense.</p>
<h3>7 kiểu mất điểm</h3>
<table>
  <thead><tr><th>#</th><th>Mất điểm</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Dùng tag web (&lt;div&gt;, &lt;p&gt;)</td><td>RN dùng <code>&lt;View&gt;</code>, <code>&lt;Text&gt;</code> — mọi chữ PHẢI trong <code>&lt;Text&gt;</code>.</td></tr>
    <tr><td>2</td><td>Styling hỏng (thói quen CSS)</td><td>Style là object JS; dùng Flexbox (flexDirection mặc định là column), không đơn vị CSS.</td></tr>
    <tr><td>3</td><td>Thiếu <code>key</code> trong danh sách</td><td>FlatList cần <code>keyExtractor</code>; thiếu key gây bug re-render.</td></tr>
    <tr><td>4</td><td>State không lưu</td><td>useState reset khi restart — lưu bằng AsyncStorage/SQLite/Firebase.</td></tr>
    <tr><td>5</td><td>Chặn luồng UI</td><td>Fetch trong useEffect với async; đừng bao giờ đóng băng UI.</td></tr>
    <tr><td>6</td><td>Hard-code secret/key</td><td>Key Gemini/Firebase trong env hoặc config, không commit.</td></tr>
    <tr><td>7</td><td>Không giải thích được code lúc vấn đáp</td><td>Hiểu từng dòng; tập ngân hàng câu hỏi vấn đáp (Ch6).</td></tr>
  </tbody>
</table>
<h3>Cờ xanh vs cờ đỏ</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Xanh</b><span>View/Text đúng · layout Flexbox · FlatList + keyExtractor · state đã lưu · async trong useEffect · giải thích được lựa chọn</span></div>
  <div class="kv"><b>🔴 Đỏ</b><span>div/p · layout hỏng · list không key · mất dữ liệu khi restart · UI đơ · "em copy cái này"</span></div>
</div>
<div class="formula"><span class="lbl">CÔNG THỨC ĐIỂM CAO</span> Component RN đúng + styling Flexbox + FlatList có key + state đã lưu + một tính năng nổi bật + bảo vệ được mọi quyết định trực tiếp</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tập demo, không chỉ tập app.</b> Vấn đáp là một màn trình diễn: biết chính xác chuỗi thao tác cho thấy tính năng tốt nhất trong 3 phút, và có phương án dự phòng nếu mạng hỏng (ảnh chụp, một clip đã quay). Sinh viên có demo trực tiếp crash rồi đơ mất điểm vấn đáp dù code tốt. Chuẩn bị đường demo là kỹ năng thuyết trình chuyên nghiệp mà giáo trình mặc định nhưng không dạy.</div>
<div class="pitfall">"Chạy được trên máy em" là chưa đủ cho vấn đáp — giám khảo có thể yêu cầu bạn đổi gì đó tại chỗ hoặc giải thích một lựa chọn thiết kế. Hiểu sâu, không phải một chuỗi thao tác học thuộc, mới cõng bạn qua buổi vấn đáp.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — RN FOUNDATIONS & STYLING ══════════════════ */
    {
      title: 'Chapter 1 — React Native foundations & styling|||Chương 1 — Nền tảng React Native & styling',
      description: 'Component cốt lõi (View/Text/Image), JSX cho mobile, và styling bằng StyleSheet + Flexbox.',
      lessons: [
        {
          title: '1.1 — Core components & the first screen|||1.1 — Component cốt lõi & màn hình đầu tiên',
          slug: 'mma301-1-1-core-components',
          type: 'VIDEO',
          description: 'View, Text, Image, ScrollView — và vì sao mọi chữ phải nằm trong Text.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Core components — the building blocks</h2>
<p class="lead">React Native gives you a small set of primitive components that map to native views. Learn these five and you can build most screens.</p>
<table>
  <thead><tr><th>Component</th><th>Web equivalent</th><th>Use for</th></tr></thead>
  <tbody>
    <tr><td><code>&lt;View&gt;</code></td><td>&lt;div&gt;</td><td>a container / layout box</td></tr>
    <tr><td><code>&lt;Text&gt;</code></td><td>&lt;p&gt;, &lt;span&gt;</td><td>ALL text — nothing renders text but Text</td></tr>
    <tr><td><code>&lt;Image&gt;</code></td><td>&lt;img&gt;</td><td>pictures (needs a width/height)</td></tr>
    <tr><td><code>&lt;ScrollView&gt;</code></td><td>overflow:scroll</td><td>scrollable content (small lists)</td></tr>
    <tr><td><code>&lt;TextInput&gt;</code></td><td>&lt;input&gt;</td><td>user text entry</td></tr>
  </tbody>
</table>
<h3>Worked example — a simple screen</h3>
<div class="out"><pre><span class="tok-keyword">import</span> { View, Text, Image } <span class="tok-keyword">from</span> <span class="tok-string">'react-native'</span>;

<span class="tok-keyword">export default function</span> <span class="tok-function">HomeScreen</span>() {
  <span class="tok-keyword">return</span> (
    &lt;View style={{ padding: <span class="tok-number">20</span> }}&gt;
      &lt;Text style={{ fontSize: <span class="tok-number">24</span>, fontWeight: <span class="tok-string">'bold'</span> }}&gt;Welcome&lt;/Text&gt;
      &lt;Text&gt;Build once, run on iOS and Android.&lt;/Text&gt;
    &lt;/View&gt;
  );
}</pre>
<em>Notice the raw string "Welcome" is inside <code>&lt;Text&gt;</code>. Put text directly in a <code>&lt;View&gt;</code> and React Native throws an error.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Use &lt;SafeAreaView&gt; and platform-safe touchables.</b> Phones have notches and rounded corners; <code>&lt;SafeAreaView&gt;</code> keeps your UI out of them. And for taps, prefer <code>&lt;Pressable&gt;</code> (the modern, flexible touchable) over the older <code>TouchableOpacity</code>. Small component choices like these are the difference between an app that looks like a class exercise and one that feels professionally built — details the syllabus lists components for but does not rank.</div>
<div class="pitfall">The #1 beginner error: <strong>"Text strings must be rendered within a &lt;Text&gt; component"</strong>. Any literal text — even a stray space or a variable — must be wrapped in <code>&lt;Text&gt;</code>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Component cốt lõi — những viên gạch xây</h2>
<p class="lead">React Native cho bạn một tập nhỏ component nguyên thuỷ ánh xạ tới view native. Học năm cái này là xây được hầu hết màn hình.</p>
<table>
  <thead><tr><th>Component</th><th>Tương đương web</th><th>Dùng cho</th></tr></thead>
  <tbody>
    <tr><td><code>&lt;View&gt;</code></td><td>&lt;div&gt;</td><td>một container / hộp layout</td></tr>
    <tr><td><code>&lt;Text&gt;</code></td><td>&lt;p&gt;, &lt;span&gt;</td><td>MỌI chữ — không gì render chữ ngoài Text</td></tr>
    <tr><td><code>&lt;Image&gt;</code></td><td>&lt;img&gt;</td><td>hình ảnh (cần width/height)</td></tr>
    <tr><td><code>&lt;ScrollView&gt;</code></td><td>overflow:scroll</td><td>nội dung cuộn được (danh sách nhỏ)</td></tr>
    <tr><td><code>&lt;TextInput&gt;</code></td><td>&lt;input&gt;</td><td>nhập chữ người dùng</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — một màn hình đơn giản</h3>
<div class="out"><pre><span class="tok-keyword">import</span> { View, Text, Image } <span class="tok-keyword">from</span> <span class="tok-string">'react-native'</span>;

<span class="tok-keyword">export default function</span> <span class="tok-function">HomeScreen</span>() {
  <span class="tok-keyword">return</span> (
    &lt;View style={{ padding: <span class="tok-number">20</span> }}&gt;
      &lt;Text style={{ fontSize: <span class="tok-number">24</span>, fontWeight: <span class="tok-string">'bold'</span> }}&gt;Welcome&lt;/Text&gt;
      &lt;Text&gt;Build once, run on iOS and Android.&lt;/Text&gt;
    &lt;/View&gt;
  );
}</pre>
<em>Để ý chuỗi "Welcome" nằm trong <code>&lt;Text&gt;</code>. Đặt chữ trực tiếp trong <code>&lt;View&gt;</code> là React Native ném lỗi.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dùng &lt;SafeAreaView&gt; và touchable an toàn nền tảng.</b> Điện thoại có tai thỏ và góc bo; <code>&lt;SafeAreaView&gt;</code> giữ UI của bạn khỏi chúng. Và cho thao tác chạm, ưu tiên <code>&lt;Pressable&gt;</code> (touchable hiện đại, linh hoạt) hơn <code>TouchableOpacity</code> cũ. Những lựa chọn component nhỏ như vậy là khác biệt giữa một app trông như bài tập lớp và một app cảm giác được xây chuyên nghiệp — chi tiết mà giáo trình liệt kê component nhưng không xếp hạng.</div>
<div class="pitfall">Lỗi số 1 của người mới: <strong>"Text strings must be rendered within a &lt;Text&gt; component"</strong>. Mọi chữ literal — kể cả một dấu cách lạc hay một biến — phải bọc trong <code>&lt;Text&gt;</code>.</div>
</div>`,
        },
        {
          title: '1.2 — Styling with StyleSheet & Flexbox|||1.2 — Styling với StyleSheet & Flexbox',
          slug: 'mma301-1-2-styling-flexbox',
          type: 'VIDEO',
          description: 'Style là object JS, StyleSheet.create, và layout bằng Flexbox (mặc định column).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Styling: JS objects &amp; Flexbox (CLO5)</h2>
<p class="lead">There is no CSS file. Styles are JavaScript objects, and layout is done with Flexbox — but with one key difference from the web: the default <code>flexDirection</code> is <strong>column</strong>, not row.</p>
<h3>StyleSheet.create</h3>
<div class="out"><pre><span class="tok-keyword">import</span> { StyleSheet, View, Text } <span class="tok-keyword">from</span> <span class="tok-string">'react-native'</span>;

<span class="tok-keyword">const</span> styles = StyleSheet.<span class="tok-function">create</span>({
  card: { padding: <span class="tok-number">16</span>, backgroundColor: <span class="tok-string">'#fff'</span>, borderRadius: <span class="tok-number">8</span> },
  title: { fontSize: <span class="tok-number">18</span>, fontWeight: <span class="tok-string">'600'</span> },
});

&lt;View style={styles.card}&gt;
  &lt;Text style={styles.title}&gt;Hello&lt;/Text&gt;
&lt;/View&gt;</pre>
<em>Numbers are density-independent pixels (no "px"). <code>StyleSheet.create</code> validates keys and lets you reuse styles.</em></div>
<h3>Flexbox — the layout engine</h3>
<table>
  <thead><tr><th>Property</th><th>Effect</th></tr></thead>
  <tbody>
    <tr><td>flexDirection</td><td>'column' (default) or 'row'</td></tr>
    <tr><td>justifyContent</td><td>main-axis alignment (start/center/space-between)</td></tr>
    <tr><td>alignItems</td><td>cross-axis alignment</td></tr>
    <tr><td>flex: 1</td><td>fill available space</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked example — a centered box:</b>
<pre>container: { flex: <span class="tok-number">1</span>, justifyContent: <span class="tok-string">'center'</span>, alignItems: <span class="tok-string">'center'</span> }</pre>
<em><code>flex: 1</code> makes the container fill the screen, then justify+align center the child on both axes — the RN way to center anything.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Handle multiple screen sizes with flex, not fixed widths.</b> Hard-coding <code>width: 350</code> breaks on small phones and wastes space on tablets. Use <code>flex</code>, percentages, and the <code>Dimensions</code> / <code>useWindowDimensions</code> API for responsive layouts. Building for many screen sizes is a mobile-specific discipline that the styling lesson introduces but real apps live or die by.</div>
<div class="pitfall">Web CSS habits break here: there is no <code>display: block</code>, no <code>float</code>, no <code>%</code> on everything, and margins do not collapse. Think in Flexbox from the start rather than porting CSS mental models.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Styling: object JS &amp; Flexbox (CLO5)</h2>
<p class="lead">Không có file CSS. Style là object JavaScript, và layout làm bằng Flexbox — nhưng có một khác biệt then chốt với web: <code>flexDirection</code> mặc định là <strong>column</strong>, không phải row.</p>
<h3>StyleSheet.create</h3>
<div class="out"><pre><span class="tok-keyword">import</span> { StyleSheet, View, Text } <span class="tok-keyword">from</span> <span class="tok-string">'react-native'</span>;

<span class="tok-keyword">const</span> styles = StyleSheet.<span class="tok-function">create</span>({
  card: { padding: <span class="tok-number">16</span>, backgroundColor: <span class="tok-string">'#fff'</span>, borderRadius: <span class="tok-number">8</span> },
  title: { fontSize: <span class="tok-number">18</span>, fontWeight: <span class="tok-string">'600'</span> },
});

&lt;View style={styles.card}&gt;
  &lt;Text style={styles.title}&gt;Hello&lt;/Text&gt;
&lt;/View&gt;</pre>
<em>Số là pixel độc lập mật độ (không "px"). <code>StyleSheet.create</code> kiểm key và cho bạn tái dùng style.</em></div>
<h3>Flexbox — engine layout</h3>
<table>
  <thead><tr><th>Thuộc tính</th><th>Hiệu ứng</th></tr></thead>
  <tbody>
    <tr><td>flexDirection</td><td>'column' (mặc định) hoặc 'row'</td></tr>
    <tr><td>justifyContent</td><td>căn theo trục chính (start/center/space-between)</td></tr>
    <tr><td>alignItems</td><td>căn theo trục phụ</td></tr>
    <tr><td>flex: 1</td><td>lấp đầy không gian còn lại</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ có lời giải — một hộp căn giữa:</b>
<pre>container: { flex: <span class="tok-number">1</span>, justifyContent: <span class="tok-string">'center'</span>, alignItems: <span class="tok-string">'center'</span> }</pre>
<em><code>flex: 1</code> làm container lấp đầy màn hình, rồi justify+align căn con ở cả hai trục — cách RN để căn giữa bất cứ thứ gì.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xử lý nhiều cỡ màn hình bằng flex, không phải width cố định.</b> Hard-code <code>width: 350</code> hỏng trên điện thoại nhỏ và phí chỗ trên tablet. Dùng <code>flex</code>, phần trăm, và API <code>Dimensions</code> / <code>useWindowDimensions</code> cho layout responsive. Xây cho nhiều cỡ màn là một kỷ luật riêng của mobile mà bài styling giới thiệu nhưng app thật sống chết vì nó.</div>
<div class="pitfall">Thói quen CSS web hỏng ở đây: không có <code>display: block</code>, không <code>float</code>, không <code>%</code> khắp nơi, và margin không collapse. Nghĩ theo Flexbox từ đầu thay vì port mô hình tư duy CSS.</div>
</div>`,
        },
        {
          title: 'Quiz 1 — RN foundations & styling|||Quiz 1 — Nền tảng RN & styling',
          slug: 'mma301-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra core component, Text, StyleSheet và Flexbox.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In React Native, all text must be inside a…|||Trong React Native, mọi chữ phải nằm trong…', options: ['<div>', '<p>', '<Text>', '<span>'], correctIndex: 2, points: 1 },
              { question: 'The web <div> is replaced in React Native by…|||<div> của web được thay trong React Native bằng…', options: ['<Box>', '<View>', '<Container>', '<Div>'], correctIndex: 1, points: 1 },
              { question: 'In React Native Flexbox, the default flexDirection is…|||Trong Flexbox của React Native, flexDirection mặc định là…', options: ['row', 'column', 'row-reverse', 'none'], correctIndex: 1, points: 1 },
              { question: 'Styles in React Native are written as…|||Style trong React Native được viết dưới dạng…', options: ['a .css file|||một file .css', 'JavaScript objects|||object JavaScript', 'inline HTML|||HTML inline', 'SASS'], correctIndex: 1, points: 1 },
              { question: 'To center a child on both axes you use flex:1 plus…|||Để căn giữa một con ở cả hai trục bạn dùng flex:1 cộng…', options: ['margin: auto', 'justifyContent + alignItems: center', 'text-align: center', 'position: absolute'], correctIndex: 1, points: 1 },
              { question: 'For responsive layouts across screen sizes you should prefer… (beyond-syllabus)|||Cho layout responsive trên nhiều cỡ màn bạn nên ưu tiên… (ngoài giáo trình)', options: ['fixed pixel widths|||width pixel cố định', 'flex, percentages and Dimensions|||flex, phần trăm và Dimensions', 'one hard-coded size|||một cỡ hard-code', 'no styling|||không style'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — NAVIGATION & INPUT ══════════════════ */
    {
      title: 'Chapter 2 — Navigation & user input|||Chương 2 — Điều hướng & nhập liệu người dùng',
      description: 'React Navigation (stack + tab), nhiều màn hình, truyền params, và xử lý input/touch/form.',
      lessons: [
        {
          title: '2.1 — React Navigation & multi-screen apps|||2.1 — React Navigation & app nhiều màn hình',
          slug: 'mma301-2-1-navigation',
          type: 'VIDEO',
          description: 'Stack navigator, tab navigator, điều hướng giữa màn hình và truyền tham số.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Navigation between screens</h2>
<p class="lead">Mobile apps are many screens linked by navigation. <strong>React Navigation</strong> is the standard library: a <em>stack</em> navigator pushes screens (Home → Detail), a <em>tab</em> navigator switches between top-level sections.</p>
<h3>A stack navigator</h3>
<div class="out"><pre><span class="tok-keyword">const</span> Stack = <span class="tok-function">createNativeStackNavigator</span>();

&lt;NavigationContainer&gt;
  &lt;Stack.Navigator&gt;
    &lt;Stack.Screen name=<span class="tok-string">"Home"</span> component={HomeScreen} /&gt;
    &lt;Stack.Screen name=<span class="tok-string">"Detail"</span> component={DetailScreen} /&gt;
  &lt;/Stack.Navigator&gt;
&lt;/NavigationContainer&gt;</pre></div>
<h3>Navigating &amp; passing params</h3>
<div class="out"><pre><span class="tok-comment">// from HomeScreen — go to Detail with data</span>
&lt;Button title=<span class="tok-string">"Open"</span> onPress={() =&gt; navigation.<span class="tok-function">navigate</span>(<span class="tok-string">'Detail'</span>, { id: <span class="tok-number">42</span> })} /&gt;

<span class="tok-comment">// in DetailScreen — read the param</span>
<span class="tok-keyword">const</span> { id } = route.params;</pre>
<em>Each screen receives <code>navigation</code> (to move) and <code>route</code> (to read params) as props. This is how a list screen opens a detail screen for the tapped item.</em></div>
<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fmultiplatform-mobile-app-development%2Flearn&reflabel=MMA301#module-457" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: React Navigation &amp; Multi-Screen (Code Lab)</span><span class="lc-sub">Build stack + tab navigation on the React Native track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Nest navigators for real apps.</b> Real apps combine them: a tab navigator at the root (Home / Search / Profile), with a stack navigator <em>inside</em> each tab (so Home → Detail keeps the tab bar). Understanding this nesting — a tab of stacks — is what lets you build the multi-level navigation every real app has, beyond the single-navigator examples.</div>
<div class="pitfall">Forgetting to wrap everything in <code>&lt;NavigationContainer&gt;</code> (once, at the root) makes navigation silently fail. It must be the outermost navigation wrapper.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Điều hướng giữa các màn hình</h2>
<p class="lead">App mobile là nhiều màn hình nối bằng điều hướng. <strong>React Navigation</strong> là thư viện chuẩn: navigator <em>stack</em> đẩy màn hình (Home → Detail), navigator <em>tab</em> chuyển giữa các mục cấp cao.</p>
<h3>Một stack navigator</h3>
<div class="out"><pre><span class="tok-keyword">const</span> Stack = <span class="tok-function">createNativeStackNavigator</span>();

&lt;NavigationContainer&gt;
  &lt;Stack.Navigator&gt;
    &lt;Stack.Screen name=<span class="tok-string">"Home"</span> component={HomeScreen} /&gt;
    &lt;Stack.Screen name=<span class="tok-string">"Detail"</span> component={DetailScreen} /&gt;
  &lt;/Stack.Navigator&gt;
&lt;/NavigationContainer&gt;</pre></div>
<h3>Điều hướng &amp; truyền params</h3>
<div class="out"><pre><span class="tok-comment">// tu HomeScreen — sang Detail voi du lieu</span>
&lt;Button title=<span class="tok-string">"Open"</span> onPress={() =&gt; navigation.<span class="tok-function">navigate</span>(<span class="tok-string">'Detail'</span>, { id: <span class="tok-number">42</span> })} /&gt;

<span class="tok-comment">// trong DetailScreen — doc param</span>
<span class="tok-keyword">const</span> { id } = route.params;</pre>
<em>Mỗi màn nhận <code>navigation</code> (để di chuyển) và <code>route</code> (để đọc params) làm props. Đây là cách một màn danh sách mở màn chi tiết cho mục được chạm.</em></div>
<a class="link-card codelab" href="/code-lab/react-native?ref=%2Fcourses%2Fmultiplatform-mobile-app-development%2Flearn&reflabel=MMA301#module-457" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: React Navigation &amp; Multi-Screen (Code Lab)</span><span class="lc-sub">Xây điều hướng stack + tab trên track React Native.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lồng các navigator cho app thật.</b> App thật kết hợp chúng: một tab navigator ở gốc (Home / Search / Profile), với một stack navigator <em>bên trong</em> mỗi tab (để Home → Detail giữ được thanh tab). Hiểu sự lồng này — một tab của các stack — là điều cho bạn xây điều hướng nhiều tầng mà mọi app thật có, vượt các ví dụ một-navigator.</div>
<div class="pitfall">Quên bọc mọi thứ trong <code>&lt;NavigationContainer&gt;</code> (một lần, ở gốc) làm điều hướng âm thầm hỏng. Nó phải là wrapper điều hướng ngoài cùng nhất.</div>
</div>`,
        },
        {
          title: '2.2 — User input, touch events & forms|||2.2 — Nhập liệu, sự kiện touch & form',
          slug: 'mma301-2-2-input-touch',
          type: 'VIDEO',
          description: 'TextInput có state, Pressable/Button, và xử lý form + validation cơ bản.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Handling input &amp; touch</h2>
<p class="lead">Apps react to taps and typing. <code>TextInput</code> captures text into state; <code>Pressable</code>/<code>Button</code> capture taps. The controlled-input pattern from React applies directly.</p>
<h3>A controlled text input</h3>
<div class="out"><pre><span class="tok-keyword">const</span> [name, setName] = <span class="tok-function">useState</span>(<span class="tok-string">''</span>);

&lt;TextInput
  value={name}
  onChangeText={setName}
  placeholder=<span class="tok-string">"Your name"</span>
  style={{ borderWidth: <span class="tok-number">1</span>, padding: <span class="tok-number">8</span> }}
/&gt;
&lt;Text&gt;Hello {name}&lt;/Text&gt;</pre>
<em><code>onChangeText</code> gives you the string directly (not an event) — a small mobile convenience over web inputs.</em></div>
<h3>Touchables</h3>
<div class="out"><pre>&lt;Pressable onPress={handleSave} style={{ padding: <span class="tok-number">12</span> }}&gt;
  &lt;Text&gt;Save&lt;/Text&gt;
&lt;/Pressable&gt;</pre>
<em><code>Pressable</code> is the flexible modern touchable — it can style differently while pressed, unlike a plain Button.</em></div>
<h3>Simple form validation</h3>
<div class="out"><pre><span class="tok-keyword">function</span> <span class="tok-function">handleSave</span>() {
  <span class="tok-keyword">if</span> (!name.<span class="tok-function">trim</span>()) {
    Alert.<span class="tok-function">alert</span>(<span class="tok-string">'Please enter a name'</span>);
    <span class="tok-keyword">return</span>;
  }
  <span class="tok-comment">// save…</span>
}</pre></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Handle the keyboard so it does not cover inputs.</b> On mobile, the on-screen keyboard can hide the field being typed in. Wrap forms in <code>&lt;KeyboardAvoidingView&gt;</code> and use <code>keyboardType</code> / <code>autoCapitalize</code> / <code>secureTextEntry</code> props for the right keyboard per field. These keyboard details are a hallmark of a polished mobile app — invisible when done right, glaring when ignored — and the syllabus assumes but does not drill them.</div>
<div class="pitfall">An uncontrolled <code>TextInput</code> (no <code>value</code>/<code>onChangeText</code>) will not let you read or reset its text programmatically. Always bind it to state for a controlled input you can validate and clear.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Xử lý nhập liệu &amp; touch</h2>
<p class="lead">App phản ứng với chạm và gõ. <code>TextInput</code> bắt chữ vào state; <code>Pressable</code>/<code>Button</code> bắt chạm. Khuôn controlled-input từ React áp dụng trực tiếp.</p>
<h3>Một text input được kiểm soát</h3>
<div class="out"><pre><span class="tok-keyword">const</span> [name, setName] = <span class="tok-function">useState</span>(<span class="tok-string">''</span>);

&lt;TextInput
  value={name}
  onChangeText={setName}
  placeholder=<span class="tok-string">"Your name"</span>
  style={{ borderWidth: <span class="tok-number">1</span>, padding: <span class="tok-number">8</span> }}
/&gt;
&lt;Text&gt;Hello {name}&lt;/Text&gt;</pre>
<em><code>onChangeText</code> cho bạn chuỗi trực tiếp (không phải event) — một tiện lợi nhỏ của mobile so với input web.</em></div>
<h3>Touchable</h3>
<div class="out"><pre>&lt;Pressable onPress={handleSave} style={{ padding: <span class="tok-number">12</span> }}&gt;
  &lt;Text&gt;Save&lt;/Text&gt;
&lt;/Pressable&gt;</pre>
<em><code>Pressable</code> là touchable hiện đại linh hoạt — nó có thể style khác khi đang nhấn, khác một Button thường.</em></div>
<h3>Validation form đơn giản</h3>
<div class="out"><pre><span class="tok-keyword">function</span> <span class="tok-function">handleSave</span>() {
  <span class="tok-keyword">if</span> (!name.<span class="tok-function">trim</span>()) {
    Alert.<span class="tok-function">alert</span>(<span class="tok-string">'Please enter a name'</span>);
    <span class="tok-keyword">return</span>;
  }
  <span class="tok-comment">// luu…</span>
}</pre></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xử lý bàn phím để nó không che input.</b> Trên mobile, bàn phím trên màn có thể che field đang gõ. Bọc form trong <code>&lt;KeyboardAvoidingView&gt;</code> và dùng props <code>keyboardType</code> / <code>autoCapitalize</code> / <code>secureTextEntry</code> cho bàn phím đúng theo từng field. Những chi tiết bàn phím này là dấu ấn của một app mobile chỉn chu — vô hình khi làm đúng, chói mắt khi bỏ qua — và giáo trình mặc định nhưng không luyện.</div>
<div class="pitfall">Một <code>TextInput</code> không kiểm soát (không <code>value</code>/<code>onChangeText</code>) sẽ không cho bạn đọc hay reset chữ bằng code. Luôn bind nó với state cho một input được kiểm soát bạn có thể validate và xoá.</div>
</div>`,
        },
        {
          title: 'Quiz 2 — Navigation & input|||Quiz 2 — Điều hướng & nhập liệu',
          slug: 'mma301-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra React Navigation, params, TextInput và touch.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'To push from Home to a Detail screen you use a… navigator.|||Để đẩy từ Home sang màn Detail bạn dùng navigator…', options: ['tab', 'stack', 'drawer only', 'modal only'], correctIndex: 1, points: 1 },
              { question: 'You read a passed parameter in the target screen via…|||Bạn đọc một tham số được truyền ở màn đích qua…', options: ['props.params', 'route.params', 'navigation.params', 'this.state'], correctIndex: 1, points: 1 },
              { question: 'A controlled TextInput needs value plus…|||Một TextInput được kiểm soát cần value cộng…', options: ['onChange', 'onChangeText', 'onInput', 'onKeyPress'], correctIndex: 1, points: 1 },
              { question: 'Everything navigable must be wrapped once in…|||Mọi thứ điều hướng được phải bọc một lần trong…', options: ['<Stack.Navigator>', '<NavigationContainer>', '<SafeAreaView>', '<View>'], correctIndex: 1, points: 1 },
              { question: 'The flexible modern touchable that can style while pressed is…|||Touchable hiện đại linh hoạt có thể style khi nhấn là…', options: ['Button', 'Pressable', 'Text', 'View'], correctIndex: 1, points: 1 },
              { question: 'Real apps combine navigators as… (beyond-syllabus)|||App thật kết hợp navigator dạng… (ngoài giáo trình)', options: ['one flat stack only|||chỉ một stack phẳng', 'a tab navigator with a stack inside each tab|||một tab navigator với stack bên trong mỗi tab', 'no navigator|||không navigator', 'only modals|||chỉ modal'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — STATE & LISTS ══════════════════ */
    {
      title: 'Chapter 3 — State management & lists|||Chương 3 — Quản lý state & danh sách',
      description: 'State với hooks (useState/useEffect), state toàn cục với Redux Toolkit, và hiển thị dữ liệu với FlatList/SectionList.',
      lessons: [
        {
          title: '3.1 — State with hooks & Redux|||3.1 — State với hooks & Redux',
          slug: 'mma301-3-1-state-redux',
          type: 'VIDEO',
          description: 'useState/useEffect cho state cục bộ, và Redux Toolkit cho state dùng chung toàn app.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Local state vs global state (CLO6)</h2>
<p class="lead">Use <strong>hooks</strong> for state that lives in one screen; reach for <strong>Redux</strong> when many screens share the same data (a logged-in user, a cart). Do not over-engineer — most apps need Redux for only a slice of their state.</p>
<h3>Local state with hooks</h3>
<div class="out"><pre><span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(<span class="tok-number">0</span>);

<span class="tok-function">useEffect</span>(() =&gt; {
  <span class="tok-comment">// runs after render — good for fetching</span>
  <span class="tok-function">loadData</span>();
}, []); <span class="tok-comment">// [] = run once on mount</span></pre></div>
<h3>Global state with Redux Toolkit</h3>
<div class="out"><pre><span class="tok-comment">// a slice = state + reducers</span>
<span class="tok-keyword">const</span> cartSlice = <span class="tok-function">createSlice</span>({
  name: <span class="tok-string">'cart'</span>,
  initialState: { items: [] },
  reducers: {
    <span class="tok-function">addItem</span>(state, action) { state.items.<span class="tok-function">push</span>(action.payload); },
  },
});

<span class="tok-comment">// in a component</span>
<span class="tok-keyword">const</span> items = <span class="tok-function">useSelector</span>(s =&gt; s.cart.items);
<span class="tok-keyword">const</span> dispatch = <span class="tok-function">useDispatch</span>();
dispatch(<span class="tok-function">addItem</span>({ id: <span class="tok-number">1</span> }));</pre>
<em>Redux Toolkit lets you "mutate" state in reducers (it uses Immer under the hood) — far less boilerplate than classic Redux.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lift state only as high as it needs to go.</b> Not everything belongs in Redux. Screen-local UI (a toggle, a text input) stays in <code>useState</code>; truly shared domain data (user, cart) goes in Redux. Over-globalising state makes every change ripple through the whole app and slows it down. Knowing <em>where</em> a piece of state belongs is a design judgement the "use Redux" lesson does not teach — but graders and code reviewers notice.</div>
<div class="pitfall">A <code>useEffect</code> with a missing or wrong dependency array causes bugs: <code>[]</code> runs once, no array runs every render (often an infinite loop when it sets state). Always think about what the effect depends on.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>State cục bộ vs state toàn cục (CLO6)</h2>
<p class="lead">Dùng <strong>hooks</strong> cho state sống trong một màn; dùng <strong>Redux</strong> khi nhiều màn chia sẻ cùng dữ liệu (user đã đăng nhập, giỏ hàng). Đừng over-engineer — hầu hết app chỉ cần Redux cho một phần state.</p>
<h3>State cục bộ với hooks</h3>
<div class="out"><pre><span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(<span class="tok-number">0</span>);

<span class="tok-function">useEffect</span>(() =&gt; {
  <span class="tok-comment">// chay sau render — tot cho fetch</span>
  <span class="tok-function">loadData</span>();
}, []); <span class="tok-comment">// [] = chay mot lan khi mount</span></pre></div>
<h3>State toàn cục với Redux Toolkit</h3>
<div class="out"><pre><span class="tok-comment">// mot slice = state + reducer</span>
<span class="tok-keyword">const</span> cartSlice = <span class="tok-function">createSlice</span>({
  name: <span class="tok-string">'cart'</span>,
  initialState: { items: [] },
  reducers: {
    <span class="tok-function">addItem</span>(state, action) { state.items.<span class="tok-function">push</span>(action.payload); },
  },
});

<span class="tok-comment">// trong mot component</span>
<span class="tok-keyword">const</span> items = <span class="tok-function">useSelector</span>(s =&gt; s.cart.items);
<span class="tok-keyword">const</span> dispatch = <span class="tok-function">useDispatch</span>();
dispatch(<span class="tok-function">addItem</span>({ id: <span class="tok-number">1</span> }));</pre>
<em>Redux Toolkit cho bạn "mutate" state trong reducer (nó dùng Immer bên dưới) — ít boilerplate hơn nhiều so với Redux cổ điển.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nâng state chỉ cao đúng mức cần.</b> Không phải mọi thứ thuộc về Redux. UI cục bộ của màn (một toggle, một text input) ở lại <code>useState</code>; dữ liệu domain thật sự dùng chung (user, cart) vào Redux. Toàn-cục-hoá quá mức làm mọi thay đổi lan qua cả app và làm chậm. Biết một mảnh state thuộc <em>ở đâu</em> là một phán đoán thiết kế mà bài "dùng Redux" không dạy — nhưng giám khảo và code reviewer để ý.</div>
<div class="pitfall">Một <code>useEffect</code> thiếu hoặc sai mảng phụ thuộc gây bug: <code>[]</code> chạy một lần, không có mảng chạy mỗi render (thường vòng lặp vô hạn khi nó set state). Luôn nghĩ effect phụ thuộc vào cái gì.</div>
</div>`,
        },
        {
          title: '3.2 — FlatList & SectionList for data|||3.2 — FlatList & SectionList cho dữ liệu',
          slug: 'mma301-3-2-flatlist',
          type: 'VIDEO',
          description: 'Hiển thị danh sách hiệu quả với FlatList, keyExtractor, renderItem, và SectionList.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Efficient lists with FlatList (CLO7)</h2>
<p class="lead">Never render a long list by mapping inside a ScrollView — it builds every row at once and janks. <strong>FlatList</strong> renders only the visible rows and recycles them, staying smooth with thousands of items.</p>
<h3>FlatList basics</h3>
<div class="out"><pre>&lt;FlatList
  data={products}
  keyExtractor={(item) =&gt; item.id.<span class="tok-function">toString</span>()}
  renderItem={({ item }) =&gt; (
    &lt;View style={styles.row}&gt;
      &lt;Text&gt;{item.name}&lt;/Text&gt;
    &lt;/View&gt;
  )}
/&gt;</pre>
<em>Three key props: <code>data</code> (the array), <code>keyExtractor</code> (a unique id per row), and <code>renderItem</code> (how to draw one row).</em></div>
<h3>SectionList — grouped data</h3>
<div class="out"><pre>&lt;SectionList
  sections={[
    { title: <span class="tok-string">'Fruit'</span>, data: [<span class="tok-string">'Apple'</span>, <span class="tok-string">'Mango'</span>] },
    { title: <span class="tok-string">'Veg'</span>, data: [<span class="tok-string">'Carrot'</span>] },
  ]}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item}&lt;/Text&gt;}
  renderSectionHeader={({ section }) =&gt; &lt;Text&gt;{section.title}&lt;/Text&gt;}
/&gt;</pre>
<em>SectionList is FlatList with headers — perfect for grouped data (contacts by letter, items by category).</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>FlatList has performance props most students never touch.</b> <code>initialNumToRender</code>, <code>windowSize</code>, <code>getItemLayout</code> and a memoised <code>renderItem</code> keep long lists at 60fps. And use <code>ListEmptyComponent</code> for a friendly empty state and <code>onEndReached</code> for infinite scroll. Knowing these turns a laggy list into a native-smooth one — the exact polish that impresses at the project defense.</div>
<div class="pitfall">A missing or non-unique <code>keyExtractor</code> causes wrong rows to update, flicker, or lose scroll position. Every item needs a stable, unique key — never the array index if the list can reorder.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Danh sách hiệu quả với FlatList (CLO7)</h2>
<p class="lead">Đừng bao giờ render một danh sách dài bằng cách map trong ScrollView — nó dựng mọi hàng cùng lúc và giật. <strong>FlatList</strong> chỉ render hàng đang thấy và tái dùng chúng, mượt với hàng nghìn mục.</p>
<h3>FlatList cơ bản</h3>
<div class="out"><pre>&lt;FlatList
  data={products}
  keyExtractor={(item) =&gt; item.id.<span class="tok-function">toString</span>()}
  renderItem={({ item }) =&gt; (
    &lt;View style={styles.row}&gt;
      &lt;Text&gt;{item.name}&lt;/Text&gt;
    &lt;/View&gt;
  )}
/&gt;</pre>
<em>Ba props then chốt: <code>data</code> (mảng), <code>keyExtractor</code> (id duy nhất mỗi hàng), và <code>renderItem</code> (cách vẽ một hàng).</em></div>
<h3>SectionList — dữ liệu nhóm</h3>
<div class="out"><pre>&lt;SectionList
  sections={[
    { title: <span class="tok-string">'Fruit'</span>, data: [<span class="tok-string">'Apple'</span>, <span class="tok-string">'Mango'</span>] },
    { title: <span class="tok-string">'Veg'</span>, data: [<span class="tok-string">'Carrot'</span>] },
  ]}
  renderItem={({ item }) =&gt; &lt;Text&gt;{item}&lt;/Text&gt;}
  renderSectionHeader={({ section }) =&gt; &lt;Text&gt;{section.title}&lt;/Text&gt;}
/&gt;</pre>
<em>SectionList là FlatList có header — hoàn hảo cho dữ liệu nhóm (danh bạ theo chữ cái, mục theo danh mục).</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>FlatList có các props hiệu năng hầu hết sinh viên không chạm.</b> <code>initialNumToRender</code>, <code>windowSize</code>, <code>getItemLayout</code> và một <code>renderItem</code> đã memo giữ danh sách dài ở 60fps. Và dùng <code>ListEmptyComponent</code> cho trạng thái rỗng thân thiện và <code>onEndReached</code> cho cuộn vô hạn. Biết những cái này biến một danh sách giật thành mượt native — đúng sự chỉn chu gây ấn tượng ở buổi vấn đáp project.</div>
<div class="pitfall">Một <code>keyExtractor</code> thiếu hoặc không duy nhất làm sai hàng cập nhật, nhấp nháy, hoặc mất vị trí cuộn. Mỗi mục cần một key ổn định, duy nhất — đừng dùng chỉ số mảng nếu danh sách có thể sắp lại.</div>
</div>`,
        },
        {
          title: 'Quiz 3 — State & lists|||Quiz 3 — State & danh sách',
          slug: 'mma301-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra hooks, Redux, FlatList và keyExtractor.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For state shared across many screens you would reach for…|||Cho state dùng chung nhiều màn bạn dùng…', options: ['useState only|||chỉ useState', 'Redux|||Redux', 'a global variable|||một biến toàn cục', 'nothing|||không gì'], correctIndex: 1, points: 1 },
              { question: 'A useEffect with a [] dependency array runs…|||Một useEffect với mảng phụ thuộc [] chạy…', options: ['every render|||mỗi render', 'once on mount|||một lần khi mount', 'never|||không bao giờ', 'only on unmount|||chỉ khi unmount'], correctIndex: 1, points: 1 },
              { question: 'To render a long list efficiently you use…|||Để render danh sách dài hiệu quả bạn dùng…', options: ['ScrollView with map|||ScrollView với map', 'FlatList', 'a for loop|||một vòng for', 'View only|||chỉ View'], correctIndex: 1, points: 1 },
              { question: 'The FlatList prop that gives each row a unique key is…|||Prop của FlatList cho mỗi hàng một key duy nhất là…', options: ['renderItem', 'keyExtractor', 'data', 'sections'], correctIndex: 1, points: 1 },
              { question: 'For grouped data with headers you use…|||Cho dữ liệu nhóm có header bạn dùng…', options: ['FlatList', 'SectionList', 'ScrollView', 'View'], correctIndex: 1, points: 1 },
              { question: 'To keep a very long FlatList at 60fps you can tune props like… (beyond-syllabus)|||Để giữ một FlatList rất dài ở 60fps bạn có thể tinh chỉnh props như… (ngoài giáo trình)', options: ['color and fontSize|||màu và fontSize', 'windowSize, initialNumToRender, getItemLayout|||windowSize, initialNumToRender, getItemLayout', 'title and value|||title và value', 'none exist|||không có cái nào'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — DATA & NOTIFICATIONS ══════════════════ */
    {
      title: 'Chapter 4 — Data storage & notifications|||Chương 4 — Lưu trữ dữ liệu & thông báo',
      description: 'Lưu trữ với AsyncStorage/SQLite/Firebase Realtime Database, và push notification (FCM/Expo).',
      lessons: [
        {
          title: '4.1 — Storing data: AsyncStorage, SQLite & Firebase|||4.1 — Lưu dữ liệu: AsyncStorage, SQLite & Firebase',
          slug: 'mma301-4-1-storage',
          type: 'VIDEO',
          description: 'Ba cấp lưu trữ và khi nào dùng cái nào: key-value, SQL cục bộ, và cloud realtime.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Persisting data (CLO9)</h2>
<p class="lead">In-memory state (<code>useState</code>) is gone on restart. To keep data, pick a storage layer matched to your needs — from simple key-value to a full cloud database.</p>
<table>
  <thead><tr><th>Option</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td>AsyncStorage</td><td>Small key-value data (settings, a token, a small list)</td></tr>
    <tr><td>SQLite (expo-sqlite)</td><td>Structured, relational, offline data with queries</td></tr>
    <tr><td>Firebase Realtime DB / Firestore</td><td>Cloud data, synced across devices, realtime</td></tr>
  </tbody>
</table>
<h3>AsyncStorage — the simplest</h3>
<div class="out"><pre><span class="tok-keyword">import</span> AsyncStorage <span class="tok-keyword">from</span> <span class="tok-string">'@react-native-async-storage/async-storage'</span>;

<span class="tok-comment">// save (values are strings — JSON.stringify objects)</span>
<span class="tok-keyword">await</span> AsyncStorage.<span class="tok-function">setItem</span>(<span class="tok-string">'notes'</span>, JSON.<span class="tok-function">stringify</span>(notes));
<span class="tok-comment">// load</span>
<span class="tok-keyword">const</span> raw = <span class="tok-keyword">await</span> AsyncStorage.<span class="tok-function">getItem</span>(<span class="tok-string">'notes'</span>);
<span class="tok-keyword">const</span> notes = raw ? JSON.<span class="tok-function">parse</span>(raw) : [];</pre></div>
<h3>Firebase Realtime Database — cloud &amp; synced</h3>
<div class="out"><pre><span class="tok-comment">// write</span>
<span class="tok-keyword">await</span> <span class="tok-function">set</span>(<span class="tok-function">ref</span>(db, <span class="tok-string">'notes/1'</span>), { text: <span class="tok-string">'Buy milk'</span> });
<span class="tok-comment">// listen in realtime</span>
<span class="tok-function">onValue</span>(<span class="tok-function">ref</span>(db, <span class="tok-string">'notes'</span>), (snap) =&gt; setNotes(snap.<span class="tok-function">val</span>()));</pre>
<em>Firebase syncs data live across all devices — the same note appears on every logged-in phone instantly.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Match the storage to the data, not the hype.</b> A settings toggle does not need Firebase; a shared, multi-user list does not fit AsyncStorage. Rule of thumb: key-value → AsyncStorage; structured/offline queries → SQLite; multi-device/realtime → Firebase. Choosing the lightest tool that fits is an engineering judgement — using Firebase for a single-user notes app is over-engineering the syllabus lists options for but does not rank.</div>
<div class="pitfall">AsyncStorage only stores <strong>strings</strong>. Forgetting <code>JSON.stringify</code> on save (and <code>JSON.parse</code> on load) stores <code>[object Object]</code> and loses your data silently.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Lưu trữ dữ liệu (CLO9)</h2>
<p class="lead">State trong bộ nhớ (<code>useState</code>) mất khi restart. Để giữ dữ liệu, chọn một lớp lưu trữ khớp nhu cầu — từ key-value đơn giản tới một database cloud đầy đủ.</p>
<table>
  <thead><tr><th>Lựa chọn</th><th>Tốt nhất cho</th></tr></thead>
  <tbody>
    <tr><td>AsyncStorage</td><td>Dữ liệu key-value nhỏ (cài đặt, một token, một danh sách nhỏ)</td></tr>
    <tr><td>SQLite (expo-sqlite)</td><td>Dữ liệu có cấu trúc, quan hệ, offline có truy vấn</td></tr>
    <tr><td>Firebase Realtime DB / Firestore</td><td>Dữ liệu cloud, đồng bộ qua nhiều thiết bị, realtime</td></tr>
  </tbody>
</table>
<h3>AsyncStorage — đơn giản nhất</h3>
<div class="out"><pre><span class="tok-keyword">import</span> AsyncStorage <span class="tok-keyword">from</span> <span class="tok-string">'@react-native-async-storage/async-storage'</span>;

<span class="tok-comment">// luu (gia tri la chuoi — JSON.stringify object)</span>
<span class="tok-keyword">await</span> AsyncStorage.<span class="tok-function">setItem</span>(<span class="tok-string">'notes'</span>, JSON.<span class="tok-function">stringify</span>(notes));
<span class="tok-comment">// doc</span>
<span class="tok-keyword">const</span> raw = <span class="tok-keyword">await</span> AsyncStorage.<span class="tok-function">getItem</span>(<span class="tok-string">'notes'</span>);
<span class="tok-keyword">const</span> notes = raw ? JSON.<span class="tok-function">parse</span>(raw) : [];</pre></div>
<h3>Firebase Realtime Database — cloud &amp; đồng bộ</h3>
<div class="out"><pre><span class="tok-comment">// ghi</span>
<span class="tok-keyword">await</span> <span class="tok-function">set</span>(<span class="tok-function">ref</span>(db, <span class="tok-string">'notes/1'</span>), { text: <span class="tok-string">'Buy milk'</span> });
<span class="tok-comment">// nghe realtime</span>
<span class="tok-function">onValue</span>(<span class="tok-function">ref</span>(db, <span class="tok-string">'notes'</span>), (snap) =&gt; setNotes(snap.<span class="tok-function">val</span>()));</pre>
<em>Firebase đồng bộ dữ liệu trực tiếp qua mọi thiết bị — cùng một note hiện trên mọi điện thoại đã đăng nhập tức thì.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khớp lưu trữ với dữ liệu, không theo trend.</b> Một toggle cài đặt không cần Firebase; một danh sách chia sẻ nhiều người dùng không hợp AsyncStorage. Kinh nghiệm: key-value → AsyncStorage; truy vấn có cấu trúc/offline → SQLite; nhiều thiết bị/realtime → Firebase. Chọn công cụ nhẹ nhất vừa vặn là một phán đoán kỹ thuật — dùng Firebase cho một app ghi chú một-người-dùng là over-engineer mà giáo trình liệt kê lựa chọn nhưng không xếp hạng.</div>
<div class="pitfall">AsyncStorage chỉ lưu <strong>chuỗi</strong>. Quên <code>JSON.stringify</code> khi lưu (và <code>JSON.parse</code> khi đọc) sẽ lưu <code>[object Object]</code> và mất dữ liệu âm thầm.</div>
</div>`,
        },
        {
          title: '4.2 — Push notifications|||4.2 — Push notification',
          slug: 'mma301-4-2-notifications',
          type: 'VIDEO',
          description: 'Local vs push notification, Expo Notifications / Firebase FCM, và luồng gửi thông báo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Notifications (CLO11-12)</h2>
<p class="lead">Notifications bring users back to your app. Two kinds: <strong>local</strong> (scheduled by the app itself, e.g., a reminder) and <strong>push</strong> (sent from a server via FCM/Expo, e.g., "your order shipped").</p>
<h3>The push notification flow</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Permission</b><span>app asks the user to allow notifications</span></div>
  <div class="lz-step"><b>Token</b><span>device registers, gets a push token</span></div>
  <div class="lz-step"><b>Send</b><span>your server sends to that token via FCM / Expo push</span></div>
  <div class="lz-step"><b>Receive</b><span>the app shows the notification, handles the tap</span></div>
</div>
<h3>A local notification (Expo)</h3>
<div class="out"><pre><span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> Notifications <span class="tok-keyword">from</span> <span class="tok-string">'expo-notifications'</span>;

<span class="tok-comment">// ask permission first</span>
<span class="tok-keyword">await</span> Notifications.<span class="tok-function">requestPermissionsAsync</span>();

<span class="tok-comment">// schedule a reminder in 60 seconds</span>
<span class="tok-keyword">await</span> Notifications.<span class="tok-function">scheduleNotificationAsync</span>({
  content: { title: <span class="tok-string">'Reminder'</span>, body: <span class="tok-string">'Time to study!'</span> },
  trigger: { seconds: <span class="tok-number">60</span> },
});</pre></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Always request permission at the right moment, and handle refusal.</b> Asking for notification permission on the very first launch (before the user sees value) gets a "No" that is hard to reverse. Ask <em>after</em> the user does something that would benefit (creates a reminder). And your app must work when permission is denied — never crash or block. This permission UX is a real mobile skill the "add notifications" instruction glosses over.</div>
<div class="pitfall">Push notifications require a real device and real credentials (FCM key / Expo project) — they do <strong>not</strong> work in a plain iOS simulator. Test local notifications on the simulator, but push on a physical device.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Thông báo (CLO11-12)</h2>
<p class="lead">Thông báo kéo người dùng trở lại app. Hai loại: <strong>local</strong> (do chính app lên lịch, vd một nhắc nhở) và <strong>push</strong> (gửi từ server qua FCM/Expo, vd "đơn của bạn đã giao").</p>
<h3>Luồng push notification</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Quyền</b><span>app hỏi người dùng cho phép thông báo</span></div>
  <div class="lz-step"><b>Token</b><span>thiết bị đăng ký, nhận một push token</span></div>
  <div class="lz-step"><b>Gửi</b><span>server của bạn gửi tới token đó qua FCM / Expo push</span></div>
  <div class="lz-step"><b>Nhận</b><span>app hiện thông báo, xử lý cú chạm</span></div>
</div>
<h3>Một local notification (Expo)</h3>
<div class="out"><pre><span class="tok-keyword">import</span> * <span class="tok-keyword">as</span> Notifications <span class="tok-keyword">from</span> <span class="tok-string">'expo-notifications'</span>;

<span class="tok-comment">// xin quyen truoc</span>
<span class="tok-keyword">await</span> Notifications.<span class="tok-function">requestPermissionsAsync</span>();

<span class="tok-comment">// len lich mot nhac nho sau 60 giay</span>
<span class="tok-keyword">await</span> Notifications.<span class="tok-function">scheduleNotificationAsync</span>({
  content: { title: <span class="tok-string">'Reminder'</span>, body: <span class="tok-string">'Time to study!'</span> },
  trigger: { seconds: <span class="tok-number">60</span> },
});</pre></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Luôn xin quyền đúng thời điểm, và xử lý khi bị từ chối.</b> Hỏi quyền thông báo ngay lần mở đầu tiên (trước khi người dùng thấy giá trị) sẽ nhận một "Không" khó đảo. Hãy hỏi <em>sau</em> khi người dùng làm gì đó có lợi (tạo một nhắc nhở). Và app phải chạy được khi quyền bị từ chối — đừng bao giờ crash hay chặn. UX quyền này là một kỹ năng mobile thật mà chỉ dẫn "thêm notification" lướt qua.</div>
<div class="pitfall">Push notification cần thiết bị thật và credentials thật (FCM key / Expo project) — nó <strong>không</strong> chạy trong iOS simulator thường. Test local notification trên simulator, nhưng push trên thiết bị vật lý.</div>
</div>`,
        },
        {
          title: 'Quiz 4 — Data & notifications|||Quiz 4 — Dữ liệu & thông báo',
          slug: 'mma301-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra AsyncStorage/SQLite/Firebase và notification.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'To keep data after the app restarts you must…|||Để giữ dữ liệu sau khi app restart bạn phải…', options: ['use more useState|||dùng thêm useState', 'persist it (AsyncStorage/SQLite/Firebase)|||lưu nó (AsyncStorage/SQLite/Firebase)', 'add a bigger phone|||dùng điện thoại lớn hơn', 'nothing, it is automatic|||không gì, tự động'], correctIndex: 1, points: 1 },
              { question: 'AsyncStorage stores values as…|||AsyncStorage lưu giá trị dạng…', options: ['objects', 'strings', 'numbers', 'SQL rows'], correctIndex: 1, points: 1 },
              { question: 'For cloud data synced across devices in realtime you use…|||Cho dữ liệu cloud đồng bộ qua thiết bị realtime bạn dùng…', options: ['AsyncStorage', 'SQLite', 'Firebase', 'useState'], correctIndex: 2, points: 1 },
              { question: 'A notification scheduled by the app itself is a… notification.|||Một thông báo do chính app lên lịch là notification…', options: ['push', 'local', 'remote', 'server'], correctIndex: 1, points: 1 },
              { question: 'Push notifications require, at minimum…|||Push notification cần, tối thiểu…', options: ['only a simulator|||chỉ một simulator', 'a real device and credentials (FCM/Expo)|||một thiết bị thật và credentials (FCM/Expo)', 'no internet|||không internet', 'a web browser|||một trình duyệt web'], correctIndex: 1, points: 1 },
              { question: 'The best time to ask for notification permission is… (beyond-syllabus)|||Thời điểm tốt nhất để xin quyền thông báo là… (ngoài giáo trình)', options: ['immediately on first launch|||ngay lần mở đầu tiên', 'after the user does something that benefits from it|||sau khi người dùng làm gì đó được lợi', 'never|||không bao giờ', 'only on uninstall|||chỉ khi gỡ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — GEMINI AI, DEBUG & PUBLISH ══════════════════ */
    {
      title: 'Chapter 5 — Gemini AI, debugging & publishing|||Chương 5 — Gemini AI, debug & phát hành',
      description: 'Tích hợp Gemini AI vào app (CLO10), debug bằng DevTools (CLO8), và phát hành bằng Expo EAS (CLO13).',
      lessons: [
        {
          title: '5.1 — Integrating Gemini AI|||5.1 — Tích hợp Gemini AI',
          slug: 'mma301-5-1-gemini-ai',
          type: 'VIDEO',
          description: 'Gọi Gemini API từ app, xây một tính năng AI, và giữ API key an toàn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Integrating Gemini AI (CLO10)</h2>
<p class="lead">Adding a GenAI feature makes your project stand out. You call the Gemini API with a prompt and show the response — an AI chat, a summariser, a recipe generator. The pattern is: send a prompt, await text, render it.</p>
<h3>Calling Gemini</h3>
<div class="out"><pre><span class="tok-comment">// send a prompt, get a text response</span>
<span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(GEMINI_URL, {
  method: <span class="tok-string">'POST'</span>,
  headers: { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> },
  body: JSON.<span class="tok-function">stringify</span>({
    contents: [{ parts: [{ text: prompt }] }]
  }),
});
<span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();
<span class="tok-keyword">const</span> answer = data.candidates[<span class="tok-number">0</span>].content.parts[<span class="tok-number">0</span>].text;
<span class="tok-function">setMessages</span>((prev) =&gt; [...prev, { role: <span class="tok-string">'ai'</span>, text: answer }]);</pre>
<em>Show a loading state while awaiting, and render the answer in a Text bubble. The AI feature is just an async fetch plus good UI.</em></div>
<h3>Responsible AI in your app</h3>
<div class="callout ok">Treat AI output as a <em>draft</em>, not truth: show it clearly as AI-generated, let the user edit or reject it, and never auto-act on it (e.g., don't auto-save an AI "recipe" as fact). Handle errors and empty responses gracefully.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Never ship the API key in the app bundle.</b> A key embedded in the mobile app can be extracted from the installed binary and abused (running up your bill). The professional pattern is a tiny backend proxy: the app calls <em>your</em> server, which holds the key and calls Gemini. For a class project, at minimum keep the key out of source control and rotate it. Key management is a real-world concern the "integrate AI" instruction never mentions — but a leaked key is a genuine incident.</div>
<div class="pitfall">AI responses can be slow (several seconds) — if you do not show a loading indicator and disable the send button, users tap repeatedly and fire duplicate requests. Always reflect the in-flight state in the UI.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Tích hợp Gemini AI (CLO10)</h2>
<p class="lead">Thêm một tính năng GenAI làm project của bạn nổi bật. Bạn gọi Gemini API với một prompt và hiện response — một chat AI, một bộ tóm tắt, một trình sinh công thức. Khuôn là: gửi prompt, await text, render nó.</p>
<h3>Gọi Gemini</h3>
<div class="out"><pre><span class="tok-comment">// gui mot prompt, nhan mot response text</span>
<span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(GEMINI_URL, {
  method: <span class="tok-string">'POST'</span>,
  headers: { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> },
  body: JSON.<span class="tok-function">stringify</span>({
    contents: [{ parts: [{ text: prompt }] }]
  }),
});
<span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();
<span class="tok-keyword">const</span> answer = data.candidates[<span class="tok-number">0</span>].content.parts[<span class="tok-number">0</span>].text;
<span class="tok-function">setMessages</span>((prev) =&gt; [...prev, { role: <span class="tok-string">'ai'</span>, text: answer }]);</pre>
<em>Hiện trạng thái loading khi await, và render câu trả lời trong một bong bóng Text. Tính năng AI chỉ là một async fetch cộng UI tốt.</em></div>
<h3>AI có trách nhiệm trong app của bạn</h3>
<div class="callout ok">Coi đầu ra AI là một <em>bản nháp</em>, không phải chân lý: hiện rõ nó do AI tạo, để người dùng sửa hoặc từ chối, và đừng bao giờ tự động hành động theo nó (vd đừng tự lưu một "công thức" AI như sự thật). Xử lý lỗi và response rỗng một cách nhẹ nhàng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đừng bao giờ ship API key trong bundle app.</b> Một key nhúng trong app mobile có thể bị trích từ binary đã cài và lạm dụng (làm bạn tốn tiền). Khuôn chuyên nghiệp là một backend proxy nhỏ: app gọi <em>server của bạn</em>, server giữ key và gọi Gemini. Cho một project lớp học, tối thiểu giữ key ngoài source control và xoay nó. Quản lý key là một mối lo thực tế mà chỉ dẫn "tích hợp AI" không nhắc — nhưng một key rò rỉ là một sự cố thật.</div>
<div class="pitfall">Response AI có thể chậm (vài giây) — nếu không hiện chỉ báo loading và vô hiệu nút gửi, người dùng chạm liên tục và bắn request trùng. Luôn phản ánh trạng thái đang-xử-lý trong UI.</div>
</div>`,
        },
        {
          title: '5.2 — Debugging & publishing with Expo|||5.2 — Debug & phát hành với Expo',
          slug: 'mma301-5-2-debug-publish',
          type: 'VIDEO',
          description: 'Công cụ debug (DevTools, console, Hermes), và build + phát hành app bằng Expo EAS.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Debugging (CLO8) &amp; publishing (CLO13)</h2>
<p class="lead">Two final skills close the loop: finding bugs efficiently, and getting your app into users' hands.</p>
<h3>Debugging tools</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Fast Refresh</b> — code changes appear instantly without losing state.</div>
  <div class="lz-layer"><b>React Native DevTools</b> — inspect the component tree, props, and state.</div>
  <div class="lz-layer"><b>console.log + LogBox</b> — the humble log; LogBox surfaces warnings/errors on screen.</div>
  <div class="lz-layer"><b>Error boundaries</b> — catch a crashing component so the whole app does not white-screen.</div>
</div>
<h3>Publishing with Expo EAS</h3>
<div class="out"><pre><span class="tok-comment"># build a real installable app (Android/iOS)</span>
npx eas build --platform android
<span class="tok-comment"># submit to a store, or share the build link for testing</span>
npx eas submit</pre>
<em>EAS (Expo Application Services) builds a real .apk/.ipa in the cloud and can submit to the Play Store / App Store — no local native toolchain needed.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Read the error message before changing code.</b> React Native's red error screen names the file and line and often the exact problem ("undefined is not an object"). Students who guess-and-change waste hours; students who read the stack trace fix in minutes. Add a <code>console.log</code> right before the failing line to inspect the actual value. Disciplined debugging — read, hypothesise, verify — is a skill the "use DevTools" lesson names but does not teach as a method.</div>
<div class="pitfall">Publishing needs app metadata (icon, name, splash, version) and, for the stores, developer accounts and signing. Do not leave this to the last day — a first EAS build has setup steps that take time to get right.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Debug (CLO8) &amp; phát hành (CLO13)</h2>
<p class="lead">Hai kỹ năng cuối khép vòng: tìm bug hiệu quả, và đưa app đến tay người dùng.</p>
<h3>Công cụ debug</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Fast Refresh</b> — thay đổi code hiện tức thì không mất state.</div>
  <div class="lz-layer"><b>React Native DevTools</b> — soi cây component, props, và state.</div>
  <div class="lz-layer"><b>console.log + LogBox</b> — log khiêm tốn; LogBox hiện cảnh báo/lỗi lên màn.</div>
  <div class="lz-layer"><b>Error boundaries</b> — bắt một component crash để cả app không trắng màn.</div>
</div>
<h3>Phát hành với Expo EAS</h3>
<div class="out"><pre><span class="tok-comment"># build mot app cai dat duoc that (Android/iOS)</span>
npx eas build --platform android
<span class="tok-comment"># nop len store, hoac chia se link build de test</span>
npx eas submit</pre>
<em>EAS (Expo Application Services) build một .apk/.ipa thật trên cloud và có thể nộp lên Play Store / App Store — không cần bộ công cụ native cục bộ.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc thông báo lỗi trước khi đổi code.</b> Màn lỗi đỏ của React Native nêu tên file và dòng và thường chính xác vấn đề ("undefined is not an object"). Sinh viên đoán-rồi-đổi phí hàng giờ; sinh viên đọc stack trace sửa trong vài phút. Thêm một <code>console.log</code> ngay trước dòng lỗi để soi giá trị thật. Debug có kỷ luật — đọc, giả thuyết, kiểm chứng — là một kỹ năng mà bài "dùng DevTools" gọi tên nhưng không dạy như một phương pháp.</div>
<div class="pitfall">Phát hành cần metadata app (icon, tên, splash, version) và, với store, tài khoản developer và ký. Đừng để tới ngày cuối — một EAS build đầu tiên có các bước setup cần thời gian làm đúng.</div>
</div>`,
        },
        {
          title: 'Quiz 5 — Gemini AI, debug & publish|||Quiz 5 — Gemini AI, debug & phát hành',
          slug: 'mma301-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra tích hợp AI, debug và phát hành.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The core pattern of an in-app AI feature is…|||Khuôn cốt lõi của một tính năng AI trong app là…', options: ['render static text|||render text tĩnh', 'send a prompt, await the response, render it|||gửi prompt, await response, render nó', 'store data locally|||lưu dữ liệu cục bộ', 'navigate screens|||điều hướng màn'], correctIndex: 1, points: 1 },
              { question: 'While waiting for a slow AI response you should…|||Khi chờ một response AI chậm bạn nên…', options: ['do nothing|||không làm gì', 'show a loading state and disable the send button|||hiện loading và vô hiệu nút gửi', 'send it again|||gửi lại', 'crash gracefully|||crash nhẹ nhàng'], correctIndex: 1, points: 1 },
              { question: 'To build a real installable app with Expo you use…|||Để build một app cài đặt được thật với Expo bạn dùng…', options: ['npm start', 'eas build', 'git push', 'expo login'], correctIndex: 1, points: 1 },
              { question: 'When you hit a red error screen, the first step is to…|||Khi gặp màn lỗi đỏ, bước đầu tiên là…', options: ['randomly change code|||đổi code ngẫu nhiên', 'read the message and stack trace|||đọc thông báo và stack trace', 'reinstall Node|||cài lại Node', 'delete the file|||xoá file'], correctIndex: 1, points: 1 },
              { question: 'A Gemini API key embedded in the mobile app bundle is risky because it can be… (beyond-syllabus)|||Một Gemini API key nhúng trong bundle app mobile rủi ro vì có thể bị… (ngoài giáo trình)', options: ['too fast|||quá nhanh', 'extracted from the binary and abused|||trích từ binary và lạm dụng', 'automatically encrypted|||tự động mã hoá', 'rotated by Google|||Google tự xoay'], correctIndex: 1, points: 1 },
              { question: 'You should treat AI-generated output as…|||Bạn nên coi đầu ra do AI tạo là…', options: ['absolute truth|||chân lý tuyệt đối', 'a draft the user can edit or reject|||một bản nháp người dùng có thể sửa/từ chối', 'never usable|||không bao giờ dùng được', 'a database|||một database'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — PROJECT, DEFENSE & EXAM PREP ══════════════════ */
    {
      title: 'Chapter 6 — Project, defense & exam prep|||Chương 6 — Project, vấn đáp & ôn thi',
      description: 'Checklist project, ngân hàng câu hỏi Final Project Defense + kịch bản demo, và ngân hàng câu hỏi thi theo CLO — kiểu SWP391.',
      lessons: [
        {
          title: '6.1 — Project checklist, demo script & defense question bank|||6.1 — Checklist project, kịch bản demo & ngân hàng câu hỏi vấn đáp',
          slug: 'mma301-6-1-defense',
          type: 'VIDEO',
          description: 'Danh sách kiểm project theo CLO, kịch bản demo 3 phút, và ngân hàng câu hỏi vấn đáp có gợi ý trả lời.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The project, the demo &amp; the defense</h2>
<p class="lead">The Project ends in a live Final Project Defense: you demo the app and answer questions. Preparation, not luck, decides this. Use the checklist, rehearse a tight demo, and drill the question bank.</p>
<h3>Project checklist (map to CLOs)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Screens &amp; navigation</div><div class="lz-nsub">3–5 screens · stack + tab (CLO3-4)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">A data list</div><div class="lz-nsub">FlatList with keyExtractor (CLO7)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Persisted state</div><div class="lz-nsub">AsyncStorage / SQLite / Firebase (CLO6, CLO9)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">A standout feature</div><div class="lz-nsub">notifications / Gemini AI (CLO10-12)</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Clean styling &amp; no crashes</div><div class="lz-nsub">Flexbox layout · handles empty/error states (CLO5, CLO8)</div></div></div>
</div>
<h3>The 3-minute demo script</h3>
<div class="out"><b>Rehearse this exact path:</b><br>
1. Open the app, show the main screen (5s).<br>
2. Add an item / log in — show input + validation (30s).<br>
3. Show the list updating + navigate to a detail (30s).<br>
4. Restart the app to prove data persists (20s).<br>
5. Trigger the standout feature: a notification or an AI answer (40s).<br>
6. One sentence on the architecture (state, storage) (15s).<br>
<em>Have a fallback: screenshots or a screen recording, in case the live network or device fails.</em></div>
<h3>Defense question bank (with answer hints)</h3>
<ul>
  <li><b>Why React Native, not native?</b> One codebase, two platforms; reuse React skills; faster iteration.</li>
  <li><b>Where is your state and why?</b> Local UI in useState; shared data in Redux — and be able to point to it.</li>
  <li><b>How does data persist?</b> Name your choice (AsyncStorage/SQLite/Firebase) and why it fits.</li>
  <li><b>Why FlatList not ScrollView + map?</b> FlatList virtualises — only renders visible rows.</li>
  <li><b>How do you keep the AI key safe?</b> Not in the bundle; via a proxy / env, and rotate it.</li>
  <li><b>What happens if the network is down?</b> Show your error/empty handling.</li>
  <li><b>Show me where navigation is set up.</b> Point to NavigationContainer + navigators.</li>
  <li><b>Change X live</b> (e.g., add a field): know your code well enough to do it.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Prepare a one-line answer to "what would you improve?"</b> Examiners love asking it. A thoughtful answer ("I'd move the AI key behind a backend proxy and add offline caching") shows engineering maturity and self-awareness — far better than "nothing, it's perfect". Knowing your app's limits is itself a sign of competence the rubric rewards implicitly.</div>
<div class="pitfall">Do not build a feature you cannot explain. If you paste code you do not understand, one defense question exposes it — and it undermines your credibility for the whole session. Understand every line you ship.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Project, demo &amp; vấn đáp</h2>
<p class="lead">Project kết thúc bằng một Final Project Defense trực tiếp: bạn demo app và trả lời câu hỏi. Chuẩn bị, không phải may mắn, quyết định điều này. Dùng checklist, tập một demo gọn, và luyện ngân hàng câu hỏi.</p>
<h3>Checklist project (ánh xạ CLO)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Màn hình &amp; điều hướng</div><div class="lz-nsub">3–5 màn · stack + tab (CLO3-4)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Một danh sách dữ liệu</div><div class="lz-nsub">FlatList có keyExtractor (CLO7)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">State đã lưu</div><div class="lz-nsub">AsyncStorage / SQLite / Firebase (CLO6, CLO9)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Một tính năng nổi bật</div><div class="lz-nsub">notification / Gemini AI (CLO10-12)</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Styling sạch &amp; không crash</div><div class="lz-nsub">layout Flexbox · xử lý trạng thái rỗng/lỗi (CLO5, CLO8)</div></div></div>
</div>
<h3>Kịch bản demo 3 phút</h3>
<div class="out"><b>Tập đúng đường này:</b><br>
1. Mở app, hiện màn chính (5s).<br>
2. Thêm một mục / đăng nhập — hiện input + validation (30s).<br>
3. Hiện danh sách cập nhật + điều hướng tới detail (30s).<br>
4. Restart app để chứng minh dữ liệu được lưu (20s).<br>
5. Kích hoạt tính năng nổi bật: một notification hoặc một câu trả lời AI (40s).<br>
6. Một câu về kiến trúc (state, lưu trữ) (15s).<br>
<em>Có phương án dự phòng: ảnh chụp hoặc một bản ghi màn hình, phòng khi mạng hay thiết bị trực tiếp hỏng.</em></div>
<h3>Ngân hàng câu hỏi vấn đáp (kèm gợi ý trả lời)</h3>
<ul>
  <li><b>Vì sao React Native, không phải native?</b> Một codebase, hai nền tảng; tái dùng kỹ năng React; lặp nhanh hơn.</li>
  <li><b>State ở đâu và vì sao?</b> UI cục bộ trong useState; dữ liệu chung trong Redux — và chỉ được ra nó.</li>
  <li><b>Dữ liệu lưu thế nào?</b> Nêu lựa chọn (AsyncStorage/SQLite/Firebase) và vì sao hợp.</li>
  <li><b>Vì sao FlatList không phải ScrollView + map?</b> FlatList ảo hoá — chỉ render hàng đang thấy.</li>
  <li><b>Bạn giữ AI key an toàn thế nào?</b> Không trong bundle; qua proxy / env, và xoay nó.</li>
  <li><b>Điều gì xảy ra khi mất mạng?</b> Cho thấy xử lý lỗi/rỗng của bạn.</li>
  <li><b>Chỉ tôi nơi thiết lập điều hướng.</b> Chỉ vào NavigationContainer + các navigator.</li>
  <li><b>Đổi X tại chỗ</b> (vd thêm một field): hiểu code đủ để làm.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chuẩn bị một câu trả lời cho "bạn sẽ cải thiện gì?"</b> Giám khảo thích hỏi câu này. Một câu trả lời chín chắn ("Em sẽ dời AI key ra sau một backend proxy và thêm cache offline") cho thấy sự chín kỹ thuật và tự nhận thức — hơn nhiều "không gì, nó hoàn hảo". Biết giới hạn của app chính là một dấu hiệu năng lực mà rubric thưởng ngầm.</div>
<div class="pitfall">Đừng xây một tính năng bạn không giải thích được. Nếu bạn dán code không hiểu, một câu vấn đáp lộ ra ngay — và nó phá uy tín của bạn cho cả buổi. Hiểu từng dòng bạn ship.</div>
</div>`,
        },
        {
          title: '6.2 — Exam prep: PE, FE & CLO question bank|||6.2 — Ôn thi: PE, FE & ngân hàng câu hỏi theo CLO',
          slug: 'mma301-6-2-exam-question-bank',
          type: 'VIDEO',
          description: 'Chiến lược Practical Exam + Final Exam, bộ khung code nhớ sẵn, và ngân hàng câu hỏi theo CLO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Preparing for the PE &amp; Final Exam</h2>
<p class="lead">The Final Exam (40%) has a ≥4 gate and mixes theory with applied questions. The Practical Exam (85 min) asks you to build a feature live. Rehearse both.</p>
<h3>The starter snippet — memorise this screen</h3>
<div class="out"><pre><span class="tok-keyword">import</span> { useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> { View, Text, TextInput, Pressable, FlatList } <span class="tok-keyword">from</span> <span class="tok-string">'react-native'</span>;

<span class="tok-keyword">export default function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">const</span> [text, setText] = <span class="tok-function">useState</span>(<span class="tok-string">''</span>);
  <span class="tok-keyword">const</span> [items, setItems] = <span class="tok-function">useState</span>([]);
  <span class="tok-keyword">const</span> <span class="tok-function">add</span> = () =&gt; { <span class="tok-keyword">if</span> (text.<span class="tok-function">trim</span>()) { setItems([...items, { id: Date.<span class="tok-function">now</span>(), text }]); <span class="tok-function">setText</span>(<span class="tok-string">''</span>); } };
  <span class="tok-keyword">return</span> (
    &lt;View style={{ flex: <span class="tok-number">1</span>, padding: <span class="tok-number">20</span> }}&gt;
      &lt;TextInput value={text} onChangeText={setText} placeholder=<span class="tok-string">"Add"</span> /&gt;
      &lt;Pressable onPress={add}&gt;&lt;Text&gt;Add&lt;/Text&gt;&lt;/Pressable&gt;
      &lt;FlatList data={items} keyExtractor={(i) =&gt; i.id.<span class="tok-function">toString</span>()}
        renderItem={({ item }) =&gt; &lt;Text&gt;{item.text}&lt;/Text&gt;} /&gt;
    &lt;/View&gt;
  );
}</pre>
<em>This one screen exercises useState, TextInput, Pressable, validation and FlatList. If you can type it from memory, the Practical Exam becomes "add a feature to a working app".</em></div>
<h3>Question bank — practise by CLO</h3>
<p><b>CLO1-5 (RN, components, styling):</b></p>
<ul>
  <li>Why must text be inside &lt;Text&gt;? What is the default flexDirection?</li>
  <li>Center a box on screen with Flexbox.</li>
  <li>Build a controlled TextInput and display its value.</li>
</ul>
<p><b>CLO6-7 (state, lists):</b></p>
<ul>
  <li>When would you use Redux over useState?</li>
  <li>Render a list of objects with FlatList + keyExtractor.</li>
  <li>What does the [] dependency array do in useEffect?</li>
</ul>
<p><b>CLO9-13 (data, notifications, AI, publish):</b></p>
<ul>
  <li>Which storage for a settings toggle vs a multi-device shared list?</li>
  <li>Outline the push notification flow.</li>
  <li>How do you keep a Gemini API key out of the app bundle?</li>
  <li>What does eas build do?</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Test on the device after each small step in the PE.</b> The same discipline as SDN302's Practical Exam: build one piece (the input), run it on Expo Go, confirm, then the next (the list). Students who write the whole screen then run at minute 80 hit a wall of bugs. Continuous running keeps you always at a working state under time pressure.</div>
<div class="pitfall">On the 40% Final Exam, applied questions want real RN/JSX, not vague prose. "Use a FlatList" earns little; the actual component with data, keyExtractor and renderItem earns full marks.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Chuẩn bị PE &amp; Final Exam</h2>
<p class="lead">Final Exam (40%) có cổng ≥4 và trộn lý thuyết với câu áp dụng. Practical Exam (85 phút) yêu cầu bạn xây một tính năng tại chỗ. Tập cả hai.</p>
<h3>Snippet khởi đầu — học thuộc màn này</h3>
<div class="out"><pre><span class="tok-keyword">import</span> { useState } <span class="tok-keyword">from</span> <span class="tok-string">'react'</span>;
<span class="tok-keyword">import</span> { View, Text, TextInput, Pressable, FlatList } <span class="tok-keyword">from</span> <span class="tok-string">'react-native'</span>;

<span class="tok-keyword">export default function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">const</span> [text, setText] = <span class="tok-function">useState</span>(<span class="tok-string">''</span>);
  <span class="tok-keyword">const</span> [items, setItems] = <span class="tok-function">useState</span>([]);
  <span class="tok-keyword">const</span> <span class="tok-function">add</span> = () =&gt; { <span class="tok-keyword">if</span> (text.<span class="tok-function">trim</span>()) { setItems([...items, { id: Date.<span class="tok-function">now</span>(), text }]); <span class="tok-function">setText</span>(<span class="tok-string">''</span>); } };
  <span class="tok-keyword">return</span> (
    &lt;View style={{ flex: <span class="tok-number">1</span>, padding: <span class="tok-number">20</span> }}&gt;
      &lt;TextInput value={text} onChangeText={setText} placeholder=<span class="tok-string">"Add"</span> /&gt;
      &lt;Pressable onPress={add}&gt;&lt;Text&gt;Add&lt;/Text&gt;&lt;/Pressable&gt;
      &lt;FlatList data={items} keyExtractor={(i) =&gt; i.id.<span class="tok-function">toString</span>()}
        renderItem={({ item }) =&gt; &lt;Text&gt;{item.text}&lt;/Text&gt;} /&gt;
    &lt;/View&gt;
  );
}</pre>
<em>Một màn này luyện useState, TextInput, Pressable, validation và FlatList. Nếu gõ được từ trí nhớ, Practical Exam thành "thêm một tính năng vào một app đang chạy".</em></div>
<h3>Ngân hàng câu hỏi — luyện theo CLO</h3>
<p><b>CLO1-5 (RN, component, styling):</b></p>
<ul>
  <li>Vì sao chữ phải trong &lt;Text&gt;? flexDirection mặc định là gì?</li>
  <li>Căn giữa một hộp trên màn bằng Flexbox.</li>
  <li>Xây một TextInput được kiểm soát và hiện giá trị.</li>
</ul>
<p><b>CLO6-7 (state, danh sách):</b></p>
<ul>
  <li>Khi nào dùng Redux thay vì useState?</li>
  <li>Render một danh sách object với FlatList + keyExtractor.</li>
  <li>Mảng phụ thuộc [] trong useEffect làm gì?</li>
</ul>
<p><b>CLO9-13 (dữ liệu, notification, AI, phát hành):</b></p>
<ul>
  <li>Lưu trữ nào cho một toggle cài đặt vs một danh sách chia sẻ nhiều thiết bị?</li>
  <li>Phác luồng push notification.</li>
  <li>Bạn giữ một Gemini API key ngoài bundle app thế nào?</li>
  <li>eas build làm gì?</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Test trên thiết bị sau mỗi bước nhỏ ở PE.</b> Cùng kỷ luật với Practical Exam của SDN302: xây một mảnh (input), chạy trên Expo Go, xác nhận, rồi cái tiếp (danh sách). Sinh viên viết cả màn rồi chạy ở phút 80 đâm vào một bức tường bug. Chạy liên tục giữ bạn luôn ở trạng thái chạy được dưới áp lực thời gian.</div>
<div class="pitfall">Ở Final Exam 40%, câu áp dụng muốn RN/JSX thật, không phải văn xuôi mơ hồ. "Dùng một FlatList" được ít điểm; component thật có data, keyExtractor và renderItem được điểm tối đa.</div>
</div>`,
        },
        {
          title: 'Quiz 6 — Project & exam readiness|||Quiz 6 — Project & sẵn sàng thi',
          slug: 'mma301-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra chuẩn bị vấn đáp, demo và chiến lược thi.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The Final Project Defense grades not just a working app but also whether you can…|||Final Project Defense chấm không chỉ app chạy được mà còn bạn có thể…', options: ['type fast|||gõ nhanh', 'explain your code and decisions|||giải thích code và quyết định', 'use many libraries|||dùng nhiều thư viện', 'write long comments|||viết comment dài'], correctIndex: 1, points: 1 },
              { question: 'A smart fallback for a live demo is…|||Một phương án dự phòng thông minh cho demo trực tiếp là…', options: ['nothing|||không gì', 'screenshots or a screen recording|||ảnh chụp hoặc bản ghi màn hình', 'a longer app|||một app dài hơn', 'deleting features|||xoá tính năng'], correctIndex: 1, points: 1 },
              { question: 'The Final Exam is 40% and has a gate of…|||Final Exam là 40% và có cổng…', options: ['no gate|||không cổng', '≥ 4', '≥ 5', '≥ 8'], correctIndex: 1, points: 1 },
              { question: 'To restart-and-persist in your demo proves you implemented…|||Restart-và-lưu trong demo chứng minh bạn đã hiện thực…', options: ['navigation|||điều hướng', 'data persistence|||lưu trữ dữ liệu', 'styling|||styling', 'notifications|||thông báo'], correctIndex: 1, points: 1 },
              { question: 'Building a feature you cannot explain is risky because…|||Xây một tính năng không giải thích được rủi ro vì…', options: ['it runs slower|||chạy chậm hơn', 'one defense question exposes it and hurts credibility|||một câu vấn đáp lộ ra và hại uy tín', 'it uses more storage|||tốn lưu trữ hơn', 'it cannot compile|||không biên dịch được'], correctIndex: 1, points: 1 },
              { question: 'The best way to survive the 85-minute Practical Exam is to… (beyond-syllabus)|||Cách tốt nhất sống sót Practical Exam 85 phút là… (ngoài giáo trình)', options: ['write everything then run once at the end|||viết mọi thứ rồi chạy một lần ở cuối', 'build and run one small piece at a time|||xây và chạy từng mảnh nhỏ một', 'skip testing|||bỏ test', 'style first|||làm đẹp trước'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 (NÂNG CAO ★) — PERFORMANCE & ARCHITECTURE ══════════════════ */
    {
      title: 'Chapter 7 (Advanced) — Performance, architecture & offline-first|||Chương 7 (Nâng cao) — Hiệu năng, kiến trúc & offline-first',
      description: 'Ngoài giáo trình: tối ưu hiệu năng (list, memo, animation), kiến trúc sạch, và thiết kế offline-first.',
      lessons: [
        {
          title: '7.1 — Performance & clean architecture|||7.1 — Hiệu năng & kiến trúc sạch',
          slug: 'mma301-7-1-performance',
          type: 'VIDEO',
          description: 'Tránh re-render thừa (memo/useCallback), list mượt, animation native, và tổ chức code sạch.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · ★ Beyond the syllabus</span>
<h2>Making the app fast &amp; maintainable</h2>
<p class="lead">A working app and a <em>smooth</em> app are different. These techniques keep the UI at 60fps and the codebase easy to grow — the polish that impresses at defense and matters on the job.</p>
<h3>Avoid needless re-renders</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>React.memo</b> — skip re-rendering a component whose props did not change.</div>
  <div class="lz-layer"><b>useCallback / useMemo</b> — keep function/value identity stable across renders.</div>
  <div class="lz-layer"><b>Stable keys</b> — a good keyExtractor lets FlatList reuse rows instead of rebuilding.</div>
</div>
<h3>Smooth animation</h3>
<p>Use the <code>Animated</code> API with <code>useNativeDriver: true</code>, or the Reanimated library, so animations run on the native thread — they stay smooth even while JavaScript is busy.</p>
<h3>Clean architecture</h3>
<div class="out"><b>Organise by feature, not by type:</b>
<pre>src/
  features/notes/  <span class="tok-comment">// screen, hook, api for notes together</span>
  features/auth/
  components/       <span class="tok-comment">// shared UI</span>
  services/         <span class="tok-comment">// api, storage</span></pre>
<em>Grouping by feature keeps related code together and lets the app grow without a tangled folder of 50 mixed files.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Measure before optimising.</b> Do not guess where the app is slow — use the performance monitor (shake → Show Perf Monitor) or the React DevTools Profiler to find the actual bottleneck. Often it is one un-memoised list row re-rendering thousands of times. Optimising the wrong thing wastes effort; measuring first is the professional habit that separates real performance work from cargo-cult tweaks.</div>
<div class="pitfall">Do not sprinkle <code>React.memo</code> and <code>useCallback</code> everywhere "for performance" — they add complexity and can even slow things down. Apply them where a profiler shows a real re-render problem, not preemptively.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · ★ Ngoài giáo trình</span>
<h2>Làm app nhanh &amp; dễ bảo trì</h2>
<p class="lead">Một app chạy được và một app <em>mượt</em> là khác nhau. Những kỹ thuật này giữ UI ở 60fps và codebase dễ lớn — sự chỉn chu gây ấn tượng ở vấn đáp và quan trọng khi đi làm.</p>
<h3>Tránh re-render thừa</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>React.memo</b> — bỏ qua re-render một component có props không đổi.</div>
  <div class="lz-layer"><b>useCallback / useMemo</b> — giữ định danh hàm/giá trị ổn định qua các render.</div>
  <div class="lz-layer"><b>Key ổn định</b> — một keyExtractor tốt cho FlatList tái dùng hàng thay vì dựng lại.</div>
</div>
<h3>Animation mượt</h3>
<p>Dùng API <code>Animated</code> với <code>useNativeDriver: true</code>, hoặc thư viện Reanimated, để animation chạy trên luồng native — chúng mượt kể cả khi JavaScript bận.</p>
<h3>Kiến trúc sạch</h3>
<div class="out"><b>Tổ chức theo tính năng, không theo loại:</b>
<pre>src/
  features/notes/  <span class="tok-comment">// screen, hook, api cho notes cung nhau</span>
  features/auth/
  components/       <span class="tok-comment">// UI dung chung</span>
  services/         <span class="tok-comment">// api, storage</span></pre>
<em>Gom theo tính năng giữ code liên quan cùng nhau và cho app lớn mà không rối một thư mục 50 file trộn lẫn.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đo trước khi tối ưu.</b> Đừng đoán chỗ app chậm — dùng performance monitor (lắc máy → Show Perf Monitor) hoặc React DevTools Profiler để tìm điểm nghẽn thật. Thường là một hàng list không-memo re-render hàng nghìn lần. Tối ưu sai chỗ phí công; đo trước là thói quen chuyên nghiệp tách công việc hiệu năng thật khỏi các chỉnh sửa cargo-cult.</div>
<div class="pitfall">Đừng rải <code>React.memo</code> và <code>useCallback</code> khắp nơi "cho hiệu năng" — chúng thêm phức tạp và có thể còn làm chậm. Áp chúng nơi profiler cho thấy một vấn đề re-render thật, không phải phòng bị trước.</div>
</div>`,
        },
        {
          title: '7.2 — Offline-first & security|||7.2 — Offline-first & bảo mật',
          slug: 'mma301-7-2-offline-security',
          type: 'VIDEO',
          description: 'Thiết kế app dùng được khi mất mạng, đồng bộ khi có lại, và bảo mật cơ bản cho mobile.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2 · ★ Beyond the syllabus</span>
<h2>Offline-first &amp; mobile security</h2>
<p class="lead">Phones lose signal in lifts, tunnels and rural areas. An app that only works online feels broken. Offline-first design and basic security turn a class project into something real.</p>
<h3>Offline-first pattern</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Read from local</b><span>show cached data instantly (SQLite/AsyncStorage)</span></div>
  <div class="lz-step"><b>Write locally first</b><span>save the user's change even with no network</span></div>
  <div class="lz-step"><b>Sync when online</b><span>push queued changes to the server when connectivity returns</span></div>
</div>
<p>Use <code>@react-native-community/netinfo</code> to detect connectivity and a queue of pending changes to sync later.</p>
<h3>Mobile security basics</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Secure storage</b> — keep tokens in <code>expo-secure-store</code> (encrypted keychain), not AsyncStorage.</div>
  <div class="lz-layer"><b>No secrets in the bundle</b> — API keys via a backend proxy or secure config.</div>
  <div class="lz-layer"><b>HTTPS only</b> — never send credentials over plain HTTP.</div>
  <div class="lz-layer"><b>Validate on the server</b> — the app is not a trusted client; the backend must re-check.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The mobile app is public code.</b> Anyone can download your .apk and inspect it — so treat everything shipped in the app as readable by an attacker. Secrets, business rules that must be enforced, and validation all belong on the server, with the app as a convenient but untrusted front-end. This "the client is public" mindset is the single most important security lesson mobile developers learn — and it is entirely absent from a features-focused syllabus.</div>
<div class="pitfall">Storing an auth token in AsyncStorage (plain, unencrypted) is a common but weak choice — on a rooted/jailbroken device it can be read. Use <code>expo-secure-store</code> for anything sensitive.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2 · ★ Ngoài giáo trình</span>
<h2>Offline-first &amp; bảo mật mobile</h2>
<p class="lead">Điện thoại mất sóng trong thang máy, đường hầm và vùng quê. Một app chỉ chạy khi online cảm giác như hỏng. Thiết kế offline-first và bảo mật cơ bản biến một project lớp học thành thứ thật.</p>
<h3>Khuôn offline-first</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Đọc từ cục bộ</b><span>hiện dữ liệu cache tức thì (SQLite/AsyncStorage)</span></div>
  <div class="lz-step"><b>Ghi cục bộ trước</b><span>lưu thay đổi của người dùng kể cả không mạng</span></div>
  <div class="lz-step"><b>Đồng bộ khi online</b><span>đẩy các thay đổi trong hàng đợi lên server khi có mạng lại</span></div>
</div>
<p>Dùng <code>@react-native-community/netinfo</code> để phát hiện kết nối và một hàng đợi thay đổi đang chờ để đồng bộ sau.</p>
<h3>Bảo mật mobile cơ bản</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Lưu trữ an toàn</b> — giữ token trong <code>expo-secure-store</code> (keychain mã hoá), không phải AsyncStorage.</div>
  <div class="lz-layer"><b>Không secret trong bundle</b> — API key qua một backend proxy hoặc config an toàn.</div>
  <div class="lz-layer"><b>Chỉ HTTPS</b> — đừng bao giờ gửi credential qua HTTP thường.</div>
  <div class="lz-layer"><b>Validate ở server</b> — app không phải client tin cậy; backend phải kiểm lại.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>App mobile là code công khai.</b> Ai cũng tải được .apk của bạn và soi nó — nên coi mọi thứ ship trong app là đọc được bởi kẻ tấn công. Secret, luật nghiệp vụ phải thực thi, và validation đều thuộc về server, với app là một front-end tiện nhưng không tin cậy. Tư duy "client là công khai" này là bài học bảo mật quan trọng nhất mà dev mobile học — và hoàn toàn vắng trong một giáo trình tập trung tính năng.</div>
<div class="pitfall">Lưu một auth token trong AsyncStorage (thô, không mã hoá) là lựa chọn phổ biến nhưng yếu — trên một thiết bị đã root/jailbreak nó đọc được. Dùng <code>expo-secure-store</code> cho mọi thứ nhạy cảm.</div>
</div>`,
        },
        {
          title: 'Quiz 7 — Performance, architecture & security|||Quiz 7 — Hiệu năng, kiến trúc & bảo mật',
          slug: 'mma301-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra tối ưu re-render, offline-first và bảo mật mobile.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'React.memo helps performance by…|||React.memo giúp hiệu năng bằng cách…', options: ['loading faster|||tải nhanh hơn', 'skipping re-render when props are unchanged|||bỏ qua re-render khi props không đổi', 'using less storage|||dùng ít lưu trữ hơn', 'adding animations|||thêm animation'], correctIndex: 1, points: 1 },
              { question: 'For smooth animation you should run it on the… thread.|||Cho animation mượt bạn nên chạy nó trên luồng…', options: ['JavaScript', 'native (useNativeDriver / Reanimated)', 'network', 'database'], correctIndex: 1, points: 1 },
              { question: 'The offline-first pattern writes changes… first.|||Khuôn offline-first ghi thay đổi… trước.', options: ['to the server|||lên server', 'locally, then syncs when online|||cục bộ, rồi đồng bộ khi online', 'nowhere|||không đâu', 'to email|||vào email'], correctIndex: 1, points: 1 },
              { question: 'A sensitive auth token should be stored in…|||Một auth token nhạy cảm nên lưu trong…', options: ['AsyncStorage (plain)|||AsyncStorage (thô)', 'expo-secure-store (encrypted)|||expo-secure-store (mã hoá)', 'a global variable|||một biến toàn cục', 'the URL|||URL'], correctIndex: 1, points: 1 },
              { question: 'Before optimising performance you should first…|||Trước khi tối ưu hiệu năng bạn nên đầu tiên…', options: ['add React.memo everywhere|||thêm React.memo khắp nơi', 'measure to find the real bottleneck|||đo để tìm điểm nghẽn thật', 'rewrite the app|||viết lại app', 'remove FlatList|||bỏ FlatList'], correctIndex: 1, points: 1 },
              { question: 'The core mobile-security mindset is that the app bundle is… (beyond-syllabus)|||Tư duy bảo mật mobile cốt lõi là bundle app là… (ngoài giáo trình)', options: ['private and safe|||riêng tư và an toàn', 'public code readable by an attacker|||code công khai đọc được bởi kẻ tấn công', 'encrypted automatically|||tự động mã hoá', 'stored only on the server|||chỉ lưu trên server'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
  ],
};
