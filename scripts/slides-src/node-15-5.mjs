/**
 * node-15-5 — Node.js · Chapter 15 · Lesson 15.5 "Tracing: where the time actually went" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-15-5 (slide 1–12: từ vựng, bật lên, bẫy phiên bản 3.x, bẫy nạp muộn, cây một request, N+1, pool lạnh, vòng điều tra) ·
 *   node-15-5-2 (slide 13–23: nối log ↔ trace, hoá đơn, lấy mẫu, span thủ công, bẫy cây phẳng, đo gì trước, website, bài tập, tóm tắt).
 * Nguồn: nodejs-15-5-opentelemetry-trace. Output THẬT: that/c15/{otel-tree,otel-log,otel-cost,otel-size,otel-traps} (Node 22.23.3, @opentelemetry/sdk-node 0.301.0,
 *   sdk-trace 3.1.0, auto-instrumentations-node 0.83.0, express 5.3.0, pg 8.23.1, PostgreSQL 17.11 trong Docker node15-pg 127.0.0.1:4951 — đã gỡ).
 * BỔ SUNG ngoài bài web: bẫy phiên bản OpenTelemetry 3.x — `spanProcessor` (số ít) bị bỏ qua, `new BatchSpanProcessor(exporter)` (đối số vị trí) ra 0 span,
 *   `@opentelemetry/sdk-trace-base` 2.x xung đột peer với api 1.10 (npm ERESOLVE) — đo thật.
 * Khác web: OTel −17,6 % req/s (web −39,6 %), RSS +80 MB (web +62) · node_modules 6,9 → 74 MB, 76 gói @opentelemetry (web 17 → 89 MB, 80 gói) ·
 *   lấy mẫu 0,01: 73× ít span, +3,4 % req/s (web 111×, +3,6 %) · cây: 33 span, pool lạnh 14,93 ms (web 32 span, 27,31 ms).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, T, TT, G, thanh, dong, steps, cot } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-15-5', code: 'NODE 15.5', title: 'Tracing: where the time actually went', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c15/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const f = (n) => n.toLocaleString('en-US');
const TR = ra('c15/otel-tree').split('\n');
const i1 = TR.findIndex((l) => l.startsWith('FIRST')), i2 = TR.findIndex((l) => l.startsWith('SECOND'));
const T1 = TR.slice(i1 + 1, i2).filter((l) => l.trim()), T2 = TR.slice(i2 + 1).filter((l) => l.trim() && !l.startsWith('exit'));
const N1 = num(TR[i1], /: (\d+) spans/), Q1 = num(TR[i1], /(\d+) pg\.query/), N2 = num(TR[i2], /: (\d+) spans/);
const ms = (l) => Number(l.match(/([\d.]+) ms$/)[1]);
const qs = T1.filter((l) => l.includes('pg.query')).map(ms);
const POOL1 = ms(T1.find((l) => l.includes('pg-pool.connect'))), POOL2 = ms(T2.find((l) => l.includes('pg-pool.connect')));
const TOP1 = ms(T1.find((l) => /^GET/.test(l))), TOP2 = ms(T2.find((l) => /^GET/.test(l)));
const firstQ = T1.findIndex((l) => l.includes('pg.query'));
const TREE0 = [...T1.filter((l) => /^GET|└─/.test(l)).slice(0, T1.filter((l) => /^GET|└─/.test(l)).findIndex((l) => l.includes('pg.query')) + 1),
  `        └─ … ${Q1 - 1} more pg.query (${Math.min(...qs.slice(1)).toFixed(2)}–${Math.max(...qs.slice(1)).toFixed(2)} ms)`].join('\n');
const TREE = TREE0.split('\n').map((l) => l.replace(/\s{3,}(?=[\d.]+ ms$)/, '  ')).join('\n');   // only the padding before the duration is shortened
const OC = (re) => { const l = R('otel-cost', re); return { rps: num(l, /\s([\d,]{4,})\s/), p975: num(l, /ms\s+(\d+)ms\s+\d+ms\s/), spans: num(l, /ms\s+([\d,]+)\s+\d+ MB/), rss: num(l, /(\d+) MB$/) }; };
const O0 = OC(/^no OpenTelemetry/), O1 = OC(/^sampler = 1\.0/), O01 = OC(/^sampler = 0\.1 /), O001 = OC(/^sampler = 0\.01/);
const LOSS = num(R('otel-cost', /^OpenTelemetry at 1\.0/), /([\d.]+)% fewer/);
const SZ = ra('c15/otel-size').split('\n');
const nmA = SZ.find((l) => !l.startsWith('$') && l.includes('size-a/node_modules')).trim().split(/\s+/)[0].replace('M', ' MB'), nmB = SZ.find((l) => !l.startsWith('$') && l.includes('size-b/node_modules')).trim().split(/\s+/)[0].replace('M', ' MB');
const NOTEL = Number(SZ[SZ.findIndex((l) => l.includes('wc -l')) + 1].trim());

export const slides = lamDeck({ chuong: 'Chapter 15 — Logging and observability', bai: '15.5' }, [
  { cover: true, t: 'Tracing:<br>where the time actually went', sub: 'A metric says p95 is 400 ms. A log says one request took 8 seconds. Neither says which part of those milliseconds went where — a trace does, as a tree.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The vocabulary — five words, and it is short</li>
<li>Turning OpenTelemetry on — and three silent traps, measured on today's 3.x packages</li>
<li>Reading one request's tree: N+1 and a cold pool, visible by SHAPE</li>
<li>Linking a log line to its trace in six lines</li>
<li>The bill (throughput, memory, disk) — and why sampling does not fix it</li>
</ul>` + box('Why it matters to you', 'Without "where did the time go", optimising is guessing. Chapter 16 starts from exactly this question.', 'lam') },

  { t: 'An everyday picture: a trip with a timed itinerary', to: true, giua: true, body: two(box('"The trip took 3 hours" — a metric', 'True, and useless for fixing it.', 'lam'), box('A timed itinerary — a trace', 'Drive 40 min · wait at the ferry 90 min · drive 30 min · park 20 min. Now you know: the ferry.', 'xanh')) +
    flow([{ t: 'whole request', s: '41.8 ms', mau: LAM }, { t: 'route handler', s: '30.0 ms', mau: NODE }, { t: 'service', s: '27.5 ms', mau: TIM }, { t: 'pool + 12 queries', s: 'where it went', mau: DO }], { h: 120 }) +
    box('A trace is a tree of timed intervals', 'One per unit of work, rebuilt for a single request across every function — and every service — it touched.', 'cam') },

  { t: 'The vocabulary, which is short', to: true, giua: true, body: cards([
    ['Span', 'A named interval of time: "pg query", "external API call", "route handling". Start, end, attributes.'],
    ['Trace', 'The whole span tree of ONE request, held together by a shared trace_id.'],
    ['Parent / child', 'A child span nested in a parent. This is what makes it a tree, not a list.'],
    ['Context propagation', 'Carries the trace_id into another process via a <code class="i">traceparent</code> header — the cross-service AsyncLocalStorage of 15.2.'],
    ['Sampler', 'Decides which traces get RECORDED. The price lever.'],
    ['OpenTelemetry', 'The vendor-neutral standard: the same code exports to Jaeger, Tempo, Datadog, Honeycomb or a file.'],
  ], 3) + box('Why vendor-neutral matters', 'The instrumentation you write is not tied to one monitoring company: switching backends is a config change, not a rewrite.', 'lam') },

  { t: 'Turning it on (OpenTelemetry 3.x)', to: true, giua: true, body: J(`// MUST run before any other import — or the libraries are already loaded, unpatched
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({ 'service.name': 'notes-api' }),
  spanProcessors: [new BatchSpanProcessor({ exporter })],     // 3.x: an ARRAY, options OBJECT
  instrumentations: [getNodeAutoInstrumentations({ '@opentelemetry/instrumentation-fs': { enabled: false } })],
});
sdk.start();
const { default: express } = await import('express');           // import the app only AFTER this line`, { sm: true, hl: [9, 13] }) +
    box('Auto-instrumentation', 'Monkey-patches libraries you already use — http, express, pg, ioredis and about forty more — without touching your route code.', 'xanh') },

  { t: 'Trap 1: the 3.x packages changed shape — silently', to: true, giua: true, body: T(G('c15/otel-traps', 3, 3, 104) + '\n' + G('c15/otel-traps', 5, 5, 104), 'node otel-traps.mjs · @opentelemetry/sdk-node 0.301.0 + sdk-trace 3.1.0 · real', { sm: false }) +
    cards([['spanProcessor (singular)', 'Many guides — and older versions — use it. sdk-node 0.301 ignores it: no error, zero spans.'], ['new BatchSpanProcessor(exporter)', 'The 1.x / 2.x form. In 3.x the constructor takes { exporter }: zero spans, no warning.'], ['sdk-trace-base@2 + api 1.10', 'Mixing the 2.x package with today\'s sdk-node fails at install: npm ERESOLVE, peer conflict.']], 3) +
    box('The rule', 'Pin the versions you copied the example from, or use the current names: <code class="i">@opentelemetry/sdk-trace</code>, <code class="i">spanProcessors: [ … ]</code>, <code class="i">{ exporter }</code>.', 'cam') },

  { t: 'Trap 2: start the SDK late, get an empty tree', to: true, giua: true, body: TT('c15/otel-traps', 2, 2, 'node otel-traps.mjs · [1] express + pg imported BEFORE sdk.start() · real', { n: 100, sm: false }) +
    two(box('Nothing left to patch', 'If express or pg were imported before sdk.start(), those modules are already bound. No error, no warning — just a tree with no express and no pg spans.', 'do2'),
      box('Two fixes', 'A top-level <code class="i">await import()</code> after sdk.start() (previous slide), or start the SDK from its own file: <code class="i">node --import ./tracing.mjs app.js</code>.', 'xanh')) +
    box('Why it is so common', 'ES module imports are hoisted: every static import at the top of the file runs BEFORE line 1 of your code — including before sdk.start().', 'cam') },

  { t: 'What one request looks like', to: true, giua: true, body: two(T(TREE, `GET /notes/:author · first request · ${N1} spans, ${Q1} pg.query · trimmed · real`, { sm: true, hl: [9, 10] }),
    cot(box(`${Q1} pg.query under one request`, 'Nobody wrote code to detect it — the SHAPE of the tree is the diagnosis: chapter 7\'s N+1.', 'do2'),
      box(`No single query is slow`, `The worst is ${Math.max(...qs).toFixed(2)} ms. A "slow query log" at 100 ms would report nothing. The problem is the COUNT — and count is a shape you see in a tree, not in a list.`, 'cam')), 'r64') },

  { t: 'The other thing the tree gives away: a cold pool', to: true, giua: true, body: two(T(T1.filter((l) => /pg-pool|pg\.connect|dns|tcp/.test(l) && l.startsWith(' ')).slice(0, 4).join('\n'), 'first request · real', { sm: false }),
    T(T2.filter((l) => /^GET|request handler|pg-pool/.test(l)).slice(0, 3).join('\n'), 'second request · real', { sm: false })) +
    thanh([['pool connect, 1st request', POOL1, DO, `${POOL1} ms (DNS + TCP + login)`], ['pool connect, 2nd request', POOL2, NODE, `${POOL2} ms`], ['whole request, 1st', TOP1, CAM, `${TOP1} ms`], ['whole request, 2nd', TOP2, LAM, `${TOP2} ms`]], { w: 1100, x0: 330, wMax: 480, h0: 50, chu: 21, ghi: 'from the two trees · real' }) +
    box('Chapter 7\'s cold-pool tax — proved, not assumed', 'A distinct block instead of being smeared across the total. On the next request it is gone.', 'xanh') },

  { t: 'The investigation loop', to: true, giua: true, body: steps([
    '<b>A metric alerts</b> — /feed p95 rose from 120 ms to 900 ms at 14:05',
    '<b>Open the slow traces in that window</b> — filter by route and duration > 500 ms, take a handful',
    '<b>Read the tree\'s SHAPE</b> — one long span, or twenty short ones? Two completely different diseases',
    '<b>Take the trace_id → grep the logs</b> — that exact request\'s lines tell you the PARAMETERS',
    '<b>Fix it, then confirm with the metric from step 1</b> — if p95 does not fall, you fixed the wrong thing',
  ]) + box('Three pillars, one loop', 'Metric (that) → trace (where) → log (what) → metric again (did it work).', 'lam') },

  { t: 'Shapes worth recognising', to: true, giua: true, body: cards([
    ['Many short identical children', 'N+1. Batch them: one query with = ANY($1), or an include (chapter 7).'],
    ['One long child', 'One slow thing: a missing index, a slow external API, a lock.'],
    ['A gap with no child', 'Time spent in YOUR code: CPU work, JSON, a blocking call — profile it (16.1).'],
    ['A long connect at the top', 'Cold pool, DNS, TLS handshake — warm up, reuse connections (16.3).'],
  ], 2) + box('You can only see these as a tree', 'A list of the same spans, sorted by time, hides every one of these shapes.', 'cam') + box('Lesson 15.5 uses the first shape; chapter 16 uses all four', 'Each shape points to a different fix — and to a different lesson.', 'lam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['3.x spanProcessor / positional exporter', '0 spans, no error', 'use spanProcessors: [ … { exporter } ]'],
    ['SDK started after imports', 'no express, no pg spans', 'start it first (--import or await import)'],
    ['one GET /notes/:author', `${N1} spans, ${Q1} pg.query`, 'the shape is the diagnosis (N+1)'],
    ['worst single query', `${Math.max(...qs).toFixed(2)} ms`, 'slow-query logs miss "many fast"'],
    ['pool connect, cold vs warm', `${POOL1} vs ${POOL2} ms`, 'prove the cold-pool tax'],
  ], { co: 22 }) + box('Next: link logs to traces, and pay the bill', 'Step 4 of the loop needs a log line that names its trace. Then: what does all this cost?', 'lam') },

  // ───────────── part 2 ─────────────
  { t: 'Connecting logs to traces: six lines', giua: true, body: J(`const logger = pino({
  mixin() {                        // runs on EVERY line
    const span = trace.getSpan(context.active());
    if (!span) return {};
    const c = span.spanContext();
    return { trace_id: c.traceId, span_id: c.spanId };
  },
});`, { sm: true, hl: [2, 6] }) + TT('c15/otel-log', 2, 9, 'node otel-log.mjs · two log lines, then the spans of the same trace · real', { sm: true, n: 100, hl: [2, 3, 7] }) +
    box('Same span_id', 'Both log lines carry the span_id of the "request handler - /notes" span: jump from a line to its trace, and back.', 'xanh') },

  { t: 'Why that link is worth the most', to: true, giua: true, body: flow([{ t: 'error in a log line', s: 'trace_id=da3c…', mau: DO }, { t: 'open the trace', s: 'the whole tree', mau: TIM }, { t: 'click a span', s: 'span_id=3d6c…', mau: LAM }, { t: 'its log lines', s: 'parameters, user', mau: NODE }], { h: 130 }) +
    cards([['Without it', 'You match timestamps by hand between two tools, and guess.'], ['With it', 'One click each way. The single highest-value thing in this chapter.'], ['The cost', 'Six lines of pino config — and the request id of 15.2 becomes the trace id.']], 3) + box('Lesson 15.2, one level up', 'The request id joined lines of ONE process. trace_id joins lines, spans and services of the whole system — and travels between services in the traceparent header.', 'lam') },

  { t: 'Now the bill', to: true, giua: true, body: TT('c15/otel-cost', 2, 7, 'node otel-cost.mjs · Express + pg, one route, one query · autocannon -c 20 -d 6 · median of 5 · real', { hl: [3, 4], n: 112, sm: false }) +
    cards([[`−${LOSS}% throughput`, `${f(O0.rps)} → ${f(O1.rps)} req/s, p97.5 ${O0.p975} → ${O1.p975} ms. The web lesson measured −39.6% on its machine.`], [`+${O1.rss - O0.rss} MB of memory`, `RSS ${O0.rss} → ${O1.rss} MB, for the SDK and its instrumentation.`], [`node_modules ${nmA} → ${nmB}`, `${NOTEL} @opentelemetry packages in a project of 3 direct dependencies: image size, cold start, supply chain (chapter 4).`]], 3) },

  { t: 'Does sampling fix it? Measure.', to: true, giua: true, body: thanh([['no SDK', O0.rps, LAM, `${f(O0.rps)} req/s`], ['sampler 1.0', O1.rps, DO, `${f(O1.rps)} · ${f(O1.spans)} spans`], ['sampler 0.1', O01.rps, CAM, `${f(O01.rps)} · ${f(O01.spans)} spans`], ['sampler 0.01', O001.rps, CAM, `${f(O001.rps)} · ${f(O001.spans)} spans`]], { w: 1100, x0: 210, wMax: 560, h0: 54, chu: 22, ghi: 'requests per second and spans exported in 6 s · median of 5 · real' }) +
    two(box(`${Math.round(O1.spans / O001.spans)}× fewer spans, ~${((O001.rps / O1.rps - 1) * 100).toFixed(1)}% more throughput`, `And memory did not move: ${O1.rss} → ${O001.rss} MB. Sampling saves your bandwidth and your monitoring bill — not your CPU.`, 'cam'),
      box('Why', 'Every library call is still patched, context is still created and propagated, the sampler is still asked. Only recording and exporting are skipped — never the expensive part.', 'lam')) },

  { t: 'If the overhead hurts your p95', to: true, giua: true, body: cards([
    ['Instrument fewer libraries', 'Disable fs, dns, net; keep http and your database.'],
    ['Trace a subset of the fleet', 'A few containers with tracing, the rest without.'],
    ['Accept it', 'Knowing where the time goes is often worth a sixth — or two fifths — of one machine. More often right than people expect.'],
  ], 3) + box('Use ParentBasedSampler, always', 'A bare ratio sampler in each service decides independently: at 10% each, a request crossing three services is fully recorded 1 time in 1,000 — fragments, worse than nothing. ParentBased decides once at the entry and every service honours it.', 'do2') +
    J(`sampler: new ParentBasedSampler({ root: new TraceIdRatioBasedSampler(0.1) })`, { sm: false }) },

  { t: 'Manual spans: where auto-instrumentation stops', to: true, giua: true, body: J(`const span = tracer.startSpan('service.listNotes');
const out = await context.with(trace.setSpan(context.active(), span), async () => {
  const notes = await repo.find(authorId);
  span.setAttribute('notes.count', notes.length);     // an ATTRIBUTE, not a label
  return notes;
});
span.end();`, { sm: false, hl: [2, 4] }) +
    two(box('Auto-instrumentation traces I/O', 'It cannot see your business logic. Add spans by hand only where a NAME would help a future incident.', 'lam'),
      box('Attributes have no cardinality limit', 'notes.count, user.id, request.id are fine here: a span is stored once and thrown away, not a permanent series (15.4). Never secrets.', 'xanh')) +
    box('A trace store is no safer than a log store', 'Do not put a bearer token, a password or a cookie in an attribute.', 'do2') },

  { t: 'Trap 3: forget context.with — the tree comes out flat', to: true, giua: true, body: TT('c15/otel-traps', 4, 4, 'node otel-traps.mjs · [3] tracer.startSpan() alone · real', { n: 100, sm: false }) +
    vsd(`<p><code class="i">tracer.startSpan()</code> creates a span that is NOT active.</p><p>Every child created inside — including the auto-instrumented pg queries — attaches to the wrong parent.</p>`,
      `<p><code class="i">context.with(trace.setSpan(context.active(), span), fn)</code></p><p>makes it active for everything fn awaits, so the pg spans nest under service.listNotes.</p>`, '✗ startSpan only', '✓ startSpan + context.with') +
    box('Symptom', 'A trace with all the right spans and none of the nesting — exactly the nesting that was the point.', 'do2') },

  { t: 'What to instrument first, if you only do one thing', to: true, giua: true, body: cards([
    ['Inbound HTTP', 'Free with auto-instrumentation: the root of every tree.'],
    ['Database queries', 'Where most of the time lives — and where N+1 shows itself.'],
    ['Outbound HTTP', 'Third-party APIs: the #1 source of latency you do not control.'],
    ['Redis', 'Cache hits and misses become visible instead of inferred.'],
    ['Background jobs', 'Carry the trace_id of the request that enqueued the job (chapter 13).'],
  ], 3) + box('In that order', 'Each step covers more of "where did the time go" for less effort than the next.', 'lam') },

  { t: 'What this website does', to: true, giua: true, body: cards([
    ['No OpenTelemetry', 'Sentry performance monitoring is a partial substitute: transactions with a span tree for a sampled fraction of requests, covering HTTP and the database.'],
    ['No trace_id in log lines', 'So the log ↔ trace jump of slide 13 still needs a human matching timestamps.'],
    ['The route tag (15.4)', 'Set before routing, so it is the raw URL — worth fixing before relying on it to group transactions.'],
  ], 3) + steps(['Keep Sentry', 'Add prom-client first (15.4)', 'Reach for full OpenTelemetry when a SECOND service appears — the point where "where did the time go" stops being answerable any other way']) +
    box(`Given the measured −${LOSS}%`, 'That order is the pragmatic path for a single-container deployment.', 'cam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', '(1) Your trace for GET /feed shows 41 pg.query spans of ~0.6 ms under one request and a p95 of 300 ms. What is the disease and the fix? (2) You enable OpenTelemetry and your p95 doubles; a teammate proposes sampler 0.01. What will it change and what not? (3) Your trace tree is flat: all pg spans sit beside service.listNotes. What did the code forget?', '') +
    box('Hint', 'Slides 8, 16, 17 and 19.', 'lam') +
    `<div data-k="dapan">${box('Answer', `(1) N+1 — many fast identical queries, invisible to a slow-query log; batch them into one query (= ANY) or an include. (2) It cuts exported spans ~${Math.round(O1.spans / O001.spans)}× (bandwidth, bill) but barely the CPU (~${((O001.rps / O1.rps - 1) * 100).toFixed(1)}% here) and not the memory; instead instrument fewer libraries or trace a subset. (3) context.with(trace.setSpan(…), fn) around the work.`, 'xanh')}</div>` },

  { t: 'Lesson 15.5 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['the tree of one request', `${N1} spans, ${Q1} queries`, 'shape = diagnosis'],
    ['cold vs warm pool', `${POOL1} vs ${POOL2} ms`, 'see it as a block, prove it'],
    ['log ↔ trace', 'same span_id on both', 'six lines of mixin'],
    ['OpenTelemetry on', `−${LOSS}% req/s · +${O1.rss - O0.rss} MB · ${nmB} node_modules`, 'a real bill'],
    ['sampler 0.01', `${Math.round(O1.spans / O001.spans)}× fewer spans · same memory`, 'saves the bill, not the CPU'],
    ['3.x API traps', '0 spans, silently', 'spanProcessors: [ … { exporter } ]'],
  ], { co: 21 }) + box('Next: 15.6 — health checks, alerts, and being woken at 3 am', 'Where all this evidence meets a machine that acts on it automatically.', 'lam') },
]);
