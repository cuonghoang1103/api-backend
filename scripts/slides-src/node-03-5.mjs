/**
 * node-03-5 — Node.js · Chapter 3 · Lesson 3.5 "An HTTP server with no framework" (slide EN, kiểu FU, 31/10/2026).
 * Nguồn: content/courses/nodejs/s03-*.mjs › nodejs-3-5-http-server. Mã + output THẬT Node 22.23.3 (src/khung/node/that/c3), server cổng 4000 + curl thật.
 * Bổ sung so với bài web: request/response ở mức byte bằng nc (chạy thật), body JSON hỏng làm sập server (chạy thật), quên return ⇒ ERR_HTTP_HEADERS_SENT,
 * end hai lần ⇒ ERR_STREAM_WRITE_AFTER_END, quên end ⇒ curl chờ tới hết giờ (exit 28) — đều chạy thật; tải 50 MB bằng pipeline; bài tập /notes/:id tự cắt.
 */
import { lamDeck, two, box, kw, bang, steps, cards, flow, ma, ra, js, term, runJs, cot } from './_node-chung.mjs';

export const deck = { key: 'node-03-5', code: 'NODE 3.5', title: 'An HTTP server with no framework', sub: 'Node.js — from zero to production' };
const srv = (ten, a, b) => ra(ten, a, b, 'server');

export const slides = lamDeck({ chuong: 'Chapter 3 — Core Modules', bai: '3.5' }, [
  { cover: true, t: 'An HTTP server<br>with no framework', sub: 'Twenty minutes here teach you more about Express than a week of using it.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>A whole <b>REST API in ~30 lines</b>, only <code class="i">node:http</code></li>
<li>What a request and a response look like <b>as raw bytes</b></li>
<li>The <b>four pains</b> of raw http, and how Express removes each one</li>
<li>Streaming responses, and the rule: <b>end every response exactly once</b></li>
</ul>
${kw('framework', 'ready-made code that structures your app; Express (Chapter 5) is a thin one over node:http')}` },

  { t: 'The whole server (1/2): GET /notes', giua: true, body: two(js(ma('c3/http-server', 1, 12), { sm: true, hl: [6, 7, 9, 10, 11] }), cot(
    box('createServer', 'Your function runs for <b>every</b> request: <code class="i">req</code> is what came in, <code class="i">res</code> is what you send back.', 'lam'),
    box('Routing by hand', 'Parse the URL yourself, then one <code class="i">if</code> per method + path.', ''),
    box('Headers by hand', 'Status code, Content-Type, <code class="i">JSON.stringify</code>: nothing is set for you.', '')), 'r64') },

  { t: 'The whole server (2/2): POST, then 404', giua: true, body: two(js(ma('c3/http-server', 14, 30), { sm: true, hl: [2, 3, 4] }), cot(
    box('The body arrives in chunks', '<code class="i">req</code> is a <b>readable stream</b> (lesson 3.3): collect the <code class="i">data</code> events, then parse on <code class="i">end</code>.', 'lam'),
    box('Fallback', 'Anything else: 404 Not Found.', ''),
    box('Port 4000', 'The course uses 4000 (the web lesson uses 3123): any free port works.', '')), 'r64') },

  { t: 'Call it with curl', giua: true, body: two(term(ra('c3/http-server', 1, 18), { title: 'curl · real output', hl: [2, 11, 18] }), term(ra('c3/http-server', 19, 29), { title: 'curl · real output (cont.)', hl: [2, 4] })) + box('Read it', 'A working REST API: list, create, list again, and a 404, with zero packages installed.', 'xanh') },

  { t: 'Under the hood: raw bytes', giua: true, body: two(cot(js(ma('c3/http-raw'), { sm: true }), term(ra('c3/http-raw'), { title: 'nc · the raw response', hl: [2, 3, 6, 8, 9] })),
    bang(['Part', 'What it is'], [
      ['Request line', '<code class="i">GET /notes HTTP/1.1</code>: method, path, version'],
      ['Headers', '<code class="i">Name: value</code> lines, then one empty line'],
      ['Status line', '<code class="i">HTTP/1.1 200 OK</code>'],
      ['Chunked body', '<code class="i">10</code> = 16 bytes (hex), then the bytes, then <code class="i">0</code> = the end'],
    ], { co: 19 }), 'r46') },

  { t: 'Notice what hurt just now', to: true, giua: true, body: cards([
    ['🧩 Body comes in chunks', 'You glue the data events yourself: req is a stream.'],
    ['🛣️ Manual routing', 'One if per route. Ten endpoints with /notes/:id and it is unreadable.'],
    ['🕳️ No error safety net', 'A malformed JSON body throws inside a callback… and kills the process.'],
    ['🔁 Repetition everywhere', 'The same writeHead + JSON.stringify in every branch.'],
  ], 2) },

  { t: 'No safety net: one bad body, server gone', giua: true, body: two(term(ra('c3/bad-json'), { title: 'curl', hl: [3, 5] }), term(srv('c3/bad-json', 1, 8).split('\n').concat(['   …', srv('c3/bad-json').split('\n').slice(-1)[0]]).join('\n'), { title: 'server log', hl: [7, 10] }), 'r46') + box('Read it', 'One client sent <code class="i">{oops</code>. JSON.parse threw inside the <code class="i">end</code> callback, nobody caught it, the process exited, and the <b>next</b> client got nothing.', 'do2') },

  { t: 'Four pains = what Express gives you', to: true, giua: true, body: bang(['Pain with raw http', 'Express (Chapter 5)'], [
    ['Collect body chunks, parse JSON', '<code class="i">express.json()</code> body parser'],
    ['One if per route', 'A router with parameters: <code class="i">app.get(\'/notes/:id\')</code>'],
    ['A throw kills the process', 'An error-handling layer (Express 5 also catches async errors)'],
    ['writeHead + stringify everywhere', 'Helpers: <code class="i">res.status(201).json(note)</code>'],
  ], { co: 22 }) + box('So', 'Once you have felt these four, Express stops being magic: it is an obvious convenience over exactly this API.', 'xanh') },

  { t: 'Streaming a response', giua: true, body: `${runJs(ma('c3/download'), ra('c3/download'), { hl: [12], hlOut: [2] })}
${two(term(srv('c3/download'), { title: 'server log' }), box('res IS a writable stream', 'And req is a readable one. Once that clicks, upload, download and proxy are all the same idea.', 'xanh'))}` },

  { t: 'End every response exactly once', giua: true, body: `${bang(['Mistake', 'Real result (Node 22)'], [
    ['Forget <code class="i">res.end()</code>', `curl waits, then gives up: <code class="i">${ra('c3/no-end', 2, 2).replace('started...', 'started… ')}</code>`],
    ['Forget <code class="i">return</code> after answering', '<code class="i">ERR_HTTP_HEADERS_SENT</code>: process exits'],
    ['Call <code class="i">res.end()</code> twice', '<code class="i">ERR_STREAM_WRITE_AFTER_END</code>: process exits'],
  ], { co: 21, hl: [1] })}
${two(js(ma('c3/double-end', 3, 9), { sm: true, hl: [4, 6] }), term(srv('c3/double-end', 1, 7), { title: 'server log', hl: [7] }))}` },

  { t: 'Express is a thin layer over this', to: true, giua: true, body: `${flow([{ t: 'node:http', s: 'req, res', mau: '#475569' }, { t: 'Express', s: 'thin layer', mau: '#15803d' }, { t: 'your handler', s: 'still gets req, res', mau: '#2563eb' }], { w: 1100, h: 130 })}
${box('You can always drop down', 'Inside any Express handler you can use the raw <code class="i">req</code>/<code class="i">res</code> when the framework does not wrap what you need: this website does so to stream media with HTTP <b>Range</b> requests.', 'lam')}
${kw('Range request', 'the client asks for bytes 1000–1999 only: how video seeking works')}
${cards([['① read the header', '<code class="i">req.headers.range</code>: "bytes=1000-1999"'], ['② answer 206', '<code class="i">res.writeHead(206, { \'Content-Range\': … })</code>'], ['③ stream that slice', '<code class="i">createReadStream(file, { start, end })</code>']])}` },

  { t: 'What raw http makes you do yourself', to: true, giua: true, body: steps([
    '<b>Parse the URL yourself.</b> req.url is a string: routing, path parameters and query strings are all yours to cut out.',
    '<b>Collect the body from a stream.</b> Join the chunks, parse, and handle the case where it is not JSON.',
    '<b>Set every header and status.</b> Nothing is defaulted. Forget Content-Type and the browser guesses, often wrong.',
    '<b>Handle errors on every path.</b> An uncaught throw takes the process down: no framework is there to catch it.',
  ]) },

  { t: 'Exercise: add GET /notes/:id by hand', to: true, giua: true, body: two(`
<ul>
<li>Return the note with that <b>id</b> (200)</li>
<li>Unknown id: <b>404</b> <code class="i">Note not found</code></li>
<li>No router allowed: cut the id out of the path yourself</li>
</ul>
${box('Hint', 'A regular expression on <code class="i">url.pathname</code>, then <code class="i">Number(m[1])</code>.', '')}`, `<div data-k="dapan">${js(ma('c3/ex-route', 8, 14), { sm: true, hl: [3] })}${term(ra('c3/ex-route'), { title: 'curl · real output' })}</div>`, 'r46') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why do you need <code class="i">req.on('data')</code> to read a POST body?</li>
<li>A client sends invalid JSON to the raw server. What happens to the next client?</li>
<li>You forgot <code class="i">return</code> after <code class="i">res.end()</code>. What will you see?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. req is a readable stream: the body arrives in chunks. &nbsp; 2. Nothing: JSON.parse threw, the process died. &nbsp; 3. ERR_HTTP_HEADERS_SENT (or write after end), and the process exits.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><code class="i">node:http</code>: a REST API in ~30 lines, no packages</li>
<li><b>req</b> = readable stream, <b>res</b> = writable stream</li>
<li>Four pains: body, routing, errors, repetition = what Express fixes</li>
<li>End each response <b>exactly once</b>; return after answering</li>
</ul>
${box('Next', 'Chapter 4 — npm and keeping a project clean: lesson 4.1, package.json.', 'lam')}` },
]);
