/**
 * SWT301 · Chữa trọn đề FE (trắc nghiệm) — mục VIDEO riêng, tách khỏi mục PE (luật chủ kênh 25/10/2026:
 * ~/Documents/video-bai-giang/LUAT-VIDEO-CHUA-DE.md). Mỗi đề = MỘT bài VIDEO dài: 4 phần ~15 câu (swt-feK-1..4) ghép bằng
 * xuat/ghep-phan.mts ⇒ thư mục `-tron`, có mốc "Phần k — câu a–b".
 * Đề: content/exams/SWT301-FE1.mjs (FE1-SP26-RE) · SWT301-FE2.mjs (FE2-SP26-FE) — 60 câu · 60 phút · thang 10 · đạt ≥ 5.
 * Video gắn qua content/course-videos/software-testing.mjs (track VI/R2, slug `swt301-feK-sp26-chua-tron-de`).
 * Mốc thời gian = mo-ta-chuong.txt của bản ghép; thống kê chương = cảnh "thống kê" cuối phần 4 mỗi đề.
 */

const LINK = (slug) => `/courses/software-testing/learn?lessonSlug=${slug}`;

const fe = ({ so, ky, dai, moc, chuong, chuongEn, luuY, luuYEn, onLai, meo, meoEn }) => ({
  title: `FE review · Exam ${so} (${ky}) — full walkthrough, 60 questions|||Chữa trọn đề FE${so} (${ky}) · 60 câu`,
  slug: `swt301-fe${so}-sp26-chua-tron-de`,
  type: 'VIDEO',
  description: `Chữa trọn đề thi cuối kỳ SWT301 số ${so} (${ky}): 60 câu trắc nghiệm đúng thứ tự Phòng thi, mỗi câu có ảnh đề gốc, dịch tiếng Việt, từ vựng, vì sao từng đáp án sai/đúng và nhãn chương. Video ${dai}, 4 phần có mốc.`,
  content: `
<div class="ml-en">
<span class="eyebrow">FE review · real exam, added by this site</span>
<h2>FE exam ${so} (${ky}) — all 60 questions</h2>
<p class="lead">A full walkthrough of SWT301 Final Exam paper ${so} from <b>${ky}</b>: 60 multiple-choice questions, 60 minutes, marked out of 10 (pass ≥ 5). Questions go in exam-room order; each one shows the original question image, a Vietnamese translation, 2–4 key terms, why every option is right or wrong, and the chapter it belongs to. Questions that need a calculation are worked step by step. Video length ${dai}.</p>
<h3>Chapters in the video</h3>
<ul>${moc.map(([t, a, b], i) => `<li><b>${t}</b> — Part ${i + 1}: questions ${a}–${b}</li>`).join('')}</ul>
<h3>Questions per chapter</h3>
<ul>${chuongEn.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Watch out</h3>
<ul>${luuYEn.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Review these lessons for the weak spots</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${LINK(s)}">${t.split('|||')[0]}</a></li>`).join('')}</ul>
<div class="callout">How to study: when a question appears, <b>pause</b>, choose your answer, then listen. ${meoEn} Then redo the whole paper timed in the <a href="/exam?course=SWT301">Exam room</a> → SWT301 → <b>Final Exam Đề ${so} (${ky})</b>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chữa đề FE · đề thật, phần web tự thêm</span>
<h2>Chữa trọn đề FE${so} (${ky}) — đủ 60 câu</h2>
<p class="lead">Chữa trọn đề thi cuối kỳ SWT301 số ${so}, kỳ <b>${ky}</b>: 60 câu trắc nghiệm, 60 phút, thang 10 (đạt ≥ 5). Đi đúng thứ tự Phòng thi; mỗi câu: ảnh đề gốc, dịch tiếng Việt, 2–4 từ vựng cần nhớ, vì sao từng đáp án sai/đúng, và nhãn chương của câu. Câu phải tính thì tính từng bước. Video dài ${dai}.</p>
<h3>Các mốc trong video</h3>
<ul>${moc.map(([t, a, b], i) => `<li><b>${t}</b> — Phần ${i + 1}: câu ${a}–${b}</li>`).join('')}</ul>
<h3>Số câu theo chương</h3>
<ul>${chuong.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Cần để ý</h3>
<ul>${luuY.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Ôn lại bài cho các lỗ hổng</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${LINK(s)}">${t.split('|||')[1]}</a></li>`).join('')}</ul>
<div class="callout">Cách học: đề hiện lên thì <b>bấm dừng</b>, tự chọn đáp án, rồi mới nghe lời giải. ${meo} Xong video, làm lại cả đề có bấm giờ trong <a href="/exam?course=SWT301">Phòng thi</a> → SWT301 → <b>Đề thi cuối kỳ số ${so} (${ky})</b>.</div>
</div>`,
});

const L = {
  c11: ['swt301-fundamentals-principles', 'SWT301 1.1 — What is testing? Objectives, testing vs debugging|||SWT301 1.1 — Kiểm thử là gì? Mục tiêu, testing vs debugging'],
  c14: ['swt301-test-process', 'SWT301 1.4 — The test process: activities, work products & traceability|||SWT301 1.4 — Quy trình test: hoạt động, work product & truy vết'],
  c25: ['swt301-maintenance-test-plan', 'SWT301 2.5 — Maintenance testing, impact analysis & the IEEE 829 test plan|||SWT301 2.5 — Kiểm thử bảo trì, phân tích tác động & test plan IEEE 829'],
  c32: ['swt301-static-reviews', 'SWT301 3.2 — The review process: activities, roles & responsibilities|||SWT301 3.2 — Quy trình review: hoạt động, vai trò & trách nhiệm'],
  c33: ['swt301-review-types-techniques', 'SWT301 3.3 — Review types & techniques|||SWT301 3.3 — Các loại review & kỹ thuật review'],
  c34: ['swt301-static-analysis', 'SWT301 3.4 — Static analysis: data flow, control flow, cyclomatic complexity|||SWT301 3.4 — Phân tích tĩnh: luồng dữ liệu, luồng điều khiển, độ phức tạp cyclomatic'],
  c42: ['swt301-blackbox-ep-bva', 'SWT301 4.2 — Equivalence partitioning|||SWT301 4.2 — Phân vùng tương đương'],
  c43: ['swt301-blackbox-bva-template', 'SWT301 4.3 — Boundary value analysis|||SWT301 4.3 — Phân tích giá trị biên'],
  c51: ['swt301-whitebox-coverage', 'SWT301 5.1 — Statement & decision coverage|||SWT301 5.1 — Phủ câu lệnh & phủ quyết định'],
  c72: ['swt301-test-plan-risk', 'SWT301 7.2 — Test planning, strategies & estimation|||SWT301 7.2 — Lập kế hoạch test, chiến lược & ước lượng'],
  c73: ['swt301-test-monitoring-control', 'SWT301 7.3 — Test monitoring & control|||SWT301 7.3 — Giám sát & kiểm soát test'],
  c74: ['swt301-configuration-management', 'SWT301 7.4 — Configuration management|||SWT301 7.4 — Quản lý cấu hình'],
  c82: ['swt301-tools-by-activity', 'SWT301 8.2 — Tool support for each test activity|||SWT301 8.2 — Công cụ cho từng hoạt động test'],
  c83: ['swt301-tools-benefits-risks', 'SWT301 8.3 — Benefits & risks of automation, capture/replay|||SWT301 8.3 — Lợi ích & rủi ro tự động hoá, ghi–phát lại'],
  c84: ['swt301-tools-selection-pilot', 'SWT301 8.4 — Tool selection & the pilot project|||SWT301 8.4 — Chọn công cụ & dự án thí điểm'],
};

const lessons = [
  fe({
    so: 1, ky: 'SP26 RE', dai: '1 giờ 3 phút',
    moc: [['0:00', 1, 15], ['15:20', 16, 30], ['30:14', 31, 45], ['46:42', 46, 60]],
    chuong: [
      'Ch1 Nền tảng kiểm thử 14 · Ch2 Kiểm thử xuyên suốt SDLC 9 · Ch3 Kiểm thử tĩnh 11 · Ch4 Black-box 6 · Ch5 White-box 3 · Ch6 Dựa kinh nghiệm 1 · Ch7 Quản lý test 8 · Ch8 Công cụ & tự động hoá 8 · Ch9 Agile 0',
      'Chương 1 và Chương 3 chiếm 25/60 câu (hơn 4 phần 10 đề) ⇒ ôn hai chương này trước.',
    ],
    chuongEn: [
      'Ch1 Fundamentals 14 · Ch2 Testing throughout the SDLC 9 · Ch3 Static testing 11 · Ch4 Black-box 6 · Ch5 White-box 3 · Ch6 Experience-based 1 · Ch7 Test management 8 · Ch8 Tools & automation 8 · Ch9 Agile 0',
      'Chapters 1 and 3 make up 25 of the 60 questions — review them first.',
    ],
    luuY: [
      'Phần 3 (câu 31–45) có bốn câu phải tính: phân vùng tương đương, giá trị biên, độ phủ nhánh — dừng video, vẽ trục số ra giấy trước rồi mới nghe lời giải.',
      'Bốn câu nguồn đề chấm lệch ISTQB, Phòng thi đã sửa và video dạy theo đáp án đúng: câu 19 chọn B (chỉ ii), câu 47 chọn False (định nghĩa đó là QC), câu 49 chọn B (chỉ i), câu 53 chọn Recovery testing.',
      'Ba ý cần nhớ: review tìm defect ở mọi sản phẩm, QA lo quy trình còn QC soi sản phẩm · công cụ test không tự sinh kết quả mong đợi, và luôn thí điểm với nhóm nhỏ trước · quản lý cấu hình: identification, control, status accounting.',
    ],
    luuYEn: [
      'Part 3 (questions 31–45) has four calculation questions — equivalence partitioning, boundary values, branch coverage: pause and draw the number line before listening.',
      'Four questions were graded against ISTQB in the source bank; the Exam room has been corrected and the video teaches the right answer: Q19 = B (ii only), Q47 = False (that definition is QC), Q49 = B (i only), Q53 = Recovery testing.',
      'Three ideas to keep: reviews find defects in any work product, QA is about the process while QC inspects the product · tools do not generate expected results by themselves, and always start with a small pilot · configuration management: identification, control, status accounting.',
    ],
    onLai: [L.c14, L.c11, L.c32, L.c33, L.c42, L.c43, L.c51, L.c74, L.c84],
    meo: 'Câu tính toán (EP, BVA, độ phủ) là câu chắc điểm nếu làm đúng — luyện tay đến khi không cần nghe lời giải.',
    meoEn: 'The calculation questions (EP, BVA, coverage) are sure marks once you get them right — practise until you no longer need the explanation.',
  }),
  fe({
    so: 2, ky: 'SP26 FE', dai: '1 giờ 6 phút',
    moc: [['0:00', 1, 15], ['18:13', 16, 30], ['33:36', 31, 45], ['49:38', 46, 60]],
    chuong: [
      'Ch1 Nền tảng kiểm thử 13 · Ch3 Kiểm thử tĩnh 13 · Ch7 Quản lý test 8 · Ch8 Công cụ & tự động hoá 8 · Ch2 Kiểm thử xuyên suốt SDLC 7 · Ch4 Black-box 7 · Ch5 White-box 2 · Ch6 Dựa kinh nghiệm 2 · Ch9 Agile 0',
      'Đề toàn lý thuyết: chỉ một câu đọc sơ đồ, không có câu tính toán.',
    ],
    chuongEn: [
      'Ch1 Fundamentals 13 · Ch3 Static testing 13 · Ch7 Test management 8 · Ch8 Tools & automation 8 · Ch2 Testing throughout the SDLC 7 · Ch4 Black-box 7 · Ch5 White-box 2 · Ch6 Experience-based 2 · Ch9 Agile 0',
      'All theory: one diagram question, no calculation questions.',
    ],
    luuY: [
      'Không có câu chọn hai đáp án, nhưng có sáu câu năm đáp án (A–E) và hai câu đúng/sai — đừng quen tay chỉ nhìn bốn đáp án.',
      'Hai câu nguồn đề chấm lệch, Phòng thi đã sửa theo ISTQB và đa số đề: câu 4 chọn <b>IEEE</b> (FE3 · FE9 · FE24 cùng câu đều chấm IEEE), câu 9 chọn <b>requirements</b> — lỗi ở yêu cầu sửa đắt nhất (FE3 · FE7 · FE15).',
      'Đề hay lặp một ý mà đổi vỏ: câu 24 ↔ 53, câu 46 ↔ 60 (rò rỉ bộ nhớ ⇒ dynamic analysis), câu 54 ↔ 58 (hồi quy ⇒ ghi–phát lại). Đọc kỹ chữ bẫy: NOT, EXCEPT, least likely, only, most.',
      'Lỗ hổng nên ôn theo thứ tự: loại review và vai trò (Ch3) · quy trình test và tài liệu IEEE 829 (Ch1, Ch2) · công cụ tĩnh/động, ghi–phát lại, quản lý test (Ch8) · test plan, quản lý cấu hình, theo dõi tiến độ (Ch7).',
    ],
    luuYEn: [
      'No "choose two" questions, but six questions have five options (A–E) and two are true/false — do not stop reading at option D.',
      'Two questions were mis-graded in the source bank; the Exam room now follows ISTQB and most other papers: Q4 = <b>IEEE</b> (FE3 · FE9 · FE24 grade the same question IEEE), Q9 = <b>requirements</b> — defects in requirements are the most expensive to fix (FE3 · FE7 · FE15).',
      'The paper repeats ideas in new wording: Q24 ↔ Q53, Q46 ↔ Q60 (memory leak ⇒ dynamic analysis), Q54 ↔ Q58 (regression ⇒ capture/replay). Watch the trap words: NOT, EXCEPT, least likely, only, most.',
      'Weak spots in order: review types and roles (Ch3) · the test process and IEEE 829 documents (Ch1, Ch2) · static/dynamic tools, capture/replay, test management tools (Ch8) · test plan, configuration management, progress monitoring (Ch7).',
    ],
    onLai: [L.c32, L.c33, L.c34, L.c14, L.c25, L.c82, L.c83, L.c72, L.c73, L.c74],
    meo: 'Câu nhiều ý (i, ii, iii…) thì xét đúng/sai từng ý trước, rồi mới so với các đáp án.',
    meoEn: 'For questions with several statements (i, ii, iii…), judge each statement first, then match the options.',
  }),
];

export default {
  title: '🎬 FE review — real final exams, fully solved on video|||🎬 Chữa trọn đề FE — đề trắc nghiệm thật, chữa từng câu bằng video',
  description: 'Mục video tự thêm, tách riêng khỏi mục PE: mỗi đề FE thật (60 câu, 60 phút) là một video dài chữa đủ 60 câu đúng thứ tự Phòng thi — ảnh đề gốc, dịch, từ vựng, từng đáp án, nhãn chương, mốc "Phần k — câu a–b" và thống kê chương. Đề mới nhất trước: FE1 (SP26 RE), FE2 (SP26 FE).',
  lessons,
};
