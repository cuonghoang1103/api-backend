/** CEA201 · 14.1 — ILP & superscalar: dependences, issue width, in-order vs out-of-order, renaming. */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'ILP 1 — Superscalar, dependences and renaming: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on instruction-level parallelism.</p>', '<p>Câu hỏi khái niệm về song song mức lệnh.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A superscalar processor …', 'Bộ xử lý superscalar …'], ['can issue more than one instruction per clock cycle', 'has a single pipeline stage', 'executes only one instruction at a time', 'uses a single execution unit'], ['Multiple functional units and wide issue give IPC > 1.', 'Nhiều khối chức năng và phát lệnh rộng cho IPC > 1.']),
    q('c2', ['Which dependence is a TRUE dependence that renaming cannot remove?', 'Phụ thuộc nào là phụ thuộc THẬT mà đổi tên không loại được?'], ['RAW (read after write)', 'WAR', 'WAW', 'None of them'], ['WAR and WAW are name dependences caused by reusing register names.', 'WAR và WAW là phụ thuộc tên do dùng lại tên thanh ghi.']),
    q('c3', ['Register renaming eliminates …', 'Đổi tên thanh ghi loại bỏ …'], ['WAR and WAW hazards', 'RAW hazards', 'branch hazards', 'structural hazards'], ['Each write gets a fresh physical register.', 'Mỗi lần ghi nhận một thanh ghi vật lý mới.']),
    q('c4', ['Out-of-order execution mainly helps when …', 'Thực hiện sai thứ tự giúp nhiều nhất khi …'], ['an instruction is stalled but later independent instructions could run', 'all instructions depend on the previous one', 'the program has no branches', 'the clock is slow'], ['Independent work is found beyond the stalled instruction.', 'Tìm việc độc lập vượt qua lệnh đang đình trệ.']),
    q('c5', ['The upper bound on IPC of a program is limited by …', 'Cận trên của IPC của chương trình bị giới hạn bởi …'], ['its true data dependences and the issue width', 'the size of the disk', 'the bus width only', 'the operating system'], ['A serial chain of RAW dependences cannot be sped up by width.', 'Chuỗi RAW tuần tự không tăng tốc được dù rộng đến đâu.']),
  ],
  goiY: ['Name dependence vs true dependence.', 'Width helps only when there are independent instructions.'],
  loiHayGap: ['Thinking renaming removes RAW.', 'Expecting IPC to grow linearly with width.'],
  thuatNgu: [tn('IPC', 'số lệnh mỗi chu kỳ'), tn('register renaming', 'đổi tên thanh ghi')],
  khaiNiem: ['superscalar', 'dependences', 'renaming'],
});

const SEQ = [['add r1,r2,r3', 'sub r4,r1,r5', 'mul r6,r4,r7'], ['add r1,r2,r3', 'sub r2,r4,r5', 'add r1,r6,r7'], ['add r1,r2,r3', 'sub r4,r5,r6', 'mul r7,r8,r9'], ['lw r1,0(r2)', 'add r3,r1,r4', 'sw r3,0(r2)', 'lw r1,8(r5)']];
const parse = (l) => { const p = l.replace(/,/g, ' ').replace(/[()]/g, ' ').trim().split(/\s+/); const op = p[0]; if (op === 'lw') return { d: p[1], s: [p[3]] }; if (op === 'sw') return { d: null, s: [p[1], p[3]] }; return { d: p[1], s: [p[2], p[3]] }; };
const deps = (a, b) => { const A = parse(a), B = parse(b), out = []; if (A.d && B.s.includes(A.d)) out.push('RAW'); if (B.d && A.s.includes(B.d)) out.push('WAR'); if (A.d && B.d && A.d === B.d) out.push('WAW'); return out; };
const PAIRS = [[SEQ[0][0], SEQ[0][1]], [SEQ[0][1], SEQ[0][2]], [SEQ[1][0], SEQ[1][1]], [SEQ[1][0], SEQ[1][2]], [SEQ[2][0], SEQ[2][1]], [SEQ[3][1], SEQ[3][2]], [SEQ[3][0], SEQ[3][3]]];
const E2 = tinh({
  tieuDe: 'ILP 2 — Which dependences exist? Which survive renaming?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each pair (first ; second), list the register dependences present (choose the single best answer; a pair here has at most one), and say whether it <b>survives register renaming</b> (only true RAW dependences survive).</p>', '<p>Với mỗi cặp (trước ; sau), nêu phụ thuộc thanh ghi có mặt (chọn một đáp án; mỗi cặp ở đây có tối đa một loại) và cho biết nó có <b>còn sau khi đổi tên thanh ghi</b> hay không (chỉ phụ thuộc RAW thật còn lại).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Dependences and renaming', 'Phụ thuộc và đổi tên'], [{ ma: 'p', ten: 'First ; second' }, { ma: 'd', ten: 'Dependence', luaChon: ['RAW', 'WAR', 'WAW', 'None'] }, { ma: 'r', ten: 'Survives renaming?', luaChon: ['Yes', 'No'] }],
    PAIRS.map(([a, b]) => { const d = deps(a, b); if (d.length > 1) throw new Error('pair has several deps ' + a + ' ; ' + b); return { o: { p: `${a} ; ${b}` }, a: { d: d[0] || 'None', r: d[0] === 'RAW' ? 'Yes' : 'No' } }; }),
    ['RAW = the second reads what the first writes; WAR = the second overwrites what the first reads; WAW = both write the same register. After renaming, WAR and WAW disappear, RAW stays.', 'RAW = lệnh sau đọc cái lệnh trước ghi; WAR = lệnh sau ghi đè cái lệnh trước đọc; WAW = cùng ghi một thanh ghi. Sau đổi tên, WAR và WAW biến mất, RAW còn.'])],
  goiY: ['Write the read-set and write-set of each instruction.', 'Only a value that is actually passed along is a true dependence.'],
  loiHayGap: ['Treating any shared register as RAW.', 'Believing renaming removes the data flow.'],
  thuatNgu: [tn('name dependence', 'phụ thuộc tên')],
  khaiNiem: ['RAW', 'WAR', 'WAW', 'renaming'],
});

// mô phỏng phát lệnh: deps[i] = chỉ số các lệnh sinh ra; độ trễ 1 chu kỳ; width lệnh/chu kỳ
const issueSched = function issueSched(deps, width, outOfOrder) {
  var n = deps.length, issue = [], next = 0, cycle = 0, done = 0, i, k;
  for (i = 0; i < n; i++) issue.push(0);
  while (done < n) {
    cycle++;
    var slots = width, ready = function (x) {
      for (var d = 0; d < deps[x].length; d++) if (issue[deps[x][d]] === 0 || issue[deps[x][d]] >= cycle) return false;
      return true;
    };
    if (outOfOrder) {
      for (k = 0; k < n && slots > 0; k++) if (issue[k] === 0 && ready(k)) { issue[k] = cycle; slots--; done++; }
    } else {
      while (next < n && slots > 0 && ready(next)) { issue[next] = cycle; next++; slots--; done++; }
    }
    if (cycle > 10 * n + 10) break;
  }
  return { issue: issue, cycles: cycle, ipc: Math.round((n / cycle) * 100) / 100 };
};
const DG = [[], [0], [0], [1, 2], [], [4], [3, 5], [], [7], [6, 8]];
const E3 = tinh({
  tieuDe: 'ILP 3 — Issue cycles: in-order versus out-of-order, 2-wide and 4-wide',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi(`<p>Ten instructions <code>I0…I9</code> have these true dependences (instruction ← producers): ${DG.map((d, i) => `I${i} ← ${d.length ? d.map((x) => 'I' + x).join(', ') : '—'}`).join('; ')}. Every instruction has latency 1: a consumer may issue in the cycle after its last producer issued. Each cycle the machine issues up to <b>w</b> instructions. <b>In-order</b> issue stops at the first instruction that is not ready; <b>out-of-order</b> issue scans all waiting instructions oldest first. Give the total number of cycles (the last issue cycle) and the IPC (2 decimals).</p>`, `<p>Mười lệnh <code>I0…I9</code> có các phụ thuộc thật sau (lệnh ← lệnh sinh ra): ${DG.map((d, i) => `I${i} ← ${d.length ? d.map((x) => 'I' + x).join(', ') : '—'}`).join('; ')}. Mọi lệnh có độ trễ 1: lệnh dùng có thể phát ở chu kỳ sau khi lệnh sinh cuối cùng của nó được phát. Mỗi chu kỳ máy phát tối đa <b>w</b> lệnh. Phát <b>đúng thứ tự</b> dừng ở lệnh đầu tiên chưa sẵn sàng; phát <b>sai thứ tự</b> quét mọi lệnh đang chờ, cũ nhất trước. Cho tổng số chu kỳ (chu kỳ phát cuối) và IPC (2 chữ số).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Cycles and IPC', 'Chu kỳ và IPC'], [{ ma: 'm', ten: 'Machine' }, { ma: 'c', ten: 'Cycles' }, { ma: 'i', ten: 'IPC' }],
    [[1, false], [2, false], [2, true], [4, false], [4, true]].map(([w, o]) => { const r = issueSched(DG, w, o); return { o: { m: `${w}-wide ${o ? 'out-of-order' : 'in-order'}` }, a: { c: String(r.cycles), i: r2(r.ipc, 2) } }; }),
    ['Out-of-order beats in-order at equal width because independent instructions are found beyond a stalled one; extra width stops helping once the dependence chain (I0→I1→I3→I6→I9) limits the schedule. ' + [[1, false], [2, false], [2, true], [4, false], [4, true]].map(([w, o]) => `${w}-wide ${o ? 'OoO' : 'in-order'}: ${issueSched(DG, w, o).cycles} cycles`).join('; ') + '.', 'Sai thứ tự thắng đúng thứ tự ở cùng độ rộng vì tìm được lệnh độc lập vượt qua lệnh đình trệ; thêm độ rộng hết có ích khi chuỗi phụ thuộc (I0→I1→I3→I6→I9) giới hạn lịch.'])],
  goiY: ['Simulate cycle by cycle; write which instructions are ready at the start of each cycle.', 'Longest dependence chain = lower bound on cycles.'],
  loiHayGap: ['Letting a consumer issue in the same cycle as its producer.', 'Letting in-order issue skip a stalled instruction.'],
  thuatNgu: [tn('issue width', 'độ rộng phát lệnh')],
  khaiNiem: ['in-order vs out-of-order issue', 'IPC'],
});

const E4 = jsDe({
  tieuDe: 'ILP 4 — Write the instruction scheduler',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>Write <code>issueSched(deps, width, outOfOrder)</code>. <code>deps[i]</code> lists the indices of the instructions that produce operands of instruction <code>i</code> (all smaller than <code>i</code>). Instruction latency is 1: it may issue in cycle <i>c</i> if every producer issued in a cycle &lt; <i>c</i>. Each cycle up to <code>width</code> instructions issue. In-order (<code>outOfOrder = false</code>): instructions issue in program order and issue stops at the first one that is not ready. Out-of-order: scan all instructions not yet issued, oldest first, issuing the ready ones until the width is used. Return <code>{ issue, cycles, ipc }</code>: <code>issue[i]</code> is the cycle in which instruction <i>i</i> issued (cycles start at 1), <code>cycles</code> the last issue cycle, <code>ipc = n / cycles</code> rounded to 2 decimals with <code>Math.round(x * 100) / 100</code>.</p>', '<p>Viết <code>issueSched(deps, width, outOfOrder)</code>. <code>deps[i]</code> liệt kê chỉ số các lệnh sinh toán hạng của lệnh <code>i</code> (đều nhỏ hơn <code>i</code>). Độ trễ lệnh là 1: nó phát được ở chu kỳ <i>c</i> nếu mọi lệnh sinh đã phát ở chu kỳ &lt; <i>c</i>. Mỗi chu kỳ phát tối đa <code>width</code> lệnh. Đúng thứ tự (<code>outOfOrder = false</code>): lệnh phát theo thứ tự chương trình và dừng ở lệnh đầu tiên chưa sẵn sàng. Sai thứ tự: quét mọi lệnh chưa phát, cũ nhất trước, phát lệnh sẵn sàng cho đến khi hết độ rộng. Trả <code>{ issue, cycles, ipc }</code>: <code>issue[i]</code> là chu kỳ phát lệnh <i>i</i> (bắt đầu từ 1), <code>cycles</code> là chu kỳ phát cuối, <code>ipc = n / cycles</code> làm tròn 2 chữ số bằng <code>Math.round(x * 100) / 100</code>.</p>'),
  viDu: [{ input: 'issueSched([[], [0], []], 2, false)', output: JSON.stringify(issueSched([[], [0], []], 2, false)), explanation: 'Cycle 1: I0 issues, I1 is not ready so in-order issue stops (I2 waits). Cycle 2: I1 and I2.|||Chu kỳ 1: I0 phát, I1 chưa sẵn sàng nên phát đúng thứ tự dừng (I2 chờ). Chu kỳ 2: I1 và I2.' }],
  goiY: ['Keep issue[] initialised to 0 (not issued).', 'A producer is “done” for cycle c when 0 < issue[p] < c.', 'In-order keeps a pointer to the next instruction; out-of-order loops over all of them every cycle.'],
  loiHayGap: ['Letting a consumer issue in the cycle in which its producer issues.', 'Using the same loop for in-order and out-of-order.'],
  giaiThich: '<p>The only difference between the two schedulers is the window of instructions examined: one (the oldest) versus all. That single difference is the whole point of out-of-order execution.</p>',
  khaiNiem: ['instruction scheduling', 'IPC'],
  fn: 'issueSched',
  dau: 'function issueSched(deps, width, outOfOrder) {\n  return { issue: [], cycles: 0, ipc: 0 };\n}\n',
  giaiMa: dat(issueSched, 'issueSched'),
  ref: issueSched,
  cases: [{ args: [[[], [0], []], 2, false] }, { args: [DG, 2, false] }, { args: [DG, 2, true] }, { args: [DG, 4, true] }, { args: [DG, 1, true], an: true }, { args: [[[], [], [], []], 2, false], an: true }, { args: [[[], [0], [1], [2]], 4, true], an: true }, { args: [[[], [0], [0], [0], [1, 2, 3]], 3, false], an: true }],
});

export default doiDau({
  slug: 'cea201-14-1-ilp-superscalar',
  ten: '14.1 ILP & superscalar',
  khoa: KHOA,
  baiHoc: 'cea201-14-1-ilp-superscalar',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc; void SEQ;
