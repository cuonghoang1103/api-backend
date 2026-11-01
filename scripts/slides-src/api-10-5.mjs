/**
 * api-10-5 — API Design · Chapter 10 · Lesson 10.5 "Webhooks (1): sending" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s10-bat-dong-bo.mjs › api-10-4-webhook. Output = chạy thật LabFlow ch10 + bên nhận :4005 (Standard Webhooks, BullMQ).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 10 — Async and realtime', bai: '10.5' };

export const deck = { key: 'api-10-5', code: 'API 10.5', title: 'Webhooks (1): sending', sub: 'Signatures, retries and a delivery log' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Webhooks (1):<br>sending', sub: 'Now LabFlow is the client —<br>and the receiver is someone else’s server.' },

  { t: 'Registering: a URL is an attack surface', body: http(`$ curl -s -X POST …/v2/webhooks --json '{"url":"http://localhost:4005/hooks",…}' | jq -c '{status, code, detail}'
{"status":422,"code":"URL_NOT_ALLOWED","detail":"Không tải được URL này (https only)"}
$ curl -s -X POST …/v2/webhooks --json '{"url":"https://169.254.169.254/latest/meta-data",…}' | jq -c …
{"status":422,"code":"URL_NOT_ALLOWED","detail":"Không tải được URL này (private address)"}
$ curl -s -X POST …/v2/webhooks -H 'Authorization: Bearer tok_an' … | jq -c '{status, code}'
{"status":403,"code":"FORBIDDEN"}`, { sm: true, wrap: 'any', title: 'the SSRF checks of 6.3, reversed' }) + two(http(`$ curl -s -i -X POST …/v2/webhooks …
HTTP/1.1 201 Created
Location: /v2/webhooks/wh_mvx5n7hf
Cache-Control: no-store

  "events": [ … ],
  "status": "active",
  "secret": "whsec_MjHkjLKi…"`, { sm: true, wrap: 'any', title: 'LABFLOW_WEBHOOK_ALLOW_LOCAL=1 (course only)' }), box('Checked twice', 'At registration <b>and</b> before each delivery — DNS can change in between. HTTPS only, no private addresses, only lab managers.', 'lam') + box('The secret, shown once', 'Like the API keys of 6.1, with no-store. The receiver uses it to check the request came from LabFlow.', 'xanh')) },

  { t: 'From an event to a signed POST', body: flow([
    { t: '1 · event', s: 'labflow:events (10.3)' },
    { t: '2 · dispatcher', s: 'event × subscription ⇒ msg_…', mau: '#7a5195' },
    { t: '3 · queue', s: 'BullMQ, backoff + jitter', mau: '#c0392b' },
    { t: '4 · sender', s: 'sign, POST 5 s, log it', mau: '#2e7d32' },
  ], { h: 120, fs: 19 }) + sql(`const msgId = \`msg_\${m.id}_\${s.id}\`;                 // dispatcher
await deliveries.add('deliver', { subId: s.id, msgId, event: e }, {
  jobId: msgId, attempts: ATTEMPTS, backoff: { type: 'exponential', delay: BACKOFF_MS, jitter: 0.5 }, … });

export function sign(secret, id, ts, body) {           // Standard Webhooks
  return \`v1,\${createHmac('sha256', keyOf(secret)).update(\`\${id}.\${ts}.\${body}\`).digest('base64')}\`;
}`, { lang: 'javascript', sm: true, hl: [3, 6] }) + two(box('jobId = message id', 'The dispatcher will read some events twice (10.3); the second add is ignored — no double queueing.', 'xanh'), box('Filtered by owner', 'export.completed (10.1) goes only to webhooks of the person who started the export.', 'lam')) },

  { t: 'What the receiver gets', giua: true, body: two(http(`$ curl … -X POST …/v2/bookings -H 'Authorization: Bearer tok_an' …
201
$ sleep 1; cat recv.log
✓ msg_1793496727230-0_wh_mvx5n… labflow.booking.created.v1 bk_1 v1
$ jq '.headers | {…}' dump.json
{
  "content-type": "application/json",
  "user-agent": "LabFlow-Webhooks/1.0",
  "webhook-id": "msg_1793496727230-0_wh_mvx5n6sx",
  "webhook-timestamp": "1793496727",
  "webhook-signature": "v1,U77XGBo4UR95…"
}`, { sm: true, wrap: 'any' }), `<table class="t"><tr><th>Header</th><th>Job</th></tr>
<tr><td>webhook-id</td><td>same on every retry ⇒ the receiver’s dedupe key</td></tr>
<tr><td>webhook-timestamp</td><td>seconds, signed ⇒ cannot be changed; bounds replays</td></tr>
<tr><td>webhook-signature</td><td>v1, + base64 HMAC-SHA256 of id.timestamp.body; several while rotating secrets</td></tr></table>`) + box('Standard Webhooks', 'The scheme of Svix, close to Stripe’s: secrets whsec_ + base64, exponential backoff with jitter, 410 Gone ⇒ disable, block internal networks.', 'lam') },

  { t: 'When the receiver is down: retries you can see', body: http(`$ sleep 12; curl -s …/v2/webhooks/$(jq -r .id wh.json)/deliveries | jq -c '.data | reverse | .[] | {attempt, status, error, durationMs, at}'
{"attempt":1,"status":503,"error":null,"durationMs":22,"at":"2026-11-01T01:17:06.874Z"}
{"attempt":2,"status":503,"error":null,"durationMs":2,"at":"2026-11-01T01:17:07.664Z"}
{"attempt":3,"status":503,"error":null,"durationMs":2,"at":"2026-11-01T01:17:09.490Z"}
{"attempt":4,"status":204,"error":null,"durationMs":2,"at":"2026-11-01T01:17:12.223Z"}`, { sm: true, wrap: 'any', title: 'FAIL_FIRST=3 · backoff from 1 s (demo) with 50% jitter' }) + box('Gaps 0.8 · 1.8 · 2.7 s', 'Roughly 1, 2, 4 s, each shortened by up to half at random — a thousand receivers that failed together do not retry in lockstep. The /deliveries log answers “why didn’t we get it?” with facts.', 'xanh') + cards([
    ['At least once', '8 attempts in ~1 h (30 s … 32 min); Stripe retries 3 days.'],
    ['5 s to answer', 'Slower = failure, retried (GitHub 10 s).'],
    ['410 = stop', 'The subscription is disabled. No order — use data.version. No redirects.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Webhook URLs are SSRF targets: HTTPS only, no private addresses, checked at registration and at delivery</li>
<li>Event → one message per subscription (<b>msg id = jobId</b>) → signed POST</li>
<li>Headers: id (dedupe) · timestamp (replay window) · signature (HMAC-SHA256 of id.timestamp.body)</li>
<li>Receiver down: <b>503, 503, 503, 204</b> — every attempt visible in /deliveries</li>
<li>Contract in OpenAPI 3.1 <code class="i">webhooks</code>: at least once, 5 s, 410 = stop, no order</li>
</ul>
${box('Next', 'Lesson 10.6 — the other side: receiving webhooks safely.', 'xanh')}` },
]);
