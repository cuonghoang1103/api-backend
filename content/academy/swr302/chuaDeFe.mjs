/**
 * SWR302 · Chữa trọn đề FE (trắc nghiệm) — mục VIDEO riêng, tách khỏi mục PE (luật chủ kênh 25/10/2026:
 * ~/Documents/video-bai-giang/LUAT-VIDEO-CHUA-DE.md). Mỗi đề = MỘT bài VIDEO dài: 4 phần ~15 câu (swr-fe27-1..4) ghép bằng
 * xuat/ghep-phan.mts ⇒ thư mục `-tron`, có mốc "Phần k — câu a–b".
 * Đề: content/exams/SWR302-FE27.mjs (FE27-SP26) — 60 câu · 60 phút · thang 10 · đạt ≥ 5.
 * Video gắn qua content/course-videos/software-requirements.mjs (track VI/R2, slug `swr302-fe27-sp26-chua-tron-de`).
 * Mốc thời gian = mo-ta-chuong.txt của bản ghép; thống kê chương = cảnh "thống kê" cuối phần 4.
 * Mục này đặt CUỐI danh sách section của SWR302.mjs (exam_chapter_map lưu sortOrder — chèn giữa làm lệch chương câu FE).
 */

const LINK = (slug) => `/courses/software-requirements/learn?lessonSlug=${slug}`;

const fe = ({ so, ky, dai, moc, chuong, chuongEn, luuY, luuYEn, onLai, meo, meoEn }) => ({
  title: `FE review · Exam ${so} (${ky}) — full walkthrough, 60 questions|||Chữa trọn đề FE${so} (${ky}) · 60 câu`,
  slug: `swr302-fe${so}-sp26-chua-tron-de`,
  type: 'VIDEO',
  description: `Chữa trọn đề thi cuối kỳ SWR302 số ${so} (${ky}): 60 câu trắc nghiệm đúng thứ tự Phòng thi, mỗi câu có ảnh đề gốc, dịch tiếng Việt, từ vựng, vì sao từng đáp án sai/đúng và nhãn chương. Video ${dai}, 4 phần có mốc.`,
  content: `
<div class="ml-en">
<span class="eyebrow">FE review · real exam, added by this site</span>
<h2>FE exam ${so} (${ky}) — all 60 questions</h2>
<p class="lead">A full walkthrough of SWR302 Final Exam paper ${so} from <b>${ky}</b>: 60 multiple-choice questions, 60 minutes, marked out of 10 (pass ≥ 5). Questions go in exam-room order; each one shows the original question image, a Vietnamese translation, 2–4 key terms, why every option is right or wrong, and the chapter it belongs to. Video length ${dai}.</p>
<h3>Chapters in the video</h3>
<ul>${moc.map(([t, a, b], i) => `<li><b>${t}</b> — Part ${i + 1}: questions ${a}–${b}</li>`).join('')}</ul>
<h3>Questions per chapter</h3>
<ul>${chuongEn.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Watch out</h3>
<ul>${luuYEn.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Review these lessons for the weak spots</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${LINK(s)}">${t.split('|||')[0]}</a></li>`).join('')}</ul>
<div class="callout">How to study: when a question appears, <b>pause</b>, choose your answer, then listen. ${meoEn} Then redo the whole paper timed in the <a href="/exam?course=SWR302">Exam room</a> → SWR302 → <b>Final Exam Đề ${so} (${ky})</b>.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chữa đề FE · đề thật, phần web tự thêm</span>
<h2>Chữa trọn đề FE${so} (${ky}) — đủ 60 câu</h2>
<p class="lead">Chữa trọn đề thi cuối kỳ SWR302 số ${so}, kỳ <b>${ky}</b>: 60 câu trắc nghiệm, 60 phút, thang 10 (đạt ≥ 5). Đi đúng thứ tự Phòng thi; mỗi câu: ảnh đề gốc, dịch tiếng Việt, 2–4 từ vựng cần nhớ, vì sao từng đáp án sai/đúng, và nhãn chương của câu. Video dài ${dai}.</p>
<h3>Các mốc trong video</h3>
<ul>${moc.map(([t, a, b], i) => `<li><b>${t}</b> — Phần ${i + 1}: câu ${a}–${b}</li>`).join('')}</ul>
<h3>Số câu theo chương</h3>
<ul>${chuong.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Cần để ý</h3>
<ul>${luuY.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Ôn lại bài cho các lỗ hổng</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${LINK(s)}">${t.split('|||')[1]}</a></li>`).join('')}</ul>
<div class="callout">Cách học: đề hiện lên thì <b>bấm dừng</b>, tự chọn đáp án, rồi mới nghe lời giải. ${meo} Xong video, làm lại cả đề có bấm giờ trong <a href="/exam?course=SWR302">Phòng thi</a> → SWR302 → <b>Đề thi cuối kỳ số ${so} (${ky})</b>.</div>
</div>`,
});

const L = {
  uc: ['swr302-4-1-use-case-user-story', 'SWR302 4.1 — Use cases & user stories|||SWR302 4.1 — Use case & user story'],
  dfd: ['swr302-4-2-domain-model-dfd', 'SWR302 4.2 — Domain model, DFD & data dictionary|||SWR302 4.2 — Domain model, DFD & từ điển dữ liệu'],
  usage: ['swr302-4-3-ch8-usage-centric', 'SWR302 4.3 — Usage-centric elicitation (book Ch.8)|||SWR302 4.3 — Khai thác hướng sử dụng (sách Ch.8)'],
  srs: ['swr302-5-1-srs-ieee-830', 'SWR302 5.1 — The SRS & IEEE 830|||SWR302 5.1 — Tài liệu SRS & IEEE 830'],
  srsLabel: ['swr302-5-2-ch10-srs-labeling', 'SWR302 5.2 — SRS structure & labelling requirements|||SWR302 5.2 — Cấu trúc SRS & đánh nhãn yêu cầu'],
  br: ['swr302-9r-1-ch9-taxonomy', 'SWR302 9R.1 — Business rules taxonomy|||SWR302 9R.1 — Phân loại business rule'],
  ba: ['swr302-4b-1-ch4-role-tasks', 'SWR302 4B.1 — The business analyst: role & tasks|||SWR302 4B.1 — BA: vai trò & nhiệm vụ'],
  vision: ['swr302-5v-1-ch5-business-req-vision', 'SWR302 5V.1 — Business requirements & the product vision|||SWR302 5V.1 — Yêu cầu nghiệp vụ & tầm nhìn sản phẩm'],
  gp: ['swr302-3g-2-ch3-elicitation', 'SWR302 3G.2 — Good practices for elicitation (book Ch.3)|||SWR302 3G.2 — Thực hành tốt cho khai thác (sách Ch.3)'],
  insp: ['swr302-6-2-ch17-inspection', 'SWR302 6.2 — Inspections & reviews (book Ch.17)|||SWR302 6.2 — Inspection & review (sách Ch.17)'],
  cc: ['swr302-7-1-change-control', 'SWR302 7.1 — Baselines & change control|||SWR302 7.1 — Baseline & kiểm soát thay đổi'],
  proto: ['swr302-8-3-ch15-types', 'SWR302 8.3 — Prototype types (book Ch.15)|||SWR302 8.3 — Các loại prototype (sách Ch.15)'],
  prio: ['swr302-10-3-ch16-why-techniques', 'SWR302 10.3 — Prioritization techniques (book Ch.16)|||SWR302 10.3 — Kỹ thuật ưu tiên (sách Ch.16)'],
};

const lessons = [
  fe({
    so: 27, ky: 'SP26', dai: '1 giờ 4 phút',
    moc: [['0:00', 1, 15], ['17:12', 16, 30], ['33:00', 31, 45], ['48:00', 46, 60]],
    chuong: [
      'Ch4 Phân tích & mô hình hoá 11 · Ch5 Đặc tả SRS & chất lượng 9 · nhóm Thực hành tốt / BA / Vision & Scope / Tiếng nói người dùng 9 · Ch3 Khai thác 4 · Business rules 3 · Ch6 Thẩm định 3 · Ch7 Quản lý yêu cầu 3 · Ch8 Prototyping 3 · Ch10 Ưu tiên 3 · Ch1 2 · Ch2 2 · Ch9 Agile 1 · các chương sách 18–32 (tái dùng, ngoài phát triển, nâng cấp, COTS, cải tiến, rủi ro) 7',
      'Chương 4 và Chương 5 chiếm 20/60 câu ⇒ ôn hai chương này trước.',
    ],
    chuongEn: [
      'Ch4 Analysis & modeling 11 · Ch5 SRS & quality 9 · Good practices / BA / Vision & Scope / Voice of the user 9 · Ch3 Elicitation 4 · Business rules 3 · Ch6 Validation 3 · Ch7 Requirements management 3 · Ch8 Prototyping 3 · Ch10 Prioritization 3 · Ch1 2 · Ch2 2 · Ch9 Agile 1 · book chapters 18–32 (reuse, beyond RD, enhancement, COTS, improvement, risk) 7',
      'Chapters 4 and 5 make up 20 of the 60 questions — review them first.',
    ],
    luuY: [
      'Câu 52 ("không phải hoạt động khai thác yêu cầu") chọn <b>D</b> theo bảng thực hành tốt Ch.3 của sách — các đề cũ cùng câu chấm lệch nhau (Đề 9, 11 chọn A; Đề 21, 24 chọn D).',
      'Câu 17 (bẫy use case) chọn <b>A</b>: không phương án nào chép nguyên văn danh sách "use case traps" của sách, A là phương án đúng nhất. Câu 38 chọn <b>C</b>: ưu tiên giúp kiểm soát scope creep (D có phần đúng) nhưng lợi ích cốt lõi là C.',
      'Câu 57 của đề gốc in lặp lại câu 56 — video chỉ nhắc, không giảng lại.',
      'Mười câu chọn nhiều đáp án và câu 3, câu 7 có tới đáp án F — đọc hết các phương án và đếm đúng số đáp án cần chọn.',
    ],
    luuYEn: [
      'Q52 ("not an elicitation activity") = <b>D</b>, following the book’s Ch.3 good-practice table — older papers with the same question disagree (papers 9 and 11 say A; papers 21 and 24 say D).',
      'Q17 (use case traps) = <b>A</b>: no option quotes the book’s "use case traps" list word for word, A is the best fit. Q38 = <b>C</b>: prioritization does help control scope creep (D is partly true) but the core benefit is C.',
      'Q57 of the original paper repeats Q56 — the video only points this out.',
      'Ten questions take several answers and Q3/Q7 go up to option F — read every option and count how many you must tick.',
    ],
    onLai: [L.uc, L.dfd, L.usage, L.srs, L.srsLabel, L.br, L.ba, L.vision, L.gp, L.insp, L.cc, L.proto, L.prio],
    meo: 'Đề hay hỏi đúng các danh sách của sách (loại business rule, đặc tính yêu cầu tốt, loại prototype, kỹ thuật ưu tiên) — thuộc các danh sách này là chắc điểm.',
    meoEn: 'The paper keeps asking for the book’s lists (business rule types, characteristics of good requirements, prototype types, prioritization techniques) — knowing these lists is sure marks.',
  }),
];

export default {
  title: '🎬 FE review — real final exams, fully solved on video|||🎬 Chữa trọn đề FE — đề trắc nghiệm thật, chữa từng câu bằng video',
  description: 'Mục video tự thêm, tách riêng khỏi mục PE: mỗi đề FE thật (60 câu, 60 phút) là một video dài chữa đủ 60 câu đúng thứ tự Phòng thi — ảnh đề gốc, dịch, từ vựng, từng đáp án, nhãn chương, mốc "Phần k — câu a–b" và thống kê chương. Đề mới nhất trước: FE27 (SP26).',
  lessons,
};
