/**
 * node-05-5 — Node.js · Chapter 5 · Lesson 5.5 "Assembling the Notes API" (slide EN, kiểu FU, đợt 3 — 01/11/2026). MỘT deck, HAI tập:
 *   5.5a (node-5-5)   = slide 1–11: bố cục thư mục · luật service không đụng req/res · app.mjs theo đúng thứ tự · createApp() · router chỉ HTTP · bài tập "mã này thuộc tệp nào"
 *   5.5b (node-5-5-2) = slide 12–24 (24 slide): chạy toàn bộ bằng curl (thật) · đọc cột log · tắt server không rơi request (không handler / có handler / keep-alive) · còn thiếu gì
 * Nguồn: s05-express.mjs › nodejs-5-5-notes-api. Dự án THẬT 6 tệp: src/khung/node/that/c5notes/* (chạy bằng chay-no.mjs trong /tmp/notes-api-demo, Express 5.3, cổng 4100),
 * tắt server: that/c5/{shutdown,shutdown-none,shutdown-ka,shutdown-ka-fix} + c5/ka.client.mjs.
 * ⚠️ Khác bài web (chạy thật Node 22.23.3): (1) app.mjs đặt requestLogger TRƯỚC express.json — đặt sau (như web) thì request JSON hỏng không có dòng log (thí nghiệm
 * c5/logger-order). (2) server.close() của Node ≥ 19 ĐÃ tự đóng kết nối rảnh lúc gọi; thứ còn giữ tiến trình là kết nối keep-alive ĐANG BẬN lúc SIGTERM, xong việc
 * thì rảnh và nằm chờ keepAliveTimeout 5 s: đo thật 8482 ms; gọi closeIdleConnections() một lần ngay sau close() như web khuyên KHÔNG đổi gì (đo riêng 8543 ms),
 * gọi lặp mỗi 100 ms ⇒ 2541 ms. Video + slide theo số thật.
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-05-5', code: 'NODE 5.5', title: 'Assembling the Notes API', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100");
const srv = (ten, a, b) => ra(ten, a, b, 'server');
const CAY = `src/
├── index.mjs                 ← starts the server, handles signals
├── app.mjs                   ← builds the Express app (does NOT listen)
├── routes/
│   └── notes.routes.mjs      ← HTTP: paths, status codes, input checks
├── services/
│   └── notes.service.mjs     ← business rules, knows nothing of HTTP
└── middleware/
    ├── errors.mjs            ← AppError, notFound, errorHandler
    └── logger.mjs            ← one log line per request`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Express', bai: '5.5' }, [
  /* ───── 5.5a ───── */
  { cover: true, t: 'Assembling<br>the Notes API', sub: 'Everything in this chapter, in one application that runs. Chapter 7 swaps its storage by editing one file.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A folder layout where every file has <b>one job</b></li>
<li>The single rule that keeps it honest: <b>services never touch req or res</b></li>
<li><code class="i">app.mjs</code>: the assembly, in the right order, and why it does not listen</li>
<li>A router that speaks only HTTP</li>
<li>Part 2: run it all with curl, and stop the server <b>without dropping requests</b></li>
</ul>
${box('The project', 'This is the Notes API introduced in lesson 0.4. It keeps notes in memory for now.', 'lam')}
${box('Real', 'Six files, run with Express 5.3 on Node 22 and called with curl. Nothing on these slides is typed by hand.', 'xanh')}` },

  { t: 'Picture a small restaurant', to: true, giua: true, body: cards([
    ['🔑 The manager', 'Opens the doors in the morning, closes them at night without throwing guests out. <b>= index.mjs</b>'],
    ['🗺️ The floor plan', 'Where each station stands, in which order guests pass them. <b>= app.mjs</b>'],
    ['🧑‍🍳 The waiter', 'Speaks to guests, takes orders, brings plates. <b>= routes</b>'],
    ['🍳 The kitchen', 'Cooks. Never talks to guests, never sees the dining room. <b>= services</b>'],
  ], 2) + box('Why it works', 'You can replace the kitchen (in-memory → PostgreSQL) and the waiter does not notice.', 'xanh') + box('And the reverse', 'A kitchen that walks into the dining room to take orders itself is a kitchen you cannot move.', 'do2') },

  { t: 'The folder layout', giua: true, body: js(CAY, { sm: false }) + cards([
    ['index.mjs', 'the process: port, signals, shutdown'],
    ['app.mjs', 'assembly: middleware order, router mounts'],
    ['routes/', 'translate HTTP: read params, choose status'],
    ['services/', 'the real rules: no req, no res'],
  ], 4) },

  { t: 'One rule keeps it honest', giua: true, body: js(ma('c5notes/notes.service', 1, 15), { sm: true, hl: [1, 6] }) + `<div class="nho">Lines 1–15 of 31: create, update and remove follow the same style.</div>` +
    box('Never req or res', 'Needs a user id? It takes a <code class="i">userId</code> parameter, never <code class="i">req.user</code>. So a route, a background job (ch. 13) or a test (ch. 14) can call it.', 'do2') },

  { t: 'app.mjs: the assembly, in order', giua: true, body: js(ma('c5notes/app'), { sm: true, hl: [8, 9, 10, 15, 16] }) +
    box('Read the order', 'No x-powered-by · logger FIRST (or broken JSON gets no log line, 5.3) · body parser · routes · 404 · error handler last (5.4).', 'lam') },

  { t: 'Why createApp() does not listen', to: true, giua: true, body: vsd(`<div style="font-size:24px">A file that calls <code class="i">app.listen()</code> the moment you import it:<br>• a test must start a real server<br>• a port must be free<br>• someone must close it afterwards</div>`,
    `<div style="font-size:24px"><code class="i">createApp()</code> only <b>builds and returns</b> the app:<br>• a test calls it with no port, no socket (chapter 14)<br>• you can build two apps in one process<br>• <code class="i">index.mjs</code> decides when to listen</div>`, '✗ listen on import', '✓ build, return, listen elsewhere') +
    js(ma('c5notes/index', 1, 4), { sm: false }) },

  { t: 'The router: only HTTP', giua: true, body: js(ma('c5notes/notes.routes', 5, 27), { sm: true, hl: [13, 19, 20, 22] }) },

  { t: 'PATCH and DELETE complete the set', giua: true, body: js(ma('c5notes/notes.routes', 29, 42), { sm: true, hl: [6, 7, 12, 13] }) + cards([
    ['No try/catch', 'A thrown AppError reaches the error handler (5.4).'],
    ['No JSON parsing', 'express.json() already did it.'],
    ['No 404 page', 'notFound handles it.'],
    ['What is left', 'Which status, which check, which service.'],
  ], 4) },

  { t: 'Exercise: which file does this belong in?', to: true, giua: true, body: two(`<ol style="font-size:26px">
<li><code class="i">if (!title) throw new AppError(422, ...)</code></li>
<li>filter notes whose title contains <code class="i">q</code></li>
<li><code class="i">res.status(201).location(...)</code></li>
<li><code class="i">process.on('SIGTERM', ...)</code></li>
<li><code class="i">app.use(notFound)</code></li></ol>`,
    `<div data-k="dapan">${bang(['', 'File', 'Why'], [
      ['1', 'routes', 'checking HTTP input'],
      ['2', 'services', 'a business rule'],
      ['3', 'routes', 'an HTTP status + header'],
      ['4', 'index.mjs', 'the process itself'],
      ['5', 'app.mjs', 'assembly order'],
    ], { co: 21 })}</div>`) + box('Test for "services"', 'Could a background job or a test call it without any request? Then it is a service.', 'lam') },

  { t: 'Part 1: summary', to: true, giua: true, body: flow([
    { t: 'index.mjs', s: 'process', mau: DO },
    { t: 'app.mjs', s: 'assembly, order', mau: CAM },
    { t: 'routes/', s: 'HTTP only', mau: LAM },
    { t: 'services/', s: 'rules, no req/res', mau: NODE },
  ], { h: 170, fs: 24 }) + `<ul><li>Logger first, then the body parser, routes, 404, errors</li><li><code class="i">createApp()</code> returns the app; index.mjs listens</li><li>Routers have no try/catch, no parsing, no 404 page</li></ul>` + box('Part 2', 'Run every endpoint with curl, read the log, then stop the server without dropping a request.', 'lam') },

  /* ───── 5.5b ───── */
  { t: 'Run it: create a note', giua: true, body: term(gay(ngan(ra('c5notes/index', 1, 7)), 96), { title: 'curl -i · real (Date/ETag lines filtered by grep)', hl: [3, 4, 9] }) + two(
    box('201 Created + Location', 'The header points at the new resource: that is what "created" means in HTTP. Chapter 6 makes it a habit.', 'xanh'),
    box('createdAt', 'An ISO date string: what <code class="i">res.json</code> does to a Date.', 'lam')) + box('Log line for this request', '<code class="i">' + srv('c5notes/index', 3, 3) + '</code>, written by our logger on <code class="i">finish</code>.', '') },

  { t: 'Run it: validate, list, search', giua: true, body: term(gay(ngan(ra('c5notes/index', 8, 15)).replace(/ -H 'Content-Type: application\/json'/g, " -H 'Content-Type: …json'"), 104), { title: 'curl · real (header shortened in the commands)', hl: [2, 4, 6, 7, 8] }) + two(
    box('422 for a missing title', 'The router checked the input and threw an AppError: one line.', 'lam'),
    box('page, limit, total', 'The list answers how much exists, not only what fits on this page.', 'xanh')) },

  { t: 'Run it: read, update, delete, errors', giua: true, body: term(gay(ngan(ra('c5notes/index', 16, 27)).replace(/ -H 'Content-Type: application\/json'/g, " -H 'Content-Type: …json'"), 104), { title: 'curl · real (header shortened in the commands)', hl: [2, 4, 6, 8, 10, 12] }) + box('Same shape for every error', '404 NOTE_NOT_FOUND, 404 NOT_FOUND, 400 INVALID_JSON: one <code class="i">{ error: { code, message } }</code>.', 'xanh') },

  { t: 'Read the log column', to: true, giua: true, body: two(term(srv('c5notes/index', 1, 13), { title: 'server log · real', hl: [4, 7, 10, 11] }), cot(
    box('201 · 201 · 422 · 200 · 200 · 404 · 200 · 204 · 404 · 400 · 200', 'Every status chosen on purpose.', 'lam'),
    box('Fast, in memory', `The first request is the slowest (${srv('c5notes/index', 3, 3).split(' ').pop()}: the code is still warming up). The rest stay under 2 ms. No database yet.`, ''),
    box('One error shape', 'Every error is <code class="i">{ error: { code, message } }</code>: the frontend writes ONE catch and ONE loading state.', 'xanh'))) + box('Look at the 400', 'Broken JSON is in the log because the logger runs BEFORE express.json.', 'lam') },

  { t: 'Stopping a server is part of every deploy', to: true, giua: true, body: flow([
    { t: 'Deploy', s: 'new version ready', mau: LAM },
    { t: 'SIGTERM', s: 'to the old process', mau: CAM },
    { t: '~10 s', s: 'Docker waits', mau: CAM },
    { t: 'SIGKILL', s: 'dead, no questions', mau: DO },
  ], { h: 170, fs: 24 }) + box('If you stop it the wrong way', 'Requests in flight die with it: a spinner that never stops, or worse, a payment that never gets its answer.', 'do2') + box('signal', 'a message the operating system sends a process: SIGTERM = "please stop", SIGKILL = "stop now", SIGINT = Ctrl+C.', 'lam') },

  { t: 'No handler: the request dies', giua: true, body: js(ma('c5/shutdown-none'), { sm: true, hl: [10] }) + two(term(gay(ngan(ra('c5/shutdown-none')), 50), { title: 'client · real', hl: [3, 4] }), term(srv('c5/shutdown-none'), { title: 'server · real', hl: [4] })) +
    box('Node\'s default', 'SIGTERM with no handler = exit at once. The 3-second request was cut in the middle: "Empty reply from server".', 'do2') },

  { t: 'With a handler: drain, then exit', giua: true, body: js(ma('c5/shutdown', 10, 21), { sm: true, hl: [5, 9] }) + two(
    term(gay(ngan(ra('c5/shutdown')), 48), { title: 'client · real', hl: [4, 5] }),
    term(srv('c5/shutdown', 2, 7), { title: 'server · real', hl: [3, 5, 6] })) },

  { t: 'A browser-like client', giua: true, body: js(ma('c5/ka.client'), { sm: true, hl: [3, 9] }) + two(
    box('keepAlive: true', 'After the response, the connection stays open for the next request: what every browser does.', 'lam'),
    box('Ten seconds', 'Like an open tab, the client process stays around. Now send SIGTERM to the server half a second in.', '')) + box('Same /slow server', 'The handler version from the previous slide: close() on SIGTERM, a 10-second ceiling. Only the client changed.', 'xanh') },

  { t: 'The keep-alive trap, measured on Node 22', giua: true, body: term(ra('c5/shutdown-ka', 2, 2), { title: 'client (ka-client.mjs) · real' }) + two(
    term(srv('c5/shutdown-ka', 2, 7), { title: 'server, plain close() · real', hl: [5] }),
    term(srv('c5/shutdown-ka-fix', 2, 7), { title: 'server + closeIdleConnections loop · real', hl: [5] })) +
    box('What holds it', 'Node 19+ close() already drops connections idle AT THAT MOMENT. This one was busy, then sat idle for the 5-second keep-alive timeout: 8482 ms. Closing idle connections every 100 ms: 2541 ms.', 'lam') },

  { t: 'The fix, and the hard ceiling', to: true, giua: true, body: js(ma('c5/shutdown-ka-fix', 11, 22), { sm: true, hl: [8, 9] }) + two(
    box('closeIdleConnections() in a loop', 'Calling it once right after close() changes nothing here (measured: 8543 ms): the connection is still busy then.', 'xanh'),
    box('.unref() on both timers', 'They must not keep the process alive themselves. The 10 s ceiling catches a leaked connection.', 'lam')) },

  { t: 'What this app is still missing', to: true, giua: true, body: cards([
    ['🗄️ Data vanishes on restart', 'It is a Map in RAM. Chapter 7 swaps the service for PostgreSQL + Prisma: the router does not change.'],
    ['✍️ Hand-written validation', 'Chapter 6 brings schema validation: rules declared once, consistent errors.'],
    ['👀 Everyone sees every note', 'Chapter 8 adds users, JWT and ownership checks.'],
    ['🧪 No tests yet', 'Chapter 14 tests createApp() without opening a port: exactly why it is a function.'],
  ], 2) + flow([{ t: 'Ch 5', s: 'in-memory API', mau: NODE }, { t: 'Ch 6', s: 'REST design + validation', mau: LAM }, { t: 'Ch 7', s: 'PostgreSQL', mau: LAM }, { t: 'Ch 8', s: 'users + JWT', mau: CAM }, { t: 'Ch 14', s: 'tests', mau: DO }], { h: 130, fs: 20 }) },

  { t: 'This website has the same skeleton', to: true, giua: true, body: flow([
    { t: 'index', s: 'port, signals', mau: DO }, { t: 'app', s: 'middleware order', mau: CAM }, { t: 'routes', s: 'speak HTTP', mau: LAM }, { t: 'services', s: 'speak business', mau: NODE }, { t: 'middleware', s: 'errors, logs, auth', mau: CAM },
  ], { h: 160, fs: 21 }) + box('Where it hurts', 'The files that later became painful to test or to reuse from a background job are exactly the ones where the line blurred: a service reaching for <code class="i">req.user</code>, a route running a query itself.', 'do2') + box('Habit', 'Before writing a line, ask: is this HTTP, or is this business?', 'xanh') },

  { t: 'Exercise: SIGTERM in the middle of /slow', to: true, giua: true, body: two(`<div style="font-size:28px">/slow takes 3 seconds. Half a second in, the server gets SIGTERM.<ol><li>Without a handler, what does the client see?</li><li>With the handler, what happens to a NEW request sent right after SIGTERM?</li></ol></div>`,
    `<div data-k="dapan">${term(gay(ra('c5/shutdown-none', 2, 3), 40), { title: '1 · no handler · real' })}${term(gay(ra('c5/shutdown', 2, 3), 40), { title: '2 · with handler · real' })}</div>`) +
    `<div data-k="dapan">${box('Why', '1. The process died mid-request. 2. close() refuses new connections, while /slow still finishes with 200.', 'xanh')}</div>` },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why must a service never read <code class="i">req.user</code>?</li>
<li>server.close() was called but the process stays alive for ~5 more seconds. Why?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. So jobs and tests can call it without a request. &nbsp; 2. A keep-alive connection that was busy became idle and waits for the keep-alive timeout: close idle connections in a loop.', 'xanh')}</div>
<ul>
<li>index / app / routes / services / middleware: one job each</li>
<li>One error shape, statuses chosen on purpose, logs for every request</li>
<li>Handle SIGTERM: close, drain, ceiling, exit</li>
</ul>
${box('Next', 'Chapter 6: designing a REST API that other people enjoy using.', 'lam')}` },
]);
