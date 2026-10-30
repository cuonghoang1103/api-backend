/** CEA201 · 12.1 — Processor organisation, registers and the instruction cycle. */
import { doiDau, KHOA, bi, hai, giai, tinh, mc, q, tn, bang1, ord, r2, code } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Processor 1 — Registers, ALU, control unit and the PSW',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on processor organisation.</p>', '<p>Câu hỏi khái niệm về tổ chức bộ xử lý.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which registers can the programmer name directly in instructions?', 'Thanh ghi nào lập trình viên gọi tên trực tiếp được trong lệnh?'], ['User-visible registers (general purpose, data, address, condition codes)', 'MAR and MBR', 'IR', 'The internal ALU latches'], ['MAR, MBR, IR and PC-update logic are control/status registers hidden from the programmer (the PC is visible indirectly).', 'MAR, MBR, IR là thanh ghi điều khiển ẩn với lập trình viên.']),
    q('c2', ['The program status word (PSW) typically holds …', 'Từ trạng thái chương trình (PSW) thường chứa …'], ['condition codes, interrupt enable and mode bits', 'the program text', 'the stack contents', 'the cache tags'], ['Flags such as zero, sign, carry, overflow and the supervisor/user mode.', 'Các cờ như zero, dấu, nhớ, tràn và chế độ giám sát/người dùng.']),
    q('c3', ['The control unit …', 'Đơn vị điều khiển …'], ['generates the control signals that sequence the micro-operations', 'performs arithmetic', 'stores the program', 'holds the registers only'], ['It decodes the opcode and activates the right data paths.', 'Nó giải mã opcode và kích hoạt đường dữ liệu phù hợp.']),
    q('c4', ['In a load/store (RISC-style) machine, arithmetic instructions operate on …', 'Trong máy load/store (kiểu RISC), lệnh số học thao tác trên …'], ['registers only; only load and store touch memory', 'memory operands only', 'immediate operands only', 'the stack only'], ['This keeps instructions simple and pipeline-friendly.', 'Giữ lệnh đơn giản và hợp với pipeline.']),
    q('c5', ['An instruction cycle with indirect addressing consists of …', 'Chu trình lệnh có định địa chỉ gián tiếp gồm …'], ['fetch, indirect, execute (and interrupt)', 'only execute', 'only fetch and interrupt', 'indirect only'], ['The indirect cycle reads the pointer before the operand.', 'Chu kỳ gián tiếp đọc con trỏ trước khi đọc toán hạng.']),
  ],
  goiY: ['Hidden registers support the cycle; visible ones hold program data.', 'The control unit does not compute data.'],
  loiHayGap: ['Confusing the PSW with the PC.', 'Thinking the programmer can load the IR.'],
  thuatNgu: [tn('PSW', 'từ trạng thái chương trình'), tn('control unit', 'đơn vị điều khiển')],
  khaiNiem: ['processor organisation', 'registers'],
});

// Máy kiểu Stallings (Fig 3.5): lệnh 16 bit = 4 bit opcode + 12 bit địa chỉ; 1 = LOAD AC, 5 = ADD, 2 = STORE
const MEM = { 0x300: 0x1940, 0x301: 0x5941, 0x302: 0x2941, 0x940: 3, 0x941: 2 };
const sim = () => { const m = { ...MEM }; let pc = 0x300, ac = 0, rows = []; for (let k = 0; k < 3; k++) { const ir = m[pc]; pc++; rows.push({ s: `fetch #${k + 1}`, pc, ir, ac }); const op = ir >> 12, ad = ir & 0xFFF; if (op === 1) ac = m[ad]; else if (op === 5) ac += m[ad]; else if (op === 2) m[ad] = ac; rows.push({ s: `execute #${k + 1}`, pc, ir, ac, mem: op === 2 ? `M[${ad.toString(16)}]=${m[ad].toString(16).padStart(4, '0')}` : '' }); } return rows; };
const H = (n) => n.toString(16).toUpperCase().padStart(4, '0');
const tr = sim();
const E2 = tinh({
  tieuDe: 'Processor 2 — Fetch and execute three instructions (hex)',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>A 16-bit machine has a 4-bit opcode (1 = LOAD AC from memory, 5 = ADD memory to AC, 2 = STORE AC to memory) and a 12-bit address. Initial state: <code>PC = 300</code>, <code>AC = 0000</code>; memory <code>[300] = 1940, [301] = 5941, [302] = 2941, [940] = 0003, [941] = 0002</code> (all hex). Give <b>PC</b>, <b>IR</b> and <b>AC</b> (4 hex digits for IR and AC, 3 for PC) after each fetch and execute step.</p>`, `<p>Máy 16 bit có opcode 4 bit (1 = LOAD AC từ bộ nhớ, 5 = ADD bộ nhớ vào AC, 2 = STORE AC vào bộ nhớ) và địa chỉ 12 bit. Trạng thái đầu: <code>PC = 300</code>, <code>AC = 0000</code>; bộ nhớ <code>[300] = 1940, [301] = 5941, [302] = 2941, [940] = 0003, [941] = 0002</code> (hex). Cho <b>PC</b>, <b>IR</b> và <b>AC</b> (IR và AC 4 chữ số hex, PC 3 chữ số) sau mỗi bước nạp và thực hiện.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Fetch and execute trace', 'Vết nạp và thực hiện'], [{ ma: 's', ten: 'Step' }, { ma: 'p', ten: 'PC' }, { ma: 'i', ten: 'IR' }, { ma: 'a', ten: 'AC' }],
    tr.map((r) => ({ o: { s: r.s }, a: { p: [r.pc.toString(16).toUpperCase().padStart(3, '0'), r.pc.toString(16).toUpperCase()], i: [H(r.ir)], a: [H(r.ac)] } })),
    ['Fetch: IR ← M[PC], PC ← PC + 1. Execute: LOAD gives AC = 0003; ADD gives 0003 + 0002 = 0005; STORE writes 0005 into [941] (AC unchanged).', 'Nạp: IR ← M[PC], PC ← PC + 1. Thực hiện: LOAD cho AC = 0003; ADD cho 0003 + 0002 = 0005; STORE ghi 0005 vào [941] (AC không đổi).'])],
  goiY: ['Opcode = top hex digit, address = lower three hex digits.', 'The fetch increments the PC before the execute step.'],
  loiHayGap: ['Incrementing the PC after the execute step.', 'Changing the AC during a STORE.'],
  thuatNgu: [tn('IR', 'thanh ghi lệnh')],
  khaiNiem: ['instruction fetch', 'instruction execute'],
});

const E3 = tinh({
  tieuDe: 'Processor 3 — Order the micro-operations of an indirect load',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>The instruction <code>LOAD (X)</code> (indirect) has just been fetched into the IR. Put the micro-operations in the right order, starting from the beginning of the fetch.</p>', '<p>Lệnh <code>LOAD (X)</code> (gián tiếp) vừa được nạp vào IR. Sắp các vi thao tác theo đúng thứ tự, bắt đầu từ đầu pha nạp.</p>'),
  loai: 'order',
  cauHoi: [ord('q1', ['Fetch, indirect and execute cycles', 'Chu kỳ nạp, gián tiếp và thực hiện'], ['MAR ← PC', 'MBR ← M[MAR]; PC ← PC + 1', 'IR ← MBR', 'MAR ← IR(address)', 'MBR ← M[MAR] (this is the pointer)', 'MAR ← MBR', 'MBR ← M[MAR] (this is the data)', 'AC ← MBR'], ['Two memory reads after the fetch: one for the pointer (indirect cycle) and one for the data (execute cycle).', 'Sau nạp lệnh có hai lần đọc bộ nhớ: một cho con trỏ (chu kỳ gián tiếp) và một cho dữ liệu (chu kỳ thực hiện).'], 3)],
  goiY: ['Every memory read is MAR ← address then MBR ← M[MAR].', 'The pointer read comes before the data read.'],
  loiHayGap: ['Reading the data directly from the instruction’s address field.', 'Loading the AC before the data have arrived in the MBR.'],
  thuatNgu: [tn('micro-operation', 'vi thao tác')],
  khaiNiem: ['indirect cycle', 'micro-operations'],
});

const MX = [['R-type (ALU)', 0.45, 4], ['Load', 0.25, 5], ['Store', 0.10, 4], ['Branch', 0.20, 3]];
const SC = 10;
const cpi = MX.reduce((s, [, f, c]) => s + f * c, 0);
const E4 = tinh({
  tieuDe: 'Processor 4 — Multicycle versus single-cycle execution time',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A multicycle processor needs 4 cycles for R-type (45 %), 5 for loads (25 %), 4 for stores (10 %) and 3 for branches (20 %), with a 2 ns clock. A single-cycle design executes every instruction in one cycle of 10 ns (the slowest instruction, a load, needs five 2 ns steps). For 10⁹ instructions give the <b>average CPI</b> of the multicycle design (2 decimals), the execution times of both designs (seconds, 2 decimals) and the speedup of the better design over the other (2 decimals).</p>', '<p>Bộ xử lý nhiều chu kỳ cần 4 chu kỳ cho R-type (45 %), 5 cho load (25 %), 4 cho store (10 %) và 3 cho rẽ nhánh (20 %), clock 2 ns. Thiết kế một chu kỳ thực hiện mọi lệnh trong một chu kỳ 10 ns (lệnh chậm nhất, load, cần năm bước 2 ns). Với 10⁹ lệnh cho <b>CPI trung bình</b> của thiết kế nhiều chu kỳ (2 chữ số), thời gian thực hiện của cả hai (giây, 2 chữ số) và hệ số nhanh hơn của thiết kế tốt hơn (2 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Execution time', 'Thời gian thực hiện'], [{ ma: 'd', ten: 'Design' }, { ma: 'c', ten: 'CPI' }, { ma: 't', ten: 'Time (s)' }],
    [{ o: { d: 'Multicycle (2 ns clock)' }, a: { c: r2(cpi, 2), t: r2(1e9 * cpi * 2e-9, 2) } }, { o: { d: 'Single-cycle (10 ns clock)' }, a: { c: ['1', '1.00'], t: r2(1e9 * SC * 1e-9, 2) } }],
    [`Multicycle CPI = ${MX.map(([, f, c]) => `${f}×${c}`).join(' + ')} = ${cpi.toFixed(2)}; time = 10⁹ × ${cpi.toFixed(2)} × 2 ns = ${(1e9 * cpi * 2e-9).toFixed(2)} s; single-cycle: 10⁹ × 10 ns = 10.00 s. Speedup ${(SC / (cpi * 2)).toFixed(2)}.`, `CPI nhiều chu kỳ = ${cpi.toFixed(2)}; thời gian = ${(1e9 * cpi * 2e-9).toFixed(2)} s; một chu kỳ: 10,00 s. Nhanh hơn ${(SC / (cpi * 2)).toFixed(2)} lần.`]),
  bang1('b2', ['Speedup', 'Hệ số nhanh hơn'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }], [{ o: { k: 'T(single) / T(multi)' }, a: { v: r2(SC / (cpi * 2), 2) } }], [`10.00 / ${(1e9 * cpi * 2e-9).toFixed(2)} = ${(SC / (cpi * 2)).toFixed(2)}: the multicycle design wins because simple instructions no longer pay for the slowest one.`, `10,00 / ${(1e9 * cpi * 2e-9).toFixed(2)} = ${(SC / (cpi * 2)).toFixed(2)}: thiết kế nhiều chu kỳ thắng vì lệnh đơn giản không phải trả giá cho lệnh chậm nhất.`])],
  goiY: ['CPI = Σ fraction × cycles. Time = IC × CPI × clock period.', 'Single-cycle has CPI = 1 but a long period.'],
  loiHayGap: ['Forgetting that the single-cycle clock must fit the slowest instruction.', 'Multiplying by the clock rate instead of the period.'],
  thuatNgu: [tn('multicycle', 'nhiều chu kỳ')],
  khaiNiem: ['CPI', 'multicycle datapath'],
});

export default doiDau({
  slug: 'cea201-12-1-registers-cycle',
  ten: '12.1 Processor organisation & registers',
  khoa: KHOA,
  baiHoc: 'cea201-12-1-registers-cycle',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc; void code;
