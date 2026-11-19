/**
 * Thực tập cùng Claude — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 19/11/2026 theo yêu cầu người dùng
 * ("mình không động vào 1 dòng code nào… muốn học làm thật", "người làm 3, AI làm 7"). Khoá THỰC HÀNH: người học TỰ làm
 * các ticket thật trên một dự án mẫu (booking app / LabFlow), dùng agent AI đúng cách, rồi được "senior AI" review từng PR.
 * Mỗi bài = 1 ticket có mô tả, tiêu chí "Đạt khi", gợi ý theo tầng, bộ kiểm tự động và checklist review. Không dạy lại lý
 * thuyết — dẫn link sang khoá nền (Git, Node.js, Spring Boot, PostgreSQL, Testing, Docker, AI Coding, Agile & Teamwork).
 * Bắt đầu sau kỳ thi (lộ trình ra trường: OJT SP27). Soạn theo quy trình khoá Docker. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'thuc-tap-cung-claude',
    title: 'Internship with an AI Senior — ship real tickets',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/thuc-tap-cung-claude.png?v=1',
    shortDescription: 'A simulated internship: you pick up real tickets on a real project, plan, code (with an AI agent doing the typing you direct), test and open pull requests — then an AI senior reviews every PR like a team lead would. The 30% that stays human is what you practise.',
    description: 'Khoá "thực tập mô phỏng" cho người đã học nền nhưng chưa từng làm việc trong một dự án thật. Bạn nhận ticket như ở công ty: đọc yêu cầu, hỏi lại chỗ mơ hồ, chia việc, giao phần gõ code cho agent AI theo kế hoạch của mình, TỰ đọc và kiểm từng dòng AI viết, viết test, mở pull request, rồi nhận review từ "senior AI" theo checklist của team lead thật — sửa tới khi đạt. Độ khó tăng dần từ sửa lỗi nhỏ tới tính năng đầy đủ, sự cố production và một sprint trọn vẹn. Cuối khoá có hồ sơ PR, nhật ký làm việc và câu chuyện kể được khi phỏng vấn.',
    whatYouLearn: 'Đọc ticket và hỏi lại đúng chỗ; lập kế hoạch trước khi code; điều phối agent AI (phần 7) mà vẫn giữ phần 3: hiểu, kiểm, quyết định; viết test và PR đạt chuẩn review; xử lý phản hồi review; gỡ lỗi production; ước lượng và báo cáo tiến độ; xây hồ sơ kinh nghiệm thật cho CV.',
    requirements: 'Đã học: Git, một backend (Node.js hoặc Spring Boot), SQL, REST, test cơ bản, Docker cơ bản. Nên học khoá AI Coding và Agile & Teamwork trước hoặc song song.',
    documentsNote: 'Tài liệu chính: Google Engineering Practices (code review) • Conventional Commits • "The Pragmatic Programmer" • "Software Engineering at Google" (chương code review, testing) • tài liệu dự án mẫu trong khoá.',
  },
  sections: khung('thuc-tap-cung-claude', [
    ['Section 0 — Your first day', 'Mục 0 — Ngày đầu tiên đi thực tập', 'Nhận máy, nhận repo, nhận người hướng dẫn.', [
      ['bat-dau-tai-day', 'Start here (1/2) — How this simulated internship works', 'Bắt đầu tại đây (1/2) — Khoá thực tập mô phỏng chạy thế nào', 'Ticket · PR · review · nhật ký · Tỉ lệ 3/7 người–AI'],
      ['bat-dau-luat-choi', 'Start here (2/2) — The rules: what you must do yourself', 'Bắt đầu tại đây (2/2) — Luật chơi: việc bạn PHẢI tự làm', 'Không dán code chưa đọc · Tự giải thích được từng dòng'],
      ['onboarding', 'Onboarding: clone, run, read the README, first commit', 'Onboarding: clone, chạy, đọc README, commit đầu tiên', 'Môi trường · Quy ước nhánh · Ticket "đổi chữ nút"'],
    ]],
    ['Chapter 1 — Small bugs', 'Chương 1 — Sửa lỗi nhỏ', 'Ticket đầu tiên: tìm, sửa, chứng minh đã sửa.', [
      ['ticket-1', 'Ticket 1 — A validation bug', 'Ticket 1 — Lỗi kiểm dữ liệu đầu vào', 'Tái hiện lỗi · Viết test đỏ trước · Sửa · Test xanh'],
      ['ticket-2', 'Ticket 2 — An off-by-one in pagination', 'Ticket 2 — Lệch một trong phân trang', 'Đọc code lạ · git blame · PR nhỏ gọn'],
      ['review-1', 'Your first code review — and how to answer it', 'Code review đầu tiên — và cách trả lời', 'Đọc góp ý không tự ái · Sửa theo từng ý'],
    ]],
    ['Chapter 2 — Directing an AI agent', 'Chương 2 — Điều phối agent AI', 'Bạn lên kế hoạch, AI gõ, bạn kiểm.', [
      ['ke-hoach', 'Plan before prompting: breaking a ticket into steps', 'Lập kế hoạch trước khi ra lệnh: chia ticket thành bước', 'Bản kế hoạch 5 dòng · Ranh giới tệp được sửa'],
      ['kiem-code-ai', 'Reviewing AI-written code line by line', 'Kiểm từng dòng code AI viết', 'Bịa hàm · Thiếu xử lý lỗi · Lỗ hổng bảo mật · Test giả'],
      ['ticket-3', 'Ticket 3 — A small endpoint with the agent', 'Ticket 3 — Một endpoint nhỏ cùng agent', 'Đạt khi: test + PR + giải thích được mọi dòng'],
    ]],
    ['Chapter 3 — A full feature', 'Chương 3 — Một tính năng trọn vẹn', 'Từ yêu cầu mơ hồ tới tính năng chạy trên staging.', [
      ['hoi-lai', 'Clarifying requirements with the "product owner"', 'Hỏi lại yêu cầu với "product owner"', 'Câu hỏi đúng · Ghi tiêu chí chấp nhận'],
      ['ticket-4', 'Ticket 4 — Feature: booking with conflict checks', 'Ticket 4 — Tính năng đặt lịch có kiểm trùng', 'DB + API + UI · Migration · Test tích hợp'],
      ['ticket-5', 'Ticket 5 — Feature: notifications in the background', 'Ticket 5 — Thông báo chạy nền', 'Queue · retry · idempotency'],
    ]],
    ['Chapter 4 — Quality: tests, security, performance', 'Chương 4 — Chất lượng: test, bảo mật, hiệu năng', 'Những ticket không ai thấy nhưng ai cũng cần.', [
      ['ticket-6', 'Ticket 6 — Raise test coverage where it matters', 'Ticket 6 — Tăng độ phủ test đúng chỗ', 'Test ranh giới · Test lỗi · Không test cho có'],
      ['ticket-7', 'Ticket 7 — Fix an injection and an access-control bug', 'Ticket 7 — Vá lỗi injection và lỗi phân quyền', 'OWASP · Kiểm cả API chứ không chỉ UI'],
      ['ticket-8', 'Ticket 8 — A slow page: measure, then fix', 'Ticket 8 — Trang chậm: đo trước, sửa sau', 'EXPLAIN · index · N+1 · cache'],
    ]],
    ['Chapter 5 — On call', 'Chương 5 — Trực sự cố', 'Production hỏng lúc nửa đêm — bạn là người trực.', [
      ['su-co-1', 'Incident drill 1 — Error rate spikes after a deploy', 'Diễn tập sự cố 1 — Lỗi tăng vọt sau deploy', 'Đọc log · Quay lui · Báo cáo'],
      ['su-co-2', 'Incident drill 2 — Disk full, jobs stuck', 'Diễn tập sự cố 2 — Đầy đĩa, job kẹt', 'Khoanh vùng · Sửa tạm · Sửa gốc'],
      ['postmortem', 'Writing your postmortem', 'Viết postmortem của bạn', 'Không đổ lỗi · Hành động phòng ngừa'],
    ]],
    ['Chapter 6 — A full sprint', 'Chương 6 — Một sprint trọn vẹn', 'Hai tuần làm việc như ở công ty.', [
      ['planning', 'Sprint planning and estimation', 'Lập kế hoạch sprint và ước lượng', 'Story point · Chia ticket · Cam kết vừa sức'],
      ['standup-demo', 'Stand-ups, demo and retrospective', 'Họp đứng, demo và retro', 'Báo cáo ngắn · Demo cho người không rành kỹ thuật'],
      ['sprint-project', 'Sprint project — ship three tickets end to end', 'Dự án sprint — hoàn thành ba ticket đầu-cuối', 'Đạt khi: 3 PR được duyệt + demo + retro'],
    ]],
    ['Chapter 7 — Your internship portfolio', 'Chương 7 — Hồ sơ thực tập của bạn', 'Biến những gì đã làm thành bằng chứng.', [
      ['ho-so', 'PR portfolio, work log and what you learned', 'Hồ sơ PR, nhật ký làm việc và điều đã học', 'Chọn 5 PR tiêu biểu · Viết lại câu chuyện'],
      ['phong-van', 'Telling the story in interviews', 'Kể câu chuyện khi phỏng vấn', 'STAR · Nói thật phần AI làm và phần bạn làm'],
      ['quiz', 'Final review', 'Tổng kết khoá', 'Tự đánh giá theo khung năng lực fresher'],
    ]],
  ]),
};
