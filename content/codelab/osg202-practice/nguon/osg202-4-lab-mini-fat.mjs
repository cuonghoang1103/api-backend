/**
 * OSG202 · LAB chương 4 — Hệ tệp FAT thu nhỏ: cấp phát, xoá, đọc khối, phân mảnh.
 */
import { doiDau, KHOA, bi, jsDe } from './_os.mjs';

const SRC = `function fsSim(nBlocks, ops) {
  var fat = [], files = {}, results = [], i;
  for (i = 0; i < nBlocks; i++) fat.push(null);
  function chain(first) {
    var c = [], b = first;
    while (b !== -1) { c.push(b); b = fat[b]; }
    return c;
  }
  ops.forEach(function (op) {
    var p = op.split(' ');
    if (p[0] === 'create') {
      var size = parseInt(p[2], 10), free = [];
      if (files[p[1]] !== undefined) { results.push('EXISTS'); return; }
      for (i = 0; i < nBlocks; i++) if (fat[i] === null) free.push(i);
      if (size < 1 || free.length < size) { results.push('NOSPACE'); return; }
      var take = free.slice(0, size);
      for (i = 0; i < take.length; i++) fat[take[i]] = i + 1 < take.length ? take[i + 1] : -1;
      files[p[1]] = take[0];
      results.push('OK ' + take.join(','));
    } else if (p[0] === 'delete') {
      if (files[p[1]] === undefined) { results.push('NOFILE'); return; }
      chain(files[p[1]]).forEach(function (b) { fat[b] = null; });
      delete files[p[1]];
      results.push('OK');
    } else if (p[0] === 'read') {
      if (files[p[1]] === undefined) { results.push('NOFILE'); return; }
      var c = chain(files[p[1]]), k = parseInt(p[2], 10);
      results.push(k >= 0 && k < c.length ? String(c[k]) : 'EOF');
    } else results.push('BAD');
  });
  var fragments = {}, freeCount = 0;
  Object.keys(files).sort().forEach(function (n) {
    var c = chain(files[n]).slice().sort(function (a, b) { return a - b; }), runs = 1;
    for (i = 1; i < c.length; i++) if (c[i] !== c[i - 1] + 1) runs++;
    fragments[n] = runs;
  });
  for (i = 0; i < nBlocks; i++) if (fat[i] === null) freeCount++;
  return { results: results, fat: fat, free: freeCount, fragments: fragments };
}
`;
const fsSim = new Function(`${SRC}; return fsSim;`)();
const O1 = ['create a 3', 'create b 2', 'create c 3', 'delete b', 'create d 3', 'read d 2', 'read a 5', 'create a 1', 'delete zz', 'create e 9'];
const O2 = ['create x 4', 'create y 4', 'delete x', 'create z 2', 'create w 3', 'read w 0', 'read y 3', 'read z 1'];
const O3 = ['create f 2', 'create g 2', 'create h 2', 'delete g', 'delete f', 'create i 3', 'read i 2', 'create j 2'];

const LAB = jsDe({
  tieuDe: 'Lab 4 — A mini FAT file system',
  doKho: 'HARD', phut: 45, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> Implement the core of a FAT-style file system on a tiny disk. Write <code>fsSim(nBlocks, ops)</code>. The disk has <code>nBlocks</code> blocks (numbered from 0); the FAT array has one entry per block: <code>null</code> = free, <code>-1</code> = last block of a file, otherwise the number of the next block. Operations (strings):</p>
<ul>
<li><code>'create name size'</code> — allocate <code>size</code> blocks using the <b>lowest-numbered free blocks</b> (first-free, in increasing order) and chain them. Results: <code>'OK b1,b2,…'</code> (the chain), <code>'EXISTS'</code> (name already used), <code>'NOSPACE'</code> (size &lt; 1 or not enough free blocks; nothing is allocated).</li>
<li><code>'delete name'</code> — free all blocks of the file; result <code>'OK'</code> or <code>'NOFILE'</code>.</li>
<li><code>'read name k'</code> — the DISK block number holding the k-th block (0-based) of the file, as a string; <code>'EOF'</code> if k is past the end; <code>'NOFILE'</code>.</li>
</ul>
<p>Return <code>{ results, fat, free, fragments }</code>: one result string per operation, the final FAT, the number of free blocks, and for every existing file (keys in alphabetical order) the number of <b>fragments</b> = number of runs of consecutive block numbers when the file’s blocks are sorted.</p>`,
    `<p><b>Tình huống.</b> Cài đặt phần lõi của hệ tệp kiểu FAT trên một đĩa nhỏ. Viết <code>fsSim(nBlocks, ops)</code>. Đĩa có <code>nBlocks</code> khối (đánh số từ 0); mảng FAT có một mục mỗi khối: <code>null</code> = trống, <code>-1</code> = khối cuối của tệp, ngược lại là số khối kế tiếp. Các thao tác (chuỗi):</p>
<ul>
<li><code>'create name size'</code> — cấp <code>size</code> khối lấy các <b>khối trống số nhỏ nhất</b> (first-free, tăng dần) và nối chuỗi. Kết quả: <code>'OK b1,b2,…'</code> (chuỗi khối), <code>'EXISTS'</code> (tên đã dùng), <code>'NOSPACE'</code> (size &lt; 1 hoặc không đủ khối trống; không cấp gì).</li>
<li><code>'delete name'</code> — giải phóng mọi khối của tệp; kết quả <code>'OK'</code> hoặc <code>'NOFILE'</code>.</li>
<li><code>'read name k'</code> — số khối TRÊN ĐĨA chứa khối thứ k (từ 0) của tệp, dạng chuỗi; <code>'EOF'</code> nếu k vượt cuối; <code>'NOFILE'</code>.</li>
</ul>
<p>Trả <code>{ results, fat, free, fragments }</code>: mỗi thao tác một chuỗi kết quả, FAT cuối cùng, số khối trống, và với mỗi tệp còn tồn tại (khoá theo thứ tự chữ cái) số <b>mảnh</b> = số đoạn số khối liên tiếp khi sắp các khối của tệp.</p>`),
  yeuCau: [bi('Free blocks go back to <code>null</code>; deleting must not touch other files.', 'Khối được giải phóng trở về <code>null</code>; xoá không được đụng tệp khác.')],
  viDu: [{ input: "fsSim(6, ['create a 2', 'create b 2', 'delete a', 'create c 3']).results", output: JSON.stringify(fsSim(6, ['create a 2', 'create b 2', 'delete a', 'create c 3']).results), explanation: 'After deleting a, c takes the free blocks 0,1 and then 4: it is fragmented.|||Sau khi xoá a, c lấy khối trống 0,1 rồi 4: tệp bị phân mảnh.' }],
  goiY: ['Write a helper chain(first) that follows the FAT until -1; delete, read and fragments all use it.', 'For create, collect all free indices first and check the length before changing anything.', 'Fragments: sort the block numbers and count the gaps.'],
  loiHayGap: ['Allocating blocks before checking there is enough space (a failed create must leave the disk unchanged).', 'Forgetting to clear the FAT entries when deleting.', 'Counting fragments on the chain order instead of the sorted block numbers.'],
  giaiThich: '<p>First-free allocation turns delete/create cycles into fragmentation; the FAT keeps files readable anyway, at the price of a longer chain walk. This is exactly why defragmentation tools existed.</p>',
  khaiNiem: ['FAT', 'first-free allocation', 'fragmentation'],
  fn: 'fsSim',
  tep: 'answer.js',
  dau: "function fsSim(nBlocks, ops) {\n  return { results: [], fat: [], free: nBlocks, fragments: {} };\n}\n",
  giaiMa: SRC,
  ref: fsSim,
  cases: [{ args: [10, O1] }, { args: [8, O2] }, { args: [8, O3] }, { args: [4, ['create a 4', 'create b 1', 'read a 3', 'delete a', 'create b 1', 'create b 1']], an: true }, { args: [6, ['create p 2', 'create q 2', 'create r 2', 'delete q', 'create s 2', 'create t 1']], an: true }, { args: [3, []], an: true }],
});

export default doiDau({
  slug: 'osg202-4-lab-mini-fat',
  ten: 'Lab 4 — A mini FAT file system',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch4',
  de: [LAB],
});
