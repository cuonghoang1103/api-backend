/** CEA201 · 10.1 — Anatomy of a machine instruction: fields, number of addresses, stack machine. */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, ord, dat, code } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Instruction 1 — Opcode, operands and instruction types',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on the elements of a machine instruction.</p>', '<p>Câu hỏi khái niệm về các thành phần của lệnh máy.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The opcode field of an instruction specifies …', 'Trường opcode của lệnh chỉ định …'], ['the operation to be performed', 'the address of the next instruction', 'the data value only', 'the size of the memory'], ['Source/destination operand references and the next-instruction reference are separate elements.', 'Tham chiếu toán hạng nguồn/đích và lệnh kế tiếp là các thành phần riêng.']),
    q('c2', ['Which category does ADD R1, R2, R3 belong to?', 'ADD R1, R2, R3 thuộc loại nào?'], ['Data processing (arithmetic)', 'Data storage', 'Data movement', 'Control (flow of execution)'], ['Arithmetic and logic instructions are data processing.', 'Lệnh số học và logic là xử lý dữ liệu.']),
    q('c3', ['A conditional jump instruction is mainly a …', 'Lệnh nhảy có điều kiện chủ yếu là lệnh …'], ['control (transfer of control) instruction', 'data processing instruction', 'I/O instruction', 'storage instruction'], ['It may change the PC depending on a condition code.', 'Nó có thể đổi PC tuỳ mã điều kiện.']),
    q('c4', ['Increasing the number of opcode bits lets the ISA …', 'Tăng số bit opcode cho phép ISA …'], ['define more distinct operations', 'address more memory', 'run faster', 'use fewer registers'], ['n opcode bits give up to 2ⁿ operations.', 'n bit opcode cho tối đa 2ⁿ phép toán.']),
    q('c5', ['A fixed-length instruction format (RISC) mainly helps …', 'Khuôn dạng lệnh độ dài cố định (RISC) chủ yếu giúp …'], ['simple, fast decoding and pipelining', 'smaller programs in all cases', 'more addressing modes', 'larger immediate values'], ['Equal-sized instructions are fetched and decoded in a predictable way.', 'Lệnh cùng kích thước được nạp và giải mã theo cách dự đoán được.']),
  ],
  goiY: ['Opcode = what; operands = on what; next-instruction reference = where next.', 'RISC trades code density for simplicity.'],
  loiHayGap: ['Thinking the opcode holds the operand address.', 'Counting a conditional jump as data processing.'],
  thuatNgu: [tn('opcode', 'mã thao tác'), tn('operand', 'toán hạng')],
  khaiNiem: ['instruction elements'],
});

const FM = [[32, 64, 32], [32, 100, 16], [32, 40, 64], [16, 16, 8]];
const E2 = tinh({
  tieuDe: 'Instruction 2 — How many bits are left for the immediate?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>An instruction of <b>L</b> bits has an opcode that can name <b>N</b> operations and two register fields, each able to name <b>R</b> registers. Give the opcode bits, the bits of one register field, the bits left for an <b>immediate</b> constant, and the smallest and largest <b>signed</b> immediate (two’s complement).</p>', '<p>Lệnh <b>L</b> bit có opcode gọi tên được <b>N</b> phép toán và hai trường thanh ghi, mỗi trường gọi tên được <b>R</b> thanh ghi. Cho số bit opcode, số bit một trường thanh ghi, số bit còn lại cho hằng <b>tức thời</b> và hằng tức thời <b>có dấu</b> nhỏ nhất, lớn nhất (bù 2).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Immediate field', 'Trường hằng tức thời'], [{ ma: 'f', ten: 'L, N, R' }, { ma: 'o', ten: 'Opcode' }, { ma: 'r', ten: 'Reg field' }, { ma: 'i', ten: 'Imm bits' }, { ma: 'lo', ten: 'Min signed' }, { ma: 'hi', ten: 'Max signed' }],
    FM.map(([L, N, R]) => { const o = Math.ceil(Math.log2(N)), r = Math.ceil(Math.log2(R)), im = L - o - 2 * r; return { o: { f: `L = ${L}, N = ${N}, R = ${R}` }, a: { o: String(o), r: String(r), i: String(im), lo: String(-(2 ** (im - 1))), hi: String(2 ** (im - 1) - 1) } }; }),
    [FM.map(([L, N, R]) => { const o = Math.ceil(Math.log2(N)), r = Math.ceil(Math.log2(R)), im = L - o - 2 * r; return `N=${N}→${o} bits, R=${R}→${r} bits each: ${L}−${o}−2×${r} = ${im} bits, range ${-(2 ** (im - 1))}..${2 ** (im - 1) - 1}`; }).join('; ') + '.', FM.map(([L, N, R]) => { const o = Math.ceil(Math.log2(N)), r = Math.ceil(Math.log2(R)), im = L - o - 2 * r; return `N=${N}→${o}, R=${R}→${r}: còn ${im} bit, miền ${-(2 ** (im - 1))}..${2 ** (im - 1) - 1}`; }).join('; ') + '.'])],
  goiY: ['bits = ⌈log₂ count⌉ — round up.', 'A signed k-bit value ranges from −2^(k−1) to 2^(k−1) − 1.'],
  loiHayGap: ['Rounding down log₂ N (100 operations need 7 bits, not 6).', 'Using the unsigned range for a signed immediate.'],
  thuatNgu: [tn('immediate', 'hằng tức thời')],
  khaiNiem: ['instruction format'],
});

const MACH = [['3-address', 3, 6, 7, 8]];
const E3 = tinh({
  tieuDe: 'Instruction 3 — 3-, 2-, 1- and 0-address machines: count the instructions',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Count the instructions of the shortest program that computes each expression on four kinds of machine. Rules: <b>3-address</b> (<code>OP dst, s1, s2</code>); <b>2-address</b> (<code>OP dst, src</code> computes dst ← dst OP src; <code>MOV</code> copies); <b>1-address</b> (accumulator: <code>LOAD, STORE, ADD, SUB, MUL</code>); <b>0-address</b> (stack: <code>PUSH, POP</code> and zero-operand ADD/SUB/MUL). Memory variables only; use temporaries as needed and do not recompute anything.</p>', '<p>Đếm số lệnh của chương trình ngắn nhất tính mỗi biểu thức trên bốn loại máy. Quy tắc: <b>3 địa chỉ</b> (<code>OP dst, s1, s2</code>); <b>2 địa chỉ</b> (<code>OP dst, src</code> tính dst ← dst OP src; <code>MOV</code> sao chép); <b>1 địa chỉ</b> (thanh ghi tích luỹ: <code>LOAD, STORE, ADD, SUB, MUL</code>); <b>0 địa chỉ</b> (ngăn xếp: <code>PUSH, POP</code> và ADD/SUB/MUL không toán hạng). Chỉ biến trong bộ nhớ; dùng biến tạm khi cần và không tính lại gì.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Instruction counts', 'Số lệnh'], [{ ma: 'e', ten: 'Expression' }, { ma: 'a3', ten: '3-address' }, { ma: 'a2', ten: '2-address' }, { ma: 'a1', ten: '1-address' }, { ma: 'a0', ten: '0-address' }],
    [{ o: { e: 'X = (A + B) × (C − D)' }, a: { a3: '3', a2: '5', a1: '7', a0: '8' } }, { o: { e: 'X = A × B + C × D' }, a: { a3: '3', a2: '5', a1: '7', a0: '8' } }, { o: { e: 'X = (A + B) × C' }, a: { a3: '2', a2: '3', a1: '4', a0: '6' } }],
    ['(A+B)×(C−D): 3-addr ADD T1,A,B / SUB T2,C,D / MUL X,T1,T2 = 3; 2-addr MOV X,A / ADD X,B / MOV T,C / SUB T,D / MUL X,T = 5 (X itself is the working variable, so no final MOV is needed); 1-addr LOAD A / ADD B / STORE T / LOAD C / SUB D / MUL T / STORE X = 7; stack PUSH A / PUSH B / ADD / PUSH C / PUSH D / SUB / MUL / POP X = 8. A×B + C×D has the same shape. (A+B)×C: 2 (ADD T,A,B / MUL X,T,C), 3 (MOV X,A / ADD X,B / MUL X,C), 4 (LOAD A / ADD B / MUL C / STORE X), 6 (PUSH A / PUSH B / ADD / PUSH C / MUL / POP X).', '(A+B)×(C−D): 3 địa chỉ: ADD T1,A,B / SUB T2,C,D / MUL X,T1,T2 = 3; 2 địa chỉ: MOV X,A / ADD X,B / MOV T,C / SUB T,D / MUL X,T = 5 (chính X là biến làm việc nên không cần MOV cuối); 1 địa chỉ: LOAD A / ADD B / STORE T / LOAD C / SUB D / MUL T / STORE X = 7; ngăn xếp: PUSH A / PUSH B / ADD / PUSH C / PUSH D / SUB / MUL / POP X = 8. A×B + C×D cùng dạng. (A+B)×C: 2, 3, 4, 6. Càng ít địa chỉ càng nhiều lệnh nhưng mỗi lệnh ngắn hơn.'])],
  goiY: ['Write the programs out; do not guess.', 'Fewer addresses per instruction ⇒ more instructions but each is shorter.'],
  loiHayGap: ['Forgetting the final STORE/MOV/POP of the result.', 'Not using a temporary and overwriting an operand you still need.'],
  thuatNgu: [tn('accumulator machine', 'máy một địa chỉ (thanh ghi tích luỹ)'), tn('stack machine', 'máy ngăn xếp')],
  khaiNiem: ['number of addresses'],
});

const PROG1 = ['PUSH 6', 'PUSH 4', 'ADD', 'PUSH 3', 'MUL', 'PUSH 5', 'SUB'];
const stackRun = function stackRun(program) {
  var st = [], maxDepth = 0, tops = [];
  for (var i = 0; i < program.length; i++) {
    var p = program[i].split(' '), op = p[0], a, b;
    if (op === 'PUSH') st.push(Number(p[1]));
    else if (op === 'DUP') st.push(st[st.length - 1]);
    else if (op === 'SWAP') { a = st.pop(); b = st.pop(); st.push(a); st.push(b); }
    else {
      b = st.pop(); a = st.pop();
      if (op === 'ADD') st.push(a + b);
      else if (op === 'SUB') st.push(a - b);
      else if (op === 'MUL') st.push(a * b);
      else if (op === 'DIV') st.push(Math.trunc(a / b));
    }
    if (st.length > maxDepth) maxDepth = st.length;
    tops.push(st.length ? st[st.length - 1] : null);
  }
  return { result: st.length ? st[st.length - 1] : null, maxDepth: maxDepth, depth: st.length, tops: tops };
};
const tr1 = stackRun(PROG1);
const E4 = tinh({
  tieuDe: 'Instruction 4 — Run a stack-machine program',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>A stack machine executes (SUB computes second-from-top − top):</p>${code(PROG1.join('\n'))}<p>After each instruction give the <b>top of stack</b> and the <b>depth</b> of the stack.</p>`, `<p>Máy ngăn xếp thực hiện (SUB tính phần tử thứ hai − đỉnh):</p>${code(PROG1.join('\n'))}<p>Sau mỗi lệnh cho <b>đỉnh ngăn xếp</b> và <b>độ sâu</b> của ngăn xếp.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Stack trace', 'Vết ngăn xếp'], [{ ma: 'i', ten: 'Instruction' }, { ma: 't', ten: 'Top' }, { ma: 'd', ten: 'Depth' }],
    (() => { const d = []; let n = 0; return PROG1.map((p, i) => { n += p.startsWith('PUSH') ? 1 : -1; return { o: { i: p }, a: { t: String(tr1.tops[i]), d: String(n) } }; }); })(),
    ['This is the postfix form of ((6 + 4) × 3) − 5 = ' + tr1.result + '. Binary operators pop two and push one, so the depth drops by one.', 'Đây là dạng hậu tố của ((6 + 4) × 3) − 5 = ' + tr1.result + '. Toán tử hai ngôi lấy ra hai và đẩy vào một nên độ sâu giảm một.'])],
  goiY: ['PUSH adds one element; a binary operator removes two and adds one.', 'SUB: second − top.'],
  loiHayGap: ['Computing top − second for SUB.', 'Leaving the operands on the stack after an operator.'],
  thuatNgu: [tn('postfix (RPN)', 'ký pháp hậu tố')],
  khaiNiem: ['stack machine'],
});

const E5 = jsDe({
  tieuDe: 'Instruction 5 — Write a stack-machine interpreter',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>stackRun(program)</code>. <code>program</code> is an array of strings: <code>"PUSH n"</code>, <code>"ADD"</code>, <code>"SUB"</code> (second − top), <code>"MUL"</code>, <code>"DIV"</code> (second ÷ top truncated toward zero with <code>Math.trunc</code>), <code>"DUP"</code> (copy the top) and <code>"SWAP"</code> (exchange the two top elements). Return <code>{ result, maxDepth, depth, tops }</code>: <code>result</code> = top of stack at the end (<code>null</code> if empty), <code>maxDepth</code> = the largest depth reached, <code>depth</code> = final depth, <code>tops</code> = the top after every instruction (<code>null</code> if the stack is empty).</p>', '<p>Viết <code>stackRun(program)</code>. <code>program</code> là mảng chuỗi: <code>"PUSH n"</code>, <code>"ADD"</code>, <code>"SUB"</code> (phần tử thứ hai − đỉnh), <code>"MUL"</code>, <code>"DIV"</code> (phần tử thứ hai ÷ đỉnh, cắt về 0 bằng <code>Math.trunc</code>), <code>"DUP"</code> (chép đỉnh) và <code>"SWAP"</code> (đổi hai phần tử trên cùng). Trả <code>{ result, maxDepth, depth, tops }</code>: <code>result</code> = đỉnh cuối cùng (<code>null</code> nếu rỗng), <code>maxDepth</code> = độ sâu lớn nhất, <code>depth</code> = độ sâu cuối, <code>tops</code> = đỉnh sau từng lệnh (<code>null</code> nếu rỗng).</p>'),
  viDu: [{ input: 'stackRun(["PUSH 6","PUSH 4","ADD","PUSH 3","MUL"])', output: JSON.stringify(stackRun(['PUSH 6', 'PUSH 4', 'ADD', 'PUSH 3', 'MUL'])), explanation: '(6 + 4) × 3 = 30; the stack never holds more than 2 values.|||(6 + 4) × 3 = 30; ngăn xếp không bao giờ quá 2 phần tử.' }],
  goiY: ['Use an array with push/pop. For a binary operator pop b (top) first, then a.', 'Update maxDepth after every instruction.', 'SUB and DIV are not commutative — the order of a and b matters.'],
  loiHayGap: ['Computing b − a for SUB.', 'Forgetting the null for an empty stack.'],
  giaiThich: '<p>An expression in postfix form is evaluated by one left-to-right pass with a stack; the maximum depth tells how many temporary values the hardware stack must hold.</p>',
  khaiNiem: ['stack machine', 'postfix evaluation'],
  fn: 'stackRun',
  dau: 'function stackRun(program) {\n  return { result: null, maxDepth: 0, depth: 0, tops: [] };\n}\n',
  giaiMa: dat(stackRun, 'stackRun'),
  ref: stackRun,
  cases: [{ args: [PROG1] }, { args: [['PUSH 2', 'DUP', 'MUL', 'DUP', 'MUL']] }, { args: [['PUSH 10', 'PUSH 3', 'DIV', 'PUSH 7', 'SWAP', 'SUB']] }, { args: [['PUSH 1', 'PUSH 2', 'PUSH 3', 'PUSH 4', 'ADD', 'ADD', 'ADD']] }, { args: [['PUSH -7', 'PUSH 2', 'DIV']], an: true }, { args: [[]], an: true }, { args: [['PUSH 5', 'PUSH 8', 'SUB', 'PUSH 3', 'MUL']], an: true }],
});

export default doiDau({
  slug: 'cea201-10-1-instruction-anatomy',
  ten: '10.1 Anatomy of a machine instruction',
  khoa: KHOA,
  baiHoc: 'cea201-10-1-instruction-anatomy',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc; void MACH;
