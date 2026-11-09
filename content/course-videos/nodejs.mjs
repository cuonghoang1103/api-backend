/**
 * Curated YouTube track for the "Node.js" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * Same contract as ./nextjs.mjs: one entry per lesson slug, `credit` is shown
 * under the player so the author is named. Every id is oEmbed-verified.
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/nodejs.mjs
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/nodejs.mjs --apply
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'nodejs',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu ─────────────────────────────────────────────── */
    'nodejs-0-1-gioi-thieu': { yt: 'ztspvPYybIY', credit: 'stri8ted — Ryan Dahl: Original Node.js presentation', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/00-gioi-thieu-huong-dan-hoc/00-01-ve-khoa-hoc-ban-do-49e84971.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-0-2-cach-hoc': { yt: 'LAUi8pPlcUM', credit: 'Codevolution — Node.js Tutorial - 1 - Introduction', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/00-gioi-thieu-huong-dan-hoc/00-02-cach-hoc-hieu-qua-da4a5b8b.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-0-3-cai-dat': { yt: 'ENrzD9HAZK4', credit: 'Fireship — Node.js Ultimate Beginner’s Guide in 7 Easy Steps', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/00-gioi-thieu-huong-dan-hoc/00-03-cai-dat-moi-truong-ae3e6b60.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-0-4-du-an': { yt: 'tt1R-DEhvxg', credit: 'Codevolution — Node.js Tutorial - 6 - Hello World', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/00-gioi-thieu-huong-dan-hoc/00-04-du-an-xuyen-suot-1278771a.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 1 — JavaScript cho backend ──────────────────────────────── */
    'nodejs-1-1-bien-pham-vi': { yt: 'zrlzTc6J_2k', credit: 'codelove — Hiểu Sâu Scope Trong Javascript | Phân Biệt Từ Khóa var, let, const Khai Báo Biến Js', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/01-javascript-nen-tang/01-01-bien-pham-vi-c44c2fba.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-1-2-ham-closure-this': { yt: '6Ixyltr8_R0', credit: 'Lydia Hallie — JavaScript Visualized - Closures', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/01-javascript-nen-tang/01-02-ham-closure-this-6c7aaf6c.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-1-3-object-tham-chieu': { yt: 'E-dAnFdq8k8', credit: 'techsith — Javascript pass by Value vs pass by Reference tutorial', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/01-javascript-nen-tang/01-03-object-mang-tham-chieu-d5d304b3.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-1-4-bat-dong-bo': { yt: 'QvIC2z8ADtU', credit: 'Codevolution — Node.js Tutorial - 25 - Asynchronous JavaScript', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/01-javascript-nen-tang/01-04-bat-dong-bo-tron-68f20754.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-1-5-module': { yt: 'g98XlFOiXz0', credit: 'Codevolution — Node.js Tutorial - 16 - ES Modules', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/01-javascript-nen-tang/01-05-module-commonjs-esm-c8009c06.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 2 — Bên trong Node.js runtime ───────────────────────────── */
    'nodejs-2-1-runtime-la-gi': { yt: 'XQT6XiJt4DE', credit: 'Codevolution — Node.js Tutorial - 5 - What is Node.js?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/02-ben-trong-nodejs-runtime/02-01-nodejs-that-ra-la-gi-01d02e37.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-2-2-event-loop': { yt: 'L18RHG2DwwA', credit: 'Codevolution — Node.js Tutorial - 42 - Event Loop', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/02-ben-trong-nodejs-runtime/02-02-event-loop-di-qua-tung-pha-ac232f7e.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-2-3-microtask': { yt: 'M3sbOSJvhxg', credit: 'Codevolution — Node.js Tutorials - 43 - Microtask Queues', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/02-ben-trong-nodejs-runtime/02-03-nexttick-microtask-bo-doi-3a96e92d.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-2-4-chan-event-loop': { yt: 'mVx_PzR9SPo', credit: 'Codevolution — Node.js Tutorial - 38 - libuv', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/02-ben-trong-nodejs-runtime/02-04-chan-event-loop-do-that-99a7ced7.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-2-5-worker-threads': { yt: 'Wm4MZwfEZd4', credit: 'Codevolution — Node.js Tutorial - 62 - Worker Threads Module', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/02-ben-trong-nodejs-runtime/02-05-dua-viec-nang-ra-khoi-event-loop-51be7838.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 3 — Module lõi ──────────────────────────────────────────── */
    'nodejs-3-1-path-fs': { yt: 'p995SdRXw_E', credit: 'Codevolution — Node.js Tutorial - 19 - Path Module', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/03-cac-module-loi/03-01-path-va-fs-a94705cb.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-3-2-buffer': { yt: 'br8VB99qPzE', credit: 'Codevolution — Node.js Tutorial - 24 - Streams and Buffers', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/03-cac-module-loi/03-02-buffer-du-lieu-nhi-phan-ec871b32.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-3-3-stream': { yt: 'qnzC6vpBuxw', credit: 'Codevolution — Node.js Tutorial - 28 - Streams', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/03-cac-module-loi/03-03-stream-thi-nghiem-348-mb-aa175390.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-3-4-eventemitter': { yt: 'Su0-Y9coU3s', credit: 'Codevolution — Node.js Tutorial - 21 - Events Module', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/03-cac-module-loi/03-04-eventemitter-2fc858ec.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-3-5-http-server': { yt: 'x1cEbRIrOu4', credit: 'Codevolution — Node.js Tutorial - 31 - Creating a Node Server', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/03-cac-module-loi/03-05-server-http-khong-framework-4f1f5ea2.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 4 — npm & vệ sinh dự án ─────────────────────────────────── */
    'nodejs-4-1-package-json': { yt: 'bSuFQY0fB8Y', credit: 'Codevolution — Node.js Tutorial - 50 - package.json', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/04-npm-giu-du-an-sach/04-01-package-json-npm-scripts-a3a9fc27.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-4-2-semver-lockfile': { yt: 'LuV5upokyBY', credit: 'Codevolution — Node.js Tutorial - 54 - Versioning', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/04-npm-giu-du-an-sach/04-02-semver-va-lockfile-8cfd217e.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-4-3-bao-mat-npm': { yt: '-MmyAFR_pYw', credit: 'DigitalOcean — NPM Supply Chain Attacks Explained (And How To Stop Them)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/04-npm-giu-du-an-sach/04-03-an-toan-chuoi-cung-ung-d00e7d5b.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 5 — Express ─────────────────────────────────────────────── */
    'nodejs-5-1-tu-http-toi-express': { yt: '_eeZQwPqteM', credit: 'Codevolution — Node.js Tutorial - 36 - Web Framework', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/05-express/05-01-tu-http-toi-express-tron-27681eef.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-5-2-dinh-tuyen': { yt: 'Lr9WUkeYSA8', credit: 'Net Ninja — Node.js Crash Course Tutorial #6 - Express Apps', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/05-express/05-02-dinh-tuyen-params-query-router-8fdab27e.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-5-3-middleware': { yt: '_GJKAs7A0_4', credit: 'Net Ninja — Node.js Crash Course Tutorial #8 - Middleware', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/05-express/05-03-middleware-soi-day-chuyen-tron-8b15042c.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-5-4-xu-ly-loi': { yt: 'FauTQ_g6xgM', credit: 'WittCode — Express Error Handling', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/05-express/05-04-xu-ly-loi-tap-trung-tron-e7527312.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-5-5-notes-api': { yt: 'zW_tZR0Ir3Q', credit: 'Net Ninja — Node.js Crash Course Tutorial #11 - Express Router & MVC', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/05-express/05-05-rap-notes-api-tron-962f2228.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 6 — Thiết kế REST API ───────────────────────────────────── */
    'nodejs-6-1-tai-nguyen-phuong-thuc': { yt: '-MTSQjw5DrM', credit: 'Fireship — RESTful APIs in 100 Seconds // Build an API from Scratch with Node.js Express', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/06-thiet-ke-rest-api/06-01-tai-nguyen-phuong-thuc-tron-b23533b5.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-6-2-ma-trang-thai': { yt: '36--CQc19u4', credit: 'Milan Jovanović — 8 Pragmatic REST API Design Tips (From Real Projects)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/06-thiet-ke-rest-api/06-02-ma-trang-thai-tron-d5fcb661.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-6-3-validate-schema': { yt: 'ZPa9I_pvRU0', credit: 'Austin Davis — Stop Writing Types AND Validation (Use Zod)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/06-thiet-ke-rest-api/06-03-validate-schema-tron-1aeb2b34.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-6-4-phan-trang': { yt: 'JF5x_hJQfh8', credit: 'TechViz - The Data Science Guy — API Design - 3 common Pagination Strategies', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/06-thiet-ke-rest-api/06-04-phan-trang-tron-580dfdd5.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-6-5-hop-dong-api': { yt: 't99NvIazD68', credit: 'Software Developer Diaries — Idempotency in APIs: you should be aware of this!', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/06-thiet-ke-rest-api/06-05-hop-dong-api-tron-8143e954.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 7 — PostgreSQL & Prisma ─────────────────────────────────── */
    'nodejs-7-1-ket-noi-va-pool': { yt: 'rLRIB6AF2Dg', credit: 'Fireship — Prisma in 100 Seconds', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/07-postgresql-prisma/07-01-ket-noi-va-pool-tron-60bcc5b2.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-7-2-luoc-do-va-migration': { yt: 'ZaCFsFES5yQ', credit: 'Prisma — Prisma Migrations: A Step-by-Step Guide', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/07-postgresql-prisma/07-02-luoc-do-va-migration-tron-7b5ce802.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-7-3-crud-transaction': { yt: 'O1S0ax7GlL8', credit: 'Prisma — Prisma ORM + Prisma Postgres: 5-Minutes Quickstart', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/07-postgresql-prisma/07-03-crud-transaction-tron-26e88ecd.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-7-4-quan-he-va-n-plus-1': { yt: 'phixQBZNZwU', credit: 'TomDoesTech — Learn Prisma Relationships (1-1, 1-m, m-m)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/07-postgresql-prisma/07-04-quan-he-va-n-plus-1-d8feecf1.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-7-5-chi-muc-va-explain': { yt: 'GmX8tjT7UcQ', credit: 'InterviewBuddies — Understanding Explain and Explain Analyze in PostgreSQL', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/07-postgresql-prisma/07-05-chi-muc-va-explain-375fe591.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-7-6-hop-dong-api-voi-du-lieu-that': { yt: '0Ik45qw8KhM', credit: 'fromDev2Dev — Let\'s learn Prisma ORM: migrate in detail (seeding, down migration, production)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/07-postgresql-prisma/07-06-hop-dong-api-voi-du-lieu-that-tron-e2c9852c.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 8 — Xác thực & phân quyền ───────────────────────────────── */
    'nodejs-8-1-mat-khau-va-bam': { yt: 'uXDnS5PcjCA', credit: 'LearnWebCode — Cookies, Sessions, JSON Web Tokens (JWT) and More 🍪🔐', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/08-xac-thuc-phan-quyen/08-01-mat-khau-va-bam-tron-775e4746.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-8-2-jwt-access-refresh': { yt: 'pkKn8q5AvsY', credit: 'Sheryians Coding School — Complete Authentication System | JWT, Refresh Token, OTP, Logout All Devices', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/08-xac-thuc-phan-quyen/08-02-jwt-access-refresh-tron-c299cbc8.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-8-3-requireauth-phan-quyen': { yt: 'cIZvG3jZP5w', credit: 'WittCode — Express Authentication Cookies and JWTs', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/08-xac-thuc-phan-quyen/08-03-requireauth-phan-quyen-tron-63e92346.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-8-4-cookie-csrf-thu-hoi': { yt: 'hjTY1Lf21W0', credit: 'Tejas Kumar — CSRF and CORS Explained', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/08-xac-thuc-phan-quyen/08-04-cookie-csrf-thu-hoi-tron-8cc3a7ba.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 9 — Bảo mật ứng dụng ────────────────────────────────────── */
    'nodejs-9-1-header-csp-cors': { yt: '4bQeGUzHpOE', credit: 'ByteMonk — HTTP Secure Headers for Web App Security | CORS, CSP, HSTS and more', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/09-bao-mat-ung-dung/09-01-header-csp-cors-tron-cf81d3e0.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-9-2-xss-va-sanitize': { yt: 'v969_M6cWk0', credit: 'Fireship — Ethical Hacking in 100 Seconds // And why do we need CORS?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/09-bao-mat-ung-dung/09-02-xss-va-sanitize-tron-253bec26.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-9-3-dau-vao-doc-hai': { yt: 'QqHavAYDYKM', credit: 'SBS online classes — helmet.js | Secure Node.js and Express.js APP/API', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/09-bao-mat-ung-dung/09-03-dau-vao-doc-hai-tron-d3a46b59.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-9-4-bi-mat-va-phu-thuoc': { yt: 'Wq6yMdt11LM', credit: 'Better Stack — npm installs can hack your laptop (Here\'s how to stop it)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/09-bao-mat-ung-dung/09-04-bi-mat-va-phu-thuoc-tron-5762f0cb.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 10 — Upload & object storage ────────────────────────────── */
    'nodejs-10-1-nhan-file-multipart': { yt: 'jwp4U6v-3h4', credit: 'Sanjeev Thiyagarajan — NodeJs How to upload Files + uploading to AWS S3 using Express, Multer', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/10-upload-object-storage/10-01-nhan-file-multipart-tron-ef1bde72.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-10-2-object-storage-presigned': { yt: '6VHc41idHZs', credit: 'Rahul Ahire — The Ultimate S3 & Nodejs Guide | Bucket & Objects | Put Object, Pre-signed URL, Multipart Upload,etc', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/10-upload-object-storage/10-02-object-storage-presigned-tron-58e1cb98.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-10-3-kiem-file-that': { yt: 'yz78h9JQiFA', credit: 'Education with Ankur — File Upload Type Validation Filters and Limit File Size and Error Handling in Node.js using Multer', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/10-upload-object-storage/10-03-kiem-file-that-tron-e2332832.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-10-4-phuc-vu-media-cache': { yt: 'JKxlsvZXG7c', credit: 'Fireship — NGINX Explained in 100 Seconds', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/10-upload-object-storage/10-04-phuc-vu-media-cache-tron-000a2ca4.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 11 — Realtime ───────────────────────────────────────────── */
    'nodejs-11-1-websocket-co-ban': { yt: '1BfCnjr_Vjg', credit: 'Fireship — WebSockets in 100 Seconds & Beyond with Socket.io', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/11-realtime-websocket/11-01-websocket-co-ban-tron-066b8243.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-11-2-ws-vs-socketio-rooms': { yt: 'y8oN927WIjA', credit: 'Scalable Scripts — NodeJS Websockets with Socket.io', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/11-realtime-websocket/11-02-ws-vs-socketio-rooms-tron-1f29e326.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-11-3-xac-thuc-phan-quyen-socket': { yt: 'E-Oajgw-L6s', credit: 'Ganesh H — 20 - Authentication with Socket.IO - Advanced Node and Express - freeCodeCamp', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/11-realtime-websocket/11-03-xac-thuc-phan-quyen-socket-tron-26677754.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-11-4-scale-adapter-backpressure': { yt: 'gzIcGhJC8hA', credit: 'Hussein Nasser — Scaling Websockets with Redis, HAProxy and Node JS - High-availability Group Chat Application', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/11-realtime-websocket/11-04-scale-adapter-backpressure-tron-ee729422.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 12 — Redis ──────────────────────────────────────────────── */
    'nodejs-12-1-redis-co-ban': { yt: 'G1rOthIU-uo', credit: 'Fireship — Redis in 100 Seconds', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/12-redis/12-01-redis-co-ban-667485fb.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-12-2-cache-aside': { yt: '8A6s9d0jnWI', credit: 'Software With Shawn — Caching Strategies With Redis', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/12-redis/12-02-cache-aside-tron-d1a58db6.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-12-3-cau-truc-du-lieu': { yt: 'O_jNJ32s6x8', credit: 'Redis — Intro to Redis Data Structures and Pub/Sub vs Redis Streams - by Dave Nielsen', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/12-redis/12-03-cau-truc-du-lieu-tron-f7494c59.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-12-4-nguyen-tu-rate-limit-lock': { yt: 'YcmU24x4KyA', credit: 'Redis — Rate Limiting with Redis', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/12-redis/12-04-nguyen-tu-rate-limit-lock-tron-0fcfb845.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-12-5-pubsub-streams': { yt: 'hFNnNVawHhk', credit: 'Sangam Mukherjee — Redis Full Course 2026 | Caching, Rate Limiting, Pub/Sub', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/12-redis/12-05-pubsub-streams-tron-e87e949f.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-12-6-van-hanh-production': { yt: 'cK1_csGSFFw', credit: 'Tejav Academy — Distributed Caching Explained | Redis, Cache-Aside & System Design', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/12-redis/12-06-van-hanh-production-tron-6452fa5b.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 13 — Tác vụ nền & hàng đợi ──────────────────────────────── */
    'nodejs-13-1-vi-sao-hang-doi': { yt: 'yXPKB7fHxfo', credit: 'Piyush Garg — What are Message Queues? | BullMQ Queues NodeJS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/13-tac-vu-nen-hang-doi/13-01-vi-sao-hang-doi-cf70b8c4.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-13-2-bullmq-co-ban': { yt: '90WGktxfNUw', credit: 'Code Architecture — BullMQ Tutorial in Node.js: Step-by-Step with Redis & Docker | Real Project & Microservice Usage', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/13-tac-vu-nen-hang-doi/13-02-bullmq-co-ban-71647b4c.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-13-3-thu-lai-va-idempotent': { yt: 'zLEtzg04HUI', credit: 'Codeminer42 — Background Jobs in NodeJS with BullMQ. by Douglas Marques', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/13-tac-vu-nen-hang-doi/13-03-thu-lai-va-idempotent-tron-9d31b565.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-13-4-lich-trinh': { yt: 'osYgivmFULE', credit: 'Hey Delphi — NodeJS : BullMQ - Persistence job queuing & managing jobs between server restart', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/13-tac-vu-nen-hang-doi/13-04-lich-trinh-tron-5efc0130.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-13-5-worker-chet-va-van-hanh': { yt: 'bdj33b7k_5U', credit: 'Full Stack Mastery — I Built an Industry-Grade Email Queue System ⚡ (BullMQ + Node.js)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/13-tac-vu-nen-hang-doi/13-05-worker-chet-va-van-hanh-tron-c8925598.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 14 — Kiểm thử ───────────────────────────────────────────── */
    'nodejs-14-1-vi-sao-test': { yt: 'Z_U6M1hMC6s', credit: 'Codevolution — React Testing Tutorial - 3 - Types of Tests', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/14-kiem-thu/14-01-vi-sao-test-a3c8872d.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-14-2-unit-test': { yt: '0yScewOhjmU', credit: 'Alex Rusin — The ULTIMATE Guide to Testing TypeScript Node.js with Jest.', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/14-kiem-thu/14-02-unit-test-tron-e9dc059f.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-14-3-supertest': { yt: 'LEYuxsGIeGo', credit: 'Alex Rusin — Node.js API Integration Testing: The Ultimate Guide with Jest and Supertest', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/14-kiem-thu/14-03-supertest-a88bbc85.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-14-4-db-that': { yt: 'eRPkNd40n94', credit: 'Florian Ludewig — The Easiest Way to Run Integration Tests with Docker and Testcontainers', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/14-kiem-thu/14-04-db-that-tron-82f2f30b.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-14-5-do-phu-flaky-ci': { yt: 'W-dc5fpxUVs', credit: 'Codevolution — React Testing Tutorial - 14 - Code Coverage', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/14-kiem-thu/14-05-do-phu-tron-e3c9e33f.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 15 — Log & quan sát hệ thống ────────────────────────────── */
    'nodejs-15-1-log-co-cau-truc': { yt: 'umm-MyCl3Q4', credit: 'System Design Lab — Observability Crash Course: Logs, Metrics, Traces Explained', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/15-log-quan-sat/15-01-log-co-cau-truc-tron-2ae8a3b5.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-15-2-request-id': { yt: 'kft86_LA-Pg', credit: 'OpenObserve — Logs, Metrics, Traces: How to Correlate Them with OpenTelemetry', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/15-log-quan-sat/15-02-request-id-tron-8335b2e2.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-15-3-chi-phi-va-tim-kiem': { yt: 'd1VRuGpJd10', credit: 'Code with Jay — Node.js Logging Like a Pro: Centralized Logs Using Pino Transport, Loki & Grafana (Fastify Demo)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/15-log-quan-sat/15-03-chi-phi-va-tim-kiem-tron-d9802e08.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-15-4-metrics-prometheus': { yt: 'tLSS2t7Md3w', credit: 'That DevOps Guy — Metrics SIMPLIFIED with OpenTelemetry & Prometheus', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/15-log-quan-sat/15-04-metrics-prometheus-tron-a349635f.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-15-5-opentelemetry-trace': { yt: 'NbVVZlSsvvM', credit: 'Better Stack — OpenTelemetry in Node.js - Traces, Metrics and Logs', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/15-log-quan-sat/15-05-opentelemetry-trace-tron-d48e80e9.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-15-6-health-check-canh-bao': { yt: 'ItZouStG_nk', credit: 'George Alonge — OpenTelemetry Fundamentals: Traces, Metrics & Logs Explained', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/15-log-quan-sat/15-06-health-check-canh-bao-tron-98afe821.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 16 — Hiệu năng ──────────────────────────────────────────── */
    'nodejs-16-1-do-truoc-khi-doan': { yt: 'uBAW4xXCgmw', credit: 'i learned today — Best Node js Profiler | Doctor Graph | Clinic Js | how to profile node js', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/16-hieu-nang/16-01-do-truoc-khi-doan-e4c84a33.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-16-2-nut-that-that-su': { yt: 'v7oc80C9vlg', credit: 'CITYJS CONFERENCE — Next-Gen Flame Graphs: Making Node.js Performance Profiling Actually Work // Matteo  Collina', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/16-hieu-nang/16-02-nut-that-that-su-ab5e7e7d.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-16-3-nen-va-duong-truyen': { yt: 'YaRrmdMa_Cg', credit: 'Web Dev Cody — How to understand a flamegraph to tune performance', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/16-hieu-nang/16-03-nen-va-duong-truyen-d22c1e48.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-16-4-cluster-mo-rong': { yt: 'SHR-KmfRIsU', credit: 'Codevolution — Node.js Tutorial - 61 - Cluster Module', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/16-hieu-nang/16-04-cluster-mo-rong-b0b0d05c.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-16-5-ro-ri-bo-nho': { yt: 'F_qshjijxlE', credit: 'Geekle Official — Finding memory leaks and CPU bottlenecks with Node.js debug tools - Vladimir de Turckheim', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/16-hieu-nang/16-05-ro-ri-bo-nho-c2008ec8.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-16-6-toi-uu-vo-ich': { yt: 'ASv8188AkVk', credit: 'InfoQ — A New Way to Profile Node.js', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/16-hieu-nang/16-06-toi-uu-vo-ich-tron-0aa6e14a.mp4' }, defaultVideoTrack: 'VI'},

    /* ── Chương 17 — Docker & triển khai ────────────────────────────────── */
    'nodejs-17-1-anh-docker': { yt: 'YlVmVO0zAfw', credit: 'Chris Hay — use multi-stage to build super slim node.js docker images..  From 780MB to less than 50MB', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/nodejs/17-docker-trien-khai/17-01-anh-docker-ed307fb0.mp4' }, defaultVideoTrack: 'VI'},
    'nodejs-17-2-cache-tang': { yt: 'V6bLIw3wIx8', credit: 'Depot — Cache Dependencies With Docker Multi-Stage Builds' },
    'nodejs-17-3-pid-1-tat-em': { yt: '0pQxONR73f8', credit: 'anthonywritescode — why don\'t signals work in docker?' },
    'nodejs-17-4-bi-mat-cau-hinh': { yt: '4Z0RTSrCpus', credit: 'Eugen Bondarev — Next.js in Docker - How to set environment variables' },
    'nodejs-17-5-deploy-khong-gian-doan': { yt: '-OjPhPV6Rjs', credit: 'Software Developer Diaries — Here\'s how to Gracefully Shutdown your apps (with Node.js examples)' },
    'nodejs-17-6-deploy-hong-quay-lui': { yt: 'eQPYsGrZW_E', credit: 'DevOps & AI Toolkit — Stop Losing Requests! Learn Graceful Shutdown Techniques' },

    /* ── Chương 18 — Kiến trúc ──────────────────────────────────────────── */
    'nodejs-18-1-tang-va-trach-nhiem': { yt: 'VmY22KuRDbk', credit: 'Web Dev Cody — How to implement Clean Architecture in Node.js (and why it\'s important)' },
    'nodejs-18-2-to-chuc-ma-nguon': { yt: 'fc6o1gwqZuA', credit: 'Software Developer Diaries — Node.js Project Structure and Architecture Best Practices' },
    'nodejs-18-3-ghep-noi-ranh-gioi': { yt: 'kwehxBDX_o8', credit: 'Milan Jovanović — How I Use The Generic Repository Pattern In Clean Architecture' },
    'nodejs-18-4-monolith-hay-tach': { yt: '3fwRmW8pgWU', credit: 'TechPrep — Monoliths vs Microservices | Explained in 5 Minutes' },
    'nodejs-18-5-quyet-dinh-kho-dao-nguoc': { yt: 'CnailTcJV_U', credit: 'Dev Mastery — Using Clean Architecture for Microservice APIs in Node.js with MongoDB and Express' },
    'nodejs-18-6-tong-ket-khoa-hoc': { yt: 'bp41nA6UyY4', credit: 'Codevolution — Node.js Tutorial - 64 - Wrapping Up' },
  },
};
