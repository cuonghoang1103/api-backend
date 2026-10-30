/**
 * OSG202 · 3.2 — Page faults & page replacement: FIFO · LRU · OPT · Clock · Belady. Mọi số do S.replace tính
 * (đã kiểm với ví dụ Silberschatz 15/12/9 và Belady 9/10 trong _kiem-sim.mjs).
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const CONV = 'Frames are filled in order while free; no pre-paging; the OPT tie (several pages never used again) is resolved by the lowest frame number.';
const CONV_VI = 'Khung được lấp theo thứ tự khi còn trống; không nạp trước; OPT hoà (nhiều trang không dùng lại) chọn khung số nhỏ nhất.';
const ref = (a) => a.join(' ');

/* Bài 1 EASY: đếm lỗi trang 3 thuật toán */
const R1 = [1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2, 1, 2, 3, 6];
const NA = ['FIFO', 'LRU', 'OPT'];
const E1 = tinh({
  tieuDe: 'Replacement 1 — Count the page faults of FIFO, LRU and OPT',
  doKho: 'EASY', phut: 10,
  moTa: bi(`<p>Reference string: <code>${ref(R1)}</code>. Memory has 3 frames, initially empty. How many page faults does each algorithm cause (the first loads of the empty frames count)?</p><p>${CONV}</p>`,
    `<p>Chuỗi tham chiếu: <code>${ref(R1)}</code>. Bộ nhớ có 3 khung, ban đầu rỗng. Mỗi thuật toán gây bao nhiêu lỗi trang (các lần nạp đầu vào khung trống cũng tính)?</p><p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Page faults with 3 frames', 'Lỗi trang với 3 khung'),
    cot: [{ ma: 'a', ten: 'Algorithm' }, { ma: 'f', ten: 'Faults' }],
    hang: NA.map((a) => ({ ma: a, o: { a } })),
    dapAn: Object.fromEntries(NA.map((a) => [`${a}.f`, String(S.replace(a, R1, 3).faults)])),
    giaiThich: giai(NA.map((a) => `${a}: ${S.replace(a, R1, 3).faults}`).join(', ') + '. OPT is the lower bound; LRU approximates it by looking at the past.', NA.map((a) => `${a}: ${S.replace(a, R1, 3).faults}`).join(', ') + '. OPT là cận dưới; LRU xấp xỉ nó bằng cách nhìn về quá khứ.'),
  }],
  goiY: ['Write the frame contents after every reference; mark F for a fault and H for a hit.', 'OPT evicts the page whose next use is farthest in the future (or never).'],
  loiHayGap: ['Not counting the faults that fill the empty frames.', 'Evicting by “least recently LOADED” (FIFO) when the question asks for LRU, or the other way round.'],
  giaiThich: '<p>' + NA.map((a) => `${a} = ${S.replace(a, R1, 3).faults}`).join(' · ') + '</p>',
  thuatNgu: [tn('reference string', 'chuỗi tham chiếu trang'), tn('victim page', 'trang nạn nhân bị đuổi'), tn('OPT / Belady’s optimal', 'thuật toán tối ưu: cần biết tương lai')],
  khaiNiem: ['FIFO', 'LRU', 'OPT', 'page faults'],
});

/* Bài 2 MEDIUM: F/H từng bước FIFO */
const R2 = [3, 2, 1, 3, 4, 1, 6, 2, 4, 3, 4, 2, 1, 4, 5, 2, 1, 3, 4];
const f2 = S.replace('FIFO', R2, 3);
const E2 = tinh({
  tieuDe: 'Replacement 2 — FIFO step by step: hit or fault?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>FIFO with 3 frames on <code>${ref(R2)}</code>. For every reference say whether it is a <b>Hit</b> or a <b>Fault</b>; finally give the total number of faults.</p><p>${CONV}</p>`,
    `<p>FIFO với 3 khung trên <code>${ref(R2)}</code>. Với mỗi tham chiếu cho biết <b>Hit</b> hay <b>Fault</b>; cuối cùng cho tổng số lỗi trang.</p><p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Hit / Fault per reference', 'Hit / Fault từng tham chiếu'),
    cot: [{ ma: 'r', ten: 'Reference' }, { ma: 'x', ten: 'Result', luaChon: ['Hit', 'Fault'] }],
    hang: R2.map((p, i) => ({ ma: `s${i + 1}`, o: { r: `#${i + 1}: page ${p}` } })),
    dapAn: Object.fromEntries(f2.rows.map((r, i) => [`s${i + 1}.x`, r.fault ? 'Fault' : 'Hit'])),
    giaiThich: giai('Frames after each step: ' + f2.rows.map((r, i) => `#${i + 1} ${r.fault ? 'F' : 'H'} [${r.frames.join(',')}]`).join('; ') + `. Total = ${f2.faults}.`, 'Khung sau mỗi bước: ' + f2.rows.map((r, i) => `#${i + 1} ${r.fault ? 'F' : 'H'} [${r.frames.join(',')}]`).join('; ') + `. Tổng = ${f2.faults}.`),
  }, {
    ma: 'b2', de: hai('Total', 'Tổng'),
    cot: [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }],
    hang: [{ ma: 'tot', o: { k: 'Total page faults' } }],
    dapAn: { 'tot.v': String(f2.faults) },
    giaiThich: giai(`Total = ${f2.faults} faults out of ${R2.length} references.`, `Tổng = ${f2.faults} lỗi trên ${R2.length} tham chiếu.`),
  }],
  goiY: ['Keep the queue in arrival order: the oldest page is at the front and is evicted first, even if it was used a moment ago.', 'A hit does NOT change the FIFO order.'],
  loiHayGap: ['Moving a page to the back of the queue on a hit (that is LRU).', 'Forgetting that the first three distinct pages always fault.'],
  giaiThich: '<p>' + f2.rows.map((r) => (r.fault ? 'F' : 'H')).join('') + ` — ${f2.faults} faults.</p>`,
  thuatNgu: [tn('FIFO', 'đuổi trang nạp sớm nhất')],
  khaiNiem: ['FIFO'],
});

/* Bài 3 MEDIUM: trang bị đuổi (LRU) */
const R3 = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2, 6, 1, 4];
const l3 = S.replace('LRU', R3, 3);
const lanLoi = l3.rows.map((r, i) => ({ r, i })).filter((x) => x.r.fault);
const E3 = tinh({
  tieuDe: 'Replacement 3 — LRU: which page is evicted at each fault?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>LRU with 3 frames on <code>${ref(R3)}</code>. For each page fault give the page that is evicted (write <code>none</code> when a free frame is used).</p>`,
    `<p>LRU với 3 khung trên <code>${ref(R3)}</code>. Với mỗi lỗi trang cho trang bị đuổi (viết <code>none</code> nếu dùng khung trống).</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Evicted page', 'Trang bị đuổi'),
    cot: [{ ma: 'f', ten: 'Fault at reference' }, { ma: 'e', ten: 'Evicted page' }],
    hang: lanLoi.map(({ r, i }) => ({ ma: `f${i + 1}`, o: { f: `#${i + 1} (page ${r.page})` } })),
    dapAn: Object.fromEntries(lanLoi.map(({ r, i }) => [`f${i + 1}.e`, r.evicted === null ? 'none' : String(r.evicted)])),
    giaiThich: giai(lanLoi.map(({ r, i }) => `#${i + 1}: ${r.evicted === null ? 'free frame' : 'evict ' + r.evicted} → [${r.frames.join(',')}]`).join('; ') + `. ${l3.faults} faults in total.`, lanLoi.map(({ r, i }) => `#${i + 1}: ${r.evicted === null ? 'khung trống' : 'đuổi ' + r.evicted}`).join('; ') + `. Tổng ${l3.faults} lỗi.`),
  }],
  goiY: ['For every page in memory remember WHEN it was last used (not when it was loaded).', 'The victim is the page with the oldest last-use time.'],
  loiHayGap: ['Using the load time (that is FIFO).', 'Not updating the last-use time on a hit.'],
  giaiThich: '<p>' + lanLoi.map(({ r, i }) => `#${i + 1}→${r.evicted === null ? 'none' : r.evicted}`).join(' · ') + '</p>',
  thuatNgu: [tn('LRU', 'đuổi trang lâu không dùng nhất')],
  khaiNiem: ['LRU'],
});

/* Bài 4 MEDIUM: Belady */
const RB = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5];
const E4 = tinh({
  tieuDe: 'Replacement 4 — Belady’s anomaly: more frames, more faults?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>Reference string <code>${ref(RB)}</code>. Count the faults with 3 and with 4 frames.</p>`, `<p>Chuỗi tham chiếu <code>${ref(RB)}</code>. Đếm lỗi trang với 3 và với 4 khung.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Faults', 'Số lỗi trang'),
    cot: [{ ma: 'a', ten: 'Algorithm' }, { ma: 'f3', ten: '3 frames' }, { ma: 'f4', ten: '4 frames' }, { ma: 'an', ten: 'More frames ⇒ more faults?', luaChon: ['Yes', 'No'] }],
    hang: NA.map((a) => ({ ma: a, o: { a } })),
    dapAn: Object.fromEntries(NA.flatMap((a) => { const x = S.replace(a, RB, 3).faults, y = S.replace(a, RB, 4).faults; return [[`${a}.f3`, String(x)], [`${a}.f4`, String(y)], [`${a}.an`, y > x ? 'Yes' : 'No']]; })),
    giaiThich: giai(NA.map((a) => `${a}: ${S.replace(a, RB, 3).faults} → ${S.replace(a, RB, 4).faults}`).join(', ') + '. Only FIFO shows the anomaly. LRU and OPT are stack algorithms: the set of pages in n frames is always a subset of the set in n+1 frames, so adding a frame can never add a fault.', NA.map((a) => `${a}: ${S.replace(a, RB, 3).faults} → ${S.replace(a, RB, 4).faults}`).join(', ') + '. Chỉ FIFO bị nghịch lý. LRU và OPT là thuật toán dạng ngăn xếp: tập trang trong n khung luôn là tập con của n+1 khung nên thêm khung không thể thêm lỗi.'),
  }],
  goiY: ['Run FIFO twice (3 and 4 frames); write the queue after each reference.', 'Stack algorithms (LRU, OPT) never show the anomaly.'],
  loiHayGap: ['Assuming more frames can never hurt (true for LRU/OPT, false for FIFO).', 'Counting the final state instead of every fault.'],
  giaiThich: '<p>' + NA.map((a) => `${a} ${S.replace(a, RB, 3).faults}→${S.replace(a, RB, 4).faults}`).join(' · ') + '</p>',
  thuatNgu: [tn('Belady’s anomaly', 'nghịch lý Belady: thêm khung lại tăng lỗi'), tn('stack algorithm', 'thuật toán ngăn xếp')],
  khaiNiem: ['Belady anomaly', 'stack algorithms'],
});

/* Bài 5 MEDIUM: Clock */
const RC = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2];
const c5 = S.replace('CLOCK', RC, 3);
const fifo5 = S.replace('FIFO', RC, 3);
const E5 = tinh({
  tieuDe: 'Replacement 5 — Second chance (Clock) versus FIFO',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Clock (second chance) with 3 frames on <code>${ref(RC)}</code>. A newly loaded page gets reference bit 1; a hit sets the bit to 1; on a fault the hand skips pages with bit 1 (clearing it) until it finds a page with bit 0, replaces it, and moves to the next frame. The hand starts at frame 0; free frames are filled first (frame 0, 1, 2). Give the number of faults for Clock and for FIFO, and the pages in frames 0, 1, 2 at the end for Clock.</p>`,
    `<p>Clock (cơ hội thứ hai) với 3 khung trên <code>${ref(RC)}</code>. Trang mới nạp có bit tham chiếu 1; một lần hit đặt bit về 1; khi lỗi, kim quét bỏ qua các trang có bit 1 (xoá bit) tới khi gặp trang có bit 0, thay nó, rồi chuyển sang khung kế. Kim bắt đầu ở khung 0; khung trống được lấp trước (khung 0, 1, 2). Cho số lỗi của Clock và của FIFO, và các trang ở khung 0, 1, 2 lúc cuối của Clock.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Results', 'Kết quả'),
    cot: [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }],
    hang: [['cf', 'Clock faults'], ['ff', 'FIFO faults'], ['f0', 'Clock: page in frame 0'], ['f1', 'Clock: page in frame 1'], ['f2', 'Clock: page in frame 2']].map(([m, k]) => ({ ma: m, o: { k } })),
    dapAn: { 'cf.v': String(c5.faults), 'ff.v': String(fifo5.faults), 'f0.v': String(c5.rows[c5.rows.length - 1].frames[0]), 'f1.v': String(c5.rows[c5.rows.length - 1].frames[1]), 'f2.v': String(c5.rows[c5.rows.length - 1].frames[2]) },
    giaiThich: giai('Clock trace: ' + c5.rows.map((r, i) => `#${i + 1} ${r.fault ? 'F' : 'H'} [${r.frames.join(',')}]`).join('; ') + `. Clock = ${c5.faults} faults, FIFO = ${fifo5.faults}. Clock protects recently used pages, like a cheap LRU.`, 'Vết Clock: ' + c5.rows.map((r, i) => `#${i + 1} ${r.fault ? 'F' : 'H'} [${r.frames.join(',')}]`).join('; ') + `. Clock = ${c5.faults} lỗi, FIFO = ${fifo5.faults}. Clock bảo vệ trang vừa dùng, như LRU rẻ tiền.`),
  }],
  goiY: ['Keep (page, R bit) for the 3 frames plus the hand position.', 'After replacing at position h, the hand moves to h+1.'],
  loiHayGap: ['Setting the reference bit of a newly loaded page to 0.', 'Not clearing bits while the hand passes over them.'],
  giaiThich: `<p>Clock ${c5.faults} faults, FIFO ${fifo5.faults}; final frames [${c5.rows[c5.rows.length - 1].frames.join(', ')}].</p>`,
  thuatNgu: [tn('second chance / Clock', 'thuật toán cơ hội thứ hai (kim đồng hồ)'), tn('reference bit', 'bit tham chiếu')],
  khaiNiem: ['Clock', 'second chance'],
});

/* Bài 6 MEDIUM: khái niệm */
const E6 = tinh({
  tieuDe: 'Replacement 6 — NRU, aging, working set: which is which?',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five conceptual questions about page-replacement algorithms and demand paging.</p>', '<p>Năm câu khái niệm về các thuật toán thay trang và phân trang theo yêu cầu.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Why is true LRU rarely implemented exactly?', 'Vì sao LRU chính xác hiếm khi được cài đặt?'], [['a', 'It needs a list/timestamp updated on EVERY memory reference'], ['b', 'It needs to know which page is referenced next'], ['c', 'It suffers from Belady’s anomaly on most strings'], ['d', 'It cannot handle dirty pages without writing them first']], 'a', ['Hardware support at every access is too expensive, so OSes approximate LRU (Clock, aging, NRU).', 'Hỗ trợ phần cứng ở mọi lần truy cập quá đắt nên OS dùng xấp xỉ LRU (Clock, aging, NRU).']),
    mc('c2', ['Why can OPT not be implemented in a real OS?', 'Vì sao OS thật không cài được OPT?'], [['a', 'It requires knowing future references'], ['b', 'It is too slow'], ['c', 'It suffers Belady’s anomaly'], ['d', 'It needs a TLB']], 'a', ['OPT is the benchmark that other algorithms are compared with.', 'OPT là chuẩn để so sánh các thuật toán khác.']),
    mc('c3', ['NRU puts pages in four classes by (R, M). Which class is evicted first?', 'NRU chia trang thành bốn lớp theo (R, M). Lớp nào bị đuổi trước?'], [['a', 'R = 0, M = 0 (not referenced, not modified)'], ['b', 'R = 1, M = 1 (referenced, modified)'], ['c', 'R = 0, M = 1 (not referenced, modified)'], ['d', 'R = 1, M = 0 (referenced, not modified)']], 'a', ['The ideal victim is unused and clean: no write-back needed and unlikely to be used soon. Class 2 (R=0, M=1) is better to evict than class 1 (R=1, M=0).', 'Nạn nhân lý tưởng là không dùng và sạch: không cần ghi lại và ít khả năng dùng sớm. Lớp (R=0, M=1) bị đuổi trước lớp (R=1, M=0).']),
    mc('c4', ['Demand paging means …', 'Phân trang theo yêu cầu (demand paging) nghĩa là …'], [['a', 'a page is brought into memory only when it is referenced'], ['b', 'all pages of a process are loaded at start-up'], ['c', 'pages are never swapped out'], ['d', 'the page size grows on demand']], 'a', ['Pages are loaded lazily on the first access (page fault).', 'Trang được nạp muộn ở lần truy cập đầu (lỗi trang).']),
    mc('c5', ['Local replacement (per-process) versus global replacement: which is TRUE?', 'Thay trang cục bộ (theo tiến trình) so với toàn cục: phát biểu nào ĐÚNG?'], [['a', 'Local isolates a process: it cannot steal frames from others, but it may leave frames idle'], ['b', 'Global can never cause thrashing'], ['c', 'Local needs no page table'], ['d', 'Global gives every process the same number of frames']], 'a', ['Global replacement adapts better to changing needs, but a faulting process can steal frames and spread thrashing.', 'Thay toàn cục thích nghi tốt hơn nhưng một tiến trình lỗi nhiều có thể “cướp” khung và lan thrashing.']),
  ],
  goiY: ['OPT = needs the future. LRU = needs per-reference bookkeeping.', 'Evicting a clean page costs one fewer disk write.'],
  loiHayGap: ['Believing LRU suffers Belady’s anomaly.', 'Mixing up the classes of NRU (the order is 0, 1, 2, 3 = (R,M) = (0,0), (0,1), (1,0), (1,1)).'],
  thuatNgu: [tn('demand paging', 'nạp trang khi cần'), tn('NRU', 'không dùng gần đây'), tn('global replacement', 'thay trang toàn cục')],
  khaiNiem: ['LRU', 'OPT', 'NRU', 'demand paging'],
});

/* Bài 7 HARD: viết bộ thay trang */
const trace = (algo, refs, nf) => { const r = S.replace(algo, refs, nf); return { faults: r.faults, trace: r.rows.map((x) => (x.fault ? 'F' : 'H')).join('') }; };
const E7 = jsDe({
  tieuDe: 'Replacement 7 — Write a page-replacement simulator',
  doKho: 'HARD', phut: 30,
  moTa: bi(`<p>Write <code>simulate(algo, refs, frames)</code> for <code>algo</code> ∈ <code>'FIFO'</code>, <code>'LRU'</code>, <code>'OPT'</code>, <code>'CLOCK'</code>. Return <code>{ faults, trace }</code> where <code>trace</code> is a string with one letter per reference: <code>'F'</code> (page fault) or <code>'H'</code> (hit). ${CONV} For CLOCK: a newly loaded page and every hit set the reference bit to 1; the hand starts at frame 0 and moves to the frame after the replaced one.</p>`,
    `<p>Viết <code>simulate(algo, refs, frames)</code> với <code>algo</code> ∈ <code>'FIFO'</code>, <code>'LRU'</code>, <code>'OPT'</code>, <code>'CLOCK'</code>. Trả <code>{ faults, trace }</code>, trong đó <code>trace</code> là chuỗi, mỗi tham chiếu một chữ: <code>'F'</code> (lỗi trang) hoặc <code>'H'</code> (hit). ${CONV_VI} Với CLOCK: trang mới nạp và mỗi lần hit đặt bit tham chiếu về 1; kim bắt đầu ở khung 0 và chuyển sang khung sau khung bị thay.</p>`),
  yeuCau: [bi('Frames hold page numbers; use an array of fixed length for CLOCK.', 'Khung chứa số trang; dùng mảng độ dài cố định cho CLOCK.')],
  viDu: [{ input: "simulate('FIFO', [1,2,3,4,1,2,5,1,2,3,4,5], 3)", output: JSON.stringify(trace('FIFO', RB, 3)), explanation: 'Belady’s string: 9 faults with 3 frames.|||Chuỗi Belady: 9 lỗi với 3 khung.' }],
  goiY: ['One loop over the references; on a hit update the algorithm’s metadata (last use, R bit) and keep going.', 'OPT looks AHEAD: refs.indexOf(page, i + 1) is the next use (−1 = never).'],
  loiHayGap: ['Updating the load time on a hit in FIFO.', 'In OPT choosing the page used soonest instead of the one used farthest.'],
  giaiThich: '<p>Each algorithm differs only in the victim choice: oldest load (FIFO), oldest use (LRU), farthest next use (OPT), first page with R = 0 after the hand (CLOCK).</p>',
  khaiNiem: ['page replacement', 'simulation'],
  fn: 'simulate',
  dau: "function simulate(algo, refs, frames) {\n  return { faults: 0, trace: '' };\n}\n",
  giaiMa: '// Reference solution: replace() returns rows; we keep only faults and the F/H trace.\n' + dat(S.replace, 'replace') + '\nfunction simulate(algo, refs, frames) {\n  var r = replace(algo, refs, frames);\n  return { faults: r.faults, trace: r.rows.map(function (x) { return x.fault ? \'F\' : \'H\'; }).join(\'\') };\n}\n',
  ref: trace,
  cases: [
    { args: ['FIFO', RB, 3] }, { args: ['LRU', R1, 3] }, { args: ['OPT', R1, 3] }, { args: ['CLOCK', RC, 3] },
    { args: ['FIFO', RB, 4], an: true }, { args: ['LRU', [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], 3], an: true },
    { args: ['OPT', [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1], 3], an: true },
    { args: ['CLOCK', [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5], 3], an: true },
    { args: ['LRU', [1, 1, 1, 1], 2], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-3-2-thay-trang',
  ten: '3.2 Page faults & replacement',
  khoa: KHOA,
  baiHoc: 'osg202-3-2-thay-trang',
  de: [E1, E2, E3, E4, E5, E6, E7],
});
void hai; void tab;
