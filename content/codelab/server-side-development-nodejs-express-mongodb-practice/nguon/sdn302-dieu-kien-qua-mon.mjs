/** SDN302 · 0.2 — Điều kiện qua môn: 5 thành phần (20/25/15/15/25), hai cổng ≥ 4 (PE, FE), trung bình ≥ 5, chuyên cần ≥ 80%. Viết hàm tính điểm. */
import { doiDau, KHOA, bai, cs, q, qn, tn } from './_sdn.mjs';

const J = String.raw;
const LUAT = J`// SDN302 grading (lesson 0.2)
// Assignment ×4 → 20% (their average) · Practical Exam → 25% · Progress Test ×3 → 15% (their average)
// Project → 15% · Final Exam → 25%
// PASS = attendance ≥ 80%  AND  practical ≥ 4  AND  final ≥ 4  AND  weighted average ≥ 5`;

const E1 = cs({
  ten: 'Two gates, one average: who passes SDN302?', kho: 'EASY', phut: 6,
  en: 'The passing rule of the lesson and its worked example.',
  vi: 'Luật qua môn của bài và ví dụ có lời giải.',
  cau: [
    q('d1', ['Assignment 8, Progress Test 7, Project 8, Practical Exam 3.5, Final 6 — weighted average above 5. Result?', 'Assignment 8, Progress Test 7, Project 8, Practical Exam 3.5, Final 6 — trung bình trên 5. Kết quả?'],
      ['Fail: the Practical Exam is below its ≥ 4 gate', 'Pass: the average is above 5', 'Pass, because the Final is above 4', 'It depends on attendance only'],
      ['A gate is checked on its own: 3.5 < 4 fails the course whatever the average.', 'Cổng được kiểm riêng: 3.5 < 4 là trượt môn dù trung bình bao nhiêu.']),
    q('d2', ['A student misses 25% of the contact slots. What happens?', 'Một sinh viên vắng 25% số buổi. Chuyện gì xảy ra?'],
      ['They cannot sit the final exam — attendance ≥ 80% is a hard gate', 'They lose 2 points on the final', 'Nothing, attendance is only a bonus', 'They must retake only the Practical Exam'],
      ['"Missing more than 20% of contact slots bars you from the final exam entirely."', '"Vắng quá 20% số buổi là không được thi cuối kỳ."']),
    qn('d3', ['Which components have their OWN ≥ 4 gate? (choose all)', 'Thành phần nào có cổng ≥ 4 RIÊNG? (chọn hết)'],
      ['Practical Exam (25%)', 'Final Exam (25%)', 'Assignments (20%)', 'Progress Tests (15%)', 'Project (15%)'],
      [0, 1],
      ['Only the two exams are gated; the others count through the weighted average.', 'Chỉ hai bài thi có cổng; các phần khác tính qua trung bình có trọng số.']),
    q('d4', ['Why is the Practical Exam where most students stumble?', 'Vì sao Practical Exam là chỗ đa số sinh viên vấp?'],
      ['An endpoint must actually RUN under time; theory alone earns nothing', 'It is the longest exam of the course, so students get tired', 'It is graded on handwriting, which is hard to keep neat', 'It only asks multiple-choice questions with tricky options'],
      ['85 minutes, connect Mongoose, define a route, validate input, return JSON — practise it hands-on.', '85 phút, nối Mongoose, định nghĩa route, kiểm đầu vào, trả JSON — phải luyện bằng tay.']),
  ],
  goiY: [['Gates first, average second.', 'Cổng trước, trung bình sau.'], ['Attendance decides whether you can sit the final.', 'Chuyên cần quyết định bạn có được thi cuối kỳ không.']],
  loi: [['Looking only at the average.', 'Chỉ nhìn trung bình.'], ['Thinking the project has a gate.', 'Tưởng project có cổng.']],
  tns: [tn('gate', 'cổng điểm', 'điều kiện tối thiểu riêng'), tn('weighted average', 'trung bình có trọng số')],
  kn: ['grading'],
});

const E2 = bai({
  ten: 'Compute the weighted average', kho: 'MEDIUM', phut: 10, lib: [],
  en: J`<p>Write <code>weightedAverage(s)</code> for <code>s = { assignments: [4 scores], practical, progressTests: [3 scores], project, final }</code> (scores 0–10). Use the weights of the lesson; the 4 assignments count through their average, the 3 progress tests too. Return the result <b>rounded to 2 decimals</b> as a number.</p>`,
  vi: J`<p>Viết <code>weightedAverage(s)</code> với <code>s = { assignments: [4 điểm], practical, progressTests: [3 điểm], project, final }</code> (điểm 0–10). Dùng trọng số của bài; 4 assignment tính qua trung bình của chúng, 3 progress test cũng vậy. Trả kết quả <b>làm tròn 2 chữ số thập phân</b> dạng số.</p>`,
  yc: [
    ['Weights: assignments 0.20, practical 0.25, progress tests 0.15, project 0.15, final 0.25.', 'Trọng số: assignments 0.20, practical 0.25, progress tests 0.15, project 0.15, final 0.25.'],
    ['Round with <code>Math.round(x * 100) / 100</code>.', 'Làm tròn bằng <code>Math.round(x * 100) / 100</code>.'],
  ],
  viDu: [['weightedAverage({ assignments: [8, 8, 8, 8], practical: 3.5, progressTests: [7, 7, 7], project: 8, final: 6 })', '6.23', 'The worked example: 1.6 + 0.875 + 1.05 + 1.2 + 1.5 = 6.225 → 6.23.', 'Ví dụ trong bài: 1.6 + 0.875 + 1.05 + 1.2 + 1.5 = 6.225 → 6.23.']],
  goiY: [['<code>const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;</code>', '<code>const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;</code>'], ['Floating point: 6.225 * 100 may be 622.4999…; add a tiny epsilon before rounding: <code>Math.round((x + 1e-9) * 100) / 100</code>.', 'Số thực: 6.225 * 100 có thể là 622.4999…; cộng một epsilon nhỏ trước khi làm tròn: <code>Math.round((x + 1e-9) * 100) / 100</code>.']],
  loi: [['Weighting each of the 4 assignments by 20% (total 80%).', 'Cho mỗi assignment 20% (tổng thành 80%).'], ['<code>toFixed(2)</code> returns a STRING, not a number.', '<code>toFixed(2)</code> trả CHUỖI, không phải số.']],
  gt: ['The five weights add up to 1.00; the multi-part components count through their own average first. Rounding after the sum (with a tiny epsilon against binary floating-point error) gives the 6.23 of the worked example.', 'Năm trọng số cộng lại bằng 1.00; các thành phần nhiều phần tính qua trung bình riêng trước. Làm tròn sau khi cộng (kèm epsilon nhỏ chống sai số dấu phẩy động nhị phân) cho đúng 6.23 của ví dụ.'],
  kn: ['reduce', 'rounding'],
  tns: [tn('floating point', 'số thực dấu phẩy động')],
  dau: J`${LUAT}
function weightedAverage(s) {
  return s.assignments.reduce((a, b) => a + b, 0) * 0.2 + s.practical * 0.25 + s.final * 0.25;
}
`,
  giai: J`${LUAT}
const avg = (list) => list.reduce((sum, x) => sum + x, 0) / list.length;

function weightedAverage(s) {
  const total =
    avg(s.assignments) * 0.20 +      // 4 assignments ⇒ their average carries 20%
    s.practical * 0.25 +
    avg(s.progressTests) * 0.15 +    // 3 progress tests ⇒ their average carries 15%
    s.project * 0.15 +
    s.final * 0.25;
  return Math.round((total + 1e-9) * 100) / 100;   // epsilon: 6.225 must round to 6.23
}
`,
  cases: [
    { goi: `weightedAverage({ assignments: [8, 8, 8, 8], practical: 3.5, progressTests: [7, 7, 7], project: 8, final: 6 })`, moTa: ['The worked example → 6.23', 'Ví dụ trong bài → 6.23'] },
    { goi: `weightedAverage({ assignments: [10, 10, 10, 10], practical: 10, progressTests: [10, 10, 10], project: 10, final: 10 })`, moTa: ['All tens → 10', 'Toàn điểm 10 → 10'] },
    { goi: `weightedAverage({ assignments: [6, 7, 8, 9], practical: 5, progressTests: [4, 5, 6], project: 7, final: 4 })`, an: true },
    { goi: `weightedAverage({ assignments: [0, 0, 0, 0], practical: 4, progressTests: [0, 0, 0], project: 0, final: 4 })`, an: true },
  ],
});

const E3 = bai({
  ten: 'passStatus: check the gates and explain why', kho: 'MEDIUM', phut: 12, lib: [],
  en: J`<p>Write <code>passStatus(s)</code> where <code>s</code> is the score object of the previous exercise plus <code>attendance</code> (a percentage 0–100). Return</p>
<pre>{ pass: boolean, average: number, reasons: string[] }</pre>
<p><code>average</code> is the rounded weighted average (write <code>weightedAverage</code> again or reuse it). <code>reasons</code> lists every failed condition, in this order: <code>"attendance below 80%"</code>, <code>"practical exam below 4"</code>, <code>"final exam below 4"</code>, <code>"average below 5"</code>. <code>pass</code> is true only when there is no reason.</p>`,
  vi: J`<p>Viết <code>passStatus(s)</code> với <code>s</code> là đối tượng điểm của bài trước cộng <code>attendance</code> (phần trăm 0–100). Trả</p>
<pre>{ pass: boolean, average: number, reasons: string[] }</pre>
<p><code>average</code> là trung bình có trọng số đã làm tròn (viết lại <code>weightedAverage</code> hoặc dùng lại). <code>reasons</code> liệt kê mọi điều kiện trượt, theo thứ tự: <code>"attendance below 80%"</code>, <code>"practical exam below 4"</code>, <code>"final exam below 4"</code>, <code>"average below 5"</code>. <code>pass</code> chỉ đúng khi không có lý do nào.</p>`,
  yc: [['Exactly 80% attendance, exactly 4 and exactly 5 all PASS (≥).', 'Đúng 80% chuyên cần, đúng 4 và đúng 5 đều QUA (≥).'], ['Check every condition — a student may fail for several reasons.', 'Kiểm mọi điều kiện — một sinh viên có thể trượt vì nhiều lý do.']],
  viDu: [['the worked example with attendance 90', '{"pass":false,"average":6.23,"reasons":["practical exam below 4"]}', 'Average fine, gate failed.', 'Trung bình ổn, cổng trượt.']],
  goiY: [['Push into an array in the required order, then <code>pass: reasons.length === 0</code>.', 'Đẩy vào mảng theo đúng thứ tự, rồi <code>pass: reasons.length === 0</code>.'], ['Compare <code>average</code> (the rounded value) with 5.', 'So <code>average</code> (giá trị đã làm tròn) với 5.']],
  loi: [['Using <code>&gt;</code> instead of <code>&gt;=</code>: a 4.0 on the practical would fail.', 'Dùng <code>&gt;</code> thay vì <code>&gt;=</code>: 4.0 ở practical bị trượt.'], ['<code>if … else if …</code>: only the first reason is reported.', '<code>if … else if …</code>: chỉ báo được lý do đầu tiên.']],
  gt: ['Each gate is an independent check, so the function evaluates all four and reports each failure — exactly how you should read your own transcript: the average is necessary, not sufficient.', 'Mỗi cổng là một phép kiểm độc lập, nên hàm đánh giá cả bốn và báo từng thất bại — đúng cách bạn nên đọc bảng điểm của mình: trung bình là cần, không phải đủ.'],
  kn: ['conditions'],
  tns: [tn('necessary vs sufficient', 'cần và đủ')],
  dau: J`${LUAT}
function passStatus(s) {
  const average = (s.practical + s.final) / 2;
  if (average >= 5) return { pass: true, average, reasons: [] };
  return { pass: false, average, reasons: ['average below 5'] };
}
`,
  giai: J`${LUAT}
const avg = (list) => list.reduce((sum, x) => sum + x, 0) / list.length;
function weightedAverage(s) {
  const t = avg(s.assignments) * 0.2 + s.practical * 0.25 + avg(s.progressTests) * 0.15 + s.project * 0.15 + s.final * 0.25;
  return Math.round((t + 1e-9) * 100) / 100;
}

function passStatus(s) {
  const average = weightedAverage(s);
  const reasons = [];
  // every condition is checked on its own — a student can fail for several reasons
  if (s.attendance < 80) reasons.push('attendance below 80%');
  if (s.practical < 4) reasons.push('practical exam below 4');
  if (s.final < 4) reasons.push('final exam below 4');
  if (average < 5) reasons.push('average below 5');
  return { pass: reasons.length === 0, average, reasons };
}
`,
  chuanBi: `const base = { assignments: [8, 8, 8, 8], practical: 3.5, progressTests: [7, 7, 7], project: 8, final: 6, attendance: 90 };`,
  cases: [
    { goi: `passStatus(base)`, moTa: ['The worked example fails on the practical gate', 'Ví dụ của bài trượt cổng practical'] },
    { goi: `passStatus({ ...base, practical: 4, attendance: 80 })`, moTa: ['Exactly 4 and exactly 80% pass', 'Đúng 4 và đúng 80% là qua'] },
    { goi: `passStatus({ assignments: [3, 3, 3, 3], practical: 2, progressTests: [3, 3, 3], project: 3, final: 3.9, attendance: 70 })`, an: true },
    { goi: `passStatus({ assignments: [5, 5, 5, 5], practical: 4, progressTests: [5, 5, 5], project: 5, final: 6, attendance: 100 })`, an: true },
  ],
});

const E4 = bai({
  ten: 'What do I need on the final? minFinalToPass(s)', kho: 'HARD', phut: 18, lib: [],
  en: J`<p>Before the final exam a student knows every score except <code>final</code>. Write <code>minFinalToPass(s)</code> that returns the smallest final score — in steps of <b>0.1</b> — that makes the student pass (all gates and average ≥ 5, using the same rounded average as before), or <code>null</code> if no final score from 0 to 10 can make them pass (e.g. attendance &lt; 80 or practical &lt; 4).</p>`,
  vi: J`<p>Trước kỳ thi cuối, sinh viên biết mọi điểm trừ <code>final</code>. Viết <code>minFinalToPass(s)</code> trả điểm cuối kỳ nhỏ nhất — bước <b>0.1</b> — giúp sinh viên qua (mọi cổng và trung bình ≥ 5, dùng cùng trung bình đã làm tròn như trước), hoặc <code>null</code> nếu không điểm cuối kỳ nào từ 0 tới 10 giúp qua được (vd chuyên cần &lt; 80 hoặc practical &lt; 4).</p>`,
  yc: [['Try finals 0.0, 0.1, … 10.0 — count with integers (0…100) and divide by 10 to avoid 0.30000000000000004.', 'Thử điểm cuối kỳ 0.0, 0.1, … 10.0 — đếm bằng số nguyên (0…100) rồi chia 10 để tránh 0.30000000000000004.'], ['The final must also reach its own gate (≥ 4).', 'Điểm cuối kỳ cũng phải đạt cổng của nó (≥ 4).']],
  viDu: [['{ assignments: [8,8,8,8], practical: 6, progressTests: [7,7,7], project: 8, attendance: 90 }', '4', 'The average is already ≥ 5 at final 0, but the gate needs 4.', 'Trung bình đã ≥ 5 khi final 0, nhưng cổng cần 4.'], ['{ assignments: [4,4,4,4], practical: 4, progressTests: [4,4,4], project: 5, attendance: 85 }', '7.4', 'Here the AVERAGE is what needs the higher final: 0.8 + 1 + 0.6 + 0.75 + 0.25 × 7.4 = 5.0.', 'Ở đây TRUNG BÌNH mới là thứ cần điểm cuối kỳ cao hơn: 0.8 + 1 + 0.6 + 0.75 + 0.25 × 7.4 = 5.0.']],
  goiY: [['Reuse <code>passStatus</code> from the previous exercise and loop: <code>for (let t = 0; t &lt;= 100; t++) { const f = t / 10; if (passStatus({ ...s, final: f }).pass) return f; } return null;</code>', 'Dùng lại <code>passStatus</code> của bài trước và lặp: <code>for (let t = 0; t &lt;= 100; t++) { const f = t / 10; if (passStatus({ ...s, final: f }).pass) return f; } return null;</code>'], ['A closed formula is possible but rounding makes it fragile; the loop has only 101 steps.', 'Có thể dùng công thức đóng nhưng làm tròn làm nó dễ sai; vòng lặp chỉ có 101 bước.']],
  loi: [['Adding 0.1 in a floating-point loop: 0.1 + 0.2 = 0.30000000000000004, and the answer prints as 4.300000000000001.', 'Cộng 0.1 trong vòng lặp số thực: 0.1 + 0.2 = 0.30000000000000004, và đáp án in ra 4.300000000000001.'], ['Ignoring the final\'s own gate: returning 2.5 when the average only needs 2.5.', 'Quên cổng riêng của final: trả 2.5 khi trung bình chỉ cần 2.5.']],
  gt: ['Searching the 101 possible scores with an integer counter is exact and reuses the already-tested rule, so the two exercises can never disagree. A null answer is meaningful: it tells the student the problem is elsewhere (attendance or the practical exam), not in the final.', 'Duyệt 101 điểm có thể bằng biến đếm nguyên là chính xác và dùng lại luật đã được kiểm, nên hai bài không bao giờ mâu thuẫn. Kết quả null có nghĩa: nó báo cho sinh viên vấn đề ở chỗ khác (chuyên cần hay practical), không phải ở bài cuối kỳ.'],
  kn: ['search', 'floating point'],
  tns: [tn('brute force', 'vét cạn')],
  dau: J`${LUAT}
function minFinalToPass(s) {
  for (let f = 0; f <= 10; f += 0.1) {
    if (f * 0.25 >= 2.5) return f;
  }
  return null;
}
`,
  giai: J`${LUAT}
const avg = (list) => list.reduce((sum, x) => sum + x, 0) / list.length;
function weightedAverage(s) {
  const t = avg(s.assignments) * 0.2 + s.practical * 0.25 + avg(s.progressTests) * 0.15 + s.project * 0.15 + s.final * 0.25;
  return Math.round((t + 1e-9) * 100) / 100;
}
function passes(s) {
  return s.attendance >= 80 && s.practical >= 4 && s.final >= 4 && weightedAverage(s) >= 5;
}

function minFinalToPass(s) {
  // count with INTEGERS 0..100 and divide: 0.1 steps without floating-point drift
  for (let t = 0; t <= 100; t++) {
    const final = t / 10;
    if (passes({ ...s, final })) return final;
  }
  return null;   // no final can fix it: attendance or the practical exam is the problem
}
`,
  cases: [
    { goi: `minFinalToPass({ assignments: [8, 8, 8, 8], practical: 6, progressTests: [7, 7, 7], project: 8, attendance: 90 })`, moTa: ['Strong student: only the gate matters → 4', 'Sinh viên khá: chỉ cổng quan trọng → 4'] },
    { goi: `minFinalToPass({ assignments: [4, 4, 4, 4], practical: 4, progressTests: [4, 4, 4], project: 5, attendance: 85 })`, moTa: ['Weaker student: the average needs more', 'Sinh viên yếu hơn: trung bình cần nhiều hơn'] },
    { goi: `[minFinalToPass({ assignments: [9, 9, 9, 9], practical: 3.9, progressTests: [9, 9, 9], project: 9, attendance: 100 }), minFinalToPass({ assignments: [9, 9, 9, 9], practical: 9, progressTests: [9, 9, 9], project: 9, attendance: 79 })]`, moTa: ['Practical or attendance gate failed → null', 'Trượt cổng practical hoặc chuyên cần → null'] },
    { goi: `minFinalToPass({ assignments: [1, 1, 1, 1], practical: 4, progressTests: [1, 1, 1], project: 1, attendance: 100 })`, an: true },
    { goi: `minFinalToPass({ assignments: [5, 6, 4, 5], practical: 4.5, progressTests: [3, 4, 5], project: 6, attendance: 82 })`, an: true },
  ],
});

export default doiDau({
  slug: 'sdn302-dieu-kien-qua-mon',
  ten: '0.2 Passing requirements & grading',
  khoa: KHOA,
  baiHoc: 'sdn302-dieu-kien-qua-mon',
  de: [E1, E2, E3, E4],
});
