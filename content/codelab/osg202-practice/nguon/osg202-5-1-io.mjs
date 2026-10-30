/**
 * OSG202 · 5.1 — I/O hardware & software: polling / interrupts / DMA, layers, disk timing, RAID.
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, dat, mc, tn, xoay } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'I/O 1 — Polling, interrupts, DMA and memory-mapped I/O',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on how the CPU talks to devices.</p>', '<p>Năm câu về cách CPU làm việc với thiết bị.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['In programmed I/O with polling the CPU …', 'Với I/O lập trình theo kiểu thăm dò (polling) CPU …'], [['a', 'repeatedly reads the device status until the device is ready'], ['b', 'sleeps until the device raises an interrupt to say it is ready'], ['c', 'lets the DMA controller copy the data, then checks the count once'], ['d', 'never touches the data, because the controller copies it to memory']], 'a', ['Busy waiting wastes CPU time but is simple and fast for very quick devices.', 'Busy waiting phí CPU nhưng đơn giản và nhanh với thiết bị rất nhanh.']),
    mc('c2', ['What is the main advantage of interrupt-driven I/O over polling?', 'Ưu điểm chính của I/O dùng ngắt so với polling?'], [['a', 'The CPU can do other work while the device is busy'], ['b', 'It needs no driver, so the kernel stays smaller'], ['c', 'It is always faster per byte, even for quick devices'], ['d', 'It removes the need for an OS during the transfer']], 'a', ['The device signals completion; the CPU runs other processes meanwhile.', 'Thiết bị báo hoàn tất; CPU chạy tiến trình khác trong lúc đó.']),
    mc('c3', ['A DMA controller is used to …', 'Bộ điều khiển DMA dùng để …'], [['a', 'transfer a block between a device and memory without the CPU copying it'], ['b', 'translate the virtual addresses of a block before the CPU reads them'], ['c', 'schedule the processes that are waiting for a block from a device'], ['d', 'cache the entries of the page table between a device and the MMU']], 'a', ['The CPU sets up the transfer (address, count, direction); the DMA controller interrupts once at the end.', 'CPU thiết lập chuyển (địa chỉ, số lượng, chiều); DMA ngắt một lần ở cuối.']),
    mc('c4', ['Memory-mapped I/O means …', 'Memory-mapped I/O nghĩa là …'], [['a', 'device registers get addresses in the normal address space and use ordinary load/store'], ['b', 'the data of the device is copied into the page cache and read with ordinary load instructions'], ['c', 'files on the device are mapped with mmap, so programs read them as ordinary memory'], ['d', 'device registers have a separate address space that only special IN/OUT instructions can reach']], 'a', ['Alternative: port-mapped I/O with separate IN/OUT instructions and a separate I/O address space.', 'Khác với port-mapped I/O có lệnh IN/OUT riêng và không gian địa chỉ I/O riêng.']),
    mc('c5', ['What does a device driver do?', 'Trình điều khiển thiết bị (driver) làm gì?'], [['a', 'Hides the hardware details of one device behind a standard interface'], ['b', 'Decides which process may use a device next and for how long'], ['c', 'Maintains the page table of each process that uses the device'], ['d', 'Translates the system calls of user programs into source code']], 'a', ['Drivers are device-specific, run in kernel mode (usually) and are a main source of OS crashes.', 'Driver riêng cho từng thiết bị, thường chạy ở chế độ kernel và là nguồn gây sập OS chính.']),
  ],
  goiY: ['Who does the waiting — the CPU (polling), nobody (interrupt) or the DMA controller (block transfer)?', 'Memory-mapped = same instructions as memory.'],
  loiHayGap: ['Believing DMA removes all interrupts (there is still one at the end).', 'Confusing memory-mapped I/O with memory-mapped files.'],
  thuatNgu: [tn('DMA', 'truy cập bộ nhớ trực tiếp'), tn('device driver', 'trình điều khiển thiết bị'), tn('polling', 'thăm dò liên tục')],
  khaiNiem: ['polling', 'interrupt', 'DMA', 'memory-mapped I/O'],
});

const LAY = ['User-level I/O software (e.g. printf, libraries)', 'Device-independent OS software (naming, buffering, protection)', 'Device drivers', 'Interrupt handlers', 'Hardware (controller and device)'];
const DMA = ['The CPU programs the DMA controller: memory address, byte count, direction', 'The DMA controller asks the disk controller to read a block', 'The disk controller moves the data into its internal buffer', 'The DMA controller writes the data into memory over the bus, address by address', 'The count reaches zero and the DMA controller interrupts the CPU'];
const E2 = tinh({
  tieuDe: 'I/O 2 — The I/O software stack and a DMA transfer',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Two ordering questions: the layers of the I/O software (top to bottom) and the steps of a DMA read.</p>', '<p>Hai câu sắp xếp: các tầng của phần mềm I/O (từ trên xuống) và các bước của một lần đọc DMA.</p>'),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('I/O software layers, user to hardware', 'Các tầng phần mềm I/O, từ người dùng xuống phần cứng'),
    muc: xoay(LAY.map((n, i) => ({ ma: `l${i + 1}`, noiDung: n })), 2), dapAn: LAY.map((_, i) => `l${i + 1}`),
    giaiThich: giai('A request goes down: user library → device-independent layer (which device? buffer? permission?) → driver (device specific commands) → interrupt handler (completion) → hardware.', 'Yêu cầu đi xuống: thư viện người dùng → tầng độc lập thiết bị (thiết bị nào? đệm? quyền?) → driver (lệnh riêng thiết bị) → trình xử lý ngắt (hoàn tất) → phần cứng.'),
  }, {
    ma: 'q2', de: hai('Steps of a DMA read', 'Các bước của một lần đọc DMA'),
    muc: xoay(DMA.map((n, i) => ({ ma: `d${i + 1}`, noiDung: n })), 3), dapAn: DMA.map((_, i) => `d${i + 1}`),
    giaiThich: giai('Setup (CPU) → disk read request → controller buffer → DMA writes memory (the CPU is free meanwhile) → completion interrupt.', 'Thiết lập (CPU) → yêu cầu đĩa đọc → bộ đệm controller → DMA ghi vào bộ nhớ (CPU rảnh trong lúc đó) → ngắt báo xong.'),
  }],
  goiY: ['Each layer calls the one below; completion travels back up through the interrupt handler.', 'In DMA the CPU is only involved at the start and at the end.'],
  loiHayGap: ['Putting the driver above the device-independent layer.', 'Letting the CPU copy the bytes in the DMA scenario.'],
  giaiThich: '<p>user → device-independent → drivers → interrupt handlers → hardware; setup → request → buffer → bus write → interrupt.</p>',
  thuatNgu: [tn('device-independent layer', 'tầng độc lập thiết bị: đặt tên, đệm, bảo vệ')],
  khaiNiem: ['I/O software layers', 'DMA'],
});

/* Bài 3: thời gian truy cập đĩa */
const SEEK = 5; const SEC = 400; const NS = 8;
const rows3 = [5400, 7200, 10000, 15000];
const rot = (rpm) => 60000 / rpm;
const t3 = (rpm) => SEEK + rot(rpm) / 2 + (NS / SEC) * rot(rpm);
const E3 = tinh({
  tieuDe: 'I/O 3 — Disk access time = seek + rotational latency + transfer',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>A disk has an average seek time of ${SEEK} ms and ${SEC} sectors per track. Reading a 4 KB block means ${NS} consecutive sectors. For each spindle speed compute the time of one rotation, the average rotational latency (half a rotation) and the total average access time = seek + latency + transfer of ${NS} sectors (${NS}/${SEC} of a rotation). Answers in ms with 2 decimals.</p>`,
    `<p>Một đĩa có thời gian seek trung bình ${SEEK} ms và ${SEC} sector mỗi track. Đọc một khối 4 KB là ${NS} sector liên tiếp. Với mỗi tốc độ quay hãy tính thời gian một vòng quay, độ trễ quay trung bình (nửa vòng) và tổng thời gian truy cập trung bình = seek + trễ quay + truyền ${NS} sector (${NS}/${SEC} vòng). Đáp án theo ms, 2 chữ số thập phân.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Timing', 'Thời gian'),
    cot: [{ ma: 'r', ten: 'RPM' }, { ma: 'rot', ten: 'Rotation (ms)' }, { ma: 'lat', ten: 'Avg latency (ms)' }, { ma: 'tot', ten: 'Access time (ms)' }],
    hang: rows3.map((r) => ({ ma: `r${r}`, o: { r: String(r) } })),
    dapAn: Object.fromEntries(rows3.flatMap((r) => [[`r${r}.rot`, [rot(r).toFixed(2), String(+rot(r).toFixed(2))]], [`r${r}.lat`, [(rot(r) / 2).toFixed(2), String(+(rot(r) / 2).toFixed(2))]], [`r${r}.tot`, [t3(r).toFixed(2), String(+t3(r).toFixed(2))]]])),
    giaiThich: giai(rows3.map((r) => `${r} rpm: rotation ${rot(r).toFixed(2)}, latency ${(rot(r) / 2).toFixed(2)}, total ${SEEK} + ${(rot(r) / 2).toFixed(2)} + ${((NS / SEC) * rot(r)).toFixed(2)} = ${t3(r).toFixed(2)} ms`).join('; ') + '. Seek and rotation dominate; the transfer is tiny. This is why the OS schedules requests and groups blocks.', rows3.map((r) => `${r} rpm: ${rot(r).toFixed(2)} / ${(rot(r) / 2).toFixed(2)} / ${t3(r).toFixed(2)} ms`).join('; ') + '. Seek và quay chiếm gần hết; truyền rất nhỏ. Vì vậy OS lập lịch yêu cầu và gom khối.'),
  }],
  goiY: ['One rotation = 60 000 ms / RPM.', 'Latency is the AVERAGE wait: half a rotation.'],
  loiHayGap: ['Using a full rotation as the latency.', 'Adding the transfer of the whole track instead of 8 sectors.'],
  giaiThich: '<p>' + rows3.map((r) => t3(r).toFixed(2)).join(' · ') + ' ms.</p>',
  thuatNgu: [tn('seek time', 'thời gian di chuyển đầu đọc'), tn('rotational latency', 'độ trễ quay'), tn('transfer time', 'thời gian truyền')],
  khaiNiem: ['disk access time'],
});

const rd = [[0, 4, 2], [1, 2, 4], [5, 5, 2], [6, 6, 2], [10, 8, 1]];
const nameR = (l) => (l === 10 ? 'RAID 1+0' : `RAID ${l}`);
const E4 = tinh({
  tieuDe: 'I/O 4 — RAID: usable capacity and guaranteed fault tolerance',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>For each array give the usable capacity in TB and the number of disk failures it is GUARANTEED to survive (for RAID 1+0 count the worst case: two failures may hit the same mirror pair). RAID 1 here is an n-way mirror.</p>', '<p>Với mỗi mảng cho dung lượng dùng được (TB) và số ổ hỏng mà nó ĐẢM BẢO chịu được (RAID 1+0 tính trường hợp xấu nhất: hai ổ hỏng có thể rơi vào cùng một cặp gương). RAID 1 ở đây là gương n bản.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('RAID arrays', 'Các mảng RAID'),
    cot: [{ ma: 'a', ten: 'Array' }, { ma: 'u', ten: 'Usable (TB)' }, { ma: 'f', ten: 'Failures survived' }],
    hang: rd.map(([l, n, s], i) => ({ ma: `a${i}`, o: { a: `${nameR(l)}: ${n} disks × ${s} TB` } })),
    dapAn: Object.fromEntries(rd.flatMap(([l, n, s], i) => { const r = S.raid(l, n, s); return [[`a${i}.u`, String(r.usable)], [`a${i}.f`, String(r.tolerate)]]; })),
    giaiThich: giai(rd.map(([l, n, s]) => { const r = S.raid(l, n, s); return `${nameR(l)} ${n}×${s}: ${r.usable} TB, ${r.tolerate} failure(s)`; }).join('; ') + '. RAID 0 stripes (no redundancy), RAID 1 mirrors, RAID 5 loses one disk to parity, RAID 6 two disks to double parity, RAID 1+0 mirrors then stripes.', rd.map(([l, n, s]) => { const r = S.raid(l, n, s); return `${nameR(l)} ${n}×${s}: ${r.usable} TB, chịu ${r.tolerate} ổ`; }).join('; ') + '. RAID 0 chia dải (không dư thừa), RAID 1 gương, RAID 5 mất một ổ cho parity, RAID 6 hai ổ, RAID 1+0 gương rồi chia dải.'),
  }],
  goiY: ['RAID 5: (n − 1) × size; RAID 6: (n − 2) × size; mirrors halve the capacity.', 'Guaranteed = what survives the worst choice of failed disks.'],
  loiHayGap: ['Answering n/2 failures for RAID 1+0 (that is the best case, not the guarantee).', 'Forgetting the parity disk of RAID 5.'],
  giaiThich: '<p>' + rd.map(([l, n, s]) => `${S.raid(l, n, s).usable}/${S.raid(l, n, s).tolerate}`).join(' · ') + '</p>',
  thuatNgu: [tn('striping', 'chia dải dữ liệu qua nhiều ổ'), tn('parity', 'mã chẵn lẻ để dựng lại ổ hỏng'), tn('mirroring', 'sao gương')],
  khaiNiem: ['RAID levels'],
});

const E5 = jsDe({
  tieuDe: 'I/O 5 — RAID capacity and disk access time in code',
  doKho: 'HARD', phut: 20,
  moTa: bi(`<p>Write <code>raid(level, n, size)</code> returning <code>{ usable, tolerate }</code> for <code>level</code> ∈ 0, 1 (n-way mirror), 5, 6, 10 (stripe of mirrored pairs; <code>tolerate</code> is the guaranteed number of failures), and <code>accessMs(rpm, seekMs, sectorsPerTrack, sectors)</code> returning the average access time in ms (seek + half a rotation + the time to pass <code>sectors</code> sectors) as a number rounded to 2 decimals.</p>`,
    `<p>Viết <code>raid(level, n, size)</code> trả <code>{ usable, tolerate }</code> với <code>level</code> ∈ 0, 1 (gương n bản), 5, 6, 10 (chia dải trên các cặp gương; <code>tolerate</code> là số ổ hỏng được ĐẢM BẢO), và <code>accessMs(rpm, seekMs, sectorsPerTrack, sectors)</code> trả thời gian truy cập trung bình theo ms (seek + nửa vòng quay + thời gian quét qua <code>sectors</code> sector) dưới dạng số làm tròn 2 chữ số thập phân.</p>`),
  yeuCau: [bi('Round only the final value of accessMs: <code>Math.round(x * 100) / 100</code>.', 'Chỉ làm tròn giá trị cuối của accessMs: <code>Math.round(x * 100) / 100</code>.')],
  viDu: [{ input: 'raid(5, 5, 2)', output: JSON.stringify(S.raid(5, 5, 2)), explanation: 'One disk of parity: 4 × 2 TB usable.|||Một ổ cho parity: dùng được 4 × 2 TB.' }],
  goiY: ['RAID 1 with n disks keeps ONE copy of the data: usable = size.', 'accessMs: 60000 / rpm is one rotation in ms.'],
  loiHayGap: ['Returning n × size for RAID 1.', 'Rounding before adding the terms.'],
  giaiThich: '<p>Capacity follows from how many disks hold redundancy; the access time is a three-term sum.</p>',
  khaiNiem: ['RAID', 'disk timing'],
  fn: 'raid',
  dau: "function raid(level, n, size) {\n  return { usable: 0, tolerate: 0 };\n}\nfunction accessMs(rpm, seekMs, sectorsPerTrack, sectors) {\n  return 0;\n}\n",
  giaiMa: dat(S.raid, 'raid') + '\nfunction accessMs(rpm, seekMs, sectorsPerTrack, sectors) {\n  var rotation = 60000 / rpm;\n  var t = seekMs + rotation / 2 + (sectors / sectorsPerTrack) * rotation;\n  return Math.round(t * 100) / 100;\n}\n',
  ref: (l, n, s) => S.raid(l, n, s),
  cases: [{ args: [0, 4, 2] }, { args: [1, 3, 4] }, { args: [5, 5, 2] }, { args: [6, 6, 2] }, { args: [10, 8, 1] }, { args: [5, 3, 10], an: true }, { args: [6, 4, 1], an: true }],
  kiemThem: [
    { moTa: bi('accessMs 7200 rpm', 'accessMs 7200 vòng/phút'), goi: 'accessMs(7200, 5, 400, 8)', mongDoi: Math.round(t3(7200) * 100) / 100 },
    { moTa: bi('accessMs 15000 rpm', 'accessMs 15000 vòng/phút'), goi: 'accessMs(15000, 5, 400, 8)', mongDoi: Math.round(t3(15000) * 100) / 100, an: true },
    { moTa: bi('accessMs other disk', 'accessMs đĩa khác'), goi: 'accessMs(5400, 9, 200, 1)', mongDoi: Math.round((9 + 60000 / 5400 / 2 + (1 / 200) * (60000 / 5400)) * 100) / 100, an: true },
  ],
});

export default doiDau({
  slug: 'osg202-5-1-io',
  ten: '5.1 I/O hardware & software',
  khoa: KHOA,
  baiHoc: 'osg202-5-1-io',
  de: [E1, E2, E3, E4, E5],
});
void hai;
