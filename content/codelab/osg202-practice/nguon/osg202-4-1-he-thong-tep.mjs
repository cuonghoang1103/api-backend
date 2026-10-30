/**
 * OSG202 · 4.1 — Files, directories & allocation: contiguous / linked / FAT / indexed.
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Files 1 — Files, directories and links (concepts)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on the file abstraction and directories.</p>', '<p>Năm câu về khái niệm tệp và thư mục.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What is the difference between an absolute and a relative path?', 'Đường dẫn tuyệt đối khác đường dẫn tương đối ở chỗ nào?'], [['a', 'An absolute path starts at the root (/), a relative path starts at the current working directory'], ['b', 'An absolute path is always shorter, because it leaves out the current directory'], ['c', 'A relative path cannot contain directories; it is only the name of a file in /'], ['d', 'There is no difference on UNIX; the shell turns both into the same string']], 'a', ['/home/ana/a.txt is absolute; docs/a.txt is resolved against the working directory.', '/home/ana/a.txt là tuyệt đối; docs/a.txt được giải theo thư mục làm việc.']),
    mc('c2', ['In UNIX, which system call returns a file descriptor?', 'Trong UNIX lời gọi hệ thống nào trả về mô tả tệp (file descriptor)?'], [['a', 'open()'], ['b', 'read()'], ['c', 'close()'], ['d', 'stat()']], 'a', ['open returns the lowest unused non-negative integer; read/write/close take it as an argument.', 'open trả số nguyên không âm nhỏ nhất chưa dùng; read/write/close nhận nó làm tham số.']),
    mc('c3', ['Which directory structure allows the same file to appear under two names?', 'Cấu trúc thư mục nào cho phép cùng một tệp xuất hiện dưới hai tên?'], [['a', 'Acyclic-graph directories (links)'], ['b', 'Single-level directory'], ['c', 'Two-level directory'], ['d', 'Pure tree']], 'a', ['Hard and symbolic links turn the tree into a DAG.', 'Liên kết cứng và mềm biến cây thành DAG.']),
    mc('c4', ['What does a file’s “extension” (.txt, .c) mean to UNIX itself?', 'Phần mở rộng (.txt, .c) của tệp có ý nghĩa gì với bản thân UNIX?'], [['a', 'Nothing: it is only part of the name (conventions are for programs and users)'], ['b', 'It selects the file system that stores the file (ext4, FAT, …)'], ['c', 'It sets the permissions (.sh is executable, .txt is not)'], ['d', 'It tells the kernel which program must open the file']], 'a', ['UNIX determines type by content/permissions; Windows associates programs with extensions.', 'UNIX xác định loại theo nội dung/quyền; Windows gắn chương trình theo phần mở rộng.']),
    mc('c5', ['A memory-mapped file (mmap) lets a program …', 'Tệp ánh xạ bộ nhớ (mmap) cho phép chương trình …'], [['a', 'access file contents as ordinary memory; pages are loaded on demand'], ['b', 'copy the whole file to RAM at open and keep it there until exit'], ['c', 'avoid the page cache, because reads go straight from the disk to registers'], ['d', 'rename the file and update its directory entry without a system call']], 'a', ['Virtual memory and files meet: a page fault reads the file block.', 'Bộ nhớ ảo và tệp gặp nhau: lỗi trang sẽ đọc khối tệp.']),
  ],
  goiY: ['A directory entry is a (name → file) mapping; a path walks entries from the root.', 'Links make the structure a graph.'],
  loiHayGap: ['Thinking the extension is meaningful to the kernel.', 'Confusing a file descriptor (small integer per process) with an inode number.'],
  thuatNgu: [tn('file descriptor', 'mô tả tệp: số nguyên mỗi tiến trình'), tn('absolute path', 'đường dẫn tuyệt đối'), tn('mmap', 'ánh xạ tệp vào bộ nhớ')],
  khaiNiem: ['file', 'directory', 'path'],
});

const FAT = [9, -1, -1, 11, -1, 1, 13, 2, 5, 10, 4, 8, 7, -1];
const files = [['A', 0], ['B', 12], ['C', 3], ['D', 6]];
const chains = files.map(([n, s]) => [n, s, S.fatChain(FAT, s)]);
const E2 = tinh({
  tieuDe: 'Files 2 — Follow the FAT chain',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>FAT entries (index → value), <code>-1</code> = end of file:</p>${tab(['Block', ...FAT.map((_, i) => i)], [['FAT', ...FAT]])}<p>Four files start at the blocks below. Give the chain of blocks (comma separated, no spaces) and the number of blocks of the file.</p>`,
    `<p>Các mục FAT (chỉ số → giá trị), <code>-1</code> = hết tệp:</p>${tab(['Block', ...FAT.map((_, i) => i)], [['FAT', ...FAT]])}<p>Bốn tệp bắt đầu ở các khối dưới đây. Cho chuỗi khối (cách nhau bằng dấu phẩy, không dấu cách) và số khối của tệp.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Chains', 'Chuỗi khối'),
    cot: [{ ma: 'f', ten: 'File (first block)' }, { ma: 'c', ten: 'Chain' }, { ma: 'n', ten: 'Blocks' }],
    hang: files.map(([n, s]) => ({ ma: n, o: { f: `${n} (${s})` } })),
    dapAn: Object.fromEntries(chains.flatMap(([n, , r]) => [[`${n}.c`, r.chain.join(',')], [`${n}.n`, String(r.chain.length)]])),
    giaiThich: giai(chains.map(([n, s, r]) => `${n}: ${r.chain.join(' → ')}`).join('; ') + '. With the FAT cached in RAM, reading block k of a file costs k pointer lookups in memory and one disk read; without the cache it costs k disk reads.', chains.map(([n, s, r]) => `${n}: ${r.chain.join(' → ')}`).join('; ') + '. Khi FAT nằm trong RAM, đọc khối thứ k tốn k lần tra con trỏ trong bộ nhớ và một lần đọc đĩa; không có cache thì tốn k lần đọc đĩa.'),
  }],
  goiY: ['Start at the first block, then repeatedly look up FAT[block] until you reach -1.', 'The first block itself belongs to the file.'],
  loiHayGap: ['Stopping when FAT[block] = 0 (block 0 is a legal block here).', 'Leaving out the starting block from the chain.'],
  giaiThich: '<p>' + chains.map(([n, , r]) => `${n}: ${r.chain.join(',')}`).join(' · ') + '</p>',
  thuatNgu: [tn('FAT', 'bảng cấp phát tệp: mỗi khối trỏ khối kế'), tn('linked allocation', 'cấp phát liên kết')],
  khaiNiem: ['FAT', 'linked allocation'],
});

const M = ['Contiguous', 'Linked', 'FAT', 'Indexed (i-node)'];
const E3 = tinh({
  tieuDe: 'Files 3 — Match the allocation method to the property',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Each statement describes one disk-allocation method. Pick it.</p>', '<p>Mỗi phát biểu mô tả một phương pháp cấp phát đĩa. Hãy chọn.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Property → method', 'Tính chất → phương pháp'),
    cot: [{ ma: 'p', ten: 'Property' }, { ma: 'm', ten: 'Method', luaChon: M }],
    hang: [
      'Suffers from external fragmentation of the disk and needs the final size known when the file is created',
      'Each data block starts with the number of the next block, so random access means reading all earlier blocks',
      'The pointer chain is kept in one table in memory, which makes random access cheap but the table large for big disks',
      'One block holds the pointers to the file’s data blocks; small files need just that block',
      'Reading sequentially is fastest (one seek); CD-ROMs and DVDs use it',
    ].map((p, i) => ({ ma: `r${i}`, o: { p } })),
    dapAn: { 'r0.m': M[0], 'r1.m': M[1], 'r2.m': M[2], 'r3.m': M[3], 'r4.m': M[0] },
    giaiThich: giai('Contiguous = best sequential/random speed, worst fragmentation; linked = no fragmentation but slow random access; FAT = linked chain moved into a table; indexed = per-file pointer block (UNIX i-node).', 'Liên tục = nhanh nhất nhưng phân mảnh; liên kết = không phân mảnh nhưng truy cập ngẫu nhiên chậm; FAT = chuỗi liên kết chuyển vào một bảng; chỉ mục = khối con trỏ riêng mỗi tệp (i-node UNIX).'),
  }],
  goiY: ['Where are the “next block” pointers stored — in the data blocks, in a global table, or in a per-file index?', 'Contiguous allocation is the only one that keeps a file in one run.'],
  loiHayGap: ['Giving “random access is slow” to FAT (it is fast if the table is cached).', 'Forgetting that read-only media such as CD-ROMs use contiguous allocation.'],
  giaiThich: '<p>Contiguous · Linked · FAT · Indexed · Contiguous.</p>',
  thuatNgu: [tn('i-node', 'nút chỉ mục của tệp UNIX'), tn('external fragmentation', 'phân mảnh ngoài')],
  khaiNiem: ['allocation methods'],
});

const E4 = jsDe({
  tieuDe: 'Files 4 — Walk and validate a FAT chain',
  doKho: 'HARD', phut: 15,
  moTa: bi(`<p>Write <code>fatChain(fat, start)</code>. <code>fat[i]</code> is the block that follows block <code>i</code>, or <code>-1</code> at the end of the file. Return <code>{ chain, ok }</code>: <code>chain</code> is the list of blocks visited from <code>start</code>; <code>ok</code> is <code>true</code> if the chain ends with <code>-1</code>, and <code>false</code> if it loops back to a block already visited or points outside the table (negative other than -1, or ≥ <code>fat.length</code>). In the failing case <code>chain</code> contains the valid blocks visited before the problem.</p>`,
    `<p>Viết <code>fatChain(fat, start)</code>. <code>fat[i]</code> là khối đứng sau khối <code>i</code>, hoặc <code>-1</code> ở cuối tệp. Trả <code>{ chain, ok }</code>: <code>chain</code> là danh sách khối đi qua từ <code>start</code>; <code>ok</code> là <code>true</code> nếu chuỗi kết thúc bằng <code>-1</code>, và <code>false</code> nếu quay lại khối đã thăm hoặc trỏ ra ngoài bảng (âm khác -1 hoặc ≥ <code>fat.length</code>). Khi lỗi, <code>chain</code> chứa các khối hợp lệ đã đi qua trước chỗ hỏng.</p>`),
  yeuCau: [bi('This is what <code>fsck</code> does to find corrupt chains.', 'Đây là việc <code>fsck</code> làm để tìm chuỗi hỏng.')],
  viDu: [{ input: 'fatChain([2, -1, 4, 0, 1], 3)', output: JSON.stringify(S.fatChain([2, -1, 4, 0, 1], 3)), explanation: '3 → 0 → 2 → 4 → 1 → end.|||3 → 0 → 2 → 4 → 1 → hết.' }],
  goiY: ['Keep a set of visited blocks; a repeated block is a cycle (lost-and-found material for fsck).', 'Check the range before reading fat[b].'],
  loiHayGap: ['Looping forever on a cyclic chain.', 'Treating index 0 as end-of-file.'],
  giaiThich: '<p>A valid chain visits each block once and ends at -1; a cycle or a wild pointer marks a corrupted file.</p>',
  khaiNiem: ['FAT', 'fsck'],
  fn: 'fatChain',
  dau: "function fatChain(fat, start) {\n  return { chain: [], ok: false };\n}\n",
  giaiMa: '// Follow pointers with a visited set.\n' + dat(S.fatChain, 'fatChain'),
  ref: (f, s) => S.fatChain(f, s),
  cases: [{ args: [FAT, 0] }, { args: [FAT, 12] }, { args: [[1, 0], 0] }, { args: [[1, 5, -1], 0] }, { args: [[-1], 0], an: true }, { args: [[2, 3, 1, -3], 0], an: true }, { args: [[1, 2, 3, 1], 0], an: true }],
});

export default doiDau({
  slug: 'osg202-4-1-he-thong-tep',
  ten: '4.1 Files, directories & implementation',
  khoa: KHOA,
  baiHoc: 'osg202-4-1-he-thong-tep',
  de: [E1, E2, E3, E4],
});
void hai;
