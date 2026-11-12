/**
 * ngx-00-1 — Nginx · Section 0 · Lesson 0.1 "What Nginx solves that your application cannot" (deck video + web, 12/11/2026). Bài web: nginx-0-1-bai-toan.
 * Output THẬT (scratchpad/ngx/demo/n0-1.txt; ngx-lab 4 CPU, nginx/1.24.0 worker_processes 2 · Node 18.19 của Ubuntu 24.04): cùng tệp 2 MB —
 * ab 40 req c=1: nginx 0,018 s · node 0,179 s; 200 req c=50: 0,062 s · 0,332 s; RSS nginx 1,5+3,4+3,4 MB · node 92,0 MB; vòng curl 40 lần
 * 0,274 s · 0,812 s; proxy KHÔNG miễn phí: ab trực tiếp 0,184 ms/req · qua nginx 0,287 ms/req. (Số bài web gốc 364/474 ms đo bằng vòng curl, Node 22.)
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n0-1:file:/tmp/ng/node-static.mjs": "// Máy chủ tệp tĩnh tối giản bằng Node: đọc tệp từ đĩa và stream ra — đúng việc nginx làm ở cổng 8080.\nimport http from 'node:http';\nimport fs from 'node:fs';\nhttp.createServer((req, res) => {\n  const p = '/tmp/ng/www' + req.url;\n  fs.stat(p, (err, st) => {\n    if (err) { res.statusCode = 404; return res.end('not found\\n'); }\n    res.writeHead(200, { 'Content-Length': st.size, 'Content-Type': 'application/octet-stream' });\n    fs.createReadStream(p).pipe(res);\n  });\n}).listen(8081, '127.0.0.1');\n",
 "n0-1:file:/tmp/ng/conf/nginx.conf": "worker_processes 2;\npid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents { worker_connections 1024; }\nhttp {\n  access_log off;\n  sendfile on;\n  server {\n    listen 8080;\n    root /tmp/ng/www;\n  }\n}\n",
 "n0-1:setup": "",
 "n0-1:kiem": "$ ls -l /tmp/ng/www/big.bin\n-rw-r--r-- 1 root root 2097152 Nov 12 10:57 /tmp/ng/www/big.bin\n$ curl -s -o /dev/null -w '%{http_code} %{size_download} bytes\\n' http://127.0.0.1:8080/big.bin\n200 2097152 bytes\n$ curl -s -o /dev/null -w '%{http_code} %{size_download} bytes\\n' http://127.0.0.1:8081/big.bin\n200 2097152 bytes",
 "n0-1:tuantu": "$ ab -q -n 40 -c 1 http://127.0.0.1:8080/big.bin | grep -E 'Time taken|Requests per|Failed'\nTime taken for tests:   0.018 seconds\nFailed requests:        0\nRequests per second:    2205.56 [#/sec] (mean)\n$ ab -q -n 40 -c 1 http://127.0.0.1:8081/big.bin | grep -E 'Time taken|Requests per|Failed'\nTime taken for tests:   0.179 seconds\nFailed requests:        0\nRequests per second:    223.64 [#/sec] (mean)",
 "n0-1:songsong": "$ ab -q -n 200 -c 50 http://127.0.0.1:8080/big.bin | grep -E 'Time taken|Requests per|Failed'\nTime taken for tests:   0.062 seconds\nFailed requests:        0\nRequests per second:    3243.28 [#/sec] (mean)\n$ ab -q -n 200 -c 50 http://127.0.0.1:8081/big.bin | grep -E 'Time taken|Requests per|Failed'\nTime taken for tests:   0.332 seconds\nFailed requests:        0\nRequests per second:    602.87 [#/sec] (mean)",
 "n0-1:bonho": "$ ps -eo rss,args | grep -E '[n]ginx|[n]ode-static' | awk '{printf \"%7.1f MB  \", $1/1024; $1=\"\"; print}'\n    1.5 MB   nginx: master process nginx -c /tmp/ng/conf/nginx.conf\n    3.4 MB   nginx: worker process\n    3.4 MB   nginx: worker process\n   92.0 MB   node /tmp/ng/node-static.mjs",
 "n0-1:curlvong": "$ time (for i in $(seq 40); do curl -s -o /dev/null http://127.0.0.1:8080/big.bin; done)\n\nreal\t0m0.274s\nuser\t0m0.086s\nsys\t0m0.168s\n$ time (for i in $(seq 40); do curl -s -o /dev/null http://127.0.0.1:8081/big.bin; done)\n\nreal\t0m0.812s\nuser\t0m0.090s\nsys\t0m0.227s",
 "n0-1:lap": "$ for c in 1 50; do for p in 8080 8081; do echo \"c=$c cong $p: $(ab -q -n 200 -c $c http://127.0.0.1:$p/big.bin | grep 'Time taken' | awk '{print $5*1000 \" ms\"}')\"; done; done\nc=1 cong 8080: 153 ms\nc=1 cong 8081: 1682 ms\nc=50 cong 8080: 85 ms\nc=50 cong 8081: 545 ms\n$ for c in 1 50; do for p in 8080 8081; do echo \"c=$c cong $p: $(ab -q -n 200 -c $c http://127.0.0.1:$p/big.bin | grep 'Time taken' | awk '{print $5*1000 \" ms\"}')\"; done; done\nc=1 cong 8080: 157 ms\nc=1 cong 8081: 940 ms\nc=50 cong 8080: 65 ms\nc=50 cong 8081: 320 ms",
 "n0-1:file:/root/app.js": "// ứng dụng nhỏ của bạn: nghe 127.0.0.1:3000, trả lại vài thông tin của request nó nhận được\nrequire('http').createServer((req, res) => {\n  res.setHeader('Content-Type', 'application/json');\n  res.end(JSON.stringify({ app: 'node:3000', url: req.url, host: req.headers.host, ip: req.socket.remoteAddress }) + '\\n');\n}).listen(3000, '127.0.0.1');\n",
 "n0-1:file:/tmp/ng/conf/proxy.conf": "pid       /tmp/ng/logs/proxy.pid;\nerror_log /tmp/ng/logs/proxy-error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8082;\n    location / { proxy_pass http://127.0.0.1:3000; }\n  }\n}\n",
 "n0-1:proxy": "$ ab -q -n 2000 -c 1 http://127.0.0.1:3000/api | grep -E 'Time per request.*\\(mean\\)$'\nTime per request:       0.184 [ms] (mean)\n$ ab -q -n 2000 -c 1 http://127.0.0.1:8082/api | grep -E 'Time per request.*\\(mean\\)$'\nTime per request:       0.287 [ms] (mean)"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, js, tn, meter, hub, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-00-1', code: 'NGX 0.1', title: 'What Nginx solves that your application cannot', sub: 'Section 0 · Lesson 0.1' };
const O = (k) => { const v = DU_LIEU[`n0-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const gon = (s) => s.replace(/ \| grep -E '[^']*'/g, '').replace(/ \| awk .*$/m, ' | awk …');

export const S = [
  { cover: true, nhan: 'Section 0 · Lesson 0.1', t: 'What Nginx solves<br>that your application cannot', sub: 'Your app already speaks HTTP. The honest question is what Nginx does BETTER — measured on one machine',
    en: 'Lesson 0.1. Your Node or Python app already speaks HTTP, serves files and listens on a port. So the honest question is not what Nginx does, but what it does better — and we measure it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The same 2 MB file served by Nginx and by Node — measured three ways</li>
    <li>Why memory, not speed, decides the architecture</li>
    <li>Why a proxy makes ONE request slower — and why that is a good trade</li>
    <li>The four jobs Nginx is actually for</li>
    <li>When you do not need to run one yourself</li></ul>`,
    en: 'Five takeaways: one file served by Nginx and by Node, measured; memory as the deciding number; the cost of the extra hop; the four jobs Nginx is for; and when you do not need one.' },
  { t: 'One file, two servers, same machine', body: js(O('file:/tmp/ng/node-static.mjs').split('\n').slice(1).join('\n'), { sm: true }) + two(
      ngc(`worker_processes 2;\nhttp {\n  sendfile on;\n  server {\n    listen 8080;\n    root /tmp/ng/www;\n  }\n}`, { sm: true, hl: [3] }),
      tn(gon(O('kiem')).replace(/http:\/\/127\.0\.0\.1/g, ''), { fs: 13, wrap: 54 })),
    en: 'The setup: a 2 MB file, served on port 8081 by a minimal Node server that streams it from disk, and on port 8080 by Nginx with two workers and sendfile. Both return the same 2,097,152 bytes.' },
  { t: 'Measured: forty requests, then two hundred at once', body: meter([
      ['40 requests, 1 at a time — nginx', 18], ['40 requests, 1 at a time — node', 179, '#ca8a04'],
      ['200 requests, 50 at once — nginx', 62], ['200 requests, 50 at once — node', 332, '#ca8a04']], { don: 'ms', rh: 46, fs: 19, nhan: 400 }) +
    tn((gon(O('tuantu')) + '\n' + gon(O('songsong'))).split('\n').filter((l) => !/^(Failed|Requests per)/.test(l)).join('\n'), { fs: 15 }),
    en: 'Measured with ApacheBench. Forty requests one at a time: 18 milliseconds for Nginx, 179 for Node. Two hundred requests, fifty at a time: 62 against 332. On this machine Nginx serves the file several times faster in both cases.' },
  { t: 'How you measure changes the story', body: tn(O('curlvong'), { fs: 15 }) + two(
      box('A loop of curl measures curl too', 'Forty curl processes start and stop: 274 ms against 812 ms. The original lesson, measured this way on another machine with Node 22, saw only a 30 % gap (364 vs 474 ms).', 'lam'),
      box('Numbers move between runs', 'Repeating the 200-request test gave Node 940 ms once and 1,682 ms another time. Compare ratios, and repeat before you believe one number.', 'do2')),
    en: 'A shell loop of curl also measures starting curl forty times: here 274 versus 812 milliseconds. The original lesson measured this way on another machine and saw only a thirty percent gap. Numbers move between runs, so compare ratios and repeat.' },
  { t: 'Memory is the number that decides the architecture', body: meter([
      ['nginx: master', 1.5], ['nginx: worker', 3.4], ['nginx: worker', 3.4], ['node (one process)', 92.0, '#ca8a04']], { don: 'MB', rh: 54, fs: 20, nhan: 330 }) +
    tn(O('bonho'), { fs: 15 }) +
    box('8.3 MB for all of Nginx — 92 MB for one Node process that only reads a file', 'You can run Nginx beside anything, on the smallest machine you have, and forget it is there. A real app also renders, queries and runs your logic on that same event loop.', 'xanh'),
    en: 'Resident memory during the run: 1.5 megabytes for the master and 3.4 for each worker — 8.3 in total — against 92 for one Node process that does nothing but read a file. That is why it is reasonable to put Nginx in front of everything.' },
  { t: 'A proxy makes one request SLOWER', body: meter([['app directly, :3000', 0.184, '#2563eb'], ['through nginx, :8082', 0.287]], { don: 'ms / request', rh: 60, fs: 21, nhan: 330 }) +
    tn(O('proxy'), { fs: 15 }) +
    box('Trap — "Nginx makes my app faster"', 'It does not. One more hop adds about a tenth of a millisecond here. What Nginx buys you is taking the slow, boring half of the work — thousands of slow connections, disk reads, TLS, junk requests — OFF your app. A trade, not magic.', 'do2'),
    en: 'The trap: Nginx does not make your app faster. Two thousand requests to a tiny API: 0.184 milliseconds each directly, 0.287 through Nginx. The extra hop always costs something. What you buy is the boring half of the work taken off your application.' },
  { t: 'What it is actually for', body: icards([
      ['plug', '1 · Reverse proxy', 'One public port, many private services — the main reason it is in most stacks (Chapter 3).'],
      ['key', '2 · TLS termination', 'Certificates in ONE place: one config and one renewal, not HTTPS in every app (Chapter 6).'],
      ['page', '3 · Static files', 'The measurement above: sendfile, ranges, conditional requests, cache headers — for free (Chapter 4).'],
      ['filter', '4 · Edge policies', 'Limits, compression, caching, redirects — rules that belong in front of your code (Chapters 5, 7–9).'],
    ], 2),
    en: 'Four jobs. Reverse proxy: one public port in front of many private services. TLS termination: certificates in one place. Static files: exactly the measurement we just did. And edge policies: limits, compression, caching and redirects that belong in front of your code.' },
  { t: 'Without Nginx, and with it', body: two(
      `<div>${box('Without: every app does everything', `<code>:3000 Node</code> — TLS? gzip? static files? rate limits? all hand-written<br><code>:4000 Python</code> — …and written again, in another language`, 'do2')}</div>`,
      hub('nginx\n:443', [['plug', '/api → :3000', 'Node'], ['plug', '/ai → :4000', 'Python'], ['page', '/static', 'served by nginx'], ['shield', 'TLS · limits', 'one place']], { w: 640, h: 330 }), '') +
    box('With Nginx', 'One place does the edge work, and each app only does its own job.', 'xanh'),
    en: 'Without Nginx, every application handles TLS, compression, static files and limits by itself, in every language you deploy. With Nginx in front, one place does that edge work, routes /api and /ai to the right app, and serves static files itself.' },
  { t: 'When you do NOT need to run it yourself', body: cmp(['Situation', 'Why', 'Still learn it?'], [
      ['A managed platform', 'Vercel, Railway, Fly, every Kubernetes Ingress already put a proxy in front of you', 'yes — it IS a proxy'],
      ['A CDN does the caching', 'static assets come from the CDN; the origin only answers API calls', 'read Ch 4–5 to understand it'],
      ['One service, low traffic', 'a 20-person internal tool does not need an edge tier', 'TLS may still be needed'],
    ]) + box('Learn it anyway', 'Every one of those is a proxy with a different configuration language. Nginx is the version you can run locally and whose source you can read.', 'lam'),
    en: 'When you do not need your own: a managed platform already has a proxy in front of you; a CDN already does the caching; or one small internal service with little traffic. Learn it anyway — each of those is a proxy too.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Reverse proxy', 'one public port in front of many internal services'),
      kw('TLS termination', 'HTTPS handled in ONE place instead of every app'),
      kw('Static file serving', 'bytes from disk with sendfile, ranges and cache headers'),
      kw('Edge policies', 'limits, compression, caching, redirects — in front of your code'),
      kw('Concurrency', 'serving many connections at the same time'),
      kw('Resident memory (RSS)', '8.3 MB for all of Nginx vs 92 MB for one Node process here'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: reverse proxy, TLS termination, static file serving, edge policies, concurrency, and resident memory — 8.3 megabytes for all of Nginx against 92 for one Node process in our run.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Serve one 2 MB file with ${c('node-static.mjs')} and with nginx`,
      `Run ${c('ab -n 40 -c 1')} and ${c('ab -n 200 -c 50')} against both`,
      `Read the memory of both with ${c('ps -eo rss,args')}`,
      `Put nginx in front of a tiny API and compare ${c('Time per request')}`,
    ]), box('Keep these', `<ul><li>Nginx serves files faster and with a fraction of the memory</li><li>How you measure changes the number</li><li>A proxy adds a hop — a trade, not magic</li><li>Four jobs: proxy, TLS, static, edge policy</li></ul>`, 'lam'), ''),
    en: 'Your turn: serve one file with both servers, measure sequential and concurrent load with ApacheBench, read the memory with ps, and put Nginx in front of a tiny API to see the cost of the hop.' },
];
export const slides = lamDeck({ chuong: 'Section 0 — The problem, and a build that runs', bai: '0.1' }, S);
