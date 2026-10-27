/**
 * SWT301 · 1.3 — Seven testing principles (SWT1, LO-1.3.1 K2).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const NT = [
  '1. Testing shows the presence of defects, not their absence',
  '2. Exhaustive testing is impossible',
  '3. Early testing saves time and money',
  '4. Defects cluster together',
  '5. Beware of the pesticide paradox',
  '6. Testing is context dependent',
  '7. Absence-of-errors is a fallacy',
];

const E1 = tinhDe({
  tieuDe: 'Seven principles 1 — Which principle does each situation show?',
  doKho: 'EASY', phut: 8,
  moTa: { en: '<p>The seven ISTQB principles appear in almost every SWT301 exam as a short story: “a team did X — which principle?”. Match each LabBook story to exactly one principle. Every principle is used once.</p>', vi: '<p>Bảy nguyên tắc ISTQB xuất hiện trong gần như mọi đề SWT301 dưới dạng một câu chuyện ngắn: “nhóm đã làm X — nguyên tắc nào?”. Ghép mỗi câu chuyện LabBook với đúng một nguyên tắc. Mỗi nguyên tắc dùng đúng một lần.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Story → principle', 'Câu chuyện → nguyên tắc'),
    cot: [{ ma: 's', ten: 'Story' }, { ma: 'p', ten: 'Principle', luaChon: NT }],
    hang: [
      'The regression suite has run unchanged for five sprints and has not found a defect for three of them, yet users keep reporting bugs in new booking screens',
      '70% of last semester’s defects were found in the booking-conflict module, so the team plans extra tests there',
      'The booking form takes a date, a start hour, a duration and a lab — trying every combination would take years',
      'The release passed all 400 tests, but students refuse to use it because they still have to phone the lab manager to confirm',
      'Testers reviewed the user stories in sprint planning and found that “week” was undefined before any code was written',
      'The hospital lab-booking version needs audit trails and formal test documentation; the student club version does not',
      'After 300 passing tests the manager says “so there are no bugs left”; the test lead corrects him',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.p': NT[4], 'r1.p': NT[3], 'r2.p': NT[1], 'r3.p': NT[6], 'r4.p': NT[2], 'r5.p': NT[5], 'r6.p': NT[0] },
    giaiThich: giai('Unchanged tests stop finding new defects (pesticide paradox); defects concentrate in a few modules (clustering); combinations explode (exhaustive testing impossible); a defect-free system that does not meet the users’ needs is useless (absence-of-errors fallacy); reviewing stories early (early testing); safety-critical vs hobby context; passing tests reduce risk but cannot prove absence (principle 1).', 'Bộ test không đổi hết tìm được lỗi mới (thuốc trừ sâu); lỗi tập trung ở ít module (phân cụm); tổ hợp bùng nổ (không thể test hết); hệ thống không lỗi nhưng không đáp ứng nhu cầu là vô ích (ngụy biện không lỗi); review story sớm (test sớm); ngữ cảnh an toàn y tế vs câu lạc bộ; test đạt giảm rủi ro nhưng không chứng minh hết lỗi (nguyên tắc 1).'),
  }],
  goiY: ['Từ khoá: “unchanged / same tests” ⇒ pesticide; “most defects in one module” ⇒ clustering; “every combination” ⇒ exhaustive.', '“Không ai dùng dù hết lỗi” ⇒ absence-of-errors fallacy; “không còn lỗi nữa” ⇒ nguyên tắc 1.'],
  loiHayGap: ['Nhầm nguyên tắc 1 (test không chứng minh hết lỗi) với nguyên tắc 7 (hết lỗi vẫn có thể vô dụng).', 'Nhầm “test sớm” với “test theo ngữ cảnh” khi câu chuyện nhắc tới Agile.'],
  giaiThich: '<p>5 · 4 · 2 · 7 · 3 · 6 · 1.</p>',
  thuatNgu: [{ en: 'pesticide paradox', vi: 'nghịch lý thuốc trừ sâu — chạy mãi một bộ test thì không còn tìm ra lỗi mới' }, { en: 'defect clustering', vi: 'lỗi phân cụm — đa số lỗi nằm ở ít module' }, { en: 'exhaustive testing', vi: 'kiểm thử vét cạn — thử mọi tổ hợp đầu vào' }, { en: 'fallacy', vi: 'ngụy biện / niềm tin sai' }],
  khaiNiem: ['seven principles'],
});

const E2 = tinhDe({
  tieuDe: 'Seven principles 2 — Exam questions (K2)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six FE-style questions on the seven principles. Several distractors are true sentences that answer a different question — read the stem carefully.</p>', vi: '<p>Sáu câu kiểu FE về bảy nguyên tắc. Nhiều phương án nhiễu là câu đúng nhưng trả lời câu hỏi khác — đọc kỹ đề.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('How should a team respond to the pesticide paradox?', 'Nhóm nên phản ứng thế nào với nghịch lý thuốc trừ sâu?'), luaChon: lc(['a', 'Stop running regression tests'], ['b', 'Regularly review and revise existing tests and write new, different tests'], ['c', 'Run the same tests more often'], ['d', 'Automate all tests']), dapAn: ['b'], giaiThich: giai('Tests and test data must be changed and new tests written to exercise different parts of the software. Note: in automated regression, an unchanged suite finding nothing can be a GOOD outcome.', 'Phải sửa test và dữ liệu test, viết test mới để chạm phần khác. Lưu ý: với hồi quy tự động, bộ test không đổi mà không tìm ra lỗi có thể là kết quả TỐT.') },
    { ma: 'q2', de: hai('Instead of exhaustive testing, what should be used to focus test effort?', 'Thay vì test vét cạn, nên dùng gì để tập trung công sức test?'), luaChon: lc(['a', 'Random testing only'], ['b', 'Risk analysis, test techniques and priorities'], ['c', 'Testing only the user interface'], ['d', 'Doubling the number of testers']), dapAn: ['b'], giaiThich: giai('Exhaustive testing is impossible except in trivial cases; risk analysis, techniques and priorities focus effort.', 'Vét cạn bất khả thi trừ trường hợp tầm thường; phân tích rủi ro, kỹ thuật và ưu tiên giúp tập trung.') },
    { ma: 'q3', de: hai('Which principle is the reason testers should take part in requirement reviews?', 'Nguyên tắc nào là lý do tester nên tham gia review yêu cầu?'), luaChon: lc(['a', 'Defects cluster together'], ['b', 'Early testing saves time and money (shift left)'], ['c', 'Testing is context dependent'], ['d', 'Exhaustive testing is impossible']), dapAn: ['b'], giaiThich: giai('Removing defects early prevents derived defects later — this is “shift left”.', 'Gỡ lỗi sớm ngăn các lỗi phái sinh về sau — đó là “shift left”.') },
    { ma: 'q4', de: hai('How is defect clustering useful for test planning?', 'Phân cụm lỗi hữu ích thế nào cho lập kế hoạch test?'), luaChon: lc(['a', 'Predicted and observed clusters are an input to risk analysis to focus effort'], ['b', 'It means other modules need no testing'], ['c', 'It proves the code is of good quality'], ['d', 'It is only useful after release']), dapAn: ['a'], giaiThich: giai('Clusters feed risk-based testing; other modules still need testing.', 'Cụm lỗi là đầu vào cho test dựa trên rủi ro; module khác vẫn cần test.') },
    { ma: 'q5', de: hai('An e-commerce site and a pacemaker are tested differently. Which principle?', 'Trang thương mại điện tử và máy tạo nhịp tim được test khác nhau. Nguyên tắc nào?'), luaChon: lc(['a', 'Testing is context dependent'], ['b', 'Defects cluster together'], ['c', 'Absence-of-errors is a fallacy'], ['d', 'Pesticide paradox']), dapAn: ['a'], giaiThich: giai('Safety-critical software is tested differently from an e-commerce site; Agile differently from sequential.', 'Phần mềm an toàn sống còn được test khác trang TMĐT; Agile khác mô hình tuần tự.') },
    { ma: 'q6', de: hai('“Finding and fixing many defects guarantees a successful system” is wrong because…', '“Tìm và sửa thật nhiều lỗi bảo đảm hệ thống thành công” sai vì…'), luaChon: lc(['a', 'testing cannot find all defects'], ['b', 'a system can be defect-free yet unusable or not meet the users’ needs and expectations'], ['c', 'fixing defects introduces new ones'], ['d', 'it is right']), dapAn: ['b'], giaiThich: giai('Principle 7. (a) is true too but it answers principle 1/2, not this claim about success.', 'Nguyên tắc 7. (a) cũng đúng nhưng ứng với nguyên tắc 1/2, không phải nhận định về thành công.') },
  ],
  goiY: ['Tìm từ khoá trong đề, không chọn câu “nghe đúng”.', 'Nguyên tắc 7 nói về NHU CẦU người dùng, nguyên tắc 1 nói về CHỨNG MINH.'],
  loiHayGap: ['Chọn “dừng hồi quy” cho nghịch lý thuốc trừ sâu.', 'Chọn “không cần test module khác” cho phân cụm lỗi.'],
  giaiThich: '<p>Answers: b · b · b · a · a · b.</p>',
  thuatNgu: [{ en: 'shift left', vi: 'dịch trái — đưa hoạt động test lên sớm hơn trong vòng đời' }],
  khaiNiem: ['seven principles'],
});

/* E3 — defect clustering + exhaustive testing bằng số */
const E3 = jsDe({
  tieuDe: 'Seven principles 3 — Put numbers on clustering and exhaustive testing',
  doKho: 'MEDIUM', phut: 15,
  moTa: { en: `<p>Two principles become concrete when you compute them.</p>
<ol><li><b>Exhaustive testing is impossible.</b> Write <code>combinations(fields)</code>: <code>fields</code> is an array of how many distinct values each input field can take; return the number of input combinations (the product). An empty array means one combination (nothing to vary).</li>
<li><b>Defects cluster together.</b> Write <code>hotSpots(defectsByModule, share)</code>: <code>defectsByModule</code> is an object <code>{ module: count }</code>. Sort modules by count (descending; ties by module name A→Z) and return the <b>smallest prefix</b> of module names whose counts reach at least <code>share</code> (0–1) of all defects. If there are no defects return <code>[]</code>.</li></ol>
<p>Example from the LabBook defect log: <code>{ booking: 42, auth: 6, labs: 5, report: 4, ui: 3 }</code>, share 0.8 ⇒ <code>["booking", "auth"]</code> (48 of 60 = 80%).</p>`, vi: `<p>Hai nguyên tắc trở nên cụ thể khi bạn tính ra số.</p>
<ol><li><b>Không thể test vét cạn.</b> Viết <code>combinations(fields)</code>: <code>fields</code> là mảng số giá trị khác nhau mỗi trường nhập nhận được; trả số tổ hợp đầu vào (tích). Mảng rỗng ⇒ 1 tổ hợp.</li>
<li><b>Lỗi phân cụm.</b> Viết <code>hotSpots(defectsByModule, share)</code>: <code>defectsByModule</code> là object <code>{ module: số lỗi }</code>. Sắp module theo số lỗi giảm dần (bằng nhau thì theo tên A→Z) và trả <b>tiền tố ngắn nhất</b> các tên module có tổng lỗi đạt ít nhất <code>share</code> (0–1) tổng số lỗi. Không có lỗi ⇒ <code>[]</code>.</li></ol>
<p>Ví dụ từ nhật ký lỗi LabBook: <code>{ booking: 42, auth: 6, labs: 5, report: 4, ui: 3 }</code>, share 0.8 ⇒ <code>["booking", "auth"]</code> (48/60 = 80%).</p>` },
  yeuCau: [
    { en: '<code>combinations([31, 14, 4, 3])</code> — day of month, start hour 7–20, duration 1–4, lab — returns 5208.', vi: '<code>combinations([31, 14, 4, 3])</code> — ngày, giờ bắt đầu 7–20, thời lượng 1–4, phòng lab — trả 5208.' },
    { en: '<code>hotSpots</code> must not modify its input and must treat “reach” as ≥ (not >).', vi: '<code>hotSpots</code> không được sửa đầu vào và “đạt” nghĩa là ≥ (không phải >).' },
  ],
  viDu: [
    { input: 'combinations([2, 2, 2])', output: '8', explanation: 'Three yes/no fields.|||Ba trường có/không.' },
    { input: 'hotSpots({ booking: 42, auth: 6, labs: 5, report: 4, ui: 3 }, 0.8)', output: '["booking","auth"]', explanation: '42/60 = 70% < 80%, 48/60 = 80% ≥ 80%.|||42/60 = 70% < 80%, 48/60 = 80% ≥ 80%.' },
  ],
  goiY: ['combinations = fields.reduce((p, n) => p * n, 1).', 'hotSpots: Object.entries → sort → cộng dồn tới khi tổng ≥ share × tổng tất cả.', 'So sánh bằng phép nhân (sum ≥ share × total) và cẩn thận sai số số thực — 0.8 × 60 = 48.00000000000001? Thử cộng một epsilon nhỏ.'],
  loiHayGap: ['Dùng > thay vì ≥ nên ví dụ trả thêm "labs".', 'Quên sắp tên khi số lỗi bằng nhau.', 'Sort trực tiếp mảng đầu vào hay sửa object đầu vào.'],
  giaiThich: '<p>Sort entries by (−count, name), accumulate, stop at the first prefix with sum ≥ share·total (use a tiny epsilon for floating point). 5,208 combinations for one small form already — real forms have free-text fields, so exhaustive testing is impossible.</p>',
  thuatNgu: [{ en: 'Pareto principle', vi: 'nguyên lý Pareto (80/20) — 80% lỗi nằm ở 20% module' }, { en: 'combinatorial explosion', vi: 'bùng nổ tổ hợp' }],
  khaiNiem: ['defect clustering', 'exhaustive testing'],
  tep: {
    'principles.js': [
      'function combinations(fields) {\n  // product of the number of values of each field\n  return 0;\n}\n\nfunction hotSpots(defectsByModule, share) {\n  // smallest prefix of modules (most defects first) reaching share of all defects\n  return [];\n}\n',
      'function combinations(fields) {\n  return fields.reduce((p, n) => p * n, 1);\n}\n\nfunction hotSpots(defectsByModule, share) {\n  const rows = Object.entries(defectsByModule).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));\n  const total = rows.reduce((s, r) => s + r[1], 0);\n  if (total === 0) return [];\n  const out = [];\n  let sum = 0;\n  for (const [name, n] of rows) {\n    out.push(name);\n    sum += n;\n    if (sum + 1e-9 >= share * total) break;\n  }\n  return out;\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'combinations — example and the LabBook form', vi: 'combinations — ví dụ và form LabBook' }, () => (combinations([2, 2, 2]) === 8 && combinations([31, 14, 4, 3]) === 5208 ? 'OK' : 'combinations([2,2,2]) should be 8 and combinations([31,14,4,3]) should be 5208')),
    kiemTuy({ en: 'combinations — empty array and a single field', vi: 'combinations — mảng rỗng và một trường' }, () => (combinations([]) === 1 && combinations([7]) === 7 ? 'OK' : 'combinations([]) should be 1 (one way to vary nothing) and combinations([7]) should be 7')),
    kiemTuy({ en: 'hotSpots — the LabBook example (≥, not >)', vi: 'hotSpots — ví dụ LabBook (≥, không phải >)' }, () => { const r = hotSpots({ booking: 42, auth: 6, labs: 5, report: 4, ui: 3 }, 0.8); return JSON.stringify(r) === '["booking","auth"]' ? 'OK' : 'expected ["booking","auth"], got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'hotSpots — input order does not matter, ties by name', vi: 'hotSpots — thứ tự đầu vào không ảnh hưởng, bằng nhau xếp theo tên' }, () => { const r = hotSpots({ zeta: 5, alpha: 5, mid: 10 }, 0.7); return JSON.stringify(r) === '["mid","alpha"]' ? 'OK' : 'expected ["mid","alpha"] (10 then the tie 5/5 by name), got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'hotSpots — share 1 returns every module with defects', vi: 'hotSpots — share 1 trả mọi module' }, () => { const r = hotSpots({ a: 1, b: 2, c: 3 }, 1); return JSON.stringify(r) === '["c","b","a"]' ? 'OK' : 'expected ["c","b","a"], got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'hotSpots — no defects', vi: 'hotSpots — không có lỗi' }, () => { const r = hotSpots({ a: 0, b: 0 }, 0.8); const r2 = hotSpots({}, 0.8); return Array.isArray(r) && r.length === 0 && Array.isArray(r2) && r2.length === 0 ? 'OK' : 'no defects ⇒ []'; }),
    kiemTuy({ en: 'hotSpots — does not modify the input', vi: 'hotSpots — không sửa đầu vào' }, () => { const o = { b: 1, a: 9 }; hotSpots(o, 0.5); return JSON.stringify(o) === '{"b":1,"a":9}' ? 'OK' : 'the input object was changed'; }, { an: true }),
    kiemTuy({ en: 'hotSpots — floating point at exactly the share', vi: 'hotSpots — số thực đúng bằng share' }, () => { const r = hotSpots({ a: 7, b: 2, c: 1 }, 0.9); return JSON.stringify(r) === '["a","b"]' ? 'OK' : '7+2 = 9 is exactly 90% of 10 — expected ["a","b"], got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E4 = tinhDe({
  tieuDe: 'Seven principles 4 — True or false? Misconceptions about the principles',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Mark every statement that is <b>TRUE</b>. Each wrong statement is a misconception seen in student answers.</p>', vi: '<p>Chọn mọi phát biểu <b>ĐÚNG</b>. Mỗi phát biểu sai là một hiểu lầm thường gặp trong bài làm sinh viên.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', nhieu: true, de: hai('Select ALL true statements.', 'Chọn TẤT CẢ phát biểu đúng.'), luaChon: lc(
      ['a', 'Testing reduces the probability of undiscovered defects remaining in the software'],
      ['b', 'Because of defect clustering, modules with no defects so far need no testing'],
      ['c', 'Static testing of requirements is one way of applying “early testing”'],
      ['d', 'If 100% of the planned tests pass, the software is defect-free'],
      ['e', 'Exhaustive testing is possible for a function with one boolean input'],
      ['f', 'The same test approach should be used for every project to keep quality consistent'],
    ), dapAn: ['a', 'c', 'e'], giaiThich: giai('a — principle 1 wording; c — early testing includes static testing; e — “except in trivial cases”. b, d, f contradict principles 4, 1 and 6.', 'a — đúng lời nguyên tắc 1; c — test sớm gồm cả kiểm thử tĩnh; e — “trừ trường hợp tầm thường”. b, d, f trái nguyên tắc 4, 1 và 6.') },
  ],
  goiY: ['Nguyên tắc 2 có chữ “except in trivial cases”.', 'Nguyên tắc 6: không có một cách test cho mọi dự án.'],
  loiHayGap: ['Bỏ qua câu e vì nhớ máy móc “vét cạn là không thể”.', 'Chọn d vì “đã chạy đủ kế hoạch”.'],
  giaiThich: '<p>True: a, c, e.</p>',
  thuatNgu: [{ en: 'trivial case', vi: 'trường hợp tầm thường — rất ít đầu vào' }],
  khaiNiem: ['seven principles'],
});

export default doiDau({
  slug: 'swt301-seven-principles',
  ten: '1.3 Seven testing principles',
  moTaModule: 'Bảy nguyên tắc ISTQB qua câu chuyện LabBook, câu hỏi kiểu FE, tính số tổ hợp (vét cạn) và điểm nóng lỗi (phân cụm Pareto) bằng code, bẫy hiểu lầm.',
  khoa: KHOA,
  baiHoc: 'swt301-seven-principles',
  de: [E1, E2, E3, E4],
});
