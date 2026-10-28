/**
 * SWR302 · 8.4 — Prototyping risks and success factors (Wiegers Ch.15 · 18–24).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Prototype risks 1 — name the risk',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers’ four prototyping risks: <b>pressure to release the prototype</b>, <b>distraction by details</b>, <b>unrealistic performance expectations</b>, <b>investing excessive effort in prototypes</b>. Name the risk in each story.</p>', vi: '<p>Bốn rủi ro: áp lực phát hành prototype, sa đà chi tiết, kỳ vọng hiệu năng phi thực tế, đầu tư quá mức. Gọi tên rủi ro trong từng tình huống.</p>' },
  cot: 'Risk', luaChon: ['Pressure to release the prototype', 'Distraction by details', 'Unrealistic performance expectations', 'Investing excessive effort in prototypes'],
  hang: [
    ['The director sees the clickable demo and says: "Great, put it live next week."', 'Pressure to release the prototype'],
    ['The review meeting spends an hour on button colours instead of the missing refund flow.', 'Distraction by details'],
    ['Search in the demo is instant (hard-coded results); users now expect the same with 5 million records.', 'Unrealistic performance expectations'],
    ['The team prototyped the whole system for two months and has no time left to build it properly.', 'Investing excessive effort in prototypes'],
    ['A slick, full-colour prototype makes users argue about fonts.', 'Distraction by details'],
  ],
  giaiThich: '<p>Mitigations: say clearly the prototype is throwaway (and make it look rough); limit it to the uncertain parts; explain that performance is not representative; time-box the prototyping effort.</p>',
  goiY: ['"Đưa lên chạy luôn" ⇒ áp lực phát hành.', 'Tranh luận màu/chữ ⇒ sa đà chi tiết.'],
  loiHayGap: ['Nhầm sa đà chi tiết với đầu tư quá mức.', 'Không nhận ra kết quả "hard-coded" gây kỳ vọng hiệu năng.'],
  thuatNgu: tn('prototype'),
  khaiNiem: ['prototyping risks'],
});

const E2 = tracNghiem({
  tieuDe: 'Prototype risks 2 — success factors',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Success factors: include prototyping tasks in the project plan; state each prototype’s purpose before building it and what will happen to it afterwards; plan to build multiple prototypes; create throwaways as quickly and cheaply as possible; don’t prototype requirements you already understand (except to explore design); use plausible data; don’t expect a prototype to replace written requirements.</p>', vi: '<p>Các yếu tố thành công của prototyping theo Wiegers.</p>' },
  cau: [
    { en: 'Before building a prototype you should first…', vi: 'Trước khi dựng prototype, trước hết nên…', lc: [['a', 'state its purpose and whether it will be discarded or grown'], ['b', 'choose the brand colours'], ['c', 'write production code'], ['d', 'deploy a server']], dap: 'a', giai: ['Purpose and fate decided up front.', 'Mục đích và số phận quyết từ đầu.'] },
    { en: 'The demo shows "Name 1, Name 2, Lorem ipsum…". Problem?', vi: 'Demo hiện "Name 1, Name 2, Lorem ipsum…". Vấn đề?', lc: [['a', 'Use plausible data — users cannot judge screens filled with nonsense'], ['b', 'None'], ['c', 'It should be empty'], ['d', 'It should be real patient data']], dap: 'a', giai: ['Plausible (not real personal) data.', 'Dữ liệu hợp lý (không phải dữ liệu cá nhân thật).'] },
    { en: 'Should you prototype the login page everyone already agrees on?', vi: 'Có nên làm prototype trang đăng nhập mà ai cũng đồng ý?', lc: [['a', 'No — prototype what is uncertain'], ['b', 'Yes, always prototype everything'], ['c', 'Only in paper'], ['d', 'Only if it is blue']], dap: 'a', giai: ['Spend effort where the risk is.', 'Dồn công vào chỗ có rủi ro.'] },
  ],
  goiY: ['Nêu mục đích + số phận trước khi dựng.', 'Dữ liệu hợp lý; không làm prototype điều đã rõ.'],
  loiHayGap: ['Dùng dữ liệu bệnh nhân thật trong demo.', 'Prototype mọi thứ.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('prototype'),
  khaiNiem: ['prototyping success factors'],
});

const E3 = baiJs({
  tieuDe: 'Prototype risks 3 — write a prototype plan that avoids the traps',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>ClinicCare: doctors are unsure how the new e-prescription screen should work, and IT doubts the national e-health API can answer within 3 seconds. Plan <b>two</b> prototypes. Write <code>PLANS</code>: an array of two objects <code>{ name, purpose, scope, futureUse, form, fate, timeboxDays, questions }</code>:</p><ul><li><code>scope</code>: "mock-up" or "proof of concept"; <code>futureUse</code>: "throwaway" or "evolutionary"; <code>form</code>: "paper" or "electronic".</li><li><code>fate</code>: what happens afterwards — must be consistent with <code>futureUse</code> (a throwaway is discarded or archived, never released).</li><li><code>timeboxDays</code>: a number ≤ 10 (avoid over-investing).</li><li><code>questions</code>: at least 3 evaluation questions; the UI prototype must ask about missing functionality and error conditions.</li></ul>', vi: '<p>ClinicCare: bác sĩ chưa rõ màn hình kê đơn điện tử; IT nghi API quốc gia không trả lời kịp 3 giây. Lập kế hoạch <b>hai</b> prototype với các trường như mô tả; số phận phải khớp với futureUse; timebox ≤ 10 ngày; ít nhất 3 câu hỏi đánh giá, prototype giao diện phải hỏi về chức năng thiếu và tình huống lỗi.</p>' },
  yeuCau: [{ en: 'One prototype answers the UI question, the other the technical question.', vi: 'Một prototype trả lời câu hỏi giao diện, cái kia trả lời câu hỏi kỹ thuật.' }],
  viDu: [{ input: 'UI uncertainty', output: "{ scope: 'mock-up', futureUse: 'throwaway', form: 'paper', fate: 'discard after updating the SRS', … }", explanation: '|||' }],
  tep: { 'plans.js': ["const PLANS = [\n  { name: '', purpose: '', scope: '', futureUse: '', form: '', fate: '', timeboxDays: 0, questions: [] },\n  { name: '', purpose: '', scope: '', futureUse: '', form: '', fate: '', timeboxDays: 0, questions: [] },\n];\n", "const PLANS = [\n  {\n    name: 'E-prescription screen mock-up',\n    purpose: 'Clarify how doctors want to search medicines, set dosage and sign the prescription; find missing requirements.',\n    scope: 'mock-up', futureUse: 'throwaway', form: 'paper',\n    fate: 'Discard after the findings are written into the SRS; keep photos in the project archive.',\n    timeboxDays: 3,\n    questions: [\n      'Which steps of writing a prescription are missing from these screens?',\n      'What should happen when a medicine is out of stock or the dosage exceeds the limit (error conditions)?',\n      'Are there any fields or functions here you would never use?',\n      'Is the order of the screens logical for a busy consultation?',\n    ],\n  },\n  {\n    name: 'National e-health API spike',\n    purpose: 'Check that sending one prescription through the national e-health API end to end returns within 3 seconds.',\n    scope: 'proof of concept', futureUse: 'throwaway', form: 'electronic',\n    fate: 'Discard the spike code; record the measured response times and the integration findings in the architecture notes.',\n    timeboxDays: 5,\n    questions: [\n      'What is the 95th-percentile response time for 100 test submissions?',\n      'Which error codes does the API return and how often?',\n      'Does authentication work with our certificate?',\n    ],\n  },\n];\n"] },
  kiem: (function () {
    var LIB = "if (typeof PLANS === 'undefined' || !Array.isArray(PLANS)) return 'PLANS must be an array'; if (PLANS.length !== 2) return 'plan exactly two prototypes';\nvar P = PLANS.map(function(p){ p = p || {}; return { p: p, sc: String(p.scope||'').toLowerCase().trim(), fu: String(p.futureUse||'').toLowerCase().trim(), fo: String(p.form||'').toLowerCase().trim(), all: [p.name,p.purpose,p.fate].join(' ').toLowerCase() }; });\nvar ui = P.filter(function(x){ return x.sc === 'mock-up'; })[0], poc = P.filter(function(x){ return x.sc === 'proof of concept'; })[0];\n";
    function k(moTa, body, ex) { return kiemTuy(moTa, new Function(LIB + body), ex); }
    return [
      k({ en: 'valid attribute values; one mock-up and one proof of concept', vi: 'giá trị thuộc tính hợp lệ; một mock-up và một PoC' }, "for (var i = 0; i < 2; i++) { if (['mock-up','proof of concept'].indexOf(P[i].sc) < 0) return 'scope must be \"mock-up\" or \"proof of concept\"'; if (['throwaway','evolutionary'].indexOf(P[i].fu) < 0) return 'futureUse must be \"throwaway\" or \"evolutionary\"'; if (['paper','electronic'].indexOf(P[i].fo) < 0) return 'form must be \"paper\" or \"electronic\"'; }\nreturn ui && poc ? 'OK' : 'one prototype should be a mock-up (UI question), the other a proof of concept (API question)';"),
      k({ en: 'each purpose targets the right uncertainty', vi: 'mục đích nhắm đúng điều chưa chắc chắn' }, "if (!ui || !poc) return 'need a mock-up and a proof of concept'; if (!/prescri|screen|doctor|ui|dosage/.test(ui.all)) return 'the mock-up purpose should be about the e-prescription screen'; if (!/api|e-health|ehealth|national|response|second/.test(poc.all)) return 'the proof of concept should test the e-health API response time'; return 'OK';"),
      k({ en: 'the proof of concept is electronic', vi: 'PoC là điện tử' }, "if (!poc) return 'no proof of concept'; return poc.fo === 'electronic' ? 'OK' : 'a proof of concept runs through the real layers — it cannot be paper';"),
      k({ en: 'fate is consistent with future use (throwaway never released)', vi: 'số phận khớp với future use (throwaway không phát hành)' }, "for (var i = 0; i < 2; i++) { var f = String(P[i].p.fate||'').toLowerCase(); if (f.length < 10) return 'describe the fate of ' + (P[i].p.name||'each prototype'); if (P[i].fu === 'throwaway') { if (/\\b(release|ship|deploy|go live|production|reuse the code|keep the code)\\b/.test(f) && !/\\b(not|never)\\b/.test(f)) return 'a throwaway prototype must not be released — discard or archive it'; if (!/discard|archive|throw|delete|bin/.test(f)) return 'say that the throwaway is discarded or archived'; } else if (!/grow|extend|evolve|build on|basis|foundation|keep/.test(f)) return 'an evolutionary prototype grows into the product — say so'; } return 'OK';"),
      k({ en: 'time-boxed: 1 to 10 days each', vi: 'có hạn: 1–10 ngày mỗi cái' }, "for (var i = 0; i < 2; i++) { var t = P[i].p.timeboxDays; if (typeof t !== 'number' || t < 1 || t > 10) return 'timeboxDays must be a number from 1 to 10 (got ' + t + ')'; } return 'OK';"),
      k({ en: 'evaluation questions: ≥ 3, UI asks about missing functions and errors', vi: 'câu hỏi đánh giá: ≥ 3, UI hỏi chức năng thiếu và lỗi' }, "for (var i = 0; i < 2; i++) { var q = P[i].p.questions; if (!Array.isArray(q) || q.length < 3) return 'at least 3 questions for ' + (P[i].p.name||'each prototype'); }\nif (!ui) return 'no mock-up'; var t = ui.p.questions.join(' ').toLowerCase(); if (!/missing|forgot|not let|cannot do|lack/.test(t)) return 'ask the UI evaluators what is missing'; if (!/error|fail|wrong|invalid|exceed|out of stock|exception/.test(t)) return 'ask about error conditions'; if (ui.p.questions.some(function(x){ return /^\\s*(do you like|is it (ok|good|nice))/i.test(x); })) return '\"Do you like it?\" is not a useful evaluation question'; return 'OK';", { an: true }),
    ];
  })(),
  goiY: ['Câu hỏi giao diện ⇒ mock-up giấy, throwaway; câu hỏi API ⇒ proof of concept điện tử.', 'Throwaway: ghi "discard/archive", tuyệt đối không "release".'],
  loiHayGap: ['Cho PoC ở dạng giấy.', 'Ghi số phận của throwaway là "release as version 1".'],
  giaiThich: '<p>Two small, purpose-driven, time-boxed experiments: a throwaway paper mock-up for the uncertain screen and an electronic spike for the uncertain API. Their knowledge is kept; their artefacts are discarded.</p>',
  thuatNgu: [...tn('prototype'), { en: 'time-box', vi: 'giới hạn thời gian cố định' }],
  khaiNiem: ['prototyping success factors'],
  boYeu: [{ ten: 'throwaway đem phát hành, PoC giấy', tep: { 'plans.js': "const PLANS=[{name:'Screen',purpose:'prescription screen',scope:'mock-up',futureUse:'throwaway',form:'paper',fate:'Release it as version 1 to save time.',timeboxDays:30,questions:['Do you like it?','Is it nice?','Any comments?']},{name:'API',purpose:'api speed',scope:'proof of concept',futureUse:'throwaway',form:'paper',fate:'discard',timeboxDays:5,questions:['a','b','c']}];\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Prototype risks 4 — mitigating the four risks',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Mitigations: make throwaway prototypes look rough and say clearly they will be discarded; limit the prototype to the uncertain parts; explain that its performance is not representative; time-box the prototyping effort.</p>', vi: '<p>Biện pháp giảm bốn rủi ro của prototyping.</p>' },
  cau: [
    { en: 'How do you reduce the pressure to release a throwaway prototype?', vi: 'Giảm áp lực phát hành prototype throwaway thế nào?', lc: [['a', 'Make it obviously rough (paper, greyscale) and state up front that it will be discarded'], ['b', 'Polish it until it looks finished'], ['c', 'Show it only to the CEO'], ['d', 'Build it in the production stack']], dap: 'a', giai: ['Nobody mistakes a sketch for a product.', 'Không ai nhầm bản phác thảo là sản phẩm.'] },
    { en: 'How do you avoid unrealistic performance expectations?', vi: 'Tránh kỳ vọng hiệu năng phi thực tế thế nào?', lc: [['a', 'Explain that results are hard-coded and the real system will behave differently'], ['b', 'Hide the fact'], ['c', 'Promise the same speed'], ['d', 'Remove all data']], dap: 'a', giai: ['Set expectations explicitly.', 'Nói rõ kỳ vọng.'] },
  ],
  goiY: ['Thô ⇒ không ai đòi phát hành.', 'Nói rõ kết quả là giả lập.'],
  loiHayGap: ['Làm prototype quá đẹp.', 'Hứa hiệu năng như demo.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('prototype'),
  khaiNiem: ['prototyping risks'],
});

export default moDun({
  slug: 'swr302-8-4-ch15-risks-success',
  ten: '8.6 Prototyping risks and success factors',
  moTaModule: 'Bốn rủi ro của prototyping, các yếu tố thành công, tự lập kế hoạch hai prototype cho ClinicCare (mock-up giấy + spike API) có mục đích, số phận, timebox và câu hỏi đánh giá — chấm theo tính nhất quán.',
  de: [E1, E2, E3, E4],
});
