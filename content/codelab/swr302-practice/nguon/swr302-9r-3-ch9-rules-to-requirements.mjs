/**
 * SWR302 · 9R.3 — Business rules → requirements, and traceability (Wiegers Ch.9 slides 19–21).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Rules to requirements 1 — rule or functional requirement?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>A business rule is an external statement of policy that drives system functionality; a functional requirement is the system behaviour that enforces it. They can look alike. Classify.</p>', vi: '<p>Luật là chính sách bên ngoài; yêu cầu chức năng là hành vi hệ thống thực thi luật đó.</p>' },
  cot: 'Kind', luaChon: ['Business rule', 'Functional requirement'],
  hang: [
    ['Only pharmacists may dispense controlled drugs.', 'Business rule'],
    ['The system shall ask for a pharmacist’s PIN before recording the dispensing of a controlled drug.', 'Functional requirement'],
    ['A loan is overdue the day after its due date.', 'Business rule'],
    ['The system shall e-mail the member on the first overdue day of a loan.', 'Functional requirement'],
    ['Students may borrow at most 5 books at a time.', 'Business rule'],
  ],
  giaiThich: '<p>The rule exists even without software; the requirement says what the software does about it.</p>',
  goiY: ['"The system shall …" ⇒ yêu cầu chức năng.', 'Chính sách tồn tại kể cả khi không có phần mềm ⇒ luật.'],
  loiHayGap: ['Coi mọi câu có "may only" là yêu cầu chức năng.', 'Chép luật vào yêu cầu thay vì tham chiếu.'],
  thuatNgu: tn('businessRule', 'functionalReq'),
  khaiNiem: ['rules vs requirements'],
});

const E2 = baiJs({
  tieuDe: 'Rules to requirements 2 — derive functional requirements from rules',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: '<p>Wiegers’ Chemical Tracking System example: rule #1 (action enabler) "if a container’s expiration date is reached, notify its holder"; rule #2 (fact) "a container that can form explosive decomposition products expires one year after manufacture". Write <code>DERIVED</code>: at least 3 functional requirements <code>{ id, text, rules: [...] }</code> derived from these rules, each linked (by id) to the rule(s) it comes from: <b>R1</b> and/or <b>R2</b>. Cover: computing the expiration date, notifying the holder, and identifying which containers have an expiration date.</p>', vi: '<p>Từ hai luật của Chemical Tracking System, viết ≥ 3 yêu cầu chức năng có liên kết tới luật nguồn (R1, R2): tính ngày hết hạn, báo người giữ, xác định bình nào có hạn dùng.</p>' },
  yeuCau: [{ en: 'Do not copy the rule text — refer to the rule by id.', vi: 'Không chép lại nội dung luật — tham chiếu theo id.' }],
  viDu: [{ input: 'rule R2', output: "{ id: 'FR-1', text: 'The system shall set the expiration date of a container that can form explosive decomposition products to one year after its manufacture date.', rules: ['R2'] }", explanation: '|||' }],
  tep: { 'derived.js': ["const DERIVED = [\n  // { id: 'FR-1', text: 'The system shall …', rules: ['R2'] },\n];\n", "const DERIVED = [\n  { id: 'FR-1', text: 'The system shall flag a container as able to form explosive decomposition products when its chemical is on the explosive-decomposition list.', rules: ['R2'] },\n  { id: 'FR-2', text: 'The system shall set the expiration date of a flagged container to one year after its manufacture date.', rules: ['R2'] },\n  { id: 'FR-3', text: 'The system shall e-mail the holder of a container on the day its expiration date is reached.', rules: ['R1'] },\n  { id: 'FR-4', text: 'The system shall list the containers that expire within the next 30 days for each holder.', rules: ['R1', 'R2'] },\n];\n"] },
  kiem: [
    kiemTuy({ en: 'at least 3 "shall" requirements, each linked to R1 or R2', vi: 'ít nhất 3 yêu cầu "shall", mỗi cái nối tới R1 hoặc R2' }, function () {
      if (typeof DERIVED === 'undefined' || !Array.isArray(DERIVED) || DERIVED.length < 3) return 'write at least 3 requirements';
      for (var i = 0; i < DERIVED.length; i++) {
        var r = DERIVED[i] || {};
        if (!/^the system shall\b/i.test(String(r.text))) return (r.id || i) + ': "The system shall …"';
        if (!Array.isArray(r.rules) || !r.rules.length || r.rules.some(function (x) { return ['R1', 'R2'].indexOf(x) < 0; })) return (r.id || i) + ': rules must list R1 and/or R2';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'covers expiration date, notification and identification', vi: 'phủ ngày hết hạn, thông báo và nhận diện' }, function () {
      if (typeof DERIVED === 'undefined' || !Array.isArray(DERIVED)) return 'DERIVED is missing';
      var t = DERIVED.map(function (r) { return String(r.text).toLowerCase(); }).join(' | ');
      if (!/(one year|1 year|12 months)/.test(t)) return 'compute the expiration date (one year after manufacture)';
      if (!/(notify|notif|e-?mail|alert|message)/.test(t) || !/holder|owner/.test(t)) return 'notify the holder when the date is reached';
      return /(explosive|decomposition|flag|identify|determine|list)/.test(t) ? 'OK' : 'identify which containers have an expiration date';
    }),
    kiemTuy({ en: 'the notification requirement traces to R1, the date computation to R2', vi: 'thông báo truy về R1, tính ngày truy về R2' }, function () {
      if (typeof DERIVED === 'undefined' || !Array.isArray(DERIVED)) return 'DERIVED is missing';
      var n = DERIVED.filter(function (r) { return /(notify|notif|e-?mail|alert|message)/i.test(r.text); });
      var d = DERIVED.filter(function (r) { return /(one year|1 year|12 months)/i.test(r.text); });
      if (!n.length || !n.every(function (r) { return r.rules.indexOf('R1') >= 0; })) return 'notification comes from the action enabler R1';
      return d.length && d.every(function (r) { return r.rules.indexOf('R2') >= 0; }) ? 'OK' : 'the one-year date comes from the fact R2';
    }, { an: true }),
  ],
  goiY: ['R2 (fact) ⇒ nhận diện bình + tính ngày; R1 (action enabler) ⇒ thông báo.', 'Mỗi yêu cầu ghi luật nguồn.'],
  loiHayGap: ['Chép nguyên văn luật làm yêu cầu.', 'Không ghi luật nguồn.'],
  giaiThich: '<p>One fact and one action enabler produce several functional requirements; linking them to their rules means a change to a rule immediately shows which requirements must change.</p>',
  thuatNgu: tn('businessRule', 'functionalReq', 'rtm'),
  khaiNiem: ['deriving requirements from rules'],
  boYeu: [{ ten: 'chép luật, không liên kết', tep: { 'derived.js': "const DERIVED=[{id:'FR-1',text:'If a container expiration date is reached, notify its holder.',rules:[]},{id:'FR-2',text:'A container that can form explosive products expires one year after manufacture.',rules:[]},{id:'FR-3',text:'The system shall handle chemicals.',rules:['R3']}];\n" } }],
});

const E3 = tracNghiem({
  tieuDe: 'Rules to requirements 3 — linking rules and requirements',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>To avoid redundancy, do not duplicate catalogue rules inside requirements — refer to the rule as the source. Link a requirement to its rules with an "origin" attribute in a requirements tool, with trace links in a matrix, or with hyperlinks to rule ids (fragile if the rules move).</p>', vi: '<p>Không chép luật vào yêu cầu; liên kết bằng thuộc tính "origin", ma trận truy vết hoặc liên kết.</p>' },
  cau: [
    { en: 'The VAT rate changes. With good traceability you can…', vi: 'Thuế suất VAT thay đổi. Có truy vết tốt bạn có thể…', lc: [['a', 'find immediately every requirement (and test) that depends on the VAT rule'], ['b', 'nothing — search every document by hand'], ['c', 'ignore the change'], ['d', 'rewrite the SRS']], dap: 'a', giai: ['Rule → requirements → tests.', 'Luật → yêu cầu → test.'] },
    { en: 'Why are hyperlinks to rule ids the most fragile linking method?', vi: 'Vì sao liên kết siêu văn bản tới id luật là cách mong manh nhất?', lc: [['a', 'They break when the rules move to another document or location'], ['b', 'They are too fast'], ['c', 'They cannot be clicked'], ['d', 'They are not fragile']], dap: 'a', giai: ['Location-dependent.', 'Phụ thuộc vị trí.'] },
  ],
  goiY: ['Truy vết luật ⇒ thấy ngay ảnh hưởng.', 'Hyperlink gãy khi tài liệu di chuyển.'],
  loiHayGap: ['Chép thuế suất vào 20 yêu cầu.', 'Không có liên kết nào.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('rtm', 'businessRule'),
  khaiNiem: ['rules traceability'],
});

const E4 = tracNghiem({
  tieuDe: 'Rules to requirements 4 — enforce in software or not?',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>After identifying the rules, the BA decides which pertain to the application, which must be enforced in software, and how. Some rules are enforced by people or procedures instead.</p>', vi: '<p>BA quyết định luật nào thuộc ứng dụng, luật nào phải thực thi bằng phần mềm, và thực thi thế nào.</p>' },
  cau: [
    { en: 'Rule: "Staff must wash their hands before handling samples." For a lab-management system this rule is…', vi: 'Luật: "Nhân viên phải rửa tay trước khi cầm mẫu." Với hệ thống quản lý phòng lab, luật này…', lc: [['a', 'enforced by procedure and training, not by the software'], ['b', 'a functional requirement'], ['c', 'a data requirement'], ['d', 'a quality attribute']], dap: 'a', giai: ['Not every rule becomes software behaviour.', 'Không phải luật nào cũng thành hành vi phần mềm.'] },
    { en: 'Rule: "A sample must be tested within 48 hours of collection." What might the software do?', vi: 'Luật: "Mẫu phải được xét nghiệm trong 48 giờ sau khi lấy." Phần mềm có thể làm gì?', lc: [['a', 'Warn the technician when a sample approaches 48 hours and report expired samples'], ['b', 'Nothing'], ['c', 'Delete the sample'], ['d', 'Change the rule']], dap: 'a', giai: ['Derived functional requirements enforce the rule.', 'Yêu cầu chức năng phái sinh thực thi luật.'] },
  ],
  goiY: ['Một số luật do con người/quy trình thực thi.', 'Luật thời gian ⇒ cảnh báo/báo cáo.'],
  loiHayGap: ['Biến mọi luật thành yêu cầu phần mềm.', 'Bỏ qua luật vì "không phải việc của phần mềm".'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('businessRule'),
  khaiNiem: ['enforcing rules'],
});

export default moDun({
  slug: 'swr302-9r-3-ch9-rules-to-requirements',
  ten: '4.15 Business rules to requirements and traceability',
  moTaModule: 'Phân biệt luật nghiệp vụ và yêu cầu chức năng, tự suy yêu cầu từ hai luật của Chemical Tracking System có liên kết nguồn, cách liên kết luật–yêu cầu, luật nào thực thi bằng phần mềm.',
  de: [E1, E2, E3, E4],
});
