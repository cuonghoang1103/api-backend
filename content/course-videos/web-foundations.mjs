/**
 * Curated YouTube track for the "Nền tảng Lập trình Web" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 *
 * ⚠️ CREDIT ĐỂ TRỐNG LÀ CỐ Ý — CHƯA XÁC MINH ĐƯỢC TỪ MÁY DỰNG.
 * Mọi id lấy từ kết quả tìm kiếm SỐNG (25/08/2026), kèm tiêu đề mong đợi ghi ở
 * chú thích cuối dòng. Máy dựng khoá bị chặn ra youtube.com nên KHÔNG gọi được
 * oEmbed ⇒ không đọc được tên kênh, không biết video có cho nhúng hay không.
 * verify coi credit rỗng là HỢP LỆ; --fix-credits điền đúng "Kênh — Tiêu đề".
 *
 * CHẠY HAI LỆNH NÀY THEO ĐÚNG THỨ TỰ:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/web-foundations.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/web-foundations.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'web-foundations',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu, nền tảng & cài đặt ── */
    'wf-0-1-gioi-thieu-lo-trinh': { yt: 'tPRPJjaTSgQ', credit: '' }, // 4. Learn Web Development From Scratch: How to Install & Use Visual Studio Code | HTML For Beginners
    'wf-0-2-web-hoat-dong': { yt: 'qd_sb84_VAg', credit: '' },       // HTTP Request Methods + Status Code (HTTP Concepts - Part 2)
    'wf-0-3-cai-dat-may': { yt: '77V9y8k3PV0', credit: '' },         // Setup Web Development Environment in VS Code – Beginner-Friendly Guide
    'wf-0-4-cach-hoc': { yt: 'XpulVva97eU', credit: '' },            // How to Think Like a Programmer - Problem Solving & Find Time to Code

    /* ── Chương 1 — Hộp đồ nghề: terminal, VS Code, Git, npm ── */
    'wf-1-1-terminal': { yt: 'oK8EvVeVltE', credit: '' }, // 1.5: Intro to the Command Line - Git and GitHub for Poets
    'wf-1-2-vscode': { yt: '4NfFFsQC77M', credit: '' },   // Visual Studio Code Web Dev Setup In 6 Minutes
    'wf-1-3-git': { yt: 'HVsySz-h9r4', credit: '' },      // Git Tutorial for Beginners: Command-Line Fundamentals
    'wf-1-4-github': { yt: 'c6OXmAlpS9c', credit: '' },   // Using the Terminal and Command Prompt | GitHub Tutorial
    'wf-1-5-node-npm': { yt: 'XQMqmGk_Mqk', credit: '' }, // npm Tutorial - 1 - Installation - npm Tutorial For Beginners

    /* ── Chương 2 — HTML: bộ khung của mọi trang web ── */
    'wf-2-1-html-basics': { yt: 'YXCbjS2fxzU', credit: '' },       // HTML5 Semantic Markup Tags & Layout - HTML Tutorial for Beginners
    'wf-2-2-text-links-images': { yt: 'kGW8Al_cga4', credit: '' }, // HTML & CSS Crash Course Tutorial #6 - HTML 5 Semantics
    'wf-2-3-semantic-html': { yt: 'kX3TfdUqpuU', credit: '' },     // Semantic HTML Tags | HTML5 Semantic Elements Tutorial
    'wf-2-4-forms': { yt: 'NNozarQM7J0', credit: '' },             // HTML Forms | Input, Label, Select, Textarea Element - Exercise 7
    'wf-2-5-tables-media-a11y': { yt: 'elKGz9r5qGw', credit: '' }, // HTML Table Accessibility: A Beginner's Guide to Semantic Structure & Screen Readers

    /* ── Chương 3 — CSS & thiết kế đáp ứng ── */
    'wf-3-1-css-basics': { yt: 'TjMlfWpw7E0', credit: '' }, // CSS: The cascade, specificity and inheritance
    'wf-3-2-box-model': { yt: 'ZaiIDH0qp1c', credit: '' },  // CSS box model explained (padding, border, margin)
    'wf-3-3-flexbox': { yt: 'wsTv9y931o8', credit: '' },    // Learn CSS Flexbox in 20 Minutes (Course)
    'wf-3-4-css-grid': { yt: 'dT3aujtzBe4', credit: '' },   // Responsive Web Design Tutorial: Media Queries & CSS Grid
    'wf-3-5-responsive': { yt: 'uiEdKv5Fyh0', credit: '' }, // Media Query in CSS | Responsive Web Design Tutorial for Beginners

    /* ── Chương 4 — Nền tảng JavaScript ── */
    'wf-4-1-variables-types': { yt: 'edlFjlzxkSI', credit: '' },  // Javascript Variables & Data Types | Javascript Tutorial For Beginners
    'wf-4-2-conditions-loops': { yt: 'RlnvXCKQuso', credit: '' }, // Introduction to JavaScript - I (variables, if else, switch, loops - for, while, do while - arrays)
    'wf-4-3-functions': { yt: 'I2RciiuAEEE', credit: '' },        // Loops, Functions and Objects | JavaScript Tutorials for beginners
    'wf-4-4-arrays-objects': { yt: 'dJvPTRXyc6s', credit: '' },   // JavaScript Basics #1 - Variables, Data Types, Functions, Arrays, Objects
    'wf-4-5-dom-events': { yt: 'UEQyj5Ds69s', credit: '' },       // DOM manipulation using JavaScript | innerHTML, innerText, querySelector, createElement, appendChild

    /* ── Chương 5 — JavaScript bất đồng bộ & module ── */
    'wf-5-1-event-loop': { yt: '4IYcwOfW3BM', credit: '' }, // Day 27: How Your Async Code Works | JavaScript Event Loop Simplified!
    'wf-5-2-promises': { yt: 'fOdcuDigxfw', credit: '' },   // JavaScript the Hard Parts: Promises, Async & the Event Loop
    'wf-5-3-async-await': { yt: 'qE9SUzV1o0A', credit: '' },// Async / Await in JavaScript | Using Async/Await with the Fetch API
    'wf-5-4-fetch-apis': { yt: 'VmQ6dHvnKIM', credit: '' }, // Callbacks, Promises, Async Await | JavaScript Fetch API Explained
    'wf-5-5-es-modules': { yt: 'OFpqvaJ3QYg', credit: '' }, // Asynchronous JavaScript Course – Async/Await, Promises, Callbacks, Fetch API

    /* ── Chương 6 — HTTP & API ── */
    'wf-6-1-request-response': { yt: 'ZMNp9Ev6cl0', credit: '' },  // Interacting with a REST API | HTTP Methods, Status Codes... | Consuming a REST API #3
    'wf-6-2-http-methods': { yt: 'XLQxfpDmqbM', credit: '' },      // REST API Best Practices: How to Use the Right HTTP Methods and Status Codes
    'wf-6-3-status-codes': { yt: 'nb0xQUcxVj4', credit: '' },      // Every HTTP Status Code Explained in 8 Minutes!
    'wf-6-4-headers-json': { yt: 'z0QQdRiS0Eg', credit: '' },      // API Testing: HTTP Status, Header, Body - Part 5
    'wf-6-5-rest-params-query': { yt: '1j_IFw6PXi8', credit: '' }, // What are HTTP Status Codes | REST API | Complete Guide and List of HTTP Status Codes

    /* ── Chương 7 — Xác thực & bảo mật ── */
    'wf-7-1-auth-basics': { yt: 'kNDpoAexvVg', credit: '' },      // YOUR AUTH IS BROKEN: JWT vs Sessions vs Basic Auth Explained
    'wf-7-2-cookies-sessions': { yt: '5MhKXYpWVO8', credit: '' }, // Cookies vs. JWT Authentication
    'wf-7-3-jwt': { yt: '7fIOSZtU3EE', credit: '' },              // Session vs Token Authentication | Which is better ?
    'wf-7-4-passwords': { yt: 'esa_t_-PJ6A', credit: '' },        // Node Password Hashing with bcrypt
    'wf-7-5-https-cors': { yt: 'qnA_h_PzJD0', credit: '' },       // How To Solve Any CORS Error

    /* ── Chương 8 — Dữ liệu & SQL ── */
    'wf-8-1-databases': { yt: 'xV9xjzlthHk', credit: '' },            // SQL Tutorial for Beginners: Database, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIKE, IN, BETWEEN
    'wf-8-2-select': { yt: 'QX1eOjAZzws', credit: '' },               // SQL Query Basics: Insert, Select, Update, and Delete
    'wf-8-3-crud': { yt: 't9y5g2NUQL0', credit: '' },                 // SQL INSERT, UPDATE, DELETE Explained | Beginner Guide to Modifying Data
    'wf-8-4-relationships-joins': { yt: 'UYdFJdtzGmY', credit: '' },  // SQL Tutorial for Beginners | DAY(18/30) | Full SQL Tutorial
    'wf-8-5-orm-prisma': { yt: 'CYH04BJzamo', credit: '' },           // Prisma Crash Course

    /* ── Chương 9 — Nền tảng TypeScript ── */
    'wf-9-1-why-typescript': { yt: '_VJwW2l5N6k', credit: '' },      // TypeScript, An Introduction (Beginners Guide 2023)
    'wf-9-2-basic-types': { yt: '9kD5kf66lhk', credit: '' },         // Typescript for Beginners - Type Annotation - Lesson 3
    'wf-9-3-interfaces': { yt: 'IXAT3If0pGI', credit: '' },          // TypeScript TYPES vs INTERFACES (Key Differences)
    'wf-9-4-functions-generics': { yt: 'RWG66gIo7PM', credit: '' },  // Typescript Generics | Beginners Tutorial with Examples
    'wf-9-5-ts-in-practice': { yt: 'N7SDf1_-3I4', credit: '' },      // Using interfaces and generics in TypeScript

    /* ── Chương 10 — Tư duy, gỡ lỗi & quy trình Git ── */
    'wf-10-1-think-like-a-programmer': { yt: 'UiYXwUg23Yw', credit: '' },  // How To Think Like A Programmer - Learn To Solve Problems!
    'wf-10-2-reading-errors-debugging': { yt: 'DQEVZ5efnO0', credit: '' }, // Be a Better Programmer By Mastering Debugging
    'wf-10-3-git-workflow': { yt: 'e5wY8G00OfI', credit: '' },             // Git Command Line Tutorial for Beginners | Git CLI Complete Crash Course | Learn Git in 45 Minutes
    'wf-10-4-keep-learning': { yt: 'rWMuEIcdJP4', credit: '' },            // How to Think Like a Programmer
    'wf-10-5-full-stack-picture': { yt: 'z102ahiA8DA', credit: '' },       // Lecture 1: Intro to JavaScript, Variables, Data Types & Operators | Full Stack Free Course
  },
};
