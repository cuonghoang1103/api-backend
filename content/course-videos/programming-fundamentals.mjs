/**
 * Curated YouTube track for PRF192 — Programming Fundamentals (C).
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/programming-fundamentals.mjs
 *
 * Skipped (no clearly-matching reputable video / pure admin):
 *   prf192-dieu-kien-qua-mon (0.2 grading)     — admin
 *   prf192-chuan-dau-ra      (0.3 CLOs)        — admin
 *   prf192-0-5-cai-dat-moi-truong (0.5 setup)  — tooling, no verified match
 *   prf192-5-1-module        (5.1 decomposition) — no clean single-topic match
 *   prf192-7-1-stdlib-time   (7.1 stdlib/time) — library-specific, no match
 *   prf192-7-2-math-ctype    (7.2 math/ctype)  — library-specific, no match
 *   prf192-n1-1-debug        (N1.1 debugging)  — no clean match
 *   prf192-n1-2-loi-kinh-dien(N1.2 mistakes)   — no clean match
 */
export default {
  courseSlug: 'programming-fundamentals',
  defaultVideoTrack: 'YT',
  lessons: {
    // 0.1 About / course map → broad "intro to C" full course
    "prf192-gioi-thieu": { yt: "KJgsSFOSQv0", credit: "freeCodeCamp.org — C Programming Tutorial for Beginners" },

    // Chapter 1 — programming & the C program
    "prf192-1-1-lap-trinh-la-gi": { yt: "EjavYOFoJJ0", credit: "Jenny's Lectures CS IT — C_01 Introduction to C Language | C Programming Tutorials" },
    "prf192-1-2-phat-trien-phan-mem": { yt: "qcEBXrqFLe8", credit: "Jenny's Lectures CS IT — C_03 Language Translators | Compiler | Interpreter | Assembler | C Programming Tutorials" },
    "prf192-1-3-cau-truc-chuong-trinh-c": { yt: "HucJhUkDJuk", credit: "Jenny's Lectures CS IT — C_05 Structure of a C Program | Programming in C" },

    // Chapter 2 — variables, types, I/O
    "prf192-2-1-bien-hang": { yt: "dhh5lrXXXYw", credit: "Jenny's Lectures CS IT — C_08 Variables in C Programming | C Programming Tutorials" },
    "prf192-2-2-kieu-du-lieu": { yt: "NyT9vvSBoeo", credit: "Jenny's Lectures CS IT — C_10 Data Types in C - Part 1 | C Programming Tutorials for Beginners" },
    "prf192-2-3-scanf-printf": { yt: "xOIVXR35aI4", credit: "mycodeschool — Input and Output:  Printf and Scanf - C Programming Tutorial 06" },

    // Chapter 3 — operators
    "prf192-3-1-toan-tu": { yt: "E1_Gg6dURwk", credit: "Jenny's Lectures CS IT — C_13 Operators in C - Part 1 | Unary , Binary and Ternary Operators in C | C programming Tutorials" },
    "prf192-3-2-uu-tien": { yt: "hOLAoo2p7gM", credit: "Jenny's Lectures CS IT — C_21 Operators Precedence and Associativity in C | C programming Tutorials" },

    // Chapter 4 — control flow
    "prf192-4-1-re-nhanh": { yt: "oYuRtXcwXqw", credit: "Jenny's Lectures CS IT — C_27 If Statement in C | C Programming Tutorials" },
    "prf192-4-2-vong-lap": { yt: "agl3vjzbG2o", credit: "Jenny's Lectures CS IT — C_34 For loop in C  | C Programming Tutorials" },

    // Chapter 5 — functions
    "prf192-5-2-ham": { yt: "f--fD8Y0RnA", credit: "Jenny's Lectures CS IT — C_84 Introduction to Functions - part 1 | C Language Tutorials" },
    "prf192-5-3-scope": { yt: "qXVIMX2GlK8", credit: "Portfolio Courses — Local vs. Global Variables | C Programming Tutorial" },

    // Chapter 6 — pointers
    "prf192-6-1-con-tro": { yt: "IuDJeGqEZ3A", credit: "Jenny's Lectures CS IT — C_71 Pointers in C - part 1| Introduction to pointers in C | C Programming Tutorials" },
    "prf192-6-2-pass-by-reference": { yt: "xx_IPRSWtGE", credit: "Jenny's Lectures CS IT — C_87 Functions in C- part 4 |Call by Value & Call by Reference in C" },
    "prf192-6-3-malloc": { yt: "y4EzSnHJj-Q", credit: "Jenny's Lectures CS IT — C_133 Dynamic Memory Allocation using malloc() | C Language Tutorials" },

    // Chapter 8 — arrays, search/sort, structs
    "prf192-8-1-mang-1-chieu": { yt: "08LWytp6PNI", credit: "Jenny's Lectures CS IT — C_46 Arrays in C - part 1 | Introduction to Arrays" },
    "prf192-8-2-ma-tran": { yt: "HMBYWhpP8i4", credit: "Jenny's Lectures CS IT — C_53 Introduction to Two Dimensional (2D) Arrays in C" },
    "prf192-8-3-tim-sap-xep": { yt: "f6UU7V3szVw", credit: "Kunal Kushwaha — Binary Search Algorithm - Theory + Code" },
    "prf192-8-4-struct": { yt: "LpHnHRI6gLc", credit: "Jenny's Lectures CS IT — C_109 Structures in C - part 1| Introduction to Structures | C Programming" },

    // Chapter 9 — strings
    "prf192-9-1-chuoi": { yt: "x_3FKTDkGT8", credit: "Jenny's Lectures CS IT — C_62 Strings in C - part 1 | C programming tutorials" },
    "prf192-9-2-string-h": { yt: "p0Dofc5J15c", credit: "Professor Hank Stalica — C-string functions: strlen, strcpy, strcat, strncpy, strncat, strcmp, strstr" },

    // Chapter 10 — files
    "prf192-10-1-file": { yt: "ZIe_j8xAkU4", credit: "Jenny's Lectures CS IT — C_119 File Handling in C - part 1 | Introduction to Files" },
    "prf192-10-2-doc-ghi-file": { yt: "UmeGlPw8cxI", credit: "Jenny's Lectures CS IT — C_120 File Handling in C - part 2 | File Pointer and fopen() function" },

    // Extra chapters
    "prf192-n2-1-stack-heap": { yt: "5OJRqkYbK-4", credit: "Alex Hyett — Stack vs Heap Memory - Simple Explanation" },
    "prf192-n3-1-con-tro-nang-cao": { yt: "qaszuaFXRTA", credit: "Jenny's Lectures CS IT — C_101 Function Pointers in C | Pointer to Function | C Programming Tutorials" },
    "prf192-n4-1-du-an-c": { yt: "WDXG8gpuVqg", credit: "ProgrammingKnowledge2 — How To Create A Makefile (C/C++) | Makefile Tutorial | Linux" },
  },
};
