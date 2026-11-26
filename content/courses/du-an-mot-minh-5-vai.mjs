/**
 * Đồ án một mình đóng 5 vai — khoá Courses (26/11/2026). SWP391 solo, 5 vai C1 Leader/PM · C2 BA · C3 Dev BE · C4 Dev FE · C5 QA,
 * Spring Boot + React + PostgreSQL, xoay quanh LabFlow AI (/projects/labflow-ai, CT Work LF #2). Quy trình dùng lại được cho đề tài khác
 * (sàn TMĐT), SEP490 nhóm thật và công ty lớn. KHÔNG đưa code LabFlow hoàn chỉnh (chủ kênh tự code tay).
 * Gemini (Antigravity) soạn từng chương theo scratchpad agy-dm5/KE-HOACH.md, kiểm bằng kiem.mjs; soát trước khi lên web.
 */
import s00 from './du-an-mot-minh-5-vai/s00-bat-dau.mjs';
import s01 from './du-an-mot-minh-5-vai/s01-nam-chiec-mu.mjs';
import s02 from './du-an-mot-minh-5-vai/s02-khoi-dong-ke-hoach.mjs';
import s03 from './du-an-mot-minh-5-vai/s03-nhip-van-hanh-bao-cao.mjs';
import s04 from './du-an-mot-minh-5-vai/s04-yeu-cau-ba.mjs';
import s05 from './du-an-mot-minh-5-vai/s05-thiet-ke.mjs';
import s06 from './du-an-mot-minh-5-vai/s06-nen-ky-thuat.mjs';
import s07 from './du-an-mot-minh-5-vai/s07-iteration-1.mjs';
import s08 from './du-an-mot-minh-5-vai/s08-iteration-2.mjs';
import s09 from './du-an-mot-minh-5-vai/s09-kiem-thu-qa.mjs';
import s10 from './du-an-mot-minh-5-vai/s10-iteration-3-phat-hanh.mjs';
import s11 from './du-an-mot-minh-5-vai/s11-ho-so-bao-ve.mjs';
import s12 from './du-an-mot-minh-5-vai/s12-sau-do-an.mjs';

export default {
  category: { slug: 'career', name: 'Nghề nghiệp', icon: 'Briefcase', sortOrder: 7 },
  course: {
    slug: 'du-an-mot-minh-5-vai',
    title: 'Solo Team Project: Run a 5-Role Software Project like a Company',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/du-an-mot-minh-5-vai.png?v=1',
    shortDescription: 'Do a full SWP391 team project (Spring Boot + React) alone, playing all five roles — PM, BA, BE, FE, QA — run like a company, aiming for an 8–9 defence.|||Tự làm trọn đồ án SWP391 (Spring Boot + React + PostgreSQL) một mình mà đóng đủ 5 vai — Leader/PM, BA, Dev BE, Dev FE, QA — vận hành như công ty: kế hoạch, báo cáo tuần, rủi ro, CR, review và đủ hồ sơ, nhắm bảo vệ 8–9.',
    description: 'Khoá "sợi chỉ điều phối" cho đồ án SWP391 làm một mình mà vẫn đúng quy trình đội 5 người: luật đổi mũ giữa 5 vai, khởi động và kế hoạch (Report 1–2), nhịp vận hành và báo cáo như doanh nghiệp, yêu cầu BA (SRS, RTM), thiết kế và chọn kiến trúc có lập luận (modular monolith vs microservices), nền kỹ thuật và quy trình code, ba iteration kèm change request, kiểm thử QA (Report 5.1–5.3, UAT), hồ sơ cuối và bảo vệ, rồi cách áp sang đề tài khác (sàn thương mại điện tử), SEP490 và công ty lớn. Ví dụ chạy xuyên suốt là LabFlow AI trên CT Work; kiến thức chuyên môn dẫn sang đúng bài của các khoá liên quan, không học lại.',
    whatYouLearn: 'Đóng và đổi đúng 5 vai của một dự án phần mềm; lập kế hoạch, WBS, lịch iteration; vận hành nhịp họp – báo cáo tuần – rủi ro – thay đổi như công ty; viết SRS, use case, RTM; chọn và bảo vệ kiến trúc; chạy 3 iteration có review chéo và CR; lập kế hoạch và báo cáo kiểm thử đúng mẫu FPT; gom hồ sơ cuối và luyện bảo vệ 8–9; áp lại toàn bộ quy trình cho đề tài khác và dự án đi làm.',
    requirements: 'Biết lập trình cơ bản (Java/JavaScript). Nên học song song Spring Boot, React, PostgreSQL và Agile & Teamwork trên trang này — khoá dẫn link đúng bài khi cần.',
    documentsNote: 'Nguồn chính: Scrum Guide 2020 • PMBOK Guide 7th (PMI) • IEEE 830 / ISO/IEC/IEEE 29148 (SRS) • ISTQB Foundation • hướng dẫn hồ sơ SWP391/SEP490 FPT University • trang dự án LabFlow AI (/projects/labflow-ai).',
  },
  sections: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, ],
};
