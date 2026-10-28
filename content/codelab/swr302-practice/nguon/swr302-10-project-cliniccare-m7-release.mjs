/**
 * SWR302 · DỰ ÁN ClinicCare — Mốc 7 (chương 9–10): ưu tiên bản 2 (value/cost/risk Wiegers, MoSCoW), lập phạm vi bản 2
 * theo năng lực, viết user story + tiêu chí chấp nhận cho CR-07 đã hoãn + Interview corner.
 */
import { tn, kiemTuy, kiemKhoa, bangHtml } from './_chung.mjs';
import { deLon, kiemBang, kiemTap, objDong, objTrong } from './_lab.mjs';
import { BOI_CANH, phongVan } from './_cliniccare.mjs';

const W = { benefit: 2, penalty: 1, cost: 1, risk: 0.5 };
const F = [
  ['F1', 'Family booking (CR-07)', 8, 6, 4, 3, 13],
  ['F2', 'Video consultation', 7, 3, 9, 8, 34],
  ['F3', 'Insurance e-claims', 6, 7, 8, 7, 21],
  ['F4', 'Loyalty points', 3, 1, 3, 2, 8],
  ['F5', 'Lab results import', 7, 5, 6, 6, 21],
  ['F6', 'English user interface', 5, 4, 2, 1, 5],
];
const NOI = [
  ['F1', 'Owner: "Parents keep phoning to book for their children — release 2 must have family booking."', 'Must'],
  ['F2', 'Head doctor: "No doctor is trained for video visits yet; it is not for release 2."', "Won't"],
  ['F3', 'Manager: "E-claims would help, but patients can still claim on paper this year."', 'Should'],
  ['F4', 'Marketing: "Loyalty points would be a nice touch if there is time left."', 'Could'],
  ['F5', 'Nurses: "Importing lab results saves us an hour a day; we really want it, but we can live without it for a few months."', 'Should'],
  ['F6', 'Owner: "Our new partner contract requires an English interface from release 2."', 'Must'],
];
const CAP = 30;

const V = F.map((f) => W.benefit * f[2] + W.penalty * f[3]);
const TV = V.reduce((a, b) => a + b, 0), TC = F.reduce((s, f) => s + f[4], 0), TR = F.reduce((s, f) => s + f[5], 0);
const KQ = Object.fromEntries(F.map((f, i) => { const vp = V[i] / TV * 100, cp = f[4] / TC * 100, rp = f[5] / TR * 100; return [f[0], { vp, cp, rp, pr: vp / (cp * W.cost + rp * W.risk) }]; }));
const HANG = Object.keys(KQ).sort((a, b) => KQ[b].pr - KQ[a].pr);
const MOS = Object.fromEntries(NOI.map((x) => [x[0], x[2]]));
const pts = Object.fromEntries(F.map((f) => [f[0], f[6]]));
const PHAM_VI = (() => {
  const r = HANG.filter((k) => MOS[k] === 'Must'); let con = CAP - r.reduce((s, k) => s + pts[k], 0);
  for (const k of HANG) { if (r.includes(k) || MOS[k] === "Won't") continue; if (pts[k] <= con) { r.push(k); con -= pts[k]; } }
  return r;
})();
const r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;

const KIEM = [
  ...F.map(([k], i) => kiemTuy({ en: `A — value %, cost %, risk % and priority of ${k}`, vi: `A — value %, cost %, risk % và priority của ${k}` }, new Function(`
    if (typeof PRIORITIES === 'undefined' || !PRIORITIES || !PRIORITIES.${k}) return 'PRIORITIES.${k} is missing';
    var p = PRIORITIES.${k}, gan = function (a, b, s) { return Math.abs(Number(a) - b) <= s; };
    if (!gan(p.valuePct, ${KQ[k].vp}, 0.06)) return 'valuePct: value = 2 × benefit + 1 × penalty, ÷ total value × 100';
    if (!gan(p.costPct, ${KQ[k].cp}, 0.06)) return 'costPct = cost ÷ total cost × 100';
    if (!gan(p.riskPct, ${KQ[k].rp}, 0.06)) return 'riskPct = risk ÷ total risk × 100';
    if (!gan(p.priority, ${KQ[k].pr}, 0.012)) return 'priority = value% ÷ (cost% × 1 + risk% × 0.5)';
    return 'OK';`), { nhom: 'f1', ...(i >= 4 ? { an: true } : {}) })),
  kiemKhoa([{ moTa: { en: 'A — the ranking by priority, highest first', vi: 'A — xếp hạng theo priority, cao nhất trước' }, bieuThuc: '(RANKING || []).map(String)', chap: [HANG], kieu: 'json', nhom: 'f2', goiY: 'sort by priority, not by value' }])[0],
  ...kiemBang('MOSCOW', Object.fromEntries(NOI.map((x) => [x[0], x[2] === "Won't" ? ["Won't", 'Won’t', 'Wont'] : x[2]])), { nhom: 'f3', ten: (k) => `B — MoSCoW of ${k}`, tenVi: (k) => `B — MoSCoW của ${k}`, goiY: { F6: 'a contract obligation for release 2', F5: 'painful to omit, but there is a workaround' } }),
  kiemTap('RELEASE_2', PHAM_VI, { en: `C — release 2 scope with ${CAP} story points (Musts first, then by priority)`, vi: `C — phạm vi bản 2 với ${CAP} điểm (Must trước, rồi theo priority)` }, { nhom: 'f4' }),
  kiemTuy({ en: 'D — three user stories for family booking, in the standard form, from different angles', vi: 'D — ba user story cho đặt lịch người nhà, đúng mẫu, từ các góc khác nhau' }, function () {
    if (typeof FAMILY_STORIES === 'undefined' || !Array.isArray(FAMILY_STORIES)) return 'FAMILY_STORIES is missing';
    if (FAMILY_STORIES.length !== 3) return 'write exactly 3 stories';
    var roles = {};
    for (var i = 0; i < 3; i++) {
      var t = String((FAMILY_STORIES[i] || {}).story || '').trim();
      var m = /^as an? ([^,]{2,40}),? i want (to )?.{5,}\bso that\b.{5,}/i.exec(t);
      if (!m) return 'story ' + (i + 1) + ': "As a <role>, I want <goal> so that <benefit>"';
      roles[m[1].toLowerCase()] = 1;
    }
    if (!FAMILY_STORIES.some(function (s) { return /add|register|link/i.test(s.story) && /family|child|member|dependant|dependent/i.test(s.story); })) return 'one story should cover adding a family member to the account';
    return Object.keys(roles).length >= 2 ? 'OK' : 'include another role (e.g. the receptionist who sees who the appointment is for)';
  }, { nhom: 'f5' }),
  kiemTuy({ en: 'D — each story has Given/When/Then acceptance criteria, including the per-person limit of BR-03', vi: 'D — mỗi story có tiêu chí Given/When/Then, có giới hạn theo từng người của BR-03' }, function () {
    if (typeof FAMILY_STORIES === 'undefined' || !Array.isArray(FAMILY_STORIES)) return 'FAMILY_STORIES is missing';
    for (var i = 0; i < FAMILY_STORIES.length; i++) {
      var c = (FAMILY_STORIES[i] || {}).criteria;
      if (!Array.isArray(c) || !c.length) return 'story ' + (i + 1) + ': add acceptance criteria';
      for (var j = 0; j < c.length; j++) if (!/^given\b.+\bwhen\b.+\bthen\b/i.test(String(c[j]).trim())) return 'story ' + (i + 1) + ', criterion ' + (j + 1) + ': "Given … when … then …"';
    }
    var all = FAMILY_STORIES.map(function (s) { return (s.criteria || []).join(' '); }).join(' ').toLowerCase();
    if (!/(2|two) future/.test(all)) return 'state BR-03 in a criterion: at most 2 future appointments per person (each family member counted separately)';
    return /(refus|reject|not allowed|cannot|error|blocked)/.test(all) ? 'OK' : 'add a negative criterion (what is refused)';
  }, { nhom: 'f5' }),
];

const GIAI_STORIES = [
  { story: 'As a patient, I want to add my child as a family member to my account so that I can book visits for them.', criteria: ['Given I am signed in, when I add a family member with name and date of birth, then the member appears in my family list.', 'Given a family member is already in my list, when I add the same name and date of birth again, then the system refuses the duplicate.'] },
  { story: 'As a patient, I want to choose a family member when I book so that the appointment is for the right person.', criteria: ['Given I have a family member, when I book a slot for that member, then the appointment shows the member as the patient.', 'Given my child already holds 2 future appointments, when I book a third for the child, then the system refuses it although I hold fewer than 2 future appointments myself.'] },
  { story: 'As a receptionist, I want to see who an appointment is for and who booked it so that I check in the right person.', criteria: ['Given an appointment booked by a parent for a child, when I open the daily schedule, then I see the child as patient and the parent as booker.'] },
];

const TEP = {
  'answers/a-priorities.js': [
    `// A. Wiegers weights: benefit ${W.benefit} · penalty ${W.penalty} · cost ${W.cost} · risk ${W.risk}.\nconst PRIORITIES = {\n${F.map(([k]) => `  ${k}: { valuePct: 0, costPct: 0, riskPct: 0, priority: 0 },`).join('\n')}\n};\nconst RANKING = [];\n`,
    `// A. value = 2·benefit + penalty (total ${TV}); cost total ${TC}; risk total ${TR}.\nconst PRIORITIES = {\n${F.map(([k]) => `  ${k}: { valuePct: ${r2(KQ[k].vp)}, costPct: ${r2(KQ[k].cp)}, riskPct: ${r2(KQ[k].rp)}, priority: ${r3(KQ[k].pr)} },`).join('\n')}\n};\nconst RANKING = ${JSON.stringify(HANG)};\n`,
  ],
  'answers/b-moscow.js': [`// B. Must | Should | Could | Won't\n${objTrong('MOSCOW', MOS)}`, `// B. From what each stakeholder really said.\n${objDong('MOSCOW', MOS)}`],
  'answers/c-release.js': [`// C. Feature ids in release 2 (capacity ${CAP} story points).\nconst RELEASE_2 = [];\n`, `// C. Musts first (F1, F6), then by priority while the points fit; Won't never goes in.\nconst RELEASE_2 = ${JSON.stringify(PHAM_VI)};\n`],
  'answers/d-stories.js': [
    "// D. Three user stories for family booking, each with Given/When/Then acceptance criteria.\nconst FAMILY_STORIES = [\n  { story: 'As a …, I want … so that …', criteria: ['Given … when … then …'] },\n];\n",
    `// D. Add a member · book for a member (BR-03 per person) · what reception sees.\nconst FAMILY_STORIES = ${JSON.stringify(GIAI_STORIES, null, 2)};\n`,
  ],
};

const BANG = bangHtml(['ID', 'Candidate', 'Benefit', 'Penalty', 'Cost', 'Risk', 'Story points'], F.map((f) => f.map(String)));

const mod = deLon({
  slug: 'swr302-10-project-cliniccare-m7-release',
  ten: 'ClinicCare project — Milestone 7: Prioritising release 2',
  moTaModule: 'Dự án ClinicCare, mốc 7 (chương 9–10): bảng value/cost/risk Wiegers cho 6 ứng viên bản 2, xếp hạng, MoSCoW từ lời bên liên quan, phạm vi bản 2 theo 30 điểm story, ba user story + tiêu chí Given/When/Then cho CR-07 đặt lịch người nhà; kèm Góc phỏng vấn.',
  baiHoc: 'swr302-10-1-prioritization',
  dangBai: 'project',
  tieuDe: 'ClinicCare project — Milestone 7: Prioritising and planning release 2',
  phu: { en: 'Running project · milestone 7 of 7 · what goes into release 2 · 10 marks', vi: 'Dự án xuyên suốt · mốc 7/7 · cái gì vào bản 2 · 10 điểm' },
  moTa: {
    en: `${BOI_CANH.en}<p>Release 1 is live: reception calls dropped from 120 to 64 a day and no-shows from 15% to 6%. The team (now agile, two-week sprints) can deliver <b>${CAP} story points</b> in release 2. Candidates, rated 1–9 by the stakeholders (benefit, penalty) and the team (cost, risk):</p>${BANG}
<p><b>A.</b> Fill Wiegers’ value/cost/risk table (weights benefit ${W.benefit}, penalty ${W.penalty}, cost ${W.cost}, risk ${W.risk}) and rank the candidates.</p>
<p><b>B.</b> Classify each candidate with MoSCoW from what was said:</p><ul>${NOI.map((x) => `<li><b>${x[0]}</b> — ${x[1]}</li>`).join('')}</ul>
<p><b>C.</b> Plan release 2: all Musts, then the other candidates in priority order while the story points fit; Won’t never goes in.</p>
<p><b>D.</b> CR-07 (family booking), deferred in Milestone 6, is now in. Write three user stories with Given/When/Then acceptance criteria. Remember BR-03 is now <i>at most 2 future appointments per person</i>, family members counted separately.</p>`,
    vi: `${BOI_CANH.vi}<p>Bản 1 đã chạy: cuộc gọi giảm từ 120 xuống 64/ngày, no-show từ 15% xuống 6%. Đội (giờ làm agile, sprint 2 tuần) làm được <b>${CAP} điểm</b> ở bản 2. A. Bảng value/cost/risk và xếp hạng. B. MoSCoW theo lời bên liên quan. C. Phạm vi bản 2: Must trước, rồi theo priority khi còn điểm; Won't không bao giờ vào. D. CR-07 (đặt lịch người nhà) nay được làm: viết ba user story có tiêu chí Given/When/Then; BR-03 nay là tối đa 2 lịch hẹn tương lai MỖI NGƯỜI, người nhà tính riêng.</p>`,
  },
  chucNangChinh: [{ en: 'A. Value/cost/risk and ranking.', vi: 'A. Value/cost/risk và xếp hạng.' }, { en: 'B. MoSCoW.', vi: 'B. MoSCoW.' }, { en: 'C. Release 2 scope.', vi: 'C. Phạm vi bản 2.' }, { en: 'D. User stories for CR-07.', vi: 'D. User story cho CR-07.' }],
  yeuCauChung: [{ en: 'Percentages to 2 decimals, priority to 3 (small rounding differences accepted).', vi: 'Phần trăm 2 chữ số, priority 3 chữ số (chấp nhận sai số làm tròn nhỏ).' }],
  cayThuMuc: `answers/
├── a-priorities.js   ← const PRIORITIES = { F1: { valuePct, costPct, riskPct, priority }, … }; const RANKING = [...]
├── b-moscow.js       ← const MOSCOW = { F1: '…', … }
├── c-release.js      ← const RELEASE_2 = [...]
└── d-stories.js      ← const FAMILY_STORIES = [ { story, criteria: [...] }, … ]`,
  moHinh: { ten: 'Answer records', truong: [['PRIORITIES.Fx', '{ valuePct, costPct, riskPct, priority }', { en: 'numbers', vi: 'số' }], ['FAMILY_STORIES[i]', '{ story, criteria[] }', { en: 'Given/When/Then', vi: 'Given/When/Then' }]] },
  chucNang: [
    { ten: { en: 'A1. Value/cost/risk table', vi: 'A1. Bảng value/cost/risk' }, diem: 3, yeuCau: [{ en: 'Every candidate.', vi: 'Mọi ứng viên.' }], hook: ['Wiegers Table 16-1'] },
    { ten: { en: 'A2. Ranking', vi: 'A2. Xếp hạng' }, diem: 1, yeuCau: [{ en: 'By priority.', vi: 'Theo priority.' }], hook: ['priority'] },
    { ten: { en: 'B. MoSCoW', vi: 'B. MoSCoW' }, diem: 2, yeuCau: [{ en: 'From the quotes.', vi: 'Theo lời bên liên quan.' }], hook: ['MoSCoW'] },
    { ten: { en: 'C. Release 2 scope', vi: 'C. Phạm vi bản 2' }, diem: 2, yeuCau: [{ en: 'Musts, then priority, within capacity.', vi: 'Must, rồi priority, trong năng lực.' }], hook: ['release planning'] },
    { ten: { en: 'D. User stories', vi: 'D. User story' }, diem: 2, yeuCau: [{ en: 'Form, roles, Given/When/Then, BR-03.', vi: 'Mẫu, vai, Given/When/Then, BR-03.' }], hook: ['user stories', 'acceptance criteria'] },
  ],
  idBatBuoc: [['PRIORITIES · RANKING', 'answers/a-priorities.js'], ['MOSCOW', 'answers/b-moscow.js'], ['RELEASE_2', 'answers/c-release.js'], ['FAMILY_STORIES', 'answers/d-stories.js']],
  truDiem: [
    { en: 'Planning by value only: video consultation has high value but the highest cost and risk.', vi: 'Lập kế hoạch chỉ theo value: khám video value cao nhưng chi phí và rủi ro cao nhất.' },
    { en: 'Treating the English interface as optional — it is a contract obligation.', vi: 'Coi giao diện tiếng Anh là tuỳ chọn — đó là nghĩa vụ hợp đồng.' },
    { en: 'Acceptance criteria that only cover the happy path.', vi: 'Tiêu chí chấp nhận chỉ có đường thuận.' },
  ],
  goiY: [
    `A: value = 2·benefit + penalty ⇒ tổng value = ${TV}; tổng cost = ${TC}; tổng risk = ${TR}.`,
    'C: Must vào trước bất kể priority; rồi đi theo RANKING, bỏ qua mục không vừa và xét tiếp.',
    'D: story thứ hai nên có tiêu chí "trẻ đã có 2 lịch hẹn tương lai ⇒ từ chối lịch thứ ba dù cha mẹ còn chỗ".',
  ],
  loiHayGap: ['Quên trọng số 0.5 của risk.', 'Story vai "the system".', 'Viết tiêu chí "it works".'],
  giaiThich: {
    en: `<p>Ranking: ${HANG.map((k) => `${k} (${r3(KQ[k].pr)})`).join(' › ')}. Release 2 starts with the Musts F1 and F6 (18 points); walking the ranking, ${PHAM_VI.filter((k) => MOS[k] !== 'Must').map((k) => `${k} (${pts[k]} points) fits`).join(', ')}, while ${HANG.filter((k) => !PHAM_VI.includes(k) && MOS[k] !== "Won't").map((k) => `${k} (${pts[k]})`).join(' and ')} no longer fit — release 2 = ${PHAM_VI.join(', ')}, ${PHAM_VI.reduce((s, k) => s + pts[k], 0)} of ${CAP} points. Video consultation is Won’t: no trained doctors yet, whatever its value. The family-booking stories turn the deferred change request into testable backlog items, with BR-03 applied per person.</p><p>That closes the loop of the course: objectives (M1) → elicitation (M2) → use cases (M3) → models (M4) → SRS (M5) → change and traceability (M6) → priorities and the next release (M7).</p>`,
    vi: `<p>Xếp hạng: ${HANG.map((k) => `${k} (${r3(KQ[k].pr)})`).join(' › ')}. Bản 2 bắt đầu bằng Must F1, F6 (18 điểm); đi theo xếp hạng, ${PHAM_VI.filter((k) => MOS[k] !== 'Must').join(', ')} còn vừa, các ứng viên còn lại không vừa — bản 2 = ${PHAM_VI.join(', ')} (${PHAM_VI.reduce((s, k) => s + pts[k], 0)}/${CAP} điểm). Khám video là Won't: chưa có bác sĩ được đào tạo, dù value cao. Ba story biến CR đã hoãn thành mục backlog kiểm được, BR-03 áp theo từng người.</p><p>Khép vòng khoá học: mục tiêu (M1) → khai thác (M2) → use case (M3) → mô hình (M4) → SRS (M5) → thay đổi & truy vết (M6) → ưu tiên và bản kế tiếp (M7).</p>`,
  },
  khaiNiem: ['value/cost/risk prioritization', 'MoSCoW', 'release planning', 'user stories'],
  tienQuyet: ['Milestone 6', 'SWR302 lessons 9.1, 10.1–10.4'],
  thuatNgu: [...tn('valueCostRisk', 'moscow', 'userStory', 'acceptanceCriteria', 'backlog')],
  moTaNgan: 'Dự án ClinicCare mốc 7: ưu tiên và lập kế hoạch bản 2, story cho CR-07.',
  phut: 60,
  tep: TEP,
  kiem: KIEM,
  boYeu: [{ ten: 'xếp theo value, Must sai, story thiếu tiêu chí âm', tep: {
    'answers/b-moscow.js': `${objDong('MOSCOW', { F1: 'Must', F2: 'Should', F3: 'Must', F4: 'Could', F5: 'Should', F6: 'Could' })}`,
    'answers/c-release.js': "const RELEASE_2 = ['F1', 'F2'];\n",
    'answers/d-stories.js': "const FAMILY_STORIES = [{ story: 'As a patient, I want family booking so that it is easy.', criteria: ['It works.'] }, { story: 'As a patient, I want to book for my child so that I do not phone.', criteria: ['Given a child when I book then it is booked.'] }, { story: 'As a patient, I want to see bookings so that I know.', criteria: ['Given bookings when I open then I see them.'] }];\n",
  } }],
});

mod.de.push(phongVan({
  moc: 'prioritisation and release planning',
  khaiNiem: ['prioritization', 'release planning'],
  thuatNgu: tn('moscow', 'valueCostRisk', 'backlog'),
  cau: [
    { en: '"Every stakeholder says their feature is a Must. How do you prioritise?"', vi: '"Ai cũng nói tính năng của mình là Must. Bạn ưu tiên thế nào?"', lc: [['a', '"I tie each candidate to the business objectives, ask what happens if it waits a release, use a value/cost/risk analysis so the trade-off is visible, and let the decision maker agreed at the start decide."'], ['b', '"I do whatever the most senior person says."'], ['c', '"I pick the cheapest features."'], ['d', '"I put everything in and work overtime."']], dap: 'a', giai: ['Objectives, consequences, transparent analysis, agreed decision maker.', 'Mục tiêu, hệ quả, phân tích minh bạch, người quyết đã thống nhất.'] },
    { en: '"What is the weakness of MoSCoW?"', vi: '"Điểm yếu của MoSCoW là gì?"', lc: [['a', '"It gives no rationale for the rating and ‘Won’t’ is ambiguous about timing; I combine it with importance × urgency or value/cost/risk."'], ['b', '"It has too many levels."'], ['c', '"It only works for waterfall."'], ['d', '"It needs special software."']], dap: 'a', giai: ['Wiegers Ch.16.', 'Wiegers Ch.16.'] },
    { en: '"How do you measure whether release 1 was a success?"', vi: '"Đo bản 1 thành công thế nào?"', lc: [['a', '"Against the business objectives set in the vision: reception calls fell from 120 to 64 a day and no-shows from 15% to 6%, so both targets were met."'], ['b', '"By the number of features delivered."'], ['c', '"By lines of code."'], ['d', '"If there were no bugs."']], dap: 'a', giai: ['Business objectives are the yardstick.', 'Mục tiêu nghiệp vụ là thước đo.'] },
    { en: '"What do you put in acceptance criteria?"', vi: '"Bạn ghi gì trong tiêu chí chấp nhận?"', lc: [['a', '"The conditions the story must satisfy, as concrete examples in Given/When/Then — the normal case, the rule limits, and what must be refused — so the team and the tester agree on ‘done’ for that story."'], ['b', '"The technical design."'], ['c', '"The developer’s name."'], ['d', '"‘It works’."']], dap: 'a', giai: ['Concrete, testable, including negative cases.', 'Cụ thể, kiểm được, có trường hợp âm.'] },
  ],
}));

export default mod;
