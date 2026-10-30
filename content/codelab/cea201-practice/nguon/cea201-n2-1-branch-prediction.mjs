/** CEA201 · N2.1 — Branch prediction: static, 1-bit, 2-bit saturating counters, branch history table. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Prediction 1 — Why predict branches, and how',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on branch prediction.</p>', '<p>Câu hỏi khái niệm về dự đoán rẽ nhánh.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Why does a deep pipeline need branch prediction?', 'Vì sao pipeline sâu cần dự đoán rẽ nhánh?'], ['Without it the front end stalls until the branch is resolved', 'Branches lower the clock rate of the whole pipeline for many cycles', 'Branches write their results into registers only at the last stage', 'Branches use more cache lines than other instructions of the same size'], ['The penalty grows with the number of stages between fetch and branch resolution.', 'Phạt tăng theo số tầng giữa nạp lệnh và lúc nhánh được xác định.']),
    q('c2', ['A 2-bit saturating counter predicts “taken” when its value is …', 'Bộ đếm bão hoà 2 bit dự đoán “nhảy” khi giá trị là …'], ['2 or 3', '0 only', '1 or 2', '3 only'], ['00 strongly not taken, 01 weakly not taken, 10 weakly taken, 11 strongly taken.', '00 chắc chắn không nhảy, 01 yếu không nhảy, 10 yếu nhảy, 11 chắc chắn nhảy.']),
    q('c3', ['Why is a 2-bit predictor better than a 1-bit one for loops?', 'Vì sao bộ dự đoán 2 bit tốt hơn 1 bit cho vòng lặp?'], ['A single exception (loop exit) does not flip the prediction', 'It stores the addresses of the last two branches', 'It predicts the target address as well as the direction', 'It needs no table, so no two branches can interfere'], ['A 1-bit predictor mispredicts twice per loop execution (exit and re-entry); 2-bit only once.', 'Dự đoán 1 bit sai hai lần mỗi lần chạy vòng lặp (thoát và vào lại); 2 bit chỉ sai một lần.']),
    q('c4', ['A branch target buffer (BTB) stores …', 'Bộ đệm đích rẽ nhánh (BTB) lưu …'], ['the predicted target addresses of recently executed branches', 'the register values read by recently executed branches', 'the page-table entries of recently used code pages', 'the handler addresses of recently raised interrupts'], ['Knowing the target early lets the fetch stage redirect immediately.', 'Biết đích sớm cho phép tầng nạp chuyển hướng ngay.']),
    q('c5', ['“Always predict backward branches taken” is an example of …', '“Luôn dự đoán nhánh lùi là nhảy” là ví dụ của …'], ['static prediction', 'dynamic prediction with history', 'a branch target buffer', 'delayed branching'], ['Backward branches are usually loops.', 'Nhánh lùi thường là vòng lặp.']),
  ],
  goiY: ['Prediction wrong ⇒ flush the speculative work.', 'Hysteresis (two bits) avoids flipping on a single exception.'],
  loiHayGap: ['Mixing the direction predictor with the BTB.', 'Thinking 1-bit predictors do well on loops.'],
  thuatNgu: [tn('BTB', 'bộ đệm đích rẽ nhánh'), tn('saturating counter', 'bộ đếm bão hoà')],
  khaiNiem: ['branch prediction'],
});

const PAT = ['TTTTNTTTTNTTTTNTTTTN', 'TNTNTNTNTN', 'TTTTTTTTTT', 'NNNTTTTTTT'];
if (!(S.predict2bit(PAT[0], 0).mispredicts < S.predict1bit(PAT[0], 'N').mispredicts)) throw new Error('2-bit should win on the loop pattern');
const P1 = 'TTTTNTTTTN';
const p2 = S.predict2bit(P1, 0);
const E2 = tinh({
  tieuDe: 'Prediction 2 — Follow a 2-bit counter step by step',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>A 2-bit saturating counter starts at 0 (strongly not taken). It predicts T when the value is 2 or 3. After every branch it counts up on T (max 3) and down on N (min 0). Outcomes of one branch: <code>${P1.split('').join(' ')}</code>. For each branch give the <b>prediction</b>, whether it was <b>correct</b>, and finally the total number of mispredictions.</p>`, `<p>Bộ đếm bão hoà 2 bit bắt đầu ở 0 (chắc chắn không nhảy). Nó dự đoán T khi giá trị là 2 hoặc 3. Sau mỗi nhánh đếm lên khi T (tối đa 3) và xuống khi N (tối thiểu 0). Kết quả của một nhánh: <code>${P1.split('').join(' ')}</code>. Với mỗi nhánh cho <b>dự đoán</b>, <b>đúng/sai</b>, và cuối cùng tổng số lần đoán sai.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Prediction per branch', 'Dự đoán từng nhánh'], [{ ma: 'o', ten: 'Branch outcome' }, { ma: 'p', ten: 'Prediction', luaChon: ['T', 'N'] }, { ma: 'c', ten: 'Correct?', luaChon: ['Yes', 'No'] }],
    P1.split('').map((o, i) => ({ o: { o: `#${i + 1}: ${o}` }, a: { p: p2.pred[i], c: p2.pred[i] === o ? 'Yes' : 'No' } })),
    [`Counter values before each branch: ${(() => { let s = 0; return P1.split('').map((o) => { const v = s; s = o === 'T' ? Math.min(3, s + 1) : Math.max(0, s - 1); return v; }).join(' '); })()}. Predictions ${p2.pred}; ${p2.mispredicts} mispredictions.`, `Giá trị bộ đếm trước mỗi nhánh: ${(() => { let s = 0; return P1.split('').map((o) => { const v = s; s = o === 'T' ? Math.min(3, s + 1) : Math.max(0, s - 1); return v; }).join(' '); })()}. Dự đoán ${p2.pred}; ${p2.mispredicts} lần sai.`]),
  bang1('b2', ['Total', 'Tổng'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }], [{ o: { k: 'Mispredictions' }, a: { v: String(p2.mispredicts) } }], [`${p2.mispredicts} mispredictions out of ${P1.length}.`, `${p2.mispredicts} lần sai trên ${P1.length}.`])],
  goiY: ['Write the counter value before each branch and read the prediction from it.', 'Update the counter AFTER comparing.'],
  loiHayGap: ['Updating the counter before predicting.', 'Predicting T whenever the counter is non-zero.'],
  thuatNgu: [tn('misprediction', 'dự đoán sai')],
  khaiNiem: ['2-bit predictor'],
});

const E3 = tinh({
  tieuDe: 'Prediction 3 — Mispredictions of three predictors on four branch patterns',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Count the mispredictions of each scheme on each outcome string: <b>always taken</b>; a <b>1-bit</b> predictor (remembers the last outcome, starts with N); a <b>2-bit</b> saturating counter starting at 0.</p>', '<p>Đếm số lần đoán sai của mỗi sơ đồ trên từng chuỗi kết quả: <b>luôn nhảy</b>; bộ dự đoán <b>1 bit</b> (nhớ kết quả gần nhất, bắt đầu bằng N); bộ đếm bão hoà <b>2 bit</b> bắt đầu từ 0.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Mispredictions', 'Số lần đoán sai'], [{ ma: 'p', ten: 'Pattern' }, { ma: 'a', ten: 'Always taken' }, { ma: 'o', ten: '1-bit' }, { ma: 't', ten: '2-bit' }],
    PAT.map((p) => ({ o: { p } , a: { a: String(p.split('').filter((c) => c === 'N').length), o: String(S.predict1bit(p, 'N').mispredicts), t: String(S.predict2bit(p, 0).mispredicts) } })),
    [PAT.map((p) => `${p}: ${p.split('').filter((c) => c === 'N').length} / ${S.predict1bit(p, 'N').mispredicts} / ${S.predict2bit(p, 0).mispredicts}`).join('; ') + '. On the loop pattern (a taken-branch loop with one exit per 5) the 1-bit predictor misses twice per loop execution (the exit and the first branch after it) but the 2-bit counter only once; on TNTN… the 1-bit predictor is wrong every time; on short all-T or N-then-T strings the 2-bit counter pays one extra warm-up miss.', PAT.map((p) => `${p}: ${p.split('').filter((c) => c === 'N').length} / ${S.predict1bit(p, 'N').mispredicts} / ${S.predict2bit(p, 0).mispredicts}`).join('; ') + '. Với mẫu vòng lặp (nhánh nhảy, cứ 5 lần có một lần thoát) bộ dự đoán 1 bit sai hai lần mỗi vòng (lúc thoát và lần đầu ngay sau đó) còn bộ đếm 2 bit chỉ sai một lần; với TNTN… bộ 1 bit sai mọi lần; với chuỗi ngắn toàn T hoặc N rồi T bộ đếm 2 bit mất thêm một lần sai khởi động.'])],
  goiY: ['Simulate each predictor along the string.', 'Always-taken mispredicts exactly at the N outcomes.'],
  loiHayGap: ['Starting the 1-bit predictor at T.', 'Counting the warm-up as free.'],
  thuatNgu: [tn('dynamic prediction', 'dự đoán động')],
  khaiNiem: ['predictor comparison'],
});

const predictBHT = function predictBHT(branches, entries, bits) {
  var max = Math.pow(2, bits) - 1, half = Math.pow(2, bits - 1), table = [], i, miss = 0;
  for (i = 0; i < entries; i++) table.push(half - 1);
  for (i = 0; i < branches.length; i++) {
    var idx = Math.floor(branches[i].pc / 4) % entries, taken = branches[i].taken ? 1 : 0, pred = table[idx] >= half ? 1 : 0;
    if (pred !== taken) miss++;
    table[idx] = taken ? Math.min(max, table[idx] + 1) : Math.max(0, table[idx] - 1);
  }
  return { mispredicts: miss, rate: branches.length ? Math.round((miss / branches.length) * 10000) / 10000 : 0 };
};
const BR = [];
for (let i = 0; i < 40; i++) { BR.push({ pc: 0x400, taken: i % 5 !== 4 }); BR.push({ pc: 0x410, taken: i % 2 === 0 }); BR.push({ pc: 0x800, taken: true }); }
const BS = [{ pc: 0x100, taken: true }, { pc: 0x104, taken: false }, { pc: 0x100, taken: true }, { pc: 0x104, taken: false }];
const E4 = jsDe({
  tieuDe: 'Prediction 4 — Simulate a branch history table',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>A branch history table (BHT) has <code>entries</code> n-bit saturating counters indexed by <code>⌊pc / 4⌋ mod entries</code> (different branches may alias). Each counter starts at <code>2^(bits−1) − 1</code> (weakly not taken); it predicts taken when the counter is ≥ <code>2^(bits−1)</code>; after the branch it counts up when taken (max <code>2^bits − 1</code>) and down otherwise (min 0). Write <code>predictBHT(branches, entries, bits)</code> where <code>branches</code> is a list of <code>{ pc, taken }</code> executed in order. Return <code>{ mispredicts, rate }</code>, <code>rate = mispredicts / branches.length</code> rounded with <code>Math.round(x * 10000) / 10000</code> (0 for an empty list).</p>', '<p>Bảng lịch sử rẽ nhánh (BHT) có <code>entries</code> bộ đếm bão hoà n bit đánh chỉ số bởi <code>⌊pc / 4⌋ mod entries</code> (các nhánh khác nhau có thể trùng chỉ số). Mỗi bộ đếm bắt đầu ở <code>2^(bits−1) − 1</code> (yếu không nhảy); dự đoán nhảy khi bộ đếm ≥ <code>2^(bits−1)</code>; sau nhánh đếm lên khi nhảy (tối đa <code>2^bits − 1</code>) và xuống nếu không (tối thiểu 0). Viết <code>predictBHT(branches, entries, bits)</code> với <code>branches</code> là danh sách <code>{ pc, taken }</code> theo thứ tự thực hiện. Trả <code>{ mispredicts, rate }</code>, <code>rate = mispredicts / branches.length</code> làm tròn bằng <code>Math.round(x * 10000) / 10000</code> (0 nếu danh sách rỗng).</p>'),
  viDu: [{ input: 'predictBHT([{pc:256,taken:true},{pc:260,taken:false},{pc:256,taken:true},{pc:260,taken:false}], 4, 2)', output: JSON.stringify(predictBHT(BS, 4, 2)), explanation: 'pc 256 and 260 use different entries; the first T is mispredicted (counter 1 → N), then it is learned.|||pc 256 và 260 dùng ô khác nhau; lần T đầu bị đoán sai (bộ đếm 1 → N), sau đó học được.' }],
  goiY: ['Index = Math.floor(pc / 4) % entries.', 'Predict before updating; saturate with Math.min/Math.max.', 'Smaller tables make different branches share a counter (aliasing).'],
  loiHayGap: ['Using pc % entries (forgetting the divide by 4).', 'Starting the counters at 0 instead of the weakly-not-taken value.'],
  giaiThich: '<p>A BHT is a direct-mapped table of small counters; its accuracy depends on the pattern of each branch and on aliasing between branches that map to the same entry.</p>',
  khaiNiem: ['branch history table', 'aliasing'],
  fn: 'predictBHT',
  dau: 'function predictBHT(branches, entries, bits) {\n  return { mispredicts: 0, rate: 0 };\n}\n',
  giaiMa: dat(predictBHT, 'predictBHT'),
  ref: predictBHT,
  cases: [{ args: [BS, 4, 2] }, { args: [BR, 8, 2] }, { args: [BR, 8, 1] }, { args: [BR, 1, 2] }, { args: [BR, 64, 3], an: true }, { args: [[], 4, 2], an: true }, { args: [BR.slice(0, 30), 4, 2], an: true }],
});

export default doiDau({
  slug: 'cea201-n2-1-branch-prediction',
  ten: '17.1 Branch prediction',
  khoa: KHOA,
  baiHoc: 'cea201-n2-1-branch-prediction',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc; void r2;
