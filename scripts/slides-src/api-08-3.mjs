/**
 * api-08-3 — API Design · Chapter 8 · Lesson 8.3 "Slow by design" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s08-he-thong.mjs › api-8-2-payload. Output = chạy thật curl + perf/slow-link.mjs (1 Mbit/s, 40 ms) + autocannon, compression 1.8.2.
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 8 — Thinking in systems', bai: '8.3' };

export const deck = { key: 'api-08-3', code: 'API 8.3', title: 'Slow by design', sub: 'Payload size, sparse fields and compression' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Slow by design:<br>payload, fields, compression', sub: '3 ms on localhost.<br>319 ms on crowded campus Wi-Fi.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Where bytes cost time: <b>size ÷ bandwidth</b></li>
<li>How big LabFlow’s answers are — compact, sparse, gzip, Brotli</li>
<li>The same answers over a <b>simulated 1 Mbit/s link</b></li>
<li>Fixes that live in the <b>contract</b>: limit, fields=, include=, compression</li>
<li>What the server pays for bytes; N+1, deep OFFSET, chatty screens</li>
</ul>` },

  { t: 'How big are LabFlow’s answers?', giua: true, body: two(http(`# NODE_ENV=production ⇒ compact JSON
$ curl -s -o /dev/null -w '%{size_download}' '…/v2/bookings?limit=100'
25501
$ curl … '…/v2/bookings?limit=100&fields=id,status,period'
11653
$ curl … -H 'Accept-Encoding: gzip' '…/v2/bookings?limit=100'
Content-Encoding: gzip   1688
$ curl … -H 'Accept-Encoding: br' '…/v2/bookings?limit=100'
Content-Encoding: br     1447`, { sm: true, wrap: 'any' }), `<table class="t" style="font-size:19px">
<tr><th>100 bookings</th><th>bytes</th></tr>
<tr><td>dev, indented</td><td>36,428</td></tr>
<tr><td>compact JSON</td><td>25,501</td></tr>
<tr><td>fields=id,status,period</td><td>11,653 (−54%)</td></tr>
<tr><td>gzip</td><td>1,688 (15×)</td></tr>
<tr><td>Brotli</td><td><b>1,447</b></td></tr>
</table>` + box('Why so compressible?', 'JSON repeats the same keys and values in every row.', 'lam')) },

  { t: 'The same answers over a slow link', giua: true, body: two(sql(`// perf/slow-link.mjs (condensed) — 1 Mbit/s, 40 ms each way
http.createServer(async (req, res) => {
  await sleep(delay);                         // request goes out
  const up = http.request({ port: upstream, path: req.url,
    method: req.method, headers: req.headers }, async (r) => {
    await sleep(delay);                       // first byte back
    res.writeHead(r.statusCode, r.headers);
    for await (const chunk of r)
      for (let i = 0; i < chunk.length; i += 1024) {
        res.write(chunk.subarray(i, i + 1024));
        await sleep(1024 / bytesPerMs);       // drip at the bandwidth
      }
    res.end();
  });
  req.pipe(up);
}).listen(8090);`, { lang: 'javascript', sm: true, hl: [11] }), http(`limit=20:   5204 byte, 0.146 s
limit=100: 25501 byte, 0.319 s
limit=100&fields=…: 11653 byte, 0.197 s
limit=100, gzip: 1688 byte, 0.103 s
limit=100, br:   1447 byte, 0.104 s`, { sm: true, wrap: 'any' }) + box('Check it with arithmetic', 'Predicted 80 ms delay + 25,501 × 8 ÷ 1,000,000 = <b>284 ms</b>; measured <b>319 ms</b> (1 KB drips, timers run late). gzip: 93.5 → <b>103 ms</b>. Server: 2–3 ms.', 'lam') + box('vs the 8.1 budget (p95 ≤ 300 ms)', 'Uncompressed, the list alone breaks it.', 'do2'), 'r64') },

  { t: 'Fixing it in the contract', to: true, giua: true, body: cards([
    ['1 · Small default page', 'limit defaults to 20, max 100 (3.1): a client that forgets to ask gets 5 KB, not 25.'],
    ['2 · Sparse fields', 'fields=id,status,period (3.4): −54%; the client says what the screen shows.'],
    ['3 · Opt-in embedding', 'include=lab only when asked (3.4); never embed “just in case”.'],
    ['4 · Compression', 'Accept-Encoding → Content-Encoding: br/gzip. 15–18×, no client code change.'],
  ], 2) },

  { t: 'Compression in Express — and what it skips', giua: true, body: two(sql(`import compression from 'compression';
app.use(compression({ threshold: 1024 }));`, { lang: 'javascript', sm: true }) + http(`# 101-byte lab: below the threshold
$ curl -D - -H 'Accept-Encoding: gzip, br' …/v2/labs/lab_1
Vary: Origin, Accept-Encoding
Content-Length: 101

# 100 bookings
$ curl -D - -H 'Accept-Encoding: gzip, br' '…?limit=100'
Vary: Origin, Accept-Encoding
Content-Encoding: br        size: 1447 byte`, { sm: true, wrap: 'any' }),
    box('Vary: Accept-Encoding', 'Caches keep one copy per encoding and never send Brotli to a client that cannot decode it (Chapter 9).', 'lam') + box('Skipped', '<b>Cache-Control: no-transform</b> responses; server-sent events need <b>res.flush()</b> (Chapter 10).', 'xanh') + box('BREACH (2013)', 'Never compress a secret next to attacker-chosen text in one body. LabFlow’s token is in a header.', 'do2')) },

  { t: 'The server pays for bytes too', giua: true, body: two(http(`# 10 connections, 10 s, limit=100
$ npx autocannon -c 10 -d 10 … '…?limit=100'
│ Req/Sec │ … │ 1,163.91 │ …
12k requests in 10.01s, 303 MB read

$ npx autocannon … -H 'Accept-Encoding=gzip' '…?limit=100'
│ Req/Sec │ … │ 1,192.91 │ …
12k requests in 10.02s, 26.6 MB read`, { sm: true, wrap: 'any' }), box('Requests per second: noise', '1,164 vs 1,193 (another run: 1,036 with gzip) — on localhost bandwidth is free.', 'lam') + box('Bytes: 303 MB vs 26.6 MB', '303 MB in 10 s ≈ 240 Mbit/s. A 100 Mbit/s port caps uncompressed at ~490 req/s, however fast the code. Clouds bill egress per GB.', 'do2')) },

  { t: 'Other slowness the design creates', to: true, giua: true, body: cards([
    ['N+1 queries (3.4)', '21 queries 2.16 ms vs 1 JOIN 0.25 ms on localhost; each extra query is a round trip to a remote DB.'],
    ['Deep OFFSET (3.1)', 'OFFSET 900,000 = 35 ms per page and growing; a cursor stays flat.'],
    ['Chatty screens', 'Home = 5 calls; on the slow link ≥ 80 ms each. Parallel, or one screen endpoint if measured.'],
    ['Unbounded lists', 'Without a limit every list becomes the 25 KB (or 25 MB) answer.'],
  ], 2) + box('The pattern', 'Find the cost with a measurement; fix it with a contract rule.', 'xanh') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>100 bookings: 25.5 KB → 11.7 KB (fields) → 1.7 KB gzip → <b>1.4 KB br</b></li>
<li>1 Mbit/s + 40 ms each way: <b>319 ms</b> uncompressed vs <b>103 ms</b> compressed; server 2–3 ms</li>
<li>Compression = one Express line; &lt; 1 KB stays plain; <b>Vary: Accept-Encoding</b></li>
<li>The server sent 303 MB vs 26.6 MB in 10 s — bandwidth limits and bills</li>
<li>N+1, deep OFFSET, chatty screens, unbounded lists: fix with contract rules</li>
</ul>
${box('Next', 'Lesson 8.4 — two instances behind a load balancer, and the four things that break.', 'xanh')}` },
]);
