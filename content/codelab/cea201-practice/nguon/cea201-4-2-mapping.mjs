/** CEA201 · 4.2 — Cache mapping & replacement: direct / set-associative / fully associative. Số do S.cacheGeom, S.cacheSim tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, r2, tab, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Mapping 1 — Direct, associative and set-associative: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Six concept questions on mapping functions, replacement and write policies.</p>', '<p>Sáu câu khái niệm về hàm ánh xạ, thuật toán thay thế và chính sách ghi.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['In a direct-mapped cache, a memory block can be placed …', 'Trong cache ánh xạ trực tiếp, một khối bộ nhớ có thể đặt …'], ['in exactly one line, chosen by (block number) mod (number of lines)', 'in any line', 'in any line of one set of 4 lines', 'only in line 0'], ['One possible line makes the hardware trivial but causes conflict misses.', 'Chỉ một dòng khả dĩ nên phần cứng đơn giản nhưng gây miss do xung đột.']),
    q('c2', ['What is the main drawback of fully associative mapping?', 'Nhược điểm chính của ánh xạ liên kết đầy đủ là gì?'], ['All tags must be compared in parallel, which is expensive for large caches', 'It causes many conflict misses', 'It cannot use LRU', 'It needs no tag'], ['Every line can hold any block, so every tag is compared at once.', 'Mọi dòng có thể chứa mọi khối nên phải so mọi tag cùng lúc.']),
    q('c3', ['A 4-way set-associative cache with 64 lines has how many sets?', 'Cache liên kết 4 đường có 64 dòng thì có bao nhiêu tập?'], ['16', '64', '4', '256'], ['sets = lines / ways = 64 / 4 = 16.', 'số tập = số dòng / số đường = 64 / 4 = 16.']),
    q('c4', ['Which replacement algorithm evicts the line that has gone unused for the longest time?', 'Thuật toán thay thế nào đuổi dòng không được dùng lâu nhất?'], ['LRU', 'FIFO', 'LFU', 'Random'], ['FIFO looks at load time, LFU at frequency, LRU at recency of use.', 'FIFO xét thời điểm nạp, LFU xét tần suất, LRU xét lần dùng gần nhất.']),
    q('c5', ['With a write-back policy, main memory is updated …', 'Với chính sách write-back, bộ nhớ chính được cập nhật …'], ['only when a dirty line is replaced (or flushed)', 'on every write', 'never', 'only on reads'], ['A dirty bit marks lines changed in the cache; they are written once on eviction.', 'Bit bẩn đánh dấu dòng đã đổi trong cache; chúng được ghi một lần khi bị đuổi.']),
    q('c6', ['Increasing the associativity (same size, same block size) usually …', 'Tăng độ liên kết (cùng dung lượng, cùng cỡ khối) thường …'], ['reduces conflict misses but costs more comparators and time', 'increases conflict misses', 'reduces compulsory misses to zero', 'removes the need for a tag'], ['More places for a block means fewer conflicts; more tags to check means more hardware.', 'Nhiều chỗ đặt hơn nên ít xung đột; nhiều tag phải kiểm hơn nên tốn phần cứng.']),
  ],
  goiY: ['Direct = 1 place, fully associative = any place, set-associative = any place within one set.', 'sets = lines / ways.'],
  loiHayGap: ['Mixing up LRU (use) and FIFO (load).', 'Thinking write-through keeps memory stale.'],
  thuatNgu: [tn('write-back', 'ghi lại khi thay'), tn('dirty bit', 'bit bẩn')],
  khaiNiem: ['direct mapping', 'associative mapping', 'replacement', 'write policy'],
});

const G = [[24, 65536, 4, 1], [32, 16384, 64, 1], [32, 32768, 32, 4], [16, 1024, 16, 2], [32, 8192, 64, 128]];
const gname = ([a, c, b, w]) => `${a}-bit address, ${c >= 1024 ? c / 1024 + ' KiB' : c + ' B'} cache, ${b}-byte blocks, ${w === c / b ? 'fully associative' : w === 1 ? 'direct-mapped' : w + '-way'}`;
const E2 = tinh({
  tieuDe: 'Mapping 2 — Split the address into tag, index and offset',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p>For each cache, how many bits are the <b>offset</b>, the <b>index</b> (set index) and the <b>tag</b>, and how many <b>sets</b> are there? (A fully associative cache has 1 set and 0 index bits.)</p>', '<p>Với mỗi cache, <b>offset</b>, <b>index</b> (chỉ số tập) và <b>tag</b> có bao nhiêu bit, và có bao nhiêu <b>tập</b>? (Cache liên kết đầy đủ có 1 tập và 0 bit index.)</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Address fields', 'Các trường địa chỉ'], [{ ma: 'c', ten: 'Cache' }, { ma: 'o', ten: 'Offset' }, { ma: 'i', ten: 'Index' }, { ma: 't', ten: 'Tag' }, { ma: 's', ten: 'Sets' }],
    G.map((g) => { const r = S.cacheGeom(...g); return { o: { c: gname(g) }, a: { o: String(r.offsetBits), i: String(r.indexBits), t: String(r.tagBits), s: String(r.sets) } }; }),
    ['offset = log₂(block); sets = cache / (block × ways); index = log₂(sets); tag = address − index − offset. ' + G.map((g) => { const r = S.cacheGeom(...g); return `(${r.tagBits}, ${r.indexBits}, ${r.offsetBits}, ${r.sets} sets)`; }).join(' '), 'offset = log₂(khối); số tập = cache / (khối × số đường); index = log₂(số tập); tag = địa chỉ − index − offset. ' + G.map((g) => { const r = S.cacheGeom(...g); return `(${r.tagBits}, ${r.indexBits}, ${r.offsetBits}, ${r.sets} tập)`; }).join(' ')])],
  goiY: ['Number of lines = cache size / block size. Divide by the ways to get the sets.', 'The tag is whatever is left of the address.'],
  loiHayGap: ['Using the number of lines (not the sets) for the index of a set-associative cache.', 'Forgetting the offset bits when computing the tag.'],
  thuatNgu: [tn('tag', 'thẻ (phần cao của địa chỉ)'), tn('set index', 'chỉ số tập')],
  khaiNiem: ['address mapping'],
});

const GA = [16, 128, 16, 1]; // 16-bit, 128 B, 16 B blocks, direct (8 lines)
const ADDR = [0x1A2C, 0x0B50, 0x3FF7, 0x1A20, 0xC001];
const gA = S.cacheGeom(...GA);
const parts = (a) => { const blk = Math.floor(a / 16); return { off: a % 16, idx: blk % gA.sets, tag: Math.floor(blk / gA.sets) }; };
const hx = (n) => n.toString(16).toUpperCase();
const E3 = tinh({
  tieuDe: 'Mapping 3 — Where does this address go? (tag, line, offset)',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>A direct-mapped cache has ${gA.lines} lines of 16 bytes on a 16-bit address (tag ${gA.tagBits} bits, line index ${gA.indexBits} bits, offset ${gA.offsetBits} bits). For each hexadecimal address give the <b>offset</b> (decimal), the <b>line index</b> (decimal) and the <b>tag</b> (hexadecimal, no prefix).</p>`, `<p>Cache ánh xạ trực tiếp có ${gA.lines} dòng 16 byte trên địa chỉ 16 bit (tag ${gA.tagBits} bit, chỉ số dòng ${gA.indexBits} bit, offset ${gA.offsetBits} bit). Với mỗi địa chỉ hex cho <b>offset</b> (thập phân), <b>chỉ số dòng</b> (thập phân) và <b>tag</b> (hex, không tiền tố).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Split of hex addresses', 'Tách địa chỉ hex'], [{ ma: 'a', ten: 'Address' }, { ma: 'o', ten: 'Offset' }, { ma: 'i', ten: 'Line' }, { ma: 't', ten: 'Tag (hex)' }],
    ADDR.map((a) => { const p = parts(a); return { o: { a: '0x' + a.toString(16).toUpperCase().padStart(4, '0') }, a: { o: String(p.off), i: String(p.idx), t: [hx(p.tag), hx(p.tag).padStart(3, '0'), hx(p.tag).toLowerCase()] } }; }),
    [ADDR.map((a) => { const p = parts(a); return `0x${hx(a)} = block ${Math.floor(a / 16)}: offset ${p.off}, line ${p.idx}, tag ${hx(p.tag)}`; }).join('; ') + '. Offset = address mod 16; line = block mod 8; tag = block div 8.', ADDR.map((a) => { const p = parts(a); return `0x${hx(a)}: offset ${p.off}, dòng ${p.idx}, tag ${hx(p.tag)}`; }).join('; ') + '. Offset = địa chỉ mod 16; dòng = khối mod 8; tag = khối div 8.'])],
  goiY: ['Write the address in binary and cut it: tag | 3-bit index | 4-bit offset.', 'The low hex digit is exactly the offset (4 bits).'],
  loiHayGap: ['Cutting the fields from the wrong end of the address.', 'Giving the tag in decimal when hex is asked.'],
  thuatNgu: [tn('block number', 'số hiệu khối')],
  khaiNiem: ['address decomposition'],
});

const REF = [32, 96, 64, 80, 96, 32, 32, 48, 96, 80, 32, 16];
const d1 = S.cacheSim(REF, 16, 4, 1, 'LRU');
const E4 = tinh({
  tieuDe: 'Mapping 4 — Direct-mapped trace: hit or miss?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>A direct-mapped cache has 4 lines of 16 bytes and starts empty. Byte addresses referenced: <code>${REF.join(', ')}</code>. For every reference say <b>Hit</b> or <b>Miss</b>; then give the total number of misses.</p>`, `<p>Cache ánh xạ trực tiếp 4 dòng 16 byte, ban đầu rỗng. Địa chỉ byte được tham chiếu: <code>${REF.join(', ')}</code>. Với mỗi tham chiếu cho biết <b>Hit</b> hay <b>Miss</b>; rồi cho tổng số miss.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Hit or miss per reference', 'Hit hay miss từng tham chiếu'], [{ ma: 'r', ten: 'Reference' }, { ma: 'x', ten: 'Result', luaChon: ['Hit', 'Miss'] }],
    d1.rows.map((r, i) => ({ o: { r: `#${i + 1}: address ${r.addr}` }, a: { x: r.hit ? 'Hit' : 'Miss' } })),
    ['block = address div 16, line = block mod 4. ' + d1.rows.map((r, i) => `#${i + 1}: block ${r.block} → line ${r.set} ${r.hit ? 'hit' : 'miss' + (r.evicted != null ? ' (evicts block ' + r.evicted + ')' : '')}`).join('; ') + '.', 'khối = địa chỉ div 16, dòng = khối mod 4. ' + d1.rows.map((r, i) => `#${i + 1}: khối ${r.block} → dòng ${r.set} ${r.hit ? 'hit' : 'miss'}`).join('; ') + '.']),
  bang1('b2', ['Total', 'Tổng'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'Value' }], [{ o: { k: 'Total misses' }, a: { v: String(d1.misses) } }], [`${d1.misses} misses out of ${REF.length}.`, `${d1.misses} miss trên ${REF.length} tham chiếu.`])],
  goiY: ['First compute block and line for each address; two blocks with the same line number evict each other.', 'A hit needs the SAME block in that line, not just a filled line.'],
  loiHayGap: ['Treating any filled line as a hit.', 'Forgetting that the first reference to a block is always a miss (compulsory).'],
  thuatNgu: [tn('compulsory miss', 'miss bắt buộc (lần đầu)'), tn('conflict miss', 'miss do xung đột')],
  khaiNiem: ['direct-mapped cache', 'hit/miss trace'],
});

const w2 = S.cacheSim(REF, 16, 4, 2, 'LRU'), w4 = S.cacheSim(REF, 16, 4, 4, 'LRU'), f2 = S.cacheSim(REF, 16, 4, 2, 'FIFO');
const E5 = tinh({
  tieuDe: 'Mapping 5 — More associativity, fewer misses? Same references, three caches',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>Use the same reference string as the previous problem (<code>${REF.join(', ')}</code>), 4 lines of 16 bytes. Give the number of <b>misses</b> for each organization and the <b>trace</b> of the 2-way LRU cache (H/M string, e.g. <code>MMHM…</code>).</p>`, `<p>Dùng lại chuỗi tham chiếu của bài trước (<code>${REF.join(', ')}</code>), 4 dòng 16 byte. Cho số <b>miss</b> của mỗi kiểu tổ chức và <b>vết</b> của cache 2 đường LRU (chuỗi H/M, vd <code>MMHM…</code>).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Misses by organization', 'Số miss theo kiểu tổ chức'], [{ ma: 'o', ten: 'Organization' }, { ma: 'm', ten: 'Misses' }],
    [['Direct-mapped (4 sets × 1 way)', d1.misses], ['2-way set-associative, LRU (2 sets)', w2.misses], ['2-way set-associative, FIFO (2 sets)', f2.misses], ['Fully associative, LRU (1 set × 4 ways)', w4.misses]].map(([n, v]) => ({ o: { o: n }, a: { m: String(v) } })),
    [`Direct ${d1.misses}, 2-way LRU ${w2.misses}, 2-way FIFO ${f2.misses}, fully associative ${w4.misses}. Associativity removes conflict misses; the fully associative cache keeps only the ${new Set(REF.map((a) => Math.floor(a / 16))).size} compulsory misses (one per distinct block).`, `Trực tiếp ${d1.misses}, 2 đường LRU ${w2.misses}, 2 đường FIFO ${f2.misses}, liên kết đầy đủ ${w4.misses}. Tăng liên kết loại bỏ miss xung đột; cache liên kết đầy đủ chỉ còn ${new Set(REF.map((a) => Math.floor(a / 16))).size} miss bắt buộc (mỗi khối khác nhau một lần).`]),
  bang1('b2', ['Trace of 2-way LRU', 'Vết 2 đường LRU'], [{ ma: 'k', ten: 'Quantity' }, { ma: 'v', ten: 'H/M string' }], [{ o: { k: '2-way LRU trace' }, a: { v: w2.trace } }], ['Set = block mod 2. Trace: ' + w2.trace + '.', 'Tập = khối mod 2. Vết: ' + w2.trace + '.'])],
  goiY: ['With 2 sets, set = block mod 2 and each set holds 2 blocks; LRU evicts the older use.', 'Count the distinct blocks in the string and compare with the 4 lines of the fully associative cache.'],
  loiHayGap: ['Using mod 4 for a 2-way cache (that would be 4 sets).', 'Updating the recency only on misses in LRU.'],
  thuatNgu: [tn('associativity', 'độ liên kết')],
  khaiNiem: ['set-associative cache', 'LRU', 'FIFO'],
});

const CB = [[32, 16384, 64, 1, false], [32, 16384, 64, 2, false], [32, 16384, 64, 4, true], [32, 16384, 64, 4, false]];
const tot = ([a, c, b, w, wb]) => { const g = S.cacheGeom(a, b, c, w); const per = 8 * b + g.tagBits + 1 + (wb ? 1 : 0); return { g, per, total: g.lines * per, data: g.lines * 8 * b }; };
const E6 = tinh({
  tieuDe: 'Mapping 6 — How many bits does the cache really contain?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A 32-bit-address cache holds 16 KiB of data in 64-byte blocks. Each line also stores a <b>tag</b>, a <b>valid</b> bit and, for write-back, a <b>dirty</b> bit. Fill in the tag size, the bits stored per line, the total number of bits of the cache and the overhead = (total − data bits) / data bits in percent (2 decimals).</p>', '<p>Cache địa chỉ 32 bit chứa 16 KiB dữ liệu trong khối 64 byte. Mỗi dòng còn lưu <b>tag</b>, bit <b>valid</b> và, với write-back, bit <b>dirty</b>. Điền kích thước tag, số bit mỗi dòng, tổng số bit của cache và tỉ lệ phụ trội = (tổng − bit dữ liệu) / bit dữ liệu (phần trăm, 2 chữ số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Total storage', 'Tổng dung lượng lưu trữ'], [{ ma: 'c', ten: 'Cache' }, { ma: 't', ten: 'Tag bits' }, { ma: 'l', ten: 'Bits per line' }, { ma: 'n', ten: 'Total bits' }, { ma: 'p', ten: 'Overhead %' }],
    CB.map((x) => { const r = tot(x); return { o: { c: `${x[3] === 1 ? 'direct-mapped' : x[3] + '-way'}, ${x[4] ? 'write-back (dirty bit)' : 'write-through'}` }, a: { t: String(r.g.tagBits), l: String(r.per), n: String(r.total), p: r2((r.total - r.data) / r.data * 100, 2) } }; }),
    [CB.map((x) => { const r = tot(x); return `tag ${r.g.tagBits}, ${r.per} bits/line × ${r.g.lines} lines = ${r.total} bits, overhead ${((r.total - r.data) / r.data * 100).toFixed(2)}%`; }).join('; ') + '.', CB.map((x) => { const r = tot(x); return `tag ${r.g.tagBits}, ${r.per} bit/dòng × ${r.g.lines} dòng = ${r.total} bit`; }).join('; ') + '.'])],
  goiY: ['lines = 16384 / 64; bits per line = 8 × 64 + tag + valid (+ dirty).', 'Every extra way removes one index bit, so the tag grows by one bit.'],
  loiHayGap: ['Counting only the data bits.', 'Forgetting the valid bit (and dirty bit for write-back).'],
  thuatNgu: [tn('valid bit', 'bit hợp lệ'), tn('overhead', 'phần phụ trội')],
  khaiNiem: ['cache size', 'tag overhead'],
});

const cacheTrace = function cacheTrace(addrs, blockBytes, lines, ways, policy) {
  var sets = lines / ways, st = [], i, hits = 0, t = 0, trace = '';
  for (i = 0; i < sets; i++) st.push([]);
  for (var k = 0; k < addrs.length; k++) {
    var block = Math.floor(addrs[k] / blockBytes), set = st[block % sets], pos = -1;
    for (i = 0; i < set.length; i++) if (set[i].block === block) pos = i;
    t++;
    if (pos >= 0) { hits++; trace += 'H'; if (policy === 'LRU') set[pos].t = t; }
    else {
      trace += 'M';
      if (set.length === ways) {
        var v = 0;
        for (i = 1; i < set.length; i++) if (set[i].t < set[v].t) v = i;
        set.splice(v, 1);
      }
      set.push({ block: block, t: t });
    }
  }
  return { hits: hits, misses: addrs.length - hits, trace: trace };
};
const R7 = [0, 4, 8, 12, 16, 0, 32, 48, 64, 0, 80, 16, 96, 32, 0];
const E7 = jsDe({
  tieuDe: 'Mapping 7 — Write a set-associative cache simulator',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>Write <code>cacheTrace(addrs, blockBytes, lines, ways, policy)</code> for a cache with <code>lines</code> lines organised in <code>lines / ways</code> sets, starting empty. A byte address belongs to block <code>⌊addr / blockBytes⌋</code> and set <code>block mod sets</code>. <code>policy</code> is <code>"LRU"</code> or <code>"FIFO"</code> (FIFO ignores hits). Return <code>{ hits, misses, trace }</code> where <code>trace</code> has one letter per reference, <code>H</code> or <code>M</code>.</p>', '<p>Viết <code>cacheTrace(addrs, blockBytes, lines, ways, policy)</code> cho cache có <code>lines</code> dòng chia thành <code>lines / ways</code> tập, ban đầu rỗng. Địa chỉ byte thuộc khối <code>⌊addr / blockBytes⌋</code> và tập <code>khối mod số tập</code>. <code>policy</code> là <code>"LRU"</code> hoặc <code>"FIFO"</code> (FIFO bỏ qua hit). Trả <code>{ hits, misses, trace }</code> với <code>trace</code> mỗi tham chiếu một chữ <code>H</code> hoặc <code>M</code>.</p>'),
  yeuCau: [bi('<code>ways = 1</code> is direct-mapped; <code>ways = lines</code> is fully associative.', '<code>ways = 1</code> là trực tiếp; <code>ways = lines</code> là liên kết đầy đủ.'), bi('A set may hold at most <code>ways</code> blocks.', 'Một tập chứa tối đa <code>ways</code> khối.')],
  viDu: [{ input: 'cacheTrace([0, 64, 0, 64], 16, 4, 1, "LRU")', output: JSON.stringify(cacheTrace([0, 64, 0, 64], 16, 4, 1, 'LRU')), explanation: 'Blocks 0 and 4 share line 0 of a direct-mapped cache: they keep evicting each other.|||Khối 0 và 4 cùng dòng 0 của cache trực tiếp: chúng đuổi nhau liên tục.' }],
  goiY: ['Keep an array of sets; each set is an array of {block, time} objects.', 'On a hit with LRU update the time; with FIFO leave it alone.', 'When a set is full evict the entry with the smallest time.'],
  loiHayGap: ['Updating the time on a FIFO hit.', 'Using the address (not the block) to find the set.'],
  giaiThich: '<p>Direct, set-associative and fully associative caches are the same machine with a different number of sets: only the set count and the victim choice vary.</p>',
  khaiNiem: ['cache simulation', 'LRU', 'FIFO'],
  fn: 'cacheTrace',
  dau: 'function cacheTrace(addrs, blockBytes, lines, ways, policy) {\n  return { hits: 0, misses: 0, trace: "" };\n}\n',
  giaiMa: dat(cacheTrace, 'cacheTrace'),
  ref: cacheTrace,
  cases: [{ args: [R7, 16, 4, 1, 'LRU'] }, { args: [R7, 16, 4, 2, 'LRU'] }, { args: [R7, 16, 4, 4, 'FIFO'] }, { args: [[0, 64, 0, 64], 16, 4, 1, 'LRU'] }, { args: [REF, 16, 4, 2, 'FIFO'], an: true }, { args: [[0, 8, 16, 24, 32, 40, 0], 8, 4, 4, 'LRU'], an: true }, { args: [[5, 5, 5], 4, 2, 1, 'FIFO'], an: true }, { args: [[0, 32, 64, 0, 32, 64, 0], 32, 2, 2, 'LRU'], an: true }],
});

export default doiDau({
  slug: 'cea201-4-2-mapping',
  ten: '4.2 Cache mapping & replacement',
  khoa: KHOA,
  baiHoc: 'cea201-4-2-mapping',
  de: [E1, E2, E3, E4, E5, E6, E7],
});
void hai; void giai; void mc; void tab;
