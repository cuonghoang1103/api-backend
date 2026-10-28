/**
 * SWR302 · 7.2 — Requirements traceability (Wiegers Ch.29: four trace directions, RTM, uses).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Traceability 1 — the four directions',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>Wiegers Figure 29-1: <b>forward to requirements</b> (customer needs → requirements), <b>backward from requirements</b> (requirements → customer needs/origin), <b>forward from requirements</b> (requirements → design, code, tests), <b>backward to requirements</b> (design, code, tests → requirements). Name the direction of each trace.</p>', vi: '<p>Hình 29-1 của Wiegers: bốn hướng truy vết. Gọi tên hướng của từng liên kết.</p>' },
  cot: 'Direction', luaChon: ['Forward to requirements', 'Backward from requirements', 'Forward from requirements', 'Backward to requirements'],
  hang: [
    ['Business objective BO-2 → user requirement UR-5', 'Forward to requirements'],
    ['FR-12 → which interview did it come from?', 'Backward from requirements'],
    ['FR-12 → test case TC-40', 'Forward from requirements'],
    ['Class BookingService → FR-12, FR-13', 'Backward to requirements'],
    ['Stakeholder request SR-3 → FR-20', 'Forward to requirements'],
    ['Test case TC-41 → which requirement does it verify?', 'Backward to requirements'],
  ],
  giaiThich: '<p>"To/from requirements" names where the requirement sits: before it are needs (forward to / backward from); after it are work products (forward from / backward to).</p>',
  goiY: ['Nhu cầu → yêu cầu: forward TO requirements.', 'Sản phẩm (code/test) → yêu cầu: backward TO requirements.'],
  loiHayGap: ['Nhầm "forward from" với "forward to".', 'Coi mọi liên kết tới test là backward.'],
  thuatNgu: tn('rtm'),
  khaiNiem: ['trace directions'],
});

const E2 = tracNghiem({
  tieuDe: 'Traceability 2 — why trace?',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Wiegers lists benefits of traceability: finding missing requirements, finding unnecessary requirements (gold plating), certification and compliance, change impact analysis, maintenance, project tracking, reengineering, reuse and testing.</p>', vi: '<p>Lợi ích của truy vết theo Wiegers: tìm yêu cầu thiếu, yêu cầu thừa (mạ vàng), chứng nhận và tuân thủ, phân tích ảnh hưởng thay đổi, bảo trì, theo dõi dự án, tái cấu trúc, tái sử dụng, kiểm thử.</p>' },
  cau: [
    { en: 'A code module traces to no requirement. This suggests…', vi: 'Một module code không truy về yêu cầu nào. Điều này gợi ý…', lc: [['a', 'gold plating or a missing requirement'], ['b', 'the module is perfect'], ['c', 'a testing tool bug'], ['d', 'nothing']], dap: 'a', giai: ['Either it is unneeded, or the requirement was never written.', 'Hoặc không cần, hoặc yêu cầu chưa được viết.'] },
    { en: 'A requirement has no test case. Risk?', vi: 'Một yêu cầu không có test case. Rủi ro?', lc: [['a', 'It may be shipped unverified'], ['b', 'None'], ['c', 'It will be deleted'], ['d', 'The build fails']], dap: 'a', giai: ['Traceability exposes untested requirements.', 'Truy vết lộ yêu cầu chưa được kiểm.'] },
    { en: 'A medical-device regulator asks you to prove every safety requirement was tested. You use…', vi: 'Cơ quan quản lý thiết bị y tế yêu cầu chứng minh mọi yêu cầu an toàn đã được test. Bạn dùng…', lc: [['a', 'the requirements traceability matrix'], ['b', 'the vision statement'], ['c', 'the backlog burndown'], ['d', 'the context diagram']], dap: 'a', giai: ['Certification is a classic use of the RTM.', 'Chứng nhận là công dụng kinh điển của RTM.'] },
    { en: 'Who should record trace links, and when?', vi: 'Ai ghi liên kết truy vết, và khi nào?', lc: [['a', 'Everyone who creates a work product, at the time they create it'], ['b', 'One BA at the end of the project'], ['c', 'Testers after release'], ['d', 'Nobody — tools guess them']], dap: 'a', giai: ['Capturing links later is costly and inaccurate.', 'Ghi sau thì tốn kém và thiếu chính xác.'] },
  ],
  goiY: ['Code không có yêu cầu ⇒ mạ vàng hoặc thiếu yêu cầu.', 'Ghi liên kết ngay khi tạo sản phẩm.'],
  loiHayGap: ['Để truy vết tới cuối dự án.', 'Cho rằng truy vết chỉ để làm đẹp tài liệu.'],
  giaiThich: '<p>Answers: a · a · a · a.</p>',
  thuatNgu: tn('rtm', 'goldPlating'),
  khaiNiem: ['benefits of traceability'],
});

const DATA_ND = [
  { id: 'UR-1', type: 'UR', from: [] },
  { id: 'UR-2', type: 'UR', from: [] },
  { id: 'FR-1', type: 'FR', from: ['UR-1'] },
  { id: 'FR-2', type: 'FR', from: ['UR-1'] },
  { id: 'FR-3', type: 'FR', from: ['UR-2'] },
  { id: 'FR-4', type: 'FR', from: [] },
  { id: 'TC-1', type: 'TC', from: ['FR-1'] },
  { id: 'TC-2', type: 'TC', from: ['FR-1', 'FR-3'] },
  { id: 'TC-3', type: 'TC', from: ['FR-9'] },
];

const E3 = baiJs({
  tieuDe: 'Traceability 3 — an RTM checker',
  doKho: 'HARD', phut: 20,
  moTa: { en: '<p>A project stores its trace links as an array of items <code>{ id, type, from }</code>: <code>type</code> is "UR" (user requirement), "FR" (functional requirement) or "TC" (test case); <code>from</code> lists the ids this item traces back to (FR → UR, TC → FR). Write <code>function check(items)</code> that returns <code>{ orphanFR, untestedFR, uncoveredUR, brokenLinks }</code>:</p><ul><li><code>orphanFR</code>: ids of FRs with no valid UR in <code>from</code> (possible gold plating).</li><li><code>untestedFR</code>: ids of FRs that no TC traces to.</li><li><code>uncoveredUR</code>: ids of URs that no FR traces to (missing requirements).</li><li><code>brokenLinks</code>: strings <code>"TC-3->FR-9"</code> for every link to an id that does not exist.</li></ul><p>Each list sorted alphabetically. Tested on hidden RTMs.</p>', vi: '<p>Liên kết truy vết lưu thành mảng <code>{ id, type, from }</code>. Viết <code>check(items)</code> trả <code>{ orphanFR, untestedFR, uncoveredUR, brokenLinks }</code> như mô tả; mỗi danh sách sắp xếp theo bảng chữ cái. Có kiểm trên RTM ẩn.</p>' },
  yeuCau: [{ en: 'A link counts only if the target exists and has the right type (FR → UR, TC → FR).', vi: 'Liên kết chỉ tính khi đích tồn tại và đúng loại (FR → UR, TC → FR).' }],
  viDu: [{ input: 'the sample RTM in rtm-sample.js', output: '{ orphanFR: ["FR-4"], untestedFR: ["FR-2","FR-4"], uncoveredUR: [], brokenLinks: ["TC-3->FR-9"] }', explanation: '|||' }],
  tep: {
    'rtm-sample.js': [`const SAMPLE = ${JSON.stringify(DATA_ND, null, 1)};\n`, `const SAMPLE = ${JSON.stringify(DATA_ND, null, 1)};\n`],
    'check.js': ["function check(items) {\n  return { orphanFR: [], untestedFR: [], uncoveredUR: [], brokenLinks: [] };\n}\n", "function check(items) {\n  var byId = {};\n  items.forEach(function (x) { byId[x.id] = x; });\n  var orphanFR = [], untestedFR = [], uncoveredUR = [], brokenLinks = [];\n  var urCovered = {}, frTested = {};\n  items.forEach(function (x) {\n    (x.from || []).forEach(function (t) {\n      var target = Object.prototype.hasOwnProperty.call(byId, t) ? byId[t] : null;\n      if (!target) { brokenLinks.push(x.id + '->' + t); return; }\n      if (x.type === 'FR' && target.type === 'UR') urCovered[t] = true;\n      if (x.type === 'TC' && target.type === 'FR') frTested[t] = true;\n    });\n  });\n  items.forEach(function (x) {\n    if (x.type === 'FR') {\n      var ok = (x.from || []).some(function (t) { return byId[t] && byId[t].type === 'UR'; });\n      if (!ok) orphanFR.push(x.id);\n      if (!frTested[x.id]) untestedFR.push(x.id);\n    }\n    if (x.type === 'UR' && !urCovered[x.id]) uncoveredUR.push(x.id);\n  });\n  return { orphanFR: orphanFR.sort(), untestedFR: untestedFR.sort(), uncoveredUR: uncoveredUR.sort(), brokenLinks: brokenLinks.sort() };\n}\n"],
  },
  kiem: (function () {
    var exp = function (o) { return JSON.stringify(o); };
    function bo(moTa, data, mong, khoa, ex) {
      return kiemTuy(moTa, new Function('var d = ' + JSON.stringify(data) + ', mong = ' + JSON.stringify(mong) + ', k = ' + JSON.stringify(khoa) + ";\nif (typeof check !== 'function') return 'check is not a function';\nvar r = check(d); if (!r) return 'check must return an object';\nfor (var i = 0; i < k.length; i++) { var a = JSON.stringify(r[k[i]]), b = JSON.stringify(mong[k[i]]); if (a !== b) return k[i] + ' should be ' + b + ', got ' + a; }\nreturn 'OK';"), ex);
    }
    var S = { orphanFR: ['FR-4'], untestedFR: ['FR-2', 'FR-4'], uncoveredUR: [], brokenLinks: ['TC-3->FR-9'] };
    var H1 = [
      { id: 'UR-1', type: 'UR', from: [] }, { id: 'UR-2', type: 'UR', from: [] }, { id: 'UR-3', type: 'UR', from: [] },
      { id: 'FR-10', type: 'FR', from: ['UR-1'] }, { id: 'FR-2', type: 'FR', from: ['UR-1', 'UR-3'] }, { id: 'FR-3', type: 'FR', from: ['FR-2'] },
      { id: 'FR-5', type: 'FR', from: ['UR-7'] },
      { id: 'TC-1', type: 'TC', from: ['FR-10'] }, { id: 'TC-2', type: 'TC', from: ['UR-2'] }, { id: 'TC-9', type: 'TC', from: ['FR-3', 'FR-77'] },
    ];
    var M1 = { orphanFR: ['FR-3', 'FR-5'], untestedFR: ['FR-2', 'FR-5'], uncoveredUR: ['UR-2'], brokenLinks: ['FR-5->UR-7', 'TC-9->FR-77'] };
    var H2 = [{ id: 'UR-1', type: 'UR', from: [] }, { id: 'FR-1', type: 'FR' }, { id: 'TC-1', type: 'TC', from: ['constructor'] }];
    var M2 = { orphanFR: ['FR-1'], untestedFR: ['FR-1'], uncoveredUR: ['UR-1'], brokenLinks: ['TC-1->constructor'] };
    void exp;
    return [
      bo({ en: 'sample: orphan FRs', vi: 'mẫu: FR mồ côi' }, DATA_ND, S, ['orphanFR']),
      bo({ en: 'sample: untested FRs and uncovered URs', vi: 'mẫu: FR chưa test, UR chưa phủ' }, DATA_ND, S, ['untestedFR', 'uncoveredUR']),
      bo({ en: 'sample: broken links', vi: 'mẫu: liên kết gãy' }, DATA_ND, S, ['brokenLinks']),
      bo({ en: 'hidden RTM: wrong-type links do not count', vi: 'RTM ẩn: liên kết sai loại không tính' }, H1, M1, ['orphanFR', 'untestedFR', 'uncoveredUR'], { an: true }),
      bo({ en: 'hidden RTM: broken links, sorted', vi: 'RTM ẩn: liên kết gãy, đã sắp xếp' }, H1, M1, ['brokenLinks'], { an: true }),
      bo({ en: 'hidden RTM: missing "from", tricky ids', vi: 'RTM ẩn: thiếu "from", id đánh lừa' }, H2, M2, ['orphanFR', 'untestedFR', 'uncoveredUR', 'brokenLinks'], { an: true }),
    ];
  })(),
  goiY: ['Dựng bảng byId trước; liên kết gãy là đích không có trong bảng.', 'Kiểm loại đích: FR chỉ tính khi trỏ tới UR; TC chỉ tính khi trỏ tới FR.'],
  loiHayGap: ['Tính FR → FR là có nguồn UR.', 'Dùng byId[t] với t = "constructor" ⇒ tưởng đích tồn tại.'],
  giaiThich: '<p>The checker answers three classic RTM questions: what has no origin (orphans), what is not verified (untested), and what need has no requirement (uncovered) — plus data hygiene (broken links).</p>',
  thuatNgu: tn('rtm', 'goldPlating'),
  khaiNiem: ['requirements traceability matrix'],
  boYeu: [{ ten: 'không kiểm loại đích', tep: { 'check.js': "function check(items){ var ids={}; items.forEach(function(x){ids[x.id]=1;}); var o=[],u=[],c=[],b=[]; items.forEach(function(x){ (x.from||[]).forEach(function(t){ if(!ids[t]) b.push(x.id+'->'+t); }); if(x.type==='FR'){ if(!(x.from||[]).length) o.push(x.id); if(!items.some(function(y){return y.type==='TC'&&(y.from||[]).indexOf(x.id)>=0;})) u.push(x.id);} if(x.type==='UR'&&!items.some(function(y){return (y.from||[]).indexOf(x.id)>=0;})) c.push(x.id); }); return {orphanFR:o.sort(),untestedFR:u.sort(),uncoveredUR:c.sort(),brokenLinks:b.sort()}; }\n" } }],
});

const E4 = tracNghiem({
  tieuDe: 'Traceability 4 — reading an RTM row',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>RTM row (Table 29-1 style): <b>UC-28</b> · <b>FR-28.1</b> · design: class CatalogQuery · code: catalog.query() · tests: <i>(none)</i>. Another row: — · <b>FR-31</b> · design: class ThemeManager · code: theme.apply() · tests: TC-90.</p>', vi: '<p>Đọc hai dòng RTM ở trên.</p>' },
  cau: [
    { en: 'What does the first row tell you?', vi: 'Dòng đầu cho biết gì?', lc: [['a', 'FR-28.1 is implemented but has no test — it may ship unverified'], ['b', 'Everything is complete'], ['c', 'FR-28.1 is gold plating'], ['d', 'UC-28 should be deleted']], dap: 'a', giai: ['Missing forward link to tests.', 'Thiếu liên kết xuôi tới test.'] },
    { en: 'What does the second row suggest?', vi: 'Dòng thứ hai gợi ý gì?', lc: [['a', 'FR-31 has no use case or business requirement behind it — possible gold plating'], ['b', 'It is perfect'], ['c', 'TC-90 is missing'], ['d', 'The design is missing']], dap: 'a', giai: ['Missing backward link.', 'Thiếu liên kết ngược.'] },
  ],
  goiY: ['Ô test trống ⇒ chưa kiểm.', 'Ô nguồn trống ⇒ nghi mạ vàng.'],
  loiHayGap: ['Bỏ qua ô trống.', 'Kết luận "đủ" khi còn ô trống.'],
  giaiThich: '<p>Answers: a · a.</p>',
  thuatNgu: tn('rtm', 'goldPlating'),
  khaiNiem: ['reading an RTM'],
});

export default moDun({
  slug: 'swr302-7-2-traceability',
  ten: '7.2 Requirements traceability',
  moTaModule: 'Bốn hướng truy vết (Hình 29-1), lợi ích của truy vết, tự viết bộ kiểm RTM: FR mồ côi, FR chưa test, UR chưa phủ, liên kết gãy — chấm trên RTM ẩn.',
  de: [E1, E2, E3, E4],
});
