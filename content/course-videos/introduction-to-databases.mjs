/**
 * Curated YouTube track for DBI202 — Introduction to Databases (SQL Server / relational DB).
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per content lesson slug → an English lecture from a reputable
 * channel (Neso Academy, Socratica, kudvenkat, CBT Nuggets, IBM Technology,
 * ByteByteGo) whose ACTUAL content matches the lesson topic.
 *
 * Every id was resolved live+embeddable through YouTube's oEmbed endpoint
 * (200 + real title/channel). Re-check any time with:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/introduction-to-databases.mjs
 *
 * Pure-admin lessons (passing requirements) and topics with no clearly-matching
 * reputable English video are deliberately absent — precision over coverage.
 */
export default {
  courseSlug: 'introduction-to-databases',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu & cài đặt ── */
    "dbi202-gioi-thieu": { yt: "hRulZhTtUTg", credit: "IBM Technology — What is a Database?" },
    "dbi202-cai-dat": { yt: "7GVFYt6_ZFM", credit: "kudvenkat — Install SQL Server 2019 Step by Step | Developer Edition | Free Software | Install SSMS" },

    /* ── Chương 1 — CSDL & DBMS ── */
    "dbi202-csdl-dbms": { yt: "OMwgGL3lHlI", credit: "Neso Academy — Introduction to Database Management Systems (DBMS)" },

    /* ── Chương 2 — Mô hình quan hệ & đại số quan hệ ── */
    "dbi202-mo-hinh-quan-he": { yt: "Q45sr5p_NmQ", credit: "Neso Academy — Introduction to Relational Data Model" },
    "dbi202-dai-so-quan-he": { yt: "8PJGw123zeE", credit: "Neso Academy — Relational Algebra Operations - Unary" },
    "dbi202-dai-so-nang-cao": { yt: "4kqoN9-rqiQ", credit: "Neso Academy — Additional Relational Algebra Operations" },
    "dbi202-rang-buoc-quan-he": { yt: "uPOGPL2C0_8", credit: "Neso Academy — Relational Model Constraints" },

    /* ── Chương 3 — Mô hình ER ── */
    "dbi202-er-model": { yt: "vz5az6N86DY", credit: "Neso Academy — Introduction to E-R Model (Part 1)" },
    "dbi202-er-subclass": { yt: "uujDdvDQsaE", credit: "Neso Academy — Extended ER Features" },

    /* ── Chương 4 — Chuẩn hoá ── */
    "dbi202-chuan-hoa": { yt: "upS2HlUj1gI", credit: "CBT Nuggets — MicroNugget: How to Normalize Databases" },
    "dbi202-chuan-hoa-vi-du": { yt: "siiYInWniFs", credit: "CBT Nuggets — How to Normalize a Database Table" },

    /* ── Chương 5 — SQL DDL ── */
    "dbi202-sql-ddl": { yt: "Jtai4ogSsB4", credit: "Neso Academy — DDL Commands - CREATE" },
    "dbi202-rang-buoc-sql": { yt: "-8bYtApJNos", credit: "Neso Academy — Constraints in SQL" },

    /* ── Chương 6 — Truy vấn SQL ── */
    "dbi202-select-join": { yt: "nWyyDHhTxYU", credit: "Socratica — Learn SQL with Socratica  |¦|  SQL Tutorial  |¦|  SQL for Beginners" },
    "dbi202-join-day-du": { yt: "9yeOJ0ZMUYw", credit: "Socratica — SQL Joins Explained  |¦| Joins in SQL |¦| SQL Tutorial" },
    "dbi202-group-by-subquery": { yt: "VQf0V6Wwbf4", credit: "Neso Academy — GROUP BY and HAVING Clause in SQL" },
    "dbi202-truy-van-long": { yt: "Qb_7J_svPyY", credit: "Neso Academy — ANY and ALL Operators in SQL" },
    "dbi202-cap-nhat-du-lieu": { yt: "w27gAgDQr_w", credit: "Neso Academy — DML Commands - INSERT and UPDATE" },

    /* ── Chương 7 — View, thủ tục, trigger ── */
    "dbi202-view": { yt: "VQpmOmZO2mo", credit: "kudvenkat — Views in sql server   Part 39" },
    "dbi202-proc-function": { yt: "Qu3E-oncF3g", credit: "kudvenkat — Stored procedures in sql server   Part 18" },
    "dbi202-trigger-cursor": { yt: "k0S4P-a6d5w", credit: "kudvenkat — DML triggers in sql server   Part 43" },

    /* ── Chương 8 — Chỉ mục & giao dịch ── */
    "dbi202-chi-muc": { yt: "i_FwqzYMUvk", credit: "kudvenkat — Indexes in sql server   Part 35" },
    "dbi202-execution-plan": { yt: "NGslt99VOCw", credit: "kudvenkat — Clustered and nonclustered indexes in sql server   Part 36" },
    "dbi202-transaction-acid": { yt: "GAe5oB742dw", credit: "ByteByteGo — ACID Properties in Databases With Examples" },

    /* ── 30/09/2026 — bài 📑 theo slide, 🧪 thực hành, bài nền tảng & Xưởng ERD (flm-nguon/DBI202/video-ket-qua.tsv) ── */
    "dbi202-bat-dau-tai-day": { yt: "wR0jg0eQsZA", credit: "Lucid Software — Database Tutorial for Beginners" },
    "dbi202-cai-dat-ket-noi": { yt: "WdvTb7YKi6Y", credit: "SQL Server 101 — How to install SQL Server 2022 Developer and SQL Server Management Studio (SSMS) - for FREE" },
    "dbi202-buoi-dau-tien": { yt: "ft_JWXmH9y4", credit: "SQL Server 101 — Creating tables and adding data in Microsoft SQL Server - using GUI and T-SQL code" },
    "dbi202-slide-dbi1-1": { yt: "OqjJjpjDRLc", credit: "IBM Technology — What is a Relational Database?" },
    "dbi202-slide-dbi2-1": { yt: "D-k-h0GuFmE", credit: "Stanford Dbclass — 01-01-introduction.mp4" },
    "dbi202-on-ch1": { yt: "vuXnRRG-m5M", credit: "Neso Academy — Three-Schema Architecture & Data Independence" },
    "dbi202-slide-dbi3-1": { yt: "spQ7IFksP9g", credit: "Stanford Dbclass — 02-01-relational-model.mp4" },
    "dbi202-slide-dbi3-2": { yt: "tii7xcFilOA", credit: "Stanford Dbclass — 05-01-relational-algebra-1.mp4" },
    "dbi202-slide-dbi6-1": { yt: "9w5uRCFOiTo", credit: "kudvenkat — Union and union all in sql server   Part 17" },
    "dbi202-slide-dbi6-2": { yt: "VBnVfhl9ur0", credit: "Neso Academy — Relational Algebra (Outer Join Operation)" },
    "dbi202-on-ch2": { yt: "GkBf2dZAES0", credit: "Stanford Dbclass — 05-02-relational-algebra-2.mp4" },
    "dbi202-slide-dbi5-1": { yt: "rorft23glC0", credit: "Neso Academy — Entity-Relationship (ER) Diagram" },
    "dbi202-slide-dbi5-2": { yt: "xQRRf5fOAt8", credit: "Giraffe Academy — Converting ER Diagrams to Schemas | SQL | Tutorial 23" },
    "dbi202-slide-dbi5-3": { yt: "X89KLfrNOPo", credit: "Stanford Dbclass — 09-02-uml-to-relations.mp4" },
    "dbi202-xuong-erd": { yt: "7V95C43ujlU", credit: "Neso Academy — ER Diagram for University Database" },
    "dbi202-on-ch3": { yt: "LowjDtiNlk4", credit: "Decomplexify — Entity Relationship Diagrams" },
    "dbi202-slide-dbi4-1": { yt: "Mkm1h5AtsXI", credit: "Stanford Dbclass — 07-02-functional-dependencies.mp4" },
    "dbi202-slide-dbi4-2": { yt: "GFQaEYEc8_8", credit: "Decomplexify — Learn Database Normalization - 1NF, 2NF, 3NF, 4NF, 5NF" },
    "dbi202-slide-dbi4-3": { yt: "aAx_JoEDXQA", credit: "Studytonight with Abhishek — Third Normal Form (3NF) | Database Normalization | DBMS" },
    "dbi202-slide-dbi4-4": { yt: "mfVCesoMaGA", credit: "Stanford Dbclass — 07-03-bcnf.mp4" },
    "dbi202-on-ch4": { yt: "-DsnJygWgi4", credit: "Jenny's Lectures CS IT — Lec 21: What is Canonical Cover in DBMS | Minimal cover Irreducible with example" },
    "dbi202-slide-dbi7-1": { yt: "1ZeiJ1D6NGU", credit: "Neso Academy — LIKE in SQL" },
    "dbi202-slide-dbi7-2": { yt: "JLeaM8pK8dE", credit: "kudvenkat — Creating and working with tables - Part 3" },
    "dbi202-on-ch5": { yt: "9Zj5ODhv0b0", credit: "kudvenkat — Adding a check constraint - Part 6" },
    "dbi202-slide-dbi7-3": { yt: "R9pXnHIFj_8", credit: "kudvenkat — Select statement in sql server - Part 10" },
    "dbi202-slide-dbi7-4": { yt: "qnYSN_7qwgg", credit: "kudvenkat — Self join in sql server - Part 14" },
    "dbi202-slide-dbi7-5": { yt: "Ra3ISwvcFlM", credit: "kudvenkat — Correlated subquery in sql   Part 60" },
    "dbi202-slide-dbi7-6": { yt: "FKSSOpQe5Jc", credit: "kudvenkat — Group by in sql server - Part 11" },
    "dbi202-on-ch6": { yt: "JtmfAGM4pfc", credit: "kudvenkat — Subqueries in sql   Part 59" },
    "dbi202-slide-dbi9-1": { yt: "VLDirfx_OQg", credit: "kudvenkat — Error handling in sql server   Part 56" },
    "dbi202-slide-dbi9-2": { yt: "OV5CquR1Svo", credit: "kudvenkat — Scalar user defined functions in sql server   Part 30" },
    "dbi202-slide-dbi9-3": { yt: "P_BREQy6bOo", credit: "kudvenkat — After update trigger   Part 44" },
    "dbi202-on-ch7": { yt: "bldBshxuhMk", credit: "kudvenkat — Stored procedures with output parameters   Part 19" },
    "dbi202-slide-dbi8-1": { yt: "aNCpEC0-VVs", credit: "Stanford Dbclass — 12-02-transactions-properties.mp4" },
    "dbi202-slide-dbi8-2": { yt: "BxAj3bl00-o", credit: "Data with Baraa — SQL Indexes (Visually Explained) | Clustered vs Nonclustered | #SQL Course 35" },
    "dbi202-on-ch8": { yt: "shkt9Z5Gz-U", credit: "kudvenkat — Transactions in sql server   Part 57" },
  },
};
