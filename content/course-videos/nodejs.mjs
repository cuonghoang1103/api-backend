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
    'nodejs-0-1-gioi-thieu': { yt: 'ztspvPYybIY', credit: 'stri8ted — Ryan Dahl: Original Node.js presentation' },
    'nodejs-0-2-cach-hoc': { yt: 'LAUi8pPlcUM', credit: 'Codevolution — Node.js Tutorial - 1 - Introduction' },
    'nodejs-0-3-cai-dat': { yt: 'ENrzD9HAZK4', credit: 'Fireship — Node.js Ultimate Beginner’s Guide in 7 Easy Steps' },
    'nodejs-0-4-du-an': { yt: 'tt1R-DEhvxg', credit: 'Codevolution — Node.js Tutorial - 6 - Hello World' },

    /* ── Chương 1 — JavaScript cho backend ──────────────────────────────── */
    'nodejs-1-1-bien-pham-vi': { yt: 'zrlzTc6J_2k', credit: 'codelove — Hiểu Sâu Scope Trong Javascript | Phân Biệt Từ Khóa var, let, const Khai Báo Biến Js' },
    'nodejs-1-2-ham-closure-this': { yt: '6Ixyltr8_R0', credit: 'Lydia Hallie — JavaScript Visualized - Closures' },
    'nodejs-1-3-object-tham-chieu': { yt: 'E-dAnFdq8k8', credit: 'techsith — Javascript pass by Value vs pass by Reference tutorial' },
    'nodejs-1-4-bat-dong-bo': { yt: 'QvIC2z8ADtU', credit: 'Codevolution — Node.js Tutorial - 25 - Asynchronous JavaScript' },
    'nodejs-1-5-module': { yt: 'g98XlFOiXz0', credit: 'Codevolution — Node.js Tutorial - 16 - ES Modules' },

    /* ── Chương 2 — Bên trong Node.js runtime ───────────────────────────── */
    'nodejs-2-1-runtime-la-gi': { yt: 'XQT6XiJt4DE', credit: 'Codevolution — Node.js Tutorial - 5 - What is Node.js?' },
    'nodejs-2-2-event-loop': { yt: 'L18RHG2DwwA', credit: 'Codevolution — Node.js Tutorial - 42 - Event Loop' },
    'nodejs-2-3-microtask': { yt: 'M3sbOSJvhxg', credit: 'Codevolution — Node.js Tutorials - 43 - Microtask Queues' },
    'nodejs-2-4-chan-event-loop': { yt: 'mVx_PzR9SPo', credit: 'Codevolution — Node.js Tutorial - 38 - libuv' },
    'nodejs-2-5-worker-threads': { yt: 'Wm4MZwfEZd4', credit: 'Codevolution — Node.js Tutorial - 62 - Worker Threads Module' },

    /* ── Chương 3 — Module lõi ──────────────────────────────────────────── */
    'nodejs-3-1-path-fs': { yt: 'p995SdRXw_E', credit: 'Codevolution — Node.js Tutorial - 19 - Path Module' },
    'nodejs-3-2-buffer': { yt: 'br8VB99qPzE', credit: 'Codevolution — Node.js Tutorial - 24 - Streams and Buffers' },
    'nodejs-3-3-stream': { yt: 'qnzC6vpBuxw', credit: 'Codevolution — Node.js Tutorial - 28 - Streams' },
    'nodejs-3-4-eventemitter': { yt: 'Su0-Y9coU3s', credit: 'Codevolution — Node.js Tutorial - 21 - Events Module' },
    'nodejs-3-5-http-server': { yt: 'x1cEbRIrOu4', credit: 'Codevolution — Node.js Tutorial - 31 - Creating a Node Server' },

    /* ── Chương 4 — npm & vệ sinh dự án ─────────────────────────────────── */
    'nodejs-4-1-package-json': { yt: 'bSuFQY0fB8Y', credit: 'Codevolution — Node.js Tutorial - 50 - package.json' },
    'nodejs-4-2-semver-lockfile': { yt: 'LuV5upokyBY', credit: 'Codevolution — Node.js Tutorial - 54 - Versioning' },
    'nodejs-4-3-bao-mat-npm': { yt: '-MmyAFR_pYw', credit: 'DigitalOcean — NPM Supply Chain Attacks Explained (And How To Stop Them)' },

    /* ── Chương 5 — Express ─────────────────────────────────────────────── */
    'nodejs-5-1-tu-http-toi-express': { yt: '_eeZQwPqteM', credit: 'Codevolution — Node.js Tutorial - 36 - Web Framework' },
    'nodejs-5-2-dinh-tuyen': { yt: 'Lr9WUkeYSA8', credit: 'Net Ninja — Node.js Crash Course Tutorial #6 - Express Apps' },
    'nodejs-5-3-middleware': { yt: '_GJKAs7A0_4', credit: 'Net Ninja — Node.js Crash Course Tutorial #8 - Middleware' },
    'nodejs-5-4-xu-ly-loi': { yt: 'FauTQ_g6xgM', credit: 'WittCode — Express Error Handling' },
    'nodejs-5-5-notes-api': { yt: 'zW_tZR0Ir3Q', credit: 'Net Ninja — Node.js Crash Course Tutorial #11 - Express Router & MVC' },

    /* ── Chương 6 — Thiết kế REST API ───────────────────────────────────── */
    'nodejs-6-1-tai-nguyen-phuong-thuc': { yt: '-MTSQjw5DrM', credit: 'Fireship — RESTful APIs in 100 Seconds // Build an API from Scratch with Node.js Express' },
    'nodejs-6-2-ma-trang-thai': { yt: '36--CQc19u4', credit: 'Milan Jovanović — 8 Pragmatic REST API Design Tips (From Real Projects)' },
    'nodejs-6-3-validate-schema': { yt: 'ZPa9I_pvRU0', credit: 'Austin Davis — Stop Writing Types AND Validation (Use Zod)' },
    'nodejs-6-4-phan-trang': { yt: 'JF5x_hJQfh8', credit: 'TechViz - The Data Science Guy — API Design - 3 common Pagination Strategies' },
    'nodejs-6-5-hop-dong-api': { yt: 't99NvIazD68', credit: 'Software Developer Diaries — Idempotency in APIs: you should be aware of this!' },

    /* ── Chương 7 — PostgreSQL & Prisma ─────────────────────────────────── */
    'nodejs-7-1-ket-noi-va-pool': { yt: 'rLRIB6AF2Dg', credit: 'Fireship — Prisma in 100 Seconds' },
    'nodejs-7-2-luoc-do-va-migration': { yt: 'ZaCFsFES5yQ', credit: 'Prisma — Prisma Migrations: A Step-by-Step Guide' },
    'nodejs-7-3-crud-transaction': { yt: 'O1S0ax7GlL8', credit: 'Prisma — Prisma ORM + Prisma Postgres: 5-Minutes Quickstart' },
    'nodejs-7-4-quan-he-va-n-plus-1': { yt: 'phixQBZNZwU', credit: 'TomDoesTech — Learn Prisma Relationships (1-1, 1-m, m-m)' },
    'nodejs-7-5-chi-muc-va-explain': { yt: 'GmX8tjT7UcQ', credit: 'InterviewBuddies — Understanding Explain and Explain Analyze in PostgreSQL' },
    'nodejs-7-6-hop-dong-api-voi-du-lieu-that': { yt: '0Ik45qw8KhM', credit: 'fromDev2Dev — Let\'s learn Prisma ORM: migrate in detail (seeding, down migration, production)' },

    /* ── Chương 8 — Xác thực & phân quyền ───────────────────────────────── */
    'nodejs-8-1-mat-khau-va-bam': { yt: 'uXDnS5PcjCA', credit: 'LearnWebCode — Cookies, Sessions, JSON Web Tokens (JWT) and More 🍪🔐' },
    'nodejs-8-2-jwt-access-refresh': { yt: 'pkKn8q5AvsY', credit: 'Sheryians Coding School — Complete Authentication System | JWT, Refresh Token, OTP, Logout All Devices' },
    'nodejs-8-3-requireauth-phan-quyen': { yt: 'cIZvG3jZP5w', credit: 'WittCode — Express Authentication Cookies and JWTs' },
    'nodejs-8-4-cookie-csrf-thu-hoi': { yt: 'hjTY1Lf21W0', credit: 'Tejas Kumar — CSRF and CORS Explained' },

    /* ── Chương 9 — Bảo mật ứng dụng ────────────────────────────────────── */
    'nodejs-9-1-header-csp-cors': { yt: '4bQeGUzHpOE', credit: 'ByteMonk — HTTP Secure Headers for Web App Security | CORS, CSP, HSTS and more' },
    'nodejs-9-2-xss-va-sanitize': { yt: 'v969_M6cWk0', credit: 'Fireship — Ethical Hacking in 100 Seconds // And why do we need CORS?' },
    'nodejs-9-3-dau-vao-doc-hai': { yt: 'QqHavAYDYKM', credit: 'SBS online classes — helmet.js | Secure Node.js and Express.js APP/API' },
    'nodejs-9-4-bi-mat-va-phu-thuoc': { yt: 'Wq6yMdt11LM', credit: 'Better Stack — npm installs can hack your laptop (Here\'s how to stop it)' },

    /* ── Chương 10 — Upload & object storage ────────────────────────────── */
    'nodejs-10-1-nhan-file-multipart': { yt: 'jwp4U6v-3h4', credit: 'Sanjeev Thiyagarajan — NodeJs How to upload Files + uploading to AWS S3 using Express, Multer' },
    'nodejs-10-2-object-storage-presigned': { yt: '6VHc41idHZs', credit: 'Rahul Ahire — The Ultimate S3 & Nodejs Guide | Bucket & Objects | Put Object, Pre-signed URL, Multipart Upload,etc' },
    'nodejs-10-3-kiem-file-that': { yt: 'yz78h9JQiFA', credit: 'Education with Ankur — File Upload Type Validation Filters and Limit File Size and Error Handling in Node.js using Multer' },
    'nodejs-10-4-phuc-vu-media-cache': { yt: 'JKxlsvZXG7c', credit: 'Fireship — NGINX Explained in 100 Seconds' },

    /* ── Chương 11 — Realtime ───────────────────────────────────────────── */
    'nodejs-11-1-websocket-co-ban': { yt: '1BfCnjr_Vjg', credit: 'Fireship — WebSockets in 100 Seconds & Beyond with Socket.io' },
    'nodejs-11-2-ws-vs-socketio-rooms': { yt: 'y8oN927WIjA', credit: 'Scalable Scripts — NodeJS Websockets with Socket.io' },
    'nodejs-11-3-xac-thuc-phan-quyen-socket': { yt: 'E-Oajgw-L6s', credit: 'Ganesh H — 20 - Authentication with Socket.IO - Advanced Node and Express - freeCodeCamp' },
    'nodejs-11-4-scale-adapter-backpressure': { yt: 'gzIcGhJC8hA', credit: 'Hussein Nasser — Scaling Websockets with Redis, HAProxy and Node JS - High-availability Group Chat Application' },

    /* ── Chương 12 — Redis ──────────────────────────────────────────────── */
    'nodejs-12-1-redis-co-ban': { yt: 'G1rOthIU-uo', credit: 'Fireship — Redis in 100 Seconds' },
    'nodejs-12-2-cache-aside': { yt: '8A6s9d0jnWI', credit: 'Software With Shawn — Caching Strategies With Redis' },
    'nodejs-12-3-cau-truc-du-lieu': { yt: 'O_jNJ32s6x8', credit: 'Redis — Intro to Redis Data Structures and Pub/Sub vs Redis Streams - by Dave Nielsen' },
    'nodejs-12-4-nguyen-tu-rate-limit-lock': { yt: 'YcmU24x4KyA', credit: 'Redis — Rate Limiting with Redis' },
    'nodejs-12-5-pubsub-streams': { yt: 'hFNnNVawHhk', credit: 'Sangam Mukherjee — Redis Full Course 2026 | Caching, Rate Limiting, Pub/Sub' },
    'nodejs-12-6-van-hanh-production': { yt: 'cK1_csGSFFw', credit: 'Tejav Academy — Distributed Caching Explained | Redis, Cache-Aside & System Design' },

    /* ── Chương 13 — Tác vụ nền & hàng đợi ──────────────────────────────── */
    'nodejs-13-1-vi-sao-hang-doi': { yt: 'yXPKB7fHxfo', credit: 'Piyush Garg — What are Message Queues? | BullMQ Queues NodeJS' },
    'nodejs-13-2-bullmq-co-ban': { yt: '90WGktxfNUw', credit: 'Code Architecture — BullMQ Tutorial in Node.js: Step-by-Step with Redis & Docker | Real Project & Microservice Usage' },
    'nodejs-13-3-thu-lai-va-idempotent': { yt: 'zLEtzg04HUI', credit: 'Codeminer42 — Background Jobs in NodeJS with BullMQ. by Douglas Marques' },
    'nodejs-13-4-lich-trinh': { yt: 'osYgivmFULE', credit: 'Hey Delphi — NodeJS : BullMQ - Persistence job queuing & managing jobs between server restart' },
    'nodejs-13-5-worker-chet-va-van-hanh': { yt: 'bdj33b7k_5U', credit: 'Full Stack Mastery — I Built an Industry-Grade Email Queue System ⚡ (BullMQ + Node.js)' },

    /* ── Chương 14 — Kiểm thử ───────────────────────────────────────────── */
    'nodejs-14-1-vi-sao-test': { yt: 'Z_U6M1hMC6s', credit: 'Codevolution — React Testing Tutorial - 3 - Types of Tests' },
    'nodejs-14-2-unit-test': { yt: '0yScewOhjmU', credit: 'Alex Rusin — The ULTIMATE Guide to Testing TypeScript Node.js with Jest.' },
    'nodejs-14-3-supertest': { yt: 'LEYuxsGIeGo', credit: 'Alex Rusin — Node.js API Integration Testing: The Ultimate Guide with Jest and Supertest' },
    'nodejs-14-4-db-that': { yt: 'eRPkNd40n94', credit: 'Florian Ludewig — The Easiest Way to Run Integration Tests with Docker and Testcontainers' },
    'nodejs-14-5-do-phu-flaky-ci': { yt: 'W-dc5fpxUVs', credit: 'Codevolution — React Testing Tutorial - 14 - Code Coverage' },

    /* ── Chương 15 — Log & quan sát hệ thống ────────────────────────────── */
    'nodejs-15-1-log-co-cau-truc': { yt: 'umm-MyCl3Q4', credit: 'System Design Lab — Observability Crash Course: Logs, Metrics, Traces Explained' },
    'nodejs-15-2-request-id': { yt: 'kft86_LA-Pg', credit: 'OpenObserve — Logs, Metrics, Traces: How to Correlate Them with OpenTelemetry' },
    'nodejs-15-3-chi-phi-va-tim-kiem': { yt: 'd1VRuGpJd10', credit: 'Code with Jay — Node.js Logging Like a Pro: Centralized Logs Using Pino Transport, Loki & Grafana (Fastify Demo)' },
    'nodejs-15-4-metrics-prometheus': { yt: 'tLSS2t7Md3w', credit: 'That DevOps Guy — Metrics SIMPLIFIED with OpenTelemetry & Prometheus' },
    'nodejs-15-5-opentelemetry-trace': { yt: 'NbVVZlSsvvM', credit: 'Better Stack — OpenTelemetry in Node.js - Traces, Metrics and Logs' },
    'nodejs-15-6-health-check-canh-bao': { yt: 'ItZouStG_nk', credit: 'George Alonge — OpenTelemetry Fundamentals: Traces, Metrics & Logs Explained' },

    /* ── Chương 16 — Hiệu năng ──────────────────────────────────────────── */
    'nodejs-16-1-do-truoc-khi-doan': { yt: 'uBAW4xXCgmw', credit: 'i learned today — Best Node js Profiler | Doctor Graph | Clinic Js | how to profile node js' },
    'nodejs-16-2-nut-that-that-su': { yt: 'v7oc80C9vlg', credit: 'CITYJS CONFERENCE — Next-Gen Flame Graphs: Making Node.js Performance Profiling Actually Work // Matteo  Collina' },
    'nodejs-16-3-nen-va-duong-truyen': { yt: 'YaRrmdMa_Cg', credit: 'Web Dev Cody — How to understand a flamegraph to tune performance' },
    'nodejs-16-4-cluster-mo-rong': { yt: 'SHR-KmfRIsU', credit: 'Codevolution — Node.js Tutorial - 61 - Cluster Module' },
    'nodejs-16-5-ro-ri-bo-nho': { yt: 'F_qshjijxlE', credit: 'Geekle Official — Finding memory leaks and CPU bottlenecks with Node.js debug tools - Vladimir de Turckheim' },
    'nodejs-16-6-toi-uu-vo-ich': { yt: 'ASv8188AkVk', credit: 'InfoQ — A New Way to Profile Node.js' },

    /* ── Chương 17 — Docker & triển khai ────────────────────────────────── */
    'nodejs-17-1-anh-docker': { yt: 'YlVmVO0zAfw', credit: 'Chris Hay — use multi-stage to build super slim node.js docker images..  From 780MB to less than 50MB' },
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
