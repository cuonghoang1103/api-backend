/**
 * node-15-6 — Node.js · Chapter 15 · Lesson 15.6 "Health checks, alerts, and being woken at 3 am" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, HAI tập: node-15-6 (slide 1–11: liveness vs readiness, dòng thác do liveness, timeout đo thật, cái gì thuộc check nào, readiness là tải) ·
 *   node-15-6-2 (slide 12–22: cảnh báo, bốn luật, cảnh báo đáng giá, bốn tín hiệu vàng, sự cố đầy đĩa, mức tối thiểu, website, bài tập, tóm tắt chương).
 * Nguồn: nodejs-15-6-health-check-canh-bao. Output THẬT: that/c15/{health,prod-headers} (Node 22.23.3, express 5.3.0, pg 8.23.1, PostgreSQL 17.11 Docker node15-pg;
 *   "database treo" = một TCP listener nhận kết nối rồi im lặng; prod-headers = GET công khai /api/v1/system/health).
 * BỔ SUNG ngoài bài web: healthcheck của container backend trong docker-compose.yml gọi /health (bản chi tiết, có truy vấn DB, không timeout) với timeout 5 s ·
 *   Docker thường chỉ đánh dấu unhealthy, KHÔNG tự khởi động lại (khác liveness của Kubernetes) · /api/v1/system/health trả {"success":true,"data":{"status":"ok",…}}.
 * Khác web: /live 21 ms, /ready-good 3 ms, /ready-timeout 809 ms (web 32 / 33 / 806 ms) — cùng kết luận.
 */
import { readFileSync } from 'node:fs';
import { lamDeck, two, box, cards, flow, bang, vsd, J, JW, T, TT, thanh, dong, steps, cot, gay } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-15-6', code: 'NODE 15.6', title: 'Health checks, alerts, and being woken at 3 am', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c15/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const H = (re) => num(R('health', re), /after\s+(\d+) ms/);
const LIVE = H(/^\/live/), RG = H(/^\/ready-good/), RT = H(/^\/ready-timeout/);
const IDX = readFileSync('/Users/admin/Downloads/api-backend/src/index.ts', 'utf8').split('\n');
const iL = IDX.findIndex((l) => l.startsWith("app.get('/health/live'")), iR = IDX.findIndex((l) => l.startsWith("app.get('/health/ready'"));
const PROBES = [...IDX.slice(iL, iL + 3), ...IDX.slice(iR, iR + 8)].join('\n');
const DC = readFileSync('/Users/admin/Downloads/api-backend/docker-compose.yml', 'utf8').split('\n');
const iH = DC.findIndex((l) => l.includes('localhost:3001/health'));
const HC = DC.slice(iH - 1, iH + 4).join('\n');

const thacSvg = `<svg data-k="thac" viewBox="0 0 1100 170" width="1100" height="170" font-family="Arial">
${[['DB hiccup', '30 s', CAM], ['liveness → DB', 'fails everywhere', DO], ['ALL containers', 'killed + restarted', DO], ['cold pools', 'reconnect storm', DO], ['DB stays down', '15-minute outage', DO]].map(([h, s, m], i) => `
<rect x="${6 + i * 220}" y="24" width="196" height="96" rx="14" fill="${m}14" stroke="${m}" stroke-width="2.5"/>
<text x="${104 + i * 220}" y="64" text-anchor="middle" font-size="21" font-weight="800" fill="${m}">${h}</text><text x="${104 + i * 220}" y="96" text-anchor="middle" font-size="17" fill="#444">${s}</text>
${i < 4 ? `<text x="${211 + i * 220}" y="80" text-anchor="middle" font-size="26" fill="${CAM}">→</text>` : ''}`).join('')}
<text x="550" y="160" text-anchor="middle" font-size="19" fill="${DO}" font-weight="700">the monitoring system turned a 30-second blip into a total outage</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 15 — Logging and observability', bai: '15.6' }, [
  { cover: true, t: 'Health checks, alerts,<br>and being woken at 3 am', sub: 'Two places where your evidence meets a machine that acts on it automatically: the probe that decides whether a container lives, and the alert that decides whether a human wakes up.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Liveness vs readiness — two questions that look like one</li>
<li>The cascade a wrong probe causes, and the timeout that prevents it (measured)</li>
<li>What belongs in each check — and why a readiness check can be load</li>
<li>Alerts that people still trust, and the four golden signals</li>
<li>The incident this project actually had, and the minimum worth building</li>
</ul>` + box('Why it matters to you', 'Both are easy to write — and easy to write in a way that makes outages worse. Chapter 17 deploys containers that rely on exactly these probes.', 'lam') + box('Where this sits', 'Lessons 15.1–15.5 built the ability to ANSWER questions. This lesson is where a machine acts on those answers — automatically, at 3 am.', 'cam') },

  { t: 'An everyday picture: two questions at the clinic', to: true, giua: true, body: two(box('"Are you alive?" — liveness', 'Pulse, breathing. If NO: emergency, restart the heart. It is about the patient alone — not about whether the pharmacy is open.', 'do2'),
    box('"Can you work today?" — readiness', 'Fever, the car broke, the office is closed. If NO: stay home today. Nobody restarts your heart for it.', 'xanh')) +
    cards([['Answer NO to liveness', 'the container is KILLED and restarted'], ['Answer NO to readiness', 'you are taken OUT of the load balancer — not killed'], ['Mix them up', 'and a pharmacy closing triggers CPR']], 3) + flow([{ t: 'probe asks', s: 'every 10 s', mau: LAM }, { t: 'liveness NO', s: '→ kill + restart', mau: DO }, { t: 'readiness NO', s: '→ no new traffic', mau: CAM }, { t: 'readiness YES', s: '→ back in rotation', mau: NODE }], { h: 120 }) },

  { t: 'Two different questions that look like one', to: true, giua: true, body: cards([
    ['Liveness — "are you alive?"', 'NO ⇒ the container is killed and restarted. It must ask about the PROCESS itself, nothing else.'],
    ['Readiness — "can you take work?"', 'NO ⇒ pulled out of the load balancer, NOT killed. It is allowed to check dependencies.'],
  ], 2) + J(`// liveness — touches nothing outside the process
app.get('/health/live', (req, res) => res.json({ status: 'ok' }));

// readiness — may check dependencies, and MUST have a timeout
app.get('/health/ready', async (req, res) => {
  try { await prisma.$queryRaw\`SELECT 1\`; res.json({ status: 'ready', database: 'ok' }); }
  catch { res.status(503).json({ status: 'not ready', database: 'error' }); }
});`, { sm: false, hl: [2, 6] }) },

  { t: 'The most expensive mistake: liveness checks the database', to: true, giua: true, body: thacSvg + two(box('How it unfolds', 'The DB has a 30-second hiccup. Every container fails liveness; the orchestrator kills them all. They restart with cold pools, caches and JIT, and hammer the recovering DB — which keeps it down.', 'do2'),
    box('The rule that prevents it', 'Liveness answers only: "is this process capable of responding at all?". Nothing else. Dependencies go in readiness.', 'xanh')) },

  { t: 'The timeout is not optional — measured', to: true, giua: true, body: TT('c15/health', 2, 5, 'node health.mjs · a TCP listener that ACCEPTS connections and never answers stands in for a stuck database · real', { hl: [3, 4], n: 112, sm: false }) +
    thanh([['/live', LIVE, NODE, `200 · ${LIVE} ms`], ['/ready (healthy DB)', RG, NODE, `200 · ${RG} ms`], ['/ready, timeout 800 ms', RT, CAM, `503 · ${RT} ms`], ['/ready, no timeout', 5000, DO, 'no answer in 5,000 ms → DEAD']], { w: 1100, x0: 300, wMax: 500, h0: 50, chu: 21, ghi: 'what the probe sees · real' }) },

  { t: 'Why "stuck" is worse than "down"', to: true, giua: true, body: cards([
    ['Down is easy', 'A refused connection fails instantly and cleanly.'],
    ['Stuck is the killer', 'Overloaded server, saturated pool, black-holed packets: it accepts and never answers.'],
    ['connectionTimeoutMillis: 0', 'The default in several clients = wait forever. The probe times out first.'],
  ], 3) + two(box('If that probe was LIVENESS', 'The container is killed for a database problem it had no part in — and could have partly served around.', 'do2'),
    box('One line fixes it', `<code class="i">connectionTimeoutMillis: 800</code> turns an infinite hang into a clean 503 in ${RT} ms — something an orchestrator can handle correctly.`, 'xanh')) +
    box('And for the probe itself', 'Its timeout must be shorter than its interval, or slow probes queue up and you measure the queue, not the app.', 'cam') },

  { t: 'What belongs in each check', to: true, giua: true, body: steps([
    '<b>/health/live</b> returns 200 unconditionally — it only fails when the process is wedged solid or dead',
    '<b>/health/ready</b> checks the DB and the cache, each with a short timeout — failing means removal from the load balancer, not a kill',
    '<b>/health</b> (detailed) — uptime, version, environment, each dependency: for HUMANS to read, not for probes',
    '<b>Keep probes out of the access log</b> — one probe every 10 s is 8,640 lines per container per day carrying no information',
  ]) + box('Two different audiences', 'Machines need a fast yes/no. People need the details. One endpoint cannot serve both well.', 'lam') },

  { t: 'A real trap: a readiness check is itself load', giua: true, body: flow([{ t: '6 containers', s: 'each with a ready probe', mau: LAM }, { t: '× 3 probes', s: 'LB, orchestrator, uptime', mau: LAM }, { t: 'every 10 s', s: 'each one', mau: LAM }, { t: '1 query / 0.56 s', s: 'forever', mau: DO }], { h: 130 }) +
    two(box('For information that rarely changes', 'Fine a second ago, fine a second from now — yet asked nearly twice a second, forever.', 'cam'),
      box('Cache the result — longer than the gap between probes', 'Each container gets a probe every ~3.3 s, so a 3 s cache never hits; 10 s gives 0.6 queries/s instead of 1.8. A readiness check that adds to the overload it should detect is an expensive irony.', 'xanh')) +
    J(`let last = { ok: true, at: 0 };
app.get('/health/ready', async (req, res) => {
  if (Date.now() - last.at > 10000) last = { ok: await dbPing(800), at: Date.now() };   // ≤ 1 query / 10 s per container
  res.status(last.ok ? 200 : 503).json({ status: last.ok ? 'ready' : 'not ready' });
});`, { sm: true, hl: [3] }) },

  { t: 'What this website runs as probes', giua: true, body: two(JW(PROBES, 54, [1, 6], { sm: true }), cot(T(gay(HC, 50), 'docker-compose.yml · backend healthcheck (real)', { sm: true }),
    box('The separation is right', '/health/live is unconditional, /health/ready checks the DB and answers 503. The container healthcheck, however, calls the DETAILED /health — a DB query with no timeout of its own.', 'lam'))) +
    box('Plain Docker is gentler than Kubernetes here', 'Docker only marks the container "unhealthy" — no restart, so no kill cascade. On Kubernetes, the same probe as liveness would cause one.', 'cam') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['/live', `200 in ${LIVE} ms`, 'never touch anything outside the process'],
    ['/ready, healthy DB', `200 in ${RG} ms`, 'dependencies belong here'],
    ['/ready, stuck DB, timeout 800 ms', `503 in ${RT} ms`, 'a clean failure is handleable'],
    ['/ready, stuck DB, no timeout', 'no answer in 5,000 ms', 'a hang looks like death'],
    ['6 containers × 3 probes / 10 s', '1 query every 0.56 s', 'cache readiness longer than the probe gap'],
  ], { co: 21 }) + box('Next: alerts', 'Probes are read by machines. Alerts are read by a human at 3 am — and the number that matters is how many of them get ignored.', 'lam') },

  // ───────────── part 2 ─────────────
  { t: 'Alerts: the number that matters is how many you ignore', to: true, giua: true, body: two(box('An alert is a promise', 'A promise that a human will DO something. Every alert that fires without needing action devalues all the others.', 'cam'),
    box('The currency is trust', 'After silencing the same false page three times, the on-call engineer silences the real one too. Not a discipline problem — arithmetic.', 'do2')) +
    bang(['level', 'when'], [['🔴 wake a human', 'users cannot use the product RIGHT NOW and someone must fix it IMMEDIATELY'], ['🟠 a ticket, business hours', 'degrading, an incident within days: disk at 80%, a certificate with 14 days left'], ['⚪ dashboard only', 'worth a look during an investigation, not worth sending anywhere']], { co: 21 }) },

  { t: 'Four rules that do most of the work', to: true, giua: true, body: cards([
    ['1 · Alert on SYMPTOMS, not causes', '"5xx above 2% for 5 minutes" fires for every cause, even unknown ones. "CPU above 90%" is a cause: high CPU with healthy latency is a machine doing its job.'],
    ['2 · Require DURATION', '"for 5 minutes" removes the alerts caused by one scrape landing during a deploy. Most noisy alerts become sane with a for clause.'],
    ['3 · Use a RATIO, not a count', '"50 errors a minute" is a disaster at 100 req/min and invisible at 100,000. Ratios survive growth.'],
    ['4 · Every alert gets a RUNBOOK link', 'At 3 am the responder is not you and not thinking clearly: what to check first, and how to confirm it is over.'],
  ], 2) + box('An alert that says what to check first is worth three that say "something is wrong"', '', 'cam') },

  { t: 'The alerts that pay for themselves, in order', to: true, giua: true, body: steps([
    '<b>5xx ratio above a threshold</b> — catches almost everything',
    '<b>p95 latency above your SLO for 10 minutes</b> — catches degradation before users complain',
    '<b>Request rate near zero</b> — the outages where nothing errors because nothing ARRIVES; the first two miss them entirely',
    '<b>Event-loop lag p99 above 100 ms</b> — Node-specific, catches blocking (15.4: nodejs_eventloop_lag_p99_seconds)',
    '<b>Disk above 85%</b> — the one that would have saved this project (slide 17)',
  ]) + J(`- alert: HighErrorRatio
  expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.02
  for: 5m                                  # duration, not one bad scrape
  annotations: { runbook: "https://wiki/runbooks/high-5xx" }`, { sm: true, hl: [2, 3] }) },

  { t: 'The four golden signals', to: true, giua: true, body: cards([
    ['Latency', 'How slow — measure successful and failed requests SEPARATELY: errors return fast and drag the average down.'],
    ['Traffic', 'Requests per second — needed to tell "broken" from "nobody is visiting".'],
    ['Errors', 'The failure rate — including the 200s with an empty body that show up nowhere.'],
    ['Saturation', 'Headroom left: disk, memory, connection pool, event-loop lag. The EARLY WARNING signals.'],
  ], 2) + box('Google\'s SRE checklist', 'A good test for "have I forgotten a whole category?" — RED (15.4) covers the first three; saturation is the one teams skip.', 'lam') },

  { t: 'Saturation tells you an incident is COMING', to: true, giua: true, body: two(box('Latency, traffic, errors', 'Tell you an incident is HAPPENING.', 'lam'), box('Saturation', 'Tells you one is COMING — with a predictable arrival time.', 'xanh')) +
    `<svg data-k="dia" viewBox="0 0 1100 200" width="1100" height="200" font-family="Arial">
<line x1="60" y1="170" x2="1060" y2="170" stroke="#999" stroke-width="2"/><line x1="60" y1="20" x2="60" y2="170" stroke="#999" stroke-width="2"/>
<line x1="60" y1="47" x2="1060" y2="47" stroke="${DO}" stroke-width="2" stroke-dasharray="8 6"/><text x="1056" y="40" text-anchor="end" font-size="18" fill="${DO}" font-weight="700">disk 85% — alert here</text>
<polyline points="60,160 260,140 460,118 660,96 860,72 960,58 1010,50" fill="none" stroke="${CAM}" stroke-width="5"/>
<text x="560" y="195" text-anchor="middle" font-size="18" fill="#555">days → a steady climb has a predictable arrival time</text></svg>` +
    cards([['Disk filling steadily', 'You can compute the day it hits 100%.'], ['Pool at 90% utilisation', 'One traffic spike away from timeouts (16.2).'], ['Event-loop lag creeping up', 'Every request on the process is about to pay.']], 3) },

  { t: 'The incident this project actually had', to: true, giua: true, body: flow([{ t: 'the disk filled', s: 'on the VPS', mau: CAM }, { t: 'PostgreSQL', s: 'stopped accepting connections', mau: DO }, { t: 'the API', s: '500 for everything', mau: DO }, { t: 'recovery', s: 'docker prune + restart Postgres', mau: NODE }], { h: 130 }) +
    bang(['now trace it through this chapter', 'answer'], [
      ['Was it detectable in advance?', 'Yes — disk climbs predictably; "disk above 85%" would have fired hours or days ahead'],
      ['Was it visible in the logs?', 'Barely — a full disk is exactly the condition under which logs cannot be written'],
      ['Would a READINESS check catch it?', 'Yes — touching the DB, it would correctly go 503'],
      ['A LIVENESS check touching the DB?', 'Would have killed every container on top of it — the cascade of slide 5'],
    ], { co: 20 }) + box('Most failures look like this', 'Not one missing tool — four small gaps that line up.', 'cam') },

  { t: 'The minimum that is genuinely worth having', to: true, giua: true, body: bang(['', 'effort', 'what it buys'], [
    ['1 · JSON logs + request id', 'a few hours', 'without it every diagnosis is a guess (15.1–15.3)'],
    ['2 · Error tracking (Sentry)', 'an afternoon', 'you learn something broke BEFORE a user tells you'],
    ['3 · An external uptime check', 'ten minutes', 'the one signal that survives the whole machine dying'],
    ['4 · Disk and memory alerts', 'ten minutes', 'exactly the incident above'],
    ['5 · /metrics + a RED dashboard', 'a day', 'from reacting to seeing it coming (15.4)'],
    ['6 · Tracing', 'days + a real overhead', 'save it for the second service (15.5)'],
  ], { co: 20, hl: [2] }) + box('Item 3 deserves emphasis', 'Monitoring that runs inside the thing it monitors cannot report that the thing is gone. A check from OUTSIDE your network, hitting a real URL, is the only signal that survives.', 'xanh') },

  { t: 'What this website does, honestly', to: true, giua: true, body: TT('c15/prod-headers', 11, 12, 'the externally visible health URL of cuongthai.com · GET · real', { n: 104, sm: false, hl: [2] }) +
    cards([['Three probes exist', '/health (detailed, DB), /health/live (unconditional), /health/ready (DB, 503) — the separation is right.'], ['But nginx only proxies /api/', 'None of the three is reachable from outside. The public one, /api/v1/system/health, answers ok WITHOUT touching the database.'], ['So an uptime monitor on it', 'would report "ok" during a total database outage. And the DB checks have no explicit timeout.']], 3) +
    box('Both gaps are small changes', 'Expose a readiness-style check (with a timeout) for the external monitor, and add the timeout. Neither is visible until the day it matters.', 'cam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Notes API runs 4 containers behind a load balancer on Kubernetes, with PostgreSQL and Redis. (1) Write /health/live and /health/ready (what each touches, with which timeout). (2) Which ONE is the liveness probe, and why not the other? (3) Write two alerts that wake a human and one ticket-level alert, each with a duration.', '') +
    box('Hint', 'Slides 4–6, 9, 13 and 14.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) live: returns 200, touches nothing; ready: SELECT 1 and Redis PING, each with ~800 ms timeouts, result cached ~3 s, 503 on failure. (2) /health/live — a DB blip must not kill all 4 containers (the cascade). (3) Wake: 5xx ratio > 2% for 5 m; request rate ≈ 0 for 5 m (or p95 > SLO for 10 m). Ticket: disk > 80% for 30 m. Each with a runbook link.', 'xanh')}</div>` },

  { t: 'Chapter 15 in one table', to: true, giua: true, body: bang(['lesson', 'the measurement to remember', 'the rule'], [
    ['15.1 logs', 'pino 2.4× console.log; a sync burst froze the loop 371 ms; 486 B/line with a token', 'buffer with a bound, redact, mind the defaults'],
    ['15.2 request id', '6 of 18 lines wrong with a global variable', 'AsyncLocalStorage, reuse inbound ids, ≤ 64 chars'],
    ['15.3 cost + search', 'default 5.3× the minimum; grep 1.8× jq; p95 blind to 8.2 s', 'sample by request id, rotate AND ship'],
    ['15.4 metrics', 'raw URL label 40×; 100k ids → 1.5 GB', 'labels from a set you can write on paper'],
    ['15.5 traces', '12 queries seen by shape; OTel −17.6%', 'link logs to traces; sampling saves the bill, not CPU'],
    ['15.6 probes + alerts', `stuck DB: 503 in ${RT} ms with a timeout, hang without`, 'liveness never touches dependencies'],
  ], { co: 17 }) + box('Next: chapter 16 — performance', 'Now that you can see where the time goes, chapter 16 measures what actually makes it go faster.', 'lam') },
]);
