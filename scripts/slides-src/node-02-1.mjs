/**
 * node-02-1 — Node.js · Chapter 2 · Lesson 2.1 "What Node.js actually is" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s02-runtime.mjs › nodejs-2-1-runtime-la-gi. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c2).
 * Bổ sung so với bài web: những việc trình duyệt cấm (chạy thật), đếm luồng HĐH của chính tiến trình (7 → 11), 10 000 lần chờ vs 10 lần tính (đo thật),
 * bẫy pool: readFile 1 ms → 131 ms khi 4 pbkdf2 chiếm pool (đo thật), bài tập phân loại việc hợp / không hợp với Node.
 */
import { lamDeck, two, box, cards, kw, steps, flow, bang, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-02-1', code: 'NODE 2.1', title: 'What Node.js actually is', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', V8C = '#2563eb', UV = '#7c3aed', OS = '#475569', LIB = '#ca8a04', GLUE = '#ea580c';

/* Hộp 6 tầng: tầng của bạn ở trên, V8 + libuv cạnh nhau, HĐH dưới cùng. */
const hop = (w = 640, h = 470) => {
  const r = (y, hh, x, ww, m, t, s, k) => `<rect data-k="${k}" x="${x}" y="${y}" width="${ww}" height="${hh}" rx="12" fill="${m}18" stroke="${m}" stroke-width="3"/>` +
    `<text x="${x + ww / 2}" y="${y + hh / 2 - 4}" text-anchor="middle" font-size="25" font-weight="800" fill="${m}">${t}</text>` +
    `<text x="${x + ww / 2}" y="${y + hh / 2 + 24}" text-anchor="middle" font-size="18" fill="#444">${s}</text>`;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<rect x="6" y="6" width="${w - 12}" height="${h - 92}" rx="18" fill="none" stroke="${NODE}" stroke-width="4" stroke-dasharray="10 7"/>`;
  s += `<text x="24" y="40" font-size="20" font-weight="800" fill="${NODE}">node (one process)</text>`;
  s += r(52, 74, 30, w - 60, NODE, 'Your JavaScript', 'your code + npm packages', 'lop');
  s += r(138, 74, 30, w - 60, LIB, 'Node standard library', 'fs, http, crypto… written in JS', 'lop');
  s += r(224, 62, 30, w - 60, GLUE, 'C++ bindings', 'the bridge from JS down to the OS', 'lop');
  s += r(298, 76, 30, (w - 76) / 2, V8C, 'V8', 'compiles + runs JS', 'lop');
  s += r(298, 76, 46 + (w - 76) / 2, (w - 76) / 2, UV, 'libuv', 'event loop + pool + I/O', 'lop');
  s += r(h - 74, 66, 30, w - 60, OS, 'Operating system', 'files, network, processes', 'lop');
  return s + '</svg>';
};

/* Một luồng một request (nằm chờ) vs một luồng + event loop. */
const gantt = () => {
  const C = ['#2563eb', '#ea580c', '#7c3aed', '#0f766e'], u = 34, x0 = 120;
  let a = `<svg viewBox="0 0 560 260" width="560" height="260" font-family="Arial"><text x="0" y="26" font-size="23" font-weight="800" fill="#a52a1d">One thread per request</text>`;
  C.forEach((m, i) => { const y = 50 + i * 48;
    a += `<text x="0" y="${y + 27}" font-size="19" fill="#555">thread ${i + 1}</text>`;
    a += `<rect x="${x0 + i * u}" y="${y}" width="${u}" height="36" rx="5" fill="${m}"/><rect x="${x0 + (i + 1) * u}" y="${y}" width="${u * 6}" height="36" rx="5" fill="none" stroke="${m}" stroke-width="2.5" stroke-dasharray="7 5"/><rect x="${x0 + (i + 7) * u}" y="${y}" width="${u}" height="36" rx="5" fill="${m}"/>`; });
  a += `<text x="${x0}" y="252" font-size="18" fill="#666">dashed = waiting, the thread still holds memory</text></svg>`;
  let b = `<svg viewBox="0 0 560 260" width="560" height="260" font-family="Arial"><text x="0" y="26" font-size="23" font-weight="800" fill="#1f6b40">One thread + event loop</text>`;
  b += `<text x="0" y="77" font-size="19" fill="#555">JS thread</text>`;
  C.forEach((m, i) => { b += `<rect x="${x0 + i * u}" y="50" width="${u}" height="36" rx="5" fill="${m}"/><rect x="${x0 + (i + 7) * u}" y="50" width="${u}" height="36" rx="5" fill="${m}"/>`;
    b += `<rect x="${x0 + (i + 1) * u}" y="${108 + i * 26}" width="${u * 6}" height="16" rx="4" fill="none" stroke="${m}" stroke-width="2.5" stroke-dasharray="7 5"/>`; });
  b += `<rect x="${x0 + 4 * u}" y="50" width="${u * 3}" height="36" rx="5" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/><text x="${x0 + 5.5 * u}" y="74" text-anchor="middle" font-size="16" font-weight="700" fill="#166534">free</text>`;
  b += `<text x="0" y="146" font-size="19" fill="#555">waiting</text><text x="0" y="168" font-size="19" fill="#555">(the OS)</text>`;
  b += `<text x="${x0}" y="252" font-size="18" fill="#666">the thread picks up new requests while others wait</text></svg>`;
  return two(`<div data-k="g1">${a}</div>`, `<div data-k="g2">${b}</div>`);
};

export const slides = lamDeck({ chuong: 'Chapter 2 — Inside the Node.js Runtime', bai: '2.1' }, [
  { cover: true, t: 'What Node.js<br>actually is', sub: 'Not a language, not a framework: a runtime.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>runtime</b> is, and what Node can do that a browser forbids</li>
<li>The <b>three parts</b> in one box: V8, libuv and the glue between them</li>
<li>"Single-threaded", said <b>precisely</b> (and measured)</li>
<li>Where one request <b>really goes</b>, in five steps</li>
<li>The trap: one JS thread is <b>not</b> one thread</li>
</ul>` },

  { t: 'Not a language, not a framework', to: true, giua: true, body: `${cards([
    ['Language', 'JavaScript: the <b>rules</b> for writing code. The same language runs in Chrome and in Node.'],
    ['Framework', 'Express, NestJS: a <b>structure</b> for your app, written in JavaScript. Chapter 5.'],
    ['Runtime', 'Node.js: a <b>program that runs JavaScript</b> outside the browser, plus a library for files, sockets and processes.'],
  ])}
${box('Picture it', 'JavaScript is the <b>recipe</b>. Chrome and Node are two <b>kitchens</b>. Same recipe, but only the Node kitchen has a door to the street (files, network, other programs).', 'xanh')}
${flow([{ t: 'app.js', s: 'your recipe', mau: '#ca8a04' }, { t: 'node', s: 'the kitchen (runtime)', mau: '#15803d' }, { t: 'V8 + libuv', s: 'the cook + the door', mau: '#7c3aed' }, { t: 'CPU · disk · network', s: 'the real machine', mau: '#475569' }], { w: 1100, h: 130 })}` },

  { t: 'What a browser forbids, Node allows', giua: true, body: `${runJs(ma('c2/runtime-powers'), ra('c2/runtime-powers'), { hl: [6, 8, 9, 10], hlOut: [2, 3, 4], sm: false })}
${box('Why a browser says no', 'A web page comes from a stranger. If it could read your disk or start programs, any site could steal your files. Node runs <b>your</b> code, so it gets the keys.', '')}` },

  { t: 'Three parts in one box', giua: true, body: two(hop(640, 470), cot(
    box('Top: what you write', 'Your code and npm packages call the <b>standard library</b> (fs, http, crypto), which is plain JavaScript.', 'xanh'),
    box('Middle: the glue', 'C++ <b>bindings</b> carry a call like <code class="i">fs.readFile</code> down to C code.', ''),
    box('Bottom: two engines', '<b>V8</b> runs JavaScript. <b>libuv</b> talks to the operating system without blocking.', 'lam'),
  ), 'r64') },

  { t: 'See both engines with your own eyes', to: true, giua: true, body: `${runJs(ma('c2/versions'), ra('c2/versions'), { hlOut: [2, 3], sm: false })}
${box('One-liner', 'No file needed: <code class="i">node -p "process.versions.v8"</code> prints the value of one expression (<b>-p</b> = print).', '')}
${box('Read it', '<b>V8</b> is the same engine Chrome uses. <b>uv</b> is libuv. Your numbers may differ slightly: they follow your Node version.', 'lam')}` },

  { t: 'Who does what', giua: true, body: `${bang(['Part', 'Its job', 'Knows nothing about'], [
    ['<b style="color:#2563eb">V8</b>', 'Turns your JavaScript into machine code and runs it. Allocates memory, collects garbage.', 'files, network'],
    ['<b style="color:#7c3aed">libuv</b>', 'A C library: the event loop, async file and network I/O, a small thread pool.', 'your JavaScript'],
    ['<b style="color:#ea580c">bindings</b>', 'Glue code: <code class="i">fs.readFile</code> in JS becomes an OS call, and the result comes back up to V8.', '(it is only the bridge)'],
  ], { co: 22 })}
${box('Key sentence', 'libuv, not V8, is what makes Node <b>non-blocking</b>.', 'xanh')}
${kw('garbage collection', 'V8 frees memory you no longer use, automatically')}` },

  { t: '"Single-threaded": what it means exactly', to: true, giua: true, body: `
${box('True', 'Only <b>ONE thread runs your JavaScript</b>. Two lines of your code never run at the same moment, so you never need a lock or mutex on your variables.', 'xanh')}
${box('Also true', 'Node itself uses <b>MANY threads</b> underneath: libuv keeps a pool (4 by default) for file I/O, DNS and crypto. Lesson 2.4 measures it.', 'lam')}
${box('So', 'Waiting is free: one thread starts thousands of I/O jobs and moves on. Computing is expensive: while your code computes, nothing else in the process runs.', '')}
${kw('thread', 'a line of work the CPU runs; one thread does one thing at a time')}` },

  { t: 'Count the threads yourself', giua: true, body: `${runJs(ma('c2/threads'), ra('c2/threads'), { hl: [4, 8, 10], hlOut: [1, 2, 3] })}
${two(box('What you see', 'Your JS runs on one thread, yet the process already has 7 OS threads. The first crypto job adds 4 more: the libuv pool.', 'lam'), box('macOS command', '<code class="i">ps -M -p &lt;pid&gt;</code> lists the threads of one process (one line each).', ''))}` },

  { t: 'Great at waiting, terrible at thinking', giua: true, body: `${js(ma('c2/wait-vs-think'), { hl: [6, 10], sm: true })}${term(ra('c2/wait-vs-think'), { hl: [1, 2] })}
${two(box('Good fit', 'APIs that mostly wait: for the database, another API, the disk. Chat, proxies, file streaming.', 'xanh'), box('Bad fit (unless moved off, 2.5)', 'Video encoding, image resizing, password hashing in a tight loop.', 'do2'))}` },

  { t: 'Where one request really goes', to: true, giua: true, body: `${steps([
    '<b>Request arrives</b>: libuv sees the socket has data to read',
    '<b>Your handler runs</b> on the single JS thread, inside V8',
    '<b>You <code class="i">await</code> the database</b>: the handler pauses, the thread is FREE for other requests',
    '<b>The result comes back</b>: libuv queues the rest of your handler',
    '<b>Response sent</b>: the handler continues and finishes',
  ])}
${flow([{ t: 'socket', s: 'libuv', mau: '#7c3aed' }, { t: 'handler', s: 'V8, JS thread', mau: '#2563eb' }, { t: 'await db', s: 'thread is free', mau: '#15803d' }, { t: 'result', s: 'libuv queues it', mau: '#7c3aed' }, { t: 'response', s: 'handler ends', mau: '#2563eb' }], { w: 1100, h: 130 })}
${box('The magic is step 3', 'A waiting request costs almost nothing, so one Node process can hold tens of thousands of open connections.', 'xanh')}` },

  { t: 'Why step 3 matters: two kinds of server', giua: true, body: `${gantt()}
${two(box('Classic PHP / Java', 'One thread per request. While it waits for the database, the thread sits idle and still holds its memory.', 'do2'), box('Node', 'The same thread picks up the next request. This website runs ONE Node process per container: API, chat, file streaming.', 'xanh'))}` },

  { t: 'Trap: "single-threaded" is not "one thread"', giua: true, body: `${runJs(ma('c2/pool-starve', 5, 19), ra('c2/pool-starve'), { hlOut: [2] })}
${two(box('What happened', 'Four slow <code class="i">pbkdf2</code> hashes filled the 4 pool threads. An unrelated <code class="i">readFile</code> had to queue: 1 ms became 131 ms.', 'do2'), box('Remember', 'The knob is <code class="i">UV_THREADPOOL_SIZE</code> (default 4). Symptom: file latency rises while nothing about the disk changed.', 'lam'))}` },

  { t: 'Exercise: does it fit Node?', to: true, giua: true, body: two(`
<ol>
<li>A chat server with 20,000 open sockets</li>
<li>A REST API that mostly waits for PostgreSQL</li>
<li>Resizing every uploaded photo inside the request</li>
<li>A proxy that streams files from storage</li>
<li>Hashing a password in a sync loop on each login</li>
</ol>`, `<div data-k="dapan">${box('Answers', '<b>Fits:</b> 1, 2, 4 (they mostly wait).<br><b>Does not fit as written:</b> 3, 5 (they compute on the only JS thread). Move that work off the loop: a worker, a native library on the pool, or a queue (2.5, Ch13).', 'xanh')}</div>`, 'r64') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Which part of Node runs your JavaScript, and which part talks to the OS?</li>
<li>How many threads run <b>your JavaScript</b>? How many does libuv's pool have by default?</li>
<li>During <code class="i">await db.query()</code>, what is the JS thread doing?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. V8 runs JS; libuv (through the bindings) talks to the OS. &nbsp; 2. One; four. &nbsp; 3. Nothing for this request: it is free to serve other requests.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Node = a <b>runtime</b>: JavaScript outside the browser, plus powers</li>
<li>Inside: your code → standard library → bindings → <b>V8 + libuv</b> → OS</li>
<li>ONE thread runs your JS; libuv keeps <b>more threads</b> underneath</li>
<li>Great at waiting, terrible at thinking: <b>await is free</b>, loops are not</li>
</ul>
${box('Next', 'Lesson 2.2 — The event loop, phase by phase.', 'lam')}` },
]);
