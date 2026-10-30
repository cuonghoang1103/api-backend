/**
 * OSG202 · 4.2 — Allocation with i-nodes, links, permissions and free-space bitmaps.
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const KB = 1024;
const blocks = (B, P, nd, lv) => { const k = B / P; return nd + (lv >= 1 ? k : 0) + (lv >= 2 ? k * k : 0) + (lv >= 3 ? k * k * k : 0); };
const cfg = [[1 * KB, 4, 12, 1], [1 * KB, 4, 12, 2], [1 * KB, 4, 12, 3], [4 * KB, 4, 12, 2], [4 * KB, 8, 10, 2]];
const lvName = ['', 'single', 'double', 'triple'];
const E1 = tinh({
  tieuDe: 'I-node 1 — Maximum file size of a UNIX i-node',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>An i-node has <b>d</b> direct pointers, then (up to the given level) a single-, double- and triple-indirect pointer. A pointer takes <b>P</b> bytes and a block is <b>B</b> bytes. Give the maximum number of DATA blocks a file can have and the maximum file size in KB (1 KB = 1024 B).</p>', '<p>Một i-node có <b>d</b> con trỏ trực tiếp, rồi (tới mức cho trước) con trỏ gián tiếp đơn, đôi, ba. Mỗi con trỏ <b>P</b> byte, mỗi khối <b>B</b> byte. Cho số khối DỮ LIỆU tối đa của một tệp và kích thước tệp tối đa theo KB (1 KB = 1024 B).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Limits', 'Giới hạn'),
    cot: [{ ma: 'c', ten: 'Configuration' }, { ma: 'n', ten: 'Max data blocks' }, { ma: 'k', ten: 'Max size (KB)' }],
    hang: cfg.map(([B, P, d, l], i) => ({ ma: `c${i}`, o: { c: `B = ${B / KB} KB, P = ${P} B, ${d} direct, up to ${lvName[l]} indirect` } })),
    dapAn: Object.fromEntries(cfg.flatMap(([B, P, d, l], i) => [[`c${i}.n`, String(blocks(B, P, d, l))], [`c${i}.k`, String((blocks(B, P, d, l) * B) / KB)]])),
    giaiThich: giai(cfg.map(([B, P, d, l]) => `B=${B / KB}K,P=${P},d=${d},${lvName[l]}: ${blocks(B, P, d, l)} blocks = ${(blocks(B, P, d, l) * B) / KB} KB`).join('; ') + '. A block holds k = B/P pointers; single indirect adds k blocks, double k², triple k³.', cfg.map(([B, P, d, l]) => `B=${B / KB}K,P=${P},d=${d},${lvName[l]}: ${blocks(B, P, d, l)} khối = ${(blocks(B, P, d, l) * B) / KB} KB`).join('; ') + '. Một khối chứa k = B/P con trỏ; gián tiếp đơn thêm k khối, đôi k², ba k³.'),
  }],
  goiY: ['k = B / P pointers fit in one indirect block.', 'Blocks = d + k + k² + k³ (only up to the allowed level).'],
  loiHayGap: ['Forgetting the direct blocks.', 'Using B instead of B/P as the fan-out.'],
  giaiThich: '<p>' + cfg.map(([B, P, d, l]) => blocks(B, P, d, l)).join(' · ') + ' blocks.</p>',
  thuatNgu: [tn('indirect block', 'khối gián tiếp: chứa con trỏ tới khối khác'), tn('fan-out', 'số con trỏ trong một khối')],
  khaiNiem: ['i-node', 'indirect blocks'],
});

const offs = [5000, 20000, 300000, 100000000, 11 * KB, 12 * KB];
const E2 = tinh({
  tieuDe: 'I-node 2 — How many disk reads for one byte?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>B = 1 KB, P = 4 bytes, 12 direct pointers, then single, double and triple indirect. The i-node of the open file is already in RAM and nothing else is cached. For the byte at the given offset give the level of indirection used (0 = direct … 3 = triple) and the number of DISK reads needed to fetch that byte (indirect blocks plus the data block).</p>', '<p>B = 1 KB, P = 4 byte, 12 con trỏ trực tiếp, rồi gián tiếp đơn, đôi, ba. I-node của tệp đang mở đã ở RAM và không có gì khác trong cache. Với byte ở vị trí cho trước, cho mức gián tiếp dùng (0 = trực tiếp … 3 = ba) và số lần đọc ĐĨA cần để lấy byte đó (khối gián tiếp cộng khối dữ liệu).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Indirection and reads', 'Mức gián tiếp và số lần đọc'),
    cot: [{ ma: 'o', ten: 'Byte offset' }, { ma: 'l', ten: 'Indirection level' }, { ma: 'r', ten: 'Disk reads' }],
    hang: offs.map((o) => ({ ma: `o${o}`, o: { o: String(o) } })),
    dapAn: Object.fromEntries(offs.flatMap((o) => { const r = S.locate(o, KB, 4, 12); return [[`o${o}.l`, String(r.level)], [`o${o}.r`, String(r.reads)]]; })),
    giaiThich: giai(offs.map((o) => { const r = S.locate(o, KB, 4, 12); return `${o}: block ${Math.floor(o / KB)} → level ${r.level}, ${r.reads} reads`; }).join('; ') + '. Blocks 0–11 are direct, 12–267 single indirect, 268–65803 double, then triple.', offs.map((o) => { const r = S.locate(o, KB, 4, 12); return `${o}: khối ${Math.floor(o / KB)} → mức ${r.level}, ${r.reads} lần đọc`; }).join('; ') + '. Khối 0–11 trực tiếp, 12–267 gián tiếp đơn, 268–65803 đôi, sau đó ba.'),
  }],
  goiY: ['Block number = ⌊offset / B⌋.', 'Reads = indirection level + 1 (each level adds one pointer block to read).'],
  loiHayGap: ['Counting the i-node read (it is already in RAM).', 'Using the offset instead of the block number to pick the level.'],
  giaiThich: '<p>' + offs.map((o) => { const r = S.locate(o, KB, 4, 12); return `${r.level}/${r.reads}`; }).join(' · ') + '</p>',
  thuatNgu: [tn('direct block', 'khối trực tiếp')],
  khaiNiem: ['i-node', 'indirect access cost'],
});

/* Bài 3: quyền */
const sym = (o) => [o >> 6 & 7, o >> 3 & 7, o & 7].map((d) => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-')).join('');
const E3 = tinh({
  tieuDe: 'I-node 3 — Permissions in octal, symbolic form and umask',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Convert between the symbolic form (<code>rwxr-x---</code>, 9 characters) and the octal mode, and compute the permissions of newly created files with a given <code>umask</code> (a new file starts from 666, a new directory from 777; the umask bits are removed).</p>', '<p>Đổi giữa dạng ký hiệu (<code>rwxr-x---</code>, 9 ký tự) và dạng bát phân, và tính quyền của tệp mới tạo với <code>umask</code> cho trước (tệp mới bắt đầu từ 666, thư mục mới từ 777; các bit của umask bị bỏ).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Conversions', 'Chuyển đổi'),
    cot: [{ ma: 'q', ten: 'Given' }, { ma: 'a', ten: 'Answer' }],
    hang: [
      ['s1', 'rwxr-xr-x → octal'], ['s2', 'rw-r----- → octal'], ['s3', '700 → symbolic'], ['s4', '754 → symbolic'],
      ['s5', 'New FILE with umask 022 → octal'], ['s6', 'New DIRECTORY with umask 027 → octal'], ['s7', 'New FILE with umask 077 → octal'],
    ].map(([m, q]) => ({ ma: m, o: { q } })),
    dapAn: { 's1.a': S.chmodOctal('rwxr-xr-x'), 's2.a': S.chmodOctal('rw-r-----'), 's3.a': sym(0o700), 's4.a': sym(0o754), 's5.a': (0o666 & ~0o022).toString(8).padStart(3, '0'), 's6.a': (0o777 & ~0o027).toString(8).padStart(3, '0'), 's7.a': (0o666 & ~0o077).toString(8).padStart(3, '0') },
    giaiThich: giai('Each digit is r=4 + w=2 + x=1 for owner, group, others. 755, 640, rwx------, rwxr-xr--; umask removes bits: 666 & ~022 = 644, 777 & ~027 = 750, 666 & ~077 = 600.', 'Mỗi chữ số là r=4 + w=2 + x=1 cho chủ, nhóm, người khác. 755, 640, rwx------, rwxr-xr--; umask bỏ bit: 666 & ~022 = 644, 777 & ~027 = 750, 666 & ~077 = 600.'),
  }],
  goiY: ['Write the three digits as binary rwx triples.', 'umask is a MASK of bits to clear: result = default AND NOT umask.'],
  loiHayGap: ['Subtracting the umask arithmetically (666 − 027 would be wrong in general; use bit masking).', 'Starting a new file from 777 (files do not get execute permission by default).'],
  giaiThich: '<p>755 · 640 · rwx------ · rwxr-xr-- · 644 · 750 · 600.</p>',
  thuatNgu: [tn('umask', 'mặt nạ quyền mặc định'), tn('chmod', 'đổi quyền tệp')],
  khaiNiem: ['permissions', 'umask', 'octal modes'],
});

const E4 = tinh({
  tieuDe: 'I-node 4 — Hard links, symbolic links and what an i-node stores',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Five questions about links and i-nodes on a UNIX file system.</p>', '<p>Năm câu về liên kết và i-node trên hệ tệp UNIX.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which of these is NOT stored in an i-node?', 'Thứ nào KHÔNG được lưu trong i-node?'], [['a', 'The file name'], ['b', 'The owner and permissions'], ['c', 'The size and timestamps'], ['d', 'The pointers to the data blocks']], 'a', ['Names live in directory entries (name → i-node number), which is why one i-node can have several names (hard links).', 'Tên nằm ở mục thư mục (tên → số i-node), nên một i-node có thể có nhiều tên (hard link).']),
    mc('c2', ['After <code>ln a b</code> (hard link) and then <code>rm a</code>, what happens to the data?', 'Sau <code>ln a b</code> (hard link) rồi <code>rm a</code>, dữ liệu ra sao?'], [['a', 'It remains accessible through b; the link count drops from 2 to 1'], ['b', 'It is deleted'], ['c', 'b becomes a dangling link'], ['d', 'The i-node is duplicated']], 'a', ['The data is freed only when the link count reaches 0 (and no process has it open).', 'Dữ liệu chỉ được giải phóng khi số liên kết về 0 (và không tiến trình nào còn mở).']),
    mc('c3', ['After <code>ln -s a s</code> (symbolic link) and then <code>rm a</code>, accessing s …', 'Sau <code>ln -s a s</code> (symbolic link) rồi <code>rm a</code>, truy cập s …'], [['a', 'fails: s is a dangling link'], ['b', 'still reads the data'], ['c', 'deletes s automatically'], ['d', 'creates a new a']], 'a', ['A symlink stores a path name, not an i-node; the target is looked up each time.', 'Symlink lưu một đường dẫn chứ không phải i-node; mục tiêu được tra lại mỗi lần.']),
    mc('c4', ['Hard links cannot cross file systems because …', 'Hard link không vượt qua ranh giới hệ tệp vì …'], [['a', 'i-node numbers are only meaningful inside one file system'], ['b', 'permissions differ'], ['c', 'they need root'], ['d', 'the kernel forbids short names']], 'a', ['A directory entry holds an i-node number, valid only within its own partition. Symlinks can cross.', 'Mục thư mục chứa số i-node, chỉ có nghĩa trong cùng phân vùng. Symlink thì vượt được.']),
    mc('c5', ['A directory in UNIX is …', 'Thư mục trong UNIX là …'], [['a', 'a special file whose data is a list of (name, i-node number) entries'], ['b', 'a table in the superblock'], ['c', 'a block group'], ['d', 'a kind of device']], 'a', ['“Everything is a file”: reading a directory means reading its entries.', '“Mọi thứ đều là tệp”: đọc thư mục là đọc các mục của nó.']),
  ],
  goiY: ['The file name is a property of the directory, not of the file.', 'Link count = number of directory entries pointing to the i-node.'],
  loiHayGap: ['Believing that rm deletes the data regardless of other hard links.', 'Believing a symlink has its own copy of the data.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('hard link', 'liên kết cứng: thêm tên cho cùng i-node'), tn('symbolic link', 'liên kết mềm: tệp chứa đường dẫn'), tn('dangling link', 'liên kết treo')],
  khaiNiem: ['hard link', 'symlink', 'i-node'],
});

const bm = [[2 ** 30, KB], [2 ** 30, 4 * KB], [2 ** 40, 4 * KB], [2 ** 44, 4 * KB]];
const fmt = (n) => (n >= 2 ** 30 ? `${n / 2 ** 30} GB` : n >= 2 ** 20 ? `${n / 2 ** 20} MB` : `${n / 2 ** 10} KB`);
const nm = (n) => (n >= 2 ** 40 ? `${n / 2 ** 40} TB` : n >= 2 ** 30 ? `${n / 2 ** 30} GB` : `${n / 2 ** 20} MB`);
const E5 = tinh({
  tieuDe: 'I-node 5 — Size of the free-space bitmap',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>A bitmap uses one bit per disk block (1 = free). Give the size of the bitmap for each disk and block size (write number and unit, e.g. <code>32 KB</code>; 1 KB = 1024 B).</p>', '<p>Bitmap dùng một bit cho mỗi khối đĩa (1 = trống). Cho kích thước bitmap ứng với từng đĩa và cỡ khối (viết số và đơn vị, ví dụ <code>32 KB</code>; 1 KB = 1024 B).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Bitmap size', 'Kích thước bitmap'),
    cot: [{ ma: 'c', ten: 'Disk, block size' }, { ma: 's', ten: 'Bitmap size' }],
    hang: bm.map(([D, B], i) => ({ ma: `c${i}`, o: { c: `${nm(D)} disk, ${B / KB} KB blocks` } })),
    dapAn: Object.fromEntries(bm.map(([D, B], i) => [`c${i}.s`, [fmt(D / B / 8), fmt(D / B / 8).replace(' ', '')]])),
    giaiThich: giai(bm.map(([D, B]) => `${nm(D)} / ${B / KB} KB = ${D / B} blocks = ${D / B} bits = ${fmt(D / B / 8)}`).join('; ') + '. Larger blocks shrink the bitmap but waste more space inside files.', bm.map(([D, B]) => `${nm(D)} / ${B / KB} KB = ${D / B} khối = ${fmt(D / B / 8)}`).join('; ') + '. Khối lớn làm bitmap nhỏ đi nhưng phí nhiều hơn bên trong tệp.'),
  }],
  goiY: ['Number of blocks = disk size / block size; one bit each; divide by 8 for bytes.', 'Use powers of two to keep the arithmetic exact.'],
  loiHayGap: ['Forgetting to divide the bit count by 8.', 'Dividing the disk by the bit count instead of the block size.'],
  giaiThich: '<p>' + bm.map(([D, B]) => fmt(D / B / 8)).join(' · ') + '</p>',
  thuatNgu: [tn('bitmap', 'bản đồ bit khối trống'), tn('free list', 'danh sách khối trống')],
  khaiNiem: ['free-space management', 'bitmap'],
});

const E6 = jsDe({
  tieuDe: 'I-node 6 — Locate a byte through the indirect blocks',
  doKho: 'HARD', phut: 20,
  moTa: bi(`<p>Write <code>locate(offset, B, P, nd)</code> for a UNIX i-node with <code>nd</code> direct pointers followed by one single-, one double- and one triple-indirect pointer; blocks are <code>B</code> bytes and pointers <code>P</code> bytes. Return <code>{ level, reads }</code>: <code>level</code> = 0 for a direct block, 1, 2 or 3 for the indirection level that reaches the block; <code>reads</code> = number of disk reads to fetch the byte (indirect blocks on the path plus the data block; the i-node is in RAM). If the offset is beyond the largest possible file return <code>{ level: -1, reads: 0 }</code>.</p>`,
    `<p>Viết <code>locate(offset, B, P, nd)</code> cho i-node UNIX có <code>nd</code> con trỏ trực tiếp, rồi một con trỏ gián tiếp đơn, một đôi, một ba; khối <code>B</code> byte, con trỏ <code>P</code> byte. Trả <code>{ level, reads }</code>: <code>level</code> = 0 với khối trực tiếp, 1, 2 hoặc 3 theo mức gián tiếp tới được khối; <code>reads</code> = số lần đọc đĩa để lấy byte (các khối gián tiếp trên đường đi cộng khối dữ liệu; i-node đã ở RAM). Nếu offset vượt tệp lớn nhất có thể trả <code>{ level: -1, reads: 0 }</code>.</p>`),
  yeuCau: [bi('Work with the block number, not the byte offset.', 'Làm việc với số khối chứ không phải offset byte.')],
  viDu: [{ input: 'locate(12288, 1024, 4, 12)', output: JSON.stringify(S.locate(12288, 1024, 4, 12)), explanation: 'Block 12 is the first block behind the single-indirect pointer.|||Khối 12 là khối đầu tiên sau con trỏ gián tiếp đơn.' }],
  goiY: ['k = B / P. Direct: block < nd. Single: block < nd + k. Double: block < nd + k + k². Triple: … + k³.', 'reads = level + 1 for a valid block.'],
  loiHayGap: ['Using ≤ at the boundaries (off by one).', 'Adding the i-node as a disk read.'],
  giaiThich: '<p>The thresholds are cumulative sums of the capacity of each pointer type.</p>',
  khaiNiem: ['i-node', 'indirect blocks'],
  fn: 'locate',
  dau: "function locate(offset, B, P, nd) {\n  return { level: -1, reads: 0 };\n}\n",
  giaiMa: '// Cumulative capacity thresholds.\n' + dat(S.locate, 'locate'),
  ref: (o, B, P, nd) => S.locate(o, B, P, nd),
  cases: [{ args: [5000, 1024, 4, 12] }, { args: [12288, 1024, 4, 12] }, { args: [300000, 1024, 4, 12] }, { args: [100000000, 1024, 4, 12] }, { args: [0, 4096, 4, 10], an: true }, { args: [(10 + 1024 - 1) * 4096, 4096, 4, 10], an: true }, { args: [(10 + 1024 + 1024 * 1024) * 4096, 4096, 4, 10], an: true }, { args: [1e15, 1024, 4, 12], an: true }],
});

export default doiDau({
  slug: 'osg202-4-2-inode',
  ten: '4.2 Allocation methods, i-nodes & permissions',
  khoa: KHOA,
  baiHoc: 'osg202-4-2-inode',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void tab;
