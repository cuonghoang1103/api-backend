/**
 * Curated YouTube track for PRF192 — Programming Fundamentals (C).
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/programming-fundamentals.mjs
 *
 * Skipped (no clearly-matching reputable video / pure admin):
 *   prf192-dieu-kien-qua-mon (0.2 grading)     — admin
 *   prf192-chuan-dau-ra      (0.3 CLOs)        — admin
 *   prf192-tai-lieu-cong-cu  (0.4 tools/submission) — admin, course-specific
 *   prf192-final-exam-fe     (FE, MCQ)         — chỉ tìm được video ôn thi GATE
 *                                                (tiếng Ấn / một shot 8 tiếng) → loại
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

    // ───────── Bổ sung 2026-09-19 — 38 bài "Slide by slide", workshop & nâng cao ─────────

    // Section 0 — giới thiệu, tài liệu, môi trường
    "prf192-tai-lieu-tham-khao": { yt: "de2Hsvxaf8M", credit: "Computerphile — \"C\" Programming Language: Brian Kernighan - Computerphile" },
    "prf192-0-0-slides-gioi-thieu-mon": { yt: "SlqjA04_dpk", credit: "CS50 — CS50x - Lecture 1 - C" },
    "prf192-0-5-cai-dat-moi-truong": { yt: "QdfVAO1DFus", credit: "Geeky Script — How to install C/C++ in Visual Studio Code on Windows 10/11 [ 2026 Update ] MinGW w64 GNU Compiler" },

    // Chapter 1 — chương trình & máy tính
    "prf192-1-0a-slides-nhap-mon-lap-trinh": { yt: "zltgXvg6r3k", credit: "CrashCourse — Instructions & Programs: Crash Course Computer Science #8" },
    "prf192-1-0b-slides-bien-dich-cau-truc-c": { yt: "ksJ9bdSX5Yo", credit: "Mike Shah — In 54 Minutes, Understand the whole C and C++ compilation process" },

    // Chapter 2 — biến, kiểu dữ liệu & nhập/xuất
    "prf192-2-0a-slides-bien-kieu-du-lieu": { yt: "OSyjOvFbAGI", credit: "mycodeschool — Data types, Constants and Variables - C Programming Tutorial 05" },
    "prf192-2-0b-slides-literal-hang-nhap-xuat": { yt: "r0OuA1Q8jOo", credit: "Portfolio Courses — Constants | C Programming Tutorial" },

    // Chapter 3 — biểu thức & toán tử
    "prf192-3-0-slides-bieu-thuc-toan-tu": { yt: "v7r9LD6oIYA", credit: "Portfolio Courses — Arithmetic Operations | C Programming Tutorial" },

    // Chapter 4 — cấu trúc điều khiển
    "prf192-4-0a-slides-cau-truc-re-nhanh": { yt: "lhELGQAV4gg", credit: "Kunal Kushwaha — Flow of Program - Flowcharts & Pseudocode" },
    "prf192-4-0b-slides-vong-lap": { yt: "qUPXsPtWGoY", credit: "Neso Academy — for and while Loops" },
    "prf192-4-0c-slides-phong-cach-walkthrough-debug": { yt: "tJGrie7k97c", credit: "Chris Mayfield — Tracing code by hand" },
    "prf192-4-workshop1": { yt: "IDIJXsZRqP4", credit: "Portfolio Courses — User Input Validation With A Do-While Loop | C Programming Example" },

    // Chapter 5 — hàm & module
    "prf192-5-0a-slides-module-cohesion-coupling": { yt: "eiDyK_ofPPM", credit: "ArjanCodes — Cohesion and Coupling: Write BETTER PYTHON CODE Part 1" },
    "prf192-5-0b-slides-ham-c-prototype": { yt: "vc9A6HdrTz4", credit: "Bro Code — C function prototypes 🤖" },
    "prf192-5-0c-slides-stack-scope-walkthrough": { yt: "jVzSBkbfdiw", credit: "Jacob Sorber — The Call Stack and Stack Overflows (example in C)" },
    "prf192-5-1-module": { yt: "2YfM-HxQd_8", credit: "Jacob Sorber — Compiling C programs with Multiple Files" },
    "prf192-5-workshop2": { yt: "eStBZCSL-gQ", credit: "Portfolio Courses — Create A Menu Using A Switch Statement | C Programming Example" },

    // Chapter 6 — con trỏ (sơ đồ bộ nhớ)
    "prf192-6-0a-slides-con-tro-co-ban": { yt: "h-HBipu_1P0", credit: "mycodeschool — Introduction to pointers in C/C++" },
    "prf192-6-0b-slides-con-tro-cap-phat-dong": { yt: "P6oqhAxV0dA", credit: "Jacob Sorber — Allocating memory with malloc, calloc, realloc, and free" },

    // Chapter 7 — thư viện chuẩn
    "prf192-7-0a-slides-thu-vien-chuan": { yt: "Mp3eGLX-OpY", credit: "Portfolio Courses — Random Number Generation | C Programming Tutorial" },
    "prf192-7-0b-slides-nhap-lieu-kiem-tra": { yt: "W3dtyZr8rcY", credit: "Portfolio Courses — Advanced Integer Input Validation | C Programming Example" },
    "prf192-7-0c-slides-xuat-dinh-dang": { yt: "ycKZKDCMMzM", credit: "Portfolio Courses — printf Basics | C Programming Tutorial" },
    "prf192-7-1-stdlib-time": { yt: "Qoed2uBwF_o", credit: "Portfolio Courses — Time Library | C Programming Tutorial" },
    "prf192-7-2-math-ctype": { yt: "IF7REEKAz6Q", credit: "Portfolio Courses — pow() function | C Programming Tutorial" },

    // Chapter 8 — mảng & struct
    "prf192-8-0a-slides-mang-mot-chieu": { yt: "oe2bZKjiWrg", credit: "Portfolio Courses — Passing an Array to a Function | C Programming Tutorial" },
    "prf192-8-0b-slides-tim-kiem-sap-xep-ma-tran": { yt: "YqzNgaFQEh8", credit: "Portfolio Courses — Bubble Sort | C Programming Example" },
    "prf192-8-0c-slides-struct": { yt: "16P51olKuzk", credit: "Neso Academy — Structures and Functions (Part 1)" },
    "prf192-8-workshop3": { yt: "Lk-b45vrT8U", credit: "Bro Code — C array of structs 🏫" },

    // Chapter 9 — chuỗi
    "prf192-9-0a-slides-chuoi-nhap-xuat": { yt: "90gFFdzuZMw", credit: "Engineer Man — Working with character arrays and \"strings\" in C" },
    "prf192-9-0b-slides-string-h-mang-chuoi": { yt: "e7SACGE9hKw", credit: "Bro Code — Arrays of strings in C explained! 🧵" },
    "prf192-9-workshop4": { yt: "heJ56FVFrZ4", credit: "Portfolio Courses — Counting the Vowels in a String | C Programming Example" },

    // Chapter 10 — tệp tin
    "prf192-10-0a-slides-tep-tin-mo-tep": { yt: "uk61sKTgpMA", credit: "CodeVault — Differences between binary and text files in C" },
    "prf192-10-0b-slides-doc-ghi-tep-fseek": { yt: "BQJBe4IbsvQ", credit: "Jacob Sorber — Reading and Writing Files in C, two ways (fopen vs. open)" },
    "prf192-10-workshop5": { yt: "X-1qodkHCHo", credit: "Portfolio Courses — Read And Store Each Line Of A File Into An Array Of Strings | C Programming Example" },

    // Nâng cao 1 — gỡ lỗi
    "prf192-n1-1-debug": { yt: "Dq8l1_-QgAc", credit: "Low Level — GDB is REALLY easy! Find Bugs in Your Code with Only A Few Commands" },
    "prf192-n1-2-loi-kinh-dien": { yt: "LLykqRNuEwA", credit: "Dave's Garage — Don't Make These 3 Mistakes in C!  Can YOU spot the bug?" },

    // Ôn tập & thi
    "prf192-on-tap-cuoi-ky": { yt: "87SH2Cn0s9A", credit: "Bro Code — C Programming Full Course for free ⚙️" },
    "prf192-final-exam-pe": { yt: "U2K_bTN0eZ0", credit: "BillBird — C Programming Practice (Fall 2023) - 7.01 - Arrays (One Dimensional)" },
  },
};
