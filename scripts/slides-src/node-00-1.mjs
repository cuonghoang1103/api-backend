/**
 * node-00-1 — Node.js · Section 0 · Lesson 0.1 "About this course & the full roadmap" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s00-intro.mjs › nodejs-0-1-gioi-thieu. Mã + output = chạy thật Node 22.23.3 (src/khung/node/that/c0).
 * Bổ sung so với bài web: mô hình request–response + một server thật, phép đo 1.000 request chờ cùng lúc.
 */
import { lamDeck, two, box, cards, kw, flow, tbl, c, ma, ra, runJs, term } from './_node-chung.mjs';

export const deck = { key: 'node-00-1', code: 'NODE 0.1', title: 'About this course & the full roadmap', sub: 'Node.js — from zero to production' };

const NODE = '#15803d', CAM = '#e08a1e', NAU = '#b85a2b', LAM = '#336791';

/* Thanh 5% / 95% (SVG). */
const thanh = () => `<svg viewBox="0 0 1110 96" width="1110" height="96" font-family="Arial">
  <rect x="0" y="6" width="56" height="58" rx="8" fill="${CAM}"/><rect x="60" y="6" width="1050" height="58" rx="8" fill="${NODE}"/>
  <text x="28" y="44" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">5%</text>
  <text x="585" y="44" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">95% — does the API survive real users?</text>
  <text x="0" y="90" font-size="19" fill="#555">app.get('/', …)</text>
</svg>`;

/* Lớp của Node (SVG). */
const lop = () => {
  const L = [['Your JavaScript + npm packages', CAM], ['Node.js standard library: fs, http, crypto…', NODE]];
  let s = `<svg viewBox="0 0 520 330" width="520" height="330" font-family="Arial">`;
  L.forEach(([t, m], i) => { s += `<rect data-k="lop" x="4" y="${6 + i * 80}" width="512" height="70" rx="10" fill="${m}18" stroke="${m}" stroke-width="2.5"/><text x="260" y="${48 + i * 80}" text-anchor="middle" font-size="21" font-weight="700" fill="#333">${t}</text>`; });
  s += `<rect x="4" y="166" width="250" height="84" rx="10" fill="${LAM}18" stroke="${LAM}" stroke-width="2.5"/><text x="129" y="202" text-anchor="middle" font-size="24" font-weight="800" fill="${LAM}">V8</text><text x="129" y="232" text-anchor="middle" font-size="18" fill="#444">runs JavaScript</text>`;
  s += `<rect x="266" y="166" width="250" height="84" rx="10" fill="${NAU}18" stroke="${NAU}" stroke-width="2.5"/><text x="391" y="202" text-anchor="middle" font-size="24" font-weight="800" fill="${NAU}">libuv</text><text x="391" y="232" text-anchor="middle" font-size="18" fill="#444">event loop + I/O</text>`;
  s += `<rect x="4" y="260" width="512" height="62" rx="10" fill="#f3f3f3" stroke="#8a8a8a" stroke-width="2.5"/><text x="260" y="298" text-anchor="middle" font-size="21" font-weight="700" fill="#333">Operating system: files, network, processes</text>`;
  return s + '</svg>';
};

/* Hai biểu đồ thời gian (SVG): 4 luồng / 1 luồng. */
const gantt = () => {
  const mau = ['#2563eb', '#ea580c', '#7c3aed', '#0f766e'], u = 34, x0 = 96;
  const bar = (x, y, w, m, cho) => `<rect x="${x}" y="${y}" width="${w}" height="30" rx="5" fill="${cho ? '#fff' : m}" stroke="${m}" stroke-width="${cho ? 1.5 : 0}" ${cho ? 'stroke-dasharray="6 4"' : ''}/>`;
  let a = `<svg viewBox="0 0 540 250" width="540" height="250" font-family="Arial"><text x="0" y="24" font-size="22" font-weight="800" fill="#a52a1d">One thread per request</text>`;
  mau.forEach((m, i) => { const y = 42 + i * 40; a += `<text x="0" y="${y + 22}" font-size="19" fill="#555">Thread ${i + 1}</text>` + bar(x0 + i * u, y, u, m) + bar(x0 + (i + 1) * u, y, 6 * u, m, true) + bar(x0 + (i + 7) * u, y, u, m); });
  a += `<text x="${x0 + 100}" y="240" font-size="19" fill="#666">dashed = waiting, memory still in use</text></svg>`;
  let b = `<svg viewBox="0 0 540 250" width="540" height="250" font-family="Arial"><text x="0" y="24" font-size="22" font-weight="800" fill="#1f6b40">One thread + event loop</text>`;
  b += `<text x="0" y="64" font-size="19" font-weight="700" fill="#333">JS thread</text>`;
  mau.forEach((m, i) => { b += bar(x0 + i * u, 42, u, m) + bar(x0 + (i + 7) * u, 42, u, m); });
  b += `<rect x="${x0 + 4 * u}" y="42" width="${3 * u}" height="30" rx="5" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/><text x="${x0 + 5.5 * u}" y="64" text-anchor="middle" font-size="17" font-weight="700" fill="#166534">free</text>`;
  mau.forEach((m, i) => { const y = 86 + i * 30; b += `<rect x="${x0 + (i + 1) * u}" y="${y}" width="${6 * u}" height="22" rx="4" fill="#fff" stroke="${m}" stroke-width="1.5" stroke-dasharray="6 4"/>`; });
  b += `<text x="0" y="146" font-size="19" fill="#555">Waiting</text><text x="0" y="170" font-size="17" fill="#777">(OS handles it)</text>`;
  b += `<text x="${x0 + 40}" y="240" font-size="19" fill="#666">the thread never sits idle while requests wait</text></svg>`;
  return two(a, b);
};

const chuong = (n, t) => `<div style="display:flex;gap:9px;align-items:center;font-size:20px;line-height:1.28"><span style="flex:0 0 32px;height:32px;border-radius:7px;background:${NODE};color:#fff;font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center">${n}</span><span>${t}</span></div>`;
const gd = (h, mau, items) => `<div data-k="gd" style="border:2px solid ${mau};border-radius:12px;padding:9px 11px;display:flex;flex-direction:column;gap:5px"><div style="font-weight:800;color:${mau};font-size:18px;letter-spacing:.4px;text-transform:uppercase">${h}</div>${items.map(([n, t]) => chuong(n, t)).join('')}</div>`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.1' }, [
  { cover: true, t: 'About this course<br>& the full roadmap', sub: 'Node.js — from zero to production.<br>Every number here comes from a real, measured run.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What a <b>backend</b> does: request → server → response</li>
<li>What <b>Node.js</b> is, who made it and what it replaced</li>
<li>Why <b>one thread</b> can juggle thousands of connections</li>
<li>The map of the course: <b>6 stages, 18 chapters</b></li>
<li>Why "it runs" proves very little on a server</li>
</ul>
${box('Promise', 'By the end you will have built, tested, secured and deployed a real API <b>yourself</b>.', 'xanh')}` },

  { t: 'Frontend is what you see. Backend is what answers.', to: true, giua: true, body: `
${flow([
    { t: 'Browser (client)', s: 'React, a phone app, curl', mau: CAM },
    { t: 'Node.js server', s: 'your code runs here', mau: NODE },
    { t: 'Database', s: 'remembers the data', mau: LAM },
  ], { h: 170, fs: 24 })}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
${box('', `${kw('client', 'the side that asks')}<br>A browser, an app, anything that sends a request.`, 'lam')}
${box('', `${kw('server', 'the side that answers')}<br>A program that waits and never stops.`, 'xanh')}
${box('', `${kw('request', 'the question')}<br>Method + URL + headers + maybe a body.`, 'lam')}
${box('', `${kw('response', 'the answer')}<br>Status code + headers + body.`, 'xanh')}
</div>` },

  { t: 'One real server, one real response', body: runJs(ma('c0/hello-server', 4, 10), ra('c0/hello-server'), { hl: [5], hlOut: [2, 9] }) },

  { t: 'How to read that response', to: true, giua: true, body: two(term(ra('c0/hello-server', 2), { hl: [1, 8] }), `
<div style="display:flex;flex-direction:column;gap:12px">
${box('Status line', '<b>200 OK</b> — it worked. You will meet 404, 401, 500 later.', 'xanh')}
${box('Headers', 'Facts about the message, such as <code class="i">Content-Type</code>.', 'lam')}
${box('Body', 'The data itself. For an API it is usually <b>JSON</b>.', '')}
</div>`) },

  { t: 'Tutorials stop at 5%. The job starts there.', giua: true, body: `${thanh()}
<table class="t" style="font-size:24px"><tr><th style="width:150px">Topic</th><th>A typical tutorial</th><th>This course</th></tr>
<tr><td><b>Node</b></td><td>Install Express, write 3 routes, done</td><td>Why the event loop is fast, what blocks it, how requests die under load — <b>measured</b></td></tr>
<tr><td><b>Auth</b></td><td>"Use JWT"</td><td>Why access tokens stay short, what rotation prevents, the bug that logged everyone out</td></tr>
<tr><td><b>Deploy</b></td><td>Press the deploy button</td><td>Build a Docker image, ship with no downtime, read the logs after exit code 137</td></tr></table>` },

  { t: 'What you will be able to build', to: true, giua: true, body: `
${cards([
    ['🔐 A real REST API', 'Authentication, authorization, input validation, pagination, file upload.'],
    ['🗄️ A safe database layer', 'Migrations, relations and transactions that do not corrupt data.'],
    ['💬 Realtime features', 'Chat and notifications over WebSocket.'],
    ['⏱️ Background work', 'Queues, caching and scheduled jobs.'],
    ['🧪 A tested service', 'Unit, HTTP and database tests running in CI.'],
    ['🚀 Your own deployment', 'A Docker image on your own server, with logs and health checks.'],
  ], 3)}
${box('Running project', 'We grow one <b>Notes API</b> from an empty folder to production, chapter by chapter.', 'xanh')}` },

  { t: 'What is Node.js?', giua: true, body: two(`
<ul>
<li><b>Before 2009:</b> JavaScript ran only in the browser. Servers used PHP, Java, Ruby or Python.</li>
<li><b>2009:</b> Ryan Dahl took <b>V8</b>, Chrome's JavaScript engine, and let it run on a server. He showed it at JSConf EU.</li>
<li><b>Second idea:</b> a single-threaded, non-blocking event loop.</li>
<li><b>Today:</b> led by the OpenJS Foundation and a large community.</li>
</ul>`, lop()) },

  { t: 'One thread per request vs one event loop', giua: true, body: `${gantt()}
${box('The idea', 'Most of a web request is <b>waiting</b> for a database or a disk. Node does not keep a thread idle during that wait, so one process can hold thousands of connections.', 'xanh')}` },

  { t: 'Measured: 1,000 requests waiting at once', giua: true, body: `${runJs(ma('c0/wait-server', 8, 15), ra('c0/wait-server'), { title: 'client: 1000 requests at the same time', hl: [5, 6, 7] , hlOut: [2] })}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
${box('Waiting is cheap', 'One process, 1,000 requests in the air at once.', 'xanh')}
${box('Computing is not', 'Heavy CPU work blocks everyone. Chapter 2 proves it.', 'do2')}
</div>` },

  { t: 'Node.js at a glance', to: true, giua: true, body: cards([
    ['Who & when', 'Ryan Dahl, 2009. Now the OpenJS Foundation and a large community.'],
    ['Built on', 'V8 (runs JavaScript) + libuv (event loop and async I/O).'],
    ['Used for', 'APIs, realtime apps, CLIs, build tools. Netflix, PayPal, LinkedIn, Uber.'],
    ['Why learn it', 'A top backend skill, and one language across the whole stack.'],
  ], 2) },

  { t: 'The map: 6 stages, 18 chapters', body: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
${gd('1 · Foundations', NODE, [[1, 'JavaScript for backend'], [2, 'Inside the runtime'], [3, 'Core modules'], [4, 'npm & clean projects']])}
${gd('2 · Build the API', LAM, [[5, 'Express'], [6, 'REST API design'], [7, 'PostgreSQL + Prisma']])}
${gd('3 · Make it safe', '#b0281a', [[8, 'Auth & permissions'], [9, 'Web security'], [10, 'File upload & storage']])}
${gd('4 · Real systems', '#7c3aed', [[11, 'Realtime: WebSocket'], [12, 'Cache: Redis'], [13, 'Background jobs']])}
${gd('5 · Reliability', '#0f766e', [[14, 'Testing'], [15, 'Logs & observability'], [16, 'Performance']])}
${gd('6 · Production', NAU, [[17, 'Docker & deploy'], [18, 'Architecture']])}
</div>
${box('Do not skip', 'Each stage stands on the one before. Chapter 8 will not make sense if Chapter 2 is not clear.', '')}` },

  { t: 'Who this course is for', to: true, giua: true, body: two(`
${box('You need', 'Basic code in any language: variables, loops, functions.', 'xanh')}
${box('You do NOT need', 'JavaScript (Chapter 1 rebuilds it) or any backend experience.', 'lam')}`, `
${box('Time budget', '<b>3–4 hours</b> per chapter if you type every example.<br>18 chapters ≈ <b>60–70 hours</b>.', '')}
${box('The goal', 'Not speed. Being able to rebuild it from memory.', 'xanh')}`) },

  { t: 'This website runs this exact stack', to: true, giua: true, body: `
${flow([
    { t: 'Node + Express', s: 'TypeScript · Ch 5', mau: NODE },
    { t: 'PostgreSQL', s: 'via Prisma · Ch 7', mau: LAM },
    { t: 'Redis', s: 'cache · Ch 12', mau: '#b0281a' },
    { t: 'Socket.IO', s: 'realtime · Ch 11', mau: '#7c3aed' },
    { t: 'Cloudflare R2', s: 'media · Ch 10', mau: CAM },
    { t: 'Docker + VPS', s: 'deploy · Ch 17', mau: NAU },
  ], { h: 170, fs: 19 })}
${box('Why it matters', 'When a chapter says "in production we do this", it means <b>here</b>: this site, its outages, its wrong decisions and how they were fixed.', 'xanh')}
<p style="margin:0">Practice track: <b>Node.js (Express) on Code Lab</b> · 16 modules · 160 exercises with solutions.</p>` },

  { t: 'The trap: reading backend like frontend', to: true, giua: true, body: `<div class="vsd">
<div class="sai"><div class="h">A frontend bug</div><p style="margin:0">A broken layout, a dead button. You see it at the next refresh.</p></div>
<div class="dung" style="background:#fff7ef;border-color:#e3c9ae"><div class="h" style="color:#9a4a12">A backend bug</div><p style="margin:0">A connection leak, a transaction that is not one, a query that is fine with 50 rows. Nothing on screen changes.</p></div>
</div>
${box('So', '"It runs" is a weak signal on a server. Almost every chapter here ends with a <b>measurement</b>, not a screenshot.', 'do2')}
${box('The only proof', 'Make it prove itself under conditions close to production.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>A server sends <code class="i">HTTP/1.1 200 OK</code>. Which part of the response is that?</li>
<li>What are the two engines inside Node.js?</li>
<li>Why can one Node process hold many waiting requests?</li>
</ol>
${box('Answers', '1. The status line. &nbsp; 2. V8 and libuv. &nbsp; 3. While a request waits, the thread is free to serve others.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Backend = a program that waits for requests and sends responses</li>
<li>Node.js = JavaScript outside the browser: V8 + libuv</li>
<li>Waiting is cheap, heavy computing is not</li>
<li>6 stages, 18 chapters, one running project: Notes API</li>
<li>On a server, measure. "It runs" proves little</li>
</ul>
${box('Next', 'Lesson 0.2 — How to study this course effectively.', 'lam')}` },
]);
