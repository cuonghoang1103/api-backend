/**
 * Curated YouTube track for LAB211 — OOP with Java (Lab).
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/oop-with-java-lab.mjs
 *
 * Skipped (pure admin/meta, tooling, or no clearly-matching reputable video):
 *   lab211-vi-sao-truot (0.2 why fail)            — admin/meta
 *   lab211-clo-ky-nang (0.3 CLOs)                 — admin
 *   lab211-cai-dat (0.4 NetBeans/JDK/CheckStyle)  — tooling, no verified single match
 *   lab211-cach-hoc (0.5 how to use course)       — admin
 *   lab211-kien-truc-phan-tang (1.1 layered arch) — no clean single-topic match
 *   lab211-quy-trinh-5-buoc (2.1 5-step method)   — meta method, no match
 *   lab211-ngay-thang-lenient (3.2 dates)         — no focused reputable date video found
 *   lab211-so-he-co-so (3.3 numbers/bases/geom)   — too specific, no match
 *   lab211-quan-ly-hoan-chinh (4.3 full mgmt app) — project-scale, no single-topic match
 *   lab211-bai-lon-nhieu-tang (5.3 multi-layer)   — project-scale, no match
 *   lab211-ke-hoach-thi (6.1 exam plan)           — admin
 *   lab211-so-tay-loi (6.2 error handbook)        — meta
 *   lab211-bay-nguoi-cham (6.3 grader traps)      — meta
 *   lab211-van-dap-doi-yeu-cau (6.4 viva)         — meta
 *   lab211-chi-phi-thuat-toan (7.2 algo cost)     — no verified Big-O video
 *   lab211-capstone-tu-ra-de (7.3 capstone)       — meta
 *   lab211-thuc-hanh-de / -trung-binh / -kho      — practice sets, meta
 */
export default {
  courseSlug: 'oop-with-java-lab',
  defaultVideoTrack: 'YT',
  lessons: {
    // 0.1 — About LAB211 → a full Java course as the getting-started overview
    "lab211-gioi-thieu": { yt: "xTtL8E4LzTQ", credit: "Bro Code — Java Full Course for free ☕" },
    // 1.2 — Safe input with a Validator → reading & guarding console input (Scanner)
    "lab211-nhap-lieu-validator": { yt: "RAthlOQUMkc", credit: "Bro Code — User input in Java is easy! ⌨️" },
    // 1.3 — Output that matches to the character → printf & format specifiers
    "lab211-xuat-dinh-dang": { yt: "nTBDjxWAcoE", credit: "Bro Code — Java printf() is really useful! 🖨️" },
    // 2.2 — Sorting & searching algorithms → a core sorting algorithm, theory + code
    "lab211-sap-xep-tim-kiem": { yt: "F5MZyqRp_IM", credit: "Kunal Kushwaha — Bubble Sort Algorithm - Theory + Code" },
    // 2.3 — String processing → Java String methods
    "lab211-xu-ly-chuoi": { yt: "P9hEmbfdiuc", credit: "Bro Code — Java String methods 💬" },
    // 3.1 — Validation & exceptions by the spec → try/catch/finally & throw
    "lab211-validation-ngoai-le": { yt: "1XAfapkBQjk", credit: "Coding with John — Exception Handling in Java Tutorial" },
    // 4.1 — The CRUD menu skeleton → ArrayList (add/get/set/remove is the CRUD core)
    "lab211-crud-menu": { yt: "wsTSREgCE5E", credit: "Bro Code — Learn Java arraylists in 9 minutes! 📃" },
    // 4.2 — Comparator & sorting objects → Comparable vs Comparator
    "lab211-comparator": { yt: "ZA2oNhtNk3w", credit: "Telusko — #95 Comparator vs Comparable in Java" },
    // 5.1 — OOP inside entities → fields, constructors on entity classes
    "lab211-oop-trong-entity": { yt: "pgBk8HC7jbU", credit: "Coding with John — Java Constructors - Full Tutorial" },
    // 5.2 — File I/O: text, serialize, CSV, zip → reading & writing files
    "lab211-doc-ghi-tep": { yt: "ScUJx4aWRi0", credit: "Coding with John — Java File Input/Output - It's Way Easier Than You Think" },
    // 7.1 — CheckStyle & clean code → clean-code principles
    "lab211-checkstyle": { yt: "_jDNAf3CzeY", credit: "Amigoscode — Learn SOLID Principles with CLEAN CODE Examples" },
  },
};
