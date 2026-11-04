/**
 * nfd-lab-7 — Networking for Developers, Lab chương 7 "Mổ xẻ ngăn xếp HTTP của LabFlow" (slug netdev-7-6-lab-http-labflow).
 * Đề + yêu cầu + thang điểm (không lộ lời giải). Khuôn _nfd-chung.mjs.
 */
import { lamDeck, box, cards, steps, bang, kw } from './_nfd-chung.mjs';

export const deck = { key: 'nfd-lab-7', code: 'NFD LAB 7', title: 'Lab 7 — Dissecting LabFlow’s HTTP stack', sub: 'Networking for Developers · Chapter 7' };

export const slides = lamDeck({ chuong: 'Chapter 7 — Lab 7' }, [
  { cover: true, t: 'Lab 7 — Dissecting<br>LabFlow’s HTTP stack', sub: 'Read 1.1 by hand, prove h2 multiplexing, confirm h3,<br>tune the headers, find the real client IP', nhan: 'Chapter 7 · Lab' },

  { t: 'The situation', to: true, giua: true, body: `
${cards([
    ['The audit', 'Prove LabFlow serves <b>h1, h2 and h3</b> correctly, with caching, compression and security headers set.'],
    ['The 429', 'A rate limiter banned everyone during a spike; the audit log shows one IP. Find out why.'],
    ['The tune', 'Make the site faster: caching, compression, one HTTP/2 connection — measured, not guessed.'],
  ])}
${box('Deliverable', 'A one-page report: a hand-read HTTP/1.1 message, HTTP/2 multiplexing by stream ID, the HTTP/3 server fingerprint, the caching/compression/CORS/security headers, and the real-client-IP fix. Part 7 of the course project.', 'do2')}
<p style="margin:0">Time: 2–3 hours · Tools: nc, curl -v/-I, tshark + SSLKEYLOGFILE, ss, nginx h2/h3</p>` },

  { t: 'The system: nginx across versions + a proxy chain', giua: true, body: `
${box('', `<pre class="mono" style="font-size:18px;line-height:1.5;white-space:pre-wrap">docker exec nfd-web nginx -c /lab/k/code/ch07/h7.conf       # TLS + h2 + h3 on :8443 (gzip, HSTS, CORS, ETag)
docker exec -d nfd-api  node /lab/k/code/ch07/chunk-srv.mjs # chunked streaming on :4100
docker exec -d nfd-api  nginx -c /lab/k/code/ch07/proxy-api.conf   # proxy hop 2 (:8091)
docker exec -d nfd-web  nginx -c /lab/k/code/ch07/proxy-web.conf   # proxy hop 1 (:8090)</pre>`, 'lam')}
<p style="margin:0;font-size:20px">base nginx :80 (h1 + X-Forwarded-For) · TLS :8443 (h2/h3 + headers) · two-hop proxy for the XFF chain</p>` },

  { t: 'Requirements', to: true, body: `
${steps([
    '<b>R1 HTTP/1.1</b> — type a request with <code class="i">nc</code>; label the message; show keep-alive and a chunked response',
    '<b>R2 HTTP/2</b> — negotiate h2 (ALPN); prove multiplexing by stream IDs 1, 3, 5 on one connection',
    '<b>R3 HTTP/3</b> — show the UDP + TCP listeners and the <code class="i">Alt-Svc</code> upgrade header',
    '<b>R4 Headers</b> — ETag → 304, gzip Content-Encoding, HSTS; explain each',
    '<b>R5 CORS</b> — the preflight OPTIONS and the Access-Control-Allow-* response',
    '<b>R6 Real client IP</b> — one proxy vs two; read the XFF chain; diagnose and fix the 429',
  ])}` },

  { t: 'Report template', giua: true, body: `
${box('', `<pre class="mono" style="font-size:18px;line-height:1.5;white-space:pre-wrap">## R1 HTTP/1.1   — labelled message; keep-alive; chunked
## R2 HTTP/2     — ALPN h2; stream IDs 1,3,5 on one connection
## R3 HTTP/3     — UDP+TCP listeners; Alt-Svc header
## R4 Headers    — ETag→304; Content-Encoding gzip; HSTS
## R5 CORS       — preflight OPTIONS; Access-Control-Allow-*
## R6 Client IP  — seenFrom vs XFF; the 429 cause and fix</pre>`, 'lam')}
${steps([
    'Keep every command and its output — the audit wants <b>evidence</b>, not claims',
    'For each header, say <b>who enforces it</b> (client cache, server, or browser)',
    'The 429 fix must name <code class="i">trust proxy</code> / <code class="i">CF-Connecting-IP</code> and how you tested it',
  ])}` },

  { t: 'Rubric — 10 points', giua: true, body: `
${bang(['Item', 'Pts', 'Full marks when'], [
    ['R1', '1.5', 'hand-typed request; message parts labelled; keep-alive + chunked shown'],
    ['R2', '1.5', 'h2 negotiated via ALPN; streams 1,3,5 on one connection'],
    ['R3', '1.5', 'UDP + TCP listeners; Alt-Svc; the h1→h2→h3 upgrade explained'],
    ['R4', '1.5', 'a 304 from an ETag; gzip measured; HSTS present'],
    ['R5', '2', 'preflight OPTIONS + Allow-* ; CORS is a browser rule, fixed on the server'],
    ['R6', '2', 'XFF chain read; the 429 attributed to the wrong IP; trust-proxy fix'],
  ], { fs: 18 })}` },

  { t: 'Hints by level', to: true, giua: true, body: `
${steps([
    'R1: <code class="i">printf \'GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n\' | nc 10.10.2.10 80</code>',
    'R2: capture with <code class="i">SSLKEYLOGFILE</code>, decrypt with <code class="i">tshark -o tls.keylog_file:… -Y http2.type==1</code>',
    'R4: <code class="i">curl -I</code> for ETag, then <code class="i">-H If-None-Match</code>; <code class="i">--compressed</code> for gzip',
    'R6: <code class="i">curl /api/who</code> through one proxy, then <code class="i">:8090</code> for two — read forwardedFor',
  ])}` },

  { t: 'Going further', to: true, giua: true, body: `
${cards([
    ['Measure', 'Compare a page over h1 vs h2 (many small assets) and explain the difference.'],
    ['Harden', 'Add CSP and a stricter Cache-Control policy; verify with curl -I.'],
    ['Capstone', 'The whole HTTP stack returns in the Chapter 13 request-path project — keep your header checklist.'],
  ])}` },

  { t: 'What this lab proves', to: true, giua: true, body: `
<ul>
<li>You can <b>read HTTP across all three versions</b> and tell which one you got</li>
<li>You can <b>verify the headers</b> that control caching, compression and security</li>
<li>You can <b>diagnose a CORS error</b> and know it is fixed on the server</li>
<li>You can <b>recover the real client IP</b> through a proxy chain and fix a rate-limit outage</li>
</ul>
<p style="margin:0">${kw('HTTP/1.1→3', 'ba phiên bản')} ${kw('multiplexing', 'ghép kênh')} ${kw('headers', 'tiêu đề')} ${kw('CORS', 'nguồn chéo')} ${kw('X-Forwarded-For', 'IP thật')}</p>` },
]);
