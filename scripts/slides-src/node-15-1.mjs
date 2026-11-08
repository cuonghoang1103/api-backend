/**
 * node-15-1 — Node.js · Chapter 15 · Lesson 15.1 "Three pillars, and why console.log runs out" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-15-1 (slide 1–12: ba trụ cột, console.log, đo 100.000 dòng, ghi đồng bộ, pipe trong container) ·
 *   node-15-1-2 (slide 13–25: giá mỗi request, 486 byte chứa gì, redact, cấp độ log, website, quyết định, bài tập, tóm tắt).
 * Nguồn: nodejs-15-1-log-co-cau-truc. Output THẬT: that/c15/{logbench,pipe-linux,httplog,pinohttp-line,levels} (Node 22.23.3, pino 10.4.0, pino-http 11.0.0,
 *   express 5.3.0, autocannon 9.0.0; pipe-linux chạy trong container node:22-alpine). Mọi phép đo thời gian = TRUNG VỊ 5 lần (máy đang bận, load ~20).
 * Khác web: pino → stdout 2,4× nhanh hơn console.log (web 2,1×) · heartbeat 371 / 177 ms (web 349 / 135) · req/s 16.758 / 13.580 / 15.423 / 11.655 / 10.726 (web 14.729 / 12.121 /
 *   13.170 / 10.313 / 9.410) · dòng pino gọn 126 B (web 96 B) · lệnh debug bị chặn 5 ns (web 92 ns) — kết luận giữ nguyên.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT, thanh, dong, steps, cot } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-15-1', code: 'NODE 15.1', title: 'Three pillars, and why console.log runs out', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c15/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const f = (n) => n.toLocaleString('en-US');
const LB = (re) => ({ ms: num(R('logbench', re), /\s([\d.]+) ms/), rate: num(R('logbench', re), /ms\s+([\d,]+)/), mb: num(R('logbench', re), /([\d.]+) MB$/) });
const CS = LB(/^console\.log\(plain/), CJ = LB(/^console\.log\(JSON/), PS = LB(/^pino -> stdout/), PA = LB(/^pino -> file \(async/), PY = LB(/^pino -> file \(sync/);
const HB = { c: num(R('logbench', /^console\.log\s+wrote/), /at most (\d+) ms/), cms: num(R('logbench', /^console\.log\s+wrote/), /in (\d+) ms/), p: num(R('logbench', /^pino \(buffered\)/), /at most (\d+) ms/), pms: num(R('logbench', /^pino \(buffered\)/), /in (\d+) ms/) };
const PIPE = { loop: num(R('logbench', /over a pipe/), /took (\d+) ms/), late: num(R('logbench', /over a pipe/), /late by (\d+) ms/), q: num(R('logbench', /over a pipe/), /([\d.]+) MB queued/) };
const LX = { loop: num(R('pipe-linux', /^loop of/), /: (\d+) ms/), late: num(R('pipe-linux', /^loop of/), /late by (\d+) ms/), q: num(R('pipe-linux', /QUEUED/), /: ([\d.]+) MB/), rss: R('pipe-linux', /QUEUED/).match(/RSS (\d+ -> \d+) MB/)[1] };
const H = (re) => ({ rps: num(R('httplog', re), /\s([\d,]{5,})\s/), b: num(R('httplog', re), /(\d+) B\s/), mb: num(R('httplog', re), /([\d.]+) MB/), pct: num(R('httplog', re), /\(-([\d.]+)%/) });
const HN = H(/^no logging/), HC = H(/^console\.log 1 line/), HP = H(/^pino compact/), HD = H(/^pino-http default/), HS = H(/^pino-http \(sync\)/);
const ONE = num(R('pinohttp-line', /^\[1\]/), /= (\d+) bytes/);
const LV = { pino: num(R('levels', /^pino level=warn/), /(\d+) ns each/), cl: num(R('levels', /^console\.log behind/), /(\d+) ns each/), trap: num(R('levels', /ran \d+ times$/), /ran (\d+) times/) };
const WEB = readFileSync('/Users/admin/Downloads/api-backend/src/utils/logger.ts', 'utf8').split('\n');
const IDX = readFileSync('/Users/admin/Downloads/api-backend/src/index.ts', 'utf8').split('\n');
const tim = (arr, s) => arr.findIndex((l) => l.includes(s));
const MORGAN = IDX.slice(tim(IDX, "morgan.token('url'"), tim(IDX, "morgan.token('url'") + 4).join('\n');
const SKIP = IDX.slice(tim(IDX, "morgan('combined'"), tim(IDX, "morgan('combined'") + 4).join('\n');

const truSvg = `<svg data-k="tru" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
${[['📊 METRIC', 'THAT something is wrong', '5xx 0.1% → 4% in 10 min', LAM], ['🌳 TRACE', 'WHERE it is wrong', '7.9 s of 8.2 s in 12 queries', TIM], ['📜 LOG', 'WHAT exactly was wrong', 'request abc123 threw in listNotes', NODE]].map(([h, q, e, m], i) => `
<rect x="${10 + i * 365}" y="20" width="330" height="160" rx="16" fill="${m}12" stroke="${m}" stroke-width="3"/>
<text x="${175 + i * 365}" y="62" text-anchor="middle" font-size="27" font-weight="800" fill="${m}">${h}</text>
<text x="${175 + i * 365}" y="104" text-anchor="middle" font-size="21" font-weight="700" fill="#333">${q}</text>
<text x="${175 + i * 365}" y="146" text-anchor="middle" font-size="18" fill="#555">${e}</text>
${i < 2 ? `<text x="${357 + i * 365}" y="110" text-anchor="middle" font-size="34" fill="${CAM}">→</text>` : ''}`).join('')}
</svg>`;

const ongSvg = `<svg data-k="ong" viewBox="0 0 1100 170" width="1100" height="170" font-family="Arial">
<rect x="10" y="40" width="210" height="90" rx="14" fill="${NODE}18" stroke="${NODE}" stroke-width="3"/><text x="115" y="80" text-anchor="middle" font-size="22" font-weight="700" fill="${NODE}">Node process</text><text x="115" y="110" text-anchor="middle" font-size="18" fill="#333">console.log ×100,000</text>
<rect x="260" y="55" width="420" height="60" rx="12" fill="${DO}18" stroke="${DO}" stroke-width="3"/><text x="470" y="92" text-anchor="middle" font-size="21" font-weight="700" fill="${DO}">queue in RAM: ${PIPE.q} MB and growing</text>
<line x1="680" y1="85" x2="760" y2="85" stroke="#999" stroke-width="5" stroke-dasharray="10 8"/>
<rect x="770" y="40" width="320" height="90" rx="14" fill="${LAM}18" stroke="${LAM}" stroke-width="3"/><text x="930" y="80" text-anchor="middle" font-size="22" font-weight="700" fill="${LAM}">Docker log driver</text><text x="930" y="110" text-anchor="middle" font-size="18" fill="#333">stalled — reads nothing</text>
<text x="550" y="160" text-anchor="middle" font-size="19" fill="#555">a pipe, not a file: the write does not block — the bytes wait in YOUR memory instead</text>
</svg>`;

const roiSvg = `<svg data-k="roi" viewBox="0 0 1100 150" width="1100" height="150" font-family="Arial">
${[['📜 log file', 'every request', NODE], ['🚚 shipper', 'copies it out', LAM], ['🗄️ aggregator', 'indexed, replicated', TIM], ['⏳ 90 days', 'retained', CAM], ['👀 everyone', 'with dashboard access', DO]].map(([h, s, m], i) => `
<rect x="${6 + i * 220}" y="22" width="190" height="96" rx="14" fill="${m}14" stroke="${m}" stroke-width="2.5"/>
<text x="${101 + i * 220}" y="62" text-anchor="middle" font-size="22" font-weight="800" fill="${m}">${h}</text><text x="${101 + i * 220}" y="94" text-anchor="middle" font-size="17" fill="#444">${s}</text>
${i < 4 ? `<text x="${206 + i * 220}" y="78" text-anchor="middle" font-size="26" fill="${CAM}">→</text>` : ''}`).join('')}
<text x="550" y="145" text-anchor="middle" font-size="19" fill="${DO}" font-weight="700">… carrying "authorization: Bearer …" and "cookie: backend_token=…" for every user</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 15 — Logging and observability', bai: '15.1' }, [
  { cover: true, t: 'Three pillars,<br>and why console.log runs out', sub: 'Production takes away the terminal you debugged with. What you leave behind — and how much it costs per request — decides whether tomorrow\'s incident can be explained at all.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Logs, metrics, traces: three kinds of evidence, three different questions</li>
<li>What is actually wrong with console.log — and the "it is slower" claim, measured</li>
<li>How one burst of logging freezes the event loop, and what changes inside Docker</li>
<li>The cost per request of five ways to log — and the default that leaks every token</li>
<li>Redaction, levels, and what this website actually runs</li>
</ul>` + box('Why it matters to you', 'Fourteen chapters debugged by reading a terminal. From now on the process runs where you are not looking, for people you cannot ask.', 'lam') },

  { t: 'Production removes the terminal', to: true, giua: true, body: two(cot(box('Until now', 'You stood next to the process. It printed, you read, you fixed. Every bug happened while you were watching.', 'lam'),
    box('In production', 'The process is in a container, on a machine you are not looking at, serving people you cannot ask — and by the time you hear about a problem it already finished.', 'do2')),
    cot(box('Observability', 'The discipline of leaving behind enough evidence that a question you did <b>not</b> anticipate can still be answered <b>afterwards</b>.', 'xanh'),
      box('An everyday picture', 'A shop with no cameras and no receipts: when the till is short on Monday, nobody can say which sale went wrong on Saturday.', 'cam'))) +
    flow([{ t: 'something breaks', s: 'Saturday 02:14', mau: DO }, { t: 'nobody is watching', s: 'it finishes, it is gone', mau: CAM }, { t: 'Monday: "it broke"', s: 'a user tells you', mau: LAM }, { t: 'the evidence', s: 'is all you have', mau: NODE }], { h: 120 }) },

  { t: 'The three kinds of evidence', to: true, giua: true, body: cards([
    ['📜 Logs — discrete events', '"at 02:14:07 request abc123 threw in listNotes". Answers <b>what happened to THIS one</b>. Cheap in concept, expensive in volume.'],
    ['📊 Metrics — numbers over time', '"the 5xx rate rose from 0.1% to 4% in 10 minutes". Answers <b>how the whole system is doing</b>. Astonishingly cheap — but cannot tell one user\'s story.'],
    ['🌳 Traces — one request\'s timing tree', '"that request took 8.2 s, 7.9 of them in 12 identical pg queries". Answers <b>where the time went</b>. Costliest to build, most valuable for causes.'],
  ], 3) + box('Not substitutes', 'Each pillar answers a different question. Lessons 15.1–15.3 are logs, 15.4 metrics, 15.5 traces, 15.6 health checks and alerts.', 'lam') },

  { t: 'How to hold them in your head', to: true, giua: true, body: truSvg + two(box('Most incidents walk this list in order', 'A metric fires an alert → a trace shows which part is slow → the logs of that one request show the parameters that caused it.', 'xanh'),
    box('Two expensive mistakes', 'Alerting on logs is expensive (you search text forever). Debugging with metrics is impossible (they have no single request in them).', 'do2')) },

  { t: 'What is actually wrong with console.log', to: true, giua: true, body: TT('c15/logbench', 10, 11, 'the same event, written two ways · logbench.mjs · real', { n: 92, sm: false }) +
    two(box('Both hold the same facts', 'For your eyes, the first line is nicer. Nothing is wrong with console.log while a human is reading it.', 'lam'),
      box('Now ask a machine', '"Every request slower than 1000 ms, grouped by URL, for the last hour." The first line needs a fragile regex; the second needs <code class="i">.ms > 1000</code>. Lesson 15.3 measures that difference.', 'xanh')) +
    bang(['the question', 'plain-text line', 'JSON line'], [['slower than 1000 ms?', 'a regex for "a number > 1000"', '<code class="i">.ms > 1000</code>'], ['group by URL', 'parse the url=… word, hope no spaces', '<code class="i">group_by(.url)</code>']], { co: 22 }) },

  { t: 'Measurement 1 — "structured logging is slower"', to: true, giua: true, body: TT('c15/logbench', 2, 8, 'node logbench.mjs · each method in its own process, stdout → a real file · median of 5 · real', { hl: [3, 5], n: 104, sm: false }) +
    thanh([['console.log(string)', CS.ms, DO, `${CS.ms} ms`], ['console.log(JSON)', CJ.ms, DO, `${CJ.ms} ms`], ['pino → stdout', PS.ms, NODE, `${PS.ms} ms`], ['pino → file, async', PA.ms, NODE, `${PA.ms} ms`], ['pino → file, sync', PY.ms, CAM, `${PY.ms} ms`]], { w: 1100, x0: 300, wMax: 600, h0: 44, chu: 21, ghi: 'time to write 100,000 lines · shorter is better · real' }) },

  { t: 'Why pino is faster — and the row that gives it away', to: true, giua: true, body: cards([
    ['Fact', `pino writing JSON is <b>${(CS.ms / PS.ms).toFixed(1)}×</b> faster than console.log writing a shorter plain string — while writing more bytes (${PS.mb} MB vs ${CS.mb} MB).`],
    ['Design 1: a compiled serializer', 'pino builds the JSON with a function prepared for the logger\'s shape, not a generic JSON.stringify on every call.'],
    ['Design 2: a buffer', 'Lines go into a buffer flushed on a later tick, not one write() system call per line.'],
  ], 3) + flow([{ t: 'log.info(…) ×100,000', s: 'your loop', mau: NODE }, { t: 'buffer in memory', s: 'lines pile up', mau: CAM }, { t: 'one big write()', s: 'on a later tick', mau: LAM }, { t: 'the file', s: '17.0 MB', mau: TIM }], { h: 120 }) + box(`Now look at the last row: pino with sync: true = ${PY.ms} ms`, `Back to console.log speed (${CS.ms} ms). The library was never the variable. <b>The variable was buffering.</b>`, 'do2') },

  { t: 'Why a synchronous write hurts more than the number', to: true, giua: true, body: J(`let worst = 0, last = performance.now();
setInterval(() => {                         // a heartbeat every 20 ms
  const now = performance.now();
  worst = Math.max(worst, now - last - 20);   // how LATE was this beat?
  last = now;
}, 20);
// … then ONE burst: 100,000 log lines in a loop`, { sm: false, hl: [4] }) +
    TT('c15/logbench', 13, 15, 'node logbench.mjs · [2] stdout = a FILE · median of 5 · real', { hl: [2], n: 104, sm: false }) +
    box('What the heartbeat measures', 'A timer that should fire every 20 ms. If it fires 371 ms late, then for 371 ms the event loop did nothing else: that is the latency every request on this process just felt.', 'lam') },

  { t: `${HB.c} ms where nothing else ran`, to: true, giua: true, body: thanh([['console.log', HB.c, DO, `heartbeat late ${HB.c} ms`], ['pino (buffered)', HB.p, CAM, `heartbeat late ${HB.p} ms`]], { w: 1100, x0: 240, wMax: 560, h0: 58, chu: 23, ghi: 'worst lateness of a 20 ms timer during one burst · real' }) +
    two(box('process.stdout to a file is SYNCHRONOUS', 'The write blocks the event loop until the kernel accepts the bytes. No request parsed, no promise resolved, no timer fired.', 'do2'),
      box('And it never shows up in your logs', 'It looks exactly like a garbage-collection pause — and the thing that would log it is the thing being blocked.', 'cam')) +
    box(`Buffered pino: ${HB.p} ms — better, not zero`, 'The loop that builds 100,000 lines is itself synchronous work. Buffering removes the system calls, not the work. One more reason not to log 100,000 lines in one burst.', 'lam') },

  { t: 'Inside Docker the sign flips: a pipe, not a file', to: true, giua: true, body: ongSvg + bang(['same burst, stdout = a pipe nobody is reading', 'loop', 'heartbeat late', 'queued in the process'], [
    ['macOS, Node 22.23.3', `${PIPE.loop} ms`, `${PIPE.late} ms`, `${PIPE.q} MB`],
    ['Linux container, node:22-alpine', `${LX.loop} ms`, `${LX.late} ms`, `${LX.q} MB · RSS ${LX.rss} MB`],
  ], { co: 21 }) + box('A latency spike traded for a memory leak', 'Node writes to pipes asynchronously, so nothing blocks — the bytes queue in memory. If the log consumer stalls, that queue grows without bound. The only good answer: buffered, <b>with a bound</b>.', 'do2') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['three pillars', 'metric → trace → log', 'that · where · what'],
    ['console.log vs pino (100,000 lines)', `${CS.ms} vs ${PS.ms} ms`, 'structure is not the slow part'],
    ['pino with sync: true', `${PY.ms} ms`, 'buffering is the variable'],
    ['one burst to a file', `loop frozen ${HB.c} ms`, 'sync writes block everything'],
    ['the same burst into a stalled pipe', `${PIPE.q} MB queued in RAM`, 'buffer, but bound it'],
  ], { co: 22 }) + box('Next: the cost per REQUEST', 'Lines per second is a benchmark. Requests per second is a bill — and the default config hides a leak.', 'lam') },

  // ───────────── part 2 ─────────────
  { t: 'The number that matters: cost per request', to: true, giua: true, body: TT('c15/httplog', 2, 8, 'node httplog.mjs · one Express route, five ways to log it · autocannon -c 50 -d 5 · median of 5 · real', { hl: [3, 5], n: 112, sm: false }) +
    cards([['Same app, same route', 'GET /notes returns a tiny JSON. Only the logging changes between rows.'], ['Real files', 'Each server writes stdout to a file on disk; bytes per line is measured from that file.'], ['Same load', '50 connections for 5 s after a 2 s warm-up, 5 rounds, median — this laptop is busy.']], 3) },

  { t: 'Three readings, in order of how often they are got wrong', to: true, giua: true, body: thanh([['no logging', HN.rps, LAM, f(HN.rps)], ['console.log 1 line', HC.rps, CAM, `${f(HC.rps)} (−${HC.pct}%)`], ['pino compact', HP.rps, NODE, `${f(HP.rps)} (−${HP.pct}%)`], ['pino-http default', HD.rps, DO, `${f(HD.rps)} (−${HD.pct}%)`], ['pino-http sync', HS.rps, DO, `${f(HS.rps)} (−${HS.pct}%)`]], { w: 1100, x0: 290, wMax: 520, h0: 46, chu: 21, ghi: 'requests per second · median of 5 · real' }) +
    cards([['1 · Logging is not free', `Even the cheapest option here costs ${HP.pct}% of throughput.`], ['2 · Structure beat the plain string', `${f(HP.rps)} vs ${f(HC.rps)} req/s — while writing ${(HP.b / HC.b).toFixed(1)}× the bytes per line (${HP.b} B vs ${HC.b} B).`], ['3 · The slow row is a DEFAULT', `pino-http out of the box writes ${HD.b} B per request: −${HD.pct}%, ${(HD.mb / HP.mb).toFixed(1)}× the disk of pino compact.`]], 3) },

  { t: `What those ${HD.b} bytes actually contain`, to: true, giua: true, body: T(ra('c15/pinohttp-line', 4, 15), `one curl GET /notes with a (fake) token and cookie = ${ONE} bytes (outer braces trimmed) · real`, { sm: true, hl: [7, 8] }) +
    cards([['The two highlighted lines', 'The <b>authorization</b> header and the <b>cookie</b>, in plaintext, for every request.'],
      ['Not a bug in pino-http', 'An honest default: headers ARE the request. What must never be written down is <b>your</b> call.'],
      ['The values here are fake', 'A demo token and cookie — never real secrets in an experiment.']], 3) },

  { t: 'Why that is an incident, not a detail', to: true, giua: true, body: roiSvg + two(box('Every session token of every user', 'Sitting in a system that was never designed to hold secrets — readable by contractors, by the intern, by anyone who compromises the aggregator.', 'do2'),
    box('For ninety days', 'A leaked token in a 90-day log store is a 90-day incident. Configure redaction before the first deploy.', 'cam')) +
    box('What a token in a log lets someone do', 'Paste it into an Authorization header and BE that user until it expires — no password needed (chapter 8: access and refresh tokens).', 'do2') },

  { t: 'Redaction: say what must never be written', to: true, giua: true, body: two(J(`const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
});`, { sm: false, hl: [7, 8] }), cot(TT('c15/pinohttp-line', 18, 21, 'POST /login with a password, a refresh token, a bearer and a cookie (all fake) · real', { hl: [4], n: 60, sm: true }),
    box('The wildcard earns its keep', '<code class="i">*.password</code> matches the field wherever it appears — in a body, in a nested object, in code nobody has written yet. Redaction that depends on everyone remembering is not redaction.', 'xanh')), 'r46') },

  { t: 'Levels: the cheapest performance feature you own', to: true, giua: true, body: TT('c15/levels', 2, 3, 'node levels.mjs · a log call BELOW the level, 100,000 times · median of 5 · real', { hl: [1], n: 104, sm: false }) +
    cards([['pino, level = warn, debug()', `${LV.pino} ns per call: it still builds the argument object, then sees the level is off.`], ['A hand-written if (level)', `${LV.cl} ns: the object is never built.`], ['Both are noise', `Next to a real write (half a million lines per second) neither matters. The web lesson measured 92 ns on its machine — still noise.`]], 3) +
    box('The practical rule', 'Put <code class="i">logger.debug</code> anywhere you like. Put <code class="i">logger.info</code> only where you would pay for it in production — because that is exactly what you will do.', 'xanh') },

  { t: 'A real trap: the expensive part is the ARGUMENT', to: true, giua: true, body: J(`// level = warn: this line is NEVER written…
log.debug({ rows: countEverything() }, 'stats');
// …but countEverything() runs every time

if (log.isLevelEnabled('debug')) {
  log.debug({ rows: countEverything() }, 'stats');
}`, { sm: false, hl: [2, 5] }) + TT('c15/levels', 5, 6, 'node levels.mjs · 1,000 calls at level = warn · real', { hl: [1], n: 104, sm: false }) +
    box('Why', 'JavaScript evaluates the arguments BEFORE calling the function. A debug line with an await-ed query inside runs that query forever, in production, where the line is never written. If building the payload costs anything, guard it.', 'do2') },

  { t: 'What this website does (1): its logger', to: true, giua: true, body: two(JW(WEB.slice(tim(WEB, 'function emit'), tim(WEB, 'function emit') + 18).join('\n'), 62, [2, 9, 10, 11], { sm: true }),
    cot(box('src/utils/logger.ts — real, ~40 lines', 'Wraps console.*, JSON in production (for machines), a readable line in development (for people). Debug is dropped in production.', 'lam'),
      box('A defensible choice — for now', 'Structured where it matters, zero dependencies, one console.log per line. It gives up buffering, redaction and level-aware argument skipping: the right trade at this traffic, the wrong one at ten times it.', 'cam')), 'r64') },

  { t: 'What this website does (2): access logs that do not leak', to: true, giua: true, body: J(MORGAN + '\n…\n' + SKIP, { sm: false, hl: [1, 3] }) +
    two(box('The same leak, caught in advance', 'Some endpoints accept a JWT as <code class="i">?token=</code> for SSE streaming. morgan\'s default <code class="i">:url</code> would write it into the access log. The site overrides the token to replace it with [REDACTED].', 'xanh'),
      box('Probes stay out of the log', 'skip drops /health and /api/v1/system/health, so a health check every few seconds does not drown the real traffic.', 'lam')) },

  { t: 'The decision, compressed', to: true, giua: true, body: bang(['', 'decide this'], [
    ['Format', 'JSON in production, human-readable in development. Never one format everywhere.'],
    ['Library', 'Only matters through buffering + redaction + serialisers. console.log is fine until you need those.'],
    ['Buffering', 'Non-negotiable at load — and bounded. A sync write to a file froze the loop for ' + HB.c + ' ms.'],
    ['Redaction', 'Configure before the first deploy. A leaked token in a 90-day store is a 90-day incident.'],
    ['Defaults', `Read what your logger writes, by hand, once. ${HD.b} bytes per request is a decision, not a fact.`],
  ], { co: 25 }) + box('Five decisions, made once, before the first deploy', 'None of them is hard. Each of them is expensive to discover during an incident.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', `An Express app logs every request with pino-http's defaults to a file and serves ~1,000 requests per second. (1) Using this lesson's numbers, roughly how many bytes per day is that? (2) Name two things in each line you must not keep, and write the redact paths. (3) A teammate adds <code class="i">log.debug({ stats: await db.stats() })</code> "for later" — what does it cost in production at level info?`, '') + box('Hint', 'Use the bytes/line measured on slide 13, the two highlighted lines of slide 15, and the trap of slide 19.', 'lam') +
    `<div data-k="dapan">${box('Answer', `(1) ${HD.b} B × 1,000 × 86,400 ≈ ${(HD.b * 86400 / 1e6).toFixed(0)} GB per day, before compression. (2) req.headers.authorization and req.headers.cookie (plus res.headers["set-cookie"], *.password, *.token). (3) Nothing is written — but db.stats() runs on every request, forever. Guard it with if (log.isLevelEnabled('debug')).`, 'xanh')}</div>` },

  { t: 'Lesson 15.1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['100,000 lines: console.log vs pino', `${CS.ms} vs ${PS.ms} ms`, 'buffering, not structure, decides speed'],
    ['one burst to a file', `event loop frozen ${HB.c} ms`, 'sync writes block everything'],
    ['cost per request, cheapest → default', `−${HP.pct}% → −${HD.pct}%`, 'logging is never free'],
    ['pino-http default line', `${HD.b} B, token + cookie inside`, 'redact before the first deploy'],
    ['debug() below the level', `${LV.pino} ns — but the argument still runs`, 'guard expensive arguments'],
  ], { co: 22 }) + box('Next: 15.2 — one id through every layer', 'A hundred structured lines from forty concurrent requests are facts with the relationships torn out. One field puts them back.', 'lam') },
]);
