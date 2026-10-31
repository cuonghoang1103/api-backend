/**
 * api-05-1 — API Design · Chapter 5 · Lesson 5.1 "Idempotency keys for POST" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s05-tin-cay.mjs › api-5-1-idempotency. Output = chạy thật LabFlow Ch5 (LABFLOW_DROP_FIRST / LABFLOW_SLOW_MS).
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 5 — Reliability: idempotency, retries, rate limits', bai: '5.1' };

export const deck = { key: 'api-05-1', code: 'API 5.1', title: 'Idempotency keys for POST', sub: 'A lost response, measured and fixed' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Idempotency keys<br>for POST', sub: 'An taps “Book” twice in the basement.<br>Did she book once, twice — or not at all?' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why a <b>lost response</b> makes a blind POST retry dangerous</li>
<li>The experiment on LabFlow: a retry that fights the user’s own booking</li>
<li><code class="i">Idempotency-Key</code> — draft-08 (22 Oct 2026): 400 · 422 · 409</li>
<li>One middleware: scope, fingerprint, record on close, replay</li>
<li>The two traps: a new key per attempt, keys in one process’s memory</li>
</ul>` },

  { t: 'Why only POST needs this', to: true, giua: true, body: two(`
<ul>
<li><b>GET, PUT, DELETE</b> are idempotent (lesson 1.2): twice = once, a client may simply repeat them</li>
<li><b>POST</b> creates something new each time: repeat it blindly and you book, charge or report twice</li>
<li>The client cannot tell whether the request died on the way <b>in</b> or on the way <b>out</b></li>
</ul>`, box('Idempotency key', 'A unique key for one <b>intention</b> (“book lab 3, 4 Jan, 08:00”), sent with every attempt. The server does the work <b>once</b> and replays the result.', 'xanh') +
  box('Draft-08 (active Internet-Draft, not an RFC)', '<code class="i">Idempotency-Key: "8e03978e-…"</code> · <b>400</b> missing · <b>422</b> reused for other content · <b>409</b> still running', 'lam'), 'r46') },

  { t: 'The experiment: a lost response, no key', body: http(`# server: LABFLOW_DROP_FIRST=1 — finish the first POST, then cut the connection
$ curl -sS -X POST …/v2/bookings -H 'Authorization: Bearer tok_an' --json '{"labId":"lab_3","period":{…}}'; echo "curl exit=$?"
curl: (52) Empty reply from server
curl exit=52

$ curl -s -X POST …/v2/bookings -H 'Authorization: Bearer tok_an' -H 'Accept-Language: en' --json '{…same…}' | jq -c '{status, code, detail, conflictWith}'
{"status":409,"code":"BOOKING_CONFLICT","detail":"The lab already has booking bk_9 in this time slot","conflictWith":"bk_9"}

$ curl -s '…/v2/bookings?labId=lab_3' -H 'Authorization: Bearer tok_an' | jq -c '[.data[] | {id, start: .period.start}]'
[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_3","start":"2026-11-02T00:00:00.000Z"}]`, { wrap: true, sm: true }) + two(box('What An sees', '“Network error”, then “room taken” — taken by <b>her own</b> booking bk_9.', 'do2'), box('Without such a rule', 'A payment, a message, a report with a new title: the work simply happens <b>twice</b>.', 'lam')) },

  { t: 'Build it: one middleware', body: sql(`export const idempotent = ({ required = false } = {}) => (req, res, next) => {
  const raw = req.get('Idempotency-Key');
  if (raw === undefined) { if (required) throw new HttpError(400, 'IDEMPOTENCY_KEY_MISSING'); return next(); }
  const key = parseKey(raw);                                     // "…" — 1–255 printable characters
  if (!key) throw new HttpError(400, 'IDEMPOTENCY_KEY_INVALID');
  const k = \`\${req.user?.id ?? req.ip}:\${key}\`;                 // scoped to the CALLER
  const fp = sha256(\`\${req.method} \${req.originalUrl} \${JSON.stringify(req.body)}\`);
  const e = fresh(store.get(k));                                 // older than 24 h ⇒ forgotten
  if (e) {
    if (e.fp !== fp) throw new HttpError(422, 'IDEMPOTENCY_KEY_REUSED');
    if (e.state === 'running') { res.set('Retry-After', '1'); throw new HttpError(409, 'IDEMPOTENCY_IN_PROGRESS'); }
    res.set('Idempotent-Replayed', 'true');
    if (e.location) res.location(e.location);
    return res.status(e.status).json(e.body);
  }
  store.set(k, { fp, state: 'running', at: now() });
  // capture the answer; record it when the connection CLOSES — also if the client already left
  res.once('close', () => (result?.status < 300 ? store.set(k, { fp, state: 'done', ...result }) : store.delete(k)));
  next();
};`, { lang: 'javascript', sm: true, hl: [6, 7, 10, 11, 18] }) + `<p style="margin:6px 0 0;font-size:19px">Condensed — full file in the lesson. Route: <code class="i">.post(idempotent(), validate(…), handler)</code>, after authentication.</p>` },

  { t: 'Try it: the same lost response, with a key', body: http(`$ curl -sS -X POST …/v2/bookings -H 'Authorization: Bearer tok_an' -H 'Idempotency-Key: "8e03978e-…"' --json '{…}'; echo "curl exit=$?"
curl: (52) Empty reply from server
curl exit=52

$ curl -si -X POST …/v2/bookings … -H 'Idempotency-Key: "8e03978e-…"' --json '{…same…}' | grep -E '^(HTTP|Location|Idempotent-Replayed)'
HTTP/1.1 201 Created
Idempotent-Replayed: true
Location: /v2/bookings/bk_9

$ curl -s -X POST …/v2/bookings … -H 'Idempotency-Key: "8e03978e-…"' --json '{…same…}' | jq -c '{id, period}'
{"id":"bk_9","period":{"start":"2027-01-04T01:00:00.000Z","end":"2027-01-04T03:00:00.000Z"}}

$ curl -s '…/v2/bookings?labId=lab_3' … | jq -c '[.data[] | {id, start: .period.start}]'
[{"id":"bk_9","start":"2027-01-04T01:00:00.000Z"},{"id":"bk_3","start":"2026-11-02T00:00:00.000Z"}]`, { wrap: true, sm: true }) + box('One booking', 'The retry replays <b>201</b> with the same Location; <code class="i">Idempotent-Replayed: true</code> is LabFlow’s signal that nothing new happened.', 'xanh') },

  { t: 'Misuse, and a request still running', to: true, body: two(http(`# same key, DIFFERENT body
{"status":422,"code":"IDEMPOTENCY_KEY_REUSED",
 "detail":"This key belongs to a request with different content; use a new key"}

# Idempotency-Key: "xin chào"
{"status":400,"code":"IDEMPOTENCY_KEY_INVALID"}`, { title: 'terminal (jq output)', wrap: true }) + box('A client bug, made loud', 'Replaying would return the result of <b>another</b> request. Refuse instead.', 'do2') + box('Not stored', 'Neither error is saved: fix the request and send it again.', 'lam'), http(`# LABFLOW_SLOW_MS=1500: the first answer is late
# second request, same key, 0.3 s later:
{"first":"bk_9"}
HTTP/1.1 409 Conflict
Retry-After: 1
  "code": "IDEMPOTENCY_IN_PROGRESS"`, { title: 'terminal' }) + box('Never two in parallel', '409 + <code class="i">Retry-After</code>: “I am still on it — come back in a second.” The client in 5.2 understands that.', 'lam'), 'r46') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ A new key per attempt', 'Every retry becomes a new request — exactly what keys exist to prevent. ✓ One key per <b>intention</b>: generate on tap, keep until answered.'],
    ['✗ Keys in one process’s memory', 'Two instances behind a load balancer: the retry lands on the other one. ✓ Database or Redis, same 24 h expiry.'],
    ['✗ Replaying errors forever', 'A 500 stored for 24 h blocks the user. ✓ LabFlow replays only successes; errors are evaluated again.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“How do you prevent double charges?”', 'Idempotency keys: client-generated per intention, stored per caller with a request fingerprint and the result, replayed on retry.'],
    ['“Same key, different body?”', 'A client bug: refuse with 422 — never silently replay the result of another request.'],
    ['“Where do the keys live?”', 'Somewhere every instance sees (DB/Redis), with an expiry (Stripe: at least 24 h).'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Measured: lost response + blind retry ⇒ <b>409 against the user’s own booking</b></li>
<li>With <code class="i">Idempotency-Key</code>: one booking, retry ⇒ <b>201 replayed</b></li>
<li>Per caller · fingerprint · record on close · replay only successes</li>
<li>Draft-08: <b>400</b> missing · <b>422</b> reused · <b>409</b> running</li>
<li>One key per intention; shared storage for several instances</li>
</ul>
${box('Next', 'Lesson 5.2 — when and how often to retry: timeouts, backoff, jitter.', 'xanh')}` },
]);
