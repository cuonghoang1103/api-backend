/** CEA201 · LAB chương 4 — Mô phỏng cache đầy đủ: ánh xạ, thay thế, ghi (write-through / write-back). */
import { doiDau, KHOA, S, bi, tab, jsDe, dat } from './_ce.mjs';

const cacheLab = function cacheLab(cfg, ops) {
  var sets = cfg.lines / cfg.ways, st = [], i, hits = 0, t = 0, reads = 0, writes = 0, missBlocks = [];
  for (i = 0; i < sets; i++) st.push([]);
  for (var k = 0; k < ops.length; k++) {
    var isW = ops[k][0] === 'W', block = Math.floor(ops[k][1] / cfg.blockBytes), set = st[block % sets], pos = -1;
    for (i = 0; i < set.length; i++) if (set[i].block === block) pos = i;
    t++;
    if (pos >= 0) { hits++; if (cfg.policy === 'LRU') set[pos].t = t; }
    else {
      missBlocks.push(block); reads++;
      if (set.length === cfg.ways) {
        var v = 0;
        for (i = 1; i < set.length; i++) if (set[i].t < set[v].t) v = i;
        if (cfg.write === 'back' && set[v].dirty) writes++;
        set.splice(v, 1);
      }
      set.push({ block: block, t: t, dirty: false });
      pos = set.length - 1;
    }
    if (isW) {
      if (cfg.write === 'through') writes++;
      else set[pos].dirty = true;
    }
  }
  if (cfg.write === 'back') for (i = 0; i < sets; i++) for (var j = 0; j < st[i].length; j++) if (st[i][j].dirty) writes++;
  return { hits: hits, misses: ops.length - hits, hitRatio: Math.round(hits / ops.length * 10000) / 10000, memReads: reads, memWrites: writes, missBlocks: missBlocks };
};
const O1 = [['R', 0], ['W', 4], ['R', 64], ['W', 0], ['R', 128], ['R', 4], ['W', 64], ['R', 192], ['R', 0], ['W', 128]];
const O2 = [];
for (let i = 0; i < 24; i++) O2.push([i % 3 === 0 ? 'W' : 'R', (i * 37) % 256]);
const cfgA = { blockBytes: 16, lines: 4, ways: 1, policy: 'LRU', write: 'back' };

const LAB = jsDe({
  tieuDe: 'Lab 4 — A configurable cache simulator (mapping, replacement, write policy)',
  doKho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> You are validating the memory-system design of a small embedded CPU. Write <code>cacheLab(cfg, ops)</code> that replays a list of memory operations <code>[['R', addr], ['W', addr], …]</code> on a cache described by <code>cfg = { blockBytes, lines, ways, policy, write }</code>:</p>
<ol>
<li>The cache has <code>lines</code> lines in <code>lines / ways</code> sets; block = ⌊addr / blockBytes⌋, set = block mod sets. It starts empty.</li>
<li><code>policy</code> is <code>"LRU"</code> or <code>"FIFO"</code> (FIFO ignores hits). When a set is full evict the victim chosen by the policy.</li>
<li>Every miss — for reads <b>and</b> writes (<i>write-allocate</i>) — fetches the block from memory (<code>memReads</code> counts these fetches).</li>
<li><code>write = "through"</code>: every write operation also writes memory (<code>memWrites</code> counts write operations). <code>write = "back"</code>: a write only marks the line dirty; memory is written once for each dirty line when it is evicted, and once for each dirty line still in the cache at the end (final flush).</li>
</ol>
<p>Return <code>{ hits, misses, hitRatio, memReads, memWrites, missBlocks }</code> — <code>hitRatio</code> = hits / operations rounded to 4 decimals (<code>Math.round(x * 10000) / 10000</code>); <code>missBlocks</code> = block numbers of the misses in order.</p>
<h4>Sample run (16-byte blocks, 4 lines, direct-mapped, LRU, write-back)</h4>${tab(['#', 'op'], O1.slice(0, 6).map((o, i) => [i + 1, o.join(' ')]))}<p>Result: <code>${JSON.stringify(cacheLab(cfgA, O1.slice(0, 6)))}</code></p>`,
  `<p><b>Tình huống.</b> Bạn đang kiểm chứng thiết kế hệ nhớ của một CPU nhúng nhỏ. Viết <code>cacheLab(cfg, ops)</code> phát lại danh sách thao tác nhớ <code>[['R', addr], ['W', addr], …]</code> trên cache mô tả bởi <code>cfg = { blockBytes, lines, ways, policy, write }</code>:</p>
<ol>
<li>Cache có <code>lines</code> dòng chia thành <code>lines / ways</code> tập; khối = ⌊addr / blockBytes⌋, tập = khối mod số tập. Ban đầu rỗng.</li>
<li><code>policy</code> là <code>"LRU"</code> hoặc <code>"FIFO"</code> (FIFO bỏ qua hit). Tập đầy thì đuổi nạn nhân theo chính sách.</li>
<li>Mỗi miss — cả đọc <b>và</b> ghi (<i>write-allocate</i>) — nạp khối từ bộ nhớ (<code>memReads</code> đếm số lần nạp).</li>
<li><code>write = "through"</code>: mỗi thao tác ghi đều ghi bộ nhớ (<code>memWrites</code> đếm số thao tác ghi). <code>write = "back"</code>: ghi chỉ đánh dấu dòng bẩn; bộ nhớ được ghi một lần cho mỗi dòng bẩn khi bị đuổi, và một lần cho mỗi dòng bẩn còn trong cache lúc kết thúc (xả cuối).</li>
</ol>
<p>Trả <code>{ hits, misses, hitRatio, memReads, memWrites, missBlocks }</code> — <code>hitRatio</code> = hits / số thao tác làm tròn 4 chữ số (<code>Math.round(x * 10000) / 10000</code>); <code>missBlocks</code> = số hiệu khối của các lần miss theo thứ tự.</p>
<h4>Chạy mẫu (khối 16 byte, 4 dòng, ánh xạ trực tiếp, LRU, write-back)</h4>${tab(['#', 'thao tác'], O1.slice(0, 6).map((o, i) => [i + 1, o.join(' ')]))}<p>Kết quả: <code>${JSON.stringify(cacheLab(cfgA, O1.slice(0, 6)))}</code></p>`),
  yeuCau: [bi('Do not modify <code>ops</code> or <code>cfg</code>.', 'Không sửa <code>ops</code> hay <code>cfg</code>.'), bi('A write that misses first loads the block (write-allocate) and then counts as a write.', 'Ghi bị miss thì nạp khối trước (write-allocate) rồi mới tính là ghi.')],
  viDu: [{ input: `cacheLab(${JSON.stringify(cfgA)}, ${JSON.stringify(O1.slice(0, 4))})`, output: JSON.stringify(cacheLab(cfgA, O1.slice(0, 4))), explanation: 'Blocks 0 and 4 collide on line 0: the write to block 0 makes it dirty, and bringing block 4 in writes it back.|||Khối 0 và 4 va chạm ở dòng 0: ghi vào khối 0 làm nó bẩn, nạp khối 4 vào thì ghi trả khối 0.' }],
  goiY: ['Build the set structure first and make read-only runs match the Mapping 7 exercise.', 'Add the dirty bit and the two write policies one at a time; keep counters for fetches and memory writes.', 'Do not forget the final flush of dirty lines in write-back mode, and that a write HIT in write-back only sets the dirty bit.'],
  loiHayGap: ['Counting a write-back at every write instead of at eviction/flush.', 'Not marking the line dirty when the write misses (the block was just loaded and is written at once).', 'Updating LRU time only on misses.'],
  giaiThich: '<p>This is the core of every cache model: a set-associative container with a victim policy, plus a dirty bit that defers memory writes. Write-through writes memory on every store; write-back trades extra state (dirty bits and a final flush) for far fewer memory writes when the same line is written repeatedly.</p>',
  khaiNiem: ['cache simulation', 'write-back', 'write-through', 'write-allocate'],
  fn: 'cacheLab',
  tep: 'answer.js',
  dau: 'function cacheLab(cfg, ops) {\n  return { hits: 0, misses: 0, hitRatio: 0, memReads: 0, memWrites: 0, missBlocks: [] };\n}\n',
  giaiMa: '// Reference solution\n' + dat(cacheLab, 'cacheLab'),
  ref: cacheLab,
  cases: [
    { args: [cfgA, O1] }, { args: [{ ...cfgA, write: 'through' }, O1] }, { args: [{ blockBytes: 16, lines: 4, ways: 2, policy: 'LRU', write: 'back' }, O1] }, { args: [{ blockBytes: 16, lines: 4, ways: 4, policy: 'FIFO', write: 'back' }, O1] },
    { args: [{ blockBytes: 8, lines: 8, ways: 2, policy: 'LRU', write: 'back' }, O2], an: true }, { args: [{ blockBytes: 8, lines: 8, ways: 2, policy: 'FIFO', write: 'through' }, O2], an: true },
    { args: [{ blockBytes: 32, lines: 2, ways: 1, policy: 'LRU', write: 'back' }, [['W', 0], ['W', 4], ['W', 8], ['R', 64], ['W', 64]]], an: true },
    { args: [{ blockBytes: 16, lines: 4, ways: 4, policy: 'LRU', write: 'back' }, [['R', 0], ['R', 16], ['R', 32], ['R', 48], ['R', 0], ['R', 64], ['R', 16]]], an: true },
    { args: [{ blockBytes: 4, lines: 4, ways: 1, policy: 'LRU', write: 'back' }, [['R', 0]]], an: true },
  ],
});

export default doiDau({
  slug: 'cea201-4-lab-cache-simulator',
  ten: 'Lab 4 — A configurable cache simulator',
  khoa: KHOA,
  baiHoc: 'cea201-quiz-ch4',
  de: [LAB],
});
void S;
