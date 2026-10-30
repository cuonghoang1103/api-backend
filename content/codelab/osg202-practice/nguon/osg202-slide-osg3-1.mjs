/**
 * OSG202 · 3.0 — Contiguous memory allocation: first / best / worst / next fit, fragmentation, buddy system.
 * (module gắn vào bài slide 3.A — nơi dạy swapping, lỗ trống và phân mảnh)
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const HOLES = [100, 500, 200, 300, 600];
const REQ = [212, 417, 112, 426];
const lab = (i) => (i < 0 ? 'wait' : `H${i + 1}`);
const ST = ['first', 'best', 'worst', 'next'];
const NAME = { first: 'First fit', best: 'Best fit', worst: 'Worst fit', next: 'Next fit' };
const kq = Object.fromEntries(ST.map((s) => [s, S.fit(s, HOLES, REQ)]));

const E1 = tinh({
  tieuDe: 'Allocation 1 — Where does each request go? First, best, worst, next fit',
  doKho: 'EASY', phut: 12,
  moTa: bi(`<p>Free holes in memory, in address order (KB): ${HOLES.map((h, i) => `H${i + 1}=${h}`).join(', ')}. Processes request ${REQ.join(', ')} KB in this order and keep their memory. A hole is split (the remainder stays in place). For each strategy give the hole that serves each request (<code>H1…H5</code>) or <code>wait</code> if no hole is large enough. Next fit starts searching at the hole used last (the first search starts at H1).</p>`,
    `<p>Các lỗ trống theo thứ tự địa chỉ (KB): ${HOLES.map((h, i) => `H${i + 1}=${h}`).join(', ')}. Các tiến trình yêu cầu ${REQ.join(', ')} KB theo thứ tự này và giữ bộ nhớ. Lỗ được chia nhỏ (phần dư ở lại tại chỗ). Với mỗi chiến lược cho lỗ phục vụ từng yêu cầu (<code>H1…H5</code>) hoặc <code>wait</code> nếu không lỗ nào đủ lớn. Next fit tìm tiếp từ lỗ vừa dùng (lần đầu bắt đầu từ H1).</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Hole used', 'Lỗ được dùng'),
    cot: [{ ma: 'r', ten: 'Request' }, ...ST.map((s) => ({ ma: s, ten: NAME[s] }))],
    hang: REQ.map((r, i) => ({ ma: `r${i}`, o: { r: `${r} KB` } })),
    dapAn: Object.fromEntries(REQ.flatMap((_, i) => ST.map((s) => [`r${i}.${s}`, lab(kq[s].place[i])]))),
    giaiThich: giai(ST.map((s) => `${NAME[s]}: ${kq[s].place.map(lab).join(', ')} (holes left ${kq[s].holes.join('/')})`).join('; ') + '. Best fit is the only strategy that places all four requests: it keeps the big holes whole for the big requests.', ST.map((s) => `${NAME[s]}: ${kq[s].place.map(lab).join(', ')} (còn ${kq[s].holes.join('/')})`).join('; ') + '. Chỉ best fit xếp được cả bốn yêu cầu: nó giữ nguyên các lỗ lớn cho yêu cầu lớn.'),
  }],
  goiY: ['After each placement update the remaining size of the hole before handling the next request.', 'First fit: first big-enough hole by address. Best: smallest big-enough hole. Worst: largest hole.'],
  loiHayGap: ['Forgetting that a hole shrinks after being used.', 'Choosing the best-fit hole by LEAST leftover but among all holes (including too small ones).'],
  giaiThich: '<p>' + ST.map((s) => `${NAME[s]}: ${kq[s].place.map(lab).join(' ')}`).join(' · ') + '</p>',
  thuatNgu: [tn('hole', 'lỗ trống: vùng nhớ rảnh liên tục'), tn('best fit', 'lỗ nhỏ nhất đủ lớn'), tn('worst fit', 'lỗ lớn nhất')],
  khaiNiem: ['contiguous allocation', 'first fit', 'best fit', 'worst fit'],
});

const PS = 2048;
const procs = [72766, 5000, 2048, 1, 10000];
const E2 = tinh({
  tieuDe: 'Allocation 2 — Internal fragmentation of paged processes',
  doKho: 'EASY', phut: 8,
  moTa: bi(`<p>Page size = ${PS} bytes. For each process give the number of pages it occupies and the bytes lost to internal fragmentation.</p>`, `<p>Kích thước trang = ${PS} byte. Với mỗi tiến trình cho số trang nó chiếm và số byte phí do phân mảnh trong.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Pages and waste', 'Số trang và phần phí'),
    cot: [{ ma: 'p', ten: 'Process size (bytes)' }, { ma: 'n', ten: 'Pages' }, { ma: 'w', ten: 'Wasted bytes' }],
    hang: procs.map((p) => ({ ma: `p${p}`, o: { p: String(p) } })),
    dapAn: Object.fromEntries(procs.flatMap((p) => { const n = Math.ceil(p / PS); return [[`p${p}.n`, String(n)], [`p${p}.w`, String(n * PS - p)]]; })),
    giaiThich: giai(procs.map((p) => `${p}: ${Math.ceil(p / PS)} pages, waste ${Math.ceil(p / PS) * PS - p}`).join('; ') + '. A size that is an exact multiple of the page wastes nothing; 1 byte wastes 2047.', procs.map((p) => `${p}: ${Math.ceil(p / PS)} trang, phí ${Math.ceil(p / PS) * PS - p}`).join('; ') + '. Kích thước là bội số đúng của trang thì không phí; 1 byte phí 2047.'),
  }],
  goiY: ['pages = ⌈size / page size⌉.', 'waste = pages × page size − size.'],
  loiHayGap: ['Rounding down instead of up.', 'Giving size mod page size as the waste (that is the used part of the last page).'],
  giaiThich: '<p>' + procs.map((p) => `${Math.ceil(p / PS)}/${Math.ceil(p / PS) * PS - p}`).join(' · ') + '</p>',
  thuatNgu: [tn('internal fragmentation', 'phân mảnh trong')],
  khaiNiem: ['internal fragmentation'],
});

const pow2 = (n) => 2 ** Math.ceil(Math.log2(n));
const bud = [70, 35, 80, 130, 8, 256];
const E3 = tinh({
  tieuDe: 'Allocation 3 — The buddy system: block sizes',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>A buddy allocator manages 1024 KB and only hands out blocks whose size is a power of two (minimum 8 KB). Each request is rounded UP to the next power of two. For every request give the block size allocated and the internal waste in KB.</p>', '<p>Bộ cấp phát buddy quản lý 1024 KB và chỉ cấp khối có kích thước luỹ thừa của hai (tối thiểu 8 KB). Mỗi yêu cầu được làm tròn LÊN luỹ thừa hai kế tiếp. Với mỗi yêu cầu cho kích thước khối được cấp và phần phí trong theo KB.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Buddy blocks', 'Khối buddy'),
    cot: [{ ma: 'r', ten: 'Request (KB)' }, { ma: 'b', ten: 'Block (KB)' }, { ma: 'w', ten: 'Waste (KB)' }],
    hang: bud.map((r) => ({ ma: `r${r}`, o: { r: String(r) } })),
    dapAn: Object.fromEntries(bud.flatMap((r) => { const b = Math.max(8, pow2(r)); return [[`r${r}.b`, String(b)], [`r${r}.w`, String(b - r)]]; })),
    giaiThich: giai(bud.map((r) => `${r} → ${Math.max(8, pow2(r))} (waste ${Math.max(8, pow2(r)) - r})`).join('; ') + '. Buddies make merging free blocks easy (flip one address bit) at the cost of up to 50% internal waste.', bud.map((r) => `${r} → ${Math.max(8, pow2(r))} (phí ${Math.max(8, pow2(r)) - r})`).join('; ') + '. Buddy giúp gộp khối rảnh dễ (đổi một bit địa chỉ) nhưng phí trong tới gần 50%.'),
  }],
  goiY: ['Next power of two ≥ request: 64, 128, 256, 512…', 'A request of exactly 256 gets 256 — no waste.'],
  loiHayGap: ['Rounding to the nearest power of two (it must be rounded UP).', 'Computing waste against the block above.'],
  giaiThich: '<p>' + bud.map((r) => Math.max(8, pow2(r))).join(' · ') + '</p>',
  thuatNgu: [tn('buddy system', 'hệ thống bạn bè: chia đôi/gộp đôi khối theo luỹ thừa 2')],
  khaiNiem: ['buddy system'],
});

const E4 = tinh({
  tieuDe: 'Allocation 4 — Swapping, base/limit, compaction',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five questions on contiguous memory management.</p>', '<p>Năm câu về quản lý bộ nhớ liên tục.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['With a base register = 40000 and a limit register = 12000, a process issues logical address 11999. Where does it go?', 'Thanh ghi nền = 40000, thanh ghi giới hạn = 12000, tiến trình phát địa chỉ logic 11999. Điều gì xảy ra?'], [['a', 'Physical address 51999'], ['b', 'Protection fault (beyond the limit)'], ['c', 'Physical address 11999'], ['d', 'Physical address 52000']], 'a', ['11999 < 12000 passes the limit check; physical = 40000 + 11999 = 51999.', '11999 < 12000 qua kiểm tra giới hạn; vật lý = 40000 + 11999 = 51999.']),
    mc('c2', ['The same process now issues logical address 12000. What happens?', 'Cũng tiến trình đó phát địa chỉ logic 12000. Điều gì xảy ra?'], [['a', 'Protection fault: 12000 is not below the limit'], ['b', 'Physical address 52000: base + 12000 is used'], ['c', 'The limit is raised: the OS grows the process'], ['d', 'It wraps to 0: 12000 mod the limit is used']], 'a', ['Valid logical addresses are 0 … limit−1.', 'Địa chỉ logic hợp lệ là 0 … limit−1.']),
    mc('c3', ['External fragmentation means …', 'Phân mảnh ngoài nghĩa là …'], [['a', 'enough total free memory exists but not in one contiguous block'], ['b', 'wasted space inside an allocated block'], ['c', 'memory is full'], ['d', 'pages are scattered on disk']], 'a', ['Typical for variable partitions (first/best fit); cured by compaction or by paging.', 'Điển hình của phân vùng biến đổi; chữa bằng nén bộ nhớ (compaction) hoặc phân trang.']),
    mc('c4', ['Compaction requires that processes are …', 'Compaction đòi hỏi tiến trình phải …'], [['a', 'relocatable at run time (dynamic relocation)'], ['b', 'smaller than the page size'], ['c', 'single-threaded'], ['d', 'statically linked']], 'a', ['Moving a process changes its physical address; this only works if addresses are bound at execution time through base registers.', 'Di chuyển tiến trình đổi địa chỉ vật lý; chỉ được khi địa chỉ gắn lúc thực thi qua thanh ghi nền.']),
    mc('c5', ['Swapping lets the OS …', 'Swapping cho phép OS …'], [['a', 'move a whole process between RAM and disk so more processes than RAM can hold are managed'], ['b', 'swap two pages inside one process in RAM so that the frames in use stay contiguous'], ['c', 'replace the TLB with a table on disk that lists the location of each process'], ['d', 'avoid page tables by keeping every process contiguous in RAM with one base and one limit register']], 'a', ['Swapping works with whole processes; paging with fixed-size pages.', 'Swapping làm việc với cả tiến trình; phân trang với trang kích thước cố định.']),
  ],
  goiY: ['Valid logical range: 0 … limit − 1.', 'Fragmentation “outside” blocks is external.'],
  loiHayGap: ['Treating address = limit as valid (off by one).', 'Mixing internal and external fragmentation.'],
  thuatNgu: [tn('base register', 'thanh ghi nền'), tn('limit register', 'thanh ghi giới hạn'), tn('compaction', 'nén bộ nhớ: dồn các lỗ lại')],
  khaiNiem: ['base and limit', 'external fragmentation', 'compaction', 'swapping'],
});

const E5 = jsDe({
  tieuDe: 'Allocation 5 — Write a hole allocator',
  doKho: 'HARD', phut: 20,
  moTa: bi(`<p>Write <code>allocate(strategy, holes, requests)</code>. <code>holes</code> is the array of free-hole sizes in address order; <code>strategy</code> is <code>'first'</code>, <code>'best'</code>, <code>'worst'</code> or <code>'next'</code> (next fit continues from the hole used by the previous request; the first search starts at index 0). Requests are served in order; the chosen hole shrinks by the request size. Return <code>{ place, holes }</code>: <code>place[i]</code> is the 0-based index of the hole used by request i, or <code>-1</code> when no hole is large enough; <code>holes</code> is the array of remaining sizes. Best fit breaks ties by lowest index; worst fit too.</p>`,
    `<p>Viết <code>allocate(strategy, holes, requests)</code>. <code>holes</code> là mảng kích thước lỗ trống theo thứ tự địa chỉ; <code>strategy</code> là <code>'first'</code>, <code>'best'</code>, <code>'worst'</code> hoặc <code>'next'</code> (next fit tìm tiếp từ lỗ mà yêu cầu trước đã dùng; lần tìm đầu bắt đầu ở chỉ số 0). Yêu cầu được phục vụ lần lượt; lỗ được chọn nhỏ đi đúng bằng kích thước yêu cầu. Trả <code>{ place, holes }</code>: <code>place[i]</code> là chỉ số (từ 0) của lỗ dùng cho yêu cầu i, hoặc <code>-1</code> nếu không lỗ nào đủ lớn; <code>holes</code> là mảng kích thước còn lại. Best fit và worst fit hoà thì chọn chỉ số nhỏ nhất.</p>`),
  yeuCau: [bi('Do not modify the input array.', 'Không sửa mảng đầu vào.')],
  viDu: [{ input: "allocate('first', [100,500,200,300,600], [212,417,112,426])", output: JSON.stringify(S.fit('first', HOLES, REQ)), explanation: 'Textbook example: the 426 KB request must wait under first fit.|||Ví dụ giáo trình: yêu cầu 426 KB phải chờ ở first fit.' }],
  goiY: ['Write one helper that returns the index of the chosen hole, differing only in the comparison.', 'For next fit remember the index of the last used hole and scan circularly.'],
  loiHayGap: ['Updating the original holes array (mutating the input).', 'Starting next fit at hole 0 for every request.'],
  giaiThich: '<p>One loop over the requests; the strategies differ only in which candidate hole is picked.</p>',
  khaiNiem: ['first fit', 'best fit', 'worst fit', 'next fit'],
  fn: 'allocate',
  dau: "function allocate(strategy, holes, requests) {\n  return { place: [], holes: holes.slice() };\n}\n",
  giaiMa: '// The strategy only changes how the candidate hole is chosen.\n' + dat(S.fit, 'allocate'),
  ref: (s, h, r) => S.fit(s, h, r),
  cases: [
    { args: ['first', HOLES, REQ] }, { args: ['best', HOLES, REQ] }, { args: ['worst', HOLES, REQ] }, { args: ['next', HOLES, REQ] },
    { args: ['next', [50, 50, 50], [20, 20, 20, 20, 20, 20]], an: true }, { args: ['best', [30, 10, 10, 30], [10, 10, 10]], an: true },
    { args: ['worst', [30, 10, 10, 30], [10, 10, 10]], an: true }, { args: ['first', [5], [6, 5]], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-slide-osg3-1',
  ten: '3.0 Memory allocation: swapping, holes & fit strategies',
  khoa: KHOA,
  baiHoc: 'osg202-slide-osg3-1',
  de: [E1, E2, E3, E4, E5],
});
void hai; void tab;
