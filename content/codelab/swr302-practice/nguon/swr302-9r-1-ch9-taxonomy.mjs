/**
 * SWR302 · 4.11 — Business rules: the five types, documenting them, rules → requirements (Wiegers Ch.9).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const LOAI = ['Fact', 'Constraint', 'Action enabler', 'Inference', 'Computation'];
const E1 = tracNghiem({
  tieuDe: 'Business rules 1 — the five types',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Wiegers’ business-rules taxonomy: <b>facts</b> (statements that are true about the business), <b>constraints</b> (restrict the actions the system or users may perform), <b>action enablers</b> (if a condition is true, trigger an activity), <b>inferences</b> (if a condition is true, establish a new fact), <b>computations</b> (formulas and algorithms).</p>', vi: '<p>Phân loại business rule của Wiegers: <b>fact</b> (điều đúng về nghiệp vụ), <b>constraint</b> (hạn chế hành động hệ thống/người dùng được làm), <b>action enabler</b> (nếu điều kiện đúng thì kích hoạt một hoạt động), <b>inference</b> (nếu điều kiện đúng thì xác lập một sự thật mới), <b>computation</b> (công thức, thuật toán).</p>' },
  cau: [
    { en: '"Every course has exactly one course code." is a…', vi: '"Mỗi môn học có đúng một mã môn." là…', lc: LOAI.map((x, i) => ['abcde'[i], x]), dap: 'a', giai: ['A statement that is simply true.', 'Một phát biểu đơn giản là đúng.'] },
    { en: '"A student may not register for more than 25 credits per semester." is a…', vi: '"Sinh viên không được đăng ký quá 25 tín chỉ mỗi kỳ." là…', lc: LOAI.map((x, i) => ['abcde'[i], x]), dap: 'b', giai: ['It restricts an action.', 'Nó hạn chế một hành động.'] },
    { en: '"If a seat is freed, offer it to the first student on the waitlist." is an…', vi: '"Nếu có chỗ trống, mời sinh viên đầu danh sách chờ." là…', lc: LOAI.map((x, i) => ['abcde'[i], x]), dap: 'c', giai: ['If condition ⇒ do something.', 'Nếu điều kiện ⇒ làm gì đó.'] },
    { en: '"If a student’s GPA is below 2.0, the student is on academic probation." is an…', vi: '"Nếu GPA dưới 2.0 thì sinh viên bị cảnh báo học vụ." là…', lc: LOAI.map((x, i) => ['abcde'[i], x]), dap: 'd', giai: ['If condition ⇒ a new fact (probation).', 'Nếu điều kiện ⇒ một sự thật mới (bị cảnh báo).'] },
    { en: '"Tuition = credits × price per credit − scholarship." is a…', vi: '"Học phí = số tín chỉ × đơn giá − học bổng." là…', lc: LOAI.map((x, i) => ['abcde'[i], x]), dap: 'e', giai: ['A formula.', 'Một công thức.'] },
  ],
  goiY: ['Action enabler kết thúc bằng một VIỆC; inference kết thúc bằng một SỰ THẬT mới.', 'Constraint thường có "may not / must / only".'],
  loiHayGap: ['Nhầm action enabler với inference.', 'Coi computation là constraint.'],
  giaiThich: '<p>Answers: a · b · c · d · e.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['business rules taxonomy'],
});

const E2 = phanLoai({
  tieuDe: 'Business rules 2 — classify the rules of an e-commerce shop',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Classify each business rule of an online shop with the five types of Wiegers.</p>', vi: '<p>Phân loại từng business rule của một shop trực tuyến theo năm loại của Wiegers.</p>' },
  cot: 'Type', luaChon: LOAI,
  hang: [
    ['Every order belongs to exactly one customer account.', 'Fact'],
    ['Orders above 20,000,000 VND must be approved by a manager before shipping.', 'Constraint'],
    ['If stock of a product falls below 10 units, send a reorder request to the supplier.', 'Action enabler'],
    ['A customer with more than 5 orders in the last 12 months is a loyal customer.', 'Inference'],
    ['Shipping fee = 15,000 VND + 5,000 VND per kg above 2 kg.', 'Computation'],
    ['Alcohol may only be sold to customers aged 18 or older.', 'Constraint'],
    ['If a loyal customer places an order, add a free gift wrap.', 'Action enabler'],
    ['A product belongs to exactly one category.', 'Fact'],
  ],
  giaiThich: '<p>Facts describe the business; constraints restrict; action enablers trigger work; inferences create new knowledge (loyal customer); computations calculate.</p>',
  goiY: ['"If … then send/add/notify" ⇒ action enabler; "… is a loyal customer" ⇒ inference.', 'Công thức có dấu =, ×, + ⇒ computation.'],
  loiHayGap: ['Xếp "loyal customer" là action enabler.', 'Xếp giới hạn tuổi là fact.'],
  thuatNgu: tn('businessRule'),
  khaiNiem: ['business rules taxonomy'],
});

const E3 = tracNghiem({
  tieuDe: 'Business rules 3 — rules and requirements',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Business rules are not software requirements: they exist outside any application. But they are the origin of many functional requirements, and each such requirement should trace back to its rule (Ch.9 slides 19–21). Keep rules in a separate catalogue with an ID, type, statement, source and whether they are static or dynamic.</p>', vi: '<p>Business rule không phải yêu cầu phần mềm: chúng tồn tại ngoài mọi ứng dụng. Nhưng chúng là nguồn của nhiều yêu cầu chức năng, và mỗi yêu cầu như vậy nên truy về rule của nó (Ch.9 slide 19–21). Giữ rule trong danh mục riêng có mã, loại, phát biểu, nguồn, tĩnh hay động.</p>' },
  cau: [
    { en: 'Why keep business rules in a separate catalogue instead of inside each requirement?', vi: 'Vì sao giữ business rule trong danh mục riêng thay vì trong từng yêu cầu?', lc: [['a', 'To make the SRS longer'], ['b', 'Because one rule can drive several requirements across projects, and when it changes you find every affected requirement through the trace'], ['c', 'Because developers prefer it'], ['d', 'There is no reason']], dap: 'b', giai: ['Reuse and change impact.', 'Tái sử dụng và phân tích ảnh hưởng khi thay đổi.'] },
    { en: 'BR-7 "Alcohol may only be sold to customers aged 18 or older" leads to which functional requirement?', vi: 'BR-7 "Rượu chỉ bán cho khách từ 18 tuổi" dẫn tới yêu cầu chức năng nào?', lc: [['a', 'The system shall use a beautiful age picker.'], ['b', 'The system shall ask for the date of birth before an alcohol product is added to the cart and refuse it for customers younger than 18.'], ['c', 'The system shall sell alcohol.'], ['d', 'None']], dap: 'b', giai: ['A testable behaviour that enforces the rule.', 'Hành vi test được thực thi luật.'] },
    { en: 'The VAT rate changes from time to time. In the catalogue this rule is…', vi: 'Thuế suất VAT thay đổi theo thời gian. Trong danh mục rule này là…', lc: [['a', 'static'], ['b', 'dynamic — design the system so the value can be changed without new code'], ['c', 'a fact'], ['d', 'not a business rule']], dap: 'b', giai: ['Dynamic rules lead to configurability requirements.', 'Rule động dẫn tới yêu cầu cấu hình được.'] },
  ],
  goiY: ['Một rule — nhiều yêu cầu; rule đổi ⇒ truy ra yêu cầu bị ảnh hưởng.', 'Rule hay đổi ⇒ dynamic ⇒ cần cấu hình được.'],
  loiHayGap: ['Chép rule vào SRS mà không có mã để truy vết.', 'Mã hoá cứng giá trị của rule động.'],
  giaiThich: '<p>Answers: b · b · b.</p>',
  thuatNgu: tn('businessRule', 'rtm'),
  khaiNiem: ['business rules and requirements'],
});

const E4 = baiJs({
  tieuDe: 'Business rules 4 — write a business rules catalogue',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>From the policy of a campus bike-sharing service, write a catalogue <code>RULES</code> with one entry per rule <code>{ id: "BR-01", type, statement, source }</code>, covering all five types: (1) every bike belongs to exactly one home station; (2) a rental may last at most 4 hours; (3) if a bike is not returned within 4 hours, notify security; (4) a member with 3 late returns in a semester is a high-risk member; (5) rental fee = 2,000 VND per started 30 minutes.</p>', vi: '<p>Từ chính sách của dịch vụ xe đạp chung trong trường, viết danh mục <code>RULES</code>, mỗi rule một mục <code>{ id, type, statement, source }</code>, phủ đủ năm loại: (1) mỗi xe thuộc đúng một trạm gốc; (2) một lượt thuê tối đa 4 giờ; (3) nếu quá 4 giờ chưa trả thì báo bảo vệ; (4) hội viên trả trễ 3 lần trong một kỳ là hội viên rủi ro cao; (5) phí thuê = 2.000 đ mỗi 30 phút bắt đầu.</p>' },
  yeuCau: [{ en: 'Five entries with unique ids BR-01…, a type from the taxonomy (each type once), a statement and a source (who or which document).', vi: 'Năm mục có mã riêng BR-01…, loại theo phân loại (mỗi loại một lần), phát biểu và nguồn.' }],
  viDu: [{ input: '(1) every bike belongs to exactly one home station', output: "{ id: 'BR-01', type: 'Fact', statement: 'Every bike belongs to exactly one home station.', source: 'Fleet policy' }", explanation: 'A fact.|||Một fact.' }],
  tep: { 'rules.js': ["const RULES = [\n  { id: 'BR-01', type: '', statement: '', source: '' },\n];\n", "const RULES = [\n  { id: 'BR-01', type: 'Fact', statement: 'Every bike belongs to exactly one home station.', source: 'Fleet policy 2026' },\n  { id: 'BR-02', type: 'Constraint', statement: 'A rental may last at most 4 hours.', source: 'Rental terms' },\n  { id: 'BR-03', type: 'Action enabler', statement: 'If a bike is not returned within 4 hours of the start of the rental, notify campus security.', source: 'Security office' },\n  { id: 'BR-04', type: 'Inference', statement: 'A member with 3 late returns in one semester is a high-risk member.', source: 'Rental terms' },\n  { id: 'BR-05', type: 'Computation', statement: 'Rental fee = 2,000 VND × number of started 30-minute periods.', source: 'Price list 2026' },\n];\n"] },
  kiem: [
    kiemTuy({ en: 'five well-formed entries with unique ids', vi: 'năm mục đúng dạng, mã không trùng' }, function () {
      if (typeof RULES === 'undefined' || !Array.isArray(RULES) || RULES.length < 5) return 'write 5 rules in RULES';
      var ids = {};
      for (var i = 0; i < RULES.length; i++) {
        var r = RULES[i] || {};
        if (!/^BR-?\d+$/i.test(String(r.id))) return 'rule ' + (i + 1) + ': id like "BR-01"';
        if (ids[String(r.id).toUpperCase()]) return 'duplicate id ' + r.id; ids[String(r.id).toUpperCase()] = 1;
        if (String(r.statement || '').trim().split(/\s+/).length < 5) return r.id + ': write the statement';
        if (!String(r.source || '').trim()) return r.id + ': give the source';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'each of the five types appears with the right statement', vi: 'đủ năm loại, mỗi loại đúng phát biểu' }, function () {
      if (typeof RULES === 'undefined' || !Array.isArray(RULES)) return 'RULES is missing';
      var tim = function (t) { return RULES.filter(function (r) { return r && String(r.type).toLowerCase().trim() === t; })[0]; };
      var f = tim('fact'), c = tim('constraint'), a = tim('action enabler'), n = tim('inference'), k = tim('computation');
      if (!f || !/station/i.test(f.statement)) return 'the Fact: every bike belongs to one home station';
      if (!c || !/4 hours|four hours/i.test(c.statement)) return 'the Constraint: at most 4 hours';
      if (!a || !/security|notify/i.test(a.statement)) return 'the Action enabler: notify security';
      if (!n || !/high-risk|high risk|risk/i.test(n.statement)) return 'the Inference: high-risk member';
      if (!k || !/2,000|2000|30/.test(k.statement)) return 'the Computation: the fee formula';
      return 'OK';
    }),
    kiemTuy({ en: 'every type is a type of the taxonomy and appears exactly once', vi: 'mỗi loại thuộc phân loại và xuất hiện đúng một lần' }, function () {
      if (typeof RULES === 'undefined' || !Array.isArray(RULES)) return 'RULES is missing';
      var hop = ['fact', 'constraint', 'action enabler', 'inference', 'computation'], dem = {};
      for (var i = 0; i < RULES.length; i++) { var t = String((RULES[i] || {}).type).toLowerCase().trim(); if (hop.indexOf(t) < 0) return 'unknown type "' + (RULES[i] || {}).type + '"'; dem[t] = (dem[t] || 0) + 1; }
      var thieu = hop.filter(function (t) { return dem[t] !== 1; });
      return thieu.length ? 'each of the five types exactly once — check: ' + thieu.join(', ') : 'OK';
    }),
  ],
  goiY: ['Mỗi chính sách đúng một loại: fact, constraint, action enabler, inference, computation.', 'Nguồn = ai/tài liệu nào ra luật (để hỏi khi luật đổi).'],
  loiHayGap: ['Xếp (4) là action enabler — nó xác lập "high-risk", một sự thật mới.', 'Bỏ trống nguồn.'],
  giaiThich: '<p>One rule per type; the catalogue keeps id, type, statement and source so every functional requirement derived from a rule can trace back to it.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['business rules catalogue'],
});

export default moDun({
  slug: 'swr302-9r-1-ch9-taxonomy',
  ten: '4.11 Business rules: the five types and the catalogue',
  moTaModule: 'Năm loại business rule của Wiegers (fact, constraint, action enabler, inference, computation), phân loại luật của shop trực tuyến, rule → yêu cầu chức năng và truy vết, rule tĩnh/động, tự viết danh mục business rule có chấm.',
  de: [E1, E2, E3, E4],
});
