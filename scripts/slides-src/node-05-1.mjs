/**
 * node-05-1 — Node.js · Chapter 5 · Lesson 5.1 "From raw http to Express" (slide EN, kiểu FU, đợt 3 — 01/11/2026). MỘT deck, HAI tập:
 *   5.1a (node-5-1)   = slide 1–12: bốn nỗi khổ · cài đặt · ứng dụng đầu tiên · res.json / res.send
 *   5.1b (node-5-1-2) = slide 13–21: 404 mặc định · đếm dòng · lỗi tuần đầu · Express gỡ gì theo từng nỗi đau
 * Nguồn: content/courses/nodejs/s05-express.mjs › nodejs-5-1-tu-http-toi-express. Output THẬT Node 22.23.3 + Express 5.3.0, server cổng 4100 (cổng 4000 đang bận
 * bởi phiên khác lúc quay), src/khung/node/that/c5/{install,first-app,send-types,double,count-lines} + c5/raw-notes.mjs + c5notes/*.
 * Khác bài web (theo số thật): Express 5.3.0 (web 5.2.1), 65 gói 3.8M (web 3.7M); đếm dòng trên mã của khoá (http 72 = 39 ống nước + 31 nghiệp vụ;
 * Express 37 + 15 + 20 + 8 = 80) thay cho 67/27/40 và 32/15/20/8 của web — cùng kết luận. Bổ sung: ETag ⇒ 304 chạy thật, res.status() một mình ⇒ curl chờ hết giờ,
 * fetch().json() trên text/html ⇒ SyntaxError thật, lỗi tuần đầu còn chạy "ghi CSDL" cho request đã bị từ chối (đếm thật).
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-05-1', code: 'NODE 5.1', title: 'From raw http to Express', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const bo = (t) => t.split('\n').filter((l) => !/fund|^$/.test(l)).join('\n');
const srv = (ten, a, b) => ra(ten, a, b, 'server');

export const slides = lamDeck({ chuong: 'Chapter 5 — Express', bai: '5.1' }, [
  /* ───── 5.1a ───── */
  { cover: true, t: 'From raw http<br>to Express', sub: 'Express is not magic. Everything it does, you could write yourself. That is exactly the point.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>four pains</b> of raw <code class="i">node:http</code>, one by one</li>
<li>Install Express and <b>count</b> what came with it</li>
<li>Your first Express app, and what it really sends <b>on the wire</b></li>
<li><code class="i">res.json</code> vs <code class="i">res.send</code>, and three look-alike methods</li>
<li>Part 2: the default 404, a fair line count, and the first-week bug</li>
</ul>
<div style="display:flex;gap:12px;flex-wrap:wrap">${kw('Express', 'a thin web framework over node:http')} ${kw('framework', 'ready-made structure your code plugs into')}</div>` },

  { t: 'Picture building a house', to: true, giua: true, body: cards([
    ['🧱 Raw http', 'Bricks and cement. You can build anything, but you mix the mortar yourself for every wall.'],
    ['🏗️ Express', 'A frame already standing: doors, pipes and wiring in standard places. You decide the rooms.'],
    ['🔧 Nothing hidden', 'The frame is made of the same bricks. You can always open a wall and see them.'],
  ], 3) + box('Mapping', 'Raw http = lesson 3.5. Express = the same server, with the repetitive parts written once and shared by millions of projects.', 'xanh') + box('Why not write it yourself?', 'You could. You would write it again, slightly differently and slightly wrong, in every project.', '') },

  { t: 'Recap: the four pains of lesson 3.5', giua: true, body: two(js(ma('c3/http-server', 6, 28), { sm: true, hl: [4, 10, 11, 12, 13, 21, 22] }), cot(
    box('1 · Routing by hand', 'A pile of <code class="i">if</code>. Path parameters? Cut strings yourself.', ''),
    box('2 · Reading the body', 'Chunks, JSON.parse, a size limit, in every route.', 'lam'),
    box('3 · Cross-cutting work', 'Logging, auth, CORS: no single place to write them.', ''),
    box('4 · Errors everywhere', 'One <code class="i">throw</code> kills the process.', 'do2')), 'r73') },

  { t: 'Install it, then count', to: true, giua: true, body: two(term(gay(bo(ra('c5/install')), 40), { title: 'npm i express · empty folder', hl: [2, 3, 6, 8, 10] }), cot(
    box('Express 5.3.0', 'The current default on npm.', 'xanh'),
    box('65 packages, 3.8 MB', 'Chapter 4 taught you to look at this number, not ignore it.', 'lam'),
    box('A fair trade', 'It is a real supply chain surface. It is also the whole HTTP layer of a production API, and the most reviewed code in the Node ecosystem.', ''))) },

  { t: 'Express 5 vs Express 4', to: true, giua: true, body: bang(['', 'Express 4', 'Express 5 (this course)'], [
    ['Error thrown in an <b>async</b> handler', 'never reaches the error handler', 'reaches it automatically (lesson 5.4)'],
    ['Wildcard route', "<code class=\"i\">'/files/*'</code>", "named: <code class=\"i\">'/files/*splat'</code> (lesson 5.2)"],
    ['Optional parameter', "<code class=\"i\">'/notes/:id?'</code>", 'removed: declare two routes'],
  ], { co: 22 }) + box('Old tutorial not working?', 'Most tutorials online are still Express 4. Before debugging anything else, check the version: <code class="i">npm ls express</code>.', 'do2') + box('Default today', 'npm installs Express 5 unless you ask for <code class="i">express@4</code>.', 'lam') },

  { t: 'Your first Express app', giua: true, body: two(js(ma('c5/first-app'), { hl: [5, 6, 9, 10, 13, 14, 17] }), cot(
    box('express()', 'Creates the app: the object you hang routes on.', 'lam'),
    box('app.get(path, handler)', 'Method + path + a function. No if, no URL parsing.', 'xanh'),
    box('res.json / res.send / res.status', 'Helpers that write headers and body for you.', ''),
    box('app.listen(4100)', 'Wraps <code class="i">http.createServer().listen()</code>: the same server as lesson 3.5.', 'lam')), 'r64') },

  { t: 'What nine lines really send', giua: true, body: two(term(ra('c5/first-app', 1, 11), { title: 'curl -i · real response, with headers', hl: [4, 5, 6, 11] }), cot(
    box('You wrote', '<code class="i">res.json({ status: \'ok\', uptime: 1.23 })</code>. One line.', 'xanh'),
    box('Express did', 'JSON.stringify · Content-Type · Content-Length 29 · an <b>ETag</b>.', 'lam'),
    box('X-Powered-By: Express', 'Free advertising of what you run. Lesson 5.5 switches it off.', 'do2'))) + box('Compare with lesson 3.5', 'There you wrote <code class="i">writeHead(200, {...})</code> and <code class="i">JSON.stringify</code> by hand in every branch, and never computed Content-Length.', 'lam') },

  { t: 'The ETag pays off: 304 with an empty body', to: true, giua: true, body: term(ra('c5/first-app', 34, 35), { title: 'ask again, sending back the ETag the server gave', hl: [2] }) + two(
    box('ETag', 'A fingerprint of the body. Same body, same ETag.', 'lam'),
    box('304 Not Modified', '"You already have it." No body travels: the browser reuses its copy.', 'xanh')) +
    box('Lesson 3.5 did 3 of these 4 by hand', 'stringify, Content-Type, Content-Length. The fourth, ETag and 304, it simply skipped.', '') + flow([
    { t: 'Request 1', s: '200 + body + ETag', mau: LAM }, { t: 'Browser keeps a copy', s: 'and the ETag', mau: CAM }, { t: 'Request 2', s: 'If-None-Match: ETag', mau: LAM }, { t: '304', s: '0 bytes of body', mau: NODE }], { h: 140, fs: 22 }) },

  { t: 'res.send guesses, res.json does not', giua: true, body: js(ma('c5/send-types', 4, 6)) + two(term(gay(ra('c5/send-types', 1, 6), 50), { title: 'Content-Type of each answer', hl: [3, 6, 9] }), cot(
    box('res.send(value)', 'Guesses from the type: string → <b>text/html</b>, object → JSON, Buffer → octet-stream.', ''),
    box('The trap', 'A frontend calling <code class="i">await r.json()</code> on text/html throws:', 'do2'),
    term(gay(ra('c5/send-types', 17, 17), 44), { title: 'real fetch().json() on /send-string' }))) + box('For an API', 'Use <code class="i">res.json()</code> everywhere and never think about it again.', 'xanh') },

  { t: 'Four look-alike methods', giua: true, body: two(bang(['Method', 'What it does'], [
    ['<code class="i">res.json(obj)</code>', 'always application/json; <code class="i">undefined</code> fields vanish, a Date becomes an ISO string'],
    ['<code class="i">res.status(n)</code>', 'sets the code, sends <b>nothing</b>: chain it, <code class="i">res.status(201).json(...)</code>'],
    ['<code class="i">res.sendStatus(n)</code>', 'sets the code <b>and</b> sends its text ("Created")'],
    ['<code class="i">res.end()</code>', 'ends with no body: the partner of 204 No Content'],
  ], { co: 20 }), term(gay(ra('c5/send-types', 7, 15).replace(/ localhost:4100/g, ' :4100'), 44), { title: 'real answers (localhost shortened)', hl: [2, 3, 6, 7, 10, 13] })) +
    box('Read the middle line', '<code class="i">res.status(201)</code> alone: the client waited 2 seconds and gave up with exit code 28. Nothing was ever sent.', 'do2') },

  { t: 'Part 1 in one picture', to: true, giua: true, body: flow([
    { t: 'npm i express', s: '65 packages, 5.3.0', mau: LAM },
    { t: 'app.get(path, fn)', s: 'no if, no URL parsing', mau: NODE },
    { t: 'res.json(obj)', s: 'headers + ETag for free', mau: CAM },
    { t: '304 / 201 / 204', s: 'the right status, on purpose', mau: DO },
  ], { h: 170, fs: 23 }) + box('Remember', 'Express removes repetition, not understanding. Everything on this slide maps to a line you wrote by hand in lesson 3.5.', 'xanh') + box('Part 2', 'What happens when no route matches, a fair line count, and the bug everyone writes in week one.', 'lam') },

  /* ───── 5.1b ───── */
  { t: 'When no route matches', giua: true, body: two(term(ra('c5/first-app', 36, 56), { title: 'curl -i /does-not-exist', hl: [2, 6, 19] }), cot(
    box('Express answers by itself', 'A 404 with a small <b>HTML</b> page: "Cannot GET /does-not-exist".', 'lam'),
    box('Wrong shape for an API', 'Your frontend waits for <code class="i">{ "error": ... }</code> JSON and receives HTML.', 'do2'),
    box('Design lesson', 'Express gives you a default, and every default can be replaced. Lesson 5.4 swaps this for a JSON 404.', 'xanh')), 'r64') },

  { t: 'Does it really save code? Count it', giua: true, body: two(term(ra('c5/count-lines'), { title: "the same Notes API twice · grep -cve '^\\s*$'", hl: [1, 2, 9] }), cot(
    box('Same features in both', 'List, read, create, update, delete, JSON parsing, a body limit, a JSON 404. Same answers, curl for curl.', 'lam'),
    box('Read it honestly', 'The totals are close: 72 vs 80. Express does not make the program shorter.', ''),
    box('What changes', 'WHICH lines you own: 39 lines of plumbing disappear. The 20 lines of error handling are shared by every future route.', 'xanh'))) },

  { t: 'A better yardstick: the eleventh route', to: true, giua: true, body: vsd(
    `<div style="font-size:23px">Add one more branch to the <code class="i">if</code> chain, which already juggles method, path cutting, body reading and error catching.<br><br>The plumbing <b>grows</b> with every route.</div>`,
    `<div style="font-size:23px">Three lines in a router file:</div>${js(`router.get('/:id/history', (req, res) => {
  res.json(service.history(Number(req.params.id)));
});`)}<div style="font-size:23px">Parsing, 404 and errors are already shared.</div>`,
    '✗ node:http', '✓ Express') + box('Judge a framework by this', 'Not "fewer lines today", but "what does the next feature cost?".', 'lam') + box('And the reader', 'A teammate opening routes/notes.routes.mjs sees only HTTP decisions: which status, which check, which service.', 'xanh') },

  { t: 'The bug everyone writes in week one', giua: true, body: js(ma('c5/double', 5, 10), { hl: [2], sm: true }) + two(
    term(gay(ra('c5/double', 1, 2), 48), { title: 'client, no token', hl: [3] }),
    term(srv('c5/double', 2, 3), { title: 'server log', hl: [1, 2] })) + box('Looks fine', 'The client got the right 401, so this bug can sleep for months.', '') +
    box('What really happened', 'No <code class="i">return</code>: the handler kept going, did the expensive write <b>for a rejected request</b>, then tried to send a second response. Node threw <b>ERR_HTTP_HEADERS_SENT</b>.', 'do2') },

  { t: 'The rule: return before every final res.*', to: true, giua: true, body: vsd(js(`if (!req.query.token)
  res.status(401).json({ error: 'No' });
dbWrites++;      // still runs!
res.json({ secret: 'private' });`, { sm: true }), js(`if (!req.query.token)
  return res.status(401).json({ error: 'No' });
dbWrites++;      // only real requests
res.json({ secret: 'private' });`, { sm: true })) + box('Rule', 'Every <code class="i">res.*</code> that ends the request gets a <code class="i">return</code> in front, unless it is the last statement of the function.', 'xanh') + box('Where it bites hardest', 'Auth guards (lesson 5.3). A missing return there lets a rejected request run on into the handler.', 'do2') },

  { t: 'Every API on this website has this shape', to: true, giua: true, body: `<div style="font-size:26px">Open the backend of cuongthai.com and you find the same five parts, in this order:</div>` + flow([
    { t: 'One app', s: 'express()', mau: LAM },
    { t: 'Middleware', s: 'security, logs, JSON', mau: CAM },
    { t: 'Routers', s: '/api/v1/...', mau: NODE },
    { t: 'JSON 404', s: 'nobody answered', mau: DO },
    { t: 'Error handler', s: 'last of all', mau: DO },
  ], { h: 170, fs: 22 }) + box('The rest of the course', 'Database, auth, uploads, realtime: each chapter adds a layer to this frame. None of them replaces it.', 'xanh') + box('You will build it', 'Lesson 5.5 assembles exactly this, as the Notes API.', 'lam') },

  { t: 'What Express removes, pain by pain', to: true, giua: true, body: cards([
    ['1 · Routing', "app.get('/notes/:id') instead of parsing req.url and branching. Parameters arrive already parsed."],
    ['2 · Body parsing', 'express.json() collects the stream, parses it, and answers 400 on bad JSON instead of crashing.'],
    ['3 · Middleware', 'One chain every request walks: auth, logging, rate limits become one line each.'],
    ['4 · Error handling', 'A four-argument handler catches what the chain throws. Async too, since Express 5.'],
  ], 2) + bang(['Pain', 'Express gives you', 'Lesson'], [
    ['Routing by hand', 'routes with <code class="i">:params</code> + <code class="i">Router()</code>', '5.2'],
    ['Reading the body', '<code class="i">express.json()</code>', '5.3'],
    ['Cross-cutting work', 'middleware', '5.3'],
    ['Errors everywhere', 'error handler', '5.4'],
  ], { co: 20 }) },

  { t: 'Exercise: same handler, with a token', to: true, giua: true, body: two(`<div style="font-size:28px">Same buggy <code class="i">/double</code> handler, but now the client sends <code class="i">?token=abc</code>.<ol><li>What does the client receive?</li><li>Does the bug show in the server log?</li></ol></div>`,
    `<div data-k="dapan">${term(ra('c5/double', 3, 4), { title: '1 · client' })}${term(srv('c5/double', 4, 4), { title: '2 · server log' })}</div>`) + `<div data-k="dapan">${box('Why', 'The if is skipped, so only one response is sent. The bug only appears on the rejected path: that is why it hides.', 'xanh')}</div>` },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Which header lets the client get a 304 with an empty body next time?</li>
<li>A guard sends 401 without <code class="i">return</code>. Name two bad things that follow.</li>
</ol>
<div data-k="dapan">${box('Answers', '1. ETag (sent back as If-None-Match). &nbsp; 2. The handler keeps running (expensive work for a rejected request) and a second response throws ERR_HTTP_HEADERS_SENT.', 'xanh')}</div>
<ul>
<li>Express = the same server as 3.5, repetition written once</li>
<li>res.json for APIs; res.status only sets; 304 and ETag come free</li>
<li>Return before every final res.*</li>
</ul>
${box('Next', 'Lesson 5.2: routing, params, query and Router.', 'lam')}` },
]);
