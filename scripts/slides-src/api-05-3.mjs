/**
 * api-05-3 — API Design · Chapter 5 · Lesson 5.3 "Rate limiting and quotas" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s05-tin-cay.mjs › api-5-3-rate-limit. Output = chạy thật LabFlow Ch5 + proxy.mjs.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 5 — Reliability: idempotency, retries, rate limits', bai: '5.3' };

export const deck = { key: 'api-05-3', code: 'API 5.3', title: 'Rate limiting and quotas', sub: 'Token bucket, RateLimit headers, the proxy trap' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Rate limiting<br>and quotas', sub: 'Not every client is polite —<br>and most limiters break behind a proxy.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The <b>token bucket</b> — and why it beats a fixed window</li>
<li>Headers <code class="i">RateLimit-Policy</code> / <code class="i">RateLimit</code> (draft-11), <b>429</b> + <code class="i">Retry-After</code></li>
<li>Per user for writes, per IP for public reads</li>
<li>The <b>proxy trap</b>, measured three ways: off · true · 1</li>
<li>Where buckets must live once there are several server instances</li>
</ul>` },

  { t: 'The token bucket', body: two(sql(`export function rateLimit({ name, capacity, windowSec, key }) {
  const buckets = new Map();
  const perSec = capacity / windowSec;
  return (req, res, next) => {
    const t = now() / 1000;
    const b = buckets.get(key(req)) ?? { tokens: capacity, at: t };
    b.tokens = Math.min(capacity, b.tokens + (t - b.at) * perSec);
    b.at = t;
    buckets.set(key(req), b);
    res.set('RateLimit-Policy', \`"\${name}";q=\${capacity};w=\${windowSec}\`);
    if (b.tokens < 1) {
      const wait = Math.ceil((1 - b.tokens) / perSec);
      res.set('RateLimit', \`"\${name}";r=0;t=\${wait}\`).set('Retry-After', String(wait));
      throw new HttpError(429, 'RATE_LIMITED', { wait });
    }
    b.tokens -= 1;
    res.set('RateLimit', \`"\${name}";r=\${Math.floor(b.tokens)};t=…\`);
    next();
  };
}`, { lang: 'javascript', sm: true, hl: [7, 11, 13, 14] }), box('Picture it', '<b>5</b> tokens, one back every <b>12 s</b>; each request takes one. No fixed-window edge (10 in 2 s around a minute boundary).', 'xanh') +
  box('Headers (draft-11, 23 May 2026)', '<code class="i">RateLimit-Policy: "booking";q=5;w=60</code><br><code class="i">RateLimit: "booking";r=4;t=12</code><br>429 ⇒ <code class="i">Retry-After</code> takes precedence', 'lam'), 'r64') },

  { t: 'Try it: per user', body: http(`$ for i in 1 2 3 4 5 6; do curl -s -o /dev/null -D - -X POST …/v2/bookings -H 'Authorization: Bearer tok_lan' --json "{…2027-02-0\${i}…}" | grep -E '^(HTTP|RateLimit|Retry-After)' | tr -d '\\r' | paste -sd '|' -; done
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=4;t=12
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=3;t=24
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=2;t=36
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=1;t=48
HTTP/1.1 201 Created|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=0;t=60
HTTP/1.1 429 Too Many Requests|RateLimit-Policy: "booking";q=5;w=60|RateLimit: "booking";r=0;t=12|Retry-After: 12

$ curl -s -X POST …/v2/bookings -H 'Authorization: Bearer tok_lan' -H 'Accept-Language: en' --json '{…}'
{ "type": "https://labflow.example/problems/rate-limited", "title": "Too many requests", "status": 429,
  "detail": "You have used up your quota; retry in 12 seconds", "instance": "/v2/bookings", "code": "RATE_LIMITED" }

$ curl -s -o /dev/null -D - -X POST …/v2/bookings -H 'Authorization: Bearer tok_bin' --json '{…}' | grep -E '^(HTTP|RateLimit:)'
HTTP/1.1 201 Created
RateLimit: "booking";r=4;t=12`, { wrap: true, sm: true, title: 'terminal (problem body re-indented)' }) + two(box('Bin is unaffected', 'Per-user key ⇒ his own bucket.', 'xanh'), box('Replays are free', '<code class="i">idempotent()</code> stands before the limiter (5.1).', 'lam')) },

  { t: 'The proxy trap', body: two(`
<ul>
<li>In production LabFlow sits behind nginx / a load balancer: every connection comes <b>from the proxy</b></li>
<li>The client address arrives in <code class="i">X-Forwarded-For</code>, which the proxy <b>appends</b> to (<code class="i">$proxy_add_x_forwarded_for</code>)</li>
<li>Express: <code class="i">app.set('trust proxy', …)</code> — off, <code class="i">true</code>, or a hop count</li>
</ul>` + box('Demo limit', 'Public lab list: 5 requests per 10 s per IP. Proxy ports 8081/8082 pretend two users (documentation address ranges).', 'lam'), sql(`// proxy.mjs — appends like nginx
const users = [[8081, '203.0.113.10'],
               [8082, '198.51.100.7']];
for (const [port, clientIp] of users) {
  http.createServer((req, res) => {
    const old = req.headers['x-forwarded-for'];
    const xff = old ? \`\${old}, \${clientIp}\` : clientIp;
    const up = http.request({
      host: '127.0.0.1', port: 4000,
      path: req.url, method: req.method,
      headers: { ...req.headers,
        'x-forwarded-for': xff } },
      (r) => {
        res.writeHead(r.statusCode, r.headers);
        r.pipe(res);
      });
    req.pipe(up);
  }).listen(port);
}`, { lang: 'javascript', sm: true, hl: [7] }), 'r64') },

  { t: 'Measured: off · true · 1', body: two(http(`# trust proxy OFF
$ curl -s http://localhost:8081/debug/ip
{ "ip": "::ffff:127.0.0.1", "xff": "203.0.113.10" }
200 200 200 200 200 429          # user A via :8081
$ curl … http://localhost:8082/v2/labs
429                              # user B: never sent anything

# trust proxy = true
$ curl -s http://localhost:8081/debug/ip -H 'X-Forwarded-For: 6.6.6.6'
{ "ip": "6.6.6.6", "xff": "6.6.6.6, 203.0.113.10" }
200 200 200 200 200 200 200 200  # fake 10.0.0.1 … 10.0.0.8`, { sm: true, wrap: true, title: 'terminal (loop commands omitted, JSON re-indented)' }), http(`# trust proxy = 1
$ curl -s http://localhost:8081/debug/ip -H 'X-Forwarded-For: 6.6.6.6'
{ "ip": "203.0.113.10", "xff": "6.6.6.6, 203.0.113.10" }
200 200 200 200 200 429 429 429  # spoofing ignored
$ curl … http://localhost:8082/v2/labs
200                              # B has its own bucket`, { sm: true, wrap: true }) + `
<table class="t" style="font-size:19px;margin-top:8px">
<tr><th>Setting</th><th>Effect</th></tr>
<tr><td>off</td><td>everyone shares the proxy’s bucket</td></tr>
<tr><td>true</td><td>client-written entry believed: <b>spoofable</b></td></tr>
<tr><td>1</td><td>the address our proxy appended: <b>correct</b></td></tr>
</table>
${box('Count your hops', 'One nginx = 1 · cloud load balancer + nginx = 2. Too many ⇒ spoofable again.', 'xanh')}`, 'r46') },

  { t: 'Traps', to: true, giua: true, body: cards([
    ['✗ trust proxy: true from a tutorial', 'Every IP limit, log and ban becomes spoofable. ✓ Count your hops: one nginx = 1, a load balancer in front of nginx = 2.'],
    ['✗ Buckets in one process', 'Each instance allows the full quota. ✓ Shared storage (Redis) once there is more than one process.'],
    ['✗ 429 without Retry-After', 'Clients guess and retry too early. ✓ Retry-After + RateLimit so polite clients can slow down first.'],
  ]) },

  { t: 'In interviews and at work', to: true, giua: true, body: cards([
    ['“Design a rate limiter.”', 'Key (user / API key / IP), algorithm (token bucket or sliding window), shared storage, headers telling the quota, 429 + Retry-After, correct client IP behind proxies.'],
    ['“Why per user and per IP?”', 'Writes belong to an identity; anonymous public reads only have an address — with the proxy caveat.'],
    ['“Token bucket or sliding window?”', 'Bucket: allows short bursts, cheap state (tokens + time). Sliding window: smoother, needs more state.'],
  ]) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Token bucket: 5 bookings/user/60 s, a token every 12 s, bursts allowed</li>
<li><code class="i">RateLimit-Policy</code> + <code class="i">RateLimit</code> (draft-11); over ⇒ <b>429</b> + <code class="i">Retry-After</code></li>
<li>Behind a proxy: off ⇒ shared bucket · true ⇒ spoofable (8/8) · <b>1 ⇒ correct</b></li>
<li>Replays are free; several instances need shared buckets</li>
</ul>
${box('Next', 'Lesson 5.4 — two people edit the same device: ETag, If-Match, 412.', 'xanh')}` },
]);
