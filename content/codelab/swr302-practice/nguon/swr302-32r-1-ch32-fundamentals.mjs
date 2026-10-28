/**
 * SWR302 · 32R.1 — Fundamentals of software risk management (Wiegers Ch.32 slides 1–9).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Risk 1 — assessment or control?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Risk management (Figure 32-1): <b>risk assessment</b> = identification, analysis (probability, impact), prioritisation; <b>risk control</b> = management planning (mitigation, contingency, owner, timeline), resolution (executing the plans), monitoring (tracking progress). Classify.</p>', vi: '<p>Đánh giá rủi ro (nhận diện, phân tích, xếp ưu tiên) vs kiểm soát rủi ro (lập kế hoạch, giải quyết, giám sát).</p>' },
  cot: 'Activity', luaChon: ['Risk assessment', 'Risk control'],
  hang: [
    ['List possible risks with a checklist of common risk factors.', 'Risk assessment'],
    ['Estimate the probability and impact of each risk.', 'Risk assessment'],
    ['Write a mitigation and a contingency plan for the top risks.', 'Risk control'],
    ['Track each week whether the mitigation is working.', 'Risk control'],
    ['Rank risks by exposure.', 'Risk assessment'],
  ],
  giaiThich: '<p>Most control effort goes to the top-priority risks identified by assessment.</p>',
  goiY: ['Nhận diện, ước xác suất/tác động, xếp hạng ⇒ đánh giá.', 'Kế hoạch, thực hiện, theo dõi ⇒ kiểm soát.'],
  loiHayGap: ['Coi xếp hạng là kiểm soát.', 'Lập danh sách rồi không làm gì.'],
  thuatNgu: [{ en: 'risk exposure', vi: 'mức phơi nhiễm rủi ro = xác suất × tác động' }],
  khaiNiem: ['risk management'],
});

const RISKS = [
  { id: 'RK-1', statement: 'If key users are not available for elicitation, then requirements may be incomplete.', probability: 0.6, impact: 8 },
  { id: 'RK-2', statement: 'If the national e-prescription API changes, then integration may be delayed.', probability: 0.3, impact: 9 },
  { id: 'RK-3', statement: 'If the stakeholders disagree on scope, then we may build the wrong product.', probability: 0.5, impact: 10 },
  { id: 'RK-4', statement: 'If the UI library is buggy, then screens may need rework.', probability: 0.2, impact: 3 },
];
const E2 = baiJs({
  tieuDe: 'Risk 2 — risk exposure and the top risks',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: '<p>Risk exposure = probability (0–1) × impact (1–10). Write <code>function topRisks(risks, n)</code> returning the ids of the <code>n</code> risks with the highest exposure (ties by id), and <code>function worthMitigating(costOfMitigation, risk, costPerImpactPoint)</code> returning <code>true</code> only if the mitigation costs less than the expected loss (exposure × costPerImpactPoint) — "it makes no sense to spend $20,000 controlling a risk whose maximum impact is $10,000". Ignore risks whose probability is outside 0–1 or impact outside 1–10.</p>', vi: '<p>Mức phơi nhiễm = xác suất × tác động. Viết <code>topRisks(risks, n)</code> và <code>worthMitigating(...)</code>: chỉ đáng giảm thiểu khi chi phí nhỏ hơn tổn thất kỳ vọng.</p>' },
  yeuCau: [{ en: 'topRisks(RISKS, 2) ⇒ ["RK-3", "RK-1"].', vi: 'topRisks(RISKS, 2) ⇒ ["RK-3", "RK-1"].' }],
  viDu: [{ input: 'RK-3', output: '0.5 × 10 = 5.0', explanation: '|||' }],
  tep: { 'risks.js': [`const RISKS = ${JSON.stringify(RISKS, null, 1)};\nfunction topRisks(risks, n) {\n  return [];\n}\nfunction worthMitigating(costOfMitigation, risk, costPerImpactPoint) {\n  return false;\n}\n`, `const RISKS = ${JSON.stringify(RISKS, null, 1)};\nfunction __ok(r) { return r && r.probability >= 0 && r.probability <= 1 && r.impact >= 1 && r.impact <= 10; }\nfunction topRisks(risks, n) {\n  return risks.filter(__ok).map(function (r) { return { id: r.id, e: r.probability * r.impact }; })\n    .sort(function (a, b) { return b.e - a.e || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); })\n    .slice(0, n).map(function (x) { return x.id; });\n}\nfunction worthMitigating(costOfMitigation, risk, costPerImpactPoint) {\n  if (!__ok(risk)) return false;\n  return costOfMitigation < risk.probability * risk.impact * costPerImpactPoint;\n}\n`] },
  kiem: [
    kiemTuy({ en: 'topRisks on the sample', vi: 'topRisks trên mẫu' }, function () {
      if (typeof topRisks !== 'function') return 'topRisks is not a function';
      var r = topRisks(RISKS, 2);
      return JSON.stringify(r) === '["RK-3","RK-1"]' ? 'OK' : 'expected ["RK-3","RK-1"] (exposures 5.0 and 4.8), got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'worthMitigating', vi: 'worthMitigating' }, function () {
      if (typeof worthMitigating !== 'function') return 'worthMitigating is not a function';
      var r = RISKS[2];
      if (worthMitigating(20000, { probability: 1, impact: 10 }, 1000) !== false) return '$20,000 to control a $10,000 loss is not worth it';
      return worthMitigating(1000, r, 1000) === true ? 'OK' : 'RK-3 expected loss 5 × 1000 = 5000 > 1000 ⇒ worth it';
    }),
    kiemTuy({ en: 'hidden: invalid risks ignored, ties by id', vi: 'ẩn: rủi ro sai bị bỏ, hoà theo id' }, function () {
      if (typeof topRisks !== 'function') return 'topRisks is not a function';
      var r = topRisks([{ id: 'B', probability: 0.5, impact: 4 }, { id: 'A', probability: 0.4, impact: 5 }, { id: 'X', probability: 1.5, impact: 9 }, { id: 'Y', probability: 0.9, impact: 0 }], 3);
      return JSON.stringify(r) === '["A","B"]' ? 'OK' : 'got ' + JSON.stringify(r);
    }, { an: true }),
  ],
  goiY: ['Exposure = probability × impact.', 'Chỉ giảm thiểu khi chi phí < tổn thất kỳ vọng.'],
  loiHayGap: ['Xếp theo tác động thay vì phơi nhiễm.', 'Chi nhiều hơn tổn thất để kiểm soát rủi ro.'],
  giaiThich: '<p>Exposure turns a long list of worries into a ranked list; comparing mitigation cost with expected loss keeps risk control economical.</p>',
  thuatNgu: [{ en: 'risk exposure', vi: 'mức phơi nhiễm rủi ro' }, { en: 'mitigation', vi: 'giảm thiểu' }],
  khaiNiem: ['risk exposure'],
  boYeu: [{ ten: 'xếp theo tác động', tep: { 'risks.js': `const RISKS = ${JSON.stringify(RISKS)};\nfunction topRisks(r,n){ return r.slice().sort(function(a,b){return b.impact-a.impact;}).slice(0,n).map(function(x){return x.id;}); }\nfunction worthMitigating(c,r,k){ return true; }\n` } }],
});

const E3 = tracNghiem({
  tieuDe: 'Risk 3 — writing a risk statement',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Write risks in a <b>condition–consequence</b> format: the risk condition, then the possible adverse outcome — "If the customers don’t agree on the product requirements, then we might satisfy only one of them." Record probability, impact, exposure, mitigation, owner and date (Figure 32-2). A risk list is not a risk management plan.</p>', vi: '<p>Viết rủi ro theo dạng điều kiện – hậu quả; danh sách rủi ro chưa phải kế hoạch quản lý rủi ro.</p>' },
  cau: [
    { en: 'Which is a well-formed risk statement?', vi: 'Phát biểu rủi ro nào đúng dạng?', lc: [['a', 'If the product owner leaves mid-project, then backlog decisions may stall for weeks.'], ['b', 'Requirements.'], ['c', 'The product owner is bad.'], ['d', 'Risk: high.']], dap: 'a', giai: ['Condition → consequence.', 'Điều kiện → hậu quả.'] },
    { en: 'A mitigation that reduces the probability of a risk is…', vi: 'Biện pháp giảm XÁC SUẤT của rủi ro là…', lc: [['a', 'naming a backup product owner and sharing knowledge regularly'], ['b', 'a contingency budget used after the risk happens'], ['c', 'ignoring it'], ['d', 'writing it in red']], dap: 'a', giai: ['Mitigation can reduce probability or impact; contingency acts after.', 'Giảm thiểu giảm xác suất hoặc tác động; dự phòng dùng khi đã xảy ra.'] },
  ],
  goiY: ['"If … then …".', 'Giảm xác suất vs dự phòng sau khi xảy ra.'],
  loiHayGap: ['Ghi rủi ro một chữ.', 'Nhầm biện pháp giảm thiểu với kế hoạch dự phòng.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: [{ en: 'contingency plan', vi: 'kế hoạch dự phòng' }],
  khaiNiem: ['documenting risks'],
});

const E4 = phanLoai({
  tieuDe: 'Risk 4 — sources of project risk',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Projects face risks from many sources: dependence on <b>external entities</b>; <b>project management</b> (poor estimation, turnover, poor visibility); <b>technology</b> (complex, leading-edge work); <b>lack of knowledge</b> (inexperience with tools or the domain); and <b>requirements</b>. Classify each risk.</p>', vi: '<p>Các nguồn rủi ro của dự án.</p>' },
  cot: 'Source', luaChon: ['External entity', 'Project management', 'Technology', 'Lack of knowledge', 'Requirements'],
  hang: [
    ['The subcontractor building the payment module may deliver late.', 'External entity'],
    ['Managers reject the team’s estimates and impose a shorter schedule.', 'Project management'],
    ['The team has never used the speech-recognition engine before.', 'Lack of knowledge'],
    ['The real-time video streaming architecture is unproven at this scale.', 'Technology'],
    ['Users keep changing their minds about the booking rules.', 'Requirements'],
  ],
  giaiThich: '<p>Requirements risks are only one family — but, as the next lesson shows, they appear in every stage of requirements work.</p>',
  goiY: ['Bên thứ ba ⇒ external entity.', 'Chưa từng dùng ⇒ lack of knowledge.'],
  loiHayGap: ['Nhầm technology với lack of knowledge.', 'Coi ước lượng bị ép là rủi ro yêu cầu.'],
  thuatNgu: [{ en: 'risk', vi: 'rủi ro' }],
  khaiNiem: ['sources of risk'],
});

export default moDun({
  slug: 'swr302-32r-1-ch32-fundamentals',
  ten: '12.10 Software risk management fundamentals',
  moTaModule: 'Đánh giá vs kiểm soát rủi ro, tự tính mức phơi nhiễm và quyết định có đáng giảm thiểu (có chấm), viết rủi ro dạng điều kiện–hậu quả, các nguồn rủi ro dự án.',
  de: [E1, E2, E3, E4],
});
