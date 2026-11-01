/** API Design · 11.1 — Khung trả lời 45 phút: ước lượng theo đỉnh, thang chấm 6 tiêu chí (output thật bài 11.1). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Framework 1 — The 45-minute plan and what is scored', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 11.1: the five steps, the estimate for LabFlow (interview/estimate.mjs) and the six-row rubric.',
  vi: 'Những điều từ bài 11.1: năm bước, phép ước lượng cho LabFlow (interview/estimate.mjs) và thang chấm sáu dòng.',
  cau: [
    q('c1', ['The interviewer says “Design a URL shortener”. What should the first minutes contain?', 'Người phỏng vấn nói “Thiết kế dịch vụ rút gọn link”. Những phút đầu nên có gì?'],
      ['Questions: who uses it, core use cases, how many, what must never happen — answers written on the board', 'A diagram with a load balancer, three services and Kafka, to show breadth', 'The database schema, because data decides everything else', 'A list of every HTTP status code the API might ever return'],
      ['Clarify before drawing; every later decision points back to those answers.', 'Làm rõ trước khi vẽ; mọi quyết định sau đều trỏ về các câu trả lời đó.']),
    q('c2', ['estimate.mjs printed an average of 0.83 reads/s and a 07:00 peak of 500 reads/s. Which number do you design for?', 'estimate.mjs in trung bình 0,83 lượt đọc/s và đỉnh 07:00 là 500 lượt đọc/s. Thiết kế theo số nào?'],
      ['The peak, compared with a measured capacity (~8,000 reads/s on one process)', 'The average, because the server is idle most of the day', 'The sum of both, to leave a safety margin', 'Neither — estimates are not expected in an API design round'],
      ['The average hides the spike; the peak against a measured capacity says one process uses ~6% for reads.', 'Trung bình che mất cú dồn; đỉnh so với công suất đã đo cho thấy một tiến trình chỉ dùng ~6% cho đọc.']),
    q('c3', ['Logins at the peak are 50/s and one process measured 114 logins/s (8.2). What is the honest conclusion?', 'Đăng nhập lúc đỉnh là 50/s và một tiến trình đo được 114 lượt/s (8.2). Kết luận trung thực là gì?'],
      ['Logins use ~44% of capacity — the spike, not reads, is the risk to watch', 'Logins are fine because 50 is less than 114, so nothing needs mentioning', 'Logins need ten servers because scrypt is slow', 'Logins should be cached in Redis to remove the hashing cost'],
      ['A number earns its place when it leads to a decision; here it points at the expensive endpoint.', 'Con số đáng nói khi dẫn tới quyết định; ở đây nó chỉ ra endpoint đắt.']),
    q('c4', ['Which rubric total counts as a strong junior answer in this course?', 'Tổng điểm nào được coi là câu trả lời junior mạnh trong khoá này?'],
      ['At least 13 of 18, with no 1 in API surface or correctness', 'At least 9 of 18, as long as communication scores 3', 'Exactly 18 of 18 — anything less is a rejection', 'At least 13 of 18, even with a 1 in correctness'],
      ['The course rubric (not any company’s official sheet): six rows scored 1–3.', 'Thang chấm của khoá (không phải phiếu chính thức của công ty nào): sáu dòng, 1–3 điểm.']),
  ],
  goiY: [['Think of a driving test: habits, not one right answer.', 'Nghĩ tới thi bằng lái: thói quen, không phải một đáp án đúng.'], ['Numbers must end in a decision.', 'Con số phải kết thúc bằng một quyết định.']],
  loi: [['Designing for the daily average.', 'Thiết kế theo trung bình cả ngày.'], ['Drawing boxes before asking a single question.', 'Vẽ hộp trước khi hỏi câu nào.']],
  tns: [tn('peak', 'đỉnh tải'), tn('rubric', 'thang chấm'), tn('back-of-the-envelope', 'ước lượng nhanh')],
  kn: ['interview', 'estimation'],
});

function estimate(a) {
  const r2 = (x) => Math.round(x * 100) / 100;
  const dau = a.students * a.dailyActive;
  const spikeUsers = dau * a.spikeShare;
  const perDay = { reads: dau * a.readsPerUser, bookings: dau * a.bookingsPerUser };
  return {
    dau,
    perDay,
    avgPerSec: { reads: r2(perDay.reads / 86400), bookings: r2(perDay.bookings / 86400) },
    peakPerSec: { reads: r2(spikeUsers * a.spikeReadsPerUser / a.spikeSec), bookings: r2(spikeUsers * a.bookingsPerUser / a.spikeSec) },
  };
}
const BASE = { students: 30000, dailyActive: 0.2, readsPerUser: 12, bookingsPerUser: 1, spikeShare: 0.5, spikeSec: 60, spikeReadsPerUser: 10 };
const E2 = jsBai({
  ten: 'Framework 2 — Write estimate(a): average versus peak', kho: 'MEDIUM', phut: 15,
  en: `<p>Re-create the arithmetic of <code>interview/estimate.mjs</code>. Input <code>a</code> has <code>students, dailyActive, readsPerUser, bookingsPerUser, spikeShare, spikeSec, spikeReadsPerUser</code>. Return:</p><ul><li><code>dau</code> = students × dailyActive;</li><li><code>perDay</code> = <code>{ reads: dau × readsPerUser, bookings: dau × bookingsPerUser }</code>;</li><li><code>avgPerSec</code> = perDay ÷ 86,400 (each rounded to 2 decimals);</li><li><code>peakPerSec</code>: the spike users are dau × spikeShare; reads = spikeUsers × spikeReadsPerUser ÷ spikeSec, bookings = spikeUsers × bookingsPerUser ÷ spikeSec (rounded to 2 decimals).</li></ul>`,
  vi: `<p>Dựng lại phép tính của <code>interview/estimate.mjs</code>. Đầu vào <code>a</code> có <code>students, dailyActive, readsPerUser, bookingsPerUser, spikeShare, spikeSec, spikeReadsPerUser</code>. Trả về:</p><ul><li><code>dau</code> = students × dailyActive;</li><li><code>perDay</code> = <code>{ reads: dau × readsPerUser, bookings: dau × bookingsPerUser }</code>;</li><li><code>avgPerSec</code> = perDay ÷ 86.400 (mỗi số làm tròn 2 chữ số thập phân);</li><li><code>peakPerSec</code>: số người dồn vào đỉnh là dau × spikeShare; reads = spikeUsers × spikeReadsPerUser ÷ spikeSec, bookings = spikeUsers × bookingsPerUser ÷ spikeSec (làm tròn 2 chữ số).</li></ul>`,
  dauVao: ['a — object of assumptions (numbers)', 'a — object các giả định (số)'],
  dauRa: ['{ dau, perDay: {reads, bookings}, avgPerSec: {reads, bookings}, peakPerSec: {reads, bookings} }', '{ dau, perDay: {reads, bookings}, avgPerSec: {reads, bookings}, peakPerSec: {reads, bookings} }'],
  goiY: [['Round with Math.round(x * 100) / 100.', 'Làm tròn bằng Math.round(x * 100) / 100.'], ['The peak divides by spikeSec, not by 86,400.', 'Đỉnh chia cho spikeSec, không phải 86.400.']],
  loi: [['Using the whole population for the spike instead of dau × spikeShare.', 'Lấy cả số sinh viên cho cú dồn thay vì dau × spikeShare.'], ['Rounding before multiplying, which changes the result.', 'Làm tròn trước khi nhân, làm lệch kết quả.']],
  gt: ['Lesson 11.1: 6,000 DAU ⇒ 0.83 reads/s on average but 500 reads/s and 50 bookings/s in the 07:00 minute. The design target is the peak.', 'Bài 11.1: 6.000 DAU ⇒ trung bình 0,83 lượt đọc/s nhưng 500 lượt đọc/s và 50 lượt đặt/s trong phút 07:00. Mục tiêu thiết kế là đỉnh.'],
  kn: ['estimation'],
  tns: [tn('DAU', 'người dùng mỗi ngày'), tn('peak', 'đỉnh'), tn('average', 'trung bình')],
  dau: `/** back-of-the-envelope estimate */
function estimate(a) {
  // Write your solution here
  const dau = a.students * a.dailyActive;
  const perDay = { reads: dau * a.readsPerUser, bookings: dau * a.bookingsPerUser };
  const avg = { reads: perDay.reads / 86400, bookings: perDay.bookings / 86400 };
  return { dau, perDay, avgPerSec: avg, peakPerSec: avg };
}
`,
  giai: '// Reference solution\n' + nguon(estimate),
  cases: [
    { goi: goi('estimate', BASE), moTa: ['The LabFlow assumptions of lesson 11.1', 'Giả định LabFlow của bài 11.1'] },
    { goi: goi('estimate', { ...BASE, students: 20000, spikeShare: 0.15, spikeSec: 60 }), an: true },
    { goi: goi('estimate', { ...BASE, students: 1000, dailyActive: 1, spikeShare: 1, spikeSec: 600, spikeReadsPerUser: 3 }), an: true },
    { goi: goi('estimate', { ...BASE, students: 7, dailyActive: 1, readsPerUser: 1, bookingsPerUser: 0, spikeShare: 1, spikeSec: 1 }), an: true },
  ],
});

const ROWS = ['requirements', 'api', 'correctness', 'security', 'scale', 'communication'];
function rubricScore(scores) {
  if (!Array.isArray(scores) || scores.length !== 6 || !scores.every((s) => s === 1 || s === 2 || s === 3)) throw new RangeError('six scores from 1 to 3');
  const total = scores.reduce((a, b) => a + b, 0);
  const strong = total >= 13 && scores[1] > 1 && scores[2] > 1;
  const focus = ROWS.filter((_, i) => scores[i] === Math.min(...scores));
  return { total, strong, focus };
}
const E3 = jsBai({
  ten: 'Framework 3 — Write rubricScore(scores): is this a strong junior answer?', kho: 'HARD', phut: 15,
  en: `<p>The six rubric rows are, in order: <code>requirements, api, correctness, security, scale, communication</code>. <code>scores</code> must be an array of exactly six integers, each 1, 2 or 3 — otherwise throw a <code>RangeError</code>. Return <code>{ total, strong, focus }</code>: <code>total</code> is the sum; <code>strong</code> is true when total ≥ 13 <b>and</b> neither <code>api</code> nor <code>correctness</code> scored 1; <code>focus</code> lists the names of the rows with the lowest score, in row order — what to practise next.</p>`,
  vi: `<p>Sáu dòng của thang chấm, theo thứ tự: <code>requirements, api, correctness, security, scale, communication</code>. <code>scores</code> phải là mảng đúng sáu số nguyên, mỗi số 1, 2 hoặc 3 — nếu không thì ném <code>RangeError</code>. Trả <code>{ total, strong, focus }</code>: <code>total</code> là tổng; <code>strong</code> đúng khi total ≥ 13 <b>và</b> cả <code>api</code> lẫn <code>correctness</code> không bị điểm 1; <code>focus</code> liệt kê tên các dòng có điểm thấp nhất, theo thứ tự dòng — thứ cần luyện tiếp.</p>`,
  dauVao: ['scores — number[6]', 'scores — number[6]'],
  dauRa: ['{ total: number, strong: boolean, focus: string[] }', '{ total: number, strong: boolean, focus: string[] }'],
  goiY: [['Validate first: length, then each value.', 'Kiểm trước: độ dài, rồi từng giá trị.'], ['Math.min(...scores) gives the lowest score.', 'Math.min(...scores) cho điểm thấp nhất.']],
  loi: [['Calling 13/18 strong although correctness scored 1.', 'Gọi 13/18 là mạnh dù độ đúng chỉ được 1 điểm.'], ['Accepting 0 or 4 as a score.', 'Chấp nhận điểm 0 hoặc 4.']],
  gt: ['Lesson 11.1: a high total cannot hide a 1 in the two rows interviewers weigh most — the API surface and correctness under failure.', 'Bài 11.1: tổng cao không che được điểm 1 ở hai dòng người phỏng vấn coi trọng nhất — bề mặt API và độ đúng khi có sự cố.'],
  kn: ['interview'],
  tns: [tn('rubric', 'thang chấm'), tn('row', 'tiêu chí')],
  dau: `/** score a mock interview */
function rubricScore(scores) {
  // Write your solution here
  const total = scores.reduce((a, b) => a + b, 0);
  return { total, strong: total >= 13, focus: [] };
}
`,
  giai: '// Reference solution\n' + nguon(`const ROWS = ['requirements', 'api', 'correctness', 'security', 'scale', 'communication'];`, rubricScore),
  cases: [
    { goi: goi('rubricScore', [3, 3, 3, 2, 3, 2]), moTa: ['The shortener answer of 11.3 with communication 2', 'Câu trả lời rút gọn link ở 11.3 với giao tiếp 2'] },
    { goi: goi('rubricScore', [3, 3, 1, 3, 3, 3]), an: true },
    { goi: goi('rubricScore', [2, 2, 2, 2, 2, 2]), an: true },
    { goi: goi('rubricScore', [1, 2, 2, 3, 1, 3]), an: true },
    { goi: goi('rubricScore', [3, 3, 3, 3, 3]), nem: 'RangeError', an: true },
    { goi: goi('rubricScore', [3, 3, 3, 3, 3, 4]), nem: 'RangeError', an: true },
  ],
});

export default doiDau({ slug: 'api-11-1-khung', ten: '11.1 A framework for API design interviews', khoa: KHOA, baiHoc: 'api-11-1-khung', de: [E1, E2, E3] });
