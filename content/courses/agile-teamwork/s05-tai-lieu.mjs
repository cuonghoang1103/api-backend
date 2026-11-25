/**
 * Chương 5 — Viết tài liệu kỹ thuật (khoá agile-teamwork). Soạn 24/11/2026, agent agt.
 * Mỗi bài một tệp trong ./s05/; ./s05/_ma.mjs là tệp SINH (mã + output thật: Node 22.22.2, node:22-alpine 22.23.5 trong container, git 2.55.0)
 * bởi scratchpad/agt/lab/ch5/tao-ma.mjs (chạy lại tất cả: lab/ch5/chay-het.sh). Slug + title 4 bài cũ GIỮ NGUYÊN theo khung
 * (agl-5-1 … agl-5-4); thêm agl-5-5-lab và agl-5-6-quiz (đã thêm vào khung trong ../agile-teamwork.mjs).
 */
import { Q } from './_chung.mjs';
import B1 from './s05/b1-readme.mjs';
import B2 from './s05/b2-adr.mjs';
import B3 from './s05/b3-rfc.mjs';
import B4 from './s05/b4-postmortem.mjs';
import B5 from './s05/b5-lab.mjs';

const QUIZ5 = [
  Q('agl5-1', 'Why is the author of a README the worst person to test it?|||Vì sao tác giả README là người kiểm nó kém nhất?', [
    'They type too fast|||Họ gõ quá nhanh',
    'Their machine already has everything (.env, tools, habits), so missing steps never show up|||Máy họ đã có sẵn mọi thứ (.env, công cụ, thói quen), nên bước bị thiếu không bao giờ lộ ra',
    'Authors cannot run Docker|||Tác giả không chạy được Docker',
    'READMEs should be tested by the supervisor only|||README chỉ nên do giảng viên kiểm',
  ], 1, 'In the real run, "copy .env.example" was missing because the author’s .env existed since week 1. Lesson 5.1.|||Trong lần chạy thật, bước "chép .env.example" bị thiếu vì .env của tác giả có từ tuần 1. Bài 5.1.'),
  Q('agl5-2', 'Running the team README in a clean container for the first time also revealed…|||Lần đầu chạy README nhóm trong container sạch còn phát hiện ra…',
    ['Nothing beyond the README|||Không gì ngoài README',
      'That the project’s own "npm test" was broken|||Rằng chính "npm test" của dự án đang hỏng',
      'A security hole in Node|||Một lỗ hổng an ninh của Node',
      'That Docker needs internet|||Rằng Docker cần Internet'],
    1, 'node --test test/ did not accept a directory; nobody ran tests through npm test. Lesson 5.1.|||node --test test/ không nhận thư mục; chưa ai chạy test qua npm test. Bài 5.1.'),
  Q('agl5-3', 'How should the "who owns which screen" table in the README be kept correct?|||Nên giữ bảng "ai phụ trách màn nào" trong README đúng bằng cách nào?', [
    'The leader edits it every Friday|||Trưởng nhóm sửa mỗi thứ Sáu',
    'Generate it from the assignment CSV and let CI fail when they differ|||Sinh nó từ CSV phân công và để CI đỏ khi hai bên lệch',
    'Remove it — the supervisor does not read it|||Bỏ đi — giảng viên không đọc',
    'Put it in the team chat instead|||Đưa vào nhóm chat thay thế',
  ], 1, 'One source of truth; ban-do.mjs --kiem caught the forgotten S24 row. Lesson 5.1.|||Một nguồn sự thật; ban-do.mjs --kiem bắt được dòng S24 bị quên. Bài 5.1.'),
  Q('agl5-4', 'The team changes its mind about an accepted ADR. What is the right move?|||Nhóm đổi ý về một ADR đã chấp nhận. Làm thế nào là đúng?', [
    'Edit the old ADR’s decision|||Sửa phần quyết định của ADR cũ',
    'Delete the old ADR|||Xoá ADR cũ',
    'Write a new ADR that supersedes it, linked both ways; keep the old one|||Viết ADR mới thay nó, liên kết hai chiều; giữ ADR cũ',
    'Write the change in the chat|||Ghi thay đổi vào nhóm chat',
  ], 2, 'Nygard: decisions can be "superseded" with a reference to the replacement. ADR 0007 superseded 0003. Lesson 5.2.|||Nygard: quyết định có thể "bị thay thế" kèm liên kết tới bản thay. ADR 0007 thay 0003. Bài 5.2.'),
  Q('agl5-5', 'Two branches both created ADR 0005 and git merged them without conflict. Why did git not notice?|||Hai nhánh cùng tạo ADR 0005 và git merge không xung đột. Vì sao git không thấy?', [
    'Git ignores Markdown|||Git bỏ qua Markdown',
    'The files had different names; sequential numbers handed out on parallel branches collide in meaning, not in text — like two V3 migrations|||Hai tệp khác tên; số tuần tự cấp trên nhánh song song đụng nhau về nghĩa, không phải về chữ — như hai migration V3',
    'Someone used --force|||Có người dùng --force',
    'ADRs must be in a wiki|||ADR phải để ở wiki',
  ], 1, 'adr.mjs kiem caught it. Lesson 5.2 and 3.3.|||adr.mjs kiem bắt được. Bài 5.2 và 3.3.'),
  Q('agl5-6', 'In RFC-001 the "no AI" option wins the weighted matrix. What went wrong?|||Ở RFC-001 phương án "không AI" thắng ma trận trọng số. Sai ở đâu?', [
    'The weights were too small|||Trọng số quá nhỏ',
    'Nothing — the team should drop AI|||Không sai — nhóm nên bỏ AI',
    'A hard constraint (the project must have AI) was not applied as a filter before scoring|||Một ràng buộc cứng (đề tài bắt buộc có AI) không được dùng làm bộ lọc trước khi chấm',
    'Matrices cannot compare three options|||Ma trận không so được ba phương án',
  ], 2, 'Constraints filter; weights rank what is left. Lesson 5.3.|||Ràng buộc để lọc; trọng số để xếp hạng phần còn lại. Bài 5.3.'),
  Q('agl5-7', 'When option A was scored "by feeling", what did the sensitivity check show?|||Khi phương án A được chấm "theo cảm tính", phép thử độ nhạy cho thấy gì?', [
    'B still won under every weight|||B vẫn thắng với mọi trọng số',
    'The winner flipped with small changes of single weights — scores need measurements|||Người thắng lật với thay đổi nhỏ của từng trọng số — điểm cần số đo',
    'A won everywhere|||A thắng ở mọi chỗ',
    'The matrix crashed|||Ma trận bị lỗi',
  ], 1, 'With honest scores B never flipped; with optimistic scores it led by 2. Lesson 5.3.|||Với điểm trung thực B không bao giờ lật; với điểm lạc quan nó chỉ hơn 2. Bài 5.3.'),
  Q('agl5-8', 'Masking names with the user table caught both full names. What new problem appeared?|||Che tên bằng danh bạ người dùng bắt được cả hai họ tên. Vấn đề mới nào xuất hiện?', [
    'Emails were no longer masked|||Email không còn được che',
    '"hoa" (flower) in an innocent question was masked as a name — masking both leaks and over-masks|||"hoa" trong một câu vô hại bị che như tên — việc che vừa lọt vừa che nhầm',
    'The script became too slow|||Script chậm quá',
    'Student IDs leaked|||MSSV bị lọt',
  ], 1, 'The safest data is data you never send: option B. Lesson 5.3.|||Dữ liệu an toàn nhất là dữ liệu không gửi đi: phương án B. Bài 5.3.'),
  Q('agl5-9', 'In the LabFlow staging incident, what was the biggest number in the timeline?|||Trong sự cố staging của LabFlow, con số lớn nhất của dòng thời gian là gì?', [
    'Time to fix: 21 minutes|||Thời gian sửa: 21 phút',
    'Time to detect: 11 h 29 min, because the only alert was an email nobody read|||Thời gian phát hiện: 11 giờ 29 phút, vì cảnh báo duy nhất là một email không ai đọc',
    'Data lost: 300 GB|||Dữ liệu mất: 300 GB',
    'Time to write the postmortem|||Thời gian viết postmortem',
  ], 1, 'Same lesson as GitLab 2017: alerts sent where nobody looks are no alerts. Lesson 5.4.|||Cùng bài học với GitLab 2017: cảnh báo gửi tới nơi không ai nhìn thì không phải cảnh báo. Bài 5.4.'),
  Q('agl5-10', 'Which is a good postmortem action item?|||Hành động khắc phục nào trong postmortem là tốt?', [
    '"Everyone be more careful when merging"|||"Mọi người cẩn thận hơn khi merge"',
    '"C1 learns the lesson and reads email at night"|||"C1 rút kinh nghiệm, tối phải đọc mail"',
    '"CI runs kiem-migration.mjs and blocks out-of-order migrations — owner C1, 26/02/2027, LF-70"|||"CI chạy kiem-migration.mjs, chặn migration sai thứ tự — chủ C1, 26/02/2027, LF-70"',
    '"Avoid migrations"|||"Tránh dùng migration"',
  ], 2, 'Specific, checkable, one owner, a date, a ticket. Lesson 5.4.|||Cụ thể, kiểm được, một chủ, một hạn, một ticket. Bài 5.4.'),
];

export default {
  title: 'Chapter 5 — Technical writing|||Chương 5 — Viết tài liệu kỹ thuật',
  description: 'Tài liệu nhóm được kiểm như mã, chạy thật trên LabFlow: README chạy thử trong container sạch (bắt cả npm test hỏng của dự án) với bảng màn → người sinh từ CSV; sổ ADR mẫu Nygard với công cụ moi/chap-nhan/ds/kiem (bắt hai ADR 0005, ADR thay thế sau sự cố); RFC trợ lý AI với ma trận lọc ràng buộc, thử độ nhạy, đo dữ liệu gửi ra ngoài và thử che dữ liệu cá nhân (Samsung 2023); postmortem không đổ lỗi dựng dòng thời gian từ git + CI + chat (GitLab 2017); lab mốc dự án: một bước CI cho mọi tài liệu.',
  lessons: [B1, B2, B3, B4, B5,
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra Chương 5',
      slug: 'agl-5-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: vì sao tác giả không kiểm được README, npm test hỏng, bảng phân công sinh tự động, thay ADR, hai ADR 0005, ràng buộc cứng trong ma trận, điểm cảm tính, che dữ liệu cá nhân, thời gian phát hiện sự cố, hành động khắc phục tốt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the real runs of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các lần chạy thật trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ5 },
    },
  ],
};
