/** CEA201 · LAB chương 16 — Trình dịch hợp ngữ + máy ảo MARIE. Tham chiếu: S.marieAssemble + S.marieRun (đã đối chiếu ví dụ slide). */
import { doiDau, KHOA, S, bi, tab, jsDe, dat } from './_ce.mjs';

const P2 = `ORG 100
Loop,   Load N          / AC <- N
        Skipcond 800    / AC > 0 ? skip next
        Jump Done
        Load Sum
        Add N
        Store Sum
        Load N
        Subt One
        Store N
        Jump Loop
Done,   Load Sum
        Output
        Halt 000
N,      Dec 3
Sum,    Dec 0
One,    Dec 1`;
const PS = `ORG 100
        Load   Addr
        Store  Next
        Load   Num
        Subt   One
        Store  Ctr
Loop,   Load   Sum
        AddI   Next
        Store  Sum
        Load   Next
        Add    One
        Store  Next
        Load   Ctr
        Subt   One
        Store  Ctr
        Skipcond 000
        Jump   Loop
        Load   Sum
        Output
        Halt   000
Addr,   Hex    119
Next,   Hex    0
Num,    Dec    3
Sum,    Dec    0
Ctr,    Hex    0
One,    Dec    1
        Dec    10
        Dec    15
        Dec    20`;
const SUBR = `ORG 100
        Load   A
        JnS    Dbl
        Store  A
        Load   B
        JnS    Dbl
        Output
        Load   A
        Output
        Halt
A,      Dec    21
B,      Dec    -5
Dbl,    Hex    0
        Store  T
        Add    T
        JumpI  Dbl
T,      Dec    0`;
const ECHO = `ORG 000
Input
Output
Input
Add Seven
Output
Halt
Seven, Dec 7`;
const NEG = `ORG 200
Load Z
Subt One
Output
Clear
Output
Halt
Z, Dec 0
One, Dec 1
Big, Hex FFFF
Oct8, Oct 17`;

// tham chiếu dựng từ hai hàm của bộ mô phỏng
const ref = (src, input) => { const r = S.marieRun(src, input, 100000); if (r.error) return { error: r.error }; return { words: S.marieAssemble(src), output: r.output, steps: r.steps, ac: r.ac }; };

const GIAI = `// Reference solution: a two-pass assembler followed by the fetch/decode/execute loop.
function marieLab(src, input) {
  var OPS = { jns: 0, load: 1, store: 2, add: 3, subt: 4, input: 5, output: 6, halt: 7, skipcond: 8, jump: 9, clear: 10, addi: 11, jumpi: 12, loadi: 13, storei: 14 };
  var lines = src.split('\\n'), items = [], labels = {}, loc = 0, i, ln;
  // pass 1: location counter + symbol table
  for (i = 0; i < lines.length; i++) {
    ln = lines[i].replace(/\\/.*$/, '').trim();
    if (!ln) continue;
    var lab = null, m = /^([A-Za-z_][A-Za-z0-9_]*)\\s*,\\s*(.*)$/.exec(ln);
    if (m) { lab = m[1]; ln = m[2].trim(); }
    var parts = ln.split(/\\s+/), op = (parts[0] || '').toLowerCase(), arg = parts[1];
    if (op === 'org') { loc = parseInt(arg, 16); continue; }
    if (lab) labels[lab] = loc;
    if (!op) continue;
    items.push({ loc: loc, op: op, arg: arg });
    loc++;
  }
  // pass 2: generate machine words
  var mem = [];
  for (i = 0; i < 4096; i++) mem.push(0);
  var hex = function (n, w) { var s = n.toString(16).toUpperCase(); while (s.length < w) s = '0' + s; return s; };
  var words = [];
  for (i = 0; i < items.length; i++) {
    var it = items[i], w;
    if (it.op === 'dec') w = (parseInt(it.arg, 10) + 65536) & 65535;
    else if (it.op === 'hex') w = parseInt(it.arg, 16) & 65535;
    else if (it.op === 'oct') w = parseInt(it.arg, 8) & 65535;
    else {
      if (!(it.op in OPS)) return { error: 'unknown mnemonic ' + it.op };
      var a = it.arg === undefined ? 0 : (it.arg in labels ? labels[it.arg] : parseInt(it.arg, 16));
      w = (OPS[it.op] << 12) | (a & 4095);
    }
    mem[it.loc] = w;
    words.push({ addr: hex(it.loc, 3), word: hex(w, 4) });
  }
  // run
  var signed = function (x) { return x >= 32768 ? x - 65536 : x; };
  var pc = items.length ? items[0].loc : 0, ac = 0, out = [], steps = 0, halted = false, inp = (input || []).slice();
  while (!halted && steps < 100000) {
    var ir = mem[pc], opc = ir >> 12, ad = ir & 4095;
    pc++; steps++;
    if (opc === 0) { mem[ad] = pc; pc = ad + 1; }
    else if (opc === 1) ac = mem[ad];
    else if (opc === 2) mem[ad] = ac;
    else if (opc === 3) ac = (ac + mem[ad]) & 65535;
    else if (opc === 4) ac = (ac - mem[ad] + 65536) & 65535;
    else if (opc === 5) ac = ((inp.length ? inp.shift() : 0) + 65536) & 65535;
    else if (opc === 6) out.push(signed(ac));
    else if (opc === 7) halted = true;
    else if (opc === 8) {
      var c = (ir >> 10) & 3;
      if ((c === 0 && signed(ac) < 0) || (c === 1 && ac === 0) || (c === 2 && signed(ac) > 0)) pc++;
    }
    else if (opc === 9) pc = ad;
    else if (opc === 10) ac = 0;
    else if (opc === 11) ac = (ac + mem[mem[ad] & 4095]) & 65535;
    else if (opc === 12) pc = mem[ad] & 4095;
    else if (opc === 13) ac = mem[mem[ad] & 4095];
    else if (opc === 14) mem[mem[ad] & 4095] = ac;
  }
  return { words: words, output: out, steps: steps, ac: signed(ac) };
}
`;
const LAB = jsDe({
  tieuDe: 'Lab 16 — A MARIE assembler and virtual machine',
  doKho: 'HARD', phut: 75, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> You are building the toolchain for the MARIE simulator used in the course. Write <code>marieLab(src, input)</code> that <b>assembles</b> a MARIE program and <b>runs</b> it.</p>
<h4>Source format</h4>
<ul>
<li>One statement per line; everything after <code>/</code> is a comment; blank lines are ignored. A label is a name followed by a comma: <code>Loop, Load N</code> (a label always precedes a statement on the same line).</li>
<li><code>ORG hex</code> sets the location counter (hexadecimal); default 000. Every other statement occupies one word and increases the counter by 1. <b>Execution starts at the address of the first statement.</b></li>
<li>Mnemonics (case-insensitive): <code>JnS Load Store Add Subt Input Output Halt Skipcond Jump Clear AddI JumpI LoadI StoreI</code> with opcodes 0…E. An operand is a label or a hexadecimal address; <code>Input Output Halt Clear</code> may carry an ignored operand (e.g. <code>Halt 000</code>). <code>Skipcond</code> takes its hex literal (000 / 400 / 800) as the address field.</li>
<li>Data: <code>Dec n</code> (decimal, negative allowed, stored as 16-bit two’s complement) · <code>Hex h</code> · <code>Oct o</code>.</li>
<li>An unknown mnemonic ⇒ return <code>{ error: "unknown mnemonic xyz" }</code> (xyz in lower case).</li>
</ul>
<h4>Machine</h4>
<ul>
<li>Words are 16 bits; 4096 words of memory, initially 0. AC is 16-bit; arithmetic wraps modulo 2¹⁶; <code>Output</code> prints the AC as a <b>signed</b> number.</li>
<li>PC is incremented right after the fetch. <code>Input</code> takes the next value of <code>input</code> (0 when exhausted). <code>Skipcond</code> checks bits 11–10 of the address field: 00 AC&lt;0 · 01 AC=0 · 10 AC&gt;0, and skips the next instruction by adding 1 to the PC. <code>JnS X</code> stores the PC at X and continues at X+1. <code>LoadI X</code>: AC ← M[M[X]]; <code>StoreI X</code>: M[M[X]] ← AC.</li>
<li>Stop at <code>Halt</code> or after 100000 instructions.</li>
</ul>
<p>Return <code>{ words, output, steps, ac }</code>: <code>words</code> = the assembled statements in source order as <code>{ addr, word }</code> (<code>addr</code> 3 hex digits, <code>word</code> 4 hex digits, capital letters); <code>output</code> = printed numbers; <code>steps</code> = instructions executed including Halt; <code>ac</code> = final AC (signed).</p>
<h4>Sample</h4>${tab(['source', 'output'], [['the lecture program that sums N + (N−1) + … + 1 for N = 3', '[6]'], ['the 5 × 4 multiplication loop', '[20] in 46 instructions'], ['the pointer-sum with AddI', '[45] in 40 instructions']])}`,
  `<p><b>Tình huống.</b> Bạn xây bộ công cụ cho trình mô phỏng MARIE dùng trong môn học. Viết <code>marieLab(src, input)</code> vừa <b>dịch</b> vừa <b>chạy</b> chương trình MARIE.</p>
<h4>Khuôn dạng mã nguồn</h4>
<ul>
<li>Mỗi dòng một câu lệnh; mọi thứ sau <code>/</code> là chú thích; dòng trống bỏ qua. Nhãn là tên theo sau bởi dấu phẩy: <code>Loop, Load N</code> (nhãn luôn đứng trước câu lệnh trên cùng dòng).</li>
<li><code>ORG hex</code> đặt bộ đếm vị trí (hex); mặc định 000. Mọi câu lệnh khác chiếm một từ và tăng bộ đếm 1. <b>Chương trình bắt đầu chạy ở địa chỉ của câu lệnh đầu tiên.</b></li>
<li>Mã gợi nhớ (không phân biệt hoa thường): <code>JnS Load Store Add Subt Input Output Halt Skipcond Jump Clear AddI JumpI LoadI StoreI</code> với mã 0…E. Toán hạng là nhãn hoặc địa chỉ hex; <code>Input Output Halt Clear</code> có thể kèm toán hạng bị bỏ qua (vd <code>Halt 000</code>). <code>Skipcond</code> lấy hằng hex (000 / 400 / 800) làm trường địa chỉ.</li>
<li>Dữ liệu: <code>Dec n</code> (thập phân, cho phép âm, lưu dạng bù 2 16 bit) · <code>Hex h</code> · <code>Oct o</code>.</li>
<li>Mã gợi nhớ lạ ⇒ trả <code>{ error: "unknown mnemonic xyz" }</code> (xyz viết thường).</li>
</ul>
<h4>Máy</h4>
<ul>
<li>Từ 16 bit; bộ nhớ 4096 từ, ban đầu bằng 0. AC 16 bit; số học quấn modulo 2¹⁶; <code>Output</code> in AC dạng số <b>có dấu</b>.</li>
<li>PC tăng ngay sau khi nạp lệnh. <code>Input</code> lấy giá trị kế tiếp của <code>input</code> (0 khi hết). <code>Skipcond</code> xét bit 11–10 của trường địa chỉ: 00 AC&lt;0 · 01 AC=0 · 10 AC&gt;0 và bỏ qua lệnh kế bằng cách cộng 1 vào PC. <code>JnS X</code> lưu PC vào X và chạy tiếp ở X+1. <code>LoadI X</code>: AC ← M[M[X]]; <code>StoreI X</code>: M[M[X]] ← AC.</li>
<li>Dừng ở <code>Halt</code> hoặc sau 100000 lệnh.</li>
</ul>
<p>Trả <code>{ words, output, steps, ac }</code>: <code>words</code> = các câu lệnh đã dịch theo thứ tự nguồn dạng <code>{ addr, word }</code> (<code>addr</code> 3 chữ số hex, <code>word</code> 4 chữ số hex, chữ hoa); <code>output</code> = các số đã in; <code>steps</code> = số lệnh đã thực hiện gồm Halt; <code>ac</code> = AC cuối (có dấu).</p>`),
  yeuCau: [bi('Do not modify <code>input</code>.', 'Không sửa <code>input</code>.'), bi('Forward references (a label used before its definition) must work: use two passes.', 'Phải hỗ trợ tham chiếu tới trước (nhãn dùng trước khi định nghĩa): dùng hai lượt.')],
  viDu: [{ input: `marieLab(${JSON.stringify(ECHO)}, [5, 6]).output`, output: JSON.stringify(ref(ECHO, [5, 6]).output), explanation: 'Echo 5, then 6 + 7 = 13.|||In lại 5, rồi 6 + 7 = 13.' }, { input: `marieLab(${JSON.stringify(P2)}, []).steps`, output: String(ref(P2, []).steps), explanation: 'The lecture sum-loop prints 6.|||Chương trình cộng dồn trong bài giảng in 6.' }],
  goiY: ['First pass: strip comments, split off the label, handle ORG, record each label’s address and collect the statements. Second pass: encode with the symbol table.', 'Encode instructions as (opcode << 12) | address; Dec uses two’s complement (n + 65536) & 65535.', 'Write the machine loop last; test with the three lecture programs (outputs 6 · 20 · 45 and 46/40 instructions).'],
  loiHayGap: ['Resolving labels in a single pass (forward references fail).', 'Printing the AC unsigned (−1 shows as 65535).', 'Incrementing the PC after executing the instruction (JnS and Skipcond break).', 'Forgetting that execution starts at the first statement, not at address 0.'],
  giaiThich: '<p>An assembler is a two-pass translator (pass 1 builds the symbol table, pass 2 emits code) and the machine is a fetch–decode–execute loop. Together they are the whole path from source text to a running computer — the point of this chapter of the course.</p>',
  khaiNiem: ['assembler', 'symbol table', 'fetch–decode–execute', 'MARIE'],
  fn: 'marieLab',
  tep: 'answer.js',
  dau: 'function marieLab(src, input) {\n  // 1. assemble (two passes)  2. run\n  return { words: [], output: [], steps: 0, ac: 0 };\n}\n',
  giaiMa: GIAI,
  ref,
  cases: [
    { args: [P2, []] }, { args: [PS, []] }, { args: [ECHO, [5, 6]] }, { args: [SUBR, []] },
    { args: [NEG, []], an: true }, { args: [`ORG 100\nLoop, Load Ctr\nSkipcond 400\nJump Body\nJump Done\nBody, Load Sum\nAdd X\nStore Sum\nLoad Ctr\nSubt One\nStore Ctr\nJump Loop\nDone, Load Sum\nOutput\nHalt 000\nX, Dec 5\nCtr, Dec 4\nSum, Dec 0\nOne, Dec 1`, []], an: true },
    { args: ['ORG 10\nFoo 1\nHalt', []], an: true }, { args: ['Input\nStore X\nLoad X\nAdd X\nOutput\nHalt\nX, Dec 0', [-4]], an: true },
    { args: ['ORG 100\nLoadI P\nOutput\nLoad V\nStoreI P\nLoadI P\nOutput\nHalt\nP, Hex 105\nV, Dec 77\nCell, Dec 9', []], an: true },
  ],
});

export default doiDau({
  slug: 'cea201-16-lab-marie-assembler',
  ten: 'Lab 16 — A MARIE assembler and virtual machine',
  khoa: KHOA,
  baiHoc: 'cea201-n1-1-marie',
  de: [LAB],
});
void dat;
