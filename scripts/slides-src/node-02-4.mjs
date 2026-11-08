/**
 * node-02-4 — Node.js · Chapter 2 · Lesson 2.4 "Blocking the event loop, measured" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s02-runtime.mjs › nodejs-2-4-chan-event-loop. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c2).
 * Bổ sung so với bài web: ReDoS đo thật (22 → 30 chữ), JSON.parse 18 MB đo thật, phép tính hàng đợi 200 người từ số đo,
 * ⭐ monitorEventLoopDelay tính cả resolution (đo thật: rảnh vẫn ~21 ms ⇒ phải trừ 20; đã sửa bài web commit 037bf2a0e).
 */
import { lamDeck, two, box, kw, bang, steps, flow, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';
import { readFileSync } from 'node:fs';

export const deck = { key: 'node-02-4', code: 'NODE 2.4', title: 'Blocking the event loop, measured', sub: 'Node.js — from zero to production' };
const doc = (ten) => readFileSync(new URL(`file:///Users/admin/Documents/video-bai-giang/src/khung/node/that/${ten}.out.txt`, import.meta.url), 'utf8');
const work = Number(doc('c2/heartbeat-block').match(/work done after (\d+)/)[1]), late = Number(doc('c2/heartbeat-block').match(/at most (\d+)/)[1]);
const q200 = (200 * work / 1000 / 60).toFixed(1);
const redos = [...doc('c2/redos').matchAll(/(\d+) letters \+ "!": (\d+) ms/g)].map((m) => [Number(m[1]), Number(m[2])]);
const bars = (w = 700, h = 300) => {
  const mx = Math.max(...redos.map((r) => r[1])), bw = (w - 60) / redos.length;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><line x1="40" y1="${h - 40}" x2="${w}" y2="${h - 40}" stroke="#999" stroke-width="2"/>`;
  redos.forEach(([n, ms], i) => { const bh = Math.max(4, (ms / mx) * (h - 90)), x = 50 + i * bw;
    s += `<rect data-k="bar" x="${x}" y="${h - 40 - bh}" width="${bw - 24}" height="${bh}" rx="6" fill="${ms > 1000 ? '#dc2626' : '#f59e0b'}"/>`;
    s += `<text x="${x + (bw - 24) / 2}" y="${h - 46 - bh}" text-anchor="middle" font-size="20" font-weight="800" fill="#333">${ms} ms</text>`;
    s += `<text x="${x + (bw - 24) / 2}" y="${h - 12}" text-anchor="middle" font-size="20" fill="#555">${n} + "!"</text>`; });
  return s + '</svg>';
};

export const slides = lamDeck({ chuong: 'Chapter 2 — Inside the Node.js Runtime', bai: '2.4' }, [
  { cover: true, t: 'Blocking the event loop,<br>measured', sub: 'One heartbeat timer tells you how healthy a Node service is.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A <b>heartbeat</b> experiment: how late does a 100 ms timer get?</li>
<li>What counts as <b>blocking</b>, including a sneaky regex (ReDoS)</li>
<li>The hidden <b>thread pool</b>, seen as two waves of jobs</li>
<li>How to measure <b>event-loop delay</b> in your own service</li>
</ul>
${kw('event-loop delay', 'how late the loop is compared with when a callback should have run')}` },

  { t: 'The experiment: a 100 ms heartbeat', giua: true, body: two(js(ma('c2/heartbeat-block'), { sm: true, hl: [4, 13] }), cot(term(ra('c2/heartbeat-block'), { hl: [2, 3] }), box('How it works', 'Every 100 ms the heartbeat checks how late it is. At 300 ms a <b>synchronous</b> loop of 3 billion additions starts on the same thread.', 'lam'), kw('heartbeat', 'a small timer that should fire on a fixed beat; its lateness shows how busy the loop is')), 'r64') },

  { t: 'Read the two numbers together', to: true, giua: true, body: `${two(box('Work took', `<b style="font-size:40px">${work} ms</b>`, 'lam'), box('Heartbeat late by', `<b style="font-size:40px">${late} ms</b>`, 'do2'))}
<ul>
<li>The same number: for that whole time the process could <b>not</b> receive or answer a request, read the database, reply to a health check, or close a socket</li>
<li>From outside, the server looks <b>dead</b></li>
</ul>
${box('200 users call that endpoint at once', `They do not each wait ${(work / 1000).toFixed(1)} s, they <b>queue</b>: user 200 waits about 200 × ${(work / 1000).toFixed(1)} s ≈ <b>${q200} minutes</b>. One slow endpoint takes down the whole API.`, '')}` },

  { t: 'What counts as blocking', to: true, giua: true, body: `
${box('Blocking (bad)', 'Big loops, <code class="i">JSON.parse</code> of a huge payload, sync crypto, a backtracking regex, <code class="i">fs.readFileSync</code>, image processing in the process.', 'do2')}
${box('Not blocking (fine)', 'Anything you <code class="i">await</code>: database queries, HTTP calls, async file reads. Waiting is free.', 'xanh')}
${box('Sneaky', 'A regex run on user input can backtrack <b>exponentially</b>: a short string can freeze the loop. A real denial-of-service attack: <b>ReDoS</b>.', '')}
${kw('ReDoS', 'Regular expression Denial of Service: a regex that takes forever on a crafted input')}` },

  { t: 'ReDoS, measured: each 2 letters ≈ 4× slower', giua: true, body: two(cot(js(ma('c2/redos'), { sm: true }), term(ra('c2/redos'), { hl: [5] })), cot(bars(560, 330),
    box('Why', '<code class="i">(a+)+</code> can split the a\'s in exponentially many ways. The final "!" forces the engine to try them <b>all</b> before it says no.', 'do2')), 'r64') },

  { t: 'Big JSON blocks too', to: true, giua: true, body: `${runJs(ma('c2/json-big'), ra('c2/json-big'), { hl: [6], hlOut: [2], sm: false })}
${two(box('Sync APIs', '<code class="i">readFileSync</code>, <code class="i">execSync</code>, <code class="i">pbkdf2Sync</code>: handy in a script, a frozen server inside a request handler.', 'do2'), box('Size matters', 'Parsing scales with the payload. Cap request body sizes (Chapter 6) so a client cannot send you a 500 MB JSON.', 'lam'))}` },

  { t: 'The hidden thread pool: two waves', giua: true, body: two(cot(js(ma('c2/pool'), { sm: true }), box('pbkdf2', 'Async, but truly CPU-heavy: libuv runs it on the <b>thread pool</b>, 4 threads by default.', 'lam')), cot(term(ra('c2/pool'), { title: 'node pool.js', hl: [5, 6, 7, 8] }),
    box('Look at the gap', 'Jobs 1–4 finish around 50 ms; jobs 5–8 only start when a thread is free and finish around 100–120 ms. You are looking at a team of <b>four workers</b>.', 'xanh')), 'r64') },

  { t: 'More workers: the second wave disappears', giua: true, body: two(term(ra('c2/pool8'), { title: 'UV_THREADPOOL_SIZE=8', hl: [1] }), cot(
    box('Do not overdo it', 'Raising <code class="i">UV_THREADPOOL_SIZE</code> past your CPU core count gains nothing: the threads just fight over the same cores.', 'do2'),
    box('What the pool carries', 'Only file I/O, DNS lookups, zlib and crypto. <b>Your own JavaScript loop never goes to the pool.</b>', 'lam'),
    box('Real numbers', `Last job finished: <b>${doc('c2/pool').match(/job 8 done after (\d+)/)[1]} ms</b> with 4 threads, <b>${Math.max(...[...doc('c2/pool8').matchAll(/after (\d+) ms/g)].map((m) => Number(m[1])))} ms</b> with 8.`, 'xanh')), 'r46') },

  { t: 'Measure it in your own service', giua: true, body: `${js(ma('c2/loop-delay'), { sm: true, hl: [11, 12, 13] })}${two(term(ra('c2/loop-delay'), { hl: [2] }), box('Read it', 'Windows 1 and 3: the loop is idle, real delay about 1 ms. Window 2: one 150 ms block shows up as about 130 ms of delay.', 'lam'))}` },

  { t: 'Reading the number', to: true, giua: true, body: `${bang(['Real delay (p99)', 'Meaning'], [['under 10 ms', 'Healthy: the loop keeps up'], ['50–100 ms', 'Something is doing real work on the main thread: investigate'], ['over 500 ms', 'Users already feel it: requests queue behind computation']], { co: 24 })}
${box('⭐ Trap: subtract the resolution', 'The histogram also counts the sampling gap itself (20 ms here). An idle loop reads about 21 ms. Without subtracting, a healthy service never looks "under 10 ms".', 'do2')}
${kw('p99', 'the 99th percentile: 99% of samples were at or below this value')}` },

  { t: 'Why this website resizes images with sharp', to: true, giua: true, body: two(box('Pure-JS image library', 'Runs on the <b>single JS thread</b>. While it resizes, every other request waits.', 'do2'), box('sharp (native)', 'C++ code that <b>releases the JS thread</b> and works on libuv\'s pool. The loop stays free.', 'xanh')) + `
${kw('native library', 'code compiled from C/C++ that Node calls through bindings')}
${box('Same API shape, different behaviour under load', 'From your side both are <code class="i">await resize(img)</code>. Only measurement shows the difference.', 'lam')}
${flow([{ t: 'handler', s: 'await sharp(img)…', mau: '#2563eb' }, { t: 'bindings', s: 'JS → C++', mau: '#ea580c' }, { t: 'libuv pool', s: 'a pool thread resizes', mau: '#7c3aed' }, { t: 'callback', s: 'loop was free all along', mau: '#15803d' }], { w: 1100, h: 130 })}` },

  { t: 'Blocking or not: four rules', to: true, giua: true, body: steps([
    '<b>A long synchronous loop BLOCKS.</b> 50 MB of JSON, nested loops over 10,000 items, a backtracking regex.',
    '<b>A Sync API BLOCKS.</b> readFileSync, execSync, pbkdf2Sync: fine in a script, frozen inside a handler.',
    '<b>An await does NOT block.</b> The handler pauses and the thread is free: a request waiting for the database costs nothing.',
    '<b>A call through the pool may QUEUE.</b> Four hashes in flight and the fifth waits, though nothing looks blocked.',
  ]) + box('Rule of thumb', 'If it <b>waits</b>, await it. If it <b>computes</b>, measure it, and move it off the loop when it is big (lesson 2.5).', 'xanh') },

  { t: 'Exercise: block, free, or queue?', to: true, giua: true, body: two(`
<ol>
<li><code class="i">fs.readFileSync</code> inside a route handler</li>
<li><code class="i">await db.query(sql)</code></li>
<li>10 parallel <code class="i">crypto.pbkdf2</code> calls</li>
<li><code class="i">JSON.parse</code> on a 50 MB body</li>
<li><code class="i">/^(a+)+$/.test(userInput)</code></li>
<li><code class="i">await fetch(url)</code></li>
</ol>`, `<div data-k="dapan">${box('Answers', '<b>Block:</b> 1, 4, 5.<br><b>Free:</b> 2, 6 (they wait).<br><b>Queue:</b> 3: the loop stays free, but jobs 5–10 wait for a pool thread.', 'xanh')}</div>`, 'r64') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>A 100 ms heartbeat was late by 2.9 s. What happened during those 2.9 s?</li>
<li>Does an async <code class="i">crypto.pbkdf2</code> block the event loop? What can it slow down?</li>
<li>Idle service, <code class="i">resolution: 20</code>, p99 says 21 ms. Is the loop in trouble?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The JS thread was busy: no request, timer or I/O callback could run. &nbsp; 2. No, it runs on the pool; but it can make other pool work (fs, DNS) queue. &nbsp; 3. No: about 1 ms of real delay.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Heartbeat lag = time the JS thread was <b>busy</b> = time the server was dead</li>
<li>Blocking: long loops, big JSON, Sync APIs, <b>backtracking regex</b></li>
<li>The pool has <b>4 threads</b>: crypto and fs can queue behind each other</li>
<li>Watch <b>monitorEventLoopDelay</b> p99, minus the resolution</li>
</ul>
${box('Next', 'Lesson 2.5 — Getting heavy work off the event loop.', 'lam')}` },
]);
