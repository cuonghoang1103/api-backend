/**
 * nfd-10-1 — Networking for Developers, bài 10.1 "Cân bằng tải L4 và L7" (slug netdev-10-1-l4-l7). Bài MỞ CHƯƠNG 10.
 * Output = CHẠY THẬT đọc bằng ra() (lab/out/c101-*.out.txt) — nginx L7 (thêm X-Forwarded-For) vs socat L4 (chuyển byte).
 */
import { lamDeck, sh, box, kw, bang, steps, ra } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-10-1', code: 'NFD 10.1', title: 'L4 vs L7 load balancing', sub: 'Networking for Developers · Chapter 10' };
const term = (t, o = {}) => sh(t, o);

export const slides = lamDeck({ chuong: 'Chapter 10 — Load balancing', bai: '10.1' }, [
  { cover: true, t: 'L4 vs L7 load balancing', sub: 'One address, many servers —<br>forwarding connections vs understanding HTTP', nhan: 'Chapter 10 · Lesson 10.1' },

  { t: 'What you will be able to do after Chapter 10', to: true, giua: true, body: `
<ul>
<li><b>Tell L4 from L7</b> load balancing — forwarding a connection vs understanding the request</li>
<li><b>Choose an algorithm</b>: round robin, least connections, consistent hashing — and health-check backends</li>
<li><b>Place proxies</b>: reverse proxy, forward proxy, and tunnels (SSH, Cloudflare Tunnel)</li>
<li><b>Read gateway errors</b> correctly: who emits <b>502 / 503 / 504 / 524</b> and what each means</li>
<li>Know where <b>TLS terminates</b> and why the real client IP needs <code class="i">X-Forwarded-For</code></li>
</ul>` },

  { t: 'One address, many servers', giua: true, body: `
${box('', 'A single public address cannot be one machine forever — it would run out of CPU, and one crash would take the site down. A <b>load balancer</b> sits in front, spreads requests across a pool of identical backends, and removes a sick one. The client sees one address; behind it are many servers.', 'lam')}
${steps([
    'Scale <b>horizontally</b>: add backends instead of a bigger box',
    'Survive a backend crash: the LB stops sending it traffic',
    'Deploy without downtime: drain one backend, update it, return it',
  ])}` },

  { t: 'L7 understands HTTP; L4 just forwards', body: `
${term(ra('c101-l4l7', 'curl', 2), { sm: true, title: 'through L7 (nginx :8080) vs L4 (socat :9090)' })}
${box('', 'The <b>L7</b> proxy (nginx) parses the HTTP request, so it adds <code class="i">X-Forwarded-For</code> with the real client IP, can route by path/host, retry a 5xx, and cache. The <b>L4</b> proxy (socat) only forwards TCP bytes — no header, <code class="i">forwardedFor: null</code>, and the backend sees the proxy’s IP. L7 = smart but parses; L4 = dumb but fast.', 'lam')}` },

  { t: 'Round robin across the pool', body: `
${term(ra('c101-rr', 'for i', 1), { sm: true, title: 'six requests, three backends — be1, be2, be3, repeat' })}
${box('', 'The same URL returns a different backend each time: nginx is spreading requests <b>round robin</b> across the pool. The client never knows; it sees one address. (The backend id here is a lab echo — in production you read it from a response header or a trace.)', 'xanh')}` },

  { t: 'Where does TLS terminate?', giua: true, body: `
${bang(['Termination', 'Means'], [
    ['<b>TLS terminates at the LB</b> (L7)', 'the LB decrypts, reads HTTP, re-encrypts (or talks HTTP) to the backend'],
    ['<b>TLS passthrough</b> (L4)', 'the LB forwards encrypted bytes; only the backend has the certificate'],
  ], { fs: 20 })}
${box('', 'An L7 LB must hold the certificate to read HTTP — the common setup (TLS ends at the edge, HTTP inside the trusted network). An L4 LB can pass TLS straight through without decrypting, at the cost of not seeing the request. This is the single biggest L4-vs-L7 design choice.', 'lam')}` },

  { t: 'The tools you will meet', giua: true, body: `
${bang(['Tool', 'Typical role'], [
    ['<b>nginx</b>', 'L7 reverse proxy + load balancer (what the lab uses)'],
    ['<b>HAProxy</b>', 'L4 and L7, famous for load balancing and health checks'],
    ['<b>Envoy</b>', 'L7 proxy for service meshes, rich routing/observability'],
    ['<b>Cloud LB</b>', 'AWS ALB (L7) / NLB (L4), GCP, Azure — managed'],
  ], { fs: 19 })}
${box('', 'They differ in features, not in the core idea. Pick L7 when you need to route or inspect HTTP; L4 when you just need to spread raw connections fast (or pass TLS through untouched).', 'lam')}` },

  { t: 'L4 or L7?', giua: true, body: `
${bang(['Use L4 when…', 'Use L7 when…'], [
    ['raw speed, any TCP/UDP protocol', 'you route by path / host / header'],
    ['TLS passthrough (backend holds the cert)', 'you add X-Forwarded-For, retry 5xx, cache'],
    ['the LB must not see the payload', 'you terminate TLS at the edge'],
  ], { fs: 19 })}
${box('', 'Many stacks use <b>both</b>: an L4 LB spreading connections to a tier of L7 proxies that then route HTTP. The question is never "which is better" but "what does this layer need to <b>see</b>?"', 'lam')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A <b>load balancer</b> puts one address in front of many identical backends — scale, survive crashes, deploy without downtime</li>
<li><b>L7</b> parses HTTP: adds <code class="i">X-Forwarded-For</code>, routes by path/host, retries, caches — but must hold the TLS cert</li>
<li><b>L4</b> just forwards TCP/UDP bytes: faster, protocol-agnostic, can pass TLS through — but sees nothing</li>
<li><b>Round robin</b> spreads requests across the pool; the client sees one address</li>
<li>nginx / HAProxy / Envoy / cloud LBs differ in features, not in the core idea — ask what the layer must <b>see</b></li>
</ul>
<p style="margin:0">${kw('L4 / L7', 'tầng 4 / tầng 7')} ${kw('reverse proxy', 'proxy ngược')} ${kw('round robin', 'xoay vòng')} ${kw('X-Forwarded-For', 'IP client thật')} ${kw('TLS termination', 'kết thúc TLS')}</p>` },
]);
