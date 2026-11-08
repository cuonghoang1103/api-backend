/**
 * node-15-2 — Node.js · Chapter 15 · Lesson 15.2 "Correlation: one id through every layer" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-15-2 (slide 1–12: tái hiện, một trường, truyền tham số, AsyncLocalStorage, biến toàn cục) ·
 *   node-15-2-2 (slide 13–23: giá, chọn cách sinh mã, tôn trọng mã được đưa, website, cùng một mã ở khắp nơi, bài tập, tóm tắt).
 * Nguồn: nodejs-15-2-request-id. Output THẬT: that/c15/{corr,als-cost,ids,inbound-id,prod-headers} (Node 22.23.3, express 5.3.0, pino 10.4.0, nanoid 6.0.2,
 *   autocannon 9.0.0 trung vị 5 lần; prod-headers = MỘT lệnh GET công khai tới cuongthai.com, chỉ đọc header).
 * BỔ SUNG ngoài bài web: biến toàn cục đo THẬT ([C]: 12/18 dòng mang mã của request tới sau cùng) · nanoid(12) trong bảng tốc độ (website dùng) ·
 *   header 20.000 ký tự ⇒ Node trả 431 trước cả middleware.
 * Khác web: bộ đếm nhanh hơn randomUUID 2,1× (web 4,8×) · tắt entropy cache chậm 6,5× (web 7,6×) · 0,19 % một nhân (web 0,15 %) · ALS −4,1/−6,0/−5,1 % (web −6 %) ·
 *   production nay trả HTTP/2 (web ghi HTTP/1.1).
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, G, thanh, dong, steps, cot } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-15-2', code: 'NODE 15.2', title: 'Correlation: one id through every layer', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c15/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const f = (n) => Math.round(n).toLocaleString('en-US');
const CORR = ra('c15/corr').split('\n');
const B = CORR.slice(CORR.findIndex((l) => l.startsWith('[B]')) + 1, CORR.findIndex((l) => l.startsWith('[C]')) - 1);
const ID1 = B[B.length - 1 - 5].slice(0, 8);                         // an id that appears mid-way through the completions
const GLOBAL = R('corr', /^lines carrying/), GL = num(GLOBAL, /: (\d+) of/), GT = num(GLOBAL, /of (\d+)/), GN = num(R('corr', /^lines whose id is WRONG/), /: (\d+) of/);
const AC = (re) => ({ rps: num(R('als-cost', re), /\s([\d,]{5,})\s/), pct: R('als-cost', re).match(/(-[\d.]+)%/)?.[1] });
const A0 = AC(/^nothing/), A1 = AC(/^randomUUID/), A2 = AC(/bare store/), A3 = AC(/child logger/);
const ID = (re) => num(R('ids', re), /\s([\d,]{7,})\s/);
const U = ID(/^randomUUID\(\)/), MR = ID(/^Math\.random/), NA = ID(/^nanoid/), UD = ID(/disableEntropyCache/), RB = ID(/^randomBytes/), CT = ID(/^pid \+ sequence/);
const CORE = num(R('ids', /of one core/), /= ([\d.]+)%/);
const IDX = readFileSync('/Users/admin/Downloads/api-backend/src/index.ts', 'utf8').split('\n');
const i1b = IDX.findIndex((l) => l.includes('1b. Request ID'));
const MW = IDX.slice(IDX.findIndex((l, i) => i > i1b && l.startsWith('app.use(')), IDX.findIndex((l, i) => i > i1b && l.startsWith('});')) + 1).join('\n');
const ORDER = IDX.filter((l) => /^\/\/ ─── \d+[a-z]?\. /.test(l)).map((l) => l.replace(/^\/\/ ─── /, '').replace(/ ─.*$/, '').replace(/ — .*$/, '')).slice(0, 8);

const bepSvg = `<svg data-k="bep" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
${[['🧾 #17', 'phở', LAM], ['🧾 #18', 'cơm', CAM], ['🧾 #19', 'bún', TIM]].map(([t, m, c], i) => `<rect x="${20 + i * 150}" y="${30 + i * 50}" width="130" height="44" rx="10" fill="${c}22" stroke="${c}" stroke-width="3"/><text x="${85 + i * 150}" y="${59 + i * 50}" text-anchor="middle" font-size="20" font-weight="700" fill="${c}">${t} ${m}</text>`).join('')}
<text x="560" y="70" font-size="40">👨‍🍳</text><text x="620" y="62" font-size="21" font-weight="700" fill="#333">one kitchen, many orders at once</text>
<text x="620" y="98" font-size="19" fill="#555">every pot, every plate carries the ticket number</text>
<text x="620" y="140" font-size="19" fill="${DO}" font-weight="700">no number ⇒ "whose soup burnt?" — no answer</text>
<text x="620" y="176" font-size="19" fill="${NODE}" font-weight="700">ticket number = request id</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 15 — Logging and observability', bai: '15.2' }, [
  { cover: true, t: 'Correlation:<br>one id through every layer', sub: 'A hundred structured lines from forty concurrent requests are facts with the relationships torn out. One field puts them back — the hard part is getting it everywhere.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The problem, reproduced honestly: three concurrent requests, eighteen anonymous lines</li>
<li>The fix in one field — and why passing it down as a parameter rots</li>
<li>AsyncLocalStorage: context that survives await, measured</li>
<li>Choosing the id, honouring the id you were given, bounding it</li>
<li>What this website does, and the same id beyond logs</li>
</ul>` + box('Why it matters to you', 'The moment you have more than one user, "just read the lines around it" stops working. This is the field that makes a log file usable at all.', 'lam') },

  { t: 'An everyday picture: a kitchen with tickets', to: true, giua: true, body: bepSvg + two(box('Concurrency is a kitchen', 'Three orders are cooked at the same time. Steps of different orders interleave — that is normal and cannot be changed.', 'lam'),
    box('The ticket number fixes everything', 'If every step carries the order number, you can rebuild one order\'s story from a pile of steps. That number is the request id.', 'xanh')) },

  { t: 'The problem, reproduced honestly', to: true, giua: true, body: two(J(`app.get('/notes/:user', async (req, res) => {
  log('route: request received');
  const notes = await listNotes(req.params.user);
  log('route: reply');
  res.json({ notes });
});
async function listNotes(userId) {          // service
  log(\`service: start userId=\${userId}\`);
  const r = await repoFindNotes(userId);     // repo
  log('service: done');
  return r;
}`, { sm: true, hl: [3, 9] }), cot(box('Three layers, each logging', 'route → service → repository, like the Notes API since chapter 5. Each layer writes what it is doing.', 'lam'),
      box('Three requests at the same moment', 'Users an, binh and chi ask for their notes together. The output on the next slide is exactly what came out.', 'cam'))) +
    flow([{ t: 'route', s: 'request received', mau: NODE }, { t: 'service', s: 'start userId=…', mau: LAM }, { t: 'repo', s: 'query, done', mau: TIM }, { t: 'route', s: 'reply', mau: NODE }], { h: 110 }) },

  { t: '18 lines, 3 requests — which is which?', to: true, giua: true, body: two(TT('c15/corr', 3, 20, 'node corr.mjs · [A] no request id · real', { sm: true, hl: [10, 11, 12, 13, 14, 15, 16, 17, 18] }),
    cot(box('Read the bottom nine lines', 'Nine events, three requests, and nothing in the file says which is which. If one of them had thrown, you could not tell whose request failed.', 'do2'),
      box('userId saved the first half — by luck', 'The developer happened to pass it to the service. The completion path has no such luck.', 'cam'),
      box('The order is scrambled — and that is not a bug', 'It is what concurrency looks like in a log file.', 'lam')), 'r46') },

  { t: 'The fix is one field', to: true, giua: true, body: two(TT('c15/corr', 23, 40, 'node corr.mjs · [B] the same app, one id per request · real', { sm: true }),
    cot(T(B.filter((l) => l.startsWith(ID1)).join('\n'), `the same 18 lines, filtered by ${ID1} (grep)`, { sm: true }),
      box('Still interleaved — and that is fine', `Concurrency did not change. What changed: <code class="i">grep ${ID1}</code> rebuilds one complete request, in order, out of a million lines.`, 'xanh')), 'r46') },

  { t: 'The obvious way: pass it down', to: true, giua: true, body: J(`async function listNotes(userId, reqId) {           // ← a new parameter
  log.info({ reqId, userId }, 'service: start');
  return repoFindNotes(userId, reqId);              // ← passed on again
}`, { sm: false, hl: [1, 3] }) + cards([
    ['It works…', 'Most codebases do exactly this, for about six months.'],
    ['…then it rots', 'reqId appears in the signature of two hundred functions, none of which care about it.'],
    ['…and it has holes', 'A helper three levels down cannot log the id at all, because nobody passed it.'],
  ], 3) + box('The real problem', 'The parameter carries no business meaning. It carries <b>ambient context</b> — "which request am I part of" — and function parameters are a bad container for that.', 'lam') },

  { t: 'AsyncLocalStorage: context that survives await', to: true, giua: true, body: J(`import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
const als = new AsyncLocalStorage();

app.use((req, res, next) => {           // ONE middleware, before every route
  const reqId = req.headers['x-request-id'] || randomUUID().slice(0, 8);
  res.setHeader('X-Request-ID', reqId);
  als.run({ log: logger.child({ reqId }) }, next);
});

// everywhere else in the application:
function log() { return als.getStore()?.log ?? logger; }`, { sm: false, hl: [8, 12] }) +
    two(box('A core module of Node', 'A value visible to everything running "inside" a call — across await, timers, promises, callbacks — without anyone naming it.', 'xanh'),
      box('This IS the app of slide 6', 'service and repo call log() and get the right child logger — no reqId parameter.', 'lam')) },

  { t: 'How the context travels', to: true, giua: true, body: steps([
    '<b>A request arrives</b> — the middleware reuses an inbound id or generates one, and echoes it in the X-Request-ID header',
    '<b>als.run(store, next)</b> opens a "context region": everything running inside next() can see the store',
    '<b>route → service → repo</b> call als.getStore() and get the right child logger; no extra parameter anywhere',
    '<b>await, setTimeout, callbacks</b> — the context follows the async chain; this is exactly where a global variable FAILS',
    '<b>The request ends</b> — the region is reclaimed automatically; nothing to clean up by hand',
  ]) + box('Why the runtime has to do it', 'Only Node knows which async chain is running right now. Your code does not — which is why the next slide goes wrong.', 'cam') },

  { t: 'Why a global variable does not work, measured', to: true, giua: true, body: two(T(G('c15/corr', 43, 60, 46) + '\n' + G('c15/corr', 63, 63, 46), 'node corr.mjs · [C] global.currentReqId = id · real', { sm: true, hl: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }),
    cot(box('The tempting shortcut', '<code class="i">global.currentReqId = id</code> — fine until two requests overlap.', 'cam'),
      box(`${GN} of ${GT} lines carry the WRONG id`, `A sets it, hits await; B and C overwrite it; A resumes and logs C's id. ${GL} lines carry the last id — ${GN} belong to someone else.`, 'do2'),
      box('Wrong in the most expensive way', 'It LOOKS right — every line has an id. You trust it, and it lies.', 'do2')), 'r46') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['3 concurrent requests, no id', '18 lines, 9 completions anonymous', 'interleaving is normal'],
    ['one id per request (ALS)', `grep ${ID1} → one full story`, 'one field fixes it'],
    ['pass reqId as a parameter', 'works, then rots', 'context ≠ business data'],
    ['AsyncLocalStorage', 'no parameter anywhere', 'context survives await'],
    ['a global variable', `${GN}/${GT} lines wrong`, 'never for per-request data'],
  ], { co: 22 }) + box('Next: what does it cost?', '"Async hooks are slow" is a real reputation. Is it still true?', 'lam') },

  // ───────────── part 2 ─────────────
  { t: 'What does that cost?', to: true, giua: true, body: TT('c15/als-cost', 2, 7, 'node als-cost.mjs · one route, one log line · autocannon -c 50 -d 5 · median of 5 · real', { hl: [3, 4, 5], n: 104, sm: false }) +
    thanh([['baseline', A0.rps, LAM, f(A0.rps)], ['randomUUID + req.id', A1.rps, CAM, `${f(A1.rps)} (${A1.pct}%)`], ['ALS, bare store', A2.rps, NODE, `${f(A2.rps)} (${A2.pct}%)`], ['ALS + child logger', A3.rps, NODE, `${f(A3.rps)} (${A3.pct}%)`]], { w: 1100, x0: 300, wMax: 520, h0: 48, chu: 21, ghi: 'requests per second · median of 5 · real' }) },

  { t: 'Reading it: the reputation is out of date', to: true, giua: true, body: cards([
    ['The three instrumented rows', `${f(A1.rps)} · ${f(A2.rps)} · ${f(A3.rps)} req/s — within a couple of percent of each other: the noise of a busy laptop.`],
    ['The whole cost', 'Is paid by the extra middleware and the extra field in the log line — not by AsyncLocalStorage.'],
    ['Why the bad name', 'The older async_hooks API earned it. V8 and Node have optimised the promise-context path heavily since Node 16.'],
  ], 3) + flow([{ t: 'extra middleware', s: 'one more function per request', mau: CAM }, { t: 'extra field', s: 'reqId on every line', mau: CAM }, { t: 'AsyncLocalStorage', s: 'no measurable cost', mau: NODE }], { h: 110 }) + box('So the decision is easy', 'Use AsyncLocalStorage. The web lesson measured −6% on its machine; here it is −4 to −6% — the same story.', 'xanh') },

  { t: 'Choosing the id', to: true, giua: true, body: TT('c15/ids', 2, 8, 'node ids.mjs · ids generated per second · median of 5 · real', { hl: [2, 4, 7], n: 125, sm: true }) +
    thanh([['nanoid(12)', NA, NODE, f(NA)], ['pid + counter', CT, NODE, f(CT)], ['randomUUID()', U, LAM, f(U)], ['Math.random()', MR, CAM, f(MR)], ['UUID, no cache', UD, DO, f(UD)], ['randomBytes(8)', RB, DO, f(RB)]], { w: 1100, x0: 250, wMax: 600, h0: 38, chu: 20, ghi: 'per second · higher is faster · real' }) },

  { t: 'Two surprises — and why it barely matters', to: true, giua: true, body: cards([
    ['The cache is the trick', `By default Node pre-generates a block of randomness and slices ids out of it. Turn that off and randomUUID is ${(U / UD).toFixed(1)}× slower.`],
    ['"Obviously slow" was fast', `nanoid(12) — what this website uses — made ${f(NA)} per second here, faster than a plain counter (${f(CT)}) on this machine.`],
    ['The counter', `pid + sequence is ${(CT / U).toFixed(1)}× faster than randomUUID here (the web lesson: 4.8×) and stays unique per process.`],
  ], 3) + box(`At 13,000 requests per second, randomUUID costs ${CORE}% of one core`, 'Not worth agonising over: pick one, move on.', 'lam') +
    bang(['need', 'pick'], [['standard shape, unique everywhere', 'randomUUID()'], ['short, URL-safe (this site)', 'nanoid(12)'], ['cheapest, one process', 'pid + counter']], { co: 20 }) },

  { t: 'Honour the id you were given — but bound it', to: true, giua: true, body: two(J(`app.use((req, res, next) => {
  const incoming = req.headers['x-request-id']?.trim();
  const id = incoming && incoming.length <= 64
    ? incoming : nanoid(12);
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
});`, { sm: true, hl: [3] }), TT('c15/inbound-id', 2, 5, 'node inbound-id.mjs · four real curl requests', { sm: true, n: 50 })) +
    cards([['Reuse, do not regenerate', 'One id per hop means three ids for one request across three services — the whole exercise fails.'], ['Trust, but truncate', 'An inbound header is attacker-controlled: without the 64-character cap, a huge id is written into every line and shipped to your aggregator.'], ['Node has its own ceiling', 'A 20,000-character header never reached the middleware: Node answered 431 by itself (default 16 KB of headers).']], 3) },

  { t: 'Echoing it back is how users report problems', to: true, giua: true, body: two(box('"It broke"', 'Unactionable. Which request? When? Which server?', 'do2'), box('"It broke, and the response said X-Request-ID: mJumRwAigpAO"', 'A grep away from the stack trace.', 'xanh')) +
    cards([['Error page', 'Show the id next to the message.'], ['API error body', 'Return it with the error so support can paste it into a ticket.'], ['Support form', 'Pre-fill it from the last failed response.']], 3) +
    box('This is why the id goes in a RESPONSE header too', 'Logging it is half the job. The other half is giving it to the only person who saw the failure.', 'lam') +
    flow([{ t: 'user sees an error', s: 'id on the screen', mau: DO }, { t: 'sends the id', s: 'support ticket', mau: CAM }, { t: 'grep the id', s: 'every log line', mau: LAM }, { t: 'the stack trace', s: 'in seconds', mau: NODE }], { h: 110 }) },

  { t: 'What this website does (1): read the headers', to: true, giua: true, body: TT('c15/prod-headers', 1, 6, 'one GET to the public site (GET, not HEAD) · real · 08/11/2026', { hl: [4, 5], n: 104, sm: false }) +
    two(box('Twelve characters of nanoid', 'Generated by the first middleware in the chain, echoed back on every response — even an error.', 'xanh'),
      box('The detail most implementations forget', 'X-Request-ID is listed in <b>Access-Control-Expose-Headers</b>. Without it the browser will not let front-end JavaScript read the header, so the app cannot show the id in an error toast.', 'cam')) +
    box('Note', 'The web lesson printed HTTP/1.1; the site now answers over HTTP/2 — same headers.', 'lam') },

  { t: 'What this website does (2): position 1b', to: true, giua: true, body: two(cot(JW(MW, 56, [3, 5], { sm: true }), bang(['src/index.ts, in order (real)'], [[ORDER.slice(0, 4).join(' → ')]], { co: 18 })),
    cot(box('Why first', 'Before helmet, CORS and the rate limiter — so even a request rejected with 429 carries an id.', 'xanh'),
      box('What it does NOT have yet', 'AsyncLocalStorage. req.id is on the request object, so route handlers can log it — a service three layers down cannot. That is the upgrade this lesson exists to justify.', 'do2')), 'r64') },

  { t: 'Beyond logs: the same id everywhere', to: true, giua: true, body: cards([
    ['Response header', 'Users can read it and send it to you.'],
    ['Error body', 'Support pastes it into a ticket.'],
    ['Sentry / error tracker', 'A tag on the event → jump from the error report to the exact log lines.'],
    ['A slow DB query', 'Embed it in a SQL comment <code class="i">/* reqId=abc */</code> → pg_stat_activity tells you which request is locking the table.'],
    ['Background jobs', 'Put it in the BullMQ payload (chapter 13): a job 10 minutes later still traces back to the request that enqueued it.'],
    ['Calling another service', 'Forward X-Request-ID so the whole system shares one id (lesson 15.5 does this with traceparent).'],
  ], 3) + box('Every one of these has repaid the effort in a real incident', 'The id is cheap to carry and priceless the day someone asks "what happened to MY request?".', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Notes API logs with pino. (1) Write the middleware that reuses an inbound X-Request-ID (max 64 chars) or generates one, echoes it, and stores a child logger in AsyncLocalStorage. (2) A teammate proposes <code class="i">global.reqId = id</code> "because it is simpler". Using the [C] output, explain in one sentence why not. (3) Where else should the id go, so a user\'s "it broke" becomes actionable?', '') +
    box('Hint', 'Slides 8, 10, 16 and 18.', 'lam') +
    `<div data-k="dapan">${box('Answer', `(1) The middleware of slide 8 with the 64-character check of slide 16 and <code class="i">als.run({ log: logger.child({ reqId }) }, next)</code>. (2) Requests overlap at every await: in [C] ${GN} of ${GT} lines carried another request's id — wrong lines that look right. (3) The response header (exposed to the browser via Access-Control-Expose-Headers), the error body, the error tracker tag, job payloads, outgoing calls.`, 'xanh')}</div>` },

  { t: 'Lesson 15.2 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['no id, 3 concurrent requests', '9 completions anonymous', 'one field fixes it'],
    ['AsyncLocalStorage vs uuid only', `${A2.pct}% vs ${A1.pct}% — noise`, 'ALS is not the cost'],
    ['global variable', `${GN}/${GT} lines wrong`, 'never for per-request data'],
    ['id generators', `nanoid ${f(NA / 1e6)}M/s · UUID ${f(U / 1e6)}M/s`, 'any is fine — reuse inbound'],
    ['inbound id', '≤ 64 chars kept, longer replaced', 'trust, but truncate'],
  ], { co: 22 }) + box('Next: 15.3 — what logs cost, and finding one line in a million', 'Now that every line can be found: how much does keeping them cost, and how fast can you search them?', 'lam') },
]);
