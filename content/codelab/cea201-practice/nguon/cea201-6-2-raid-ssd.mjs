/** CEA201 · 6.2 — RAID levels, parity and SSD. Số do S.raidUsable / S.raidRecover tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'RAID 1 — Levels, striping, mirroring, parity and SSDs',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on RAID and solid-state drives.</p>', '<p>Câu hỏi khái niệm về RAID và ổ thể rắn.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['RAID 0 provides …', 'RAID 0 cung cấp …'], ['striping for speed with no redundancy', 'mirroring', 'single parity', 'double parity'], ['One failed disk destroys the whole array.', 'Một đĩa hỏng làm mất cả mảng.']),
    q('c2', ['RAID 1 stores …', 'RAID 1 lưu …'], ['two copies of the data on separate disks (mirroring)', 'parity on one dedicated disk', 'data only', 'parity spread across all disks'], ['Half the raw capacity is usable; reads can be served from either copy.', 'Một nửa dung lượng thô dùng được; đọc có thể phục vụ từ bản nào cũng được.']),
    q('c3', ['RAID 5 distributes …', 'RAID 5 phân tán …'], ['parity blocks across all the disks', 'data on one disk and parity on another', 'copies on every disk', 'nothing'], ['Rotating parity avoids a single parity-disk bottleneck.', 'Parity xoay vòng tránh nút cổ chai ở một đĩa parity.']),
    q('c4', ['What does RAID 6 add over RAID 5?', 'RAID 6 thêm gì so với RAID 5?'], ['A second independent parity: it survives two disk failures', 'Mirroring', 'Faster writes', 'Smaller capacity cost than RAID 5'], ['Two parity blocks per stripe allow two erasures to be recovered.', 'Hai khối parity mỗi dải cho phép phục hồi hai ổ hỏng.']),
    q('c5', ['Why do SSDs apply wear levelling?', 'Vì sao SSD dùng cân bằng mài mòn (wear levelling)?'], ['Flash cells survive only a limited number of erase cycles, so writes are spread out', 'To make reads faster, by moving popular blocks close to the controller', 'To refresh the cells in time, because flash loses its charge within seconds', 'To compress data, so that each block stores more bits and lasts longer'], ['Spreading erases evenly makes all blocks wear out together, later.', 'Rải đều lần xoá để mọi khối mòn cùng lúc và muộn hơn.']),
    q('c6', ['Compared with a hard disk, an SSD …', 'So với đĩa cứng, SSD …'], ['has no mechanical seek or rotation, so random access is far faster', 'always has a lower cost per GB, because flash chips have no moving parts', 'is volatile, so it needs a battery to keep data at power-off', 'needs a longer seek, because the blocks are spread over many chips'], ['No moving parts removes the positioning cost.', 'Không có bộ phận chuyển động nên không có chi phí định vị.']),
  ],
  goiY: ['0 = speed, 1 = copy, 5 = one parity, 6 = two parities.', 'SSD = flash: no seek, but limited erase cycles.'],
  loiHayGap: ['Thinking RAID 0 is redundant.', 'Treating RAID as a substitute for backups.'],
  thuatNgu: [tn('striping', 'chia dải'), tn('mirroring', 'nhân bản (gương)'), tn('wear levelling', 'cân bằng mài mòn')],
  khaiNiem: ['RAID', 'SSD'],
});

const LV = [[0, 4], [1, 4], [5, 4], [6, 6], [10, 8]];
const TOL = { 0: '0', 1: '1', 5: '1', 6: '2', 10: '1' };
const lname = (l) => (l === 10 ? 'RAID 10' : 'RAID ' + l);
const E2 = tinh({
  tieuDe: 'RAID 2 — Usable capacity and guaranteed fault tolerance',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Each disk holds 4 TB. For each array give the <b>usable capacity</b> (TB) and the number of disk failures it is <b>guaranteed</b> to survive (RAID 10 can survive more failures if they hit different mirror pairs, but only 1 is guaranteed).</p>', '<p>Mỗi đĩa 4 TB. Với mỗi mảng cho <b>dung lượng dùng được</b> (TB) và số đĩa hỏng mà nó <b>chắc chắn</b> chịu được (RAID 10 có thể chịu nhiều hơn nếu các lỗi rơi vào các cặp gương khác nhau, nhưng chỉ 1 là chắc chắn).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['RAID capacity and tolerance', 'Dung lượng và khả năng chịu lỗi của RAID'], [{ ma: 'a', ten: 'Array' }, { ma: 'u', ten: 'Usable (TB)' }, { ma: 'f', ten: 'Guaranteed failures' }],
    LV.map(([l, n]) => ({ o: { a: `${lname(l)} with ${n} disks` }, a: { u: String(S.raidUsable(l, n) * 4), f: TOL[l] } })),
    [LV.map(([l, n]) => `${lname(l)}, ${n} disks: ${S.raidUsable(l, n) * 4} TB, ${TOL[l]} failure(s)`).join('; ') + '.', LV.map(([l, n]) => `${lname(l)}, ${n} đĩa: ${S.raidUsable(l, n) * 4} TB, chịu ${TOL[l]} lỗi`).join('; ') + '.'])],
  goiY: ['RAID 0: n; RAID 1/10: n/2; RAID 5: n − 1; RAID 6: n − 2.', 'Guaranteed = true in the worst case.'],
  loiHayGap: ['Giving RAID 5 a capacity of n/2.', 'Claiming RAID 10 survives any two failures.'],
  thuatNgu: [tn('usable capacity', 'dung lượng hữu dụng')],
  khaiNiem: ['RAID levels'],
});

const ST = [[0b10110010, 0b01101100, 0b11100001, 0b00011111], [0xA5, 0x3C, 0x0F, 0x81], [201, 17, 96, 130]];
const par = (r) => r.reduce((a, b) => a ^ b, 0);
const E3 = tinh({
  tieuDe: 'RAID 3 — Compute parity and rebuild a lost disk (XOR)',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>In RAID 5 the parity of a stripe is the XOR of its data blocks. <b>Part A.</b> Compute the parity block (decimal) of each stripe of 4 data blocks. <b>Part B.</b> In the stripes below one block (marked <b>?</b>) was lost with a failed disk — rebuild it (decimal). Values are 8-bit.</p>', '<p>Trong RAID 5 parity của một dải là XOR các khối dữ liệu. <b>Phần A.</b> Tính khối parity (thập phân) của từng dải 4 khối dữ liệu. <b>Phần B.</b> Ở các dải dưới đây một khối (ký hiệu <b>?</b>) mất cùng ổ hỏng — dựng lại nó (thập phân). Giá trị 8 bit.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Parity', 'Parity'], [{ ma: 's', ten: 'Stripe data' }, { ma: 'p', ten: 'Parity' }],
    ST.map((r) => ({ o: { s: r.join(', ') }, a: { p: String(par(r)) } })),
    [ST.map((r) => `${r.join(' ⊕ ')} = ${par(r)}`).join('; ') + '.', ST.map((r) => `${r.join(' ⊕ ')} = ${par(r)}`).join('; ') + '.']),
  bang1('b2', ['Rebuild', 'Dựng lại'], [{ ma: 's', ten: 'Stripe (data and parity, one lost)' }, { ma: 'x', ten: 'Lost value' }],
    ST.map((r, i) => { const all = [...r, par(r)]; const lost = i % 4; const view = all.map((v, j) => (j === lost ? '?' : v)); return { o: { s: view.join(', ') }, a: { x: String(all[lost]) } }; }),
    ['XOR of all surviving blocks (data and parity) = the lost block: ' + ST.map((r, i) => { const all = [...r, par(r)]; const lost = i % 4; return String(all[lost]); }).join(', ') + '.', 'XOR mọi khối còn lại (dữ liệu và parity) = khối bị mất.'])],
  goiY: ['XOR is its own inverse: a ⊕ a = 0.', 'The XOR of data and parity together is always 0, so the lost block is the XOR of the others.'],
  loiHayGap: ['Adding the blocks instead of XOR-ing them.', 'Forgetting to include the parity block when rebuilding.'],
  thuatNgu: [tn('XOR', 'cộng loại trừ'), tn('parity block', 'khối parity')],
  khaiNiem: ['RAID 5 parity'],
});

const IO = [[150, 4, 0], [150, 4, 1], [150, 6, 5], [150, 8, 6], [150, 8, 10]];
const wIops = (d, n, l) => ({ 0: n * d, 1: (n * d) / 2, 5: (n * d) / 4, 6: (n * d) / 6, 10: (n * d) / 2 })[l];
const E4 = tinh({
  tieuDe: 'RAID 4 — The small-write penalty',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Each disk delivers 150 random IOPS. A random <b>read</b> costs 1 disk I/O in every level. A random <b>write</b> costs 1 (RAID 0), 2 (RAID 1 and 10), 4 (RAID 5: read old data, read old parity, write new data, write new parity) or 6 (RAID 6) disk I/Os. Give the array’s random read IOPS and random write IOPS.</p>', '<p>Mỗi đĩa cho 150 IOPS ngẫu nhiên. Một lần <b>đọc</b> ngẫu nhiên tốn 1 I/O đĩa ở mọi cấp. Một lần <b>ghi</b> ngẫu nhiên tốn 1 (RAID 0), 2 (RAID 1 và 10), 4 (RAID 5: đọc dữ liệu cũ, đọc parity cũ, ghi dữ liệu mới, ghi parity mới) hoặc 6 (RAID 6) I/O đĩa. Cho IOPS đọc và IOPS ghi ngẫu nhiên của mảng.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Random IOPS', 'IOPS ngẫu nhiên'], [{ ma: 'a', ten: 'Array' }, { ma: 'r', ten: 'Read IOPS' }, { ma: 'w', ten: 'Write IOPS' }],
    IO.map(([d, n, l]) => ({ o: { a: `${lname(l)}, ${n} disks × ${d} IOPS` }, a: { r: String(n * d), w: r2(wIops(d, n, l), 1) } })),
    [IO.map(([d, n, l]) => `${lname(l)}: read ${n * d}, write ${wIops(d, n, l)}`).join('; ') + '. Parity RAID is cheap on capacity but pays on small writes.', IO.map(([d, n, l]) => `${lname(l)}: đọc ${n * d}, ghi ${wIops(d, n, l)}`).join('; ') + '.'])],
  goiY: ['Total disk I/O capacity = disks × 150; divide by the I/Os per operation.', 'Reads use every disk (1 I/O each).'],
  loiHayGap: ['Forgetting the read-modify-write cost of RAID 5.', 'Applying the write penalty to reads.'],
  thuatNgu: [tn('IOPS', 'số thao tác I/O mỗi giây'), tn('small-write penalty', 'phí ghi nhỏ')],
  khaiNiem: ['small write problem'],
});

const raid5Rebuild = function raid5Rebuild(stripes, failed) {
  var out = [];
  for (var i = 0; i < stripes.length; i++) {
    var x = 0;
    for (var j = 0; j < stripes[i].length; j++) if (j !== failed) x ^= stripes[i][j];
    out.push(x);
  }
  return out;
};
const E5 = jsDe({
  tieuDe: 'RAID 5 — Rebuild a failed disk',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>A RAID 5 array has <code>stripes</code>: <code>stripes[i]</code> is the list of the blocks of stripe <i>i</i> across the disks (data and parity, the parity may be on any disk). Disk number <code>failed</code> died and its entries are unreadable (their values in the input must be ignored). Write <code>raid5Rebuild(stripes, failed)</code> returning the list of the values that were stored on the failed disk, stripe by stripe.</p>', '<p>Mảng RAID 5 có <code>stripes</code>: <code>stripes[i]</code> là danh sách các khối của dải <i>i</i> trên các đĩa (dữ liệu và parity, parity có thể ở đĩa bất kỳ). Đĩa số <code>failed</code> đã hỏng và các phần tử của nó không đọc được (giá trị trong đầu vào phải bị bỏ qua). Viết <code>raid5Rebuild(stripes, failed)</code> trả danh sách giá trị từng nằm trên đĩa hỏng, theo từng dải.</p>'),
  viDu: [{ input: 'raid5Rebuild([[5, 6, 3], [1, 2, 3]], 0)', output: JSON.stringify(raid5Rebuild([[5, 6, 3], [1, 2, 3]], 0)), explanation: '6 xor 3 = 5 and 2 xor 3 = 1.|||6 xor 3 = 5 và 2 xor 3 = 1.' }],
  goiY: ['In every stripe the XOR of ALL blocks (data and parity) is 0.', 'Therefore the missing block is the XOR of the surviving blocks.', 'Use the operator ^ and skip index failed.'],
  loiHayGap: ['Including the failed disk’s garbage value in the XOR.', 'Adding instead of XOR-ing.'],
  giaiThich: '<p>Parity = d₁ ⊕ d₂ ⊕ … ⊕ dₙ, so any one block equals the XOR of all the others; that is why a single failure of any disk (data or parity) is recoverable.</p>',
  khaiNiem: ['RAID 5', 'XOR parity'],
  fn: 'raid5Rebuild',
  dau: 'function raid5Rebuild(stripes, failed) {\n  return [];\n}\n',
  giaiMa: dat(raid5Rebuild, 'raid5Rebuild'),
  ref: raid5Rebuild,
  cases: [{ args: [[[5, 6, 3], [1, 2, 3]], 0] }, { args: [[[10, 20, 30, 0], [7, 7, 0, 7]], 3] }, { args: [[[255, 1, 254]], 1] }, { args: [[[90, 61, 17, 33, 99], [1, 2, 3, 4, 5], [200, 100, 50, 25, 12]], 2], an: true }, { args: [[], 0], an: true }, { args: [[[0, 0], [9, 9]], 1], an: true }],
});

export default doiDau({
  slug: 'cea201-6-2-raid-ssd',
  ten: '6.2 RAID, SSD & optical storage',
  khoa: KHOA,
  baiHoc: 'cea201-6-2-raid-ssd',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc; void S;
