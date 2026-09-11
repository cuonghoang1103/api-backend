/**
 * FER202 · Chapter 1 additions — the Slot 1 slide walkthrough + the three
 * setup exercises (Node.js, Create React App, Git). Grounded slide-by-slide in
 * Slot1_What-is-React.pptx (34 slides) and Exercises 1–3 of the course folder.
 * Exported as an array of NEW lessons that FER202.mjs splices into Chapter 1
 * before the chapter quiz. Existing lessons 1.1 / 1.2 are untouched.
 */
import { slide, walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = (t) => `/code-lab/${t}${REF}`;
const EXPHUB = `/exp-hub${REF}`;

/* ═══════════════ 1.3 — Slide walkthrough: Slot 1 (What is React?) ═══════════════ */
const SLIDES = {
  title: '1.3 — Slide by slide: “What is React?” (Slot 1)|||1.3 — Học theo từng slide: “What is React?” (Slot 1)',
  slug: 'fer202-1-3-slot1-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 34 slide của Slot 1 (bộ slide gốc trên lớp) — React là gì, view layer, JSX, Virtual DOM, React 18, cài VS Code/Node/DevTools, kiến trúc Node & npm/package.json, và Git — mỗi slide kèm giải thích song ngữ.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 1 · Lesson 1.3 · Slot 1 deck (34 slides)</span>
<h2>The first lecture, slide by slide</h2>
<p class="lead">Lessons 1.1–1.2 gave you the mental model and the tooling. This lesson is the <strong>actual Slot 1 deck your lecturer uses in class</strong>, every slide shown as an image with a bilingual explanation, so nothing on the projector goes unexplained. Slides 20, 23 and 33 point to the three setup exercises — those are the next lessons in this chapter.</p>`,
      `<span class="eyebrow">Chương 1 · Bài 1.3 · Bộ slide Slot 1 (34 slide)</span>
<h2>Buổi học đầu tiên, theo từng slide</h2>
<p class="lead">Bài 1.1–1.2 đã cho bạn mô hình tư duy và bộ công cụ. Bài này là <strong>chính bộ slide Slot 1 thầy/cô chiếu trên lớp</strong>, mỗi slide là một ảnh kèm giải thích song ngữ, để không có gì trên máy chiếu bị bỏ qua. Slide 20, 23 và 33 dẫn tới ba bài thực hành cài đặt — nằm ngay sau bài này trong chương.</p>`,
    ),
    walkHead('slot1', 1, 34),
    walk('slot1', [
      [1, 'What is React?',
        `<p>Title slide. The whole deck answers one question — what React is and how to set up the tools to write it.</p>`,
        `<p>Slide bìa. Cả bộ slide trả lời một câu hỏi — React là gì và cài bộ công cụ để viết React ra sao.</p>`],
      [2, 'Objectives',
        `<p>The nine things this session covers: an overview of React, what is new in React 18, installing the required dependencies (VS Code, Node.js, Chrome DevTools, React Developer Tools), a Create React App demo and setting up Git. Use this as your checklist for the lecture.</p>`,
        `<p>Chín mục buổi học: tổng quan React, điểm mới ở React 18, cài các phụ thuộc cần thiết (VS Code, Node.js, Chrome DevTools, React Developer Tools), demo Create React App và cài Git. Dùng slide này làm checklist cho buổi học.</p>`],
      [3, 'What is React?',
        `<p><strong>React is “a JavaScript library created by Facebook for building user interfaces (UI)”</strong> — a tool for building reusable UI components and managing an app's state efficiently. The slide previews six themes it will unpack: React is just the view layer · simplicity is good · declarative UI structures · data changes over time · performance matters · the right level of abstraction. Note the wording carefully: React is a <em>library</em>, not a framework — it does one thing (the view) and leaves routing, data-fetching and state architecture to you (or to other libraries).</p>`,
        `<p><strong>React là “một thư viện JavaScript do Facebook tạo ra để xây giao diện người dùng (UI)”</strong> — công cụ dựng các UI component tái sử dụng và quản lý state của ứng dụng hiệu quả. Slide giới thiệu trước sáu ý sẽ mổ xẻ: React chỉ là tầng view · sự đơn giản là tốt · cấu trúc UI khai báo · dữ liệu thay đổi theo thời gian · hiệu năng quan trọng · mức trừu tượng phù hợp. Chú ý câu chữ: React là <em>thư viện</em>, không phải framework — nó làm đúng một việc (view) và để phần routing, lấy dữ liệu, kiến trúc state cho bạn (hoặc thư viện khác).</p>`],
      [4, 'React is just the view layer',
        `<p>In the classic <em>Model–View–Controller</em> split, React is the <strong>View</strong>. You hand data to a React component and it takes care of turning that data into HTML on the page. It does not care where the data came from (an API, a form, a store) — that separation is what keeps React reusable.</p>`,
        `<p>Trong mô hình <em>Model–View–Controller</em> kinh điển, React là phần <strong>View</strong>. Bạn đưa dữ liệu cho một component và nó lo việc biến dữ liệu đó thành HTML trên trang. Nó không quan tâm dữ liệu đến từ đâu (API, form, store) — chính sự tách bạch đó giúp React tái sử dụng được.</p>`],
      [5, 'Simplicity is good — two APIs',
        `<p>React is split into two APIs. The <strong>React Component API</strong> describes the parts of the page; <strong>React DOM</strong> does the actual rendering into the browser. Inside a component you think about four things: <em>data, lifecycle, events and JSX</em>. Keep this list — the rest of the course is essentially those four topics in depth.</p>`,
        `<p>React chia làm hai API. <strong>React Component API</strong> mô tả các phần của trang; <strong>React DOM</strong> thực hiện việc render vào trình duyệt. Trong một component bạn nghĩ về bốn thứ: <em>data, lifecycle, sự kiện và JSX</em>. Ghi nhớ danh sách này — phần còn lại của môn học về cơ bản là bốn chủ đề đó, ở mức sâu.</p>`],
      [6, 'Declarative UI structures — JSX',
        `<p>The syntax React components use is <strong>JSX (JavaScript XML)</strong>. The breakthrough of the declarative approach: you do <em>not</em> perform little step-by-step operations to change the screen. You describe <em>what</em> the UI should look like for the current data, and React figures out <em>how</em> to make the DOM match. Declarative (describe the result) vs imperative (list the steps) is the single most important idea in this slide.</p>`,
        `<p>Cú pháp component React dùng là <strong>JSX (JavaScript XML)</strong>. Điểm đột phá của cách khai báo: bạn <em>không</em> thao tác từng bước nhỏ để đổi màn hình. Bạn mô tả UI <em>trông như thế nào</em> cho dữ liệu hiện tại, còn React tự tìm cách làm cho DOM khớp. Khai báo (mô tả kết quả) đối lập với mệnh lệnh (liệt kê từng bước) — đây là ý quan trọng nhất của slide.</p>`],
      [7, 'Data changes over time',
        `<p>A component's output depends on the <strong>data passed into it</strong>. That data is the dynamic part of the UI: render an element based on a boolean, and the next render can show something different when the boolean flips. React is built to handle that constant re-rendering efficiently — which is the next slide's topic.</p>`,
        `<p>Kết quả của component phụ thuộc vào <strong>dữ liệu truyền vào</strong>. Dữ liệu đó là phần động của UI: render một phần tử dựa trên một boolean, thì lần render sau có thể hiện khác khi boolean đổi. React được thiết kế để xử lý việc render lại liên tục đó một cách hiệu quả — đúng chủ đề slide tiếp theo.</p>`],
      [8, 'Performance matters — diffing & patching',
        `<p>The declarative approach has one challenge: performance. The <strong>DOM</strong> is the browser's live representation of the page, and touching it is slow. React's answer is <strong>diffing and patching</strong>: it transpiles your JSX into imperative DOM API calls, but only for the parts that actually changed. The diagram shows JSX → browser DOM. This is the Virtual DOM idea you met in lesson 1.1, stated in the slide's own words.</p>`,
        `<p>Cách khai báo có một thách thức: hiệu năng. <strong>DOM</strong> là biểu diễn sống của trang trong trình duyệt, và chạm vào nó thì chậm. Câu trả lời của React là <strong>diffing và patching</strong>: nó biên dịch JSX thành các lời gọi DOM API mệnh lệnh, nhưng chỉ cho phần thực sự thay đổi. Sơ đồ minh hoạ JSX → DOM trình duyệt. Đây chính là ý Virtual DOM bạn gặp ở bài 1.1, nói bằng chính lời của slide.</p>`],
      [9, 'The right level of abstraction',
        `<p>React abstracts the <em>rendering target</em> away from your components. The same component pattern powers <strong>React Web</strong> (plain React), <strong>React Native</strong> (mobile), <strong>React Desktop</strong> and even <strong>React Toast</strong>: you implement target-specific components plus a renderer that performs the platform's operations underneath. Lesson to keep: what you learn about components here transfers directly to React Native.</p>`,
        `<p>React trừu tượng hoá <em>đích render</em> ra khỏi component của bạn. Cùng một mẫu component chạy được cho <strong>React Web</strong> (React thuần), <strong>React Native</strong> (di động), <strong>React Desktop</strong> và cả <strong>React Toast</strong>: bạn viết component riêng cho từng đích cộng một renderer thực hiện thao tác của nền tảng bên dưới. Điều đáng nhớ: những gì bạn học về component ở đây chuyển thẳng sang React Native.</p>`],
      [10, 'Key features of React',
        `<p>Three headline features: <strong>Component-Based</strong> (modular, organised, maintainable UI), <strong>Virtual DOM</strong> (optimised updates, better performance) and a <strong>large community</strong> (a huge ecosystem of libraries and answers). These three are the standard "why React?" bullet points for interviews.</p>`,
        `<p>Ba đặc điểm nổi bật: <strong>Dựa trên component</strong> (UI mô-đun, gọn gàng, dễ bảo trì), <strong>Virtual DOM</strong> (cập nhật tối ưu, hiệu năng tốt hơn) và <strong>cộng đồng lớn</strong> (hệ sinh thái thư viện và lời giải khổng lồ). Ba ý này là câu trả lời chuẩn cho câu hỏi phỏng vấn "vì sao chọn React?".</p>`],
      [11, 'What is new in React 18?',
        `<p>Two flagship additions. <strong>Automatic batching</strong>: React groups multiple state updates into a single re-render even inside promises and timeouts, cutting the number of renders and boosting performance. <strong>State transitions</strong> (<code>useTransition</code>/<code>startTransition</code>): mark less-urgent updates as low priority so urgent updates (typing, clicks) stay snappy while heavy updates happen in the background.</p>`,
        `<p>Hai bổ sung chủ lực. <strong>Automatic batching</strong>: React gộp nhiều lần cập nhật state vào một lần render duy nhất, kể cả bên trong promise và timeout, giảm số lần render và tăng hiệu năng. <strong>State transitions</strong> (<code>useTransition</code>/<code>startTransition</code>): đánh dấu các cập nhật ít gấp là ưu tiên thấp, để cập nhật gấp (gõ phím, bấm chuột) vẫn mượt trong khi cập nhật nặng chạy nền.</p>`],
      [12, 'Installing required dependencies',
        `<p>The four tools to install: <strong>VS Code</strong> (code.visualstudio.com — the editor), <strong>Node.js</strong> (nodejs.org — runs the tooling; see slides 13–19), <strong>Chrome DevTools</strong> (built into Chrome) and the <strong>React Developer Tools</strong> extension (Chrome Web Store — adds a "Components" and "Profiler" tab to inspect your React tree). Exercise 1 (next lessons) walks the Node install in detail.</p>`,
        `<p>Bốn công cụ cần cài: <strong>VS Code</strong> (code.visualstudio.com — trình soạn thảo), <strong>Node.js</strong> (nodejs.org — chạy công cụ; xem slide 13–19), <strong>Chrome DevTools</strong> (có sẵn trong Chrome) và tiện ích <strong>React Developer Tools</strong> (Chrome Web Store — thêm tab "Components" và "Profiler" để soi cây React). Exercise 1 (bài kế) hướng dẫn cài Node chi tiết.</p>`],
      [13, 'Web applications — client / server / database',
        `<p>A web app runs on a server and is rendered by a client browser over the internet. It breaks into three parts: <strong>Client</strong> (the browser — React lives here), <strong>Server</strong> (handles requests, business logic) and <strong>Database</strong> (stores data). FER202 is the Client; FER's back-end siblings (PRN, SDN…) are the Server and Database.</p>`,
        `<p>Một web app chạy trên server và được trình duyệt client render qua internet. Nó chia ba phần: <strong>Client</strong> (trình duyệt — React ở đây), <strong>Server</strong> (xử lý request, logic nghiệp vụ) và <strong>Database</strong> (lưu dữ liệu). FER202 là phần Client; các môn back-end anh em (PRN, SDN…) là Server và Database.</p>`],
      [14, 'Node.js — JavaScript on the server',
        `<p><strong>Node.js runs JavaScript outside the browser</strong>, on servers and on your machine. In front-end work you rarely write a Node server, but you rely on Node for the tooling it powers: <em>minification, transpiling, module bundling, package management, CSS preprocessing, testing frameworks and build automation</em>. Every React dev command (<code>npm run dev</code>, <code>vite build</code>) is Node running your tools.</p>`,
        `<p><strong>Node.js chạy JavaScript ngoài trình duyệt</strong>, trên server và trên máy bạn. Làm front-end bạn hiếm khi viết server Node, nhưng phụ thuộc vào Node cho các công cụ nó chạy: <em>nén (minify), transpile, gói module (bundle), quản lý package, tiền xử lý CSS, framework test và tự động hoá build</em>. Mọi lệnh dev React (<code>npm run dev</code>, <code>vite build</code>) đều là Node đang chạy công cụ của bạn.</p>`],
      [15, 'Node architecture',
        `<p>How Node handles many requests with one thread: incoming <strong>Requests</strong> hit the <strong>Node.js Server</strong>, land in the <strong>Event Queue</strong>; the <strong>Event Loop</strong> picks them up, sends blocking work (files, network) to a <strong>Thread Pool</strong> and to <strong>External Resources</strong>, then returns results asynchronously. This non-blocking, single-threaded-with-event-loop design is why Node scales well for I/O — and it is the same event loop that runs your async React data-fetching.</p>`,
        `<p>Cách Node xử lý nhiều request với một luồng: các <strong>Request</strong> tới <strong>Node.js Server</strong>, vào <strong>Event Queue</strong>; <strong>Event Loop</strong> lấy ra, đẩy việc chặn (file, mạng) sang <strong>Thread Pool</strong> và <strong>External Resources</strong>, rồi trả kết quả bất đồng bộ. Thiết kế không-chặn, một-luồng-cộng-event-loop này là lý do Node mở rộng tốt cho I/O — và cũng chính event loop đó chạy phần lấy dữ liệu bất đồng bộ trong React của bạn.</p>`],
      [16, 'Node Package Manager (npm)',
        `<p><strong>npm</strong> manages the ecosystem of Node modules/packages and is the standard package manager for Node. A package contains <strong>JS files</strong> plus a <strong>package.json (manifest)</strong>. When you "install React", npm downloads React's package into <code>node_modules/</code> and records it in your <code>package.json</code>.</p>`,
        `<p><strong>npm</strong> quản lý hệ sinh thái module/package của Node và là trình quản lý package chuẩn của Node. Một package gồm <strong>các file JS</strong> cộng một <strong>package.json (manifest)</strong>. Khi bạn "cài React", npm tải package React về <code>node_modules/</code> và ghi lại vào <code>package.json</code> của bạn.</p>`],
      [17, 'package.json',
        `<p>The manifest gives you three things: it <strong>documents which packages your project depends on</strong>, lets you <strong>pin versions</strong> using semantic-versioning rules, and makes your build <strong>reproducible</strong> and easy to share. (Source on the slide: docs.npmjs.com.) Because of the lock file, a teammate who clones your repo and runs <code>npm install</code> gets the exact same dependency tree.</p>`,
        `<p>Manifest cho bạn ba điều: <strong>ghi rõ dự án phụ thuộc package nào</strong>, cho phép <strong>ghim phiên bản</strong> theo quy tắc semantic versioning, và làm build <strong>tái lập được</strong> và dễ chia sẻ. (Nguồn trên slide: docs.npmjs.com.) Nhờ file lock, đồng đội clone repo và chạy <code>npm install</code> sẽ có cây phụ thuộc y hệt.</p>`],
      [18, 'Initializing package.json',
        `<p>Create a manifest with <code>npm init</code> (interactive) or <code>npm init -y</code> (accept defaults). With a package.json present, <code>npm install</code> installs everything listed; <code>npm install &lt;name&gt;</code> adds one package — e.g. <code>npm i bootstrap@5.3.1</code> installs exactly Bootstrap 5.3.1. Remember <code>i</code> is short for <code>install</code>.</p>`,
        `<p>Tạo manifest bằng <code>npm init</code> (hỏi từng bước) hoặc <code>npm init -y</code> (nhận mặc định). Khi đã có package.json, <code>npm install</code> cài mọi thứ được liệt kê; <code>npm install &lt;tên&gt;</code> thêm một package — ví dụ <code>npm i bootstrap@5.3.1</code> cài đúng Bootstrap 5.3.1. Nhớ <code>i</code> là viết tắt của <code>install</code>.</p>`],
      [19, 'Using npm — install flags',
        `<p>Useful flags: <code>--save-dev</code> (adds to <em>devDependencies</em> — tools only needed while developing, e.g. a bundler or test runner), <code>--no-save</code> (install without recording), <code>--save-optional</code> (optionalDependencies — a failed build of these will not fail the install), <code>--no-optional</code> (skip optional deps), <code>--force</code> (push through conflicts — use with care). Knowing dependencies vs devDependencies is a common exam and interview point.</p>`,
        `<p>Các cờ hữu ích: <code>--save-dev</code> (thêm vào <em>devDependencies</em> — công cụ chỉ cần khi phát triển, ví dụ bundler hay test runner), <code>--no-save</code> (cài mà không ghi lại), <code>--save-optional</code> (optionalDependencies — nếu build các gói này hỏng thì không làm hỏng cả cài đặt), <code>--no-optional</code> (bỏ qua gói tuỳ chọn), <code>--force</code> (ép qua xung đột — dùng cẩn thận). Phân biệt dependencies với devDependencies là điểm hay ra trong đề và phỏng vấn.</p>`],
      [20, 'Exercise 1: Install Node.js',
        `<p>Hand-off to <strong>Exercise 1</strong> — installing Node.js and npm and verifying with <code>node -v</code> / <code>npm -v</code>. The full step-by-step (with the exact commands per OS) is the next lesson, "Exercise 1 — Install Node.js & npm".</p>`,
        `<p>Chuyển sang <strong>Exercise 1</strong> — cài Node.js và npm rồi kiểm bằng <code>node -v</code> / <code>npm -v</code>. Toàn bộ các bước (kèm lệnh cụ thể cho từng hệ điều hành) nằm ở bài kế, "Exercise 1 — Cài Node.js & npm".</p>`],
      [21, 'Example Node.js — a web server',
        `<p>The canonical Node example: a few lines that start an HTTP server printing "Hello FPT University". You will not build servers in FER202, but seeing that Node <em>can</em> serve HTTP makes the "JavaScript everywhere" point concrete — the same language runs your UI and, in other courses, your API.</p>`,
        `<p>Ví dụ Node kinh điển: vài dòng khởi động một HTTP server in ra "Hello FPT University". Bạn sẽ không dựng server trong FER202, nhưng thấy Node <em>có thể</em> phục vụ HTTP làm rõ ý "JavaScript ở mọi nơi" — cùng một ngôn ngữ chạy UI của bạn và, ở môn khác, chạy API.</p>`],
      [22, 'How much JavaScript do you need?',
        `<p>The checklist of JS you should be comfortable with before React: lexical structure, expressions, data types, variables, functions, <code>this</code>, <strong>arrow functions</strong>, loops, scopes, arrays, classes, <strong>template literals</strong>, strict mode, <strong>ES6+</strong>, <strong>async programming &amp; callbacks</strong>, timers, <strong>Promises</strong>, <strong>async/await</strong>, closures and the event loop. Chapter 2 (ES6) drills the highlighted ones — they are the exact features React code leans on.</p>`,
        `<p>Danh sách JS bạn nên thạo trước khi vào React: cấu trúc từ vựng, biểu thức, kiểu dữ liệu, biến, hàm, <code>this</code>, <strong>arrow function</strong>, vòng lặp, phạm vi, mảng, class, <strong>template literal</strong>, strict mode, <strong>ES6+</strong>, <strong>lập trình bất đồng bộ &amp; callback</strong>, timer, <strong>Promise</strong>, <strong>async/await</strong>, closure và event loop. Chương 2 (ES6) luyện những mục in đậm — đúng các tính năng mà code React dựa vào.</p>`],
      [23, 'Exercise 2: Create a new React app',
        `<p>Hand-off to <strong>Exercise 2</strong> — creating your first app with Create React App. Full walkthrough in the lesson "Exercise 2 — Your first React app".</p>`,
        `<p>Chuyển sang <strong>Exercise 2</strong> — tạo app đầu tiên bằng Create React App. Hướng dẫn đầy đủ ở bài "Exercise 2 — App React đầu tiên".</p>`],
      [24, 'Demo — Create React App',
        `<p>The command: <code>npx create-react-app my-new-app</code> then <code>cd my-new-app</code>. <code>npx</code> runs the CRA generator without a global install; it scaffolds a folder with the project structure and files. The slide flags two things — naming your app and making your first app. (Modern note: the React team now recommends <strong>Vite</strong> or a framework over CRA, but the generated structure and mental model are the same, which is why the course still demos CRA.)</p>`,
        `<p>Lệnh: <code>npx create-react-app my-new-app</code> rồi <code>cd my-new-app</code>. <code>npx</code> chạy trình sinh CRA mà không cần cài toàn cục; nó dựng một thư mục với cấu trúc dự án và các file. Slide lưu hai điều — đặt tên app và tạo app đầu tiên. (Ghi chú hiện đại: đội React nay khuyến nghị <strong>Vite</strong> hoặc một framework thay cho CRA, nhưng cấu trúc sinh ra và mô hình tư duy vẫn như nhau, nên môn học vẫn demo CRA.)</p>`],
      [25, 'Run the React app',
        `<p><code>npm start</code> starts the dev server and opens <code>http://localhost:3000</code> with hot-reload — edit a file, the browser updates instantly. <code>Ctrl+C</code> stops it. This edit-save-see loop is how you will work for the rest of the course.</p>`,
        `<p><code>npm start</code> khởi động dev server và mở <code>http://localhost:3000</code> với hot-reload — sửa file, trình duyệt cập nhật ngay. <code>Ctrl+C</code> để dừng. Vòng lặp sửa–lưu–xem này là cách bạn làm việc suốt phần còn lại của môn.</p>`],
      [26, 'Git',
        `<p>Section divider — the rest of the deck is about Git, the version control you will use to submit every lab.</p>`,
        `<p>Slide phân mục — phần còn lại của bộ slide nói về Git, công cụ quản lý phiên bản bạn dùng để nộp mọi bài lab.</p>`],
      [27, 'Some basic concepts',
        `<p><strong>Version control</strong> = tools that manage changes to source code and keep a history. Several exist (CVS, SVN, Git). <strong>Git</strong> is a <em>distributed</em> version control system created by Linus Torvalds for the Linux kernel, now used everywhere — the Node ecosystem runs on it. "Distributed" means every clone is a full copy of the history, so you can commit offline.</p>`,
        `<p><strong>Quản lý phiên bản</strong> = công cụ quản lý thay đổi mã nguồn và lưu lịch sử. Có nhiều (CVS, SVN, Git). <strong>Git</strong> là hệ quản lý phiên bản <em>phân tán</em> do Linus Torvalds tạo cho nhân Linux, nay dùng khắp nơi — hệ sinh thái Node sống nhờ nó. "Phân tán" nghĩa là mỗi bản clone là một bản sao đầy đủ của lịch sử, nên bạn commit được cả khi offline.</p>`],
      [28, 'Git install',
        `<p>Download from <strong>git-scm.com/downloads</strong>, run the installer, accept the terms, and verify with <code>git --version</code> — if it prints a version, Git is installed. The full exercise is lesson "Exercise 3 — Git".</p>`,
        `<p>Tải ở <strong>git-scm.com/downloads</strong>, chạy trình cài, đồng ý điều khoản, rồi kiểm bằng <code>git --version</code> — nếu in ra phiên bản là đã cài xong. Bài đầy đủ ở "Exercise 3 — Git".</p>`],
      [29, 'Online Git repository',
        `<p>Where your history lives remotely: <strong>GitHub</strong> (github.com) or <strong>Bitbucket</strong> (bitbucket.org). You push local commits up so the instructor can grade from your repo and your work is backed up.</p>`,
        `<p>Nơi lịch sử của bạn ở trên mạng: <strong>GitHub</strong> (github.com) hoặc <strong>Bitbucket</strong> (bitbucket.org). Bạn đẩy (push) commit cục bộ lên để giảng viên chấm từ repo và công việc được sao lưu.</p>`],
      [30, 'Config Git',
        `<p>First-time setup: <code>git config --global user.name "..."</code> and <code>git config --global user.email "..."</code> stamp your identity on commits. Then <code>cd myproject</code> and <code>git init</code> starts tracking the folder. Do the config once per machine.</p>`,
        `<p>Cài lần đầu: <code>git config --global user.name "..."</code> và <code>git config --global user.email "..."</code> gắn danh tính vào commit. Rồi <code>cd myproject</code> và <code>git init</code> bắt đầu theo dõi thư mục. Config chỉ cần một lần mỗi máy.</p>`],
      [31, 'Using Git — the everyday commands',
        `<p>The core loop: <code>git remote add origin &lt;url&gt;</code> (link the remote once) · <code>git add 'file'</code> or <code>git add --all</code> (stage) · <code>git status</code> (see what changed) · <code>git commit -m "message"</code> (save a snapshot) · <code>git log</code> (history) · <code>git branch 'name'</code> + <code>git checkout name</code> (branch and switch) · <code>git push -u origin master</code> (upload). Memorise add → commit → push.</p>`,
        `<p>Vòng lặp cốt lõi: <code>git remote add origin &lt;url&gt;</code> (liên kết remote một lần) · <code>git add 'file'</code> hoặc <code>git add --all</code> (đưa vào staging) · <code>git status</code> (xem đã đổi gì) · <code>git commit -m "message"</code> (lưu một ảnh chụp) · <code>git log</code> (lịch sử) · <code>git branch 'tên'</code> + <code>git checkout tên</code> (tạo và chuyển nhánh) · <code>git push -u origin master</code> (đẩy lên). Thuộc lòng add → commit → push.</p>`],
      [32, 'Quick setup with Git',
        `<p>The GitHub "quick setup" panel you see after creating an empty repo — the four numbered lines are exactly the sequence from slide 30–31: init, add, commit, then set the remote and push. When in doubt, copy those lines from GitHub's own page.</p>`,
        `<p>Bảng "quick setup" của GitHub hiện ra sau khi tạo repo rỗng — bốn dòng đánh số đúng là trình tự ở slide 30–31: init, add, commit, rồi đặt remote và push. Khi phân vân, cứ chép các dòng đó từ chính trang GitHub.</p>`],
      [33, 'Exercise 3: Install, set up & push code to Git',
        `<p>Hand-off to <strong>Exercise 3</strong> — install Git, configure it, and push a first repository to GitHub. Full walkthrough in "Exercise 3 — Git".</p>`,
        `<p>Chuyển sang <strong>Exercise 3</strong> — cài Git, cấu hình, và đẩy repository đầu tiên lên GitHub. Hướng dẫn đầy đủ ở "Exercise 3 — Git".</p>`],
      [34, 'Summary',
        `<p>Recap of the nine objectives: React overview, what is new in React 18, installing dependencies (VS Code, Node.js, Chrome DevTools, React Developer Tools), the Create React App demo and setting up Git. If you can explain each line here in your own words, you have Slot 1.</p>`,
        `<p>Tóm tắt chín mục tiêu: tổng quan React, điểm mới React 18, cài phụ thuộc (VS Code, Node.js, Chrome DevTools, React Developer Tools), demo Create React App và cài Git. Nếu bạn giải thích được từng dòng ở đây bằng lời của mình, bạn đã nắm Slot 1.</p>`],
    ]),
    books([
      ['reactdoc', 'Quick Start (react.dev/learn) — “Thinking in React” for the view-layer idea', 'Quick Start (react.dev/learn) — mục “Thinking in React” cho ý tầng view'],
      ['mdn', 'JavaScript first steps & the DOM, to back slides 8, 15 and 22', 'JavaScript nhập môn & DOM, bổ trợ slide 8, 15 và 22'],
    ]),
  ].join('\n'),
};

/* ═══════════════ Exercise 1 — Install Node.js & npm ═══════════════ */
const EX1 = {
  title: 'Exercise 1 — Install Node.js & npm|||Exercise 1 — Cài Node.js & npm',
  slug: 'fer202-1-ex1-nodejs',
  type: 'EXERCISE',
  description: 'Bài thực hành 1 của môn: tải & cài Node.js LTS và npm trên Windows/macOS/Linux, rồi kiểm tra bằng node -v / npm -v.',
  content: bi(
    `<span class="eyebrow">Chapter 1 · Exercise 1 · Slot 1 slide 20</span>
<h2>Download &amp; install Node.js and npm</h2>
<p class="lead"><b>Goal:</b> get Node.js (a server-side JavaScript runtime) and npm (its package manager) onto your machine — the foundation every later exercise builds on.</p>
<h3>Steps</h3>
<ol>
  <li>Open the official site <a href="https://nodejs.org" target="_blank" rel="noopener">https://nodejs.org</a>.</li>
  <li>You will see two builds: <strong>LTS</strong> (Long-Term Support) and <strong>Current</strong>. Choose <strong>LTS</strong> for stability.</li>
  <li>Click the LTS button to download the installer.</li>
  <li>Run the installer:
    <ul>
      <li><b>Windows:</b> double-click the <code>.msi</code>, follow the wizard, keep the default options (they include npm and “Add to PATH”).</li>
      <li><b>macOS:</b> open the <code>.pkg</code> and follow the steps.</li>
      <li><b>Linux (Debian/Ubuntu):</b> <code>sudo dpkg -i &lt;file&gt;.deb</code>, or better use <code>nvm</code> / your distro's package manager.</li>
    </ul>
  </li>
  <li>Verify Node: open a terminal and run <code>node -v</code> — a version number means success.</li>
  <li>Verify npm: run <code>npm -v</code> — a version number means npm installed too.</li>
</ol>
<pre><span class="tok-comment"># expected output (versions will differ)</span>
$ node -v
v20.11.1
$ npm -v
10.2.4</pre>
<div class="pitfall"><b>Common trap:</b> after installing, a terminal you already had open still uses the old PATH — <strong>close and reopen the terminal</strong> (or your whole editor) before running <code>node -v</code>, otherwise you get “command not found” even though Node is installed.</div>
<div class="callout"><span class="badge">★ Tip</span> Prefer <strong>nvm</strong> (Node Version Manager) on macOS/Linux, or <strong>nvm-windows</strong>. It lets you switch Node versions per project — invaluable once you juggle several courses/projects with different Node requirements.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Full environment setup guide</span><span class="lc-sub">Node, VS Code, extensions — on Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
    `<span class="eyebrow">Chương 1 · Exercise 1 · Slot 1 slide 20</span>
<h2>Tải &amp; cài Node.js và npm</h2>
<p class="lead"><b>Mục tiêu:</b> đưa Node.js (môi trường chạy JavaScript phía server) và npm (trình quản lý package của nó) lên máy — nền tảng cho mọi bài sau.</p>
<h3>Các bước</h3>
<ol>
  <li>Mở trang chính thức <a href="https://nodejs.org" target="_blank" rel="noopener">https://nodejs.org</a>.</li>
  <li>Bạn sẽ thấy hai bản: <strong>LTS</strong> (Hỗ trợ dài hạn) và <strong>Current</strong>. Chọn <strong>LTS</strong> cho ổn định.</li>
  <li>Bấm nút LTS để tải trình cài.</li>
  <li>Chạy trình cài:
    <ul>
      <li><b>Windows:</b> bấm đúp file <code>.msi</code>, theo trình hướng dẫn, giữ tuỳ chọn mặc định (đã gồm npm và “Add to PATH”).</li>
      <li><b>macOS:</b> mở file <code>.pkg</code> và làm theo các bước.</li>
      <li><b>Linux (Debian/Ubuntu):</b> <code>sudo dpkg -i &lt;file&gt;.deb</code>, hoặc tốt hơn dùng <code>nvm</code> / trình quản lý gói của bản phân phối.</li>
    </ul>
  </li>
  <li>Kiểm Node: mở terminal, chạy <code>node -v</code> — hiện số phiên bản là thành công.</li>
  <li>Kiểm npm: chạy <code>npm -v</code> — hiện số phiên bản là npm cũng đã cài.</li>
</ol>
<pre><span class="tok-comment"># kết quả mong đợi (phiên bản có thể khác)</span>
$ node -v
v20.11.1
$ npm -v
10.2.4</pre>
<div class="pitfall"><b>Bẫy thường gặp:</b> sau khi cài, terminal đang mở sẵn vẫn dùng PATH cũ — hãy <strong>đóng và mở lại terminal</strong> (hoặc cả editor) trước khi chạy <code>node -v</code>, nếu không sẽ báo “command not found” dù Node đã cài.</div>
<div class="callout"><span class="badge">★ Mẹo</span> Nên dùng <strong>nvm</strong> (Node Version Manager) trên macOS/Linux, hoặc <strong>nvm-windows</strong>. Nó cho phép đổi phiên bản Node theo từng dự án — cực hữu ích khi bạn làm nhiều môn/dự án cần Node khác nhau.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Hướng dẫn cài môi trường đầy đủ</span><span class="lc-sub">Node, VS Code, tiện ích — trên Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
  ),
};

/* ═══════════════ Exercise 2 — Your first React app ═══════════════ */
const EX2 = {
  title: 'Exercise 2 — Your first React app|||Exercise 2 — App React đầu tiên',
  slug: 'fer202-1-ex2-first-app',
  type: 'EXERCISE',
  description: 'Bài thực hành 2: tạo app bằng Create React App, chạy dev server, và dọn index.js/App.js về mức tối giản để bắt đầu.',
  content: bi(
    `<span class="eyebrow">Chapter 1 · Exercise 2 · Slot 1 slides 23–25</span>
<h2>Set up your first React application</h2>
<p class="lead"><b>Goal:</b> scaffold, run and trim a fresh React app so you understand its structure before adding your own code.</p>
<h3>Steps</h3>
<ol>
  <li>Create the app (no global install needed thanks to <code>npx</code>):
<pre>npx create-react-app my-app
cd my-app</pre></li>
  <li>Start the dev server:
<pre>npm start</pre>
  It opens <code>http://localhost:3000</code> with the spinning-logo starter page and hot-reload.</li>
  <li>Stop the server any time with <kbd>Ctrl</kbd>+<kbd>C</kbd>.</li>
  <li>Open <code>src/</code> — the two files that matter first are <code>index.js</code> (the entry point) and <code>App.js</code> (your root component).</li>
  <li>Replace <code>src/index.js</code> with the minimal version below to strip the starter styling and start clean:</li>
</ol>
<pre><span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">ReactDOM</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-dom/client&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./App&#x27;</span>;

<span class="hljs-keyword">const</span> root = <span class="hljs-title class_">ReactDOM</span>.<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>));
root.<span class="hljs-title function_">render</span>(<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span></span>);</pre>
<div class="out"><b>Result:</b> a clean app. <code>createRoot</code> grabs the single <code>&lt;div id="root"&gt;</code> in <code>public/index.html</code> and mounts your <code>&lt;App /&gt;</code> tree into it — that one div is the whole SPA.</div>
<h3>Understand the structure</h3>
<table>
<thead><tr><th>Path</th><th>What it is</th></tr></thead>
<tbody>
<tr><td><code>public/index.html</code></td><td>the single HTML shell; holds <code>&lt;div id="root"&gt;</code></td></tr>
<tr><td><code>src/index.js</code></td><td>entry point — mounts React into <code>#root</code></td></tr>
<tr><td><code>src/App.js</code></td><td>your root component</td></tr>
<tr><td><code>package.json</code></td><td>scripts &amp; dependencies</td></tr>
<tr><td><code>node_modules/</code></td><td>installed packages (never commit)</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> The starter uses <code>&lt;React.StrictMode&gt;</code> in the original index.js. In development it intentionally <strong>double-invokes</strong> your components to surface impure code — that is why a <code>console.log</code> in a component can print twice locally. It does not happen in production builds.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB('react')}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Edit App.js live</span><span class="lc-sub">Try the app structure in the browser — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 1 · Exercise 2 · Slot 1 slide 23–25</span>
<h2>Dựng app React đầu tiên</h2>
<p class="lead"><b>Mục tiêu:</b> tạo, chạy và tinh giản một app React mới để hiểu cấu trúc trước khi thêm code của mình.</p>
<h3>Các bước</h3>
<ol>
  <li>Tạo app (không cần cài toàn cục nhờ <code>npx</code>):
<pre>npx create-react-app my-app
cd my-app</pre></li>
  <li>Khởi động dev server:
<pre>npm start</pre>
  Nó mở <code>http://localhost:3000</code> với trang mẫu logo xoay và hot-reload.</li>
  <li>Dừng server bất cứ lúc nào bằng <kbd>Ctrl</kbd>+<kbd>C</kbd>.</li>
  <li>Mở <code>src/</code> — hai file quan trọng đầu tiên là <code>index.js</code> (điểm vào) và <code>App.js</code> (component gốc).</li>
  <li>Thay <code>src/index.js</code> bằng bản tối giản dưới đây để bỏ style mẫu và bắt đầu sạch:</li>
</ol>
<pre><span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">ReactDOM</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-dom/client&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-title class_">App</span> <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./App&#x27;</span>;

<span class="hljs-keyword">const</span> root = <span class="hljs-title class_">ReactDOM</span>.<span class="hljs-title function_">createRoot</span>(<span class="hljs-variable language_">document</span>.<span class="hljs-title function_">getElementById</span>(<span class="hljs-string">&#x27;root&#x27;</span>));
root.<span class="hljs-title function_">render</span>(<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">App</span> /&gt;</span></span>);</pre>
<div class="out"><b>Kết quả:</b> một app sạch. <code>createRoot</code> lấy đúng một <code>&lt;div id="root"&gt;</code> trong <code>public/index.html</code> và gắn cây <code>&lt;App /&gt;</code> vào đó — chính cái div đó là toàn bộ SPA.</div>
<h3>Hiểu cấu trúc</h3>
<table>
<thead><tr><th>Đường dẫn</th><th>Là gì</th></tr></thead>
<tbody>
<tr><td><code>public/index.html</code></td><td>khung HTML duy nhất; chứa <code>&lt;div id="root"&gt;</code></td></tr>
<tr><td><code>src/index.js</code></td><td>điểm vào — gắn React vào <code>#root</code></td></tr>
<tr><td><code>src/App.js</code></td><td>component gốc của bạn</td></tr>
<tr><td><code>package.json</code></td><td>scripts &amp; dependencies</td></tr>
<tr><td><code>node_modules/</code></td><td>package đã cài (không commit)</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Bản mẫu dùng <code>&lt;React.StrictMode&gt;</code> trong index.js gốc. Khi phát triển nó cố ý <strong>gọi component hai lần</strong> để lộ code không thuần khiết — đó là lý do một <code>console.log</code> trong component có thể in hai lần ở máy bạn. Điều này không xảy ra ở bản build production.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB('react')}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Sửa App.js trực tiếp</span><span class="lc-sub">Thử cấu trúc app ngay trên trình duyệt — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

/* ═══════════════ Exercise 3 — Git ═══════════════ */
const EX3 = {
  title: 'Exercise 3 — Git: install, set up & push|||Exercise 3 — Git: cài, cấu hình & push',
  slug: 'fer202-1-ex3-git',
  type: 'EXERCISE',
  description: 'Bài thực hành 3: cài Git, cấu hình danh tính, khởi tạo repo, commit và đẩy code lên GitHub — quy trình nộp mọi bài lab.',
  content: bi(
    `<span class="eyebrow">Chapter 1 · Exercise 3 · Slot 1 slides 26–33</span>
<h2>Install, set up &amp; push code to Git</h2>
<p class="lead"><b>Goal:</b> put a project under version control and push it to GitHub — the exact flow you use to submit labs.</p>
<h3>1 · Install &amp; verify</h3>
<pre>git --version   <span class="tok-comment"># prints a version if Git is installed (download at git-scm.com)</span></pre>
<h3>2 · Configure your identity (once per machine)</h3>
<pre>git config --global user.name  <span class="tok-string">"Your Name"</span>
git config --global user.email <span class="tok-string">"you@example.com"</span></pre>
<h3>3 · Create a repo on GitHub</h3>
<p>Sign in at <a href="https://github.com" target="_blank" rel="noopener">github.com</a>, click <b>New</b>, name it, create it (empty, no README so the quick-setup panel shows). Copy the repository URL.</p>
<h3>4 · Initialise, commit &amp; push</h3>
<pre>cd my-app
git init
git add --all
git commit -m <span class="tok-string">"Initial commit"</span>
git branch -M main
git remote add origin &lt;repository URL&gt;
git push -u origin main</pre>
<div class="out"><b>Result:</b> refresh the GitHub page — your files are there. From now on the daily loop is <code>git add</code> → <code>git commit -m "..."</code> → <code>git push</code>.</div>
<div class="pitfall"><b>Two classic traps.</b> (1) Add a <code>.gitignore</code> with <code>node_modules/</code> <em>before</em> your first <code>git add --all</code>, or you will commit tens of thousands of files. CRA/Vite generate one for you. (2) The slides say <code>origin master</code>; new GitHub repos default to <code>main</code>. Match your remote's default branch (use <code>git branch -M main</code> as above).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> Prefer feature branches: <code>git checkout -b feature/login</code>, commit there, push, then open a <strong>Pull Request</strong> on GitHub to merge into <code>main</code>. It keeps <code>main</code> always working and is exactly how teams (and PRJ301/SWP391) collaborate.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Git &amp; GitHub setup guide</span><span class="lc-sub">Auth, SSH keys, first push — on Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
    `<span class="eyebrow">Chương 1 · Exercise 3 · Slot 1 slide 26–33</span>
<h2>Cài, cấu hình &amp; push code lên Git</h2>
<p class="lead"><b>Mục tiêu:</b> đưa một dự án vào quản lý phiên bản và đẩy lên GitHub — đúng quy trình bạn dùng để nộp lab.</p>
<h3>1 · Cài &amp; kiểm</h3>
<pre>git --version   <span class="tok-comment"># in ra phiên bản nếu Git đã cài (tải ở git-scm.com)</span></pre>
<h3>2 · Cấu hình danh tính (một lần mỗi máy)</h3>
<pre>git config --global user.name  <span class="tok-string">"Tên của bạn"</span>
git config --global user.email <span class="tok-string">"you@example.com"</span></pre>
<h3>3 · Tạo repo trên GitHub</h3>
<p>Đăng nhập <a href="https://github.com" target="_blank" rel="noopener">github.com</a>, bấm <b>New</b>, đặt tên, tạo (để trống, không README để bảng quick-setup hiện ra). Chép URL repository.</p>
<h3>4 · Khởi tạo, commit &amp; push</h3>
<pre>cd my-app
git init
git add --all
git commit -m <span class="tok-string">"Initial commit"</span>
git branch -M main
git remote add origin &lt;repository URL&gt;
git push -u origin main</pre>
<div class="out"><b>Kết quả:</b> tải lại trang GitHub — file của bạn đã ở đó. Từ nay vòng lặp hằng ngày là <code>git add</code> → <code>git commit -m "..."</code> → <code>git push</code>.</div>
<div class="pitfall"><b>Hai bẫy kinh điển.</b> (1) Thêm file <code>.gitignore</code> chứa <code>node_modules/</code> <em>trước</em> lần <code>git add --all</code> đầu tiên, nếu không bạn sẽ commit hàng vạn file. CRA/Vite tự sinh sẵn một file. (2) Slide ghi <code>origin master</code>; repo GitHub mới mặc định là <code>main</code>. Hãy khớp nhánh mặc định của remote (dùng <code>git branch -M main</code> như trên).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> Nên dùng nhánh tính năng: <code>git checkout -b feature/login</code>, commit ở đó, push, rồi mở <strong>Pull Request</strong> trên GitHub để gộp vào <code>main</code>. Cách này giữ <code>main</code> luôn chạy được và đúng cách các nhóm (và PRJ301/SWP391) cộng tác.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Hướng dẫn cài Git &amp; GitHub</span><span class="lc-sub">Xác thực, SSH key, push đầu tiên — trên Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
  ),
};

export default [SLIDES, EX1, EX2, EX3];
