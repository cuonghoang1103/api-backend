/**
 * SWR302 · 22P.1 — Requirements for selecting a packaged (COTS) solution (Wiegers Ch.22 slides 1–10).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'COTS selection 1 — which selection aspect?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five aspects feed COTS selection: <b>user requirements</b> (use cases, stories — not detailed functional specs), <b>business rules</b> (can the package be configured to comply?), <b>data needs</b> (major disconnects with the vendor’s data model), <b>quality requirements</b> (performance, usability, modifiability, interoperability, security…), and <b>evaluating solutions</b>. Which aspect does each selection question belong to?</p>', vi: '<p>Năm khía cạnh khi chọn gói phần mềm có sẵn.</p>' },
  cot: 'Aspect', luaChon: ['User requirements', 'Business rules', 'Data needs', 'Quality requirements', 'Evaluating solutions'],
  hang: [
    ['"Can a receptionist book a slot for a caller in the package?"', 'User requirements'],
    ['"Can we configure the 2-hour free-cancellation policy?"', 'Business rules'],
    ['"Does the package store a family member separately from the account holder?"', 'Data needs'],
    ['"Can it serve 200 concurrent users with 2-second responses?"', 'Quality requirements'],
    ['"Weight each requirement and score the three short-listed packages."', 'Evaluating solutions'],
  ],
  giaiThich: '<p>Selecting a package is still requirements work: your prioritised requirements become the evaluation criteria.</p>',
  goiY: ['Chính sách công ty, luật ⇒ business rules.', 'Hiệu năng, khả dụng ⇒ quality.'],
  loiHayGap: ['Viết đặc tả chức năng chi tiết cho gói có sẵn.', 'Bỏ qua mô hình dữ liệu của nhà cung cấp.'],
  thuatNgu: [{ en: 'COTS (commercial off-the-shelf)', vi: 'phần mềm thương mại có sẵn' }],
  khaiNiem: ['COTS selection'],
});

const REQ = [{ id: 'R1', name: 'Online booking', weight: 10 }, { id: 'R2', name: 'SMS reminders', weight: 6 }, { id: 'R3', name: 'Vietnamese e-invoice', weight: 8 }, { id: 'R4', name: 'Open API', weight: 4 }];
const PK = { CareSuite: { R1: 1, R2: 0.5, R3: 0, R4: 1 }, MediBook: { R1: 1, R2: 1, R3: 0.5, R4: 0 }, ClinicOne: { R1: 0.5, R2: 1, R3: 1, R4: 0.5 } };
const E2 = baiJs({
  tieuDe: 'COTS selection 2 — the weighted evaluation',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Wiegers (after Lawlis et al.): 1. weight each requirement 1–10 by importance; 2. rate each package’s satisfaction of each requirement: 1 = fully, 0.5 = partially, 0 = not at all; 3. score = Σ weight × rating; 4. compare. Write <code>function evaluate(requirements, ratings)</code> returning the packages sorted by score (highest first, ties by name) as <code>[{ name, score, pct }]</code> where <code>pct</code> = score ÷ maximum possible score × 100, rounded to 1 decimal. A missing rating counts as 0; a rating other than 0, 0.5 or 1 makes the whole package <b>invalid</b> — leave it out. Then set <code>WINNER</code> for the sample.</p>', vi: '<p>Phương pháp có trọng số: trọng số 1–10, mức đáp ứng 1/0,5/0, điểm = Σ trọng số × mức; xếp hạng, % so với tối đa; mức không hợp lệ ⇒ loại gói.</p>' },
  yeuCau: [{ en: 'Maximum score = Σ weights.', vi: 'Điểm tối đa = tổng trọng số.' }],
  viDu: [{ input: 'CareSuite', output: '10 × 1 + 6 × 0.5 + 8 × 0 + 4 × 1 = 17 (60.7%)', explanation: '|||' }],
  tep: { 'evaluate.js': [`const REQUIREMENTS = ${JSON.stringify(REQ)};\nconst RATINGS = ${JSON.stringify(PK)};\nfunction evaluate(requirements, ratings) {\n  return [];\n}\nconst WINNER = '';\n`, `const REQUIREMENTS = ${JSON.stringify(REQ)};\nconst RATINGS = ${JSON.stringify(PK)};\nfunction evaluate(requirements, ratings) {\n  var max = requirements.reduce(function (s, r) { return s + r.weight; }, 0);\n  var out = [];\n  Object.keys(ratings).forEach(function (name) {\n    var rt = ratings[name], ok = true, score = 0;\n    requirements.forEach(function (r) {\n      var v = Object.prototype.hasOwnProperty.call(rt, r.id) ? rt[r.id] : 0;\n      if ([0, 0.5, 1].indexOf(v) < 0) ok = false;\n      else score += r.weight * v;\n    });\n    if (ok) out.push({ name: name, score: score, pct: max ? Math.round(score / max * 1000) / 10 : 0 });\n  });\n  return out.sort(function (a, b) { return b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0); });\n}\nconst WINNER = evaluate(REQUIREMENTS, RATINGS)[0].name;\n`] },
  kiem: [
    kiemTuy({ en: 'scores and ranking on the sample', vi: 'điểm và xếp hạng trên mẫu' }, function () {
      if (typeof evaluate !== 'function') return 'evaluate is not a function';
      var r = evaluate(REQUIREMENTS, RATINGS);
      var want = '[{"name":"ClinicOne","score":21,"pct":75},{"name":"MediBook","score":20,"pct":71.4},{"name":"CareSuite","score":17,"pct":60.7}]';
      return JSON.stringify(r) === want ? 'OK' : 'got ' + JSON.stringify(r);
    }),
    kiemTuy({ en: 'WINNER', vi: 'WINNER' }, function () {
      return typeof WINNER !== 'undefined' && WINNER === 'ClinicOne' ? 'OK' : 'the highest weighted score wins';
    }),
    kiemTuy({ en: 'hidden: missing ratings = 0, invalid ratings exclude the package, ties by name', vi: 'ẩn: thiếu = 0, mức sai loại gói, hoà theo tên' }, function () {
      if (typeof evaluate !== 'function') return 'evaluate is not a function';
      var rq = [{ id: 'A', weight: 5 }, { id: 'B', weight: 5 }];
      var r = evaluate(rq, { Zeta: { A: 1 }, Alpha: { B: 1 }, Bad: { A: 0.7, B: 1 } });
      return JSON.stringify(r) === '[{"name":"Alpha","score":5,"pct":50},{"name":"Zeta","score":5,"pct":50}]' ? 'OK' : 'got ' + JSON.stringify(r);
    }, { an: true }),
  ],
  goiY: ['Điểm = Σ trọng số × mức.', 'Kiểm mức ∈ {0, 0.5, 1}; sai ⇒ bỏ cả gói.'],
  loiHayGap: ['Cộng mức mà quên nhân trọng số.', 'Coi 0.7 là đáp ứng một phần.'],
  giaiThich: '<p>The matrix makes the decision transparent and defensible; changing a weight instantly re-ranks the packages. Here MediBook has the best functional fit on reminders, but ClinicOne wins because it satisfies the heavily weighted Vietnamese e-invoice requirement.</p>',
  thuatNgu: [{ en: 'evaluation matrix', vi: 'ma trận đánh giá' }],
  khaiNiem: ['weighted COTS evaluation'],
  boYeu: [{ ten: 'không nhân trọng số', tep: { 'evaluate.js': `const REQUIREMENTS = ${JSON.stringify(REQ)};\nconst RATINGS = ${JSON.stringify(PK)};\nfunction evaluate(rq, rt){ return Object.keys(rt).map(function(n){ var s=0; rq.forEach(function(r){ s+=rt[n][r.id]||0; }); return {name:n,score:s,pct:Math.round(s/rq.length*1000)/10}; }).sort(function(a,b){return b.score-a.score;}); }\nconst WINNER = 'MediBook';\n` } }],
});

const E3 = tracNghiem({
  tieuDe: 'COTS selection 3 — requirements at the right level',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Focus COTS acquisition requirements at the user-requirement level: there is little point specifying detailed functional requirements or designing a UI, since the vendor already did that. Evaluate business rules that matter most, look for real data-model disconnects (not just different names), and explore quality attributes.</p>', vi: '<p>Yêu cầu chọn gói ở cấp yêu cầu người dùng.</p>' },
  cau: [
    { en: 'Before buying a package, should you design the screens in detail?', vi: 'Trước khi mua gói, có nên thiết kế màn hình chi tiết?', lc: [['a', 'No — specify user requirements and evaluate how the package supports them'], ['b', 'Yes, every pixel'], ['c', 'Only colours'], ['d', 'Only for mobile']], dap: 'a', giai: ['The vendor already designed the UI.', 'Nhà cung cấp đã thiết kế giao diện.'] },
    { en: 'The vendor calls patients "contacts". Is this a data disconnect?', vi: 'Nhà cung cấp gọi bệnh nhân là "contacts". Đây có phải lệch dữ liệu?', lc: [['a', 'Not necessarily — look for real structural gaps, not merely different names'], ['b', 'Yes, reject the package'], ['c', 'Yes, always'], ['d', 'It does not matter at all']], dap: 'a', giai: ['Names differ; structure matters.', 'Tên khác không quan trọng bằng cấu trúc.'] },
  ],
  goiY: ['Cấp yêu cầu người dùng.', 'Tìm khác biệt cấu trúc, không phải tên.'],
  loiHayGap: ['Viết SRS chi tiết cho gói có sẵn.', 'Loại gói vì tên trường khác.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('userReq'),
  khaiNiem: ['COTS requirements'],
});

const E4 = tracNghiem({
  tieuDe: 'COTS selection 4 — common selection challenges',
  doKho: 'MEDIUM', phut: 4,
  moTa: { en: '<p>Too many candidates ⇒ a short list of key criteria to narrow down. Too many criteria ⇒ use the business objectives to pick the most important. Vendor misrepresentation and demos that look great ⇒ ask the vendor to walk through your actual use cases.</p>', vi: '<p>Thách thức thường gặp khi chọn gói.</p>' },
  cau: [
    { en: 'A demo looks perfect. How do you check the package really fits?', vi: 'Buổi demo trông hoàn hảo. Kiểm thế nào gói thực sự phù hợp?', lc: [['a', 'Ask the vendor to walk through your own use cases with your data'], ['b', 'Trust the demo'], ['c', 'Read the brochure'], ['d', 'Ask the salesperson’s opinion']], dap: 'a', giai: ['Your scenarios, not theirs.', 'Kịch bản của bạn, không phải của họ.'] },
  ],
  goiY: ['Dùng use case của mình khi demo.', 'Mục tiêu nghiệp vụ chọn tiêu chí.'],
  loiHayGap: ['Tin demo chuẩn bị sẵn.', 'Đánh giá với 200 tiêu chí ngay từ đầu.'],
  giaiThich: '<p>Answers: a.</p>',
  thuatNgu: [{ en: 'COTS', vi: 'phần mềm thương mại có sẵn' }],
  khaiNiem: ['COTS selection'],
});

export default moDun({
  slug: 'swr302-22p-1-ch22-selecting',
  ten: '12.3 Selecting a packaged (COTS) solution',
  moTaModule: 'Năm khía cạnh chọn gói phần mềm có sẵn, tự viết phương pháp đánh giá có trọng số (trọng số × mức đáp ứng, % tối đa, loại gói sai) có chấm, yêu cầu ở đúng cấp, thách thức khi chọn.',
  de: [E1, E2, E3, E4],
});
