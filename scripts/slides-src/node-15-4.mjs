/**
 * node-15-4 — Node.js · Chapter 15 · Lesson 15.4 "Metrics, and the label that ate the memory" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-15-4 (slide 1–12: bốn loại công cụ đo, /metrics 15 dòng, đọc histogram, chọn mốc bucket, RED) ·
 *   node-15-4-2 (slide 13–24: cái sai đắt tiền, tệ tới mức nào, chỗ cho thứ vô hạn, collectDefaultMetrics, bảo vệ endpoint, website, bài tập, tóm tắt).
 * Nguồn: nodejs-15-4-metrics-prometheus. Output THẬT: that/c15/{metrics,cardinality,metrics-port,sentry-tag,prod-headers} (Node 22.23.3, prom-client 15.1.3,
 *   express 5.3.0; prod-headers = GET công khai tới cuongthai.com).
 * BỔ SUNG ngoài bài web: tag "route" Sentry của website chạy TRƯỚC routing ⇒ là URL thô (/v1/courses/42), không phải mẫu route (đo bằng bản sao, sentry-tag) ·
 *   prom-client 15.1.3 báo deprecated khi cài (npm: "replaced by @prometheus-io/client").
 * Khác web: 100 / 4.268 / 399 chuỗi, 9.807 / 390.366 / 34.533 B (web 127 / 4.313 / 426, 9.780 / 391.460 / 34.501) ·
 *   100.000 user: RSS 55 → 1.494 MB, 109,52 MB, 1.473 ms (web 178 → 939 MB, 74,52 MB, 1.381 ms).
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, vsd, J, JW, T, TT, thanh, dong, steps, cot } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-15-4', code: 'NODE 15.4', title: 'Metrics, and the label that ate the memory', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c15/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const f = (n) => n.toLocaleString('en-US');
const LBL = (re) => { const l = R('metrics', re); const m = l.match(/\s(\d+)\s+(\d+)\s+([\d,]+) B/); return { all: Number(m[1]), tot: Number(m[2]), b: Number(m[3].replace(/,/g, '')) }; };
const TP = LBL(/^route template/), RAW = LBL(/^raw URL/), USR = LBL(/^template \+ user_id/);
const CARD = [1000, 10000, 100000].map((n) => { const l = R('cardinality', new RegExp(`^\\s+${f(n)}\\s`)); return { n, r0: num(l, /(\d+) -> /), r1: num(l, /-> (\d+) MB/), mb: num(l, /MB\s+([\d.]+) MB/), ms: num(l, /([\d.]+) ms/), s: num(l, /ms\s+([\d,]+)$/) }; });
const BIG = CARD[2];
const SVC = readFileSync('/Users/admin/Downloads/api-backend/src/services/sentry.service.ts', 'utf8').split('\n');
const iRoute = SVC.findIndex((l) => l.includes('const route = (req.route?.path'));

export const slides = lamDeck({ chuong: 'Chapter 15 — Logging and observability', bai: '15.4' }, [
  { cover: true, t: 'Metrics,<br>and the label that ate the memory', sub: 'A counter incremented ten million times costs the same eight bytes as one incremented twice. That is why metrics are the only affordable way to watch a system — and why one careless label destroys it.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The four instrument types — and the one not to use</li>
<li>A working /metrics in fifteen lines, and how to read what comes out</li>
<li>RED: three metrics that cover most of "is the API healthy?"</li>
<li>The expensive mistake: one label, measured from 9.8 KB to ${f(Math.round(BIG.r1 / 1024 * 10) / 10)} GB of RAM</li>
<li>What collectDefaultMetrics gives for free, and how to protect the endpoint</li>
</ul>` + box('Why it matters to you', 'Logs tell the story of one request. Metrics watch ALL of them, continuously, at a fixed price — as long as you respect one rule.', 'lam') },

  { t: 'An everyday picture: odometer vs travel diary', to: true, giua: true, body: two(box('🚗 The odometer — a metric', 'One number that only goes up. Drive a thousand kilometres or ten: it still takes the same few digits. Cheap to keep forever.', 'xanh'),
    box('📓 The travel diary — a log', 'Every trip written down: where, when, with whom. Rich, searchable — and it grows with every trip.', 'lam')) +
    cards([['Metric', '"How many, how fast?" — fixed price, kept for months'], ['Log', '"What happened to THIS one?" — price grows with traffic'], ['The catch', 'Put a passenger\'s name on the odometer and it becomes a diary — with an odometer\'s storage plan']], 3) + box('This lesson in one sentence', 'Metrics are cheap because they forget WHO; the moment you make them remember who, they stop being cheap.', 'cam') },

  { t: 'The four instrument types', to: true, giua: true, body: cards([
    ['Counter', 'Only goes UP. Total requests, total errors, bytes sent. Ask for the speed with <code class="i">rate()</code>.'],
    ['Gauge', 'Moves freely. Open connections, queue length, memory in use.'],
    ['Histogram', 'Counts observations into predefined buckets. This is where p50 / p95 / p99 come from.'],
    ['Summary', 'Computes percentiles INSIDE the process. Avoid it: it cannot be added up across containers.'],
  ], 2) + box('Prometheus + prom-client', 'Prometheus is the de-facto standard; prom-client implements it for Node. (Installing prom-client 15.1.3 today prints "deprecated: replaced by @prometheus-io/client" — the API in this lesson is the same idea in either.)', 'lam') },

  { t: 'Counter vs Gauge matters more than it looks', to: true, giua: true, body: two(box('A counter never lies about resets', 'It only resets when the process restarts, and Prometheus detects that reset and corrects for it.', 'xanh'),
    box('A hand-managed gauge drifts', 'inc() on start, dec() on finish… until an error path skips the dec(). Then it is wrong — silently, forever — because nothing recomputes it.', 'do2')) +
    J(`// ✗ drifts the first time an error path skips dec()
active.inc(); await work(); active.dec();
// ✓ count events with counters, derive the rest
started.inc(); try { await work(); } finally { finished.inc(); }`, { sm: false, hl: [2, 4] }) +
    cards([['in flight = started − finished', 'Computed by Prometheus from two counters, so it can never drift.'], ['Gauges that are fine', 'Values you READ from the system each time: memory in use, queue length, pool.waitingCount.']], 2) },

  { t: 'A working /metrics in fifteen lines', to: true, giua: true, body: J(`const reg = new client.Registry();
client.collectDefaultMetrics({ register: reg });      // CPU, RAM, event loop, GC
const httpTotal = new client.Counter({ name: 'http_requests_total', help: 'Total requests',
  labelNames: ['method', 'route', 'status'], registers: [reg] });
const httpDur = new client.Histogram({ name: 'http_request_duration_seconds', help: 'Handling time',
  labelNames: ['method', 'route', 'status'], buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5], registers: [reg] });
app.use((req, res, next) => {
  const end = httpDur.startTimer();
  res.on('finish', () => {
    const route = req.route ? req.baseUrl + req.route.path : 'unknown';
    const labels = { method: req.method, route, status: String(res.statusCode) };
    httpTotal.inc(labels); end(labels);
  });
  next();
});
app.get('/metrics', async (req, res) => { res.set('Content-Type', reg.contentType); res.end(await reg.metrics()); });`.split('\n').map((l) => l.replace('buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5], ', 'buckets: [.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5],\n  ')).join('\n'), { sm: true, hl: [11] }) +
    box('The single most important line', '<code class="i">req.baseUrl + req.route.path</code> → <b>/notes/:id</b>, the route TEMPLATE — not /notes/1842. Read inside res.on(\'finish\'), after routing. The rest of the lesson: what happens when it is wrong.', 'cam') },

  { t: 'Reading what comes out: a histogram is counters', to: true, giua: true, body: TT('c15/metrics', 9, 15, 'curl /metrics after 300 requests to /notes/:id · prom-client 15.1.3 · real', { hl: [1, 2], n: 104, sm: false }) +
    cards([['Each bucket counts "at most this long"', `${num(R('metrics', /le="0\.005"/), /\} (\d+)/)} requests took ≤ 5 ms, ${num(R('metrics', /le="0\.01"/), /\} (\d+)/)} took ≤ 10 ms, all 300 took ≤ 25 ms. Cumulative.`], ['sum and count', 'Total seconds and total requests — the average is sum ÷ count.'], ['No percentile in the output', 'p95 is computed LATER, by Prometheus, from these counters.']], 3) },

  { t: 'Two consequences of buckets', to: true, giua: true, body: two(box('A percentile is only as precise as your edges', 'With these buckets, any p95 between 10 ms and 25 ms is an interpolated guess. Prometheus cannot see inside a bucket.', 'cam'),
    box('Buckets ADD UP across containers', 'Three replicas\' bucket counters sum into one correct global p95. A Summary cannot do that — the whole reason to avoid it.', 'xanh')) +
    flow([{ t: 'container A', s: 'le=0.01 → 297', mau: LAM }, { t: 'container B', s: 'le=0.01 → 310', mau: LAM }, { t: 'container C', s: 'le=0.01 → 288', mau: LAM }, { t: 'sum()', s: 'one global histogram', mau: NODE }], { h: 120 }) +
    box('Choosing bucket edges', 'Put edges where you make decisions. If your SLO is "95% under 300 ms", you need an edge at exactly 0.3 — or you cannot measure your own SLO.', 'lam') },

  { t: 'RED: three metrics that cover most of it', giua: true, body: cards([
    ['R — Rate', '<code class="i">rate(http_requests_total[5m])</code><br>requests per second. A sudden DROP means something upstream is blocking.'],
    ['E — Errors', '<code class="i">rate(http_requests_total{status=~"5.."}[5m])</code><br>the failure rate — the metric most worth alerting on.'],
    ['D — Duration', '<code class="i">histogram_quantile(0.95, …)</code><br>how slow. A gradual rise is often the earliest sign of an incident.'],
  ], 1) + box('One middleware, every route', 'Three metrics answer "is the API healthy right now?" for every route. Everything past this is refinement.', 'xanh') },

  { t: 'Where these numbers come from', to: true, giua: true, body: flow([{ t: 'your app', s: '/metrics (text)', mau: NODE }, { t: 'Prometheus', s: 'scrapes every 15 s', mau: CAM }, { t: 'time series DB', s: 'one series per label set', mau: LAM }, { t: 'Grafana / alerts', s: 'rate(), quantile()', mau: TIM }], { h: 140 }) +
    cards([['Pull, not push', 'Prometheus asks your app every 15 seconds; your app only keeps counters in memory.'], ['A series', 'One metric name + one exact combination of label values = one time series, stored forever.'], ['The price', 'Fixed by the NUMBER of series — not by traffic. Remember this sentence.']], 3) + box('So the bill is decided when you DESIGN the labels', 'Not when traffic grows. Part 2 measures what one bad design decision costs.', 'cam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'what it is', 'the rule'], [
    ['Counter', 'only increases', 'use rate() for speed'],
    ['Gauge', 'goes up and down', 'never hand-managed with inc/dec pairs'],
    ['Histogram', 'cumulative bucket counters', 'edges at your SLO; adds up across containers'],
    ['Summary', 'percentiles inside the process', 'avoid'],
    ['RED', 'rate · errors · duration', 'one middleware, every route'],
    ['route label', 'req.baseUrl + req.route.path, on finish', 'the template, never the raw URL'],
  ], { co: 21 }) + box('Next: the expensive mistake', 'Everything above assumed label values come from a small, fixed set. Break that assumption and watch.', 'lam') },

  // ───────────── part 2 ─────────────
  { t: 'The deal that makes metrics cheap', to: true, giua: true, body: flow([{ t: '4 methods', s: 'GET POST PUT DELETE', mau: LAM }, { t: '× 20 routes', s: 'templates', mau: LAM }, { t: '× 6 statuses', s: '200 201 400 401 404 500', mau: LAM }, { t: '= 480 series', s: 'forever, any traffic', mau: NODE }], { h: 140 }) +
    two(box('One series per combination of label values', 'Prometheus stores an independent time series for every distinct combination. 480 here — whether you serve 10 requests or 10 million.', 'xanh'),
      box('The assumption', 'Every label value comes from a small, FIXED set. That single assumption is the whole deal.', 'cam')) +
    box('Like the odometer', 'Ten requests or ten million: the same 480 numbers, incremented in place.', 'lam') },

  { t: 'Break the assumption: 300 requests, three labellings', to: true, giua: true, body: TT('c15/metrics', 2, 6, 'node metrics.mjs · GET /notes/1 … /notes/300 · real', { hl: [3, 4], n: 104, sm: false }) +
    thanh([['route template', TP.b, NODE, `${f(TP.b)} B`], ['raw URL', RAW.b, DO, `${f(RAW.b)} B (${Math.round(RAW.b / TP.b)}×)`], ['+ user_id label', USR.b, CAM, `${f(USR.b)} B`]], { w: 1100, x0: 250, wMax: 560, h0: 54, chu: 22, ghi: '/metrics size after 300 requests · real' }) },

  { t: 'The histogram is the amplifier', to: true, giua: true, body: cards([
    [`${Math.round(RAW.b / TP.b)}× bigger — traffic unchanged`, `${f(TP.b)} B → ${f(RAW.b)} B. Only the NUMBER of distinct label values changed.`],
    ['×14 per value', 'Each new route value creates 1 counter series + 11 bucket series (10 edges + +Inf) + sum + count.'],
    [`${f(RAW.all)} series from 300 URLs`, `vs ${f(TP.all)} with the template. The user_id label (counter only) still made ${f(USR.tot)} counter series.`],
  ], 3) + box('So one careless id multiplies by fourteen', 'And it never goes away: series are not garbage-collected while the process lives.', 'do2') +
    flow([{ t: '1 new URL', s: '/notes/301', mau: DO }, { t: '+1 counter', s: 'http_requests_total', mau: CAM }, { t: '+11 buckets', s: 'le=…', mau: CAM }, { t: '+sum +count', s: '= 14 series', mau: DO }], { h: 120 }) },

  { t: 'How bad does it get? Measured at three scales', to: true, giua: true, body: TT('c15/cardinality', 2, 5, 'node cardinality.mjs · counter + histogram labelled by user id · fresh process per row · real', { hl: [4], n: 104, sm: false }) +
    thanh(CARD.map((c) => [`${f(c.n)} users`, c.r1, c.n === 100000 ? DO : c.n === 10000 ? CAM : LAM, `RSS ${f(c.r1)} MB · /metrics ${c.mb} MB`]), { w: 1100, x0: 210, wMax: 560, h0: 56, chu: 22, ghi: 'process memory holding the series · real' }) + box('Linear in the number of DISTINCT values', '×10 users ⇒ ×10 series ⇒ roughly ×10 memory and ×10 scrape time. Traffic did not change at all.', 'do2') },

  { t: 'Read the bottom row as an incident report', to: true, giua: true, body: cards([
    [`${f(BIG.r1)} MB of RAM`, 'On a 6 GB VPS that is a quarter of the machine — and it never shrinks while the process lives.'],
    [`${BIG.mb} MB per scrape`, `Every 15 s: about ${(BIG.mb / 15).toFixed(1)} MB/s of traffic just to describe yourself.`],
    [`${f(BIG.ms)} ms of blocked event loop`, `Each scrape builds that text on the main thread: ~${Math.round(BIG.ms / 150)}% of your time spent on /metrics instead of serving anyone.`],
  ], 3) + flow([{ t: 'scrape slows down', s: `${f(BIG.ms)} ms`, mau: CAM }, { t: 'scrape times out', s: 'Prometheus gives up', mau: DO }, { t: 'target "down"', s: 'alert fires', mau: DO }, { t: 'you are paged', s: 'for an outage monitoring caused', mau: DO }], { h: 120 }) + box('The web lesson measured 939 MB on its machine', `Here ${f(BIG.r1)} MB: different allocator, same order of magnitude, same incident.`, 'lam') },

  { t: 'The rule, stated so it is hard to get wrong', to: true, giua: true, body: two(box('✓ Writable on paper', 'method · route template · status code · environment · region', 'xanh'), box('✗ Unbounded — forbidden as labels', 'user id · request id · email · note id · session id · raw URL · SQL text · error message', 'do2')) +
    box('A label value must come from a set you could write down on paper', '', 'cam') +
    box('The real trap: error_message', 'It looks bounded — "we only have a few kinds of error" — until one message interpolates a value: "note 8412 not found". Now there is one series per note id, created by a rare error path, growing slowly, found months later during an out-of-memory incident.', 'do2') +
    J(`// ✗ "only a few kinds of error"
errors.inc({ message: err.message });   // "note 8412 not found" → a new series
// ✓ a bounded code
errors.inc({ code: err.code ?? 'UNKNOWN' });`, { sm: false, hl: [2, 4] }) },

  { t: 'Where the unbounded things belong', to: true, giua: true, body: steps([
    '<b>How many, and how fast?</b> → METRIC: bounded labels, fixed price, kept for months',
    '<b>Which one is slow, and where?</b> → TRACE: carries request id and user id, sampled to keep the price bearable (lesson 15.5)',
    '<b>What happened to THIS user?</b> → LOG: arbitrary fields, searched with grep, kept briefly (lessons 15.1–15.3)',
  ]) + two(box('"How many users hit the error?"', 'A metric question. Cheap.', 'xanh'), box('"WHICH users hit the error?"', 'A log question. They sound alike and have wildly different prices.', 'lam')) +
    box('Traces have no cardinality limit', 'A span is stored once and thrown away — user.id and request.id are fine as span attributes (lesson 15.5).', 'cam') },

  { t: 'collectDefaultMetrics: free numbers that explain incidents', to: true, giua: true, body: TT('c15/metrics', 18, 23, 'collectDefaultMetrics: 27 metric names from one line · the same process · real', { n: 104, sm: true, hl: [1] }) +
    bang(['metric', 'what it tells you'], [['eventloop_lag_p99', 'THE Node metric: rising = something is BLOCKING. Alert above 100 ms'], ['heap_size_used', 'a leak shows hours before the OOM kill (16.5)'], ['gc_duration', 'latency spikes the code cannot explain'], ['process_cpu_seconds', 'CPU-bound or I/O-bound, in one graph'], ['active_handles', 'sockets/timers never closed: steady rise = resource leak']], { co: 19 }) },

  { t: 'Protecting the endpoint', to: true, giua: true, body: two(J(`const app = express();      // public (nginx → here)
const metrics = express();  // internal only
metrics.get('/metrics', …);
app.listen(4950);
metrics.listen(4956, '127.0.0.1');`, { sm: true, hl: [5] }), TT('c15/metrics-port', 2, 3, 'node metrics-port.mjs · real', { n: 48, sm: true })) +
    cards([['1 · A second port', 'Bound to the private network only. Prometheus reaches it; the internet cannot.'], ['2 · Block it at nginx', 'Deny /metrics for non-internal IPs if it must share the main app.'], ['3 · A bearer token', 'The last resort.']], 3) +
    box('Why bother', 'Route names, error rates, memory, versions: /metrics maps your entire attack surface.', 'do2') },

  { t: 'What this website does', to: true, giua: true, body: two(TT('c15/prod-headers', 7, 10, 'cuongthai.com /api/v1/metrics, /metrics · real', { n: 60, sm: true }),
      box('No /metrics at all', 'No Prometheus, no RED view: incidents are noticed by a person, diagnosed from docker logs; Sentry covers the "errors" third. Adding prom-client is the single highest-value upgrade here.', 'lam')) +
    two(JW(SVC.slice(iRoute, iRoute + 4).map((l) => l.trim()).join('\n'), 52, [1], { sm: true }), TT('c15/sentry-tag', 2, 5, 'replica, mounted before the routes · real', { sm: true, n: 52, hl: [1, 3] })) +
    box('Found while preparing this lesson', 'The Sentry middleware means to tag the route TEMPLATE but runs before routing: req.route is empty, the tag is the raw URL. Read on res "finish" it is /api/v1/courses/:id.', 'do2') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Notes API adds prom-client. (1) A teammate labels http_requests_total with <code class="i">req.originalUrl</code>. With this lesson\'s numbers, what happens after a week of traffic over 50,000 notes? (2) Rewrite the label. (3) Product asks "which users hit the 500s yesterday?" — metric, trace or log? (4) Where should /metrics listen?', '') +
    box('Hint', 'Slides 13–17 and 20.', 'lam') +
    `<div data-k="dapan">${box('Answer', `(1) One counter + 13 histogram series per distinct URL: ~50,000 × 14 = 700,000 series — the measured 100,000-label row used ${f(BIG.r1)} MB and ${f(BIG.ms)} ms per scrape, so expect hundreds of MB and scrapes timing out. (2) <code class="i">req.baseUrl + req.route.path</code> read on res 'finish' (e.g. /notes/:id). (3) A log question (or a trace) — never a metric label. (4) On a second port bound to the private network (or blocked at nginx).`, 'xanh')}</div>` },

  { t: 'Lesson 15.4 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['300 requests, route template', `${TP.all} series · ${f(TP.b)} B`, 'labels from a fixed set'],
    ['300 requests, raw URL', `${f(RAW.all)} series · ${f(RAW.b)} B`, 'never an unbounded value'],
    ['100,000 user ids', `${f(BIG.r1)} MB RAM · ${BIG.mb} MB · ${f(BIG.ms)} ms/scrape`, 'ids belong in traces and logs'],
    ['collectDefaultMetrics', '27 metric names, one line', 'alert on event-loop lag p99'],
    ['/metrics on a second port', 'public 404 · private 200', 'never on the public internet'],
  ], { co: 22 }) + box('Next: 15.5 — tracing: where the time actually went', 'A metric says p95 rose. A trace shows which part of those milliseconds went where.', 'lam') },
]);
