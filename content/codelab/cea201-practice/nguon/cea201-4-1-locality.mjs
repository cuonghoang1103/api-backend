/** CEA201 · 4.1 — Locality & the cache principle (AMAT, two-level, array traversal). */
import { doiDau, KHOA, S, bi, hai, giai, tinh, mc, q, tn, bang1, r2, tab } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Locality 1 — Temporal and spatial locality',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on locality of reference and the memory hierarchy.</p>', '<p>Câu hỏi khái niệm về tính cục bộ của tham chiếu và phân cấp bộ nhớ.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A loop that keeps adding to the same variable <code>sum</code> shows mainly …', 'Vòng lặp liên tục cộng vào biến <code>sum</code> cho thấy chủ yếu …'], ['temporal locality', 'spatial locality', 'no locality', 'sequential locality of instructions only'], ['The same address is reused again and again — temporal locality.', 'Cùng một địa chỉ được dùng lại nhiều lần — cục bộ thời gian.']),
    q('c2', ['Reading <code>a[0], a[1], a[2], …</code> of an array shows mainly …', 'Đọc <code>a[0], a[1], a[2], …</code> của mảng cho thấy chủ yếu …'], ['spatial locality', 'temporal locality only', 'no locality', 'random access'], ['Neighbouring addresses are used one after the other, so a block fetch brings useful neighbours.', 'Các địa chỉ lân cận được dùng liên tiếp nên nạp một khối mang theo các ô hữu ích.']),
    q('c3', ['Why is the cache block (line) larger than one word?', 'Vì sao khối (dòng) cache lớn hơn một từ?'], ['To exploit spatial locality', 'To exploit temporal locality', 'To increase the clock rate', 'To avoid using the tag'], ['Fetching neighbours together turns later sequential accesses into hits.', 'Nạp cùng các ô lân cận biến các truy cập tuần tự sau đó thành hit.']),
    q('c4', ['Moving down the hierarchy (register → cache → RAM → disk) the access time …', 'Đi xuống phân cấp (thanh ghi → cache → RAM → đĩa) thời gian truy cập …'], ['increases while capacity increases and cost per bit decreases', 'decreases', 'stays equal', 'increases while cost per bit increases'], ['Fast memory is small and expensive; the hierarchy gives capacity of the bottom with speed of the top.', 'Bộ nhớ nhanh thì nhỏ và đắt; phân cấp cho dung lượng của tầng dưới với tốc độ của tầng trên.']),
    q('c5', ['A program with a very low hit ratio most likely has …', 'Một chương trình có tỉ lệ hit rất thấp nhiều khả năng có …'], ['poor locality or a working set larger than the cache', 'too many registers', 'a clock rate that is too high', 'a data bus that is too narrow'], ['Misses come from poor reuse (capacity/conflict) or first use (compulsory).', 'Miss đến từ ít tái sử dụng (dung lượng/xung đột) hoặc lần đầu dùng (bắt buộc).']),
  ],
  goiY: ['Temporal = same address again; spatial = nearby address next.', 'Block size above one word is the hardware answer to spatial locality.'],
  loiHayGap: ['Swapping the names temporal and spatial.', 'Thinking a bigger cache always raises the hit ratio proportionally.'],
  thuatNgu: [tn('temporal locality', 'cục bộ thời gian'), tn('spatial locality', 'cục bộ không gian')],
  khaiNiem: ['locality of reference', 'memory hierarchy'],
});

const H = [[0.95, 2, 80], [0.90, 1, 100], [0.99, 2, 150], [0.80, 3, 60]];
const E2 = tinh({
  tieuDe: 'Locality 2 — Average memory access time (AMAT) with one cache level',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Hit ratio <b>h</b>, cache access time <b>c</b> and total miss time <b>m</b> (cycles). AMAT = h × c + (1 − h) × m. Fill in the AMAT (2 decimals).</p>', '<p>Tỉ lệ hit <b>h</b>, thời gian truy cập cache <b>c</b> và thời gian khi miss <b>m</b> (chu kỳ). AMAT = h × c + (1 − h) × m. Điền AMAT (2 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['AMAT', 'AMAT'], [{ ma: 'p', ten: 'h, c, m' }, { ma: 'a', ten: 'AMAT (cycles)' }],
    H.map(([h, c, m]) => ({ o: { p: `h = ${h}, c = ${c}, m = ${m}` }, a: { a: r2(S.amat(h, c, m), 2) } })),
    [H.map(([h, c, m]) => `${h}×${c} + ${(1 - h).toFixed(2)}×${m} = ${S.amat(h, c, m).toFixed(2)}`).join('; ') + '.', H.map(([h, c, m]) => `${h}×${c} + ${(1 - h).toFixed(2)}×${m} = ${S.amat(h, c, m).toFixed(2)}`).join('; ') + '.'])],
  goiY: ['Weight each time by its probability.', '(1 − h) is the miss ratio.'],
  loiHayGap: ['Adding c and m without weights.', 'Using h as the miss ratio.'],
  thuatNgu: [tn('hit ratio', 'tỉ lệ trúng cache'), tn('AMAT', 'thời gian truy cập trung bình')],
  khaiNiem: ['AMAT'],
});

const T2 = [[0.90, 1, 0.80, 10, 100], [0.95, 2, 0.90, 12, 200], [0.85, 1, 0.50, 8, 120]];
const amat2 = (h1, t1, h2, t2, tm) => t1 + (1 - h1) * (t2 + (1 - h2) * tm);
const need = (c, m, target) => (m - target) / (m - c);
const E3 = tinh({
  tieuDe: 'Locality 3 — Two cache levels, and the hit ratio you need',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p><b>Part A.</b> Two levels: AMAT = t₁ + (1 − h₁) × (t₂ + (1 − h₂) × t_mem) where t₁, t₂ are the L1/L2 access times and h₁, h₂ the hit ratios of each level (h₂ is local). Fill in the AMAT (2 decimals).</p><p><b>Part B.</b> A single cache has c = 2 cycles and m = 100 cycles. What hit ratio is needed to reach the target AMAT? (4 decimals)</p>', '<p><b>Phần A.</b> Hai tầng: AMAT = t₁ + (1 − h₁) × (t₂ + (1 − h₂) × t_mem), t₁, t₂ là thời gian truy cập L1/L2 còn h₁, h₂ là tỉ lệ hit từng tầng (h₂ là tỉ lệ cục bộ). Điền AMAT (2 chữ số).</p><p><b>Phần B.</b> Một cache có c = 2 chu kỳ, m = 100 chu kỳ. Cần tỉ lệ hit bao nhiêu để đạt AMAT mục tiêu? (4 chữ số)</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Two-level AMAT', 'AMAT hai tầng'], [{ ma: 'p', ten: 'h₁, t₁, h₂, t₂, t_mem' }, { ma: 'a', ten: 'AMAT' }],
    T2.map(([h1, t1, h2, t2, tm]) => ({ o: { p: `h₁ = ${h1}, t₁ = ${t1}, h₂ = ${h2}, t₂ = ${t2}, t_mem = ${tm}` }, a: { a: r2(amat2(h1, t1, h2, t2, tm), 2) } })),
    [T2.map(([h1, t1, h2, t2, tm]) => `${t1} + ${(1 - h1).toFixed(2)}×(${t2} + ${(1 - h2).toFixed(2)}×${tm}) = ${amat2(h1, t1, h2, t2, tm).toFixed(2)}`).join('; ') + '.', T2.map(([h1, t1, h2, t2, tm]) => `${t1} + ${(1 - h1).toFixed(2)}×(${t2} + ${(1 - h2).toFixed(2)}×${tm}) = ${amat2(h1, t1, h2, t2, tm).toFixed(2)}`).join('; ') + '.']),
  bang1('b2', ['Required hit ratio', 'Tỉ lệ hit cần có'], [{ ma: 't', ten: 'Target AMAT' }, { ma: 'h', ten: 'Required h' }],
    [10, 5, 3].map((t) => ({ o: { t: `${t} cycles` }, a: { h: r2(need(2, 100, t), 4) } })),
    ['h = (m − target) / (m − c): ' + [10, 5, 3].map((t) => `${t} → ${need(2, 100, t).toFixed(4)}`).join('; ') + '. The closer to c, the closer h must be to 1.', 'h = (m − mục tiêu) / (m − c): ' + [10, 5, 3].map((t) => `${t} → ${need(2, 100, t).toFixed(4)}`).join('; ') + '.'])],
  goiY: ['Evaluate the inner bracket first (what a miss in L1 costs on average).', 'Solve AMAT = h·c + (1−h)·m for h.'],
  loiHayGap: ['Using h₂ as a global ratio instead of a local one.', 'Dropping t₁ (the L1 access is paid on every reference).'],
  thuatNgu: [tn('local hit ratio', 'tỉ lệ hit cục bộ của tầng')],
  khaiNiem: ['multi-level cache', 'AMAT'],
});

// duyệt mảng 16×16 int (4 B), khối 32 B, cache trực tiếp 16 dòng
const N = 16, rowM = [], colM = [], strideM = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { rowM.push(4 * (i * N + j)); colM.push(4 * (j * N + i)); }
for (let k = 0; k < 256; k++) strideM.push(4 * ((k * 8) % 256));
const rr = S.cacheSim(rowM, 32, 16, 1, 'LRU'), cc = S.cacheSim(colM, 32, 16, 1, 'LRU'), ss = S.cacheSim(strideM, 32, 16, 1, 'LRU');
const E4 = tinh({
  tieuDe: 'Locality 4 — Row-major or column-major? Count the misses',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A 16 × 16 array of 4-byte integers is stored row by row from address 0. The cache is direct-mapped, 16 lines of 32 bytes, initially empty. Three loops read all 256 elements (the third visits <code>a[(k·8) mod 256]</code> for k = 0 … 255). The numbers were obtained with the cache simulator. Fill in hits and misses.</p>', '<p>Mảng 16 × 16 số nguyên 4 byte lưu theo hàng từ địa chỉ 0. Cache ánh xạ trực tiếp, 16 dòng 32 byte, ban đầu rỗng. Ba vòng lặp đọc cả 256 phần tử (vòng thứ ba đọc <code>a[(k·8) mod 256]</code>, k = 0 … 255). Số liệu do bộ mô phỏng cache tính. Điền số hit và miss.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Misses of three traversals', 'Số miss của ba cách duyệt'], [{ ma: 'l', ten: 'Loop' }, { ma: 'h', ten: 'Hits' }, { ma: 'm', ten: 'Misses' }],
    [['Row by row: for i { for j { a[i][j] } }', rr], ['Column by column: for j { for i { a[i][j] } }', cc], ['Stride 8: a[(k·8) mod 256]', ss]].map(([n, r]) => ({ o: { l: n }, a: { h: String(r.hits), m: String(r.misses) } })),
    [`Row-major: each 32-byte line holds 8 ints, so 1 miss then 7 hits: ${rr.misses} misses. Column-major jumps 64 bytes per step, so a column uses only the even-numbered lines (8 of 16): its 16 blocks collide in pairs and every block is evicted before its neighbour element is read: ${cc.misses} misses. Stride 8 cycles over 32 different blocks that must share 16 lines: each block is evicted before it comes round again: ${ss.misses} misses.`, `Duyệt theo hàng: mỗi dòng 32 byte chứa 8 int nên 1 miss rồi 7 hit: ${rr.misses} miss. Duyệt theo cột nhảy 64 byte mỗi bước nên một cột chỉ dùng các dòng chẵn (8 trong 16): 16 khối va chạm từng đôi và mỗi khối bị đuổi trước khi đọc phần tử lân cận: ${cc.misses} miss. Bước nhảy 8 lặp vòng qua 32 khối khác nhau phải chia nhau 16 dòng: mỗi khối bị đuổi trước khi vòng quay lại: ${ss.misses} miss.`])],
  goiY: ['How many ints fit in a 32-byte line? Walk along the addresses and mark when a new line starts.', 'Direct-mapped: line = block number mod 16 — find which blocks collide.'],
  loiHayGap: ['Believing a 1 KB array that is bigger than the cache must always miss.', 'Ignoring conflict misses caused by the stride.'],
  thuatNgu: [tn('row-major order', 'lưu theo hàng'), tn('conflict miss', 'miss do xung đột')],
  khaiNiem: ['spatial locality', 'conflict misses'],
});

export default doiDau({
  slug: 'cea201-4-1-locality',
  ten: '4.1 Locality & the cache principle',
  khoa: KHOA,
  baiHoc: 'cea201-4-1-locality',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc; void tab;
