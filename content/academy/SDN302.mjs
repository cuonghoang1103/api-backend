/**
 * SDN302 — Server-Side development with NodeJS, Express, and MongoDB. Kỳ 7.
 * Bám syllabus FPTU (sylID 12175, 8 CLO, 60 buổi). Tiên quyết: DBI202, FER202. 3 tín chỉ.
 * Môn CODE: Node.js + Express + MongoDB/Mongoose + REST API + Auth + tích hợp React + deploy.
 * Grading: Assignment 20% + Practical Exam 25% (>=4) + Progress Test 15% + Project 15% + Final Exam 25% (>=4), avg >=5.
 * Chuẩn CHUYÊN NGHIỆP như SWP391: thang điểm đầy đủ, checklist theo mốc, anti-fail/high-mark,
 * ngân hàng câu hỏi thi/vấn đáp theo CLO, ngân hàng đề tài project + rubric, code snippet bank.
 * Song ngữ EN/VN đối xứng. Ví dụ có lời giải + ★ ngoài giáo trình.
 * Deep-link CodeLab: mongodb / rest-apis / authentication / react. Setup → Exp Hub.
 * ESCAPE: backtick trong code -> &#96; ; ${..} -> \${ ; < > & trong <pre> -> &lt; &gt; &amp;
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SDN302.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    academyType: 'FPT',
    courseCode: 'SDN302',
    title: 'Server-Side Development with Node.js, Express & MongoDB',
    slug: 'server-side-development-nodejs-express-mongodb',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Build production back-ends with Node.js: the event loop, Express routing & middleware, MongoDB + Mongoose, a full RESTful API in MVC, authentication (bcrypt, sessions, JWT), file uploads, CORS, React integration and deployment.|||Xây back-end thực chiến với Node.js: event loop, Express routing & middleware, MongoDB + Mongoose, REST API đầy đủ theo MVC, xác thực (bcrypt, session, JWT), upload file, CORS, tích hợp React và triển khai.',
    description: 'SDN302 là môn PHÁT TRIỂN SERVER-SIDE của Kỳ 7, dạy bạn xây web server và REST API bằng ngăn xếp Node.js. Bạn đi từ nền tảng Node (single-thread, event loop, bất đồng bộ, module, npm, HTTP module) → Express (routing, middleware, Express Generator) → MongoDB & Mongoose (NoSQL, CRUD, schema, population) → một REST API đầy đủ theo MVC → templating (EJS, Handlebars) → xác thực & bảo mật (băm mật khẩu bcrypt, session/cookie, Passport, token/JWT, HTTPS, CORS, upload file với Multer) → tích hợp app React với server Node → và triển khai lên hosting (kèm giới thiệu NestJS, Hono, BaaS). Có Project + Practical Exam nên phần lớn điểm là CODE THẬT chạy được. Tiên quyết: DBI202 (CSDL) và FER202 (React). Đây là nền cho SWP391 và các đồ án full-stack sau này.',
    whatYouLearn: 'Hiểu mô hình event-driven & non-blocking của Node.js, event loop, module CommonJS/ESM và npm; xây HTTP server thuần rồi chuyển sang Express; định tuyến RESTful và viết middleware (built-in, third-party, custom, error-handling); dùng Express Generator; làm việc với MongoDB (CRUD, mongo shell) và mô hình tài liệu; thiết kế schema Mongoose, quan hệ và population; xây một REST API hoàn chỉnh theo MVC (routes → controllers → services → models); render view bằng EJS/Handlebars; hiện thực xác thực an toàn (bcrypt, session/cookie, Passport-local, JWT), HTTPS, CORS và upload/download file (Multer); tích hợp front-end React qua axios/fetch; và triển khai server lên hosting (Render/Railway/Heroku) với biến môi trường an toàn.',
    requirements: 'Tiên quyết: DBI202 (Hệ CSDL) và FER202 (React). Cần: Node.js LTS (20.x+), Visual Studio Code, Postman (test API), MongoDB Compass + một MongoDB (local hoặc MongoDB Atlas free), và Git. Nên biết JavaScript ES6 (arrow function, promise, async/await) và cơ bản HTTP.',
    documentsNote: 'Giáo trình & tài liệu: "Full Stack Web Development Guide — Node, Express, EJS, React, DB Fundamentals" • "Ultimate Full-Stack Web Development with MERN" (Packt) • Tài liệu chính chủ: nodejs.org/docs, expressjs.com, mongodb.com, mongoosejs.com, ejs.co, handlebarsjs.com, nestjs.com, hono.dev. Công cụ: VS Code, Postman, MongoDB Compass, MongoDB Atlas. Luyện tập trực tiếp trên Code Lab: track MongoDB, REST APIs, Authentication, React (deep-link theo từng bài). Cài đặt môi trường → Exp Hub. Kèm file syllabus gốc SDN302.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn xây gì, kiến trúc back-end Node, điều kiện qua môn & 5 thành phần điểm, chuẩn đầu ra, công cụ, ngân hàng đề tài project, và bí quyết điểm cao.',
      lessons: [
        {
          title: '0.1 — About SDN302 & the back-end architecture map|||0.1 — Giới thiệu SDN302 & bản đồ kiến trúc back-end',
          slug: 'sdn302-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Server-side là gì, ngăn xếp Node/Express/MongoDB, và bản đồ hành trình từ HTTP tới REST API triển khai.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SDN302 — Server-Side Development</h2>
<p class="lead">SDN302 teaches you to build the <strong>back-end</strong>: the server that receives HTTP requests, talks to a database, enforces rules and security, and returns JSON to a front-end like React. You already learned the client side in FER202; now you build the engine behind it, using <strong>Node.js + Express + MongoDB (the MERN back-end)</strong>.</p>
<p>By the end you can build a complete, secured REST API in the MVC style and deploy it — exactly the skill SWP391 and every full-stack job demands.</p>
<h3>How a request flows through your server</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Client (React)</b><span>fetch/axios → HTTP request</span></div>
  <div class="lz-step"><b>Express</b><span>route → middleware chain</span></div>
  <div class="lz-step"><b>Controller</b><span>validate, call service</span></div>
  <div class="lz-step"><b>Mongoose model</b><span>query MongoDB</span></div>
  <div class="lz-step"><b>JSON response</b><span>back to the client</span></div>
</div>
<h3>Your journey — from HTTP to a deployed API</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Node.js foundations</div><div class="lz-nsub">event loop · async · modules · npm · HTTP module</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Express</div><div class="lz-nsub">routing · middleware · Express Generator</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">MongoDB &amp; Mongoose</div><div class="lz-nsub">NoSQL · CRUD · schema · population</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">REST API in MVC</div><div class="lz-nsub">routes → controllers → services → models · EJS/Handlebars</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Auth &amp; security</div><div class="lz-nsub">bcrypt · sessions · Passport · JWT · HTTPS · CORS · uploads</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Integrate React &amp; deploy</div><div class="lz-nsub">connect front-end · hosting · BaaS</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">NestJS · Hono · production hardening</div><div class="lz-nsub">frameworks &amp; real-world robustness</div></div></div>
</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: REST Fundamentals &amp; HTTP (Code Lab)</span><span class="lc-sub">Hands-on exercises on the REST APIs track — build as you learn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout ok">The mindset shift from front-end to back-end: on the server you own the <strong>data, the rules, and the trust boundary</strong>. Never trust the client — validate every input, and never send a password or secret back. This one principle underlies half the course.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SDN302 — Phát triển Server-Side</h2>
<p class="lead">SDN302 dạy bạn xây <strong>back-end</strong>: server nhận HTTP request, nói chuyện với cơ sở dữ liệu, thực thi luật và bảo mật, rồi trả JSON về front-end như React. Bạn đã học phía client ở FER202; giờ bạn xây động cơ phía sau nó, bằng <strong>Node.js + Express + MongoDB (back-end của MERN)</strong>.</p>
<p>Kết thúc môn, bạn xây được một REST API hoàn chỉnh, có bảo mật, theo phong cách MVC và triển khai nó — đúng kỹ năng SWP391 và mọi việc full-stack đòi hỏi.</p>
<h3>Một request đi qua server của bạn thế nào</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Client (React)</b><span>fetch/axios → HTTP request</span></div>
  <div class="lz-step"><b>Express</b><span>route → chuỗi middleware</span></div>
  <div class="lz-step"><b>Controller</b><span>validate, gọi service</span></div>
  <div class="lz-step"><b>Mongoose model</b><span>truy vấn MongoDB</span></div>
  <div class="lz-step"><b>Phản hồi JSON</b><span>trả về client</span></div>
</div>
<h3>Hành trình của bạn — từ HTTP tới một API đã triển khai</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng Node.js</div><div class="lz-nsub">event loop · bất đồng bộ · module · npm · HTTP module</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Express</div><div class="lz-nsub">routing · middleware · Express Generator</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">MongoDB &amp; Mongoose</div><div class="lz-nsub">NoSQL · CRUD · schema · population</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">REST API theo MVC</div><div class="lz-nsub">routes → controllers → services → models · EJS/Handlebars</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực &amp; bảo mật</div><div class="lz-nsub">bcrypt · session · Passport · JWT · HTTPS · CORS · upload</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Tích hợp React &amp; triển khai</div><div class="lz-nsub">nối front-end · hosting · BaaS</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">NestJS · Hono · gia cố production</div><div class="lz-nsub">framework &amp; độ bền thực chiến</div></div></div>
</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: REST Fundamentals &amp; HTTP (Code Lab)</span><span class="lc-sub">Bài tập thực hành trên track REST APIs — vừa học vừa xây.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout ok">Cú chuyển tư duy từ front-end sang back-end: trên server bạn sở hữu <strong>dữ liệu, luật, và ranh giới tin cậy</strong>. Đừng bao giờ tin client — validate mọi đầu vào, và đừng bao giờ trả mật khẩu hay secret về. Nguyên tắc này nằm dưới một nửa môn học.</div>
</div>`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'sdn302-dieu-kien-qua-mon',
          type: 'VIDEO',
          description: 'Tín chỉ, tiên quyết, 5 thành phần điểm, và hai cổng ≥4 (Practical Exam + Final Exam).',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">SDN302 is graded across five components — mostly <strong>hands-on coding</strong>. Two of them have their own ≥4 gate, so you cannot pass on theory alone.</p>
<div class="kv-grid">
  <div class="kv"><b>Credits</b><span>3</span></div>
  <div class="kv"><b>Prerequisite</b><span>DBI202, FER202</span></div>
  <div class="kv"><b>Attendance</b><span>≥80% contact slots to sit the exam</span></div>
  <div class="kv"><b>Pass</b><span>Practical ≥4 AND Final ≥4 AND average ≥5</span></div>
</div>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Format</th><th>Gate</th></tr></thead>
  <tbody>
    <tr><td>Assignment (×4)</td><td>20%</td><td>Coding tasks, done in tutorials &amp; at home</td><td>submit on time</td></tr>
    <tr><td>Practical Exam</td><td>25%</td><td>Build/extend an API live, 85 min</td><td><b>≥ 4</b></td></tr>
    <tr><td>Progress Test (×3)</td><td>15%</td><td>Short tests, 20–40 min (PT1 CLO1-5,8 · PT2 CLO6 · PT3 CLO7)</td><td>—</td></tr>
    <tr><td>Project</td><td>15%</td><td>A full server-side app + presentation</td><td>—</td></tr>
    <tr><td>Final Exam</td><td>25%</td><td>Theory + applied, 60 min</td><td><b>≥ 4</b></td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">TO PASS</span> Practical Exam ≥ 4 &nbsp;AND&nbsp; Final Exam ≥ 4 &nbsp;AND&nbsp; weighted average ≥ 5</div>
<div class="callout warn">The <strong>Practical Exam (85 min)</strong> is where most students stumble: you must code a working endpoint under time — connect Mongoose, define a route, validate input, return JSON. There is no partial credit for "I know the theory" if nothing runs.</div>
<div class="out"><b>Worked example:</b> Student has Assignment 8, PT 7, Project 8, but Practical Exam 3.5 and Final 6. Even though the weighted average is above 5, the <b>Practical &lt; 4 gate fails them</b>. Lesson: practise building endpoints hands-on, repeatedly, before the PE.</div>
<div class="pitfall">Missing more than 20% of contact slots bars you from the final exam entirely — attendance is a hard gate, not a soft one.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">SDN302 chấm qua năm thành phần — phần lớn là <strong>code thực hành</strong>. Hai trong số đó có cổng ≥4 riêng, nên bạn không thể đậu chỉ bằng lý thuyết.</p>
<div class="kv-grid">
  <div class="kv"><b>Tín chỉ</b><span>3</span></div>
  <div class="kv"><b>Tiên quyết</b><span>DBI202, FER202</span></div>
  <div class="kv"><b>Điểm danh</b><span>≥80% buổi mới được thi</span></div>
  <div class="kv"><b>Đậu</b><span>Practical ≥4 VÀ Final ≥4 VÀ trung bình ≥5</span></div>
</div>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th><th>Cổng</th></tr></thead>
  <tbody>
    <tr><td>Assignment (×4)</td><td>20%</td><td>Bài code, làm ở tutorial &amp; ở nhà</td><td>nộp đúng hạn</td></tr>
    <tr><td>Practical Exam</td><td>25%</td><td>Xây/mở rộng một API tại chỗ, 85 phút</td><td><b>≥ 4</b></td></tr>
    <tr><td>Progress Test (×3)</td><td>15%</td><td>Test ngắn, 20–40 phút (PT1 CLO1-5,8 · PT2 CLO6 · PT3 CLO7)</td><td>—</td></tr>
    <tr><td>Project</td><td>15%</td><td>Một app server-side đầy đủ + thuyết trình</td><td>—</td></tr>
    <tr><td>Final Exam</td><td>25%</td><td>Lý thuyết + áp dụng, 60 phút</td><td><b>≥ 4</b></td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">ĐỂ ĐẬU</span> Practical Exam ≥ 4 &nbsp;VÀ&nbsp; Final Exam ≥ 4 &nbsp;VÀ&nbsp; trung bình có trọng số ≥ 5</div>
<div class="callout warn"><strong>Practical Exam (85 phút)</strong> là nơi phần lớn sinh viên vấp: bạn phải code một endpoint chạy được có tính giờ — nối Mongoose, định nghĩa route, validate đầu vào, trả JSON. Không có điểm phần cho "em biết lý thuyết" nếu không có gì chạy.</div>
<div class="out"><b>Ví dụ có lời giải:</b> Sinh viên có Assignment 8, PT 7, Project 8, nhưng Practical Exam 3.5 và Final 6. Dù trung bình có trọng số trên 5, <b>cổng Practical &lt; 4 làm rớt</b>. Bài học: luyện xây endpoint thực hành, lặp đi lặp lại, trước PE.</div>
<div class="pitfall">Vắng quá 20% số buổi là bị cấm thi cuối kỳ hoàn toàn — điểm danh là cổng cứng, không phải mềm.</div>
</div>`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra (CLO)',
          slug: 'sdn302-chuan-dau-ra',
          type: 'VIDEO',
          description: '8 chuẩn đầu ra và cách chúng gắn vào các chương và bài thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Course learning outcomes (CLOs)</h2>
<p class="lead">Eight CLOs cover the full back-end stack. The Progress Tests map to specific CLOs (PT1: CLO1-5,8 · PT2: CLO6 · PT3: CLO7), so you know exactly what each test targets.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to…</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Understand Node, modules, APIs and the Node HTTP server</td><td>Ch1</td></tr>
    <tr><td>CLO2</td><td>Understand Express (and NestJS/Hono) and build a web server</td><td>Ch2 · Ch8</td></tr>
    <tr><td>CLO3</td><td>Use Express Generator to scaffold applications</td><td>Ch2</td></tr>
    <tr><td>CLO4</td><td>Understand MongoDB and build Node apps working with data</td><td>Ch3</td></tr>
    <tr><td>CLO5</td><td>Implement REST APIs with Express, MongoDB, Mongoose &amp; population</td><td>Ch4</td></tr>
    <tr><td>CLO6</td><td>Implement user authentication mechanisms</td><td>Ch5</td></tr>
    <tr><td>CLO7</td><td>Use Backend-as-a-Service (BaaS) for secure client–server communication</td><td>Ch6</td></tr>
    <tr><td>CLO8</td><td>Use EJS and Handlebars templating</td><td>Ch4</td></tr>
  </tbody>
</table>
<div class="callout">These are all "understand" and "implement" — meaning you must produce working code, not recite. Pair each CLO with the matching Code Lab track and build a tiny example until it is automatic.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Tám CLO bao trọn ngăn xếp back-end. Các Progress Test ánh xạ vào CLO cụ thể (PT1: CLO1-5,8 · PT2: CLO6 · PT3: CLO7), nên bạn biết chính xác mỗi test nhắm gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ có thể…</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Hiểu Node, module, API và Node HTTP server</td><td>Ch1</td></tr>
    <tr><td>CLO2</td><td>Hiểu Express (và NestJS/Hono) và xây web server</td><td>Ch2 · Ch8</td></tr>
    <tr><td>CLO3</td><td>Dùng Express Generator để tạo khung ứng dụng</td><td>Ch2</td></tr>
    <tr><td>CLO4</td><td>Hiểu MongoDB và xây app Node làm việc với dữ liệu</td><td>Ch3</td></tr>
    <tr><td>CLO5</td><td>Hiện thực REST API với Express, MongoDB, Mongoose &amp; population</td><td>Ch4</td></tr>
    <tr><td>CLO6</td><td>Hiện thực cơ chế xác thực người dùng</td><td>Ch5</td></tr>
    <tr><td>CLO7</td><td>Dùng Backend-as-a-Service (BaaS) cho giao tiếp client–server an toàn</td><td>Ch6</td></tr>
    <tr><td>CLO8</td><td>Dùng templating EJS và Handlebars</td><td>Ch4</td></tr>
  </tbody>
</table>
<div class="callout">Tất cả đều là "hiểu" và "hiện thực" — nghĩa là bạn phải tạo ra code chạy được, không đọc vẹt. Ghép mỗi CLO với track Code Lab tương ứng và xây một ví dụ nhỏ đến khi tự động.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & environment setup|||0.4 — Công cụ & cài đặt môi trường',
          slug: 'sdn302-cong-cu',
          type: 'VIDEO',
          description: 'Node.js LTS, VS Code, Postman, MongoDB Compass/Atlas — và cách kiểm tra đã cài đúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your back-end toolkit</h2>
<p class="lead">Five tools cover the whole course. Set them up once and every lesson runs smoothly.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Node.js LTS (20.x+)</b> — the runtime; ships with npm. Check with <code>node -v</code>.</div>
  <div class="lz-layer"><b>Visual Studio Code</b> — editor; add the ESLint + Prettier extensions.</div>
  <div class="lz-layer"><b>Postman</b> — send requests to your API without a front-end; save collections.</div>
  <div class="lz-layer"><b>MongoDB Compass + Atlas</b> — a GUI to view your data, and a free cloud MongoDB.</div>
  <div class="lz-layer"><b>Git + GitHub</b> — version control for assignments and the project.</div>
</div>
<div class="out"><b>Verify your setup in the terminal:</b>
<pre><span class="tok-comment"># Node should be 20.x or newer</span>
node -v
npm -v

<span class="tok-comment"># Create a project and install Express + Mongoose</span>
npm init -y
npm install express mongoose</pre></div>
<a class="link-card exphub" href="/exp-hub/sdn302-cai-dat-moi-truong?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up Node + MongoDB + Postman — step by step</span><span class="lc-sub">Install everything and connect to MongoDB Atlas, with links, on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Use <strong>MongoDB Atlas (free tier)</strong> instead of a local install if you can — it works from anywhere, mirrors production, and gives you a connection string you will reuse when you deploy.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ back-end của bạn</h2>
<p class="lead">Năm công cụ bao trọn môn học. Cài một lần và mọi bài chạy trơn tru.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Node.js LTS (20.x+)</b> — runtime; đi kèm npm. Kiểm bằng <code>node -v</code>.</div>
  <div class="lz-layer"><b>Visual Studio Code</b> — trình soạn; thêm extension ESLint + Prettier.</div>
  <div class="lz-layer"><b>Postman</b> — gửi request tới API mà không cần front-end; lưu collection.</div>
  <div class="lz-layer"><b>MongoDB Compass + Atlas</b> — GUI xem dữ liệu, và một MongoDB cloud miễn phí.</div>
  <div class="lz-layer"><b>Git + GitHub</b> — quản lý phiên bản cho assignment và project.</div>
</div>
<div class="out"><b>Kiểm tra cài đặt trong terminal:</b>
<pre><span class="tok-comment"># Node phai la 20.x tro len</span>
node -v
npm -v

<span class="tok-comment"># Tao mot project va cai Express + Mongoose</span>
npm init -y
npm install express mongoose</pre></div>
<a class="link-card exphub" href="/exp-hub/sdn302-cai-dat-moi-truong?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài Node + MongoDB + Postman — từng bước</span><span class="lc-sub">Cài mọi thứ và nối tới MongoDB Atlas, kèm link, trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Dùng <strong>MongoDB Atlas (bản miễn phí)</strong> thay vì cài local nếu được — nó chạy từ bất cứ đâu, giống production, và cho bạn một connection string bạn sẽ tái dùng khi triển khai.</div>
</div>`,
        },
        {
          title: '0.5 — Project topic bank & how to choose (mentor guide)|||0.5 — Ngân hàng đề tài project & cách chọn (mentor)',
          slug: 'sdn302-ngan-hang-de-tai',
          type: 'VIDEO',
          description: '12 đề tài API đã kiểm phạm vi cho project + rubric 6 phép thử chọn đề vừa sức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Choosing your project</h2>
<p class="lead">The Project (15%) asks for a full server-side application <strong>you choose</strong>. The best project is a focused REST API with 3–5 related resources, real relationships (for Mongoose population), and authentication — small enough to finish, rich enough to show every CLO.</p>
<h3>The 6-test rubric — score a project before committing</h3>
<table>
  <thead><tr><th>#</th><th>Test</th><th>Ask yourself</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Right size</td><td>3–5 resources (e.g., User, Product, Order)? Not 1, not 15.</td></tr>
    <tr><td>2</td><td>Real relationships</td><td>Do resources reference each other (for population)?</td></tr>
    <tr><td>3</td><td>Full CRUD</td><td>Can you demo create/read/update/delete on a resource?</td></tr>
    <tr><td>4</td><td>Needs auth</td><td>Is there a reason to log in (owner-only actions)?</td></tr>
    <tr><td>5</td><td>Has validation</td><td>Are there rules to enforce (unique email, price &gt; 0)?</td></tr>
    <tr><td>6</td><td>Demoable</td><td>Can you show it end-to-end in Postman + a small React page?</td></tr>
  </tbody>
</table>
<h3>Topic bank — 12 scope-checked APIs</h3>
<ol>
  <li>Blog API — users, posts, comments (population: comment → user &amp; post)</li>
  <li>To-do / task manager — users, projects, tasks with status</li>
  <li>E-commerce mini — users, products, orders, order items</li>
  <li>Movie review API — movies, reviews, users, ratings</li>
  <li>Bookstore — books, authors, categories, reviews</li>
  <li>Recipe sharing — users, recipes, ingredients, favourites</li>
  <li>Event booking — events, tickets, users, bookings</li>
  <li>Q&amp;A forum — questions, answers, votes, users</li>
  <li>Course catalog — courses, lessons, enrollments, users</li>
  <li>Expense tracker — users, wallets, transactions, categories</li>
  <li>Job board — companies, jobs, applications, candidates</li>
  <li>Fitness log — users, workouts, exercises, sets</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Design the data model before the routes.</b> Sketch your Mongoose schemas and their references first (User has many Posts; Comment references User and Post). Once the model is right, the routes almost write themselves — one resource → one router with GET/POST/PUT/DELETE. Model-first design prevents the messy rewrites that come from coding endpoints against a half-formed schema. The syllabus lists features; professionals start from the data.</div>
<div class="pitfall">Avoid a project with only ONE resource (e.g., "a notes API"). With no relationships you cannot demo Mongoose population (CLO5) — and population is a headline outcome the project must show.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn project của bạn</h2>
<p class="lead">Project (15%) yêu cầu một ứng dụng server-side đầy đủ <strong>bạn tự chọn</strong>. Project tốt nhất là một REST API tập trung với 3–5 tài nguyên liên quan, quan hệ thật (để Mongoose population), và xác thực — đủ nhỏ để hoàn thành, đủ giàu để thể hiện mọi CLO.</p>
<h3>Rubric 6 phép thử — chấm project trước khi cam kết</h3>
<table>
  <thead><tr><th>#</th><th>Phép thử</th><th>Tự hỏi</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Đúng cỡ</td><td>3–5 tài nguyên (vd User, Product, Order)? Không 1, không 15.</td></tr>
    <tr><td>2</td><td>Quan hệ thật</td><td>Các tài nguyên có tham chiếu nhau (để population) không?</td></tr>
    <tr><td>3</td><td>Đủ CRUD</td><td>Demo được create/read/update/delete trên một tài nguyên?</td></tr>
    <tr><td>4</td><td>Cần auth</td><td>Có lý do để đăng nhập (hành động chỉ chủ sở hữu) không?</td></tr>
    <tr><td>5</td><td>Có validation</td><td>Có luật để thực thi (email duy nhất, giá &gt; 0) không?</td></tr>
    <tr><td>6</td><td>Demo được</td><td>Show được end-to-end trong Postman + một trang React nhỏ?</td></tr>
  </tbody>
</table>
<h3>Ngân hàng đề tài — 12 API đã kiểm phạm vi</h3>
<ol>
  <li>Blog API — users, posts, comments (population: comment → user &amp; post)</li>
  <li>Quản lý công việc — users, projects, tasks có trạng thái</li>
  <li>E-commerce mini — users, products, orders, order items</li>
  <li>Đánh giá phim — movies, reviews, users, ratings</li>
  <li>Hiệu sách — books, authors, categories, reviews</li>
  <li>Chia sẻ công thức — users, recipes, ingredients, favourites</li>
  <li>Đặt vé sự kiện — events, tickets, users, bookings</li>
  <li>Diễn đàn hỏi đáp — questions, answers, votes, users</li>
  <li>Danh mục khoá học — courses, lessons, enrollments, users</li>
  <li>Theo dõi chi tiêu — users, wallets, transactions, categories</li>
  <li>Bảng việc làm — companies, jobs, applications, candidates</li>
  <li>Nhật ký tập luyện — users, workouts, exercises, sets</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thiết kế mô hình dữ liệu trước routes.</b> Phác các schema Mongoose và tham chiếu của chúng trước (User có nhiều Post; Comment tham chiếu User và Post). Khi mô hình đúng, routes gần như tự viết ra — một tài nguyên → một router với GET/POST/PUT/DELETE. Thiết kế model-first chặn những lần viết lại lộn xộn do code endpoint dựa trên schema nửa vời. Giáo trình liệt kê tính năng; người chuyên nghiệp bắt đầu từ dữ liệu.</div>
<div class="pitfall">Tránh project chỉ có MỘT tài nguyên (vd "một API ghi chú"). Không có quan hệ thì không demo được Mongoose population (CLO5) — mà population là một đầu ra tiêu điểm project phải thể hiện.</div>
</div>`,
        },
        {
          title: '0.6 — Why students lose marks & the formula for a high grade|||0.6 — Vì sao mất điểm & công thức điểm cao',
          slug: 'sdn302-chong-mat-diem',
          type: 'VIDEO',
          description: '7 kiểu mất điểm trong SDN302 + cờ xanh/đỏ + công thức điểm cao — kiểu SWP391.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Why students lose marks — and how to score high</h2>
<p class="lead">Because two components are hands-on and gated at ≥4, the same practical gaps sink students every term. Know them and the fix.</p>
<h3>The 7 ways to lose marks</h3>
<table>
  <thead><tr><th>#</th><th>Loss</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Not understanding async (callback/promise/await)</td><td>Every DB call is async — always <code>await</code> Mongoose or use .then; never read a result before it resolves.</td></tr>
    <tr><td>2</td><td>No input validation → crashes/500s</td><td>Validate body &amp; params; return 400 with a clear message, not a stack trace.</td></tr>
    <tr><td>3</td><td>Storing plain-text passwords</td><td>Always hash with bcrypt; never store or return the raw password.</td></tr>
    <tr><td>4</td><td>Wrong HTTP status codes</td><td>200 ok · 201 created · 400 bad request · 401 unauth · 404 not found · 500 server error.</td></tr>
    <tr><td>5</td><td>Fat controllers (all logic in the route)</td><td>Split into routes → controllers → services → models (MVC).</td></tr>
    <tr><td>6</td><td>Forgetting Mongoose population</td><td>Use <code>.populate()</code> to expand references — a headline CLO.</td></tr>
    <tr><td>7</td><td>Only reading, never running code</td><td>Practise the Practical Exam by building endpoints under a timer.</td></tr>
  </tbody>
</table>
<h3>Green flags vs red flags</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Green</b><span>async/await everywhere · validation + right status codes · bcrypt · MVC layers · populate · runs first try</span></div>
  <div class="kv"><b>🔴 Red</b><span>callback soup · unvalidated body · plain passwords · everything 200 · one giant route file</span></div>
</div>
<div class="formula"><span class="lbl">HIGH-GRADE FORMULA</span> Solid async + validated inputs with correct status codes + hashed auth + clean MVC + Mongoose population + repeated hands-on practice for the Practical Exam</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Build a personal "starter template" and memorise it.</b> Have a mental snippet for: connect Mongoose, a schema, a router with 5 CRUD routes, an error-handling middleware, and a bcrypt login. In the 85-minute Practical Exam, students who can type this skeleton from memory in 10 minutes then spend the rest on the actual task; those who look everything up run out of time. The syllabus teaches the pieces — a rehearsed starter is what makes them exam-fast.</div>
<div class="pitfall">A beautiful theory answer with code that does not run scores near zero on the practical half. In this course, <strong>"it works in Postman" beats "it looks right on paper"</strong> every time.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Vì sao sinh viên mất điểm — và cách điểm cao</h2>
<p class="lead">Vì hai thành phần là thực hành và có cổng ≥4, cùng những lỗ hổng thực hành làm rớt sinh viên mỗi kỳ. Biết chúng và cách sửa.</p>
<h3>7 kiểu mất điểm</h3>
<table>
  <thead><tr><th>#</th><th>Mất điểm</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Không hiểu bất đồng bộ (callback/promise/await)</td><td>Mọi call DB là async — luôn <code>await</code> Mongoose hoặc dùng .then; đừng đọc kết quả trước khi nó resolve.</td></tr>
    <tr><td>2</td><td>Không validate đầu vào → crash/500</td><td>Validate body &amp; params; trả 400 với thông báo rõ, không phải stack trace.</td></tr>
    <tr><td>3</td><td>Lưu mật khẩu dạng chữ thô</td><td>Luôn băm bằng bcrypt; đừng bao giờ lưu hay trả mật khẩu thô.</td></tr>
    <tr><td>4</td><td>Sai mã trạng thái HTTP</td><td>200 ok · 201 created · 400 bad request · 401 unauth · 404 not found · 500 server error.</td></tr>
    <tr><td>5</td><td>Controller béo (mọi logic trong route)</td><td>Chia thành routes → controllers → services → models (MVC).</td></tr>
    <tr><td>6</td><td>Quên Mongoose population</td><td>Dùng <code>.populate()</code> để mở rộng tham chiếu — một CLO tiêu điểm.</td></tr>
    <tr><td>7</td><td>Chỉ đọc, không chạy code</td><td>Luyện Practical Exam bằng cách xây endpoint có tính giờ.</td></tr>
  </tbody>
</table>
<h3>Cờ xanh vs cờ đỏ</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Xanh</b><span>async/await khắp nơi · validation + mã trạng thái đúng · bcrypt · phân lớp MVC · populate · chạy ngay lần đầu</span></div>
  <div class="kv"><b>🔴 Đỏ</b><span>rối callback · body không validate · mật khẩu thô · cái gì cũng 200 · một file route khổng lồ</span></div>
</div>
<div class="formula"><span class="lbl">CÔNG THỨC ĐIỂM CAO</span> Async vững + đầu vào validate với mã trạng thái đúng + auth băm + MVC sạch + Mongoose population + luyện thực hành lặp lại cho Practical Exam</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xây một "template khởi đầu" cá nhân và học thuộc.</b> Có sẵn trong đầu đoạn: nối Mongoose, một schema, một router với 5 route CRUD, một middleware xử lý lỗi, và một login bcrypt. Trong Practical Exam 85 phút, sinh viên gõ được bộ khung này từ trí nhớ trong 10 phút thì dành phần còn lại cho nhiệm vụ thật; ai tra cứu mọi thứ thì hết giờ. Giáo trình dạy các mảnh — một starter đã tập là thứ làm chúng nhanh trong phòng thi.</div>
<div class="pitfall">Một câu lý thuyết đẹp với code không chạy thì gần như 0 điểm ở phần thực hành. Trong môn này, <strong>"chạy được trong Postman" luôn thắng "trông đúng trên giấy"</strong>.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — NODE.JS FOUNDATIONS ══════════════════ */
    {
      title: 'Chapter 1 — Node.js foundations|||Chương 1 — Nền tảng Node.js',
      description: 'Mô hình event-driven & non-blocking, event loop, module & npm, và HTTP server thuần.',
      lessons: [
        {
          title: '1.1 — Node.js, the event loop & modules|||1.1 — Node.js, event loop & module',
          slug: 'sdn302-1-1-node-event-loop',
          type: 'VIDEO',
          description: 'Single-thread nhưng scalable, bất đồng bộ, event loop, module CommonJS/ESM và npm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Node.js: single-threaded, yet highly scalable</h2>
<p class="lead">Node runs JavaScript on the server using one main thread and an <strong>event loop</strong>. Instead of blocking while waiting for a file or database, it registers a callback and moves on — so one thread handles thousands of concurrent connections.</p>
<h3>Blocking vs non-blocking</h3>
<div class="out"><b>Blocking (bad on a server):</b>
<pre><span class="tok-keyword">const</span> data = fs.<span class="tok-function">readFileSync</span>(<span class="tok-string">'big.txt'</span>); <span class="tok-comment">// thread frozen here</span>
<span class="tok-function">doNext</span>();</pre>
<b>Non-blocking (the Node way):</b>
<pre>fs.<span class="tok-function">readFile</span>(<span class="tok-string">'big.txt'</span>, (err, data) =&gt; {
  <span class="tok-comment">// runs later, when the file is ready</span>
});
<span class="tok-function">doNext</span>(); <span class="tok-comment">// runs immediately, no waiting</span></pre>
<em>The non-blocking version lets the single thread do other work while the disk reads — that is why Node scales.</em></div>
<h3>The event loop, simplified</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Call stack</b><span>runs your synchronous code</span></div>
  <div class="lz-step"><b>Async op</b><span>I/O handed to the system, callback queued when done</span></div>
  <div class="lz-step"><b>Event loop</b><span>when the stack is empty, pushes queued callbacks to run</span></div>
</div>
<h3>Modules &amp; npm</h3>
<div class="out"><pre><span class="tok-comment">// CommonJS (classic Node)</span>
<span class="tok-keyword">const</span> express = <span class="tok-function">require</span>(<span class="tok-string">'express'</span>);
module.exports = myFunction;

<span class="tok-comment">// ES Modules (modern, "type":"module" in package.json)</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">export default</span> myFunction;</pre></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The microtask queue runs before timers.</b> Promises (and <code>await</code>) resolve on the <em>microtask</em> queue, which the event loop drains fully before the next <code>setTimeout</code> callback. That is why a resolved promise logs before a <code>setTimeout(…, 0)</code>. Understanding this ordering explains puzzling async bugs the syllabus never touches — and it is a favourite senior interview question.</div>
<div class="pitfall">Do not put CPU-heavy work (huge loops, image processing) on the main thread — it blocks the event loop and freezes every other request. Offload it to a worker thread or a separate service.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Node.js: đơn luồng, nhưng khả mở cao</h2>
<p class="lead">Node chạy JavaScript trên server bằng một luồng chính và một <strong>event loop</strong>. Thay vì chặn khi chờ một tệp hay database, nó đăng ký một callback và đi tiếp — nên một luồng xử lý hàng nghìn kết nối đồng thời.</p>
<h3>Chặn vs không chặn</h3>
<div class="out"><b>Chặn (tệ trên server):</b>
<pre><span class="tok-keyword">const</span> data = fs.<span class="tok-function">readFileSync</span>(<span class="tok-string">'big.txt'</span>); <span class="tok-comment">// luong dong bang o day</span>
<span class="tok-function">doNext</span>();</pre>
<b>Không chặn (cách của Node):</b>
<pre>fs.<span class="tok-function">readFile</span>(<span class="tok-string">'big.txt'</span>, (err, data) =&gt; {
  <span class="tok-comment">// chay sau, khi tep san sang</span>
});
<span class="tok-function">doNext</span>(); <span class="tok-comment">// chay ngay, khong cho</span></pre>
<em>Bản không chặn để luồng đơn làm việc khác trong khi đĩa đọc — đó là lý do Node khả mở.</em></div>
<h3>Event loop, đơn giản hoá</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Call stack</b><span>chạy code đồng bộ của bạn</span></div>
  <div class="lz-step"><b>Thao tác async</b><span>I/O giao cho hệ thống, callback vào hàng đợi khi xong</span></div>
  <div class="lz-step"><b>Event loop</b><span>khi stack rỗng, đẩy callback trong hàng đợi ra chạy</span></div>
</div>
<h3>Module &amp; npm</h3>
<div class="out"><pre><span class="tok-comment">// CommonJS (Node co dien)</span>
<span class="tok-keyword">const</span> express = <span class="tok-function">require</span>(<span class="tok-string">'express'</span>);
module.exports = myFunction;

<span class="tok-comment">// ES Modules (hien dai, "type":"module" trong package.json)</span>
<span class="tok-keyword">import</span> express <span class="tok-keyword">from</span> <span class="tok-string">'express'</span>;
<span class="tok-keyword">export default</span> myFunction;</pre></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hàng đợi microtask chạy trước timer.</b> Promise (và <code>await</code>) resolve trên hàng đợi <em>microtask</em>, mà event loop rút cạn hoàn toàn trước callback <code>setTimeout</code> tiếp theo. Đó là lý do một promise đã resolve log ra trước một <code>setTimeout(…, 0)</code>. Hiểu thứ tự này giải thích các bug async khó hiểu mà giáo trình không chạm — và là câu phỏng vấn senior ưa thích.</div>
<div class="pitfall">Đừng đặt việc nặng CPU (vòng lặp khổng lồ, xử lý ảnh) trên luồng chính — nó chặn event loop và đóng băng mọi request khác. Đẩy nó sang worker thread hoặc một service riêng.</div>
</div>`,
        },
        {
          title: '1.2 — APIs, HTTP & a first Node server|||1.2 — API, HTTP & server Node đầu tiên',
          slug: 'sdn302-1-2-http-server',
          type: 'VIDEO',
          description: 'API là gì, cách HTTP hoạt động, và dựng một web server bằng module http thuần.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>APIs, HTTP &amp; the Node HTTP server</h2>
<p class="lead">An <strong>API</strong> is a contract: a client sends a request to a URL with a method, the server does work and returns a response. HTTP is the protocol that carries it. Before Express, you build a server with Node's core <code>http</code> module to see what Express automates.</p>
<h3>Anatomy of an HTTP request/response</h3>
<table>
  <thead><tr><th>Part</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Method</td><td>GET · POST · PUT · PATCH · DELETE</td></tr>
    <tr><td>URL / path</td><td>/api/products/42</td></tr>
    <tr><td>Headers</td><td>Content-Type: application/json · Authorization: Bearer …</td></tr>
    <tr><td>Body</td><td>JSON payload (on POST/PUT)</td></tr>
    <tr><td>Status</td><td>200 · 201 · 400 · 401 · 404 · 500</td></tr>
  </tbody>
</table>
<h3>Worked example — a raw Node server</h3>
<div class="out"><pre><span class="tok-keyword">const</span> http = <span class="tok-function">require</span>(<span class="tok-string">'http'</span>);

<span class="tok-keyword">const</span> server = http.<span class="tok-function">createServer</span>((req, res) =&gt; {
  <span class="tok-keyword">if</span> (req.url === <span class="tok-string">'/api/hello'</span> &amp;&amp; req.method === <span class="tok-string">'GET'</span>) {
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> });
    res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>({ message: <span class="tok-string">'Hello Node'</span> }));
  } <span class="tok-keyword">else</span> {
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">404</span>);
    res.<span class="tok-function">end</span>(<span class="tok-string">'Not found'</span>);
  }
});

server.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>, () =&gt; <span class="tok-function">console</span>.log(<span class="tok-string">'Listening on 3000'</span>));</pre>
<em>Notice how much manual work this is: parsing the URL, matching the method, setting headers. Express turns all of this into <code>app.get('/api/hello', ...)</code>.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>REST maps HTTP methods to intentions.</b> GET reads (safe, no side effects), POST creates, PUT/PATCH updates, DELETE removes. Using the right method is not decoration — caches, proxies and browsers behave differently per method (a GET can be cached and prefetched; a POST cannot). Designing to this "uniform interface" is what makes an API predictable, a REST principle the raw server does not enforce for you.</div>
<div class="pitfall">A raw server does not parse JSON bodies for you — <code>req</code> streams raw chunks you must collect and <code>JSON.parse</code>. This is exactly the tedium Express middleware (<code>express.json()</code>) removes; know it exists so you understand what the middleware does.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>API, HTTP &amp; Node HTTP server</h2>
<p class="lead">Một <strong>API</strong> là một hợp đồng: client gửi request tới một URL với một method, server làm việc và trả một response. HTTP là giao thức chở nó. Trước Express, bạn dựng server bằng module lõi <code>http</code> của Node để thấy Express tự động hoá cái gì.</p>
<h3>Giải phẫu một request/response HTTP</h3>
<table>
  <thead><tr><th>Phần</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Method</td><td>GET · POST · PUT · PATCH · DELETE</td></tr>
    <tr><td>URL / path</td><td>/api/products/42</td></tr>
    <tr><td>Headers</td><td>Content-Type: application/json · Authorization: Bearer …</td></tr>
    <tr><td>Body</td><td>JSON payload (khi POST/PUT)</td></tr>
    <tr><td>Status</td><td>200 · 201 · 400 · 401 · 404 · 500</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — một server Node thuần</h3>
<div class="out"><pre><span class="tok-keyword">const</span> http = <span class="tok-function">require</span>(<span class="tok-string">'http'</span>);

<span class="tok-keyword">const</span> server = http.<span class="tok-function">createServer</span>((req, res) =&gt; {
  <span class="tok-keyword">if</span> (req.url === <span class="tok-string">'/api/hello'</span> &amp;&amp; req.method === <span class="tok-string">'GET'</span>) {
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">200</span>, { <span class="tok-string">'Content-Type'</span>: <span class="tok-string">'application/json'</span> });
    res.<span class="tok-function">end</span>(JSON.<span class="tok-function">stringify</span>({ message: <span class="tok-string">'Hello Node'</span> }));
  } <span class="tok-keyword">else</span> {
    res.<span class="tok-function">writeHead</span>(<span class="tok-number">404</span>);
    res.<span class="tok-function">end</span>(<span class="tok-string">'Not found'</span>);
  }
});

server.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>, () =&gt; <span class="tok-function">console</span>.log(<span class="tok-string">'Listening on 3000'</span>));</pre>
<em>Để ý phải làm thủ công bao nhiêu: phân tích URL, khớp method, đặt header. Express biến tất cả thành <code>app.get('/api/hello', ...)</code>.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>REST ánh xạ method HTTP với ý định.</b> GET đọc (an toàn, không tác dụng phụ), POST tạo, PUT/PATCH cập nhật, DELETE xoá. Dùng đúng method không phải trang trí — cache, proxy và trình duyệt hành xử khác nhau theo method (một GET có thể được cache và prefetch; một POST thì không). Thiết kế theo "giao diện đồng nhất" này là điều làm API dễ đoán, một nguyên tắc REST mà server thuần không tự thực thi cho bạn.</div>
<div class="pitfall">Server thuần không tự phân tích JSON body — <code>req</code> stream các chunk thô mà bạn phải gom lại và <code>JSON.parse</code>. Đây chính là sự nhọc nhằn mà middleware Express (<code>express.json()</code>) loại bỏ; biết nó tồn tại để hiểu middleware làm gì.</div>
</div>`,
        },
        {
          title: 'Quiz 1 — Node.js foundations|||Quiz 1 — Nền tảng Node.js',
          slug: 'sdn302-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra event loop, async, module và HTTP.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Node.js handles many concurrent connections using…|||Node.js xử lý nhiều kết nối đồng thời bằng…', options: ['one thread per connection|||một luồng mỗi kết nối', 'a single thread with an event loop|||một luồng đơn với event loop', 'multiple processes only|||chỉ nhiều tiến trình', 'blocking I/O|||I/O chặn'], correctIndex: 1, points: 1 },
              { question: 'Which call is non-blocking?|||Lệnh nào không chặn?', options: ['fs.readFileSync()', 'fs.readFile(path, callback)', 'a huge for-loop', 'JSON.parse of a 1GB string'], correctIndex: 1, points: 1 },
              { question: 'In CommonJS, you import a module with…|||Trong CommonJS, bạn import một module bằng…', options: ['import x from "y"', 'require("y")', 'include "y"', 'using y'], correctIndex: 1, points: 1 },
              { question: 'Which HTTP method should READ a resource without side effects?|||Method HTTP nào nên ĐỌC một tài nguyên không tác dụng phụ?', options: ['POST', 'GET', 'DELETE', 'PUT'], correctIndex: 1, points: 1 },
              { question: 'Putting a huge CPU-bound loop on the main thread will…|||Đặt một vòng lặp nặng CPU trên luồng chính sẽ…', options: ['speed up the server|||tăng tốc server', 'block the event loop and freeze other requests|||chặn event loop và đóng băng request khác', 'have no effect|||không ảnh hưởng', 'create new threads automatically|||tự tạo luồng mới'], correctIndex: 1, points: 1 },
              { question: 'A resolved Promise callback runs before a setTimeout(…,0) because promises use the… (beyond-syllabus)|||Callback của một Promise đã resolve chạy trước setTimeout(…,0) vì promise dùng… (ngoài giáo trình)', options: ['timer queue|||hàng đợi timer', 'microtask queue|||hàng đợi microtask', 'call stack directly|||call stack trực tiếp', 'a separate thread|||một luồng riêng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — EXPRESS ══════════════════ */
    {
      title: 'Chapter 2 — Express: routing & middleware|||Chương 2 — Express: routing & middleware',
      description: 'Tạo web server Express, định tuyến RESTful, chuỗi middleware (built-in/third-party/custom/error), và Express Generator.',
      lessons: [
        {
          title: '2.1 — Express routing & your first app|||2.1 — Express routing & app đầu tiên',
          slug: 'sdn302-2-1-express-routing',
          type: 'VIDEO',
          description: 'Cài Express, tạo route theo method, route params, và Express Generator scaffold.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Express: routing made simple</h2>
<p class="lead">Express is a thin, fast framework over Node's HTTP module. It replaces manual URL/method matching with clean route handlers and gives you middleware — the two ideas that make server code readable.</p>
<h3>Your first Express app</h3>
<div class="out"><pre><span class="tok-keyword">const</span> express = <span class="tok-function">require</span>(<span class="tok-string">'express'</span>);
<span class="tok-keyword">const</span> app = <span class="tok-function">express</span>();
app.<span class="tok-function">use</span>(express.<span class="tok-function">json</span>()); <span class="tok-comment">// parse JSON bodies for us</span>

app.<span class="tok-function">get</span>(<span class="tok-string">'/api/products'</span>, (req, res) =&gt; {
  res.<span class="tok-function">json</span>([{ id: <span class="tok-number">1</span>, name: <span class="tok-string">'Book'</span> }]);
});

app.<span class="tok-function">get</span>(<span class="tok-string">'/api/products/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> id = req.params.id; <span class="tok-comment">// route param</span>
  res.<span class="tok-function">json</span>({ id, name: <span class="tok-string">'Book'</span> });
});

app.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>);</pre>
<em>Compare to the raw server: no URL parsing, no manual headers — <code>res.json()</code> sets Content-Type and serialises for you.</em></div>
<h3>Organise with Router</h3>
<div class="out"><pre><span class="tok-comment">// routes/products.js</span>
<span class="tok-keyword">const</span> router = express.<span class="tok-function">Router</span>();
router.<span class="tok-function">get</span>(<span class="tok-string">'/'</span>, getAll);
router.<span class="tok-function">post</span>(<span class="tok-string">'/'</span>, create);
router.<span class="tok-function">put</span>(<span class="tok-string">'/:id'</span>, update);
router.<span class="tok-function">delete</span>(<span class="tok-string">'/:id'</span>, remove);
module.exports = router;

<span class="tok-comment">// app.js</span>
app.<span class="tok-function">use</span>(<span class="tok-string">'/api/products'</span>, <span class="tok-function">require</span>(<span class="tok-string">'./routes/products'</span>));</pre></div>
<h3>Express Generator (CLO3)</h3>
<div class="out"><pre><span class="tok-comment"># Scaffold a full Express app skeleton</span>
npx express-generator --view=ejs myapp
cd myapp &amp;&amp; npm install &amp;&amp; npm start</pre></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Mount routers per resource, not per verb.</b> One router file per resource (<code>products</code>, <code>users</code>, <code>orders</code>), each with its five CRUD routes, keeps a growing API navigable — you always know which file owns a URL. This "resource router" convention scales to dozens of endpoints without a 1,000-line app.js. The generator hints at it; disciplined teams enforce it.</div>
<div class="pitfall">Forgetting <code>app.use(express.json())</code> means <code>req.body</code> is <code>undefined</code> on POST/PUT — a classic "why is my body empty?" bug. Add the JSON parser before your routes.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Express: định tuyến đơn giản</h2>
<p class="lead">Express là một framework mỏng, nhanh trên module HTTP của Node. Nó thay việc khớp URL/method thủ công bằng các route handler sạch và cho bạn middleware — hai ý tưởng làm code server dễ đọc.</p>
<h3>App Express đầu tiên</h3>
<div class="out"><pre><span class="tok-keyword">const</span> express = <span class="tok-function">require</span>(<span class="tok-string">'express'</span>);
<span class="tok-keyword">const</span> app = <span class="tok-function">express</span>();
app.<span class="tok-function">use</span>(express.<span class="tok-function">json</span>()); <span class="tok-comment">// tu parse JSON body cho ta</span>

app.<span class="tok-function">get</span>(<span class="tok-string">'/api/products'</span>, (req, res) =&gt; {
  res.<span class="tok-function">json</span>([{ id: <span class="tok-number">1</span>, name: <span class="tok-string">'Book'</span> }]);
});

app.<span class="tok-function">get</span>(<span class="tok-string">'/api/products/:id'</span>, (req, res) =&gt; {
  <span class="tok-keyword">const</span> id = req.params.id; <span class="tok-comment">// route param</span>
  res.<span class="tok-function">json</span>({ id, name: <span class="tok-string">'Book'</span> });
});

app.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>);</pre>
<em>So với server thuần: không phân tích URL, không header thủ công — <code>res.json()</code> đặt Content-Type và serialise cho bạn.</em></div>
<h3>Tổ chức với Router</h3>
<div class="out"><pre><span class="tok-comment">// routes/products.js</span>
<span class="tok-keyword">const</span> router = express.<span class="tok-function">Router</span>();
router.<span class="tok-function">get</span>(<span class="tok-string">'/'</span>, getAll);
router.<span class="tok-function">post</span>(<span class="tok-string">'/'</span>, create);
router.<span class="tok-function">put</span>(<span class="tok-string">'/:id'</span>, update);
router.<span class="tok-function">delete</span>(<span class="tok-string">'/:id'</span>, remove);
module.exports = router;

<span class="tok-comment">// app.js</span>
app.<span class="tok-function">use</span>(<span class="tok-string">'/api/products'</span>, <span class="tok-function">require</span>(<span class="tok-string">'./routes/products'</span>));</pre></div>
<h3>Express Generator (CLO3)</h3>
<div class="out"><pre><span class="tok-comment"># Tao khung mot app Express day du</span>
npx express-generator --view=ejs myapp
cd myapp &amp;&amp; npm install &amp;&amp; npm start</pre></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Gắn router theo tài nguyên, không theo động từ.</b> Một file router mỗi tài nguyên (<code>products</code>, <code>users</code>, <code>orders</code>), mỗi cái năm route CRUD, giữ một API lớn dần vẫn dễ điều hướng — bạn luôn biết file nào sở hữu một URL. Quy ước "resource router" này khả mở tới hàng chục endpoint mà không cần một app.js 1.000 dòng. Generator gợi ý điều đó; nhóm kỷ luật thực thi nó.</div>
<div class="pitfall">Quên <code>app.use(express.json())</code> nghĩa là <code>req.body</code> bị <code>undefined</code> khi POST/PUT — một bug kinh điển "sao body của em rỗng?". Thêm JSON parser trước các route.</div>
</div>`,
        },
        {
          title: '2.2 — Middleware: the heart of Express|||2.2 — Middleware: trái tim của Express',
          slug: 'sdn302-2-2-middleware',
          type: 'VIDEO',
          description: 'Chuỗi middleware, next(), các loại (built-in/third-party/custom/error-handling), và thứ tự.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Middleware — functions in a chain</h2>
<p class="lead">A middleware is a function <code>(req, res, next)</code> that runs on the way to your route. Each can inspect or modify the request, then call <code>next()</code> to pass control on — or end the response. This chain is how Express does logging, parsing, auth, and errors.</p>
<h3>Four kinds of middleware</h3>
<table>
  <thead><tr><th>Kind</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Built-in</td><td><code>express.json()</code>, <code>express.static()</code></td></tr>
    <tr><td>Third-party</td><td><code>cors()</code>, <code>morgan()</code>, <code>helmet()</code></td></tr>
    <tr><td>Custom</td><td>your own auth check, logger</td></tr>
    <tr><td>Error-handling</td><td><code>(err, req, res, next)</code> — four args</td></tr>
  </tbody>
</table>
<h3>Worked example — a custom logger and an error handler</h3>
<div class="out"><pre><span class="tok-comment">// custom middleware — runs for every request</span>
app.<span class="tok-function">use</span>((req, res, next) =&gt; {
  <span class="tok-function">console</span>.log(<span class="tok-string">&#96;\${req.method} \${req.url}&#96;</span>);
  <span class="tok-function">next</span>(); <span class="tok-comment">// pass control to the next middleware/route</span>
});

<span class="tok-comment">// a protected route using auth middleware</span>
app.<span class="tok-function">get</span>(<span class="tok-string">'/api/me'</span>, requireAuth, (req, res) =&gt; {
  res.<span class="tok-function">json</span>(req.user);
});

<span class="tok-comment">// error handler — MUST have 4 args, and go LAST</span>
app.<span class="tok-function">use</span>((err, req, res, next) =&gt; {
  <span class="tok-function">console</span>.error(err);
  res.<span class="tok-function">status</span>(err.status || <span class="tok-number">500</span>).<span class="tok-function">json</span>({ error: err.message });
});</pre>
<em>Note the template literal uses <code>&#96;...&#96;</code> and <code>\${...}</code> — that is Express reading <code>req.method</code> and <code>req.url</code>.</em></div>
<h3>Order matters</h3>
<div class="callout ok">Middleware runs top to bottom. Put <code>express.json()</code> and <code>cors()</code> <em>before</em> routes, and the error handler <em>after</em> all routes. A misplaced middleware silently does nothing (e.g., a body parser after the route that needs the body).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Wrap async handlers to forward errors.</b> An async route that throws will not reach your error handler unless you <code>next(err)</code> — a rejected promise is not caught by Express automatically (pre-v5). The pro fix is a tiny wrapper: <code>const wrap = fn =&gt; (req,res,next) =&gt; fn(req,res,next).catch(next);</code>. This one helper eliminates a whole class of "my error handler never runs" bugs the syllabus does not warn about.</div>
<div class="pitfall">An error-handling middleware MUST declare all four parameters <code>(err, req, res, next)</code> — Express detects error handlers by their arity. Drop the <code>err</code> and it silently becomes a normal middleware that never catches errors.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Middleware — các hàm trong một chuỗi</h2>
<p class="lead">Một middleware là hàm <code>(req, res, next)</code> chạy trên đường tới route của bạn. Mỗi cái có thể xem hoặc sửa request, rồi gọi <code>next()</code> để chuyển quyền đi tiếp — hoặc kết thúc response. Chuỗi này là cách Express làm logging, parsing, auth, và lỗi.</p>
<h3>Bốn loại middleware</h3>
<table>
  <thead><tr><th>Loại</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Built-in</td><td><code>express.json()</code>, <code>express.static()</code></td></tr>
    <tr><td>Third-party</td><td><code>cors()</code>, <code>morgan()</code>, <code>helmet()</code></td></tr>
    <tr><td>Custom</td><td>hàm auth check, logger của bạn</td></tr>
    <tr><td>Xử lý lỗi</td><td><code>(err, req, res, next)</code> — bốn tham số</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — logger tự viết và một error handler</h3>
<div class="out"><pre><span class="tok-comment">// middleware tu viet — chay cho moi request</span>
app.<span class="tok-function">use</span>((req, res, next) =&gt; {
  <span class="tok-function">console</span>.log(<span class="tok-string">&#96;\${req.method} \${req.url}&#96;</span>);
  <span class="tok-function">next</span>(); <span class="tok-comment">// chuyen quyen toi middleware/route ke tiep</span>
});

<span class="tok-comment">// mot route duoc bao ve dung auth middleware</span>
app.<span class="tok-function">get</span>(<span class="tok-string">'/api/me'</span>, requireAuth, (req, res) =&gt; {
  res.<span class="tok-function">json</span>(req.user);
});

<span class="tok-comment">// error handler — PHAI co 4 tham so, va dat CUOI</span>
app.<span class="tok-function">use</span>((err, req, res, next) =&gt; {
  <span class="tok-function">console</span>.error(err);
  res.<span class="tok-function">status</span>(err.status || <span class="tok-number">500</span>).<span class="tok-function">json</span>({ error: err.message });
});</pre>
<em>Để ý template literal dùng <code>&#96;...&#96;</code> và <code>\${...}</code> — đó là Express đọc <code>req.method</code> và <code>req.url</code>.</em></div>
<h3>Thứ tự quan trọng</h3>
<div class="callout ok">Middleware chạy từ trên xuống. Đặt <code>express.json()</code> và <code>cors()</code> <em>trước</em> các route, và error handler <em>sau</em> mọi route. Một middleware đặt sai chỗ âm thầm không làm gì (vd body parser đặt sau route cần body).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bọc async handler để chuyển lỗi.</b> Một route async ném lỗi sẽ không tới error handler trừ khi bạn <code>next(err)</code> — một promise bị reject không được Express bắt tự động (trước v5). Cách pro là một wrapper nhỏ: <code>const wrap = fn =&gt; (req,res,next) =&gt; fn(req,res,next).catch(next);</code>. Helper này loại bỏ cả một lớp bug "error handler của em không bao giờ chạy" mà giáo trình không cảnh báo.</div>
<div class="pitfall">Một middleware xử lý lỗi PHẢI khai đủ bốn tham số <code>(err, req, res, next)</code> — Express nhận diện error handler qua số tham số. Bỏ <code>err</code> là nó âm thầm thành middleware thường, không bao giờ bắt lỗi.</div>
</div>`,
        },
        {
          title: 'Quiz 2 — Express & middleware|||Quiz 2 — Express & middleware',
          slug: 'sdn302-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra routing, router, middleware và thứ tự.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'To read a JSON request body in Express you must add…|||Để đọc JSON body trong Express bạn phải thêm…', options: ['app.use(express.json())', 'app.use(express.text())', 'nothing, it is automatic', 'res.json()'], correctIndex: 0, points: 1 },
              { question: 'A route param in "/api/products/:id" is read via…|||Một route param trong "/api/products/:id" đọc qua…', options: ['req.body.id', 'req.query.id', 'req.params.id', 'req.id'], correctIndex: 2, points: 1 },
              { question: 'A middleware passes control to the next one by calling…|||Một middleware chuyển quyền tới cái kế tiếp bằng cách gọi…', options: ['return', 'next()', 'res.end()', 'continue'], correctIndex: 1, points: 1 },
              { question: 'An Express error-handling middleware is recognised because it has…|||Một middleware xử lý lỗi Express được nhận diện vì nó có…', options: ['two parameters', 'three parameters', 'four parameters (err, req, res, next)', 'no parameters'], correctIndex: 2, points: 1 },
              { question: 'Placing express.json() AFTER the route that needs req.body will…|||Đặt express.json() SAU route cần req.body sẽ…', options: ['still work fine|||vẫn chạy tốt', 'leave req.body undefined for that route|||để req.body undefined cho route đó', 'crash Node|||làm sập Node', 'double-parse the body|||parse body hai lần'], correctIndex: 1, points: 1 },
              { question: 'An async route handler that throws will NOT reach the error handler unless you… (beyond-syllabus)|||Một async route ném lỗi sẽ KHÔNG tới error handler trừ khi bạn… (ngoài giáo trình)', options: ['use var instead of const|||dùng var thay const', 'catch and call next(err)|||catch và gọi next(err)', 'add more routes|||thêm route', 'remove express.json()|||bỏ express.json()'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — MONGODB & MONGOOSE ══════════════════ */
    {
      title: 'Chapter 3 — MongoDB & Mongoose|||Chương 3 — MongoDB & Mongoose',
      description: 'NoSQL & document model, CRUD với MongoDB, và Mongoose (schema, model, validation, population).',
      lessons: [
        {
          title: '3.1 — NoSQL, MongoDB & CRUD|||3.1 — NoSQL, MongoDB & CRUD',
          slug: 'sdn302-3-1-mongodb-crud',
          type: 'VIDEO',
          description: 'Mô hình tài liệu vs bảng quan hệ, collection/document, và bốn thao tác CRUD.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>NoSQL &amp; the document model</h2>
<p class="lead">MongoDB stores data as flexible <strong>documents</strong> (JSON-like) grouped in <strong>collections</strong>, instead of rows in tables. There is no fixed schema at the database level, which suits fast-changing app data.</p>
<h3>Relational vs document — the mental switch</h3>
<table>
  <thead><tr><th>Relational (SQL)</th><th>MongoDB</th></tr></thead>
  <tbody>
    <tr><td>Table</td><td>Collection</td></tr>
    <tr><td>Row</td><td>Document</td></tr>
    <tr><td>Column</td><td>Field</td></tr>
    <tr><td>JOIN across tables</td><td>Embed sub-documents OR reference + populate</td></tr>
  </tbody>
</table>
<h3>A document</h3>
<div class="out"><pre>{
  <span class="tok-string">"_id"</span>: <span class="tok-string">"665f..."</span>,
  <span class="tok-string">"name"</span>: <span class="tok-string">"Clean Code"</span>,
  <span class="tok-string">"price"</span>: <span class="tok-number">25</span>,
  <span class="tok-string">"tags"</span>: [<span class="tok-string">"tech"</span>, <span class="tok-string">"programming"</span>],
  <span class="tok-string">"author"</span>: { <span class="tok-string">"name"</span>: <span class="tok-string">"Martin"</span> }
}</pre>
<em>Arrays and nested objects live directly inside a document — no join needed to read them.</em></div>
<h3>The four CRUD operations (mongo shell)</h3>
<div class="out"><pre><span class="tok-comment">// Create</span>
db.products.<span class="tok-function">insertOne</span>({ name: <span class="tok-string">'Book'</span>, price: <span class="tok-number">25</span> });
<span class="tok-comment">// Read</span>
db.products.<span class="tok-function">find</span>({ price: { $gt: <span class="tok-number">20</span> } });
<span class="tok-comment">// Update</span>
db.products.<span class="tok-function">updateOne</span>({ name: <span class="tok-string">'Book'</span> }, { $set: { price: <span class="tok-number">30</span> } });
<span class="tok-comment">// Delete</span>
db.products.<span class="tok-function">deleteOne</span>({ name: <span class="tok-string">'Book'</span> });</pre></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Embed vs reference is the key modelling decision.</b> Embed data you always read together and that does not grow unbounded (a product's few tags). Reference data that is shared or grows without limit (a user's thousands of orders). The rule: "data that is read together, stored together". Getting this right avoids both huge documents and needless populate calls — a modelling judgement the syllabus leaves you to learn by pain.</div>
<div class="pitfall">MongoDB will happily insert a document with a typo'd field or wrong type — there is no database-level schema. That flexibility is a trap; without Mongoose validation, your collection silently fills with inconsistent data.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>NoSQL &amp; mô hình tài liệu</h2>
<p class="lead">MongoDB lưu dữ liệu dạng <strong>tài liệu (document)</strong> linh hoạt (giống JSON) gom trong các <strong>collection</strong>, thay vì hàng trong bảng. Không có schema cố định ở mức database, hợp với dữ liệu app thay đổi nhanh.</p>
<h3>Quan hệ vs tài liệu — cú chuyển tư duy</h3>
<table>
  <thead><tr><th>Quan hệ (SQL)</th><th>MongoDB</th></tr></thead>
  <tbody>
    <tr><td>Table (bảng)</td><td>Collection</td></tr>
    <tr><td>Row (hàng)</td><td>Document</td></tr>
    <tr><td>Column (cột)</td><td>Field</td></tr>
    <tr><td>JOIN nhiều bảng</td><td>Nhúng sub-document HOẶC tham chiếu + populate</td></tr>
  </tbody>
</table>
<h3>Một document</h3>
<div class="out"><pre>{
  <span class="tok-string">"_id"</span>: <span class="tok-string">"665f..."</span>,
  <span class="tok-string">"name"</span>: <span class="tok-string">"Clean Code"</span>,
  <span class="tok-string">"price"</span>: <span class="tok-number">25</span>,
  <span class="tok-string">"tags"</span>: [<span class="tok-string">"tech"</span>, <span class="tok-string">"programming"</span>],
  <span class="tok-string">"author"</span>: { <span class="tok-string">"name"</span>: <span class="tok-string">"Martin"</span> }
}</pre>
<em>Mảng và object lồng nằm ngay trong document — không cần join để đọc chúng.</em></div>
<h3>Bốn thao tác CRUD (mongo shell)</h3>
<div class="out"><pre><span class="tok-comment">// Create (tao)</span>
db.products.<span class="tok-function">insertOne</span>({ name: <span class="tok-string">'Book'</span>, price: <span class="tok-number">25</span> });
<span class="tok-comment">// Read (doc)</span>
db.products.<span class="tok-function">find</span>({ price: { $gt: <span class="tok-number">20</span> } });
<span class="tok-comment">// Update (cap nhat)</span>
db.products.<span class="tok-function">updateOne</span>({ name: <span class="tok-string">'Book'</span> }, { $set: { price: <span class="tok-number">30</span> } });
<span class="tok-comment">// Delete (xoa)</span>
db.products.<span class="tok-function">deleteOne</span>({ name: <span class="tok-string">'Book'</span> });</pre></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nhúng vs tham chiếu là quyết định mô hình then chốt.</b> Nhúng dữ liệu luôn đọc cùng nhau và không phình vô hạn (vài tag của một sản phẩm). Tham chiếu dữ liệu dùng chung hoặc phình không giới hạn (hàng nghìn order của một user). Quy tắc: "dữ liệu đọc cùng nhau, lưu cùng nhau". Làm đúng điều này tránh cả document khổng lồ lẫn populate thừa — một phán đoán mô hình mà giáo trình để bạn học bằng đau thương.</div>
<div class="pitfall">MongoDB sẵn lòng chèn một document có field gõ sai hay sai kiểu — không có schema ở mức database. Sự linh hoạt đó là cái bẫy; không có Mongoose validation, collection của bạn âm thầm đầy dữ liệu không nhất quán.</div>
</div>`,
        },
        {
          title: '3.2 — Mongoose: schemas, models & population|||3.2 — Mongoose: schema, model & population',
          slug: 'sdn302-3-2-mongoose',
          type: 'VIDEO',
          description: 'Định nghĩa schema có validation, tạo model, quan hệ ref, và .populate() để mở rộng tham chiếu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Mongoose: structure over flexible data</h2>
<p class="lead">Mongoose is an ODM (Object Data Modeling) library that adds a <strong>schema, validation, and relationships</strong> on top of MongoDB — giving your flexible documents the safety of a defined shape. This is CLO5.</p>
<h3>Schema &amp; model</h3>
<div class="out"><pre><span class="tok-keyword">const</span> mongoose = <span class="tok-function">require</span>(<span class="tok-string">'mongoose'</span>);

<span class="tok-keyword">const</span> productSchema = <span class="tok-keyword">new</span> mongoose.<span class="tok-function">Schema</span>({
  name:  { type: String, required: <span class="tok-keyword">true</span> },
  price: { type: Number, required: <span class="tok-keyword">true</span>, min: <span class="tok-number">0</span> },
  author: { type: mongoose.Schema.Types.ObjectId, ref: <span class="tok-string">'User'</span> }
}, { timestamps: <span class="tok-keyword">true</span> });

<span class="tok-keyword">const</span> Product = mongoose.<span class="tok-function">model</span>(<span class="tok-string">'Product'</span>, productSchema);</pre>
<em>The <code>required</code>, <code>min</code> rules run automatically on save — invalid data is rejected before it hits MongoDB.</em></div>
<h3>Async CRUD with Mongoose</h3>
<div class="out"><pre><span class="tok-comment">// always await — DB calls are asynchronous</span>
<span class="tok-keyword">const</span> p = <span class="tok-keyword">await</span> Product.<span class="tok-function">create</span>({ name: <span class="tok-string">'Book'</span>, price: <span class="tok-number">25</span> });
<span class="tok-keyword">const</span> all = <span class="tok-keyword">await</span> Product.<span class="tok-function">find</span>({ price: { $gte: <span class="tok-number">20</span> } });
<span class="tok-keyword">await</span> Product.<span class="tok-function">findByIdAndUpdate</span>(id, { price: <span class="tok-number">30</span> });
<span class="tok-keyword">await</span> Product.<span class="tok-function">findByIdAndDelete</span>(id);</pre></div>
<h3>Population — Mongoose's answer to JOIN (CLO5)</h3>
<div class="out"><pre><span class="tok-comment">// author is stored as an ObjectId reference;</span>
<span class="tok-comment">// populate() replaces it with the full User document</span>
<span class="tok-keyword">const</span> product = <span class="tok-keyword">await</span> Product.<span class="tok-function">findById</span>(id).<span class="tok-function">populate</span>(<span class="tok-string">'author'</span>);
<span class="tok-comment">// product.author is now { _id, name, email } not just an id</span></pre>
<em>Populate cross-references documents — e.g., fill each comment with its user's info on query. This is a headline outcome the Project must demonstrate.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Select fields to avoid over-fetching and leaking data.</b> <code>.populate('author', 'name')</code> returns only the author's name — never the password hash. And <code>.select('-password')</code> on a user query excludes sensitive fields by default. Deciding exactly which fields cross the wire is both a performance and a security habit that the basic "use populate" instruction skips.</div>
<div class="pitfall">Reading a Mongoose result before <code>await</code> gives you a pending Promise, not data. <code>const p = Product.find()</code> then <code>p.length</code> is a bug — you must <code>await Product.find()</code> first.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mongoose: cấu trúc cho dữ liệu linh hoạt</h2>
<p class="lead">Mongoose là một thư viện ODM (Object Data Modeling) thêm <strong>schema, validation, và quan hệ</strong> lên trên MongoDB — cho document linh hoạt của bạn sự an toàn của một hình dạng đã định. Đây là CLO5.</p>
<h3>Schema &amp; model</h3>
<div class="out"><pre><span class="tok-keyword">const</span> mongoose = <span class="tok-function">require</span>(<span class="tok-string">'mongoose'</span>);

<span class="tok-keyword">const</span> productSchema = <span class="tok-keyword">new</span> mongoose.<span class="tok-function">Schema</span>({
  name:  { type: String, required: <span class="tok-keyword">true</span> },
  price: { type: Number, required: <span class="tok-keyword">true</span>, min: <span class="tok-number">0</span> },
  author: { type: mongoose.Schema.Types.ObjectId, ref: <span class="tok-string">'User'</span> }
}, { timestamps: <span class="tok-keyword">true</span> });

<span class="tok-keyword">const</span> Product = mongoose.<span class="tok-function">model</span>(<span class="tok-string">'Product'</span>, productSchema);</pre>
<em>Các luật <code>required</code>, <code>min</code> chạy tự động khi save — dữ liệu sai bị từ chối trước khi tới MongoDB.</em></div>
<h3>CRUD bất đồng bộ với Mongoose</h3>
<div class="out"><pre><span class="tok-comment">// luon await — call DB la bat dong bo</span>
<span class="tok-keyword">const</span> p = <span class="tok-keyword">await</span> Product.<span class="tok-function">create</span>({ name: <span class="tok-string">'Book'</span>, price: <span class="tok-number">25</span> });
<span class="tok-keyword">const</span> all = <span class="tok-keyword">await</span> Product.<span class="tok-function">find</span>({ price: { $gte: <span class="tok-number">20</span> } });
<span class="tok-keyword">await</span> Product.<span class="tok-function">findByIdAndUpdate</span>(id, { price: <span class="tok-number">30</span> });
<span class="tok-keyword">await</span> Product.<span class="tok-function">findByIdAndDelete</span>(id);</pre></div>
<h3>Population — câu trả lời của Mongoose cho JOIN (CLO5)</h3>
<div class="out"><pre><span class="tok-comment">// author luu duoi dang tham chieu ObjectId;</span>
<span class="tok-comment">// populate() thay no bang document User day du</span>
<span class="tok-keyword">const</span> product = <span class="tok-keyword">await</span> Product.<span class="tok-function">findById</span>(id).<span class="tok-function">populate</span>(<span class="tok-string">'author'</span>);
<span class="tok-comment">// product.author gio la { _id, name, email } khong chi la id</span></pre>
<em>Populate liên kết chéo các document — vd điền mỗi comment với info user của nó khi truy vấn. Đây là đầu ra tiêu điểm Project phải thể hiện.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chọn field để tránh over-fetch và rò rỉ dữ liệu.</b> <code>.populate('author', 'name')</code> chỉ trả tên tác giả — không bao giờ trả password hash. Và <code>.select('-password')</code> trên truy vấn user loại field nhạy cảm mặc định. Quyết định chính xác field nào đi qua dây là thói quen cả về hiệu năng lẫn bảo mật mà chỉ dẫn "dùng populate" cơ bản bỏ qua.</div>
<div class="pitfall">Đọc kết quả Mongoose trước <code>await</code> cho bạn một Promise đang chờ, không phải dữ liệu. <code>const p = Product.find()</code> rồi <code>p.length</code> là bug — bạn phải <code>await Product.find()</code> trước.</div>
</div>`,
        },
        {
          title: 'Quiz 3 — MongoDB & Mongoose|||Quiz 3 — MongoDB & Mongoose',
          slug: 'sdn302-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra document model, CRUD, schema và population.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In MongoDB, the equivalent of a relational table is a…|||Trong MongoDB, tương đương với bảng quan hệ là…', options: ['document', 'collection', 'field', 'index'], correctIndex: 1, points: 1 },
              { question: 'Mongoose is best described as…|||Mongoose được mô tả tốt nhất là…', options: ['a database engine|||một engine CSDL', 'an ODM adding schema & validation over MongoDB|||một ODM thêm schema & validation lên MongoDB', 'a front-end framework|||một framework front-end', 'a testing tool|||một công cụ test'], correctIndex: 1, points: 1 },
              { question: 'To expand an ObjectId reference into the full referenced document, you use…|||Để mở rộng một tham chiếu ObjectId thành document đầy đủ, bạn dùng…', options: ['.join()', '.populate()', '.expand()', '.merge()'], correctIndex: 1, points: 1 },
              { question: 'A Mongoose query like Product.find() returns…|||Một truy vấn Mongoose như Product.find() trả về…', options: ['the data immediately|||dữ liệu ngay lập tức', 'a promise you must await|||một promise phải await', 'undefined|||undefined', 'an array of ids only|||chỉ mảng id'], correctIndex: 1, points: 1 },
              { question: 'When should you EMBED rather than reference data? (beyond-syllabus)|||Khi nào nên NHÚNG thay vì tham chiếu dữ liệu? (ngoài giáo trình)', options: ['when data grows unbounded|||khi dữ liệu phình vô hạn', 'when data is read together and bounded|||khi dữ liệu đọc cùng nhau và có giới hạn', 'always|||luôn luôn', 'never|||không bao giờ'], correctIndex: 1, points: 1 },
              { question: 'To avoid leaking a password hash when returning a user, you should…|||Để tránh rò rỉ password hash khi trả về một user, bạn nên…', options: ['return the whole document|||trả cả document', 'use .select("-password") to exclude it|||dùng .select("-password") để loại nó', 'store it in plain text|||lưu chữ thô', 'skip validation|||bỏ validation'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — REST API IN MVC + TEMPLATING ══════════════════ */
    {
      title: 'Chapter 4 — REST API in MVC & templating|||Chương 4 — REST API theo MVC & templating',
      description: 'Ghép Express + Mongoose thành một REST API đầy đủ theo MVC, mã trạng thái đúng, và render view bằng EJS/Handlebars.',
      lessons: [
        {
          title: '4.1 — A full REST API with Express, Mongoose & MVC|||4.1 — Một REST API đầy đủ với Express, Mongoose & MVC',
          slug: 'sdn302-4-1-rest-mvc',
          type: 'VIDEO',
          description: 'Phân lớp routes → controllers → services → models, mã trạng thái đúng, validation và xử lý lỗi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Building a full REST API in MVC</h2>
<p class="lead">Now the pieces combine. MVC layering keeps a growing API testable: routes only route, controllers handle HTTP, services hold business logic, models talk to MongoDB. This is the core of CLO5 and the Practical Exam.</p>
<h3>The layers &amp; dependency direction</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> — maps URL + method to a controller (<code>router.post('/', create)</code>)</div>
  <div class="lz-layer"><b>Controller</b> — reads req, validates, calls the service, sends the response + status</div>
  <div class="lz-layer"><b>Service</b> — business rules, orchestrates model calls</div>
  <div class="lz-layer"><b>Model (Mongoose)</b> — the only layer that touches the database</div>
</div>
<h3>Worked example — the create endpoint, done right</h3>
<div class="out"><pre><span class="tok-comment">// controllers/product.controller.js</span>
<span class="tok-keyword">exports</span>.create = <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> { name, price } = req.body;
    <span class="tok-keyword">if</span> (!name || price == <span class="tok-keyword">null</span>)                <span class="tok-comment">// validate</span>
      <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">400</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'name and price required'</span> });
    <span class="tok-keyword">const</span> product = <span class="tok-keyword">await</span> productService.<span class="tok-function">create</span>({ name, price });
    res.<span class="tok-function">status</span>(<span class="tok-number">201</span>).<span class="tok-function">json</span>(product);   <span class="tok-comment">// 201 Created</span>
  } <span class="tok-keyword">catch</span> (err) { <span class="tok-function">next</span>(err); }   <span class="tok-comment">// forward to error handler</span>
};</pre>
<em>Every REST rule in one function: validate → 400 on bad input, 201 on create, and errors forwarded, never swallowed.</em></div>
<h3>Status codes — the REST vocabulary</h3>
<table>
  <thead><tr><th>Code</th><th>Meaning</th><th>Use for</th></tr></thead>
  <tbody>
    <tr><td>200 / 201</td><td>OK / Created</td><td>successful GET/PUT · successful POST</td></tr>
    <tr><td>400</td><td>Bad Request</td><td>validation failed</td></tr>
    <tr><td>401 / 403</td><td>Unauthorized / Forbidden</td><td>not logged in · logged in but not allowed</td></tr>
    <tr><td>404</td><td>Not Found</td><td>resource id does not exist</td></tr>
    <tr><td>500</td><td>Server Error</td><td>an unexpected exception</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: API Design Best Practices (Code Lab)</span><span class="lc-sub">Build a clean, correctly-status-coded REST API step by step.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Return a consistent error shape.</b> Decide once that every error response is <code>{ error: "message" }</code> (or <code>{ error, details }</code>) and use it everywhere. A predictable envelope lets the React front-end handle all failures with one code path, instead of guessing the shape per endpoint. Consistency across responses is an API-design quality graders and real clients both reward.</div>
<div class="pitfall">Returning <code>200</code> for everything — including "not found" and validation errors — makes the API impossible for a client to handle correctly. The status code is part of the contract; use the right one.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Xây một REST API đầy đủ theo MVC</h2>
<p class="lead">Giờ các mảnh ghép lại. Phân lớp MVC giữ một API lớn dần vẫn test được: routes chỉ định tuyến, controllers xử lý HTTP, services chứa logic nghiệp vụ, models nói chuyện với MongoDB. Đây là lõi của CLO5 và Practical Exam.</p>
<h3>Các lớp &amp; chiều phụ thuộc</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Route</b> — ánh xạ URL + method tới controller (<code>router.post('/', create)</code>)</div>
  <div class="lz-layer"><b>Controller</b> — đọc req, validate, gọi service, gửi response + status</div>
  <div class="lz-layer"><b>Service</b> — luật nghiệp vụ, điều phối các call model</div>
  <div class="lz-layer"><b>Model (Mongoose)</b> — lớp duy nhất chạm database</div>
</div>
<h3>Ví dụ có lời giải — endpoint create, làm đúng cách</h3>
<div class="out"><pre><span class="tok-comment">// controllers/product.controller.js</span>
<span class="tok-keyword">exports</span>.create = <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">const</span> { name, price } = req.body;
    <span class="tok-keyword">if</span> (!name || price == <span class="tok-keyword">null</span>)                <span class="tok-comment">// validate</span>
      <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">400</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'name and price required'</span> });
    <span class="tok-keyword">const</span> product = <span class="tok-keyword">await</span> productService.<span class="tok-function">create</span>({ name, price });
    res.<span class="tok-function">status</span>(<span class="tok-number">201</span>).<span class="tok-function">json</span>(product);   <span class="tok-comment">// 201 Created</span>
  } <span class="tok-keyword">catch</span> (err) { <span class="tok-function">next</span>(err); }   <span class="tok-comment">// chuyen toi error handler</span>
};</pre>
<em>Mọi luật REST trong một hàm: validate → 400 khi đầu vào sai, 201 khi tạo, và lỗi được chuyển đi, không bao giờ nuốt.</em></div>
<h3>Mã trạng thái — từ vựng của REST</h3>
<table>
  <thead><tr><th>Mã</th><th>Nghĩa</th><th>Dùng cho</th></tr></thead>
  <tbody>
    <tr><td>200 / 201</td><td>OK / Created</td><td>GET/PUT thành công · POST tạo thành công</td></tr>
    <tr><td>400</td><td>Bad Request</td><td>validation thất bại</td></tr>
    <tr><td>401 / 403</td><td>Unauthorized / Forbidden</td><td>chưa đăng nhập · đã đăng nhập nhưng không được phép</td></tr>
    <tr><td>404</td><td>Not Found</td><td>id tài nguyên không tồn tại</td></tr>
    <tr><td>500</td><td>Server Error</td><td>một ngoại lệ bất ngờ</td></tr>
  </tbody>
</table>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302#module-528" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: API Design Best Practices (Code Lab)</span><span class="lc-sub">Xây một REST API sạch, đúng mã trạng thái, từng bước.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trả về một hình dạng lỗi nhất quán.</b> Quyết định một lần rằng mọi response lỗi là <code>{ error: "message" }</code> (hoặc <code>{ error, details }</code>) và dùng nó khắp nơi. Một phong bì dễ đoán để front-end React xử lý mọi thất bại bằng một luồng code, thay vì đoán hình dạng theo từng endpoint. Sự nhất quán giữa các response là chất lượng thiết kế API mà giám khảo lẫn client thật đều thưởng.</div>
<div class="pitfall">Trả <code>200</code> cho mọi thứ — kể cả "không tìm thấy" và lỗi validation — làm API không thể để client xử lý đúng. Mã trạng thái là một phần của hợp đồng; dùng cái đúng.</div>
</div>`,
        },
        {
          title: '4.2 — Server-side templating with EJS & Handlebars|||4.2 — Templating phía server với EJS & Handlebars',
          slug: 'sdn302-4-2-templating',
          type: 'VIDEO',
          description: 'Render HTML từ server bằng EJS và Handlebars, truyền dữ liệu vào view, và khi nào dùng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Server-side templating (CLO8)</h2>
<p class="lead">Sometimes the server renders HTML directly instead of returning JSON — for admin pages, emails, or simple sites. <strong>EJS</strong> and <strong>Handlebars</strong> are template engines that inject data into HTML on the server.</p>
<h3>EJS — JavaScript inside HTML</h3>
<div class="out"><pre><span class="tok-comment">// app.js</span>
app.<span class="tok-function">set</span>(<span class="tok-string">'view engine'</span>, <span class="tok-string">'ejs'</span>);
app.<span class="tok-function">get</span>(<span class="tok-string">'/products'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; {
  <span class="tok-keyword">const</span> products = <span class="tok-keyword">await</span> Product.<span class="tok-function">find</span>();
  res.<span class="tok-function">render</span>(<span class="tok-string">'products'</span>, { products }); <span class="tok-comment">// views/products.ejs</span>
});</pre>
<pre><span class="tok-comment">&lt;!-- views/products.ejs --&gt;</span>
&lt;ul&gt;
  &lt;% products.forEach(p =&gt; { %&gt;
    &lt;li&gt;&lt;%= p.name %&gt; - &lt;%= p.price %&gt;&lt;/li&gt;
  &lt;% }) %&gt;
&lt;/ul&gt;</pre>
<em><code>&lt;%= %&gt;</code> outputs a value (escaped); <code>&lt;% %&gt;</code> runs logic. EJS feels like HTML with JavaScript sprinkled in.</em></div>
<h3>Handlebars — logic-less templates</h3>
<div class="out"><pre><span class="tok-comment">&lt;!-- Handlebars: {{ }} for values, {{#each}} for loops --&gt;</span>
&lt;ul&gt;
  {{#each products}}
    &lt;li&gt;{{this.name}} - {{this.price}}&lt;/li&gt;
  {{/each}}
&lt;/ul&gt;</pre>
<em>Handlebars deliberately limits logic in the template, pushing you to prepare data in the controller — a cleaner separation.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>API-first vs server-rendered — know which you are building.</b> A React app expects <em>JSON</em> from your API (no templating). Server-side templating is for when the server owns the whole page (admin dashboards, transactional emails, SEO-critical pages). Mixing them confuses the architecture. Deciding upfront "does the client render, or does the server?" is an architectural call the syllabus lists as two techniques but does not tell you when to choose each.</div>
<div class="pitfall">Never build interpolated HTML by string concatenation with user input — it invites cross-site scripting (XSS). Template engines escape output by default (EJS <code>&lt;%= %&gt;</code>, Handlebars <code>{{ }}</code>); use them rather than hand-built strings.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Templating phía server (CLO8)</h2>
<p class="lead">Đôi khi server render HTML trực tiếp thay vì trả JSON — cho trang admin, email, hay site đơn giản. <strong>EJS</strong> và <strong>Handlebars</strong> là các template engine chèn dữ liệu vào HTML tại server.</p>
<h3>EJS — JavaScript bên trong HTML</h3>
<div class="out"><pre><span class="tok-comment">// app.js</span>
app.<span class="tok-function">set</span>(<span class="tok-string">'view engine'</span>, <span class="tok-string">'ejs'</span>);
app.<span class="tok-function">get</span>(<span class="tok-string">'/products'</span>, <span class="tok-keyword">async</span> (req, res) =&gt; {
  <span class="tok-keyword">const</span> products = <span class="tok-keyword">await</span> Product.<span class="tok-function">find</span>();
  res.<span class="tok-function">render</span>(<span class="tok-string">'products'</span>, { products }); <span class="tok-comment">// views/products.ejs</span>
});</pre>
<pre><span class="tok-comment">&lt;!-- views/products.ejs --&gt;</span>
&lt;ul&gt;
  &lt;% products.forEach(p =&gt; { %&gt;
    &lt;li&gt;&lt;%= p.name %&gt; - &lt;%= p.price %&gt;&lt;/li&gt;
  &lt;% }) %&gt;
&lt;/ul&gt;</pre>
<em><code>&lt;%= %&gt;</code> xuất một giá trị (đã escape); <code>&lt;% %&gt;</code> chạy logic. EJS cảm giác như HTML rắc thêm JavaScript.</em></div>
<h3>Handlebars — template ít logic</h3>
<div class="out"><pre><span class="tok-comment">&lt;!-- Handlebars: {{ }} cho gia tri, {{#each}} cho vong lap --&gt;</span>
&lt;ul&gt;
  {{#each products}}
    &lt;li&gt;{{this.name}} - {{this.price}}&lt;/li&gt;
  {{/each}}
&lt;/ul&gt;</pre>
<em>Handlebars cố ý hạn chế logic trong template, đẩy bạn chuẩn bị dữ liệu ở controller — một sự tách bạch sạch hơn.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>API-first vs server-rendered — biết mình đang xây cái nào.</b> Một app React mong đợi <em>JSON</em> từ API của bạn (không templating). Templating phía server dành cho khi server sở hữu cả trang (dashboard admin, email giao dịch, trang cần SEO). Trộn chúng làm rối kiến trúc. Quyết định trước "client render hay server render?" là một lựa chọn kiến trúc mà giáo trình liệt kê như hai kỹ thuật nhưng không nói khi nào chọn cái nào.</div>
<div class="pitfall">Đừng bao giờ dựng HTML nội suy bằng nối chuỗi với đầu vào người dùng — nó mời gọi cross-site scripting (XSS). Template engine escape đầu ra mặc định (EJS <code>&lt;%= %&gt;</code>, Handlebars <code>{{ }}</code>); dùng chúng thay vì chuỗi tự dựng.</div>
</div>`,
        },
        {
          title: 'Quiz 4 — REST API & templating|||Quiz 4 — REST API & templating',
          slug: 'sdn302-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra phân lớp MVC, mã trạng thái, và templating.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In MVC layering, the only layer that talks to the database is the…|||Trong phân lớp MVC, lớp duy nhất nói chuyện với database là…', options: ['route', 'controller', 'model', 'view'], correctIndex: 2, points: 1 },
              { question: 'A successful POST that creates a resource should return status…|||Một POST thành công tạo tài nguyên nên trả mã…', options: ['200', '201', '204', '400'], correctIndex: 1, points: 1 },
              { question: 'A request with a missing required field should return…|||Một request thiếu field bắt buộc nên trả…', options: ['200 OK', '201 Created', '400 Bad Request', '500 Server Error'], correctIndex: 2, points: 1 },
              { question: 'In EJS, which tag OUTPUTS an escaped value?|||Trong EJS, tag nào XUẤT một giá trị đã escape?', options: ['<% %>', '<%= %>', '{{ }}', '<%# %>'], correctIndex: 1, points: 1 },
              { question: 'A React front-end expects your API to return…|||Một front-end React mong đợi API của bạn trả về…', options: ['server-rendered HTML|||HTML render sẵn ở server', 'JSON|||JSON', 'EJS templates|||template EJS', 'plain text only|||chỉ text thuần'], correctIndex: 1, points: 1 },
              { question: 'Returning 200 for a "not found" case is bad because… (beyond-syllabus)|||Trả 200 cho trường hợp "không tìm thấy" là tệ vì… (ngoài giáo trình)', options: ['it is slower|||chậm hơn', 'the client cannot distinguish success from failure|||client không phân biệt được thành công với thất bại', 'it uses more memory|||tốn bộ nhớ hơn', 'it breaks Mongoose|||làm hỏng Mongoose'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — AUTHENTICATION & SECURITY ══════════════════ */
    {
      title: 'Chapter 5 — Authentication & security|||Chương 5 — Xác thực & bảo mật',
      description: 'Băm mật khẩu bcrypt, session/cookie, Passport, token JWT, HTTPS, CORS và upload file (Multer).',
      lessons: [
        {
          title: '5.1 — Passwords, bcrypt, sessions & Passport|||5.1 — Mật khẩu, bcrypt, session & Passport',
          slug: 'sdn302-5-1-passwords-sessions',
          type: 'VIDEO',
          description: 'Băm mật khẩu an toàn với bcrypt, xác thực bằng session/cookie, và Passport-local.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Authentication done safely (CLO6)</h2>
<p class="lead">Authentication proves <em>who</em> a user is. The two non-negotiables: never store a plain-text password, and never trust the client. Get these wrong and you fail the security part outright.</p>
<h3>Hashing passwords with bcrypt</h3>
<div class="out"><pre><span class="tok-keyword">const</span> bcrypt = <span class="tok-function">require</span>(<span class="tok-string">'bcrypt'</span>);

<span class="tok-comment">// on register — hash before saving</span>
<span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.<span class="tok-function">hash</span>(password, <span class="tok-number">10</span>); <span class="tok-comment">// 10 salt rounds</span>
<span class="tok-keyword">await</span> User.<span class="tok-function">create</span>({ email, password: hash });

<span class="tok-comment">// on login — compare, never decrypt</span>
<span class="tok-keyword">const</span> ok = <span class="tok-keyword">await</span> bcrypt.<span class="tok-function">compare</span>(password, user.password);
<span class="tok-keyword">if</span> (!ok) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Invalid credentials'</span> });</pre>
<em>bcrypt is a one-way hash with a built-in salt — you cannot reverse it, only compare. This is why a database leak does not expose passwords.</em></div>
<h3>Sessions &amp; cookies vs stateless</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Login</b><span>server verifies password</span></div>
  <div class="lz-step"><b>Session</b><span>server stores session, sends a cookie with the session id</span></div>
  <div class="lz-step"><b>Next requests</b><span>browser sends the cookie → server looks up the session</span></div>
</div>
<h3>Passport-local</h3>
<div class="out"><pre><span class="tok-comment">// Passport standardises the login strategy</span>
passport.<span class="tok-function">use</span>(<span class="tok-keyword">new</span> <span class="tok-function">LocalStrategy</span>(<span class="tok-keyword">async</span> (email, password, done) =&gt; {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> User.<span class="tok-function">findOne</span>({ email });
  <span class="tok-keyword">if</span> (!user || !(<span class="tok-keyword">await</span> bcrypt.<span class="tok-function">compare</span>(password, user.password)))
    <span class="tok-keyword">return</span> <span class="tok-function">done</span>(<span class="tok-keyword">null</span>, <span class="tok-keyword">false</span>);
  <span class="tok-keyword">return</span> <span class="tok-function">done</span>(<span class="tok-keyword">null</span>, user);
}));</pre></div>
<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302#module-949" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: Password Hashing with bcrypt (Code Lab)</span><span class="lc-sub">Implement secure register/login on the Authentication track.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Return the same error for "no such user" and "wrong password".</b> If your API says "email not found" vs "wrong password", an attacker can enumerate which emails are registered. A single generic "Invalid credentials" for both closes this leak. Small wording choices like this are real security, not pedantry — and the syllabus teaches the mechanism but not the threat model.</div>
<div class="pitfall">Never log or return the password field — even hashed. Use <code>.select('-password')</code> by default on the User model, and strip it before sending any user object to the client.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Xác thực an toàn (CLO6)</h2>
<p class="lead">Xác thực chứng minh người dùng <em>là ai</em>. Hai điều không thoả hiệp: đừng bao giờ lưu mật khẩu chữ thô, và đừng bao giờ tin client. Sai những cái này là rớt thẳng phần bảo mật.</p>
<h3>Băm mật khẩu với bcrypt</h3>
<div class="out"><pre><span class="tok-keyword">const</span> bcrypt = <span class="tok-function">require</span>(<span class="tok-string">'bcrypt'</span>);

<span class="tok-comment">// khi dang ky — bam truoc khi luu</span>
<span class="tok-keyword">const</span> hash = <span class="tok-keyword">await</span> bcrypt.<span class="tok-function">hash</span>(password, <span class="tok-number">10</span>); <span class="tok-comment">// 10 salt rounds</span>
<span class="tok-keyword">await</span> User.<span class="tok-function">create</span>({ email, password: hash });

<span class="tok-comment">// khi dang nhap — so sanh, khong bao gio giai ma</span>
<span class="tok-keyword">const</span> ok = <span class="tok-keyword">await</span> bcrypt.<span class="tok-function">compare</span>(password, user.password);
<span class="tok-keyword">if</span> (!ok) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Invalid credentials'</span> });</pre>
<em>bcrypt là băm một chiều có salt tích hợp — bạn không đảo ngược được, chỉ so sánh. Đó là lý do một vụ rò rỉ database không lộ mật khẩu.</em></div>
<h3>Session &amp; cookie vs stateless</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Đăng nhập</b><span>server xác minh mật khẩu</span></div>
  <div class="lz-step"><b>Session</b><span>server lưu session, gửi cookie chứa session id</span></div>
  <div class="lz-step"><b>Request sau</b><span>trình duyệt gửi cookie → server tra session</span></div>
</div>
<h3>Passport-local</h3>
<div class="out"><pre><span class="tok-comment">// Passport chuan hoa chien luoc dang nhap</span>
passport.<span class="tok-function">use</span>(<span class="tok-keyword">new</span> <span class="tok-function">LocalStrategy</span>(<span class="tok-keyword">async</span> (email, password, done) =&gt; {
  <span class="tok-keyword">const</span> user = <span class="tok-keyword">await</span> User.<span class="tok-function">findOne</span>({ email });
  <span class="tok-keyword">if</span> (!user || !(<span class="tok-keyword">await</span> bcrypt.<span class="tok-function">compare</span>(password, user.password)))
    <span class="tok-keyword">return</span> <span class="tok-function">done</span>(<span class="tok-keyword">null</span>, <span class="tok-keyword">false</span>);
  <span class="tok-keyword">return</span> <span class="tok-function">done</span>(<span class="tok-keyword">null</span>, user);
}));</pre></div>
<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fserver-side-development-nodejs-express-mongodb%2Flearn&reflabel=SDN302#module-949" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: Password Hashing với bcrypt (Code Lab)</span><span class="lc-sub">Hiện thực register/login an toàn trên track Authentication.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trả cùng một lỗi cho "không có user" và "sai mật khẩu".</b> Nếu API nói "email không tồn tại" vs "sai mật khẩu", kẻ tấn công có thể dò email nào đã đăng ký. Một "Invalid credentials" chung cho cả hai bịt lỗ rò này. Những lựa chọn câu chữ nhỏ như vậy là bảo mật thật, không phải chi li — và giáo trình dạy cơ chế chứ không dạy mô hình đe doạ.</div>
<div class="pitfall">Đừng bao giờ log hay trả field password — kể cả đã băm. Dùng <code>.select('-password')</code> mặc định trên model User, và loại nó trước khi gửi bất kỳ object user nào về client.</div>
</div>`,
        },
        {
          title: '5.2 — JWT, HTTPS, CORS & file uploads|||5.2 — JWT, HTTPS, CORS & upload file',
          slug: 'sdn302-5-2-jwt-cors',
          type: 'VIDEO',
          description: 'Token-based auth với JWT, HTTPS an toàn, bật CORS cho client React, và upload file bằng Multer.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Token auth (JWT), HTTPS, CORS &amp; uploads</h2>
<p class="lead">For an API consumed by a React app, <strong>token-based auth (JWT)</strong> is often preferred over sessions: the server stays stateless and the token travels in a header.</p>
<h3>JWT flow</h3>
<div class="out"><pre><span class="tok-keyword">const</span> jwt = <span class="tok-function">require</span>(<span class="tok-string">'jsonwebtoken'</span>);

<span class="tok-comment">// on login — sign a token</span>
<span class="tok-keyword">const</span> token = jwt.<span class="tok-function">sign</span>({ id: user._id }, process.env.JWT_SECRET, { expiresIn: <span class="tok-string">'1d'</span> });
res.<span class="tok-function">json</span>({ token });

<span class="tok-comment">// auth middleware — verify on protected routes</span>
<span class="tok-keyword">function</span> <span class="tok-function">requireAuth</span>(req, res, next) {
  <span class="tok-keyword">const</span> header = req.headers.authorization || <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = header.<span class="tok-function">replace</span>(<span class="tok-string">'Bearer '</span>, <span class="tok-string">''</span>);
  <span class="tok-keyword">try</span> {
    req.user = jwt.<span class="tok-function">verify</span>(token, process.env.JWT_SECRET);
    <span class="tok-function">next</span>();
  } <span class="tok-keyword">catch</span> { res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Unauthorized'</span> }); }
}</pre>
<em>The client stores the token and sends <code>Authorization: Bearer &lt;token&gt;</code> on each request; the server verifies its signature — no session storage needed.</em></div>
<h3>CORS — let your React app call the API</h3>
<div class="out"><pre><span class="tok-keyword">const</span> cors = <span class="tok-function">require</span>(<span class="tok-string">'cors'</span>);
app.<span class="tok-function">use</span>(<span class="tok-function">cors</span>({ origin: <span class="tok-string">'https://myapp.com'</span> })); <span class="tok-comment">// allow your front-end origin</span></pre>
<em>Without CORS, a browser blocks your React app (different origin) from calling the API. Enable it for the specific origin, not <code>*</code> in production.</em></div>
<h3>File uploads with Multer</h3>
<div class="out"><pre><span class="tok-keyword">const</span> multer = <span class="tok-function">require</span>(<span class="tok-string">'multer'</span>);
<span class="tok-keyword">const</span> upload = <span class="tok-function">multer</span>({ dest: <span class="tok-string">'uploads/'</span> });
app.<span class="tok-function">post</span>(<span class="tok-string">'/upload'</span>, upload.<span class="tok-function">single</span>(<span class="tok-string">'file'</span>), (req, res) =&gt; {
  res.<span class="tok-function">json</span>({ file: req.file.filename });
});</pre></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Keep the JWT secret in an environment variable, never in code.</b> A signing secret committed to Git is a full account-forgery key for anyone who reads the repo. Load it from <code>process.env.JWT_SECRET</code> (via a <code>.env</code> file that is git-ignored). This env-not-code discipline for secrets is the single most common real-world back-end mistake — and it is not on the syllabus.</div>
<div class="pitfall">Do not put sensitive data (passwords, roles you do not want visible) inside the JWT <em>payload</em> — it is only base64-encoded, not encrypted. Anyone can decode and read it; only the signature is protected.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Token auth (JWT), HTTPS, CORS &amp; upload</h2>
<p class="lead">Với một API được app React tiêu thụ, <strong>xác thực bằng token (JWT)</strong> thường được ưa hơn session: server giữ stateless và token đi trong header.</p>
<h3>Luồng JWT</h3>
<div class="out"><pre><span class="tok-keyword">const</span> jwt = <span class="tok-function">require</span>(<span class="tok-string">'jsonwebtoken'</span>);

<span class="tok-comment">// khi dang nhap — ky mot token</span>
<span class="tok-keyword">const</span> token = jwt.<span class="tok-function">sign</span>({ id: user._id }, process.env.JWT_SECRET, { expiresIn: <span class="tok-string">'1d'</span> });
res.<span class="tok-function">json</span>({ token });

<span class="tok-comment">// auth middleware — verify tren route duoc bao ve</span>
<span class="tok-keyword">function</span> <span class="tok-function">requireAuth</span>(req, res, next) {
  <span class="tok-keyword">const</span> header = req.headers.authorization || <span class="tok-string">''</span>;
  <span class="tok-keyword">const</span> token = header.<span class="tok-function">replace</span>(<span class="tok-string">'Bearer '</span>, <span class="tok-string">''</span>);
  <span class="tok-keyword">try</span> {
    req.user = jwt.<span class="tok-function">verify</span>(token, process.env.JWT_SECRET);
    <span class="tok-function">next</span>();
  } <span class="tok-keyword">catch</span> { res.<span class="tok-function">status</span>(<span class="tok-number">401</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'Unauthorized'</span> }); }
}</pre>
<em>Client lưu token và gửi <code>Authorization: Bearer &lt;token&gt;</code> mỗi request; server verify chữ ký — không cần lưu session.</em></div>
<h3>CORS — cho app React gọi API</h3>
<div class="out"><pre><span class="tok-keyword">const</span> cors = <span class="tok-function">require</span>(<span class="tok-string">'cors'</span>);
app.<span class="tok-function">use</span>(<span class="tok-function">cors</span>({ origin: <span class="tok-string">'https://myapp.com'</span> })); <span class="tok-comment">// cho phep origin front-end cua ban</span></pre>
<em>Không có CORS, trình duyệt chặn app React (khác origin) gọi API. Bật nó cho origin cụ thể, không phải <code>*</code> ở production.</em></div>
<h3>Upload file với Multer</h3>
<div class="out"><pre><span class="tok-keyword">const</span> multer = <span class="tok-function">require</span>(<span class="tok-string">'multer'</span>);
<span class="tok-keyword">const</span> upload = <span class="tok-function">multer</span>({ dest: <span class="tok-string">'uploads/'</span> });
app.<span class="tok-function">post</span>(<span class="tok-string">'/upload'</span>, upload.<span class="tok-function">single</span>(<span class="tok-string">'file'</span>), (req, res) =&gt; {
  res.<span class="tok-function">json</span>({ file: req.file.filename });
});</pre></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Giữ JWT secret trong biến môi trường, không bao giờ trong code.</b> Một secret ký commit vào Git là chìa khoá giả mạo tài khoản cho bất kỳ ai đọc repo. Nạp nó từ <code>process.env.JWT_SECRET</code> (qua một tệp <code>.env</code> đã git-ignore). Kỷ luật secret-để-env-không-trong-code này là lỗi back-end thực tế phổ biến nhất — và không có trong giáo trình.</div>
<div class="pitfall">Đừng đặt dữ liệu nhạy cảm (mật khẩu, vai trò bạn không muốn lộ) trong <em>payload</em> JWT — nó chỉ base64-encode, không mã hoá. Ai cũng decode và đọc được; chỉ chữ ký được bảo vệ.</div>
</div>`,
        },
        {
          title: 'Quiz 5 — Authentication & security|||Quiz 5 — Xác thực & bảo mật',
          slug: 'sdn302-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra bcrypt, session vs JWT, CORS và bảo mật.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Passwords should be stored…|||Mật khẩu nên được lưu…', options: ['in plain text|||dạng chữ thô', 'encrypted so they can be decrypted|||mã hoá để giải mã được', 'as a one-way bcrypt hash|||dạng băm bcrypt một chiều', 'in the JWT payload|||trong payload JWT'], correctIndex: 2, points: 1 },
              { question: 'On login you check a password by…|||Khi đăng nhập bạn kiểm mật khẩu bằng…', options: ['decrypting the stored hash|||giải mã hash đã lưu', 'bcrypt.compare(input, storedHash)|||bcrypt.compare(input, storedHash)', 'comparing plain strings|||so chuỗi thô', 'checking the JWT|||kiểm JWT'], correctIndex: 1, points: 1 },
              { question: 'A JWT is sent by the client in the… header.|||Một JWT được client gửi trong header…', options: ['Content-Type', 'Authorization: Bearer', 'Cookie only', 'Host'], correctIndex: 1, points: 1 },
              { question: 'Without CORS enabled, a browser will… a cross-origin React app calling your API.|||Không bật CORS, trình duyệt sẽ… một app React khác origin gọi API của bạn.', options: ['speed up|||tăng tốc', 'block|||chặn', 'cache|||cache', 'authenticate|||xác thực'], correctIndex: 1, points: 1 },
              { question: 'The JWT signing secret should live…|||Secret ký JWT nên nằm…', options: ['hard-coded in the source|||hard-code trong mã nguồn', 'in an environment variable, git-ignored|||trong biến môi trường, git-ignore', 'in the JWT payload|||trong payload JWT', 'in the README|||trong README'], correctIndex: 1, points: 1 },
              { question: 'Returning "email not found" vs "wrong password" separately is risky because it lets attackers… (beyond-syllabus)|||Trả riêng "email không tồn tại" vs "sai mật khẩu" rủi ro vì cho kẻ tấn công… (ngoài giáo trình)', options: ['crash the server|||làm sập server', 'enumerate which emails are registered|||dò email nào đã đăng ký', 'read the database|||đọc database', 'bypass CORS|||vượt CORS'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — INTEGRATE REACT & DEPLOY ══════════════════ */
    {
      title: 'Chapter 6 — Integrating React & deployment|||Chương 6 — Tích hợp React & triển khai',
      description: 'Nối front-end React với API Node, triển khai server lên hosting, và Backend-as-a-Service (BaaS).',
      lessons: [
        {
          title: '6.1 — Connect React, deploy & BaaS|||6.1 — Nối React, triển khai & BaaS',
          slug: 'sdn302-6-1-react-deploy',
          type: 'VIDEO',
          description: 'Gọi API từ React (axios/fetch), biến môi trường, triển khai lên Render/Railway, và BaaS (CLO7).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Integrating React &amp; deploying</h2>
<p class="lead">Your API is only useful once a front-end talks to it and it runs somewhere public. This lesson closes the loop: React → your API → deployed.</p>
<h3>Calling the API from React</h3>
<div class="out"><pre><span class="tok-comment">// React component — call the deployed API</span>
<span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(<span class="tok-string">&#96;\${API_URL}/api/products&#96;</span>, {
  headers: { Authorization: <span class="tok-string">&#96;Bearer \${token}&#96;</span> }
});
<span class="tok-keyword">const</span> products = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();</pre>
<em>The front-end sends the JWT in the Authorization header; the back-end's CORS config must allow the React app's origin.</em></div>
<h3>Deployment steps</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Config via env</b><span>PORT, MONGODB_URI, JWT_SECRET from process.env</span></div>
  <div class="lz-step"><b>Push to GitHub</b><span>the host builds from your repo</span></div>
  <div class="lz-step"><b>Deploy</b><span>Render / Railway / Heroku runs npm start</span></div>
  <div class="lz-step"><b>Set env on host</b><span>add the same variables in the host dashboard</span></div>
</div>
<h3>Backend-as-a-Service (CLO7)</h3>
<p>BaaS platforms (Firebase, Supabase, MongoDB Atlas App Services) provide ready-made auth, database and storage so small apps skip building a server. They handle secure client–server communication for you — useful when speed matters more than control.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The 12-factor config rule: config lives in the environment.</b> The <em>same</em> code should run locally and in production; only environment variables differ (local Mongo vs Atlas, dev secret vs prod secret). Never hard-code a URL or port. This makes deploys reproducible and secrets safe — a professional norm (the "12-factor app") the syllabus does not name but every hosting platform assumes.</div>
<div class="pitfall">A deploy that "works locally but 500s in production" is almost always a missing environment variable on the host (MONGODB_URI, JWT_SECRET). Setting env vars in the host dashboard is a separate step from pushing code — do not forget it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Tích hợp React &amp; triển khai</h2>
<p class="lead">API của bạn chỉ hữu ích khi một front-end nói chuyện với nó và nó chạy ở đâu đó công khai. Bài này khép vòng: React → API của bạn → đã triển khai.</p>
<h3>Gọi API từ React</h3>
<div class="out"><pre><span class="tok-comment">// React component — goi API da trien khai</span>
<span class="tok-keyword">const</span> res = <span class="tok-keyword">await</span> fetch(<span class="tok-string">&#96;\${API_URL}/api/products&#96;</span>, {
  headers: { Authorization: <span class="tok-string">&#96;Bearer \${token}&#96;</span> }
});
<span class="tok-keyword">const</span> products = <span class="tok-keyword">await</span> res.<span class="tok-function">json</span>();</pre>
<em>Front-end gửi JWT trong header Authorization; cấu hình CORS của back-end phải cho phép origin của app React.</em></div>
<h3>Các bước triển khai</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Config qua env</b><span>PORT, MONGODB_URI, JWT_SECRET từ process.env</span></div>
  <div class="lz-step"><b>Push lên GitHub</b><span>host build từ repo của bạn</span></div>
  <div class="lz-step"><b>Triển khai</b><span>Render / Railway / Heroku chạy npm start</span></div>
  <div class="lz-step"><b>Đặt env trên host</b><span>thêm cùng các biến trong dashboard của host</span></div>
</div>
<h3>Backend-as-a-Service (CLO7)</h3>
<p>Nền tảng BaaS (Firebase, Supabase, MongoDB Atlas App Services) cung cấp sẵn auth, database và storage nên app nhỏ bỏ qua việc xây server. Chúng lo giao tiếp client–server an toàn cho bạn — hữu ích khi tốc độ quan trọng hơn quyền kiểm soát.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc 12-factor: config nằm trong môi trường.</b> <em>Cùng</em> một mã nên chạy local và production; chỉ biến môi trường khác (Mongo local vs Atlas, secret dev vs prod). Đừng bao giờ hard-code URL hay port. Điều này làm deploy tái lập được và secret an toàn — một chuẩn chuyên nghiệp ("12-factor app") mà giáo trình không gọi tên nhưng mọi nền tảng hosting đều mặc định.</div>
<div class="pitfall">Một deploy "chạy local nhưng 500 ở production" gần như luôn là thiếu một biến môi trường trên host (MONGODB_URI, JWT_SECRET). Đặt env trên dashboard của host là một bước riêng, khác với push code — đừng quên.</div>
</div>`,
        },
        {
          title: 'Project — the server-side app checklist|||Project — checklist ứng dụng server-side',
          slug: 'sdn302-project-checklist',
          type: 'VIDEO',
          description: 'Danh sách kiểm hoàn chỉnh cho project server-side theo từng CLO trước khi nộp và thuyết trình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Milestone</span>
<h2>Project checklist</h2>
<p class="lead">Use this as a gate before submitting and presenting your project. Each item maps to a CLO the graders look for.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Data model</div><div class="lz-nsub">3–5 Mongoose schemas · at least one reference relationship · validation rules</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">REST API in MVC</div><div class="lz-nsub">routes → controllers → services → models · full CRUD · correct status codes</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Population</div><div class="lz-nsub">at least one .populate() demonstrating a relationship (CLO5)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Authentication</div><div class="lz-nsub">bcrypt register/login · JWT or session · a protected route (CLO6)</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Validation &amp; errors</div><div class="lz-nsub">400 on bad input · central error handler · no crashes</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Deploy + demo</div><div class="lz-nsub">running publicly · Postman collection · a small React page or docs</div></div></div>
</div>
<div class="callout ok"><b>Presentation tip:</b> demo the happy path first (register → login → create → list with populate), then show one error case (invalid input → 400). Judges want to see it <em>run</em> and see that you handle failure, not just success.</div>
<div class="pitfall">A project that only does CRUD on one collection with no auth and no population will cap your grade — it cannot demonstrate CLO5 and CLO6, the two highest-weight technical outcomes.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Mốc</span>
<h2>Checklist project</h2>
<p class="lead">Dùng cái này như một cổng trước khi nộp và thuyết trình project. Mỗi mục ánh xạ một CLO mà giám khảo tìm.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Mô hình dữ liệu</div><div class="lz-nsub">3–5 schema Mongoose · ít nhất một quan hệ tham chiếu · luật validation</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">REST API theo MVC</div><div class="lz-nsub">routes → controllers → services → models · đủ CRUD · mã trạng thái đúng</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Population</div><div class="lz-nsub">ít nhất một .populate() thể hiện quan hệ (CLO5)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Xác thực</div><div class="lz-nsub">register/login bcrypt · JWT hoặc session · một route được bảo vệ (CLO6)</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Validation &amp; lỗi</div><div class="lz-nsub">400 khi đầu vào sai · error handler trung tâm · không crash</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai + demo</div><div class="lz-nsub">chạy công khai · collection Postman · một trang React nhỏ hoặc tài liệu</div></div></div>
</div>
<div class="callout ok"><b>Mẹo thuyết trình:</b> demo happy path trước (register → login → create → list có populate), rồi show một ca lỗi (đầu vào sai → 400). Giám khảo muốn thấy nó <em>chạy</em> và thấy bạn xử lý thất bại, không chỉ thành công.</div>
<div class="pitfall">Một project chỉ CRUD trên một collection, không auth và không population sẽ giới hạn điểm — nó không thể thể hiện CLO5 và CLO6, hai đầu ra kỹ thuật trọng số cao nhất.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — EXAM PREP & QUESTION BANK ══════════════════ */
    {
      title: 'Chapter 7 — Exam prep & question bank|||Chương 7 — Ôn thi & ngân hàng câu hỏi',
      description: 'Định dạng Practical Exam + Final Exam + Progress Test, code snippet bank, và ngân hàng câu hỏi/vấn đáp theo CLO — kiểu SWP391.',
      lessons: [
        {
          title: '7.1 — Exam formats, starter snippet & CLO question bank|||7.1 — Định dạng thi, snippet khởi đầu & ngân hàng câu hỏi theo CLO',
          slug: 'sdn302-7-1-exam-question-bank',
          type: 'VIDEO',
          description: 'Chiến lược Practical Exam 85 phút, bộ khung code nhớ sẵn, và ngân hàng câu hỏi theo 8 CLO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The three assessments &amp; how to beat them</h2>
<p class="lead">Two gates decide your fate: the Practical Exam (85 min, build an endpoint live, ≥4) and the Final Exam (60 min, theory + applied, ≥4). Progress Tests map to specific CLOs. Prepare each deliberately.</p>
<h3>Practical Exam strategy (85 min)</h3>
<div class="lz-flow">
  <div class="lz-step"><b>0–10 min</b><span>type your memorised starter: connect Mongoose, schema, router, error handler</span></div>
  <div class="lz-step"><b>10–60 min</b><span>implement the required endpoints + validation + status codes</span></div>
  <div class="lz-step"><b>60–85 min</b><span>test every route in Postman, fix, add populate/auth if asked</span></div>
</div>
<h3>The starter snippet — memorise this skeleton</h3>
<div class="out"><pre><span class="tok-keyword">const</span> express = <span class="tok-function">require</span>(<span class="tok-string">'express'</span>);
<span class="tok-keyword">const</span> mongoose = <span class="tok-function">require</span>(<span class="tok-string">'mongoose'</span>);
<span class="tok-keyword">const</span> app = <span class="tok-function">express</span>(); app.<span class="tok-function">use</span>(express.<span class="tok-function">json</span>());
mongoose.<span class="tok-function">connect</span>(process.env.MONGODB_URI);

<span class="tok-keyword">const</span> Item = mongoose.<span class="tok-function">model</span>(<span class="tok-string">'Item'</span>, <span class="tok-keyword">new</span> mongoose.<span class="tok-function">Schema</span>({ name: { type: String, required: <span class="tok-keyword">true</span> } }));

app.<span class="tok-function">get</span>(<span class="tok-string">'/api/items'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> { res.<span class="tok-function">json</span>(<span class="tok-keyword">await</span> Item.<span class="tok-function">find</span>()); } <span class="tok-keyword">catch</span> (e) { <span class="tok-function">next</span>(e); }
});
app.<span class="tok-function">post</span>(<span class="tok-string">'/api/items'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">if</span> (!req.body.name) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">400</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'name required'</span> });
    res.<span class="tok-function">status</span>(<span class="tok-number">201</span>).<span class="tok-function">json</span>(<span class="tok-keyword">await</span> Item.<span class="tok-function">create</span>(req.body));
  } <span class="tok-keyword">catch</span> (e) { <span class="tok-function">next</span>(e); }
});
app.<span class="tok-function">use</span>((err, req, res, next) =&gt; res.<span class="tok-function">status</span>(<span class="tok-number">500</span>).<span class="tok-function">json</span>({ error: err.message }));
app.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>);</pre>
<em>If you can type this from memory in ten minutes, the Practical Exam becomes "extend a working app" instead of "start from a blank file under panic".</em></div>
<h3>Question bank — practise by CLO</h3>
<p><b>CLO1-2 (Node/Express):</b></p>
<ul>
  <li>Explain the event loop and why Node scales on one thread.</li>
  <li>Write a middleware that logs every request's method and URL.</li>
  <li>What does <code>express.json()</code> do, and what breaks without it?</li>
</ul>
<p><b>CLO3-5 (Mongoose/REST):</b></p>
<ul>
  <li>Define a Mongoose schema with a required field and a reference to User.</li>
  <li>Write a GET endpoint that returns all posts with their author populated.</li>
  <li>Which status codes for: created, bad input, not found, unauthorized?</li>
  <li>Build a PUT endpoint that validates input and returns 404 if the id is missing.</li>
</ul>
<p><b>CLO6 (auth):</b></p>
<ul>
  <li>Write a register handler that hashes the password with bcrypt.</li>
  <li>Write a requireAuth middleware that verifies a JWT.</li>
  <li>Why must the JWT secret be in an env variable?</li>
</ul>
<p><b>CLO7-8 (BaaS/templating):</b></p>
<ul>
  <li>What is BaaS and when would you use it over building a server?</li>
  <li>Render a list of products with EJS.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Test as you build, not at the end.</b> After each route, hit it in Postman immediately. Students who write all endpoints then test at minute 80 discover a cascade of bugs with no time to fix. One-route-then-test keeps you always at a working state — the same "thin vertical slice" discipline SWP391 rewards, applied under exam pressure.</div>
<div class="pitfall">On the Final Exam's applied questions, write runnable code, not pseudo-code. "Roughly like this" loses marks; the grader wants correct Mongoose/Express syntax that would actually execute.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Ba bài đánh giá &amp; cách vượt qua</h2>
<p class="lead">Hai cổng quyết định số phận: Practical Exam (85 phút, xây endpoint tại chỗ, ≥4) và Final Exam (60 phút, lý thuyết + áp dụng, ≥4). Progress Test ánh xạ CLO cụ thể. Ôn từng cái có chủ đích.</p>
<h3>Chiến lược Practical Exam (85 phút)</h3>
<div class="lz-flow">
  <div class="lz-step"><b>0–10 phút</b><span>gõ starter đã thuộc: nối Mongoose, schema, router, error handler</span></div>
  <div class="lz-step"><b>10–60 phút</b><span>hiện thực các endpoint yêu cầu + validation + mã trạng thái</span></div>
  <div class="lz-step"><b>60–85 phút</b><span>test mọi route trong Postman, sửa, thêm populate/auth nếu được hỏi</span></div>
</div>
<h3>Snippet khởi đầu — học thuộc bộ khung này</h3>
<div class="out"><pre><span class="tok-keyword">const</span> express = <span class="tok-function">require</span>(<span class="tok-string">'express'</span>);
<span class="tok-keyword">const</span> mongoose = <span class="tok-function">require</span>(<span class="tok-string">'mongoose'</span>);
<span class="tok-keyword">const</span> app = <span class="tok-function">express</span>(); app.<span class="tok-function">use</span>(express.<span class="tok-function">json</span>());
mongoose.<span class="tok-function">connect</span>(process.env.MONGODB_URI);

<span class="tok-keyword">const</span> Item = mongoose.<span class="tok-function">model</span>(<span class="tok-string">'Item'</span>, <span class="tok-keyword">new</span> mongoose.<span class="tok-function">Schema</span>({ name: { type: String, required: <span class="tok-keyword">true</span> } }));

app.<span class="tok-function">get</span>(<span class="tok-string">'/api/items'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> { res.<span class="tok-function">json</span>(<span class="tok-keyword">await</span> Item.<span class="tok-function">find</span>()); } <span class="tok-keyword">catch</span> (e) { <span class="tok-function">next</span>(e); }
});
app.<span class="tok-function">post</span>(<span class="tok-string">'/api/items'</span>, <span class="tok-keyword">async</span> (req, res, next) =&gt; {
  <span class="tok-keyword">try</span> {
    <span class="tok-keyword">if</span> (!req.body.name) <span class="tok-keyword">return</span> res.<span class="tok-function">status</span>(<span class="tok-number">400</span>).<span class="tok-function">json</span>({ error: <span class="tok-string">'name required'</span> });
    res.<span class="tok-function">status</span>(<span class="tok-number">201</span>).<span class="tok-function">json</span>(<span class="tok-keyword">await</span> Item.<span class="tok-function">create</span>(req.body));
  } <span class="tok-keyword">catch</span> (e) { <span class="tok-function">next</span>(e); }
});
app.<span class="tok-function">use</span>((err, req, res, next) =&gt; res.<span class="tok-function">status</span>(<span class="tok-number">500</span>).<span class="tok-function">json</span>({ error: err.message }));
app.<span class="tok-function">listen</span>(<span class="tok-number">3000</span>);</pre>
<em>Nếu bạn gõ được cái này từ trí nhớ trong mười phút, Practical Exam thành "mở rộng một app đang chạy" thay vì "bắt đầu từ file trắng trong hoảng loạn".</em></div>
<h3>Ngân hàng câu hỏi — luyện theo CLO</h3>
<p><b>CLO1-2 (Node/Express):</b></p>
<ul>
  <li>Giải thích event loop và vì sao Node khả mở trên một luồng.</li>
  <li>Viết một middleware log method và URL của mọi request.</li>
  <li><code>express.json()</code> làm gì, và cái gì hỏng nếu không có nó?</li>
</ul>
<p><b>CLO3-5 (Mongoose/REST):</b></p>
<ul>
  <li>Định nghĩa một schema Mongoose có field bắt buộc và một tham chiếu tới User.</li>
  <li>Viết một GET endpoint trả về mọi post với author đã populate.</li>
  <li>Mã trạng thái nào cho: đã tạo, đầu vào sai, không tìm thấy, chưa xác thực?</li>
  <li>Xây một PUT endpoint validate đầu vào và trả 404 nếu id không tồn tại.</li>
</ul>
<p><b>CLO6 (auth):</b></p>
<ul>
  <li>Viết một handler đăng ký băm mật khẩu bằng bcrypt.</li>
  <li>Viết một middleware requireAuth verify một JWT.</li>
  <li>Vì sao JWT secret phải nằm trong biến môi trường?</li>
</ul>
<p><b>CLO7-8 (BaaS/templating):</b></p>
<ul>
  <li>BaaS là gì và khi nào dùng nó thay vì tự xây server?</li>
  <li>Render một danh sách sản phẩm bằng EJS.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Test khi xây, không phải ở cuối.</b> Sau mỗi route, gọi nó trong Postman ngay. Sinh viên viết mọi endpoint rồi test ở phút 80 phát hiện một loạt bug không còn giờ sửa. Một-route-rồi-test giữ bạn luôn ở trạng thái chạy được — cùng kỷ luật "lát cắt dọc mỏng" mà SWP391 thưởng, áp dụng dưới áp lực thi.</div>
<div class="pitfall">Ở câu áp dụng của Final Exam, viết code chạy được, không phải mã giả. "Đại khái như này" mất điểm; giám khảo muốn cú pháp Mongoose/Express đúng, thực sự chạy được.</div>
</div>`,
        },
        {
          title: 'Quiz 7 — Exam readiness|||Quiz 7 — Sẵn sàng thi',
          slug: 'sdn302-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra chiến lược thi và áp dụng kiến thức.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Two components in SDN302 have a ≥4 gate: the Final Exam and…|||Hai thành phần trong SDN302 có cổng ≥4: Final Exam và…', options: ['the Assignment|||Assignment', 'the Practical Exam|||Practical Exam', 'the Progress Test|||Progress Test', 'attendance|||điểm danh'], correctIndex: 1, points: 1 },
              { question: 'The best use of the first 10 minutes of the Practical Exam is to…|||Cách dùng tốt nhất 10 phút đầu Practical Exam là…', options: ['read all questions twice|||đọc mọi câu hai lần', 'type your memorised starter skeleton|||gõ bộ khung starter đã thuộc', 'style the response JSON|||làm đẹp JSON response', 'write documentation|||viết tài liệu'], correctIndex: 1, points: 1 },
              { question: 'While building endpoints under time, you should test each one…|||Khi xây endpoint có tính giờ, bạn nên test mỗi cái…', options: ['all at the very end|||tất cả ở cuối', 'immediately after writing it|||ngay sau khi viết', 'never, to save time|||không bao giờ, để tiết kiệm giờ', 'only if it fails to compile|||chỉ khi không biên dịch'], correctIndex: 1, points: 1 },
              { question: 'On the Final Exam applied questions you should write…|||Ở câu áp dụng của Final Exam bạn nên viết…', options: ['pseudo-code|||mã giả', 'runnable, correct-syntax code|||code chạy được, đúng cú pháp', 'only comments|||chỉ comment', 'a diagram|||một sơ đồ'], correctIndex: 1, points: 1 },
              { question: 'A create endpoint that succeeds should respond with…|||Một endpoint create thành công nên phản hồi…', options: ['200 OK', '201 Created', '400 Bad Request', '204 No Content'], correctIndex: 1, points: 1 },
              { question: 'Testing after every route keeps you at a working state — the same discipline as SWP391\'s… (beyond-syllabus)|||Test sau mỗi route giữ bạn ở trạng thái chạy được — cùng kỷ luật với… của SWP391 (ngoài giáo trình)', options: ['big-bang integration|||tích hợp big-bang', 'thin vertical slice|||lát cắt dọc mỏng', 'waterfall planning|||lập kế hoạch waterfall', 'no testing|||không test'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 (NÂNG CAO ★) — FRAMEWORKS & PRODUCTION ══════════════════ */
    {
      title: 'Chapter 8 (Advanced) — NestJS, Hono & production hardening|||Chương 8 (Nâng cao) — NestJS, Hono & gia cố production',
      description: 'Ngoài giáo trình: framework hiện đại (NestJS/Hono), aggregation pipeline, và gia cố API cho production.',
      lessons: [
        {
          title: '8.1 — NestJS, Hono & the aggregation pipeline|||8.1 — NestJS, Hono & aggregation pipeline',
          slug: 'sdn302-8-1-nestjs-hono',
          type: 'VIDEO',
          description: 'Vì sao có framework có cấu trúc như NestJS, edge framework Hono, và MongoDB aggregation.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1 · ★ Beyond the syllabus</span>
<h2>Beyond Express: NestJS, Hono &amp; aggregation</h2>
<p class="lead">Express is minimal — you impose structure yourself. Larger teams often want structure built in. Two modern frameworks and one powerful MongoDB feature round out your toolkit.</p>
<h3>NestJS — opinionated structure</h3>
<p>NestJS layers TypeScript, dependency injection, and a module/controller/service architecture on top of Express. It enforces the MVC layering you did by hand — useful when many developers share a large codebase.</p>
<div class="out"><pre><span class="tok-comment">// A NestJS controller — decorators declare routes</span>
@<span class="tok-function">Controller</span>(<span class="tok-string">'products'</span>)
<span class="tok-keyword">export class</span> ProductController {
  <span class="tok-function">constructor</span>(<span class="tok-keyword">private</span> service: ProductService) {}
  @<span class="tok-function">Get</span>() <span class="tok-function">findAll</span>() { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.service.<span class="tok-function">findAll</span>(); }
}</pre></div>
<h3>Hono — ultrafast &amp; edge-ready</h3>
<p>Hono is a tiny, fast framework that runs not just on Node but on edge runtimes (Cloudflare Workers, Deno, Bun). Its API resembles Express but is built for the modern, serverless edge.</p>
<h3>MongoDB aggregation pipeline</h3>
<div class="out"><pre><span class="tok-comment">// group orders by user and sum their totals</span>
<span class="tok-keyword">await</span> Order.<span class="tok-function">aggregate</span>([
  { $match: { status: <span class="tok-string">'paid'</span> } },
  { $group: { _id: <span class="tok-string">'\$userId'</span>, total: { $sum: <span class="tok-string">'\$amount'</span> } } },
  { $sort: { total: -<span class="tok-number">1</span> } }
]);</pre>
<em>Aggregation does grouping, joining (<code>$lookup</code>) and computing inside MongoDB — far faster than pulling all data into Node and looping.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Frameworks trade freedom for guardrails.</b> Express gives you total freedom (and total responsibility for structure); NestJS gives you strong conventions (and less freedom). Neither is "better" — the right choice depends on team size and how much structure you want enforced. Understanding this trade-off, rather than memorising one framework, is what lets you pick tools wisely across a career.</div>
<div class="pitfall">Do not reach for NestJS on a tiny project just because it is "advanced" — its structure is overhead you do not need for a 3-resource API. Match the tool's weight to the project's size.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1 · ★ Ngoài giáo trình</span>
<h2>Vượt Express: NestJS, Hono &amp; aggregation</h2>
<p class="lead">Express tối giản — bạn tự áp cấu trúc. Nhóm lớn thường muốn cấu trúc có sẵn. Hai framework hiện đại và một tính năng MongoDB mạnh bổ sung cho bộ công cụ của bạn.</p>
<h3>NestJS — cấu trúc có định hướng</h3>
<p>NestJS phủ TypeScript, dependency injection, và kiến trúc module/controller/service lên trên Express. Nó thực thi phân lớp MVC mà bạn làm bằng tay — hữu ích khi nhiều dev chia sẻ một codebase lớn.</p>
<div class="out"><pre><span class="tok-comment">// Mot controller NestJS — decorator khai bao route</span>
@<span class="tok-function">Controller</span>(<span class="tok-string">'products'</span>)
<span class="tok-keyword">export class</span> ProductController {
  <span class="tok-function">constructor</span>(<span class="tok-keyword">private</span> service: ProductService) {}
  @<span class="tok-function">Get</span>() <span class="tok-function">findAll</span>() { <span class="tok-keyword">return</span> <span class="tok-keyword">this</span>.service.<span class="tok-function">findAll</span>(); }
}</pre></div>
<h3>Hono — cực nhanh &amp; sẵn sàng cho edge</h3>
<p>Hono là một framework nhỏ, nhanh chạy không chỉ trên Node mà trên các edge runtime (Cloudflare Workers, Deno, Bun). API của nó giống Express nhưng được xây cho edge serverless hiện đại.</p>
<h3>MongoDB aggregation pipeline</h3>
<div class="out"><pre><span class="tok-comment">// gom order theo user va tinh tong</span>
<span class="tok-keyword">await</span> Order.<span class="tok-function">aggregate</span>([
  { $match: { status: <span class="tok-string">'paid'</span> } },
  { $group: { _id: <span class="tok-string">'\$userId'</span>, total: { $sum: <span class="tok-string">'\$amount'</span> } } },
  { $sort: { total: -<span class="tok-number">1</span> } }
]);</pre>
<em>Aggregation làm gom nhóm, join (<code>$lookup</code>) và tính toán bên trong MongoDB — nhanh hơn nhiều so với kéo hết dữ liệu vào Node và lặp.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Framework đánh đổi tự do lấy lan can bảo vệ.</b> Express cho bạn tự do hoàn toàn (và trách nhiệm hoàn toàn về cấu trúc); NestJS cho bạn quy ước mạnh (và ít tự do hơn). Không cái nào "tốt hơn" — lựa chọn đúng tuỳ quy mô nhóm và mức cấu trúc bạn muốn thực thi. Hiểu sự đánh đổi này, thay vì học thuộc một framework, là điều giúp bạn chọn công cụ khôn ngoan suốt sự nghiệp.</div>
<div class="pitfall">Đừng vớ NestJS cho một project bé chỉ vì nó "nâng cao" — cấu trúc của nó là gánh nặng bạn không cần cho một API 3 tài nguyên. Khớp trọng lượng công cụ với quy mô project.</div>
</div>`,
        },
        {
          title: '8.2 — Production hardening: env, validation, rate limits & indexes|||8.2 — Gia cố production: env, validation, rate limit & index',
          slug: 'sdn302-8-2-production',
          type: 'VIDEO',
          description: 'Biến một demo thành API bền: env config, validation chặt, rate limiting, index, và logging.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2 · ★ Beyond the syllabus</span>
<h2>Hardening an API for the real world</h2>
<p class="lead">A demo that runs is not a production API. Five habits turn a class project into something you would trust with real users — and they impress in a project presentation.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Config in env</b> — all secrets/URLs from <code>process.env</code>; <code>.env</code> git-ignored.</div>
  <div class="lz-layer"><b>Strong validation</b> — a library like Joi/Zod validates every request body, not just <code>if (!name)</code>.</div>
  <div class="lz-layer"><b>Rate limiting</b> — <code>express-rate-limit</code> caps requests per IP to blunt abuse and brute-force.</div>
  <div class="lz-layer"><b>Indexes</b> — index fields you query/sort on (e.g., <code>email</code> unique) so queries stay fast at scale.</div>
  <div class="lz-layer"><b>Security headers &amp; logging</b> — <code>helmet()</code> for headers, <code>morgan()</code> for request logs.</div>
</div>
<div class="out"><b>Worked example — a unique, indexed email:</b>
<pre>email: { type: String, required: <span class="tok-keyword">true</span>, unique: <span class="tok-keyword">true</span>, index: <span class="tok-keyword">true</span> }</pre>
<em>The unique index both enforces "one account per email" at the database level AND makes login lookups by email fast — two wins from one line.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Validate at the edge, trust nothing inside.</b> Put all input validation in one place (a validation middleware per route) so by the time a request reaches your service layer, the data is already guaranteed clean. This "validate at the boundary" pattern means your business logic never has to defensively re-check inputs — it is a cornerstone of robust back-ends that the CRUD-focused syllabus does not emphasise.</div>
<div class="pitfall">Adding a <code>unique</code> constraint to a schema does NOT retroactively clean existing duplicate data, and the index build can fail if duplicates already exist. Enforce uniqueness from the start, or clean the collection before adding the index.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2 · ★ Ngoài giáo trình</span>
<h2>Gia cố một API cho thế giới thật</h2>
<p class="lead">Một demo chạy được chưa phải API production. Năm thói quen biến một project lớp học thành thứ bạn dám giao cho người dùng thật — và chúng gây ấn tượng khi thuyết trình project.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Config trong env</b> — mọi secret/URL từ <code>process.env</code>; <code>.env</code> git-ignore.</div>
  <div class="lz-layer"><b>Validation mạnh</b> — một thư viện như Joi/Zod validate mọi request body, không chỉ <code>if (!name)</code>.</div>
  <div class="lz-layer"><b>Rate limiting</b> — <code>express-rate-limit</code> giới hạn request mỗi IP để chặn lạm dụng và brute-force.</div>
  <div class="lz-layer"><b>Index</b> — đánh index field bạn truy vấn/sắp xếp (vd <code>email</code> unique) để truy vấn nhanh khi lớn.</div>
  <div class="lz-layer"><b>Header bảo mật &amp; logging</b> — <code>helmet()</code> cho header, <code>morgan()</code> cho log request.</div>
</div>
<div class="out"><b>Ví dụ có lời giải — một email unique có index:</b>
<pre>email: { type: String, required: <span class="tok-keyword">true</span>, unique: <span class="tok-keyword">true</span>, index: <span class="tok-keyword">true</span> }</pre>
<em>Index unique vừa thực thi "một tài khoản mỗi email" ở mức database VỪA làm tra cứu đăng nhập theo email nhanh — hai lợi ích từ một dòng.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Validate ở ranh giới, đừng tin gì bên trong.</b> Đặt mọi validation đầu vào ở một chỗ (một validation middleware mỗi route) để khi một request tới lớp service, dữ liệu đã được đảm bảo sạch. Khuôn "validate ở ranh giới" này nghĩa là logic nghiệp vụ không bao giờ phải phòng thủ kiểm lại đầu vào — một nền tảng của back-end bền mà giáo trình tập trung CRUD không nhấn.</div>
<div class="pitfall">Thêm ràng buộc <code>unique</code> vào schema KHÔNG dọn hồi tố dữ liệu trùng đã có, và việc build index có thể thất bại nếu đã tồn tại bản trùng. Thực thi tính duy nhất từ đầu, hoặc dọn collection trước khi thêm index.</div>
</div>`,
        },
        {
          title: 'Quiz 8 — Frameworks & production|||Quiz 8 — Framework & production',
          slug: 'sdn302-quiz-8',
          type: 'QUIZ',
          description: 'Kiểm tra NestJS/Hono, aggregation, và gia cố production.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Compared to Express, NestJS mainly adds…|||So với Express, NestJS chủ yếu thêm…', options: ['less structure|||ít cấu trúc hơn', 'built-in opinionated structure (DI, modules, TypeScript)|||cấu trúc định hướng sẵn (DI, module, TypeScript)', 'a database engine|||một engine CSDL', 'a front-end|||một front-end'], correctIndex: 1, points: 1 },
              { question: 'The MongoDB aggregation pipeline is used to…|||MongoDB aggregation pipeline dùng để…', options: ['style HTML|||làm đẹp HTML', 'group, join and compute inside the database|||gom, join và tính bên trong database', 'hash passwords|||băm mật khẩu', 'define routes|||định nghĩa route'], correctIndex: 1, points: 1 },
              { question: 'To keep login lookups fast and enforce one account per email, add a…|||Để tra cứu đăng nhập nhanh và ép một tài khoản mỗi email, thêm một…', options: ['plain string field|||field chuỗi thường', 'unique index on email|||index unique trên email', 'bigger server|||server to hơn', 'new collection|||collection mới'], correctIndex: 1, points: 1 },
              { question: 'Rate limiting (express-rate-limit) helps mainly against…|||Rate limiting (express-rate-limit) chủ yếu chống…', options: ['slow databases|||database chậm', 'abuse and brute-force attacks|||lạm dụng và tấn công brute-force', 'CSS bugs|||bug CSS', 'missing indexes|||thiếu index'], correctIndex: 1, points: 1 },
              { question: 'Choosing NestJS for a tiny 3-resource API is usually…|||Chọn NestJS cho một API bé 3 tài nguyên thường là…', options: ['ideal|||lý tưởng', 'unnecessary overhead — match tool weight to project size|||gánh nặng thừa — khớp trọng lượng công cụ với quy mô', 'required|||bắt buộc', 'faster to build|||xây nhanh hơn'], correctIndex: 1, points: 1 },
              { question: 'The "validate at the boundary" pattern means business logic… (beyond-syllabus)|||Khuôn "validate ở ranh giới" nghĩa là logic nghiệp vụ… (ngoài giáo trình)', options: ['re-checks every input defensively|||kiểm lại mọi đầu vào phòng thủ', 'can trust that incoming data is already clean|||có thể tin dữ liệu đến đã sạch', 'skips validation entirely|||bỏ validation hoàn toàn', 'runs in the database|||chạy trong database'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
  ],
};
