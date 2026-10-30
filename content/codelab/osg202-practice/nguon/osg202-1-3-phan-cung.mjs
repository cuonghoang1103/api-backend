/**
 * OSG202 · 1.3 — Hardware review: memory hierarchy, interrupts, DMA, dual mode (số học).
 */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, tn, xoay, nguon } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Hardware 1 — Interrupts, traps and the memory hierarchy (concepts)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on the hardware the OS depends on.</p>', '<p>Năm câu về phần cứng mà OS dựa vào.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What is the difference between an interrupt and a trap?', 'Interrupt khác trap ở chỗ nào?'], [['a', 'An interrupt is asynchronous (a device signals); a trap is synchronous (caused by the running instruction)'], ['b', 'They are identical'], ['c', 'Traps come from devices'], ['d', 'Interrupts only happen in user mode']], 'a', ['Hardware interrupts arrive at any time; a trap (system call, divide by zero, page fault) is a result of the current instruction.', 'Ngắt phần cứng đến bất kỳ lúc nào; trap (lời gọi hệ thống, chia cho 0, lỗi trang) là kết quả của lệnh đang chạy.']),
    mc('c2', ['Where does the CPU find the address of the interrupt handler?', 'CPU tìm địa chỉ trình xử lý ngắt ở đâu?'], [['a', 'In the interrupt vector table, indexed by the interrupt number'], ['b', 'In the TLB'], ['c', 'In the register file'], ['d', 'On the disk']], 'a', ['The vector holds one handler address per interrupt number.', 'Bảng vector chứa một địa chỉ trình xử lý cho mỗi số ngắt.']),
    mc('c3', ['Going down the memory hierarchy (registers → cache → RAM → disk), capacity …', 'Đi xuống tầng bộ nhớ (thanh ghi → cache → RAM → đĩa), dung lượng …'], [['a', 'increases while speed decreases and cost per byte falls'], ['b', 'decreases and speed increases'], ['c', 'stays the same'], ['d', 'increases together with speed']], 'a', ['The classic trade-off: faster memory is smaller and costlier.', 'Đánh đổi kinh điển: bộ nhớ nhanh hơn thì nhỏ hơn và đắt hơn.']),
    mc('c4', ['Why does caching work?', 'Vì sao cache hoạt động hiệu quả?'], [['a', 'Programs show locality of reference (temporal and spatial)'], ['b', 'The cache is bigger than RAM'], ['c', 'Memory is always idle'], ['d', 'The OS prefetches everything']], 'a', ['Recently used data and its neighbours are likely to be used again.', 'Dữ liệu vừa dùng và lân cận có khả năng được dùng lại.']),
    mc('c5', ['While an interrupt handler runs, the OS usually …', 'Trong lúc trình xử lý ngắt chạy, OS thường …'], [['a', 'masks (disables) interrupts of the same or lower priority for a short time'], ['b', 'keeps all interrupts enabled'], ['c', 'switches to a user process'], ['d', 'reboots the device']], 'a', ['Handlers must be short and non-reentrant for the same line; the heavy part is deferred.', 'Trình xử lý phải ngắn; phần nặng được hoãn lại.']),
  ],
  goiY: ['Synchronous = caused by the current instruction; asynchronous = comes from outside.', 'Locality: temporal (same address again) and spatial (neighbouring addresses).'],
  loiHayGap: ['Calling a page fault an interrupt (it is a trap/exception).', 'Believing a larger cache always means a faster cache.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('interrupt vector', 'bảng vector ngắt'), tn('locality of reference', 'tính cục bộ của tham chiếu')],
  khaiNiem: ['interrupts', 'memory hierarchy', 'locality'],
});

const rowsE = [[0.90, 2, 100], [0.95, 2, 100], [0.99, 1, 120], [0.80, 5, 200]];
const avg = (h, c, m) => h * c + (1 - h) * m;
const E2 = tinh({
  tieuDe: 'Hardware 2 — Average memory access time with a cache',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>A cache hit costs <b>c</b> ns, a miss goes to main memory and costs <b>m</b> ns in total. Compute the average access time (ns, 2 decimals) for hit ratio <b>h</b>: h × c + (1 − h) × m.</p>', '<p>Cache hit tốn <b>c</b> ns, miss phải xuống bộ nhớ chính và tốn tổng cộng <b>m</b> ns. Tính thời gian truy cập trung bình (ns, 2 chữ số thập phân) với tỉ lệ hit <b>h</b>: h × c + (1 − h) × m.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Average access time', 'Thời gian truy cập trung bình'),
    cot: [{ ma: 'p', ten: 'h, c, m' }, { ma: 't', ten: 'Average (ns)' }],
    hang: rowsE.map(([h, c, m], i) => ({ ma: `r${i}`, o: { p: `h = ${h}, c = ${c} ns, m = ${m} ns` } })),
    dapAn: Object.fromEntries(rowsE.map(([h, c, m], i) => [`r${i}.t`, [avg(h, c, m).toFixed(2), String(+avg(h, c, m).toFixed(2))]])),
    giaiThich: giai(rowsE.map(([h, c, m]) => `${h}×${c} + ${+(1 - h).toFixed(2)}×${m} = ${avg(h, c, m).toFixed(2)}`).join('; ') + '. A 1% change of the hit ratio changes the average noticeably when m ≫ c.', rowsE.map(([h, c, m]) => `${avg(h, c, m).toFixed(2)} ns`).join('; ') + '. Tỉ lệ hit đổi 1% làm trung bình đổi đáng kể khi m ≫ c.'),
  }],
  goiY: ['Weight each cost by its probability.', '(1 − h) is the miss ratio.'],
  loiHayGap: ['Adding c and m without weights.', 'Using h as the miss ratio.'],
  giaiThich: '<p>' + rowsE.map(([h, c, m]) => avg(h, c, m).toFixed(2)).join(' · ') + ' ns.</p>',
  thuatNgu: [tn('hit ratio', 'tỉ lệ trúng cache'), tn('miss penalty', 'phạt khi trượt')],
  khaiNiem: ['caching', 'average access time'],
});

const IR = ['The device raises an interrupt request on its line', 'The CPU finishes the current instruction', 'The CPU pushes the program counter and status word on the stack and switches to kernel mode', 'The CPU loads the handler address from the interrupt vector', 'The handler saves the registers it will use, services the device and restores the registers', 'The return-from-interrupt instruction restores PC and status; the interrupted program continues'];
const E3 = tinh({
  tieuDe: 'Hardware 3 — Order the steps of interrupt handling',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Arrange the steps from the device’s request to the resumption of the interrupted program.</p>', '<p>Sắp xếp các bước từ yêu cầu của thiết bị đến lúc chương trình bị ngắt tiếp tục chạy.</p>'),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('Interrupt handling', 'Xử lý ngắt'),
    muc: xoay(IR.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), 2), dapAn: IR.map((_, i) => `s${i + 1}`),
    giaiThich: giai('The CPU is never interrupted in the middle of an instruction; it saves just enough state in hardware, jumps through the vector, and the handler restores everything before the return.', 'CPU không bao giờ bị ngắt giữa chừng một lệnh; phần cứng lưu đủ trạng thái tối thiểu, nhảy qua vector, và trình xử lý khôi phục mọi thứ trước khi quay lại.'),
  }],
  goiY: ['Instructions are atomic with respect to interrupts.', 'The hardware saves PC and status; software saves the other registers.'],
  loiHayGap: ['Letting the interrupt cut an instruction in half.', 'Forgetting to restore the registers before returning.'],
  giaiThich: '<p>request → finish instruction → push PC/PSW + kernel mode → vector → handler → return.</p>',
  thuatNgu: [tn('program status word', 'từ trạng thái chương trình (PSW)')],
  khaiNiem: ['interrupt handling'],
});

const sc = [['1 Gbit/s network card, 1500-byte packets, interrupt per packet, 5 µs per interrupt', 125000000 / 1500, 5], ['SSD, 4 KB blocks at 400 MB/s, interrupt per block, 10 µs each', 400000000 / 4096, 10], ['Same SSD with DMA batching: one interrupt per 64 KB, 10 µs each', 400000000 / 65536, 10], ['Keyboard, 10 key presses per second, 20 µs each', 10, 20]];
const pct = (r, c) => (r * c) / 1e6 * 100;
const E4 = tinh({
  tieuDe: 'Hardware 4 — How much CPU do interrupts cost?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>CPU time spent in interrupt handling (% of one CPU) = interrupts per second × cost per interrupt. Compute the percentage, rounded to 1 decimal (e.g. <code>41.7</code>).</p>', '<p>Thời gian CPU dùng cho xử lý ngắt (% của một CPU) = số ngắt mỗi giây × chi phí mỗi ngắt. Tính phần trăm, làm tròn 1 chữ số thập phân (vd <code>41.7</code>).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Interrupt overhead', 'Chi phí ngắt'),
    cot: [{ ma: 's', ten: 'Scenario' }, { ma: 'r', ten: 'Interrupts / s (rounded)' }, { ma: 'p', ten: 'CPU used (%)' }],
    hang: sc.map(([n], i) => ({ ma: `s${i}`, o: { s: n } })),
    dapAn: Object.fromEntries(sc.flatMap(([, r, c], i) => [[`s${i}.r`, String(Math.round(r))], [`s${i}.p`, [pct(r, c).toFixed(1), String(+pct(r, c).toFixed(1))]]])),
    giaiThich: giai(sc.map(([n, r, c]) => `${n.split(',')[0]}: ${Math.round(r)}/s × ${c} µs = ${pct(r, c).toFixed(1)}%`).join('; ') + '. Batching (DMA of larger blocks, interrupt coalescing) is how real systems keep this overhead small.', sc.map(([n, r, c]) => `${Math.round(r)}/s × ${c} µs = ${pct(r, c).toFixed(1)}%`).join('; ') + '. Gom lô (DMA khối lớn, gộp ngắt) là cách hệ thống thật giữ chi phí này nhỏ.'),
  }],
  goiY: ['Rate = bytes per second / bytes per interrupt.', 'Convert µs to seconds: × 10⁻⁶.'],
  loiHayGap: ['Forgetting to convert microseconds to seconds.', 'Using the packet rate for the DMA case instead of one interrupt per 64 KB.'],
  giaiThich: '<p>' + sc.map(([, r, c]) => pct(r, c).toFixed(1) + '%').join(' · ') + '</p>',
  thuatNgu: [tn('interrupt coalescing', 'gộp nhiều sự kiện vào một ngắt')],
  khaiNiem: ['interrupt overhead', 'DMA batching'],
});

export default doiDau({
  slug: 'osg202-1-3-phan-cung',
  ten: '1.3 Hardware review: interrupts, DMA & dual mode',
  khoa: KHOA,
  baiHoc: 'osg202-1-3-phan-cung',
  de: [E1, E2, E3, E4],
});
void hai; void jsDe; void nguon;
