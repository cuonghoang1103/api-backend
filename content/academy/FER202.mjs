/**
 * FER202 — Front-End Web Development with React. Kỳ 5 (FPTU_Hola5, ordinal 7).
 * Nội dung Academy FPTU — bám sát syllabus (60 buổi, 9 CLO, 15 topic) + chương nâng cao.
 * Song ngữ EN/VN đối xứng; luyện code → CodeLab; setup/IDE → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/FER202.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    academyType: 'FPT',
    courseCode: 'FER202',
    title: 'Front-End Web Development with React',
    slug: 'front-end-web-development-with-react',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build modern front-ends with React: JSX, components, state, hooks, routing, client-server data with fetch/axios, and Redux Toolkit — from ES6 foundations to production patterns.|||Xây front-end hiện đại với React: JSX, component, state, hooks, routing, giao tiếp client-server bằng fetch/axios, và Redux Toolkit — từ nền tảng ES6 tới các mẫu thực chiến.',
    description: 'FER202 dạy phát triển web phía client bằng thư viện React. Bắt đầu từ bức tranh full-stack và ES6, đi qua JSX, component, state & props, event handling, Hooks (useState/useEffect/useContext/useReducer), React Router, code splitting với lazy/Suspense, giao tiếp client-server (fetch, promise, async/await, axios) và kết thúc bằng kiến trúc Flux/Redux với Redux Toolkit. Tiên quyết WED201c.',
    whatYouLearn: 'Dựng ứng dụng React từ đầu bằng Vite/CRA; viết JSX & component tái sử dụng; quản lý state bằng hooks; điều hướng bằng React Router; tách code với lazy/Suspense; gọi REST API bằng fetch/axios; quản lý state toàn cục bằng Redux Toolkit; và các kỹ thuật nâng cao: memo hoá, testing với Jest/RTL, TypeScript & Next.js.',
    requirements: 'Tiên quyết WED201c (HTML/CSS/JS cơ bản). Cần Node.js LTS, npm, Git và VS Code. Nắm JavaScript cơ bản là lợi thế lớn.',
    documentsNote: 'Tài liệu chính: React docs (react.dev/learn) • Bootstrap 5.3 docs • MDN JavaScript. Công cụ: VS Code, Node.js LTS, npm, Git (GitHub/Bitbucket). Kèm file syllabus gốc FER202.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình và tài liệu.',
      lessons: [
        {
          title: '0.1 — About FER202 & Course Map|||0.1 — Giới thiệu môn FER202 & bản đồ môn học',
          slug: 'fer202-0-1-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Môn học này là gì, học xong làm được gì, và bản đồ toàn bộ hành trình React.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About FER202 — Front-End Web Development with React</h2>
<p class="lead">FER202 teaches you to build <strong>modern web front-ends</strong> with <strong>React</strong> — the library that powers Facebook, Netflix, Airbnb and most of today's web apps. You go from a static HTML/CSS mindset to <strong>thinking in components</strong>: small, reusable pieces of UI that describe what the screen should look like for any given data.</p>
<p>The heart of React is one simple idea: <strong>UI is a function of state</strong>. You describe the interface for a given state, and when the state changes React efficiently updates only what changed. No manual DOM juggling — you declare, React reconciles.</p>
<h3>By the end of this course you will be able to</h3>
<ul>
  <li>Scaffold a React app with Vite/CRA and understand the project structure.</li>
  <li>Write <strong>JSX</strong> and build reusable <strong>components</strong> with props and state.</li>
  <li>Manage state and side-effects with <strong>Hooks</strong> (useState, useEffect, useContext, useReducer).</li>
  <li>Route between pages (<strong>React Router</strong>), split code with <strong>lazy/Suspense</strong>.</li>
  <li>Fetch data from a REST API with <strong>fetch/axios</strong> and manage global state with <strong>Redux Toolkit</strong>.</li>
</ul>
<h3>Course map — the React journey</h3>
<p>All 60 university sessions are grouped into the roadmap below. Each stage builds on the previous one — study them in order:</p>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Overview &amp; Setup</div><div class="lz-nsub">Full-stack big picture · React 19 · Git · Node.js &amp; npm</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">ES6 for React</div><div class="lz-nsub">let/const, arrows, destructuring, spread, modules</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JSX &amp; Rendering</div><div class="lz-nsub">Render HTML, JS expressions, fragments</div></div></div>
  <div class="lz-stage">Building UI</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Bootstrap &amp; React-Bootstrap</div><div class="lz-nsub">Grid, components, styling React fast</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Components &amp; State</div><div class="lz-nsub">Props, state, class vs function</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Event Handling</div><div class="lz-nsub">Synthetic events, handler context</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Props &amp; Context</div><div class="lz-nsub">Container components, render props, context</div></div></div>
  <div class="lz-stage">The React way</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hooks</div><div class="lz-nsub">useState · useEffect · useContext · useReducer</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Routing</div><div class="lz-nsub">React Router: routes, params, links</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Code Splitting</div><div class="lz-nsub">lazy · Suspense · lazy pages</div></div></div>
  <div class="lz-stage">Data &amp; scale</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Client-Server Communication</div><div class="lz-nsub">fetch · promises · async/await · axios</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Redux</div><div class="lz-nsub">Flux · Redux Toolkit · thunk middleware</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Performance · Testing · Next.js &amp; TypeScript</div><div class="lz-nsub">memo/useMemo/useCallback · Jest &amp; RTL · SSR &amp; types</div></div></div>
</div>
<p>FER202 assumes you already know HTML/CSS/JS from <span class="badge">WED201c</span>. After it you are ready for capstone and internship-level React work.</p>
<div class="callout ok">The most effective way to study React: <strong>build small apps and break them</strong>. Retype every example, change the state, watch the UI react. Reading React tutorials without a running dev server teaches almost nothing.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice React in the browser</span><span class="lc-sub">Run components and hooks live on Code Lab — no setup needed.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu môn FER202 — Phát triển web Front-End với React</h2>
<p class="lead">FER202 dạy bạn xây <strong>front-end web hiện đại</strong> bằng <strong>React</strong> — thư viện đứng sau Facebook, Netflix, Airbnb và phần lớn ứng dụng web ngày nay. Bạn chuyển từ tư duy HTML/CSS tĩnh sang <strong>tư duy theo component</strong>: những mảnh UI nhỏ, tái sử dụng được, mô tả màn hình sẽ trông thế nào với một dữ liệu bất kỳ.</p>
<p>Trái tim của React là một ý tưởng đơn giản: <strong>UI là hàm của state</strong>. Bạn mô tả giao diện cho một state, khi state đổi React chỉ cập nhật hiệu quả phần thay đổi. Không phải chỉnh DOM thủ công — bạn khai báo, React tự dung hợp (reconcile).</p>
<h3>Học xong môn này bạn sẽ làm được</h3>
<ul>
  <li>Khởi tạo ứng dụng React bằng Vite/CRA và hiểu cấu trúc dự án.</li>
  <li>Viết <strong>JSX</strong> và xây <strong>component</strong> tái sử dụng với props và state.</li>
  <li>Quản lý state và side-effect bằng <strong>Hooks</strong> (useState, useEffect, useContext, useReducer).</li>
  <li>Điều hướng giữa các trang (<strong>React Router</strong>), tách code bằng <strong>lazy/Suspense</strong>.</li>
  <li>Gọi REST API bằng <strong>fetch/axios</strong> và quản lý state toàn cục bằng <strong>Redux Toolkit</strong>.</li>
</ul>
<h3>Bản đồ môn học — hành trình React</h3>
<p>Toàn bộ 60 buổi của trường được gom thành lộ trình bên dưới. Mỗi chặng xây trên chặng trước — hãy học tuần tự:</p>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tổng quan &amp; Cài đặt</div><div class="lz-nsub">Bức tranh full-stack · React 19 · Git · Node.js &amp; npm</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">ES6 cho React</div><div class="lz-nsub">let/const, arrow, destructuring, spread, module</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">JSX &amp; Render</div><div class="lz-nsub">Render HTML, biểu thức JS, fragment</div></div></div>
  <div class="lz-stage">Dựng giao diện</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Bootstrap &amp; React-Bootstrap</div><div class="lz-nsub">Grid, component, style React nhanh</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Component &amp; State</div><div class="lz-nsub">Props, state, class vs function</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Xử lý sự kiện</div><div class="lz-nsub">Synthetic event, ngữ cảnh handler</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Props &amp; Context</div><div class="lz-nsub">Container component, render props, context</div></div></div>
  <div class="lz-stage">Chuẩn React</div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Hooks</div><div class="lz-nsub">useState · useEffect · useContext · useReducer</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Routing</div><div class="lz-nsub">React Router: route, param, link</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Code Splitting</div><div class="lz-nsub">lazy · Suspense · lazy page</div></div></div>
  <div class="lz-stage">Dữ liệu &amp; mở rộng</div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Giao tiếp Client-Server</div><div class="lz-nsub">fetch · promise · async/await · axios</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Redux</div><div class="lz-nsub">Flux · Redux Toolkit · thunk middleware</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Hiệu năng · Testing · Next.js &amp; TypeScript</div><div class="lz-nsub">memo/useMemo/useCallback · Jest &amp; RTL · SSR &amp; kiểu</div></div></div>
</div>
<p>FER202 giả định bạn đã biết HTML/CSS/JS từ <span class="badge">WED201c</span>. Học xong, bạn sẵn sàng cho đồ án và công việc React cấp thực tập.</p>
<div class="callout ok">Cách học React hiệu quả nhất: <strong>xây app nhỏ rồi phá nó</strong>. Gõ lại mọi ví dụ, đổi state, xem UI phản ứng. Đọc tutorial React mà không có dev server đang chạy thì gần như không học được gì.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện React trên trình duyệt</span><span class="lc-sub">Chạy component &amp; hooks trực tiếp trên Code Lab — không cần cài gì.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing Requirements & Grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'fer202-0-2-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. The information below comes straight from the university's official syllabus.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + 1h exam + 85' practical + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">WED201c</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Count</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>15%</td><td>1</td><td>Take-home, guided in tutorials (CLO1–9)</td></tr>
    <tr><td>Labs</td><td>20%</td><td>6</td><td>Lab 1–6, reviewed in class + continued at home</td></tr>
    <tr><td>Practical Exam</td><td>20%</td><td>1</td><td>Hands-on on a computer, 85 min (CLO1–9)</td></tr>
    <tr><td>Progress Test</td><td>15%</td><td>2</td><td>PT1 (CLO1–6), PT2 (CLO7–8), 30 min each</td></tr>
    <tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td>1</td><td>60 min (CLO1–9)</td></tr>
  </tbody>
</table>
<div class="callout warn">Two <strong>hard blockers</strong> even with high coursework: (1) missing more than 20% of sessions = <strong>barred from the exam</strong>; (2) the <strong>Final Exam and Practical Exam must reach the ≥ 4.0 floor</strong> to count as a pass.</div>
<div class="note-ct">Labs (20%) + Practical (20%) = 40% is pure hands-on React. You cannot cram these — you must actually build the labs (a small app per lab). Do them on time, keep the repo on GitHub, and you're most of the way to passing.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. Dưới đây là thông tin lấy thẳng từ syllabus chính thức của trường.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + 1h thi + 85' thực hành + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">WED201c</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi TB ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Số lần</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>15%</td><td>1</td><td>Bài tập lớn ở nhà, hướng dẫn ở lớp (CLO1–9)</td></tr>
    <tr><td>Labs</td><td>20%</td><td>6</td><td>Lab 1–6, review tại lớp + làm tiếp ở nhà</td></tr>
    <tr><td>Practical Exam</td><td>20%</td><td>1</td><td>Thi thực hành trên máy, 85 phút (CLO1–9)</td></tr>
    <tr><td>Progress Test</td><td>15%</td><td>2</td><td>PT1 (CLO1–6), PT2 (CLO7–8), 30 phút mỗi bài</td></tr>
    <tr><td><strong>Final Exam</strong></td><td><strong>30%</strong></td><td>1</td><td>60 phút (CLO1–9)</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai điều kiện <strong>chặn cứng</strong> dù điểm quá trình cao: (1) vắng quá 20% buổi = <strong>cấm thi</strong>; (2) điểm <strong>Final Exam và Practical Exam phải đạt sàn ≥ 4.0</strong> mới được tính qua môn.</div>
<div class="note-ct">Labs (20%) + Practical (20%) = 40% là React thực hành thuần. Không học vẹt được — bạn phải thật sự làm các lab (mỗi lab một app nhỏ). Làm đúng hạn, giữ repo trên GitHub, là bạn đã đi được phần lớn chặng đường qua môn.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning Outcomes (CLOs) & Roadmap|||0.3 — Chuẩn đầu ra (CLO) & lộ trình',
          slug: 'fer202-0-3-chuan-dau-ra',
          type: 'VIDEO',
          description: '9 chuẩn đầu ra của môn và cách chúng gom vào từng chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>9 course learning outcomes (CLOs) &amp; roadmap</h2>
<p class="lead">A "Course Learning Outcome" (CLO) is what you <strong>must be able to do</strong> after the course. The exams follow these CLOs closely — knowing the CLO map tells you what you'll be tested on.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Describe front-end web UI frameworks overview</td><td>1, 4</td></tr>
    <tr><td>CLO2</td><td>Install a React app &amp; understand React components</td><td>1, 5</td></tr>
    <tr><td>CLO3</td><td>Explain JSX and ES6</td><td>2, 3</td></tr>
    <tr><td>CLO4</td><td>Explain Bootstrap &amp; React-Bootstrap</td><td>4</td></tr>
    <tr><td>CLO5</td><td>Discuss component lifecycle, forms &amp; routes</td><td>5, 9</td></tr>
    <tr><td>CLO6</td><td>Discuss hooks, event handling &amp; reusable components</td><td>6, 7, 8</td></tr>
    <tr><td>CLO7</td><td>Discuss fetch/catching data &amp; code splitting</td><td>10, 11</td></tr>
    <tr><td>CLO8</td><td>Discuss Flux architecture &amp; Redux</td><td>12</td></tr>
    <tr><td>CLO9</td><td>Apply AI tools in React development, evaluate ethics</td><td>throughout</td></tr>
  </tbody>
</table>
<div class="callout">Self-check questions before you start: What problem does a UI framework solve versus plain DOM? What is a component? Why does React use a virtual DOM? What is state, and how does it differ from props? Why do we need a build tool (Vite/npm) at all?</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>9 chuẩn đầu ra (CLO) &amp; lộ trình</h2>
<p class="lead">"Chuẩn đầu ra" (Course Learning Outcome) là những gì bạn <strong>phải làm được</strong> sau môn. Đề thi bám sát các CLO này — nắm bản đồ CLO là biết mình sẽ bị hỏi gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Mô tả tổng quan các framework UI front-end</td><td>1, 4</td></tr>
    <tr><td>CLO2</td><td>Cài đặt app React &amp; hiểu component</td><td>1, 5</td></tr>
    <tr><td>CLO3</td><td>Giải thích JSX và ES6</td><td>2, 3</td></tr>
    <tr><td>CLO4</td><td>Giải thích Bootstrap &amp; React-Bootstrap</td><td>4</td></tr>
    <tr><td>CLO5</td><td>Bàn về lifecycle, form &amp; route của component</td><td>5, 9</td></tr>
    <tr><td>CLO6</td><td>Bàn về hooks, xử lý sự kiện &amp; component tái dùng</td><td>6, 7, 8</td></tr>
    <tr><td>CLO7</td><td>Bàn về fetch/lưu dữ liệu &amp; code splitting</td><td>10, 11</td></tr>
    <tr><td>CLO8</td><td>Bàn về kiến trúc Flux &amp; Redux</td><td>12</td></tr>
    <tr><td>CLO9</td><td>Áp dụng công cụ AI trong React, đánh giá đạo đức</td><td>xuyên suốt</td></tr>
  </tbody>
</table>
<div class="callout">Câu hỏi tự kiểm trước khi bắt đầu: Framework UI giải quyết vấn đề gì so với DOM thuần? Component là gì? Vì sao React dùng virtual DOM? State là gì, khác props ra sao? Vì sao cần công cụ build (Vite/npm)?</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, Tools & Setup (Node.js + VS Code)|||0.4 — Tài liệu, công cụ & cài đặt (Node.js + VS Code)',
          slug: 'fer202-0-4-tai-lieu-cai-dat',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Giáo trình, công cụ, và hướng dẫn cài Node.js/VS Code + tạo app React đầu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; setting up your machine</h2>
<h3>Learning materials</h3>
<ul>
  <li><strong>React docs</strong> — react.dev/learn (the official, best free tutorial).</li>
  <li><strong>Bootstrap 5.3 docs</strong> — getbootstrap.com/docs/5.3.</li>
  <li><strong>MDN JavaScript</strong> — for ES6, fetch, promises reference.</li>
</ul>
<h3>Tools you need</h3>
<ul>
  <li><strong>Node.js LTS</strong> + <strong>npm</strong> — runs the tooling and dev server.</li>
  <li><strong>VS Code</strong> — the editor (+ ES7 React snippets, Prettier extensions).</li>
  <li><strong>Git</strong> — version control, push labs to GitHub/Bitbucket.</li>
</ul>
<h3>Create your first React app (Vite)</h3>
<p>Modern React apps use <strong>Vite</strong> for a fast dev server. In a terminal:</p>
<pre><span class="tok-comment"># 1) Check Node is installed (need v18+)</span>
node -v
npm -v
<span class="tok-comment"># 2) Create a React app with Vite</span>
npm create vite@latest my-app -- --template react
<span class="tok-comment"># 3) Install dependencies and start the dev server</span>
cd my-app
npm install
npm run dev</pre>
<div class="out"><b>Terminal:</b> VITE ready in 300 ms — Local: http://localhost:5173/</div>
<p>Open the URL in a browser — edit <code>src/App.jsx</code>, save, and the page updates instantly (Hot Module Replacement).</p>
<div class="pitfall">If <code>node -v</code> fails ("command not found"), Node isn't installed or not on the PATH — install the LTS from nodejs.org and reopen the terminal. If <code>npm run dev</code> errors on a missing module, you skipped <code>npm install</code> after cloning.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install Node.js &amp; VS Code — step by step</span><span class="lc-sub">Setup guide with download links and configuration — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice React right in the browser</span><span class="lc-sub">Run components without installing anything — on Code Lab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout">📎 Attached to this lesson: <strong>the original FER202.pdf syllabus</strong> — the university's official version, for reference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; cài đặt máy</h2>
<h3>Tài liệu học</h3>
<ul>
  <li><strong>React docs</strong> — react.dev/learn (tài liệu chính thức, tutorial miễn phí tốt nhất).</li>
  <li><strong>Bootstrap 5.3 docs</strong> — getbootstrap.com/docs/5.3.</li>
  <li><strong>MDN JavaScript</strong> — tra cứu ES6, fetch, promise.</li>
</ul>
<h3>Công cụ cần có</h3>
<ul>
  <li><strong>Node.js LTS</strong> + <strong>npm</strong> — chạy công cụ và dev server.</li>
  <li><strong>VS Code</strong> — trình soạn thảo (+ extension ES7 React snippets, Prettier).</li>
  <li><strong>Git</strong> — quản lý phiên bản, đẩy lab lên GitHub/Bitbucket.</li>
</ul>
<h3>Tạo app React đầu tiên (Vite)</h3>
<p>App React hiện đại dùng <strong>Vite</strong> để có dev server nhanh. Trong terminal:</p>
<pre><span class="tok-comment"># 1) Kiểm tra Node đã cài (cần v18+)</span>
node -v
npm -v
<span class="tok-comment"># 2) Tạo app React bằng Vite</span>
npm create vite@latest my-app -- --template react
<span class="tok-comment"># 3) Cài dependencies và chạy dev server</span>
cd my-app
npm install
npm run dev</pre>
<div class="out"><b>Terminal:</b> VITE ready in 300 ms — Local: http://localhost:5173/</div>
<p>Mở URL trên trình duyệt — sửa <code>src/App.jsx</code>, lưu, trang cập nhật ngay lập tức (Hot Module Replacement).</p>
<div class="pitfall">Nếu <code>node -v</code> lỗi ("command not found"), Node chưa cài hoặc chưa vào PATH — cài bản LTS từ nodejs.org rồi mở lại terminal. Nếu <code>npm run dev</code> báo thiếu module, bạn đã quên <code>npm install</code> sau khi clone.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Node.js &amp; VS Code — từng bước</span><span class="lc-sub">Hướng dẫn cài kèm link tải và cấu hình — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện React thẳng trên trình duyệt</span><span class="lc-sub">Chạy component không cần cài gì — trên Code Lab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout">📎 File đính kèm mục này: <strong>syllabus gốc FER202.pdf</strong> — bản chính thức của trường, dùng để đối chiếu.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — TỔNG QUAN & CÀI ĐẶT ══════════════════ */
    {
      title: 'Chapter 1 — Overview & Setup|||Chương 1 — Tổng quan & Cài đặt',
      description: 'Bức tranh full-stack, React 19 là gì, Git, và Node.js/npm.',
      lessons: [
        {
          title: '1.1 — Full-stack big picture & why React|||1.1 — Bức tranh full-stack & vì sao React',
          slug: 'fer202-1-1-fullstack-react',
          type: 'VIDEO',
          description: 'Front-end vs back-end, SPA, và React giải quyết vấn đề gì.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The full-stack big picture &amp; why React</h2>
<p class="lead">A modern web app has two halves. The <strong>front-end</strong> runs in the browser (what the user sees and clicks). The <strong>back-end</strong> runs on a server (database, business logic, REST API). FER202 is entirely about the front-end — built with React.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Browser</div><div class="lz-t">Front-end (React)</div><div class="lz-d">UI, state, user events</div></div>
  <div class="lz-step"><div class="lz-k">HTTP</div><div class="lz-t">REST API</div><div class="lz-d">fetch / axios — JSON</div></div>
  <div class="lz-step"><div class="lz-k">Server</div><div class="lz-t">Back-end + DB</div><div class="lz-d">data &amp; logic</div></div>
</div>
<h3>The problem React solves</h3>
<p>With plain JavaScript you manually find DOM nodes and update them — <code>document.getElementById(...).textContent = ...</code>. For a big app this becomes a tangle of "which line updates which pixel". React flips it: you write a <strong>component</strong> that returns the UI <em>for the current data</em>, and when the data changes React re-runs it and patches the DOM for you.</p>
<pre><span class="tok-comment">// Plain JS: imperative — you command each step</span>
<span class="tok-keyword">const</span> btn = document.<span class="tok-function">getElementById</span>(<span class="tok-string">"like"</span>);
btn.<span class="tok-function">addEventListener</span>(<span class="tok-string">"click"</span>, () =&gt; {
  count++;
  document.<span class="tok-function">getElementById</span>(<span class="tok-string">"n"</span>).textContent = count;
});</pre>
<pre><span class="tok-comment">// React: declarative — describe UI as a function of state</span>
<span class="tok-keyword">function</span> <span class="tok-function">Like</span>() {
  <span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(0);
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; setCount(count + 1)}&gt;Likes: {count}&lt;/button&gt;;
}</pre>
<div class="out"><b>Result:</b> click → "Likes: 1" → "Likes: 2" … React updates the number, you never touch the DOM.</div>
<h3>React 19 in one line</h3>
<p>React is a <strong>library</strong> (not a full framework) for building UI from components. Version 19 adds a smarter compiler, Actions and improved Suspense — but the core mental model you learn here is unchanged.</p>
<h3>Ví dụ có lời giải · Worked example (SPA vs multi-page)</h3>
<p>A traditional site loads a new HTML page per click (full reload). A React app is a <strong>Single-Page Application (SPA)</strong>: the browser loads one HTML shell + JS bundle once, then JavaScript swaps the visible content instantly. That's why Gmail or Facebook feel instant after the first load — no white flash between pages. Chapter 9 (Routing) makes this navigation work without full reloads.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Virtual DOM &amp; reconciliation.</b> React never reads the real DOM to decide changes. It keeps a lightweight in-memory tree (the <em>virtual DOM</em>). On each state change it builds a new tree, <b>diffs</b> it against the previous one, and applies only the minimal set of real-DOM operations. This "diff then patch" step is called <b>reconciliation</b> — it is why React is fast even though your component re-runs entirely on every render. <em>Understanding this explains almost every React performance rule you will meet later.</em></div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build your first counter</span><span class="lc-sub">Type &amp; run the Like button on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Bức tranh full-stack &amp; vì sao React</h2>
<p class="lead">Một web app hiện đại có hai nửa. <strong>Front-end</strong> chạy trong trình duyệt (những gì người dùng thấy và bấm). <strong>Back-end</strong> chạy trên server (cơ sở dữ liệu, logic nghiệp vụ, REST API). FER202 hoàn toàn về front-end — xây bằng React.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trình duyệt</div><div class="lz-t">Front-end (React)</div><div class="lz-d">UI, state, sự kiện</div></div>
  <div class="lz-step"><div class="lz-k">HTTP</div><div class="lz-t">REST API</div><div class="lz-d">fetch / axios — JSON</div></div>
  <div class="lz-step"><div class="lz-k">Server</div><div class="lz-t">Back-end + DB</div><div class="lz-d">dữ liệu &amp; logic</div></div>
</div>
<h3>Vấn đề React giải quyết</h3>
<p>Với JavaScript thuần, bạn tự tìm node DOM và cập nhật thủ công — <code>document.getElementById(...).textContent = ...</code>. Với app lớn điều này thành mớ bòng bong "dòng nào sửa pixel nào". React lật ngược: bạn viết một <strong>component</strong> trả về UI <em>cho dữ liệu hiện tại</em>, khi dữ liệu đổi React chạy lại và vá DOM giúp bạn.</p>
<pre><span class="tok-comment">// JS thuần: mệnh lệnh — bạn ra lệnh từng bước</span>
<span class="tok-keyword">const</span> btn = document.<span class="tok-function">getElementById</span>(<span class="tok-string">"like"</span>);
btn.<span class="tok-function">addEventListener</span>(<span class="tok-string">"click"</span>, () =&gt; {
  count++;
  document.<span class="tok-function">getElementById</span>(<span class="tok-string">"n"</span>).textContent = count;
});</pre>
<pre><span class="tok-comment">// React: khai báo — mô tả UI như một hàm của state</span>
<span class="tok-keyword">function</span> <span class="tok-function">Like</span>() {
  <span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(0);
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; setCount(count + 1)}&gt;Likes: {count}&lt;/button&gt;;
}</pre>
<div class="out"><b>Kết quả:</b> bấm → "Likes: 1" → "Likes: 2" … React cập nhật con số, bạn không bao giờ chạm DOM.</div>
<h3>React 19 trong một dòng</h3>
<p>React là một <strong>thư viện</strong> (không phải framework đầy đủ) để dựng UI từ component. Bản 19 thêm compiler thông minh hơn, Actions và Suspense cải tiến — nhưng mô hình tư duy cốt lõi bạn học ở đây không đổi.</p>
<h3>Ví dụ có lời giải · SPA vs nhiều trang</h3>
<p>Web truyền thống tải một trang HTML mới mỗi lần bấm (reload toàn bộ). App React là một <strong>Single-Page Application (SPA)</strong>: trình duyệt tải một khung HTML + bundle JS một lần, rồi JavaScript thay nội dung ngay lập tức. Vì thế Gmail hay Facebook cảm giác tức thì sau lần tải đầu — không có chớp trắng giữa các trang. Chương 9 (Routing) làm việc điều hướng này chạy mà không reload toàn trang.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Virtual DOM &amp; reconciliation.</b> React không bao giờ đọc DOM thật để quyết định thay đổi. Nó giữ một cây nhẹ trong bộ nhớ (<em>virtual DOM</em>). Mỗi lần state đổi, nó dựng cây mới, <b>so sánh (diff)</b> với cây cũ, và chỉ áp tập thao tác DOM thật tối thiểu. Bước "diff rồi vá" này gọi là <b>reconciliation</b> — đó là lý do React nhanh dù component chạy lại toàn bộ ở mỗi lần render. <em>Hiểu điều này giải thích gần như mọi quy tắc hiệu năng React bạn gặp về sau.</em></div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Dựng counter đầu tiên</span><span class="lc-sub">Gõ &amp; chạy nút Like trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Git, Node.js & npm|||1.2 — Git, Node.js & npm',
          slug: 'fer202-1-2-git-node-npm',
          type: 'VIDEO',
          description: 'Công cụ nền: version control với Git và hệ sinh thái Node/npm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Git, Node.js &amp; npm — the tooling under React</h2>
<p class="lead">React itself is small, but it lives inside an ecosystem. Two tools you use every single day: <strong>Git</strong> (save and share your code history) and <strong>Node.js/npm</strong> (run tooling and install packages).</p>
<h3>Git — version control basics</h3>
<pre><span class="tok-comment"># Start tracking a project</span>
git init
git add .
git commit -m <span class="tok-string">"Initial commit"</span>
<span class="tok-comment"># Connect to a remote (GitHub) and push</span>
git remote add origin https://github.com/you/my-app.git
git push -u origin main</pre>
<div class="out"><b>Result:</b> your lab is safely on GitHub — the instructor grades from your repo, and you can roll back any mistake.</div>
<p>Everyday cycle: <code>git status</code> → <code>git add</code> → <code>git commit -m "..."</code> → <code>git push</code>. Use branches (<code>git checkout -b feature</code>) to work without breaking <code>main</code>.</p>
<h3>Node.js &amp; npm</h3>
<p><strong>Node.js</strong> runs JavaScript outside the browser — that's how the React dev server and build tools run. <strong>npm</strong> is its package manager; every dependency is listed in <code>package.json</code>.</p>
<pre><span class="tok-comment"># Install a package (adds it to package.json)</span>
npm install axios
<span class="tok-comment"># Install everything listed in package.json (after cloning)</span>
npm install
<span class="tok-comment"># Run a script defined in package.json</span>
npm run dev</pre>
<div class="pitfall">Never commit the <code>node_modules/</code> folder to Git — it's huge and regenerable. Add it to <code>.gitignore</code>. Anyone who clones just runs <code>npm install</code> to rebuild it from <code>package.json</code>.</div>
<h3>Ví dụ có lời giải · Worked example (reading package.json)</h3>
<pre><span class="tok-comment">// package.json (excerpt)</span>
{
  <span class="tok-string">"scripts"</span>: { <span class="tok-string">"dev"</span>: <span class="tok-string">"vite"</span>, <span class="tok-string">"build"</span>: <span class="tok-string">"vite build"</span> },
  <span class="tok-string">"dependencies"</span>: { <span class="tok-string">"react"</span>: <span class="tok-string">"^19.0.0"</span>, <span class="tok-string">"react-dom"</span>: <span class="tok-string">"^19.0.0"</span> }
}</pre>
<p><code>scripts</code> defines the commands you can <code>npm run</code>. <code>dependencies</code> lists packages your app needs at runtime. The <code>^</code> in <code>^19.0.0</code> means "compatible with 19.x" — npm may install 19.1, 19.2… but not 20.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Semantic versioning (semver).</b> A version is <code>MAJOR.MINOR.PATCH</code>. <b>Patch</b> = bug fixes (safe), <b>minor</b> = new features backward-compatible, <b>major</b> = breaking changes. The <code>^</code> caret allows minor+patch updates; <code>~</code> tilde allows only patch. The <code>package-lock.json</code> pins the <em>exact</em> versions installed so every teammate gets an identical tree — always commit the lock file.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Git &amp; GitHub setup guide</span><span class="lc-sub">Install Git, create a repo, push your first lab — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Git, Node.js &amp; npm — công cụ nền dưới React</h2>
<p class="lead">React tự thân nhỏ, nhưng sống trong một hệ sinh thái. Hai công cụ bạn dùng mỗi ngày: <strong>Git</strong> (lưu và chia sẻ lịch sử code) và <strong>Node.js/npm</strong> (chạy công cụ và cài package).</p>
<h3>Git — căn bản quản lý phiên bản</h3>
<pre><span class="tok-comment"># Bắt đầu theo dõi một dự án</span>
git init
git add .
git commit -m <span class="tok-string">"Initial commit"</span>
<span class="tok-comment"># Kết nối remote (GitHub) và đẩy lên</span>
git remote add origin https://github.com/you/my-app.git
git push -u origin main</pre>
<div class="out"><b>Kết quả:</b> lab của bạn an toàn trên GitHub — giảng viên chấm từ repo, và bạn có thể lùi lại mọi sai sót.</div>
<p>Vòng lặp hằng ngày: <code>git status</code> → <code>git add</code> → <code>git commit -m "..."</code> → <code>git push</code>. Dùng nhánh (<code>git checkout -b feature</code>) để làm mà không phá <code>main</code>.</p>
<h3>Node.js &amp; npm</h3>
<p><strong>Node.js</strong> chạy JavaScript ngoài trình duyệt — nhờ đó dev server và công cụ build của React chạy được. <strong>npm</strong> là trình quản lý package; mọi dependency ghi trong <code>package.json</code>.</p>
<pre><span class="tok-comment"># Cài một package (thêm vào package.json)</span>
npm install axios
<span class="tok-comment"># Cài mọi thứ ghi trong package.json (sau khi clone)</span>
npm install
<span class="tok-comment"># Chạy một script định nghĩa trong package.json</span>
npm run dev</pre>
<div class="pitfall">Đừng bao giờ commit thư mục <code>node_modules/</code> lên Git — nó rất nặng và tái tạo được. Thêm vào <code>.gitignore</code>. Ai clone về chỉ cần <code>npm install</code> để dựng lại từ <code>package.json</code>.</div>
<h3>Ví dụ có lời giải · Đọc package.json</h3>
<pre><span class="tok-comment">// package.json (trích)</span>
{
  <span class="tok-string">"scripts"</span>: { <span class="tok-string">"dev"</span>: <span class="tok-string">"vite"</span>, <span class="tok-string">"build"</span>: <span class="tok-string">"vite build"</span> },
  <span class="tok-string">"dependencies"</span>: { <span class="tok-string">"react"</span>: <span class="tok-string">"^19.0.0"</span>, <span class="tok-string">"react-dom"</span>: <span class="tok-string">"^19.0.0"</span> }
}</pre>
<p><code>scripts</code> định nghĩa lệnh bạn có thể <code>npm run</code>. <code>dependencies</code> liệt kê package app cần lúc chạy. Dấu <code>^</code> trong <code>^19.0.0</code> nghĩa "tương thích với 19.x" — npm có thể cài 19.1, 19.2… nhưng không phải 20.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Semantic versioning (semver).</b> Một phiên bản là <code>MAJOR.MINOR.PATCH</code>. <b>Patch</b> = sửa lỗi (an toàn), <b>minor</b> = tính năng mới tương thích ngược, <b>major</b> = thay đổi phá vỡ. Dấu <code>^</code> cho cập nhật minor+patch; <code>~</code> chỉ cho patch. File <code>package-lock.json</code> ghim <em>chính xác</em> phiên bản đã cài để mọi thành viên có cây giống hệt — luôn commit file lock.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Hướng dẫn cài Git &amp; GitHub</span><span class="lc-sub">Cài Git, tạo repo, đẩy lab đầu tiên — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'fer202-1-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh kiến thức chương 1.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'What is React?|||React là gì?', options: ['A database|||Một cơ sở dữ liệu', 'A JavaScript library for building UIs|||Một thư viện JavaScript để dựng UI', 'A CSS framework|||Một framework CSS', 'A back-end server|||Một server back-end'], correctIndex: 1, points: 1 },
              { question: 'React describes the UI as a function of what?|||React mô tả UI như một hàm của gì?', options: ['The DOM|||DOM', 'State|||State', 'The server|||Server', 'CSS'], correctIndex: 1, points: 1 },
              { question: 'What does the virtual DOM enable?|||Virtual DOM cho phép điều gì?', options: ['Storing data on disk|||Lưu dữ liệu ra ổ đĩa', 'Diffing and minimal real-DOM updates|||So sánh và cập nhật DOM thật tối thiểu', 'Running SQL|||Chạy SQL', 'Compiling to machine code|||Biên dịch ra mã máy'], correctIndex: 1, points: 1 },
              { question: 'Which folder must NOT be committed to Git?|||Thư mục nào KHÔNG được commit lên Git?', options: ['src/', 'public/', 'node_modules/', 'components/'], correctIndex: 2, points: 1 },
              { question: 'In "^19.0.0", the caret ^ allows which updates?|||Trong "^19.0.0", dấu ^ cho phép cập nhật nào?', options: ['Any version|||Bất kỳ phiên bản', 'Only exactly 19.0.0|||Chỉ đúng 19.0.0', 'Minor and patch within 19.x|||Minor và patch trong 19.x', 'Major versions|||Các bản major'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — ES6 CHO REACT ══════════════════ */
    {
      title: 'Chapter 2 — ES6 for React|||Chương 2 — ES6 cho React',
      description: 'Cú pháp JavaScript hiện đại mà mọi code React đều dùng.',
      lessons: [
        {
          title: '2.1 — let/const, arrow functions, template literals|||2.1 — let/const, arrow function, template literal',
          slug: 'fer202-2-1-es6-basics',
          type: 'VIDEO',
          description: 'Nền tảng ES6: biến khối, hàm mũi tên, chuỗi mẫu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Modern JavaScript (ES6) essentials</h2>
<p class="lead">React code is written in ES6+ JavaScript. Before components make sense, you must be fluent in a handful of ES6 features that appear in every single React file.</p>
<h3>let &amp; const — block scope</h3>
<pre><span class="tok-keyword">const</span> name = <span class="tok-string">"React"</span>;   <span class="tok-comment">// cannot be reassigned</span>
<span class="tok-keyword">let</span> count = 0;         <span class="tok-comment">// can be reassigned</span>
count = 1;              <span class="tok-comment">// ok</span>
<span class="tok-comment">// name = "Vue";       // TypeError: Assignment to constant</span></pre>
<p>Use <code>const</code> by default; switch to <code>let</code> only when you must reassign. Never use the old <code>var</code> in React — it has confusing function scope.</p>
<h3>Arrow functions</h3>
<pre><span class="tok-comment">// classic function</span>
<span class="tok-keyword">function</span> <span class="tok-function">double</span>(x) { <span class="tok-keyword">return</span> x * 2; }
<span class="tok-comment">// arrow — shorter, implicit return</span>
<span class="tok-keyword">const</span> double = (x) =&gt; x * 2;
<span class="tok-keyword">const</span> greet = () =&gt; <span class="tok-function">console</span>.log(<span class="tok-string">"hi"</span>);</pre>
<div class="out"><b>double(5)</b> → 10</div>
<h3>Template literals</h3>
<p>Backtick strings let you embed variables with <code>&#96;\${...}&#96;</code>:</p>
<pre><span class="tok-keyword">const</span> user = <span class="tok-string">"An"</span>;
<span class="tok-keyword">const</span> msg = <span class="tok-string">&#96;Hello \${user}, welcome!&#96;</span>;</pre>
<div class="out"><b>msg</b> → "Hello An, welcome!"</div>
<div class="pitfall">Arrow functions don't have their own <code>this</code> — they inherit it from the surrounding scope. In class components this is exactly why arrow handlers "just work" without <code>.bind(this)</code>. In function components (what you'll write) there's no <code>this</code> at all, which removes a whole class of bugs.</div>
<h3>Ví dụ có lời giải · Worked example (default &amp; rest params)</h3>
<pre><span class="tok-comment">// default parameter + rest parameter</span>
<span class="tok-keyword">const</span> sum = (start = 0, ...nums) =&gt;
  nums.<span class="tok-function">reduce</span>((a, n) =&gt; a + n, start);
<span class="tok-function">console</span>.log(<span class="tok-function">sum</span>());          <span class="tok-comment">// 0</span>
<span class="tok-function">console</span>.log(<span class="tok-function">sum</span>(10, 1, 2, 3)); <span class="tok-comment">// 16</span></pre>
<p><code>start = 0</code> is a default value used when no argument is passed. <code>...nums</code> gathers all remaining arguments into an array — the same <code>...</code> you'll use for props spreading.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Truthy/falsy &amp; short-circuit rendering.</b> In JSX you'll constantly write <code>{isLoggedIn &amp;&amp; &lt;Profile /&gt;}</code>. This uses JavaScript's short-circuit: <code>A &amp;&amp; B</code> returns <code>B</code> only when <code>A</code> is truthy. Watch the trap: <code>{items.length &amp;&amp; &lt;List /&gt;}</code> renders a stray <b>0</b> when the array is empty, because <code>0</code> is falsy <em>and is a valid React child</em>. Fix it with <code>{items.length &gt; 0 &amp;&amp; ...}</code> or a ternary.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Drill ES6 syntax</span><span class="lc-sub">Arrow functions, template literals &amp; more on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>JavaScript hiện đại (ES6) cốt lõi</h2>
<p class="lead">Code React viết bằng JavaScript ES6+. Trước khi hiểu component, bạn phải thành thạo vài tính năng ES6 xuất hiện trong mọi file React.</p>
<h3>let &amp; const — phạm vi khối</h3>
<pre><span class="tok-keyword">const</span> name = <span class="tok-string">"React"</span>;   <span class="tok-comment">// không gán lại được</span>
<span class="tok-keyword">let</span> count = 0;         <span class="tok-comment">// gán lại được</span>
count = 1;              <span class="tok-comment">// ok</span>
<span class="tok-comment">// name = "Vue";       // TypeError: gán vào hằng</span></pre>
<p>Mặc định dùng <code>const</code>; chỉ chuyển sang <code>let</code> khi buộc phải gán lại. Đừng dùng <code>var</code> cũ trong React — nó có phạm vi hàm gây rối.</p>
<h3>Arrow function (hàm mũi tên)</h3>
<pre><span class="tok-comment">// hàm cổ điển</span>
<span class="tok-keyword">function</span> <span class="tok-function">double</span>(x) { <span class="tok-keyword">return</span> x * 2; }
<span class="tok-comment">// mũi tên — ngắn hơn, trả về ngầm</span>
<span class="tok-keyword">const</span> double = (x) =&gt; x * 2;
<span class="tok-keyword">const</span> greet = () =&gt; <span class="tok-function">console</span>.log(<span class="tok-string">"hi"</span>);</pre>
<div class="out"><b>double(5)</b> → 10</div>
<h3>Template literal (chuỗi mẫu)</h3>
<p>Chuỗi backtick cho phép nhúng biến bằng <code>&#96;\${...}&#96;</code>:</p>
<pre><span class="tok-keyword">const</span> user = <span class="tok-string">"An"</span>;
<span class="tok-keyword">const</span> msg = <span class="tok-string">&#96;Hello \${user}, welcome!&#96;</span>;</pre>
<div class="out"><b>msg</b> → "Hello An, welcome!"</div>
<div class="pitfall">Arrow function không có <code>this</code> riêng — nó thừa hưởng từ phạm vi bao quanh. Trong class component đây chính là lý do handler mũi tên "chạy ngay" mà không cần <code>.bind(this)</code>. Trong function component (thứ bạn sẽ viết) hoàn toàn không có <code>this</code>, loại bỏ cả một lớp lỗi.</div>
<h3>Ví dụ có lời giải · Tham số mặc định &amp; rest</h3>
<pre><span class="tok-comment">// tham số mặc định + tham số rest</span>
<span class="tok-keyword">const</span> sum = (start = 0, ...nums) =&gt;
  nums.<span class="tok-function">reduce</span>((a, n) =&gt; a + n, start);
<span class="tok-function">console</span>.log(<span class="tok-function">sum</span>());          <span class="tok-comment">// 0</span>
<span class="tok-function">console</span>.log(<span class="tok-function">sum</span>(10, 1, 2, 3)); <span class="tok-comment">// 16</span></pre>
<p><code>start = 0</code> là giá trị mặc định dùng khi không truyền tham số. <code>...nums</code> gom mọi tham số còn lại thành mảng — chính là <code>...</code> bạn sẽ dùng để spread props.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Truthy/falsy &amp; render ngắn mạch.</b> Trong JSX bạn sẽ liên tục viết <code>{isLoggedIn &amp;&amp; &lt;Profile /&gt;}</code>. Nó dùng ngắn mạch của JavaScript: <code>A &amp;&amp; B</code> trả về <code>B</code> chỉ khi <code>A</code> truthy. Coi chừng bẫy: <code>{items.length &amp;&amp; &lt;List /&gt;}</code> render ra số <b>0</b> lạc khi mảng rỗng, vì <code>0</code> là falsy <em>và là con hợp lệ của React</em>. Sửa bằng <code>{items.length &gt; 0 &amp;&amp; ...}</code> hoặc ternary.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện cú pháp ES6</span><span class="lc-sub">Arrow function, template literal &amp; hơn nữa trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Destructuring, spread & modules|||2.2 — Destructuring, spread & module',
          slug: 'fer202-2-2-destructuring-spread-modules',
          type: 'VIDEO',
          description: 'Bóc tách, trải, và import/export — nền của mọi component React.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Destructuring, spread &amp; ES modules</h2>
<p class="lead">These three features are the DNA of React code. You'll destructure props, spread state, and import/export components in literally every file.</p>
<h3>Destructuring</h3>
<pre><span class="tok-comment">// object destructuring — pull fields into variables</span>
<span class="tok-keyword">const</span> user = { name: <span class="tok-string">"An"</span>, age: 20 };
<span class="tok-keyword">const</span> { name, age } = user;
<span class="tok-comment">// array destructuring — by position (useState uses this!)</span>
<span class="tok-keyword">const</span> [first, second] = [<span class="tok-string">"a"</span>, <span class="tok-string">"b"</span>];</pre>
<div class="out"><b>name</b> → "An" · <b>first</b> → "a"</div>
<p>This is exactly why <code>const [count, setCount] = useState(0)</code> works — <code>useState</code> returns a 2-element array and you destructure it by position.</p>
<h3>Spread &amp; rest</h3>
<pre><span class="tok-keyword">const</span> a = [1, 2], b = [3, 4];
<span class="tok-keyword">const</span> merged = [...a, ...b];        <span class="tok-comment">// [1,2,3,4]</span>
<span class="tok-keyword">const</span> base = { theme: <span class="tok-string">"dark"</span> };
<span class="tok-keyword">const</span> next = { ...base, size: <span class="tok-string">"lg"</span> }; <span class="tok-comment">// copy + add</span></pre>
<div class="out"><b>next</b> → { theme: "dark", size: "lg" }</div>
<p>Spread creates a <strong>new</strong> array/object — the key to updating React state immutably (never mutate; always create a copy).</p>
<h3>ES modules — import / export</h3>
<pre><span class="tok-comment">// Button.jsx</span>
<span class="tok-keyword">export default function</span> <span class="tok-function">Button</span>() { <span class="tok-comment">/* ... */</span> }
<span class="tok-keyword">export const</span> SIZE = 16;   <span class="tok-comment">// named export</span>

<span class="tok-comment">// App.jsx</span>
<span class="tok-keyword">import</span> Button, { SIZE } <span class="tok-keyword">from</span> <span class="tok-string">"./Button.jsx"</span>;</pre>
<div class="pitfall">A file can have <strong>one</strong> <code>default</code> export but many <strong>named</strong> exports. Default imports pick any name (<code>import Btn from ...</code>); named imports must match the exact name in <code>{ }</code>. Mixing them up ("X is not exported") is the most common beginner import error.</div>
<h3>Ví dụ có lời giải · Worked example (immutable update)</h3>
<pre><span class="tok-keyword">const</span> todos = [{ id: 1, done: <span class="tok-keyword">false</span> }];
<span class="tok-comment">// mark id 1 as done — WITHOUT mutating the original</span>
<span class="tok-keyword">const</span> updated = todos.<span class="tok-function">map</span>(t =&gt;
  t.id === 1 ? { ...t, done: <span class="tok-keyword">true</span> } : t
);</pre>
<p><code>map</code> returns a new array; for the matching item we spread the old fields and override <code>done</code>. The original <code>todos</code> is untouched — React needs this to detect the change.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why immutability matters for React.</b> React decides whether to re-render by comparing references (<code>oldState === newState</code>), not by deep-inspecting objects. If you <em>mutate</em> an array in place (<code>todos.push(...)</code>) the reference is unchanged, so React thinks nothing happened and skips the update. Always produce a <b>new</b> reference with <code>map</code>, <code>filter</code> or spread. This single rule prevents most "my UI won't update" bugs.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice destructuring &amp; spread</span><span class="lc-sub">Hands-on ES6 exercises on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Destructuring, spread &amp; ES module</h2>
<p class="lead">Ba tính năng này là DNA của code React. Bạn sẽ destructure props, spread state, và import/export component trong đúng nghĩa mọi file.</p>
<h3>Destructuring (bóc tách)</h3>
<pre><span class="tok-comment">// bóc tách object — rút field ra biến</span>
<span class="tok-keyword">const</span> user = { name: <span class="tok-string">"An"</span>, age: 20 };
<span class="tok-keyword">const</span> { name, age } = user;
<span class="tok-comment">// bóc tách mảng — theo vị trí (useState dùng cái này!)</span>
<span class="tok-keyword">const</span> [first, second] = [<span class="tok-string">"a"</span>, <span class="tok-string">"b"</span>];</pre>
<div class="out"><b>name</b> → "An" · <b>first</b> → "a"</div>
<p>Đây chính là lý do <code>const [count, setCount] = useState(0)</code> chạy được — <code>useState</code> trả về mảng 2 phần tử và bạn bóc tách theo vị trí.</p>
<h3>Spread &amp; rest (trải &amp; gom)</h3>
<pre><span class="tok-keyword">const</span> a = [1, 2], b = [3, 4];
<span class="tok-keyword">const</span> merged = [...a, ...b];        <span class="tok-comment">// [1,2,3,4]</span>
<span class="tok-keyword">const</span> base = { theme: <span class="tok-string">"dark"</span> };
<span class="tok-keyword">const</span> next = { ...base, size: <span class="tok-string">"lg"</span> }; <span class="tok-comment">// sao chép + thêm</span></pre>
<div class="out"><b>next</b> → { theme: "dark", size: "lg" }</div>
<p>Spread tạo ra mảng/object <strong>mới</strong> — chìa khoá để cập nhật state React bất biến (không sửa tại chỗ; luôn tạo bản sao).</p>
<h3>ES module — import / export</h3>
<pre><span class="tok-comment">// Button.jsx</span>
<span class="tok-keyword">export default function</span> <span class="tok-function">Button</span>() { <span class="tok-comment">/* ... */</span> }
<span class="tok-keyword">export const</span> SIZE = 16;   <span class="tok-comment">// named export</span>

<span class="tok-comment">// App.jsx</span>
<span class="tok-keyword">import</span> Button, { SIZE } <span class="tok-keyword">from</span> <span class="tok-string">"./Button.jsx"</span>;</pre>
<div class="pitfall">Một file có <strong>một</strong> export <code>default</code> nhưng nhiều export <strong>named</strong>. Default import đặt tên tuỳ ý (<code>import Btn from ...</code>); named import phải khớp đúng tên trong <code>{ }</code>. Nhầm hai loại ("X is not exported") là lỗi import phổ biến nhất của người mới.</div>
<h3>Ví dụ có lời giải · Cập nhật bất biến</h3>
<pre><span class="tok-keyword">const</span> todos = [{ id: 1, done: <span class="tok-keyword">false</span> }];
<span class="tok-comment">// đánh dấu id 1 done — KHÔNG sửa bản gốc</span>
<span class="tok-keyword">const</span> updated = todos.<span class="tok-function">map</span>(t =&gt;
  t.id === 1 ? { ...t, done: <span class="tok-keyword">true</span> } : t
);</pre>
<p><code>map</code> trả về mảng mới; với item khớp ta spread field cũ rồi ghi đè <code>done</code>. Mảng <code>todos</code> gốc không đổi — React cần điều này để phát hiện thay đổi.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao bất biến quan trọng với React.</b> React quyết định render lại bằng cách so sánh tham chiếu (<code>oldState === newState</code>), không xét sâu bên trong object. Nếu bạn <em>sửa tại chỗ</em> một mảng (<code>todos.push(...)</code>) thì tham chiếu không đổi, React tưởng không có gì xảy ra và bỏ qua cập nhật. Luôn tạo tham chiếu <b>mới</b> bằng <code>map</code>, <code>filter</code> hoặc spread. Chỉ một quy tắc này ngăn được phần lớn lỗi "UI không cập nhật".</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện destructuring &amp; spread</span><span class="lc-sub">Bài tập ES6 thực hành trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'fer202-2-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh ES6.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Which keyword declares a value that cannot be reassigned?|||Từ khoá nào khai báo giá trị không gán lại được?', options: ['var', 'let', 'const', 'def'], correctIndex: 2, points: 1 },
              { question: 'What does const [a, b] = useState(0) use?|||const [a, b] = useState(0) dùng kỹ thuật gì?', options: ['Object destructuring|||Bóc tách object', 'Array destructuring|||Bóc tách mảng', 'Spread', 'A loop|||Vòng lặp'], correctIndex: 1, points: 1 },
              { question: 'What does { ...base, size: "lg" } produce?|||{ ...base, size: "lg" } tạo ra gì?', options: ['A mutated base|||base bị sửa tại chỗ', 'A new object copying base plus size|||Một object mới sao chép base và thêm size', 'An array|||Một mảng', 'null'], correctIndex: 1, points: 1 },
              { question: 'A file can have how many default exports?|||Một file có bao nhiêu export default?', options: ['Unlimited|||Không giới hạn', 'Exactly one|||Đúng một', 'Two', 'Zero only|||Chỉ zero'], correctIndex: 1, points: 1 },
              { question: 'Why avoid todos.push(...) when updating React state?|||Vì sao tránh todos.push(...) khi cập nhật state React?', options: ['It is slow|||Nó chậm', 'It mutates in place so the reference does not change|||Nó sửa tại chỗ nên tham chiếu không đổi', 'push does not exist|||push không tồn tại', 'It duplicates data|||Nó nhân đôi dữ liệu'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — JSX & RENDERING ══════════════════ */
    {
      title: 'Chapter 3 — JSX & Rendering|||Chương 3 — JSX & Render',
      description: 'JSX là gì, render HTML, nhúng biểu thức JS, và fragment.',
      lessons: [
        {
          title: '3.1 — JSX: HTML inside JavaScript|||3.1 — JSX: HTML bên trong JavaScript',
          slug: 'fer202-3-1-jsx-basics',
          type: 'VIDEO',
          description: 'Cú pháp JSX, khác gì HTML, và nhúng biểu thức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>JSX — HTML-like syntax inside JavaScript</h2>
<p class="lead"><strong>JSX</strong> lets you write markup that looks like HTML directly in JavaScript. It is not HTML and not a string — it compiles to <code>React.createElement(...)</code> calls that produce the virtual DOM.</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Welcome</span>() {
  <span class="tok-keyword">return</span> (
    &lt;div className=<span class="tok-string">"card"</span>&gt;
      &lt;h1&gt;Hello React&lt;/h1&gt;
      &lt;p&gt;This is JSX.&lt;/p&gt;
    &lt;/div&gt;
  );
}</pre>
<div class="out"><b>Renders:</b> a card with an h1 and a paragraph.</div>
<h3>Embedding JavaScript with { }</h3>
<p>Curly braces drop any JavaScript <strong>expression</strong> into JSX:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Greeting</span>() {
  <span class="tok-keyword">const</span> user = <span class="tok-string">"An"</span>;
  <span class="tok-keyword">const</span> hour = 9;
  <span class="tok-keyword">return</span> (
    &lt;p&gt;Hi {user}, it is {hour} o'clock.
      {hour &lt; 12 ? <span class="tok-string">" Good morning!"</span> : <span class="tok-string">" Good day!"</span>}
    &lt;/p&gt;
  );
}</pre>
<div class="out"><b>Renders:</b> "Hi An, it is 9 o'clock. Good morning!"</div>
<h3>JSX differs from HTML</h3>
<ul>
  <li><code>class</code> becomes <code>className</code> (class is a JS keyword).</li>
  <li><code>for</code> becomes <code>htmlFor</code>; attributes are camelCase (<code>onClick</code>, <code>tabIndex</code>).</li>
  <li>Every tag must be closed: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>.</li>
  <li>A component must return <strong>one</strong> root element.</li>
</ul>
<div class="pitfall">Only <strong>expressions</strong> go inside <code>{ }</code> — not statements. <code>{if (x) ...}</code> is a syntax error; use a ternary <code>{x ? a : b}</code> or compute the value before the <code>return</code>. Also: <code>{ }</code> renders numbers and strings, but an object <code>{ {a:1} }</code> throws "Objects are not valid as a React child".</div>
<h3>Ví dụ có lời giải · Worked example (rendering a list)</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Fruits</span>() {
  <span class="tok-keyword">const</span> fruits = [<span class="tok-string">"Apple"</span>, <span class="tok-string">"Mango"</span>, <span class="tok-string">"Kiwi"</span>];
  <span class="tok-keyword">return</span> (
    &lt;ul&gt;
      {fruits.<span class="tok-function">map</span>((f, i) =&gt; <span class="tok-comment">// map array → array of JSX</span>
        &lt;li key={i}&gt;{f}&lt;/li&gt;
      )}
    &lt;/ul&gt;
  );
}</pre>
<div class="out"><b>Renders:</b> • Apple • Mango • Kiwi</div>
<p>We turn a data array into an array of <code>&lt;li&gt;</code> with <code>map</code>. Each item needs a <code>key</code> — a stable identity React uses to track list items.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why keys matter — list diffing.</b> During reconciliation React matches old and new list items by their <code>key</code>, not by position. A stable key (an id) lets React move/keep DOM nodes instead of recreating them — preserving input focus and state. Using the array <b>index</b> as key breaks this the moment items are inserted, removed or reordered: React mis-matches items and you get subtle bugs (wrong checkbox checked, wrong input value). Rule: use a real unique id as key, never the index for dynamic lists.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Write your first JSX</span><span class="lc-sub">Render lists and expressions on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>JSX — cú pháp giống HTML bên trong JavaScript</h2>
<p class="lead"><strong>JSX</strong> cho phép viết markup trông như HTML ngay trong JavaScript. Nó không phải HTML và không phải chuỗi — nó biên dịch thành các lệnh <code>React.createElement(...)</code> tạo ra virtual DOM.</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Welcome</span>() {
  <span class="tok-keyword">return</span> (
    &lt;div className=<span class="tok-string">"card"</span>&gt;
      &lt;h1&gt;Hello React&lt;/h1&gt;
      &lt;p&gt;This is JSX.&lt;/p&gt;
    &lt;/div&gt;
  );
}</pre>
<div class="out"><b>Render ra:</b> một card có h1 và một đoạn văn.</div>
<h3>Nhúng JavaScript bằng { }</h3>
<p>Dấu ngoặc nhọn đưa bất kỳ <strong>biểu thức</strong> JavaScript nào vào JSX:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Greeting</span>() {
  <span class="tok-keyword">const</span> user = <span class="tok-string">"An"</span>;
  <span class="tok-keyword">const</span> hour = 9;
  <span class="tok-keyword">return</span> (
    &lt;p&gt;Hi {user}, it is {hour} o'clock.
      {hour &lt; 12 ? <span class="tok-string">" Good morning!"</span> : <span class="tok-string">" Good day!"</span>}
    &lt;/p&gt;
  );
}</pre>
<div class="out"><b>Render ra:</b> "Hi An, it is 9 o'clock. Good morning!"</div>
<h3>JSX khác HTML</h3>
<ul>
  <li><code>class</code> thành <code>className</code> (class là từ khoá JS).</li>
  <li><code>for</code> thành <code>htmlFor</code>; thuộc tính viết camelCase (<code>onClick</code>, <code>tabIndex</code>).</li>
  <li>Mọi thẻ phải đóng: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>.</li>
  <li>Một component phải trả về <strong>một</strong> phần tử gốc.</li>
</ul>
<div class="pitfall">Chỉ <strong>biểu thức</strong> mới vào được <code>{ }</code> — không phải câu lệnh. <code>{if (x) ...}</code> là lỗi cú pháp; dùng ternary <code>{x ? a : b}</code> hoặc tính giá trị trước <code>return</code>. Ngoài ra: <code>{ }</code> render được số và chuỗi, nhưng object <code>{ {a:1} }</code> ném lỗi "Objects are not valid as a React child".</div>
<h3>Ví dụ có lời giải · Render danh sách</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Fruits</span>() {
  <span class="tok-keyword">const</span> fruits = [<span class="tok-string">"Apple"</span>, <span class="tok-string">"Mango"</span>, <span class="tok-string">"Kiwi"</span>];
  <span class="tok-keyword">return</span> (
    &lt;ul&gt;
      {fruits.<span class="tok-function">map</span>((f, i) =&gt; <span class="tok-comment">// map mảng → mảng JSX</span>
        &lt;li key={i}&gt;{f}&lt;/li&gt;
      )}
    &lt;/ul&gt;
  );
}</pre>
<div class="out"><b>Render ra:</b> • Apple • Mango • Kiwi</div>
<p>Ta biến mảng dữ liệu thành mảng <code>&lt;li&gt;</code> bằng <code>map</code>. Mỗi item cần một <code>key</code> — danh tính ổn định để React theo dõi phần tử danh sách.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao key quan trọng — diff danh sách.</b> Khi reconciliation, React khớp item cũ và mới theo <code>key</code>, không theo vị trí. Key ổn định (một id) cho React di chuyển/giữ node DOM thay vì tạo lại — bảo toàn focus ô nhập và state. Dùng <b>index</b> mảng làm key sẽ hỏng ngay khi item được chèn, xoá hay sắp lại: React khớp nhầm item và bạn gặp lỗi tinh vi (tick nhầm checkbox, sai giá trị ô nhập). Quy tắc: dùng id thật duy nhất làm key, đừng bao giờ dùng index cho danh sách động.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Viết JSX đầu tiên</span><span class="lc-sub">Render danh sách và biểu thức trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Fragments & conditional rendering|||3.2 — Fragment & render có điều kiện',
          slug: 'fer202-3-2-fragments-conditional',
          type: 'VIDEO',
          description: 'Trả về nhiều phần tử, và hiển thị UI theo điều kiện.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Fragments &amp; conditional rendering</h2>
<p class="lead">A component must return a single root. When you don't want an extra wrapper <code>&lt;div&gt;</code> in the DOM, use a <strong>Fragment</strong>. And to show different UI for different data, you render <strong>conditionally</strong>.</p>
<h3>Fragments</h3>
<pre><span class="tok-comment">// Without a wrapper div — use &lt;&gt;...&lt;/&gt;</span>
<span class="tok-keyword">function</span> <span class="tok-function">Info</span>() {
  <span class="tok-keyword">return</span> (
    &lt;&gt;
      &lt;h2&gt;Title&lt;/h2&gt;
      &lt;p&gt;Body&lt;/p&gt;
    &lt;/&gt;
  );
}</pre>
<div class="out"><b>DOM:</b> just an h2 and p — no extra div wrapper.</div>
<p><code>&lt;&gt;...&lt;/&gt;</code> is shorthand for <code>&lt;React.Fragment&gt;</code>. Use the full form when you need a <code>key</code> (in lists).</p>
<h3>Conditional rendering — three patterns</h3>
<pre><span class="tok-comment">// 1) Ternary — choose between two</span>
{isLoggedIn ? &lt;Logout /&gt; : &lt;Login /&gt;}

<span class="tok-comment">// 2) &amp;&amp; — render or nothing</span>
{hasError &amp;&amp; &lt;p className=<span class="tok-string">"err"</span>&gt;Failed&lt;/p&gt;}

<span class="tok-comment">// 3) early return in the component</span>
<span class="tok-keyword">if</span> (loading) <span class="tok-keyword">return</span> &lt;Spinner /&gt;;</pre>
<div class="pitfall">JSX conditional blocks are the #1 source of broken layouts: a missing <code>)</code> or an unbalanced tag inside <code>{cond &amp;&amp; (...)}</code> silently breaks the build. Always keep the parentheses and closing tags matched — this exact class of bug has broken real production builds.</div>
<h3>Ví dụ có lời giải · Worked example (loading / error / data)</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">UserCard</span>({ loading, error, user }) {
  <span class="tok-keyword">if</span> (loading) <span class="tok-keyword">return</span> &lt;p&gt;Loading…&lt;/p&gt;;
  <span class="tok-keyword">if</span> (error)   <span class="tok-keyword">return</span> &lt;p className=<span class="tok-string">"err"</span>&gt;{error}&lt;/p&gt;;
  <span class="tok-keyword">return</span> &lt;h3&gt;{user.name}&lt;/h3&gt;;
}</pre>
<p>The "early return" pattern reads top-to-bottom like a guard checklist: handle loading, then error, then the happy path. This is the standard shape for any component that fetches data (Chapter 11).</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Fragments &amp; the wrapper-div problem.</b> Before fragments, developers wrapped multiple elements in a <code>&lt;div&gt;</code> just to satisfy "one root". Those extra divs polluted the DOM and broke CSS layouts like flex or grid (an unwanted node between flex parent and children). Fragments return multiple siblings with <em>zero</em> DOM output — essential for building clean table rows (<code>&lt;tr&gt;</code> groups) and flex/grid children where an intermediate wrapper would break the layout.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Fragment &amp; render có điều kiện</h2>
<p class="lead">Một component phải trả về một gốc duy nhất. Khi không muốn thêm <code>&lt;div&gt;</code> bọc dư trong DOM, dùng <strong>Fragment</strong>. Và để hiển thị UI khác nhau cho dữ liệu khác nhau, ta render <strong>có điều kiện</strong>.</p>
<h3>Fragment</h3>
<pre><span class="tok-comment">// Không cần div bọc — dùng &lt;&gt;...&lt;/&gt;</span>
<span class="tok-keyword">function</span> <span class="tok-function">Info</span>() {
  <span class="tok-keyword">return</span> (
    &lt;&gt;
      &lt;h2&gt;Title&lt;/h2&gt;
      &lt;p&gt;Body&lt;/p&gt;
    &lt;/&gt;
  );
}</pre>
<div class="out"><b>DOM:</b> chỉ h2 và p — không có div bọc dư.</div>
<p><code>&lt;&gt;...&lt;/&gt;</code> là viết tắt của <code>&lt;React.Fragment&gt;</code>. Dùng dạng đầy đủ khi cần <code>key</code> (trong danh sách).</p>
<h3>Render có điều kiện — ba mẫu</h3>
<pre><span class="tok-comment">// 1) Ternary — chọn giữa hai</span>
{isLoggedIn ? &lt;Logout /&gt; : &lt;Login /&gt;}

<span class="tok-comment">// 2) &amp;&amp; — render hoặc không gì</span>
{hasError &amp;&amp; &lt;p className=<span class="tok-string">"err"</span>&gt;Failed&lt;/p&gt;}

<span class="tok-comment">// 3) return sớm trong component</span>
<span class="tok-keyword">if</span> (loading) <span class="tok-keyword">return</span> &lt;Spinner /&gt;;</pre>
<div class="pitfall">Khối điều kiện JSX là nguồn số 1 gây vỡ layout: thiếu một <code>)</code> hoặc thẻ không cân trong <code>{cond &amp;&amp; (...)}</code> làm hỏng build âm thầm. Luôn giữ cân bằng dấu ngoặc và thẻ đóng — đúng loại lỗi này từng làm vỡ build production thật.</div>
<h3>Ví dụ có lời giải · loading / error / data</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">UserCard</span>({ loading, error, user }) {
  <span class="tok-keyword">if</span> (loading) <span class="tok-keyword">return</span> &lt;p&gt;Loading…&lt;/p&gt;;
  <span class="tok-keyword">if</span> (error)   <span class="tok-keyword">return</span> &lt;p className=<span class="tok-string">"err"</span>&gt;{error}&lt;/p&gt;;
  <span class="tok-keyword">return</span> &lt;h3&gt;{user.name}&lt;/h3&gt;;
}</pre>
<p>Mẫu "return sớm" đọc từ trên xuống như một checklist canh cửa: xử lý loading, rồi error, rồi trường hợp thành công. Đây là hình dạng chuẩn cho mọi component fetch dữ liệu (Chương 11).</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Fragment &amp; vấn đề div bọc.</b> Trước khi có fragment, lập trình viên bọc nhiều phần tử trong một <code>&lt;div&gt;</code> chỉ để thoả "một gốc". Những div dư đó làm bẩn DOM và phá layout CSS như flex/grid (một node thừa giữa cha flex và con). Fragment trả về nhiều anh em với <em>không</em> đầu ra DOM nào — thiết yếu để dựng hàng bảng (<code>&lt;tr&gt;</code>) và con flex/grid gọn gàng, nơi một wrapper trung gian sẽ phá layout.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'fer202-3-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh JSX.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'In JSX, the HTML class attribute is written as?|||Trong JSX, thuộc tính class của HTML viết là?', options: ['class', 'className', 'classNm', 'cssClass'], correctIndex: 1, points: 1 },
              { question: 'What goes inside JSX curly braces { }?|||Trong ngoặc nhọn { } của JSX chứa gì?', options: ['Statements|||Câu lệnh', 'JavaScript expressions|||Biểu thức JavaScript', 'Only strings|||Chỉ chuỗi', 'CSS'], correctIndex: 1, points: 1 },
              { question: 'How do you render a list from an array?|||Render danh sách từ mảng bằng cách nào?', options: ['for loop in JSX|||vòng for trong JSX', 'array.map returning JSX with a key|||array.map trả JSX có key', 'while loop|||vòng while', 'forEach'], correctIndex: 1, points: 1 },
              { question: 'What should a list item key be?|||Key của item danh sách nên là gì?', options: ['The array index always|||Luôn là index mảng', 'A stable unique id|||Một id duy nhất ổn định', 'A random number each render|||Số ngẫu nhiên mỗi render', 'The text content|||Nội dung text'], correctIndex: 1, points: 1 },
              { question: 'What does <>...</> mean?|||<>...</> nghĩa là gì?', options: ['An empty tag|||Thẻ rỗng', 'A Fragment (no extra DOM node)|||Một Fragment (không thêm node DOM)', 'A comment|||Chú thích', 'A div'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — BOOTSTRAP & REACT-BOOTSTRAP ══════════════════ */
    {
      title: 'Chapter 4 — Bootstrap & React-Bootstrap|||Chương 4 — Bootstrap & React-Bootstrap',
      description: 'Style React nhanh: grid system, component CSS, và React-Bootstrap.',
      lessons: [
        {
          title: '4.1 — Bootstrap grid & React-Bootstrap components|||4.1 — Grid Bootstrap & component React-Bootstrap',
          slug: 'fer202-4-1-bootstrap',
          type: 'VIDEO',
          description: 'Grid 12 cột, component có sẵn, và bản React của Bootstrap.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Bootstrap &amp; React-Bootstrap</h2>
<p class="lead"><strong>Bootstrap</strong> is the most popular CSS framework — a ready-made set of responsive styles and components (grid, buttons, navbars, forms). <strong>React-Bootstrap</strong> wraps them as proper React components so you never touch raw class strings.</p>
<h3>The 12-column grid</h3>
<p>Bootstrap divides each row into 12 columns. You compose layouts by choosing how many columns each block spans at each screen size.</p>
<pre><span class="tok-comment">// Plain Bootstrap classes</span>
&lt;div className=<span class="tok-string">"row"</span>&gt;
  &lt;div className=<span class="tok-string">"col-12 col-md-8"</span>&gt;Main&lt;/div&gt;
  &lt;div className=<span class="tok-string">"col-12 col-md-4"</span>&gt;Sidebar&lt;/div&gt;
&lt;/div&gt;</pre>
<div class="out"><b>Result:</b> stacked on mobile (12+12), side-by-side 8/4 on medium screens and up.</div>
<h3>React-Bootstrap — components, not classes</h3>
<pre><span class="tok-keyword">import</span> { Container, Row, Col, Button } <span class="tok-keyword">from</span> <span class="tok-string">"react-bootstrap"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Layout</span>() {
  <span class="tok-keyword">return</span> (
    &lt;Container&gt;
      &lt;Row&gt;
        &lt;Col md={8}&gt;Main&lt;/Col&gt;
        &lt;Col md={4}&gt;Sidebar&lt;/Col&gt;
      &lt;/Row&gt;
      &lt;Button variant=<span class="tok-string">"primary"</span>&gt;Save&lt;/Button&gt;
    &lt;/Container&gt;
  );
}</pre>
<div class="out"><b>Result:</b> the same responsive layout plus a styled primary button.</div>
<p>Setup: <code>npm install react-bootstrap bootstrap</code>, then import the CSS once in <code>main.jsx</code>: <code>import "bootstrap/dist/css/bootstrap.min.css";</code></p>
<div class="pitfall">Forgetting to import the Bootstrap CSS is the classic "why is nothing styled?" bug — React-Bootstrap ships the components but <strong>not</strong> the stylesheet. Import <code>bootstrap.min.css</code> exactly once at the app entry, not in every component.</div>
<h3>Ví dụ có lời giải · Worked example (a card + navbar)</h3>
<pre><span class="tok-keyword">import</span> { Navbar, Nav, Card } <span class="tok-keyword">from</span> <span class="tok-string">"react-bootstrap"</span>;

&lt;Navbar bg=<span class="tok-string">"dark"</span> variant=<span class="tok-string">"dark"</span>&gt;
  &lt;Navbar.Brand&gt;MyApp&lt;/Navbar.Brand&gt;
  &lt;Nav&gt;&lt;Nav.Link href=<span class="tok-string">"#home"</span>&gt;Home&lt;/Nav.Link&gt;&lt;/Nav&gt;
&lt;/Navbar&gt;

&lt;Card style={{ width: <span class="tok-string">"18rem"</span> }}&gt;
  &lt;Card.Body&gt;
    &lt;Card.Title&gt;React&lt;/Card.Title&gt;
    &lt;Card.Text&gt;A UI library.&lt;/Card.Text&gt;
  &lt;/Card.Body&gt;
&lt;/Card&gt;</pre>
<p>Notice the compound-component pattern: <code>Card.Body</code>, <code>Card.Title</code> are sub-components of <code>Card</code>. Props like <code>variant</code> and <code>bg</code> map to Bootstrap's theme classes — you get consistent styling with zero CSS.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Bootstrap vs utility-first (Tailwind) vs CSS-in-JS.</b> Bootstrap gives ready-made <em>components</em> (fast to start, but every Bootstrap site looks similar). Tailwind gives <em>utility classes</em> (<code>flex p-4 rounded</code>) — maximum control, no opinionated look. CSS-in-JS (styled-components, emotion) scopes styles to components. There's no "best" — Bootstrap wins for speed and prototypes; know that the industry has largely moved toward Tailwind for new projects, so learning the grid concept (which all of them share) matters more than memorising class names.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Bootstrap setup &amp; snippets</span><span class="lc-sub">Install and configure React-Bootstrap — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Bootstrap &amp; React-Bootstrap</h2>
<p class="lead"><strong>Bootstrap</strong> là framework CSS phổ biến nhất — bộ style và component responsive dựng sẵn (grid, button, navbar, form). <strong>React-Bootstrap</strong> bọc chúng thành component React đúng nghĩa để bạn không phải chạm chuỗi class thô.</p>
<h3>Grid 12 cột</h3>
<p>Bootstrap chia mỗi hàng thành 12 cột. Bạn dựng layout bằng cách chọn mỗi khối chiếm bao nhiêu cột ở mỗi kích thước màn hình.</p>
<pre><span class="tok-comment">// Class Bootstrap thuần</span>
&lt;div className=<span class="tok-string">"row"</span>&gt;
  &lt;div className=<span class="tok-string">"col-12 col-md-8"</span>&gt;Main&lt;/div&gt;
  &lt;div className=<span class="tok-string">"col-12 col-md-4"</span>&gt;Sidebar&lt;/div&gt;
&lt;/div&gt;</pre>
<div class="out"><b>Kết quả:</b> xếp chồng trên mobile (12+12), cạnh nhau 8/4 từ màn hình medium trở lên.</div>
<h3>React-Bootstrap — component, không phải class</h3>
<pre><span class="tok-keyword">import</span> { Container, Row, Col, Button } <span class="tok-keyword">from</span> <span class="tok-string">"react-bootstrap"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Layout</span>() {
  <span class="tok-keyword">return</span> (
    &lt;Container&gt;
      &lt;Row&gt;
        &lt;Col md={8}&gt;Main&lt;/Col&gt;
        &lt;Col md={4}&gt;Sidebar&lt;/Col&gt;
      &lt;/Row&gt;
      &lt;Button variant=<span class="tok-string">"primary"</span>&gt;Save&lt;/Button&gt;
    &lt;/Container&gt;
  );
}</pre>
<div class="out"><b>Kết quả:</b> cùng layout responsive cộng một nút primary đã có style.</div>
<p>Cài đặt: <code>npm install react-bootstrap bootstrap</code>, rồi import CSS một lần trong <code>main.jsx</code>: <code>import "bootstrap/dist/css/bootstrap.min.css";</code></p>
<div class="pitfall">Quên import CSS Bootstrap là lỗi kinh điển "sao không có style gì?" — React-Bootstrap giao component nhưng <strong>không</strong> kèm stylesheet. Import <code>bootstrap.min.css</code> đúng một lần ở entry app, đừng import trong mọi component.</div>
<h3>Ví dụ có lời giải · Card + navbar</h3>
<pre><span class="tok-keyword">import</span> { Navbar, Nav, Card } <span class="tok-keyword">from</span> <span class="tok-string">"react-bootstrap"</span>;

&lt;Navbar bg=<span class="tok-string">"dark"</span> variant=<span class="tok-string">"dark"</span>&gt;
  &lt;Navbar.Brand&gt;MyApp&lt;/Navbar.Brand&gt;
  &lt;Nav&gt;&lt;Nav.Link href=<span class="tok-string">"#home"</span>&gt;Home&lt;/Nav.Link&gt;&lt;/Nav&gt;
&lt;/Navbar&gt;

&lt;Card style={{ width: <span class="tok-string">"18rem"</span> }}&gt;
  &lt;Card.Body&gt;
    &lt;Card.Title&gt;React&lt;/Card.Title&gt;
    &lt;Card.Text&gt;A UI library.&lt;/Card.Text&gt;
  &lt;/Card.Body&gt;
&lt;/Card&gt;</pre>
<p>Chú ý mẫu compound-component: <code>Card.Body</code>, <code>Card.Title</code> là component con của <code>Card</code>. Props như <code>variant</code> và <code>bg</code> ánh xạ tới class theme của Bootstrap — bạn có style nhất quán với zero CSS.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bootstrap vs utility-first (Tailwind) vs CSS-in-JS.</b> Bootstrap cho <em>component</em> dựng sẵn (bắt đầu nhanh, nhưng site Bootstrap nào cũng na ná). Tailwind cho <em>class tiện ích</em> (<code>flex p-4 rounded</code>) — kiểm soát tối đa, không áp đặt phong cách. CSS-in-JS (styled-components, emotion) khoanh vùng style theo component. Không có "tốt nhất" — Bootstrap thắng về tốc độ và prototype; nên biết ngành đã dịch chuyển phần lớn sang Tailwind cho dự án mới, nên hiểu khái niệm grid (mà cả ba đều dùng chung) quan trọng hơn học thuộc tên class.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt Bootstrap &amp; snippet</span><span class="lc-sub">Cài và cấu hình React-Bootstrap — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'fer202-4-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh Bootstrap.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'How many columns does the Bootstrap grid have?|||Grid Bootstrap có bao nhiêu cột?', options: ['10', '12', '16', '24'], correctIndex: 1, points: 1 },
              { question: 'What does col-12 col-md-8 mean?|||col-12 col-md-8 nghĩa là gì?', options: ['Always 8 columns|||Luôn 8 cột', 'Full width on mobile, 8/12 from medium up|||Toàn rộng trên mobile, 8/12 từ medium trở lên', 'Hidden on mobile|||Ẩn trên mobile', '8 rows|||8 hàng'], correctIndex: 1, points: 1 },
              { question: 'What must you import once for styles to work?|||Phải import một lần cái gì để style hoạt động?', options: ['react-dom', 'bootstrap.min.css', 'jquery', 'index.html'], correctIndex: 1, points: 1 },
              { question: 'React-Bootstrap provides Bootstrap as what?|||React-Bootstrap cung cấp Bootstrap dưới dạng gì?', options: ['Raw class strings|||Chuỗi class thô', 'React components|||Component React', 'A CDN link|||Một link CDN', 'A CLI'], correctIndex: 1, points: 1 },
              { question: 'Card.Body and Card.Title are an example of?|||Card.Body và Card.Title là ví dụ của?', options: ['Hooks', 'Compound components|||Compound component', 'Redux actions|||Action Redux', 'Routes'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — COMPONENT & STATE ══════════════════ */
    {
      title: 'Chapter 5 — Components & State|||Chương 5 — Component & State',
      description: 'Xây component, truyền props, và quản lý state; class vs function.',
      lessons: [
        {
          title: '5.1 — Components & props|||5.1 — Component & props',
          slug: 'fer202-5-1-components-props',
          type: 'VIDEO',
          description: 'Component là gì, truyền dữ liệu vào bằng props.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Components &amp; props</h2>
<p class="lead">A <strong>component</strong> is a JavaScript function that returns JSX. Components are the LEGO bricks of React — you build a big UI by composing small components. <strong>Props</strong> are the inputs you pass to a component, like function arguments.</p>
<h3>A function component</h3>
<pre><span class="tok-comment">// Defines a reusable Greeting component</span>
<span class="tok-keyword">function</span> <span class="tok-function">Greeting</span>({ name, role }) {  <span class="tok-comment">// props destructured</span>
  <span class="tok-keyword">return</span> &lt;h2&gt;Hi {name} — {role}&lt;/h2&gt;;
}

<span class="tok-comment">// Using it, passing props</span>
&lt;Greeting name=<span class="tok-string">"An"</span> role=<span class="tok-string">"Student"</span> /&gt;
&lt;Greeting name=<span class="tok-string">"Binh"</span> role=<span class="tok-string">"Admin"</span> /&gt;</pre>
<div class="out"><b>Renders:</b> "Hi An — Student" and "Hi Binh — Admin"</div>
<p>Component names must start with a <strong>capital letter</strong> (<code>Greeting</code>, not <code>greeting</code>) — that's how JSX tells your components apart from HTML tags.</p>
<h3>Props are read-only</h3>
<p>A component must <strong>never</strong> modify its own props. Data flows <strong>one way</strong>: parent → child. If a child needs to change something, the parent passes a callback (you'll see this in event handling).</p>
<pre><span class="tok-comment">// children prop — content between the tags</span>
<span class="tok-keyword">function</span> <span class="tok-function">Panel</span>({ children }) {
  <span class="tok-keyword">return</span> &lt;div className=<span class="tok-string">"panel"</span>&gt;{children}&lt;/div&gt;;
}
&lt;Panel&gt;&lt;p&gt;Anything here&lt;/p&gt;&lt;/Panel&gt;</pre>
<div class="pitfall">Props are read-only: writing <code>props.name = "x"</code> throws in strict mode and is always a design error. If you feel the urge to change a prop, you actually need <strong>state</strong> (next lesson) or to lift the change up to the parent.</div>
<h3>Ví dụ có lời giải · Worked example (composition)</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Avatar</span>({ url }) { <span class="tok-keyword">return</span> &lt;img src={url} className=<span class="tok-string">"av"</span> /&gt;; }
<span class="tok-keyword">function</span> <span class="tok-function">UserRow</span>({ user }) {
  <span class="tok-keyword">return</span> (
    &lt;div className=<span class="tok-string">"row"</span>&gt;
      &lt;Avatar url={user.avatar} /&gt;
      &lt;span&gt;{user.name}&lt;/span&gt;
    &lt;/div&gt;
  );
}</pre>
<p><code>UserRow</code> reuses <code>Avatar</code> by passing it a prop. This is <strong>composition</strong>: small components combine into bigger ones, each doing one job. It's the core skill FER202 grades.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Presentational vs container components.</b> A useful design split: <em>presentational</em> components only take props and render UI (no data logic) — easy to reuse and test. <em>Container</em> components fetch/hold data and pass it down. This separation (popularised by Dan Abramov) keeps UI dumb and logic centralised. With hooks the line has blurred — today we often extract logic into <b>custom hooks</b> instead of container components — but the instinct "keep rendering separate from data" still guides clean React.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build reusable components</span><span class="lc-sub">Practice props &amp; composition on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Component &amp; props</h2>
<p class="lead">Một <strong>component</strong> là hàm JavaScript trả về JSX. Component là những viên LEGO của React — bạn dựng UI lớn bằng cách ghép các component nhỏ. <strong>Props</strong> là đầu vào bạn truyền cho component, như tham số hàm.</p>
<h3>Function component</h3>
<pre><span class="tok-comment">// Định nghĩa component Greeting tái dùng</span>
<span class="tok-keyword">function</span> <span class="tok-function">Greeting</span>({ name, role }) {  <span class="tok-comment">// props được bóc tách</span>
  <span class="tok-keyword">return</span> &lt;h2&gt;Hi {name} — {role}&lt;/h2&gt;;
}

<span class="tok-comment">// Dùng nó, truyền props</span>
&lt;Greeting name=<span class="tok-string">"An"</span> role=<span class="tok-string">"Student"</span> /&gt;
&lt;Greeting name=<span class="tok-string">"Binh"</span> role=<span class="tok-string">"Admin"</span> /&gt;</pre>
<div class="out"><b>Render ra:</b> "Hi An — Student" và "Hi Binh — Admin"</div>
<p>Tên component phải bắt đầu bằng <strong>chữ hoa</strong> (<code>Greeting</code>, không phải <code>greeting</code>) — nhờ đó JSX phân biệt component của bạn với thẻ HTML.</p>
<h3>Props chỉ đọc</h3>
<p>Component <strong>không bao giờ</strong> được sửa props của chính nó. Dữ liệu chảy <strong>một chiều</strong>: cha → con. Nếu con cần thay đổi gì, cha truyền một callback (bạn sẽ thấy ở phần xử lý sự kiện).</p>
<pre><span class="tok-comment">// prop children — nội dung giữa hai thẻ</span>
<span class="tok-keyword">function</span> <span class="tok-function">Panel</span>({ children }) {
  <span class="tok-keyword">return</span> &lt;div className=<span class="tok-string">"panel"</span>&gt;{children}&lt;/div&gt;;
}
&lt;Panel&gt;&lt;p&gt;Anything here&lt;/p&gt;&lt;/Panel&gt;</pre>
<div class="pitfall">Props chỉ đọc: viết <code>props.name = "x"</code> ném lỗi trong strict mode và luôn là lỗi thiết kế. Nếu thấy muốn sửa một prop, thực chất bạn cần <strong>state</strong> (bài sau) hoặc đẩy thay đổi lên cha.</div>
<h3>Ví dụ có lời giải · Ghép component (composition)</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Avatar</span>({ url }) { <span class="tok-keyword">return</span> &lt;img src={url} className=<span class="tok-string">"av"</span> /&gt;; }
<span class="tok-keyword">function</span> <span class="tok-function">UserRow</span>({ user }) {
  <span class="tok-keyword">return</span> (
    &lt;div className=<span class="tok-string">"row"</span>&gt;
      &lt;Avatar url={user.avatar} /&gt;
      &lt;span&gt;{user.name}&lt;/span&gt;
    &lt;/div&gt;
  );
}</pre>
<p><code>UserRow</code> tái dùng <code>Avatar</code> bằng cách truyền prop. Đây là <strong>composition</strong>: component nhỏ kết hợp thành lớn, mỗi cái làm một việc. Đó là kỹ năng cốt lõi FER202 chấm điểm.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Presentational vs container component.</b> Một cách chia thiết kế hữu ích: component <em>presentational</em> chỉ nhận props và render UI (không logic dữ liệu) — dễ tái dùng và test. Component <em>container</em> fetch/giữ dữ liệu và truyền xuống. Sự phân tách này (Dan Abramov phổ biến) giữ UI "ngốc" và logic tập trung. Với hooks ranh giới đã mờ — ngày nay ta thường tách logic vào <b>custom hook</b> thay vì container component — nhưng bản năng "tách render khỏi dữ liệu" vẫn dẫn lối React sạch.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Dựng component tái dùng</span><span class="lc-sub">Luyện props &amp; composition trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — State: class vs function components|||5.2 — State: component class vs function',
          slug: 'fer202-5-2-state-class-vs-function',
          type: 'VIDEO',
          description: 'State là gì, setState/useState, và vì sao function component thắng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>State — a component's memory</h2>
<p class="lead"><strong>State</strong> is data a component owns and can change over time. When state changes, React re-renders the component. Props come from outside; state lives inside.</p>
<h3>Function component with useState (the modern way)</h3>
<pre><span class="tok-keyword">import</span> { useState } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(0);
  <span class="tok-keyword">return</span> (
    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}</pre>
<div class="out"><b>Result:</b> each click bumps count and the button text re-renders.</div>
<p><code>useState(0)</code> returns <code>[value, setter]</code>. You <strong>never</strong> assign <code>count = 5</code> directly — you call <code>setCount(5)</code> so React knows to re-render.</p>
<h3>The old class equivalent</h3>
<pre><span class="tok-keyword">class</span> <span class="tok-function">Counter</span> <span class="tok-keyword">extends</span> React.Component {
  state = { count: 0 };
  <span class="tok-keyword">render</span>() {
    <span class="tok-keyword">return</span> &lt;button onClick={() =&gt;
      <span class="tok-keyword">this</span>.<span class="tok-function">setState</span>({ count: <span class="tok-keyword">this</span>.state.count + 1 })}&gt;
      {<span class="tok-keyword">this</span>.state.count}
    &lt;/button&gt;;
  }
}</pre>
<p>Both work, but function components + hooks are the standard today — less boilerplate, no <code>this</code>, easier to reuse logic.</p>
<div class="pitfall">State updates are <strong>asynchronous</strong> and batched. Right after <code>setCount(count + 1)</code>, reading <code>count</code> still shows the old value — the new value appears on the next render. To update based on the previous value safely, use the functional form: <code>setCount(c =&gt; c + 1)</code>.</div>
<h3>Ví dụ có lời giải · Worked example (the +2 trap)</h3>
<pre><span class="tok-comment">// BUG: both read the same stale count</span>
<span class="tok-function">setCount</span>(count + 1);
<span class="tok-function">setCount</span>(count + 1); <span class="tok-comment">// count only goes up by 1!</span>

<span class="tok-comment">// FIX: functional updater — each sees the latest</span>
<span class="tok-function">setCount</span>(c =&gt; c + 1);
<span class="tok-function">setCount</span>(c =&gt; c + 1); <span class="tok-comment">// now +2</span></pre>
<p>Because <code>count</code> is captured at render time, calling <code>setCount(count + 1)</code> twice uses the same old number. The functional form <code>c =&gt; c + 1</code> always receives the latest queued value.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>State is a snapshot, not a live variable.</b> A common mental-model fix: on each render, all the variables (including <code>count</code>) are <em>frozen</em> for that render — a snapshot. Event handlers "remember" the values from the render they were created in. This is why <code>setCount(count + 1)</code> twice adds one, and why an interval created in <code>useEffect</code> can log a stale count. Once you internalise "each render has its own props and state", the weirdest React bugs become predictable.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice state &amp; the setter</span><span class="lc-sub">Build counters and toggles on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>State — bộ nhớ của component</h2>
<p class="lead"><strong>State</strong> là dữ liệu component sở hữu và có thể đổi theo thời gian. Khi state đổi, React render lại component. Props đến từ bên ngoài; state sống bên trong.</p>
<h3>Function component với useState (cách hiện đại)</h3>
<pre><span class="tok-keyword">import</span> { useState } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> [count, setCount] = <span class="tok-function">useState</span>(0);
  <span class="tok-keyword">return</span> (
    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}</pre>
<div class="out"><b>Kết quả:</b> mỗi lần bấm tăng count và chữ trên nút render lại.</div>
<p><code>useState(0)</code> trả về <code>[value, setter]</code>. Bạn <strong>không bao giờ</strong> gán <code>count = 5</code> trực tiếp — hãy gọi <code>setCount(5)</code> để React biết cần render lại.</p>
<h3>Bản class cũ tương đương</h3>
<pre><span class="tok-keyword">class</span> <span class="tok-function">Counter</span> <span class="tok-keyword">extends</span> React.Component {
  state = { count: 0 };
  <span class="tok-keyword">render</span>() {
    <span class="tok-keyword">return</span> &lt;button onClick={() =&gt;
      <span class="tok-keyword">this</span>.<span class="tok-function">setState</span>({ count: <span class="tok-keyword">this</span>.state.count + 1 })}&gt;
      {<span class="tok-keyword">this</span>.state.count}
    &lt;/button&gt;;
  }
}</pre>
<p>Cả hai đều chạy, nhưng function component + hooks là chuẩn hiện nay — ít lặp, không <code>this</code>, dễ tái dùng logic.</p>
<div class="pitfall">Cập nhật state là <strong>bất đồng bộ</strong> và gộp lô. Ngay sau <code>setCount(count + 1)</code>, đọc <code>count</code> vẫn thấy giá trị cũ — giá trị mới xuất hiện ở render kế tiếp. Để cập nhật dựa trên giá trị trước một cách an toàn, dùng dạng hàm: <code>setCount(c =&gt; c + 1)</code>.</div>
<h3>Ví dụ có lời giải · Bẫy +2</h3>
<pre><span class="tok-comment">// LỖI: cả hai đọc cùng count cũ</span>
<span class="tok-function">setCount</span>(count + 1);
<span class="tok-function">setCount</span>(count + 1); <span class="tok-comment">// count chỉ tăng 1!</span>

<span class="tok-comment">// SỬA: dạng hàm cập nhật — mỗi cái thấy giá trị mới nhất</span>
<span class="tok-function">setCount</span>(c =&gt; c + 1);
<span class="tok-function">setCount</span>(c =&gt; c + 1); <span class="tok-comment">// giờ +2</span></pre>
<p>Vì <code>count</code> được chốt tại thời điểm render, gọi <code>setCount(count + 1)</code> hai lần dùng cùng số cũ. Dạng hàm <code>c =&gt; c + 1</code> luôn nhận giá trị mới nhất trong hàng đợi.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>State là ảnh chụp, không phải biến sống.</b> Một cách sửa mô hình tư duy: ở mỗi render, mọi biến (kể cả <code>count</code>) bị <em>đóng băng</em> cho render đó — một ảnh chụp. Event handler "nhớ" giá trị từ render tạo ra nó. Vì thế <code>setCount(count + 1)</code> hai lần chỉ cộng một, và một interval tạo trong <code>useEffect</code> có thể log count cũ. Khi đã thấm "mỗi render có props và state riêng", những lỗi React kỳ lạ nhất trở nên đoán được.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện state &amp; setter</span><span class="lc-sub">Dựng counter và toggle trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'fer202-5-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh component & state.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'What are props?|||Props là gì?', options: ['A component internal memory|||Bộ nhớ trong của component', 'Inputs passed from parent to child|||Đầu vào truyền từ cha xuống con', 'A CSS file|||Một file CSS', 'A Redux store|||Một store Redux'], correctIndex: 1, points: 1 },
              { question: 'Can a component modify its own props?|||Component có được sửa props của chính nó?', options: ['Yes always|||Có, luôn', 'No, props are read-only|||Không, props chỉ đọc', 'Only in class components|||Chỉ trong class', 'Only with Redux|||Chỉ với Redux'], correctIndex: 1, points: 1 },
              { question: 'What does useState(0) return?|||useState(0) trả về gì?', options: ['A number|||Một số', 'A [value, setter] pair|||Cặp [value, setter]', 'An object|||Một object', 'undefined'], correctIndex: 1, points: 1 },
              { question: 'How to change state correctly?|||Cách đổi state đúng?', options: ['count = 5', 'Call the setter, e.g. setCount(5)|||Gọi setter, ví dụ setCount(5)', 'props.count = 5', 'render()'], correctIndex: 1, points: 1 },
              { question: 'Which safely updates based on the previous value?|||Cách nào cập nhật an toàn dựa trên giá trị trước?', options: ['setCount(count + 1)', 'setCount(c => c + 1)', 'count++', 'setState()'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — XỬ LÝ SỰ KIỆN ══════════════════ */
    {
      title: 'Chapter 6 — Event Handling|||Chương 6 — Xử lý sự kiện',
      description: 'Bắt sự kiện, synthetic events, truyền tham số cho handler, và form.',
      lessons: [
        {
          title: '6.1 — Event handlers, synthetic events & forms|||6.1 — Event handler, synthetic event & form',
          slug: 'fer202-6-1-events-forms',
          type: 'VIDEO',
          description: 'onClick/onChange, đối tượng sự kiện, và controlled input.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Handling events in React</h2>
<p class="lead">You respond to user actions with event handlers: <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>. In JSX you pass a <strong>function</strong> (not a string) to these camelCase props.</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Toggle</span>() {
  <span class="tok-keyword">const</span> [on, setOn] = <span class="tok-function">useState</span>(<span class="tok-keyword">false</span>);
  <span class="tok-comment">// pass the function reference, don't call it</span>
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; setOn(!on)}&gt;
    {on ? <span class="tok-string">"ON"</span> : <span class="tok-string">"OFF"</span>}
  &lt;/button&gt;;
}</pre>
<div class="out"><b>Result:</b> the button flips between ON and OFF on each click.</div>
<div class="pitfall">Pass the function, don't call it: <code>onClick={handleClick}</code> — <strong>not</strong> <code>onClick={handleClick()}</code>. The second form runs the handler <em>during render</em> and passes its return value, a classic beginner bug (the button "fires on load" or triggers an infinite loop).</div>
<h3>Synthetic events &amp; passing parameters</h3>
<p>React wraps the native event in a <strong>SyntheticEvent</strong> — a cross-browser consistent object. To pass extra arguments, wrap the handler in an arrow function:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">List</span>({ items }) {
  <span class="tok-keyword">const</span> <span class="tok-function">remove</span> = (id, e) =&gt; {
    e.<span class="tok-function">stopPropagation</span>();  <span class="tok-comment">// the synthetic event</span>
    <span class="tok-function">console</span>.log(<span class="tok-string">"remove"</span>, id);
  };
  <span class="tok-keyword">return</span> items.<span class="tok-function">map</span>(it =&gt;
    &lt;li key={it.id} onClick={(e) =&gt; <span class="tok-function">remove</span>(it.id, e)}&gt;{it.name}&lt;/li&gt;
  );
}</pre>
<h3>Controlled form inputs</h3>
<p>A <strong>controlled</strong> input has its value driven by state — React is the single source of truth:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">NameForm</span>() {
  <span class="tok-keyword">const</span> [name, setName] = <span class="tok-function">useState</span>(<span class="tok-string">""</span>);
  <span class="tok-keyword">return</span> (
    &lt;form onSubmit={(e) =&gt; { e.<span class="tok-function">preventDefault</span>(); <span class="tok-function">alert</span>(name); }}&gt;
      &lt;input value={name} onChange={(e) =&gt; setName(e.target.value)} /&gt;
      &lt;button&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}</pre>
<div class="out"><b>Result:</b> typing updates state; Submit shows the current name (no page reload).</div>
<h3>Ví dụ có lời giải · Worked example (preventDefault)</h3>
<p>By default an HTML form <code>submit</code> reloads the page. In a SPA that wipes your state. <code>e.preventDefault()</code> stops the browser's default and lets your JavaScript handle the submit — you'll do this in every React form.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Controlled vs uncontrolled inputs.</b> A <em>controlled</em> input binds <code>value</code> to state and updates on every keystroke — predictable, validatable, but re-renders on each key. An <em>uncontrolled</em> input lets the DOM keep its own value; you read it via a <code>ref</code> only when needed (<code>inputRef.current.value</code>) — fewer renders, closer to plain HTML. The exam favours controlled inputs, but knowing refs matters for file inputs (<code>&lt;input type="file"&gt;</code> is <em>always</em> uncontrolled) and integrating non-React widgets.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build a controlled form</span><span class="lc-sub">Practice onChange &amp; onSubmit on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Xử lý sự kiện trong React</h2>
<p class="lead">Bạn phản hồi hành động người dùng bằng event handler: <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>. Trong JSX bạn truyền một <strong>hàm</strong> (không phải chuỗi) cho các prop camelCase này.</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Toggle</span>() {
  <span class="tok-keyword">const</span> [on, setOn] = <span class="tok-function">useState</span>(<span class="tok-keyword">false</span>);
  <span class="tok-comment">// truyền tham chiếu hàm, đừng gọi nó</span>
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; setOn(!on)}&gt;
    {on ? <span class="tok-string">"ON"</span> : <span class="tok-string">"OFF"</span>}
  &lt;/button&gt;;
}</pre>
<div class="out"><b>Kết quả:</b> nút đảo giữa ON và OFF mỗi lần bấm.</div>
<div class="pitfall">Truyền hàm, đừng gọi nó: <code>onClick={handleClick}</code> — <strong>không phải</strong> <code>onClick={handleClick()}</code>. Dạng thứ hai chạy handler <em>ngay lúc render</em> và truyền giá trị trả về, một lỗi kinh điển của người mới (nút "kích hoạt lúc tải" hoặc gây vòng lặp vô hạn).</div>
<h3>Synthetic event &amp; truyền tham số</h3>
<p>React bọc sự kiện gốc trong một <strong>SyntheticEvent</strong> — object nhất quán đa trình duyệt. Để truyền thêm tham số, bọc handler trong arrow function:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">List</span>({ items }) {
  <span class="tok-keyword">const</span> <span class="tok-function">remove</span> = (id, e) =&gt; {
    e.<span class="tok-function">stopPropagation</span>();  <span class="tok-comment">// synthetic event</span>
    <span class="tok-function">console</span>.log(<span class="tok-string">"remove"</span>, id);
  };
  <span class="tok-keyword">return</span> items.<span class="tok-function">map</span>(it =&gt;
    &lt;li key={it.id} onClick={(e) =&gt; <span class="tok-function">remove</span>(it.id, e)}&gt;{it.name}&lt;/li&gt;
  );
}</pre>
<h3>Controlled form input</h3>
<p>Một input <strong>controlled</strong> có value do state điều khiển — React là nguồn sự thật duy nhất:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">NameForm</span>() {
  <span class="tok-keyword">const</span> [name, setName] = <span class="tok-function">useState</span>(<span class="tok-string">""</span>);
  <span class="tok-keyword">return</span> (
    &lt;form onSubmit={(e) =&gt; { e.<span class="tok-function">preventDefault</span>(); <span class="tok-function">alert</span>(name); }}&gt;
      &lt;input value={name} onChange={(e) =&gt; setName(e.target.value)} /&gt;
      &lt;button&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}</pre>
<div class="out"><b>Kết quả:</b> gõ cập nhật state; Submit hiện tên hiện tại (không reload trang).</div>
<h3>Ví dụ có lời giải · preventDefault</h3>
<p>Mặc định form HTML khi <code>submit</code> sẽ reload trang. Trong SPA điều đó xoá sạch state. <code>e.preventDefault()</code> chặn hành vi mặc định của trình duyệt và để JavaScript của bạn xử lý submit — bạn sẽ làm điều này trong mọi form React.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Controlled vs uncontrolled input.</b> Input <em>controlled</em> gắn <code>value</code> với state và cập nhật mỗi phím — đoán được, kiểm tra được, nhưng render lại mỗi phím. Input <em>uncontrolled</em> để DOM giữ value riêng; bạn đọc qua <code>ref</code> chỉ khi cần (<code>inputRef.current.value</code>) — ít render hơn, gần HTML thuần. Đề thi ưu ái input controlled, nhưng biết ref quan trọng cho input file (<code>&lt;input type="file"&gt;</code> <em>luôn</em> uncontrolled) và tích hợp widget ngoài React.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Dựng form controlled</span><span class="lc-sub">Luyện onChange &amp; onSubmit trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'fer202-6-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh xử lý sự kiện.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'What do you pass to onClick in JSX?|||Bạn truyền gì cho onClick trong JSX?', options: ['A string|||Một chuỗi', 'A function|||Một hàm', 'A number|||Một số', 'CSS'], correctIndex: 1, points: 1 },
              { question: 'onClick={handleClick()} is wrong because it?|||onClick={handleClick()} sai vì?', options: ['Is too slow|||Quá chậm', 'Calls the handler during render|||Gọi handler ngay lúc render', 'Needs Redux|||Cần Redux', 'Is invalid JSX|||JSX không hợp lệ'], correctIndex: 1, points: 1 },
              { question: 'What does e.preventDefault() do on a form submit?|||e.preventDefault() làm gì khi submit form?', options: ['Clears the form|||Xoá form', 'Stops the default page reload|||Chặn reload trang mặc định', 'Validates fields|||Kiểm tra field', 'Submits to a server|||Gửi lên server'], correctIndex: 1, points: 1 },
              { question: 'A controlled input gets its value from?|||Input controlled lấy value từ đâu?', options: ['The DOM|||DOM', 'React state|||State của React', 'A ref', 'localStorage'], correctIndex: 1, points: 1 },
              { question: 'React wraps native events in a?|||React bọc sự kiện gốc trong?', options: ['Promise', 'SyntheticEvent', 'Reducer', 'Context'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — PROPS & CONTEXT ══════════════════ */
    {
      title: 'Chapter 7 — Props patterns & Context|||Chương 7 — Mẫu props & Context',
      description: 'Container components, render props, và chia sẻ dữ liệu bằng Context.',
      lessons: [
        {
          title: '7.1 — Prop drilling & the Context API|||7.1 — Prop drilling & Context API',
          slug: 'fer202-7-1-context',
          type: 'VIDEO',
          description: 'Vấn đề truyền props sâu, và Context giải quyết ra sao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Prop drilling &amp; the Context API</h2>
<p class="lead">Data flows parent → child through props. But when a deeply nested component needs data from far above, you'd have to pass it through every level in between — the "<strong>prop drilling</strong>" problem. <strong>Context</strong> lets you broadcast a value to any depth without threading props.</p>
<h3>The prop-drilling pain</h3>
<pre><span class="tok-comment">// theme has to pass through Layout and Header just to reach Button</span>
&lt;App theme=...&gt; → &lt;Layout theme&gt; → &lt;Header theme&gt; → &lt;Button theme&gt;</pre>
<p>The middle components don't use <code>theme</code> at all — they just forward it. Tedious and fragile.</p>
<h3>Context — three steps</h3>
<pre><span class="tok-keyword">import</span> { createContext, useContext } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-comment">// 1) create a context</span>
<span class="tok-keyword">const</span> ThemeContext = <span class="tok-function">createContext</span>(<span class="tok-string">"light"</span>);

<span class="tok-comment">// 2) provide a value at the top</span>
<span class="tok-keyword">function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">return</span> (
    &lt;ThemeContext.Provider value=<span class="tok-string">"dark"</span>&gt;
      &lt;Layout /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}

<span class="tok-comment">// 3) consume it anywhere below — no props needed</span>
<span class="tok-keyword">function</span> <span class="tok-function">Button</span>() {
  <span class="tok-keyword">const</span> theme = <span class="tok-function">useContext</span>(ThemeContext);
  <span class="tok-keyword">return</span> &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</pre>
<div class="out"><b>Result:</b> Button reads "dark" directly — Layout and Header never touch theme.</div>
<div class="pitfall">Don't reach for Context too early. For 1-2 levels, plain props are clearer. Context shines for truly global data: current user, theme, language. Overusing it makes components hard to reuse (they now depend on a provider being present).</div>
<h3>Ví dụ có lời giải · Worked example (auth context)</h3>
<pre><span class="tok-keyword">const</span> AuthContext = <span class="tok-function">createContext</span>(<span class="tok-keyword">null</span>);
<span class="tok-keyword">function</span> <span class="tok-function">Navbar</span>() {
  <span class="tok-keyword">const</span> user = <span class="tok-function">useContext</span>(AuthContext);
  <span class="tok-keyword">return</span> &lt;span&gt;{user ? user.name : <span class="tok-string">"Guest"</span>}&lt;/span&gt;;
}</pre>
<p>Any component in the tree calls <code>useContext(AuthContext)</code> to get the logged-in user — no matter how deep. This is the standard pattern for user/session data.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Context is not a state manager — and re-render cost.</b> Context <em>distributes</em> a value; it doesn't manage updates efficiently. When a provider's <code>value</code> changes, <b>every</b> consumer re-renders, even ones using an unchanged part of the object. For large, frequently-updated global state this is why teams reach for Redux/Zustand instead. Common fix: split contexts (a stable "dispatch" context + a changing "state" context), or memoise the <code>value</code> object so it only changes when it must.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Prop drilling &amp; Context API</h2>
<p class="lead">Dữ liệu chảy cha → con qua props. Nhưng khi một component lồng sâu cần dữ liệu từ tít trên cao, bạn phải truyền qua mọi tầng ở giữa — vấn đề "<strong>prop drilling</strong>". <strong>Context</strong> cho phép phát một giá trị tới mọi độ sâu mà không phải xâu chuỗi props.</p>
<h3>Nỗi đau prop drilling</h3>
<pre><span class="tok-comment">// theme phải đi qua Layout và Header chỉ để tới Button</span>
&lt;App theme=...&gt; → &lt;Layout theme&gt; → &lt;Header theme&gt; → &lt;Button theme&gt;</pre>
<p>Các component ở giữa chẳng dùng <code>theme</code> — chỉ chuyển tiếp. Nhàm chán và dễ vỡ.</p>
<h3>Context — ba bước</h3>
<pre><span class="tok-keyword">import</span> { createContext, useContext } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-comment">// 1) tạo context</span>
<span class="tok-keyword">const</span> ThemeContext = <span class="tok-function">createContext</span>(<span class="tok-string">"light"</span>);

<span class="tok-comment">// 2) cung cấp value ở trên cùng</span>
<span class="tok-keyword">function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">return</span> (
    &lt;ThemeContext.Provider value=<span class="tok-string">"dark"</span>&gt;
      &lt;Layout /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}

<span class="tok-comment">// 3) tiêu thụ ở bất kỳ đâu bên dưới — không cần props</span>
<span class="tok-keyword">function</span> <span class="tok-function">Button</span>() {
  <span class="tok-keyword">const</span> theme = <span class="tok-function">useContext</span>(ThemeContext);
  <span class="tok-keyword">return</span> &lt;button className={theme}&gt;Click&lt;/button&gt;;
}</pre>
<div class="out"><b>Kết quả:</b> Button đọc "dark" trực tiếp — Layout và Header không chạm theme.</div>
<div class="pitfall">Đừng vội dùng Context. Với 1-2 tầng, props thuần rõ ràng hơn. Context toả sáng với dữ liệu thật sự toàn cục: người dùng hiện tại, theme, ngôn ngữ. Lạm dụng làm component khó tái dùng (giờ chúng phụ thuộc vào việc có một provider tồn tại).</div>
<h3>Ví dụ có lời giải · Auth context</h3>
<pre><span class="tok-keyword">const</span> AuthContext = <span class="tok-function">createContext</span>(<span class="tok-keyword">null</span>);
<span class="tok-keyword">function</span> <span class="tok-function">Navbar</span>() {
  <span class="tok-keyword">const</span> user = <span class="tok-function">useContext</span>(AuthContext);
  <span class="tok-keyword">return</span> &lt;span&gt;{user ? user.name : <span class="tok-string">"Guest"</span>}&lt;/span&gt;;
}</pre>
<p>Bất kỳ component nào trong cây gọi <code>useContext(AuthContext)</code> để lấy người dùng đã đăng nhập — dù sâu tới đâu. Đây là mẫu chuẩn cho dữ liệu người dùng/phiên.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Context không phải trình quản lý state — và chi phí render lại.</b> Context <em>phân phối</em> một giá trị; nó không quản lý cập nhật hiệu quả. Khi <code>value</code> của provider đổi, <b>mọi</b> consumer render lại, kể cả cái dùng phần không đổi của object. Với state toàn cục lớn, cập nhật thường xuyên, đây là lý do các đội chọn Redux/Zustand. Cách sửa phổ biến: tách context (một context "dispatch" ổn định + một context "state" thay đổi), hoặc memo hoá object <code>value</code> để nó chỉ đổi khi cần.</div>
</div>
`,
        },
        {
          title: '7.2 — Reusable components: children & render props|||7.2 — Component tái dùng: children & render props',
          slug: 'fer202-7-2-render-props',
          type: 'VIDEO',
          description: 'Các mẫu chia sẻ hành vi: children, render props, và hướng tới custom hooks.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Crafting reusable components</h2>
<p class="lead">Beyond passing data, React has patterns for sharing <strong>behaviour</strong> and <strong>layout</strong> between components: the <code>children</code> prop, and <strong>render props</strong>.</p>
<h3>children — flexible layout</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Modal</span>({ title, children }) {
  <span class="tok-keyword">return</span> (
    &lt;div className=<span class="tok-string">"modal"</span>&gt;
      &lt;h3&gt;{title}&lt;/h3&gt;
      &lt;div className=<span class="tok-string">"body"</span>&gt;{children}&lt;/div&gt;
    &lt;/div&gt;
  );
}
&lt;Modal title=<span class="tok-string">"Hi"</span>&gt;&lt;p&gt;Any content&lt;/p&gt;&lt;/Modal&gt;</pre>
<p><code>Modal</code> supplies the frame; the caller supplies the inside via <code>children</code>. One <code>Modal</code>, infinite contents.</p>
<h3>Render props — sharing logic</h3>
<p>A <strong>render prop</strong> is a prop whose value is a function returning JSX. The component runs logic and calls that function with the result:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">MouseTracker</span>({ render }) {
  <span class="tok-keyword">const</span> [pos, setPos] = <span class="tok-function">useState</span>({ x: 0, y: 0 });
  <span class="tok-keyword">return</span> &lt;div onMouseMove={(e) =&gt; setPos({ x: e.clientX, y: e.clientY })}&gt;
    {render(pos)}
  &lt;/div&gt;;
}
&lt;MouseTracker render={(p) =&gt; &lt;span&gt;{p.x}, {p.y}&lt;/span&gt;} /&gt;</pre>
<div class="out"><b>Result:</b> the tracker owns the mouse logic; the caller decides how to display it.</div>
<div class="pitfall">Render props were the pre-hooks way to share stateful logic. They work but create "wrapper hell" (deeply nested render callbacks). Today the same reuse is done more cleanly with <strong>custom hooks</strong> — you'll see this once you know hooks (Chapter 8).</div>
<h3>Ví dụ có lời giải · Worked example (custom hook preview)</h3>
<pre><span class="tok-comment">// The modern replacement for the render-prop tracker</span>
<span class="tok-keyword">function</span> <span class="tok-function">useMousePosition</span>() {
  <span class="tok-keyword">const</span> [pos, setPos] = <span class="tok-function">useState</span>({ x: 0, y: 0 });
  <span class="tok-comment">// (attach a listener in useEffect — Ch8)</span>
  <span class="tok-keyword">return</span> pos;
}
<span class="tok-comment">// Any component: const pos = useMousePosition();</span></pre>
<p>A custom hook is just a function starting with <code>use</code> that calls other hooks. It shares logic without any wrapper components — cleaner than render props for most cases.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The evolution of code reuse in React.</b> React's history is a story of reusing logic: mixins (deprecated) → Higher-Order Components (HOCs, functions wrapping components) → render props → <b>custom hooks</b> (today's answer). Each solved the previous one's pain. You may still meet HOCs like <code>connect()</code> in older Redux code, but for new code the rule is simple: <em>share logic with a custom hook, share layout with children/composition.</em></div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice reusable patterns</span><span class="lc-sub">children &amp; render props on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Tạo component tái dùng</h2>
<p class="lead">Ngoài truyền dữ liệu, React có các mẫu chia sẻ <strong>hành vi</strong> và <strong>layout</strong> giữa các component: prop <code>children</code>, và <strong>render props</strong>.</p>
<h3>children — layout linh hoạt</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Modal</span>({ title, children }) {
  <span class="tok-keyword">return</span> (
    &lt;div className=<span class="tok-string">"modal"</span>&gt;
      &lt;h3&gt;{title}&lt;/h3&gt;
      &lt;div className=<span class="tok-string">"body"</span>&gt;{children}&lt;/div&gt;
    &lt;/div&gt;
  );
}
&lt;Modal title=<span class="tok-string">"Hi"</span>&gt;&lt;p&gt;Any content&lt;/p&gt;&lt;/Modal&gt;</pre>
<p><code>Modal</code> cung cấp khung; người gọi cung cấp phần bên trong qua <code>children</code>. Một <code>Modal</code>, vô số nội dung.</p>
<h3>Render props — chia sẻ logic</h3>
<p>Một <strong>render prop</strong> là prop có giá trị là hàm trả về JSX. Component chạy logic rồi gọi hàm đó với kết quả:</p>
<pre><span class="tok-keyword">function</span> <span class="tok-function">MouseTracker</span>({ render }) {
  <span class="tok-keyword">const</span> [pos, setPos] = <span class="tok-function">useState</span>({ x: 0, y: 0 });
  <span class="tok-keyword">return</span> &lt;div onMouseMove={(e) =&gt; setPos({ x: e.clientX, y: e.clientY })}&gt;
    {render(pos)}
  &lt;/div&gt;;
}
&lt;MouseTracker render={(p) =&gt; &lt;span&gt;{p.x}, {p.y}&lt;/span&gt;} /&gt;</pre>
<div class="out"><b>Kết quả:</b> tracker sở hữu logic chuột; người gọi quyết định hiển thị.</div>
<div class="pitfall">Render props là cách chia sẻ logic có state thời trước hooks. Chúng chạy được nhưng tạo "wrapper hell" (callback render lồng sâu). Ngày nay việc tái dùng đó làm gọn hơn bằng <strong>custom hook</strong> — bạn sẽ thấy khi đã biết hooks (Chương 8).</div>
<h3>Ví dụ có lời giải · Xem trước custom hook</h3>
<pre><span class="tok-comment">// Bản thay thế hiện đại cho tracker render-prop</span>
<span class="tok-keyword">function</span> <span class="tok-function">useMousePosition</span>() {
  <span class="tok-keyword">const</span> [pos, setPos] = <span class="tok-function">useState</span>({ x: 0, y: 0 });
  <span class="tok-comment">// (gắn listener trong useEffect — Ch8)</span>
  <span class="tok-keyword">return</span> pos;
}
<span class="tok-comment">// Component bất kỳ: const pos = useMousePosition();</span></pre>
<p>Custom hook chỉ là một hàm bắt đầu bằng <code>use</code> gọi các hook khác. Nó chia sẻ logic mà không cần component bọc — sạch hơn render props trong hầu hết trường hợp.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Tiến hoá của tái dùng code trong React.</b> Lịch sử React là câu chuyện tái dùng logic: mixin (bỏ) → Higher-Order Component (HOC, hàm bọc component) → render props → <b>custom hook</b> (đáp án hiện nay). Mỗi cái giải quyết nỗi đau của cái trước. Bạn vẫn có thể gặp HOC như <code>connect()</code> trong code Redux cũ, nhưng với code mới quy tắc đơn giản: <em>chia sẻ logic bằng custom hook, chia sẻ layout bằng children/composition.</em></div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện mẫu tái dùng</span><span class="lc-sub">children &amp; render props trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'fer202-7-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh props & context.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'What is prop drilling?|||Prop drilling là gì?', options: ['A build error|||Lỗi build', 'Passing props through many intermediate components|||Truyền props qua nhiều component trung gian', 'A Redux action|||Một action Redux', 'A CSS technique|||Kỹ thuật CSS'], correctIndex: 1, points: 1 },
              { question: 'Which hook reads a context value?|||Hook nào đọc giá trị context?', options: ['useState', 'useContext', 'useEffect', 'useRef'], correctIndex: 1, points: 1 },
              { question: 'When does a context consumer re-render?|||Consumer của context render lại khi nào?', options: ['Never|||Không bao giờ', 'When the provider value changes|||Khi value của provider đổi', 'Only on mount|||Chỉ khi mount', 'When props change|||Khi props đổi'], correctIndex: 1, points: 1 },
              { question: 'The children prop contains?|||Prop children chứa gì?', options: ['The parent component|||Component cha', 'The content between the component tags|||Nội dung giữa hai thẻ component', 'CSS classes|||Class CSS', 'The state|||State'], correctIndex: 1, points: 1 },
              { question: 'The modern replacement for render props to share logic is?|||Bản thay thế hiện đại cho render props để chia sẻ logic là?', options: ['HOCs|||HOC', 'Custom hooks|||Custom hook', 'Mixins', 'Redux'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — HOOKS ══════════════════ */
    {
      title: 'Chapter 8 — Hooks|||Chương 8 — Hooks',
      description: 'useState, useEffect, useContext, useReducer — trái tim của React hiện đại.',
      lessons: [
        {
          title: '8.1 — useState & useEffect|||8.1 — useState & useEffect',
          slug: 'fer202-8-1-usestate-useeffect',
          type: 'VIDEO',
          description: 'State và side-effects trong function component.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Hooks: useState &amp; useEffect</h2>
<p class="lead"><strong>Hooks</strong> are functions (named <code>use...</code>) that let function components "hook into" React features — state, lifecycle, context. You already met <code>useState</code>; now meet the second essential: <code>useEffect</code>.</p>
<h3>useEffect — side effects</h3>
<p>A <strong>side effect</strong> is anything outside rendering: fetching data, subscriptions, timers, manual DOM changes. <code>useEffect</code> runs code <em>after</em> render.</p>
<pre><span class="tok-keyword">import</span> { useState, useEffect } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Clock</span>() {
  <span class="tok-keyword">const</span> [now, setNow] = <span class="tok-function">useState</span>(<span class="tok-keyword">new</span> <span class="tok-function">Date</span>());
  <span class="tok-function">useEffect</span>(() =&gt; {
    <span class="tok-keyword">const</span> id = <span class="tok-function">setInterval</span>(() =&gt; setNow(<span class="tok-keyword">new</span> <span class="tok-function">Date</span>()), 1000);
    <span class="tok-keyword">return</span> () =&gt; <span class="tok-function">clearInterval</span>(id); <span class="tok-comment">// cleanup on unmount</span>
  }, []); <span class="tok-comment">// [] = run once after first render</span>
  <span class="tok-keyword">return</span> &lt;p&gt;{now.<span class="tok-function">toLocaleTimeString</span>()}&lt;/p&gt;;
}</pre>
<div class="out"><b>Result:</b> a ticking clock; the interval is cleaned up when the component leaves.</div>
<h3>The dependency array</h3>
<ul>
  <li><code>useEffect(fn)</code> — runs after <strong>every</strong> render.</li>
  <li><code>useEffect(fn, [])</code> — runs <strong>once</strong> (after mount).</li>
  <li><code>useEffect(fn, [id])</code> — runs when <code>id</code> changes.</li>
</ul>
<div class="pitfall">Forgetting to <strong>clean up</strong> (return a function) leaks intervals, listeners and subscriptions — they pile up on every re-render. Also: an empty <code>[]</code> when the effect actually uses a prop/state creates a <strong>stale closure</strong> (it keeps the first value forever). List every value the effect reads in the dependency array.</div>
<h3>Ví dụ có lời giải · Worked example (fetch on mount)</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Users</span>() {
  <span class="tok-keyword">const</span> [users, setUsers] = <span class="tok-function">useState</span>([]);
  <span class="tok-function">useEffect</span>(() =&gt; {
    <span class="tok-function">fetch</span>(<span class="tok-string">"/api/users"</span>)
      .<span class="tok-function">then</span>(r =&gt; r.<span class="tok-function">json</span>())
      .<span class="tok-function">then</span>(setUsers);
  }, []); <span class="tok-comment">// fetch once</span>
  <span class="tok-keyword">return</span> &lt;ul&gt;{users.<span class="tok-function">map</span>(u =&gt; &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;;
}</pre>
<p>Fetch in <code>useEffect</code> (not during render — render must be pure). Store the result in state; React re-renders with the data. This is the canonical data-loading pattern (full version in Chapter 11).</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Stale closures — the #1 useEffect bug.</b> Because each render captures its own variables, an effect with <code>[]</code> "remembers" the state from the first render forever. A <code>setInterval</code> that logs <code>count</code> will keep logging <code>0</code> even as the UI shows 10. Fixes: add the value to the deps (effect re-subscribes), or use the functional updater <code>setCount(c =&gt; c + 1)</code> which doesn't need to read <code>count</code>. The ESLint rule <code>react-hooks/exhaustive-deps</code> exists precisely to catch this — never blindly silence it.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice useState &amp; useEffect</span><span class="lc-sub">Build a clock and a fetcher on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Hooks: useState &amp; useEffect</h2>
<p class="lead"><strong>Hooks</strong> là các hàm (tên <code>use...</code>) cho phép function component "móc vào" tính năng React — state, vòng đời, context. Bạn đã gặp <code>useState</code>; giờ gặp cái thiết yếu thứ hai: <code>useEffect</code>.</p>
<h3>useEffect — side effect</h3>
<p>Một <strong>side effect</strong> là bất cứ thứ gì ngoài việc render: fetch dữ liệu, subscription, timer, chỉnh DOM thủ công. <code>useEffect</code> chạy code <em>sau</em> khi render.</p>
<pre><span class="tok-keyword">import</span> { useState, useEffect } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Clock</span>() {
  <span class="tok-keyword">const</span> [now, setNow] = <span class="tok-function">useState</span>(<span class="tok-keyword">new</span> <span class="tok-function">Date</span>());
  <span class="tok-function">useEffect</span>(() =&gt; {
    <span class="tok-keyword">const</span> id = <span class="tok-function">setInterval</span>(() =&gt; setNow(<span class="tok-keyword">new</span> <span class="tok-function">Date</span>()), 1000);
    <span class="tok-keyword">return</span> () =&gt; <span class="tok-function">clearInterval</span>(id); <span class="tok-comment">// dọn dẹp khi unmount</span>
  }, []); <span class="tok-comment">// [] = chạy một lần sau render đầu</span>
  <span class="tok-keyword">return</span> &lt;p&gt;{now.<span class="tok-function">toLocaleTimeString</span>()}&lt;/p&gt;;
}</pre>
<div class="out"><b>Kết quả:</b> đồng hồ chạy; interval được dọn khi component rời đi.</div>
<h3>Mảng phụ thuộc (dependency array)</h3>
<ul>
  <li><code>useEffect(fn)</code> — chạy sau <strong>mọi</strong> render.</li>
  <li><code>useEffect(fn, [])</code> — chạy <strong>một lần</strong> (sau mount).</li>
  <li><code>useEffect(fn, [id])</code> — chạy khi <code>id</code> đổi.</li>
</ul>
<div class="pitfall">Quên <strong>dọn dẹp</strong> (return một hàm) làm rò rỉ interval, listener và subscription — chúng chồng lên mỗi lần render lại. Ngoài ra: để <code>[]</code> rỗng trong khi effect thực sự dùng một prop/state tạo ra <strong>stale closure</strong> (nó giữ giá trị đầu mãi mãi). Liệt kê mọi giá trị effect đọc vào mảng phụ thuộc.</div>
<h3>Ví dụ có lời giải · Fetch khi mount</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">Users</span>() {
  <span class="tok-keyword">const</span> [users, setUsers] = <span class="tok-function">useState</span>([]);
  <span class="tok-function">useEffect</span>(() =&gt; {
    <span class="tok-function">fetch</span>(<span class="tok-string">"/api/users"</span>)
      .<span class="tok-function">then</span>(r =&gt; r.<span class="tok-function">json</span>())
      .<span class="tok-function">then</span>(setUsers);
  }, []); <span class="tok-comment">// fetch một lần</span>
  <span class="tok-keyword">return</span> &lt;ul&gt;{users.<span class="tok-function">map</span>(u =&gt; &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;;
}</pre>
<p>Fetch trong <code>useEffect</code> (không phải lúc render — render phải thuần khiết). Lưu kết quả vào state; React render lại với dữ liệu. Đây là mẫu tải dữ liệu kinh điển (bản đầy đủ ở Chương 11).</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Stale closure — lỗi useEffect số 1.</b> Vì mỗi render chốt biến riêng, một effect với <code>[]</code> "nhớ" state của render đầu mãi mãi. Một <code>setInterval</code> log <code>count</code> sẽ cứ log <code>0</code> dù UI hiện 10. Cách sửa: thêm giá trị vào deps (effect đăng ký lại), hoặc dùng dạng hàm <code>setCount(c =&gt; c + 1)</code> vốn không cần đọc <code>count</code>. Luật ESLint <code>react-hooks/exhaustive-deps</code> tồn tại chính để bắt lỗi này — đừng bao giờ tắt nó một cách mù quáng.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện useState &amp; useEffect</span><span class="lc-sub">Dựng đồng hồ và bộ fetch trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '8.2 — useContext & useReducer|||8.2 — useContext & useReducer',
          slug: 'fer202-8-2-usecontext-usereducer',
          type: 'VIDEO',
          description: 'Đọc context bằng hook, và quản lý state phức tạp bằng reducer.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>useContext &amp; useReducer</h2>
<p class="lead">Two more essential hooks: <code>useContext</code> reads shared data (you saw it in Chapter 7), and <code>useReducer</code> manages complex state with a predictable update function — the same idea Redux uses.</p>
<h3>useReducer — state via a reducer</h3>
<p>When state has many related fields or complex transitions, <code>useReducer</code> centralises the "how to update" logic in one <strong>reducer</strong> function:</p>
<pre><span class="tok-keyword">import</span> { useReducer } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-comment">// (state, action) =&gt; newState</span>
<span class="tok-keyword">function</span> <span class="tok-function">reducer</span>(state, action) {
  <span class="tok-keyword">switch</span> (action.type) {
    <span class="tok-keyword">case</span> <span class="tok-string">"inc"</span>: <span class="tok-keyword">return</span> { count: state.count + 1 };
    <span class="tok-keyword">case</span> <span class="tok-string">"dec"</span>: <span class="tok-keyword">return</span> { count: state.count - 1 };
    <span class="tok-keyword">default</span>: <span class="tok-keyword">return</span> state;
  }
}

<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> [state, dispatch] = <span class="tok-function">useReducer</span>(reducer, { count: 0 });
  <span class="tok-keyword">return</span> (
    &lt;&gt;
      &lt;button onClick={() =&gt; dispatch({ type: <span class="tok-string">"dec"</span> })}&gt;-&lt;/button&gt;
      &lt;span&gt;{state.count}&lt;/span&gt;
      &lt;button onClick={() =&gt; dispatch({ type: <span class="tok-string">"inc"</span> })}&gt;+&lt;/button&gt;
    &lt;/&gt;
  );
}</pre>
<div class="out"><b>Result:</b> +/- buttons update count through dispatched actions.</div>
<p>You <strong>dispatch</strong> an action (a plain object describing what happened); the reducer computes the next state. This makes updates traceable and testable.</p>
<div class="pitfall">A reducer must be a <strong>pure</strong> function: given the same state and action it always returns the same new state, with no side effects (no fetch, no mutation of the old state). Return a <em>new</em> object; never write <code>state.count++</code> and return <code>state</code>.</div>
<h3>useReducer + useContext = mini Redux</h3>
<p>Combine them: put <code>state</code> and <code>dispatch</code> into a Context, and any component can read state or dispatch actions — a lightweight global store without any library. This is exactly the mental bridge to Redux (Chapter 12).</p>
<h3>Ví dụ có lời giải · Worked example (useState vs useReducer)</h3>
<p>Rule of thumb: reach for <code>useReducer</code> when (a) the next state depends on the previous in complex ways, (b) several values change together, or (c) you want update logic outside the component (testable). For a single boolean or number, <code>useState</code> is simpler — don't over-engineer.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Rules of Hooks &amp; why order matters.</b> Hooks must be called (1) only at the <em>top level</em> of a component — never inside <code>if</code>, loops, or nested functions — and (2) only from React functions. Why? React tracks hooks <b>by call order</b>, not by name. It keeps an internal list and matches each <code>useState</code>/<code>useEffect</code> to a slot by the order it runs. Put a hook behind an <code>if</code> and the order shifts between renders, so React hands the wrong state to the wrong hook. This one rule explains the <code>eslint-plugin-react-hooks</code> warnings you'll see constantly.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice useReducer</span><span class="lc-sub">Build a reducer-driven counter on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>useContext &amp; useReducer</h2>
<p class="lead">Hai hook thiết yếu nữa: <code>useContext</code> đọc dữ liệu chia sẻ (bạn đã thấy ở Chương 7), và <code>useReducer</code> quản lý state phức tạp bằng một hàm cập nhật đoán được — chính ý tưởng Redux dùng.</p>
<h3>useReducer — state qua reducer</h3>
<p>Khi state có nhiều field liên quan hoặc chuyển đổi phức tạp, <code>useReducer</code> gom logic "cập nhật thế nào" vào một hàm <strong>reducer</strong>:</p>
<pre><span class="tok-keyword">import</span> { useReducer } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-comment">// (state, action) =&gt; newState</span>
<span class="tok-keyword">function</span> <span class="tok-function">reducer</span>(state, action) {
  <span class="tok-keyword">switch</span> (action.type) {
    <span class="tok-keyword">case</span> <span class="tok-string">"inc"</span>: <span class="tok-keyword">return</span> { count: state.count + 1 };
    <span class="tok-keyword">case</span> <span class="tok-string">"dec"</span>: <span class="tok-keyword">return</span> { count: state.count - 1 };
    <span class="tok-keyword">default</span>: <span class="tok-keyword">return</span> state;
  }
}

<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> [state, dispatch] = <span class="tok-function">useReducer</span>(reducer, { count: 0 });
  <span class="tok-keyword">return</span> (
    &lt;&gt;
      &lt;button onClick={() =&gt; dispatch({ type: <span class="tok-string">"dec"</span> })}&gt;-&lt;/button&gt;
      &lt;span&gt;{state.count}&lt;/span&gt;
      &lt;button onClick={() =&gt; dispatch({ type: <span class="tok-string">"inc"</span> })}&gt;+&lt;/button&gt;
    &lt;/&gt;
  );
}</pre>
<div class="out"><b>Kết quả:</b> nút +/- cập nhật count qua các action được dispatch.</div>
<p>Bạn <strong>dispatch</strong> một action (object thuần mô tả điều gì xảy ra); reducer tính state kế tiếp. Điều này khiến cập nhật lần theo được và test được.</p>
<div class="pitfall">Reducer phải là hàm <strong>thuần khiết</strong>: cùng state và action luôn trả về cùng state mới, không side effect (không fetch, không sửa state cũ). Trả về object <em>mới</em>; đừng bao giờ viết <code>state.count++</code> rồi trả về <code>state</code>.</div>
<h3>useReducer + useContext = Redux mini</h3>
<p>Kết hợp chúng: đặt <code>state</code> và <code>dispatch</code> vào một Context, và mọi component có thể đọc state hoặc dispatch action — một store toàn cục nhẹ không cần thư viện. Đây chính là cầu nối tư duy tới Redux (Chương 12).</p>
<h3>Ví dụ có lời giải · useState vs useReducer</h3>
<p>Nguyên tắc: chọn <code>useReducer</code> khi (a) state kế tiếp phụ thuộc phức tạp vào state trước, (b) nhiều giá trị đổi cùng lúc, hoặc (c) bạn muốn logic cập nhật ở ngoài component (test được). Với một boolean hay số đơn lẻ, <code>useState</code> đơn giản hơn — đừng làm quá.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Rules of Hooks &amp; vì sao thứ tự quan trọng.</b> Hook phải được gọi (1) chỉ ở <em>cấp cao nhất</em> của component — không bao giờ trong <code>if</code>, vòng lặp hay hàm lồng — và (2) chỉ từ hàm React. Vì sao? React theo dõi hook <b>theo thứ tự gọi</b>, không theo tên. Nó giữ một danh sách nội bộ và khớp mỗi <code>useState</code>/<code>useEffect</code> với một ô theo thứ tự chạy. Đặt một hook sau <code>if</code> thì thứ tự lệch giữa các render, React trao nhầm state cho nhầm hook. Quy tắc này giải thích các cảnh báo <code>eslint-plugin-react-hooks</code> bạn sẽ thấy liên tục.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện useReducer</span><span class="lc-sub">Dựng counter dùng reducer trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'fer202-8-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh hooks.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'What is useEffect for?|||useEffect dùng để làm gì?', options: ['Styling|||Style', 'Running side effects after render|||Chạy side effect sau render', 'Creating context|||Tạo context', 'Routing'], correctIndex: 1, points: 1 },
              { question: 'useEffect(fn, []) runs when?|||useEffect(fn, []) chạy khi nào?', options: ['On every render|||Mỗi render', 'Once after mount|||Một lần sau mount', 'Never|||Không bao giờ', 'On unmount only|||Chỉ khi unmount'], correctIndex: 1, points: 1 },
              { question: 'What does the function returned from useEffect do?|||Hàm trả về từ useEffect làm gì?', options: ['Nothing|||Không gì', 'Cleanup (e.g. clearInterval)|||Dọn dẹp (vd clearInterval)', 'Re-render|||Render lại', 'Fetch data|||Fetch dữ liệu'], correctIndex: 1, points: 1 },
              { question: 'A reducer function signature is?|||Chữ ký hàm reducer là?', options: ['() => state', '(state, action) => newState', '(props) => JSX', '(action) => void'], correctIndex: 1, points: 1 },
              { question: 'Why must hooks be called at the top level (not in if)?|||Vì sao hook phải gọi ở cấp cao nhất (không trong if)?', options: ['For speed|||Cho nhanh', 'React tracks hooks by call order|||React theo dõi hook theo thứ tự gọi', 'if is not allowed in JS|||if không được phép trong JS', 'To save memory|||Tiết kiệm bộ nhớ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 — CLO1–CLO6|||Bài kiểm tra tiến độ 1 — CLO1–CLO6',
      description: 'Kiểm tra giữa chặng: ES6, JSX, Bootstrap, component, state, event, hooks.',
      lessons: [
        {
          title: 'Progress Test 1|||Bài kiểm tra tiến độ 1',
          slug: 'fer202-pt1',
          type: 'QUIZ',
          description: 'Tổng hợp chương 1–8 (CLO1–CLO6).',
          quiz: {
            timeLimitSeconds: 900,
            questions: [
              { question: 'React updates the DOM efficiently using?|||React cập nhật DOM hiệu quả nhờ?', options: ['jQuery', 'The virtual DOM &amp; reconciliation|||Virtual DOM &amp; reconciliation', 'Direct innerHTML|||innerHTML trực tiếp', 'SQL'], correctIndex: 1, points: 1 },
              { question: 'const [a, b] = useState(0) — what is b?|||const [a, b] = useState(0) — b là gì?', options: ['The value|||Giá trị', 'The setter function|||Hàm setter', 'A boolean', 'The index|||Chỉ số'], correctIndex: 1, points: 1 },
              { question: 'Which is a valid JSX attribute?|||Thuộc tính JSX nào hợp lệ?', options: ['class', 'onclick', 'className', 'for'], correctIndex: 2, points: 1 },
              { question: 'To render an array as list items you use?|||Để render mảng thành item danh sách bạn dùng?', options: ['for', 'map with a key|||map có key', 'while', 'reduce'], correctIndex: 1, points: 1 },
              { question: 'Props are?|||Props là?', options: ['Mutable|||Sửa được', 'Read-only|||Chỉ đọc', 'Global', 'CSS'], correctIndex: 1, points: 1 },
              { question: 'To stop a form reloading the page you call?|||Để form không reload trang bạn gọi?', options: ['e.stopPropagation()', 'e.preventDefault()', 'return false', 'e.reload()'], correctIndex: 1, points: 1 },
              { question: 'Which hook shares data without prop drilling?|||Hook nào chia sẻ dữ liệu không cần prop drilling?', options: ['useState', 'useContext', 'useRef', 'useMemo'], correctIndex: 1, points: 1 },
              { question: 'useEffect cleanup prevents?|||Dọn dẹp useEffect ngăn?', options: ['Slow renders|||Render chậm', 'Memory leaks from timers/listeners|||Rò rỉ bộ nhớ từ timer/listener', 'Type errors|||Lỗi kiểu', 'CSS bugs|||Lỗi CSS'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — ROUTING ══════════════════ */
    {
      title: 'Chapter 9 — Routing with React Router|||Chương 9 — Routing với React Router',
      description: 'Điều hướng SPA: khai báo route, tham số, và link.',
      lessons: [
        {
          title: '9.1 — Routes, params & links|||9.1 — Route, tham số & link',
          slug: 'fer202-9-1-router',
          type: 'VIDEO',
          description: 'Nhiều trang trong một SPA bằng React Router.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Client-side routing with React Router</h2>
<p class="lead">A SPA has "pages" but never reloads. <strong>React Router</strong> maps the URL to which component to show, and swaps content instantly when you navigate — no server round-trip, no white flash.</p>
<h3>Declaring routes</h3>
<pre><span class="tok-keyword">import</span> { BrowserRouter, Routes, Route, Link } <span class="tok-keyword">from</span> <span class="tok-string">"react-router-dom"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">return</span> (
    &lt;BrowserRouter&gt;
      &lt;nav&gt;
        &lt;Link to=<span class="tok-string">"/"</span>&gt;Home&lt;/Link&gt;
        &lt;Link to=<span class="tok-string">"/about"</span>&gt;About&lt;/Link&gt;
      &lt;/nav&gt;
      &lt;Routes&gt;
        &lt;Route path=<span class="tok-string">"/"</span> element={&lt;Home /&gt;} /&gt;
        &lt;Route path=<span class="tok-string">"/about"</span> element={&lt;About /&gt;} /&gt;
        &lt;Route path=<span class="tok-string">"/users/:id"</span> element={&lt;User /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/BrowserRouter&gt;
  );
}</pre>
<div class="out"><b>Result:</b> clicking a Link changes the URL and shows the matching component — instantly.</div>
<h3>Route parameters</h3>
<p>The <code>:id</code> in <code>/users/:id</code> is a dynamic segment. Read it with the <code>useParams</code> hook:</p>
<pre><span class="tok-keyword">import</span> { useParams } <span class="tok-keyword">from</span> <span class="tok-string">"react-router-dom"</span>;
<span class="tok-keyword">function</span> <span class="tok-function">User</span>() {
  <span class="tok-keyword">const</span> { id } = <span class="tok-function">useParams</span>();
  <span class="tok-keyword">return</span> &lt;h2&gt;User #{id}&lt;/h2&gt;;
}</pre>
<div class="out"><b>/users/42</b> → renders "User #42"</div>
<div class="pitfall">Always use <code>&lt;Link to="/about"&gt;</code>, never a plain <code>&lt;a href="/about"&gt;</code> for internal navigation. A raw <code>&lt;a&gt;</code> triggers a <strong>full page reload</strong>, throwing away all your React state and defeating the SPA. Use <code>&lt;a&gt;</code> only for external URLs.</div>
<h3>Ví dụ có lời giải · Worked example (programmatic navigation)</h3>
<pre><span class="tok-keyword">import</span> { useNavigate } <span class="tok-keyword">from</span> <span class="tok-string">"react-router-dom"</span>;
<span class="tok-keyword">function</span> <span class="tok-function">LoginButton</span>() {
  <span class="tok-keyword">const</span> navigate = <span class="tok-function">useNavigate</span>();
  <span class="tok-comment">// after login, go to dashboard in code</span>
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; navigate(<span class="tok-string">"/dashboard"</span>)}&gt;Login&lt;/button&gt;;
}</pre>
<p>Sometimes you navigate from code, not a click — after a form submit or login. <code>useNavigate</code> returns a function you call with the target path.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How does the URL change without a reload? The History API.</b> React Router uses the browser's <code>history.pushState()</code> to change the address bar without a request, and listens to the <code>popstate</code> event for the Back/Forward buttons. <code>BrowserRouter</code> gives clean URLs (<code>/about</code>) but needs the <em>server</em> to return <code>index.html</code> for every path (else refreshing <code>/about</code> 404s) — a real deployment gotcha. <code>HashRouter</code> (<code>/#/about</code>) avoids that by keeping routing entirely client-side.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build a multi-page SPA</span><span class="lc-sub">Routes, links &amp; params on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Routing phía client với React Router</h2>
<p class="lead">SPA có "các trang" nhưng không bao giờ reload. <strong>React Router</strong> ánh xạ URL tới component cần hiển thị, và thay nội dung ngay khi bạn điều hướng — không round-trip server, không chớp trắng.</p>
<h3>Khai báo route</h3>
<pre><span class="tok-keyword">import</span> { BrowserRouter, Routes, Route, Link } <span class="tok-keyword">from</span> <span class="tok-string">"react-router-dom"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">return</span> (
    &lt;BrowserRouter&gt;
      &lt;nav&gt;
        &lt;Link to=<span class="tok-string">"/"</span>&gt;Home&lt;/Link&gt;
        &lt;Link to=<span class="tok-string">"/about"</span>&gt;About&lt;/Link&gt;
      &lt;/nav&gt;
      &lt;Routes&gt;
        &lt;Route path=<span class="tok-string">"/"</span> element={&lt;Home /&gt;} /&gt;
        &lt;Route path=<span class="tok-string">"/about"</span> element={&lt;About /&gt;} /&gt;
        &lt;Route path=<span class="tok-string">"/users/:id"</span> element={&lt;User /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/BrowserRouter&gt;
  );
}</pre>
<div class="out"><b>Kết quả:</b> bấm một Link đổi URL và hiện component khớp — tức thì.</div>
<h3>Tham số route</h3>
<p><code>:id</code> trong <code>/users/:id</code> là đoạn động. Đọc nó bằng hook <code>useParams</code>:</p>
<pre><span class="tok-keyword">import</span> { useParams } <span class="tok-keyword">from</span> <span class="tok-string">"react-router-dom"</span>;
<span class="tok-keyword">function</span> <span class="tok-function">User</span>() {
  <span class="tok-keyword">const</span> { id } = <span class="tok-function">useParams</span>();
  <span class="tok-keyword">return</span> &lt;h2&gt;User #{id}&lt;/h2&gt;;
}</pre>
<div class="out"><b>/users/42</b> → render "User #42"</div>
<div class="pitfall">Luôn dùng <code>&lt;Link to="/about"&gt;</code>, không bao giờ dùng <code>&lt;a href="/about"&gt;</code> thuần cho điều hướng nội bộ. Thẻ <code>&lt;a&gt;</code> thô gây <strong>reload toàn trang</strong>, vứt hết state React và phá SPA. Chỉ dùng <code>&lt;a&gt;</code> cho URL ngoài.</div>
<h3>Ví dụ có lời giải · Điều hướng bằng code</h3>
<pre><span class="tok-keyword">import</span> { useNavigate } <span class="tok-keyword">from</span> <span class="tok-string">"react-router-dom"</span>;
<span class="tok-keyword">function</span> <span class="tok-function">LoginButton</span>() {
  <span class="tok-keyword">const</span> navigate = <span class="tok-function">useNavigate</span>();
  <span class="tok-comment">// sau khi đăng nhập, đi tới dashboard trong code</span>
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; navigate(<span class="tok-string">"/dashboard"</span>)}&gt;Login&lt;/button&gt;;
}</pre>
<p>Đôi khi bạn điều hướng từ code, không phải cú bấm — sau khi submit form hay đăng nhập. <code>useNavigate</code> trả về một hàm bạn gọi với đường dẫn đích.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>URL đổi mà không reload nhờ đâu? History API.</b> React Router dùng <code>history.pushState()</code> của trình duyệt để đổi thanh địa chỉ mà không gửi request, và lắng nghe sự kiện <code>popstate</code> cho nút Back/Forward. <code>BrowserRouter</code> cho URL sạch (<code>/about</code>) nhưng cần <em>server</em> trả <code>index.html</code> cho mọi đường dẫn (nếu không, refresh <code>/about</code> sẽ 404) — một cái bẫy deploy thực tế. <code>HashRouter</code> (<code>/#/about</code>) tránh điều đó bằng cách giữ routing hoàn toàn phía client.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Dựng SPA nhiều trang</span><span class="lc-sub">Route, link &amp; param trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 9 Quiz|||Quiz chương 9',
          slug: 'fer202-9-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh routing.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'What does React Router do?|||React Router làm gì?', options: ['Fetches data|||Fetch dữ liệu', 'Maps URLs to components without reloading|||Ánh xạ URL tới component không reload', 'Styles the app|||Style app', 'Manages global state|||Quản lý state toàn cục'], correctIndex: 1, points: 1 },
              { question: 'For internal navigation you use?|||Điều hướng nội bộ bạn dùng?', options: ['<a href>', '<Link to>', 'window.location', 'fetch'], correctIndex: 1, points: 1 },
              { question: 'How do you read the :id in /users/:id?|||Đọc :id trong /users/:id bằng gì?', options: ['useState', 'useParams', 'useEffect', 'props.id'], correctIndex: 1, points: 1 },
              { question: 'To navigate from code (after login) you use?|||Điều hướng từ code (sau đăng nhập) dùng?', options: ['useNavigate', 'useContext', 'useRef', 'redirect()'], correctIndex: 0, points: 1 },
              { question: 'Why does a plain <a> break the SPA?|||Vì sao <a> thuần phá SPA?', options: ['It is invalid|||Không hợp lệ', 'It triggers a full page reload, losing state|||Gây reload toàn trang, mất state', 'It is slow|||Chậm', 'It needs Redux|||Cần Redux'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 10 — CODE SPLITTING ══════════════════ */
    {
      title: 'Chapter 10 — Code Splitting: lazy & Suspense|||Chương 10 — Code Splitting: lazy & Suspense',
      description: 'Tải component theo nhu cầu để app khởi động nhanh hơn.',
      lessons: [
        {
          title: '10.1 — lazy() & Suspense|||10.1 — lazy() & Suspense',
          slug: 'fer202-10-1-lazy-suspense',
          type: 'VIDEO',
          description: 'Chia nhỏ bundle, tải trang khi cần, hiện fallback trong lúc chờ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>Code splitting with lazy &amp; Suspense</h2>
<p class="lead">By default a React app bundles all your code into one big JavaScript file — the user downloads everything before seeing anything. <strong>Code splitting</strong> breaks the bundle into chunks loaded <em>on demand</em>, so the first page appears faster.</p>
<h3>React.lazy — load a component when needed</h3>
<pre><span class="tok-keyword">import</span> { lazy, Suspense } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-comment">// This component's code loads only when it first renders</span>
<span class="tok-keyword">const</span> Dashboard = <span class="tok-function">lazy</span>(() =&gt; <span class="tok-function">import</span>(<span class="tok-string">"./Dashboard.jsx"</span>));

<span class="tok-keyword">function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">return</span> (
    &lt;Suspense fallback={&lt;p&gt;Loading…&lt;/p&gt;}&gt;
      &lt;Dashboard /&gt;
    &lt;/Suspense&gt;
  );
}</pre>
<div class="out"><b>Result:</b> Dashboard's JS downloads only when shown; until then the fallback "Loading…" appears.</div>
<p><code>lazy()</code> takes a function that does a dynamic <code>import()</code>. <code>Suspense</code> wraps lazy components and shows a <code>fallback</code> while their code is being fetched.</p>
<h3>Where it matters most: routes</h3>
<pre><span class="tok-keyword">const</span> About = <span class="tok-function">lazy</span>(() =&gt; <span class="tok-function">import</span>(<span class="tok-string">"./About.jsx"</span>));
&lt;Routes&gt;
  &lt;Route path=<span class="tok-string">"/about"</span> element={
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;&lt;About /&gt;&lt;/Suspense&gt;
  } /&gt;
&lt;/Routes&gt;</pre>
<p>Lazy-loading per route means users only download the code for pages they actually visit — the biggest real-world win.</p>
<div class="pitfall">Don't lazy-load <strong>everything</strong>. Splitting a tiny component adds a network round-trip and a loading flash that costs more than it saves. Lazy-load big, rarely-visited chunks: heavy pages, charts, editors, admin sections. A lazy component <strong>must</strong> be a <code>default</code> export.</div>
<h3>Ví dụ có lời giải · Worked example (simulating latency)</h3>
<p>To see Suspense's fallback during development, you can delay the import. In real apps the delay is the network. The mental model: React "suspends" rendering the lazy subtree, shows the nearest <code>Suspense</code> fallback, then swaps in the real component once its code arrives — all automatic.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Dynamic import() &amp; tree-shaking.</b> <code>import("./X")</code> (with parentheses) is a runtime, promise-returning import — the bundler (Vite/webpack) sees it and emits a separate chunk automatically. Pair this with <b>tree-shaking</b>: bundlers statically analyse your <em>static</em> <code>import { a } from "lib"</code> statements and drop any exported code you never use, shrinking the bundle. That's why named imports from a library are better than importing the whole thing — and why side-effectful modules can accidentally defeat tree-shaking.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice lazy loading</span><span class="lc-sub">Split a route with lazy &amp; Suspense on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Code splitting với lazy &amp; Suspense</h2>
<p class="lead">Mặc định app React gói toàn bộ code vào một file JavaScript lớn — người dùng tải hết trước khi thấy bất cứ gì. <strong>Code splitting</strong> chia bundle thành các chunk tải <em>theo nhu cầu</em>, để trang đầu hiện nhanh hơn.</p>
<h3>React.lazy — tải component khi cần</h3>
<pre><span class="tok-keyword">import</span> { lazy, Suspense } <span class="tok-keyword">from</span> <span class="tok-string">"react"</span>;

<span class="tok-comment">// Code của component này chỉ tải khi nó render lần đầu</span>
<span class="tok-keyword">const</span> Dashboard = <span class="tok-function">lazy</span>(() =&gt; <span class="tok-function">import</span>(<span class="tok-string">"./Dashboard.jsx"</span>));

<span class="tok-keyword">function</span> <span class="tok-function">App</span>() {
  <span class="tok-keyword">return</span> (
    &lt;Suspense fallback={&lt;p&gt;Loading…&lt;/p&gt;}&gt;
      &lt;Dashboard /&gt;
    &lt;/Suspense&gt;
  );
}</pre>
<div class="out"><b>Kết quả:</b> JS của Dashboard chỉ tải khi được hiển thị; tới lúc đó fallback "Loading…" xuất hiện.</div>
<p><code>lazy()</code> nhận một hàm làm <code>import()</code> động. <code>Suspense</code> bọc component lazy và hiện <code>fallback</code> trong lúc code đang được tải.</p>
<h3>Nơi quan trọng nhất: route</h3>
<pre><span class="tok-keyword">const</span> About = <span class="tok-function">lazy</span>(() =&gt; <span class="tok-function">import</span>(<span class="tok-string">"./About.jsx"</span>));
&lt;Routes&gt;
  &lt;Route path=<span class="tok-string">"/about"</span> element={
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;&lt;About /&gt;&lt;/Suspense&gt;
  } /&gt;
&lt;/Routes&gt;</pre>
<p>Lazy-load theo route nghĩa là người dùng chỉ tải code cho trang họ thật sự vào — lợi ích lớn nhất trong thực tế.</p>
<div class="pitfall">Đừng lazy-load <strong>mọi thứ</strong>. Chia một component nhỏ xíu thêm một round-trip mạng và một cú chớp loading tốn hơn phần tiết kiệm. Hãy lazy-load các chunk lớn, ít vào: trang nặng, biểu đồ, editor, khu admin. Component lazy <strong>phải</strong> là export <code>default</code>.</div>
<h3>Ví dụ có lời giải · Mô phỏng độ trễ</h3>
<p>Để thấy fallback của Suspense khi phát triển, bạn có thể trì hoãn import. Trong app thật độ trễ chính là mạng. Mô hình tư duy: React "treo" việc render cây con lazy, hiện fallback <code>Suspense</code> gần nhất, rồi thay component thật vào khi code tới — tất cả tự động.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dynamic import() &amp; tree-shaking.</b> <code>import("./X")</code> (có ngoặc) là import động, trả về promise — bộ đóng gói (Vite/webpack) thấy nó và tự sinh một chunk riêng. Ghép với <b>tree-shaking</b>: bộ đóng gói phân tích tĩnh các câu <code>import { a } from "lib"</code> <em>tĩnh</em> và loại bỏ code được export mà bạn không dùng, làm nhỏ bundle. Vì thế named import từ thư viện tốt hơn import cả cục — và các module có side-effect có thể vô tình phá tree-shaking.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện lazy loading</span><span class="lc-sub">Chia một route với lazy &amp; Suspense trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 10 Quiz|||Quiz chương 10',
          slug: 'fer202-10-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh code splitting.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'What is code splitting?|||Code splitting là gì?', options: ['Formatting code|||Định dạng code', 'Breaking the bundle into chunks loaded on demand|||Chia bundle thành chunk tải theo nhu cầu', 'Deleting code|||Xoá code', 'Minifying|||Nén code'], correctIndex: 1, points: 1 },
              { question: 'React.lazy takes what?|||React.lazy nhận gì?', options: ['A component|||Một component', 'A function that returns a dynamic import()|||Một hàm trả về import() động', 'A URL', 'A reducer'], correctIndex: 1, points: 1 },
              { question: 'What does Suspense fallback show?|||fallback của Suspense hiện gì?', options: ['An error|||Lỗi', 'Placeholder UI while lazy code loads|||UI tạm trong lúc code lazy tải', 'The final component|||Component cuối', 'Nothing|||Không gì'], correctIndex: 1, points: 1 },
              { question: 'A lazy-loaded component must be a?|||Component lazy phải là?', options: ['Named export|||Named export', 'Default export|||Default export', 'Class', 'Hook'], correctIndex: 1, points: 1 },
              { question: 'Best candidates for lazy loading are?|||Ứng viên tốt nhất để lazy-load là?', options: ['Every tiny component|||Mọi component nhỏ', 'Large, rarely-visited pages|||Trang lớn, ít vào', 'The navbar|||Navbar', 'CSS files|||File CSS'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 11 — GIAO TIẾP CLIENT-SERVER ══════════════════ */
    {
      title: 'Chapter 11 — Client-Server Communication|||Chương 11 — Giao tiếp Client-Server',
      description: 'fetch, promise, async/await, axios và json-server.',
      lessons: [
        {
          title: '11.1 — fetch, promises & async/await|||11.1 — fetch, promise & async/await',
          slug: 'fer202-11-1-fetch-async',
          type: 'VIDEO',
          description: 'Gọi REST API, xử lý bất đồng bộ, và cú pháp async/await.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Fetching data: fetch, promises &amp; async/await</h2>
<p class="lead">React apps get their data from a server over HTTP. The browser's built-in <code>fetch</code> makes the request; because the network takes time, it returns a <strong>Promise</strong> — a placeholder for a value that arrives later.</p>
<h3>What is a promise?</h3>
<p>A Promise is an object representing an operation that hasn't finished. It ends in one of two states: <strong>fulfilled</strong> (got a value) or <strong>rejected</strong> (an error). You react to it with <code>.then()</code> and <code>.catch()</code>.</p>
<pre><span class="tok-function">fetch</span>(<span class="tok-string">"https://api.example.com/users"</span>)
  .<span class="tok-function">then</span>(res =&gt; res.<span class="tok-function">json</span>())      <span class="tok-comment">// parse JSON (also a promise)</span>
  .<span class="tok-function">then</span>(data =&gt; <span class="tok-function">console</span>.log(data))
  .<span class="tok-function">catch</span>(err =&gt; <span class="tok-function">console</span>.<span class="tok-function">error</span>(err));</pre>
<div class="out"><b>Result:</b> logs the users array once the request completes, or logs an error.</div>
<h3>async/await — cleaner syntax</h3>
<p><code>async/await</code> is syntax sugar over promises that reads like synchronous code:</p>
<pre><span class="tok-keyword">async function</span> <span class="tok-function">loadUsers</span>() {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(<span class="tok-string">"/api/users"</span>);
    <span class="tok-keyword">if</span> (!res.ok) <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">"HTTP "</span> + res.status);
    <span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();
    <span class="tok-keyword">return</span> data;
  } <span class="tok-keyword">catch</span> (err) {
    <span class="tok-function">console</span>.<span class="tok-function">error</span>(err);
  }
}</pre>
<p><code>await</code> pauses the async function until the promise settles, then gives you the value. Wrap it in <code>try/catch</code> for errors.</p>
<div class="pitfall">A big gotcha: <code>fetch</code> does <strong>not</strong> reject on HTTP errors like 404 or 500 — the promise fulfills. You must check <code>res.ok</code> (or <code>res.status</code>) yourself. <code>fetch</code> only rejects on a <em>network</em> failure. Forgetting this ships bugs where a 500 is treated as success.</div>
<h3>Ví dụ có lời giải · Worked example (fetch in a component)</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">UserList</span>() {
  <span class="tok-keyword">const</span> [users, setUsers] = <span class="tok-function">useState</span>([]);
  <span class="tok-keyword">const</span> [error, setError] = <span class="tok-function">useState</span>(<span class="tok-keyword">null</span>);
  <span class="tok-function">useEffect</span>(() =&gt; {
    <span class="tok-keyword">let</span> active = <span class="tok-keyword">true</span>;
    <span class="tok-function">loadUsers</span>()
      .<span class="tok-function">then</span>(d =&gt; { <span class="tok-keyword">if</span> (active) <span class="tok-function">setUsers</span>(d || []); })
      .<span class="tok-function">catch</span>(e =&gt; setError(e.message));
    <span class="tok-keyword">return</span> () =&gt; { active = <span class="tok-keyword">false</span>; }; <span class="tok-comment">// avoid state update after unmount</span>
  }, []);
  <span class="tok-keyword">if</span> (error) <span class="tok-keyword">return</span> &lt;p&gt;{error}&lt;/p&gt;;
  <span class="tok-keyword">return</span> &lt;ul&gt;{users.<span class="tok-function">map</span>(u =&gt; &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;;
}</pre>
<p>The <code>active</code> flag prevents calling <code>setUsers</code> after the component unmounts (a common React warning). This loading + error + cleanup shape is the production standard.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Race conditions when props change.</b> If a component fetches based on a prop (e.g. a user id) and the id changes quickly, an <em>earlier</em>, slower request can resolve <em>after</em> a later one — overwriting fresh data with stale data. The fix is the cleanup flag above (or an <code>AbortController</code> to cancel the old request). In real teams this is why data libraries like React Query / SWR exist: they handle caching, deduping and race conditions so you don't hand-roll every fetch.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice promises &amp; async/await</span><span class="lc-sub">Async JavaScript drills on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Lấy dữ liệu: fetch, promise &amp; async/await</h2>
<p class="lead">App React lấy dữ liệu từ server qua HTTP. Hàm <code>fetch</code> sẵn có của trình duyệt gửi request; vì mạng mất thời gian, nó trả về một <strong>Promise</strong> — chỗ giữ chỗ cho giá trị đến sau.</p>
<h3>Promise là gì?</h3>
<p>Promise là object đại diện cho một thao tác chưa xong. Nó kết thúc ở một trong hai trạng thái: <strong>fulfilled</strong> (có giá trị) hoặc <strong>rejected</strong> (lỗi). Bạn phản hồi bằng <code>.then()</code> và <code>.catch()</code>.</p>
<pre><span class="tok-function">fetch</span>(<span class="tok-string">"https://api.example.com/users"</span>)
  .<span class="tok-function">then</span>(res =&gt; res.<span class="tok-function">json</span>())      <span class="tok-comment">// parse JSON (cũng là promise)</span>
  .<span class="tok-function">then</span>(data =&gt; <span class="tok-function">console</span>.log(data))
  .<span class="tok-function">catch</span>(err =&gt; <span class="tok-function">console</span>.<span class="tok-function">error</span>(err));</pre>
<div class="out"><b>Kết quả:</b> log mảng users khi request xong, hoặc log lỗi.</div>
<h3>async/await — cú pháp gọn hơn</h3>
<p><code>async/await</code> là "đường ngọt" trên promise, đọc như code đồng bộ:</p>
<pre><span class="tok-keyword">async function</span> <span class="tok-function">loadUsers</span>() {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> <span class="tok-function">fetch</span>(<span class="tok-string">"/api/users"</span>);
    <span class="tok-keyword">if</span> (!res.ok) <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">"HTTP "</span> + res.status);
    <span class="tok-keyword">const</span> data = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();
    <span class="tok-keyword">return</span> data;
  } <span class="tok-keyword">catch</span> (err) {
    <span class="tok-function">console</span>.<span class="tok-function">error</span>(err);
  }
}</pre>
<p><code>await</code> tạm dừng hàm async tới khi promise xong, rồi trả giá trị cho bạn. Bọc trong <code>try/catch</code> để bắt lỗi.</p>
<div class="pitfall">Một cái bẫy lớn: <code>fetch</code> <strong>không</strong> reject với lỗi HTTP như 404 hay 500 — promise vẫn fulfill. Bạn phải tự kiểm <code>res.ok</code> (hoặc <code>res.status</code>). <code>fetch</code> chỉ reject khi lỗi <em>mạng</em>. Quên điều này sẽ ship lỗi coi 500 là thành công.</div>
<h3>Ví dụ có lời giải · Fetch trong component</h3>
<pre><span class="tok-keyword">function</span> <span class="tok-function">UserList</span>() {
  <span class="tok-keyword">const</span> [users, setUsers] = <span class="tok-function">useState</span>([]);
  <span class="tok-keyword">const</span> [error, setError] = <span class="tok-function">useState</span>(<span class="tok-keyword">null</span>);
  <span class="tok-function">useEffect</span>(() =&gt; {
    <span class="tok-keyword">let</span> active = <span class="tok-keyword">true</span>;
    <span class="tok-function">loadUsers</span>()
      .<span class="tok-function">then</span>(d =&gt; { <span class="tok-keyword">if</span> (active) <span class="tok-function">setUsers</span>(d || []); })
      .<span class="tok-function">catch</span>(e =&gt; setError(e.message));
    <span class="tok-keyword">return</span> () =&gt; { active = <span class="tok-keyword">false</span>; }; <span class="tok-comment">// tránh set state sau khi unmount</span>
  }, []);
  <span class="tok-keyword">if</span> (error) <span class="tok-keyword">return</span> &lt;p&gt;{error}&lt;/p&gt;;
  <span class="tok-keyword">return</span> &lt;ul&gt;{users.<span class="tok-function">map</span>(u =&gt; &lt;li key={u.id}&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;;
}</pre>
<p>Cờ <code>active</code> ngăn gọi <code>setUsers</code> sau khi component unmount (một cảnh báo React thường gặp). Hình dạng loading + error + cleanup này là chuẩn production.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Race condition khi props đổi.</b> Nếu component fetch dựa trên một prop (vd user id) và id đổi nhanh, một request <em>trước</em> nhưng chậm có thể xong <em>sau</em> request mới — ghi đè dữ liệu mới bằng dữ liệu cũ. Cách sửa là cờ cleanup ở trên (hoặc <code>AbortController</code> để huỷ request cũ). Trong đội thực tế đây là lý do các thư viện dữ liệu như React Query / SWR tồn tại: chúng lo caching, dedupe và race condition để bạn không phải tự viết từng fetch.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện promise &amp; async/await</span><span class="lc-sub">Bài tập JavaScript bất đồng bộ trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '11.2 — Axios & json-server|||11.2 — Axios & json-server',
          slug: 'fer202-11-2-axios-json-server',
          type: 'VIDEO',
          description: 'Đơn giản hoá request bằng axios, và dựng API giả bằng json-server.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Axios &amp; a mock server (json-server)</h2>
<p class="lead"><strong>Axios</strong> is a popular HTTP library that simplifies requests: automatic JSON parsing, better error handling, and interceptors. <strong>json-server</strong> spins up a fake REST API from a JSON file so you can build the front-end before the real back-end exists.</p>
<h3>Axios vs fetch</h3>
<pre><span class="tok-keyword">import</span> axios <span class="tok-keyword">from</span> <span class="tok-string">"axios"</span>;

<span class="tok-comment">// GET — data is already parsed as res.data</span>
<span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> axios.<span class="tok-function">get</span>(<span class="tok-string">"/api/users"</span>);
<span class="tok-function">console</span>.log(res.data);

<span class="tok-comment">// POST — send a body</span>
<span class="tok-keyword">await</span> axios.<span class="tok-function">post</span>(<span class="tok-string">"/api/users"</span>, { name: <span class="tok-string">"An"</span> });</pre>
<div class="out"><b>Result:</b> axios returns parsed JSON in <code>res.data</code> and rejects automatically on 4xx/5xx.</div>
<table>
  <thead><tr><th></th><th>fetch</th><th>axios</th></tr></thead>
  <tbody>
    <tr><td>JSON parsing</td><td>manual res.json()</td><td>automatic res.data</td></tr>
    <tr><td>HTTP errors</td><td>must check res.ok|||phải kiểm res.ok</td><td>rejects automatically|||tự reject</td></tr>
    <tr><td>Built-in?</td><td>yes|||có</td><td>needs npm install|||cần npm install</td></tr>
  </tbody>
</table>
<h3>json-server — a fake API in seconds</h3>
<pre><span class="tok-comment"># db.json holds your data</span>
{ <span class="tok-string">"users"</span>: [{ <span class="tok-string">"id"</span>: 1, <span class="tok-string">"name"</span>: <span class="tok-string">"An"</span> }] }

<span class="tok-comment"># start a REST API on port 3001</span>
npx json-server --watch db.json --port 3001</pre>
<div class="out"><b>Result:</b> GET/POST/PUT/DELETE on http://localhost:3001/users work instantly — no back-end code.</div>
<div class="pitfall">CORS: when your React dev server (5173) calls a different origin (3001), the browser may block it unless the server sends CORS headers. json-server allows CORS by default; a real back-end must be configured. In dev you can also use Vite's proxy to route <code>/api</code> to the server and avoid CORS entirely.</div>
<h3>Ví dụ có lời giải · Worked example (axios interceptor)</h3>
<pre><span class="tok-comment">// Attach an auth token to every request, once</span>
axios.interceptors.request.<span class="tok-function">use</span>(config =&gt; {
  config.headers.Authorization = <span class="tok-string">&#96;Bearer \${token}&#96;</span>;
  <span class="tok-keyword">return</span> config;
});</pre>
<p>An <strong>interceptor</strong> runs before every request (or after every response) — perfect for adding auth headers or handling 401s globally, instead of repeating it in every call.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>REST verbs &amp; idempotency.</b> A REST API maps HTTP methods to actions: <b>GET</b> (read), <b>POST</b> (create), <b>PUT/PATCH</b> (update), <b>DELETE</b> (remove). GET, PUT and DELETE are <em>idempotent</em> — doing them twice has the same effect as once; POST is not (two POSTs create two records). This matters for retries: it's safe to auto-retry a failed GET, dangerous to auto-retry a POST (you might double-charge a payment). Knowing this shapes how you build resilient front-ends.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Axios &amp; json-server setup</span><span class="lc-sub">Recipes and snippets — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Axios &amp; server giả (json-server)</h2>
<p class="lead"><strong>Axios</strong> là thư viện HTTP phổ biến giúp đơn giản hoá request: tự parse JSON, xử lý lỗi tốt hơn, và có interceptor. <strong>json-server</strong> dựng một REST API giả từ file JSON để bạn làm front-end trước khi back-end thật tồn tại.</p>
<h3>Axios vs fetch</h3>
<pre><span class="tok-keyword">import</span> axios <span class="tok-keyword">from</span> <span class="tok-string">"axios"</span>;

<span class="tok-comment">// GET — dữ liệu đã parse sẵn ở res.data</span>
<span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> axios.<span class="tok-function">get</span>(<span class="tok-string">"/api/users"</span>);
<span class="tok-function">console</span>.log(res.data);

<span class="tok-comment">// POST — gửi body</span>
<span class="tok-keyword">await</span> axios.<span class="tok-function">post</span>(<span class="tok-string">"/api/users"</span>, { name: <span class="tok-string">"An"</span> });</pre>
<div class="out"><b>Kết quả:</b> axios trả JSON đã parse ở <code>res.data</code> và tự reject khi 4xx/5xx.</div>
<table>
  <thead><tr><th></th><th>fetch</th><th>axios</th></tr></thead>
  <tbody>
    <tr><td>Parse JSON</td><td>thủ công res.json()</td><td>tự động res.data</td></tr>
    <tr><td>Lỗi HTTP</td><td>phải kiểm res.ok</td><td>tự reject</td></tr>
    <tr><td>Có sẵn?</td><td>có</td><td>cần npm install</td></tr>
  </tbody>
</table>
<h3>json-server — API giả trong vài giây</h3>
<pre><span class="tok-comment"># db.json chứa dữ liệu của bạn</span>
{ <span class="tok-string">"users"</span>: [{ <span class="tok-string">"id"</span>: 1, <span class="tok-string">"name"</span>: <span class="tok-string">"An"</span> }] }

<span class="tok-comment"># chạy REST API ở cổng 3001</span>
npx json-server --watch db.json --port 3001</pre>
<div class="out"><b>Kết quả:</b> GET/POST/PUT/DELETE trên http://localhost:3001/users chạy ngay — không cần code back-end.</div>
<div class="pitfall">CORS: khi dev server React (5173) gọi một origin khác (3001), trình duyệt có thể chặn trừ khi server gửi header CORS. json-server cho phép CORS mặc định; back-end thật phải được cấu hình. Khi dev bạn cũng có thể dùng proxy của Vite để route <code>/api</code> tới server và tránh CORS hoàn toàn.</div>
<h3>Ví dụ có lời giải · Interceptor của axios</h3>
<pre><span class="tok-comment">// Gắn token auth vào mọi request, một lần</span>
axios.interceptors.request.<span class="tok-function">use</span>(config =&gt; {
  config.headers.Authorization = <span class="tok-string">&#96;Bearer \${token}&#96;</span>;
  <span class="tok-keyword">return</span> config;
});</pre>
<p>Một <strong>interceptor</strong> chạy trước mọi request (hoặc sau mọi response) — hoàn hảo để thêm header auth hoặc xử lý 401 toàn cục, thay vì lặp lại trong từng lời gọi.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các động từ REST &amp; tính idempotent.</b> REST API ánh xạ phương thức HTTP tới hành động: <b>GET</b> (đọc), <b>POST</b> (tạo), <b>PUT/PATCH</b> (cập nhật), <b>DELETE</b> (xoá). GET, PUT và DELETE là <em>idempotent</em> — làm hai lần có tác dụng như một lần; POST thì không (hai POST tạo hai bản ghi). Điều này quan trọng khi retry: an toàn để tự retry một GET lỗi, nguy hiểm khi tự retry một POST (có thể trừ tiền hai lần). Biết điều này định hình cách bạn xây front-end bền bỉ.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt Axios &amp; json-server</span><span class="lc-sub">Công thức và snippet — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 11 Quiz|||Quiz chương 11',
          slug: 'fer202-11-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh client-server.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'fetch returns a?|||fetch trả về gì?', options: ['A value|||Một giá trị', 'A Promise', 'A component|||Component', 'An array|||Mảng'], correctIndex: 1, points: 1 },
              { question: 'Does fetch reject on a 404?|||fetch có reject khi 404 không?', options: ['Yes|||Có', 'No, you must check res.ok|||Không, phải kiểm res.ok', 'Only with await|||Chỉ với await', 'Only in React|||Chỉ trong React'], correctIndex: 1, points: 1 },
              { question: 'await must be used inside?|||await phải dùng bên trong?', options: ['Any function|||Hàm bất kỳ', 'An async function|||Một hàm async', 'A component|||Component', 'A loop|||Vòng lặp'], correctIndex: 1, points: 1 },
              { question: 'With axios, the parsed response body is at?|||Với axios, body response đã parse ở đâu?', options: ['res.json()', 'res.data', 'res.body', 'res.text'], correctIndex: 1, points: 1 },
              { question: 'What is json-server used for?|||json-server dùng để làm gì?', options: ['Deploying React|||Deploy React', 'A quick mock REST API|||REST API giả nhanh', 'Bundling code|||Đóng gói code', 'Testing|||Test'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 12 — REDUX ══════════════════ */
    {
      title: 'Chapter 12 — Flux Architecture & Redux|||Chương 12 — Kiến trúc Flux & Redux',
      description: 'State toàn cục đoán được: Flux, Redux Toolkit, và thunk middleware.',
      lessons: [
        {
          title: '12.1 — Flux & Redux Toolkit|||12.1 — Flux & Redux Toolkit',
          slug: 'fer202-12-1-redux-toolkit',
          type: 'VIDEO',
          description: 'Vì sao cần Redux, luồng dữ liệu một chiều, và Redux Toolkit.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Flux architecture &amp; Redux Toolkit</h2>
<p class="lead">As an app grows, global state (cart, auth, notifications) shared across many components becomes hard to trace. <strong>Redux</strong> implements the <strong>Flux</strong> pattern: one central <strong>store</strong>, updated only through <strong>actions</strong> processed by pure <strong>reducers</strong> — a strict one-way data flow.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">dispatch(action)</div><div class="lz-d">"something happened"</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">reducer</div><div class="lz-d">(state, action) → new state</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">store updates</div><div class="lz-d">single source of truth</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">components re-render</div><div class="lz-d">read via useSelector</div></div>
</div>
<h3>Redux Toolkit — the modern way</h3>
<p>Classic Redux was verbose. <strong>Redux Toolkit (RTK)</strong> is the official, batteries-included approach — far less boilerplate. A <code>slice</code> bundles state + reducers + actions:</p>
<pre><span class="tok-keyword">import</span> { createSlice, configureStore } <span class="tok-keyword">from</span> <span class="tok-string">"@reduxjs/toolkit"</span>;

<span class="tok-keyword">const</span> counter = <span class="tok-function">createSlice</span>({
  name: <span class="tok-string">"counter"</span>,
  initialState: { value: 0 },
  reducers: {
    <span class="tok-function">inc</span>: (state) =&gt; { state.value += 1; }, <span class="tok-comment">// looks mutable — Immer makes it safe</span>
    <span class="tok-function">addBy</span>: (state, action) =&gt; { state.value += action.payload; },
  },
});
<span class="tok-keyword">export const</span> { inc, addBy } = counter.actions;
<span class="tok-keyword">export const</span> store = <span class="tok-function">configureStore</span>({ reducer: { counter: counter.reducer } });</pre>
<h3>Using the store in components</h3>
<pre><span class="tok-keyword">import</span> { useSelector, useDispatch } <span class="tok-keyword">from</span> <span class="tok-string">"react-redux"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> value = <span class="tok-function">useSelector</span>(s =&gt; s.counter.value);
  <span class="tok-keyword">const</span> dispatch = <span class="tok-function">useDispatch</span>();
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; dispatch(<span class="tok-function">inc</span>())}&gt;{value}&lt;/button&gt;;
}</pre>
<div class="out"><b>Result:</b> any component can read <code>value</code> and dispatch <code>inc()</code> — shared, predictable state.</div>
<p>Wrap the app in <code>&lt;Provider store={store}&gt;</code> once at the root so all components can reach the store.</p>
<div class="pitfall">RTK's <code>createSlice</code> lets you write "mutating" code (<code>state.value += 1</code>) because it uses <strong>Immer</strong> under the hood to produce an immutable update. But this only works <em>inside</em> <code>createSlice</code> reducers. Anywhere else (a plain reducer, component state) you must still update immutably.</div>
<h3>Ví dụ có lời giải · Worked example (payload)</h3>
<p><code>dispatch(addBy(5))</code> sends an action <code>{ type: "counter/addBy", payload: 5 }</code>. In the reducer, <code>action.payload</code> is <code>5</code>. The <strong>payload</strong> carries the data an action needs — the amount to add, the item to remove, the user that logged in.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Redux vs Context — when to use which.</b> Both share state, but they solve different scales. <b>Context</b> is a distribution mechanism — great for low-frequency global values (theme, current user). <b>Redux</b> is a full state <em>management</em> system — it adds a predictable update pipeline, dev-tools time-travel debugging, middleware, and efficient subscriptions so only components reading the changed slice re-render. Rule of thumb: reach for Context (or useReducer) first; adopt Redux when global state is large, updated often, and you need traceability. Don't add Redux "just because".</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build a Redux Toolkit store</span><span class="lc-sub">Slices, selectors &amp; dispatch on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Kiến trúc Flux &amp; Redux Toolkit</h2>
<p class="lead">Khi app lớn lên, state toàn cục (giỏ hàng, auth, thông báo) chia sẻ khắp nhiều component trở nên khó lần theo. <strong>Redux</strong> hiện thực mẫu <strong>Flux</strong>: một <strong>store</strong> trung tâm, chỉ cập nhật qua <strong>action</strong> được xử lý bởi <strong>reducer</strong> thuần khiết — luồng dữ liệu một chiều nghiêm ngặt.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">dispatch(action)</div><div class="lz-d">"có việc xảy ra"</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">reducer</div><div class="lz-d">(state, action) → state mới</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">store cập nhật</div><div class="lz-d">nguồn sự thật duy nhất</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">component render lại</div><div class="lz-d">đọc qua useSelector</div></div>
</div>
<h3>Redux Toolkit — cách hiện đại</h3>
<p>Redux cổ điển dài dòng. <strong>Redux Toolkit (RTK)</strong> là cách chính thức, "kèm sẵn pin" — ít lặp hơn nhiều. Một <code>slice</code> gói state + reducer + action:</p>
<pre><span class="tok-keyword">import</span> { createSlice, configureStore } <span class="tok-keyword">from</span> <span class="tok-string">"@reduxjs/toolkit"</span>;

<span class="tok-keyword">const</span> counter = <span class="tok-function">createSlice</span>({
  name: <span class="tok-string">"counter"</span>,
  initialState: { value: 0 },
  reducers: {
    <span class="tok-function">inc</span>: (state) =&gt; { state.value += 1; }, <span class="tok-comment">// trông như sửa — Immer làm nó an toàn</span>
    <span class="tok-function">addBy</span>: (state, action) =&gt; { state.value += action.payload; },
  },
});
<span class="tok-keyword">export const</span> { inc, addBy } = counter.actions;
<span class="tok-keyword">export const</span> store = <span class="tok-function">configureStore</span>({ reducer: { counter: counter.reducer } });</pre>
<h3>Dùng store trong component</h3>
<pre><span class="tok-keyword">import</span> { useSelector, useDispatch } <span class="tok-keyword">from</span> <span class="tok-string">"react-redux"</span>;

<span class="tok-keyword">function</span> <span class="tok-function">Counter</span>() {
  <span class="tok-keyword">const</span> value = <span class="tok-function">useSelector</span>(s =&gt; s.counter.value);
  <span class="tok-keyword">const</span> dispatch = <span class="tok-function">useDispatch</span>();
  <span class="tok-keyword">return</span> &lt;button onClick={() =&gt; dispatch(<span class="tok-function">inc</span>())}&gt;{value}&lt;/button&gt;;
}</pre>
<div class="out"><b>Kết quả:</b> mọi component có thể đọc <code>value</code> và dispatch <code>inc()</code> — state chia sẻ, đoán được.</div>
<p>Bọc app trong <code>&lt;Provider store={store}&gt;</code> một lần ở gốc để mọi component chạm được store.</p>
<div class="pitfall">RTK <code>createSlice</code> cho bạn viết code "sửa" (<code>state.value += 1</code>) vì nó dùng <strong>Immer</strong> bên dưới để tạo cập nhật bất biến. Nhưng điều này chỉ đúng <em>bên trong</em> reducer của <code>createSlice</code>. Ở mọi nơi khác (reducer thường, state component) bạn vẫn phải cập nhật bất biến.</div>
<h3>Ví dụ có lời giải · payload</h3>
<p><code>dispatch(addBy(5))</code> gửi action <code>{ type: "counter/addBy", payload: 5 }</code>. Trong reducer, <code>action.payload</code> là <code>5</code>. <strong>payload</strong> mang dữ liệu action cần — số cần cộng, item cần xoá, người dùng vừa đăng nhập.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Redux vs Context — khi nào dùng cái nào.</b> Cả hai chia sẻ state, nhưng giải quyết quy mô khác nhau. <b>Context</b> là cơ chế phân phối — tuyệt cho giá trị toàn cục ít đổi (theme, người dùng hiện tại). <b>Redux</b> là hệ <em>quản lý</em> state đầy đủ — thêm pipeline cập nhật đoán được, dev-tools debug tua thời gian, middleware, và subscription hiệu quả để chỉ component đọc slice đã đổi mới render lại. Nguyên tắc: dùng Context (hoặc useReducer) trước; áp Redux khi state toàn cục lớn, đổi thường xuyên, và cần lần theo được. Đừng thêm Redux "chỉ vì".</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Dựng store Redux Toolkit</span><span class="lc-sub">Slice, selector &amp; dispatch trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '12.2 — Combining reducers & thunk middleware|||12.2 — Kết hợp reducer & thunk middleware',
          slug: 'fer202-12-2-thunk-middleware',
          type: 'VIDEO',
          description: 'Chia reducer, và xử lý async trong Redux bằng thunk.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Combining reducers &amp; async with thunks</h2>
<p class="lead">Real apps have many slices of state (auth, cart, products). You <strong>combine</strong> their reducers into one store. And because reducers must be pure, async work (API calls) goes through <strong>middleware</strong> — the standard is <strong>thunk</strong>.</p>
<h3>Combining reducers</h3>
<pre><span class="tok-keyword">const</span> store = <span class="tok-function">configureStore</span>({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    cart: cartReducer,     <span class="tok-comment">// each slice owns a branch of state</span>
  },
});
<span class="tok-comment">// state shape: { counter: {...}, auth: {...}, cart: {...} }</span></pre>
<p>Each slice manages its own branch; selectors read the branch they need (<code>s =&gt; s.cart.items</code>).</p>
<h3>Thunk — async actions</h3>
<p>A <strong>thunk</strong> is an action that is a <em>function</em> (not a plain object). Middleware lets it run async code and dispatch real actions when done. RTK's <code>createAsyncThunk</code> wires this up:</p>
<pre><span class="tok-keyword">import</span> { createAsyncThunk } <span class="tok-keyword">from</span> <span class="tok-string">"@reduxjs/toolkit"</span>;

<span class="tok-keyword">const</span> fetchUsers = <span class="tok-function">createAsyncThunk</span>(
  <span class="tok-string">"users/fetch"</span>,
  <span class="tok-keyword">async</span> () =&gt; {
    <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> axios.<span class="tok-function">get</span>(<span class="tok-string">"/api/users"</span>);
    <span class="tok-keyword">return</span> res.data; <span class="tok-comment">// becomes action.payload on success</span>
  }
);
<span class="tok-comment">// component: dispatch(fetchUsers());</span></pre>
<p>It auto-dispatches <code>pending</code>, <code>fulfilled</code>, and <code>rejected</code> actions you handle in <code>extraReducers</code> — perfect for loading/success/error state.</p>
<div class="pitfall">Never put async calls or side effects <strong>inside a reducer</strong> — reducers must be pure and synchronous. All async (fetch, timers) belongs in thunks/middleware. Breaking this makes state updates unpredictable and dev-tools time-travel impossible.</div>
<h3>Ví dụ có lời giải · Worked example (a logger middleware)</h3>
<pre><span class="tok-comment">// Custom middleware: log every action &amp; the next state</span>
<span class="tok-keyword">const</span> logger = (store) =&gt; (next) =&gt; (action) =&gt; {
  <span class="tok-function">console</span>.log(<span class="tok-string">"dispatch"</span>, action);
  <span class="tok-keyword">const</span> result = <span class="tok-function">next</span>(action); <span class="tok-comment">// pass to the next middleware/reducer</span>
  <span class="tok-function">console</span>.log(<span class="tok-string">"next state"</span>, store.<span class="tok-function">getState</span>());
  <span class="tok-keyword">return</span> result;
};</pre>
<p>Middleware sits between <code>dispatch</code> and the reducer — a chain where each link can inspect, log, delay, or transform actions. This "onion" is how thunk, logging and dev-tools all plug in.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why the middleware signature is triple-curried.</b> The <code>store =&gt; next =&gt; action =&gt;</code> shape lets Redux <em>compose</em> middleware into a pipeline at store-creation time (it gives each middleware the store and the next link), then run a fast per-action function. It's the same functional pattern behind Express middleware and Koa. Understanding it demystifies how thunk can "pause" a dispatch to await a fetch: thunk simply checks <code>if (typeof action === "function") return action(dispatch, getState)</code> instead of passing it on.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice async thunks</span><span class="lc-sub">Fetch into a Redux store on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Kết hợp reducer &amp; async với thunk</h2>
<p class="lead">App thật có nhiều slice state (auth, cart, products). Bạn <strong>kết hợp</strong> reducer của chúng vào một store. Và vì reducer phải thuần khiết, việc async (gọi API) đi qua <strong>middleware</strong> — chuẩn là <strong>thunk</strong>.</p>
<h3>Kết hợp reducer</h3>
<pre><span class="tok-keyword">const</span> store = <span class="tok-function">configureStore</span>({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    cart: cartReducer,     <span class="tok-comment">// mỗi slice sở hữu một nhánh state</span>
  },
});
<span class="tok-comment">// hình dạng state: { counter: {...}, auth: {...}, cart: {...} }</span></pre>
<p>Mỗi slice quản một nhánh; selector đọc nhánh nó cần (<code>s =&gt; s.cart.items</code>).</p>
<h3>Thunk — action bất đồng bộ</h3>
<p>Một <strong>thunk</strong> là action mà thực chất là một <em>hàm</em> (không phải object thuần). Middleware cho nó chạy code async và dispatch action thật khi xong. <code>createAsyncThunk</code> của RTK nối sẵn:</p>
<pre><span class="tok-keyword">import</span> { createAsyncThunk } <span class="tok-keyword">from</span> <span class="tok-string">"@reduxjs/toolkit"</span>;

<span class="tok-keyword">const</span> fetchUsers = <span class="tok-function">createAsyncThunk</span>(
  <span class="tok-string">"users/fetch"</span>,
  <span class="tok-keyword">async</span> () =&gt; {
    <span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> axios.<span class="tok-function">get</span>(<span class="tok-string">"/api/users"</span>);
    <span class="tok-keyword">return</span> res.data; <span class="tok-comment">// thành action.payload khi thành công</span>
  }
);
<span class="tok-comment">// component: dispatch(fetchUsers());</span></pre>
<p>Nó tự dispatch action <code>pending</code>, <code>fulfilled</code>, và <code>rejected</code> mà bạn xử lý trong <code>extraReducers</code> — hoàn hảo cho state loading/success/error.</p>
<div class="pitfall">Đừng bao giờ đặt lời gọi async hay side effect <strong>bên trong reducer</strong> — reducer phải thuần khiết và đồng bộ. Mọi async (fetch, timer) thuộc về thunk/middleware. Phá quy tắc này làm cập nhật state khó đoán và dev-tools tua thời gian bất khả thi.</div>
<h3>Ví dụ có lời giải · Middleware logger</h3>
<pre><span class="tok-comment">// Middleware tự viết: log mọi action &amp; state kế tiếp</span>
<span class="tok-keyword">const</span> logger = (store) =&gt; (next) =&gt; (action) =&gt; {
  <span class="tok-function">console</span>.log(<span class="tok-string">"dispatch"</span>, action);
  <span class="tok-keyword">const</span> result = <span class="tok-function">next</span>(action); <span class="tok-comment">// chuyển tới middleware/reducer kế tiếp</span>
  <span class="tok-function">console</span>.log(<span class="tok-string">"next state"</span>, store.<span class="tok-function">getState</span>());
  <span class="tok-keyword">return</span> result;
};</pre>
<p>Middleware nằm giữa <code>dispatch</code> và reducer — một chuỗi nơi mỗi mắt xích có thể xem, log, trì hoãn, hoặc biến đổi action. "Củ hành" này là cách thunk, logging và dev-tools cắm vào.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao chữ ký middleware có ba lớp hàm.</b> Dạng <code>store =&gt; next =&gt; action =&gt;</code> cho Redux <em>ghép</em> middleware thành một pipeline lúc tạo store (trao cho mỗi middleware store và mắt xích kế), rồi chạy một hàm nhanh cho mỗi action. Đây cũng là mẫu hàm đứng sau middleware của Express và Koa. Hiểu nó làm sáng tỏ cách thunk có thể "dừng" một dispatch để await fetch: thunk chỉ kiểm <code>if (typeof action === "function") return action(dispatch, getState)</code> thay vì chuyển tiếp.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện async thunk</span><span class="lc-sub">Fetch vào store Redux trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 12 Quiz|||Quiz chương 12',
          slug: 'fer202-12-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh Redux.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Redux implements which architecture?|||Redux hiện thực kiến trúc nào?', options: ['MVC', 'Flux (one-way data flow)|||Flux (luồng một chiều)', 'REST', 'MVVM'], correctIndex: 1, points: 1 },
              { question: 'How many stores does a Redux app have?|||App Redux có bao nhiêu store?', options: ['One per component|||Mỗi component một', 'One central store|||Một store trung tâm', 'One per route|||Mỗi route một', 'Zero'], correctIndex: 1, points: 1 },
              { question: 'Which hook reads state from the store?|||Hook nào đọc state từ store?', options: ['useDispatch', 'useSelector', 'useState', 'useStore'], correctIndex: 1, points: 1 },
              { question: 'Where does async work (fetch) belong in Redux?|||Việc async (fetch) thuộc về đâu trong Redux?', options: ['Inside reducers|||Trong reducer', 'In thunks/middleware|||Trong thunk/middleware', 'In selectors|||Trong selector', 'In the store config|||Trong cấu hình store'], correctIndex: 1, points: 1 },
              { question: 'RTK lets you write state.value += 1 safely because of?|||RTK cho viết state.value += 1 an toàn nhờ?', options: ['A copy|||Một bản sao', 'Immer under the hood|||Immer bên dưới', 'A proxy trick you write|||Một mẹo proxy bạn viết', 'It is not safe|||Không an toàn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 — CLO7–CLO8|||Bài kiểm tra tiến độ 2 — CLO7–CLO8',
      description: 'Kiểm tra giữa chặng 2: routing, code splitting, client-server, Redux.',
      lessons: [
        {
          title: 'Progress Test 2|||Bài kiểm tra tiến độ 2',
          slug: 'fer202-pt2',
          type: 'QUIZ',
          description: 'Tổng hợp chương 9–12 (CLO7–CLO8).',
          quiz: {
            timeLimitSeconds: 900,
            questions: [
              { question: 'React Router changes the view without a?|||React Router đổi view mà không cần?', options: ['State|||State', 'Full page reload|||Reload toàn trang', 'A component|||Component', 'CSS'], correctIndex: 1, points: 1 },
              { question: 'lazy() + Suspense are used for?|||lazy() + Suspense dùng cho?', options: ['Routing', 'Code splitting|||Code splitting', 'State management|||Quản lý state', 'Styling'], correctIndex: 1, points: 1 },
              { question: 'fetch resolves to a Response — to read JSON you call?|||fetch trả về Response — đọc JSON bằng?', options: ['res.data', 'res.json()', 'res.parse()', 'JSON(res)'], correctIndex: 1, points: 1 },
              { question: 'async/await is syntax over?|||async/await là cú pháp trên?', options: ['Callbacks|||Callback', 'Promises|||Promise', 'Loops|||Vòng lặp', 'Classes|||Class'], correctIndex: 1, points: 1 },
              { question: 'You dispatch an action to?|||Bạn dispatch một action để?', options: ['Read state|||Đọc state', 'Trigger a state update via a reducer|||Kích hoạt cập nhật state qua reducer', 'Render JSX|||Render JSX', 'Fetch a route|||Fetch một route'], correctIndex: 1, points: 1 },
              { question: 'A reducer must be?|||Reducer phải?', options: ['Async|||Bất đồng bộ', 'Pure and synchronous|||Thuần khiết và đồng bộ', 'A component|||Component', 'A hook'], correctIndex: 1, points: 1 },
              { question: 'json-server gives you a?|||json-server cho bạn một?', options: ['Database GUI|||GUI cơ sở dữ liệu', 'Quick mock REST API|||REST API giả nhanh', 'React app|||App React', 'Bundler|||Bộ đóng gói'], correctIndex: 1, points: 1 },
              { question: 'axios rejects automatically on?|||axios tự reject khi?', options: ['Any request|||Request bất kỳ', 'HTTP 4xx/5xx errors|||Lỗi HTTP 4xx/5xx', 'Success|||Thành công', 'Never|||Không bao giờ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ NÂNG CAO A1 — HIỆU NĂNG REACT ══════════════════ */
    {
      title: 'Advanced A1 — React Performance|||Nâng cao A1 — Hiệu năng React',
      description: 'Ngoài giáo trình: memo, useMemo, useCallback, và khi nào tối ưu.',
      lessons: [
        {
          title: 'A1.1 — memo, useMemo & useCallback|||A1.1 — memo, useMemo & useCallback',
          slug: 'fer202-a1-1-performance',
          type: 'VIDEO',
          description: 'Tránh render lại thừa và tính toán lại tốn kém.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced A1 · Lesson A1.1</span>
<h2>React performance: memo, useMemo, useCallback</h2>
<p class="lead">React re-renders a component whenever its state or props change — and a parent re-render re-renders all children by default. Usually that's fast enough. When it isn't, three tools skip unnecessary work: <code>React.memo</code>, <code>useMemo</code>, <code>useCallback</code>.</p>
<h3>React.memo — skip re-render if props are unchanged</h3>
<pre><span class="tok-comment">// Only re-renders when its props actually change</span>
<span class="tok-keyword">const</span> Row = React.<span class="tok-function">memo</span>(<span class="tok-keyword">function</span> <span class="tok-function">Row</span>({ label }) {
  <span class="tok-keyword">return</span> &lt;li&gt;{label}&lt;/li&gt;;
});</pre>
<p><code>memo</code> does a shallow compare of props; if they're equal to last time, it reuses the previous render.</p>
<h3>useMemo — cache an expensive computation</h3>
<pre><span class="tok-keyword">const</span> sorted = <span class="tok-function">useMemo</span>(
  () =&gt; items.<span class="tok-function">slice</span>().<span class="tok-function">sort</span>(compare), <span class="tok-comment">// only re-sorts when items change</span>
  [items]
);</pre>
<h3>useCallback — keep a function reference stable</h3>
<pre><span class="tok-comment">// Same function identity across renders (unless deps change)</span>
<span class="tok-keyword">const</span> handleClick = <span class="tok-function">useCallback</span>(() =&gt; <span class="tok-function">doThing</span>(id), [id]);</pre>
<div class="out"><b>Why:</b> a memoized child compares props by reference; a fresh function each render would break its memoization. <code>useCallback</code> keeps the reference stable.</div>
<div class="pitfall">Don't sprinkle <code>useMemo</code>/<code>useCallback</code> everywhere — they have a cost (memory + a dependency check) and often save nothing. Measure first with the React DevTools Profiler. Premature memoization makes code harder to read for no real gain. Optimize the proven-slow spots, not every line.</div>
<h3>Ví dụ có lời giải · Worked example (stable callback + memo child)</h3>
<pre><span class="tok-keyword">const</span> Child = React.<span class="tok-function">memo</span>(({ onClick }) =&gt; {
  <span class="tok-function">console</span>.log(<span class="tok-string">"Child render"</span>);
  <span class="tok-keyword">return</span> &lt;button onClick={onClick}&gt;Go&lt;/button&gt;;
});
<span class="tok-keyword">function</span> <span class="tok-function">Parent</span>() {
  <span class="tok-keyword">const</span> [n, setN] = <span class="tok-function">useState</span>(0);
  <span class="tok-keyword">const</span> onClick = <span class="tok-function">useCallback</span>(() =&gt; <span class="tok-function">alert</span>(<span class="tok-string">"hi"</span>), []);
  <span class="tok-keyword">return</span> &lt;&gt;&lt;button onClick={() =&gt; setN(n+1)}&gt;{n}&lt;/button&gt;&lt;Child onClick={onClick} /&gt;&lt;/&gt;;
}</pre>
<p>Clicking the parent button bumps <code>n</code> and re-renders Parent, but <code>Child</code> does <strong>not</strong> re-render ("Child render" logs once) because <code>onClick</code> is stable via <code>useCallback</code> and <code>Child</code> is wrapped in <code>memo</code>. Remove either one and Child re-renders every time.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The React Compiler is changing this.</b> React 19 introduces an optional compiler that auto-memoizes components and values at build time — potentially making manual <code>useMemo</code>/<code>useCallback</code> unnecessary for most code. The mental model still matters (you must understand <em>why</em> re-renders happen to debug), but the industry direction is "write simple code, let the compiler optimize". Learn the manual tools to understand the machinery; expect to reach for them less over time.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice memoization</span><span class="lc-sub">See renders skip with memo on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao A1 · Bài A1.1</span>
<h2>Hiệu năng React: memo, useMemo, useCallback</h2>
<p class="lead">React render lại một component mỗi khi state hoặc props của nó đổi — và cha render lại thì mặc định render lại mọi con. Thường thế là đủ nhanh. Khi không, ba công cụ bỏ qua việc thừa: <code>React.memo</code>, <code>useMemo</code>, <code>useCallback</code>.</p>
<h3>React.memo — bỏ render lại nếu props không đổi</h3>
<pre><span class="tok-comment">// Chỉ render lại khi props thực sự đổi</span>
<span class="tok-keyword">const</span> Row = React.<span class="tok-function">memo</span>(<span class="tok-keyword">function</span> <span class="tok-function">Row</span>({ label }) {
  <span class="tok-keyword">return</span> &lt;li&gt;{label}&lt;/li&gt;;
});</pre>
<p><code>memo</code> so sánh nông props; nếu bằng lần trước, nó tái dùng render cũ.</p>
<h3>useMemo — cache một tính toán tốn kém</h3>
<pre><span class="tok-keyword">const</span> sorted = <span class="tok-function">useMemo</span>(
  () =&gt; items.<span class="tok-function">slice</span>().<span class="tok-function">sort</span>(compare), <span class="tok-comment">// chỉ sort lại khi items đổi</span>
  [items]
);</pre>
<h3>useCallback — giữ tham chiếu hàm ổn định</h3>
<pre><span class="tok-comment">// Cùng danh tính hàm qua các render (trừ khi deps đổi)</span>
<span class="tok-keyword">const</span> handleClick = <span class="tok-function">useCallback</span>(() =&gt; <span class="tok-function">doThing</span>(id), [id]);</pre>
<div class="out"><b>Vì sao:</b> một con đã memo so sánh props theo tham chiếu; một hàm mới mỗi render sẽ phá memo hoá của nó. <code>useCallback</code> giữ tham chiếu ổn định.</div>
<div class="pitfall">Đừng rải <code>useMemo</code>/<code>useCallback</code> khắp nơi — chúng có chi phí (bộ nhớ + kiểm phụ thuộc) và thường chẳng tiết kiệm gì. Hãy đo trước bằng React DevTools Profiler. Memo hoá non làm code khó đọc mà không lợi thật. Tối ưu chỗ đã chứng minh là chậm, không phải mọi dòng.</div>
<h3>Ví dụ có lời giải · Callback ổn định + con memo</h3>
<pre><span class="tok-keyword">const</span> Child = React.<span class="tok-function">memo</span>(({ onClick }) =&gt; {
  <span class="tok-function">console</span>.log(<span class="tok-string">"Child render"</span>);
  <span class="tok-keyword">return</span> &lt;button onClick={onClick}&gt;Go&lt;/button&gt;;
});
<span class="tok-keyword">function</span> <span class="tok-function">Parent</span>() {
  <span class="tok-keyword">const</span> [n, setN] = <span class="tok-function">useState</span>(0);
  <span class="tok-keyword">const</span> onClick = <span class="tok-function">useCallback</span>(() =&gt; <span class="tok-function">alert</span>(<span class="tok-string">"hi"</span>), []);
  <span class="tok-keyword">return</span> &lt;&gt;&lt;button onClick={() =&gt; setN(n+1)}&gt;{n}&lt;/button&gt;&lt;Child onClick={onClick} /&gt;&lt;/&gt;;
}</pre>
<p>Bấm nút của cha tăng <code>n</code> và render lại Parent, nhưng <code>Child</code> <strong>không</strong> render lại ("Child render" chỉ log một lần) vì <code>onClick</code> ổn định qua <code>useCallback</code> và <code>Child</code> được bọc <code>memo</code>. Bỏ một trong hai thì Child render lại mỗi lần.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>React Compiler đang thay đổi điều này.</b> React 19 giới thiệu một compiler tuỳ chọn tự memo hoá component và giá trị lúc build — có thể khiến <code>useMemo</code>/<code>useCallback</code> thủ công không cần thiết cho phần lớn code. Mô hình tư duy vẫn quan trọng (phải hiểu <em>vì sao</em> render lại xảy ra để debug), nhưng hướng đi của ngành là "viết code đơn giản, để compiler tối ưu". Học công cụ thủ công để hiểu bộ máy; chờ đợi sẽ dùng chúng ít dần theo thời gian.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện memo hoá</span><span class="lc-sub">Xem render bị bỏ qua với memo trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Advanced A1 Quiz|||Quiz nâng cao A1',
          slug: 'fer202-a1-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh hiệu năng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'React.memo does what?|||React.memo làm gì?', options: ['Caches API calls|||Cache lời gọi API', 'Skips re-render when props are unchanged|||Bỏ render lại khi props không đổi', 'Fetches data|||Fetch dữ liệu', 'Splits code|||Chia code'], correctIndex: 1, points: 1 },
              { question: 'useMemo is for?|||useMemo dùng cho?', options: ['Caching an expensive computed value|||Cache một giá trị tính tốn kém', 'Routing', 'State|||State', 'Effects'], correctIndex: 0, points: 1 },
              { question: 'useCallback keeps what stable?|||useCallback giữ gì ổn định?', options: ['A value|||Một giá trị', 'A function reference|||Tham chiếu hàm', 'A component|||Component', 'The DOM'], correctIndex: 1, points: 1 },
              { question: 'Before optimizing you should?|||Trước khi tối ưu bạn nên?', options: ['Memoize everything|||Memo hoá mọi thứ', 'Measure with the Profiler|||Đo bằng Profiler', 'Remove state|||Bỏ state', 'Add Redux|||Thêm Redux'], correctIndex: 1, points: 1 },
              { question: 'A parent re-render by default causes children to?|||Cha render lại mặc định khiến con?', options: ['Stay|||Giữ nguyên', 'Also re-render|||Cũng render lại', 'Unmount', 'Error|||Lỗi'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ NÂNG CAO A2 — TESTING REACT ══════════════════ */
    {
      title: 'Advanced A2 — Testing React|||Nâng cao A2 — Kiểm thử React',
      description: 'Ngoài giáo trình: Jest + React Testing Library.',
      lessons: [
        {
          title: 'A2.1 — Jest & React Testing Library|||A2.1 — Jest & React Testing Library',
          slug: 'fer202-a2-1-testing',
          type: 'VIDEO',
          description: 'Viết test cho component như người dùng thật tương tác.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced A2 · Lesson A2.1</span>
<h2>Testing React with Jest &amp; React Testing Library</h2>
<p class="lead">Tests catch bugs before users do and let you refactor fearlessly. <strong>Jest</strong> is the test runner; <strong>React Testing Library (RTL)</strong> renders components and queries them the way a user would — by text, role and label, not by internal implementation.</p>
<h3>A first component test</h3>
<pre><span class="tok-keyword">import</span> { render, screen } <span class="tok-keyword">from</span> <span class="tok-string">"@testing-library/react"</span>;
<span class="tok-keyword">import</span> Greeting <span class="tok-keyword">from</span> <span class="tok-string">"./Greeting"</span>;

<span class="tok-function">test</span>(<span class="tok-string">"shows the name"</span>, () =&gt; {
  <span class="tok-function">render</span>(&lt;Greeting name=<span class="tok-string">"An"</span> /&gt;);
  <span class="tok-function">expect</span>(screen.<span class="tok-function">getByText</span>(<span class="tok-string">"Hi An"</span>)).<span class="tok-function">toBeInTheDocument</span>();
});</pre>
<div class="out"><b>Result:</b> PASS — the test renders the component and asserts the text is present.</div>
<h3>Testing interaction</h3>
<pre><span class="tok-keyword">import</span> userEvent <span class="tok-keyword">from</span> <span class="tok-string">"@testing-library/user-event"</span>;

<span class="tok-function">test</span>(<span class="tok-string">"counts clicks"</span>, <span class="tok-keyword">async</span> () =&gt; {
  <span class="tok-function">render</span>(&lt;Counter /&gt;);
  <span class="tok-keyword">const</span> btn = screen.<span class="tok-function">getByRole</span>(<span class="tok-string">"button"</span>);
  <span class="tok-keyword">await</span> userEvent.<span class="tok-function">click</span>(btn);
  <span class="tok-function">expect</span>(btn).<span class="tok-function">toHaveTextContent</span>(<span class="tok-string">"1"</span>);
});</pre>
<p>You simulate a real click with <code>userEvent</code>, then assert the visible result — exactly what a user experiences.</p>
<div class="pitfall">RTL's guiding principle: test <strong>behaviour, not implementation</strong>. Don't reach into state or call internal methods — query the rendered output by what the user sees (<code>getByRole</code>, <code>getByText</code>, <code>getByLabelText</code>). Tests tied to internal details break on every refactor even when the UI still works.</div>
<h3>Ví dụ có lời giải · Worked example (query priority)</h3>
<p>RTL recommends queries in this priority: <code>getByRole</code> (accessible, closest to how users and screen readers find things) → <code>getByLabelText</code> (form fields) → <code>getByText</code> → and only as a last resort <code>getByTestId</code>. Preferring role-based queries also nudges you toward accessible markup — a two-for-one win.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The testing trophy vs the testing pyramid.</b> The old "pyramid" said write mostly unit tests. Kent C. Dodds (RTL's author) argues for a "trophy": a few end-to-end tests, <em>lots</em> of integration tests (render a feature, interact, assert), fewer isolated unit tests, plus static checks (TypeScript, ESLint) at the base. The insight: integration tests give the most confidence per line because they test components working together the way users use them — which is exactly what RTL makes easy.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up Jest &amp; RTL</span><span class="lc-sub">Config and first tests — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao A2 · Bài A2.1</span>
<h2>Kiểm thử React với Jest &amp; React Testing Library</h2>
<p class="lead">Test bắt lỗi trước người dùng và cho bạn refactor không sợ hãi. <strong>Jest</strong> là trình chạy test; <strong>React Testing Library (RTL)</strong> render component và truy vấn chúng như một người dùng — theo text, role và label, không theo chi tiết cài đặt bên trong.</p>
<h3>Test component đầu tiên</h3>
<pre><span class="tok-keyword">import</span> { render, screen } <span class="tok-keyword">from</span> <span class="tok-string">"@testing-library/react"</span>;
<span class="tok-keyword">import</span> Greeting <span class="tok-keyword">from</span> <span class="tok-string">"./Greeting"</span>;

<span class="tok-function">test</span>(<span class="tok-string">"shows the name"</span>, () =&gt; {
  <span class="tok-function">render</span>(&lt;Greeting name=<span class="tok-string">"An"</span> /&gt;);
  <span class="tok-function">expect</span>(screen.<span class="tok-function">getByText</span>(<span class="tok-string">"Hi An"</span>)).<span class="tok-function">toBeInTheDocument</span>();
});</pre>
<div class="out"><b>Kết quả:</b> PASS — test render component và khẳng định text có mặt.</div>
<h3>Test tương tác</h3>
<pre><span class="tok-keyword">import</span> userEvent <span class="tok-keyword">from</span> <span class="tok-string">"@testing-library/user-event"</span>;

<span class="tok-function">test</span>(<span class="tok-string">"counts clicks"</span>, <span class="tok-keyword">async</span> () =&gt; {
  <span class="tok-function">render</span>(&lt;Counter /&gt;);
  <span class="tok-keyword">const</span> btn = screen.<span class="tok-function">getByRole</span>(<span class="tok-string">"button"</span>);
  <span class="tok-keyword">await</span> userEvent.<span class="tok-function">click</span>(btn);
  <span class="tok-function">expect</span>(btn).<span class="tok-function">toHaveTextContent</span>(<span class="tok-string">"1"</span>);
});</pre>
<p>Bạn mô phỏng cú click thật bằng <code>userEvent</code>, rồi khẳng định kết quả nhìn thấy — đúng những gì người dùng trải nghiệm.</p>
<div class="pitfall">Nguyên tắc dẫn lối của RTL: test <strong>hành vi, không phải cài đặt</strong>. Đừng thò vào state hay gọi phương thức nội bộ — truy vấn đầu ra render theo những gì người dùng thấy (<code>getByRole</code>, <code>getByText</code>, <code>getByLabelText</code>). Test gắn với chi tiết nội bộ sẽ vỡ mỗi lần refactor dù UI vẫn chạy.</div>
<h3>Ví dụ có lời giải · Ưu tiên truy vấn</h3>
<p>RTL khuyến nghị truy vấn theo thứ tự ưu tiên: <code>getByRole</code> (dễ tiếp cận, gần cách người dùng và screen reader tìm) → <code>getByLabelText</code> (field form) → <code>getByText</code> → và chỉ khi bí mới dùng <code>getByTestId</code>. Ưu tiên truy vấn theo role còn đẩy bạn tới markup dễ tiếp cận — lợi cả đôi.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Testing trophy vs testing pyramid.</b> "Kim tự tháp" cũ nói viết chủ yếu unit test. Kent C. Dodds (tác giả RTL) đề xuất "chiếc cúp": vài test end-to-end, <em>nhiều</em> test tích hợp (render một tính năng, tương tác, khẳng định), ít unit test cô lập hơn, cộng kiểm tra tĩnh (TypeScript, ESLint) ở đáy. Ý tưởng: test tích hợp cho niềm tin cao nhất trên mỗi dòng vì nó test các component làm việc cùng nhau theo cách người dùng dùng — chính là điều RTL làm dễ dàng.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt Jest &amp; RTL</span><span class="lc-sub">Cấu hình và test đầu tiên — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: 'Advanced A2 Quiz|||Quiz nâng cao A2',
          slug: 'fer202-a2-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh testing.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Jest is a?|||Jest là?', options: ['Router', 'Test runner|||Trình chạy test', 'State manager|||Quản lý state', 'Bundler|||Bộ đóng gói'], correctIndex: 1, points: 1 },
              { question: 'RTL encourages querying by?|||RTL khuyến khích truy vấn theo?', options: ['Internal state|||State nội bộ', 'What the user sees (role, text, label)|||Những gì người dùng thấy (role, text, label)', 'CSS classes|||Class CSS', 'Component names|||Tên component'], correctIndex: 1, points: 1 },
              { question: 'To simulate a real click you use?|||Mô phỏng cú click thật bằng?', options: ['click()', 'userEvent.click', 'dispatch', 'fetch'], correctIndex: 1, points: 1 },
              { question: 'The most preferred RTL query is?|||Truy vấn RTL được ưu tiên nhất là?', options: ['getByTestId', 'getByRole', 'querySelector', 'getById'], correctIndex: 1, points: 1 },
              { question: 'Tests tied to implementation details?|||Test gắn với chi tiết cài đặt?', options: ['Are the best|||Là tốt nhất', 'Break on refactors even when UI works|||Vỡ khi refactor dù UI chạy', 'Run faster|||Chạy nhanh hơn', 'Are required|||Là bắt buộc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ NÂNG CAO A3 — TYPESCRIPT & NEXT.JS ══════════════════ */
    {
      title: 'Advanced A3 — TypeScript & Next.js|||Nâng cao A3 — TypeScript & Next.js',
      description: 'Ngoài giáo trình: gõ kiểu cho React, và framework Next.js.',
      lessons: [
        {
          title: 'A3.1 — TypeScript with React & an intro to Next.js|||A3.1 — TypeScript với React & giới thiệu Next.js',
          slug: 'fer202-a3-1-typescript-nextjs',
          type: 'VIDEO',
          description: 'Kiểu tĩnh cho props/state, và SSR với Next.js.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced A3 · Lesson A3.1</span>
<h2>TypeScript with React &amp; a Next.js intro</h2>
<p class="lead">Two things every professional React team uses. <strong>TypeScript</strong> adds static types to JavaScript, catching whole classes of bugs before you run. <strong>Next.js</strong> is the leading React <em>framework</em> — it adds routing, server rendering and a build system on top of React.</p>
<h3>Typing a component's props</h3>
<pre><span class="tok-comment">// Greeting.tsx — props are typed</span>
<span class="tok-keyword">type</span> Props = { name: <span class="tok-type">string</span>; age?: <span class="tok-type">number</span> };

<span class="tok-keyword">function</span> <span class="tok-function">Greeting</span>({ name, age }: Props) {
  <span class="tok-keyword">return</span> &lt;h2&gt;{name} {age ?? <span class="tok-string">"?"</span>}&lt;/h2&gt;;
}
<span class="tok-comment">// &lt;Greeting name={5} /&gt;  ❌ compile error: number not assignable to string</span></pre>
<div class="out"><b>Result:</b> passing the wrong prop type is caught at compile time, not in production.</div>
<p>Typed state: <code>useState&lt;number&gt;(0)</code>, typed events: <code>(e: React.ChangeEvent&lt;HTMLInputElement&gt;)</code>. The editor now autocompletes props and flags mistakes as you type.</p>
<h3>Next.js in one screen</h3>
<pre><span class="tok-comment"># create a Next.js app</span>
npx create-next-app@latest my-app
<span class="tok-comment"># file-based routing: app/about/page.tsx → /about</span></pre>
<ul>
  <li><strong>File-based routing</strong> — a file's path is its URL (no React Router config).</li>
  <li><strong>Server Components &amp; SSR</strong> — render on the server for speed and SEO.</li>
  <li><strong>API routes</strong> — build back-end endpoints in the same project.</li>
</ul>
<div class="pitfall">Don't confuse React and Next.js: React is a <strong>library</strong> for UI; Next.js is a <strong>framework</strong> that uses React and adds structure (routing, SSR, bundling). Everything you learned in FER202 still applies inside Next.js — components, hooks, props are identical. You're adding a framework around the same core.</div>
<h3>Ví dụ có lời giải · Worked example (why SSR helps SEO)</h3>
<p>A plain React SPA ships an almost-empty HTML shell; content appears only after JS runs. Search-engine crawlers and social-preview bots may see nothing. Next.js renders the HTML <strong>on the server</strong> so the first response already contains the content — better SEO, faster first paint, correct link previews. This is why content sites (blogs, e-commerce) choose Next.js over a bare SPA.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Hydration — the SSR handshake.</b> With SSR the server sends ready-made HTML, then the same React code runs in the browser and "adopts" that HTML, attaching event handlers and state — a process called <b>hydration</b>. The catch: the server-rendered markup must <em>exactly match</em> what React renders on the client, or you get a "hydration mismatch" error. Common causes: rendering <code>Date.now()</code>, random values, or browser-only APIs during render. Understanding hydration explains a whole category of Next.js bugs — and why <code>useEffect</code> (client-only) is the escape hatch for browser-specific code.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice TypeScript basics</span><span class="lc-sub">Types, generics &amp; more on Code Lab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao A3 · Bài A3.1</span>
<h2>TypeScript với React &amp; giới thiệu Next.js</h2>
<p class="lead">Hai thứ mọi đội React chuyên nghiệp đều dùng. <strong>TypeScript</strong> thêm kiểu tĩnh cho JavaScript, bắt cả lớp lỗi trước khi chạy. <strong>Next.js</strong> là <em>framework</em> React dẫn đầu — thêm routing, render phía server và hệ build lên trên React.</p>
<h3>Gõ kiểu props của component</h3>
<pre><span class="tok-comment">// Greeting.tsx — props có kiểu</span>
<span class="tok-keyword">type</span> Props = { name: <span class="tok-type">string</span>; age?: <span class="tok-type">number</span> };

<span class="tok-keyword">function</span> <span class="tok-function">Greeting</span>({ name, age }: Props) {
  <span class="tok-keyword">return</span> &lt;h2&gt;{name} {age ?? <span class="tok-string">"?"</span>}&lt;/h2&gt;;
}
<span class="tok-comment">// &lt;Greeting name={5} /&gt;  ❌ lỗi biên dịch: number không gán được cho string</span></pre>
<div class="out"><b>Kết quả:</b> truyền sai kiểu prop bị bắt lúc biên dịch, không phải ở production.</div>
<p>State có kiểu: <code>useState&lt;number&gt;(0)</code>, sự kiện có kiểu: <code>(e: React.ChangeEvent&lt;HTMLInputElement&gt;)</code>. Trình soạn thảo giờ tự hoàn thành props và báo lỗi ngay khi gõ.</p>
<h3>Next.js trong một màn hình</h3>
<pre><span class="tok-comment"># tạo app Next.js</span>
npx create-next-app@latest my-app
<span class="tok-comment"># routing theo file: app/about/page.tsx → /about</span></pre>
<ul>
  <li><strong>Routing theo file</strong> — đường dẫn file chính là URL (không cần cấu hình React Router).</li>
  <li><strong>Server Component &amp; SSR</strong> — render trên server cho tốc độ và SEO.</li>
  <li><strong>API route</strong> — dựng endpoint back-end trong cùng dự án.</li>
</ul>
<div class="pitfall">Đừng nhầm React và Next.js: React là <strong>thư viện</strong> cho UI; Next.js là <strong>framework</strong> dùng React và thêm cấu trúc (routing, SSR, bundling). Mọi thứ bạn học trong FER202 vẫn áp dụng bên trong Next.js — component, hooks, props giống hệt. Bạn chỉ thêm một framework bao quanh cùng lõi.</div>
<h3>Ví dụ có lời giải · Vì sao SSR giúp SEO</h3>
<p>Một SPA React thuần gửi khung HTML gần như rỗng; nội dung chỉ hiện sau khi JS chạy. Bot công cụ tìm kiếm và bot xem trước mạng xã hội có thể chẳng thấy gì. Next.js render HTML <strong>trên server</strong> nên response đầu đã chứa nội dung — SEO tốt hơn, hiển thị lần đầu nhanh hơn, link preview đúng. Vì thế các site nội dung (blog, thương mại điện tử) chọn Next.js thay vì SPA trơ.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hydration — cái bắt tay của SSR.</b> Với SSR, server gửi HTML dựng sẵn, rồi chính code React chạy trong trình duyệt và "nhận nuôi" HTML đó, gắn event handler và state — quá trình gọi là <b>hydration</b>. Cái bẫy: markup render ở server phải <em>khớp chính xác</em> với những gì React render ở client, nếu không bạn gặp lỗi "hydration mismatch". Nguyên nhân phổ biến: render <code>Date.now()</code>, giá trị ngẫu nhiên, hay API chỉ có ở trình duyệt lúc render. Hiểu hydration giải thích cả một loại lỗi Next.js — và vì sao <code>useEffect</code> (chỉ client) là lối thoát cho code riêng trình duyệt.</div>
<a class="link-card codelab" href="/code-lab/javascript?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện TypeScript cơ bản</span><span class="lc-sub">Kiểu, generic &amp; hơn nữa trên Code Lab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Advanced A3 Quiz|||Quiz nâng cao A3',
          slug: 'fer202-a3-quiz',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh TypeScript & Next.js.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'TypeScript adds what to JavaScript?|||TypeScript thêm gì vào JavaScript?', options: ['Speed|||Tốc độ', 'Static types|||Kiểu tĩnh', 'Styling|||Style', 'Routing'], correctIndex: 1, points: 1 },
              { question: 'React is a library; Next.js is a?|||React là thư viện; Next.js là?', options: ['Library|||Thư viện', 'Framework', 'Database|||Cơ sở dữ liệu', 'Bundler|||Bộ đóng gói'], correctIndex: 1, points: 1 },
              { question: 'Next.js routing is based on?|||Routing của Next.js dựa trên?', options: ['A config file|||File cấu hình', 'The file system|||Hệ thống file', 'Redux', 'Context'], correctIndex: 1, points: 1 },
              { question: 'SSR helps mainly with?|||SSR giúp chủ yếu về?', options: ['State|||State', 'SEO &amp; first paint|||SEO &amp; hiển thị lần đầu', 'Testing|||Test', 'Styling|||Style'], correctIndex: 1, points: 1 },
              { question: 'Hydration is?|||Hydration là?', options: ['Fetching data|||Fetch dữ liệu', 'Client React adopting server-rendered HTML|||React client nhận nuôi HTML render từ server', 'A CSS trick|||Mẹo CSS', 'A Redux middleware|||Middleware Redux'], correctIndex: 1, points: 1 },
            ],
          },
        },
        {
          title: 'Course wrap-up & exam tips|||Tổng kết môn & mẹo thi',
          slug: 'fer202-wrap-up',
          type: 'VIDEO',
          description: 'Ôn tập, chiến lược thi Practical/Final, và bước tiếp theo.',
          content: `
<div class="ml-en">
<span class="eyebrow">Course wrap-up</span>
<h2>You made it — the React map in your head</h2>
<p class="lead">You now hold the full FER202 picture: ES6 → JSX → components &amp; state → events → context → hooks → routing → code splitting → data fetching → Redux, plus performance, testing and Next.js. Here's how to convert that into a good grade.</p>
<h3>Exam strategy</h3>
<ul>
  <li><strong>Labs (20%) &amp; Practical (20%):</strong> pure hands-on. The only way to be fast is to have <em>built</em> the labs yourself. Re-do each lab from scratch without looking.</li>
  <li><strong>Progress Tests &amp; Final:</strong> review the chapter quizzes and the two Progress Tests here. Focus on the classic traps: <code>key</code> in lists, <code>fetch</code> not rejecting on 404, reducers must be pure, <code>&lt;Link&gt;</code> vs <code>&lt;a&gt;</code>, stale closures in <code>useEffect</code>.</li>
  <li><strong>Assignment (15%):</strong> a small full app — start early, commit to Git often.</li>
</ul>
<h3>Common pitfalls to memorise</h3>
<ul>
  <li>Mutating state instead of creating a new reference → UI won't update.</li>
  <li>Missing/incorrect <code>useEffect</code> dependencies → stale data or infinite loops.</li>
  <li>Using the array index as a list <code>key</code> in dynamic lists.</li>
  <li>Async logic inside a reducer (must go in a thunk).</li>
</ul>
<div class="callout ok">Good luck in the exam — and more importantly, you now have a real, employable skill. React is everywhere; keep building side projects, and each concept here becomes second nature.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Keep practicing React</span><span class="lc-sub">The full React track on Code Lab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Tổng kết môn</span>
<h2>Bạn đã hoàn thành — bản đồ React trong đầu</h2>
<p class="lead">Bạn giờ nắm trọn bức tranh FER202: ES6 → JSX → component &amp; state → sự kiện → context → hooks → routing → code splitting → fetch dữ liệu → Redux, cộng hiệu năng, testing và Next.js. Đây là cách biến nó thành điểm cao.</p>
<h3>Chiến lược thi</h3>
<ul>
  <li><strong>Labs (20%) &amp; Practical (20%):</strong> thực hành thuần. Cách duy nhất để nhanh là đã <em>tự tay dựng</em> các lab. Làm lại mỗi lab từ đầu không nhìn.</li>
  <li><strong>Progress Test &amp; Final:</strong> ôn quiz các chương và hai Progress Test ở đây. Tập trung các bẫy kinh điển: <code>key</code> trong danh sách, <code>fetch</code> không reject khi 404, reducer phải thuần khiết, <code>&lt;Link&gt;</code> vs <code>&lt;a&gt;</code>, stale closure trong <code>useEffect</code>.</li>
  <li><strong>Assignment (15%):</strong> một app nhỏ hoàn chỉnh — bắt đầu sớm, commit Git thường xuyên.</li>
</ul>
<h3>Bẫy phổ biến cần thuộc</h3>
<ul>
  <li>Sửa state tại chỗ thay vì tạo tham chiếu mới → UI không cập nhật.</li>
  <li>Thiếu/sai phụ thuộc <code>useEffect</code> → dữ liệu cũ hoặc vòng lặp vô hạn.</li>
  <li>Dùng index mảng làm <code>key</code> trong danh sách động.</li>
  <li>Logic async bên trong reducer (phải đưa vào thunk).</li>
</ul>
<div class="callout ok">Chúc bạn thi tốt — và quan trọng hơn, giờ bạn có một kỹ năng thật, xin được việc. React ở khắp nơi; hãy tiếp tục làm dự án cá nhân, mỗi khái niệm ở đây sẽ thành phản xạ.</div>
<a class="link-card codelab" href="/code-lab/react?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Tiếp tục luyện React</span><span class="lc-sub">Toàn bộ track React trên Code Lab.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
      ],
    },
  ],
};
