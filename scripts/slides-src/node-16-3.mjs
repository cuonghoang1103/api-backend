/**
 * node-16-3 — Node.js · Chapter 16 · Lesson 16.3 "Compression, and the setting that is 148× slower" (slide EN, đợt 11 — 08/11/2026).
 * MỘT deck, MỘT tập node-16-3.
 * Nguồn: nodejs-16-3-nen-va-duong-truyen. Output THẬT: that/c16/compress (JSON ĐA DẠNG 145.119 B, 500 ghi chú sinh có hạt giống), that/c16/compress-rep (JSON LẶP 74.795 B),
 *   that/c16/keepalive (loopback), that/c16/prod-compress (curl GET công khai cuongthai.com + grep mã nguồn website). Node 22, compression 1.8.2, autocannon -c 20 -d 5, trung vị 5.
 * BỔ SUNG ngoài bài web: hai bộ dữ liệu cho hai kết luận về brotli 11 · website THẬT SỰ nén trong Node (compression: gzip level 6, brotli q4) — bài web ghi "nén ở nginx" là sai.
 * Khác web: dữ liệu đa dạng ⇒ tỉ lệ 4,3–6,7× (web 20–52×, dữ liệu lặp) · gzip 1 −28,5 %, gzip mặc định −69,5 % (web −18 / −20 %) · brotli 4 −36,2 % (web −46 %) ·
 *   keep-alive tuần tự 2,6× (web 9,4×).
 */
import { lamDeck, two, box, cards, flow, bang, J, T, TT, thanh, dong, steps } from './_c9-chung.mjs';
import { ra } from './_node-chung.mjs';

export const deck = { key: 'node-16-3', code: 'NODE 16.3', title: 'Compression, and the setting that is 148× slower', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const C = (re) => dong('c16/compress', re);
const row = (name) => { const l = C(new RegExp(`^${name}\\s`)); return { b: num(l, /\s([\d,]+) B/), ms: num(l, /([\d.]+) ms each/) }; };
const G1 = row('gzip level 1'), G6 = row('gzip level 6'), G9 = row('gzip level 9'), B4 = row('brotli quality 4'), B11 = row('brotli quality 11');
const live = (name) => { const l = C(new RegExp(`^${name}\\s+(gzip|br)`)); return num(l, /(?:gzip, br|gzip|br)\s+([\d,]+)/); };
const L = { none: live('none'), g1: live('gzip level 1'), g6: live('gzip default'), b4: live('brotli q4'), b11: live('brotli q11') };
const pct = (v) => `−${((1 - v / L.none) * 100).toFixed(1)}%`;
const f = (n) => n.toLocaleString('en-US');
const KA = dong('c16/keepalive', /^agent: false \(a NEW/), KG = dong('c16/keepalive', /^http\.globalAgent \(/);
const KAms = num(KA, /\s(\d+) ms/), KGms = num(KG, /\s(\d+) ms/);

export const slides = lamDeck({ chuong: 'Chapter 16 — Performance', bai: '16.3' }, [
  { cover: true, t: 'Compression, and the setting<br>that is 148× slower', sub: 'The rare optimisation that trades one resource for another out in the open: CPU for bandwidth. It has a default that is fine — and an "obviously better" setting that is a disaster.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The raw trade: every level of gzip and brotli, size against CPU time</li>
<li>Why the answer about "maximum quality" depends on the shape of your data</li>
<li>What compression does to a live server's throughput</li>
<li>Where compression should happen — and where this website really does it</li>
<li>The other bandwidth lever: keep-alive, and a benchmark that lies</li>
</ul>` + box('Why it matters to you', 'One line of middleware decides whether your API spends a quarter or two thirds of its CPU on compression. It is worth knowing which.', 'lam') },

  { t: 'The raw trade', to: true, giua: true, body: TT('c16/compress', 1, 12, 'node compress.mjs · one 145 KB JSON response (500 varied notes) · zlib in Node 22 · real', { hl: [3, 10], n: 104, sm: false }) +
    box('Ratio and cost move in opposite directions', 'From gzip 1 to brotli 11 the file shrinks from 33,500 to 21,734 bytes — and each compression goes from 0.57 ms to 147.79 ms.', 'lam') },

  { t: 'Reading that table', to: true, giua: true, body: cards([
    ['gzip 9 is the worst gzip', `${f(G9.b)} B vs ${f(G6.b)} B at level 6 — 0.7% smaller for ${(G9.ms / G6.ms).toFixed(1)}× the time.`],
    ['brotli 11 is smaller — at a price', `${f(B11.b)} B, ${Math.round((1 - B11.b / B4.b) * 100)}% smaller than quality 4, for ${Math.round(B11.ms / B4.ms)}× the time: ${B11.ms} ms per response.`],
    ['Decompression is nearly free', '0.15 ms gzip, 0.20 ms brotli: the client never decides this. The SERVER pays.'],
  ], 3) + thanh([['gzip 1', G1.ms, NODE, `${G1.ms} ms`], ['gzip 6', G6.ms, CAM, `${G6.ms} ms`], ['brotli 4', B4.ms, NODE, `${B4.ms} ms`], ['brotli 11', B11.ms, DO, `${B11.ms} ms`]], { w: 1100, x0: 160, wMax: 650, h0: 40, chu: 20, ghi: 'CPU time per response · real' }) },

  { t: 'Same test, repetitive data: brotli 11 gets BIGGER', to: true, giua: true, body: TT('c16/compress-rep', 1, 10, 'node compress-rep.mjs · 75 KB JSON where every excerpt is identical · real', { hl: [6, 9, 10], n: 104, sm: false }) +
    two(box('The web lesson\'s finding reproduces here', 'On highly repetitive data, quality 11 searches harder and settles on a worse result: 8% bigger, 984× slower.', 'do2'),
      box('So "higher is better" is not even a safe guess', 'On varied data it is smaller and 148× slower; on repetitive data it is bigger AND 984× slower. Measure YOUR responses.', 'cam')) },

  { t: 'What it does to a live server', to: true, giua: true, body: TT('c16/compress', 14, 20, 'same route, same 145 KB body · autocannon -c 20 -d 5 · median of 5 · real', { hl: [4, 5, 7], n: 104, sm: false }) +
    thanh([['none', L.none, LAM, `${f(L.none)} req/s`], ['gzip 1', L.g1, NODE, `${f(L.g1)} (${pct(L.g1)})`], ['brotli 4', L.b4, NODE, `${f(L.b4)} (${pct(L.b4)})`], ['gzip default (6)', L.g6, CAM, `${f(L.g6)} (${pct(L.g6)})`], ['brotli 11', L.b11, DO, `${f(L.b11)} req/s`]], { w: 1100, x0: 230, wMax: 600, h0: 40, chu: 20, ghi: 'throughput · real' }) },

  { t: 'Bytes against CPU: is the trade worth it?', to: true, giua: true, body: bang(['mode', 'bytes on the wire', 'at 10 Mbit/s (arithmetic)', 'throughput cost'], [
    ['none', '145,361 B', '116 ms', '—'],
    ['gzip level 1', '33,828 B', '27 ms', pct(L.g1)],
    ['brotli quality 4', '31,581 B', '25 ms', pct(L.b4)],
    ['gzip level 6 (the default)', '26,883 B', '22 ms', pct(L.g6)],
    ['brotli quality 11', '22,046 B', '18 ms', `${f(L.b11)} req/s left`],
  ], { co: 22, hl: [1, 2] }) + two(box('For a phone on a slow network', 'gzip 1 or brotli 4 removes ~90 ms per response for a quarter to a third of your CPU. Usually worth it.', 'xanh'),
    box('Going from level 1 to the default', 'buys 5 ms more on the wire and costs MORE than half the remaining throughput. Rarely worth it.', 'do2')) },

  { t: 'A policy you can actually apply', to: true, giua: true, body: steps([
    '<b>Responses under 1 KB</b> — do not compress: the header and framing eat the gain',
    '<b>Dynamic JSON / HTML</b> — gzip level 1 or brotli quality 4, and do not turn the dial higher',
    '<b>Static files (bundles, SVG)</b> — PRE-compress at build time at the highest setting; you pay once, not per request',
    '<b>Already compressed (jpg, png, mp4, zip)</b> — never again: CPU for ~0%',
    '<b>nginx or a CDN in front?</b> — let them do it, in C, with a cache, on CPU your Node process does not need',
  ]) + box('The disaster setting', 'BROTLI_PARAM_QUALITY: 11 is what you get by copying a static-asset build config into a dynamic API: 24 req/s, p50 728 ms.', 'do2') },

  { t: 'Where compression should happen', to: true, giua: true, body: flow([{ t: 'Node', s: 'compress per request', mau: CAM }, { t: 'nginx / CDN', s: 'compress in C, cache it', mau: NODE }, { t: 'client', s: 'decompress ~0.2 ms', mau: LAM }], { h: 120 }) +
    J(`# nginx — compress here instead of in Node
gzip on;
gzip_types application/json text/css application/javascript;
gzip_min_length 1024;
gzip_comp_level 4;          # NOT 9`, { sm: false, hl: [5] }) +
    box('nginx does not compress twice', 'If the response already has Content-Encoding (because Node compressed it), nginx passes it through. So "nginx has gzip on" says nothing about who actually compressed your JSON.', 'cam') },

  { t: 'What this website really does', to: true, giua: true, body: two(
    TT('c16/prod-compress', 1, 11, 'curl · one public GET to cuongthai.com · real', { hl: [7, 10, 16], n: 64, sm: true }),
    TT('c16/prod-compress', 14, 22, 'grep in the website source · real', { hl: [3, 8, 10], n: 64, sm: true })) +
    box('Node compresses, not nginx', 'The compression middleware answers br (quality 4, the library default) to browsers and gzip LEVEL 6 to gzip-only clients. 1,608,415 B → 183,673 B. nginx\'s own gzip never touches API JSON.', 'do2') },

  { t: 'What that means, in measured terms', to: true, giua: true, body: cards([
    ['Browsers: the right setting', `brotli quality 4 — ${pct(L.b4)} in our live test. A reasonable trade.`],
    ['gzip-only clients: the expensive one', `gzip level 6 — ${pct(L.g6)} in our live test on varied JSON.`],
    ['A 1.6 MB response', 'is the bigger lesson: compression hides a payload problem. Send less first (16.1 step 4).'],
  ], 3) + bang(['client sends', 'server answers', 'bytes for this response'], [
    ['Accept-Encoding: identity', 'no compression', '1,608,415 B'],
    ['Accept-Encoding: gzip', 'gzip level 6', '205,753 B'],
    ['Accept-Encoding: gzip, br', 'brotli quality 4', '183,673 B'],
  ], { co: 22, hl: [1] }) + box('Two cheap improvements, not applied here', 'level: 1 instead of 6, or let nginx compress (gzip_comp_level 4) and remove the middleware. Measure before changing — this lesson only reports what is there.', 'lam') },

  { t: 'A real trap: compression and streaming', to: true, giua: true, body: two(box('What breaks', 'A compression middleware buffers output to decide whether it is worth compressing — so Server-Sent Events and progressive responses arrive all at once, at the end.', 'do2'),
    box('Symptom', 'SSE works locally, then silently stops streaming behind the proxy or after the middleware is added.', 'cam')) +
    J(`app.use(compression({
  filter: (req, res) => req.headers.accept !== 'text/event-stream' && compression.filter(req, res),
}));
// or, inside a streaming route, after each chunk:
res.write(chunk); res.flush();     // flush() is added by the compression middleware`, { sm: false, hl: [2, 5] }) +
    flow([{ t: 'res.write()', s: 'chunk 1, 2, 3…', mau: LAM }, { t: 'compression buffer', s: 'waits for enough bytes', mau: DO }, { t: 'client', s: 'sees nothing until the end', mau: CAM }], { h: 110 }) },

  { t: 'The other lever: keep-alive', to: true, giua: true, body: TT('c16/keepalive', 1, 6, 'node keepalive.mjs · 500 sequential calls to a local server · real', { hl: [3, 6], n: 104, sm: false }) +
    two(box(`${(KAms / KGms).toFixed(1)}× from reusing the connection`, `${KAms} ms with a new TCP connection per call vs ${KGms} ms reused. On loopback a handshake is cheap; over a real network with TLS it is tens to hundreds of ms.`, 'xanh'),
      box('Node 22 already does the right thing', 'globalAgent.keepAlive is true by default and fetch() pools connections. The mistake now is code that sets agent: false, or an old HTTP library.', 'lam')) },

  { t: 'A benchmark that lies: maxSockets', to: true, giua: true, body: TT('c16/keepalive', 8, 11, 'node keepalive.mjs · 500 calls, 20 in parallel · loopback · real', { hl: [4], n: 104, sm: false }) +
    two(box('2 sockets beat 20', 'On loopback the upstream answers instantly, so twenty sockets only add scheduling overhead.', 'cam'),
      box('Over a real network the ranking reverses', 'With 50 ms of latency, 2 sockets means 2 calls in flight: a queue. Benchmarks on 127.0.0.1 answer a different question than production does.', 'do2')) +
    box('Same lesson as 16.2', 'Measure where you will run. Connection concurrency is where that difference bites hardest.', 'lam') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your API returns 40 KB JSON lists to a mobile app, behind nginx. A teammate adds compression({ level: 9 }) to Express "for smaller responses", and another sets brotli quality 11 "because it is the best". (1) What happens to throughput? (2) Where should compression happen instead? (3) A dashboard route uses SSE and stops updating. Why?', '') +
    box('Hint', 'Slides 4, 5, 6, 9 and 12.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) Level 9 is ~1.5× the CPU of level 6 for ~1% fewer bytes; brotli 11 took the live server from 3,560 to 24 req/s. (2) At nginx (gzip_comp_level 4) or the CDN — remove the middleware, or use level 1 / brotli 4. (3) The middleware buffers the stream: exclude text/event-stream in filter, or res.flush() after each write.', 'xanh')}</div>` },

  { t: 'Lesson 16.3 in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['brotli 11 vs 4 (varied)', `${Math.round((1 - B11.b / B4.b) * 100)}% smaller, ${Math.round(B11.ms / B4.ms)}× slower`, 'never per request'],
    ['brotli 11 vs 4 (repetitive)', '8% BIGGER, 984× slower', 'measure your data'],
    ['live server', `gzip 1 ${pct(L.g1)} · br 4 ${pct(L.b4)} · gzip 6 ${pct(L.g6)}`, 'low levels for dynamic data'],
    ['this website', 'Node compresses: br 4 / gzip 6', 'know who compresses'],
    ['keep-alive', `${(KAms / KGms).toFixed(1)}× on loopback`, 'on by default in Node 22'],
  ], { co: 22 }) + box('Next: 16.4 — cluster, and the route it does not help', 'Scaling across cores, measured on a CPU route and an I/O route.', 'lam') },
]);
