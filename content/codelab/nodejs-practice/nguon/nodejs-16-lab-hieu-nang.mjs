/** Node.js · Lab 16 — Tăng tốc /courses: từ profile ra kế hoạch (Amdahl), rồi một cache có trần + TTL + gộp lời gọi trùng. */
import { modul, cs, ord, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const L1 = cs({
  ten: 'Lab 16 · 1 — GET /courses: 300 courses, computeRating per request, a 20 KB description nobody shows', kho: 'EASY', phut: 6, loai: 'order', dangBai: 'lab',
  en: 'The lesson-16.1 exercise as a plan. Put the work in order.',
  vi: 'Bài tập của bài 16.1 thành một kế hoạch. Sắp công việc theo thứ tự.',
  cau: [
    ord('o1', ['From “it is slow” to “done”.', 'Từ “nó chậm” tới “xong”.'], [
      'Set the finish line: p95 of GET /courses under 300 ms',
      'Baseline with autocannon (req/s, p97.5), after a warm-up',
      'node --cpu-prof under load, exit with SIGTERM, read the self-time table',
      'Do it once: cache the ratings, refreshed when a review arrives',
      'Measure again; keep it only if the whole range moved',
      'Send less: select only the fields the list renders',
      'Measure again and stop when the p95 target is met',
    ], ['One fix per lap, measured before and after; the two fixes of 16.1 that apply are “do it once” and “send less”. The finish line is decided before starting, or optimisation never ends.', 'Mỗi vòng một bản sửa, đo trước và sau; hai cách sửa của 16.1 áp dụng được là “làm một lần” và “gửi ít hơn”. Vạch đích quyết định trước khi bắt đầu, không thì tối ưu không bao giờ kết thúc.']),
    ord('o2', ['The five categories, in the order to try them.', 'Năm nhóm, theo thứ tự nên thử.'], [
      'Do less work (index, cache, fewer fields, fewer queries)',
      'Do it once (precompute, pre-serialise, batch)',
      'Do it somewhere else (queue, CDN, nginx)',
      'Add hardware (cluster, containers) — only when CPU-bound',
      'Make it faster (a faster library, a cleverer loop)',
    ], ['2.5×–657×, ~2×, off the critical path, linear and paid for, 0.96×–1.35×.', '2,5×–657×, ~2×, ra khỏi đường găng, tuyến tính và tốn tiền, 0,96×–1,35×.']),
  ],
  goiY: [['Measurement surrounds every change.', 'Phép đo bao quanh mọi thay đổi.'], ['The biggest wins remove work.', 'Thắng lợi lớn nhất là bỏ bớt việc.']],
  loi: [['Starting with the faster library.', 'Bắt đầu bằng thư viện nhanh hơn.'], ['No finish line: “make it faster” never ends.', 'Không có vạch đích: “làm nhanh hơn” không bao giờ xong.']],
  tns: [tn('finish line', 'vạch đích')],
  kn: ['performance'],
});

function profileToPlan(profile, rps, proposals) {
  // 1) tỉ lệ tự thân của từng hàm từ .cpuprofile (cộng các nút cùng tên)
  const hits = new Map();
  let total = 0;
  for (const n of profile.nodes) {
    const name = n.callFrame.functionName || '(anonymous)';
    hits.set(name, (hits.get(name) || 0) + n.hitCount);
    total += n.hitCount;
  }
  // 2) Amdahl cho từng đề xuất ⇒ 3) thông lượng dự đoán (tuyến CPU-bound: thời gian mỗi request giảm theo phần tiết kiệm)
  return proposals
    .map((p) => {
      const share = p.fns.reduce((s, f) => s + (hits.get(f) || 0), 0) / total;   // một đề xuất có thể bỏ nhiều dòng
      const saving = share * (1 - 1 / p.speedup);
      return { name: p.name, sharePct: Number((share * 100).toFixed(1)), savingPct: Number((saving * 100).toFixed(1)), predictedRps: Math.round(rps / (1 - saving)) };
    })
    .sort((a, b) => b.savingPct - a.savingPct || (a.name < b.name ? -1 : 1));
}
const N = (functionName, hitCount) => ({ id: 0, callFrame: { functionName, url: '' }, hitCount });
const PROF = { nodes: [N('(root)', 0), N('computeRating', 1180), N('reduce', 420), N('stringify', 610), N('(garbage collector)', 300), N('formatDate', 75), N('(idle)', 40), N('computeRating', 220), N('', 155)] };
const PROPS = [
  { name: 'cache ratings (refresh on review)', fns: ['computeRating', 'reduce'], speedup: Infinity },
  { name: 'pre-serialise the list', fns: ['stringify'], speedup: Infinity },
  { name: 'faster date helper', fns: ['formatDate'], speedup: 3 },
  { name: 'fast-json-stringify', fns: ['stringify'], speedup: 1.35 },
];
const L2 = await jsBai({
  ten: 'Lab 16 · 2 — profileToPlan(profile, rps, proposals): from a .cpuprofile to a ranked plan with predicted req/s', kho: 'HARD', phut: 25, dangBai: 'lab',
  en: '<p>The route is CPU-bound ((idle) is small), so the time per request falls with every percent of CPU you remove. Combine 16.1 and 16.6. <code>profile.nodes</code> are <code>{ callFrame: { functionName }, hitCount }</code> (empty name = <code>"(anonymous)"</code>; add hits per name). Each proposal is <code>{ name, fns, speedup }</code>: it speeds up all the functions in <code>fns</code> by <code>speedup</code> (<code>Infinity</code> = removed). For each proposal compute:</p><ul><li><code>share</code> = hits of its functions ÷ all hits;</li><li><code>saving</code> = share × (1 − 1/speedup);</li><li><code>predictedRps</code> = <code>Math.round(rps / (1 − saving))</code>.</li></ul><p>Return <code>{ name, sharePct, savingPct, predictedRps }</code> (percentages × 100, 1 decimal) sorted by <code>savingPct</code> descending (ties by name A→Z).</p>',
  vi: '<p>Route bị giới hạn bởi CPU ((idle) nhỏ), nên thời gian mỗi request giảm theo mỗi phần trăm CPU bạn bỏ được. Gộp 16.1 và 16.6. <code>profile.nodes</code> là <code>{ callFrame: { functionName }, hitCount }</code> (tên rỗng = <code>"(anonymous)"</code>; cộng mẫu theo tên). Mỗi đề xuất là <code>{ name, fns, speedup }</code>: nó tăng tốc mọi hàm trong <code>fns</code> lên <code>speedup</code> lần (<code>Infinity</code> = bỏ hẳn). Với mỗi đề xuất tính:</p><ul><li><code>share</code> = số mẫu của các hàm đó ÷ tổng số mẫu;</li><li><code>saving</code> = share × (1 − 1/speedup);</li><li><code>predictedRps</code> = <code>Math.round(rps / (1 − saving))</code>.</li></ul><p>Trả về <code>{ name, sharePct, savingPct, predictedRps }</code> (phần trăm × 100, 1 chữ số) sắp theo <code>savingPct</code> giảm dần (hoà theo tên A→Z).</p>',
  goiY: [['Reuse topSelf’s Map of hits per function name.', 'Dùng lại Map số mẫu theo tên hàm của topSelf.'], ['If the request took T and you save s·T, it now takes (1 − s)·T, so throughput is multiplied by 1 / (1 − s).', 'Nếu request mất T và bạn tiết kiệm s·T, giờ nó mất (1 − s)·T, nên thông lượng nhân 1 / (1 − s).']],
  loi: [['Counting computeRating once: it appears in two nodes (two call paths), and the second one holds a sixth of its samples.', 'Đếm computeRating một lần: nó xuất hiện ở hai nút (hai đường gọi), và nút thứ hai giữ một phần sáu số mẫu của nó.'], ['Predicting rps × (1 + saving): removing half the work doubles throughput, it does not add 50%.', 'Dự đoán rps × (1 + saving): bỏ một nửa công việc làm thông lượng gấp đôi, không phải cộng 50%.']],
  gt: ['The plan ranks “do it once” far above “make it faster”: caching the ratings removes about 61% of the CPU and predicts ~2.5× the req/s, while the faster serialiser is worth about 5%. The prediction holds only for a CPU-bound route — on the 16.2 route (97% database) the same arithmetic says the JavaScript is not worth touching.', 'Kế hoạch xếp “làm một lần” cao hơn hẳn “làm nhanh hơn”: cache điểm đánh giá bỏ được khoảng 61% CPU và dự đoán ~2,5 lần req/s, còn bộ tuần tự hoá nhanh hơn chỉ đáng khoảng 5%. Dự đoán chỉ đúng với route bị giới hạn bởi CPU — trên route 16.2 (97% CSDL) cùng phép tính nói rằng JavaScript không đáng đụng tới.'],
  kn: ['profiling', 'Amdahl', 'planning'],
  tns: [tn('predicted throughput', 'thông lượng dự đoán')],
  dau: `/** rank optimisation proposals from a CPU profile */
function profileToPlan(profile, rps, proposals) {
  // Write your solution here
  const total = profile.nodes.reduce((s, n) => s + n.hitCount, 0);
  return proposals.map((p) => {
    const node = profile.nodes.find((n) => n.callFrame.functionName === p.fns[0]);
    const share = node ? node.hitCount / total : 0;
    return { name: p.name, sharePct: Number((share * 100).toFixed(1)), savingPct: Number((share * 100).toFixed(1)), predictedRps: Math.round(rps * (1 + share)) };
  });
}
`,
  giai: '// Reference solution\n' + nguon(profileToPlan),
  cases: [
    { goi: goi('profileToPlan', PROF, 300, PROPS).replace(/null/g, 'Infinity'), moTa: ['GET /courses at 300 req/s, four proposals', 'GET /courses ở 300 req/s, bốn đề xuất'] },
    { goi: goi('profileToPlan', { nodes: [N('a', 50), N('b', 50)] }, 100, [{ name: 'remove a', fns: ['a'], speedup: 2 }]), moTa: ['Half the CPU, 2× faster', 'Một nửa CPU, nhanh gấp 2'] },
    { goi: goi('profileToPlan', PROF, 1200, [{ name: 'z', fns: ['(anonymous)'], speedup: 5 }, { name: 'gc', fns: ['(garbage collector)'], speedup: 1.5 }, { name: 'none', fns: ['missing'], speedup: 9 }]), an: true },
    { goi: goi('profileToPlan', { nodes: [N('x', 10), N('y', 10), N('x', 20)] }, 50, [{ name: 'b', fns: ['y'], speedup: Infinity }, { name: 'a', fns: ['y'], speedup: Infinity }]).replace(/null/g, 'Infinity'), an: true },
  ],
});

function createTtlCache({ max, ttlMs, now }) {
  const m = new Map();                       // key → { v, exp } — thứ tự chèn ⇒ đầu Map là mục ít dùng gần đây nhất
  const inflight = new Map();                // key → Promise đang nạp (gộp lời gọi trùng)
  const stats = { hits: 0, misses: 0, evictions: 0, expired: 0, loads: 0 };
  function getFresh(k) {
    const e = m.get(k);
    if (!e) return undefined;
    if (e.exp <= now()) { m.delete(k); stats.expired++; return undefined; }   // TTL bảo vệ độ tươi
    m.delete(k); m.set(k, e);                // LRU: trúng ⇒ làm mới vị trí
    return e;
  }
  function set(k, v) {
    if (m.has(k)) m.delete(k);
    else if (m.size >= max) { m.delete(m.keys().next().value); stats.evictions++; }   // trần bảo vệ bộ nhớ
    m.set(k, { v, exp: now() + ttlMs });
  }
  async function getOrLoad(k, loader) {
    const e = getFresh(k);
    if (e) { stats.hits++; return e.v; }
    stats.misses++;
    if (inflight.has(k)) return inflight.get(k);           // đang có người nạp ⇒ chờ chung, không gọi CSDL lần nữa
    stats.loads++;
    const p = Promise.resolve().then(() => loader(k)).then(
      (v) => { inflight.delete(k); set(k, v); return v; },
      (err) => { inflight.delete(k); throw err; },           // lỗi không được cache
    );
    inflight.set(k, p);
    return p;
  }
  return { getOrLoad, stats: () => ({ ...stats, size: m.size }), keys: () => [...m.keys()] };
}
const TC = `let t = 0; const now = () => t; let dbCalls = 0; const load = (k) => new Promise((r) => setTimeout(() => { dbCalls++; r({ id: k, rating: 4.5 }); }, 5));`;
const L3 = await jsBai({
  ten: 'Lab 16 · 3 — createTtlCache({ max, ttlMs, now }): a cap for memory, a TTL for freshness, one load per key', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: '<p>Cache the ratings of Lab 16 · 2 in process, safely. <code>createTtlCache({ max, ttlMs, now })</code> returns <code>{ getOrLoad, stats, keys }</code>:</p><ul><li><code>async getOrLoad(key, loader)</code> — a fresh entry (stored less than <code>ttlMs</code> ago: <code>exp = storedAt + ttlMs</code>, fresh while <code>exp &gt; now()</code>) is a <b>hit</b>: move it to the newest position and return its value. Otherwise it is a <b>miss</b> (an expired entry is removed and counted in <code>expired</code>); if a load for this key is already in flight, return the same promise; else call <code>loader(key)</code> once (count in <code>loads</code>), store the result and return it. A rejected load is not stored and the next call loads again;</li><li>storing a new key into a full cache (<code>max</code> entries) first evicts the least recently used key (count in <code>evictions</code>);</li><li><code>stats()</code> → <code>{ hits, misses, evictions, expired, loads, size }</code>; <code>keys()</code> → keys from least to most recently used.</li></ul>',
  vi: '<p>Cache điểm đánh giá của Lab 16 · 2 ngay trong tiến trình, một cách an toàn. <code>createTtlCache({ max, ttlMs, now })</code> trả về <code>{ getOrLoad, stats, keys }</code>:</p><ul><li><code>async getOrLoad(key, loader)</code> — mục còn tươi (lưu chưa tới <code>ttlMs</code>: <code>exp = lúcLưu + ttlMs</code>, tươi khi <code>exp &gt; now()</code>) là <b>trúng</b>: đưa về vị trí mới nhất và trả giá trị. Không thì là <b>trượt</b> (mục hết hạn bị xoá và đếm vào <code>expired</code>); nếu đang có một lần nạp khoá này dở dang thì trả về đúng promise đó; không thì gọi <code>loader(key)</code> một lần (đếm vào <code>loads</code>), lưu kết quả rồi trả về. Lần nạp bị reject thì không lưu và lần gọi sau nạp lại;</li><li>lưu khoá mới vào cache đầy (<code>max</code> mục) thì trước hết đuổi khoá ít dùng gần đây nhất (đếm vào <code>evictions</code>);</li><li><code>stats()</code> → <code>{ hits, misses, evictions, expired, loads, size }</code>; <code>keys()</code> → các khoá từ ít tới nhiều dùng gần đây.</li></ul>',
  yc: [['Concurrent misses for the same key call the loader once.', 'Nhiều lần trượt đồng thời cho cùng khoá chỉ gọi loader một lần.'], ['Never cache an error.', 'Không bao giờ cache lỗi.']],
  goiY: [['Store { v, exp } per key in one Map; a second Map holds the in-flight promises.', 'Lưu { v, exp } mỗi khoá trong một Map; Map thứ hai giữ các promise đang nạp.'], ['Delete the in-flight entry in both the success and the failure branch, then store only on success.', 'Xoá mục đang nạp ở cả nhánh thành công lẫn thất bại, rồi chỉ lưu khi thành công.']],
  loi: [['No in-flight map: 50 concurrent requests for a cold key run 50 identical queries — the cache stampede.', 'Không có map đang nạp: 50 request đồng thời cho một khoá nguội chạy 50 truy vấn giống hệt — cơn giẫm đạp cache.'], ['Caching the rejected promise: one database blip becomes an error served to everyone until the TTL ends.', 'Cache luôn promise bị reject: một lần CSDL trục trặc thành lỗi trả cho mọi người tới khi hết TTL.']],
  gt: ['A size cap protects memory (leak 1 of 16.5), a TTL protects freshness, and the in-flight map makes “do it once” true even under concurrency. In one process this is the cheap version of chapter 12’s Redis cache; the moment a second process appears (16.4), the copies disagree and the cache belongs in Redis.', 'Trần kích thước bảo vệ bộ nhớ (rò 1 của 16.5), TTL bảo vệ độ tươi, và map đang nạp làm “làm một lần” đúng cả khi đồng thời. Trong một tiến trình đây là phiên bản rẻ của cache Redis chương 12; ngay khi có tiến trình thứ hai (16.4), các bản sao lệch nhau và cache thuộc về Redis.'],
  kn: ['caching', 'promises', 'memory'],
  tns: [tn('cache stampede', 'giẫm đạp cache', 'many misses for one key at once'), tn('single-flight', 'gộp lời gọi trùng'), tn('TTL', 'thời gian sống')],
  dau: `/** bounded LRU + TTL cache with one load per key */
function createTtlCache({ max, ttlMs, now }) {
  // Write your solution here
  const m = new Map();
  const stats = { hits: 0, misses: 0, evictions: 0, expired: 0, loads: 0 };
  async function getOrLoad(k, loader) {
    if (m.has(k)) { stats.hits++; return m.get(k); }
    stats.misses++; stats.loads++;
    const v = await loader(k);
    m.set(k, v);
    return v;
  }
  return { getOrLoad, stats: () => ({ ...stats, size: m.size }), keys: () => [...m.keys()] };
}
`,
  giai: '// Reference solution\n' + nguon(createTtlCache),
  cases: [
    { chuanBi: `${TC} const c = createTtlCache({ max: 100, ttlMs: 10000, now }); const vs = await Promise.all(Array.from({ length: 50 }, () => c.getOrLoad("course:42", load)));`, goi: '({ same: vs.every((v) => v === vs[0]), dbCalls, stats: c.stats() })', moTa: ['50 concurrent requests for a cold key', '50 request đồng thời cho một khoá nguội'] },
    { chuanBi: `${TC} const c = createTtlCache({ max: 100, ttlMs: 10000, now }); await c.getOrLoad("a", load); t = 9999; await c.getOrLoad("a", load); t = 10000; await c.getOrLoad("a", load);`, goi: '({ dbCalls, stats: c.stats() })', moTa: ['TTL: fresh at 9,999 ms, expired at 10,000 ms', 'TTL: còn tươi ở 9.999 ms, hết hạn ở 10.000 ms'] },
    { chuanBi: `${TC} const c = createTtlCache({ max: 2, ttlMs: 60000, now }); await c.getOrLoad("a", load); await c.getOrLoad("b", load); await c.getOrLoad("a", load); await c.getOrLoad("c", load);`, goi: '({ keys: c.keys(), stats: c.stats() })', an: true },
    { chuanBi: `${TC} const c = createTtlCache({ max: 10, ttlMs: 60000, now }); let fail = true; const flaky = async (k) => { dbCalls++; if (fail) throw new Error("ETIMEDOUT"); return k; }; let err = ""; try { await c.getOrLoad("x", flaky); } catch (e) { err = e.message; } fail = false; const v = await c.getOrLoad("x", flaky);`, goi: '({ err, v, dbCalls, stats: c.stats() })', an: true },
    { chuanBi: `${TC} const c = createTtlCache({ max: 3, ttlMs: 1000, now }); for (const k of ["a", "b", "c", "d", "e"]) await c.getOrLoad(k, load); t = 5000; await c.getOrLoad("e", load);`, goi: '({ keys: c.keys(), stats: c.stats() })', an: true },
  ],
});

export default modul('nodejs-16-lab-hieu-nang', 'Lab 16 — Making GET /courses fast: plan from a profile, then cache safely', [L1, L2, L3]);
