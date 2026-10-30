/** CEA201 · 7.1 — I/O: programmed, interrupt-driven, DMA; memory-mapped vs isolated I/O. */
import { doiDau, KHOA, bi, hai, giai, tinh, mc, q, tn, bang1, ord, r2 } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'I/O 1 — Programmed I/O, interrupts, DMA and I/O addressing',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on the three I/O techniques.</p>', '<p>Câu hỏi khái niệm về ba kỹ thuật I/O.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['In programmed (polling) I/O the processor …', 'Trong I/O lập trình (thăm dò) bộ xử lý …'], ['repeatedly tests the device status until it is ready', 'is told by the device through an interrupt when data are ready', 'never executes I/O instructions of its own', 'transfers data without any CPU involvement'], ['Busy-waiting keeps the CPU occupied for the whole transfer.', 'Chờ bận khiến CPU bị chiếm suốt lần truyền.']),
    q('c2', ['With interrupt-driven I/O the processor …', 'Với I/O điều khiển bằng ngắt, bộ xử lý …'], ['can do other work while the device is busy, but still moves every word', 'moves no data at all, because the device writes into memory itself', 'waits in a loop on the status register until the device is ready', 'needs a DMA controller to move each word, and only starts the block'], ['The device interrupts when ready; the CPU still executes the transfer instructions.', 'Thiết bị ngắt khi sẵn sàng; CPU vẫn thực hiện lệnh chuyển dữ liệu.']),
    q('c3', ['DMA is best suited for …', 'DMA phù hợp nhất với …'], ['large block transfers such as disk traffic', 'slow devices such as a keyboard or a mouse', 'single bytes that arrive rarely from a sensor', 'instruction fetch from the level-1 cache'], ['The DMA controller moves blocks between device and memory and interrupts once at the end.', 'Bộ điều khiển DMA chuyển khối giữa thiết bị và bộ nhớ và chỉ ngắt một lần ở cuối.']),
    q('c4', ['In memory-mapped I/O …', 'Trong I/O ánh xạ bộ nhớ …'], ['device registers share the memory address space and use ordinary load/store', 'device registers are reached only with special IN/OUT instructions', 'I/O ports have a separate address space, selected by a special control line', 'devices cannot use interrupts, so the CPU polls their registers in a loop'], ['It removes the need for special I/O instructions but uses up memory addresses.', 'Không cần lệnh I/O riêng nhưng tiêu tốn địa chỉ bộ nhớ.']),
    q('c5', ['“Cycle stealing” by a DMA controller means …', '“Cycle stealing” của bộ điều khiển DMA nghĩa là …'], ['it takes over the bus for single memory cycles, delaying the CPU slightly', 'it borrows CPU registers for a moment, slowing the CPU slightly', 'it changes the program counter, so the CPU runs a transfer routine', 'it disables the cache during a block, forcing the CPU to use memory'], ['The CPU and DMA share the bus; DMA gets individual cycles.', 'CPU và DMA dùng chung bus; DMA chiếm từng chu kỳ.']),
  ],
  goiY: ['Polling wastes CPU; interrupts free the CPU but cost per word; DMA frees both.', 'Memory-mapped = one address space.'],
  loiHayGap: ['Believing interrupt-driven I/O removes all CPU involvement.', 'Mixing memory-mapped with isolated I/O.'],
  thuatNgu: [tn('polling', 'thăm dò'), tn('DMA', 'truy cập bộ nhớ trực tiếp'), tn('cycle stealing', 'trộm chu kỳ')],
  khaiNiem: ['programmed I/O', 'interrupt-driven I/O', 'DMA'],
});

// 1 GHz, 8 MB/s stream: per-word interrupts (4 B), per-block DMA (4 KiB)
const RATE = 8e6, F = 2e9;
const ir = RATE / 4, dm = RATE / 4096;
const M = [['Polling (CPU is busy for the whole transfer)', 100], ['Interrupt per 4-byte word, 600 cycles per interrupt', ir * 600 / F * 100], ['DMA per 4 KiB block: 500 cycles setup + 1500 cycles completion interrupt', dm * 2000 / F * 100], ['DMA per 64 KiB block: same 2000 cycles per block', RATE / 65536 * 2000 / F * 100]];
const E2 = tinh({
  tieuDe: 'I/O 2 — How much CPU does an 8 MB/s stream cost?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A device streams 8 MB/s (8 × 10⁶ bytes per second) into memory on a 2 GHz CPU. Compute the share of the CPU consumed by each technique (%, 2 decimals; polling occupies the CPU 100 % while the transfer runs).</p>', '<p>Một thiết bị đẩy dòng dữ liệu 8 MB/s (8 × 10⁶ byte/giây) vào bộ nhớ trên CPU 2 GHz. Tính phần CPU bị tiêu tốn bởi từng kỹ thuật (%, 2 chữ số; thăm dò chiếm CPU 100 % suốt lúc truyền).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['CPU share', 'Phần CPU bị dùng'], [{ ma: 'm', ten: 'Technique' }, { ma: 'c', ten: 'CPU (%)' }],
    M.map(([n, v]) => ({ o: { m: n }, a: { c: r2(v, 2) } })),
    ['events/s × cycles per event ÷ 2·10⁹: ' + M.map(([, v]) => v.toFixed(2) + '%').join(', ') + '. Interrupt per word: 2·10⁶ interrupts per second; DMA: 1953 or 122 per second.', 'số sự kiện/giây × chu kỳ mỗi sự kiện ÷ 2·10⁹: ' + M.map(([, v]) => v.toFixed(2) + '%').join(', ') + '.'])],
  goiY: ['Events per second = 8·10⁶ / bytes per event.', 'CPU share = events/s × cycles per event / 2·10⁹ cycles/s.'],
  loiHayGap: ['Using MB (10⁶) for the DMA block size.', 'Charging the setup but forgetting the completion interrupt.'],
  thuatNgu: [tn('per-word interrupt', 'ngắt cho từng từ')],
  khaiNiem: ['I/O CPU cost'],
});

const E3 = tinh({
  tieuDe: 'I/O 3 — Order a DMA read from disk',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Arrange the steps of reading a block from a disk into memory by DMA.</p>', '<p>Sắp xếp các bước đọc một khối từ đĩa vào bộ nhớ bằng DMA.</p>'),
  loai: 'order',
  cauHoi: [ord('q1', ['DMA transfer', 'Truyền bằng DMA'], ['The CPU programs the DMA controller with the device, the memory address, the direction and the byte count', 'The CPU continues with other work', 'The DMA controller requests the bus and moves the words between the device and memory, one cycle at a time', 'The DMA controller decrements its count until it reaches zero', 'The DMA controller raises one interrupt to tell the CPU the transfer is complete'], ['The CPU is involved only at the start and at the end.', 'CPU chỉ tham gia ở đầu và cuối.'], 1)],
  goiY: ['Setup first, interrupt last.', 'The CPU is free in between.'],
  loiHayGap: ['Placing the interrupt before the last word is moved.', 'Making the CPU copy every word.'],
  thuatNgu: [tn('DMA controller', 'bộ điều khiển DMA')],
  khaiNiem: ['DMA'],
});

const REG = [[0x0000, 'RAM'], [0xBFFF, 'RAM'], [0xC000, 'ROM'], [0xEF00, 'ROM'], [0xF000, 'I/O'], [0xFF10, 'I/O']];
const region = (a) => (a <= 0xBFFF ? 'RAM' : a <= 0xEFFF ? 'ROM' : 'I/O');
const E4 = tinh({
  tieuDe: 'I/O 4 — Memory-mapped I/O: read the address map',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>A 16-bit system uses memory-mapped I/O. Map: <code>0000–BFFF</code> RAM, <code>C000–EFFF</code> ROM, <code>F000–FFFF</code> device registers. For each address say which region it belongs to; then give how many bytes of address space are consumed by ROM + I/O.</p>', '<p>Hệ 16 bit dùng I/O ánh xạ bộ nhớ. Bản đồ: <code>0000–BFFF</code> RAM, <code>C000–EFFF</code> ROM, <code>F000–FFFF</code> thanh ghi thiết bị. Với mỗi địa chỉ cho biết thuộc vùng nào; rồi cho số byte không gian địa chỉ bị ROM + I/O chiếm.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Region of an address', 'Vùng của địa chỉ'], [{ ma: 'a', ten: 'Address' }, { ma: 'r', ten: 'Region', luaChon: ['RAM', 'ROM', 'I/O'] }],
    REG.map(([a]) => ({ o: { a: '0x' + a.toString(16).toUpperCase().padStart(4, '0') }, a: { r: region(a) } })),
    ['0000–BFFF RAM; C000–EFFF ROM; F000–FFFF I/O. Results: ' + REG.map(([a]) => region(a)).join(', ') + '.', 'Kết quả: ' + REG.map(([a]) => region(a)).join(', ') + '.']),
  bang1('b2', ['Address space consumed', 'Không gian địa chỉ bị chiếm'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Bytes' }], [{ o: { k: 'ROM + I/O (bytes)' }, a: { v: [String(0x10000 - 0xC000), '16384', '16 KiB'] } }], ['0xC000–0xFFFF = 16384 bytes = 16 KiB (a quarter of the 64 KiB space).', '0xC000–0xFFFF = 16384 byte = 16 KiB (một phần tư không gian 64 KiB).'])],
  goiY: ['Compare the address with the region limits (hex).', 'The space is 2¹⁶ = 65,536 bytes.'],
  loiHayGap: ['Treating 0xBFFF as ROM (it is the last RAM byte).', 'Forgetting that I/O registers use up memory addresses.'],
  thuatNgu: [tn('memory-mapped I/O', 'I/O ánh xạ bộ nhớ')],
  khaiNiem: ['memory-mapped I/O'],
});

export default doiDau({
  slug: 'cea201-7-1-io-techniques',
  ten: '7.1 I/O modules & three techniques',
  khoa: KHOA,
  baiHoc: 'cea201-7-1-io-techniques',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc;
