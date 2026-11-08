/**
 * node-15-3 — Node.js · Chapter 15 · Lesson 15.3 "What logs cost, and finding one line in a million" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-15-3 (slide 1–12: hoá đơn theo hình dạng dòng, thời gian giữ, đọc tốn bao nhiêu, log là một cơ sở dữ liệu, phân vị mù) ·
 *   node-15-3-2 (slide 13–22: lấy mẫu theo băm, cấp độ, xoay vòng có đo bằng container thật, ngăn xếp log, website, bài tập, tóm tắt).
 * Nguồn: nodejs-15-3-chi-phi-va-tim-kiem. Output THẬT: that/c15/{logbill,haystack,rotate} (Node 22.23.3, /usr/bin/grep 2.6.0-FreeBSD + jq 1.7.1 của macOS,
 *   Docker json-file trong container node:22-alpine — container đã gỡ). Mọi phép đo thời gian = TRUNG VỊ 5 lần.
 * BỔ SUNG ngoài bài web: xoay vòng đo thật (100.000 dòng, max-size 1m × 2 tệp ⇒ docker logs chỉ còn 12.492 dòng, từ dòng 87.509).
 * Khác web: B/dòng 121 / 147 / 247 / 642 (web 125 / 165 / 305 / 641), tỉ lệ nén 6,0–18,3× (web 9,2–21,4×) — bộ sinh khác · tệp 189 MB (web 229) ·
 *   grep 1,66 s / jq 3,06 s = 1,8× (web 1,6×) · phân vị 9,7 s (web 11,4) · lấy mẫu giữ 9.974 dòng = 1,00 % (web 10.034).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, T, TT, thanh, dong, steps, cot } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-15-3', code: 'NODE 15.3', title: 'What logs cost, and finding one line in a million', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c15/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const LB = (re) => { const l = R('logbill', re); return { b: num(l, /MB\s+(\d+) B/), ratio: num(l, /([\d.]+)x/), day: num(l, /x\s+([\d.]+) GB/), dayz: num(l, /\/ ([\d.]+) GB/) }; };
const P = LB(/^plain string/), CJ = LB(/^compact JSON/), CX = LB(/^JSON with context/), PH = LB(/^pino-http default/);
const HS = (re) => num(R('haystack', re), /([\d.]+) s/);
const G1 = HS(/^grep -F \(fixed/), JQ1 = HS(/^jq select\(\.requestId/), JQS = HS(/^jq 'select\(\.durationMs/), GJ = HS(/^grep -F '"status":500' \| jq/);
const MB = num(R('haystack', /^1,000,000 lines/), /lines, ([\d.]+) MB/);
const PCT = num(R('haystack', /^[\d.]+ s for/), /^([\d.]+) s/);
const KEPT = num(R('haystack', /^kept/), /kept\s+([\d,]+) lines/), KMB = num(R('haystack', /^kept/), /\/ ([\d.]+) MB/);
const ROT = { n: num(ra('c15/rotate', 4, 4).trim(), /^(\d+)/), first: num(R('rotate', /^\{"level":30,"n":\d+/), /"n":(\d+)/) };
const f = (n) => n.toLocaleString('en-US');
const ret = (gb, d = 90, k = 3) => ({ t: (gb * d) / 1000, r: (gb * d * k) / 1000 });

const billSvg = `<svg data-k="bill" viewBox="0 0 1100 170" width="1100" height="170" font-family="Arial">
<line x1="40" y1="90" x2="1060" y2="90" stroke="#999" stroke-width="3"/>
${['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, i) => `<circle cx="${80 + i * 190}" cy="90" r="8" fill="#999"/><text x="${80 + i * 190}" y="125" text-anchor="middle" font-size="20" fill="#555">${m}</text>`).join('')}
<rect x="20" y="20" width="230" height="44" rx="10" fill="${LAM}18" stroke="${LAM}" stroke-width="2.5"/><text x="135" y="49" text-anchor="middle" font-size="19" font-weight="700" fill="${LAM}">April: "add one field"</text>
<rect x="830" y="20" width="250" height="44" rx="10" fill="${DO}18" stroke="${DO}" stroke-width="2.5"/><text x="955" y="49" text-anchor="middle" font-size="19" font-weight="700" fill="${DO}">Sept: the bill doubled</text>
<text x="550" y="160" text-anchor="middle" font-size="19" fill="#333">the cost arrives in a different month than the decision — nobody can point at the change</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 15 — Logging and observability', bai: '15.3' }, [
  { cover: true, t: 'What logs cost,<br>and finding one line in a million', sub: 'Logging feels free because the bill arrives months after the decision. Both halves, measured: what a line costs to keep, and what it costs to find.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The daily bill of four log shapes — and the multiplier nobody budgets for</li>
<li>What it costs to READ: grep vs jq on a million real lines</li>
<li>The question a log can answer that a metric cannot — and why percentiles are blind</li>
<li>Sampling that keeps every incident and drops 99% of the bill</li>
<li>Levels with one rule, and rotation: the outage that logging causes</li>
</ul>` + box('Why it matters to you', 'Every field you add is a decision with a price. This lesson makes the price visible while you are still deciding.', 'lam') },

  { t: 'Why it feels free', to: true, giua: true, body: billSvg + two(box('The delay hides the cause', 'You add a field in April. In September the log bill has doubled, and nobody can say which change did it.', 'cam'),
    box('So put numbers on both halves', 'What a line costs to STORE, and what it costs to SEARCH — measured here, on 200,000 and 1,000,000 realistic lines.', 'xanh')) +
    cards([['Store', 'bytes per line × traffic × retention × replicas'], ['Search', 'seconds per question × how often you ask it'], ['Decide', 'which fields, which level, what to sample']], 3) },

  { t: 'The daily bill, by log shape', to: true, giua: true, body: TT('c15/logbill', 2, 7, 'node logbill.mjs · 200,000 varied lines per shape (URLs, statuses, durations, agents, IPs) · real', { hl: [2, 5], n: 112, sm: false }) +
    cards([['Realistic, not repeated', 'A seeded generator varies every field. Repeating one line would compress unrealistically well.'], ['Per day', 'Bytes per line × 1,000 requests per second × 86,400 seconds — a modest API.'], ['gzip -6', 'What a log shipper or a rotated file typically uses.']], 3) + box('Four shapes, the same request', 'plain text · compact JSON (same facts) · JSON with context (+ user, IP, agent) · whatever pino-http writes by default.', 'lam') },

  { t: 'Reading 1 — the default costs 5× the minimum', to: true, giua: true, body: thanh([['plain string', P.day, CAM, `${P.day} GB/day`], ['compact JSON', CJ.day, NODE, `${CJ.day} GB/day`], ['JSON with context', CX.day, LAM, `${CX.day} GB/day`], ['pino-http default', PH.day, DO, `${PH.day} GB/day`]], { w: 1100, x0: 270, wMax: 560, h0: 54, chu: 22, ghi: 'uncompressed, at 1,000 req/s · real' }) +
    two(box(`${(PH.day / P.day).toFixed(1)}× for information nobody reads`, `From a hand-written ${P.b}-byte line to pino-http out of the box: ${P.day} → ${PH.day} GB per day.`, 'do2'),
      box('In money', 'At a typical managed-log price of roughly one dollar per GB ingested (the web lesson\'s rough figure), that gap is over a thousand dollars a month.', 'cam')) },

  { t: 'Reading 2 and 3 — structure, and compression', to: true, giua: true, body: cards([
    [`Structure costs ~${Math.round((CJ.b / P.b - 1) * 100)}%`, `Plain ${P.b} B vs compact JSON ${CJ.b} B for the SAME facts. That is the honest price of machine-readability — the rest of the lesson is what it buys.`],
    [`Compression: ${P.ratio}× to ${PH.ratio}×`, 'Log lines repeat themselves: same keys, same URLs, same statuses. Never store logs uncompressed — never estimate cost from the raw size.'],
    ['The inversion', `The fattest line compresses best (${PH.ratio}×): more of each line is boilerplate. After gzip, pino-http default is ${PH.dayz} GB/day vs ${P.dayz} for plain.`],
  ], 3) + bang(['per day at 1,000 req/s', 'raw', 'gzipped'], [['plain string', `${P.day} GB`, `${P.dayz} GB`], ['JSON with context', `${CX.day} GB`, `${CX.dayz} GB`], ['pino-http default', `${PH.day} GB`, `${PH.dayz} GB`]], { co: 21 }) },

  { t: 'Retention: the multiplier nobody budgets for', to: true, giua: true, body: flow([{ t: `${CX.day} GB/day`, s: 'JSON with context', mau: LAM }, { t: `× 90 days`, s: `${ret(CX.day).t.toFixed(1)} TB`, mau: CAM }, { t: '× 3 replicas', s: `${ret(CX.day).r.toFixed(1)} TB`, mau: DO }], { h: 140 }) +
    two(box('Not the number on the invoice', `${CX.day} GB per day is where the bill STARTS. Ninety days of retention and a three-way replicated store make it ${ret(CX.day).r.toFixed(1)} TB (before compression).`, 'do2'),
      box('The one knob you can turn later', 'Unlike sampling, retention can be changed after the fact, on old data, without touching any code.', 'xanh')) +
    bang(['retention', '1 copy', '3 replicas'], [['7 days', `${(CX.day * 7 / 1000).toFixed(2)} TB`, `${(CX.day * 21 / 1000).toFixed(2)} TB`], ['30 days', `${(CX.day * 30 / 1000).toFixed(2)} TB`, `${(CX.day * 90 / 1000).toFixed(2)} TB`], ['90 days', `${ret(CX.day).t.toFixed(2)} TB`, `${ret(CX.day).r.toFixed(2)} TB`]], { co: 21, cap: `JSON with context, ${CX.day} GB/day raw · arithmetic on the measured size` }) },

  { t: 'The other half: what does it cost to READ?', to: true, giua: true, body: TT('c15/haystack', 2, 13, `node haystack.mjs · ${f(1000000)} JSON lines, ${MB} MB, ONE request buried at line 777,778 · median of 5 · real`, { hl: [5, 6, 9], n: 112, sm: false }) + cards([['The haystack', `${f(1000000)} lines, varied ids, users, IPs and durations.`], ['The needle', 'One 500 that took 8241 ms, at line 777,778.'], ['Three questions', 'one id · every request > 1000 ms · every 500.']], 3) },

  { t: 'grep scans bytes, jq parses — use both', to: true, giua: true, body: thanh([['grep -F (fixed string)', G1, NODE, `${G1} s`], ['jq select(…)', JQ1, CAM, `${JQ1} s`], ['grep -F … | jq', GJ, NODE, `${GJ} s`], ['jq for > 1000 ms', JQS, CAM, `${JQS} s`]], { w: 1100, x0: 310, wMax: 520, h0: 54, chu: 22, ghi: `searching ${MB} MB · median of 5 · real` }) +
    two(box(`grep is ${(JQ1 / G1).toFixed(1)}× faster`, 'It never parses anything: it compares bytes. The web lesson measured 1.6× on its machine.', 'lam'),
      box('The fastest correct answer: combine', `grep to cut the file down to candidates, then jq for the condition that needs real types: ${GJ} s vs ${JQS} s. On ten gigabytes that ratio is waiting vs giving up.`, 'xanh')) },

  { t: 'The query plain text cannot express', to: true, giua: true, body: vsd(`<p>"Every request slower than 1000 ms"</p><p><code class="i">duration=1234ms</code> is just bytes to grep. A regex for "a number greater than 1000" means enumerating digit counts — and it silently breaks the first time the format changes.</p>`,
    `<p>Nine characters:</p><p><code class="i">.durationMs > 1000</code></p><p>A typed number, compared as a number. This is the ~${Math.round((CJ.b / P.b - 1) * 100)}% buying itself back.</p>`, '✗ plain text', '✓ JSON') +
    box('This is the argument for the whole chapter', 'Structured logs turn "search for words" into "ask a question". Everything else — sampling, tracing, correlation — builds on that.', 'lam') },

  { t: 'A log file is a database you did not have to set up', to: true, giua: true, body: J(`jq -s 'group_by(.url)[] | {url: .[0].url, n: length,
    p50: (map(.durationMs)|sort|.[(length*0.5)|floor]),
    p95: (map(.durationMs)|sort|.[(length*0.95)|floor]),
    max: (map(.durationMs)|max)}' -c haystack.log`, { sm: false }) +
    TT('c15/haystack', 16, 20, 'jq -s on the same million lines · one run · real', { hl: [2], n: 104, sm: false }) +
    two(box('No database, no index, no setup', 'Because every line is a typed record, p50 / p95 / max per URL is one jq expression.', 'xanh'), box(`${PCT} seconds`, 'Slow for a dashboard, instant for an investigation. A log store (Loki, ELK) does the same with indexes.', 'lam')) },

  { t: 'Stare at row two: percentiles are blind', to: true, giua: true, body: cards([
    ['/api/v1/feed: p95 114.2 ms', 'Identical to every other route, comfortably inside any SLO you would write.'],
    ['…and a max of 8241 ms', 'One user waited eight seconds. The p95 does not know — and cannot know.'],
    ['Why', 'One bad request in 250,000 is the 99.9996th percentile. Percentiles are designed to hide outliers: that is what makes them stable, and blind.'],
  ], 3) + box('The rule', 'Alert on percentiles, investigate with max, and never conclude "everything is fine" from a healthy p95 alone.', 'do2') +
    box('Next: keep the signal, drop the bill', 'Part 2 cuts the stored bytes 100× without losing that one 8-second request.', 'lam') },

  // ───────────── part 2 ─────────────
  { t: 'Sampling: keep everything abnormal, sample the rest', to: true, giua: true, body: J(`let h = 0;
const s = record.requestId;
for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
const sampled = (h % 10000) < RATE * 10000;      // RATE = 0.01

if (record.status >= 500 || record.durationMs > 1000 || sampled) keep(record);`, { sm: true, hl: [5] }) +
    two(TT('c15/haystack', 23, 25, 'the same million lines · real', { sm: true, n: 56, hl: [2, 3] }), box('100× smaller, zero incident data lost', `${f(KEPT)} lines (${KMB} MB) kept out of a million. The 500 and the 8-second request both survived.`, 'xanh')) +
    box('Why not just raise the level to warn?', 'Because it throws away exactly the context you need: the interesting lines are the info lines AROUND the error.', 'cam') },

  { t: 'Why a hash of the request id, not Math.random()', to: true, giua: true, body: two(box('Math.random() < 0.01 per LINE', 'Keeps a scattered 1% of the lines of EVERY request: a file full of orphaned fragments — the worst of both worlds.', 'do2'),
    box('hash(requestId) per REQUEST', 'All lines of a request share the id, so a request is entirely in or entirely out. A sampled request is still a complete story.', 'xanh')) +
    `<svg data-k="mau" viewBox="0 0 1100 170" width="1100" height="170" font-family="Arial">
<text x="10" y="30" font-size="20" font-weight="700" fill="${DO}">per line:</text>${Array.from({ length: 10 }, (_, r) => Array.from({ length: 4 }, (_, k) => `<rect x="${140 + r * 92 + k * 20}" y="12" width="16" height="26" rx="3" fill="${(r * 7 + k * 3) % 5 === 0 ? DO : '#ddd'}"/>`).join('')).join('')}
<text x="10" y="110" font-size="20" font-weight="700" fill="${NODE}">per request:</text>${Array.from({ length: 10 }, (_, r) => Array.from({ length: 4 }, (_, k) => `<rect x="${140 + r * 92 + k * 20}" y="92" width="16" height="26" rx="3" fill="${r === 3 || r === 8 ? NODE : '#ddd'}"/>`).join('')).join('')}
<text x="550" y="160" text-anchor="middle" font-size="18" fill="#555">10 requests × 4 lines each · coloured = kept</text></svg>` + box('Same 10% of lines either way', 'The difference is not how MUCH you keep but whether what you keep still tells a story.', 'lam') },

  { t: 'A real trap: hash something stable', to: true, giua: true, body: cards([
    ['Hash the request id', 'Identical on every line of the request, and the same in every process that sees it.'],
    ['Not the timestamp', 'Every line has a different one: back to orphaned fragments.'],
    ['Not a per-line counter, not Math.random()', 'Two containers would decide differently for the same request.'],
  ], 3) + box('What it looks like when you get it wrong', 'A request that crossed two containers is half-kept: it looks exactly like a request that vanished mid-flight — and you spend an afternoon chasing it.', 'do2') +
    box('Bonus: the same id from lesson 15.2', 'Correlation made sampling possible. The request id is doing two jobs now.', 'lam') },

  { t: 'Levels, and the one rule that keeps them useful', to: true, giua: true, body: bang(['level', 'means', 'example'], [
    ['error', 'Someone has to ACT. If nobody will, it is not an error', 'payment provider returned 500 three times'],
    ['warn', 'Unusual but already handled', 'a successful retry, a fallback path, a quota exhausted'],
    ['info', 'Business events you are willing to PAY to keep', 'login, payment, data deleted'],
    ['debug', 'On while chasing one incident; OFF in production (env variable)', 'cache miss for key note:42'],
    ['trace', 'So detailed only its author can read it', 'every SQL parameter'],
  ], { co: 21 }) + box('The rule', 'An error nobody acts on trains everyone to ignore errors. A 401 on an expired token is not an error — it is Tuesday. Downgrade anything routine, or within a month a real outage scrolls past unnoticed.', 'do2') },

  { t: 'Rotation: the outage that logging causes', to: true, giua: true, body: two(cot(box('At 24 GB a day, a 100 GB disk fills in four days', 'Then PostgreSQL stops accepting writes, Docker cannot start containers — and the log that would explain why cannot be written.', 'do2'),
    box('This project lived it', 'The VPS once filled its disk and took Postgres down with it (lesson 15.6 tells the story).', 'cam')),
    J(`# /etc/docker/daemon.json — ceiling for ALL containers
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "5" }
}`, { sm: true, hl: [4] })) +
    cards([['250 MB per container', 'Enforced by the daemon, not by anyone remembering.'], ['Only NEW containers', 'Existing ones keep their old settings until recreated.'], ['docker logs shows the window', 'Anything older has rotated away — ship it before that.']], 3) },

  { t: 'Rotation, measured: what docker logs still has', to: true, giua: true, body: T(`$ docker run --log-opt max-size=1m --log-opt max-file=2 node:22-alpine sh -c '…print 100,000 JSON lines…'\n${ra('c15/rotate', 1, 8)}`, 'a real container on this machine (removed afterwards) · real', { sm: false, hl: [5, 7] }) +
    two(box(`100,000 lines written, ${f(ROT.n)} kept`, `The two 1 MB files hold only the last ${f(ROT.n)} lines — from line ${f(ROT.first)} to 100,000. Everything before rotated away, silently.`, 'cam'),
      box('So: rotate AND ship', 'Rotation protects the disk. Shipping protects history. You need both.', 'xanh')) },

  { t: 'A logging stack where each layer can fail alone', to: true, giua: true, body: steps([
    '<b>The application</b> writes JSON to stdout. It does NOT open files and does NOT rotate them — not the process\'s job',
    '<b>Docker json-file driver</b> captures stdout and rotates by max-size / max-file: the hard ceiling against a full disk',
    '<b>The collector</b> (Vector, Promtail, Fluent Bit) reads those files, samples, compresses, ships. If it dies, the app does not',
    '<b>The log store</b> (Loki, ELK, a paid service) indexes, queries, retains — this is where the bill is calculated',
  ]) + box('The property that matters', 'An app writing to stdout keeps serving when the shipper dies. An app writing straight to a remote log service blocks when that service is slow — that is how a logging outage becomes an application outage.', 'lam') },

  { t: 'What this website does', to: true, giua: true, body: flow([{ t: 'backend', s: 'JSON → stdout', mau: NODE }, { t: 'Docker json-file', s: 'rotation', mau: LAM }, { t: 'docker logs', s: 'the read path', mau: CAM }, { t: '(not yet)', s: 'a shipper', mau: '#999' }], { h: 130 }) +
    two(box('The simplest arrangement with failure isolation', 'No log files, no rotation code, no shipper inside the process. Enough at this traffic.', 'xanh'),
      box('The two upgrades, in the order they will be needed', '1. A shipper, so history outlives rotation. 2. Sampling at the shipper, so that history is affordable.', 'cam')) +
    box('Why nothing more yet', 'One container, modest traffic: docker logs + grep + jq answers today\'s questions. The day an incident needs last week\'s lines, the shipper becomes urgent.', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', `Your API serves 300 requests per second and logs "JSON with context" lines (${CX.b} B). (1) How many GB per day, raw? (2) With 30 days retention and 2 replicas? (3) You want to keep every error and every request over 1 s, plus 2% of the rest — write the keep() condition and say what you hash.`, '') +
    box('Hint', 'Bytes × requests per second × 86,400; then × days × replicas. Slides 13 and 15.', 'lam') +
    `<div data-k="dapan">${box('Answer', `(1) ${CX.b} × 300 × 86,400 ≈ ${(CX.b * 300 * 86400 / 1e9).toFixed(1)} GB/day. (2) × 30 × 2 ≈ ${(CX.b * 300 * 86400 * 60 / 1e12).toFixed(2)} TB (before compression; ~${CX.ratio}× less after gzip). (3) <code class="i">status >= 500 || durationMs > 1000 || hash(requestId) % 10000 < 200</code> — hash the request id so each request is kept whole.`, 'xanh')}</div>` },

  { t: 'Lesson 15.3 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['bytes per line, plain → pino-http default', `${P.b} → ${PH.b} B (${(PH.day / P.day).toFixed(1)}×)`, 'read what you write'],
    ['compression', `${P.ratio}× – ${PH.ratio}×`, 'never estimate from raw size'],
    ['grep vs jq on a million lines', `${G1} s vs ${JQ1} s; combined ${GJ} s`, 'grep to cut, jq to decide'],
    ['p95 of /feed vs its max', '114.2 ms vs 8241 ms', 'percentiles hide outliers'],
    ['sampling by request-id hash', `${f(KEPT)} lines = 1.00%`, 'keep all abnormal, 1% of normal'],
    ['docker max-size 1m × 2', `${f(ROT.n)} of 100,000 lines left`, 'rotate AND ship'],
  ], { co: 21 }) + box('Next: 15.4 — metrics, and the label that ate the memory', 'Logs answer questions about one request. Metrics answer them about all requests at once, for a fixed price — until one label breaks it.', 'lam') },
]);
