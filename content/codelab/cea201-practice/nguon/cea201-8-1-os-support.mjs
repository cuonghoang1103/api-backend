/** CEA201 · 8.1 — OS support: scheduling, paging, virtual memory, TLB. Số do S.pageFaults tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'OS support 1 — Multiprogramming, paging and virtual memory: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on the hardware support an operating system needs.</p>', '<p>Câu hỏi khái niệm về phần cứng hỗ trợ hệ điều hành.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Why does multiprogramming raise CPU utilization?', 'Vì sao đa chương trình làm tăng mức sử dụng CPU?'], ['While one program waits for I/O the CPU runs another', 'It makes each program faster', 'It removes the need for memory', 'It doubles the clock rate'], ['I/O waits are long compared with CPU bursts; overlapping them keeps the CPU busy.', 'Chờ I/O rất dài so với đợt tính toán; chồng chúng lên nhau giữ CPU bận.']),
    q('c2', ['In paging, a virtual address is divided into …', 'Trong phân trang, địa chỉ ảo được chia thành …'], ['page number and offset', 'tag and index', 'segment and base', 'opcode and operand'], ['The page number indexes the page table; the offset is copied unchanged.', 'Số trang tra bảng trang; offset được chép nguyên.']),
    q('c3', ['A page fault occurs when …', 'Lỗi trang xảy ra khi …'], ['the referenced page is not present in main memory', 'the TLB is full', 'the disk is busy', 'the cache misses'], ['The OS must bring the page from disk, a very expensive event.', 'HĐH phải mang trang từ đĩa lên, một sự kiện rất đắt.']),
    q('c4', ['The TLB is …', 'TLB là …'], ['a small cache of recent page-table entries', 'a part of the disk controller', 'the page table itself', 'a register holding the PC'], ['A TLB hit saves the extra memory access needed to read the page table.', 'TLB hit tránh được một lần truy cập bộ nhớ để đọc bảng trang.']),
    q('c5', ['Thrashing happens when …', 'Thrashing xảy ra khi …'], ['processes spend more time paging than executing', 'the cache is too big', 'the TLB is empty', 'the bus is idle'], ['Too many processes for the available frames cause constant page faults.', 'Quá nhiều tiến trình so với số khung gây lỗi trang liên tục.']),
    q('c6', ['Paging removes which problem of contiguous allocation?', 'Phân trang loại bỏ vấn đề nào của cấp phát liên tục?'], ['External fragmentation', 'Internal fragmentation completely', 'The need for an MMU', 'Address translation'], ['Fixed-size frames can be placed anywhere; only the last page of a process wastes space internally.', 'Khung kích thước cố định đặt ở đâu cũng được; chỉ trang cuối của tiến trình lãng phí bên trong.']),
  ],
  goiY: ['Page number translates; offset does not.', 'TLB = cache for the page table.'],
  loiHayGap: ['Confusing a cache miss with a page fault.', 'Thinking paging eliminates all fragmentation.'],
  thuatNgu: [tn('page fault', 'lỗi trang'), tn('thrashing', 'trì trệ do đảo trang')],
  khaiNiem: ['paging', 'virtual memory', 'TLB'],
});

const VM = [[32, 4096, 30, 4], [32, 8192, 28, 4], [48, 4096, 32, 8], [16, 1024, 20, 2]];
const E2 = tinh({
  tieuDe: 'OS support 2 — Size the page table',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For a virtual address of <b>V</b> bits, page size <b>P</b> bytes, <b>M</b> physical address bits and a page-table entry of <b>E</b> bytes (single-level table): give the <b>offset bits</b>, the <b>virtual page number bits</b>, the <b>number of frames</b> (as a power of two, 2^k) and the <b>page-table size</b> (as a power of two in bytes, 2^k).</p>', '<p>Địa chỉ ảo <b>V</b> bit, trang <b>P</b> byte, địa chỉ vật lý <b>M</b> bit và mục bảng trang <b>E</b> byte (bảng một cấp): cho <b>số bit offset</b>, <b>số bit số trang ảo</b>, <b>số khung</b> (luỹ thừa 2, 2^k) và <b>kích thước bảng trang</b> (luỹ thừa 2 theo byte, 2^k).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Page table sizing', 'Kích thước bảng trang'], [{ ma: 'g', ten: 'V, P, M, E' }, { ma: 'o', ten: 'Offset bits' }, { ma: 'v', ten: 'VPN bits' }, { ma: 'f', ten: 'Frames' }, { ma: 't', ten: 'Table size (bytes)' }],
    VM.map(([V, P, M, E]) => { const o = Math.log2(P), v = V - o; return { o: { g: `V = ${V}, P = ${P} B, M = ${M}, E = ${E} B` }, a: { o: String(o), v: String(v), f: [`2^${M - o}`, String(2 ** (M - o))], t: [`2^${v + Math.log2(E)}`, String(2 ** (v + Math.log2(E)))] } }; }),
    [VM.map(([V, P, M, E]) => { const o = Math.log2(P), v = V - o; return `V=${V}, P=${P}: offset ${o}, VPN ${v}, frames 2^${M - o}, table 2^${v}×${E} = 2^${v + Math.log2(E)} B`; }).join('; ') + '.', VM.map(([V, P, M, E]) => { const o = Math.log2(P), v = V - o; return `offset ${o}, VPN ${v}, khung 2^${M - o}, bảng 2^${v + Math.log2(E)} B`; }).join('; ') + '.'])],
  goiY: ['offset = log₂(P); VPN = V − offset; frames = 2^(M − offset).', 'Table size = number of virtual pages × entry size.'],
  loiHayGap: ['Using M instead of V for the number of pages.', 'Forgetting the entry size E.'],
  thuatNgu: [tn('VPN (virtual page number)', 'số trang ảo'), tn('PTE', 'mục bảng trang')],
  khaiNiem: ['page table size'],
});

const PS = 1024, PT = { 0: 5, 1: 2, 2: null, 3: 7, 4: null, 5: 0 };
const VA = [100, 1030, 2100, 3071, 4200, 5120, 6144, 5000];
const tr = (a) => { const p = Math.floor(a / PS), f = PT[p]; return f === undefined || f === null ? 'Fault' : String(f * PS + (a % PS)); };
const E3 = tinh({
  tieuDe: 'OS support 3 — Translate virtual addresses',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Page size is ${PS} bytes. The page table (page → frame) is: ${Object.entries(PT).map(([p, f]) => `${p} → ${f === null ? '—' : f}`).join(', ')} (— = not in memory, pages ≥ 6 are outside the address space). Translate each decimal virtual address to a decimal physical address, or answer <b>Fault</b> if the page is absent or does not exist.</p>`, `<p>Trang rộng ${PS} byte. Bảng trang (trang → khung): ${Object.entries(PT).map(([p, f]) => `${p} → ${f === null ? '—' : f}`).join(', ')} (— = không có trong bộ nhớ, trang ≥ 6 nằm ngoài không gian địa chỉ). Dịch từng địa chỉ ảo thập phân sang địa chỉ vật lý thập phân, hoặc trả lời <b>Fault</b> nếu trang vắng mặt hoặc không tồn tại.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Address translation', 'Dịch địa chỉ'], [{ ma: 'v', ten: 'Virtual address' }, { ma: 'p', ten: 'Physical address / Fault' }],
    VA.map((a) => ({ o: { v: String(a) }, a: { p: [tr(a), tr(a).toLowerCase()] } })),
    [VA.map((a) => `${a}: page ${Math.floor(a / PS)}, offset ${a % PS} → ${tr(a)}`).join('; ') + '. physical = frame × 1024 + offset.', VA.map((a) => `${a}: trang ${Math.floor(a / PS)}, offset ${a % PS} → ${tr(a)}`).join('; ') + '. vật lý = khung × 1024 + offset.'])],
  goiY: ['page = address div 1024, offset = address mod 1024.', 'Check the page table before multiplying.'],
  loiHayGap: ['Adding the offset to the page number instead of to frame × page size.', 'Translating a page that is not present.'],
  thuatNgu: [tn('physical address', 'địa chỉ vật lý')],
  khaiNiem: ['address translation'],
});

const RS = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2, 1, 6, 3, 2, 1];
const FR = [['FIFO', 3], ['LRU', 3], ['FIFO', 4], ['LRU', 4]];
const E4 = tinh({
  tieuDe: 'OS support 4 — Page faults: FIFO versus LRU with 3 and 4 frames',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>Reference string: <code>${RS.join(' ')}</code>. Memory starts empty (the first loads count as faults). Give the number of page faults.</p>`, `<p>Chuỗi tham chiếu: <code>${RS.join(' ')}</code>. Bộ nhớ ban đầu rỗng (các lần nạp đầu tính là lỗi). Cho số lỗi trang.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Page faults', 'Số lỗi trang'], [{ ma: 'a', ten: 'Algorithm, frames' }, { ma: 'f', ten: 'Faults' }],
    FR.map(([a, n]) => ({ o: { a: `${a}, ${n} frames` }, a: { f: String(S.pageFaults(a, RS, n)) } })),
    [FR.map(([a, n]) => `${a}/${n}: ${S.pageFaults(a, RS, n)}`).join('; ') + '. More frames never hurt LRU; FIFO can behave oddly (Belady’s anomaly).', FR.map(([a, n]) => `${a}/${n}: ${S.pageFaults(a, RS, n)}`).join('; ') + '.'])],
  goiY: ['Write the frame contents after each reference; FIFO ignores hits, LRU renews them.', 'Count the first fills as faults.'],
  loiHayGap: ['Moving a page to the back of the FIFO queue on a hit.', 'Not counting the initial faults.'],
  thuatNgu: [tn('Belady’s anomaly', 'nghịch lý Belady')],
  khaiNiem: ['page replacement'],
});

const TL = [[0.80, 20, 100, 0], [0.95, 20, 100, 0], [0.98, 10, 80, 0], [0.90, 20, 100, 0.001]];
const eat = (h, tt, tm) => h * (tt + tm) + (1 - h) * (tt + 2 * tm);
const E5 = tinh({
  tieuDe: 'OS support 5 — Effective access time with a TLB and page faults',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A TLB lookup takes <b>t</b> ns, a memory access <b>m</b> ns. With a one-level page table a TLB hit needs 1 memory access (the data), a TLB miss needs 2. EAT = h·(t + m) + (1 − h)·(t + 2m). Give the EAT (ns, 2 decimals). In the last row a page fault happens with probability p = 0.001 per reference and costs 8,000,000 ns: EAT_total = (1 − p) × EAT + p × 8,000,000.</p>', '<p>Tra TLB mất <b>t</b> ns, một lần truy cập bộ nhớ <b>m</b> ns. Với bảng trang một cấp, TLB hit cần 1 truy cập bộ nhớ (dữ liệu), TLB miss cần 2. EAT = h·(t + m) + (1 − h)·(t + 2m). Cho EAT (ns, 2 chữ số). Ở dòng cuối, lỗi trang xảy ra với xác suất p = 0,001 mỗi tham chiếu và tốn 8.000.000 ns: EAT_tổng = (1 − p) × EAT + p × 8.000.000.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['EAT', 'EAT'], [{ ma: 'p', ten: 'Parameters' }, { ma: 'e', ten: 'EAT (ns)' }],
    TL.map(([h, t, m, p]) => ({ o: { p: `h = ${h}, t = ${t} ns, m = ${m} ns${p ? ', p = ' + p : ''}` }, a: { e: r2(p ? (1 - p) * eat(h, t, m) + p * 8e6 : eat(h, t, m), 2) } })),
    [TL.map(([h, t, m, p]) => `h=${h}: ${(p ? (1 - p) * eat(h, t, m) + p * 8e6 : eat(h, t, m)).toFixed(2)} ns`).join('; ') + '. Even a 0.1% fault rate dominates: disk is ~10⁵ times slower than memory.', TL.map(([h, t, m, p]) => `h=${h}: ${(p ? (1 - p) * eat(h, t, m) + p * 8e6 : eat(h, t, m)).toFixed(2)} ns`).join('; ') + '.'])],
  goiY: ['Hit: t + m. Miss: t + 2m (page-table walk plus data).', 'Add the fault term last.'],
  loiHayGap: ['Charging 2 memory accesses on a hit.', 'Forgetting the TLB lookup time on a miss.'],
  thuatNgu: [tn('EAT', 'thời gian truy cập hiệu dụng')],
  khaiNiem: ['TLB', 'effective access time'],
});

const translate = function translate(table, pageSize, vaddrs) {
  var out = [];
  for (var i = 0; i < vaddrs.length; i++) {
    var page = Math.floor(vaddrs[i] / pageSize), frame = table[page];
    out.push(frame === undefined || frame === null ? -1 : frame * pageSize + (vaddrs[i] % pageSize));
  }
  return out;
};
const E6 = jsDe({
  tieuDe: 'OS support 6 — Write the MMU: virtual to physical',
  doKho: 'HARD', phut: 16,
  moTa: bi('<p>Write <code>translate(table, pageSize, vaddrs)</code>. <code>table</code> is an array: <code>table[p]</code> is the frame of page <code>p</code>, or <code>null</code> if the page is not in memory; pages beyond the array do not exist. Return an array with the physical address of every virtual address, or <code>-1</code> for a page fault / invalid page.</p>', '<p>Viết <code>translate(table, pageSize, vaddrs)</code>. <code>table</code> là mảng: <code>table[p]</code> là khung của trang <code>p</code>, hoặc <code>null</code> nếu trang không có trong bộ nhớ; trang vượt quá mảng thì không tồn tại. Trả mảng địa chỉ vật lý của từng địa chỉ ảo, hoặc <code>-1</code> nếu lỗi trang / trang không hợp lệ.</p>'),
  viDu: [{ input: 'translate([5, null, 2], 1024, [100, 1500, 2060, 4000])', output: JSON.stringify(translate([5, null, 2], 1024, [100, 1500, 2060, 4000])), explanation: 'Page 0 → frame 5; page 1 absent; page 2 → frame 2; page 3 does not exist.|||Trang 0 → khung 5; trang 1 vắng; trang 2 → khung 2; trang 3 không tồn tại.' }],
  goiY: ['page = Math.floor(addr / pageSize); offset = addr % pageSize.', 'A frame number of 0 is valid — test for null/undefined, not for falsy.', 'physical = frame × pageSize + offset.'],
  loiHayGap: ['Treating frame 0 as “absent”.', 'Reading table[page] beyond the array and using undefined as a frame.'],
  giaiThich: '<p>The MMU splits the address, looks the page up and either concatenates frame and offset or raises a fault; frame 0 is a legal frame.</p>',
  khaiNiem: ['address translation', 'page fault'],
  fn: 'translate',
  dau: 'function translate(table, pageSize, vaddrs) {\n  return [];\n}\n',
  giaiMa: dat(translate, 'translate'),
  ref: translate,
  cases: [{ args: [[5, null, 2], 1024, [100, 1500, 2060, 4000]] }, { args: [[0, 1], 4096, [0, 4095, 4096, 8191, 8192]] }, { args: [[], 512, [0]] }, { args: [[3, 7, null, 1, 0], 256, [1000, 513, 700, 255, 1279, 1280]], an: true }, { args: [[null, null], 100, [5, 150]], an: true }, { args: [[9], 8, []], an: true }],
});

export default doiDau({
  slug: 'cea201-8-1-os-support',
  ten: '8.1 Scheduling, memory management & virtual memory',
  khoa: KHOA,
  baiHoc: 'cea201-8-1-os-support',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void giai; void mc;
