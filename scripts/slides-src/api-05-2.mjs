/**
 * api-05-2 — API Design · Chapter 5 · Lesson 5.2 "Retries, backoff and timeouts" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s05-tin-cay.mjs › api-5-2-retry. Output = chạy thật retry.mjs, book-retry.mjs, herd.mjs trên LabFlow Ch5.
 */
import { lamDeck, sql, http, two, box, cards, steps } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 5 — Reliability: idempotency, retries, rate limits', bai: '5.2' };

export const deck = { key: 'api-05-2', code: 'API 5.2', title: 'Retries, backoff and timeouts', sub: 'One client function, fifty clients measured' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Retries, backoff<br>and timeouts', sub: 'Fifty apps retrying in step can keep<br>a recovering server down.' },

  { t: 'Three rules before any code', to: true, giua: true, body: steps([
    '<b>Every call has a timeout</b> — <code class="i">fetch</code> has none by default: <code class="i">AbortSignal.timeout(ms)</code>',
    '<b>Retry only what can succeed later and is safe to repeat</b>: network errors, timeouts, 408, 429, 500, 502, 503, 504 — never 400, 401, 403, 404, 409, 422; POST only with an Idempotency-Key',
    '<b>Wait longer each time, not in step with everyone</b>: exponential backoff with a cap, random jitter, and at least <code class="i">Retry-After</code>',
  ]) },

  { t: 'The client function', body: sql(`const RETRYABLE = [408, 429, 500, 502, 503, 504];
const SAFE = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];
export async function fetchWithRetry(url, init = {}, opt = {}) {
  const { retries = 5, baseMs = 200, capMs = 5000, timeoutMs = 2000, jitter = true, log = () => {} } = opt;
  const method = (init.method ?? 'GET').toUpperCase();
  const mayRetry = SAFE.includes(method) || new Headers(init.headers).has('Idempotency-Key');
  for (let attempt = 1; ; attempt++) {
    let res, err;
    try { res = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) }); } catch (e) { err = e; }
    const ra = res?.headers.get('retry-after');
    const again = err || RETRYABLE.includes(res.status) || (res.status === 409 && ra);
    if (!again || !mayRetry || attempt > retries) { if (err) throw err; return res; }
    const exp = Math.min(capMs, baseMs * 2 ** (attempt - 1));      // 200, 400, 800 … capped
    let wait = jitter ? Math.round(Math.random() * exp) : exp;     // "full jitter"
    if (ra) wait = Math.max(wait, /^\\d+$/.test(ra) ? Number(ra) * 1000 : Date.parse(ra) - Date.now());
    await new Promise((r) => setTimeout(r, wait));
  }
}`, { lang: 'javascript', sm: true, hl: [6, 9, 11, 13, 14, 15] }) + `<p style="margin:6px 0 0;font-size:19px">Full jitter = random wait in [0, exponential] — measured in Marc Brooker’s <i>Exponential Backoff And Jitter</i> (AWS Architecture Blog, 4 Mar 2015).</p>` },

  { t: 'Timeout + the same key', to: true, body: two(sql(`// book-retry.mjs
const key = randomUUID();          // ONE key per intention
const res = await fetchWithRetry('…/v2/bookings', {
  method: 'POST',
  headers: { …, 'Idempotency-Key': \`"\${key}"\` },
  body: JSON.stringify({ labId: 'lab_3', period: { … } }),
}, { timeoutMs: 2000, log: console.log });`, { lang: 'javascript', sm: true }) + http(`# server answers the first POST 3 s late
$ node book-retry.mjs
#1 TimeoutError sau 2009 ms
   chờ 55 ms
#2 201 sau 10 ms
kết quả: 201 bk_9 (Idempotent-Replayed)`, { sm: true }), http(`# the same client WITHOUT a key
$ node book-nokey.mjs
#1 TimeoutError sau 2004 ms
DOMException [TimeoutError]: The operation was
aborted due to timeout

$ curl -s '…/v2/bookings?labId=lab_3' … | jq -c '[.data[].id]'
["bk_9","bk_3"]`, { sm: true, wrap: true }) + box('No key, no retry', '<code class="i">fetchWithRetry</code> refuses to repeat the POST — and bk_9 was created anyway. The app can only say “we are not sure”.', 'do2'), 'r46') },

  { t: 'The experiment: fifty clients after an outage', to: true, giua: true, body: two(`
<ul>
<li><code class="i">LABFLOW_OUTAGE_MS=1000</code>: <code class="i">GET /v2/labs</code> answers 503 for 1 s after the first request</li>
<li>Afterwards the server serves only <b>10 requests per 100 ms</b>; more ⇒ 503 “overloaded”</li>
<li><code class="i">herd.mjs</code>: 50 clients at once, each with one policy, up to 10 retries</li>
<li><code class="i">GET /chaos/arrivals</code>: what the server saw, per 100 ms</li>
</ul>`, `
<table class="t" style="font-size:20px">
<tr><th>Policy</th><th>Wait before retry n</th></tr>
<tr><td>fixed</td><td>500 ms, always</td></tr>
<tr><td>expo</td><td>200 · 2<sup>n−1</sup> ms, cap 5 s</td></tr>
<tr><td>jitter</td><td>random in [0, 200 · 2<sup>n−1</sup>] ms</td></tr>
</table>`, 'r46') },

  { t: 'Measured: three policies', body: http(`$ POLICY=fixed node herd.mjs
fixed: 50/50 thành công sau 3075 ms
server nhận 250 request (200 lần 503), đỉnh 50 request/100 ms
mỗi 100 ms: 50 0 0 0 0 50 0 0 0 0 50 0 0 0 0 40 0 0 0 0 30 0 0 0 0 20 0 0 0 0 10

$ POLICY=expo node herd.mjs
expo: 50/50 thành công sau 16284 ms
server nhận 300 request (250 lần 503), đỉnh 50 request/100 ms
mỗi 100 ms: 50 0 50 0 0 0 50 0 0 0 0 0 0 0 50 0 0 … 40 … 30 … 20 … 10

$ POLICY=jitter node herd.mjs
jitter: 50/50 thành công sau 3959 ms
server nhận 247 request (197 lần 503), đỉnh 75 request/100 ms
mỗi 100 ms: 75 34 18 13 14 10 9 8 8 8 7 6 4 3 2 1 4 7 2 5 1 1 0 1 2 0 0 0 1 0 1 …`, { wrap: true, sm: true, title: 'terminal (long zero runs shortened with …)' }) + `
<table class="t" style="font-size:19px;margin-top:8px">
<tr><th>Policy</th><th>Done</th><th>Requests</th><th>Shape</th></tr>
<tr><td>fixed 500 ms</td><td>3 075 ms</td><td>250</td><td>bursts of 50, never backs off</td></tr>
<tr><td>backoff, no jitter</td><td><b>16 284 ms</b></td><td>300</td><td>bursts of 50 stay together</td></tr>
<tr><td>backoff + jitter</td><td>3 959 ms</td><td>247</td><td>spread out after the first burst</td></tr>
</table>` },

  { t: 'Reading the numbers', to: true, giua: true, body: cards([
    ['Backoff alone is the worst', 'The clients stay synchronised: every wave of 50 hits the 10-per-100 ms limit again, only with longer gaps — 16 s.'],
    ['Fixed retries hammer', 'Quick here, but identical bursts every 500 ms — and they never slow down in a long outage.'],
    ['Jitter breaks the herd', 'After the first burst no slot above 34; done in ~4 s with the fewest requests. The first 75 = 50 initial calls + early retries.'],
  ]) + box('The lesson', 'Backoff decides <b>how long</b> to wait; jitter decides that clients do <b>not wait the same</b>. You need both.', 'xanh') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ Retries in several layers', 'App 3 × library 3 × gateway 3 = <b>27</b> requests for one tap. ✓ Retry in one layer only.'],
    ['✗ Timeouts longer than patience', 'Nobody waits 30 s for a booking screen. ✓ Set it from what the user bears and what the server needs (2 s here).'],
    ['✗ Retrying 4xx', 'A 422 fails the same way every time. ✓ Only transient errors — and POST only with a key.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“How do you retry calls to another service?”', 'Timeout on every call; transient errors only; idempotent operations or POST with a key; exponential backoff with cap and jitter; honour Retry-After; limit attempts; one layer.'],
    ['“Why jitter?”', 'Without it, clients that failed together retry together — the thundering herd. Measured: 16.3 s vs 4.0 s.'],
    ['“What is a sensible timeout?”', 'Slightly above the normal response time and below the user’s patience; one total budget across retries.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Every call gets a <b>timeout</b>; retry only transient errors and safe operations</li>
<li>POST is retried only with an <b>Idempotency-Key</b> — without one, bk_9 was created anyway</li>
<li>50 clients: fixed <b>3.1 s</b> in bursts · backoff <b>16.3 s</b> · backoff + jitter <b>4.0 s</b>, spread</li>
<li>Honour <code class="i">Retry-After</code>, cap the attempts, retry in one layer</li>
</ul>
${box('Next', 'Lesson 5.3 — when clients are not polite: rate limiting.', 'xanh')}` },
]);
