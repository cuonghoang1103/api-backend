/**
 * SWP391 — Software Development Project (Đồ án phát triển phần mềm — capstone). Kỳ 5.
 * Bám syllabus FPTU (sylID 14177, 6 CLO, 60 buổi). Tiên quyết: PRJ301, SWE201c, LAB211.
 * Môn ĐỒ ÁN: nhóm 4–5 người xây một hệ thống web qua 3 ITERATION (15/20/25%) + Final Presentation (40%);
 * mỗi iteration mỗi người làm trọn yêu cầu + thiết kế + code 3–4 màn hình, chấm Converted-LOC
 * (Complexity 60/120/240 × Quality 100/75/50%). Java + NetBeans + MySQL mặc định, GitLab.
 * Song ngữ EN/VN, mỗi trang tài liệu của thầy/cô có ảnh + lời giảng (khung .giang).
 * Rebuilt 12/09/2026 slide by slide from the teacher's full folder — modules in ./swp391/ (see _slides.mjs).
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWP391.mjs --apply
 */
import sec0 from './swp391/sec0.mjs';
import ch1 from './swp391/ch1.mjs';
import ch2 from './swp391/ch2.mjs';
import ch3 from './swp391/ch3.mjs';
import ch4 from './swp391/ch4.mjs';
import ch5 from './swp391/ch5.mjs';
import ch6 from './swp391/ch6.mjs';
import ch7 from './swp391/ch7.mjs';
import sample from './swp391/sample.mjs';
import ch8 from './swp391/ch8.mjs';
import ch9 from './swp391/ch9.mjs';
import finalExam from './swp391/final.mjs';

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    // Renumber sections/lessons to FILE order after seeding (scripts/academy-seed-course.mjs reads course.syncOrder).
    syncOrder: true,
    academyType: 'FPT',
    courseCode: 'SWP391',
    title: 'Software Development Project',
    slug: 'software-development-project',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The semester-5 capstone, taught the way it really runs: a team of 4–5 builds one web system in 3 iterations (15/20/25%) plus a Final Presentation (40%), graded by Converted-LOC per member. Every page of the teacher\'s guides (subject, student, requirement, system & database design, GitLab, presentation), every template (SRS, SDS, System Test, Tracking, AI Usage, Weekly Report) and a real team\'s RDS, tracking sheet and slides — explained slide by slide, bilingual.',
    description: 'SWP391 là môn ĐỒ ÁN của Kỳ 5: nhóm 4–5 sinh viên xây một hệ thống web (khuyến nghị hệ thống quản lý) qua 3 ITERATION — mỗi iteration mỗi thành viên tự làm trọn yêu cầu, thiết kế và code full-stack cho 3–4 màn hình/chức năng — rồi thuyết trình cuối kỳ trước 2 giảng viên. Điểm quá trình = (iter1·15% + iter2·20% + iter3·25%) / 60%, chấm theo Converted-LOC = Complexity (60/120/240) × Quality (100/75/50%) cộng gói nộp (tracking, RDS, video demo, tag GitLab). Khoá này đi qua TOÀN BỘ tài liệu của thầy/cô: slide Subject/Student Guides, Software Requirement, System Design (COMET), Database Design, GitLab Guides, Presentation; các template SRS/SDS/System Test/Project Tracking/AI Usage/Weekly Report/Presentation; bộ prompt Claude của giảng viên; và một dự án mẫu thật (nhóm G5) cùng một báo cáo capstone thật — mỗi trang có ảnh, giải thích song ngữ, ví dụ làm mẫu, lỗi hay mất điểm và quiz.',
    whatYouLearn: 'Chạy một dự án nhóm theo đúng cách SWP391 vận hành: 3 iteration, mỗi người 3–4 màn hình/iteration, chấm Converted-LOC (Complexity × Quality) + gói nộp; lập nhóm, GitLab (repo, protected branch, label Req/Task/Defect/Leakage/Q&A, milestone, tag), xử lý xung đột; phân tích yêu cầu: actor, use case, đặc tả use case, business rules (5 loại), prototype, viết SRS theo Template1; thiết kế hệ thống theo COMET: context, lớp thực thể, MVC/layered/client-server, package, lớp và quan hệ, SDS theo Template2; thiết kế CSDL: ánh xạ quan hệ, khoá, tổng quát hoá; Project Tracking, Weekly Report, AI Usage Report; System Test (Template3); gói nộp mỗi iteration, video demo; báo cáo và thuyết trình cuối kỳ trước 2 giảng viên; dùng AI (bộ prompt của giảng viên) có kiểm chứng.',
    requirements: 'Tiên quyết: PRJ301 (Java web / MVC), SWE201c (Kỹ nghệ phần mềm), đã ĐẠT LAB211. Môi trường mặc định theo guide: Java JDK + NetBeans 13 + MySQL 8 (MySQL Workbench); .NET + SQL Server được phép nhưng không khuyến nghị. Tài khoản GitLab/GitHub (đăng nhập bằng email trường), OneDrive/Google Drive, Slack, MailTrap.',
    documentsNote: 'Tài liệu của môn (đều có ảnh từng trang + giải thích trong khoá): Slide1 Subject Guides, SWP391 Student Guides, Slide2 Software Requirement, Slide3 System Design, Slide4 Database Design, Slide5 GitLab Guides, Slide6 Presentation, GitLab Student Guides (PDF), Claude_Prompts.txt; Templates: SRS, SDS, System Test, AI Usage Report, Weekly Report, Project Presentation, Project Tracking, 7 UI themes; Sample: dự án G5 (RDS, tracking, SQL, slide) và một báo cáo capstone. Sách tham khảo: Sommerville — Software Engineering; Wiegers & Beatty — Software Requirements; Gomaa — Software Modeling and Design (COMET); Pro Git. Thông tin cá nhân của sinh viên trong tài liệu mẫu đã được loại bỏ.',
  },
  sections: [sec0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, sample, ch8, ch9, finalExam],
};
