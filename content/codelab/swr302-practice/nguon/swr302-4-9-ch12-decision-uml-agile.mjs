/**
 * SWR302 · 4.7 — Decision models: decision tables, decision trees, event-response tables (Wiegers Ch.12 slides 18–25 + LAB L.6).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = tracNghiem({
  tieuDe: 'Decision models 1 — table or tree?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A <b>decision table</b> lists every combination of conditions and the action for each — n independent yes/no conditions give 2ⁿ columns, which proves completeness. A <b>decision tree</b> shows nested conditions (B is only asked when A is true). An <b>event-response table</b> lists, for each external event (and system state), the expected response.</p>', vi: '<p><b>Bảng quyết định</b> liệt kê mọi tổ hợp điều kiện và hành động cho từng tổ hợp — n điều kiện có/không độc lập cho 2ⁿ cột, chứng minh được độ đầy đủ. <b>Cây quyết định</b> thể hiện điều kiện lồng nhau (B chỉ hỏi khi A đúng). <b>Bảng sự kiện – phản hồi</b> liệt kê, với mỗi sự kiện bên ngoài (và trạng thái hệ thống), phản hồi mong đợi.</p>' },
  cau: [
    { en: 'A discount rule has 4 independent yes/no conditions. How many columns does the full decision table have?', vi: 'Luật giảm giá có 4 điều kiện có/không độc lập. Bảng quyết định đầy đủ có bao nhiêu cột?', lc: [['a', '4'], ['b', '8'], ['c', '16'], ['d', '24']], dap: 'c', giai: ['2⁴ = 16.', '2⁴ = 16.'] },
    { en: 'The question "is the member a student?" is only asked when "is the member under 25?" is yes. Best model?', vi: 'Câu "có phải sinh viên?" chỉ hỏi khi "dưới 25 tuổi?" là có. Mô hình phù hợp nhất?', lc: [['a', 'Decision table'], ['b', 'Decision tree'], ['c', 'Context diagram'], ['d', 'ERD']], dap: 'b', giai: ['Nested conditions ⇒ tree.', 'Điều kiện lồng nhau ⇒ cây.'] },
    { en: 'What does "–" mean in a reduced decision table?', vi: '"–" nghĩa là gì trong bảng quyết định rút gọn?', lc: [['a', 'The condition is false'], ['b', 'The condition does not matter for that rule'], ['c', 'The action is missing'], ['d', 'The rule is impossible']], dap: 'b', giai: ['"Don’t care": both values give the same action.', '"Không quan trọng": hai giá trị cho cùng hành động.'] },
    { en: 'For a thermostat, "temperature drops below the set point while the heater is off ⇒ turn the heater on" belongs in…', vi: 'Với bộ điều nhiệt, "nhiệt độ xuống dưới mức đặt khi máy sưởi tắt ⇒ bật máy sưởi" thuộc về…', lc: [['a', 'an event-response table'], ['b', 'an ERD'], ['c', 'a feature tree'], ['d', 'a use case diagram']], dap: 'a', giai: ['Event + state ⇒ response.', 'Sự kiện + trạng thái ⇒ phản hồi.'] },
  ],
  goiY: ['Độc lập ⇒ bảng; lồng nhau ⇒ cây.', 'n điều kiện ⇒ 2ⁿ cột trước khi rút gọn.'],
  loiHayGap: ['Rút gọn trước khi viết đủ 2ⁿ cột.', 'Dùng cây cho điều kiện độc lập (lặp nhánh).'],
  giaiThich: '<p>Answers: c · b · b · a.</p>',
  thuatNgu: [...tn('decisionTable'), { en: 'decision tree', vi: 'cây quyết định' }, { en: 'event-response table', vi: 'bảng sự kiện – phản hồi' }],
  khaiNiem: ['decision models'],
});

const LUAT = (a, b) => (a === 'Y' && b === 'Y' ? 'Free' : a === 'Y' || b === 'Y' ? 'Half price' : 'Full price');
const E2 = phanLoai({
  tieuDe: 'Decision models 2 — fill a decision table',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Gym day-pass rule: a visitor who is <b>a student</b> AND comes <b>before 10:00</b> enters free; a visitor who satisfies only one of the two pays half price; everyone else pays full price. Fill the action of each column (C1 = student, C2 = before 10:00).</p>', vi: '<p>Luật vé ngày phòng gym: khách là <b>sinh viên</b> VÀ đến <b>trước 10:00</b> vào miễn phí; khách chỉ thoả một trong hai trả nửa giá; còn lại trả đủ giá. Điền hành động của từng cột (C1 = sinh viên, C2 = trước 10:00).</p>' },
  cotCau: 'Column (C1, C2)', cot: 'Action', luaChon: ['Free', 'Half price', 'Full price'],
  hang: [['Y, Y'], ['Y, N'], ['N, Y'], ['N, N']].map(([k]) => [k, LUAT(k[0], k[3])]),
  giaiThich: '<p>Y,Y Free · Y,N Half price · N,Y Half price · N,N Full price.</p>',
  goiY: ['2 điều kiện ⇒ 4 cột.', '"Chỉ thoả một trong hai" ⇒ Y,N và N,Y.'],
  loiHayGap: ['Quên cột N,N.', 'Cho N,Y là full price vì không phải sinh viên.'],
  thuatNgu: tn('decisionTable'),
  khaiNiem: ['decision table'],
});

const E3 = baiJs({
  tieuDe: 'Decision models 3 — the full table of a three-condition rule',
  doKho: 'HARD', phut: 12,
  moTa: { en: '<p>Library fine waiver rule: a fine is <b>waived</b> when the reader is a staff member and the book was returned within 3 days late; it is <b>halved</b> when exactly one of those two holds and the reader has no other unpaid fine; in every other case it is <b>charged in full</b>. Conditions: <code>staff</code>, <code>within3Days</code>, <code>otherUnpaid</code> (Y/N). Write all 8 columns in <code>TABLE</code> as objects <code>{ staff, within3Days, otherUnpaid, action }</code> with action ∈ "Waive" | "Halve" | "Charge".</p>', vi: '<p>Luật miễn phạt thư viện: <b>miễn</b> khi độc giả là cán bộ và trả trễ không quá 3 ngày; <b>giảm nửa</b> khi đúng MỘT trong hai điều đó và độc giả không còn khoản phạt nào chưa trả; mọi trường hợp khác <b>thu đủ</b>. Viết đủ 8 cột trong <code>TABLE</code>.</p>' },
  yeuCau: [{ en: 'Exactly 8 columns, every Y/N combination once.', vi: 'Đúng 8 cột, mỗi tổ hợp Y/N một lần.' }],
  viDu: [{ input: "{ staff: 'Y', within3Days: 'Y', otherUnpaid: 'Y' }", output: "'Waive'", explanation: 'Staff and within 3 days ⇒ waived, whatever else.|||Cán bộ và trong 3 ngày ⇒ miễn, bất kể điều khác.' }],
  tep: { 'table.js': [
    "const TABLE = [\n  { staff: 'Y', within3Days: 'Y', otherUnpaid: 'Y', action: '' },\n];\n",
    "// Write the 8 columns first; the third condition only matters when exactly one of the first two holds.\nconst TABLE = [\n  { staff: 'Y', within3Days: 'Y', otherUnpaid: 'Y', action: 'Waive' },\n  { staff: 'Y', within3Days: 'Y', otherUnpaid: 'N', action: 'Waive' },\n  { staff: 'Y', within3Days: 'N', otherUnpaid: 'Y', action: 'Charge' },\n  { staff: 'Y', within3Days: 'N', otherUnpaid: 'N', action: 'Halve' },\n  { staff: 'N', within3Days: 'Y', otherUnpaid: 'Y', action: 'Charge' },\n  { staff: 'N', within3Days: 'Y', otherUnpaid: 'N', action: 'Halve' },\n  { staff: 'N', within3Days: 'N', otherUnpaid: 'Y', action: 'Charge' },\n  { staff: 'N', within3Days: 'N', otherUnpaid: 'N', action: 'Charge' },\n];\n",
  ] },
  kiem: [
    kiemTuy({ en: 'all 8 combinations, each once', vi: 'đủ 8 tổ hợp, mỗi cái một lần' }, function () {
      if (typeof TABLE === 'undefined' || !Array.isArray(TABLE)) return 'TABLE is missing';
      var seen = {};
      for (var i = 0; i < TABLE.length; i++) { var r = TABLE[i] || {}; var k = [r.staff, r.within3Days, r.otherUnpaid].join('').toUpperCase(); if (!/^[YN]{3}$/.test(k)) return 'column ' + (i + 1) + ': use Y or N'; if (seen[k]) return 'combination ' + k + ' twice'; seen[k] = 1; }
      return TABLE.length === 8 ? 'OK' : '3 conditions ⇒ 8 columns, you have ' + TABLE.length;
    }),
    ...['YYY', 'YYN', 'YNY', 'YNN', 'NYY', 'NYN', 'NNY', 'NNN'].map((k, i) => kiemTuy({ en: `action of column ${k}`, vi: `hành động của cột ${k}` }, new Function(`
      if (typeof TABLE === 'undefined' || !Array.isArray(TABLE)) return 'TABLE is missing';
      var r = TABLE.filter(function (x) { return x && [x.staff, x.within3Days, x.otherUnpaid].join('').toUpperCase() === '${k}'; })[0];
      if (!r) return 'column ${k} is missing';
      var d = '${k[0] === 'Y' && k[1] === 'Y' ? 'Waive' : ((k[0] === 'Y') !== (k[1] === 'Y')) && k[2] === 'N' ? 'Halve' : 'Charge'}';
      return String(r.action).trim().toLowerCase() === d.toLowerCase() ? 'OK' : 'reread the rule for ${k}';`), i >= 6 ? { an: true } : {})),
  ],
  goiY: ['Viết 8 cột trước (YYY … NNN), rồi điền hành động.', '"Đúng một trong hai" ⇒ staff khác within3Days.'],
  loiHayGap: ['Cho YNN là Charge vì không trong 3 ngày.', 'Bỏ qua điều kiện otherUnpaid ở cột YY.'],
  giaiThich: '<p>YYY, YYN ⇒ Waive; YNN, NYN ⇒ Halve; YNY, NYY, NNY, NNN ⇒ Charge. The table can later be reduced: YY- ⇒ Waive.</p>',
  thuatNgu: tn('decisionTable', 'businessRule'),
  khaiNiem: ['decision table'],
});

const E4 = phanLoai({
  tieuDe: 'Decision models 4 — an event-response table',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Event-response table of a smart parking barrier. For each <b>event</b> in a given <b>state</b>, choose the expected response.</p>', vi: '<p>Bảng sự kiện – phản hồi của barrier bãi đỗ thông minh. Với mỗi <b>sự kiện</b> ở một <b>trạng thái</b>, chọn phản hồi mong đợi.</p>' },
  cotCau: 'Event (state)', cot: 'Response', luaChon: ['Open the barrier and log the entry', 'Keep the barrier closed and show "No permit"', 'Close the barrier', 'Keep the barrier open and sound the alarm', 'Ignore (cannot happen in this state)'],
  hang: [
    ['A car with a valid permit plate arrives (barrier closed)', 'Open the barrier and log the entry'],
    ['A car without a permit arrives (barrier closed)', 'Keep the barrier closed and show "No permit"'],
    ['The car has passed the sensor (barrier open)', 'Close the barrier'],
    ['An object stays under the barrier for 60 s (barrier open)', 'Keep the barrier open and sound the alarm'],
    ['"Car has passed" signal (barrier closed)', 'Ignore (cannot happen in this state)'],
  ],
  giaiThich: '<p>An event-response table makes the response to every event in every state explicit — including events that cannot happen in a state (which differ from events the system must refuse).</p>',
  goiY: ['Cùng một sự kiện có phản hồi khác nhau tuỳ trạng thái.', '"Không thể xảy ra" khác "phải từ chối".'],
  loiHayGap: ['Đóng barrier khi có vật cản (nguy hiểm).', 'Nhầm "ignore" với "show No permit".'],
  thuatNgu: [{ en: 'event-response table', vi: 'bảng sự kiện – phản hồi' }],
  khaiNiem: ['event-response table'],
});

export default moDun({
  slug: 'swr302-4-9-ch12-decision-uml-agile',
  ten: '4.7 Decision models: decision tables, trees and event-response tables',
  moTaModule: 'Khi nào dùng bảng hay cây quyết định, điền bảng 2 điều kiện, tự viết đủ 2³ cột cho luật miễn phạt có chấm, bảng sự kiện – phản hồi của barrier bãi đỗ.',
  de: [E1, E2, E4, E3],
});
