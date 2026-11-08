/**
 * node-16-6 — Node.js · Chapter 16 · Lesson 16.6 "Optimisations that are not" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-16-6 (16.6a, slide 1–11: Vật chứng A + phần còn lại của danh sách) · node-16-6-2 (16.6b, slide 12–22: thắng thật từ đâu · ba câu hỏi · khi nào dừng).
 * Nguồn: nodejs-16-6-toi-uu-vo-ich. Output THẬT: that/c16/serializer (cô lập, 500 ghi chú) · that/c16/swap-linux (đổi bộ tuần tự hoá TRONG route 16.2, cả request, Linux) ·
 *   that/c16/profile (16.1) · that/c16/parts-linux (16.2) · compress · cluster · keepalive. Số chương khác: theo VIDEO đã khoá (KE-HOACH): Ch7 N+1 38,2 ⇒ 6,1 ms (6,3×),
 *   chỉ mục 55,177 ⇒ 0,084 ms (657×) · Ch12 cache trúng 0,41 ms (143,5×).
 * BỔ SUNG ngoài bài web: fast-json-stringify CHẬM hơn trên payload lớn đa dạng 340 KB (0,96×), nhanh 1,85× trên object nhỏ (web ~1,04×), nhanh 1,35× trên 21 KB của route 16.2 (web 1,39×) ·
 *   đổi thật trong route có database (swap-linux: chiếm 2,2 % handler, trần 0,6 %, đo +3,5 % = nhiễu, 5 vòng chồng nhau) · trần Amdahl tính từ tỉ lệ đo được ở 16.1 (16,2 %) và 16.2 (2,8 %).
 */
import { lamDeck, two, box, cards, flow, bang, J, TT, thanh, dong, steps } from './_c9-chung.mjs';

export const deck = { key: 'node-16-6', code: 'NODE 16.6', title: 'Optimisations that are not', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const S = (re) => dong('c16/serializer', re);
const SJ = num(S(/^JSON\.stringify\s+[\d.]+ ms/), /([\d.]+) ms/), SF = num(S(/^fast-json-stringify \(schema\)/), /([\d.]+) ms/);
const SMJ = num(S(/^JSON\.stringify\s+[\d,]+\/s/), /([\d,]+)\/s/), SMF = num(S(/^fast-json-stringify\s+[\d,]+\/s/), /([\d,]+)\/s/);
const W = (re) => dong('c16/swap-linux', re);
const WJ = W(/^JSON\.stringify\s/), WF = W(/^fast-json-stringify\s/), WS = W(/^serialiser alone/);
const wj = { rps: num(WJ, /^JSON\.stringify\s+([\d,]+)/), ser: num(WJ, /ms\s+([\d.]+) ms/), all: num(WJ, /([\d.]+) ms$/) };
const wf = { rps: num(WF, /^fast-json-stringify\s+([\d,]+)/), ser: num(WF, /ms\s+([\d.]+) ms/), all: num(WF, /([\d.]+) ms$/) };
const wAlone = num(WS, /alone: ([\d.]+)x/), wShare = num(WS, /handler: ([\d.]+)%/), wWhole = num(WS, /request: (-?[\d.]+)% req/);
const L2 = { ser: num(dong('c16/parts-linux', /JSON\.stringify/), /([\d.]+) ms/), serp: num(dong('c16/parts-linux', /JSON\.stringify/), /([\d.]+)%/), tot: num(dong('c16/parts-linux', /TOTAL measured/), /([\d.]+) ms/) };
const P1 = { str: num(dong('c16/profile', /\sstringify\s/), /([\d.]+)%/), rx: num(dong('c16/profile', /two regexes/), /slugify: ([\d.]+)%/) };
const amdahl = (share, k) => (share * (1 - 1 / k));
const f = (n) => n.toLocaleString('en-US');
const pm = (x) => `${x >= 0 ? '+' : ''}${x}`;

export const slides = lamDeck({ chuong: 'Chapter 16 — Performance', bai: '16.6' }, [
  { cover: true, t: 'Optimisations that are not', sub: 'Five lessons of measurement leave a by-product: a list of things that sound like optimisations and are not — each refuted by a number already in this chapter.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Exhibit A: the "faster" serialiser — alone, then inside a real request</li>
<li>Amdahl's law with this chapter's own numbers</li>
<li>The rest of the list, each item with its measured number</li>
<li>Where the real wins came from, and the five categories in order</li>
<li>Three questions before any optimisation, and how to know when to stop</li>
</ul>` + box('Why it matters to you', 'Every item here costs a competent developer a day. Knowing the number in advance turns that day into five minutes of arithmetic.', 'lam') },

  { t: 'Exhibit A: the faster serialiser', to: true, giua: true, body: J(`import fastJson from 'fast-json-stringify';
const stringify = fastJson({ type: 'object', properties: { items: { type: 'array', items: {
  type: 'object', properties: { id: { type: 'integer' }, title: { type: 'string' }, … } } } } });
res.type('json').send(stringify({ items }));       // compiled from a JSON Schema`, { sm: false, hl: [2, 4] }) +
    two(box('The promise', 'Knowing the shape in advance, a compiled serialiser can skip the type checks JSON.stringify does on every value.', 'lam'),
      box('The web lesson measured', '1.39× faster on a 112 KB payload, and no difference on a small object. Let us measure ours.', 'cam')) +
    flow([{ t: '1 · alone', s: 'our 500 notes', mau: LAM }, { t: '2 · inside the request', s: 'the 16.2 route', mau: TIM }, { t: '3 · Amdahl', s: 'the ceiling', mau: CAM }, { t: '4 · the alternative', s: 'remove the work', mau: NODE }], { h: 120 }) },

  { t: 'Alone, on this chapter\'s data', to: true, giua: true, body: TT('c16/serializer', 1, 12, 'node serializer.mjs · the 500 notes of 16.1 · median of 5 timed loops · real', { hl: [5, 6, 8, 12], n: 104, sm: false }) +
    two(box(`Large and varied: ${(SJ / SF).toFixed(2)}× — SLOWER`, `${SJ} ms vs ${SF} ms. On long, varied bodies the native encoder wins.`, 'do2'),
      box(`One small object: ${(SMF / SMJ).toFixed(2)}× faster`, `${f(SMJ)} vs ${f(SMF)} per second. The opposite of the web lesson, on different data.`, 'xanh')) },

  { t: 'Inside a real request', to: true, giua: true, body: TT('c16/swap-linux', 2, 7, 'the 16.2 route (100 notes from PostgreSQL, 21 KB responses) · serialiser swapped · Linux · autocannon -c 20 · median of 5 · real', { hl: [3, 4, 5], n: 104, sm: false }) +
    cards([[`Serialiser alone: ${wAlone}× faster`, `${wj.ser} → ${wf.ser} ms per request — on these short excerpts the web lesson's 1.39× reproduces.`], [`Its share: ${wShare}%`, `of the handler's ${wj.all} ms. Ceiling: ${amdahl(wShare, wAlone).toFixed(1)}% of the request.`], [`Measured: ${pm(wWhole)}% req/s`, `More than the ${amdahl(wShare, wAlone).toFixed(1)}% ceiling — so it is noise: the five rounds overlap (last line).`]], 3) },

  { t: 'Amdahl\'s law, with our numbers', to: true, giua: true, body: box('You can only save what the part costs', 'saving = share × (1 − 1/speed-up). Measure the share FIRST — it is the ceiling.', 'xanh') +
    bang(['route', 'stringify share', `if ${wAlone}× faster (as measured)`, 'if infinitely fast'], [
      ['16.1 — no database', `${P1.str}% of CPU`, `${amdahl(P1.str, wAlone).toFixed(1)}%`, `${P1.str}%`],
      ['16.2 — 100 notes from PostgreSQL', `${L2.serp}% of the request`, `${amdahl(L2.serp, wAlone).toFixed(1)}%`, `${L2.serp}%`],
    ], { co: 22, hl: [2] }) +
    box(`So the same library is worth ${amdahl(P1.str, wAlone).toFixed(1)}% on one route and ${amdahl(L2.serp, wAlone).toFixed(1)}% on another`, 'and on the varied 340 KB payload of slide 4 it would cost time, not save it.', 'cam') +
    J(`// 16.2, worked out:  share 2.8%  ×  (1 − 1/1.35)  =  2.8% × 0.26  ≈  0.7% of the request
// infinitely fast:     share 2.8%  ×  (1 − 0)       =  2.8%  — the absolute ceiling`, { sm: false }) },

  { t: 'What was available instead', to: true, giua: true, body: TT('c16/serializer', 4, 7, 'the same 500 notes · real', { hl: [4], n: 104, sm: false }) +
    two(box('The library optimises the step', `${SJ} → ${SF} ms — or worse.`, 'cam'), box('The architecture removes it', 'A string computed once (16.1 step 3) costs nothing per request: 227 million "serialisations" a second.', 'xanh')) +
    box('When both options are on the table', 'removing the work wins by a margin that makes the faster library irrelevant.', 'lam') },

  { t: 'The rest of the list, each with its number', to: true, giua: true, body: bang(['the "optimisation"', 'measured in this chapter'], [
    ['rewrite the two slugify regexes', `${P1.rx}% of CPU in 16.1 — a perfect fix wins ${P1.rx}%`],
    ['gzip level 9 instead of 6', '0.7% smaller for 1.5× the CPU (16.3)'],
    ['brotli quality 11', '148× slower; the live server fell from 3,560 to 24 req/s (16.3)'],
    ['cluster an I/O-bound app', '+6.7% for 10 processes — and 40 cron jobs run 10 times (16.4)'],
    ['raise the DB pool to 50', '1,707 req/s at 5 → 1,375 at 50: the queue moved into Postgres (16.2)'],
    ['let → const, avoid forEach', 'appears in no profile in this chapter (16.1 lists the top 14 functions)'],
  ], { co: 21, hl: [3, 4] }) + box('Every row is a measurement from lessons 16.1–16.4', 'not an opinion. Each costs about a day to "do", and each was refuted in advance.', 'lam') },

  { t: 'Two of them are worse than neutral', to: true, giua: true, body: two(box('High compression levels', 'Less throughput for a barely smaller file — or, on repetitive data, a BIGGER one. Negative in both dimensions while feeling like tuning.', 'do2'),
    box('Clustering an I/O-bound app', '+6.7% throughput, and four new classes of correctness bug: caches, rate limits, sockets, cron.', 'do2')) +
    box('An optimisation that adds a bug is not a slow win', 'It is a loss. Count the bugs it can cause next to the percent it buys.', 'cam') +
    flow([{ t: 'feels like tuning', s: 'level 11, 10 workers', mau: CAM }, { t: 'measured', s: 'slower or same', mau: DO }, { t: 'plus', s: 'new bugs, new deps', mau: DO }], { h: 120 }) },

  { t: 'Part A in one table', to: true, giua: true, body: bang(['', 'measured here', 'the lesson'], [
    ['fast-json-stringify alone (large)', `${(SJ / SF).toFixed(2)}×`, 'test on YOUR data'],
    ['… on one small object', `${(SMF / SMJ).toFixed(2)}×`, 'shape decides'],
    ['… inside the 16.2 request', `${wAlone}× alone · ceiling ${amdahl(wShare, wAlone).toFixed(1)}%`, 'measure the whole request'],
    ['Amdahl ceiling, 16.2', `${L2.serp}% even if infinitely fast`, 'share first'],
    ['string computed once', '0 ms per request', 'remove the work'],
  ], { co: 22 }) + box('Part B: where the wins really came from', 'Ordered by size — and the pattern in that order.', 'lam') },

  { t: 'Exercise (part A)', to: true, giua: true, body: box('Exercise', 'A teammate benchmarks a new JSON library: 1.6× faster than JSON.stringify in isolation, on a 50 KB sample. Your route spends 9 ms in PostgreSQL and 0.2 ms serialising. (1) What is the most the library can save per request? (2) What would you measure before merging? (3) What could make it SLOWER in production?', '') +
    box('Hint', 'Slides 4, 5 and 6.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) 0.2 × (1 − 1/1.6) = 0.075 ms of 9.2 — about 0.8%. (2) The whole request under load, on real responses, median of several runs. (3) Different data: on our varied 340 KB payload it was 0.96× — slower.', 'xanh')}</div>` },

  // ───────── 16.6b ─────────
  { t: 'Where the wins actually came from', to: true, giua: true, body: bang(['fix', 'factor', 'category'], [
    ['index on the filtered column (ch. 7)', '657×', 'DO LESS WORK'],
    ['Redis cache hit instead of the query (ch. 12)', '143.5×', 'DO LESS WORK'],
    ['N+1 → 2 queries (ch. 7)', '6.3×', 'DO LESS WORK'],
    ['cluster for CPU-heavy work (16.4)', '3.4×', 'ADD HARDWARE'],
    ['send only the fields used (16.1)', '2.8×', 'DO LESS WORK'],
    ['reuse connections: keep-alive (16.3)', '2.5×', 'DO LESS WORK'],
    ['precompute instead of recompute (16.1)', '2.3×', 'DO IT ONCE'],
    ['pre-serialise once (16.1)', '1.9×', 'DO IT ONCE'],
    ['fast-json-stringify (16.6)', `${(SJ / SF).toFixed(2)}–${wAlone}× · ≤${amdahl(wShare, wAlone).toFixed(1)}% of a request`, 'MAKE IT FASTER'],
  ], { co: 19, hl: [9] }) + box('The pattern is not subtle', 'Every large win removes work or does it once. Only "make it faster" can come out below 1.', 'cam') },

  { t: 'Five categories, in order', to: true, giua: true, body: steps([
    '<b>DO LESS WORK</b> — caching, indexes, fewer fields, fewer queries, reused connections. 2.5× to 657× here. ALWAYS first',
    '<b>DO IT ONCE</b> — precompute, pre-serialise, batch. ~2× each here',
    '<b>DO IT SOMEWHERE ELSE</b> — a queue, a CDN, nginx. Not faster, but off the user\'s critical path',
    '<b>ADD HARDWARE</b> — cluster, more containers. Linear, costs money, only when CPU-bound',
    '<b>MAKE IT FASTER</b> — a faster library, a cleverer loop. 0.96× to 1.35× here. LAST',
  ]) + box('"Make it faster" is the category people reach for first', 'because it feels like engineering. It has the worst returns in every measurement of this chapter.', 'do2') },

  { t: 'Three questions before any optimisation', to: true, giua: true, body: steps([
    '<b>What percentage of the TOTAL is it?</b> — if you do not know, measure (16.1, 16.2). Under 5%: stop here',
    '<b>Can it be REMOVED rather than made faster?</b> — cache it, precompute it, send less. Almost always the bigger win',
    '<b>How much harder does it make the code?</b> — 5% faster with twice the bugs is a bad trade. Write the REASON next to it',
  ]) + flow([{ t: 'share?', s: '< 5% ⇒ stop', mau: LAM }, { t: 'remove it?', s: 'cache · once · less', mau: NODE }, { t: 'cost in clarity?', s: 'comment the why', mau: CAM }, { t: 'measure again', s: 'whole request', mau: TIM }], { h: 120 }) },

  { t: 'Question 1 on this chapter\'s routes', to: true, giua: true, body: bang(['route', 'biggest line', 'what question 1 says'], [
    ['16.1 (no database)', 'renderNote 21.7% · crypto 20.5% · stringify 16.2%', 'worth working on — and remove before speeding up'],
    ['16.2 (100 notes, PostgreSQL)', 'database 97.2% (mostly waiting)', 'JS work is under 5%: stop; go to the database'],
    ['16.4 /io (await 30 ms)', '(idle) dominates', 'do not add workers; make the wait shorter'],
  ], { co: 21 }) + box('One profile answers question 1 for every candidate at once', 'That is why 16.1 came first.', 'xanh') +
    box('Under 5% is not "never"', 'It means: not now, not before the bigger lines are gone.', 'lam') },

  { t: 'When micro-optimisation IS right', to: true, giua: true, body: cards([
    ['A loop that runs millions of times', 'Chapter 12 measured a pipeline against 10,000 sequential Redis calls: 4,683.7 → 28.4 ms.'],
    ['A hot path the profile NAMED', 'Like the 16.2% stringify line in 16.1 — there, a faster serialiser is at least worth measuring.'],
    ['A library other people\'s hot paths run through', 'Your 1.4× is multiplied by every caller.'],
  ], 3) + box('Outside those three', 'it is a hobby. A pleasant one — but do not ship it as a performance fix.', 'cam') +
    J(`// Why this is precomputed at startup: renderNote was 21.7% of CPU under load (16.1, 2026-11-08).
const RENDERED = NOTES.map(renderNote);`, { sm: false, hl: [1] }) },

  { t: 'Knowing when to stop', to: true, giua: true, body: two(box('Set the finish line BEFORE starting', '"p95 under 300 ms for the feed" can be finished. "Make it faster" cannot. Tie it to a requirement users feel.', 'xanh'),
    box('The economic stop', 'A day of engineering costs more than a month of a bigger VPS — unless the change removes a scaling LIMIT, not just a scaling cost.', 'lam')) +
    bang(['change', 'what it changed'], [['index (657×), cache (143.5×)', 'what the system CAN do'], ['a 1.35× serialiser', 'an invoice, at best']], { co: 22, hl: [1] }) +
    flow([{ t: 'target set', s: 'p95 < 300 ms', mau: LAM }, { t: 'profile', s: 'biggest line', mau: TIM }, { t: 'fix one thing', s: 'measure again', mau: CAM }, { t: 'target met', s: 'STOP', mau: NODE }], { h: 120 }) },

  { t: 'What this website does', to: true, giua: true, body: bang(['change in this project', 'category'], [
    ['Redis cache in front of expensive queries (ch. 12)', 'DO LESS WORK'],
    ['indexes on filtered columns, cursor pagination (ch. 7, 9)', 'DO LESS WORK'],
    ['N+1 collapsed into include (ch. 7)', 'DO LESS WORK'],
    ['streamed uploads instead of buffering (ch. 10)', 'DO LESS WORK'],
    ['Cloudflare caching the media domain', 'DO IT SOMEWHERE ELSE'],
    ['compression middleware at a low brotli quality (16.3)', 'trade CPU for bandwidth'],
  ], { co: 21 }) + box('None of them is a faster library or a cleverer loop', 'The code stays ordinary, readable JavaScript — and the measured wins came from doing less.', 'xanh') },

  { t: 'A real trap: optimising what you can SEE', to: true, giua: true, body: two(box('The serialiser is in your code', 'so it is where attention goes.', 'cam'), box('The database round trip is one line', 'behind a library call — and it is 97% of the time.', 'do2')) +
    flow([{ t: 'visible code', s: 'gets the attention', mau: CAM }, { t: 'profile', s: 'shows the share', mau: TIM }, { t: 'Amdahl', s: 'computes the ceiling', mau: LAM }, { t: 'decide', s: 'before writing code', mau: NODE }], { h: 120 }) +
    box('Amdahl\'s law is the whole lesson', 'and it is measurable before you start: profile, find the fraction, compute the ceiling.', 'xanh') +
    bang(['in the 16.2 route', 'time per request', 'share'], [['JSON.stringify (visible, in your code)', `${L2.ser} ms`, `${L2.serp}%`], ['pool.query (one line)', '4.616 ms', '97.2%']], { co: 22, hl: [2] }) },

  { t: 'Exercise (part B)', to: true, giua: true, body: box('Exercise', 'Three proposals for a slow /feed route (p95 900 ms, target 300 ms): (A) rewrite a date-formatting helper that is 2% of CPU; (B) cache the feed for 10 seconds in Redis; (C) add two more cluster workers — the profile shows 65% (idle). Order them, and say which to skip.', '') +
    box('Hint', 'Slides 13, 14 and 15.', 'lam') +
    `<div data-k="dapan">${box('Answer', 'B first — DO LESS WORK, removes the query on most requests. A: under 5% — skip for now. C: skip — 65% idle means I/O-bound; workers add bugs, not speed (16.4). Then measure p95 again against the 300 ms finish line.', 'xanh')}</div>` },

  { t: 'Lesson 16.6 in one table', to: true, giua: true, body: bang(['', 'the number', 'the rule'], [
    ['faster library, alone', `${(SJ / SF).toFixed(2)}× / ${(SMF / SMJ).toFixed(2)}×`, 'depends on YOUR data'],
    ['faster library, whole request', `≤${amdahl(wShare, wAlone).toFixed(1)}% (measured ${pm(wWhole)}%: noise)`, 'Amdahl: share first'],
    ['biggest wins', '657× · 143.5× · 6.3×', 'do less work'],
    ['next', '~2× each', 'do it once'],
    ['when to stop', 'a p95 target users feel', 'decided before starting'],
  ], { co: 22 }) + box('Chapter 16 done: measure, then decide', 'Next: chapter 17 — Docker and deployment.', 'lam') },
]);
