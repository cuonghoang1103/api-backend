/**
 * SWR302 · 5.5 — Avoiding ambiguity (Wiegers Ch.11 slides 21–30: ambiguous terms, boundary values, negatives, omissions).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Ambiguity 1 — spot the ambiguous term',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers Table 11-2 lists words that make requirements ambiguous: <i>acceptable, adequate, and/or, as much as practicable, at least / at most, between, depends on, efficient, fast, flexible, improved, including, maximize / minimize, optimal, normally, reasonable, robust, seamless, several, shouldn’t, state-of-the-art, sufficient, support, user-friendly</i>. For each requirement, pick the ambiguous term.</p>', vi: '<p>Bảng 11-2 của Wiegers liệt kê các từ làm yêu cầu mơ hồ. Với mỗi yêu cầu, chọn từ mơ hồ.</p>' },
  cot: 'Ambiguous term', luaChon: ['and/or', 'between', 'support', 'several', 'normally', 'robust', 'including', 'minimize'],
  hang: [
    ['The system shall e-mail and/or text the student when a grade is posted.', 'and/or'],
    ['A class shall have between 10 and 40 students.', 'between'],
    ['The system shall support PDF submissions.', 'support'],
    ['The lecturer shall be able to attach several files to an announcement.', 'several'],
    ['Grades are normally published within 7 days.', 'normally'],
    ['The upload service shall be robust.', 'robust'],
    ['Reports shall show course data, including the attendance rate.', 'including'],
    ['The system shall minimize the number of clicks to submit an assignment.', 'minimize'],
  ],
  giaiThich: '<p>Fix: "and/or" ⇒ state which; "between 10 and 40" ⇒ say if 10 and 40 are included; "support" ⇒ the concrete action (upload, preview, convert…); "several" ⇒ a number; "normally" ⇒ what happens in the abnormal case; "robust" ⇒ recovery behaviour; "including" ⇒ the complete list; "minimize" ⇒ a target number.</p>',
  goiY: ['Từ mơ hồ là từ mỗi người đọc hiểu một kiểu.', '"between" mơ hồ vì không rõ có tính hai đầu mút không.'],
  loiHayGap: ['Cho rằng "support" là động từ rõ nghĩa.', 'Bỏ qua "including" — danh sách không đầy đủ.'],
  thuatNgu: tn('ambiguous'),
  khaiNiem: ['ambiguous terms'],
});

const E2 = tracNghiem({
  tieuDe: 'Ambiguity 2 — boundary values',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Wiegers’ example: "vacation requests of up to 5 days do not need approval; requests of 5 to 10 days need supervisor approval; more than 10 days need management approval". Which rule applies to exactly 5 days? Boundaries must not overlap or leave gaps.</p>', vi: '<p>Ví dụ của Wiegers về nghỉ phép: "tới 5 ngày không cần duyệt; 5 tới 10 ngày cần trưởng nhóm; trên 10 ngày cần ban giám đốc". Đúng 5 ngày thì theo luật nào? Biên không được chồng lấn hay bỏ trống.</p>' },
  cau: [
    { en: 'In the original wording, 5 days falls into…', vi: 'Với cách viết gốc, 5 ngày rơi vào…', lc: [['a', 'only the first rule'], ['b', 'both the first and the second rule — overlap'], ['c', 'no rule — gap'], ['d', 'the third rule']], dap: 'b', giai: ['"up to 5" and "5 to 10" both include 5.', '"tới 5" và "5 tới 10" đều chứa 5.'] },
    { en: 'Which rewrite is unambiguous?', vi: 'Cách viết lại nào không mơ hồ?', lc: [['a', '≤ 5 days: none; 6–10 days: supervisor; > 10 days: management (whole days)'], ['b', '< 5: none; > 5 and < 10: supervisor; > 10: management'], ['c', 'Short: none; medium: supervisor; long: management'], ['d', '0–5: none; 5–10: supervisor; 10+: management']], dap: 'a', giai: ['Every whole number falls into exactly one rule.', 'Mỗi số nguyên rơi đúng vào một luật.'] },
    { en: 'The rewrite "< 5: none; > 5 and < 10: supervisor; > 10: management" leaves which values uncovered?', vi: 'Cách viết "< 5: không; > 5 và < 10: trưởng nhóm; > 10: ban giám đốc" bỏ sót giá trị nào?', lc: [['a', 'None'], ['b', 'Exactly 5 and exactly 10'], ['c', 'Only 0'], ['d', 'Only 11']], dap: 'b', giai: ['Strict inequalities on both sides create gaps.', 'Bất đẳng thức nghiêm ngặt hai phía tạo khoảng trống.'] },
  ],
  goiY: ['Thử đúng các giá trị biên: 5, 10.', 'Mỗi giá trị phải rơi vào ĐÚNG MỘT luật.'],
  loiHayGap: ['Viết "5–10" và "10+" — 10 rơi vào hai luật.', 'Dùng "<" hai phía làm hở biên.'],
  giaiThich: '<p>Answers: b · a · b.</p>',
  thuatNgu: [{ en: 'boundary value', vi: 'giá trị biên' }],
  khaiNiem: ['boundary values'],
});

const E3 = tracNghiem({
  tieuDe: 'Ambiguity 3 — negatives, omissions and "and/or" logic',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Other sources of ambiguity: negative requirements ("shall not"), implied conditions, missing else-branches (what if the condition is false?), and combining <i>and</i>/<i>or</i> without parentheses.</p>', vi: '<p>Các nguồn mơ hồ khác: yêu cầu phủ định, điều kiện ngầm, thiếu nhánh "nếu không thì", và trộn <i>and</i>/<i>or</i> không có ngoặc.</p>' },
  cau: [
    { en: '"If the payment succeeds, the system shall confirm the order." What is missing?', vi: '"Nếu thanh toán thành công, hệ thống xác nhận đơn." Thiếu gì?', lc: [['a', 'Nothing'], ['b', 'What the system does when the payment fails'], ['c', 'The colour of the button'], ['d', 'The database name']], dap: 'b', giai: ['Always specify the else-branch.', 'Luôn đặc tả nhánh còn lại.'] },
    { en: '"Students who are enrolled and have paid or have a scholarship may register." How many readings?', vi: '"Students who are enrolled and have paid or have a scholarship may register." Mấy cách hiểu?', lc: [['a', 'One'], ['b', 'Two: enrolled AND (paid OR scholarship), or (enrolled AND paid) OR scholarship'], ['c', 'Three'], ['d', 'None']], dap: 'b', giai: ['Use parentheses, a list or a decision table.', 'Dùng ngoặc, danh sách hoặc bảng quyết định.'] },
    { en: '"The system shall not allow a user to delete a course." The better form is…', vi: '"The system shall not allow a user to delete a course." Dạng tốt hơn là…', lc: [['a', '"Only an administrator shall be able to delete a course." — positive, names who CAN'], ['b', 'Delete the requirement'], ['c', '"Deleting courses is bad."'], ['d', 'Keep it — negatives are best']], dap: 'a', giai: ['A positive statement says who may do it.', 'Câu khẳng định nói ai được phép.'] },
  ],
  goiY: ['Mỗi "if" cần một "else".', 'Trộn and/or ⇒ thêm ngoặc hoặc bảng quyết định.'],
  loiHayGap: ['Quên nhánh thất bại.', 'Để nguyên câu trộn and/or.'],
  giaiThich: '<p>Answers: b · b · a.</p>',
  thuatNgu: tn('ambiguous', 'decisionTable'),
  khaiNiem: ['ambiguity: logic and omissions'],
});

const E4 = baiJs({
  tieuDe: 'Ambiguity 4 — make the late-submission rule unambiguous',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>The draft rule says: "Assignments submitted slightly late lose some marks; very late ones get zero." The lecturer clarified: up to and including 24 hours late ⇒ minus 10%; more than 24 and up to and including 72 hours ⇒ minus 30%; more than 72 hours ⇒ 0 marks; on time ⇒ no penalty. Write <code>function penalty(hoursLate)</code> returning the percentage deducted (0, 10, 30 or 100). <code>hoursLate</code> ≤ 0 means on time. Then write <code>RULE</code>: the requirement in one sentence per band, with no ambiguous words.</p>', vi: '<p>Luật nháp: "Nộp trễ một chút trừ ít điểm; trễ nhiều thì 0 điểm." Giảng viên làm rõ: trễ tới và bằng 24 giờ ⇒ trừ 10%; hơn 24 và tới bằng 72 giờ ⇒ trừ 30%; hơn 72 giờ ⇒ 0 điểm; đúng hạn ⇒ không trừ. Viết <code>penalty(hoursLate)</code> trả phần trăm bị trừ (0, 10, 30, 100). Rồi viết <code>RULE</code>: mỗi khoảng một câu, không có từ mơ hồ.</p>' },
  yeuCau: [{ en: 'penalty() correct at every boundary (0, 24, 72); RULE has 4 sentences, each with a number, without "slightly", "very", "some", "about".', vi: 'penalty() đúng tại mọi biên (0, 24, 72); RULE 4 câu, mỗi câu có số, không dùng "slightly/very/some/about".' }],
  viDu: [{ input: 'penalty(24)', output: '10', explanation: '24 h is in the first late band (inclusive).|||24 giờ thuộc khoảng trễ đầu (bao gồm).' }, { input: 'penalty(24.5)', output: '30', explanation: 'More than 24 h.|||Hơn 24 giờ.' }],
  tep: { 'rule.js': ["function penalty(hoursLate) {\n  // TODO\n  return 0;\n}\nconst RULE = [];\n", "function penalty(hoursLate) {\n  if (hoursLate <= 0) return 0;\n  if (hoursLate <= 24) return 10;\n  if (hoursLate <= 72) return 30;\n  return 100;\n}\nconst RULE = [\n  'The system shall apply no penalty to an assignment submitted on or before the deadline.',\n  'The system shall deduct 10% of the mark from an assignment submitted more than 0 and at most 24 hours after the deadline.',\n  'The system shall deduct 30% of the mark from an assignment submitted more than 24 and at most 72 hours after the deadline.',\n  'The system shall give 0 marks to an assignment submitted more than 72 hours after the deadline.',\n];\n"] },
  kiem: [
    kiemTuy({ en: 'penalty() is correct on time and at 24 h', vi: 'penalty() đúng khi đúng hạn và tại 24 giờ' }, function () {
      if (typeof penalty !== 'function') return 'penalty is not a function';
      var c = [[-5, 0], [0, 0], [0.1, 10], [24, 10]];
      for (var i = 0; i < c.length; i++) if (penalty(c[i][0]) !== c[i][1]) return 'penalty(' + c[i][0] + ') should be ' + c[i][1] + ', got ' + penalty(c[i][0]);
      return 'OK';
    }),
    kiemTuy({ en: 'penalty() is correct above 24 h and at 72 h', vi: 'penalty() đúng trên 24 giờ và tại 72 giờ' }, function () {
      if (typeof penalty !== 'function') return 'penalty is not a function';
      var c = [[24.01, 30], [48, 30], [72, 30], [72.01, 100], [500, 100]];
      for (var i = 0; i < c.length; i++) if (penalty(c[i][0]) !== c[i][1]) return 'penalty(' + c[i][0] + ') should be ' + c[i][1] + ', got ' + penalty(c[i][0]);
      return 'OK';
    }),
    kiemTuy({ en: 'RULE: 4 precise sentences, no vague words', vi: 'RULE: 4 câu chính xác, không từ mơ hồ' }, function () {
      if (typeof RULE === 'undefined' || !Array.isArray(RULE)) return 'RULE must be an array';
      if (RULE.length !== 4) return 'one sentence per band ⇒ 4 sentences';
      for (var i = 0; i < 4; i++) {
        var r = String(RULE[i]);
        if (!/^the system shall\b/i.test(r)) return 'RULE[' + i + ']: start with "The system shall"';
        if (/\b(slightly|very|some|about|approximately|around|a bit|reasonable)\b/i.test(r)) return 'RULE[' + i + '] still uses a vague word';
      }
      var t = RULE.join(' ');
      return /\b24\b/.test(t) && /\b72\b/.test(t) && /10\s*%/.test(t) && /30\s*%/.test(t) ? 'OK' : 'state the numbers 24, 72, 10% and 30%';
    }),
    kiemTuy({ en: 'RULE closes each boundary (at most / more than)', vi: 'RULE chốt từng biên (at most / more than)' }, function () {
      if (typeof RULE === 'undefined' || !Array.isArray(RULE)) return 'RULE must be an array';
      var t = RULE.join(' ').toLowerCase();
      if (/\bbetween\b/.test(t)) return '"between" leaves the endpoints unclear — use "more than … and at most …"';
      return /(at most|up to and including|or less|no more than|≤|<=)/.test(t) && /(more than|over|greater than|>)/.test(t) ? 'OK' : 'say whether 24 and 72 are included (e.g. "at most 24 hours", "more than 72 hours")';
    }),
  ],
  goiY: ['Thử chính các giá trị 0, 24, 72 và lân cận.', 'Dùng "at most" và "more than" để chốt biên, tránh "between".'],
  loiHayGap: ['Dùng `< 24` làm 24 giờ rơi sang khoảng 30%.', 'Viết "between 24 and 72 hours".'],
  giaiThich: '<p>Every value of hoursLate falls into exactly one band: ≤0, (0,24], (24,72], >72. The sentence form mirrors the code: "more than X and at most Y".</p>',
  thuatNgu: [{ en: 'boundary value', vi: 'giá trị biên' }, ...tn('ambiguous')],
  khaiNiem: ['boundary values'],
  boYeu: [{ ten: 'biên sai + between', tep: { 'rule.js': "function penalty(h){ if (h<=0) return 0; if (h<24) return 10; if (h<72) return 30; return 100; }\nconst RULE=['The system shall apply no penalty when on time.','The system shall deduct 10% when between 0 and 24 hours late.','The system shall deduct 30% when between 24 and 72 hours late.','The system shall give 0 marks when very late.'];\n" } }],
});

export default moDun({
  slug: 'swr302-5-6-ch11-ambiguity',
  ten: '5.6 Avoiding ambiguity',
  moTaModule: 'Từ mơ hồ (bảng 11-2), giá trị biên chồng lấn/bỏ trống, thiếu nhánh else, trộn and/or, câu phủ định; tự viết luật nộp trễ không mơ hồ và hàm penalty đúng mọi biên.',
  de: [E1, E2, E3, E4],
});
