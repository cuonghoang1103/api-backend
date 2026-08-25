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
    'pr-0-1-van-de': { yt: 'Ehv69qFvN2I', credit: '' },  // Prisma Tutorial - Next Gen ORM (with JS & TS)
    'pr-0-2-cai-dat': { yt: 'CYH04BJzamo', credit: '' }, // Prisma Crash Course
    'pr-0-3-nam-phut': { yt: '3AldkDy7TQ4', credit: '' },// Prisma Complete Course 2025 - Modern Database ORM for Node.js & TypeScript

    /* ── Chương 1 — ORM thật ra là gì ── */
    'pr-1-1-lech-tro-khang': { yt: 'mU8-nKwfw4Y', credit: '' },       // Prisma 2 (Node JS ORM) Crash Course
    'pr-1-2-generate-viet-gi': { yt: 'JuAauKOj1Kk', credit: '' },     // They Finally Fixed Prisma
    'pr-1-3-thanh-sql': { yt: 'z_sfTz5S3SU', credit: '' },            // Is Prisma ORM Slow?
    'pr-1-4-datasource-generator': { yt: 'i0gUVkQ2grA', credit: '' }, // Prisma Schema - Next.js 14 Course Tutorial #20
    'pr-1-5-ba-luong': { yt: 'BkUH_6BSFyo', credit: '' },             // Deep dive into database workflows with Prisma - Alex Ruheni | Prisma Day 2022

    /* ── Chương 2 — Ngôn ngữ lược đồ ── */
    'pr-2-1-model-va-kieu': { yt: 'gT2KNOIDHoI', credit: '' },      // Prisma Tutorial for Beginners #2 - Creating Our First Schema
    'pr-2-2-thuoc-tinh-truong': { yt: 'eKY4lCDZP2I', credit: '' },  // Create a Prisma Schema
    'pr-2-3-thuoc-tinh-khoi': { yt: 'zS_vJgRPYo8', credit: '' },    // Using Multiple Prisma Schema Files
    'pr-2-4-native-type': { yt: '6clK-CAsFus', credit: '' },        // Prisma Schema Builder
    'pr-2-5-kieu-kho-chiu': { yt: 'gcpcxMxJ1AQ', credit: '' },      // Working with JSON Fields in Prisma ORM

    /* ── Chương 3 — Quan hệ ── */
    'pr-3-1-hai-phia': { yt: 'phixQBZNZwU', credit: '' },     // Learn Prisma Relationships (1-1, 1-m, m-m)
    'pr-3-2-mot-nhieu': { yt: '-Nv3wSm0Ac0', credit: '' },    // How to Use Cascading Deletes
    'pr-3-3-mot-mot': { yt: '9CrK_sZyW8E', credit: '' },      // 1 to 1 Associations in Prisma
    'pr-3-4-nhieu-nhieu': { yt: '_FxMevXW2XI', credit: '' },  // Many to Many Relation in Prisma
    'pr-3-5-tu-quan-he': { yt: 'fpBYj55-zd8', credit: '' },   // How to model relationships (1-1, 1-m, m-m)

    /* ── Chương 4 — Đọc và ghi ── */
    'pr-4-1-sau-cach-doc': { yt: 'E37-33M6Ypk', credit: '' },  // Prisma ORM Tutorial for Beginners | CRUD, CreateMany, Associations...
    'pr-4-2-select-include': { yt: 'uhJxaIEV5XQ', credit: '' },// Mastering Prisma in Next.js: One-to-Many Relationships
    'pr-4-3-tao-hang': { yt: 'uVOqu4DUrLg', credit: '' },      // Prisma Tutorial for Beginners #3 - CRUD - Creating Records
    'pr-4-4-cap-nhat': { yt: 'uyOc52NSgak', credit: '' },      // Prisma Tutorial for Beginners #6 - CRUD - Updating Records
    'pr-4-5-xoa-mem': { yt: 'FQDGQuGeoCw', credit: '' },       // Implementing Soft Deletes in Your NestJS Application with Prisma

    /* ── Chương 5 — Truy vấn sâu ── */
    'pr-5-1-toan-tu-loc': { yt: 'GvpQzXdSPC8', credit: '' },        // Prisma Tutorial #29 Filtering and Sorting with Prisma ORM in Node.js
    'pr-5-2-loc-quan-he': { yt: 'vmVUeZny73o', credit: '' },        // Ordering By Relation Aggregates with Prisma Client
    'pr-5-3-sap-xep-phan-trang': { yt: 'lQWdV8W-UiA', credit: '' }, // Pagination in Prisma
    'pr-5-4-tong-hop': { yt: 'BdlCPdPaorY', credit: '' },           // Using Prisma's Group By Feature
    'pr-5-5-tim-kiem': { yt: 'PgaasLoYeyg', credit: '' },           // part 5 | Search, Pagination, Filtering and Sorting with prisma and next/navigation

    /* ── Chương 6 — Migration ── */
    'pr-6-1-migration-la-gi': { yt: 'tcm2WCgITv8', credit: '' },  // Simplify Database Migrations Using PRISMA MIGRATE!!!
    'pr-6-2-shadow-database': { yt: 'V3dehH67yjY', credit: '' },  // Creating Shadow Database [26 of 37] | Full Stack Application with Azure SQL & Prisma
    'pr-6-3-viet-tay': { yt: 'LNxWk4twzGE', credit: '' },         // How to Customize Migrations with Prisma
    'pr-6-4-troi-dat': { yt: 'BIfvmEhbtBE', credit: '' },         // Two Methods of Adding Prisma Migrate to an existing project (Heroku shadow PostgreSQL database)
    'pr-6-5-tren-production': { yt: 'PX881bVAPxM', credit: '' },  // Prisma essentials: from development to production (Prisma Migrate workflow)

    /* ── Chương 7 — Giao dịch và đồng thời ── */
    'pr-7-1-hai-dang': { yt: 'eEcmfYNVm5M', credit: '' },        // Interactive Transactions in Prisma
    'pr-7-2-muc-co-lap': { yt: '7uet6HhNtic', credit: '' },      // Transaction Isolation - Demystified!
    'pr-7-3-khoa': { yt: 'WjgbghMh50A', credit: '' },            // Repeatable Read Isolation Level with Real-World Examples
    'pr-7-4-timeout': { yt: 'nRT7URSEZLE', credit: '' },         // Why I needed to add prisma transactions to my SaaS
    'pr-7-5-sach-cong-thuc': { yt: 'UP_3TEZIZl4', credit: '' },  // How to Use Transactions in Prisma

    /* ── Chương 8 — Hệ kiểu được sinh ra ── */
    'pr-8-1-kieu-nen-import': { yt: 'O1lHuVaDck4', credit: '' }, // Prisma ORM Crash Course With Typescript And Express (Part One)
    'pr-8-2-getpayload': { yt: 'XBSXwUSZ0jM', credit: '' },      // How to Generate Types for Prisma Relation Queries (Short — GetPayload helper)
    'pr-8-3-su-co-enum': { yt: 'EMXH3awZfSM', credit: '' },      // How to Retrieve Enums in Prisma Client for Client-Side Usage
    'pr-8-4-extension': { yt: '6EeIuDaIJwc', credit: '' },       // EpicWeb.dev Live stream: Prisma Client Extensions with the Epic Stack
    'pr-8-5-luoc-do-lon': { yt: 'L8wTBusNrX0', credit: '' },     // How to Use Multiple Schemas with Prisma

    /* ── Chương 9 — Hiệu năng ── */
    'pr-9-1-do-truoc': { yt: 'ZDSPOZC6iOU', credit: '' },            // Lesson 110. Logging: Prisma (TypeScript, Node.js, React)
    'pr-9-2-n-cong-1': { yt: 'wnQBC01kGe8', credit: '' },            // Why Your Database Is Running 500 Queries Instead of 5
    'pr-9-3-chi-muc': { yt: 'QXxy8Uv1LnQ', credit: '' },             // Prisma in Next.js - My Fav Way to Work with Databases (CRUD, Dev/Prod Workflow, Relations, Indexes)
    'pr-9-4-connection-pool': { yt: 'VfsquH2FUXA', credit: '' },     // Speed Up Your Database Queries with Prisma Postgres and Accelerate
    'pr-9-5-truy-van-khong-gui': { yt: 'gWROOjjEiM0', credit: '' },  // NEW! Prisma Optimize - Quick and Easy Query Insights

    /* ── Chương 10 — Cửa thoát hiểm: SQL thô và client extension ── */
    'pr-10-1-bon-ham-tho': { yt: 'cjP2uls3S3w', credit: '' },       // Executing raw queries in Prisma
    'pr-10-2-kieu-la-loi-hua': { yt: 'yyOM_fBMehA', credit: '' },   // Type-Safe Raw SQL With Prisma
    'pr-10-3-chi-sql-noi-duoc': { yt: 'ZwYcCti6CEs', credit: '' },  // How To Write Raw SQL w/ Type Safety in Prisma ORM
    'pr-10-4-typedsql': { yt: 'hFCqSyJS0_4', credit: '' },          // Setting up TypedSQL - type safe raw SQL in Prisma ORM
    'pr-10-5-extends': { yt: 'yMERmXLme1M', credit: '' },           // How to use Prisma's Built in Middleware

    /* ── Chương 11 — Đưa lên production ── */
    'pr-11-1-engine-trong-anh': { yt: 'lDpnnTPokdA', credit: '' },     // Setting up React Native and looking into Prisma's Docker container - Part 1
    'pr-11-2-dockerfile': { yt: 'WjRXZdOQU_M', credit: '' },           // Deploying a Next.js 13 App with Prisma and Docker
    'pr-11-3-migration-khi-deploy': { yt: 'ZDsn8Lm_LH8', credit: '' }, // Automating Prisma Migration with Docker | Express API & Prisma ORM Query Fundamentals Course
    'pr-11-4-seed-va-nap-bu': { yt: 'mulzjQ4pZaA', credit: '' },       // How to Seed Your Database with Prisma ORM 7
    'pr-11-5-vong-doi-client': { yt: 'ogfXx2NfiNo', credit: '' },      // Deploying a Prisma Client Application with the Serverless framework

    /* ── Chương 12 — Chẩn đoán Prisma, và đi tiếp về đâu ── */
    'pr-12-1-nam-phut-dau': { yt: 'X7o8Jmgx_G0', credit: '' },  // Prisma Error P1017 Server has closed the connection
    'pr-12-2-bay-hinh-dang': { yt: '0Ik45qw8KhM', credit: '' }, // Let's learn Prisma ORM: migrate in detail (seeding, down migration, production)
    'pr-12-3-bo-cong-cu': { yt: '5nAAH7y8R9A', credit: '' },    // Improve your database queries with Prisma Optimize AI
    'pr-12-4-giam-sat': { yt: 'j2cjvnjotyo', credit: '' },      // [Replaced with Query Insights] Make Your Prisma Postgres Faster
    'pr-12-5-ket-khoa': { yt: '6-mGtUyfGLw', credit: '' },      // Building a Production-Ready E-Commerce App: Node.js, Prisma ORM, TypeScript, and MySQL
  },
};
