/**
 * Curated YouTube track for PRJ301 — Java Web Application Development.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per lesson slug; `credit` is shown under the player so the author
 * is named. Every id is verified live + embeddable via YouTube oEmbed.
 *
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/java-web-application-development.mjs
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/java-web-application-development.mjs --apply
 *
 * Admin lessons (grading, passing rules), the AI-integration lessons, and any
 * topic without a clearly-matching video from a reputable channel are
 * deliberately absent — precision over coverage.
 */
export default {
  courseSlug: 'java-web-application-development',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu ─────────────────────────────────────────────── */
    'prj301-gioi-thieu': { yt: 'OuBUUkQfBYM', credit: 'Telusko — Servlet & JSP Tutorial | Full Course' },

    /* ── Chương 1 — HTTP & Servlet đầu tiên ─────────────────────────────── */
    'prj301-http-servlet': { yt: '7TOmdDJc14s', credit: 'Telusko — Introduction to Servlets' },
    'prj301-cau-truc-deploy': { yt: 'wty6OROO__8', credit: 'Telusko — #5 Servlet and JSP Tutorial | Create Servlet and web.xml Config' },

    /* ── Chương 2 — Servlet chuyên sâu ──────────────────────────────────── */
    'prj301-servlet-sau': { yt: 'kYzyXWmh37A', credit: 'Telusko — #8 Servlet and JSP Tutorial | RequestDispatcher and  sendRedirect Theory' },
    'prj301-request-response': { yt: 'GbF_nBLHP6A', credit: 'Telusko — HttpServletRequest and HttpServletResponse Theory' },
    'prj301-init-context-validation': { yt: 'uKoBbSp0J3Y', credit: 'Telusko — ServletConfig and ServletContext' },

    /* ── Chương 3 — JSP, EL & JSTL ──────────────────────────────────────── */
    'prj301-jsp-sau': { yt: 'NQ7xKNULkTk', credit: 'Telusko — JSP Tags | Scriptlet | Declaration | Directive | Expression' },
    'prj301-el': { yt: 'KmREMEhj5eE', credit: 'Telusko — JSTL Tutorial part 1 EL' },
    'prj301-jstl': { yt: 'R0EnI9_ZMA0', credit: 'Telusko — JSTL Tutorial part 2 Core Tags' },

    /* ── Chương 4 — Phạm vi, Cookie & Session ───────────────────────────── */
    'prj301-cookie-session': { yt: '5tLGwdyPGRY', credit: 'Telusko — #10 Servlet and JSP Tutorial | HttpSession | Cookie' },

    /* ── Chương 5 — JDBC & DAO ──────────────────────────────────────────── */
    'prj301-jdbc-dao': { yt: 'y_YxwyYRJek', credit: 'Telusko — 16.1  JDBC | Java Database Connectivity Theory Tutorial' },
    'prj301-jdbc-driver': { yt: 'xiVmv75Dug0', credit: 'Telusko — Java Database Connectivity  JDBC  Practical Tutorial' },
    'prj301-jdbc-crud': { yt: '7v2OnUti2eM', credit: 'Telusko — Java Database Connectivity | JDBC' },

    /* ── Chương 6 — Mô hình MVC ─────────────────────────────────────────── */
    'prj301-mvc': { yt: 'MDHj4vgKY6Q', credit: 'Telusko — MVC using Servlet and JSP' },

    /* ── Chương 8 — Filter & Listener ───────────────────────────────────── */
    'prj301-filter': { yt: 'w5GfmTUHAnM', credit: 'Telusko — Servlet Filter Tutorial Theory' },

    /* ── Chương 9 — Upload & AJAX ───────────────────────────────────────── */
    'prj301-upload': { yt: '4yb16lTxbM8', credit: 'Telusko — File Upload in Java Servlet' },

    /* ── Phụ lục A — Hướng nâng cao (Spring Boot) ───────────────────────── */
    'prj301-nang-cao': { yt: 'Cw0J6jYJtzw', credit: 'Amigoscode — Spring Boot Tutorial for Beginners | Full Course 2025' },
  },
};
