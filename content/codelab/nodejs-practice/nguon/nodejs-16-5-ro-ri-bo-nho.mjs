/** Node.js 16.5 — Rò bộ nhớ: bình nguyên hay rò, cache không giới hạn, listener không gỡ, so hai heap snapshot, chuỗi giữ, heap vs container, exit 134 vs 137. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Plateau or leak, the warning not to silence, and the kill with no message', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 16.5 (four modes of the same app, 100k requests, Node 22).',
  vi: 'Câu hỏi về bài 16.5 (bốn chế độ của cùng một app, 100k request, Node 22).',
  cau: [
    q('c1', ['The app with NO cache went 56.9 MB → 121.7 MB after 20k requests, then 123.4, 123.4. Is that a leak?', 'App KHÔNG có cache đi 56,9 MB → 121,7 MB sau 20k request, rồi 123,4, 123,4. Đó có phải rò không?'],
      ['No: V8 grows its heap to a working size, compiles code, then it plateaus', 'Yes: memory doubled, so something is never released', 'Yes: any growth after startup is a leak by definition', 'Cannot tell: RSS is not related to JavaScript memory at all'],
      ['Rises and plateaus = normal; rises with traffic = leak. One measurement after startup tells you nothing — you need the shape, at least three points under load.', 'Tăng rồi đi ngang = bình thường; tăng theo lưu lượng = rò. Một lần đo sau khởi động không nói gì — cần hình dạng, ít nhất ba điểm dưới tải.']),
    q('c2', ['Node prints MaxListenersExceededWarning: 11 customEvent listeners added to [process]. Use emitter.setMaxListeners() to increase limit. The right response?', 'Node in MaxListenersExceededWarning: 11 customEvent listeners added to [process]. Use emitter.setMaxListeners() to increase limit. Phản ứng đúng là gì?'],
      ['Find who adds a listener per request and never removes it: use off(), once() or an AbortSignal', 'Call process.setMaxListeners(0) so the warning stops appearing in the logs', 'Restart the process every night so the listeners are cleared', 'Ignore it: the warning is cosmetic and costs no memory'],
      ['The emitter never dies, so every closure it holds stays reachable — with the req, res and body they captured. 100,000 listeners = 146.9 MB and rising.', 'Emitter không bao giờ chết, nên mọi closure nó giữ vẫn còn với tới được — cùng req, res và body chúng đã bắt. 100.000 listener = 146,9 MB và vẫn tăng.']),
    q('c3', ['In a node:22-alpine container started with --memory=512m and no flag, v8.getHeapStatistics().heap_size_limit was about…', 'Trong container node:22-alpine chạy với --memory=512m và không cờ nào, v8.getHeapStatistics().heap_size_limit khoảng…'],
      ['259 MB: Node 22 sizes the heap from the container limit, about half', '4,144 MB: Node ignores the container and uses the host RAM', '512 MB: the heap limit always equals the container limit', '64 MB: containers force the smallest V8 heap'],
      ['With --memory=2g it was 1,048 MB. --max-old-space-size lets you choose, but leave room outside the heap for Buffers, native modules, stacks and code.', 'Với --memory=2g là 1.048 MB. --max-old-space-size cho bạn tự chọn, nhưng chừa chỗ ngoài heap cho Buffer, module native, stack và mã.']),
    qn('c4', ['Which statements about heap snapshots are true? (choose all that apply)', 'Những câu nào về heap snapshot là đúng? (chọn mọi câu đúng)'],
      ['Taking one blocks the event loop: 56.4 MB of heap blocked ~1 s', 'The file is about the size of the heap', 'Read the retainers: what holds the object is the culprit', 'They also show Buffer memory, so they explain exit 137 in a container'],
      [0, 1, 2],
      ['Snapshots answer “what is held”; RSS over time answers “is there a leak”. A Buffer lives outside V8’s heap: 30 × 8 MB gave RSS 282 MB with heapUsed 4 MB.', 'Snapshot trả lời “cái gì đang bị giữ”; RSS theo thời gian trả lời “có rò không”. Buffer nằm ngoài heap của V8: 30 × 8 MB cho RSS 282 MB trong khi heapUsed 4 MB.']),
  ],
  goiY: [['Look at the shape of the curve, not at one point.', 'Nhìn hình dạng đường cong, không nhìn một điểm.'], ['The warning names the emitter and the event.', 'Cảnh báo nêu tên emitter và sự kiện.']],
  loi: [['Calling the first doubling a leak and “fixing” healthy code.', 'Gọi lần nhân đôi đầu tiên là rò và “sửa” mã đang khoẻ.'], ['Silencing MaxListenersExceededWarning.', 'Tắt tiếng MaxListenersExceededWarning.']],
  tns: [tn('RSS', 'bộ nhớ thường trú', 'all memory the process holds, heap or not'), tn('heap snapshot', 'ảnh chụp heap'), tn('retainer', 'đối tượng giữ', 'what keeps an object reachable')],
  kn: ['memory', 'V8'],
});

function diagnoseCrash({ exitCode, rssMb, heapUsedMb, arrayBuffersMb, externalMb }) {
  // 134 = 128 + 6 (SIGABRT): V8 tự dừng — "FATAL ERROR: … JavaScript heap out of memory" ⇒ rò trong heap.
  if (exitCode === 134) return { cause: 'heap', next: 'take two heap snapshots and read the retainers' };
  // 137 = 128 + 9 (SIGKILL): kernel giết, KHÔNG có thông điệp nào. Heap nhỏ mà RSS lớn ⇒ bộ nhớ nằm ngoài heap.
  if (exitCode === 137) {
    if (arrayBuffersMb + externalMb > heapUsedMb) return { cause: 'outside-heap', next: 'look at Buffers: uploads, images, compression, unbounded streams' };
    return { cause: 'killed', next: 'compare RSS with the container limit, and check the grace period' };
  }
  return { cause: 'not-memory', next: 'read the logs above the exit' };
}
const E2 = await jsBai({
  ten: 'diagnoseCrash(stats): exit 134 or 137, heap or Buffers?', kho: 'EASY', phut: 7,
  en: '<p>Two ways to die. Write <code>diagnoseCrash({ exitCode, rssMb, heapUsedMb, arrayBuffersMb, externalMb })</code> (the last <code>process.memoryUsage()</code> values before the crash):</p><ul><li><code>134</code> → <code>{ cause: "heap", next: "take two heap snapshots and read the retainers" }</code>;</li><li><code>137</code> and <code>arrayBuffersMb + externalMb &gt; heapUsedMb</code> → <code>{ cause: "outside-heap", next: "look at Buffers: uploads, images, compression, unbounded streams" }</code>;</li><li>other <code>137</code> → <code>{ cause: "killed", next: "compare RSS with the container limit, and check the grace period" }</code>;</li><li>anything else → <code>{ cause: "not-memory", next: "read the logs above the exit" }</code>.</li></ul>',
  vi: '<p>Hai cách chết. Viết <code>diagnoseCrash({ exitCode, rssMb, heapUsedMb, arrayBuffersMb, externalMb })</code> (giá trị <code>process.memoryUsage()</code> cuối cùng trước khi sập):</p><ul><li><code>134</code> → <code>{ cause: "heap", next: "take two heap snapshots and read the retainers" }</code>;</li><li><code>137</code> và <code>arrayBuffersMb + externalMb &gt; heapUsedMb</code> → <code>{ cause: "outside-heap", next: "look at Buffers: uploads, images, compression, unbounded streams" }</code>;</li><li><code>137</code> còn lại → <code>{ cause: "killed", next: "compare RSS with the container limit, and check the grace period" }</code>;</li><li>còn lại → <code>{ cause: "not-memory", next: "read the logs above the exit" }</code>.</li></ul>',
  goiY: [['134 = 128 + 6 (SIGABRT, V8’s own fatal error); 137 = 128 + 9 (SIGKILL from the kernel).', '134 = 128 + 6 (SIGABRT, lỗi chết của chính V8); 137 = 128 + 9 (SIGKILL từ kernel).'], ['Check the exit code first, then compare memory outside vs inside the heap.', 'Xét mã thoát trước, rồi so bộ nhớ ngoài heap với trong heap.']],
  loi: [['Taking heap snapshots for a 137 with heapUsed 4 MB: the heap was never the problem.', 'Chụp heap snapshot cho một 137 với heapUsed 4 MB: heap chưa bao giờ là vấn đề.'], ['Raising --max-old-space-size to fix a Buffer leak: it limits the heap only, so it never triggers.', 'Tăng --max-old-space-size để sửa rò Buffer: nó chỉ giới hạn heap nên không bao giờ kích hoạt.']],
  gt: ['A heap leak with --max-old-space-size=64 printed FATAL ERROR … JavaScript heap out of memory and exited 134 — you know exactly what happened. A Buffer leak in a 128 MB container printed rss 161 MB · heapUsed 4 MB and then exit 137 with no message: the kernel’s SIGKILL.', 'Rò heap với --max-old-space-size=64 in FATAL ERROR … JavaScript heap out of memory rồi thoát 134 — bạn biết chính xác chuyện gì. Rò Buffer trong container 128 MB in rss 161 MB · heapUsed 4 MB rồi exit 137 không lời nào: SIGKILL của kernel.'],
  kn: ['memory', 'exit codes'],
  tns: [tn('arrayBuffers', 'arrayBuffers', 'memory of Buffers / ArrayBuffers, outside the V8 heap'), tn('OOM killer', 'trình diệt hết bộ nhớ', 'the kernel killing a process over its limit')],
  dau: `/** why did the container die? */
function diagnoseCrash({ exitCode, rssMb, heapUsedMb, arrayBuffersMb, externalMb }) {
  // Write your solution here
  if (exitCode === 134 || exitCode === 137) return { cause: 'heap', next: 'take two heap snapshots and read the retainers' };
  return { cause: 'not-memory', next: 'read the logs above the exit' };
}
`,
  giai: '// Reference solution\n' + nguon(diagnoseCrash),
  cases: [
    { goi: 'diagnoseCrash({ exitCode: 137, rssMb: 161, heapUsedMb: 4, arrayBuffersMb: 144, externalMb: 2 })', moTa: ['The Buffer leak in a 128 MB container', 'Rò Buffer trong container 128 MB'] },
    { goi: 'diagnoseCrash({ exitCode: 134, rssMb: 120, heapUsedMb: 63, arrayBuffersMb: 0, externalMb: 1 })', moTa: ['--max-old-space-size=64 and a growing Map', '--max-old-space-size=64 và một Map phình ra'] },
    { goi: 'diagnoseCrash({ exitCode: 137, rssMb: 900, heapUsedMb: 480, arrayBuffersMb: 20, externalMb: 5 })', an: true },
    { goi: 'diagnoseCrash({ exitCode: 1, rssMb: 80, heapUsedMb: 30, arrayBuffersMb: 1, externalMb: 1 })', an: true },
  ],
});

function classifyRss(points) {
  // points: [{ requests, rssMb }] theo thứ tự tải tăng dần. Bỏ bước đầu (V8 đang lên kích thước làm việc).
  if (points.length < 3) return { verdict: 'not enough data', growth: [] };
  const growth = [];
  for (let i = 2; i < points.length; i++) {
    const prev = points[i - 1].rssMb;
    growth.push(Number((((points[i].rssMb - prev) / prev) * 100).toFixed(1)));
  }
  const leak = growth.every((g) => g >= 2);                 // vẫn tăng ở MỌI bước sau khi khởi động ⇒ tăng theo lưu lượng
  return { verdict: leak ? 'leak' : 'plateau', growth };
}
const P = (...xs) => xs.map(([requests, rssMb]) => ({ requests, rssMb }));
const E3 = await jsBai({
  ten: 'classifyRss(points): rises and plateaus, or rises with traffic?', kho: 'MEDIUM', phut: 10,
  en: '<p>RSS was sampled under load: <code>points = [{ requests, rssMb }]</code> in increasing order of requests, starting at startup. Write <code>classifyRss(points)</code>: with fewer than 3 points return <code>{ verdict: "not enough data", growth: [] }</code>. Otherwise <b>ignore the first step</b> (startup → first sample, the warm-up), and for every later step compute the growth in percent of the previous RSS, rounded to 1 decimal. Verdict <code>"leak"</code> if every one of those steps grew by at least 2%, else <code>"plateau"</code>. Return <code>{ verdict, growth }</code>.</p>',
  vi: '<p>RSS được đo dưới tải: <code>points = [{ requests, rssMb }]</code> theo thứ tự số request tăng dần, bắt đầu lúc khởi động. Viết <code>classifyRss(points)</code>: ít hơn 3 điểm thì trả <code>{ verdict: "not enough data", growth: [] }</code>. Không thì <b>bỏ bước đầu</b> (khởi động → mẫu đầu, giai đoạn làm nóng), và với mỗi bước sau đó tính mức tăng theo phần trăm của RSS trước, làm tròn 1 chữ số. Kết luận <code>"leak"</code> nếu mọi bước đó đều tăng ít nhất 2%, không thì <code>"plateau"</code>. Trả về <code>{ verdict, growth }</code>.</p>',
  goiY: [['Start the loop at i = 2: the step from points[0] to points[1] is the warm-up.', 'Bắt đầu vòng lặp ở i = 2: bước từ points[0] tới points[1] là giai đoạn làm nóng.'], ['growth = (cur − prev) / prev × 100.', 'growth = (hiện tại − trước) / trước × 100.']],
  loi: [['Including the warm-up step: the healthy no-cache app doubled there and would be called a leak.', 'Tính cả bước làm nóng: app khoẻ không cache đã nhân đôi ở đó và sẽ bị gọi là rò.'], ['Deciding from one sample: “120 MB” means nothing without the shape.', 'Kết luận từ một mẫu: “120 MB” không có nghĩa gì nếu thiếu hình dạng.']],
  gt: ['none: 56.9 → 121.7 → 123.4 → 123.4 is a plateau; the unbounded Map: 154.4 → 238 → 349.5 MB keeps climbing; the listener leak climbs more slowly (122.4 → 131.5 → 146.9) but on every step. A leak grows with traffic, so it is the slope after warm-up that gives it away.', 'none: 56,9 → 121,7 → 123,4 → 123,4 là bình nguyên; Map không giới hạn: 154,4 → 238 → 349,5 MB vẫn leo; rò listener leo chậm hơn (122,4 → 131,5 → 146,9) nhưng ở mọi bước. Rò tăng theo lưu lượng, nên chính độ dốc sau khi làm nóng tố cáo nó.'],
  kn: ['memory', 'measurement'],
  tns: [tn('plateau', 'bình nguyên', 'flat after growing to a working size'), tn('warm-up', 'làm nóng')],
  dau: `/** is the memory curve a leak? */
function classifyRss(points) {
  // Write your solution here
  if (points.length < 2) return { verdict: 'not enough data', growth: [] };
  const first = points[0].rssMb, last = points[points.length - 1].rssMb;
  return { verdict: last > first * 1.5 ? 'leak' : 'plateau', growth: [] };
}
`,
  giai: '// Reference solution\n' + nguon(classifyRss),
  cases: [
    { goi: goi('classifyRss', P([0, 56.9], [20000, 121.7], [50000, 123.4], [100000, 123.4])), moTa: ['No cache: the control', 'Không cache: nhóm đối chứng'] },
    { goi: goi('classifyRss', P([0, 56.9], [20000, 154.4], [50000, 238], [100000, 349.5])), moTa: ['The unbounded Map', 'Map không giới hạn'] },
    { goi: goi('classifyRss', P([0, 56.9], [20000, 122.4], [50000, 131.5], [100000, 146.9])), an: true },
    { goi: goi('classifyRss', P([0, 56.9], [20000, 124.8])), an: true },
    { goi: goi('classifyRss', P([0, 56.9], [20000, 121.0], [50000, 124.8], [100000, 124.8])), an: true },
  ],
});

function createCache(max, { lru = false } = {}) {
  const m = new Map();                                   // Map giữ thứ tự CHÈN ⇒ khoá đầu tiên là khoá cũ nhất
  return {
    get(k) {
      if (!m.has(k)) return undefined;
      const v = m.get(k);
      if (lru) { m.delete(k); m.set(k, v); }             // LRU thật: lần trúng làm mới vị trí
      return v;
    },
    set(k, v) {
      if (m.has(k)) m.delete(k);
      else if (m.size >= max) m.delete(m.keys().next().value);   // đầy ⇒ bỏ khoá cũ nhất TRƯỚC khi thêm
      m.set(k, v);
    },
    keys: () => [...m.keys()],
    size: () => m.size,
  };
}
const E4 = await jsBai({
  ten: 'createCache(max, { lru }): the one condition that fixes leak 1 — and FIFO vs real LRU', kho: 'MEDIUM', phut: 14,
  en: '<p>Leak 1 was a module-level <code>Map</code> keyed by URL with no ceiling. Write <code>createCache(max, { lru })</code> returning <code>{ get, set, keys, size }</code> backed by one <code>Map</code>:</p><ul><li><code>set(k, v)</code> — if <code>k</code> exists, replace it and move it to the newest position; otherwise, if the cache already holds <code>max</code> entries, delete the <b>oldest</b> key first (<code>m.keys().next().value</code>), then add;</li><li><code>get(k)</code> — the value or <code>undefined</code>; when <code>lru</code> is true a hit also moves <code>k</code> to the newest position (delete + set). With <code>lru</code> false (the default) it is FIFO: hits change nothing;</li><li><code>keys()</code> — keys from oldest to newest; <code>size()</code>.</li></ul>',
  vi: '<p>Rò 1 là một <code>Map</code> cấp module, khoá theo URL, không có trần. Viết <code>createCache(max, { lru })</code> trả về <code>{ get, set, keys, size }</code> dựa trên một <code>Map</code>:</p><ul><li><code>set(k, v)</code> — nếu <code>k</code> đã có thì thay giá trị và đưa nó về vị trí mới nhất; không thì, nếu cache đã giữ <code>max</code> mục, xoá khoá <b>cũ nhất</b> trước (<code>m.keys().next().value</code>), rồi thêm;</li><li><code>get(k)</code> — giá trị hoặc <code>undefined</code>; khi <code>lru</code> là true, lần trúng còn đưa <code>k</code> về vị trí mới nhất (delete + set). Với <code>lru</code> false (mặc định) là FIFO: lần trúng không đổi gì;</li><li><code>keys()</code> — các khoá từ cũ nhất tới mới nhất; <code>size()</code>.</li></ul>',
  goiY: [['A Map iterates in insertion order, so the first key is the oldest inserted.', 'Map duyệt theo thứ tự chèn, nên khoá đầu tiên là khoá được chèn sớm nhất.'], ['Evict only when adding a NEW key to a full cache; updating an existing key never evicts.', 'Chỉ đuổi khi thêm khoá MỚI vào cache đầy; cập nhật khoá đã có không bao giờ đuổi.']],
  loi: [['Calling the insertion-order cap “LRU”: without refreshing on a hit it is FIFO — the web lesson made exactly this mistake and corrected it.', 'Gọi trần theo thứ tự chèn là “LRU”: không làm mới khi trúng thì nó là FIFO — bài web từng nhầm đúng chỗ này và đã sửa.'], ['Evicting after adding: for a moment the cache holds max + 1 entries, and with max = 0 it keeps one.', 'Đuổi sau khi thêm: có lúc cache giữ max + 1 mục, và với max = 0 nó vẫn giữ một.']],
  gt: ['After 100k requests the capped cache sat at 124.8 MB, indistinguishable from no cache (123.4 MB), and 1,000 × ~2 KB ≈ 2 MB bought the whole benefit of caching. Every in-memory cache needs a limit on entries, a TTL, or both — decided when you write it; if you cannot name a limit, the data belongs in Redis.', 'Sau 100k request cache có trần nằm ở 124,8 MB, không phân biệt được với không cache (123,4 MB), và 1.000 × ~2 KB ≈ 2 MB mua trọn lợi ích của cache. Mọi cache trong bộ nhớ cần giới hạn số mục, TTL, hoặc cả hai — quyết định lúc viết; nếu không nêu được giới hạn, dữ liệu thuộc về Redis.'],
  kn: ['caching', 'Map', 'memory'],
  tns: [tn('FIFO', 'vào trước ra trước'), tn('LRU', 'ít dùng gần đây nhất', 'evicts the entry not used for the longest time'), tn('eviction', 'đuổi khỏi cache')],
  dau: `/** a bounded cache */
function createCache(max, { lru = false } = {}) {
  // Write your solution here
  const m = new Map();
  return {
    get: (k) => m.get(k),
    set: (k, v) => { m.set(k, v); },
    keys: () => [...m.keys()],
    size: () => m.size,
  };
}
`,
  giai: '// Reference solution\n' + nguon(createCache),
  cases: [
    { chuanBi: 'const c = createCache(3); for (let i = 0; i < 6; i++) c.set("/notes/" + i, { id: i });', goi: '[c.size(), c.keys()]', moTa: ['A crawler walks 6 new ids, cap 3', 'Một crawler đi qua 6 id mới, trần 3'] },
    { chuanBi: 'const f = createCache(2); f.set("a", 1); f.set("b", 2); f.get("a"); f.set("c", 3); const l = createCache(2, { lru: true }); l.set("a", 1); l.set("b", 2); l.get("a"); l.set("c", 3);', goi: '({ fifo: f.keys(), lru: l.keys() })', moTa: ['FIFO vs LRU after a hit on "a"', 'FIFO và LRU sau một lần trúng "a"'] },
    { chuanBi: 'const c = createCache(2); c.set("a", 1); c.set("b", 2); c.set("a", 10); c.set("c", 3);', goi: '[c.keys(), c.get("a"), c.get("b")]', an: true },
    { chuanBi: 'const c = createCache(1000); for (let i = 0; i < 100000; i++) c.set("/notes/" + i, "x".repeat(10));', goi: '[c.size(), c.keys()[0], c.keys()[999]]', an: true },
    { chuanBi: 'const c = createCache(0); c.set("a", 1);', goi: '[c.size(), c.get("a")]', an: true },
  ],
});

function retainerPath(graph, target) {
  // Đi NGƯỢC: từ gốc GC tới đối tượng nghi vấn theo các cạnh "giữ" — BFS cho đường ngắn nhất.
  // Đọc từ dưới lên ra dòng mã: biến ngữ cảnh "cache" của module giữ một Map giữ một mảng giữ object.
  const out = new Map();
  for (const e of graph.edges) (out.get(e.from) || out.set(e.from, []).get(e.from)).push(e);
  const prev = new Map([[graph.root, null]]);
  const queue = [graph.root];
  while (queue.length) {
    const n = queue.shift();
    if (n === target) break;
    for (const e of out.get(n) || []) {
      if (prev.has(e.to)) continue;
      prev.set(e.to, { from: n, name: e.name });
      queue.push(e.to);
    }
  }
  if (!prev.has(target)) return null;                    // không với tới được ⇒ GC sẽ dọn nó, không phải rò
  const steps = [];
  for (let n = target; prev.get(n); n = prev.get(n).from) steps.unshift(`${graph.nodes[prev.get(n).from]} --${prev.get(n).name}--> ${graph.nodes[n]}`);
  return steps;
}
const G = {
  root: 'r',
  nodes: { r: '(GC roots)', s: '(Stack roots)', ctx: 'system / Context', map: 'Map', tbl: '(internal array)', obj: 'Object { id: "/notes/123" }', mod: 'Object (module exports)', tmp: 'Object { tmp: true }' },
  edges: [
    { from: 'r', to: 's', name: '(stack)' }, { from: 's', to: 'ctx', name: 'context' }, { from: 's', to: 'mod', name: 'exports' },
    { from: 'ctx', to: 'map', name: 'cache' }, { from: 'map', to: 'tbl', name: 'table' }, { from: 'tbl', to: 'obj', name: '[247]' },
    { from: 'mod', to: 'map', name: 'cacheRef' }, { from: 'obj', to: 'tbl', name: 'back' },
  ],
};
const E5 = await jsBai({
  ten: 'retainerPath(graph, target): walk from the GC roots to the leaking object', kho: 'HARD', phut: 20,
  en: '<p>A heap snapshot is a graph: nodes are objects, an edge <code>{ from, to, name }</code> means <code>from</code> holds <code>to</code> through the property (or slot) <code>name</code>. Write <code>retainerPath(graph, target)</code> for <code>graph = { root, nodes: { id: label }, edges }</code>: find the <b>shortest</b> chain of edges from <code>root</code> to <code>target</code> (breadth-first; edges of a node are tried in input order) and return it as strings <code>"&lt;from label&gt; --&lt;name&gt;--&gt; &lt;to label&gt;"</code> from the root down. Return <code>[]</code> if <code>target</code> is the root and <code>null</code> if it is unreachable. The graph may contain cycles.</p>',
  vi: '<p>Heap snapshot là một đồ thị: nút là object, cạnh <code>{ from, to, name }</code> nghĩa là <code>from</code> giữ <code>to</code> qua thuộc tính (hoặc ô) <code>name</code>. Viết <code>retainerPath(graph, target)</code> với <code>graph = { root, nodes: { id: nhãn }, edges }</code>: tìm chuỗi cạnh <b>ngắn nhất</b> từ <code>root</code> tới <code>target</code> (duyệt theo chiều rộng; các cạnh của một nút thử theo thứ tự đầu vào) và trả về dạng chuỗi <code>"&lt;nhãn from&gt; --&lt;name&gt;--&gt; &lt;nhãn to&gt;"</code> từ gốc đi xuống. Trả <code>[]</code> nếu <code>target</code> là gốc và <code>null</code> nếu không với tới được. Đồ thị có thể có chu trình.</p>',
  goiY: [['BFS with a queue and a prev map: prev.get(node) = { from, name } of the edge that reached it first.', 'BFS với một hàng đợi và map prev: prev.get(nút) = { from, name } của cạnh tới nó đầu tiên.'], ['Mark a node visited when you enqueue it, so cycles (obj → tbl → obj) do not loop forever; rebuild the path by walking prev back from the target.', 'Đánh dấu đã thăm lúc đưa vào hàng đợi, để chu trình (obj → tbl → obj) không lặp mãi; dựng lại đường bằng cách đi ngược prev từ target.']],
  loi: [['Depth-first search: it may return a long, irrelevant path through module exports instead of the shortest one.', 'Duyệt theo chiều sâu: có thể trả về một đường dài, không liên quan qua module exports thay vì đường ngắn nhất.'], ['Blaming the biggest object (600,001 concatenated strings) instead of what holds it.', 'Đổ lỗi cho đối tượng lớn nhất (600.001 chuỗi nối) thay vì thứ đang giữ nó.']],
  gt: ['Read bottom-up, the answer is the line of code: a module-level variable named cache holds a Map holding the objects. That is how the lesson found leak 1 without reading any route — and why “+50,001 Object” in the comparison view matters more than the largest row by size.', 'Đọc từ dưới lên, câu trả lời là dòng mã: một biến cấp module tên cache giữ một Map giữ các object. Đó là cách bài tìm ra rò 1 mà không đọc route nào — và vì sao “+50.001 Object” trong khung so sánh quan trọng hơn dòng to nhất theo kích thước.'],
  kn: ['memory', 'graphs', 'BFS'],
  tns: [tn('GC roots', 'gốc GC', 'what is always reachable: stack, globals'), tn('retaining path', 'chuỗi giữ'), tn('BFS', 'duyệt theo chiều rộng')],
  dau: `/** shortest retaining path from the GC roots */
function retainerPath(graph, target) {
  // Write your solution here — this follows the first edge it finds, depth-first
  const steps = [];
  let n = graph.root;
  const seen = new Set();
  while (n !== target) {
    seen.add(n);
    const e = graph.edges.find((x) => x.from === n && !seen.has(x.to));
    if (!e) return null;
    steps.push(graph.nodes[e.from] + ' --' + e.name + '--> ' + graph.nodes[e.to]);
    n = e.to;
  }
  return steps;
}
`,
  giai: '// Reference solution\n' + nguon(retainerPath),
  cases: [
    { goi: goi('retainerPath', G, 'obj'), moTa: ['Who holds { id: "/notes/123" }?', 'Ai giữ { id: "/notes/123" }?'] },
    { goi: goi('retainerPath', G, 'tmp'), moTa: ['An unreachable object: garbage, not a leak', 'Object không với tới được: rác, không phải rò'] },
    { goi: goi('retainerPath', { ...G, edges: [{ from: 'r', to: 's', name: '(stack)' }, { from: 's', to: 'mod', name: 'exports' }, { from: 'mod', to: 'map', name: 'cacheRef' }, ...G.edges] }, 'obj'), an: true },
    { goi: goi('retainerPath', { root: 'r', nodes: { r: '(GC roots)', a: 'Object (logger)', b: 'Array (handlers)', c: 'Closure (onLog)', x: 'Object { body: "2 KB" }' }, edges: [{ from: 'r', to: 'a', name: 'logger' }, { from: 'a', to: 'b', name: 'handlers' }, { from: 'b', to: 'c', name: '[0]' }, { from: 'c', to: 'x', name: 'context' }, { from: 'r', to: 'x', name: 'lastRequest' }] }, 'x'), an: true, moTa: ['The shortest path, not the first one found', 'Đường ngắn nhất, không phải đường tìm thấy đầu tiên'] },
    { goi: goi('retainerPath', G, 'r'), an: true },
    { goi: goi('retainerPath', G, 'map'), an: true },
  ],
});

export default modul('nodejs-16-5-ro-ri-bo-nho', '16.5 Memory leaks: the cache that never forgets', [E1, E2, E3, E4, E5]);
