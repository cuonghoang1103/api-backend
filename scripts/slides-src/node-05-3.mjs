/**
 * node-05-3 — Node.js · Chapter 5 · Lesson 5.3 "Middleware: the chain every request walks" — PHẦN A (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s05-express.mjs › nodejs-5-3-middleware. Mã + output THẬT Node 22.23.3 + Express 5 (src/khung/node/that/c5).
 * Deck này mới có phần của tập mẫu node-5-3 (định nghĩa → dây chuyền → express.json → body limit). Phần còn lại (static, logger, scoped guard, hanging request) ⇒ deck bổ sung ở đợt slide.
 * ĐỢT 3 (01/11/2026): thêm PHẦN B = slide 15–28 cho tập node-5-3-2 (express.static + ETag 304 + Range 206, logger đo thời gian + logger sai chỗ, req.originalUrl,
 * requireAdmin theo phạm vi, cú treo curl -m 3 exit 28, chồng middleware của website, Filter PRJ301 ≈ middleware, bài tập thứ tự logger ↔ express.json).
 * Output THẬT Express 5.3.0 cổng 4100: that/c5/{static,logger,logger-wrong,guard,hang,logger-order}. Đồng thời lấp đầy 7 slide phần A bị phép kiểm tự động
 * báo trống (< 70 %): chỉ THÊM khối ở cuối slide, tên phần tử cũ (o#…, pl#…, ln#…, li#…) giữ nguyên thứ tự ⇒ cảnh của node-5-3 không đổi mốc.
 */
import { lamDeck, two, box, kw, c, flow, cards, bang, vsd, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-05-3', code: 'NODE 5.3', title: 'Middleware: the chain every request walks', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100");
const srv = (ten, a, b) => ra(ten, a, b, 'server');
const hang = (ma1, phu) => `<div data-k="hang" style="display:flex;justify-content:space-between;gap:14px;align-items:center;border:2px solid #cfe0d4;border-radius:9px;padding:6px 12px;background:#fbfefc"><code style="font-family:Menlo,monospace;font-size:20px;color:#14532d;font-weight:700;white-space:nowrap">${ma1}</code><span style="font-size:19px;color:#555;text-align:right">${phu}</span></div>`;

export const slides = lamDeck({ chuong: 'Chapter 5 — Express', bai: '5.3' }, [
  { cover: true, t: 'Middleware:<br>the chain every request walks', sub: 'The one idea in Express worth understanding fully.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>What middleware is, in one line</li>
<li>The <b>three valid endings</b>, and the one that hangs a request</li>
<li>Why <b>the order in the file</b> is the whole rule</li>
<li>Why <code class="i">req.body</code> is undefined, and the three causes</li>
<li>What a broken JSON body leaks from your server</li>
</ul>
${box('Why it matters', 'Everything in Express is middleware: parsing, auth, logging, even your route handlers.', 'xanh')}
${box('Part 2 (next video)', 'express.static, a timing logger, scoped guards, and the request that hangs forever.', 'lam')}` },

  { t: 'Picture airport security', to: true, giua: true, body: `${flow([
    { t: 'Check-in', s: 'everyone', mau: CAM },
    { t: 'Security', s: 'everyone', mau: NODE },
    { t: 'Passport', s: 'international only', mau: LAM },
    { t: 'Your gate', s: 'your flight only', mau: DO },
  ], { h: 170, fs: 23 })}
<ul>
<li>Every passenger walks the <b>same line, in the same order</b></li>
<li>Each station can <b>let you pass</b> or <b>stop you there</b></li>
<li>Some stations apply only to <b>some passengers</b></li>
</ul>
${box('Mapping', 'Passenger = request. Station = middleware. Letting you pass = <code class="i">next()</code>.', 'xanh')}` },

  { t: 'The definition, in one line', to: true, giua: true, body: `${js(`function middleware(req, res, next) { /* ... */ }`)}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
${box('1 · Call next()', '"I am done, go on down the chain." The most common ending.', 'xanh')}
${box('2 · Send a response', '<code class="i">res.json(...)</code> The chain STOPS here.', 'lam')}
${box('3 · Call next(err)', 'Jump straight to the error handler (Lesson 5.4).', '')}
${box('✗ Do none of them', 'The request <b>hangs</b> until the client gives up. No error, no log.', 'do2')}
</div>
<div style="display:flex;gap:12px">${kw('req', 'the request')} ${kw('res', 'the response')} ${kw('next', 'go to the next function')}</div>` },

  { t: 'The chain is the order in your file', to: true, giua: true, body: `<div style="display:flex;flex-direction:column;gap:7px">
${hang("app.use(logger)", 'global: every request')}
${hang("app.use(express.json())", 'global: fills in req.body')}
${hang("app.use('/api', mw)", 'path: only under /api')}
${hang("app.get('/api/notes', mw, handler)", 'route: only this route')}
${hang("app.use(notFound)", 'only if nobody answered above')}
${hang("app.use(errorHandler)", '4 arguments: reached by next(err)')}
</div>
${box('', 'This is not an illustration. It is the real order of execution, top to bottom.', 'xanh')}` },

  { t: 'A chain with a log at every step', to: true, giua: true, body: js(ma('c5/chain', 4, 15), { sm: false }) + box('How to read it', 'Each step prints one line, then calls <code class="i">next()</code>. Step 4 answers and stops the chain. X sits <b>below</b> the /api/notes route.', 'lam') },

  { t: 'Request 1: GET /api/notes', to: true, giua: true, body: two(term(ra('c5/chain', 1, 2), { title: 'curl' }) + box('Response', 'Step 4 sent a response and did not call <code class="i">next()</code>, so the chain stopped.', 'xanh'), term(ra('c5/chain', 2, 5, 'server'), { title: 'server log' }) + box('X never printed', '"X. after the routes" sits below the route that answered.', 'do2')) + flow([
    { t: '1. global', s: 'ran', mau: NODE }, { t: '2. /api', s: 'ran', mau: NODE }, { t: '3. route mw', s: 'ran', mau: NODE }, { t: '4. handler', s: 'answered', mau: CAM }, { t: 'X', s: 'never reached', mau: DO }], { h: 130, fs: 22 }) },

  { t: 'Request 2: GET /notes/new', to: true, giua: true, body: two(term(ra('c5/chain', 3, 4), { title: 'curl' }) + box('Lesson 1', 'Step 2 did not run: this path is not under <code class="i">/api</code>.', 'lam'), term(ra('c5/chain', 6, 7, 'server'), { title: 'server log' }) + box('Lesson 2', 'X <b>did</b> run: it sits above <code class="i">/notes/new</code> and nobody had answered yet.', 'xanh')) + box('Rule', '"After the routes" is only true for the routes written above it. <b>Position in the file is the whole rule.</b>', '') + flow([
    { t: '1. global', s: 'ran', mau: NODE }, { t: '2. /api', s: 'skipped', mau: LAM }, { t: '3 + 4', s: 'no route match', mau: LAM }, { t: 'X', s: 'ran', mau: NODE }, { t: '/notes/new', s: 'answered', mau: CAM }], { h: 130, fs: 22 }) },

  { t: 'express.json(): before and after', body: `${js(ma('c5/body', 4, 15), { sm: true })}
${term(ra('c5/body', 1, 4), { sm: true, title: 'curl', hl: [2, 4] })}` },

  { t: 'Why is req.body undefined?', giua: true, body: `${box('Three causes, always one of these', '1. You forgot <code class="i">express.json()</code> &nbsp; 2. The route is registered above it &nbsp; 3. The client did not send <code class="i">Content-Type: application/json</code>', '')}
${term(ra('c5/body', 6, 6), { title: 'cause 3: curl with Content-Type: text/plain' })}
${js(`const { title } = req.body;        // Express 5: TypeError if body is undefined
const { title } = req.body ?? {};  // safe in handlers that must not crash`, { sm: false })}
${term(`500 Internal Server Error\nTypeError: Cannot destructure property 'title' of 'req.body' as it is undefined.`, { sm: true, title: 'real result without the parser (abridged)' })}` },

  { t: 'Broken JSON leaks your server', to: true, giua: true, body: two(term(`HTTP/1.1 400 Bad Request\nSyntaxError: Expected property name or '}'\n  in JSON at position 1 (line 1 column 2)\n    at JSON.parse (<anonymous>)\n    at parse (/Users/admin/.../node_modules/\n      body-parser/lib/types/json.js:93:21)`, { title: 'NODE_ENV not set (abridged)', hl: [5] }) + box('Leaked', 'Absolute paths on the server disk and the internal call stack.', 'do2'), term(`HTTP/1.1 400 Bad Request\n<pre>Bad Request</pre>`, { title: 'NODE_ENV=production' }) + box('Fix both ways', 'Set <code class="i">NODE_ENV=production</code>, and write your own error handler (Lesson 5.4).', 'xanh')) + box('Who sees this?', 'Anyone who can send one bad request: a curious user, a scanner, an attacker mapping your server.', 'do2') },

  { t: 'Always set a body limit', to: true, giua: true, body: `${js(`app.use(express.json({ limit: '100kb' }));        // always set a limit
app.use(express.urlencoded({ extended: true }));  // HTML forms`)}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
${box('Default: 100 kb', 'Enough for JSON. Keep it.', 'xanh')}
${box('Raising it to 50 mb', 'Every request may buffer 50 MB of your RAM <b>before</b> you know who sent it.', 'do2')}
</div>
${box('File uploads', 'Those go through a stream, not this parser. See Chapter 10.', 'lam')}
${box('Lesson 5.4 turns the limit error into JSON', 'Too large ⇒ <code class="i">413 PAYLOAD_TOO_LARGE</code>, in the same shape as every other error.', '')}` },

  { t: 'Exercise: predict the log', to: true, giua: true, body: two(`<div>Same server as before. A client calls:<br><br>${c('GET /api/other')}<br><br>Which steps print? What status does the client get?</div>`, `<div data-k="dapan">${term(ra('c5/chain', 8, 10, 'server'), { title: 'server log' })}${term(ra('c5/chain', 6, 6), { title: 'status code' })}</div>`) + box('Why', 'Step 1 and 2 match. No route matches, X runs, then Express answers 404 by itself.', 'xanh') + box('Try it yourself', 'Move the X line to the top of the file, predict again, then run it.', 'lam') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>A middleware neither calls <code class="i">next()</code> nor sends a response. What happens?</li>
<li>A route sits above <code class="i">express.json()</code>. What is <code class="i">req.body</code> there?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. The request hangs. &nbsp; 2. undefined.', 'xanh')}</div>
<ul>
<li>Middleware = <code class="i">(req, res, next)</code>; three valid endings</li>
<li>Order in the file is the order of execution</li>
<li>Parser first, limit always, <code class="i">NODE_ENV=production</code> on servers</li>
</ul>
${box('Next', 'Part 2: express.static, a timing logger, guards and the hanging request.', 'lam')}` },

  /* ───── PHẦN B (tập node-5-3-2), đợt 3 ───── */
  { t: 'Part 2: what you will get', to: true, giua: true, body: `
<ul>
<li><code class="i">express.static</code>: serve files with <b>ETag, 304 and byte ranges</b> for free</li>
<li>Write your own: a <b>logger that measures real time</b>, and the wrong way to write it</li>
<li><b>Scoped middleware</b>: the shape of every guard you will ever write</li>
<li><b>The hang</b>: no error, no log, no crash, and the request never ends</li>
<li>The real middleware stack of this website</li>
</ul>
${box('Recap of part 1', 'Middleware = <code class="i">(req, res, next)</code>, three valid endings, and the order in the file is the order of execution.', 'xanh')}` },

  { t: 'express.static: files without routes', giua: true, body: two(cot(js(ma('c5/static', 1, 6), { sm: true }), box('One line', 'Every file in <code class="i">public/</code> becomes a URL: <code class="i">public/hello.txt</code> → <code class="i">/hello.txt</code>.', 'lam'), box('All for free', 'Content-Type from the extension, Last-Modified, an ETag, byte ranges.', 'xanh')), term(gay(ngan(ra('c5/static', 1, 11)), 50), { title: 'curl -i · real headers', hl: [5, 6, 8, 9, 10] })) },

  { t: 'Conditional requests and byte ranges', to: true, giua: true, body: term(gay(ngan(ra('c5/static', 13, 18)), 90), { title: 'curl · real', hl: [2, 4, 6] }) + cards([
    ['304 · 0 bytes', 'Sent back the ETag it gave: "you already have it". Not one byte of body crosses the wire.'],
    ['206 · "Hello"', 'Asked for bytes 0 to 4 only. This is how videos seek and downloads resume.'],
    ['404 · missing file', 'static calls next(): the request goes on down the chain to your 404.'],
  ], 3) + box('Lesson 3.5', 'Your hand-written server had none of this machinery.', 'lam') },

  { t: 'Write your own: a timing logger', giua: true, body: js(ma('c5/logger', 4, 11), { hl: [3, 7], sm: true }) + two(cot(
    box("next() now, measure on 'finish'", 'The middleware never blocks the chain; the response fires finish when it is really sent (lesson 3.4).', 'xanh'),
    box('originalUrl, not url', 'Inside a router, <code class="i">req.url</code> is "/42". Logs need the full path.', '')),
    term(srv('c5/logger', 2, 5), { title: 'server log · real', hl: [1] })) },

  { t: 'The wrong logger: log after next() returns', giua: true, body: js(ma('c5/logger-wrong', 4, 10), { sm: true, hl: [3, 4, 5, 6] }) + two(term(gay(ngan(ra('c5/logger-wrong')), 44), { title: 'client · real', hl: [3] }), term(srv('c5/logger-wrong', 2, 2), { title: 'server log · real', hl: [1] })) +
    box('Read the two lines together', 'The client got <b>201</b> after the 40 ms database write. The log says <b>200, 0.1 ms, not sent yet</b>: next() does not wait for an async handler.', 'do2') },

  { t: 'Scoped middleware: the shape of every guard', giua: true, body: js(ma('c5/guard', 4, 10), { sm: true, hl: [5, 9] }) + two(term(gay(ngan(ra('c5/guard')), 50), { title: 'curl · real', hl: [2, 4, 6] }), cot(
    box('Only where you put it', '<code class="i">requireAdmin</code> is the second argument of ONE route. /public never sees it.', 'lam'),
    box('return res.status(403)', 'The lesson 5.1 rule, where it matters most: without return, a rejected request runs on into the handler.', 'do2'))) },

  { t: 'Every auth check in this course is this function', to: true, giua: true, body: `<div style="font-size:26px">Whatever the check is, the shape never changes:</div>` + flow([
    { t: 'Request', s: 'GET /admin/stats', mau: LAM },
    { t: 'Guard', s: 'check something', mau: CAM },
    { t: '403 + return', s: 'stop here', mau: DO },
    { t: 'next()', s: 'go on', mau: NODE },
    { t: 'Handler', s: 'only for allowed', mau: NODE },
  ], { h: 170, fs: 23 }) + bang(['Chapter', 'The check inside the guard'], [
    ['5.3 (now)', '<code class="i">req.headers[\'x-role\'] === \'admin\'</code> (a demo: anyone can send this header)'],
    ['8 · authentication', 'verify a JWT, put the user on <code class="i">req.user</code>'],
    ['8 · authorization', 'is <code class="i">req.user</code> allowed to touch this resource?'],
  ], { co: 21 }) },

  { t: 'The hang', giua: true, body: js(ma('c5/hang', 4, 9), { sm: true, hl: [1, 2, 3] }) + two(
    term(gay(ngan(ra('c5/hang')), 48), { title: 'curl · real', hl: [3, 4] }),
    term(srv('c5/hang', 2, 2), { title: 'server log · real' })) +
    box('Read it', 'The middleware ran, then did neither: no next(), no response. curl gave up after 3 seconds with exit code 28. The server is perfectly healthy: /ok still answers.', 'do2') },

  { t: 'Why the hang is so dangerous', to: true, giua: true, body: cards([
    ['🤫 No signal at all', 'No error, no log, no crash. Monitoring sees a healthy server.'],
    ['🔌 Connections stay open', 'Each hung request holds a socket. Enough of them drain the connection pool and take the whole API down.'],
    ['🔎 Where it hides', 'Most often: an async middleware with an early return that forgets BOTH res and next.'],
  ], 3) + vsd(js(`if (!user) return;      // ends with nothing!`, { sm: false }), js(`if (!user) return next(new AppError(401, ...));`, { sm: false })) +
    box('Debug rule', 'One endpoint "hangs forever" while everything else works? Look for the middleware branch that ends without res or next.', 'xanh') },

  { t: 'The middleware stack of this website', giua: true, body: two(term(gay(ra('c5/website-stack').replace(' — cho phép Next.js frontend gọi API', ''), 46), { title: 'cuongthai.com · src/index.ts · 01/11/2026', sm: true, hl: [4, 5, 6, 7, 9, 11, 12, 17, 19] }), cot(
    box('Read it top to bottom', 'Request id → headers → CORS → body → logging → rate limit → routes → 404 → errors: the order of execution.', 'lam'),
    box('Auth is per router', 'Each router adds <code class="i">authenticate</code> / <code class="i">requireAdmin</code> where it needs them: scoped middleware.', 'xanh'),
    box('Decode vs require', 'Decoding a token is split from requiring one: one endpoint serves guests and members.', ''))) },

  { t: 'Same idea elsewhere: the Servlet Filter (PRJ301)', to: true, giua: true, body: bang(['', 'Java Servlet Filter', 'Express middleware'], [
    ['Signature', '<code class="i">doFilter(req, res, chain)</code>', '<code class="i">(req, res, next)</code>'],
    ['Go on', '<code class="i">chain.doFilter(req, res)</code>', '<code class="i">next()</code>'],
    ['Stop here', 'write the response, do not call the chain', 'send a response, do not call next'],
    ['Order', 'filter mapping order', 'order of app.use in the file'],
  ], { co: 22 }) + box('One idea, two platforms', 'If you learned Filters in PRJ301, you already know middleware. Here we go further: measuring time, scoped guards, the hang.', 'lam') + box('Same family', 'Spring has interceptors, ASP.NET has middleware, Django has middleware: a chain in front of the handler, every time.', 'xanh') },

  { t: 'Exercise: logger before or after express.json?', giua: true, body: js(ma('c5/logger-order', 3, 10), { sm: true }) + two(`<div style="font-size:24px">Both paths receive a valid body, then a broken one (<code class="i">{broken</code>).<br><b>Which logger writes a line for the broken request?</b></div>`,
    `<div data-k="dapan">${term(srv('c5/logger-order', 2, 4), { title: 'server log · real', hl: [3] })}${box('Why', 'express.json() fails first and jumps to the error handler: a logger placed after it never runs.', 'xanh')}</div>`) },

  { t: 'Part 2: check yourself + summary', giua: true, body: `
<ol>
<li>Why does a correct logger call <code class="i">next()</code> first and log on <code class="i">'finish'</code>?</li>
<li>A request hangs, no error anywhere. What do you look for?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. next() does not wait for async handlers; finish fires when the response is really sent. &nbsp; 2. A middleware branch that neither calls next() nor sends a response.', 'xanh')}</div>
<ul>
<li>express.static: ETag, 304 and 206 for free</li>
<li>Logger: next() now, measure on finish, log originalUrl, place it first</li>
<li>Guards are scoped middleware with <code class="i">return</code>; the hang = neither res nor next</li>
</ul>
${box('Next', 'Lesson 5.4: centralised error handling.', 'lam')}` },
]);
