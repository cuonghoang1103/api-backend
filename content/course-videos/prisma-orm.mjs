/**
 * Curated YouTube track for the "Prisma ORM" course.
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
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/prisma-orm.mjs --fix-credits
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/prisma-orm.mjs --apply
 *
 * Lệnh đầu in ra link nào đã chết (✗) — thay link đó rồi chạy lại. Lệnh sau sẽ
 * TỪ CHỐI --apply khi còn credit rỗng. Credit thật lệch hẳn tiêu đề mong đợi ở
 * chú thích cùng dòng ⇒ id trỏ nhầm video, báo lại để đổi.
 *
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'prisma-orm',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Prisma giải quyết gì, và cài đặt ── */
    'pr-0-1-van-de': { yt: 'Ehv69qFvN2I', credit: 'Classsed — Prisma Tutorial - Next Gen ORM (with JS & TS)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/00-prisma-giai-quyet-gi-cai-dat/00-03-prisma-giai-quyet-gi-16b67b98.mp4' }, defaultVideoTrack: 'VI'},  // Prisma Tutorial - Next Gen ORM (with JS & TS)
    'pr-0-2-cai-dat': { yt: 'CYH04BJzamo', credit: 'Traversy Media — Prisma Crash Course', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/00-prisma-giai-quyet-gi-cai-dat/00-04-cho-prisma-chay-len-523587c8.mp4' }, defaultVideoTrack: 'VI'}, // Prisma Crash Course
    'pr-0-3-nam-phut': { yt: '3AldkDy7TQ4', credit: '6 Pack Programmer — Prisma Complete Course 2025 - Modern Database ORM for Node.js & TypeScript', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/00-prisma-giai-quyet-gi-cai-dat/00-05-nam-phut-dau-tien-0422d470.mp4' }, defaultVideoTrack: 'VI'},// Prisma Complete Course 2025 - Modern Database ORM for Node.js & TypeScript

    /* ── Chương 1 — ORM thật ra là gì ── */
    'pr-1-1-lech-tro-khang': { yt: 'mU8-nKwfw4Y', credit: 'Laiture — Prisma 2 (Node JS ORM) Crash Course', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/01-orm-la-gi/01-01-lech-tro-khang-634dcb8d.mp4' }, defaultVideoTrack: 'VI'},       // Prisma 2 (Node JS ORM) Crash Course
    'pr-1-2-generate-viet-gi': { yt: 'JuAauKOj1Kk', credit: 'Josh tried coding — They Finally Fixed Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/01-orm-la-gi/01-02-generate-viet-gi-51102480.mp4' }, defaultVideoTrack: 'VI'},     // They Finally Fixed Prisma
    'pr-1-3-thanh-sql': { yt: 'z_sfTz5S3SU', credit: 'Prisma — Is Prisma ORM Slow?', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/01-orm-la-gi/01-03-thanh-sql-9f7a4592.mp4' }, defaultVideoTrack: 'VI'},            // Is Prisma ORM Slow?
    'pr-1-4-datasource-generator': { yt: 'i0gUVkQ2grA', credit: 'Code with Sloba — Prisma Schema - Next.js 14 Course Tutorial #20', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/01-orm-la-gi/01-04-datasource-generator-3e7092c6.mp4' }, defaultVideoTrack: 'VI'}, // Prisma Schema - Next.js 14 Course Tutorial #20
    'pr-1-5-ba-luong': { yt: 'BkUH_6BSFyo', credit: 'Prisma — Deep dive into database workflows with Prisma - Alex Ruheni I Prisma Day 2022', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/01-orm-la-gi/01-05-ba-luong-8517b2df.mp4' }, defaultVideoTrack: 'VI'},             // Deep dive into database workflows with Prisma - Alex Ruheni | Prisma Day 2022

    /* ── Chương 2 — Ngôn ngữ lược đồ ── */
    'pr-2-1-model-va-kieu': { yt: 'gT2KNOIDHoI', credit: 'GiraffeReactor — Prisma Tutorial for Beginners #2 - Creating Our First Schema', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/02-ngon-ngu-luoc-do/02-01-model-va-kieu-eefcb380.mp4' }, defaultVideoTrack: 'VI'},      // Prisma Tutorial for Beginners #2 - Creating Our First Schema
    'pr-2-2-thuoc-tinh-truong': { yt: 'eKY4lCDZP2I', credit: 'Holodeck — Create a Prisma Schema', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/02-ngon-ngu-luoc-do/02-02-thuoc-tinh-truong-6c7f830f.mp4' }, defaultVideoTrack: 'VI'},  // Create a Prisma Schema
    'pr-2-3-thuoc-tinh-khoi': { yt: 'zS_vJgRPYo8', credit: 'Prisma — Using Multiple Prisma Schema Files', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/02-ngon-ngu-luoc-do/02-03-thuoc-tinh-khoi-11c7c076.mp4' }, defaultVideoTrack: 'VI'},    // Using Multiple Prisma Schema Files
    'pr-2-4-native-type': { yt: '6clK-CAsFus', credit: 'Mehul Kundu | That Product Dude — Prisma Schema Builder', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/02-ngon-ngu-luoc-do/02-04-native-type-b39cf972.mp4' }, defaultVideoTrack: 'VI'},        // Prisma Schema Builder
    'pr-2-5-kieu-kho-chiu': { yt: 'gcpcxMxJ1AQ', credit: 'Prisma — Working with JSON Fields in Prisma ORM', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/02-ngon-ngu-luoc-do/02-05-kieu-kho-chiu-dafc4696.mp4' }, defaultVideoTrack: 'VI'},      // Working with JSON Fields in Prisma ORM

    /* ── Chương 3 — Quan hệ ── */
    'pr-3-1-hai-phia': { yt: 'phixQBZNZwU', credit: 'TomDoesTech — Learn Prisma Relationships (1-1, 1-m, m-m)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/03-quan-he/03-01-hai-phia-317d6a35.mp4' }, defaultVideoTrack: 'VI'},     // Learn Prisma Relationships (1-1, 1-m, m-m)
    'pr-3-2-mot-nhieu': { yt: '-Nv3wSm0Ac0', credit: 'Prisma — How to Use Cascading Deletes', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/03-quan-he/03-02-mot-nhieu-16c44ea9.mp4' }, defaultVideoTrack: 'VI'},    // How to Use Cascading Deletes
    'pr-3-3-mot-mot': { yt: '9CrK_sZyW8E', credit: 'Ben Awad — 1 to 1 Associations in Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/03-quan-he/03-03-mot-mot-591c77ef.mp4' }, defaultVideoTrack: 'VI'},      // 1 to 1 Associations in Prisma
    'pr-3-4-nhieu-nhieu': { yt: '_FxMevXW2XI', credit: 'Evoqys — Many to Many Relation in Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/03-quan-he/03-04-nhieu-nhieu-a66bb6c7.mp4' }, defaultVideoTrack: 'VI'},  // Many to Many Relation in Prisma
    'pr-3-5-tu-quan-he': { yt: 'fpBYj55-zd8', credit: 'Prisma — How to model relationships (1-1, 1-m, m-m)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/03-quan-he/03-05-tu-quan-he-a2a72027.mp4' }, defaultVideoTrack: 'VI'},   // How to model relationships (1-1, 1-m, m-m)

    /* ── Chương 4 — Đọc và ghi ── */
    'pr-4-1-sau-cach-doc': { yt: 'E37-33M6Ypk', credit: 'PedroTech — Prisma ORM Tutorial for Beginners | CRUD, CreateMany, Associations...', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/04-doc-va-ghi/04-01-sau-cach-doc-712c9871.mp4' }, defaultVideoTrack: 'VI'},  // Prisma ORM Tutorial for Beginners | CRUD, CreateMany, Associations...
    'pr-4-2-select-include': { yt: 'uhJxaIEV5XQ', credit: 'Alex Rusin — Mastering Prisma in Next.js: One-to-Many Relationships', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/04-doc-va-ghi/04-02-select-include-d9cc2782.mp4' }, defaultVideoTrack: 'VI'},// Mastering Prisma in Next.js: One-to-Many Relationships
    'pr-4-3-tao-hang': { yt: 'uVOqu4DUrLg', credit: 'GiraffeReactor — Prisma Tutorial for Beginners #3 - CRUD - Creating Records', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/04-doc-va-ghi/04-03-tao-hang-c39da189.mp4' }, defaultVideoTrack: 'VI'},      // Prisma Tutorial for Beginners #3 - CRUD - Creating Records
    'pr-4-4-cap-nhat': { yt: 'uyOc52NSgak', credit: 'GiraffeReactor — Prisma Tutorial for Beginners #6 - CRUD - Updating Records', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/04-doc-va-ghi/04-04-cap-nhat-e408b2ed.mp4' }, defaultVideoTrack: 'VI'},      // Prisma Tutorial for Beginners #6 - CRUD - Updating Records
    'pr-4-5-xoa-mem': { yt: 'FQDGQuGeoCw', credit: 'vlogize — Implementing Soft Deletes in Your NestJS Application with Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/04-doc-va-ghi/04-05-xoa-mem-4647ae70.mp4' }, defaultVideoTrack: 'VI'},       // Implementing Soft Deletes in Your NestJS Application with Prisma

    /* ── Chương 5 — Truy vấn sâu ── */
    'pr-5-1-toan-tu-loc': { yt: 'GvpQzXdSPC8', credit: 'Technical Rajni — Prisma Tutorial #29  Filtering and Sorting with Prisma ORM in Node.js | Practical Guide and Examples', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/05-truy-van-sau/05-01-toan-tu-loc-60dba03f.mp4' }, defaultVideoTrack: 'VI'},        // Prisma Tutorial #29 Filtering and Sorting with Prisma ORM in Node.js
    'pr-5-2-loc-quan-he': { yt: 'vmVUeZny73o', credit: 'Prisma — Ordering By Relation Aggregates with Prisma Client', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/05-truy-van-sau/05-02-loc-quan-he-c24995fb.mp4' }, defaultVideoTrack: 'VI'},        // Ordering By Relation Aggregates with Prisma Client
    'pr-5-3-sap-xep-phan-trang': { yt: 'lQWdV8W-UiA', credit: 'Evoqys — Pagination in Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/05-truy-van-sau/05-03-sap-xep-phan-trang-7a131cad.mp4' }, defaultVideoTrack: 'VI'}, // Pagination in Prisma
    'pr-5-4-tong-hop': { yt: 'BdlCPdPaorY', credit: 'Prisma — Using Prisma\'s Group By Feature', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/05-truy-van-sau/05-04-tong-hop-d769c680.mp4' }, defaultVideoTrack: 'VI'},           // Using Prisma's Group By Feature
    'pr-5-5-tim-kiem': { yt: 'PgaasLoYeyg', credit: 'Queen-Dev — part 5 | Search,  Pagination, Filtering and Sorting with prisma and next/navigation', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/05-truy-van-sau/05-05-tim-kiem-8795c42a.mp4' }, defaultVideoTrack: 'VI'},           // part 5 | Search, Pagination, Filtering and Sorting with prisma and next/navigation

    /* ── Chương 6 — Migration ── */
    'pr-6-1-migration-la-gi': { yt: 'tcm2WCgITv8', credit: 'YourTechBud Codes — Simplify Database Migrations Using PRISMA MIGRATE!!!', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/06-migration/06-01-migration-la-gi-cac728cd.mp4' }, defaultVideoTrack: 'VI'},  // Simplify Database Migrations Using PRISMA MIGRATE!!!
    'pr-6-2-shadow-database': { yt: 'V3dehH67yjY', credit: 'Microsoft Developer — Creating Shadow Database [26 of 37] | Full Stack Application with Azure SQL & Prisma for Beginners', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/06-migration/06-02-shadow-database-d321d6df.mp4' }, defaultVideoTrack: 'VI'},  // Creating Shadow Database [26 of 37] | Full Stack Application with Azure SQL & Prisma
    'pr-6-3-viet-tay': { yt: 'LNxWk4twzGE', credit: 'Prisma — How to Customize Migrations with Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/06-migration/06-03-viet-tay-a9e439c6.mp4' }, defaultVideoTrack: 'VI'},         // How to Customize Migrations with Prisma
    'pr-6-4-troi-dat': { yt: 'BIfvmEhbtBE', credit: 'OuterSpaceCoding — Two Methods of Adding Prisma Migrate to an existing project (Heroku shadow PostgreSQL database)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/06-migration/06-04-troi-dat-f326302c.mp4' }, defaultVideoTrack: 'VI'},         // Two Methods of Adding Prisma Migrate to an existing project (Heroku shadow PostgreSQL database)
    'pr-6-5-tren-production': { yt: 'PX881bVAPxM', credit: 'Neon Postgres — Prisma essentials: from development to production (Prisma Migrate workflow)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/06-migration/06-05-tren-production-18219214.mp4' }, defaultVideoTrack: 'VI'},  // Prisma essentials: from development to production (Prisma Migrate workflow)

    /* ── Chương 7 — Giao dịch và đồng thời ── */
    'pr-7-1-hai-dang': { yt: 'eEcmfYNVm5M', credit: 'Holodeck — Interactive Transactions in Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/07-giao-dich-tranh-chap/07-01-hai-dang-6bfabb95.mp4' }, defaultVideoTrack: 'VI'},        // Interactive Transactions in Prisma
    'pr-7-2-muc-co-lap': { yt: '7uet6HhNtic', credit: 'SaaS Developer Community — Transaction Isolation - Demystified!', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/07-giao-dich-tranh-chap/07-02-muc-co-lap-45395c08.mp4' }, defaultVideoTrack: 'VI'},      // Transaction Isolation - Demystified!
    'pr-7-3-khoa': { yt: 'WjgbghMh50A', credit: 'Artem Codes — Repeatable Read Isolation Level with Real-World Examples | Transaction Isolation Levels #4', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/07-giao-dich-tranh-chap/07-03-khoa-c16c4aa9.mp4' }, defaultVideoTrack: 'VI'},            // Repeatable Read Isolation Level with Real-World Examples
    'pr-7-4-timeout': { yt: 'nRT7URSEZLE', credit: 'Web Dev Cody — Why I needed to add prisma transactions to my SaaS', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/07-giao-dich-tranh-chap/07-04-timeout-b16d0712.mp4' }, defaultVideoTrack: 'VI'},         // Why I needed to add prisma transactions to my SaaS
    'pr-7-5-sach-cong-thuc': { yt: 'UP_3TEZIZl4', credit: 'Holodeck — How to Use Transactions in Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/07-giao-dich-tranh-chap/07-05-sach-cong-thuc-ddddc2b3.mp4' }, defaultVideoTrack: 'VI'},  // How to Use Transactions in Prisma

    /* ── Chương 8 — Hệ kiểu được sinh ra ── */
    'pr-8-1-kieu-nen-import': { yt: 'O1lHuVaDck4', credit: 'Notezz — Prisma ORM Crash Course With Typescript And Express (Part One)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/08-he-kieu-sinh-ra/08-01-kieu-nen-import-cb4617c0.mp4' }, defaultVideoTrack: 'VI'}, // Prisma ORM Crash Course With Typescript And Express (Part One)
    'pr-8-2-getpayload': { yt: 'XBSXwUSZ0jM', credit: 'Coding in Flow — How to Generate Types for Prisma Relation Queries', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/08-he-kieu-sinh-ra/08-02-getpayload-f3e68159.mp4' }, defaultVideoTrack: 'VI'},      // How to Generate Types for Prisma Relation Queries (Short — GetPayload helper)
    'pr-8-3-su-co-enum': { yt: 'EMXH3awZfSM', credit: 'vlogize — How to Retrieve Enums in Prisma Client for Client-Side Usage', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/08-he-kieu-sinh-ra/08-03-su-co-enum-18a80b89.mp4' }, defaultVideoTrack: 'VI'},      // How to Retrieve Enums in Prisma Client for Client-Side Usage
    'pr-8-4-extension': { yt: '6EeIuDaIJwc', credit: 'Kent C. Dodds — EpicWeb.dev Live stream: Prisma Client Extensions with the Epic Stack', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/08-he-kieu-sinh-ra/08-04-extension-42e4bead.mp4' }, defaultVideoTrack: 'VI'},       // EpicWeb.dev Live stream: Prisma Client Extensions with the Epic Stack
    'pr-8-5-luoc-do-lon': { yt: 'L8wTBusNrX0', credit: 'Prisma — How to Use Multiple Schemas with Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/08-he-kieu-sinh-ra/08-05-luoc-do-lon-b1000388.mp4' }, defaultVideoTrack: 'VI'},     // How to Use Multiple Schemas with Prisma

    /* ── Chương 9 — Hiệu năng ── */
    'pr-9-1-do-truoc': { yt: 'ZDSPOZC6iOU', credit: 'devFlexer — Lesson 110. Logging: Prisma (TypeScript, Node.js, React)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/09-hieu-nang/09-01-do-truoc-cd97b1aa.mp4' }, defaultVideoTrack: 'VI'},            // Lesson 110. Logging: Prisma (TypeScript, Node.js, React)
    'pr-9-2-n-cong-1': { yt: 'wnQBC01kGe8', credit: 'Database Star — Why Your Database Is Running 500 Queries Instead of 5', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/09-hieu-nang/09-02-n-cong-1-59fa6111.mp4' }, defaultVideoTrack: 'VI'},            // Why Your Database Is Running 500 Queries Instead of 5
    'pr-9-3-chi-muc': { yt: 'QXxy8Uv1LnQ', credit: 'ByteGrad — Prisma in Next.js - My Fav Way to Work with Databases (CRUD, Dev/Prod Workflow, Relations, Indexes)', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/09-hieu-nang/09-03-chi-muc-1377fc8e.mp4' }, defaultVideoTrack: 'VI'},             // Prisma in Next.js - My Fav Way to Work with Databases (CRUD, Dev/Prod Workflow, Relations, Indexes)
    'pr-9-4-connection-pool': { yt: 'VfsquH2FUXA', credit: 'Prisma — Speed Up Your Database Queries with Prisma Postgres and Accelerate', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/09-hieu-nang/09-04-connection-pool-9d76324a.mp4' }, defaultVideoTrack: 'VI'},     // Speed Up Your Database Queries with Prisma Postgres and Accelerate
    'pr-9-5-truy-van-khong-gui': { yt: 'gWROOjjEiM0', credit: 'Prisma — [OLD: Replaced with Query Insights] NEW! Prisma Optimize - Quick and Easy Query Insights', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/09-hieu-nang/09-05-truy-van-khong-gui-bf312a4b.mp4' }, defaultVideoTrack: 'VI'},  // NEW! Prisma Optimize - Quick and Easy Query Insights

    /* ── Chương 10 — Cửa thoát hiểm: SQL thô và client extension ── */
    'pr-10-1-bon-ham-tho': { yt: 'cjP2uls3S3w', credit: 'Evoqys — Executing raw queries in Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/10-cua-thoat-hiem/10-01-bon-ham-tho-12b46e35.mp4' }, defaultVideoTrack: 'VI'},       // Executing raw queries in Prisma
    'pr-10-2-kieu-la-loi-hua': { yt: 'yyOM_fBMehA', credit: 'Prisma — Type-Safe Raw SQL With Prisma', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/10-cua-thoat-hiem/10-02-kieu-la-loi-hua-27671367.mp4' }, defaultVideoTrack: 'VI'},   // Type-Safe Raw SQL With Prisma
    'pr-10-3-chi-sql-noi-duoc': { yt: 'ZwYcCti6CEs', credit: 'Prisma — How To Write Raw SQL w/ Type Safety in Prisma ORM', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/10-cua-thoat-hiem/10-03-chi-sql-noi-duoc-a53cae78.mp4' }, defaultVideoTrack: 'VI'},  // How To Write Raw SQL w/ Type Safety in Prisma ORM
    'pr-10-4-typedsql': { yt: 'hFCqSyJS0_4', credit: 'Prisma — Setting up TypedSQL - type safe raw SQL in Prisma ORM', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/10-cua-thoat-hiem/10-04-typedsql-6a92e4d1.mp4' }, defaultVideoTrack: 'VI'},          // Setting up TypedSQL - type safe raw SQL in Prisma ORM
    'pr-10-5-extends': { yt: 'yMERmXLme1M', credit: 'Ben Davis — How to use Prisma\'s Built in Middleware', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/10-cua-thoat-hiem/10-05-extends-fe8abe83.mp4' }, defaultVideoTrack: 'VI'},           // How to use Prisma's Built in Middleware

    /* ── Chương 11 — Đưa lên production ── */
    'pr-11-1-engine-trong-anh': { yt: 'lDpnnTPokdA', credit: 'Ben Awad — Setting up React Native and looking into Prisma\'s Docker container - Part 1', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/11-dua-len-production/11-01-engine-trong-anh-b23c209e.mp4' }, defaultVideoTrack: 'VI'},     // Setting up React Native and looking into Prisma's Docker container - Part 1
    'pr-11-2-dockerfile': { yt: '0TsJbFKUYtI', credit: 'Very Academy — Setting up Express and Prisma with Docker | Express API & Prisma ORM Query Fundamentals Course' },   // Setting up Express and Prisma with Docker | Express API & Prisma ORM Course
    'pr-11-3-migration-khi-deploy': { yt: 'ZDsn8Lm_LH8', credit: 'Very Academy — Automating Prisma Migration with Docker | Express API & Prisma ORM Query Fundamentals Course', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/11-dua-len-production/11-03-migration-khi-deploy-6f0ffd76.mp4' }, defaultVideoTrack: 'VI'}, // Automating Prisma Migration with Docker | Express API & Prisma ORM Query Fundamentals Course
    'pr-11-4-seed-va-nap-bu': { yt: 'mulzjQ4pZaA', credit: 'Prisma — How to Seed Your Database with Prisma ORM 7', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/11-dua-len-production/11-04-seed-va-nap-bu-e4964f3b.mp4' }, defaultVideoTrack: 'VI'},       // How to Seed Your Database with Prisma ORM 7
    'pr-11-5-vong-doi-client': { yt: 'ogfXx2NfiNo', credit: 'Prisma — Deploying a Prisma Client Application with the Serverless framework', vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/11-dua-len-production/11-05-vong-doi-client-fac68577.mp4' }, defaultVideoTrack: 'VI'},      // Deploying a Prisma Client Application with the Serverless framework

    /* ── Chương 12 — Chẩn đoán Prisma, và đi tiếp về đâu ── */
    'pr-12-1-nam-phut-dau': { yt: 'X7o8Jmgx_G0', credit: 'Coder Mha — Prisma Error P1017 Server has closed the connection' },  // Prisma Error P1017 Server has closed the connection
    'pr-12-2-bay-hinh-dang': { yt: '0Ik45qw8KhM', credit: 'fromDev2Dev — Let\'s learn Prisma ORM: migrate in detail (seeding, down migration, production)' }, // Let's learn Prisma ORM: migrate in detail (seeding, down migration, production)
    'pr-12-3-bo-cong-cu': { yt: '5nAAH7y8R9A', credit: 'Eddie Jaoude — Improve your database queries with Prisma Optimize AI' },    // Improve your database queries with Prisma Optimize AI
    'pr-12-4-giam-sat': { yt: 'j2cjvnjotyo', credit: 'Prisma — [OLD: Replaced with Query Insights] Make Your Prisma Postgres Queries Better with Optimize' },      // [Replaced with Query Insights] Make Your Prisma Postgres Faster
    'pr-12-5-ket-khoa': { yt: '6-mGtUyfGLw', credit: 'Evoqys — Building a Production-Ready E-Commerce App: Node.js, Prisma ORM, TypeScript, and MySQL' },      // Building a Production-Ready E-Commerce App: Node.js, Prisma ORM, TypeScript, and MySQL
    'pr-0-8-bat-dau-tai-day': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/00-prisma-giai-quyet-gi-cai-dat/00-01-bat-dau-prisma-la-gi-c9a16945.mp4' }, defaultVideoTrack: 'VI'},
    'pr-0-9-bat-dau-tai-day-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/prisma-orm/00-prisma-giai-quyet-gi-cai-dat/00-02-bat-dau-su-co-va-cach-hoc-ca67086a.mp4' }, defaultVideoTrack: 'VI'},
  },
};
