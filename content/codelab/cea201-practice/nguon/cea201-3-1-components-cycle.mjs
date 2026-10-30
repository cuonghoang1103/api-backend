/** CEA201 · 3.1 — Components & the instruction cycle (fetch / execute / interrupt). */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, ord, r2, tab, code, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Cycle 1 — PC, MAR, MBR, IR: what does each register do?',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions about the registers that drive the fetch–execute cycle.</p>', '<p>Năm câu về các thanh ghi điều khiển chu trình nạp–thực hiện.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which register holds the address of the NEXT instruction to fetch?', 'Thanh ghi nào giữ địa chỉ của lệnh SẮP được nạp?'], ['PC (program counter)', 'IR (instruction register)', 'MBR (memory buffer register)', 'AC (accumulator)'], ['The PC points to the next instruction; the IR holds the instruction being executed.', 'PC trỏ tới lệnh kế tiếp; IR giữ lệnh đang thực hiện.']),
    q('c2', ['During a memory read, the word that comes back from memory is first placed in …', 'Khi đọc bộ nhớ, từ đọc về trước hết được đặt vào …'], ['MBR (memory buffer register)', 'MAR (memory address register)', 'PC', 'The address bus'], ['MAR holds the address going out; MBR holds the data coming in or going out.', 'MAR giữ địa chỉ gửi đi; MBR giữ dữ liệu vào/ra.']),
    q('c3', ['In the fetch phase, what happens to the PC (no jump)?', 'Ở pha nạp lệnh, PC thay đổi thế nào (không có nhảy)?'], ['It is incremented to point to the next instruction', 'It is loaded with the operand address', 'It is cleared', 'It is copied into the MBR and left unchanged forever'], ['The control unit increments the PC after (or while) the instruction is fetched.', 'Đơn vị điều khiển tăng PC khi/ sau khi nạp lệnh.']),
    q('c4', ['A “stored-program” (von Neumann) computer keeps …', 'Máy “chương trình lưu trong bộ nhớ” (von Neumann) lưu …'], ['instructions and data in the same memory', 'instructions in the CPU and data in memory', 'only data in memory; instructions are wired', 'programs on the keyboard buffer'], ['The same memory holds both, so a program can be loaded, changed and treated as data.', 'Cùng một bộ nhớ chứa cả hai nên chương trình có thể được nạp, sửa và xem như dữ liệu.']),
    q('c5', ['The four basic actions of an instruction are …', 'Bốn loại tác vụ cơ bản của một lệnh là …'], ['processor–memory, processor–I/O, data processing, control', 'fetch, decode, encode, store', 'read, write, copy, delete', 'compile, link, load, run'], ['Stallings groups instruction effects into these four categories.', 'Stallings nhóm tác dụng lệnh thành bốn loại này.']),
  ],
  goiY: ['MAR = “where”, MBR = “what”.', 'PC always points at the NEXT instruction while the current one executes.'],
  loiHayGap: ['Thinking the IR holds the address of the next instruction.', 'Confusing MAR with MBR (address versus data).'],
  thuatNgu: [tn('MAR / MBR', 'thanh ghi địa chỉ / đệm bộ nhớ'), tn('stored-program computer', 'máy chương trình lưu trong bộ nhớ')],
  khaiNiem: ['PC', 'MAR', 'MBR', 'IR'],
});

const FETCH = ['MAR ← PC (the address of the next instruction goes on the address bus)', 'The control unit issues a memory READ', 'Memory puts the instruction word into the MBR', 'IR ← MBR (the instruction is latched)', 'PC ← PC + 1 (point to the next instruction)', 'Decode the opcode in the IR and execute'];
const INT = ['The processor finishes the current instruction (execute phase)', 'The processor checks for a pending interrupt', 'It saves the PC (and PSW) of the interrupted program', 'PC ← starting address of the interrupt handler', 'The handler runs and services the device', 'The saved PC is restored and the original program resumes'];
const E2 = tinh({
  tieuDe: 'Cycle 2 — Order the fetch phase and the interrupt cycle',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Arrange each list in the correct order.</p>', '<p>Sắp xếp mỗi danh sách theo đúng thứ tự.</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Order the steps of fetching and starting one instruction.', 'Sắp thứ tự các bước nạp và bắt đầu một lệnh.'], FETCH, ['The address leaves through MAR, the word returns through MBR, then IR; the PC increment is part of the fetch.', 'Địa chỉ đi ra qua MAR, từ lệnh về qua MBR rồi vào IR; tăng PC thuộc pha nạp.'], 2),
    ord('q2', ['Order the steps of the interrupt cycle.', 'Sắp thứ tự các bước của chu trình ngắt.'], INT, ['Interrupts are checked at the END of an instruction, never in the middle.', 'Ngắt được kiểm tra ở CUỐI lệnh, không bao giờ giữa chừng.'], 3),
  ],
  goiY: ['Data comes back through the MBR; the IR is loaded from the MBR.', 'Interrupts are recognized only between instructions.'],
  loiHayGap: ['Loading the IR directly from the PC.', 'Restoring the saved PC before the handler has run.'],
  thuatNgu: [tn('interrupt handler', 'trình xử lý ngắt'), tn('PSW', 'từ trạng thái chương trình')],
  khaiNiem: ['fetch phase', 'interrupt cycle'],
});

const PROG = `ORG 100
Load A
Add B
Subt C
Store D
Halt
A, Dec 12
B, Dec 30
C, Dec 7
D, Dec 0`;
const trc = S.marieRun(PROG).trace;
const E3 = tinh({
  tieuDe: 'Cycle 3 — Trace a tiny program: the AC after every instruction',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>A MARIE-style machine runs the program below (memory locations A, B, C, D hold the decimal values shown). Fill in the <b>AC</b> after each instruction and the <b>PC</b> the processor will fetch from next (hexadecimal).</p>${code(PROG)}`, `<p>Một máy kiểu MARIE chạy chương trình dưới đây (ô A, B, C, D chứa giá trị thập phân như trên). Điền <b>AC</b> sau mỗi lệnh và <b>PC</b> của lần nạp kế tiếp (hệ 16).</p>${code(PROG)}`),
  loai: 'table',
  bang: [bang1('b1', ['Execution trace', 'Vết thực hiện'], [{ ma: 'i', ten: 'Instruction' }, { ma: 'a', ten: 'AC after' }, { ma: 'n', ten: 'Next PC (hex)' }],
    trc.map((t) => ({ o: { i: `${t.pc.toString(16).toUpperCase()}: ${t.op}${t.op === 'Halt' ? '' : ' ' + ['A', 'B', 'C', 'D'][t.arg - 0x105] }` }, a: { a: [String(t.ac)], n: [t.next.toString(16).toUpperCase()] } })),
    ['AC: 12 → 12+30 = 42 → 42−7 = 35 → Store keeps 35; Halt leaves everything unchanged. The PC just counts 101, 102, … because there is no jump.', 'AC: 12 → 12+30 = 42 → 42−7 = 35 → Store giữ nguyên 35; Halt không đổi gì. PC chỉ đếm 101, 102, … vì không có nhảy.'])],
  goiY: ['Load replaces the AC; Add and Subt combine the AC with memory.', 'Store copies the AC into memory and does not change the AC.'],
  loiHayGap: ['Treating Store as if it cleared the AC.', 'Forgetting that the PC already points to the next instruction while the current one executes.'],
  thuatNgu: [tn('accumulator (AC)', 'thanh ghi tích luỹ')],
  khaiNiem: ['instruction trace'],
});

const IA = [['Direct add: ADD X (operand in memory)', 1 + 1], ['Indirect add: ADD (X) (address of the operand in memory)', 1 + 2], ['Store: STORE X', 1 + 1], ['Register-only: ADD R1, R2', 1], ['Indirect store: STORE (X)', 1 + 2]];
const E4 = tinh({
  tieuDe: 'Cycle 4 — How many memory accesses does an instruction need?',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Count the memory accesses during one complete instruction cycle (the instruction fetch counts as one; a direct operand read or write is one; an indirect operand needs one extra access to get the address).</p>', '<p>Đếm số lần truy cập bộ nhớ trong một chu trình lệnh đầy đủ (nạp lệnh tính 1; đọc/ghi toán hạng trực tiếp tính 1; toán hạng gián tiếp cần thêm 1 lần để lấy địa chỉ).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Memory accesses per instruction', 'Số lần truy cập bộ nhớ mỗi lệnh'], [{ ma: 'i', ten: 'Instruction' }, { ma: 'n', ten: 'Memory accesses' }],
    IA.map(([n, v]) => ({ o: { i: n }, a: { n: String(v) } })),
    ['Fetch (1) + operand: direct 1, indirect 2, none 0. Totals: ' + IA.map(([, v]) => v).join(', ') + '.', 'Nạp lệnh (1) + toán hạng: trực tiếp 1, gián tiếp 2, không có 0. Tổng: ' + IA.map(([, v]) => v).join(', ') + '.'])],
  goiY: ['Always start from 1 for the instruction fetch.', 'Indirect addressing reads the pointer first, then the data.'],
  loiHayGap: ['Forgetting the instruction fetch.', 'Counting an operand access for a register-only instruction.'],
  thuatNgu: [tn('indirect addressing', 'định địa chỉ gián tiếp')],
  khaiNiem: ['instruction cycle', 'memory accesses'],
});

const isrStarts = function isrStarts(lengths, raises, isrCost) {
  // lengths[i] = cycles of instruction i; raises = sorted interrupt arrival times; one interrupt is served after each instruction
  var t = 0, next = 0, starts = [];
  for (var i = 0; i < lengths.length; i++) {
    t += lengths[i];
    while (next < raises.length && raises[next] <= t) {
      starts.push(t);
      t += isrCost;
      next++;
    }
  }
  return { starts: starts, finish: t };
};
const E5 = jsDe({
  tieuDe: 'Cycle 5 — Simulate when interrupts are really serviced',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>The processor runs <code>lengths.length</code> instructions; instruction <code>i</code> takes <code>lengths[i]</code> cycles. Interrupts arrive at the cycle numbers in <code>raises</code> (sorted). An interrupt is recognized only <b>at the end of an instruction</b> — if one or more have arrived (time ≤ current time) the processor runs a handler of <code>isrCost</code> cycles for each, in arrival order, before fetching the next instruction.</p><p>Write <code>isrStarts(lengths, raises, isrCost)</code> returning <code>{ starts, finish }</code>: <code>starts</code> is the cycle at which each handler begins, <code>finish</code> the cycle when the last instruction (or handler) ends. Time starts at 0.</p>', '<p>Bộ xử lý chạy <code>lengths.length</code> lệnh; lệnh <code>i</code> mất <code>lengths[i]</code> chu kỳ. Ngắt đến ở các chu kỳ trong <code>raises</code> (đã sắp). Ngắt chỉ được nhận <b>ở cuối một lệnh</b> — nếu đã có ngắt đến (thời điểm ≤ hiện tại) thì bộ xử lý chạy trình xử lý <code>isrCost</code> chu kỳ cho từng ngắt, theo thứ tự đến, trước khi nạp lệnh kế.</p><p>Viết <code>isrStarts(lengths, raises, isrCost)</code> trả <code>{ starts, finish }</code>: <code>starts</code> là chu kỳ bắt đầu mỗi trình xử lý, <code>finish</code> là chu kỳ kết thúc lệnh/trình xử lý cuối. Thời gian bắt đầu từ 0.</p>'),
  yeuCau: [bi('Interrupts that arrive after the last instruction are not served.', 'Ngắt đến sau lệnh cuối không được phục vụ.'), bi('Handlers are not interrupted.', 'Trình xử lý không bị ngắt.')],
  viDu: [{ input: 'isrStarts([4, 6, 5], [3, 12], 2)', output: JSON.stringify(isrStarts([4, 6, 5], [3, 12], 2)), explanation: 'The interrupt of cycle 3 waits until instruction 0 ends at cycle 4 (handler 4–6); the one of cycle 12 is served when instruction 1 ends at 12; the program ends at 19.|||Ngắt ở chu kỳ 3 chờ lệnh 0 xong ở chu kỳ 4 (xử lý 4–6); ngắt ở 12 được phục vụ khi lệnh 1 xong ở 12; chương trình kết thúc ở 19.' }],
  goiY: ['Keep a clock t. After each instruction: t += length; then loop while an interrupt has already arrived.', 'Record t as a handler start, then add isrCost to t. Use an index into raises.', 'Do not look at interrupts before the end of an instruction.'],
  loiHayGap: ['Serving an interrupt in the middle of an instruction.', 'Forgetting that several interrupts can be pending at the same time.'],
  giaiThich: '<p>The processor checks for interrupts only at instruction boundaries; pending interrupts are served in order, each adding isrCost to the timeline.</p>',
  khaiNiem: ['interrupt cycle', 'instruction boundary'],
  fn: 'isrStarts',
  dau: 'function isrStarts(lengths, raises, isrCost) {\n  return { starts: [], finish: 0 };\n}\n',
  giaiMa: dat(isrStarts, 'isrStarts'),
  ref: isrStarts,
  cases: [{ args: [[4, 6, 5], [3, 12], 2] }, { args: [[3, 3, 3, 3], [1, 2, 3], 5] }, { args: [[10], [20], 4] }, { args: [[5, 5, 5], [], 3] }, { args: [[2, 8, 4, 6], [0, 9, 9, 30], 3], an: true }, { args: [[7, 7], [7, 7], 1], an: true }, { args: [[1, 1, 1, 1, 1], [1, 3, 4], 2], an: true }],
});

export default doiDau({
  slug: 'cea201-3-1-components-cycle',
  ten: '3.1 Components & the instruction cycle',
  khoa: KHOA,
  baiHoc: 'cea201-3-1-components-cycle',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc; void r2; void tab;
