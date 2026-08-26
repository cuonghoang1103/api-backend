/**
 * Curated YouTube track for the "PostgreSQL" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 * The `credit` line names the author under the player.
 *
 * Every id was resolved through YouTube's oEmbed endpoint (live title+channel,
 * 404s on dead/private/non-embeddable). Re-check any time with:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/postgresql.mjs
 * Apply to the DB:
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/postgresql.mjs --apply
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'postgresql',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu ── */
    "postgresql-0-1-gioi-thieu": { yt: "n2Fluyr3lbc", credit: "Fireship — PostgreSQL in 100 Seconds" },
    "postgresql-0-2-cach-hoc": { yt: "qw--VYLpxG4", credit: "freeCodeCamp.org — Learn PostgreSQL Tutorial - Full Course for Beginners" },
    "postgresql-0-3-cai-dat": { yt: "dVBNUow7GOE", credit: "LinkedIn Learning — SQL Tutorial - INSTALLING POSTGRES and Using PSQL" },
    "postgresql-0-4-mo-hinh": { yt: "Q56kljmIN14", credit: "Hussein Nasser — PostgreSQL Internal Architecture Explained" },
    /* ── Chương 1 — Vì sao PostgreSQL ── */
    "postgresql-1-1-mo-hinh-quan-he": { yt: "C3icLzBtg8I", credit: "Christopher Kalodikis — Relational Database Relationships (Updated)" },
    "postgresql-1-2-acid": { yt: "GAe5oB742dw", credit: "ByteByteGo — ACID Properties in Databases With Examples" },
    "postgresql-1-3-vs-alternatives": { yt: "btjBNKP49Rk", credit: "IBM Technology — PostgreSQL vs MySQL" },
    "postgresql-1-4-dong-chay-truy-van": { yt: "-Xmrrj7U34g", credit: "Data with Baraa — SQL Order of Execution (Visually Explained) | Understanding How Queries Run" },
    /* ── Chương 2 — Kiểu dữ liệu ── */
    "postgresql-2-1-so": { yt: "-UY-_fbEm4k", credit: "Knowledge 360 — Data Types in PostgreSQL: Numeric Data Types || PostgreSQL Full Playlist Video #43" },
    "postgresql-2-2-text": { yt: "zRP2GFTkCYg", credit: "The Code Blooded — Character Data Type : Understanding Char, Varchar, and Text | Mastering  PostgreSQL" },
    "postgresql-2-3-ngay-gio": { yt: "4lJgIStK7NU", credit: "Knowledge 360 — Data Types in PostgreSQL: Date/Time/Interval Data Types || PostgreSQL Full Playlist #49" },
    "postgresql-2-4-uuid-enum-array-jsonb": { yt: "nxeUiRz4G-M", credit: "Supabase — How to store and query JSON data in Postgres" },
    /* ── Chương 3 — Bảng, ràng buộc & thiết kế lược đồ ── */
    "postgresql-3-1-khoa-chinh": { yt: "DJ054rHGhRw", credit: "BeardedDev — SQL Tutorial - PRIMARY KEY CONSTRAINTS" },
    "postgresql-3-2-khoa-ngoai": { yt: "kwoB-w3FtYw", credit: "Programming Is Fun — 🔑 SQL Foreign Key Explained | Beginner’s Guide with Examples" },
    "postgresql-3-3-rang-buoc-cot": { yt: "KdGUpf_OTPA", credit: "Analytics Hub — Mastering SQL Constraints: Primary Key, Unique Key, Not Null, and CHECK Explained!" },
    "postgresql-3-4-alter-chuan-hoa": { yt: "FzVCGou8SMA", credit: "DbSchema Database Designer — Learn Database Normalization Fast | 1NF, 2NF, 3NF Explained Simply (2025)" },
    /* ── Chương 4 — Chèn & truy vấn ── */
    "postgresql-4-1-insert": { yt: "7yscNEvrrew", credit: "Amigoscode — PostgreSQL: On Conflict Do Nothing | Course | 2019" },
    "postgresql-4-2-select-where": { yt: "QjSrAUoiJ-o", credit: "ProgrammingKnowledge — PostgreSQL Tutorial for Beginners 10 - PostgreSQL - WHERE Clause" },
    "postgresql-4-3-order-limit-distinct": { yt: "XuGxGP8quMQ", credit: "Database Systems Research Group at U Tübingen — Advanced SQL — Chapter 02 — Video #06 — ORDER BY/OFFSET/LIMIT/DISTINCT [ON]" },
    "postgresql-4-4-update-delete": { yt: "DeKBIzfTh3g", credit: "Correlation One — How to Update and Delete Data in SQL (UPDATE and DELETE Explained)" },
    /* ── Chương 5 — JOIN ── */
    "postgresql-5-1-inner-join": { yt: "0OQJDd3QqQM", credit: "techTFQ — SQL JOINS Tutorial for beginners | Practice SQL Queries using JOINS - Part 1" },
    "postgresql-5-2-outer-join": { yt: "aY7z4HcHm5M", credit: "Data with Baraa — SQL Joins Basics (Visually Explained) | INNER, LEFT, RIGHT, FULL | #SQL Course 8" },
    "postgresql-5-3-multi-self-join": { yt: "RehbnzKHS28", credit: "techTFQ — SQL JOINS Tutorial for beginners | Practice SQL Queries using JOINS - Part 2" },
    "postgresql-5-4-cross-join-traps": { yt: "53e1VV7OZeY", credit: "Naveen AutomationLabs — #2 CROSS JOIN or CARTESIAN PRODUCT" },
    /* ── Chương 6 — Tổng hợp & gom nhóm ── */
    "postgresql-6-1-ham-tong-hop": { yt: "jcoJuc5e3RE", credit: "Becoming a Data Scientist — Basic Aggregate Functions in SQL (COUNT, SUM, AVG, MAX, and MIN)" },
    "postgresql-6-2-group-by": { yt: "x2_mOJ3skSc", credit: "Database Star — SQL Group By: An Explanation and How To Use It" },
    "postgresql-6-3-having-filter": { yt: "caS_25B-xMY", credit: "Programming Is Fun — Master SQL Queries: HAVING, GROUP BY, and Advanced Filtering Explained" },
    "postgresql-6-4-tong-hop-tren-join": { yt: "5WmzoUOz7H8", credit: "The Data Millennials — JOIN With GROUPBY | How to join tables with groupby | How to use groupby when joining multiple table" },
    /* ── Chương 7 — Truy vấn con & CTE ── */
    "postgresql-7-1-subquery": { yt: "nJIEIzF7tDw", credit: "techTFQ — Subquery in SQL | Correlated Subquery + Complete SQL Subqueries Tutorial" },
    "postgresql-7-2-correlated-exists": { yt: "tvBp81WVrCA", credit: "Data with Baraa — SQL Subquery (Visually Explained) | Complete Guide with Correlated Subquery | #SQL Course 27" },
    "postgresql-7-3-cte": { yt: "5x1uodxEIaM", credit: "Data with Baraa — SQL CTE (Common Table Expression) Visually Explained | Full Guide WITH Clause | #SQL Course 28" },
    "postgresql-7-4-recursive-cte": { yt: "Szs7i8CgGhg", credit: "Matador Software — SQL Recursive CTEs Explained SIMPLY | Syntax Breakdown & Real Use Cases" },
    /* ── Chương 8 — Hàm cửa sổ ── */
    "postgresql-8-1-window-la-gi": { yt: "xFeOVIIRyvQ", credit: "Database Star — SQL Window Functions: Explained (with examples)" },
    "postgresql-8-2-ranking": { yt: "cXhv4kmIzFw", credit: "Data with Baraa — SQL Ranking Window Functions | ROW_NUMBER, RANK, DENSE_RANK, NTILE | #SQL Course 24" },
    "postgresql-8-3-lag-running-total": { yt: "6S7z2wabJxk", credit: "BeardedDev — SQL Tutorial - Window Functions - Calculate Running Totals, Averages" },
    "postgresql-8-4-frame-ntile": { yt: "zAmJPdZu8Rg", credit: "techTFQ — SQL Window Function | How to write SQL Query using Frame Clause, CUME_DIST | SQL Queries Tutorial" },
    /* ── Chương 9 — Chỉ mục ── */
    "postgresql-9-1-chi-muc-la-gi": { yt: "YZSHpDn7GP4", credit: "Tiger Data (creators of TimescaleDB) — Lesson 3, PostgreSQL Indexes and B-Trees (and an introduction to EXPLAIN)" },
    "postgresql-9-2-to-hop-covering": { yt: "fW-y-r7CgNI", credit: "Supabase — Are Multi-Column Indexes a good idea?" },
    "postgresql-9-3-khong-dung-selectivity-partial": { yt: "53CJUZ7rQ3E", credit: "Supabase — Simple trick to make your queries WAY more efficient // Partial Indexes" },
    "postgresql-9-4-loai-chi-muc": { yt: "AjqLNQjoGbE", credit: "Postgres Conference — Deep Dive Into PostgreSQL Indexes" },
    /* ── Chương 10 — EXPLAIN & bộ lập kế hoạch ── */
    "postgresql-10-1-doc-explain": { yt: "Mll5SqR4RYk", credit: "Lift And Shift Dev — Understand PostgreSQL query plan in 10 minutes" },
    "postgresql-10-2-chien-luoc-join": { yt: "pJWCwfv983Q", credit: "The Magic of SQL — How do nested loop, hash, and merge joins work? Databases for Developers Performance #7" },
    "postgresql-10-3-thong-ke-uoc-luong": { yt: "P5iZri9s0WQ", credit: "Andrea Ross — Explaining the Postgres Query Optimizer" },
    "postgresql-10-4-buffers-tinh-chinh": { yt: "pFSmxnh-K0Y", credit: "EDB — Postgres Pulse: Using EXPLAIN ANALYZE for Planning and Optimizing Query Performance | PostgreSQL" },
    "postgresql-11-1-giao-dich": { yt: "DvJq4L41ru0", credit: "" },   // How to implement Transactions (COMMIT, ROLLBACK, SavePoint) in PostgreSQL
    "postgresql-11-2-mvcc": { yt: "AveRgUrC7FM", credit: "" },   // Postgres System Columns Explained (ctid, xmin, xmax)
    "postgresql-11-3-muc-co-lap": { yt: "4EajrPgJAk0", credit: "" },   // [Backend #9] Understand isolation levels & read phenomena in MySQL & PostgreSQL via examples
    "postgresql-11-4-khoa-deadlock": { yt: "URwmzTeuHdk", credit: "" },   // All Postgres Locks Explained | A Deep Dive
    "postgresql-12-1-ham": { yt: "j1iGmLXoFfY", credit: "" },   // HOW TO CREATE PostgreSQL TRIGGERS | FUNCTIONS | Step by Step GUIDE
    "postgresql-12-2-trigger": { yt: "4FFQcOD2bT8", credit: "" },   // How To Create Audit Triggers In PostgreSQL || Trigger Functions In PostgreSQL
    "postgresql-12-3-view": { yt: "H5sBqE1pwPU", credit: "" },   // View in POSTGRESQL | Materialized View in POSTGRESQL
    "postgresql-12-4-materialized-view": { yt: "yHppzfjqm1s", credit: "" },   // PostgreSQL Materialized Views Explained | Boost Query Performance & Optimize Large Datasets
    "postgresql-13-1-jsonb": { yt: "aYqZXa2byrI", credit: "" },   // JSONB Tricks: Operators, Indexes, And When To (NOT) Use It
    "postgresql-13-2-gin-jsonb": { yt: "EwFjETYge9I", credit: "" },   // Faster queries with index on JSONB columns in Postgres
    "postgresql-13-3-full-text-search": { yt: "Ye9b_ujTF5Y", credit: "" },   // Postgres Is All You Need for Full Text Search (Seriously)
    "postgresql-13-4-trigram": { yt: "JtXHTQUKPLM", credit: "" },   // 5mins of Postgres E6: Optimizing Postgres Text Search with Trigrams and GiST indexes
    "postgresql-14-1-gia-ket-noi": { yt: "UkFEbiNXBrg", credit: "" },   // Webinar: Postgres Connection Pooling
    "postgresql-14-2-pool-pgbouncer": { yt: "oPrEEHnB1qs", credit: "" },   // How to calculate max_connections for PostgreSQL and default_pool_size for pgbouncer?
    "postgresql-14-3-vacuum-bloat": { yt: "vtjjaEVPAb8", credit: "" },   // Webinar: How to tune Postgres autovacuum to improve performance and reduce bloat
    "postgresql-14-4-giam-sat": { yt: "kjE4jP59oJ4", credit: "" },   // Postgres In Production | Deep Dive into pg_stat_statements (Part 5)
    "postgresql-15-1-pg-dump": { yt: "0NUV49elsX8", credit: "" },   // Backup and Restore PostgreSQL Database: pg_dump and pg_restore Explained
    "postgresql-15-2-wal-pitr": { yt: "WZps_MYYvV8", credit: "" },   // Postgres Continuous Archiving and Point in Time Recovery
    "postgresql-15-3-nhan-ban": { yt: "Yy0GJjRQcRQ", credit: "" },   // PostgreSQL Streaming Replication Tutorial
    "postgresql-15-4-phan-manh": { yt: "dKJyMj_P-XA", credit: "" },   // PostgreSQL Partitioning: Slicing and Dicing for Performance and Easier Maintenance | POSETTE 2024
    "postgresql-16-1-prisma-migration": { yt: "PX881bVAPxM", credit: "" },   // Prisma essentials: from development to production (Prisma Migrate workflow)
    "postgresql-16-2-luoc-do-that": { yt: "jzn-Q0n-8_w", credit: "" },   // PGConf NYC 2021 - Advanced Postgres Schema Design by Sehrope Sarkuni
    "postgresql-16-3-checklist": { yt: "-1aO6UznfI0", credit: "" },   // How to perform Postgres schema changes in production with zero downtime
    "postgresql-16-4-capstone": { yt: "XpEevNnD0hc", credit: "" },   // PostgreSQL Performance Tuning Demo - Live Troubleshooting
  },
};
