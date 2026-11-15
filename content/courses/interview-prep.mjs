/**
 * Chuẩn bị phỏng vấn IT — khoá học CuongThai (Courses, GENERAL).
 * Khung dựng 24/09/2026; SOẠN TRỌN 15/11/2026: 11 phần (Mục 0 + Chương 1–10), mỗi chương một tệp trong ./interview-prep/,
 * helper chung ./interview-prep/_pv.mjs, kế hoạch + bàn giao ./interview-prep/_KE-HOACH.md, luồng video YT đề xuất
 * ./interview-prep/_video-yt.tsv (người điều phối gắn vào content/course-videos/interview-prep.mjs).
 * Slug bài của khung (pv-N-M-…) giữ nguyên; title chương 0–9 giữ nguyên; Chương 10 là chương mới.
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/interview-prep.mjs
 *   node scripts/course-depth-audit.mjs   ./content/courses/interview-prep.mjs
 */
import s00 from './interview-prep/s00-intro.mjs';
import s01 from './interview-prep/s01-ho-so.mjs';
import s02 from './interview-prep/s02-cau-chuyen.mjs';
import s03 from './interview-prep/s03-hanh-vi.mjs';
import s04 from './interview-prep/s04-backend.mjs';
import s05 from './interview-prep/s05-devops.mjs';
import s06 from './interview-prep/s06-frontend.mjs';
import s07 from './interview-prep/s07-coding-sd.mjs';
import s08 from './interview-prep/s08-tieng-anh.mjs';
import s09 from './interview-prep/s09-offer.mjs';
import s10 from './interview-prep/s10-du-an-cuoi.mjs';

export default {
  category: { slug: 'career', name: 'Nghề nghiệp', icon: 'Briefcase', sortOrder: 7 },
  course: {
    slug: 'interview-prep',
    title: 'IT Interview Prep',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/interview-prep.png?v=1',
    shortDescription: 'Get the internship or first developer job: a CV and GitHub that get replies, telling your projects with STAR, the technical rounds (backend, DevOps, frontend, coding, system design), English for interviews, and negotiating the offer.|||Có được suất thực tập hoặc công việc lập trình đầu tiên: CV và GitHub được hồi âm, kể dự án theo STAR, các vòng kỹ thuật (backend, DevOps, frontend, coding, system design), tiếng Anh phỏng vấn, và thương lượng offer.',
    description: 'Khoá chuẩn bị phỏng vấn cho sinh viên CNTT và người mới đi làm (11 phần, 65 bài, mỗi chương có lab làm được + quiz, chương cuối là dự án bộ hồ sơ ứng tuyển hoàn chỉnh). Tìm việc ở đâu, đọc tin tuyển dụng; CV kỹ thuật một trang, LinkedIn, GitHub và portfolio; kể dự án theo STAR; câu hỏi hành vi; các vòng kỹ thuật theo mảng (backend Node/SQL, DevOps: Git/Docker/CI-CD, frontend React/Next.js, bảo mật, testing) với ngân hàng câu hỏi và ý trả lời, trỏ về đúng khoá đã học; vòng coding và system design; tiếng Anh phỏng vấn IT; phỏng vấn thử; thương lượng lương và chọn offer.',
    whatYouLearn: 'Tự làm ra bộ hồ sơ hoàn chỉnh: CV một trang, GitHub có kho ghim và README, LinkedIn, năm câu chuyện STAR, một buổi phỏng vấn thử tự quay và tự chấm. Viết CV kỹ thuật được hồi âm; biến đồ án thành câu chuyện thuyết phục; trả lời câu hỏi hành vi theo STAR; trả lời câu kỹ thuật backend/DevOps/frontend có chiều sâu; tự tin với vòng coding và system design; giới thiệu bản thân và dự án bằng tiếng Anh; và thương lượng offer.',
    requirements: 'Đã học một số khoá kỹ thuật trên trang (Git, Docker, GitHub Actions…). Có ít nhất một đồ án/dự án để kể.',
    documentsNote: 'Tài liệu chính: techinterviewhandbook.org • "Cracking the Coding Interview" • các khoá kỹ thuật trên cuongthai.com • khoá Luyện phỏng vấn thuật toán, API & System Design.',
  },
  // Chương chưa soạn trọn vẫn lấy từ khung (giữ đúng chỉ số chương ⇒ đúng slug); chương đã soạn thay vào theo vị trí.
  sections: [s00, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10],
};
