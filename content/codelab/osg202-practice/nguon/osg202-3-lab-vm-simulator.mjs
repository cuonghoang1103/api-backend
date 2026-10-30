/**
 * OSG202 · LAB chương 3 — Mô phỏng bộ nhớ ảo: TLB + bảng trang + thay trang.
 */
import { doiDau, KHOA, bi, tab, jsDe } from './_os.mjs';

const SRC = `function vmSim(pageSize, nFrames, tlbSize, algo, addrs) {
  var frames = [], loadT = [], useT = [], tlb = [];
  for (var i = 0; i < nFrames; i++) { frames.push(null); loadT.push(0); useT.push(0); }
  var faults = 0, hits = 0, phys = [];
  for (var t = 0; t < addrs.length; t++) {
    var a = addrs[t], page = Math.floor(a / pageSize), off = a % pageSize, f = -1, k;
    var ti = -1;
    for (k = 0; k < tlb.length; k++) if (tlb[k].page === page) ti = k;
    if (ti >= 0) {
      hits++; f = tlb[ti].frame;
      var e = tlb.splice(ti, 1)[0]; tlb.push(e);
    } else {
      f = frames.indexOf(page);
      if (f < 0) {
        faults++;
        f = frames.indexOf(null);
        if (f < 0) {
          var v = 0;
          for (i = 1; i < nFrames; i++) {
            if (algo === 'FIFO' ? loadT[i] < loadT[v] : useT[i] < useT[v]) v = i;
          }
          f = v;
          for (k = tlb.length - 1; k >= 0; k--) if (tlb[k].page === frames[v]) tlb.splice(k, 1);
        }
        frames[f] = page; loadT[f] = t;
      }
      if (tlbSize > 0) {
        if (tlb.length === tlbSize) tlb.shift();
        tlb.push({ page: page, frame: f });
      }
    }
    useT[f] = t;
    phys.push(f * pageSize + off);
  }
  return { tlbHits: hits, pageFaults: faults, phys: phys };
}
`;
const vmSim = new Function(`${SRC}; return vmSim;`)();
const A1 = [0, 10, 20, 1024, 1030, 0, 1040, 2048, 2050, 2060, 1024, 5, 3072, 3080, 3090, 0, 1031, 2048];
const A2 = [0, 5, 4096, 4100, 8192, 0, 4097, 8200, 12288, 12290, 4096, 0, 8193];
const A3 = [100, 200, 1100, 150, 1200, 2100, 160, 1150, 3100, 170, 2150, 4100, 180, 1160];

const LAB = jsDe({
  tieuDe: 'Lab 3 — A tiny virtual-memory machine (TLB + page table + replacement)',
  doKho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> You are building the memory-management unit of a teaching OS. Write <code>vmSim(pageSize, nFrames, tlbSize, algo, addrs)</code> that executes a list of virtual addresses and reports what the hardware and the OS did.</p>
<ol>
<li>Split each address into <code>page = ⌊addr / pageSize⌋</code> and <code>offset = addr mod pageSize</code>.</li>
<li><b>TLB</b>: fully associative, <code>tlbSize</code> entries, LRU replacement; a hit costs nothing else. <code>tlbSize = 0</code> means no TLB.</li>
<li>On a TLB miss consult the <b>page table</b> (is the page in a frame?). If it is not resident this is a <b>page fault</b>: use the lowest-numbered free frame, or if all frames are used evict the victim chosen by <code>algo</code> — <code>'FIFO'</code> (oldest LOAD) or <code>'LRU'</code> (oldest USE; every reference, TLB hit or not, updates the use time). The evicted page must also be removed from the TLB.</li>
<li>After a miss the translation is inserted in the TLB (evicting its LRU entry when full).</li>
<li>Physical address = <code>frame × pageSize + offset</code>.</li>
</ol>
<p>Return <code>{ tlbHits, pageFaults, phys }</code> where <code>phys</code> is the list of physical addresses. Frames are numbered from 0; all frames are free at the start.</p>
<h4>Sample run (pageSize 1024, 3 frames, 2 TLB entries, LRU)</h4>${tab(['#', 'address'], A1.slice(0, 5).map((a, i) => [i + 1, a]))}`,
    `<p><b>Tình huống.</b> Bạn xây bộ quản lý bộ nhớ (MMU) cho một hệ điều hành dạy học. Viết <code>vmSim(pageSize, nFrames, tlbSize, algo, addrs)</code> thực thi danh sách địa chỉ ảo và báo cáo phần cứng cùng OS đã làm gì.</p>
<ol>
<li>Tách mỗi địa chỉ thành <code>page = ⌊addr / pageSize⌋</code> và <code>offset = addr mod pageSize</code>.</li>
<li><b>TLB</b>: kết hợp đầy đủ, <code>tlbSize</code> ô, thay theo LRU; hit không tốn gì thêm. <code>tlbSize = 0</code> nghĩa là không có TLB.</li>
<li>Khi TLB trượt, tra <b>bảng trang</b> (trang có trong khung không?). Nếu không có là <b>lỗi trang</b>: dùng khung trống số nhỏ nhất, hoặc nếu hết khung thì đuổi nạn nhân do <code>algo</code> chọn — <code>'FIFO'</code> (nạp sớm nhất) hoặc <code>'LRU'</code> (dùng lâu nhất; mọi tham chiếu, TLB hit hay không, đều cập nhật thời điểm dùng). Trang bị đuổi cũng phải bị xoá khỏi TLB.</li>
<li>Sau khi trượt, bản dịch được chèn vào TLB (đuổi mục LRU khi đầy).</li>
<li>Địa chỉ vật lý = <code>frame × pageSize + offset</code>.</li>
</ol>
<p>Trả <code>{ tlbHits, pageFaults, phys }</code> với <code>phys</code> là danh sách địa chỉ vật lý. Khung đánh số từ 0; ban đầu mọi khung đều trống.</p>
<h4>Chạy mẫu (pageSize 1024, 3 khung, TLB 2 ô, LRU)</h4>${tab(['#', 'address'], A1.slice(0, 5).map((a, i) => [i + 1, a]))}`),
  yeuCau: [bi('Keep the TLB as an array ordered from least to most recently used.', 'Giữ TLB là mảng xếp từ ít đến nhiều được dùng gần đây nhất.'), bi('Do not modify <code>addrs</code>.', 'Không sửa <code>addrs</code>.')],
  viDu: [{ input: 'vmSim(1024, 3, 2, \'LRU\', [0, 10, 1024, 1030, 100]).phys', output: JSON.stringify(vmSim(1024, 3, 2, 'LRU', [0, 10, 1024, 1030, 100]).phys), explanation: 'Address 10 hits the TLB entry of page 0; 1030 hits page 1’s; 100 hits page 0’s again.|||Địa chỉ 10 trúng mục TLB của trang 0; 1030 trúng trang 1; 100 lại trúng trang 0.' }],
  goiY: ['Write the TLB part first, then the page-table part, then the replacement; test each with a tiny trace on paper.', 'Remember to update the “last use” of the frame on EVERY reference, including TLB hits (LRU needs it).', 'When you evict a page, remove its TLB entry, otherwise the TLB would translate to a frame that now holds another page.'],
  loiHayGap: ['Leaving a stale TLB entry for an evicted page.', 'Updating the LRU time only on page faults.', 'Counting a page fault on a TLB miss when the page is already resident (that is only a TLB miss).'],
  giaiThich: '<p>This is the memory-management hardware/software boundary in 40 lines: the TLB is a cache of the page table; the page table says what is resident; the replacement policy decides who leaves. Every bug listed above is a classic inconsistency between those three structures.</p>',
  khaiNiem: ['TLB', 'page table', 'page replacement', 'virtual memory'],
  fn: 'vmSim',
  tep: 'answer.js',
  dau: "function vmSim(pageSize, nFrames, tlbSize, algo, addrs) {\n  return { tlbHits: 0, pageFaults: 0, phys: [] };\n}\n",
  giaiMa: SRC,
  ref: vmSim,
  cases: [
    { args: [1024, 3, 2, 'LRU', A1] }, { args: [1024, 3, 2, 'FIFO', A1] }, { args: [1024, 3, 0, 'LRU', A1] }, { args: [1024, 2, 2, 'LRU', A3] },
    { args: [1024, 3, 2, 'FIFO', A3], an: true }, { args: [4096, 3, 2, 'LRU', A2], an: true }, { args: [4096, 2, 2, 'FIFO', A2], an: true }, { args: [512, 1, 1, 'LRU', [0, 600, 0, 600, 5]], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-3-lab-vm-simulator',
  ten: 'Lab 3 — A tiny virtual-memory machine',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch3',
  de: [LAB],
});
