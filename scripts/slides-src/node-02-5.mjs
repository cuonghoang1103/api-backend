/**
 * node-02-5 — Node.js · Chapter 2 · Lesson 2.5 "Getting heavy work off the event loop" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s02-runtime.mjs › nodejs-2-5-worker-threads. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c2).
 * ⚠️ Khác bài web cũ (đã sửa web, commit 037bf2a0e): chia lô chậm ~7× là do vòng lặp chạy trên biến NGOÀI hàm (closure), không phải do nhường lượt —
 * đo thật: chia lô không nhường vẫn 19772 ms; chép ra biến cục bộ ⇒ 2903 ms, trễ 23 ms.
 * Bổ sung: worker một tệp (isMainThread), giá khởi động worker đo thật, cluster chạy thật + curl: mỗi tiến trình một bộ đếm riêng.
 */
import { lamDeck, two, box, kw, vsd, bang, steps, cards, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';
import { readFileSync } from 'node:fs';

export const deck = { key: 'node-02-5', code: 'NODE 2.5', title: 'Getting heavy work off the event loop', sub: 'Node.js — from zero to production' };
const doc = (ten) => readFileSync(new URL(`file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/${ten}.out.txt`, import.meta.url), 'utf8');
const n = (ten, re) => Number(doc(ten).match(re)[1]);
const B = { w: n('c2/heartbeat-block', /work done after (\d+)/), l: n('c2/heartbeat-block', /at most (\d+)/) };
const W = { w: n('c2/worker', /finished after (\d+)/), l: n('c2/worker', /at most (\d+)/) };
const C1 = { w: n('c2/chunked', /done after (\d+)/), l: n('c2/chunked', /at most (\d+)/) };
const C2 = { w: n('c2/chunked-fast', /done after (\d+)/), l: n('c2/chunked-fast', /at most (\d+)/) };
const PIDS = (() => { const m = new Map(); for (const [, pid, h] of doc('c2/cluster').matchAll(/pid (\d+) says: hits = (\d+)/g)) m.set(pid, Number(h)); return [...m]; })();
const NY = n('c2/chunk-noyield', /never yields: (\d+)/);

export const slides = lamDeck({ chuong: 'Chapter 2 — Inside the Node.js Runtime', bai: '2.5' }, [
  { cover: true, t: 'Getting heavy work<br>off the event loop', sub: 'Three cures. None is free, and they do not replace each other.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li><b>Worker threads</b>: the real cure, and what a worker costs</li>
<li><b>Chunking</b> with setImmediate, and a ⭐ hidden 7× trap</li>
<li><b>Cluster</b>: several processes on one port, and what breaks</li>
<li>How to <b>choose</b>, and where heavy work should really go</li>
</ul>` },

  { t: 'The disease, from lesson 2.4', to: true, giua: true, body: `${two(box('Heavy sync work took', `<b style="font-size:40px">${B.w} ms</b>`, 'lam'), box('Heartbeat late by', `<b style="font-size:40px">${B.l} ms</b>`, 'do2'))}
${cards([['💊 1 · Worker thread', 'Move the work to another JS thread.'], ['✂️ 2 · Chunking', 'Slice it and let the loop breathe.'], ['🧬 3 · Cluster', 'More processes, more cores.']])}
${box('Best of all', 'Do not do the heavy work inside the request at all: precompute, cache, or queue it.', 'xanh')}` },

  { t: 'Cure 1 — a worker thread (one file, two roles)', giua: true, body: two(js(ma('c2/worker', 1, 8), { sm: true, hl: [4, 6, 7] }), js(ma('c2/worker', 9, 26), { sm: true, hl: [11, 12] })) +
    two(box('isMainThread', 'The same file runs twice: once on the main thread, once inside the worker. <code class="i">new Worker(__filename)</code> starts the second copy.', 'lam'), kw('worker thread', 'a separate JS thread with its own V8 and its own event loop')) },

  { t: 'Worker: the loop stays free', to: true, giua: true, body: `${term(ra('c2/worker'), { hl: [2, 3] })}
${bang(['Same 3-billion loop', 'Work took', 'Heartbeat late by'], [['On the main thread (2.4)', `${B.w} ms`, `<b style="color:#b0281a">${B.l} ms</b>`], ['In a worker thread', `${W.w} ms`, `<b style="color:#15803d">${W.l} ms</b>`]], { co: 22, hl: [1] })}
${box('Read it', 'The work takes just as long (a little more: starting a worker costs a few ms), but the server answers every other request the whole time.', 'xanh')}` },

  { t: 'A worker is not free', giua: true, body: `${runJs(ma('c2/worker-cost'), ra('c2/worker-cost'), { hlOut: [1, 2] })}
${cards([['Cost', 'Tens of ms to start and its own memory (a fresh V8 heap). Do not spawn one per request: keep a small pool.'], ['No shared variables', 'You send messages (data is copied), or use <b>SharedArrayBuffer</b> for raw bytes.'], ['Use it for', 'Real CPU work: huge file parsing, compression, image/video, crypto, big data transforms.']])}` },

  { t: 'Cure 2 — chunking with setImmediate', giua: true, body: `${js(ma('c2/chunked', 9, 22), { sm: true, hl: [5, 6, 7] })}${term(ra('c2/chunked'), { hl: [1, 2] })}
${box('Wait…', `Lag dropped to ${C1.l} ms, but the job went from ${B.w} ms to <b>${C1.w} ms</b>, about ${(C1.w / B.w).toFixed(0)}× slower. Is yielding really that expensive?`, 'do2')}` },

  { t: '⭐ Trap: it was not the yielding', giua: true, body: `${two(cot(term(ra('c2/chunk-noyield'), { title: 'same slices, NO setImmediate' }), box('Proof', `Without a single yield it still takes <b>${NY} ms</b>. The cost is the loop itself.`, 'do2')),
    cot(term(ra('c2/chunked-fast'), { title: 'local variables + setImmediate', hl: [1, 2] }), box('Fix', `Run the hot loop on <b>local</b> variables: <b>${C2.w} ms</b>, heartbeat late by <b>${C2.l} ms</b>.`, 'xanh')))}
${vsd(js(`for (; i < end; i++) s += i;
// i, s live outside the function`, { sm: true }), js(`let j = i, acc = s;
for (; j < end; j++) acc += j;
i = j; s = acc;`, { sm: true }), '✗ Outer variables', '✓ Local copies')}` },

  { t: 'Why local variables are faster', to: true, giua: true, body: `
${box('Outer (captured) variables', 'Variables a function reads from an outer scope live in a <b>context object on the heap</b>. Every <code class="i">i++</code> and <code class="i">s += i</code> is a memory read and write.', 'do2')}
${box('Local variables', 'V8 can keep them in <b>CPU registers</b>. A billion-step loop stays a billion fast steps.', 'xanh')}
${box('So what does chunking really cost?', 'The work still runs on the main thread (each slice blocks for one slice), it finishes later when requests share the thread, the code is more complex, and it never uses a second core. Heavy work: prefer a worker.', '')}` },

  { t: 'Cure 3 — many processes (cluster)', giua: true, body: two(js(ma('c2/cluster'), { sm: true, hl: [6, 10, 12] }), term(ra('c2/cluster'), { title: 'curl ×8 · port 4000', hl: [2, 4, 6, 8, 10, 12, 14, 16] }), 'r64') + box('Read it', 'Four processes share port 4000; requests go round-robin. One Node process uses one core, so 4 processes can use 4 cores.', 'lam') },

  { t: 'What cluster breaks, and what it does not fix', to: true, giua: true, body: `
${box('In-memory state stops being shared', 'Eight requests, yet no process ever counted past <b>2</b>: four processes, four different <code class="i">hits</code>. A rate-limit counter or a cache in a JS variable gives four different answers. Shared state moves to <b>Redis</b> (Chapter 12).', 'do2')}
${box('It does not cure a blocking endpoint', 'One frozen process out of four instead of one out of one. Cluster is for using all cores, not for fixing bad code.', '')}
${cards(PIDS.map(([pid, h]) => [`process ${pid}`, `its own <code class="i">hits</code> = <b>${h}</b>`]), 4)}
${kw('round-robin', 'taking turns in order: 1, 2, 3, 4, 1, 2…')}` },

  { t: 'How to choose', giua: true, body: bang(['Situation', 'Use'], [
    ['A job needs more than ~50 ms of CPU', '<b>Worker thread</b>, or a background queue (Ch13) if the user does not need the answer now'],
    ['A big loop you control', '<b>Chunk</b> with setImmediate: short slices, hot loop on local variables'],
    ['You have spare CPU cores', '<b>Cluster</b> (or several containers) to multiply capacity'],
    ['Best in every case', '<b>Do not do it in the request.</b> Precompute, cache, or queue it'],
  ], { co: 25, hl: [3] }) + box('This website', 'Video and image processing never runs inside a request. Upload saves the file and returns immediately; the heavy part runs elsewhere. A request should <b>decide and delegate</b>, not compute.', 'xanh') },

  { t: 'Where to push heavy work', to: true, giua: true, body: steps([
    '<b>Chunk it</b> if it can be interrupted: the cheapest option, no extra process, the loop answers between slices.',
    '<b>A worker thread</b> for CPU-heavy work in this process: real parallelism, message passing, SharedArrayBuffer.',
    '<b>A cluster</b> to use every core for requests: it does NOT make one slow handler faster, it lets N run at once.',
    '<b>A queue</b> when the work outlives the request (Ch13): the user gets an id now; the only option that survives a restart.',
  ]) + box('Rule of thumb', 'Ask in this order: can it leave the request? (queue) · is it CPU-heavy? (worker) · is it a loop I own? (chunk) · do I need more cores? (cluster)', 'xanh') },

  { t: 'Exercise: pick the cure', to: true, giua: true, body: two(`
<ol>
<li>Each upload must create a thumbnail (≈300 ms CPU)</li>
<li>A monthly report over 2 million rows, emailed later</li>
<li>Your API is fine but uses 1 of 8 cores</li>
<li>Sorting a 50,000-item array you loop over yourself</li>
</ol>`, `<div data-k="dapan">${box('Answers', '1. Worker thread (or sharp on the pool).<br>2. A queue (Ch13): nobody waits for it.<br>3. Cluster / more containers.<br>4. Chunk it with setImmediate, hot loop on locals; or a worker if it grows.', 'xanh')}</div>`, 'r64') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why does the heartbeat stay on time when the loop runs in a worker?</li>
<li>Chunked code is 7× slower than the plain loop. What should you check first?</li>
<li>After switching to cluster, a login rate limit stops working. Why?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The worker has its own thread and event loop; the main thread stays free. &nbsp; 2. Whether the hot loop uses outer variables: copy them into locals. &nbsp; 3. Each process keeps its own counter in memory: move it to Redis.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>Worker</b>: real cure for CPU work; costs startup + memory, no shared variables</li>
<li><b>Chunking</b>: cheap, but keep the hot loop on <b>local variables</b></li>
<li><b>Cluster</b>: more cores, separate memory; does not fix blocking code</li>
<li>Best: a request <b>decides and delegates</b>, it does not compute</li>
</ul>
${box('Next', 'Chapter 3 — Core modules: lesson 3.1, path and fs.', 'lam')}` },
]);
