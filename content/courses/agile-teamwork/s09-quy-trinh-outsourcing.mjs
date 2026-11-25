/**
 * Làm việc nhóm phần mềm — Chương 9: Quy trình dự án outsourcing trong thực tế (soạn 24/11/2026, agent agl).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../agile-teamwork.mjs (agl-9-1-mo-hinh-hop-dong … agl-9-9-quiz), ghép bằng ghep().
 * Nội dung từng bài ở ./s09/b*.mjs; dữ liệu tài liệu mẫu dùng chung ở ./_mau.mjs (cũng là nguồn sinh 5 tệp .xlsx tải về).
 * Mọi output trong bài là chạy thật trên máy soạn (Node 22.22.2, LibreOffice headless) — đường dẫn ghi ở đầu từng tệp bài.
 */
import { Q } from './_chung.mjs';
import { L91 } from './s09/b1-mo-hinh-hop-dong.mjs';
import { L92 } from './s09/b2-vong-doi-v-model.mjs';
import { L93 } from './s09/b3-tai-lieu-bd-dd.mjs';
import { L94 } from './s09/b4-test-spec.mjs';
import { L95 } from './s09/b5-qa-cr.mjs';
import { L96 } from './s09/b6-uoc-luong-man-day.mjs';
import { L97 } from './s09/b7-bao-cao-hourensou.mjs';
import { L98 } from './s09/b8-lab.mjs';

const hai = (L) => L(true) + L(false);

const QUIZ9 = [
  Q('agl9-1', 'A fixed-price project. A customer\'s tester asks you in chat to "also make the list sortable, it\'s small". What is the correct first action?|||Dự án trọn gói. Tester bên khách nhắn bạn "làm thêm cho danh sách sắp xếp được nhé, việc nhỏ". Việc đúng đầu tiên là gì?', [
    'Add it — small improvements keep the customer happy|||Làm luôn — cải tiến nhỏ làm khách vui',
    'Ignore the message|||Lờ tin nhắn đi',
    'Acknowledge without committing and pass it to the leader/BrSE as a Q&A or potential CR with an estimate|||Ghi nhận, không hứa, chuyển leader/BrSE dưới dạng Q&A hoặc CR tiềm năng kèm ước lượng',
    'Reply that it is out of scope and close the chat|||Trả lời là ngoài phạm vi rồi đóng chat',
  ], 2, 'In fixed price, unpriced and untested additions hurt both sides; the scope change must be recorded and estimated. Lessons 9.1, 9.5.|||Ở hợp đồng trọn gói, phần thêm không tính giá, không test gây hại cả hai bên; thay đổi phạm vi phải được ghi lại và ước lượng. Bài 9.1, 9.5.'),
  Q('agl9-2', 'In which contract model does an accurate daily timesheet directly become an invoice line?|||Ở mô hình nào timesheet chính xác hằng ngày trở thành trực tiếp một dòng hoá đơn?', [
    'Fixed price|||Trọn gói', 'Time & Materials|||T&M', 'Neither — timesheets are only for HR|||Không mô hình nào — timesheet chỉ cho nhân sự', 'Only onsite contracts|||Chỉ hợp đồng onsite',
  ], 1, 'T&M (and ODC) bill effort. Lesson 9.1.|||T&M (và ODC) tính tiền theo công. Bài 9.1.'),
  Q('agl9-3', 'In the V-model as used on many Japanese projects, which test level verifies the detailed design (DD)?|||Trong V-model ở nhiều dự án Nhật, mức test nào kiểm chứng thiết kế chi tiết (DD)?', [
    'Unit test (UT)|||Unit test (UT)', 'Integration test (IT)|||Test tích hợp (IT)', 'System test (ST)|||Test hệ thống (ST)', 'Acceptance test (UAT)|||Nghiệm thu (UAT)',
  ], 0, 'DD ↔ UT at the bottom of the V; BD ↔ IT/ST; RD ↔ ST/UAT (exact pairing per project). Lesson 9.2.|||DD ↔ UT ở đáy chữ V; BD ↔ IT/ST; RD ↔ ST/UAT (ghép chính xác tuỳ dự án). Bài 9.2.'),
  Q('agl9-4', 'A DD says a name is "1–50 characters". A Vietnamese name typed on a Mac fails validation although it shows 45 letters. Most likely cause?|||DD ghi tên "1–50 ký tự". Một tên tiếng Việt gõ trên máy Mac bị báo lỗi dù chỉ hiện 45 chữ. Nguyên nhân khả dĩ nhất?', [
    'The DD is wrong|||DD sai', 'The string is in NFD form and the code counts code units without normalising|||Chuỗi ở dạng NFD và code đếm đơn vị mã mà không chuẩn hoá', 'The browser is outdated|||Trình duyệt cũ', 'The database is full|||Database đầy',
  ], 1, '"Nguyễn" is 6 code units in NFC but 8 in NFD — measured in lesson 9.3; raise it as Q&A and normalise to NFC before counting.|||"Nguyễn" là 6 đơn vị mã ở NFC nhưng 8 ở NFD — đo ở bài 9.3; đặt Q&A và chuẩn hoá NFC trước khi đếm.'),
  Q('agl9-5', 'Which expected result is acceptable in a test specification?|||Kết quả mong đợi nào chấp nhận được trong test spec?', [
    '"An error is shown"|||"Hiện lỗi"', '"Works correctly"|||"Hoạt động đúng"', '"MSG-E004 is shown under ITM-03; no row is added to patient"|||"Hiện MSG-E004 dưới ITM-03; bảng patient không thêm dòng"', '"Same as the DD"|||"Giống DD"',
  ], 2, 'Expected results must be exact and checkable by someone else. Lesson 9.4.|||Kết quả mong đợi phải chính xác và người khác kiểm được. Bài 9.4.'),
  Q('agl9-6', 'A test cannot be executed because the DB fault cannot be simulated in the dev environment. Status?|||Một test không chạy được vì môi trường dev chưa giả lập được lỗi DB. Trạng thái?', [
    'Pass|||Pass', 'Fail|||Fail', 'Blocked, with the reason|||Blocked, kèm lý do', 'Delete the case|||Xoá case',
  ], 2, 'Blocked = could not run, no conclusion about the feature; always write why. Lesson 9.4.|||Blocked = chưa chạy được, chưa kết luận về chức năng; luôn ghi lý do. Bài 9.4.'),
  Q('agl9-7', 'Which Q&A row will most likely get the fastest answer from a Japanese customer?|||Dòng Q&A nào nhiều khả năng được khách Nhật trả lời nhanh nhất?', [
    '"How should phone numbers be handled?"|||"Số điện thoại xử lý thế nào ạ?"',
    '"DD v1.2 ITM-03: if the user types 090-123-4567, we propose showing MSG-E004 (no document change). Is that OK? Due 25/11."|||"DD v1.2 ITM-03: người dùng gõ 090-123-4567, chúng tôi đề xuất báo MSG-E004 (không phải sửa tài liệu). Được không ạ? Hạn 25/11."',
    '"Please check the phone, date and password rules."|||"Nhờ anh xem giúp quy tắc số điện thoại, ngày và mật khẩu."',
    '"As discussed, the phone thing?"|||"Như đã trao đổi, vụ số điện thoại ạ?"',
  ], 1, 'Location + one closed question + proposal + due date. Lesson 9.5.|||Vị trí + một câu đóng + đề xuất + hạn. Bài 9.5.'),
  Q('agl9-8', 'The customer answers a Q&A: "Also send an activation e-mail after registration." No document mentions e-mail sending. This is…|||Khách trả lời Q&A: "Gửi luôn email kích hoạt sau khi đăng ký." Không tài liệu nào nói về gửi email. Đây là…', [
    'A clarification — implement it today|||Làm rõ — làm luôn hôm nay', 'A change request — flag it, estimate, wait for approval|||Change request — cắm cờ, ước lượng, chờ duyệt', 'A bug in our code|||Bug trong code của mình', 'Nothing to do|||Không phải làm gì',
  ], 1, 'New function outside scope ⇒ CR with impact analysis and approval before coding. Lesson 9.5 (QA-008 → CR-003).|||Chức năng mới ngoài phạm vi ⇒ CR có phân tích ảnh hưởng và phê duyệt trước khi code. Bài 9.5 (QA-008 → CR-003).'),
  Q('agl9-9', 'O = 4 h, M = 6 h, P = 14 h. What is the PERT expected value E?|||O = 4 h, M = 6 h, P = 14 h. Giá trị kỳ vọng PERT E là bao nhiêu?', [
    '6 h|||6 h', '7 h|||7 h', '8 h|||8 h', '14 h|||14 h',
  ], 1, 'E = (4 + 4×6 + 14) / 6 = 42 / 6 = 7 h. Lesson 9.6.|||E = (4 + 4×6 + 14) / 6 = 42 / 6 = 7 h. Bài 9.6.'),
  Q('agl9-10', 'Your 2-day task is not done on the morning of day 3. Which message follows hourensou?|||Việc 2 ngày của bạn tới sáng ngày 3 vẫn chưa xong. Tin nhắn nào đúng tinh thần hourensou?', [
    '"Almost done!"|||"Sắp xong rồi ạ!"',
    'Say nothing and work overnight to catch up|||Im lặng, thức đêm làm cho kịp',
    'New ETA, status, cause, impact, options with a recommendation, and a concrete request|||Ngày xong mới, hiện trạng, nguyên nhân, ảnh hưởng, phương án kèm đề xuất, và một đề nghị cụ thể',
    'Ask a colleague to finish it without telling the leader|||Nhờ đồng nghiệp làm nốt mà không báo leader',
  ], 2, 'Report (status), inform (cause, impact), consult (options) — as soon as you know. Lesson 9.7.|||Báo cáo (hiện trạng), liên lạc (nguyên nhân, ảnh hưởng), thảo luận (phương án) — ngay khi biết. Bài 9.7.'),
];

const BAI = (so, en, vi, slug, desc, L) => ({ title: `9.${so} — ${en}|||9.${so} — ${vi}`, slug, type: 'LESSON', isFreePreview: true, description: desc, content: hai(L) });

export default {
  title: 'Chapter 9 — How outsourcing projects really run|||Chương 9 — Quy trình dự án outsourcing trong thực tế',
  description: 'Ngày đầu OJT ở công ty outsourcing: hợp đồng và vai trò, V-model ngày thường, đọc BD/DD Excel, test spec + evidence, Q&A list và CR, ước lượng man-day, báo cáo ngày và hourensou — kèm 5 mẫu Excel và một lab trọn ticket.',
  lessons: [
    BAI(1, 'Contract models and roles: ODC, fixed price, T&M, onsite/offshore, BrSE', 'Mô hình hợp đồng và vai trò: ODC, trọn gói, T&M, onsite/offshore, BrSE', 'agl-9-1-mo-hinh-hop-dong',
      'Trọn gói (請負) / T&M (準委任) / ODC (labo) đổi gì trong việc của dev; onsite/offshore; PM, BrSE, comtor, QA, tester; vì sao "thêm một nút" phải qua Q&A/CR; vụ Suruga Bank v. IBM (2012–2013).', L91),
    BAI(2, 'The lifecycle in practice: V-model on Japanese projects, hybrid Agile', 'Vòng đời dự án thực tế: V-model ở dự án Nhật, Agile lai', 'agl-9-2-vong-doi-v-model',
      'RD → BD → DD → code → UT → IT → ST → UAT với tên tiếng Nhật và tài liệu ra ở mỗi bước; "xong" = tự kiểm + biên bản review + baseline; CMMI 5 mức; sprint trong chữ V.', L92),
    BAI(3, 'Reading basic and detailed design documents (BD/DD) in Excel', 'Đọc tài liệu thiết kế cơ bản và chi tiết (BD/DD) dạng Excel', 'agl-9-3-tai-lieu-bd-dd',
      'DD mẫu đủ 6 sheet (tải Excel), đọc sáu lượt theo mã, từ vựng tiếng Nhật, bẫy "50 ký tự" NFC/NFD đo thật, mã giữ ID tài liệu, lab liệt kê việc + chỗ mơ hồ, góc hacker mass assignment.', L93),
    BAI(4, 'Test specifications and test cases in Excel: columns, evidence, UT checklists', 'Test spec và test case dạng Excel: các cột, evidence, checklist UT', 'agl-9-4-test-spec',
      '12 cột test case, Pass/Fail/Blocked/N/A, rút case từ DD, chạy thật 2 vòng (19/20 → sửa BUG-001 → 20/20), evidence curl, báo cáo test COUNTIF + mật độ, checklist UT, lab 15 case.', L94),
    BAI(5, 'The Q&A list and change requests', 'Q&A list với khách và change request (CR)', 'agl-9-5-qa-cr',
      'Quy trình và 14 cột Q&A (tải Excel), câu hỏi đóng có đề xuất, trạng thái và đóng, khi nào thành CR + bản ghi CR, vụ Asahikawa v. NTT East (2017), góc hacker giả danh khách.', L95),
    BAI(6, 'Estimating in man-days: WBS, buffer, three-point estimates and risk', 'Ước lượng bằng man-day: WBS, dự phòng, ước lượng ba điểm và rủi ro', 'agl-9-6-uoc-luong-man-day',
      'MD/MM, man-day vs story point, WBS đủ test/evidence/review, PERT ba điểm (bảng tính 9 MD), mô phỏng 100.000 lần: cộng số khả dĩ chỉ 1,8 % kịp, nón bất định, Brooks, lab CRUD 4 màn.', L96),
    BAI(7, 'Daily/weekly reports and hourensou: report, inform, consult — and handling slippage', 'Báo cáo ngày/tuần và hourensou (báo cáo, liên lạc, thảo luận) — và xử lý khi trễ', 'agl-9-7-bao-cao-hourensou',
      'Hourensou 報連相, kết luận trước, mẫu daily report (tải Excel), hội chứng 90 %, git log làm nháp, báo cáo tuần, tin nhắn báo trễ 5 phần, đường báo cáo lên.', L97),
    BAI(8, 'Lab: one ticket the outsourcing way, from DD to daily report', 'Lab: một ticket theo quy trình outsourcing, từ DD tới báo cáo ngày', 'agl-9-8-lab',
      'Màn hình đặt lịch khám mới: 6 sản phẩm (danh sách việc, Q&A, ước lượng, code + test, test spec + evidence, 2 báo cáo ngày), rubric 100 điểm, đáp án chạy thật 16/16.', L98),
    {
      title: '9.9 — Chapter 9 quiz|||9.9 — Kiểm tra Chương 9',
      slug: 'agl-9-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: hợp đồng trọn gói/T&M, V-model, NFC/NFD, kết quả mong đợi, Blocked, Q&A tốt, khi nào là CR, PERT, hourensou khi trễ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions drawn from the situations in this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu lấy từ chính các tình huống trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ9 },
    },
  ],
};
