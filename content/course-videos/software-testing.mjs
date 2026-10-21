/**
 * Curated YouTube track for SWT301 — Software Testing.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/software-testing.mjs
 */
export default {
  courseSlug: 'software-testing',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 — Giới thiệu (0.2/0.3 admin: bỏ) ── */
    "swt301-gioi-thieu": { yt: "TDynSmrzpXw", credit: "Guru99 — What is Software Testing & Why Testing is Important?", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-01-gioi-thieu-swt301-istqb-697a1638.mp4' }, defaultVideoTrack: 'VI'},
    /* ── Chương 1 — Cơ bản ── */
    "swt301-fundamentals-principles": { yt: "rFaWOw8bIMM", credit: "Guru99 — Seven Testing Principles: Software Testing", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/01-nen-tang-kiem-thu/01-01-kiem-thu-la-gi-tron-0b8c0572.mp4' }, defaultVideoTrack: 'VI'},
    "swt301-test-process": { yt: "p5LRbJsw3Ys", credit: "Software Testing Mentor — ISTQB Foundation Level #6 - Fundamental Test Process - Part 1", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/01-nen-tang-kiem-thu/01-04-quy-trinh-test-tron-17b7c18b.mp4' }, defaultVideoTrack: 'VI'},
    /* ── Chương 2 — Cấp độ & loại kiểm thử ── */
    "swt301-test-levels": { yt: "cQ39AwhjxH8", credit: "Smart Software Testing. QA world — ISTQB Foundation Course. Test Levels: Component, Integration, System, and Acceptance Testing)" },
    "swt301-test-types": { yt: "pCC6kZulLZM", credit: "TM SQUARE — ISTQB FOUNDATION 4.0 | Tutorial 18 | Test Types | Functional Testing | Non-Functional Testing | CTFL" },
    /* ── Chương 3 — Kiểm thử tĩnh ── */
    "swt301-static-reviews": { yt: "_0vHG94JpU8", credit: "TM SQUARE — ISTQB FOUNDATION 4.0 | Tutorial 26 | Review Types | Informal, Walkthrough, Technical & Inspection" },
    /* ── Chương 4 — Black-box ── */
    "swt301-blackbox-ep-bva": { yt: "P1Hv2sUPKeM", credit: "Guru99 — Boundary Value Analysis and Equivalence Partitioning: Software Testing Tutorial" },
    "swt301-blackbox-decision-state": { yt: "UiZQ3haZlWQ", credit: "IONISED — Lecture 14 : Decision Tables & State Transition Testing | CSTE Course" },
    /* ── Chương 5 — White-box ── */
    "swt301-whitebox-coverage": { yt: "-Rc6LK3FJXQ", credit: "Unify Study — Statement Coverage - Branch Coverage - Path Coverage | White Box Testing | UGC NET PYQs" },
    "swt301-cyclomatic-complexity": { yt: "9RvUj1Psqgk", credit: "iProcess Consulting — Cyclomatic complexity and the impact on testing" },
    /* ── Chương 6 — Dựa trên kinh nghiệm ── */
    "swt301-experience-based": { yt: "LrKjF1fM2Lc", credit: "Software Testing with Eid — ISTQB-FL Ch.4_Experience-based Techniques (Error Guessing, Exploratory Testing, and Checklist-based)" },
    /* ── Chương 7 — Kế hoạch & lỗi ── */
    "swt301-test-plan-risk": { yt: "g1v0iLnzkUc", credit: "Testing Interview Q&A by Software Testing Mentor — What is Risk Based Testing | Software Testing Interview Questions" },
    "swt301-bug-lifecycle": { yt: "NpDZ2NJmDrE", credit: "Guru99 — Defect/Bug Life Cycle: Software Testing Tutorial 23" },
    /* ── Chương 8 — Công cụ & tự động hoá ── */
    "swt301-tools-pyramid": { yt: "GNO6iHlYxzg", credit: "UltimateQA — The Test Automation Pyramid" },
    "swt301-ci-automation": { yt: "1er2cjUq1UI", credit: "IBM Technology — What is Continuous Integration?" },
    /* ── Chương 9 — Agile ── */
    "swt301-agile-quadrants": { yt: "_BUlNzkyH58", credit: "Software Testing Mentor — ISTQB Agile Tester #43 - Agile Testing Quadrants and Test Levels" },
    "swt301-tdd-bdd": { yt: "Bq_oz7nCNUA", credit: "Modern Software Engineering — Test Driven Development vs Behavior Driven Development" },
    "swt301-istqb-exam-strategy": { yt: "D8teFPYng3c", credit: "ASTQB - ISTQB in the U.S. and Globally — ASTQB Podcast: Interview with Diana - How She Passed ISTQB Foundation Level Certification", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-05-de-istqb-va-fe-tron-12b69dc5.mp4' }, defaultVideoTrack: 'VI'},
    "swt301-why-testing-necessary": { yt: "NnclS4Qy5jY", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 1.2.3. Errors, Defects, Failures, and Root Causes", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/01-nen-tang-kiem-thu/01-02-vi-sao-can-kiem-thu-tron-967b92a7.mp4' }, defaultVideoTrack: 'VI'},
    "swt301-seven-principles": { yt: "W2mVeHTh5AY", credit: "Software Testing Help — Principles of Software Testing - Seven Fundamental Principles of Testing (ISTQB Level)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/01-nen-tang-kiem-thu/01-03-bay-nguyen-tac-tron-8774c750.mp4' }, defaultVideoTrack: 'VI'},
    "swt301-psychology-ethics": { yt: "Y8msb-bUYpM", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 1.5.3 Independence of Testing", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/01-nen-tang-kiem-thu/01-05-tam-ly-doc-lap-dao-duc-db73c082.mp4' }, defaultVideoTrack: 'VI'},
    "swt301-ch1-slides-2023": { yt: "Q5r--iE0tWw", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 1.4.1  Test Activities and Tasks" },
    "swt301-sdlc-models": { yt: "o3jDLVCpH1E", credit: "Modern Software Engineering — The WORST Way to Develop Software" },
    "swt301-system-acceptance": { yt: "JDD5EEJgpHU", credit: "Modern Software Engineering — How to Write Acceptance Tests" },
    "swt301-maintenance-test-plan": { yt: "4UldhHFaLek", credit: "Software Testing Help — Test Plan - Test Plan Template Test Plan Document Test Plan Sample" },
    "swt301-levels-overview-matrix": { yt: "gnrBqLbj1_Q", credit: "Modern Software Engineering — When To Use These 5 TOP Software Test Types" },
    "swt301-ch2-slides-2023": { yt: "SvXThmBT1Mc", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 2.1.5. Shift Left" },
    "swt301-static-testing-basics": { yt: "xVHoxoi6Sfc", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 3.1.3  Differences between Static Testing and Dynamic Testing" },
    "swt301-review-types-techniques": { yt: "_WCJA-RNAIE", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 3.2.4 Review Types" },
    "swt301-static-analysis": { yt: "el9OKGrqU6o", credit: "Sonar — Refactoring with Cognitive Complexity" },
    "swt301-ch3-slides-2023": { yt: "9N6ncT1Nz1Y", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 3.2.2 Review Process Activities" },
    "swt301-lab1-review-checklist": { yt: "d9_fweNDjKw", credit: "Modern Software Engineering — Better Code Reviews in 6 SIMPLE STEPS" },
    "swt301-lab1-worked-review": { yt: "aOLzGQUaTPA", credit: "IntelliJ IDEA, a JetBrains IDE — Inspections in IntelliJ IDEA" },
    "swt301-lab1-static-analysis": { yt: "M86f__ZYIKQ", credit: "Sonar — SonarQube Enterprise Solution Demo | Automate High-Quality Code & Security" },
    "swt301-lab1-pe-question1": { yt: "u5Q70S9C-HU", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 5.5 Defect Management" },
    "swt301-test-technique-categories": { yt: "Z_oAdF_B7-8", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.1 Test Techniques Overview" },
    "swt301-blackbox-bva-template": { yt: "nzjejkwWMRE", credit: "Software Testing Help — Boundary Value Analysis - what is boundary value analysis in Software Testing" },
    "swt301-blackbox-state-transition": { yt: "p8jyL6-Oj2k", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.2.4 State Transition Testing" },
    "swt301-blackbox-use-case": { yt: "9P5WG8CkPrQ", credit: "Modern Software Engineering — A Real World Example of BDD" },
    "swt301-ch4-slides-2023": { yt: "1aw6uXX4Y-o", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.2.3 Decision Table Testing" },
    "swt301-ch5-slides-2023": { yt: "L1l1S4_ptWc", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.3.2 Branch Testing and Branch Coverage" },
    "swt301-choosing-test-techniques": { yt: "z-3aSVfoyBY", credit: "Modern Software Engineering — Testing Strategy for DevOps: What to Test and When" },
    "swt301-lab2-guide-process": { yt: "h-4i5N89TUI", credit: "Modern Software Engineering — Unit Testing Is The BARE MINIMUM" },
    "swt301-lab2-guide-appendix": { yt: "m1NQNaxbEVo", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.3.1 Statement Testing and Statement Coverage" },
    "swt301-lab2-whitebox": { yt: "QDFI19lj4OM", credit: "IntelliJ IDEA, a JetBrains IDE — Unit Testing and Coverage in IntelliJ IDEA" },
    "swt301-lab2-blackbox": { yt: "flpmSXVTqBI", credit: "freeCodeCamp.org — Java Testing - JUnit 5 Crash Course" },
    "swt301-lab2-unit-test-points": { yt: "xaQC9EWDb8w", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.4.3 Checklist Based Testing" },
    /* ── Lab 2 · LabFlow (L2.10–L2.15, video giọng chủ kênh ~/Videos/CuongThai-KhoaHoc/swt301-lab2/01-lab2-unit-test-labflow/*).
       CHƯA tải lên R2: sau `tsx xuat/len-r2.mts …` lấy r2Url trong từng thong-tin.json, bỏ // ở 6 dòng dưới và dán URL.
       (gan-web.mts không dùng được cho loạt này: nó đọc content/course-videos/<khoá>.mjs = swt301-lab2.mjs — không có — và
       bỏ qua thư mục 01-01b vì regex /^\d\d-\d\d-/.) ── */
    "swt301-lab2-labflow-nghiep-vu": { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/swt301-lab2/01-lab2-unit-test-labflow/01-01-labflow-demo-nghiep-vu-du-lieu-61a536fd.mp4' }, defaultVideoTrack: 'VI' },
    "swt301-lab2-labflow-chay-app-test": { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/swt301-lab2/01-lab2-unit-test-labflow/01-01b-labflow-demo-ben-trong-code-94a054b8.mp4' }, defaultVideoTrack: 'VI' },
    "swt301-lab2-report51-a-z": { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/swt301-lab2/01-lab2-unit-test-labflow/01-02-lab2-va-report-51-04ab87ac.mp4' }, defaultVideoTrack: 'VI' },
    "swt301-lab2-vi-du-login": { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/swt301-lab2/01-lab2-unit-test-labflow/01-03-vi-du-tron-vong-login-d39b134d.mp4' }, defaultVideoTrack: 'VI' },
    "swt301-lab2-chia-viec-5-thanh-vien": { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/swt301-lab2/01-lab2-unit-test-labflow/01-04-phan-cua-tung-thanh-vien-1266d16d.mp4' }, defaultVideoTrack: 'VI' },
    "swt301-lab2-report51-ct-work-excel": { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/swt301-lab2/01-lab2-unit-test-labflow/01-05-dien-51-ct-work-xuat-excel-1441b27d.mp4' }, defaultVideoTrack: 'VI' },
    "swt301-test-organisation": { yt: "UGkYHGxH2lg", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 1.4.5  Roles in Testing" },
    "swt301-test-monitoring-control": { yt: "51SzGHxL1Zk", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 5.3.2 Purpose, Content and Audience for Test Reports" },
    "swt301-configuration-management": { yt: "o8dKL02HtgQ", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 5.4 Configuration Management" },
    "swt301-risk-based-testing": { yt: "L1wsFYEBy3Q", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 5.2.2 Project Risks and Product Risks" },
    "swt301-tools-by-activity": { yt: "QmEGxfZXbQM", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 6.1 Tool Support for Testing" },
    "swt301-tools-benefits-risks": { yt: "MBcl_Cx6PFE", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 6.2 Benefits and Risks of Test Automation" },
    "swt301-tools-selection-pilot": { yt: "n6iGoqMl8Ao", credit: "Automation Step by Step — QnA Friday 4 - How to select right Automation Tool | Automation Testing Tools" },
    "swt301-junit-hands-on": { yt: "F8UTTTDtbH0", credit: "IntelliJ IDEA, a JetBrains IDE — IntelliJ IDEA. Migrating from JUnit 4 to JUnit 5" },
    "swt301-lab3-worked-example": { yt: "oXW-C2bM0wE", credit: "Postman — How to Write and Automate API Tests in Postman with Proven Strategies" },
    "swt301-agile-xp-scrum-kanban": { yt: "9W4RVwsPLLE", credit: "Scrum.org — An Introduction to Scrum org" },
    "swt301-agile-user-stories-ci": { yt: "NcU0oEk6z8Y", credit: "Modern Software Engineering — The 10 COMMANDMENTS Of Continuous Integration (CI)" },
    "swt301-agile-release-iteration-planning": { yt: "bggGoE8w6o4", credit: "Scrum.org — How to Facilitate Sprint Planning" },
    "swt301-agile-testing-status-roles": { yt: "ClisyUq4U18", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 1.5.2 Whole Team Approach" },
    "swt301-agile-risk-estimation": { yt: "0k0_9NzjUf4", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 5.1.4 Estimation Techniques" },
    "swt301-practice-mystbloom-blackbox": { yt: "D-Qv0ccFR84", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.2.1 Equivalence Partitioning" },
    "swt301-practice-mystbloom-integration": { yt: "brR4WaEF0u8", credit: "ASTQB - ISTQB in the U.S. and Globally — ISTQB Foundation Level: 4.4.2 Exploratory Testing" },
    "swt301-pe-fa23": { yt: "we3zJE3hlWE", credit: "IntelliJ IDEA, a JetBrains IDE — IntelliJ IDEA. Writing Tests with JUnit 5" },
    'swt301-dieu-kien-qua-mon': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-02-dieu-kien-qua-mon-cau-truc-diem-3f4a96e8.mp4' }, defaultVideoTrack: 'VI' },
    'swt301-chuan-dau-ra': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-03-clo-business-outcomes-muc-k-tron-d479c177.mp4' }, defaultVideoTrack: 'VI' },
    'swt301-tai-lieu-cong-cu': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-06-tai-lieu-sach-ke-hoach-hoc-14d8c44c.mp4' }, defaultVideoTrack: 'VI' },
    'swt301-books-guide': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-06-tai-lieu-sach-ke-hoach-hoc-14d8c44c.mp4' }, defaultVideoTrack: 'VI' },
    'swt301-how-to-study': { vi: { url: 'https://media.cuongthai.com/videos/bai-giang/software-testing/00-gioi-thieu-mon-hoc/00-06-tai-lieu-sach-ke-hoach-hoc-14d8c44c.mp4' }, defaultVideoTrack: 'VI' },
  },
};
