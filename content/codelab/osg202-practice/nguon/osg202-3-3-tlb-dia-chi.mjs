/**
 * OSG202 · 3.3 — Address translation: page tables, multi-level split, TLB and effective access time.
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, tn, xoay } from './_os.mjs';

const STEPS = ['CPU issues a virtual address', 'MMU looks the page number up in the TLB', 'TLB miss: the MMU walks the page table in memory', 'The PTE is valid: the frame number is read and the TLB entry is added', 'Physical address = frame × page size + offset; the memory access is made'];
const E1 = tinh({
  tieuDe: 'Address translation 1 — The path of one memory access (TLB miss, page present)',
  doKho: 'EASY', phut: 7,
  moTa: bi('<p>Order the steps of a memory reference when the translation is NOT in the TLB but the page is in memory.</p>', '<p>Sắp xếp các bước của một lần truy cập bộ nhớ khi bản dịch KHÔNG có trong TLB nhưng trang đã nằm trong bộ nhớ.</p>'),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('TLB miss, valid PTE', 'TLB trượt, PTE hợp lệ'),
    muc: xoay(STEPS.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), 2), dapAn: STEPS.map((_, i) => `s${i + 1}`),
    giaiThich: giai('TLB first (hit = no page-table walk); on a miss the page table in RAM is consulted (extra memory access); the entry is cached in the TLB; finally the real access happens. A hit skips steps 3–4; an invalid PTE would raise a page fault instead of step 4.', 'Tra TLB trước (hit = khỏi duyệt bảng trang); trượt thì tra bảng trang trong RAM (thêm một lần truy cập bộ nhớ); nạp mục vào TLB; cuối cùng mới truy cập thật. Hit bỏ qua bước 3–4; PTE không hợp lệ thì gây lỗi trang thay vì bước 4.'),
  }],
  goiY: ['The TLB is a cache of recent translations: always the first stop.', 'The data access itself comes last.'],
  loiHayGap: ['Reading the page table before looking at the TLB.', 'Forgetting that a miss costs an extra memory access.'],
  giaiThich: '<p>issue → TLB → walk → PTE valid + TLB fill → physical access.</p>',
  thuatNgu: [tn('TLB', 'bộ đệm dịch địa chỉ (translation lookaside buffer)'), tn('page-table walk', 'duyệt bảng trang')],
  khaiNiem: ['TLB', 'address translation'],
});

/* Bài 2: EAT */
const cfg2 = [[0.80, 20, 100, 1], [0.90, 20, 100, 1], [0.98, 20, 100, 1], [0.90, 10, 100, 2], [0.95, 5, 80, 2]];
const eat = ([h, t, m, l]) => S.eat(h, t, m, l);
const E2 = tinh({
  tieuDe: 'Address translation 2 — Effective access time with a TLB',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A TLB lookup takes <b>t</b> ns, a memory access <b>m</b> ns. On a TLB hit the cost is t + m. On a miss the MMU walks an <b>L</b>-level page table (L memory accesses), then accesses the data (one more): t + L·m + m. Give the effective access time in ns for a hit ratio <b>h</b> (2 decimals).</p>', '<p>Tra TLB mất <b>t</b> ns, một lần truy cập bộ nhớ mất <b>m</b> ns. Khi TLB hit chi phí là t + m. Khi trượt, MMU duyệt bảng trang <b>L</b> cấp (L lần truy cập bộ nhớ) rồi truy cập dữ liệu (thêm một lần): t + L·m + m. Cho thời gian truy cập hiệu dụng theo ns với tỉ lệ hit <b>h</b> (2 chữ số thập phân).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('EAT (ns)', 'EAT (ns)'),
    cot: [{ ma: 'c', ten: 'Parameters' }, { ma: 'e', ten: 'EAT (ns)' }],
    hang: cfg2.map(([h, t, m, l], i) => ({ ma: `c${i}`, o: { c: `h = ${h}, t = ${t}, m = ${m}, L = ${l}` } })),
    dapAn: Object.fromEntries(cfg2.map((c, i) => [`c${i}.e`, [eat(c).toFixed(2), String(+eat(c).toFixed(2))]])),
    giaiThich: giai(cfg2.map((c, i) => `#${i + 1}: ${c[0]}×(${c[1]}+${c[2]}) + ${+(1 - c[0]).toFixed(2)}×(${c[1]}+${c[3] + 1}×${c[2]}) = ${eat(c).toFixed(2)}`).join('; ') + '.', cfg2.map((c, i) => `#${i + 1}: ${eat(c).toFixed(2)} ns`).join('; ') + '.'),
  }],
  goiY: ['EAT = h × (hit cost) + (1 − h) × (miss cost).', 'A 2-level table costs two memory reads for the walk, plus one for the data.'],
  loiHayGap: ['Charging the TLB time only on a hit.', 'Using L instead of L + 1 memory accesses on a miss (forgetting the data access).'],
  giaiThich: '<p>' + cfg2.map((c) => eat(c).toFixed(2)).join(' · ') + ' ns.</p>',
  thuatNgu: [tn('effective access time (EAT)', 'thời gian truy cập hiệu dụng'), tn('hit ratio', 'tỉ lệ trúng')],
  khaiNiem: ['EAT', 'TLB hit ratio'],
});

/* Bài 3: tách địa chỉ 2 cấp */
const split = (v, bits) => { const out = []; let rest = v; const tong = bits.reduce((a, b) => a + b, 0); let sh = tong; for (const b of bits) { sh -= b; out.push(Math.floor(v / 2 ** sh) % 2 ** b); } void rest; return out; };
const A3 = [0x00403004, 0x00001000, 0xFFFFF123, 0x12345678];
const E3 = tinh({
  tieuDe: 'Address translation 3 — Split a 32-bit address for a two-level page table (10 | 10 | 12)',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A 32-bit virtual address is split <b>10 | 10 | 12</b>: top-level index PT1, second-level index PT2 and a 12-bit offset. For each address (hexadecimal) give PT1, PT2 and the offset in DECIMAL.</p>', '<p>Địa chỉ ảo 32 bit được tách <b>10 | 10 | 12</b>: chỉ số bảng cấp 1 (PT1), chỉ số cấp 2 (PT2) và offset 12 bit. Với mỗi địa chỉ (hexa) cho PT1, PT2 và offset dạng THẬP PHÂN.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Fields', 'Các trường'),
    cot: [{ ma: 'a', ten: 'Virtual address' }, { ma: 'p1', ten: 'PT1' }, { ma: 'p2', ten: 'PT2' }, { ma: 'o', ten: 'Offset' }],
    hang: A3.map((a) => ({ ma: `a${a}`, o: { a: '0x' + a.toString(16).toUpperCase().padStart(8, '0') } })),
    dapAn: Object.fromEntries(A3.flatMap((a) => { const [x, y, z] = split(a, [10, 10, 12]); return [[`a${a}.p1`, String(x)], [`a${a}.p2`, String(y)], [`a${a}.o`, String(z)]]; })),
    giaiThich: giai(A3.map((a) => { const [x, y, z] = split(a, [10, 10, 12]); return `0x${a.toString(16).toUpperCase().padStart(8, '0')}: PT1=${x}, PT2=${y}, offset=${z}`; }).join('; ') + '. Shift right 22 for PT1, (>>12) & 0x3FF for PT2, & 0xFFF for the offset.', A3.map((a) => { const [x, y, z] = split(a, [10, 10, 12]); return `0x${a.toString(16).toUpperCase().padStart(8, '0')}: PT1=${x}, PT2=${y}, offset=${z}`; }).join('; ') + '. Dịch phải 22 bit lấy PT1, (>>12) & 0x3FF lấy PT2, & 0xFFF lấy offset.'),
  }],
  goiY: ['Convert to binary: 8 hex digits = 32 bits. Take 10 bits, then 10 bits, then 12 bits (= 3 hex digits).', 'The last 3 hex digits are exactly the offset.'],
  loiHayGap: ['Cutting the hex digits instead of the bits (10 bits are not a whole number of hex digits).', 'Giving the answers in hex when decimal is asked.'],
  giaiThich: '<p>' + A3.map((a) => split(a, [10, 10, 12]).join('/')).join(' · ') + '</p>',
  thuatNgu: [tn('two-level page table', 'bảng trang hai cấp'), tn('top-level index', 'chỉ số bảng cấp 1')],
  khaiNiem: ['multi-level paging', 'bit fields'],
});

/* Bài 4: khái niệm */
const E4 = tinh({
  tieuDe: 'Address translation 4 — TLB flushes, ASIDs, inverted page tables',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five conceptual questions about the TLB and page-table organisations.</p>', '<p>Năm câu khái niệm về TLB và cách tổ chức bảng trang.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Why must a TLB without address-space identifiers (ASIDs) be flushed on a context switch between processes?', 'Vì sao TLB không có định danh không gian địa chỉ (ASID) phải được xoá khi chuyển ngữ cảnh giữa các tiến trình?'], [['a', 'The same virtual page number maps to different frames in different processes'], ['b', 'The TLB is too small'], ['c', 'Processes share all pages'], ['d', 'The kernel needs the TLB empty']], 'a', ['Stale entries would let process B use process A’s translations. ASIDs tag entries so no flush is needed.', 'Mục cũ sẽ cho tiến trình B dùng bản dịch của A. ASID gắn nhãn mục để khỏi phải xoá.']),
    mc('c2', ['An inverted page table has one entry per …', 'Bảng trang đảo có một mục cho mỗi …'], [['a', 'physical frame'], ['b', 'virtual page'], ['c', 'process'], ['d', 'TLB entry']], 'a', ['Its size depends on physical memory, not on the virtual address space; lookups use a hash.', 'Kích thước phụ thuộc bộ nhớ vật lý chứ không phải không gian địa chỉ ảo; tra cứu dùng băm.']),
    mc('c3', ['The main advantage of a multi-level page table over a flat one is …', 'Ưu điểm chính của bảng trang nhiều cấp so với bảng phẳng là …'], [['a', 'unused parts of the address space need no second-level tables, saving memory'], ['b', 'translation is faster'], ['c', 'it removes the need for a TLB'], ['d', 'it avoids page faults']], 'a', ['Only the second-level tables that are actually used exist; the price is extra memory accesses per walk, hidden by the TLB.', 'Chỉ các bảng cấp 2 thực sự dùng mới tồn tại; cái giá là thêm lần truy cập bộ nhớ khi duyệt, được TLB che đi.']),
    mc('c4', ['A TLB miss and a page fault are …', 'TLB miss và lỗi trang là …'], [['a', 'different: a miss can be resolved from the page table; a fault means the page is not in RAM'], ['b', 'the same event'], ['c', 'both handled only by hardware'], ['d', 'both resolved by the disk']], 'a', ['TLB miss: translation not cached (cheap). Page fault: valid bit 0 → the OS must load the page (expensive, ms).', 'TLB miss: bản dịch chưa được cache (rẻ). Lỗi trang: bit hợp lệ = 0 → OS phải nạp trang (đắt, ms).']),
    mc('c5', ['Software-managed TLBs (MIPS, SPARC) mean that …', 'TLB do phần mềm quản lý (MIPS, SPARC) nghĩa là …'], [['a', 'a TLB miss traps to the OS, which loads the entry'], ['b', 'there is no TLB'], ['c', 'the TLB is in RAM'], ['d', 'page faults are impossible']], 'a', ['The OS handler walks its own page-table format, which gives freedom of data structure.', 'Trình xử lý của OS tự duyệt cấu trúc bảng trang riêng, nên tự do về cấu trúc dữ liệu.']),
  ],
  goiY: ['Same virtual address ≠ same physical page for different processes.', 'Inverted = indexed by physical frame.'],
  loiHayGap: ['Confusing a TLB miss with a page fault.', 'Thinking the multi-level table speeds up translation.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('ASID', 'mã định danh không gian địa chỉ trong mục TLB'), tn('inverted page table', 'bảng trang đảo')],
  khaiNiem: ['TLB flush', 'inverted page table', 'multi-level'],
});

/* Bài 5: HARD — split và TLB LRU */
const E5 = jsDe({
  tieuDe: 'Address translation 5 — Split an address into n fields and count TLB hits',
  doKho: 'HARD', phut: 25,
  moTa: bi(`<p>Write two functions.</p><p><code>splitAddress(addr, bits)</code>: <code>bits</code> is an array of field widths from the most significant field to the least, e.g. <code>[10, 10, 12]</code> (page-table indices then the offset). Return the array of the field values (numbers). The addresses are non-negative and below 2⁵³.</p><p><code>tlbHits(entries, pages)</code>: a fully-associative TLB with <code>entries</code> slots and LRU replacement receives the page numbers in <code>pages</code>; return the number of hits (the TLB starts empty).</p>`,
    `<p>Viết hai hàm.</p><p><code>splitAddress(addr, bits)</code>: <code>bits</code> là mảng độ rộng các trường từ trường cao nhất đến thấp nhất, ví dụ <code>[10, 10, 12]</code> (chỉ số các cấp rồi offset). Trả mảng giá trị các trường (số). Địa chỉ không âm và nhỏ hơn 2⁵³.</p><p><code>tlbHits(entries, pages)</code>: TLB kết hợp đầy đủ với <code>entries</code> ô, thay theo LRU, nhận các số trang trong <code>pages</code>; trả số lần hit (TLB bắt đầu rỗng).</p>`),
  yeuCau: [bi('Do not use 32-bit bitwise operators for wide addresses; use division and modulo.', 'Đừng dùng toán tử bit 32 bit cho địa chỉ rộng; dùng chia và lấy dư.')],
  viDu: [{ input: 'splitAddress(0x00403004, [10, 10, 12])', output: JSON.stringify(split(0x00403004, [10, 10, 12])), explanation: 'PT1 = 1, PT2 = 3, offset = 4.|||PT1 = 1, PT2 = 3, offset = 4.' }],
  goiY: ['Walk from the LAST field to the first: value % 2^bits, then divide by 2^bits.', 'LRU TLB = an array ordered by recent use; a hit moves the page to the end.'],
  loiHayGap: ['Using >> and & on addresses ≥ 2³¹ (JavaScript converts to signed 32 bits).', 'Counting a TLB insertion as a hit.'],
  giaiThich: '<p>Fields are peeled off the low end with <code>%</code> and <code>Math.floor(/)</code>, which stays exact up to 2⁵³. The TLB is the LRU simulator with hits = references − faults.</p>',
  khaiNiem: ['bit fields', 'TLB'],
  fn: 'splitAddress',
  dau: "function splitAddress(addr, bits) {\n  return [];\n}\nfunction tlbHits(entries, pages) {\n  return 0;\n}\n",
  giaiMa: "function splitAddress(addr, bits) {\n  var out = [];\n  for (var i = bits.length - 1; i >= 0; i--) {\n    var m = Math.pow(2, bits[i]);\n    out.unshift(addr % m);\n    addr = Math.floor(addr / m);\n  }\n  return out;\n}\nfunction tlbHits(entries, pages) {\n  var tlb = [], hits = 0;\n  for (var i = 0; i < pages.length; i++) {\n    var at = tlb.indexOf(pages[i]);\n    if (at >= 0) { hits++; tlb.splice(at, 1); }\n    else if (tlb.length === entries) tlb.shift();\n    tlb.push(pages[i]);\n  }\n  return hits;\n}\n",
  ref: (a, b) => split(a, b),
  cases: [
    { args: [0x00403004, [10, 10, 12]] }, { args: [0xFFFFF123, [10, 10, 12]] }, { args: [0x12345678, [8, 8, 8, 8]] },
    { args: [0x7FFFFFFFFFFF, [9, 9, 9, 9, 12]], an: true }, { args: [4095, [12]], an: true }, { args: [0, [10, 10, 12]], an: true },
  ],
  kiemThem: [
    { moTa: bi('TLB with 2 entries', 'TLB 2 ô'), goi: 'tlbHits(2, [1, 2, 1, 3, 1, 2, 3, 3])', mongDoi: (() => { const r = S.replace('LRU', [1, 2, 1, 3, 1, 2, 3, 3], 2); return r.hits; })() },
    { moTa: bi('TLB with 3 entries', 'TLB 3 ô'), goi: 'tlbHits(3, [5, 6, 7, 5, 6, 8, 5, 9, 6, 7])', mongDoi: S.replace('LRU', [5, 6, 7, 5, 6, 8, 5, 9, 6, 7], 3).hits },
    { moTa: bi('Hidden: single-entry TLB', 'Ẩn: TLB một ô'), goi: 'tlbHits(1, [4, 4, 4, 5, 5, 4])', mongDoi: S.replace('LRU', [4, 4, 4, 5, 5, 4], 1).hits, an: true },
  ],
});

export default doiDau({
  slug: 'osg202-3-3-tlb-dia-chi',
  ten: '3.3 Address translation: page tables & the TLB',
  khoa: KHOA,
  baiHoc: 'osg202-3-3-tlb-dia-chi',
  de: [E1, E2, E3, E4, E5],
});
void hai;
