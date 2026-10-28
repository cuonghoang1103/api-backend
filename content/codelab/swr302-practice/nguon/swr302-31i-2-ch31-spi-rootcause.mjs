/**
 * SWR302 · 31I.2 — SPI fundamentals and root cause analysis (Wiegers Ch.31 slides 11–15).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'SPI 1 — which fundamental of process improvement?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Four SPI fundamentals: (1) improvement is <b>evolutionary and continuous</b> — start small, adjust, pick low-hanging fruit; (2) people change only with an <b>incentive</b> — the strongest is pain from previous projects; (3) improvement is <b>goal-oriented</b>; (4) treat improvement activities as <b>mini-projects</b> with plans and resources. Which fundamental does each statement apply?</p>', vi: '<p>Bốn nguyên lý cải tiến quy trình.</p>' },
  cot: 'Fundamental', luaChon: ['Evolutionary and continuous', 'Incentive (pain)', 'Goal-oriented', 'Mini-projects'],
  hang: [
    ['"Let’s start with one review checklist and improve it after each sprint."', 'Evolutionary and continuous'],
    ['"We missed two deadlines because requirements were twice as big as expected — let’s fix elicitation."', 'Incentive (pain)'],
    ['"Our objective: cut rework caused by requirements by 30% this year."', 'Goal-oriented'],
    ['"The improvement has an owner, a plan, a budget and a deadline."', 'Mini-projects'],
  ],
  giaiThich: '<p>Many improvement initiatives fail from poor planning and missing resources — treat them as real projects.</p>',
  goiY: ['Bắt đầu nhỏ, điều chỉnh ⇒ tiến hoá liên tục.', 'Nỗi đau từ dự án trước ⇒ động lực.'],
  loiHayGap: ['Đòi quy trình hoàn hảo ngay lần đầu.', 'Cải tiến không có người phụ trách.'],
  thuatNgu: [{ en: 'software process improvement (SPI)', vi: 'cải tiến quy trình phần mềm' }],
  khaiNiem: ['SPI fundamentals'],
});

const E2 = tracNghiem({
  tieuDe: 'SPI 2 — root cause analysis',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Do root cause analysis before changing practices: distinguish symptoms from causes by asking "why?" several times. A cause-and-effect (fishbone, Ishikawa) diagram shows the answers as bones; the most highly branched bones reveal fundamental causes. You need not tackle every cause — a Pareto analysis focuses on the few causes behind most problems.</p>', vi: '<p>Phân tích nguyên nhân gốc: hỏi "vì sao" nhiều lần, biểu đồ xương cá, Pareto.</p>' },
  cau: [
    { en: '"Projects finish late." Asking why: requirements grow → users are not involved early → no product champions were named. The root cause to address is…', vi: '"Dự án trễ." Hỏi vì sao: yêu cầu phình → người dùng không tham gia sớm → không chỉ định product champion. Nguyên nhân gốc cần xử lý là…', lc: [['a', 'no product champions were named'], ['b', 'projects finish late'], ['c', 'requirements grow'], ['d', 'the calendar']], dap: 'a', giai: ['Keep asking why until you reach an actionable cause.', 'Hỏi vì sao tới khi gặp nguyên nhân hành động được.'] },
    { en: 'In a fishbone diagram, which bones point to fundamental causes?', vi: 'Trong biểu đồ xương cá, nhánh nào chỉ nguyên nhân cơ bản?', lc: [['a', 'The most highly branched ones'], ['b', 'The shortest ones'], ['c', 'The head'], ['d', 'None']], dap: 'a', giai: ['Highly branched bones.', 'Nhánh nhiều nhánh con.'] },
  ],
  goiY: ['Hỏi "vì sao" nhiều lần.', 'Nhánh nhiều nhánh con ⇒ nguyên nhân cơ bản.'],
  loiHayGap: ['Chữa triệu chứng.', 'Chọn phương pháp mới mà không phân tích.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'root cause analysis', vi: 'phân tích nguyên nhân gốc' }, { en: 'fishbone (Ishikawa) diagram', vi: 'biểu đồ xương cá' }],
  khaiNiem: ['root cause analysis'],
});

const CAUSES = { 'Unclear requirements': 42, 'Late scope changes': 25, 'Missing users in reviews': 14, 'Tool problems': 6, 'Staff turnover': 5, 'Unclear templates': 4, 'Other': 4 };
const E3 = baiJs({
  tieuDe: 'SPI 3 — a Pareto analysis',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>The project’s rework hours were tagged with their causes (<code>CAUSES</code>). Write <code>function pareto(counts, threshold)</code> that returns the causes, highest first (ties by name), taken until their cumulative share of the total reaches at least <code>threshold</code> percent — the "vital few" to fix first. Return <code>[]</code> for an empty object.</p>', vi: '<p>Viết <code>pareto(counts, threshold)</code>: lấy nguyên nhân theo thứ tự giảm dần (hoà theo tên) tới khi tỷ lệ cộng dồn ≥ ngưỡng %.</p>' },
  yeuCau: [{ en: 'pareto(CAUSES, 80) ⇒ the first three causes (81%).', vi: 'pareto(CAUSES, 80) ⇒ ba nguyên nhân đầu (81%).' }],
  viDu: [{ input: 'pareto({ a: 5, b: 3, c: 2 }, 50)', output: "['a']", explanation: '5/10 = 50%|||' }],
  tep: { 'pareto.js': [`const CAUSES = ${JSON.stringify(CAUSES, null, 1)};\nfunction pareto(counts, threshold) {\n  return [];\n}\n`, `const CAUSES = ${JSON.stringify(CAUSES, null, 1)};\nfunction pareto(counts, threshold) {\n  var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || (a < b ? -1 : a > b ? 1 : 0); });\n  var total = keys.reduce(function (s, k) { return s + counts[k]; }, 0);\n  var out = [], cum = 0;\n  for (var i = 0; i < keys.length && total > 0; i++) {\n    out.push(keys[i]); cum += counts[keys[i]];\n    if (cum * 100 >= threshold * total) break;\n  }\n  return out;\n}\n`] },
  kiem: [
    kiemTuy({ en: 'pareto(CAUSES, 80)', vi: 'pareto(CAUSES, 80)' }, function () {
      if (typeof pareto !== 'function') return 'pareto is not a function';
      var r = pareto(CAUSES, 80);
      return JSON.stringify(r) === '["Unclear requirements","Late scope changes","Missing users in reviews"]' ? 'OK' : 'got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'exact threshold and empty input', vi: 'đúng ngưỡng và đầu vào rỗng' }, function () {
      if (typeof pareto !== 'function') return 'pareto is not a function';
      if (JSON.stringify(pareto({ a: 5, b: 3, c: 2 }, 50)) !== '["a"]') return 'reaching exactly the threshold is enough';
      return JSON.stringify(pareto({}, 80)) === '[]' ? 'OK' : 'empty ⇒ []';
    }),
    kiemTuy({ en: 'hidden: ties by name', vi: 'ẩn: hoà theo tên' }, function () {
      if (typeof pareto !== 'function') return 'pareto is not a function';
      var r = pareto({ z: 4, b: 4, m: 2 }, 60);
      return JSON.stringify(r) === '["b","z"]' ? 'OK' : 'got ' + JSON.stringify(r);
    }, { an: true }),
  ],
  goiY: ['Sắp giảm dần; cộng dồn; dừng khi cum ≥ ngưỡng × tổng.', 'So sánh bằng số nguyên (cum × 100 ≥ threshold × total) tránh sai số.'],
  loiHayGap: ['Dừng TRƯỚC khi đạt ngưỡng.', 'Không phá hoà.'],
  giaiThich: '<p>Three causes explain 81% of the rework — fix those first, starting with unclear requirements.</p>',
  thuatNgu: [{ en: 'Pareto analysis', vi: 'phân tích Pareto' }],
  khaiNiem: ['Pareto analysis'],
  boYeu: [{ ten: 'dừng trước ngưỡng', tep: { 'pareto.js': `const CAUSES = ${JSON.stringify(CAUSES)};\nfunction pareto(c,t){ var k=Object.keys(c).sort(function(a,b){return c[b]-c[a];}), tot=0, o=[], cum=0; k.forEach(function(x){tot+=c[x];}); for(var i=0;i<k.length;i++){ if((cum+c[k[i]])*100>t*tot) break; o.push(k[i]); cum+=c[k[i]]; } return o; }\n` } }],
});

const E4 = tracNghiem({
  tieuDe: 'SPI 4 — the strongest incentive',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>The strongest incentive for change is pain from previous projects: missed deadlines because requirements were bigger than expected, overtime from ambiguous requirements, wasted test effort, rework.</p>', vi: '<p>Động lực mạnh nhất là nỗi đau từ dự án trước.</p>' },
  cau: [
    { en: 'How do you build support for improving requirements practices?', vi: 'Làm sao tạo ủng hộ cho việc cải tiến thực hành yêu cầu?', lc: [['a', 'Show the real pain of past projects — missed dates, overtime, rework — and link it to requirements problems'], ['b', 'Quote a textbook'], ['c', 'Buy a tool'], ['d', 'Change everything at once']], dap: 'a', giai: ['Pain is the incentive.', 'Nỗi đau là động lực.'] },
  ],
  goiY: ['Dữ liệu thật từ dự án trước.', 'Nối nỗi đau với nguyên nhân yêu cầu.'],
  loiHayGap: ['Chỉ trích sách.', 'Mua công cụ thay vì sửa quy trình.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'incentive', vi: 'động lực' }],
  khaiNiem: ['SPI fundamentals'],
});

export default moDun({
  slug: 'swr302-31i-2-ch31-spi-rootcause',
  ten: '12.8 Process improvement fundamentals and root causes',
  moTaModule: 'Bốn nguyên lý cải tiến quy trình, phân tích nguyên nhân gốc ("vì sao" nhiều lần, xương cá), tự viết phân tích Pareto có chấm, động lực từ nỗi đau dự án trước.',
  de: [E1, E2, E3, E4],
});
