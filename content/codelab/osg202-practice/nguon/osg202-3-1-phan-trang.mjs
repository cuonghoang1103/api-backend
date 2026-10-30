/**
 * OSG202 · 3.1 — Paging & virtual memory: address splitting, page-table sizes, translation.
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, tinh, jsDe, dat, mc, tn, pre } from './_os.mjs';

const KB = 1024;
/* Bài 1 EASY: tách địa chỉ */
const cfg1 = [[16, 1 * KB], [32, 4 * KB], [32, 16 * KB], [20, 256]];
const lg = (x) => Math.log2(x);
const E1 = tinh({
  tieuDe: 'Paging 1 — Split a virtual address: offset bits, page-number bits, number of pages',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>A virtual address of <b>b</b> bits is divided into a page number and an offset. For each configuration give the number of offset bits, the number of page-number bits and the number of virtual pages.</p>', '<p>Địa chỉ ảo <b>b</b> bit được chia thành số trang và độ dời (offset). Với mỗi cấu hình hãy cho số bit offset, số bit số-trang và số trang ảo.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Address split', 'Tách địa chỉ'),
    cot: [{ ma: 'c', ten: 'Address bits, page size' }, { ma: 'o', ten: 'Offset bits' }, { ma: 'p', ten: 'Page-number bits' }, { ma: 'n', ten: 'Number of pages' }],
    hang: cfg1.map(([b, s]) => ({ ma: `c${b}_${s}`, o: { c: `${b}-bit, ${s >= KB ? s / KB + ' KB' : s + ' B'}` } })),
    dapAn: Object.fromEntries(cfg1.flatMap(([b, s]) => [[`c${b}_${s}.o`, String(lg(s))], [`c${b}_${s}.p`, String(b - lg(s))], [`c${b}_${s}.n`, String(2 ** (b - lg(s)))]])),
    giaiThich: giai(cfg1.map(([b, s]) => `${b}-bit, ${s} B: offset = log2(${s}) = ${lg(s)}, page bits = ${b - lg(s)}, pages = 2^${b - lg(s)} = ${2 ** (b - lg(s))}`).join('; ') + '.', cfg1.map(([b, s]) => `${b} bit, ${s} B: offset ${lg(s)}, số trang ${2 ** (b - lg(s))}`).join('; ') + '.'),
  }],
  goiY: ['Offset bits = log2(page size).', 'Page-number bits = address bits − offset bits; pages = 2^(that).'],
  loiHayGap: ['Using the page size in KB instead of bytes when taking the logarithm.', 'Writing the number of pages as the number of bits.'],
  giaiThich: '<p>' + cfg1.map(([b, s]) => `${lg(s)}/${b - lg(s)}/${2 ** (b - lg(s))}`).join(' · ') + '</p>',
  thuatNgu: [tn('page', 'trang ảo'), tn('frame', 'khung trang vật lý'), tn('offset', 'độ dời trong trang')],
  khaiNiem: ['paging', 'address split'],
});

/* Bài 2 MEDIUM: dịch địa chỉ */
const PT = [5, 2, null, 7, 0, null];
const PG = 1024;
const addrs = [100, 1024 + 5, 2 * 1024 + 7, 3 * 1024 + 1023, 4 * 1024, 5 * 1024 + 3, 6 * 1024 + 8, 1];
const kq2 = addrs.map((a) => S.translate(a, PG, PT));
const E2 = tinh({
  tieuDe: 'Paging 2 — Translate logical addresses with a page table',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Page size = ${PG} bytes. The page table (index = page number, value = frame number, “—” = page not in memory) is below. Give the PHYSICAL address in decimal, or write <code>PAGE FAULT</code> (page not present) or <code>INVALID</code> (page number beyond the table).</p>${tab(['Page', '0', '1', '2', '3', '4', '5'], [['Frame', ...PT.map((f) => (f === null ? '—' : f))]])}`,
    `<p>Kích thước trang = ${PG} byte. Bảng trang (chỉ số = số trang, giá trị = số khung, “—” = trang không có trong bộ nhớ) ở dưới. Cho địa chỉ VẬT LÝ dạng thập phân, hoặc viết <code>PAGE FAULT</code> (trang không có mặt) hoặc <code>INVALID</code> (số trang vượt quá bảng).</p>${tab(['Page', '0', '1', '2', '3', '4', '5'], [['Frame', ...PT.map((f) => (f === null ? '—' : f))]])}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Logical → physical', 'Logic → vật lý'),
    cot: [{ ma: 'l', ten: 'Logical address' }, { ma: 'p', ten: 'Physical address' }],
    hang: addrs.map((a, i) => ({ ma: `a${i}`, o: { l: String(a) } })),
    dapAn: Object.fromEntries(addrs.map((a, i) => [`a${i}.p`, String(kq2[i])])),
    giaiThich: giai(addrs.map((a, i) => `${a}: page ${Math.floor(a / PG)}, offset ${a % PG} → ${kq2[i]}`).join('; ') + '.', addrs.map((a, i) => `${a}: trang ${Math.floor(a / PG)}, offset ${a % PG} → ${kq2[i]}`).join('; ') + '.'),
  }],
  goiY: ['page = ⌊address / pagesize⌋, offset = address mod pagesize; physical = frame × pagesize + offset.', 'A “—” entry means the valid bit is 0: the MMU raises a page fault.'],
  loiHayGap: ['Forgetting to multiply the frame number by the page size.', 'Reporting a physical address for a page whose valid bit is 0.'],
  giaiThich: '<p>' + kq2.join(' · ') + '</p>',
  thuatNgu: [tn('valid bit', 'bit hợp lệ: trang có trong RAM'), tn('page fault', 'lỗi trang: trang không có trong RAM')],
  khaiNiem: ['address translation', 'page fault'],
});

/* Bài 3 MEDIUM: kích thước bảng trang */
const cfg3 = [[32, 4 * KB, 4], [32, 16 * KB, 4], [48, 4 * KB, 8], [36, 8 * KB, 4]];
const spt = ([b, s, e]) => (2 ** (b - lg(s))) * e;
const fmt = (n) => (n >= 2 ** 30 ? `${n / 2 ** 30} GB` : n >= 2 ** 20 ? `${n / 2 ** 20} MB` : n >= 2 ** 10 ? `${n / 2 ** 10} KB` : `${n} B`);
const E3 = tinh({
  tieuDe: 'Paging 3 — How big is a single-level page table?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>A single-level page table has one entry per virtual page. Compute its size for each system (write the number and unit, e.g. <code>4 MB</code>; units KB/MB/GB with 1 KB = 1024 B).</p>', '<p>Bảng trang một cấp có một mục cho mỗi trang ảo. Tính kích thước của nó cho từng hệ thống (viết số và đơn vị, ví dụ <code>4 MB</code>; KB/MB/GB với 1 KB = 1024 B).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Page-table size', 'Kích thước bảng trang'),
    cot: [{ ma: 'c', ten: 'Virtual address, page size, entry size' }, { ma: 't', ten: 'Table size' }],
    hang: cfg3.map(([b, s, e]) => ({ ma: `c${b}_${s}`, o: { c: `${b}-bit, ${s / KB} KB pages, ${e}-byte entries` } })),
    dapAn: Object.fromEntries(cfg3.map((c) => [`c${c[0]}_${c[1]}.t`, [fmt(spt(c)), fmt(spt(c)).replace(' ', '')]])),
    giaiThich: giai(cfg3.map((c) => `${c[0]}-bit/${c[1] / KB} KB: 2^${c[0] - lg(c[1])} entries × ${c[2]} B = ${fmt(spt(c))}`).join('; ') + '. The 48-bit case shows why a flat table is impossible on 64-bit machines: multi-level or inverted tables are needed.', cfg3.map((c) => `${c[0]} bit / ${c[1] / KB} KB: 2^${c[0] - lg(c[1])} mục × ${c[2]} B = ${fmt(spt(c))}`).join('; ') + '. Trường hợp 48 bit cho thấy vì sao không thể dùng bảng phẳng trên máy 64 bit: cần bảng nhiều cấp hoặc bảng đảo.'),
  }],
  goiY: ['Entries = 2^(address bits − offset bits).', 'Size = entries × bytes per entry; convert with powers of two.'],
  loiHayGap: ['Using 2^address bits entries (forgetting that pages, not bytes, are indexed).', 'Mixing decimal (1000) and binary (1024) units.'],
  giaiThich: '<p>' + cfg3.map((c) => fmt(spt(c))).join(' · ') + '</p>',
  thuatNgu: [tn('page-table entry (PTE)', 'mục bảng trang'), tn('multi-level page table', 'bảng trang nhiều cấp')],
  khaiNiem: ['page table size', 'multi-level paging'],
});

/* Bài 4 MEDIUM: khái niệm */
const E4 = tinh({
  tieuDe: 'Paging 4 — Internal fragmentation, protection and the bits of a PTE',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Five conceptual questions about paging.</p>', '<p>Năm câu khái niệm về phân trang.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['A process needs 72 766 bytes and the page size is 2048 bytes. How many bytes are wasted by internal fragmentation?', 'Một tiến trình cần 72 766 byte, kích thước trang 2048 byte. Bao nhiêu byte bị phí do phân mảnh trong?'], [['a', String(Math.ceil(72766 / 2048) * 2048 - 72766)], ['b', '2048'], ['c', '0'], ['d', String(72766 % 2048)]], 'a', [`⌈72766 / 2048⌉ = ${Math.ceil(72766 / 2048)} pages = ${Math.ceil(72766 / 2048) * 2048} bytes, so ${Math.ceil(72766 / 2048) * 2048 - 72766} bytes are wasted in the last page (72766 mod 2048 = ${72766 % 2048} is what is USED there).`, `⌈72766 / 2048⌉ = ${Math.ceil(72766 / 2048)} trang = ${Math.ceil(72766 / 2048) * 2048} byte, nên phí ${Math.ceil(72766 / 2048) * 2048 - 72766} byte ở trang cuối (72766 mod 2048 = ${72766 % 2048} là phần ĐÃ dùng).`]),
    mc('c2', ['Paging suffers from which kind of fragmentation?', 'Phân trang gặp loại phân mảnh nào?'], [['a', 'Internal fragmentation only (no external)'], ['b', 'External fragmentation only'], ['c', 'Both equally'], ['d', 'Neither']], 'a', ['Frames are all the same size so any free frame fits; only the last page of a process is partly empty.', 'Mọi khung bằng nhau nên khung trống nào cũng dùng được; chỉ trang cuối của tiến trình bị trống một phần.']),
    mc('c3', ['Which PTE bit lets the OS decide whether a victim page must be written back to disk?', 'Bit nào trong PTE cho OS biết trang nạn nhân có phải ghi lại ra đĩa?'], [['a', 'Dirty (modified) bit'], ['b', 'Valid bit'], ['c', 'Referenced bit'], ['d', 'Protection bit']], 'a', ['If the page was not modified since it was loaded, the disk copy is still good and no write is needed.', 'Nếu trang chưa bị sửa kể từ khi nạp thì bản trên đĩa còn nguyên, không cần ghi.']),
    mc('c4', ['A process stores to a page whose PTE says read-only. What happens?', 'Tiến trình ghi vào trang mà PTE đánh dấu chỉ-đọc. Điều gì xảy ra?'], [['a', 'The MMU raises a protection fault and the OS typically terminates the process (SIGSEGV)'], ['b', 'The write silently succeeds, because the read-only bit is only a hint for the OS'], ['c', 'The page is swapped out and a writable copy is loaded from the disk'], ['d', 'The TLB is flushed and the write is retried until the page becomes writable']], 'a', ['Protection bits are checked on every access by hardware.', 'Phần cứng kiểm bit bảo vệ ở mọi lần truy cập.']),
    mc('c5', ['Increasing the page size generally …', 'Tăng kích thước trang nói chung …'], [['a', 'shrinks the page table but increases internal fragmentation'], ['b', 'enlarges the page table and removes fragmentation'], ['c', 'has no effect'], ['d', 'removes the need for a TLB']], 'a', ['Fewer pages → smaller table; larger last-page waste. Tanenbaum’s optimum p = √(2·s·e).', 'Ít trang hơn → bảng nhỏ hơn; phí ở trang cuối lớn hơn. Tối ưu của Tanenbaum p = √(2·s·e).']),
  ],
  goiY: ['Internal fragmentation = allocated − used inside the last allocated unit.', 'The dirty bit is about disk write-back; the valid bit is about presence in RAM.'],
  loiHayGap: ['Answering with the remainder (72766 mod 2048) instead of page − remainder.', 'Thinking paging has external fragmentation.'],
  thuatNgu: [tn('internal fragmentation', 'phân mảnh trong: phần phí trong đơn vị đã cấp'), tn('dirty bit', 'bit bẩn: trang đã bị sửa')],
  khaiNiem: ['internal fragmentation', 'PTE bits'],
});

/* Bài 5 HARD: dịch hàng loạt */
const ref5 = (pageSize, table, addrs2) => addrs2.map((a) => S.translate(a, pageSize, table));
const E5 = jsDe({
  tieuDe: 'Paging 5 — Write an MMU: translate a batch of addresses',
  doKho: 'HARD', phut: 15,
  moTa: bi(`<p>Write <code>translateAll(pageSize, table, addrs)</code>. <code>table[p]</code> is the frame number of page <code>p</code> or <code>null</code> if the page is not in memory. For every address return the physical address (a number), <code>'PAGE FAULT'</code> if the page exists in the table but is not present, or <code>'INVALID'</code> if the page number is beyond the table (or the address is negative).</p>`,
    `<p>Viết <code>translateAll(pageSize, table, addrs)</code>. <code>table[p]</code> là số khung của trang <code>p</code> hoặc <code>null</code> nếu trang không có trong bộ nhớ. Với mỗi địa chỉ trả địa chỉ vật lý (số), <code>'PAGE FAULT'</code> nếu trang có trong bảng nhưng không hiện diện, hoặc <code>'INVALID'</code> nếu số trang vượt quá bảng (hoặc địa chỉ âm).</p>`),
  yeuCau: [bi('Return an array of the same length as <code>addrs</code>.', 'Trả mảng cùng độ dài với <code>addrs</code>.')],
  viDu: [{ input: 'translateAll(1024, [5, null], [100, 1030, 2048])', output: JSON.stringify(ref5(1024, [5, null], [100, 1030, 2048])), explanation: 'Page 0 → frame 5; page 1 absent; page 2 beyond the table.|||Trang 0 → khung 5; trang 1 vắng; trang 2 vượt bảng.' }],
  goiY: ['Compute page = Math.floor(a / pageSize) and offset = a % pageSize.', 'Check the page range BEFORE reading table[page]; check null after.'],
  loiHayGap: ['Treating frame 0 as “absent” because it is falsy (use === null).', 'Returning NaN for negative addresses.'],
  giaiThich: '<p>Three outcomes: out-of-range page (INVALID), null entry (PAGE FAULT) or frame × pageSize + offset.</p>',
  khaiNiem: ['MMU', 'address translation'],
  fn: 'translateAll',
  dau: "function translateAll(pageSize, table, addrs) {\n  return [];\n}\n",
  giaiMa: '// One translation per address.\nfunction translateAll(pageSize, table, addrs) {\n  return addrs.map(function (vaddr) {\n    if (vaddr < 0) return \'INVALID\';\n    var page = Math.floor(vaddr / pageSize), off = vaddr % pageSize;\n    if (page >= table.length) return \'INVALID\';\n    var f = table[page];\n    return f === null || f === undefined ? \'PAGE FAULT\' : f * pageSize + off;\n  });\n}\n',
  ref: (ps, t, a) => a.map((x) => (x < 0 ? 'INVALID' : S.translate(x, ps, t))),
  cases: [{ args: [PG, PT, addrs] }, { args: [4096, [0, 1, 2], [0, 4095, 4096, 12287, 12288]] }, { args: [256, [null, 9], [10, 300]] }, { args: [512, [3, null, 0], [-1, 511, 512, 1024, 1535], ], an: true }, { args: [1, [4, 2, 0], [0, 1, 2, 3]], an: true }],
});

export default doiDau({
  slug: 'osg202-3-1-phan-trang',
  ten: '3.1 Paging & virtual memory',
  khoa: KHOA,
  baiHoc: 'osg202-3-1-phan-trang',
  de: [E1, E2, E3, E4, E5],
});
void hai; void pre; void dat;
