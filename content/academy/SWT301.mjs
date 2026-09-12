/**
 * SWT301 — Software Testing (Kiểm thử phần mềm). Kỳ 5.
 * Bám syllabus FPTU (sylID 14178, 10 CLO, 60 buổi) — sách "Foundations of Software Testing:
 * ISTQB Certification" + "Agile Testing" (Crispin & Gregory). Tiên quyết: SWE201c.
 * Song ngữ EN/VN, sâu. Mỗi bài có "Ví dụ có lời giải" + khối ★ Beyond the syllabus.
 * Grading: Lab 25% + Presentation 10% + Progress Test 15% + Final 50% (PE 25% + TE 25%).
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWT301.mjs --apply
 */
import ch1 from './swt301/ch1.mjs';
import ch2 from './swt301/ch2.mjs';
import ch3 from './swt301/ch3.mjs';
import ch5 from './swt301/ch5.mjs';
import ch6 from './swt301/ch6.mjs';
import ch7 from './swt301/ch7.mjs';
import ch9 from './swt301/ch9.mjs';
import ch4 from './swt301/ch4.mjs';
import ch8 from './swt301/ch8.mjs';
import pe from './swt301/pe.mjs';
import lab1 from './swt301/lab1.mjs';
import lab3 from './swt301/lab3.mjs';
import lab2 from './swt301/lab2.mjs';
import sec0 from './swt301/sec0.mjs';
import practice from './swt301/practice.mjs';
import { pt1, pt2, pt3, finalExam } from './swt301/pt.mjs';

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    academyType: 'FPT',
    courseCode: 'SWT301',
    slug: 'software-testing',
    title: 'Software Testing',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    // Bài mới chèn giữa chương + chương Lab mới ⇒ để seeder xếp thứ tự theo đúng file.
    syncOrder: true,
    shortDescription: 'Every slide of the FPT SWT301 decks explained in English and Vietnamese: ISTQB fundamentals, test levels, reviews, black-box and white-box design, test management, tools and JUnit, Agile testing — plus 3 labs, solved past PE papers and a real-app practice project.|||Học từng slide của môn SWT301 FPT, song ngữ Anh–Việt: nền tảng ISTQB, cấp test, review, thiết kế black-box & white-box, quản lý test, công cụ & JUnit, Agile — cùng 3 Lab, đề PE cũ có lời giải và dự án luyện tập trên web app thật.',
    description: 'Môn kiểm thử phần mềm theo chuẩn ISTQB Foundation (CTFL 2018) và Agile Tester, dựng lại từ toàn bộ thư mục tài liệu của môn: mọi slide của các bộ SWT0–SWT6 và Topic 8 được giữ nguyên dạng ảnh, mỗi slide có giải thích song ngữ, đáp án kèm lập luận cho mọi câu hỏi trên lớp (kể cả slide ẩn và ghi chú của giảng viên), ví dụ có lời giải đã chạy thử, bẫy thi, mục ★ ngoài giáo trình và trang sách tương ứng trong sáu cuốn giáo trình. Gồm 9 chương lý thuyết, 3 Lab (review & phân tích tĩnh; unit test white-box/black-box với PCL và template; báo cáo integration/system test), dự án luyện tập trên web app MystBloom, phần đề PE cũ có lời giải chi tiết theo template, 3 Progress Test và đề FE thử, liên kết 22 đề PE + 22 đề FE thật trong Phòng thi. Tiên quyết: SWE201c.',
    whatYouLearn: 'Định nghĩa, mục tiêu và 7 nguyên tắc kiểm thử; error/defect/failure và root cause; quy trình test 7 hoạt động, work product và truy vết; mô hình SDLC, 4 cấp test (stub/driver, chiến lược tích hợp), 4 loại test, kiểm thử bảo trì và test plan IEEE 829; kiểm thử tĩnh — quy trình review, vai trò, 4 loại review, kỹ thuật review, phân tích luồng dữ liệu/điều khiển và độ phức tạp cyclomatic; thiết kế test black-box (EP, BVA, decision table, state transition, use case), white-box (statement/decision coverage, số test tối thiểu) và dựa kinh nghiệm; quản lý test — tổ chức, chiến lược, ước lượng, giám sát, cấu hình, rủi ro, defect report; công cụ và JUnit 4/5; Agile testing (quadrants, TDD/ATDD/BDD, user story INVEST); làm đúng 3 câu của đề PE (review code, unit test coverage, EP/BVA + test case) trên template chính thức.',
    requirements: 'Tiên quyết: đạt SWE201c (hoặc SWE102/SWE202c) — hiểu SDLC và quy trình phần mềm. Cần biết lập trình Java cơ bản (PRO192) để làm phần JUnit. Cần máy tính cài được IDE (IntelliJ/Eclipse/VS Code), JUnit và một trình duyệt để chạy Selenium.',
    documentsNote: 'Toàn bộ thư mục môn SWT301 đã được đưa vào khoá học: slide SWT0–SWT6 + Topic 8 Agile Tester (dựng từ file .pptx — bản PDF của SWT3/SWT5/Topic 8 cũ hơn và thiếu slide), Additional Content, Overview.xlsx; 6 sách trong 02.Books (Black/van Veenendaal/Graham 2019 — giáo trình chính; Graham bản cũ; Spillner & Linz 2021 và bản 4; ISTQB Agile Tester in a Nutshell; JUnit in Action 3rd) — mỗi bài ghi đúng chương và trang cần đọc; đề PE (PE1, PE2, FA23, SP25) và template; bộ mẫu JUnit 4 (04.Samples); template Report5.1/5.2/5.3; toàn bộ Lab 1–3; project MystBloom dùng làm dự án luyện tập. Công cụ: JDK, IntelliJ/NetBeans, JUnit 4/5, Excel, Postman, Selenium, SonarLint/PMD, Jira.',
  },
  sections: [
    /* ══════════ MỤC 0 — swt301/sec0.mjs (SWT0 + Additional Content + bản đồ tài liệu) ══════════ */
    sec0,
    /* ══════════════════ CHƯƠNG 1 — module riêng: swt301/ch1.mjs (SWT1, 114 slide) ══════════════════ */
    ch1,
    /* ══════════════════ CHƯƠNG 2 — module riêng: swt301/ch2.mjs (SWT2, 143 slide) ══════════════════ */
    ch2,
    /* ══════════ PROGRESS TEST 1 — swt301/pt.mjs ══════════ */
    pt1,
    /* ══════════ CHƯƠNG 3 — swt301/ch3.mjs (SWT3, 106 slide) ══════════ */
    ch3,
    lab1,
    /* ══════════ ch4 — swt301/ch4.mjs ══════════ */
    ch4,
    /* ══════════ ch5 — swt301/ch5.mjs ══════════ */
    ch5,
    /* ══════════ ch6 — swt301/ch6.mjs ══════════ */
    ch6,
    lab2,
    /* ══════════ PROGRESS TEST 2 — swt301/pt.mjs ══════════ */
    pt2,
    /* ══════════ ch7 — swt301/ch7.mjs ══════════ */
    ch7,
    /* ══════════ ch8 — swt301/ch8.mjs ══════════ */
    ch8,
    lab3,
    /* ══════════ ch9 — swt301/ch9.mjs ══════════ */
    ch9,
    /* ══════════ PROGRESS TEST 3 — swt301/pt.mjs ══════════ */
    pt3,
    /* ══════════ DỰ ÁN LUYỆN TẬP (swt301/practice.mjs) + THI CUỐI KỲ (swt301/pt.mjs) ══════════ */
    practice,
    pe,
    finalExam,
  ],
};
