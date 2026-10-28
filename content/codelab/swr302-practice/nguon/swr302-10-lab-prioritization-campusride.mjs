/**
 * SWR302 · LAB 10 — Prioritization: CampusRide shuttle app, release 1 (Wiegers Ch.16).
 * A. bảng value/cost/risk (Bảng 16-1): value% · cost% · risk% · priority, xếp hạng · B. MoSCoW + phạm vi bản phát hành theo năng lực ·
 * C. thang ba mức (quan trọng × khẩn cấp) · D. phép thử $100.
 */
import { tn, kiemTuy, kiemKhoa, bangHtml } from './_chung.mjs';
import { deLon, kiemBang, objDong, objTrong } from './_lab.mjs';

const TS = { benefit: 2, penalty: 1, cost: 1, risk: 0.5 };
const TINH_NANG = [
  ['F1', 'Real-time shuttle map', 9, 7, 6, 5],
  ['F2', 'Seat reservation', 7, 5, 8, 7],
  ['F3', 'Arrival push alerts', 6, 4, 3, 2],
  ['F4', 'Route planner across lines', 5, 2, 7, 6],
  ['F5', 'Driver incident report', 4, 6, 2, 1],
  ['F6', 'Favourite stops', 3, 1, 1, 1],
];
const tong = (i) => TINH_NANG.reduce((s, f) => s + f[i], 0);
const VALUE = TINH_NANG.map((f) => TS.benefit * f[2] + TS.penalty * f[3]);
const TV = VALUE.reduce((a, b) => a + b, 0), TC = tong(4), TR = tong(5);
const KQ = Object.fromEntries(TINH_NANG.map((f, i) => {
  const valuePct = (VALUE[i] / TV) * 100, costPct = (f[4] / TC) * 100, riskPct = (f[5] / TR) * 100;
  return [f[0], { value: VALUE[i], valuePct, costPct, riskPct, priority: valuePct / (costPct * TS.cost + riskPct * TS.risk) }];
}));
const HANG = Object.keys(KQ).sort((a, b) => KQ[b].priority - KQ[a].priority);
const r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;

const MOSCOW_CAU = [
  ['F1', 'Sponsor: "Without the live map the app has no reason to exist."', 'Must'],
  ['F2', 'Students: "Reservation would be great, but the shuttles work without it this term; we need it by next term."', 'Should'],
  ['F3', 'Students: "Alerts would be nice; we can check the map ourselves."', 'Could'],
  ['F4', 'Sponsor: "The route planner is out of release 1 — we will revisit it next year."', 'Won’t'],
  ['F5', 'Transport office: "The law requires drivers to report incidents within 24 hours, and we must show it in the app from day one."', 'Must'],
  ['F6', 'Students: "Favourites are a nice touch if there is time left."', 'Could'],
];
const CAP = 14;
const PHAM_VI = (() => {
  const must = MOSCOW_CAU.filter((x) => x[2] === 'Must').map((x) => x[0]);
  let con = CAP - must.reduce((s, k) => s + TINH_NANG.find((f) => f[0] === k)[4], 0);
  const r = [...must];
  for (const k of HANG) {
    if (r.includes(k) || MOSCOW_CAU.find((x) => x[0] === k)[2] === 'Won’t') continue;
    const c = TINH_NANG.find((f) => f[0] === k)[4];
    if (c <= con) { r.push(k); con -= c; }
  }
  return r;
})();

const BA_MUC = [
  ['T1', 'Important to the business objectives and needed in release 1.', 'High'],
  ['T2', 'Important to the business objectives but can wait for release 2.', 'Medium'],
  ['T3', 'Neither important to the objectives nor needed soon.', 'Low'],
  ['T4', 'Needed in release 1 for the go-live campaign and essential for the core objective.', 'High'],
];
const BO_PHIEU = [
  ['Student union', { F2: 40, F3: 30, F6: 30 }],
  ['Transport office', { F2: 20, F3: 20, F4: 60 }],
  ['Dorm board', { F2: 50, F3: 10, F6: 40 }],
  ['IT', { F3: 50, F4: 30, F6: 20 }],
];
const TONG_100 = {};
for (const [, p] of BO_PHIEU) for (const [k, v] of Object.entries(p)) TONG_100[k] = (TONG_100[k] || 0) + v;
const THANG_100 = Object.keys(TONG_100).sort((a, b) => TONG_100[b] - TONG_100[a])[0];

const KIEM = [
  ...TINH_NANG.map(([k], i) => kiemTuy({ en: `A — value %, cost %, risk % and priority of ${k}`, vi: `A — value %, cost %, risk % và priority của ${k}` }, new Function(`
    if (typeof PRIORITIES === 'undefined' || !PRIORITIES || !PRIORITIES.${k}) return 'PRIORITIES.${k} is missing';
    var p = PRIORITIES.${k}, gan = function (a, b, s) { return Math.abs(Number(a) - b) <= s; };
    if (!gan(p.valuePct, ${KQ[k].valuePct}, 0.06)) return 'valuePct: value = ${TS.benefit} × benefit + ${TS.penalty} × penalty, then ÷ total value × 100';
    if (!gan(p.costPct, ${KQ[k].costPct}, 0.06)) return 'costPct = cost ÷ total cost × 100';
    if (!gan(p.riskPct, ${KQ[k].riskPct}, 0.06)) return 'riskPct = risk ÷ total risk × 100';
    if (!gan(p.priority, ${KQ[k].priority}, 0.012)) return 'priority = value% ÷ (cost% × ${TS.cost} + risk% × ${TS.risk})';
    return 'OK';`), { nhom: 'f1', ...(i >= 4 ? { an: true } : {}) })),
  kiemKhoa([{ moTa: { en: 'A — the ranking by priority, highest first', vi: 'A — xếp hạng theo priority, cao nhất trước' }, bieuThuc: '(RANKING || []).map(String)', chap: [HANG], kieu: 'json', nhom: 'f2', goiY: 'sort by priority, not by value' }])[0],
  ...kiemBang('MOSCOW', Object.fromEntries(MOSCOW_CAU.map((x) => [x[0], x[2] === 'Won’t' ? ['Won’t', "Won't", 'Wont'] : x[2]])), { nhom: 'f3', ten: (k) => `B — MoSCoW of ${k}`, tenVi: (k) => `B — MoSCoW của ${k}`, goiY: { F5: 'a legal obligation from day one', F2: 'important, but this release can go without it' } }),
  kiemKhoa([{ moTa: { en: `B — release 1 scope with a capacity of ${CAP} cost points (Musts first, then by priority)`, vi: `B — phạm vi bản 1 với năng lực ${CAP} điểm chi phí (Must trước, rồi theo priority)` }, bieuThuc: '(RELEASE_1 || []).map(String)', chap: [PHAM_VI], kieu: 'tap', nhom: 'f4', goiY: 'Musts are in whatever their priority; then add by priority while cost fits; Won’t never goes in' }])[0],
  kiemKhoa([{ moTa: { en: 'B — cost points left unused in release 1', vi: 'B — điểm chi phí còn dư ở bản 1' }, bieuThuc: 'RELEASE_1_SLACK', chap: [CAP - PHAM_VI.reduce((s, k) => s + TINH_NANG.find((f) => f[0] === k)[4], 0)], kieu: 'so', saiSo: 0, nhom: 'f4', an: true }])[0],
  ...kiemBang('THREE_LEVEL', Object.fromEntries(BA_MUC.map((x) => [x[0], x[2]])), { nhom: 'f5', ten: (k) => `C — three-level priority of ${k}`, tenVi: (k) => `C — mức ưu tiên ba bậc của ${k}` }),
  ...kiemKhoa([
    { moTa: { en: 'D — total dollars per feature', vi: 'D — tổng tiền mỗi tính năng' }, bieuThuc: `(function () { var d = DOLLARS || {}; return { ${Object.keys(TONG_100).sort().map((k) => `${k}: Number(d.${k})`).join(', ')} }; })()`, chap: [Object.fromEntries(Object.keys(TONG_100).sort().map((k) => [k, TONG_100[k]]))], kieu: 'json', nhom: 'f6', goiY: 'add up the four columns; keys F2, F3, F4, F6' },
    { moTa: { en: 'D — the feature the $100 test ranks first', vi: 'D — tính năng phép thử $100 xếp đầu' }, bieuThuc: 'DOLLARS_WINNER', chap: [THANG_100], nhom: 'f6' },
  ]),
];

const sap = (o) => Object.fromEntries(Object.keys(TONG_100).sort().map((k) => [k, o[k]]));

const BANG = bangHtml(['ID', 'Feature', 'Benefit', 'Penalty', 'Cost', 'Risk'], TINH_NANG.map((f) => f.map(String)));
const BANG_100 = bangHtml(['Stakeholder', ...Object.keys(TONG_100).sort()], BO_PHIEU.map(([t, p]) => [t, ...Object.keys(TONG_100).sort().map((k) => String(p[k] || 0))]));
const BANG_GIAI = bangHtml(['ID', 'Value', 'Value %', 'Cost %', 'Risk %', 'Priority', 'Rank'], HANG.map((k, i) => [k, String(KQ[k].value), r2(KQ[k].valuePct).toFixed(2), r2(KQ[k].costPct).toFixed(2), r2(KQ[k].riskPct).toFixed(2), r3(KQ[k].priority).toFixed(3), String(i + 1)]));

const TEP = {
  'answers/a-priorities.js': [
    `// A. Weights: benefit ${TS.benefit} · penalty ${TS.penalty} · cost ${TS.cost} · risk ${TS.risk}. Percentages to 2 decimals, priority to 3.\nconst PRIORITIES = {\n${TINH_NANG.map(([k]) => `  ${k}: { valuePct: 0, costPct: 0, riskPct: 0, priority: 0 },`).join('\n')}\n};\nconst RANKING = [];   // feature ids, highest priority first\n`,
    `// A. value = 2·benefit + 1·penalty (total ${TV}); cost total ${TC}; risk total ${TR}; priority = value% ÷ (cost% + 0.5·risk%).\nconst PRIORITIES = {\n${TINH_NANG.map(([k]) => `  ${k}: { valuePct: ${r2(KQ[k].valuePct)}, costPct: ${r2(KQ[k].costPct)}, riskPct: ${r2(KQ[k].riskPct)}, priority: ${r3(KQ[k].priority)} },`).join('\n')}\n};\nconst RANKING = ${JSON.stringify(HANG).replace(/"/g, "'")};\n`,
  ],
  'answers/b-moscow.js': [
    `// B. Must | Should | Could | Won't\n${objTrong('MOSCOW', Object.fromEntries(MOSCOW_CAU.map((x) => [x[0], ''])))}const RELEASE_1 = [];        // feature ids in release 1\nconst RELEASE_1_SLACK = 0;   // cost points left unused\n`,
    `// B. Musts are fixed (F1 sponsor, F5 law); then add by the priority ranking while cost fits; Won't never goes in.\n${objDong('MOSCOW', Object.fromEntries(MOSCOW_CAU.map((x) => [x[0], x[2] === 'Won’t' ? "Won't" : x[2]])))}const RELEASE_1 = ${JSON.stringify(PHAM_VI).replace(/"/g, "'")};\nconst RELEASE_1_SLACK = ${CAP - PHAM_VI.reduce((s, k) => s + TINH_NANG.find((f) => f[0] === k)[4], 0)};\n`,
  ],
  'answers/c-three-level.js': [`// C. High | Medium | Low\n${objTrong('THREE_LEVEL', Object.fromEntries(BA_MUC.map((x) => [x[0], ''])))}`, `// C. High = important and urgent; Medium = important, not urgent; Low = neither.\n${objDong('THREE_LEVEL', Object.fromEntries(BA_MUC.map((x) => [x[0], x[2]])))}`],
  'answers/d-dollars.js': [`// D. Total of the four stakeholders per feature, and the winner.\nconst DOLLARS = { F2: 0, F3: 0, F4: 0, F6: 0 };\nconst DOLLARS_WINNER = '';\n`, `// D. Cumulative voting: add each column.\nconst DOLLARS = ${JSON.stringify(sap(TONG_100)).replace(/"/g, '')};\nconst DOLLARS_WINNER = '${THANG_100}';\n`],
};

export default deLon({
  slug: 'swr302-10-lab-prioritization-campusride',
  ten: 'Lab 10 — Prioritization: CampusRide Release 1',
  moTaModule: 'Lab chương 10: bảng value/cost/risk của Wiegers (value%, cost%, risk%, priority, xếp hạng) cho 6 tính năng, MoSCoW từ lời bên liên quan, phạm vi bản 1 theo năng lực, thang ba mức quan trọng × khẩn cấp, phép thử $100.',
  baiHoc: 'swr302-10-1-prioritization',
  tieuDe: 'Lab 10 — Prioritization: CampusRide Release 1',
  phu: { en: 'Chapter 10 lab · value/cost/risk spreadsheet, MoSCoW, release scope, three-level scale, $100 test · 10 marks', vi: 'Lab chương 10 · bảng value/cost/risk, MoSCoW, phạm vi bản phát hành, thang ba mức, phép thử $100 · 10 điểm' },
  moTa: {
    en: `<p><b>CampusRide</b> is the app of the university shuttle buses. The team can build <b>${CAP} cost points</b> in release 1. Each feature was rated 1–9 by the stakeholders (benefit of having it, penalty of not having it) and by the developers (relative cost and technical risk):</p>${BANG}
<p><b>A.</b> Fill the value/cost/risk spreadsheet of Wiegers Table 16-1 with the weights <b>benefit ${TS.benefit} · penalty ${TS.penalty} · cost ${TS.cost} · risk ${TS.risk}</b>: value = ${TS.benefit}·benefit + ${TS.penalty}·penalty; value% = value ÷ total value × 100; cost% and risk% likewise; <b>priority = value% ÷ (cost% × ${TS.cost} + risk% × ${TS.risk})</b>. Rank the features.</p>
<p><b>B. What the stakeholders said</b>:</p><ul>${MOSCOW_CAU.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul><p>Classify each feature with MoSCoW, then plan release 1: all Musts first (whatever their priority), then the remaining features in priority order while the cost still fits ${CAP} points; Won’t is never included.</p>
<p><b>C. Three-level scale</b> (importance × urgency):</p><ul>${BA_MUC.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>D. $100 test</b> for the optional features — each stakeholder spread 100 dollars:</p>${BANG_100}`,
    vi: `<p><b>CampusRide</b> là app xe buýt nội bộ của trường. Đội làm được <b>${CAP} điểm chi phí</b> ở bản 1. Mỗi tính năng được chấm 1–9 (lợi ích khi có, thiệt hại khi thiếu — do bên liên quan; chi phí và rủi ro kỹ thuật tương đối — do đội phát triển), xem bảng ở bản tiếng Anh.</p>
<p><b>A.</b> Điền bảng value/cost/risk (Wiegers Bảng 16-1) với trọng số benefit ${TS.benefit} · penalty ${TS.penalty} · cost ${TS.cost} · risk ${TS.risk}; priority = value% ÷ (cost% × ${TS.cost} + risk% × ${TS.risk}); xếp hạng. <b>B.</b> Phân loại MoSCoW theo lời bên liên quan rồi lập phạm vi bản 1: Must trước (bất kể priority), rồi thêm theo thứ tự priority khi còn vừa ${CAP} điểm; Won’t không bao giờ vào. <b>C.</b> Thang ba mức. <b>D.</b> Phép thử $100.</p>`,
  },
  chucNangChinh: [
    { en: 'A. The value/cost/risk spreadsheet and the ranking.', vi: 'A. Bảng value/cost/risk và xếp hạng.' },
    { en: 'B. MoSCoW and the scope of release 1.', vi: 'B. MoSCoW và phạm vi bản 1.' },
    { en: 'C. The three-level scale.', vi: 'C. Thang ba mức.' },
    { en: 'D. The $100 test.', vi: 'D. Phép thử $100.' },
  ],
  yeuCauChung: [{ en: 'Percentages to 2 decimals, priority to 3 decimals (small rounding differences are accepted).', vi: 'Phần trăm 2 chữ số thập phân, priority 3 chữ số (chấp nhận sai số làm tròn nhỏ).' }],
  cayThuMuc: `answers/
├── a-priorities.js    ← const PRIORITIES = { F1: { valuePct, costPct, riskPct, priority }, … }; const RANKING = [...]
├── b-moscow.js        ← const MOSCOW = { F1: '…' }; const RELEASE_1 = [...]; const RELEASE_1_SLACK = 0
├── c-three-level.js   ← const THREE_LEVEL = { T1: '…' }
└── d-dollars.js       ← const DOLLARS = { F2, F3, F4, F6 }; const DOLLARS_WINNER = '…'`,
  moHinh: {
    ten: 'Answer records',
    truong: [
      ['PRIORITIES.Fx', '{ valuePct, costPct, riskPct, priority }', { en: 'numbers (not strings)', vi: 'số (không phải chuỗi)' }],
      ['RANKING · RELEASE_1', 'string[]', { en: 'feature ids, e.g. ["F5", "F6", …]', vi: 'mã tính năng' }],
      ['MOSCOW.*', 'string', { en: "Must · Should · Could · Won't", vi: "Must · Should · Could · Won't" }],
      ['THREE_LEVEL.*', 'string', { en: 'High · Medium · Low', vi: 'High · Medium · Low' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1. Value/cost/risk spreadsheet', vi: 'A1. Bảng value/cost/risk' }, diem: 3, yeuCau: [{ en: 'value%, cost%, risk% and priority of every feature.', vi: 'value%, cost%, risk% và priority của từng tính năng.' }], hook: ['Wiegers Table 16-1'] },
    { ten: { en: 'A2. Ranking', vi: 'A2. Xếp hạng' }, diem: 1, yeuCau: [{ en: 'Highest priority first.', vi: 'Priority cao nhất trước.' }], hook: ['priority'] },
    { ten: { en: 'B1. MoSCoW', vi: 'B1. MoSCoW' }, diem: 2, yeuCau: [{ en: 'Read what each stakeholder really said.', vi: 'Đọc kỹ điều mỗi bên thật sự nói.' }], hook: ['MoSCoW'] },
    { ten: { en: 'B2. Release 1 scope', vi: 'B2. Phạm vi bản 1' }, diem: 1.5, yeuCau: [{ en: 'Musts, then priority order within capacity.', vi: 'Must, rồi theo priority trong năng lực.' }], hook: ['release planning'] },
    { ten: { en: 'C. Three-level scale', vi: 'C. Thang ba mức' }, diem: 1, yeuCau: [{ en: 'Importance × urgency.', vi: 'Quan trọng × khẩn cấp.' }], hook: ['three-level scale'] },
    { ten: { en: 'D. $100 test', vi: 'D. Phép thử $100' }, diem: 1.5, yeuCau: [{ en: 'Totals and the winner.', vi: 'Tổng và tính năng thắng.' }], hook: ['cumulative voting'] },
  ],
  idBatBuoc: [['PRIORITIES · RANKING', 'answers/a-priorities.js'], ['MOSCOW · RELEASE_1 · RELEASE_1_SLACK', 'answers/b-moscow.js'], ['THREE_LEVEL', 'answers/c-three-level.js'], ['DOLLARS · DOLLARS_WINNER', 'answers/d-dollars.js']],
  truDiem: [
    { en: 'Ranking by value instead of priority: F1 has the highest value but not the highest value per cost and risk.', vi: 'Xếp theo value thay vì priority: F1 value cao nhất nhưng không phải cao nhất trên chi phí và rủi ro.' },
    { en: 'Forgetting the weight 2 of benefit, or adding risk without its weight 0.5.', vi: 'Quên trọng số 2 của benefit, hoặc cộng risk mà không nhân 0.5.' },
    { en: 'F5 as Could because its benefit is low: a legal obligation from day one is a Must.', vi: 'Xếp F5 là Could vì benefit thấp: nghĩa vụ pháp lý từ ngày đầu là Must.' },
    { en: 'Putting the Won’t feature into the release because capacity is left.', vi: 'Đưa tính năng Won’t vào bản phát hành vì còn năng lực.' },
  ],
  goiY: [
    `A: value = 2·B + P ⇒ tổng value = ${TV}; tổng cost = ${TC}; tổng risk = ${TR}. Vd F1: value% = ${VALUE[0]}/${TV}×100.`,
    'B: Must là thứ "không có thì không phát hành" (nhà tài trợ, luật). Must vào trước bất kể priority; sau đó đi theo RANKING ở phần A.',
    'D: cộng theo cột từng tính năng.',
  ],
  loiHayGap: [
    'Chia priority = value% ÷ (cost% + risk%) — quên trọng số risk 0.5.',
    'Tính value% bằng benefit thay vì 2·benefit + penalty.',
    'Lập phạm vi theo thứ tự value, bỏ qua Must.',
  ],
  giaiThich: {
    en: `<p>The completed spreadsheet:</p>${BANG_GIAI}<p>F5 tops the ranking: modest value but tiny cost and risk. F1 has the highest value but also high cost and risk. Release 1 = Musts F1 + F5 (8 points), then by priority F6 (1) and F3 (3) — 12 points; F2 (8) no longer fits and F4 is Won’t. The $100 test gives ${Object.entries(sap(TONG_100)).map(([k, v]) => `${k} ${v}`).join(' · ')} ⇒ ${THANG_100}.</p>`,
    vi: `<p>Bảng đã điền:</p>${BANG_GIAI}<p>F5 đứng đầu: value vừa phải nhưng chi phí và rủi ro rất thấp. F1 value cao nhất nhưng chi phí và rủi ro cũng cao. Bản 1 = Must F1 + F5 (8 điểm), rồi theo priority F6 (1) và F3 (3) — 12 điểm; F2 (8) không còn vừa và F4 là Won’t. Phép thử $100: ${Object.entries(sap(TONG_100)).map(([k, v]) => `${k} ${v}`).join(' · ')} ⇒ ${THANG_100}.</p>`,
  },
  khaiNiem: ['value/cost/risk prioritization', 'MoSCoW', 'three-level scale', '$100 test', 'release planning'],
  tienQuyet: ['SWR302 lessons 10.1, 10.3–10.4 (prioritization)'],
  thuatNgu: [...tn('moscow', 'valueCostRisk'), { en: 'relative benefit / penalty', vi: 'lợi ích khi có / thiệt hại khi thiếu (thang 1–9)' }, { en: '$100 test (cumulative voting)', vi: 'phép thử $100 — chia 100 đô ảo cho các yêu cầu' }, { en: 'capacity', vi: 'năng lực — lượng việc đội làm được trong một bản phát hành' }],
  moTaNgan: 'Lab chương 10: CampusRide — value/cost/risk, MoSCoW, phạm vi bản 1, ba mức, $100.',
  phut: 50,
  tep: TEP,
  kiem: KIEM,
  boYeu: [
    { ten: 'quên trọng số, xếp theo value', tep: { 'answers/a-priorities.js': `const PRIORITIES = {\n${TINH_NANG.map(([k, , b, p, c, r]) => { const v = b + p, tv = TINH_NANG.reduce((s, f) => s + f[2] + f[3], 0); const vp = v / tv * 100, cp = c / TC * 100, rp = r / TR * 100; return `  ${k}: { valuePct: ${r2(vp)}, costPct: ${r2(cp)}, riskPct: ${r2(rp)}, priority: ${r3(vp / (cp + rp))} },`; }).join('\n')}\n};\nconst RANKING = ['F1', 'F2', 'F3', 'F5', 'F4', 'F6'];\n` }, phaiTruot: ['priority of F1', 'the ranking by priority'] },
    { ten: 'F5 là Could, phạm vi theo value', tep: { 'answers/b-moscow.js': `${objDong('MOSCOW', { F1: 'Must', F2: 'Should', F3: 'Could', F4: "Won't", F5: 'Could', F6: 'Could' })}const RELEASE_1 = ['F1', 'F2'];\nconst RELEASE_1_SLACK = 0;\n` }, phaiTruot: ['MoSCoW of F5', 'release 1 scope'] },
  ],
});
