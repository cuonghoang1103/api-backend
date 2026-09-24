/**
 * Làm việc nhóm phần mềm — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau.
 * Bổ trợ môn SWR302 (yêu cầu, user story, backlog) ở Academy: khoá này là phía VẬN HÀNH hằng ngày của đội code — không
 * dạy lại phần viết yêu cầu, trỏ sang SWR302. Dùng CT Work (/work) trên chính trang này để thực hành. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'career', name: 'Nghề nghiệp', icon: 'Briefcase', sortOrder: 7 },
  course: {
    slug: 'agile-teamwork',
    title: 'Software Teamwork: Agile, Scrum & Code Review',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/agile-teamwork.png?v=1',
    shortDescription: 'How software teams actually work day to day: Scrum and Kanban, tickets and estimates, pull requests and code review, technical writing, meetings that matter, and how to be a new hire people want on the team.|||Đội phần mềm thật sự làm việc hằng ngày ra sao: Scrum và Kanban, ticket và ước lượng, pull request và code review, viết tài liệu kỹ thuật, họp cho ra họp, và làm một nhân viên mới mà cả đội muốn có.',
    description: 'Khoá kỹ năng làm việc nhóm cho lập trình viên sắp đi thực tập/đi làm và cho đồ án nhóm (SWP391). Agile và Scrum/Kanban trong thực tế (không chỉ lý thuyết), vòng đời một ticket từ backlog tới production, ước lượng, pull request và code review (viết và nhận), quy ước commit/nhánh, viết tài liệu kỹ thuật và RFC, họp standup/planning/retro hiệu quả, giao tiếp khi làm từ xa, làm việc với tester/BA/PM, và 90 ngày đầu ở công ty. Thực hành trên CT Work (công cụ quản lý dự án kiểu Jira của chính trang này). Phần viết yêu cầu và user story: trỏ sang môn SWR302 ở Academy.',
    whatYouLearn: 'Chạy một sprint Scrum cho nhóm đồ án; viết ticket rõ ràng; ước lượng bằng story point; mở pull request dễ review; review code tử tế và có ích; viết README, ADR và tài liệu kỹ thuật; điều phối họp ngắn gọn; báo cáo tiến độ và rủi ro; và bắt đầu công việc mới tự tin.',
    requirements: 'Biết Git và GitHub cơ bản (khoá Git trên trang này). Đang hoặc sắp làm đồ án nhóm / thực tập.',
    documentsNote: 'Tài liệu chính: scrumguides.org • agilemanifesto.org • Google Engineering Practices (code review) • conventionalcommits.org • adr.github.io • môn SWR302 ở Academy.',
  },
  sections: khung('agl', [
    ['Section 0 — Working in a software team', 'Mục 0 — Làm việc trong một đội phần mềm', 'Vì sao kỹ năng làm nhóm quyết định việc bạn có được giữ lại.', [
      ['bat-dau-tai-day', 'Start here (1/2) — How real software teams work, and why interviews probe it', 'Bắt đầu tại đây (1/2) — Đội phần mềm thật làm việc thế nào, vì sao phỏng vấn dò điều này', 'Một ngày của lập trình viên · Lịch sử: waterfall → Agile Manifesto 2001 → Scrum · Câu hỏi phỏng vấn hành vi'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Team failures: missed deadlines, merge hell, silent blockers', 'Bắt đầu tại đây (2/2) — Đội hỏng: trễ hạn, địa ngục merge, người bí mà im lặng', 'Tình huống đồ án nhóm (minh hoạ) · Sự cố thật có nguồn · Lộ trình học'],
      ['vai-tro', 'Roles: dev, tester, BA, PM, PO, Scrum Master', 'Vai trò: dev, tester, BA, PM, PO, Scrum Master', 'Ai làm gì · Nối SWR302 (BA) và SWT301 (tester)'],
      ['cong-cu', 'The toolbox: Git, GitHub, CT Work/Jira, chat', 'Bộ công cụ: Git, GitHub, CT Work/Jira, chat', 'Mỗi công cụ cho việc gì · Thiết lập cho nhóm'],
    ]],
    ['Chapter 1 — Agile, Scrum and Kanban in practice', 'Chương 1 — Agile, Scrum và Kanban trong thực tế', 'Không học thuộc Scrum Guide — chạy được một sprint.', [
      ['agile', 'Agile values, without the buzzwords', 'Giá trị Agile, không sáo rỗng', 'Tuyên ngôn · Hiểu sai phổ biến'],
      ['scrum', 'Scrum events and artifacts', 'Sự kiện và sản phẩm của Scrum', 'Sprint · Planning · Daily · Review · Retro'],
      ['kanban', 'Kanban and flow', 'Kanban và dòng chảy công việc', 'Giới hạn WIP · Cycle time'],
      ['chon', 'Choosing for your team', 'Chọn cho đội của bạn', 'Nhóm 4–5 SV · Đội công ty'],
    ]],
    ['Chapter 2 — Tickets and estimation', 'Chương 2 — Ticket và ước lượng', 'Từ user story tới việc làm được trong một ngày.', [
      ['ticket', 'Writing tickets people can pick up', 'Viết ticket ai cũng nhận làm được', 'Tiêu đề · Bối cảnh · Tiêu chí chấp nhận · Nối SWR302 user story'],
      ['chia-nho', 'Breaking work down', 'Chia nhỏ công việc', 'Epic → story → task · Lát cắt dọc'],
      ['uoc-luong', 'Estimation: story points and planning poker', 'Ước lượng: story point và planning poker', 'Vì sao không ước giờ · Velocity'],
      ['ct-work', 'Running it in CT Work', 'Vận hành trên CT Work', 'Backlog · Board · Sprint · Báo cáo'],
    ]],
    ['Chapter 3 — Branches, commits and pull requests', 'Chương 3 — Nhánh, commit và pull request', 'Quy trình Git cho đội — trỏ khoá Git.', [
      ['quy-uoc', 'Team conventions: branches and commits', 'Quy ước đội: nhánh và commit', 'Tên nhánh theo ticket · Conventional Commits'],
      ['pr-tot', 'Opening a PR that is easy to review', 'Mở PR dễ review', 'Nhỏ · Mô tả · Ảnh chụp · Tự review trước'],
      ['ci', 'CI checks as a teammate', 'CI như một đồng đội', 'Check bắt buộc · Trỏ khoá GitHub Actions'],
      ['merge', 'Merging and resolving conflicts together', 'Merge và cùng giải xung đột', 'Squash · Rebase · Ai giải'],
    ]],
    ['Chapter 4 — Code review', 'Chương 4 — Code review', 'Viết review có ích và nhận review không tự ái.', [
      ['muc-dich', 'What code review is for', 'Code review để làm gì', 'Chất lượng · Chia sẻ kiến thức · Không phải bắt lỗi người'],
      ['viet-review', 'Writing useful review comments', 'Viết nhận xét review có ích', 'Cụ thể · Hỏi thay vì ra lệnh · Mức độ (nit/blocker)'],
      ['nhan-review', 'Receiving feedback well', 'Nhận góp ý cho tốt', 'Không tự ái · Hỏi lại · Cảm ơn'],
      ['checklist', 'A review checklist', 'Checklist review', 'Đúng · Dễ đọc · Test · Bảo mật · Hiệu năng'],
    ]],
    ['Chapter 5 — Technical writing', 'Chương 5 — Viết tài liệu kỹ thuật', 'README, ADR, RFC và báo cáo sự cố.', [
      ['readme', 'READMEs that get people running', 'README giúp người khác chạy được ngay', 'Cài đặt · Chạy · Cấu trúc · Đóng góp'],
      ['adr', 'Architecture decision records', 'Ghi quyết định kiến trúc (ADR)', 'Bối cảnh · Quyết định · Hệ quả'],
      ['rfc', 'Design docs and RFCs', 'Tài liệu thiết kế và RFC', 'Vấn đề · Phương án · Đánh đổi'],
      ['postmortem', 'Incident postmortems', 'Báo cáo sau sự cố (postmortem)', 'Dòng thời gian · Nguyên nhân gốc · Không đổ lỗi'],
    ]],
    ['Chapter 6 — Meetings and communication', 'Chương 6 — Họp và giao tiếp', 'Ít họp hơn, họp ra kết quả hơn.', [
      ['standup', 'Standups that take 10 minutes', 'Standup 10 phút', 'Hôm qua · Hôm nay · Vướng gì'],
      ['planning-retro', 'Planning and retrospectives that change something', 'Planning và retro thay đổi được điều gì đó', 'Mục tiêu sprint · Hành động cụ thể'],
      ['bao-cao', 'Reporting progress and risk', 'Báo cáo tiến độ và rủi ro', 'Báo sớm khi trễ · Tin xấu nói trước'],
      ['tu-xa', 'Remote and async communication', 'Giao tiếp từ xa và bất đồng bộ', 'Viết tin nhắn tự đủ · Múi giờ · Tiếng Anh công việc'],
    ]],
    ['Chapter 7 — Working with other roles', 'Chương 7 — Làm việc với các vai trò khác', 'Tester, BA, designer, khách hàng.', [
      ['tester', 'Developers and testers', 'Lập trình viên và tester', 'Bug report tốt · Tái hiện · Nối SWT301'],
      ['ba-po', 'Developers, BAs and product owners', 'Lập trình viên, BA và PO', 'Hỏi rõ yêu cầu · Nối SWR302'],
      ['designer', 'Developers and designers', 'Lập trình viên và designer', 'Đọc Figma · Thương lượng chi tiết'],
      ['khach-hang', 'Talking to clients and stakeholders', 'Nói chuyện với khách hàng và các bên liên quan', 'Tránh thuật ngữ · Đặt kỳ vọng'],
    ]],
    ['Chapter 8 — Your first 90 days', 'Chương 8 — 90 ngày đầu ở công ty', 'Thực tập và công việc đầu tiên.', [
      ['onboarding', 'Onboarding: reading a big codebase', 'Làm quen: đọc codebase lớn', 'Chạy được trước · Bản đồ repo · Hỏi đúng người'],
      ['hoi', 'Asking good questions', 'Hỏi câu hỏi tốt', 'Đã thử gì · Ngữ cảnh · Quy tắc 30 phút'],
      ['viec-dau', 'Your first tickets', 'Những ticket đầu tiên', 'Nhỏ và chắc · Giao đúng hạn'],
      ['phat-trien', 'Growing: feedback, 1:1s and career', 'Phát triển: phản hồi, 1:1 và sự nghiệp', 'Xin phản hồi · Ghi nhận thành tích'],
    ]],
    ['Chapter 9 — Capstone: run a sprint for a team project', 'Chương 9 — Dự án cuối khoá: điều hành một sprint cho dự án nhóm', 'Một sprint trọn vẹn cho đồ án "Đặt lịch phòng khám".', [
      ['chuan-bi', 'Backlog, sprint goal and planning', 'Backlog, mục tiêu sprint và planning', 'Trên CT Work · Ước lượng'],
      ['thuc-hien', 'Daily work: PRs, reviews, standups', 'Công việc hằng ngày: PR, review, standup', 'Mô phỏng 2 tuần'],
      ['ket-thuc', 'Review, retro and report', 'Review, retro và báo cáo', 'Demo · Rút kinh nghiệm · Báo cáo tiến độ'],
      ['tong-ket', 'Checklist and interview stories', 'Checklist và câu chuyện phỏng vấn', 'Kể về làm nhóm theo STAR'],
    ]],
  ]),
};
