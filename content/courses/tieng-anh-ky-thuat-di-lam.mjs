/**
 * Tiếng Anh kỹ thuật khi đi làm — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 20/11/2026 theo bảng soát khoảng trống P0-4:
 * FPT Software có bài test tiếng Anh, khách nước ngoài, tài liệu tiếng Anh; kho chỉ dạy tiếng Anh cho buổi phỏng vấn.
 * Người học: SV SE FPT năm 3, yếu tiếng Anh, mục tiêu OJT FPT Software SP27.
 * Trục khoá: DÙNG CÂU THEO TÌNH HUỐNG công việc (đọc docs, viết ticket/commit/PR/email, nói standup/demo/họp khách).
 * KHÔNG dạy ngữ pháp từ đầu, KHÔNG dạy lại: interview-prep ch8 (tiếng Anh phỏng vấn), CT Language (IELTS + 64 bộ từ chuyên ngành —
 * từ vựng thì dẫn sang sổ), agile-teamwork ch5–6 (cùng tình huống bằng tiếng Việt — khoá này đổi sang tiếng Anh).
 * Mỗi bài: mẫu thật (đã che thông tin) + bài luyện có đáp án gợi ý. Kế hoạch: content/courses/tieng-anh-ky-thuat-di-lam/_KE-HOACH.md.
 * Khi soạn một chương: thay phần tử trong `sections` bằng tệp chương thật, GIỮ NGUYÊN slug bài và title chương.
 */
import { khung } from './_chung/khung.mjs';
import s00 from './tieng-anh-ky-thuat-di-lam/s00-bat-dau.mjs';
import s01 from './tieng-anh-ky-thuat-di-lam/s01-doc-tieng-anh-ky-thuat.mjs';
import s02 from './tieng-anh-ky-thuat-di-lam/s02-ticket-bug-report.mjs';
import s03 from './tieng-anh-ky-thuat-di-lam/s03-commit-pr-review.mjs';
import s04 from './tieng-anh-ky-thuat-di-lam/s04-email-chat.mjs';
import s05 from './tieng-anh-ky-thuat-di-lam/s05-qa-list-spec.mjs';
import s06 from './tieng-anh-ky-thuat-di-lam/s06-noi-standup-demo-hop.mjs';
import s07 from './tieng-anh-ky-thuat-di-lam/s07-tu-vung-phat-am.mjs';
import s08 from './tieng-anh-ky-thuat-di-lam/s08-bai-test-capstone.mjs';

/* Ghép chương đã soạn vào khung THEO SLUG: bài đã soạn thay bài khung, bài chưa soạn giữ nguyên "Đang soạn"; title chương giữ của khung. */
function ghep(khungChuong, that) {
  const m = new Map(that.lessons.map((l) => [l.slug, l]));
  for (const slug of m.keys()) if (!khungChuong.lessons.some((l) => l.slug === slug)) throw new Error(`tak: slug ${slug} không có trong khung`);
  return { ...khungChuong, description: that.description || khungChuong.description, lessons: khungChuong.lessons.map((l) => m.get(l.slug) ?? l) };
}

function ghepChuong(sections) {
  sections[0] = ghep(sections[0], s00);
  sections[1] = ghep(sections[1], s01);
  sections[2] = ghep(sections[2], s02);
  sections[3] = ghep(sections[3], s03);
  sections[4] = ghep(sections[4], s04);
  sections[5] = ghep(sections[5], s05);
  sections[6] = ghep(sections[6], s06);
  sections[7] = ghep(sections[7], s07);
  sections[8] = ghep(sections[8], s08);
  return sections;
}

export default {
  category: { slug: 'career', name: 'Nghề nghiệp', icon: 'Briefcase', sortOrder: 7 },
  course: {
    slug: 'tieng-anh-ky-thuat-di-lam',
    title: 'Technical English at Work',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/tieng-anh-ky-thuat-di-lam.png?v=1',
    shortDescription: 'The English developers use daily: reading docs and specs, writing tickets, bug reports, commits, PRs and client emails, asking clarifying questions, stand-ups and demos — with real templates and practice.|||Tiếng Anh lập trình viên dùng mỗi ngày: đọc tài liệu, spec, viết ticket, bug report, commit, PR, email cho khách, hỏi làm rõ, standup và demo — mỗi bài có mẫu thật và bài luyện.',
    description: 'Khoá tiếng Anh theo tình huống công việc cho sinh viên IT sắp OJT ở công ty có khách nước ngoài. Không học lại ngữ pháp từ đầu: mỗi bài lấy một việc bạn sẽ làm trong tuần đầu (đọc README và release notes, viết bug report, viết commit và mô tả PR, email hỏi lại yêu cầu, báo trễ, báo sự cố, lập Q&A list, nói standup 60 giây, demo cho khách, họp và xác nhận lại bằng văn bản), đưa mẫu thật, phân tích vì sao viết như vậy, chỉ ra lỗi người Việt hay mắc, rồi cho bạn luyện có đáp án gợi ý. Có phần phát âm thuật ngữ hay sai, từ vựng theo tình huống (liên kết sổ chuyên ngành trong CT Language), nghe nhiều giọng (Ấn, Nhật, Mỹ) và luyện dạng bài test tiếng Anh đầu vào của công ty. Cuối khoá: một "tuần làm việc bằng tiếng Anh" mô phỏng.',
    whatYouLearn: 'Đọc nhanh tài liệu, thông báo lỗi, issue và spec tiếng Anh, hiểu đúng MUST/SHOULD/MAY; viết ticket, bug report, commit message và mô tả PR chuẩn; viết review comment lịch sự; viết email hỏi lại yêu cầu, báo trễ, báo sự cố với giọng chuyên nghiệp; lập Q&A list với câu hỏi có phương án; nói standup, demo và tham gia họp với khách (xin nhắc lại, xác nhận, không đồng ý lịch sự, chốt việc); phát âm đúng các thuật ngữ hay sai; chuẩn bị cho bài test tiếng Anh của công ty.',
    requirements: 'Tiếng Anh mức đọc hiểu cơ bản (khoảng A2–B1). Đã biết Git, ticket và quy trình nhóm cơ bản (khoá Agile & Teamwork) là lợi thế.',
    documentsNote: 'Tài liệu chính: Google Technical Writing One/Two (developers.google.com/tech-writing) • Google developer documentation style guide • Microsoft Writing Style Guide • RFC 2119 (MUST/SHOULD/MAY) • conventionalcommits.org • cbea.ms/git-commit ("How to Write a Git Commit Message") • Cambridge Dictionary và Oxford Learner\'s Dictionaries (phiên âm) • YouGlish (nghe phát âm thật) • sổ từ chuyên ngành trong CT Language.',
  },
  sections: ghepChuong(khung('tak', [
    ['Section 0 — English as a work tool', 'Mục 0 — Tiếng Anh như một công cụ làm việc', 'Học đúng thứ tiếng Anh bạn sẽ dùng ở tuần đầu đi làm.', [
      ['bat-dau-tai-day', 'Start here (1/2) — The English of your first month at work', 'Bắt đầu tại đây (1/2) — Thứ tiếng Anh bạn dùng trong tháng đầu đi làm', 'Bản đồ tình huống: đọc, viết, nói, nghe trong một tuần làm việc · Khách Nhật, Mỹ, Âu dùng tiếng Anh khác nhau ra sao · Học bằng mẫu câu theo tình huống, không học ngữ pháp từ đầu · Lộ trình 8 chương và tuần mô phỏng cuối khoá'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — When English goes wrong at work: silence, ambiguity, the wrong tone', 'Bắt đầu tại đây (2/2) — Khi tiếng Anh hỏng việc: im lặng, mơ hồ, sai giọng', 'Không dám hỏi lại nên làm sai cả sprint · "should" bị hiểu thành "must" · Email cộc lốc làm khách phật ý · Sự cố thật có nguồn: Mars Climate Orbiter 1999 (hai đội hiểu khác đơn vị — lỗi giao tiếp đặc tả) · Tình huống: khách hỏi trong cuộc họp mà bạn không nghe kịp'],
      ['tu-danh-gia', 'Self-assessment and a 15-minutes-a-day plan', 'Tự đánh giá và kế hoạch 15 phút mỗi ngày', 'Bài kiểm tra đầu vào ngắn: đọc, viết, nghe, nói · Bộ công cụ: Cambridge/Oxford Learner\'s (phiên âm), YouGlish, công cụ kiểm ngữ pháp, AI sửa câu đúng cách · Liên kết CT Language (từ vựng, IELTS) và interview-prep ch8 (phỏng vấn) — không dạy lại'],
    ]],
    ['Chapter 1 — Reading technical English', 'Chương 1 — Đọc tiếng Anh kỹ thuật', 'Đọc để làm được việc, không phải để dịch từng chữ.', [
      ['tai-lieu', 'Reading documentation: structure, skimming, tutorial vs reference', 'Đọc tài liệu: cấu trúc, đọc lướt, tutorial và reference', 'Docs được tổ chức thế nào (tutorial, how-to, reference, explanation) · Chiến thuật khi gặp từ lạ: đoán từ ngữ cảnh trước khi tra · Lab: tìm cách cấu hình CORS trong docs Spring trong 5 phút'],
      ['loi-issue', 'Error messages, logs, GitHub issues, release notes and changelogs', 'Thông báo lỗi, log, issue GitHub, release notes và changelog', 'Từ khoá hay gặp: deprecated, breaking change, workaround, regression, backport · Đọc issue: cái nào là giải pháp, cái nào là bàn luận · Lab: tóm tắt release notes một phiên bản Spring Boot trong 5 dòng'],
      ['spec', 'Specs and requirements in English: RFC 2119 words, acceptance criteria, ambiguity', 'Spec và yêu cầu bằng tiếng Anh: từ của RFC 2119, tiêu chí chấp nhận, chỗ mơ hồ', 'MUST/SHOULD/MAY và hệ quả khi hiểu sai · Đánh dấu chỗ mơ hồ để đưa vào Q&A list (Chương 5) · Tiếng Anh của khách Nhật: câu dài, bị động, từ dịch từ tiếng Nhật · Lab: đọc một spec 2 trang, liệt kê 5 điểm mơ hồ'],
      ['lab', 'Lab: summarise a README, an issue thread and a spec', 'Lab: tóm tắt một README, một luồng issue và một spec', 'Đạt khi: tóm tắt đúng ý chính, không bỏ sót điều kiện bắt buộc · Có đáp án gợi ý'],
      ['quiz', 'Chapter 1 quiz', 'Kiểm tra Chương 1', '10 câu: nghĩa MUST/SHOULD · từ khoá changelog · đoán nghĩa từ ngữ cảnh'],
    ]],
    ['Chapter 2 — Writing tickets and bug reports', 'Chương 2 — Viết ticket và bug report', 'Viết để người khác làm được mà không phải hỏi lại.', [
      ['ticket', 'Tickets and user stories: title, context, acceptance criteria (Given/When/Then)', 'Ticket và user story: tiêu đề, bối cảnh, tiêu chí chấp nhận (Given/When/Then)', 'Mẫu "As a… I want… so that…" và khi nào không cần · Tiêu đề bắt đầu bằng động từ · Lỗi người Việt hay mắc: thiếu mạo từ, sai thì · Bài luyện: viết lại 5 ticket mơ hồ'],
      ['bug-report', 'Bug reports: steps, expected vs actual, environment, severity', 'Bug report: bước tái hiện, mong đợi và thực tế, môi trường, mức độ', 'Mẫu câu "Steps to reproduce", "Expected result", "Actual result" · Mô tả ảnh chụp/video · Tránh cảm xúc ("it\'s totally broken") · Liên kết debug-co-phuong-phap ch11 (nội dung bug report)'],
      ['cap-nhat', 'Status updates and comments on tickets', 'Cập nhật trạng thái và bình luận trên ticket', 'Mẫu: đã làm gì, đang vướng gì, cần ai làm gì · Viết "blocked by", "waiting for", "ready for review" đúng nghĩa · Bài luyện: 5 cập nhật trạng thái'],
      ['lab', 'Lab: Translate five real Vietnamese bug reports into clear English', 'Lab: Viết lại năm bug report tiếng Việt thật thành tiếng Anh rõ ràng', 'Đạt khi: người không biết tiếng Việt tái hiện được lỗi · Đáp án gợi ý + lỗi hay mắc'],
      ['quiz', 'Chapter 2 quiz', 'Kiểm tra Chương 2', '10 câu: severity/priority · tiêu đề tốt · sửa câu sai'],
    ]],
    ['Chapter 3 — Commit messages, pull requests and code review', 'Chương 3 — Commit message, pull request và code review', 'Tiếng Anh trên GitHub — đồng nghiệp đọc mỗi ngày.', [
      ['commit', 'Commit messages: imperative mood, 50/72, Conventional Commits', 'Commit message: thể mệnh lệnh, quy tắc 50/72, Conventional Commits', '"Fix login redirect" chứ không "Fixed"/"Fixing" · Thân commit giải thích vì sao · feat/fix/refactor/chore · Bài luyện: sửa 10 commit message tệ'],
      ['pr', 'Pull request descriptions: summary, why, how it was tested, screenshots, risks', 'Mô tả pull request: tóm tắt, vì sao, đã kiểm thế nào, ảnh chụp, rủi ro', 'Mẫu PR template dùng được ngay · Viết cho người review đọc trong 2 phút · Bài luyện: viết mô tả cho 3 PR'],
      ['review', 'Review comments that are polite and clear: suggestions, questions, nits, approvals', 'Bình luận review lịch sự và rõ ràng: gợi ý, câu hỏi, nit, chấp thuận', '"Could we…?", "What do you think about…?", "nit:", "LGTM" · Trả lời review: "Good catch, fixed in abc123", "I kept X because…" · Lỗi giọng văn: ra lệnh cộc lốc'],
      ['lab', 'Lab: one PR end to end in English', 'Lab: một PR trọn vẹn bằng tiếng Anh', 'Đạt khi: commit đúng chuẩn, mô tả đủ 4 mục, trả lời lịch sự và cụ thể'],
      ['quiz', 'Chapter 3 quiz', 'Kiểm tra Chương 3', '10 câu: thể mệnh lệnh · chọn câu review lịch sự · nit nghĩa là gì'],
    ]],
    ['Chapter 4 — Email and chat with clients and leads', 'Chương 4 — Email và chat với khách hàng và trưởng nhóm', 'Lịch sự, rõ ràng, có hành động cụ thể.', [
      ['cau-truc', 'The structure of a work email: subject, opening, point, ask, closing', 'Cấu trúc email công việc: tiêu đề, mở đầu, ý chính, đề nghị, kết', 'Tiêu đề nói được nội dung · Ý chính ở câu đầu · Một email một mục đích · Mức trang trọng: khách vs đồng nghiệp · Lỗi hay mắc: "Dear Sir/Madam" với người đã biết tên, xin lỗi quá nhiều'],
      ['hoi-lai', 'Asking for clarification on requirements', 'Hỏi lại cho rõ yêu cầu', '"Could you clarify whether…?" · Đưa phương án để khách chọn · Xác nhận lại hiểu biết ("Just to confirm, …") · Bài luyện: 3 email hỏi lại từ một spec mơ hồ'],
      ['bao-tre', 'Reporting a delay: reason, impact, new plan, what you need', 'Báo trễ hạn: lý do, ảnh hưởng, kế hoạch mới, cần hỗ trợ gì', 'Báo sớm, không đổ lỗi · Mẫu "Unfortunately… As a result… We propose…" · Tình huống OJT: task dự kiến 2 ngày đã sang ngày thứ 4'],
      ['bao-su-co', 'Reporting an incident and following up', 'Báo sự cố và cập nhật tiếp theo', 'Thông báo đầu tiên ngắn: chuyện gì, ảnh hưởng ai, đang làm gì, lần cập nhật tới lúc nào · Thư tổng kết sau sự cố · Không hứa điều chưa chắc'],
      ['chat', 'Slack/Teams messages that stand alone, and async etiquette', 'Tin nhắn Slack/Teams tự đủ ý, và phép lịch sự khi làm bất đồng bộ', 'Không gửi mỗi "Hi" rồi chờ (nohello.net) · Gom câu hỏi, kèm ngữ cảnh · Múi giờ · Bài luyện: viết lại 5 tin nhắn'],
      ['lab', 'Lab: Six emails for six real situations', 'Lab: Sáu email cho sáu tình huống thật', 'Hỏi lại yêu cầu, báo trễ, báo sự cố, xin nghỉ, cảm ơn, từ chối yêu cầu ngoài phạm vi · Đạt khi: theo rubric giọng văn + cấu trúc'],
      ['quiz', 'Chapter 4 quiz', 'Kiểm tra Chương 4', '10 câu: chọn tiêu đề · giọng văn phù hợp · thứ tự ý trong email báo trễ'],
    ]],
    ['Chapter 5 — Q&A lists and specs with clients', 'Chương 5 — Q&A list và spec với khách hàng', 'Hỏi đúng cách để khách trả lời được ngay.', [
      ['qa-list', 'The Q&A list: columns, numbering, status, who answers', 'Q&A list: các cột, đánh số, trạng thái, ai trả lời', 'Mẫu bảng (No, Category, Question, Our proposal, Answer, Status) · Một câu một ý · Theo dõi câu hỏi tới khi đóng · Liên kết agile-teamwork (quy trình outsourcing)'],
      ['cau-hoi-dong', 'Closed questions with a proposal: "We assume X. Is that correct?"', 'Câu hỏi đóng có đề xuất: "Chúng tôi giả định X. Như vậy có đúng không?"', 'Biến câu hỏi mở thành lựa chọn A/B · Kèm ảnh chụp, vị trí trong spec · Bài luyện: viết lại 8 câu hỏi mở thành câu hỏi đóng'],
      ['xac-nhan', 'Confirming changes in writing and spotting scope creep', 'Xác nhận thay đổi bằng văn bản và nhận ra phạm vi phình to', '"As discussed in today\'s meeting, …" · Khi yêu cầu mới là change request · Câu từ chối lịch sự nhưng rõ'],
      ['lab', 'Lab: Build a Q&A list from a 3-page English spec', 'Lab: Lập Q&A list từ một spec tiếng Anh 3 trang', 'Đạt khi: ≥ 10 câu hỏi đóng, có đề xuất, không trùng, đánh dấu ưu tiên'],
      ['quiz', 'Chapter 5 quiz', 'Kiểm tra Chương 5', '10 câu: câu hỏi đóng vs mở · nhận ra change request'],
    ]],
    ['Chapter 6 — Speaking: stand-ups, demos and meetings', 'Chương 6 — Nói: standup, demo và họp', 'Nói ngắn, rõ, có cấu trúc — kể cả khi chưa trôi chảy.', [
      ['standup', 'A 60-second stand-up: yesterday, today, blockers', 'Standup 60 giây: hôm qua, hôm nay, vướng gì', 'Mẫu câu "I finished…", "I\'m working on…", "I\'m blocked by…" · Nói con số và tên ticket · Lab: ghi âm 3 standup, nghe lại'],
      ['demo', 'Demoing to a client: script, narration, handling questions', 'Demo cho khách: kịch bản, lời dẫn, xử lý câu hỏi', 'Mở đầu bằng mục tiêu · "Let me show you…", "As you can see…" · Khi demo lỗi giữa chừng · "That\'s a great question, let me check and get back to you"'],
      ['hop', 'Meetings: asking to repeat, confirming, disagreeing politely, closing with action items', 'Họp: xin nhắc lại, xác nhận, không đồng ý lịch sự, chốt việc', '"Sorry, could you say that again?", "Do you mean…?" · "I see your point, however…" · Chốt "So the action items are…" · Viết minutes sau họp'],
      ['nghe', 'Listening to many accents: Indian, Japanese, American, Australian', 'Nghe nhiều giọng: Ấn, Nhật, Mỹ, Úc', 'Đặc điểm phát âm từng giọng · Nguồn luyện nghe miễn phí (talk hội nghị, podcast kỹ thuật) · Chiến thuật khi không nghe kịp: hỏi lại, nhờ gõ vào chat'],
      ['lab', 'Lab: Record a stand-up, a 3-minute demo and a meeting role-play', 'Lab: Ghi âm một standup, một demo 3 phút và một buổi họp đóng vai', 'Có kịch bản mẫu và rubric tự chấm (rõ ý, tốc độ, phát âm thuật ngữ) · Có thể luyện cùng CuongMini/AI nói'],
      ['quiz', 'Chapter 6 quiz', 'Kiểm tra Chương 6', '10 câu: câu xin nhắc lại · không đồng ý lịch sự · chốt action item'],
    ]],
    ['Chapter 7 — Vocabulary by situation and pronunciation of tech terms', 'Chương 7 — Từ vựng theo tình huống và phát âm thuật ngữ', 'Từ nào dùng ở đâu, đọc thế nào cho người nước ngoài hiểu.', [
      ['tu-vung', 'Vocabulary by situation: planning, coding, testing, deploying, incidents', 'Từ vựng theo tình huống: lên kế hoạch, viết code, kiểm thử, triển khai, sự cố', 'estimate, scope, deadline, workaround, regression, hotfix, rollback, root cause, downtime… · Cụm động từ hay gặp (roll out, look into, follow up) · Từ đơn lẻ: dẫn sang sổ chuyên ngành CT Language'],
      ['phat-am', 'Tech terms Vietnamese speakers often mispronounce', 'Thuật ngữ người Việt hay phát âm sai', 'cache, suite, queue, data, Linux, nginx, SQL, GUI, char, enum, Azure, sudo, Kubernetes, GitHub, width, height · Trọng âm và âm cuối · Nghe mẫu thật trên YouGlish · Lab: shadowing 20 thuật ngữ'],
      ['mau-cau', '100 sentence patterns for daily work situations', '100 mẫu câu cho tình huống làm việc hằng ngày', 'Nhóm theo tình huống: hỏi, đề nghị, báo cáo, xin lỗi, từ chối, cảm ơn · Bản in một trang · Bài luyện điền mẫu câu'],
      ['lab', 'Lab: Pronunciation check with recordings and a vocabulary set in CT Language', 'Lab: Kiểm phát âm bằng ghi âm và tạo bộ từ trong CT Language', 'Đạt khi: 20 thuật ngữ đọc đúng trọng âm + một bộ từ ôn tập lặp lại'],
      ['quiz', 'Chapter 7 quiz', 'Kiểm tra Chương 7', '10 câu: trọng âm · chọn từ đúng tình huống · cụm động từ'],
    ]],
    ['Chapter 8 — Company English tests and capstone: a week at work in English', 'Chương 8 — Bài test tiếng Anh của công ty và dự án cuối khoá: một tuần làm việc bằng tiếng Anh', 'Tổng hợp mọi kỹ năng trong một tuần mô phỏng.', [
      ['bai-test', 'Preparing for company English tests: reading, grammar, listening, speaking formats', 'Chuẩn bị bài test tiếng Anh của công ty: dạng đọc, ngữ pháp, nghe, nói', 'Các dạng bài thường gặp ở bài test đầu vào/định kỳ (mô tả chung, không suy đoán đề cụ thể) · Quan hệ với TOEIC/IELTS · Đề luyện tự chấm'],
      ['tuan-mo-phong', 'Capstone — a simulated work week in English', 'Dự án cuối khoá — một tuần làm việc mô phỏng bằng tiếng Anh', 'Mỗi ngày một nhóm việc · Nộp bài viết + ghi âm · Rubric chấm từng sản phẩm'],
      ['tu-cham', 'Self-review, feedback and your next 3 months of practice', 'Tự chấm, nhận phản hồi và kế hoạch luyện 3 tháng tới', 'So bài đầu khoá và cuối khoá · Kế hoạch 15 phút/ngày · Liên kết interview-prep ch8 khi chuẩn bị phỏng vấn'],
      ['tong-ket', 'Final quiz', 'Kiểm tra tổng kết', '20 câu trộn cả khoá: đọc, viết, chọn câu phù hợp tình huống'],
      ['phong-van-ojt', 'The English interview for an OJT place at FPT Software: technical answers, a full mock interview, questions to ask', 'Phỏng vấn tiếng Anh xin OJT ở FPT Software: trả lời câu kỹ thuật, một buổi phỏng vấn thử trọn vẹn, câu nên hỏi lại', 'Khuôn D-E-T cho câu kỹ thuật · Tám câu hay gặp có bằng chứng chạy thật · Buổi phỏng vấn thử trọn vẹn · Góc bảo mật phỏng vấn giả'],
    ]],
  ])),
};
