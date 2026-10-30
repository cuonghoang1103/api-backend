/** CEA201 · Luyện FE — hai đề thi thử (20 câu) theo dạng FE của trường: điền chỗ trống/khái niệm + tính toán. KHÔNG chép đề thật; số liệu tính bằng mã. */
import { doiDau, KHOA, S, bi, tinh, mc, q, tn, so4 } from './_ce.mjs';

const num = (ma, de, dung, nhieu, fmt, gt) => {
  const ds = so4(dung, nhieu, fmt);
  return mc(ma, de, ds.map((t, i) => ['abcd'[i], t]), 'a', gt);
};
const f2 = (x) => Number(x).toFixed(2);
const T = (a, b) => [a, b];

/* ───────── Đề A ───────── */
const CA = [
  q('a1', T('After a fetch, the control unit decodes the word that is now in the __________.', 'Sau pha nạp, đơn vị điều khiển giải mã từ lệnh đang nằm trong __________.'), ['instruction register', 'program counter', 'memory address register', 'accumulator'], T('The word arrives through the MBR and is latched in the IR, where it is decoded.', 'Từ lệnh về qua MBR rồi được chốt vào IR để giải mã.')),
  q('a2', T('Computer __________ refers to attributes visible to the programmer.', '__________ máy tính đề cập tới thuộc tính lập trình viên nhìn thấy.'), ['architecture', 'organization', 'structure', 'function'], T('Organization is the hardware realization of the architecture.', 'Tổ chức là cách phần cứng hiện thực kiến trúc.')),
  q('a3', T('Cache memory is usually built from …', 'Bộ nhớ cache thường được dựng từ …'), ['SRAM', 'DRAM', 'ROM', 'magnetic disk'], T('Speed matters more than density for a cache.', 'Với cache, tốc độ quan trọng hơn mật độ.')),
  q('a4', T('With a write-through policy, a write to the cache is also written to …', 'Với chính sách write-through, một lần ghi vào cache cũng được ghi vào …'), ['main memory', 'the register file', 'the TLB only', 'the instruction register'], T('Memory is always up to date, at the cost of write traffic.', 'Bộ nhớ luôn cập nhật nhưng tốn lưu lượng ghi.')),
  q('a5', T('RAID 1 is known as …', 'RAID 1 được gọi là …'), ['mirroring', 'striping without redundancy', 'double parity', 'distributed parity'], T('Each block is stored on two disks.', 'Mỗi khối lưu trên hai đĩa.')),
  q('a6', T('In __________ I/O the processor repeatedly tests the status of the device.', 'Trong I/O __________ bộ xử lý liên tục kiểm tra trạng thái thiết bị.'), ['programmed', 'interrupt-driven', 'DMA', 'memory-mapped'], T('Busy-waiting is programmed I/O.', 'Chờ bận là I/O lập trình.')),
  q('a7', T('The Boolean expression A + A·B simplifies to …', 'Biểu thức Boole A + A·B rút gọn thành …'), ['A', 'B', 'A·B', 'A + B'], T('Absorption law.', 'Luật hấp thụ.')),
  q('a8', T('Which addressing mode requires two memory references to obtain the operand?', 'Chế độ địa chỉ nào cần hai tham chiếu bộ nhớ để lấy toán hạng?'), ['indirect', 'immediate', 'register', 'direct'], T('First the pointer, then the data.', 'Trước là con trỏ, sau là dữ liệu.')),
  q('a9', T('A data hazard where an instruction needs a result not yet produced is a …', 'Hazard dữ liệu khi lệnh cần kết quả chưa được tạo ra là …'), ['RAW hazard', 'WAR hazard', 'WAW hazard', 'structural hazard'], T('Read After Write.', 'Đọc sau ghi.')),
  q('a10', T('The cache coherence protocol state “Modified” means …', 'Trạng thái “Modified” của giao thức nhất quán cache nghĩa là …'), ['the line is dirty and the only valid copy', 'the line is shared and clean', 'the line is invalid and must be fetched again', 'the line is clean and exclusive'], T('Memory is stale.', 'Bộ nhớ đã cũ.')),
];
const a11 = S.cpuTime(3e9, 1.2, 2.4e9), a12 = S.amat(0.96, 2, 100), g13 = S.cacheGeom(32, 64, 16384, 4), a14 = Math.pow(2, 32 - 12 + 2), a15 = S.hammingR(32);
const a16 = S.pipeSim([{ op: 'lw', rd: 1, rs: 2 }, { op: 'alu', rd: 3, rs: 1, rt: 4 }, { op: 'alu', rd: 5, rs: 3, rt: 6 }], true).cycles, a17 = S.toTwos(-37, 8), a18 = S.raidUsable(5, 6) * 2, a19 = S.amdahl(0.9, 8), a20 = 60000 / 5400 / 2;
CA.push(
  num('a11', T('A program executes 3×10⁹ instructions with an average CPI of 1.2 on a 2.4 GHz processor. Its CPU time is …', 'Chương trình thực hiện 3×10⁹ lệnh với CPI trung bình 1,2 trên bộ xử lý 2,4 GHz. Thời gian CPU là …'), f2(a11), [f2(a11 * 2.4), f2(a11 / 1.2), f2(3 * 1.2 * 2.4)], (x) => x + ' s', T(`T = IC × CPI / f = 3·10⁹ × 1.2 / 2.4·10⁹ = ${f2(a11)} s.`, `T = IC × CPI / f = ${f2(a11)} s.`)),
  num('a12', T('Hit ratio 0.96, cache time 2 cycles, miss time 100 cycles. The average access time is …', 'Tỉ lệ hit 0,96, thời gian cache 2 chu kỳ, thời gian miss 100 chu kỳ. Thời gian truy cập trung bình là …'), f2(a12), [f2(0.96 * 100 + 0.04 * 2), f2(2 + 100), f2(0.04 * 2 + 0.96 * 100 / 2)], (x) => x + ' cycles', T(`0.96×2 + 0.04×100 = ${f2(a12)}.`, `0,96×2 + 0,04×100 = ${f2(a12)}.`)),
  num('a13', T('A 16 KiB 4-way set-associative cache with 64-byte blocks and 32-bit addresses has a tag of … bits.', 'Cache 16 KiB liên kết 4 đường, khối 64 byte, địa chỉ 32 bit có tag … bit.'), String(g13.tagBits), [String(g13.tagBits + 2), String(g13.tagBits - 2), String(g13.tagBits + 6)], null, T(`offset ${g13.offsetBits}, sets ${g13.sets} ⇒ index ${g13.indexBits}, tag = 32 − ${g13.indexBits} − ${g13.offsetBits} = ${g13.tagBits}.`, `offset ${g13.offsetBits}, index ${g13.indexBits}, tag ${g13.tagBits}.`)),
  num('a14', T('A 32-bit virtual address space, 4 KiB pages, 4-byte page-table entries: the single-level page table occupies … bytes.', 'Không gian địa chỉ ảo 32 bit, trang 4 KiB, mục bảng trang 4 byte: bảng trang một cấp chiếm … byte.'), String(a14), [String(a14 / 4), String(a14 * 4), String(2 ** 32 / 4)], (x) => (Number(x) >= 1048576 ? Number(x) / 1048576 + ' MiB' : String(x)), T('2^20 pages × 4 B = 4 MiB.', '2^20 trang × 4 B = 4 MiB.')),
  num('a15', T('How many check bits does a single-error-correcting Hamming code need for 32 data bits?', 'Mã Hamming sửa một lỗi cần bao nhiêu bit kiểm tra cho 32 bit dữ liệu?'), String(a15), [String(a15 - 1), String(a15 + 1), String(a15 + 2)], null, T(`2^${a15} ≥ 32 + ${a15} + 1.`, `2^${a15} ≥ 32 + ${a15} + 1.`)),
  num('a16', T('A 5-stage pipeline with forwarding runs “lw r1,0(r2) ; add r3,r1,r4 ; sub r5,r3,r6”. Total cycles: …', 'Pipeline 5 tầng có chuyển tiếp chạy “lw r1,0(r2) ; add r3,r1,r4 ; sub r5,r3,r6”. Tổng số chu kỳ: …'), String(a16), [String(a16 - 1), String(a16 + 1), String(a16 + 2)], null, T('Ideal 3 + 4 = 7 cycles plus one load-use stall = 8.', 'Lý tưởng 3 + 4 = 7 chu kỳ cộng một đình trệ load-use = 8.')),
  num('a17', T('−37 in 8-bit two’s complement is …', '−37 trong bù 2 8 bit là …'), a17, ['11011010', '10100101', '00100101'], null, T('37 = 00100101; invert = 11011010; +1 = 11011011.', '37 = 00100101; đảo = 11011010; +1 = 11011011.')),
  num('a18', T('Six 2 TB disks in RAID 5 give a usable capacity of … TB.', 'Sáu đĩa 2 TB ở RAID 5 cho dung lượng dùng được … TB.'), String(a18), ['12', '6', '4'], (x) => x + ' TB', T('(n − 1) × 2 = 10 TB.', '(n − 1) × 2 = 10 TB.')),
  num('a19', T('A program is 90 % parallelizable. The Amdahl speedup on 8 cores is about …', 'Chương trình song song hoá được 90 %. Tăng tốc Amdahl trên 8 lõi xấp xỉ …'), f2(a19), [f2(8), f2(0.9 * 8), f2(1 / 0.1)], (x) => x + '×', T(`1 / (0.1 + 0.9/8) = ${f2(a19)}.`, `1 / (0,1 + 0,9/8) = ${f2(a19)}.`)),
  num('a20', T('A 5400 rpm disk has an average rotational latency of … ms.', 'Đĩa 5400 vòng/phút có độ trễ quay trung bình … ms.'), f2(a20), [f2(a20 * 2), f2(a20 / 2), f2(60000 / 7200 / 2)], (x) => x + ' ms', T('60000 / 5400 / 2 = 5.56 ms.', '60000 / 5400 / 2 = 5,56 ms.')),
);
const DA = tinh({
  tieuDe: 'FE mock A — 20 questions (concepts and calculations)',
  doKho: 'HARD', phut: 40, diem: 40,
  moTa: bi('<p>Mock final exam in the style of the university paper: 20 multiple-choice questions, half concepts (“fill the blank”) and half calculations. Work the calculations on paper first. 40 minutes. Nothing here is copied from a real exam.</p>', '<p>Đề thi cuối kỳ thử theo phong cách đề của trường: 20 câu trắc nghiệm, một nửa khái niệm (“điền chỗ trống”) và một nửa tính toán. Hãy tính ra giấy trước. 40 phút. Không câu nào chép từ đề thật.</p>'),
  loai: 'choice',
  cauHoi: CA,
  goiY: ['Do the concept questions first (about 1 minute each), then the calculations.', 'For calculations write the formula before the numbers.'],
  loiHayGap: ['Mixing units (GHz vs Hz, KiB vs KB).', 'Choosing an option that matches a partial result (the distractors are typical slips).'],
  thuatNgu: [tn('PC', 'bộ đếm chương trình')],
  khaiNiem: ['final exam practice'],
});

/* ───────── Đề B ───────── */
const CB = [
  q('b1', T('In a __________ architecture instructions and data share one memory.', 'Trong kiến trúc __________ lệnh và dữ liệu dùng chung một bộ nhớ.'), ['von Neumann', 'Harvard', 'dataflow', 'systolic'], T('Stored-program concept.', 'Khái niệm chương trình lưu trữ.')),
  q('b2', T('Temporal locality means …', 'Cục bộ thời gian nghĩa là …'), ['an address referenced now is likely to be referenced again soon', 'neighbouring addresses are referenced together', 'programs are scheduled to run at the same time every day', 'memory addresses are always accessed in increasing order'], T('Reuse of the same location.', 'Tái sử dụng cùng một vị trí.')),
  q('b3', T('A page fault is handled by the …', 'Lỗi trang được xử lý bởi …'), ['operating system', 'cache controller', 'ALU', 'bus arbiter'], T('The OS loads the page from disk.', 'HĐH nạp trang từ đĩa.')),
  q('b4', T('Which gate gives 1 only when its inputs differ?', 'Cổng nào cho 1 chỉ khi các ngõ vào khác nhau?'), ['XOR', 'AND', 'NOR', 'XNOR'], T('XOR = A·B′ + A′·B.', 'XOR = A·B′ + A′·B.')),
  q('b5', T('DMA is most useful for …', 'DMA hữu ích nhất cho …'), ['large block transfers', 'single-byte keyboard input', 'floating-point arithmetic', 'cache replacement'], T('The CPU is only involved at start and end.', 'CPU chỉ tham gia ở đầu và cuối.')),
  q('b6', T('The opcode of an instruction specifies …', 'Opcode của lệnh chỉ định …'), ['the operation to perform', 'the number of registers', 'the page size', 'the clock frequency'], T('What to do.', 'Làm gì.')),
  q('b7', T('A 2-bit saturating counter predictor mispredicts a loop branch mainly …', 'Bộ dự đoán bộ đếm bão hoà 2 bit đoán sai nhánh vòng lặp chủ yếu …'), ['once per loop execution (at the exit)', 'twice per loop execution (exit and re-entry)', 'never (once it is trained)', 'at every iteration (it flips each time)'], T('The loop exit flips only one prediction.', 'Lối thoát vòng lặp chỉ làm sai một dự đoán.')),
  q('b8', T('Which RISC characteristic simplifies pipelining?', 'Đặc trưng RISC nào giúp pipeline đơn giản?'), ['fixed-length instructions', 'many addressing modes', 'memory-to-memory operations', 'microcoded instructions'], T('Regular decode.', 'Giải mã đều đặn.')),
  q('b9', T('A superscalar processor …', 'Bộ xử lý superscalar …'), ['issues several instructions per cycle', 'splits each instruction into many stages', 'has no cache, only a large register file', 'runs only one thread at any moment'], T('IPC can exceed 1.', 'IPC có thể vượt 1.')),
  q('b10', T('MARIE’s Skipcond 800 skips the next instruction when …', 'Skipcond 800 của MARIE bỏ qua lệnh kế khi …'), ['AC > 0', 'AC = 0', 'AC < 0', 'AC ≠ 0'], T('Skipcond 000: AC &lt; 0; 400: AC = 0; 800: AC &gt; 0.', 'Skipcond 000: AC &lt; 0; 400: AC = 0; 800: AC &gt; 0.')),
];
const b11 = (32 / 8) * 133e6 * 2 / 1e6, b12 = S.cacheSim([0, 16, 32, 48, 0, 64, 16, 80, 32], 16, 4, 1, 'LRU').misses, b13 = S.f32Fields(-5).hex, b14 = S.mips(2e9, 1.6), b15 = S.pageFaults('LRU', [1, 2, 3, 1, 4, 2, 5, 1, 2, 3], 3), b16 = (S.mesi(2, [[0, 'R'], [1, 'R'], [0, 'W']]).states[2]), b17 = S.predict2bit('TTNTTNTTN', 0).mispredicts, b18 = S.addTwos(90, 50, 8), b19 = 1e9 * 8e6 / 4096 * 2000 / 2e9 * 100 / 1e9, b20 = S.diskAccess(6, 10000, 4096, 2e5);
CB.push(
  num('b11', T('A 32-bit data bus at 133 MHz transferring on both clock edges has a peak bandwidth of … MB/s.', 'Bus dữ liệu 32 bit ở 133 MHz truyền ở cả hai sườn xung có băng thông đỉnh … MB/s.'), String(Math.round(b11)), [String(Math.round(b11 / 2)), String(Math.round(b11 * 8)), String(Math.round(b11 / 4))], (x) => x + ' MB/s', T(`4 B × 133 MHz × 2 = ${Math.round(b11)} MB/s.`, `4 B × 133 MHz × 2 = ${Math.round(b11)} MB/s.`)),
  num('b12', T('Direct-mapped cache, 4 lines of 16 bytes, byte addresses 0,16,32,48,0,64,16,80,32: the number of misses is …', 'Cache trực tiếp 4 dòng 16 byte, địa chỉ byte 0,16,32,48,0,64,16,80,32: số miss là …'), String(b12), [String(b12 - 1), String(b12 + 1), String(b12 - 2)], null, T('Blocks 0,1,2,3,0,4,1,5,2 map to lines 0,1,2,3,0,0,1,1,2: ' + S.cacheSim([0, 16, 32, 48, 0, 64, 16, 80, 32], 16, 4, 1, 'LRU').trace.split('').join(' ') + ' (M = miss, H = hit); blocks 4 and 5 evict blocks 0 and 1.', 'Khối 0,1,2,3,0,4,1,5,2 ánh xạ vào dòng 0,1,2,3,0,0,1,1,2: ' + S.cacheSim([0, 16, 32, 48, 0, 64, 16, 80, 32], 16, 4, 1, 'LRU').trace.split('').join(' ') + ' (M = miss, H = hit); khối 4 và 5 đuổi khối 0 và 1.')),
  num('b13', T('The IEEE 754 single-precision pattern of −5.0 in hex is …', 'Mẫu IEEE 754 đơn của −5,0 dạng hex là …'), b13, ['40A00000', 'C0400000', 'C1200000'], null, T('−5 = −1.01₂ × 2², E = 129 = 10000001, so C0A00000.', '−5 = −1,01₂ × 2², E = 129 nên C0A00000.')),
  num('b14', T('At 2 GHz with CPI 1.6 the MIPS rating is …', 'Ở 2 GHz với CPI 1,6, xếp hạng MIPS là …'), f2(b14), [f2(2000 * 1.6), f2(2000 / 3.2), f2(1.6 / 2)], (x) => x + ' MIPS', T(`2000 / 1.6 = ${f2(b14)}.`, `2000 / 1,6 = ${f2(b14)}.`)),
  num('b15', T('LRU with 3 frames on the reference string 1 2 3 1 4 2 5 1 2 3 causes … page faults.', 'LRU với 3 khung trên chuỗi 1 2 3 1 4 2 5 1 2 3 gây … lỗi trang.'), String(b15), [String(b15 - 1), String(b15 + 1), String(b15 - 2)], null, T('Simulate the frames after each reference.', 'Mô phỏng các khung sau mỗi tham chiếu.')),
  num('b16', T('Two cores: P0 reads, P1 reads, P0 writes the same block. The final MESI states of (P0, P1) are …', 'Hai lõi: P0 đọc, P1 đọc, P0 ghi cùng khối. Trạng thái MESI cuối của (P0, P1) là …'), b16, ['SS', 'EI', 'MM'], null, T('The write invalidates P1 and leaves P0 Modified.', 'Lần ghi vô hiệu P1 và để P0 ở Modified.')),
  num('b17', T('A 2-bit counter (start 0) on the branch outcomes TTNTTNTTN mispredicts … times.', 'Bộ đếm 2 bit (bắt đầu 0) trên kết quả nhánh TTNTTNTTN đoán sai … lần.'), String(b17), [String(b17 - 1), String(b17 + 1), String(b17 + 2)], null, T('Trace the counter value before each branch.', 'Lần theo giá trị bộ đếm trước mỗi nhánh.')),
  num('b18', T('90 + 50 in 8-bit two’s complement gives …', '90 + 50 trong bù 2 8 bit cho …'), b18.overflow ? 'overflow, result 10001100 (−116)' : '??', ['no overflow, result 10001100', 'overflow, result 00000000', 'no overflow, result 10001100 (+140)'], null, T('90 + 50 = 140 > 127: the sign bit becomes 1 so the signed result is −116 (overflow).', '90 + 50 = 140 > 127: bit dấu thành 1 nên kết quả có dấu là −116 (tràn).')),
  num('b19', T('An 8 MB/s stream moved by DMA in 4 KiB blocks, 2000 cycles per block on a 2 GHz CPU, costs about … % of the CPU.', 'Dòng 8 MB/s được DMA chuyển theo khối 4 KiB, 2000 chu kỳ mỗi khối trên CPU 2 GHz, tốn khoảng … % CPU.'), f2(8e6 / 4096 * 2000 / 2e9 * 100), [f2(8e6 / 4 * 600 / 2e9 * 100), f2(8e6 / 4096 * 2000 / 2e9), '100.00'], (x) => x + ' %', T('1953 blocks/s × 2000 cycles = 3.9·10⁶ cycles/s of 2·10⁹ = 0.20 %.', '1953 khối/s × 2000 chu kỳ = 3,9·10⁶ chu kỳ/s trên 2·10⁹ = 0,20 %.')),
  num('b20', T('A 10,000 rpm disk, 6 ms seek, reads 4096 bytes from a 200,000-byte track: the access time is about … ms.', 'Đĩa 10.000 vòng/phút, seek 6 ms, đọc 4096 byte từ rãnh 200.000 byte: thời gian truy cập khoảng … ms.'), f2(b20), [f2(6 + 6), f2(6 + 0.12), f2(b20 * 2)], (x) => x + ' ms', T(`6 + 3.00 (half of 6 ms) + 0.12 = ${f2(b20)} ms.`, `6 + 3,00 + 0,12 = ${f2(b20)} ms.`)),
);
const DB = tinh({
  tieuDe: 'FE mock B — 20 questions (more calculations)',
  doKho: 'HARD', phut: 40, diem: 40,
  moTa: bi('<p>A second mock final exam: 10 concept questions and 10 calculations (bus bandwidth, cache misses, IEEE 754, MIPS, page faults, MESI, branch prediction, overflow, DMA load, disk access). 40 minutes; everything was computed by the course simulators.</p>', '<p>Đề thi cuối kỳ thử thứ hai: 10 câu khái niệm và 10 câu tính toán (băng thông bus, miss cache, IEEE 754, MIPS, lỗi trang, MESI, dự đoán rẽ nhánh, tràn số, tải DMA, truy cập đĩa). 40 phút; mọi số liệu đều do bộ mô phỏng của khoá học tính.</p>'),
  loai: 'choice',
  cauHoi: CB,
  goiY: ['Leave the long calculations for the second pass.', 'Check units and orders of magnitude of each option.'],
  loiHayGap: ['Forgetting the double-data-rate factor.', 'Treating overflow as the same thing as a carry-out.'],
  thuatNgu: [tn('MIPS', 'triệu lệnh trên giây')],
  khaiNiem: ['final exam practice'],
});

export default doiDau({
  slug: 'cea201-20-fe-mock',
  ten: '20 FE practice: two mock final exams',
  khoa: KHOA,
  baiHoc: 'cea201-quiz-ch15',
  de: [DA, DB],
});
void q; void S;
