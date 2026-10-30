/** CEA201 · 9.2 — Combinational & sequential circuits: decoder, mux, adders, flip-flops, counters. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, ord, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Circuits 1 — Decoders, multiplexers, adders and flip-flops: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on the building blocks of a datapath.</p>', '<p>Câu hỏi khái niệm về các khối xây dựng của đường dữ liệu.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A 3-to-8 decoder has …', 'Bộ giải mã 3-sang-8 có …'], ['3 inputs and 8 outputs, exactly one of which is 1', '8 inputs and 3 outputs, giving the number of the active input', '3 inputs and 3 outputs, exactly one of which is 0', '8 inputs and 8 outputs, each output a copy of one input'], ['It turns a binary number into a one-hot output.', 'Nó biến số nhị phân thành đầu ra one-hot.']),
    q('c2', ['An 8-to-1 multiplexer needs how many select lines?', 'Bộ chọn kênh 8-sang-1 cần bao nhiêu đường chọn?'], ['3', '8', '1', '4'], ['log₂ 8 = 3.', 'log₂ 8 = 3.']),
    q('c3', ['A half adder computes …', 'Bộ cộng nửa tính …'], ['sum = A ⊕ B and carry = A·B', 'sum = A·B and carry = A ⊕ B', 'sum = A + B only', 'carry = A ⊕ B ⊕ Cin'], ['No carry-in, so it adds two bits only.', 'Không có nhớ vào nên chỉ cộng hai bit.']),
    q('c4', ['The difference between a latch/flip-flop and a combinational circuit is that it …', 'Khác biệt giữa chốt/flip-flop và mạch tổ hợp là nó …'], ['stores state: the output depends on the past inputs', 'has no inputs: the output is fixed when it is built', 'is always slower: the output depends on gate delay only', 'has no clock: the output changes only on power-up'], ['Sequential circuits have memory.', 'Mạch tuần tự có bộ nhớ.']),
    q('c5', ['A T flip-flop with T = 1 …', 'Flip-flop T với T = 1 …'], ['toggles on every clock edge', 'holds its value', 'always sets', 'always resets'], ['T = 0 holds; T = 1 toggles — the basis of binary counters.', 'T = 0 giữ; T = 1 đảo — nền tảng của bộ đếm nhị phân.']),
    q('c6', ['How many flip-flops are needed for a counter with 10 states?', 'Cần bao nhiêu flip-flop cho bộ đếm 10 trạng thái?'], ['4', '10', '5', '3'], ['⌈log₂ 10⌉ = 4.', '⌈log₂ 10⌉ = 4.']),
  ],
  goiY: ['Decoder: n → 2ⁿ. Mux: 2ⁿ → 1 with n selects.', 'n flip-flops give up to 2ⁿ states.'],
  loiHayGap: ['Mixing the number of select lines and data inputs of a mux.', 'Forgetting that sequential circuits need a clock.'],
  thuatNgu: [tn('one-hot', 'chỉ một bit bằng 1'), tn('flip-flop', 'flip-flop (phần tử nhớ 1 bit)')],
  khaiNiem: ['decoder', 'multiplexer', 'adder', 'flip-flop'],
});

const FA = [];
for (let i = 0; i < 8; i++) FA.push([(i >> 2) & 1, (i >> 1) & 1, i & 1]);
const E2 = tinh({
  tieuDe: 'Circuits 2 — The full-adder truth table',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>A full adder adds A + B + Cin. Give Sum and Cout for every input combination.</p>', '<p>Bộ cộng đầy đủ cộng A + B + Cin. Cho Sum và Cout với mọi tổ hợp ngõ vào.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Full adder', 'Bộ cộng đầy đủ'], [{ ma: 'i', ten: 'A B Cin' }, { ma: 's', ten: 'Sum', luaChon: ['0', '1'] }, { ma: 'c', ten: 'Cout', luaChon: ['0', '1'] }],
    FA.map(([a, b, c]) => ({ o: { i: `${a} ${b} ${c}` }, a: { s: String((a + b + c) & 1), c: String((a + b + c) >> 1) } })),
    ['Sum = A ⊕ B ⊕ Cin (odd number of ones); Cout = 1 when at least two inputs are 1 (majority). The binary value of Cout·Sum equals A + B + Cin.', 'Sum = A ⊕ B ⊕ Cin (số lẻ bit 1); Cout = 1 khi có ít nhất hai ngõ vào bằng 1 (đa số). Giá trị nhị phân Cout·Sum bằng A + B + Cin.'])],
  goiY: ['Count the ones: the binary value of the count is (Cout Sum).', 'Sum = 1 for an odd count.'],
  loiHayGap: ['Giving Cout = 1 for a single 1 input.', 'Confusing Sum with OR.'],
  thuatNgu: [tn('carry-out', 'nhớ ra')],
  khaiNiem: ['full adder'],
});

const AD = [['0110', '0011'], ['1011', '0101'], ['0111', '0001'], ['1000', '1000'], ['1111', '0001']];
const ovf = (a, b, r) => (a[0] === b[0] && r.sum[0] !== a[0] ? 1 : 0);
const E3 = tinh({
  tieuDe: 'Circuits 3 — Ripple-carry addition, carry and overflow',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A 4-bit ripple-carry adder adds two numbers. Give the <b>4-bit sum</b>, the <b>carry-out</b> of the top bit, and the <b>signed overflow</b> flag (two’s complement: overflow when both operands have the same sign and the sum has a different sign).</p>', '<p>Bộ cộng nối tiếp 4 bit cộng hai số. Cho <b>tổng 4 bit</b>, <b>nhớ ra</b> của bit cao nhất và cờ <b>tràn có dấu</b> (bù 2: tràn khi hai toán hạng cùng dấu nhưng tổng khác dấu).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Ripple-carry', 'Cộng nối tiếp'], [{ ma: 'x', ten: 'A + B' }, { ma: 's', ten: 'Sum' }, { ma: 'c', ten: 'Carry-out' }, { ma: 'o', ten: 'Overflow', luaChon: ['0', '1'] }],
    AD.map(([a, b]) => { const r = S.rippleAdd(a, b); return { o: { x: `${a} + ${b}` }, a: { s: r.sum, c: String(r.carryOut), o: String(ovf(a, b, r)) } }; }),
    [AD.map(([a, b]) => { const r = S.rippleAdd(a, b); return `${a}+${b} = ${r.sum}, carry ${r.carryOut}, overflow ${ovf(a, b, r)}`; }).join('; ') + '. Carry-out and signed overflow are different flags (carry matters for unsigned, overflow for signed numbers).', AD.map(([a, b]) => { const r = S.rippleAdd(a, b); return `${a}+${b} = ${r.sum}, nhớ ${r.carryOut}, tràn ${ovf(a, b, r)}`; }).join('; ') + '.'])],
  goiY: ['Add from the right, carrying into the next bit.', 'Signed overflow only when the operands have equal sign bits and the result differs.'],
  loiHayGap: ['Equating carry-out with overflow.', 'Starting the addition from the left.'],
  thuatNgu: [tn('overflow', 'tràn số'), tn('carry', 'nhớ')],
  khaiNiem: ['binary addition', 'overflow'],
});

const JK = [[1, 0], [0, 0], [1, 1], [1, 1], [0, 1], [0, 0], [1, 0]];
const jk = (seq, q0) => { let s = q0; return seq.map(([j, k]) => { if (j && k) s ^= 1; else if (j) s = 1; else if (k) s = 0; return s; }); };
const DS = [1, 1, 0, 1, 0, 0, 1];
const TS = [1, 0, 1, 1, 1, 0, 1];
const tq = (seq, q0) => { let s = q0; return seq.map((t) => (s ^= t)); };
const E4 = tinh({
  tieuDe: 'Circuits 4 — Follow a flip-flop through clock edges',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>All flip-flops start with Q = 0 and change only on a rising clock edge. For every edge give Q <b>after</b> the edge. <b>D</b>: Q takes D. <b>T</b>: Q toggles when T = 1. <b>JK</b>: J=1,K=0 sets; J=0,K=1 resets; J=K=1 toggles; J=K=0 holds.</p>', '<p>Mọi flip-flop bắt đầu với Q = 0 và chỉ đổi ở sườn lên của clock. Với mỗi sườn cho Q <b>sau</b> sườn đó. <b>D</b>: Q lấy giá trị D. <b>T</b>: Q đảo khi T = 1. <b>JK</b>: J=1,K=0 đặt; J=0,K=1 xoá; J=K=1 đảo; J=K=0 giữ.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['D flip-flop', 'Flip-flop D'], [{ ma: 'e', ten: 'Edge, D' }, { ma: 'q', ten: 'Q', luaChon: ['0', '1'] }], DS.map((d, i) => ({ o: { e: `edge ${i + 1}: D = ${d}` }, a: { q: String(d) } })), ['A D flip-flop simply copies D at each edge: ' + DS.join('') + '.', 'Flip-flop D chỉ chép D ở mỗi sườn: ' + DS.join('') + '.']),
  bang1('b2', ['T flip-flop', 'Flip-flop T'], [{ ma: 'e', ten: 'Edge, T' }, { ma: 'q', ten: 'Q', luaChon: ['0', '1'] }], TS.map((t, i) => ({ o: { e: `edge ${i + 1}: T = ${t}` }, a: { q: String(tq(TS, 0)[i]) } })), ['Q toggles when T = 1: ' + tq(TS, 0).join('') + '.', 'Q đảo khi T = 1: ' + tq(TS, 0).join('') + '.']),
  bang1('b3', ['JK flip-flop', 'Flip-flop JK'], [{ ma: 'e', ten: 'Edge, J, K' }, { ma: 'q', ten: 'Q', luaChon: ['0', '1'] }], JK.map(([j, k], i) => ({ o: { e: `edge ${i + 1}: J = ${j}, K = ${k}` }, a: { q: String(jk(JK, 0)[i]) } })), ['Q: ' + jk(JK, 0).join('') + '. J=K=1 toggles; J=K=0 holds.', 'Q: ' + jk(JK, 0).join('') + '. J=K=1 đảo; J=K=0 giữ.'])],
  goiY: ['Keep the current Q and update it at each edge using the rule of the flip-flop.', 'JK with J=K=1 is a toggle, like T=1.'],
  loiHayGap: ['Changing Q between edges.', 'Applying the JK rule to the pair of the previous edge.'],
  thuatNgu: [tn('clock edge', 'sườn xung nhịp'), tn('toggle', 'đảo trạng thái')],
  khaiNiem: ['flip-flops'],
});

const E5 = tinh({
  tieuDe: 'Circuits 5 — Order the design of a combinational circuit',
  doKho: 'EASY', phut: 6,
  moTa: bi('<p>Put the classic design procedure in order.</p>', '<p>Sắp xếp quy trình thiết kế kinh điển theo thứ tự.</p>'),
  loai: 'order',
  cauHoi: [ord('q1', ['Design a combinational circuit', 'Thiết kế mạch tổ hợp'], ['State the problem: inputs, outputs and what each output must be', 'Write the truth table', 'Derive the Boolean expression (sum of minterms)', 'Simplify it (laws or a Karnaugh map)', 'Draw the gate-level circuit and verify it against the truth table'], ['Truth table first; simplification reduces gates and delay; verify at the end.', 'Bảng chân trị trước; rút gọn giảm số cổng và độ trễ; kiểm lại ở cuối.'], 2)],
  goiY: ['You cannot simplify before you have an expression.', 'Verify last.'],
  loiHayGap: ['Drawing the circuit before the truth table.', 'Skipping verification.'],
  thuatNgu: [tn('Karnaugh map', 'bản đồ Karnaugh')],
  khaiNiem: ['combinational design'],
});

const addBits = function addBits(a, b) {
  var n = a.length, c = 0, s = '', cin = 0;
  for (var i = n - 1; i >= 0; i--) {
    var x = a[i] === '1' ? 1 : 0, y = b[i] === '1' ? 1 : 0;
    if (i === 0) cin = c;
    var sum = x ^ y ^ c;
    c = (x & y) | (c & (x ^ y));
    s = sum + s;
  }
  return { sum: s, carryOut: c, overflow: (cin ^ c) === 1 };
};
const E6 = jsDe({
  tieuDe: 'Circuits 6 — Build a ripple-carry adder with flags',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>addBits(a, b)</code> where <code>a</code> and <code>b</code> are binary strings of the same length (MSB first). Simulate a ripple-carry adder bit by bit using only boolean operators (full adders) and return <code>{ sum, carryOut, overflow }</code>: <code>sum</code> is the binary string of the same length, <code>carryOut</code> the carry out of the MSB (0/1) and <code>overflow</code> a boolean — the signed overflow, equal to <code>carry into MSB XOR carry out of MSB</code>.</p>', '<p>Viết <code>addBits(a, b)</code> với <code>a</code>, <code>b</code> là chuỗi nhị phân cùng độ dài (MSB trước). Mô phỏng bộ cộng nối tiếp từng bit chỉ bằng phép toán logic (bộ cộng đầy đủ) và trả <code>{ sum, carryOut, overflow }</code>: <code>sum</code> là chuỗi nhị phân cùng độ dài, <code>carryOut</code> là nhớ ra khỏi MSB (0/1), <code>overflow</code> là boolean — tràn có dấu, bằng <code>nhớ vào MSB XOR nhớ ra MSB</code>.</p>'),
  viDu: [{ input: 'addBits("0111", "0001")', output: JSON.stringify(addBits('0111', '0001')), explanation: '7 + 1 = 8 does not fit in 4-bit two’s complement: carry into MSB = 1, carry out = 0 ⇒ overflow.|||7 + 1 = 8 không vừa 4 bit bù 2: nhớ vào MSB = 1, nhớ ra = 0 ⇒ tràn.' }],
  goiY: ['Walk from the last character to the first, keeping the carry.', 'Full adder: sum = x ^ y ^ c, new carry = (x & y) | (c & (x ^ y)).', 'Remember the carry that enters the MSB column before you update it.'],
  loiHayGap: ['Using the carry-out alone as the overflow flag.', 'Using parseInt and + (no per-bit simulation, and it breaks the overflow flag).'],
  giaiThich: '<p>Signed overflow is the XOR of the carries into and out of the sign bit; unsigned overflow is just the carry out.</p>',
  khaiNiem: ['ripple-carry adder', 'overflow'],
  fn: 'addBits',
  dau: 'function addBits(a, b) {\n  return { sum: "", carryOut: 0, overflow: false };\n}\n',
  giaiMa: dat(addBits, 'addBits'),
  ref: addBits,
  cases: [{ args: ['0111', '0001'] }, { args: ['1111', '0001'] }, { args: ['0101', '0010'] }, { args: ['1000', '1000'] }, { args: ['10110010', '01101111'], an: true }, { args: ['11111111', '11111111'], an: true }, { args: ['0', '0'], an: true }, { args: ['01111111', '01111111'], an: true }],
});

export default doiDau({
  slug: 'cea201-9-2-circuits',
  ten: '9.2 Combinational & sequential circuits',
  khoa: KHOA,
  baiHoc: 'cea201-9-2-circuits',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void giai; void mc;
