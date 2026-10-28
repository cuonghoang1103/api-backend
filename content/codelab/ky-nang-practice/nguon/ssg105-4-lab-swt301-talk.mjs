/**
 * Kỹ năng nghề · 🎤 Bài lớn chương 4 — "Bản in": kịch bản 3 phút THẬT cho buổi trình bày SWT301 Lab 2+3 (T5 29/10/2026)
 * + 2 câu trả lời PREP + ghi âm & rubric tự chấm 10 tiêu chí.
 * Số liệu: ~/Documents/SWT301-SportShop/bao-cao/ON-TAP-REVIEW.md (Lab 2: 113 UTCID 93P/20F 82,3%, C0 99,3% C1 93,5%;
 * Lab 3: 22 ca 16P/6F 72,7%, 3 round; IT17 = SS-28 UpdateProfileServlet.java:77 + UserDAO WHERE USER_name; IT05 = SS-22 "Sport@1").
 * Máy chấm chỉ kiểm CẤU TRÚC/độ dài/số liệu — ghi rõ trong đề (LUU_Y).
 */
import { moDun, kiemVB, LUU_Y, TN } from './_chung.mjs';

const DAU = `// SWT301 Lab 2+3 — your 3-minute talk. English or Vietnamese, your choice.
// Write each block inside the backticks (no backtick or \${ in your text).
// 130 words per minute ⇒ the whole TALK must be 250–390 words.

const TALK = {
  hook: ´´,      // a problem, a number or a question — NOT "Good morning, my name is…"
  context: ´´,   // SportShop + which module is yours (1–2 sentences)
  work: ´´,      // Lab 2 (unit, Mockito) and Lab 3 (integration, Postman/Newman, rounds)
  results: ´´,   // the numbers: pass/fail, %, coverage, rounds
  bug: ´´,       // ONE defect: ticket id, what the user sees, the cause, the case that proves it
  lessons: ´´,   // 2–3 lessons tied to your evidence
  close: ´´,     // one-sentence takeaway, then invite questions
};

// Two questions the teacher is likely to ask, answered with PREP.
const QA = [
  { question: '', point: '', reason: '', example: '', pointAgain: '' },
  { question: '', point: '', reason: '', example: '', pointAgain: '' },
];

// Record yourself once (phone voice memo is fine), then fill this HONESTLY.
const REHEARSAL = {
  recordedSeconds: 0, // real duration of your recording
  rubric: {
    opensWithProblem: null,     // 1. I open with a problem/number/question, not a greeting
    oneIdeaPerSlide: null,      // 2. each slide has one message and an assertion headline
    numbersHaveSource: null,    // 3. every number can be found in Report 5.1 / 5.2
    showsEvidence: null,        // 4. I show evidence (file:line, case id, report) — not only claims
    eyeContact: null,           // 5. I look at the audience, not at the slide
    clearPace: null,            // 6. pace is clear (I can hear every number in the recording)
    within15s: null,            // 7. the recording is 3:00 ± 15 s
    answersQuestionFirst: null, // 8. in Q&A my first sentence answers the question
    honestIDontKnow: null,      // 9. I have my "I haven't checked that yet, I will…" sentence ready
    endsWithLesson: null,       // 10. I end with the takeaway, not "that's all"
  },
};
`;

const GIAI = `// SWT301 Lab 2+3 — model 3-minute talk (SportShop, module A). Numbers from Report 5.1 / 5.2 (run 28/10/2026).

const TALK = {
  hook: ´With one read-only field changed in the browser, any logged-in user could change another account’s password. Our integration tests caught it — ticket SS-28.´,
  context: ´SportShop is a Java Servlet and JSP shop on Tomcat 10 with SQL Server. I own module A: login, register, profile, change password, AuthFilter and UserDAO — nine classes.´,
  work: ´In Lab 2 I wrote 113 unit tests with JUnit 5 and Mockito, with no database at all. In Lab 3 I ran 22 integration cases through the real API with Postman and Newman, on a test database that is reset before every case, in three rounds.´,
  results: ´Unit level: 93 pass and 20 fail, a successful coverage of 82.3%, with 99.3% line and 93.5% branch coverage. Integration level: 16 pass and 6 fail out of 22, 72.7%, identical in all 3 rounds. Identical rounds on a freshly loaded database mean the fails are reproducible defects, not flaky tests.´,
  bug: ´The worst one is SS-28. UpdateProfileServlet line 77 takes the username from the form, and UserDAO updates the account WHERE USER_name = ?, so the name inside the request decides whose password changes. IT17 proves it with a SELECT on the database before and after the request.´,
  lessons: ´Three lessons. Expected results come from the requirement, so we never edit an expected value to match buggy code. Validate on the server: IT05 stored the 7-character password Sport@1 sent directly to /signup. And take the identity from the session, never from a form field.´,
  close: ´So every one of our 26 fails is a real defect with a ticket, and SS-28 should be fixed first. I am happy to take questions.´,
};

const QA = [
  {
    question: 'So many tests fail — are your tests wrong?',
    point: 'No — each fail is a real defect in SportShop, not a test mistake.',
    reason: 'Expected results come from the requirements, and we never change an expected value to match buggy code.',
    example: 'IT10 fails because AuthFilter.java line 45 calls getRole() on a null account — ticket SS-19.',
    pointAgain: 'So the 6 integration fails are 6 tickets for the developers.',
  },
  {
    question: 'Why are all three rounds 16 pass / 6 fail?',
    point: 'Because the code did not change between rounds — our job was to find and report defects, not to fix them.',
    reason: 'Round 2 re-ran after the bugs were logged, and round 3 re-ran on a freshly loaded database.',
    example: 'Round 3 on the reset SportShop_Test database gave the same 16 / 6, so dirty data is not the cause.',
    pointAgain: 'Three equal rounds show reliable tests, not copied results.',
  },
];

const REHEARSAL = {
  recordedSeconds: 172, // example value — put YOUR real recording time here
  rubric: {
    opensWithProblem: true, oneIdeaPerSlide: true, numbersHaveSource: true, showsEvidence: true, eyeContact: true,
    clearPace: true, within15s: true, answersQuestionFirst: true, honestIDontKnow: true, endsWithLesson: true,
  },
};
`;

const BAN_IN = {
  tieuDe: 'Capstone — Your 3-Minute SWT301 Lab 2+3 Talk',
  phu: { en: 'Presentation &amp; defence · SportShop module A · script + 2 PREP answers + one recorded rehearsal · 10 marks (structural grading + self-rubric)', vi: 'Thuyết trình &amp; bảo vệ · SportShop module A · kịch bản + 2 câu trả lời PREP + một lần ghi âm tập · 10 điểm (máy chấm cấu trúc + rubric tự chấm)' },
  moTa: {
    en: `<p>On Thursday you present SWT301 Lab 2 (unit testing, Report 5.1) and Lab 3 (integration testing, Report 5.2) for module A of SportShop. This capstone turns everything in chapter 4 into the real artefact: a <b>3-minute script</b> written block by block, <b>two PREP answers</b> for the questions the teacher is most likely to ask, and <b>one recorded rehearsal</b> with an honest self-assessment.</p>
<p>Your real numbers (Report 5.1 / 5.2, run of 28/10): unit 113 cases, 93 pass / 20 fail (82.3%), line coverage 99.3%, branch 93.5%; integration 22 cases, 16 pass / 6 fail (72.7%) in all 3 rounds; tickets SS-19, SS-22, SS-23, SS-27, SS-28, SS-31 (+ SS-32, SS-33 found in Lab 4).</p>
<p><b>What the grader can and cannot do.</b> It checks structure, length, numbers, banned words and that your rehearsal data is filled in. It cannot hear you or judge whether the story is convincing — that is what the recording and the 10-criterion self-rubric are for. AI grading against the rubric is not available yet.</p>`,
    vi: `<p>Thứ Năm bạn trình bày SWT301 Lab 2 (unit test, Report 5.1) và Lab 3 (integration test, Report 5.2) cho module A SportShop. Bài lớn này biến cả chương 4 thành sản phẩm thật: <b>kịch bản 3 phút</b> viết theo từng khối, <b>hai câu trả lời PREP</b> cho câu cô dễ hỏi nhất, và <b>một lần ghi âm tập</b> kèm tự chấm trung thực.</p>
<p>Số liệu thật (Report 5.1 / 5.2, lần chạy 28/10): unit 113 ca, 93 đạt / 20 fail (82,3%), độ phủ dòng 99,3%, nhánh 93,5%; integration 22 ca, 16 đạt / 6 fail (72,7%) cả 3 round; thẻ SS-19, SS-22, SS-23, SS-27, SS-28, SS-31 (+ SS-32, SS-33 thấy ở Lab 4).</p>
<p><b>Máy chấm làm được gì và không.</b> Nó kiểm cấu trúc, độ dài, số liệu, từ cấm và việc bạn đã điền dữ liệu buổi tập. Nó không nghe được giọng bạn và không đánh giá được câu chuyện có thuyết phục không — việc đó là của bản ghi âm và rubric 10 tiêu chí. Chưa có chấm bằng AI theo rubric.</p>`,
  },
  chucNangChinh: [
    { en: 'TALK: seven blocks — hook, context, work, results, bug, lessons, close.', vi: 'TALK: bảy khối — mở, bối cảnh, làm gì, kết quả, lỗi, bài học, chốt.' },
    { en: 'QA: two likely questions answered as Point → Reason → Example → Point.', vi: 'QA: hai câu hỏi dễ gặp, trả lời theo Ý chính → Lý do → Ví dụ → Chốt.' },
    { en: 'REHEARSAL: the real duration of one recorded run + the 10-criterion self-rubric.', vi: 'REHEARSAL: thời lượng thật của một lần ghi âm + rubric tự chấm 10 tiêu chí.' },
  ],
  yeuCauChung: [
    LUU_Y,
    { en: 'English or Vietnamese — words are counted as whitespace-separated tokens (a Vietnamese syllable counts as one word).', vi: 'Tiếng Anh hay tiếng Việt đều được — từ được đếm theo token cách nhau bởi khoảng trắng (mỗi tiếng Việt tính một từ).' },
    { en: 'Use only real numbers from your reports; the grader looks for the Lab 2 and Lab 3 results.', vi: 'Chỉ dùng số thật từ báo cáo; máy chấm tìm kết quả Lab 2 và Lab 3.' },
    { en: 'Then: say it aloud three times with a timer, record the third run, play it back once at 1× speed.', vi: 'Sau đó: nói to ba lần có bấm giờ, ghi âm lần thứ ba, nghe lại một lần ở tốc độ 1×.' },
  ],
  cayThuMuc: `talk.js
├── TALK        ← { hook, context, work, results, bug, lessons, close }   (strings)
├── QA          ← [ { question, point, reason, example, pointAgain }, … ] (≥ 2)
└── REHEARSAL   ← { recordedSeconds, rubric: { 10 criteria: true | false } }`,
  moHinh: {
    ten: 'talk.js — the three constants',
    truong: [
      ['TALK.<block>', 'string', { en: 'each block ≥ 10 words; total 250–390 words', vi: 'mỗi khối ≥ 10 từ; tổng 250–390 từ' }],
      ['QA[i]', '{ question, point, reason, example, pointAgain }', { en: 'point ≤ 25 words; example carries evidence (a number, a ticket, a file)', vi: 'point ≤ 25 từ; example mang bằng chứng (số, mã lỗi, tên tệp)' }],
      ['REHEARSAL.recordedSeconds', 'number', { en: 'real duration of your recording, 165–195 s (3:00 ± 15 s)', vi: 'thời lượng thật bản ghi, 165–195 giây (3:00 ± 15 giây)' }],
      ['REHEARSAL.rubric.<criterion>', 'boolean', { en: 'all 10 answered true or false — honesty is the point', vi: 'cả 10 tiêu chí trả lời true hoặc false — trung thực mới có ích' }],
    ],
  },
  duLieuMau: `TALK.results = ´Unit level: 93 pass and 20 fail, 82.3% … Integration level: 16 pass and 6 fail out of 22, 72.7% …´
QA[0] = { question: 'So many tests fail — are your tests wrong?',
          point: 'No — each fail is a real defect, not a test mistake.', reason: '…',
          example: 'IT10 fails because AuthFilter.java line 45 … — ticket SS-19.', pointAgain: '…' }`,
  chucNang: [
    {
      ten: { en: 'Structure and hook', vi: 'Cấu trúc và câu mở' }, diem: 2,
      yeuCau: [
        { en: 'All seven blocks are filled, each at least 10 words.', vi: 'Đủ bảy khối, mỗi khối ít nhất 10 từ.' },
        { en: 'The hook contains a number or a question and is not a greeting / “my name is”.', vi: 'Câu mở có số hoặc câu hỏi, không phải lời chào / "em tên là".' },
      ],
      hook: ['hook → context → work → results → bug → lessons → close'],
    },
    {
      ten: { en: 'Timing and balance', vi: 'Thời lượng và cân đối' }, diem: 2,
      yeuCau: [
        { en: 'Whole TALK 250–390 words (≈ 2–3 minutes at 130 wpm).', vi: 'Cả TALK 250–390 từ (≈ 2–3 phút ở 130 từ/phút).' },
        { en: 'No block above 35% of the words; results + bug together at least 25%.', vi: 'Không khối nào quá 35% số từ; kết quả + lỗi cộng lại ít nhất 25%.' },
      ],
      hook: ['130 words per minute'],
    },
    {
      ten: { en: 'Numbers and evidence', vi: 'Số liệu và bằng chứng' }, diem: 2,
      yeuCau: [
        { en: 'results has ≥ 4 numbers and mentions Lab 2 (93 and 20 or 82.3%) and Lab 3 (16 and 22 or 72.7%).', vi: 'results có ≥ 4 con số, nêu Lab 2 (93 và 20 hoặc 82.3%) và Lab 3 (16 và 22 hoặc 72.7%).' },
        { en: 'bug names a real ticket (SS-19, 22, 23, 27, 28, 31, 32, 33) and gives its cause (because / so / due to / vì / do…).', vi: 'bug nêu một thẻ lỗi thật (SS-19, 22, 23, 27, 28, 31, 32, 33) và nguyên nhân (because / so / due to / vì / do…).' },
      ],
    },
    {
      ten: { en: 'Close and clean language', vi: 'Câu chốt và ngôn ngữ sạch' }, diem: 1.5,
      yeuCau: [
        { en: 'close carries a takeaway of ≥ 8 words besides thanks/questions, and is not “that’s all / em xin hết”.', vi: 'close mang điều mang về ≥ 8 từ ngoài lời cảm ơn/mời hỏi, không phải "that\'s all / em xin hết".' },
        { en: 'No filler and no vague words anywhere in TALK.', vi: 'Không từ đệm, không từ mơ hồ trong cả TALK.' },
      ],
    },
    {
      ten: { en: 'Q&A with PREP', vi: 'Hỏi đáp theo PREP' }, diem: 1.5,
      yeuCau: [
        { en: 'At least 2 answers, all five fields filled.', vi: 'Ít nhất 2 câu trả lời, đủ năm trường.' },
        { en: 'Each point ≤ 25 words; each example contains a number, a ticket or a file name.', vi: 'Mỗi point ≤ 25 từ; mỗi example có số, mã lỗi hoặc tên tệp.' },
      ],
      hook: ['PREP'],
    },
    {
      ten: { en: 'Recorded rehearsal + self-rubric', vi: 'Ghi âm tập + rubric tự chấm' }, diem: 1,
      yeuCau: [
        { en: 'recordedSeconds is the real duration of your recording: 165–195 s.', vi: 'recordedSeconds là thời lượng thật bản ghi: 165–195 giây.' },
        { en: 'All 10 rubric criteria answered true or false.', vi: 'Cả 10 tiêu chí rubric được trả lời true hoặc false.' },
      ],
    },
  ],
  truDiem: [
    { en: 'Numbers that do not match Report 5.1 / 5.2 (the grader checks presence, the teacher checks truth).', vi: 'Số không khớp Report 5.1 / 5.2 (máy chấm kiểm có mặt, cô kiểm đúng sai).' },
    { en: 'Reading the script from the screen — the script is for rehearsal, the talk is from memory + slides.', vi: 'Đọc kịch bản trên màn hình — kịch bản để tập, lúc nói dựa vào trí nhớ + slide.' },
    { en: 'Ticking every rubric item “true” without recording — you only cheat your own rehearsal.', vi: 'Tích "true" hết rubric mà không ghi âm — chỉ tự lừa buổi tập của mình.' },
  ],
  nopBai: { en: 'Submit talk.js. Keep the recording on your phone; listen to it once more on the morning of the talk.', vi: 'Nộp talk.js. Giữ bản ghi âm trong điện thoại; nghe lại một lần vào sáng hôm trình bày.' },
};

const KIEM = [
  kiemVB({ en: 'Structure: all seven blocks filled (≥ 10 words each)', vi: 'Cấu trúc: đủ bảy khối (mỗi khối ≥ 10 từ)' }, () => { const ks = ['hook', 'context', 'work', 'results', 'bug', 'lessons', 'close']; const thieu = ks.filter((k) => __V.w(TALK[k]) < 10); return thieu.length ? 'too short or empty: ' + thieu.map((k) => k + ' (' + __V.w(TALK[k]) + ' words)').join(', ') : 'OK'; }, { nhom: 'f1' }),
  kiemVB({ en: 'Hook: a number or a question, not a greeting', vi: 'Câu mở: có số hoặc câu hỏi, không phải lời chào' }, () => { const h = __V.s(TALK.hook); if (!h.trim()) return 'hook is empty'; if (__V.chao(h)) return 'the hook is a greeting/name'; return /\d|\?/.test(h) ? 'OK' : 'the hook has no number and no question'; }, { nhom: 'f1' }),
  kiemVB({ en: 'Timing: whole talk 250–390 words', vi: 'Thời lượng: cả bài 250–390 từ' }, () => { const n = ['hook', 'context', 'work', 'results', 'bug', 'lessons', 'close'].reduce((s, k) => s + __V.w(TALK[k]), 0); return n >= 250 && n <= 390 ? 'OK' : n + ' words ≈ ' + Math.round(n / 130 * 60) + ' s — need 250–390'; }, { nhom: 'f2' }),
  kiemVB({ en: 'Balance: no block > 35%, results + bug ≥ 25%', vi: 'Cân đối: không khối nào > 35%, kết quả + lỗi ≥ 25%' }, () => { const ks = ['hook', 'context', 'work', 'results', 'bug', 'lessons', 'close']; const n = ks.reduce((s, k) => s + __V.w(TALK[k]), 0); if (!n) return 'TALK is empty'; const to = ks.filter((k) => __V.w(TALK[k]) / n > 0.35); if (to.length) return 'block too long: ' + to.join(', '); const rb = (__V.w(TALK.results) + __V.w(TALK.bug)) / n; return rb >= 0.25 ? 'OK' : 'results + bug are only ' + Math.round(rb * 100) + '% of the talk'; }, { nhom: 'f2' }),
  kiemVB({ en: 'Results mention Lab 2 and Lab 3 numbers (≥ 4 numbers)', vi: 'Kết quả nêu số Lab 2 và Lab 3 (≥ 4 con số)' }, () => { const r = TALK.results; const co = (x) => __V.coTu(r, [x]).length > 0; const so = __V.nums(r).length; if (so < 4) return 'only ' + so + ' numbers in results'; const lab2 = co('93') && (co('20') || co('82.3%') || co('82,3%')); const lab3 = co('16') && (co('22') || co('72.7%') || co('72,7%')); return lab2 && lab3 ? 'OK' : (lab2 ? '' : 'Lab 2 result (93 + 20 or 82.3%) missing. ') + (lab3 ? '' : 'Lab 3 result (16 + 22 or 72.7%) missing.'); }, { nhom: 'f3' }),
  kiemVB({ en: 'Bug: a real ticket and its cause', vi: 'Lỗi: một thẻ thật và nguyên nhân' }, () => { const b = __V.s(TALK.bug); const the = (b.match(/SS-\d+/gi) || []).map((x) => x.toUpperCase()); const that = ['SS-19', 'SS-22', 'SS-23', 'SS-27', 'SS-28', 'SS-31', 'SS-32', 'SS-33']; if (!the.length) return 'no ticket id (SS-xx) in bug'; const la = the.filter((x) => that.indexOf(x) < 0); if (la.length) return 'not one of your tickets: ' + la.join(', '); return __V.coTu(b, ['because', 'so', 'since', 'due to', 'which means', 'vì', 'do', 'bởi vì', 'nên', 'dẫn tới']).length ? 'OK' : 'say WHY it happens (because / so / vì / do…)'; }, { nhom: 'f3' }),
  kiemVB({ en: 'Close: a takeaway, not “that’s all”', vi: 'Câu chốt: có điều mang về, không phải "that\'s all"' }, () => { const c = __V.s(TALK.close); if (/that['’]?s all|xin hết/i.test(c)) return 'the close says “that’s all / xin hết”'; const bo = c.replace(/thank(s| you)[^.!?]*[.!?]?/gi, '').replace(/[^.!?]*(happy to take questions|any questions|questions\?)[^.!?]*[.!?]?/gi, '').replace(/(em xin )?cảm ơn[^.!?]*[.!?]?/gi, '').replace(/[^.!?]*(mời|xin mời)[^.!?]*câu hỏi[^.!?]*[.!?]?/gi, ''); return __V.w(bo) >= 8 ? 'OK' : 'besides thanks/questions the close has only ' + __V.w(bo) + ' words — add the takeaway'; }, { nhom: 'f4' }),
  kiemVB({ en: 'Clean language: no fillers, no vague words', vi: 'Ngôn ngữ sạch: không từ đệm, không từ mơ hồ' }, () => { const t = ['hook', 'context', 'work', 'results', 'bug', 'lessons', 'close'].map((k) => __V.s(TALK[k])).join(' \n '); const f = __V.filler(t).concat(__V.vague(t)); return f.length ? 'remove: ' + f.join(', ') : 'OK'; }, { nhom: 'f4' }),
  kiemVB({ en: 'Q&A: ≥ 2 PREP answers with all five fields', vi: 'Hỏi đáp: ≥ 2 câu PREP đủ năm trường' }, () => { if (!Array.isArray(QA) || QA.length < 2) return 'QA needs at least 2 answers'; const f = ['question', 'point', 'reason', 'example', 'pointAgain']; for (let i = 0; i < QA.length; i++) { const t = f.filter((k) => !__V.s(QA[i] && QA[i][k]).trim()); if (t.length) return 'QA[' + i + '] missing: ' + t.join(', '); } return 'OK'; }, { nhom: 'f5' }),
  kiemVB({ en: 'Q&A: short points (≤ 25 words), examples with evidence', vi: 'Hỏi đáp: point ngắn (≤ 25 từ), example có bằng chứng' }, () => { if (!Array.isArray(QA) || QA.length < 2) return 'QA needs at least 2 answers'; for (let i = 0; i < QA.length; i++) { const q = QA[i] || {}; if (__V.w(q.point) > 25) return 'QA[' + i + '].point has ' + __V.w(q.point) + ' words'; if (!/\d|SS-\d+|\.(java|jsp|xlsx|html|log|txt|json)\b/i.test(__V.s(q.example))) return 'QA[' + i + '].example has no number, ticket or file'; } return 'OK'; }, { nhom: 'f5' }),
  kiemVB({ en: 'Rehearsal: recorded duration 165–195 s', vi: 'Buổi tập: bản ghi dài 165–195 giây' }, () => { const s = REHEARSAL && REHEARSAL.recordedSeconds; if (typeof s !== 'number' || !s) return 'record yourself and enter the real duration in seconds'; return s >= 165 && s <= 195 ? 'OK' : s + ' s — aim for 3:00 ± 15 s, cut or slow down and record again'; }, { nhom: 'f6' }),
  kiemVB({ en: 'Self-rubric: all 10 criteria answered', vi: 'Rubric tự chấm: trả lời đủ 10 tiêu chí' }, () => { const r = (REHEARSAL && REHEARSAL.rubric) || {}; const ks = ['opensWithProblem', 'oneIdeaPerSlide', 'numbersHaveSource', 'showsEvidence', 'eyeContact', 'clearPace', 'within15s', 'answersQuestionFirst', 'honestIDontKnow', 'endsWithLesson']; const chua = ks.filter((k) => typeof r[k] !== 'boolean'); return chua.length ? 'answer true/false: ' + chua.join(', ') : 'OK'; }, { nhom: 'f6' }),
];

export default moDun({
  slug: 'ssg105-4-lab-swt301-talk',
  ten: 'Capstone 4 — Your 3-minute SWT301 Lab 2+3 talk (script + PREP + recording)',
  moTaModule: 'Bài lớn chương 4 (bản in): kịch bản 3 phút THẬT cho buổi trình bày SWT301 Lab 2+3 SportShop — bảy khối, 250–390 từ, số Lab 2/Lab 3, một thẻ lỗi kèm nguyên nhân, câu chốt — cộng 2 câu trả lời PREP và một lần ghi âm với rubric tự chấm 10 tiêu chí. Máy chấm kiểm cấu trúc, không chấm được lập luận.',
  baiHoc: 'ssg105-4-1-presentation',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Capstone 4 — Your 3-minute SWT301 Lab 2+3 talk',
    doKho: 'HARD', phut: 90, diem: 50,
    ngonNgu: 'javascript',
    viDu: [{ input: 'TALK.hook = ´Good morning teacher, my name is Cuong.´', output: '✗ Hook: a number or a question, not a greeting', explanation: 'Open with the problem: “With one read-only field changed in the browser, any user could change another account’s password.”|||Mở bằng vấn đề: "Chỉ cần sửa một ô chỉ-đọc trên trình duyệt, bất kỳ ai cũng đổi được mật khẩu tài khoản khác."' }],
    khaiNiem: ['talk script', 'PREP', 'rehearsal', 'self-assessment'],
    tienQuyet: ['4.1 A 3-minute technical talk', '4.4 Defence and Q&A', '4.5 Script and clock'],
    the: ['swt301', 'presentation', 'capstone'],
    banIn: BAN_IN,
    thuatNgu: [TN.hook, TN.prep, TN.takeaway, TN.wpm, TN.evidence, { en: 'rubric', vi: 'bảng tiêu chí chấm' }, { en: 'rehearsal', vi: 'buổi tập nói thử' }],
    goiY: [
      'Viết khối results và bug TRƯỚC (đó là phần được chấm), rồi mới viết hook — hook thường là câu bug nén lại.',
      'Đếm từ bằng talkStats của bài 4.5; > 390 thì cắt context/work trước, không cắt số liệu.',
      'Câu hỏi PREP dễ gặp nhất: "nhiều test fail thế, test có sai không?" và "sao 3 round giống nhau?" — câu trả lời mẫu ở bài 4.4.',
      'Ghi âm bằng điện thoại; dài hơn 195 giây ⇒ cắt 30–40 từ rồi ghi lại.',
    ],
    loiHayGap: [
      'Mở bằng "Em xin chào cô và các bạn, em tên là…" — mất 10 giây vàng.',
      'Khối results chỉ có phần trăm, không có số đếm 93/113, 16/22 — cô không đối chiếu được với Report.',
      'Tích hết rubric "true" mà chưa ghi âm — máy không biết, nhưng thứ Năm cả lớp sẽ biết.',
      'Kể ba lỗi lướt qua thay vì một lỗi có nguyên nhân + bằng chứng.',
    ],
    moTaNgan: 'Bài lớn: kịch bản 3 phút SWT301 Lab 2+3 + 2 câu PREP + ghi âm, rubric tự chấm 10 tiêu chí.',
    giaiThich: {
      en: `<p>The model talk is 265 words (≈ 2 minutes at 130 wpm; pauses for slides and the demo fill the rest of the 3-minute slot). It opens with SS-28 as a one-sentence story, spends the middle on the numbers of both labs, explains ONE bug with file, line and the case that proves it, turns the evidence into three lessons, and closes on a priority (fix SS-28 first) before inviting questions.</p>
<p>The two PREP answers are the questions committees ask most about failing tests and identical rounds. The rehearsal block is deliberately not something a machine can verify: the point of the exercise is that you <b>did</b> record yourself, listened, and fixed what you heard.</p>`,
      vi: `<p>Bài nói mẫu 265 từ (≈ 2 phút ở 130 từ/phút; ngắt nghỉ cho slide và demo lấp phần còn lại của 3 phút). Mở bằng SS-28 kể trong một câu, phần giữa là số liệu của cả hai lab, giải thích MỘT lỗi kèm tệp, dòng và ca chứng minh, biến bằng chứng thành ba bài học, kết bằng một ưu tiên (sửa SS-28 trước) rồi mời hỏi.</p>
<p>Bản tiếng Việt tham khảo (nếu bạn nói tiếng Việt): "Chỉ cần sửa một ô chỉ-đọc trên trình duyệt, bất kỳ người dùng đã đăng nhập nào cũng đổi được mật khẩu của tài khoản khác — test tích hợp của em bắt được lỗi này, thẻ SS-28. … Unit: 113 ca, 93 đạt, 20 fail, 82,3%; độ phủ dòng 99,3%, nhánh 93,5%. Tích hợp: 22 ca, 16 đạt, 6 fail, 72,7%, giống hệt cả 3 round trên CSDL nạp lại … Vậy 26 ca fail đều là lỗi thật có thẻ, và SS-28 cần sửa trước. Em xin nghe câu hỏi của cô."</p>
<p>Phần ghi âm cố ý là thứ máy không kiểm được: mục đích là bạn <b>đã</b> tự ghi, nghe lại, và sửa điều mình nghe thấy.</p>`,
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['talk.js'], kiem: KIEM },
    khoiDau: { 'talk.js': DAU },
    loiGiai: { 'talk.js': GIAI },
    boYeu: [
      { ten: 'mở bằng lời chào', tep: { 'talk.js': GIAI.replace("hook: ´With one read-only field", "hook: ´Good morning teacher, my name is Cuong. With one read-only field") }, phaiTruot: ['Hook'] },
      { ten: 'kết quả chỉ có phần trăm, không có số Lab 3', tep: { 'talk.js': GIAI.replace('Integration level: 16 pass and 6 fail out of 22, 72.7%, identical in all 3 rounds.', 'Integration level: identical in every round.') }, phaiTruot: ['Results mention'] },
      { ten: 'kết bằng "That\'s all"', tep: { 'talk.js': GIAI.replace("close: ´So every one of our 26 fails is a real defect with a ticket, and SS-28 should be fixed first. I am happy to take questions.´", "close: ´That’s all for my part. Thank you very much for listening, everyone.´") }, phaiTruot: ['Close'] },
      { ten: 'chưa ghi âm (0 giây)', tep: { 'talk.js': GIAI.replace('recordedSeconds: 172', 'recordedSeconds: 0') }, phaiTruot: ['Rehearsal'] },
      { ten: 'dùng thẻ lỗi bịa', tep: { 'talk.js': GIAI.replace('The worst one is SS-28.', 'The worst one is SS-99.') }, phaiTruot: ['Bug'] },
    ],
  }],
});
