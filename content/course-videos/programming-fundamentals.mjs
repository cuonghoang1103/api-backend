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
    "prf192-gioi-thieu": { yt: "KJgsSFOSQv0", credit: "freeCodeCamp.org — C Programming Tutorial for Beginners", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/00-gioi-thieu-huong-dan-hoc/00-02-gioi-thieu-mon-ban-do-63f7c996.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 1 — programming & the C program
    "prf192-1-1-lap-trinh-la-gi": { yt: "EjavYOFoJJ0", credit: "Jenny's Lectures CS IT — C_01 Introduction to C Language | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/01-nhap-mon-chuong-trinh-may-tinh/01-03-lap-trinh-la-gi-5c678296.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-1-2-phat-trien-phan-mem": { yt: "qcEBXrqFLe8", credit: "Jenny's Lectures CS IT — C_03 Language Translators | Compiler | Interpreter | Assembler | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/01-nhap-mon-chuong-trinh-may-tinh/01-04-cac-buoc-phat-trien-ae451b34.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-1-3-cau-truc-chuong-trinh-c": { yt: "HucJhUkDJuk", credit: "Jenny's Lectures CS IT — C_05 Structure of a C Program | Programming in C", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/01-nhap-mon-chuong-trinh-may-tinh/01-05-cau-truc-chuong-trinh-c-cfeda16e.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 2 — variables, types, I/O
    "prf192-2-1-bien-hang": { yt: "dhh5lrXXXYw", credit: "Jenny's Lectures CS IT — C_08 Variables in C Programming | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/02-bien-kieu-du-lieu-nhap-xuat/02-03-bien-hang-c525b01c.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-2-2-kieu-du-lieu": { yt: "NyT9vvSBoeo", credit: "Jenny's Lectures CS IT — C_10 Data Types in C - Part 1 | C Programming Tutorials for Beginners", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/02-bien-kieu-du-lieu-nhap-xuat/02-04-kieu-du-lieu-c54c2707.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-2-3-scanf-printf": { yt: "xOIVXR35aI4", credit: "mycodeschool — Input and Output:  Printf and Scanf - C Programming Tutorial 06", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/02-bien-kieu-du-lieu-nhap-xuat/02-05-scanf-printf-5a646292.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 3 — operators
    "prf192-3-1-toan-tu": { yt: "E1_Gg6dURwk", credit: "Jenny's Lectures CS IT — C_13 Operators in C - Part 1 | Unary , Binary and Ternary Operators in C | C programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/03-bieu-thuc-toan-tu/03-02-cac-nhom-toan-tu-df1be5f8.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-3-2-uu-tien": { yt: "hOLAoo2p7gM", credit: "Jenny's Lectures CS IT — C_21 Operators Precedence and Associativity in C | C programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/03-bieu-thuc-toan-tu/03-03-ep-kieu-thu-tu-uu-tien-df7fd65a.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 4 — control flow
    "prf192-4-1-re-nhanh": { yt: "oYuRtXcwXqw", credit: "Jenny's Lectures CS IT — C_27 If Statement in C | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/04-cau-truc-dieu-khien/04-04-re-nhanh-if-switch-9835403f.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-4-2-vong-lap": { yt: "agl3vjzbG2o", credit: "Jenny's Lectures CS IT — C_34 For loop in C  | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/04-cau-truc-dieu-khien/04-05-vong-lap-for-while-do-1efd883d.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 5 — functions
    "prf192-5-2-ham": { yt: "f--fD8Y0RnA", credit: "Jenny's Lectures CS IT — C_84 Introduction to Functions - part 1 | C Language Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-05-dinh-nghia-goi-ham-63ebae04.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-5-3-scope": { yt: "qXVIMX2GlK8", credit: "Portfolio Courses — Local vs. Global Variables | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-06-pham-vi-bien-d8bacd4d.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 6 — pointers
    "prf192-6-1-con-tro": { yt: "IuDJeGqEZ3A", credit: "Jenny's Lectures CS IT — C_71 Pointers in C - part 1| Introduction to pointers in C | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/06-con-tro/06-03-con-tro-9513485b.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-6-2-pass-by-reference": { yt: "xx_IPRSWtGE", credit: "Jenny's Lectures CS IT — C_87 Functions in C- part 4 |Call by Value & Call by Reference in C", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/06-con-tro/06-04-truyen-tham-chieu-85e3c7ad.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-6-3-malloc": { yt: "y4EzSnHJj-Q", credit: "Jenny's Lectures CS IT — C_133 Dynamic Memory Allocation using malloc() | C Language Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/06-con-tro/06-05-cap-phat-dong-5e3afac4.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 8 — arrays, search/sort, structs
    "prf192-8-1-mang-1-chieu": { yt: "08LWytp6PNI", credit: "Jenny's Lectures CS IT — C_46 Arrays in C - part 1 | Introduction to Arrays", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-04-mang-1-chieu-2d3a76f8.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-8-2-ma-tran": { yt: "HMBYWhpP8i4", credit: "Jenny's Lectures CS IT — C_53 Introduction to Two Dimensional (2D) Arrays in C", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-05-ma-tran-ba517120.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-8-3-tim-sap-xep": { yt: "f6UU7V3szVw", credit: "Kunal Kushwaha — Binary Search Algorithm - Theory + Code", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-06-tim-sap-xep-73636de0.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-8-4-struct": { yt: "LpHnHRI6gLc", credit: "Jenny's Lectures CS IT — C_109 Structures in C - part 1| Introduction to Structures | C Programming", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-07-struct-10f9c01b.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 9 — strings
    "prf192-9-1-chuoi": { yt: "x_3FKTDkGT8", credit: "Jenny's Lectures CS IT — C_62 Strings in C - part 1 | C programming tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/09-chuoi/09-03-chuoi-4366649c.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-9-2-string-h": { yt: "p0Dofc5J15c", credit: "Professor Hank Stalica — C-string functions: strlen, strcpy, strcat, strncpy, strncat, strcmp, strstr", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/09-chuoi/09-04-string-h-3a35472b.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 10 — files
    "prf192-10-1-file": { yt: "ZIe_j8xAkU4", credit: "Jenny's Lectures CS IT — C_119 File Handling in C - part 1 | Introduction to Files", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/10-tep-tin/10-03-file-231faddb.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-10-2-doc-ghi-file": { yt: "UmeGlPw8cxI", credit: "Jenny's Lectures CS IT — C_120 File Handling in C - part 2 | File Pointer and fopen() function", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/10-tep-tin/10-04-doc-ghi-file-0fdbafbc.mp4' }, defaultVideoTrack: 'VI'},

    // Extra chapters
    "prf192-n2-1-stack-heap": { yt: "5OJRqkYbK-4", credit: "Alex Hyett — Stack vs Heap Memory - Simple Explanation", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/12-nang-cao-2-stack-heap/12-01-stack-heap-1da1579f.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-n3-1-con-tro-nang-cao": { yt: "qaszuaFXRTA", credit: "Jenny's Lectures CS IT — C_101 Function Pointers in C | Pointer to Function | C Programming Tutorials", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/13-nang-cao-3-con-tro/13-01-con-tro-nang-cao-d2cb56d0.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-n4-1-du-an-c": { yt: "WDXG8gpuVqg", credit: "ProgrammingKnowledge2 — How To Create A Makefile (C/C++) | Makefile Tutorial | Linux", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/14-nang-cao-4-du-an-c/14-01-du-an-c-fa935d8f.mp4' }, defaultVideoTrack: 'VI'},

    // ───────── Bổ sung 2026-09-19 — 38 bài "Slide by slide", workshop & nâng cao ─────────

    // Section 0 — giới thiệu, tài liệu, môi trường
    "prf192-tai-lieu-tham-khao": { yt: "de2Hsvxaf8M", credit: "Computerphile — \"C\" Programming Language: Brian Kernighan - Computerphile" },
    "prf192-0-0-slides-gioi-thieu-mon": { yt: "SlqjA04_dpk", credit: "CS50 — CS50x - Lecture 1 - C", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/00-gioi-thieu-huong-dan-hoc/00-01-slide-gioi-thieu-mon-de3cca1e.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-0-5-cai-dat-moi-truong": { yt: "QdfVAO1DFus", credit: "Geeky Script — How to install C/C++ in Visual Studio Code on Windows 10/11 [ 2026 Update ] MinGW w64 GNU Compiler", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/00-gioi-thieu-huong-dan-hoc/00-06-cai-dat-cong-cu-1e307f11.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 1 — chương trình & máy tính
    "prf192-1-0a-slides-nhap-mon-lap-trinh": { yt: "zltgXvg6r3k", credit: "CrashCourse — Instructions & Programs: Crash Course Computer Science #8", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/01-nhap-mon-chuong-trinh-may-tinh/01-01-slide-nhap-mon-lap-trinh-33c79be8.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-1-0b-slides-bien-dich-cau-truc-c": { yt: "ksJ9bdSX5Yo", credit: "Mike Shah — In 54 Minutes, Understand the whole C and C++ compilation process", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/01-nhap-mon-chuong-trinh-may-tinh/01-02-slide-bien-dich-cau-truc-c-580f0317.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 2 — biến, kiểu dữ liệu & nhập/xuất
    "prf192-2-0a-slides-bien-kieu-du-lieu": { yt: "OSyjOvFbAGI", credit: "mycodeschool — Data types, Constants and Variables - C Programming Tutorial 05", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/02-bien-kieu-du-lieu-nhap-xuat/02-01-slide-bien-kieu-du-lieu-0530bd5e.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-2-0b-slides-literal-hang-nhap-xuat": { yt: "r0OuA1Q8jOo", credit: "Portfolio Courses — Constants | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/02-bien-kieu-du-lieu-nhap-xuat/02-02-slide-literal-hang-nhap-xuat-150679cf.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 3 — biểu thức & toán tử
    "prf192-3-0-slides-bieu-thuc-toan-tu": { yt: "v7r9LD6oIYA", credit: "Portfolio Courses — Arithmetic Operations | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/03-bieu-thuc-toan-tu/03-01-slide-bieu-thuc-toan-tu-8d836d2a.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 4 — cấu trúc điều khiển
    "prf192-4-0a-slides-cau-truc-re-nhanh": { yt: "lhELGQAV4gg", credit: "Kunal Kushwaha — Flow of Program - Flowcharts & Pseudocode", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/04-cau-truc-dieu-khien/04-01-slide-cau-truc-re-nhanh-3102e24e.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-4-0b-slides-vong-lap": { yt: "qUPXsPtWGoY", credit: "Neso Academy — for and while Loops", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/04-cau-truc-dieu-khien/04-02-slide-vong-lap-bba68fc8.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-4-0c-slides-phong-cach-walkthrough-debug": { yt: "tJGrie7k97c", credit: "Chris Mayfield — Tracing code by hand", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/04-cau-truc-dieu-khien/04-03-slide-phong-cach-chay-tay-26878b82.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-4-workshop1": { yt: "IDIJXsZRqP4", credit: "Portfolio Courses — User Input Validation With A Do-While Loop | C Programming Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/04-cau-truc-dieu-khien/04-06-workshop-1-97fa4309.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 5 — hàm & module
    "prf192-5-0a-slides-module-cohesion-coupling": { yt: "eiDyK_ofPPM", credit: "ArjanCodes — Cohesion and Coupling: Write BETTER PYTHON CODE Part 1", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-01-slide-module-cohesion-coupling-de5b5513.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-5-0b-slides-ham-c-prototype": { yt: "vc9A6HdrTz4", credit: "Bro Code — C function prototypes 🤖", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-02-slide-ham-c-prototype-59df2c88.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-5-0c-slides-stack-scope-walkthrough": { yt: "jVzSBkbfdiw", credit: "Jacob Sorber — The Call Stack and Stack Overflows (example in C)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-03-slide-stack-scope-walkthrough-136f59bd.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-5-1-module": { yt: "2YfM-HxQd_8", credit: "Jacob Sorber — Compiling C programs with Multiple Files", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-04-module-chia-nho-2fa0f15a.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-5-workshop2": { yt: "eStBZCSL-gQ", credit: "Portfolio Courses — Create A Menu Using A Switch Statement | C Programming Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/05-ham-module/05-07-workshop-2-76f99fc7.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 6 — con trỏ (sơ đồ bộ nhớ)
    "prf192-6-0a-slides-con-tro-co-ban": { yt: "h-HBipu_1P0", credit: "mycodeschool — Introduction to pointers in C/C++", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/06-con-tro/06-01-slide-con-tro-co-ban-75c817b7.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-6-0b-slides-con-tro-cap-phat-dong": { yt: "P6oqhAxV0dA", credit: "Jacob Sorber — Allocating memory with malloc, calloc, realloc, and free", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/06-con-tro/06-02-slide-con-tro-cap-phat-dong-f42266cd.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 7 — thư viện chuẩn
    "prf192-7-0a-slides-thu-vien-chuan": { yt: "Mp3eGLX-OpY", credit: "Portfolio Courses — Random Number Generation | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/07-thu-vien-chuan-c/07-01-slide-thu-vien-chuan-d5e584db.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-7-0b-slides-nhap-lieu-kiem-tra": { yt: "W3dtyZr8rcY", credit: "Portfolio Courses — Advanced Integer Input Validation | C Programming Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/07-thu-vien-chuan-c/07-02-slide-nhap-lieu-kiem-tra-dd617c0d.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-7-0c-slides-xuat-dinh-dang": { yt: "ycKZKDCMMzM", credit: "Portfolio Courses — printf Basics | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/07-thu-vien-chuan-c/07-03-slide-xuat-dinh-dang-fb910842.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-7-1-stdlib-time": { yt: "Qoed2uBwF_o", credit: "Portfolio Courses — Time Library | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/07-thu-vien-chuan-c/07-04-stdlib-time-6b6d2697.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-7-2-math-ctype": { yt: "IF7REEKAz6Q", credit: "Portfolio Courses — pow() function | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/07-thu-vien-chuan-c/07-05-math-ctype-b005faa0.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 8 — mảng & struct
    "prf192-8-0a-slides-mang-mot-chieu": { yt: "oe2bZKjiWrg", credit: "Portfolio Courses — Passing an Array to a Function | C Programming Tutorial", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-01-slide-mang-mot-chieu-0b240598.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-8-0b-slides-tim-kiem-sap-xep-ma-tran": { yt: "YqzNgaFQEh8", credit: "Portfolio Courses — Bubble Sort | C Programming Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-02-slide-tim-kiem-sap-xep-ma-tran-ff8fdf7d.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-8-0c-slides-struct": { yt: "16P51olKuzk", credit: "Neso Academy — Structures and Functions (Part 1)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/08-mang-struct/08-03-slide-struct-1ccb183b.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-8-workshop3": { yt: "Lk-b45vrT8U", credit: "Bro Code — C array of structs 🏫" },

    // Chapter 9 — chuỗi
    "prf192-9-0a-slides-chuoi-nhap-xuat": { yt: "90gFFdzuZMw", credit: "Engineer Man — Working with character arrays and \"strings\" in C" },
    "prf192-9-0b-slides-string-h-mang-chuoi": { yt: "e7SACGE9hKw", credit: "Bro Code — Arrays of strings in C explained! 🧵", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/09-chuoi/09-02-slide-string-h-mang-chuoi-5d4f825c.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-9-workshop4": { yt: "heJ56FVFrZ4", credit: "Portfolio Courses — Counting the Vowels in a String | C Programming Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/09-chuoi/09-05-workshop4-52cfbfd9.mp4' }, defaultVideoTrack: 'VI'},

    // Chapter 10 — tệp tin
    "prf192-10-0a-slides-tep-tin-mo-tep": { yt: "uk61sKTgpMA", credit: "CodeVault — Differences between binary and text files in C", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/10-tep-tin/10-01-slide-tep-tin-mo-tep-c57d9b3c.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-10-0b-slides-doc-ghi-tep-fseek": { yt: "BQJBe4IbsvQ", credit: "Jacob Sorber — Reading and Writing Files in C, two ways (fopen vs. open)" },
    "prf192-10-workshop5": { yt: "X-1qodkHCHo", credit: "Portfolio Courses — Read And Store Each Line Of A File Into An Array Of Strings | C Programming Example", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/10-tep-tin/10-05-workshop5-152a4c4f.mp4' }, defaultVideoTrack: 'VI'},

    // Nâng cao 1 — gỡ lỗi
    "prf192-n1-1-debug": { yt: "Dq8l1_-QgAc", credit: "Low Level — GDB is REALLY easy! Find Bugs in Your Code with Only A Few Commands", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/11-nang-cao-1-go-loi/11-01-debug-415e8e00.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-n1-2-loi-kinh-dien": { yt: "LLykqRNuEwA", credit: "Dave's Garage — Don't Make These 3 Mistakes in C!  Can YOU spot the bug?", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/11-nang-cao-1-go-loi/11-02-loi-kinh-dien-071e1ec4.mp4' }, defaultVideoTrack: 'VI'},

    // Ôn tập & thi
    "prf192-on-tap-cuoi-ky": { yt: "87SH2Cn0s9A", credit: "Bro Code — C Programming Full Course for free ⚙️", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/14-nang-cao-4-du-an-c/14-02-on-tap-cuoi-ky-933727b4.mp4' }, defaultVideoTrack: 'VI'},
    "prf192-final-exam-pe": { yt: "U2K_bTN0eZ0", credit: "BillBird — C Programming Practice (Fall 2023) - 7.01 - Arrays (One Dimensional)", vi: { url: 'https://media.cuongthai.com/videos/bai-giang/programming-fundamentals/15-cac-bai-thi/15-01-thi-thuc-hanh-pe-9ac5ccec.mp4' }, defaultVideoTrack: 'VI'},
  },
};
