/**
 * node-18-6 — Node.js · Chapter 18 · Lesson 18.6 "Eighteen chapters, one system" (slide EN, đợt 12 — 08/11/2026).
 * MỘT deck, HAI tập: node-18-6 (18.6a, slide 1–9) · node-18-6-2 (18.6b, slide 10–18).
 * Nguồn: nodejs-18-6-tong-ket-khoa-hoc. Số mỗi chương lấy theo VIDEO đã khoá (§7 KE-HOACH-NODEJS, không theo bài web) · log khởi động production = bài web ghi (không đo lại,
 *   không chạm máy chủ thật) · that/c18/{layers, coupling, summary} cho phần website.
 * Khác web: index 657× (web 222×) · N+1 6,3× · bcrypt 12 = 278,6 ms ≈ 560.000× sha256 (web 328.000×) · polling 10,07 GB (web 8,93) · pipeline 165× (web 63×) ·
 *   nhãn metric RSS 1.494 MB (web 939) · 276 → 3.395 req/s (web 285 → 3.550) · deploy mất 5,3 % (web 1,5 %) · docker stop mặc định 3,14 s (web 1,26) ·
 *   website 900 tệp 302.781 dòng · 608 model · 243 migration · 126 app.use · 50/150 · AsyncLocalStorage NAY có ở 4 tệp CT Work (web: không có) · vẫn không /metrics, không OTel.
 */
import { lamDeck, two, box, cards, flow, bang, TT, steps, sql, term } from './_c9-chung.mjs';

export const deck = { key: 'node-18-6', code: 'NODE 18.6', title: 'Eighteen chapters, one system', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';

const BOOT = `03:57:56.014  Sentry initialized                     environment=production
03:57:59.297  redis connection ready
03:57:59.386  Socket.IO Redis adapter attached
03:57:59.481  Database connected                     elapsedMs=10
03:57:59.548  document_chunks table + embedding column OK
03:57:59.567  social_posts GIN trigram index OK
03:57:59.638  embed queue recovery scan
03:57:59.638  cron all jobs registered               jobs=[7 groups]
03:57:59.641  CuongHoangDev API running              port=3001 env=production`;

export const slides = lamDeck({ chuong: 'Chapter 18 — Architecture', bai: '18.6' }, [
  { cover: true, t: 'Eighteen chapters,<br>one system', sub: 'The course began with var in a loop printing 3 3 3. It ends here: one backend, measured at every layer. This is the map — and the one number worth carrying from each chapter.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The system, chapter by chapter — one measured number from each</li>
<li>The five ideas that kept coming back from different directions</li>
<li>What a real Node backend does when it boots</li>
<li>A checklist for your first production deploy</li>
<li>What was left out on purpose, and how to keep going</li>
</ul>` + box('Every number here was produced by running something', 'in this course\'s videos. Where the web lesson measured a different value on another machine, the video\'s own measurement is used.', 'lam') },

  { t: 'Chapters 1–7: foundations, HTTP, data', to: true, giua: true, body: bang(['chapters', 'what they built', 'the number worth carrying'], [
    ['1–4 · foundations', 'JS for the backend · V8 + libuv · core modules · npm', 'a blocking loop: ~2.9 s of event-loop lag · stream 120 MB RAM vs readFileSync 395 MB'],
    ['5–6 · HTTP', 'Express, middleware, errors · REST, validation, paging', 'Express 5 returns 500 where Express 4 hung · OFFSET 999,980: 106.977 ms vs cursor 0.036 ms'],
    ['7 · data', 'PostgreSQL + Prisma, transactions, indexes', 'an index: 55.177 → 0.084 ms (657×) · N+1: 38.2 → 6.1 ms (6.3×)'],
  ], { co: 21 }) + two(box('Read the right column as a reminder, not a quiz', 'Each number is one experiment you can re-run; the lesson that produced it explains why.', 'xanh'), box('The thread through all three', 'Know what your code makes the machine do: block, copy, scan, or wait.', 'lam')) },

  { t: 'Chapters 8–13: security, content, scale', to: true, giua: true, body: bang(['chapters', 'what they built', 'the number worth carrying'], [
    ['8–9 · security', 'hashing, JWTs, authorisation · headers, XSS, ReDoS, SSRF', 'bcrypt cost 12: 278.6 ms per hash — ~560,000× slower than sha256, on purpose'],
    ['10–11 · content, realtime', 'uploads, object storage, images · WebSocket, Socket.IO', 'a pre-signed URL does not constrain Content-Type · polling 10.07 GB vs WebSocket 14.4 MB'],
    ['12–13 · scale', 'Redis cache, TTL, atomicity · queues, retries, idempotency', 'a pipeline: 165× fewer round-trip waits · a retried charge: 300,000 instead of 100,000 VND'],
  ], { co: 21 }) + two(box('Security is measured too', 'Slow on purpose (bcrypt), checked on every request (authorisation), never trusted from the client (Content-Type).', 'cam'), box('Scale is mostly "fewer trips"', 'A pipeline, a cache, a queue: each one removes waiting from the request path.', 'xanh')) +
    flow([{ t: 'protect', s: 'ch. 8–9', mau: DO }, { t: 'serve content', s: 'ch. 10–11', mau: LAM }, { t: 'scale', s: 'ch. 12–13', mau: NODE }], { h: 100 }) },

  { t: 'Chapters 14–18: confidence and operations', to: true, giua: true, body: bang(['chapters', 'what they built', 'the number worth carrying'], [
    ['14–15 · confidence', 'testing · logs, metrics, traces, alerts', '100% coverage in all four columns still let an EDITOR edit another author\'s post · one metric label: RSS 97 → 1,494 MB'],
    ['16–17 · operations', 'performance · Docker and deployment', '276 → 3,395 req/s with no new library · a deploy lost 16 of 301 requests until a proxy stood in front'],
    ['18 · architecture', 'layers, structure, coupling, decisions', '50 of 150 route files skip the service layer · 608 models in one schema'],
  ], { co: 21 }) + two(box('Eighteen chapters, one backend', 'Every one of those chapters measured the same kind of system — often this very website.', 'lam'), box('Confidence comes from checks that can fail', 'A test, a smoke test, an alert: each is useful only if it can turn red for the right reason.', 'xanh')) },

  { t: 'Five ideas that kept coming back', to: true, giua: true, body: steps([
    '<b>Measure, do not guess</b> — the regexes everyone suspected were 3.2% of CPU; a healthy p95 of 114.2 ms hid an 8,241 ms request',
    '<b>Doing less beats going faster</b> — index 657×, cache 143.5×, N+1 6.3×, keep-alive 2.5× — against a faster serialiser\'s 1.35×',
    '<b>Defaults are decisions</b> — pino-http logs your tokens; docker stop killed after 3.14 s here; a HEALTHCHECK with no start-period cries wolf',
    '<b>Types are not authorisation</b> — typeof threadId === \'number\' checks the TYPE, not the PERMISSION: a socket IDOR (chapter 11)',
    '<b>Failing quietly costs more than failing loudly</b> — a stale build answered 404 behind a green health check; a missing variable should KILL the process at boot',
  ]) },

  { t: 'Idea 2, measured: the size of each win', to: true, giua: true, body: bang(['win', 'kind', 'factor'], [
    ['an index (ch. 7)', 'doing less: read fewer rows', '657×'],
    ['a cache hit (ch. 12)', 'doing less: skip the query', '143.5×'],
    ['N+1 fixed (ch. 7)', 'doing less: fewer round trips', '6.3×'],
    ['keep-alive (ch. 16)', 'doing it once: reuse the connection', '2.5×'],
    ['a faster serialiser (ch. 16)', 'doing the same faster', '1.35×'],
  ], { co: 22, hl: [0, 1] }) + box('The order of the list is the order to try them in', 'The biggest wins remove work; the smallest make the same work faster.', 'xanh') },

  { t: 'Ideas 3–5, in one picture each', to: true, giua: true, body: cards([['Defaults are decisions', 'Every library, tool and platform made a choice for you. pino-http\'s was "log every header". Docker\'s was a grace period you never measured.'], ['Types ≠ authorisation', 'A value of the right TYPE says nothing about whether THIS user may touch it. Check ownership, every handler, sockets too.'], ['Fail loudly', 'A container that dies at boot with "MISSING ENVIRONMENT VARIABLES: R2_ACCESS_KEY_ID" is a gift. One that runs and quietly 404s is an incident.']], 3) +
    flow([{ t: 'a default', s: 'chosen by someone else', mau: CAM }, { t: 'measure it', s: 'in your setup', mau: LAM }, { t: 'set it explicitly', s: 'and write down why', mau: NODE }], { h: 110 }) },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['idea', 'one proof from this course'], [
    ['measure, do not guess', 'regexes 3.2% of CPU; p95 114.2 ms hiding 8,241 ms'],
    ['do less', '657× / 143.5× / 6.3× against 1.35×'],
    ['defaults are decisions', 'docker stop: 3.14 s here, 1.26 s there, 10 s in the docs'],
    ['types ≠ authorisation', 'the socket IDOR of chapter 11'],
    ['fail loudly', 'exit 1 at boot beats a quiet 404 in production'],
  ], { co: 22 }) + box('Part 2: what the system does at boot, and your production checklist', 'Then what was left out on purpose, and how to keep going.', 'lam') },

  { t: 'What a real Node backend does when it boots', to: true, giua: true, body: term(BOOT, { title: 'production boot log of this website — as recorded in the web lesson (not re-measured)', sm: false, hl: [4, 9] }) +
    two(box('3.63 seconds from start to serving traffic', 'Nine lines, and every line is a chapter. The next slide maps them.', 'lam'), box('Read it as a checklist that ran', 'Each line is something that must be true before one request is served: error tracking, shared state, the database, indexes, recovery, schedules.', 'xanh')) },

  { t: 'Every line is a chapter', to: true, giua: true, body: bang(['boot line', 'chapter'], [
    ['Sentry initialized', '15 · error tracking'],
    ['redis connection ready · Socket.IO Redis adapter', '12 · Redis, 11 · realtime across processes'],
    ['Database connected (10 ms)', '7 · PostgreSQL + Prisma'],
    ['table + GIN trigram index OK', '7 · indexes'],
    ['embed queue recovery scan', '13 · the in-process queue\'s written-down trade-off (18.5)'],
    ['cron all jobs registered', '13 · scheduled jobs (and 16.4\'s per-process flag)'],
    ['API running, port 3001, production', '5 · Express · 17 · NODE_ENV, PID 1, the container'],
  ], { co: 21 }) + box('If boot fails, the line that is missing tells you where to look', 'No "Database connected"? Chapter 7 and the environment (17.4). No "API running"? Read the error above it.', 'cam') },

  { t: 'Before your first production deploy (1/2)', to: true, giua: true, body: steps([
    '<b>Secrets</b> — nothing in git, nothing in the image; required variables checked at boot, and the process DIES if one is missing (17.4)',
    '<b>Authentication and authorisation</b> — argon2/bcrypt passwords, expiring JWTs, authorise in EVERY handler, sockets included (8, 9, 11)',
    '<b>Input</b> — validate every body with zod, cap the body size, redact secrets in logs, check files by their magic bytes (6, 9, 10, 15)',
    '<b>The database</b> — additive, reversible migrations; indexes on what you filter by; a measured pool; NO string-concatenated SQL (7, 16)',
  ]) + box('Each line is a chapter you can reopen', 'The numbers in brackets are where it was measured.', 'lam') },

  { t: 'Before your first production deploy (2/2)', to: true, giua: true, body: steps([
    '<b>Observability</b> — JSON logs with a request id, error tracking, an EXTERNAL uptime check, disk alerts (15)',
    '<b>Lifecycle</b> — the exec form of CMD, a graceful SIGTERM shutdown, an explicit stop_grace_period, a liveness probe that does NOT touch the database (15, 17)',
    '<b>Deploy</b> — a proxy owns the port, health-check BEFORE switching, smoke-test that routes are mounted, and know your way back (17)',
  ]) + box('Seven items, not seventy', 'None of them is exotic. Each one is something this website learned by getting it wrong once.', 'xanh') +
    box('Print it, tick it, keep it next to the code', 'Like the project\'s own CLAUDE.md (18.5): a checklist is only useful where the deploy is decided.', 'lam') },

  { t: 'What was left out, on purpose', to: true, giua: true, body: cards([['Not covered', 'GraphQL, gRPC, serverless, Kubernetes, event sourcing, CQRS.'], ['Why not', 'All real, all with a place — and none of them decides whether your first backend survives.'], ['When to learn them', 'After the layers underneath are measured instead of assumed. Every one of them is easier then.']], 3) +
    box('A trap after finishing: the same thing again, with more layers', 'A queue for work that takes 8 ms, a cache in front of a 2 ms query, three services where one file would do. Each pattern earns its place under a condition — carry the condition with the pattern.', 'do2') +
    flow([{ t: 'a pattern', s: 'queue, cache, split…', mau: LAM }, { t: 'its condition', s: 'when it earns its place', mau: CAM }, { t: 'a measurement', s: 'that shows the condition holds', mau: NODE }], { h: 110 }) },

  { t: 'How to keep going', to: true, giua: true, body: two(box('When you do not know, run it', 'Every number in these eighteen chapters came from a script that was executed — and several contradicted the documentation: Docker\'s stop timeout, brotli\'s highest level, the cost of AsyncLocalStorage, the shape of an "LRU" cache.', 'xanh'),
    box('Build something and put it in front of people', 'Every measurement here exists because a real system was serving real users and something needed explaining. That is where the questions worth answering come from.', 'lam')) +
    flow([{ t: 'a question', s: 'from a real system', mau: CAM }, { t: 'a script', s: 'that measures it', mau: LAM }, { t: 'a number', s: 'that may contradict the docs', mau: NODE }, { t: 'a decision', s: 'written down with why', mau: NODE }], { h: 120 }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c18/summary', 1, 10, 'what this website still does not have · git archive 9076fb918 · real', { n: 104, hl: [2, 4, 9], sm: true }) +
    bang(['measured 08/11/2026', 'value'], [['code · schema', '900 files, 302,781 lines · 608 models, 243 migrations'], ['gaps', 'no /metrics · no OpenTelemetry · no backend stop_grace_period']], { co: 21 }) },

  { t: 'A system you can describe accurately, gaps included', to: true, giua: true, body: box('The last idea of the course', 'This course was written about the system serving the page you are reading. Every "how this website does it" box was checked against the running code — including where the honest answer was "it does not do this yet". A system you can describe accurately, including its gaps, is one you can improve.', 'xanh') +
    cards([['Changed since the lessons were written', 'AsyncLocalStorage is now used in four CT Work files; services grew 33 feature folders; cron grew to 40 jobs.'], ['Still open', 'No /metrics, no OpenTelemetry, no stop_grace_period for the backend, and 50 route files that skip a layer.'], ['Your turn', 'Measure your own system the same way, and write down what you find.']], 3) },

  { t: 'Lesson 18.6 in one table', to: true, giua: true, body: bang(['', 'the takeaway'], [
    ['the map', 'one number per chapter, every one re-runnable'],
    ['five ideas', 'measure · do less · defaults · types ≠ authz · fail loudly'],
    ['boot', '9 lines, 3.63 s, every line a chapter'],
    ['checklist', 'secrets · auth · input · database · observability · lifecycle · deploy'],
    ['next', 'build something real, then measure it'],
  ], { co: 22 }) + box('Next: the tech-lead package and the course project', 'Reading an unfamiliar codebase, reviewing AI-written code, threat models, runbooks — and putting Notes API on a server.', 'lam') },
]);
