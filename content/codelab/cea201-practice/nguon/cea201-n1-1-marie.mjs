/** CEA201 · N1.1 — MARIE assembly. Mọi kết quả do S.marieRun / S.marieAssemble tính (đã đối chiếu 3 chương trình ở slide: 6 · 20/46 bước · 45/40 bước). */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, code, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'MARIE 1 — The machine and its instruction set',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on the MARIE teaching computer.</p>', '<p>Câu hỏi khái niệm về máy tính giảng dạy MARIE.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A MARIE instruction word is 16 bits: …', 'Một từ lệnh MARIE dài 16 bit: …'], ['4 bits of opcode and 12 bits of address', '8 bits of opcode and 8 bits of address', '6 bits of opcode and 10 bits of address', '12 bits of opcode and 4 bits of address'], ['12 address bits reach 2¹² = 4096 words.', '12 bit địa chỉ với tới 2¹² = 4096 từ.']),
    q('c2', ['In MARIE the result of Add X is left in …', 'Trong MARIE kết quả của Add X nằm ở …'], ['the accumulator AC', 'memory location X', 'the PC', 'the MBR only'], ['MARIE is a single-accumulator machine: AC ← AC + M[X].', 'MARIE là máy một thanh ghi tích luỹ: AC ← AC + M[X].']),
    q('c3', ['What does Skipcond 400 test?', 'Skipcond 400 kiểm tra gì?'], ['AC = 0 (skip the next instruction if true)', 'AC < 0 (skip the next instruction if true)', 'AC > 0 (skip the next instruction if true)', 'PC = 0 (skip the next instruction if true)'], ['Skipcond 000: AC < 0; 400: AC = 0; 800: AC > 0.', 'Skipcond 000: AC < 0; 400: AC = 0; 800: AC > 0.']),
    q('c4', ['JnS X (jump and store) is used to …', 'JnS X (nhảy và lưu) dùng để …'], ['call a subroutine: store the return address at X and continue at X + 1', 'loop back: jump to X only when the AC is not zero', 'store a value: copy the AC to X and continue with the next instruction', 'return from a subroutine: jump to the address stored at X'], ['The subroutine returns with JumpI X.', 'Chương trình con trả về bằng JumpI X.']),
    q('c5', ['The machine word 3106 (hex) is …', 'Từ máy 3106 (hex) là …'], ['Add 106', 'Load 106', 'Store 106', 'Subt 106'], ['Opcode 3 = Add; the lower three hex digits are the address.', 'Opcode 3 = Add; ba chữ số hex thấp là địa chỉ.']),
    q('c6', ['AddI X means …', 'AddI X nghĩa là …'], ['AC ← AC + M[M[X]] (indirect)', 'AC ← AC + X (immediate)', 'AC ← AC + M[X]', 'M[X] ← AC + 1'], ['The word at X is the address of the operand.', 'Từ tại X là địa chỉ của toán hạng.']),
  ],
  goiY: ['First hex digit = opcode, last three = address.', 'Comparisons are always against zero.'],
  loiHayGap: ['Reading Skipcond 800 as “skip if AC is zero”.', 'Thinking AddI adds an immediate constant.'],
  thuatNgu: [tn('accumulator', 'thanh ghi tích luỹ'), tn('Skipcond', 'bỏ qua lệnh kế có điều kiện')],
  khaiNiem: ['MARIE ISA'],
});

const ENC = [['Load 105', '1105'], ['Add 106', '3106'], ['Store 107', '2107'], ['Subt 10A', '410A'], ['Jump 100', '9100'], ['Skipcond 800', '8800'], ['Skipcond 400', '8400'], ['Halt', '7000'], ['Output', '6000'], ['Clear', 'A000'], ['AddI 110', 'B110'], ['JnS 120', '0120']];
for (const [m, w] of ENC) { const r = S.marieAssemble(`ORG 100\n${m}`)[0].word; if (r !== w) throw new Error(`encoding ${m} ${r} != ${w}`); }
const DEC = [['5000', 'Input'], ['2108', 'Store 108'], ['8000', 'Skipcond 000'], ['C130', 'JumpI 130'], ['1FFF', 'Load FFF'], ['7000', 'Halt']];
const E2 = tinh({
  tieuDe: 'MARIE 2 — Assemble and disassemble by hand',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p>Opcodes (hex): 0 JnS · 1 Load · 2 Store · 3 Add · 4 Subt · 5 Input · 6 Output · 7 Halt · 8 Skipcond · 9 Jump · A Clear · B AddI · C JumpI. <b>Part A.</b> Give the 4-digit hex machine word of each instruction (addresses are hex; instructions without an operand have 000). <b>Part B.</b> Give the instruction (mnemonic and operand) for each machine word.</p>', '<p>Mã lệnh (hex): 0 JnS · 1 Load · 2 Store · 3 Add · 4 Subt · 5 Input · 6 Output · 7 Halt · 8 Skipcond · 9 Jump · A Clear · B AddI · C JumpI. <b>Phần A.</b> Cho từ máy hex 4 chữ số của mỗi lệnh (địa chỉ là hex; lệnh không có toán hạng thì 000). <b>Phần B.</b> Cho lệnh (mã gợi nhớ và toán hạng) của mỗi từ máy.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Assemble', 'Dịch sang mã máy'], [{ ma: 'i', ten: 'Instruction' }, { ma: 'w', ten: 'Word (hex)' }], ENC.map(([m, w]) => ({ o: { i: m }, a: { w: [w, w.toLowerCase()] } })),
    ['word = opcode digit + 12-bit address: ' + ENC.map(([m, w]) => `${m} = ${w}`).join('; ') + '. Skipcond encodes its condition in the top address bits (000, 400, 800).', 'từ = chữ số mã lệnh + địa chỉ 12 bit: ' + ENC.map(([m, w]) => `${m} = ${w}`).join('; ') + '.']),
  bang1('b2', ['Disassemble', 'Dịch ngược'], [{ ma: 'w', ten: 'Word (hex)' }, { ma: 'i', ten: 'Instruction' }], DEC.map(([w, m]) => ({ o: { w }, a: { i: [m, m.toLowerCase(), m.toUpperCase()] } })),
    ['Read the first hex digit as the opcode and the rest as the address: ' + DEC.map(([w, m]) => `${w} = ${m}`).join('; ') + '.', 'Chữ số hex đầu là mã lệnh, phần còn lại là địa chỉ: ' + DEC.map(([w, m]) => `${w} = ${m}`).join('; ') + '.'])],
  goiY: ['The operand is the three right-most hex digits.', 'Skipcond 000/400/800 puts the condition in the address field.'],
  loiHayGap: ['Writing the address in decimal.', 'Confusing Load (1) and Store (2).'],
  thuatNgu: [tn('machine word', 'từ máy'), tn('mnemonic', 'mã gợi nhớ')],
  khaiNiem: ['assembly', 'machine code'],
});

const MUL = (x, c) => `ORG 100\nLoop, Load Ctr\nSkipcond 400\nJump Body\nJump Done\nBody, Load Sum\nAdd X\nStore Sum\nLoad Ctr\nSubt One\nStore Ctr\nJump Loop\nDone, Load Sum\nOutput\nHalt 000\nX, Dec ${x}\nCtr, Dec ${c}\nSum, Dec 0\nOne, Dec 1`;
const MP = [[5, 4], [7, 3], [9, 0], [2, 10], [6, 6]];
const E3 = tinh({
  tieuDe: 'MARIE 3 — Run a multiplication loop: output and instruction count',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>This program multiplies by repeated addition (the example from the lecture slides): <code>X</code> is the multiplicand, <code>Ctr</code> the multiplier.</p>${code(MUL('X', 'Ctr').replace('Dec X', 'Dec <X>').replace('Dec Ctr', 'Dec <Ctr>'))}<p>For each pair (X, Ctr) give the number printed by <code>Output</code> and the <b>total number of instructions executed</b> (counting the final Halt).</p>`, `<p>Chương trình này nhân bằng cộng lặp (ví dụ trong slide bài giảng): <code>X</code> là số bị nhân, <code>Ctr</code> là số nhân.</p>${code(MUL('X', 'Ctr').replace('Dec X', 'Dec <X>').replace('Dec Ctr', 'Dec <Ctr>'))}<p>Với mỗi cặp (X, Ctr) cho số in ra bởi <code>Output</code> và <b>tổng số lệnh đã thực hiện</b> (tính cả Halt cuối).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Output and steps', 'Kết quả và số bước'], [{ ma: 'p', ten: 'X, Ctr' }, { ma: 'o', ten: 'Output' }, { ma: 's', ten: 'Instructions executed' }],
    MP.map(([x, c]) => { const r = S.marieRun(MUL(x, c)); return { o: { p: `X = ${x}, Ctr = ${c}` }, a: { o: String(r.output[0]), s: String(r.steps) } }; }),
    ['Each pass of the loop executes 10 instructions (Load, Skipcond, Jump, Load, Add, Store, Load, Subt, Store, Jump) when Ctr ≠ 0; the exit adds Load, Skipcond, Jump, Load, Output, Halt. Steps = 10·Ctr + 6 (so 4 → 46 as in the slides): ' + MP.map(([x, c]) => `(${x},${c}) → ${S.marieRun(MUL(x, c)).output[0]}, ${S.marieRun(MUL(x, c)).steps} steps`).join('; ') + '.', 'Mỗi vòng lặp thực hiện 10 lệnh khi Ctr ≠ 0; thoát thêm 6 lệnh. Số bước = 10·Ctr + 6 (4 → 46 như slide): ' + MP.map(([x, c]) => `(${x},${c}) → ${S.marieRun(MUL(x, c)).output[0]}, ${S.marieRun(MUL(x, c)).steps} bước`).join('; ') + '.'])],
  goiY: ['Output = X × Ctr.', 'Count the instructions in one loop pass, multiply by Ctr, then add the instructions of the exit path.'],
  loiHayGap: ['Counting the data words (Dec) as executed instructions.', 'Forgetting that Skipcond is also an instruction.'],
  thuatNgu: [tn('loop iteration', 'một vòng lặp')],
  khaiNiem: ['MARIE loops', 'instruction count'],
});

const CD = `ORG 100
Start, Load N
Skipcond 800
Halt
Output
Subt One
Store N
Jump Start
N, Dec 3
One, Dec 1`;
const rc = S.marieRun(CD);
const E4 = tinh({
  tieuDe: 'MARIE 4 — Trace a countdown, instruction by instruction',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>Trace the program below from the first instruction. For each of the first ${rc.trace.length > 12 ? 12 : rc.trace.length} executed instructions give the <b>AC after it</b> and the <b>PC of the next instruction</b> (hex).</p>${code(CD)}`, `<p>Lần vết chương trình dưới đây từ lệnh đầu tiên. Với mỗi lệnh trong ${rc.trace.length > 12 ? 12 : rc.trace.length} lệnh được thực hiện đầu tiên, cho <b>AC sau lệnh</b> và <b>PC của lệnh kế</b> (hex).</p>${code(CD)}`),
  loai: 'table',
  bang: [bang1('b1', ['Trace', 'Vết'], [{ ma: 'i', ten: 'Executed instruction' }, { ma: 'a', ten: 'AC after' }, { ma: 'n', ten: 'Next PC' }],
    rc.trace.slice(0, 12).map((t, k) => ({ o: { i: `#${k + 1}: ${t.pc.toString(16).toUpperCase()} ${t.op}` }, a: { a: String(t.ac), n: t.next.toString(16).toUpperCase() } })),
    ['Skipcond 800 skips the Halt while AC > 0; Output prints 3, 2, 1; the program stops when N reaches 0 and the Halt is no longer skipped. AC/PC: ' + rc.trace.slice(0, 12).map((t) => `${t.ac}/${t.next.toString(16).toUpperCase()}`).join(', ') + '. Output ' + rc.output.join(', ') + ' in ' + rc.steps + ' instructions.', 'Skipcond 800 bỏ qua Halt khi AC > 0; Output in 3, 2, 1; chương trình dừng khi N về 0 và Halt không còn bị bỏ qua. Kết quả in ' + rc.output.join(', ') + ' sau ' + rc.steps + ' lệnh.'])],
  goiY: ['Skipcond adds 1 to the PC when the condition holds (PC jumps over the next instruction).', 'Store does not change the AC.'],
  loiHayGap: ['Forgetting that the skipped instruction does not execute.', 'Reading the next PC as the address of the instruction itself.'],
  thuatNgu: [tn('trace', 'vết thực hiện')],
  khaiNiem: ['Skipcond', 'program trace'],
});

// Điền chỗ trống: chương trình in max(A, B). Phương án đúng/sai được kiểm bằng cách CHẠY.
const MAXP = (b1, b2, b3) => `ORG 100\nInput\nStore A\nInput\nStore B\nLoad A\n${b1}\n${b2}\n${b3}\nLoad A\nOutput\nHalt\nShowB, Load B\nOutput\nHalt\nA, Dec 0\nB, Dec 0`;
const OPT1 = ['Subt B', 'Add B', 'Load B'], OPT2 = ['Skipcond 800', 'Skipcond 400', 'Skipcond 000'], OPT3 = ['Jump ShowB', 'Halt', 'Clear'];
const TESTS = [[5, 3], [3, 5], [4, 4], [0, 9], [9, 0], [7, 2]];
const okMax = (b1, b2, b3) => TESTS.every(([a, b]) => { const r = S.marieRun(MAXP(b1, b2, b3), [a, b], 1000); return r.halted && r.output.length === 1 && r.output[0] === Math.max(a, b); });
if (!okMax(OPT1[0], OPT2[0], OPT3[0])) throw new Error('max program wrong');
for (const w of OPT1.slice(1)) if (okMax(w, OPT2[0], OPT3[0])) throw new Error('blank1 wrong option passes ' + w);
for (const w of OPT2.slice(1)) if (okMax(OPT1[0], w, OPT3[0])) throw new Error('blank2 wrong option passes ' + w);
for (const w of OPT3.slice(1)) if (okMax(OPT1[0], OPT2[0], w)) throw new Error('blank3 wrong option passes ' + w);
const E5 = tinh({
  tieuDe: 'MARIE 5 — Complete the program: print the larger of two inputs',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>The program reads A and B and prints the larger. Three lines are missing; choose the instruction for each blank (the choices were verified by running the program on many inputs).</p>${code(MAXP('<blank 1>', '<blank 2>', '<blank 3>'))}`, `<p>Chương trình đọc A và B rồi in số lớn hơn. Thiếu ba dòng; chọn lệnh cho mỗi chỗ trống (các lựa chọn đã được kiểm bằng cách chạy chương trình trên nhiều bộ dữ liệu).</p>${code(MAXP('<blank 1>', '<blank 2>', '<blank 3>'))}`),
  loai: 'table',
  bang: [bang1('b1', ['Blanks', 'Chỗ trống'], [{ ma: 'b', ten: 'Blank' }, { ma: 'i', ten: 'Instruction', luaChon: [...OPT1, ...OPT2, ...OPT3] }],
    [{ o: { b: 'blank 1 (compute A − B in the AC)' }, a: { i: OPT1[0] } }, { o: { b: 'blank 2 (skip the next line when A − B > 0)' }, a: { i: OPT2[0] } }, { o: { b: 'blank 3 (otherwise go and print B)' }, a: { i: OPT3[0] } }],
    ['AC = A, then Subt B gives A − B. Skipcond 800 skips the next line when A − B > 0, so the Jump ShowB is executed only when A ≤ B, and then B is the larger (or equal). When A > B the program falls through to Load A / Output.', 'AC = A, rồi Subt B cho A − B. Skipcond 800 bỏ qua dòng kế khi A − B > 0 nên Jump ShowB chỉ chạy khi A ≤ B, lúc đó B lớn hơn (hoặc bằng). Khi A > B chương trình chạy tiếp xuống Load A / Output.'])],
  goiY: ['MARIE has no “greater than” instruction: compute the difference first.', 'Skipcond 800 skips when AC is strictly positive.'],
  loiHayGap: ['Using Skipcond 400 (tests equality, not order).', 'Adding instead of subtracting.'],
  thuatNgu: [tn('comparison by subtraction', 'so sánh bằng phép trừ')],
  khaiNiem: ['conditional execution'],
});

// Chọn chương trình đúng — mỗi phương án được CHẠY để xác nhận
const PD = [
  { de: ['Which program prints TWICE its input?', 'Chương trình nào in GẤP ĐÔI số nhập vào?'], good: 'ORG 100\nInput\nStore X\nAdd X\nOutput\nHalt\nX, Dec 0', bad: ['ORG 100\nInput\nAdd X\nOutput\nHalt\nX, Dec 0', 'ORG 100\nInput\nStore X\nLoad X\nOutput\nHalt\nX, Dec 0', 'ORG 100\nInput\nOutput\nOutput\nHalt'], f: (x) => [2 * x] },
  { de: ['Which program prints its input MINUS 7?', 'Chương trình nào in số nhập vào TRỪ 7?'], good: 'ORG 100\nInput\nSubt Seven\nOutput\nHalt\nSeven, Dec 7', bad: ['ORG 100\nInput\nStore X\nLoad Seven\nSubt X\nOutput\nHalt\nX, Dec 0\nSeven, Dec 7', 'ORG 100\nInput\nAdd Seven\nOutput\nHalt\nSeven, Dec 7', 'ORG 100\nLoad Seven\nOutput\nHalt\nSeven, Dec 7'], f: (x) => [x - 7] },
];
const inpts = [1, 4, 9, 20];
const pc = PD.map((p, i) => {
  const good = inpts.every((x) => JSON.stringify(S.marieRun(p.good, [x], 1000).output) === JSON.stringify(p.f(x)));
  if (!good) throw new Error('good program wrong ' + i);
  for (const b of p.bad) if (inpts.every((x) => JSON.stringify(S.marieRun(b, [x], 1000).output) === JSON.stringify(p.f(x)))) throw new Error('bad program passes ' + i);
  return mc('c' + (i + 1), p.de, [p.good, ...p.bad].map((c, j) => ['abcd'[j], '<pre>' + c.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</pre>']), 'a', ['Verified by running every option with several inputs: only this one gives the required output for all of them.', 'Đã kiểm bằng cách chạy từng phương án với nhiều đầu vào: chỉ phương án này cho kết quả đúng với mọi đầu vào.']);
});
const CDP = (sk, store) => `ORG 100\nLoop, Load N\n${sk}\nJump End\nOutput\nSubt One\n${store}\nJump Loop\nEnd, Halt\nN, Dec 3\nOne, Dec 1`;
{
  const g = CDP('Skipcond 800', 'Store N'), bads = [CDP('Skipcond 000', 'Store N'), CDP('Skipcond 400', 'Store N'), CDP('Skipcond 800', 'Clear')];
  if (JSON.stringify(S.marieRun(g, [], 300).output) !== '[3,2,1]') throw new Error('countdown good');
  for (const b of bads) if (JSON.stringify(S.marieRun(b, [], 300).output) === '[3,2,1]') throw new Error('countdown bad passes');
  pc.push(mc('c3', ['Which program prints 3, 2, 1 and stops?', 'Chương trình nào in 3, 2, 1 rồi dừng?'], [g, ...bads].map((c, j) => ['abcd'[j], '<pre>' + c + '</pre>']), 'a', ['Skipcond 800 must skip the exit Jump while N > 0, and Store N must save the decremented value; each wrong option breaks one of the two.', 'Skipcond 800 phải bỏ qua Jump thoát khi N > 0 và Store N phải lưu giá trị đã giảm; mỗi phương án sai phá một trong hai điều đó.']));
}
const E6 = tinh({
  tieuDe: 'MARIE 6 — Which program does the job? (verified by execution)',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Choose the program that does what the question says. Every option was assembled and run on several inputs.</p>', '<p>Chọn chương trình làm đúng việc câu hỏi nêu. Mỗi phương án đã được dịch và chạy trên nhiều đầu vào.</p>'),
  loai: 'choice',
  cauHoi: pc,
  goiY: ['Run each option by hand with a small input such as 4.', 'Look at where the result ends up in the AC when Output executes.'],
  loiHayGap: ['Forgetting that Input overwrites the AC.', 'Forgetting that Skipcond jumps over exactly one instruction.'],
  thuatNgu: [tn('Input / Output', 'nhập / xuất')],
  khaiNiem: ['reading MARIE code'],
});

const marieExec = function marieExec(words, start, input) {
  var mem = {}, k, pc = start, ac = 0, out = [], steps = 0, inp = input.slice(), halted = false;
  for (k in words) mem[k] = words[k];
  var rd = function (a) { return mem[a] === undefined ? 0 : mem[a]; };
  var sg = function (x) { return x >= 32768 ? x - 65536 : x; };
  while (!halted && steps < 10000) {
    var ir = rd(pc), op = ir >> 12, ad = ir & 4095;
    pc++; steps++;
    if (op === 0) { mem[ad] = pc; pc = ad + 1; }
    else if (op === 1) ac = rd(ad);
    else if (op === 2) mem[ad] = ac;
    else if (op === 3) ac = (ac + rd(ad)) & 65535;
    else if (op === 4) ac = (ac - rd(ad) + 65536) & 65535;
    else if (op === 5) ac = ((inp.length ? inp.shift() : 0) + 65536) & 65535;
    else if (op === 6) out.push(sg(ac));
    else if (op === 7) halted = true;
    else if (op === 8) { var c = (ir >> 10) & 3; if ((c === 0 && sg(ac) < 0) || (c === 1 && ac === 0) || (c === 2 && sg(ac) > 0)) pc++; }
    else if (op === 9) pc = ad;
    else if (op === 10) ac = 0;
    else if (op === 11) ac = (ac + rd(rd(ad) & 4095)) & 65535;
    else if (op === 12) pc = rd(ad) & 4095;
  }
  return { output: out, steps: steps, ac: sg(ac), halted: halted };
};
const IMG = (src) => Object.fromEntries(S.marieAssemble(src).map((w) => [parseInt(w.addr, 16), parseInt(w.word, 16)]));
const IM_MUL = IMG(MUL(6, 5)), IM_P2 = IMG(CD), IM_MAX = IMG(MAXP('Subt B', 'Skipcond 800', 'Jump ShowB'));
const E7 = jsDe({
  tieuDe: 'MARIE 7 — Write the machine: fetch, decode, execute',
  doKho: 'HARD', phut: 30,
  moTa: bi('<p>Write <code>marieExec(words, start, input)</code>. <code>words</code> is an object mapping addresses (numbers) to 16-bit words (numbers), missing addresses read as 0; <code>start</code> the initial PC; <code>input</code> the list of numbers returned by successive <code>Input</code> instructions (0 when exhausted). Execute until <code>Halt</code> or 10000 instructions. Opcodes: 0 JnS (M[X] ← PC, PC ← X + 1) · 1 Load · 2 Store · 3 Add · 4 Subt · 5 Input · 6 Output · 7 Halt · 8 Skipcond (bits 11–10 of the address field: 00 AC &lt; 0, 01 AC = 0, 10 AC &gt; 0; skip = PC + 1) · 9 Jump · A Clear · B AddI · C JumpI. The AC is 16-bit two’s complement: wrap with <code>&amp; 65535</code>; output values are signed. The PC is incremented right after the fetch. Return <code>{ output, steps, ac, halted }</code> (<code>steps</code> counts executed instructions including Halt, <code>ac</code> signed).</p>', '<p>Viết <code>marieExec(words, start, input)</code>. <code>words</code> là đối tượng ánh xạ địa chỉ (số) sang từ 16 bit (số), địa chỉ thiếu đọc ra 0; <code>start</code> là PC ban đầu; <code>input</code> là danh sách số do các lệnh <code>Input</code> liên tiếp trả về (0 khi hết). Thực hiện đến <code>Halt</code> hoặc 10000 lệnh. Mã lệnh: 0 JnS (M[X] ← PC, PC ← X + 1) · 1 Load · 2 Store · 3 Add · 4 Subt · 5 Input · 6 Output · 7 Halt · 8 Skipcond (bit 11–10 của trường địa chỉ: 00 AC &lt; 0, 01 AC = 0, 10 AC &gt; 0; bỏ qua = PC + 1) · 9 Jump · A Clear · B AddI · C JumpI. AC là bù 2 16 bit: quấn bằng <code>&amp; 65535</code>; giá trị xuất có dấu. PC tăng ngay sau khi nạp lệnh. Trả <code>{ output, steps, ac, halted }</code> (<code>steps</code> đếm lệnh đã thực hiện gồm cả Halt, <code>ac</code> có dấu).</p>'),
  viDu: [{ input: 'marieExec({100: 0x5000, 101: 0x6000, 102: 0x7000}, 100, [42])', output: JSON.stringify(marieExec({ 100: 0x5000, 101: 0x6000, 102: 0x7000 }, 100, [42])), explanation: 'Input reads 42, Output prints it, Halt stops: 3 instructions.|||Input đọc 42, Output in ra, Halt dừng: 3 lệnh.' }],
  goiY: ['Loop: ir = M[PC]; PC++; op = ir >> 12; address = ir & 0xFFF.', 'Convert the AC to signed only when you print it or compare it (Skipcond).', 'Skipcond reads bits 11–10 of the address field: (ir >> 10) & 3.'],
  loiHayGap: ['Incrementing the PC after the execute step (breaks JnS and the skip).', 'Comparing the unsigned 16-bit AC with 0 for “less than”.'],
  giaiThich: '<p>A processor is a loop around fetch, decode and execute; MARIE needs fifteen lines for it because the ISA is tiny. The only subtleties are the order PC++ / execute and treating the 16-bit AC as signed when comparing.</p>',
  khaiNiem: ['fetch–decode–execute', 'MARIE'],
  fn: 'marieExec',
  dau: 'function marieExec(words, start, input) {\n  return { output: [], steps: 0, ac: 0, halted: false };\n}\n',
  giaiMa: dat(marieExec, 'marieExec'),
  ref: marieExec,
  cases: [{ args: [{ 100: 0x5000, 101: 0x6000, 102: 0x7000 }, 100, [42]] }, { args: [IM_MUL, 0x100, []] }, { args: [IM_P2, 0x100, []] }, { args: [IM_MAX, 0x100, [3, 8]] }, { args: [IM_MAX, 0x100, [9, 2]], an: true }, { args: [IMG(MUL(3, 0)), 0x100, []], an: true }, { args: [{ 0: 0x4005, 1: 0x6000, 2: 0x7000, 5: 7 }, 0, []], an: true }, { args: [{ 0: 0x0010, 1: 0x7000, 0x11: 0x6000, 0x12: 0xC010 }, 0, []], an: true }],
});

export default doiDau({
  slug: 'cea201-n1-1-marie',
  ten: '16.1 Practical assembly language with MARIE',
  khoa: KHOA,
  baiHoc: 'cea201-n1-1-marie',
  de: [E1, E2, E3, E4, E5, E6, E7],
});
void hai; void giai;
