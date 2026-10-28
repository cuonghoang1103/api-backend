/**
 * SWR302 · 5.7 — Specifying quality requirements with Planguage (Wiegers Ch.14).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const KW = ['TAG', 'AMBITION', 'SCALE', 'METER', 'GOAL', 'STRETCH', 'WISH', 'PAST', 'DEFINED'];

const E1 = phanLoai({
  tieuDe: 'Planguage 1 — what does each keyword mean?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Tom Gilb’s Planguage, used by Wiegers to write precise quality requirements. Match each description to its keyword.</p>', vi: '<p>Planguage của Tom Gilb, được Wiegers dùng để viết yêu cầu chất lượng chính xác. Ghép mô tả với từ khoá.</p>' },
  cot: 'Keyword', luaChon: KW,
  hang: [
    ['A unique, persistent identifier of the requirement', 'TAG'],
    ['A short statement of the intent of the requirement', 'AMBITION'],
    ['The unit of measure', 'SCALE'],
    ['How, in practice, the value is measured', 'METER'],
    ['The minimum level to be achieved for the product to be acceptable', 'GOAL'],
    ['A better level we hope to reach', 'STRETCH'],
    ['The ideal level under perfect conditions', 'WISH'],
    ['The value reached by an earlier or competing product', 'PAST'],
    ['The definition of a term used in the requirement', 'DEFINED'],
  ],
  giaiThich: '<p>SCALE says WHAT is measured; METER says HOW it is measured; GOAL is the must-reach level; STRETCH and WISH are higher, optional levels.</p>',
  goiY: ['SCALE = đơn vị; METER = cách đo.', 'GOAL là mức tối thiểu chấp nhận được.'],
  loiHayGap: ['Đảo SCALE với METER.', 'Coi WISH là mức bắt buộc.'],
  thuatNgu: tn('planguage'),
  khaiNiem: ['Planguage'],
});

const E2 = tracNghiem({
  tieuDe: 'Planguage 2 — read a Planguage requirement',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<pre>TAG: Booking.Speed\nAMBITION: Patients can confirm an appointment quickly on a phone.\nSCALE: Seconds from tapping "Confirm" to the confirmation screen.\nMETER: Automated test of 500 bookings on a 4G connection, 90th percentile.\nGOAL: ≤ 3 seconds\nSTRETCH: ≤ 2 seconds\nWISH: ≤ 1 second\nPAST: 6 seconds (old web form)</pre>', vi: '<p>Đọc yêu cầu Planguage ở trên và trả lời.</p>' },
  cau: [
    { en: 'The release measures 2.6 s. Is the requirement satisfied?', vi: 'Bản phát hành đo được 2,6 giây. Đạt yêu cầu không?', lc: [['a', 'Yes — the GOAL (≤ 3 s) is met; STRETCH is not'], ['b', 'No — the WISH is not met'], ['c', 'No — the STRETCH is not met'], ['d', 'Cannot tell']], dap: 'a', giai: ['Only GOAL is mandatory.', 'Chỉ GOAL là bắt buộc.'] },
    { en: 'Which line tells the tester how to measure?', vi: 'Dòng nào cho tester biết đo thế nào?', lc: [['a', 'SCALE'], ['b', 'METER'], ['c', 'AMBITION'], ['d', 'PAST']], dap: 'b', giai: ['METER is the measuring method.', 'METER là phương pháp đo.'] },
    { en: 'The word "quickly" appears in AMBITION. Is that a problem?', vi: 'AMBITION có chữ "quickly". Có sao không?', lc: [['a', 'No — AMBITION states intent; SCALE, METER and GOAL make it precise'], ['b', 'Yes — remove the whole requirement'], ['c', 'Yes — AMBITION must contain a number'], ['d', 'Only in agile']], dap: 'a', giai: ['The precision lives in the other keywords.', 'Độ chính xác nằm ở các từ khoá khác.'] },
  ],
  goiY: ['Chỉ GOAL bắt buộc phải đạt.', 'METER = cách đo cụ thể.'],
  loiHayGap: ['Coi STRETCH là ngưỡng đạt.', 'Nghĩ AMBITION phải đo được.'],
  giaiThich: '<p>Answers: a · b · a.</p>',
  thuatNgu: tn('planguage'),
  khaiNiem: ['Planguage'],
});

const E3 = baiJs({
  tieuDe: 'Planguage 3 — write and check a Planguage requirement',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Two parts. <b>(a)</b> Write <code>PL</code>, a Planguage requirement for the availability of a hospital booking service ("always up") as an object with keys <code>TAG, AMBITION, SCALE, METER, GOAL, STRETCH</code> (strings). GOAL and STRETCH must contain a percentage and STRETCH must be stricter than GOAL. <b>(b)</b> Write <code>function meets(pl, measured)</code> that returns <code>"goal"</code>, <code>"stretch"</code> or <code>"fail"</code> for a measured percentage, reading the numbers from <code>pl.GOAL</code> and <code>pl.STRETCH</code> (for availability, higher is better; a value equal to the level meets it). It will be tested on hidden Planguage objects too.</p>', vi: '<p>(a) Viết <code>PL</code> — yêu cầu Planguage về độ sẵn sàng ("luôn chạy") với các khoá TAG, AMBITION, SCALE, METER, GOAL, STRETCH; GOAL và STRETCH có phần trăm, STRETCH chặt hơn GOAL. (b) Viết <code>meets(pl, measured)</code> trả "goal", "stretch" hoặc "fail", đọc số từ pl.GOAL và pl.STRETCH (cao hơn là tốt hơn; bằng mức thì đạt mức đó). Có kiểm trên dữ liệu ẩn.</p>' },
  yeuCau: [{ en: 'meets() returns "stretch" when the STRETCH level is reached, else "goal" when the GOAL is reached, else "fail".', vi: 'meets() trả "stretch" nếu đạt STRETCH, không thì "goal" nếu đạt GOAL, còn lại "fail".' }],
  viDu: [{ input: 'GOAL "99.5%", STRETCH "99.9%", measured 99.7', output: '"goal"', explanation: 'Above the goal, below the stretch.|||Trên goal, dưới stretch.' }],
  tep: { 'planguage.js': ["const PL = { TAG: '', AMBITION: '', SCALE: '', METER: '', GOAL: '', STRETCH: '' };\n\nfunction meets(pl, measured) {\n  // TODO: read the percentages from pl.GOAL and pl.STRETCH\n  return 'fail';\n}\n", "const PL = {\n  TAG: 'Booking.Availability',\n  AMBITION: 'Patients can book an appointment whenever the clinic is open for booking.',\n  SCALE: 'Percentage of minutes between 06:00 and 22:00 in which the booking service answers a health check.',\n  METER: 'External monitor probes the booking endpoint every minute; monthly report.',\n  GOAL: '99.5%',\n  STRETCH: '99.9%',\n};\n\nfunction soCua(s) {\n  var m = String(s).match(/(\\d+(?:\\.\\d+)?)\\s*%/);\n  return m ? parseFloat(m[1]) : NaN;\n}\n\nfunction meets(pl, measured) {\n  var g = soCua(pl.GOAL), s = soCua(pl.STRETCH);\n  if (!isNaN(s) && measured >= s) return 'stretch';\n  if (!isNaN(g) && measured >= g) return 'goal';\n  return 'fail';\n}\n"] },
  kiem: [
    kiemTuy({ en: 'PL has all six keywords filled', vi: 'PL có đủ sáu từ khoá' }, function () {
      if (typeof PL === 'undefined' || !PL) return 'PL is missing';
      var k = ['TAG', 'AMBITION', 'SCALE', 'METER', 'GOAL', 'STRETCH'];
      for (var i = 0; i < k.length; i++) if (String(PL[k[i]] || '').trim().length < 3) return k[i] + ' is empty';
      if (/\s/.test(String(PL.TAG).trim())) return 'TAG should be one identifier without spaces (e.g. Booking.Availability)';
      return 'OK';
    }),
    kiemTuy({ en: 'SCALE and METER are specific (unit; how and how often measured)', vi: 'SCALE và METER cụ thể (đơn vị; đo thế nào, bao lâu một lần)' }, function () {
      if (typeof PL === 'undefined' || !PL) return 'PL is missing';
      if (!/(percent|%|proportion|minutes|hours|time)/i.test(String(PL.SCALE))) return 'SCALE: say the unit (percentage of time…)';
      if (!/(monitor|probe|log|measure|report|check|test|tool|every|per)/i.test(String(PL.METER))) return 'METER: say how it is measured (monitor, logs, report…)';
      return 'OK';
    }),
    kiemTuy({ en: 'GOAL and STRETCH are percentages and STRETCH is stricter', vi: 'GOAL và STRETCH là phần trăm, STRETCH chặt hơn' }, function () {
      if (typeof PL === 'undefined' || !PL) return 'PL is missing';
      var g = String(PL.GOAL).match(/(\d+(?:\.\d+)?)\s*%/), s = String(PL.STRETCH).match(/(\d+(?:\.\d+)?)\s*%/);
      if (!g || !s) return 'GOAL and STRETCH must contain a percentage like 99.5%';
      if (parseFloat(g[1]) >= 100) return 'a GOAL of 100% is not feasible';
      return parseFloat(s[1]) > parseFloat(g[1]) && parseFloat(s[1]) <= 100 ? 'OK' : 'STRETCH must be higher than GOAL and at most 100%';
    }),
    kiemTuy({ en: 'meets() works on your PL', vi: 'meets() đúng với PL của bạn' }, function () {
      if (typeof meets !== 'function' || typeof PL === 'undefined') return 'meets or PL missing';
      var g = parseFloat(String(PL.GOAL).match(/(\d+(?:\.\d+)?)/)[1]), s = parseFloat(String(PL.STRETCH).match(/(\d+(?:\.\d+)?)/)[1]);
      if (meets(PL, g) !== 'goal') return 'measured = GOAL ⇒ "goal"';
      if (meets(PL, s) !== 'stretch') return 'measured = STRETCH ⇒ "stretch"';
      if (meets(PL, g - 0.1) !== 'fail') return 'below GOAL ⇒ "fail"';
      return 'OK';
    }),
    kiemTuy({ en: 'meets() works on hidden Planguage objects', vi: 'meets() đúng trên dữ liệu ẩn' }, function () {
      if (typeof meets !== 'function') return 'meets is not a function';
      var p = { GOAL: 'at least 98 % of requests', STRETCH: '99.25% of requests' };
      var c = [[97.99, 'fail'], [98, 'goal'], [99.2, 'goal'], [99.25, 'stretch'], [100, 'stretch']];
      for (var i = 0; i < c.length; i++) { var r = meets(p, c[i][0]); if (r !== c[i][1]) return 'GOAL 98%, STRETCH 99.25%, measured ' + c[i][0] + ' ⇒ ' + c[i][1] + ', got ' + r; }
      return 'OK';
    }, { an: true }),
  ],
  goiY: ['Đọc số bằng regex /(\\d+(?:\\.\\d+)?)\\s*%/.', 'Kiểm STRETCH trước, rồi GOAL.'],
  loiHayGap: ['Đặt GOAL 100%.', 'So sánh chuỗi "99.5%" thay vì số.'],
  giaiThich: '<p>Planguage separates the intent (AMBITION) from the measurement (SCALE + METER) and the target levels (GOAL, STRETCH, WISH). Only GOAL is the acceptance threshold.</p>',
  thuatNgu: tn('planguage'),
  khaiNiem: ['Planguage'],
  boYeu: [{ ten: 'GOAL 100% + so chuỗi', tep: { 'planguage.js': "const PL={TAG:'Avail',AMBITION:'Always up',SCALE:'uptime',METER:'we check',GOAL:'100%',STRETCH:'100%'};\nfunction meets(pl,m){ return String(m)+'%'===pl.STRETCH?'stretch':String(m)+'%'===pl.GOAL?'goal':'fail'; }\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Planguage 4 — trade-offs between quality attributes',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Quality attributes interact (Wiegers Figure 14-2): improving one may help or hurt others. Planguage targets (GOAL/STRETCH) must be set with these trade-offs in mind, and stakeholders must agree which attribute wins in a conflict.</p>', vi: '<p>Các thuộc tính chất lượng tác động lẫn nhau; đặt mục tiêu Planguage phải tính tới đánh đổi.</p>' },
  cau: [
    { en: 'Raising the security GOAL (encryption everywhere, 2-factor login) usually affects…', vi: 'Nâng GOAL bảo mật (mã hoá mọi nơi, đăng nhập 2 lớp) thường ảnh hưởng…', lc: [['a', 'performance and usability negatively'], ['b', 'nothing'], ['c', 'portability positively'], ['d', 'only the price']], dap: 'a', giai: ['Classic trade-off.', 'Đánh đổi kinh điển.'] },
    { en: 'Increasing robustness (more input checking and recovery) tends to…', vi: 'Tăng độ bền (kiểm đầu vào, phục hồi nhiều hơn) có xu hướng…', lc: [['a', 'help reliability and availability, but cost some efficiency'], ['b', 'reduce reliability'], ['c', 'have no effect'], ['d', 'reduce safety']], dap: 'a', giai: ['Positive and negative effects.', 'Có tác động tốt và xấu.'] },
  ],
  goiY: ['Bảo mật ↔ hiệu năng, khả dụng.', 'Bền ⇒ tin cậy, sẵn sàng tốt hơn, tốn hiệu suất.'],
  loiHayGap: ['Đặt GOAL cao cho mọi thuộc tính cùng lúc.', 'Không thống nhất thuộc tính nào thắng.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('qualityAttr', 'planguage'),
  khaiNiem: ['quality trade-offs'],
});

export default moDun({
  slug: 'swr302-5-8-ch14-planguage',
  ten: '5.8 Specifying quality requirements with Planguage',
  moTaModule: 'Từ khoá Planguage (TAG, AMBITION, SCALE, METER, GOAL, STRETCH, WISH, PAST, DEFINED), đọc yêu cầu Planguage để quyết định đạt/không, tự viết yêu cầu sẵn sàng bằng Planguage và hàm kiểm mức đạt.',
  de: [E1, E2, E3, E4],
});
