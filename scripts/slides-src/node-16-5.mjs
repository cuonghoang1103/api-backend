/**
 * node-16-5 — Node.js · Chapter 16 · Lesson 16.5 "Memory: the cache that never forgets" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, MỘT tập node-16-5.
 * Nguồn: nodejs-16-5-ro-ri-bo-nho. Output THẬT: that/c16/leak (4 chế độ × 20k/50k/100k request, RSS) · that/c16/snapshot (2 heap snapshot, so sánh theo constructor,
 *   chuỗi giữ TÍNH từ snapshot) · that/c16/heap-limit (Node 22 trong container 512m/2g) · that/c16/oom (heap ⇒ FATAL exit 134; Buffer trong container 128m ⇒ exit 137 câm) ·
 *   that/c16/buffers · that/c16/prod-memory (grep Dockerfile.backend + docker-compose của website).
 * BỔ SUNG ngoài bài web: Node 22 ĐỌC giới hạn container (512m ⇒ heap 259 MB, 2g ⇒ 1.048 MB) — bài web nói "Node tưởng có nhiều RAM hơn ⇒ 137 câm" là sai với heap
 *   (đã sửa ở nguồn); 137 câm là của bộ nhớ NGOÀI heap · "lru" của bài web thực ra là FIFO (bỏ cái vào sớm nhất) — LRU thật làm mới khi trúng · chuỗi giữ thật.
 * Khác web: leak 349,5 MB (web 351,5) · listener 146,9 MB với 100.000 listener (web 173,1 / 170.000) · lru 124,8 (web 125,7).
 */
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong, steps } from './_c9-chung.mjs';

export const deck = { key: 'node-16-5', code: 'NODE 16.5', title: 'Memory: the cache that never forgets', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const row = (m) => dong('c16/leak', new RegExp(`^${m}\\s`)).trim().split(/\s+MB\s+|\s+/).filter((x) => /^[\d.,]+$/.test(x)).map((x) => Number(x.replace(/,/g, '')));
const NO = row('none'), LK = row('leak'), LR = row('lru'), LI = row('listener');
const perId = ((LK[3] - NO[3]) * 1024 / 100000);
const HL = (re) => num(dong('c16/heap-limit', re), /(\d+) MB heap limit/);
const H512 = HL(/^container --memory=512m:/), H2G = HL(/^container --memory=2g:/), HHOST = HL(/^Mac host/);
const SN = dong('c16/snapshot', /^snapshot 1/);

export const slides = lamDeck({ chuong: 'Chapter 16 — Performance', bai: '16.5' }, [
  { cover: true, t: 'Memory: the cache<br>that never forgets', sub: 'A leak does not announce itself. Fine on day one, slower on day two, killed on day three — then it restarts, looks healthy, and the countdown begins again.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Three leaks and a control — and the misdiagnosis the control prevents</li>
<li>Leak 1: the cache with no ceiling, and the one-line fix</li>
<li>Leak 2: the listener nobody removed, and the warning not to silence</li>
<li>Finding a leak you cannot see: two heap snapshots and the retainer chain</li>
<li>Heap limits, containers, and the kill that leaves no message</li>
</ul>` + box('Why it matters to you', 'A memory leak is the bug that passes every test, survives code review, and takes production down at 3 a.m. — on a schedule set by traffic, not by you.', 'lam') },

  { t: 'Three leaks and a control', to: true, giua: true, body: TT('c16/leak', 1, 6, 'node leak.mjs · the same Express app in 4 modes · RSS after 20k, 50k, 100k requests · real', { hl: [3, 4, 6], n: 104, sm: false }) +
    cards([['none', 'no cache at all: the control'], ['leak', 'a Map keyed by URL, no limit'], ['lru', 'the same Map, capped at 1,000'], ['listener', 'one process.on() per request']], 4) +
    box('How it was driven', 'Every request used a NEW id (/notes/0, /notes/1, …): the worst case for a URL-keyed cache — and the normal case for a public API that crawlers walk.', 'lam') },

  { t: 'Read the control row first', to: true, giua: true, body: thanh([['start', NO[0], LAM, `${NO[0]} MB`], ['after 20k', NO[1], CAM, `${NO[1]} MB`], ['after 50k', NO[2], NODE, `${NO[2]} MB`], ['after 100k', NO[3], NODE, `${NO[3]} MB`]], { w: 1100, x0: 200, wMax: 620, h0: 50, chu: 22, ghi: 'none: RSS of the app WITHOUT any cache · real' }) +
    two(box('That first doubling is not a leak', 'V8 grows its heap to a working size, compiles code, fills internal caches. Then it stops: 123.4, 123.4.', 'xanh'),
      box('Rises and plateaus = normal. Rises with traffic = leak.', 'One measurement after startup tells you nothing. You need the SHAPE: at least three points under load.', 'cam')) },

  { t: 'Leak 1: the cache with no ceiling', to: true, giua: true, body: J(`const cache = new Map();
app.get('/notes/:id', (req, res) => {
  const key = req.params.id;
  if (!cache.has(key)) cache.set(key, { id: key, body: 'x'.repeat(2000) });
  res.json({ n: cache.size });
});`, { sm: false, hl: [1, 4] }) +
    thanh([['after 20k', LK[1], CAM, `${LK[1]} MB`], ['after 50k', LK[2], DO, `${LK[2]} MB`], ['after 100k', LK[3], DO, `${LK[3]} MB · ${LK[4].toLocaleString('en-US')} items`]], { w: 1100, x0: 200, wMax: 560, h0: 44, chu: 22, ghi: 'leak: RSS · real' }) +
    box('The key comes from the URL', `So the number of entries is the number of distinct ids anyone ever asks for — unlimited on a public API. About ${perId.toFixed(1)} KB per new id, still climbing.`, 'do2') },

  { t: 'The fix is one condition', to: true, giua: true, body: J(`if (!cache.has(key)) {
  if (cache.size >= 1000) cache.delete(cache.keys().next().value);   // drop the OLDEST entry
  cache.set(key, value);
}`, { sm: false, hl: [2] }) +
    bang(['mode', 'RSS after 100k requests', 'items held'], [['leak', `${LK[3]} MB, still rising`, LK[4].toLocaleString('en-US')], ['capped at 1,000', `${LR[3]} MB, flat`, LR[4].toLocaleString('en-US')], ['no cache (control)', `${NO[3]} MB`, '0']], { co: 22, hl: [1] }) +
    two(box('Indistinguishable from no cache', `1,000 × ~2 KB ≈ 2 MB of memory for the whole benefit of caching.`, 'xanh'),
      box('Strictly, this is FIFO, not LRU', 'A Map keeps insertion order, so this drops the oldest INSERTED. A true LRU also refreshes on a hit: cache.delete(k); cache.set(k, v).', 'cam')) },

  { t: 'The bounded-cache rule', to: true, giua: true, body: box('Every in-memory cache needs a limit on entries, a TTL, or both', 'decided when you write it, not when it breaks.', 'xanh') +
    flow([{ t: 'can you name a limit?', s: 'entries · bytes · TTL', mau: LAM }, { t: 'yes', s: 'Map + cap, or lru-cache', mau: NODE }, { t: 'no', s: 'it belongs in Redis', mau: CAM }, { t: 'Redis', s: 'maxmemory + allkeys-lru', mau: TIM }], { h: 130 }) +
    cards([['A size cap', 'protects memory'], ['A TTL', 'protects freshness'], ['Redis (chapter 12)', 'makes eviction somebody else\'s job']], 3) },

  { t: 'Leak 2: the listener nobody removed', to: true, giua: true, body: J(`app.get('/notes/:id', (req, res) => {
  process.on('customEvent', () => {});      // registered per request, NEVER removed
  res.json({ ok: true });
});`, { sm: false, hl: [2] }) +
    TT('c16/leak', 8, 9, 'the first warning, printed on the eleventh request · real', { n: 104, sm: false }) +
    thanh([['after 20k', LI[1], CAM, `${LI[1]} MB`], ['after 50k', LI[2], DO, `${LI[2]} MB`], ['after 100k', LI[3], DO, `${LI[3]} MB · ${LI[4].toLocaleString('en-US')} listeners`]], { w: 1100, x0: 200, wMax: 520, h0: 40, chu: 22, ghi: 'listener: RSS · real' }) },

  { t: 'Do not do what the warning suggests', to: true, giua: true, body: two(box('"Use emitter.setMaxListeners() to increase limit"', 'silences the alarm and keeps the leak. This warning fires on a real bug far more often than not.', 'do2'),
    box('The right response', 'find who registers and never removes: emitter.off(), once(), or an AbortSignal that removes the listener with the request.', 'xanh')) +
    cards([['A Redis subscription', 'per request on a shared client'], ['An AbortSignal listener', 'on a signal that lives forever'], ['A socket handler', 'registered per request on a long-lived emitter']], 3) +
    box('Why it leaks memory', 'The emitter never dies, so every closure it holds stays reachable — and so does everything those closures captured: req, res, the body.', 'cam') },

  { t: 'Finding a leak you cannot see', to: true, giua: true, body: steps([
    '<b>Take a heap snapshot right after startup</b> — your baseline',
    '<b>Drive tens of thousands of requests</b> down exactly the path you suspect',
    '<b>Take a second snapshot and compare</b> — which object types GREW, and by how much',
    '<b>Read the retainers</b> — "what is holding this object" is the culprit, not the object itself',
    '<b>Fix, then repeat 1–3</b> — the RSS line must go flat before you call it done',
  ]) + J(`import v8 from 'node:v8';
const file = v8.writeHeapSnapshot();     // ⚠ blocks the event loop · file ≈ the size of the heap
// or with no code change: node --inspect → Chrome DevTools → Memory → Take snapshot`, { sm: true, hl: [2] }) +
    box('Snapshots answer WHAT is held; RSS over time answers WHETHER', 'Take snapshots only after the RSS curve has told you there is a leak.', 'cam') },

  { t: 'Snapshot 2 minus snapshot 1', to: true, giua: true, body: TT('c16/snapshot', 1, 11, 'node snapshot.mjs · the leaking cache before / after 50,000 new ids · compared like DevTools "Comparison" · real', { hl: [7, 9], n: 104, sm: false }) +
    two(box('+50,001 Object', 'Exactly the 50,000 cache entries we added (+1 from the test itself). The count gives the leak away.', 'xanh'),
      box('+600,001 concatenated strings', 'The bodies and keys: the biggest by SIZE, but not the thing to fix. What holds them is.', 'cam')) },

  { t: 'The retainer chain: who is holding it', to: true, giua: true, body: TT('c16/snapshot', 12, 17, 'computed from snapshot 2 · walking back from { id: "/notes/123" } · real', { hl: [4], n: 104, sm: false }) +
    flow([{ t: '{ id, body }', s: 'the object', mau: LAM }, { t: 'internal array', s: 'the Map\'s storage', mau: CAM }, { t: 'Map', s: '"table"', mau: CAM }, { t: 'context "cache"', s: 'the module variable', mau: DO }], { h: 120 }) +
    box('Read it bottom-up and you have the line of code', 'A module-level variable named cache holds a Map that holds 50,000 objects. That is Leak 1, found without reading any route.', 'xanh') },

  { t: 'What a snapshot costs', to: true, giua: true, body: TT('c16/snapshot', 2, 2, 'median of 5 snapshots each · real', { n: 104, sm: false }) +
    cards([['It blocks the event loop', 'About a second for a 56 MB heap here — seconds on a large one. No request is served meanwhile.'], ['The file is about the size of the heap', 'A 1.5 GB heap writes a 1.5 GB file — onto a disk that may not have room (chapter 15\'s disk-full incident).'], ['So: never casually on a live node', 'Take it on a canary, or in a maintenance window, or reproduce locally.']], 3) +
    thanh([['6.2 MB heap', 93, NODE, '93 ms blocked'], ['56.4 MB heap', 1027, DO, '1,027 ms blocked']], { w: 1100, x0: 200, wMax: 600, h0: 50, chu: 22, ghi: 'event loop blocked per snapshot · median of 5 · real' }) },

  { t: 'Heap limits: Node 22 reads the container', to: true, giua: true, body: TT('c16/heap-limit', 1, 8, 'node:22-alpine with docker --memory · v8.getHeapStatistics().heap_size_limit · real', { hl: [8, 9, 13], n: 104, sm: true }) +
    two(box('Without a flag', `Node 22 sizes the heap from the CONTAINER limit: 512 MB → ${H512} MB, 2 GB → ${H2G} MB (about half). On the Mac host: ${HHOST.toLocaleString('en-US')} MB.`, 'xanh'),
      box('With --max-old-space-size', 'You choose. Leave room for what lives OUTSIDE the heap: Buffers, native modules, stacks, code.', 'lam')) },

  { t: 'Two ways to run out of memory', to: true, giua: true, body: TT('c16/oom', 1, 8, 'a heap leak with a 64 MB heap · a Buffer leak in a 128 MB container · real', { hl: [4, 5, 13, 14], n: 104, sm: true }) +
    two(box('Heap full → exit 134, WITH a message', '"FATAL ERROR: Reached heap limit … JavaScript heap out of memory". You know exactly what happened.', 'xanh'),
      box('Container full → exit 137, NO message', 'The kernel sends SIGKILL. The last line the process printed said heapUsed 4 MB — the heap was never the problem.', 'do2')) },

  { t: 'A real trap: Buffer lives outside the heap', to: true, giua: true, body: TT('c16/buffers', 1, 4, 'node buffers.mjs · holding 30 Buffers of 8 MB · real', { hl: [3, 4], n: 104, sm: false }) +
    two(box('--max-old-space-size will never trigger', 'Uploads, image decoding, compression buffers: RSS grows, the heap does not. Only the container limit fires — exit 137, no stack trace.', 'do2'),
      box('When RSS is high but heap is not', 'stop reading heap snapshots. Look at arrayBuffers in process.memoryUsage(), and at what streams or decodes in memory.', 'xanh')) +
    J(`const m = process.memoryUsage();
console.log({ rss: m.rss, heapUsed: m.heapUsed, arrayBuffers: m.arrayBuffers, external: m.external });
// rss ≫ heapUsed and arrayBuffers large ⇒ Buffers: uploads, images, compression, unbounded streams`, { sm: false, hl: [3] }) },

  { t: 'What this website does', to: true, giua: true, body: TT('c16/prod-memory', 3, 8, 'grep in the website source · real', { hl: [2, 6], n: 104, sm: false }) +
    cards([['1536 MB heap in a 2 GB container', '75% — the comment in the Dockerfile says why: ~512 MB left for buffers, sharp, the ONNX model.'], ['Chapter 10 measured the Buffer side', '4 concurrent 120 MB uploads: RSS 56.7 → 786.1 MB. A 758 KB PNG of 16000×16000: 99 MB to decode.'], ['Neither shows in a heap snapshot', 'Both were fixed with limits on size and concurrency — not by tuning the heap.']], 3) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'An API container (1 GB limit, no flags) restarts every two days with exit 137 and no log. Grafana shows RSS rising steadily; a heap snapshot after a day shows the heap at 180 MB. (1) Is the heap the problem? (2) Where do you look? (3) What would exit 134 have told you instead?', '') +
    box('Hint', 'Slides 14, 15 and 16.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) No: Node 22 would cap the heap near 500 MB and fail with a FATAL message; 180 MB of heap with RSS near 1 GB means memory OUTSIDE the heap. (2) process.memoryUsage().arrayBuffers / external, and code that holds Buffers: uploads, images, compression, unbounded streams. (3) A heap leak: take two snapshots and read the retainers.', 'xanh')}</div>` },

  { t: 'Lesson 16.5 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['control (no cache)', `${NO[0]} → ${NO[1]} → ${NO[3]} MB, flat`, 'plateau ≠ leak'],
    ['unbounded Map', `${LK[3]} MB at 100k, rising`, 'every cache needs a cap or a TTL'],
    ['listener per request', `${LI[3]} MB, ${LI[4].toLocaleString('en-US')} listeners`, 'never raise setMaxListeners'],
    ['two snapshots', '+50,001 Object · held by context "cache"', 'read the retainers'],
    ['heap vs container', `512m → ${H512} MB heap · Buffers → 137`, 'leave room outside the heap'],
  ], { co: 22 }) + box('Next: 16.6 — the optimisations that did nothing', 'A faster serialiser that was slower, and the three questions to ask before any optimisation.', 'lam') },
]);
