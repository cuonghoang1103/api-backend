/**
 * node-05-4 — Node.js · Chapter 5 · Lesson 5.4 "Centralised error handling" (slide EN, kiểu FU, đợt 3 — 01/11/2026). MỘT deck, HAI tập:
 *   5.4a (node-5-4)   = slide 1–16: handler 4 tham số (+ bẫy 3 tham số chạy thật) · ba đường A/B/C · Express 5 vs Express 4.22.3 (cùng tệp, chạy thật) ·
 *                       ném trong timer tự hẹn ⇒ sập (thật) + next(err) · AppError · bài tập 4 đường
 *   5.4b (node-5-4-2) = slide 17–26: handler đầy đủ (+ mã request cho 5xx) · 404 JSON + thứ tự (đặt nhầm trên đầu ⇒ mọi thứ 404, thật) ·
 *                       unhandledRejection / uncaughtException (thật, có và không có handler) · lỗi từ thư viện (400/413 thật) · bài tập thứ tự
 * Nguồn: s05-express.mjs › nodejs-5-4-xu-ly-loi. Output THẬT Node 22.23.3, Express 5.3.0 và Express 4.22.3 (scratchpad/node/may4), cổng 4100:
 * that/c5/{err-4args,err-3args,err-paths,e4-proof,timer-throw,timer-next,app-error,err-full,notfound-top,unhandled,unhandled-default} + c3/bad-json (đợt 2).
 * Khác web: Express 4.22.3 / 5.3.0 (web 4.22.2 / 5.2.1); kết quả trùng (Express 4: route async treo, curl exit 28, unhandledRejection).
 */
import { lamDeck, two, box, kw, bang, cards, flow, vsd, steps, ma, ra, js, term, cot } from './_node-chung.mjs';

export const deck = { key: 'node-05-4', code: 'NODE 5.4', title: 'Centralised error handling', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a';
const gay = (t, n = 56) => t.split('\n').flatMap((l) => { const o = []; let r = l; while (r.length > n) { let k = r.lastIndexOf(' ', n); if (k < 20) k = n; o.push(r.slice(0, k)); r = '  ' + r.slice(k).trimStart(); } o.push(r); return o; }).join('\n');
const ngan = (t) => t.replace(/ localhost:4100/g, ' :4100').replace(/'localhost:4100/g, "':4100");
const srv = (ten, a, b) => ra(ten, a, b, 'server');
const cat = (t, n = 64) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const goc = (t) => t.replaceAll('/Users/admin/Documents/video-bai-giang/scratchpad/node/may/', '').replaceAll('/private/tmp/notes-api-demo/', '');

/** Ba đường tới error handler (SVG). ban = 4 | 5: Express 4 làm gãy đường C. */
function baDuong(ban) {
  const w = 1110, h = 300;
  const lane = [['A', 'throw in sync code', 60], ['B', 'next(err)', 150], ['C', 'throw after await', 240]];
  let s = `<svg data-k="baduong" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="m5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>`;
  s += `<rect x="830" y="70" width="260" height="160" rx="16" fill="${NODE}18" stroke="${NODE}" stroke-width="3"/><text x="960" y="140" text-anchor="middle" font-size="26" font-weight="800" fill="${NODE}">error handler</text><text x="960" y="172" text-anchor="middle" font-size="19" fill="#444">one place, one shape</text>`;
  for (const [k, t, y] of lane) {
    const gay4 = ban === 4 && k === 'C';
    const mau = gay4 ? DO : k === 'B' ? LAM : CAM;
    s += `<circle cx="40" cy="${y}" r="24" fill="${mau}"/><text x="40" y="${y + 8}" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">${k}</text>`;
    s += `<text x="80" y="${y + 8}" font-size="24" font-weight="700" fill="#333">${t}</text>`;
    if (gay4) {
      s += `<line x1="330" y1="${y}" x2="560" y2="${y}" stroke="${DO}" stroke-width="4" stroke-dasharray="10 8"/><text x="575" y="${y + 8}" font-size="22" font-weight="800" fill="${DO}">✗ lost: unhandledRejection, client waits</text>`;
    } else {
      s += `<line x1="330" y1="${y}" x2="826" y2="${150 + (y - 150) * 0.45}" stroke="#555" stroke-width="3.5" marker-end="url(#m5)"/>`;
    }
  }
  return s + `<text x="${w - 10}" y="${h - 8}" text-anchor="end" font-size="20" font-weight="700" fill="${ban === 4 ? DO : NODE}">Express ${ban}</text></svg>`;
}

export const slides = lamDeck({ chuong: 'Chapter 5 — Express', bai: '5.4' }, [
  /* ───── 5.4a ───── */
  { cover: true, t: 'Centralised<br>error handling', sub: 'About twenty lines you write once, and never touch again.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>An error handler is just middleware with <b>four</b> parameters, and the trap with three</li>
<li>The <b>three roads</b> an error takes to it, and the one Express 4 loses</li>
<li>What Express 5 still cannot catch</li>
<li>An error class that carries its <b>HTTP status</b> and a stable <b>code</b></li>
<li>Part 2: the full handler, a JSON 404, and the errors that still kill a process</li>
</ul>
${box('Goal', 'One bad record must never take the whole server down again.', 'xanh')}
${box('Real outputs', 'Express 5.3.0 and, for comparison, Express 4.22.3, both on Node 22.', 'lam')}` },

  { t: 'Picture one emergency desk', to: true, giua: true, body: cards([
    ['🚑 Every incident goes to one desk', 'Wherever it happens in the building, it is brought to the same place.'],
    ['📋 One form for everything', 'Each case gets a code and a short message. Staff never guess the format.'],
    ['🏥 The building stays open', 'One patient in trouble does not close the hospital for everyone.'],
  ], 3) + box('Mapping', 'The desk = the error handler. The form = <code class="i">{ error: { code, message } }</code>. The building staying open = the process survives.', 'xanh') + box('Without the desk', 'Every room handles its own emergencies its own way, and some rooms simply set the building on fire.', 'do2') },

  { t: 'Remember lesson 3.5?', to: true, giua: true, body: two(term(gay(goc(ra('c3/bad-json', 1, 99, 'server')).split('\n').slice(0, 6).join('\n') + '\n...\n' + ra('c3/bad-json', 1, 99, 'server').split('\n').slice(-1)[0], 52), { title: 'raw http server log · real (lesson 3.5)', hl: [5, 8] }), cot(
    box('One client sent {oops', 'JSON.parse threw inside a callback, nobody caught it.', 'do2'),
    box('Everyone paid', 'The process exited. Every other user lost their connection.', 'do2'),
    box('This lesson', 'Makes that failure impossible, for good.', 'xanh'))) + box('Express already helps', 'A throw inside an Express handler does not kill the process: Express catches it. This lesson decides what the client receives.', 'lam') },

  { t: 'An error handler is middleware with four parameters', giua: true, body: two(js(ma('c5/err-4args', 4, 15), { sm: true, hl: [5, 9] }), cot(
    term(gay(ngan(ra('c5/err-4args')), 46), { title: 'curl -i · real', hl: [4, 5, 8] }),
    term(srv('c5/err-4args', 1, 1), { title: 'server log' }),
    box('How Express knows', 'It counts the declared parameters with <code class="i">fn.length</code>, at registration time. Four means "error handler".', 'lam'))) },

  { t: 'The trap: write three parameters', giua: true, body: js(ma('c5/err-3args', 8, 13), { sm: true, hl: [2] }) + two(term(srv('c5/err-3args', 1, 1), { title: 'server log' }), term(cat(ngan(ra('c5/err-3args', 2, 4) + '\n' + ra('c5/err-3args', 13, 13)), 50), { title: 'curl -i /boom · real (abridged)', hl: [1, 2, 4] })) +
    box('Silent', 'With three parameters your handler becomes a normal middleware and NEVER runs for errors. Express\'s default answers instead: an HTML page with your stack trace. No warning at startup.', 'do2') +
    box('First thing to check', 'Error "never reaches the handler"? Count the parameters.', 'xanh') },

  { t: 'Three roads to the error handler', to: true, giua: true, body: baDuong(5) + bang(['Road', 'How it happens'], [
    ['A', '<code class="i">throw</code> in synchronous code: Express catches it for you'],
    ['B', '<code class="i">next(err)</code>: explicit, works everywhere, in every version'],
    ['C', '<code class="i">throw</code> in async code, after an <code class="i">await</code>: Express 5 catches it, Express 4 does not'],
  ], { co: 21 }) },

  { t: 'Express 5: all three arrive', giua: true, body: js(ma('c5/err-paths', 4, 13), { sm: true, hl: [2, 5, 9] }) + two(term(gay(ngan(ra('c5/err-paths')), 50), { title: 'curl · Express 5.3.0 · real', hl: [2, 4, 6] }), term(srv('c5/err-paths', 2, 4), { title: 'server log · real' })) },

  { t: 'Same file, Express 4: road C is lost', giua: true, body: baDuong(4) + two(term(gay(ngan(ra('c5/e4-proof', 2, 8)), 50), { title: 'curl · Express 4.22.3 · real', hl: [6, 7] }), term(ra('c5/e4-proof', 10, 13), { title: 'server log · Express 4.22.3 · real', hl: [4] })) },

  { t: 'Why road C bites in real life', to: true, giua: true, body: cards([
    ['Every real route is async', 'You await the database. So in Express 4, every real route is on road C.'],
    ['The client waits forever', 'No response at all. The error shows up only as an unhandledRejection line, cut off from the request.'],
    ['"Our API sometimes hangs"', 'The number-one complaint in Express 4 code bases. Now you know the cause.'],
  ], 3) + js(`// the old Express 4 cure: wrap every async handler
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);`, { sm: false }) + box('Express 5', 'Catches a rejected promise returned by a handler. You will still meet <code class="i">wrap</code> in older code: now you know why it exists.', 'xanh') },

  { t: 'What Express 5 still cannot catch', giua: true, body: js(ma('c5/timer-throw', 4, 9), { sm: true, hl: [3] }) + two(term(gay(ngan(ra('c5/timer-throw')), 50), { title: 'curl · real', hl: [3, 6] }), term(cat(goc(srv('c5/timer-throw', 2, 9)), 50), { title: 'server log · real', hl: [6] })) +
    box('Why', 'When your own timer fires, the request\'s call stack is long gone. Nobody is there to catch the throw: the process dies, and so does every other request.', 'do2') },

  { t: 'The fix: lead it out with next(err)', to: true, giua: true, body: js(ma('c5/timer-next', 4, 12), { sm: true, hl: [3] }) + term(ngan(ra('c5/timer-next')), { title: 'curl · real', hl: [2, 4] }) +
    box('Rule', 'Must you fail inside a callback you scheduled yourself? Hand the error to <code class="i">next(err)</code>. The server keeps serving.', 'xanh') },

  { t: 'An error that carries its HTTP status', giua: true, body: two(js(ma('c5/app-error', 4, 18), { sm: true, hl: [4, 5, 10, 13] }), cot(
    term(gay(ra('c5/app-error', 2, 2) + '\n' + ra('c5/app-error', 4, 4), 30), { title: 'curl /app-error, /next-error · real' }),
    box('Plain Error vs AppError', 'A plain Error has only a message. AppError adds <b>status</b> and <b>code</b>.', 'xanh')), 'r73') + box('Throw it, or pass it', 'Inside a handler: <code class="i">throw new AppError(...)</code> (road A/C) or <code class="i">next(new AppError(...))</code> (road B). Either way it reaches the one handler.', 'lam') },

  { t: 'Why both status and code?', to: true, giua: true, body: cards([
    ['status: for HTTP', '404, 422, 500: read by browsers, proxies and monitoring.'],
    ['code: for your frontend', 'NOTE_NOT_FOUND forever. The frontend can branch on it safely.'],
    ['message: for humans', 'Free to change, translate, or be rewritten by a designer.'],
  ], 3) + js(`{ "error": { "code": "NOTE_NOT_FOUND", "message": "Note not found" } }     // HTTP 404`, { sm: false }) + box('Never make the client parse the message', 'A frontend that does <code class="i">if (msg.includes(\'not found\'))</code> breaks the day someone fixes a typo.', 'do2') + box('Shape', 'Every error, everywhere: <code class="i">{ error: { code, message } }</code>.', 'xanh') },

  { t: 'Exercise: which reach the handler?', to: true, giua: true, body: two(`<div style="font-size:26px">On Express 5, which of these reach your 4-parameter error handler?<ol><li>throw in a sync handler</li><li><code class="i">next(err)</code></li><li>throw after an <code class="i">await</code></li><li>throw inside your own <code class="i">setTimeout</code></li></ol></div>`,
    `<div data-k="dapan">${bang(['', 'Reaches it?', 'Seen in'], [['1', 'yes', 'err-paths'], ['2', 'yes', 'err-paths'], ['3', 'yes (Express 5)', 'err-paths'], ['4', '<b class="do">no: the process dies</b>', 'timer-throw']], { co: 21 })}</div>`) +
    `<div data-k="dapan">${box('And on Express 4?', 'Number 3 is lost too: the client hangs (curl exit 28).', 'lam')}</div>` + box('Rule of thumb', 'Inside a request: throw or next(err). Inside your own callbacks: next(err), always.', 'xanh') },

  { t: 'Part 1: summary', to: true, giua: true, body: `<ul>
<li>Error handler = middleware with <b>four</b> parameters; three means it never runs</li>
<li>Roads A, B, C; Express 5 catches C, Express 4 does not</li>
<li>Your own timers: lead errors out with <code class="i">next(err)</code></li>
<li><code class="i">AppError(status, code, message)</code></li>
</ul>${flow([{ t: 'A · sync throw', s: 'caught', mau: NODE }, { t: 'B · next(err)', s: 'caught', mau: NODE }, { t: 'C · after await', s: 'caught in Express 5', mau: CAM }, { t: 'own timer', s: 'use next(err)', mau: DO }], { h: 130, fs: 21 })}${box('Part 2', 'The full handler with a request id, a JSON 404 in the right place, and the two errors that still kill a process.', 'lam')}` },

  /* ───── 5.4b ───── */
  { t: 'The full handler', giua: true, body: js(ma('c5/err-full', 21, 33), { sm: true, hl: [2, 3, 4, 5, 6, 8, 9, 10] }) + two(
    box('Library errors → your shape', 'Broken JSON and too-large bodies come from body-parser. Translate them, then fall through.', 'lam'),
    box('5xx = our bug', 'Hide the message, log the stack, give the client a short <b>request id</b>.', 'do2')) },

  { t: 'Real answers from the full handler', giua: true, body: term(gay(ngan(ra('c5/err-full')).replace(/\$\(head -c 2000 \/dev\/zero \| tr '\\0' a\)/, '<2000 x a>'), 110), { title: 'curl · real (the 2000-byte body shortened in the command)', hl: [2, 4, 6, 8, 10] }) +
    two(term(gay(goc(srv('c5/err-full', 2, 3)), 54), { title: 'server log · real', hl: [1] }), box('The id ties them together', 'The client shows <code class="i">df5a57e9</code> in a screenshot; one grep finds the exact stack in the log.', 'xanh')) },

  { t: 'Four rules of a good handler', to: true, giua: true, body: cards([
    ['Never send a 500 message', 'Internal messages leak table names, file paths and pieces of queries. Log them, do not send them.'],
    ['Always log 5xx with the stack', 'A 500 you cannot reproduce is a 500 you cannot fix. 4xx is normal traffic: logging it all is noise.'],
    ['One response shape', '{ error: { code, message } }. The frontend writes ONE catch instead of guessing per endpoint.'],
    ['Keep the fourth parameter', 'Even if unused. It is the only reason Express treats the function as an error handler.'],
  ], 2) + bang(['Status', 'Log the stack?', 'Message to the client'], [
    ['4xx (client mistake)', 'no: normal traffic', 'the real message, written for them'],
    ['5xx (our bug)', '<b>yes</b>, with the request id', '"Internal error" + request id'],
  ], { co: 21 }) },

  { t: 'A JSON 404, and order decides again', giua: true, body: js(ma('c5notes/errors', 10, 13), { sm: true }) + js(ma('c5notes/app', 12, 17), { sm: true, hl: [4, 5] }) + term(ngan(ra('c5notes/index', 22, 23)), { title: 'curl · the Notes API of lesson 5.5 · real', hl: [2] }) + two(
    box('After every route', 'Nobody answered? A 404, in JSON. <code class="i">req.path</code> drops the query string.', 'lam'),
    box('Before the error handler', 'The error handler is always the very last <code class="i">app.use</code>.', 'xanh')) },

  { t: '"Tidying up" moved the 404 to the top', to: true, giua: true, body: js(ma('c5/notfound-top', 4, 10), { sm: true, hl: [1, 2, 3] }) + term(ngan(ra('c5/notfound-top')), { title: 'curl · real', hl: [2, 4] }) +
    box('Every endpoint is now 404', 'app.use with no path matches everything, so it answers before any route. Even routes you never touched break, which sends people hunting in the wrong place.', 'do2') },

  { t: 'Two errors that still kill the process', giua: true, body: js(ma('c5/unhandled', 1, 12), { sm: true, hl: [3, 7, 12] }) + two(
    term(ra('c5/unhandled'), { title: 'with handlers · real', hl: [3, 4] }),
    term(ra('c5/unhandled-default', 1, 2) + '\n...\n' + ra('c5/unhandled-default', 7, 7) + '\n...\n' + ra('c5/unhandled-default', 12, 13), { title: 'no handler · Node default · real (abridged)', hl: [4, 7] })) },

  { t: 'Log, then exit. Do not limp on.', to: true, giua: true, body: flow([
    { t: 'Unknown error', s: 'outside any request', mau: DO },
    { t: 'Log it', s: 'with the stack', mau: CAM },
    { t: 'process.exit(1)', s: 'state is unknown', mau: DO },
    { t: 'Supervisor', s: 'Docker / systemd', mau: NODE },
    { t: 'Clean process', s: 'serving again', mau: NODE },
  ], { h: 170, fs: 21 }) + box('Why not keep going?', 'After an uncaught exception you may have a half-done transaction, a released lock, a wrong module-level cache. A server that "survives" is quietly serving wrong data.', 'do2') + box('Lesson 1.4', 'This is why we spent time on unhandledRejection there.', 'lam') },

  { t: 'Where most 4xx errors really come from', to: true, giua: true, body: bang(['Library error', 'Your AppError', 'Chapter'], [
    ["body-parser <code class=\"i\">entity.parse.failed</code>", '400 INVALID_JSON', '5 (seen above, real)'],
    ["body-parser <code class=\"i\">entity.too.large</code>", '413 PAYLOAD_TOO_LARGE', '5 (seen above, real)'],
    ['Prisma <code class="i">P2002</code> (unique constraint)', '409 Conflict', '7'],
    ['JWT <code class="i">TokenExpiredError</code>', '401', '8'],
  ], { co: 22 }) + box('One pattern', 'Catch a known error type, convert it to your shape. All of it plugs into ONE function: that is what "centralised" means.', 'xanh') + js(`if (err.type === 'entity.parse.failed') err = new AppError(400, 'INVALID_JSON', '...');`, { sm: false }) },

  { t: 'This website: a request id on every error', to: true, giua: true, body: two(term(ra('c5/website-stack', 2, 3), { title: 'cuongthai.com · src/index.ts · real', hl: [2] }), cot(
    box('Section 1b', 'Every request gets a short id, echoed in the <code class="i">X-Request-ID</code> header and attached to the logs.', 'lam'),
    box('When a user reports "it broke"', 'The id in their screenshot finds the exact stack trace with one grep, instead of guessing among four hundred 500s that day.', 'xanh'))) + box('You built the small version', 'The <code class="i">requestId</code> in the 500 above is the same idea in five lines.', '') },

  { t: 'Exercise: the morning after a cleanup', to: true, giua: true, body: two(`<div style="font-size:26px">A teammate "tidied" app.mjs:<ol><li>moved the JSON 404 to the top,</li><li>removed the unused <code class="i">next</code> from the error handler.</li></ol>What breaks, for each change?</div>`,
    `<div data-k="dapan">${box('1 · 404 at the top', 'Every request is 404, even /health (seen above, real).', 'do2')}${box('2 · three parameters', 'The handler never runs: Express\'s default HTML page with the stack is back (seen above, real).', 'do2')}</div>`) +
    `<div data-k="dapan">${box('Lesson', 'Error middleware is position + arity. Write a comment next to both.', 'xanh')}</div>` + box('Arity', 'the number of parameters a function declares: <code class="i">fn.length</code>.', 'lam') },

  { t: 'Check yourself + summary', giua: true, body: `
<ol>
<li>Why must a 500 response never contain the original error message?</li>
<li>After an uncaughtException, why exit instead of continuing?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. It leaks internals (tables, paths, queries). Log it, send a generic message + id. &nbsp; 2. The process state is unknown; a supervisor restarts a clean one.', 'xanh')}</div>
<ul>
<li>One handler, last; four parameters; one shape <code class="i">{ error: { code, message } }</code></li>
<li>JSON 404 after the routes, before the handler</li>
<li>Outside requests: log, exit, let the supervisor restart</li>
</ul>
${box('Next', 'Lesson 5.5: assemble everything into the Notes API.', 'lam')}` },
]);
