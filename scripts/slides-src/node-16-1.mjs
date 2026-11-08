/**
 * node-16-1 — Node.js · Chapter 16 · Lesson 16.1 "Profile first: 276 to 3,395 req/s on one route" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, MỘT tập node-16-1.
 * Nguồn: nodejs-16-1-do-truoc-khi-doan. Output THẬT: that/c16/profile (+ notes-data.mjs: 500 ghi chú sinh có hạt giống) — Node 22.23.3, express 5.3.0, autocannon 9.0.0
 *   (cùng máy, -c 20 -d 5 sau 2 s khởi động, TRUNG VỊ 5 lần), node --cpu-prof đọc bằng chính chương trình.
 * Khác web: 276 → 3.395 req/s = 12,3× (web 285 → 3.550 = 11,6×; 305 ở bảng bước) · phản hồi 471.698 → 145.119 B = 3,3× (web 365.593 → 86.683 = 4,2×, dữ liệu khác) ·
 *   profile: renderNote 21,7 % đứng đầu, stringify 16,2 %, crypto 20,5 %, regex 3,2 % (web 15,9 / 16,9 / 14,5 / 0,5 %), (idle) 0,9 % (web 22,4 %: máy này bận, autocannon cùng máy).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, T, TT, thanh, dong, steps, cot } from './_c9-chung.mjs';

export const deck = { key: 'node-16-1', code: 'NODE 16.1', title: 'Profile first: 276 to 3,395 req/s on one route', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (re) => dong('c16/profile', re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const pc = (re) => num(R(re), /^\s*([\d.]+)%/);
const P = { rn: pc(/\srenderNote\s/), st: pc(/\sstringify\s/), gc: pc(/garbage collector/), rx: num(R(/two regexes/), /slugify: ([\d.]+)%/), cr: num(R(/two regexes/), /Hash\): ([\d.]+)%/), idle: num(R(/two regexes/), /\(idle\): ([\d.]+)%/) };
const ST = [1, 2, 3, 4].map((k) => { const l = R(new RegExp(`^${k}\\. `)); return { rps: num(l, /\s([\d,]{3,})\s+\d+ms/), p50: num(l, /(\d+)ms\s+\d+ms/), p975: num(l, /\d+ms\s+(\d+)ms/), size: num(l, /([\d,]+) B$/) }; });
const f = (n) => n.toLocaleString('en-US');
const x = (a, b) => (a / b).toFixed(1);

export const slides = lamDeck({ chuong: 'Chapter 16 — Performance', bai: '16.1' }, [
  { cover: true, t: 'Profile first:<br>276 to 3,395 req/s on one route', sub: 'Every developer has an instinct about what is slow. It is wrong often enough that acting on it is a bad habit. One full lap of measure → profile → fix one thing → measure again.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>A CPU profile with one flag — and how to read its table</li>
<li>Why the part everyone suspects was ${P.rx}% of the CPU</li>
<li>Four fixes, measured one at a time: ${f(ST[0].rps)} → ${f(ST[3].rps)} req/s</li>
<li>The loop to repeat, and four rules that keep a benchmark honest</li>
<li>The trap that leaves you with no profile at all</li>
</ul>` + box('Why it matters to you', 'Chapter 15 showed WHERE time goes across a request. This chapter makes it go faster — starting with the habit that saves the most days: measure before you rewrite.', 'lam') },

  { t: 'The patient', to: true, giua: true, body: J(`function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function renderNote(n) {
  return {
    ...n,
    slug: slugify(n.title),
    excerpt: n.body.slice(0, 100),
    etag: crypto.createHash('sha256').update(JSON.stringify(n)).digest('hex'),
  };
}
app.get('/notes', (req, res) => {
  res.json({ items: NOTES.map(renderNote) });       // 500 notes, rebuilt on EVERY request
});`, { sm: true, hl: [2, 9, 13] }) +
    two(box('Before: measured', `${f(ST[0].rps)} req/s · p50 ${ST[0].p50} ms · p97.5 ${ST[0].p975} ms · ${f(ST[0].size)} bytes per response.`, 'do2'),
      box('Before guessing: what would YOU rewrite?', 'The regex? The spread? Most people say the regex. The profile says otherwise.', 'cam')) },

  { t: 'An everyday picture: the doctor takes an X-ray', to: true, giua: true, body: two(box('Guessing', 'A patient says "my leg hurts". A doctor who operates on the knee because knees usually hurt is guessing — and sometimes the problem is the hip.', 'do2'),
    box('Measuring', 'The X-ray takes five minutes and shows where the problem actually is. A CPU profile is the X-ray of your code.', 'xanh')) +
    flow([{ t: 'symptom', s: '65 ms to list notes', mau: DO }, { t: 'X-ray', s: 'node --cpu-prof', mau: LAM }, { t: 'diagnosis', s: 'the top of the table', mau: TIM }, { t: 'treatment', s: 'fix ONE thing', mau: NODE }], { h: 120 }) +
    box('Same order every time', 'Measure the symptom, image it, treat the biggest line, measure again.', 'lam') },

  { t: 'Taking a CPU profile without installing anything', to: true, giua: true, body: T(`node --cpu-prof --cpu-prof-dir=./prof server.mjs
# drive load through it (autocannon), then let the process exit NORMALLY
# → ./prof/CPU.<date>.<pid>.cpuprofile  (open in Chrome DevTools, or parse it)`, 'terminal', { sm: false }) +
    cards([['Sampling', 'V8 stops every ~1 ms and records which function is running. Many samples = where the time is.'], ['self time', 'Time spent IN the function itself, not in what it calls. The table below sorts by it.'], ['Under LOAD', 'Profile while autocannon hammers the route — a profile of an idle server is nothing but (idle).']], 3) +
    box('Chapter 2 again', 'The event loop runs one function at a time. The profile simply asks it, a thousand times a second, "which one now?".', 'lam') },

  { t: 'What the profile says', to: true, giua: true, body: TT('c16/profile', 2, 18, 'node profile.mjs · [1] --cpu-prof of the original route under autocannon -c 20 · parsed · real', { hl: [3, 4, 5, 13, 14], n: 112, sm: true }) },

  { t: 'Read the bottom line first', to: true, giua: true, body: thanh([['renderNote', P.rn, DO, `${P.rn}%`], ['crypto hash (4 lines)', P.cr, DO, `${P.cr}%`], ['stringify (res.json)', P.st, CAM, `${P.st}%`], ['garbage collector', P.gc, CAM, `${P.gc}%`], ['the two regexes', P.rx, LAM, `${P.rx}%`]], { w: 1100, x0: 300, wMax: 560, h0: 48, chu: 21, ghi: '% of sampled CPU · real' }) +
    cards([['The regex everyone suspects', `${P.rx}% — a perfect rewrite buys ${P.rx}%. The web lesson measured 0.5% on its machine.`], ['The real costs', 'Building 500 objects, hashing 500 notes and serialising ~470 KB — on every request, for data that never changes.'], [`(idle) = ${P.idle}%`, 'The CPU was never waiting: this route is CPU-BOUND — exactly when optimising the code pays.']], 3) },

  { t: 'Four fixes, measured one at a time', to: true, giua: true, body: TT('c16/profile', 20, 25, 'node profile.mjs · [2] autocannon -c 20 -d 5 · median of 5 runs · real', { hl: [5], n: 112, sm: false }) +
    thanh(ST.map((s, i) => [`step ${i + 1}`, s.rps, [DO, CAM, LAM, NODE][i], `${f(s.rps)} req/s`]), { w: 1100, x0: 160, wMax: 640, h0: 48, chu: 21, ghi: 'requests per second · real' }) },

  { t: `Step 2 — precompute (${x(ST[1].rps, ST[0].rps)}×)`, to: true, giua: true, body: J(`const PRECOMPUTED = NOTES.map(renderNote);           // once, at startup
app.get('/notes', (req, res) => res.json({ items: PRECOMPUTED }));`, { sm: false, hl: [1] }) +
    two(box('Same result, forever', 'NOTES is static, so renderNote produces the identical array every time. Run it once at startup.', 'xanh'),
      box('What disappeared', `renderNote and crypto — about ${Math.round(P.rn + P.cr)}% of the profile — gone outright. ${f(ST[0].rps)} → ${f(ST[1].rps)} req/s.`, 'lam')) +
    box('Principle: do it ONCE', 'Work redone on every request for data that does not change is the most common waste in a web server.', 'cam') },

  { t: `Step 3 — pre-serialise (${x(ST[2].rps, ST[1].rps)}× more)`, to: true, giua: true, body: J(`const BODY = JSON.stringify({ items: PRECOMPUTED });
app.get('/notes', (req, res) => { res.type('json'); res.send(BODY); });`, { sm: false, hl: [1] }) +
    two(box('If the object never changes, neither does its JSON', 'res.json() calls JSON.stringify on every request. Do it once instead.', 'xanh'),
      box('Two lines, nearly double', `${f(ST[1].rps)} → ${f(ST[2].rps)} req/s — the ${P.st}% stringify line is gone.`, 'lam')) +
    box('Still the same bytes on the wire', `${f(ST[2].size)} bytes per response. Only the CPU work changed.`, 'cam') + flow([{ t: 'request', s: 'GET /notes', mau: LAM }, { t: 'res.send(BODY)', s: 'a ready string', mau: NODE }, { t: 'socket', s: 'no stringify', mau: NODE }], { h: 110 }) },

  { t: `Step 4 — send less (${x(ST[3].rps, ST[2].rps)}× more)`, to: true, giua: true, body: thanh([['full objects', ST[2].size, DO, `${f(ST[2].size)} B`], ['only what the list renders', ST[3].size, NODE, `${f(ST[3].size)} B (${x(ST[2].size, ST[3].size)}× smaller)`]], { w: 1100, x0: 330, wMax: 520, h0: 60, chu: 22, ghi: 'bytes per response · real' }) +
    cards([['The server', 'less serialisation, less writev'], ['The network', 'less bandwidth, faster on mobile'], ['The client', 'less JSON to parse']], 3) +
    box('The most reliable optimisation, almost never listed as one', `The cheapest byte is the one you do not send. ${f(ST[2].rps)} → ${f(ST[3].rps)} req/s. Overall: ${x(ST[3].rps, ST[0].rps)}× faster, zero libraries changed.`, 'xanh') },

  { t: 'The loop', to: true, giua: true, body: steps([
    '<b>Measure a baseline</b> — autocannon, record req/s and p97.5. Without a baseline you can prove nothing',
    '<b>Take a profile UNDER LOAD</b> — an idle profile is nothing but (idle)',
    '<b>Fix EXACTLY ONE thing</b> — the top of the table. Fix two at once and you cannot tell which worked',
    '<b>Measure again</b> — if nothing moved, REVERT: more complex code that is no faster is a net loss',
    '<b>Repeat</b> — profile again: the bottleneck has MOVED, the old table no longer holds',
  ]) + box('In this lesson', `Four laps: ${ST.map((s) => f(s.rps)).join(' → ')} req/s. Each lap had its own top line.`, 'xanh') },

  { t: 'Benchmarking without fooling yourself', to: true, giua: true, body: cards([
    ['Warm up first', 'V8 interprets before it JIT-compiles: the first few hundred requests are 5–10× slower. Discard them (2 s here).'],
    ['p97.5, not the average', 'One 8-second request skews an average silently; a percentile does not hide it as easily.'],
    ['Client and server apart', 'autocannon burns real CPU. Here both shared one busy laptop — so absolute numbers are low; the RATIOS are what we compare.'],
    ['Change ONE variable', 'Same data, same connections, same duration. Change two and the result means nothing.'],
  ], 2) + box('This chapter on this machine', 'Every timing is the MEDIAN of 5 runs, because other jobs were sharing the CPU. The web lesson\'s numbers come from a different machine; the conclusions match.', 'lam') },

  { t: 'A real trap: no profile at all', to: true, giua: true, body: vsd(`<p><code class="i">kill -9</code> / <code class="i">pkill -9</code> / SIGKILL</p><p>The process dies before V8 can write the file. The profile directory is EMPTY — which looks exactly like "profiling does not work".</p>`,
    `<p>Exit normally</p><p>Handle SIGTERM and call <code class="i">process.exit(0)</code> (as profile.mjs does), then send SIGTERM.</p>`, '✗ SIGKILL', '✓ a normal exit') +
    J(`process.on('SIGTERM', () => { server.close(); process.exit(0); });   // --cpu-prof writes on a normal exit`, { sm: false }) +
    box('It cost the web lesson twenty minutes', 'An empty directory, no error, no warning. Now you know the one-line reason.', 'cam') },

  { t: 'What this website does', to: true, giua: true, body: two(box('Step 2, under another name', 'Chapter 12\'s Redis cache IS precomputation with a TTL instead of a startup constant: do the work once, serve the result many times (12.2: 58.34 ms → 0.41 ms).', 'xanh'),
    box('Step 4, not yet applied', 'Several list endpoints still return full row objects where the front end renders four fields. That is where an easy multiple is sitting unclaimed.', 'cam')) +
    flow([{ t: 'profile', s: 'find the top line', mau: LAM }, { t: 'do it once', s: 'precompute / cache', mau: NODE }, { t: 'send less', s: 'select the fields', mau: NODE }, { t: 'measure', s: 'prove it', mau: TIM }], { h: 120 }) + box('The pattern this chapter keeps finding', 'The big wins come from doing less work, or doing it once — not from doing the same work faster (16.6).', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'A route GET /courses returns 300 courses. Each request it calls computeRating(course) (averages all reviews) and returns every column, including a 20 KB description the list never shows. (1) In what order do you work, and what do you measure at each step? (2) Which two fixes from this lesson apply, and what would you check before calling it done?', '') +
    box('Hint', 'Slides 6, 9, 11 and 12.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) Baseline with autocannon (req/s, p97.5) → --cpu-prof under load → fix only the top line → measure → repeat. (2) Do it once (cache or precompute the ratings, refreshed when a review arrives) and send less (select only the fields the list renders). Done when the numbers moved — and revert anything that did not.', 'xanh')}</div>` },

  { t: 'Lesson 16.1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['the suspected regex', `${P.rx}% of CPU`, 'measure before rewriting'],
    ['precompute renderNote', `${f(ST[0].rps)} → ${f(ST[1].rps)} req/s`, 'do it once'],
    ['pre-serialise', `${f(ST[1].rps)} → ${f(ST[2].rps)} req/s`, 'do it once'],
    ['send only the needed fields', `${f(ST[2].rps)} → ${f(ST[3].rps)} req/s · ${x(ST[2].size, ST[3].size)}× fewer bytes`, 'send less'],
    ['the whole loop', `${x(ST[3].rps, ST[0].rps)}× faster, no new library`, 'one fix at a time'],
  ], { co: 22 }) + box('Next: 16.2 — where the time really goes when there is a database', 'Real routes have one, and that changes the arithmetic completely.', 'lam') },
]);
