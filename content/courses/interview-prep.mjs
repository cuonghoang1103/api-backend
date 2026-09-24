/**
 * Chuẩn bị phỏng vấn IT — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau.
 * Nối mọi khoá kỹ thuật (Git, Docker, GitHub Actions, Testing, API design, DSA…) thành câu chuyện phỏng vấn. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

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
    description: 'Khoá chuẩn bị phỏng vấn cho sinh viên CNTT và người mới đi làm. Tìm việc ở đâu, đọc tin tuyển dụng; CV kỹ thuật một trang, LinkedIn, GitHub và portfolio; kể dự án theo STAR; câu hỏi hành vi; các vòng kỹ thuật theo mảng (backend Node/SQL, DevOps: Git/Docker/CI-CD, frontend React/Next.js, bảo mật, testing) với ngân hàng câu hỏi và ý trả lời, trỏ về đúng khoá đã học; vòng coding và system design; tiếng Anh phỏng vấn IT; phỏng vấn thử; thương lượng lương và chọn offer.',
    whatYouLearn: 'Viết CV kỹ thuật được hồi âm; biến đồ án thành câu chuyện thuyết phục; trả lời câu hỏi hành vi theo STAR; trả lời câu kỹ thuật backend/DevOps/frontend có chiều sâu; tự tin với vòng coding và system design; giới thiệu bản thân và dự án bằng tiếng Anh; và thương lượng offer.',
    requirements: 'Đã học một số khoá kỹ thuật trên trang (Git, Docker, GitHub Actions…). Có ít nhất một đồ án/dự án để kể.',
    documentsNote: 'Tài liệu chính: techinterviewhandbook.org • "Cracking the Coding Interview" • các khoá kỹ thuật trên cuongthai.com • khoá Luyện phỏng vấn thuật toán, API & System Design.',
  },
  sections: khung('pv', [
    ['Section 0 — How tech hiring works', 'Mục 0 — Tuyển dụng IT diễn ra thế nào', 'Quy trình tuyển dụng và kế hoạch chuẩn bị.', [
      ['bat-dau-tai-day', 'Start here (1/2) — How tech hiring works, and what interviewers look for', 'Bắt đầu tại đây (1/2) — Tuyển dụng IT ở Việt Nam và nước ngoài diễn ra thế nào, người phỏng vấn tìm gì', 'Các vòng: lọc CV, test online, kỹ thuật, văn hoá · Thực tập vs fresher · Người phỏng vấn chấm gì'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Why good students fail interviews, and a 4-week plan', 'Bắt đầu tại đây (2/2) — Vì sao sinh viên giỏi vẫn trượt phỏng vấn, và kế hoạch 4 tuần', 'Sai lầm phổ biến · Kế hoạch 4 tuần · Theo dõi đơn ứng tuyển'],
      ['tim-viec', 'Where to find jobs and how to read a posting', 'Tìm việc ở đâu và đọc tin tuyển dụng', 'ITviec · TopCV · LinkedIn · Giới thiệu nội bộ · Đọc yêu cầu thật'],
      ['ban-do-ky-nang', 'Mapping your skills to the posting', 'Đối chiếu kỹ năng với tin tuyển dụng', 'Kỹ năng đã có · Lỗ hổng · Khoá nào trên trang để bù'],
    ]],
    ['Chapter 1 — CV, LinkedIn and GitHub', 'Chương 1 — CV, LinkedIn và GitHub', 'Hồ sơ được hồi âm.', [
      ['cv', 'A one-page technical CV', 'CV kỹ thuật một trang', 'Cấu trúc · Động từ mạnh · Số liệu · ATS'],
      ['du-an-cv', 'Writing projects on your CV', 'Viết dự án trong CV', 'Vai trò · Công nghệ · Kết quả đo được'],
      ['github', 'GitHub and portfolio that support your CV', 'GitHub và portfolio hỗ trợ CV', 'Repo ghim · README tốt · Trỏ khoá Git Ch15'],
      ['linkedin', 'LinkedIn for students', 'LinkedIn cho sinh viên', 'Hồ sơ · Kết nối · Nhắn tin xin giới thiệu'],
    ]],
    ['Chapter 2 — Telling your story', 'Chương 2 — Kể câu chuyện của bạn', 'Giới thiệu bản thân và kể dự án theo STAR.', [
      ['gioi-thieu', '"Tell me about yourself"', '"Giới thiệu về bản thân"', 'Khung 90 giây · Tiếng Việt và tiếng Anh'],
      ['star', 'STAR stories from your projects', 'Câu chuyện STAR từ dự án của bạn', 'Tình huống · Nhiệm vụ · Hành động · Kết quả'],
      ['su-co', 'Talking about failures and incidents', 'Kể về thất bại và sự cố', 'Sự cố thật đã xử lý · Bài học · Không đổ lỗi'],
      ['cau-hoi-lai', 'Questions to ask the interviewer', 'Câu hỏi để hỏi lại người phỏng vấn', 'Về đội · Quy trình · Phát triển'],
    ]],
    ['Chapter 3 — Behavioural interviews', 'Chương 3 — Phỏng vấn hành vi', 'Làm nhóm, xung đột, áp lực và học hỏi.', [
      ['nhom', 'Teamwork and conflict questions', 'Câu hỏi về làm nhóm và xung đột', 'Bất đồng trong nhóm đồ án · Trỏ khoá Làm việc nhóm'],
      ['ap-luc', 'Pressure, deadlines and mistakes', 'Áp lực, hạn chót và sai lầm', 'Trễ hạn · Làm hỏng production'],
      ['hoc', 'Learning and growth', 'Học hỏi và phát triển', 'Học công nghệ mới thế nào · Dùng AI ra sao'],
      ['ngan-hang', 'A bank of 30 behavioural questions', 'Ngân hàng 30 câu hỏi hành vi', 'Câu hỏi + khung trả lời'],
    ]],
    ['Chapter 4 — Backend technical round', 'Chương 4 — Vòng kỹ thuật backend', 'Node.js, SQL, API, bảo mật, testing.', [
      ['node', 'Node.js and JavaScript questions', 'Câu hỏi Node.js và JavaScript', 'Event loop · async · Trỏ khoá Node.js'],
      ['sql', 'Databases and SQL questions', 'Câu hỏi cơ sở dữ liệu và SQL', 'Index · Transaction · Join · Trỏ khoá PostgreSQL'],
      ['api', 'API design and security questions', 'Câu hỏi thiết kế API và bảo mật', 'REST · Auth · OWASP · Trỏ khoá API design, Bảo mật web'],
      ['testing', 'Testing questions', 'Câu hỏi về testing', 'Kim tự tháp · Mock · Trỏ khoá Testing, SWT301'],
    ]],
    ['Chapter 5 — DevOps technical round', 'Chương 5 — Vòng kỹ thuật DevOps', 'Git, Docker, CI/CD, Linux, cloud.', [
      ['git', 'Git questions', 'Câu hỏi Git', 'merge vs rebase · Cứu commit · Trỏ khoá Git'],
      ['docker', 'Docker questions', 'Câu hỏi Docker', 'Image vs container · Layer · Multi-stage · Trỏ khoá Docker'],
      ['cicd', 'CI/CD and GitHub Actions questions', 'Câu hỏi CI/CD và GitHub Actions', 'Pipeline · Secret · Cache · Deploy · Trỏ khoá GitHub Actions'],
      ['linux-cloud', 'Linux, networking and cloud questions', 'Câu hỏi Linux, mạng và cloud', 'Tiến trình · Cổng · DNS · Trỏ khoá Linux, Cloud AWS'],
    ]],
    ['Chapter 6 — Frontend technical round', 'Chương 6 — Vòng kỹ thuật frontend', 'React, Next.js, trình duyệt, hiệu năng.', [
      ['react', 'React questions', 'Câu hỏi React', 'State · Effect · Render · Trỏ khoá React'],
      ['nextjs', 'Next.js questions', 'Câu hỏi Next.js', 'SSR/SSG · Server component · Trỏ khoá Next.js'],
      ['trinh-duyet', 'Browser, HTML/CSS and performance', 'Trình duyệt, HTML/CSS và hiệu năng', 'Critical rendering path · Core Web Vitals'],
      ['bai-tap', 'Take-home frontend assignments', 'Bài tập về nhà frontend', 'Làm gì để nổi bật · README · Test'],
    ]],
    ['Chapter 7 — Coding and system design rounds', 'Chương 7 — Vòng coding và system design', 'Tóm lược và trỏ tới hai khoá chuyên sâu.', [
      ['coding', 'The coding round in one lesson', 'Vòng coding trong một bài', 'Khung giải · Trỏ khoá Luyện phỏng vấn thuật toán'],
      ['live-coding', 'Live coding and pair programming', 'Code trực tiếp và lập trình cặp', 'Nói to · Xin gợi ý · Test'],
      ['system-design', 'System design for juniors', 'System design cho junior', 'Kỳ vọng thực tế · Trỏ khoá API & System Design'],
      ['take-home', 'Take-home projects', 'Dự án làm ở nhà', 'Phạm vi · Chất lượng · Trình bày'],
    ]],
    ['Chapter 8 — English for IT interviews', 'Chương 8 — Tiếng Anh phỏng vấn IT', 'Nói về mình và về kỹ thuật bằng tiếng Anh.', [
      ['gioi-thieu', 'Introducing yourself in English', 'Giới thiệu bản thân bằng tiếng Anh', 'Mẫu câu · Phát âm từ kỹ thuật'],
      ['du-an', 'Explaining a project in English', 'Giải thích dự án bằng tiếng Anh', 'Kiến trúc · Vai trò · Kết quả'],
      ['ky-thuat', 'Technical vocabulary that trips people up', 'Từ vựng kỹ thuật hay vấp', 'Phát âm · Nghĩa · Ví dụ câu'],
      ['khi-khong-hieu', 'When you do not understand the question', 'Khi không hiểu câu hỏi', 'Xin nhắc lại · Diễn đạt lại · Mua thời gian'],
    ]],
    ['Chapter 9 — Mock interviews and the offer', 'Chương 9 — Phỏng vấn thử và offer', 'Luyện, rút kinh nghiệm, và chọn offer.', [
      ['phong-van-thu', 'Mock interview: backend/DevOps', 'Phỏng vấn thử: backend/DevOps', 'Kịch bản · Tự chấm'],
      ['sau-phong-van', 'After the interview: follow-up and rejection', 'Sau phỏng vấn: theo dõi và bị từ chối', 'Email cảm ơn · Xin phản hồi · Không nản'],
      ['offer', 'Reading and negotiating an offer', 'Đọc và thương lượng offer', 'Lương gross/net · Phúc lợi · Thương lượng lịch sự'],
      ['tong-ket', 'Your interview-ready checklist', 'Checklist sẵn sàng phỏng vấn', 'Hồ sơ · Câu chuyện · Kỹ thuật · Tiếng Anh'],
    ]],
  ]),
};
