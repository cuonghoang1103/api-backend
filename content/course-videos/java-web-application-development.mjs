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
    "prj301-bat-dau-tai-day": { yt: "dKzAOEc4obw", credit: "Jakarta EE — Why Choose Jakarta EE?" },
    "prj301-cai-moi-truong": { yt: "a6dOGqC8XLA", credit: "CS CORNER Sunita Rai — Java Web Application in NetBeans: Servlet Creation & Tomcat Configuration", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/00-gioi-thieu-huong-dan-hoc/00-03-cai-moi-truong-jdk-tomcat-netbeans-tron-ff1aa80f.mp4' }, defaultVideoTrack: 'VI'},
    "prj301-buoi-dau-tien": { yt: "WXmTxgDg52o", credit: "Telusko — Servlet | JSP | JDBC | Maven Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/00-gioi-thieu-huong-dan-hoc/00-05-buoi-thuc-hanh-dau-tien-e154ff81.mp4' }, defaultVideoTrack: 'VI'},
    "prj301-cai-dat": { yt: "gqyB0ef4duY", credit: "Simplifying Tech — How to Create java Web application using NetBeans IDE | Install Configure Tomcat 10 Server", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/00-gioi-thieu-huong-dan-hoc/00-03-cai-moi-truong-jdk-tomcat-netbeans-tron-ff1aa80f.mp4' }, defaultVideoTrack: 'VI'},
    "prj301-slide-prj1-1": { yt: "CRvcm7GKrF0", credit: "Telusko — Introduction to Servlets" },
    "prj301-on-ch1": { yt: "iYM2zFP3Zn0", credit: "Traversy Media — HTTP Crash Course & Exploration" },
    "prj301-slide-prj1-2": { yt: "6AcVTFcZkCk", credit: "Ram N Java — Servlet Life Cycle Explained with Example: Everything You Need to Know | Servlets" },
    "prj301-slide-prj1-3": { yt: "jZL33Hggf-I", credit: "Ram N Java — How to Deploy Web Applications in Apache Tomcat: WAR File Deployment" },
    "prj301-on-ch2": { yt: "_6ISkXSC1js", credit: "Telusko — #6 Servlet and JSP Tutorial | Get and Post" },
    "prj301-slide-prj3-1": { yt: "8M5fuIuhRHA", credit: "Telusko — How JSP translated into Servlets?" },
    "prj301-slide-prj3-2": { yt: "LlVcQhKGVbU", credit: "Telusko — JSP Directive | Page | Include | Taglib" },
    "prj301-slide-prj6-1": { yt: "mhrDVzj8pQM", credit: "Telusko — Implicit Objects in JSP" },
    "prj301-jsp": { yt: "5Sz8z1Yreow", credit: "Telusko — Servlet and JSP Tutorial | Why JSP?" },
    "prj301-slide-prj7-1": { yt: "GEpyxY1mG_U", credit: "Trịnh Thị Vân Anh ( Trịnh Blog ) — Bài 3: EL và JSTL - Phần 2: JSTL (JSP Standard Tag Library)" },
    "prj301-slide-prj9-1": { yt: "MAG6OPphuFk", credit: "DJCoder — How to create JSP Custom tags and use in Apache Netbeans" },
    "prj301-custom-tag": { yt: "tox6mq8e8KA", credit: "RK Keynotes — #12 How to Create Own Tags in JSP? | Custom Tags | Tag Handler Class | TLD File | doTag() | Taglib" },
    "prj301-slide-prj5-1": { yt: "g0k1d5BlXR0", credit: "Telusko — Servlet Java Tutorial Part 8 How to use Cookie for session Management" },
    "prj301-scope": { yt: "CzlZGHAGHbk", credit: "Telusko — Servlet Java Tutorial Part 7 How to use HttpSession Session Management" },
    "prj301-application-scope": { yt: "oWqrMXfQbo0", credit: "Telusko — JSP Hit Counter using Session and Application Implicit Object Example" },
    "prj301-on-ch4": { yt: "2HurrgxlTmg", credit: "Telusko — #9 Servlet and JSP Tutorial | sendRedirect | URL Rewriting" },
    "prj301-slide-prj2-1": { yt: "5vzCjvUwMXg", credit: "Telusko — 16.2 Java Database Connectivity Practical" },
    "prj301-slide-prj2-2": { yt: "gU3DLOsw0Eg", credit: "luv2code — Java JDBC Tutorial - Part 5: Prepared Statements" },
    "prj301-transaction-pool": { yt: "IqnxrRIy99w", credit: "Ram N Java — JDBC Transaction Management: Real-world Scenario Demo" },
    "prj301-on-ch5": { yt: "8QOjN89wA-Y", credit: "Telusko — 16.6 Java Database Connectivity with DAO Example" },
    "prj301-slide-prj4-1": { yt: "DUg2SWWK18I", credit: "Web Dev Simplified — MVC Explained in 4 Minutes" },
    "prj301-front-controller": { yt: "sdZpQFxZ6i0", credit: "In28Minutes-Short-Tutorials — Java EE - Modified MVC Pattern using Front Controller" },
    "prj301-pagination": { yt: "vQcdVAJSYOM", credit: "Laptrinhjavaweb - Làm chủ lập trình java dễ dàng — Học jsp servlet jdbc 2019 - Hiển thị phân trang trong jsp servlet jdbc phần 7" },
    "prj301-on-ch6": { yt: "ns1LX6mEvyM", credit: "Web Dev Simplified — How To Prevent The Most Common Cross Site Scripting Attack" },
    "prj301-slide-prj8-1": { yt: "xHminZ9Dxm4", credit: "Marco Codes — Hibernate & JPA Tutorial - Crash Course" },
    "prj301-jpa": { yt: "Y7PpjerZkc0", credit: "Thorben Janssen — JPA & Hibernate: Entity Lifecycle Model" },
    "prj301-jpa-sau": { yt: "fuLaCgzzMBA", credit: "Vlad Mihalcea — The best way to map a bidirectional JPA OneToMany relationship" },
    "prj301-on-ch7": { yt: "zwF5ADW6eKs", credit: "Java Techie — Interview Q&A | Hibernate N+1 Problem & Fix - The Bug You Didn’t Know You Had @Javatechie" },
    "prj301-slide-prj10-1": { yt: "preCXrKFISg", credit: "Telusko — Servlet Filter Practical" },
    "prj301-slide-prj11-1": { yt: "K74XxH3-wZU", credit: "Ram N Java — Servlets Tutorial: Introduction to ServletContextListener | Servlets" },
    "prj301-listener": { yt: "BRg4AtRfCzk", credit: "Ram N Java — Servlets Tutorial: HttpSessionListener Demo | Servlets" },
    "prj301-on-ch8": { yt: "t9CPWIm_F-Y", credit: "Learning Programming — Authentication and Authorization with Filter in JSP-Servlet" },
    "prj301-ajax-json": { yt: "4VgHJCAKZZQ", credit: "Philip Starritt — AJAX Tutorial - JSP call to Java Servlet using jQuery & JSON response" },
    "prj301-ai-s3": { yt: "_ZvnD73m40o", credit: "freeCodeCamp.org — Prompt Engineering Tutorial – Master ChatGPT and LLM Responses" },
    "prj301-ai-s8": { yt: "UiSeRelfJcg", credit: "Developer Summit — Unlocking AI's Potential: Smarter Coding in Apache NetBeans IDE - Gaurav Gupta" },
    "prj301-ai-s15": { yt: "WONbg6ZjiXk", credit: "Vickie Li Dev — SQL Injection Prevention: Security Simplified" },
    "prj301-ai-s51": { yt: "skut_4jdvzc", credit: "JetBrains — How AI Agents Work: Prompt, Context, Harness & Loop Explained" },
    "prj301-ai-prompt": { yt: "n0VpK1RfYGA", credit: "Telusko — Prompt Engineering" },
    "prj301-ai-servlet": { yt: "LcGrLzFD5Jo", credit: "Telusko — OpenAI model call using Java" },
    "prj301-on-ch10": { yt: "gUNXZMcd2jU", credit: "IBM Technology — OWASP's Top 10 Ways to Attack LLMs: AI Vulnerabilities Exposed" },
    "prj301-asm-2": { yt: "xsg9BDiwiJE", credit: "Lucid Software — Entity Relationship Diagram (ERD) Tutorial - Part 1" },
    "prj301-asm-3": { yt: "-etRgxd9vc4", credit: "TutusFunny — Build a JSP MYSQL CRUD Application in Minutes! | jsp and servlet" },
    "prj301-asm-4": { yt: "rloqMGcPMkI", credit: "PwnFunction — Insecure Direct Object Reference (IDOR) Explained" },
    "prj301-asm-5": { yt: "wlSG3pEiQdc", credit: "Computerphile — Securing Stream Ciphers (HMAC) - Computerphile" },
    'prj301-nt-0-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/90-du-an-nha-tro-khoi-dong/90-01-de-bai-tac-nhan-use-case-5bf99240.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-0-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/90-du-an-nha-tro-khoi-dong/90-02-ban-do-mot-request-70f5a4d2.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-0-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/90-du-an-nha-tro-khoi-dong/90-03-doc-loi-log-tomcat-404-500-617043f7.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-0-4': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/90-du-an-nha-tro-khoi-dong/90-04-git-mot-the-mot-nhanh-mot-pr-05012c4f.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-l-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-01-nt21-tao-repo-tu-khung-acc36838.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-l-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-02-nt22-setup-sql-pr-dau-tien-0695ccdc.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-k-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-03-nt24-layout-chung-75043da0.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-k-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-04-nt30-dang-ky-1-bam-mat-khau-transaction-0f7e35b3.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-k-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-05-nt30-dang-ky-2-kiem-server-prg-7f6256ee.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-t-1': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-06-nt31-dang-nhap-1-mot-cau-bao-loi-288b0774.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-t-2': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-07-nt31-dang-nhap-2-session-moi-dang-xuat-4f5f1989.mp4' }, defaultVideoTrack: 'VI'},
    'prj301-nt-t-3': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/java-web-application-development/91-nhap-vai-1-khung-csdl-tai-khoan/91-08-nt41-authorization-filter-dfe9b85f.mp4' }, defaultVideoTrack: 'VI'},
  },
};
