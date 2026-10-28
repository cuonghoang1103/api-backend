/**
 * SWR302 · 32R.2 — Requirements-related risks across elicitation, analysis, specification, validation and management (Wiegers Ch.32 slides 10–17).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Requirements risks 1 — which stage does the risk belong to?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers groups requirements risks by stage: <b>elicitation</b> (vision and scope, time spent, customer involvement, innovative products, nonfunctional requirements, solutions presented as needs…), <b>analysis</b> (prioritisation, technically difficult features, unfamiliar technologies), <b>specification</b> (understanding, time pressure to proceed with TBDs, ambiguous terminology, design in requirements), <b>validation</b> (unvalidated requirements, inspection proficiency) and <b>management</b> (changing requirements, change process, unimplemented requirements, expanding scope).</p>', vi: '<p>Rủi ro yêu cầu theo giai đoạn.</p>' },
  cot: 'Stage', luaChon: ['Elicitation', 'Analysis', 'Specification', 'Validation', 'Management'],
  hang: [
    ['Users propose "a drop-down with all doctors" instead of describing their need.', 'Elicitation'],
    ['Nobody has checked whether real-time bed tracking is technically possible.', 'Analysis'],
    ['The team starts coding with 15 TBDs still open because of schedule pressure.', 'Specification'],
    ['The 200-page SRS was never reviewed by anyone outside the BA team.', 'Validation'],
    ['A requirement was approved but nobody can find it in the design or tests.', 'Management'],
    ['Quality attributes were never discussed with the customers.', 'Elicitation'],
  ],
  giaiThich: '<p>Each stage has typical risks — and typical mitigations taken from the practices of the earlier chapters.</p>',
  goiY: ['Giải pháp thay cho nhu cầu, NFR bị bỏ ⇒ khai thác.', 'Không ai review ⇒ thẩm định.'],
  loiHayGap: ['Xếp TBD vào quản lý.', 'Xếp "không tìm thấy trong thiết kế" vào đặc tả.'],
  thuatNgu: tn('tbd', 'nfr', 'rtm'),
  khaiNiem: ['requirements risks'],
});

const E2 = phanLoai({
  tieuDe: 'Requirements risks 2 — choose the mitigation',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Choose the mitigation Wiegers suggests for each risk.</p>', vi: '<p>Chọn biện pháp giảm thiểu cho từng rủi ro.</p>' },
  cot: 'Mitigation', luaChon: ['Write a vision and scope document early', 'Prototypes and focus groups for early feedback', 'Peer review with developers, testers and customers', 'Requirements tracing', 'Use the documented scope as the benchmark for changes'],
  hang: [
    ['Scope creep because nobody shares an understanding of what the product is and is not.', 'Write a vision and scope document early'],
    ['A first-of-its-kind product whose market response is hard to predict.', 'Prototypes and focus groups for early feedback'],
    ['Developers and customers interpret the requirements differently.', 'Peer review with developers, testers and customers'],
    ['Requirements get overlooked during design, construction or testing.', 'Requirements tracing'],
    ['Change requests keep arriving and are hard to accept or refuse.', 'Use the documented scope as the benchmark for changes'],
  ],
  giaiThich: '<p>Risk management in requirements is mostly applying the good practices of the course deliberately to the risks you see.</p>',
  goiY: ['Hiểu khác nhau ⇒ review đa góc nhìn.', 'Bị bỏ sót khi làm ⇒ truy vết.'],
  loiHayGap: ['Dùng prototype để chống bỏ sót yêu cầu khi test.', 'Không có thước đo phạm vi.'],
  thuatNgu: tn('visionScope', 'rtm', 'inspection'),
  khaiNiem: ['mitigating requirements risks'],
});

const E3 = baiJs({
  tieuDe: 'Requirements risks 3 — write risk statements',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Write <code>RISK_LIST</code>: three requirements risks for ClinicCare, each <code>{ id, statement, stage, mitigation }</code>. The statement must be in condition–consequence form ("If …, then …"); <code>stage</code> one of elicitation, analysis, specification, validation, management; the three risks must cover three different stages; each mitigation is a concrete action (at least 6 words).</p>', vi: '<p>Viết ba rủi ro yêu cầu cho ClinicCare dạng "If …, then …", ba giai đoạn khác nhau, mỗi rủi ro có biện pháp cụ thể.</p>' },
  yeuCau: [{ en: 'Ids unique, like RK-1.', vi: 'Id không trùng, dạng RK-1.' }],
  viDu: [{ input: 'elicitation', output: "{ id: 'RK-1', statement: 'If pharmacists are not interviewed, then the e-prescription flow may miss dispensing rules.', stage: 'elicitation', mitigation: 'Schedule an interview and an observation session with the pharmacist in week 2.' }", explanation: '|||' }],
  tep: { 'risk-list.js': ["const RISK_LIST = [\n  // { id: 'RK-1', statement: 'If …, then …', stage: '', mitigation: '' },\n];\n", "const RISK_LIST = [\n  { id: 'RK-1', statement: 'If pharmacists are not interviewed, then the e-prescription flow may miss dispensing rules.', stage: 'elicitation', mitigation: 'Schedule an interview and an observation session with the pharmacist in week 2.' },\n  { id: 'RK-2', statement: 'If the cancellation fee stays TBD when sprint 3 starts, then developers may implement the wrong rule.', stage: 'specification', mitigation: 'Assign the clinic owner to decide the fee by the end of sprint 2 and log it in the issue tracker.' },\n  { id: 'RK-3', statement: 'If change requests are accepted without impact analysis, then release 1 may slip by weeks.', stage: 'management', mitigation: 'Route every change through the CCB with an impact analysis based on the RTM.' },\n];\n"] },
  kiem: [
    kiemTuy({ en: 'three well-formed risks with unique ids', vi: 'ba rủi ro đúng dạng, id không trùng' }, function () {
      if (typeof RISK_LIST === 'undefined' || !Array.isArray(RISK_LIST) || RISK_LIST.length !== 3) return 'RISK_LIST must have 3 risks';
      var seen = {};
      for (var i = 0; i < 3; i++) {
        var r = RISK_LIST[i] || {};
        if (!/^RK-\d+$/.test(String(r.id))) return 'risk ' + (i + 1) + ': id like RK-1';
        if (seen[r.id]) return 'duplicate id ' + r.id; seen[r.id] = 1;
        if (!/^if\b.+,?\s*then\b.+/i.test(String(r.statement).trim())) return r.id + ': write "If <condition>, then <consequence>"';
        if (String(r.mitigation || '').trim().split(/\s+/).length < 6) return r.id + ': give a concrete mitigation';
      }
      return 'OK';
    }),
    kiemTuy({ en: 'three different stages', vi: 'ba giai đoạn khác nhau' }, function () {
      if (typeof RISK_LIST === 'undefined' || !Array.isArray(RISK_LIST)) return 'RISK_LIST is missing';
      var ok = ['elicitation', 'analysis', 'specification', 'validation', 'management'], s = {};
      for (var i = 0; i < RISK_LIST.length; i++) { var st = String((RISK_LIST[i] || {}).stage).toLowerCase().trim(); if (ok.indexOf(st) < 0) return 'stage must be one of ' + ok.join(', '); s[st] = 1; }
      return Object.keys(s).length === 3 ? 'OK' : 'cover three different stages';
    }),
    kiemTuy({ en: 'each risk is about requirements work, and its mitigation is an action', vi: 'mỗi rủi ro liên quan tới công việc yêu cầu, và biện pháp là một hành động' }, function () {
      if (typeof RISK_LIST === 'undefined' || !Array.isArray(RISK_LIST)) return 'RISK_LIST is missing';
      for (var i = 0; i < RISK_LIST.length; i++) {
        var r = RISK_LIST[i] || {};
        if (!/(requirement|user|scope|change|tbd|review|stakeholder|pharmac|patient|doctor|interview|elicit|priorit|specif|test|backlog|story|rule|approv)/i.test(String(r.statement))) return (r.id || i) + ': the risk should concern the requirements (users, scope, changes, TBDs, reviews…)';
        if (!/^(schedule|assign|route|run|hold|review|write|ask|add|plan|invite|log|record|define|agree|use|build|create|train|track|set|document|interview|observe|prototype|baseline)\b/i.test(String(r.mitigation).trim())) return (r.id || i) + ': start the mitigation with an action verb (Schedule…, Assign…, Route…)';
      }
      return 'OK';
    }, { an: true }),
  ],
  goiY: ['"If …, then …".', 'Biện pháp có người, việc, thời điểm.'],
  loiHayGap: ['Viết rủi ro như vấn đề đã xảy ra.', 'Biện pháp chung chung "be careful".'],
  giaiThich: '<p>A good risk list names the condition, the consequence and a concrete action with an owner — then gets tracked every week.</p>',
  thuatNgu: [{ en: 'risk statement', vi: 'phát biểu rủi ro' }],
  khaiNiem: ['documenting risks'],
  boYeu: [{ ten: 'rủi ro không dạng điều kiện', tep: { 'risk-list.js': "const RISK_LIST=[{id:'RK-1',statement:'Users are busy.',stage:'elicitation',mitigation:'be careful'},{id:'RK-2',statement:'TBDs.',stage:'elicitation',mitigation:'fix them'},{id:'RK-3',statement:'Changes.',stage:'management',mitigation:'ok'}];\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Requirements risks 4 — risk is your friend',
  doKho: 'EASY', phut: 3,
  moTa: { en: '<p>Facing risks openly is healthy: the sooner a risk is identified, the cheaper it is to control. Collaborative elicitation with extensive user involvement can cut requirements creep nearly in half.</p>', vi: '<p>Đối diện rủi ro sớm là lành mạnh.</p>' },
  cau: [
    { en: 'A BA hides a risk because it "looks negative". Why is that wrong?', vi: 'BA giấu một rủi ro vì nó "trông tiêu cực". Vì sao sai?', lc: [['a', 'Risks identified early are cheaper to control; hidden risks become surprises'], ['b', 'It is not wrong'], ['c', 'Risks disappear if ignored'], ['d', 'Only managers handle risk']], dap: 'a', giai: ['Risk is your friend.', 'Rủi ro là bạn.'] },
  ],
  goiY: ['Phát hiện sớm rẻ hơn.', 'Rủi ro giấu đi thành bất ngờ.'],
  loiHayGap: ['Giấu rủi ro.', 'Nghĩ rủi ro tự biến mất.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'risk', vi: 'rủi ro' }],
  khaiNiem: ['requirements risks'],
});

export default moDun({
  slug: 'swr302-32r-2-ch32-requirements-risks',
  ten: '12.11 Requirements-related risks',
  moTaModule: 'Rủi ro yêu cầu theo giai đoạn (khai thác, phân tích, đặc tả, thẩm định, quản lý), chọn biện pháp giảm thiểu, tự viết danh sách rủi ro dạng điều kiện–hậu quả có chấm, phát hiện rủi ro sớm.',
  de: [E1, E2, E3, E4],
});
