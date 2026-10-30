/** CEA201 · 12.2 — Instruction pipelining: speedup, hazards, forwarding, branch penalty. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat, code } from './_ce.mjs';

// Quy tắc pipeline 5 tầng IF ID EX MEM WB, một lệnh mỗi tầng, theo thứ tự. Nguồn của mọi con số trong bài.
const pipelineCycles = function pipelineCycles(lines, forwarding) {
  var ins = [], i, j;
  for (i = 0; i < lines.length; i++) {
    var p = lines[i].replace(/,/g, ' ').replace(/[()]/g, ' ').trim().split(/\s+/), op = p[0].toLowerCase(), dest = null, src = [];
    if (op === 'lw') { dest = p[1]; src = [p[3]]; }
    else if (op === 'sw') { src = [p[1], p[3]]; }
    else if (op === 'addi') { dest = p[1]; src = [p[2]]; }
    else { dest = p[1]; src = [p[2], p[3]]; }
    if (dest === 'r0') dest = null;
    ins.push({ op: op, dest: dest, src: src });
  }
  var idEnd = [], ex = [], mem = [], wb = [];
  for (i = 0; i < ins.length; i++) {
    var idE = i === 0 ? 2 : idEnd[i - 1] + 1;
    for (j = 0; j < i; j++) {
      if (!ins[j].dest || ins[i].src.indexOf(ins[j].dest) < 0) continue;
      if (!forwarding) idE = Math.max(idE, wb[j]);
      else idE = Math.max(idE, (ins[j].op === 'lw' ? mem[j] + 1 : ex[j] + 1) - 1);
    }
    idEnd[i] = idE; ex[i] = idE + 1; mem[i] = idE + 2; wb[i] = idE + 3;
  }
  var n = ins.length, cycles = n ? wb[n - 1] : 0;
  return { cycles: cycles, stalls: n ? cycles - (n + 4) : 0 };
};
// kiểm chéo với S.pipeSim bằng chương trình ví dụ H&P
if (pipelineCycles(['add r1,r2,r3', 'sub r4,r1,r5'], false).cycles !== 8 || pipelineCycles(['add r1,r2,r3', 'sub r4,r1,r5'], true).cycles !== 6 || pipelineCycles(['lw r1,0(r2)', 'add r3,r1,r4'], true).cycles !== 7) throw new Error('pipelineCycles mismatch');
void S;

const E1 = tinh({
  tieuDe: 'Pipeline 1 — Stages, hazards and forwarding: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on instruction pipelining.</p>', '<p>Câu hỏi khái niệm về pipeline lệnh.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Pipelining improves …', 'Pipeline cải thiện …'], ['throughput (instructions per second), not the latency of one instruction', 'the latency of every instruction, not the number finished per second', 'only the cache hit ratio, because fewer instructions are fetched', 'the number of registers that one instruction can use in a cycle'], ['Each instruction still goes through all the stages; more instructions are in flight at once.', 'Mỗi lệnh vẫn đi qua mọi tầng; nhiều lệnh được xử lý đồng thời hơn.']),
    q('c2', ['A RAW (read after write) hazard means …', 'Hazard RAW (đọc sau ghi) nghĩa là …'], ['an instruction needs a result that an earlier instruction has not produced yet', 'two instructions write the same register', 'a later instruction overwrites an operand an earlier one still needs', 'the branch target is unknown'], ['It is a true data dependence.', 'Đây là phụ thuộc dữ liệu thật.']),
    q('c3', ['Data forwarding (bypassing) …', 'Chuyển tiếp dữ liệu (bypassing) …'], ['sends a result from a later pipeline stage straight to the ALU input that needs it', 'copies a result to the instruction cache so that it can be fetched', 'doubles the clock so that a result is ready one stage earlier', 'writes each result into the register file during the ID stage'], ['It avoids waiting for the register-file write-back.', 'Tránh phải chờ ghi lại vào tệp thanh ghi.']),
    q('c4', ['Even with forwarding, a load followed immediately by an instruction using the loaded value needs …', 'Dù có chuyển tiếp, lệnh load theo sau là lệnh dùng giá trị vừa nạp cần …'], ['one stall cycle (load-use hazard)', 'no stall', 'three stalls', 'two stalls'], ['The data are available only at the end of the MEM stage.', 'Dữ liệu chỉ có ở cuối tầng MEM.']),
    q('c5', ['A structural hazard occurs when …', 'Hazard cấu trúc xảy ra khi …'], ['two instructions need the same hardware resource in the same cycle', 'two instructions read and write the same register', 'a branch is mispredicted and the wrong path is flushed', 'the cache misses on a data access in the MEM stage'], ['E.g. one memory port used for both instruction fetch and data access.', 'Vd một cổng nhớ dùng cho cả nạp lệnh và truy cập dữ liệu.']),
    q('c6', ['A control hazard is caused by …', 'Hazard điều khiển do …'], ['branches and jumps that change the next instruction address', 'a register that is read before it is written', 'instructions that compete for one memory port', 'an ALU that is narrower than the operands'], ['The pipeline does not yet know which instruction to fetch.', 'Pipeline chưa biết nạp lệnh nào.']),
  ],
  goiY: ['Data (RAW/WAR/WAW), structural, control.', 'Forwarding fixes ALU→ALU but not load→use fully.'],
  loiHayGap: ['Believing pipelining makes one instruction faster.', 'Saying forwarding removes every stall.'],
  thuatNgu: [tn('hazard', 'hazard (xung đột)'), tn('forwarding', 'chuyển tiếp')],
  khaiNiem: ['pipeline hazards'],
});

const KN = [[5, 10], [5, 1000], [8, 100], [12, 1000000]];
const E2 = tinh({
  tieuDe: 'Pipeline 2 — Speedup of an ideal k-stage pipeline',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>An ideal pipeline of <b>k</b> stages (no stalls) runs <b>n</b> instructions in <b>k + n − 1</b> cycles; without pipelining each instruction takes k cycles, so n·k in total. Give both cycle counts and the speedup n·k / (k + n − 1) (3 decimals).</p>', '<p>Pipeline lý tưởng <b>k</b> tầng (không đình trệ) chạy <b>n</b> lệnh trong <b>k + n − 1</b> chu kỳ; không pipeline mỗi lệnh tốn k chu kỳ, tổng n·k. Cho cả hai số chu kỳ và hệ số tăng tốc n·k / (k + n − 1) (3 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Ideal speedup', 'Tăng tốc lý tưởng'], [{ ma: 'p', ten: 'k, n' }, { ma: 'a', ten: 'Pipelined cycles' }, { ma: 'b', ten: 'Unpipelined cycles' }, { ma: 's', ten: 'Speedup' }],
    KN.map(([k, n]) => ({ o: { p: `k = ${k}, n = ${n}` }, a: { a: String(k + n - 1), b: String(n * k), s: r2(n * k / (k + n - 1), 3) } })),
    [KN.map(([k, n]) => `k=${k}, n=${n}: ${k + n - 1} vs ${n * k} cycles ⇒ ${(n * k / (k + n - 1)).toFixed(3)}`).join('; ') + '. The speedup approaches k for long programs but never exceeds it.', KN.map(([k, n]) => `k=${k}, n=${n}: ${k + n - 1} vs ${n * k} ⇒ ${(n * k / (k + n - 1)).toFixed(3)}`).join('; ') + '.'])],
  goiY: ['The first instruction needs k cycles; each additional one completes one cycle later.', 'Speedup → k as n → ∞.'],
  loiHayGap: ['Using k × n for the pipelined time.', 'Expecting a speedup above k.'],
  thuatNgu: [tn('throughput', 'thông lượng')],
  khaiNiem: ['pipeline speedup'],
});

const SQ = [['add r1,r2,r3', 'sub r4,r1,r5', 'and r6,r1,r7', 'or r8,r1,r9'], ['lw r1,0(r2)', 'add r3,r1,r4', 'sub r5,r3,r6', 'sw r5,4(r2)'], ['lw r1,0(r2)', 'lw r3,4(r2)', 'add r5,r1,r3', 'sw r5,8(r2)']];
const E3 = tinh({
  tieuDe: 'Pipeline 3 — Count the cycles with and without forwarding',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Five-stage pipeline IF ID EX MEM WB, one instruction per stage, in order. The register file is written in the first half of WB and read in the second half of ID. <b>Without forwarding</b> a dependent instruction must read in an ID cycle at or after the producer’s WB cycle. <b>With forwarding</b> ALU results go to the next EX, and a loaded value is available to an EX that starts after the load’s MEM. A source register — also the stored register of <code>sw</code> — is needed at the start of EX. Stalls hold the instruction in ID. Give the total number of cycles to complete each sequence (first IF = cycle 1).</p>', '<p>Pipeline 5 tầng IF ID EX MEM WB, mỗi tầng một lệnh, theo thứ tự. Tệp thanh ghi ghi ở nửa đầu WB và đọc ở nửa sau ID. <b>Không chuyển tiếp</b>: lệnh phụ thuộc phải đọc ở chu kỳ ID không sớm hơn chu kỳ WB của lệnh sinh ra. <b>Có chuyển tiếp</b>: kết quả ALU đi vào EX kế tiếp, giá trị load có cho EX bắt đầu sau MEM của load. Thanh ghi nguồn — kể cả thanh ghi được lưu của <code>sw</code> — cần từ đầu EX. Đình trệ giữ lệnh ở ID. Cho tổng số chu kỳ hoàn thành mỗi dãy (IF đầu tiên = chu kỳ 1).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Cycles', 'Số chu kỳ'], [{ ma: 's', ten: 'Sequence' }, { ma: 'n', ten: 'No forwarding' }, { ma: 'f', ten: 'Forwarding' }],
    SQ.map((s, i) => ({ o: { s: `S${i + 1}: ` + s.join(' ; ') }, a: { n: String(pipelineCycles(s, false).cycles), f: String(pipelineCycles(s, true).cycles) } })),
    [SQ.map((s, i) => `S${i + 1}: ${pipelineCycles(s, false).cycles} / ${pipelineCycles(s, true).cycles} cycles (${pipelineCycles(s, false).stalls} / ${pipelineCycles(s, true).stalls} stalls)`).join('; ') + '. An ideal 4-instruction run takes 8 cycles (n + 4).', SQ.map((s, i) => `S${i + 1}: ${pipelineCycles(s, false).cycles} / ${pipelineCycles(s, true).cycles} chu kỳ`).join('; ') + '. Chạy lý tưởng 4 lệnh tốn 8 chu kỳ (n + 4).'])],
  goiY: ['Draw the diagram: ideal = n + 4 cycles; add one cycle per stall.', 'Without forwarding the consumer’s ID must reach the producer’s WB cycle.', 'With forwarding only a load directly followed by its user stalls.'],
  loiHayGap: ['Stalling for ALU→ALU dependences when forwarding is on.', 'Forgetting that stalls delay all later instructions.'],
  thuatNgu: [tn('stall (bubble)', 'chu kỳ đình trệ (bong bóng)')],
  khaiNiem: ['data hazards', 'forwarding'],
});

const HP = [['add r1,r2,r3', 'sub r4,r1,r5', 'RAW'], ['add r1,r2,r3', 'sub r2,r4,r5', 'WAR'], ['add r1,r2,r3', 'sub r1,r4,r5', 'WAW'], ['lw r1,0(r2)', 'add r3,r4,r5', 'None'], ['sw r1,0(r2)', 'lw r1,4(r3)', 'WAR'], ['lw r1,0(r2)', 'sw r1,4(r3)', 'RAW']];
const E4 = tinh({
  tieuDe: 'Pipeline 4 — Classify the data dependence',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>For each pair (first, second) name the register dependence: <b>RAW</b> (second reads what the first writes), <b>WAR</b> (second writes what the first reads), <b>WAW</b> (both write the same register) or <b>None</b>. Ignore memory.</p>', '<p>Với mỗi cặp (trước, sau) nêu phụ thuộc thanh ghi: <b>RAW</b> (lệnh sau đọc cái lệnh trước ghi), <b>WAR</b> (lệnh sau ghi cái lệnh trước đọc), <b>WAW</b> (cả hai ghi cùng thanh ghi) hoặc <b>None</b>. Bỏ qua bộ nhớ.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Dependences', 'Phụ thuộc'], [{ ma: 'p', ten: 'First ; second' }, { ma: 'd', ten: 'Dependence', luaChon: ['RAW', 'WAR', 'WAW', 'None'] }],
    HP.map(([a, b, d]) => ({ o: { p: `${a} ; ${b}` }, a: { d } })),
    ['Add r1,.. ; sub r4,r1: the second reads r1 ⇒ RAW. sub r2: writes r2 which the first read ⇒ WAR. sub r1: both write r1 ⇒ WAW. Independent registers ⇒ None. sw reads r1, lw then writes r1 ⇒ WAR. lw writes r1, sw reads it ⇒ RAW.', 'Đọc cái lệnh trước ghi ⇒ RAW; ghi cái lệnh trước đọc ⇒ WAR; cùng ghi một thanh ghi ⇒ WAW; thanh ghi độc lập ⇒ None.'])],
  goiY: ['List the registers each instruction reads and writes.', 'Only RAW is a true dependence; WAR and WAW are name dependences.'],
  loiHayGap: ['Calling WAR a RAW because the register is shared.', 'Forgetting that sw reads its first register.'],
  thuatNgu: [tn('name dependence', 'phụ thuộc tên')],
  khaiNiem: ['RAW', 'WAR', 'WAW'],
});

const BR = [[0.2, 3, 0], [0.2, 3, 0.80], [0.2, 3, 0.90], [0.15, 5, 0.95], [0.25, 10, 0.90]];
const cb = (f, p, a) => 1 + f * p * (1 - a);
const E5 = tinh({
  tieuDe: 'Pipeline 5 — CPI with branch penalties',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Ideal CPI is 1. A fraction <b>f</b> of the instructions are branches; a branch that is <b>mispredicted</b> (or not predicted at all) costs <b>p</b> stall cycles. CPI = 1 + f × p × (1 − accuracy). Fill in the CPI (3 decimals) and, with a 2 GHz clock, the time for 10⁹ instructions (seconds, 3 decimals).</p>', '<p>CPI lý tưởng là 1. Một phần <b>f</b> lệnh là rẽ nhánh; nhánh <b>dự đoán sai</b> (hoặc không dự đoán) tốn <b>p</b> chu kỳ đình trệ. CPI = 1 + f × p × (1 − độ chính xác). Điền CPI (3 chữ số) và, với clock 2 GHz, thời gian cho 10⁹ lệnh (giây, 3 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['CPI and time', 'CPI và thời gian'], [{ ma: 'p', ten: 'f, penalty, accuracy' }, { ma: 'c', ten: 'CPI' }, { ma: 't', ten: 'Time (s)' }],
    BR.map(([f, p, a]) => ({ o: { p: `f = ${f}, p = ${p}, accuracy = ${a === 0 ? '0 (no prediction)' : a}` }, a: { c: r2(cb(f, p, a), 3), t: r2(1e9 * cb(f, p, a) / 2e9, 3) } })),
    [BR.map(([f, p, a]) => `CPI = 1 + ${f}×${p}×${(1 - a).toFixed(2)} = ${cb(f, p, a).toFixed(3)}`).join('; ') + '. A deeper pipeline (larger p) makes prediction accuracy more valuable.', BR.map(([f, p, a]) => `CPI = 1 + ${f}×${p}×${(1 - a).toFixed(2)} = ${cb(f, p, a).toFixed(3)}`).join('; ') + '. Pipeline sâu hơn (p lớn) làm độ chính xác dự đoán quan trọng hơn.'])],
  goiY: ['Time = IC × CPI / f.', 'No prediction means every branch pays p.'],
  loiHayGap: ['Charging p to every instruction.', 'Using accuracy instead of the miss rate (1 − accuracy).'],
  thuatNgu: [tn('branch penalty', 'phạt rẽ nhánh')],
  khaiNiem: ['branch penalty', 'CPI'],
});

const E6 = jsDe({
  tieuDe: 'Pipeline 6 — Write a pipeline cycle counter',
  doKho: 'HARD', phut: 30,
  moTa: bi('<p>Write <code>pipelineCycles(lines, forwarding)</code> for the 5-stage pipeline of “Pipeline 3”. <code>lines</code> are strings: <code>"lw r1, 0(r2)"</code> (writes r1, reads r2), <code>"sw r3, 4(r2)"</code> (writes nothing, reads r3 and r2), <code>"addi r1, r2, 5"</code> (writes r1, reads r2) and three-register ALU instructions <code>"add|sub|and|or|slt rd, rs, rt"</code> (write rd, read rs and rt). Register <code>r0</code> is never a dependence. Rules: the first ID is cycle 2; an instruction enters ID right after the previous one leaves it; without forwarding its last ID cycle must be ≥ the producer’s WB cycle; with forwarding its EX must start after the producer’s EX (ALU) or MEM (lw) cycle. Return <code>{ cycles, stalls }</code> where <code>cycles</code> is the cycle of the last WB and <code>stalls = cycles − (n + 4)</code> (0 for an empty program).</p>', '<p>Viết <code>pipelineCycles(lines, forwarding)</code> cho pipeline 5 tầng của “Pipeline 3”. <code>lines</code> là các chuỗi: <code>"lw r1, 0(r2)"</code> (ghi r1, đọc r2), <code>"sw r3, 4(r2)"</code> (không ghi gì, đọc r3 và r2), <code>"addi r1, r2, 5"</code> (ghi r1, đọc r2) và lệnh ALU ba thanh ghi <code>"add|sub|and|or|slt rd, rs, rt"</code> (ghi rd, đọc rs và rt). Thanh ghi <code>r0</code> không bao giờ gây phụ thuộc. Quy tắc: ID đầu tiên ở chu kỳ 2; lệnh vào ID ngay khi lệnh trước rời nó; không chuyển tiếp thì chu kỳ ID cuối ≥ chu kỳ WB của lệnh sinh; có chuyển tiếp thì EX phải bắt đầu sau chu kỳ EX (ALU) hoặc MEM (lw) của lệnh sinh. Trả <code>{ cycles, stalls }</code> với <code>cycles</code> là chu kỳ của WB cuối và <code>stalls = cycles − (n + 4)</code> (0 nếu chương trình rỗng).</p>'),
  viDu: [{ input: 'pipelineCycles(["add r1,r2,r3","sub r4,r1,r5"], false)', output: JSON.stringify(pipelineCycles(['add r1,r2,r3', 'sub r4,r1,r5'], false)), explanation: 'sub must wait for add’s WB in cycle 5: two stalls, 8 cycles.|||sub phải chờ WB của add ở chu kỳ 5: hai đình trệ, 8 chu kỳ.' }, { input: 'pipelineCycles(["add r1,r2,r3","sub r4,r1,r5"], true)', output: JSON.stringify(pipelineCycles(['add r1,r2,r3', 'sub r4,r1,r5'], true)), explanation: 'With forwarding there is no stall: n + 4 = 6.|||Có chuyển tiếp thì không đình trệ: n + 4 = 6.' }],
  goiY: ['Parse each line into {op, dest, src[]}; for lw the base register is a source; for sw both registers are sources.', 'Keep idEnd[i], ex[i], mem[i], wb[i]; start with idEnd = previous + 1.', 'For every earlier producer j of a source register raise idEnd according to the forwarding rule.'],
  loiHayGap: ['Forgetting that sw has no destination.', 'Allowing r0 to create a dependence.', 'Giving ALU→ALU a stall when forwarding is on.'],
  giaiThich: '<p>An in-order pipeline is a scheduling problem: each instruction enters ID right after the previous one and is delayed only by data dependences on earlier results.</p>',
  khaiNiem: ['pipeline simulation', 'forwarding'],
  fn: 'pipelineCycles',
  dau: 'function pipelineCycles(lines, forwarding) {\n  return { cycles: 0, stalls: 0 };\n}\n',
  giaiMa: dat(pipelineCycles, 'pipelineCycles'),
  ref: pipelineCycles,
  cases: [{ args: [SQ[0], false] }, { args: [SQ[0], true] }, { args: [SQ[1], false] }, { args: [SQ[1], true] }, { args: [SQ[2], true], an: true }, { args: [['add r0,r1,r2', 'add r3,r0,r4', 'sw r3,0(r0)'], false], an: true }, { args: [[], true], an: true }, { args: [['lw r1,0(r2)', 'lw r2,4(r1)', 'lw r3,0(r2)', 'addi r4,r3,1'], true], an: true }, { args: [['addi r1,r1,1', 'addi r1,r1,1', 'addi r1,r1,1'], false], an: true }],
});

export default doiDau({
  slug: 'cea201-12-2-pipelining',
  ten: '12.2 Instruction pipelining',
  khoa: KHOA,
  baiHoc: 'cea201-12-2-pipelining',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void giai; void mc; void code;
