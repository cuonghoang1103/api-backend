/**
 * SWR302 · 9R.2 — Documenting and discovering business rules (Wiegers Ch.9 slides 15–18).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Rules catalogue 1 — static or dynamic?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Each catalogued rule records whether it is <b>static</b> (unlikely to change) or <b>dynamic</b> (likely to change). Dynamic rules tell developers to make that functionality or data easy to update (e.g. configurable values).</p>', vi: '<p>Luật tĩnh (ít đổi) hay động (dễ đổi) — luật động ⇒ làm phần đó dễ cập nhật.</p>' },
  cot: 'Kind', luaChon: ['Static', 'Dynamic'],
  hang: [
    ['Value-added tax is 10% of the service fee.', 'Dynamic'],
    ['A child is a person under 18 years of age.', 'Static'],
    ['The weekend surcharge is 20,000 VND.', 'Dynamic'],
    ['Every invoice has exactly one customer.', 'Static'],
    ['Members with more than 1,000 points get a 5% discount.', 'Dynamic'],
  ],
  giaiThich: '<p>Rates, prices and thresholds change; definitions and structural facts rarely do.</p>',
  goiY: ['Giá, thuế suất, ngưỡng ⇒ động.', 'Định nghĩa, sự thật cấu trúc ⇒ tĩnh.'],
  loiHayGap: ['Coi thuế suất là tĩnh.', 'Hard-code các giá trị động.'],
  thuatNgu: tn('businessRule'),
  khaiNiem: ['business rule attributes'],
});

const E2 = baiJs({
  tieuDe: 'Rules catalogue 2 — write catalogue entries',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: '<p>Write <code>CATALOG</code>: three entries for these rules of a gym — (1) "A member under 16 may only book classes accompanied by an adult", (2) "A personal-training session costs 300,000 VND, or 250,000 VND for gold members", (3) "When a member has not paid for 30 days, the system suspends the membership". Each entry: <code>{ id, statement, type, staticOrDynamic, source }</code> — id like BR-01, unique; type one of fact, constraint, action enabler, inference, computation; source names where the rule comes from (policy, law, manager, contract…).</p>', vi: '<p>Viết ba mục danh mục luật cho phòng gym, mỗi mục có id, phát biểu, loại, tĩnh/động, nguồn.</p>' },
  yeuCau: [{ en: 'Types: (1) constraint, (2) computation, (3) action enabler.', vi: 'Loại: (1) constraint, (2) computation, (3) action enabler.' }],
  viDu: [{ input: 'rule (2)', output: "{ id: 'BR-02', statement: '…', type: 'computation', staticOrDynamic: 'dynamic', source: 'Gym price list approved by the manager' }", explanation: '|||' }],
  tep: { 'catalog.js': ["const CATALOG = [\n  // { id: 'BR-01', statement: '', type: '', staticOrDynamic: '', source: '' },\n];\n", "const CATALOG = [\n  { id: 'BR-01', statement: 'A member under 16 may book a class only if an adult member is booked on the same class.', type: 'constraint', staticOrDynamic: 'static', source: 'Gym safety policy' },\n  { id: 'BR-02', statement: 'A personal-training session costs 300,000 VND, or 250,000 VND for gold members.', type: 'computation', staticOrDynamic: 'dynamic', source: 'Price list approved by the gym manager' },\n  { id: 'BR-03', statement: 'If a member has not paid for 30 days, the membership is suspended.', type: 'action enabler', staticOrDynamic: 'dynamic', source: 'Membership contract' },\n];\n"] },
  kiem: [
    kiemTuy({ en: 'three well-formed entries with unique ids', vi: 'ba mục đúng dạng, id không trùng' }, function () {
      if (typeof CATALOG === 'undefined' || !Array.isArray(CATALOG) || CATALOG.length !== 3) return 'CATALOG must have 3 entries';
      var seen = {};
      for (var i = 0; i < 3; i++) {
        var e = CATALOG[i] || {};
        if (!/^BR-\d{2,3}$/.test(String(e.id))) return 'entry ' + (i + 1) + ': id like BR-01';
        if (seen[e.id]) return 'duplicate id ' + e.id; seen[e.id] = 1;
        if (String(e.statement || '').split(/\s+/).length < 6) return e.id + ': write the full statement';
        if (String(e.source || '').trim().length < 4) return e.id + ': record the source of the rule';
        if (['static', 'dynamic'].indexOf(String(e.staticOrDynamic).toLowerCase()) < 0) return e.id + ': staticOrDynamic must be static or dynamic';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'the types are right', vi: 'loại đúng' }, function () {
      if (typeof CATALOG === 'undefined' || !Array.isArray(CATALOG)) return 'CATALOG is missing';
      var want = ['constraint', 'computation', 'action enabler'];
      for (var i = 0; i < 3; i++) { var t = String((CATALOG[i] || {}).type || '').toLowerCase().replace(/[-_]/g, ' ').trim(); if (t !== want[i]) return 'rule ' + (i + 1) + ' is a ' + want[i] + ' (got "' + t + '")'; }
      return 'OK';
    }),
    kiemTuy({ en: 'prices and payment periods are dynamic', vi: 'giá và kỳ hạn thanh toán là động' }, function () {
      if (typeof CATALOG === 'undefined' || !Array.isArray(CATALOG)) return 'CATALOG is missing';
      return String((CATALOG[1] || {}).staticOrDynamic).toLowerCase() === 'dynamic' ? 'OK' : 'prices change — the computation rule is dynamic';
    }, { an: true }),
  ],
  goiY: ['Giá ⇒ computation, động.', '"Khi … thì hệ thống …" ⇒ action enabler.'],
  loiHayGap: ['Thiếu nguồn của luật.', 'Coi bảng giá là luật tĩnh.'],
  giaiThich: '<p>Each rule gets an id that requirements can point to, a type that tells how it is enforced, a volatility flag that guides design, and a source that tells whom to ask when it changes.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['documenting business rules'],
  boYeu: [{ ten: 'sai loại, không nguồn', tep: { 'catalog.js': "const CATALOG=[{id:'BR-01',statement:'Under 16 need adult with them always.',type:'fact',staticOrDynamic:'static',source:''},{id:'BR-02',statement:'Training costs 300000 or 250000 for gold.',type:'fact',staticOrDynamic:'static',source:'x'},{id:'BR-02',statement:'Suspend after 30 days without payment.',type:'constraint',staticOrDynamic:'dynamic',source:'contract'}];\n" } }],
});

const E3 = phanLoai({
  tieuDe: 'Rules catalogue 3 — where did the rule come from?',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Business rules hide in: "common knowledge" of long-time staff; legacy systems (rules embedded in code); business-process models (constraints, triggers, computations at each step); document analysis (regulations, policies, contracts); data analysis; and the questions the BA asks during elicitation. Name the source of each discovery.</p>', vi: '<p>Luật nghiệp vụ ẩn ở đâu. Gọi tên nguồn của từng phát hiện.</p>' },
  cot: 'Source', luaChon: ['Common knowledge', 'Legacy system', 'Business-process modeling', 'Document analysis', 'Elicitation questions'],
  hang: [
    ['Reading the old COBOL code, the BA finds that orders over 50 million need two approvals.', 'Legacy system'],
    ['A cashier with 15 years of service says: "We never refund gift cards."', 'Common knowledge'],
    ['The new tax circular requires invoices to show the buyer’s tax code.', 'Document analysis'],
    ['While drawing the returns process, the BA sees a decision "item older than 30 days?".', 'Business-process modeling'],
    ['The BA asks "Who is allowed to cancel an order?" and learns only supervisors may.', 'Elicitation questions'],
  ],
  giaiThich: '<p>Rule-hunting questions — "Who is permitted to do this?", "Are there conditions where this is not allowed?", "How is this value calculated?" — surface rules nobody states unprompted.</p>',
  goiY: ['Đọc mã cũ ⇒ legacy system.', 'Câu hỏi "ai được phép…" ⇒ elicitation questions.'],
  loiHayGap: ['Nhầm common knowledge với elicitation questions.', 'Bỏ qua mã hệ thống cũ.'],
  thuatNgu: tn('businessRule'),
  khaiNiem: ['discovering business rules'],
});

const E4 = tracNghiem({
  tieuDe: 'Rules catalogue 4 — where to store rules',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>Manage rules as enterprise assets: a simple catalogue at first; a requirements tool storing rules as a requirement type for all projects; large or rule-heavy organisations may build a rules database, possibly with a rules engine. Rules touching safety, security, finance or compliance carry the greatest risk if unmanaged.</p>', vi: '<p>Quản lý luật như tài sản doanh nghiệp.</p>' },
  cau: [
    { en: 'A small team starts its first project. Where should it record business rules?', vi: 'Đội nhỏ bắt đầu dự án đầu tiên. Ghi luật ở đâu?', lc: [['a', 'A simple rules catalogue (table) referenced by the requirements'], ['b', 'Inside each requirement, copied again and again'], ['c', 'Nowhere'], ['d', 'Only in the code']], dap: 'a', giai: ['Start simple; reference, do not duplicate.', 'Bắt đầu đơn giản; tham chiếu, không chép lại.'] },
    { en: 'Which rules carry the greatest risk if unmanaged?', vi: 'Luật nào rủi ro nhất nếu không quản lý?', lc: [['a', 'Rules about safety, security, finance and compliance'], ['b', 'Rules about colours'], ['c', 'Rules about fonts'], ['d', 'None']], dap: 'a', giai: ['High consequence domains.', 'Lĩnh vực hậu quả cao.'] },
  ],
  goiY: ['Danh mục đơn giản là đủ để bắt đầu.', 'An toàn, bảo mật, tài chính, tuân thủ ⇒ rủi ro cao.'],
  loiHayGap: ['Chép luật vào nhiều yêu cầu.', 'Chỉ để luật trong mã nguồn.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['business rules repository'],
});

export default moDun({
  slug: 'swr302-9r-2-ch9-document-discover',
  ten: '4.14 Documenting and discovering business rules',
  moTaModule: 'Thuộc tính của luật (id, loại, tĩnh/động, nguồn), tự viết ba mục danh mục luật có chấm, nguồn phát hiện luật (kiến thức chung, hệ thống cũ, mô hình quy trình, tài liệu, câu hỏi), nơi lưu luật.',
  de: [E1, E3, E2, E4],
});
