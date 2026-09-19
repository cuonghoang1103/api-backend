/**
 * Curated YouTube track for CSI106 — Introduction to Computer Science.
 * Mọi id đã xác minh sống + nhúng được bằng: node scripts/yt-check.mjs <id>
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/csi106-introduction-to-computer-science.mjs
 */
export default {
  courseSlug: 'csi106-introduction-to-computer-science',
  defaultVideoTrack: 'YT',
  lessons: {
    // Giới thiệu môn học
    "csi106-0-0-tai-lieu": { yt: "d86ws7mQYIg", credit: "Branch Education — How does Computer Hardware Work?  💻🛠🔬  [3D Animated Teardown]" },
    "csi106-0-1-overview": { yt: "O5nskjZ_GoI", credit: "CrashCourse — Early Computing: Crash Course Computer Science #1" },

    // Chương 1 — Tổ chức máy tính
    "csi106-1-0a-slides-von-neumann-cpu": { yt: "16zrEPOsIcI", credit: "Branch Education — The Engineering that Runs the Digital World 🛠️⚙️💻 How do CPUs Work?" },
    "csi106-1-0b-slides-bo-nho-vao-ra": { yt: "7J7X7aZvMXQ", credit: "Branch Education — How does Computer Memory Work? 💻🛠" },
    "csi106-1-1-computer-organization": { yt: "Ml3-kVYLNr8", credit: "Computerphile — Von Neumann Architecture - Computerphile" },
    "csi106-1-2-cpu-memory-io": { yt: "SAk-6gVkio0", credit: "Computerphile — How CPU Memory & Caches Work - Computerphile" },

    // Chương 2 — Hệ đếm
    "csi106-2-0-slides-he-dem-chuyen-co-so": { yt: "FFDMzbrEXaE", credit: "The Organic Chemistry Tutor — Number Systems Introduction - Decimal, Binary, Octal & Hexadecimal" },
    "csi106-2-1-number-systems": { yt: "M6c6Xw5mt90", credit: "Gate Smashers — Lec-2: Convert Decimal to Any Other Base(Binary, Octal, Hex etc) | Number System" },

    // Chương 3 — Lưu trữ & thao tác dữ liệu
    "csi106-3-0a-slides-luu-tru-du-lieu": { yt: "1GSjbWt0c9M", credit: "CrashCourse — Representing Numbers and Letters with Binary: Crash Course Computer Science #4" },
    "csi106-3-0b-slides-phep-logic-dich-bit": { yt: "4JgtUf5ThqY", credit: "Christopher Lum — Bit Shifting, Bit Masking, and Bit Manipulation" },
    "csi106-3-1-storing-numbers": { yt: "PZRI1IfStY0", credit: "Computerphile — Floating Point Numbers - Computerphile" },
    "csi106-3-2-text-media-operations": { yt: "Kv1Hiv3ox8I", credit: "Branch Education — How are Images Compressed?  [46MB ↘↘ 4.07MB] JPEG In Depth" },

    // Chương 4 — Mạng & Internet
    "csi106-4-0-slides-mang-tcp-ip": { yt: "3kfO61Mensg", credit: "NetworkChuck — REAL LIFE example!! (TCP/IP and OSI layers) // FREE CCNA // EP 4" },
    "csi106-4-1-networks-internet": { yt: "3QhU9jd03a0", credit: "CrashCourse — Computer Networks: Crash Course Computer Science #28" },

    // Chương 5 — Hệ điều hành
    "csi106-5-0-slides-he-dieu-hanh": { yt: "26QPDBe-NB8", credit: "CrashCourse — Operating Systems: Crash Course Computer Science #18" },
    "csi106-5-1-operating-system": { yt: "ZmPIxfCggFw", credit: "Core Dumped — The Question Nobody Ever Explains: Where Does the Kernel End?" },

    // Chương 6 — Thuật toán
    "csi106-6-0-slides-thuat-toan-tim-kiem": { yt: "HKjx3IPbrYg", credit: "Great Learning — Introduction to Programming and Algorithms | Flowcharts and Pseudocodes | Great Learning" },
    "csi106-6-1-algorithms": { yt: "rL8X2mlNHPM", credit: "CrashCourse — Intro to Algorithms: Crash Course Computer Science #13" },

    // Chương 7 — Lập trình
    "csi106-7-0-slides-dich-chuong-trinh-paradigm": { yt: "4iXDDLwpq7o", credit: "MrBrownCS — How Compilers Work (The 4 Stages of Compilation)" },
    "csi106-7-1-programming": { yt: "FYFlRFXlDj8", credit: "Daniel Blagy — Programming Paradigms (Imperative vs Declarative, Procedural, OOP, Functional)" },

    // Chương 8 — Công nghệ phần mềm
    "csi106-8-0-slides-vong-doi-phan-mem": { yt: "SaCYkPD4_K0", credit: "AltexSoft — Software Development Life Cycle: Explained" },
    "csi106-8-1-software-engineering": { yt: "T0TynxN77oY", credit: "Gate Smashers — Types of Testing in Software Engineering | Levels of Testing" },

    // Chương 9 — Cấu trúc dữ liệu
    "csi106-9-0a-slides-mang-record": { yt: "njTh_OwMljA", credit: "HackerRank — Data Structures: Linked Lists" },
    "csi106-9-0b-slides-danh-sach-lien-ket-stack-queue": { yt: "wjI1WNcIntg", credit: "HackerRank — Data Structures: Stacks and Queues" },
    "csi106-9-1-data-structures": { yt: "DuDz6B4cqVc", credit: "CrashCourse — Data Structures: Crash Course Computer Science #14" },

    // Chương 10 — Cấu trúc tệp
    "csi106-10-0-slides-cau-truc-tep": { yt: "KN8YgJnShPM", credit: "CrashCourse — Files & File Systems: Crash Course Computer Science #20" },
    "csi106-10-1-file-structure": { yt: "YcypY-STZMU", credit: "All About GATE Exam — Ordered File Organization | Hash Based File Organization | DBMS Session 47" },

    // Chương 11 — Cơ sở dữ liệu
    "csi106-11-0a-slides-csdl-mo-hinh-quan-he": { yt: "w1E1VXSSKSA", credit: "Coursera — Relational Model Concepts - Databases and SQL for Data Science by IBM #11" },
    "csi106-11-0b-slides-phep-toan-quan-he-thiet-ke": { yt: "GFQaEYEc8_8", credit: "Decomplexify — Learn Database Normalization - 1NF, 2NF, 3NF, 4NF, 5NF" },
    "csi106-11-1-database": { yt: "OqjJjpjDRLc", credit: "IBM Technology — What is a Relational Database?" },

    // Chương 12 — An toàn & đạo đức
    "csi106-12-0-slides-an-toan-dao-duc": { yt: "bPVaOlJ6ln0", credit: "CrashCourse — Cybersecurity: Crash Course Computer Science #31" },
    "csi106-12-1-security-ethics": { yt: "jhXCTbFnK8o", credit: "CrashCourse — Cryptography: Crash Course Computer Science #33" },

    // Chương 13 — Nhập môn AI
    "csi106-13-1-intro-ai": { yt: "z-EtmaFJieY", credit: "CrashCourse — Machine Learning & Artificial Intelligence: Crash Course Computer Science #34" },
  },
};
