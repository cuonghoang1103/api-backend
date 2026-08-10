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
  },
};
