/** CEA201 · 13.1 — RISC vs CISC; register windows. */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'RISC 1 — RISC versus CISC characteristics',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on RISC and CISC.</p>', '<p>Câu hỏi khái niệm về RISC và CISC.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which is a typical RISC characteristic?', 'Đặc trưng nào là điển hình của RISC?'], ['Fixed-length instructions and a load/store architecture', 'Many complex addressing modes in each instruction', 'Variable-length instructions with a compact encoding', 'Microcoded complex instructions for common tasks'], ['Simple, regular instructions are easy to decode and pipeline.', 'Lệnh đơn giản, đều đặn dễ giải mã và pipeline.']),
    q('c2', ['A typical CISC trait is …', 'Một đặc điểm điển hình của CISC là …'], ['variable-length instructions with direct memory operands', 'a large uniform register file, with memory reached by load and store only', 'single-cycle execution of every instruction, thanks to a fixed format', 'hardwired control only, with no microcode and a simple decoder'], ['It aims for compact code and a rich instruction set.', 'Nhắm tới mã gọn và tập lệnh phong phú.']),
    q('c3', ['Why do RISC machines have large register files?', 'Vì sao máy RISC có tệp thanh ghi lớn?'], ['Most operands are kept in registers, avoiding slow memory accesses', 'Registers are cheaper than ALUs, so more of them lower the cost of the chip', 'Registers replace the cache, so that memory is touched only at start-up', 'Long instructions have room for many register numbers, so more must exist'], ['Procedure calls and local variables benefit from registers (windows).', 'Gọi thủ tục và biến cục bộ hưởng lợi từ thanh ghi (cửa sổ).']),
    q('c4', ['Compared with the CISC version of a program, the RISC version usually executes …', 'So với bản CISC của một chương trình, bản RISC thường thực hiện …'], ['more instructions, each simpler and faster', 'fewer instructions, each more complex', 'exactly the same instructions', 'fewer instructions, each slower'], ['A larger IC is offset by a lower CPI and a faster clock.', 'IC lớn hơn được bù bằng CPI thấp hơn và clock nhanh hơn.']),
    q('c5', ['Modern x86 processors …', 'Các bộ xử lý x86 hiện đại …'], ['translate CISC instructions into RISC-like micro-operations internally', 'are pure RISC machines whose visible instruction set is also RISC', 'have no pipeline, because variable-length instructions cannot overlap', 'have dropped complex instructions, so old programs must be recompiled'], ['The front end decodes x86 into µops executed by a RISC-style core.', 'Phần trước giải mã x86 thành µop chạy trên lõi kiểu RISC.']),
  ],
  goiY: ['RISC = simple + regular + registers; CISC = rich + compact.', 'The performance equation tells which trade-off wins.'],
  loiHayGap: ['Assuming RISC always produces smaller programs.', 'Thinking modern x86 is purely CISC inside.'],
  thuatNgu: [tn('load/store architecture', 'kiến trúc nạp/lưu'), tn('micro-operation', 'vi thao tác')],
  khaiNiem: ['RISC', 'CISC'],
});

const PM = [[4.0, 2.0, 1.4, 1.3, 2.0], [3.5, 2.0, 1.5, 1.2, 2.0], [3.0, 2.0, 2.4, 2.0, 2.0]];
const tm = (ic, cpi, f) => ic * cpi / (f * 1e9);
const E2 = tinh({
  tieuDe: 'RISC 2 — Who wins: fewer complex instructions or more simple ones?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A CISC program executes 10⁹ instructions. The RISC version executes <i>ratio</i> × 10⁹. Compute the CPU time of each (seconds, 3 decimals) and the speedup of the faster over the slower (2 decimals). Columns are: CISC CPI · CISC clock (GHz) · RISC IC ratio · RISC CPI · RISC clock (GHz).</p>', '<p>Chương trình CISC thực hiện 10⁹ lệnh. Bản RISC thực hiện <i>tỉ lệ</i> × 10⁹. Tính thời gian CPU mỗi bản (giây, 3 chữ số) và hệ số nhanh hơn của bản nhanh so với bản chậm (2 chữ số). Các cột: CPI CISC · clock CISC (GHz) · tỉ lệ IC RISC · CPI RISC · clock RISC (GHz).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['CISC versus RISC', 'CISC so với RISC'], [{ ma: 'p', ten: 'CISC CPI, GHz; RISC ratio, CPI, GHz' }, { ma: 'c', ten: 'T CISC (s)' }, { ma: 'r', ten: 'T RISC (s)' }, { ma: 's', ten: 'Speedup of faster' }],
    PM.map(([cc, cf, ir, rc, rf]) => { const tc = tm(1e9, cc, cf); const T2 = tm(1e9 * ir, rc, rf); return { o: { p: `CISC CPI = ${cc}, ${cf} GHz; RISC ×${ir}, CPI = ${rc}, ${rf} GHz` }, a: { c: r2(tc, 3), r: r2(T2, 3), s: r2(Math.max(tc, T2) / Math.min(tc, T2), 2) } }; }),
    ['T = IC × CPI / f. ' + PM.map(([cc, cf, ir, rc, rf]) => `CISC ${tm(1e9, cc, cf).toFixed(3)} s vs RISC ${tm(1e9 * ir, rc, rf).toFixed(3)} s`).join('; ') + '. In rows 1–2 the RISC program executes 40–50 % more instructions but its CPI is about 3× lower, so it wins; in row 3 it needs 2.4× the instructions while its CPI is only 1.5× lower, so CISC wins — compute, do not assume.', 'T = IC × CPI / f. ' + PM.map(([cc, cf, ir, rc, rf]) => `CISC ${tm(1e9, cc, cf).toFixed(3)} s so với RISC ${tm(1e9 * ir, rc, rf).toFixed(3)} s`).join('; ') + '. Ở dòng 1–2 bản RISC chạy nhiều hơn 40–50 % lệnh nhưng CPI thấp hơn khoảng 3 lần nên thắng; ở dòng 3 nó cần gấp 2,4 lần số lệnh trong khi CPI chỉ thấp hơn 1,5 lần nên CISC thắng — hãy tính, đừng đoán.'])],
  goiY: ['Apply T = IC × CPI / f to each design.', 'Speedup = slower / faster.'],
  loiHayGap: ['Comparing CPI only.', 'Forgetting that the RISC program has more instructions.'],
  thuatNgu: [tn('IC ratio', 'tỉ lệ số lệnh')],
  khaiNiem: ['RISC vs CISC performance'],
});

const WN = [[8, 8], [8, 16], [10, 4]]; // globals, windows
const RW = [[8, 4, 3], [8, 8, 10], [8, 8, 7], [8, 16, 20]];
const E3 = tinh({
  tieuDe: 'RISC 3 — Register windows: how many registers?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A SPARC-like machine has <b>G</b> global registers and <b>W</b> register windows. Each window has 8 <i>in</i>, 8 <i>local</i> and 8 <i>out</i> registers, and the <i>out</i> registers of one window are the <i>in</i> registers of the next (they overlap), so every additional window adds 16 physical registers. Give the total number of physical registers G + 16·W, the number of registers visible to a procedure (G + 24) and the number of overflow traps for a chain of <b>D</b> nested calls made before any return. The program starts in window 1, so the first W − 1 calls still fit: overflows = max(0, D − W + 1).</p>', '<p>Một máy kiểu SPARC có <b>G</b> thanh ghi toàn cục và <b>W</b> cửa sổ thanh ghi. Mỗi cửa sổ có 8 thanh ghi <i>in</i>, 8 <i>local</i> và 8 <i>out</i>, và các thanh ghi <i>out</i> của cửa sổ này là <i>in</i> của cửa sổ kế (chồng lên nhau), nên mỗi cửa sổ thêm 16 thanh ghi vật lý. Cho tổng số thanh ghi vật lý G + 16·W, số thanh ghi một thủ tục nhìn thấy (G + 24) và số bẫy tràn với chuỗi <b>D</b> lời gọi lồng nhau chưa trả về. Chương trình bắt đầu ở cửa sổ 1 nên W − 1 lời gọi đầu vẫn vừa: số bẫy tràn = max(0, D − W + 1).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Register windows', 'Cửa sổ thanh ghi'], [{ ma: 'p', ten: 'G, W, D' }, { ma: 't', ten: 'Physical registers' }, { ma: 'v', ten: 'Visible' }, { ma: 'o', ten: 'Overflows' }],
    RW.map(([G, W, D]) => ({ o: { p: `G = ${G}, W = ${W}, D = ${D}` }, a: { t: String(G + 16 * W), v: String(G + 24), o: String(Math.max(0, D - W + 1)) } })),
    [RW.map(([G, W, D]) => `G=${G}, W=${W}, D=${D}: ${G + 16 * W} physical, ${G + 24} visible, ${Math.max(0, D - W + 1)} overflows`).join('; ') + '. Shallow call chains never touch memory.', RW.map(([G, W, D]) => `G=${G}, W=${W}, D=${D}: ${G + 16 * W} vật lý, ${G + 24} thấy được, ${Math.max(0, D - W + 1)} tràn`).join('; ') + '. Chuỗi gọi nông không chạm bộ nhớ.'])],
  goiY: ['Each new window adds 16 registers because 8 are shared with the neighbour.', 'Overflow only occurs when the call depth exceeds the windows available.'],
  loiHayGap: ['Adding 24 per window (ignoring the overlap).', 'Counting the globals as part of every window.'],
  thuatNgu: [tn('register window', 'cửa sổ thanh ghi')],
  khaiNiem: ['register windows'],
});

const windowTraps = function windowTraps(events, W) {
  var depth = 1, resident = 1, over = 0, under = 0;
  for (var i = 0; i < events.length; i++) {
    if (events[i] === 'C') {
      depth++;
      if (resident === W) over++; else resident++;
    } else if (depth > 1) {
      depth--;
      if (resident > 1) resident--; else under++;
    }
  }
  return { overflows: over, underflows: under, depth: depth };
};
const EV = 'CCCCCCRRRRRRCCCRRR'.split('');
const E4 = jsDe({
  tieuDe: 'RISC 4 — Simulate window overflow and underflow traps',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>The CPU holds up to <code>W</code> register windows. The program starts running in 1 window (depth 1). A call <code>"C"</code> makes the callee’s window the current one: if all <code>W</code> windows are already resident, the oldest is spilled to memory (<b>overflow trap</b>), otherwise a new window becomes resident. A return <code>"R"</code> goes back to the caller: if the caller’s window is not resident (only the current window is), it must be reloaded from memory (<b>underflow trap</b>); otherwise one window is simply released. A return at depth 1 is ignored. Write <code>windowTraps(events, W)</code> returning <code>{ overflows, underflows, depth }</code> (final call depth).</p>', '<p>CPU giữ tối đa <code>W</code> cửa sổ thanh ghi. Chương trình bắt đầu chạy với 1 cửa sổ (độ sâu 1). Lời gọi <code>"C"</code> biến cửa sổ của hàm được gọi thành cửa sổ hiện tại: nếu cả <code>W</code> cửa sổ đã có mặt thì cửa sổ cũ nhất bị đẩy ra bộ nhớ (<b>bẫy tràn</b>), ngược lại một cửa sổ mới có mặt. Lệnh trả về <code>"R"</code> quay lại hàm gọi: nếu cửa sổ của hàm gọi không có mặt (chỉ có cửa sổ hiện tại) thì phải nạp lại từ bộ nhớ (<b>bẫy cạn</b>); ngược lại chỉ giải phóng một cửa sổ. Trả về ở độ sâu 1 bị bỏ qua. Viết <code>windowTraps(events, W)</code> trả <code>{ overflows, underflows, depth }</code> (độ sâu cuối).</p>'),
  viDu: [{ input: 'windowTraps(["C","C","C","R","R","R"], 2)', output: JSON.stringify(windowTraps(['C', 'C', 'C', 'R', 'R', 'R'], 2)), explanation: 'With 2 windows the second and third calls overflow, and the last two returns underflow.|||Với 2 cửa sổ, lời gọi thứ hai và thứ ba gây tràn, hai lệnh trả về cuối gây cạn.' }],
  goiY: ['Track two numbers: total call depth and how many windows are resident.', 'Overflow when calling with resident = W; underflow when returning with resident = 1 and depth > 1.', 'Ignore a return at depth 1.'],
  loiHayGap: ['Counting an underflow for every return.', 'Letting resident exceed W.'],
  giaiThich: '<p>Windows make a call cheap until the call chain gets deeper than the hardware; then each extra call/return pays a memory spill/fill. Deep recursion makes windows thrash.</p>',
  khaiNiem: ['register windows', 'overflow', 'underflow'],
  fn: 'windowTraps',
  dau: 'function windowTraps(events, W) {\n  return { overflows: 0, underflows: 0, depth: 1 };\n}\n',
  giaiMa: dat(windowTraps, 'windowTraps'),
  ref: windowTraps,
  cases: [{ args: [['C', 'C', 'C', 'R', 'R', 'R'], 2] }, { args: [EV, 4] }, { args: [EV, 8] }, { args: [['R', 'R', 'C', 'R'], 3] }, { args: [EV.concat(EV), 3], an: true }, { args: [[], 5], an: true }, { args: [['C', 'R', 'C', 'R', 'C', 'R'], 1], an: true }],
});

export default doiDau({
  slug: 'cea201-13-1-risc-cisc',
  ten: '13.1 RISC vs CISC',
  khoa: KHOA,
  baiHoc: 'cea201-13-1-risc-cisc',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc;
