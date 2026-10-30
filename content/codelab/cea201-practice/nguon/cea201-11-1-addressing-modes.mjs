/** CEA201 · 11.1 — Addressing modes: effective address & operand value. */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, dat, tab } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Addressing 1 — Immediate, direct, indirect, register and displacement',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on addressing modes.</p>', '<p>Câu hỏi khái niệm về các chế độ địa chỉ.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['In immediate addressing the operand …', 'Trong định địa chỉ tức thời toán hạng …'], ['is part of the instruction itself', 'is in the memory location named by the instruction', 'is in a register', 'is on the stack only'], ['No memory access is needed for the operand, but its size is limited by the instruction field.', 'Không cần truy cập bộ nhớ lấy toán hạng nhưng kích thước bị giới hạn bởi trường lệnh.']),
    q('c2', ['Indirect addressing needs (for the operand) … memory references', 'Định địa chỉ gián tiếp cần … lần tham chiếu bộ nhớ (cho toán hạng)'], ['two (the pointer, then the data)', 'zero', 'one', 'three'], ['The address field names a location that contains the real address.', 'Trường địa chỉ gọi tên ô nhớ chứa địa chỉ thật.']),
    q('c3', ['The main advantage of register addressing is …', 'Ưu điểm chính của định địa chỉ thanh ghi là …'], ['no memory access and a short address field', 'a very large address space', 'self-modifying code', 'automatic bounds checking'], ['A few register bits name the operand; access is as fast as the register file.', 'Vài bit thanh ghi gọi tên toán hạng; truy cập nhanh như tệp thanh ghi.']),
    q('c4', ['Displacement addressing computes EA = …', 'Định địa chỉ có độ dời tính EA = …'], ['A + (R)', 'A', '(A)', '(R) only'], ['The instruction holds a constant A, a register holds a base or index.', 'Lệnh chứa hằng A, thanh ghi chứa cơ sở hoặc chỉ số.']),
    q('c5', ['Which mode is best for walking through an array element by element?', 'Chế độ nào hợp để duyệt từng phần tử một mảng?'], ['Indexed (base + scaled index) or register indirect with auto-increment', 'Immediate', 'Direct', 'Implied'], ['The index register changes while the base stays the same.', 'Thanh ghi chỉ số thay đổi còn cơ sở giữ nguyên.']),
    q('c6', ['PC-relative addressing is mainly used for …', 'Định địa chỉ tương đối PC chủ yếu dùng cho …'], ['branches and position-independent code', 'large constants', 'stack operations only', 'I/O ports'], ['The target is encoded as an offset from the (next) instruction, so code can be moved.', 'Đích được mã hoá bằng độ lệch so với lệnh (kế tiếp) nên mã có thể dời chỗ.']),
  ],
  goiY: ['EA = where the operand is; operand = what is there.', 'Count the memory references including the instruction fetch.'],
  loiHayGap: ['Treating the instruction’s address field as the operand in indirect mode.', 'Confusing base and index registers.'],
  thuatNgu: [tn('effective address (EA)', 'địa chỉ hiệu dụng'), tn('displacement', 'độ dời')],
  khaiNiem: ['addressing modes'],
});

const MEM = { 100: 250, 150: 300, 200: 100, 250: 77, 300: 42, 308: 9, 504: 11, 512: 33 };
const REGS = { R1: 200, R2: 300, R3: 4 };
const PC = 500; // địa chỉ lệnh kế tiếp
const MODES = [
  ['Immediate  #100', () => ({ ea: '—', v: 100 })],
  ['Direct  100', () => ({ ea: 100, v: MEM[100] })],
  ['Indirect  (100)', () => ({ ea: MEM[100], v: MEM[MEM[100]] })],
  ['Register  R1', () => ({ ea: '—', v: REGS.R1 })],
  ['Register indirect  (R1)', () => ({ ea: REGS.R1, v: MEM[REGS.R1] })],
  ['Displacement  8(R2)', () => ({ ea: REGS.R2 + 8, v: MEM[REGS.R2 + 8] })],
  ['PC-relative  +12 (PC already points to the next instruction, 500)', () => ({ ea: PC + 12, v: MEM[PC + 12] })],
  ['Indexed  100(R3), scaled ×1', () => ({ ea: 100 + REGS.R3, v: MEM[100 + REGS.R3] })],
];
const E2 = tinh({
  tieuDe: 'Addressing 2 — Effective address and operand value',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>Machine state: memory <code>${Object.entries(MEM).map(([a, v]) => `M[${a}] = ${v}`).join(', ')}</code>; registers <code>${Object.entries(REGS).map(([r, v]) => `${r} = ${v}`).join(', ')}</code>; unlisted memory locations hold 0. For each operand specifier give the <b>effective address</b> (— if the operand is not in memory) and the <b>operand value</b>.  A location that is not listed contains 0.</p>`, `<p>Trạng thái máy: bộ nhớ <code>${Object.entries(MEM).map(([a, v]) => `M[${a}] = ${v}`).join(', ')}</code>; thanh ghi <code>${Object.entries(REGS).map(([r, v]) => `${r} = ${v}`).join(', ')}</code>; các ô nhớ không liệt kê chứa 0. Với mỗi toán hạng cho <b>địa chỉ hiệu dụng</b> (— nếu toán hạng không ở bộ nhớ) và <b>giá trị toán hạng</b>. Ô nhớ không được liệt kê chứa 0.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Effective addresses', 'Địa chỉ hiệu dụng'], [{ ma: 'm', ten: 'Mode' }, { ma: 'e', ten: 'EA' }, { ma: 'v', ten: 'Operand' }],
    MODES.map(([n, f]) => { const r = f(); return { o: { m: n }, a: { e: [String(r.ea), ...(r.ea === '—' ? ['-', 'none'] : [])], v: String(r.v ?? 0) } }; }),
    [MODES.map(([n, f]) => { const r = f(); return `${n.split('  ')[0]}: EA ${r.ea}, operand ${r.v ?? 0}`; }).join('; ') + '. Indexed 100(R3) = 104, which holds nothing (0).', MODES.map(([n, f]) => { const r = f(); return `${n.split('  ')[0]}: EA ${r.ea}, toán hạng ${r.v ?? 0}`; }).join('; ') + '.'])],
  goiY: ['Work out the EA first, then read memory at that address (unless the mode has no EA).', 'Indirect reads memory twice.'],
  loiHayGap: ['Giving the pointer value as the operand in indirect mode.', 'Adding the displacement to the memory content instead of to the register.'],
  thuatNgu: [tn('operand value', 'giá trị toán hạng')],
  khaiNiem: ['effective address'],
});

const REFS = [['Immediate', 1], ['Direct', 2], ['Indirect', 3], ['Register', 1], ['Register indirect', 2], ['Displacement', 2], ['Memory indirect through a register (double indirect, (R))', 3]];
const E3 = tinh({
  tieuDe: 'Addressing 3 — Memory references per mode',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>How many memory references does an instruction with one <b>source operand read</b> make in total, counting the instruction fetch?</p>', '<p>Một lệnh có một toán hạng nguồn cần <b>đọc</b> thực hiện tổng cộng bao nhiêu tham chiếu bộ nhớ, tính cả nạp lệnh?</p>'),
  loai: 'table',
  bang: [bang1('b1', ['References per mode', 'Số tham chiếu mỗi chế độ'], [{ ma: 'm', ten: 'Mode' }, { ma: 'n', ten: 'Memory references' }],
    REFS.map(([m, n]) => ({ o: { m }, a: { n: String(n) } })),
    ['Fetch 1 + operand: immediate 0, register 0, direct 1, register indirect 1, displacement 1, indirect 2, double indirect 2. Totals: ' + REFS.map(([, n]) => n).join(', ') + '.', 'Nạp lệnh 1 + toán hạng: tức thời 0, thanh ghi 0, trực tiếp 1, gián tiếp thanh ghi 1, độ dời 1, gián tiếp 2. Tổng: ' + REFS.map(([, n]) => n).join(', ') + '.'])],
  goiY: ['Start from 1 for the instruction itself.', 'A register is not memory.'],
  loiHayGap: ['Counting the register as a memory reference.', 'Forgetting the instruction fetch.'],
  thuatNgu: [tn('memory reference', 'tham chiếu bộ nhớ')],
  khaiNiem: ['addressing cost'],
});

const IX = [[1000, 0, 4, 0], [1000, 5, 4, 0], [2000, 7, 8, 16], [4096, 3, 2, 0], [0x8000, 255, 1, 4]];
const ea = ([b, i, s, d]) => b + i * s + d;
const E4 = tinh({
  tieuDe: 'Addressing 4 — Address of an array element',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Scaled-index addressing computes <code>EA = base + index × scale + displacement</code>. Give the decimal address of each element access.</p>', '<p>Định địa chỉ chỉ số có tỉ lệ tính <code>EA = cơ sở + chỉ số × tỉ lệ + độ dời</code>. Cho địa chỉ thập phân của mỗi lần truy cập phần tử.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Element addresses', 'Địa chỉ phần tử'], [{ ma: 'a', ten: 'base, index, scale, displacement' }, { ma: 'e', ten: 'EA' }],
    IX.map((x) => ({ o: { a: `base = ${x[0]}, index = ${x[1]}, scale = ${x[2]}, disp = ${x[3]}` }, a: { e: String(ea(x)) } })),
    [IX.map((x) => `${x[0]} + ${x[1]}×${x[2]} + ${x[3]} = ${ea(x)}`).join('; ') + '.', IX.map((x) => `${x[0]} + ${x[1]}×${x[2]} + ${x[3]} = ${ea(x)}`).join('; ') + '.'])],
  goiY: ['Multiply the index by the element size (scale) before adding.', 'Convert hex bases to decimal.'],
  loiHayGap: ['Adding the index without the scale.', 'Forgetting the displacement.'],
  thuatNgu: [tn('scale', 'hệ số tỉ lệ')],
  khaiNiem: ['indexed addressing'],
});

const effAddr = function effAddr(mode, operand, state) {
  var mem = state.mem, regs = state.regs, ea, v;
  var m = function (a) { return mem[a] === undefined ? 0 : mem[a]; };
  if (mode === 'IMM') return { ea: null, value: operand };
  if (mode === 'REG') return { ea: null, value: regs[operand] };
  if (mode === 'DIR') ea = operand;
  else if (mode === 'IND') ea = m(operand);
  else if (mode === 'REGIND') ea = regs[operand];
  else if (mode === 'DISP') ea = operand[0] + regs[operand[1]];
  else if (mode === 'PCREL') ea = state.pc + operand;
  else if (mode === 'INDEXED') ea = operand[0] + regs[operand[1]] * operand[2];
  v = m(ea);
  return { ea: ea, value: v };
};
const ST = { mem: MEM, regs: REGS, pc: PC };
const E5 = jsDe({
  tieuDe: 'Addressing 5 — Write the operand fetch unit',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>effAddr(mode, operand, state)</code> with <code>state = { mem, regs, pc }</code> (<code>mem</code>: object address → value, missing locations read as 0; <code>regs</code>: object name → value; <code>pc</code> = address of the NEXT instruction). Return <code>{ ea, value }</code> where <code>ea</code> is <code>null</code> when the operand is not in memory. Modes: <code>IMM</code> (operand = constant), <code>REG</code> (operand = register name), <code>DIR</code> (operand = address), <code>IND</code> (operand = address of a pointer), <code>REGIND</code> (operand = register name holding the address), <code>DISP</code> (operand = <code>[displacement, regName]</code>), <code>PCREL</code> (operand = offset), <code>INDEXED</code> (operand = <code>[base, regName, scale]</code>, EA = base + reg × scale).</p>', '<p>Viết <code>effAddr(mode, operand, state)</code> với <code>state = { mem, regs, pc }</code> (<code>mem</code>: đối tượng địa chỉ → giá trị, ô thiếu đọc ra 0; <code>regs</code>: tên → giá trị; <code>pc</code> = địa chỉ lệnh KẾ TIẾP). Trả <code>{ ea, value }</code> với <code>ea</code> là <code>null</code> khi toán hạng không ở bộ nhớ. Chế độ: <code>IMM</code> (toán hạng = hằng), <code>REG</code> (toán hạng = tên thanh ghi), <code>DIR</code> (toán hạng = địa chỉ), <code>IND</code> (toán hạng = địa chỉ ô con trỏ), <code>REGIND</code> (toán hạng = tên thanh ghi chứa địa chỉ), <code>DISP</code> (toán hạng = <code>[độ dời, tênThanhGhi]</code>), <code>PCREL</code> (toán hạng = độ lệch), <code>INDEXED</code> (toán hạng = <code>[cơ sở, tênThanhGhi, tỉ lệ]</code>, EA = cơ sở + thanh ghi × tỉ lệ).</p>'),
  viDu: [{ input: `effAddr("IND", 100, ${JSON.stringify(ST)})`, output: JSON.stringify(effAddr('IND', 100, ST)), explanation: 'M[100] = 250 is the real address; M[250] = 77.|||M[100] = 250 là địa chỉ thật; M[250] = 77.' }],
  goiY: ['Compute ea first in each branch, then read mem[ea] || 0 once.', 'IMM and REG have no effective address: return ea = null.', 'Zero is a valid value — do not test with ||0 on the address.'],
  loiHayGap: ['Reading the memory twice for direct mode.', 'Returning undefined instead of 0 for a missing location.'],
  giaiThich: '<p>All memory modes reduce to “compute an EA, then read once”; they differ only in how the EA is produced.</p>',
  khaiNiem: ['addressing modes', 'operand fetch'],
  fn: 'effAddr',
  dau: 'function effAddr(mode, operand, state) {\n  return { ea: null, value: 0 };\n}\n',
  giaiMa: dat(effAddr, 'effAddr'),
  ref: effAddr,
  cases: [{ args: ['IMM', 7, ST] }, { args: ['DIR', 100, ST] }, { args: ['IND', 100, ST] }, { args: ['DISP', [8, 'R2'], ST] }, { args: ['REGIND', 'R1', ST], an: true }, { args: ['PCREL', 12, ST], an: true }, { args: ['INDEXED', [100, 'R3', 2], ST], an: true }, { args: ['REG', 'R2', ST], an: true }, { args: ['DIR', 999, ST], an: true }],
});

export default doiDau({
  slug: 'cea201-11-1-addressing-modes',
  ten: '11.1 Addressing modes',
  khoa: KHOA,
  baiHoc: 'cea201-11-1-addressing-modes',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc; void tab;
