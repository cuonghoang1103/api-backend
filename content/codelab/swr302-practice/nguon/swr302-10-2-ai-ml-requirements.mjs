/**
 * SWR302 · 10.2 — Requirements for AI/ML systems: data, model performance, fairness, explainability, monitoring, fallback.
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'AI/ML 1 — which kind of requirement?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>AI/ML systems need new kinds of requirements: <b>data</b> (quantity, quality, coverage, labelling, freshness), <b>model performance</b> (metrics with thresholds), <b>fairness</b> (no large differences across groups), <b>explainability</b> (justify a decision), <b>monitoring and drift</b> (retraining triggers) and <b>human-in-the-loop / fallback</b> (what happens at low confidence). Classify the requirements of an AI that triages X-ray images.</p>', vi: '<p>Hệ AI/ML cần thêm các loại yêu cầu mới. Phân loại yêu cầu của AI phân loại ảnh X-quang.</p>' },
  cot: 'Kind', luaChon: ['Functional', 'Data', 'Model performance', 'Fairness', 'Explainability', 'Monitoring and drift', 'Human-in-the-loop / fallback'],
  hang: [
    ['The system shall mark each uploaded chest X-ray as "normal" or "needs review".', 'Functional'],
    ['The training set shall contain at least 40,000 labelled X-rays from at least 6 hospitals.', 'Data'],
    ['Recall for "needs review" shall be at least 0.97 on the held-out test set.', 'Model performance'],
    ['Recall shall not differ by more than 2 percentage points between patients over and under 60.', 'Fairness'],
    ['For each "needs review" result, the system shall highlight the image region that most influenced the decision.', 'Explainability'],
    ['Recall shall be measured monthly on newly labelled images; a drop of more than 3 points shall trigger a retraining review.', 'Monitoring and drift'],
    ['When the model confidence is below 0.70, the image shall be sent to a radiologist instead of being auto-classified.', 'Human-in-the-loop / fallback'],
  ],
  giaiThich: '<p>In ML, much of the real specification lives in the data and the chosen metric; these extra requirement kinds make "correct" and "done" testable.</p>',
  goiY: ['Ngưỡng chỉ số trên tập test ⇒ model performance.', 'So sánh giữa các nhóm ⇒ fairness.'],
  loiHayGap: ['Nhầm monitoring với model performance.', 'Coi fallback là chức năng thông thường.'],
  thuatNgu: [{ en: 'precision', vi: 'độ chính xác dương — trong các ca báo dương, bao nhiêu ca đúng' }, { en: 'recall', vi: 'độ phủ — trong các ca dương thật, bao nhiêu ca được bắt' }, { en: 'drift', vi: 'trôi dữ liệu — dữ liệu thực thay đổi làm mô hình kém dần' }],
  khaiNiem: ['AI/ML requirement kinds'],
});

const E2 = tracNghiem({
  tieuDe: 'AI/ML 2 — choose the metric that matches the cost of errors',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p><b>Precision</b> = TP ÷ (TP + FP): of the cases flagged positive, how many really are. <b>Recall</b> = TP ÷ (TP + FN): of the real positives, how many were caught. Choose the metric that matches the cost of each error type. Accuracy can hide class imbalance.</p>', vi: '<p><b>Precision</b> = TP ÷ (TP + FP). <b>Recall</b> = TP ÷ (TP + FN). Chọn chỉ số khớp chi phí lỗi. Accuracy có thể che mất mất cân bằng lớp.</p>' },
  cau: [
    { en: 'Cancer screening: missing a cancer (false negative) is far worse than a false alarm. Prioritise…', vi: 'Tầm soát ung thư: bỏ sót (FN) tệ hơn nhiều báo nhầm. Ưu tiên…', lc: [['a', 'recall'], ['b', 'precision'], ['c', 'speed only'], ['d', 'accuracy only']], dap: 'a', giai: ['High recall = few missed cases.', 'Recall cao = ít bỏ sót.'] },
    { en: 'A spam filter: putting a real customer e-mail into spam (false positive) is very costly. Prioritise…', vi: 'Lọc thư rác: cho thư khách thật vào spam (FP) rất tốn kém. Ưu tiên…', lc: [['a', 'recall'], ['b', 'precision'], ['c', 'model size'], ['d', 'nothing']], dap: 'b', giai: ['High precision = few false alarms.', 'Precision cao = ít báo nhầm.'] },
    { en: 'Only 1% of transactions are fraud. A model that says "not fraud" for everything has 99% accuracy. This shows…', vi: 'Chỉ 1% giao dịch là gian lận. Mô hình luôn nói "không gian lận" đạt 99% accuracy. Điều này cho thấy…', lc: [['a', 'accuracy hides class imbalance — specify recall/precision for the fraud class'], ['b', 'the model is excellent'], ['c', 'fraud does not matter'], ['d', 'we need more servers']], dap: 'a', giai: ['Its recall for fraud is 0.', 'Recall cho gian lận bằng 0.'] },
    { en: '"The AI will figure it out." As a requirement this is…', vi: '"AI sẽ tự lo." Là một yêu cầu, câu này…', lc: [['a', 'not a requirement — no metric, no test set, no fallback'], ['b', 'a good functional requirement'], ['c', 'a fairness requirement'], ['d', 'enough for an AI project']], dap: 'a', giai: ['Without thresholds there is no way to say "done".', 'Không có ngưỡng thì không thể nói "xong".'] },
  ],
  goiY: ['Bỏ sót tệ ⇒ recall; báo nhầm tệ ⇒ precision.', 'Dữ liệu lệch lớp ⇒ accuracy đánh lừa.'],
  loiHayGap: ['Chỉ đặt yêu cầu accuracy.', 'Đảo nghĩa precision và recall.'],
  giaiThich: '<p>Answers: a · b · a · a.</p>',
  thuatNgu: [{ en: 'precision', vi: 'TP ÷ (TP + FP)' }, { en: 'recall', vi: 'TP ÷ (TP + FN)' }, { en: 'class imbalance', vi: 'mất cân bằng lớp' }],
  khaiNiem: ['model performance metrics'],
});

const E3 = baiJs({
  tieuDe: 'AI/ML 3 — check a model against its requirements',
  doKho: 'HARD', phut: 18,
  moTa: { en: '<p>Model requirements for an X-ray triage model: <b>MP-1</b> precision ≥ <code>req.minPrecision</code>; <b>MP-2</b> recall ≥ <code>req.minRecall</code>; <b>FR-1</b> (fairness) the recall of every group differs from the overall recall by at most <code>req.maxGap</code>. Write <code>function evaluate(results, req)</code> where <code>results</code> is an array of <code>{ group, actual, predicted }</code> (booleans: true = "needs review"). Return <code>{ precision, recall, groupRecall: { [group]: number }, passed: [ids], failed: [ids] }</code> — numbers rounded to 3 decimals, ids among "MP-1", "MP-2", "FR-1" in that order. A metric whose denominator is 0 counts as 0. Groups with no actual positives are ignored for FR-1 (but still listed with recall 0).</p>', vi: '<p>Viết <code>evaluate(results, req)</code> tính precision, recall tổng, recall theo nhóm, và cho biết yêu cầu MP-1 (precision), MP-2 (recall), FR-1 (chênh recall nhóm so với tổng ≤ maxGap) đạt hay trượt. Làm tròn 3 chữ số; mẫu số 0 ⇒ 0; nhóm không có ca dương thật bị bỏ qua khi xét FR-1.</p>' },
  yeuCau: [{ en: 'Compare after rounding to 3 decimals.', vi: 'So sánh sau khi làm tròn 3 chữ số.' }],
  viDu: [{ input: 'TP=8, FP=2, FN=2', output: 'precision 0.8, recall 0.8', explanation: '|||' }],
  tep: { 'evaluate.js': ["function evaluate(results, req) {\n  // TODO\n  return { precision: 0, recall: 0, groupRecall: {}, passed: [], failed: [] };\n}\n", "function r3(x) { return Math.round(x * 1000) / 1000; }\nfunction rec(rows) {\n  var tp = 0, fn = 0;\n  rows.forEach(function (r) { if (r.actual && r.predicted) tp++; else if (r.actual) fn++; });\n  return { v: tp + fn ? tp / (tp + fn) : 0, pos: tp + fn };\n}\n\nfunction evaluate(results, req) {\n  var tp = 0, fp = 0;\n  results.forEach(function (r) { if (r.predicted && r.actual) tp++; else if (r.predicted) fp++; });\n  var precision = r3(tp + fp ? tp / (tp + fp) : 0);\n  var all = rec(results), recall = r3(all.v);\n  var groups = {}, groupRecall = {};\n  results.forEach(function (r) { (groups[r.group] = groups[r.group] || []).push(r); });\n  var fairOk = true;\n  Object.keys(groups).forEach(function (g) {\n    var x = rec(groups[g]);\n    groupRecall[g] = r3(x.v);\n    if (x.pos > 0 && r3(Math.abs(groupRecall[g] - recall)) > req.maxGap) fairOk = false;\n  });\n  var passed = [], failed = [];\n  [['MP-1', precision >= req.minPrecision], ['MP-2', recall >= req.minRecall], ['FR-1', fairOk]].forEach(function (c) { (c[1] ? passed : failed).push(c[0]); });\n  return { precision: precision, recall: recall, groupRecall: groupRecall, passed: passed, failed: failed };\n}\n"] },
  kiem: (function () {
    function rows(spec) {
      var out = [];
      spec.forEach(function (s) { for (var i = 0; i < s[1]; i++) out.push({ group: s[0], actual: s[2], predicted: s[3] }); });
      return out;
    }
    var D1 = rows([['A', 8, true, true], ['A', 2, false, true], ['A', 2, true, false], ['A', 8, false, false]]);
    var D2 = rows([['young', 45, true, true], ['young', 5, true, false], ['old', 30, true, true], ['old', 20, true, false], ['old', 10, false, true], ['young', 40, false, false]]);
    var D3 = rows([['g1', 3, true, true], ['g2', 4, false, false], ['g2', 1, false, true]]);
    function bo(moTa, data, req, fnKiem, ex) {
      return kiemTuy(moTa, new Function('var d = ' + JSON.stringify(data) + ', q = ' + JSON.stringify(req) + ";\nif (typeof evaluate !== 'function') return 'evaluate is not a function';\nvar r = evaluate(d, q); if (!r) return 'evaluate must return an object';\n" + fnKiem), ex);
    }
    return [
      bo({ en: 'precision and recall', vi: 'precision và recall' }, D1, { minPrecision: 0.8, minRecall: 0.9, maxGap: 0.05 }, "return r.precision === 0.8 && r.recall === 0.8 ? 'OK' : 'expected precision 0.8, recall 0.8, got ' + r.precision + ', ' + r.recall;"),
      bo({ en: 'pass/fail of MP-1 and MP-2 (≥ is a pass)', vi: 'đạt/trượt MP-1, MP-2 (≥ là đạt)' }, D1, { minPrecision: 0.8, minRecall: 0.9, maxGap: 0.05 }, "return JSON.stringify(r.passed) === '[\"MP-1\",\"FR-1\"]' && JSON.stringify(r.failed) === '[\"MP-2\"]' ? 'OK' : 'expected passed [MP-1, FR-1], failed [MP-2]; got ' + JSON.stringify(r.passed) + ' / ' + JSON.stringify(r.failed);"),
      bo({ en: 'recall per group and the fairness check', vi: 'recall theo nhóm và kiểm công bằng' }, D2, { minPrecision: 0.85, minRecall: 0.7, maxGap: 0.1 }, "var g = r.groupRecall || {}; if (g.young !== 0.9 || g.old !== 0.6) return 'groupRecall should be young 0.9, old 0.6; got ' + JSON.stringify(g); if (r.recall !== 0.75) return 'overall recall should be 0.75, got ' + r.recall; return JSON.stringify(r.failed) === '[\"FR-1\"]' ? 'OK' : 'only FR-1 should fail (gap 0.15 > 0.1); got failed ' + JSON.stringify(r.failed);"),
      bo({ en: 'hidden: groups without positives are ignored for fairness', vi: 'ẩn: nhóm không có ca dương bị bỏ qua khi xét công bằng' }, D3, { minPrecision: 0.7, minRecall: 0.9, maxGap: 0.05 }, "if ((r.groupRecall||{}).g2 !== 0) return 'g2 has no positives ⇒ recall 0'; return JSON.stringify(r.passed) === '[\"MP-1\",\"MP-2\",\"FR-1\"]' ? 'OK' : 'expected all three passed (precision 0.75, recall 1, g2 ignored); got ' + JSON.stringify(r.passed);", { an: true }),
      bo({ en: 'hidden: empty results, no crash', vi: 'ẩn: không có kết quả, không lỗi' }, [], { minPrecision: 0.5, minRecall: 0.5, maxGap: 0.1 }, "return r.precision === 0 && r.recall === 0 && JSON.stringify(r.failed) === '[\"MP-1\",\"MP-2\"]' ? 'OK' : 'empty input ⇒ precision 0, recall 0, MP-1 and MP-2 fail, FR-1 passes';", { an: true }),
    ];
  })(),
  goiY: ['Đếm TP, FP, FN; mẫu số 0 ⇒ 0.', 'Nhóm hoá theo group, tính recall từng nhóm, so với recall tổng.'],
  loiHayGap: ['Tính FR-1 cho cả nhóm không có ca dương.', 'So sánh trước khi làm tròn.'],
  giaiThich: '<p>Requirements stated as thresholds on named metrics, on a defined test set, per group, make an ML model testable: the evaluation becomes a pass/fail report, just like a test run.</p>',
  thuatNgu: [{ en: 'precision', vi: 'TP ÷ (TP + FP)' }, { en: 'recall', vi: 'TP ÷ (TP + FN)' }, { en: 'fairness gap', vi: 'chênh lệch chỉ số giữa các nhóm' }],
  khaiNiem: ['testing ML requirements'],
  boYeu: [{ ten: 'accuracy thay precision, không bỏ nhóm rỗng', tep: { 'evaluate.js': "function evaluate(rs,q){ var ok=0,tp=0,fn=0; rs.forEach(function(r){ if(r.actual===r.predicted) ok++; if(r.actual&&r.predicted) tp++; if(r.actual&&!r.predicted) fn++; }); var p=rs.length?Math.round(ok/rs.length*1000)/1000:0, rc=tp+fn?Math.round(tp/(tp+fn)*1000)/1000:0; var g={}; rs.forEach(function(r){ g[r.group]=g[r.group]||{tp:0,n:0}; if(r.actual){g[r.group].n++; if(r.predicted) g[r.group].tp++;} }); var gr={}, f=true; Object.keys(g).forEach(function(k){ gr[k]=g[k].n?Math.round(g[k].tp/g[k].n*1000)/1000:0; if(Math.abs(gr[k]-rc)>q.maxGap) f=false; }); var P=[],F=[]; [['MP-1',p>=q.minPrecision],['MP-2',rc>=q.minRecall],['FR-1',f]].forEach(function(c){(c[1]?P:F).push(c[0]);}); return {precision:p,recall:rc,groupRecall:gr,passed:P,failed:F}; }\n" } }],
});

const E4 = baiJs({
  tieuDe: 'AI/ML 4 — turn an AI wish into requirements',
  doKho: 'HARD', phut: 15,
  moTa: { en: '<p>Stakeholder: "<i>Build an AI that reads handwritten prescriptions and fills in the medicines automatically.</i>" Write <code>AIREQ</code> with six keys — <code>functional, data, performance, fallback, monitoring, fairness</code> — each one requirement sentence starting with "The system shall" or "The training data shall" / "The model shall". Each non-functional one must contain a number; <code>fallback</code> must mention a confidence threshold and a human (pharmacist/doctor); <code>performance</code> must name a metric (precision, recall, accuracy, F1) and a test set.</p>', vi: '<p>Biến mong muốn "AI đọc đơn thuốc viết tay rồi tự điền thuốc" thành 6 yêu cầu: functional, data, performance, fallback, monitoring, fairness; mỗi câu bắt đầu "The system shall" / "The training data shall" / "The model shall"; yêu cầu phi chức năng có số; fallback nêu ngưỡng độ tin cậy và người (dược sĩ/bác sĩ); performance nêu chỉ số và tập test.</p>' },
  yeuCau: [{ en: 'No vague words like "accurate enough", "good", "smart".', vi: 'Không dùng từ mơ hồ như "accurate enough", "good", "smart".' }],
  viDu: [{ input: 'fallback', output: 'The system shall send a prescription line to a pharmacist for manual entry when the extraction confidence is below 0.85.', explanation: '|||' }],
  tep: { 'aireq.js': ["const AIREQ = { functional: '', data: '', performance: '', fallback: '', monitoring: '', fairness: '' };\n", "const AIREQ = {\n  functional: 'The system shall extract the medicine name, strength, dosage and quantity from each line of an uploaded handwritten prescription image.',\n  data: 'The training data shall contain at least 30,000 labelled prescription lines written by at least 300 different doctors from at least 10 hospitals.',\n  performance: 'The model shall achieve a field-level accuracy of at least 97% for medicine name and 95% for dosage on the held-out test set of 3,000 prescription lines.',\n  fallback: 'The system shall send a prescription line to a pharmacist for manual entry when the extraction confidence for any field is below 0.85.',\n  monitoring: 'The system shall measure accuracy every week on newly verified prescriptions, and a drop of more than 2 percentage points shall trigger a retraining review.',\n  fairness: 'The model shall not differ in accuracy by more than 3 percentage points between prescriptions from different hospitals.',\n};\n"] },
  kiem: (function () {
    var LIB = "if (typeof AIREQ === 'undefined' || !AIREQ) return 'AIREQ is missing';\nfunction t(k){ return String(AIREQ[k]||''); }\n";
    function k(moTa, body, ex) { return kiemTuy(moTa, new Function(LIB + body), ex); }
    return [
      k({ en: 'six requirements, each a "shall" sentence', vi: 'sáu yêu cầu, mỗi câu dạng "shall"' }, "var ks = ['functional','data','performance','fallback','monitoring','fairness']; for (var i = 0; i < 6; i++) { var s = t(ks[i]); if (s.length < 40) return ks[i] + ' is missing or too short'; if (!/^the (system|training data|model|data set|dataset) shall\\b/i.test(s)) return ks[i] + ': start with \"The system shall\", \"The training data shall\" or \"The model shall\"'; if (/\\b(accurate enough|good|smart|intelligent|reasonable|fast|well)\\b/i.test(s)) return ks[i] + ': remove the vague word'; } return 'OK';"),
      k({ en: 'non-functional requirements contain numbers', vi: 'yêu cầu phi chức năng có số' }, "var ks = ['data','performance','fallback','monitoring','fairness']; for (var i = 0; i < ks.length; i++) if (!/\\d/.test(t(ks[i]))) return ks[i] + ' needs a number'; return 'OK';"),
      k({ en: 'performance: a named metric on a test set', vi: 'performance: chỉ số có tên trên tập test' }, "var s = t('performance'); if (!/precision|recall|accuracy|f1|error rate/i.test(s)) return 'name the metric (precision, recall, accuracy, F1)'; return /test set|held-out|test data|validation set/i.test(s) ? 'OK' : 'say on which test set it is measured';"),
      k({ en: 'fallback: confidence threshold and a human', vi: 'fallback: ngưỡng độ tin cậy và con người' }, "var s = t('fallback'); if (!/confidence/i.test(s) || !/0?\\.\\d+|\\d+\\s*%/.test(s)) return 'state the confidence threshold (e.g. below 0.85)'; return /pharmacist|doctor|human|staff|nurse|reviewer/i.test(s) ? 'OK' : 'say which person takes over';"),
      k({ en: 'monitoring has a period and a trigger; fairness compares groups', vi: 'monitoring có chu kỳ và ngưỡng kích hoạt; fairness so sánh nhóm' }, "var m = t('monitoring'); if (!/(daily|weekly|monthly|every|each)/i.test(m)) return 'monitoring: how often is it measured?'; if (!/(trigger|retrain|alert|review)/i.test(m)) return 'monitoring: what happens when it drops?'; var f = t('fairness'); return /(between|across|group|hospital|age|gender|region)/i.test(f) ? 'OK' : 'fairness: compare groups (e.g. between hospitals)';", { an: true }),
    ];
  })(),
  goiY: ['Mỗi loại một câu, có số và đơn vị/chỉ số.', 'Fallback: "when the confidence is below 0.85, … pharmacist".'],
  loiHayGap: ['Viết "The model shall be accurate".', 'Quên tập test cho yêu cầu hiệu năng.'],
  giaiThich: '<p>A vague AI wish becomes testable once each requirement kind has a metric, a threshold and, where needed, a human fallback — the same discipline as chapter 5, applied to a probabilistic system.</p>',
  thuatNgu: [{ en: 'human-in-the-loop', vi: 'con người trong vòng lặp — chuyển cho người khi máy không chắc' }, { en: 'drift', vi: 'trôi dữ liệu' }],
  khaiNiem: ['writing AI/ML requirements'],
  boYeu: [{ ten: 'mơ hồ, không số', tep: { 'aireq.js': "const AIREQ={functional:'The system shall read prescriptions automatically with AI.',data:'The training data shall be big and good quality data.',performance:'The model shall be accurate enough for pharmacists.',fallback:'The system shall ask a human when it is unsure.',monitoring:'The system shall be monitored sometimes.',fairness:'The model shall be fair to everybody.'};\n" } }],
});

export default moDun({
  slug: 'swr302-10-2-ai-ml-requirements',
  ten: '10.2 Requirements for AI/ML systems',
  moTaModule: 'Các loại yêu cầu mới của AI/ML (dữ liệu, hiệu năng mô hình, công bằng, giải thích, giám sát drift, fallback), chọn precision/recall theo chi phí lỗi, tự viết hàm kiểm mô hình theo yêu cầu (theo nhóm), biến mong muốn AI thành 6 yêu cầu đo được.',
  de: [E1, E2, E3, E4],
});
