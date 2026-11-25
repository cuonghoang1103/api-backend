/**
 * Làm việc nhóm phần mềm — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau.
 * Bổ trợ môn SWR302 (yêu cầu, user story, backlog) ở Academy: khoá này là phía VẬN HÀNH hằng ngày của đội code — không
 * dạy lại phần viết yêu cầu, trỏ sang SWR302. Dùng CT Work (/work) trên chính trang này để thực hành. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';
import s00 from './agile-teamwork/s00-bat-dau.mjs';
import s01 from './agile-teamwork/s01-agile-scrum-kanban.mjs';
import s02 from './agile-teamwork/s02-ticket-uoc-luong.mjs';
import s03 from './agile-teamwork/s03-nhanh-commit-pr.mjs';
import s04 from './agile-teamwork/s04-code-review.mjs';
import s05 from './agile-teamwork/s05-tai-lieu.mjs';
import s06 from './agile-teamwork/s06-hop-giao-tiep.mjs';
import s07 from './agile-teamwork/s07-vai-tro-khac.mjs';
import s08 from './agile-teamwork/s08-90-ngay.mjs';
import s09 from './agile-teamwork/s09-quy-trinh-outsourcing.mjs';
import s10 from './agile-teamwork/s10-an-ninh-thong-tin.mjs';
import s11 from './agile-teamwork/s11-khach-nhat-my.mjs';
import s12 from './agile-teamwork/s12-du-an-cuoi.mjs';

/* Ghép chương đã soạn vào khung THEO SLUG (như tieng-anh-ky-thuat-di-lam): bài đã soạn thay bài khung, bài chưa soạn giữ "Đang soạn";
   title chương giữ của khung. Chương đã soạn: 9, 10, 11 (agent agl) + Mục 0, 1, 2, 3, 4, 5, 6, 7, 8, 12 (agent agt) — 24/11/2026. */
function ghep(khungChuong, that) {
  const m = new Map(that.lessons.map((l) => [l.slug, l]));
  for (const slug of m.keys()) if (!khungChuong.lessons.some((l) => l.slug === slug)) throw new Error(`agl: slug ${slug} không có trong khung`);
  return { ...khungChuong, description: that.description || khungChuong.description, lessons: khungChuong.lessons.map((l) => m.get(l.slug) ?? l) };
}
function ghepChuong(sections) {
  sections[0] = ghep(sections[0], s00);   // Mục 0 — agent agt, 24/11/2026
  sections[1] = ghep(sections[1], s01);   // Chương 1 — agent agt, 24/11/2026 (thêm agl-1-5-lab, agl-1-6-quiz)
  sections[2] = ghep(sections[2], s02);   // Chương 2 — agent agt, 24/11/2026 (thêm agl-2-5-lab, agl-2-6-quiz)
  sections[3] = ghep(sections[3], s03);   // Chương 3 — agent agt, 24/11/2026 (thêm agl-3-5-lab, agl-3-6-quiz)
  sections[4] = ghep(sections[4], s04);   // Chương 4 — agent agt, 24/11/2026 (thêm agl-4-5-lab, agl-4-6-quiz)
  sections[5] = ghep(sections[5], s05);   // Chương 5 — agent agt, 24/11/2026 (thêm agl-5-5-lab, agl-5-6-quiz)
  sections[6] = ghep(sections[6], s06);   // Chương 6 — agent agt, 24/11/2026 (thêm agl-6-5-thanh-vien, agl-6-6-lab, agl-6-7-quiz)
  sections[7] = ghep(sections[7], s07);   // Chương 7 — agent agt, 24/11/2026 (thêm agl-7-5-lab, agl-7-6-quiz)
  sections[8] = ghep(sections[8], s08);   // Chương 8 — agent agt, 24/11/2026 (thêm agl-8-5-lab, agl-8-6-quiz)
  sections[9] = ghep(sections[9], s09);
  sections[10] = ghep(sections[10], s10);
  sections[11] = ghep(sections[11], s11);
  sections[12] = ghep(sections[12], s12); // Chương 12 — agent agt, 24/11/2026 (slug agl-9-*; thêm agl-9-5-de-thi, agl-9-6-quiz-tong). PHẢI chạy SAU giuSlugDuAnCuoi.
  return sections;
}

// 20/11/2026 (bảng soát khoảng trống P0-3): chèn 3 chương mới (9 quy trình dự án outsourcing · 10 an ninh thông tin khi đi làm ·
// 11 làm việc với khách Nhật/Mỹ) TRƯỚC dự án cuối khoá. Dự án cuối khoá nay hiển thị là "Chương 12" nhưng GIỮ slug cũ `agl-9-*`
// (slug = khoá tiến độ học + video). course-seed neo chương bằng slug bài ĐẦU ⇒ đổi tiêu đề chương 9 → 12 không tạo chương trùng.
// Kế hoạch 3 chương mới: content/courses/agile-teamwork/_KE-HOACH.md.
const giuSlugDuAnCuoi = (s) => {
  for (const l of s[s.length - 1].lessons) l.slug = l.slug.replace(/^agl-12-/, 'agl-9-');
  return s;
};

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
    description: 'Khoá kỹ năng làm việc nhóm cho lập trình viên sắp đi thực tập/đi làm và cho đồ án nhóm (SWP391). Agile và Scrum/Kanban trong thực tế (không chỉ lý thuyết), vòng đời một ticket từ backlog tới production, ước lượng, pull request và code review (viết và nhận), quy ước commit/nhánh, viết tài liệu kỹ thuật và RFC, họp standup/planning/retro hiệu quả, giao tiếp khi làm từ xa, làm việc với tester/BA/PM, 90 ngày đầu ở công ty, quy trình dự án outsourcing (tài liệu BD/DD, test spec Excel, Q&A list, ước lượng man-day, báo cáo ngày, hourensou), an ninh thông tin của nhân viên (NDA, ISMS/ISO 27001, dữ liệu khách, vệ sinh tài khoản) và làm việc với khách Nhật/Mỹ. Thực hành trên CT Work (công cụ quản lý dự án kiểu Jira của chính trang này). Phần viết yêu cầu và user story: trỏ sang môn SWR302 ở Academy.',
    whatYouLearn: 'Chạy một sprint Scrum cho nhóm đồ án; viết ticket rõ ràng; ước lượng bằng story point; mở pull request dễ review; review code tử tế và có ích; viết README, ADR và tài liệu kỹ thuật; điều phối họp ngắn gọn; báo cáo tiến độ và rủi ro; đọc tài liệu thiết kế, viết test case Excel và Q&A list theo quy trình outsourcing; ước lượng bằng man-day; giữ đúng quy định an ninh thông tin; làm việc với khách Nhật và khách Mỹ; và bắt đầu công việc mới tự tin.',
    requirements: 'Biết Git và GitHub cơ bản (khoá Git trên trang này). Đang hoặc sắp làm đồ án nhóm / thực tập.',
    documentsNote: 'Tài liệu chính: scrumguides.org • agilemanifesto.org • Google Engineering Practices (code review) • conventionalcommits.org • adr.github.io • ISO/IEC 27001:2022 (tóm tắt chính thức của ISO) • NIST SP 800-50 (đào tạo nhận thức an ninh) • Nghị định 13/2023/NĐ-CP • môn SWR302, SWT301, PMG201c ở Academy.',
  },
  sections: ghepChuong(giuSlugDuAnCuoi(khung('agl', [
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
      ['lab', 'Lab: Sprint 0 for LabFlow', 'Lab: Sprint 0 cho LabFlow', 'Lịch sprint .ics · Bảng có WIP · Thoả thuận + DoD · Đọc ba burndown'],
      ['quiz', 'Chapter 1 quiz', 'Kiểm tra Chương 1', '10 câu: Tuyên ngôn · Scrum 2020 · Little · burndown · chọn cho SWP391'],
    ]],
    ['Chapter 2 — Tickets and estimation', 'Chương 2 — Ticket và ước lượng', 'Từ user story tới việc làm được trong một ngày.', [
      ['ticket', 'Writing tickets people can pick up', 'Viết ticket ai cũng nhận làm được', 'Tiêu đề · Bối cảnh · Tiêu chí chấp nhận · Nối SWR302 user story'],
      ['chia-nho', 'Breaking work down', 'Chia nhỏ công việc', 'Epic → story → task · Lát cắt dọc'],
      ['uoc-luong', 'Estimation: story points and planning poker', 'Ước lượng: story point và planning poker', 'Vì sao không ước giờ · Velocity'],
      ['ct-work', 'Running it in CT Work', 'Vận hành trên CT Work', 'Backlog · Board · Sprint · Báo cáo'],
      ['lab', 'Lab: the iteration-1 backlog for LabFlow', 'Lab: backlog iteration 1 cho LabFlow', 'Mỗi màn một ticket · Script soát · Cân LOC · Poker · Nhập CT Work, bắt đầu sprint 1'],
      ['quiz', 'Chapter 2 quiz', 'Kiểm tra Chương 2', '10 câu: tiêu chí kiểm được · lát dọc · mỏ neo · velocity · dự báo có xác suất'],
    ]],
    ['Chapter 3 — Branches, commits and pull requests', 'Chương 3 — Nhánh, commit và pull request', 'Quy trình Git cho đội — trỏ khoá Git.', [
      ['quy-uoc', 'Team conventions: branches and commits', 'Quy ước đội: nhánh và commit', 'Tên nhánh theo ticket · Conventional Commits'],
      ['pr-tot', 'Opening a PR that is easy to review', 'Mở PR dễ review', 'Nhỏ · Mô tả · Ảnh chụp · Tự review trước'],
      ['ci', 'CI checks as a teammate', 'CI như một đồng đội', 'Check bắt buộc · Trỏ khoá GitHub Actions'],
      ['merge', 'Merging and resolving conflicts together', 'Merge và cùng giải xung đột', 'Squash · Rebase · Ai giải'],
      ['lab', 'Lab: a day of pull requests on LabFlow', 'Lab: một ngày pull request của LabFlow', 'Luật vào repo · Khoá main · CI cục bộ · Diễn tập ba tai nạn'],
      ['quiz', 'Chapter 3 quiz', 'Kiểm tra Chương 3', '10 câu: scope ticket · hook vs CI · PR to · hai migration V3 · revert migration · giải theo nghĩa'],
    ]],
    ['Chapter 4 — Code review', 'Chương 4 — Code review', 'Viết review có ích và nhận review không tự ái.', [
      ['muc-dich', 'What code review is for', 'Code review để làm gì', 'Chất lượng · Chia sẻ kiến thức · Không phải bắt lỗi người'],
      ['viet-review', 'Writing useful review comments', 'Viết nhận xét review có ích', 'Cụ thể · Hỏi thay vì ra lệnh · Mức độ (nit/blocker)'],
      ['nhan-review', 'Receiving feedback well', 'Nhận góp ý cho tốt', 'Không tự ái · Hỏi lại · Cảm ơn'],
      ['checklist', 'A review checklist', 'Checklist review', 'Đúng · Dễ đọc · Test · Bảo mật · Hiệu năng'],
      ['lab', 'Lab: a review day on LabFlow', 'Lab: một ngày review của LabFlow', 'Xoay vòng cả kỳ · CODEOWNERS · Review PR của trưởng nhóm · Trả lời review · Soát năm PR'],
      ['quiz', 'Chapter 4 quiz', 'Kiểm tra Chương 4', '10 câu: điểm chết một người duyệt · nhãn và phán quyết · luồng chặn · IDOR · goto fail · duyệt cũ bị bỏ'],
    ]],
    ['Chapter 5 — Technical writing', 'Chương 5 — Viết tài liệu kỹ thuật', 'README, ADR, RFC và báo cáo sự cố.', [
      ['readme', 'READMEs that get people running', 'README giúp người khác chạy được ngay', 'Cài đặt · Chạy · Cấu trúc · Đóng góp'],
      ['adr', 'Architecture decision records', 'Ghi quyết định kiến trúc (ADR)', 'Bối cảnh · Quyết định · Hệ quả'],
      ['rfc', 'Design docs and RFCs', 'Tài liệu thiết kế và RFC', 'Vấn đề · Phương án · Đánh đổi'],
      ['postmortem', 'Incident postmortems', 'Báo cáo sau sự cố (postmortem)', 'Dòng thời gian · Nguyên nhân gốc · Không đổ lỗi'],
      ['lab', 'Lab: LabFlow’s documentation set', 'Lab: bộ tài liệu của LabFlow', 'README chạy trên máy sạch · Sổ ADR · RFC · Postmortem · Một bước CI cho mọi tài liệu'],
      ['quiz', 'Chapter 5 quiz', 'Kiểm tra Chương 5', '10 câu: README máy sạch · bảng sinh tự động · thay ADR · ràng buộc cứng · che dữ liệu · thời gian phát hiện'],
    ]],
    ['Chapter 6 — Meetings and communication', 'Chương 6 — Họp và giao tiếp', 'Ít họp hơn, họp ra kết quả hơn.', [
      ['standup', 'Standups that take 10 minutes', 'Standup 10 phút', 'Hôm qua · Hôm nay · Vướng gì'],
      ['planning-retro', 'Planning and retrospectives that change something', 'Planning và retro thay đổi được điều gì đó', 'Mục tiêu sprint · Hành động cụ thể'],
      ['bao-cao', 'Reporting progress and risk', 'Báo cáo tiến độ và rủi ro', 'Báo sớm khi trễ · Tin xấu nói trước'],
      ['tu-xa', 'Remote and async communication', 'Giao tiếp từ xa và bất đồng bộ', 'Viết tin nhắn tự đủ · Múi giờ · Tiếng Anh công việc'],
      ['thanh-vien', 'When a teammate is late, silent or in conflict', 'Khi một thành viên trễ, im lặng hoặc xung đột', 'Năm nguyên nhân · Bậc thang xử lý · 1:1 · Xung đột trong PR · Khi nào báo giảng viên'],
      ['lab', 'Lab: LabFlow’s communication kit', 'Lab: bộ giao tiếp của LabFlow', 'Thoả thuận giao tiếp · Năng lực planning · Chuẩn bị daily · Báo cáo tuần tự soát · Cảnh báo sớm'],
      ['quiz', 'Chapter 6 quiz', 'Kiểm tra Chương 6', '10 câu: Daily Scrum · lời nói và dữ liệu · cam kết theo năng lực · retro · báo cáo · tin nhắn · thành viên'],
    ]],
    ['Chapter 7 — Working with other roles', 'Chương 7 — Làm việc với các vai trò khác', 'Tester, BA, designer, khách hàng.', [
      ['tester', 'Developers and testers', 'Lập trình viên và tester', 'Bug report tốt · Tái hiện · Nối SWT301'],
      ['ba-po', 'Developers, BAs and product owners', 'Lập trình viên, BA và PO', 'Hỏi rõ yêu cầu · Nối SWR302'],
      ['designer', 'Developers and designers', 'Lập trình viên và designer', 'Đọc Figma · Thương lượng chi tiết'],
      ['khach-hang', 'Talking to clients and stakeholders', 'Nói chuyện với khách hàng và các bên liên quan', 'Tránh thuật ngữ · Đặt kỳ vọng'],
      ['lab', 'Lab: one week with four roles', 'Lab: một tuần với bốn vai', 'Report chạy lại được · Sổ câu hỏi + bảng ví dụ · Spec màn · Thư + dự báo · kiem-vai.sh'],
      ['quiz', 'Chapter 7 quiz', 'Kiểm tra Chương 7', '10 câu: múi giờ staging · severity/priority · câu hỏi đóng · ví dụ biên · ai KHÔNG được · tương phản · dự báo · pipefail'],
    ]],
    ['Chapter 8 — Your first 90 days', 'Chương 8 — 90 ngày đầu ở công ty', 'Thực tập và công việc đầu tiên.', [
      ['onboarding', 'Onboarding: reading a big codebase', 'Làm quen: đọc codebase lớn', 'Chạy được trước · Bản đồ repo · Hỏi đúng người'],
      ['hoi', 'Asking good questions', 'Hỏi câu hỏi tốt', 'Đã thử gì · Ngữ cảnh · Quy tắc 30 phút'],
      ['viec-dau', 'Your first tickets', 'Những ticket đầu tiên', 'Nhỏ và chắc · Giao đúng hạn'],
      ['phat-trien', 'Growing: feedback, 1:1s and career', 'Phát triển: phản hồi, 1:1 và sự nghiệp', 'Xin phản hồi · Ghi nhận thành tích'],
      ['lab', 'Lab: your first two weeks, checked', 'Lab: hai tuần đầu, có kiểm', 'Hồ sơ hai tuần · kiem-2-tuan.sh · Bộ đón thành viên SWP391 · Bộ chuẩn bị OJT'],
      ['quiz', 'Chapter 8 quiz', 'Kiểm tra Chương 8', '10 câu: thứ tự tuần đầu · hỏi ai · bản đồ grep · XY · nhật ký hỏi · token · test đỏ trước · mục tiêu kiểm được'],
    ]],
    ['Chapter 9 — How outsourcing projects really run', 'Chương 9 — Quy trình dự án outsourcing trong thực tế', 'Ngày đầu OJT ở công ty outsourcing: tài liệu BD/DD, test spec Excel, Q&A list, báo cáo ngày, hourensou.', [
      ['mo-hinh-hop-dong', 'Contract models and roles: ODC, fixed price, T&M, onsite/offshore, BrSE', 'Mô hình hợp đồng và vai trò: ODC, trọn gói, T&M, onsite/offshore, BrSE', 'Mỗi mô hình ảnh hưởng thế nào tới việc của dev (phạm vi cứng, CR, giờ công) · Vai trò BrSE (kỹ sư cầu nối) với khách Nhật, PM, QA, tester · Liên tưởng: thầu xây nhà trọn gói vs thuê thợ theo ngày · Tình huống OJT: vì sao "làm thêm một nút nhỏ" lại phải qua CR'],
      ['vong-doi-v-model', 'The lifecycle in practice: V-model on Japanese projects, hybrid Agile', 'Vòng đời dự án thực tế: V-model ở dự án Nhật, Agile lai', 'RD → BD → DD → coding → UT → IT → ST → UAT và tài liệu ra ở mỗi bước · Lý thuyết đã có ở SWE201c 2.1 và SWT301 2.7 — ở đây là "ngày thường trông thế nào" · Chất lượng theo CMMI mức nhận biết: review, checklist, đo lỗi'],
      ['tai-lieu-bd-dd', 'Reading basic and detailed design documents (BD/DD) in Excel', 'Đọc tài liệu thiết kế cơ bản và chi tiết (BD/DD) dạng Excel', 'Cấu trúc thường gặp: danh sách màn hình, định nghĩa mục, xử lý khi bấm nút, thông báo lỗi, định nghĩa bảng · Đọc theo mã màn hình/mã mục · Chỗ mơ hồ ghi ngay vào Q&A · Lab: đọc DD mẫu một màn hình đăng ký, liệt kê việc cần code'],
      ['test-spec', 'Test specifications and test cases in Excel: columns, evidence, UT checklists', 'Test spec và test case dạng Excel: các cột, evidence, checklist UT', 'Cột hay gặp: ID, điều kiện trước, bước, dữ liệu, kết quả mong đợi, kết quả thực tế, người test, ngày · Evidence: ảnh chụp đánh số theo case · Liên kết SWT301 ch7 (quản lý test) · Lab: viết 15 test case + evidence cho màn hình đăng ký'],
      ['qa-cr', 'The Q&A list and change requests', 'Q&A list với khách và change request (CR)', 'Quy trình: dev phát hiện → leader/BrSE gửi → khách trả lời → cập nhật tài liệu · Câu hỏi đóng có đề xuất · Khi câu trả lời là thay đổi phạm vi ⇒ CR, ước lượng lại · Bản tiếng Anh: liên kết khoá Tiếng Anh kỹ thuật khi đi làm ch5'],
      ['uoc-luong-man-day', 'Estimating in man-days: WBS, buffer, three-point estimates and risk', 'Ước lượng bằng man-day: WBS, dự phòng, ước lượng ba điểm và rủi ro', 'Khác story point ở chương 2 thế nào và vì sao dự án hợp đồng dùng man-day · Chia việc theo WBS (liên kết PMG201c) · Tính cả review, test, sửa lỗi, viết evidence · Lab: ước lượng một chức năng CRUD 4 màn hình'],
      ['bao-cao-hourensou', 'Daily/weekly reports and hourensou: report, inform, consult — and handling slippage', 'Báo cáo ngày/tuần và hourensou (báo cáo, liên lạc, thảo luận) — và xử lý khi trễ', 'Mẫu daily report: đã làm, tiến độ %, vấn đề, kế hoạch mai · Hourensou: báo sớm tin xấu, hỏi trước khi tự quyết · Trễ hạn: báo ngay kèm nguyên nhân và phương án · Tình huống OJT: task 2 ngày sang ngày thứ 3 vẫn chưa xong'],
      ['lab', 'Lab: one ticket the outsourcing way, from DD to daily report', 'Lab: một ticket theo quy trình outsourcing, từ DD tới báo cáo ngày', 'Làm trên CT Work + file Excel mẫu · Đạt khi: đủ 6 sản phẩm, ước lượng lệch dưới 30% và giải thích được chỗ lệch'],
      ['quiz', 'Chapter 9 quiz', 'Kiểm tra Chương 9', '10 câu: mô hình hợp đồng · thứ tự V-model · cột test case · khi nào là CR · hourensou'],
    ]],
    ['Chapter 10 — Information security at work', 'Chương 10 — An ninh thông tin khi đi làm', 'Những quy định bạn ký ngày đầu và cách không vi phạm chúng — cùng vệ sinh tài khoản của chính bạn.', [
      ['nda', 'NDAs and what you may say: social media, CV, GitHub, interviews', 'NDA và những gì được nói: mạng xã hội, CV, GitHub, phỏng vấn', 'NDA cấm gì, thời hạn bao lâu · Ghi kinh nghiệm vào CV mà không lộ tên khách/chi tiết dự án · Không đẩy code công ty lên GitHub cá nhân · Liên kết interview-prep 9.3 (NDA trong offer)'],
      ['isms', 'ISMS and ISO 27001 for employees: classification, clean desk, reporting', 'ISMS và ISO 27001 cho nhân viên: phân loại tài liệu, bàn làm việc sạch, báo cáo sự cố', 'Ba tính chất bảo mật, toàn vẹn, sẵn sàng bằng ví dụ đời thường · Nhãn Public/Internal/Confidential và cách xử lý từng loại · Khoá màn hình khi rời chỗ, không chụp màn hình dự án · Báo cáo nghi ngờ sự cố ngay, không tự xử lý'],
      ['du-lieu-khach', 'Customer data and code: no copying out, no personal repos, no public AI', 'Dữ liệu và mã của khách: không mang ra, không repo cá nhân, không AI công cộng', 'Sự cố thật có nguồn: Samsung 04/2023 (nhân viên dán mã nguồn vào ChatGPT) · Dùng công cụ AI công ty cho phép, theo quy định dự án · Dữ liệu cá nhân và Nghị định 13/2023 — liên kết privacy-data-law · Dữ liệu giả cho môi trường dev'],
      ['thiet-bi', 'Devices and networks: USB, VPN, public Wi-Fi — and losing your laptop', 'Thiết bị và mạng: USB, VPN, Wi-Fi công cộng — và khi mất laptop', 'Vì sao công ty chặn USB và bắt dùng VPN · Không làm việc dự án trên máy cá nhân nếu không được phép · Mất laptop: báo IT/bảo mật ngay, đổi mật khẩu, thu hồi phiên/token, không giấu · Tình huống: quên laptop trên xe buýt'],
      ['tai-khoan', 'Personal account hygiene: password manager, 2FA, SSH keys, scoped tokens', 'Vệ sinh tài khoản cá nhân: trình quản lý mật khẩu, 2FA, SSH key, token phạm vi hẹp', 'Bật 2FA GitHub, lưu mã khôi phục · Token rò rỉ là chìa khoá vào repo khách · Góc người xây hệ thống: authentication ch7 (không dạy lại) · Lab: kiểm kê và thu hồi key/token cũ'],
      ['lua-dao', 'Phishing and social engineering aimed at developers', 'Lừa đảo và tấn công phi kỹ thuật nhắm vào lập trình viên', 'Email giả mạo cấp trên/khách đòi gửi tài liệu, giả IT xin mã OTP · Gói npm/extension độc hại · Lời mời việc làm giả gửi "bài test" chứa mã độc · Cách kiểm: xác minh qua kênh thứ hai'],
      ['su-co-that', 'Real leaks and what they teach: secrets in public repos, lost devices, pasted code', 'Sự cố rò rỉ thật và bài học: bí mật trong repo công khai, mất thiết bị, dán code', 'Uber 2016 (khoá AWS trong repo GitHub) · Toyota 10/2022 (khoá truy cập nằm trên GitHub công khai gần 5 năm) · Samsung 2023 · Điểm chung: một người, một thao tác tiện tay'],
      ['lab', 'Lab: Your personal security check-up', 'Lab: Tự kiểm tra an ninh cá nhân', 'Quét repo cá nhân bằng gitleaks, bật 2FA, kiểm kê SSH key/PAT, lập checklist "mất laptop" · Đạt khi: không còn bí mật trong lịch sử, mọi token có hạn'],
      ['quiz', 'Chapter 10 quiz', 'Kiểm tra Chương 10', '10 câu: phân loại tài liệu · được/không được làm với dữ liệu khách · xử lý mất thiết bị · nhận ra email lừa đảo'],
    ]],
    ['Chapter 11 — Working with Japanese and American clients', 'Chương 11 — Làm việc với khách Nhật và khách Mỹ', 'Cùng một việc, hai cách làm việc khác nhau.', [
      ['khach-nhat', 'Japanese clients: quality, detail, indirect "no", hourensou, nemawashi', 'Khách Nhật: chất lượng, chi tiết, lời từ chối gián tiếp, hourensou, nemawashi', 'Vì sao khách soi lỗi chính tả trong tài liệu và evidence · "Xin xem xét" thường là "không" · Báo trước, xin ý kiến trước khi đổi · Vài từ tiếng Nhật hay gặp trong tài liệu (仕様 spec, 不具合 lỗi, 確認 xác nhận) — liên kết các môn tiếng Nhật'],
      ['khach-my', 'American and European clients: directness, proactive proposals, pushing back', 'Khách Mỹ và châu Âu: thẳng thắn, chủ động đề xuất, phản biện có lý lẽ', 'Im lặng bị hiểu là đồng ý · Đề xuất giải pháp thay vì chỉ báo vấn đề · Small talk đầu cuộc họp · Nói "không" kèm phương án'],
      ['mui-gio-hop', 'Time zones, meeting minutes and confirming in writing', 'Múi giờ, biên bản họp và xác nhận bằng văn bản', 'Lịch họp chồng giờ, ghi rõ múi giờ · Minutes: quyết định, việc cần làm, người, hạn · Gửi lại trong ngày để khách xác nhận'],
      ['tinh-huong-kho', 'Hard situations: last-minute changes, angry bug reports, out-of-scope requests', 'Tình huống khó: đổi yêu cầu sát hạn, khách phàn nàn lỗi, yêu cầu ngoài phạm vi', 'Kịch bản trả lời từng tình huống (tiếng Việt ở đây, bản tiếng Anh ở khoá Tiếng Anh kỹ thuật khi đi làm ch4–6) · Khi nào chuyển cho leader/PM · Ghi nhận cảm xúc, tập trung vào sự việc'],
      ['lab', 'Lab: role-play a Japanese client review and a US client demo', 'Lab: đóng vai họp review với khách Nhật và demo với khách Mỹ', 'Có kịch bản và rubric · Đạt khi: biên bản họp đúng mẫu, mọi yêu cầu mới được ghi thành Q&A hoặc CR'],
      ['quiz', 'Chapter 11 quiz', 'Kiểm tra Chương 11', '10 câu: đọc lời từ chối gián tiếp · nội dung minutes · xử lý yêu cầu ngoài phạm vi'],
    ]],
    ['Chapter 12 — Capstone: run a sprint for a team project', 'Chương 12 — Dự án cuối khoá: điều hành một sprint cho dự án nhóm', 'Một sprint trọn vẹn của LabFlow: planning, ba tuần daily/PR/review, review–retro–báo cáo, STAR, đề thi có giờ.', [
      ['chuan-bi', 'Backlog, sprint goal and planning', 'Backlog, mục tiêu sprint và planning', 'Trên CT Work · Ước lượng'],
      ['thuc-hien', 'Daily work: PRs, reviews, standups', 'Công việc hằng ngày: PR, review, standup', 'Mô phỏng 2 tuần'],
      ['ket-thuc', 'Review, retro and report', 'Review, retro và báo cáo', 'Demo · Rút kinh nghiệm · Báo cáo tiến độ'],
      ['tong-ket', 'Checklist and interview stories', 'Checklist và câu chuyện phỏng vấn', 'Kể về làm nhóm theo STAR'],
      ['de-thi', 'Timed exam: lead sprint 4', 'Đề thi có giờ: dẫn sprint 4', 'Kiểu PE 120 phút · Rubric · Lời giải chạy thật'],
      ['quiz-tong', 'Final quiz', 'Kiểm tra tổng', '20 câu kiểu FE trải cả khoá'],
    ]],
  ]))),
};
